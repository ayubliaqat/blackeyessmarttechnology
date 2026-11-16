"use client";

import { Eye, ShieldCheck, Cpu, HardDrive, BellRing, Lock } from "lucide-react";

const serviceFeatures = [
  {
    icon: Eye,
    title: "4K Ultra-HD Clarity",
    description: "Capture crystal-clear facial details and license plates with wide-angle lenses and zero blind spots across your premises.",
  },
  {
    icon: ShieldCheck,
    title: "24/7 Night Vision & Thermal",
    description: "Advanced infrared and low-light sensors engineered to maintain absolute perimeter visibility in total darkness.",
  },
  {
    icon: Cpu,
    title: "Smart AI Motion Detection",
    description: "Intelligent human and vehicle tracking algorithms that eliminate false alarms caused by weather, pets, or foliage.",
  },
  {
    icon: BellRing,
    title: "Instant Mobile Push Alerts",
    description: "Receive real-time notifications directly on your smartphone or tablet the moment suspicious activity is detected.",
  },
  {
    icon: HardDrive,
    title: "Secure Local & Cloud Storage",
    description: "Enterprise-grade NVR/DVR setups with encrypted hard drives and reliable backup redundancy for continuous recording.",
  },
  {
    icon: Lock,
    title: "Vandal-Resistant Hardware",
    description: "Weather-proof, rugged metallic casings designed to withstand extreme outdoor temperatures and industrial conditions.",
  },
];

export default function ServiceFeatures() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-bg relative overflow-x-clip border-b border-edge">
      <div className="container-x">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-edge bg-accent-soft px-4 py-1 text-xs font-medium text-accent">
            Core Technical Capabilities
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl lg:text-4xl">
            Engineered for Uncompromising Security
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            We deploy commercial-grade hardware paired with seamless software integrations to guarantee absolute protection for your property.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative rounded-[0_24px_0_24px] border border-edge bg-bg/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_rgba(28,232,240,0.12)] sm:p-8"
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-[0_14px_0_14px] border border-edge bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-base font-semibold text-fg">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}