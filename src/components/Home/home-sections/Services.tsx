"use client";

import { useRef, type ComponentType } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ==========================================================================
   Animated service illustrations (unchanged)
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
   Every card has the illustration, a heading and exactly three points.
   ========================================================================== */

type Service = {
  id: string;
  title: string;
  points: string[];
  Art: ComponentType;
};

const SERVICES: Service[] = [
  {
    id: "cctv-surveillance",
    title: "CCTV & Access Control",
    points: ["IP cameras", "Remote viewing", "Access control"],
    Art: CctvArt,
  },
  {
    id: "home-automation",
    title: "Home Automation",
    points: ["Lighting", "Climate", "Scenes"],
    Art: AutomationArt,
  },
  {
    id: "networking",
    title: "Networking",
    points: ["Structured cabling", "Wi-Fi", "Secure access"],
    Art: NetworkArt,
  },
  {
    id: "fire-alarm-systems",
    title: "Fire Alarm",
    points: ["Detection", "Alarms", "Control panels"],
    Art: FireArt,
  },
  {
    id: "intercom-systems",
    title: "Intercom",
    points: ["Video", "Audio", "Door entry"],
    Art: IntercomArt,
  },
  {
    id: "sound-systems",
    title: "Sound Systems",
    points: ["Background music", "Public address", "Multi-room"],
    Art: SoundArt,
  },
];

const HEADING = "Security systems, end to end";

/* ==========================================================================
   Services section
   ========================================================================== */

export default function Services() {
  const rootRef = useRef<HTMLElement>(null);

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

        gsap.from(".svc-card", {
          y: 32,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: once(".svc-grid", "top 82%"),
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
           Heading color (dark = electric, light = deep cyan)
        ---------------------------------------------------------- */

        .svc-sec {
          --svc-h2: #1ce8f0;
        }

        .light .svc-sec {
          --svc-h2: #07505a;
        }

        /* ----------------------------------------------------------
           Illustration keyframes
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

        @keyframes svc-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes svc-beam {
          to { transform: rotate(360deg); }
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

        .svc-art-wrap {
          animation: svc-float 5s ease-in-out infinite;
        }

        /* ----------------------------------------------------------
           Cards (same style as the Why Choose Us cards)
        ---------------------------------------------------------- */

        .svc-card {
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

        .svc-card::before {
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
          animation: svc-beam 6s linear infinite;
        }

        .svc-card-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          border-radius: inherit;
          background: var(--bg);
          transition: background-color 400ms ease;
        }

        .svc-rule {
          display: block;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.8;
          transition: width 400ms cubic-bezier(.16, 1, .3, 1);
        }

        .svc-dot {
          flex-shrink: 0;
          margin-top: 0.62em;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: var(--accent);
          box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 55%, transparent);
        }

        .svc-link {
          transition:
            border-color 300ms ease,
            background-color 300ms ease,
            transform 300ms cubic-bezier(.16, 1, .3, 1);
        }

        .svc-link svg {
          transition: transform 300ms ease;
        }

        @media (hover: hover) {
          .svc-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px -18px color-mix(in srgb, var(--accent) 35%, transparent);
        }

        .svc-card:hover .svc-card-inner {
            background: var(--bg-alt);
        }

        .svc-card:hover .svc-rule {
            width: 64px;
        }

        .svc-link:hover {
            border-color: var(--accent);
        }

        .svc-link:hover svg {
            transform: translateX(3px);
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
           Accessibility
        ---------------------------------------------------------- */

        @media (prefers-reduced-motion: reduce) {
        .svc-art *,
        .svc-art-wrap,
        .svc-card::before {
          animation: none !important;
        }

        .svc-card,
        .svc-card-inner,
        .svc-link,
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
        <div className="section-head section-head--center svc-head mb-8 lg:mb-10">
          <h2 className="t-h2 font-bold" style={{ color: "var(--svc-h2)" }}>
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

         <p className="svc-head-p t-body max-w-[54ch] text-center text-[14px]">
            Six disciplines, one accountable team. From the first site survey
            to round-the-clock support.
          </p>
        </div>

        {/* Service cards */}
        <div className="svc-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {SERVICES.map(({ id, title, points, Art }, index) => (
            <div key={id} id={id} className="svc-card">
              <div className="svc-card-inner flex h-full flex-col items-center p-6 sm:p-7">
                {/* Animated illustration (Reduced size) */}
                <div
                  className="svc-art-wrap mb-3 h-28 w-36 text-accent sm:h-32 sm:w-40"
                  style={{ animationDelay: `${index * 0.4}s` }}
                >
                  <Art />
                </div>

                {/* Heading */}
               <h3
                  className="mb-3 text-center font-display text-[1rem] font-semibold leading-snug tracking-tight sm:text-[1.0625rem]"
                  style={{ color: "var(--svc-h2)" }}
                >
                  {title}
                </h3>

                <span className="svc-rule mb-4" aria-hidden="true" />

                {/* Three equal points (Paragraph font size set to 12px) */}
                <ul className="w-full space-y-2.5 text-left">
                  {points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2.5 text-[12px] leading-[1.6] text-fg-muted"
                    >
                      <span className="svc-dot" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Link pinned to the bottom so all cards line up */}
                <div className="mt-auto w-full pt-6">
                  <Link
                    href={`/services/${id}`}
                    aria-label={`Explore ${title}`}
                    className="svc-link flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-edge bg-accent-soft px-4 py-2.5 text-[12px] font-medium tracking-wide text-accent"
                  >
                    Explore
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="svc-cta mt-12 flex justify-center lg:mt-16">
          <Link href="/services" className="btn btn--primary">
            View all services
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}