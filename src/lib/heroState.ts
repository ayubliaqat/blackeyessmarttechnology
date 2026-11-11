import type Lenis from "lenis";

// Shared mutable state between the HTML overlay (GSAP) and the 3D scene (R3F).
export const heroState = {
  progress: 0, // scroll progress 0..1
  scan: 0, // fingerprint scan 0..1
  intro: 0, // camera intro dolly 0..1
  mx: 0, // mouse x -1..1
  my: 0, // mouse y -1..1
  locked: true, // scroll locked until identity verified
  lenis: null as Lenis | null,
};