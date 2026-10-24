/**
 * Trading Arena · an open market: candles stream in through four regimes (bullish, sideways,
 * breakout, an unexpected event) with SMA 20 and 50, one planned trade, and the account HUD.
 */
import { EXACT } from "../data/facts";
import { barsFromCloses, sma } from "../data/market";
import { seeded } from "@market-lab/ui/scenes/core";
import { finish, handle, loop, nextId, polyline, stage, svg, text, type RoomSceneBuilder } from "./common";

const REGIMES = [
  { label: "BULLISH", from: 0 },
  { label: "SIDEWAYS", from: 34 },
  { label: "BREAKOUT", from: 60 },
  { label: "UNEXPECTED EVENT", from: 84 },
];
const N = 112;
const VISIBLE = 52;
const ENTRY_AT = 64;
const EXIT_AT = 77;

function closes(): number[] {
  const r = seeded(31);
  const out = [100];
  for (let i = 1; i < N; i++) {
    const prev = out[i - 1];
    let d = (r() - 0.5) * 0.7;
    if (i < 34) d += 0.17;
    else if (i < 60) d += (106 - prev) * 0.12;
    else if (i < 84) d += i < 64 ? 0.02 : 0.32;
    else if (i === 84) d = -5.2;
    else d += 0.06 + (r() - 0.5) * 0.5;
    out.push(prev + d);
  }
  return out;
}

export const arenaScene: RoomSceneBuilder = (host) => {
  const root = stage(host, "Animation: the Trading Arena. Candles stream through a bullish, a sideways, a breakout and an unexpected-event market, with moving averages, one planned trade and the account equity.");
  const id = nextId("arena");
  const layer = svg("g", {}, root);
  const tl = loop();

  const c = closes();
  const bars = barsFromCloses(c, 99.8, 17, 0.35);
  const s20 = sma(c, 20);
  const s50 = sma(c, 50);
  const box = { x0: 28, x1: 532, y0: 76, y1: 300 };
  const step = (box.x1 - box.x0) / VISIBLE;
  const body = step * 0.56;
  const lo = Math.min(...bars.map((b) => b.l)) - 0.6;
  const hi = Math.max(...bars.map((b) => b.h)) + 0.6;
  const x = (i: number) => box.x0 + step * (i + 0.5);
  const y = (p: number) => box.y1 - ((p - lo) / (hi - lo)) * (box.y1 - box.y0);

  const defs = svg("defs", {}, root);
  const clip = svg("clipPath", { id: `${id}-view` }, defs);
  svg("rect", { x: box.x0, y: 60, width: box.x1 - box.x0, height: 250 }, clip);
  const reveal = svg("clipPath", { id: `${id}-reveal` }, defs);
  const revealRect = svg("rect", { x: box.x0, y: 40, width: 0, height: 280 }, reveal);

  text(layer, "LABX · 1H", { x: 28, y: 42, class: "rs-kicker" });
  const chips = REGIMES.map((g, i) => {
    const el = svg("g", { class: `rs-regime${i === 3 ? " is-event" : ""}` }, layer);
    const w = g.label.length * 8.2 + 26;
    svg("rect", { x: 532 - w, y: 25, width: w, height: 24, rx: 12 }, el);
    text(el, g.label, { x: 532 - w / 2, y: 41.5, "text-anchor": "middle" });
    return el;
  });
  for (let k = 0; k < 4; k++) svg("line", { x1: box.x0, x2: box.x1, y1: box.y0 + ((box.y1 - box.y0) * k) / 3, y2: box.y0 + ((box.y1 - box.y0) * k) / 3, class: "rs-grid" }, layer);

  const view = svg("g", { "clip-path": `url(#${id}-view)` }, layer);
  const track = svg("g", {}, view);
  const shown = svg("g", { "clip-path": `url(#${id}-reveal)` }, track);
  const line = (vals: (number | null)[], cls: string) =>
    svg("path", { d: polyline(vals.map((v, i) => (v === null ? null : ([x(i), y(v)] as [number, number]))).filter((p): p is [number, number] => !!p)), class: cls }, shown);
  line(s50, "rs-sma50");
  line(s20, "rs-sma20");
  bars.forEach((b, i) => {
    const g = svg("g", { class: b.c >= b.o ? "rs-up" : "rs-down" }, shown);
    svg("line", { x1: x(i), x2: x(i), y1: y(b.h), y2: y(b.l) }, g);
    svg("rect", { x: x(i) - body / 2, y: y(Math.max(b.o, b.c)), width: body, height: Math.max(1.2, Math.abs(y(b.o) - y(b.c))), rx: 1 }, g);
  });
  // One planned trade on the breakout: entry, stop under the base, out at 2R.
  const entry = c[ENTRY_AT];
  const stop = Math.min(...bars.slice(ENTRY_AT - 6, ENTRY_AT + 1).map((b) => b.l)) - 0.2;
  const units = (EXACT.equity * 0.01) / (entry - stop);
  const exitR = (c[EXIT_AT] - entry) / (entry - stop);
  const trade = svg("g", { class: "rs-trade" }, shown);
  svg("line", { x1: x(ENTRY_AT), x2: x(EXIT_AT), y1: y(stop), y2: y(stop), class: "rs-stop" }, trade);
  svg("line", { x1: x(ENTRY_AT), x2: x(EXIT_AT), y1: y(entry), y2: y(entry), class: "rs-entry" }, trade);
  svg("path", { d: `M${x(ENTRY_AT)} ${y(entry) + 9}l-6 9h12z`, class: "rs-mark-buy" }, trade);
  svg("circle", { cx: x(EXIT_AT), cy: y(c[EXIT_AT]), r: 5, class: "rs-mark-exit" }, trade);
  text(trade, `${exitR >= 0 ? "+" : "−"}${Math.abs(exitR).toFixed(1)}R`, { x: x(EXIT_AT), y: y(c[EXIT_AT]) - 12, "text-anchor": "middle", class: "rs-tag rs-tag--pos" });

  const last = svg("g", { class: "rs-last" }, layer);
  svg("line", { x1: box.x0, x2: box.x1, y1: 0, y2: 0 }, last);
  svg("rect", { x: box.x1 - 58, y: -11, width: 58, height: 22, rx: 6 }, last);
  const lastText = text(last, "", { x: box.x1 - 29, y: 4.5, "text-anchor": "middle" });

  // The account.
  const hud = svg("g", {}, layer);
  const cells = [
    { label: "EQUITY", x: 28 },
    { label: "OPEN RISK", x: 214 },
    { label: "ORDERS", x: 370 },
  ];
  const values = cells.map((cell) => {
    svg("rect", { x: cell.x, y: 326, width: cell.x === 28 ? 176 : cell.x === 214 ? 146 : 162, height: 74, rx: 12, class: "rs-card" }, hud);
    text(hud, cell.label, { x: cell.x + 16, y: 352, class: "rs-mini" });
    return text(hud, "", { x: cell.x + 16, y: 384, class: "rs-value" });
  });
  svg("path", { d: "M40 312h18", class: "rs-sma20" }, hud);
  text(hud, "SMA 20", { x: 64, y: 316, class: "rs-mini" });
  svg("path", { d: "M128 312h18", class: "rs-sma50" }, hud);
  text(hud, "SMA 50", { x: 152, y: 316, class: "rs-mini" });

  const start = { k: 18 };
  const fmtMoney = (v: number) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const paint = () => {
    const k = start.k;
    const shift = Math.max(0, k - VISIBLE) * step;
    track.setAttribute("transform", `translate(${-shift.toFixed(2)} 0)`);
    revealRect.setAttribute("width", (k * step).toFixed(2));
    const i = Math.min(N - 1, Math.max(0, Math.floor(k) - 1));
    last.setAttribute("transform", `translate(0 ${y(c[i]).toFixed(1)})`);
    lastText.textContent = c[i].toFixed(2);
    REGIMES.forEach((g, j) => {
      const on = i >= g.from && (j === 3 || i < REGIMES[j + 1].from);
      chips[j].style.opacity = on ? "1" : "0";
    });
    const open = i >= ENTRY_AT && i < EXIT_AT;
    const done = i >= EXIT_AT;
    values[0].textContent = fmtMoney(EXACT.equity + (c[done ? EXIT_AT : i] - entry) * units * (open || done ? 1 : 0));
    values[1].textContent = open ? "1.0%" : "0.0%";
    values[2].textContent = done ? "1 closed" : open ? "1 open" : "None";
  };
  paint();

  tl.fromTo(start, { k: 18 }, { k: N, duration: 9, ease: "none", onUpdate: paint }, 0).from(hud, { opacity: 0, y: 12, duration: 0.6, ease: "power3.out" }, 0);
  const hold = finish(tl, layer, 1.8);
  return handle(tl, hold, root);
};
