"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import ContactForm from "@/components/Contact/ContactForm";
import ContactInfo from "@/components/Contact/ContactInfo";
import Hero from "@/components/Contact/Hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ContactPage() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = rootRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".contact-card-anim", {
          y: 32,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".contact-grid",
            start: "top 82%",
            once: true,
          },
        });

        gsap.to(".contact-orb", {
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
      id="contact"
      aria-label="Contact us"
      className="section contact-sec relative overflow-x-clip"
    >
      <style>{`
        .section.contact-sec {
          padding-top: 2rem;
          padding-bottom: 3.5rem;
        }

        @media (min-width: 640px) {
          .section.contact-sec {
            padding-top: 2.5rem;
            padding-bottom: 4rem;
          }
        }

        @media (min-width: 1024px) {
          .section.contact-sec {
            padding-top: 3rem;
            padding-bottom: 5rem;
          }
        }
      `}</style>

      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="contact-orb pointer-events-none absolute right-1/4 top-1/3 size-[460px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative">
        {/* Section 1: Header */}
        <div className="mb-10 lg:mb-12">
          <Hero />
        </div>

        {/* Section 2 & Section 3 Grid */}
        <div className="contact-grid grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="contact-card-anim lg:col-span-7">
            <ContactForm />
          </div>
          <div className="contact-card-anim lg:col-span-5">
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
}