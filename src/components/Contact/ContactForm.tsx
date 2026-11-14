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

        /* Neumorphic recessed input wells */
        .contact-input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid var(--edge);
          background: var(--bg-alt);
          padding: 0.75rem 1rem;
          font-size: 13px;
          color: var(--fg);
          outline: none;
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.08), inset -2px -2px 5px color-mix(in srgb, var(--bg) 60%, transparent);
          transition: border-color 300ms ease, box-shadow 300ms ease;
        }

        .contact-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 15%, transparent), inset 1px 1px 3px rgba(0, 0, 0, 0.05);
        }

        .contact-icon-box {
          background: var(--accent-soft);
          border: 1px solid var(--edge);
          color: var(--accent);
          box-shadow: 0 0 16px color-mix(in srgb, var(--accent) 12%, transparent);
        }
      `}</style>

      <div className="contact-card-inner p-6 sm:p-8 lg:p-10">
        <h3
          className="mb-2 font-display text-lg font-semibold tracking-tight"
          style={{ color: "var(--accent)" }}
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
            <h4 className="font-display text-base font-semibold text-fg">
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
                  placeholder="Muhammad Ayub"
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
                  placeholder="ayub@example.com"
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