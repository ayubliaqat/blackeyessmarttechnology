"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FolderGit2, MessageSquare, ArrowRight } from "lucide-react";

import UniversalHero from "@/components/Universal/hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProjectsPage() {
  const rootRef = useRef<HTMLElement>(null);

  return (
    <main ref={rootRef} className="overflow-x-clip">
      {/* 1. Universal Hero Section */}
      <UniversalHero
        title="Our Featured Projects"
        subtitle="Explore our portfolio of successfully engineered electronic security installations, high-definition surveillance networks, and smart property integrations."
        badgeText="Portfolio Showcase"
        badgeIcon={FolderGit2}
        primaryButton={{
          text: "Get a Quote",
          href: "/contact",
          icon: ArrowRight,
        }}
        secondaryButton={{
          text: "Contact Us",
          href: "/contact",
          icon: MessageSquare,
        }}
      />

      {/* 2. Projects grid or upcoming sections will go here */}
      <section className="section py-16 lg:py-24">
        <div className="container-x text-center">
          <p className="text-sm text-fg-muted">
            Projects gallery and case studies coming up next...
          </p>
        </div>
      </section>
    </main>
  );
}