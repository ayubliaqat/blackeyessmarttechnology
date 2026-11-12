"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Clock, Layers, ShieldCheck, Users, Wrench } from "lucide-react";

const ITEMS = [
  { icon: Clock, title: "24/7 Support" },
  { icon: Wrench, title: "Design to Installation" },
  { icon: Layers, title: "Six Integrated Systems" },
  { icon: Users, title: "One Accountable Team" },
  { icon: ShieldCheck, title: "Ongoing Care" },
];

export default function TrustStrip() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  // Play the reveal once, when the strip scrolls into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Why choose BlackEyes"
      className={`trust-neo relative w-full pb-2 pt-0 md:pb-3 md:pt-0 ${
        shown ? "is-in" : ""
      }`}
    >
      <style>{`
        /* ---------- Tokens: hero palette (dark navy + cyan), light overrides ---------- */
        .trust-neo {
          --neo-a: #03141f;
          --neo-b: #000a14;
          --neo-lo: rgba(0, 0, 0, 0.85);
          --neo-hi: rgba(28, 232, 240, 0.07);
          --neo-line: color-mix(in srgb, var(--accent) 45%, transparent);
          --neo-border: color-mix(in srgb, var(--accent) 24%, transparent);
          --neo-raised: 8px 8px 18px var(--neo-lo), -5px -5px 14px var(--neo-hi);
          --neo-flat: 0 0 0 0 var(--neo-lo), 0 0 0 0 var(--neo-hi);
          --neo-sweep: color-mix(in srgb, var(--accent) 22%, transparent);
        }
        html.light .trust-neo {
          --neo-a: #f4f8fa;
          --neo-b: #e2ebf0;
          --neo-lo: rgba(0, 8, 24, 0.16);
          --neo-hi: rgba(255, 255, 255, 0.95);
          --neo-line: color-mix(in srgb, var(--accent) 35%, transparent);
          --neo-border: color-mix(in srgb, var(--accent) 22%, transparent);
          --neo-sweep: color-mix(in srgb, var(--accent) 14%, transparent);
        }

        /* ---------- Panel: lifts off the surface, then a cyan light sweeps across ---------- */
        .trust-neo .neo-panel {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, var(--neo-a), var(--neo-b));
          border: 1px solid var(--neo-border);
          border-radius: 1.25rem;
          opacity: 0;
          transform: translate3d(0, 32px, 0) scale(0.97);
          box-shadow: var(--neo-flat);
          transition:
            opacity 0.9s ease,
            transform 1.3s cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 1.6s ease 0.1s;
        }
        .trust-neo.is-in .neo-panel {
          opacity: 1;
          transform: none;
          box-shadow: var(--neo-raised);
        }
        .trust-neo .neo-panel::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(100deg, transparent 35%, var(--neo-sweep) 50%, transparent 65%);
          transform: translateX(-120%);
        }
        .trust-neo.is-in .neo-panel::after {
          animation: neo-sweep 2s cubic-bezier(0.45, 0, 0.2, 1) 0.8s both;
        }
        @keyframes neo-sweep {
          from { transform: translateX(-120%); }
          to { transform: translateX(120%); }
        }

        /* ---------- Items rise in one after another ---------- */
        .trust-neo .neo-item {
          position: relative;
          opacity: 0;
          transform: translate3d(0, 22px, 0);
          transition:
            opacity 0.8s ease calc(0.4s + var(--i) * 0.11s),
            transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) calc(0.4s + var(--i) * 0.11s);
        }
        .trust-neo.is-in .neo-item {
          opacity: 1;
          transform: none;
        }

        /* ---------- Icon: pressed in, pops, ripples once, then glows in a travelling wave ---------- */
        .trust-neo .neo-icon {
          position: relative;
          background: linear-gradient(145deg, var(--neo-b), var(--neo-a));
          border: 1px solid var(--neo-border);
          box-shadow:
            inset 3px 3px 6px var(--neo-lo),
            inset -3px -3px 6px var(--neo-hi),
            0 0 0 0 transparent;
          opacity: 0;
          transition: background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease;
        }
        .trust-neo .neo-icon::after {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 9999px;
          border: 1px solid var(--accent);
          opacity: 0;
          pointer-events: none;
        }
        .trust-neo.is-in .neo-icon {
          animation:
            neo-pop 1s cubic-bezier(0.34, 1.56, 0.64, 1) calc(0.55s + var(--i) * 0.11s) both,
            neo-glow 5.5s ease-in-out calc(2.6s + var(--i) * 0.5s) infinite;
        }
        .trust-neo.is-in .neo-icon::after {
          animation: neo-ripple 1.5s ease-out calc(0.75s + var(--i) * 0.11s) 1 both;
        }
        @keyframes neo-pop {
          from { opacity: 0; transform: scale(0.5) rotate(-25deg); }
          to { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes neo-ripple {
          from { opacity: 0.8; transform: scale(1); }
          to { opacity: 0; transform: scale(2.1); }
        }
        @keyframes neo-glow {
          0%, 100% {
            box-shadow:
              inset 3px 3px 6px var(--neo-lo),
              inset -3px -3px 6px var(--neo-hi),
              0 0 0 0 transparent;
          }
          50% {
            box-shadow:
              inset 3px 3px 6px var(--neo-lo),
              inset -3px -3px 6px var(--neo-hi),
              0 0 14px var(--accent-soft);
          }
        }

        /* ---------- Title: unblurs and slides up ---------- */
        .trust-neo .neo-title {
          display: block;
          opacity: 0;
          filter: blur(8px);
          transform: translate3d(0, 10px, 0);
          transition:
            opacity 0.8s ease calc(0.75s + var(--i) * 0.11s),
            filter 0.9s ease calc(0.75s + var(--i) * 0.11s),
            transform 1s cubic-bezier(0.16, 1, 0.3, 1) calc(0.75s + var(--i) * 0.11s),
            color 0.3s ease 0s;
        }
        .trust-neo.is-in .neo-title {
          opacity: 1;
          filter: blur(0);
          transform: none;
        }

        /* ---------- One thin divider line (draws in). Mobile: horizontal, desktop: vertical ---------- */
        .trust-neo .neo-item + .neo-item::before {
          content: "";
          position: absolute;
          top: 0;
          left: 8%;
          right: 8%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--neo-line), transparent);
          transform: scaleX(0);
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) calc(0.7s + var(--i) * 0.11s);
        }
        .trust-neo.is-in .neo-item + .neo-item::before { transform: scaleX(1); }
        @media (min-width: 1024px) {
          .trust-neo .neo-item + .neo-item::before {
            top: 18%;
            bottom: 18%;
            left: 0;
            right: auto;
            width: 1px;
            height: auto;
            background: linear-gradient(180deg, transparent, var(--neo-line), transparent);
            transform: scaleY(0);
          }
          .trust-neo.is-in .neo-item + .neo-item::before { transform: scaleY(1); }
        }

        /* ---------- Hover: icon fills with the accent, content lifts ---------- */
        .trust-neo .neo-inner { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @media (hover: hover) {
          .trust-neo .neo-item:hover .neo-inner { transform: translateY(-3px); }
          .trust-neo .neo-item:hover .neo-icon {
            background: var(--accent);
            border-color: var(--accent);
            color: var(--btn-primary-fg);
          }
          .trust-neo .neo-item:hover .neo-title { color: var(--accent); }
        }

        /* ---------- Reduced motion: everything visible, nothing moves ---------- */
        @media (prefers-reduced-motion: reduce) {
          .trust-neo .neo-panel { opacity: 1; transform: none; transition: none; box-shadow: var(--neo-raised); }
          .trust-neo .neo-panel::after { display: none; }
          .trust-neo .neo-item { opacity: 1; transform: none; transition: none; }
          .trust-neo .neo-icon { opacity: 1; animation: none !important; }
          .trust-neo .neo-icon::after { display: none; }
          .trust-neo .neo-title { opacity: 1; filter: none; transform: none; transition: color 0.3s ease; }
          .trust-neo .neo-item + .neo-item::before { transform: none !important; transition: none; }
        }
      `}</style>

      <div className="container-x relative w-full px-4 md:px-6 lg:px-8">
        <div className="neo-panel px-2 py-1 lg:px-3 lg:py-4">
          <ul className="grid grid-cols-1 lg:grid-cols-5">
            {ITEMS.map(({ icon: Icon, title }, i) => (
              <li
                key={title}
                className="neo-item px-3 py-2.5 lg:px-3 lg:py-0.5"
                style={{ "--i": i } as CSSProperties}
              >
                <div className="neo-inner flex items-center gap-3 lg:flex-col lg:gap-2 lg:text-center">
                  <span className="neo-icon flex size-9 shrink-0 items-center justify-center rounded-full text-accent">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="neo-title font-display text-[0.8125rem] font-semibold text-fg">
                    {title}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}