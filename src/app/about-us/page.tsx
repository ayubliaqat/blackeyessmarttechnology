"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Shield, MessageSquare, ArrowRight } from "lucide-react";

import UniversalHero from "@/components/Universal/hero";
import WhoWeAre from "@/components/About/WhoWeAre";
import MissionVision from "@/components/About/MissionVision";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutPage() {
  const rootRef = useRef<HTMLElement>(null);

  return (
    <main ref={rootRef} className="overflow-x-clip">
      {/* 1. Universal Hero Section */}
      <UniversalHero
        title="About Our Company"
        subtitle="Discover how Black Eyes Smart Technology engineers advanced electronic security and high-definition surveillance infrastructure for absolute property defense."
        badgeText="Company Overview"
        badgeIcon={Shield}
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
    </main>
  );
}