"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ==========================================================================
   About page, section 1: Who we are
   Flow: editorial split (text left, animated "eye" right), then a row of
   three pillars underneath. Same tokens, type scale and spacing as the rest.
   ========================================================================== */

const HEADING = "Who we are";

/* Pre-computed geometry for the eye (deterministic, safe for SSR) */
const point = (r: number, a: number) => ({
  x: +(200 + r * Math.cos(a)).toFixed(2),
  y: +(200 + r * Math.sin(a)).toFixed(2),
});

const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2;
  const long = i % 6 === 0;
  const from = point(long ? 156 : 166, a);
  const to = point(176, a);
  return { x1: from.x, y1: from.y, x2: to.x, y2: to.y, long };
});

const FIBERS = Array.from({ length: 36 }, (_, i) => {
  const a = (i / 36) * Math.PI * 2;
  const from = point(50, a);
  const to = point(96, a);
  return { x1: from.x, y1: from.y, x2: to.x, y2: to.y };
});

export default function WhoWeAre() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyeRef = useRef<SVGSVGElement>(null);
  const pupilRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const eye = eyeRef.current;
      const pupil = pupilRef.current;
      if (!section || !eye || !pupil) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------- Starting states ---------- */
        const draw = gsap.utils.toArray<SVGGeometryElement>(".eye-draw");
        draw.forEach((el) => {
          const length = el.getTotalLength();
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        });

        const fades = [
          ".eye-ring-outer",
          ".eye-ticks",
          ".eye-fibers",
          ".eye-scan",
          ".eye-glow",
          ".eye-hud",
        ];
        gsap.set(fades, { opacity: 0 });
        gsap.set(".eye-pupil-scale", { scale: 0, svgOrigin: "200 200" });

        /* ---------- Scroll-in sequence (plays once) ---------- */
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: ".who-grid",
              start: "top 80%",
              once: true,
            },
          })
          .from(
            ".who-word",
            {
              yPercent: 110,
              opacity: 0,
              rotateX: -25,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.07,
            },
            0.15,
          )
          .from(
            ".who-p",
            {
              y: 22,
              opacity: 0,
              filter: "blur(6px)",
              duration: 1,
              stagger: 0.14,
              clearProps: "filter",
            },
            0.6,
          )
          .to(
            draw,
            {
              strokeDashoffset: 0,
              duration: 1.4,
              stagger: 0.12,
              ease: "power2.inOut",
            },
            0.3,
          )
          .to(fades, { opacity: 1, duration: 1, stagger: 0.12 }, 0.8)
          .to(
            ".eye-pupil-scale",
            { scale: 1, duration: 1, ease: "back.out(1.8)" },
            1.3,
          );

        /* ---------- Idle motion ---------- */
        gsap.to(".eye-ring-outer", {
          rotation: 360,
          svgOrigin: "200 200",
          duration: 70,
          repeat: -1,
          ease: "none",
        });
        gsap.to(".eye-ticks", {
          rotation: -360,
          svgOrigin: "200 200",
          duration: 90,
          repeat: -1,
          ease: "none",
        });
        gsap.to(".eye-fibers", {
          rotation: 360,
          svgOrigin: "200 200",
          duration: 120,
          repeat: -1,
          ease: "none",
        });
        gsap.to(".eye-scan", {
          rotation: 360,
          svgOrigin: "200 200",
          duration: 8,
          repeat: -1,
          ease: "none",
        });
        gsap.to(".eye-rec", {
          opacity: 0.2,
          duration: 0.7,
          repeat: -1,
          yoyo: true,
          ease: "steps(1)",
        });

        // The eye blinks now and then
        const blink = gsap
          .timeline({ repeat: -1, repeatDelay: 4, delay: 5 })
          .to(".eye-pupil-scale", {
            scaleY: 0.08,
            duration: 0.09,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          });

        /* ---------- The pupil follows the cursor ---------- */
        const moveX = gsap.quickTo(pupil, "x", {
          duration: 0.6,
          ease: "power3.out",
        });
        const moveY = gsap.quickTo(pupil, "y", {
          duration: 0.6,
          ease: "power3.out",
        });

        const onMove = (event: PointerEvent) => {
          const rect = eye.getBoundingClientRect();
          const dx = event.clientX - (rect.left + rect.width / 2);
          const dy = event.clientY - (rect.top + rect.height / 2);
          const dist = Math.hypot(dx, dy) || 1;
          const reach = Math.min(dist / 400, 1) * 24;
          moveX((dx / dist) * reach);
          moveY((dy / dist) * reach);
        };

        const canHover = window.matchMedia("(hover: hover)").matches;
        let wander: gsap.core.Timeline | null = null;

        if (canHover) {
          window.addEventListener("pointermove", onMove, { passive: true });
        } else {
          // Touch screens: the pupil looks around on its own
          wander = gsap
            .timeline({ repeat: -1, defaults: { ease: "sine.inOut" } })
            .to(pupil, { x: -14, y: 6, duration: 1.6 })
            .to(pupil, { x: 12, y: -8, duration: 1.8 })
            .to(pupil, { x: 0, y: 0, duration: 1.2 });
        }

        /* ---------- The eye floats gently up and down ---------- */
        gsap.to(".who-eye-float", {
          y: -14,
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        /* ---------- Gentle parallax on the eye and glow ---------- */
        gsap.fromTo(
          ".who-eye-wrap",
          { yPercent: 5 },
          {
            yPercent: -5,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );

        gsap.to(".who-orb", {
          yPercent: 30,
          xPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        return () => {
          window.removeEventListener("pointermove", onMove);
          blink.kill();
          wander?.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="who-we-are"
      aria-label="Who we are"
      className="section who-sec relative overflow-x-clip"
    >
      <style>{`
        .who-sec {
          --who-h2: #1ce8f0;
          --who-accent-text: #1ce8f0;
        }

        .light .who-sec {
          --who-h2: #07505a;
          --who-accent-text: #07505a;
        }

        .who-sec .who-head,
        .who-sec .who-head h2 {
          margin-top: 0;
        }

        .who-sec .who-head {
          margin-bottom: 24px;
        }

        @media (min-width: 768px) {
          .who-sec .who-head {
            margin-bottom: 32px;
          }
        }

        @media (min-width: 1024px) {
          .who-sec .who-head {
            margin-bottom: 40px;
          }
        }

        /* Compact spacing, same rhythm as the other sections */
        .section.who-sec {
          padding-top: 1.5rem;
          padding-bottom: 2.5rem;
        }

        @media (min-width: 640px) {
          .section.who-sec {
            padding-top: 2rem;
            padding-bottom: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .section.who-sec {
            padding-top: 2.5rem;
            padding-bottom: 3.5rem;
          }
        }

        .who-accent {
          color: var(--who-accent-text);
        }

        @keyframes who-pulse-ring {
          0%, 100% { opacity: .3; transform: scale(0.98); }
          50% { opacity: .7; transform: scale(1.02); }
        }

        .eye-glow-ring {
          animation: who-pulse-ring 5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .eye-glow-ring {
            animation: none;
          }
        }
      `}</style>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="who-orb pointer-events-none absolute -left-40 top-10 size-[460px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative">
        {/* ---------- Text left, enhanced visual viewport right ---------- */}
        <div className="who-grid mx-auto grid max-w-[1040px] items-center gap-10 lg:grid-cols-[360px_1fr] lg:gap-16">
          <div className="order-2 flex flex-col justify-center">
            <h2
              aria-label={HEADING}
              className="t-h2 font-semibold"
              style={{ color: "var(--who-h2)", marginBottom: "1.25rem" }}
            >
              {HEADING.split(" ").map((word, index) => (
                <span
                  key={word + index}
                  aria-hidden="true"
                  className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                >
                  <span className="who-word inline-block">{word}</span>
                </span>
              ))}
            </h2>

            <div
              className="max-w-[56ch] text-[14px] leading-[1.8] text-fg-muted"
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              <p className="who-p">
                BlackEyes Smart Technology designs, installs and supports
                CCTV, access control, networking, fire alarm, intercom, sound
                and home automation.
              </p>
              <p className="who-p">
                Every system is planned to work together, with one
                accountable team from the first site visit to long after
                handover.
              </p>
              <p className="who-p">
                From homes to offices and commercial buildings, we stay
                available well beyond the day the installation is finished.
              </p>
            </div>
          </div>

          {/* Enhanced Animated Viewport Card */}
          <div className="who-eye-wrap relative order-1 mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:mx-0 lg:max-w-none">
            <div className="who-eye-float relative rounded-[0_32px_0_32px] border border-edge bg-bg/60 p-6 shadow-2xl backdrop-blur-md">
              <div
                aria-hidden="true"
                className="eye-glow-ring pointer-events-none absolute inset-[10%] rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent) 0%, transparent 75%)",
                }}
              />

              <svg
                ref={eyeRef}
                viewBox="0 0 400 400"
                fill="none"
                aria-hidden="true"
                className="relative block h-auto w-full overflow-visible"
              >
                <defs>
                  <radialGradient id="whoIris" cx="50%" cy="50%" r="50%">
                    <stop offset="30%" stopColor="var(--accent)" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.55" />
                  </radialGradient>
                  <linearGradient
                    id="whoSweep"
                    gradientUnits="userSpaceOnUse"
                    x1="200"
                    y1="200"
                    x2="348"
                    y2="200"
                  >
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.32" />
                  </linearGradient>
                  <filter id="whoBlur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" />
                  </filter>
                </defs>

                {/* Viewfinder tech frame corners */}
                <g stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.8">
                  <path className="eye-draw" d="M24 64 V24 H64" />
                  <path className="eye-draw" d="M336 24 H376 V64" />
                  <path className="eye-draw" d="M376 336 V376 H336" />
                  <path className="eye-draw" d="M64 376 H24 V336" />
                </g>

                {/* Center Targeting Crosshairs */}
                <g stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.25">
                  <line x1="200" y1="24" x2="200" y2="70" strokeDasharray="3 3" />
                  <line x1="200" y1="330" x2="200" y2="376" strokeDasharray="3 3" />
                  <line x1="24" y1="200" x2="70" y2="200" strokeDasharray="3 3" />
                  <line x1="330" y1="200" x2="376" y2="200" strokeDasharray="3 3" />
                </g>

                {/* REC active status dot */}
                <circle className="eye-rec" cx="44" cy="44" r="4.5" fill="#ef6464" />

                {/* Enhanced Command HUD labels */}
                <g
                  className="eye-hud"
                  fill="var(--accent)"
                  fontSize="10.5"
                  fontWeight="600"
                  letterSpacing="2.5"
                  opacity="0.85"
                  style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
                >
                  <text x="56" y="48">REC ● LIVE</text>
                  <text x="376" y="48" textAnchor="end">SYS.01 // 4K</text>
                  <text x="36" y="362">LAT: 31.52° N</text>
                  <text x="376" y="362" textAnchor="end">ENCRYPTED</text>
                </g>

                {/* Outer tech target ring */}
                <g className="eye-ring-outer">
                  <circle
                    cx="200"
                    cy="200"
                    r="180"
                    stroke="var(--accent)"
                    strokeOpacity="0.35"
                    strokeDasharray="4 12"
                    strokeWidth="1.2"
                  />
                </g>

                {/* Precision tick ring */}
                <g className="eye-ticks" stroke="var(--accent)">
                  {TICKS.map((t, i) => (
                    <line
                      key={i}
                      x1={t.x1}
                      y1={t.y1}
                      x2={t.x2}
                      y2={t.y2}
                      strokeOpacity={t.long ? 0.75 : 0.3}
                      strokeWidth={t.long ? 1.8 : 1}
                    />
                  ))}
                </g>

                {/* Mid engineering ring */}
                <circle
                  className="eye-draw"
                  cx="200"
                  cy="200"
                  r="146"
                  stroke="var(--accent)"
                  strokeOpacity="0.5"
                  strokeWidth="1.5"
                />

                {/* Active radar scanning beam arc */}
                <g className="eye-scan" stroke="var(--accent)" strokeLinecap="round">
                  <path
                    d="M200 200 L324.6 117.8 A146 146 0 0 1 324.6 282.2 Z"
                    fill="url(#whoSweep)"
                    stroke="none"
                  />
                  <path
                    d="M324.6 117.8 A146 146 0 0 1 324.6 282.2"
                    strokeWidth="6"
                    strokeOpacity="0.4"
                    filter="url(#whoBlur)"
                  />
                  <path
                    d="M324.6 117.8 A146 146 0 0 1 324.6 282.2"
                    strokeWidth="2.2"
                    strokeOpacity="0.95"
                  />
                </g>

                {/* Iris ring */}
                <circle
                  className="eye-draw"
                  cx="200"
                  cy="200"
                  r="98"
                  fill="url(#whoIris)"
                  stroke="var(--accent)"
                  strokeOpacity="0.75"
                  strokeWidth="1.8"
                />
                <g className="eye-fibers" stroke="var(--accent)">
                  {FIBERS.map((f, i) => (
                    <line
                      key={i}
                      x1={f.x1}
                      y1={f.y1}
                      x2={f.x2}
                      y2={f.y2}
                      strokeOpacity="0.38"
                      strokeWidth="1.1"
                    />
                  ))}
                </g>
                <circle
                  className="eye-draw"
                  cx="200"
                  cy="200"
                  r="56"
                  stroke="var(--accent)"
                  strokeOpacity="0.65"
                  strokeWidth="1.2"
                />

                {/* Interactive cursor-tracking pupil */}
                <g ref={pupilRef} className="eye-pupil">
                  <g className="eye-pupil-scale">
                    <circle
                      cx="200"
                      cy="200"
                      r="42"
                      fill="#02060a"
                      stroke="var(--accent)"
                      strokeWidth="2"
                    />
                    <circle
                      cx="200"
                      cy="200"
                      r="28"
                      fill="var(--accent)"
                      fillOpacity="0.12"
                    />
                    {/* Glossy lens reflection flares */}
                    <circle cx="185" cy="184" r="7.5" fill="#ffffff" fillOpacity="0.9" />
                    <circle cx="214" cy="215" r="3.5" fill="#ffffff" fillOpacity="0.55" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}