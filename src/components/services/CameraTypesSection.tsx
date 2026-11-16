"use client";

import { Camera, Shield, Cpu, Wifi } from "lucide-react";

const cameraOptions = [
  {
    icon: Camera,
    tag: "Outdoor Perimeter",
    title: "Bullet Surveillance Cameras",
    description: "Long-range, weather-resistant cameras ideal for exterior walls, gates, and large perimeter monitoring.",
  },
  {
    icon: Shield,
    tag: "Indoor & Corridors",
    title: "Dome Security Cameras",
    description: "Discreet, tamper-proof ceiling mounted lenses offering wide-angle panoramic coverage for offices and retail stores.",
  },
  {
    icon: Cpu,
    tag: "Active Tracking",
    title: "PTZ (Pan-Tilt-Zoom) Cameras",
    description: "High-performance motorized cameras capable of 360-degree rotation and optical zoom for large industrial spaces.",
  },
  {
    icon: Wifi,
    tag: "Wireless & Smart",
    title: "IP & Smart Network Cameras",
    description: "High-definition digital cameras supporting PoE, cloud connectivity, and instant smartphone motion alerts.",
  },
];

export default function CameraTypesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-bg-alt/40 relative overflow-x-clip border-b border-edge">
      <div className="container-x">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-edge bg-accent-soft px-4 py-1 text-xs font-medium text-accent">
            Hardware Selection
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl lg:text-4xl">
            Camera Options Tailored For Your Property
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            We match your exact spatial requirements with the ideal camera architecture, ensuring pristine optical clarity and optimal optical coverage.
          </p>
        </div>

        {/* Grid of Camera Types */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cameraOptions.map((cam) => {
            const Icon = cam.icon;
            return (
              <div
                key={cam.title}
                className="group relative flex flex-col justify-between rounded-[0_24px_0_24px] border border-edge bg-bg/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_rgba(28,232,240,0.12)] sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex size-11 items-center justify-center rounded-[0_12px_0_12px] border border-edge bg-accent-soft text-accent">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider rounded-full border border-edge bg-bg px-2.5 py-1 text-accent">
                      {cam.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-semibold text-fg">
                    {cam.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                    {cam.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-edge/60 flex items-center justify-between text-[11px] font-medium text-accent">
                  <span>Professional Grade</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}