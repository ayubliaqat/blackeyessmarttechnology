import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="contact-card">
      <style>{`
        .contact-card {
          position: relative;
          overflow: hidden;
          padding: 1px;
          border-radius: 0 28px 0 28px;
          background: var(--edge);
          isolation: isolate;
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
          color: var(--accent);
          box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 12%, transparent);
        }
      `}</style>

      <div className="contact-card-inner flex h-full flex-col p-6 sm:p-8 lg:p-10">
        <h3
          className="mb-2 font-display text-lg font-semibold tracking-tight"
          style={{ color: "var(--accent)" }}
        >
            Contact Information
        </h3>
        <p className="mb-5 text-[12px] text-fg-muted">
          Connect directly through our official channels or visit our office.
        </p>
        <span className="contact-rule mb-6" aria-hidden="true" />

        <div className="space-y-5">
          {/* Location */}
          <div className="flex items-center gap-3.5">
            <div className="contact-icon-box flex size-9 shrink-0 items-center justify-center rounded-full">
              <MapPin className="size-3.5" aria-hidden="true" />
            </div>
            <span className="text-[12px] font-medium text-fg">
              Lahore, Punjab, Pakistan
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3.5">
            <div className="contact-icon-box flex size-9 shrink-0 items-center justify-center rounded-full">
              <Phone className="size-3.5" aria-hidden="true" />
            </div>
            <span className="text-[12px] font-medium text-fg">
              +92 300 0000000
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3.5">
            <div className="contact-icon-box flex size-9 shrink-0 items-center justify-center rounded-full">
              <Mail className="size-3.5" aria-hidden="true" />
            </div>
            <span className="text-[12px] font-medium text-fg">
              support@blackeyes.tech
            </span>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-3.5">
            <div className="contact-icon-box flex size-9 shrink-0 items-center justify-center rounded-full">
              <Clock className="size-3.5" aria-hidden="true" />
            </div>
            <span className="text-[12px] font-medium text-fg">
              Mon – Sat: 9:00 AM – 6:00 PM
            </span>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <div className="rounded-xl border border-edge bg-bg-alt p-3.5 text-[11px] leading-relaxed text-fg-muted">
            <span className="font-medium text-accent">Professional Guarantee:</span> All site surveys and consultations are handled by certified technical specialists.
          </div>
        </div>
      </div>
    </div>
  );
}