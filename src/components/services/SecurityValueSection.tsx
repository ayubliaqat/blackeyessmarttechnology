"use client";

import { ShieldCheck, Eye, Zap, Lock } from "lucide-react";

const benefits = [
  {
    title: "Proactive Crime Deterrence",
    description: "Visible enterprise-grade cameras instantly discourage unauthorized trespassers and potential intruders before incidents occur.",
  },
  {
    title: "24/7 Remote Smartphone Access",
    description: "Monitor live feeds, review playback recordings, and manage security settings securely from anywhere via your mobile device.",
  },
  {
    title: "Crystal-Clear Evidentiary Footage",
    description: "High-resolution video capture ensures sharp facial details and license plate recognition for complete legal and insurance reliability.",
  },
];

export default function SecurityValueSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-bg relative overflow-x-clip border-b border-edge">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Left Column: Text & Bullets */}
          <div>
            <span className="inline-block rounded-full border border-edge bg-accent-soft px-4 py-1 text-xs font-medium text-accent">
              Absolute Protection
            </span>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl lg:text-4xl">
              How Professional CCTV Secures Your Premises
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              Security is not just about recording what happened—it is about prevention, real-time awareness, and total peace of mind. Our engineered surveillance systems integrate intelligent analytics with robust hardware to keep your property fortified around the clock.
            </p>

            <div className="mt-8 space-y-6">
              {benefits.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-[0_12px_0_12px] border border-edge bg-accent-soft text-accent">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-fg">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-fg-muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Custom Glassmorphic Graphic Card */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-[0_28px_0_28px] bg-gradient-to-r from-accent/20 to-transparent blur-xl opacity-50" />
            
            <div className="relative rounded-[0_28px_0_28px] border border-edge bg-bg/85 p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-edge pb-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full border border-edge bg-accent-soft text-accent">
                    <Eye className="size-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-accent">SYSTEM STATUS: ACTIVE</span>
                    <h4 className="font-display text-sm font-semibold text-fg">Live Perimeter Guard</h4>
                  </div>
                </div>
                <span className="flex size-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full size-3 bg-accent"></span>
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-[0_16px_0_16px] border border-edge bg-bg-alt/50 p-4">
                  <Zap className="size-4 text-accent mb-2" />
                  <span className="text-lg font-bold font-display text-fg">4K Ultra</span>
                  <p className="text-[11px] text-fg-muted">Resolution Feed</p>
                </div>
                <div className="rounded-[0_16px_0_16px] border border-edge bg-bg-alt/50 p-4">
                  <Lock className="size-4 text-accent mb-2" />
                  <span className="text-lg font-bold font-display text-fg">256-Bit</span>
                  <p className="text-[11px] text-fg-muted">Encrypted Storage</p>
                </div>
              </div>

              <div className="mt-6 rounded-[0_16px_0_16px] border border-edge bg-accent-soft/40 p-4 text-xs text-fg-muted leading-relaxed">
                <span className="font-semibold text-accent">Engineered for Reliability:</span> Automated backup protocols ensure zero data loss even during severe weather or unexpected power interruptions.
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}