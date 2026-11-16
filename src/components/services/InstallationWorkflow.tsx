"use client";

import { ClipboardCheck, Sliders, Wrench, Smartphone } from "lucide-react";

const workflowSteps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Free Site Assessment",
    description: "Our certified engineers visit your property to inspect layout structures, identify security blind spots, and determine optimal camera placement.",
  },
  {
    number: "02",
    icon: Sliders,
    title: "Custom System Design",
    description: "We tailor a comprehensive security architecture choosing the exact lenses, NVR storage capacity, and cabling pathways suited for your budget.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "Professional Installation",
    description: "Clean conduit wiring, secure mounting, and robust network configuration executed by our expert technical deployment team.",
  },
  {
    number: "04",
    icon: Smartphone,
    title: "Testing & Handover",
    description: "Rigorous system stress testing, live mobile app configuration on your smartphone, and a complete walkthrough before project sign-off.",
  },
];

export default function InstallationWorkflow() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-bg-alt/40 relative overflow-x-clip border-b border-edge">
      <div className="container-x">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-edge bg-accent-soft px-4 py-1 text-xs font-medium text-accent">
            Streamlined Execution
          </span>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl lg:text-4xl">
            How We Deliver Your Installation
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">
            A transparent, hassle-free 4-step workflow designed to take your property from vulnerable to fully secured with zero operational disruption.
          </p>
        </div>

        {/* Workflow Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between rounded-[0_24px_0_24px] border border-edge bg-bg/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-accent hover:shadow-[0_0_24px_rgba(28,232,240,0.12)] sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-[0_12px_0_12px] border border-edge bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-accent/30 group-hover:text-accent/60 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-base font-semibold text-fg">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-fg-muted">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-edge/60 flex items-center gap-1.5 text-[11px] font-medium text-accent">
                  <span>Step {step.number} of 04</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}