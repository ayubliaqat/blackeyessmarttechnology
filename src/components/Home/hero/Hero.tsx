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
  Router,
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

/* ------------------------------------------------------------------ */
/*  Building geometry                                                  */
/* ------------------------------------------------------------------ */

/** Visible svg area. Width stays 760 (the size you liked); only the empty top/bottom is cropped. */
const VB_X = 0;
const VB_Y = 80;
const VB_W = 760;
const VB_H = 570;
/** Building height multiplier (was 1.2). Raise or lower to taste. */
const BUILD_SCALE = 1.45;
const BUILD_SHIFT = -20;
/** Angle that lays a device flat on a wall at the current height. */
const WALL_SKEW = (Math.atan((80 * BUILD_SCALE) / 235) * 180) / Math.PI;

type Side = "left" | "right";
type Pt = [number, number];

/** Point on a wall (building space). u: 0..1 along the wall, v: 0..1 top to bottom. */
function wallPoint(side: Side, u: number, v: number): Pt {
  const x = side === "left" ? 145 + 235 * u : 380 + 235 * u;
  const top = side === "left" ? 140 + 80 * u : 220 - 80 * u;
  return [x, top + 190 * v];
}

/** Building space to the final svg space (after the height stretch). */
function toView([x, y]: Pt): Pt {
  return [x, y * BUILD_SCALE + BUILD_SHIFT];
}

function pts(list: Pt[]) {
  return list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

/** Transform that places a device flat on a wall. */
function onWall(side: Side, u: number, v: number) {
  const [x, y] = toView(wallPoint(side, u, v));
  const skew = side === "left" ? WALL_SKEW : -WALL_SKEW;
  return `translate(${x.toFixed(1)} ${y.toFixed(1)}) skewY(${skew.toFixed(2)})`;
}

interface WindowSpec {
  side: Side;
  u0: number;
  u1: number;
  v0: number;
  v1: number;
  lit?: boolean;
}

const WINDOWS: WindowSpec[] = [
  // left wall, upper floor
  { side: "left", u0: 0.42, u1: 0.64, v0: 0.1, v1: 0.42, lit: true },
  // left wall, ground floor
  { side: "left", u0: 0.46, u1: 0.64, v0: 0.6, v1: 0.9 },
  // right wall, upper floor
  { side: "right", u0: 0.05, u1: 0.27, v0: 0.1, v1: 0.42 },
  { side: "right", u0: 0.33, u1: 0.52, v0: 0.1, v1: 0.42, lit: true },
  // right wall, ground floor
  { side: "right", u0: 0.33, u1: 0.55, v0: 0.6, v1: 0.9 },
];

const GROUND_N: Pt = [380, 200];
const GROUND_E: Pt = [660, 320];
const GROUND_S: Pt = [380, 440];
const GROUND_W: Pt = [100, 320];

const lerpPt = (a: Pt, b: Pt, t: number): Pt => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
];

const GROUND_LINES = Array.from({ length: 7 }, (_, i) => {
  const t = (i + 1) / 8;
  return {
    a1: lerpPt(GROUND_W, GROUND_N, t),
    a2: lerpPt(GROUND_S, GROUND_E, t),
    b1: lerpPt(GROUND_W, GROUND_S, t),
    b2: lerpPt(GROUND_N, GROUND_E, t),
  };
});

interface ServiceHotspot {
  id: number;
  label: string;
  detail: string;
  /** Position in svg units (see VB_X / VB_Y / VB_W / VB_H) */
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
    x: 150,
    y: 520,
    icon: DoorOpen,
  },
  {
    id: 2,
    label: "CCTV Surveillance",
    detail: "4K PTZ Cameras • Night Vision & AI Tracking",
    x: 172,
    y: 152,
    icon: Camera,
  },
  {
    id: 3,
    label: "Networking",
    detail: "High-Speed Structured Cabling & Routers",
    x: 338,
    y: 282,
    icon: Router,
  },
  {
    id: 4,
    label: "Home Automation",
    detail: "Smart Lighting, Climate & Access Hub",
    x: 400,
    y: 552,
    icon: SlidersHorizontal,
  },
  {
    id: 5,
    label: "Sound Systems",
    detail: "Multi-Zone Ceiling Speakers & Audio Zoning",
    x: 562,
    y: 228,
    icon: Volume2,
  },
  {
    id: 6,
    label: "Fire Alarm Systems",
    detail: "Addressable Smoke & Thermal Detectors",
    x: 620,
    y: 343,
    alert: true,
    icon: Flame,
  },
];

/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Background: night / day city skyline with haze, stars and beacons  */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const makeGrain = (c: 0 | 1) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${c} 0 0 0 0 ${c} 0 0 0 0 ${c} 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  )}")`;

const GRAIN_DARK = makeGrain(1);
const GRAIN_LIGHT = makeGrain(0);

interface SkyLayer {
  min: number;
  max: number;
  w: [number, number];
  dark: string;
  light: string;
  lit: number;
  alpha: number;
  fog: number;
  beacons: boolean;
}

const SKY_LAYERS: SkyLayer[] = [
  {
    min: 0.24,
    max: 0.52,
    w: [34, 80],
    dark: "#04222f",
    light: "#c6d9e1",
    lit: 0.2,
    alpha: 0.3,
    fog: 0.6,
    beacons: true,
  },
  {
    min: 0.13,
    max: 0.36,
    w: [28, 72],
    dark: "#031b27",
    light: "#b2c9d4",
    lit: 0.28,
    alpha: 0.45,
    fog: 0.38,
    beacons: false,
  },
  {
    min: 0.05,
    max: 0.21,
    w: [32, 92],
    dark: "#020f18",
    light: "#9bb7c5",
    lit: 0.34,
    alpha: 0.65,
    fog: 0,
    beacons: false,
  },
];

interface Twinkle {
  x: number;
  y: number;
  phase: number;
  speed: number;
  warm: boolean;
}

interface Beacon {
  x: number;
  y: number;
  phase: number;
}

function SkylineBg({
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

    const scene = document.createElement("canvas");
    const sctx = scene.getContext("2d");
    if (!sctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let twinkles: Twinkle[] = [];
    let beacons: Beacon[] = [];
    const rgb = light ? "7, 80, 90" : "28, 232, 240";

    const buildScene = () => {
      const rand = mulberry32(2026);
      // keep towers in proportion on tall, narrow (phone) screens
      const ref = Math.min(height, width * 0.9);
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sctx.clearRect(0, 0, width, height);
      twinkles = [];
      beacons = [];

      // horizon glow
      const sky = sctx.createLinearGradient(0, height * 0.3, 0, height);
      sky.addColorStop(0, `rgba(${rgb}, 0)`);
      sky.addColorStop(1, `rgba(${rgb}, ${light ? 0.12 : 0.16})`);
      sctx.fillStyle = sky;
      sctx.fillRect(0, 0, width, height);

      // stars
      if (!light) {
        for (let i = 0; i < 90; i++) {
          const sx = rand() * width;
          const sy = rand() * height * 0.55;
          const a = 0.12 + rand() * 0.4;
          const size = rand() < 0.1 ? 1.6 : 1;
          sctx.fillStyle = `rgba(210, 240, 245, ${a.toFixed(2)})`;
          sctx.fillRect(sx, sy, size, size);
        }
      }

      for (const layer of SKY_LAYERS) {
        let x = -12;
        while (x < width + 12) {
          const bw = layer.w[0] + rand() * (layer.w[1] - layer.w[0]);
          const bh = ref * (layer.min + rand() * (layer.max - layer.min));
          const by = height - bh;

          sctx.fillStyle = light ? layer.light : layer.dark;
          sctx.fillRect(x, by, bw, bh + 2);

          // lit roof edge
          sctx.fillStyle = `rgba(${rgb}, ${light ? 0.22 : 0.2})`;
          sctx.fillRect(x, by, bw, 1);

          // windows
          for (let wy = by + 7; wy < height - 5; wy += 11) {
            for (let wx = x + 5; wx < x + bw - 6; wx += 8) {
              const r = rand();
              const warm = rand() < 0.3;
              if (r < layer.lit) {
                const a = layer.alpha * (0.45 + rand() * 0.55);
                sctx.fillStyle = light
                  ? `rgba(255, 255, 255, ${(a * 0.9).toFixed(2)})`
                  : warm
                    ? `rgba(255, 214, 150, ${a.toFixed(2)})`
                    : `rgba(190, 240, 246, ${a.toFixed(2)})`;
                sctx.fillRect(wx, wy, 3, 5);
              } else if (
                r < layer.lit + 0.05 &&
                layer.alpha > 0.4 &&
                twinkles.length < 70
              ) {
                twinkles.push({
                  x: wx,
                  y: wy,
                  phase: rand() * 6.28,
                  speed: 0.8 + rand() * 1.4,
                  warm,
                });
              }
            }
          }

          if (layer.beacons && bh > ref * 0.4 && rand() < 0.5) {
            beacons.push({ x: x + bw / 2, y: by - 3, phase: rand() * 6.28 });
          }

          x += bw + 1 + rand() * 4;
        }

        // atmospheric haze: far layers fade into the background
        if (layer.fog > 0) {
          const top = height - ref * layer.max;
          const fc = light ? "244, 248, 250" : "0, 8, 16";
          const fog = sctx.createLinearGradient(0, top, 0, height);
          fog.addColorStop(0, `rgba(${fc}, 0)`);
          fog.addColorStop(1, `rgba(${fc}, ${layer.fog})`);
          sctx.fillStyle = fog;
          sctx.fillRect(0, top, width, height - top);
        }
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      scene.width = canvas.width;
      scene.height = canvas.height;
      buildScene();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // soft light behind the building
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

      ctx.drawImage(scene, 0, 0, width, height);

      // windows switching on and off
      for (const t of twinkles) {
        const a = Math.sin(time * t.speed + t.phase);
        if (a > 0.2) {
          ctx.fillStyle = light
            ? `rgba(255, 255, 255, ${(a * 0.5).toFixed(2)})`
            : t.warm
              ? `rgba(255, 214, 150, ${(a * 0.7).toFixed(2)})`
              : `rgba(190, 240, 246, ${(a * 0.7).toFixed(2)})`;
          ctx.fillRect(t.x, t.y, 3, 5);
        }
      }

      // aircraft warning lights on the tallest towers
      for (const b of beacons) {
        const pulse = (Math.sin(time * 2.2 + b.phase) + 1) / 2;
        ctx.fillStyle = `rgba(255, 70, 70, ${(0.08 * pulse).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255, 70, 70, ${(0.25 + 0.6 * pulse).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // slow security scan
      const sx = (((time * 0.09) % 1.5) - 0.25) * width;
      const sweep = ctx.createLinearGradient(sx - 140, 0, sx + 140, 0);
      sweep.addColorStop(0, `rgba(${rgb}, 0)`);
      sweep.addColorStop(0.5, `rgba(${rgb}, ${light ? 0.045 : 0.07})`);
      sweep.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = sweep;
      ctx.fillRect(sx - 140, 0, 280, height);
    };

    // ~30fps is plenty for a slow background and keeps the page light
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return;
      time += Math.min((now - last) / 1000, 0.1) * 0.72;
      last = now;
      draw();
    };

    const onResize = () => {
      resize();
      draw();
    };

    resize();
    draw();
    if (!reduced && active) raf = requestAnimationFrame(loop);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [light, active, reduced]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: light ? GRAIN_LIGHT : GRAIN_DARK,
          backgroundSize: "180px 180px",
          opacity: light ? 0.1 : 0.12,
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Building pieces                                                    */
/* ------------------------------------------------------------------ */

/**
 * A device drawn around (0,0) and placed on the building with `transform`.
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

/** A glass window with frame, mullions, sill and a reflection streak. */
function GlassWindow({ w, light }: { w: WindowSpec; light: boolean }) {
  const { side, u0, u1, v0, v1, lit } = w;
  const at = (a: number, b: number): Pt =>
    wallPoint(side, u0 + (u1 - u0) * a, v0 + (v1 - v0) * b);

  const frame = pts([
    wallPoint(side, u0 - 0.012, v0 - 0.02),
    wallPoint(side, u1 + 0.012, v0 - 0.02),
    wallPoint(side, u1 + 0.012, v1 + 0.02),
    wallPoint(side, u0 - 0.012, v1 + 0.02),
  ]);
  const glass = pts([at(0, 0), at(1, 0), at(1, 1), at(0, 1)]);
  const streak = pts([at(0.22, 0), at(0.4, 0), at(0.2, 1), at(0.02, 1)]);
  const sill = pts([
    wallPoint(side, u0 - 0.02, v1 + 0.02),
    wallPoint(side, u1 + 0.02, v1 + 0.02),
    wallPoint(side, u1 + 0.02, v1 + 0.05),
    wallPoint(side, u0 - 0.02, v1 + 0.05),
  ]);
  const [mvx1, mvy1] = at(0.5, 0);
  const [mvx2, mvy2] = at(0.5, 1);
  const [mhx1, mhy1] = at(0, 0.5);
  const [mhx2, mhy2] = at(1, 0.5);

  return (
    <g>
      <polygon
        points={frame}
        fill={light ? "#ffffff" : "#0b2b38"}
        stroke="var(--accent)"
        strokeOpacity="0.55"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <polygon points={glass} fill={light ? "#8fb4c1" : "#020c12"} />
      <polygon points={glass} fill="url(#glass)" />
      {lit && (
        <polygon
          points={glass}
          fill="#ffd9a0"
          fillOpacity={light ? 0.28 : 0.2}
        />
      )}
      <polygon
        points={streak}
        fill="#ffffff"
        fillOpacity={light ? 0.35 : 0.08}
      />
      <path
        d={`M${mvx1} ${mvy1} L${mvx2} ${mvy2} M${mhx1} ${mhy1} L${mhx2} ${mhy2}`}
        stroke={light ? "#ffffff" : "#0b2b38"}
        strokeWidth="1.4"
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        points={sill}
        fill="var(--accent)"
        fillOpacity="0.35"
        stroke="var(--accent)"
        strokeOpacity="0.5"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
      />
    </g>
  );
}

/** Small isometric block used for rooftop equipment. */
function IsoBox({
  cx,
  cy,
  s,
  h,
  top,
  left,
  right,
}: {
  cx: number;
  cy: number;
  s: number;
  h: number;
  top: string;
  left: string;
  right: string;
}) {
  const d = s * 0.4;
  const stroke = {
    stroke: "var(--accent)",
    strokeOpacity: 0.4,
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke" as const,
  };
  return (
    <g>
      <polygon
        points={`${cx - s},${cy} ${cx},${cy + d} ${cx},${cy + d + h} ${cx - s},${cy + h}`}
        fill={left}
        {...stroke}
      />
      <polygon
        points={`${cx},${cy + d} ${cx + s},${cy} ${cx + s},${cy + h} ${cx},${cy + d + h}`}
        fill={right}
        {...stroke}
      />
      <polygon
        points={`${cx - s},${cy} ${cx},${cy - d} ${cx + s},${cy} ${cx},${cy + d}`}
        fill={top}
        {...stroke}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const floatRef = useRef<gsap.core.Tween | null>(null);
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

  useEffect(() => {
    floatRef.current?.paused(!inView);
  }, [inView]);

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

      floatRef.current = gsap.to(".hero-right-building", {
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

  // Surface colours for the building (dark = night, light = day)
  const pal = light
    ? {
        wallL: "#eaf2f5",
        wallR: "#d5e3e9",
        roof: "#cfe0e7",
        groundTop: "#e8f1f4",
        groundBottom: "#d3e2e8",
        slab: "#b5c9d1",
        boxTop: "#e4eef2",
        boxL: "#c3d4db",
        boxR: "#aebfc7",
        door: "#8fb4c1",
        frame: "#ffffff",
      }
    : {
        wallL: "#071b27",
        wallR: "#04121b",
        roof: "#0a2a37",
        groundTop: "#082230",
        groundBottom: "#04111a",
        slab: "#0a2430",
        boxTop: "#12384a",
        boxL: "#0b2733",
        boxR: "#071a24",
        door: "#020c12",
        frame: "#0b2b38",
      };

  const [camX, camY] = toView(wallPoint("left", 0.115, 0.08));
  const current =
    SERVICE_HOTSPOTS.find((n) => n.id === activeId) ?? SERVICE_HOTSPOTS[0];

  return (
    <section
      ref={rootRef}
      aria-label="BlackEyes Smart Technology"
      className="relative flex min-h-svh w-full items-center overflow-hidden bg-bg pb-4 pt-24 sm:pt-20 lg:pb-6 lg:pt-20"
      style={light ? HERO_VARS_LIGHT : HERO_VARS_DARK}
    >
      <div className="hero-bg pointer-events-none absolute inset-0">
        <SkylineBg light={light} active={inView} reduced={reduced} />
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${scrimClass}`}
      />

      <div className="container-x relative z-10 w-full px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center md:gap-6 lg:col-span-5 lg:mx-0 lg:max-w-none lg:items-start lg:text-left">
            <h1
              className="hero-left-title font-extrabold leading-[1.05] tracking-tight [perspective:600px]"
              style={{
                fontSize: "var(--fs-hero)",
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
            <div
              className="relative w-full select-none"
              style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
            >
              <svg
                viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full"
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

                  <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
                    <stop
                      offset="0%"
                      stopColor={light ? "#ffffff" : "var(--accent)"}
                      stopOpacity={light ? "0.6" : "0.34"}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent)"
                      stopOpacity={light ? "0.12" : "0.04"}
                    />
                  </linearGradient>

                  <linearGradient id="groundFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={pal.groundTop} />
                    <stop offset="100%" stopColor={pal.groundBottom} />
                  </linearGradient>
                  <radialGradient
                    id="groundGlow"
                    cx="380"
                    cy="320"
                    r="300"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--accent)"
                      stopOpacity={light ? "0.1" : "0.16"}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent)"
                      stopOpacity="0"
                    />
                  </radialGradient>
                  <clipPath id="groundClip">
                    <polygon points="380,200 660,320 380,440 100,320" />
                  </clipPath>

                  <linearGradient id="castShadow" x1="0" y1="0" x2="1" y2="0">
                    <stop
                      offset="0%"
                      stopColor="#000"
                      stopOpacity={light ? "0.22" : "0.55"}
                    />
                    <stop offset="100%" stopColor="#000" stopOpacity="0" />
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

                {/* ---------- Building, stretched taller (BUILD_SCALE) ---------- */}
                <g
                  transform={`translate(0 ${BUILD_SHIFT}) scale(1 ${BUILD_SCALE})`}
                >
                  {/* Ground slab */}
                  <polygon
                    points="100,320 380,440 380,450 100,330"
                    fill={pal.slab}
                    stroke="var(--accent)"
                    strokeOpacity="0.3"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points="380,440 660,320 660,330 380,450"
                    fill={pal.slab}
                    stroke="var(--accent)"
                    strokeOpacity="0.3"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points="380,200 660,320 380,440 100,320"
                    fill="url(#groundFill)"
                  />
                  <polygon
                    points="380,200 660,320 380,440 100,320"
                    fill="url(#groundGlow)"
                  />
                  {GROUND_LINES.map((l, i) => (
                    <path
                      key={i}
                      d={`M${l.a1[0]} ${l.a1[1]} L${l.a2[0]} ${l.a2[1]} M${l.b1[0]} ${l.b1[1]} L${l.b2[0]} ${l.b2[1]}`}
                      stroke="var(--accent)"
                      strokeOpacity={light ? "0.1" : "0.09"}
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                  <polygon
                    points="380,200 660,320 380,440 100,320"
                    stroke="var(--accent)"
                    strokeOpacity="0.28"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Cast shadow, falls to the right */}
                  <g clipPath="url(#groundClip)">
                    <polygon
                      points="380,410 615,330 700,368 470,452"
                      fill="url(#castShadow)"
                    />
                  </g>

                  {/* Wall bodies */}
                  <polygon
                    points="145,140 380,220 380,410 145,330"
                    fill={pal.wallL}
                  />
                  <polygon
                    points="380,220 615,140 615,330 380,410"
                    fill={pal.wallR}
                  />
                  <polygon
                    points="145,140 380,220 380,410 145,330"
                    fill="url(#isoWallLeft)"
                    stroke="var(--accent)"
                    strokeOpacity="0.5"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points="380,220 615,140 615,330 380,410"
                    fill="url(#isoWallRight)"
                    stroke="var(--accent)"
                    strokeOpacity="0.4"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Cladding panel joints */}
                  {([1, 2, 3, 4, 5, 6] as const).map((n) => {
                    const u = n / 7;
                    const [lx1, ly1] = wallPoint("left", u, 0);
                    const [lx2, ly2] = wallPoint("left", u, 1);
                    const [rx1, ry1] = wallPoint("right", u, 0);
                    const [rx2, ry2] = wallPoint("right", u, 1);
                    return (
                      <path
                        key={n}
                        d={`M${lx1} ${ly1} L${lx2} ${ly2} M${rx1} ${ry1} L${rx2} ${ry2}`}
                        stroke="var(--accent)"
                        strokeOpacity={light ? "0.1" : "0.08"}
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}

                  {/* Floor slab band between the two storeys */}
                  <polygon
                    points={pts([
                      wallPoint("left", 0, 0.5),
                      wallPoint("left", 1, 0.5),
                      wallPoint("left", 1, 0.53),
                      wallPoint("left", 0, 0.53),
                    ])}
                    fill="var(--accent)"
                    fillOpacity="0.2"
                    stroke="var(--accent)"
                    strokeOpacity="0.5"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points={pts([
                      wallPoint("right", 0, 0.5),
                      wallPoint("right", 1, 0.5),
                      wallPoint("right", 1, 0.53),
                      wallPoint("right", 0, 0.53),
                    ])}
                    fill="var(--accent)"
                    fillOpacity="0.16"
                    stroke="var(--accent)"
                    strokeOpacity="0.45"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Base plinth */}
                  <polygon
                    points="145,330 380,410 380,418 145,338"
                    fill="var(--accent)"
                    fillOpacity="0.18"
                    stroke="var(--accent)"
                    strokeOpacity="0.4"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points="380,410 615,330 615,338 380,418"
                    fill="var(--accent)"
                    fillOpacity="0.14"
                    stroke="var(--accent)"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Windows */}
                  {WINDOWS.map((w, i) => (
                    <GlassWindow key={i} w={w} light={light} />
                  ))}

                  {/* Entrance: glass door, canopy and step (intercom sits beside it) */}
                  <polygon
                    points="160,333.1 215,353.9 215,358.5 160,337.7"
                    fill={pal.slab}
                    stroke="var(--accent)"
                    strokeOpacity="0.45"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points="165,335 210,352 210,300 165,283"
                    fill={pal.door}
                    stroke="var(--accent)"
                    strokeOpacity="0.8"
                    strokeWidth="1.3"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points="165,335 210,352 210,300 165,283"
                    fill="url(#glass)"
                  />
                  <polygon
                    points="165,335 210,352 210,300 165,283"
                    fill="var(--accent)"
                    fillOpacity={activeId === 1 ? "0.3" : "0.1"}
                  />
                  <path
                    d="M187.5 291.5 V343.5"
                    stroke={pal.frame}
                    strokeWidth="1.6"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d="M183 318 V330 M192 321 V333"
                    stroke="#d9f7f8"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points="160,278 215,298.8 215,304 160,283.2"
                    fill={pal.frame}
                    stroke="var(--accent)"
                    strokeOpacity="0.6"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Lit corner edge */}
                  <path
                    d="M380 220 V410"
                    stroke="#ffffff"
                    strokeOpacity={light ? "0.9" : "0.28"}
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Parapet / cornice */}
                  <polygon
                    points="145,140 380,220 380,230 145,150"
                    fill="var(--accent)"
                    fillOpacity="0.14"
                    stroke="var(--accent)"
                    strokeOpacity="0.55"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points="380,220 615,140 615,150 380,230"
                    fill="var(--accent)"
                    fillOpacity="0.1"
                    stroke="var(--accent)"
                    strokeOpacity="0.5"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Roof */}
                  <polygon
                    points="380,85 615,140 380,220 145,140"
                    fill={pal.roof}
                    stroke="var(--accent)"
                    strokeOpacity="0.6"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  <polygon
                    points="380,85 615,140 380,220 145,140"
                    fill="var(--accent)"
                    fillOpacity={light ? "0.08" : "0.06"}
                  />
                  <polygon
                    points="380,100 575,150 380,208 185,150"
                    stroke="var(--accent)"
                    strokeOpacity="0.25"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Rooftop equipment */}
                  <IsoBox
                    cx={320}
                    cy={152}
                    s={22}
                    h={10}
                    top={pal.boxTop}
                    left={pal.boxL}
                    right={pal.boxR}
                  />
                  <IsoBox
                    cx={440}
                    cy={140}
                    s={16}
                    h={8}
                    top={pal.boxTop}
                    left={pal.boxL}
                    right={pal.boxR}
                  />
                  <IsoBox
                    cx={395}
                    cy={176}
                    s={10}
                    h={6}
                    top={pal.boxTop}
                    left={pal.boxL}
                    right={pal.boxR}
                  />
                  <path
                    d="M500 134 V96 M494 108 H506"
                    stroke="#aab6c0"
                    strokeWidth="1.4"
                    vectorEffect="non-scaling-stroke"
                  />
                  <circle
                    cx="500"
                    cy="94"
                    r="2.2"
                    fill="#ff4a4a"
                    className="animate-pulse motion-reduce:animate-none"
                  />
                </g>

                {/* ---------- Realistic devices, placed beside their labels ---------- */}

                {/* 2. CCTV bullet camera: top-left roof corner, under its label */}
                <Device
                  id={2}
                  activeId={activeId}
                  transform={`translate(${camX.toFixed(1)} ${camY.toFixed(1)})`}
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
                  transform={onWall("left", 0.36, 0.8)}
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

                {/* 3. Network rack + router: left wall, upper floor, under its label */}
                <Device
                  id={3}
                  activeId={activeId}
                  transform={onWall("left", 0.83, 0.26)}
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

                {/* 4. Smart touch panel: right wall, above its label */}
                <Device
                  id={4}
                  activeId={activeId}
                  transform={onWall("right", 0.17, 0.75)}
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

                {/* 5. Speaker: upper right wall, under its label */}
                <Device
                  id={5}
                  activeId={activeId}
                  transform={onWall("right", 0.715, 0.25)}
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
                  transform={onWall("right", 0.92, 0.75)}
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
                  transform={onWall("right", 0.715, 0.75)}
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
                    style={{
                      left: `${((node.x - VB_X) / VB_W) * 100}%`,
                      top: `${((node.y - VB_Y) / VB_H) * 100}%`,
                    }}
                    className="service-pin absolute z-20 -translate-x-1/2 -translate-y-1/2"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveId(node.id)}
                      onMouseEnter={() => setActiveId(node.id)}
                      onFocus={() => setActiveId(node.id)}
                      aria-label={`${node.label}: ${node.detail}`}
                      aria-pressed={isSelected}
                      className="group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] sm:h-auto sm:w-auto sm:justify-start sm:gap-2.5 sm:px-3.5 sm:py-1.5 sm:backdrop-blur-md"
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
                          ? "0 0 18px var(--btn-primary-glow)"
                          : "var(--glass-shadow)",
                      }}
                    >
                      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/10">
                        <Icon className="h-3.5 w-3.5" />
                      </span>

                      <span className="relative hidden whitespace-nowrap font-semibold sm:inline">
                        {node.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Phone: pills are icon-only, so the selected service is named here */}
            <div
              aria-live="polite"
              className="mt-3 flex min-h-[3.25rem] flex-col items-center text-center sm:hidden"
            >
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {current.label}
              </span>
              <span className="text-xs text-fg-muted">{current.detail}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}