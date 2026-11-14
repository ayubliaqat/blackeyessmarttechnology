"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Target, Compass } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function MissionVision() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = rootRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".mv-item", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            once: true,
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
      id="mission-vision"
      aria-label="Our Mission and Vision"
      className="section mv-section relative w-full py-16 sm:py-20 lg:py-24 bg-bg border-b border-edge"
    >
      <style>{`
        .mv-section {
          --mv-h2: #1ce8f0;
          --mv-h3: #1ce8f0;
        }
        .light .mv-section {
          --mv-h2: #07505a;
          --mv-h3: #07505a;
        }

        /* Smooth Interactive Card Styles */
        .mv-card {
          position: relative;
          overflow: hidden;
          border-radius: 0 28px 0 28px;
          border: 1px solid var(--edge);
          background: var(--bg);
          transition:
            transform 400ms cubic-bezier(.16, 1, .3, 1),
            border-color 300ms ease,
            box-shadow 400ms ease,
            background-color 400ms ease;
        }

        .mv-card-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          border-radius: inherit;
          transition: background-color 400ms ease;
        }

        @media (hover: hover) {
          .mv-card:hover {
            transform: translateY(-4px);
            border-color: var(--accent);
            box-shadow: 0 20px 40px -18px color-mix(in srgb, var(--accent) 35%, transparent);
            background: var(--bg-alt);
          }

          .mv-card:hover .mv-icon-box {
            border-color: var(--accent);
            background: var(--accent);
            color: var(--bg);
          }
        }

        .mv-icon-box {
          transition:
            border-color 300ms ease,
            background-color 300ms ease,
            color 300ms ease;
        }
      `}</style>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          
          {/* Section Header */}
          <div className="mv-item text-center max-w-3xl mx-auto mb-12 lg:mb-16">
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-edge bg-accent-soft px-3.5 py-1 text-[11px] font-medium text-accent">
              <Compass className="size-3.5" aria-hidden="true" />
              <span>Purpose &amp; Outlook</span>
            </div>
            <h2 
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
              style={{ color: "var(--mv-h2)" }}
            >
              What We Stand For
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-fg-muted">
              Our foundational commitments define how we engineer security solutions and scale robust surveillance frameworks for every client.
            </p>
          </div>

          {/* Two-Card Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Mission Card */}
            <div className="mv-item mv-card p-8 sm:p-10">
              <div className="mv-card-inner">
                {/* Header with Icon on the Left */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="mv-icon-box inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-edge bg-accent-soft text-accent">
                    <Target className="size-5" />
                  </div>
                  <h3 
                    className="text-xl font-semibold"
                    style={{ color: "var(--mv-h3)" }}
                  >
                    Our Mission
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[14px] leading-relaxed text-fg-muted">
                  To deliver uncompromising electronic security and high-definition surveillance infrastructure that guarantees absolute safety for residential, commercial, and industrial properties. We achieve this through meticulous hardware calibration, reliable technical support, and strict engineering standards.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="mv-item mv-card p-8 sm:p-10">
              <div className="mv-card-inner">
                {/* Header with Icon on the Left */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="mv-icon-box inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-edge bg-accent-soft text-accent">
                    <Compass className="size-5" />
                  </div>
                  <h3 
                    className="text-xl font-semibold"
                    style={{ color: "var(--mv-h3)" }}
                  >
                    Our Vision
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[14px] leading-relaxed text-fg-muted">
                  To become Pakistan&apos;s most trusted technology partner for intelligent security systems and automated monitoring solutions. By uniting state-of-the-art camera tech with theme-aware responsive control interfaces, we set the benchmark for modern property protection.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}