"use client";

import { useRef, type ComponentType } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ==========================================================================
   Animated space illustrations (matching Services custom SVG aesthetic)
   ========================================================================== */

const svgProps = {
  viewBox: "0 0 240 200",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  className: "space-art h-full w-full",
  "aria-hidden": true as const,
};

function ResidentialArt() {
  return (
    <svg {...svgProps}>
      <circle
        cx="120"
        cy="108"
        r="74"
        strokeDasharray="4 8"
        opacity=".35"
        className="space-spin"
      />
      <path d="M58 104 L120 48 L182 104" strokeLinejoin="round" />
      <path d="M74 92 V158 H166 V92" strokeLinejoin="round" />
      <rect x="106" y="118" width="28" height="40" rx="3" opacity=".8" />
      <circle
        cx="128"
        cy="138"
        r="2.5"
        fill="currentColor"
        stroke="none"
        className="space-blink"
      />
      <circle cx="74" cy="92" r="5" fill="currentColor" opacity=".2" />
      <circle
        cx="74"
        cy="92"
        r="3"
        fill="currentColor"
        stroke="none"
        className="space-pulse"
      />
      <circle cx="166" cy="92" r="5" fill="currentColor" opacity=".2" />
      <circle
        cx="166"
        cy="92"
        r="3"
        fill="currentColor"
        stroke="none"
        className="space-pulse"
        style={{ animationDelay: "0.7s" }}
      />
      <line
        x1="64"
        y1="105"
        x2="176"
        y2="105"
        strokeWidth="1.5"
        opacity=".65"
        className="space-scan-line"
      />
    </svg>
  );
}

function CommercialArt() {
  return (
    <svg {...svgProps}>
      <rect x="82" y="34" width="76" height="132" rx="4" />
      <path d="M52 166 V78 H82" strokeLinejoin="round" opacity=".65" />
      <path d="M188 166 V78 H158" strokeLinejoin="round" opacity=".65" />
      <line
        x1="67"
        y1="78"
        x2="67"
        y2="46"
        className="space-dash"
        opacity=".5"
      />
      <line
        x1="173"
        y1="78"
        x2="173"
        y2="46"
        className="space-dash"
        opacity=".5"
      />
      {[52, 74, 96, 118].map((y, row) =>
        [98, 120, 142].map((x, col) => (
          <rect
            key={`${x}-${y}`}
            x={x - 6}
            y={y}
            width="12"
            height="10"
            rx="1.5"
            fill="currentColor"
            stroke="none"
            opacity={(row + col) % 2 === 0 ? 0.65 : 0.25}
            className="space-pulse"
            style={{ animationDelay: `${(row * 3 + col) * 0.22}s` }}
          />
        )),
      )}
      <rect x="108" y="142" width="24" height="24" rx="2" opacity=".85" />
    </svg>
  );
}

function RetailArt() {
  return (
    <svg {...svgProps}>
      <rect x="52" y="68" width="136" height="92" rx="4" />
      <path
        d="M46 68 L60 44 H180 L194 68 Z"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity=".1"
      />
      {[82, 108, 132, 158].map((x) => (
        <line key={x} x1={x} y1="44" x2={x} y2="68" opacity=".45" />
      ))}
      <rect x="66" y="86" width="42" height="52" rx="3" opacity=".6" />
      <rect x="132" y="86" width="42" height="74" rx="3" opacity=".8" />
      <circle cx="120" cy="78" r="5" fill="currentColor" stroke="none" />
      <path
        d="M120 78 L84 148 H156 Z"
        fill="currentColor"
        stroke="none"
        opacity=".12"
        className="space-pulse"
      />
      <circle
        cx="176"
        cy="82"
        r="3.5"
        fill="#ef6464"
        stroke="none"
        className="space-blink"
      />
    </svg>
  );
}

function IndustrialArt() {
  return (
    <svg {...svgProps}>
      <circle cx="120" cy="106" r="76" opacity=".18" />
      <circle
        cx="120"
        cy="106"
        r="62"
        strokeDasharray="6 6"
        opacity=".45"
        className="space-spin"
      />
      <path
        d="M54 102 L86 78 V102 L120 78 V102 L154 78 V102 H186 V156 H54 Z"
        strokeLinejoin="round"
      />
      <rect x="164" y="42" width="12" height="60" rx="2" opacity=".75" />
      {[0, 0.8].map((delay) => (
        <circle
          key={delay}
          cx="170"
          cy="42"
          r="24"
          className="space-ripple"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
      <rect x="74" y="122" width="32" height="34" rx="2" opacity=".65" />
      <rect x="134" y="122" width="32" height="34" rx="2" opacity=".65" />
    </svg>
  );
}

function WarehousingArt() {
  const bays = [66, 102, 138];
  return (
    <svg {...svgProps}>
      <path d="M44 86 Q120 38 196 86" strokeLinecap="round" />
      <path d="M54 82 V160 H186 V82" strokeLinejoin="round" />
      {bays.map((x, i) => (
        <g key={x}>
          <rect x={x} y="108" width="28" height="52" rx="2" opacity=".75" />
          <line x1={x} y1="122" x2={x + 28} y2="122" opacity=".4" />
          <line x1={x} y1="136" x2={x + 28} y2="136" opacity=".4" />
          <circle
            cx={x + 14}
            cy="98"
            r="3"
            fill="currentColor"
            stroke="none"
            className="space-pulse"
            style={{ animationDelay: `${i * 0.45}s` }}
          />
        </g>
      ))}
      <line
        x1="36"
        y1="160"
        x2="204"
        y2="160"
        strokeDasharray="4 5"
        className="space-dash"
      />
    </svg>
  );
}

/* ==========================================================================
   Data types & configuration (5 spaces total)
   ========================================================================== */

type Space = {
  id: string;
  title: string;
  points: string[];
  Art: ComponentType;
};

const SPACES: Space[] = [
  {
    id: "residential",
    title: "Residential",
    points: ["IP cameras", "Remote viewing", "Access control"],
    Art: ResidentialArt,
  },
  {
    id: "commercial",
    title: "Commercial",
    points: ["Structured cabling", "Wi-Fi", "Secure access"],
    Art: CommercialArt,
  },
  {
    id: "retail",
    title: "Retail",
    points: ["Detection", "Alarms", "Control panels"],
    Art: RetailArt,
  },
  {
    id: "industrial",
    title: "Industrial",
    points: ["Video", "Audio", "Door entry"],
    Art: IndustrialArt,
  },
  {
    id: "warehousing",
    title: "Warehousing",
    points: ["Background music", "Public address", "Multi-room"],
    Art: WarehousingArt,
  },
];

const HEADING = "Solutions by space";

/* ==========================================================================
   Solutions by space component (3 per row)
   ========================================================================== */

export default function SolutionsBySpace() {
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

        gsap.from(".space-card", {
          y: 32,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: once(".space-grid", "top 82%"),
        });

        gsap.to(".space-orb", {
          yPercent: 35,
          xPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: section,
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
      id="solutions-by-space"
      aria-label="Solutions by space"
      className="section space-sec overflow-x-clip"
    >
      <style>{`
        .space-sec {
          --space-h2: #1ce8f0;
        }

        .light .space-sec {
          --space-h2: #07505a;
        }

        @keyframes space-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes space-scan-line {
          0%, 100% { transform: translateY(-20px); }
          50% { transform: translateY(42px); }
        }

        @keyframes space-blink {
          50% { opacity: .2; }
        }

        @keyframes space-dash {
          to { stroke-dashoffset: -20; }
        }

        @keyframes space-pulse {
          0%, 100% {
            opacity: .35;
            transform: scale(.88);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes space-ripple {
          0% {
            transform: scale(.3);
            opacity: .65;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        @keyframes space-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes space-beam {
          to { transform: rotate(360deg); }
        }

        .space-art * {
          transform-box: fill-box;
          transform-origin: center;
        }

        .space-spin {
          animation: space-spin 16s linear infinite;
        }

        .space-scan-line {
          animation: space-scan-line 3.5s ease-in-out infinite;
        }

        .space-blink {
          animation: space-blink 1.4s steps(1) infinite;
        }

        .space-dash {
          stroke-dasharray: 4 6;
          animation: space-dash 1.5s linear infinite;
        }

        .space-pulse {
          animation: space-pulse 2.6s ease-in-out infinite;
        }

        .space-ripple {
          animation: space-ripple 2.8s ease-out infinite;
        }

        .space-art-wrap {
          animation: space-float 5s ease-in-out infinite;
        }

        .space-card {
          position: relative;
          overflow: hidden;
          padding: 1px;
          border-radius: 0 28px 0 28px;
          background: var(--edge);
          isolation: isolate;
          transition:
            transform 400ms cubic-bezier(.16, 1, .3, 1),
            box-shadow 400ms ease;
        }

        .space-card::before {
          content: "";
          position: absolute;
          inset: -50%;
          z-index: 0;
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg,
            transparent 300deg,
            var(--accent) 360deg
          );
          opacity: .7;
          animation: space-beam 6s linear infinite;
        }

        .space-card-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          border-radius: inherit;
          background: var(--bg);
          transition: background-color 400ms ease;
        }

        .space-rule {
          display: block;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.8;
          transition: width 400ms cubic-bezier(.16, 1, .3, 1);
        }

        .space-dot {
          flex-shrink: 0;
          margin-top: 0.62em;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: var(--accent);
          box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 55%, transparent);
        }

        .space-link {
          transition:
            border-color 300ms ease,
            background-color 300ms ease,
            transform 300ms cubic-bezier(.16, 1, .3, 1);
        }

        .space-link svg {
          transition: transform 300ms ease;
        }

        @media (hover: hover) {
          .space-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px -18px color-mix(in srgb, var(--accent) 35%, transparent);
          }

          .space-card:hover .space-card-inner {
            background: var(--bg-alt);
          }

          .space-card:hover .space-rule {
            width: 64px;
          }

          .space-link:hover {
            border-color: var(--accent);
          }

          .space-link:hover svg {
            transform: translateX(3px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .space-art *,
          .space-art-wrap,
          .space-card::before {
            animation: none !important;
          }

          .space-card,
          .space-card-inner,
          .space-link {
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Ambient theme-aware glow */}
      <div
        aria-hidden="true"
        className="space-orb pointer-events-none absolute -right-40 top-0 size-[460px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative">
        {/* Section heading */}
        <div className="section-head section-head--center space-head">
          <h2 className="t-h2 font-semibold" style={{ color: "var(--space-h2)" }}>
            {HEADING.split(" ").map((word, index) => (
              <span
                key={word + index}
                aria-hidden="true"
                className="mr-[0.2em] inline-block overflow-hidden align-bottom"
              >
                <span className="space-word inline-block">
                  {word}
                  {index === 1 ? (
                    <span className="text-accent"> </span>
                  ) : null}
                </span>
              </span>
            ))}
          </h2>

          <p className="space-head-p t-body max-w-[54ch] text-center">
            Every property has unique security requirements. Explore how we
            build integrated protection for your environment.
          </p>
        </div>

        {/* 3 cards per row grid */}
        <div className="space-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {SPACES.map(({ id, title, points, Art }, index) => (
            <div key={id} id={id} className="space-card">
              <div className="space-card-inner flex h-full flex-col items-center p-6 sm:p-7">
                <div
                  className="space-art-wrap mb-3 h-36 w-44 text-accent sm:h-40 sm:w-48"
                  style={{ animationDelay: `${index * 0.4}s` }}
                >
                  <Art />
                </div>

                <h3
                  className="mb-3 text-center font-display text-[1.0625rem] font-semibold leading-snug tracking-tight sm:text-[1.125rem]"
                  style={{ color: "var(--space-h2)" }}
                >
                  {title}
                </h3>

                <span className="space-rule mb-4" aria-hidden="true" />

                <ul className="w-full space-y-2.5 text-left">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-[13px] leading-[1.6] text-fg-muted"
                    >
                      <span className="space-dot" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto w-full pt-6">
                  <Link
                    href={`/services#${id}`}
                    aria-label={`Explore ${title}`}
                    className="space-link flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-edge bg-accent-soft px-4 py-2.5 text-[12px] font-medium tracking-wide text-accent"
                  >
                    Explore
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}