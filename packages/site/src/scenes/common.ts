/**
 * Scenes for the homepage rooms, built like the lesson scenes (packages/ui/src/scenes) and the way
 * HyperFrames composes video: one paused, seekable GSAP timeline over SVG whose layout is computed
 * up front. No React, so any host can mount them and drive the timeline. Each loops: it plays,
 * holds its last frame, fades and starts again. Colours come from CSS classes (rs-*).
 */
import gsap from "gsap";
import { svg, text } from "@market-lab/ui/scenes/core";
import type { Bar } from "../data/market";

export { svg, text };

export const W = 560;
export const H = 420;

export interface RoomScene {
  timeline: gsap.core.Timeline;
  /** The time of the frame to show when motion is reduced: everything in place, before the fade. */
  hold: number;
  destroy(): void;
}

export type RoomSceneBuilder = (host: HTMLElement) => RoomScene;

let uid = 0;
export const nextId = (name: string) => `rs-${name}-${++uid}`;

export function stage(host: HTMLElement, label: string): SVGSVGElement {
  const root = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "rs-svg", role: "img", "aria-label": label });
  host.appendChild(root);
  return root;
}

export function loop(): gsap.core.Timeline {
  return gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.25 });
}

/** Holds the finished frame for `hold` seconds, then fades the scene out so the loop restarts cleanly. */
export function finish(tl: gsap.core.Timeline, layer: Element, hold = 2.4): number {
  tl.set(layer, { opacity: 1 }, 0);
  const at = tl.duration() + hold;
  tl.to(layer, { opacity: 0, duration: 0.5, ease: "power1.in" }, at);
  return at - 0.01;
}

export function handle(tl: gsap.core.Timeline, hold: number, root: Element): RoomScene {
  return {
    timeline: tl,
    hold,
    destroy() {
      tl.kill();
      root.remove();
    },
  };
}

/** Counts a number into a text element as the timeline plays; seeking lands on the right value. */
export function counter(tl: gsap.core.Timeline, el: Element, from: number, to: number, at: number, duration: number, fmt: (v: number) => string) {
  const o = { v: from };
  el.textContent = fmt(from);
  tl.fromTo(o, { v: from }, { v: to, duration, ease: "power2.out", onUpdate: () => (el.textContent = fmt(o.v)) }, at);
}

export interface Scale {
  x: (i: number) => number;
  y: (p: number) => number;
  step: number;
  body: number;
}

export function scale(bars: Bar[], count: number, box: { x0: number; x1: number; y0: number; y1: number }, extra: number[] = []): Scale {
  const lo = Math.min(...bars.map((b) => b.l), ...extra);
  const hi = Math.max(...bars.map((b) => b.h), ...extra);
  const pad = (hi - lo) * 0.08;
  const step = (box.x1 - box.x0) / count;
  return {
    step,
    body: Math.max(2, step * 0.56),
    x: (i) => box.x0 + step * (i + 0.5),
    y: (p) => box.y1 - ((p - lo + pad) / (hi - lo + 2 * pad)) * (box.y1 - box.y0),
  };
}

export function candle(parent: Element, b: Bar, cx: number, s: Scale): SVGGElement {
  const g = svg("g", { class: b.c >= b.o ? "rs-up" : "rs-down" }, parent);
  svg("line", { x1: cx, x2: cx, y1: s.y(b.h), y2: s.y(b.l) }, g);
  const top = s.y(Math.max(b.o, b.c));
  svg("rect", { x: cx - s.body / 2, y: top, width: s.body, height: Math.max(1.2, Math.abs(s.y(b.o) - s.y(b.c))), rx: 1 }, g);
  return g;
}

export function polyline(points: [number, number][]): string {
  return points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

/** A rounded pill with text, centred on (cx, cy). */
export function pill(parent: Element, s: string, cx: number, cy: number, w: number, h: number, cls: string): SVGGElement {
  const g = svg("g", { class: cls }, parent);
  svg("rect", { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: h / 2 }, g);
  text(g, s, { x: cx, y: cy + 4.5, "text-anchor": "middle" });
  return g;
}
