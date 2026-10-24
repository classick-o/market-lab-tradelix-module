/**
 * Learn · a lesson in miniature: the five phases fill, buyers and sellers line up on a price
 * ladder, the price where they meet lights up, then a check question is answered for XP.
 */
import { SCENE_TEXT } from "../data/facts";
import { finish, handle, loop, stage, svg, text, type RoomSceneBuilder } from "./common";

const PHASES = ["Hook", "Learn", "Try", "Check", "Recap"];
const PRICES = [100.2, 100.1, 100.0, 99.9, 99.8];
const BUYERS = [
  { p: 100.2, q: 2 },
  { p: 100.0, q: 3 },
  { p: 99.9, q: 1 },
];
const SELLERS = [
  { p: 99.8, q: 1 },
  { p: 100.0, q: 2 },
  { p: 100.1, q: 3 },
];

export const learnScene: RoomSceneBuilder = (host) => {
  const root = stage(host, "Animation: a lesson. Buyers and sellers line up on a price ladder, the price where they meet lights up, then a check question is answered for XP.");
  const layer = svg("g", {}, root);
  const tl = loop();
  const { id, title, minutes } = SCENE_TEXT.lesson;

  const head = svg("g", {}, layer);
  text(head, `LESSON ${id} · ${minutes} MIN`, { x: 28, y: 42, class: "rs-kicker" });
  text(head, title, { x: 28, y: 70, class: "rs-title" });

  const segW = (504 - 4 * 6) / 5;
  const fills: SVGRectElement[] = [];
  PHASES.forEach((p, i) => {
    const x = 28 + i * (segW + 6);
    svg("rect", { x, y: 88, width: segW, height: 4, rx: 2, class: "rs-seg" }, layer);
    fills.push(svg("rect", { x, y: 88, width: segW, height: 4, rx: 2, class: "rs-seg-fill" }, layer));
    text(layer, p, { x, y: 110, class: "rs-mini" });
  });

  // The ladder: prices down the middle, buyers on the left, sellers on the right.
  const rowY = (p: number) => 152 + Math.round((100.2 - p) / 0.1) * 36;
  const band = svg("rect", { x: 40, y: rowY(100) - 17, width: 480, height: 34, rx: 10, class: "rs-band" }, layer);
  svg("line", { x1: 280, x2: 280, y1: 134, y2: 314, class: "rs-axis" }, layer);
  for (const p of PRICES) {
    const g = svg("g", { class: p === 100 ? "rs-price is-key" : "rs-price" }, layer);
    svg("rect", { x: 252, y: rowY(p) - 11, width: 56, height: 22, rx: 6 }, g);
    text(g, p.toFixed(2), { x: 280, y: rowY(p) + 4.5, "text-anchor": "middle" });
  }
  const chip = (side: "buy" | "sell", p: number, q: number) => {
    const x = side === "buy" ? 102 : 322;
    const g = svg("g", { class: `rs-chip rs-chip--${side}` }, layer);
    svg("rect", { x, y: rowY(p) - 13, width: 136, height: 26, rx: 8 }, g);
    text(g, `${side === "buy" ? "BUY" : "SELL"} ${q} @ ${p.toFixed(2)}`, { x: x + 68, y: rowY(p) + 4.5, "text-anchor": "middle" });
    return g;
  };
  const buyers = BUYERS.map((b) => chip("buy", b.p, b.q));
  const sellers = SELLERS.map((s) => chip("sell", s.p, s.q));
  const clear = text(layer, "3 units change hands at 100.00", { x: 280, y: 334, "text-anchor": "middle", class: "rs-note" });

  // The check.
  const quiz = svg("g", {}, layer);
  svg("rect", { x: 28, y: 352, width: 504, height: 52, rx: 12, class: "rs-card" }, quiz);
  text(quiz, "Buyers get more eager. Price…", { x: 46, y: 383, class: "rs-body" });
  const optA = svg("g", { class: "rs-opt" }, quiz);
  svg("rect", { x: 322, y: 364, width: 88, height: 28, rx: 8 }, optA);
  text(optA, "falls", { x: 366, y: 383, "text-anchor": "middle" });
  const optB = svg("g", { class: "rs-opt" }, quiz);
  svg("rect", { x: 418, y: 364, width: 98, height: 28, rx: 8 }, optB);
  const picked = svg("rect", { x: 418, y: 364, width: 98, height: 28, rx: 8, class: "rs-opt-on" }, optB);
  text(optB, "rises", { x: 458, y: 383, "text-anchor": "middle", class: "rs-opt-label" });
  const tick = svg("path", { d: "M490 378l5 5 9-10", class: "rs-tick" }, optB);
  const xp = svg("g", { class: "rs-xp" }, layer);
  svg("rect", { x: 452, y: 318, width: 80, height: 26, rx: 13 }, xp);
  text(xp, "+15 XP", { x: 492, y: 335.5, "text-anchor": "middle" });

  tl.from(head, { opacity: 0, y: 10, duration: 0.6, ease: "power3.out" }, 0)
    .set(fills, { scaleX: 0, transformOrigin: "0% 50%" }, 0)
    .to(fills[0], { scaleX: 1, duration: 0.6, ease: "power2.out" }, 0.3)
    .from(buyers, { x: -150, opacity: 0, duration: 0.7, stagger: 0.16, ease: "expo.out" }, 0.9)
    .from(sellers, { x: 150, opacity: 0, duration: 0.7, stagger: 0.16, ease: "expo.out" }, 1.0)
    .to(fills[1], { scaleX: 1, duration: 1.6, ease: "none" }, 0.9)
    .from(band, { scaleX: 0, transformOrigin: "50% 50%", opacity: 0, duration: 0.7, ease: "expo.out" }, 2.2)
    .from(clear, { opacity: 0, y: 6, duration: 0.5 }, 2.5)
    .to(fills[2], { scaleX: 1, duration: 0.8, ease: "power2.out" }, 2.6)
    .from(quiz, { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" }, 3.0)
    .to(fills[3], { scaleX: 1, duration: 0.8, ease: "power2.out" }, 3.4)
    .from(picked, { opacity: 0, duration: 0.25 }, 4.0)
    .fromTo(tick, { strokeDashoffset: 20 }, { strokeDashoffset: 0, duration: 0.35 }, 4.05)
    .from(xp, { opacity: 0, y: 12, scale: 0.6, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2.5)" }, 4.3)
    .to(fills[4], { scaleX: 1, duration: 0.6, ease: "power2.out" }, 4.5);
  const hold = finish(tl, layer, 2.6);
  return handle(tl, hold, root);
};
