"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ==========================================================================
   About page, section 2: Where we offer our service
   Flow: centred heading, then one wide "coverage radar" with the areas as
   pins, cycling automatically and reacting to hover. Same tokens as the rest.
   ========================================================================== */

const HEADING = "Where we offer our services";

// Main cities (edit this list to match where you really work)
const AREAS = [
  { name: "Lahore", ring: 1, deg: 200 },
  { name: "Islamabad", ring: 1, deg: 340 },
  { name: "Rawalpindi", ring: 2, deg: 290 },
  { name: "Peshawar", ring: 2, deg: 250 },
  { name: "Faisalabad", ring: 2, deg: 155 },
  { name: "Multan", ring: 2, deg: 25 },
  { name: "Gujranwala", ring: 3, deg: 195 },
  { name: "Quetta", ring: 3, deg: 345 },
  { name: "Hyderabad", ring: 3, deg: 110 },
  { name: "Karachi", ring: 3, deg: 70 },
];

const VIEW_W = 800;
const VIEW_H = 460;
const HUB = { x: 400, y: 230 };

const RINGS = [
  { rx: 120, ry: 60, opacity: 0.38 },
  { rx: 220, ry: 110, opacity: 0.3 },
  { rx: 320, ry: 160, opacity: 0.22 },
  { rx: 390, ry: 195, opacity: 0.15 },
];

const NODES = AREAS.map((area) => {
  const ring = RINGS[area.ring];
  const angle = (area.deg * Math.PI) / 180;
  const x = +(HUB.x + ring.rx * Math.cos(angle)).toFixed(1);
  const y = +(HUB.y + ring.ry * Math.sin(angle)).toFixed(1);
  return {
    ...area,
    x,
    y,
    left: +((x / VIEW_W) * 100).toFixed(2),
    top: +((y / VIEW_H) * 100).toFixed(2),
  };
});

export default function WhereWeServe() {
  const sectionRef = useRef<HTMLElement>(null);
  const pausedRef = useRef(false);
  const [active, setActive] = useState(0);

  // Cycle through the areas automatically (not with reduced motion)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) {
        setActive((current) => (current + 1) % NODES.length);
      }
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const draw = gsap.utils.toArray<SVGGeometryElement>(".where-draw");
        draw.forEach((el) => {
          const length = el.getTotalLength();
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        });

        gsap.set(".where-hub", { scale: 0, svgOrigin: `${HUB.x} ${HUB.y}` });
        gsap.set(".where-dot", { opacity: 0 });
        gsap.set(".where-particle", { opacity: 0 });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: ".where-panel",
              start: "top 80%",
              once: true,
            },
          })
          .from(".where-panel", { y: 32, opacity: 0, duration: 0.9 }, 0)
          .to(
            ".where-ring",
            {
              strokeDashoffset: 0,
              duration: 1.4,
              stagger: 0.15,
              ease: "power2.inOut",
            },
            0.2,
          )
          .to(
            ".where-hub",
            { scale: 1, duration: 0.9, ease: "back.out(1.8)" },
            0.7,
          )
          .to(
            ".where-line",
            {
              strokeDashoffset: 0,
              duration: 1.1,
              stagger: 0.1,
              ease: "power2.inOut",
            },
            1,
          )
          .to(".where-dot", { opacity: 1, duration: 0.5, stagger: 0.1 }, 1.4)
          .to(".where-particle", { opacity: 1, duration: 0.4 }, 2)
          .from(
            ".where-pin-btn",
            {
              scale: 0.5,
              opacity: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: "back.out(1.7)",
            },
            1.4,
          )
          .from(".where-caption", { y: 12, opacity: 0, duration: 0.7 }, 1.9);

        // Sonar ripples from the hub
        gsap.fromTo(
          ".where-ripple",
          { scale: 0.1, opacity: 0.55, svgOrigin: `${HUB.x} ${HUB.y}` },
          {
            scale: 1,
            opacity: 0,
            svgOrigin: `${HUB.x} ${HUB.y}`,
            duration: 4,
            ease: "power1.out",
            repeat: -1,
            stagger: 1.33,
            delay: 1.6,
          },
        );

        gsap.to(".where-hub-ring", {
          scale: 1.15,
          opacity: 0.2,
          svgOrigin: `${HUB.x} ${HUB.y}`,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".where-orb", {
          yPercent: 30,
          xPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      // Heading reveal
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = { trigger: ".where-head", start: "top 85%", once: true };

        gsap.from(".where-word", {
          yPercent: 110,
          opacity: 0,
          rotateX: -25,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: once,
        });

        gsap.from(".where-head-p", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: once,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const current = NODES[active];

  return (
    <section
      ref={sectionRef}
      id="where-we-serve"
      aria-label="Where we offer our services"
      className="section where-sec relative overflow-x-clip"
    >
      <style>{`
        .where-sec {
          --where-h2: #1ce8f0;
        }

        .light .where-sec {
          --where-h2: #07505a;
        }

        /* Compact spacing, same rhythm as the other sections */
        .section.where-sec {
          padding-top: 1.5rem;
          padding-bottom: 2.5rem;
        }

        @media (min-width: 640px) {
          .section.where-sec {
            padding-top: 2rem;
            padding-bottom: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .section.where-sec {
            padding-top: 2.5rem;
            padding-bottom: 3.5rem;
          }
        }

        .where-sec .where-head,
        .where-sec .where-head h2 {
          margin-top: 0;
        }

        .where-sec .where-head {
          margin-bottom: 24px;
        }

        @media (min-width: 768px) {
          .where-sec .where-head {
            margin-bottom: 32px;
          }
        }

        /* Panel with a faint dot grid that fades towards the edges */
        .where-panel {
          position: relative;
          overflow: hidden;
          border-radius: 1.25rem;
          border: 0;
          background: transparent;
        }

        .where-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(
            color-mix(in srgb, var(--accent) 18%, transparent) 1px,
            transparent 1.5px
          );
          background-size: 22px 22px;
          -webkit-mask-image: radial-gradient(ellipse at center, #000 35%, transparent 80%);
          mask-image: radial-gradient(ellipse at center, #000 35%, transparent 80%);
        }

        @keyframes where-ping {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(3.2); opacity: 0; }
        }

        .where-ping {
          transform-box: fill-box;
          transform-origin: center;
          animation: where-ping 1.8s ease-out infinite;
        }

        .where-line {
          transition: stroke-opacity 400ms ease, stroke-width 400ms ease;
        }

        .where-pin-btn {
          transition:
            background-color 250ms ease,
            border-color 250ms ease,
            color 250ms ease,
            box-shadow 250ms ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .where-ping {
            animation: none;
          }

          .where-line,
          .where-pin-btn {
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="where-orb pointer-events-none absolute -right-40 top-10 size-[460px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative">
        {/* Section heading */}
        <div className="section-head section-head--center where-head">
          <h2
            aria-label={HEADING}
            className="t-h2 font-semibold"
            style={{ color: "var(--where-h2)" }}
          >
            {HEADING.split(" ").map((word, index) => (
              <span
                key={word + index}
                aria-hidden="true"
                className="mr-[0.2em] inline-block overflow-hidden align-bottom"
              >
                <span className="where-word inline-block">{word}</span>
              </span>
            ))}
          </h2>

          <p className="where-head-p t-body max-w-[54ch] text-center">
            On-site design, installation and support across these areas, with
            round-the-clock support behind every site.
          </p>
        </div>

        {/* Coverage radar */}
        <div
          className="where-panel mx-auto max-w-[740px] p-3 sm:p-4"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          onFocus={() => (pausedRef.current = true)}
          onBlur={() => (pausedRef.current = false)}
        >
          <div
            className="relative mx-auto w-full"
            style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
          >
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              fill="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              <defs>
                <filter id="whereGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Rings */}
              {RINGS.map((ring) => (
                <ellipse
                  key={ring.rx}
                  className="where-ring where-draw"
                  cx={HUB.x}
                  cy={HUB.y}
                  rx={ring.rx}
                  ry={ring.ry}
                  stroke="var(--accent)"
                  strokeOpacity={ring.opacity}
                />
              ))}

              {/* Sonar ripples */}
              {[0, 1, 2].map((i) => (
                <ellipse
                  key={i}
                  className="where-ripple"
                  cx={HUB.x}
                  cy={HUB.y}
                  rx="390"
                  ry="195"
                  stroke="var(--accent)"
                  strokeWidth="1.4"
                  opacity="0"
                />
              ))}

              {/* Lines from the hub to each area */}
              {NODES.map((node, i) => (
                <path
                  key={node.name}
                  className="where-line where-draw"
                  d={`M${HUB.x} ${HUB.y} L${node.x} ${node.y}`}
                  stroke="var(--accent)"
                  strokeLinecap="round"
                  strokeWidth={i === active ? 2 : 1.2}
                  strokeOpacity={i === active ? 0.95 : 0.3}
                  filter={i === active ? "url(#whereGlow)" : undefined}
                />
              ))}

              {/* Data particles travelling along each line */}
              {NODES.map((node, i) => (
                <circle
                  key={node.name}
                  className="where-particle"
                  r="3"
                  fill="var(--accent)"
                >
                  <animateMotion
                    path={`M${HUB.x} ${HUB.y} L${node.x} ${node.y}`}
                    dur={`${2.2 + i * 0.3}s`}
                    begin={`${i * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}

              {/* Area dots (visible on small screens, where pins are hidden) */}
              {NODES.map((node, i) => (
                <g key={node.name} className="where-dot">
                  {i === active && (
                    <circle
                      className="where-ping"
                      cx={node.x}
                      cy={node.y}
                      r="5"
                      fill="var(--accent)"
                    />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={i === active ? 6 : 4.5}
                    fill="var(--accent)"
                  />
                </g>
              ))}

              {/* Hub */}
              <g className="where-hub">
                <circle
                  className="where-hub-ring"
                  cx={HUB.x}
                  cy={HUB.y}
                  r="44"
                  stroke="var(--accent)"
                  strokeOpacity="0.5"
                />
                <circle
                  cx={HUB.x}
                  cy={HUB.y}
                  r="34"
                  fill="var(--bg)"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  style={{
                    filter:
                      "drop-shadow(0 0 14px color-mix(in srgb, var(--accent) 45%, transparent))",
                  }}
                />
                <g
                  transform={`translate(${HUB.x} ${HUB.y})`}
                  stroke="var(--accent)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M0 -15 L13 -10 V3 C13 10 6 14 0 18 C-6 14 -13 10 -13 3 V-10 Z" />
                  <path d="M-5 1 L-1 5 L6 -4" />
                </g>
              </g>
            </svg>

            {/* Area pins (tablet and desktop) */}
            {NODES.map((node, i) => {
              const isActive = i === active;

              return (
                <div
                  key={node.name}
                  className="absolute z-20 hidden sm:block"
                  style={{
                    left: `${node.left}%`,
                    top: `${node.top}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <button
                    type="button"
                    aria-pressed={isActive}
                    aria-label={`${node.name}: design, installation and support`}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="where-pin-btn flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-[10.5px] font-semibold backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] md:text-[11px]"
                    style={{
                      backgroundColor: isActive ? "var(--accent)" : "var(--glass-bg)",
                      borderColor: isActive ? "var(--accent)" : "var(--glass-border)",
                      color: isActive ? "var(--btn-primary-fg)" : "var(--fg)",
                      boxShadow: isActive
                        ? "0 0 22px var(--btn-primary-glow)"
                        : "var(--glass-shadow)",
                    }}
                  >
                    <MapPin className="size-3" aria-hidden="true" />
                    {node.name}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Small screens: the areas as chips */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:hidden">
            {NODES.map((node, i) => {
              const isActive = i === active;

              return (
                <button
                  key={node.name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActive(i)}
                  className="where-pin-btn rounded-full border px-3 py-1.5 text-[11px] font-semibold"
                  style={{
                    backgroundColor: isActive ? "var(--accent)" : "var(--glass-bg)",
                    borderColor: isActive ? "var(--accent)" : "var(--glass-border)",
                    color: isActive ? "var(--btn-primary-fg)" : "var(--fg)",
                  }}
                >
                  {node.name}
                </button>
              );
            })}
          </div>

          {/* Caption for the selected area */}
          <p
            aria-live="polite"
            className="where-caption relative text-center text-[13px] text-fg-muted"
            style={{ marginTop: "1rem" }}
          >
            <span className="font-display font-semibold text-fg">
              {current.name}
            </span>
            {" · Design, installation and support"}
          </p>
        </div>
      </div>
    </section>
  );
}