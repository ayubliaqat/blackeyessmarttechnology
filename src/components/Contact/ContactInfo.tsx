import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="contact-card">
      <style>{`
        .contact-card {
          --contact-h2: #1ce8f0;
          --contact-text: #f0f0f0;
          --contact-muted: #aab6c0;
          --contact-link-hover: #1ce8f0;

          position: relative;
          overflow: hidden;
          padding: 1px;
          border-radius: 0 28px 0 28px;
          background: var(--edge);
          isolation: isolate;
        }

        .light .contact-card {
          --contact-h2: #07505a;
          --contact-text: #000810;
          --contact-muted: #4b5b66;
          --contact-link-hover: #07505a;
        }

        .contact-card-inner {
          position: relative;
          z-index: 1;
          height: 100%;
          border-radius: inherit;
          background: var(--bg);
        }

        .contact-rule {
          display: block;
          width: 40px;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.8;
        }

        .contact-icon-box {
          background: var(--accent-soft);
          border: 1px solid var(--edge);
          color: var(--contact-h2);
          box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 12%, transparent);
        }

        .contact-text {
          color: var(--contact-text);
        }

        .contact-muted {
          color: var(--contact-muted);
        }

        .contact-link {
          color: var(--contact-text);
          transition: color 300ms ease;
        }

        .contact-link:hover,
        .contact-link:focus-visible {
          color: var(--contact-link-hover);
        }

        .contact-note {
          border: 1px solid var(--edge);
          background: var(--bg-alt);
          color: var(--contact-muted);
        }

        .contact-note strong {
          color: var(--contact-h2);
          font-weight: 600;
        }
      `}</style>

      <div className="contact-card-inner flex h-full flex-col p-6 sm:p-8 lg:p-10">
        <h3
          className="mb-2 font-display text-lg font-semibold tracking-tight"
          style={{ color: "var(--contact-h2)" }}
        >
          Contact Information
        </h3>
        <p className="contact-muted mb-5 text-[12px]">
          Connect directly through our official channels or visit our headquarters.
        </p>
        <span className="contact-rule mb-6" aria-hidden="true" />

        <div className="space-y-5">
          {/* Location */}
          <div className="flex items-start gap-3.5">
            <div className="contact-icon-box mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full">
              <MapPin className="size-3.5" aria-hidden="true" />
            </div>
            <span className="contact-text text-[12px] font-medium leading-relaxed">
              Office G-28, Nayab Square, Saadat Town, Bedian Road, Lahore (54000)
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3.5">
            <div className="contact-icon-box flex size-9 shrink-0 items-center justify-center rounded-full">
              <Phone className="size-3.5" aria-hidden="true" />
            </div>
            <a
              href="tel:+923154143012"
              className="contact-link text-[12px] font-medium"
            >
              0315 4143012
            </a>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3.5">
            <div className="contact-icon-box flex size-9 shrink-0 items-center justify-center rounded-full">
              <Mail className="size-3.5" aria-hidden="true" />
            </div>
            <a
              href="mailto:Blackeyestechnology@gmail.com"
              className="contact-link break-all text-[12px] font-medium"
            >
              Blackeyestechnology@gmail.com
            </a>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-3.5">
            <div className="contact-icon-box flex size-9 shrink-0 items-center justify-center rounded-full">
              <Clock className="size-3.5" aria-hidden="true" />
            </div>
            <span className="contact-text text-[12px] font-medium">
              Mon – Sat: 9:00 AM – 6:00 PM
            </span>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <div className="contact-note rounded-xl p-3.5 text-[11px] leading-relaxed">
            <strong>Professional Guarantee:</strong> All site surveys and consultations are handled by certified technical specialists.
          </div>
        </div>
      </div>
    </div>
  );
}