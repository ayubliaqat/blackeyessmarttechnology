
"use client";

import { useRef, useState, type ComponentType, type MouseEvent } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  ArrowUpRight,
  Flame,
  Home,
  Network,
  Phone,
  Video,
  Volume2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ==========================================================================
   Animated service illustrations
   ========================================================================== */

const svgProps = {
  viewBox: "0 0 240 200",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  className: "svc-art h-full w-full",
  "aria-hidden": true as const,
};

function CctvArt() {
  return (
    <svg {...svgProps}>
      <circle cx="120" cy="100" r="74" opacity=".2" />
      <circle cx="120" cy="100" r="56" strokeDasharray="3 9" className="svc-spin" />
      <circle cx="120" cy="100" r="38" opacity=".55" />
      <circle cx="120" cy="100" r="16" fill="currentColor" opacity=".15" />
      <circle cx="120" cy="100" r="5" fill="currentColor" stroke="none" />
      <line
        x1="62"
        y1="100"
        x2="178"
        y2="100"
        strokeWidth="2"
        className="svc-scan"
      />
      <circle
        cx="196"
        cy="40"
        r="4"
        fill="#ef6464"
        stroke="none"
        className="svc-blink"
      />
    </svg>
  );
}

function AutomationArt() {
  const nodes: Array<[number, number]> = [
    [34, 50],
    [206, 56],
    [30, 148],
    [210, 150],
  ];

  return (
    <svg {...svgProps}>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <line
            x1={x}
            y1={y}
            x2="120"
            y2="110"
            opacity=".4"
            className="svc-dash"
          />
          <circle
            cx={x}
            cy={y}
            r="7"
            className="svc-pulse"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        </g>
      ))}

      <path d="M66 112 L120 62 L174 112" strokeLinejoin="round" />
      <path d="M78 102 V154 H162 V102" strokeLinejoin="round" />
      <rect x="108" y="126" width="24" height="28" rx="3" opacity=".7" />

      <rect
        x="88"
        y="116"
        width="14"
        height="14"
        rx="2"
        fill="currentColor"
        className="svc-pulse"
      />
      <rect
        x="138"
        y="116"
        width="14"
        height="14"
        rx="2"
        fill="currentColor"
        className="svc-pulse"
        style={{ animationDelay: ".8s" }}
      />
    </svg>
  );
}

function NetworkArt() {
  const nodes: Array<[number, number]> = [
    [48, 48],
    [192, 48],
    [36, 132],
    [204, 132],
    [120, 178],
    [120, 22],
  ];

  return (
    <svg {...svgProps}>
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <line x1={x} y1={y} x2="120" y2="100" opacity=".4" />
          <circle cx={x} cy={y} r="8" />
          <circle
            cx={x}
            cy={y}
            r="3"
            fill="currentColor"
            stroke="none"
            className="svc-pulse"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
          <circle r="3" fill="currentColor" stroke="none">
            <animateMotion
              path={`M${x} ${y} L120 100`}
              dur={`${1.6 + i * 0.2}s`}
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      <circle cx="120" cy="100" r="14" fill="currentColor" opacity=".15" />
      <circle cx="120" cy="100" r="14" />
      <circle cx="120" cy="100" r="5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FireArt() {
  return (
    <svg {...svgProps}>
      {[0, 0.85, 1.7].map((delay) => (
        <circle
          key={delay}
          cx="120"
          cy="104"
          r="64"
          className="svc-ripple"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}

      <path
        d="M120 58 C140 88 152 100 152 124 C152 144 138 156 120 156 C102 156 88 144 88 124 C88 106 102 96 110 80 C113 90 118 94 124 96 C124 84 121 72 120 58 Z"
        strokeLinejoin="round"
      />

      <path
        d="M120 112 C130 126 134 132 134 140 C134 148 128 152 120 152 C112 152 106 148 106 140 C106 132 112 126 120 112 Z"
        fill="currentColor"
        opacity=".3"
        className="svc-pulse"
      />
    </svg>
  );
}

function IntercomArt() {
  return (
    <svg {...svgProps}>
      <rect x="82" y="32" width="76" height="136" rx="12" />
      <circle cx="120" cy="58" r="10" />
      <circle
        cx="120"
        cy="58"
        r="3"
        fill="currentColor"
        stroke="none"
        className="svc-blink"
      />
      <rect x="96" y="80" width="48" height="36" rx="4" opacity=".6" />

      {[104, 120, 136].map((x) =>
        [136, 147].map((y) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="2"
            fill="currentColor"
            stroke="none"
          />
        )),
      )}

      <circle cx="120" cy="158" r="4" opacity=".6" />

      {[
        "M168 92 Q178 100 168 108",
        "M178 82 Q196 100 178 118",
        "M188 72 Q214 100 188 128",
      ].map((path, i) => (
        <path
          key={path}
          d={path}
          className="svc-wave"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </svg>
  );
}

function SoundArt() {
  const heights = [50, 82, 112, 70, 124, 92, 60, 102, 46];

  return (
    <svg {...svgProps}>
      <line x1="30" y1="156" x2="210" y2="156" opacity=".4" />

      {heights.map((height, i) => (
        <rect
          key={i}
          x={38 + i * 19}
          y={150 - height}
          width="9"
          height={height}
          rx="4.5"
          fill="currentColor"
          stroke="none"
          opacity={0.35 + (i % 3) * 0.2}
          className="svc-eq"
          style={{
            animationDelay: `${i * 0.12}s`,
            animationDuration: `${0.9 + (i % 3) * 0.25}s`,
          }}
        />
      ))}
    </svg>
  );
}

/* ==========================================================================
   Service content
   ========================================================================== */

type Service = {
  id: string;
  title: string;
  text: string;
  tags: string[];
  Icon: ComponentType<{ className?: string }>;
  Art: ComponentType;
};

const SERVICES: Service[] = [
  {
    id: "cctv",
    title: "CCTV & Access Control",
    text: "High-definition surveillance and controlled entry, planned around your property and viewable from anywhere.",
    tags: ["IP cameras", "Remote viewing", "Access control"],
    Icon: Video,
    Art: CctvArt,
  },
  {
    id: "home-automation",
    title: "Home Automation",
    text: "Lighting, climate, curtains and appliances working together from one app or a single touch.",
    tags: ["Lighting", "Climate", "Scenes"],
    Icon: Home,
    Art: AutomationArt,
  },
  {
    id: "networking",
    title: "Networking",
    text: "Structured cabling, Wi-Fi and secure networks built to stay fast and reliable as you grow.",
    tags: ["Structured cabling", "Wi-Fi", "Secure access"],
    Icon: Network,
    Art: NetworkArt,
  },
  {
    id: "fire-alarm",
    title: "Fire Alarm",
    text: "Detection and alarm systems designed for early warning and a clear, dependable response.",
    tags: ["Detection", "Alarms", "Control panels"],
    Icon: Flame,
    Art: FireArt,
  },
  {
    id: "intercom",
    title: "Intercom",
    text: "Clear audio and video door communication for homes, offices and buildings.",
    tags: ["Video", "Audio", "Door entry"],
    Icon: Phone,
    Art: IntercomArt,
  },
  {
    id: "sound-systems",
    title: "Sound Systems",
    text: "Background music, public address and audio for homes, venues and workspaces.",
    tags: ["Background music", "Public address", "Multi-room"],
    Icon: Volume2,
    Art: SoundArt,
  },
];

const HEADING = "Security systems, end to end";

/* ==========================================================================
   Services section
   ========================================================================== */

export default function Services() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const next = () => {
    setActive((current) => (current + 1) % SERVICES.length);
  };

  const onPanelMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    event.currentTarget.style.setProperty(
      "--mx",
      `${event.clientX - rect.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--my",
      `${event.clientY - rect.top}px`,
    );
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = (trigger: string, start = "top 85%") => ({
          trigger,
          start,
          once: true,
        });

        gsap.from(".svc-word", {
          yPercent: 110,
          opacity: 0,
          rotateX: -25,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: once(".svc-head"),
        });

        gsap.from(".svc-head-p", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: once(".svc-head"),
        });

        gsap.from(".svc-row", {
          y: 24,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: once(".svc-list", "top 82%"),
        });

        gsap.from(".svc-panel-card", {
          y: 28,
          opacity: 0,
          scale: 0.98,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: once(".svc-panel-card", "top 82%"),
        });

        gsap.from(".svc-cta", {
          y: 16,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: once(".svc-cta", "top 95%"),
        });

        gsap.to(".svc-orb", {
          yPercent: 35,
          xPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id="services"
      aria-label="Services"
      className="section svc-sec overflow-x-clip"
    >
      <style>{`
        /* ----------------------------------------------------------
           Animation keyframes
        ---------------------------------------------------------- */

        @keyframes svc-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes svc-scan {
          0%, 100% { transform: translateY(-48px); }
          50% { transform: translateY(48px); }
        }

        @keyframes svc-blink {
          50% { opacity: .2; }
        }

        @keyframes svc-dash {
          to { stroke-dashoffset: -20; }
        }

        @keyframes svc-pulse {
          0%, 100% {
            opacity: .35;
            transform: scale(.88);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes svc-ripple {
          0% {
            transform: scale(.3);
            opacity: .65;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        @keyframes svc-eq {
          0%, 100% { transform: scaleY(.25); }
          50% { transform: scaleY(1); }
        }

        @keyframes svc-wave {
          0% { opacity: 0; }
          35% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes svc-fill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @keyframes svc-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        /* ----------------------------------------------------------
           SVG illustrations
        ---------------------------------------------------------- */

        .svc-art * {
          transform-box: fill-box;
          transform-origin: center;
        }

        .svc-art .svc-eq {
          transform-origin: 50% 100%;
        }

        .svc-spin {
          animation: svc-spin 16s linear infinite;
        }

        .svc-scan {
          animation: svc-scan 3.5s ease-in-out infinite;
        }

        .svc-blink {
          animation: svc-blink 1.4s steps(1) infinite;
        }

        .svc-dash {
          stroke-dasharray: 4 6;
          animation: svc-dash 1.5s linear infinite;
        }

        .svc-pulse {
          animation: svc-pulse 2.6s ease-in-out infinite;
        }

        .svc-ripple {
          animation: svc-ripple 2.8s ease-out infinite;
        }

        .svc-eq {
          animation: svc-eq 1.2s ease-in-out infinite;
        }

        .svc-wave {
          animation: svc-wave 1.9s ease-in-out infinite;
        }

        .svc-panel[data-active="false"] .svc-art * {
          animation-play-state: paused;
        }

        /* ----------------------------------------------------------
           Autoplay progress
        ---------------------------------------------------------- */

        .svc-progress {
          transform-origin: left;
          animation: svc-fill 6s linear forwards;
        }

        .svc-sec:hover .svc-progress,
        .svc-sec:focus-within .svc-progress {
          animation-play-state: paused;
        }

        /* ----------------------------------------------------------
           Service list
        ---------------------------------------------------------- */

        .svc-row {
          transition:
            border-color 350ms ease,
            background-color 350ms ease;
        }

        .svc-row button {
          transition: color 350ms ease;
        }

        .svc-icon {
          transition:
            transform 400ms cubic-bezier(.16, 1, .3, 1),
            border-color 350ms ease,
            background-color 350ms ease,
            color 350ms ease,
            box-shadow 350ms ease;
        }

        .svc-row button:hover .svc-icon {
          transform: translateY(-2px);
        }

        .svc-arrow {
          transition:
            transform 400ms cubic-bezier(.16, 1, .3, 1),
            color 350ms ease;
        }

        .svc-row button:hover .svc-arrow {
          transform: translate(2px, -2px);
        }

        /* ----------------------------------------------------------
           Preview card
        ---------------------------------------------------------- */

        .svc-panel-card {
          isolation: isolate;
          transform-style: preserve-3d;
        }

        .svc-panel-card::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          border-radius: inherit;
          background:
            linear-gradient(
              135deg,
              color-mix(in srgb, var(--accent) 5%, transparent),
              transparent 42%,
              transparent 72%,
              color-mix(in srgb, var(--accent) 3%, transparent)
            );
        }

        .svc-panel-glow {
          transition: opacity 700ms ease;
        }

        .svc-panel {
          will-change: opacity, transform, filter;
        }

        .svc-panel-art {
          animation: svc-float 5s ease-in-out infinite;
        }

        .svc-tag {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: var(--fg-muted);
          transition:
            color 300ms ease,
            border-color 300ms ease,
            background-color 300ms ease,
            transform 300ms ease;
        }

        @media (hover: hover) {
          .svc-tag:hover {
            color: var(--accent);
            border-color: var(--accent);
            background: var(--accent-soft);
            transform: translateY(-2px);
          }
        }

        /* ----------------------------------------------------------
           CTA
        ---------------------------------------------------------- */

        .svc-cta a {
          transition:
            transform 300ms cubic-bezier(.16, 1, .3, 1),
            box-shadow 300ms ease;
        }

        @media (hover: hover) {
          .svc-cta a:hover {
            transform: translateY(-2px);
          }
        }

        .svc-cta a svg {
          transition: transform 300ms ease;
        }

        .svc-cta a:hover svg {
          transform: translateX(3px);
        }

        /* ----------------------------------------------------------
           Responsive adjustments
        ---------------------------------------------------------- */

        @media (max-width: 1023px) {
          .svc-panel-art {
            animation: none;
          }
        }

        /* ----------------------------------------------------------
           Accessibility
        ---------------------------------------------------------- */

        @media (prefers-reduced-motion: reduce) {
          .svc-art *,
          .svc-progress,
          .svc-panel-art {
            animation: none !important;
          }

          .svc-row *,
          .svc-panel,
          .svc-tag,
          .svc-cta a {
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Ambient theme-aware glow */}
      <div
        aria-hidden="true"
        className="svc-orb pointer-events-none absolute -right-40 top-0 size-[460px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative">
        {/* Section heading */}
        <div className="section-head section-head--center svc-head">
          <h2 className="t-h2 font-semibold" style={{ color: "#1ce8f0" }}>
  {HEADING.split(" ").map((word, index) => (
    <span
      key={word + index}
      aria-hidden="true"
      className="mr-[0.2em] inline-block overflow-hidden align-bottom"
    >
      <span className="svc-word inline-block">
        {word}
        {index === 1 || index === 2 ? (
          <span className="text-accent"> </span>
        ) : null}
      </span>
    </span>
  ))}
</h2>

          <p className="svc-head-p t-body max-w-[54ch] text-center">
            Six disciplines, one accountable team. From the first site survey
            to round-the-clock support.
          </p>
        </div>

        <div className="relative grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Service list */}
          <ul className="svc-list flex flex-col">
            {SERVICES.map((service, index) => {
              const isActive = index === active;

              return (
                <li
                  key={service.id}
                  className={`svc-row relative border-b border-edge first:border-t ${
                    isActive ? "bg-accent-soft/40" : ""
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`service-description-${service.id}`}
                    onClick={() => setActive(index)}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className="group flex min-h-[76px] w-full cursor-pointer items-center gap-3 py-4 text-left sm:gap-4 lg:py-5"
                  >
                    <span
                      className={`svc-icon flex size-10 shrink-0 items-center justify-center rounded-full border sm:size-11 ${
                        isActive
                          ? "border-accent bg-accent-soft text-accent shadow-[0_0_16px_color-mix(in_srgb,var(--accent)_12%,transparent)]"
                          : "border-edge bg-bg-alt text-fg-muted group-hover:border-accent group-hover:text-accent"
                      }`}
                    >
                      <service.Icon className="size-[18px]" />
                    </span>

                    <span
                      className={`font-display text-[15px] font-medium leading-snug transition-colors duration-300 sm:text-base ${
                        isActive ? "text-accent" : "text-fg"
                      }`}
                    >
                      {service.title}
                    </span>

                    <ArrowUpRight
                      aria-hidden="true"
                      className={`svc-arrow ml-auto size-[18px] shrink-0 ${
                        isActive ? "rotate-45 text-accent" : "text-fg-muted"
                      }`}
                    />
                  </button>

                  {/* Expandable description */}
                  <div
                    id={`service-description-${service.id}`}
                    aria-hidden={!isActive}
                    className="grid"
                    style={{
                      gridTemplateRows: isActive ? "1fr" : "0fr",
                      transition:
                        "grid-template-rows 500ms cubic-bezier(.16, 1, .3, 1)",
                    }}
                  >
                    <div className="overflow-hidden">
                      <div
                        className="flex flex-col items-start gap-4 pb-5 pl-[52px] pr-3 sm:pl-[60px]"
                        style={{
                          opacity: isActive ? 1 : 0,
                          transform: isActive
                            ? "translateY(0)"
                            : "translateY(6px)",
                          transition:
                            "opacity 350ms ease, transform 350ms ease",
                        }}
                      >
                        <p className="max-w-[48ch] text-[13px] leading-[1.8] text-fg-muted sm:text-sm">
                          {service.text}
                        </p>

                        <Link
                          href={`/services#${service.id}`}
                          tabIndex={isActive ? 0 : -1}
                          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-edge bg-accent-soft px-3.5 py-2 text-[11px] font-medium tracking-wide text-accent transition-all duration-300 hover:border-accent hover:bg-accent-soft"
                        >
                          Explore {service.title}
                          <ArrowRight
                            className="size-3.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Active service progress */}
                  {isActive && (
                    <span
                      key={service.id}
                      aria-hidden="true"
                      onAnimationEnd={next}
                      className="svc-progress pointer-events-none absolute -bottom-px left-0 h-px w-full bg-accent"
                    />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Sticky desktop preview */}
          <div className="svc-panel-wrap sticky top-24 hidden h-fit self-start lg:block">
            <div
              className="svc-panel-card glass relative h-[440px] overflow-hidden rounded-card border border-edge"
              onMouseMove={onPanelMove}
            >
              {/* Mouse-following glow */}
              <div
                aria-hidden="true"
                className="svc-panel-glow pointer-events-none absolute inset-0 z-0 opacity-0"
                style={{
                  background:
                    "radial-gradient(320px circle at var(--mx, 50%) var(--my, 35%), color-mix(in srgb, var(--accent) 13%, transparent), transparent 68%)",
                }}
              />

              {/* Top highlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 z-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 45%, transparent), transparent)",
                }}
              />

              {SERVICES.map((service, index) => {
                const isActive = index === active;

                return (
                  <div
                    key={service.id}
                    data-active={isActive}
                    aria-hidden={!isActive}
                    className="svc-panel pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 p-7 text-center"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0) scale(1)"
                        : "translateY(14px) scale(.98)",
                      filter: isActive ? "blur(0)" : "blur(5px)",
                      transition:
                        "opacity 500ms cubic-bezier(.16, 1, .3, 1), transform 600ms cubic-bezier(.16, 1, .3, 1), filter 500ms ease",
                    }}
                  >
                    {/* Illustration */}
                    <div className="svc-panel-art h-40 w-48 text-accent xl:h-44 xl:w-52">
                      <service.Art />
                    </div>

                    {/* Service information */}
                    <div className="flex flex-col items-center gap-3">
                      <h3 className="t-h3 text-fg">
                        {service.title}
                      </h3>

                      <ul className="flex flex-wrap justify-center gap-2">
                        {service.tags.map((tag) => (
                          <li
                            key={tag}
                            className="svc-tag rounded-full px-3 py-1 text-[11px] leading-relaxed"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Active indicator */}
                    <div className="mt-1 flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
                      <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-fg-muted">
                        System overview
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="svc-cta mt-8 flex justify-center lg:mt-10">
          <Link href="/services" className="btn btn--primary">
            View all services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
