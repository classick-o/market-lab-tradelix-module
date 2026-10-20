import type { Candle } from "@market-lab/engine";

/** Inclusive index range [from, to], clamped to the array. */
function slice(c: readonly Candle[], from: number, to: number): readonly Candle[] {
  return c.slice(Math.max(0, from), Math.min(c.length, to + 1));
}

export function highestHigh(c: readonly Candle[], from: number, to: number): number {
  return Math.max(...slice(c, from, to).map((x) => x.h));
}

export function lowestLow(c: readonly Candle[], from: number, to: number): number {
  return Math.min(...slice(c, from, to).map((x) => x.l));
}

export function averageVolume(c: readonly Candle[], from: number, to: number): number {
  const s = slice(c, from, to);
  return Math.round(s.reduce((a, x) => a + x.v, 0) / s.length);
}

/** Average true range over the last `n` candles ending at `end`. */
export function atr(c: readonly Candle[], end: number, n = 14): number {
  let sum = 0;
  let count = 0;
  for (let i = Math.max(1, end - n + 1); i <= end; i++) {
    const prev = c[i - 1].c;
    sum += Math.max(c[i].h - c[i].l, Math.abs(c[i].h - prev), Math.abs(c[i].l - prev));
    count++;
  }
  return count ? Math.round(sum / count) : 0;
}

export function sma(c: readonly Candle[], end: number, n: number): number {
  const s = slice(c, end - n + 1, end);
  return Math.round(s.reduce((a, x) => a + x.c, 0) / s.length);
}

export function pctChange(from: number, to: number): number {
  return ((to - from) / from) * 100;
}

export function roundCents(x: number): number {
  return Math.round(x);
}
