import FeaturesGrid from "@/components/services/FeaturesGrid";
import InstallationWorkflow from "@/components/services/InstallationWorkflow";
import SectorsGrid from "@/components/services/SectorsGrid";
import CallToAction from "@/components/Universal/CallToAction";
import FaqSection from "@/components/Universal/FAQSection";
import UniversalHero from "@/components/Universal/hero";
import type { Metadata } from "next";

/* ==========================================================================
   SEO Metadata for Service Page
   ========================================================================== */
export const metadata: Metadata = {
  title: "Professional CCTV Surveillance & Security Systems in Lahore | Black Eyes",
  description: "Get enterprise-grade CCTV surveillance installations, 4K night vision cameras, and remote mobile monitoring across Lahore and Pakistan by Black Eyes Smart Technology.",
  keywords: ["CCTV installation Lahore", "security cameras Pakistan", "surveillance systems", "Black Eyes Smart Technology"],
};

export default function CctvServicePage() {
  return (
    <main className="w-full bg-bg">
      {/* 1. Hero Section with updated title, subtitle, and action buttons */}
      <UniversalHero
        title="Secure Your Home or Business with CCTV Surveillance"
        subtitle="Secure your home, office, or industrial property in Lahore with high-definition cameras, 24/7 night vision, and remote mobile monitoring engineered by Black Eyes."
        primaryButton={{
          text: "Book a Meeting",
          href: "/contact-us",
        }}
        secondaryButton={{
          text: "Get a Quote",
          href: "/quote",
        }}
      />

      {/* 
        TODO: Next modular service sections to insert here one by one:
        - FeaturesGrid (Technical specs & hardware highlights)
        - InstallationWorkflow (Step-by-step installation process)
        - SectorsGrid (Properties we secure: Residential, Commercial, Industrial)
      */}

      {/* 2. FAQ Section */}
      <FeaturesGrid />
      <InstallationWorkflow />
      <SectorsGrid/>
      <FaqSection />

      {/* 3. Final Conversion CTA */}
      <CallToAction />
    </main>
  );
}