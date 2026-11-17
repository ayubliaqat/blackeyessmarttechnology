"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-card">
      <style>{`
        .contact-card {
          --contact-h2: #1ce8f0;
          --contact-well-shadow: rgba(0, 0, 0, 0.5);
          --contact-well-light: rgba(255, 255, 255, 0.04);
          --contact-invalid: #ef6464;

          position: relative;
          overflow: hidden;
          padding: 1px;
          border-radius: 0 28px 0 28px;
          background: var(--edge);
          isolation: isolate;
        }

        .light .contact-card {
          --contact-h2: #07505a;
          --contact-well-shadow: rgba(7, 80, 90, 0.16);
          --contact-well-light: rgba(255, 255, 255, 0.95);
          --contact-invalid: #c2410c;
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

        /* Neumorphic recessed input wells (theme-aware) */
        .contact-input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid var(--edge);
          background: var(--bg-alt);
          padding: 0.75rem 1rem;
          font-size: 13px;
          color: var(--fg);
          outline: none;
          color-scheme: dark;
          box-shadow:
            inset 2px 2px 5px var(--contact-well-shadow),
            inset -2px -2px 5px var(--contact-well-light);
          transition: border-color 300ms ease, box-shadow 300ms ease;
        }

        .light .contact-input {
          color-scheme: light;
        }

        .contact-input::placeholder {
          color: var(--fg-muted);
          opacity: 0.6;
        }

        .contact-input:hover {
          border-color: color-mix(in srgb, var(--accent) 45%, var(--edge));
        }

        .contact-input:focus {
          border-color: var(--accent);
          box-shadow:
            0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent),
            0 0 14px color-mix(in srgb, var(--accent) 22%, transparent),
            inset 1px 1px 3px var(--contact-well-shadow);
        }

        .contact-input:user-invalid {
          border-color: var(--contact-invalid);
        }

        /* Select: readable dropdown + themed arrow */
        select.contact-input {
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          padding-right: 2.5rem;
          background-image:
            linear-gradient(45deg, transparent 50%, var(--accent) 50%),
            linear-gradient(135deg, var(--accent) 50%, transparent 50%);
          background-position:
            calc(100% - 18px) 55%,
            calc(100% - 13px) 55%;
          background-size: 5px 5px, 5px 5px;
          background-repeat: no-repeat;
        }

        select.contact-input option {
          background: var(--bg);
          color: var(--fg);
        }

        /* Autofill: stop the browser's yellow/blue override */
        .contact-input:-webkit-autofill,
        .contact-input:-webkit-autofill:hover,
        .contact-input:-webkit-autofill:focus {
          -webkit-text-fill-color: var(--fg);
          caret-color: var(--fg);
          -webkit-box-shadow: 0 0 0 1000px var(--bg-alt) inset;
          transition: background-color 9999s ease-out 0s;
        }

        .contact-icon-box {
          background: var(--accent-soft);
          border: 1px solid var(--edge);
          color: var(--contact-h2);
          box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 12%, transparent);
        }
      `}</style>

      <div className="contact-card-inner p-6 sm:p-8 lg:p-10">
        <h3
          className="mb-2 font-display text-lg font-semibold tracking-tight"
          style={{ color: "var(--contact-h2)" }}
        >
          Send us a message
        </h3>
        <p className="mb-5 text-[12px] text-fg-muted">
          Fill out the form below and our technical team will get back to you shortly.
        </p>
        <span className="contact-rule mb-6" aria-hidden="true" />

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="contact-icon-box mb-4 flex size-14 items-center justify-center rounded-full">
              <CheckCircle2 className="size-7" aria-hidden="true" />
            </div>
            <h4
              className="font-display text-base font-semibold"
              style={{ color: "var(--contact-h2)" }}
            >
              Message Sent Successfully
            </h4>
            <p className="mt-1 max-w-[32ch] text-[12px] text-fg-muted">
              Thank you for reaching out. We have received your request and will contact you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block text-[11px] font-medium text-fg-muted">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="Alex Morgan"
                  className="contact-input"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-[11px] font-medium text-fg-muted">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="alex.morgan@example.com"
                  className="contact-input"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-[11px] font-medium text-fg-muted">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+92 300 0000000"
                  className="contact-input"
                />
              </div>
              <div>
                <label htmlFor="service" className="mb-1 block text-[11px] font-medium text-fg-muted">
                  Service Interest
                </label>
                <select id="service" className="contact-input">
                  <option value="cctv">CCTV Camera Installation</option>
                  <option value="access">Access Control Systems</option>
                  <option value="smart">Smart Home Automation</option>
                  <option value="alarms">Security Alarms & Detection</option>
                  <option value="cabling">Structured Cabling & Networking</option>
                  <option value="audio">Public Address & Audio Systems</option>
                  <option value="commercial">Commercial & Industrial Security</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-[11px] font-medium text-fg-muted">
                Project Details / Message
              </label>
              <textarea
                id="message"
                rows={4}
                required
                placeholder="Tell us about your property and security requirements..."
                className="contact-input resize-none"
              />
            </div>

            <button type="submit" className="btn btn--primary mt-2 w-full py-3 text-xs">
              <span>Send Inquiry</span>
              <Send className="size-3.5" aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}