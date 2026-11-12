"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADING = "Ready to enhance your security?";

/* ==========================================================================
   Contact CTA
   Polished transitions, smooth hover physics, and seamless design tokens.
   ========================================================================== */

export default function ContactCTA() {
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

        gsap.from(".cta-card", {
          y: 30,
          opacity: 0,
          scale: 0.98,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: once(".cta-card"),
        });

        gsap.from(".cta-word", {
          yPercent: 110,
          opacity: 0,
          rotateX: -25,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: once(".cta-card", "top 75%"),
        });

        gsap.from(".cta-p, .cta-actions, .cta-badge", {
          y: 16,
          opacity: 0,
          duration: 0.8,
          delay: 0.15,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: once(".cta-card", "top 75%"),
        });

        gsap.to(".cta-orb", {
          yPercent: 25,
          xPercent: -8,
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
      id="contact-cta"
      aria-label="Contact us"
      className="section cta-sec relative overflow-x-clip"
    >
      <style>{`
        .cta-sec {
          --cta-h2: #1ce8f0;
        }

        html.light .cta-sec {
          --cta-h2: #07505a;
        }

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

        /* ----------------------------------------------------------
           Smooth Beam Animation for Border Glow
        ---------------------------------------------------------- */
        @keyframes cta-beam {
          to { transform: rotate(360deg); }
        }

        .cta-card {
          position: relative;
          overflow: hidden;
          padding: 1px;
          border-radius: 0 28px 0 28px;
          background: var(--edge);
          isolation: isolate;
          will-change: transform, box-shadow;
          transition:
            transform 500s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 500ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cta-card::before {
          content: "";
          position: absolute;
          inset: -60%;
          z-index: 0;
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            transparent 280deg,
            var(--accent) 360deg
          );
          opacity: 0.6;
          animation: cta-beam 8s linear infinite;
        }

        .cta-card-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          border-radius: inherit;
          background: var(--bg);
          transition: background-color 400ms ease;
        }

        /* ----------------------------------------------------------
           Badge & Interactive Elements Transitions
        ---------------------------------------------------------- */
        .cta-badge {
          background: var(--accent-soft);
          border: 1px solid color-mix(in srgb, var(--accent) 25%, var(--edge));
          transition: border-color 300ms ease;
        }

        .cta-secondary {
          background: var(--bg);
          color: var(--fg-muted);
          border: 1px solid var(--edge);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          transition:
            color 300ms cubic-bezier(0.16, 1, 0.3, 1),
            background-color 300ms cubic-bezier(0.16, 1, 0.3, 1),
            border-color 300ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cta-actions a svg {
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        @media (hover: hover) {
          .cta-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px -16px color-mix(in srgb, var(--accent) 28%, transparent);
          }

          .cta-card:hover .cta-card-inner {
            background: var(--bg-alt);
          }

          .cta-secondary:hover {
            color: var(--accent);
            border-color: var(--accent);
            background: var(--accent-soft);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px -8px color-mix(in srgb, var(--accent) 20%, transparent);
          }

          .cta-secondary:hover svg,
          .cta-actions a:first-child:hover svg {
            transform: translateX(3px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-card::before {
            animation: none !important;
          }
          .cta-card,
          .cta-secondary,
          .cta-actions a svg {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="cta-orb pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[450px] rounded-full opacity-35 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="container-x relative">
        <div className="cta-card">
          <div className="cta-card-inner px-6 py-12 sm:px-12 sm:py-14 lg:px-20 lg:py-16">
            <div className="section-head section-head--center relative mx-auto max-w-3xl">
              {/* Trust Badge */}
              <div className="cta-badge inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-accent mb-5">
                <ShieldCheck className="size-4" aria-hidden="true" />
                <span>Expert Security Consultation</span>
              </div>

              <h2
                aria-label={HEADING}
                className="t-h2 font-semibold tracking-tight"
                style={{ color: "var(--cta-h2)" }}
              >
                {HEADING.split(" ").map((word, index) => (
                  <span
                    key={word + index}
                    aria-hidden="true"
                    className="mr-[0.2em] inline-block overflow-hidden align-bottom"
                  >
                    <span className="cta-word inline-block">
                      {word}
                      {index === 1 ? (
                        <span className="text-accent"> </span>
                      ) : null}
                    </span>
                  </span>
                ))}
              </h2>

              <p className="cta-p t-body mx-auto mt-3 max-w-[54ch] text-center text-fg-muted">
                Whether you&apos;re securing your property or upgrading your
                space with smart technology, let&apos;s build a solution that
                works flawlessly for you.
              </p>
            </div>

            <div className="cta-actions relative mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:mt-9">
              <Link href="/contact" className="btn btn--primary">
                <span>Request a consultation</span>
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>

              <Link
                href="#services"
                className="cta-secondary inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide"
              >
                <span>Explore our services</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}