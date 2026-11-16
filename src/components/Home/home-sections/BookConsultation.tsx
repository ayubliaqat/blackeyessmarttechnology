"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useSiteIsDark } from "@/lib/useSiteTheme";

/* ───────── Theme (BlackEyes palette) ───────── */

const dark = {
  acc: "#1CE8F0",
  titleHex: "#F0F0F0",
  bodyHex: "#AAB6C0",
  glow: "rgba(28,232,240,0.5)",
  dim: "rgba(28,232,240,0.18)",
  halo: "rgba(28,232,240,0.16)",
  title: "text-[#F0F0F0]",
  body: "text-[#AAB6C0]",
  bar: "bg-[#1CE8F0]",
  accText: "text-[#1CE8F0]",
  card: "border border-[#1CE8F0]/15 bg-white/[0.04] shadow-[0_8px_30px_-12px_rgba(28,232,240,0.14)] backdrop-blur-xl hover:border-[#1CE8F0]/40 hover:shadow-[0_10px_36px_-12px_rgba(28,232,240,0.3)]",
  connector: "after:bg-[#1CE8F0]/30",
  iconBox: "bg-[#1CE8F0]/15 text-[#1CE8F0]",
  window:
    "border border-[#1CE8F0]/20 bg-[#000818]/80 shadow-[0_24px_70px_-20px_rgba(28,232,240,0.35)] backdrop-blur-xl",
  tile: "bg-gradient-to-b from-[#07505A]/45 to-[#000810]",
  avatar: "text-[#1CE8F0]",
  label: "border border-[#1CE8F0]/20 bg-[#000810]/80 text-[#F0F0F0]",
  bubbleA: "border border-[#1CE8F0]/15 bg-white/[0.06] text-[#F0F0F0]",
  bubbleB: "bg-[#1CE8F0] text-[#000810]",
  ctrl: "border border-[#1CE8F0]/15 bg-white/[0.07] text-[#F0F0F0]",
  chip: "border border-[#1CE8F0]/25 bg-[#000818]/90 text-[#F0F0F0] shadow-[0_10px_30px_-10px_rgba(28,232,240,0.5)] backdrop-blur",
  pill: "border border-[#1CE8F0]/20 bg-[#1CE8F0]/10 text-[#1CE8F0]",
  btn: "bg-[#1CE8F0] text-[#000810] shadow-[0_0_34px_-6px_rgba(28,232,240,0.75)] hover:shadow-[0_0_48px_-4px_rgba(28,232,240,0.95)]",
};

type Theme = typeof dark;

const light: Theme = {
  acc: "#07505A",
  titleHex: "#000810",
  bodyHex: "#4B5B66",
  glow: "rgba(7,80,90,0.35)",
  dim: "rgba(7,80,90,0.15)",
  halo: "rgba(28,232,240,0.18)",
  title: "text-[#000810]",
  body: "text-[#4B5B66]",
  bar: "bg-[#07505A]",
  accText: "text-[#07505A]",
  card: "border border-[#07505A]/15 bg-white/80 shadow-[0_8px_30px_-12px_rgba(0,8,24,0.16)] backdrop-blur-xl hover:border-[#07505A]/40 hover:shadow-[0_10px_36px_-12px_rgba(7,80,90,0.3)]",
  connector: "after:bg-[#07505A]/30",
  iconBox: "bg-[#07505A]/10 text-[#07505A]",
  window:
    "border border-[#07505A]/15 bg-white/90 shadow-[0_24px_60px_-20px_rgba(0,8,24,0.3)] backdrop-blur-xl",
  tile: "bg-gradient-to-b from-[#1CE8F0]/25 to-[#07505A]/10",
  avatar: "text-[#07505A]",
  label: "border border-[#07505A]/15 bg-white/90 text-[#000810]",
  bubbleA: "border border-[#07505A]/15 bg-[#07505A]/[0.07] text-[#000810]",
  bubbleB: "bg-[#07505A] text-[#F0F0F0]",
  ctrl: "border border-[#07505A]/15 bg-[#07505A]/10 text-[#000810]",
  chip: "border border-[#07505A]/20 bg-white/95 text-[#000810] shadow-[0_10px_30px_-10px_rgba(7,80,90,0.4)] backdrop-blur",
  pill: "border border-[#07505A]/20 bg-[#07505A]/10 text-[#07505A]",
  btn: "bg-[#07505A] text-[#F0F0F0] shadow-[0_12px_32px_-10px_rgba(7,80,90,0.7)] hover:bg-[#0A6370] hover:shadow-[0_16px_40px_-10px_rgba(7,80,90,0.85)]",
};

/* ───────── Content ───────── */

const ICON = {
  calendar:
    "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z",
  video: "M3 7h11a2 2 0 012 2v6a2 2 0 01-2 2H3zM16 11l5-3v8l-5-3",
  file: "M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5zM14 3v5h5M9 13h6M9 17h6",
  mic: "M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3zM19 11a7 7 0 01-14 0M12 18v3",
  end: "M4 15c4-4 12-4 16 0l-2 3-3-1.5v-2a9 9 0 00-6 0v2L6 18z",
  shield: "M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3zM9 12l2 2 4-4",
  check: "M20 6L9 17l-5-5",
  arrow: "M5 12h14M13 6l6 6-6 6",
};

const STEPS = [
  {
    n: "01",
    title: "Pick a time",
    text: "Choose a slot that suits you. Confirmed instantly.",
    d: ICON.calendar,
  },
  {
    n: "02",
    title: "Quick call",
    text: "We talk through your property and what you need.",
    d: ICON.video,
  },
  {
    n: "03",
    title: "Your custom plan",
    text: "Get a clear plan and quote. No obligation.",
    d: ICON.file,
  },
];

/* ───────── Motion ───────── */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

/* ───────── Call graphic ───────── */

function Person({ expert }: { expert?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 120"
      className="absolute inset-x-0 bottom-0 h-[88%] w-full"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 120c0-28 17-44 38-44s38 16 38 44z"
        fill="currentColor"
        fillOpacity={0.5}
      />
      <circle cx="50" cy="46" r="17" fill="currentColor" fillOpacity={0.9} />
      {expert && (
        <g stroke="currentColor" strokeWidth={2.6} strokeLinecap="round">
          <path d="M29 46a21 21 0 0142 0" />
          <rect
            x="24.5"
            y="42"
            width="6"
            height="13"
            rx="3"
            fill="currentColor"
          />
          <rect
            x="69.5"
            y="42"
            width="6"
            height="13"
            rx="3"
            fill="currentColor"
          />
          <path d="M73 55q0 11-15 12" strokeWidth={2} />
          <circle cx="56" cy="67" r="2.4" fill="currentColor" />
        </g>
      )}
    </svg>
  );
}

function Tile({ t, expert }: { t: Theme; expert?: boolean }) {
  return (
    <div
      className={`relative aspect-[5/6] overflow-hidden rounded-2xl ${t.tile} ${t.avatar} ${
        expert ? "be-ring-b" : "be-ring-a"
      }`}
    >
      <div
        className={`absolute right-2.5 top-2.5 flex h-4 items-end gap-[3px] ${
          expert ? "be-show-b" : "be-show-a"
        }`}
      >
        {[0, 0.25, 0.5, 0.15].map((delay) => (
          <span
            key={delay}
            className="be-bar h-full w-[3px] rounded-full bg-current"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>
      <Person expert={expert} />
      <span
        className={`absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-medium backdrop-blur sm:text-[11px] ${t.label}`}
      >
        {expert ? "BlackEyes Expert" : "You"}
      </span>
    </div>
  );
}

function CallVisual({ t }: { t: Theme }) {
  return (
    <div
      className="relative mx-auto w-full max-w-sm sm:max-w-md"
      style={
        {
          "--acc": t.acc,
          "--glow": t.glow,
          "--dim": t.dim,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div
        className="absolute inset-x-6 inset-y-10 rounded-full blur-3xl"
        style={{ background: t.halo }}
      />

      <div className={`relative rounded-3xl p-3 sm:p-4 ${t.window}`}>
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <span className={`text-xs font-medium ${t.title}`}>
              Let&apos;s discuss your digital security needs
            </span>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${t.pill}`}
          >
            30 min
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Tile t={t} />
          <Tile t={t} expert />
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <p
            className={`be-bub-a max-w-[88%] self-start rounded-2xl rounded-bl-md px-3 py-2 text-xs sm:text-[13px] ${t.bubbleA}`}
          >
            I need CCTV cameras for my home.
          </p>
          <p
            className={`be-bub-b max-w-[88%] self-end rounded-2xl rounded-br-md px-3 py-2 text-xs font-medium sm:text-[13px] ${t.bubbleB}`}
          >
            Great, we&apos;ll plan the perfect setup for you.
          </p>
        </div>

        <div className="mt-3 flex items-center justify-center gap-2.5">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${t.ctrl}`}
          >
            <Icon d={ICON.mic} className="h-4 w-4" />
          </span>
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-full ${t.ctrl}`}
          >
            <Icon d={ICON.video} className="h-4 w-4" />
          </span>
          <span className="flex h-9 w-11 items-center justify-center rounded-full bg-red-500/90 text-white">
            <Icon d={ICON.end} className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div
        className={`be-f1 absolute -left-1 top-14 flex items-center gap-2 rounded-2xl px-3 py-2 text-[11px] font-medium sm:-left-5 sm:text-xs ${t.chip}`}
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full ${t.iconBox}`}
        >
          <Icon d={ICON.check} className="h-3.5 w-3.5" />
        </span>
        Booking confirmed
      </div>
      <div
        className={`be-f2 absolute -right-1 bottom-24 flex items-center gap-2 rounded-2xl px-3 py-2 text-[11px] font-medium sm:-right-5 sm:text-xs ${t.chip}`}
      >
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full ${t.iconBox}`}
        >
          <Icon d={ICON.shield} className="h-3.5 w-3.5" />
        </span>
        Free assessment
      </div>
    </div>
  );
}

/* ───────── Section ───────── */

export default function BookConsultation() {
  const isDark = useSiteIsDark();
  const t = isDark ? dark : light;
  const reduce = useReducedMotion();
  const initial = reduce ? false : "hidden";

  return (
    <section
      id="consultation"
      aria-labelledby="consultation-heading"
      className="relative isolate overflow-hidden pt-2 pb-10 sm:pt-8 sm:pb-[4.5rem] lg:pt-10 lg:pb-[5.5rem]"
    >
      <style>{`
        .be-ring-a,.be-ring-b{box-shadow:0 0 0 1px var(--dim)}
        .be-ring-a{animation:beRingA 8s ease-in-out infinite}
        .be-ring-b{animation:beRingB 8s ease-in-out infinite}
        .be-show-a{animation:beShowA 8s ease-in-out infinite}
        .be-show-b{animation:beShowB 8s ease-in-out infinite}
        .be-bub-a{animation:beBubA 8s ease-out infinite}
        .be-bub-b{animation:beBubB 8s ease-out infinite}
        .be-bar{transform-origin:bottom;animation:beBar .8s ease-in-out infinite}
        .be-f1{animation:beFloat 5s ease-in-out infinite}
        .be-f2{animation:beFloat 6s ease-in-out -2s infinite}
        @keyframes beRingA{0%{box-shadow:0 0 0 1px var(--dim)}6%,42%{box-shadow:0 0 0 2px var(--acc),0 0 32px -2px var(--glow)}50%,100%{box-shadow:0 0 0 1px var(--dim)}}
        @keyframes beRingB{0%,50%{box-shadow:0 0 0 1px var(--dim)}56%,92%{box-shadow:0 0 0 2px var(--acc),0 0 32px -2px var(--glow)}100%{box-shadow:0 0 0 1px var(--dim)}}
        @keyframes beShowA{0%{opacity:0}6%,42%{opacity:1}50%,100%{opacity:0}}
        @keyframes beShowB{0%,50%{opacity:0}56%,92%{opacity:1}100%{opacity:0}}
        @keyframes beBubA{0%{opacity:0;transform:translateY(10px)}6%,42%{opacity:1;transform:none}50%,100%{opacity:0;transform:translateY(-4px)}}
        @keyframes beBubB{0%,50%{opacity:0;transform:translateY(10px)}56%,92%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-4px)}}
        @keyframes beBar{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
        @keyframes beFloat{0%,100%{transform:translateY(-3px)}50%{transform:translateY(4px)}}
        @media (prefers-reduced-motion:reduce){
          .be-ring-a,.be-ring-b,.be-show-a,.be-show-b,.be-bub-a,.be-bub-b,.be-bar,.be-f1,.be-f2{animation:none}
        }
      `}</style>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered heading */}
        <motion.div
          variants={container}
          initial={initial}
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto mb-6 flex max-w-2xl flex-col items-center text-center sm:mb-8"
        >
         <motion.h2
  variants={item}
  id="consultation-heading"
  style={{ color: t.acc }}
  className="t-h2 max-w-2xl font-bold mb-6 text-center sm:mb-8 sm:text-3xl lg:text-4xl"
>
  Let&apos;s discuss your digital security needs
</motion.h2>
<motion.span
  variants={item}
  aria-hidden="true"
  className={`mt-2.5 h-1 w-12 rounded-full ${t.bar}`}
/>
          <motion.span
            variants={item}
            aria-hidden="true"
            className={`mt-2.5 h-1 w-12 rounded-full ${t.bar}`}
          />
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left: description + step cards */}
          <motion.div
            variants={container}
            initial={initial}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.p
              variants={item}
              style={{ color: t.bodyHex }}
              className="max-w-lg text-sm leading-relaxed sm:text-base"
            >
              Your property deserves a plan, not guesswork. In 30 minutes our
              security specialists will assess your space and map out the exact
              CCTV, smart home and networking setup you need, with a clear quote
              and zero obligation. Spots fill fast, so book yours today.
            </motion.p>

            <ol className="mt-6 flex flex-col gap-3">
              {STEPS.map((s, i) => (
                <motion.li
                  key={s.n}
                  variants={item}
                  className={`relative flex items-center gap-3.5 rounded-2xl p-4 transition duration-300 hover:-translate-y-0.5 ${t.card} ${
                    i < STEPS.length - 1
                      ? `after:absolute after:left-9 after:top-full after:h-3 after:w-px after:content-[''] ${t.connector}`
                      : ""
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.iconBox}`}
                  >
                    <Icon d={s.d} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3
                      style={{ color: t.titleHex }}
                      className="text-[15px] font-semibold"
                    >
                      {s.title}
                    </h3>
                    <p
                      style={{ color: t.bodyHex }}
                      className="mt-0.5 text-[13px] leading-snug"
                    >
                      {s.text}
                    </p>
                  </div>
                  <span
                    style={{ color: t.acc }}
                    className="text-xs font-semibold tabular-nums opacity-50"
                  >
                    {s.n}
                  </span>
                </motion.li>
              ))}
            </ol>
          </motion.div>

          {/* Right: graphic */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <CallVisual t={t} />
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center gap-3 text-center sm:mt-12"
        >
          <Link
            href="/meeting"
            className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold transition duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto ${t.btn}`}
          >
            Book a Free Consultation
            <Icon
              d={ICON.arrow}
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <p style={{ color: t.bodyHex }} className="text-sm">
            30 minutes · No obligation · Confirmed instantly
          </p>
        </motion.div>
      </div>
    </section>
  );
}
