"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Three.js scene is client-only */
const VaultScene = dynamic(() => import("./VaultScene"), { ssr: false });

/** Scroll distance of the hero sequence, in % of viewport height. Lower = faster. */
const SCROLL_LENGTH = 140;

/** The hero is always dark, even when the site is in light mode */
const HERO_VARS = {
  "--bg": "#000810",
  "--bg-alt": "#000818",
  "--fg": "#f0f0f0",
  "--fg-muted": "#aab6c0",
  "--accent": "#1ce8f0",
  "--accent-soft": "rgba(28, 232, 240, 0.14)",
  "--edge": "rgba(28, 232, 240, 0.1)",
  "--glass-bg": "rgba(255, 255, 255, 0.045)",
  "--glass-bg-hover": "rgba(255, 255, 255, 0.08)",
  "--glass-border": "rgba(28, 232, 240, 0.1)",
  "--glass-highlight": "rgba(255, 255, 255, 0.1)",
  "--glass-shadow": "0 0 0 0 transparent",
  "--btn-shadow": "0 0 0 0 transparent",
  "--btn-primary-fg": "#000810",
  "--btn-primary-top": "#5df2f7",
  "--btn-primary-bottom": "#1ce8f0",
  "--btn-primary-glow": "rgba(28, 232, 240, 0.35)",
  "--btn-primary-glow-hover": "rgba(28, 232, 240, 0.5)",
  colorScheme: "dark",
} as CSSProperties;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ss = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

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

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const phase1Ref = useRef<HTMLDivElement>(null);
  const phase2Ref = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [inView, setInView] = useState(true);

  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  /* pause rendering when the hero is off-screen */
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
      if (reduced) return;

      const apply = (p: number) => {
        progress.current = p;

        const a = 1 - ss(0.04, 0.2, p);
        if (phase1Ref.current) {
          phase1Ref.current.style.opacity = String(a);
          phase1Ref.current.style.transform = `translate3d(0, ${-48 * (1 - a)}px, 0)`;
          phase1Ref.current.style.pointerEvents = a < 0.2 ? "none" : "auto";
        }

        const b = ss(0.74, 0.82, p) * (1 - ss(0.92, 0.98, p));
        if (phase2Ref.current) {
          phase2Ref.current.style.opacity = String(b);
          phase2Ref.current.style.transform = `translate3d(0, ${24 * (1 - ss(0.74, 0.82, p))}px, 0)`;
          phase2Ref.current.style.filter = `blur(${(1 - b) * 6}px)`;
        }

        if (hintRef.current) {
          hintRef.current.style.opacity = String(1 - ss(0, 0.06, p));
        }
        if (flashRef.current) {
          /* flash builds and stays, so the exit never drops to black */
          flashRef.current.style.opacity = String(ss(0.86, 0.95, p));
        }
      };

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: `+=${SCROLL_LENGTH}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => apply(self.progress),
      });
      apply(0);

      /* The h1 is the LCP element: it rises into place but is never hidden,
         so it paints immediately instead of waiting for the animation. */
      gsap.from(".hero-rise", {
        y: 20,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.fromTo(
        ".hero-in",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.15,
        },
      );

      if (dotRef.current) {
        gsap.fromTo(
          dotRef.current,
          { y: 0, opacity: 1 },
          { y: 28, opacity: 0, duration: 1.4, ease: "power2.inOut", repeat: -1 },
        );
      }
    },
    { scope: rootRef, dependencies: [reduced] },
  );

  return (
    <section
      ref={rootRef}
      aria-label="BlackEyes Smart Technology"
      className="relative h-svh w-full overflow-hidden bg-bg"
      style={HERO_VARS}
    >
      {/* 3D scene */}
      <div ref={canvasRef} className="absolute inset-0">
        <VaultScene
          target={progress}
          desktop={desktop}
          reduced={reduced}
          active={inView}
        />
      </div>

      {/* legibility scrims */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#000810]/85 via-[#000810]/60 to-[#000810]/40 lg:bg-gradient-to-r lg:from-[#000810]/90 lg:via-[#000810]/50 lg:to-transparent"
      />

      {/* Phase 1: headline (centered on phones, left-aligned on desktop) */}
      <div
        ref={phase1Ref}
        className="absolute inset-0 flex items-center px-4 py-24 will-change-transform md:px-6 lg:px-8"
      >
        <div className="container-x w-full md:px-6">
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center md:gap-6 lg:mx-0 lg:items-start lg:text-left">
            <h1
              className="t-hero hero-rise"
              style={{
                color: "var(--accent)",
                textShadow:
                  "0 0 24px rgba(28, 232, 240, 0.35), 0 0 56px rgba(28, 232, 240, 0.18)",
              }}
            >
              Digital Security You Need
            </h1>
            <p className="t-lead hero-in opacity-0 motion-reduce:opacity-100">
              CCTV, access control, networking, fire alarm, intercom and
              sound. We design, install and support every layer of your
              security.
            </p>
            <div className="hero-in flex w-full flex-col gap-3 opacity-0 motion-reduce:opacity-100 sm:w-auto sm:flex-row sm:gap-4">
              <Link href="/quote" className="btn btn--primary w-full sm:w-auto">
                Get a Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/services" className="btn w-full sm:w-auto">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 2: shown while flying through the vault */}
      <div
        ref={phase2Ref}
        className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center opacity-0 md:px-6"
      >
        <div className="flex max-w-[32ch] flex-col items-center gap-4">
          <span
            aria-hidden="true"
            className="h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent"
          />
          <p
            className="text-balance text-base font-medium tracking-[0.02em] text-fg md:text-lg"
            style={{ textShadow: "0 0 16px rgba(28, 232, 240, 0.3)" }}
          >
            Every entrance. Every angle. Every hour.
          </p>
          <p className="text-balance text-base text-fg-muted">
            One team to design, install and support it all.
          </p>
          <span
            aria-hidden="true"
            className="h-px w-16 bg-gradient-to-r from-transparent via-accent/60 to-transparent"
          />
        </div>
      </div>

      {/* Scroll hint (bottom center) */}
      <div
        ref={hintRef}
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 flex h-10 w-px -translate-x-1/2 justify-center bg-gradient-to-b from-transparent to-accent/50"
      >
        <span
          ref={dotRef}
          className="absolute top-0 h-1.5 w-1.5 rounded-full bg-accent"
        />
      </div>

      {/* Flash as we exit the vault */}
      <div
        ref={flashRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(160,252,255,0.95) 0%, rgba(28,232,240,0.4) 38%, rgba(0,8,16,0) 70%)",
        }}
      />
    </section>
  );
}