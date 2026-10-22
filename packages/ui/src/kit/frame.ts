/**
 * Learn Chart Kit geometry: price and candle-index scales shared by every layer, plus helpers
 * that turn content data (CandleData, ChartLayer) into numbers the SVG can draw.
 */
import type { CandleData, ChartLayer, ChartSpec } from "@market-lab/academy";

export const PAD = { top: 14, right: 70, bottom: 14, left: 8 };

export interface Frame {
  width: number;
  height: number;
  /** Number of candle slots on the time axis (always the full series, so candles never shift). */
  slots: number;
  slot: number;
  min: number;
  max: number;
  plotLeft: number;
  plotRight: number;
  plotTop: number;
  plotBottom: number;
  /** Centre x of candle slot i. */
  x: (i: number) => number;
  y: (price: number) => number;
  /** Price at a y coordinate. */
  price: (y: number) => number;
  /** Candle slot at an x coordinate (clamped). */
  index: (x: number) => number;
  ticks: number[];
}

export function niceStep(range: number, ticks: number): number {
  const raw = range / Math.max(1, ticks);
  const mag = 10 ** Math.floor(Math.log10(raw || 1));
  const norm = raw / mag;
  return (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
}

export function makeFrame(width: number, height: number, slots: number, min: number, max: number, log = false): Frame {
  const plotLeft = PAD.left;
  const plotRight = Math.max(plotLeft + 40, width - PAD.right);
  const plotTop = PAD.top;
  const plotBottom = Math.max(plotTop + 40, height - PAD.bottom);
  const n = Math.max(1, slots);
  const slot = (plotRight - plotLeft) / n;
  const span = max - min || 1;
  const step = niceStep(span, Math.max(2, Math.round((plotBottom - plotTop) / 48)));
  let ticks: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max + 1e-9; t += step) ticks.push(Number(t.toFixed(6)));
  // Log scale: positions by ln(price); ticks at 1, 2 and 5 times powers of ten.
  const useLog = log && min > 0;
  const lmin = Math.log(useLog ? min : 1);
  const lspan = useLog ? Math.log(max) - lmin || 1 : 1;
  if (useLog) {
    ticks = [];
    for (let e = Math.floor(Math.log10(min)); e <= Math.ceil(Math.log10(max)); e++)
      for (const m of [1, 2, 5]) {
        const v = m * 10 ** e;
        if (v >= min - 1e-9 && v <= max + 1e-9) ticks.push(Number(v.toFixed(6)));
      }
  }
  const h = plotBottom - plotTop;
  return {
    width,
    height,
    slots: n,
    slot,
    min,
    max,
    plotLeft,
    plotRight,
    plotTop,
    plotBottom,
    x: (i) => plotLeft + slot * (i + 0.5),
    y: (p) => (useLog ? plotBottom - ((Math.log(Math.max(p, 1e-9)) - lmin) / lspan) * h : plotBottom - ((p - min) / span) * h),
    price: (y) => (useLog ? Math.exp(lmin + ((plotBottom - y) / h) * lspan) : min + ((plotBottom - y) / h) * span),
    index: (x) => Math.min(n - 1, Math.max(0, Math.floor((x - plotLeft) / slot))),
    ticks,
  };
}

/** Simple moving average of closes; null until enough candles exist. */
export function sma(candles: readonly CandleData[], period: number): (number | null)[] {
  const out: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < candles.length; i++) {
    sum += candles[i].c;
    if (i >= period) sum -= candles[i - period].c;
    out.push(i >= period - 1 ? sum / period : null);
  }
  return out;
}

/** Prices a layer occupies, so the fitted range includes every level, zone and line. */
function layerPrices(l: ChartLayer, candles: readonly CandleData[]): number[] {
  switch (l.kind) {
    case "level":
      return [l.price];
    case "zone":
    case "bracket":
      return [l.from, l.to];
    case "line":
      return l.values.filter((v): v is number => v !== null);
    case "path":
      return l.points.map((p) => p.price);
    case "marker":
      return l.price !== undefined ? [l.price] : [];
    case "ma":
      return sma(candles, l.period).filter((v): v is number => v !== null);
  }
}

/** The price range a chart needs: data, levels and zones, plus a margin. */
export function fitRange(spec: ChartSpec, extra: readonly ChartLayer[] = []): [number, number] {
  if (spec.range) return spec.range;
  const prices: number[] = [];
  // A line chart is scaled to its closes.
  for (const c of spec.candles) spec.style === "line" ? prices.push(c.c) : prices.push(c.h, c.l);
  for (const l of [...(spec.layers ?? []), ...extra]) prices.push(...layerPrices(l, spec.candles));
  if (!prices.length) return [99, 101];
  let lo = Math.min(...prices);
  let hi = Math.max(...prices);
  if (hi - lo < 0.2) {
    lo -= 0.1;
    hi += 0.1;
  }
  const m = (hi - lo) * 0.08;
  return [lo - m, hi + m];
}

export const p2 = (v: number) => v.toFixed(2);
