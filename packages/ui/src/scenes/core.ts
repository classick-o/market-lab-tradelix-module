/**
 * Animated scenes for lessons, built the way HyperFrames builds video: one paused, seekable GSAP
 * timeline over SVG whose layout is computed once, up front. Scenes are plain TypeScript with no
 * React, so a host (React, Angular, a HyperFrames composition) only mounts them and drives the
 * timeline. Colours come from the --ml-* tokens through CSS classes (styles/screens/scene.css).
 */
// gsap.core.Timeline comes from the global `gsap` namespace that GSAP's types declare.

export interface SceneOptions {
  /** Phone-width layout: a taller stage with smaller type. */
  narrow: boolean;
}

export interface SceneHandle {
  timeline: gsap.core.Timeline;
  /** Start time of each chapter, in seconds; the content gives one caption per chapter. */
  chapters: number[];
  /** Times the scene stops for a question, in order; the content gives the questions. */
  stops: number[];
  destroy(): void;
}

export type SceneBuilder = (host: HTMLElement, opts: SceneOptions) => SceneHandle;

const NS = "http://www.w3.org/2000/svg";
type Attrs = Record<string, string | number>;

/** Creates an SVG element with attributes, appended to `parent` when given. */
export function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Attrs = {}, parent?: Element): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  parent?.appendChild(el);
  return el;
}

/** A text element, optionally with a smaller lead-in ("BUY") before the main text. */
export function text(parent: Element, s: string, attrs: Attrs = {}, lead?: string): SVGTextElement {
  const t = svg("text", attrs, parent);
  if (lead) {
    svg("tspan", { class: "sc-lead" }, t).textContent = `${lead} `;
    svg("tspan", {}, t).textContent = s;
  } else t.textContent = s;
  return t;
}

/** Prepares a path to be drawn by tweening its stroke-dashoffset from its length to 0. */
export function drawable(path: SVGGeometryElement): number {
  const len = Math.ceil(path.getTotalLength());
  path.style.strokeDasharray = `${len}`;
  path.style.strokeDashoffset = `${len}`;
  return len;
}

/** A small deterministic random source, so a scene looks the same every time. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A point at `share` (0–1) of a polyline's length, with no DOM measurement at tween time. */
export function pointAlong(points: [number, number][], cumulative: number[], share: number): [number, number, number] {
  const target = share * cumulative[cumulative.length - 1];
  let i = 1;
  while (i < cumulative.length - 1 && cumulative[i] < target) i++;
  const seg = cumulative[i] - cumulative[i - 1] || 1;
  const f = Math.min(1, Math.max(0, (target - cumulative[i - 1]) / seg));
  const [x0, y0] = points[i - 1];
  const [x1, y1] = points[i];
  return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, i - 1 + f];
}

export function cumulativeLengths(points: [number, number][]): number[] {
  const out = [0];
  for (let i = 1; i < points.length; i++) out.push(out[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  return out;
}

export const fmt = (p: number) => p.toFixed(2);
