import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis = null;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Starts Lenis smooth scrolling (skipped when the user prefers reduced motion). */
export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return () => {};
  lenis = new Lenis({ autoRaf: true, lerp: 0.12 });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

/** Jumps to the top instantly, keeping Lenis' internal position in sync. */
export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

/** Freezes page scrolling (e.g. while the lightbox is open). */
export function lockScroll(locked) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
