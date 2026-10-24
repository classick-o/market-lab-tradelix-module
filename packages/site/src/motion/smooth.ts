/**
 * Smooth scrolling (Lenis), loaded as its own chunk after the first paint. Only for mouse and
 * trackpad: touch keeps native momentum, and reduced motion keeps native scrolling entirely.
 */
import Lenis from "lenis";

let lenis: Lenis | null = null;

export function startSmoothScroll(): () => void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduced || !fine || lenis) return () => {};
  const l = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, autoRaf: true, anchors: { offset: -72 } });
  lenis = l;
  document.documentElement.classList.add("tx-smooth");
  return () => {
    l.destroy();
    if (lenis === l) lenis = null;
    document.documentElement.classList.remove("tx-smooth");
  };
}

export function smoothScrollTo(target: HTMLElement | number, offset = -72): boolean {
  if (!lenis) return false;
  lenis.scrollTo(target, { offset, duration: 1.4 });
  return true;
}
