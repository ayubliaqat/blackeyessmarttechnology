"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MessageSquareText, Shield, ArrowRight } from "lucide-react";

import UniversalHero from "@/components/Universal/hero";
import ContactForm from "@/components/Contact/ContactForm";
import ContactInfo from "@/components/Contact/ContactInfo";

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
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <main ref={rootRef} className="overflow-x-clip">
      {/* Universal Hero with Custom Button Props */}
      <UniversalHero
        title="Let's talk"
        subtitle="Have a question or ready to secure your property? Drop us a message below."
        badgeText="Get In Touch"
        badgeIcon={MessageSquareText}
        primaryButton={{
          text: "Our Services",
          href: "/services",
          icon: ArrowRight,
        }}
        secondaryButton={{
          text: "About Us",
          href: "/about-us",
          icon: Shield,
        }}
      />

      {/* Contact Form & Information Section */}
      <section className="section py-12 lg:py-16">
        <div className="container-x">
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
    </main>
  );
}