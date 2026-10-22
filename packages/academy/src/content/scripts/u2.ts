import type { Concept, GlossaryTerm, LessonScript } from "../../types";
import type { CandleData, ChartLayer, MarkRole } from "../../types";

/*
 * U2 · Reading price: L05 (1.5.2), L06 (1.5.4), L07 (2.3.2). Source: docs/learn/U2-reading-price.md.
 *
 * Conventions in this file:
 * - Candle indices in chart layers and tap zones are 0-based array indices. Copy uses 1-based candle
 *   numbers, so "candle 27" is index 26.
 * - Swing high (low): a candle whose high (low) is strictly above (below) the highs (lows) of the two
 *   candles on each side (the unit's rule).
 * - Series marked "scenario-gen" are frozen output of generateCandles (D9), checked against every number
 *   the lesson script quotes. The others are small series written for the lessons and checked the same way.
 */

/** Rows of [open, high, low, close] → candles. */
const k = (rows: [number, number, number, number][]): CandleData[] => rows.map(([o, h, l, c]) => ({ o, h, l, c }));
const mark = (index: number, at: "high" | "low" | "close", label: string, role: MarkRole = "concept"): ChartLayer => ({ kind: "marker", index, at, label, role });

// ─── Chart data ─────────────────────────────────────────────────────────────

/** L05 B1: 18 candles, 98.40 → 102.10. Swing lows 98.00 (c2), 99.20 (c7), 100.30 (c13); swing highs 99.80 (c5), 101.00 (c10), 102.60 (c16). */
const L05_TREND_PANEL: CandleData[] = k([
  [98.40, 98.55, 98.10, 98.20], [98.20, 98.45, 98.00, 98.35], [98.35, 98.90, 98.25, 98.80], [98.80, 99.40, 98.70, 99.30], [99.30, 99.80, 99.25, 99.55],
  [99.55, 99.65, 99.30, 99.35], [99.35, 99.50, 99.20, 99.45], [99.45, 100.05, 99.40, 99.95], [99.95, 100.55, 99.85, 100.45], [100.45, 101.00, 100.35, 100.70],
  [100.70, 100.85, 100.45, 100.55], [100.55, 100.65, 100.35, 100.45], [100.45, 100.75, 100.30, 100.65], [100.65, 101.35, 100.55, 101.25], [101.25, 102.00, 101.15, 101.90],
  [101.90, 102.60, 101.80, 102.30], [102.30, 102.45, 101.95, 102.05], [102.05, 102.35, 101.90, 102.10],
]);
/** L05 B2: 18 candles between 97.95 and 100.05. Turns down 99.95 (c4), 100.05 (c10), 99.90 (c16); turns up 98.05 (c7), 97.95 (c13). */
const L05_RANGE_PANEL: CandleData[] = k([
  [98.90, 99.20, 98.75, 99.10], [99.10, 99.50, 98.95, 99.40], [99.40, 99.75, 99.25, 99.65], [99.65, 99.95, 99.45, 99.55], [99.55, 99.65, 98.95, 99.05],
  [99.05, 99.15, 98.40, 98.50], [98.50, 98.70, 98.05, 98.55], [98.55, 99.15, 98.45, 99.05], [99.05, 99.70, 98.95, 99.60], [99.60, 100.05, 99.50, 99.70],
  [99.70, 99.80, 99.00, 99.10], [99.10, 99.20, 98.35, 98.45], [98.45, 98.60, 97.95, 98.40], [98.40, 99.05, 98.30, 98.95], [98.95, 99.60, 98.85, 99.50],
  [99.50, 99.90, 99.35, 99.45], [99.45, 99.55, 98.90, 99.00], [99.00, 99.20, 98.60, 98.75],
]);
/** L05 B2: 18 overlapping candles, closes 98.90–99.60. Highs 99.85, 99.40, 99.95; lows 98.70, 99.10, 98.80; net +0.10. */
const L05_NOISE_PANEL: CandleData[] = k([
  [99.10, 99.45, 98.95, 99.30], [99.30, 99.60, 99.00, 99.05], [99.05, 99.85, 98.95, 99.50], [99.50, 99.55, 98.90, 98.95], [98.95, 99.40, 98.85, 99.35],
  [99.35, 99.38, 98.70, 99.00], [99.00, 99.30, 98.88, 99.25], [99.25, 99.40, 99.15, 99.20], [99.20, 99.35, 99.12, 99.15], [99.15, 99.30, 99.10, 99.28],
  [99.28, 99.38, 99.15, 99.18], [99.18, 99.50, 99.12, 99.45], [99.45, 99.70, 99.20, 99.30], [99.30, 99.95, 99.25, 99.60], [99.60, 99.65, 99.00, 99.05],
  [99.05, 99.20, 98.80, 98.90], [98.90, 99.35, 98.85, 99.30], [99.30, 99.45, 98.95, 99.20],
]);
/** L05 B3/B4: 26 candles. Swing lows 100.00 (c3), 101.20 (c9), 102.40 (c15); highs 102.00 (c6), 103.50 (c12), 105.00 (c18); c20 closes 104.40; pullback to 101.00 (c24). */
const L05_PULLBACK: CandleData[] = k([
  [100.40, 100.55, 100.15, 100.25], [100.25, 100.40, 100.10, 100.20], [100.20, 100.60, 100.00, 100.50], [100.50, 101.10, 100.40, 101.00], [101.00, 101.65, 100.90, 101.55],
  [101.55, 102.00, 101.45, 101.70], [101.70, 101.80, 101.35, 101.45], [101.45, 101.55, 101.25, 101.35], [101.35, 101.75, 101.20, 101.65], [101.65, 102.40, 101.55, 102.30],
  [102.30, 103.00, 102.20, 102.90], [102.90, 103.50, 102.80, 103.10], [103.10, 103.20, 102.70, 102.80], [102.80, 102.90, 102.50, 102.60], [102.60, 103.00, 102.40, 102.90],
  [102.90, 103.80, 102.80, 103.70], [103.70, 104.50, 103.60, 104.40], [104.40, 105.00, 104.30, 104.70], [104.70, 104.85, 104.35, 104.50], [104.50, 104.65, 104.20, 104.40],
  [104.40, 104.50, 103.50, 103.60], [103.60, 103.70, 102.60, 102.70], [102.70, 102.80, 101.70, 101.80], [101.80, 101.95, 101.00, 101.30], [101.30, 101.65, 101.15, 101.50],
  [101.50, 101.90, 101.40, 101.80],
]);
/** L05 hook and B5, scenario-gen { seed: 5097, start: 100, segments: [{ kind: "move", bars: 24, move: 0.003, vol: 0.004, wick: 1.6 }] }. */
const L05_ZOOM: CandleData[] = k([
  [100.00, 101.36, 99.56, 100.22], [100.22, 100.62, 99.66, 100.44], [100.44, 101.72, 100.29, 100.85], [100.85, 101.22, 100.70, 101.05], [101.05, 101.37, 100.54, 101.25],
  [101.25, 102.44, 100.60, 101.04], [101.04, 101.75, 100.09, 100.15], [100.15, 100.41, 99.53, 100.22], [100.22, 101.34, 99.38, 100.51], [100.51, 101.95, 100.09, 100.90],
  [100.90, 101.83, 100.85, 101.07], [101.07, 101.93, 100.74, 101.25], [101.25, 101.29, 99.81, 100.52], [100.52, 101.55, 100.35, 100.81], [100.81, 101.44, 100.50, 100.62],
  [100.62, 101.19, 100.34, 100.51], [100.51, 101.29, 100.38, 100.71], [100.71, 100.82, 100.21, 100.64], [100.64, 100.76, 98.62, 99.72], [99.72, 99.86, 99.16, 99.48],
  [99.48, 100.16, 98.87, 99.29], [99.29, 99.48, 99.08, 99.40], [99.40, 101.07, 99.01, 100.18], [100.18, 100.40, 100.11, 100.30],
]);
/** Segment A (downtrend), scenario-gen { seed: 5181, start: 104, segments: move 7 bars −0.022, 4 bars +0.01, 7 bars −0.022, 4 bars +0.01, 8 bars −0.022, all vol 0.003 }. */
const SEG_A: CandleData[] = k([
  [104.00, 104.16, 103.36, 103.60], [103.60, 103.82, 102.68, 103.14], [103.14, 103.28, 102.76, 103.00], [103.00, 103.23, 102.85, 102.94], [102.94, 103.26, 102.58, 102.73],
  [102.73, 103.02, 102.24, 102.27], [102.27, 102.44, 101.60, 101.71], [101.71, 102.34, 101.31, 101.95], [101.95, 102.76, 101.55, 102.52], [102.52, 102.66, 101.74, 102.09],
  [102.09, 103.01, 102.01, 102.73], [102.73, 102.87, 101.72, 101.97], [101.97, 102.40, 101.55, 101.77], [101.77, 102.27, 101.08, 101.29], [101.29, 101.33, 100.68, 100.78],
  [100.78, 100.98, 100.38, 100.66], [100.66, 100.89, 100.29, 100.61], [100.61, 100.80, 100.40, 100.47], [100.47, 101.08, 100.41, 100.79], [100.79, 101.20, 100.63, 101.08],
  [101.08, 101.29, 101.00, 101.08], [101.08, 101.82, 100.82, 101.47], [101.47, 101.72, 100.87, 100.98], [100.98, 101.21, 100.72, 100.86], [100.86, 101.22, 100.65, 100.72],
  [100.72, 100.95, 99.91, 100.14], [100.14, 100.49, 99.17, 99.61], [99.61, 100.33, 99.32, 99.88], [99.88, 100.14, 99.46, 99.55], [99.55, 99.81, 99.01, 99.24],
]);
/** Segment B (noise), scenario-gen { seed: 5245, start: 100, segments: [{ kind: "move", bars: 30, move: 0.002, vol: 0.004, wick: 1.6 }] }. */
const SEG_B: CandleData[] = k([
  [100.00, 101.17, 99.64, 100.07], [100.07, 100.37, 99.51, 100.16], [100.16, 101.20, 98.93, 100.03], [100.03, 100.56, 99.62, 100.49], [100.49, 100.62, 99.96, 100.15],
  [100.15, 100.38, 99.36, 100.26], [100.26, 100.99, 99.55, 100.05], [100.05, 101.62, 99.68, 100.95], [100.95, 101.35, 100.19, 100.98], [100.98, 101.71, 100.39, 100.97],
  [100.97, 101.30, 100.20, 100.73], [100.73, 101.64, 99.80, 100.03], [100.03, 100.10, 99.27, 100.01], [100.01, 100.07, 99.39, 99.56], [99.56, 100.34, 98.16, 99.26],
  [99.26, 100.85, 98.46, 100.68], [100.68, 101.22, 99.90, 100.40], [100.40, 101.02, 100.23, 100.48], [100.48, 100.96, 100.34, 100.89], [100.89, 101.74, 100.64, 101.07],
  [101.07, 102.01, 99.87, 101.08], [101.08, 101.43, 100.53, 100.67], [100.67, 101.08, 100.58, 100.86], [100.86, 101.20, 99.38, 100.53], [100.53, 100.76, 99.74, 100.65],
  [100.65, 101.06, 100.52, 100.59], [100.59, 100.93, 99.53, 99.70], [99.70, 100.58, 99.00, 100.04], [100.04, 100.33, 98.68, 99.62], [99.62, 100.31, 99.15, 100.20],
]);
/** Segment C (range), scenario-gen { seed: 9038, start: 100, segments: [{ kind: "range", bars: 30, halfWidth: 0.012, vol: 0.004 }] }. */
const SEG_C: CandleData[] = k([
  [100.00, 100.19, 99.47, 99.85], [99.85, 100.54, 99.24, 100.03], [100.03, 100.34, 99.45, 100.25], [100.25, 100.31, 99.54, 99.74], [99.74, 99.81, 98.76, 99.10],
  [99.10, 99.68, 99.03, 99.63], [99.63, 99.97, 99.56, 99.72], [99.72, 100.81, 99.35, 100.34], [100.34, 100.73, 100.05, 100.43], [100.43, 100.56, 100.30, 100.45],
  [100.45, 100.96, 99.90, 100.36], [100.36, 100.49, 99.73, 99.98], [99.98, 100.73, 99.84, 100.29], [100.29, 100.75, 99.96, 100.36], [100.36, 100.48, 99.90, 100.07],
  [100.07, 100.48, 99.08, 99.70], [99.70, 99.82, 98.80, 99.31], [99.31, 99.75, 99.23, 99.52], [99.52, 100.12, 99.42, 99.88], [99.88, 100.05, 99.42, 99.71],
  [99.71, 100.25, 99.36, 99.64], [99.64, 100.10, 98.90, 99.23], [99.23, 100.06, 98.76, 99.79], [99.79, 100.35, 99.53, 100.15], [100.15, 100.64, 99.72, 100.38],
  [100.38, 100.57, 99.90, 100.17], [100.17, 100.79, 99.20, 99.26], [99.26, 99.67, 99.13, 99.59], [99.59, 100.31, 98.88, 99.34], [99.34, 99.53, 99.07, 99.33],
]);
/** L06 hook, B2, B3: 30 candles between 97.90 and 102.30 from 100.20. Turns down 101.95 (c5), 102.10 (c12), 101.85 (c20); up 98.10 (c8), 97.90 (c16), 98.05 (c23); c27 tests 102.30. */
const L06_RANGE: CandleData[] = k([
  [100.20, 100.65, 100.05, 100.55], [100.55, 101.10, 100.40, 100.95], [100.95, 101.40, 100.70, 101.25], [101.25, 101.70, 101.05, 101.55], [101.55, 101.95, 101.20, 101.35],
  [101.35, 101.50, 100.10, 100.30], [100.30, 100.45, 98.85, 99.05], [99.05, 99.30, 98.10, 98.70], [98.70, 99.75, 98.50, 99.60], [99.60, 100.70, 99.45, 100.55],
  [100.55, 101.60, 100.35, 101.45], [101.45, 102.10, 101.20, 101.50], [101.50, 101.65, 100.30, 100.45], [100.45, 100.60, 99.20, 99.35], [99.35, 99.50, 98.25, 98.40],
  [98.40, 98.75, 97.90, 98.55], [98.55, 99.60, 98.40, 99.45], [99.45, 100.50, 99.30, 100.35], [100.35, 101.40, 100.20, 101.25], [101.25, 101.85, 101.00, 101.15],
  [101.15, 101.30, 99.95, 100.10], [100.10, 100.25, 98.85, 99.00], [99.00, 99.40, 98.05, 99.20], [99.20, 100.30, 99.05, 100.15], [100.15, 101.10, 100.00, 100.95],
  [100.95, 101.75, 100.80, 101.60], [101.60, 102.30, 101.45, 101.80], [101.80, 101.82, 101.45, 101.55], [101.55, 101.75, 101.40, 101.70], [101.70, 101.78, 101.35, 101.60],
]);
/** L06 B4: the breakout candle, c31. */
const L06_C31: CandleData[] = k([
  [101.60, 102.75, 101.50, 102.60],
]);
/** L06 B4, ending A (c32–c35): the breakout holds. */
const L06_ENDING_A: CandleData[] = k([
  [102.60, 103.00, 102.45, 102.90], [102.90, 103.50, 102.70, 103.40], [103.40, 103.55, 102.20, 103.10], [103.10, 103.90, 103.00, 103.80],
]);
/** L06 B4, ending B (c32–c35): back inside; the stop at 101.70 fills on c32. */
const L06_ENDING_B: CandleData[] = k([
  [102.60, 102.70, 101.30, 101.40], [101.40, 101.55, 100.75, 100.90], [100.90, 101.35, 100.70, 101.20], [101.20, 101.30, 100.45, 100.60],
]);
/** L06 Try, c1–c39 (shared by both endings): scenario-gen { seed: 6375, start: 103.2, segments: [{ kind: "range", bars: 36, halfWidth: 0.013, vol: 0.004 }, { kind: "move", bars: 2, move: 0.0136, vol: 0.002 }, { kind: "candle", body: 0.0082, upper: 0.0015, lower: 0.001, volume: 1.8 }, …ending] }. */
const L06_TASK_BASE: CandleData[] = k([
  [103.20, 103.34, 102.51, 102.85], [102.85, 102.94, 102.55, 102.68], [102.68, 103.12, 101.98, 102.17], [102.17, 103.23, 101.84, 102.87], [102.87, 103.39, 102.59, 103.30],
  [103.30, 103.81, 103.07, 103.63], [103.63, 104.02, 103.46, 103.91], [103.91, 104.19, 102.36, 102.56], [102.56, 103.06, 101.79, 102.54], [102.54, 103.10, 102.38, 102.90],
  [102.90, 103.07, 102.52, 103.00], [103.00, 103.71, 102.65, 103.64], [103.64, 103.81, 102.45, 102.77], [102.77, 103.15, 101.75, 102.03], [102.03, 103.48, 101.78, 103.22],
  [103.22, 103.43, 102.78, 103.02], [103.02, 103.57, 102.88, 103.27], [103.27, 103.42, 102.76, 102.90], [102.90, 103.46, 102.25, 103.04], [103.04, 103.81, 102.56, 103.75],
  [103.75, 103.84, 103.16, 103.53], [103.53, 104.22, 102.64, 103.35], [103.35, 103.83, 102.78, 103.35], [103.35, 103.55, 103.07, 103.50], [103.50, 104.38, 103.42, 103.93],
  [103.93, 104.20, 103.29, 103.67], [103.67, 104.23, 103.25, 103.43], [103.43, 103.79, 102.20, 102.96], [102.96, 103.55, 102.88, 103.40], [103.40, 103.52, 102.59, 102.82],
  [102.82, 103.26, 102.44, 103.13], [103.13, 103.39, 102.49, 103.13], [103.13, 104.41, 102.51, 103.44], [103.44, 103.63, 103.08, 103.25], [103.25, 103.66, 102.60, 102.84],
  [102.84, 103.28, 102.57, 102.61], [102.61, 103.50, 102.34, 103.34], [103.34, 104.07, 103.17, 104.01], [104.01, 105.02, 103.91, 104.86],
]);
/** L06 Try, ending FAIL (c40–c51): [{ kind: "move", bars: 3, move: -0.011, vol: 0.002 }, { kind: "move", bars: 9, move: -0.008, vol: 0.003 }]. */
const L06_TASK_FAIL: CandleData[] = k([
  [104.86, 105.14, 104.09, 104.25], [104.25, 104.52, 103.78, 103.81], [103.81, 103.92, 103.47, 103.71], [103.71, 103.84, 103.32, 103.74], [103.74, 104.00, 103.46, 103.61],
  [103.61, 103.87, 103.39, 103.52], [103.52, 103.73, 103.31, 103.36], [103.36, 103.39, 103.11, 103.23], [103.23, 104.04, 102.85, 103.58], [103.58, 104.13, 103.39, 103.42],
  [103.42, 103.70, 102.75, 103.25], [103.25, 103.42, 102.75, 102.88],
]);
/** L06 Try, ending HOLD (c40–c51): [{ kind: "move", bars: 3, move: -0.002, vol: 0.002 }, { kind: "move", bars: 9, move: 0.012, vol: 0.003 }]. */
const L06_TASK_HOLD: CandleData[] = k([
  [104.86, 105.14, 104.41, 104.57], [104.57, 104.84, 104.40, 104.44], [104.44, 104.77, 104.21, 104.65], [104.65, 105.01, 104.25, 104.91], [104.91, 105.28, 104.76, 105.01],
  [105.01, 105.42, 104.88, 105.16], [105.16, 105.44, 105.11, 105.23], [105.23, 105.36, 105.11, 105.32], [105.32, 106.39, 104.93, 105.92], [105.92, 106.56, 105.89, 105.99],
  [105.99, 106.33, 105.48, 106.05], [106.05, 106.22, 105.77, 105.91],
]);
/** L07 hook: closes 100.00 … 104.00, then 110.00. */
const L07_HOOK: CandleData[] = k([
  [99.60, 100.20, 99.40, 100.00], [100.00, 101.20, 99.80, 101.00], [101.00, 102.20, 100.80, 102.00], [102.00, 103.20, 101.80, 103.00], [103.00, 104.20, 102.80, 104.00],
  [104.00, 110.30, 103.90, 110.00],
]);
/** L07 B3, the 40 visible candles of scenario-gen { seed: 7490, start: 106, segments: [{ kind: "move", bars: 50, move: -0.02, vol: 0.004 }, { kind: "move", bars: 20, move: -0.05, vol: 0.004 }, { kind: "move", bars: 20, move: 0.055, vol: 0.004 }] } (the first 50 are warm-up). */
const L07_DROP: CandleData[] = k([
  [103.88, 104.26, 102.43, 102.78], [102.78, 102.94, 101.90, 102.08], [102.08, 102.35, 101.88, 102.00], [102.00, 102.52, 101.61, 102.37], [102.37, 102.64, 102.16, 102.26],
  [102.26, 102.49, 101.61, 101.72], [101.72, 101.99, 100.93, 101.01], [101.01, 101.34, 100.88, 100.97], [100.97, 101.62, 100.18, 100.48], [100.48, 100.60, 99.95, 100.17],
  [100.17, 100.29, 99.63, 99.98], [99.98, 100.30, 99.26, 99.56], [99.56, 99.99, 98.99, 99.08], [99.08, 99.46, 98.61, 99.29], [99.29, 99.62, 98.23, 98.50],
  [98.50, 99.14, 97.91, 98.11], [98.11, 98.78, 97.90, 98.51], [98.51, 98.57, 98.10, 98.30], [98.30, 98.61, 97.32, 97.90], [97.90, 99.03, 97.78, 98.69],
  [98.69, 98.89, 98.42, 98.57], [98.57, 99.41, 98.47, 98.73], [98.73, 99.36, 98.32, 98.91], [98.91, 99.44, 98.47, 99.27], [99.27, 99.60, 98.89, 99.05],
  [99.05, 100.29, 98.88, 100.07], [100.07, 100.57, 100.01, 100.24], [100.24, 100.59, 100.00, 100.20], [100.20, 100.81, 99.87, 100.77], [100.77, 101.28, 99.86, 100.45],
  [100.45, 100.69, 99.81, 100.40], [100.40, 101.34, 100.05, 100.77], [100.77, 101.62, 100.59, 101.43], [101.43, 102.43, 100.85, 102.14], [102.14, 103.04, 101.84, 102.36],
  [102.36, 102.87, 102.27, 102.45], [102.45, 103.27, 102.09, 102.90], [102.90, 103.26, 102.73, 102.94], [102.94, 103.76, 102.26, 103.66], [103.66, 104.46, 103.62, 104.12],
]);
/** SMA 10 on L07_DROP, computed with the 50 warm-up candles (3 decimals, so the low at c24 stays distinct from c23). */
const L07_DROP_SMA10: number[] = [
  104.232, 103.873, 103.508, 103.274, 103.061, 102.82, 102.51, 102.294, 101.955, 101.584,
  101.304, 101.052, 100.76, 100.452, 100.076, 99.715, 99.465, 99.198, 98.94, 98.792,
  98.651, 98.568, 98.551, 98.549, 98.604, 98.8, 98.973, 99.163, 99.45, 99.626,
  99.809, 100.013, 100.265, 100.552, 100.883, 101.121, 101.387, 101.661, 101.95, 102.317,
];
/** L07 Try, Trend: scenario-gen { seed: 7301, start: 100, segments: [{ kind: "move", bars: 50, move: 0.03, vol: 0.004 }, { kind: "move", bars: 35, move: 0.06, vol: 0.004 }, { kind: "move", bars: 45, move: -0.08, vol: 0.004 }] }. First 50 are warm-up. */
const L07_TREND: CandleData[] = k([
  [100.00, 100.96, 99.08, 100.53], [100.53, 100.96, 99.83, 100.28], [100.28, 100.46, 100.14, 100.39], [100.39, 100.89, 100.11, 100.34], [100.34, 100.47, 99.74, 99.86],
  [99.86, 99.97, 99.53, 99.87], [99.87, 100.11, 99.33, 99.49], [99.49, 100.11, 99.01, 99.91], [99.91, 100.81, 99.72, 100.54], [100.54, 100.97, 100.28, 100.44],
  [100.44, 100.52, 99.22, 99.92], [99.92, 100.33, 99.77, 100.11], [100.11, 100.47, 99.80, 100.38], [100.38, 100.63, 99.64, 100.58], [100.58, 101.69, 99.97, 101.01],
  [101.01, 102.39, 100.65, 101.82], [101.82, 101.87, 101.04, 101.27], [101.27, 101.95, 101.15, 101.59], [101.59, 101.69, 100.75, 101.15], [101.15, 101.50, 100.56, 101.07],
  [101.07, 101.61, 100.80, 100.86], [100.86, 101.30, 100.68, 100.83], [100.83, 101.57, 100.32, 101.43], [101.43, 101.52, 100.80, 101.01], [101.01, 101.09, 100.36, 100.75],
  [100.75, 101.25, 100.68, 101.20], [101.20, 101.36, 101.13, 101.20], [101.20, 103.07, 100.88, 102.11], [102.11, 102.52, 101.79, 102.16], [102.16, 102.44, 100.81, 100.88],
  [100.88, 101.25, 100.74, 100.95], [100.95, 101.88, 100.75, 101.65], [101.65, 101.77, 100.89, 101.41], [101.41, 101.93, 101.27, 101.67], [101.67, 102.15, 101.15, 101.21],
  [101.21, 101.63, 101.07, 101.49], [101.49, 102.11, 100.56, 101.98], [101.98, 102.62, 101.32, 101.53], [101.53, 101.70, 100.70, 101.44], [101.44, 101.78, 101.27, 101.45],
  [101.45, 102.36, 101.22, 101.93], [101.93, 102.68, 101.39, 102.51], [102.51, 102.95, 101.30, 102.28], [102.28, 102.97, 102.07, 102.65], [102.65, 102.86, 102.07, 102.17],
  [102.17, 102.39, 101.74, 102.01], [102.01, 102.68, 101.69, 102.23], [102.23, 103.07, 102.18, 102.72], [102.72, 103.13, 102.52, 102.70], [102.70, 103.11, 102.23, 103.00],
  [103.00, 103.42, 102.55, 102.94], [102.94, 103.12, 102.07, 102.62], [102.62, 103.34, 102.41, 103.28], [103.28, 104.00, 102.20, 103.56], [103.56, 103.96, 103.30, 103.67],
  [103.67, 104.53, 103.36, 104.32], [104.32, 104.70, 104.08, 104.53], [104.53, 105.26, 104.32, 104.90], [104.90, 105.59, 104.07, 105.00], [105.00, 106.08, 104.80, 105.87],
  [105.87, 106.18, 105.73, 106.03], [106.03, 107.14, 104.56, 105.55], [105.55, 105.74, 104.70, 105.61], [105.61, 106.07, 105.17, 105.39], [105.39, 105.53, 104.81, 105.23],
  [105.23, 106.60, 104.70, 106.09], [106.09, 106.62, 105.95, 106.07], [106.07, 107.38, 105.56, 106.73], [106.73, 107.59, 106.60, 106.88], [106.88, 107.28, 106.29, 106.71],
  [106.71, 106.88, 106.39, 106.78], [106.78, 107.18, 105.87, 106.91], [106.91, 107.47, 106.66, 107.20], [107.20, 108.18, 107.05, 107.83], [107.83, 108.39, 106.81, 108.20],
  [108.20, 109.29, 107.73, 107.91], [107.91, 108.22, 107.16, 107.51], [107.51, 107.73, 107.45, 107.66], [107.66, 107.99, 107.48, 107.93], [107.93, 109.16, 107.71, 108.92],
  [108.92, 109.34, 108.58, 108.78], [108.78, 108.89, 108.20, 108.38], [108.38, 109.07, 107.79, 108.87], [108.87, 109.77, 108.49, 109.50], [109.50, 109.61, 108.47, 109.18],
  [109.18, 110.00, 108.78, 109.67], [109.67, 109.99, 109.31, 109.59], [109.59, 109.83, 109.14, 109.19], [109.19, 109.38, 108.80, 108.87], [108.87, 109.80, 108.70, 109.30],
  [109.30, 109.61, 108.51, 109.03], [109.03, 109.60, 108.65, 108.72], [108.72, 108.92, 107.55, 107.94], [107.94, 108.13, 107.41, 107.76], [107.76, 107.81, 106.81, 107.26],
  [107.26, 107.54, 107.07, 107.34], [107.34, 107.56, 106.72, 107.07], [107.07, 107.21, 106.26, 106.51], [106.51, 107.21, 105.73, 106.60], [106.60, 106.79, 105.44, 105.86],
  [105.86, 106.08, 105.76, 105.98], [105.98, 106.62, 105.48, 106.37], [106.37, 106.84, 105.78, 106.72], [106.72, 107.09, 105.26, 105.87], [105.87, 106.09, 105.41, 105.80],
  [105.80, 106.55, 105.51, 105.93], [105.93, 106.80, 105.55, 106.31], [106.31, 106.37, 105.91, 106.15], [106.15, 106.33, 106.01, 106.08], [106.08, 106.37, 104.98, 105.43],
  [105.43, 105.96, 104.27, 104.99], [104.99, 105.16, 104.40, 104.96], [104.96, 105.39, 104.71, 104.94], [104.94, 105.27, 103.43, 103.85], [103.85, 103.96, 103.57, 103.67],
  [103.67, 103.83, 102.96, 103.45], [103.45, 103.53, 102.72, 102.91], [102.91, 103.69, 102.49, 103.46], [103.46, 103.66, 103.30, 103.61], [103.61, 104.03, 102.48, 102.98],
  [102.98, 103.52, 102.58, 102.68], [102.68, 102.87, 102.26, 102.39], [102.39, 102.44, 101.44, 101.80], [101.80, 101.85, 101.59, 101.77], [101.77, 102.07, 101.36, 101.67],
  [101.67, 102.23, 101.05, 101.44], [101.44, 102.17, 100.65, 101.14], [101.14, 101.22, 100.44, 100.62], [100.62, 101.02, 100.27, 100.63], [100.63, 100.72, 100.10, 100.45],
]);
/** L07 Try, Range: scenario-gen { seed: 7351, start: 100, segments: [{ kind: "range", bars: 130, halfWidth: 0.02, vol: 0.006 }] }. First 50 are warm-up. */
const L07_RANGE: CandleData[] = k([
  [100.00, 100.27, 99.80, 100.13], [100.13, 100.80, 99.96, 100.57], [100.57, 100.72, 99.62, 99.75], [99.75, 101.00, 99.33, 100.57], [100.57, 100.79, 99.86, 100.16],
  [100.16, 100.43, 99.56, 99.72], [99.72, 99.99, 98.99, 99.05], [99.05, 99.34, 98.60, 98.97], [98.97, 99.78, 98.80, 99.49], [99.49, 101.19, 99.41, 100.84],
  [100.84, 101.45, 98.61, 99.19], [99.19, 100.03, 99.04, 99.74], [99.74, 100.19, 98.41, 98.73], [98.73, 99.79, 98.53, 99.59], [99.59, 99.82, 99.04, 99.65],
  [99.65, 100.43, 99.24, 99.67], [99.67, 100.78, 99.21, 100.67], [100.67, 101.14, 100.07, 100.53], [100.53, 101.21, 100.18, 100.27], [100.27, 100.40, 98.50, 99.22],
  [99.22, 100.12, 99.16, 100.06], [100.06, 100.43, 99.38, 99.82], [99.82, 101.57, 99.67, 100.92], [100.92, 101.61, 100.40, 101.42], [101.42, 101.77, 99.20, 99.47],
  [99.47, 99.94, 98.49, 99.37], [99.37, 100.57, 98.50, 99.57], [99.57, 100.73, 98.28, 100.45], [100.45, 100.57, 99.29, 100.01], [100.01, 100.92, 99.67, 100.44],
  [100.44, 101.76, 99.65, 101.14], [101.14, 102.44, 100.92, 101.58], [101.58, 102.50, 99.84, 100.11], [100.11, 100.52, 99.26, 99.50], [99.50, 99.95, 98.95, 99.62],
  [99.62, 100.47, 98.26, 100.21], [100.21, 100.85, 99.99, 100.48], [100.48, 100.61, 99.64, 100.31], [100.31, 101.06, 99.92, 100.01], [100.01, 101.31, 99.07, 100.95],
  [100.95, 101.20, 99.82, 99.89], [99.89, 100.25, 99.80, 100.16], [100.16, 100.25, 99.04, 99.39], [99.39, 99.86, 99.10, 99.77], [99.77, 100.86, 98.94, 99.85],
  [99.85, 100.13, 99.23, 99.88], [99.88, 100.31, 99.52, 99.78], [99.78, 100.70, 98.89, 100.61], [100.61, 101.04, 99.46, 99.56], [99.56, 100.06, 99.25, 99.55],
  [99.55, 99.67, 99.22, 99.34], [99.34, 99.84, 98.78, 98.93], [98.93, 99.98, 97.97, 99.66], [99.66, 100.76, 99.08, 100.47], [100.47, 101.15, 100.30, 100.97],
  [100.97, 102.09, 100.87, 101.86], [101.86, 102.01, 101.38, 101.50], [101.50, 101.81, 100.61, 101.13], [101.13, 101.57, 100.88, 100.99], [100.99, 101.09, 99.67, 100.24],
  [100.24, 100.74, 98.60, 99.37], [99.37, 99.78, 97.82, 98.61], [98.61, 101.20, 98.18, 100.09], [100.09, 100.85, 99.36, 99.71], [99.71, 99.96, 99.47, 99.89],
  [99.89, 100.44, 99.16, 100.06], [100.06, 101.86, 99.97, 101.78], [101.78, 101.87, 101.24, 101.46], [101.46, 102.25, 100.07, 100.91], [100.91, 101.34, 100.44, 101.17],
  [101.17, 101.48, 99.74, 100.05], [100.05, 100.33, 98.97, 99.83], [99.83, 100.13, 98.55, 99.19], [99.19, 99.72, 99.00, 99.42], [99.42, 99.72, 98.82, 99.39],
  [99.39, 100.03, 98.78, 99.04], [99.04, 99.43, 98.88, 99.18], [99.18, 99.41, 98.36, 99.29], [99.29, 99.89, 98.89, 99.60], [99.60, 100.11, 98.52, 98.71],
  [98.71, 99.42, 98.49, 99.15], [99.15, 99.80, 98.99, 99.15], [99.15, 99.58, 98.29, 99.52], [99.52, 99.92, 98.96, 99.25], [99.25, 100.53, 98.55, 99.99],
  [99.99, 101.33, 99.47, 100.83], [100.83, 101.23, 100.67, 100.96], [100.96, 101.07, 100.37, 100.66], [100.66, 101.36, 99.74, 100.88], [100.88, 100.95, 99.86, 100.13],
  [100.13, 100.94, 99.89, 100.20], [100.20, 100.76, 99.51, 100.09], [100.09, 100.47, 99.96, 100.03], [100.03, 101.48, 99.82, 100.80], [100.80, 101.07, 99.12, 99.50],
  [99.50, 100.72, 99.20, 100.64], [100.64, 100.86, 99.66, 99.94], [99.94, 100.46, 99.82, 100.01], [100.01, 100.41, 99.58, 100.33], [100.33, 101.15, 100.05, 100.73],
  [100.73, 102.06, 100.09, 101.59], [101.59, 102.03, 100.34, 101.12], [101.12, 101.37, 100.08, 100.31], [100.31, 101.21, 100.13, 100.97], [100.97, 102.03, 100.12, 100.30],
  [100.30, 101.05, 99.96, 100.63], [100.63, 101.30, 99.30, 99.72], [99.72, 100.09, 99.29, 99.53], [99.53, 100.92, 98.38, 100.74], [100.74, 101.04, 100.44, 100.70],
  [100.70, 100.87, 100.37, 100.60], [100.60, 101.33, 99.91, 100.81], [100.81, 100.90, 99.62, 100.03], [100.03, 100.55, 99.43, 99.72], [99.72, 100.08, 99.32, 99.42],
  [99.42, 100.21, 99.27, 99.48], [99.48, 101.46, 99.26, 100.72], [100.72, 101.01, 99.61, 99.74], [99.74, 99.87, 99.38, 99.64], [99.64, 100.26, 98.71, 99.90],
  [99.90, 100.10, 99.30, 99.98], [99.98, 100.60, 98.84, 99.40], [99.40, 99.63, 98.90, 99.46], [99.46, 100.35, 99.18, 99.78], [99.78, 100.15, 99.70, 100.03],
  [100.03, 100.67, 99.44, 100.13], [100.13, 100.72, 99.98, 100.44], [100.44, 100.97, 99.86, 99.98], [99.98, 100.07, 98.74, 98.89], [98.89, 100.44, 97.95, 99.57],
]);

// ─── Widget data (the task specs can't carry it; the widgets import it) ─────

/** The four reasons from M02, used as the evidence options of trend-classifier. */
export const L05_EVIDENCE: { id: "hh_hl" | "lh_ll" | "bounded" | "overlap"; label: string }[] = [
  { id: "hh_hl", label: "Higher highs and higher lows" },
  { id: "lh_ll", label: "Lower highs and lower lows" },
  { id: "bounded", label: "Price keeps bouncing between two levels" },
  { id: "overlap", label: "Candles overlap with no direction" },
];

/**
 * L05 Try (trend-classifier): three 30-candle stretches, each drawn on its own scale, in order A, B, C.
 * A: 104.00 → 99.24; highs 104.16 (c1), 103.01 (c11), 101.82 (c22); lows 101.31 (c8), 100.29 (c17), 99.17 (c27).
 * B: 100.00 → 100.20, closes 99.26–101.08; swing highs 101.20, 101.71, 101.22, 102.01; swing lows 98.93, 99.36, 98.16, 99.87, 99.38.
 * C: 98.76–100.96; turns down 100.81 (c8), 100.96 (c11), 100.75 (c14), 100.79 (c27); up 98.76 (c5), 98.80 (c17), 98.76 (c23).
 *    The swing rule also finds a lower high 100.25 (c21) and a higher low 99.73 (c12) inside the range.
 * `showMe` holds the layers "Show me" adds to that segment, on top of the swing markers.
 */
export const L05_SEGMENTS: {
  id: "A" | "B" | "C";
  label: "trend" | "range" | "noise";
  evidence: "hh_hl" | "lh_ll" | "bounded" | "overlap";
  candles: CandleData[];
  showMe?: ChartLayer[];
}[] = [
  { id: "A", label: "trend", evidence: "lh_ll", candles: SEG_A },
  { id: "B", label: "noise", evidence: "overlap", candles: SEG_B },
  {
    id: "C",
    label: "range",
    evidence: "bounded",
    candles: SEG_C,
    showMe: [
      { kind: "zone", from: 100.75, to: 100.96, role: "resistance" },
      { kind: "zone", from: 98.76, to: 98.9, role: "support" },
    ],
  },
];

/**
 * L06 Try (level-drawer). Candle numbers are 1-based, as in the script.
 * c1–c38 are visible at the start (range 101.75–104.41; swing highs 104.19 c8, 103.81 c13, 103.57 c17,
 * 104.22 c22, 104.38 c25, 104.41 c33). c39 is the breakout (o 104.01, h 105.02, l 103.91, c 104.86).
 * Band 104.19–104.41 gives 4 touches, 0 tests, 0 breaks.
 * FAIL: c41 is the first close under the zone (103.81); a stop at 104.00 fills on c41 at 104.00.
 * HOLD: lowest low after the break 104.21, lowest close 104.44; no valid stop (max 104.12) is touched.
 */
export const L06_LEVEL_DRAWER = {
  base: L06_TASK_BASE,
  endings: { fail: L06_TASK_FAIL, hold: L06_TASK_HOLD },
  /** Play shows FAIL first, then "Other ending" shows HOLD. */
  order: ["fail", "hold"] as ("fail" | "hold")[],
  visibleTo: 38,
  breakIndex: 39,
  endIndex: 51,
  /** Close of c39 + 0.05 (the ask). */
  entry: 104.91,
  stopStart: 104.6,
  /** Band height the control allows; success asks for 0.10–0.50. */
  bandLimits: { minHeight: 0.05, maxHeight: 1.5 },
  /** Part 2 of the task: bandLow − 0.80 ≤ stop ≤ bandLow − 0.10. The contract can't express this; the widget checks it and only then moves to phase 3. */
  stopRule: { minBelowBand: 0.1, maxBelowBand: 0.8 },
  /** "Show me": the band, then the stop, then Play on this ending. */
  showMeEnding: "fail" as "fail" | "hold",
  /**
   * Copy the task spec has no slot for. {risk} = entry − stop; {total} = risk + 0.05% × entry + 0.05% × stop;
   * {k} and {close} = the first candle that closes back under bandLow, and its close.
   */
  messages: {
    bandCorrect: "{touches} touches between {bandLow:2} and {bandHigh:2}. That's a zone, not a line.",
    stopCorrect: "Stop at {stop:2}: if price closes back inside, you're out. Risk {risk:2} per unit, about {total:2} with commission.",
    stopTooClose: "At {stop:2} the stop sits in or right under your zone. A retest of the zone could hit it while the breakout is still fine.",
    stopTooFar: "At {stop:2} the risk is {risk:2} per unit. The breakout idea is already wrong once price is back inside the range.",
    playFail: "The break failed: candle {k} closed at {close:2}, back inside. Your stop at {stop:2} filled: {risk:2} per unit, about {total:2} with commission. A planned loss.",
    playHold: "The break held: no close fell back below your zone, and dips into it turned back up. Old resistance acted as support.",
    playBoth: "Same history, same candle 39, two endings. Your plan was the same in both.",
  },
};

/**
 * L07 Try (ma-period). Both series have 50 warm-up candles (hidden, used only for the MA) and 80 visible.
 * Trend: closes 102.94 (c1) → 109.67 (c36, high 110.00, the price peak) → 100.45 (c80, low 100.10).
 * Range: 97.82–102.25.
 * `expected` is the table the widget's unit test must reproduce: [crossings, falseSignals, lag].
 * Success holds for periods 13–21. Range: fewest false signals is 7, at periods 27–29.
 */
export const L07_SERIES = {
  warmup: 50,
  trend: L07_TREND,
  range: L07_RANGE,
  /** 1-based visible candle of the highest close in Trend. */
  trendPeak: 36,
  expected: {
    trend: { 5: [13, 7, 2], 10: [7, 4, 6], 12: [3, 2, 5], 13: [1, 0, 6], 15: [1, 0, 7], 20: [1, 0, 7], 21: [1, 0, 8], 22: [1, 0, 9], 30: [1, 0, 11], 50: [1, 0, 23] } as Record<number, [number, number, number]>,
    range: { 5: [24, 20], 15: [20, 14], 20: [20, 14], 29: [14, 7], 50: [18, 11] } as Record<number, [number, number]>,
  },
  /** Shown after success, as an invitation; {falseSignals} is the Range value at the learner's period. */
  invite: "Now switch to Range. At period {period} you get {falseSignals} false signals: in a range, no period fixes this.",
};

// ─── Shared layers ──────────────────────────────────────────────────────────

const L06_RESISTANCE: ChartLayer = { kind: "zone", from: 101.85, to: 102.1, role: "resistance", label: "Resistance" };
const L06_SUPPORT: ChartLayer = { kind: "zone", from: 97.9, to: 98.1, role: "support", label: "Support" };
const L06_TRADE: ChartLayer[] = [
  L06_RESISTANCE,
  { kind: "level", price: 102.65, role: "entry", label: "Entry", chip: true },
  { kind: "level", price: 101.7, role: "stop", label: "Stop", chip: true },
];
const L06_WRONG_CANDLE = "That candle stayed inside the zone. Look for a wick above 102.10 with a close back below it.";
const L07_SMA_SO_FAR: ChartLayer = { kind: "line", values: L07_DROP_SMA10.map((v, i) => (i < 21 ? v : null)), role: "concept", label: "SMA 10" };
const L07_SMA_ALL: ChartLayer = { kind: "line", values: L07_DROP_SMA10, role: "concept", label: "SMA 10" };
const L05_WRONG_DIRECTION = "Check the direction: higher highs and lows climb, lower ones fall.";
const L05_RIGHT_LABEL = "The label is right. Pick the evidence you can actually see on this chart.";
const L06_ADD_BOTH = "Add both parts: the price distance, 0.95, and the commission, about 0.10.";
const L07_ADD_FIVE = "Add the five newest closes: 101.00 + 102.00 + 103.00 + 104.00 + 110.00 = 520.00. Then divide by 5.";
const L07_DESCRIBES = "This one only describes the past, which is exactly what an average does.";

// ─── Scripts ────────────────────────────────────────────────────────────────

/** Interactive scripts for unit U2 lessons (docs/learn). Filled in from the lesson scripts. */
export const SCRIPTS_U2: Record<string, LessonScript> = {
  L05: {
    unit: "1.5",
    courseId: "1.5.2",
    bridge: "In 1.5.1 you marked swing highs and lows with one fixed rule. Here those swings name the market: a trend, a range or noise. The candles you learned to read in 1.2.1 are the raw material; the swings give them a shape.",
    hook: {
      prompt: "Three green 1-hour candles in a row on LABX, each closing higher. What is the market doing?",
      figure: { kind: "chart", chart: { candles: L05_ZOOM.slice(21) }, steps: [{ text: "Closes: 99.40, 100.18 and 100.30." }] },
      // No single graded answer: "Can't tell yet" is the honest read; B5 zooms out.
      control: {
        kind: "choice",
        choices: [
          { id: "up", label: "Trending up" },
          { id: "range", label: "Ranging" },
          { id: "noise", label: "Just noise" },
          { id: "unclear", label: "Can't tell yet" },
        ],
      },
      compare: "You picked {yours}. Three candles can't show a structure. Zoomed out to 24, they were noise.",
      concept: "trend",
    },
    learn: [
      // B1 + B2: the three mini-charts of trend-range-noise, one beat each, so each keeps its own scale and layers.
      {
        kind: "explain",
        text: "Before asking whether to trade, ask what kind of market you're looking at. Sort it into one of three boxes: [[trend]], [[range]] or noise. The labels describe what has happened so far, not what happens next. The same chart can move from one box to another.",
        figure: {
          kind: "chart",
          chart: { candles: L05_TREND_PANEL },
          steps: [
            {
              text: "An uptrend: each swing high and each swing low is higher than the one before.",
              layers: [mark(1, "low", "98.00"), mark(4, "high", "99.80"), mark(6, "low", "99.20"), mark(9, "high", "101.00"), mark(12, "low", "100.30"), mark(15, "high", "102.60")],
            },
          ],
        },
      },
      {
        kind: "figure",
        figure: {
          kind: "chart",
          chart: { candles: L05_RANGE_PANEL },
          steps: [
            {
              text: "A range: price keeps turning near the same floor and ceiling. New highs or lows don't last.",
              layers: [
                { kind: "zone", from: 99.9, to: 100.05, role: "resistance", label: "Resistance" },
                { kind: "zone", from: 97.95, to: 98.1, role: "support", label: "Support" },
              ],
            },
          ],
        },
      },
      {
        kind: "figure",
        figure: { kind: "chart", chart: { candles: L05_NOISE_PANEL }, steps: [{ text: "Noise: overlapping back-and-forth moves with no clear swings." }] },
      },
      {
        kind: "explain",
        text: "A **swing high** is a peak with lower highs on either side. A **swing low** is a trough with higher lows on either side. An uptrend makes higher swing highs and higher swing lows. A downtrend makes lower highs and lower lows. The trend is intact while that pattern holds.",
        figure: {
          kind: "chart",
          chart: { candles: L05_PULLBACK.slice(0, 20) },
          steps: [
            { text: "Swing highs: 102.00, 103.50, 105.00. Each is higher than the last.", layers: [mark(5, "high", "HH"), mark(11, "high", "HH"), mark(17, "high", "HH")] },
            { text: "Swing lows: 100.00, 101.20, 102.40. Each is higher than the last.", layers: [mark(2, "low", "HL"), mark(8, "low", "HL"), mark(14, "low", "HL")] },
          ],
        },
      },
      // B4: the learner places a neutral level (start 104.00, snap 0.01); the tap zones are the answer bands.
      {
        kind: "predict",
        title: "Is this still an uptrend?",
        prompt: "Price is in a [[pullback]] from 105.00. Drag the line to the lowest level this pullback can reach while the uptrend stays intact.",
        control: {
          kind: "tap",
          chart: { candles: L05_PULLBACK, visible: 20 },
          zones: [
            { id: "deep", label: "Below 102.30", from: 90, to: 102.29, feedback: "Below 102.40 the higher-low pattern breaks. The low that counts is the last one, 102.40." },
            { id: "last-low", label: "102.30 to 102.60", from: 102.3, to: 102.6, feedback: "Right. The last swing low is 102.40. Each new low has to stay above it." },
            { id: "shallow", label: "Above 102.60", from: 102.61, to: 110, feedback: "A pullback can go deeper than that and keep the trend. Only a low under 102.40 breaks the pattern." },
          ],
          answer: "last-low",
        },
        figure: {
          kind: "chart",
          chart: { candles: L05_PULLBACK, visible: 20 },
          steps: [
            {
              text: "The pullback bottoms at 101.00 on candle 24, under 102.40.",
              visible: 26,
              layers: [{ kind: "level", price: 102.4, role: "concept", label: "Last swing low", chip: true }, mark(23, "low", "101.00")],
            },
            {
              text: "The higher-low pattern is broken. The uptrend is in question, though not necessarily reversed.",
              layers: [mark(2, "low", "HL"), mark(8, "low", "HL"), mark(14, "low", "HL"), mark(23, "low", "LL")],
            },
          ],
        },
        reveal: "Up to 102.40 the swings described an uptrend. The lower low at 101.00 breaks the pattern. One lower low doesn't make a downtrend: a [[reversal]] would also need lower highs.",
        concept: "trend",
      },
      {
        kind: "figure",
        title: "Zoom out",
        figure: {
          kind: "chart",
          chart: { candles: L05_ZOOM },
          steps: [
            {
              text: "Back to the three green candles from the start: closes 99.40, 100.18 and 100.30.",
              layers: [mark(21, "close", "99.40", "accent"), mark(22, "close", "100.18", "accent"), mark(23, "close", "100.30", "accent")],
            },
            {
              text: "Zoom out to 24 candles. Highs: 101.72, 102.44, 101.95. Lows: 99.38, 99.81, 98.62.",
              layers: [mark(2, "high", "101.72"), mark(5, "high", "102.44"), mark(9, "high", "101.95"), mark(8, "low", "99.38"), mark(12, "low", "99.81"), mark(18, "low", "98.62")],
            },
            { text: "The swings don't line up into a trend or a range. Those three candles were noise." },
            { text: "On [[timeframe|1-hour candles]], two or three candles one way are often noise. Unclear is information too." },
          ],
        },
      },
      {
        kind: "match",
        prompt: "Match each piece of evidence to the market it describes.",
        pairs: [
          { left: "Higher highs and higher lows", right: "Uptrend", wrong: L05_WRONG_DIRECTION },
          { left: "Lower highs and lower lows", right: "Downtrend", wrong: L05_WRONG_DIRECTION },
          { left: "Price keeps bouncing between two levels", right: "Range", wrong: "Repeated turns at the same levels are edges. Noise has none." },
          { left: "Candles overlap with no direction", right: "Noise", wrong: "A range has edges it keeps returning to. Overlap alone isn't an edge." },
        ],
        concept: "range",
      },
      {
        kind: "callout",
        tone: "key",
        text: "An idea built for a trend, such as buying a pullback, relies on structure a range doesn't have, and the reverse is also true. Noise has no structure to rely on, only costs to pay. Name the market before you trade it. If you can't, staying out is a valid decision.",
      },
    ],
    task: {
      widget: "trend-classifier",
      data: { segments: L05_SEGMENTS, evidence: L05_EVIDENCE },
      goal: "Label each stretch as trend, range or noise. Then pick the evidence that decided it.",
      start: { labelA: "", evidenceA: "", labelB: "", evidenceB: "", labelC: "", evidenceC: "" },
      success: {
        all: [
          { field: "labelA", eq: "trend" },
          { field: "evidenceA", eq: "lh_ll" },
          { field: "labelB", eq: "noise" },
          { field: "evidenceB", eq: "overlap" },
          { field: "labelC", eq: "range" },
          { field: "evidenceC", eq: "bounded" },
        ],
      },
      // Each case names one segment's fields only, so the widget can show one message per segment.
      feedback: [
        { when: { field: "labelA", eq: "range" }, text: "A's highs keep falling: 104.16, 103.01, 101.82. A range would turn at the same levels." },
        { when: { field: "labelA", eq: "noise" }, text: "A has clear swings, each lower than the last. That's structure: a downtrend." },
        { when: { all: [{ field: "labelA", eq: "trend" }, { field: "evidenceA", eq: "hh_hl" }] }, text: "Trend is right. Check the direction: each high and each low is lower than the last." },
        { when: { all: [{ field: "labelA", eq: "trend" }, { field: "evidenceA", ne: "lh_ll" }] }, text: L05_RIGHT_LABEL },
        { when: { field: "labelB", eq: "range" }, text: "B's turns land at different prices: highs from 101.20 to 102.01, lows from 98.16 to 99.87. No edges." },
        { when: { field: "labelB", eq: "trend" }, text: "B ends close to where it started, 100.00 to 100.20. Its swings don't step up or down." },
        { when: { all: [{ field: "labelB", eq: "noise" }, { field: "evidenceB", ne: "overlap" }] }, text: L05_RIGHT_LABEL },
        { when: { field: "labelC", eq: "noise" }, text: "C has edges: it turned down near 100.80 four times and up near 98.80 three times." },
        { when: { field: "labelC", eq: "trend" }, text: "C's highs and lows don't step one way. They keep returning to the same two levels." },
        { when: { all: [{ field: "labelC", eq: "range" }, { field: "evidenceC", ne: "bounded" }] }, text: L05_RIGHT_LABEL },
      ],
      correct: "All three read. A steps down, B goes nowhere, C keeps turning at the same two levels.",
      hints: [
        "Ignore single candles. Find the turning points and compare each with the one before.",
        "Swings are now marked. Do the highs step down, repeat at one level, or land anywhere?",
        "A's highs fall: 104.16, 103.01, 101.82. C turns near 100.80 and 98.80 again and again. B does neither.",
      ],
      showMe: { labelA: "trend", evidenceA: "lh_ll", labelB: "noise", evidenceB: "overlap", labelC: "range", evidenceC: "bounded" },
      concept: "trend",
    },
    check: ["q-ta-1", "q-ta-2", "q-ta-3"],
    recap: {
      takeaways: [
        "Uptrend: higher swing highs and higher swing lows. Downtrend: lower highs and lower lows.",
        "A range keeps turning near the same floor and ceiling. New highs or lows don't last.",
        "Noise has no clear swings. If you can't name the market, staying out is valid.",
      ],
      next: "Next, 1.5.3: pullbacks, the dips inside a trend, and how deep one can go while the trend still holds.",
    },
  },

  L06: {
    unit: "1.5",
    courseId: "1.5.4",
    bridge: "In 1.5.3 you measured pullbacks inside a trend; in 1.5.2 a range kept turning near the same floor and ceiling. Here you mark those as support and resistance zones, and plan a breakout with a 1.3.2 stop where the break would fail.",
    hook: {
      prompt: "LABX has moved sideways for 30 hours. Tap the price where it keeps turning down.",
      control: {
        kind: "tap",
        chart: { candles: L06_RANGE },
        // Not graded: the recap compares the tapped price with the zone.
        zones: [{ id: "ceiling", label: "Where rises turned down", from: 101.85, to: 102.1 }],
      },
      compare: "You tapped {yours}. LABX turned down between 101.85 and 102.10: a zone, not one price.",
      concept: "support-and-resistance",
    },
    learn: [
      {
        kind: "explain",
        text: "[[support|Support]] is a price area where falls have repeatedly stopped and turned up. [[resistance|Resistance]] is an area where rises have repeatedly stopped and turned down. They're zones, not exact lines: price might turn at 98.10 one time and 97.90 the next. The more clearly a level has been respected, the more traders notice it.",
      },
      // B2, with the lead text of B3 (a hotspot beat has no text of its own).
      {
        kind: "figure",
        figure: {
          kind: "chart",
          chart: { candles: L06_RANGE },
          steps: [
            { text: "Rises keep stalling near 102.00: candles 5, 12 and 20 turn down.", layers: [mark(4, "high", "101.95"), mark(11, "high", "102.10"), mark(19, "high", "101.85")] },
            { text: "Falls keep stalling near 98.00: candles 8, 16 and 23 turn up.", layers: [mark(7, "low", "98.10"), mark(15, "low", "97.90"), mark(22, "low", "98.05")] },
            { text: "No two turns match, so mark zones: 101.85–102.10 and 97.90–98.10.", layers: [L06_RESISTANCE, L06_SUPPORT] },
          ],
        },
        text: "Mark a level from at least two clear turns near the same price. Draw a band wide enough to cover them. Watch the [[close|closes]] as well as the [[wick|wicks]]: a wick that pokes through and closes back inside is a test, not a break.",
      },
      {
        kind: "hotspot",
        prompt: "Tap the candle that tested resistance without breaking it.",
        chart: { candles: L06_RANGE, layers: [L06_RESISTANCE, L06_SUPPORT] },
        zones: [
          { id: "c27", label: "Candle 27", index: 26 },
          { id: "c5", label: "Candle 5", index: 4, feedback: L06_WRONG_CANDLE },
          { id: "c12", label: "Candle 12", index: 11, feedback: L06_WRONG_CANDLE },
          { id: "c20", label: "Candle 20", index: 19, feedback: L06_WRONG_CANDLE },
        ],
        answer: "c27",
        correct: "Candle 27's wick reached 102.30, above the zone, but it closed at 101.80. A test, not a break.",
        concept: "support-and-resistance",
      },
      // B4, ending A. No single answer: the next beat shows ending B ("Show the other ending").
      {
        kind: "reveal",
        title: "Same start, two endings",
        prompt: "LABX ranged between 98.00 and 102.00. Candle 31 closed at 102.60. A buyer enters at the [[ask]], 102.65, with a [[stop-loss|stop]] at 101.70. Does the move hold?",
        chart: { candles: [...L06_RANGE, ...L06_C31, ...L06_ENDING_A], visible: 31, layers: L06_TRADE },
        choices: [
          { id: "holds", label: "It holds above 102.00" },
          { id: "falls", label: "It falls back inside" },
        ],
        after: "Ending A: closes at 102.90 and 103.40. Dips hold above 102.00: old resistance acts as support.",
        concept: "breakout",
      },
      // B4, ending B, with the feedback that is the same for both picks.
      {
        kind: "figure",
        title: "The other ending",
        figure: {
          kind: "chart",
          chart: { candles: [...L06_RANGE, ...L06_C31, ...L06_ENDING_B], visible: 31, layers: L06_TRADE },
          steps: [
            {
              text: "Ending B: the next candle falls to 101.30 and closes at 101.40. The stop fills at 101.70.",
              visible: 35,
              layers: [{ kind: "marker", index: 31, price: 101.7, label: "Stop filled", role: "down" }],
            },
          ],
        },
        text: "Both endings started from the same candle. At 102.60 your pick couldn't be checked. The stop could be planned.",
      },
      {
        kind: "explain",
        text: "Ending A was a [[breakout]]: price closed beyond the level and kept going. Ending B was a false breakout: price closed beyond the level, then fell back inside the range. At the moment of the break they looked the same. The difference only showed in the candles that followed.",
      },
      {
        kind: "worked",
        title: "What ending B cost",
        lines: [
          "Entry at the ask: 102.65. Stop: 101.70, back inside the range.",
          "Price loss per unit: 102.65 − 101.70 = 0.95.",
          "[[commission|Commission]] per unit: 0.05% × 102.65 + 0.05% × 101.70 ≈ 0.05 + 0.05 = 0.10.",
          "Total loss per unit at the stop = ?",
        ],
        // Exact: 0.95 + 0.051325 + 0.05085 = 1.052175.
        ask: {
          answer: 1.05,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 0.95, text: L06_ADD_BOTH },
            { value: 0.1, text: L06_ADD_BOTH },
          ],
          correct: "Right: 0.95 + 0.10 = 1.05 per unit, decided before entry.",
        },
        after: "At entry the two endings looked identical. The stop is what kept ending B a small, planned loss.",
        concept: "false-breakout",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Waiting for a close beyond the level filters out some false moves, at the cost of a later entry. Nothing filters out all of them. Before entering, decide where price would be if the breakout failed, your [[invalidation]], and put the stop there. Buying the instant price pokes through, with no exit ready, leaves you deciding under pressure.",
      },
    ],
    task: {
      widget: "level-drawer",
      data: {
        chart: { candles: L06_LEVEL_DRAWER.base, visible: L06_LEVEL_DRAWER.visibleTo },
        breakout: {
          endings: L06_LEVEL_DRAWER.endings,
          order: L06_LEVEL_DRAWER.order,
          breakIndex: L06_LEVEL_DRAWER.breakIndex - 1,
          entry: L06_LEVEL_DRAWER.entry,
          stopRule: L06_LEVEL_DRAWER.stopRule,
          showMeEnding: L06_LEVEL_DRAWER.showMeEnding,
          messages: L06_LEVEL_DRAWER.messages,
        },
      },
      goal: "Drag a resistance band over the turns where LABX keeps stalling. Then place a stop for a breakout buy and play the chart.",
      start: { role: "resistance", bandLow: 103.0, bandHigh: 103.3, stop: 104.6 },
      // Part 1 is the band. Part 2 (bandLow − 0.80 ≤ stop ≤ bandLow − 0.10, L06_LEVEL_DRAWER.stopRule) is relative to
      // the band, which conditions can't express: the widget checks it and only reaches phase 3 once the stop is
      // accepted. Playing the chart isn't required.
      success: {
        all: [
          { field: "role", eq: "resistance" },
          { field: "touches", gte: 3 },
          { field: "height", gte: 0.1, lte: 0.5 },
          { field: "phase", gte: 3 },
        ],
      },
      // Part 1 only; part 2 messages are in L06_LEVEL_DRAWER.messages.
      feedback: [
        { when: { all: [{ field: "role", eq: "support" }, { field: "touches", gte: 3 }] }, text: "That's a valid support zone. For this task, mark the ceiling the breakout will test." },
        { when: { field: "height", lt: 0.1 }, text: "A band thinner than 0.10 is a line. Widen it to cover the touches." },
        { when: { field: "height", gt: 0.5 }, text: "That band is {height:2} tall. It catches almost anything. Tighten it around the turns." },
        { when: { field: "touches", lt: 3 }, text: "Only {touches} turns sit inside your band. Move or widen it to cover the cluster of highs." },
      ],
      correct: "Stop at {stop:2}: if price closes back inside, you're out.",
      hints: [
        "Find where rises stalled. Several highs end near the same price.",
        "Four turns down sit between 104.19 and 104.41. Cover them with one band.",
        "If the breakout fails, price closes back below your band. Put the stop just under it, with a small buffer.",
      ],
      showMe: { role: "resistance", bandLow: 104.19, bandHigh: 104.41, stop: 104.0 },
      concept: "false-breakout",
    },
    check: ["q-ta-11", "q-ta-5", "q-ta-6"],
    recap: {
      takeaways: [
        "Mark support and resistance as zones, from at least two clear turns near the same price.",
        "A breakout and a false breakout look the same at the break. Later closes tell them apart.",
        "Before buying a breakout, put the stop where it would have failed: back inside the range.",
      ],
      next: "Next, 1.5.5: round numbers, where orders cluster, and why a stop belongs beyond the cluster.",
    },
  },

  L07: {
    unit: "2.3",
    courseId: "2.3.2",
    bridge: "In 2.3.1 you defined a trend by its swing highs and lows, as in unit 1.5. A moving average describes it another way: one line through recent closes. Here you calculate one by hand and test what it can and can't tell you.",
    hook: {
      prompt: "LABX closes at 100.00, 101.00, 102.00, 103.00 and 104.00. The next candle closes at 110.00. Guess the average of the last five closes.",
      figure: { kind: "chart", chart: { candles: L07_HOOK }, steps: [{ text: "Closes: 100.00, 101.00, 102.00, 103.00, 104.00, then 110.00." }] },
      control: { kind: "slider", min: 100, max: 110, step: 0.1, unit: "vUSD", start: 105, answer: 104 },
      compare: "You guessed {yours}. The five-close average was 104.00 with price at 110.00: the average trails.",
      concept: "moving-average",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[sma|simple moving average]] (SMA) is the average of the last N [[close|closes]], recalculated at every candle. A 20-period SMA on 1-hour candles averages the last 20 hours. When a new candle closes, the oldest close drops out and the newest joins. The line is smoother than price: it filters out some candle-to-candle noise.",
      },
      {
        kind: "worked",
        title: "A 5-period SMA by hand",
        lines: [
          "Closes: 100.00, 101.00, 102.00, 103.00, 104.00.",
          "SMA = (100.00 + 101.00 + 102.00 + 103.00 + 104.00) ÷ 5 = 510.00 ÷ 5 = 102.00.",
          "The next candle closes at 110.00. Drop 100.00, add 110.00.",
          "New SMA = (101.00 + 102.00 + 103.00 + 104.00 + 110.00) ÷ 5 = ?",
        ],
        ask: {
          answer: 104,
          tolerance: 0,
          unit: "vUSD",
          feedback: [
            { value: 103.33, text: "That averages six closes. A 5-period SMA drops the oldest, 100.00." },
            { value: 102, text: L07_ADD_FIVE },
            { value: 520, text: L07_ADD_FIVE },
          ],
          correct: "Right: 520.00 ÷ 5 = 104.00. Price is at 110.00; the average trails.",
        },
        after: "Price is at 110.00, but the average is only 104.00. The average always trails behind price.",
        concept: "moving-average",
      },
      // B3 before the prediction: the veil covers c22–c40.
      {
        kind: "figure",
        figure: {
          kind: "chart",
          chart: { candles: L07_DROP, visible: 21 },
          steps: [
            { text: "Price falls for 19 candles to a 97.90 close, then turns up.", layers: [mark(18, "close", "97.90")] },
            {
              text: "The 10-period SMA follows, smoother. At candle 21 it is still falling, at 98.65.",
              layers: [L07_SMA_SO_FAR, { kind: "marker", index: 20, price: 98.65, label: "98.65", role: "concept" }],
            },
          ],
        },
      },
      // B3 prediction and reveal: the figure's first step lifts the veil.
      {
        kind: "predict",
        prompt: "Price made its lowest close two candles ago. When will the 10-period average make its low?",
        control: {
          kind: "choice",
          choices: [
            { id: "already", label: "It already has", feedback: "It's still falling. Each new close replaces an older, higher one, so the average keeps dropping." },
            { id: "next", label: "On the next candle", feedback: "Not yet. For three more candles, each new close replaces an older, higher one." },
            { id: "later", label: "Three or more candles from now", feedback: "Right. It bottoms on candle 24: three candles from here, five after price." },
          ],
          answer: "later",
        },
        figure: {
          kind: "chart",
          chart: { candles: L07_DROP, visible: 21, layers: [L07_SMA_SO_FAR, mark(18, "close", "97.90")] },
          steps: [
            {
              text: "The average bottoms at 98.55 on candle 24: five candles after price did.",
              visible: 40,
              layers: [L07_SMA_ALL, { kind: "marker", index: 23, price: 98.55, label: "98.55", role: "concept" }],
            },
            {
              text: "By candle 40 price is at 104.12. The average, at 102.32, still trails.",
              layers: [mark(39, "close", "104.12", "accent"), { kind: "marker", index: 39, price: 102.32, label: "102.32", role: "concept" }],
            },
          ],
        },
        concept: "moving-average",
      },
      {
        kind: "explain",
        text: "A [[moving-average|moving average]] turns only after price has turned, because it averages the past. A longer period gives a smoother line and more lag. A shorter one reacts faster but follows more of the noise. No setting removes this trade-off. An [[ema|exponential moving average]] weights recent closes more, so it reacts sooner, but still lags.",
      },
      {
        kind: "match",
        prompt: "Sort each statement: can a moving average do this?",
        // A two-column sort: the columns are the targets, and each takes two statements.
        columns: ["It can", "It can't"],
        pairs: [
          { left: "Describe direction: price mostly above a rising average fits an uptrend", right: "It can", wrong: L07_DESCRIBES },
          { left: "Show how far price has moved from its recent average", right: "It can", wrong: L07_DESCRIBES },
          { left: "Predict a turn before price makes it", right: "It can't", wrong: "By the time the line turns, much of the move may be over." },
          { left: "Give meaningful crossings in a range", right: "It can't", wrong: "In a range, price crosses the average again and again, so each crossing means little." },
        ],
        concept: "moving-average",
      },
      {
        kind: "explain",
        text: "Crossover rules turn the average into a signal: buy when price crosses above it, sell when it crosses below. In a steady trend the signals arrive late. In a range they arrive often and reverse quickly, and every one of those trades pays the [[spread]] and [[commission]].",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A moving average summarises where price has been. Use it as one description of the trend, alongside swing highs and lows, not as a rule that makes decisions for you.",
      },
    ],
    task: {
      widget: "ma-period",
      data: { series: { trend: L07_SERIES.trend, range: L07_SERIES.range }, warmup: L07_SERIES.warmup },
      goal: "Find a period with at most 1 false signal that still turns within 8 candles of the top.",
      start: { period: 5, market: "trend" },
      // On this data: periods 13–21 (L07_SERIES.expected).
      success: {
        all: [
          { field: "market", eq: "trend" },
          { field: "falseSignals", lte: 1 },
          { field: "lag", lte: 8 },
        ],
      },
      feedback: [
        { when: { field: "market", eq: "range" }, text: "The goal is set on the Trend chart. Switch back to Trend, then check." },
        { when: { field: "falseSignals", gt: 1 }, text: "Period {period} follows the noise: {falseSignals} crossings reversed within 5 candles. Try a longer period." },
        { when: { field: "lag", gt: 8 }, text: "Period {period} is smooth but late: it topped {lag} candles after price. Try a shorter one." },
      ],
      correct: "Period {period}: {falseSignals} false signals, and it topped {lag} candles after price. You chose where to sit on the trade-off; nothing removes it.",
      hints: [
        "Short periods turn fast but cross price often. Long ones cross rarely but turn late.",
        "Slide slowly from 5 and watch both numbers: false signals fall, lag rises.",
        "Try periods between 13 and 21.",
      ],
      showMe: { period: 15, market: "trend" },
      concept: "moving-average",
    },
    check: ["q-ta-7", "q-ta-8", "q-ta-9"],
    recap: {
      takeaways: [
        "An SMA adds the last N closes and divides by N. Each new close replaces the oldest.",
        "An average turns after price. Longer periods: smoother, more lag. Shorter: faster, noisier.",
        "Use a moving average to describe the trend, beside swings. It doesn't forecast turns.",
      ],
      next: "Next, 2.3.3: EMA and WMA, averages that react faster than the SMA, and the whipsaws that speed brings.",
    },
  },
};

/** Glossary terms these lessons introduce that the glossary didn't have. */
export const TERMS_U2: GlossaryTerm[] = [];
/** Concepts these lessons introduce that the concept library didn't have. */
export const CONCEPTS_U2: Concept[] = [];
