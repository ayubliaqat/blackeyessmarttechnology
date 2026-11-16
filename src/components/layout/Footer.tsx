"use client";

import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { COMPANY_LINKS, LEGAL_LINKS, SITE } from "@/lib/site";
import Logo from "./Logo";

const SERVICES = [
  { title: "CCTV Surveillance", href: "/services/cctv-surveillance" },
  { title: "Home Automation", href: "/services/home-automation" },
  { title: "Networking", href: "/services/networking" },
  { title: "Fire Alarm Systems", href: "/services/fire-alarm-systems" },
  { title: "Intercom Systems", href: "/services/intercom-systems" },
  { title: "Sound Systems", href: "/services/sound-systems" },
];

const titleClass =
  "font-display text-[0.9375rem] font-semibold leading-none tracking-normal text-fg";

const linkClass =
  "relative inline-block py-3 text-sm leading-snug text-fg-muted transition-colors duration-300 after:absolute after:bottom-3 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-accent hover:after:scale-x-100 focus-visible:text-accent focus-visible:after:scale-x-100 md:py-1 md:after:bottom-0.5";

const contactRow =
  "group flex min-h-11 w-full items-center gap-4 text-sm text-fg-muted transition-colors duration-300 hover:text-accent max-lg:rounded-xl max-lg:border max-lg:border-edge max-lg:px-3 max-lg:py-2";

const iconTile =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-edge bg-accent-soft text-accent transition-[background-color,color] duration-300";

export default function Footer() {
  const phoneDisplay = "0315 4143012";
  const phoneHref = "+923154143012";
  const emailAddress = "Blackeyestechnology@gmail.com";

  return (
    <footer className="footer-sec relative w-full">
      <style>{`
        .footer-sec {
          --n-dark: rgba(0, 0, 0, .55);
          --n-light: rgba(255, 255, 255, .045);
        }

        html.light .footer-sec {
          --n-dark: rgba(30, 45, 70, .16);
          --n-light: rgba(255, 255, 255, 1);
        }

        .footer-card {
          background: var(--bg);
          border-top: 1px solid var(--edge);
          box-shadow:
            0 -10px 28px var(--n-dark),
            0 -3px 10px var(--n-light);
        }
      `}</style>

      <div className="footer-card w-full py-10 sm:py-12 lg:py-14">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-12">
            
            {/* Brand */}
            <div className="col-span-2 flex flex-col items-center gap-4 text-center md:items-start md:text-left lg:col-span-1">
              <Link
                href="/"
                aria-label={`${SITE.name} home`}
                className="relative inline-flex items-center justify-center"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-x-6 -inset-y-2 rounded-full bg-accent-soft blur-2xl"
                />
                <Logo className="relative h-16 w-auto md:h-20" />
              </Link>
              <p className="max-w-[36ch] text-sm leading-relaxed text-fg-muted">
                {SITE.tagline}
              </p>
              
              <span
                aria-hidden="true"
                className="h-px w-16 bg-linear-to-r from-transparent via-accent to-transparent"
              />
              <Link href="/quote" className="btn btn--primary w-full sm:w-auto">
                Get a Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Services */}
            <nav
              aria-label="Services"
              className="flex flex-col items-center gap-2 text-center md:items-start md:text-left"
            >
              <p className={titleClass}>Services</p>
              <ul className="flex flex-col items-center md:items-start">
                {SERVICES.map((service) => (
                  <li key={service.href}>
                    <Link href={service.href} className={linkClass}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Company */}
            <nav
              aria-label="Company"
              className="flex flex-col items-center gap-2 text-center md:items-start md:text-left"
            >
              <p className={titleClass}>Company</p>
              <ul className="flex flex-col items-center md:items-start">
                {COMPANY_LINKS.map((link) => {
                  const resolvedHref =
                    link.href === "/about"
                      ? "/about-us"
                      : link.href === "/contact"
                        ? "/contact-us"
                        : link.href;

                  return (
                    <li key={resolvedHref}>
                      <Link href={resolvedHref} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Link href="/blog" className={linkClass}>
                    Blog
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Contact */}
            <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
              <p className={titleClass}>Contact</p>
              <ul className="flex flex-col gap-2">
                <li>
                  <a href={`tel:${phoneHref}`} className={contactRow}>
                    <span className={`${iconTile} group-hover:bg-accent group-hover:text-bg`}>
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${emailAddress}`} className={contactRow}>
                    <span className={`${iconTile} group-hover:bg-accent group-hover:text-bg`}>
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="break-all">{emailAddress}</span>
                  </a>
                </li>
                <li className="flex min-h-11 w-full items-center gap-4 text-sm text-fg-muted max-lg:rounded-xl max-lg:border max-lg:border-edge max-lg:px-3 max-lg:py-2">
                  <span className={iconTile}>
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="leading-snug">
                    Office G-28, Nayab Square, Saadat Town, Bedian Road, Lahore (54000)
                  </span>
                </li>
                
                {/* Social Icons Row placed right after Address */}
                <li className="pt-1 flex items-center gap-3">
                  <a
                    href="https://www.facebook.com/Blackeyestechnology/reels/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="group flex items-center gap-2 text-sm text-fg-muted transition-colors duration-300 hover:text-accent"
                  >
                    <span className={`${iconTile} group-hover:bg-accent group-hover:text-bg`}>
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </span>
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/smart_homes.ae/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="group flex items-center gap-2 text-sm text-fg-muted transition-colors duration-300 hover:text-accent"
                  >
                    <span className={`${iconTile} group-hover:bg-accent group-hover:text-bg`}>
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </span>
                    <span>Instagram</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center gap-2 border-t border-edge pt-6 text-center text-sm text-fg-muted">
            <ul className="flex flex-wrap items-center justify-center gap-x-6">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p>&copy; 2026 {SITE.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}