"use client";

import { useSyncExternalStore } from "react";

let probeCtx: CanvasRenderingContext2D | null = null;

function backgroundIsDark(): boolean | null {
  if (!probeCtx) {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    probeCtx = c.getContext("2d", { willReadFrequently: true });
  }
  const ctx = probeCtx;
  if (!ctx) return null;

  for (const el of [document.body, document.documentElement]) {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = getComputedStyle(el).backgroundColor;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    if (d[3] > 200) {
      return 0.2126 * d[0] + 0.7152 * d[1] + 0.0722 * d[2] < 128;
    }
  }
  return null;
}

function detectDark(): boolean {
  const el = document.documentElement;
  const marks = [
    ...Array.from(el.classList),
    el.getAttribute("data-theme"),
    el.getAttribute("data-mode"),
    el.getAttribute("data-color-scheme"),
  ];
  if (marks.includes("dark")) return true;
  if (marks.includes("light")) return false;

  const bg = backgroundIsDark();
  if (bg !== null) return bg;

  const cs = getComputedStyle(el).colorScheme;
  if (cs === "dark") return true;
  if (cs === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function subscribe(cb: () => void) {
  const opts: MutationObserverInit = {
    attributes: true,
    attributeFilter: [
      "class",
      "data-theme",
      "data-mode",
      "data-color-scheme",
      "style",
    ],
  };
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, opts);
  mo.observe(document.body, opts);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
  };
}

export function useSiteIsDark(): boolean {
  return useSyncExternalStore(subscribe, detectDark, () => true);
}