import { Clock, Layers, ShieldCheck, Wrench } from "lucide-react";

const ITEMS = [
  { icon: Clock, title: "24/7 Support" },
  { icon: Wrench, title: "Design to Installation" },
  { icon: Layers, title: "Six Integrated Systems" },
  { icon: ShieldCheck, title: "Ongoing Care" },
];

/** One loop half: the list repeated so it always overfills wide screens */
const HALF = Array.from({ length: 4 }, () => ITEMS).flat();

function Half() {
  return (
    <ul className="flex shrink-0 items-center">
      {HALF.map(({ icon: Icon, title }, i) => (
        <li key={`${title}-${i}`} className="pr-4">
          <div className="flex items-center gap-3 rounded-full border border-edge bg-[var(--glass-bg)] py-2 pl-2 pr-6">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="trust-label font-display whitespace-nowrap text-[0.9375rem] font-semibold">
              {title}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function TrustStrip() {
  return (
    <section
      aria-label="Why choose BlackEyes"
      className="trust-strip relative w-full overflow-hidden border-y border-edge bg-bg-alt py-6 md:py-8"
    >
      <style>{`
        @keyframes trust-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes trust-sweep {
          from { transform: translate3d(-100%, 0, 0); }
          to { transform: translate3d(350%, 0, 0); }
        }
        .trust-strip .trust-track {
          animation: trust-marquee 36s linear infinite;
        }
        /* a thin cyan light travels along the top edge, echoing the hero scanner */
        .trust-strip::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 30%;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          animation: trust-sweep 7s ease-in-out infinite;
          pointer-events: none;
        }
        /* label: brand cyan with a soft glow in dark mode, deep cyan and flat in light mode */
        .trust-strip .trust-label {
          color: var(--accent);
          text-shadow: 0 0 16px rgba(28, 232, 240, 0.4), 0 0 40px rgba(28, 232, 240, 0.18);
        }
        .light .trust-strip .trust-label { text-shadow: none; }
        .trust-strip li > div { transition: border-color 300ms ease; }
        @media (hover: hover) {
          .trust-strip li > div:hover { border-color: var(--accent); }
          .trust-strip:hover .trust-track { animation-play-state: paused; }
        }
        @media (prefers-reduced-motion: reduce) {
          .trust-strip .trust-track,
          .trust-strip::before { animation: none; }
        }
      `}</style>

      {/* Screen readers get one clean list; the moving copy is decorative */}
      <ul className="sr-only">
        {ITEMS.map(({ title }) => (
          <li key={title}>{title}</li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="flex"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        }}
      >
        <div className="trust-track flex w-max will-change-transform">
          <Half />
          <Half />
        </div>
      </div>
    </section>
  );
}