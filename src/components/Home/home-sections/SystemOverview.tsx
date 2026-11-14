"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADING = "See our systems in action";

/* ==========================================================================
   System Overview Section
   Matches the design tokens, heading style, and spacing of other sections.
   ========================================================================== */

export default function SystemOverview() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = rootRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = (trigger: string, start = "top 85%") => ({
          trigger,
          start,
          once: true,
        });

        gsap.from(".overview-word", {
          yPercent: 110,
          opacity: 0,
          rotateX: -25,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: once(".overview-head"),
        });

        gsap.from(".overview-head-p, .overview-grid > div", {
          y: 28,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: once(".overview-head", "top 82%"),
        });

        gsap.to(".overview-orb", {
          yPercent: 35,
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

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="system-overview"
      aria-label="System overview"
      className="section overview-sec relative overflow-x-clip"
    >
      <style>{`
        .overview-sec {
          --overview-h2: #1ce8f0;
        }

        .light .overview-sec {
          --overview-h2: #07505a;
        }

        .section.overview-sec {
          padding-top: 1.5rem;
          padding-bottom: 2.5rem;
        }

        @media (min-width: 640px) {
          .section.overview-sec {
            padding-top: 2rem;
            padding-bottom: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .section.overview-sec {
            padding-top: 2.5rem;
            padding-bottom: 3.5rem;
          }
        }

        .overview-rule {
          display: block;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.8;
        }

        .overview-dot {
          flex-shrink: 0;
          margin-top: 0.62em;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: var(--accent);
          box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 55%, transparent);
        }
      `}</style>

      {/* Ambient theme-aware glow */}
      <div
        aria-hidden="true"
        className="overview-orb pointer-events-none absolute left-1/2 top-[45%] size-[460px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative">
        {/* Section heading */}
        <div className="section-head section-head--center overview-head mb-8 lg:mb-10">
          <h2
            className="t-h2 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.65rem]"
            style={{ color: "var(--overview-h2)" }}
          >
            {HEADING.split(" ").map((word, index) => (
              <span
                key={word + index}
                aria-hidden="true"
                className="mr-[0.2em] inline-block overflow-hidden align-bottom"
              >
                <span className="overview-word inline-block">{word}</span>
              </span>
            ))}
          </h2>

          <p className="overview-head-p mt-2.5 max-w-[54ch] text-center text-[12px] leading-relaxed text-fg-muted">
            Watch how our integrated surveillance workflows and hardware setups
            operate seamlessly in real-world environments.
          </p>
        </div>

        {/* 2-Column Grid (Video + Text) integrated directly into the section */}
        <div className="overview-grid grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Side: Video Player */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-edge bg-bg-alt shadow-lg">
            <video
              className="h-full w-full object-cover"
              controls
              poster="/images/video-poster.jpg"
              preload="metadata"
            >
              <source src="/videos/blackeyes.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Right Side: Narrative Content */}
          <div className="flex flex-col items-start text-left">
            <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-edge bg-accent-soft px-3.5 py-1 text-[11px] font-medium text-accent">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              <span>Live System Demonstration</span>
            </div>

            <h3
              className="mb-3 font-display text-xl font-semibold tracking-tight sm:text-2xl"
              style={{ color: "var(--overview-h2)" }}
            >
              Engineered for absolute reliability
            </h3>

            <span className="overview-rule mb-4" aria-hidden="true" />

            <p className="text-[12px] leading-[1.7] text-fg-muted sm:text-[13px]">
              Every installation we perform follows rigorous standards—from
              clean structured cabling to precise camera positioning and instant
              mobile alerts. Experience firsthand how our technology keeps your
              property fully secured around the clock.
            </p>

            <ul className="mt-5 w-full space-y-2.5">
              {[
                "Crystal-clear high-definition monitoring footage",
                "Robust structured cabling and clean hardware layout",
                "Seamless integration with mobile and remote control apps",
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-[12px] leading-[1.6] text-fg-muted"
                >
                  <span className="overview-dot" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}