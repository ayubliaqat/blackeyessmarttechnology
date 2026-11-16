"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Shield, MessageSquare, ArrowRight } from "lucide-react";

import UniversalHero from "@/components/Universal/hero";
import WhoWeAre from "@/components/About/WhoWeAre";
import MissionVision from "@/components/About/MissionVision";
import WhereWeServe from "@/components/About/WhereWeServe";
import CallToAction from "@/components/Universal/CallToAction";
import FaqSection, { FaqItem } from "@/components/Universal/FAQSection";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ABOUT_FAQS: FaqItem[] = [
  {
    q: "Who is Black Eyes Smart Technology?",
    a: "We are a specialized electronic security and smart automation engineering company delivering reliable CCTV surveillance, access control, fire alarms, and networking infrastructure for homes and businesses.",
  },
  {
    q: "What makes your security installations different from standard setups?",
    a: "We never rely on one-size-fits-all kits. Every project starts with a thorough site assessment to eliminate blind spots, optimize night-vision coverage, and ensure clean, concealed cabling built for long-term reliability.",
  },
  {
    q: "Which regions and property types do you serve?",
    a: "We serve residential homes, housing societies, retail outlets, corporate offices, warehouses, and industrial facilities across our service areas, scaling each system to match the exact layout and risk profile of the site.",
  },
  {
    q: "Do you handle both hardware supply and end-to-end installation?",
    a: "Yes. From system architecture and genuine hardware sourcing to physical mounting, network configuration, and mobile app setup, our in-house engineers manage the entire deployment.",
  },
  {
    q: "Can you upgrade or integrate with an existing security system?",
    a: "In most cases, yes. During our initial evaluation, we inspect your existing cameras, cabling, and network hardware to see what can be retained and upgraded seamlessly without unnecessary replacement costs.",
  },
  {
    q: "What kind of ongoing maintenance and support do you provide?",
    a: "We back every installation with responsive 24/7 technical support, routine health checks, and rapid troubleshooting so your cameras, alarms, and smart controls stay online around the clock.",
  },
];

export default function AboutPage() {
  const rootRef = useRef<HTMLElement>(null);

  return (
    <main ref={rootRef} className="overflow-x-clip">
      {/* 1. Universal Hero Section */}
      <UniversalHero
        title="About Our Company"
        subtitle="Discover how Black Eyes Smart Technology engineers advanced electronic security and high-definition surveillance infrastructure for absolute property defense."
        primaryButton={{
          text: "Our Services",
          href: "/services",
          icon: ArrowRight,
        }}
        secondaryButton={{
          text: "Contact Us",
          href: "/contact-us",
          icon: MessageSquare,
        }}
      />

      {/* 2. Who We Are Section */}
      <WhoWeAre />

      {/* 3. Mission & Vision Section */}
      <MissionVision />

      {/* 4. Where We Serve Section */}
      <WhereWeServe />

      {/* 6. Call to Action Section */}
      <CallToAction />
      {/* 5. About FAQ Section */}
      <FaqSection
        id="about-faq"
        eyebrow="About Us · FAQ"
        title="Questions About Our Company"
        description="Learn more about how we engineer, deploy, and support residential and commercial security systems."
        cta={{ label: "Book a Free Consultation", href: "/meeting" }}
        items={ABOUT_FAQS}
        withSchema
      />
    </main>
  );
}