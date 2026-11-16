"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LucideIcon, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ButtonConfig {
  text: string;
  href: string;
  icon?: LucideIcon;
}

interface PageHeroProps {
  title: string;
  subtitle: string;
  light?: boolean;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
}

export default function UniversalHero({
  title,
  subtitle,
  light = false,
  primaryButton = {
    text: "Our Services",
    href: "/services",
    icon: ArrowRight,
  },
  secondaryButton,
}: PageHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = rootRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = (trigger: string, start = "top 85%") => ({
          trigger,
          start,
          once: true,
        });

        gsap.from(".hero-word", {
          yPercent: 110,
          opacity: 0,
          rotateX: -25,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: once(".hero-head-sec"),
        });

        gsap.from(".hero-content-anim", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: once(".hero-head-sec"),
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      aria-label="Page header"
      className="section hero-head-sec relative w-full overflow-x-clip bg-bg"
    >
      <style>{`
        .section.hero-head-sec {
          padding-top: 4rem;
          padding-bottom: 3rem;
          padding-left: 0;
          padding-right: 0;
          border-bottom: 1px solid var(--edge);
        }

        @media (min-width: 640px) {
          .section.hero-head-sec {
            padding-top: 5rem;
            padding-bottom: 3.5rem;
          }
        }
      `}</style>

      {/* Edge-to-edge full width */}
      <div className="w-full pt-6 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="hero-head-sec flex flex-col items-center justify-center text-center mx-auto max-w-5xl">
          
          {/* Title styled with exact landing hero typography, accent color, text-shadow glow, and perspective */}
          <h1
            className="hero-left-title font-extrabold leading-[1.05] tracking-tight [perspective:600px] max-w-4xl mx-auto"
            style={{
              fontSize: "var(--fs-hero, 2.35rem)",
              color: "var(--accent)",
              textShadow: light
                ? "none"
                : "0 0 24px rgba(28, 232, 240, 0.35), 0 0 56px rgba(28, 232, 240, 0.18)",
            }}
          >
            {title.split(" ").map((word, i, arr) => (
              <span key={word + i} className="inline-block">
                <span className="hero-word inline-block will-change-transform">
                  {word}
                </span>
                {i < arr.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="hero-content-anim mt-4 max-w-2xl mx-auto text-center text-[14px] leading-relaxed text-fg-muted px-4">
            {subtitle}
          </p>

          {/* Dynamic CTA Buttons */}
          {(primaryButton || secondaryButton) && (
            <div className="hero-content-anim mt-8 flex flex-wrap items-center justify-center gap-4">
              
              {/* Primary Button */}
              {primaryButton && (
                <Link
                  href={primaryButton.href}
                  className="group inline-flex items-center gap-2 rounded-[0_16px_0_16px] border border-accent bg-accent px-6 py-3 text-[13px] font-medium text-bg transition-all duration-300 hover:opacity-90 hover:shadow-lg"
                >
                  <span>{primaryButton.text}</span>
                  {primaryButton.icon && <primaryButton.icon className="size-4 transition-transform duration-300 group-hover:translate-x-1" />}
                </Link>
              )}

              {/* Secondary Button */}
              {secondaryButton && (
                <Link
                  href={secondaryButton.href}
                  className="inline-flex items-center gap-2 rounded-[0_16px_0_16px] border border-edge bg-bg px-6 py-3 text-[13px] font-medium text-fg transition-all duration-300 hover:border-accent hover:text-accent"
                >
                  {secondaryButton.icon && <secondaryButton.icon className="size-4 text-accent" />}
                  <span>{secondaryButton.text}</span>
                </Link>
              )}

            </div>
          )}

        </div>
      </div>
    </section>
  );
}