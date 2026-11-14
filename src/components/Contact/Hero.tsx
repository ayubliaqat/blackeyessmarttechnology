"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MessageSquareText } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HEADING = "Let's talk";

export default function ContactHeader() {
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

        gsap.from(".contact-word", {
          yPercent: 110,
          opacity: 0,
          rotateX: -25,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: once(".contact-head-sec"),
        });

        gsap.from(".contact-head-p", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: once(".contact-head-sec"),
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="contact-header"
      aria-label="Contact header"
      className="section contact-head-sec relative w-full overflow-x-clip bg-bg"
    >
      <style>{`
        .contact-head-sec {
          --contact-h2: #1ce8f0;
        }

        .light .contact-head-sec {
          --contact-h2: #07505a;
        }

        .section.contact-head-sec {
          padding-top: 2rem;
          padding-bottom: 2.5rem;
          padding-left: 0;
          padding-right: 0;
          border-bottom: 1px solid var(--edge);
        }

        @media (min-width: 640px) {
          .section.contact-head-sec {
            padding-top: 2.5rem;
            padding-bottom: 3rem;
          }
        }
      `}</style>

      {/* Edge-to-edge full width with zero side spacing */}
      <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
        <div className="contact-head-sec flex flex-col items-center justify-center text-center">
          <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-edge bg-accent-soft px-3.5 py-1 text-[11px] font-medium text-accent">
            <MessageSquareText className="size-3.5" aria-hidden="true" />
            <span>Get In Touch</span>
          </div>

          <h2
            className="t-h2 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.5rem]"
            style={{ color: "var(--contact-h2)" }}
          >
            {HEADING.split(" ").map((word, index) => (
              <span
                key={word + index}
                aria-hidden="true"
                className="mr-[0.2em] inline-block overflow-hidden align-bottom"
              >
                <span className="contact-word inline-block">{word}</span>
              </span>
            ))}
          </h2>

          <p className="contact-head-p mt-2.5 max-w-[44ch] text-center text-[14px] leading-relaxed text-fg-muted">
            Have a question or ready to secure your property? Drop us a message below.
          </p>
        </div>
      </div>
    </section>
  );
}