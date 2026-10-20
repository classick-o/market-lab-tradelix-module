import type { Candle, IntrabarPath } from "@market-lab/engine";
import { createRng, type Rng } from "./prng";

interface Common {
  /** Wick size multiplier (default 1). */
  wick?: number;
  /** Volume multiplier (default 1). */
  volume?: number;
  /** Relative gap applied at the open of the segment's first bar, e.g. -0.05 = gap down 5%. */
  gap?: number;
}

export type SegmentSpec =
  /** Random walk with optional drift (per-bar log return). */
  | (Common & { kind: "walk"; bars: number; vol: number; drift?: number })
  /** Anchored move: ends exactly `move` (relative) away from the start, via a Brownian bridge. */
  | (Common & { kind: "move"; bars: number; move: number; vol: number })
  /** Mean-reverting range around `center` (relative to the segment start), bounded by ±halfWidth. */
  | (Common & { kind: "range"; bars: number; halfWidth: number; vol: number; center?: number })
  /** One explicit candle relative to the previous close. */
  | (Common & { kind: "candle"; body: number; upper: number; lower: number });

export interface ScenarioSpec {
  seed: number;
  /** Starting price in vUSD (e.g. 100). */
  start: number;
  baseVolume?: number;
  segments: SegmentSpec[];
}

interface BarPlan {
  close: number;
  vol: number;
  wick: number;
  volume: number;
  /** Explicit shape (for kind: "candle"). */
  shape?: { body: number; upper: number; lower: number };
  /** Open of this bar, if different from the previous close. */
  open?: number;
}

function planSegment(rng: Rng, seg: SegmentSpec, lastClose: number): BarPlan[] {
  const wick = seg.wick ?? 1;
  const volume = seg.volume ?? 1;
  const gapOpen = seg.gap ? lastClose * (1 + seg.gap) : undefined;
  const lp0 = Math.log(gapOpen ?? lastClose);
  const out: BarPlan[] = [];

  switch (seg.kind) {
    case "candle": {
      const open = gapOpen ?? lastClose;
      out.push({ close: open * (1 + seg.body), vol: Math.abs(seg.body), wick, volume, shape: seg, open: gapOpen });
      return out;
    }
    case "walk": {
      let lp = lp0;
      for (let i = 0; i < seg.bars; i++) {
        lp += (seg.drift ?? 0) + seg.vol * rng.normal();
        out.push({ close: Math.exp(lp), vol: seg.vol, wick, volume });
      }
      break;
    }
    case "move": {
      const target = lp0 + Math.log(1 + seg.move);
      const walk: number[] = [];
      let w = 0;
      for (let i = 0; i < seg.bars; i++) {
        w += seg.vol * rng.normal();
        walk.push(w);
      }
      const wn = walk[walk.length - 1] ?? 0;
      for (let i = 0; i < seg.bars; i++) {
        const f = (i + 1) / seg.bars;
        out.push({ close: Math.exp(lp0 + walk[i] - f * wn + f * (target - lp0)), vol: seg.vol, wick, volume });
      }
      break;
    }
    case "range": {
      const center = lp0 + Math.log(1 + (seg.center ?? 0));
      const hw = Math.log(1 + seg.halfWidth);
      let lp = lp0;
      for (let i = 0; i < seg.bars; i++) {
        lp += 0.3 * (center - lp) + seg.vol * rng.normal();
        const d = lp - center;
        if (Math.abs(d) > hw) lp = center + Math.sign(d) * Math.max(0, 2 * hw - Math.abs(d));
        out.push({ close: Math.exp(lp), vol: seg.vol, wick, volume });
      }
      break;
    }
  }
  if (out.length > 0 && gapOpen !== undefined) out[0].open = gapOpen;
  return out;
}

const cents = (x: number) => Math.max(1, Math.round(x * 100));

/** Generates OHLCV candles (integer cents) with an explicit intrabar path for every candle. */
export function generateCandles(spec: ScenarioSpec): Candle[] {
  const rng = createRng(spec.seed);
  const baseVolume = spec.baseVolume ?? 1000;
  const candles: Candle[] = [];
  let lastClose = spec.start;

  for (const seg of spec.segments) {
    for (const bar of planSegment(rng, seg, lastClose)) {
      const openRaw = bar.open ?? lastClose;
      const o = cents(openRaw);
      const c = cents(bar.close);
      let h: number;
      let l: number;
      if (bar.shape) {
        h = cents(Math.max(openRaw, bar.close) * (1 + bar.shape.upper));
        l = cents(Math.min(openRaw, bar.close) * (1 - bar.shape.lower));
      } else {
        const up = Math.abs(rng.normal()) * bar.vol * 0.8 * bar.wick + bar.vol * 0.1;
        const down = Math.abs(rng.normal()) * bar.vol * 0.8 * bar.wick + bar.vol * 0.1;
        h = cents(Math.max(openRaw, bar.close) * (1 + up));
        l = cents(Math.min(openRaw, bar.close) * (1 - down));
      }
      h = Math.max(h, o, c);
      l = Math.max(1, Math.min(l, o, c));
      const bullish = c >= o;
      const path: IntrabarPath = bullish ? (rng.chance(0.65) ? "OLHC" : "OHLC") : rng.chance(0.65) ? "OHLC" : "OLHC";
      const ret = Math.abs(bar.close / openRaw - 1);
      const v = Math.max(1, Math.round(baseVolume * bar.volume * (1 + 25 * ret) * Math.exp(0.35 * rng.normal())));
      candles.push({ o, h, l, c, v, path });
      lastClose = c / 100;
    }
  }
  return candles;
}

export function totalBars(spec: ScenarioSpec): number {
  return spec.segments.reduce((n, s) => n + (s.kind === "candle" ? 1 : s.bars), 0);
}
