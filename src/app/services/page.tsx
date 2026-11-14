"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Wrench, MessageSquare, ArrowRight } from "lucide-react";

import UniversalHero from "@/components/Universal/hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ServicesPage() {
  const rootRef = useRef<HTMLElement>(null);

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
          href: "/contact-us",
          icon: ArrowRight,
        }}
        secondaryButton={{
          text: "About Us",
          href: "/about-us",
          icon: MessageSquare,
        }}
      />

      {/* 2. Remaining sections will be added here next */}
      <section className="section py-16 lg:py-24">
        <div className="container-x text-center">
          <p className="text-sm text-fg-muted">
            Service grid and detailed modular components coming up next...
          </p>
        </div>
      </section>
    </main>
  );
}