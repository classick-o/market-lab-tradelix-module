import type { CandleData, ChartLayer, Concept, GlossaryTerm, LevelRole, Lesson, Question, TaskData, UnitContent } from "../../types";

/** Unit 2.8 · Strategies by market regime (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */

type Cards = NonNullable<TaskData["cards"]>;
type Options = NonNullable<TaskData["options"]>;
type PathLayer = Extract<ChartLayer, { kind: "path" }>;

/** One candle, in price units with 2 decimals; `kv` adds the volume. */
const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });
const kv = (o: number, h: number, l: number, c: number, v: number): CandleData => ({ o, h, l, c, v });
const level = (price: number, role: LevelRole, label: string): ChartLayer => ({ kind: "level", price, role, label });
const line = (values: (number | null)[], role: "accent" | "concept" | "up" | "down" | "neutral", label: string, dashed?: boolean): ChartLayer => ({ kind: "line", values, role, label, dashed });

// ─── Chart data ─────────────────────────────────────────────────────────────
// Series built with a script (seeded where random) and checked: every number the text quotes is in the data.

/** 2.8.1: three 25-candle stretches. A trend (indexes 0–24: swing highs 97.55, 98.82, 99.96, 101.09; lows 96.85, 97.99, 99.15), a range (25–49: highs at 101.50 on 26, 34, 42; lows at 100.00 on 30, 38, 46) and a seeded random walk (50–74: swing highs 100.99, 101.34, 100.94; lows 99.16, 99.92, 99.77). */
const REG3: CandleData[] = [
  k(95.9, 96.3, 95.84, 96.2), k(96.2, 96.68, 96.1, 96.6), k(96.6, 97.12, 96.51, 97), k(97, 97.51, 96.93, 97.45),
  k(97.45, 97.55, 97.09, 97.2), k(97.2, 97.29, 96.85, 96.95), k(96.95, 97.47, 96.87, 97.4), k(97.4, 97.96, 97.28, 97.85),
  k(97.85, 98.4, 97.79, 98.3), k(98.3, 98.78, 98.2, 98.7), k(98.7, 98.82, 98.31, 98.4), k(98.4, 98.46, 98.03, 98.1),
  k(98.1, 98.65, 97.99, 98.55), k(98.55, 99.09, 98.45, 99), k(99, 99.52, 98.92, 99.45), k(99.45, 99.96, 99.33, 99.85),
  k(99.85, 99.95, 99.49, 99.55), k(99.55, 99.63, 99.15, 99.25), k(99.25, 99.82, 99.16, 99.7), k(99.7, 100.21, 99.63, 100.15),
  k(100.15, 100.7, 100.04, 100.6), k(100.6, 101.09, 100.5, 101), k(101, 101.07, 100.62, 100.7), k(100.7, 100.81, 100.33, 100.45),
  k(100.45, 100.9, 100.39, 100.8), k(100.8, 101.18, 100.7, 101.1), k(101.1, 101.5, 101.01, 101.35), k(101.35, 101.41, 100.98, 101.05),
  k(101.05, 101.15, 100.59, 100.7), k(100.7, 100.79, 100.25, 100.35), k(100.35, 100.42, 100, 100.15), k(100.15, 100.56, 100.08, 100.45),
  k(100.45, 100.95, 100.39, 100.85), k(100.85, 101.28, 100.75, 101.2), k(101.2, 101.5, 101.11, 101.4), k(101.4, 101.42, 101.03, 101.1),
  k(101.1, 101.2, 100.64, 100.75), k(100.75, 100.84, 100.3, 100.4), k(100.4, 100.47, 100, 100.15), k(100.15, 100.61, 100.08, 100.5),
  k(100.5, 101, 100.44, 100.9), k(100.9, 101.33, 100.8, 101.25), k(101.25, 101.5, 101.16, 101.35), k(101.35, 101.41, 100.93, 101),
  k(101, 101.1, 100.49, 100.6), k(100.6, 100.69, 100.2, 100.3), k(100.3, 100.37, 100, 100.2), k(100.2, 100.66, 100.08, 100.55),
  k(100.55, 101.05, 100.49, 100.95), k(100.95, 101.03, 100.7, 100.8), k(100.8, 100.94, 100.63, 100.75), k(100.75, 100.91, 100.67, 100.81),
  k(100.81, 100.99, 100.54, 100.7), k(100.7, 100.82, 99.86, 99.97), k(99.97, 100.05, 99.72, 99.85), k(99.85, 100.01, 99.32, 99.46),
  k(99.46, 99.57, 99.24, 99.34), k(99.34, 100, 99.16, 99.87), k(99.87, 100.23, 99.75, 100.09), k(100.09, 100.67, 100.01, 100.57),
  k(100.57, 101.02, 100.41, 100.84), k(100.84, 101.34, 100.73, 101.22), k(101.22, 101.3, 100.73, 100.86), k(100.86, 101.02, 100.58, 100.72),
  k(100.72, 100.83, 100, 100.1), k(100.1, 100.4, 99.92, 100.27), k(100.27, 100.94, 100.15, 100.8), k(100.8, 100.9, 100.45, 100.53),
  k(100.53, 100.71, 100.27, 100.43), k(100.43, 100.55, 99.79, 99.9), k(99.9, 100.19, 99.77, 100.11), k(100.11, 100.62, 99.97, 100.46),
  k(100.46, 101, 100.36, 100.89), k(100.89, 101.21, 100.71, 101.08), k(101.08, 101.34, 100.96, 101.2),
];

/** 2.8.1: a 98.00–100.00 range (highs at 100.00 on indexes 4, 13, 22; a wick to 100.25 on 26 that closes at 99.85; lows at 98.00 on 8, 17, 30). Index 33 closes at 100.40, the first close outside; higher lows 100.17, 100.99, 101.85 and higher highs 101.73, 103.30 follow. */
const SHIFT: CandleData[] = [
  k(98.3, 98.72, 98.16, 98.6), k(98.6, 99.1, 98.51, 99), k(99, 99.48, 98.89, 99.4), k(99.4, 99.84, 99.33, 99.7),
  k(99.7, 100, 99.57, 99.8), k(99.8, 99.9, 99.28, 99.4), k(99.4, 99.47, 98.9, 99), k(99, 99.13, 98.52, 98.6),
  k(98.6, 98.72, 98, 98.25), k(98.25, 98.6, 98.16, 98.5), k(98.5, 98.98, 98.39, 98.9), k(98.9, 99.44, 98.83, 99.3),
  k(99.3, 99.69, 99.17, 99.6), k(99.6, 100, 99.48, 99.75), k(99.75, 99.82, 99.2, 99.3), k(99.3, 99.43, 98.82, 98.9),
  k(98.9, 99.02, 98.36, 98.5), k(98.5, 98.6, 98, 98.2), k(98.2, 98.53, 98.1, 98.45), k(98.45, 98.99, 98.38, 98.85),
  k(98.85, 99.34, 98.72, 99.25), k(99.25, 99.66, 99.13, 99.55), k(99.55, 100, 99.45, 99.8), k(99.8, 99.9, 99.42, 99.5),
  k(99.5, 99.62, 99.06, 99.2), k(99.2, 99.6, 99.11, 99.5), k(99.5, 100.25, 99.39, 99.85), k(99.85, 99.9, 99.38, 99.45),
  k(99.45, 99.54, 98.87, 99), k(99, 99.11, 98.48, 98.6), k(98.6, 98.67, 98, 98.3), k(98.3, 98.83, 98.22, 98.7),
  k(98.7, 99.42, 98.56, 99.3), k(99.3, 100.5, 99.21, 100.4), k(100.4, 100.78, 100.29, 100.7), k(100.7, 100.84, 100.48, 100.55),
  k(100.55, 100.64, 100.17, 100.3), k(100.3, 100.86, 100.18, 100.75), k(100.75, 101.27, 100.65, 101.2), k(101.2, 101.73, 101.12, 101.6),
  k(101.6, 101.72, 101.26, 101.4), k(101.4, 101.5, 101.01, 101.1), k(101.1, 101.63, 100.99, 101.55), k(101.55, 102.14, 101.48, 102),
  k(102, 102.49, 101.87, 102.4), k(102.4, 102.51, 102.08, 102.2), k(102.2, 102.27, 101.85, 101.95), k(101.95, 102.53, 101.87, 102.4),
  k(102.4, 102.97, 102.26, 102.85), k(102.85, 103.3, 102.76, 103.2), k(103.2, 103.28, 102.89, 103), k(103, 103.14, 102.68, 102.75),
  k(102.75, 103.24, 102.62, 103.15), k(103.15, 103.71, 103.03, 103.6), k(103.6, 104.07, 103.5, 104), k(104, 104.13, 103.72, 103.8),
  k(103.8, 103.92, 103.41, 103.55), k(103.55, 104.05, 103.46, 103.95), k(103.95, 104.43, 103.84, 104.35), k(104.35, 104.84, 104.28, 104.7),
];

/** 2.8.1 Try, stretch A: a range, highs at 100.50 (indexes 3, 13, 23) and lows at 98.50 (8, 18, 27). */
const SEG_A: CandleData[] = [
  k(98.9, 99.3, 98.84, 99.2), k(99.2, 99.72, 99.09, 99.6), k(99.6, 100.08, 99.51, 100), k(100, 100.5, 99.87, 100.3),
  k(100.3, 100.41, 100.03, 100.1), k(100.1, 100.19, 99.6, 99.7), k(99.7, 99.83, 99.18, 99.3), k(99.3, 99.37, 98.82, 98.9),
  k(98.9, 99, 98.5, 98.7), k(98.7, 99.12, 98.59, 99), k(99, 99.48, 98.91, 99.4), k(99.4, 99.86, 99.27, 99.8),
  k(99.8, 100.31, 99.73, 100.2), k(100.2, 100.5, 100.1, 100.35), k(100.35, 100.42, 99.83, 99.95), k(99.95, 100.02, 99.47, 99.55),
  k(99.55, 99.65, 99.09, 99.15), k(99.15, 99.27, 98.69, 98.8), k(98.8, 98.88, 98.5, 98.65), k(98.65, 99.01, 98.58, 98.95),
  k(98.95, 99.46, 98.88, 99.35), k(99.35, 99.84, 99.25, 99.75), k(99.75, 100.28, 99.63, 100.15), k(100.15, 100.5, 100.07, 100.3),
  k(100.3, 100.4, 99.84, 99.9), k(99.9, 100.02, 99.39, 99.5), k(99.5, 99.58, 99.01, 99.1), k(99.1, 99.16, 98.5, 98.75),
  k(98.75, 99.16, 98.68, 99.05), k(99.05, 99.49, 98.95, 99.4),
];

/** Stretch B: a seeded random walk. Swing highs 100.23, 101.07, 100.46, 100.67; lows 99.28, 99.41, 98.90, 99.28, 99.74. */
const SEG_B: CandleData[] = [
  k(100, 100.23, 99.88, 100.09), k(100.09, 100.19, 99.97, 100.05), k(100.05, 100.23, 99.57, 99.73), k(99.73, 99.85, 99.3, 99.41),
  k(99.41, 99.72, 99.28, 99.64), k(99.64, 100, 99.5, 99.84), k(99.84, 99.95, 99.49, 99.59), k(99.59, 100.1, 99.41, 99.97),
  k(99.97, 100.33, 99.85, 100.19), k(100.19, 100.88, 100.11, 100.78), k(100.78, 101.07, 100.62, 100.89), k(100.89, 101.01, 100.27, 100.38),
  k(100.38, 100.46, 100, 100.13), k(100.13, 100.29, 99.17, 99.31), k(99.31, 99.42, 98.98, 99.08), k(99.08, 99.62, 98.9, 99.49),
  k(99.49, 99.82, 99.37, 99.68), k(99.68, 100.38, 99.6, 100.28), k(100.28, 100.46, 99.82, 99.98), k(99.98, 100.26, 99.87, 100.14),
  k(100.14, 100.22, 99.29, 99.42), k(99.42, 99.82, 99.28, 99.66), k(99.66, 99.95, 99.56, 99.84), k(99.84, 100.01, 99.66, 99.88),
  k(99.88, 100.03, 99.76, 99.89), k(99.89, 100, 99.81, 99.9), k(99.9, 100.67, 99.74, 100.49), k(100.49, 100.61, 100.14, 100.25),
  k(100.25, 100.33, 99.76, 99.89), k(99.89, 100.47, 99.75, 100.31),
];

/** Stretch C: a downtrend. Swing highs 102.81, 101.67, 100.50, 99.43; lows 102.07, 100.89, 99.73, 98.60, 97.47. */
const SEG_C: CandleData[] = [
  k(103.3, 103.4, 102.91, 103), k(103, 103.07, 102.49, 102.6), k(102.6, 102.72, 102.14, 102.2), k(102.2, 102.54, 102.07, 102.45),
  k(102.45, 102.81, 102.37, 102.7), k(102.7, 102.76, 102.2, 102.3), k(102.3, 102.43, 101.78, 101.85), k(101.85, 101.93, 101.28, 101.4),
  k(101.4, 101.5, 100.91, 101), k(101, 101.37, 100.89, 101.3), k(101.3, 101.67, 101.24, 101.55), k(101.55, 101.64, 101.02, 101.15),
  k(101.15, 101.26, 100.62, 100.7), k(100.7, 100.76, 100.15, 100.25), k(100.25, 100.38, 99.78, 99.85), k(99.85, 100.23, 99.73, 100.15),
  k(100.15, 100.5, 100.06, 100.4), k(100.4, 100.47, 99.89, 100), k(100, 100.12, 99.49, 99.55), k(99.55, 99.64, 98.97, 99.1),
  k(99.1, 99.21, 98.62, 98.7), k(98.7, 99.06, 98.6, 99), k(99, 99.43, 98.93, 99.3), k(99.3, 99.38, 98.78, 98.9),
  k(98.9, 99, 98.36, 98.45), k(98.45, 98.52, 97.89, 98), k(98, 98.12, 97.54, 97.6), k(97.6, 97.99, 97.47, 97.9),
  k(97.9, 98.26, 97.82, 98.15), k(98.15, 98.21, 97.65, 97.75),
];

/** 2.8.2: highs of indexes 0–19 peak at 100.60; index 20 closes at 100.95, bought at the ask, 101.00. Stop and trail at the lowest low of the last 10 candles: 99.20 at entry, so R is 1.80 a unit. Highest high 105.45 (index 40). Index 44's bid, 103.12, stays above the trail at 102.79; index 46's bid, 102.45, reaches the trail at 102.95: +1.08R before costs, after an MFE of +2.47R. */
const TF: CandleData[] = [
  k(99.6, 99.95, 99.52, 99.8), k(99.8, 100.2, 99.66, 100.1), k(100.1, 100.52, 100.01, 100.4), k(100.4, 100.48, 100.09, 100.2),
  k(100.2, 100.34, 99.67, 99.8), k(99.8, 99.89, 99.25, 99.4), k(99.4, 99.51, 99.1, 99.2), k(99.2, 99.63, 99.08, 99.5),
  k(99.5, 100.05, 99.42, 99.9), k(99.9, 100.4, 99.76, 100.3), k(100.3, 100.6, 100.21, 100.45), k(100.45, 100.53, 99.99, 100.1),
  k(100.1, 100.24, 99.57, 99.7), k(99.7, 99.79, 99.2, 99.35), k(99.35, 99.71, 99.25, 99.6), k(99.6, 100.13, 99.48, 100),
  k(100, 100.5, 99.92, 100.35), k(100.35, 100.45, 100.06, 100.2), k(100.2, 100.32, 99.81, 99.9), k(99.9, 100.38, 99.79, 100.3),
  k(100.3, 101.09, 100.17, 100.95), k(100.95, 101.39, 100.8, 101.3), k(101.3, 101.81, 101.2, 101.7), k(101.7, 101.83, 101.38, 101.5),
  k(101.5, 101.65, 101.12, 101.2), k(101.2, 101.7, 101.06, 101.6), k(101.6, 102.22, 101.51, 102.1), k(102.1, 102.58, 101.99, 102.5),
  k(102.5, 102.64, 102.17, 102.3), k(102.3, 102.39, 101.8, 101.95), k(101.95, 102.51, 101.85, 102.4), k(102.4, 103.03, 102.28, 102.9),
  k(102.9, 103.55, 102.82, 103.4), k(103.4, 103.5, 103.06, 103.2), k(103.2, 103.32, 102.81, 102.9), k(102.9, 103.48, 102.79, 103.4),
  k(103.4, 104.14, 103.27, 104), k(104, 104.59, 103.85, 104.5), k(104.5, 105.01, 104.4, 104.9), k(104.9, 105.43, 104.78, 105.3),
  k(105.3, 105.45, 105.02, 105.1), k(105.1, 105.2, 104.56, 104.7), k(104.7, 104.82, 104.11, 104.2), k(104.2, 104.28, 103.59, 103.7),
  k(103.7, 103.84, 103.17, 103.3), k(103.3, 103.39, 102.95, 103), k(103, 103.11, 102.5, 102.6), k(102.6, 103.03, 102.48, 102.9),
  k(102.9, 103.05, 102.32, 102.4),
];

/** The trail as a step line, raised at each close. */
const TF_TRAIL_POINTS = [{index: 20.5, price: 99.2}, {index: 23.5, price: 99.2}, {index: 23.5, price: 99.25}, {index: 24.5, price: 99.25}, {index: 24.5, price: 99.48}, {index: 25.5, price: 99.48}, {index: 25.5, price: 99.79}, {index: 29.5, price: 99.79}, {index: 29.5, price: 100.17}, {index: 30.5, price: 100.17}, {index: 30.5, price: 100.8}, {index: 31.5, price: 100.8}, {index: 31.5, price: 101.06}, {index: 35.5, price: 101.06}, {index: 35.5, price: 101.51}, {index: 36.5, price: 101.51}, {index: 36.5, price: 101.8}, {index: 39.5, price: 101.8}, {index: 39.5, price: 101.85}, {index: 40.5, price: 101.85}, {index: 40.5, price: 102.28}, {index: 41.5, price: 102.28}, {index: 41.5, price: 102.79}, {index: 45.5, price: 102.79}, {index: 45.5, price: 102.95}, {index: 46, price: 102.95}];

/** 2.8.3: 50 candles after 50 hidden ones that warm up the averages. Pullbacks reach the EMA 20 at indexes 10 (low 94.98), 21 (96.59) and 32 (98.05); index 45 makes a lower low, 97.64, and index 46 closes at 97.29, under the SMA 50 at 97.68. */
const PB: CandleData[] = [
  k(94.2, 94.74, 94.12, 94.62), k(94.62, 95.16, 94.54, 95.04), k(95.04, 95.58, 94.96, 95.46), k(95.46, 96, 95.38, 95.88),
  k(95.88, 96.42, 95.8, 96.3), k(96.3, 96.84, 96.22, 96.72), k(96.72, 97.26, 96.64, 97.14), k(97.14, 97.22, 96.59, 96.69),
  k(96.69, 96.77, 96.14, 96.24), k(96.24, 96.32, 95.69, 95.79), k(95.79, 95.87, 94.98, 95.59), k(95.59, 96.13, 95.51, 96.01),
  k(96.01, 96.55, 95.93, 96.43), k(96.43, 96.97, 96.35, 96.85), k(96.85, 97.39, 96.77, 97.27), k(97.27, 97.81, 97.19, 97.69),
  k(97.69, 98.23, 97.61, 98.11), k(98.11, 98.65, 98.03, 98.53), k(98.53, 98.61, 97.98, 98.08), k(98.08, 98.16, 97.53, 97.63),
  k(97.63, 97.71, 97.08, 97.18), k(97.18, 97.26, 96.59, 96.98), k(96.98, 97.52, 96.9, 97.4), k(97.4, 97.94, 97.32, 97.82),
  k(97.82, 98.36, 97.74, 98.24), k(98.24, 98.78, 98.16, 98.66), k(98.66, 99.2, 98.58, 99.08), k(99.08, 99.62, 99, 99.5),
  k(99.5, 100.04, 99.42, 99.92), k(99.92, 100, 99.37, 99.47), k(99.47, 99.55, 98.92, 99.02), k(99.02, 99.1, 98.47, 98.57),
  k(98.57, 98.65, 98.05, 98.37), k(98.37, 98.91, 98.29, 98.79), k(98.79, 99.33, 98.71, 99.21), k(99.21, 99.75, 99.13, 99.63),
  k(99.63, 100.17, 99.55, 100.05), k(100.05, 100.59, 99.97, 100.47), k(100.47, 101.01, 100.39, 100.89), k(100.89, 100.97, 100.34, 100.44),
  k(100.44, 100.52, 99.89, 99.99), k(99.99, 100.07, 99.44, 99.54), k(99.54, 99.62, 98.99, 99.09), k(99.09, 99.17, 98.54, 98.64),
  k(98.64, 98.72, 98.09, 98.19), k(98.19, 98.27, 97.64, 97.74), k(97.74, 97.82, 97.19, 97.29), k(97.29, 97.37, 96.74, 96.84),
  k(96.84, 96.92, 96.29, 96.39), k(96.39, 96.47, 95.84, 95.94),
];

/** EMA 20 (seeded with the SMA of the first 20 closes) and SMA 50 of PB's closes, hidden warm-up included, rounded to the cent. */
const PB_EMA20 = [93.22, 93.39, 93.59, 93.81, 94.04, 94.3, 94.57, 94.77, 94.91, 94.99, 95.05, 95.14, 95.27, 95.42, 95.59, 95.79, 96.01, 96.25, 96.43, 96.54, 96.6, 96.64, 96.71, 96.82, 96.95, 97.11, 97.3, 97.51, 97.74, 97.91, 98.01, 98.06, 98.09, 98.16, 98.26, 98.39, 98.55, 98.73, 98.94, 99.08, 99.17, 99.2, 99.19, 99.14, 99.05, 98.92, 98.77, 98.58, 98.38, 98.14];
const PB_SMA50 = [91.46, 91.59, 91.72, 91.86, 92.01, 92.17, 92.33, 92.48, 92.61, 92.73, 92.85, 92.98, 93.11, 93.25, 93.39, 93.53, 93.69, 93.85, 94.01, 94.15, 94.27, 94.38, 94.51, 94.65, 94.79, 94.94, 95.09, 95.24, 95.4, 95.56, 95.7, 95.83, 95.95, 96.07, 96.21, 96.36, 96.51, 96.66, 96.82, 96.96, 97.1, 97.23, 97.35, 97.45, 97.54, 97.61, 97.68, 97.74, 97.79, 97.83];

/** 2.8.4: a 97.00–100.00 range. Highs at 100.00 on indexes 5, 13, 24 (the only swing highs), lows at 97.00 on 9 and 18; volume over indexes 10–29 averages 1,000. Index 30 closes at 100.15 on 1,800 (1.8×), low 99.30. Under the veil it fails: the high after entry is 100.45, and index 33's bid, 99.05, hits a 99.20 stop. */
const RB: CandleData[] = [
  kv(98.4, 98.8, 98.3, 98.7, 900), kv(98.7, 99.1, 98.6, 99, 950), kv(99, 99.4, 98.85, 99.3, 1000), kv(99.3, 99.6, 99.1, 99.5, 1050),
  kv(99.5, 99.8, 99.35, 99.7, 1100), kv(99.7, 100, 99.55, 99.75, 1250), kv(99.75, 99.8, 99, 99.1, 1150), kv(99.1, 99.2, 98.3, 98.4, 1000),
  kv(98.4, 98.5, 97.6, 97.7, 1050), kv(97.7, 97.85, 97, 97.4, 1200), kv(97.4, 98.1, 97.3, 98, 950), kv(98, 98.8, 97.9, 98.7, 900),
  kv(98.7, 99.5, 98.6, 99.4, 1000), kv(99.4, 100, 99.3, 99.6, 1150), kv(99.6, 99.7, 98.9, 99, 1050), kv(99, 99.1, 98.4, 98.5, 950),
  kv(98.5, 98.6, 97.9, 98, 900), kv(98, 98.2, 97.4, 97.5, 1000), kv(97.5, 97.6, 97, 97.3, 1150), kv(97.3, 97.9, 97.2, 97.8, 950),
  kv(97.8, 98.4, 97.7, 98.3, 900), kv(98.3, 98.9, 98.2, 98.8, 850), kv(98.8, 99.3, 98.7, 99.2, 950), kv(99.2, 99.7, 99.1, 99.6, 1000),
  kv(99.6, 100, 99.45, 99.65, 1200), kv(99.65, 99.7, 99.1, 99.2, 1050), kv(99.2, 99.3, 98.6, 98.7, 950), kv(98.7, 98.9, 98.45, 98.8, 850),
  kv(98.8, 99.2, 98.7, 99.1, 900), kv(99.1, 99.5, 99, 99.4, 1350), kv(99.4, 100.25, 99.3, 100.15, 1800), kv(100.15, 100.45, 99.95, 100.05, 1100),
  kv(100.05, 100.1, 99.55, 99.65, 1050), kv(99.65, 99.75, 99.1, 99.25, 1250), kv(99.25, 99.4, 98.7, 98.8, 1000), kv(98.8, 99, 98.3, 98.5, 950),
  kv(98.5, 98.7, 98.1, 98.6, 900),
];

/** 2.8.8: the same range. Index 30 spikes to 100.70 and closes at 99.80 on 700 (0.7×); the prior 20-candle high, 100.00, was on index 24. A sell stop at 99.90 fills in index 30; the highest later ask is 100.00; index 35's ask, 97.55, reaches the 97.60 target. A long from 100.15 is stopped at 99.20 in index 31 (bid 99.15). */
const SPIKE: CandleData[] = [
  kv(98.4, 98.8, 98.3, 98.7, 900), kv(98.7, 99.1, 98.6, 99, 950), kv(99, 99.4, 98.85, 99.3, 1000), kv(99.3, 99.6, 99.1, 99.5, 1050),
  kv(99.5, 99.8, 99.35, 99.7, 1100), kv(99.7, 100, 99.55, 99.75, 1250), kv(99.75, 99.8, 99, 99.1, 1150), kv(99.1, 99.2, 98.3, 98.4, 1000),
  kv(98.4, 98.5, 97.6, 97.7, 1050), kv(97.7, 97.85, 97, 97.4, 1200), kv(97.4, 98.1, 97.3, 98, 950), kv(98, 98.8, 97.9, 98.7, 900),
  kv(98.7, 99.5, 98.6, 99.4, 1000), kv(99.4, 100, 99.3, 99.6, 1150), kv(99.6, 99.7, 98.9, 99, 1050), kv(99, 99.1, 98.4, 98.5, 950),
  kv(98.5, 98.6, 97.9, 98, 900), kv(98, 98.2, 97.4, 97.5, 1000), kv(97.5, 97.6, 97, 97.3, 1150), kv(97.3, 97.9, 97.2, 97.8, 950),
  kv(97.8, 98.4, 97.7, 98.3, 900), kv(98.3, 98.9, 98.2, 98.8, 850), kv(98.8, 99.3, 98.7, 99.2, 950), kv(99.2, 99.7, 99.1, 99.6, 1000),
  kv(99.6, 100, 99.45, 99.65, 1200), kv(99.65, 99.7, 99.1, 99.2, 1050), kv(99.2, 99.3, 98.6, 98.7, 950), kv(98.7, 98.9, 98.45, 98.8, 850),
  kv(98.8, 99.2, 98.7, 99.1, 900), kv(99.1, 99.5, 99, 99.4, 1350), kv(99.4, 100.7, 99.3, 99.8, 700), kv(99.8, 99.95, 99.2, 99.3, 1100),
  kv(99.3, 99.45, 98.6, 98.7, 1050), kv(98.7, 98.9, 98.2, 98.4, 1000), kv(98.4, 98.55, 97.8, 97.9, 950), kv(97.9, 98.05, 97.5, 97.7, 1000),
  kv(97.7, 98.1, 97.6, 98, 900),
];

/** 2.8.6: the same range for 40 candles, with a third low at 97.00 on index 33; the SMA 20 stays within 98.515–98.875 from index 19 to 39. Index 38's bid reaches 99.70 (the long's target, the short's entry); index 40 closes at 100.40, and its ask, 100.60, stops that short. */
const RT: CandleData[] = [
  k(98.4, 98.8, 98.3, 98.7), k(98.7, 99.1, 98.6, 99), k(99, 99.4, 98.85, 99.3), k(99.3, 99.6, 99.1, 99.5),
  k(99.5, 99.8, 99.35, 99.7), k(99.7, 100, 99.55, 99.75), k(99.75, 99.8, 99, 99.1), k(99.1, 99.2, 98.3, 98.4),
  k(98.4, 98.5, 97.6, 97.7), k(97.7, 97.85, 97, 97.4), k(97.4, 98.1, 97.3, 98), k(98, 98.8, 97.9, 98.7),
  k(98.7, 99.5, 98.6, 99.4), k(99.4, 100, 99.3, 99.6), k(99.6, 99.7, 98.9, 99), k(99, 99.1, 98.4, 98.5),
  k(98.5, 98.6, 97.9, 98), k(98, 98.2, 97.4, 97.5), k(97.5, 97.6, 97, 97.3), k(97.3, 97.9, 97.2, 97.8),
  k(97.8, 98.4, 97.7, 98.3), k(98.3, 98.9, 98.2, 98.8), k(98.8, 99.3, 98.7, 99.2), k(99.2, 99.7, 99.1, 99.6),
  k(99.6, 100, 99.45, 99.65), k(99.65, 99.7, 99.1, 99.2), k(99.2, 99.3, 98.6, 98.7), k(98.7, 98.9, 98.45, 98.8),
  k(98.8, 99.2, 98.7, 99.1), k(99.1, 99.5, 99, 99.4), k(99.4, 99.55, 98.9, 99), k(99, 99.1, 98.3, 98.4),
  k(98.4, 98.5, 97.7, 97.8), k(97.8, 97.95, 97, 97.35), k(97.35, 98, 97.25, 97.9), k(97.9, 98.6, 97.8, 98.5),
  k(98.5, 99.1, 98.4, 99), k(99, 99.5, 98.9, 99.4), k(99.4, 99.9, 99.3, 99.8), k(99.8, 99.95, 99.45, 99.6),
  k(99.6, 100.55, 99.5, 100.4), k(100.4, 100.9, 100.3, 100.8), k(100.8, 100.95, 100.4, 100.55), k(100.55, 101.2, 100.45, 101.1),
  k(101.1, 101.6, 101, 101.5), k(101.5, 101.7, 101.2, 101.35),
];

/** 2.8.5: ranges of indexes 5–11 are 1.10, 0.95, 1.30, 1.20, 1.05, 1.15 and 0.90, so index 11 (high 100.60, low 99.70) is an NR7; index 6 (0.95) isn't, because index 1 is 0.85. Under the veil: the buy stop at 100.65 fills in index 12; the long's stop at 99.65, and a re-armed sell stop, in index 14 (bid 99.05); the short's stop at 100.65 in index 16 (ask 101.20). Ranges 1.00–1.15. */
const VC: CandleData[] = [
  k(99.8, 100.7, 99.3, 100.4), k(100.4, 100.9, 100.05, 100.7), k(100.7, 101.05, 99.8, 99.95), k(99.95, 100.4, 99.4, 100.2),
  k(100.2, 100.95, 99.75, 100.8), k(100.8, 101.2, 100.1, 100.3), k(100.3, 100.65, 99.7, 99.9), k(99.9, 100.5, 99.2, 100.35),
  k(100.35, 100.9, 99.7, 99.85), k(99.85, 100.55, 99.5, 100.4), k(100.4, 100.75, 99.6, 99.95), k(99.95, 100.6, 99.7, 100.2),
  k(100.2, 101.05, 99.95, 100.85), k(100.85, 101, 99.95, 100.1), k(100.1, 100.25, 99.1, 99.35), k(99.35, 100.2, 99.2, 100.05),
  k(100.05, 101.15, 100.05, 100.9), k(100.9, 101, 99.95, 100.3),
];

/** 2.8.7: 47 candles after 20 hidden ones. With Bollinger bands (20, 2), the closes under the lower band at indexes 3 and 13 close at or above the middle band 2 candles later; in the downtrend, fresh closes under it at 25, 29, 35 and 40 never close back at the middle within 5 candles. */
const BB: CandleData[] = [
  k(100.3, 100.38, 99.93, 100), k(100, 100.13, 99.58, 99.7), k(99.7, 99.81, 99.31, 99.4), k(99.4, 99.47, 98.86, 99),
  k(99, 99.72, 98.9, 99.6), k(99.6, 100.09, 99.52, 100), k(100, 100.44, 99.87, 100.3), k(100.3, 100.6, 100.19, 100.5),
  k(100.5, 100.58, 100.23, 100.3), k(100.3, 100.43, 99.88, 100), k(100, 100.11, 99.71, 99.8), k(99.8, 99.87, 99.46, 99.6),
  k(99.6, 99.72, 99, 99.1), k(99.1, 99.19, 98.72, 98.8), k(98.8, 99.64, 98.67, 99.5), k(99.5, 100, 99.39, 99.9),
  k(99.9, 100.28, 99.83, 100.2), k(100.2, 100.53, 100.08, 100.4), k(100.4, 100.51, 100.11, 100.2), k(100.2, 100.27, 99.76, 99.9),
  k(99.9, 100.02, 99.6, 99.7), k(99.7, 99.89, 99.62, 99.8), k(99.8, 100.14, 99.67, 100), k(100, 100.1, 99.59, 99.7),
  k(99.7, 99.78, 99.33, 99.4), k(99.4, 99.53, 98.63, 98.75), k(98.75, 99.11, 98.66, 99), k(99, 99.07, 98.71, 98.85),
  k(98.85, 98.97, 98.45, 98.55), k(98.55, 98.64, 98.17, 98.25), k(98.25, 98.39, 97.82, 97.95), k(97.95, 98.3, 97.84, 98.2),
  k(98.2, 98.28, 97.98, 98.05), k(98.05, 98.18, 97.63, 97.75), k(97.75, 97.86, 97.36, 97.45), k(97.45, 97.52, 96.71, 96.85),
  k(96.85, 97.22, 96.75, 97.1), k(97.1, 97.19, 96.87, 96.95), k(96.95, 97.09, 96.52, 96.65), k(96.65, 96.75, 96.24, 96.35),
  k(96.35, 96.43, 95.53, 95.6), k(95.6, 95.98, 95.48, 95.85), k(95.85, 95.96, 95.61, 95.7), k(95.7, 95.77, 95.26, 95.4),
  k(95.4, 95.52, 95, 95.1), k(95.1, 95.29, 95.02, 95.2), k(95.2, 95.34, 94.82, 94.95),
];

/** Bollinger bands of BB's closes: SMA 20 ± 2 population standard deviations, hidden warm-up included, rounded to the cent. */
const BB_MID = [100.08, 100.05, 99.99, 99.93, 99.9, 99.91, 99.95, 99.99, 100, 99.99, 99.95, 99.9, 99.84, 99.79, 99.78, 99.8, 99.82, 99.84, 99.83, 99.81, 99.8, 99.8, 99.83, 99.87, 99.86, 99.79, 99.73, 99.65, 99.56, 99.47, 99.38, 99.31, 99.26, 99.2, 99.1, 98.95, 98.79, 98.62, 98.44, 98.27, 98.06, 97.86, 97.65, 97.43, 97.22, 97.04, 96.84];
const BB_UP = [100.73, 100.71, 100.68, 100.71, 100.69, 100.7, 100.74, 100.81, 100.84, 100.81, 100.72, 100.65, 100.66, 100.72, 100.72, 100.73, 100.77, 100.81, 100.78, 100.73, 100.72, 100.72, 100.74, 100.69, 100.7, 100.76, 100.72, 100.64, 100.62, 100.65, 100.72, 100.74, 100.79, 100.86, 100.92, 100.97, 100.88, 100.72, 100.58, 100.47, 100.45, 100.3, 100.05, 99.83, 99.64, 99.51, 99.3];
const BB_LO = [99.43, 99.39, 99.31, 99.14, 99.11, 99.12, 99.15, 99.16, 99.16, 99.16, 99.17, 99.15, 99.03, 98.86, 98.85, 98.88, 98.88, 98.87, 98.88, 98.89, 98.87, 98.88, 98.92, 99.04, 99.01, 98.83, 98.73, 98.65, 98.5, 98.29, 98.04, 97.88, 97.72, 97.55, 97.28, 96.92, 96.7, 96.52, 96.31, 96.06, 95.67, 95.43, 95.24, 95.03, 94.79, 94.57, 94.38];

// ─── Layers ─────────────────────────────────────────────────────────────────

const REG3_TREND: ChartLayer[] = [
  { kind: "marker", index: 10, at: "high", label: "HH", role: "up" },
  { kind: "marker", index: 15, at: "high", label: "HH", role: "up" },
  { kind: "marker", index: 21, at: "high", label: "HH", role: "up" },
  { kind: "marker", index: 12, at: "low", label: "HL", role: "up" },
  { kind: "marker", index: 17, at: "low", label: "HL", role: "up" },
];
const REG3_RANGE: ChartLayer[] = [
  { kind: "path", points: [{ index: 25, price: 101.5 }, { index: 49, price: 101.5 }], role: "down", label: "101.50" },
  { kind: "path", points: [{ index: 25, price: 100 }, { index: 49, price: 100 }], role: "up", label: "100.00" },
];
const REG3_NOISE: ChartLayer = { kind: "bracket", from: 99.16, to: 101.34, index: 74, label: "NO CLEAR REGIME", role: "neutral" };
const SHIFT_EDGES: ChartLayer[] = [level(100, "resistance", "100.00"), level(98, "support", "98.00")];

const TF_ENTRY: ChartLayer = level(101, "entry", "BUY 101.00");
const TF_TRAIL: PathLayer = { kind: "path", points: TF_TRAIL_POINTS, role: "down", label: "TRAIL" };

const PB_EMA: ChartLayer = line(PB_EMA20, "accent", "EMA 20");
const PB_SMA: ChartLayer = line(PB_SMA50, "concept", "SMA 50");
const PB_TOUCHES: ChartLayer[] = [10, 21, 32].map((index, i): ChartLayer => ({ kind: "marker", index, at: "low", label: `PB ${i + 1}`, role: "up" }));

const RB_EDGES: ChartLayer[] = [level(100, "resistance", "100.00"), level(97, "support", "97.00")];
const RB_TOUCHES: ChartLayer[] = [
  ...[5, 13, 24].map((index): ChartLayer => ({ kind: "marker", index, at: "high", role: "down" })),
  ...[9, 18].map((index): ChartLayer => ({ kind: "marker", index, at: "low", role: "up" })),
];
const RB_PLAN: ChartLayer[] = [level(100.15, "entry", "BUY 100.15"), level(99.2, "stop", "STOP 99.20"), level(103, "target", "TARGET 103.00")];

const RT_TOUCHES: ChartLayer[] = [
  ...[5, 13, 24].map((index): ChartLayer => ({ kind: "marker", index, at: "high", role: "down" })),
  ...[9, 18, 33].map((index): ChartLayer => ({ kind: "marker", index, at: "low", role: "up" })),
];
const RT_PLAN: ChartLayer[] = [level(97.3, "entry", "BUY LIMIT 97.30"), level(96.4, "stop", "STOP 96.40"), level(99.7, "target", "TARGET 99.70")];

const VC_NR7: ChartLayer[] = [
  { kind: "marker", index: 11, at: "high", label: "H 100.60", role: "neutral" },
  { kind: "marker", index: 11, at: "low", label: "L 99.70", role: "neutral" },
];
const VC_ORDERS: ChartLayer[] = [level(100.65, "entry", "BUY STOP 100.65"), level(99.65, "entry", "SELL STOP 99.65")];

const SPIKE_PLAN: ChartLayer[] = [level(99.9, "entry", "SELL 99.90"), level(100.8, "stop", "STOP 100.80"), level(97.6, "target", "TARGET 97.60")];

const BB_BANDS: ChartLayer[] = [line(BB_UP, "neutral", "UPPER", true), line(BB_MID, "concept", "MIDDLE"), line(BB_LO, "neutral", "LOWER", true)];
const BB_RANGE_BUYS: ChartLayer[] = [3, 13].map((index): ChartLayer => ({ kind: "marker", index, at: "close", label: "BUY", role: "up" }));
const BB_TREND_BUYS: ChartLayer[] = [25, 29, 35, 40].map((index): ChartLayer => ({ kind: "marker", index, at: "close", label: "BUY", role: "down" }));

/** trend-classifier evidence options, as in L05. */
const EVIDENCE: NonNullable<TaskData["evidence"]> = [
  { id: "hh_hl", label: "Higher highs and higher lows" },
  { id: "lh_ll", label: "Lower highs and lower lows" },
  { id: "bounded", label: "Price keeps bouncing between two levels" },
  { id: "overlap", label: "Candles overlap with no direction" },
];
const RIGHT_LABEL = "The label is right. Pick the evidence you can actually see on this chart.";

// ─── Cards for the Try phases ───────────────────────────────────────────────

const RANGE_OPTIONS: Options = [
  { id: "trade", label: "Trade the range" },
  { id: "flip", label: "Stop: flip to the breakout card" },
  { id: "none", label: "No trade: not a confirmed range" },
];

const RANGE_CARDS: Cards = [
  {
    id: "r1",
    text: "Two touches at 97.00, two at 100.00, and a flat 20-candle average. Price dips to 97.25.",
    answer: "trade",
    correct: "Trade the range: both edges confirmed, price at support. A buy limit near 97.30, the stop outside, under 97.00.",
    rationales: {
      flip: "Nothing has closed outside the range, so the flip rule hasn't fired.",
      none: "Two touches on each edge and a flat average: that's the confirmation the card asks for.",
    },
  },
  {
    id: "r2",
    text: "So far, one touch at 100.00 and one at 97.00. Price is back near 97.20.",
    answer: "none",
    correct: "No trade: one touch on each edge isn't a confirmed range yet. It could be the start of anything.",
    rationales: {
      trade: "The card needs at least two touches on each edge. One each proves nothing.",
      flip: "There's no confirmed range to flip from, and nothing has broken.",
    },
  },
  {
    id: "r3",
    text: "Confirmed range. A candle closes at 100.40, above resistance. Two candles later, price dips back to 99.90.",
    answer: "flip",
    correct: "Stop: the close at 100.40 ended the range. No new range shorts; the breakout card takes over.",
    rationales: {
      trade: "Selling 99.90 as resistance ignores the flip rule. The first close outside ended the range.",
      none: "There was a confirmed range, and it just broke. The card's answer is to switch to the breakout card.",
    },
  },
  {
    id: "r4",
    text: "Confirmed range. A wick pokes up to 100.30, but the candle closes at 99.85.",
    answer: "trade",
    correct: "Trade the range: a wick isn't a close. The range stands, and a short near 99.70 still fits the card.",
    rationales: {
      flip: "The flip rule needs a close outside. This candle closed at 99.85, inside the range.",
      none: "The range is still confirmed. A wick through the edge doesn't change that.",
    },
  },
  {
    id: "r5",
    text: "Three touches at 100.00, but the lows keep rising: 97.00, 97.60, 98.20. The 20-candle average slopes up.",
    answer: "none",
    correct: "No trade: rising lows and a rising average aren't a range. Buyers step in higher each time.",
    rationales: {
      trade: "A range needs flat edges and a flat average. Rising lows mean the bottom edge isn't holding still.",
      flip: "Nothing has closed outside, and it was never a confirmed range to begin with.",
    },
  },
  {
    id: "r6",
    text: "Confirmed range. A candle closes at 96.70, under support. The next candle opens at 96.90.",
    answer: "flip",
    correct: "Stop: the close under 97.00 ended the range. No new range longs until a new range forms.",
    rationales: {
      trade: "Buying 'cheap' under support ignores the flip rule: the range has broken.",
      none: "The range was confirmed, and it broke. The flip rule says stop range trading and switch cards.",
    },
  },
];

const FADE_OPTIONS: Options = [
  { id: "breakout", label: "Breakout" },
  { id: "fade", label: "Fade" },
  { id: "pass", label: "Pass" },
];

const FADE_CARDS: Cards = [
  {
    id: "f1",
    text: "A 97.00–100.00 range for 30 candles, flat averages. A push to 100.60 on half the average volume closes at 99.85.",
    answer: "fade",
    correct: "Fade: a close back inside, on thin volume. The push found no buyers.",
    rationales: {
      breakout: "A breakout needs closes outside. This candle closed back inside, on half the usual volume.",
      pass: "The signs are clear here: a tested level, a close back inside, low participation.",
    },
  },
  {
    id: "f2",
    text: "The same range. Two closes above 100.00, at 100.40 and 100.70, each on twice the average volume.",
    answer: "breakout",
    correct: "Breakout: two closes outside, with volume behind them.",
    rationales: {
      fade: "There's nothing to fade: price closed outside twice and stayed there.",
      pass: "These are the breakout card's signs: closes beyond a tested level, with participation.",
    },
  },
  {
    id: "f3",
    text: "No level has held twice: highs and lows overlap at random for 40 candles. A candle closes above the latest high.",
    answer: "pass",
    correct: "Pass: with no tested level, a close above the latest high means nothing. On noise, both cards lose their costs.",
    rationales: {
      breakout: "A breakout needs a tested level. Here there are no edges to break.",
      fade: "A fade needs a range whose edge failed. There's no range here.",
    },
  },
  {
    id: "f4",
    text: "Range 97.00–100.00. A candle closes at 96.70, under support, on low volume. The next opens back at 97.20.",
    answer: "fade",
    correct: "Fade, long this time: a failed breakdown back inside, on low volume. The mirror of the short.",
    rationales: {
      breakout: "The close under support didn't hold: the next candle opened back inside, and volume was thin.",
      pass: "These are the fade's signs, mirrored: a thin push under support, then a quick return.",
    },
  },
  {
    id: "f5",
    text: "A range that narrowed for 20 candles. A close at 100.35 on 1.9 times the average volume, then a retest of 100.05 that holds.",
    answer: "breakout",
    correct: "Breakout: a close with volume, and the old ceiling now holding as a floor.",
    rationales: {
      fade: "The retest held above 100.00. A fade needs price back inside the range.",
      pass: "A close with volume and a retest that holds are the breakout's best signs.",
    },
  },
  {
    id: "f6",
    text: "Choppy candles, no repeated highs or lows. A spike above the last swing high reverses within the candle.",
    answer: "pass",
    correct: "Pass: without a tested range edge, a reversal is just noise, not a failed breakout.",
    rationales: {
      breakout: "The spike reversed at once, and there was no tested level to break.",
      fade: "Turtle Soup fades a failed break of a 20-candle extreme in a range. Here there's no range.",
    },
  },
  {
    id: "f7",
    text: "Range 97.00–100.00. Price is at 99.40, in the upper half. Nothing has broken either edge.",
    answer: "pass",
    correct: "Pass: neither card has a setup until price goes beyond an edge.",
    rationales: {
      breakout: "Nothing has closed beyond 100.00. Buying at 99.40 is anticipation, not the breakout card.",
      fade: "There's no failed push to fade. Price hasn't left the range.",
    },
  },
  {
    id: "f8",
    text: "Range 97.00–100.00. Price spikes to 100.70, a new 20-candle high six candles after the last one, and closes at 99.80.",
    answer: "fade",
    correct: "Fade: Turtle Soup. A sell stop at 99.90, the stop above 100.70.",
    rationales: {
      breakout: "The breakout failed within the candle: it closed back at 99.80, under 100.00.",
      pass: "This is the textbook setup: a new 20-candle high that falls back inside, the old high 6 candles earlier.",
    },
  },
];

const CONFLUENCE_OPTIONS: Options = [
  { id: "indep", label: "Independent evidence" },
  { id: "redundant", label: "Same evidence twice" },
  { id: "few", label: "Too few trades to judge" },
];

const CONFLUENCE_CARDS: Cards = [
  {
    id: "c1",
    text: "Pullback setup, plus RSI(14) under 30 and Stochastic under 20 on the same candle.",
    answer: "redundant",
    correct: "Same evidence twice: both measure recent price change. On simulated LABX they correlate 0.86.",
    rationales: {
      indep: "Different names, one input: both are built from recent prices.",
      few: "The sample isn't the problem. The second oscillator adds almost nothing new.",
    },
  },
  {
    id: "c2",
    text: "Price above a rising 50 MA, a pullback to a level that held twice, and volume rising on the bounce. 64 trades left.",
    answer: "indep",
    correct: "Independent: trend, location and participation, three different families, with 64 trades to judge.",
    rationales: {
      redundant: "Each filter comes from a different input: averages, levels, volume.",
      few: "64 trades is enough for a first judgement: about ±0.42R at a 1.7R spread.",
    },
  },
  {
    id: "c3",
    text: "MACD crossing above its signal line, and ROC turning positive.",
    answer: "redundant",
    correct: "Same evidence: both are built from closes and measure momentum.",
    rationales: {
      indep: "Both come from closes alone. When one turns up, the other usually does too.",
      few: "The issue is what they're built from, not the sample size.",
    },
  },
  {
    id: "c4",
    text: "Stochastic under 20, and Williams %R under −80.",
    answer: "redundant",
    correct: "Identical: Williams %R is the Stochastic formula, shifted by 100. Correlation 1.00.",
    rationales: {
      indep: "They're the same calculation on the same highs, lows and closes.",
      few: "The sample isn't the issue: the second filter can't remove a single trade the first one kept.",
    },
  },
  {
    id: "c5",
    text: "Trend filter, level, volume, session time and RSI under 30: 9 trades in two years.",
    answer: "few",
    correct: "Too few: at a 1.7R spread, 9 trades leave an interval of about ±1.11R. That can't tell an edge from luck.",
    rationales: {
      indep: "The families differ, but 9 trades can't show whether any of it works.",
      redundant: "Only the RSI overlaps with anything. The real problem is the 9 trades.",
    },
  },
  {
    id: "c6",
    text: "A swing low at an old breakout level, with OBV making a higher low. 41 trades.",
    answer: "indep",
    correct: "Independent: structure and volume. 41 trades is a small but workable sample.",
    rationales: {
      redundant: "Swing structure comes from price levels; OBV from volume. Different inputs.",
      few: "41 trades is past the 30 the course asks for, though the interval is still wide.",
    },
  },
];

// ─── Lessons ────────────────────────────────────────────────────────────────

const L281: Lesson = {
  id: "2.8.1",
  title: "Matching the tool to the regime",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Every strategy is a bet on a market regime: label the chart as trend, range or no clear regime first, then pick the family built for it, or no trade.",
  objectives: [
    "Label an unlabeled chart segment as trend, range or no clear regime before choosing a strategy.",
    "Match each strategy family to the regime where it works and the one where it fails.",
    'Choose "No trade" when the regime is unclear or the market behaves like a random walk.',
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "2.8",
    courseId: "2.8.1",
    hook: {
      prompt: "The same moving-average rule ran on LABX for two months. Month A: 12 trades, +6.0R. Month B: 15 trades, −8.4R. Same rules, same trader. What changed?",
      control: {
        kind: "choice",
        choices: [
          { id: "luck", label: "The trader got unlucky", feedback: "Luck plays a part over 15 trades. But 12 losses and 3 small wins is the usual pattern of a trend rule in a range." },
          { id: "regime", label: "The market changed regime", feedback: "Right. Month A trended; month B went sideways." },
          { id: "broken", label: "The rule stopped working for good", feedback: "Two months can't show that. The same rule made +6.0R a month earlier: what changed was the market." },
        ],
        answer: "regime",
      },
      figure: {
        kind: "bars",
        bars: [
          { label: "Month A", value: 6, role: "up" },
          { label: "Month B", value: -8.4, role: "down" },
        ],
        unit: "R",
      },
      compare: "You picked {yours}. Month A trended: 5 wins averaging +2.6R paid for 7 losses of 1R. Month B ranged: 3 wins of +1.2R against 12 losses. Same rule, different regime.",
      concept: "market-regime",
    },
    learn: [
      {
        kind: "explain",
        title: "A strategy is a bet on a regime",
        text: "Every strategy bets on how price will behave next. Trend rules bet that moves continue; range rules bet that they reverse. The [[market-regime|market regime]] decides which bet pays. So before 'buy or sell?', ask: is this market trending, ranging, or doing nothing you can name?",
      },
      {
        kind: "figure",
        title: "Three regimes, one market",
        text: "Each regime leaves its own signature on the chart.",
        figure: {
          kind: "chart",
          chart: { candles: REG3 },
          steps: [
            { text: "Three stretches of LABX, 25 candles each. What is each one doing?" },
            { text: "First: higher highs and higher lows. A trend.", layers: REG3_TREND },
            { text: "Second: turns at the same two levels, 100.00 and 101.50. A range.", layers: REG3_RANGE },
            { text: "Third: swings overlap, with no edges and no direction. No clear regime.", layers: [REG3_NOISE] },
          ],
        },
        concept: "market-regime",
      },
      {
        kind: "match",
        title: "Where each family works, and where it fails",
        prompt: "Each strategy family is built for one regime and loses in another. Match them.",
        pairs: [
          {
            left: "Trend following",
            right: "Works in a trend; loses in a range, to whipsaws",
            wrong: "Trend rules buy strength and sell weakness. In a range, each signal reverses before it pays.",
          },
          {
            left: "Range breakout",
            right: "Works when a range turns into a trend; loses when the range carries on",
            wrong: "A breakout bets that the range is ending. If it isn't, price falls back inside and hits the stop.",
          },
          {
            left: "Range trading and mean reversion",
            right: "Works in a range; loses when a trend starts",
            wrong: "Buying low and selling high needs edges that hold. A new trend runs straight through them.",
          },
          {
            left: "Failed-breakout fade",
            right: "Works in a range after a failed push; loses on a real breakout",
            wrong: "The fade bets that a push beyond the edge fails. A real breakout keeps going against it.",
          },
        ],
        columns: ["Family", "Works in, fails in"],
        correct: "Each family's best regime is another family's worst. That's why the label comes first.",
        concept: "strategy-regime-fit",
      },
      {
        kind: "hotspot",
        title: "When did the regime change?",
        prompt: "LABX ranged between 98.00 and 100.00, then started to trend. Tap the candle where the regime changed.",
        chart: { candles: SHIFT, layers: SHIFT_EDGES },
        zones: [
          { id: "c15", label: "Candle 15", index: 14, feedback: "Candle 15 sits mid-range, between the edges. Nothing had changed yet." },
          { id: "c27", label: "Candle 27", index: 26, feedback: "Candle 27's wick reached 100.25, but it closed at 99.85, back inside. A wick isn't a close." },
          { id: "c34", label: "Candle 34", index: 33 },
          { id: "c41", label: "Candle 41", index: 40, feedback: "By candle 41 the trend was already 7 candles old. The first close outside came earlier." },
        ],
        answer: "c34",
        correct: "Candle 34 closed at 100.40, the first close above 100.00. The pullback after it held at 100.17, and higher highs followed: 101.73, then 103.30.",
        concept: "market-regime",
      },
      {
        kind: "predict",
        title: "And the third stretch?",
        prompt: "Back to the third stretch of the first chart, the one with no clear regime. Which strategy has an edge there?",
        control: {
          kind: "choice",
          choices: [
            { id: "trend", label: "Trend following", feedback: "Its swing highs went 100.99, 101.34, 100.94: no direction to follow." },
            { id: "range", label: "Range trading", feedback: "Its swing lows went 99.16, 99.92, 99.77: no edge held twice." },
            { id: "breakout", label: "Breakout", feedback: "A breakout needs a tested level. This stretch had none." },
            { id: "none", label: "None of them" },
          ],
          answer: "none",
        },
        reveal: "None. The third stretch is a [[random-walk|random walk]]: each candle's move was drawn at random. On a random walk no rule has an edge, by construction, and every strategy loses about its costs. 'No trade' is the right call.",
        concept: "strategy-regime-fit",
      },
      {
        kind: "explain",
        title: "Is your eye better than chance?",
        text: "Guessing among three labels is right one time in three. Over 12 unlabeled segments, getting 8 or more right by luck alone happens about 1.9% of the time. That's the bar the course sets. Until you clear it, treat your labels as guesses, and size accordingly.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Diagnose first. Choose or skip second. Size for the regime you might be wrong about: an uncertain label means a smaller size or no trade. The fit between families and regimes is a practitioners' synthesis, [[evidence-grade]] C. That nothing beats a random walk is mechanical.",
      },
    ],
    task: {
      widget: "trend-classifier",
      data: {
        segments: [
          { id: "A", label: "range", evidence: "bounded", candles: SEG_A },
          { id: "B", label: "noise", evidence: "overlap", candles: SEG_B },
          { id: "C", label: "trend", evidence: "lh_ll", candles: SEG_C },
        ],
        evidence: EVIDENCE,
      },
      goal: "Three new stretches of LABX, unlabeled. Label each as trend, range or noise, and pick the evidence. Only a clear label earns a strategy.",
      start: { labelA: "", evidenceA: "", labelB: "", evidenceB: "", labelC: "", evidenceC: "" },
      success: {
        all: [
          { field: "labelA", eq: "range" },
          { field: "evidenceA", eq: "bounded" },
          { field: "labelB", eq: "noise" },
          { field: "evidenceB", eq: "overlap" },
          { field: "labelC", eq: "trend" },
          { field: "evidenceC", eq: "lh_ll" },
        ],
      },
      feedback: [
        { when: { field: "labelA", eq: "trend" }, text: "A stops at 100.50 three times and at 98.50 three times. That's two edges, not a direction." },
        { when: { field: "labelA", eq: "noise" }, text: "A has edges: it turned down at 100.50 on candles 4, 14 and 24, and up at 98.50 on 9, 19 and 28." },
        { when: { all: [{ field: "labelA", eq: "range" }, { field: "evidenceA", ne: "bounded" }] }, text: RIGHT_LABEL },
        { when: { field: "labelB", eq: "trend" }, text: "B's swing highs go 100.23, 101.07, 100.46, 100.67: up, down, up. No direction." },
        { when: { field: "labelB", eq: "range" }, text: "B's swing lows go 99.28, 99.41, 98.90, 99.28, 99.74: no level held. No edges." },
        { when: { all: [{ field: "labelB", eq: "noise" }, { field: "evidenceB", ne: "overlap" }] }, text: RIGHT_LABEL },
        { when: { field: "labelC", eq: "range" }, text: "C's highs fall: 102.81, 101.67, 100.50, 99.43. That's a direction, not two edges." },
        { when: { field: "labelC", eq: "noise" }, text: "C's swings step down clearly, each high and low below the last. That's structure." },
        { when: { all: [{ field: "labelC", eq: "trend" }, { field: "evidenceC", ne: "lh_ll" }] }, text: "Trend is right. Check the direction: each high and each low in C is lower." },
      ],
      correct: "Range, noise, downtrend. The families that fit: range trading or a fade on A, nothing on B, trend following or pullbacks on C.",
      hints: [
        "Do the swings step one way? Two higher, or two lower, highs and lows make a trend.",
        "Two touches on each side and no direction make a range.",
        "If you can't name the regime in one sentence, it isn't clear: call it noise.",
      ],
      showMe: { labelA: "range", evidenceA: "bounded", labelB: "noise", evidenceB: "overlap", labelC: "trend", evidenceC: "lh_ll" },
      concept: "market-regime",
    },
    check: ["q-2.8.1-1", "q-2.8.1-2", "q-2.8.1-3"],
    recap: {
      takeaways: [
        "Label the regime first: higher highs and lows mean trend; turns at the same two levels mean range.",
        "Each family has a home regime and a losing one: trend rules whipsaw in ranges, range rules die in trends.",
        "No clear regime, or a random walk: no trade. An uncertain label: smaller size, or skip.",
      ],
    },
  },
};

const L282: Lesson = {
  id: "2.8.2",
  title: "Trend following",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Trend following cuts losses short and lets winners run: a 30–45% win rate can pay when winners are several times the losers, but ranges whipsaw it.",
  objectives: [
    "State the full rules of a moving-average or channel trend-following system.",
    "Explain why a 30–45% win rate can still give a positive expectancy.",
    "Predict where the system loses: ranges and sharp reversals.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
  ],
  script: {
    unit: "2.8",
    courseId: "2.8.2",
    hook: {
      prompt: "A trend rule wins 7 of 20 trades. Winners average +3.2R, losers −1R. Costs are 0.10R per trade. Over the 20 trades, does it make money?",
      control: {
        kind: "choice",
        choices: [
          { id: "makes", label: "Makes money", feedback: "Right: 7 wins of +3.2R outweigh 13 losses of 1R and the costs." },
          { id: "loses", label: "Loses money", feedback: "13 losses look bad, but 7 wins of +3.2R make +22.4R against −13R." },
          { id: "cant", label: "Can't tell", feedback: "You have all the numbers: 7 × 3.2 − 13 × 1 − 20 × 0.10." },
        ],
        answer: "makes",
      },
      compare: "You said {yours}. Gross: 7 × 3.2 − 13 × 1 = +9.4R. Net: 9.4 − 20 × 0.10 = +7.4R, or +0.37R per trade, with 65% of trades losing.",
      concept: "trend-following",
    },
    learn: [
      {
        kind: "explain",
        title: "Cut losses, let winners run",
        text: "[[trend-following|Trend following]] doesn't predict where a trend ends. It joins once the trend shows itself, exits when it stops, and lets a few big winners pay for many small losses. Win rates of 30–45% are normal. The edge comes from the size of the winners, not from being right often.",
      },
      {
        kind: "explain",
        title: "The rule card",
        text: "**Setup:** price above a rising 50-period MA, or the EMA 20 above the EMA 50; the last swings made a higher high and a higher low. **Entry:** the close after the cross, or a close above the 20-candle high. **Stop:** 2–3 ATR below entry. **Exit:** the opposite cross, or a trail.",
      },
      {
        kind: "worked",
        title: "Expectancy at a 35% win rate",
        lines: ["Win rate: 7 ÷ 20 = 35%. Loss rate: 65%.", "Average win +3.2R; average loss −1R.", "Gross expectancy = 0.35 × 3.2 − 0.65 × 1 = ?"],
        ask: {
          answer: 0.47,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 1.12, text: "That's the winners' share alone, 0.35 × 3.2. Subtract the losers' 0.65 × 1." },
            { value: 0.37, text: "That's after costs. Before costs, leave out the 0.10R." },
          ],
          correct: "Right: +0.47R per trade before costs.",
        },
        after: "After 0.10R of costs per trade: +0.37R. Two trades in three lose, and the rule still makes money, as long as the winners stay big.",
        concept: "expectancy",
      },
      {
        kind: "predict",
        title: "Same rule, a range",
        prompt: "The same rule over two months: a trend, then a range. In the range it took 9 trades for −6.1R. How many were [[whipsaw|whipsaws]], crosses that reversed within a few candles for a loss?",
        control: {
          kind: "slider",
          min: 0,
          max: 9,
          step: 1,
          start: 3,
          answer: 7,
          tolerance: 1,
          feedback: [
            { from: 0, to: 5, text: "More. In a range most crosses reverse before they pay: 7 of the 9 did." },
            { from: 6, to: 8, text: "7 of the 9 were whipsaws, losing 0.9R to 1R each." },
            { from: 9, to: 9, text: "Not all: two made small gains, +0.5R and +0.2R. The other 7 were whipsaws." },
          ],
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "T1", value: -1, role: "down" },
            { label: "T2", value: -1, role: "down" },
            { label: "T3", value: 4.6, role: "up" },
            { label: "T4", value: -0.6, role: "down" },
            { label: "T5", value: 4.8, role: "up" },
            { label: "T6", value: -1, role: "down" },
            { label: "R1", value: -1, role: "down" },
            { label: "R2", value: -0.9, role: "down" },
            { label: "R3", value: 0.5, role: "up" },
            { label: "R4", value: -1, role: "down" },
            { label: "R5", value: -1, role: "down" },
            { label: "R6", value: -0.9, role: "down" },
            { label: "R7", value: 0.2, role: "up" },
            { label: "R8", value: -1, role: "down" },
            { label: "R9", value: -1, role: "down" },
          ],
          unit: "R",
          steps: ["Trend month, T1–T6: two big winners, +4.6R and +4.8R. +5.8R gross.", "Range month, R1–R9: 7 whipsaws of 0.9R to 1R, two small gains. −6.1R gross."],
        },
        reveal: "After 0.10R per trade in costs: +5.2R in the trend month, −7.0R in the range. Same rule, same trader. Illustrative numbers, built to show the pattern.",
        concept: "trend-following",
      },
      {
        kind: "hotspot",
        title: "Where the trail closes the trade",
        prompt: "A close above the 20-candle high, bought at 101.00. The stop trails at the lowest low of the last 10 candles. Tap the candle where it closes the trade.",
        chart: { candles: TF, layers: [TF_ENTRY, TF_TRAIL] },
        zones: [
          { id: "c30", label: "Candle 30", index: 29, feedback: "The dip to 101.80 stayed far above the trail, then at 99.79. The trail gives a trend room to pull back." },
          { id: "c41", label: "Candle 41", index: 40, feedback: "That's the top, 105.45. A trail never sells the top: it waits for price to turn down to it." },
          { id: "c45", label: "Candle 45", index: 44, feedback: "Its bid reached 103.12, still above the trail at 102.79. Not yet." },
          { id: "c47", label: "Candle 47", index: 46 },
        ],
        answer: "c47",
        correct: "Candle 47: its bid fell to 102.45, through the trail at 102.95. Out at 102.95, +1.08R before costs. The high was +2.47R: the trail gave back 1.39R.",
        concept: "trailing-stop",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Positive skew has a price: long losing runs. At a 35% win rate, the chance of at least one run of 8 or more losses in 100 trades is about 69%. Expect it before it happens. At 1% risk, 8 losses in a row cost about 8%.",
      },
      {
        kind: "explain",
        title: "What the evidence says",
        text: "Moving-average timing on one market: [[evidence-grade]] B. Brock, Lakonishok and LeBaron (1992) found it worked on old data, but the edge weakened once tested for data snooping, and costs take much of it. It tends to cut drawdowns more reliably than it raises returns. Diversified across many markets, as time-series momentum: grade A.",
      },
    ],
    task: {
      widget: "expectancy",
      goal: "A trend rule wins 35% of its trades. After costs, a loss costs 1.1R. Find the smallest average win, after costs, that keeps the expectancy above zero.",
      start: { winRate: 35, avgWin: 1.5, avgLoss: 1.1 },
      locked: ["winRate", "avgLoss"],
      success: { field: "avgWin", eq: 2.1, tol: 0.001 },
      feedback: [
        { when: { field: "avgWin", gt: 2.1 }, text: "Positive at {avgWin:1}R: +{expectancy:2}R per trade. Go lower: find the smallest win that still pays." },
        { when: { field: "avgWin", lt: 2.1 }, text: "At {avgWin:1}R the expectancy is {expectancy:2}R. The winners don't yet pay for 65% losers." },
      ],
      correct: "Right: 2.1R. At 2.0R it's just below zero. A rule that wins 35% needs winners about twice its losers, after costs.",
      hints: [
        "Expectancy = win rate × average win − loss rate × average loss.",
        "Break-even: 0.35 × win = 0.65 × 1.1. Solve for the win.",
        "0.715 ÷ 0.35 = 2.04R. The slider moves in steps of 0.1R: take the next step up.",
      ],
      showMe: { avgWin: 2.1 },
      concept: "expectancy",
    },
    check: ["q-2.8.2-1", "q-2.8.2-2", "q-2.8.2-3"],
    recap: {
      takeaways: [
        "Trend following: enter on a cross or a new 20-candle high, stop 2–3 ATR away, exit on a trail.",
        "At 35% wins, winners of 3.2R pay: +0.47R per trade before costs. The edge is in the size.",
        "It loses in ranges, to whipsaws, and at sharp reversals. Expect long losing runs.",
      ],
    },
  },
};

const L283: Lesson = {
  id: "2.8.3",
  title: "Pullback in a trend",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A pullback entry joins a trend after a dip, with a trend filter, a trigger and a stop under the pullback low; it buys a better reward-to-risk than chasing, at the price of missed trades.",
  objectives: [
    "Define a pullback entry with a trend filter, a trigger and a stop below the pullback low.",
    "Compare the reward-to-risk of buying a pullback with chasing the same move.",
    "Recognise the pullback that turns into a reversal.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "mission", ref: "M06", label: "The FOMO Trap" },
  ],
  script: {
    unit: "2.8",
    courseId: "2.8.3",
    hook: {
      prompt: "LABX is trending up. Stop 56.40 under the last swing low, target 61.00. Buy now at 58.40, or wait for a pullback to 57.20? Which gives the better reward-to-risk?",
      control: {
        kind: "choice",
        choices: [
          { id: "now", label: "Buy now at 58.40", feedback: "Buying now risks 2.00 to make 2.60: 1.3 : 1." },
          { id: "wait", label: "Wait for the pullback to 57.20", feedback: "Right: 3.80 ÷ 0.80 = 4.75 : 1." },
          { id: "same", label: "The same either way", feedback: "Same stop and target, different entry: the risk shrinks from 2.00 to 0.80." },
        ],
        answer: "wait",
      },
      compare: "You picked {yours}. Waiting gives 3.80 ÷ 0.80 = 4.75 : 1; buying now, 2.60 ÷ 2.00 = 1.3 : 1. The catch: some pullbacks never come.",
      concept: "trend-pullback",
    },
    learn: [
      {
        kind: "explain",
        title: "Three parts",
        text: "A pullback entry joins a trend after a temporary move against it. It has three parts: a [[trend-filter|trend filter]] (price above a rising SMA 50, higher highs and lows), a dip to the EMA 20 or an old breakout level, and a trigger that shows buyers are back. The stop goes under the pullback low.",
      },
      {
        kind: "figure",
        title: "Pullbacks that held",
        figure: {
          kind: "chart",
          chart: { candles: PB, visible: 40 },
          steps: [
            { text: "An uptrend: price above a rising SMA 50, with higher highs and higher lows.", layers: [PB_SMA] },
            { text: "Three pullbacks reached the EMA 20 and held: candles 11, 22 and 33.", layers: [PB_EMA, ...PB_TOUCHES] },
            { text: "Now price is pulling back a fourth time. Will this one hold?" },
          ],
        },
        concept: "trend-pullback",
      },
      {
        kind: "worked",
        title: "Stop and size",
        lines: [
          "Pullback low 56.80; ATR 0.80. Stop = 56.80 − 0.5 × 0.80 = 56.40.",
          "Entry on the trigger: 57.20. Risk 0.80 per unit, plus commissions of 0.0005 × (57.20 + 56.40).",
          "Size = 100.00 ÷ 0.8568 = 116.7, rounded down = ?",
        ],
        ask: {
          answer: 116,
          tolerance: 0,
          unit: "units",
          feedback: [
            { value: 125, text: "That's 100.00 ÷ 0.80, without commissions. At the stop, 125 units would lose 107.11." },
            { value: 117, text: "Round down. 117 units would lose 100.25 at the stop, over the 1%." },
          ],
          correct: "Right: 116 units lose 99.40 at the stop.",
        },
        after: "A round trip costs about 0.10 of spread plus 0.057 of commission: 0.157 per unit, about 0.20R on a 0.80 stop. Target: the prior swing high, or 2R at 58.80, then trail.",
        concept: "cost-adjusted-sizing",
      },
      {
        kind: "hotspot",
        title: "The pullback that didn't hold",
        prompt: "Here's the rest of the chart. Tap the pullback that turned into a reversal.",
        chart: { candles: PB, layers: [PB_EMA, PB_SMA] },
        zones: [
          { id: "p1", label: "Candle 11", index: 10, feedback: "Candle 11 dipped to 94.98, at the EMA 20, and closed above it. The trend resumed." },
          { id: "p2", label: "Candle 22", index: 21, feedback: "Candle 22 dipped to 96.59 and closed above the EMA 20. Another higher low." },
          { id: "p3", label: "Candle 33", index: 32, feedback: "Candle 33 held at 98.05, a higher low. It was the last one before the turn." },
          { id: "p4", label: "Candle 47", index: 46 },
        ],
        answer: "p4",
        correct: "Candle 47 closed at 97.29, under the SMA 50 at 97.68. One candle earlier, a low of 97.64 broke the last higher low, 98.05. The filter was off.",
        concept: "trend-pullback",
      },
      {
        kind: "match",
        title: "Triggers and what they confirm",
        prompt: "A trigger is the event that says buyers are back. Match each one to what it confirms.",
        pairs: [
          {
            left: "A close back above the prior candle's high",
            right: "Buyers took back the whole of the last candle",
            wrong: "A close above the prior high means the last candle's range was reclaimed, by the close.",
          },
          {
            left: "A buy stop at the high of the candle that touched the EMA",
            right: "Price must trade up through it, or there's no trade",
            wrong: "A buy stop fills only if price rises to it. If the dip keeps going, you're never in.",
          },
          {
            left: "Holy Grail: ADX(14) above 30 and rising, first touch of the 20 MA",
            right: "A strong trend's first pause, not its fifth",
            wrong: "The ADX condition picks strong trends; 'first touch' skips the later, tired pullbacks.",
          },
        ],
        columns: ["Trigger", "What it confirms"],
        correct: "Each trigger trades a slightly worse price for proof that the dip is over. None of them guarantees it.",
        concept: "trend-pullback",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Missed trades are part of the method. If price runs without pulling back, let it go. Buying more than 2 ATR above the EMA 20 is a chase: a worse price for the same stop logic, usually a [[fomo|FOMO]] decision. Evidence: a practitioners' method, [[evidence-grade]] C; the theory behind it, short-term reversals inside momentum, B.",
      },
    ],
    task: {
      widget: "position-size",
      goal: "Pullback low 56.80, ATR 0.80, entry 57.20 on the trigger. Set the stop by the rule, half an ATR under the low. Then type the largest size that risks at most 1%.",
      start: { account: 10000, riskPct: 1, entry: 57.2, stop: 56.8, units: "" },
      locked: ["account", "riskPct", "entry"],
      success: {
        all: [
          { field: "stop", eq: 56.4, tol: 0.001 },
          { field: "units", eq: 116 },
        ],
      },
      feedback: [
        { when: { field: "stop", eq: 56.8, tol: 0.001 }, text: "56.80 is the pullback low itself. The rule puts the stop half an ATR, 0.40, below it." },
        { when: { not: { field: "stop", eq: 56.4, tol: 0.001 } }, text: "Stop = pullback low − 0.5 × ATR = 56.80 − 0.40." },
        { when: { field: "withinBudget", eq: false }, text: "{units} units lose {lossAtStop:2} at the stop: over the 100.00 budget." },
        { when: { field: "units", lt: 116 }, text: "Within budget, but not the largest size. One more unit still fits." },
      ],
      incorrect: "Type a whole number of units for the 56.40 stop.",
      correct: "Right: stop 56.40 and 116 units, {lossAtStop:2} at the stop. Target 2R at 58.80, or the prior swing high.",
      hints: [
        "Stop = pullback low − half an ATR.",
        "Divide 100.00 by the risk per unit plus both commissions: 0.80 + 0.0005 × (57.20 + 56.40).",
        "100.00 ÷ 0.8568 = 116.7. Round down.",
      ],
      showMe: { stop: 56.4, units: 116 },
      concept: "cost-adjusted-sizing",
    },
    check: ["q-2.8.3-1", "q-2.8.3-2", "q-2.8.3-3"],
    recap: {
      takeaways: [
        "Pullback entry: a trend filter, a dip to the EMA 20 or old breakout, a trigger, a stop under it.",
        "Waiting for the pullback bought 4.75 : 1 instead of 1.3 : 1. Some pullbacks never come; let them go.",
        "A lower low under the last higher low, or a close under the 50: the pullback became a reversal.",
      ],
    },
  },
};

const L284: Lesson = {
  id: "2.8.4",
  title: "Breakout from a range",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A range breakout buys a close beyond a tested level, with a stop back inside and a measured-move target; it needs only about 30% winners, and most of its trades are small losses.",
  objectives: [
    "Write breakout rules: a tested level, a close beyond it, a stop back inside, a measured-move target.",
    "Compute the break-even win rate of a breakout before and after costs.",
    "Name the conditions in which breakouts fail most often.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
    { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
  ],
  script: {
    unit: "2.8",
    courseId: "2.8.4",
    hook: {
      prompt: "LABX ranged between 97.00 and 100.00 for 30 candles, then closed at 100.15. Stop back inside at 99.20, target the measured move at 103.00. With costs of 0.20 per unit, what win rate does this trade need to break even?",
      control: {
        kind: "slider",
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        start: 50,
        answer: 30,
        tolerance: 3,
        feedback: [
          { from: 0, to: 20, text: "Too low. Even before costs it needs 0.95 ÷ 3.80 = 25%." },
          { from: 21, to: 27, text: "That's about the before-costs figure, 25%. Costs add 0.20 to every loss and take 0.20 from every win." },
          { from: 28, to: 33, text: "Right: 1.15 ÷ 3.80 = 30.3%." },
          { from: 34, to: 100, text: "Too high. A win pays 2.65 after costs and a loss costs 1.15: about 30% is enough." },
        ],
      },
      compare: "You said {yours}. After costs: 1.15 ÷ (1.15 + 2.65) = 30.3%. Before costs: 0.95 ÷ 3.80 = 25.0%. Costs alone add five points.",
      concept: "range-breakout-strategy",
    },
    learn: [
      {
        kind: "explain",
        title: "The breakout card",
        text: "**Setup:** a level touched at least twice, a range of 20 candles or more; ideally, [[volume]] on the [[breakout]] candle above its 20-candle average. **Entry:** a close beyond the level, a buy stop just above it, or a retest that holds. **Stop:** back inside, under the breakout candle's low. **Target:** the range's height added to the level, the [[measured-move|measured move]].",
      },
      {
        kind: "figure",
        title: "A tested range, then a close outside",
        figure: {
          kind: "chart",
          chart: { candles: RB.slice(0, 31), volume: true },
          steps: [
            { text: "LABX between 97.00 and 100.00 for 30 candles.", layers: RB_EDGES },
            { text: "Touches at 100.00 on candles 6, 14 and 25; at 97.00 on 10 and 19.", layers: RB_TOUCHES },
            {
              text: "Candle 31 closes at 100.15, on 1.8 times the 20-candle average volume.",
              layers: [{ kind: "marker", index: 30, at: "close", label: "CLOSE 100.15", role: "accent" }],
            },
          ],
        },
        concept: "range-breakout-strategy",
      },
      {
        kind: "task",
        title: "Mark the level",
        task: {
          widget: "level-drawer",
          goal: "Draw the resistance band the breakout has to clear: a tight band around the highs that turned price down.",
          data: { chart: { candles: RB.slice(0, 30) } },
          start: { role: "resistance", bandLow: 98.8, bandHigh: 99.1 },
          locked: ["role"],
          success: {
            all: [
              { field: "touches", gte: 3 },
              { field: "height", gte: 0.1, lte: 0.4 },
            ],
          },
          feedback: [
            { when: { field: "height", lt: 0.1 }, text: "A band thinner than 0.10 is a line. Widen it to cover the turns." },
            { when: { field: "height", gt: 0.4 }, text: "That band is {height:2} tall: it catches almost anything. Tighten it around the turns." },
            { when: { field: "touches", lt: 3 }, text: "Only {touches} turns sit inside your band. The highs that turned price down are all near the top of the range." },
          ],
          correct: "{touches} turns between {bandLow:2} and {bandHigh:2}: a tested level. A close above it is the signal.",
          hints: [
            "Find the highs where price turned down. Are they at one price?",
            "Three swing highs stopped at the same price, the top of the range.",
            "Draw the band from about 99.85 to 100.05.",
          ],
          showMe: { bandLow: 99.85, bandHigh: 100.05 },
          concept: "support-and-resistance",
        },
      },
      {
        kind: "worked",
        title: "The numbers before you click",
        lines: [
          "Target = 100.00 + range height 3.00 = 103.00.",
          "Reward 103.00 − 100.15 = 2.85; risk 100.15 − 99.20 = 0.95: 3.0 : 1.",
          "After 0.20 of costs: a win pays 2.65, a loss costs 1.15.",
          "Break-even win rate = 1.15 ÷ (1.15 + 2.65) = ?",
        ],
        ask: {
          answer: 30.3,
          tolerance: 0.2,
          unit: "%",
          feedback: [
            { value: 25, text: "That's before costs: 0.95 ÷ 3.80. Use the after-cost loss and win." },
            { value: 43.4, text: "That's 1.15 ÷ 2.65, the loss over the win. Divide by their sum." },
          ],
          correct: "Right: 30.3%. Three wins in ten roughly pay for seven losses.",
        },
        after: "Size for 1%: 95 units risk 99.73 with commissions; 96 would risk 100.78. Position value 9,514.25, within the 10,000.00 account.",
        concept: "range-breakout-strategy",
      },
      {
        kind: "reveal",
        title: "One breakout, played out",
        prompt: "You bought 95 at 100.15, stop 99.20, target 103.00. Reveal the next 6 candles. What happened?",
        chart: { candles: RB, visible: 31, volume: true, layers: RB_PLAN },
        choices: [
          { id: "target", label: "Reached the target", feedback: "Not this time: the highest price after entry was 100.45." },
          { id: "stop", label: "Stopped at 99.20", feedback: "Right. Candle 34's bid fell to 99.05, through the stop." },
          { id: "open", label: "Still open", feedback: "Candle 34's bid reached 99.05, under the stop at 99.20." },
        ],
        answer: "stop",
        after: "Price fell back inside, and candle 34 hit the stop: −99.73, the planned 1R. Normal for this strategy. A win at 103.00 would have paid about 2.3 times the loss; the ratio of wins to losses over many trades decides.",
        concept: "false-breakout",
      },
      {
        kind: "match",
        title: "Filters that cut the failures",
        prompt: "Breakouts fail most often from untested levels, on wicks, on low volume and late in long moves. Match each filter to why it helps.",
        pairs: [
          { left: "At least two touches", right: "The level mattered to other traders", wrong: "A level that turned price more than once is one other traders also watch." },
          { left: "A close beyond, not a wick", right: "Fewer fakeouts that reverse inside the candle", wrong: "Wicks poke through and come back. A close shows price stayed outside." },
          { left: "Volume above its 20-candle average", right: "Real participation behind the move", wrong: "Volume shows how many traders pushed. A thin push is easy to reverse." },
          { left: "No breakout after a long run", right: "The move may already be spent", wrong: "After a long run, the buyers who'd chase are mostly in already." },
        ],
        columns: ["Filter", "Why it helps"],
        correct: "Filters cut failures, but they also cut trades: each one leaves fewer to judge.",
        concept: "range-breakout-strategy",
      },
      {
        kind: "explain",
        title: "What the evidence says",
        text: "Breakouts of drawn support and resistance: [[evidence-grade]] C to D. The level is subjective, and it always looks cleaner in hindsight. A rule-based channel breakout, a close above the 20-candle high, is better tested: grade B on one market, A only when diversified across many, as time-series momentum. Either way, judge it after costs.",
      },
    ],
    task: {
      widget: "bracket-builder",
      goal: "Plan the breakout bought at 100.15: the stop 0.10 under the breakout candle's 99.30 low, the target at the measured move. Size is fixed at 95 units, the 1% size.",
      data: { chart: { candles: RB.slice(0, 31), layers: RB_EDGES }, entry: 100.15, units: 95 },
      start: { stop: 99.5, target: 101, units: 95 },
      locked: ["units"],
      success: {
        all: [
          { field: "stop", eq: 99.2, tol: 0.001 },
          { field: "target", eq: 103, tol: 0.001 },
        ],
      },
      feedback: [
        { when: { field: "stop", gt: 99.2 }, text: "{stop:2} sits inside the breakout candle, which traded down to 99.30. Put the stop 0.10 under its low." },
        { when: { field: "stop", lt: 99.2 }, text: "{stop:2} is further than the rule needs: 0.10 under the breakout candle's low, 99.30." },
        { when: { field: "target", lt: 103 }, text: "The measured move adds the range's height, 3.00, to the 100.00 level." },
        { when: { field: "target", gt: 103 }, text: "{target:2} is past the measured move: the 3.00 height added to 100.00." },
      ],
      correct: "Stop 99.20, target 103.00: {rr:2} : 1 before costs. 95 units lose {lossAfter:2} at the stop with commissions and make {gainAfter:2} at the target.",
      hints: [
        "The breakout candle's low is 99.30. The stop goes just under it, back inside the range.",
        "Measured move: the range's height, 100.00 − 97.00, added to the level.",
        "Stop 99.20; target 100.00 + 3.00 = 103.00.",
      ],
      showMe: { stop: 99.2, target: 103 },
      concept: "range-breakout-strategy",
    },
    check: ["q-2.8.4-1", "q-2.8.4-2", "q-2.8.4-3"],
    recap: {
      takeaways: [
        "Breakout card: a level touched twice, a close beyond it, a stop back inside, the measured-move target.",
        "Costs lift break-even from 25.0% to 30.3% here: three wins in ten pay for seven losses.",
        "Breakouts fail most from untested levels, wicks, low volume and late entries after long moves.",
      ],
    },
  },
};

const L285: Lesson = {
  id: "2.8.5",
  title: "Volatility contraction breakout",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A volatility contraction bets on a bigger move, not a direction: an OCO bracket around an NR7 or a squeeze, with stops so tight that costs and two-sided whipsaws decide the result.",
  objectives: [
    "Spot a volatility contraction: an NR7 candle, an inside bar or a Bollinger squeeze.",
    "Place an OCO bracket around the contraction and size each side to 1%.",
    "Explain why tight compressions raise the cost in R and why both sides can lose.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "low_volatility", label: "Arena: low volatility" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "2.8",
    courseId: "2.8.5",
    hook: {
      prompt: "LABX's last 7 candle ranges: 1.10, 0.95, 1.30, 1.20, 1.05, 1.15, 0.90. Will the next 5 candles be wider or narrower than the last one? And which way will price go?",
      control: {
        kind: "choice",
        choices: [
          { id: "wider-up", label: "Wider, and up", feedback: "Wider is the better bet. Up isn't: nothing in the ranges points a way." },
          { id: "wider", label: "Wider; the direction can't be told", feedback: "Right on both counts." },
          { id: "narrower", label: "Narrower; the direction can't be told", feedback: "Quiet does cluster, but 0.90 is the outlier here: the six before it averaged 1.125." },
          { id: "narrower-down", label: "Narrower, and down", feedback: "0.90 is unusually narrow for this stretch, and the ranges say nothing about direction." },
        ],
        answer: "wider",
      },
      compare: "You picked {yours}. 0.90 is the narrowest of the 7: an NR7. Ranges tend to return to their recent level, so wider is the better bet. Direction: no edge. Hence a bracket on both sides.",
      concept: "volatility-contraction-breakout",
    },
    learn: [
      {
        kind: "explain",
        title: "Quiet before a move",
        text: "A [[volatility-contraction|volatility contraction]] is a stretch of unusually small candles. Three common forms: an [[nr7|NR7]], the narrowest candle of the last seven; an [[inside-bar|inside bar]], within the previous candle's range; and a [[squeeze|Bollinger squeeze]], the bands at their narrowest in months. The bet: a bigger move is coming. Not which way.",
      },
      {
        kind: "hotspot",
        title: "Find the NR7",
        prompt: "Tap the NR7: the candle narrower than each of the six before it.",
        chart: { candles: VC.slice(0, 12) },
        zones: [
          { id: "c2", label: "Candle 2", index: 1, feedback: "Candle 2's range, 0.85, is narrow, but only one candle comes before it. An NR7 is compared with six." },
          { id: "c7", label: "Candle 7", index: 6, feedback: "Candle 7's range is 0.95, but candle 2's 0.85 is within its last seven." },
          { id: "c10", label: "Candle 10", index: 9, feedback: "Candle 10's range is 1.05, wider than candle 7's 0.95." },
          { id: "c12", label: "Candle 12", index: 11 },
        ],
        answer: "c12",
        correct: "Candle 12: a range of 0.90, narrower than each of the six before it: 1.10, 0.95, 1.30, 1.20, 1.05 and 1.15.",
        concept: "volatility-contraction-breakout",
      },
      {
        kind: "figure",
        title: "An OCO bracket around it",
        text: "One stop order on each side. When one fills, the [[oco-order|OCO]] link cancels the other.",
        figure: {
          kind: "chart",
          chart: { candles: VC.slice(0, 12) },
          steps: [
            { text: "The NR7: high 100.60, low 99.70.", layers: VC_NR7 },
            { text: "Buy stop at 100.65, sell stop at 99.65: 0.05 beyond each end.", layers: VC_ORDERS },
            {
              text: "Each side's protective stop sits at the other side's entry: 1.00 away.",
              layers: [{ kind: "bracket", from: 99.65, to: 100.65, index: 11, label: "1.00", role: "neutral" }],
            },
          ],
        },
        concept: "bracket-order",
      },
      {
        kind: "worked",
        title: "Tight stop, heavy costs",
        lines: [
          "Round trip ≈ 0.20 per unit; stop 1.00. Cost in R = 0.20 ÷ 1.00 = 0.20R.",
          "Long: buy 100.65, stop 99.65. 90 units risk 99.02 with commissions; 91 would risk 100.12.",
          "Short: sell 99.65, stop 100.65. Also 90 units, 99.02.",
          "Both sides fill and both are stopped. Total loss = ?",
        ],
        ask: {
          answer: 198.04,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 99.02, text: "That's one side. Both filled, and both were stopped." },
            { value: 200, text: "That's twice the budget. Each side actually risks 99.02 with commissions." },
          ],
          correct: "Right: 198.04, about 2% of the account from one setup.",
        },
        after: "How can both fill, with OCO? The first fill cancels the other order. But many bracket plans re-arm the other side after a stop, and the long's stop at 99.65 is exactly the short's entry. Sideways chop then costs twice.",
        concept: "volatility-contraction-breakout",
      },
      {
        kind: "reveal",
        title: "Three endings, one played",
        prompt: "The bracket is set, and the plan re-arms the other side after any stop. Reveal the next 6 candles. Which ending was it?",
        chart: { candles: VC, visible: 12, layers: VC_ORDERS },
        choices: [
          { id: "up", label: "Expansion up: the long wins", feedback: "Candle 13 did fill the long at 100.65, but candle 15 fell to 99.10 and stopped it." },
          { id: "down", label: "Expansion down: the short wins", feedback: "The short filled at 99.65 on candle 15, but candle 17 rose to 101.15 and stopped it." },
          { id: "both", label: "Chop: both sides stopped", feedback: "Right: two fills, two stops." },
        ],
        answer: "both",
        after: "Long filled on candle 13, stopped on 15; short filled on 15, stopped on 17: −198.04. The ranges did widen, to 1.00–1.15. The direction never followed through.",
        concept: "volatility-contraction-breakout",
      },
      {
        kind: "predict",
        title: "A tighter squeeze",
        prompt: "The next NR7 is half as wide, so each stop is 0.50 away. Costs are still about 0.20 per unit. What does a round trip cost in R now?",
        control: {
          kind: "numeric",
          unit: "R",
          answer: 0.4,
          tolerance: 0.01,
          feedback: [
            { value: 0.2, text: "That was the 1.00 stop. Halve the stop and the cost in R doubles." },
            { value: 0.1, text: "That's 0.05 ÷ 0.50. The round trip costs about 0.20 per unit." },
          ],
        },
        reveal: "0.20 ÷ 0.50 = 0.40R. The tighter the compression, the more of each trade costs take. And 1% at a 0.50 stop would need 166 units: without leverage, 10,000.00 buys at most 99 at 100.65.",
        concept: "volatility-contraction-breakout",
      },
      {
        kind: "callout",
        tone: "key",
        text: "[[volatility-clustering|Volatility clustering]], calm following calm and storms following storms, is one of the best-documented facts about markets: [[evidence-grade]] A. Trading the direction after a contraction is not: grade C, weak after costs. The bracket bets on movement, pays the spread on every fill, and can lose on both sides.",
      },
    ],
    task: {
      widget: "position-size",
      goal: "Set the long side of the bracket: the buy stop 0.05 above the NR7's 100.60 high, the stop 0.05 under its 99.70 low. Then type the largest size within 1%.",
      start: { account: 10000, riskPct: 1, entry: 100.6, stop: 99.7, units: "" },
      locked: ["account", "riskPct"],
      success: {
        all: [
          { field: "entry", eq: 100.65, tol: 0.001 },
          { field: "stop", eq: 99.65, tol: 0.001 },
          { field: "units", eq: 90 },
        ],
      },
      feedback: [
        { when: { field: "entry", eq: 100.6, tol: 0.001 }, text: "100.60 is the NR7's high itself. The buy stop goes 0.05 above it." },
        { when: { not: { field: "entry", eq: 100.65, tol: 0.001 } }, text: "The buy stop goes 0.05 beyond the high: 100.60 + 0.05." },
        { when: { not: { field: "stop", eq: 99.65, tol: 0.001 } }, text: "The long's stop sits on the other side: 0.05 under the 99.70 low." },
        { when: { field: "withinBudget", eq: false }, text: "{units} units lose {lossAtStop:2} at the stop: over the 100.00 budget." },
        { when: { field: "units", lt: 90 }, text: "Within budget, but not the largest size. One more unit still fits." },
      ],
      incorrect: "Type a whole number of units for the 100.65 entry and 99.65 stop.",
      correct: "Right: 90 units, {lossAtStop:2} at the stop. The short side mirrors it: 90 units, 99.02. Two sides, two budgets.",
      hints: [
        "Both orders sit 0.05 beyond the NR7: 100.60 + 0.05 and 99.70 − 0.05.",
        "Risk per unit is 1.00, plus about 0.10 of commissions.",
        "100.00 ÷ 1.10 = 90.9. Round down.",
      ],
      showMe: { entry: 100.65, stop: 99.65, units: 90 },
      concept: "volatility-contraction-breakout",
    },
    check: ["q-2.8.5-1", "q-2.8.5-2", "q-2.8.5-3"],
    recap: {
      takeaways: [
        "A contraction, such as an NR7, an inside bar or a squeeze, predicts a bigger move, not its direction.",
        "OCO bracket 0.05 beyond each end; size each side to 1%: 90 units at a 1.00 stop.",
        "A 1.00 stop pays 0.20R in costs; a 0.50 stop, 0.40R. Chop can stop both sides.",
      ],
    },
  },
};

const L286: Lesson = {
  id: "2.8.6",
  title: "Range trading",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Range trading buys near support and sells near resistance in a confirmed range, with stops just outside the edges, until the first close outside the range ends it.",
  objectives: [
    "Confirm a range before trading it: two touches on each side and flat averages.",
    "Plan a range trade with a stop outside the edge and a target near the other side.",
    "Apply the flip rule: stop range trading on the first confirmed close outside the range.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "2.8",
    courseId: "2.8.6",
    hook: {
      prompt: "Same 97.00–100.00 range. Buy at 97.30, stop 96.40, target 99.70. What is the reward-to-risk before costs, and after 0.20 per unit?",
      control: {
        kind: "choice",
        choices: [
          { id: "same", label: "2.67 : 1 before, 2.67 : 1 after", feedback: "Costs come out of both sides: the win shrinks by 0.20 and the loss grows by 0.20." },
          { id: "right", label: "2.67 : 1 before, 2.0 : 1 after", feedback: "Right: 2.40 ÷ 0.90, then 2.20 ÷ 1.10." },
          { id: "reward", label: "2.67 : 1 before, 2.44 : 1 after", feedback: "That takes the cost off the win only: 2.20 ÷ 0.90. The loss grows too, to 1.10." },
          { id: "swap", label: "2.0 : 1 before, 2.67 : 1 after", feedback: "Costs never improve a ratio. Before costs: 2.40 ÷ 0.90 = 2.67." },
        ],
        answer: "right",
      },
      compare: "You picked {yours}. Before costs: 2.40 ÷ 0.90 = 2.67 : 1. After 0.20 per unit: 2.20 ÷ 1.10 = 2.0 : 1. Break-even climbs from 27.3% to 33.3%.",
      concept: "range-trading",
    },
    learn: [
      {
        kind: "explain",
        title: "The range card",
        text: "[[range-trading|Range trading]]. **Confirm:** at least two touches on each edge, flat averages, [[adx|ADX]] under 20. **Entry:** a buy limit near support, or a reversal candle there; shorts near resistance, mirrored. **Stop:** just outside the edge. **Exit:** near the other edge or the middle. **Flip:** the first close outside ends the range.",
      },
      {
        kind: "figure",
        title: "A confirmed range",
        figure: {
          kind: "chart",
          chart: { candles: RT.slice(0, 40) },
          steps: [
            { text: "The same range: 100.00 touched on candles 6, 14, 25; 97.00 on 10, 19, 34.", layers: [...RB_EDGES, ...RT_TOUCHES] },
            { text: "The 20-candle average stays between 98.5 and 98.9: flat.", layers: [{ kind: "ma", period: 20, role: "concept", label: "SMA 20" }] },
            { text: "Buy limit 97.30, stop 96.40 outside support, target 99.70 under resistance.", layers: RT_PLAN },
          ],
        },
        concept: "range-trading",
      },
      {
        kind: "worked",
        title: "Size and costs",
        lines: [
          "Buy 97.30, stop 96.40: risk 0.90 per unit before costs.",
          "Commissions per unit ≈ 0.0005 × (97.30 + 96.40) = 0.097.",
          "100.00 ÷ 0.997 = 100.3. Largest whole size within 1% = ?",
        ],
        ask: {
          answer: 100,
          tolerance: 0,
          unit: "units",
          feedback: [
            { value: 111, text: "That's 100.00 ÷ 0.90, without commissions. 111 units would lose 110.67 at the stop." },
            { value: 101, text: "Round down. 101 units would lose 100.69, over the 1%." },
          ],
          correct: "Right: 100 units lose 99.69 at the stop; 101 would lose 100.69.",
        },
        after: "Small targets make costs heavy: each round trip takes about 0.20 of a 2.40 reward, 8%. And a range trader trades often.",
        concept: "range-trading",
      },
      {
        kind: "reveal",
        title: "Then it breaks",
        prompt: "Your card worked both edges: the long from 97.30 on candle 34 hit 99.70 on candle 39, where a short opened. Reveal the next 6 candles. What does the card say now?",
        chart: { candles: RT, visible: 40, layers: RB_EDGES },
        choices: [
          { id: "sell", label: "Sell the next rally to 99.70", feedback: "The range is over: candle 41 closed at 100.40. Selling 99.70 now fights the breakout." },
          { id: "flip", label: "Stop range trading: switch to the breakout card", feedback: "Right. The first close outside ended the range." },
          { id: "buy", label: "Buy the next dip to 97.30", feedback: "There's no range left to buy the bottom of. The flip rule has fired." },
        ],
        answer: "flip",
        after: "Candle 41 closed at 100.40, outside the range, and its high took out your short's stop at 100.60. That's where range traders take their biggest losses. The flip rule: after the first close outside, no new range trades.",
        concept: "range-trading",
      },
      {
        kind: "order",
        title: "The range rules, in order",
        prompt: "Put the range trader's steps in order.",
        items: [
          "Confirm the range: two touches on each edge, flat averages",
          "Enter near an edge: a limit or a reversal candle",
          "Put the stop just outside that edge",
          "Exit near the other edge or the middle",
          "On the first close outside: stop, and switch to the breakout card",
        ],
        explain: "Confirmation comes before any entry, and the flip rule overrides everything once the range breaks.",
        concept: "range-trading",
      },
      {
        kind: "predict",
        title: "When the stop is jumped",
        prompt: "You're long 100 at 97.30, stop 96.40. Bad news overnight: LABX opens at 95.80, under your stop. How many R do you lose, with commissions, against the planned 99.69?",
        control: {
          kind: "numeric",
          unit: "R",
          answer: 1.6,
          tolerance: 0.05,
          feedback: [
            { value: 1, text: "A stop isn't a guarantee. After a gap it fills at the first price available: 95.80." },
            { value: 1.67, text: "That's 1.50 ÷ 0.90, per unit before commissions. In money: 150.00 + 4.87 + 4.79 = 159.66." },
          ],
        },
        reveal: "100 × 1.50 + 4.87 + 4.79 = 159.66, about 1.6R. A gap through the edge, like a breakout, is where a range trade's big losses come from.",
        concept: "gap-risk",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Mean reversion inside ranges shows up in some markets and horizons and vanishes in others: [[evidence-grade]] C. It depends on the regime holding. The reward-to-risk after costs is plain arithmetic. Trade the range only while it's confirmed, and let the first close outside end it.",
      },
    ],
    task: {
      widget: "bias-spotter",
      goal: "Six moments around a 97.00–100.00 range. For each, decide: trade the range, stop and switch to the breakout card, or no trade because the range isn't confirmed.",
      data: { cards: RANGE_CARDS, options: RANGE_OPTIONS },
      success: { field: "solved", eq: 6 },
      correct: "Six calls made. Confirm first, trade the edges, and let the first close outside end the range.",
      hints: [
        "Count the touches: at least two on each edge before any range trade.",
        "A wick outside doesn't end the range. A close outside does.",
        "Rising lows or a rising average mean the range is turning into a trend.",
      ],
      showMe: { solved: 6 },
      concept: "range-trading",
    },
    check: ["q-2.8.6-1", "q-2.8.6-2", "q-2.8.6-3"],
    recap: {
      takeaways: [
        "Confirm before you trade: two touches on each edge and flat averages.",
        "Stop just outside the edge, target near the other. Costs lift break-even from 27.3% to 33.3%.",
        "The first close outside ends the range: no new range trades; switch to the breakout card.",
      ],
    },
  },
};

const L287: Lesson = {
  id: "2.8.7",
  title: "Mean reversion",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Mean reversion fades stretched prices back to an average: it wins often and loses rarely but big, so a high win rate can hide a negative expectancy unless a catastrophic stop caps the tail.",
  objectives: [
    "Describe two mean-reversion rules: Bollinger reversion and RSI(2).",
    "Explain why a high win rate can hide a negative expectancy (negative skew).",
    "Keep a catastrophic stop on every mean-reversion trade.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "arena", ref: "bearish", label: "Arena: bearish" },
  ],
  script: {
    unit: "2.8",
    courseId: "2.8.7",
    hook: {
      prompt: "A mean-reversion rule won 15 of its last 20 trades at +0.5R each. Four losses were −1R; one gap loss was −5R. Did it make money?",
      control: {
        kind: "choice",
        choices: [
          { id: "made", label: "Made money", feedback: "15 wins of +0.5R make +7.5R. The five losses take 9R." },
          { id: "lost", label: "Lost money", feedback: "Right: three wins in four, and still a loss." },
          { id: "cant", label: "Can't tell", feedback: "You have all the numbers: 15 × 0.5 − 4 × 1 − 5." },
        ],
        answer: "lost",
      },
      compare: "You said {yours}. 15 × 0.5 − 4 × 1 − 5 = −1.5R, with a 75% win rate. One gap loss erased ten wins.",
      concept: "return-skew",
    },
    learn: [
      {
        kind: "explain",
        title: "Two reversion rules",
        text: "[[mean-reversion|Mean reversion]] bets that a stretched price snaps back to its average. **Bollinger reversion:** in a range with a flat SMA 20, buy a close under the lower [[bollinger-bands|band]]; exit at the middle band. **RSI(2)** (Connors and Alvarez, 2008): with the close above the SMA 200, buy when RSI(2) drops under 10; exit on a close above the SMA 5.",
      },
      {
        kind: "figure",
        title: "Same rule, two regimes",
        figure: {
          kind: "chart",
          chart: { candles: BB },
          steps: [
            { text: "Bollinger bands (20, 2). Buy a close under the lower band; exit at the middle.", layers: BB_BANDS },
            { text: "In the range, candles 4 and 14 closed under the band. Both reached the middle 2 candles later.", layers: BB_RANGE_BUYS },
            { text: "Then a downtrend: buys on candles 26, 30, 36 and 41.", layers: BB_TREND_BUYS },
            { text: "None reached the middle band. Price walked down the lower band instead." },
          ],
        },
        concept: "mean-reversion",
      },
      {
        kind: "worked",
        title: "A 75% win rate, in R",
        lines: ["15 wins × +0.5R = +7.5R.", "4 losses × −1R = −4R; 1 gap × −5R = −5R.", "Total = ?"],
        ask: {
          answer: -1.5,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 3.5, text: "That leaves out the gap loss of −5R. Count all five losses." },
            { value: 7.5, text: "That's the wins alone. Subtract the 9R of losses." },
          ],
          correct: "Right: −1.5R, from a rule that won three trades in four.",
        },
        after: "Average win 0.5R; average loss (4 + 5) ÷ 5 = 1.8R. At 75% wins, the rule breaks even only if losses average 1.5R or less.",
        concept: "return-skew",
      },
      {
        kind: "figure",
        title: "Two shapes of results",
        text: "[[negative-skew|Negative skew]]: many small wins, rare large losses. Trend following has the opposite shape.",
        figure: {
          kind: "bars",
          bars: [
            { label: "TF −1R", value: 13, role: "down" },
            { label: "TF +1R", value: 3, role: "up" },
            { label: "TF +3R", value: 2, role: "up" },
            { label: "TF +6.7R", value: 2, role: "up" },
            { label: "MR −5R", value: 1, role: "down" },
            { label: "MR −1R", value: 4, role: "down" },
            { label: "MR +0.5R", value: 15, role: "up" },
          ],
          unit: "trades",
          steps: [
            "Trend following (TF), 20 trades: 13 small losses, 7 wins averaging +3.2R. Positive skew.",
            "Mean reversion (MR), 20 trades: 15 small wins, 4 losses of 1R and one of 5R. Negative skew.",
          ],
        },
        concept: "return-skew",
      },
      {
        kind: "predict",
        title: "The stop Connors left out",
        prompt: "Connors reported that stops hurt RSI(2) in his tests. In a crash, which version has the worse worst trade: with a 3-ATR catastrophic stop, or without one?",
        control: {
          kind: "choice",
          choices: [
            { id: "with", label: "With the stop" },
            { id: "without", label: "Without a stop" },
            { id: "same", label: "About the same" },
          ],
          answer: "without",
        },
        reveal: "Without. Oversold can get much more oversold: with no stop, the worst trade is whatever the crash does. A 3-ATR stop caps a normal day's loss; only a gap can jump it. Stops cost some backtest return. This course keeps one on every mean-reversion trade.",
        concept: "mean-reversion",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Bollinger reversion: Lento and colleagues (2007) found no consistent edge over buy-and-hold, and prices stayed inside the bands about 88% of the time, not 95%: [[evidence-grade]] C. RSI(2): practitioners' backtests on US indices that depend on the period, C to B. Both: high win rates, small wins, rare big losses.",
      },
    ],
    task: {
      widget: "expectancy",
      goal: "A mean-reversion rule wins 75% of its trades at +0.5R. Find the average loss at which it breaks even.",
      start: { winRate: 75, avgWin: 0.5, avgLoss: 1 },
      locked: ["winRate", "avgWin"],
      success: { field: "avgLoss", eq: 1.5, tol: 0.001 },
      feedback: [
        { when: { field: "avgLoss", lt: 1.5 }, text: "At {avgLoss:1}R the rule still makes +{expectancy:2}R a trade. Push the average loss up until that reaches zero." },
        { when: { field: "avgLoss", gt: 1.5 }, text: "At {avgLoss:1}R the expectancy is {expectancy:2}R: past break-even. Bring it down." },
      ],
      correct: "Right: 0.75 × 0.5 = 0.25 × 1.5. In the hook, the average loss was (4 + 5) ÷ 5 = 1.8R, past break-even. One gap did that.",
      hints: [
        "Break-even: win rate × average win = loss rate × average loss.",
        "0.75 × 0.5 = 0.375. Divide by the loss rate, 0.25.",
        "0.375 ÷ 0.25 = 1.5R.",
      ],
      showMe: { avgLoss: 1.5 },
      concept: "return-skew",
    },
    check: ["q-2.8.7-1", "q-2.8.7-2", "q-2.8.7-3"],
    recap: {
      takeaways: [
        "Bollinger reversion buys under the lower band in a range; RSI(2) buys dips above the SMA 200.",
        "A 75% win rate lost 1.5R: small wins, rare big losses. Check the average loss.",
        "Keep a catastrophic stop on every reversion trade: oversold can get more oversold, and gaps jump stops.",
      ],
    },
  },
};

const L288: Lesson = {
  id: "2.8.8",
  title: "Failed breakout",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A failed-breakout trade sells a new 20-candle high that falls back inside the range, with a stop just above the spike; it mirrors the breakout, and the regime evidence decides which one to play.",
  objectives: [
    "Define a failed-breakout trade (Turtle Soup) with exact entry and stop rules.",
    "Explain why it mirrors the breakout strategy and when each one fits.",
    "Choose breakout, fade or no trade from the regime evidence, not from the last result.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "2.8",
    courseId: "2.8.8",
    hook: {
      prompt: "Same 97.00–100.00 range. Price spikes to 100.70, then closes at 99.80. Trader A bought the breakout at 100.15. Trader B sells the failure at 99.90. Can both rules be right over 100 trades?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Only A", feedback: "A's breakout wins when the range ends. Ranges don't always end." },
          { id: "b", label: "Only B", feedback: "B's fade wins when the push fails. Some pushes don't." },
          { id: "both", label: "Both, in different regimes", feedback: "Right: each has its regime." },
          { id: "neither", label: "Neither", feedback: "On a random walk, yes: both lose their costs. On real ranges and trends, each has its regime." },
        ],
        answer: "both",
      },
      compare: "You picked {yours}. Both, in different regimes: A wins when the range turns into a trend, B when it carries on. On a random walk both lose about their costs.",
      concept: "failed-breakout-strategy",
    },
    learn: [
      {
        kind: "explain",
        title: "Turtle Soup",
        text: "[[turtle-soup|Turtle Soup]] fades a failed breakout. **Setup:** a new 20-candle high, with the previous 20-candle high at least 4 candles earlier. **Entry:** a sell stop just under the old high, here 99.90 under 100.00, valid on this candle only. **Stop:** just above the new extreme. **Target:** the far side of the range, or half there, then trail.",
      },
      {
        kind: "reveal",
        title: "The spike, played out",
        prompt: "Candle 31 spiked to 100.70, a new 20-candle high, then closed at 99.80. Trader B sold at 99.90, stop 100.80, target 97.60. Reveal the next 6 candles.",
        chart: { candles: SPIKE, visible: 31, volume: true, layers: SPIKE_PLAN },
        choices: [
          { id: "target", label: "Reached 97.60", feedback: "Right: candle 36's ask touched 97.55." },
          { id: "stop", label: "Stopped at 100.80", feedback: "The highest ask after entry was 100.00, far from 100.80." },
          { id: "open", label: "Still open", feedback: "Candle 36's ask reached 97.55, under the 97.60 target." },
        ],
        answer: "target",
        after: "Candle 36 hit 97.60. Trader A, long from 100.15 with the breakout card's stop at 99.20, was stopped on candle 32. The spike came on 0.7 times the average volume: few buyers behind it.",
        concept: "failed-breakout-strategy",
      },
      {
        kind: "worked",
        title: "The fade in numbers",
        lines: [
          "Sell 99.90, stop 100.80: risk 0.90. Target 97.60: reward 2.30. Gross 2.56 : 1.",
          "After 0.20 of costs: a win pays 2.10, a loss costs 1.10.",
          "Break-even win rate = 1.10 ÷ (1.10 + 2.10) = ?",
        ],
        ask: {
          answer: 34.4,
          tolerance: 0.2,
          unit: "%",
          feedback: [
            { value: 28.1, text: "That's before costs: 0.90 ÷ 3.20. Use 1.10 and 2.10." },
            { value: 52.4, text: "That's 1.10 ÷ 2.10. Divide by their sum, 3.20." },
          ],
          correct: "Right: 34.4%.",
        },
        after: "Size: 99 units risk 99.04 with commissions; 100 would risk 100.04. A short is sized like a long, from the distance to its stop.",
        concept: "failed-breakout-strategy",
      },
      {
        kind: "match",
        title: "Breakout or fade?",
        prompt: "The same push beyond 100.00 can start a trend or set a trap. Sort the signs.",
        pairs: [
          { left: "A close back inside the range", right: "Fade", wrong: "Closing back inside means the push couldn't hold. That's the fade's signal." },
          { left: "Low volume on the push", right: "Fade", wrong: "A thin push has few buyers behind it, so it's easy to reverse." },
          { left: "A fast return under the old high", right: "Fade", wrong: "Speed matters: a quick return traps the breakout buyers." },
          { left: "Two closes outside, on high volume", right: "Breakout", wrong: "Repeated closes outside, with participation, are the breakout's evidence." },
          { left: "A retest of 100.00 that holds from above", right: "Breakout", wrong: "Old resistance acting as support is evidence the range has ended." },
        ],
        columns: ["Sign", "Favours"],
        correct: "Signs, not the last result, pick the card. With no clear signs, pass.",
        concept: "failed-breakout-strategy",
      },
      {
        kind: "predict",
        title: "On a random walk",
        prompt: "Run both rules, the breakout and the fade, on a random walk for 100 trades each. Which one wins?",
        control: {
          kind: "choice",
          choices: [
            { id: "breakout", label: "The breakout" },
            { id: "fade", label: "The fade" },
            { id: "both", label: "Both" },
            { id: "neither", label: "Neither" },
          ],
          answer: "neither",
        },
        reveal: "Neither. On a random walk, a push past a level says nothing about what comes next. Each rule loses about its costs: roughly 0.2R a trade at these stops. Two mirror rules can only both pay if the regimes they meet differ.",
        concept: "market-regime",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Choose from the evidence on the chart, not from your last trade. After three failed breakouts, the next one isn't 'due' to fail. Turtle Soup is a practitioners' method (Connors and Raschke): [[evidence-grade]] C. The 'liquidity sweep' of SMC is the same idea, renamed; later levels come back to it.",
      },
    ],
    task: {
      widget: "bias-spotter",
      goal: "Eight setups around a range. For each, call it from the signs: Breakout, Fade or Pass. The app checks the rule, not the result.",
      data: { cards: FADE_CARDS, options: FADE_OPTIONS },
      success: { field: "solved", eq: 8 },
      correct: "Eight calls from the signs. Over many trades the regime decides which card pays; no single result proves the call.",
      hints: [
        "Closes back inside, low volume, a fast return: fade signs.",
        "Two closes outside with volume, or a retest that holds: breakout signs.",
        "No tested level, or no setup yet: pass.",
      ],
      showMe: { solved: 8 },
      concept: "failed-breakout-strategy",
    },
    check: ["q-2.8.8-1", "q-2.8.8-2", "q-2.8.8-3"],
    recap: {
      takeaways: [
        "Turtle Soup: a new 20-candle high, a sell stop under the old high, the stop above the spike.",
        "It mirrors the breakout: same level, opposite bet. On a random walk both lose their costs.",
        "Pick breakout, fade or pass from the chart's signs, never from the last trade's result.",
      ],
    },
  },
};

const L289: Lesson = {
  id: "2.8.9",
  title: "Confluence versus redundancy",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Five oscillators agreeing are one piece of evidence counted five times; real confluence combines independent kinds of evidence, and every filter you add shrinks the sample you can judge.",
  objectives: [
    "Tell independent evidence from the same evidence counted several times.",
    "Group indicators by the input they are built from.",
    "Explain why every extra filter shrinks the sample you can judge.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
    { kind: "check", ref: "decision_making", label: "Decision making check" },
  ],
  script: {
    unit: "2.8",
    courseId: "2.8.9",
    hook: {
      prompt: "A setup shows five green lights: RSI, Stochastic, CCI, Williams %R and ROC all say 'oversold'. How many independent pieces of evidence is that?",
      control: {
        kind: "slider",
        min: 1,
        max: 5,
        step: 1,
        start: 5,
        answer: 1,
        tolerance: 0,
        feedback: [
          { from: 1, to: 1, text: "Right: about one." },
          { from: 2, to: 3, text: "Fewer. All five are computed from the same recent prices." },
          { from: 4, to: 5, text: "Five lights, one switch: they're all built from the same prices." },
        ],
      },
      compare: "You said {yours}. About one: all five are built from the same prices. On simulated LABX their readings correlate at 0.84 to 1.00.",
      concept: "indicator-redundancy",
    },
    learn: [
      {
        kind: "explain",
        title: "Five lights, one switch",
        text: "[[confluence|Confluence]] means several independent reasons agree. [[indicator-redundancy|Indicator redundancy]] is one reason counted several times. RSI, Stochastic, CCI, Williams %R and ROC all measure recent price change. When one says 'oversold', the others almost always say it too.",
      },
      {
        kind: "match",
        title: "What each indicator is built from",
        prompt: "Sort the indicators by the input they're built from.",
        pairs: [
          { left: "RSI", right: "Closes only", wrong: "RSI compares the average up close with the average down close." },
          { left: "MACD", right: "Closes only", wrong: "MACD is the gap between two EMAs of the close." },
          { left: "Stochastic", right: "High–low range", wrong: "Stochastic places the close within the recent high–low range." },
          { left: "Williams %R", right: "High–low range", wrong: "Williams %R is the Stochastic formula, shifted by 100." },
          { left: "OBV", right: "Volume", wrong: "OBV adds or subtracts each candle's volume." },
          { left: "Swing highs and lows", right: "Structure", wrong: "Swings come from the shape of the price path, not a formula." },
          { left: "The session open", right: "Time", wrong: "The clock is an input of its own, independent of price." },
        ],
        columns: ["Indicator", "Built from"],
        correct: "Same input, same evidence. Readings from different rows can still agree for one reason, but from the same row they almost always do.",
        concept: "indicator-redundancy",
      },
      {
        kind: "figure",
        title: "How much they move together",
        text: "Correlations between the oscillators' readings over 500 candles of simulated LABX.",
        figure: {
          kind: "bars",
          bars: [
            { label: "RSI–Stochastic", value: 0.86, role: "neutral" },
            { label: "RSI–CCI", value: 0.87, role: "neutral" },
            { label: "RSI–ROC", value: 0.84, role: "neutral" },
            { label: "Stochastic–CCI", value: 0.91, role: "neutral" },
            { label: "Stochastic–Williams %R", value: 1, role: "concept" },
          ],
          steps: ["RSI with each of the others: 0.84 to 0.87.", "Stochastic and Williams %R: 1.00. The same formula, shifted."],
        },
        concept: "indicator-redundancy",
      },
      {
        kind: "worked",
        title: "Effective number of signals",
        lines: ["Signals: n = 5. Average correlation: ρ ≈ 0.9.", "Effective number = n ÷ (1 + (n − 1) × ρ).", "5 ÷ (1 + 4 × 0.9) = ?"],
        ask: {
          answer: 1.09,
          tolerance: 0.01,
          feedback: [
            { value: 5, text: "That's if they were independent, ρ = 0. At 0.9 they mostly repeat each other." },
            { value: 1.39, text: "Check the denominator: 1 + 4 × 0.9 = 4.6." },
          ],
          correct: "Right: 1.09. Five oscillators are worth about one.",
        },
        after: "With the measured average of all ten pairs, 0.88, it's 1.1. The same formula counts correlated positions in a portfolio, later in the course.",
        concept: "indicator-redundancy",
      },
      {
        kind: "figure",
        title: "Every filter shrinks the sample",
        text: "An illustrative backtest of the pullback setup, adding one filter at a time. With results spread by 1.7R, the 95% interval for expectancy is about 1.96 × 1.7 ÷ √n either side.",
        figure: {
          kind: "bars",
          bars: [
            { label: "No filter", value: 120, role: "neutral" },
            { label: "+ trend", value: 64, role: "neutral" },
            { label: "+ level", value: 31, role: "neutral" },
            { label: "+ volume", value: 18, role: "down" },
          ],
          unit: "trades",
          steps: ["120 trades: expectancy known to ±0.30R.", "64 trades: ±0.42R.", "31 trades: ±0.60R.", "18 trades: ±0.79R, wider than most edges."],
        },
        concept: "indicator-redundancy",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Confluence means independent families: trend, location, participation, time. A trend filter, a tested level and rising volume are three reasons; five oscillators are one. The correlation is mechanical. Claims that confluence improves results are [[evidence-grade]] C, and testing many filter combinations on one sample finds patterns by chance (Sullivan, Timmermann and White, 1999).",
      },
    ],
    task: {
      widget: "bias-spotter",
      goal: "Six filter combinations for the pullback setup. For each, decide: independent evidence, the same evidence counted twice, or too few trades left to judge.",
      data: { cards: CONFLUENCE_CARDS, options: CONFLUENCE_OPTIONS },
      success: { field: "solved", eq: 6 },
      correct: "Six sorted. Add filters from different families, and stop while there are still enough trades to judge.",
      hints: [
        "Ask what each filter is built from: closes, high–low range, volume, structure or time.",
        "Two oscillators built from the same prices count once.",
        "Under about 30 trades, the interval is too wide to judge anything.",
      ],
      showMe: { solved: 6 },
      concept: "indicator-redundancy",
    },
    check: ["q-2.8.9-1", "q-2.8.9-2", "q-2.8.9-3"],
    recap: {
      takeaways: [
        "Indicators built from the same input repeat each other: five oscillators are about one piece of evidence.",
        "Group by input: closes, high–low range, volume, structure, time. Confluence takes different groups.",
        "Each filter cuts trades: 120 down to 18 widened the interval from ±0.30R to ±0.79R.",
      ],
    },
  },
};

const L2810: Lesson = {
  id: "2.8.10",
  title: "Judging a strategy after costs",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "A strategy's edge is what's left after spread, commission and slippage, judged against simply holding and against the same rule on a random walk, over enough trades to tell it from luck.",
  objectives: [
    "Convert a strategy's gross edge into a net edge per trade with spread, commission and slippage.",
    "Compare the net result with the passive benchmark and with the same rule on a random walk.",
    "Decide what sample size you need before trusting the result.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "decision_making", label: "Decision making check" },
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
  ],
  script: {
    unit: "2.8",
    courseId: "2.8.10",
    hook: {
      prompt: "A backtest shows +0.12R per trade over 200 trades. The stop is 1.00 on LABX near 100.00, and round-trip costs are about 0.20 per unit. After costs, is the edge positive?",
      control: {
        kind: "choice",
        choices: [
          { id: "positive", label: "Positive", feedback: "+0.12R is the gross figure. Costs of 0.20 per unit on a 1.00 stop are 0.20R a trade." },
          { id: "zero", label: "About zero", feedback: "Closer, but the costs are bigger than the edge: 0.20R against 0.12R." },
          { id: "negative", label: "Negative", feedback: "Right: the costs are bigger than the edge." },
        ],
        answer: "negative",
      },
      compare: "You said {yours}. Costs: 0.20 ÷ 1.00 = 0.20R per trade. Net: 0.12 − 0.20 = −0.08R; over 200 trades, −16R.",
      concept: "after-cost-evaluation",
    },
    learn: [
      {
        kind: "explain",
        title: "Gross is a draft",
        text: "A backtest's gross result is a draft. [[after-cost-expectancy|After-cost expectancy]] takes off the spread, both commissions and the slippage on every fill. Costs are fixed per unit, so in R they depend on the stop: cost in R = cost per unit ÷ stop distance. Tight stops turn small edges negative.",
      },
      {
        kind: "worked",
        title: "From gross to net",
        lines: ["Cost per unit ≈ 0.20; stop 1.00. Cost in R = 0.20 ÷ 1.00 = 0.20R.", "Gross expectancy: +0.12R per trade.", "Net per trade = 0.12 − 0.20 = ?"],
        ask: {
          answer: -0.08,
          tolerance: 0.001,
          unit: "R",
          feedback: [
            { value: 0.08, text: "Check the sign: the costs are larger than the gross edge." },
            { value: 0.32, text: "Costs come off the gross result, not on top of it." },
          ],
          correct: "Right: −0.08R a trade.",
        },
        after: "Over 200 trades: −16R. At 1% risk, about −1,600.00 on a 10,000.00 account, from a backtest that looked profitable.",
        concept: "after-cost-evaluation",
      },
      {
        kind: "figure",
        title: "Four numbers, not one",
        text: "The same 200 trades, with illustrative benchmarks. Compare the net result with simply holding, and with the same rule on a random walk.",
        figure: {
          kind: "bars",
          bars: [
            { label: "Gross", value: 24, role: "up" },
            { label: "Net", value: -16, role: "down" },
            { label: "Buy and hold", value: 8, role: "neutral" },
            { label: "Same rule, random walk", value: -40, role: "down" },
          ],
          unit: "R",
          steps: [
            "Gross: 200 × 0.12 = +24R.",
            "Net: 200 × −0.08 = −16R.",
            "Holding LABX over the same period: +800.00, worth +8R at 100.00 per R.",
            "On a random walk the gross edge is zero by construction: net −40R, the costs alone.",
          ],
        },
        concept: "after-cost-evaluation",
      },
      {
        kind: "explain",
        title: "A real case: the opening range breakout",
        text: "A 2024 working paper reported huge net returns from an opening range breakout on US stocks, with no out-of-sample period. An independent replication on index CFDs found the gross edge, +0.13R a trade on the Nasdaq 100, but after spread and slippage no index was distinguishable from zero, and 4 of 5 were negative. [[evidence-grade|Evidence grade]] C.",
      },
      {
        kind: "order",
        title: "How to judge a strategy",
        prompt: "Put the evaluation steps in order.",
        items: [
          "Gross result per trade, in R",
          "Net: minus spread, commissions and slippage",
          "Against the passive benchmark",
          "Against the same rule on a random walk",
          "Sample size and the interval around the result",
          "Decide: keep testing, or drop it",
        ],
        explain: "Each step can kill the idea. Even a survivor deserves a discount: published edges earned 26% less out of sample and 58% less after publication (McLean and Pontiff, 2016).",
        concept: "after-cost-evaluation",
      },
      {
        kind: "predict",
        title: "Can a wider stop fix it?",
        prompt: "Costs are 0.20 per unit. Which stop halves the cost in R, from 0.20R?",
        control: {
          kind: "choice",
          choices: [
            { id: "s050", label: "0.50", feedback: "Tighter doubles it: 0.20 ÷ 0.50 = 0.40R." },
            { id: "s150", label: "1.50", feedback: "0.20 ÷ 1.50 = 0.13R. Halving the cost takes twice the stop." },
            { id: "s200", label: "2.00", feedback: "Right: 0.20 ÷ 2.00 = 0.10R." },
            { id: "s400", label: "4.00", feedback: "That quarters it: 0.05R." },
          ],
          answer: "s200",
        },
        reveal: "2.00: 0.20 ÷ 2.00 = 0.10R. But the gross edge in R changes too: a wider stop changes the win rate and the R-multiple of every exit. Retest the whole rule, not just the cost line.",
        concept: "costs-in-r",
      },
      {
        kind: "worked",
        title: "Enough trades to believe it?",
        lines: [
          "50 trades: 18 wins of +2R, 32 losses of −1R. Mean +0.08R gross.",
          "Spread of the results (standard deviation): 1.44R.",
          "Half-width of the 95% interval = 1.96 × 1.44 ÷ √50 = ?",
        ],
        ask: {
          answer: 0.4,
          tolerance: 0.01,
          unit: "R",
          feedback: [{ value: 0.2, text: "That's 1.44 ÷ √50. Multiply by 1.96 for a 95% interval." }],
          correct: "Right: ±0.40R. The gross +0.08R could be anything from −0.32R to +0.48R.",
        },
        after: "To shrink the interval to ±0.08R you'd need about 1,245 trades. Small edges need large samples, and few strategies get them.",
        concept: "sample-size",
      },
    ],
    task: {
      widget: "expectancy",
      goal: "These 50 trades: 36% wins of +2.0R, losses of 1.0R, +0.08R gross. Each round trip costs 0.20R. Set the average win and loss to their values after costs.",
      start: { winRate: 36, avgWin: 2, avgLoss: 1 },
      locked: ["winRate"],
      success: {
        all: [
          { field: "avgWin", eq: 1.8, tol: 0.001 },
          { field: "avgLoss", eq: 1.2, tol: 0.001 },
        ],
      },
      feedback: [
        { when: { all: [{ field: "avgWin", eq: 1.8, tol: 0.001 }, { field: "avgLoss", eq: 1, tol: 0.001 }] }, text: "You took the cost off the wins only. Every loser pays it too: 1.0 + 0.2." },
        { when: { all: [{ field: "avgWin", eq: 2, tol: 0.001 }, { field: "avgLoss", eq: 1.2, tol: 0.001 }] }, text: "The losses are right. Winners pay the cost too: 2.0 − 0.2." },
        { when: { field: "avgWin", gt: 2 }, text: "Costs make wins smaller, not bigger." },
      ],
      incorrect: "Take 0.20R off each win and add 0.20R to each loss.",
      correct: "Right: −0.12R a trade after costs, from +0.08R gross. Net, the rule needs 40% winners to break even, not 33.3%.",
      hints: ["Costs come off every trade: winners shrink, losers grow.", "Win: 2.0 − 0.2. Loss: 1.0 + 0.2.", "Set the average win to 1.8R and the average loss to 1.2R."],
      showMe: { avgWin: 1.8, avgLoss: 1.2 },
      concept: "after-cost-evaluation",
    },
    check: ["q-2.8.10-1", "q-2.8.10-2", "q-2.8.10-3"],
    recap: {
      takeaways: [
        "Net = gross − costs in R, and costs in R = cost per unit ÷ stop distance.",
        "Compare the net result with simply holding and with the same rule on a random walk.",
        "The interval shrinks with √n: ±0.40R at 50 trades. Small edges need hundreds of trades.",
      ],
    },
  },
};

// ─── Check questions ────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 2.8.1 · Matching the tool to the regime
  {
    id: "q-2.8.1-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which strategy family tends to lose in a range, and why?",
    options: [
      { id: "a", label: "Range trading: it needs a trend to reach the other edge", rationale: "Range trading is built for ranges: it buys near support and sells near resistance." },
      { id: "b", label: "Trend following: its signals reverse before they pay", },
      { id: "c", label: "Mean reversion: a range has no average to return to", rationale: "A range has a stable average. That's exactly what mean reversion needs." },
      { id: "d", label: "None: in a range every family breaks even", rationale: "Families differ by regime. Trend rules bleed to whipsaws in a range while range rules do their best work." },
    ],
    correct: "b",
    explanation: "In a range, a trend rule buys after a rise and sells after a fall, near the edges, and price turns straight back. Many small losses and few wins: the whipsaw pattern of a trend rule in the wrong regime.",
    lesson: "2.8.1",
    concepts: ["strategy-regime-fit", "market-regime"],
  },
  {
    id: "q-2.8.1-2",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "Forty candles of LABX. Swing highs at 101.20, 100.60, 101.50, 100.90; swing lows at 99.40, 100.10, 99.20, 99.80. No level held twice, and the 20-candle average is flat.",
    prompt: "What do you do?",
    options: [
      { id: "a", label: "Range trade between 99.20 and 101.50", rationale: "Those are just the extremes. No edge was touched twice, so there's no range to trade." },
      { id: "b", label: "Buy a breakout above 101.50", rationale: "A breakout needs a tested level. 101.50 was reached once." },
      { id: "c", label: "Trend following: the last swing was up", rationale: "One swing isn't a trend. The highs and lows went up and down in turn." },
      { id: "d", label: "No trade: there's no regime you can name" },
    ],
    correct: "d",
    explanation: "Swings that overlap with no edges and no direction leave no regime to name, and every strategy bets on one. On a random walk every rule loses about its costs. 'No trade' is a decision, not a failure.",
    lesson: "2.8.1",
    concepts: ["strategy-regime-fit", "random-walk"],
    hints: ["Do the highs and lows step one way, or turn at the same levels?", "If you can't name the regime in one sentence, it isn't clear."],
  },
  {
    id: "q-2.8.1-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario: "LABX has made two higher highs, but its last two swing lows were equal, 99.50 and 99.50. You normally risk 1% on a trend-following entry.",
    prompt: "How do you size this trade?",
    options: [
      { id: "a", label: "Full 1%: two higher highs are enough", rationale: "The lows haven't stepped up. Half the evidence for a trend is missing, so the label could be wrong." },
      { id: "b", label: "2%, to make up for the trades you skipped", rationale: "Raising risk on a weaker setup is the opposite of sizing for the regime you might be wrong about." },
      { id: "c", label: "Half size, or skip it: the label is uncertain" },
      { id: "d", label: "Full size, with a tighter stop to be safe", rationale: "A tighter stop raises the cost in R and gets hit by normal noise. It doesn't fix an unclear label." },
    ],
    correct: "c",
    explanation: "Size for the regime you might be wrong about. Equal lows look as much like a range floor as a higher low. With the label uncertain, trade smaller or skip; a full-size bet needs a clear regime.",
    lesson: "2.8.1",
    concepts: ["strategy-regime-fit", "risk-per-trade"],
    hints: ["A trend needs higher highs and higher lows. Are both there?", "What would two equal lows mean in a range?"],
  },

  // 2.8.2 · Trend following
  {
    id: "q-2.8.2-1",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A trend rule wins 40% of its trades, and its average loss is 1R. What is the smallest average win, in R, at which it breaks even before costs?",
    numeric: { answer: 1.5, tolerance: 0.01, unit: "R" },
    explanation: "At break-even, 0.40 × win = 0.60 × 1R, so the win = 0.60 ÷ 0.40 = 1.5R. Any bigger average win makes the expectancy positive, even with most trades losing.",
    lesson: "2.8.2",
    concepts: ["trend-following", "expectancy"],
    hints: ["Break-even: win rate × average win = loss rate × average loss.", "0.40 × win = 0.60 × 1.", "0.60 ÷ 0.40 = ?"],
    vary: {
      fields: { w: [25, 45, 5] },
      answer: "round((100 - w) / w, 2)",
      prompt: "A trend rule wins {w}% of its trades, and its average loss is 1R. What is the smallest average win, in R, at which it breaks even before costs?",
      explanation: "At break-even, {w / 100:2} × win = {(100 - w) / 100:2} × 1R, so the win = {(100 - w) / 100:2} ÷ {w / 100:2} = {answer:2}R. Any bigger average win makes the expectancy positive, even with most trades losing.",
      hint: "{(100 - w) / 100:2} ÷ {w / 100:2} = ?",
    },
  },
  {
    id: "q-2.8.2-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Where does a moving-average trend-following system lose most of its money?",
    options: [
      { id: "a", label: "In long, steady trends", rationale: "That's where it makes its money: it holds the big winners while the trend runs." },
      { id: "b", label: "On the pullbacks inside a trend", rationale: "Pullbacks give back some open profit, but a stop or trail wide enough lets the trade survive them." },
      { id: "c", label: "Nowhere much: its losses are always small", rationale: "Each loss is small, but many small whipsaw losses in a range add up to the biggest drawdowns." },
      { id: "d", label: "In ranges, where crosses reverse quickly, and at sharp V-shaped reversals" },
    ],
    correct: "d",
    explanation: "Trend rules lose in ranges, where each cross reverses before it pays, and at sharp reversals, where the lagging exit hands back open profit. Their losing runs come from regimes, not from bad luck alone.",
    lesson: "2.8.2",
    concepts: ["trend-following", "market-regime"],
  },
  {
    id: "q-2.8.2-3",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "LABX is near 100.00 and a round trip costs about 0.20 per unit. Your trend-following stop sits 4.00 below the entry. What does the round trip cost in R?",
    numeric: { answer: 0.05, tolerance: 0.001, unit: "R" },
    explanation: "Cost in R = cost per unit ÷ stop distance = 0.20 ÷ 4.00 = 0.05R. The same costs on a 1.00 stop would be 0.20R a trade: wide stops keep trend following's costs small in R.",
    lesson: "2.8.2",
    concepts: ["costs-in-r", "trend-following"],
    hints: ["Costs in R divide the cost per unit by the stop distance.", "0.20 ÷ 4.00 = ?"],
    vary: {
      fields: { s: [1, 5, 0.5] },
      answer: "round(0.2 / s, 3)",
      prompt: "LABX is near 100.00 and a round trip costs about 0.20 per unit. Your trend-following stop sits {s:2} below the entry. What does the round trip cost in R?",
      explanation: "Cost in R = cost per unit ÷ stop distance = 0.20 ÷ {s:2} = {answer:3}R. The wider the stop, the smaller the share of 1R that costs take.",
      hint: "0.20 ÷ {s:2} = ?",
    },
  },

  // 2.8.3 · Pullback in a trend
  {
    id: "q-2.8.3-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which of these is a complete pullback entry?",
    options: [
      { id: "a", label: "Price above a rising SMA 50; a dip to the EMA 20; buy on a close back above the prior candle's high; stop under the pullback low" },
      { id: "b", label: "Buy whenever price touches the EMA 20; stop at the EMA", rationale: "No trend filter and no trigger. In a downtrend the EMA is resistance, and a stop at the EMA sits inside normal noise." },
      { id: "c", label: "A close back above the prior high; stop under the pullback low; no trend filter needed", rationale: "Without the filter, the same trigger fires in ranges and downtrends, where a dip isn't a pullback." },
      { id: "d", label: "Price above a rising SMA 50; buy at market as soon as it starts to dip; stop when the trend ends", rationale: "A dip that has just started has no low to put the stop under, and 'when the trend ends' isn't a stop." },
    ],
    correct: "a",
    explanation: "A pullback entry needs all three parts: a trend filter so you only buy dips in an uptrend, a trigger that shows buyers are back, and a stop under the pullback low, where the idea is wrong.",
    lesson: "2.8.3",
    concepts: ["trend-pullback", "invalidation-level"],
  },
  {
    id: "q-2.8.3-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "LABX is trending up. Stop 98.40 under the last swing low, target 104.00. You buy the pullback at 99.20 instead of chasing at 101.60. What is the reward-to-risk of the pullback entry?",
    numeric: { answer: 6, tolerance: 0.05, unit: "×" },
    explanation: "Reward 104.00 − 99.20 = 4.80; risk 99.20 − 98.40 = 0.80; 4.80 ÷ 0.80 = 6.0. Chasing at 101.60 gives 2.40 ÷ 3.20 = 0.75: the same stop and target, a far worse trade.",
    lesson: "2.8.3",
    concepts: ["reward-to-risk", "trend-pullback"],
    hints: ["Reward = target − entry; risk = entry − stop.", "(104.00 − 99.20) ÷ (99.20 − 98.40) = ?"],
    vary: {
      fields: { e: [98.8, 99.8, 0.2] },
      answer: "round((104 - e) / (e - 98.4), 2)",
      prompt: "LABX is trending up. Stop 98.40 under the last swing low, target 104.00. You buy the pullback at {e:2} instead of chasing at 101.60. What is the reward-to-risk of the pullback entry?",
      explanation: "Reward 104.00 − {e:2} = {104 - e:2}; risk {e:2} − 98.40 = {e - 98.4:2}; ratio {answer:2}. Chasing at 101.60 gives 2.40 ÷ 3.20 = 0.75.",
      hint: "{104 - e:2} ÷ {e - 98.4:2} = ?",
    },
  },
  {
    id: "q-2.8.3-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "An uptrend with higher lows at 96.60 and then 98.05. A fourth pullback falls to 97.64, then a candle closes at 97.29, under the SMA 50.",
    prompt: "What does this say about the pullback?",
    options: [
      { id: "a", label: "A deeper pullback: a better price to buy", rationale: "Under the last higher low and the SMA 50, the trend's structure is broken. A cheaper price isn't a better trade." },
      { id: "b", label: "It became a reversal: a lower low and a close under the 50 switch the filter off" },
      { id: "c", label: "Nothing yet: wait for the EMA 20 to turn down", rationale: "The EMA lags. The lower low and the close under the 50 are the earlier, rule-based signs." },
      { id: "d", label: "Buy now, with a stop just under 97.29", rationale: "Buying under a broken filter ignores the rule that makes pullbacks worth buying." },
    ],
    correct: "b",
    explanation: "A pullback is only a pullback while the trend holds. A low under the last higher low breaks the structure, and a close under the SMA 50 fails the filter. Stop buying dips and wait for a new setup.",
    lesson: "2.8.3",
    concepts: ["trend-pullback", "invalidation-level"],
    hints: ["Compare the new low with the last higher low.", "Where did the close end up relative to the SMA 50?"],
  },

  // 2.8.4 · Breakout from a range
  {
    id: "q-2.8.4-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "LABX has ranged between 97.00 and 100.00. Which plan follows the breakout card?",
    options: [
      { id: "a", label: "Level touched once; buy a close above it at 100.15; stop 99.20; target 103.00", rationale: "One touch doesn't make a tested level. The card asks for at least two." },
      { id: "b", label: "Buy the first wick above 100.00; stop at 97.00, the range bottom", rationale: "A wick isn't a close, and a stop at the far edge risks the whole range height on one trade." },
      { id: "c", label: "Level touched three times; buy a close at 100.15; stop 99.20, back inside; target 103.00" },
      { id: "d", label: "Buy a close at 100.15; stop 100.05, just under the level; target 103.00", rationale: "A stop inside the level's noise gets hit by an ordinary retest. 'Back inside' means under the breakout candle." },
    ],
    correct: "c",
    explanation: "The card needs a tested level, a close beyond it, a stop back inside the range under the breakout candle, and the measured move as the target: the 3.00 height added to 100.00.",
    lesson: "2.8.4",
    concepts: ["range-breakout-strategy", "support-and-resistance"],
  },
  {
    id: "q-2.8.4-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "LABX ranged between 48.00 and 50.00, then closed at 50.30. Stop 49.80, target 52.00, the measured move. With costs of 0.20 per unit, what win rate does the trade need to break even?",
    numeric: { answer: 31.8, tolerance: 0.5, unit: "%" },
    explanation: "Loss with costs: 50.30 − 49.80 + 0.20 = 0.70. Win after costs: 52.00 − 50.30 − 0.20 = 1.50. Break-even = 0.70 ÷ (0.70 + 1.50) = 31.8%. Before costs it would be 0.50 ÷ 2.20 = 22.7%.",
    lesson: "2.8.4",
    concepts: ["range-breakout-strategy", "reward-to-risk"],
    hints: ["Add the cost to the loss and take it off the win.", "Break-even = loss ÷ (loss + win).", "0.70 ÷ (0.70 + 1.50) = ?"],
    vary: {
      fields: { e: [50.1, 50.5, 0.1], s: [49.5, 49.9, 0.1] },
      answer: "round((e - s + 0.2) / (52 - s) * 100, 1)",
      prompt: "LABX ranged between 48.00 and 50.00, then closed at {e:2}. Stop {s:2}, target 52.00, the measured move. With costs of 0.20 per unit, what win rate does the trade need to break even?",
      explanation: "Loss with costs: {e:2} − {s:2} + 0.20 = {e - s + 0.2:2}. Win after costs: 52.00 − {e:2} − 0.20 = {52 - e - 0.2:2}. Break-even = loss ÷ (loss + win) = {answer:1}%.",
      hint: "{e - s + 0.2:2} ÷ ({e - s + 0.2:2} + {52 - e - 0.2:2}) = ?",
    },
  },
  {
    id: "q-2.8.4-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "In which situation does a range breakout fail most often?",
    options: [
      { id: "a", label: "A close beyond a level touched three times, on high volume", rationale: "That's the setup the card wants: a tested level and participation. It can fail, but less often." },
      { id: "b", label: "A first poke through a level touched once, on low volume, after a long run" },
      { id: "c", label: "A breakout after a long, quiet range with tested edges", rationale: "A long range with tested edges is the breakout's best case, not its worst." },
      { id: "d", label: "A retest of the broken level that holds", rationale: "A retest that holds is evidence for the breakout, not against it." },
    ],
    correct: "b",
    explanation: "Breakouts fail most from untested levels, on wicks and thin volume, and late in moves that have already run. Every one of those conditions is in option b.",
    lesson: "2.8.4",
    concepts: ["range-breakout-strategy", "false-breakout"],
    hints: ["Which option has the fewest of the card's filters?", "Count touches, volume and how far the move has already run."],
  },

  // 2.8.5 · Volatility contraction breakout
  {
    id: "q-2.8.5-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "The ranges of LABX's last 7 candles were 0.80, 1.20, 1.00, 0.70, 1.10, 0.95 and 0.75. Is the last candle an NR7?",
    options: [
      { id: "a", label: "Yes: 0.75 is below the average of the seven", rationale: "An NR7 is narrower than each of the six before it, not just below the average." },
      { id: "b", label: "Yes: it's narrower than the candle before it", rationale: "That makes it an NR2. An NR7 must be the narrowest of seven." },
      { id: "c", label: "No: an NR7 must also be an inside bar", rationale: "They're separate signals. A candle can be an NR7 without sitting inside the one before." },
      { id: "d", label: "No: 0.70, three candles earlier, is narrower" },
    ],
    correct: "d",
    explanation: "An NR7's range is smaller than each of the previous six. The fourth of the seven candles had a range of 0.70, under the last candle's 0.75, so the last one isn't an NR7.",
    lesson: "2.8.5",
    concepts: ["volatility-contraction-breakout", "volatility"],
  },
  {
    id: "q-2.8.5-2",
    topic: "order_types",
    kind: "mcq",
    difficulty: 2,
    prompt: "Your OCO bracket has a buy stop at 100.65 and a sell stop at 99.65. The buy stop fills. What happens to the sell stop?",
    options: [
      { id: "a", label: "It stays live, as a second position", rationale: "That would be two separate orders, not OCO. With OCO, one fill cancels the other." },
      { id: "b", label: "It's cancelled automatically" },
      { id: "c", label: "It becomes the long's take-profit", rationale: "A sell stop below the price can't take profit. OCO cancels it; the long needs its own protective stop." },
      { id: "d", label: "It's moved to the entry price", rationale: "OCO doesn't move orders. It cancels the other one when the first fills." },
    ],
    correct: "b",
    explanation: "One-cancels-the-other links two orders: when one fills, the broker cancels the other. The long then needs its own protective stop, here at 99.65.",
    lesson: "2.8.5",
    concepts: ["bracket-order", "volatility-contraction-breakout"],
    hints: ["What does 'one cancels the other' mean once one side has filled?"],
  },
  {
    id: "q-2.8.5-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your volatility bracket re-arms the other side after a stop. In a sideways day, the long filled and was stopped, then the short filled and was stopped. Each side risked 99.02.",
    prompt: "What went wrong?",
    options: [
      { id: "a", label: "The stops were too wide", rationale: "Wider stops lower the cost in R, but sideways chop can still hit both sides." },
      { id: "b", label: "Nothing in the execution: sideways chop is this strategy's known failure, and it costs about 2R" },
      { id: "c", label: "You should have doubled the size after the first loss", rationale: "Doubling after a loss is a martingale: it raises risk exactly when the setup has failed." },
      { id: "d", label: "The NR7 was fake: real ones always break one way", rationale: "No contraction promises a direction. The directional edge is weak after costs, grade C." },
    ],
    correct: "b",
    explanation: "A contraction can resolve sideways. A plan that re-arms the other side then pays two losses, 198.04 here, about 2% of the account. It's a known cost of the strategy, so plan for it: fewer re-arms, or a smaller size per side.",
    lesson: "2.8.5",
    concepts: ["volatility-contraction-breakout", "costs-in-r"],
    hints: ["Was any rule broken, or did the market do what this strategy fears most?", "Add up both sides' losses."],
  },

  // 2.8.6 · Range trading
  {
    id: "q-2.8.6-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "When is a range confirmed for the range card?",
    options: [
      { id: "a", label: "After one touch on each edge", rationale: "One touch per edge could be the start of a trend or a triangle." },
      { id: "b", label: "When price has moved sideways for 10 candles", rationale: "Time alone doesn't make edges. The card wants touches on both sides." },
      { id: "c", label: "At least two touches on each edge, flat averages, ADX under 20" },
      { id: "d", label: "When ADX rises above 25", rationale: "ADX above 25 points to a trend, not a range." },
    ],
    correct: "c",
    explanation: "Range trading bets that the edges hold, so it needs evidence that they do: at least two touches on each side, flat averages and a low ADX. Anything less is a guess about edges that may not exist.",
    lesson: "2.8.6",
    concepts: ["range-trading", "range"],
  },
  {
    id: "q-2.8.6-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "A range trade: buy 98.20, stop 97.70, target 99.20. Costs are 0.20 per unit. What is the reward-to-risk after costs?",
    numeric: { answer: 1.14, tolerance: 0.01, unit: "×" },
    explanation: "After costs the win is 1.00 − 0.20 = 0.80 and the loss is 0.50 + 0.20 = 0.70: 0.80 ÷ 0.70 = 1.14. Before costs it was 2.0. Small targets make costs heavy.",
    lesson: "2.8.6",
    concepts: ["range-trading", "trading-costs"],
    hints: ["Take the cost off the reward and add it to the risk.", "(1.00 − 0.20) ÷ (0.50 + 0.20) = ?"],
    vary: {
      fields: { t: [98.9, 99.5, 0.1] },
      answer: "round((t - 98.4) / 0.7, 2)",
      prompt: "A range trade: buy 98.20, stop 97.70, target {t:2}. Costs are 0.20 per unit. What is the reward-to-risk after costs?",
      explanation: "After costs the win is {t - 98.2:2} − 0.20 = {t - 98.4:2} and the loss is 0.50 + 0.20 = 0.70: {answer:2}. Before costs it was {(t - 98.2) / 0.5:2}.",
      hint: "{t - 98.4:2} ÷ 0.70 = ?",
    },
  },
  {
    id: "q-2.8.6-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "You've traded a 50.00–52.00 range four times with the range card. A candle closes at 52.35. On the next candle price dips back to 51.90, near your usual short entry.",
    prompt: "What does the range card say?",
    options: [
      { id: "a", label: "Short at 51.90: price is back under resistance", rationale: "The close at 52.35 ended the range. Selling the old resistance now fights a possible breakout." },
      { id: "b", label: "Short, with a wider stop above 52.35", rationale: "Widening the stop to keep trading a broken range is a rule change made on the fly." },
      { id: "c", label: "No new range trades: the first close outside ended it" },
      { id: "d", label: "Wait for one more touch of 52.00, then decide", rationale: "The flip rule already fired on the close. Another touch doesn't bring the range back." },
    ],
    correct: "c",
    explanation: "The flip rule: the first confirmed close outside ends range trading. From here the breakout card applies, and a fade needs its own setup and evidence.",
    lesson: "2.8.6",
    concepts: ["range-trading", "range-breakout-strategy"],
    hints: ["Did anything close outside the range?", "What does the card say happens after the first close outside?"],
  },

  // 2.8.7 · Mean reversion
  {
    id: "q-2.8.7-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which is the RSI(2) rule as taught?",
    options: [
      { id: "a", label: "RSI(2) over 90: buy, momentum is strong", rationale: "That's the opposite: RSI(2) buys short-term weakness inside an uptrend." },
      { id: "b", label: "Close under the SMA 200 and RSI(2) under 10: buy", rationale: "The SMA 200 filter keeps buys inside uptrends. Under it, oversold can keep falling." },
      { id: "c", label: "RSI(2) under 10: buy, and hold with no stop until RSI(2) is over 90", rationale: "The exit is a close above the SMA 5, and the course requires a catastrophic stop." },
      { id: "d", label: "Close above the SMA 200 and RSI(2) under 10: buy; exit on a close above the SMA 5; keep a catastrophic stop" },
    ],
    correct: "d",
    explanation: "RSI(2) buys a short, sharp dip inside an uptrend: the SMA 200 filter, RSI(2) under 10 to enter, a close above the SMA 5 to exit. The course adds a catastrophic stop, such as 3 ATR.",
    lesson: "2.8.7",
    concepts: ["mean-reversion"],
  },
  {
    id: "q-2.8.7-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "A mean-reversion rule wins 80% of its trades at +0.4R. What is the largest average loss, in R, at which it still breaks even?",
    numeric: { answer: 1.6, tolerance: 0.01, unit: "R" },
    explanation: "At break-even, 0.80 × 0.4 = 0.20 × loss, so the loss = 0.32 ÷ 0.20 = 1.6R. One rare loss well past that turns a high win rate into a losing rule.",
    lesson: "2.8.7",
    concepts: ["return-skew", "expectancy"],
    hints: ["Break-even: win rate × average win = loss rate × average loss.", "0.80 × 0.4 = 0.32. Divide by the loss rate.", "0.32 ÷ 0.20 = ?"],
    vary: {
      fields: { w: [65, 85, 5], aw: [0.3, 0.6, 0.1] },
      answer: "round(w * aw / (100 - w), 2)",
      prompt: "A mean-reversion rule wins {w}% of its trades at +{aw:1}R. What is the largest average loss, in R, at which it still breaks even?",
      explanation: "At break-even, {w / 100:2} × {aw:1} = {(100 - w) / 100:2} × loss, so the loss = {w * aw / 100:3} ÷ {(100 - w) / 100:2} = {answer:2}R. One rare loss well past that turns a high win rate into a losing rule.",
      hint: "{w * aw / 100:3} ÷ {(100 - w) / 100:2} = ?",
    },
  },
  {
    id: "q-2.8.7-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your RSI(2) backtest made more money without stops than with a 3-ATR catastrophic stop. A friend says you should drop the stop.",
    prompt: "What's the reason to keep it anyway?",
    options: [
      { id: "a", label: "It caps the rare crash trade that the backtest may never have met" },
      { id: "b", label: "It raises the win rate", rationale: "Stops lower the win rate: some trades that would have recovered get stopped out." },
      { id: "c", label: "It improves the backtest's results", rationale: "Connors found the opposite in his tests. The stop is insurance, not an edge." },
      { id: "d", label: "It's needed only in trends, not in ranges", rationale: "Gaps and crashes arrive in any regime. That tail risk is why the stop exists." },
    ],
    correct: "a",
    explanation: "A negatively skewed rule's worst trade decides whether it survives. A backtest period without a crash flatters the no-stop version. The stop costs some return and caps the loss that could end the account.",
    lesson: "2.8.7",
    concepts: ["mean-reversion", "gap-risk"],
    hints: ["What does a backtest show about crashes that didn't happen in its period?", "Which matters more for a negative-skew rule: the average trade or the worst one?"],
  },

  // 2.8.8 · Failed breakout
  {
    id: "q-2.8.8-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Range 97.00–100.00. Price spikes to 100.70, a new 20-candle high, then falls back. Where do Turtle Soup's entry and stop go?",
    options: [
      { id: "a", label: "A sell stop at 99.90; the stop at 100.80" },
      { id: "b", label: "Sell at 100.70, the spike high; the stop at 101.70", rationale: "You can't know the high while it's forming. The entry waits for price to fall back under the old high." },
      { id: "c", label: "A sell stop at 99.90; the stop at 100.00", rationale: "100.00 is the old high: any retest would stop you. The stop goes above the new extreme, 100.70." },
      { id: "d", label: "A buy stop at 100.80; the stop at 99.90", rationale: "That's the breakout side. Turtle Soup sells the failure." },
    ],
    correct: "a",
    explanation: "Turtle Soup sells just under the old high, 99.90, only once price falls back through it, and puts the stop just above the new extreme, 100.80. The far edge of the range is the target.",
    lesson: "2.8.8",
    concepts: ["failed-breakout-strategy", "false-breakout"],
  },
  {
    id: "q-2.8.8-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "How does the failed-breakout trade relate to the range breakout?",
    options: [
      { id: "a", label: "It's the same trade with a tighter stop", rationale: "It's the opposite direction: the fade sells where the breakout buys." },
      { id: "b", label: "It only works in trends", rationale: "The fade fails in a real trend, when the breakout keeps going. Its home is a range after a failed push." },
      { id: "c", label: "It's the mirror: same level, opposite bet; the breakout needs the range to end, the fade needs it to hold" },
      { id: "d", label: "One of the two must always win", rationale: "On a random walk both lose about their costs." },
    ],
    correct: "c",
    explanation: "Both trade the same level in opposite directions. The breakout pays when the range turns into a trend; the fade pays when the range holds after a failed push. The regime decides which card fits.",
    lesson: "2.8.8",
    concepts: ["failed-breakout-strategy", "range-breakout-strategy"],
    hints: ["Where does each trade enter, and in which direction?", "In which regime does each one win?"],
  },
  {
    id: "q-2.8.8-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "Your last three breakout trades failed. Now LABX closes above a level touched three times, then closes above it again, both on twice the average volume.",
    prompt: "Breakout, fade or pass?",
    options: [
      { id: "a", label: "Fade: breakouts have been failing lately", rationale: "That's choosing from the last results. Three failures don't change what this chart shows." },
      { id: "b", label: "Pass: three losses in a row mean the regime is random", rationale: "At a 30% win rate, three losses in a row happen about a third of the time. The chart shows clear breakout signs." },
      { id: "c", label: "Breakout: two closes outside with volume are breakout signs" },
      { id: "d", label: "Fade with a smaller size, as a hedge", rationale: "A smaller bet on the wrong card is still the wrong card. The signs point to the breakout." },
    ],
    correct: "c",
    explanation: "Choose from the evidence on the chart, not from your last trades. At a 30% win rate, 0.7 × 0.7 × 0.7 ≈ 34%: three losses in a row are common and say little. Two closes outside on high volume are the breakout's signs.",
    lesson: "2.8.8",
    concepts: ["failed-breakout-strategy", "market-regime"],
    hints: ["What do the signs on this chart say, if you ignore your last trades?", "At a 30% win rate, how often do three losses in a row happen?"],
  },

  // 2.8.9 · Confluence versus redundancy
  {
    id: "q-2.8.9-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which pair adds independent evidence to a pullback setup?",
    options: [
      { id: "a", label: "RSI under 30 and CCI under −100", rationale: "Both measure recent price change. They agree for the same reason." },
      { id: "b", label: "MACD crossing zero and a 12/26 EMA crossover", rationale: "MACD is built from those same two EMAs: one signal counted twice." },
      { id: "c", label: "Stochastic and Williams %R", rationale: "Williams %R is the Stochastic formula shifted by 100: their correlation is 1.00." },
      { id: "d", label: "A tested support level and rising volume" },
    ],
    correct: "d",
    explanation: "A level comes from structure; volume measures participation. They're built from different inputs, so when both agree, that's two reasons. The other pairs are one reason counted twice.",
    lesson: "2.8.9",
    concepts: ["indicator-redundancy", "confluence"],
  },
  {
    id: "q-2.8.9-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which indicator is built from a different input than the other three?",
    options: [
      { id: "a", label: "RSI", rationale: "RSI uses closes, like ROC and MACD." },
      { id: "b", label: "OBV" },
      { id: "c", label: "ROC", rationale: "ROC compares today's close with an earlier close: closes only, like RSI and MACD." },
      { id: "d", label: "MACD", rationale: "MACD is built from EMAs of the close, like RSI and ROC." },
    ],
    correct: "b",
    explanation: "OBV adds or subtracts volume, so it carries information the close-based indicators don't. RSI, ROC and MACD are all built from closes and tend to move together.",
    lesson: "2.8.9",
    concepts: ["indicator-redundancy"],
    hints: ["What does each indicator take as its input?"],
  },
  {
    id: "q-2.8.9-3",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "After your filters, the setup has 25 trades, with results spread by 1.5R (one standard deviation). Using 1.96 × sd ÷ √n, how many R either side of the average does the 95% interval reach?",
    numeric: { answer: 0.59, tolerance: 0.01, unit: "R" },
    explanation: "1.96 × 1.5 ÷ √25 = 2.94 ÷ 5 = 0.59R either side. Unless the edge is bigger than that, 25 trades can't tell it from zero.",
    lesson: "2.8.9",
    concepts: ["indicator-redundancy", "sample-size"],
    hints: ["√25 = 5.", "1.96 × 1.5 = 2.94.", "2.94 ÷ 5 = ?"],
    vary: {
      fields: { q: [4, 10, 1], sd: [1, 2, 0.5] },
      answer: "round(1.96 * sd / q, 2)",
      prompt: "After your filters, the setup has {q * q} trades, with results spread by {sd:1}R (one standard deviation). Using 1.96 × sd ÷ √n, how many R either side of the average does the 95% interval reach?",
      explanation: "1.96 × {sd:1} ÷ √{q * q} = {1.96 * sd:2} ÷ {q} = {answer:2}R either side. Unless the edge is bigger than that, {q * q} trades can't tell it from zero.",
      hint: "{1.96 * sd:2} ÷ {q} = ?",
    },
  },

  // 2.8.10 · Judging a strategy after costs
  {
    id: "q-2.8.10-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "A backtest shows +0.15R per trade gross. The stop is 0.80 on LABX near 100.00, and a round trip costs about 0.20 per unit. What is the net expectancy per trade, in R?",
    numeric: { answer: -0.1, tolerance: 0.005, unit: "R" },
    explanation: "Cost in R = 0.20 ÷ 0.80 = 0.25R. Net = 0.15 − 0.25 = −0.10R per trade. A positive gross edge smaller than the cost in R is a losing strategy.",
    lesson: "2.8.10",
    concepts: ["after-cost-evaluation", "costs-in-r"],
    hints: ["First turn the cost into R: cost per unit ÷ stop distance.", "0.20 ÷ 0.80 = 0.25R.", "0.15 − 0.25 = ?"],
    vary: {
      fields: { g: [0.05, 0.3, 0.05], s: [0.5, 2, 0.25] },
      answer: "round(g - 0.2 / s, 3)",
      prompt: "A backtest shows +{g:2}R per trade gross. The stop is {s:2} on LABX near 100.00, and a round trip costs about 0.20 per unit. What is the net expectancy per trade, in R?",
      explanation: "Cost in R = 0.20 ÷ {s:2} = {0.2 / s:3}R. Net = {g:2} − {0.2 / s:3} = {answer:3}R per trade.",
      hint: "{g:2} − 0.20 ÷ {s:2} = ?",
    },
  },
  {
    id: "q-2.8.10-2",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "Over a year, your rule made +6R net. Holding LABX over the same year made the equivalent of +10R. In one run on a simulated random walk, the same rule made +5R net.",
    prompt: "What do you conclude?",
    options: [
      { id: "a", label: "It works: +6R net is positive", rationale: "Positive isn't enough. Holding did better, and random data did nearly as well." },
      { id: "b", label: "It works, because it beat the random walk", rationale: "By 1R, on one sample each: well within luck." },
      { id: "c", label: "No evidence of skill: it trails holding, and random data did about as well" },
      { id: "d", label: "Buy-and-hold doesn't matter for a trading rule", rationale: "Holding is what you'd earn without trading. A rule has to beat it, after costs, to be worth the effort." },
    ],
    correct: "c",
    explanation: "A rule earns its keep only if it beats the passive benchmark after costs and clearly beats the same rule on random data. This one does neither, so the +6R is no evidence of an edge.",
    lesson: "2.8.10",
    concepts: ["after-cost-evaluation", "passive-benchmark"],
    hints: ["Compare the +6R with both benchmarks, not with zero.", "Would a 1R gap over one sample convince you?"],
  },
  {
    id: "q-2.8.10-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "A strategy shows +0.10R per trade over 40 trades, with results spread by 1.5R. What should you do?",
    options: [
      { id: "a", label: "Trade it at full size: +0.10R is a real edge", rationale: "With 40 trades the interval is about ±0.46R. +0.10R can't be told from zero." },
      { id: "b", label: "Drop it: 40 trades prove it doesn't work", rationale: "40 trades can't prove it either way. The interval includes good edges and bad ones." },
      { id: "c", label: "Raise the size to reach significance faster", rationale: "Size doesn't add trades. It only adds risk while you're still unsure." },
      { id: "d", label: "Keep testing: ±0.46R around +0.10R includes zero" },
    ],
    correct: "d",
    explanation: "1.96 × 1.5 ÷ √40 ≈ 0.46R, so the true expectancy could be anywhere from about −0.36R to +0.56R. Keep testing, at small size or in the simulator, until the interval excludes zero or the idea fails.",
    lesson: "2.8.10",
    concepts: ["sample-size", "after-cost-evaluation"],
    hints: ["Work out 1.96 × 1.5 ÷ √40.", "Does the interval around +0.10R include zero?"],
  },
];

// ─── Glossary terms and concepts ────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "market-regime",
    term: "Market regime",
    definition: "The prevailing behaviour of a market over a stretch of time, such as trending, ranging or moving at random. It decides which strategies can work.",
    plain: "How the market is behaving right now: trending, ranging or moving at random.",
    related: ["trend", "range", "volatility"],
    lesson: "2.8.1",
  },
  {
    id: "trend-following",
    term: "Trend following",
    definition: "A family of rules that enters in the direction of an established trend, keeps losses small with a stop and lets winners run with a trailing exit, usually at a 30–45% win rate.",
    plain: "Trading in the direction of an established trend, cutting losses fast and letting winners run.",
    related: ["trend", "trailing-stop", "moving-average", "whipsaw", "market-regime"],
    lesson: "2.8.2",
  },
  {
    id: "trend-filter",
    term: "Trend filter",
    definition: "A condition, such as price above a rising 50-period moving average, that allows trades only in the direction of the larger trend.",
    plain: "A rule that allows trades only in the direction of the larger trend.",
    related: ["trend", "moving-average", "pullback"],
    lesson: "2.8.3",
  },
  {
    id: "volatility-contraction",
    term: "Volatility contraction",
    definition: "A stretch of unusually narrow candles, such as an NR7, an inside bar or a Bollinger squeeze. Ranges tend to return to their usual size afterwards, in either direction.",
    plain: "A quiet stretch of unusually small candles, which often comes before larger moves.",
    related: ["volatility", "nr7", "inside-bar", "squeeze", "volatility-clustering"],
    lesson: "2.8.5",
  },
  {
    id: "range-trading",
    term: "Range trading",
    definition: "Buying near support and selling near resistance in a confirmed range, with stops just outside the edges, until the first close outside the range.",
    plain: "Buying near the bottom of a range and selling near the top, until it breaks.",
    related: ["range", "support", "resistance", "mean-reversion"],
    lesson: "2.8.6",
  },
  {
    id: "mean-reversion",
    term: "Mean reversion",
    definition: "A family of rules that fades short-term extremes, betting that price returns toward an average. Typically a high win rate, with rare large losses.",
    plain: "Betting that a stretched price will move back toward its average.",
    related: ["range-trading", "negative-skew", "bollinger-bands", "win-rate"],
    lesson: "2.8.7",
  },
  {
    id: "negative-skew",
    term: "Negative skew",
    definition: "A distribution of trade results with many small wins and rare large losses, so the average can be negative despite a high win rate.",
    plain: "Many small wins and rare large losses; it looks smooth until the big loss arrives.",
    related: ["mean-reversion", "win-rate", "expectancy"],
    lesson: "2.8.7",
  },
  {
    id: "turtle-soup",
    term: "Turtle Soup",
    definition: "Connors and Raschke's failed-breakout trade: after a new 20-candle high whose previous 20-candle high is at least 4 candles old, sell just under the old high, with a stop above the new extreme. Mirrored for lows.",
    plain: "Trading against a breakout of a 20-candle extreme that fails and returns inside the range.",
    related: ["false-breakout", "failed-breakout", "breakout"],
    lesson: "2.8.8",
  },
  {
    id: "indicator-redundancy",
    term: "Indicator redundancy",
    definition: "Counting indicators built from the same input as separate evidence. Their readings are highly correlated, so together they add little to one of them alone.",
    plain: "Several indicators built from the same prices, telling you the same thing more than once.",
    related: ["confluence", "collinearity", "confirmation-bias", "correlation"],
    lesson: "2.8.9",
  },
  {
    id: "after-cost-expectancy",
    term: "After-cost expectancy",
    definition: "Expectancy per trade once spread, commissions and slippage are taken off. In R: gross expectancy minus the cost per unit divided by the stop distance.",
    plain: "The average result per trade once spread, commission and slippage are taken off.",
    related: ["expectancy", "spread", "commission", "slippage"],
    lesson: "2.8.10",
  },
];

const CONCEPTS: Concept[] = [
  {
    id: "market-regime",
    name: "Market regime",
    category: "technical_analysis",
    summary: "The prevailing behaviour of price, such as trending, ranging or random, which decides which strategies can work.",
    body: [
      "A trend shows higher highs and higher lows, or lower ones. A range turns at the same two levels with flat averages. A random walk shows neither: swings overlap with no edges and no direction.",
      "Every strategy is a bet on one regime. The same rule can make money in one month and lose in the next without changing at all, because the market did. Label the regime before choosing a strategy, and treat an unclear label as a reason to trade smaller or not at all.",
    ],
    example: "The same moving-average rule: +6.0R over 12 trades in a trending month (5 wins averaging +2.6R), −8.4R over 15 trades in a ranging one (3 wins of +1.2R, 12 losses).",
    related: ["trend", "range", "random-walk", "strategy-regime-fit"],
    missions: ["M02"],
    lessons: ["2.8.1", "2.8.2", "2.8.8"],
  },
  {
    id: "strategy-regime-fit",
    name: "Strategy–regime fit",
    category: "decision_making",
    summary: "Matching a strategy family to the regime it is built for, and standing aside when the regime is unclear.",
    body: [
      "Trend following and pullbacks work in trends and lose in ranges. Range trading, mean reversion and failed-breakout fades work in ranges and lose when a trend starts. Breakouts work when a range turns into a trend.",
      "The skill has three steps: diagnose the regime, choose a family or skip, and size for the regime you might be wrong about. On a random walk no rule has an edge, so 'No trade' is the right choice there. The matrix itself is a practitioners' synthesis, evidence grade C.",
    ],
    example: "Guessing among trend, range and no clear regime is right one time in three. Getting 8 or more of 12 segments right by luck alone happens about 1.9% of the time.",
    related: ["market-regime", "base-rates", "when-not-to-trade"],
    missions: ["M10"],
    lessons: ["2.8.1"],
  },
  {
    id: "trend-following",
    name: "Trend following",
    category: "technical_analysis",
    summary: "Rules that trade in the direction of an established trend, cutting losses quickly and letting winners run, usually at a low win rate.",
    body: [
      "A typical system: price above a rising 50-period average or a fast average above a slow one; entry on the cross or on a close above the 20-candle high; a stop 2–3 ATR away; exit on the opposite cross or a trailing stop.",
      "Win rates of 30–45% are normal: a few large winners pay for many small losses. The system loses in ranges, to whipsaws, and at sharp reversals, and its losing runs are long. Moving-average timing on one market is grade B; diversified across many markets, as time-series momentum, grade A.",
    ],
    example: "7 wins of +3.2R and 13 losses of 1R in 20 trades: +9.4R gross, +7.4R after 0.10R of costs per trade, +0.37R per trade with 65% losers.",
    related: ["market-regime", "moving-average", "ma-crossover", "trailing-stop", "expectancy"],
    missions: ["M02"],
    lessons: ["2.8.2"],
  },
  {
    id: "trend-pullback",
    name: "Pullback in a trend",
    category: "technical_analysis",
    summary: "Entering an established trend after a temporary move against it, with a stop beyond the pullback low.",
    body: [
      "Three parts: a trend filter (price above a rising 50-period average, higher highs and lows), a pullback to the EMA 20 or an old breakout level, and a trigger, such as a close back above the prior candle's high. The stop goes under the pullback low, often minus half an ATR.",
      "Waiting for the pullback buys a better reward-to-risk than chasing, but some pullbacks never come and others turn into reversals: a lower low under the last higher low, or a close under the 50, switches the filter off. Practitioners' method, grade C.",
    ],
    example: "Stop 56.40, target 61.00. Buying the pullback at 57.20 gives 3.80 ÷ 0.80 = 4.75 : 1; chasing at 58.40 gives 2.60 ÷ 2.00 = 1.3 : 1. At 1%, 116 units at 57.20 risk 99.40 with commissions.",
    related: ["trend-following", "pullback", "invalidation-level", "fomo"],
    missions: ["M06"],
    lessons: ["2.8.3"],
  },
  {
    id: "range-breakout-strategy",
    name: "Range breakout strategy",
    category: "technical_analysis",
    summary: "Trading a decisive close beyond a tested range edge, with a stop back inside the range and a measured-move target.",
    body: [
      "The card: a level touched at least twice, a close beyond it (ideally on above-average volume), a stop back inside under the breakout candle, and a target of the range's height added to the level.",
      "Most trades are small losses: breakouts fail most from untested levels, on wicks, on low volume and late in long moves. The reward-to-risk lets about 30% winners break even. Grade C to D for drawn levels; grade B for a rule-based channel breakout on one market.",
    ],
    example: "Range 97.00–100.00, close at 100.15, stop 99.20, target 103.00: 3.0 : 1 before costs. After 0.20 per unit, break-even rises from 25.0% to 30.3%. 95 units risk 99.73.",
    related: ["breakout", "false-breakout", "support-and-resistance", "measured-move", "failed-breakout-strategy"],
    missions: ["M10"],
    lessons: ["2.8.4"],
  },
  {
    id: "volatility-contraction-breakout",
    name: "Volatility contraction breakout",
    category: "technical_analysis",
    summary: "Bracketing a narrow-range period with stop orders on both sides, betting on expansion rather than on direction.",
    body: [
      "A contraction, such as an NR7, an inside bar or a Bollinger squeeze, is bracketed with a buy stop above and a sell stop below, linked one-cancels-the-other, each with its stop on the opposite side.",
      "Volatility clustering is well documented (grade A), but the directional edge after a contraction is weak after costs (grade C). Tight stops make costs heavy in R, and a sideways resolution can stop both sides when the plan re-arms the other one.",
    ],
    example: "NR7 high 100.60, low 99.70: buy stop 100.65, sell stop 99.65, stops 1.00 away. Costs ≈ 0.20R per side; 90 units per side risk 99.02. Both stopped: −198.04, about 2% of the account.",
    related: ["volatility", "volatility-clustering", "volatility-squeeze", "oco-order", "costs-in-r"],
    missions: [],
    lessons: ["2.8.5"],
  },
  {
    id: "range-trading",
    name: "Range trading",
    category: "technical_analysis",
    summary: "Buying near support and selling near resistance in a confirmed range, until a close outside it.",
    body: [
      "Confirm first: at least two touches on each edge, flat averages, a low ADX. Enter near an edge with a limit or a reversal candle, put the stop just outside it, and exit near the other edge or the middle.",
      "The flip rule: the first confirmed close outside ends range trading, and the breakout card takes over. The biggest losses come from breakouts and gaps through the edge. Small targets make costs heavy. Grade C: it depends on the regime holding.",
    ],
    example: "Buy 97.30, stop 96.40, target 99.70: 2.67 : 1 before costs, 2.0 : 1 after 0.20 per unit; break-even rises from 27.3% to 33.3%. A gap open at 95.80 costs 159.66, about 1.6R.",
    related: ["range", "support-and-resistance", "limit-order", "range-breakout-strategy"],
    missions: [],
    lessons: ["2.8.6"],
  },
  {
    id: "mean-reversion",
    name: "Mean reversion",
    category: "technical_analysis",
    summary: "Fading short-term extremes back toward an average, often with a high win rate and rare large losses.",
    body: [
      "Bollinger reversion buys a close under the lower band in a range and exits at the middle band. RSI(2) buys when RSI(2) drops under 10 with price above the SMA 200, and exits on a close above the SMA 5.",
      "Both win often and lose rarely but big. In a trend, price walks down the band; in a crash, oversold gets more oversold; gaps jump stops. A catastrophic stop, such as 3 ATR, is required on every trade. Grade C for Bollinger reversion, C to B for RSI(2).",
    ],
    example: "15 wins of +0.5R, 4 losses of 1R and one gap of 5R: −1.5R with a 75% win rate. At 75% wins and +0.5R, break-even needs losses averaging 1.5R or less.",
    related: ["return-skew", "range-trading", "bollinger-bands", "gap-risk"],
    missions: [],
    lessons: ["2.8.7"],
  },
  {
    id: "return-skew",
    name: "Return skew",
    category: "risk_management",
    summary: "The asymmetry of trade results: many small losses and a few big wins (positive) or the reverse (negative).",
    body: [
      "Trend following has positive skew: frequent small losses, rare large wins, and long losing runs. Mean reversion has negative skew: frequent small wins and rare large losses, so it looks smooth until the big loss arrives.",
      "The win rate alone says nothing about which you have. Check the average loss against the break-even level, and cap the tail of a negatively skewed rule with a stop.",
    ],
    example: "At a 35% win rate, the chance of at least one run of 8 or more losses in 100 trades is about 69%. At a 75% win rate and +0.5R wins, one 5R loss among 5 losses lifts the average loss to 1.8R, past break-even.",
    related: ["mean-reversion", "trend-following", "expectancy", "streaks-and-runs"],
    missions: [],
    lessons: ["2.8.7", "2.8.2"],
  },
  {
    id: "failed-breakout-strategy",
    name: "Failed breakout strategy",
    category: "technical_analysis",
    summary: "Trading against a breakout that returns inside the range, with a stop beyond the failed extreme.",
    body: [
      "Turtle Soup: after a new 20-candle high, with the previous one at least 4 candles earlier, sell just under the old high (valid on that candle only), with the stop just above the new extreme and the far edge of the range as the target. Mirrored for lows.",
      "It mirrors the breakout: same level, opposite bet. The breakout pays when the range ends, the fade when it holds. Choose from the signs (closes back inside, thin volume, a fast return) rather than from the last result. Grade C.",
    ],
    example: "Range 97.00–100.00; a spike to 100.70 closes at 99.80. Sell 99.90, stop 100.80, target 97.60: 2.56 : 1 gross, 2.10 ÷ 1.10 after 0.20 of costs, break-even 34.4%. 99 units risk 99.04.",
    related: ["false-breakout", "range-breakout-strategy", "trapped-traders", "market-regime"],
    missions: ["M10"],
    lessons: ["2.8.8"],
  },
  {
    id: "after-cost-evaluation",
    name: "After-cost evaluation",
    category: "decision_making",
    summary: "Judging a strategy by its net result per trade, against the passive benchmark and a random-walk control.",
    body: [
      "Turn costs into R (cost per unit ÷ stop distance) and take them off the gross expectancy. Then compare the net result with simply holding the market and with the same rule on a random walk, where the gross edge is zero by construction.",
      "Finally, put an interval around the result: about 1.96 × the spread of results ÷ √n either side. Small edges need hundreds of trades, and published edges shrink after publication (McLean and Pontiff: 26% less out of sample, 58% less after publication).",
    ],
    example: "+0.12R gross on a 1.00 stop with 0.20 per unit of costs: −0.08R net, −16R over 200 trades. 50 trades with a 1.44R spread leave an interval of ±0.40R.",
    related: ["costs-in-r", "passive-benchmark", "random-walk", "sample-size", "trading-costs"],
    missions: [],
    lessons: ["2.8.10"],
  },
];

export const UNIT_2_8: UnitContent = {
  lessons: [L281, L282, L283, L284, L285, L286, L287, L288, L289, L2810],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
