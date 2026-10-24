/**
 * Small motion primitives with no animation library: one shared scroll loop, in-view detection,
 * reveal-on-scroll and count-up. GSAP only loads with the scenes, Lenis only with smooth scroll.
 */
import { useEffect, useRef, useState, type RefObject } from "react";

export const prefersReducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function useMedia(query: string): boolean {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");

// ── One scroll loop for every scroll-driven effect ────────────────────────────────────────────
// Listeners read layout once per frame, after scrolling (or Lenis) moved the page.

type Frame = () => void;
const frames = new Set<Frame>();
let queued = false;

function tick() {
  queued = false;
  frames.forEach((f) => f());
}
function schedule() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(tick);
  }
}

export function onScrollFrame(f: Frame): () => void {
  if (frames.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }
  frames.add(f);
  schedule();
  return () => {
    frames.delete(f);
    if (frames.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  };
}

/**
 * Calls `cb` with how far an element has travelled through the viewport: 0 when its top meets
 * `start` (a share of the viewport height from the top), 1 when its bottom meets `end`.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, cb: (p: number) => void, opts: { start?: number; end?: number; enabled?: boolean } = {}) {
  const { start = 1, end = 0, enabled = true } = opts;
  const cbRef = useRef(cb);
  cbRef.current = cb;
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let last = -1;
    return onScrollFrame(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = r.top - vh * start;
      const span = r.height + vh * (start - end);
      const p = Math.min(1, Math.max(0, -from / (span || 1)));
      if (Math.abs(p - last) > 0.0005) {
        last = p;
        cbRef.current(p);
      }
    });
  }, [ref, start, end, enabled]);
}

/** True while the element is within `margin` of the viewport. */
export function useInView(ref: RefObject<Element | null>, { margin = "0px", once = false } = {}): boolean {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setSeen(e.isIntersecting);
        if (e.isIntersecting && once) io.disconnect();
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, once]);
  return seen;
}

/** Adds `is-in` to every [data-reveal] inside the root the first time it scrolls into view. */
export function useReveal(root: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-reveal]");
    if (prefersReducedMotion()) {
      items.forEach((i) => i.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, [root]);
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/** Counts from 0 to `to` once `run` turns true. */
export function useCountUp(to: number, run: boolean, ms = 1400): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (prefersReducedMotion()) {
      setV(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      setV(to * easeOut(t));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, run, ms]);
  return v;
}

/**
 * Pointer tilt for cards: sets --rx, --ry (degrees) and --mx, --my (0–1) on the element, so CSS
 * can rotate the card and push its 3D object forward. Fine pointers only.
 */
export function useTilt<T extends HTMLElement>(max = 7) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let px = 0.5;
    let py = 0.5;
    const paint = () => {
      raf = 0;
      el.style.setProperty("--rx", `${((0.5 - py) * max).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * max).toFixed(2)}deg`);
      el.style.setProperty("--mx", px.toFixed(3));
      el.style.setProperty("--my", py.toFixed(3));
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const leave = () => {
      px = 0.5;
      py = 0.5;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [max]);
  return ref;
}

/** Spotlight for a group of cards: sets --sx, --sy in px on each [data-spot] child under the pointer. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      el.querySelectorAll<HTMLElement>("[data-spot]").forEach((c) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--sx", `${(x - r.left).toFixed(0)}px`);
        c.style.setProperty("--sy", `${(y - r.top).toFixed(0)}px`);
      });
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    el.addEventListener("pointermove", move);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
    };
  }, []);
  return ref;
}
