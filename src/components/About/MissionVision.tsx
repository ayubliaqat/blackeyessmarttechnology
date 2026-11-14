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
              Driven by purpose, guided by vision
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-fg-muted">
              Our foundational commitments define how we engineer security solutions and scale robust surveillance frameworks for every client.
            </p>
          </div>

          {/* Two-Card Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Mission Card */}
            <div className="mv-item relative overflow-hidden rounded-[0_28px_0_28px] border border-edge bg-bg p-8 sm:p-10 transition-all duration-300 hover:border-accent">
              
              {/* Header with Icon on the Left */}
              <div className="flex items-center gap-4 mb-6">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-edge bg-accent-soft text-accent">
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

            {/* Vision Card */}
            <div className="mv-item relative overflow-hidden rounded-[0_28px_0_28px] border border-edge bg-bg p-8 sm:p-10 transition-all duration-300 hover:border-accent">
              
              {/* Header with Icon on the Left */}
              <div className="flex items-center gap-4 mb-6">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-edge bg-accent-soft text-accent">
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
    </section>
  );
}