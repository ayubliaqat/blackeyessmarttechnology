"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Placeholder client names for Lahore. Replace with real clients (and their
// permission) before going live.
const TESTIMONIALS = [
  {
    quote:
      "The installation was handled professionally from start to finish. Everything was carefully planned, the cables were hidden neatly, and the final setup exceeded our expectations. We can now check every camera from our phones, even when we are travelling.",
    name: "Muhammad Usman",
    role: "Home security, DHA Lahore",
    initials: "MU",
  },
  {
    quote:
      "A very professional experience. The team understood our requirements for the office and delivered a reliable security solution that works seamlessly. Access control for our staff is now simple, and we always know who has entered the building.",
    name: "Ayesha Khan",
    role: "Business owner, Gulberg",
    initials: "AK",
  },
  {
    quote:
      "Great attention to detail throughout the project. The lighting, curtains and cameras all work from one app, and the installation was clean, well organised and completed with care. Our home feels safer and much more comfortable.",
    name: "Bilal Ahmed",
    role: "Smart home, Johar Town",
    initials: "BA",
  },
  {
    quote:
      "From consultation to installation, the entire process was straightforward. They explained every option honestly, did not push unnecessary equipment, and we appreciated the quality of work and attention to detail on every camera position.",
    name: "Sana Fatima",
    role: "CCTV and surveillance, Bahria Town",
    initials: "SF",
  },
  {
    quote:
      "We needed a fire alarm and CCTV system for our factory floor, and the team planned it around our daily operations. The work finished on schedule, and their engineers answered every call during the first weeks without any delay.",
    name: "Hamza Qureshi",
    role: "Factory owner, Sundar Industrial Estate",
    initials: "HQ",
  },
  {
    quote:
      "Our shop had constant losses before we called BlackEyes. The new cameras cover every corner of the store, and the footage is clear even at night. Our staff feel confident, and the setup was done without closing the shop for a single day.",
    name: "Imran Sheikh",
    role: "Retail store, Liberty Market",
    initials: "IS",
  },
  {
    quote:
      "The video intercom and door entry system they installed at our building is excellent. Residents can see visitors clearly and let them in from their own homes. The team was polite, on time and respectful of our family throughout the work.",
    name: "Maryam Chaudhry",
    role: "Apartment building, Model Town",
    initials: "MC",
  },
  {
    quote:
      "They set up the networking and Wi-Fi for our whole office, along with sound systems for our meeting rooms. Everything is fast, stable and neatly labelled. Support after installation has been quick, and I would happily recommend them to others in Lahore.",
    name: "Faisal Mahmood",
    role: "Office network, Johar Town",
    initials: "FM",
  },
];

const HEADING = "Built on trust, backed by experience";

/* ==========================================================================
   Testimonials
   Same tokens, type scale and spacing as the other sections.
   ========================================================================== */

export default function Testimonials() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [edge, setEdge] = useState({ atStart: true, atEnd: false });

  /* ---------- Carousel position ---------- */
  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const max = track.scrollWidth - track.clientWidth;

    setEdge({
      atStart: track.scrollLeft <= 4,
      atEnd: track.scrollLeft >= max - 4,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>("[data-card]");
    if (!card) return;

    track.scrollBy({
      left: direction * (card.offsetWidth + 24),
      behavior: "smooth",
    });
  };

  /* ---------- Entrance ---------- */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const once = (trigger: string, start = "top 85%") => ({
          trigger,
          start,
          once: true,
        });

        gsap.from(".tst-word", {
          yPercent: 110,
          opacity: 0,
          rotateX: -25,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.07,
          scrollTrigger: once(".tst-head"),
        });

        gsap.from(".tst-head-p", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: once(".tst-head"),
        });

        gsap.from(".tst-card", {
          y: 34,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: once(".tst-track", "top 85%"),
        });

        gsap.to(".tst-orb", {
          yPercent: 35,
          xPercent: 6,
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
      id="testimonials"
      aria-label="Client testimonials"
      className="section tst-sec relative overflow-x-clip"
    >
      <style>{`
        /* ----------------------------------------------------------
           Compact spacing (matches the other sections)
        ---------------------------------------------------------- */

        .section.tst-sec {
          padding-top: 1.5rem;
          padding-bottom: 2.5rem;
        }

        @media (min-width: 640px) {
          .section.tst-sec {
            padding-top: 2rem;
            padding-bottom: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .section.tst-sec {
            padding-top: 2.5rem;
            padding-bottom: 3.5rem;
          }
        }

        .tst-sec .tst-head,
        .tst-sec .tst-head h2 {
          margin-top: 0;
        }

        /* ----------------------------------------------------------
           Cards (same shape as the Why choose us cards, no glow)
        ---------------------------------------------------------- */

        .tst-track {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior-x: contain;
        }

        .tst-track::-webkit-scrollbar {
          display: none;
        }

        .tst-sec {
          --n-dark: rgba(0, 0, 0, .55);
          --n-light: rgba(255, 255, 255, .045);
        }

        html.light .tst-sec {
          --n-dark: rgba(30, 45, 70, .16);
          --n-light: rgba(255, 255, 255, 1);
        }

        /* Raised (neumorphic) card: same surface as the page, soft dual shadow */
        .tst-card {
          background: var(--bg);
          box-shadow:
            10px 10px 24px var(--n-dark),
            -8px -8px 20px var(--n-light);
          transition: transform 400ms cubic-bezier(.16, 1, .3, 1);
        }

        @media (hover: hover) {
          .tst-card:hover {
            transform: translateY(-3px);
          }
        }

        .tst-icon {
          background: var(--bg);
          color: var(--accent);
          box-shadow:
            4px 4px 10px var(--n-dark),
            -4px -4px 9px var(--n-light);
        }

        /* ----------------------------------------------------------
           Arrows
        ---------------------------------------------------------- */

        .tst-arrow {
          background: var(--bg);
          color: var(--fg-muted);
          box-shadow:
            5px 5px 12px var(--n-dark),
            -4px -4px 10px var(--n-light);
          transition:
            color 300ms ease,
            box-shadow 300ms ease,
            opacity 300ms ease;
        }

        .tst-arrow:not(:disabled):active {
          box-shadow:
            inset 3px 3px 7px var(--n-dark),
            inset -3px -3px 7px var(--n-light);
        }

        @media (hover: hover) {
          .tst-arrow:not(:disabled):hover {
            color: var(--accent);
          }
        }

        .tst-arrow:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        @media (prefers-reduced-motion: reduce) {
          .tst-card,
          .tst-arrow {
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Ambient theme-aware glow (same treatment as Services) */}
      <div
        aria-hidden="true"
        className="tst-orb pointer-events-none absolute -right-40 top-0 size-[460px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)",
        }}
      />

      <div className="container-x relative">
        {/* Section heading */}
        <div className="section-head section-head--center tst-head">
          <h2
            aria-label={HEADING}
            className="t-h2 font-semibold"
            style={{ color: "#1ce8f0" }}
          >
            {HEADING.split(" ").map((word, index) => (
              <span
                key={word + index}
                aria-hidden="true"
                className="mr-[0.2em] inline-block overflow-hidden align-bottom"
              >
                <span className="tst-word inline-block">{word}</span>
              </span>
            ))}
          </h2>

          <p className="tst-head-p t-body max-w-[54ch] text-center">
            The experiences behind the technology. See what our clients value
            about working with BlackEyes.
          </p>
        </div>

        {/* Cards + arrows */}
        <div className="relative">
          <div
            ref={trackRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") scrollByCard(1);
              if (event.key === "ArrowLeft") scrollByCard(-1);
            }}
            className="tst-track -mx-6 -my-8 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth scroll-px-6 px-6 py-8 outline-none"
          >
            {TESTIMONIALS.map((item, index) => (
              <article
                key={index}
                data-card
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${TESTIMONIALS.length}`}
                className="tst-card relative flex min-h-[320px] w-[86%] shrink-0 snap-start flex-col rounded-card p-6 sm:w-[calc(50%-12px)] sm:min-h-[300px] sm:p-7 lg:w-[calc(33.333%-16px)]"
              >
                <span className="tst-icon flex size-10 items-center justify-center rounded-full sm:size-11">
                  <Quote size={18} strokeWidth={1.6} aria-hidden="true" />
                </span>

                <blockquote className="mt-6 text-[13px] leading-[1.8] text-fg-muted sm:text-sm">
                  {item.quote}
                </blockquote>

                {/* Name, small, below the quote */}
                <div className="mt-auto pt-7">
                  <h3 className="font-display text-xs font-medium leading-tight text-fg">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-[11px] leading-tight text-fg-muted">
                    {item.role}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Desktop arrows: left and right of the cards */}
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={edge.atStart}
            aria-label="Previous testimonial"
            className="tst-arrow absolute -left-5 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full lg:flex"
          >
            <ArrowLeft size={16} strokeWidth={1.7} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={edge.atEnd}
            aria-label="Next testimonial"
            className="tst-arrow absolute -right-5 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full lg:flex"
          >
            <ArrowRight size={16} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>

        {/* Phone / tablet arrows: below the cards */}
        <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={edge.atStart}
            aria-label="Previous testimonial"
            className="tst-arrow flex size-11 items-center justify-center rounded-full"
          >
            <ArrowLeft size={16} strokeWidth={1.7} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={edge.atEnd}
            aria-label="Next testimonial"
            className="tst-arrow flex size-11 items-center justify-center rounded-full"
          >
            <ArrowRight size={16} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}