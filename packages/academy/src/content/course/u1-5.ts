import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, MarkRole, Question, TapZone, UnitContent } from "../../types";
import { L05_EVIDENCE } from "../scripts/u2";

/*
 * Unit 1.5 · Market structure basics: 1.5.1, 1.5.3, 1.5.5–1.5.8 (1.5.2 is L05 and 1.5.4 is L06, in scripts/u2.ts).
 *
 * Conventions in this file (as in scripts/u2.ts):
 * - Candle indices in layers and tap zones are 0-based; copy uses 1-based candle numbers ("candle 21" is index 20).
 * - Swing high (low): a high (low) above (below) the highs (lows) of the two candles on each side (swingPoints, k = 2).
 *   None of the series below has a tie inside a swing's window, so "above" and "at least" give the same swings.
 * - Every series is written for the lesson and checked against each number the copy quotes.
 */

/** Rows of [open, high, low, close] → candles. */
const k = (rows: [number, number, number, number][]): CandleData[] => rows.map(([o, h, l, c]) => ({ o, h, l, c }));
const mark = (index: number, at: "high" | "low" | "close", label?: string, role: MarkRole = "concept"): ChartLayer => ({ kind: "marker", index, at, label, role });
/** Tap zones on candles `from`…`to` (1-based, inclusive). */
const candleZones = (from: number, to: number): TapZone[] => Array.from({ length: to - from + 1 }, (_, j) => ({ id: `c${from + j}`, label: `Candle ${from + j}`, index: from + j - 1 }));

// ─── Chart data ─────────────────────────────────────────────────────────────

/**
 * 1.5.1: 30 candles, 100.00 → 102.10. 2-candle rule: swing highs 101.20 (c5), 101.60 (c11), 101.70 (c18), 102.40 (c25);
 * swing lows 100.30 (c8), 100.70 (c14), 100.90 (c21), 101.50 (c28). c16 peaks at 101.50 but c18 is higher (101.70).
 * 5-candle rule: highs c11, c25; lows c8, c21. First 20 candles: highs c5, c11, c18; lows c8, c14.
 */
const S30: CandleData[] = k([
  [100.00, 100.35, 99.90, 100.25], [100.25, 100.62, 100.15, 100.55], [100.55, 100.88, 100.45, 100.80], [100.80, 101.08, 100.70, 101.00], [101.00, 101.20, 100.85, 100.95],
  [100.95, 101.02, 100.62, 100.70], [100.70, 100.78, 100.40, 100.45], [100.45, 100.58, 100.30, 100.50], [100.50, 100.92, 100.45, 100.85], [100.85, 101.32, 100.78, 101.25],
  [101.25, 101.60, 101.18, 101.40], [101.40, 101.48, 101.08, 101.15], [101.15, 101.22, 100.88, 100.95], [100.95, 101.05, 100.70, 101.00], [101.00, 101.38, 100.92, 101.30],
  [101.30, 101.50, 101.22, 101.35], [101.35, 101.42, 101.12, 101.20], [101.20, 101.70, 101.15, 101.55], [101.55, 101.62, 101.25, 101.30], [101.30, 101.38, 100.98, 101.05],
  [101.05, 101.18, 100.90, 101.10], [101.10, 101.52, 101.02, 101.45], [101.45, 101.86, 101.38, 101.80], [101.80, 102.22, 101.72, 102.15], [102.15, 102.40, 102.02, 102.20],
  [102.20, 102.28, 101.88, 101.95], [101.95, 102.02, 101.62, 101.70], [101.70, 101.82, 101.50, 101.75], [101.75, 102.02, 101.66, 101.95], [101.95, 102.18, 101.86, 102.10],
]);

/** 1.5.3 hook and B3: swing lows 99.20 (c3), 100.00 (c10); swing highs 100.50 (c6), 104.00 (c21); closes 103.60, 103.20, 102.80 after it. Last 20 candles average 0.40 high to low. */
const PB_LEG: CandleData[] = k([
  [99.60, 99.64, 99.51, 99.53], [99.53, 99.60, 99.45, 99.51], [99.51, 99.55, 99.20, 99.40], [99.40, 99.75, 99.34, 99.70], [99.70, 100.00, 99.63, 99.94],
  [99.94, 100.50, 99.90, 100.28], [100.28, 100.37, 100.21, 100.30], [100.30, 100.38, 100.22, 100.28], [100.28, 100.30, 100.21, 100.24], [100.24, 100.27, 100.00, 100.21],
  [100.21, 100.56, 100.15, 100.52], [100.52, 100.97, 100.45, 100.89], [100.89, 101.31, 100.85, 101.24], [101.24, 101.57, 101.22, 101.53], [101.53, 101.93, 101.49, 101.91],
  [101.91, 102.21, 101.84, 102.16], [102.16, 102.65, 102.09, 102.59], [102.59, 102.92, 102.56, 102.88], [102.88, 103.31, 102.80, 103.25], [103.25, 103.61, 103.18, 103.57],
  [103.57, 104.00, 103.50, 103.87], [103.87, 103.92, 103.52, 103.60], [103.60, 103.66, 103.12, 103.20], [103.20, 103.27, 102.74, 102.80],
]);

/** 1.5.3 Try: swing lows 100.00 (c3), 102.10 (c12), 103.55 (c21), 101.90 (c33); swing highs 103.00 (c9), 105.00 (c18), 106.00 (c27). */
const PB_TRY: CandleData[] = k([
  [100.50, 100.58, 100.38, 100.45], [100.45, 100.55, 100.26, 100.30], [100.30, 100.39, 100.00, 100.18], [100.18, 100.78, 100.14, 100.66], [100.66, 101.15, 100.63, 101.05],
  [101.05, 101.51, 100.96, 101.47], [101.47, 101.98, 101.42, 101.88], [101.88, 102.42, 101.80, 102.35], [102.35, 103.00, 102.29, 102.76], [102.76, 102.83, 102.53, 102.56],
  [102.56, 102.67, 102.42, 102.45], [102.45, 102.49, 102.10, 102.22], [102.22, 102.72, 102.11, 102.67], [102.67, 103.08, 102.58, 103.04], [103.04, 103.53, 102.92, 103.45],
  [103.45, 104.01, 103.40, 103.98], [103.98, 104.45, 103.91, 104.34], [104.34, 105.00, 104.24, 104.79], [104.79, 104.86, 104.40, 104.45], [104.45, 104.57, 103.97, 104.05],
  [104.05, 104.10, 103.55, 103.69], [103.69, 104.09, 103.62, 104.00], [104.00, 104.48, 103.90, 104.38], [104.38, 104.87, 104.31, 104.80], [104.80, 105.11, 104.75, 105.06],
  [105.06, 105.56, 105.01, 105.50], [105.50, 106.00, 105.48, 105.81], [105.81, 105.90, 105.21, 105.23], [105.23, 105.28, 104.44, 104.50], [104.50, 104.56, 103.86, 103.89],
  [103.89, 104.01, 103.19, 103.29], [103.29, 103.40, 102.61, 102.66], [102.66, 102.69, 101.90, 102.04], [102.04, 102.32, 101.94, 102.25], [102.25, 102.50, 102.16, 102.45],
]);

/**
 * 1.5.5 Try: a range with support at 100.00 (lows 100.03 c4, 99.93 c16, 100.04 c27) and resistance near 101.85–101.90
 * (c10, c22). c28 closes at 100.35, so the ask is 100.40. The last 20 candles average 0.40 high to low.
 * c16's dip to 99.93 puts the bid at 99.88: any sell stop from 99.88 to 99.99 fills there.
 */
const RN: CandleData[] = k([
  [100.90, 100.96, 100.65, 100.70], [100.70, 100.73, 100.48, 100.55], [100.55, 100.60, 100.35, 100.37], [100.37, 100.44, 100.03, 100.20], [100.20, 100.46, 100.17, 100.43],
  [100.43, 100.71, 100.34, 100.66], [100.66, 100.99, 100.61, 100.90], [100.90, 101.24, 100.87, 101.20], [101.20, 101.42, 101.12, 101.40], [101.40, 101.90, 101.35, 101.68],
  [101.68, 101.73, 101.27, 101.37], [101.37, 101.41, 101.10, 101.18], [101.18, 101.23, 100.81, 100.91], [100.91, 100.98, 100.55, 100.64], [100.64, 100.68, 100.31, 100.39],
  [100.39, 100.43, 99.93, 100.13], [100.13, 100.45, 100.08, 100.41], [100.41, 100.68, 100.31, 100.63], [100.63, 100.93, 100.60, 100.88], [100.88, 101.16, 100.81, 101.09],
  [101.09, 101.43, 101.06, 101.38], [101.38, 101.85, 101.36, 101.64], [101.64, 101.73, 101.32, 101.35], [101.35, 101.42, 101.01, 101.08], [101.08, 101.13, 100.64, 100.71],
  [100.71, 100.80, 100.46, 100.49], [100.49, 100.53, 100.04, 100.17], [100.17, 100.39, 100.08, 100.35],
]);

/**
 * 1.5.6 hook, B2, B3: resistance turns 101.95 (c5), 101.85 (c12), 102.00 (c19); support 100.30 (c9), 100.25 (c16).
 * c25 breaks out (close 102.45), c27 peaks at 103.20, c30 closes at 102.05 (low 102.02).
 */
const RT_BASE: CandleData[] = k([
  [100.80, 101.05, 100.75, 101.00], [101.00, 101.27, 100.93, 101.19], [101.19, 101.46, 101.11, 101.41], [101.41, 101.65, 101.35, 101.56], [101.56, 101.95, 101.47, 101.76],
  [101.76, 101.83, 101.40, 101.50], [101.50, 101.52, 101.07, 101.10], [101.10, 101.18, 100.80, 100.87], [100.87, 100.91, 100.30, 100.50], [100.50, 100.96, 100.47, 100.92],
  [100.92, 101.35, 100.85, 101.29], [101.29, 101.85, 101.23, 101.62], [101.62, 101.66, 101.21, 101.29], [101.29, 101.31, 100.97, 101.05], [101.05, 101.11, 100.63, 100.72],
  [100.72, 100.74, 100.25, 100.46], [100.46, 100.97, 100.37, 100.88], [100.88, 101.51, 100.84, 101.46], [101.46, 102.00, 101.37, 101.87], [101.87, 101.96, 101.48, 101.56],
  [101.56, 101.60, 101.22, 101.30], [101.30, 101.39, 100.90, 101.04], [101.04, 101.48, 100.98, 101.42], [101.42, 101.80, 101.36, 101.74], [101.74, 102.55, 101.70, 102.45],
  [102.45, 102.90, 102.38, 102.80], [102.80, 103.20, 102.70, 103.05], [103.05, 103.12, 102.62, 102.70], [102.70, 102.78, 102.25, 102.32], [102.32, 102.40, 102.02, 102.05],
]);
/** 1.5.6 ending A (c31–c35): c31 dips to 101.90 and closes at 102.30; highest high 103.85. */
const RT_HOLD: CandleData[] = k([
  [102.05, 102.38, 101.90, 102.30], [102.30, 102.72, 102.22, 102.65], [102.65, 103.15, 102.58, 103.08], [103.08, 103.55, 102.98, 103.45], [103.45, 103.85, 103.35, 103.72],
]);
/** 1.5.6 ending B (c31–c35): c31 closes at 101.60, back inside the range; c32 closes at 101.25. */
const RT_FAIL: CandleData[] = k([
  [102.05, 102.12, 101.52, 101.60], [101.60, 101.68, 101.18, 101.25], [101.25, 101.36, 100.88, 100.95], [100.95, 101.18, 100.85, 101.10], [101.10, 101.15, 100.70, 100.80],
]);

/**
 * 1.5.6 Try (level-drawer). c1–c36 visible (swing highs 98.22 c4, 98.31 c12, 98.40 c20, 98.27 c30; lows 96.75, 96.62, 96.80, 97.40),
 * c37 breaks out (o 98.10, h 98.85, l 98.02, c 98.75): entry at the ask, 98.80. Band 98.22–98.40: 4 touches.
 * FAIL (c38–c49): c40 is the first close under 98.22 (97.94); a stop at 98.00 fills on c40 at 98.00; lowest low 96.84,
 * below every stop the rule allows (a valid band starts at 97.81 or higher, so stops sit at 97.01 or higher).
 * HOLD (c38–c49): the retest dips to 98.33 (c40) and closes at 98.62; lowest close 98.62. No valid stop is touched:
 * a band with 3 touches starts at 98.27 or lower, so stops sit at 98.17 or lower, and the bid never goes under 98.28.
 */
const RTT_BASE: CandleData[] = k([
  [97.60, 97.75, 97.52, 97.72], [97.72, 97.87, 97.67, 97.77], [97.77, 97.91, 97.68, 97.85], [97.85, 98.22, 97.80, 97.98], [97.98, 98.06, 97.66, 97.72],
  [97.72, 97.79, 97.34, 97.40], [97.40, 97.51, 97.03, 97.14], [97.14, 97.24, 96.75, 96.92], [96.92, 97.26, 96.82, 97.19], [97.19, 97.60, 97.15, 97.56],
  [97.56, 97.91, 97.44, 97.80], [97.80, 98.31, 97.70, 98.12], [98.12, 98.24, 97.64, 97.74], [97.74, 97.85, 97.45, 97.48], [97.48, 97.52, 97.00, 97.07],
  [97.07, 97.14, 96.62, 96.79], [96.79, 97.23, 96.70, 97.19], [97.19, 97.66, 97.13, 97.57], [97.57, 98.00, 97.47, 97.94], [97.94, 98.40, 97.83, 98.24],
  [98.24, 98.34, 97.92, 97.95], [97.95, 97.97, 97.64, 97.71], [97.71, 97.81, 97.50, 97.53], [97.53, 97.65, 97.10, 97.22], [97.22, 97.25, 96.80, 97.01],
  [97.01, 97.27, 96.95, 97.24], [97.24, 97.51, 97.22, 97.42], [97.42, 97.80, 97.31, 97.71], [97.71, 97.87, 97.64, 97.81], [97.81, 98.27, 97.76, 98.09],
  [98.09, 98.11, 97.75, 97.86], [97.86, 97.96, 97.66, 97.76], [97.76, 97.79, 97.40, 97.57], [97.57, 97.80, 97.50, 97.75], [97.75, 98.02, 97.70, 97.98],
  [97.98, 98.16, 97.92, 98.10], [98.10, 98.85, 98.02, 98.75],
]);
const RTT_FAIL: CandleData[] = k([
  [98.75, 98.95, 98.62, 98.70], [98.70, 98.76, 98.28, 98.34], [98.34, 98.40, 97.86, 97.94], [97.94, 98.05, 97.60, 97.68], [97.68, 97.80, 97.30, 97.38],
  [97.38, 97.52, 97.12, 97.20], [97.20, 97.45, 97.05, 97.35], [97.35, 97.42, 96.95, 97.02], [97.02, 97.20, 96.88, 97.10], [97.10, 97.28, 96.98, 97.18],
  [97.18, 97.25, 96.90, 96.98], [96.98, 97.12, 96.84, 96.95],
]);
const RTT_HOLD: CandleData[] = k([
  [98.75, 99.05, 98.66, 98.98], [98.98, 99.10, 98.70, 98.78], [98.78, 98.85, 98.33, 98.62], [98.62, 99.00, 98.55, 98.92], [98.92, 99.30, 98.85, 99.22],
  [99.22, 99.48, 99.10, 99.40], [99.40, 99.55, 99.18, 99.28], [99.28, 99.70, 99.22, 99.62], [99.62, 99.95, 99.55, 99.86], [99.86, 100.05, 99.70, 99.78],
  [99.78, 100.20, 99.72, 100.12], [100.12, 100.35, 100.02, 100.28],
]);

/**
 * 1.5.7 hook, B2, B3: swing highs 100.40 (c7), 101.40 (c14), 102.20 (c21), 101.30 (c28); swing lows 98.80 (c3), 99.60 (c10),
 * 100.50 (c17), 100.10 (c25), 99.40 (c32). c25 is the first close under 100.50 (100.24); c31 the first close under 100.10 (99.88).
 */
const TE: CandleData[] = k([
  [99.20, 99.30, 99.05, 99.13], [99.13, 99.19, 98.99, 99.08], [99.08, 99.14, 98.80, 99.01], [99.01, 99.39, 98.95, 99.32], [99.32, 99.69, 99.25, 99.66],
  [99.66, 100.00, 99.64, 99.97], [99.97, 100.40, 99.90, 100.26], [100.26, 100.35, 100.04, 100.06], [100.06, 100.09, 99.89, 99.93], [99.93, 99.98, 99.60, 99.79],
  [99.79, 100.19, 99.73, 100.15], [100.15, 100.56, 100.06, 100.51], [100.51, 100.94, 100.43, 100.89], [100.89, 101.40, 100.86, 101.20], [101.20, 101.27, 101.03, 101.07],
  [101.07, 101.11, 100.81, 100.86], [100.86, 100.94, 100.50, 100.68], [100.68, 101.04, 100.64, 101.00], [101.00, 101.42, 100.96, 101.34], [101.34, 101.75, 101.26, 101.72],
  [101.72, 102.20, 101.69, 102.06], [102.06, 102.09, 101.57, 101.62], [101.62, 101.66, 101.05, 101.14], [101.14, 101.23, 100.59, 100.67], [100.67, 100.73, 100.10, 100.24],
  [100.24, 100.58, 100.16, 100.50], [100.50, 100.89, 100.44, 100.81], [100.81, 101.30, 100.76, 101.10], [101.10, 101.15, 100.74, 100.77], [100.77, 100.86, 100.25, 100.30],
  [100.30, 100.35, 99.85, 99.88], [99.88, 99.95, 99.40, 99.56], [99.56, 99.81, 99.52, 99.71], [99.71, 99.82, 99.64, 99.79],
]);

/**
 * 1.5.7 B7 and Try: one trend's life. A (c1–c18) up: lows 97.70, 98.30, 99.00 (c15); highs 98.90, 99.60, 100.20 (c18).
 * B (c19–c33) range: highs 100.05 (c24), 100.12 (c30); lows 98.75 (c21), 98.68 (c27), 98.72 (c33).
 * C (c34–c48) down: highs 99.70 (c36), 98.90 (c42); lows 97.90 (c39), 97.10 (c45).
 * c20 wicks to 98.92 but closes at 99.12; c21 is the first close under 99.00 (98.90).
 */
const LIFE: CandleData[] = k([
  [98.10, 98.12, 97.97, 98.02], [98.02, 98.05, 97.83, 97.92], [97.92, 97.97, 97.70, 97.91], [97.91, 98.27, 97.83, 98.21], [98.21, 98.45, 98.15, 98.37],
  [98.37, 98.90, 98.32, 98.67], [98.67, 98.77, 98.61, 98.69], [98.69, 98.76, 98.54, 98.61], [98.61, 98.64, 98.30, 98.54], [98.54, 98.93, 98.50, 98.88],
  [98.88, 99.25, 98.79, 99.18], [99.18, 99.60, 99.15, 99.46], [99.46, 99.53, 99.35, 99.43], [99.43, 99.49, 99.28, 99.30], [99.30, 99.36, 99.00, 99.23],
  [99.23, 99.54, 99.16, 99.49], [99.49, 99.86, 99.46, 99.82], [99.82, 100.20, 99.79, 100.07], [100.07, 100.12, 99.62, 99.67], [99.67, 99.71, 98.92, 99.12],
  [99.12, 99.16, 98.75, 98.90], [98.90, 99.21, 98.84, 99.18], [99.18, 99.65, 99.12, 99.61], [99.61, 100.05, 99.58, 99.92], [99.92, 99.97, 99.46, 99.54],
  [99.54, 99.60, 99.19, 99.23], [99.23, 99.25, 98.68, 98.91], [98.91, 99.34, 98.83, 99.26], [99.26, 99.69, 99.18, 99.63], [99.63, 100.12, 99.58, 99.96],
  [99.96, 100.03, 99.56, 99.63], [99.63, 99.68, 99.19, 99.28], [99.28, 99.37, 98.72, 98.85], [98.85, 99.12, 98.78, 99.07], [99.07, 99.41, 99.01, 99.35],
  [99.35, 99.70, 99.31, 99.52], [99.52, 99.60, 98.94, 99.00], [99.00, 99.09, 98.52, 98.56], [98.56, 98.65, 97.90, 98.07], [98.07, 98.37, 98.04, 98.33],
  [98.33, 98.55, 98.31, 98.48], [98.48, 98.90, 98.46, 98.73], [98.73, 98.81, 98.18, 98.26], [98.26, 98.31, 97.73, 97.80], [97.80, 97.87, 97.10, 97.29],
  [97.29, 97.42, 97.21, 97.33], [97.33, 97.52, 97.26, 97.47], [97.47, 97.55, 97.44, 97.52],
]);

/**
 * 1.5.8: 16 four-hour candles, each the aggregate of four 1-hour candles of one 64-candle series; H1_LAST30 is that series'
 * last 30 (c13–c16 of H4 aggregate H1_LAST30 c15–c30). H4 swing lows 97.60 (c3), 98.40 (c7), 99.20 (c11); highs 99.60 (c5),
 * 100.50 (c9), 101.40 (c13); c14–c16 fall to 99.98. H1_LAST30: swing highs 99.95 (c9), 100.80 (c13), 101.40 (c18), 101.05 (c23),
 * 100.66 (c28); lows 99.20 (c7), 100.52 (c21), 100.10 (c26); c19–c30 are the 12 falling hours, lowest low 99.98 (c30).
 */
const H4: CandleData[] = k([
  [98.00, 98.60, 97.80, 98.40], [98.40, 98.70, 97.95, 98.10], [98.10, 98.35, 97.60, 98.25], [98.25, 99.10, 98.15, 98.95], [98.95, 99.60, 98.80, 99.20],
  [99.20, 99.35, 98.70, 98.85], [98.85, 99.05, 98.40, 98.95], [98.95, 99.90, 98.85, 99.75], [99.75, 100.50, 99.60, 100.10], [100.10, 100.25, 99.50, 99.70],
  [99.70, 99.95, 99.20, 99.85], [99.85, 100.80, 99.75, 100.65], [100.65, 101.40, 100.55, 101.30], [101.30, 101.35, 100.52, 100.92], [100.92, 101.05, 100.10, 100.30],
  [100.30, 100.66, 99.98, 100.05],
]);
const H1_LAST30: CandleData[] = k([
  [100.12, 100.50, 100.08, 100.26], [100.26, 100.29, 100.06, 100.10], [100.10, 100.25, 100.06, 100.20], [100.20, 100.23, 99.78, 99.82], [99.82, 99.86, 99.50, 99.64],
  [99.64, 99.74, 99.61, 99.70], [99.70, 99.74, 99.20, 99.38], [99.38, 99.73, 99.35, 99.69], [99.69, 99.95, 99.65, 99.86], [99.86, 99.89, 99.81, 99.85],
  [99.85, 99.89, 99.75, 99.79], [99.79, 100.39, 99.76, 100.35], [100.35, 100.80, 100.31, 100.68], [100.68, 100.71, 100.61, 100.65], [100.65, 100.78, 100.55, 100.72],
  [100.72, 101.00, 100.66, 100.95], [100.95, 101.18, 100.88, 101.12], [101.12, 101.40, 101.05, 101.30], [101.30, 101.35, 100.95, 101.00], [101.00, 101.08, 100.70, 100.78],
  [100.78, 100.85, 100.52, 100.70], [100.70, 100.98, 100.62, 100.92], [100.92, 101.05, 100.80, 100.85], [100.85, 100.90, 100.48, 100.55], [100.55, 100.62, 100.25, 100.32],
  [100.32, 100.40, 100.10, 100.30], [100.30, 100.58, 100.22, 100.52], [100.52, 100.66, 100.40, 100.45], [100.45, 100.50, 100.18, 100.24], [100.24, 100.30, 99.98, 100.05],
]);

/**
 * 1.5.8 Try: another week, the same shapes mirrored (price → 200.00 − price). M4: swing highs 102.40 (c3), 101.60 (c7),
 * 100.80 (c11); lows 100.40 (c5), 99.50 (c9), 98.60 (c13). M1_TAIL (its last 16 hours on 1H; M4 c13–c16 aggregate it):
 * swing lows 98.60 (c4), 98.95 (c9), 99.34 (c14); highs 99.48 (c7), 99.90 (c12); highest high 100.02.
 */
const M4: CandleData[] = k([
  [102.00, 102.20, 101.40, 101.60], [101.60, 102.05, 101.30, 101.90], [101.90, 102.40, 101.65, 101.75], [101.75, 101.85, 100.90, 101.05], [101.05, 101.20, 100.40, 100.80],
  [100.80, 101.30, 100.65, 101.15], [101.15, 101.60, 100.95, 101.05], [101.05, 101.15, 100.10, 100.25], [100.25, 100.40, 99.50, 99.90], [99.90, 100.50, 99.75, 100.30],
  [100.30, 100.80, 100.05, 100.15], [100.15, 100.25, 99.20, 99.35], [99.35, 99.45, 98.60, 98.70], [98.70, 99.48, 98.65, 99.08], [99.08, 99.90, 98.95, 99.70],
  [99.70, 100.02, 99.34, 99.95],
]);
const M1_TAIL: CandleData[] = k([
  [99.35, 99.45, 99.22, 99.28], [99.28, 99.34, 99.00, 99.05], [99.05, 99.12, 98.82, 98.88], [98.88, 98.95, 98.60, 98.70], [98.70, 99.05, 98.65, 99.00],
  [99.00, 99.30, 98.92, 99.22], [99.22, 99.48, 99.15, 99.30], [99.30, 99.38, 99.02, 99.08], [99.08, 99.20, 98.95, 99.15], [99.15, 99.52, 99.10, 99.45],
  [99.45, 99.75, 99.38, 99.68], [99.68, 99.90, 99.60, 99.70], [99.70, 99.78, 99.42, 99.48], [99.48, 99.60, 99.34, 99.55], [99.55, 99.82, 99.50, 99.76],
  [99.76, 100.02, 99.70, 99.95],
]);

// ─── Shared layers and copy ─────────────────────────────────────────────────

const S30_HIGHS = [4, 10, 17, 24];
const S30_LOWS = [7, 13, 20, 27];
const RT_ZONE: ChartLayer = { kind: "zone", from: 101.85, to: 102.0, role: "resistance", label: "Old resistance" };
const RIGHT_LABEL = "The label is right. Pick the evidence you can actually see on this chart.";
const CONTEXT_FIRST = "That's a context question. The bigger picture comes from the higher timeframe.";

// ─── 1.5.1 · Swing highs and swing lows ─────────────────────────────────────

const L151: Lesson = {
  id: "1.5.1",
  title: "Swing highs and swing lows",
  topic: "technical_analysis",
  level: "beginner",
  tier: "free",
  minutes: 5,
  summary: "Swing highs and swing lows, marked with one fixed rule, are the turning points of market structure, and each is confirmed only after the candles that follow it.",
  objectives: [
    "Mark swing highs and swing lows with a fixed rule: a high above the two candles on each side.",
    "Explain why a swing is confirmed only two candles after it forms.",
    "Show how a different rule changes the structure you see.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
  ],
  script: {
    unit: "1.5",
    courseId: "1.5.1",
    hook: {
      prompt: "Twenty hours of LABX. Tap the candle you'd call a swing high: a peak where a rise turned down.",
      // Not graded: the recap compares the tap with the rule.
      control: { kind: "tap", chart: { candles: S30.slice(0, 20) }, zones: candleZones(1, 20) },
      compare: "You tapped {yours}. The 2-candle rule finds three swing highs here: candles 5, 11 and 18. Candle 16 looks like one, but candle 18 is higher.",
      concept: "swing-points",
    },
    learn: [
      {
        kind: "explain",
        title: "One rule for every peak",
        text: "A [[swing-high]] is a candle whose high is above the highs of the two candles on each side. A [[swing-low]] is the mirror: a low below the lows of the two candles on each side. Swings are the turning points that map the [[market-structure]]. Two candles on each side is one common convention, sometimes called a fractal.",
      },
      {
        kind: "figure",
        figure: {
          kind: "chart",
          chart: { candles: S30.slice(0, 20) },
          steps: [
            { text: "Candle 5's high, 101.20, is above the highs of candles 3, 4, 6 and 7. A swing high.", layers: [mark(4, "high", "SH")] },
            { text: "Candle 8's low, 100.30, is below the lows of the two candles on each side. A swing low.", layers: [mark(7, "low", "SL")] },
            { text: "The same test finds swing highs at candles 11 and 18, and a swing low at 14.", layers: [mark(10, "high", "SH"), mark(17, "high", "SH"), mark(13, "low", "SL")] },
          ],
        },
        text: "Check each candle against the two on its left and the two on its right. Only highs count for a swing high, and only lows for a swing low.",
      },
      {
        kind: "hotspot",
        title: "Just confirmed",
        prompt: "Candle 23 has just closed. Tap the candle that has just become a confirmed swing low.",
        chart: { candles: S30.slice(0, 23) },
        zones: [
          { id: "c14", label: "Candle 14", index: 13, feedback: "Candle 14 is a swing low, but it was confirmed long ago, when candle 16 closed." },
          { id: "c20", label: "Candle 20", index: 19, feedback: "Candle 20's low, 100.98, is above candle 21's, 100.90. It isn't the lowest of its neighbours." },
          { id: "c21", label: "Candle 21", index: 20 },
          { id: "c22", label: "Candle 22", index: 21, feedback: "Candle 22's low, 101.02, is above candle 21's. Look one candle earlier." },
          { id: "c23", label: "Candle 23", index: 22, feedback: "The newest candle can't be a swing yet. It needs two candles after it." },
        ],
        answer: "c21",
        correct: "Right. Candle 21's low, 100.90, sits under the lows of candles 19, 20, 22 and 23. Candle 23's close confirmed it.",
        concept: "swing-points",
      },
      {
        kind: "predict",
        title: "A new high",
        prompt: "Candle 25 just made the highest high on the chart, 102.40. Is it a swing high yet?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes", feedback: "Not yet. The rule compares it with the next two candles, and they don't exist yet." },
            { id: "notyet", label: "Not yet", feedback: "It needs two more candles with lower highs." },
            { id: "never", label: "Never", feedback: "It still can be. If the next two highs stay below 102.40, it qualifies." },
          ],
          answer: "notyet",
        },
        figure: {
          kind: "chart",
          chart: { candles: S30, visible: 25 },
          steps: [
            { text: "Candles 26 and 27 peak at 102.28 and 102.02, both below 102.40.", visible: 27 },
            { text: "Now candle 25 is a confirmed swing high, two candles after it formed.", layers: [mark(24, "high", "SH")] },
          ],
        },
        reveal: "Every swing is confirmed two candles late, so any map of structure lags price. A peak drawn on the newest candle is a guess, not a swing.",
        concept: "swing-points",
      },
      {
        kind: "figure",
        title: "Change the rule",
        figure: {
          kind: "chart",
          chart: { candles: S30 },
          steps: [
            {
              text: "Two candles on each side: four swing highs and four swing lows.",
              layers: [...S30_HIGHS.map((i) => mark(i, "high", undefined, "neutral")), ...S30_LOWS.map((i) => mark(i, "low", undefined, "neutral"))],
            },
            { text: "Five candles on each side: only candles 8, 11, 21 and 25 qualify.", layers: [mark(10, "high", "5", "accent"), mark(24, "high", "5", "accent"), mark(7, "low", "5", "accent"), mark(20, "low", "5", "accent")] },
            { text: "Same candles, different rule, different structure. The rule is a choice you make." },
          ],
        },
        text: "Some traders use three or five candles on each side. A wider rule keeps only the bigger turns, and confirms them later.",
        concept: "swing-points",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Marking swings you couldn't have known at the time is hindsight. Pick one rule, here two candles on each side, and apply it the same way every time, including on the newest candles.",
      },
      // Try (swing-marker isn't built yet): find the near miss, then count the swings.
      {
        kind: "hotspot",
        title: "A neighbour is higher",
        prompt: "Five candles look like peaks. Under the 2-candle rule, one of them isn't a swing high. Tap it.",
        chart: { candles: S30, layers: [4, 10, 15, 17, 24].map((i) => mark(i, "high", undefined, "neutral")) },
        zones: [
          { id: "c5", label: "Candle 5", index: 4, feedback: "Candle 5 passes: 101.20 tops candles 3, 4, 6 and 7." },
          { id: "c11", label: "Candle 11", index: 10, feedback: "Candle 11 passes: 101.60 tops the two highs on each side." },
          { id: "c16", label: "Candle 16", index: 15 },
          { id: "c18", label: "Candle 18", index: 17, feedback: "Candle 18 passes: 101.70 is above candles 16, 17, 19 and 20." },
          { id: "c25", label: "Candle 25", index: 24, feedback: "Candle 25 passes: 102.40 is the highest of its five-candle window." },
        ],
        answer: "c16",
        correct: "Right. Candle 16 peaks at 101.50, but candle 18, two candles later, reaches 101.70. A neighbour is higher, so it fails.",
        concept: "swing-points",
      },
      {
        kind: "predict",
        title: "Count them",
        prompt: "Apply the 2-candle rule to all 30 candles. How many swing highs and swing lows does it confirm in total?",
        control: {
          kind: "numeric",
          answer: 8,
          tolerance: 0,
          feedback: [
            { value: 4, text: "That's one kind. Count swing highs and swing lows together." },
            { value: 9, text: "One of those fails the rule. Check candle 16 against candle 18." },
            { value: 10, text: "Check the edges: candles 29 and 30 lack two candles after them, and candle 16 fails." },
          ],
        },
        figure: {
          kind: "chart",
          chart: { candles: S30 },
          steps: [
            { text: "Swing highs: candles 5, 11, 18 and 25.", layers: S30_HIGHS.map((i) => mark(i, "high", "SH")) },
            { text: "Swing lows: candles 8, 14, 21 and 28. Eight in all.", layers: S30_LOWS.map((i) => mark(i, "low", "SL")) },
          ],
        },
        reveal: "Eight swings: four highs and four lows. The first two and the last two candles can't qualify, because they lack two neighbours on one side.",
        concept: "swing-points",
      },
    ],
    check: ["q-1.5.1-1", "q-1.5.1-2", "q-1.5.1-3"],
    recap: {
      takeaways: [
        "A swing high tops the two highs on each side; a swing low sits under the two lows.",
        "A swing is confirmed only after two more candles close, so structure always lags price.",
        "A different rule gives a different structure. Fix one rule and apply it every time.",
      ],
    },
  },
};

// ─── 1.5.3 · Pullbacks ──────────────────────────────────────────────────────

const L153: Lesson = {
  id: "1.5.3",
  title: "Pullbacks",
  topic: "technical_analysis",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "A pullback is measured against the leg before it, keeps the trend only while it holds the last higher low, and lets you buy with a closer stop.",
  objectives: [
    "Measure a pullback as a share of the prior leg and in normal candles.",
    "Tell a pullback that keeps the trend from one that breaks the last higher low.",
    "Explain why entering on a pullback gives a closer stop than chasing the move.",
  ],
  blocks: [],
  practice: [{ kind: "arena", ref: "bullish", label: "Arena: bullish" }],
  script: {
    unit: "1.5",
    courseId: "1.5.3",
    hook: {
      prompt: "An uptrend leg ran from 100.00 to 104.00. Price is now 102.80. How deep is this pullback?",
      figure: {
        kind: "chart",
        chart: { candles: PB_LEG },
        steps: [{ text: "The leg: 100.00 to 104.00. Price now: 102.80.", layers: [mark(9, "low", "100.00"), mark(20, "high", "104.00"), mark(23, "close", "102.80", "accent")] }],
      },
      control: {
        kind: "choice",
        choices: [
          { id: "price", label: "1.20", feedback: "True, and it's only half the picture: 1.20 is also 30% of the 4.00 leg." },
          { id: "share", label: "30% of the leg", feedback: "True, and 30% is also 1.20 in price. Both describe the same pullback." },
          { id: "both", label: "Both" },
        ],
        answer: "both",
      },
      compare: "You picked {yours}. Both describe it: 1.20 in price is 30% of the 4.00 leg.",
      concept: "pullback",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[leg]] is the move from one swing point to the next, such as from a swing low up to a swing high. A [[pullback]] is a move against the trend, inside it. You can measure it in price, as a share of the leg before it, its [[retracement]], or in normal candles.",
      },
      {
        kind: "worked",
        title: "How deep?",
        lines: ["Leg: 104.00 − 100.00 = 4.00.", "Pullback: 104.00 − 102.80 = 1.20.", "Depth = 1.20 ÷ 4.00 = ?"],
        ask: {
          answer: 30,
          tolerance: 0.5,
          unit: "%",
          feedback: [
            { value: 0.3, text: "That's the fraction. As a share of the leg: 0.30 × 100 = 30%." },
            { value: 3.33, text: "That divides the leg by the pullback. Put the pullback on top: 1.20 ÷ 4.00." },
          ],
          correct: "Right: the pullback has given back 30% of the leg.",
        },
        after: "This chart's recent candles average 0.40 from high to low, so the pullback is three normal candles: 1.20 ÷ 0.40 = 3.",
        concept: "pullback",
      },
      {
        kind: "figure",
        title: "Same trend, four pullbacks",
        figure: {
          kind: "chart",
          chart: { candles: PB_LEG.slice(0, 21), layers: [{ kind: "level", price: 100, role: "concept", label: "Last higher low", chip: true }] },
          steps: [
            {
              text: "Pullbacks to 103.00 and 102.00 give back 25% and 50% of the 4.00 leg.",
              layers: [
                { kind: "level", price: 103, role: "neutral", label: "25%" },
                { kind: "level", price: 102, role: "neutral", label: "50%" },
              ],
            },
            { text: "A pullback to 100.80 is 80%: deep, but still above the last higher low.", layers: [{ kind: "level", price: 100.8, role: "neutral", label: "80%" }] },
            { text: "A fall to 99.60 goes below 100.00. The higher-low pattern breaks.", layers: [{ kind: "level", price: 99.6, role: "neutral", label: "110%" }] },
          ],
        },
        text: "Depth alone doesn't decide it. The first three keep the uptrend's pattern; the fourth breaks it, because it goes under the last higher low.",
        concept: "pullback",
      },
      {
        kind: "worked",
        title: "Pullback or chase?",
        lines: [
          "Budget 100.00. Stop at 103.00, just under the pullback's low. Costs: about 0.10 per unit.",
          "Chase after the run, at 106.00: 3.00 + 0.10 = 3.10 per unit, so 32 units.",
          "Buy the pullback at 104.50: 1.50 + 0.10 = 1.60 per unit, so ?",
        ],
        // Engine check (maxQtyForRisk, 1% of 10,000): 32 units at 106.00 and 62 at 104.50, stop 103.00.
        ask: {
          answer: 62,
          tolerance: 0,
          unit: "units",
          feedback: [
            { value: 66, text: "That leaves out costs. 100.00 ÷ 1.60 = 62.5, rounded down to 62." },
            { value: 62.5, text: "Units are whole. Round down: 62." },
            { value: 63, text: "Round down: 63 units would risk about 100.80, over the budget." },
          ],
          correct: "Right. The same 100.00 of risk buys almost twice as many units at the pullback.",
        },
        after: "Same idea, same stop, same risk. The closer stop does the work. You'll meet these numbers again with FOMO.",
        concept: "pullback",
      },
      {
        kind: "predict",
        title: "The 61.8% claim",
        prompt: "A popular claim says pullbacks tend to stop near 61.8% of the leg, a Fibonacci ratio. On random price data, how often do pullbacks stop near 61.8%?",
        control: {
          kind: "choice",
          choices: [
            { id: "rarely", label: "Rarely", feedback: "They do stop there sometimes, by chance, just as they do near any other level." },
            { id: "same", label: "About as often as near any other level" },
            { id: "more", label: "Much more often than elsewhere", feedback: "On random data no ratio is special. 61.8% gets hits only because pullbacks have to stop somewhere." },
          ],
          answer: "same",
        },
        reveal: "On random data no ratio is special, yet 61.8% still collects 'hits'. The research this course draws on found no evidence that Fibonacci ratios beat other levels. Treat the claim as weak; a later unit covers it.",
        concept: "pullback",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A pullback is defined by structure, not by a ratio. While it holds above the last higher low, the uptrend is intact. When it breaks that low, it may be the start of something else.",
      },
      // Try (swing-marker's measuring mode isn't built yet): measure three pullbacks, then find the one that broke the trend.
      {
        kind: "worked",
        title: "Measure three pullbacks",
        lines: [
          "Leg 1: 100.00 → 103.00 = 3.00. Pullback to 102.10 = 0.90, or 30%.",
          "Leg 2: 102.10 → 105.00 = 2.90. Pullback to 103.55 = 1.45, or 50%.",
          "Leg 3: 103.55 → 106.00 = 2.45. Pullback to 101.90 = 4.10.",
          "Depth of pullback 3 = 4.10 ÷ 2.45 = ?",
        ],
        ask: {
          answer: 167,
          tolerance: 1,
          unit: "%",
          feedback: [
            { value: 1.67, text: "That's the fraction. As a share: 1.67 × 100 = 167%." },
            { value: 0.6, text: "That divides the leg by the pullback. Put the pullback on top: 4.10 ÷ 2.45." },
          ],
          correct: "Right: about 167%. It gave back more than the whole leg.",
        },
        after: "Over 100% means price fell below the point where the leg began.",
        concept: "pullback",
      },
      {
        kind: "hotspot",
        title: "Which one broke it?",
        prompt: "Here are the three pullbacks. Tap the pullback low that broke the uptrend.",
        chart: { candles: PB_TRY, layers: [mark(11, "low", "1"), mark(20, "low", "2"), mark(32, "low", "3")] },
        zones: [
          { id: "p1", label: "Pullback 1, 102.10", index: 11, feedback: "It held above the last swing low, 100.00. The trend survived it." },
          { id: "p2", label: "Pullback 2, 103.55", index: 20, feedback: "It held above the last higher low, 102.10. A normal pullback." },
          { id: "p3", label: "Pullback 3, 101.90", index: 32 },
        ],
        answer: "p3",
        correct: "Right. It fell to 101.90, under the last higher low, 103.55. That's no longer a pullback in an intact uptrend.",
        concept: "pullback",
      },
    ],
    check: ["q-1.5.3-1", "q-1.5.3-2", "q-1.5.3-3"],
    recap: {
      takeaways: [
        "Measure a pullback against its leg: 1.20 of a 4.00 leg is 30%, three 0.40 candles.",
        "A pullback keeps the uptrend while it holds above the last higher low.",
        "At a pullback the stop sits closer, so the same risk buys more units.",
      ],
    },
  },
};

// ─── 1.5.5 · Round numbers ──────────────────────────────────────────────────

const L155: Lesson = {
  id: "1.5.5",
  title: "Round numbers",
  topic: "technical_analysis",
  level: "beginner",
  tier: "free",
  minutes: 5,
  summary: "Orders cluster at and just beyond round numbers, so a stop belongs beyond the level and the cluster, and the documented effect is real but small.",
  objectives: [
    "Explain why orders cluster at and just beyond round numbers.",
    "Place a stop beyond structure rather than exactly at, or just past, a round number.",
    "Describe the size of the documented effect without overstating it.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "mission", ref: "M04", label: "Define Your Risk" },
  ],
  script: {
    unit: "1.5",
    courseId: "1.5.5",
    hook: {
      prompt: "You're long LABX near 99.40. Where would most traders put a take-profit?",
      control: {
        kind: "choice",
        choices: [
          { id: "9995", label: "99.95", feedback: "Some would. But take-profits pile up most exactly on the round number." },
          { id: "10000", label: "100.00" },
          { id: "10007", label: "100.07", feedback: "Just beyond a round number is where stop orders gather, not take-profits." },
        ],
        answer: "10000",
      },
      compare: "You picked {yours}. In one bank's order book, take-profits clustered exactly at round numbers like 100.00.",
      concept: "round-numbers",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[round-number]] is a price ending in 00 or 50, such as 100.00 or 100.50. Prices ending in 0 or 5 attract orders too, more weakly. People pick these numbers because they're easy, so orders pile up there. In currency quotes, '00' means a price like 1.1000; on LABX, think 100.00.",
      },
      {
        kind: "figure",
        title: "Where orders sit",
        figure: {
          kind: "bars",
          bars: [
            { label: "Take-profits at 00", value: 9.3, role: "up" },
            { label: "Stop-losses at 00", value: 4.4, role: "neutral" },
            { label: "Buy stops just above 00", value: 14.4, role: "down" },
            { label: "Buy stops just below 00", value: 7.4, role: "neutral" },
          ],
          unit: "%",
          steps: [
            "One bank's book of 9,667 currency orders. 9.3% of take-profits sat exactly at 00, against 4.4% of stop-losses.",
            "Buy stops sat just above round numbers, 14.4%, about twice as often as just below, 7.4%.",
            "Sell stops mirror it, just below. Data from one bank: a real pattern, not a law.",
          ],
        },
        text: "Source: Osler's study of a bank's currency order book. Each bar is the share of one order type at that price ending.",
        concept: "round-numbers",
      },
      {
        kind: "explain",
        title: "Why it matters",
        text: "Take-profit orders resting at the number meet price head-on, so they tend to slow it or stop it there. Stop orders just beyond the number become market orders when hit, adding to the move. That's a [[stop-cluster]]: a break through a round number can speed up as it sets them off.",
      },
      {
        kind: "predict",
        title: "How big is the effect?",
        prompt: "Support and resistance levels published by analysts were tested against random levels. How often did price stop and turn at each?",
        control: {
          kind: "choice",
          choices: [
            { id: "big", label: "About 90% vs 50%", feedback: "Far smaller than that. The gap was under five percentage points." },
            { id: "small", label: "About 61% vs 56%" },
            { id: "none", label: "No difference", feedback: "There was a difference, and it was statistically significant. It was just small." },
          ],
          answer: "small",
        },
        reveal: "Osler (2000): published levels stopped intraday trends 60.8% of the time, random levels 56.2%. Real, but small, and profit after costs wasn't shown. Treat a level as a slight tilt, not a wall.",
        concept: "round-numbers",
      },
      {
        kind: "match",
        title: "Where does the stop go?",
        prompt: "Long at 100.40 above support at 100.00. A normal candle is 0.40. Match each stop with what it risks.",
        pairs: [
          { left: "100.00, on the level", right: "Hit by any ordinary test of support", wrong: "On the level itself, price only has to touch support to stop you out." },
          { left: "99.95, just under it", right: "Sits in the stop cluster a sweep takes out", wrong: "Just under a round number is where other traders' stops gather." },
          { left: "99.60, one normal candle below", right: "Beyond the level and the cluster", wrong: "This one clears both the level and the stops gathered under it." },
          { left: "98.00, far below", right: "More loss than the idea needs", wrong: "Far below the level, the idea was wrong long before this stop." },
        ],
        concept: "round-numbers",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Round numbers matter a little, not a lot. Don't put your stop exactly where everyone else's is: give it about one normal candle beyond the level.",
      },
    ],
    task: {
      widget: "bracket-builder",
      data: {
        chart: {
          candles: RN,
          layers: [
            { kind: "zone", from: 100.0, to: 100.05, role: "support", label: "Support" },
            { kind: "level", price: 100.0, role: "neutral", label: "100.00" },
            { kind: "zone", from: 99.9, to: 99.99, role: "concept", label: "Stops cluster" },
          ],
        },
        entry: 100.4,
        units: 50,
      },
      goal: "Long 50 units at 100.40, above support at 100.00, a round number. A normal candle is 0.40. Place the stop beyond the level and beyond the stops clustered just under it.",
      start: { stop: 99.95, target: 101.8, units: 50 },
      locked: ["units", "target"],
      success: { all: [{ field: "stop", gte: 99.4 }, { field: "stop", lte: 99.6 }, { field: "target", eq: 101.8 }] },
      feedback: [
        { when: { field: "stop", gte: 100 }, text: "At {stop:2} the stop sits on support. Any ordinary test of 100.00 can hit it." },
        { when: { field: "stop", gte: 99.9 }, text: "That's where stops cluster. Candle 16 dipped to 99.93, which would have filled a stop at {stop:2}." },
        { when: { field: "stop", gt: 99.6 }, text: "Closer than one normal candle under the level. Leave about 0.40 below 100.00." },
        { when: { field: "stop", lt: 99.4 }, text: "That's further than the idea needs. The loss at the stop grows to {lossBefore:2} without telling you more." },
      ],
      correct: "Stop at {stop:2}: beyond 100.00 and the stops under it. Loss at the stop {lossAfter:2} with commission; the target is {rr:2}R away.",
      hints: [
        "Start from the level, 100.00, then step past the stops gathered just under it.",
        "Stops cluster from 99.90 to 99.99. One normal candle below the level is 99.60.",
        "Drag the stop to 99.60: 0.40 under 100.00, clear of the cluster.",
      ],
      showMe: { stop: 99.6 },
      concept: "round-numbers",
    },
    check: ["q-1.5.5-1", "q-1.5.5-2", "q-1.5.5-3"],
    recap: {
      takeaways: [
        "Take-profits gather at round numbers; stops gather just beyond them, so breaks can speed up.",
        "Put the stop beyond the level and the stop cluster, about one normal candle away.",
        "The effect is real but small: 60.8% against 56.2%. Not a reason to trade on its own.",
      ],
    },
  },
};

// ─── 1.5.6 · Retests, role reversal and failed breakouts ────────────────────

const L156: Lesson = {
  id: "1.5.6",
  title: "Retests, role reversal and failed breakouts",
  topic: "technical_analysis",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "After a breakout price often returns to the broken level; a retest that holds and a close back inside look alike at first, so you plan for both.",
  objectives: [
    "Tell a retest that holds from a close back inside that fails.",
    "Explain why old resistance can act as support after a breakout.",
    "Plan your action for both outcomes before the break happens.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "1.5",
    courseId: "1.5.6",
    hook: {
      prompt: "LABX broke above 102.00, rose to 103.20 and is back at 102.05. Will old resistance hold as support?",
      figure: {
        kind: "chart",
        chart: { candles: RT_BASE },
        steps: [{ text: "Broke 102.00, peaked at 103.20, now back at 102.05.", layers: [RT_ZONE, mark(26, "high", "103.20"), mark(29, "close", "102.05", "accent")] }],
      },
      // No graded answer: "Can't know yet" is the honest read; B2 and B3 show both endings.
      control: {
        kind: "choice",
        choices: [
          { id: "holds", label: "It holds" },
          { id: "fails", label: "It fails" },
          { id: "unknown", label: "Can't know yet" },
        ],
      },
      compare: "You picked {yours}. From that chart nobody could know: ending A held and ending B failed. Only the plan could be decided in advance.",
      concept: "role-reversal",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[retest]] is a return to a level price has just broken. [[role-reversal|Role reversal]] says a broken resistance may now act as support, and a broken support as resistance. A common explanation: traders caught on the wrong side, or who missed the break, leave orders near the old level. It's a practitioner pattern, not a law.",
      },
      {
        kind: "figure",
        title: "Ending A",
        figure: {
          kind: "chart",
          chart: { candles: [...RT_BASE, ...RT_HOLD], visible: 30, layers: [RT_ZONE] },
          steps: [
            { text: "The next candle dips to 101.90, into the old zone, and closes at 102.30.", visible: 31, layers: [mark(30, "low", "101.90")] },
            { text: "Old resistance acted as support. Price climbed to 103.85.", visible: 35 },
          ],
        },
        text: "The wick reached into the zone; the close stayed above it. That's a retest that holds.",
        concept: "role-reversal",
      },
      {
        kind: "hotspot",
        title: "Ending B",
        prompt: "Same chart, other ending. Tap the candle that turned the breakout into a failed one.",
        chart: { candles: [...RT_BASE, ...RT_FAIL], layers: [RT_ZONE] },
        zones: [
          { id: "c25", label: "Candle 25", index: 24, feedback: "That's the breakout: it closed at 102.45, above the zone." },
          { id: "c27", label: "Candle 27", index: 26, feedback: "That's the peak, 103.20. The breakout was still working." },
          { id: "c30", label: "Candle 30", index: 29, feedback: "It dipped toward the zone but closed at 102.05, above it. Still a test." },
          { id: "c31", label: "Candle 31", index: 30 },
          { id: "c32", label: "Candle 32", index: 31, feedback: "By then price was already back inside. The close that mattered came one candle earlier." },
        ],
        answer: "c31",
        correct: "Right. Candle 31 closed at 101.60, back inside the range, under the zone. A [[false-breakout|failed breakout]]: the reason to be long is gone.",
        concept: "false-breakout",
      },
      {
        kind: "match",
        title: "Read the reaction",
        prompt: "Match what you see after a breakout with what it suggests.",
        pairs: [
          { left: "Closes back inside the range within one to three candles", right: "A failed breakout", wrong: "A close back inside is what turns a break into a failure." },
          { left: "Wicks into the old zone, closes beyond it", right: "A retest that holds", wrong: "A wick into the zone is a test; the close decides." },
          { left: "Pokes beyond the level, closes back inside on the same candle", right: "A sweep: a failed breakout in one candle", wrong: "If the same candle closes back inside, the break never held." },
          { left: "Keeps closing beyond the level and never returns", right: "A breakout with follow-through", wrong: "No retest at all: the break simply kept going." },
        ],
        concept: "false-breakout",
      },
      {
        kind: "explain",
        title: "How often does each happen?",
        text: "Claims like '80% of breakouts fail' are practitioner rules of thumb, not tested in that form. The few systematic studies point both ways: clustered stops can speed a break up (Osler, 2005), and one unreviewed study found continuation after sweeps. Both endings happen often enough to plan for both.",
      },
      {
        kind: "order",
        title: "Plan before the break",
        prompt: "Put the plan in order. All of it is decided before the break happens.",
        items: [
          "Mark the zone",
          "Define the break: a close beyond the zone",
          "Decide the entry",
          "Put the stop back inside the range",
          "Decide what you do if the retest holds",
          "Decide what you do if it fails",
        ],
        explain: "That's the plan. When the break comes, you carry it out instead of deciding under pressure.",
        concept: "breakout",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "After a failed breakout, don't flip to the other side out of frustration, and don't widen the stop. Take the planned loss and wait for the next setup in your plan.",
      },
    ],
    task: {
      widget: "level-drawer",
      data: {
        chart: { candles: RTT_BASE, visible: 36 },
        breakout: {
          endings: { hold: RTT_HOLD, fail: RTT_FAIL },
          order: ["hold", "fail"],
          breakIndex: 36,
          // Close of c37 + 0.05 (the ask).
          entry: 98.8,
          stopRule: { minBelowBand: 0.1, maxBelowBand: 0.8 },
          showMeEnding: "fail",
          messages: {
            bandCorrect: "{touches} turns between {bandLow:2} and {bandHigh:2}: the old resistance zone. After a break, retests come back to it.",
            stopCorrect: "Stop at {stop:2}: a close back inside the range takes you out. Risk {risk:2} per unit, about {total:2} with commission.",
            stopTooClose: "At {stop:2} the stop sits in or just under the zone. A normal retest dips there and could stop you while the breakout is fine.",
            stopTooFar: "At {stop:2} the risk is {risk:2} per unit. A close back inside the range already says the breakout failed.",
            playFail: "The retest failed: candle {k} closed at {close:2}, back inside the range. Your stop at {stop:2} filled, about {total:2} per unit with commission. A planned loss.",
            playHold: "The retest held: the dip to 98.33 turned back up and no close fell back below your zone. Old resistance acted as support.",
            playBoth: "Same chart, same plan, two endings. The plan was right in both.",
          },
        },
      },
      goal: "Mark the old resistance zone. Then place a stop for a breakout buy, back inside the range, and play both endings to see each retest.",
      start: { role: "resistance", bandLow: 97.3, bandHigh: 97.6, stop: 98.6 },
      // Same contract as L06: part 2 (bandLow − 0.80 ≤ stop ≤ bandLow − 0.10) is checked by the widget before phase 3.
      success: {
        all: [
          { field: "role", eq: "resistance" },
          { field: "touches", gte: 3 },
          { field: "height", gte: 0.1, lte: 0.5 },
          { field: "phase", gte: 3 },
        ],
      },
      feedback: [
        { when: { all: [{ field: "role", eq: "support" }, { field: "touches", gte: 3 }] }, text: "That's a valid support zone. For this task, mark the ceiling the breakout will test." },
        { when: { field: "height", lt: 0.1 }, text: "A band thinner than 0.10 is a line. Widen it to cover the turns." },
        { when: { field: "height", gt: 0.5 }, text: "That band is {height:2} tall. It catches almost anything. Tighten it around the turns." },
        { when: { field: "touches", lt: 3 }, text: "Only {touches} turns sit inside your band. Move or widen it to cover the cluster of highs." },
      ],
      correct: "Stop at {stop:2}: whichever ending comes, a close back inside the range takes you out.",
      hints: [
        "Find where rises stalled. Several highs end near the same price.",
        "Four turns down sit between 98.22 and 98.40. Cover them with one band.",
        "If the breakout fails, price closes back under your band. Put the stop below it, with a buffer.",
      ],
      showMe: { role: "resistance", bandLow: 98.22, bandHigh: 98.4, stop: 98.0 },
      concept: "role-reversal",
    },
    check: ["q-1.5.6-1", "q-1.5.6-2", "q-1.5.6-3"],
    recap: {
      takeaways: [
        "A retest that holds wicks into the old zone and closes beyond it. A close back inside fails.",
        "Broken resistance may act as support, perhaps through orders left near the old level. A pattern, not a law.",
        "Plan both endings before the break: entry, stop back inside the range, and each next step.",
      ],
    },
  },
};

// ─── 1.5.7 · When a trend ends ──────────────────────────────────────────────

const L157: Lesson = {
  id: "1.5.7",
  title: "When a trend ends",
  topic: "technical_analysis",
  level: "beginner",
  tier: "free",
  minutes: 5,
  summary: "An uptrend's structure breaks at the first close below its last higher low; a lower high and then a lower low confirm a downtrend.",
  objectives: [
    "Identify the first lower low and the first lower high after an uptrend.",
    "Tell a deep pullback from a change in structure.",
    "Stop trading the old direction once the structure has broken.",
  ],
  blocks: [],
  practice: [{ kind: "arena", ref: "reversal", label: "Arena: reversal" }],
  script: {
    unit: "1.5",
    courseId: "1.5.7",
    hook: {
      prompt: "An uptrend turns over. Tap the candle where you think the downtrend became clear.",
      // Not graded: the recap compares the tap with candle 31.
      control: { kind: "tap", chart: { candles: TE }, zones: candleZones(21, 34) },
      compare: "You tapped {yours}. By this lesson's steps, it became clear at candle 31: the first close under 100.10, after a lower high.",
      concept: "structure-break",
    },
    learn: [
      {
        kind: "explain",
        text: "Trends usually end in steps. First, a close below the last higher low: a [[structure-break]], and a warning. Next, a rally that stops below the last peak: a lower high. Then a close under the new low. Now highs and lows both step down: a downtrend's structure.",
      },
      {
        kind: "figure",
        title: "Step by step",
        figure: {
          kind: "chart",
          chart: { candles: TE },
          steps: [
            {
              text: "Uptrend: highs 100.40, 101.40, 102.20; higher lows 99.60 and 100.50.",
              layers: [mark(6, "high", "H"), mark(13, "high", "HH"), mark(20, "high", "HH"), mark(2, "low", "L"), mark(9, "low", "HL"), mark(16, "low", "HL")],
            },
            {
              text: "Candle 25 closes at 100.24, below the last higher low, 100.50. The structure breaks.",
              layers: [{ kind: "level", price: 100.5, role: "concept", label: "Last higher low" }, mark(24, "low", "LL", "down")],
            },
            { text: "The rally peaks at 101.30 on candle 28, below 102.20: a lower high.", layers: [mark(27, "high", "LH", "down")] },
            { text: "Candle 31 closes at 99.88, under the 100.10 low. Lower highs and lower lows: a downtrend.", layers: [mark(30, "close", "99.88", "down"), mark(31, "low", "LL", "down")] },
          ],
        },
        concept: "structure-break",
      },
      {
        kind: "hotspot",
        title: "Spot the lower high",
        prompt: "Tap the first lower high.",
        chart: { candles: TE },
        zones: [
          { id: "c14", label: "Candle 14", index: 13, feedback: "That's a higher high, 101.40, from the uptrend." },
          { id: "c21", label: "Candle 21", index: 20, feedback: "That's the last higher high, the top at 102.20. The lower high comes after it." },
          { id: "c27", label: "Candle 27", index: 26, feedback: "Still rising. The rally peaks one candle later." },
          { id: "c28", label: "Candle 28", index: 27 },
          { id: "c29", label: "Candle 29", index: 28, feedback: "Its high, 101.15, is under candle 28's. The peak came one candle earlier." },
        ],
        answer: "c28",
        correct: "Right. Candle 28 peaks at 101.30, below the 102.20 top. A lower high.",
        concept: "structure-break",
      },
      {
        kind: "explain",
        title: "Trend over isn't a downtrend",
        text: "Many trends pass through a range before they turn, and some resume. A broken structure means the uptrend can't be relied on. It doesn't mean a downtrend has started: that also takes a lower high and a lower low. Until then, 'trend over' may simply mean 'range started'.",
      },
      {
        kind: "predict",
        title: "Your pullback rule",
        prompt: "Yesterday the uptrend's structure broke. Today a dip looks just like your usual pullback buy. Do you take it?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes", feedback: "A pullback buy starts with 'in an uptrend', and that condition just failed." },
            { id: "no", label: "No" },
          ],
          answer: "no",
        },
        reveal: "No. A pullback buy needs an intact uptrend, and that's the condition that failed. After a break, buying dips means trading the old direction without its structure.",
        concept: "structure-break",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Don't try to pick the top. Respond to the structure and accept being a little late. 'Change of character' in Smart Money Concepts is this same structure break under another name.",
      },
      // Try, part 1 (blind-replay's "mark the moment" mode isn't built yet): the break as a tap on the chart.
      {
        kind: "hotspot",
        title: "Mark the break",
        prompt: "The uptrend's last higher low is 99.00, on candle 15. Tap the first candle that closed below it.",
        chart: { candles: LIFE.slice(0, 24), layers: [{ kind: "level", price: 99, role: "concept", label: "Last higher low", chip: true }] },
        zones: [
          { id: "c18", label: "Candle 18", index: 17, feedback: "That's the top, 100.20. Nothing has broken yet." },
          { id: "c19", label: "Candle 19", index: 18, feedback: "That low, 99.62, is still above the last higher low." },
          { id: "c20", label: "Candle 20", index: 19, feedback: "Its wick reached 98.92, but it closed at 99.12, above 99.00. The rule needs a close." },
          { id: "c21", label: "Candle 21", index: 20 },
          { id: "c22", label: "Candle 22", index: 21, feedback: "The close below the last higher low came 1 candle earlier." },
        ],
        answer: "c21",
        correct: "Right. Candle 21 closed at 98.90, under 99.00. The structure broke on that close.",
        concept: "structure-break",
      },
    ],
    task: {
      widget: "trend-classifier",
      data: {
        chart: { candles: LIFE },
        segments: [
          { label: "trend", evidence: "hh_hl", from: 0, to: 17 },
          { label: "range", evidence: "bounded", from: 18, to: 32 },
          { label: "trend", evidence: "lh_ll", from: 33, to: 47 },
        ],
        evidence: L05_EVIDENCE,
      },
      goal: "The same chart, carried on: one trend's whole life in three stretches. Label each as trend, range or noise, and pick the evidence that decided it.",
      start: { labelA: "", evidenceA: "", labelB: "", evidenceB: "", labelC: "", evidenceC: "" },
      success: {
        all: [
          { field: "labelA", eq: "trend" },
          { field: "evidenceA", eq: "hh_hl" },
          { field: "labelB", eq: "range" },
          { field: "evidenceB", eq: "bounded" },
          { field: "labelC", eq: "trend" },
          { field: "evidenceC", eq: "lh_ll" },
        ],
      },
      feedback: [
        { when: { field: "labelA", eq: "range" }, text: "A's lows climb, 97.70, 98.30, 99.00, and so do its highs. That's a direction, not a range." },
        { when: { field: "labelA", eq: "noise" }, text: "A has clear swings, each higher than the last. That's structure: an uptrend." },
        { when: { all: [{ field: "labelA", eq: "trend" }, { field: "evidenceA", ne: "hh_hl" }] }, text: "Trend is right. Check the direction: A's highs go 98.90, 99.60, 100.20." },
        { when: { field: "labelB", eq: "trend" }, text: "B's highs stall near 100.10 and its lows near 98.70. They don't step one way." },
        { when: { field: "labelB", eq: "noise" }, text: "B has edges: it turned up near 98.70 three times and down near 100.10 twice." },
        { when: { all: [{ field: "labelB", eq: "range" }, { field: "evidenceB", ne: "bounded" }] }, text: RIGHT_LABEL },
        { when: { field: "labelC", eq: "range" }, text: "C's highs fall, 99.70 then 98.90, and its lows fall, 97.90 then 97.10." },
        { when: { field: "labelC", eq: "noise" }, text: "C's swings step down clearly. That's structure: a downtrend." },
        { when: { all: [{ field: "labelC", eq: "trend" }, { field: "evidenceC", ne: "lh_ll" }] }, text: "Trend is right. Check the direction: each high and each low in C is lower." },
      ],
      correct: "Up, sideways, down. The structure broke in B, but the downtrend only showed in C.",
      hints: [
        "In each stretch, find the turning points and compare each with the one before.",
        "Swings are now marked. In each stretch, do the highs and lows climb, fall, or repeat?",
        "A's lows climb: 97.70, 98.30, 99.00. B turns near 100.10 and 98.70. C's highs fall: 99.70, 98.90.",
      ],
      showMe: { labelA: "trend", evidenceA: "hh_hl", labelB: "range", evidenceB: "bounded", labelC: "trend", evidenceC: "lh_ll" },
      concept: "structure-break",
    },
    check: ["q-1.5.7-1", "q-1.5.7-2", "q-1.5.7-3"],
    recap: {
      takeaways: [
        "First warning: a close below the last higher low. A lower high, then a lower low, confirm a downtrend.",
        "A deep pullback holds the last higher low. A structure break closes below it.",
        "Once the structure breaks, stop buying pullbacks. Being a little late beats guessing the top.",
      ],
    },
  },
};

// ─── 1.5.8 · One market, several timeframes ─────────────────────────────────

const L158: Lesson = {
  id: "1.5.8",
  title: "One market, several timeframes",
  topic: "technical_analysis",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "The higher timeframe gives the context and the one you trade gives the timing; a 1-hour fall inside a 4-hour uptrend is read as a pullback while it holds.",
  objectives: [
    "Read the trend on a higher timeframe before acting on a lower one.",
    "Explain a timeframe conflict, such as 4H up and 1H down, as a pullback inside a larger trend.",
    "Avoid switching timeframes until one agrees with your idea.",
  ],
  blocks: [],
  practice: [{ kind: "arena", ref: "bullish", label: "Arena: bullish" }],
  script: {
    unit: "1.5",
    courseId: "1.5.8",
    hook: {
      prompt: "On the 4-hour chart LABX is in an uptrend. On the 1-hour chart, the last twelve candles fall. Which chart is right?",
      control: {
        kind: "choice",
        choices: [
          { id: "h4", label: "The 4-hour", feedback: "It's right about the bigger picture. The 1-hour fall is real too, at its own scale." },
          { id: "h1", label: "The 1-hour", feedback: "It's right about the last 12 hours. The 4-hour uptrend is still intact at its scale." },
          { id: "both", label: "Both, at different scales" },
        ],
        answer: "both",
      },
      compare: "You picked {yours}. Both were right: a 1-hour fall inside a 4-hour uptrend.",
      concept: "multi-timeframe-analysis",
    },
    learn: [
      {
        kind: "explain",
        text: "Every chart groups the same prices into candles of one [[timeframe|length]]. Each 4-hour candle holds four 1-hour candles. The [[higher-timeframe]] shows the context: the bigger trend and its levels. The timeframe you trade shows the details: where to enter and where the stop goes.",
      },
      {
        kind: "figure",
        title: "The 4-hour chart",
        figure: {
          kind: "chart",
          chart: { candles: H4 },
          steps: [
            {
              text: "Swing lows 97.60, 98.40 and 99.20; swing highs 99.60, 100.50 and 101.40. An uptrend.",
              layers: [mark(2, "low", "L"), mark(6, "low", "HL"), mark(10, "low", "HL"), mark(4, "high", "H"), mark(8, "high", "HH"), mark(12, "high", "HH")],
            },
            {
              text: "The last three 4-hour candles fall: the 12 falling hours you'll see on the 1-hour chart.",
              layers: [{ kind: "bracket", from: 101.4, to: 99.98, index: 14, label: "12 hours", role: "down" }],
            },
            { text: "Their low, 99.98, is still above the last higher low, 99.20.", layers: [{ kind: "level", price: 99.2, role: "concept", label: "Last higher low", chip: true }] },
          ],
        },
        concept: "multi-timeframe-analysis",
      },
      {
        kind: "predict",
        title: "Read the 1-hour chart",
        prompt: "The same market on 1-hour candles, last 30 hours. The 4-hour uptrend's last higher low is 99.20. How do you read the fall?",
        control: {
          kind: "choice",
          choices: [
            { id: "pullback", label: "Pullback in an uptrend" },
            { id: "down", label: "New downtrend", feedback: "On the 1-hour chart it is falling. On the 4-hour chart nothing has broken: the fall is above 99.20." },
            { id: "range", label: "Range", feedback: "The 1-hour swings step down rather than bounce between two levels, and the 4-hour trend is still up." },
          ],
          answer: "pullback",
        },
        figure: {
          kind: "chart",
          chart: { candles: H1_LAST30 },
          steps: [
            {
              text: "1-hour highs 101.40, 101.05, 100.66; lows 100.52, 100.10. Lower highs and lower lows.",
              layers: [mark(17, "high", "101.40"), mark(22, "high", "LH"), mark(27, "high", "LH"), mark(20, "low", "100.52"), mark(25, "low", "LL")],
            },
            {
              text: "All of it stays above 99.20, the 4-hour higher low. So far, a pullback.",
              layers: [{ kind: "level", price: 99.2, role: "concept", label: "4-hour higher low", chip: true }, mark(6, "low", "99.20")],
            },
          ],
        },
        reveal: "Both charts are right. On 1-hour candles it's a short downtrend; on 4-hour candles it's a pullback. It stays a pullback while price holds above 99.20.",
        concept: "multi-timeframe-analysis",
      },
      {
        kind: "match",
        title: "Which chart answers it?",
        prompt: "Sort each question to the timeframe that answers it.",
        pairs: [
          { left: "Which way is the bigger trend?", right: "The higher timeframe", wrong: CONTEXT_FIRST },
          { left: "Where are the major levels?", right: "The higher timeframe", wrong: CONTEXT_FIRST },
          { left: "Where does my stop go?", right: "The timeframe I trade", wrong: "The stop protects the trade you place, so it's set on the timeframe you trade." },
          { left: "When exactly do I enter?", right: "The timeframe I trade, or a lower one", wrong: "Timing is a detail. It comes from the timeframe you trade, or a lower one." },
        ],
        concept: "multi-timeframe-analysis",
      },
      {
        kind: "predict",
        title: "Against the bigger trend",
        prompt: "You short the 1-hour downtrend inside the 4-hour uptrend. What's the extra risk?",
        control: {
          kind: "choice",
          choices: [
            { id: "none", label: "None", feedback: "There is one: the bigger trend is up, so the pullback can end and the uptrend resume." },
            { id: "against", label: "You trade against the larger structure" },
            { id: "wider", label: "Your stop must be wider", feedback: "The stop goes where your 1-hour idea is wrong, as always. The extra risk is the bigger trend's direction." },
          ],
          answer: "against",
        },
        reveal: "The trade can be valid, but it bets against the larger structure: if the 4-hour uptrend resumes, the pullback ends. Know that going in, and size it like any other trade.",
        concept: "multi-timeframe-analysis",
      },
      {
        kind: "explain",
        title: "Every extra chart is another chance",
        text: "Each extra timeframe is one more place to find, after the fact, a chart that agrees with you. That's [[confirmation-bias]] with more room to work. So the plan fixes two timeframes in advance: one for context, one for trading. Then a disagreement is information, not a reason to keep looking.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Choose your timeframes in the plan, not after the chart disagrees with you.",
      },
    ],
    task: {
      widget: "trend-classifier",
      data: {
        segments: [
          { id: "A", label: "trend", evidence: "lh_ll", candles: M4 },
          { id: "B", label: "trend", evidence: "hh_hl", candles: M1_TAIL },
        ],
        evidence: L05_EVIDENCE,
      },
      goal: "Another week of LABX. Stretch A is the 4-hour chart; stretch B is its last 16 hours on the 1-hour chart. Label each and pick the evidence.",
      start: { labelA: "", evidenceA: "", labelB: "", evidenceB: "" },
      success: {
        all: [
          { field: "labelA", eq: "trend" },
          { field: "evidenceA", eq: "lh_ll" },
          { field: "labelB", eq: "trend" },
          { field: "evidenceB", eq: "hh_hl" },
        ],
      },
      feedback: [
        { when: { field: "labelA", eq: "range" }, text: "A's highs fall, 102.40, 101.60, 100.80, and so do its lows. That's a direction, not a range." },
        { when: { field: "labelA", eq: "noise" }, text: "A has clear swings, each lower than the last. That's a 4-hour downtrend." },
        { when: { all: [{ field: "labelA", eq: "trend" }, { field: "evidenceA", ne: "lh_ll" }] }, text: "Trend is right. Check the direction: A's highs and lows both step down." },
        { when: { field: "labelB", eq: "range" }, text: "B's lows rise, 98.60, 98.95, 99.34, and its highs rise too. That's a direction, not a range." },
        { when: { field: "labelB", eq: "noise" }, text: "B's swings step up cleanly. On its own timeframe, that's a short uptrend." },
        { when: { all: [{ field: "labelB", eq: "trend" }, { field: "evidenceB", ne: "hh_hl" }] }, text: "Trend is right. Check the direction: B's highs and lows both step up." },
      ],
      correct: "A falls, B rises: a 1-hour rally inside a 4-hour downtrend. It stays a pullback while it holds below 100.80, the last lower high.",
      hints: [
        "Read each chart on its own first: do its swings climb, fall, or repeat?",
        "Swings are now marked. A's highs: 102.40, 101.60, 100.80. B's lows: 98.60, 98.95, 99.34.",
        "Both are trends at their own scale: A steps down, B steps up.",
      ],
      showMe: { labelA: "trend", evidenceA: "lh_ll", labelB: "trend", evidenceB: "hh_hl" },
      concept: "multi-timeframe-analysis",
    },
    check: ["q-1.5.8-1", "q-1.5.8-2", "q-1.5.8-3"],
    recap: {
      takeaways: [
        "Read the trend on the higher timeframe first. Enter and set the stop on the one you trade.",
        "4-hour up and 1-hour down is usually a pullback inside the bigger uptrend, while it holds.",
        "Fix two timeframes in your plan. Hopping until one agrees with you is confirmation bias.",
      ],
    },
  },
};

// ─── Check questions ────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 1.5.1
  {
    id: "q-1.5.1-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Five 1-hour candles in a row have highs of 100.40, 100.70, 101.10, 100.90 and 100.60. Under the 2-candle rule, is the middle candle a swing high?",
    options: [
      { id: "a", label: "No: it also needs the highest close", rationale: "The rule compares highs only. A swing high is about where price reached, not where the candle closed." },
      { id: "b", label: "No: it needs three lower candles on each side", rationale: "Three or five per side are other conventions. This course's rule uses two, and 101.10 passes it." },
      { id: "c", label: "Yes: 101.10 is above the two highs on each side" },
      { id: "d", label: "Only if the next candle is bearish", rationale: "One candle's colour doesn't decide it. The rule asks whether the two neighbours on each side have lower highs." },
    ],
    correct: "c",
    explanation: "With two candles on each side, compare 101.10 with 100.40 and 100.70 before it and 100.90 and 100.60 after it. All four are lower, so it's a swing high. The rule looks at highs only, and the number of candles per side is a fixed choice.",
    lesson: "1.5.1",
    concepts: ["swing-points"],
  },
  {
    id: "q-1.5.1-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "Candle 40 on LABX has just closed with a low of 98.60, the lowest of the last 20 hours. You use the 2-candle rule.",
    prompt: "When can you mark candle 40 as a swing low?",
    options: [
      { id: "a", label: "Now, because it's the lowest low in 20 hours", rationale: "Lowest so far isn't enough. The rule also needs two later candles with higher lows, and they haven't formed yet." },
      { id: "b", label: "After candles 41 and 42 both close with higher lows" },
      { id: "c", label: "After candle 41 closes with a higher low", rationale: "One candle is half the test. The rule needs two candles after it, so candle 42 has to close too." },
      { id: "d", label: "Never: the newest candle can't be a swing low", rationale: "It can't be one yet. Once two later candles close with higher lows, it qualifies." },
    ],
    correct: "b",
    explanation: "A swing low needs higher lows on both sides: the two candles before it and the two after. Until candles 41 and 42 close above 98.60, candle 40 is only a candidate. That's why every swing is confirmed two candles late.",
    lesson: "1.5.1",
    concepts: ["swing-points"],
    hints: ["Count how many candles the rule needs on each side.", "The two candles before are known. What about the two after?"],
  },
  {
    id: "q-1.5.1-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Two traders mark swings on the same LABX chart. One finds 10, the other finds 4. What is the most likely reason?",
    options: [
      { id: "a", label: "One of them misread the prices", rationale: "Possible, but a gap this size usually comes from the rule, not the reading. Different rules give different swing maps." },
      { id: "b", label: "Only one of the two maps can be correct", rationale: "Both can be correct under their own rule. Structure depends on the definition, and the definition is a choice." },
      { id: "c", label: "The chart's prices changed between their looks", rationale: "Closed candles don't change. The difference comes from how each trader defines a swing." },
      { id: "d", label: "They use different rules, such as two versus five candles on each side" },
    ],
    correct: "d",
    explanation: "A wider rule, such as five candles on each side, keeps only the bigger turns, so it finds fewer swings. Both maps are valid under their own rule. That's why you fix one rule and use it every time.",
    lesson: "1.5.1",
    concepts: ["swing-points"],
    hints: ["Think about what decides whether a candle counts as a swing.", "A rule with more candles per side is harder to pass."],
  },
  // 1.5.3
  {
    id: "q-1.5.3-1",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 1,
    prompt: "An uptrend leg rises from 50.00 to 54.00. Price then pulls back to 53.00. How deep is the pullback, as a percentage of the leg?",
    numeric: { answer: 25, tolerance: 0.5, unit: "%" },
    explanation: "The leg is 54.00 − 50.00 = 4.00 and the pullback is 54.00 − 53.00 = 1.00. Depth = 1.00 ÷ 4.00 = 25%. Dividing by the price instead of the leg would give a much smaller, meaningless number.",
    lesson: "1.5.3",
    concepts: ["pullback"],
    hints: ["Find the size of the leg first, then the size of the pullback.", "Depth = pullback ÷ leg, as a percentage.", "Leg: 4.00. Pullback: 54.00 − 53.00 = 1.00. Now divide."],
    vary: {
      fields: { start: [40, 120, 1], leg: [2, 8, 1], pct: [20, 80, 5] },
      answer: "pct",
      prompt: "An uptrend leg rises from {start:2} to {start + leg:2}. Price then pulls back to {start + leg - leg * pct / 100:2}. How deep is the pullback, as a percentage of the leg?",
      explanation: "The leg is {start + leg:2} − {start:2} = {leg:2} and the pullback is {start + leg:2} − {start + leg - leg * pct / 100:2} = {leg * pct / 100:2}. Depth = {leg * pct / 100:2} ÷ {leg:2} = {answer}%. Dividing by the price instead of the leg would give a much smaller, meaningless number.",
      hint: "Leg: {leg:2}. Pullback: {leg * pct / 100:2}. Now divide the pullback by the leg.",
    },
  },
  {
    id: "q-1.5.3-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "LABX is in an uptrend. Its last two swing lows were 98.40 and 99.30. From a high of 101.00, price pulls back to 99.10.",
    prompt: "What does this pullback tell you?",
    options: [
      { id: "a", label: "It broke the last higher low, 99.30, so the uptrend is in question" },
      { id: "b", label: "A normal pullback, because price is still above 98.40", rationale: "The low that counts is the last one, 99.30. An older low doesn't keep the pattern of higher lows intact." },
      { id: "c", label: "A downtrend has started, so selling is the plan", rationale: "One lower low is a warning, not a downtrend. A downtrend also needs a lower high and another lower low." },
      { id: "d", label: "Nothing yet: wait until it passes 61.8% of the leg", rationale: "A ratio doesn't define the trend; structure does. The last higher low, 99.30, has already broken." },
    ],
    correct: "a",
    explanation: "In an uptrend, each pullback has to hold above the last higher low, here 99.30. A low of 99.10 breaks it: the pullback gave back 1.90 of a 1.70 leg, about 112%. That's a warning that the uptrend may be ending, not yet a downtrend.",
    lesson: "1.5.3",
    concepts: ["pullback", "trend"],
    hints: ["Which swing low does the uptrend's structure depend on right now?", "Compare 99.10 with the most recent swing low, not the older one."],
  },
  {
    id: "q-1.5.3-3",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "Your stop is at 48.00 and you will risk 100.00. Buying the pullback at 49.00 instead of chasing at 51.00, how many more units can you buy? Ignore costs.",
    numeric: { answer: 67, tolerance: 0, unit: "units" },
    explanation: "At the pullback the stop is 1.00 away: 100.00 ÷ 1.00 = 100 units. Chasing, it is 3.00 away: 100.00 ÷ 3.00 = 33.3, so 33 units. The pullback entry buys 67 more units for the same risk.",
    lesson: "1.5.3",
    concepts: ["pullback", "position-sizing"],
    hints: [
      "Size each entry separately: budget ÷ distance to the stop, rounded down.",
      "Pullback: 49.00 − 48.00 = 1.00 per unit. Chase: 51.00 − 48.00 = 3.00 per unit.",
      "100 units versus 33 units. Now subtract.",
    ],
    vary: {
      fields: { stop: [40, 120, 1], pull: [0.5, 2, 0.5], extra: [1, 3, 0.5], budget: [50, 200, 50] },
      constraints: ["floor(budget / pull) * (stop + pull) <= 10000"],
      answer: "floor(budget / pull) - floor(budget / (pull + extra))",
      prompt: "Your stop is at {stop:2} and you will risk {budget:2}. Buying the pullback at {stop + pull:2} instead of chasing at {stop + pull + extra:2}, how many more units can you buy? Ignore costs.",
      explanation: "At the pullback the stop is {pull:2} away: {budget:2} ÷ {pull:2} = {budget / pull:1}, so {floor(budget / pull)} units. Chasing, it is {pull + extra:2} away: {budget:2} ÷ {pull + extra:2} = {budget / (pull + extra):1}, so {floor(budget / (pull + extra))} units. The pullback entry buys {answer} more units for the same risk.",
      hint: "{floor(budget / pull)} units versus {floor(budget / (pull + extra))} units. Now subtract.",
    },
  },
  // 1.5.5
  {
    id: "q-1.5.5-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "In Osler's study of a bank's currency orders, where did take-profit orders cluster most?",
    options: [
      { id: "a", label: "Just beyond round numbers, such as 100.07", rationale: "That's where stop-loss orders gathered. Take-profits sat exactly on the round number." },
      { id: "b", label: "Evenly across all prices", rationale: "Orders were far from even. Prices ending in 00 drew about twice the share of take-profits as of stop-losses." },
      { id: "c", label: "At Fibonacci ratios of the last move", rationale: "The study looked at price endings, not ratios. Take-profits clustered at round numbers." },
      { id: "d", label: "Exactly at round numbers, such as 100.00" },
    ],
    correct: "d",
    explanation: "Take-profits clustered exactly at round numbers: 9.3% ended in 00, against 4.4% of stop-losses. Stop-losses clustered just beyond round numbers instead. People choose easy prices for their targets.",
    lesson: "1.5.5",
    concepts: ["round-numbers"],
  },
  {
    id: "q-1.5.5-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "You're long LABX at 50.40, just above support at 50.00, which is also a round number. A normal candle is about 0.30.",
    prompt: "Where do you put the stop?",
    options: [
      { id: "a", label: "50.00, on the support", rationale: "Any ordinary test of support can touch it. The stop belongs where the idea is wrong, beyond the level." },
      { id: "b", label: "49.95, just under the level", rationale: "That's where other traders' stops cluster. A quick push through 50.00 can set them all off, yours included." },
      { id: "c", label: "49.70, about one normal candle below the level" },
      { id: "d", label: "48.00, far below", rationale: "Beyond the level is right, but this far adds loss without adding information. The idea is wrong well before 48.00." },
    ],
    correct: "c",
    explanation: "The stop goes where the idea is wrong: beyond support, and past the cluster of stops just under 50.00. About one normal candle below, 49.70, does both. Closer stops can be swept; much wider ones only add loss.",
    lesson: "1.5.5",
    concepts: ["round-numbers", "invalidation-level"],
    hints: ["Two things sit near 50.00: the support itself, and the stops other traders put just under it.", "Clear both, by about one normal candle."],
  },
  {
    id: "q-1.5.5-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Support and resistance levels published by analysts were tested against random levels. Which summary is accurate?",
    options: [
      { id: "a", label: "Published levels held about nine times in ten", rationale: "The real rate was 60.8%, not 90%. Levels tilt the odds slightly; they don't hold reliably." },
      { id: "b", label: "Published levels stopped price 60.8% of the time, random ones 56.2%: real but small" },
      { id: "c", label: "There was no difference between the two", rationale: "There was a statistically significant difference. It was just small, under five percentage points." },
      { id: "d", label: "Trading the published levels was shown to be profitable after costs", rationale: "Profit after costs wasn't established. A small edge at turning points can vanish once you pay the spread and commission." },
    ],
    correct: "b",
    explanation: "Osler (2000) found published levels interrupted intraday trends 60.8% of the time, against 56.2% for random levels. That's a real effect, but a modest one, and profitability after costs wasn't shown. It tilts the odds a little; it doesn't make a level a wall.",
    lesson: "1.5.5",
    concepts: ["round-numbers", "support-and-resistance"],
    hints: ["The effect was statistically real. Was it large?", "Look for the answer that is real but modest, and doesn't claim profit."],
  },
  // 1.5.6
  {
    id: "q-1.5.6-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "LABX broke above resistance at 80.00 and later dips back to 80.10. What does role reversal suggest?",
    options: [
      { id: "a", label: "The old resistance near 80.00 may now act as support" },
      { id: "b", label: "The level stopped mattering once it broke", rationale: "Broken levels often stay in traders' minds. Role reversal says the old ceiling may now act as a floor." },
      { id: "c", label: "Price must fall back below 80.00", rationale: "Nothing must happen. Role reversal describes what may happen at the retest, and the retest can also fail." },
      { id: "d", label: "80.00 is now stronger resistance", rationale: "Price is above 80.00 now, so the level sits below it. A level below price can act as support, not resistance." },
    ],
    correct: "a",
    explanation: "Role reversal is the idea that a broken resistance may act as support on a retest, and a broken support as resistance. It's a practitioner pattern, not a guarantee: the retest can hold or fail.",
    lesson: "1.5.6",
    concepts: ["role-reversal"],
  },
  {
    id: "q-1.5.6-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "LABX ranged under 60.00 for two days, then closed at 60.40. You bought at 60.45 with a stop at 59.60. Two candles later, a candle closes at 59.85, back inside the range. Your stop hasn't been hit.",
    prompt: "What does that close tell you?",
    options: [
      { id: "a", label: "The retest is holding: price is still above your stop", rationale: "A retest that holds closes above the old zone. This one closed back inside the range, under 60.00." },
      { id: "b", label: "The breakout has failed: the reason for the trade is gone" },
      { id: "c", label: "A stronger breakout is likely next", rationale: "Nothing in a close back inside points to a stronger break. It's the failure your stop was planned for." },
      { id: "d", label: "Nothing, until the stop is hit", rationale: "The stop is the last line, not the only signal. A close back inside already says the breakout idea is wrong." },
    ],
    correct: "b",
    explanation: "A close back inside the range within a few candles is what defines a failed breakout. The idea behind the trade, price holding above 60.00, is gone. Your plan decides the next step: exit, or let the stop do its job, but never widen it.",
    lesson: "1.5.6",
    concepts: ["false-breakout", "role-reversal"],
    hints: ["Did the candle only wick into the zone, or close back inside the range?", "Compare the close, 59.85, with the broken level, 60.00."],
  },
  {
    id: "q-1.5.6-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your breakout buy stopped out for −1R when price closed back inside the range. It feels like the market tricked you, and price is still falling.",
    prompt: "What's the best next step?",
    options: [
      { id: "a", label: "Short at once to win the loss back", rationale: "That's a new trade made out of frustration, not a setup from your plan. It's how one loss becomes two." },
      { id: "b", label: "Buy again with a wider stop so it can't be hit", rationale: "Widening the stop changes the risk after the fact. The setup failed, and the planned loss was the plan working." },
      { id: "c", label: "Double the size on the next breakout", rationale: "Sizing up after a loss raises risk when you're least objective. The next trade gets the same risk as any other." },
      { id: "d", label: "Accept the planned loss and wait for the next setup in your plan" },
    ],
    correct: "d",
    explanation: "A failed breakout is one of the two endings you planned for. The loss was sized in advance, so take it. Flipping direction, widening stops or sizing up after it are decisions made in frustration, not from the plan.",
    lesson: "1.5.6",
    concepts: ["false-breakout", "revenge-trading"],
    hints: ["Was the loss inside what you planned before the trade?", "Which choice is a setup from your plan, not a reaction?"],
  },
  // 1.5.7
  {
    id: "q-1.5.7-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "What breaks the structure of an uptrend?",
    options: [
      { id: "a", label: "Any bearish candle", rationale: "Uptrends contain plenty of bearish candles. Structure is about swing points, not single candles." },
      { id: "b", label: "A pullback deeper than 50% of the last leg", rationale: "Depth alone doesn't break a trend. A deep pullback that holds the last higher low keeps the structure." },
      { id: "c", label: "A close below the last higher low" },
      { id: "d", label: "An hour with lower volume", rationale: "Volume measures activity, not structure. The structure breaks when price closes below the last higher low." },
    ],
    correct: "c",
    explanation: "An uptrend is a sequence of higher highs and higher lows. A close below the last higher low breaks that sequence. It's a warning, not yet a downtrend: that also needs a lower high and a lower low.",
    lesson: "1.5.7",
    concepts: ["structure-break"],
  },
  {
    id: "q-1.5.7-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "LABX's uptrend has made swing lows at 100.00 and 101.20 and a high at 103.00. Price has just closed at 100.90.",
    prompt: "What do you know now?",
    options: [
      { id: "a", label: "A downtrend is confirmed", rationale: "One close below the last higher low is a warning. A downtrend also needs a lower high and then a lower low." },
      { id: "b", label: "The structure broke: a warning, not yet a downtrend" },
      { id: "c", label: "Nothing has changed while price stays above 100.00", rationale: "The low that counts is the last one, 101.20. Older lows don't hold the structure together." },
      { id: "d", label: "It's a deep pullback, so buying it is the plan", rationale: "A pullback buy needs an intact uptrend. The close under 101.20 broke it." },
    ],
    correct: "b",
    explanation: "The last higher low was 101.20, and price closed below it at 100.90, so the uptrend's structure is broken. That doesn't make a downtrend yet: watch whether the next rally stops below 103.00 and whether a new low follows.",
    lesson: "1.5.7",
    concepts: ["structure-break", "trend"],
    hints: ["Which swing low is the most recent one?", "A downtrend needs lower highs and lower lows. How many of those exist yet?"],
  },
  {
    id: "q-1.5.7-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your playbook: buy pullbacks in an uptrend, stop under the last higher low. Yesterday LABX closed below its last higher low. Today price dips, and the dip looks just like your usual setup.",
    prompt: "What do you do?",
    options: [
      { id: "a", label: "Skip it: the first condition, an intact uptrend, fails" },
      { id: "b", label: "Buy with half the usual size", rationale: "Size isn't the problem. The setup's first condition, an intact uptrend, has failed, so there's no setup to size." },
      { id: "c", label: "Buy, with the stop under yesterday's low", rationale: "Moving the stop doesn't restore the structure. The playbook trades pullbacks in uptrends, and this isn't one." },
      { id: "d", label: "Go short at once", rationale: "A structure break is a warning, not a short setup. A short needs its own conditions in your plan." },
    ],
    correct: "a",
    explanation: "Every condition in a playbook has to hold. The structure break removed the first one, so this dip isn't the setup, however similar it looks. A short would need its own setup; until the plan has one, standing aside is the decision.",
    lesson: "1.5.7",
    concepts: ["structure-break", "trading-plan"],
    hints: ["Read the playbook's first condition again.", "Is the uptrend still intact after a close below the last higher low?"],
  },
  // 1.5.8
  {
    id: "q-1.5.8-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "In a two-timeframe plan, what is the higher timeframe for?",
    options: [
      { id: "a", label: "Timing the exact entry", rationale: "Timing is a detail, read on the timeframe you trade or a lower one. The higher timeframe gives the context." },
      { id: "b", label: "Context: the bigger trend and the major levels" },
      { id: "c", label: "Setting the stop distance", rationale: "The stop belongs where the idea is wrong on the timeframe you trade. The higher timeframe frames the trade instead." },
      { id: "d", label: "Replacing your trading timeframe when the two disagree", rationale: "Switching charts when they disagree is the bias this lesson warns about. Both timeframes are fixed in the plan." },
    ],
    correct: "b",
    explanation: "The higher timeframe shows the context: which way the bigger trend runs and where its major levels sit. Entries and stops come from the timeframe you trade. Both are chosen in advance.",
    lesson: "1.5.8",
    concepts: ["multi-timeframe-analysis"],
  },
  {
    id: "q-1.5.8-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "On the 4-hour chart LABX makes higher highs and higher lows; the last higher low is 98.00. On the 1-hour chart, the last 12 candles fell from 101.50 to 99.20, with lower highs and lower lows.",
    prompt: "How is this best read?",
    options: [
      { id: "a", label: "A new downtrend on both timeframes", rationale: "The 4-hour structure hasn't broken: price is above its last higher low, 98.00. Only the 1-hour chart is falling." },
      { id: "b", label: "The 4-hour chart is out of date, so trust the 1-hour", rationale: "Both charts show the same prices. The 4-hour chart groups more of them, so it shows the bigger structure." },
      { id: "c", label: "Noise: neither chart means anything", rationale: "Both show clear structure: higher highs and lows on the 4-hour, lower highs and lows on the 1-hour." },
      { id: "d", label: "A pullback inside the 4-hour uptrend, while it holds above 98.00" },
    ],
    correct: "d",
    explanation: "Both charts are right at their own scale. The 1-hour downtrend is a pullback inside the 4-hour uptrend for as long as price holds above the 4-hour higher low, 98.00. A close below it would break the bigger structure.",
    lesson: "1.5.8",
    concepts: ["multi-timeframe-analysis", "trend"],
    hints: ["Check the 4-hour structure first: has its last higher low broken?", "Price is at 99.20; the 4-hour higher low is 98.00."],
  },
  {
    id: "q-1.5.8-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "A trader checks the 5-minute, 15-minute, 1-hour and daily charts until one shows a buy signal, then buys. What's the problem?",
    options: [
      { id: "a", label: "Lower timeframes are always wrong", rationale: "No timeframe is wrong. The problem is choosing one after seeing which agrees with you." },
      { id: "b", label: "Nothing: more charts mean more information", rationale: "More charts also mean more chances to find a signal by luck. Picking the one that agrees is selection, not information." },
      { id: "c", label: "With enough charts, one will agree by chance: that's confirmation bias" },
      { id: "d", label: "Daily charts are the only valid ones", rationale: "Any timeframe can work if it's chosen in the plan, before you look." },
    ],
    correct: "c",
    explanation: "Each extra timeframe is another chance to find a chart that supports the idea you already had. Picking the one that agrees is confirmation bias. Fixing one context timeframe and one trading timeframe in the plan removes that freedom.",
    lesson: "1.5.8",
    concepts: ["multi-timeframe-analysis", "confirmation-bias"],
    hints: ["What decided which chart the trader acted on?", "If you keep looking until something agrees, what are you measuring?"],
  },
];

// ─── Glossary terms new in this unit ────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "swing-high",
    term: "Swing high",
    definition: "A candle whose high is above the highs of the candles on each side, two on each side under this course's rule. It marks a local peak.",
    plain: "A peak in price: a candle that reached higher than its neighbours on both sides.",
    related: ["swing-low", "market-structure", "high"],
    lesson: "1.5.1",
    aka: ["Pivot high"],
  },
  {
    id: "swing-low",
    term: "Swing low",
    definition: "A candle whose low is below the lows of the candles on each side, two on each side under this course's rule. It marks a local trough.",
    plain: "A dip in price: a candle that reached lower than its neighbours on both sides.",
    related: ["swing-high", "market-structure", "low"],
    lesson: "1.5.1",
    aka: ["Pivot low"],
  },
  {
    id: "market-structure",
    term: "Market structure",
    definition: "The pattern of swing highs and swing lows that shows whether price is trending up, trending down or moving sideways.",
    plain: "The shape of the swings: rising highs and lows, falling ones, or a band price keeps returning to.",
    related: ["swing-high", "swing-low", "trend", "range"],
    lesson: "1.5.1",
  },
  {
    id: "leg",
    term: "Leg",
    definition: "A move from one swing point to the next, such as from a swing low up to the next swing high.",
    plain: "One stretch of the zigzag: a run up from a low to a high, or down from a high to a low.",
    related: ["pullback", "retracement", "swing-high", "swing-low"],
    lesson: "1.5.3",
  },
  {
    id: "round-number",
    term: "Round number",
    definition: "A price ending in 00 or 50, such as 100.00 or 100.50. Orders tend to cluster at and just beyond such prices.",
    plain: "An easy, memorable price that many traders pick for their orders.",
    related: ["stop-cluster", "support", "resistance", "take-profit"],
    lesson: "1.5.5",
  },
  {
    id: "stop-cluster",
    term: "Stop cluster",
    definition: "Many stop orders resting just beyond an obvious level, such as a round number. Triggered together, they become market orders and can speed up a move.",
    plain: "A crowd of stops in the same spot. When price reaches it, they go off together.",
    related: ["stop-loss", "stop-order", "round-number", "breakout"],
    lesson: "1.5.5",
  },
  {
    id: "retest",
    term: "Retest",
    definition: "A return of price to a level it has just broken, before it moves on or falls back through it.",
    plain: "Price coming back to check the level it just broke.",
    related: ["breakout", "role-reversal", "false-breakout", "support"],
    lesson: "1.5.6",
  },
  {
    id: "role-reversal",
    term: "Role reversal",
    definition: "When a broken resistance starts acting as support, or a broken support as resistance.",
    plain: "The old ceiling becomes the new floor, or the old floor the new ceiling.",
    related: ["retest", "support", "resistance", "breakout"],
    lesson: "1.5.6",
    aka: ["Polarity"],
  },
  {
    id: "false-breakout",
    term: "False breakout",
    definition: "A move beyond a level that soon closes back inside, trapping traders who acted on the break.",
    plain: "Price escapes its range, then slips straight back in.",
    related: ["breakout", "retest", "support", "resistance"],
    lesson: "1.5.6",
    aka: ["Failed breakout"],
  },
  {
    id: "structure-break",
    term: "Structure break",
    definition: "A close below the last higher low of an uptrend, or above the last lower high of a downtrend. The first warning that the trend may be ending.",
    plain: "The moment the pattern of rising lows, or of falling highs, is broken.",
    related: ["market-structure", "trend", "reversal", "swing-low"],
    lesson: "1.5.7",
    aka: ["Break of structure"],
  },
  {
    id: "higher-timeframe",
    term: "Higher timeframe",
    definition: "A longer candle interval used for context, such as 4-hour candles when you trade on 1-hour ones.",
    plain: "The zoomed-out chart that shows the bigger trend.",
    related: ["timeframe", "trend", "market-structure"],
    lesson: "1.5.8",
    aka: ["HTF"],
  },
];

// ─── Concepts new in this unit ──────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "swing-points",
    name: "Swing points",
    category: "technical_analysis",
    summary: "Swing highs and lows marked by a fixed rule and confirmed only after the candles that follow them.",
    body: [
      "A swing high is a candle whose high is above the highs of the candles on each side; a swing low is the mirror image. This course uses two candles on each side. Swings are the turning points from which trends, ranges, pullbacks and structure breaks are read.",
      "Because the rule looks at the candles after the swing, every swing is confirmed late: with two candles on each side, two candles after it forms. The rule itself is a choice. Wider rules find fewer, bigger swings, so two traders can draw different structures on the same chart. Pick one rule and apply it the same way every time.",
    ],
    example: "Five candles have highs of 100.40, 100.70, 101.10, 100.90 and 100.60. The middle one is a swing high under the 2-candle rule, but only once the fifth candle has closed; before that, 101.10 was just the latest high.",
    related: ["trend", "range", "support-and-resistance"],
    missions: ["M02"],
    lessons: ["1.5.1", "L05"],
  },
  {
    id: "pullback",
    name: "Pullback",
    category: "technical_analysis",
    summary: "A counter-move inside a trend, measured against the prior leg; the trend holds while it stays above the last higher low.",
    body: [
      "A pullback is a move against the trend, inside it: a dip in an uptrend or a bounce in a downtrend. Measure it in price, as a share of the leg before it, or in normal candles. A pullback of 1.20 from a 4.00 leg is 30%.",
      "Depth doesn't decide whether the trend survives; structure does. In an uptrend, a pullback that holds above the last higher low keeps the pattern intact, while one that breaks it is a warning. Ratios such as 61.8% have shown no special power in the evidence this course relies on.",
      "Buying a pullback puts the stop closer than buying after a run, so the same risk buys more units.",
    ],
    example: "A leg runs from 103.55 to 106.00. A pullback to 104.80 gives back 1.20, about 49%, and holds above 103.55. A fall to 101.90 gives back 167% and breaks the last higher low.",
    related: ["trend", "invalidation-level", "position-sizing"],
    missions: [],
    lessons: ["1.5.3"],
  },
  {
    id: "round-numbers",
    name: "Round numbers",
    category: "technical_analysis",
    summary: "Prices ending in 00 or 50 attract take-profits at the number and stops just beyond it; the effect is real but small.",
    body: [
      "Traders like easy prices. In one bank's book of 9,667 currency orders, 9.3% of take-profits sat exactly at prices ending in 00, against 4.4% of stop-losses, and buy stops sat just above round numbers about twice as often as just below (Osler).",
      "Take-profits at the number tend to slow price there; stops just beyond it, once triggered, become market orders and can speed a break up. Published support and resistance levels stopped intraday trends 60.8% of the time, against 56.2% for random levels: a real but modest effect, not shown to be profitable after costs (Osler, 2000).",
      "For a stop, the lesson is practical: place it beyond the level and beyond the cluster of stops just past it, not exactly where everyone else's is.",
    ],
    example: "Long at 100.40 above support at 100.00, with a normal candle of 0.40. A stop at 99.95 sits in the cluster under 100.00; a stop at 99.60 clears the level and the cluster by about one normal candle.",
    related: ["support-and-resistance", "stop-loss-order", "breakout"],
    missions: ["M04"],
    lessons: ["1.5.5"],
  },
  {
    id: "role-reversal",
    name: "Role reversal",
    category: "technical_analysis",
    summary: "A broken resistance may act as support, and a broken support as resistance; retests can hold or fail.",
    body: [
      "After a breakout, price often comes back to the level it broke: a retest. Role reversal is the practitioner observation that the old resistance may now act as support, or an old support as resistance. A common explanation is orders left near the old level by traders caught on the wrong side of the break, or who missed it.",
      "The support for role reversal is practitioner experience rather than systematic tests. A retest that wicks into the old zone and closes beyond it is holding; a close back inside the range within a few candles is a failed breakout. Because both endings happen, the plan for each is set before the break.",
    ],
    example: "LABX breaks above 102.00 and rises to 103.20, then dips to 101.90 and closes at 102.30: the retest held. In another ending, it closes at 101.60, back inside the range: the breakout failed, and a stop back inside the range takes the buyer out.",
    related: ["breakout", "false-breakout", "support-and-resistance"],
    missions: [],
    lessons: ["1.5.6"],
  },
  {
    id: "structure-break",
    name: "Structure break",
    category: "technical_analysis",
    summary: "A trend's structure breaks when price closes beyond its last higher low or its last lower high.",
    body: [
      "An uptrend is a sequence of higher highs and higher lows. When price closes below the last higher low, that sequence is broken: the first warning that the trend may be ending. A downtrend breaks the same way, with a close above its last lower high.",
      "A break is not yet a reversal. A downtrend's structure also needs a lower high and then a lower low, and many trends pass through a range first. What changes at once is what you trade: setups that need an intact uptrend, such as buying pullbacks, no longer qualify. Smart Money Concepts call this a 'change of character'; it's the same structure under another name.",
    ],
    example: "An uptrend's last higher low is 100.50. A candle closes at 100.24: the structure breaks. A rally then stops at 101.30, under the 102.20 top, and a later close at 99.88 goes under the 100.10 low: now highs and lows both step down.",
    related: ["trend", "range", "trading-plan"],
    missions: ["M02"],
    lessons: ["1.5.7"],
  },
  {
    id: "multi-timeframe-analysis",
    name: "Multi-timeframe analysis",
    category: "technical_analysis",
    summary: "Reading context on a higher timeframe and acting on a lower one, with both timeframes fixed in advance.",
    body: [
      "The same prices can be grouped into candles of different lengths. A higher timeframe, such as 4-hour candles, shows the bigger trend and its levels; the timeframe you trade, such as 1-hour candles, shows where to enter and where the stop goes.",
      "The two often disagree. A fall on the 1-hour chart inside a 4-hour uptrend is usually read as a pullback, as long as the 4-hour structure holds. Trading against the larger structure is possible, but it's a known extra risk.",
      "Every extra timeframe is another chance to find a chart that agrees with you. That's why a plan fixes two timeframes in advance, one for context and one for trading. The approach is a practitioner convention, not a tested edge.",
    ],
    example: "On 4-hour candles LABX makes higher lows at 97.60, 98.40 and 99.20. On 1-hour candles the last 12 fall from 101.40 to 99.98, with lower highs and lower lows. The fall stays above 99.20, so the read is a pullback in an uptrend.",
    related: ["timeframe", "trend", "confirmation-bias"],
    missions: [],
    lessons: ["1.5.8"],
  },
];

/** Unit 1.5 · Market structure basics (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_1_5: UnitContent = { lessons: [L151, L153, L155, L156, L157, L158], questions: QUESTIONS, terms: TERMS, concepts: CONCEPTS };
