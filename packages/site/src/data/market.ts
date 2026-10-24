/**
 * Synthetic market data for the homepage, deterministic so every visitor sees the same chart.
 * The decision demo: an uptrend pulls back to its 20-period average, then one of two futures
 * plays out. Outcomes are computed from the candles, not written by hand.
 */
import { seeded } from "@market-lab/ui/scenes/core";

export interface Bar {
  o: number;
  h: number;
  l: number;
  c: number;
}

export function barsFromCloses(closes: number[], open: number, seed: number, wick = 0.32): Bar[] {
  const rand = seeded(seed);
  let prev = open;
  return closes.map((c) => {
    const o = prev;
    prev = c;
    return { o, c, h: Math.max(o, c) + 0.06 + rand() * wick, l: Math.min(o, c) - 0.06 - rand() * wick };
  });
}

export function sma(values: number[], n: number): (number | null)[] {
  return values.map((_, i) => (i < n - 1 ? null : values.slice(i - n + 1, i + 1).reduce((s, v) => s + v, 0) / n));
}

/** A random walk with drift, for the decorative charts in the scenes. */
export function walk(n: number, seed: number, start: number, drift: number, vol: number): number[] {
  const rand = seeded(seed);
  const out = [start];
  for (let i = 1; i < n; i++) out.push(out[i - 1] + drift + (rand() - 0.5) * vol);
  return out;
}

// ── The decision demo ─────────────────────────────────────────────────────────────────────────

function historyCloses(): number[] {
  const rand = seeded(7);
  const out: number[] = [];
  for (let i = 0; i < 41; i++) out.push(92 + i * 0.275 + Math.sin(i * 0.9) * 0.55 + (rand() - 0.5) * 0.5);
  // The pullback toward the average.
  for (const c of [102.75, 102.4, 102.15, 101.7, 101.5, 101.3, 101.25]) out.push(c);
  return out;
}

const HISTORY = historyCloses();
export const ENTRY = HISTORY[HISTORY.length - 1];
export const HISTORY_BARS = barsFromCloses(HISTORY, 91.7, 3);
export const HISTORY_SMA = sma(HISTORY, 20);

/** Long stop under the pullback's swing low; the short takes the same distance the other way. */
const swingLow = Math.min(...HISTORY_BARS.slice(-8).map((b) => b.l));
export const RISK = +(ENTRY - (swingLow - 0.2)).toFixed(2);

export type FutureId = "A" | "B";
export type Call = "buy" | "wait" | "sell";

const FUTURE_CLOSES: Record<FutureId, number[]> = {
  // The trend resumes after a shallow dip.
  A: [101.05, 100.9, 101.1, 101.45, 101.7, 101.55, 102.0, 102.35, 102.25, 102.7, 103.05, 103.4, 103.25, 103.65, 103.95, 103.8, 104.15, 104.4],
  // The pullback becomes a breakdown.
  B: [101.0, 100.75, 100.9, 100.4, 100.0, 99.7, 99.8, 99.35, 99.05, 99.2, 98.8, 98.5, 98.65, 98.2, 98.0, 98.15, 97.8, 97.6],
};

export const FUTURES: Record<FutureId, Bar[]> = {
  A: barsFromCloses(FUTURE_CLOSES.A, ENTRY, 11, 0.22),
  B: barsFromCloses(FUTURE_CLOSES.B, ENTRY, 13, 0.22),
};

export interface TradePlan {
  side: 1 | -1;
  entry: number;
  stop: number;
  target: number;
}

export function planFor(call: Call): TradePlan | null {
  if (call === "wait") return null;
  const side = call === "buy" ? 1 : -1;
  return { side, entry: ENTRY, stop: +(ENTRY - side * RISK).toFixed(2), target: +(ENTRY + side * RISK * 2).toFixed(2) };
}

/** Walks the future candle by candle: the stop is checked first, as a careful broker would. */
export function outcomeOf(plan: TradePlan | null, future: Bar[]): { r: number; at: number | null } {
  if (!plan) return { r: 0, at: null };
  for (let i = 0; i < future.length; i++) {
    const b = future[i];
    const stopHit = plan.side === 1 ? b.l <= plan.stop : b.h >= plan.stop;
    if (stopHit) return { r: -1, at: i };
    const targetHit = plan.side === 1 ? b.h >= plan.target : b.l <= plan.target;
    if (targetHit) return { r: 2, at: i };
  }
  const last = future[future.length - 1].c;
  return { r: +(((last - plan.entry) * plan.side) / RISK).toFixed(1), at: null };
}

/** Process scores depend only on the call and what was visible at the time, never on the future. */
export const GRADES: Record<Call, { dq: number; rd: number }> = {
  buy: { dq: 86, rd: 100 },
  wait: { dq: 64, rd: 100 },
  sell: { dq: 24, rd: 100 },
};

export const VERDICTS: Record<Call, Record<FutureId, string>> = {
  buy: {
    A: "Trend intact, pullback to the average, stop under the swing. It paid 2R, but the grade was earned before the market moved.",
    B: "Same decision, same 86. This time the market said no, and a planned 1R loss is the cost of doing business, not a mistake.",
  },
  wait: {
    A: "No trade, no risk. Defensible, but this was the setup a trend plan waits for. Patience scored, opportunity missed.",
    B: "Sitting out kept you flat while the setup failed. You're still graded on the call, not on the luck.",
  },
  sell: {
    A: "Shorting a healthy uptrend with no signal against it. The stop did its job: −1R, exactly as planned.",
    B: "It paid 2R and still scores 24. Profit from a weak process is luck, and luck doesn't compound.",
  },
};
