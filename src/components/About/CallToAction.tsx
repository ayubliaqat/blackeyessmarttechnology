"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ==========================================================================
   About page, section 3: Call to action
   Flow: one wide borderless banner. Text and buttons on the left, an animated
   "contact" graphic on the right: a ringing phone with mail, chat and
   location badges around it.
   ========================================================================== */

const HEADING = "Let’s secure what matters to you.";

export default function CallToAction() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const origin = "120 120";

        const draw = gsap.utils.toArray<SVGGeometryElement>(".cta-draw");
        draw.forEach((el) => {
          const length = el.getTotalLength();
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        });

        gsap.set(".cta-core", { scale: 0 });
        gsap.set(".cta-sat", { scale: 0, opacity: 0 });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".cta-card", start: "top 80%", once: true },
          })
          .from(".cta-card", { y: 44, opacity: 0, scale: 0.97, duration: 1 }, 0)
          .from(
            ".cta-word",
            {
              yPercent: 110,
              opacity: 0,
              rotateX: -25,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.06,
            },
            0.3,
          )
          .from(
            ".cta-p",
            {
              y: 20,
              opacity: 0,
              filter: "blur(6px)",
              duration: 0.9,
              clearProps: "filter",
            },
            0.65,
          )
          .from(".cta-btns", { y: 22, opacity: 0, duration: 0.9 }, 0.85)
          .to(
            draw,
            {
              strokeDashoffset: 0,
              duration: 1.2,
              stagger: 0.12,
              ease: "power2.inOut",
            },
            0.5,
          )
          .to(".cta-core", { scale: 1, duration: 0.9, ease: "back.out(2)" }, 0.9)
          .to(
            ".cta-sat",
            {
              scale: 1,
              opacity: 1,
              duration: 0.7,
              stagger: 0.14,
              ease: "back.out(2.2)",
            },
            1.3,
          )
          .from(".cta-label", { opacity: 0, y: 6, duration: 0.6 }, 1.9);

        // Idle motion
        gsap.to(".cta-ring-a", {
          rotation: 360,
          svgOrigin: origin,
          duration: 45,
          repeat: -1,
          ease: "none",
        });

        gsap.fromTo(
          ".cta-ripple",
          { scale: 1, opacity: 0.5, svgOrigin: origin },
          {
            scale: 2.2,
            opacity: 0,
            svgOrigin: origin,
            duration: 3.6,
            ease: "power1.out",
            repeat: -1,
            stagger: 1.2,
            delay: 1.6,
          },
        );

        gsap.to(".cta-sat-float", {
          y: -6,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.5, from: "start" },
        });

        // The phone rings now and then
        gsap
          .timeline({ repeat: -1, repeatDelay: 2.6, delay: 3 })
          .to(".cta-phone", {
            rotation: -14,
            duration: 0.07,
            yoyo: true,
            repeat: 7,
            ease: "sine.inOut",
          })
          .to(".cta-phone", { rotation: 0, duration: 0.12 });

        gsap.to(".cta-orb", {
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
      });

      // Magnetic buttons (mouse devices only)
      mm.add(
        "(hover: hover) and (prefers-reduced-motion: no-preference)",
        () => {
          const cleanups: Array<() => void> = [];

          gsap.utils.toArray<HTMLElement>(".cta-mag").forEach((el) => {
            const moveX = gsap.quickTo(el, "x", {
              duration: 0.45,
              ease: "power3.out",
            });
            const moveY = gsap.quickTo(el, "y", {
              duration: 0.45,
              ease: "power3.out",
            });

            const onMove = (event: MouseEvent) => {
              const rect = el.getBoundingClientRect();
              moveX((event.clientX - (rect.left + rect.width / 2)) * 0.22);
              moveY((event.clientY - (rect.top + rect.height / 2)) * 0.32);
            };
            const onLeave = () => {
              moveX(0);
              moveY(0);
            };

            el.addEventListener("mousemove", onMove);
            el.addEventListener("mouseleave", onLeave);
            cleanups.push(() => {
              el.removeEventListener("mousemove", onMove);
              el.removeEventListener("mouseleave", onLeave);
            });
          });

          return () => cleanups.forEach((fn) => fn());
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="get-started"
      aria-label="Get a quote"
      className="section cta-sec relative overflow-x-clip"
    >
      <style>{`
        .cta-sec {
          --cta-h2: #1ce8f0;
        }

        .light .cta-sec {
          --cta-h2: #07505a;
        }

        /* Compact spacing, same rhythm as the other sections */
        .section.cta-sec {
          padding-top: 1.5rem;
          padding-bottom: 2.5rem;
        }

        @media (min-width: 640px) {
          .section.cta-sec {
            padding-top: 2rem;
            padding-bottom: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .section.cta-sec {
            padding-top: 2.5rem;
            padding-bottom: 3.5rem;
          }
        }

        @keyframes cta-sweep {
          0% { transform: translateX(-130%); }
          55%, 100% { transform: translateX(130%); }
        }

        /* Borderless banner: a soft tint and glow instead of an outline */
        .cta-card {
          position: relative;
          overflow: hidden;
          border: 0;
          border-radius: 0 32px 0 32px;
          background:
            linear-gradient(
              135deg,
              color-mix(in srgb, var(--accent) 9%, transparent),
              color-mix(in srgb, var(--accent) 2%, transparent) 60%
            ),
            var(--bg);
          box-shadow: 0 30px 70px -36px color-mix(in srgb, var(--accent) 40%, transparent);
        }

        /* A soft band of light sweeps across now and then */
        .cta-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            100deg,
            transparent 40%,
            color-mix(in srgb, var(--accent) 14%, transparent) 50%,
            transparent 60%
          );
          transform: translateX(-130%);
          animation: cta-sweep 7s ease-in-out 2.5s infinite;
        }

        .cta-label {
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-card::after {
            animation: none;
          }
        }
      `}</style>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="cta-orb pointer-events-none absolute -left-40 top-0 size-[460px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative">
        <div className="cta-card mx-auto max-w-[1000px]">
          <div className="relative z-10 grid items-center gap-8 p-7 sm:p-10 md:grid-cols-[1fr_auto] md:gap-12">
            {/* Text and buttons */}
            <div>
              <h2
                aria-label={HEADING}
                className="t-h2 font-semibold"
                style={{ color: "var(--cta-h2)", marginBottom: "1rem" }}
              >
                {HEADING.split(" ").map((word, index) => (
                  <span
                    key={word + index}
                    aria-hidden="true"
                    className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                  >
                    <span className="cta-word inline-block">{word}</span>
                  </span>
                ))}
              </h2>

              <p
                className="cta-p max-w-[48ch] text-[14px] leading-[1.8] text-fg-muted"
                style={{ marginBottom: "1.75rem" }}
              >
                Tell us about your property and we will plan the right
                system, then send you a clear quote.
              </p>

              <div className="cta-btns flex flex-col gap-3 sm:flex-row sm:gap-4">
                <div className="cta-mag">
                  <Link href="/contact-us" className="btn btn--primary w-full sm:w-auto">
                    Get a Quote
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
                <div className="cta-mag">
                  <Link href="/services" className="btn w-full sm:w-auto">
                    Explore Services
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact graphic: ringing phone with mail, chat and location */}
            <div className="mx-auto w-[210px] md:w-[250px]">
              <svg
                viewBox="0 0 240 240"
                fill="none"
                aria-hidden="true"
                className="block h-auto w-full overflow-visible"
              >
                {/* Rings */}
                <g className="cta-ring-a">
                  <circle
                    cx="120"
                    cy="120"
                    r="100"
                    stroke="var(--accent)"
                    strokeOpacity="0.4"
                    strokeDasharray="2 9"
                    strokeWidth="1.4"
                  />
                </g>
                <circle
                  className="cta-draw"
                  cx="120"
                  cy="120"
                  r="70"
                  stroke="var(--accent)"
                  strokeOpacity="0.3"
                />

                {/* Ripples from the phone */}
                {[0, 1, 2].map((i) => (
                  <circle
                    key={i}
                    className="cta-ripple"
                    cx="120"
                    cy="120"
                    r="44"
                    stroke="var(--accent)"
                    strokeWidth="1.4"
                    opacity="0"
                  />
                ))}

                {/* Links to the badges */}
                <g stroke="var(--accent)" strokeOpacity="0.45" strokeDasharray="3 5">
                  <path className="cta-draw" d="M120 80 L120 40" />
                  <path className="cta-draw" d="M86 138 L52 160" />
                  <path className="cta-draw" d="M154 138 L188 160" />
                </g>

                {/* Mail badge (top) */}
                <g className="cta-sat">
                  <g className="cta-sat-float">
                    <g transform="translate(120 28)">
                      <circle
                        r="21"
                        fill="var(--bg)"
                        stroke="var(--accent)"
                        strokeWidth="1.5"
                        style={{
                          filter:
                            "drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 35%, transparent))",
                        }}
                      />
                      <g
                        stroke="var(--accent)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="-10" y="-7" width="20" height="14" rx="2.5" />
                        <path d="M-10 -5 L0 2 L10 -5" />
                      </g>
                    </g>
                  </g>
                </g>

                {/* Chat badge (lower left) */}
                <g className="cta-sat">
                  <g className="cta-sat-float">
                    <g transform="translate(40 168)">
                      <circle
                        r="21"
                        fill="var(--bg)"
                        stroke="var(--accent)"
                        strokeWidth="1.5"
                        style={{
                          filter:
                            "drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 35%, transparent))",
                        }}
                      />
                      <g
                        stroke="var(--accent)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M-10 -7 H10 a2 2 0 0 1 2 2 V3 a2 2 0 0 1 -2 2 H-1 L-7 10 V5 H-10 a2 2 0 0 1 -2 -2 V-5 a2 2 0 0 1 2 -2 Z" />
                        <path d="M-5 -2 H5 M-5 1 H1" />
                      </g>
                    </g>
                  </g>
                </g>

                {/* Location badge (lower right) */}
                <g className="cta-sat">
                  <g className="cta-sat-float">
                    <g transform="translate(200 168)">
                      <circle
                        r="21"
                        fill="var(--bg)"
                        stroke="var(--accent)"
                        strokeWidth="1.5"
                        style={{
                          filter:
                            "drop-shadow(0 0 10px color-mix(in srgb, var(--accent) 35%, transparent))",
                        }}
                      />
                      <g
                        stroke="var(--accent)"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M0 -11 C-6 -11 -10 -7 -10 -2 C-10 4 0 12 0 12 C0 12 10 4 10 -2 C10 -7 6 -11 0 -11 Z" />
                        <circle cx="0" cy="-2" r="3.2" />
                      </g>
                    </g>
                  </g>
                </g>

                {/* Phone core */}
                <g className="cta-core">
                  <circle
                    cx="120"
                    cy="120"
                    r="40"
                    fill="var(--bg)"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    style={{
                      filter:
                        "drop-shadow(0 0 16px color-mix(in srgb, var(--accent) 45%, transparent))",
                    }}
                  />
                  <g transform="translate(120 120) scale(1.6) translate(-12 -12)">
                    <g className="cta-phone">
                      <path
                        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                        stroke="var(--accent)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>
                </g>

                <text
                  className="cta-label"
                  x="120"
                  y="236"
                  textAnchor="middle"
                  fill="var(--accent)"
                  fontSize="11"
                  letterSpacing="3"
                >
                  LET’S TALK
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}