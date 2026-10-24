/**
 * Achievements · progress that comes only from learning: the skill radar grows, XP fills toward the
 * next level, the streak heatmap fills in, and an achievement that has nothing to do with profit lands.
 */
import { seeded } from "@market-lab/ui/scenes/core";
import { SCENE_TEXT } from "../data/facts";
import { counter, finish, handle, loop, stage, svg, text, type RoomSceneBuilder } from "./common";

const AXES = ["MB", "OM", "RM", "PS", "MS", "SA", "DD", "RR"];
const FROM = [0.22, 0.16, 0.24, 0.12, 0.2, 0.14, 0.12, 0.2];
const TO = [0.82, 0.64, 0.92, 0.74, 0.68, 0.56, 0.78, 0.62];
const WEEKS = 12;

export const progressScene: RoomSceneBuilder = (host) => {
  const root = stage(host, `Animation: the skill profile grows across eight skills, XP fills toward level ${SCENE_TEXT.rank.level}, the streak heatmap fills in and the achievement "${SCENE_TEXT.achievement}" unlocks.`);
  const layer = svg("g", {}, root);
  const tl = loop();

  // Radar.
  const cx = 148;
  const cy = 206;
  const R = 102;
  const pt = (i: number, r: number): [number, number] => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / AXES.length;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  };
  const ring = (r: number) => AXES.map((_, i) => pt(i, r).map((v) => v.toFixed(1)).join(",")).join(" ");
  for (const f of [1 / 3, 2 / 3, 1]) svg("polygon", { points: ring(R * f), class: "rs-radar-grid" }, layer);
  AXES.forEach((a, i) => {
    const [x, y] = pt(i, R);
    svg("line", { x1: cx, y1: cy, x2: x, y2: y, class: "rs-radar-axis" }, layer);
    const [lx, ly] = pt(i, R + 18);
    text(layer, a, { x: lx, y: ly + 4, "text-anchor": "middle", class: "rs-mini" });
  });
  const shape = svg("polygon", { points: "", class: "rs-radar-shape" }, layer);
  const t = { v: 0 };
  const paint = () => shape.setAttribute("points", AXES.map((_, i) => pt(i, R * (FROM[i] + (TO[i] - FROM[i]) * t.v)).map((v) => v.toFixed(1)).join(",")).join(" "));
  paint();

  // Level and XP.
  const side = svg("g", {}, layer);
  text(side, SCENE_TEXT.rank.title.toUpperCase(), { x: 300, y: 56, class: "rs-kicker" });
  const lvl = text(side, "", { x: 300, y: 92, class: "rs-level" });
  svg("rect", { x: 300, y: 106, width: 232, height: 6, rx: 3, class: "rs-seg" }, side);
  const xpFill = svg("rect", { x: 300, y: 106, width: 232, height: 6, rx: 3, class: "rs-seg-fill" }, side);
  const xpText = text(side, "", { x: 532, y: 92, "text-anchor": "end", class: "rs-mini" });

  // Streak heatmap: twelve weeks, denser toward today.
  const rand = seeded(5);
  const cells: SVGRectElement[] = [];
  for (let w = 0; w < WEEKS; w++)
    for (let d = 0; d < 7; d++) {
      const recent = w >= WEEKS - 2 && !(w === WEEKS - 1 && d > 4);
      const v = recent ? 3 : rand() < 0.25 + w * 0.05 ? 1 + Math.floor(rand() * 3) : 0;
      cells.push(svg("rect", { x: 300 + w * 19.6, y: 136 + d * 19, width: 15, height: 15, rx: 3.5, class: `rs-heat rs-heat--${v}` }, side));
    }
  const streak = text(side, "", { x: 300, y: 292, class: "rs-value-sm" });
  text(side, "DAY STREAK", { x: 340, y: 292, class: "rs-mini" });

  // The achievement.
  const toast = svg("g", { class: "rs-toast" }, layer);
  svg("rect", { x: 254, y: 322, width: 278, height: 72, rx: 14 }, toast);
  svg("circle", { cx: 288, cy: 358, r: 17, class: "rs-toast-icon" }, toast);
  svg("path", { d: "M281 358.5l5 5 9.5-10", class: "rs-toast-check" }, toast);
  text(toast, "ACHIEVEMENT UNLOCKED", { x: 316, y: 350, class: "rs-mini" });
  text(toast, SCENE_TEXT.achievement, { x: 316, y: 372, class: "rs-name" });

  tl.fromTo(t, { v: 0 }, { v: 1, duration: 2.2, ease: "power3.inOut", onUpdate: paint }, 0.3)
    .from(side, { opacity: 0, x: 12, duration: 0.6, ease: "power3.out" }, 0.1)
    .fromTo(xpFill, { attr: { width: 0 } }, { attr: { width: 232 * 0.72 }, duration: 1.6, ease: "power2.out" }, 0.6)
    .from(cells, { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.3, stagger: { each: 0.012, from: "start" }, ease: "back.out(2)" }, 0.8)
    .from(toast, { opacity: 0, y: 24, duration: 0.6, ease: "expo.out" }, 3.0);
  counter(tl, lvl, SCENE_TEXT.rank.level - 1, SCENE_TEXT.rank.level, 0.6, 1.6, (v) => `Level ${Math.round(v)}`);
  counter(tl, xpText, 0, 360, 0.6, 1.6, (v) => `${Math.round(v)} / 500 XP`);
  counter(tl, streak, 0, 12, 1.4, 1.6, (v) => `${Math.round(v)}`);
  const hold = finish(tl, layer, 2.6);
  return handle(tl, hold, root);
};
