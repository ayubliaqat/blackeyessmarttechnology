"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { useSiteIsDark } from "@/lib/useSiteTheme";

/* ───────── Types ───────── */

export type FaqItem = { q: string; a: string };

type Cta = { label: string; href: string };

type Props = {
  items?: FaqItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
  cta?: Cta | null;
  /** index to open on load, or null to start with all closed */
  defaultOpen?: number | null;
  allowMultiple?: boolean;
  /** Tailwind top offset for the sticky left column (match your header height) */
  stickyTop?: string;
  /** outputs FAQPage JSON-LD; enable on one section per page only */
  withSchema?: boolean;
  id?: string;
};

/* ───────── Default content ───────── */

export const DEFAULT_FAQS: FaqItem[] = [
  {
    q: "What happens during the free consultation?",
    a: "You pick a time online and we jump on a 30-minute call. We ask about your property, your concerns and your budget, then recommend the right systems. You get a clear plan and quote with no obligation.",
  },
  {
    q: "Which security services do you offer?",
    a: "CCTV, home automation, networking, fire alarm systems, intercom systems and sound systems, plus professional installation, 24/7 support and fully custom solutions.",
  },
  {
    q: "Do you work with both homes and businesses?",
    a: "Yes. We design and install systems for homes, offices, shops and larger commercial sites. Every setup is tailored to your layout, your risks and your budget.",
  },
  {
    q: "How much does a system cost?",
    a: "It depends on the size of your property and the equipment you choose. After the free consultation we give you a clear, itemised quote, so you know exactly what you are paying for before anything starts.",
  },
  {
    q: "Do you handle the installation, and how long does it take?",
    a: "Yes. Professional installation is part of our service, from planning through to setup. How long it takes depends on the size and complexity of the job, and we confirm the timeline in your quote.",
  },
  {
    q: "Will I get support after installation?",
    a: "Yes. We provide 24/7 support, so if anything needs attention after your system is live, our team is there to help.",
  },
];

/* ───────── Theme (BlackEyes palette) ───────── */

const dark = {
  acc: "#1CE8F0",
  titleHex: "#F0F0F0",
  bodyHex: "#AAB6C0",
  halo: "rgba(28,232,240,0.10)",
  bar: "bg-[#1CE8F0]",
  eyebrowLine: "bg-[#1CE8F0]",
  item: "border border-[#1CE8F0]/15 bg-white/[0.04] backdrop-blur-xl hover:border-[#1CE8F0]/40",
  itemOpen:
    "border border-[#1CE8F0] shadow-[0_12px_44px_-14px_rgba(28,232,240,0.45)]",
  qClosed: "text-[#F0F0F0]",
  qOpen: "bg-[#1CE8F0] text-[#000810]",
  chevClosed: "bg-[#1CE8F0]/15 text-[#1CE8F0]",
  chevOpen: "bg-[#000810]/15 text-[#000810]",
  answer: "bg-[#1CE8F0]/[0.05]",
  btn: "bg-[#1CE8F0] text-[#000810] shadow-[0_0_34px_-6px_rgba(28,232,240,0.75)] hover:shadow-[0_0_48px_-4px_rgba(28,232,240,0.95)]",
  focus: "focus-visible:ring-2 focus-visible:ring-[#1CE8F0]/60",
};

type Theme = typeof dark;

const light: Theme = {
  acc: "#07505A",
  titleHex: "#000810",
  bodyHex: "#4B5B66",
  halo: "rgba(28,232,240,0.14)",
  bar: "bg-[#07505A]",
  eyebrowLine: "bg-[#07505A]",
  item: "border border-[#07505A]/15 bg-white/80 backdrop-blur-xl hover:border-[#07505A]/40",
  itemOpen:
    "border border-[#07505A] shadow-[0_12px_40px_-14px_rgba(7,80,90,0.45)]",
  qClosed: "text-[#000810]",
  qOpen: "bg-[#07505A] text-[#F0F0F0]",
  chevClosed: "bg-[#07505A]/10 text-[#07505A]",
  chevOpen: "bg-[#F0F0F0]/20 text-[#F0F0F0]",
  answer: "bg-[#07505A]/[0.05]",
  btn: "bg-[#07505A] text-[#F0F0F0] shadow-[0_12px_32px_-10px_rgba(7,80,90,0.7)] hover:bg-[#0A6370] hover:shadow-[0_16px_40px_-10px_rgba(7,80,90,0.85)]",
  focus: "focus-visible:ring-2 focus-visible:ring-[#07505A]/60",
};

/* ───────── Motion ───────── */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function Icon({
  d,
  className = "h-5 w-5",
}: {
  d: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const ICON = {
  chevron: "M6 9l6 6 6-6",
  arrow: "M5 12h14M13 6l6 6-6 6",
};

/* ───────── Component ───────── */

export default function FaqSection({
  items = DEFAULT_FAQS,
  eyebrow = "FAQ",
  title = "Frequently Asked Questions",
  description = "Everything you need to know before booking your free security consultation. Can't find your answer? We're one call away.",
  cta = { label: "Book a Free Consultation", href: "/meeting" },
  defaultOpen = 0,
  allowMultiple = false,
  stickyTop = "lg:top-28",
  withSchema = false,
  id = "faq",
}: Props) {
  const isDark = useSiteIsDark();
  const t = isDark ? dark : light;
  const reduce = useReducedMotion();
  const initial = reduce ? false : "hidden";
  const uid = useId();
  const [open, setOpen] = useState<number[]>(
    defaultOpen === null ? [] : [defaultOpen]
  );

  function toggle(i: number) {
    setOpen((prev) => {
      if (prev.includes(i)) return prev.filter((x) => x !== i);
      return allowMultiple ? [...prev, i] : [i];
    });
  }

  const schema = withSchema
    ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }).replace(/</g, "\\u003c")
    : null;

  return (
   <section
  id={id}
  aria-labelledby={`${uid}-heading`}
  className="relative isolate pt-4 pb-14 sm:pt-8 sm:pb-[4.5rem] lg:pt-10 lg:pb-[5.5rem]"
>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-clip"
      >
        <div
          className="absolute left-0 top-1/4 h-[26rem] w-[26rem] -translate-x-1/3 rounded-full blur-3xl"
          style={{ background: t.halo }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* Left: sticky heading + text */}
          <motion.div
            variants={container}
            initial={initial}
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className={`lg:sticky lg:self-start ${stickyTop}`}
          >
            <motion.p
              variants={item}
              style={{ color: t.bodyHex }}
              className="mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              <span className={`h-px w-8 ${t.eyebrowLine}`} />
              {eyebrow}
            </motion.p>

            <motion.h2
              variants={item}
              id={`${uid}-heading`}
              style={{ color: t.acc }}
              className="text-[length:var(--fs-h2,clamp(1.75rem,3.5vw,2.5rem))] font-semibold leading-tight tracking-tight"
            >
              {title}
            </motion.h2>

            <motion.span
              variants={item}
              aria-hidden="true"
              className={`mt-4 block h-1 w-12 rounded-full ${t.bar}`}
            />

            <motion.p
              variants={item}
              style={{ color: t.bodyHex }}
              className="mt-5 max-w-md text-sm leading-relaxed sm:text-base"
            >
              {description}
            </motion.p>

            {cta && (
              <motion.div variants={item} className="mt-7">
                <Link
                  href={cta.href}
                  className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold transition duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto ${t.btn}`}
                >
                  {cta.label}
                  <Icon
                    d={ICON.arrow}
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Right: accordion */}
          <motion.ul
            variants={container}
            initial={initial}
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="flex flex-col gap-3"
          >
            {items.map((f, i) => {
              const isOpen = open.includes(i);
              const btnId = `${uid}-q-${i}`;
              const panelId = `${uid}-a-${i}`;
              return (
                <motion.li
                  key={f.q}
                  variants={item}
                  className={`overflow-hidden rounded-2xl transition-all duration-300 ${t.item} ${
                    isOpen ? t.itemOpen : ""
                  }`}
                >
                  <h3 className="m-0 text-base">
                    <button
                      type="button"
                      id={btnId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(i)}
                      className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold outline-none transition-colors duration-300 sm:px-6 sm:py-[1.125rem] sm:text-base ${t.focus} ${
                        isOpen ? t.qOpen : t.qClosed
                      }`}
                    >
                      <span>{f.q}</span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition duration-300 ${
                          isOpen ? t.chevOpen : t.chevClosed
                        }`}
                      >
                        <Icon
                          d={ICON.chevron}
                          className={`h-4 w-4 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    inert={!isOpen}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p
                        style={{ color: t.bodyHex }}
                        className={`px-5 py-4 text-sm leading-relaxed sm:px-6 sm:py-5 sm:text-[15px] ${t.answer}`}
                      >
                        {f.a}
                      </p>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </div>

      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      )}
    </section>
  );
}