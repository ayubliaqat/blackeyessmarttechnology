"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LucideIcon, Sparkles, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ButtonConfig {
  text: string;
  href: string;
  icon?: LucideIcon;
}

interface PageHeroProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeIcon?: LucideIcon;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
}

export default function UniversalHero({
  title,
  subtitle,
  badgeText = "Overview",
  badgeIcon: Icon = Sparkles,
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
        .hero-head-sec {
          --hero-h2: #1ce8f0;
        }

        .light .hero-head-sec {
          --hero-h2: #07505a;
        }

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
          
          {/* Badge */}
          <div className="hero-content-anim mb-4 inline-flex items-center gap-1.5 rounded-full border border-edge bg-accent-soft px-4 py-1.5 text-[11px] font-medium text-accent">
            <Icon className="size-3.5" aria-hidden="true" />
            <span>{badgeText}</span>
          </div>

          {/* Title */}
          <h1
            className="t-h2 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]"
            style={{ color: "var(--hero-h2)" }}
          >
            {title.split(" ").map((word, index) => (
              <span
                key={word + index}
                aria-hidden="true"
                className="mr-[0.2em] inline-block overflow-hidden align-bottom"
              >
                <span className="hero-word inline-block">{word}</span>
              </span>
            ))}
          </h1>

          {/* Subtitle with slightly increased top spacing (mt-4) */}
          <p className="hero-content-anim mt-4 max-w-4xl text-center text-[14px] leading-relaxed text-fg-muted px-4">
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