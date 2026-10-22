import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, Question, UnitContent } from "../../types";

/** One candle, in price units with 2 decimals. */
const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

/*
 * Rules used to build and check every chart below (docs/learn/course/level-2-practitioner-a.md, "Regulile de detecție"):
 * averages are over the 10 (or 5) candles before the one measured; a prior decline is close < SMA(10) with SMA(10) falling
 * over 3 candles. Random-walk figures: 3,000 paths of 200 one-hour candles (seed 2101, 12 Gaussian sub-steps of 0.06 per
 * candle, open = previous close), candles 21–190 of each path scored: 510,000 in all. "Higher 10 candles later" compares
 * closes; "up first" asks which comes first, a close above the pattern's high or below its low (Bulkowski's count).
 * Average R: entry at the ask on the pattern's close, stop 0.10 under its low, exit at the stop or the bid after 10 candles,
 * commission 0.05% each way.
 */

// ─── 2.1.1 · Measuring a candle against its neighbours ──────────────────────

/** The hook candle: body 0.50, from 100.00 to 100.50. */
const L211_X = k(100.0, 100.6, 99.9, 100.5);

/** Ten calm candles (bodies average 0.20, ranges 0.40), then the hook candle: 2.5 × the average body, long. */
const L211_CALM: CandleData[] = [
  k(99.82, 100.09, 99.71, 100.0), k(100.0, 100.09, 99.67, 99.78), k(99.78, 100.02, 99.66, 99.93), k(99.93, 100.02, 99.57, 99.68),
  k(99.68, 99.97, 99.57, 99.88), k(99.88, 100.14, 99.77, 100.05), k(100.05, 100.14, 99.71, 99.82), k(99.82, 100.1, 99.71, 100.01),
  k(100.01, 100.1, 99.69, 99.8), k(99.8, 100.09, 99.7, 100.0), L211_X,
];

/** Ten busy candles (bodies average 0.80, ranges 1.40), then the same candle: below the average body, short. */
const L211_VOLATILE: CandleData[] = [
  k(99.96, 100.99, 99.69, 100.71), k(100.71, 101.04, 99.49, 99.81), k(99.81, 100.79, 99.54, 100.51), k(100.51, 100.81, 99.36, 99.66),
  k(99.66, 100.76, 99.36, 100.46), k(100.46, 100.73, 99.53, 99.81), k(99.81, 101.09, 99.49, 100.76), k(100.76, 101.05, 99.7, 99.98),
  k(99.98, 101.14, 99.64, 100.8), k(100.8, 101.1, 99.7, 100.0), L211_X,
];

/**
 * Hotspot: a busy stretch, then a calm one. Only candle 23 (index 22, body 0.50) is very long: 3.33 × the 0.15 average of the
 * 10 before it. Candle 11 (0.90) is 1.29 × its 0.70 average; candle 22 (0.30) is 2.26 × 0.133; candle 6 has the biggest range,
 * 1.80, on a 0.10 body.
 */
const L211_HOT: CandleData[] = [
  k(100.0, 101.05, 99.72, 100.75), k(100.75, 101.07, 99.65, 99.95), k(99.95, 100.92, 99.64, 100.65), k(100.65, 100.95, 99.47, 99.8),
  k(99.8, 100.87, 99.5, 100.58), k(100.58, 101.44, 99.64, 100.48), k(100.48, 101.61, 100.19, 101.3), k(101.3, 101.6, 100.22, 100.54),
  k(100.54, 101.62, 100.24, 101.34), k(101.34, 101.67, 100.4, 100.7), k(100.7, 101.8, 100.48, 101.6), k(101.6, 101.66, 101.4, 101.47),
  k(101.47, 101.52, 101.27, 101.33), k(101.33, 101.53, 101.28, 101.46), k(101.46, 101.52, 101.26, 101.33), k(101.33, 101.5, 101.27, 101.45),
  k(101.45, 101.51, 101.26, 101.31), k(101.31, 101.53, 101.25, 101.46), k(101.46, 101.51, 101.27, 101.34), k(101.34, 101.54, 101.29, 101.48),
  k(101.48, 101.55, 101.29, 101.35), k(101.35, 101.42, 100.99, 101.05), k(101.05, 101.61, 101.0, 101.55),
];

/**
 * Fifty random-walk candles (path 9 of the random-walk set). Scored from candle 11 on: bodies ≤ 5% of the average range of the
 * 10 before: indices 17, 49; ≤ 10%: adds 12, 19; ≤ 20%: adds 16, 20, 21, 26, 30, 35. So 2, 4 and 10 doji.
 */
const L211_DOJI: CandleData[] = [
  k(100.0, 100.21, 99.95, 100.21), k(100.21, 100.46, 100.19, 100.29), k(100.29, 100.59, 100.28, 100.46), k(100.46, 100.58, 100.41, 100.54),
  k(100.54, 100.54, 100.33, 100.44), k(100.44, 100.61, 100.43, 100.54), k(100.54, 100.59, 100.48, 100.48), k(100.48, 100.54, 100.29, 100.34),
  k(100.34, 100.34, 99.94, 99.94), k(99.94, 100.09, 99.76, 99.85), k(99.85, 100.41, 99.85, 100.41), k(100.41, 100.48, 100.24, 100.25),
  k(100.25, 100.33, 100.16, 100.23), k(100.23, 100.5, 100.19, 100.5), k(100.5, 100.57, 100.09, 100.12), k(100.12, 100.3, 100.1, 100.2),
  k(100.2, 100.32, 100.04, 100.14), k(100.14, 100.23, 100.04, 100.15), k(100.15, 100.15, 99.91, 100.01), k(100.01, 100.11, 99.91, 100.03),
  k(100.03, 100.12, 99.95, 100.07), k(100.07, 100.26, 100.07, 100.1), k(100.1, 100.22, 100.05, 100.22), k(100.22, 100.22, 99.99, 100.13),
  k(100.13, 100.7, 100.13, 100.64), k(100.64, 100.7, 100.21, 100.21), k(100.21, 100.34, 100.03, 100.16), k(100.16, 100.19, 99.96, 99.96),
  k(99.96, 100.05, 99.79, 99.79), k(99.79, 99.79, 99.52, 99.58), k(99.58, 99.8, 99.52, 99.53), k(99.53, 99.74, 99.48, 99.74),
  k(99.74, 99.82, 99.65, 99.66), k(99.66, 99.81, 99.66, 99.81), k(99.81, 100.13, 99.8, 99.99), k(99.99, 100.13, 99.96, 99.96),
  k(99.96, 100.05, 99.91, 100.03), k(100.03, 100.18, 100.03, 100.12), k(100.12, 100.12, 99.82, 100.02), k(100.02, 100.05, 99.84, 99.84),
  k(99.84, 99.84, 99.49, 99.49), k(99.49, 99.49, 99.21, 99.25), k(99.25, 99.34, 99.06, 99.16), k(99.16, 99.45, 99.1, 99.45),
  k(99.45, 99.53, 99.31, 99.33), k(99.33, 99.44, 99.14, 99.14), k(99.14, 99.36, 98.97, 98.97), k(98.97, 98.99, 98.8, 98.81),
  k(98.81, 99.15, 98.81, 99.03), k(99.03, 99.15, 98.91, 99.02),
];
const dojiMarks = (idx: number[]): ChartLayer[] => idx.map((index) => ({ kind: "marker", index, at: "high", role: "concept" }));

// ─── 2.1.2 · Long shadows ───────────────────────────────────────────────────

/** A 13-candle decline, the hammer 99.40 / 99.55 / 98.60 / 99.50 (index 13), a 10-candle rise, the same shape 2.00 higher (index 24). */
const L212_TWINS: CandleData[] = [
  k(101.8, 101.97, 101.35, 101.55), k(101.55, 101.7, 101.02, 101.25), k(101.25, 101.57, 101.1, 101.37), k(101.37, 101.54, 100.88, 101.09),
  k(101.09, 101.28, 100.7, 100.87), k(100.87, 101.02, 100.37, 100.57), k(100.57, 100.88, 100.4, 100.67), k(100.67, 100.84, 100.19, 100.41),
  k(100.41, 100.56, 99.9, 100.09), k(100.09, 100.29, 99.7, 99.91), k(99.91, 100.22, 99.74, 100.03), k(100.03, 100.2, 99.55, 99.75),
  k(99.75, 99.9, 99.35, 99.4), k(99.4, 99.55, 98.6, 99.5), k(99.5, 99.92, 99.35, 99.75), k(99.75, 100.1, 99.56, 99.95),
  k(99.95, 100.12, 99.68, 99.85), k(99.85, 100.28, 99.68, 100.13), k(100.13, 100.54, 99.98, 100.35), k(100.35, 100.8, 100.18, 100.65),
  k(100.65, 100.84, 100.38, 100.53), k(100.53, 100.95, 100.36, 100.78), k(100.78, 101.25, 100.59, 101.1), k(101.1, 101.5, 100.95, 101.4),
  k(101.4, 101.55, 100.6, 101.5),
];

/**
 * Shooting-star hotspot. Index 13: upper-shadow shape after a decline (inverted hammer); index 20: hanging man; index 24: body 0.40
 * with a 0.45 upper shadow; index 28: the only shooting star (body 0.10, upper 0.85, lower 0.03, after a rise).
 */
const L212_STAR: CandleData[] = [
  k(101.8, 101.97, 101.35, 101.55), k(101.55, 101.7, 101.02, 101.25), k(101.25, 101.57, 101.1, 101.37), k(101.37, 101.54, 100.88, 101.09),
  k(101.09, 101.28, 100.7, 100.87), k(100.87, 101.02, 100.37, 100.57), k(100.57, 100.88, 100.4, 100.67), k(100.67, 100.84, 100.19, 100.41),
  k(100.41, 100.56, 99.9, 100.09), k(100.09, 100.29, 99.7, 99.91), k(99.91, 100.22, 99.74, 100.03), k(100.03, 100.2, 99.55, 99.75),
  k(99.75, 99.9, 99.35, 99.4), k(99.4, 100.15, 99.37, 99.5), k(99.5, 99.92, 99.35, 99.75), k(99.75, 100.1, 99.56, 99.95),
  k(99.95, 100.12, 99.68, 99.85), k(99.85, 100.28, 99.68, 100.13), k(100.13, 100.54, 99.98, 100.35), k(100.35, 100.8, 100.18, 100.65),
  k(100.65, 100.8, 99.95, 100.75), k(100.75, 101.17, 100.58, 101.0), k(101.0, 101.19, 100.73, 100.88), k(100.88, 101.33, 100.71, 101.18),
  k(101.18, 102.03, 101.15, 101.58), k(101.58, 101.97, 101.43, 101.8), k(101.8, 101.98, 101.54, 101.7), k(101.7, 102.05, 101.53, 101.9),
  k(101.9, 102.75, 101.77, 101.8), k(101.8, 101.92, 101.48, 101.62), k(101.62, 101.89, 101.46, 101.74),
];

/**
 * Hammer hunt: five long lower shadows, each failing one rule except index 37. Index 13: lower 0.30 < 2 × body 0.20; index 26:
 * upper 0.16 ≥ 0.1 × average range 0.526; index 34: body 98.11–98.21, previous low 97.66; index 49: after a rise (hanging man).
 * Index 37: body 0.10, lower 0.75, upper 0.04, previous low 97.56.
 */
const L212_TRY: CandleData[] = [
  k(101.8, 101.97, 101.35, 101.55), k(101.55, 101.7, 101.02, 101.25), k(101.25, 101.57, 101.1, 101.37), k(101.37, 101.54, 100.88, 101.09),
  k(101.09, 101.28, 100.7, 100.87), k(100.87, 101.02, 100.37, 100.57), k(100.57, 100.88, 100.4, 100.67), k(100.67, 100.84, 100.19, 100.41),
  k(100.41, 100.56, 99.9, 100.09), k(100.09, 100.29, 99.7, 99.91), k(99.91, 100.22, 99.74, 100.03), k(100.03, 100.2, 99.55, 99.75),
  k(99.75, 99.9, 99.37, 99.45), k(99.45, 99.67, 99.15, 99.65), k(99.65, 100.03, 99.51, 99.87), k(99.87, 100.2, 99.7, 100.05),
  k(100.05, 100.22, 99.82, 99.97), k(99.97, 100.32, 99.81, 100.17), k(100.17, 100.49, 100.03, 100.32), k(100.32, 100.47, 99.91, 100.08),
  k(100.08, 100.24, 99.65, 99.8), k(99.8, 100.07, 99.64, 99.9), k(99.9, 100.05, 99.42, 99.6), k(99.6, 99.77, 99.19, 99.34),
  k(99.34, 99.49, 98.95, 99.12), k(99.12, 99.28, 98.72, 98.82), k(98.82, 99.08, 98.22, 98.92), k(98.92, 99.25, 98.76, 99.1),
  k(99.1, 99.4, 98.95, 99.24), k(99.24, 99.39, 98.97, 99.14), k(99.14, 99.3, 98.71, 98.86), k(98.86, 99.01, 98.43, 98.6),
  k(98.6, 98.77, 98.21, 98.36), k(98.36, 98.48, 97.66, 98.11), k(98.11, 98.24, 97.71, 98.21), k(98.21, 98.36, 97.77, 97.93),
  k(97.93, 98.07, 97.56, 97.61), k(97.61, 97.75, 96.86, 97.71), k(97.71, 98.12, 97.55, 97.97), k(97.97, 98.36, 97.82, 98.19),
  k(98.19, 98.34, 97.92, 98.09), k(98.09, 98.55, 97.94, 98.39), k(98.39, 98.78, 98.22, 98.63), k(98.63, 99.08, 98.48, 98.91),
  k(98.91, 99.06, 98.63, 98.79), k(98.79, 99.21, 98.64, 99.05), k(99.05, 99.5, 98.88, 99.35), k(99.35, 99.74, 99.2, 99.57),
  k(99.57, 99.92, 99.42, 99.82), k(99.82, 99.96, 99.12, 99.92), k(99.92, 100.07, 99.58, 99.72), k(99.72, 100.0, 99.57, 99.84),
];

// ─── 2.1.3 · Context first ──────────────────────────────────────────────────

/**
 * Support near 98.60 (lows 98.60 at index 3, 98.62 at index 6), a rally to 101.50 (index 13), a 10-candle decline, hammer A
 * 99.40 / 99.55 / 98.60 / 99.50 (index 24), then a close at 99.90 (index 25), above the hammer's high.
 */
const L213_CHART: CandleData[] = [
  k(100.2, 100.35, 99.79, 99.95), k(99.95, 100.09, 99.43, 99.6), k(99.6, 99.75, 99.04, 99.2), k(99.2, 99.34, 98.6, 98.85),
  k(98.85, 99.31, 98.7, 99.15), k(99.15, 99.55, 98.99, 99.4), k(99.4, 99.56, 98.62, 99.05), k(99.05, 99.6, 98.88, 99.45),
  k(99.45, 100.01, 99.3, 99.85), k(99.85, 100.45, 99.69, 100.3), k(100.3, 100.86, 100.15, 100.7), k(100.7, 100.87, 100.39, 100.55),
  k(100.55, 101.15, 100.38, 101.0), k(101.0, 101.5, 100.84, 101.35), k(101.35, 101.47, 100.94, 101.1), k(101.1, 101.25, 100.68, 100.85),
  k(100.85, 101.11, 100.7, 100.95), k(100.95, 101.1, 100.43, 100.6), k(100.6, 100.76, 100.15, 100.3), k(100.3, 100.55, 100.14, 100.4),
  k(100.4, 100.56, 99.88, 100.05), k(100.05, 100.2, 99.64, 99.8), k(99.8, 99.96, 99.6, 99.75), k(99.75, 99.85, 99.35, 99.4),
  k(99.4, 99.55, 98.6, 99.5), k(99.5, 99.95, 99.4, 99.9),
];

// ─── 2.1.4 · Engulfing and harami ───────────────────────────────────────────

/** A short decline, candle 1 101.00 → 100.20 (high 101.30), candle 2 100.10 → 101.10 (index 7). */
const L214_ENGULF: CandleData[] = [
  k(102.4, 102.52, 102.01, 102.15), k(102.15, 102.28, 101.65, 101.8), k(101.8, 102.04, 101.68, 101.9), k(101.9, 102.02, 101.35, 101.5),
  k(101.5, 101.64, 101.07, 101.2), k(101.2, 101.32, 100.9, 101.0), k(101.0, 101.3, 100.05, 100.2), k(100.1, 101.2, 100.0, 101.1),
];

/**
 * Engulfing hunt: four bullish candles covering the one before, at least in part. Index 14: range only (body 100.30–100.90
 * inside 100.20–101.00); index 24: body misses the bottom (opens 99.40 over a 99.30 close); index 34: the bullish engulfing
 * (98.35–99.00 over 98.40–98.90, after a decline); index 48: bodies engulf but after a rise.
 */
const L214_TRY: CandleData[] = [
  k(103.4, 103.53, 103.0, 103.15), k(103.15, 103.29, 102.77, 102.9), k(102.9, 103.11, 102.76, 102.98), k(102.98, 103.1, 102.55, 102.7),
  k(102.7, 102.84, 102.32, 102.45), k(102.45, 102.58, 102.1, 102.25), k(102.25, 102.44, 102.12, 102.32), k(102.32, 102.46, 101.85, 102.0),
  k(102.0, 102.13, 101.61, 101.75), k(101.75, 101.9, 101.37, 101.5), k(101.5, 101.71, 101.36, 101.58), k(101.58, 101.72, 101.1, 101.25),
  k(101.25, 101.37, 100.87, 101.0), k(101.0, 101.1, 100.05, 100.2), k(100.3, 101.2, 100.0, 100.9), k(100.9, 101.19, 100.77, 101.05),
  k(101.05, 101.18, 100.81, 100.95), k(100.95, 101.07, 100.55, 100.7), k(100.7, 100.84, 100.32, 100.45), k(100.45, 100.68, 100.31, 100.55),
  k(100.55, 100.67, 100.05, 100.2), k(100.2, 100.34, 99.82, 99.95), k(99.95, 100.08, 99.66, 99.8), k(99.8, 99.9, 99.2, 99.3),
  k(99.4, 100.0, 99.15, 99.95), k(99.95, 100.08, 99.66, 99.8), k(99.8, 100.02, 99.68, 99.88), k(99.88, 100.0, 99.45, 99.6),
  k(99.6, 99.74, 99.22, 99.35), k(99.35, 99.55, 99.21, 99.42), k(99.42, 99.54, 98.95, 99.1), k(99.1, 99.24, 98.72, 98.85),
  k(98.85, 99.03, 98.73, 98.9), k(98.9, 99.0, 98.3, 98.4), k(98.35, 99.1, 98.25, 99.0), k(99.0, 99.44, 98.87, 99.3),
  k(99.3, 99.68, 99.16, 99.55), k(99.55, 99.67, 99.27, 99.4), k(99.4, 99.64, 99.28, 99.5), k(99.5, 99.94, 99.37, 99.8),
  k(99.8, 100.18, 99.66, 100.05), k(100.05, 100.42, 99.9, 100.3), k(100.3, 100.44, 100.06, 100.18), k(100.18, 100.4, 100.06, 100.27),
  k(100.27, 100.68, 100.13, 100.55), k(100.55, 100.94, 100.42, 100.8), k(100.8, 101.17, 100.67, 101.05), k(101.05, 101.15, 100.5, 100.6),
  k(100.55, 101.25, 100.45, 101.15), k(101.15, 101.48, 101.01, 101.35), k(101.35, 101.47, 101.12, 101.25),
];

// ─── 2.1.5 · The penetration scale ──────────────────────────────────────────

/** Ten candles (bodies average 0.50; the last five ranges 1.00 each), candle 1 101.00 / 101.10 / 99.90 / 100.00, candle 2 opening 99.70 and closing 100.70. */
const L215_SCALE: CandleData[] = [
  k(104.5, 104.7, 103.75, 103.95), k(103.95, 104.17, 103.3, 103.5), k(103.5, 104.08, 103.2, 103.8), k(103.8, 103.95, 103.0, 103.2),
  k(103.2, 103.4, 102.52, 102.7), k(102.7, 103.0, 102.0, 102.3), k(102.3, 103.03, 102.03, 102.75), k(102.75, 102.93, 101.93, 102.1),
  k(102.1, 102.32, 101.32, 101.55), k(101.55, 101.75, 100.75, 101.0), k(101.0, 101.1, 99.9, 100.0), k(99.7, 100.8, 99.6, 100.7),
];

/**
 * Tweezers: tolerance 0.05 × the average range of the 5 candles before, about 0.026 here. Index 15: lows 100.40 / 100.28 after a
 * decline (0.12 apart); index 29: lows 99.20 / 99.22 after a decline, the tweezer bottom; index 41: lows 101.05 / 101.05 after a rise.
 */
const L215_TWEEZERS: CandleData[] = [
  k(103.4, 103.52, 103.06, 103.2), k(103.2, 103.33, 102.85, 103.0), k(103.0, 103.19, 102.8, 103.05), k(103.05, 103.17, 102.56, 102.7),
  k(102.7, 102.83, 102.3, 102.45), k(102.45, 102.66, 102.25, 102.52), k(102.52, 102.64, 102.05, 102.2), k(102.2, 102.34, 101.82, 101.95),
  k(101.95, 102.08, 101.55, 101.7), k(101.7, 101.9, 101.49, 101.78), k(101.78, 101.92, 101.32, 101.45), k(101.45, 101.58, 101.05, 101.2),
  k(101.2, 101.32, 100.81, 100.95), k(100.95, 101.09, 100.57, 100.7), k(100.7, 100.82, 100.4, 100.55), k(100.55, 100.75, 100.28, 100.62),
  k(100.62, 100.99, 100.49, 100.85), k(100.85, 101.18, 100.71, 101.05), k(101.05, 101.17, 100.82, 100.95), k(100.95, 101.24, 100.76, 101.1),
  k(101.1, 101.23, 100.71, 100.85), k(100.85, 100.99, 100.47, 100.6), k(100.6, 100.8, 100.4, 100.68), k(100.68, 100.81, 100.21, 100.35),
  k(100.35, 100.49, 99.98, 100.1), k(100.1, 100.23, 99.71, 99.85), k(99.85, 100.02, 99.65, 99.9), k(99.9, 100.04, 99.42, 99.55),
  k(99.55, 99.67, 99.2, 99.3), k(99.3, 99.53, 99.22, 99.4), k(99.4, 99.78, 99.3, 99.65), k(99.65, 100.04, 99.52, 99.9),
  k(99.9, 100.02, 99.67, 99.8), k(99.8, 100.23, 99.59, 100.1), k(100.1, 100.49, 99.98, 100.35), k(100.35, 100.72, 100.21, 100.6),
  k(100.6, 100.73, 100.38, 100.5), k(100.5, 100.94, 100.3, 100.8), k(100.8, 101.17, 100.66, 101.05), k(101.05, 101.43, 100.93, 101.3),
  k(101.3, 101.42, 101.05, 101.2), k(101.2, 101.48, 101.05, 101.35), k(101.35, 101.69, 101.22, 101.55),
];

/** Penetration-scale bands for candle 1 = 101.00 → 100.00 (low 99.90), Equal tolerance 0.05. */
const L215_BANDS: ChartLayer[] = [
  { kind: "zone", from: 99.85, to: 99.95, role: "concept", label: "ON-NECK" },
  { kind: "zone", from: 100.0, to: 100.05, role: "concept", label: "IN-NECK" },
  { kind: "zone", from: 100.06, to: 100.5, role: "neutral", label: "THRUSTING" },
  { kind: "zone", from: 100.51, to: 100.99, role: "support", label: "PIERCING" },
  { kind: "zone", from: 101.0, to: 101.2, role: "support", label: "ENGULFING" },
];
/** What each close of candle 2 is called (slider feedback). */
const L215_SCALE_FEEDBACK = [
  { from: 99.7, to: 99.84, text: "A close below the on-neck band, under candle 1's low: no name at all." },
  { from: 99.85, to: 99.95, text: "On-neck: a close at candle 1's low, 99.90, give or take 0.05." },
  { from: 99.96, to: 99.99, text: "The strip with no name, between on-neck and in-neck." },
  { from: 100.0, to: 100.05, text: "In-neck: just inside the body, within 0.05 of candle 1's close." },
  { from: 100.06, to: 100.5, text: "Thrusting: into the body, but not past its middle, 100.50." },
  { from: 100.51, to: 100.99, text: "Piercing: past the middle of the body, below its top." },
  { from: 101.0, to: 101.2, text: "Bullish engulfing: the close covers candle 1's whole body." },
];

// ─── 2.1.6 · Stars ──────────────────────────────────────────────────────────

/** A decline (bodies average 0.40 before candle 1), then 102.00 → 101.00 (index 13), 100.80 → 100.70 (index 14), 100.90 → 101.60 (index 15). */
const L216_STAR: CandleData[] = [
  k(105.6, 105.72, 105.17, 105.3), k(105.3, 105.58, 105.18, 105.45), k(105.45, 105.57, 104.76, 104.9), k(104.9, 105.02, 104.31, 104.45),
  k(104.45, 104.58, 103.98, 104.1), k(104.1, 104.49, 103.97, 104.35), k(104.35, 104.47, 103.7, 103.85), k(103.85, 103.99, 103.33, 103.45),
  k(103.45, 103.58, 102.86, 103.0), k(103.0, 103.42, 102.87, 103.3), k(103.3, 103.44, 102.78, 102.9), k(102.9, 103.03, 102.3, 102.45),
  k(102.45, 102.57, 101.9, 102.0), k(102.0, 102.05, 100.95, 101.0), k(100.8, 100.9, 100.6, 100.7), k(100.9, 101.7, 100.85, 101.6),
];

// ─── 2.1.7 · Three-candle patterns ──────────────────────────────────────────

/** A decline, candle 1 101.00 → 100.00 (index 13), candle 2 100.20 → 100.50 inside it, candle 3 100.50 → 101.20. */
const L217_INSIDE: CandleData[] = [
  k(104.25, 104.37, 103.82, 103.95), k(103.95, 104.23, 103.83, 104.1), k(104.1, 104.22, 103.56, 103.7), k(103.7, 103.83, 103.2, 103.35),
  k(103.35, 103.49, 102.78, 102.9), k(102.9, 103.27, 102.77, 103.15), k(103.15, 103.28, 102.6, 102.75), k(102.75, 102.87, 102.26, 102.4),
  k(102.4, 102.54, 101.82, 101.95), k(101.95, 102.27, 101.82, 102.15), k(102.15, 102.28, 101.61, 101.75), k(101.75, 101.87, 101.3, 101.45),
  k(101.45, 101.57, 100.9, 101.0), k(101.0, 101.05, 99.95, 100.0), k(100.2, 100.6, 100.1, 100.5), k(100.5, 101.3, 100.45, 101.2),
];

/** A high of 103.00 (index 2), a decline to 99.90, then three white soldiers (indices 15–17): 99.90 → 100.60, 100.40 → 101.30, 101.10 → 102.00; low 99.80. */
const L217_SOLDIERS: CandleData[] = [
  k(102.3, 102.75, 102.17, 102.6), k(102.6, 102.99, 102.48, 102.85), k(102.85, 103.0, 102.56, 102.7), k(102.7, 102.83, 102.25, 102.4),
  k(102.4, 102.52, 101.96, 102.1), k(102.1, 102.34, 101.97, 102.2), k(102.2, 102.33, 101.7, 101.85), k(101.85, 101.97, 101.36, 101.5),
  k(101.5, 101.74, 101.37, 101.6), k(101.6, 101.73, 101.05, 101.2), k(101.2, 101.32, 100.71, 100.85), k(100.85, 101.09, 100.72, 100.95),
  k(100.95, 101.08, 100.4, 100.55), k(100.55, 100.67, 100.06, 100.2), k(100.2, 100.33, 99.8, 99.9), k(99.9, 100.65, 99.8, 100.6),
  k(100.4, 101.35, 100.35, 101.3), k(101.1, 102.05, 101.05, 102.0),
];

// ─── 2.1.8 · The pattern zoo ────────────────────────────────────────────────

/** A decline, three falling candles 101.20 → 99.70 (indices 9–11), then 99.60 → 101.30 (index 12). */
const L218_STRIKE: CandleData[] = [
  k(103.0, 103.12, 102.67, 102.8), k(102.8, 102.93, 102.43, 102.55), k(102.55, 102.74, 102.42, 102.62), k(102.62, 102.75, 102.16, 102.3),
  k(102.3, 102.42, 101.92, 102.05), k(102.05, 102.19, 101.68, 101.8), k(101.8, 102.0, 101.67, 101.88), k(101.88, 102.01, 101.38, 101.5),
  k(101.5, 101.62, 101.1, 101.2), k(101.2, 101.28, 100.62, 100.7), k(100.7, 100.78, 100.12, 100.2), k(100.2, 100.27, 99.62, 99.7),
  k(99.6, 101.4, 99.5, 101.3),
];

/**
 * Random walk (path 4, candles 55–84 of the random-walk set): the first three white soldiers the rule finds (indices 17–19,
 * close 100.80). The next 10 candles dip to 100.15 and close at 100.82.
 */
const L218_RANDOM: CandleData[] = [
  k(100.8, 100.87, 100.68, 100.7), k(100.7, 100.7, 100.35, 100.51), k(100.51, 100.57, 100.32, 100.32), k(100.32, 100.36, 100.01, 100.01),
  k(100.01, 100.11, 99.84, 99.92), k(99.92, 100.58, 99.92, 100.57), k(100.57, 100.73, 100.54, 100.54), k(100.54, 100.89, 100.54, 100.83),
  k(100.83, 100.83, 100.53, 100.64), k(100.64, 100.72, 100.57, 100.67), k(100.67, 100.83, 100.64, 100.8), k(100.8, 100.98, 100.63, 100.98),
  k(100.98, 101.05, 100.72, 100.72), k(100.72, 100.8, 100.62, 100.73), k(100.73, 100.73, 100.42, 100.42), k(100.42, 100.51, 100.18, 100.26),
  k(100.26, 100.33, 99.95, 99.95), k(99.95, 100.27, 99.95, 100.27), k(100.27, 100.49, 100.24, 100.49), k(100.49, 100.8, 100.42, 100.8),
  k(100.8, 100.8, 100.42, 100.47), k(100.47, 100.63, 100.39, 100.59), k(100.59, 100.59, 100.36, 100.41), k(100.41, 100.56, 100.4, 100.55),
  k(100.55, 100.57, 100.29, 100.41), k(100.41, 100.41, 100.15, 100.15), k(100.15, 100.36, 100.15, 100.25), k(100.25, 100.58, 100.19, 100.53),
  k(100.53, 100.95, 100.53, 100.85), k(100.85, 100.92, 100.72, 100.82),
];

// ─── 2.1.9 · Heikin-Ashi, Renko, point & figure ─────────────────────────────

/**
 * Eleven real candles; the first only seeds Heikin-Ashi (HA open = (O + C) ÷ 2 = 98.75) and isn't drawn. Highs and lows are set
 * so every HA value is a whole cent. Drawn candles 1–10: real 2 and 7 are red while HA stays green; real 10 is green, HA red.
 */
const L219_SEED_REAL: CandleData[] = [
  k(98.65, 98.95, 98.47, 98.85), k(98.85, 99.3, 98.73, 99.2), k(99.2, 99.4, 98.94, 99.1), k(99.1, 99.75, 98.99, 99.6),
  k(99.6, 100.1, 99.54, 100.0), k(100.0, 101.0, 99.64, 100.8), k(100.8, 101.4, 100.48, 101.2), k(101.2, 101.3, 100.18, 100.4),
  k(100.4, 100.6, 99.7, 99.9), k(99.9, 100.2, 99.48, 99.7), k(99.7, 100.3, 99.58, 100.1),
];
/** HA of the same candles: close = (O + H + L + C) ÷ 4, open = (previous HA open + previous HA close) ÷ 2. */
const L219_SEED_HA: CandleData[] = [
  k(98.75, 98.95, 98.47, 98.73), k(98.74, 99.3, 98.73, 99.02), k(98.88, 99.4, 98.88, 99.16), k(99.02, 99.75, 98.99, 99.36),
  k(99.19, 100.1, 99.19, 99.81), k(99.5, 101.0, 99.5, 100.36), k(99.93, 101.4, 99.93, 100.97), k(100.45, 101.3, 100.18, 100.77),
  k(100.61, 100.61, 99.7, 100.15), k(100.38, 100.38, 99.48, 99.82), k(100.1, 100.3, 99.58, 99.92),
];
const L219_REAL = L219_SEED_REAL.slice(1);
const L219_HA = L219_SEED_HA.slice(1);

/** Renko, box 0.50, 2-box reversal, from the closes 100.00, 100.30, 100.70, 101.20, 100.90, 100.40, 100.10, 99.80: three bricks. */
const L219_RENKO: CandleData[] = [k(100.0, 100.5, 100.0, 100.5), k(100.5, 101.0, 100.5, 101.0), k(100.5, 100.5, 100.0, 100.0)];

/** Eight candles; candle 5 opens at 100.95 with a low of 100.90, above candle 4's high of 100.42: a gap the line chart hides. */
const L219_GAP: CandleData[] = [
  k(100.0, 100.12, 99.95, 100.1), k(100.1, 100.25, 100.02, 100.2), k(100.2, 100.24, 100.05, 100.15), k(100.15, 100.42, 100.12, 100.35),
  k(100.95, 101.1, 100.9, 101.0), k(101.0, 101.18, 100.96, 101.1), k(101.1, 101.14, 100.98, 101.05), k(101.05, 101.3, 101.02, 101.25),
];

// ─── Lessons ────────────────────────────────────────────────────────────────

const lessons: Lesson[] = [
  // 2.1.1 · Measuring a candle against its neighbours
  {
    id: "2.1.1",
    title: "Measuring a candle against its neighbours",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 7,
    summary: "How the app sizes a candle against the 10 before it, and the names that follow: marubozu, spinning top, high-wave and doji.",
    objectives: [
      "Classify a candle's body as long, short or doji by comparing it with the last 10 candles.",
      "Identify a marubozu, a spinning top, a high-wave candle and the four doji types from open, high, low and close.",
      "Explain why the same candle can count as long in a calm market and short in a volatile one.",
    ],
    blocks: [],
    practice: [
      { kind: "mission", ref: "M01", label: "Read the Candle" },
      { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
    ],
    script: {
      unit: "2.1",
      courseId: "2.1.1",
      hook: {
        prompt: "This LABX [[candle]] opened at 100.00 and closed at 100.50. Is it a long candle?",
        control: {
          kind: "choice",
          choices: [
            { id: "long", label: "Long", feedback: "It might be. Next to quiet candles it's long; next to busy ones it's short." },
            { id: "short", label: "Short", feedback: "It might be. Next to busy candles it's short; next to quiet ones it's long." },
            { id: "cant", label: "Can't tell yet", feedback: "Right. Long or short depends on the candles around it." },
          ],
          answer: "cant",
        },
        figure: {
          kind: "chart",
          chart: { candles: [L211_X], describe: "One bullish candle: body from 100.00 to 100.50, wicks to 100.60 and 99.90." },
          steps: [{ text: "Open 100.00, close 100.50: a body of 0.50.", layers: [{ kind: "bracket", from: 100.0, to: 100.5, index: 0, label: "BODY 0.50" }] }],
        },
        compare: "You picked {yours}. After candles averaging a 0.20 body, 0.50 is long. After candles averaging 0.80, it's short.",
        concept: "candle-vocabulary",
      },
      learn: [
        {
          kind: "figure",
          title: "Measured against its neighbours",
          text: "The app never judges a [[body]] in vUSD alone. It compares it with the average body of the 10 candles before it.",
          figure: {
            kind: "chart",
            chart: { candles: L211_CALM, describe: "Ten quiet candles between 99.57 and 100.14, then a bullish candle from 100.00 to 100.50." },
            steps: [
              { text: "The last candle: a body of 0.50, from 100.00 to 100.50.", layers: [{ kind: "bracket", from: 100.0, to: 100.5, index: 10, label: "BODY 0.50" }] },
              { text: "The 10 candles before it: average body 0.20, average range 0.40.", layers: [{ kind: "zone", from: 100.0, to: 100.2, role: "concept", label: "AVERAGE BODY 0.20" }] },
              { text: "0.50 is 2.5 times the average body. Here it's a long candle.", layers: [{ kind: "marker", index: 10, at: "high", label: "LONG" }] },
            ],
          },
          concept: "candle-vocabulary",
        },
        {
          kind: "explain",
          title: "Same candle, busy market",
          text: "Now the same candle follows 10 busy candles whose bodies average 0.80 and whose ranges average 1.40. Its 0.50 body is below that average, so here it counts as short. A candle is long or short only against its neighbours.",
          figure: {
            kind: "chart",
            chart: { candles: L211_VOLATILE, describe: "Ten busy candles swinging between 99.36 and 101.14, then the same candle from 100.00 to 100.50." },
            steps: [{ text: "Same 0.50 body, after bodies averaging 0.80: now it's short.", layers: [{ kind: "marker", index: 10, at: "high", label: "SHORT" }] }],
          },
        },
        {
          kind: "explain",
          title: "The app's rules",
          text: "The app uses the TA-Lib defaults. **Long**: a body above the average of the last 10 bodies. **Very long**: over 3 times it. **Short**: below it. A [[doji]] has a body of at most 10% of the average range. A [[marubozu]] is long with almost no wicks; a [[spinning-top|spinning top]] is short with both wicks longer than the body.",
        },
        {
          kind: "hotspot",
          title: "Very long, compared with what?",
          prompt: "Tap the candle with a very long body: more than three times the average body of the 10 candles before it.",
          chart: { candles: L211_HOT, describe: "Eleven busy candles between 99.47 and 101.80, then twelve calmer ones between 100.99 and 101.66." },
          zones: [
            { id: "c6", label: "Candle 6", index: 5, feedback: "The tallest candle, 1.80 from high to low, but its body is only 0.10. Long and short are about the body, not the wicks." },
            { id: "c11", label: "Candle 11", index: 10, feedback: "The biggest body on the chart, 0.90, but the 10 candles before it averaged 0.70. That's about 1.3 times: long, not very long." },
            { id: "c22", label: "Candle 22", index: 21, feedback: "A 0.30 body against an average of about 0.13: about 2.3 times. Long, but not over three times." },
            { id: "c23", label: "Candle 23", index: 22 },
          ],
          answer: "c23",
          correct: "Right. A 0.50 body against an average of 0.15 for the 10 before it: 3.3 times. Small in vUSD, very long for its neighbours.",
          concept: "candle-vocabulary",
        },
        {
          kind: "predict",
          title: "Where does a doji start?",
          prompt: "On candles 11 to 50 the app's rule finds 4 doji: bodies at most 10% of the average range of the 10 candles before. Loosen it to 20%. How many doji now?",
          control: {
            kind: "choice",
            choices: [
              { id: "same", label: "Still 4: a doji is a doji", feedback: "The count depends on the cut-off. At 20% the same candles give 10." },
              { id: "few", label: "5 or 6: a few more", feedback: "More than that: 10. Plenty of small bodies sit just above the 10% line." },
              { id: "many", label: "About 10: more than double", feedback: "Right: 10. At 5% the rule finds only 2." },
            ],
            answer: "many",
          },
          figure: {
            kind: "chart",
            chart: { candles: L211_DOJI, describe: "Fifty candles drifting between 98.80 and 100.70, with markers above the doji found by each rule." },
            steps: [
              { text: "At 5% of the average range: 2 doji.", layers: dojiMarks([17, 49]) },
              { text: "At 10%, the app's default: 4 doji.", layers: dojiMarks([12, 19]) },
              { text: "At 20%: 10 doji. Same candles, different rule.", layers: dojiMarks([16, 20, 21, 26, 30, 35]) },
            ],
          },
          reveal: "2 at 5%, 4 at 10%, 10 at 20%. A doji count only means something next to its rule, so the app shows its thresholds as settings, not truths.",
          concept: "candle-vocabulary",
        },
        {
          kind: "match",
          title: "Name the shape",
          prompt: "Recent candles average a body of 0.30 and a range of 0.60. Match each candle to its name.",
          pairs: [
            { left: "Body 0.95 · wicks 0.02 and 0.04", right: "Marubozu", wrong: "A long body with both wicks under 0.06: one side held control all hour." },
            { left: "Body 0.10 · wicks 0.20 and 0.30", right: "Spinning top", wrong: "Short body, both wicks longer than it. Not high-wave: the 0.20 wick isn't over twice the body." },
            { left: "Body 0.08 · wicks 0.25 and 0.30", right: "High-wave candle", wrong: "Both wicks are over twice the 0.08 body, and the body is above the doji line of 0.06." },
            { left: "Body 0.04 · wicks 0.26 and 0.30", right: "Long-legged doji", wrong: "A body within 0.06 is a doji, and both wicks reach at least 0.24." },
            { left: "Body 0.02 · upper wick 0.00 · lower wick 0.40", right: "Dragonfly doji", wrong: "A doji with no upper wick and a long lower one: open and close at the high." },
            { left: "Body 0.03 · upper wick 0.45 · lower wick 0.01", right: "Gravestone doji", wrong: "A doji with a long upper wick and almost no lower one: open and close near the low." },
            { left: "Open = high = low = close", right: "Four-price doji", wrong: "No range at all: price never moved. A sign of a halted or very thin market." },
          ],
          correct: "Seven names, one measuring stick: the body and wicks against the recent averages.",
          concept: "candle-vocabulary",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "A name describes one hour; it doesn't predict the next. In Bulkowski's US stock data, white marubozu continued 56% of the time, spinning tops and dragonfly doji 50%, gravestone doji 51%. Marshall, Young and Rose (2006) tested 28 candle signals and found none that predicted price. As signals: grade D, unproven.",
        },
      ],
      task: {
        widget: "candle-builder",
        goal: "The last 10 candles average a body of 0.30 and a range of 0.60. Build a candle the app reads as a white marubozu: bullish, a body above 0.30, both wicks under 0.06.",
        start: { open: 100.0, high: 101.5, low: 99.2, close: 101.0 },
        success: {
          all: [
            { field: "direction", eq: "bullish" },
            { field: "body", gt: 0.3 },
            { field: "upperWick", lt: 0.06 },
            { field: "lowerWick", lt: 0.06 },
          ],
        },
        feedback: [
          { when: { not: { field: "direction", eq: "bullish" } }, text: "A white marubozu closes above its open. Move the close above {open:2}." },
          { when: { field: "body", lte: 0.3 }, text: "The body is {body:2}, not above the 0.30 average. Pull the close further from the open." },
          { when: { field: "upperWick", gte: 0.06 }, text: "The upper wick is {upperWick:2}. Bring the high down to the close." },
          { when: { field: "lowerWick", gte: 0.06 }, text: "The lower wick is {lowerWick:2}. Bring the low up to the open." },
        ],
        correct: "Right: a bullish body of {body:2} with wicks of {upperWick:2} and {lowerWick:2}. Buyers held the hour from open to close.",
        hints: [
          "Bullish first: the close must be above the open.",
          "The body must beat the 0.30 average, so put open and close at least 0.40 apart.",
          "Set the high equal to the close and the low equal to the open: both wicks become 0.00.",
        ],
        showMe: { open: 100.0, high: 100.5, low: 100.0, close: 100.5 },
        concept: "candle-vocabulary",
      },
      check: ["q-2.1.1-1", "q-2.1.1-2", "q-2.1.1-3"],
      recap: {
        takeaways: [
          "Long, short and doji are measured against the last 10 candles, never in vUSD alone.",
          "Marubozu, spinning top, high-wave and the doji types are set by body and wick sizes.",
          "The same 0.50 body is long in a calm market and short in a busy one.",
        ],
      },
    },
  },

  // 2.1.2 · Long shadows: hammers, shooting stars and their twins
  {
    id: "2.1.2",
    title: "Long shadows: hammers, shooting stars and their twins",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 7,
    summary: "Two long-shadow shapes, four names set by the trend before them, and what testing says about each.",
    objectives: [
      "Identify a hammer, hanging man, inverted hammer and shooting star from the candle's shape and the trend before it.",
      "Explain why one shape gets two names, and name the two whose tested behaviour contradicts the name.",
      "Compare each pattern's reversal rate with the 50% coin-flip line.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "reversal", label: "Arena: reversal" },
      { kind: "arena", ref: "bearish", label: "Arena: bearish" },
    ],
    script: {
      unit: "2.1",
      courseId: "2.1.2",
      hook: {
        prompt: "Out of 100 [[hammer|hammers]] after a decline, in how many does price break upward first?",
        control: {
          kind: "slider",
          min: 0,
          max: 100,
          step: 1,
          start: 50,
          answer: 60,
          tolerance: 5,
          feedback: [
            { from: 0, to: 45, text: "Lower than the data: in Bulkowski's count, 60 of 100 broke up first." },
            { from: 46, to: 74, text: "Close to the data: Bulkowski counted 60 of 100." },
            { from: 75, to: 100, text: "Higher than the data: 60 of 100, closer to a coin flip than most guess." },
          ],
        },
        compare: "You said {yours}. In Bulkowski's US stock data: 60 of 100. Close to a coin flip, and before costs.",
        concept: "rejection-candles",
      },
      learn: [
        {
          kind: "figure",
          title: "One shape, two names",
          text: "A [[wick]] is also called a shadow. A long lower shadow means price traded far below the open and closed back near the top.",
          figure: {
            kind: "chart",
            chart: { candles: L212_TWINS, describe: "A decline from 101.80 to a candle with a long lower shadow at 98.60, a rise to 101.50, and the same shape again at the top." },
            steps: [
              { text: "After a decline: a small body at the top, a long lower shadow. A hammer.", layers: [{ kind: "marker", index: 13, at: "low", label: "HAMMER" }] },
              { text: "After a rise: the same shape, 2.00 higher. A hanging man.", layers: [{ kind: "marker", index: 24, at: "low", label: "HANGING MAN" }] },
              { text: "Identical shapes. The trend before each one sets the name." },
            ],
          },
          concept: "rejection-candles",
        },
        {
          kind: "explain",
          title: "Four names, two shapes",
          text: "Long lower shadow, small body near the top: a [[hammer]] after a decline, a [[hanging-man|hanging man]] after a rise. Long upper shadow, small body near the bottom: an [[inverted-hammer|inverted hammer]] after a decline, a [[shooting-star|shooting star]] after a rise. Price-action traders call either shape a [[pin-bar|pin bar]].",
        },
        {
          kind: "worked",
          title: "Measure the shadow",
          lines: [
            "A hammer: open 99.40, high 99.55, low 98.60, close 99.50.",
            "Body: 99.50 − 99.40 = 0.10.",
            "Upper shadow: 99.55 − 99.50 = 0.05.",
            "Lower shadow: 99.40 − 98.60 = 0.80.",
            "Lower shadow ÷ body = 0.80 ÷ 0.10 = ?",
          ],
          ask: {
            answer: 8,
            tolerance: 0,
            unit: "×",
            feedback: [
              { value: 0.125, text: "That's body ÷ shadow. Put the shadow on top: 0.80 ÷ 0.10." },
              { value: 0.13, text: "That's body ÷ shadow. Put the shadow on top: 0.80 ÷ 0.10." },
              { value: 9, text: "That measures from the close, 0.90. The lower shadow starts at the bottom of the body, the open: 0.80." },
            ],
            correct: "Right: 8 times the body, far above the 2 the app asks for.",
          },
          after: "The app wants a lower shadow of at least 2 times the body (TA-Lib's default is 1; Bulkowski and Nison use 2) and an upper shadow under a tenth of the average range. A hammer with a lower shadow of 3 times the body or more is also called a [[takuri-line|takuri line]].",
          concept: "rejection-candles",
        },
        {
          kind: "hotspot",
          title: "Find the shooting star",
          prompt: "Tap the shooting star.",
          chart: { candles: L212_STAR, describe: "A decline to 99.35, a rise to 101.90, and several candles with long shadows along the way." },
          zones: [
            { id: "c14", label: "Candle 14", index: 13, feedback: "This one follows a decline. A long upper shadow there makes an inverted hammer, not a shooting star." },
            { id: "c21", label: "Candle 21", index: 20, feedback: "Its long shadow is below the body. After a rise, that's a hanging man." },
            { id: "c25", label: "Candle 25", index: 24, feedback: "Its upper shadow, 0.45, isn't twice its 0.40 body, and that body is long. Not a star." },
            { id: "c29", label: "Candle 29", index: 28 },
          ],
          answer: "c29",
          correct: "Right. After a rise: a 0.10 body near the low, an upper shadow of 0.85, 8.5 times the body, and a lower one of 0.03.",
          concept: "rejection-candles",
        },
        {
          kind: "match",
          title: "Shape plus trend",
          prompt: "Match each shape and the trend before it to its name.",
          pairs: [
            { left: "Long lower shadow, after a decline", right: "Hammer", wrong: "Lower shadow plus a decline: the hammer." },
            { left: "Long lower shadow, after a rise", right: "Hanging man", wrong: "The hammer's shape, but after a rise: a hanging man." },
            { left: "Long upper shadow, after a decline", right: "Inverted hammer", wrong: "Upper shadow plus a decline: the inverted hammer." },
            { left: "Long upper shadow, after a rise", right: "Shooting star", wrong: "Upper shadow plus a rise: the shooting star." },
          ],
          correct: "Two shapes, four names. The trend before the candle picks the name.",
          concept: "rejection-candles",
        },
        {
          kind: "predict",
          title: "Names that point the wrong way",
          prompt: "Textbooks call the hanging man bearish. In Bulkowski's tests, what did price usually do after one?",
          control: {
            kind: "choice",
            choices: [
              { id: "fell", label: "Fell, as the name says", feedback: "Less often than not: price kept rising about 59% of the time." },
              { id: "rose", label: "Kept rising", feedback: "Right: about 59% of the time. A continuation, not a reversal." },
              { id: "even", label: "Exactly 50/50", feedback: "Not quite: it leaned the other way, about 59% up." },
            ],
            answer: "rose",
          },
          figure: {
            kind: "bars",
            unit: "%",
            bars: [
              { label: "Hammer", value: 60, role: "up" },
              { label: "Shooting star", value: 59, role: "down" },
              { label: "Hanging man", value: 41, role: "neutral" },
              { label: "Inverted hammer", value: 35, role: "neutral" },
            ],
            steps: ["Share of cases that broke the way each name points.", "Hanging man and inverted hammer sit well under 50%: they mostly did the opposite."],
          },
          reveal: "Two of the four names point the wrong way. After a hanging man, price kept rising about 59% of the time; after an inverted hammer, it kept falling about 65%. Source: Bulkowski, US stocks, daily charts.",
          concept: "rejection-candles",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "Grade D for all four as reversal signals. The hammer's 60% (rank 65 of 103) comes from US stocks on daily charts, about 1990 to 2010, before costs. It doesn't transfer to LABX on 1H. A bullish [[belt-hold|belt hold]] scores 71% yet ranks only 62: part of the move has already happened.",
        },
        {
          kind: "hotspot",
          title: "Hunt the hammer",
          prompt: "Several candles here have long lower shadows. Only one passes every hammer rule. Tap it.",
          chart: { candles: L212_TRY, describe: "Fifty-two candles: three declines with bounces, a low near 96.86, then a rise to 100.07." },
          zones: [
            { id: "c14", label: "Candle 14", index: 13, feedback: "Lower shadow under 2 times the body: 0.30 against a 0.20 body." },
            { id: "c27", label: "Candle 27", index: 26, feedback: "Upper shadow too long: 0.16, more than a tenth of the average range, about 0.05 here." },
            { id: "c35", label: "Candle 35", index: 34, feedback: "Body not near the previous candle's low: it sits at 98.11 to 98.21, while that low is 97.66." },
            { id: "c38", label: "Candle 38", index: 37 },
            { id: "c50", label: "Candle 50", index: 49, feedback: "No decline before it: it follows a rise. There, this shape is a hanging man." },
          ],
          answer: "c38",
          correct: "Right: after a decline, a 0.10 body near the previous low, a lower shadow of 0.75 and an upper shadow of 0.04.",
          concept: "rejection-candles",
        },
      ],
      check: ["q-2.1.2-1", "q-2.1.2-2", "q-2.1.2-3"],
      recap: {
        takeaways: [
          "Hammer, hanging man, inverted hammer, shooting star: two shapes, named by the trend before them.",
          "The hanging man and the inverted hammer mostly did the opposite of their names in testing.",
          "Hammer 60%, shooting star 59%: close to a coin flip, before costs, in US stocks.",
        ],
      },
    },
  },

  // 2.1.3 · Context first: trend, location, confirmation
  {
    id: "2.1.3",
    title: "Context first: trend, location, confirmation",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 8,
    summary: "Three checks that decide whether a candle pattern counts, what waiting for confirmation costs, and what the same rule does on a random walk.",
    objectives: [
      "Apply three context checks (prior trend, location at a zone, a confirming close) to accept or reject a candle pattern.",
      "Calculate how waiting for confirmation changes the entry, the stop distance, the size and the reward-to-risk.",
      "Compare a pattern's results on a random-walk market with its results in context, using the tally lab.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "reversal", label: "Arena: reversal" },
      { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
    ],
    script: {
      unit: "2.1",
      courseId: "2.1.3",
      hook: {
        prompt: "Two identical [[hammer|hammers]]. A forms after a 10-candle decline, at a support zone. B forms in the middle of a sideways range. Which would you trade?",
        control: {
          kind: "choice",
          choices: [
            { id: "a-now", label: "A, now", feedback: "A has context, but nothing has confirmed it yet. Waiting one candle costs price and buys evidence." },
            { id: "a-confirmed", label: "A, after the next candle confirms", feedback: "Right. Context first, then a close above the hammer's high." },
            { id: "b", label: "B", feedback: "B has nothing to reverse and no zone under it. It fails two checks." },
            { id: "both", label: "Both", feedback: "Same shape, different context. B fails two of the three checks." },
          ],
          answer: "a-confirmed",
        },
        compare: "You picked {yours}. Hammer A passes the trend and zone checks, and one more close confirms it. Hammer B fails both.",
        concept: "pattern-context",
      },
      learn: [
        {
          kind: "explain",
          title: "Three checks",
          text: "Before a reversal pattern counts, run three checks. Something to reverse: a decline before a bullish pattern. Location: its low at a [[support]] zone. [[confirmation|Confirmation]]: the next candle closes above the pattern's high. A bearish pattern mirrors all three: a rise, a [[resistance]] zone, a close below its low.",
        },
        {
          kind: "figure",
          title: "Run hammer A through the checks",
          text: "Hammer A has just closed. Choose a branch at each check.",
          figure: {
            kind: "flow",
            start: "n1",
            interactive: true,
            nodes: [
              { id: "n1", text: "Something to reverse?", kind: "question", yes: "n2", no: "skip-trend", correct: "yes", explain: "Ten falling candles came before it: yes." },
              { id: "n2", text: "At a zone?", kind: "question", yes: "n3", no: "skip-zone", correct: "yes", explain: "Its low, 98.60, sits in the support zone that held twice before: yes." },
              { id: "n3", text: "Confirmed?", kind: "question", yes: "trade", no: "wait", correct: "no", explain: "Not yet. The candle that could confirm it hasn't closed." },
              { id: "skip-trend", text: "Skip: nothing to reverse", kind: "end" },
              { id: "skip-zone", text: "Skip: not at a zone", kind: "end" },
              { id: "trade", text: "Plan the trade", kind: "end" },
              { id: "wait", text: "Wait for the next close", kind: "end" },
            ],
            steps: ["A 10-candle decline: something to reverse.", "Low at 98.60, inside the support zone.", "No close above 99.55 yet: wait one candle."],
          },
          concept: "pattern-context",
        },
        {
          kind: "figure",
          title: "Hammer A in context",
          figure: {
            kind: "chart",
            chart: { candles: L213_CHART, describe: "Lows near 98.60 twice, a rally to 101.50, a 10-candle decline to a hammer at 98.60, then a close at 99.90." },
            steps: [
              { text: "Support: lows near 98.60 held twice before.", layers: [{ kind: "zone", from: 98.55, to: 98.7, role: "support", label: "SUPPORT" }] },
              {
                text: "A 10-candle decline from 101.50 ends in hammer A, at the zone.",
                layers: [
                  { kind: "level", price: 101.5, role: "resistance", label: "RESISTANCE 101.50" },
                  { kind: "marker", index: 24, at: "low", label: "HAMMER A" },
                ],
              },
              { text: "The next candle closes at 99.90, above the hammer's high of 99.55: confirmed.", layers: [{ kind: "marker", index: 25, at: "close", label: "CLOSE 99.90" }] },
            ],
          },
          concept: "pattern-confirmation",
        },
        {
          kind: "worked",
          title: "What confirmation costs",
          lines: [
            "Risk budget 100.00 vUSD, before costs. Stop 98.50, 0.10 under the low. Target: resistance at 101.50.",
            "At the hammer's close: buy at the ask, 99.55. Risk 1.05 a unit, 95 units, reward 1.95: R:R 1.86.",
            "After confirmation: buy at 99.95. Risk 1.45 a unit, 68 units.",
            "Reward: 101.50 − 99.95 = 1.55. R:R = 1.55 ÷ 1.45 = ?",
          ],
          ask: {
            answer: 1.07,
            tolerance: 0.01,
            feedback: [
              { value: 1.86, text: "That's the early entry. After confirmation the entry is 99.95: reward 1.55, risk 1.45." },
              { value: 0.94, text: "That's risk ÷ reward. Put the reward on top: 1.55 ÷ 1.45." },
            ],
            correct: "Right: 1.07. Waiting cost 0.40 of price, 27 units of size and most of the reward-to-risk.",
          },
          after: "Confirmation filters out some failures but worsens the entry. Compare the two by [[expectancy]] after costs, never by win rate alone.",
          concept: "pattern-confirmation",
        },
        {
          kind: "predict",
          title: "The same rule on a random walk",
          prompt: "We ran the app's hammer rule on 3,000 [[random-walk|random-walk]] paths of 200 candles. After each hammer, how often was price higher 10 candles later?",
          control: {
            kind: "slider",
            min: 0,
            max: 100,
            step: 1,
            unit: "%",
            start: 50,
            answer: 49,
            tolerance: 5,
            feedback: [
              { from: 0, to: 43, text: "Lower than it was: about half." },
              { from: 44, to: 54, text: "Right: about half." },
              { from: 55, to: 100, text: "Higher than it was: about half, like any candle." },
            ],
          },
          figure: {
            kind: "bars",
            unit: "%",
            bars: [
              { label: "After 5,288 hammers", value: 48.6, role: "concept" },
              { label: "After any of 510,000 candles", value: 49.6, role: "neutral" },
            ],
            steps: ["Share with price higher 10 candles later."],
          },
          reveal: "48.6% after 5,288 hammers, give or take 1.3 points; 49.6% after any candle. On a random walk the past carries no information, so no shape beats half. Any edge has to come from the market, not from the shape.",
          concept: "base-rates",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "Does context help in real markets? The evidence is mixed: grade C. Bulkowski advises trading bullish patterns in a rising primary trend; CMT texts want them at support or resistance. Caginalp and Laurent (1998) found an effect; Marshall et al. (2006) found none. No clean test of the context filters exists.",
        },
        {
          kind: "match",
          title: "Trade or skip?",
          prompt: "Sort each pattern: trade it, or skip it and name the check it fails.",
          pairs: [
            { left: "Hammer after a 10-candle decline, low at support; next close above its high", right: "Trade: all three checks pass", wrong: "A decline, a zone and a confirming close: all three pass." },
            { left: "Hammer after six sideways candles, low at support; next close above its high", right: "Skip: no prior trend", wrong: "Sideways candles give nothing to reverse, however good the zone." },
            { left: "Shooting star after a 12-candle rise, halfway between two zones; next close below its low", right: "Skip: not at a zone", wrong: "A rise and a confirming close, but no zone at its high." },
            { left: "Bullish engulfing after a decline, at support; next candle closes below its low", right: "Skip: not confirmed", wrong: "The next close went the wrong way: no confirmation." },
            { left: "Shooting star after a rise, high at resistance; next close below its low", right: "Trade: all three checks pass", wrong: "A rise, a resistance zone and a confirming close: all three pass." },
            { left: "Hammer after a decline, in open space above support; next close above its high", right: "Skip: not at a zone", wrong: "Its low is in open space, not at the zone." },
          ],
          correct: "Each skip names its missing check. Written down, it stops you trading a shape without its context.",
          concept: "pattern-context",
        },
      ],
      check: ["q-2.1.3-1", "q-2.1.3-2", "q-2.1.3-3"],
      recap: {
        takeaways: [
          "Three checks before any reversal pattern: something to reverse, a zone, and a confirming close.",
          "Waiting for confirmation moved the entry from 99.55 to 99.95 and R:R from 1.86 to 1.07.",
          "On a random walk the hammer rule did no better than any candle: about 50%.",
        ],
      },
    },
  },
  // 2.1.4 · Engulfing and harami
  {
    id: "2.1.4",
    title: "Engulfing and harami",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 7,
    summary: "Two-candle patterns read from real bodies only, how they relate to inside and outside bars, and why a high hit rate can still rank low.",
    objectives: [
      "Identify bullish and bearish engulfing patterns from the real bodies only, ignoring shadows.",
      "Identify a harami and a harami cross, and relate them to the inside bar.",
      "Explain how a pattern can reverse 79% of the time and still rank 91st of 103.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "reversal", label: "Arena: reversal" },
      { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
    ],
    script: {
      unit: "2.1",
      courseId: "2.1.4",
      hook: {
        prompt: "Bearish [[engulfing-pattern|engulfing patterns]] reverse price about 79% of the time. Where do they rank among 103 candle patterns for overall performance?",
        control: {
          kind: "choice",
          choices: [
            { id: "top", label: "Top 10", feedback: "A high hit rate doesn't make a top performer. It ranks 91st." },
            { id: "middle", label: "Middle", feedback: "Lower: 91st of 103." },
            { id: "bottom", label: "Bottom 15", feedback: "Right: 91st of 103." },
          ],
          answer: "bottom",
        },
        compare: "You picked {yours}. Rank 91 of 103: the turns are frequent, but the moves after them are small.",
        concept: "engulfing-pattern",
      },
      learn: [
        {
          kind: "figure",
          title: "Bodies only",
          text: "A bullish [[engulfing-pattern|engulfing pattern]]: after a decline, a bearish candle, then a bullish one whose body covers the first body. Only the real bodies, open to close, are compared.",
          figure: {
            kind: "chart",
            chart: { candles: L214_ENGULF, describe: "A six-candle decline from 102.40, a bearish candle from 101.00 to 100.20 with a wick to 101.30, then a bullish candle from 100.10 to 101.10." },
            steps: [
              { text: "Candle 1: a bearish body from 101.00 down to 100.20.", layers: [{ kind: "bracket", from: 100.2, to: 101.0, index: 6, label: "BODY 1" }] },
              { text: "Candle 2 opens at 100.10 and closes at 101.10. Its body covers body 1.", layers: [{ kind: "bracket", from: 100.1, to: 101.1, index: 7, label: "BODY 2" }] },
              { text: "Candle 1's wick reaches 101.30, above candle 2's close. Wicks don't count.", layers: [{ kind: "marker", index: 6, at: "high", label: "101.30" }] },
            ],
          },
          concept: "engulfing-pattern",
        },
        {
          kind: "explain",
          title: "The rules",
          text: "Bullish engulfing: candle 2 opens at or below candle 1's close and closes at or above its open, with at least one end strictly beyond. A bearish engulfing mirrors it after a rise. A [[harami]] is the reverse: a small body inside the previous long body. If the small one is a doji, it's a [[harami-cross|harami cross]].",
        },
        {
          kind: "predict",
          title: "A tie at one end",
          prompt: "Candle 1 falls from 101.00 to 100.20. Candle 2 opens exactly at 100.20 and closes at 101.10. Is it a bullish engulfing?",
          control: {
            kind: "choice",
            choices: [
              { id: "edge", label: "Yes, as an edge case", feedback: "Right. One strict end, 101.10 above 101.00, is enough." },
              { id: "no", label: "No: it must open below 100.20", feedback: "The rule needs one strict end, not two. The close, 101.10, clears 101.00." },
              { id: "wicks", label: "Only if its wicks cover candle 1", feedback: "Wicks don't count in an engulfing. Bodies only." },
            ],
            answer: "edge",
          },
          reveal: "The bottoms tie at 100.20 and the top is strict: 101.10 above 101.00. The app accepts it and labels it an edge case; TA-Lib scores it 80 instead of 100.",
          concept: "engulfing-pattern",
        },
        {
          kind: "match",
          title: "Body or range?",
          prompt: "Match each description to its name.",
          pairs: [
            { left: "Second body covers the first, opposite-coloured body", right: "Engulfing pattern", wrong: "Body over body, opposite colours: an engulfing." },
            { left: "Small second body inside the first, long body", right: "Harami", wrong: "Body inside body: a harami, the engulfing turned around." },
            { left: "A harami whose second candle is a doji", right: "Harami cross", wrong: "When the small body is a doji, the harami becomes a harami cross." },
            { left: "Second candle's high and low inside the first one's range", right: "Inside bar", wrong: "Whole range inside whole range: a price-action inside bar." },
            { left: "Second candle's range covers the first one's range", right: "Outside bar", wrong: "Range over range, whatever the bodies: an outside bar." },
          ],
          correct: "Candle patterns compare bodies; price-action bars compare ranges. A harami is often an inside bar, but not always. Inside and outside bars return in lesson 2.6.3.",
          concept: "harami-pattern",
        },
        {
          kind: "worked",
          title: "79% and still near the bottom",
          lines: [
            "Suppose 100 trades: 79 winners and 21 losers.",
            "After costs, each winner makes +0.20R and each loser loses 1R.",
            "Winners: 79 × 0.20 = +15.80R. Losers: 21 × 1 = −21.00R.",
            "Expectancy per trade = (15.80 − 21.00) ÷ 100 = ?",
          ],
          ask: {
            answer: -0.052,
            tolerance: 0.001,
            unit: "R",
            feedback: [
              { value: 0.79, text: "That's the win rate. Expectancy weighs each outcome by its size." },
              { value: -5.2, text: "That's the total for 100 trades. Divide by 100 for one trade." },
            ],
            correct: "Right: −0.052R per trade. A 79% hit rate with small wins still loses.",
          },
          after: "The numbers are an illustration. Bulkowski ranks patterns by overall performance, not hit rate: a pattern that turns often but moves little ranks low, and costs eat what's left.",
          concept: "expectancy",
        },
        {
          kind: "predict",
          title: "Two numbers, one tally",
          prompt: "We ran the app's bullish engulfing rule on 3,000 [[random-walk|random-walk]] paths. Price closed above the pattern's high before its low 69% of the time. What was the average result per trade, after costs?",
          control: {
            kind: "choice",
            choices: [
              { id: "positive", label: "Clearly positive: 69% is a big edge", feedback: "Negative: −0.34R a trade. The 69% counts direction, not how far price went." },
              { id: "zero", label: "About zero", feedback: "That was before costs: about +0.04R. After the spread and commission, −0.34R." },
              { id: "negative", label: "Negative", feedback: "Right: −0.34R a trade, after costs." },
            ],
            answer: "negative",
          },
          figure: {
            kind: "bars",
            unit: "%",
            bars: [
              { label: "Closed above the high first", value: 69, role: "up" },
              { label: "Made money after costs", value: 30, role: "down" },
            ],
            steps: ["About 22,500 random-walk patterns, measured two ways.", "Average result after costs: −0.34R a trade."],
          },
          reveal: "Candle 2 closes near the pattern's high, so a close above it needs only a small rise. The stop sits under the low, and only 30% of trades made money after costs. Before costs the average was about +0.04R. A direction rate alone hides all of this.",
          concept: "engulfing-pattern",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "Grade C for engulfing: bullish 63% (rank 84 of 103), bearish 79% (rank 91). Bulkowski advises against bullish engulfing in a falling primary trend and favours it on pullbacks in an uptrend; Marshall et al. (2006) found no effect. Harami: 53% (rank 38), grade D. Harami cross: no statistics.",
        },
        {
          kind: "hotspot",
          title: "Hunt the engulfing",
          prompt: "Four candles here look like a bullish engulfing. Only one passes the rule: bodies only, after a decline. Tap it.",
          chart: { candles: L214_TRY, describe: "Fifty-one candles: three declines from 103.40 to 98.25, each ending in a bullish candle, then a rise to 101.48." },
          zones: [
            { id: "c15", label: "Candle 15", index: 14, feedback: "The wicks cover candle 14, but the body, 100.30 to 100.90, sits inside candle 14's body, 100.20 to 101.00. An outside bar, not an engulfing." },
            { id: "c25", label: "Candle 25", index: 24, feedback: "The close clears 99.80, but the body opens at 99.40, above candle 24's close of 99.30. Only the wick covers the bottom." },
            { id: "c35", label: "Candle 35", index: 34 },
            { id: "c49", label: "Candle 49", index: 48, feedback: "The bodies engulf, but it comes after a rise. A bullish engulfing needs a decline to reverse." },
          ],
          answer: "c35",
          correct: "Right: after a decline, a body from 98.35 to 99.00 that covers candle 34's body, 98.40 to 98.90.",
          concept: "engulfing-pattern",
        },
      ],
      check: ["q-2.1.4-1", "q-2.1.4-2", "q-2.1.4-3"],
      recap: {
        takeaways: [
          "An engulfing compares real bodies only: body 2 must cover body 1. Wicks don't count.",
          "A harami is a small body inside the last body; an inside bar compares whole ranges.",
          "A high hit rate with small moves can rank low and lose after costs.",
        ],
      },
    },
  },

  // 2.1.5 · Piercing, dark cloud and the penetration scale
  {
    id: "2.1.5",
    title: "Piercing, dark cloud and the penetration scale",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 8,
    summary: "Five two-candle patterns that differ only in how deep the second candle closes into the first, plus tweezers and kickers.",
    objectives: [
      "Measure how far a second candle closes into the first candle's body, as a share of that body.",
      "Name the pattern at each depth: on-neck, in-neck, thrusting, piercing, engulfing.",
      "Identify tweezers and kickers, and state what the data says about each.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "bullish", label: "Arena: bullish" },
      { kind: "arena", ref: "reversal", label: "Arena: reversal" },
    ],
    script: {
      unit: "2.1",
      courseId: "2.1.5",
      hook: {
        prompt: "A long bearish candle ran from 101.00 down to 100.00. The next candle opens at 99.70. Where must it close before you'd call it bullish?",
        control: { kind: "slider", min: 99.8, max: 101.2, step: 0.01, start: 100.2, answer: 100.5 },
        compare: "You chose {yours}. Textbooks want a close above 100.50, the middle of the first body: a piercing line. Below that, the names mean bearish continuation.",
        concept: "penetration-patterns",
      },
      learn: [
        {
          kind: "figure",
          title: "One scale, five names",
          text: "These patterns differ only in how deep candle 2 closes into candle 1's body. Here candle 1 is long: a 1.00 body against a 0.50 average.",
          figure: {
            kind: "chart",
            chart: { candles: L215_SCALE, visible: 11, describe: "A ten-candle decline from 104.50, a long bearish candle from 101.00 to 100.00, then a bullish candle opening at 99.70 and closing at 100.70." },
            steps: [
              {
                text: "Candle 1's body runs from 101.00 down to 100.00. Its middle is 100.50.",
                layers: [
                  { kind: "bracket", from: 100.0, to: 101.0, index: 10, label: "BODY 1.00" },
                  { kind: "level", price: 100.5, role: "neutral", label: "MIDDLE 100.50" },
                ],
              },
              { text: "Candle 2 opens at 99.70, below candle 1's low of 99.90.", visible: 12, layers: [{ kind: "marker", index: 11, at: "open", label: "OPEN 99.70" }] },
              { text: "Where it closes picks the name. This one, at 100.70, is a piercing line.", layers: L215_BANDS },
            ],
          },
          concept: "penetration-patterns",
        },
        {
          kind: "worked",
          title: "Measure the depth",
          lines: [
            "Depth = (close 2 − close 1) ÷ body 1.",
            "Body 1: 101.00 − 100.00 = 1.00.",
            "Candle 2 closes at 100.35: (100.35 − 100.00) ÷ 1.00 = ? %",
          ],
          ask: {
            answer: 35,
            tolerance: 0.5,
            unit: "%",
            feedback: [
              { value: 0.35, text: "Right depth, as a fraction. As a percentage: 35%." },
              { value: 65, text: "That measures down from the open. Measure up from candle 1's close, 100.00, to 100.35." },
            ],
            correct: "Right: 35%, short of halfway.",
          },
          after: "35% is below the middle, so this is a [[thrusting-line|thrusting line]], which theory reads as bearish continuation. Past 50% it would be a [[piercing-line|piercing line]], read as a bullish reversal.",
          concept: "penetration-patterns",
        },
        {
          kind: "callout",
          tone: "info",
          text: "The scale for this candle: [[on-neck-line|on-neck]] 99.85–99.95, a strip with no name 99.96–99.99, [[in-neck-line|in-neck]] 100.00–100.05, thrusting 100.06–100.50, piercing 100.51–100.99, engulfing from 101.00. Theory flips from bearish to bullish between 100.50 and 100.51. The market doesn't know the names.",
        },
        {
          kind: "explain",
          title: "The mirror: dark cloud cover",
          text: "After a rise, the [[dark-cloud-cover|dark cloud cover]] mirrors the piercing line: candle 2 opens above candle 1's high and closes below the middle of its bullish body. Bulkowski: piercing 64% (rank 13 of 103), dark cloud about 60% (rank 22). Grade C, mixed. On-neck, in-neck and thrusting: no statistics taken.",
        },
        {
          kind: "hotspot",
          title: "Tweezers",
          prompt: "A tweezer bottom: after a decline, two neighbouring candles with lows within 5% of the average range of the last 5 candles, about 0.025 here. Tap the second candle of the real one.",
          chart: { candles: L215_TWEEZERS, describe: "Forty-three candles: a decline from 103.40 to 99.20 with a bounce, then a rise to 101.69." },
          zones: [
            { id: "c16", label: "Candle 16", index: 15, feedback: "Lows 100.40 and 100.28: 0.12 apart, over four times the tolerance." },
            { id: "c30", label: "Candle 30", index: 29 },
            { id: "c42", label: "Candle 42", index: 41, feedback: "Equal lows, 101.05 twice, but after a rise. A tweezer bottom needs a decline before it." },
          ],
          answer: "c30",
          correct: "Right: lows 99.20 and 99.22, 0.02 apart, after a decline. In the data it barely matters: price kept falling after 52% of [[tweezers]] bottoms, rank 44.",
        },
        {
          kind: "predict",
          title: "The kicker",
          prompt: "A popular claim: the [[kicker]] is 'one of the most powerful candle signals'. Bulkowski: 53% in the expected direction, rank 96 of 103, and one of the rarest patterns. How do you file it?",
          control: {
            kind: "choice",
            choices: [
              { id: "strong", label: "Strong signal: trade it", feedback: "53% is near a coin flip, and the rarity means few cases to judge." },
              { id: "unproven", label: "Unproven: near a coin flip, too rare to test well", feedback: "Right. A loud claim, quiet data." },
              { id: "reverse", label: "Trade it the other way round", feedback: "53% leans slightly the named way; there's no case for flipping it either." },
            ],
            answer: "unproven",
          },
          reveal: "Grade D. The kicker ranks 96 of 103 for performance and 100 of 103 for frequency: rare and close to 50%. A claim this loud needs data, and here the data say little.",
        },
        {
          kind: "predict",
          title: "Make it thrusting",
          prompt: "Candle 1: 101.00 down to 100.00, low 99.90. Candle 2 opens at 99.70. Set candle 2's close so the pair is a thrusting line.",
          control: { kind: "slider", min: 99.7, max: 101.2, step: 0.01, start: 99.8, answer: 100.28, tolerance: 0.22, feedback: L215_SCALE_FEEDBACK },
          reveal: "A thrusting line closes from 100.06 to 100.50: into the body, but not past its middle. Theory reads it as bearish continuation.",
          concept: "penetration-patterns",
        },
        {
          kind: "predict",
          title: "Now make it piercing",
          prompt: "Same two candles. Move candle 2's close so the pair becomes a piercing line.",
          control: { kind: "slider", min: 99.7, max: 101.2, step: 0.01, start: 100.28, answer: 100.75, tolerance: 0.24, feedback: L215_SCALE_FEEDBACK },
          reveal: "A piercing line closes from 100.51 to 100.99: past the middle, below the top. One cent separates it from a thrusting line, and the theory flips from bearish to bullish.",
          concept: "penetration-patterns",
        },
      ],
      check: ["q-2.1.5-1", "q-2.1.5-2", "q-2.1.5-3"],
      recap: {
        takeaways: [
          "Depth = (close 2 − close 1) ÷ body 1; a close at 100.70 is 70% in.",
          "On-neck, in-neck, thrusting, piercing, engulfing: one scale, and theory flips at the middle.",
          "Piercing 64%, dark cloud 60%; tweezers and kickers sit near a coin flip.",
        ],
      },
    },
  },

  // 2.1.6 · Stars, doji stars and abandoned babies
  {
    id: "2.1.6",
    title: "Stars, doji stars and abandoned babies",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 7,
    summary: "Three-candle turns with a small, gapped middle candle, where candle 3 must close, and what happens to the rule on markets that rarely gap.",
    objectives: [
      "Identify a morning star and an evening star, including the gap and where the third candle must close.",
      "Tell a star, a doji star and an abandoned baby apart by the middle candle and its gaps.",
      "Explain how relaxing the gap rule on markets that rarely gap changes the statistics.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "reversal", label: "Arena: reversal" },
      { kind: "mission", ref: "M01", label: "Read the Candle" },
    ],
    script: {
      unit: "2.1",
      courseId: "2.1.6",
      hook: {
        prompt: "Candle 1 fell from 102.00 to 101.00. Candle 2 is a small star below it. Where must candle 3 close to complete a [[morning-star|morning star]]?",
        control: { kind: "slider", min: 100.8, max: 102.2, step: 0.01, start: 101.1, answer: 101.5 },
        compare: "You chose {yours}. Bulkowski wants at least 101.50, the middle of candle 1's body. TA-Lib's default accepts any close above 101.30.",
        concept: "star-patterns",
      },
      learn: [
        {
          kind: "figure",
          title: "A morning star",
          text: "Three candles: a long one down, a small 'star' that gaps away, and a strong one back up. Candlestick traders call a gap a [[window]].",
          figure: {
            kind: "chart",
            chart: { candles: L216_STAR, visible: 14, describe: "A decline from 105.60, a long bearish candle from 102.00 to 101.00, a small candle near 100.70, then a bullish candle to 101.60." },
            steps: [
              { text: "Candle 1: a long bearish body, 102.00 to 101.00, after a decline.", layers: [{ kind: "bracket", from: 101.0, to: 102.0, index: 13, label: "BODY 1.00" }] },
              { text: "Candle 2: a small body, 100.80 to 100.70, gapped below candle 1's close.", visible: 15, layers: [{ kind: "zone", from: 100.8, to: 101.0, role: "concept", label: "WINDOW" }] },
              { text: "Candle 3 closes at 101.60, above 101.50, the middle of candle 1's body.", visible: 16, layers: [{ kind: "level", price: 101.5, role: "neutral", label: "MIDDLE 101.50" }] },
            ],
          },
          concept: "star-patterns",
        },
        {
          kind: "explain",
          title: "Star, doji star, abandoned baby",
          text: "Make the small middle body a [[doji]] and it's a morning [[doji-star|doji star]]. If that doji gaps beyond both neighbours' wicks, its high below both their lows, it's an [[abandoned-baby|abandoned baby]]. An [[evening-star|evening star]] mirrors all of this at a top. Three doji in a row, the middle one gapped, make a [[tri-star]].",
        },
        {
          kind: "match",
          title: "Which star?",
          prompt: "Match each middle candle to the pattern it makes.",
          pairs: [
            { left: "A small body, gapped below candle 1's close", right: "Morning star", wrong: "A small body with a body gap: the plain star." },
            { left: "A doji whose body gaps below candle 1's close, wicks overlapping", right: "Morning doji star", wrong: "A doji with a body gap but touching wicks: a doji star." },
            { left: "A doji whose high is below both neighbours' lows", right: "Abandoned baby", wrong: "Gaps beyond the wicks on both sides: the abandoned baby." },
            { left: "A doji between two other doji, gapped from both", right: "Tri-star", wrong: "Three doji, the middle one gapped: a tri-star." },
          ],
          correct: "The middle candle and its gaps decide. The bigger the gaps, the rarer the pattern.",
          concept: "star-patterns",
        },
        {
          kind: "predict",
          title: "No gaps, no stars",
          prompt: "On a market that trades around the clock, each candle opens where the last one closed. We ran the strict morning-star rule on 3,000 [[random-walk|random-walk]] paths like that. How many did it find?",
          control: {
            kind: "choice",
            choices: [
              { id: "none", label: "None", feedback: "Right. Without gaps, the middle body can't sit below candle 1's close." },
              { id: "hundreds", label: "A few hundred", feedback: "None at all: the rule needs a gap that a continuous market never makes." },
              { id: "thousands", label: "Thousands", feedback: "None: every candle opened at the last close, so no body gap appeared." },
            ],
            answer: "none",
          },
          figure: {
            kind: "bars",
            unit: "stars",
            bars: [
              { label: "Strict gap rule", value: 0, role: "neutral" },
              { label: "Gap rule relaxed", value: 1904, role: "concept" },
            ],
            steps: ["Relax the rule so the middle body may start at candle 1's close: 1,904 stars appear."],
          },
          reveal: "Zero with the strict rule, 1,904 once the middle body may touch candle 1's close. A relaxed star is a different, commoner pattern: Bulkowski's rates came from gapping daily stocks and don't carry over. Here, price was higher 10 candles later after 49.2% of them.",
          concept: "star-patterns",
        },
        {
          kind: "worked",
          title: "Where candle 3 must close",
          lines: [
            "An evening star after a rise. Candle 1: bullish, 100.40 to 101.20.",
            "Body 1: 101.20 − 100.40 = 0.80.",
            "Bulkowski's rule: candle 3 closes at or below the middle of body 1.",
            "Middle = (100.40 + 101.20) ÷ 2 = ?",
          ],
          ask: {
            answer: 100.8,
            tolerance: 0,
            feedback: [
              { value: 0.8, text: "That's the body's size. The middle is a price: halfway between 100.40 and 101.20." },
              { value: 100.96, text: "That's TA-Lib's looser line, 101.20 − 0.3 × 0.80. Bulkowski's rule uses the middle." },
            ],
            correct: "Right: candle 3 must close at 100.80 or lower.",
          },
          after: "TA-Lib's default only asks for a close below 101.20 − 0.3 × 0.80 = 100.96. Two common rules, two different pattern counts.",
          concept: "star-patterns",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "Grade C, mixed. Bulkowski: morning star 78% (rank 12), evening star 72% (rank 4 of 103), morning doji star 76% (rank 8), bullish abandoned baby 70% (rank 9) but rare. Part of each rate is built in: candle 3 is already the start of the move. Caginalp and Laurent (1998) found three-day reversals useful; Marshall et al. (2006) didn't.",
        },
      ],
      task: {
        widget: "candle-builder",
        goal: "Candle 1 fell from 102.00 to 101.00; candle 2 is a doji at 100.70. Recent bodies average 0.40. Build candle 3 so the three make a morning doji star by Bulkowski's rule.",
        start: { open: 100.0, high: 101.5, low: 99.2, close: 101.0 },
        success: {
          all: [
            { field: "direction", eq: "bullish" },
            { field: "body", gte: 0.4 },
            { field: "close", gte: 101.5 },
          ],
        },
        feedback: [
          { when: { not: { field: "direction", eq: "bullish" } }, text: "Candle 3 has to push back up: close it above its open." },
          { when: { field: "close", lt: 101.5 }, text: "At {close:2}, candle 3 closes below 101.50, the middle of candle 1's body. Bulkowski's rule needs at least that." },
          { when: { field: "body", lt: 0.4 }, text: "A body of {body:2} is short next to the 0.40 average. Candle 3 should be a real up candle." },
        ],
        correct: "Right: a bullish body of {body:2} closing at {close:2}, at or above 101.50. Notice how much of the turn is candle 3 itself.",
        hints: [
          "Candle 3 must be bullish and close at or above the middle of candle 1's body.",
          "The middle of 102.00 and 101.00 is 101.50. The body must be at least the 0.40 average.",
          "Try open 100.80, close 101.60, high 101.70, low 100.70.",
        ],
        showMe: { open: 100.8, high: 101.7, low: 100.7, close: 101.6 },
        concept: "star-patterns",
      },
      check: ["q-2.1.6-1", "q-2.1.6-2", "q-2.1.6-3"],
      recap: {
        takeaways: [
          "Morning star: a long down candle, a small gapped star, then a close at or above body 1's middle.",
          "The middle candle decides: small body, star; doji, doji star; gaps beyond both wicks, abandoned baby.",
          "Without gaps the strict rule finds nothing; relaxing it makes a different, untested pattern.",
        ],
      },
    },
  },
  // 2.1.7 · Confirmation built in: three-candle patterns
  {
    id: "2.1.7",
    title: "Confirmation built in: three-candle patterns",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 7,
    summary: "Patterns whose last candle confirms the turn, why their rates look higher, and what the late entry does to reward-to-risk.",
    objectives: [
      "Identify three white soldiers, three black crows, three inside up/down and three outside up/down.",
      "Explain why patterns that include their own confirmation candle show higher reversal rates, and what that costs.",
      "Calculate the reward-to-risk of entering at the close of three white soldiers with a stop below the pattern.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "bullish", label: "Arena: bullish" },
      { kind: "arena", ref: "breakout", label: "Arena: breakout" },
    ],
    script: {
      unit: "2.1",
      courseId: "2.1.7",
      hook: {
        prompt: "A bullish [[harami]] reverses about 53% of the time. Add one confirming candle and it becomes three inside up. Guess the new rate.",
        control: { kind: "slider", min: 40, max: 90, step: 1, unit: "%", start: 53, answer: 65 },
        compare: "You guessed {yours}. Bulkowski: 65%. A higher rate, and a later entry.",
        concept: "confirmed-candle-patterns",
      },
      learn: [
        {
          kind: "figure",
          title: "Harami plus one",
          text: "[[three-inside-up-down|Three inside up]] is a harami plus a candle that closes above the first candle's open. [[three-outside-up-down|Three outside up]] is a bullish engulfing plus a higher close. Each carries its own confirmation.",
          figure: {
            kind: "chart",
            chart: { candles: L217_INSIDE, visible: 15, describe: "A decline from 104.25, a long bearish candle from 101.00 to 100.00, a small bullish candle inside it, then a close at 101.20." },
            steps: [
              { text: "A bullish harami: a small up body, 100.20 to 100.50, inside a long down body.", layers: [{ kind: "bracket", from: 100.0, to: 101.0, index: 13, label: "BODY 1" }] },
              {
                text: "Candle 3 closes at 101.20, above candle 1's open of 101.00: three inside up.",
                visible: 16,
                layers: [{ kind: "level", price: 101.0, role: "neutral", label: "OPEN 1 · 101.00" }],
              },
              { text: "From the harami's close, 100.50, candle 3 has already risen 0.70.", layers: [{ kind: "bracket", from: 100.5, to: 101.2, index: 15, label: "+0.70", role: "up" }] },
            ],
          },
          concept: "confirmed-candle-patterns",
        },
        {
          kind: "predict",
          title: "Higher rates from noise?",
          prompt: "We ran both rules on 3,000 [[random-walk|random-walk]] paths, counting what came first: a close above the pattern's high, or below its low. Which rule 'reversed' more often?",
          control: {
            kind: "choice",
            choices: [
              { id: "harami", label: "The harami", feedback: "The other way: 45% for the harami, 74% for three inside up." },
              { id: "inside-up", label: "Three inside up, by far", feedback: "Right: 74% against 45%, on pure noise." },
              { id: "same", label: "About the same", feedback: "Far apart: 45% and 74%, though neither has any edge on a random walk." },
            ],
            answer: "inside-up",
          },
          figure: {
            kind: "bars",
            unit: "%",
            bars: [
              { label: "Harami (11,475 cases)", value: 45.2, role: "neutral" },
              { label: "Three inside up (2,203 cases)", value: 74.4, role: "concept" },
            ],
            steps: ["Share that closed above the pattern's high first, on a random walk.", "Average result after costs: −0.47R and −0.31R. Neither has an edge."],
          },
          reveal: "On noise, three inside up 'broke up first' 74% of the time, the harami 45%. Candle 3 closes near the pattern's top, so the high is the nearer edge. The same geometry flatters hammers: 63% here. Both rules still lost about 0.47R and 0.31R a trade: the costs.",
          concept: "confirmed-candle-patterns",
        },
        {
          kind: "match",
          title: "Three-candle shapes",
          prompt: "Match each description to its name.",
          pairs: [
            { left: "Three long up bodies, each opening inside the last and closing near its high", right: "Three white soldiers", wrong: "Three strong up candles, stepping higher: the soldiers." },
            { left: "Three long down bodies after a rise, each closing near its low", right: "Three black crows", wrong: "The soldiers' mirror after a rise: the crows." },
            { left: "Three up candles, bodies shrinking, upper shadows growing", right: "Advance block", wrong: "A rise that's tiring: shrinking bodies, growing upper shadows." },
            { left: "Two long up bodies, then a short third one", right: "Deliberation", wrong: "The third body stalls: deliberation." },
            { left: "A bullish harami, then a close above candle 1's open", right: "Three inside up", wrong: "Harami plus a confirming close: three inside up." },
            { left: "A bullish engulfing, then a higher close", right: "Three outside up", wrong: "Engulfing plus a higher close: three outside up." },
          ],
          correct: "Advance block and deliberation are warnings that a rise is tiring. Neither has published statistics.",
          concept: "confirmed-candle-patterns",
        },
        {
          kind: "figure",
          title: "Soldiers at resistance",
          text: "[[three-white-soldiers|Three white soldiers]] look strong: three long up candles in a row. That strength is exactly what you pay for when you buy at their close.",
          figure: {
            kind: "chart",
            chart: { candles: L217_SOLDIERS, describe: "A high of 103.00, a decline to 99.80, then three long bullish candles from 99.90 to 102.00." },
            steps: [
              { text: "Three white soldiers after a decline: 99.90 to 102.00 in three candles.", layers: [{ kind: "marker", index: 17, at: "close", label: "CLOSE 102.00" }] },
              {
                text: "Buy at the close: ask 102.05. Stop 0.10 under the pattern's low of 99.80.",
                layers: [
                  { kind: "level", price: 102.05, role: "entry", label: "ENTRY 102.05" },
                  { kind: "level", price: 99.7, role: "stop", label: "STOP 99.70" },
                ],
              },
              { text: "Resistance at 103.00, where the decline began.", layers: [{ kind: "level", price: 103.0, role: "resistance", label: "RESISTANCE 103.00" }] },
            ],
          },
          concept: "confirmed-candle-patterns",
        },
        {
          kind: "worked",
          title: "Risk at the close",
          lines: ["Entry: 102.00 + 0.05 = 102.05, the ask.", "Stop: 99.80 − 0.10 = 99.70.", "Risk per unit = 102.05 − 99.70 = ?"],
          ask: {
            answer: 2.35,
            tolerance: 0,
            feedback: [
              { value: 2.3, text: "That uses the close, 102.00, not the ask. A buy fills at the ask, 102.05." },
              { value: 2.25, text: "That uses the low, 99.80, not the stop. The stop sits 0.10 lower." },
            ],
            correct: "Right: 2.35 a unit. With 100.00 vUSD at risk, that's just 42 units, before costs.",
          },
          after: "Three long candles make a wide stop. Now check how much room is left before resistance.",
          concept: "reward-to-risk",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "Grade C, mixed. Bulkowski: three white soldiers 82% (rank 32), three black crows 78% (third overall), three inside up 65% (rank 20), three outside up 75%. In a replication on 60 Johannesburg stocks, only three outside down predicted anything. Advance block and deliberation: no statistics.",
        },
      ],
      task: {
        widget: "risk-reward",
        goal: "Entry 102.05 and the 103.00 target are fixed. Put the stop 0.10 below the pattern's low of 99.80, then read the reward-to-risk.",
        start: { entry: 102.05, stop: 101.5, target: 103.0 },
        locked: ["entry", "target"],
        success: {
          all: [
            { field: "stop", eq: 99.7, tol: 0.001 },
            { field: "entry", eq: 102.05, tol: 0.001 },
            { field: "target", eq: 103.0, tol: 0.001 },
          ],
        },
        feedback: [
          { when: { field: "stop", gt: 99.7 }, text: "A stop at {stop:2} sits inside the pattern. Its low is 99.80; go 0.10 below it." },
          { when: { field: "stop", lt: 99.7 }, text: "{stop:2} is further away than the rule. 0.10 under 99.80 is 99.70." },
        ],
        correct: "Right: {rr:2} : 1. The three candles already used most of the room to resistance. Skip it or wait for a pullback.",
        hints: [
          "The pattern's low is the lowest of the three lows: 99.80.",
          "0.10 under it: 99.70.",
          "Risk 2.35, reward 0.95: less than half a unit of reward per unit of risk.",
        ],
        showMe: { stop: 99.7 },
        concept: "reward-to-risk",
      },
      check: ["q-2.1.7-1", "q-2.1.7-2", "q-2.1.7-3"],
      recap: {
        takeaways: [
          "Soldiers, crows, three inside and three outside: patterns that end with their own confirming candle.",
          "Their higher rates are partly built in: the last candle is already part of the move.",
          "Soldiers into resistance at 103.00: risk 2.35 for 0.95 of reward, R:R 0.40.",
        ],
      },
    },
  },

  // 2.1.8 · When names lie: the pattern zoo
  {
    id: "2.1.8",
    title: "When names lie: the pattern zoo",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 7,
    summary: "Patterns that tested against their own names, a five-question card for judging any pattern, and named shapes on a random walk.",
    objectives: [
      "Name three patterns whose tested behaviour contradicts their textbook meaning.",
      "Judge any unfamiliar pattern with a five-question reference card: rule, sample size, base rate, result after costs, scope.",
      "Show with the lab that named and unnamed random shapes perform alike on a random walk.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "reversal", label: "Arena: reversal" },
      { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    ],
    script: {
      unit: "2.1",
      courseId: "2.1.8",
      hook: {
        prompt: "The bearish [[three-line-strike|three-line strike]] is taught as a signal that the fall continues. In Bulkowski's data, which way does price usually break?",
        control: {
          kind: "choice",
          choices: [
            { id: "down", label: "Down, as taught", feedback: "The data say otherwise: up, 84% of the time." },
            { id: "up", label: "Up", feedback: "Right: an upward reversal 84% of the time, first of 103 overall." },
            { id: "even", label: "50/50", feedback: "It leans hard: up 84% of the time, against its name." },
          ],
          answer: "up",
        },
        compare: "You picked {yours}. The 'bearish' three-line strike broke upward 84% of the time in Bulkowski's data: rank 1 of 103.",
        concept: "pattern-name-vs-evidence",
      },
      learn: [
        {
          kind: "figure",
          title: "A bearish three-line strike",
          text: "The name comes from a story about the trend. The tested result points the other way.",
          figure: {
            kind: "chart",
            chart: { candles: L218_STRIKE, describe: "A decline, three falling candles from 101.20 to 99.70, then one bullish candle from 99.60 to 101.30." },
            steps: [
              { text: "Three falling candles, each closing lower: 101.20 down to 99.70.", layers: [{ kind: "marker", index: 11, at: "close", label: "99.70" }] },
              { text: "Candle 4 opens lower, at 99.60, then closes at 101.30, above candle 1's open.", layers: [{ kind: "marker", index: 12, at: "close", label: "101.30" }] },
              { text: "Taught: the fall resumes. Tested: price broke up 84% of the time." },
            ],
          },
          concept: "pattern-name-vs-evidence",
        },
        {
          kind: "figure",
          title: "Four names that lie",
          text: "Hanging man: price rose about 59% of the time. Inverted hammer: fell about 65%. Bearish three-line strike: rose 84%. [[matching-low|Matching low]], taught as support: fell 61%.",
          figure: {
            kind: "bars",
            unit: "%",
            bars: [
              { label: "Hanging man", value: 41, role: "neutral" },
              { label: "Inverted hammer", value: 35, role: "neutral" },
              { label: "Bearish three-line strike", value: 16, role: "neutral" },
              { label: "Matching low", value: 39, role: "neutral" },
            ],
            steps: ["Share of cases that broke the way the name says, in Bulkowski's data.", "All four sit below 50%: they mostly did the opposite."],
          },
          concept: "pattern-name-vs-evidence",
        },
        {
          kind: "order",
          title: "Five questions for any pattern",
          prompt: "Put the five questions of the pattern card in order.",
          items: [
            "What is the exact rule?",
            "How many cases were counted?",
            "What is the rate, compared with 50%?",
            "What is the result after costs?",
            "Which market, timeframe and years?",
          ],
          explain: "Each answer needs the one before: no count without a rule, no rate without a count, no result without the rate. Scope comes last: it tells you whether any of it applies to your market.",
          wrong: "Start with the rule: without it, there's nothing to count.",
          note: { key: "pattern-card", label: "A pattern you've heard 'works', and the first question it fails", placeholder: "e.g. 'Pattern X: I've never seen a case count'" },
          concept: "pattern-name-vs-evidence",
        },
        {
          kind: "predict",
          title: "Top of the list",
          prompt: "Three stars in the south tops Bulkowski's reversal list at 86%. It's also one of the rarest patterns. Which card question does it fail first?",
          control: {
            kind: "choice",
            choices: [
              { id: "rule", label: "Exact rule?", feedback: "The rule is written down. The trouble starts with the count." },
              { id: "cases", label: "How many cases?", feedback: "Right. A rate from very few cases has a wide margin of error." },
              { id: "costs", label: "Result after costs?", feedback: "That matters too, but no rate can be trusted until you know how many cases it rests on." },
            ],
            answer: "cases",
          },
          reveal: "A high rate from few cases has a wide margin: the next sample could look very different. [[rising-three-methods|Rising three methods]] shows another trap: 74% continuation, yet rank 94 of 103, and rare too.",
          concept: "pattern-name-vs-evidence",
        },
        {
          kind: "callout",
          tone: "info",
          text: "Sometimes the name holds: the upside [[tasuki-gap|tasuki gap]] continued 57% of the time (5th overall), two black gapping 68% (top 10). The point isn't that names are wrong; only data tell you which are right. Textbook claims: grade D. The reversed results: grade C, one data set, US stocks, one era.",
        },
        {
          kind: "reveal",
          title: "Name it, then look",
          prompt: "Three white soldiers have just closed, after a dip. What happens over the next 10 candles?",
          chart: { candles: L218_RANDOM, visible: 20, describe: "Twenty candles between 99.84 and 101.05, ending with three bullish candles from 99.95 to 100.80; ten more candles hidden." },
          choices: [
            { id: "rise", label: "Price keeps rising", feedback: "Not at first: price fell to 100.15 before climbing back to 100.82." },
            { id: "fall", label: "Price falls back", feedback: "At first, to 100.15; then it climbed back to 100.82." },
          ],
          after: "It fell to 100.15, then climbed back to 100.82, two cents above the soldiers' close. This chart is a random walk: the soldiers appeared by chance, and what followed was chance too.",
          concept: "pattern-name-vs-evidence",
        },
        {
          kind: "predict",
          title: "Named against unnamed",
          prompt: "On 3,000 [[random-walk|random-walk]] paths we flagged seven bullish patterns from this unit, from hammers to three white soldiers, and compared them with every candle. Did the named shapes do better 10 candles later?",
          control: {
            kind: "choice",
            choices: [
              { id: "named", label: "Named shapes did better", feedback: "49.4% against 49.6%: no difference beyond noise." },
              { id: "same", label: "No: both near 50%", feedback: "Right: 49.4% after 52,301 named shapes, 49.6% after any candle." },
              { id: "unnamed", label: "Unnamed shapes did better", feedback: "0.2 points apart, well inside the noise. Neither did better." },
            ],
            answer: "same",
          },
          figure: {
            kind: "bars",
            unit: "%",
            bars: [
              { label: "After 52,301 bullish names", value: 49.4, role: "concept" },
              { label: "After any of 510,000 candles", value: 49.6, role: "neutral" },
            ],
            steps: ["Share with price higher 10 candles later."],
          },
          reveal: "On a random walk a name adds nothing: 49.4% ± 0.4 against 49.6% ± 0.1. That's the control every pattern has to beat, on real data and after costs, before its name means anything.",
          concept: "pattern-name-vs-evidence",
        },
      ],
      check: ["q-2.1.8-1", "q-2.1.8-2", "q-2.1.8-3"],
      recap: {
        takeaways: [
          "Hanging man, inverted hammer, bearish three-line strike: tested, each mostly did the opposite of its name.",
          "Judge any pattern by rule, case count, rate against 50%, result after costs, and scope.",
          "On a random walk, named and unnamed shapes did the same: about 50%.",
        ],
      },
    },
  },

  // 2.1.9 · Other ways to draw price: Heikin-Ashi, Renko, point & figure
  {
    id: "2.1.9",
    title: "Other ways to draw price: Heikin-Ashi, Renko, point & figure",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 8,
    summary: "Heikin-Ashi, Renko and point & figure: how each is built, what it hides, and why fills always use real prices.",
    objectives: [
      "Calculate a Heikin-Ashi candle from real open, high, low and close values.",
      "Build Renko bricks and point & figure columns from a list of prices, given the box size and the reversal.",
      "Explain why stops, fills and backtests must use real prices, not Heikin-Ashi or Renko prices.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "bullish", label: "Arena: bullish" },
      { kind: "mission", ref: "M01", label: "Read the Candle" },
    ],
    script: {
      unit: "2.1",
      courseId: "2.1.9",
      hook: {
        prompt: "Real candle 7 closed red, down 0.80 from its open. Will the [[heikin-ashi|Heikin-Ashi]] candle 7 be red too?",
        control: {
          kind: "choice",
          choices: [
            { id: "red", label: "Red", feedback: "No: HA candle 7 runs from 100.45 up to 100.77, green. It still averages in the rise." },
            { id: "green", label: "Green", feedback: "Right: HA open 100.45, HA close 100.77. Heikin-Ashi lags." },
          ],
          answer: "green",
        },
        figure: {
          kind: "chart",
          chart: { candles: L219_REAL, describe: "Ten real candles rising from 98.85 to 101.20, then falling to 99.70 and closing the last one at 100.10." },
          steps: [{ text: "Ten real candles. Candle 7 falls from 101.20 to 100.40.", layers: [{ kind: "marker", index: 6, at: "high", label: "CANDLE 7" }] }],
        },
        compare: "You picked {yours}. HA candle 7 is green, 100.45 to 100.77, though the real candle fell 0.80. Heikin-Ashi lags.",
        concept: "alternative-chart-types",
      },
      learn: [
        {
          kind: "explain",
          title: "Averaged candles",
          text: "A [[heikin-ashi|Heikin-Ashi]] (HA) candle is built from averages. HA close = (open + high + low + close) ÷ 4 of the real candle. HA open = (previous HA open + previous HA close) ÷ 2. HA high and low are the extremes of the real high or low and the HA open and close. Smoother, and later.",
        },
        {
          kind: "worked",
          title: "Build HA candle 8",
          lines: [
            "HA candle 7: open 100.45, close 100.77.",
            "HA open 8 = (100.45 + 100.77) ÷ 2 = 100.61.",
            "Real candle 8: open 100.40, high 100.60, low 99.70, close 99.90.",
            "HA close 8 = (100.40 + 100.60 + 99.70 + 99.90) ÷ 4 = ?",
          ],
          ask: {
            answer: 100.15,
            tolerance: 0,
            feedback: [
              { value: 99.9, text: "That's the real close. The HA close averages all four real prices." },
              { value: 100.61, text: "That's the HA open. The HA close averages the real candle's four prices." },
            ],
            correct: "Right: 100.15, below the HA open of 100.61. HA candle 8 is red, one candle after the real ones turned.",
          },
          after: "100.15 and 100.61 never traded. They're averages, drawn as if they were prices.",
          concept: "alternative-chart-types",
        },
        {
          kind: "figure",
          title: "Real against Heikin-Ashi",
          text: "Smoothing removes noise and adds lag. Every HA value is an average, not a price anyone traded.",
          figure: {
            kind: "chart",
            chart: { candles: L219_HA, describe: "The same ten hours as Heikin-Ashi: green from 98.74 up to 100.77, then red from candle 8 on." },
            steps: [
              { text: "The same ten hours as Heikin-Ashi: fewer colour changes, smoother runs." },
              {
                text: "HA stays green at candles 2 and 7, where the real candles were red.",
                layers: [
                  { kind: "marker", index: 1, at: "high", label: "REAL RED" },
                  { kind: "marker", index: 6, at: "high", label: "REAL RED" },
                ],
              },
              { text: "At candle 10 the real candle is green; HA stays red.", layers: [{ kind: "marker", index: 9, at: "high", label: "REAL GREEN" }] },
            ],
          },
          concept: "alternative-chart-types",
        },
        {
          kind: "predict",
          title: "Renko bricks",
          prompt: "Closes: 100.00, 100.30, 100.70, 101.20, 100.90, 100.40, 100.10, 99.80. A [[renko]] chart with a [[box-size|box size]] of 0.50 starts at 100.00 and needs 2 boxes to reverse. How many bricks does it draw?",
          control: {
            kind: "numeric",
            answer: 3,
            tolerance: 0,
            feedback: [
              { value: 2, text: "Two up bricks, to 100.50 and 101.00, then the fall to 99.80 adds a down brick: 3." },
              { value: 4, text: "The fall adds only one brick: a second would need a close at 99.50 or lower." },
              { value: 8, text: "Renko ignores time: 8 closes, but only moves of a full brick draw anything." },
            ],
          },
          figure: {
            kind: "chart",
            chart: { candles: L219_RENKO, describe: "Three Renko bricks: up from 100.00 to 100.50, up to 101.00, then down from 100.50 to 100.00." },
            steps: [{ text: "Up bricks at 100.70 and 101.20. Falling to 99.80 adds one down brick, 100.50 to 100.00." }],
          },
          reveal: "3 bricks from 8 closes. The x-axis now counts bricks, not hours: time has gone. The reversal needed a close at or below 100.00, two boxes under the 101.00 top.",
          concept: "alternative-chart-types",
        },
        {
          kind: "match",
          title: "Point & figure, move by move",
          prompt: "Point & figure, box 1.00, reversal 3 boxes: Xs for rises, Os for falls. Sort each move.",
          pairs: [
            { left: "In an X column topped at 100, price rises to 104", right: "Add to the current column", wrong: "Same direction: extend the Xs to 101, 102, 103 and 104." },
            { left: "From that 104 top, price falls to 102", right: "Plot nothing yet", wrong: "Two boxes back, one short of the 3-box reversal." },
            { left: "From that 104 top, price falls to 101", right: "Start a new column", wrong: "Three boxes back: a new O column at 103, 102 and 101." },
            { left: "In an O column ending at 101, price rises to 103", right: "Plot nothing yet", wrong: "Two boxes up, one short of a reversal." },
            { left: "In an O column ending at 101, price falls to 100", right: "Add to the current column", wrong: "Same direction: one more O, at 100." },
            { left: "In an O column ending at 101, price rises to 105", right: "Start a new column", wrong: "Four boxes up: a new X column from 102 to 105." },
          ],
          correct: "An X column at 105 tops the earlier one at 104: a double-top breakout, P&F's basic buy signal. Its value as a signal is untested here.",
          concept: "alternative-chart-types",
        },
        {
          kind: "figure",
          title: "What the line didn't tell you",
          text: "Every way of drawing price keeps some facts and drops others. A line through the closes, from unit 1.2, drops the opens, highs and lows, and with them the gaps.",
          figure: {
            kind: "chart",
            chart: { candles: L219_GAP, style: "line", describe: "Eight hours rising from 100.10 to 101.25; candle 5 opens at 100.95, above candle 4's high of 100.42." },
            steps: [
              { text: "A line through the closes: a climb from 100.10 to 101.25." },
              { text: "As candles: candle 5 opened at 100.95, above candle 4's high of 100.42.", style: "candle" },
              { text: "Nothing traded between 100.42 and 100.90. A stop in there fills at the next real price.", layers: [{ kind: "zone", from: 100.42, to: 100.9, role: "concept", label: "GAP" }] },
            ],
          },
          concept: "alternative-chart-types",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "Fills, stops and backtests use real prices. Heikin-Ashi values are averages and Renko bricks are rounded steps; neither is a price you could trade, and Renko drops time. HA trend signals, Renko 2-brick reversals and [[point-and-figure|point & figure]] counts: grade D. P&F signals are rule-based, so at least they can be tested.",
        },
        {
          kind: "predict",
          title: "Exit on the first red HA candle",
          prompt: "You bought at the close of candle 5. Your rule: exit at the close of the first red Heikin-Ashi candle. Type the real price you would have sold at.",
          control: {
            kind: "numeric",
            unit: "vUSD",
            answer: 99.85,
            tolerance: 0,
            feedback: [
              { value: 100.15, text: "That's the HA close. Nobody traded there. Fills use real prices." },
              { value: 99.9, text: "That's the real close, the mid. A sale fills at the bid, 0.05 lower." },
              { value: 100.61, text: "That's the HA open. Fills use real prices." },
              { value: 100.35, text: "That exits on the first red real candle, 7. Your rule waits for the first red HA candle: 8." },
            ],
          },
          figure: {
            kind: "chart",
            chart: { candles: L219_REAL, describe: "The ten real candles, with the exit marked at candle 8's close of 99.90." },
            steps: [{ text: "HA candle 8 is the first red one after candle 5. Real close 99.90; the bid is 99.85.", layers: [{ kind: "marker", index: 7, at: "close", label: "EXIT 99.85" }] }],
          },
          reveal: "99.85: real candle 8 closed at 99.90, and a sale fills at the bid. The HA close, 100.15, was 0.30 better on paper. A backtest that fills at HA prices books profits that never existed.",
          concept: "alternative-chart-types",
        },
      ],
      check: ["q-2.1.9-1", "q-2.1.9-2", "q-2.1.9-3"],
      recap: {
        takeaways: [
          "HA close averages O, H, L and C; HA open averages the previous HA open and close.",
          "Renko draws a brick per full box move; P&F starts a column after a 3-box reversal.",
          "Stops, fills and backtests use real prices: HA and Renko values were never traded.",
        ],
      },
    },
  },
];

// ─── Check questions ────────────────────────────────────────────────────────

const questions: Question[] = [
  // 2.1.1
  {
    id: "q-2.1.1-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "In the app's rules, what makes a candle's body 'long'?",
    options: [
      { id: "a", label: "A body of more than 0.50 vUSD", rationale: "A fixed size can't work: 0.50 is long in a calm hour and short in a busy one. The rule is relative." },
      { id: "b", label: "A body bigger than the average body of the last 10 candles" },
      { id: "c", label: "A body bigger than its own wicks", rationale: "That compares the candle with itself. 'Long' compares the body with the bodies of recent candles." },
      { id: "d", label: "A range bigger than the average range", rationale: "Range includes the wicks. A long body is about open to close, measured against recent bodies." },
    ],
    correct: "b",
    explanation: "The app follows the TA-Lib default: a body is long when it's above the average body of the 10 candles before it, and very long above 3 times that. The same candle can be long in a calm market and short in a busy one.",
    lesson: "2.1.1",
    concepts: ["candle-vocabulary"],
  },
  {
    id: "q-2.1.1-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    scenario: "Recent candles average a body of 0.30 and a range of 0.60.",
    prompt: "A candle: open 100.40, high 100.75, low 100.15, close 100.55. Which name fits?",
    options: [
      { id: "a", label: "Doji", rationale: "A doji's body is at most 10% of the average range, 0.06 here. This body is 0.15." },
      { id: "b", label: "High-wave candle", rationale: "High-wave needs both wicks over twice the body, above 0.30. These wicks are 0.20 and 0.25." },
      { id: "c", label: "Spinning top" },
      { id: "d", label: "Long-legged doji", rationale: "It isn't a doji: the body, 0.15, is well above the 0.06 line." },
    ],
    correct: "c",
    explanation: "Body 100.55 − 100.40 = 0.15: short (under 0.30) but too big for a doji (over 0.06). Upper wick 100.75 − 100.55 = 0.20, lower wick 100.40 − 100.15 = 0.25: both longer than the body, but not twice as long. A spinning top, not a high-wave candle.",
    lesson: "2.1.1",
    concepts: ["candle-vocabulary"],
    hints: ["Body = close − open. Upper wick = high − close; lower wick = open − low here.", "Body 0.15; wicks 0.20 and 0.25. Check the doji line: 10% of the average range."],
  },
  {
    id: "q-2.1.1-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "After eight rising candles, a doji appears. A video calls it 'a clear sell signal: the buyers are exhausted'.",
    prompt: "What's the most accurate reading?",
    options: [
      { id: "a", label: "Sell: a doji after a rise marks the top", rationale: "Tested doji types sit near 50%. A doji records one undecided hour; it doesn't mark tops." },
      { id: "b", label: "Buy: the trend is still up", rationale: "The doji doesn't say that either. It describes an hour with almost no net move." },
      { id: "c", label: "An hour of indecision, not a signal: tested, doji sit near 50%" },
      { id: "d", label: "It depends on the doji's colour", rationale: "A doji has almost no body, so its colour carries next to no information." },
    ],
    correct: "c",
    explanation: "A doji describes an hour where open and close nearly matched. As a signal it's unproven: in Bulkowski's data long-legged, dragonfly and gravestone doji sat at 50–51%. Context and testing, not the shape, decide anything.",
    lesson: "2.1.1",
    concepts: ["candle-vocabulary", "base-rates"],
    hints: ["What does a doji record about the hour?", "Compare the tested rates with 50%."],
  },

  // 2.1.2
  {
    id: "q-2.1.2-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "After ten rising candles, a candle has a small body near its high, a lower shadow three times the body and almost no upper shadow. What is it called?",
    options: [
      { id: "a", label: "Hammer", rationale: "A hammer has this shape but follows a decline. After a rise, the same shape gets another name." },
      { id: "b", label: "Hanging man" },
      { id: "c", label: "Shooting star", rationale: "A shooting star's long shadow is above the body. Here the long shadow is below." },
      { id: "d", label: "Inverted hammer", rationale: "An inverted hammer has a long upper shadow and follows a decline. This one has a long lower shadow after a rise." },
    ],
    correct: "b",
    explanation: "Shape plus trend gives the name. A long lower shadow under a small body near the top is a hammer after a decline and a hanging man after a rise.",
    lesson: "2.1.2",
    concepts: ["rejection-candles", "trend"],
  },
  {
    id: "q-2.1.2-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Textbooks read the hanging man as bearish. What did Bulkowski's tests show?",
    options: [
      { id: "a", label: "Price fell after it about 70% of the time", rationale: "That would make the name right. In the data the hanging man leaned the other way." },
      { id: "b", label: "Exactly 50/50, no lean either way", rationale: "It did lean, just not the way its name says: about 59% kept rising." },
      { id: "c", label: "It was never tested", rationale: "It was: Bulkowski ranks it 87 of 103, with a lean towards continuation." },
      { id: "d", label: "Price kept rising about 59% of the time" },
    ],
    correct: "d",
    explanation: "As tested, the hanging man behaved more like a continuation: price broke upward first about 59% of the time, rank 87 of 103. Judge a pattern by its data, not its name.",
    lesson: "2.1.2",
    concepts: ["rejection-candles", "base-rates"],
    hints: ["Two of the four long-shadow names point the wrong way in testing.", "The hanging man is one of them."],
  },
  {
    id: "q-2.1.2-3",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A LABX candle: open 100.30, high 100.32, low 99.70, close 100.20. What is its lower shadow divided by its body?",
    numeric: { answer: 5, tolerance: 0.01, unit: "×" },
    explanation: "Body: 100.30 − 100.20 = 0.10. The candle is bearish, so the lower shadow runs from the close, 100.20, down to the low: 0.50. 0.50 ÷ 0.10 = 5, well above the 2 a hammer needs.",
    lesson: "2.1.2",
    concepts: ["rejection-candles"],
    hints: [
      "The lower shadow starts at the bottom of the body, not at the open.",
      "This candle is bearish, so the bottom of its body is the close, 100.20.",
      "Lower shadow 100.20 − 99.70 = 0.50; body 0.10.",
    ],
    vary: {
      fields: { o: [99.5, 101.5, 0.1], b: [0.05, 0.3, 0.05], lw: [0.3, 1.2, 0.1] },
      answer: "round(lw / b, 2)",
      prompt: "A LABX candle: open {o:2}, high {o + 0.02:2}, low {o - b - lw:2}, close {o - b:2}. What is its lower shadow divided by its body?",
      explanation: "Body: {o:2} − {o - b:2} = {b:2}. The candle is bearish, so the lower shadow runs from the close, {o - b:2}, down to the low: {lw:2}. {lw:2} ÷ {b:2} = {answer}.",
      hint: "Lower shadow {o - b:2} − {o - b - lw:2} = {lw:2}; body {b:2}.",
    },
  },

  // 2.1.3
  {
    id: "q-2.1.3-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "A bullish engulfing forms after eight falling candles. The next candle closes above the pattern's high. The pattern's low is 1.50 above the nearest support zone. Which check fails?",
    options: [
      { id: "a", label: "Something to reverse", rationale: "Eight falling candles came first, so there is something to reverse." },
      { id: "b", label: "Confirmation", rationale: "The next candle closed above the pattern's high: that is the confirmation." },
      { id: "c", label: "Location" },
      { id: "d", label: "None: trade it", rationale: "The pattern sits 1.50 above support, in open space, so the location check fails." },
    ],
    correct: "c",
    explanation: "Trend and confirmation pass, but the pattern isn't at a zone: its low is 1.50 above support. With no level under it, the rule says skip.",
    lesson: "2.1.3",
    concepts: ["pattern-context", "support-and-resistance"],
    hints: ["Run the three checks one by one.", "Where is the pattern's low compared with the support zone?"],
  },
  {
    id: "q-2.1.3-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A hammer's low is 49.20. You wait for confirmation and buy at 49.85, with the stop 0.10 under the low. Resistance is at 51.00. What is the reward-to-risk, before costs?",
    numeric: { answer: 1.53, tolerance: 0.01, unit: "R" },
    explanation: "Stop: 49.20 − 0.10 = 49.10. Risk: 49.85 − 49.10 = 0.75. Reward: 51.00 − 49.85 = 1.15. R:R = 1.15 ÷ 0.75 = 1.53.",
    lesson: "2.1.3",
    concepts: ["pattern-confirmation", "reward-to-risk"],
    hints: ["Find the stop first: 0.10 under the hammer's low.", "Risk = entry − stop; reward = target − entry.", "Risk 0.75, reward 1.15. Divide reward by risk."],
    vary: {
      fields: { low: [48, 52, 0.05], gap: [0.3, 1, 0.05], room: [0.5, 2.5, 0.05] },
      answer: "round(room / (gap + 0.1), 2)",
      prompt: "A hammer's low is {low:2}. You wait for confirmation and buy at {low + gap:2}, with the stop 0.10 under the low. Resistance is at {low + gap + room:2}. What is the reward-to-risk, before costs?",
      explanation: "Stop: {low:2} − 0.10 = {low - 0.1:2}. Risk: {low + gap:2} − {low - 0.1:2} = {gap + 0.1:2}. Reward: {low + gap + room:2} − {low + gap:2} = {room:2}. R:R = {room:2} ÷ {gap + 0.1:2} = {answer:2}.",
      hint: "Risk {gap + 0.1:2}, reward {room:2}. Divide reward by risk.",
    },
  },
  {
    id: "q-2.1.3-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 3,
    scenario: "You run a candle rule on 2,000 random-walk paths. It finds 1,200 patterns, and price is higher 10 candles later after 50.3% of them, give or take 2.8 points.",
    prompt: "What does this tell you about the rule?",
    options: [
      { id: "a", label: "It has a small edge: 50.3% beats 50%", rationale: "0.3 points is far inside the ±2.8 band. That's noise, not an edge." },
      { id: "b", label: "It's broken and should be thrown away", rationale: "Every rule scores about 50% on a random walk. The test is a control, not a verdict on real markets." },
      { id: "c", label: "It needs more random-walk data to reach 60%", rationale: "More random-walk data only narrows the band around 50%. No sample size makes an edge out of noise." },
      { id: "d", label: "As expected: a shape alone creates no edge; test it on real data against random entries" },
    ],
    correct: "d",
    explanation: "On a random walk the future doesn't depend on the past, so every rule lands near 50%, as this one did. That's the control. Whether the rule has an edge can only be shown on real or structured markets, against random entries, after costs.",
    lesson: "2.1.3",
    concepts: ["base-rates", "random-walk"],
    hints: ["Is 0.3 points bigger or smaller than the band?", "On a random walk, what rate should any rule get?"],
  },

  // 2.1.4
  {
    id: "q-2.1.4-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "After a decline, candle 1 opens at 100.80 and closes at 100.30. Candle 2 opens at 100.35, closes at 100.90 and has a low of 100.20. Is it a bullish engulfing?",
    options: [
      { id: "a", label: "Yes: candle 2's range covers candle 1", rationale: "Ranges don't count in an engulfing. Compare bodies: candle 2's body starts at 100.35, above 100.30." },
      { id: "b", label: "Yes: it closes above candle 1's open", rationale: "That's one end. The other fails: the body opens at 100.35, above candle 1's close of 100.30." },
      { id: "c", label: "No: candle 2's body opens above candle 1's close" },
      { id: "d", label: "No: candle 2 should be bearish", rationale: "A bullish engulfing ends with a bullish candle. The colour is right; the bottom of the body isn't." },
    ],
    correct: "c",
    explanation: "Bodies only: candle 1's body is 100.30–100.80, candle 2's is 100.35–100.90. The top is covered, the bottom isn't, so it's not an engulfing. The low of 100.20 doesn't matter.",
    lesson: "2.1.4",
    concepts: ["engulfing-pattern"],
    hints: ["Ignore highs and lows. Write down both bodies.", "Does candle 2's body reach down to 100.30?"],
  },
  {
    id: "q-2.1.4-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "What separates a harami from an inside bar?",
    options: [
      { id: "a", label: "A harami compares bodies; an inside bar compares whole ranges" },
      { id: "b", label: "Nothing: they're one pattern with two names", rationale: "They often coincide, but a harami's wicks can stick out while its body stays inside. An inside bar needs the whole range inside." },
      { id: "c", label: "A harami needs a bullish second candle, an inside bar a bearish one", rationale: "Neither is defined by colour. The difference is what's compared: bodies or full ranges." },
      { id: "d", label: "An inside bar must be a doji", rationale: "That's a harami cross: a harami with a doji. An inside bar can have any body." },
    ],
    correct: "a",
    explanation: "A harami asks whether the second body sits inside the first body. An inside bar asks whether the second candle's high and low sit inside the first one's range. Candle patterns compare bodies; price-action bars compare ranges.",
    lesson: "2.1.4",
    concepts: ["harami-pattern"],
    hints: ["One looks at open and close; the other at high and low."],
  },
  {
    id: "q-2.1.4-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 3,
    scenario: "A blog calls bearish engulfing 'one of the most reliable patterns': it reverses price 79% of the time. Bulkowski ranks it 91st of 103 for overall performance.",
    prompt: "How can both be true?",
    options: [
      { id: "a", label: "The rank must be a mistake", rationale: "Both numbers come from the same tests. They measure different things: how often it turns, and how far." },
      { id: "b", label: "The moves after it are small, so after costs little is left" },
      { id: "c", label: "The 79% counts only the patterns that worked", rationale: "The 79% counts all cases. The issue is the size of the move after the turn." },
      { id: "d", label: "It works on daily charts but not on hourly ones", rationale: "Both figures come from daily charts. Hit rate and overall performance simply measure different things." },
    ],
    correct: "b",
    explanation: "A hit rate counts how often price breaks the expected way; overall performance also counts how far it goes. Frequent small moves rank low, and spread and commission take a bigger share of them. Judge a pattern by expectancy after costs.",
    lesson: "2.1.4",
    concepts: ["engulfing-pattern", "expectancy"],
    hints: ["What does a hit rate leave out?", "Think about the size of the move after the turn, and about costs."],
  },

  // 2.1.5
  {
    id: "q-2.1.5-1",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 1,
    prompt: "Candle 1 is bearish: open 101.00, close 100.00. Candle 2 closes at 100.70. How far into candle 1's body does it close, in percent?",
    numeric: { answer: 70, tolerance: 0.5, unit: "%" },
    explanation: "(100.70 − 100.00) ÷ (101.00 − 100.00) = 0.70 ÷ 1.00 = 70%. Past the middle, so if candle 2 opened below candle 1's low, it's a piercing line.",
    lesson: "2.1.5",
    concepts: ["penetration-patterns"],
    hints: ["Measure up from candle 1's close, the bottom of its body.", "Divide by candle 1's body, open minus close.", "0.70 ÷ 1.00, as a percentage."],
    vary: {
      fields: { o1: [100.5, 103, 0.1], b: [0.5, 1.5, 0.1], depth: [0.05, 1.45, 0.05] },
      constraints: ["depth < b"],
      answer: "round(100 * depth / b, 0)",
      prompt: "Candle 1 is bearish: open {o1:2}, close {o1 - b:2}. Candle 2 closes at {o1 - b + depth:2}. How far into candle 1's body does it close, in percent?",
      explanation: "({o1 - b + depth:2} − {o1 - b:2}) ÷ ({o1:2} − {o1 - b:2}) = {depth:2} ÷ {b:2}, about {answer}%.",
      hint: "{depth:2} ÷ {b:2}, then × 100.",
    },
  },
  {
    id: "q-2.1.5-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Candle 1 is bearish, from 101.00 to 100.00, with a low of 99.90. Candle 2 opens at 99.70 and closes at 100.03. What is the pair called?",
    options: [
      { id: "a", label: "On-neck line", rationale: "On-neck closes at candle 1's low, 99.85 to 99.95. This one closes inside the body." },
      { id: "b", label: "In-neck line" },
      { id: "c", label: "Thrusting line", rationale: "Thrusting needs a close more than 0.05 into the body, from 100.06. 100.03 is only just inside." },
      { id: "d", label: "Piercing line", rationale: "Piercing needs a close past the middle of the body, above 100.50." },
    ],
    correct: "b",
    explanation: "100.03 is within 0.05 of candle 1's close, 100.00: just inside the body. That's an in-neck line, read in theory as bearish continuation. Three cents separate it from a thrusting line.",
    lesson: "2.1.5",
    concepts: ["penetration-patterns"],
    hints: ["Find candle 1's close and the middle of its body.", "In-neck runs from 100.00 to 100.05."],
  },
  {
    id: "q-2.1.5-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "What do Bulkowski's tests say about the kicker?",
    options: [
      { id: "a", label: "It's one of the strongest signals, near the top of the rankings", rationale: "That's the popular claim. The data rank it 96 of 103." },
      { id: "b", label: "It reverses price more than 80% of the time", rationale: "No: about 53%, close to a coin flip in this data." },
      { id: "c", label: "About 53%, rank 96 of 103, and one of the rarest patterns" },
      { id: "d", label: "It was never tested", rationale: "It was: 53%, rank 96 for performance, rank 100 of 103 for frequency." },
    ],
    correct: "c",
    explanation: "The kicker: 53% in the expected direction, rank 96 of 103 for performance and 100 of 103 for frequency. A loud claim on weak, thin data: grade D.",
    lesson: "2.1.5",
    concepts: ["base-rates", "evidence-grades"],
    hints: ["Compare the claim with the rate and the rank."],
  },

  // 2.1.6
  {
    id: "q-2.1.6-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which middle candle makes a bullish abandoned baby?",
    options: [
      { id: "a", label: "A small body whose top is below candle 1's close", rationale: "That's an ordinary morning star. An abandoned baby needs a doji gapped beyond both neighbours' wicks." },
      { id: "b", label: "A doji whose body gaps below candle 1's close, its wicks overlapping", rationale: "That's a morning doji star. In an abandoned baby even the wicks don't touch." },
      { id: "c", label: "A long bearish body", rationale: "A long middle body isn't a star at all. The middle candle of every star pattern is small." },
      { id: "d", label: "A doji whose high is below the lows of candles 1 and 3" },
    ],
    correct: "d",
    explanation: "In an abandoned baby the middle doji is cut off on both sides: its high is below the lows of candles 1 and 3. That double gap is why the pattern is so rare.",
    lesson: "2.1.6",
    concepts: ["star-patterns"],
    hints: ["Compare the doji's high with its neighbours' lows."],
  },
  {
    id: "q-2.1.6-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "Candle 1 of a morning star is bearish: open 103.40, close 102.60. By Bulkowski's rule, what is the lowest close for candle 3, in vUSD?",
    numeric: { answer: 103, tolerance: 0.001, unit: "vUSD" },
    explanation: "The middle of candle 1's body: (103.40 + 102.60) ÷ 2 = 103.00. Candle 3 must close there or higher. TA-Lib's default would accept anything above 102.60 + 0.3 × 0.80 = 102.84.",
    lesson: "2.1.6",
    concepts: ["star-patterns"],
    hints: ["Bulkowski uses the middle of candle 1's body.", "Add open and close, then halve."],
    vary: {
      fields: { o1: [100.5, 105, 0.1], b: [0.4, 1.6, 0.2] },
      answer: "round(o1 - b / 2, 2)",
      prompt: "Candle 1 of a morning star is bearish: open {o1:2}, close {o1 - b:2}. By Bulkowski's rule, what is the lowest close for candle 3, in vUSD?",
      explanation: "The middle of candle 1's body: ({o1:2} + {o1 - b:2}) ÷ 2 = {answer:2}. Candle 3 must close there or higher.",
      hint: "({o1:2} + {o1 - b:2}) ÷ 2.",
    },
  },
  {
    id: "q-2.1.6-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why do the published figures for the abandoned baby rest on few cases?",
    options: [
      { id: "a", label: "Researchers ignore it because it doesn't work", rationale: "It was tested: 70%, rank 9. The problem is how seldom it appears." },
      { id: "b", label: "It needs a doji gapped away from both neighbours, which rarely happens" },
      { id: "c", label: "It only forms on weekly charts", rationale: "It can form on any timeframe. It's rare because of the double gap it needs." },
      { id: "d", label: "Its rule changes from book to book", rationale: "Definitions vary a little for every pattern. The small sample comes from the double gap." },
    ],
    correct: "b",
    explanation: "The pattern needs a doji gapped away from both neighbours' wicks. Gaps are uncommon, especially where trading runs around the clock, so the pattern is rare (frequency 92 of 103) and its rates come with a wide margin of error.",
    lesson: "2.1.6",
    concepts: ["star-patterns", "sample-size"],
    hints: ["Count the gaps the pattern needs.", "Rare patterns mean small samples, and small samples mean wide margins."],
  },

  // 2.1.7
  {
    id: "q-2.1.7-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Candle 1 is bearish, 101.00 to 100.00. Candle 2 is bullish, 99.90 to 101.20. Candle 3 closes at 101.60, above candle 2. What is the pattern?",
    options: [
      { id: "a", label: "Three outside up" },
      { id: "b", label: "Three inside up", rationale: "Inside means candle 2's body sits inside candle 1's. Here candle 2's body covers it." },
      { id: "c", label: "Three white soldiers", rationale: "Soldiers need three long up candles in a row. Candle 1 here is bearish." },
      { id: "d", label: "Morning star", rationale: "A star's middle candle is small and gapped. Candle 2 here is a long body that covers candle 1." },
    ],
    correct: "a",
    explanation: "Candle 2's body, 99.90 to 101.20, covers candle 1's body, 100.00 to 101.00: a bullish engulfing. A higher close on candle 3 makes it three outside up.",
    lesson: "2.1.7",
    concepts: ["confirmed-candle-patterns", "engulfing-pattern"],
    hints: ["Is candle 2's body inside candle 1's body, or around it?"],
  },
  {
    id: "q-2.1.7-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "Three white soldiers end with a close at 51.20; their lowest low is 49.40. You buy at the ask (close + 0.05), stop 0.10 under that low. Resistance is at 52.00. What is the reward-to-risk?",
    numeric: { answer: 0.38, tolerance: 0.01, unit: "R" },
    explanation: "Entry 51.20 + 0.05 = 51.25; stop 49.40 − 0.10 = 49.30; risk 1.95. Reward 52.00 − 51.25 = 0.75. R:R = 0.75 ÷ 1.95 = 0.38: far too little for the risk.",
    lesson: "2.1.7",
    concepts: ["confirmed-candle-patterns", "reward-to-risk"],
    hints: ["Entry at the ask: close + 0.05. Stop: low − 0.10.", "Risk 1.95, reward 0.75."],
    vary: {
      fields: { close: [48, 55, 0.05], height: [1, 3, 0.05], room: [0.3, 2, 0.05] },
      answer: "round((room - 0.05) / (height + 0.15), 2)",
      prompt: "Three white soldiers end with a close at {close:2}; their lowest low is {close - height:2}. You buy at the ask (close + 0.05), stop 0.10 under that low. Resistance is at {close + room:2}. What is the reward-to-risk?",
      explanation: "Entry {close + 0.05:2}; stop {close - height - 0.1:2}; risk {height + 0.15:2}. Reward {close + room:2} − {close + 0.05:2} = {room - 0.05:2}. R:R = {room - 0.05:2} ÷ {height + 0.15:2} = {answer:2}.",
      hint: "Risk {height + 0.15:2}, reward {room - 0.05:2}.",
    },
  },
  {
    id: "q-2.1.7-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Bulkowski's three inside up shows 65%; the bullish harami inside it shows 53%. Why the jump?",
    options: [
      { id: "a", label: "Candle 3 adds new information about the future", rationale: "On a random walk, where nothing predicts anything, three inside up still 'broke up first' 74% of the time. The jump is mostly built in." },
      { id: "b", label: "Three-candle patterns are always more reliable", rationale: "The number of candles isn't the reason. The last candle closing near the pattern's top is." },
      { id: "c", label: "Candle 3 is already part of the move, so the pattern ends near its own breakout point" },
      { id: "d", label: "The 65% counts only patterns at support", rationale: "No location filter is in those figures. The difference comes from the third candle itself." },
    ],
    correct: "c",
    explanation: "When three inside up completes, candle 3 has closed above candle 1's open, near the pattern's top. The 'break up first' count then needs only a small further rise. Much of the higher rate is that geometry, paid for with a later entry.",
    lesson: "2.1.7",
    concepts: ["confirmed-candle-patterns", "pattern-confirmation"],
    hints: ["Where does candle 3 close, compared with the pattern's high?", "What happened on the random walk in this lesson?"],
  },

  // 2.1.8
  {
    id: "q-2.1.8-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "In Bulkowski's tests, which of these mostly did the opposite of what its name says?",
    options: [
      { id: "a", label: "Morning star", rationale: "The morning star broke upward 78% of the time, the way its name says." },
      { id: "b", label: "Bearish engulfing", rationale: "It broke down 79% of the time, as named, though the moves were small." },
      { id: "c", label: "Three white soldiers", rationale: "The soldiers broke upward 82% of the time, as named." },
      { id: "d", label: "Bearish three-line strike" },
    ],
    correct: "d",
    explanation: "The bearish three-line strike is taught as a continuation down, yet price broke upward 84% of the time, first of 103 patterns. The hanging man and the inverted hammer also lean against their names.",
    lesson: "2.1.8",
    concepts: ["pattern-name-vs-evidence"],
  },
  {
    id: "q-2.1.8-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "A forum post: 'This rare five-candle pattern is 86% accurate.' You can't find how many cases the figure comes from.",
    prompt: "What should you ask first?",
    options: [
      { id: "a", label: "Whether the pattern has a famous name", rationale: "A name proves nothing. The first open question is how many cases stand behind the 86%." },
      { id: "b", label: "How many cases the 86% rests on" },
      { id: "c", label: "Whether it worked on the last chart you saw", rationale: "One chart is a sample of one. You need the full count." },
      { id: "d", label: "Which stop to use with it", rationale: "Risk comes later. First find out whether the 86% means anything at all." },
    ],
    correct: "b",
    explanation: "A rate from a handful of cases has a wide margin of error. With 14 cases, 12 wins make 86%, and the true rate could be as low as about 60%. Rare patterns rarely give enough cases to judge.",
    lesson: "2.1.8",
    concepts: ["pattern-name-vs-evidence", "sample-size"],
    hints: ["Which card question comes straight after the rule?", "How wide is the margin of error with very few cases?"],
  },
  {
    id: "q-2.1.8-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which order follows the five-question pattern card?",
    options: [
      { id: "a", label: "Rate vs 50% → rule → cases → scope → costs", rationale: "A rate means nothing until you know the rule it counts and how many cases it has." },
      { id: "b", label: "Scope → result after costs → rate → cases → rule", rationale: "That's backwards: each answer depends on the one before, starting from the exact rule." },
      { id: "c", label: "Rule → cases → rate vs 50% → result after costs → scope" },
      { id: "d", label: "Cases → rule → costs → rate → scope", rationale: "You can't count cases until the rule tells you what a case is." },
    ],
    correct: "c",
    explanation: "Each question needs the one before it: the rule defines a case, the cases give the rate, the rate and the costs give the result, and the scope tells you whether any of it applies to your market.",
    lesson: "2.1.8",
    concepts: ["pattern-name-vs-evidence"],
    hints: ["What do you need before you can count anything?"],
  },

  // 2.1.9
  {
    id: "q-2.1.9-1",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 1,
    prompt: "A real candle: open 100.20, high 100.80, low 99.90, close 100.50. What is its Heikin-Ashi close, in vUSD?",
    numeric: { answer: 100.35, tolerance: 0.01, unit: "vUSD" },
    explanation: "HA close = (100.20 + 100.80 + 99.90 + 100.50) ÷ 4 = 401.40 ÷ 4 = 100.35. It's an average, not a price that traded.",
    lesson: "2.1.9",
    concepts: ["alternative-chart-types"],
    hints: ["Add the four real prices.", "Divide the total by 4."],
    vary: {
      fields: { o: [98, 102, 0.05], up: [0.1, 0.8, 0.05], dn: [0.1, 0.8, 0.05], mv: [-0.6, 0.6, 0.05] },
      // Keep the sum a multiple of 0.04, so the HA close is a whole cent.
      constraints: ["abs(round((3 * o + 2 * mv + up - dn) * 25, 0) - (3 * o + 2 * mv + up - dn) * 25) < 0.000001"],
      answer: "round((o + max(o, o + mv) + up + min(o, o + mv) - dn + o + mv) / 4, 2)",
      prompt: "A real candle: open {o:2}, high {max(o, o + mv) + up:2}, low {min(o, o + mv) - dn:2}, close {o + mv:2}. What is its Heikin-Ashi close, in vUSD?",
      explanation: "HA close = ({o:2} + {max(o, o + mv) + up:2} + {min(o, o + mv) - dn:2} + {o + mv:2}) ÷ 4 = {answer:2}. It's an average, not a price that traded.",
      hint: "Add the four prices, then divide by 4.",
    },
  },
  {
    id: "q-2.1.9-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "A backtest of 'exit on the first red Heikin-Ashi candle' fills every exit at the HA close. Why are its results wrong?",
    options: [
      { id: "a", label: "HA charts always show more losses than candles", rationale: "HA doesn't change outcomes by itself. The error is filling at prices that never existed." },
      { id: "b", label: "The rule should fill at the HA open instead", rationale: "The HA open is an average too, not a traded price. Every fill must use a real price." },
      { id: "c", label: "Nothing: HA prices are close enough to real ones", rationale: "They can differ a lot. In this lesson the HA close was 0.30 above the real exit." },
      { id: "d", label: "HA closes are averages that never traded; real exits fill at real prices" },
    ],
    correct: "d",
    explanation: "An HA close is (O + H + L + C) ÷ 4, a number no one traded. A real exit fills at a real price, at the bid for a sale. In the lesson, HA showed 100.15 while the real sale filled at 99.85.",
    lesson: "2.1.9",
    concepts: ["alternative-chart-types"],
    hints: ["Could you actually have sold at an HA close?"],
  },
  {
    id: "q-2.1.9-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "A trader shows a Renko chart with a clean uptrend and says it formed in 'only a few bricks'. The brick size follows ATR, recalculated as new candles arrive.",
    prompt: "What should make you cautious?",
    options: [
      { id: "a", label: "Renko hides time, and ATR-sized bricks can redraw past bricks" },
      { id: "b", label: "Renko bricks are always too large", rationale: "Brick size is a setting. The problems are the missing time axis and bricks that change with ATR." },
      { id: "c", label: "Renko charts can't show downtrends", rationale: "They draw down bricks too. The issue is time and redrawing, not direction." },
      { id: "d", label: "Nothing: fewer bricks means a stronger trend", rationale: "A few bricks could have taken hours or weeks. Renko's x-axis counts bricks, not time." },
    ],
    correct: "a",
    explanation: "Renko's x-axis counts bricks, so a few bricks can hide a long, slow stretch. And when the box size follows ATR, a new ATR value can change how past bricks are drawn, so today's clean picture may not be what a trader saw at the time.",
    lesson: "2.1.9",
    concepts: ["alternative-chart-types"],
    hints: ["What does a Renko chart's x-axis count?", "What happens to past bricks when the box size changes?"],
  },
];

// ─── Glossary terms introduced in 2.1 ───────────────────────────────────────

const terms: GlossaryTerm[] = [
  // 2.1.1
  {
    id: "marubozu",
    term: "Marubozu",
    definition: "A candle with a long body and wicks under a tenth of the average range at both ends. White if it closed up, black if it closed down.",
    plain: "A candle with a long body and almost no shadows: one side controlled the whole period.",
    related: ["candle", "body", "wick"],
    lesson: "2.1.1",
  },
  {
    id: "spinning-top",
    term: "Spinning top",
    definition: "A candle whose body is shorter than the average body of the last 10 candles and whose two wicks are both longer than the body.",
    plain: "A small-bodied candle with shadows longer than the body on both sides.",
    related: ["candle", "doji", "high-wave-candle"],
    lesson: "2.1.1",
  },
  {
    id: "high-wave-candle",
    term: "High-wave candle",
    definition: "A short-bodied candle whose upper and lower wicks are both more than twice the body.",
    plain: "A small-bodied candle with shadows more than twice the body on both sides.",
    related: ["spinning-top", "doji"],
    lesson: "2.1.1",
  },
  {
    id: "doji",
    term: "Doji",
    definition: "A candle whose body is at most 10% of the average range of the last 10 candles, so its open and close are almost equal.",
    plain: "A candle whose open and close are almost equal, so it has almost no body.",
    related: ["candle", "body", "long-legged-doji", "dragonfly-doji", "gravestone-doji"],
    lesson: "2.1.1",
  },
  {
    id: "long-legged-doji",
    term: "Long-legged doji",
    definition: "A doji whose upper and lower wicks are both at least 40% of the average range (an app convention).",
    plain: "A doji with long shadows on both sides.",
    related: ["doji", "high-wave-candle"],
    lesson: "2.1.1",
  },
  {
    id: "dragonfly-doji",
    term: "Dragonfly doji",
    definition: "A doji with almost no upper wick and a lower wick of at least half the average range: open and close sit at the high.",
    plain: "A doji that opens and closes at its high, with a long lower shadow.",
    related: ["doji", "hammer"],
    lesson: "2.1.1",
  },
  {
    id: "gravestone-doji",
    term: "Gravestone doji",
    definition: "A doji with almost no lower wick and an upper wick of at least half the average range: open and close sit at the low.",
    plain: "A doji that opens and closes at its low, with a long upper shadow.",
    related: ["doji", "shooting-star"],
    lesson: "2.1.1",
  },
  // 2.1.2
  {
    id: "hammer",
    term: "Hammer",
    definition: "After a decline, a short body near the top of the candle, a lower shadow at least twice the body and almost no upper shadow.",
    plain: "After a decline, a small body near the top of the candle with a long lower shadow.",
    related: ["hanging-man", "pin-bar", "takuri-line", "wick"],
    lesson: "2.1.2",
  },
  {
    id: "hanging-man",
    term: "Hanging man",
    definition: "The hammer's shape after a rise. Taught as bearish; in Bulkowski's tests price kept rising about 59% of the time.",
    plain: "The hammer shape after a rise. In tested data it more often came before further rises.",
    related: ["hammer", "shooting-star"],
    lesson: "2.1.2",
  },
  {
    id: "inverted-hammer",
    term: "Inverted hammer",
    definition: "After a decline, a short body near the low with an upper shadow at least twice the body and almost no lower shadow. Taught as bullish; tested, it more often came before further falls.",
    plain: "After a decline, a small body near the low with a long upper shadow.",
    related: ["shooting-star", "hammer"],
    lesson: "2.1.2",
  },
  {
    id: "shooting-star",
    term: "Shooting star",
    definition: "After a rise, a short body near the low with an upper shadow at least twice the body and almost no lower shadow.",
    plain: "After a rise, a small body near the low with a long upper shadow.",
    related: ["inverted-hammer", "pin-bar", "gravestone-doji"],
    lesson: "2.1.2",
  },
  {
    id: "belt-hold",
    term: "Belt hold",
    definition: "A long candle with almost no wick at its opening end: a bullish belt hold opens at its low after a decline, a bearish one at its high after a rise.",
    plain: "A long candle that opens at one extreme and closes near the other.",
    related: ["marubozu", "candle"],
    lesson: "2.1.2",
  },
  {
    id: "pin-bar",
    term: "Pin bar",
    definition: "The price-action name for a candle with one long shadow that rejects a price, such as a hammer or a shooting star.",
    plain: "Price-action name for a candle with one long rejecting shadow, like a hammer or shooting star.",
    related: ["hammer", "shooting-star"],
    lesson: "2.1.2",
  },
  {
    id: "takuri-line",
    term: "Takuri line",
    definition: "A hammer whose lower shadow is at least three times its body.",
    plain: "A hammer with an extra-long lower shadow.",
    related: ["hammer"],
    lesson: "2.1.2",
  },
  // 2.1.3
  {
    id: "confirmation",
    term: "Confirmation",
    definition: "Waiting for a close beyond a pattern, above its high for a bullish one or below its low for a bearish one, before acting on it.",
    plain: "Waiting for a close beyond a pattern before acting on it.",
    related: ["entry", "reward-to-risk"],
    lesson: "2.1.3",
  },
  {
    id: "base-rate",
    term: "Base rate",
    definition: "How often an outcome occurs across all comparable cases, used as the benchmark before judging any single case.",
    plain: "How often an outcome happens across all similar cases, before you look at the current one.",
    related: ["win-rate", "sample-size", "random-walk"],
    lesson: "2.1.3",
  },
  // 2.1.4
  {
    id: "engulfing-pattern",
    term: "Engulfing pattern",
    definition: "Two opposite-coloured candles where the second real body covers the first: bullish after a decline, bearish after a rise. Wicks don't count.",
    plain: "Two candles where the second body fully covers the first, opposite-coloured body.",
    related: ["harami", "body"],
    lesson: "2.1.4",
  },
  {
    id: "harami",
    term: "Harami",
    definition: "Two candles where a short second body sits inside the previous long, opposite-coloured body.",
    plain: "Two candles where a small body sits inside the previous, larger body.",
    related: ["harami-cross", "engulfing-pattern"],
    lesson: "2.1.4",
  },
  {
    id: "harami-cross",
    term: "Harami cross",
    definition: "A harami whose second candle is a doji.",
    plain: "A harami whose second candle has almost no body.",
    related: ["harami", "doji"],
    lesson: "2.1.4",
  },
  // 2.1.5
  {
    id: "piercing-line",
    term: "Piercing line",
    definition: "After a decline, a long bearish candle, then a bullish one that opens below its low and closes above the middle of its body, but below its open.",
    plain: "After a long down candle, an up candle that opens lower and closes above the first body's midpoint.",
    related: ["dark-cloud-cover", "thrusting-line", "engulfing-pattern"],
    lesson: "2.1.5",
  },
  {
    id: "dark-cloud-cover",
    term: "Dark cloud cover",
    definition: "After a rise, a long bullish candle, then a bearish one that opens above its high and closes below the middle of its body, but above its open.",
    plain: "After a long up candle, a down candle that opens higher and closes below the first body's midpoint.",
    related: ["piercing-line", "engulfing-pattern"],
    lesson: "2.1.5",
  },
  {
    id: "on-neck-line",
    term: "On-neck line",
    definition: "After a long bearish candle, a bullish candle that opens lower and closes at about the first candle's low.",
    plain: "An up candle after a long down candle that closes at about the down candle's low.",
    related: ["in-neck-line", "thrusting-line"],
    lesson: "2.1.5",
  },
  {
    id: "in-neck-line",
    term: "In-neck line",
    definition: "After a long bearish candle, a bullish candle that opens lower and closes just inside the first body, within a few cents of its close.",
    plain: "An up candle after a long down candle that closes just inside its body.",
    related: ["on-neck-line", "thrusting-line"],
    lesson: "2.1.5",
  },
  {
    id: "thrusting-line",
    term: "Thrusting line",
    definition: "A bullish candle that opens below a long bearish candle's low and closes into its body, but not past the middle.",
    plain: "An up candle that closes into the previous down candle's body, but below its midpoint.",
    related: ["piercing-line", "in-neck-line"],
    lesson: "2.1.5",
  },
  {
    id: "tweezers",
    term: "Tweezers",
    definition: "Two neighbouring candles with matching lows after a decline (tweezer bottom) or matching highs after a rise (tweezer top).",
    plain: "Two neighbouring candles with matching highs (tweezer top) or matching lows (tweezer bottom).",
    related: ["support", "resistance"],
    lesson: "2.1.5",
  },
  {
    id: "kicker",
    term: "Kicker",
    definition: "A marubozu followed by an opposite-coloured marubozu that gaps beyond the first one's open.",
    plain: "Two opposite-coloured candles with no shadows, separated by a gap.",
    related: ["marubozu", "gap"],
    lesson: "2.1.5",
  },
  // 2.1.6
  {
    id: "morning-star",
    term: "Morning star",
    definition: "After a decline: a long bearish candle, a short body gapped below it, then a bullish candle closing at or above the middle of the first body.",
    plain: "At a low: a long down candle, a small gapped candle, then a strong up candle.",
    related: ["evening-star", "doji-star", "abandoned-baby"],
    lesson: "2.1.6",
  },
  {
    id: "evening-star",
    term: "Evening star",
    definition: "After a rise: a long bullish candle, a short body gapped above it, then a bearish candle closing at or below the middle of the first body.",
    plain: "At a high: a long up candle, a small gapped candle, then a strong down candle.",
    related: ["morning-star", "doji-star"],
    lesson: "2.1.6",
  },
  {
    id: "doji-star",
    term: "Doji star",
    definition: "A long candle followed by a doji whose body gaps away from it in the direction of the trend.",
    plain: "A long candle followed by a doji that gaps away from it.",
    related: ["doji", "morning-star"],
    lesson: "2.1.6",
  },
  {
    id: "abandoned-baby",
    term: "Abandoned baby",
    definition: "A star pattern whose middle doji gaps beyond the wicks of both neighbours: in the bullish version, its high is below both their lows.",
    plain: "A star pattern whose middle doji gaps beyond the shadows of both neighbouring candles.",
    related: ["morning-star", "doji-star", "gap"],
    lesson: "2.1.6",
  },
  {
    id: "tri-star",
    term: "Tri-star",
    definition: "Three doji in a row, the middle one gapped above or below the other two.",
    plain: "Three doji in a row, the middle one gapping above or below the other two.",
    related: ["doji", "doji-star"],
    lesson: "2.1.6",
  },
  {
    id: "window",
    term: "Window",
    definition: "The candlestick name for a gap: a rising window when a candle's low is above the previous high, a falling window when its high is below the previous low.",
    plain: "The candlestick name for a gap: a price range with no trading between two candles.",
    related: ["gap"],
    lesson: "2.1.6",
  },
  // 2.1.7
  {
    id: "three-white-soldiers",
    term: "Three white soldiers",
    definition: "After a decline, three long bullish candles in a row, each opening inside the previous body and closing near its high.",
    plain: "Three long up candles in a row, each opening inside the previous body and closing near its high.",
    related: ["three-black-crows", "advance-block"],
    lesson: "2.1.7",
  },
  {
    id: "three-black-crows",
    term: "Three black crows",
    definition: "After a rise, three long bearish candles in a row, each opening inside the previous body and closing near its low.",
    plain: "Three long down candles in a row, each closing near its low.",
    related: ["three-white-soldiers"],
    lesson: "2.1.7",
  },
  {
    id: "three-inside-up-down",
    term: "Three inside up / down",
    definition: "A harami followed by a third candle that closes beyond the first candle's open: above it for three inside up, below it for three inside down.",
    plain: "A harami followed by a candle that confirms the turn by closing beyond the pattern.",
    related: ["harami", "three-outside-up-down"],
    lesson: "2.1.7",
    aka: ["Three inside up", "Three inside down"],
  },
  {
    id: "three-outside-up-down",
    term: "Three outside up / down",
    definition: "An engulfing pattern followed by a third candle that closes further in the new direction.",
    plain: "An engulfing pattern followed by a candle that closes further in the new direction.",
    related: ["engulfing-pattern", "three-inside-up-down"],
    lesson: "2.1.7",
    aka: ["Three outside up", "Three outside down"],
  },
  {
    id: "advance-block",
    term: "Advance block",
    definition: "Three rising bullish candles with shrinking bodies and growing upper shadows, read as a rise losing strength. No published statistics.",
    plain: "Three rising candles with shrinking bodies and growing upper shadows: a rise losing strength.",
    related: ["three-white-soldiers"],
    lesson: "2.1.7",
  },
  // 2.1.8
  {
    id: "three-line-strike",
    term: "Three-line strike",
    definition: "Three candles in one direction, then a fourth that opens beyond the third and closes beyond the first one's open. Taught as continuation; the bearish version broke upward 84% of the time in Bulkowski's tests.",
    plain: "Three candles in one direction, then one long candle that wipes out all three.",
    related: ["engulfing-pattern"],
    lesson: "2.1.8",
  },
  {
    id: "rising-three-methods",
    term: "Rising three methods",
    definition: "A five-candle pause: a long bullish candle, three small candles inside its range, then a long bullish candle closing at a new high.",
    plain: "A five-candle pause: a long up candle, three small ones inside its range, another long up candle.",
    related: ["consolidation"],
    lesson: "2.1.8",
  },
  {
    id: "tasuki-gap",
    term: "Tasuki gap",
    definition: "In a trend, a gap followed by a candle in the opposite direction that moves into the gap without closing it.",
    plain: "A gap in a trend that the next, opposite candle moves into but does not close.",
    related: ["gap", "window"],
    lesson: "2.1.8",
  },
  {
    id: "matching-low",
    term: "Matching low",
    definition: "Two bearish candles with the same close during a fall. Taught as support; in Bulkowski's tests price kept falling 61% of the time.",
    plain: "Two down candles that close at the same price during a fall.",
    related: ["tweezers", "support"],
    lesson: "2.1.8",
  },
  // 2.1.9
  {
    id: "heikin-ashi",
    term: "Heikin-Ashi",
    definition: "Candles drawn from averages: close = (open + high + low + close) ÷ 4 of the real candle, open = the average of the previous Heikin-Ashi open and close. The values drawn are not traded prices.",
    plain: "Smoothed candles built from averages of real prices; their values are not prices anyone traded.",
    related: ["candle", "renko"],
    lesson: "2.1.9",
    aka: ["HA"],
  },
  {
    id: "renko",
    term: "Renko",
    definition: "A chart of equal bricks, each drawn only when price closes a full box size beyond the last brick; time is ignored.",
    plain: "A chart of equal bricks, drawn only when price moves a full brick; time is ignored.",
    related: ["box-size", "heikin-ashi", "point-and-figure"],
    lesson: "2.1.9",
  },
  {
    id: "point-and-figure",
    term: "Point & figure",
    definition: "A chart of X columns for rises and O columns for falls, built from a box size and a reversal amount, with no time axis.",
    plain: "A chart of X columns for rises and O columns for falls, built from a box size and reversal.",
    related: ["box-size", "reversal-amount", "renko"],
    lesson: "2.1.9",
    aka: ["P&F"],
  },
  {
    id: "box-size",
    term: "Box size",
    definition: "The price step that one Renko brick or one point & figure box stands for.",
    plain: "The price step that one brick or box stands for on a Renko or point & figure chart.",
    related: ["renko", "point-and-figure"],
    lesson: "2.1.9",
  },
  {
    id: "reversal-amount",
    term: "Reversal amount",
    definition: "The number of boxes price must move against the current point & figure column before a new column starts.",
    plain: "How many boxes price must move back before a point & figure chart starts a new column.",
    related: ["point-and-figure", "box-size"],
    lesson: "2.1.9",
  },
];

// ─── Concepts introduced in 2.1 ─────────────────────────────────────────────

const concepts: Concept[] = [
  {
    id: "candle-vocabulary",
    name: "Candle vocabulary",
    category: "technical_analysis",
    summary: "Classifying a candle's body and shadows against recent candles as long, short, doji, marubozu or spinning top.",
    body: [
      "A candle's size only means something next to its neighbours. The app follows the TA-Lib defaults: a body is long above the average body of the last 10 candles, very long above 3 times it, short below it, and a doji when it's at most 10% of the average range. Wicks are judged the same way.",
      "The names follow from those measurements: a marubozu is long with almost no wicks, a spinning top is short with both wicks longer than the body, a high-wave candle has wicks over twice the body, and the doji family is sorted by its wicks. The thresholds are settings, not truths, and the names describe an hour; they don't predict the next one.",
    ],
    example: "A LABX candle opens at 100.00 and closes at 100.50. After ten candles with bodies averaging 0.20, its 0.50 body is 2.5 times the average: long. After ten candles averaging 0.80, the same body is short.",
    related: ["candlestick", "volatility", "candle-range"],
    missions: ["M01"],
    lessons: ["2.1.1"],
  },
  {
    id: "rejection-candles",
    name: "Long-shadow candles",
    category: "technical_analysis",
    summary: "Hammers, shooting stars and their twins: candles whose long shadow marks a price that was rejected.",
    body: [
      "Two shapes carry four names. A small body near the top with a long lower shadow is a hammer after a decline and a hanging man after a rise. A small body near the bottom with a long upper shadow is an inverted hammer after a decline and a shooting star after a rise. The app wants the long shadow at least twice the body and the other one under a tenth of the average range.",
      "As signals they're unproven. In Bulkowski's US stock data the hammer broke upward first 60% of the time and the shooting star downward 59%, before costs; the hanging man and inverted hammer mostly did the opposite of their names.",
    ],
    example: "Open 99.40, high 99.55, low 98.60, close 99.50 after a decline: body 0.10, lower shadow 0.80 (8 times the body), upper shadow 0.05. A hammer. The identical shape after a rise is a hanging man.",
    related: ["candle-vocabulary", "trend", "base-rates"],
    missions: ["M01"],
    lessons: ["2.1.2"],
  },
  {
    id: "pattern-context",
    name: "Pattern context",
    category: "technical_analysis",
    summary: "The checks that decide whether a candle pattern counts: something to reverse, a meaningful location, size and volume.",
    body: [
      "A reversal pattern needs something to reverse (a decline before a bullish one), a location (its extreme at a support or resistance zone) and usually a confirming close. Size against ATR and volume against its average can be added as further filters.",
      "Whether context improves results is mixed evidence: some tests found an effect, others none, and there is no clean test of the filters. On a random walk no filter helps, because nothing in the past predicts the future.",
    ],
    example: "Two identical hammers: A after a 10-candle decline with its low in a support zone near 98.60; B in the middle of a sideways range. A passes the trend and location checks and waits for confirmation; B fails both and is skipped.",
    related: ["pattern-confirmation", "support-and-resistance", "trend", "base-rates"],
    missions: [],
    lessons: ["2.1.3"],
  },
  {
    id: "pattern-confirmation",
    name: "Pattern confirmation",
    category: "technical_analysis",
    summary: "Waiting for a close beyond the pattern before acting, which raises the hit rate but worsens the entry.",
    body: [
      "Confirmation means waiting until a later candle closes beyond the pattern: above its high for a bullish pattern, below its low for a bearish one. Some failures are filtered out, but the entry moves further from the stop and closer to the target.",
      "That makes the risk per unit larger, the position smaller and the reward-to-risk lower. The fair comparison between entering early and waiting is expectancy after costs, not win rate.",
    ],
    example: "Hammer low 98.60, stop 98.50, target 101.50. Buying at the hammer's close (ask 99.55) risks 1.05 for 1.95: R:R 1.86, 95 units on a 100.00 budget. After a confirming close at 99.90, buying at 99.95 risks 1.45 for 1.55: R:R 1.07, 68 units.",
    related: ["pattern-context", "reward-to-risk", "expectancy"],
    missions: ["M04"],
    lessons: ["2.1.3"],
  },
  {
    id: "engulfing-pattern",
    name: "Engulfing pattern",
    category: "technical_analysis",
    summary: "A two-candle pattern in which the second real body fully covers the first, opposite-coloured body.",
    body: [
      "A bullish engulfing follows a decline: a bearish candle, then a bullish one that opens at or below its close and closes at or above its open, with at least one end strictly beyond. Only bodies count; a candle whose wicks cover the first but whose body doesn't is an outside bar, not an engulfing.",
      "In Bulkowski's data the bearish version reversed 79% of the time yet ranked 91 of 103 for overall performance: the turns were frequent but small. A high hit rate with small moves can lose after costs, so judge it by expectancy.",
    ],
    example: "Candle 1 opens 101.00 and closes 100.20. Candle 2 opens 100.10 and closes 101.10: 100.10 ≤ 100.20 and 101.10 ≥ 101.00, a bullish engulfing. Had candle 2 opened at 100.30, its body wouldn't cover the bottom, whatever its wicks did.",
    related: ["harami-pattern", "pattern-context", "expectancy"],
    missions: [],
    lessons: ["2.1.4"],
  },
  {
    id: "harami-pattern",
    name: "Harami",
    category: "technical_analysis",
    summary: "A two-candle pattern in which a small real body sits inside the previous, larger body.",
    body: [
      "A harami is the engulfing turned around: a long body, then a short, opposite-coloured body inside it. If the second candle is a doji, it's a harami cross.",
      "It compares bodies, while the price-action inside bar compares whole ranges, so the two often coincide but not always. Bulkowski's bullish harami reversed 53% of the time, close to a coin flip.",
    ],
    example: "Candle 1 falls from 101.00 to 100.00; candle 2 rises from 100.20 to 100.50. Body 2 sits inside body 1: a bullish harami. If candle 2's high were 101.20, it would still be a harami, but not an inside bar.",
    related: ["engulfing-pattern", "candle-vocabulary"],
    missions: [],
    lessons: ["2.1.4"],
  },
  {
    id: "penetration-patterns",
    name: "Penetration patterns",
    category: "technical_analysis",
    summary: "Two-candle patterns named by how deep the second candle closes into the first body, from on-neck to piercing.",
    body: [
      "After a long bearish candle, a bullish candle that opens below its low gets a name from where it closes: on-neck at about the first low, in-neck just inside the body, thrusting up to the middle, piercing past the middle, engulfing at or above the first open. Depth = (close 2 − close 1) ÷ body 1.",
      "Theory calls the first three bearish continuation and the last two bullish reversal, so it flips at one cent past the middle. The data are thin: piercing 64% and dark cloud cover about 60% in Bulkowski's tests, no statistics for the other three.",
    ],
    example: "Candle 1: 101.00 down to 100.00, low 99.90. Candle 2 opens at 99.70. A close at 100.35 is 35% in, a thrusting line; at 100.70 it's 70% in, a piercing line; at 101.00 or above, an engulfing.",
    related: ["engulfing-pattern", "candle-vocabulary"],
    missions: [],
    lessons: ["2.1.5"],
  },
  {
    id: "star-patterns",
    name: "Star patterns",
    category: "technical_analysis",
    summary: "Three-candle turns with a small, gapped middle candle: morning and evening stars, doji stars, abandoned babies.",
    body: [
      "A morning star is a long bearish candle, a small body gapped below it, then a bullish candle closing at or above the middle of the first body (Bulkowski; TA-Lib's default asks less). A doji in the middle makes a doji star; a doji gapped beyond both neighbours' wicks makes an abandoned baby. Evening stars mirror them at tops.",
      "The gap rules matter. On a market that trades around the clock candles open where the last closed, so strict stars almost never appear, and relaxing the rule creates a different pattern whose rates are untested. Part of the published rates is built in: the third candle is already the move.",
    ],
    example: "Candle 1: 102.00 → 101.00. Candle 2: 100.80 → 100.70, its body below 101.00. Candle 3 must close at or above 101.50 for Bulkowski, above 101.30 for TA-Lib's default; a close at 101.60 completes the star.",
    related: ["pattern-confirmation", "price-gaps", "candle-vocabulary"],
    missions: [],
    lessons: ["2.1.6"],
  },
  {
    id: "confirmed-candle-patterns",
    name: "Confirmed candle patterns",
    category: "technical_analysis",
    summary: "Multi-candle patterns whose last candle already confirms the move, such as three inside up or three white soldiers.",
    body: [
      "Three inside up is a harami plus a close above the first candle's open; three outside up is an engulfing plus a higher close; three white soldiers and three black crows are three strong candles in a row. Each ends with its own confirming candle.",
      "Their reversal rates look higher partly by construction: the last candle closes near the pattern's edge, so a break that way needs little more. On a random walk, three inside up 'broke up first' 74% of the time against the harami's 45%, and both lost the costs. Buying at the close also means a wide stop and less room to the next zone.",
    ],
    example: "Soldiers from 99.90 to 102.00, low 99.80. Buy at 102.05, stop 99.70: risk 2.35. Resistance at 103.00 leaves a reward of 0.95, so R:R = 0.40, and 100.00 vUSD of risk buys only 42 units.",
    related: ["pattern-confirmation", "reward-to-risk", "harami-pattern"],
    missions: [],
    lessons: ["2.1.7"],
  },
  {
    id: "pattern-name-vs-evidence",
    name: "Names versus evidence",
    category: "technical_analysis",
    summary: "Judging any pattern by its rule, sample size, base rate, result after costs and scope, not by its name.",
    body: [
      "Several patterns tested against their own names: the hanging man kept rising about 59% of the time, the inverted hammer kept falling about 65%, the bearish three-line strike broke upward 84%. A name is a story; only data say which way a pattern leans.",
      "Five questions judge any pattern: what is the exact rule, how many cases, what rate compared with 50%, what result after costs, and in which market, timeframe and years. On a random walk, shapes with and without names score the same, about 50%: that's the control a pattern has to beat.",
    ],
    example: "A rare pattern is quoted at 86%. With 14 cases, 12 wins make 86%, and the true rate could be as low as about 60%. The card's second question, how many cases, stops it before the rate is believed.",
    related: ["base-rates", "sample-size", "confirmation-bias", "random-walk"],
    missions: ["M02"],
    lessons: ["2.1.8"],
  },
  {
    id: "alternative-chart-types",
    name: "Alternative chart types",
    category: "technical_analysis",
    summary: "Heikin-Ashi, Renko and point & figure: ways of drawing price whose plotted values are not traded prices.",
    body: [
      "Heikin-Ashi candles average real prices: close = (O + H + L + C) ÷ 4, open = the average of the previous HA open and close. They're smoother and lag. Renko draws equal bricks only when price moves a full box, and point & figure stacks Xs and Os by box size and reversal amount; both drop time.",
      "None of their values is a price you could trade, so stops, fills and backtests must use real prices. Predictive claims built on them are unproven, though point & figure signals at least follow fixed rules and can be tested.",
    ],
    example: "Real candle 8: 100.40 / 100.60 / 99.70 / 99.90. HA close = 400.60 ÷ 4 = 100.15, below the HA open of 100.61, so the HA candle is red. An exit on it fills at the real bid, 99.85, not at 100.15.",
    related: ["chart-types", "candlestick", "trend"],
    missions: [],
    lessons: ["2.1.9"],
  },
];

/** Unit 2.1 · Candlesticks in context (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_2_1: UnitContent = { lessons, questions, terms, concepts };
