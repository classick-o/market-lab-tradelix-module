/**
 * Trade Journal · replay, then "what if": the session replays to the decision, and the same trade
 * branches into the alternatives the journal prices for you.
 */
import { barsFromCloses, walk } from "../data/market";
import { candle, counter, finish, handle, loop, scale, stage, svg, text, type RoomSceneBuilder } from "./common";

const BRANCHES = [
  { label: "What you did", r: 1.2, cls: "is-actual" },
  { label: "Half the size", r: 0.6, cls: "" },
  { label: "Double the size", r: 2.4, cls: "is-warn", note: "2% risk" },
  { label: "Tighter stop", r: -1.0, cls: "is-neg" },
  { label: "No trade", r: 0, cls: "is-flat" },
];
const N = 34;
const D = 19;

export const journalScene: RoomSceneBuilder = (host) => {
  const root = stage(host, "Animation: the Trade Journal. A session replays to the decision, then the trade branches into alternatives: half size, double size, a tighter stop and no trade, each with its result.");
  const layer = svg("g", {}, root);
  const tl = loop();

  text(layer, "SESSION #14 · REPLAY", { x: 28, y: 42, class: "rs-kicker" });
  const box = { x0: 28, x1: 532, y0: 62, y1: 196 };
  const bars = barsFromCloses(walk(N, 44, 100, 0.07, 0.8), 99.9, 8, 0.3);
  const s = scale(bars, N, box);
  const chart = svg("g", {}, layer);
  const candles = bars.map((b, i) => candle(chart, b, s.x(i), s));

  // The scrubber under the replay.
  svg("rect", { x: 28, y: 212, width: 504, height: 4, rx: 2, class: "rs-seg" }, layer);
  const fill = svg("rect", { x: 28, y: 212, width: 504, height: 4, rx: 2, class: "rs-seg-fill" }, layer);
  const head = svg("line", { x1: 0, x2: 0, y1: 56, y2: 220, class: "rs-playhead" }, layer);
  const d1x = s.x(D);
  const d1 = svg("g", { class: "rs-d1" }, layer);
  svg("circle", { cx: d1x, cy: s.y(bars[D].c), r: 6 }, d1);
  svg("rect", { x: d1x - 17, y: s.y(bars[D].h) - 30, width: 34, height: 20, rx: 6 }, d1);
  text(d1, "D1", { x: d1x, y: s.y(bars[D].h) - 15.5, "text-anchor": "middle" });

  // The branches.
  const ox = 46;
  const oy = 320;
  const tree = svg("g", {}, layer);
  const origin = svg("circle", { cx: ox, cy: oy, r: 7, class: "rs-origin" }, tree);
  const rowY = (i: number) => 252 + i * 34;
  const paths: SVGPathElement[] = [];
  const labels: SVGGElement[] = [];
  BRANCHES.forEach((b, i) => {
    const y = rowY(i);
    paths.push(svg("path", { d: `M${ox} ${oy} C ${ox + 110} ${oy}, ${ox + 120} ${y}, 250 ${y}`, class: `rs-branch ${b.cls}`, pathLength: 1 }, tree));
    const g = svg("g", { class: `rs-alt ${b.cls}` }, tree);
    svg("circle", { cx: 250, cy: y, r: 4 }, g);
    text(g, b.label, { x: 266, y: y + 5 });
    if (b.note) {
      svg("rect", { x: 394, y: y - 11, width: 64, height: 22, rx: 11, class: "rs-note-chip" }, g);
      text(g, b.note, { x: 426, y: y + 4.5, "text-anchor": "middle", class: "rs-note-chip-text" });
    }
    const v = text(g, "", { x: 532, y: y + 5, "text-anchor": "end", class: "rs-value-sm" });
    counter(tl, v, 0, b.r, 3.2 + i * 0.18, 0.8, (n) => `${n > 0.04 ? "+" : n < -0.04 ? "−" : ""}${Math.abs(n).toFixed(1)}R`);
    labels.push(g);
  });

  const t = { p: 0 };
  const paint = () => {
    const x = 28 + 504 * t.p;
    head.setAttribute("transform", `translate(${x.toFixed(1)} 0)`);
    fill.setAttribute("width", (504 * t.p).toFixed(1));
    const shown = Math.floor(t.p * N);
    candles.forEach((c, i) => (c.style.opacity = i <= shown ? "1" : "0.12"));
  };
  paint();

  tl.fromTo(t, { p: 0 }, { p: (D + 0.5) / N, duration: 1.8, ease: "power1.inOut", onUpdate: paint }, 0.2)
    .from(d1, { opacity: 0, scale: 0.5, transformOrigin: "50% 100%", duration: 0.45, ease: "back.out(2.4)" }, 2.0)
    .from(origin, { opacity: 0, scale: 0, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(2)" }, 2.3)
    .fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.75, stagger: 0.18, ease: "power2.inOut" }, 2.5)
    .from(labels, { opacity: 0, x: -10, duration: 0.45, stagger: 0.18, ease: "power3.out" }, 3.0)
    .to(t, { p: 1, duration: 1.4, ease: "power1.inOut", onUpdate: paint }, 3.4)
    .to(labels[0], { scale: 1.04, transformOrigin: "0% 50%", duration: 0.3, yoyo: true, repeat: 1 }, 4.6);
  const hold = finish(tl, layer, 2.6);
  return handle(tl, hold, root);
};
