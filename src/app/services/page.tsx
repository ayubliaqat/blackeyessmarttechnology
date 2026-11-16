"use client";

import { Wrench, MessageSquare, ArrowRight } from "lucide-react";

import UniversalHero from "@/components/Universal/hero";
import Services from "@/components/Home/home-sections/Services";
import CallToAction from "@/components/Universal/CallToAction"; // Update path if located elsewhere

export default function ServicesPage() {
  return (
    <main className="overflow-x-clip">
      {/* 1. Universal Hero Section */}
      <UniversalHero
        title="Our Security Services"
        subtitle="Explore our comprehensive suite of advanced surveillance installations, smart electronic security systems, and robust maintenance solutions tailored for residential and commercial properties."
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

      {/* 3. Reusable Call to Action Section */}
      <CallToAction />
    </main>
  );
}