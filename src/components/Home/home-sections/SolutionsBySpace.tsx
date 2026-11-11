"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  House,
  Building2,
  Store,
  Warehouse,
  Camera,
  Fingerprint,
  AudioLines,
  ScanEye,
  LockKeyhole,
  BellRing,
  ShieldCheck,
  ArrowUpRight,
  Activity,
  Wifi,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type DeviceType =
  | "camera"
  | "motion"
  | "access"
  | "audio"
  | "lock"
  | "alarm";

type Device = {
  type: DeviceType;
  label: string;
  x: number;
  y: number;
};

const DEVICE_ICONS = {
  camera: Camera,
  motion: ScanEye,
  access: Fingerprint,
  audio: AudioLines,
  lock: LockKeyhole,
  alarm: BellRing,
};

const SPACES: {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: typeof House;
  solutions: string[];
  devices: Device[];
}[] = [
  {
    id: "residential",
    name: "Residential",
    subtitle: "Protection starts at home.",
    description:
      "Keep an eye on what matters most with intelligent surveillance and security designed around your home.",
    icon: House,
    solutions: ["CCTV Surveillance", "Smart Door Access", "Intruder Alarms"],
    devices: [
      { type: "camera", label: "Front CCTV", x: 18, y: 23 },
      { type: "motion", label: "Motion Sensor", x: 82, y: 23 },
      { type: "access", label: "Smart Entry", x: 18, y: 77 },
      { type: "alarm", label: "Alarm Sensor", x: 82, y: 77 },
    ],
  },
  {
    id: "commercial",
    name: "Commercial",
    subtitle: "A smarter way to secure business.",
    description:
      "Protect your workplace, employees, and operations with integrated security and controlled access.",
    icon: Building2,
    solutions: ["Business CCTV", "Access Control", "24/7 Monitoring"],
    devices: [
      { type: "camera", label: "IP Camera", x: 18, y: 23 },
      { type: "access", label: "Fingerprint", x: 82, y: 23 },
      { type: "motion", label: "Occupancy Sensor", x: 18, y: 77 },
      { type: "lock", label: "Smart Lock", x: 82, y: 77 },
    ],
  },
  {
    id: "retail",
    name: "Retail",
    subtitle: "Every corner under control.",
    description:
      "Improve visibility across your store, monitor customer areas, and help safeguard valuable inventory.",
    icon: Store,
    solutions: ["Retail CCTV", "Loss Prevention", "Entry Monitoring"],
    devices: [
      { type: "camera", label: "Entry Camera", x: 18, y: 23 },
      { type: "motion", label: "Movement Sensor", x: 82, y: 23 },
      { type: "audio", label: "Audio Detection", x: 18, y: 77 },
      { type: "camera", label: "Stock CCTV", x: 82, y: 77 },
    ],
  },
  {
    id: "industrial",
    name: "Industrial",
    subtitle: "Security on a larger scale.",
    description:
      "Monitor critical facility areas, secure restricted zones, and maintain visibility across operations.",
    icon: Warehouse,
    solutions: ["Perimeter CCTV", "Restricted Access", "Facility Monitoring"],
    devices: [
      { type: "camera", label: "Perimeter CCTV", x: 18, y: 23 },
      { type: "access", label: "Access Scanner", x: 82, y: 23 },
      { type: "audio", label: "Sound Detection", x: 18, y: 77 },
      { type: "alarm", label: "Facility Alarm", x: 82, y: 77 },
    ],
  },
];

const HEADING = "Solutions by space";

/* ==========================================================================
   Solutions by space
   Same tokens, type scale and spacing as Services / Why choose us / Process.
   ========================================================================== */

export default function SolutionsBySpace() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  const [activeSpace, setActiveSpace] = useState(0);
  const active = SPACES[activeSpace];

  /* ---------- Section entrance + ambient motion ---------- */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = (trigger: string, start = "top 85%") => ({
          trigger,
          start,
          once: true,
        });

        gsap.from(".space-word", {
          yPercent: 110,
          opacity: 0,
          rotateX: -25,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: once(".space-head"),
        });

        gsap.from(".space-head-p", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: once(".space-head"),
        });

        gsap.from(".space-selector", {
          y: 24,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: once(".space-selector-list", "top 82%"),
        });

        gsap.from(".space-panel-card", {
          y: 28,
          opacity: 0,
          scale: 0.98,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: once(".space-panel-card", "top 85%"),
        });

        gsap.fromTo(
          ".space-connection",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.85,
            stagger: 0.12,
            ease: "power2.inOut",
            scrollTrigger: once(".space-plan", "top 88%"),
          },
        );

        gsap.to(".space-orb", {
          yPercent: 35,
          xPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.fromTo(
          ".space-scan",
          { top: "0%" },
          {
            top: "100%",
            duration: 3.8,
            repeat: -1,
            repeatDelay: 1.2,
            ease: "none",
          },
        );

        gsap.to(".space-hub-pulse", {
          scale: 1.65,
          opacity: 0,
          duration: 1.8,
          repeat: -1,
          ease: "power1.out",
        });

        gsap.to(".space-status-dot", {
          opacity: 0.3,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          stagger: 0.15,
          ease: "sine.inOut",
        });

        gsap.to(".space-device-halo", {
          opacity: 0.75,
          scale: 1.2,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          stagger: 0.2,
          ease: "sine.inOut",
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  /* ---------- Switching space ---------- */
  useGSAP(
    () => {
      if (!hasMounted.current) {
        hasMounted.current = true;
        return;
      }

      if (!visualRef.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".space-plan-content", { opacity: 1, scale: 1 });
        return;
      }

      const timeline = gsap.timeline();

      timeline
        .fromTo(
          ".space-plan-content",
          { opacity: 0, scale: 0.975 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" },
        )
        .fromTo(
          ".space-connection",
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.65,
            stagger: 0.1,
            ease: "power2.inOut",
          },
          "-=0.35",
        )
        .from(
          ".space-device",
          {
            scale: 0.6,
            opacity: 0,
            y: 10,
            duration: 0.5,
            stagger: 0.11,
            ease: "back.out(1.7)",
          },
          "-=0.35",
        );

      return () => {
        timeline.kill();
      };
    },
    {
      scope: visualRef,
      dependencies: [activeSpace],
      revertOnUpdate: true,
    },
  );

  const changeSpace = (index: number) => {
    if (index === activeSpace) return;

    if (
      !visualRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setActiveSpace(index);
      return;
    }

    gsap.killTweensOf(".space-plan-content");
    gsap.to(".space-plan-content", {
      opacity: 0,
      scale: 0.975,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => setActiveSpace(index),
    });
  };

  return (
    <section
      ref={sectionRef}
      id="solutions-by-space"
      aria-label="Solutions by space"
      className="section space-sec relative overflow-x-clip"
    >
      <style>{`
        /* ----------------------------------------------------------
           Compact spacing (matches Why choose us / Process)
        ---------------------------------------------------------- */

        .section.space-sec {
          padding-top: 1.5rem;
          padding-bottom: 2.5rem;
        }

        @media (min-width: 640px) {
          .section.space-sec {
            padding-top: 2rem;
            padding-bottom: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .section.space-sec {
            padding-top: 2.5rem;
            padding-bottom: 3.5rem;
          }
        }

        .space-sec .space-head,
        .space-sec .space-head h2 {
          margin-top: 0;
        }

        /* ----------------------------------------------------------
           Selector list
        ---------------------------------------------------------- */

        .space-selector {
          transition: border-color 350ms ease, background-color 350ms ease;
        }

        .space-icon {
          transition:
            transform 400ms cubic-bezier(.16, 1, .3, 1),
            border-color 350ms ease,
            background-color 350ms ease,
            color 350ms ease,
            box-shadow 350ms ease;
        }

        .space-selector button:hover .space-icon {
          transform: translateY(-2px);
        }

        .space-arrow {
          transition:
            transform 400ms cubic-bezier(.16, 1, .3, 1),
            color 350ms ease;
        }

        .space-selector button:hover .space-arrow {
          transform: translate(2px, -2px);
        }

        .space-chip {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--fg-muted);
          transition:
            color 300ms ease,
            border-color 300ms ease,
            background-color 300ms ease;
        }

        @media (hover: hover) {
          .space-chip:hover {
            color: var(--accent);
            border-color: var(--accent);
            background: var(--accent-soft);
          }
        }

        /* ----------------------------------------------------------
           Visual card (theme-aware)
        ---------------------------------------------------------- */

        .space-panel-card {
          isolation: isolate;
        }

        .space-panel-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          border-radius: inherit;
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--accent) 5%, transparent),
            transparent 42%,
            transparent 72%,
            color-mix(in srgb, var(--accent) 3%, transparent)
          );
        }

        .space-grid-bg {
          background-image:
            linear-gradient(color-mix(in srgb, var(--accent) 12%, transparent) 1px, transparent 1px),
            linear-gradient(90deg, color-mix(in srgb, var(--accent) 12%, transparent) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse at center, #000 40%, transparent 90%);
          -webkit-mask-image: radial-gradient(ellipse at center, #000 40%, transparent 90%);
        }

        .space-svg {
          color: var(--accent);
        }

        .space-hub-core {
          fill: var(--bg);
        }

        .space-device-box {
          background: var(--bg);
          border: 1px solid color-mix(in srgb, var(--accent) 50%, var(--edge));
          color: var(--accent);
          box-shadow: 0 0 18px color-mix(in srgb, var(--accent) 16%, transparent);
        }

        .space-device-halo {
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
        }

        .space-device-dot {
          background: var(--accent);
          border: 1px solid var(--bg);
        }

        .space-device-label {
          background: color-mix(in srgb, var(--bg) 90%, transparent);
          border: 1px solid var(--edge);
          color: var(--fg-muted);
        }

        .space-footer {
          background: color-mix(in srgb, var(--bg) 88%, transparent);
          border-top: 1px solid var(--edge);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .space-live {
          background: var(--accent-soft);
          border: 1px solid var(--edge);
        }

        .space-scan {
          background: linear-gradient(
            90deg,
            transparent,
            color-mix(in srgb, var(--accent) 70%, transparent),
            transparent
          );
        }

        @media (prefers-reduced-motion: reduce) {
          .space-scan { display: none; }

          .space-selector,
          .space-icon,
          .space-arrow,
          .space-chip {
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Ambient theme-aware glow (same treatment as Services) */}
      <div
        aria-hidden="true"
        className="space-orb pointer-events-none absolute -left-40 top-0 size-[460px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative">
        {/* Section heading */}
        <div className="section-head section-head--center space-head">
          <h2
            aria-label={HEADING}
            className="t-h2 font-semibold"
            style={{ color: "#1ce8f0" }}
          >
            {HEADING.split(" ").map((word, index) => (
              <span
                key={word + index}
                aria-hidden="true"
                className="mr-[0.2em] inline-block overflow-hidden align-bottom"
              >
                <span className="space-word inline-block">{word}</span>
              </span>
            ))}
          </h2>

          <p className="space-head-p t-body max-w-[54ch] text-center">
            Every property has unique security requirements. Explore how we
            build integrated protection for your environment.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="relative grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Space selector */}
          <ul className="space-selector-list flex flex-col">
            {SPACES.map((space, index) => {
              const Icon = space.icon;
              const selected = activeSpace === index;

              return (
                <li
                  key={space.id}
                  className={`space-selector relative border-b border-edge first:border-t ${
                    selected ? "bg-accent-soft/40" : ""
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={selected}
                    aria-controls={`space-description-${space.id}`}
                    onClick={() => changeSpace(index)}
                    onMouseEnter={() => changeSpace(index)}
                    onFocus={() => changeSpace(index)}
                    className="group flex min-h-[76px] w-full cursor-pointer items-center gap-3 py-4 text-left sm:gap-4 lg:py-5"
                  >
                    <span
                      className={`space-icon flex size-10 shrink-0 items-center justify-center rounded-full border sm:size-11 ${
                        selected
                          ? "border-accent bg-accent-soft text-accent shadow-[0_0_16px_color-mix(in_srgb,var(--accent)_12%,transparent)]"
                          : "border-edge bg-bg-alt text-fg-muted group-hover:border-accent group-hover:text-accent"
                      }`}
                    >
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <span
                        className={`block font-display text-[15px] font-medium leading-snug transition-colors duration-300 sm:text-base ${
                          selected ? "text-accent" : "text-fg"
                        }`}
                      >
                        {space.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-fg-muted">
                        {space.subtitle}
                      </span>
                    </div>

                    <ArrowUpRight
                      aria-hidden="true"
                      className={`space-arrow ml-auto size-[18px] shrink-0 ${
                        selected ? "rotate-45 text-accent" : "text-fg-muted"
                      }`}
                    />
                  </button>

                  {/* Expandable description */}
                  <div
                    id={`space-description-${space.id}`}
                    aria-hidden={!selected}
                    className="grid"
                    style={{
                      gridTemplateRows: selected ? "1fr" : "0fr",
                      transition:
                        "grid-template-rows 500ms cubic-bezier(.16, 1, .3, 1)",
                    }}
                  >
                    <div className="overflow-hidden">
                      <div
                        className="flex flex-col items-start gap-4 pb-5 pl-[52px] pr-3 sm:pl-[60px]"
                        style={{
                          opacity: selected ? 1 : 0,
                          transform: selected
                            ? "translateY(0)"
                            : "translateY(6px)",
                          transition:
                            "opacity 350ms ease, transform 350ms ease",
                        }}
                      >
                        <p className="max-w-[48ch] text-[13px] leading-[1.8] text-fg-muted sm:text-sm">
                          {space.description}
                        </p>

                        <ul className="flex flex-wrap gap-2">
                          {space.solutions.map((solution) => (
                            <li
                              key={solution}
                              className="space-chip rounded-full px-3 py-1 text-[11px] leading-relaxed"
                            >
                              {solution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Visual card (desktop only, hidden on phone/tablet) */}
          <div className="hidden h-fit self-start lg:sticky lg:top-24 lg:block">
            <div
              ref={visualRef}
              className="space-panel-card glass relative h-[440px] overflow-hidden rounded-card border border-edge sm:h-[500px]"
            >
              {/* Top highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 z-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 45%, transparent), transparent)",
                }}
              />

              {/* Blueprint grid */}
              <div
                aria-hidden="true"
                className="space-grid-bg pointer-events-none absolute inset-0 z-0 opacity-60"
              />

              {/* Header */}
              <div className="absolute inset-x-5 top-5 z-20 flex items-start justify-between gap-3 sm:inset-x-6 sm:top-6">
                <div className="min-w-0">
                  <span className="block text-[11px] font-medium tracking-wide text-accent">
                    Security environment
                  </span>
                  <h3 className="mt-0.5 truncate font-display text-base font-semibold text-fg sm:text-[17px]">
                    {active.name} infrastructure
                  </h3>
                </div>

                <div className="space-live flex shrink-0 items-center gap-2 rounded-full px-3 py-1">
                  <span className="relative flex size-2">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-accent/60 motion-reduce:animate-none" />
                    <span className="relative size-2 rounded-full bg-accent" />
                  </span>
                  <span className="text-[11px] font-medium text-accent">
                    Live
                  </span>
                </div>
              </div>

              {/* Plan + devices */}
              <div className="absolute inset-x-3 bottom-[64px] top-[76px] flex items-center justify-center sm:inset-x-4 sm:bottom-[72px] sm:top-[84px]">
                <div
                  key={active.id}
                  className="space-plan relative aspect-[4/3] w-full max-w-[440px]"
                >
                  <div className="space-plan-content absolute inset-0">
                    <svg
                      viewBox="0 0 600 330"
                      className="space-svg absolute inset-0 h-full w-full overflow-visible"
                      fill="none"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id="spaceStroke"
                          x1="0"
                          y1="0"
                          x2="600"
                          y2="330"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="currentColor" stopOpacity=".75" />
                          <stop
                            offset="1"
                            stopColor="currentColor"
                            stopOpacity=".15"
                          />
                        </linearGradient>
                        <radialGradient id="spaceHubGlow">
                          <stop stopColor="currentColor" stopOpacity=".3" />
                          <stop
                            offset="1"
                            stopColor="currentColor"
                            stopOpacity="0"
                          />
                        </radialGradient>
                      </defs>

                      {/* Property boundary */}
                      <path
                        d="M65 65 L300 20 L535 65 L535 265 L300 310 L65 265 Z"
                        stroke="url(#spaceStroke)"
                        strokeWidth="1.5"
                        strokeDasharray="5 6"
                        opacity=".8"
                      />

                      {/* Building outline */}
                      <path
                        d="M115 90 L300 55 L485 90 L485 240 L300 278 L115 240 Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeOpacity=".5"
                      />

                      {/* Partitions */}
                      <path
                        d="M300 55 V278 M115 165 H485 M210 73 V259 M395 73 V259"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeOpacity=".3"
                        strokeDasharray="4 5"
                      />

                      {/* Device to hub connections */}
                      {active.devices.map((device) => {
                        const x = (device.x / 100) * 600;
                        const y = (device.y / 100) * 330;

                        return (
                          <path
                            key={device.label}
                            className="space-connection"
                            d={`M${x} ${y} L300 165`}
                            pathLength="1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeOpacity=".5"
                            strokeDasharray="1"
                            strokeDashoffset="0"
                          />
                        );
                      })}

                      {/* Hub */}
                      <circle cx="300" cy="165" r="52" fill="url(#spaceHubGlow)" />
                      <circle
                        cx="300"
                        cy="165"
                        r="26"
                        stroke="currentColor"
                        strokeOpacity=".65"
                        strokeDasharray="3 5"
                      />
                      <circle
                        className="space-hub-core"
                        cx="300"
                        cy="165"
                        r="14"
                        stroke="currentColor"
                        strokeOpacity=".8"
                      />
                      <circle cx="300" cy="165" r="4.5" fill="currentColor" />
                    </svg>

                    {/* Device nodes */}
                    {active.devices.map((device) => {
                      const Icon = DEVICE_ICONS[device.type];

                      return (
                        <div
                          key={device.label}
                          className="space-device absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                          style={{
                            left: `${device.x}%`,
                            top: `${device.y}%`,
                          }}
                        >
                          <div className="space-device-box relative flex size-8 items-center justify-center rounded-xl sm:size-9">
                            <span
                              aria-hidden="true"
                              className="space-device-halo pointer-events-none absolute -inset-1 rounded-xl opacity-40"
                            />
                            <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                            <span
                              aria-hidden="true"
                              className="space-status-dot space-device-dot absolute -right-0.5 -top-0.5 size-2 rounded-full"
                            />
                          </div>

                          <span className="space-device-label whitespace-nowrap rounded-md px-1.5 py-0.5 text-[10px] font-medium sm:px-2">
                            {device.label}
                          </span>
                        </div>
                      );
                    })}

                    {/* Hub label */}
                    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                      <div className="relative flex size-9 items-center justify-center">
                        <span
                          aria-hidden="true"
                          className="space-hub-pulse absolute inset-0 rounded-full border border-accent/60"
                        />
                        <ShieldCheck
                          size={18}
                          strokeWidth={1.8}
                          className="text-accent"
                          aria-hidden="true"
                        />
                      </div>
                      <span className="mt-1 text-[10px] font-medium text-accent">
                        Hub
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scan line */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-[64px] top-[76px] z-10 overflow-hidden sm:bottom-[72px] sm:top-[84px]"
              >
                <div className="space-scan absolute inset-x-0 top-0 h-px" />
              </div>

              {/* Footer */}
              <div className="space-footer absolute inset-x-0 bottom-0 z-20 px-5 py-3 sm:px-6 sm:py-3.5">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex min-w-0 items-center gap-2 text-fg-muted">
                    <Activity
                      size={14}
                      className="shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {active.devices.length} devices online
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 font-medium text-accent">
                    <Wifi size={13} aria-hidden="true" />
                    <span>Secure network</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}