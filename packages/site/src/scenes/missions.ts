/**
 * Missions · the Reveal and the debrief: the chart stops at the decision, the plan is drawn, the
 * hatched veil retracts as the future arrives, then the debrief scores the process line by line.
 */
import { SCENE_TEXT } from "../data/facts";
import { barsFromCloses, walk } from "../data/market";
import { candle, counter, finish, handle, loop, nextId, scale, stage, svg, text, type RoomSceneBuilder } from "./common";

const HIST = 30;
const FUT = 12;
const RUBRIC: [string, boolean][] = [
  ["Thesis written before entry", true],
  ["Stop beyond the swing low", true],
  ["Risk 1% of equity", true],
  ["Waited for the candle close", false],
];

export const missionsScene: RoomSceneBuilder = (host) => {
  const root = stage(host, "Animation: a mission. The chart stops at the decision, a stop and a target are set, the future is revealed and hits the target, then the debrief scores the decision 88 out of 100.");
  const id = nextId("mission");
  const layer = svg("g", {}, root);
  const tl = loop();

  const hist = walk(HIST, 21, 96, 0.13, 0.75);
  const entry = hist[HIST - 1];
  const risk = 0.9;
  const fut = [-0.2, -0.38, -0.12, 0.28, 0.52, 0.4, 0.85, 1.15, 1.02, 1.45, 1.86, 1.7].map((d) => entry + d);
  const bars = [...barsFromCloses(hist, 95.8, 5, 0.3), ...barsFromCloses(fut, entry, 9, 0.18)];
  const box = { x0: 28, x1: 532, y0: 66, y1: 214 };
  const s = scale(bars, HIST + FUT, box, [entry - risk, entry + risk * 2]);
  const nowX = box.x0 + s.step * HIST;
  const stop = entry - risk;
  const target = entry + 2 * risk;
  const hitAt = bars.slice(HIST).findIndex((b) => b.h >= target);

  const defs = svg("defs", {}, root);
  const pat = svg("pattern", { id: `${id}-hatch`, width: 8, height: 8, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
  svg("line", { x1: 0, y1: 0, x2: 0, y2: 8, class: "rs-hatch" }, pat);
  const clip = svg("clipPath", { id: `${id}-clip` }, defs);
  svg("rect", { x: nowX, y: 40, width: box.x1 - nowX + 2, height: 190 }, clip);

  text(layer, `MISSION ${SCENE_TEXT.mission.id} · ${SCENE_TEXT.mission.title.toUpperCase()}`, { x: 28, y: 42, class: "rs-kicker" });
  for (const p of [0.25, 0.5, 0.75]) svg("line", { x1: box.x0, x2: box.x1, y1: box.y0 + (box.y1 - box.y0) * p, y2: box.y0 + (box.y1 - box.y0) * p, class: "rs-grid" }, layer);

  const past = svg("g", {}, layer);
  bars.slice(0, HIST).forEach((b, i) => candle(past, b, s.x(i), s));
  const future = svg("g", {}, layer);
  const futureBars = bars.slice(HIST).map((b, i) => candle(future, b, s.x(HIST + i), s));

  const plan = svg("g", {}, layer);
  const lines = [
    svg("line", { x1: nowX, x2: box.x1, y1: s.y(entry), y2: s.y(entry), class: "rs-entry" }, plan),
    svg("line", { x1: nowX, x2: box.x1, y1: s.y(stop), y2: s.y(stop), class: "rs-stop" }, plan),
    svg("line", { x1: nowX, x2: box.x1, y1: s.y(target), y2: s.y(target), class: "rs-target" }, plan),
  ];
  const tags = [text(plan, "STOP", { x: box.x1 - 2, y: s.y(stop) + 15, "text-anchor": "end", class: "rs-tag rs-tag--neg" }), text(plan, "TARGET 2R", { x: box.x1 - 2, y: s.y(target) - 7, "text-anchor": "end", class: "rs-tag rs-tag--pos" })];

  const veilMove = svg("g", {}, svg("g", { "clip-path": `url(#${id}-clip)` }, layer));
  svg("rect", { x: nowX, y: 44, width: box.x1 - nowX + 2, height: 182, class: "rs-veil" }, veilMove);
  svg("rect", { x: nowX, y: 44, width: box.x1 - nowX + 2, height: 182, fill: `url(#${id}-hatch)` }, veilMove);
  const now = svg("g", { class: "rs-now" }, layer);
  svg("line", { x1: nowX, x2: nowX, y1: 48, y2: box.y1 + 4 }, now);
  svg("circle", { cx: nowX, cy: s.y(entry), r: 4 }, now);

  const hitX = s.x(HIST + Math.max(0, hitAt));
  const hit = svg("g", { class: "rs-hit" }, layer);
  svg("circle", { cx: hitX, cy: s.y(target), r: 5 }, hit);
  svg("rect", { x: hitX - 30, y: s.y(target) - 36, width: 60, height: 22, rx: 11 }, hit);
  text(hit, "+2.0R", { x: hitX, y: s.y(target) - 20.5, "text-anchor": "middle" });

  // The debrief.
  const deb = svg("g", {}, layer);
  svg("line", { x1: 28, x2: 532, y1: 238, y2: 238, class: "rs-grid" }, deb);
  svg("circle", { cx: 96, cy: 322, r: 50, class: "rs-ring-track" }, deb);
  const ring = svg("circle", { cx: 96, cy: 322, r: 50, class: "rs-ring", pathLength: 100, transform: "rotate(-90 96 322)" }, deb);
  const score = text(deb, "0", { x: 96, y: 331, "text-anchor": "middle", class: "rs-big" });
  text(deb, "DECISION QUALITY", { x: 96, y: 396, "text-anchor": "middle", class: "rs-mini" });
  const rows = RUBRIC.map(([label, ok], i) => {
    const g = svg("g", { class: ok ? "rs-rule is-ok" : "rs-rule is-miss" }, deb);
    const y = 268 + i * 36;
    svg("circle", { cx: 192, cy: y, r: 11 }, g);
    svg("path", { d: ok ? `M186.5 ${y}l3.8 3.8 7-7.6` : `M188 ${y - 4}l8 8M196 ${y - 4}l-8 8` }, g);
    text(g, label, { x: 214, y: y + 5 });
    return g;
  });

  tl.from(Array.from(past.children), { opacity: 0, scaleY: 0, transformOrigin: "50% 50%", duration: 0.35, stagger: 0.022, ease: "power3.out" }, 0)
    .from(now, { opacity: 0, duration: 0.4 }, 0.6)
    .from(veilMove, { scaleX: 0, transformOrigin: "100% 50%", duration: 0.7, ease: "expo.out" }, 0.7)
    .set(futureBars, { opacity: 0 }, 0)
    .fromTo(lines, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }, 1.4)
    .from(tags, { opacity: 0, duration: 0.3 }, 1.7)
    .to(veilMove, { x: box.x1 - nowX + 4, duration: FUT * 0.11, ease: "none" }, 2.1)
    .to(futureBars, { opacity: 1, duration: 0.2, stagger: 0.11 }, 2.1)
    .from(hit, { opacity: 0, scale: 0.5, svgOrigin: `${hitX} ${s.y(target)}`, duration: 0.45, ease: "back.out(2.5)" }, 2.1 + (hitAt + 1) * 0.11)
    .from(deb, { opacity: 0, y: 14, duration: 0.6, ease: "power3.out" }, 3.6)
    .fromTo(ring, { strokeDashoffset: 100 }, { strokeDashoffset: 12, duration: 1.3, ease: "power2.out" }, 3.9)
    .from(rows, { opacity: 0, x: 14, duration: 0.45, stagger: 0.16, ease: "power3.out" }, 3.9);
  counter(tl, score, 0, 88, 3.9, 1.3, (v) => Math.round(v).toString());
  const hold = finish(tl, layer, 2.6);
  return handle(tl, hold, root);
};
