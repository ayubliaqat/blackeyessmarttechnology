"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV_LINKS, SERVICES, SITE } from "@/lib/site";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const CLOSE_DELAY = 140; // ms, prevents flicker when the cursor crosses gaps

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  // Close menus on route change (state adjusted during render, not in an effect)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setDropdownOpen(false);
    setMobileOpen(false);
    setMobileServicesOpen(false);
  }

  const openDropdown = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(
      () => setDropdownOpen(false),
      CLOSE_DELAY,
    );
  }, []);

  // Scroll state (also checked once on mount so a reload mid-page is correct)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const raf = window.requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Escape closes the mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Close the mobile menu (and release the scroll lock) when resizing to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Compact nav link: smaller text, tighter vertical padding
  const linkBase =
    "relative inline-flex items-center gap-1 py-1.5 text-[0.875rem] font-medium tracking-[0.01em] transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-accent hover:after:scale-x-100";

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      <style>{`
        /* ----------------------------------------------------------
           Full-width bar: no side margin, no rounded corners
        ---------------------------------------------------------- */

        .header-bar {
          width: 100%;
          max-width: none;
          margin: 0;
          border-radius: 0 !important;
          border-left: 0 !important;
          border-right: 0 !important;
          border-top: 0 !important;
        }

        /* Compact "Get a Quote" button inside the bar and mobile menu */
        .header-bar .btn,
        .header-mobile .btn {
          min-height: 0;
          padding: 0.5rem 1.1rem;
          font-size: 0.875rem;
          line-height: 1.2;
          gap: 0.4rem;
        }

        .header-mobile .btn {
          padding: 0.65rem 1.1rem;
          font-size: 0.875rem;
        }

        /* Light mode: solid bar with a soft edge and shadow */
        html.light .header-bar {
          background: rgba(255, 255, 255, 0.94);
          border-bottom: 1px solid rgba(7, 80, 90, 0.14) !important;
          box-shadow: 0 8px 24px -16px rgba(0, 8, 24, 0.25);
        }

        /* ----------------------------------------------------------
           Services dropdown card
        ---------------------------------------------------------- */

        .header-dropdown {
          background: color-mix(in srgb, var(--bg) 94%, transparent);
          border: 1px solid var(--edge);
          box-shadow: var(--glass-shadow);
          -webkit-backdrop-filter: blur(20px);
          backdrop-filter: blur(20px);
        }

        html.light .header-dropdown {
          background: #ffffff;
          border-color: rgba(7, 80, 90, 0.18);
          box-shadow:
            0 20px 40px -16px rgba(0, 8, 24, 0.28),
            0 4px 12px -6px rgba(0, 8, 24, 0.12);
        }

        html.light .header-dropdown a:hover,
        html.light .header-dropdown a:focus-visible {
          background: rgba(7, 80, 90, 0.08);
          color: #07505a;
        }

        /* ----------------------------------------------------------
           Mobile menu panel
        ---------------------------------------------------------- */

        .header-mobile {
          background: color-mix(in srgb, var(--bg) 96%, transparent);
        }

        html.light .header-mobile {
          background: rgba(244, 248, 250, 0.98);
        }

        html.light .header-mobile .btn--primary {
          color: #f0f0f0;
        }

        /* ----------------------------------------------------------
           Menu button (light mode)
        ---------------------------------------------------------- */

        html.light .header-menu-btn {
          background: #ffffff;
          border-color: rgba(7, 80, 90, 0.22);
          color: #000810;
        }
      `}</style>

      {/* ---------- Bar: logo left | nav center | actions right ---------- */}
      <div
        className={`glass glass-bar header-bar relative z-50 w-full transition-[height] duration-500 ${
          scrolled ? "h-[3.75rem]" : "h-[4.25rem] md:h-[4.75rem]"
        }`}
      >
        {/* Full width with side padding only (no max-width, no margin) */}
        <div className="grid h-full w-full grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
          {/* Left: logo */}
          <Link
            href="/"
            aria-label={`${SITE.name} home`}
            className="flex shrink-0 items-center justify-self-start"
          >
            <Logo
              priority
              className={`w-auto transition-[height] duration-500 ${
                scrolled ? "h-9 md:h-10" : "h-10 md:h-12"
              }`}
            />
          </Link>

          {/* Center: desktop nav */}
          <nav
            aria-label="Primary"
            className="hidden items-center justify-self-center gap-5 lg:flex xl:gap-7"
          >
            {NAV_LINKS.map((item) => {
              const active = isActive(item.href);

              if ("children" in item) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={openDropdown}
                    onMouseLeave={closeDropdown}
                    onFocus={openDropdown}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        closeDropdown();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setDropdownOpen(false);
                    }}
                  >
                    <Link
                      href={item.href}
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                      aria-current={active ? "page" : undefined}
                      className={`${linkBase} ${
                        active || dropdownOpen
                          ? "text-accent after:scale-x-100"
                          : "text-fg"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </Link>

                    {/* Dropdown: names only (pt-3 bridges the gap so hover never breaks) */}
                    <div
                      className={`absolute left-1/2 top-full w-[235px] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        dropdownOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible translate-y-2 opacity-0"
                      }`}
                    >
                      <ul className="header-dropdown rounded-xl p-1.5">
                        {SERVICES.map((service) => (
                          <li key={service.slug}>
                            <Link
                              href={service.href}
                              onClick={() => setDropdownOpen(false)}
                              className="block rounded-lg px-3 py-1.5 text-[0.875rem] font-medium text-fg transition-[background-color,color] duration-200 hover:bg-accent-soft hover:text-accent focus-visible:bg-accent-soft focus-visible:text-accent"
                            >
                              {service.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`${linkBase} ${
                    active ? "text-accent after:scale-x-100" : "text-fg"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: theme toggle + Get a Quote (+ menu button on mobile) */}
          <div className="flex items-center gap-2 justify-self-end md:gap-3">
            <ThemeToggle />
            <div className="hidden sm:block">
              <Link href="/quote" className="btn btn--primary">
                Get a Quote
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="header-menu-btn inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-edge bg-accent-soft text-fg transition-[color,border-color] duration-300 hover:border-accent hover:text-accent lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Mobile menu: flat list, services as a compact dropdown ---------- */}
      <div
        id="mobile-menu"
        data-lenis-prevent
        className={`header-mobile fixed inset-0 z-40 overflow-y-auto overscroll-contain pb-8 pt-20 backdrop-blur-xl transition-[opacity,visibility] duration-300 lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="w-full px-4 sm:px-6 lg:px-8">
          <ul className="flex flex-col divide-y divide-edge border-y border-edge">
            {NAV_LINKS.map((item) => {
              if ("children" in item) {
                return (
                  <li key={item.href}>
                    <button
                      type="button"
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      aria-expanded={mobileServicesOpen}
                      className={`flex min-h-11 w-full cursor-pointer items-center justify-between px-2 py-2.5 text-base font-semibold transition-colors duration-200 active:bg-accent-soft ${
                        mobileServicesOpen || isActive(item.href)
                          ? "text-accent"
                          : "text-fg"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          mobileServicesOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ${
                        mobileServicesOpen
                          ? "grid-rows-[1fr]"
                          : "grid-rows-[0fr]"
                      }`}
                    >
                      <ul
                        className={`ml-2 flex max-h-[50vh] flex-col overflow-y-auto overflow-x-hidden border-l border-edge ${
                          mobileServicesOpen ? "visible" : "invisible"
                        }`}
                      >
                        {SERVICES.map((service) => {
                          const current = pathname.startsWith(service.href);
                          return (
                            <li key={service.slug}>
                              <Link
                                href={service.href}
                                aria-current={current ? "page" : undefined}
                                className={`-ml-px block min-h-10 border-l-2 px-4 py-2.5 text-sm transition-colors duration-200 hover:bg-accent-soft hover:text-accent focus-visible:bg-accent-soft active:bg-accent-soft active:text-accent ${
                                  current
                                    ? "border-accent bg-accent-soft text-accent"
                                    : "border-transparent text-fg-muted"
                                }`}
                              >
                                {service.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`block min-h-11 px-2 py-2.5 text-base font-semibold transition-colors duration-200 hover:text-accent active:bg-accent-soft ${
                      isActive(item.href) ? "text-accent" : "text-fg"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href="/quote" className="btn btn--primary mt-6 w-full">
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}