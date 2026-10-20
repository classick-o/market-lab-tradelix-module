import type { Candle } from "@market-lab/engine";
import { timeLabel } from "./Chart";

/**
 * Groups 1-hour candles into n-hour candles, using only candles up to `upTo`. The last group may
 * still be forming; nothing after `upTo` is ever read, so a higher timeframe can't leak the future.
 */
export function aggregate(candles: readonly Candle[], upTo: number, n: number): Candle[] {
  if (n <= 1) return candles.slice(0, upTo + 1);
  const out: Candle[] = [];
  for (let g = 0; g * n <= upTo; g++) {
    const from = g * n;
    const to = Math.min(upTo, from + n - 1);
    const part = candles.slice(from, to + 1);
    out.push({
      o: part[0].o,
      h: Math.max(...part.map((c) => c.h)),
      l: Math.min(...part.map((c) => c.l)),
      c: part[part.length - 1].c,
      v: part.reduce((s, c) => s + c.v, 0),
    });
  }
  return out;
}

/** Simple moving average of closes; null until `period` candles exist. Only reads candles 0..upTo. */
export function smaSeries(candles: readonly Candle[], period: number, upTo = candles.length - 1): (number | null)[] {
  const out: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i <= upTo; i++) {
    sum += candles[i].c;
    if (i >= period) sum -= candles[i - period].c;
    out.push(i >= period - 1 ? Math.round(sum / period) : null);
  }
  return out;
}

export const timeLabelFor = (hours: number) => (i: number) => timeLabel(i * hours);
