"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import {
  ClipboardList,
  ScanSearch,
  Settings2,
  ShieldCheck,
  Shield,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);

const STEPS = [
  {
    number: "01",
    title: "Discover",
    detail: "Understand",
    description:
      "We learn about your property, security concerns, and the protection you actually need.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Design",
    detail: "Plan",
    description:
      "We assess your space and plan the ideal equipment, positioning, and system configuration.",
    icon: ScanSearch,
  },
  {
    number: "03",
    title: "Install",
    detail: "Execute",
    description:
      "Our team installs and configures every component with care and attention to detail.",
    icon: Settings2,
  },
  {
    number: "04",
    title: "Protect",
    detail: "Deliver",
    description:
      "We test your system, explain how everything works, and remain available when you need us.",
    icon: ShieldCheck,
  },
];

const BRANCHES = [
  "M500 330 C390 310 125 300 125 108",
  "M500 330 C470 270 375 240 375 108",
  "M500 330 C530 270 625 240 625 108",
  "M500 330 C610 310 875 300 875 108",
];

const HEADING = "Every step builds protection";

/* ==========================================================================
   Process section
   Same tokens, type scale and spacing as Services / Why choose us.
   ========================================================================== */

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      const once = (trigger: string, start = "top 85%") => ({
        trigger,
        start,
        once: true,
      });

      /* ---------- Heading (all screens) ---------- */
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".process-word", {
          yPercent: 110,
          opacity: 0,
          rotateX: -25,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: once(".process-head"),
        });

        gsap.from(".process-head-p", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: once(".process-head"),
        });
      });

      /* ---------- Desktop network tree ---------- */
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const branches = gsap.utils.toArray<SVGPathElement>(
            ".pr-desktop .network-branch",
          );

          branches.forEach((path) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
          });

          gsap.set(".pr-desktop .network-particle", { opacity: 0 });

          gsap
            .timeline({
              scrollTrigger: once(".pr-desktop", "top 78%"),
            })
            .from(".pr-desktop .network-root", {
              scale: 0.65,
              opacity: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
            })
            .to(
              branches,
              {
                strokeDashoffset: 0,
                duration: 1.3,
                stagger: 0.12,
                ease: "power2.inOut",
              },
              "-=0.15",
            )
            .from(
              ".pr-desktop .network-node",
              {
                scale: 0.4,
                opacity: 0,
                duration: 0.55,
                stagger: 0.15,
                ease: "back.out(2)",
              },
              "-=1",
            )
            .from(
              ".pr-desktop .network-text",
              {
                y: 20,
                opacity: 0,
                duration: 0.7,
                stagger: 0.14,
                ease: "power3.out",
              },
              "-=0.6",
            );

          // Particles travelling along each branch
          const particleTweens: gsap.core.Timeline[] = [];

          branches.forEach((path, index) => {
            const particle = path.parentElement?.querySelector(
              ".network-particle",
            );
            if (!particle) return;

            const tl = gsap.timeline({
              repeat: -1,
              repeatDelay: 0.7,
              delay: 2 + index * 0.35,
            });

            tl.to(particle, { opacity: 1, duration: 0.2 })
              .to(
                particle,
                {
                  motionPath: {
                    path,
                    align: path,
                    alignOrigin: [0.5, 0.5],
                  },
                  duration: 2.6 + index * 0.25,
                  ease: "none",
                },
                "<",
              )
              .to(particle, { opacity: 0, duration: 0.25 }, ">-0.25");

            particleTweens.push(tl);
          });

          gsap.to(".pr-desktop .network-root-glow", {
            opacity: 0.8,
            scale: 1.18,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          gsap.to(".pr-desktop .network-orbit", {
            rotate: 360,
            duration: 18,
            repeat: -1,
            ease: "none",
            transformOrigin: "50% 50%",
          });

          // Hover feedback: card lifts, node scales, branch brightens
          const cards = gsap.utils.toArray<HTMLElement>(
            ".pr-desktop .network-card",
          );
          const nodes = gsap.utils.toArray<HTMLElement>(
            ".pr-desktop .network-node",
          );
          const cleanups: Array<() => void> = [];

          cards.forEach((card, index) => {
            const node = nodes[index];
            const branch = branches[index];

            const activate = () => {
              gsap.to(card, { y: -5, duration: 0.3, ease: "power2.out" });
              if (node)
                gsap.to(node, {
                  scale: 1.12,
                  duration: 0.3,
                  ease: "back.out(2)",
                });
              if (branch) gsap.to(branch, { opacity: 1, duration: 0.25 });
            };

            const deactivate = () => {
              gsap.to(card, { y: 0, duration: 0.3, ease: "power2.out" });
              if (node) gsap.to(node, { scale: 1, duration: 0.3 });
              if (branch) gsap.to(branch, { opacity: 0.45, duration: 0.3 });
            };

            card.addEventListener("mouseenter", activate);
            card.addEventListener("mouseleave", deactivate);
            card.addEventListener("focusin", activate);
            card.addEventListener("focusout", deactivate);

            cleanups.push(() => {
              card.removeEventListener("mouseenter", activate);
              card.removeEventListener("mouseleave", deactivate);
              card.removeEventListener("focusin", activate);
              card.removeEventListener("focusout", deactivate);
            });
          });

          return () => {
            cleanups.forEach((fn) => fn());
            particleTweens.forEach((tl) => tl.kill());
          };
        },
      );

      /* ---------- Mobile timeline ---------- */
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(".pr-mobile .network-line", {
            scaleY: 0,
            transformOrigin: "top",
          });

          gsap
            .timeline({ scrollTrigger: once(".pr-mobile", "top 85%") })
            .to(".pr-mobile .network-line", {
              scaleY: 1,
              duration: 1.2,
              ease: "power2.inOut",
            })
            .from(
              ".pr-mobile .network-node",
              {
                scale: 0.5,
                opacity: 0,
                duration: 0.5,
                stagger: 0.14,
                ease: "back.out(2)",
              },
              "-=1",
            )
            .from(
              ".pr-mobile .network-text",
              {
                y: 18,
                opacity: 0,
                duration: 0.6,
                stagger: 0.14,
                ease: "power3.out",
              },
              "-=0.9",
            )
            .from(
              ".pr-mobile .network-root",
              {
                y: 18,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out",
              },
              "-=0.2",
            );
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-label="Our process"
      className="section process-sec relative overflow-x-clip"
    >
      <style>{`
        /* ----------------------------------------------------------
           Compact spacing (matches Why choose us)
        ---------------------------------------------------------- */

        .section.process-sec {
          padding-top: 1.5rem;
          padding-bottom: 2.5rem;
        }

        @media (min-width: 640px) {
          .section.process-sec {
            padding-top: 2rem;
            padding-bottom: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .section.process-sec {
            padding-top: 2.5rem;
            padding-bottom: 3.5rem;
          }
        }

        .process-sec .process-head,
        .process-sec .process-head h2 {
          margin-top: 0;
        }

        /* ----------------------------------------------------------
           Theme-aware network (light + dark)
        ---------------------------------------------------------- */

        .network-branch {
          stroke: var(--accent);
          opacity: .45;
        }

        .network-particle {
          fill: var(--accent);
        }

        .network-trunk {
          stroke: var(--accent);
          opacity: .5;
        }

        .network-node {
          background: var(--bg);
          border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--edge));
          color: var(--accent);
          box-shadow: 0 0 24px color-mix(in srgb, var(--accent) 12%, transparent);
          transition: border-color 300ms ease, background-color 300ms ease;
        }

        .network-card:hover .network-node,
        .network-card:focus-within .network-node {
          border-color: var(--accent);
          background: var(--accent-soft);
        }

        .network-node-ring {
          position: absolute;
          inset: 6px;
          border-radius: 9999px;
          border: 1px solid var(--edge);
          pointer-events: none;
        }

        .network-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          padding: 2px 6px;
          border-radius: 9999px;
          border: 2px solid var(--bg);
          background: var(--accent);
          color: var(--bg);
          font-size: 8px;
          font-weight: 700;
          line-height: 1.2;
        }

        .network-root-hub {
          background: var(--bg);
          border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--edge));
          box-shadow: 0 0 35px color-mix(in srgb, var(--accent) 14%, transparent);
          color: var(--accent);
        }

        .network-root-glow {
          border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
          opacity: .4;
        }

        .network-orbit {
          border: 1px dashed color-mix(in srgb, var(--accent) 30%, transparent);
        }

        .network-detail {
          color: var(--accent);
          opacity: .85;
        }

        .network-card h3 {
          transition: color 300ms ease;
        }

        .network-card:hover h3,
        .network-card:focus-within h3 {
          color: var(--accent);
        }

        .network-line {
          background: linear-gradient(
            to bottom,
            color-mix(in srgb, var(--accent) 70%, transparent),
            color-mix(in srgb, var(--accent) 35%, transparent) 60%,
            transparent
          );
        }

        .network-outcome {
          background: var(--accent-soft);
          border: 1px solid var(--edge);
        }

        @media (prefers-reduced-motion: reduce) {
          .network-node,
          .network-card h3 {
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Ambient theme-aware glow (same treatment as Services) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[45%] size-[420px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative z-10">
        {/* Section heading */}
        <div className="section-head section-head--center process-head">
          <h2
            aria-label={HEADING}
            className="t-h2 font-semibold"
            style={{ color: "#1ce8f0" }}
          >
            {HEADING.split(" ").map((word, index) => (
              <span
                key={word + index}
                aria-hidden="true"
                className="mr-[0.2em] inline-block overflow-hidden align-bottom"
              >
                <span className="process-word inline-block">{word}</span>
              </span>
            ))}
          </h2>

          <p className="process-head-p t-body max-w-[54ch] text-center">
            From the first conversation to the final installation, every
            stage is connected by one goal: your security.
          </p>
        </div>

        {/* Desktop / tablet network tree */}
        <div className="pr-desktop relative mx-auto hidden max-w-[1120px] md:block">
          <div className="relative">
            {/* SVG branching system */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              viewBox="0 0 1000 440"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <filter
                  id="networkGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                className="network-trunk"
                d="M500 398 L500 330"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {BRANCHES.map((d) => (
                <g key={d}>
                  <path
                    className="network-branch"
                    d={d}
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    filter="url(#networkGlow)"
                  />
                  <circle
                    className="network-particle"
                    r="3"
                    filter="url(#networkGlow)"
                  />
                </g>
              ))}
            </svg>

            {/* Stage cards */}
            <div className="relative z-10 grid grid-cols-4 gap-5 lg:gap-8">
              {STEPS.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.number}
                    tabIndex={0}
                    className="network-card relative flex flex-col items-center text-center outline-none"
                  >
                    <div className="network-node relative mb-6 flex size-[68px] items-center justify-center rounded-full">
                      <div className="network-node-ring" aria-hidden="true" />
                      <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
                      <span className="network-badge font-display">
                        {step.number}
                      </span>
                    </div>

                    <div className="network-text flex flex-col items-center">
                      <span className="network-detail mb-2 text-[11px] font-medium tracking-wide">
                        {step.detail}
                      </span>

                      <h3 className="font-display text-[15px] font-medium leading-snug text-fg lg:text-base">
                        {step.title}
                      </h3>

                      <p className="mt-2 max-w-[225px] text-[13px] leading-[1.8] text-fg-muted lg:text-sm">
                        {step.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Central root hub */}
            <div className="network-root relative z-20 mx-auto mt-12 flex w-fit flex-col items-center lg:mt-14">
              <div className="network-root-hub relative flex size-[76px] items-center justify-center rounded-full">
                <div
                  className="network-root-glow absolute -inset-3 rounded-full"
                  aria-hidden="true"
                />
                <div
                  className="network-orbit absolute -inset-1.5 rounded-full"
                  aria-hidden="true"
                />
                <Shield size={29} strokeWidth={1.35} aria-hidden="true" />
              </div>

              <span className="mt-4 font-display text-sm font-medium text-fg">
                Your property
              </span>
              <span className="mt-0.5 text-xs text-fg-muted">
                The centre of every system we build
              </span>
            </div>
          </div>
        </div>

        {/* Mobile timeline */}
        <div className="pr-mobile relative mx-auto max-w-[460px] md:hidden">
          <div
            aria-hidden="true"
            className="network-line absolute bottom-[88px] left-[26px] top-8 w-px"
          />

          <ol className="space-y-8">
            {STEPS.map((step) => {
              const Icon = step.icon;

              return (
                <li key={step.number} className="relative flex gap-5">
                  <div className="network-node relative z-10 flex size-[54px] shrink-0 items-center justify-center rounded-full">
                    <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
                    <span className="network-badge font-display">
                      {step.number}
                    </span>
                  </div>

                  <div className="network-text flex-1 pb-1">
                    <span className="network-detail text-[11px] font-medium tracking-wide">
                      {step.detail}
                    </span>

                    <h3 className="mt-1 font-display text-[15px] font-medium text-fg">
                      {step.title}
                    </h3>

                    <p className="mt-2 max-w-[34ch] text-[13px] leading-[1.8] text-fg-muted">
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="network-root network-outcome mt-8 flex items-center gap-4 rounded-xl p-4">
            <div className="network-root-hub flex size-12 shrink-0 items-center justify-center rounded-full">
              <Shield size={21} aria-hidden="true" />
            </div>

            <span className="font-display text-sm font-medium text-fg">
              BlackEyes. Smart solutions for all.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}