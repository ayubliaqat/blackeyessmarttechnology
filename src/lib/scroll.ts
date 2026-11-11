import { heroState } from "@/lib/heroState";

export function scrollToHeroProgress(p: number) {
  const el = document.getElementById("hero");
  if (!el || heroState.locked) return;
  const range = el.offsetHeight - window.innerHeight;
  const y = el.offsetTop + range * p;
  if (heroState.lenis) heroState.lenis.scrollTo(y, { duration: 2.2 });
  else window.scrollTo({ top: y, behavior: "smooth" });
}