"use client";

import { Home, Building2, Store, Warehouse } from "lucide-react";

const sectors = [
  {
    icon: Home,
    title: "Residential Villas & Homes",
    description: "Protect your family and perimeter with automated smart cameras, motion alerts, and secure mobile access.",
  },
  {
    icon: Building2,
    title: "Corporate Offices & IT Parks",
    description: "Secure server rooms, executive workspaces, and visitor entry points with discreet, high-definition multi-angle feeds.",
  },
  {
    icon: Store,
    title: "Retail Stores & Plazas",
    description: "Prevent internal shrinkage, monitor cash registers, and keep track of customer foot traffic with crystal-clear coverage.",
  },
  {
    icon: Warehouse,
    title: "Industrial Plants & Warehouses",
    description: "Heavy-duty outdoor surveillance systems engineered to monitor expansive perimeters, loading docks, and inventory storage.",
  },
];

export default function SectorsGrid() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-bg relative overflow-x-clip border-b border-edge">
      <div className="container-x">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-edge bg-accent-soft px-4 py-1 text-xs font-medium text-accent">
            Tailored Applications
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl lg:text-4xl">
            Properties We Secure Across Pakistan
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            From residential front doors to large-scale industrial complexes, our security installations scale to match your exact spatial requirements.
          </p>
        </div>

        {/* Sectors Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((sector) => {
            const Icon = sector.icon;
            return (
              <div
                key={sector.title}
                className="group relative flex flex-col justify-between rounded-[0_24px_0_24px] border border-edge bg-bg/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_rgba(28,232,240,0.12)] sm:p-8"
              >
                <div>
                  <div className="mb-5 flex size-12 items-center justify-center rounded-[0_14px_0_14px] border border-edge bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-fg">
                    {sector.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                    {sector.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-edge/60 flex items-center justify-between text-[11px] font-medium text-accent">
                  <span>Custom Deployment</span>
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