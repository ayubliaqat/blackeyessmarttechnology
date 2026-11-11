"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShieldCheck, Cpu, Headphones, Wrench } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Enterprise-Grade Security",
    text: "Engineered from the ground up to protect your property, data, and privacy with uncompromised reliability.",
  },
  {
    icon: Cpu,
    title: "Smart Integration",
    text: "CCTV, access control, and automation working seamlessly together through a single unified interface.",
  },
  {
    icon: Wrench,
    title: "End-to-End Execution",
    text: "From professional site surveys and structured cabling to expert installation and configuration.",
  },
  {
    icon: Headphones,
    title: "24/7 Dedicated Support",
    text: "Our local technical team is always on call, ensuring your systems operate smoothly around the clock.",
  },
];

const HEADING = "Why choose BlackEyes";

/* ==========================================================================
   Why choose us section
   Matches the Services section: same tokens, type scale and spacing.
   ========================================================================== */

export default function WhyChooseUs() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = (trigger: string, start = "top 85%") => ({
          trigger,
          start,
          once: true,
        });

        gsap.from(".why-word", {
          yPercent: 110,
          opacity: 0,
          rotateX: -25,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: once(".why-head"),
        });

        gsap.from(".why-head-p", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: once(".why-head"),
        });

        gsap.from(".why-card-wrapper", {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: once(".why-grid", "top 82%"),
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="why-choose-us"
      aria-label="Why Choose Us"
      className="section why-sec relative overflow-x-clip"
    >
      <style>{`
        @keyframes why-beam {
          to { transform: rotate(360deg); }
        }

        /* ----------------------------------------------------------
           Compact top spacing (beats the global .section padding)
        ---------------------------------------------------------- */

        .section.why-sec {
          padding-top: 1.5rem;
          padding-bottom: 2.5rem;
        }

        @media (min-width: 640px) {
          .section.why-sec {
            padding-top: 2rem;
            padding-bottom: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .section.why-sec {
            padding-top: 2.5rem;
            padding-bottom: 3.5rem;
          }
        }

        .why-sec .why-head {
          margin-top: 0;
        }

        .why-sec .why-head h2 {
          margin-top: 0;
        }

        /* ----------------------------------------------------------
           Cards (all colors come from theme tokens)
        ---------------------------------------------------------- */

        .why-card-wrapper {
          position: relative;
          overflow: hidden;
          padding: 1px;
          border-radius: 0 28px 0 28px;
          background: var(--edge);
          isolation: isolate;
          transition:
            transform 400ms cubic-bezier(.16, 1, .3, 1),
            box-shadow 400ms ease;
        }

        .why-card-wrapper::before {
          content: "";
          position: absolute;
          inset: -50%;
          z-index: 0;
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            transparent 300deg,
            var(--accent) 360deg
          );
          opacity: .7;
          animation: why-beam 6s linear infinite;
        }

        .why-card-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          border-radius: inherit;
          background: var(--bg);
          transition: background-color 400ms ease;
        }

        .why-icon {
          background: var(--accent-soft);
          border-color: var(--edge);
          color: var(--accent);
          box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 12%, transparent);
          transition:
            transform 400ms cubic-bezier(.16, 1, .3, 1),
            border-color 350ms ease,
            box-shadow 350ms ease;
        }

        @media (hover: hover) {
          .why-card-wrapper:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px -18px color-mix(in srgb, var(--accent) 35%, transparent);
          }

          .why-card-wrapper:hover .why-card-inner {
            background: var(--bg-alt);
          }

          .why-card-wrapper:hover .why-icon {
            transform: translateY(-2px);
            border-color: var(--accent);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .why-card-wrapper::before {
            animation: none;
          }

          .why-card-wrapper,
          .why-card-inner,
          .why-icon {
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Ambient theme-aware glow (same treatment as Services) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 size-[460px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative">
        {/* Section heading */}
        <div className="section-head section-head--center why-head">
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
                <span className="why-word inline-block">{word}</span>
              </span>
            ))}
          </h2>

          <p className="why-head-p t-body max-w-[54ch] text-center">
            Built on technical precision, uncompromising reliability, and
            full-spectrum accountability.
          </p>
        </div>

        {/* Features grid */}
        <div className="why-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="why-card-wrapper">
              <div className="why-card-inner flex h-full flex-col items-start p-6 sm:p-7">
                <div className="why-icon mb-5 flex size-10 items-center justify-center rounded-full border sm:size-11">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </div>

                <h3 className="mb-2 font-display text-[15px] font-medium leading-snug text-fg sm:text-base">
                  {title}
                </h3>

                <p className="text-[13px] leading-[1.8] text-fg-muted sm:text-sm">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}