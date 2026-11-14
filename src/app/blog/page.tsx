"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Newspaper, MessageSquare, ArrowRight } from "lucide-react";

import UniversalHero from "@/components/Universal/hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function BlogPage() {
  const rootRef = useRef<HTMLElement>(null);

  return (
    <main ref={rootRef} className="overflow-x-clip">
      {/* 1. Universal Hero Section */}
      <UniversalHero
        title="Security Insights & Articles"
        subtitle="Stay informed with expert advice on electronic security trends, surveillance optimization, smart home automation, and best practices for property protection."
        badgeText="Industry Blog"
        badgeIcon={Newspaper}
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

      {/* 2. Blog posts grid or upcoming sections will go here */}
      <section className="section py-16 lg:py-24">
        <div className="container-x text-center">
          <p className="text-sm text-fg-muted">
            Articles and insights list coming up next...
          </p>
        </div>
      </section>
    </main>
  );
}