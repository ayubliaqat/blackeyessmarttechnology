"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapPin, Building2, ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ==========================================================================
   About page: Where We Are Located & Map View
   ========================================================================== */

const HEADING = "Where we are located";

const COVERAGE_CITIES = [
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Gujranwala",
  "Quetta",
  "Hyderabad",
  "Karachi",
];

export default function WhereWeAreLocated() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = { trigger: ".loc-head", start: "top 85%", once: true };

        gsap.from(".loc-word", {
          yPercent: 110,
          opacity: 0,
          rotateX: -25,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: once,
        });

        gsap.from(".loc-content", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".loc-content",
            start: "top 85%",
            once: true,
          },
        });

        gsap.to(".loc-orb", {
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

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="where-we-are-located"
      aria-label="Where we are located"
      className="section loc-sec relative overflow-x-clip"
    >
      <style>{`
        .loc-sec {
          --loc-h2: #1ce8f0;
        }

        .light .loc-sec {
          --loc-h2: #07505a;
        }

        .section.loc-sec {
          padding-top: 2rem;
          padding-bottom: 3.5rem;
        }

        @media (min-width: 640px) {
          .section.loc-sec {
            padding-top: 2.5rem;
            padding-bottom: 4rem;
          }
        }

        .loc-sec .loc-head,
        .loc-sec .loc-head h2 {
          margin-top: 0;
        }

        .loc-sec .loc-head {
          margin-bottom: 24px;
        }

        @media (min-width: 768px) {
          .loc-sec .loc-head {
            margin-bottom: 32px;
          }
        }
      `}</style>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="loc-orb pointer-events-none absolute -right-40 top-10 size-[460px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative">
        {/* Section heading */}
        <div className="section-head section-head--center loc-head">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-edge bg-accent-soft px-4 py-1 text-xs font-medium text-accent">
            <Building2 className="size-3.5" aria-hidden="true" />
            <span>Headquartered in Lahore · Serving Nationwide</span>
          </div>

          <h2
            aria-label={HEADING}
            className="t-h2 font-semibold"
            style={{ color: "var(--loc-h2)" }}
          >
            {HEADING.split(" ").map((word, index) => (
              <span
                key={word + index}
                aria-hidden="true"
                className="mr-[0.2em] inline-block overflow-hidden align-bottom"
              >
                <span className="loc-word inline-block">{word}</span>
              </span>
            ))}
          </h2>

          <p className="loc-head-p t-body max-w-[58ch] text-center">
            Visit our corporate and engineering headquarters in Lahore, or schedule an on-site consultation anywhere across Pakistan.
          </p>
        </div>

        {/* Main Content Grid: Address Details & Interactive Map */}
        <div className="loc-content mx-auto grid max-w-5xl gap-8 lg:grid-cols-5 lg:items-center">
          
          {/* Left Column: Office Details */}
          <div className="rounded-3xl border border-edge bg-bg/60 p-6 backdrop-blur-md sm:p-8 lg:col-span-2">
            <div className="flex items-center gap-2.5 text-accent font-semibold text-base">
              <MapPin className="size-5 shrink-0" />
              <span>Lahore Headquarters</span>
            </div>

            <div className="mt-4 space-y-3 text-sm text-fg-muted leading-relaxed">
              <p className="font-medium text-fg">
                Office G-28, Nayab Square,<br />
                Saadat Town, Bedian Road,<br />
                Lahore, Pakistan
              </p>
              <p>
                <strong className="text-fg">Postal Code:</strong> <span className="font-mono text-accent">54000</span>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-edge">
              <p className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                Nationwide Deployment Zones
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {COVERAGE_CITIES.map((city) => (
                  <span
                    key={city}
                    className="rounded-full border border-edge bg-bg px-2.5 py-1 text-[11px] font-medium text-fg"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Nayab+Square+Saadat+Town+Bedian+Road+Lahore"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="size-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Google Map */}
          <div className="relative overflow-hidden rounded-3xl border border-edge bg-bg/40 shadow-xl lg:col-span-3">
            <div className="aspect-[16/11] w-full">
              <iframe
                title="Black Eyes Smart Technology Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.0!2d74.4!3d31.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zQmVkaWFuIFJvYWQsIExhaG9yZQ!5e0!3m2!1sen!2spk!4v1650000000000!5m2!1sen!2spk"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full grayscale contrast-125 opacity-90 hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}