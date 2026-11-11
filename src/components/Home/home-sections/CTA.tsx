"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADING = "Ready to make your space smarter?";

/* ==========================================================================
   Contact CTA
   Same tokens, type scale and spacing as the other sections.
   ========================================================================== */

export default function ContactCTA() {
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

        gsap.from(".cta-card", {
          y: 28,
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

        gsap.from(".cta-p, .cta-actions", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: once(".cta-card", "top 75%"),
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
        /* ----------------------------------------------------------
           Compact spacing (matches the other sections)
        ---------------------------------------------------------- */

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

        .cta-sec {
          --n-dark: rgba(0, 0, 0, .55);
          --n-light: rgba(255, 255, 255, .045);
        }

        html.light .cta-sec {
          --n-dark: rgba(30, 45, 70, .16);
          --n-light: rgba(255, 255, 255, 1);
        }

        /* Raised (neumorphic) card: same surface as the page, soft dual shadow */
        .cta-card {
          background: var(--bg);
          box-shadow:
            10px 10px 24px var(--n-dark),
            -8px -8px 20px var(--n-light);
        }

        .cta-secondary {
          background: var(--bg);
          color: var(--fg-muted);
          box-shadow:
            5px 5px 12px var(--n-dark),
            -4px -4px 10px var(--n-light);
          transition: color 300ms ease, box-shadow 300ms ease;
        }

        .cta-secondary:active {
          box-shadow:
            inset 3px 3px 7px var(--n-dark),
            inset -3px -3px 7px var(--n-light);
        }

        @media (hover: hover) {
          .cta-secondary:hover {
            color: var(--accent);
          }
        }

        .cta-actions a svg {
          transition: transform 300ms ease;
        }

        .cta-actions a:hover svg {
          transform: translateX(3px);
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-secondary,
          .cta-actions a svg {
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="container-x relative">
        <div className="cta-card relative rounded-card px-6 py-10 sm:px-12 sm:py-12 lg:px-20 lg:py-14">
          <div className="section-head section-head--center relative mx-auto max-w-3xl">
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
                  <span className="cta-word inline-block">{word}</span>
                </span>
              ))}
            </h2>

            <p className="cta-p t-body max-w-[54ch] text-center">
              Whether you&apos;re securing your property or upgrading your
              space with smart technology, let&apos;s build a solution that
              works for you.
            </p>
          </div>

          <div className="cta-actions relative mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4 lg:mt-8">
            <Link href="/contact" className="btn btn--primary">
              Request a consultation
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>

            <Link
              href="#services"
              className="cta-secondary inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
            >
              Explore our services
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}