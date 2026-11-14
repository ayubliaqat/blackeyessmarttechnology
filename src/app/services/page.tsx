"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Wrench, MessageSquare, ArrowRight, ShieldCheck, PhoneCall } from "lucide-react";

import UniversalHero from "@/components/Universal/hero";
import Services from "@/components/Home/home-sections/Services";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ServicesPage() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = rootRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".services-cta-anim", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".services-cta-sec",
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
    <main ref={rootRef} className="overflow-x-clip">
      {/* 1. Universal Hero Section */}
      <UniversalHero
        title="Our Security Services"
        subtitle="Explore our comprehensive suite of advanced surveillance installations, smart electronic security systems, and robust maintenance solutions tailored for residential and commercial properties."
        badgeText="Professional Solutions"
        badgeIcon={Wrench}
        primaryButton={{
          text: "Get a Quote",
          href: "/contact",
          icon: ArrowRight,
        }}
        secondaryButton={{
          text: "About Us",
          href: "/about",
          icon: MessageSquare,
        }}
      />

      {/* 2. Reused Top Services Section from Home */}
      <Services />

      {/* 3. Call to Action Section */}
      <section
        aria-label="Schedule a security consultation"
        className="section services-cta-sec relative w-full py-16 sm:py-20 lg:py-24 bg-bg"
      >
        <style>{`
          .services-cta-sec {
            --cta-h2: #1ce8f0;
          }
          .light .services-cta-sec {
            --cta-h2: #07505a;
          }
        `}</style>

        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="services-cta-anim mx-auto max-w-5xl relative overflow-hidden rounded-[0_28px_0_28px] border border-edge bg-bg p-8 sm:p-12 lg:p-14 text-center transition-all duration-300 hover:border-accent">
            
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-edge bg-accent-soft px-4 py-1.5 text-[11px] font-medium text-accent">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              <span>Custom Site Assessment</span>
            </div>

            {/* Heading */}
            <h2
              className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl"
              style={{ color: "var(--cta-h2)" }}
            >
              Ready to secure your property with precision?
            </h2>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-2xl text-[14px] leading-relaxed text-fg-muted">
              Schedule an on-site survey with our engineering team. We assess blind spots, lighting conditions, and infrastructure needs to design a tailored surveillance setup.
            </p>

            {/* Dual Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-[0_16px_0_16px] border border-accent bg-accent px-6 py-3 text-[13px] font-medium text-bg transition-all duration-300 hover:opacity-90 hover:shadow-lg"
              >
                <span>Request Free Consultation</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[0_16px_0_16px] border border-edge bg-bg px-6 py-3 text-[13px] font-medium text-fg transition-all duration-300 hover:border-accent hover:text-accent"
              >
                <PhoneCall className="size-4 text-accent" />
                <span>Talk to an Engineer</span>
              </Link>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}