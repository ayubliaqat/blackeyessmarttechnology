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

        /* Full-width surface, same colour as the page, raised with a soft shadow */
        .footer-card {
          background: var(--bg);
          border-top: 1px solid var(--edge);
          box-shadow:
            0 -10px 28px var(--n-dark),
            0 -3px 10px var(--n-light);
        }
      `}</style>

      {/* Full-width surface with side padding only (no max-width, no margin) */}
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
                {COMPANY_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href === "/about" ? "/about-us" : link.href === "/contact" ? "/contact-us" : link.href}
                      className={linkClass}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div className="col-span-2 flex flex-col gap-4 lg:col-span-1">
              <p className={titleClass}>Contact</p>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href={`tel:${SITE.phone.replace(/\s+/g, "")}`}
                    className={contactRow}
                  >
                    <span
                      className={`${iconTile} group-hover:bg-accent group-hover:text-bg`}
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {SITE.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${SITE.email}`} className={contactRow}>
                    <span
                      className={`${iconTile} group-hover:bg-accent group-hover:text-bg`}
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="break-all">{SITE.email}</span>
                  </a>
                </li>
                <li className="flex min-h-11 w-full items-center gap-4 text-sm text-fg-muted max-lg:rounded-xl max-lg:border max-lg:border-edge max-lg:px-3 max-lg:py-2">
                  <span className={iconTile}>
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="leading-snug">{SITE.address}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar: centered */}
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