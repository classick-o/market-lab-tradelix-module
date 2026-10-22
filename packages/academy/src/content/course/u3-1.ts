import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, MarkRole, Question, UnitContent } from "../../types";

/*
 * Unit 3.1 · Liquidity and stops: 3.1.1–3.1.7.
 *
 * Conventions in this file:
 * - Candle indices in layers and tap zones are 0-based; copy uses 1-based candle numbers ("candle 24" is index 23).
 * - Swing high (low): a high (low) above (below) the two candles on each side (swingPoints, k = 2).
 * - "Synthetic replay" charts carry x-ray order sizes that are lesson design data, not facts about any market.
 * - R0 is a random walk: each candle is 12 Gaussian sub-steps, open = previous close, prices in cents
 *   (scratch generator, mulberry32 seeds below). Every R0 figure quoted in the copy comes from these runs.
 * - The two position-size tasks use a 20,000.00 account at 0.5% (budget 100.00), so the no-leverage cap
 *   never binds on the sizes the lessons ask for.
 * - Every series is written for the lesson and checked against each number the copy quotes.
 */

/** Rows of [open, high, low, close] → candles. */
const k = (rows: [number, number, number, number][]): CandleData[] => rows.map(([o, h, l, c]) => ({ o, h, l, c }));
const mark = (index: number, at: "high" | "low" | "close" | "open", label?: string, role: MarkRole = "concept"): ChartLayer => ({ kind: "marker", index, at, label, role });
const pair = (i: number, a: number, j: number, b: number, role: MarkRole = "accent"): ChartLayer => ({ kind: "path", points: [{ index: i, price: a }, { index: j, price: b }], role, dashed: true });

// ─── Chart data ─────────────────────────────────────────────────────────────

/**
 * 3.1.1: 40 candles. c1–c8 fall from 101.60 into a range; c9–c40 range between 99.20 and 101.00.
 * Swing lows 99.22 (c8), 99.25 (c18), 99.20 (c30); swing highs 100.96 (c13), 101.00 (c24), 100.98 (c36). Last close 100.45.
 * X-ray (design data): buy limits 600 at 99.40–99.80; sell stops 900 at 99.10–99.19 and 400 at 99.90–99.99;
 * long take-profits at 101.00, short take-profits at 100.00; buy stops 700 at 101.01–101.10; the other two of the five largest
 * stop pools: buy stops 300 at 101.43–101.52 (above c2's high) and sell stops 250 at 98.60–98.69.
 * Base rate: five non-overlapping hit bands 0.20 wide on a 3.20 axis → p = 0.3125; 4 markers: 1.25 hits expected, P(≥ 2) = 37.0%.
 */
const R40: CandleData[] = k([
  [101.45, 101.60, 101.30, 101.35], [101.35, 101.42, 101.02, 101.10], [101.10, 101.16, 100.68, 100.76], [100.76, 100.88, 100.40, 100.45], [100.45, 100.52, 99.96, 100.04],
  [100.04, 100.12, 99.66, 99.72], [99.72, 99.80, 99.31, 99.39], [99.39, 99.50, 99.22, 99.44], [99.44, 99.76, 99.37, 99.70], [99.70, 100.08, 99.64, 100.02],
  [100.02, 100.40, 99.97, 100.33], [100.33, 100.62, 100.24, 100.58], [100.58, 100.96, 100.52, 100.84], [100.84, 100.90, 100.48, 100.55], [100.55, 100.66, 100.30, 100.38],
  [100.38, 100.44, 99.92, 99.98], [99.98, 100.06, 99.55, 99.62], [99.62, 99.68, 99.25, 99.34], [99.34, 99.66, 99.29, 99.60], [99.60, 99.92, 99.55, 99.87],
  [99.87, 100.18, 99.80, 100.12], [100.12, 100.48, 100.06, 100.42], [100.42, 100.80, 100.38, 100.74], [100.74, 101.00, 100.70, 100.88], [100.88, 100.94, 100.60, 100.66],
  [100.66, 100.74, 100.28, 100.34], [100.34, 100.41, 100.02, 100.08], [100.08, 100.13, 99.68, 99.75], [99.75, 99.82, 99.40, 99.46], [99.46, 99.55, 99.20, 99.31],
  [99.31, 99.64, 99.27, 99.58], [99.58, 99.92, 99.52, 99.88], [99.88, 100.24, 99.83, 100.18], [100.18, 100.52, 100.11, 100.46], [100.46, 100.80, 100.40, 100.72],
  [100.72, 100.98, 100.64, 100.79], [100.79, 100.85, 100.50, 100.57], [100.57, 100.63, 100.32, 100.40], [100.40, 100.55, 100.33, 100.49], [100.49, 100.58, 100.38, 100.45],
]);
const R40_RANGE: [number, number] = [98.4, 101.6];

/**
 * 3.1.3: the session up to the break of yesterday's high, 101.00. Swing lows 100.26 (c6), 100.46 (c13), 100.65 (c18):
 * 100.65 is the last higher low inside the range. Highest high before the break 100.99 (c23).
 * BRK_NOW is candle 24 mid-bar (101.08); SWEEP and BREAK are its two endings (c24–c28).
 */
const BRK: CandleData[] = k([
  [100.30, 100.42, 100.18, 100.36], [100.36, 100.50, 100.30, 100.46], [100.46, 100.62, 100.40, 100.58], [100.58, 100.70, 100.50, 100.54], [100.54, 100.60, 100.36, 100.42],
  [100.42, 100.48, 100.26, 100.30], [100.30, 100.52, 100.28, 100.48], [100.48, 100.66, 100.44, 100.62], [100.62, 100.80, 100.58, 100.74], [100.74, 100.88, 100.70, 100.82],
  [100.82, 100.92, 100.68, 100.72], [100.72, 100.78, 100.55, 100.60], [100.60, 100.66, 100.46, 100.52], [100.52, 100.70, 100.48, 100.66], [100.66, 100.84, 100.62, 100.80],
  [100.80, 100.95, 100.76, 100.88], [100.88, 100.92, 100.74, 100.78], [100.78, 100.82, 100.65, 100.70], [100.70, 100.86, 100.68, 100.84], [100.84, 100.94, 100.80, 100.90],
  [100.90, 100.97, 100.84, 100.88], [100.88, 100.98, 100.85, 100.94], [100.94, 100.99, 100.90, 100.96],
]);
const BRK_NOW: CandleData[] = k([[100.96, 101.08, 100.94, 101.08]]);
/** Ending A: c24 closes at 100.94 (high 101.12), back inside. */
const SWEEP: CandleData[] = k([[100.96, 101.12, 100.90, 100.94], [100.94, 100.98, 100.78, 100.82], [100.82, 100.88, 100.70, 100.76], [100.76, 100.84, 100.66, 100.80], [100.80, 100.90, 100.74, 100.86]]);
/** Ending B: c24 closes at 101.22, c25 at 101.40 (follow-through). */
const BREAK: CandleData[] = k([[100.96, 101.26, 100.94, 101.22], [101.22, 101.44, 101.18, 101.40], [101.40, 101.52, 101.30, 101.46], [101.46, 101.66, 101.42, 101.60], [101.60, 101.72, 101.50, 101.58]]);

/**
 * 3.1.4: 61 candles; ATR (14) at the last candle 0.598 (0.60). Swing highs 100.20 (c4), 100.26 (c10), 100.62 (c16), 100.64 (c22),
 * 101.48 (c29), 101.52 (c35), 101.40 (c41), 100.98 (c47), 101.08 (c53), 101.17 (c59). Neighbouring pairs with no higher high
 * between: within 0.03 → c16–c22; within 0.06 → + c4–c10, c29–c35; within 0.12 → + c35–c41, c47–c53, c53–c59 (6).
 * Any two swing highs within 0.06 of each other are exactly those three pairs, so a band ≤ 0.06 tall holds two highs only there.
 */
const EQ: CandleData[] = k([
  [99.35, 99.59, 99.16, 99.40], [99.40, 99.79, 99.21, 99.60], [99.60, 99.99, 99.41, 99.80], [99.80, 100.20, 99.61, 100.00], [100.00, 100.19, 99.58, 99.77],
  [99.77, 99.96, 99.34, 99.53], [99.53, 99.72, 99.00, 99.30], [99.30, 99.71, 99.11, 99.52], [99.52, 99.92, 99.33, 99.73], [99.73, 100.26, 99.54, 99.95],
  [99.95, 100.14, 99.62, 99.81], [99.81, 100.00, 99.49, 99.68], [99.68, 99.87, 99.30, 99.54], [99.54, 99.98, 99.35, 99.79], [99.79, 100.23, 99.60, 100.04],
  [100.04, 100.62, 99.85, 100.29], [100.29, 100.48, 99.93, 100.12], [100.12, 100.31, 99.76, 99.95], [99.95, 100.14, 99.50, 99.78], [99.78, 100.16, 99.59, 99.97],
  [99.97, 100.35, 99.78, 100.16], [100.16, 100.64, 99.97, 100.36], [100.36, 100.55, 100.00, 100.19], [100.19, 100.38, 99.84, 100.03], [100.03, 100.22, 99.60, 99.86],
  [99.86, 100.34, 99.67, 100.15], [100.15, 100.63, 99.96, 100.44], [100.44, 100.91, 100.25, 100.72], [100.72, 101.48, 100.53, 101.01], [101.01, 101.20, 100.68, 100.87],
  [100.87, 101.06, 100.54, 100.73], [100.73, 100.92, 100.30, 100.60], [100.60, 100.99, 100.41, 100.80], [100.80, 101.20, 100.61, 101.01], [101.01, 101.52, 100.82, 101.22],
  [101.22, 101.41, 100.85, 101.04], [101.04, 101.23, 100.67, 100.86], [100.86, 101.05, 100.40, 100.68], [100.68, 101.03, 100.49, 100.84], [100.84, 101.18, 100.65, 100.99],
  [100.99, 101.40, 100.80, 101.15], [101.15, 101.34, 100.67, 100.86], [100.86, 101.05, 100.38, 100.57], [100.57, 100.76, 99.90, 100.28], [100.28, 100.61, 100.09, 100.42],
  [100.42, 100.76, 100.23, 100.57], [100.57, 100.98, 100.38, 100.71], [100.71, 100.90, 100.33, 100.52], [100.52, 100.71, 100.14, 100.33], [100.33, 100.52, 99.85, 100.13],
  [100.13, 100.54, 99.94, 100.35], [100.35, 100.75, 100.16, 100.56], [100.56, 101.08, 100.37, 100.77], [100.77, 100.96, 100.41, 100.60], [100.60, 100.79, 100.25, 100.44],
  [100.44, 100.63, 100.00, 100.27], [100.27, 100.66, 100.08, 100.47], [100.47, 100.87, 100.28, 100.68], [100.68, 101.17, 100.49, 100.88], [100.88, 101.07, 100.52, 100.71],
  [100.71, 100.90, 100.36, 100.55],
]);

/**
 * 3.1.4 B5: yesterday is c1–c16 (high 100.80 on c6, low 99.40 on c12); today is c17–c30 (open 100.30, high so far 100.55 on c19,
 * low 99.85 on c24).
 */
const REF: CandleData[] = k([
  [99.90, 100.02, 99.84, 99.98], [99.98, 100.20, 99.94, 100.16], [100.16, 100.38, 100.10, 100.34], [100.34, 100.56, 100.28, 100.50], [100.50, 100.66, 100.44, 100.62],
  [100.62, 100.80, 100.56, 100.70], [100.70, 100.74, 100.46, 100.52], [100.52, 100.58, 100.28, 100.34], [100.34, 100.40, 100.06, 100.12], [100.12, 100.18, 99.84, 99.90],
  [99.90, 99.96, 99.62, 99.68], [99.68, 99.74, 99.40, 99.52], [99.52, 99.76, 99.46, 99.70], [99.70, 99.94, 99.64, 99.88], [99.88, 100.10, 99.82, 100.04],
  [100.04, 100.24, 99.98, 100.18], [100.30, 100.44, 100.24, 100.38], [100.38, 100.50, 100.32, 100.46], [100.46, 100.55, 100.36, 100.42], [100.42, 100.48, 100.22, 100.28],
  [100.28, 100.34, 100.08, 100.14], [100.14, 100.20, 99.96, 100.02], [100.02, 100.08, 99.88, 99.94], [99.94, 100.00, 99.85, 99.92], [99.92, 100.04, 99.88, 100.00],
  [100.00, 100.12, 99.94, 100.08], [100.08, 100.20, 100.02, 100.16], [100.16, 100.26, 100.10, 100.12], [100.12, 100.24, 100.06, 100.20], [100.20, 100.28, 100.14, 100.22],
]);

/** 3.1.5 B2: the only three-candle gap is c5–c7 (c5 high 100.40, c7 low 100.70). c4's high, 100.32, keeps c4–c6 from gapping. */
const FVG_FIG: CandleData[] = k([
  [100.10, 100.22, 99.98, 100.04], [100.04, 100.16, 99.96, 100.12], [100.12, 100.26, 100.06, 100.10], [100.10, 100.32, 100.02, 100.20],
  [100.20, 100.40, 100.12, 100.35], [100.35, 101.25, 100.30, 101.20], [101.20, 101.50, 100.70, 101.40],
]);

/**
 * 3.1.5 B3: exactly two three-candle gaps. Bullish c11–c13 (c11 high 100.70, c13 low 101.00); bearish c20–c22 (c20 low 101.10,
 * c22 high 100.85). c6 is a large bullish candle without a gap: c7's low, 100.10, is under c5's high, 100.15.
 */
const FVG30: CandleData[] = k([
  [100.00, 100.30, 99.80, 100.10], [100.10, 100.38, 99.90, 100.20], [100.20, 100.42, 99.95, 100.05], [100.05, 100.25, 99.78, 99.90], [99.90, 100.15, 99.70, 100.05],
  [100.05, 100.90, 100.00, 100.82], [100.82, 100.95, 100.10, 100.30], [100.30, 100.55, 100.20, 100.45], [100.45, 100.60, 100.25, 100.35], [100.35, 100.58, 100.22, 100.50],
  [100.50, 100.70, 100.40, 100.62], [100.62, 101.55, 100.58, 101.48], [101.48, 101.80, 101.00, 101.70], [101.70, 101.85, 101.45, 101.60], [101.60, 101.75, 101.35, 101.42],
  [101.42, 101.62, 101.30, 101.55], [101.55, 101.70, 101.40, 101.48], [101.48, 101.66, 101.28, 101.36], [101.36, 101.50, 101.20, 101.30], [101.30, 101.42, 101.10, 101.18],
  [101.18, 101.22, 100.30, 100.38], [100.38, 100.85, 100.20, 100.70], [100.70, 100.90, 100.50, 100.58], [100.58, 100.75, 100.40, 100.65], [100.65, 100.88, 100.55, 100.80],
  [100.80, 100.95, 100.62, 100.70], [100.70, 100.82, 100.48, 100.55], [100.55, 100.72, 100.42, 100.68], [100.68, 100.92, 100.60, 100.85], [100.85, 101.00, 100.72, 100.78],
]);

/**
 * 3.1.6 B1: drop-base-rally. Base c9–c10 (zone 99.02–99.30); the rally reaches 100.20 by c13: 0.90 above the zone.
 * ATR (14) at the last candle 0.312 (0.31): 0.90 ÷ 0.31 = 2.9 ATR. Lowest low after c13: 99.78, so the zone is fresh.
 */
const DBR: CandleData[] = k([
  [100.60, 100.70, 100.36, 100.42], [100.42, 100.48, 100.18, 100.24], [100.24, 100.30, 99.98, 100.04], [100.04, 100.10, 99.80, 99.86], [99.86, 99.92, 99.62, 99.68],
  [99.68, 99.74, 99.48, 99.54], [99.54, 99.60, 99.36, 99.42], [99.42, 99.48, 99.10, 99.16], [99.16, 99.30, 99.02, 99.22], [99.22, 99.28, 99.05, 99.14],
  [99.14, 99.70, 99.10, 99.64], [99.64, 100.02, 99.58, 99.96], [99.96, 100.20, 99.90, 100.12], [100.12, 100.30, 100.00, 100.22], [100.22, 100.36, 100.10, 100.18],
  [100.18, 100.26, 99.96, 100.04], [100.04, 100.14, 99.84, 99.92], [99.92, 100.08, 99.78, 100.02], [100.02, 100.28, 99.96, 100.20], [100.20, 100.44, 100.14, 100.38],
  [100.38, 100.52, 100.30, 100.46], [100.46, 100.58, 100.36, 100.50],
]);

/**
 * 3.1.7 hook, B1, B3: a range capped at 101.00 (c1–c16); c17 closes at 101.10 (break), c19 at 100.88 (back inside).
 * c21 breaks 100.60; the low is 100.40 (c22); c26 closes at 100.92. Reveal c27–c30: highs 101.08 and 101.10, then lower.
 * X-ray (design data): trapped longs 600 at 101.05, 500 at 101.10, 300 at 101.15 (average 101.089); 900 with stops under 100.60.
 */
const TRAP: CandleData[] = k([
  [100.40, 100.62, 100.34, 100.58], [100.58, 100.84, 100.52, 100.78], [100.78, 100.98, 100.70, 100.86], [100.86, 100.90, 100.60, 100.66], [100.66, 100.70, 100.36, 100.42],
  [100.42, 100.46, 100.10, 100.16], [100.16, 100.20, 99.86, 99.94], [99.94, 100.12, 99.82, 100.06], [100.06, 100.34, 100.00, 100.28], [100.28, 100.58, 100.22, 100.52],
  [100.52, 100.82, 100.46, 100.76], [100.76, 101.00, 100.70, 100.90], [100.90, 100.94, 100.62, 100.68], [100.68, 100.72, 100.40, 100.48], [100.48, 100.62, 100.42, 100.58],
  [100.58, 100.90, 100.54, 100.86], [100.86, 101.16, 100.84, 101.10], [101.10, 101.18, 101.02, 101.06], [101.06, 101.08, 100.84, 100.88], [100.88, 100.92, 100.66, 100.70],
  [100.70, 100.73, 100.42, 100.46], [100.46, 100.56, 100.40, 100.48], [100.48, 100.64, 100.44, 100.60], [100.60, 100.76, 100.56, 100.72], [100.72, 100.86, 100.68, 100.82],
  [100.82, 100.96, 100.78, 100.92], [100.92, 101.08, 100.88, 101.02], [101.02, 101.10, 100.94, 100.98], [100.98, 101.04, 100.82, 100.86], [100.86, 100.90, 100.70, 100.74],
]);

/** 3.1.7 B4: resistance turns 100.98 (c3), 101.00 (c8), 100.97 (c12); c15 closes at 101.30; the retest c20 dips to 101.02 and closes at 101.20. */
const RR: CandleData[] = k([
  [100.20, 100.46, 100.14, 100.40], [100.40, 100.70, 100.34, 100.64], [100.64, 100.98, 100.58, 100.88], [100.88, 100.92, 100.60, 100.66], [100.66, 100.70, 100.40, 100.46],
  [100.46, 100.62, 100.38, 100.56], [100.56, 100.82, 100.50, 100.76], [100.76, 101.00, 100.70, 100.86], [100.86, 100.90, 100.56, 100.62], [100.62, 100.68, 100.44, 100.52],
  [100.52, 100.74, 100.48, 100.70], [100.70, 100.97, 100.64, 100.90], [100.90, 100.94, 100.72, 100.80], [100.80, 100.96, 100.76, 100.92], [100.92, 101.36, 100.88, 101.30],
  [101.30, 101.52, 101.24, 101.46], [101.46, 101.62, 101.38, 101.50], [101.50, 101.54, 101.26, 101.32], [101.32, 101.36, 101.10, 101.16], [101.16, 101.24, 101.02, 101.20],
  [101.20, 101.44, 101.16, 101.40], [101.40, 101.62, 101.34, 101.56], [101.56, 101.74, 101.48, 101.70], [101.70, 101.84, 101.62, 101.78],
]);

/**
 * 3.1.7 B7–B8: a failed breakdown. Range low 99.00 (c11); c15 closes at 98.88; c17 closes back inside (99.10); c19 rallies through
 * 99.40 (high 99.62); c23 closes at 99.26, falling. X-ray (design data): trapped shorts 400 at 98.96, 800 at 98.90, 400 at 98.84
 * (average 98.90); 1,000 with stops above 99.40; the 600 without stops (150/300/150 at the same prices) also average 98.90.
 */
const MIRROR: CandleData[] = k([
  [99.80, 99.92, 99.56, 99.62], [99.62, 99.68, 99.30, 99.36], [99.36, 99.40, 99.04, 99.12], [99.12, 99.42, 99.08, 99.36], [99.36, 99.70, 99.30, 99.64],
  [99.64, 99.98, 99.58, 99.90], [99.90, 100.18, 99.84, 100.06], [100.06, 100.10, 99.78, 99.84], [99.84, 99.88, 99.50, 99.56], [99.56, 99.60, 99.22, 99.28],
  [99.28, 99.34, 99.00, 99.10], [99.10, 99.36, 99.06, 99.30], [99.30, 99.38, 99.10, 99.16], [99.16, 99.20, 98.98, 99.02], [99.02, 99.04, 98.82, 98.88],
  [98.88, 98.98, 98.80, 98.94], [98.94, 99.16, 98.90, 99.10], [99.10, 99.30, 99.06, 99.26], [99.26, 99.62, 99.22, 99.56], [99.56, 99.88, 99.50, 99.82],
  [99.82, 99.86, 99.60, 99.66], [99.66, 99.70, 99.40, 99.46], [99.46, 99.50, 99.20, 99.26],
]);

/**
 * 3.1.2 Try: for each stop from 99.40 to 99.87 (one cent apart), the most whole units whose loss at the stop, both commissions
 * included, stays within 100.00 (long at 100.60). Computed with the position-size widget's own math.
 */
const FIT_312 = [
  76, 77, 78, 78, 79, 79, 80, 81, 81, 82, 83, 84, 84, 85, 86, 86, 87, 88, 89, 90, 90, 91, 92, 93, 94, 95, 96, 97, 98, 98,
  99, 100, 102, 103, 104, 105, 106, 107, 108, 109, 111, 112, 113, 114, 116, 117, 119, 120,
];

// ─── 3.1.1 · Liquidity is resting orders ────────────────────────────────────

const L311: Lesson = {
  id: "3.1.1",
  title: "Liquidity is resting orders",
  topic: "order_types",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Chart 'liquidity' is resting orders: limits and take-profits that absorb flow and stop-losses that become market orders, sitting where people plausibly put them, without pulling price toward them.",
  objectives: [
    'Name the three kinds of resting orders behind chart "liquidity" (limit entries, take-profits, stop-losses) and say which of them become market orders when price reaches them.',
    "Mark at least four plausible clustering places on a chart (round numbers, just beyond swing extremes, prior-day high and low, range edges) before the reveal.",
    "Explain why liquidity being present at a level does not mean price is attracted to it.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "check", ref: "order_types", label: "Order types check" },
  ],
  script: {
    unit: "3.1",
    courseId: "3.1.1",
    hook: {
      prompt: "LABX has ranged between 99.20 and 101.00 since candle 9. Where are most sell stops resting right now? Tap one of the five spots.",
      control: {
        kind: "tap",
        chart: { candles: R40, range: R40_RANGE, layers: [{ kind: "level", price: 100, role: "neutral", label: "100.00" }] },
        zones: [
          { id: "above", label: "101.05, just above the range high", index: 25, price: 101.05, feedback: "Stops above the range high protect shorts. Those are buy stops, not sell stops." },
          { id: "at", label: "101.00, the range high", index: 28, price: 101.0, feedback: "Orders exactly on the high are mostly longs' take-profits: sell limits, not stops." },
          { id: "mid", label: "100.10, mid-range", index: 31, price: 100.1, feedback: "Nothing obvious sits mid-range, so there's no particular reason for a stop pool there." },
          { id: "round", label: "99.95, just under 100.00", index: 34, price: 99.95, feedback: "A real pool: stops of longs who bought above 100.00. In this replay it was the second largest." },
          { id: "low", label: "99.15, just under the range low", index: 37, price: 99.15 },
        ],
        answer: "low",
      },
      compare: "You tapped {yours}. In this replay's x-ray, the largest sell-stop pool sat just under the range low, 99.10–99.19, and the second just under 100.00.",
      concept: "liquidity-pool",
    },
    learn: [
      {
        kind: "explain",
        title: "What chart liquidity is",
        text: "In chart talk, [[liquidity]] means orders waiting at a price: [[limit-order|limit]] entries, [[take-profit|take-profits]] and [[stop-loss|stop-losses]]. They are [[resting-order|resting orders]], and a crowd of them near one price is a [[liquidity-pool]]. The orders are real. Their size and place are hidden: a chart only lets you infer where they plausibly sit.",
      },
      {
        kind: "figure",
        title: "The x-ray of one range",
        figure: {
          kind: "chart",
          chart: { candles: R40, range: R40_RANGE },
          steps: [
            { text: "Buy limits wait under price, near the range low: 600 units from 99.40 to 99.80.", layers: [{ kind: "zone", from: 99.4, to: 99.8, role: "support", label: "Buy limits 600" }] },
            {
              text: "Sell stops: 900 just under the range low, 400 just under 100.00.",
              layers: [
                { kind: "zone", from: 99.1, to: 99.19, role: "stop", label: "Sell stops 900" },
                { kind: "zone", from: 99.9, to: 99.99, role: "stop", label: "Stops 400" },
              ],
            },
            {
              text: "Take-profits: longs' at 101.00, shorts' at 100.00. Shorts' buy stops wait at 101.01–101.10.",
              layers: [
                { kind: "level", price: 101, role: "target", label: "Long TPs" },
                { kind: "level", price: 100, role: "target", label: "Short TPs" },
                { kind: "zone", from: 101.01, to: 101.1, role: "stop", label: "Buy stops 700" },
              ],
            },
            { text: "Limits and take-profits absorb flow. Stops, once hit, become market orders that push." },
          ],
        },
        text: "Synthetic replay with the x-ray on: the simulator shows every hidden order. A real chart never does. The sizes are this replay's, not facts about any market.",
        concept: "liquidity-pool",
      },
      {
        kind: "match",
        title: "What each order does",
        prompt: "Price reaches each resting order. Match it with what it does.",
        pairs: [
          { left: "Buy limit under price", right: "Fills passively and absorbs selling", wrong: "A limit waits at its price and takes the other side. It soaks up sellers instead of adding to them." },
          { left: "Sell stop under the range low", right: "Becomes a market sell and adds to selling", wrong: "A stop sleeps until price reaches it, then turns into a market order." },
          { left: "Long's take-profit at 101.00", right: "A passive sell limit that absorbs buying", wrong: "A take-profit is a limit order. It sells to the buyers who arrive at 101.00." },
          { left: "Short's buy stop at 101.05", right: "Becomes a market buy and adds to buying", wrong: "A short's protective stop is a buy stop: once hit, it buys at market." },
        ],
        concept: "liquidity-pool",
      },
      {
        kind: "predict",
        title: "Into the pool",
        prompt: "Price falls to the range low, where 900 units of sell stops wait. Does the stop pool slow the fall or speed it up?",
        control: {
          kind: "choice",
          choices: [
            { id: "slow", label: "Slows it", feedback: "Stops aren't buyers. Once triggered they sell at market, so they add to the fall." },
            { id: "speed", label: "Speeds it up" },
            { id: "none", label: "No effect", feedback: "Up to 900 units of market selling at once moves a thin book. The effect can be large." },
          ],
          answer: "speed",
        },
        reveal: "It speeds it up. Each triggered stop becomes a market sell, so up to 900 units hit the bids at once. The 600 units of buy limits higher up absorbed part of the selling first. Which side is bigger decides how far price travels.",
        concept: "liquidity-pool",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Liquidity being there is not price being pulled there. Orders wait where people put them; price reaches them only if it gets there for other reasons. 'Price is drawn to liquidity' has no evidence behind it (grade D), and it treats the market like a person with a goal.",
      },
      // Try (liquidity-xray isn't built yet): mark the plausible places, then the base rate of random markers.
      {
        kind: "match",
        title: "Mark the likely pools",
        prompt: "Before any reveal, sort these places: a plausible spot for a stop pool, or no particular reason for one?",
        columns: ["Place", "Stop pool?"],
        pairs: [
          { left: "Just under the range low, 99.10–99.19", right: "Plausible pool", wrong: "Longs who bought near the low put their stops just under it." },
          { left: "Just under 100.00, a round number", right: "Plausible pool", wrong: "Stops gather just beyond round numbers (Osler, grade B)." },
          { left: "Just above yesterday's high", right: "Plausible pool", wrong: "A prior-day high is a level everyone sees. Shorts' stops plausibly sit just above it." },
          { left: "Just above the range high, 101.01–101.10", right: "Plausible pool", wrong: "Shorts who sold near the top put buy stops just above it." },
          { left: "100.37, mid-range, no level nearby", right: "No particular reason", wrong: "Nothing obvious sits there, so there's no reason for a crowd." },
          { left: "99.63, between two swings", right: "No particular reason", wrong: "It isn't beyond any extreme or any level people watch." },
        ],
        correct: "Four kinds of place: range edges, round numbers, prior-day highs and lows, and just beyond swing extremes. All plausible, none certain.",
        concept: "liquidity-pool",
      },
      {
        kind: "worked",
        title: "Random markers hit too",
        lines: [
          "Score: a marker hits if it lands within 0.10 of one of the five biggest stop pools.",
          "Five bands 0.20 wide cover 1.00 of price. The chart spans 98.40 to 101.60: 3.20.",
          "One random marker hits with chance 1.00 ÷ 3.20 = 0.3125.",
          "Expected hits from 4 random markers = 4 × 0.3125 = ?",
        ],
        ask: {
          answer: 1.25,
          tolerance: 0.01,
          unit: "hits",
          feedback: [{ value: 0.31, text: "That's one marker. Multiply by four." }],
          correct: "1.25 hits, from luck alone.",
          incorrect: "Multiply the chance for one marker by four: 4 × 0.3125.",
        },
        after: "Luck alone scores 1.25 hits, and 2 or more hits 37% of the time. Your markers show skill only if they beat that base rate over many sessions.",
        concept: "base-rates",
      },
    ],
    check: ["q-3.1.1-1", "q-3.1.1-2", "q-3.1.1-3"],
    recap: {
      takeaways: [
        "Chart liquidity is resting orders. Limits and take-profits absorb; stop-losses become market orders when hit.",
        "Pools plausibly sit beyond range edges, swing extremes, prior-day highs and lows, and round numbers.",
        "Liquidity being there doesn't pull price there. 'Price is drawn to liquidity' is grade D.",
      ],
    },
  },
};

// ─── 3.1.2 · Where stops cluster: the Osler evidence ────────────────────────

const L312: Lesson = {
  id: "3.1.2",
  title: "Where stops cluster: the Osler evidence",
  topic: "stop_loss",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Osler's bank data put take-profits on round numbers and stop-losses just beyond them, so levels tend to stall or speed price, and your own stop belongs outside the crowd.",
  objectives: [
    "State Osler's findings: take-profits cluster at round numbers, stop-loss buys just above them and stop-loss sells just below them.",
    "Predict whether a level is more likely to stall price (take-profit cluster) or to accelerate it (stop cluster), and explain why.",
    "Move a protective stop outside the crowded band and resize so the loss at the stop stays within 100.00 vUSD including costs.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M04", label: "Define Your Risk" },
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
  ],
  script: {
    unit: "3.1",
    courseId: "3.1.2",
    hook: {
      prompt: "A bank holds thousands of stop-loss buy orders near a round number, here LABX 100.00. Where do most of them sit?",
      control: {
        kind: "choice",
        choices: [
          { id: "at", label: "Exactly at 100.00", feedback: "That's where take-profits pile up. Stops tend to sit a little beyond the number." },
          { id: "above", label: "100.01–100.10, just above" },
          { id: "below", label: "99.90–99.99, just below", feedback: "A buy stop protects a short, so it sits above the level. Sell stops sit just below." },
          { id: "even", label: "Spread evenly", feedback: "Far from even: about twice as many sat just above as just below." },
        ],
        answer: "above",
      },
      compare: "You picked {yours}. In Osler's data, 14.4% of stop-loss buys sat just above a round number, in xx01–xx10, against 7.4% just below.",
      concept: "stop-clustering",
    },
    learn: [
      {
        kind: "explain",
        title: "The data",
        text: "Carol Osler studied 9,667 [[conditional-order|conditional orders]] placed with one large FX bank: stop-losses and take-profits that act only when price reaches a trigger. In FX, '00' is a price like 1.1000. On LABX, read it as 100.00, and xx01–xx10 as 100.01–100.10. One bank, one market: grade B.",
      },
      {
        kind: "figure",
        title: "Where they sat",
        figure: {
          kind: "bars",
          bars: [
            { label: "Take-profits ending in 00", value: 9.3, role: "up" },
            { label: "Stop-losses ending in 00", value: 4.4, role: "neutral" },
            { label: "Stop-loss buys just above 00", value: 14.4, role: "down" },
            { label: "Stop-loss buys just below 00", value: 7.4, role: "neutral" },
          ],
          unit: "%",
          steps: [
            "Take-profits: 9.3% ended exactly in 00.",
            "Stop-losses: only 4.4% ended in 00. Stops avoid the number itself.",
            "Stop-loss buys: 14.4% sat just above 00, in xx01–xx10.",
            "Only 7.4% sat just below. Stop-loss sells mirror this, just under 00.",
          ],
        },
        text: "Each bar is the share of one order type at that price ending (Osler, 2001 and 2003). A [[take-profit-cluster]] sits on the number; a [[stop-cluster]] sits just past it.",
        concept: "stop-clustering",
      },
      {
        kind: "predict",
        title: "From below",
        prompt: "Price rises to 100.00 from below. Which orders does it meet first, and what do they do?",
        control: {
          kind: "choice",
          choices: [
            { id: "tp", label: "Take-profits at 100.00, which tend to stall it" },
            { id: "stops", label: "Stop-loss buys, which speed it up", feedback: "They come second: they sit at 100.01–100.10, just past the number." },
            { id: "none", label: "Nothing until 100.10", feedback: "Longs' take-profits rest exactly at 100.00, so price meets them first." },
          ],
          answer: "tp",
        },
        reveal: "Take-profits first: sell limits at 100.00 that meet buyers head-on and tend to stall the rise. If the level gives way, the stop-loss buys at 100.01–100.10 trigger and become market buys, so the rise can speed up. Consistent with this, exchange rates spend less time at round numbers (grade B).",
        concept: "stop-clustering",
      },
      {
        kind: "match",
        title: "Stall or speed up?",
        prompt: "Match each cluster with what it tends to do when price arrives.",
        pairs: [
          { left: "Longs' take-profits at 100.00", right: "Stall a rise", wrong: "They're sell limits: they meet the buyers." },
          { left: "Buy limits at 99.50", right: "Stall a fall", wrong: "Passive buyers absorb the selling." },
          { left: "Stop-loss buys at 100.01–100.10", right: "Speed a rise up", wrong: "Once hit, they buy at market." },
          { left: "Stop-loss sells at 99.90–99.99", right: "Speed a fall up", wrong: "Once hit, they sell at market." },
        ],
        correct: "Limits, take-profits included, absorb. Stops, once triggered, add. Same price area, opposite effects.",
        concept: "stop-clustering",
      },
      {
        kind: "worked",
        title: "How big is the effect?",
        lines: [
          "Osler (2000) tested support and resistance levels published by firms against random levels.",
          "Published levels stopped intraday trends 60.8% of the time.",
          "Random levels stopped them 56.2% of the time.",
          "Difference, in percentage points = 60.8 − 56.2 = ?",
        ],
        ask: { answer: 4.6, tolerance: 0.1, unit: "points", correct: "4.6 points.", incorrect: "Subtract the random rate from the published one: 60.8 − 56.2." },
        after: "A real effect, but small. Profit after costs wasn't shown, and the firms agreed with one another on levels only about 30% of the time.",
        concept: "support-and-resistance",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "The typical mistake: your stop sits exactly where everyone's is, a few cents past the obvious level. When that crowd triggers, you're filled in the rush. That a stop outside the band slips less is plausible but untested as a rule (grade C). Move it beyond the band, then resize.",
      },
    ],
    task: {
      widget: "position-size",
      data: {
        ruler: {
          layers: [
            { kind: "level", price: 100.12, role: "support", label: "Structure low 100.12" },
            { kind: "level", price: 100, role: "neutral", label: "100.00" },
            { kind: "zone", from: 99.88, to: 99.99, role: "stop", label: "Sell-stop crowd" },
          ],
          card: "ATR 0.80 · structure low 100.12",
          compare: "Start, stop 99.98: 138 units · loss 99.41",
        },
      },
      goal: "Long LABX at 100.60. Your stop at 99.98 sits inside the crowded sell-stop band, 99.88–99.99. Move it below the band, then size for the most units that lose at most 100.00, costs included.",
      start: { account: 20000, riskPct: 0.5, entry: 100.6, stop: 99.98, units: 138 },
      locked: ["account", "riskPct", "entry"],
      hidden: ["simpleQty", "qty"],
      // Any stop from 99.40 to 99.87 with its largest size (FIT_312).
      success: { any: FIT_312.map((units, i) => ({ all: [{ field: "stop", eq: (9940 + i) / 100 }, { field: "units", eq: units }] })) },
      feedback: [
        { when: { field: "stop", eq: 99.92 }, text: "That is the structure rule, low minus a quarter ATR, but it lands inside the crowd. Step past 99.88." },
        { when: { field: "stop", gte: 99.88 }, text: "At {stop:2} the stop still sits in or above the crowded band. Whatever sweeps the stops under 100.00 takes yours too. Move below 99.88." },
        { when: { field: "stop", lt: 99.4 }, text: "{stop:2} is more than an ATR under the 100.12 low: more distance than the idea needs." },
        { when: { field: "withinBudget", eq: false }, text: "{units} units would lose {lossAtStop:2} at {stop:2}, over 100.00. Keep the stop; cut the units." },
        { when: { field: "withinBudget", eq: true }, text: "{units} units fit, losing {lossAtStop:2}. One more unit would still fit: find the most that does." },
      ],
      correct: "Stop {stop:2}, below the crowd under 100.00. {units} units lose {lossAtStop:2} if stopped: inside 100.00, costs included.",
      hints: [
        "First the stop: below 99.88, where the crowd under 100.00 ends. Then change the units, not the stop.",
        "Each unit loses the distance plus about 0.10 of commission. At 99.87: 0.73 + 0.10.",
        "Stop 99.87: 0.73 + 0.0005 × (100.60 + 99.87) = 0.8302 a unit. 100.00 ÷ 0.8302 = 120.4. Round down.",
      ],
      showMe: { stop: 99.87, units: 120 },
      concept: "stop-clustering",
    },
    check: ["q-3.1.2-1", "q-3.1.2-2", "q-3.1.2-3"],
    recap: {
      takeaways: [
        "Take-profits cluster on round numbers; stop-loss buys sit just above them, stop-loss sells just below.",
        "Take-profit clusters tend to stall price; triggered stop clusters tend to speed it up.",
        "Put your stop beyond the crowded band, then resize so the loss, costs included, fits the budget.",
      ],
    },
  },
};

// ─── 3.1.3 · Cascades, sweeps and breakouts ─────────────────────────────────

const L313: Lesson = {
  id: "3.1.3",
  title: "Cascades, sweeps and breakouts",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Triggered stops walk a thin book and can set off more stops; a break is a sweep or a breakout only once the bar closes, so the invalidation and the size come first.",
  objectives: [
    "Explain how triggered stops become market orders that walk a thin book and can trigger further stops (a cascade).",
    "Classify a level break as a sweep or a breakout only after the close, with a written rule: close back inside within one bar, or close beyond with follow-through.",
    "Write an invalidation level and a size before acting on a break, instead of a guess about anyone's intent.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "3.1",
    courseId: "3.1.3",
    hook: {
      prompt: "LABX trades at 101.08, 0.08 above yesterday's high of 101.00. Candle 24 hasn't closed yet. Breakout or sweep, and how sure are you?",
      figure: {
        kind: "chart",
        chart: { candles: [...BRK, ...BRK_NOW], layers: [{ kind: "level", price: 101, role: "resistance", label: "Prior-day high 101.00" }] },
        steps: [{ text: "Candle 24 is still open, trading at 101.08.", layers: [mark(23, "close", "101.08", "accent")] }],
      },
      // Not graded: before the close, no answer is right. The recap shows how candle 24 closed.
      control: {
        kind: "choice",
        choices: [
          { id: "break-sure", label: "Breakout, I'm sure" },
          { id: "break-maybe", label: "Breakout, maybe" },
          { id: "sweep-maybe", label: "Sweep, maybe" },
          { id: "sweep-sure", label: "Sweep, I'm sure" },
          { id: "open", label: "Can't tell before the close" },
        ],
      },
      compare: "You picked {yours}. Candle 24 closed at 100.94, back under 101.00: a sweep by the rule. Before the close, nothing on the chart decided it.",
      concept: "liquidity-sweep",
    },
    learn: [
      {
        kind: "figure",
        title: "A cascade, fill by fill",
        figure: {
          kind: "bars",
          bars: [
            { label: "Units bought at 100.02", value: 300, role: "up" },
            { label: "Units bought at 100.03", value: 200, role: "up" },
            { label: "Units bought at 100.05", value: 250, role: "up" },
            { label: "Units bought at 100.08", value: 250, role: "down" },
          ],
          steps: [
            "1,000 units of buy stops trigger at 100.01 and become market buys. 300 fill at 100.02.",
            "The next 200 take the offers at 100.03.",
            "250 more fill at 100.05. Each fill is a little worse.",
            "The last 250 fill at 100.08, inside the next stop cluster, 100.06–100.10. The move feeds itself.",
          ],
        },
        text: "Above 100.00 the book is thin: a few hundred units per price. Market orders take what's offered and move up. When their fills reach the next triggers, more market orders follow: a [[stop-cascade]].",
        concept: "stop-cascade",
      },
      {
        kind: "worked",
        title: "What the stops paid",
        lines: ["300 × 100.02 = 30,006.00", "200 × 100.03 = 20,006.00", "250 × 100.05 = 25,012.50", "250 × 100.08 = 25,020.00", "Total 100,044.50 for 1,000 units. Average price = ?"],
        ask: { answer: 100.04, tolerance: 0.01, correct: "100.04: 100,044.50 ÷ 1,000 = 100.0445.", incorrect: "Divide the total, 100,044.50, by the 1,000 units." },
        after: "Triggered at 100.01, the stops paid 100.04 on average: about 0.03 of [[slippage]] each, in a calm book. In a thinner book the walk is longer.",
        concept: "slippage",
      },
      {
        kind: "explain",
        title: "Sweep or breakout",
        text: "A [[liquidity-sweep]] trades through a level, sets off the stops there and closes back inside. A [[breakout]] closes beyond and keeps going. Until the candle closes they look the same: same push, same triggered stops. The rule here: back inside within one bar is a sweep; a close beyond with follow-through is a breakout.",
      },
      {
        kind: "figure",
        title: "Same start, two endings",
        figure: {
          kind: "chart",
          chart: { candles: [...BRK, ...SWEEP], visible: 23, range: [100.1, 101.8], layers: [{ kind: "level", price: 101, role: "resistance", label: "Prior-day high" }] },
          steps: [
            { text: "Candle 24 trades at 101.08 mid-bar. Both endings start from this picture.", layers: [{ kind: "level", price: 101.08, role: "neutral", label: "Now 101.08" }] },
            { text: "Ending A: candle 24 closes at 100.94, back inside. A sweep.", visible: 28 },
            { text: "Ending B, dashed: it closes at 101.22 and follows through. A breakout.", layers: [{ kind: "path", points: BREAK.map((c, i) => ({ index: 23 + i, price: c.c })), role: "up", label: "Ending B", dashed: true }] },
            { text: "Only the close told them apart. Classify after it, never before." },
          ],
        },
        text: "A branching replay: one start, two futures. Nothing in the open candle separated them.",
        concept: "liquidity-sweep",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Trends speed up through stop clusters (Osler 2005, grade B). 'After a sweep comes a reversal' is grade D: the one systematic test, an unreviewed 2026 preprint on G10 FX, found continuation more often. 'Stop hunt' assumes an intent no chart can show; 'sweep' is the neutral word.",
      },
      {
        kind: "match",
        title: "Classify after the close",
        prompt: "Prior-day high 101.00. Sort each break by the written rule. Some can't be classified yet.",
        columns: ["What happened", "Class"],
        pairs: [
          { left: "Trades to 101.12, closes at 100.94", right: "Sweep", wrong: "It closed back inside on the same bar." },
          { left: "Closes at 101.06; the next bar closes at 100.97", right: "Sweep", wrong: "Back inside within one bar still counts as a sweep." },
          { left: "Closes at 101.22; the next bar closes at 101.40", right: "Breakout", wrong: "It closed beyond, then followed through." },
          { left: "Closes at 101.18; the next bar closes at 101.30", right: "Breakout", wrong: "Two closes beyond, the second further away." },
          { left: "At 101.08, the candle still open", right: "Not yet", wrong: "Nothing is decided before the close." },
          { left: "Closes at 101.10; the next bar still open", right: "Not yet", wrong: "The follow-through bar hasn't closed, so the rule can't decide." },
        ],
        correct: "Six events, one written rule, each decided only at a close.",
        concept: "liquidity-sweep",
      },
      {
        kind: "predict",
        title: "Before the close: the invalidation",
        prompt: "You'd buy the break at the ask, 101.13. Where does your stop go? The last higher low inside the range is 100.65.",
        control: {
          kind: "choice",
          choices: [
            { id: "band", label: "100.95, just under 101.00", feedback: "That's among the sell stops under 101.00. A sweep's dip takes it out even if the break holds." },
            { id: "hl", label: "100.60, under the last higher low" },
            { id: "above", label: "101.05, just above the level", feedback: "Any ordinary retest of 101.00 stops you. The idea isn't wrong there." },
            { id: "far", label: "100.15, under the session's low", feedback: "Far more than the idea needs. The break has failed long before that." },
          ],
          answer: "hl",
        },
        reveal: "100.60, under 100.65, the last higher low inside the range. If price gets there, the break has failed by any reading. Now size it, before the close.",
        concept: "invalidation-level",
      },
    ],
    task: {
      widget: "position-size",
      goal: "Breakout buy at 101.13, stop 100.60, written before the close. Size it so a stop-out loses at most 100.00 (0.5% of 20,000.00), costs included.",
      start: { account: 20000, riskPct: 0.5, entry: 101.13, stop: 100.6, units: 188 },
      locked: ["account", "riskPct", "entry", "stop"],
      hidden: ["simpleQty", "qty"],
      success: { all: [{ field: "units", eq: 158 }, { field: "stop", eq: 100.6 }] },
      feedback: [
        { when: { field: "units", eq: 188 }, text: "188 is the textbook size, 100.00 ÷ 0.53, before costs. Both commissions add about 0.10 a unit: 118.61 at the stop." },
        { when: { field: "units", eq: 159 }, text: "159 units lose 100.31 with both commissions, just over 100.00." },
        { when: { field: "units", gt: 159 }, text: "{units} units would lose {lossAtStop:2} at the stop, over 100.00." },
        { when: { field: "units", lt: 158 }, text: "{units} units fit, losing {lossAtStop:2}. One more unit would still fit: find the most that does." },
      ],
      correct: "158 units lose 99.68 if stopped: 0.53 a unit plus about 0.10 of commission. Plan and size are written; the close decides the label, the stop decides the risk.",
      hints: [
        "Each unit loses the 0.53 distance plus commission on both sides.",
        "0.53 + 0.0005 × (101.13 + 100.60) = 0.6309 a unit.",
        "100.00 ÷ 0.6309 = 158.5. Round down.",
      ],
      showMe: { units: 158 },
      concept: "invalidation-level",
    },
    check: ["q-3.1.3-1", "q-3.1.3-2", "q-3.1.3-3"],
    recap: {
      takeaways: [
        "Triggered stops become market orders; their fills can reach the next stops, and the move feeds itself.",
        "Sweep: back inside within one bar. Breakout: close beyond with follow-through. Decide only after the close.",
        "Write the invalidation and the size before acting. 'They hunted my stop' is a guess about intent.",
      ],
    },
  },
};

// ─── 3.1.4 · Equal highs, equal lows and reference levels ───────────────────

const L314: Lesson = {
  id: "3.1.4",
  title: "Equal highs, equal lows and reference levels",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Equal highs and lows defined by a tolerance in ATR, the reference levels everyone plots, and why only a test against random levels at the same distance can show they matter.",
  objectives: [
    "Detect equal highs and equal lows with an explicit tolerance in ATR instead of by eye.",
    "List the widely watched reference levels (prior-day and prior-week high and low, session high and low, opening price, round numbers) and plot them automatically.",
    "Compare how often price breaks or holds at equal highs with random levels at the same distance, and say whether the difference is beyond noise.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
  ],
  script: {
    unit: "3.1",
    courseId: "3.1.4",
    hook: {
      prompt: "Two swing highs on LABX: 101.48 and 101.52. Equal highs or not?",
      figure: {
        kind: "chart",
        chart: { candles: EQ.slice(0, 40) },
        steps: [{ text: "Candle 29 peaks at 101.48, candle 35 at 101.52.", layers: [mark(28, "high", "101.48"), mark(34, "high", "101.52")] }],
      },
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Equal", feedback: "Maybe. 'Equal' only means something once you say how close counts." },
          { id: "no", label: "Not equal: they're 0.04 apart", feedback: "Maybe. Under a looser rule, 0.04 counts as equal." },
          { id: "rule", label: "Depends on the rule" },
        ],
        answer: "rule",
      },
      compare: "You picked {yours}. By eye it's a judgment call. With a written rule, 0.1 × ATR, here 0.1 × 0.60 = 0.06, a 0.04 gap counts as equal.",
      concept: "equal-highs-lows",
    },
    learn: [
      {
        kind: "explain",
        title: "Equal highs, equal lows",
        text: "[[equal-highs-lows|Equal highs or equal lows]] are two swing extremes at nearly the same price. In classic terms they're a [[double-top]] or a [[double-bottom]]. Stops plausibly rest just beyond them, because the extreme is obvious to everyone. That's grade C: extrapolated from Osler's round-number data, never measured for swings.",
      },
      {
        kind: "worked",
        title: "Write the tolerance",
        lines: [
          "ATR (14): 0.60.",
          "Rule: two neighbouring swing highs are equal if the gap is at most 0.1 × ATR.",
          "Gap: |101.52 − 101.48| = 0.04.",
          "Tolerance in price = 0.1 × 0.60 = ?",
        ],
        ask: { answer: 0.06, tolerance: 0.001, correct: "0.06. The gap, 0.04, fits inside it: equal highs.", incorrect: "Multiply: 0.1 × 0.60." },
        after: "0.04 ≤ 0.06, so they count as equal. With 0.05 × ATR, 0.03, they wouldn't. The [[detection-tolerance]] decides, so write it down before you look.",
        concept: "equal-highs-lows",
      },
      {
        kind: "figure",
        title: "Loosen the rule",
        figure: {
          kind: "chart",
          chart: { candles: EQ },
          steps: [
            { text: "0.05 × ATR, 0.03: one pair, candles 16 and 22.", layers: [pair(15, 100.62, 21, 100.64)] },
            { text: "0.1 × ATR, 0.06: three pairs.", layers: [pair(3, 100.2, 9, 100.26), pair(28, 101.48, 34, 101.52)] },
            { text: "0.2 × ATR, 0.12: six pairs.", layers: [pair(34, 101.52, 40, 101.4, "concept"), pair(46, 100.98, 52, 101.08, "concept"), pair(52, 101.08, 58, 101.17, "concept")] },
            { text: "Every rule finds some. Looser rules find many." },
          ],
        },
        text: "Same 61 candles, three tolerances. Neighbouring swing highs count when their gap fits the tolerance and no higher high sits between them.",
        concept: "equal-highs-lows",
      },
      {
        kind: "explain",
        title: "Reference levels",
        text: "Some prices nearly everyone watches: the prior-day and prior-week high and low, the session's high and low, the opening price and round numbers. These [[reference-level|reference levels]] can be plotted automatically, so every chart shows the same lines. That shared view makes orders there plausible (C). A fixed reaction rate at them is grade D.",
      },
      {
        kind: "hotspot",
        title: "Find the prior-day high",
        prompt: "Candles 1–16 are yesterday, 17–30 today. The lines are plotted automatically. Tap the prior-day high.",
        chart: {
          candles: REF,
          layers: [
            { kind: "level", price: 100.8, role: "neutral" },
            { kind: "level", price: 100.55, role: "neutral" },
            { kind: "level", price: 100.3, role: "neutral" },
            { kind: "level", price: 100, role: "neutral" },
            { kind: "level", price: 99.4, role: "neutral" },
            mark(16, "open", "Today", "accent"),
          ],
        },
        zones: [
          { id: "pdh", label: "Line at 100.80", from: 100.76, to: 100.84 },
          { id: "sh", label: "Line at 100.55", from: 100.51, to: 100.59, feedback: "That's today's high so far, set by candle 19. Yesterday went higher." },
          { id: "open", label: "Line at 100.30", from: 100.26, to: 100.34, feedback: "That's today's opening price, candle 17's open." },
          { id: "round", label: "Line at 100.00", from: 99.96, to: 100.04, feedback: "That's the round number, 100.00." },
          { id: "pdl", label: "Line at 99.40", from: 99.36, to: 99.44, feedback: "That's the prior-day low, from candle 12. You want the high." },
        ],
        answer: "pdh",
        correct: "Right. Yesterday's highest high, 100.80, came on candle 6. Today hasn't reached it yet.",
        concept: "reference-levels",
      },
      {
        kind: "predict",
        title: "Against a random level",
        prompt: "On R0, a random walk with no stops at all, are equal highs broken more often than random levels at the same distance from price?",
        control: {
          kind: "choice",
          choices: [
            { id: "more", label: "More often", feedback: "On R0 nothing makes a level special: there are no stops and no memory." },
            { id: "same", label: "About as often" },
            { id: "less", label: "Less often", feedback: "On R0 neither kind of level can matter. Any gap between them is noise." },
          ],
          answer: "same",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "Equal highs broken within 20 candles", value: 69.3, role: "accent" },
            { label: "Random levels, same distance", value: 67.4, role: "neutral" },
          ],
          unit: "%",
          steps: ["522 cases on 30,000 R0 candles: 69.3% against 67.4%.", "Difference 1.9 points, noise band ±5.6. Within noise."],
        },
        reveal: "About as often: a 1.9-point gap inside a ±5.6 noise band. Price reaches nearby levels anyway. Run the same test with stops ON before believing 'equal highs get swept': no published probability exists (grade D).",
        concept: "base-rates",
      },
    ],
    task: {
      widget: "level-drawer",
      data: { chart: { candles: EQ } },
      goal: "Mark one pair of equal highs at 0.1 × ATR (ATR 0.60): a resistance band no taller than 0.06 that holds two swing highs.",
      start: { role: "resistance", bandLow: 101.25, bandHigh: 101.35 },
      success: { all: [{ field: "role", eq: "resistance" }, { field: "touches", gte: 2 }, { field: "height", lte: 0.06 }] },
      feedback: [
        { when: { field: "role", eq: "support" }, text: "That band marks lows. For this task, mark highs: switch it to resistance." },
        { when: { field: "height", gt: 0.06 }, text: "Your band is {height:2} tall, wider than the 0.06 tolerance. Two highs inside it could be too far apart." },
        { when: { field: "touches", lt: 2 }, text: "{touches} swing highs sit in your band. Equal highs need two." },
      ],
      correct: "{touches} swing highs between {bandLow:2} and {bandHigh:2}: within 0.06 of each other, so equal at 0.1 × ATR.",
      hints: [
        "Look for two neighbouring peaks at almost the same price.",
        "The hook's pair works: 101.48 on candle 29 and 101.52 on candle 35.",
        "A band from 101.47 to 101.53 is 0.06 tall and holds both.",
      ],
      showMe: { role: "resistance", bandLow: 101.47, bandHigh: 101.53 },
      concept: "equal-highs-lows",
    },
    check: ["q-3.1.4-1", "q-3.1.4-2", "q-3.1.4-3"],
    recap: {
      takeaways: [
        "Equal highs need a written tolerance, such as 0.1 × ATR. Looser rules find more pairs.",
        "Reference levels: prior-day and prior-week highs and lows, session highs and lows, the open, round numbers.",
        "Compare with random levels at the same distance. On R0, equal highs broke about as often.",
      ],
    },
  },
};

// ─── 3.1.5 · Imbalances, gaps and voids ─────────────────────────────────────

const L315: Lesson = {
  id: "3.1.5",
  title: "Imbalances, gaps and voids",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "The two meanings of imbalance, the three-candle gap read exactly from OHLC and measured in ATR, and why 'gaps fill' is mostly the base rate of revisiting nearby prices.",
  objectives: [
    'Tell apart the two meanings of "imbalance": order-flow imbalance (more aggressive buying than selling) and price imbalance (a fast one-sided move with little two-sided trading).',
    "Identify a three-candle gap (fair value gap) exactly from OHLC and measure it in ATR.",
    'Compare the revisit rate of gaps with that of random levels at the same distance and explain why "gaps fill" is mostly a base rate.',
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
    { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
  ],
  script: {
    unit: "3.1",
    courseId: "3.1.5",
    hook: {
      prompt: "In a pure random walk, how often is a three-candle gap revisited within 20 candles?",
      control: {
        kind: "slider",
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        start: 50,
        answer: 83,
        tolerance: 5,
        feedback: [
          { from: 0, to: 49, text: "Much more often than that. On a random walk, nearby prices get revisited all the time." },
          { from: 50, to: 77, text: "Higher still: most gaps get revisited." },
          { from: 78, to: 88, text: "Close: about 83%." },
          { from: 89, to: 100, text: "A little lower: about 83%." },
        ],
      },
      compare: "You guessed {yours}%. In a 1,000,000-bar random-walk simulation, 83.4% of gaps were revisited within 20 bars, and 83.5% of random levels at the same distance.",
      concept: "fair-value-gap",
    },
    learn: [
      {
        kind: "explain",
        title: "Two meanings of imbalance",
        text: "[[imbalance|Imbalance]] means two different things. Order-flow imbalance: more aggressive buying than selling at the best prices. It predicts the next few ticks, over milliseconds to seconds (grade B), too fast for a retail trader. Price imbalance: a fast one-sided move that left little two-sided trading behind. Always say which one you mean.",
      },
      {
        kind: "figure",
        title: "A three-candle gap",
        figure: {
          kind: "chart",
          chart: { candles: FVG_FIG, visible: 5 },
          steps: [
            { text: "Candle 5's high is 100.40.", layers: [mark(4, "high", "100.40")] },
            { text: "Candle 6 runs from 100.35 to 101.20: one large bullish candle.", visible: 6 },
            { text: "Candle 7's low, 100.70, stays above 100.40. The gap: 100.40 to 100.70.", visible: 7, layers: [{ kind: "zone", from: 100.4, to: 100.7, role: "concept", label: "Gap" }] },
          ],
        },
        text: "A [[fair-value-gap]], or three-candle gap: the first candle's high sits below the third candle's low, or the reverse. In between, price traded only during the fast middle candle.",
        concept: "fair-value-gap",
      },
      {
        kind: "hotspot",
        title: "Find the gap",
        prompt: "Thirty candles. Tap the middle candle of the bullish three-candle gap.",
        chart: { candles: FVG30 },
        zones: [
          { id: "c6", label: "Candle 6", index: 5, feedback: "Big and bullish, but candle 7's low, 100.10, dips under candle 5's high, 100.15. No gap." },
          { id: "c12", label: "Candle 12", index: 11 },
          { id: "c13", label: "Candle 13", index: 12, feedback: "Candle 13 is the third candle. The fast middle one comes just before it." },
          { id: "c21", label: "Candle 21", index: 20, feedback: "That's a gap, but a bearish one: candle 22's high, 100.85, stays under candle 20's low, 101.10." },
        ],
        answer: "c12",
        correct: "Right. Candle 11's high is 100.70 and candle 13's low is 101.00: a 0.30 gap around candle 12.",
        concept: "fair-value-gap",
      },
      {
        kind: "worked",
        title: "Measure it in ATR",
        lines: ["The gap from the figure: 100.70 − 100.40 = 0.30.", "ATR (14): 0.60.", "Size in ATR = 0.30 ÷ 0.60 = ?"],
        ask: { answer: 0.5, tolerance: 0.01, unit: "ATR", correct: "0.5 ATR.", incorrect: "Divide the gap, 0.30, by the ATR, 0.60." },
        after: "Half an ATR. In ATR, one filter, such as 'gaps of at least 0.5 ATR', works in calm and in wild markets alike.",
        concept: "fair-value-gap",
      },
      {
        kind: "predict",
        title: "The null model",
        prompt: "On a random walk, how does the gaps' revisit rate compare with random levels at the same distance?",
        control: {
          kind: "choice",
          choices: [
            { id: "higher", label: "Gaps much higher", feedback: "That would be the magnet. On a random walk nothing pulls price back." },
            { id: "same", label: "About the same" },
            { id: "lower", label: "Gaps much lower", feedback: "No reason either way: a random walk doesn't remember the gap." },
          ],
          answer: "same",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "Gaps revisited in 20 bars", value: 83.4, role: "accent" },
            { label: "Random levels revisited", value: 83.5, role: "neutral" },
            { label: "Gaps filled completely", value: 73.1, role: "accent" },
            { label: "Random zones, same size, filled", value: 73.1, role: "neutral" },
            { label: "First-touch trade wins, gaps", value: 50.2, role: "accent" },
            { label: "First-touch trade wins, random", value: 50.1, role: "neutral" },
          ],
          unit: "%",
          steps: ["Revisited within 20 bars: 83.4% against 83.5%.", "Filled completely: 73.1% against 73.1%.", "A trade at the first touch wins 50.2% against 50.1%."],
        },
        reveal: "About the same, on every measure. The gap is a real feature, a fast move; its 'magnet' isn't shown. Most of 'gaps fill' is the base rate of revisiting nearby prices. The simulation, by a software vendor, is valid as a null model, not proof that markets are random.",
        concept: "base-rates",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Low-volume nodes, single prints and [[liquidity-void|liquidity voids]] describe the past: price areas crossed fast, with little trading. That's real. That price must come back to 'repair' them is grade D. A gap is a fact; its pull is not.",
      },
      // Try (gap-null-lab isn't built yet): read a lab run on R0.
      {
        kind: "predict",
        title: "Your lab run",
        prompt: "Your R0 run, 2,000 bars, revisits within 20 bars: gaps ≥ 0.25 ATR 82.0% vs random 85.0%, noise band ±5.1; gaps ≥ 0.5 ATR 82.9% vs 87.6%, band ±6.2. What do you report?",
        control: {
          kind: "choice",
          choices: [
            { id: "edge", label: "Gaps fill: an edge", feedback: "Gaps were revisited a little less often than random levels here, and both differences sit inside the noise band." },
            { id: "noise", label: "No difference beyond noise, for both filters" },
            { id: "worse", label: "Random levels beat gaps", feedback: "Both differences sit inside their noise bands, ±5.1 and ±6.2. Noise, not a finding." },
          ],
          answer: "noise",
        },
        reveal: "No difference beyond noise. On R0 that's guaranteed by construction, which is why it's the control: a method that 'works' on R0 is finding noise. A real finding needs a difference beyond the band on a real market, after costs.",
        concept: "base-rates",
      },
    ],
    check: ["q-3.1.5-1", "q-3.1.5-2", "q-3.1.5-3"],
    recap: {
      takeaways: [
        "Say which imbalance you mean: order flow at the best prices, or a fast one-sided price move.",
        "A three-candle gap: candle 1's high below candle 3's low, or the reverse. Measure it in ATR.",
        "On a random walk, gaps are revisited 83.4% of the time, random levels 83.5%. Mostly base rate.",
      ],
    },
  },
};

// ─── 3.1.6 · Zone grading and hindsight ─────────────────────────────────────

const GRADE_WRONG = "Count the criteria it meets: departure ≥ 1.5 ATR, three base candles or fewer, fresh, at a level.";

const L316: Lesson = {
  id: "3.1.6",
  title: "Zone grading and hindsight: supply and demand under test",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Grade supply and demand zones with written criteria, lock them before the session, test the grades against random zones of the same width, and measure what hindsight adds.",
  objectives: [
    "Grade supply and demand zones with written criteria (departure, time at base, freshness, location) and lock them before the session.",
    "Test whether higher-graded zones react more often than lower-graded zones and random zones of the same width.",
    "Measure how much drawing zones after the fact inflates their apparent success.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
  ],
  script: {
    unit: "3.1",
    courseId: "3.1.6",
    hook: {
      prompt: "Firms published support and resistance levels with 'strength' ratings. Did the strong levels hold more often than the weak ones?",
      control: {
        kind: "choice",
        choices: [
          { id: "clearly", label: "Yes, clearly", feedback: "That's what the ratings promised. The data didn't show it." },
          { id: "little", label: "A little", feedback: "Not even a little. The ratings added nothing." },
          { id: "no", label: "No" },
        ],
        answer: "no",
      },
      compare: "You picked {yours}. In Osler (2000), published levels stopped trends a bit more often than random levels, but the firms' strength ratings added nothing.",
      concept: "zone-grading",
    },
    learn: [
      {
        kind: "figure",
        title: "Four written criteria",
        figure: {
          kind: "chart",
          chart: { candles: DBR, layers: [{ kind: "zone", from: 99.02, to: 99.3, role: "support", label: "Demand zone" }] },
          steps: [
            { text: "Departure: 0.90 above the zone within three candles, 2.9 ATR. Criterion: at least 1.5 ATR.", layers: [{ kind: "bracket", from: 99.3, to: 100.2, index: 12, label: "0.90" }] },
            { text: "Time at base: two candles, 9 and 10. Criterion: three or fewer.", layers: [mark(8, "low"), mark(9, "low")] },
            { text: "Freshness: since the rally, no candle has come back into the zone." },
            { text: "Location: at 99.00, a level on the daily chart.", layers: [{ kind: "level", price: 99, role: "neutral", label: "Daily 99.00" }] },
          ],
        },
        text: "The [[demand-zone]] from unit 2.5, drop-base-rally, now graded with written criteria. ATR (14) here is 0.31. Each criterion is a number you can check, not a feeling.",
        concept: "zone-grading",
      },
      {
        kind: "match",
        title: "How each is measured",
        prompt: "Match each criterion with how you measure it.",
        pairs: [
          { left: "Departure", right: "Size of the move away, in ATR", wrong: "Departure is about the move out of the base, not the base itself." },
          { left: "Time at base", right: "Number of candles in the base", wrong: "Time at base counts candles, before the move away." },
          { left: "Freshness", right: "Returns into the zone since it formed", wrong: "A fresh zone hasn't been revisited since it formed." },
          { left: "Location", right: "Distance to a higher-timeframe level", wrong: "Location asks where the zone sits on the bigger chart." },
        ],
        concept: "zone-grading",
      },
      {
        kind: "match",
        title: "Grade them",
        prompt: "Rule: A meets all four criteria, B meets three, C two or fewer. Grade each zone.",
        columns: ["Zone", "Grade"],
        pairs: [
          { left: "Departure 2.1 ATR, 2 base candles, fresh, at a daily level", right: "A", wrong: GRADE_WRONG },
          { left: "Departure 1.8 ATR, 3 base candles, fresh, no level nearby", right: "B", wrong: GRADE_WRONG },
          { left: "Departure 1.2 ATR, 2 base candles, fresh, at a daily level", right: "B", wrong: GRADE_WRONG },
          { left: "Departure 0.9 ATR, 5 base candles, touched twice, no level", right: "C", wrong: GRADE_WRONG },
          { left: "Departure 2.5 ATR, 4 base candles, touched once, at a daily level", right: "C", wrong: GRADE_WRONG },
          { left: "Departure 1.6 ATR, 1 base candle, fresh, at a weekly level", right: "A", wrong: GRADE_WRONG },
        ],
        correct: "Grades from written criteria are checkable, and you can lock them before the session. Whether they mean anything is the next question.",
        concept: "zone-grading",
      },
      {
        kind: "figure",
        title: "Wide zones 'work'",
        figure: {
          kind: "bars",
          bars: [
            { label: "0.2 ATR wide", value: 28.1, role: "neutral" },
            { label: "0.4 ATR wide", value: 35.9, role: "neutral" },
            { label: "0.6 ATR wide", value: 42.7, role: "neutral" },
            { label: "0.8 ATR wide", value: 45.7, role: "neutral" },
            { label: "1.0 ATR wide", value: 50.8, role: "accent" },
          ],
          unit: "%",
          steps: [
            "Random zones on R0, about 9,000 touched per width. At 0.2 ATR, 28.1% 'reacted'.",
            "Wider zones react more often: 42.7% at 0.6 ATR.",
            "50.8% at 1.0 ATR. Wide zones 'work' because they are wide.",
          ],
        },
        text: "A reaction here: price touches a random zone half an ATR under price, then rallies 1 ATR above it before any close below it. No zone on R0 means anything, yet the rate climbs with width.",
        concept: "zone-grading",
      },
      {
        kind: "worked",
        title: "Locked versus drawn after",
        lines: [
          "Locked before the session: 10 zones, 4 reacted. 4 ÷ 10 = 40%.",
          "Redrawn after it: 3 clear failures dropped, 2 more moved onto the real turns.",
          "Now 6 of 7 'reacted'. 6 ÷ 7 = 86%.",
          "Inflation from hindsight, in percentage points = 86 − 40 = ?",
        ],
        ask: { answer: 46, tolerance: 1, unit: "points", correct: "46 points.", incorrect: "Subtract the locked rate from the redrawn one: 86 − 40." },
        after: "Same trader, same rules, 46 points better on paper. The difference is [[hindsight-bias|hindsight]], not edge: drawing after the fact uses the outcome. An example of the mechanism, not a measured rate.",
        concept: "zone-grading",
      },
      {
        kind: "predict",
        title: "Read the test",
        prompt: "Example result of a locked test: A zones reacted 56% (N 50), C zones 53% (N 70), random zones of the same width 52% (N 300). A minus random: +4 points, 95% interval −11 to +19. Your report?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "A beats random beyond noise", feedback: "The interval runs from −11 to +19, so it includes zero. N 50 is too few to tell." },
            { id: "noise", label: "No difference beyond noise" },
            { id: "c", label: "Grades work, since A > C > random", feedback: "The order looks tidy, but every difference sits inside the noise. Order alone isn't evidence." },
          ],
          answer: "noise",
        },
        reveal: "No difference beyond noise: the interval includes zero. That's the honest report, and a valid result: 'grading adds nothing here' is a finding. Osler's firms found the same about their strength ratings.",
        concept: "base-rates",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "A zone redrawn after it failed is no longer the same test. Make it a [[locked-drawing]] before the session and keep that version in the journal. 'Zones hold because institutions left orders there' is grade D: no robust study shows it.",
      },
    ],
    check: ["q-3.1.6-1", "q-3.1.6-2", "q-3.1.6-3"],
    recap: {
      takeaways: [
        "Grade zones with written criteria: departure, time at base, freshness, location. Lock them before the session.",
        "Test grades against random zones of the same width. Wide zones 'react' more just by being wide.",
        "Zones drawn after the session look better: hindsight inflated success here from 40% to 86%.",
      ],
    },
  },
};

// ─── 3.1.7 · Trapped inventory ──────────────────────────────────────────────

const L317: Lesson = {
  id: "3.1.7",
  title: "Trapped inventory: stops, break-even exits and role reversal",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "After a failed breakout, trapped positions have a size, an average price and two exits, their stops and their break-even, which also explain role reversal at a retest.",
  objectives: [
    "Read the size and average price of trapped positions from the x-ray after a failed breakout.",
    "Locate the two places where trapped traders exit (their stops and their break-even price) and say what each does to price.",
    "Explain role reversal (broken resistance acting as support, or the reverse) through break-even exits, and compare retests with random levels.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
  ],
  script: {
    unit: "3.1",
    courseId: "3.1.7",
    hook: {
      prompt: "LABX broke above 101.00, then failed. Buyers who entered at 101.05–101.15 watched price fall to 100.40. Now it's back at 100.92 and rising. What do many of them do near break-even?",
      figure: {
        kind: "chart",
        chart: { candles: TRAP.slice(0, 26), layers: [{ kind: "level", price: 101, role: "resistance", label: "101.00" }] },
        steps: [{ text: "Break on candle 17, back inside on 19, low 100.40, now 100.92.", layers: [{ kind: "zone", from: 101.05, to: 101.15, role: "concept", label: "Buyers' entries" }] }],
      },
      control: {
        kind: "choice",
        choices: [
          { id: "more", label: "Buy more", feedback: "Some average down, but most trapped traders just want out." },
          { id: "flat", label: "Sell to get out flat" },
          { id: "nothing", label: "Nothing", feedback: "Many have waited for exactly this price. They tend to act on it." },
        ],
        answer: "flat",
      },
      compare: "You picked {yours}. Many sell to get out flat: the loss aversion of unit 1.7, seen as order flow.",
      concept: "trapped-inventory",
    },
    learn: [
      {
        kind: "figure",
        title: "The x-ray of a failed breakout",
        figure: {
          kind: "chart",
          chart: { candles: TRAP.slice(0, 26), layers: [{ kind: "level", price: 101, role: "resistance", label: "101.00" }] },
          steps: [
            { text: "Synthetic replay, x-ray on. Break on candle 17, back inside on candle 19.", layers: [mark(16, "close", "Break", "up"), mark(18, "close", "Back in", "down")] },
            { text: "Trapped buyers: 600 at 101.05, 500 at 101.10, 300 at 101.15.", layers: [{ kind: "zone", from: 101.05, to: 101.15, role: "concept", label: "1,400 trapped" }] },
            { text: "900 of them have stops under 100.60. The other 500 have none.", layers: [{ kind: "level", price: 100.6, role: "stop", label: "Stops 900" }] },
          ],
        },
        text: "[[trapped-inventory|Trapped inventory]]: positions caught on the wrong side of a failed move, described by size and average price. The x-ray shows it; on a real chart you can only estimate it.",
        concept: "trapped-inventory",
      },
      {
        kind: "worked",
        title: "Their average price",
        lines: ["600 × 101.05 = 60,630.00", "500 × 101.10 = 50,550.00", "300 × 101.15 = 30,345.00", "Total 141,525.00 for 1,400 units. Average entry = ?"],
        ask: { answer: 101.09, tolerance: 0.01, correct: "101.09: 141,525.00 ÷ 1,400 = 101.089.", incorrect: "Divide the total, 141,525.00, by the 1,400 units." },
        after: "Their break-even is about 101.09. That price and their stops at 100.60 are the two places these traders act.",
        concept: "trapped-inventory",
      },
      {
        kind: "predict",
        title: "Two exits",
        prompt: "Price falls through 100.60, then rallies back toward 101.09. What happens at each place?",
        control: {
          kind: "choice",
          choices: [
            { id: "right", label: "At 100.60 stops speed the fall; near 101.09 break-even sellers stall the rally" },
            { id: "reverse", label: "At 100.60 stops stall the fall; near 101.09 buyers lift it", feedback: "Longs' stops are sell stops: once hit, they sell at market. That adds to a fall." },
            { id: "none", label: "Nothing special at either", feedback: "Both are places where 1,400 units of positions act. In this replay, both mattered." },
          ],
          answer: "right",
        },
        figure: {
          kind: "chart",
          chart: { candles: TRAP, visible: 26, layers: [{ kind: "level", price: 100.6, role: "stop", label: "Stops 900" }, { kind: "level", price: 101.09, role: "concept", label: "Break-even 101.09" }] },
          steps: [
            { text: "Candle 21 broke 100.60: the 900 stops sold at market, and the fall sped up.", layers: [mark(20, "low")] },
            { text: "Candles 27 and 28 reached 101.08 and 101.10, then turned down.", visible: 30 },
          ],
        },
        reveal: "In this replay: at 100.60 the 900 stops became market sells and sped the fall, the cascade from 3.1.3. Back near 101.09, the 500 holders left sold to get out flat, and the rally stalled. Trapped traders as fuel is grade C: consistent with Osler's cascades, never tested directly.",
        concept: "trapped-inventory",
      },
      {
        kind: "figure",
        title: "The mirror: role reversal",
        figure: {
          kind: "chart",
          chart: { candles: RR, visible: 14, layers: [{ kind: "level", price: 101, role: "resistance", label: "101.00" }] },
          steps: [
            { text: "Shorts sold at 101.00, the range top, on candles 3, 8 and 12.", layers: [mark(2, "high"), mark(7, "high"), mark(11, "high")] },
            { text: "Candle 15 closes at 101.30. The shorts are under water.", visible: 17 },
            { text: "Candle 20 retests, low 101.02. Many shorts buy back near break-even.", visible: 20 },
            { text: "That buying meets the dip: old resistance acts as support, in this replay.", visible: 24 },
          ],
        },
        text: "[[role-reversal|Role reversal]] through [[break-even-exit|break-even exits]]: traders wrong at the old level leave flat on the retest, adding orders that defend it. Plausible, with mixed evidence: grade C.",
        concept: "role-reversal",
      },
      {
        kind: "predict",
        title: "Beyond noise?",
        prompt: "On R0, the random walk, do broken levels hold on the retest more often than random levels at the same distance?",
        control: {
          kind: "choice",
          choices: [
            { id: "more", label: "More often", feedback: "On R0 nobody is trapped and nobody remembers the level." },
            { id: "same", label: "About as often" },
            { id: "less", label: "Less often", feedback: "No reason either way on R0. Any gap is noise." },
          ],
          answer: "same",
        },
        reveal: "About as often: on R0 there are no trapped traders, so any gap is noise. Only a difference beyond the noise band with stops ON would support the break-even mechanism. In real markets the evidence is mixed: grade C.",
        concept: "base-rates",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Sometimes you are the one trapped. Getting out flat is loss aversion in action: fine if it's in your plan, costly if it's a reflex. SMC calls the same mechanism a 'breaker block' (unit 3.5); 'breaker blocks hold on the retest' is grade D.",
      },
      // Try (liquidity-xray, trapped mode, isn't built yet): read a new x-ray, then mark the stall.
      {
        kind: "worked",
        title: "A new replay: trapped shorts",
        lines: [
          "A breakdown under 99.00 failed. The x-ray shows trapped shorts:",
          "400 at 98.96, 800 at 98.90, 400 at 98.84: 1,600 units.",
          "1,000 have stops above 99.40; 600 have none.",
          "Average entry = (400 × 98.96 + 800 × 98.90 + 400 × 98.84) ÷ 1,600 = ?",
        ],
        ask: { answer: 98.9, tolerance: 0.01, correct: "98.90: 158,240.00 ÷ 1,600.", incorrect: "Add the three products, 158,240.00 in all, and divide by 1,600." },
        after: "1,600 units at 98.90 on average, 1,000 of them protected: 62.5%. Their stops fired on candle 19's rally through 99.40. The 600 left, also averaging 98.90, wait for break-even.",
        concept: "trapped-inventory",
      },
      {
        kind: "hotspot",
        title: "Where does the retest stall?",
        prompt: "Price is falling back toward the old breakdown. Tap where you'd expect the decline to stall if the trapped shorts act as in the last replay.",
        chart: { candles: MIRROR, range: [98.4, 100.3], layers: [{ kind: "level", price: 99, role: "support", label: "99.00" }] },
        zones: [
          { id: "stops", label: "Near 99.40", from: 99.36, to: 99.44, feedback: "Their stops were there, and they already fired on the way up. Nothing is left to act." },
          { id: "mid", label: "Near 99.70", from: 99.66, to: 99.74, feedback: "No trapped orders sit near 99.70 in the x-ray." },
          { id: "be", label: "Near 98.90", from: 98.86, to: 98.94 },
          { id: "low", label: "Near 98.50", from: 98.46, to: 98.54, feedback: "Down there the 600 shorts are in profit, not at break-even. The stall would come earlier." },
        ],
        answer: "be",
        correct: "Right. The 600 unprotected shorts break even at 98.90. If they buy back flat, that buying can stall the decline there. A tendency in a replay, not a law.",
        concept: "trapped-inventory",
      },
    ],
    check: ["q-3.1.7-1", "q-3.1.7-2", "q-3.1.7-3"],
    recap: {
      takeaways: [
        "Trapped inventory: the size and average price of positions caught by a failed move, read from the x-ray.",
        "Trapped traders exit at their stops, speeding the move, and at break-even, which can stall a retest.",
        "Role reversal through break-even exits is plausible but mixed: grade C. Compare retests with random levels.",
      ],
    },
  },
};

// ─── Check questions ────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 3.1.1
  {
    id: "q-3.1.1-1",
    topic: "order_types",
    kind: "mcq",
    difficulty: 1,
    prompt: "LABX trades at 100.45. Price later reaches each of these resting orders. Which one becomes a market order when it's reached?",
    options: [
      { id: "a", label: "A buy limit at 99.60", rationale: "A limit fills at its price or better and waits passively. It absorbs selling instead of adding to it." },
      { id: "b", label: "A long's take-profit, a sell limit at 101.00", rationale: "A take-profit is a limit order: it fills passively at 101.00 and absorbs buying." },
      { id: "c", label: "A long's stop-loss, a sell stop at 99.15" },
      { id: "d", label: "A short's take-profit, a buy limit at 100.00", rationale: "That's a limit too. It waits at 100.00 and absorbs the sellers who arrive there." },
    ],
    correct: "c",
    explanation: "A stop order sleeps until price reaches its trigger, then becomes a market order and takes whatever bids are there. Limits, take-profits included, fill passively at their price: they absorb flow rather than push it.",
    lesson: "3.1.1",
    concepts: ["liquidity-pool", "stop-loss-order"],
  },
  {
    id: "q-3.1.1-2",
    topic: "order_types",
    kind: "scenario",
    difficulty: 2,
    scenario: "LABX has ranged between 49.20 and 50.80 for two days, with 50.00 in the middle. Price is at 50.30.",
    prompt: "Where do sell stops most plausibly cluster?",
    options: [
      { id: "a", label: "Exactly at 50.00", rationale: "Orders exactly on a round number are mostly take-profits. Stops tend to sit a little beyond the level." },
      { id: "b", label: "49.10–49.19, just under the range low" },
      { id: "c", label: "50.81–50.90, just above the range high", rationale: "Stops above the range protect shorts. Those are buy stops, not sell stops." },
      { id: "d", label: "49.60, in the middle of the lower half", rationale: "Nothing obvious sits at 49.60. Stops gather beyond levels everyone can see, such as the range low." },
    ],
    correct: "b",
    explanation: "Longs who bought near the range low put their protective sell stops just beyond it, where their idea is wrong. That's the most obvious place on this chart; just under 50.00 is a second candidate. Plausible, not measured: no chart shows the real orders.",
    lesson: "3.1.1",
    concepts: ["liquidity-pool", "support-and-resistance"],
    hints: ["Sell stops protect longs. Where did longs buy in this range?", "A long's stop goes where the idea is wrong: just beyond the level it bought on."],
  },
  {
    id: "q-3.1.1-3",
    topic: "order_types",
    kind: "mcq",
    difficulty: 2,
    prompt: "A video says: 'Price is drawn to the liquidity under the range low, so expect it to go there.' Which statement is accurate?",
    options: [
      { id: "a", label: "True: large stop pools act like magnets", rationale: "That's the 'magnet' claim, grade D. No study shows price is pulled toward resting orders." },
      { id: "b", label: "Stops probably rest there and can speed a fall that reaches them; nothing shows price is pulled there" },
      { id: "c", label: "False: no stops rest under range lows", rationale: "Stops beyond obvious levels are documented for round numbers (Osler, grade B). The claim fails on attraction, not on presence." },
      { id: "d", label: "True, but only near round numbers", rationale: "Round numbers attract orders, not price. The order clustering is documented; a pull on price isn't, anywhere." },
    ],
    correct: "b",
    explanation: "Two claims hide in one sentence. Orders clustering beyond obvious levels is documented (grade B). Price being attracted to them is not (grade D), and it treats the market as someone with a goal. Use the first; drop the second.",
    lesson: "3.1.1",
    concepts: ["liquidity-pool", "base-rates"],
    hints: ["Split the sentence into two claims: where the orders are, and where price goes.", "Which of the two has evidence behind it?"],
  },
  // 3.1.2
  {
    id: "q-3.1.2-1",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 1,
    prompt: "Around a round number such as 100.00, where did Osler find each order type clustering?",
    options: [
      { id: "a", label: "Take-profits just above it, stop-loss buys exactly on it", rationale: "Reversed. Take-profits sat on the number; stops avoided it and sat just beyond." },
      { id: "b", label: "All of them exactly at 100.00", rationale: "Only take-profits favoured the number itself. Stop-losses ending in 00 were under half as common: 4.4% against 9.3%." },
      { id: "c", label: "Take-profits exactly on it, stop-loss buys just above, stop-loss sells just below" },
      { id: "d", label: "Stop-loss buys just below it, stop-loss sells just above", rationale: "A buy stop protects a short, so it sits above the level, where the short is proven wrong. Sell stops mirror it below." },
    ],
    correct: "c",
    explanation: "Take-profits clustered exactly on round numbers: 9.3% ended in 00, against 4.4% of stop-losses. Stop-loss buys sat just above, 14.4% in xx01–xx10 against 7.4% just below, and stop-loss sells mirrored them. One bank, FX data: grade B.",
    lesson: "3.1.2",
    concepts: ["stop-clustering", "round-numbers"],
  },
  {
    id: "q-3.1.2-2",
    topic: "stop_loss",
    kind: "scenario",
    difficulty: 2,
    scenario: "LABX rises toward 100.00. Longs' take-profits rest at 100.00; shorts' stop-loss buys rest at 100.01–100.10.",
    prompt: "What does each cluster tend to do?",
    options: [
      { id: "a", label: "Both pull price up toward them", rationale: "Resting orders don't pull. Take-profits sell into the rise; stops buy only once triggered." },
      { id: "b", label: "The buy stops stall it; the take-profits speed it up", rationale: "Reversed. A take-profit is a passive sell limit; a buy stop becomes a market buy when hit." },
      { id: "c", label: "Neither matters: only news moves price", rationale: "Order flow moves price too. Passive limits absorb, triggered stops push, and Osler links that to trends speeding up through clusters." },
      { id: "d", label: "The take-profits tend to stall the rise; if 100.00 gives way, the triggered buy stops can speed it up" },
    ],
    correct: "d",
    explanation: "The take-profits are sell limits: they meet buyers head-on and tend to stall price at 100.00. The buy stops sit just beyond; once triggered they become market buys and add to the rise. Which wins depends on sizes a chart doesn't show.",
    lesson: "3.1.2",
    concepts: ["stop-clustering", "liquidity-pool"],
    hints: ["Which of the two orders is a limit, and which becomes a market order?", "A limit absorbs flow; a triggered stop adds to it."],
  },
  {
    id: "q-3.1.2-3",
    topic: "stop_loss",
    kind: "numeric",
    difficulty: 2,
    prompt: "You're long LABX at 100.60. You move your stop below the crowded band, to 99.87. Your budget is 100.00, including 0.05% commission on entry and on exit. What is the largest whole number of units?",
    numeric: { answer: 120, tolerance: 0, unit: "units" },
    explanation: "Loss per unit = 0.73 + 0.0005 × (100.60 + 99.87) = 0.8302. 100.00 ÷ 0.8302 = 120.4, so 120 units. Check with the commissions rounded up to the cent: 120 units lose 99.64 at the stop; 121 would lose 100.47.",
    lesson: "3.1.2",
    concepts: ["cost-adjusted-sizing", "stop-clustering"],
    hints: [
      "Loss per unit = distance to the stop + commission on both sides.",
      "0.73 + 0.0005 × (100.60 + 99.87) = 0.8302 a unit.",
      "100.00 ÷ 0.8302 = 120.4. Round down.",
    ],
    vary: {
      fields: { entry: [80, 120, 0.05], dist: [0.5, 1.5, 0.01], budget: [50, 200, 50] },
      constraints: [
        "floor(budget / (dist + 0.0005 * (2 * entry - dist))) * dist + commission(floor(budget / (dist + 0.0005 * (2 * entry - dist))) * entry) + commission(floor(budget / (dist + 0.0005 * (2 * entry - dist))) * (entry - dist)) <= budget",
      ],
      answer: "floor(budget / (dist + 0.0005 * (2 * entry - dist)))",
      prompt: "You're long LABX at {entry:2}. You move your stop below the crowded band, to {entry - dist:2}. Your budget is {budget:2}, including 0.05% commission on entry and on exit. What is the largest whole number of units?",
      explanation: "Loss per unit = {dist:2} + 0.0005 × ({entry:2} + {entry - dist:2}) = {dist + 0.0005 * (2 * entry - dist):4}. {budget:2} ÷ {dist + 0.0005 * (2 * entry - dist):4} = {budget / (dist + 0.0005 * (2 * entry - dist)):1}, so {answer} units. With the commissions rounded up to the cent, they lose {round(answer * dist + commission(answer * entry) + commission(answer * (entry - dist)), 2):2} at the stop.",
      hint: "{budget:2} ÷ {dist + 0.0005 * (2 * entry - dist):4} = {budget / (dist + 0.0005 * (2 * entry - dist)):1}. Round down.",
    },
  },
  // 3.1.3
  {
    id: "q-3.1.3-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Why can a stop cascade feed itself?",
    options: [
      { id: "a", label: "Stops are limit orders that pull price toward them", rationale: "Stops aren't limits. They wait until triggered, then become market orders." },
      { id: "b", label: "Market makers chase the stops on purpose", rationale: "That's an intent story. The mechanism needs nobody's intent: market orders walking a thin book are enough." },
      { id: "c", label: "Each triggered stop widens the spread to 1.00", rationale: "Spreads can widen in fast moves, but the feedback comes from fills moving price into the next trigger." },
      { id: "d", label: "Triggered stops become market orders whose fills move price into the next stops" },
    ],
    correct: "d",
    explanation: "A triggered stop is a market order. It takes what's offered, so each fill can be a little worse. If those fills reach the next cluster's triggers, more market orders follow: positive feedback. Osler (2005) links this to trends speeding up through stop clusters (grade B).",
    lesson: "3.1.3",
    concepts: ["stop-cascade", "slippage"],
  },
  {
    id: "q-3.1.3-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "Yesterday's high is 101.00. A candle trades up to 101.14 and closes at 100.92. The next candle closes at 100.85. Your written rule: back inside within one bar is a sweep; a close beyond with follow-through is a breakout.",
    prompt: "How do you classify the break?",
    options: [
      { id: "a", label: "A sweep: it closed back inside on the same bar" },
      { id: "b", label: "A breakout: it traded 0.14 above the level", rationale: "Trading above isn't closing above. The rule reads closes, and this bar closed at 100.92, inside." },
      { id: "c", label: "A stop hunt by a large player", rationale: "The chart shows a sweep, not who caused it or why. 'Stop hunt' assumes an intent nobody can see." },
      { id: "d", label: "Unclassified: wait ten more bars", rationale: "The rule decides within one bar. Changing the wait after seeing the chart turns a rule into a guess." },
    ],
    correct: "a",
    explanation: "Price traded through 101.00, likely triggering the buy stops there, then closed back inside on the same bar: a sweep by the written rule. What the rule doesn't say is that a reversal now follows. That claim is grade D.",
    lesson: "3.1.3",
    concepts: ["liquidity-sweep", "false-breakout"],
    hints: ["Look at the close, not the high.", "Back inside within one bar is the sweep condition."],
  },
  {
    id: "q-3.1.3-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "What does the evidence say about 'after a sweep comes a reversal'?",
    options: [
      { id: "a", label: "It's well established: sweeps mark turning points", rationale: "No published study shows that. It's a practitioner claim, grade D." },
      { id: "b", label: "It works in FX but not in stocks", rationale: "There's no such split. The one test, on G10 FX, found continuation more often, not reversal." },
      { id: "c", label: "The one systematic test, an unreviewed preprint, found continuation more often than reversal" },
      { id: "d", label: "It's proven, because stops are always hunted before reversals", rationale: "That's intent attribution. A chart can show that stops were triggered, never that someone hunted them." },
    ],
    correct: "c",
    explanation: "Trends speeding up through stop clusters is grade B (Osler 2005). Reversal after a sweep is grade D: the one systematic test, Mahadzva 2026, an unreviewed preprint on G10 FX, found swept levels followed more often by continuation. Treat a sweep as a classified event, not a signal.",
    lesson: "3.1.3",
    concepts: ["liquidity-sweep", "stop-cascade"],
    hints: ["Think about what a cascade does to a move: speed it up, or reverse it?", "Grade D means claimed, not shown."],
  },
  // 3.1.4
  {
    id: "q-3.1.4-1",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "Two swing highs sit at 101.48 and 101.52. ATR is 0.60, and your rule calls two highs equal if their gap is at most 0.1 × ATR. What is the tolerance, in price?",
    numeric: { answer: 0.06, tolerance: 0.001, unit: "" },
    explanation: "Tolerance = 0.1 × 0.60 = 0.06. The gap, |101.52 − 101.48| = 0.04, is inside it, so these count as equal highs. The tolerance is written before you look, not chosen to fit the chart.",
    lesson: "3.1.4",
    concepts: ["equal-highs-lows"],
    hints: ["The tolerance is a fraction of ATR.", "0.1 × 0.60."],
    vary: {
      fields: { atr: [0.3, 1.5, 0.1], h1: [95, 105, 0.01], gap: [0.01, 0.12, 0.01] },
      answer: "round(0.1 * atr, 2)",
      prompt: "Two swing highs sit at {h1:2} and {h1 + gap:2}. ATR is {atr:2}, and your rule calls two highs equal if their gap is at most 0.1 × ATR. What is the tolerance, in price?",
      explanation: "Tolerance = 0.1 × {atr:2} = {answer:2}. The gap is {gap:2}; the two highs count as equal only if it is {answer:2} or less. The tolerance is written before you look, not chosen to fit the chart.",
      hint: "0.1 × {atr:2}.",
    },
  },
  {
    id: "q-3.1.4-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "'Equal highs will be swept.' What does the claim say, and what grade does it get?",
    options: [
      { id: "a", label: "That stops rest above equal highs: grade A", rationale: "That's a different, weaker claim about where orders sit, and even it is only plausible, grade C, never measured for swings." },
      { id: "b", label: "That price will trade above them, a forecast with no published probability: grade D" },
      { id: "c", label: "Proven by every double top that later broke", rationale: "Counting only the breaks is selection. You'd need the share that broke against random levels at the same distance." },
      { id: "d", label: "A mechanical definition, like a swing high", rationale: "A definition can't be wrong; this is a forecast about what price will do. Forecasts need tests." },
    ],
    correct: "b",
    explanation: "The claim is a forecast: price will trade through the level. No study publishes how often that happens beyond the base rate, so it's grade D. The weaker claim, that stops plausibly rest there, is grade C.",
    lesson: "3.1.4",
    concepts: ["equal-highs-lows", "base-rates"],
    hints: ["Is it about where orders sit, or about what price will do?", "Ask what data would back it, and whether that data exists."],
  },
  {
    id: "q-3.1.4-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why compare equal highs with random levels at the same distance from price?",
    options: [
      { id: "a", label: "Because random levels are where stops really are", rationale: "Random levels are a control, not a guess about orders. They show what any level gets." },
      { id: "b", label: "Distance doesn't matter; any random level would do", rationale: "Distance matters most. Close levels get hit more often, so the control must sit at the same distance." },
      { id: "c", label: "Price reaches nearby levels often anyway; the control shows the base rate any level gets" },
      { id: "d", label: "To make the test harder to pass", rationale: "The control isn't extra difficulty. Without it, a high hit rate could just reflect how close the level was." },
    ],
    correct: "c",
    explanation: "On a random walk, equal highs broke within 20 candles 69.3% of the time and random levels at the same distance 67.4%: a gap inside the noise band. Without the control, 69.3% looks like an edge. With it, it's the base rate.",
    lesson: "3.1.4",
    concepts: ["base-rates", "equal-highs-lows"],
    hints: ["What would a level get if it meant nothing at all?", "Closer levels are reached more often, whatever they are."],
  },
  // 3.1.5
  {
    id: "q-3.1.5-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "A trader says 'there's an imbalance at 100.50'. Which two meanings could that have?",
    options: [
      { id: "a", label: "More aggressive buying than selling at the best prices, or a fast one-sided price move" },
      { id: "b", label: "A gap between two trading sessions, or a weekend gap", rationale: "Those are gaps between sessions. Imbalance means lopsided order flow or a fast one-sided move." },
      { id: "c", label: "A wide spread, or a low-volume candle", rationale: "Neither is the usual meaning. Imbalance is about which side dominates, in the orders or in the move." },
      { id: "d", label: "A support level, or a resistance level", rationale: "A level isn't an imbalance. The word describes order flow or how price moved." },
    ],
    correct: "a",
    explanation: "Order-flow imbalance is more aggressive buying than selling at the best prices; it predicts the next few ticks (grade B), too fast to trade on for most people. Price imbalance is a fast one-sided move with little two-sided trading. Say which one you mean.",
    lesson: "3.1.5",
    concepts: ["price-imbalance"],
  },
  {
    id: "q-3.1.5-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "Three LABX candles. Candle 1: high 100.40. Candle 2: open 100.35, close 101.20. Candle 3: low 100.70, close 101.40. How tall is the bullish three-candle gap?",
    numeric: { answer: 0.3, tolerance: 0.001, unit: "" },
    explanation: "The gap runs from candle 1's high, 100.40, to candle 3's low, 100.70: 100.70 − 100.40 = 0.30. Candle 2's body doesn't set the edges; the neighbours' wicks do.",
    lesson: "3.1.5",
    concepts: ["fair-value-gap"],
    hints: ["The gap sits between candle 1 and candle 3.", "Candle 3's low minus candle 1's high."],
    vary: {
      fields: { h1: [95, 105, 0.01], gap: [0.05, 0.6, 0.01] },
      answer: "gap",
      prompt: "Three LABX candles. Candle 1: high {h1:2}. Candle 2: open {h1 - 0.05:2}, close {h1 + gap + 0.5:2}. Candle 3: low {h1 + gap:2}, close {h1 + gap + 0.7:2}. How tall is the bullish three-candle gap?",
      explanation: "The gap runs from candle 1's high, {h1:2}, to candle 3's low, {h1 + gap:2}: {h1 + gap:2} − {h1:2} = {answer:2}. Candle 2's body doesn't set the edges; the neighbours' wicks do.",
      hint: "{h1 + gap:2} − {h1:2}.",
    },
  },
  {
    id: "q-3.1.5-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "On a random walk, gaps were revisited within 20 bars 83.4% of the time, and random levels at the same distance 83.5%. What follows?",
    options: [
      { id: "a", label: "Gaps fill reliably, so trade toward them", rationale: "83.4% is what any level at that distance gets. A fill rate equal to the base rate is no edge." },
      { id: "b", label: "Random walks are useless for testing", rationale: "That's exactly their use: a market with no structure shows what a method gets from chance alone." },
      { id: "c", label: "Real markets must be random walks", rationale: "A null model shows what chance produces. It isn't evidence that real markets are random." },
      { id: "d", label: "'Gaps fill' is mostly the base rate: nearby prices get revisited, gap or no gap" },
    ],
    correct: "d",
    explanation: "When gaps and random levels at the same distance get the same rate, the gap adds nothing. The high fill rate comes from distance: nearby prices are revisited often. A real edge would need a rate beyond the base rate, on real data, after costs.",
    lesson: "3.1.5",
    concepts: ["base-rates", "fair-value-gap"],
    hints: ["Compare the two numbers, not the first one alone.", "What does a level with no meaning get?"],
  },
  // 3.1.6
  {
    id: "q-3.1.6-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which pairing of a zone-grading criterion and its measurement is right?",
    options: [
      { id: "a", label: "Departure: the number of candles in the base", rationale: "That's time at base. Departure is the size of the move away from the zone, in ATR." },
      { id: "b", label: "Freshness: how many times price has come back into the zone since it formed" },
      { id: "c", label: "Location: the size of the move away, in ATR", rationale: "That's departure. Location is where the zone sits relative to a higher-timeframe level." },
      { id: "d", label: "Time at base: the distance to a daily level", rationale: "That's location. Time at base counts the candles in the base." },
    ],
    correct: "b",
    explanation: "Departure is the move away in ATR; time at base counts the base candles; freshness counts returns into the zone; location measures the distance to a higher-timeframe level. Each is a number, so a grade can be checked and locked.",
    lesson: "3.1.6",
    concepts: ["zone-grading"],
  },
  {
    id: "q-3.1.6-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Firms published support and resistance levels with 'strength' ratings. What did Osler (2000) find about the ratings?",
    options: [
      { id: "a", label: "Strong levels held far more often than weak ones", rationale: "That's what the ratings promised, not what the data showed." },
      { id: "b", label: "The levels as a group had a small effect, but the strength ratings added nothing" },
      { id: "c", label: "No published level beat random levels", rationale: "The levels as a group did a little better: 60.8% against 56.2%. It was the ratings that added nothing." },
      { id: "d", label: "Weak levels held more often than strong ones", rationale: "There was no reversal either. The ratings simply carried no information." },
    ],
    correct: "b",
    explanation: "Published levels stopped intraday trends 60.8% of the time against 56.2% for random levels: small but real. The firms' strength ratings didn't separate levels that held from levels that didn't. A grade is a claim that needs its own test.",
    lesson: "3.1.6",
    concepts: ["zone-grading", "support-and-resistance"],
    hints: ["Two findings: one about the levels, one about the ratings.", "Did a 'strong' label change how often a level held?"],
  },
  {
    id: "q-3.1.6-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why do zones drawn after a session look better than zones locked before it?",
    options: [
      { id: "a", label: "Drawing after uses the outcome: failures get dropped or moved onto the real turns" },
      { id: "b", label: "Traders draw better zones when they're calm", rationale: "Calm isn't the difference. The redrawn zones were placed knowing where price turned." },
      { id: "c", label: "Markets respect zones more in hindsight", rationale: "Markets don't change after the fact; the drawings do." },
      { id: "d", label: "Locked zones are drawn too wide", rationale: "Width matters, but the gap here comes from knowing the result. Wider zones would 'react' more, not less." },
    ],
    correct: "a",
    explanation: "A zone drawn after the session can be placed where price did turn, and the failures quietly vanish. In the lesson's example, 40% became 86% with the same rules. Only a locked drawing tests the method.",
    lesson: "3.1.6",
    concepts: ["zone-grading", "hindsight-bias"],
    hints: ["What does the trader know after the session that they didn't know before?", "Which zones tend to disappear from the after-drawing?"],
  },
  // 3.1.7
  {
    id: "q-3.1.7-1",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "After a failed breakout the x-ray shows trapped buyers: 600 units at 101.05, 500 at 101.10 and 300 at 101.15. What is their average entry price?",
    numeric: { answer: 101.09, tolerance: 0.01, unit: "vUSD" },
    explanation: "Total cost: 600 × 101.05 + 500 × 101.10 + 300 × 101.15 = 141,525.00 for 1,400 units. 141,525.00 ÷ 1,400 = 101.089, about 101.09: their break-even.",
    lesson: "3.1.7",
    concepts: ["trapped-inventory"],
    hints: ["Weight each price by its size.", "Add the three products, then divide by the total units.", "141,525.00 ÷ 1,400."],
    vary: {
      fields: { p: [95, 105, 0.01], a: [100, 900, 100], b: [100, 900, 100], c: [100, 900, 100] },
      answer: "round((a * p + b * (p + 0.05) + c * (p + 0.1)) / (a + b + c), 2)",
      prompt: "After a failed breakout the x-ray shows trapped buyers: {a} units at {p:2}, {b} at {p + 0.05:2} and {c} at {p + 0.1:2}. What is their average entry price?",
      explanation: "Total cost: {a} × {p:2} + {b} × {p + 0.05:2} + {c} × {p + 0.1:2} = {a * p + b * (p + 0.05) + c * (p + 0.1):2} for {a + b + c} units. Divided by {a + b + c}, that's about {answer:2}: their break-even.",
      hint: "{a * p + b * (p + 0.05) + c * (p + 0.1):2} ÷ {a + b + c}.",
    },
  },
  {
    id: "q-3.1.7-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "Trapped longs from a failed breakout: some have stops under 100.60; the rest have no stop and average 101.09. Price is at 100.80.",
    prompt: "What does each group's exit tend to do to price?",
    options: [
      { id: "a", label: "Both exits are buys that lift price", rationale: "Longs exit by selling. Neither group buys when it gets out." },
      { id: "b", label: "The stops stall a fall; the break-even exits lift a rally", rationale: "Reversed. Triggered sell stops add to a fall; sellers at break-even lean against a rally." },
      { id: "c", label: "Below 100.60 the stops become market sells that speed a fall; near 101.09 break-even sales can stall a rally" },
      { id: "d", label: "Neither matters once the breakout has failed", rationale: "The positions are still there. Their exits are orders, and orders move price." },
    ],
    correct: "c",
    explanation: "Longs exit by selling. At 100.60 the stops turn into market sells that add to a fall, the cascade mechanism. Near 101.09 the unprotected longs sell to get out flat, which can stall a rally. Grade C: plausible, not directly tested.",
    lesson: "3.1.7",
    concepts: ["trapped-inventory", "stop-cascade"],
    hints: ["How does a long get out: by buying or by selling?", "A stop sells at market; a break-even exit sells into a rally."],
  },
  {
    id: "q-3.1.7-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "How do break-even exits explain role reversal, and how strong is the evidence?",
    options: [
      { id: "a", label: "Traders wrong at the old level exit flat on the retest, adding orders that defend it; plausible, mixed evidence: grade C" },
      { id: "b", label: "Institutions defend the level on purpose; proven: grade A", rationale: "That's an intent story. The break-even mechanism needs no plan, and its evidence is mixed." },
      { id: "c", label: "Broken levels always hold on the retest; grade B", rationale: "Retests fail often. Nothing in the evidence makes them hold 'always'." },
      { id: "d", label: "It's random: role reversal has no possible mechanism", rationale: "There is a plausible mechanism. What's missing is strong evidence that it beats random levels." },
    ],
    correct: "a",
    explanation: "Shorts who sold at a broken resistance buy back near their entry on the retest, so buying meets the dip there. That's a plausible mechanism with mixed evidence, grade C. Only retests that hold more often than random levels at the same distance would support it.",
    lesson: "3.1.7",
    concepts: ["role-reversal", "trapped-inventory"],
    hints: ["Who is under water after the level breaks, and what do they want?", "Mechanism and evidence are two different questions."],
  },
];

// ─── Glossary terms new in this unit ────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "liquidity-pool",
    term: "Liquidity pool",
    definition: "A cluster of resting orders near one price, such as stop-losses just beyond a swing high or take-profits on a round number.",
    plain: "A crowd of waiting orders in one spot on the chart.",
    related: ["liquidity", "resting-order", "stop-cluster", "take-profit-cluster"],
    lesson: "3.1.1",
  },
  {
    id: "resting-order",
    term: "Resting order",
    definition: "An order waiting in the book, or at the broker, until price reaches it: a limit order, a take-profit or a stop.",
    plain: "An order that sits and waits for its price.",
    related: ["limit-order", "stop-order", "take-profit", "liquidity-pool"],
    lesson: "3.1.1",
  },
  {
    id: "conditional-order",
    term: "Conditional order",
    definition: "An order that acts only when price reaches a trigger, such as a stop-loss or a take-profit.",
    plain: "An 'if price gets here, do this' order.",
    related: ["stop-loss", "take-profit", "stop-order", "resting-order"],
    lesson: "3.1.2",
  },
  {
    id: "take-profit-cluster",
    term: "Take-profit cluster",
    definition: "Many take-profit orders at the same price, often exactly on a round number. As passive limits, they tend to slow price there.",
    plain: "A crowd of profit targets on one price, usually a round one.",
    related: ["take-profit", "round-number", "stop-cluster", "liquidity-pool"],
    lesson: "3.1.2",
  },
  {
    id: "stop-cascade",
    term: "Stop cascade",
    definition: "Triggered stops become market orders whose fills push price into more stops, so the move speeds up.",
    plain: "One batch of stops sets off the next, like dominoes.",
    related: ["stop-cluster", "stop-order", "slippage", "liquidity-sweep"],
    lesson: "3.1.3",
  },
  {
    id: "liquidity-sweep",
    term: "Liquidity sweep",
    definition: "Price trades through a level, triggers the stops there, then closes back inside, within one bar under this course's rule. It is known only after the close.",
    plain: "A quick poke through a level that sets off the stops, then a close back inside.",
    related: ["false-breakout", "stop-cascade", "breakout", "stop-cluster"],
    lesson: "3.1.3",
    aka: ["Stop run"],
  },
  {
    id: "equal-highs-lows",
    term: "Equal highs / equal lows",
    definition: "Two or more neighbouring swing highs, or lows, within a stated tolerance of each other, often a fraction of ATR.",
    plain: "Two peaks, or two dips, at almost the same price.",
    related: ["swing-high", "swing-low", "double-top", "double-bottom", "detection-tolerance"],
    lesson: "3.1.4",
  },
  {
    id: "reference-level",
    term: "Reference level",
    definition: "A price many traders watch, such as the prior-day high or low, the session high or low, the opening price or a round number.",
    plain: "A line almost everyone has on their chart.",
    related: ["round-number", "opening-range", "trading-session", "liquidity-pool"],
    lesson: "3.1.4",
  },
  {
    id: "detection-tolerance",
    term: "Detection tolerance",
    definition: "How close two prices must be to count as equal under a rule, written before looking, often as a fraction of ATR.",
    plain: "The 'close enough' setting of a rule.",
    related: ["equal-highs-lows", "atr"],
    lesson: "3.1.4",
  },
  {
    id: "fair-value-gap",
    term: "Fair value gap",
    definition: "A three-candle gap: candle 1's high sits below candle 3's low, or candle 1's low above candle 3's high. The gap is the price range between them.",
    plain: "A hole left by one fast candle, between its neighbours' wicks.",
    related: ["gap", "imbalance", "liquidity-void"],
    lesson: "3.1.5",
    aka: ["FVG", "Three-candle gap"],
  },
  {
    id: "imbalance",
    term: "Imbalance",
    definition: "Either more aggressive buying than selling at the best prices (order-flow imbalance), or a fast one-sided price move (price imbalance). Say which one you mean.",
    plain: "A lopsided market: in the orders, or in the way price moved.",
    related: ["fair-value-gap", "liquidity-void", "volume"],
    lesson: "3.1.5",
  },
  {
    id: "liquidity-void",
    term: "Liquidity void",
    definition: "A price area crossed quickly with little trading, such as a low-volume node or single prints.",
    plain: "A stretch of price that was skipped through in a hurry.",
    related: ["low-volume-node", "fair-value-gap", "volume-profile"],
    lesson: "3.1.5",
  },
  {
    id: "zone-grade",
    term: "Zone grade",
    definition: "A rating given to a supply or demand zone from written criteria, such as departure, time at base, freshness and location, before seeing what happens.",
    plain: "A score for a zone, set by rules, not by feel.",
    related: ["supply-zone", "demand-zone", "fresh-zone", "locked-drawing"],
    lesson: "3.1.6",
  },
  {
    id: "locked-drawing",
    term: "Locked drawing",
    definition: "A level or zone fixed before the session, so it can't be redrawn after the result.",
    plain: "A drawing you can't move once the market starts.",
    related: ["zone-grade", "hindsight-bias"],
    lesson: "3.1.6",
  },
  {
    id: "trapped-inventory",
    term: "Trapped inventory",
    definition: "Positions caught on the wrong side of a failed move, described by their size and average price.",
    plain: "How much got caught, and at what price.",
    related: ["trapped-trader", "break-even-exit", "failed-breakout"],
    lesson: "3.1.7",
  },
  {
    id: "break-even-exit",
    term: "Break-even exit",
    definition: "Closing a losing position as soon as price returns to the entry price.",
    plain: "Getting out flat, with no gain and no loss, after being under water.",
    related: ["trapped-inventory", "loss-aversion", "break-even", "role-reversal"],
    lesson: "3.1.7",
  },
];

// ─── Concepts new in this unit ──────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "liquidity-pool",
    name: "Liquidity pool",
    category: "order_types",
    summary: "A concentration of resting orders (limits, take-profits, stop-losses) at or near a price level.",
    body: [
      "On a chart, 'liquidity' means orders waiting at a price. Limit entries and take-profits fill passively and absorb the flow that reaches them; stop-losses wait until price touches their trigger and then become market orders that add to the move.",
      "Pools plausibly form where many traders put orders for the same reasons: just beyond range edges and swing extremes, beyond prior-day highs and lows, and at or just past round numbers. That clustering is documented for round numbers (Osler, grade B). A chart never shows the real orders, only where they plausibly sit.",
      "Presence is not attraction. 'Price is drawn to liquidity' has no evidence behind it (grade D): orders wait where people put them, and price reaches them only if it gets there for other reasons.",
    ],
    example: "LABX ranges between 99.20 and 101.00. Longs bought near 99.25 keep sell stops at 99.10–99.19. If price falls there, those stops become market sells and can speed the fall; nothing says price must go there.",
    related: ["stop-loss-order", "limit-order", "support-and-resistance", "round-numbers", "base-rates"],
    missions: [],
    lessons: ["3.1.1"],
  },
  {
    id: "stop-clustering",
    name: "Stop and take-profit clustering",
    category: "stop_loss",
    summary: "Conditional orders bunch near round numbers: take-profits at the level, stop-losses just beyond it.",
    body: [
      "In 9,667 conditional orders at one large FX bank, Osler found take-profits ending exactly in 00 far more often than stop-losses (9.3% against 4.4%). Stop-loss buys sat just above round numbers, 14.4% in xx01–xx10 against 7.4% just below, and stop-loss sells mirrored them just below.",
      "The two clusters act differently. Take-profits are passive limits that tend to stall price at the number; stop clusters, once triggered, add market orders and can speed a break up. Exchange rates spend less time at round numbers, consistent with stops pushing price through them. One bank and one market: grade B.",
      "For your own stop, the practical rule is to sit outside the crowded band and resize so the loss at the stop still fits the budget.",
    ],
    example: "Long at 100.60 with the stop at 99.98, inside the sell-stop band under 100.00. Moving it to 99.87 widens the stop from 0.62 to 0.73, so the size falls from 138 to 120 units to keep the loss, costs included, within 100.00.",
    related: ["round-numbers", "stop-loss-order", "support-and-resistance", "position-sizing", "cost-adjusted-sizing"],
    missions: ["M04"],
    lessons: ["3.1.2"],
  },
  {
    id: "stop-cascade",
    name: "Stop cascade",
    category: "stop_loss",
    summary: "Triggered stops become market orders that push price into further stops, accelerating the move.",
    body: [
      "A triggered stop is a market order. In a thin book it takes the nearest offers, then the next ones, so its fills drift away from the trigger: slippage. If those fills reach the next cluster's triggers, more market orders follow, and the move feeds itself.",
      "Osler (2005) describes stop-loss orders as positive-feedback trading that helps trends speed up through clusters and contributes to fat tails (grade B). The mechanism needs no one's intent: 'stop hunt' adds a motive the chart can't show.",
    ],
    example: "1,000 units of buy stops trigger at 100.01. They fill 300 at 100.02, 200 at 100.03, 250 at 100.05 and 250 at 100.08: an average of 100.04. The last fills reach the next cluster at 100.06–100.10.",
    related: ["slippage", "stop-loss-order", "breakout", "round-numbers"],
    missions: ["M07"],
    lessons: ["3.1.3", "3.1.7"],
  },
  {
    id: "liquidity-sweep",
    name: "Liquidity sweep",
    category: "technical_analysis",
    summary: "Price trades through a level where stops rest, then closes back inside; known only after the close.",
    body: [
      "A sweep and a breakout start the same way: price trades through a level and sets off the stops beyond it. They differ only at the close. This course's rule: a close back inside within one bar is a sweep; a close beyond with follow-through is a breakout. Before the close, nothing on the chart decides it.",
      "The popular claim that a reversal follows a sweep is grade D: the one systematic test found, an unreviewed 2026 preprint on G10 FX, saw swept levels followed more often by continuation. So a sweep is a classified event, not a signal, and the plan, invalidation and size, is written before the bar closes.",
    ],
    example: "Yesterday's high is 101.00. A candle trades to 101.12 and closes at 100.94: a sweep. Another closes at 101.22 and the next at 101.40: a breakout. Mid-bar, both showed 101.08.",
    related: ["false-breakout", "breakout", "invalidation-level", "support-and-resistance"],
    missions: [],
    lessons: ["3.1.3"],
  },
  {
    id: "equal-highs-lows",
    name: "Equal highs and lows",
    category: "technical_analysis",
    summary: "Two or more swing extremes within a stated tolerance, beyond which stops plausibly rest.",
    body: [
      "Equal highs are neighbouring swing highs at nearly the same price, with no higher high between them; equal lows mirror them. In classic terms they are double tops and bottoms. 'Nearly' needs a written tolerance, usually a fraction of ATR: the looser the rule, the more pairs it finds.",
      "Stops plausibly rest just beyond such obvious extremes (grade C, extrapolated from round-number data). The claim that equal highs 'will be swept' has no published probability (grade D). The test compares them with random levels at the same distance from price; on a random walk the two break about as often.",
    ],
    example: "ATR 0.60 and a 0.1 × ATR rule give a tolerance of 0.06. Highs at 101.48 and 101.52, 0.04 apart, are equal; at 0.05 × ATR, 0.03, they aren't.",
    related: ["double-tops-and-bottoms", "support-and-resistance", "base-rates"],
    missions: [],
    lessons: ["3.1.4"],
  },
  {
    id: "reference-levels",
    name: "Reference levels",
    category: "technical_analysis",
    summary: "Widely watched prices: prior-day and session highs and lows, opening prices and round numbers.",
    body: [
      "Some prices are on almost every chart: the prior-day and prior-week high and low, the current session's high and low, the opening price and round numbers. Because platforms plot them automatically, many traders see the same lines.",
      "That shared view makes orders around them plausible, a coordination effect (grade C). The claim that price reacts to them at a fixed rate is grade D. As with any level, the test is against random levels at the same distance.",
    ],
    example: "Yesterday LABX ranged from 99.40 to 100.80; today opened at 100.30 and has reached 100.55. The plotted lines are 100.80, 100.55, 100.30, 100.00 and 99.40.",
    related: ["support-and-resistance", "round-numbers", "base-rates"],
    missions: [],
    lessons: ["3.1.4"],
  },
  {
    id: "price-imbalance",
    name: "Price imbalance",
    category: "technical_analysis",
    summary: "A fast one-sided move that leaves prices with little two-sided trading; not the same as order-flow imbalance.",
    body: [
      "'Imbalance' is used for two different things. Order-flow imbalance is more aggressive buying than selling at the best prices; it predicts price over the next few ticks, milliseconds to seconds (grade B), a horizon below a retail trader's costs.",
      "Price imbalance describes how price moved: a fast, one-sided run that left some prices with little two-sided trading, often visible as a three-candle gap. It describes the past. That price must return to 'balance' it is a separate claim, and on a null model it matches the base rate.",
    ],
    example: "A candle runs from 100.35 to 101.20 between a candle whose high is 100.40 and one whose low is 100.70. Prices from 100.40 to 100.70 traded only during that one fast candle.",
    related: ["volume-profile", "gap-types", "price-gaps"],
    missions: [],
    lessons: ["3.1.5"],
  },
  {
    id: "fair-value-gap",
    name: "Fair value gap",
    category: "technical_analysis",
    summary: "A three-candle gap between candle 1's extreme and candle 3's opposite extreme; its revisit rate matches the base rate.",
    body: [
      "A bullish three-candle gap exists when the first candle's high is below the third candle's low; a bearish one when the first candle's low is above the third candle's high. The gap is the price range between them, and measuring it in ATR lets one filter work across calm and volatile markets.",
      "Identifying it is mechanical. The claim that gaps 'fill' is grade D as information: in a 1,000,000-bar random-walk simulation, 83.4% were revisited within 20 bars, against 83.5% for random levels at the same distance, and a first-touch trade won 50.2% against 50.1%.",
    ],
    example: "Candle 1 high 100.40, candle 2 from 100.35 to 101.20, candle 3 low 100.70: a 0.30 gap. With ATR 0.60, that's 0.5 ATR.",
    related: ["price-gaps", "gap-types", "base-rates", "random-walk"],
    missions: [],
    lessons: ["3.1.5"],
  },
  {
    id: "liquidity-void",
    name: "Liquidity void",
    category: "technical_analysis",
    summary: "A price area traded quickly with little volume or time, such as a low-volume node or single prints.",
    body: [
      "When price runs through an area fast, little volume and little time are spent there. Volume profile shows it as a low-volume node; Market Profile as single prints; a candle chart often as a three-candle gap.",
      "That the area was crossed fast is a fact about the past. That price must come back to 'repair' it is grade D. Such areas can matter for execution, since there were few resting orders there last time, but not as a forecast.",
    ],
    example: "A breakout candle crosses 100.40–100.70 in one bar. On the volume profile those prices show little volume. Price may revisit them, or not; nearby prices get revisited at the base rate either way.",
    related: ["volume-profile", "gap-types", "base-rates"],
    missions: [],
    lessons: ["3.1.5"],
  },
  {
    id: "zone-grading",
    name: "Zone grading",
    category: "technical_analysis",
    summary: "Rating supply and demand zones with written criteria before the session, then testing whether grades beat random zones.",
    body: [
      "A zone grade turns judgment into checkable numbers: departure (the move away, in ATR), time at base (candles in the base), freshness (returns since it formed) and location (distance to a higher-timeframe level). Grades are locked before the session, so they can't be adjusted to the result.",
      "The test compares graded zones with random zones of the same width, because wider zones 'react' more often by width alone. In Osler (2000), firms' strength ratings on published levels added nothing. Zones drawn after the fact look far better than locked ones: that difference is hindsight, not edge.",
    ],
    example: "Locked before the session, 4 of 10 zones reacted: 40%. Redrawn after it, with failures dropped or moved onto the turns, 6 of 7 'reacted': 86%. The same rules, 46 points better on paper.",
    related: ["supply-demand-zones", "hindsight-bias", "support-and-resistance", "base-rates"],
    missions: [],
    lessons: ["3.1.6"],
  },
  {
    id: "trapped-inventory",
    name: "Trapped inventory",
    category: "technical_analysis",
    summary: "The size and average price of positions caught in a failed move, whose stops and break-even exits shape later reactions.",
    body: [
      "After a failed breakout, the traders who bought it hold positions with a size and an average price. They exit in two places: at their stops, where market orders can speed the move against them, and at break-even, where those without stops sell to get out flat and can stall a rally.",
      "The same mechanism explains role reversal: shorts caught by a broken resistance buy back near break-even on the retest, so buying meets the dip. Trapped traders as fuel is grade C, consistent with Osler's cascades but not tested directly; role reversal through break-even exits is grade C, with mixed evidence.",
    ],
    example: "Trapped buyers: 600 at 101.05, 500 at 101.10, 300 at 101.15, an average of 101.09. 900 have stops under 100.60; the other 500 wait for 101.09.",
    related: ["trapped-traders", "stop-cascade", "role-reversal", "loss-aversion", "support-and-resistance"],
    missions: ["M07"],
    lessons: ["3.1.7"],
  },
];

/** Unit 3.1 · Liquidity and stops (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_3_1: UnitContent = { lessons: [L311, L312, L313, L314, L315, L316, L317], questions: QUESTIONS, terms: TERMS, concepts: CONCEPTS };
