/**
 * Duels · you against Rook on the same market: both results race in R, Rook finishes ahead on
 * money, and you still win, because 70% of a duel is process.
 */
import { seeded } from "@market-lab/ui/scenes/core";
import { BOTS, EXACT } from "../data/facts";
import { counter, finish, handle, loop, polyline, stage, svg, text, type RoomSceneBuilder } from "./common";

const ROOK = BOTS.find((b) => b.id === "rook")!;
const STEPS = 40;

function race(seed: number, end: number): number[] {
  const r = seeded(seed);
  const out = [0];
  for (let i = 1; i <= STEPS; i++) {
    const pull = (end * i) / STEPS - out[i - 1];
    out.push(out[i - 1] + pull * 0.35 + (r() - 0.5) * 0.32);
  }
  out[STEPS] = end;
  return out;
}

export const duelsScene: RoomSceneBuilder = (host) => {
  const root = stage(host, `Animation: a duel against ${ROOK.name}. ${ROOK.name} ends with a better result, but you win the duel on decision quality.`);
  const layer = svg("g", {}, root);
  const tl = loop();

  const player = (x: number, anchor: "start" | "end", name: string, rating: string, cls: string) => {
    const g = svg("g", { class: cls }, layer);
    const cx = anchor === "start" ? x + 20 : x - 20;
    svg("circle", { cx, cy: 46, r: 20, class: "rs-avatar" }, g);
    text(g, name[0], { x: cx, y: 52, "text-anchor": "middle", class: "rs-avatar-text" });
    const tx = anchor === "start" ? x + 52 : x - 52;
    text(g, name, { x: tx, y: 42, "text-anchor": anchor, class: "rs-name" });
    text(g, rating, { x: tx, y: 62, "text-anchor": anchor, class: "rs-mini" });
    return g;
  };
  const you = player(28, "start", "You", "RATING 1,034", "rs-you");
  const rook = player(532, "end", ROOK.name, `RATING ${ROOK.rating.toLocaleString("en-US")}`, "rs-rook");
  const clock = text(layer, "", { x: 280, y: 44, "text-anchor": "middle", class: "rs-clock" });
  const candleN = text(layer, "", { x: 280, y: 64, "text-anchor": "middle", class: "rs-mini" });

  const box = { x0: 28, x1: 532, y0: 92, y1: 262 };
  const mine = race(4, 1.6);
  const theirs = race(12, 2.1);
  const lo = Math.min(...mine, ...theirs, -0.4);
  const hi = Math.max(...mine, ...theirs) + 0.3;
  const x = (i: number) => box.x0 + ((box.x1 - box.x0 - 70) * i) / STEPS;
  const y = (v: number) => box.y1 - ((v - lo) / (hi - lo)) * (box.y1 - box.y0);
  svg("line", { x1: box.x0, x2: box.x1, y1: y(0), y2: y(0), class: "rs-zero" }, layer);
  text(layer, "0R", { x: box.x1, y: y(0) - 6, "text-anchor": "end", class: "rs-mini" });
  const pathOf = (v: number[]) => polyline(v.map((p, i) => [x(i), y(p)]));
  const lineRook = svg("path", { d: pathOf(theirs), class: "rs-race rs-race--rook", pathLength: 1 }, layer);
  const lineYou = svg("path", { d: pathOf(mine), class: "rs-race rs-race--you", pathLength: 1 }, layer);
  const tip = (v: number[], cls: string, label: string) => {
    const g = svg("g", { class: cls }, layer);
    svg("circle", { cx: x(STEPS), cy: y(v[STEPS]), r: 5 }, g);
    text(g, label, { x: x(STEPS) + 12, y: y(v[STEPS]) + 5 });
    return g;
  };
  const tipRook = tip(theirs, "rs-tip rs-tip--rook", "+2.1R");
  const tipYou = tip(mine, "rs-tip rs-tip--you", "+1.6R");

  // The scoreboard: your bars grow left from the middle, Rook's grow right.
  const board = svg("g", {}, layer);
  const rows = [
    { label: "PROCESS", you: 82, them: 74, fmt: (v: number) => Math.round(v).toString(), max: 100 },
    { label: "RESULT", you: 1.6, them: 2.1, fmt: (v: number) => `+${v.toFixed(1)}R`, max: 3 },
  ];
  const growth: { el: SVGRectElement; w: number; left: boolean }[] = [];
  rows.forEach((r, i) => {
    const yy = 300 + i * 40;
    text(board, r.label, { x: 280, y: yy - 12, "text-anchor": "middle", class: "rs-mini" });
    const wy = (r.you / r.max) * 196;
    const wt = (r.them / r.max) * 196;
    svg("rect", { x: 84, y: yy - 4, width: 196, height: 10, rx: 5, class: "rs-bar-track" }, board);
    svg("rect", { x: 280, y: yy - 4, width: 196, height: 10, rx: 5, class: "rs-bar-track" }, board);
    const a = svg("rect", { x: 280 - wy, y: yy - 4, width: wy, height: 10, rx: 5, class: "rs-bar rs-bar--you" }, board);
    const b = svg("rect", { x: 280, y: yy - 4, width: wt, height: 10, rx: 5, class: "rs-bar rs-bar--rook" }, board);
    growth.push({ el: a, w: wy, left: true }, { el: b, w: wt, left: false });
    const ty = text(board, "", { x: 74, y: yy + 5, "text-anchor": "end", class: "rs-value-sm" });
    const tt = text(board, "", { x: 486, y: yy + 5, class: "rs-value-sm" });
    counter(tl, ty, 0, r.you, 4.4 + i * 0.25, 1, r.fmt);
    counter(tl, tt, 0, r.them, 4.4 + i * 0.25, 1, r.fmt);
  });
  const verdict = svg("g", { class: "rs-verdict" }, layer);
  svg("rect", { x: 150, y: 372, width: 260, height: 34, rx: 17 }, verdict);
  text(verdict, "YOU WIN ON PROCESS · ELO +18", { x: 280, y: 394, "text-anchor": "middle" });

  const t = { v: 0 };
  const total = EXACT.duelCandles * EXACT.candleSeconds;
  const paint = () => {
    const left = Math.round(total * (1 - t.v));
    clock.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    candleN.textContent = `CANDLE ${Math.max(1, Math.round(t.v * EXACT.duelCandles))} / ${EXACT.duelCandles}`;
  };
  paint();

  tl.from([you, rook], { opacity: 0, y: -10, duration: 0.6, stagger: 0.1, ease: "power3.out" }, 0)
    .fromTo(t, { v: 0 }, { v: 1, duration: 3.6, ease: "none", onUpdate: paint }, 0.5)
    .fromTo([lineYou, lineRook], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 3.6, ease: "none" }, 0.5)
    .from([tipYou, tipRook], { opacity: 0, scale: 0.4, transformOrigin: "0% 50%", duration: 0.4, stagger: 0.1, ease: "back.out(2)" }, 4.0)
    .from(board, { opacity: 0, y: 12, duration: 0.5, ease: "power3.out" }, 4.2);
  for (const g of growth) tl.fromTo(g.el, { attr: { width: 0, x: 280 } }, { attr: { width: g.w, x: g.left ? 280 - g.w : 280 }, duration: 1, ease: "power3.out" }, 4.4);
  tl.from(verdict, { opacity: 0, scale: 0.7, transformOrigin: "50% 50%", duration: 0.55, ease: "back.out(2.2)" }, 5.6);
  const hold = finish(tl, layer, 2.6);
  return handle(tl, hold, root);
};
