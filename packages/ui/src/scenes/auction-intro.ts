/**
 * 0.1.1 · Where a price comes from. Five chapters:
 * 1. a LABX chart draws itself and the camera pushes into its last point (every point is a trade);
 * 2. buyers and sellers arrive; 3. they line up on a price ladder;
 * 4. each order's range of prices: one pair whose ranges overlap, then a stop: can this other pair trade?;
 * 5. one price for everyone, the question the next screen answers (not given away here).
 * The book is the lesson's BOOK_A: buyers 100.30, 100.20, 100.00, 99.95, 99.80; sellers 99.70, 99.85, 100.00, 100.05, 100.25.
 */
import gsap from "gsap";
import { cumulativeLengths, drawable, fmt, pointAlong, seeded, svg, text, type SceneBuilder } from "./core";

/** In the order they arrive, so the queues start unsorted. */
const BUYERS = [100.0, 99.8, 100.3, 99.95, 100.2];
const SELLERS = [100.05, 99.7, 100.25, 99.85, 100.0];
const TOP = 100.3;
const STEP = 0.05;
const ROWS = 12;

interface Layout {
  w: number;
  h: number;
  /** gx: where grid lines and their labels start; the line itself starts at x0, clear of the labels. */
  chart: { gx: number; x0: number; x1: number; y0: number; y1: number };
  axisX: number;
  /** y of the 100.30 row; each 0.05 lower is one rowStep further down. */
  rowTop: number;
  rowStep: number;
  chipW: number;
  chipH: number;
  /** Space between the axis and the chips, where the price labels sit. */
  gap: number;
  /** Width of the price labels on the axis; the range bands sit between them and the orders. */
  labelW: number;
  font: number;
  small: number;
  queue: { buyX: number; sellX: number; y0: number; step: number };
  headY: number;
}

const WIDE: Layout = {
  w: 720,
  h: 420,
  chart: { gx: 36, x0: 92, x1: 600, y0: 64, y1: 372 },
  axisX: 360,
  rowTop: 74,
  rowStep: 25,
  chipW: 128,
  chipH: 22,
  gap: 34,
  labelW: 46,
  font: 12.5,
  small: 11,
  queue: { buyX: 36, sellX: 556, y0: 98, step: 46 },
  headY: 40,
};

const NARROW: Layout = {
  w: 360,
  h: 500,
  chart: { gx: 14, x0: 58, x1: 316, y0: 88, y1: 420 },
  axisX: 180,
  rowTop: 98,
  rowStep: 28,
  chipW: 112,
  chipH: 24,
  gap: 30,
  labelW: 40,
  font: 11.5,
  small: 10.5,
  queue: { buyX: 12, sellX: 236, y0: 112, step: 44 },
  headY: 62,
};

let uid = 0;

export const auctionIntro: SceneBuilder = (host, { narrow }) => {
  const L = narrow ? NARROW : WIDE;
  const id = `sc-auction-${++uid}`;
  const rowY = (p: number) => L.rowTop + Math.round((TOP - p) / STEP) * L.rowStep;

  const root = svg("svg", { viewBox: `0 0 ${L.w} ${L.h}`, class: "sc-svg", role: "img", "aria-label": "Animation: a price chart, then buyers and sellers lining up by price to trade." });
  host.appendChild(root);
  const defs = svg("defs", {}, root);
  const glowGrad = svg("radialGradient", { id: `${id}-glow`, cx: "50%", cy: "45%", r: "60%" }, defs);
  svg("stop", { offset: "0", class: "sc-glow-in" }, glowGrad);
  svg("stop", { offset: "1", class: "sc-glow-out" }, glowGrad);
  const areaGrad = svg("linearGradient", { id: `${id}-area`, x1: "0", y1: "0", x2: "0", y2: "1" }, defs);
  svg("stop", { offset: "0", class: "sc-area-top" }, areaGrad);
  svg("stop", { offset: "1", class: "sc-area-bottom" }, areaGrad);

  const glow = svg("rect", { x: 0, y: 0, width: L.w, height: L.h, fill: `url(#${id}-glow)`, opacity: 0 }, root);

  // ── 1 · The chart ─────────────────────────────────────────────────────
  const { gx, x0, x1, y0, y1 } = L.chart;
  const rand = seeded(11);
  const N = 44;
  const walk = [99.32];
  for (let i = 1; i < N; i++) walk.push(walk[i - 1] + (rand() - 0.46) * 0.1);
  const drift = 100 - walk[N - 1];
  const prices = walk.map((p, i) => p + (drift * i) / (N - 1));
  const lo = Math.min(...prices) - 0.06;
  const hi = Math.max(...prices) + 0.1;
  const py = (p: number) => y1 - ((p - lo) / (hi - lo)) * (y1 - y0);
  const points = prices.map((p, i): [number, number] => [x0 + (i * (x1 - x0)) / (N - 1), py(p)]);
  const cum = cumulativeLengths(points);
  const [tipX, tipY] = points[N - 1];

  const camera = svg("g", { class: "sc-camera" }, root);
  const grid = svg("g", { class: "sc-grid" }, camera);
  const gridLines: SVGGElement[] = [];
  for (let p = Math.ceil(lo * 4) / 4; p < hi; p += 0.25) {
    const g = svg("g", {}, grid);
    svg("line", { x1: gx, x2: x1 + 30, y1: py(p), y2: py(p), class: "sc-gridline" }, g);
    text(g, fmt(p), { x: gx, y: py(p) - 6, class: "sc-gridlabel", "font-size": L.small });
    gridLines.push(g);
  }
  const lineD = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = svg("path", { d: `${lineD} L${tipX} ${y1 + 16} L${x0} ${y1 + 16} Z`, fill: `url(#${id}-area)`, opacity: 0 }, camera);
  const line = svg("path", { d: lineD, class: "sc-line" }, camera);
  const lineLen = drawable(line);

  const tag = svg("g", { class: "sc-tag", opacity: 0 }, camera);
  const tagW = narrow ? 80 : 86;
  svg("rect", { x: -tagW / 2, y: -11, width: tagW, height: 22, rx: 6 }, tag);
  const tagText = text(tag, fmt(prices[0]), { y: L.small * 0.36, "text-anchor": "middle", "font-size": L.small });
  const placeTag = (x: number, y: number) => tag.setAttribute("transform", `translate(${Math.min(L.w - tagW / 2 - 6, Math.max(tagW / 2 + 6, x)).toFixed(1)} ${(y - 26).toFixed(1)})`);
  placeTag(points[0][0], points[0][1]);

  const ring = svg("circle", { cx: tipX, cy: tipY, r: 5, class: "sc-ring", opacity: 0 }, camera);
  const dot = svg("circle", { cx: tipX, cy: tipY, r: 5, class: "sc-dot" }, camera);
  const glyph = (letter: string, side: "buy" | "sell", dy: number) => {
    const g = svg("g", { class: `sc-glyph sc-glyph--${side}`, opacity: 0 }, camera);
    svg("circle", { cx: 0, cy: 0, r: 10 }, g);
    text(g, letter, { y: 3.5, "text-anchor": "middle", "font-size": 10 });
    gsap.set(g, { x: tipX, y: tipY + dy });
    return g;
  };
  const gBuy = glyph("B", "buy", 52);
  const gSell = glyph("S", "sell", -52);

  const wipe = svg("circle", { cx: tipX, cy: tipY, r: Math.hypot(L.w, L.h), class: "sc-wipe", opacity: 0 }, root);

  // ── 2–3 · The ladder and the orders ─────────────────────────────────────
  const ladder = svg("g", { class: "sc-ladder" }, root);
  const axisLine = svg("line", { x1: L.axisX, x2: L.axisX, y1: L.rowTop - 16, y2: rowY(TOP - ROWS * STEP) + 16, class: "sc-axis" }, ladder);
  drawable(axisLine);
  const labels = svg("g", { class: "sc-plabels" }, ladder);
  const labelEls: SVGGElement[] = [];
  for (let k = ROWS; k >= 0; k--) {
    const p = TOP - k * STEP;
    const g = svg("g", { opacity: 0 }, labels);
    svg("rect", { x: L.axisX - L.labelW / 2, y: rowY(p) - 9, width: L.labelW, height: 18, rx: 4, class: "sc-plabel-bg" }, g);
    text(g, fmt(p), { x: L.axisX, y: rowY(p) + L.small * 0.36, "text-anchor": "middle", class: "sc-plabel", "font-size": L.small });
    labelEls.push(g);
  }

  const connectors = svg("g", {}, root);
  const chipsLayer = svg("g", {}, root);

  interface Chip {
    g: SVGGElement;
    halo: SVGRectElement;
    p: number;
    queue: [number, number];
    final: [number, number];
  }
  const chip = (side: "buy" | "sell", p: number, i: number): Chip => {
    const g = svg("g", { class: `sc-chip sc-chip--${side}`, opacity: 0 }, chipsLayer);
    const halo = svg("rect", { x: -4, y: -4, width: L.chipW + 8, height: L.chipH + 8, rx: 9, class: "sc-halo", opacity: 0 }, g);
    svg("rect", { width: L.chipW, height: L.chipH, rx: 6 }, g);
    text(g, side === "buy" ? `≤ ${fmt(p)}` : `≥ ${fmt(p)}`, { x: L.chipW / 2, y: L.chipH / 2 + L.font * 0.36, "text-anchor": "middle", "font-size": L.font }, side === "buy" ? "BUY" : "SELL");
    const qx = side === "buy" ? L.queue.buyX : L.queue.sellX;
    const queue: [number, number] = [qx, L.queue.y0 + i * L.queue.step];
    const final: [number, number] = [side === "buy" ? L.axisX - L.gap - L.chipW : L.axisX + L.gap, rowY(p) - L.chipH / 2];
    gsap.set(g, { x: side === "buy" ? -L.chipW - 30 : L.w + 30, y: queue[1] });
    return { g, halo, p, queue, final };
  };
  const buyers = BUYERS.map((p, i) => chip("buy", p, i));
  const sellers = SELLERS.map((p, i) => chip("sell", p, i));
  const all = [...buyers, ...sellers];
  const find = (list: Chip[], p: number) => list.find((c) => c.p === p)!;

  const header = (side: "buy" | "sell", title: string, sub: string) => {
    const g = svg("g", { class: `sc-head sc-head--${side}`, opacity: 0 }, root);
    text(g, title, { y: 0, "text-anchor": "middle", class: "sc-head-title", "font-size": L.small });
    text(g, sub, { y: 15, "text-anchor": "middle", class: "sc-head-sub", "font-size": L.small });
    const half = sub.length * L.small * 0.27;
    const under = svg("line", { x1: -half, x2: half, y1: 20, y2: 20, class: "sc-underline" }, g);
    drawable(under);
    const qx = side === "buy" ? L.queue.buyX : L.queue.sellX;
    gsap.set(g, { x: qx + L.chipW / 2, y: L.queue.y0 - 34 });
    return { g, under, to: [side === "buy" ? L.axisX - L.gap - L.chipW / 2 : L.axisX + L.gap + L.chipW / 2, L.headY] as const };
  };
  const hBuy = header("buy", "BUYERS", "pay at most");
  const hSell = header("sell", "SELLERS", "accept at least");

  // ── 4 · When can two of them trade? ────────────────────────────────────
  // Each order accepts a range: a buyer anything up to their price, a seller anything from theirs.
  // Bands between the price labels and the orders show the ranges; where they overlap, a trade can happen.
  const bandOff = L.labelW / 2 + 1.5;
  const bandW = L.gap - bandOff - 2.5;
  const BOTTOM = TOP - ROWS * STEP;
  const band = (side: "buy" | "sell", p: number) => {
    const top = side === "buy" ? rowY(p) : rowY(TOP);
    const end = side === "buy" ? rowY(BOTTOM) : rowY(p);
    const r = svg("rect", { x: side === "buy" ? L.axisX - bandOff - bandW : L.axisX + bandOff, y: top - 5, width: bandW, height: end - top + 10, rx: bandW / 2, class: `sc-band sc-band--${side}`, opacity: 0 }, connectors);
    // A range grows from the order's own price: down for a buyer, up for a seller.
    gsap.set(r, { transformOrigin: side === "buy" ? "50% 0%" : "50% 100%" });
    return r;
  };
  const zone = (y0z: number, y1z: number, tone: "ok" | "no") => {
    const half = bandOff + bandW + 4;
    return svg("rect", { x: L.axisX - half, y: y0z, width: half * 2, height: y1z - y0z, rx: 8, class: `sc-zone sc-zone--${tone}`, opacity: 0 }, connectors);
  };
  const bandBuyA = band("buy", 100.3);
  const bandSellA = band("sell", 99.7);
  const zoneA = zone(rowY(100.3) - 12, rowY(99.7) + 12, "ok");
  const bandBuyB = band("buy", 99.8);
  const bandSellB = band("sell", 100.25);
  // The gap: the prices strictly between the seller's lowest and the buyer's highest.
  const zoneB = zone(rowY(100.25) + 9, rowY(99.8) - 9, "no");

  const badge = (label: string, tone: "ok" | "no", cy: number) => {
    const g = svg("g", { class: `sc-badge sc-badge--${tone}`, opacity: 0 }, root);
    const w = Math.round(label.length * L.small * 0.58 + 40);
    svg("rect", { x: -w / 2, y: -13, width: w, height: 26, rx: 13 }, g);
    const icon = svg("g", { transform: `translate(${-w / 2 + 16} 0)`, class: "sc-badge-icon" }, g);
    if (tone === "ok") svg("path", { d: "M-4 0 L-1 3 L4 -3" }, icon);
    else svg("path", { d: "M-3.5 -3.5 L3.5 3.5 M-3.5 3.5 L3.5 -3.5" }, icon);
    text(g, label, { x: 8, y: L.small * 0.36, "text-anchor": "middle", "font-size": L.small });
    gsap.set(g, { x: L.axisX, y: cy });
    return g;
  };
  const midA = (rowY(100.3) + rowY(99.7)) / 2;
  const midB = (rowY(99.8) + rowY(100.25)) / 2;
  const badgeA = badge("Any price from 99.70 to 100.30 suits both", "ok", midA);
  const cross = svg("g", { class: "sc-cross", opacity: 0 }, root);
  svg("circle", { r: 11 }, cross);
  svg("path", { d: "M-4.5 -4.5 L4.5 4.5 M-4.5 4.5 L4.5 -4.5" }, cross);
  gsap.set(cross, { x: L.axisX, y: midB });
  const badgeB = badge("99.80 < 100.25 · no price suits both", "no", midB + 30);

  // ── 5 · One price for everyone ─────────────────────────────────────────
  const pline = svg("g", { class: "sc-pline", opacity: 0 });
  // Behind the orders, so it never runs over their prices.
  root.insertBefore(pline, chipsLayer);
  const reach = L.gap + L.chipW + 12;
  const plineBar = svg("line", { x1: L.axisX - reach, x2: L.axisX + reach, y1: rowY(99.7), y2: rowY(99.7) }, pline);
  const qTag = svg("g", { class: "sc-qtag" }, pline);
  svg("rect", { x: L.axisX - 24, y: rowY(99.7) - 11, width: 48, height: 22, rx: 6 }, qTag);
  text(qTag, "?", { x: L.axisX, y: rowY(99.7) + 4.5, "text-anchor": "middle", "font-size": 13 });

  // ── The timeline ───────────────────────────────────────────────────────
  const CH = [0, 5.0, 9.2, 12.8, 21.2];
  const STOP = 17.4;
  const tl = gsap.timeline({ paused: true, defaults: { duration: 0.6, ease: "power3.out" } });

  // 1 · Every point is a trade
  tl.to(glow, { opacity: 1, duration: 1.4, ease: "sine.inOut" }, 0);
  tl.from(gridLines, { opacity: 0, x: -14, stagger: 0.08, duration: 0.7 }, 0.1);
  tl.to(tag, { opacity: 1, duration: 0.3 }, 0.35);
  const draw = { t: 0 };
  tl.to(
    draw,
    {
      t: 1,
      duration: 2.4,
      ease: "power2.inOut",
      onUpdate: () => {
        line.style.strokeDashoffset = `${lineLen * (1 - draw.t)}`;
        const [x, y, f] = pointAlong(points, cum, draw.t);
        placeTag(x, y);
        const i = Math.min(N - 2, Math.floor(f));
        tagText.textContent = draw.t >= 1 ? "LAST 100.00" : fmt(prices[i] + (prices[i + 1] - prices[i]) * (f - i));
        tag.classList.toggle("is-last", draw.t >= 1);
      },
    },
    0.35,
  );
  tl.to(area, { opacity: 1, duration: 1.2, ease: "sine.inOut" }, 1.4);
  tl.from(dot, { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "power4.out" }, 2.75);
  // Later tweens on an element already tweened must not render their start values at build time.
  tl.fromTo(ring, { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 4.5, transformOrigin: "50% 50%", duration: 1.1, ease: "power2.out", immediateRender: false }, 2.8);
  tl.to([gBuy, gSell], { opacity: 1, duration: 0.3 }, 3.0);
  tl.to([gBuy, gSell], { y: tipY, scale: 0.4, duration: 0.6, ease: "power3.in" }, 3.15);
  tl.to([gBuy, gSell], { opacity: 0, duration: 0.15 }, 3.7);
  tl.fromTo(dot, { scale: 1 }, { scale: 2.2, transformOrigin: "50% 50%", duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1, immediateRender: false }, 3.7);
  tl.to(camera, { scale: 3.2, svgOrigin: `${tipX} ${tipY}`, duration: 1.15, ease: "expo.in" }, 3.95);
  tl.to(camera, { opacity: 0, duration: 0.4, ease: "power1.in" }, 4.7);
  tl.fromTo(wipe, { opacity: 0.22, scale: 0 }, { scale: 1, svgOrigin: `${tipX} ${tipY}`, duration: 0.7, ease: "expo.in", immediateRender: false }, 4.4);
  tl.to(wipe, { opacity: 0, duration: 0.6, ease: "sine.out" }, 5.1);

  // 2 · Two sides
  tl.to([hBuy.g, hSell.g], { opacity: 1, duration: 0.5, stagger: 0.12 }, CH[1] + 0.1);
  tl.from([hBuy.g, hSell.g], { y: `+=10`, duration: 0.6, stagger: 0.12 }, CH[1] + 0.1);
  buyers.forEach((c, i) => tl.to(c.g, { opacity: 1, x: c.queue[0], duration: 0.8 }, CH[1] + 0.35 + i * 0.12));
  sellers.forEach((c, i) => tl.to(c.g, { opacity: 1, x: c.queue[0], duration: 0.8 }, CH[1] + 0.5 + i * 0.12));
  tl.to(hBuy.under, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, CH[1] + 2.4);
  tl.to(hSell.under, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, CH[1] + 2.8);

  // 3 · Two queues
  tl.to(axisLine, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, CH[2] + 0.1);
  tl.to(labelEls, { opacity: 1, duration: 0.4, stagger: 0.035 }, CH[2] + 0.3);
  tl.to([hBuy.under, hSell.under], { opacity: 0, duration: 0.3 }, CH[2] + 0.5);
  tl.to(hBuy.g, { x: hBuy.to[0], y: hBuy.to[1], duration: 1.0, ease: "power3.inOut" }, CH[2] + 0.6);
  tl.to(hSell.g, { x: hSell.to[0], y: hSell.to[1], duration: 1.0, ease: "power3.inOut" }, CH[2] + 0.6);
  // x and y on different curves give each order an arc on its way to its row.
  [...all]
    .sort((a, b) => b.p - a.p)
    .forEach((c, k) => {
      tl.to(c.g, { x: c.final[0], duration: 1.0, ease: "power2.inOut" }, CH[2] + 0.7 + k * 0.06);
      tl.to(c.g, { y: c.final[1], duration: 1.0, ease: "power3.inOut" }, CH[2] + 0.7 + k * 0.06);
    });
  const keen = find(buyers, 100.3);
  const cheap = find(sellers, 99.7);
  tl.to([keen.halo, cheap.halo], { opacity: 1, duration: 0.5, stagger: 0.25 }, CH[2] + 2.5);

  // 4 · When can they trade? Ranges grow from each order's price; the overlap is where they can trade.
  const grow = (el: SVGRectElement, at: number) => tl.fromTo(el, { opacity: 1, scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: "power3.inOut" }, at);
  const others = (keep: Chip[]) => all.filter((c) => !keep.includes(c)).map((c) => c.g);
  tl.to(others([keen, cheap]), { opacity: 0.22, duration: 0.5 }, CH[3]);
  tl.to(labels, { opacity: 0.5, duration: 0.5 }, CH[3]);
  grow(bandBuyA, CH[3] + 0.4);
  grow(bandSellA, CH[3] + 0.75);
  tl.fromTo(zoneA, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "sine.inOut" }, CH[3] + 1.6);
  tl.fromTo(badgeA, { opacity: 0, scale: 0.88 }, { opacity: 1, scale: 1, transformOrigin: "50% 50%", duration: 0.5 }, CH[3] + 1.9);
  tl.to([bandBuyA, bandSellA, zoneA, badgeA], { opacity: 0, duration: 0.4 }, CH[3] + 3.6);
  const low = find(buyers, 99.8);
  const high = find(sellers, 100.25);
  tl.to([keen.halo, cheap.halo], { opacity: 0, duration: 0.3 }, CH[3] + 3.6);
  tl.to([keen.g, cheap.g], { opacity: 0.22, duration: 0.4 }, CH[3] + 3.7);
  tl.to([low.g, high.g], { opacity: 1, duration: 0.4 }, CH[3] + 3.7);
  tl.to([low.halo, high.halo], { opacity: 1, duration: 0.4 }, CH[3] + 3.8);
  // The scene stops at STOP for the question; the ranges show the answer after it.
  grow(bandBuyB, STOP + 0.1);
  grow(bandSellB, STOP + 0.3);
  tl.fromTo(zoneB, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "sine.inOut" }, STOP + 1.0);
  tl.fromTo(cross, { opacity: 0, scale: 0.5, rotation: -45 }, { opacity: 1, scale: 1, rotation: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "power4.out" }, STOP + 1.2);
  tl.fromTo(badgeB, { opacity: 0, y: midB + 40 }, { opacity: 1, y: midB + 30, duration: 0.5 }, STOP + 1.4);

  // 5 · One price for everyone
  tl.to([cross, badgeB, zoneB, bandBuyB, bandSellB], { opacity: 0, duration: 0.4 }, CH[4]);
  tl.to([low.halo, high.halo], { opacity: 0, duration: 0.3 }, CH[4]);
  tl.to(all.map((c) => c.g), { opacity: 1, duration: 0.5 }, CH[4] + 0.2);
  tl.to(labels, { opacity: 1, duration: 0.5 }, CH[4] + 0.2);
  tl.to(pline, { opacity: 1, duration: 0.3 }, CH[4] + 0.6);
  tl.from(plineBar, { scaleX: 0, transformOrigin: "50% 50%", duration: 0.7, ease: "power3.inOut" }, CH[4] + 0.6);
  tl.from(qTag, { scale: 0.6, opacity: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "power4.out" }, CH[4] + 1.0);
  // The line hunts for the price without settling on it: that is the next screen's question.
  tl.to(pline, { y: -3 * L.rowStep, duration: 0.95, ease: "sine.inOut", yoyo: true, repeat: 3 }, CH[4] + 1.5);
  tl.to({}, { duration: 0.6 }, ">");

  return {
    timeline: tl,
    chapters: CH,
    stops: [STOP],
    destroy() {
      tl.kill();
      root.remove();
    },
  };
};
