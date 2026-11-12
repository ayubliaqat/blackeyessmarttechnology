"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Camera,
  DoorOpen,
  Flame,
  Network,
  SlidersHorizontal,
  Volume2,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

const HERO_VARS_DARK = {
  "--bg": "#000810",
  "--bg-alt": "#000818",
  "--fg": "#f0f0f0",
  "--fg-muted": "#aab6c0",
  "--accent": "#1ce8f0",
  "--accent-soft": "rgba(28, 232, 240, 0.14)",
  "--edge": "rgba(28, 232, 240, 0.14)",
  "--glass-bg": "rgba(0, 8, 24, 0.8)",
  "--glass-bg-hover": "rgba(28, 232, 240, 0.15)",
  "--glass-border": "rgba(28, 232, 240, 0.3)",
  "--glass-highlight": "rgba(255, 255, 255, 0.1)",
  "--glass-shadow": "0 16px 40px -12px rgba(0, 0, 0, 0.85)",
  "--btn-shadow": "0 0 0 0 transparent",
  "--btn-primary-fg": "#000810",
  "--btn-primary-top": "#5df2f7",
  "--btn-primary-bottom": "#1ce8f0",
  "--btn-primary-glow": "rgba(28, 232, 240, 0.35)",
  "--btn-primary-glow-hover": "rgba(28, 232, 240, 0.5)",
  colorScheme: "dark",
} as CSSProperties;

const HERO_VARS_LIGHT = {
  "--bg": "#f4f8fa",
  "--bg-alt": "#e9f0f4",
  "--fg": "#07505a",
  "--fg-muted": "#46586a",
  "--accent": "#07505a",
  "--accent-soft": "rgba(7, 80, 90, 0.12)",
  "--edge": "rgba(0, 8, 24, 0.12)",
  "--glass-bg": "rgba(255, 255, 255, 0.9)",
  "--glass-bg-hover": "rgba(255, 255, 255, 0.98)",
  "--glass-border": "rgba(7, 80, 90, 0.25)",
  "--glass-highlight": "rgba(255, 255, 255, 0.95)",
  "--glass-shadow": "0 14px 36px -14px rgba(0, 8, 24, 0.18)",
  "--btn-shadow": "0 8px 24px -12px rgba(0, 8, 24, 0.25)",
  "--btn-primary-fg": "#f0f0f0",
  "--btn-primary-top": "#0a6d7b",
  "--btn-primary-bottom": "#07505a",
  "--btn-primary-glow": "rgba(7, 80, 90, 0.4)",
  "--btn-primary-glow-hover": "rgba(7, 80, 90, 0.55)",
  colorScheme: "light",
} as CSSProperties;

interface ServiceHotspot {
  id: number;
  label: string;
  detail: string;
  x: number;
  y: number;
  alert?: boolean;
  icon: typeof Camera;
}

const SERVICE_HOTSPOTS: ServiceHotspot[] = [
  {
    id: 1,
    label: "Intercom Systems",
    detail: "Automated Gate Barrier & HD Video Intercom",
    x: 18,
    y: 76,
    icon: DoorOpen,
  },
  {
    id: 2,
    label: "CCTV Surveillance",
    detail: "4K PTZ Cameras • Night Vision & AI Tracking",
    x: 22,
    y: 20,
    icon: Camera,
  },
  {
    id: 3,
    label: "Networking",
    detail: "High-Speed Structured Cabling & Routers",
    x: 47,
    y: 48,
    icon: Network,
  },
  {
    id: 4,
    label: "Home Automation",
    detail: "Smart Lighting, Climate & Access Hub",
    x: 52,
    y: 70,
    icon: SlidersHorizontal,
  },
  {
    id: 5,
    label: "Sound Systems",
    detail: "Multi-Zone Ceiling Speakers & Audio Zoning",
    x: 74,
    y: 26,
    icon: Volume2,
  },
  {
    id: 6,
    label: "Fire Alarm Systems",
    detail: "Addressable Smoke & Thermal Detectors",
    x: 82,
    y: 56,
    alert: true,
    icon: Flame,
  },
];

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function useIsLight() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const el = document.documentElement;
    const read = () => setLight(el.classList.contains("light"));
    read();

    const observer = new MutationObserver(read);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return light;
}

function ParticleWaveBg({
  light,
  active,
  reduced,
}: {
  light: boolean;
  active: boolean;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(
        width * 0.72,
        height * 0.48,
        10,
        width * 0.72,
        height * 0.48,
        width * 0.45,
      );
      if (light) {
        glow.addColorStop(0, "rgba(7, 80, 90, 0.11)");
        glow.addColorStop(1, "rgba(244, 248, 250, 0)");
      } else {
        glow.addColorStop(0, "rgba(28, 232, 240, 0.16)");
        glow.addColorStop(1, "rgba(0, 8, 16, 0)");
      }
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      const cols = width < 768 ? 44 : 78;
      const rows = 20;
      const rgb = light ? "7, 80, 90" : "28, 232, 240";

      for (let r = 0; r < rows; r++) {
        const rowRatio = r / (rows - 1);
        ctx.beginPath();

        for (let c = 0; c <= cols; c++) {
          const colRatio = c / cols;
          const x = colRatio * (width + 80) - 40;

          const wave1 = Math.sin(colRatio * 5.2 + time + rowRatio * 2.4) * 34;
          const wave2 =
            Math.cos(colRatio * 3.1 - time * 0.7 + rowRatio * 1.8) * 22;
          const perspectiveSpread = (rowRatio - 0.5) * (85 + colRatio * 75);
          const y =
            height * 0.54 +
            perspectiveSpread +
            wave1 * (0.4 + rowRatio * 0.7) +
            wave2;

          if (c === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          if (c % 2 === 0) {
            const pulse =
              0.5 + 0.5 * Math.sin(colRatio * 8 + time * 1.6 + r * 0.9);
            const alpha = (light ? 0.16 : 0.22) + pulse * (light ? 0.25 : 0.45);
            const radius = 0.9 + pulse * 1.15;

            ctx.fillStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
            ctx.fillRect(
              x - radius * 0.5,
              y - radius * 0.5,
              radius * 1.6,
              radius * 1.6,
            );
          }
        }

        const lineAlpha =
          (light ? 0.045 : 0.065) * (1 - Math.abs(rowRatio - 0.5));
        ctx.strokeStyle = `rgba(${rgb}, ${lineAlpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (!reduced && active) {
        time += 0.012;
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [light, active, reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/**
 * A device drawn around (0,0) and placed on the building with `transform`.
 * Change translate(x y) to move it, or add scale(s) to resize it.
 * skewY(22) lays it flat on the left wall, skewY(-22) on the right wall.
 * The selected service's device glows; the others are slightly dimmed.
 */
function Device({
  id,
  activeId,
  transform,
  glow = "var(--accent)",
  children,
}: {
  id: number;
  activeId: number;
  transform: string;
  glow?: string;
  children: ReactNode;
}) {
  const on = id === activeId;
  return (
    <g
      transform={transform}
      style={{
        opacity: on ? 1 : 0.8,
        filter: on ? `drop-shadow(0 0 7px ${glow})` : "none",
        transition: "opacity 200ms ease, filter 200ms ease",
      }}
    >
      {children}
    </g>
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const [activeId, setActiveId] = useState<number>(2);

  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const light = useIsLight();

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (reduced) {
        gsap.set(
          [
            ".hero-bg",
            ".hero-left-title",
            ".hero-word",
            ".hero-left-text",
            ".hero-left-btns",
            ".hero-right-building",
            ".service-pin",
          ],
          { clearProps: "all" },
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(".hero-bg", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0);

      // Headline: each word rises out of a blur, one after another
      tl.fromTo(
        ".hero-word",
        { yPercent: 70, opacity: 0, filter: "blur(14px)", rotateX: -35 },
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          rotateX: 0,
          duration: 1.4,
          stagger: 0.13,
          ease: "expo.out",
          clearProps: "filter",
        },
        0.15,
      );

      // Description follows, softly unblurring
      tl.fromTo(
        ".hero-left-text",
        { y: 26, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          clearProps: "filter",
        },
        0.7,
      );

      tl.fromTo(
        ".hero-left-btns",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        0.95,
      );

      tl.fromTo(
        ".hero-right-building",
        { x: 80, scale: 0.94, opacity: 0 },
        { x: 0, scale: 1, opacity: 1, duration: 1.6, ease: "power4.out" },
        0.3,
      );

      tl.fromTo(
        ".service-pin",
        { scale: 0.6, opacity: 0, y: 10 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "back.out(1.6)",
        },
        1.0,
      );

      gsap.to(".hero-right-building", {
        y: -6,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  const scrimClass = light
    ? "bg-gradient-to-t from-[#f4f8fa]/92 via-[#f4f8fa]/55 to-[#f4f8fa]/30 lg:bg-gradient-to-r lg:from-[#f4f8fa]/95 lg:via-[#f4f8fa]/65 lg:to-transparent"
    : "bg-gradient-to-t from-[#000810]/90 via-[#000810]/55 to-[#000810]/30 lg:bg-gradient-to-r lg:from-[#000810]/95 lg:via-[#000810]/60 lg:to-transparent";

  return (
    <section
      ref={rootRef}
      aria-label="BlackEyes Smart Technology"
className="relative flex min-h-svh w-full items-center overflow-hidden bg-bg pb-4 pt-20 lg:pb-6 lg:pt-20"      style={light ? HERO_VARS_LIGHT : HERO_VARS_DARK}
    >
      <div className="hero-bg absolute inset-0 pointer-events-none">
        <ParticleWaveBg light={light} active={inView} reduced={reduced} />
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${scrimClass}`}
      />

      <div className="container-x relative z-10 w-full px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center md:gap-6 lg:col-span-5 lg:mx-0 lg:max-w-none lg:items-start lg:text-left">
            <h1
              className="hero-left-title text-5xl font-extrabold leading-[1.05] tracking-tight [perspective:600px] sm:text-6xl lg:text-[4.5rem] xl:text-[5.5rem]"
              style={{
                color: "var(--accent)",
                textShadow: light
                  ? "none"
                  : "0 0 24px rgba(28, 232, 240, 0.35), 0 0 56px rgba(28, 232, 240, 0.18)",
              }}
            >
              {["Digital", "Security", "You", "Need"].map((word, i) => (
                <span key={word} className="inline-block">
                  <span className="hero-word inline-block will-change-transform">
                    {word}
                  </span>
                  {i < 3 ? "\u00A0" : ""}
                </span>
              ))}
            </h1>

            <p className="hero-left-text text-sm leading-relaxed sm:text-base text-fg-muted">
              CCTV, access control, networking, fire alarm, intercom and sound.
              We design, install and support every layer of your security.
            </p>

            <div className="hero-left-btns mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <Link href="/quote" className="btn btn--primary w-full sm:w-auto">
                Get a Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/services" className="btn w-full sm:w-auto">
                Explore Services
              </Link>
            </div>
          </div>

          <div className="hero-right-building relative mx-auto w-full max-w-2xl lg:col-span-7 lg:max-w-none">
            <div className="relative aspect-[19/15] w-full select-none">
              <svg
                viewBox="0 0 760 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full drop-shadow-[0_0_28px_rgba(28,232,240,0.14)]"
                role="img"
                aria-label="Modern double-story smart building with CCTV camera, video intercom, network rack, smart panel, ceiling speaker and fire alarm"
              >
                <defs>
                  <linearGradient
                    id="isoWallLeft"
                    x1="130"
                    y1="160"
                    x2="380"
                    y2="430"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--accent)"
                      stopOpacity={light ? "0.14" : "0.18"}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent)"
                      stopOpacity="0.02"
                    />
                  </linearGradient>
                  <linearGradient
                    id="isoWallRight"
                    x1="380"
                    y1="160"
                    x2="630"
                    y2="430"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--accent)"
                      stopOpacity={light ? "0.09" : "0.11"}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent)"
                      stopOpacity="0.01"
                    />
                  </linearGradient>

                  <linearGradient
                    id="deviceSurface"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={light ? "#ffffff" : "#17313b"}
                    />
                    <stop
                      offset="100%"
                      stopColor={light ? "#dce9ed" : "#06151e"}
                    />
                  </linearGradient>
                  <linearGradient id="deviceScreen" x1="0" y1="0" x2="1" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--accent)"
                      stopOpacity="0.45"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent)"
                      stopOpacity="0.08"
                    />
                  </linearGradient>
                  <linearGradient id="cameraBody" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#f4f7f8" />
                    <stop offset="55%" stopColor="#9eafb9" />
                    <stop offset="100%" stopColor="#536875" />
                  </linearGradient>
                  <linearGradient id="cameraCone" x1="0" y1="0" x2="1" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--accent)"
                      stopOpacity={activeId === 2 ? "0.5" : "0.25"}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                  <filter
                    id="deviceShadow"
                    x="-40%"
                    y="-40%"
                    width="180%"
                    height="180%"
                  >
                    <feGaussianBlur stdDeviation="3" />
                  </filter>
                  <filter
                    id="softGlow"
                    x="-100%"
                    y="-100%"
                    width="300%"
                    height="300%"
                  >
                    <feGaussianBlur stdDeviation="3" />
                  </filter>
                </defs>

                {/* ---------- Building, stretched 1.2x taller ---------- */}
                <g transform="scale(1 1.2)">
                  <path
                    d="M380 440 L100 320 L380 200 L660 320 Z"
                    stroke="var(--accent)"
                    strokeOpacity="0.18"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />

                  <polygon
                    points="145,140 380,220 380,410 145,330"
                    fill="url(#isoWallLeft)"
                    stroke="var(--accent)"
                    strokeOpacity="0.5"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="380,220 615,140 615,330 380,410"
                    fill="url(#isoWallRight)"
                    stroke="var(--accent)"
                    strokeOpacity="0.4"
                    strokeWidth="1.5"
                  />

                  <polyline
                    points="145,235 380,315 615,235"
                    stroke="var(--accent)"
                    strokeOpacity="0.5"
                    strokeWidth="1.5"
                  />

                  <polygon
                    points="200,160 280,185 280,250 200,225"
                    fill="var(--accent)"
                    fillOpacity="0.06"
                    stroke="var(--accent)"
                    strokeOpacity="0.3"
                    strokeWidth="1"
                  />
                  <polygon
                    points="460,185 540,160 540,225 460,250"
                    fill="var(--accent)"
                    fillOpacity="0.08"
                    stroke="var(--accent)"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                  />
                  <polygon
                    points="250,270 330,295 330,360 250,335"
                    fill="var(--accent)"
                    fillOpacity="0.05"
                    stroke="var(--accent)"
                    strokeOpacity="0.25"
                    strokeWidth="1"
                  />

                  <polygon
                    points="380,85 615,140 380,220 145,140"
                    fill="var(--accent)"
                    fillOpacity={light ? "0.08" : "0.06"}
                    stroke="var(--accent)"
                    strokeOpacity="0.6"
                    strokeWidth="1.5"
                  />

                  {/* Door (intercom sits beside it) */}
                  <polygon
                    points="165,335 210,352 210,300 165,283"
                    fill="var(--accent)"
                    fillOpacity={activeId === 1 ? "0.3" : "0.1"}
                    stroke="var(--accent)"
                    strokeOpacity="0.7"
                    strokeWidth="1.3"
                  />
                </g>

                {/* ---------- Realistic devices, placed beside their labels ---------- */}

                {/* 2. CCTV bullet camera: top-left roof corner, under its label */}
                <Device
                  id={2}
                  activeId={activeId}
                  transform="translate(172 180)"
                >
                  <path d="M16 6 L62 28 L40 66 Z" fill="url(#cameraCone)" />
                  <g transform="rotate(28)">
                    <rect
                      x="-18"
                      y="-6"
                      width="36"
                      height="18"
                      rx="5"
                      fill="#000"
                      opacity="0.25"
                      filter="url(#deviceShadow)"
                    />
                    <rect
                      x="-31"
                      y="-9"
                      width="5"
                      height="18"
                      rx="1.5"
                      fill="#7e929c"
                    />
                    <path
                      d="M-26 0 L-18 0"
                      stroke="#7e929c"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <rect
                      x="-20"
                      y="-9"
                      width="38"
                      height="18"
                      rx="5"
                      fill="url(#cameraBody)"
                      stroke="#d6e1e5"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M-16 -6 L12 -6"
                      stroke="#ffffff"
                      strokeOpacity="0.65"
                      strokeWidth="1.3"
                    />
                    <ellipse
                      cx="17"
                      cy="0"
                      rx="4"
                      ry="8"
                      fill="#14242d"
                      stroke="#d8e3e8"
                      strokeWidth="1.4"
                    />
                    <ellipse
                      cx="18"
                      cy="0"
                      rx="2.4"
                      ry="5"
                      fill="#07131b"
                      stroke="var(--accent)"
                      strokeWidth="0.8"
                    />
                    <circle cx="18.5" cy="-1" r="1.2" fill="var(--accent)" />
                    {[0, 1, 2].map((i) => (
                      <circle
                        key={i}
                        cx={-8 + i * 7}
                        cy="3"
                        r="1.5"
                        fill="#e6f3f5"
                      />
                    ))}
                    <circle cx="-14" cy="-3" r="1.6" fill="var(--accent)" />
                    <circle
                      cx="-14"
                      cy="-3"
                      r="4"
                      fill="var(--accent)"
                      opacity="0.3"
                      filter="url(#softGlow)"
                    />
                  </g>
                </Device>

                {/* 1. Video intercom: left wall, beside the door, above its label */}
                <Device
                  id={1}
                  activeId={activeId}
                  transform="translate(228 386) skewY(22)"
                >
                  <rect
                    x="-11"
                    y="-24"
                    width="30"
                    height="56"
                    rx="3"
                    fill="#000"
                    opacity="0.2"
                    filter="url(#deviceShadow)"
                  />
                  <rect
                    x="-15"
                    y="-28"
                    width="30"
                    height="56"
                    rx="3"
                    fill="url(#deviceSurface)"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="-11"
                    y="-24"
                    width="22"
                    height="26"
                    rx="2"
                    fill="#071820"
                    stroke="#6b8792"
                    strokeWidth="1"
                  />
                  <rect
                    x="-9"
                    y="-22"
                    width="18"
                    height="22"
                    rx="1"
                    fill="url(#deviceScreen)"
                  />
                  <circle cx="0" cy="-20" r="1.5" fill="#d9f7f8" />
                  <path
                    d="M-6 -8 H6"
                    stroke="#d9f7f8"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                  <circle
                    cx="0"
                    cy="10"
                    r="5"
                    fill="#102c35"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M-3 11 Q0 6 3 11"
                    stroke="var(--accent)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M-7 19 H7 M-7 22 H7 M-7 25 H7"
                    stroke="var(--accent)"
                    strokeOpacity="0.65"
                    strokeWidth="1"
                  />
                </Device>

                {/* 3. Network rack + router: centre seam, just below its label */}
                <Device
                  id={3}
                  activeId={activeId}
                  transform="translate(345 355) skewY(22)"
                >
                  <rect
                    x="-14"
                    y="-20"
                    width="36"
                    height="50"
                    rx="2"
                    fill="#000"
                    opacity="0.2"
                    filter="url(#deviceShadow)"
                  />
                  <rect
                    x="-18"
                    y="-24"
                    width="36"
                    height="50"
                    rx="2"
                    fill="url(#deviceSurface)"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                  />
                  {/* router */}
                  <path
                    d="M-10 -20 L-12 -29 M10 -20 L12 -29"
                    stroke="#c5d2d8"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M-12 -29 V-32 M12 -29 V-32"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <rect
                    x="-15"
                    y="-20"
                    width="30"
                    height="9"
                    rx="2"
                    fill="#d4e0e5"
                    stroke="#8299a3"
                    strokeWidth="1"
                  />
                  {[0, 1, 2, 3].map((i) => (
                    <circle
                      key={i}
                      cx={-8 + i * 5}
                      cy="-15.5"
                      r="1.2"
                      fill={i === 0 ? "#35d39a" : "var(--accent)"}
                    />
                  ))}
                  {/* rack units */}
                  {[0, 1, 2].map((i) => {
                    const y = -6 + i * 10;
                    return (
                      <g key={i}>
                        <rect
                          x="-15"
                          y={y}
                          width="30"
                          height="8"
                          rx="1"
                          fill="#10252e"
                          stroke="var(--accent)"
                          strokeOpacity="0.5"
                          strokeWidth="0.6"
                        />
                        <circle
                          cx="-10"
                          cy={y + 4}
                          r="1.3"
                          fill="var(--accent)"
                        />
                        <path
                          d={`M-4 ${y + 4} H12`}
                          stroke="#aab6c0"
                          strokeOpacity="0.7"
                          strokeWidth="1"
                        />
                      </g>
                    );
                  })}
                </Device>

                {/* 4. Smart touch panel: right wall, just above its label */}
                <Device
                  id={4}
                  activeId={activeId}
                  transform="translate(420 348) skewY(-22)"
                >
                  <rect
                    x="-13"
                    y="-21"
                    width="34"
                    height="50"
                    rx="4"
                    fill="#000"
                    opacity="0.2"
                    filter="url(#deviceShadow)"
                  />
                  <rect
                    x="-17"
                    y="-25"
                    width="34"
                    height="50"
                    rx="4"
                    fill="url(#deviceSurface)"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="-13"
                    y="-21"
                    width="26"
                    height="36"
                    rx="2"
                    fill="#071820"
                    stroke="#7b929d"
                    strokeWidth="1"
                  />
                  <rect
                    x="-11"
                    y="-19"
                    width="22"
                    height="32"
                    rx="1"
                    fill="url(#deviceScreen)"
                  />
                  <path
                    d="M-8 -15 H8"
                    stroke="#e6f7f8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* lighting */}
                  <circle
                    cx="-5"
                    cy="-5"
                    r="4"
                    stroke="var(--accent)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M-5 -11 V-9 M-11 -5 H-9 M1 -5 H3"
                    stroke="var(--accent)"
                    strokeWidth="1"
                  />
                  {/* climate */}
                  <circle
                    cx="6"
                    cy="3"
                    r="4"
                    stroke="#b8e7ed"
                    strokeWidth="1.2"
                  />
                  <path d="M6 0 V6 M3 3 H9" stroke="#b8e7ed" strokeWidth="1" />
                  <path
                    d="M-8 9 H8"
                    stroke="#d5e9ed"
                    strokeOpacity="0.65"
                    strokeWidth="1"
                  />
                  <circle cx="0" cy="20" r="2.5" fill="var(--accent)" />
                </Device>

                {/* 5. Speaker: upper right wall, just under its label */}
                <Device
                  id={5}
                  activeId={activeId}
                  transform="translate(548 228) skewY(-22)"
                >
                  <circle
                    cx="3"
                    cy="3"
                    r="16"
                    fill="#000"
                    opacity="0.18"
                    filter="url(#deviceShadow)"
                  />
                  <circle
                    r="16"
                    fill="url(#deviceSurface)"
                    stroke="var(--accent)"
                    strokeWidth="1.4"
                  />
                  <circle
                    r="12"
                    fill="#dbe5e9"
                    stroke="#7f929a"
                    strokeWidth="1"
                  />
                  <circle
                    r="8"
                    fill="#9cabb2"
                    stroke="#647983"
                    strokeWidth="0.8"
                  />
                  <circle r="2.5" fill="#526d78" />
                  {[-5, 0, 5].map((dx) =>
                    [-5, 5].map((dy) => (
                      <circle
                        key={`${dx}${dy}`}
                        cx={dx}
                        cy={dy}
                        r="0.8"
                        fill="#526d78"
                      />
                    )),
                  )}
                  {/* sound waves */}
                  <path
                    d="M-23 -9 Q-31 0 -23 9"
                    stroke="var(--accent)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  <path
                    d="M23 -9 Q31 0 23 9"
                    stroke="var(--accent)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  <path
                    d="M-29 -15 Q-40 0 -29 15"
                    stroke="var(--accent)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                  <path
                    d="M29 -15 Q40 0 29 15"
                    stroke="var(--accent)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    opacity="0.45"
                  />
                </Device>

                {/* 6. Fire alarm panel + smoke detector: lower right wall, under its label */}
                <Device
                  id={6}
                  activeId={activeId}
                  glow="#f59e0b"
                  transform="translate(596 380) skewY(-22)"
                >
                  <rect
                    x="-11"
                    y="-16"
                    width="30"
                    height="40"
                    rx="2"
                    fill="#000"
                    opacity="0.2"
                    filter="url(#deviceShadow)"
                  />
                  <rect
                    x="-15"
                    y="-20"
                    width="30"
                    height="40"
                    rx="2"
                    fill="#a82025"
                    stroke="#ff7777"
                    strokeWidth="1.4"
                  />
                  <rect
                    x="-12"
                    y="-17"
                    width="24"
                    height="26"
                    rx="1"
                    fill="#dc3438"
                    stroke="#ff9b9b"
                    strokeWidth="1"
                  />
                  <circle
                    cy="-4"
                    r="13"
                    fill="#ff3535"
                    opacity="0.18"
                    filter="url(#softGlow)"
                  />
                  <circle
                    cy="-4"
                    r="7"
                    fill="#ffb2a8"
                    stroke="#ffffff"
                    strokeWidth="0.8"
                  />
                  <path
                    d="M-8 12 H8 M-8 15 H8"
                    stroke="#ffd0d0"
                    strokeWidth="1"
                  />
                </Device>

                <Device
                  id={6}
                  activeId={activeId}
                  glow="#f59e0b"
                  transform="translate(548 396) skewY(-22)"
                >
                  <circle
                    cx="2"
                    cy="3"
                    r="14"
                    fill="#000"
                    opacity="0.18"
                    filter="url(#deviceShadow)"
                  />
                  <circle
                    r="14"
                    fill="#e5e9e9"
                    stroke="#8b9ca2"
                    strokeWidth="1.2"
                  />
                  <circle
                    r="10"
                    fill="#f7f8f6"
                    stroke="#b4c1c4"
                    strokeWidth="0.8"
                  />
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <path
                      key={i}
                      d="M0 -9 V-5"
                      stroke="#83969d"
                      strokeWidth="1"
                      transform={`rotate(${i * 60})`}
                    />
                  ))}
                  <circle r="2" fill="#35d39a" />
                </Device>
              </svg>

              {SERVICE_HOTSPOTS.map((node) => {
                const isSelected = node.id === activeId;
                const Icon = node.icon;

                return (
                  <div
                    key={node.id}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="service-pin absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(node.id)}
                      onMouseEnter={() => setActiveId(node.id)}
                      onFocus={() => setActiveId(node.id)}
                      aria-label={`${node.label}: ${node.detail}`}
                      aria-pressed={isSelected}
                      className="group relative flex cursor-pointer items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
                      style={{
                        backgroundColor: isSelected
                          ? node.alert
                            ? "#f59e0b"
                            : "var(--accent)"
                          : "var(--glass-bg)",
                        borderColor: isSelected
                          ? node.alert
                            ? "#f59e0b"
                            : "var(--accent)"
                          : "var(--glass-border)",
                        color: isSelected
                          ? "var(--btn-primary-fg)"
                          : light
                            ? "#07505a"
                            : "var(--fg)",
                        boxShadow: isSelected
                          ? "0 0 24px var(--btn-primary-glow)"
                          : "var(--glass-shadow)",
                        transform: isSelected ? "scale(1.06)" : "scale(1)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute -inset-1.5 rounded-full transition-opacity duration-300 ${
                          isSelected
                            ? "animate-ping opacity-35"
                            : "opacity-0 group-hover:opacity-25"
                        }`}
                        style={{
                          backgroundColor:
                            node.alert && isSelected
                              ? "#f59e0b"
                              : "var(--accent)",
                        }}
                      />

                      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/10">
                        <Icon className="h-3.5 w-3.5" />
                      </span>

                      <span className="relative whitespace-nowrap font-semibold">
                        {node.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
