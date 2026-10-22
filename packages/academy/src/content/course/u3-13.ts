import type { CandleData, ChartLayer, ChartSpec, Concept, GlossaryTerm, Lesson, MarkRole, Question, TaskData, UnitContent } from "../../types";

/** Unit 3.13 · Systematic strategies and evidence (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */

// Each strategy family is shown twice: as published research, stated with its evidence grade (only figures checked
// against the source), and as a seeded backtest on synthetic markets with an R0 control where it matters. The
// generators live in the author's scratch folder (l1-tsmom, l1-turtle, l1-figure, l2-momentum, l3-carry, l4-season,
// l5-pairs, l6-event, l7-decay, data.mjs); seeds are noted next to each series and every figure in the text was
// checked against them.

/** One candle, in price units with 2 decimals. */
const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });
/** n flat candles: they only set the time axis of a chart that draws its layers alone. */
const blank = (n: number, p: number): CandleData[] => Array.from({ length: n }, () => k(p, p, p, p));
/** A line through closes, as candles (for `style: "line"` charts and reveals). */
const asLine = (values: number[]): CandleData[] => values.map((v) => k(v, v, v, v));
/** A line layer. */
const ln = (values: (number | null)[], role: MarkRole, label?: string, dashed?: boolean): ChartLayer => ({ kind: "line", values, role, ...(label ? { label } : {}), ...(dashed ? { dashed } : {}) });
/** A marker at a price. */
const dot = (index: number, price: number, label?: string, role: MarkRole = "concept"): ChartLayer => ({ kind: "marker", index, price, role, ...(label ? { label } : {}) });
/** A horizontal reference line without a price chip. */
const rule = (price: number, label?: string): ChartLayer => ({ kind: "level", price, role: "neutral", chip: false, ...(label ? { label } : {}) });

/** A card for the sorting widget; wrong picks are explained by the option's rule plus the card's clue. */
interface SortCard {
  id: string;
  text: string;
  answer: string;
  correct: string;
  clue: string;
  override?: Record<string, string>;
}

function cardSort(options: { id: string; label: string; what: string }[], cards: SortCard[]): TaskData {
  return {
    options: options.map(({ id, label }) => ({ id, label })),
    cards: cards.map((c) => ({
      id: c.id,
      text: c.text,
      answer: c.answer,
      correct: c.correct,
      rationales: Object.fromEntries(options.filter((o) => o.id !== c.answer).map((o) => [o.id, c.override?.[o.id] ?? `${o.what} ${c.clue}`])),
    })),
  };
}

// ─── Chart data ─────────────────────────────────────────────────────────────

/** 3.13.1 B3: the 12-month rule on 12 synthetic markets, 30 years, vol-scaled portfolio, quarterly equity from 100. l1-tsmom.mjs seed 31302. */
const TSMOM_EQ = [100, 99.73, 96.09, 93.99, 86.82, 85.93, 87.42, 89.41, 86.63, 88.29, 87.98, 93.07, 99.39, 103.11, 104.04, 108.46, 119.02, 126.29, 137.07, 154.04, 154.62, 171.41, 182.75, 206.14, 218.19, 208.32, 211.59, 219.09, 236.65, 255.12, 279.47, 314.27, 320.06, 307.76, 313.25, 340.97, 372.74, 374.78, 350.86, 362.41, 338.73, 373.38, 374.54, 354.44, 361.7, 362.06, 409.02, 416.32, 414.84, 444.58, 452.76, 406.65, 415.3, 395.55, 426.14, 443.48, 466.21, 458.92, 450.51, 493.02, 514.36, 501.33, 542.97, 521.72, 520.82, 509.43, 494.02, 536.61, 588.17, 568.55, 582.63, 570.88, 568.5, 585.75, 616.66, 666.59, 691.39, 752.97, 795.87, 754.91, 771.77, 715.94, 752.87, 737.18, 782.68, 826.26, 849.41, 885.26, 900.3, 932.69, 951.78, 975.46, 1047.32, 1038.54, 1030.72, 1179.9, 1149.84, 1171.03, 1222.65, 1308.89, 1385.04, 1402.63, 1371.66, 1483.16, 1524.23, 1503.84, 1633.86, 1799.69, 1877.73, 2016.11, 2052.78, 2259.59, 2452.02, 2264.57, 2355.38, 2508.29, 2650.81, 2853.4, 3040.61, 3254.06, 3248.77];
/** 3.13.1 B6: one System 2 trade on synthetic LXF, N = 2.50 at the breakout (day 62). l1-figure.mjs seed 31321. */
const SYS2: CandleData[] = [
  k(250.06, 251.91, 249.72, 250.99),
  k(251.13, 251.87, 249.97, 250.71),
  k(250.75, 253.27, 249.64, 252.94),
  k(253.02, 254.60, 252.68, 253.40),
  k(253.31, 253.84, 251.67, 252.95),
  k(253.03, 254.34, 251.21, 252.01),
  k(251.82, 253.81, 250.92, 252.97),
  k(253.00, 253.97, 252.34, 253.10),
  k(253.29, 253.93, 251.34, 251.71),
  k(251.80, 252.45, 250.39, 250.97),
  k(251.07, 252.68, 250.14, 251.96),
  k(251.77, 253.54, 250.41, 251.95),
  k(251.75, 253.06, 250.17, 251.67),
  k(251.67, 253.00, 250.00, 250.45),
  k(250.40, 251.72, 250.05, 250.56),
  k(250.43, 252.12, 248.88, 249.21),
  k(249.14, 249.49, 247.66, 247.96),
  k(247.76, 248.60, 246.60, 246.91),
  k(247.08, 248.08, 245.21, 246.14),
  k(246.22, 246.72, 245.69, 246.12),
  k(246.15, 246.87, 245.48, 245.78),
  k(245.83, 247.93, 244.52, 247.40),
  k(247.36, 248.70, 246.77, 247.85),
  k(247.91, 249.88, 247.54, 248.30),
  k(248.21, 250.34, 247.30, 249.29),
  k(249.32, 249.94, 248.61, 249.63),
  k(249.26, 252.11, 247.86, 251.38),
  k(251.51, 252.23, 248.31, 249.46),
  k(249.42, 251.45, 249.04, 251.08),
  k(250.99, 251.48, 249.46, 250.96),
  k(250.71, 252.69, 250.05, 252.16),
  k(252.22, 253.55, 251.23, 252.51),
  k(252.40, 254.16, 251.53, 253.66),
  k(253.65, 254.52, 252.74, 253.95),
  k(254.05, 254.91, 253.34, 254.07),
  k(254.22, 255.40, 251.57, 252.88),
  k(252.51, 254.60, 251.91, 252.95),
  k(252.95, 254.06, 250.92, 251.58),
  k(251.57, 252.61, 250.48, 250.92),
  k(250.84, 251.25, 248.70, 249.78),
  k(249.56, 250.07, 248.93, 249.79),
  k(250.03, 250.70, 247.44, 247.95),
  k(247.91, 248.66, 247.38, 248.23),
  k(248.16, 248.53, 246.68, 247.57),
  k(247.59, 248.66, 247.10, 248.30),
  k(248.43, 248.94, 246.88, 247.95),
  k(248.08, 248.55, 246.46, 247.39),
  k(247.30, 248.64, 246.03, 248.21),
  k(248.11, 249.12, 245.77, 246.75),
  k(246.78, 247.97, 246.25, 246.90),
  k(246.86, 248.15, 245.75, 247.26),
  k(247.18, 248.52, 246.85, 247.46),
  k(247.33, 249.93, 246.53, 248.78),
  k(248.95, 250.22, 248.31, 249.94),
  k(249.92, 251.75, 249.09, 250.70),
  k(250.62, 252.86, 250.08, 251.80),
  k(251.58, 255.36, 250.50, 253.41),
  k(253.35, 254.51, 252.19, 253.43),
  k(253.50, 254.97, 252.68, 253.44),
  k(253.45, 254.11, 251.42, 252.49),
  k(252.54, 253.67, 251.96, 252.75),
  k(252.94, 253.58, 250.45, 251.43),
  k(251.51, 255.78, 251.00, 254.44),
  k(254.33, 257.23, 253.91, 255.88),
  k(255.98, 256.33, 255.30, 255.91),
  k(256.06, 258.18, 255.62, 257.57),
  k(257.76, 258.13, 256.58, 257.47),
  k(257.40, 260.12, 256.93, 258.72),
  k(258.94, 259.69, 258.04, 259.18),
  k(259.08, 259.78, 258.48, 259.44),
  k(259.62, 260.53, 257.75, 258.63),
  k(258.73, 261.17, 258.38, 260.20),
  k(260.07, 260.76, 258.40, 259.28),
  k(259.26, 260.46, 258.57, 260.05),
  k(259.91, 261.09, 259.04, 260.31),
  k(260.60, 261.69, 259.46, 261.08),
  k(261.04, 262.52, 260.62, 261.93),
  k(261.71, 263.82, 260.82, 263.19),
  k(263.14, 265.27, 261.74, 264.44),
  k(264.35, 265.72, 263.64, 264.68),
  k(264.59, 267.91, 263.92, 266.63),
  k(266.77, 268.05, 266.26, 267.05),
  k(267.03, 268.57, 265.44, 267.02),
  k(266.90, 268.78, 266.34, 268.42),
  k(268.44, 269.82, 267.81, 269.07),
  k(268.70, 269.29, 266.55, 267.59),
  k(267.48, 268.91, 266.42, 268.57),
  k(268.77, 270.73, 267.60, 268.35),
  k(268.39, 270.62, 267.71, 270.34),
  k(270.52, 271.52, 268.54, 269.43),
  k(269.64, 270.46, 265.91, 267.70),
  k(267.46, 267.90, 266.37, 267.26),
  k(267.35, 268.71, 266.18, 266.57),
  k(266.54, 267.18, 263.29, 264.44),
  k(264.51, 264.87, 263.00, 263.50),
  k(263.26, 263.86, 261.53, 262.12),
  k(262.20, 262.92, 260.00, 261.74),
  k(261.81, 262.97, 259.25, 260.52),
  k(260.15, 260.61, 259.64, 260.07),
];
/** 3.13.3 B5: a 3x carry position, weekly from 100. Sharpe 2.02 over weeks 1–156, then a 10% jump. gen seed 31339. */
const CARRY_PATH = [100, 99.52, 99.06, 100.14, 100.22, 100.5, 100.93, 102.09, 102.28, 103.32, 103.16, 104.68, 104.66, 104.47, 104.99, 104.21, 103.42, 102.71, 103.47, 103.03, 103.83, 104.03, 103.4, 104.29, 104.48, 105.28, 105.56, 105.02, 105.67, 105.32, 106.11, 106.47, 106.78, 105.49, 105.67, 104.21, 103.52, 102.67, 103.07, 102.97, 103.5, 103.23, 104.35, 103.63, 103.18, 104.08, 103.26, 103.31, 102.44, 103.79, 104.35, 104.19, 105.17, 103.73, 105.2, 103.49, 103.34, 103.59, 104.25, 104.33, 104.54, 104.83, 104.88, 105.64, 105.87, 106.54, 107.35, 107.2, 106.67, 106.2, 105.62, 106.22, 105.66, 105.26, 105.08, 106.28, 107.01, 107.19, 107.16, 106.45, 106.34, 106.66, 105.36, 105.69, 106.41, 106.71, 105.78, 105.79, 106.84, 106.71, 107.93, 109.16, 109.72, 110.15, 111.37, 110.93, 111.4, 110.27, 110, 110.05, 109.78, 110.46, 111.53, 112.5, 113.21, 113.33, 114.2, 115, 114.34, 113.87, 113.19, 115.12, 116.76, 117.4, 117.09, 116.74, 118.08, 117.47, 118.38, 118.95, 119.43, 120.67, 120.06, 119.29, 119.82, 119.53, 120.33, 119.68, 119.84, 119.98, 120.52, 122.69, 123.17, 124.28, 126.06, 128.32, 127.68, 128.03, 129.09, 129.15, 129.4, 128.09, 127.7, 127.83, 125.52, 125.78, 127.87, 129.83, 132.1, 132.17, 132.48, 133.64, 134.91, 136.01, 135.9, 138.68, 137.7, 96.39, 96.59, 94.91, 94.23, 93.89, 94.27, 94.52, 94.8, 94.13, 92.28, 92.75, 93.85, 95.6];
/** 3.13.5 B1: spread z-scores (formation mean and sd from days 0–249), every 5th day of 750. l5-pairs.mjs seed 31353: pair 1 cointegrated, pair 4 correlated only. */
const Z_COINT = [1.04, 0.41, 1, 1.22, 1.12, 0.35, 1.02, -0.13, -0.83, -1.49, -0.88, -0.8, -1.62, -1.02, -1.06, -0.34, -1.18, -1.15, -0.53, -0.37, -0.49, -0.23, -0.03, 1.06, -0.15, -1.79, 0.56, 0.72, -0.41, 0.25, 0.12, 0.5, -0.42, 0.74, 1.47, 3.3, 2.29, 1.32, -0.22, 0.16, -0.39, -0.73, -1.46, -0.4, 0.45, 1.12, -0.54, -1.13, -0.24, 0.82, -0.16, 0.09, 1.67, 1.27, 1.68, -0.56, -0.98, 0.23, 0.81, 0.69, 1.36, 0.73, 1.45, 0.92, -0.48, -1.17, 0.86, 0.8, -0.95, 0.01, -0.11, 0.95, 0.27, -0.5, -0.57, -0.28, -0.86, 0.6, 1.66, 0.96, 0.73, 0.12, 0.21, -1.43, 0.75, 0.29, 0.17, 1.49, 2.31, 1.73, 0.65, 0.88, 1.23, 0.93, 0.99, 0.47, 1.35, 1.2, -1.25, -0.39, -0.31, 0.29, 0.13, 1.44, 1.14, 1.03, 0.45, 1.24, 0.17, -0.35, -0.9, -0.67, -1.03, -0.87, -0.62, 0.45, 1.57, -0.25, 0.67, 1.25, -0.47, 0.43, -1.17, -2.11, -0.92, -1.3, -1.66, -0.68, -0.45, 1.08, 1.24, 1.57, 1.42, 1.59, 1.48, 1.48, 0.87, 1.08, -0.98, 0.2, 1.11, 0.83, 0.88, 0.34, -0.67, -1.32, -1.47, -1.58, -1.12, -2.3];
const Z_CORR = [0.62, -0.76, -1, -1.38, -2.06, -1.69, 0.22, -0.45, -0.02, 0.19, 0.82, 1.52, 0.05, -1.2, -0.88, -0.53, -0.9, -0.45, -0.51, -0.12, -0.05, 0.24, 0.96, 1.04, -0.15, -0.85, -0.25, -0.14, 0.96, 1.34, -0.44, -0.36, 0.36, 1.33, 1.17, -0.79, -1.96, -1.62, -1.47, -0.39, -0.3, 0.15, 0.54, 0.75, 1.67, 1.63, 1, 0.75, 1.03, 1.75, 2.26, 0.95, 1.14, 0.19, -0.23, -0.86, -0.81, -0.06, 0.32, 0.43, 1.18, 2.14, 1.66, 3.78, 2.78, 4.07, 5, 6.2, 5.25, 5.64, 4.17, 3.25, 2.72, 3.56, 4.32, 4.01, 4.08, 4.28, 4.51, 5.35, 5.66, 5.28, 5.03, 4.64, 4.2, 3.65, 3.53, 3.48, 2.92, 2.61, 2.75, 1.79, 2.64, 2.86, 3.16, 2.12, 3.28, 4.4, 3.86, 3.76, 3.45, 2.51, 1.61, 1.33, 1.84, 2.11, 1.22, 1.2, 1.18, 1.61, 1.73, 1.57, 1.01, 0.96, 0.62, 1.76, 0.7, 0.99, 0.25, 0.83, -0.12, -0.6, -1.65, -1.46, -0.98, -1.57, -1.85, -2.3, -0.5, -1.08, -1.49, -2.08, -2.48, -1.72, -1.79, -2.03, -3.75, -3.23, -1.74, -2.5, -3.48, -2.71, -1.92, -2.89, -2.53, -0.88, -0.87, 0.35, 0.57, 0.66];
/** 3.13.5 B6: a pair's z-score around a merger (hand-built, seeded noise 31357). Short the spread at day 30 (z 2.21); news on day 34. */
const Z_BREAK = [0.03, -0.06, -0.17, 0.13, 0.46, -0.53, 0.06, 0.41, 0.1, 0.51, 0.62, 1.04, 0.77, -0.26, -0.53, 0.2, 0.24, 0.05, 0.19, 0.2, 0.56, -0.09, 0.5, -0.24, 1.05, 1.47, 1.69, 1.77, 1.8, 1.77, 2.21, 2.26, 2.24, 2.32, 3.92, 3.96, 3.94, 4.29, 4.68, 4.55, 4.95, 4.73, 5.1, 5.27, 5.71, 5.61, 5.99, 6.12, 6.23, 6.35];
/** 3.13.4 B3: a synthetic gas market, weekly from April (0) to December expiry (36). data.mjs seed 31344. */
const GAS_SPOT = [3, 2.99, 3.01, 2.93, 3.05, 2.99, 3.05, 3.05, 3.01, 3.07, 3.08, 3.11, 3.16, 3.22, 3.19, 3.12, 3.21, 3.17, 3.24, 3.23, 3.25, 3.26, 3.27, 3.32, 3.33, 3.4, 3.29, 3.38, 3.43, 3.45, 3.49, 3.47, 3.51, 3.55, 3.54, 3.52, 3.58];
const GAS_DEC = [3.55, 3.55, 3.55, 3.56, 3.5, 3.56, 3.58, 3.55, 3.58, 3.57, 3.59, 3.55, 3.58, 3.51, 3.56, 3.57, 3.57, 3.58, 3.58, 3.59, 3.58, 3.58, 3.59, 3.56, 3.6, 3.58, 3.6, 3.58, 3.61, 3.53, 3.61, 3.58, 3.57, 3.57, 3.59, 3.62, 3.58];
/** 3.13.6 B2: average CAR (%) from day −5 to +60 with 95% bands, 40 positive and 40 negative synthetic surprises. l6-event.mjs seed 31363. */
const CAR_POS = [-0.31, -0.27, -0.32, -0.33, -0.42, 3.7, 3.64, 3.32, 3.29, 3.16, 3.49, 3.39, 3.96, 3.79, 3.96, 4.29, 4.29, 4.43, 4.59, 4.43, 4.65, 4.89, 5.1, 4.84, 5.13, 5.01, 5.06, 5.03, 5.12, 4.85, 4.76, 4.96, 5, 4.96, 4.82, 4.85, 5.16, 5.09, 5.13, 4.86, 4.99, 5.14, 5, 5.14, 5.2, 5.53, 5.58, 5.59, 5.76, 5.74, 5.78, 5.81, 5.71, 5.87, 5.83, 5.64, 5.9, 5.92, 6.1, 6.24, 6.14, 6.09, 6.21, 6.39, 6.47, 6.28];
const CAR_POS_LO = [-0.71, -0.85, -1.07, -1.06, -1.23, 2.81, 2.67, 2.24, 2.25, 2.06, 2.35, 2.23, 2.75, 2.54, 2.56, 2.88, 2.88, 2.98, 3.07, 2.87, 3.04, 3.25, 3.33, 2.96, 3.31, 3.18, 3.2, 3.2, 3.25, 2.91, 2.83, 2.99, 2.99, 2.93, 2.75, 2.67, 2.84, 2.75, 2.86, 2.66, 2.74, 2.85, 2.74, 2.69, 2.64, 2.83, 2.86, 2.86, 3.01, 3.03, 3.07, 3, 2.92, 3.08, 2.92, 2.83, 3.11, 3.04, 3.11, 3.38, 3.19, 3.13, 3.24, 3.41, 3.39, 3.17];
const CAR_POS_HI = [0.08, 0.32, 0.43, 0.39, 0.38, 4.58, 4.6, 4.4, 4.34, 4.25, 4.63, 4.54, 5.16, 5.04, 5.37, 5.7, 5.71, 5.89, 6.12, 5.99, 6.27, 6.53, 6.88, 6.73, 6.95, 6.84, 6.91, 6.87, 6.99, 6.79, 6.7, 6.94, 7.01, 7, 6.89, 7.02, 7.49, 7.42, 7.4, 7.07, 7.23, 7.43, 7.26, 7.59, 7.76, 8.23, 8.3, 8.32, 8.52, 8.46, 8.49, 8.62, 8.49, 8.67, 8.74, 8.46, 8.68, 8.79, 9.09, 9.11, 9.09, 9.05, 9.17, 9.37, 9.56, 9.39];
const CAR_NEG = [0.31, 0.29, 0.24, 0.44, 0.53, -3.81, -3.93, -4.17, -4.32, -4.54, -4.75, -4.82, -4.7, -4.87, -4.8, -5.1, -5.44, -5.27, -5.1, -5.12, -5.06, -5, -5.32, -5.39, -5.77, -5.77, -5.82, -5.49, -5.44, -5.66, -6.06, -6.44, -5.95, -6.07, -6.01, -5.53, -5.5, -5.84, -5.9, -5.73, -5.61, -5.78, -5.75, -5.83, -5.81, -6.17, -6, -5.94, -6.19, -6.47, -6.43, -6.5, -6.52, -6.46, -6.45, -6.31, -6.55, -6.69, -6.96, -6.95, -6.93, -6.98, -7.19, -7.36, -7.55, -7.21];
const CAR_NEG_LO = [0.06, -0.16, -0.33, -0.26, -0.23, -4.64, -4.8, -5.13, -5.36, -5.65, -5.83, -5.9, -5.82, -6.14, -6.16, -6.44, -6.76, -6.58, -6.43, -6.43, -6.51, -6.42, -6.72, -6.79, -7.21, -7.13, -7.31, -6.92, -6.95, -7.18, -7.57, -8.02, -7.6, -7.79, -7.72, -7.3, -7.31, -7.61, -7.66, -7.57, -7.42, -7.7, -7.77, -7.85, -7.92, -8.32, -8.12, -8.07, -8.32, -8.65, -8.62, -8.73, -8.83, -8.8, -8.73, -8.56, -8.83, -9.05, -9.38, -9.33, -9.36, -9.48, -9.72, -9.99, -10.12, -9.82];
const CAR_NEG_HI = [0.56, 0.75, 0.81, 1.13, 1.29, -2.97, -3.05, -3.21, -3.27, -3.43, -3.67, -3.74, -3.59, -3.6, -3.44, -3.76, -4.13, -3.96, -3.77, -3.82, -3.61, -3.57, -3.92, -4, -4.32, -4.41, -4.34, -4.07, -3.93, -4.14, -4.55, -4.86, -4.31, -4.36, -4.3, -3.76, -3.7, -4.07, -4.15, -3.89, -3.81, -3.86, -3.74, -3.81, -3.71, -4.01, -3.88, -3.82, -4.07, -4.3, -4.24, -4.26, -4.21, -4.12, -4.18, -4.05, -4.27, -4.33, -4.54, -4.57, -4.5, -4.48, -4.66, -4.74, -4.99, -4.61];

/** 3.13.1 B3: the seeded portfolio on a log scale. Peak 102.30 at month 2, back above it only after month 37. */
const TSMOM_CHART: ChartSpec = {
  candles: blank(121, 100),
  hideCandles: true,
  scale: "log",
  range: [80, 3500],
  height: 230,
  describe: "Equity of a seeded 12-month time-series momentum portfolio over 30 years, quarterly, on a log scale. It falls 18.2% from its first peak by month 23, takes 35 months to get back above it, and ends at 3,248.77.",
};

/** 3.13.1 B6: System 2 on LXF. Entry 255.40 (day 62), units at 256.65, 257.90, 259.15 (days 63, 65, 67), exit 260.62 (day 96). */
const SYS2_CHART: ChartSpec = {
  candles: SYS2,
  height: 260,
  describe: "Synthetic LXF daily candles. A range between about 244.5 and 255.4 for 61 days, a breakout above 255.40 on day 62, a trend to a high close of 270.34, then a fall through the 20-day low at 260.62 on day 96.",
};

/** 3.13.3 B5: weeks 0–168 of the carry path. */
const CARRY_CHART: ChartSpec = {
  candles: blank(169, 100),
  hideCandles: true,
  range: [90, 145],
  height: 220,
  describe: "A 3x carry position from 100. It climbs steadily to 137.70 over 156 weeks, then drops to 96.39 in week 157 on a single 10% jump.",
};

/** 3.13.4 B3: the December contract of a synthetic gas future (the line) against spot. */
const GAS_CHART: ChartSpec = {
  candles: asLine(GAS_DEC),
  style: "line",
  visible: 2,
  range: [2.85, 3.75],
  height: 220,
  layers: [ln(GAS_SPOT, "concept", "SPOT"), { kind: "level", price: 3.55, role: "entry", label: "BOUGHT DEC 3.55" }],
  describe: "A synthetic gas market from April to December. Spot rises from 3.00 to 3.58. The December contract starts at 3.55 and ends at 3.58.",
};

/** 3.13.5 B1: two spreads in z-score units over 750 days (every 5th day). */
const PAIRS_CHART: ChartSpec = {
  candles: blank(150, 0),
  hideCandles: true,
  range: [-4.5, 7],
  height: 230,
  describe: "Two spreads in standard deviations over 750 days. The correlated-only pair drifts away, up to 6.2. The cointegrated pair stays between −2.3 and 3.3 and keeps returning to 0.",
};

/** 3.13.5 B6: the broken pair. Visible to day 34, the news day. */
const BREAK_CHART: ChartSpec = {
  candles: asLine(Z_BREAK),
  style: "line",
  visible: 35,
  range: [-1.5, 7],
  height: 230,
  layers: [
    rule(0, "MEAN"),
    { kind: "level", price: 2, role: "entry", label: "ENTRY z 2" },
    { kind: "level", price: 3.5, role: "stop", label: "STOP z 3.5" },
    dot(30, 2.21, "SELL SPREAD", "accent"),
    dot(34, 3.92, "MERGER NEWS", "down"),
  ],
  describe: "A pair's z-score oscillates around 0, reaches 2.21 on day 30, where the spread is sold, and jumps to 3.92 on day 34 on merger news. Afterwards it keeps rising, to 5.71 by day 44 and 6.35 by day 49.",
};

/** 3.13.6 B2: average CAR, days −5 to +60 (index 5 is day 0). */
const CAR_CHART: ChartSpec = {
  candles: blank(66, 0),
  hideCandles: true,
  range: [-11, 11],
  height: 240,
  describe: "Average cumulative abnormal return of 40 good and 40 bad synthetic earnings surprises from day −5 to day +60, with 95% bands. Good: +3.70% by day 0 and +6.28% at day +60 (band +3.17% to +9.39%). Bad: −3.81% by day 0 and −7.21% at day +60 (band −9.82% to −4.61%).",
};

// ─── Card sets (sorting widget) ───────────────────────────────────────────

/** 3.13.4 Try: l4-season.mjs seed 31343. Real drift in C, F and I. Flags in-sample: B, C, F, I; hold-out keeps C, F, I. */
const TOM_CARDS = cardSort(
  [
    { id: "confirm", label: "Flag: confirmed on hold-out", what: "Confirmed means |t| of 2 or more in-sample, then t of 2 or more again on hold-out, with the same sign." },
    { id: "reject-in", label: "Reject: no in-sample signal", what: "Rejected in-sample means |t| below 2 in the first ten years, so the hold-out stays sealed." },
    { id: "reject-out", label: "Reject: failed the hold-out", what: "Failing the hold-out means |t| of 2 or more in-sample, but not again, same sign, on the second ten years." },
  ],
  [
    { id: "a", text: "**Market A** · in-sample: −0.03% a day in the window, t = −0.54", answer: "reject-in", correct: "Rejected: t = −0.54 is nowhere near 2.", clue: "Here t = −0.54." },
    { id: "b", text: "**Market B** · in-sample: −0.11% a day, t = −2.31 · hold-out: +0.06%, t = 1.16", answer: "reject-out", correct: "Rejected on hold-out: a 'negative turn of month' in-sample that flipped sign and faded. A noise market that passed the first test.", clue: "Here in-sample t = −2.31 passes, but the hold-out is +1.16, the other sign." },
    { id: "c", text: "**Market C** · in-sample: +0.18% a day, t = 3.39 · hold-out: +0.19%, t = 3.75", answer: "confirm", correct: "Confirmed: t = 3.39, then 3.75 with the same sign on data it had never seen.", clue: "Here t = 3.39, then 3.75 on hold-out, both positive." },
    { id: "d", text: "**Market D** · in-sample: +0.08% a day, t = 1.59", answer: "reject-in", correct: "Rejected: t = 1.59 falls short of 2. Tempting, but the rule was fixed before the scan.", clue: "Here t = 1.59." },
    { id: "e", text: "**Market E** · in-sample: −0.09% a day, t = −1.76", answer: "reject-in", correct: "Rejected: |t| = 1.76, under 2.", clue: "Here |t| = 1.76." },
    { id: "f", text: "**Market F** · in-sample: +0.16% a day, t = 3.16 · hold-out: +0.20%, t = 3.88", answer: "confirm", correct: "Confirmed: t = 3.16, then 3.88 on hold-out, same sign.", clue: "Here t = 3.16, then 3.88, both positive." },
    { id: "g", text: "**Market G** · in-sample: +0.05% a day, t = 0.95", answer: "reject-in", correct: "Rejected: t = 0.95.", clue: "Here t = 0.95." },
    { id: "h", text: "**Market H** · in-sample: +0.04% a day, t = 0.79", answer: "reject-in", correct: "Rejected: t = 0.79.", clue: "Here t = 0.79." },
    { id: "i", text: "**Market I** · in-sample: +0.21% a day, t = 4.18 · hold-out: +0.15%, t = 2.99", answer: "confirm", correct: "Confirmed: smaller on hold-out, +0.15% against +0.21%, but t = 2.99 still clears 2.", clue: "Here t = 4.18, then 2.99, both positive." },
    { id: "j", text: "**Market J** · in-sample: +0.07% a day, t = 1.34", answer: "reject-in", correct: "Rejected: t = 1.34.", clue: "Here t = 1.34." },
  ],
);

/** 3.13.5 Try: l5-pairs.mjs seed 31353, formation statistics (250 days). W and Y are cointegrated; X and Z are only correlated. */
const PAIR_CARDS = cardSort(
  [
    { id: "trade", label: "Trade it: the spread comes back", what: "Trade it means the spread tests stationary: t below −3.4 and a short half-life." },
    { id: "skip", label: "Skip it: only correlated", what: "Skip it means the spread doesn't test stationary: t above −3.4, however high the correlation." },
  ],
  [
    { id: "w", text: "**Pair W** · price correlation 0.93 · spread test t = −3.83 · half-life 5.9 days", answer: "trade", correct: "Trade: t = −3.83 is below −3.4 and gaps close halfway in about 6 days. Time stop about 12 days.", clue: "Here t = −3.83, below −3.4, and the half-life is 5.9 days." },
    { id: "x", text: "**Pair X** · price correlation 0.92 · spread test t = −2.37 · half-life 15.3 days", answer: "skip", correct: "Skip: t = −2.37 doesn't reach −3.4. The 15-day 'half-life' is fitted to a spread that may not come back at all.", clue: "Here t = −2.37, short of −3.4." },
    { id: "y", text: "**Pair Y** · price correlation 0.92 · spread test t = −3.99 · half-life 5.2 days", answer: "trade", correct: "Trade: t = −3.99, half-life 5.2 days. The test can't see the future, so the stop still matters.", clue: "Here t = −3.99, below −3.4." },
    { id: "z", text: "**Pair Z** · price correlation 0.96 · spread test t = −2.05 · half-life 15.8 days", answer: "skip", correct: "Skip: the highest correlation of the four, and the weakest spread test. Correlation isn't cointegration.", clue: "Here t = −2.05, far from −3.4, despite a correlation of 0.96." },
  ],
);

/** 3.13.7 Try: three systems, three diagnoses. */
const DECAY_CARDS = cardSort(
  [
    { id: "variance", label: "Normal drawdown: keep", what: "A normal drawdown sits inside the corridor, with losses explained by a regime the system is known to dislike." },
    { id: "decayed", label: "Decayed edge: stop or cut", what: "A decayed edge was real once (its R0 twin was flat), but recent results fall outside the corridor as costs or crowding rose." },
    { id: "noise", label: "Fitted to noise: stop", what: "A noise fit is a system whose R0 twin looked just as good in-sample." },
  ],
  [
    {
      id: "a",
      text: "**System 1** · trend follower · down 9R; 95th-percentile drawdown of its corridor: 14R · the market moved from trending to ranging · R0 twin in-sample: −0.02R a trade, against +0.31R",
      answer: "variance",
      correct: "Normal drawdown: 9R is inside the corridor, ranges are where trend systems lose, and the R0 twin shows the edge wasn't noise. Keep following the rules.",
      clue: "Here 9R is well inside 14R, and the losses match the regime.",
    },
    {
      id: "b",
      text: "**System 2** · short-term reversal · down 18R, beyond its corridor's 99th percentile, 15R · last 150 trades: +0.02R each, against +0.28R in testing · spreads up, similar funds doubled · R0 twin: −0.03R",
      answer: "decayed",
      correct: "Decayed: outside the corridor, the edge per trade nearly gone, costs and crowding up. The R0 twin says it was real once. Stop, then re-test.",
      clue: "Here the drawdown is past the 99th percentile and costs and crowding rose.",
    },
    {
      id: "c",
      text: "**System 3** · pattern system with 7 parameters · down 11R, inside its corridor · R0 twin in-sample: +0.34R a trade, against the system's +0.36R",
      answer: "noise",
      correct: "Fitted to noise: on random walks the same search found +0.34R. The 'edge' was the search, not the market.",
      clue: "Here the R0 twin scored +0.34R against +0.36R.",
    },
  ],
);

/** 3.13.8 Try: five synthetic reports, graded with the course scale. */
const REPORT_CARDS = cardSort(
  [
    { id: "A", label: "A", what: "A means robust, peer-reviewed, many markets and decades, and it held up out of sample." },
    { id: "B", label: "B", what: "B means real and peer-reviewed, but weaker since publication or limited to some regimes or segments." },
    { id: "C", label: "C", what: "C means a working paper or practitioner backtest: mixed or no replication, sensitive to costs." },
    { id: "D", label: "D", what: "D means anecdotal, unfalsifiable, or not supported when tested." },
    { id: "F", label: "F", what: "F means negative expectancy built into the structure." },
  ],
  [
    {
      id: "r1",
      text: "**Report 1** · working paper · a 1-day reversal rule on 40 synthetic stocks · 3 years · no costs · trials not reported · not replicated",
      answer: "C",
      correct: "C: a testable claim with a short sample, no costs, unknown trials and no replication. It can't go higher until someone repeats it with costs.",
      clue: "Here it's a working paper with no costs, no trial count and no replication.",
    },
    {
      id: "r2",
      text: "**Report 2** · signal vendor · 'AI breakout signals, 91% winners' · 6 months of unaudited results · rules secret · no average loss shown",
      answer: "D",
      correct: "D: secret rules can't be tested, six unaudited months prove little, and a win rate without the average loss says nothing.",
      clue: "Here the rules are secret and the record is six unaudited months.",
    },
    {
      id: "r3",
      text: "**Report 3** · peer-reviewed · a trend rule on 60 futures markets over 50 years, costs included · held up in independent tests on new markets and later decades · long flat stretches",
      answer: "A",
      correct: "A: many markets, decades, costs, and independent out-of-sample confirmation. Long flat stretches don't lower the grade; they're part of what A looks like.",
      clue: "Here it's peer-reviewed, many markets, 50 years, costs in, independently confirmed.",
    },
    {
      id: "r4",
      text: "**Report 4** · peer-reviewed, 1990s · a calendar effect in 30 countries · replicated, but about half the size since publication and gone in some markets",
      answer: "B",
      correct: "B: real and replicated, but decayed since publication and patchy across markets.",
      clue: "Here it's replicated, but half the size since publication and gone in some markets.",
    },
    {
      id: "r5",
      text: "**Report 5** · course claim · 'double your size after each loss and every losing run is recovered'",
      answer: "F",
      correct: "F: doubling after losses (a martingale) wins small often and eventually loses everything. The structure guarantees it.",
      clue: "Here the rule doubles size after every loss.",
    },
  ],
);


// ─── Lessons ────────────────────────────────────────────────────────────────

const L1: Lesson = {
  id: "3.13.1",
  title: "Time-series momentum and the Turtles",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Time-series momentum is grade A across 58 futures markets; the Turtle rules are one crowded version of it, sized by N.",
  objectives: [
    "State the time-series momentum rule and its evidence across 58 futures markets.",
    "Compute Turtle N, unit size and the 2N stop for a synthetic futures contract.",
    "Explain why the exact Turtle parameters faded while the underlying effect survived.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
  ],
  script: {
    unit: "3.13",
    courseId: "3.13.1",
    hook: {
      prompt: "A rule goes long any market whose last 12 months were up, and short if they were down, with positions sized to equal volatility. Tested on 58 futures markets, in how many was it profitable?",
      control: {
        kind: "slider",
        min: 0,
        max: 58,
        step: 1,
        start: 29,
        answer: 58,
        tolerance: 0,
        feedback: [
          { from: 0, to: 45, text: "More than that. Moskowitz, Ooi and Pedersen (2012) found the 12-month rule profitable in every one of the 58." },
          { from: 46, to: 57, text: "Close, but it was all of them: 58 of 58." },
        ],
      },
      compare: "You said {yours}. The 12-month rule was profitable in all 58 markets (Moskowitz, Ooi and Pedersen, 2012). Grade A, with long flat stretches.",
      concept: "time-series-momentum",
    },
    learn: [
      {
        kind: "explain",
        title: "The rule and its evidence",
        text: "[[time-series-momentum|Time-series momentum]] judges each market on its own past: long if its last 12 months beat cash, short if not, held a month, every position sized to the same volatility. Moskowitz, Ooi and Pedersen (2012) tested it on 58 liquid futures: stock indices, currencies, commodities and bonds. It made money in all 58. Grade A.",
      },
      {
        kind: "explain",
        title: "Why it might pay",
        text: "Returns tended to persist for 1 to 12 months and partly reverse later: slow reaction to news, then overshooting. On the other side: traders who react late, and [[hedger|hedgers]] paying to offload risk. Hurst, Ooi and Pedersen extended the test to 67 markets back to 1880. Summaries credit trend with [[crisis-alpha|crisis alpha]]; treat the exact figures as unverified.",
      },
      {
        kind: "figure",
        title: "A seeded test, with its control",
        figure: {
          kind: "chart",
          chart: TSMOM_CHART,
          steps: [
            { text: "Seeded test: the 12-month rule on 12 synthetic markets for 30 years, each sized to equal volatility.", layers: [ln(TSMOM_EQ, "accent", "PORTFOLIO, LOG SCALE")] },
            { text: "All 12 markets made money. On 12 random-walk controls, only 4 did: what chance alone gives." },
            { text: "Sharpe ratio 1.13, but −18.2% by month 23 and 35 months below the first peak.", layers: [{ kind: "path", points: [{ index: 0, price: 102.3 }, { index: 12, price: 102.3 }], role: "down", label: "35 MONTHS UNDER THE PEAK", dashed: true }] },
            { text: "Equal notional: the wildest market carried 21.6% of the risk. Scaled to equal volatility: 8.5%." },
          ],
        },
        text: "Synthetic markets with a hidden persistent drift (seed 31302). Real markets are noisier; the shape is the point: a real edge, and years of waiting.",
        concept: "time-series-momentum",
      },
      {
        kind: "explain",
        title: "Futures in one paragraph",
        text: "Skipped 3.14? A [[futures]] contract has a value per point. LXF, the synthetic index future, pays 50 vUSD for each point it moves, so a 2.5-point move is 125 vUSD per contract. Futures lessons use a 100,000 vUSD account, so whole contracts fit a 1% rule. Margin, roll and daily settlement are in 3.14.",
      },
      {
        kind: "worked",
        title: "One Turtle unit",
        lines: [
          "N: LXF's 20-day smoothed average true range = 2.5 points.",
          "One N on one contract: 2.5 × 50 vUSD = 125 vUSD.",
          "Budget per N: 1% of 100,000 = 1,000 vUSD.",
          "Unit = 1,000 ÷ 125 = ? contracts",
        ],
        ask: {
          answer: 8,
          tolerance: 0,
          unit: "contracts",
          feedback: [
            { value: 400, text: "That's 1,000 ÷ 2.5: it leaves out the 50 vUSD per point. Divide by the money value of one N, 125." },
            { value: 20, text: "That's 1,000 ÷ 50: it leaves out N. Divide by N × value per point = 125." },
          ],
          correct: "Right: 8 contracts. One N moves the account 8 × 125 = 1,000 vUSD, 1%.",
        },
        after: "The stop sits 2N = 5 points away: 8 × 5 × 50 = 2,000 vUSD, 2% of the account per unit. That's a [[turtle-unit]]: sized from [[atr|volatility]], so every market moves the account by the same amount. Before costs.",
        concept: "percent-volatility-sizing",
      },
      {
        kind: "figure",
        title: "System 2, one trade",
        figure: {
          kind: "chart",
          chart: SYS2_CHART,
          steps: [
            { text: "Day 62 trades through the 55-day high, 255.40: buy one unit, 8 contracts.", visible: 63, layers: [{ kind: "level", price: 255.4, role: "resistance", label: "55-DAY HIGH" }, dot(62, 255.4, "BUY", "up")] },
            { text: "Initial stop 2N below: 255.40 − 5.00 = 250.40.", layers: [{ kind: "level", price: 250.4, role: "stop", label: "STOP 2N" }] },
            { text: "One more unit every ½N, 1.25 points, up to four. Every stop moves to 254.15.", visible: 68, layers: [dot(63, 256.65, "+½N", "up"), dot(65, 257.9, "+1N", "up"), dot(67, 259.15, "+1½N", "up"), { kind: "level", price: 254.15, role: "stop", label: "STOPS, 4 UNITS" }] },
            { text: "Exit on day 96 through the 20-day low, 260.62: +13.38 points per contract, 5,352 vUSD.", visible: 99, layers: [dot(96, 260.62, "EXIT", "down")] },
          ],
        },
        text: "The rules as published by a former Turtle, Curtis Faith (2003). The exit gave back about 10 points from the top: that's the price of staying in the big trends.",
        concept: "time-series-momentum",
      },
      {
        kind: "explain",
        title: "System 1 and the limits",
        text: "System 1 buys a 20-day breakout, but skips it if the previous 20-day signal would have won; the 55-day breakout is its failsafe. It exits on a 10-day opposite breakout. Limits: 4 units per market, 6 in closely related markets, 10 in loosely related ones, 12 per direction. Each 10% drawdown cuts the account used for sizing by 20%.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Seeded System 2, 12 markets, 10 years: 35% winners, +0.33R a trade after costs, a worst run of 12 losses and a −21.2R drawdown. The exact 20/55 rules are public and crowded; practitioners report much weaker results after the 1980s. The effect under them survived. Don't override a system inside its normal range.",
      },
    ],
    task: {
      widget: "expectancy",
      goal: "Seeded System 2 won 35% of its trades, averaging +2.6R and −0.9R. Enter these, then find the longest losing run that's more likely than not in 100 trades.",
      success: { all: [{ field: "winRate", eq: 35 }, { field: "avgWin", eq: 2.6 }, { field: "avgLoss", eq: 0.9 }, { field: "runLength", eq: 9 }] },
      feedback: [
        { when: { field: "winRate", ne: 35 }, text: "Set the win rate to the backtest's 35%." },
        { when: { any: [{ field: "avgWin", ne: 2.6 }, { field: "avgLoss", ne: 0.9 }] }, text: "Use the backtest's averages: win 2.6R, loss 0.9R." },
        { when: { field: "runLength", lt: 9 }, text: "A run of {runLength} has {runProb}% odds in 100 trades: more likely than not. Try a longer run." },
        { when: { field: "runLength", gt: 9 }, text: "{runLength} in a row has {runProb}% odds: less than even. Go shorter." },
      ],
      correct: "9 losses in a row: 51.8% odds in 100 trades, with an expectancy of about +0.33R. A run like that is normal for a 35% system; overriding it is how good systems get abandoned.",
      hints: ["Expectancy needs the win rate and the average win and loss.", "Then move the run length until the odds cross 50%."],
      showMe: { winRate: 35, avgWin: 2.6, avgLoss: 0.9, runLength: 9 },
      concept: "streaks-and-runs",
    },
    check: ["q-3.13.1-1", "q-3.13.1-2", "q-3.13.1-3"],
    recap: {
      takeaways: [
        "Time-series momentum: long what rose over 12 months, short what fell. Profitable in all 58 markets.",
        "Turtle unit = 1% of equity ÷ (N × value per point): 1,000 ÷ 125 = 8 contracts.",
        "The exact Turtle numbers got crowded; the momentum effect survived. Expect long flat stretches.",
      ],
    },
  },
};

const L2: Lesson = {
  id: "3.13.2",
  title: "Cross-sectional momentum and its crashes",
  topic: "portfolio_exposure",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Rank by 12-1 return, buy the winners and sell the losers: grade A, with crashes when the losers rebound after a panic.",
  objectives: [
    "Build a ranked winners-minus-losers portfolio with a 12-1 lookback.",
    "Describe momentum crashes and the market state that comes before them.",
    "Show how volatility scaling changes the depth of a crash.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
    { kind: "check", ref: "portfolio_exposure", label: "Portfolio exposure check" },
  ],
  script: {
    unit: "3.13",
    courseId: "3.13.2",
    hook: {
      prompt: "March to May 2009, right after a deep fall. Past winners rose 8%. How much did past losers rise?",
      control: {
        kind: "slider",
        min: 0,
        max: 200,
        step: 1,
        unit: "%",
        start: 20,
        answer: 163,
        tolerance: 10,
        feedback: [
          { from: 0, to: 60, text: "Far more. The past-loser stocks rose 163% in those three months (Daniel and Moskowitz, 2016)." },
          { from: 61, to: 152, text: "More: 163%, twenty times the winners' 8%." },
          { from: 174, to: 200, text: "A little less: 163%, against 8% for past winners." },
        ],
      },
      compare: "You said {yours}%. Past losers rose 163%, past winners 8% (Daniel and Moskowitz, 2016). Anyone short the losers took the crash.",
      concept: "momentum-crash",
    },
    learn: [
      {
        kind: "explain",
        title: "Winners minus losers",
        text: "[[cross-sectional-momentum|Cross-sectional momentum]] ranks assets against each other. Jegadeesh and Titman (1993) ranked US stocks on 3 to 12 months of past return, bought the top tenth and sold the bottom tenth: winners kept winning for months. The usual [[formation-period]] is 12 months, skipping the latest one, because one-month returns tend to reverse.",
      },
      {
        kind: "order",
        title: "Rank on 12-1",
        prompt: "Rank six synthetic assets by 12-1 momentum, strongest first. 12-1 = (1 + 12-month return) ÷ (1 + last month's return) − 1.",
        items: [
          "Asset B: 12 months +22%, last month −3%",
          "Asset A: 12 months +30%, last month +12%",
          "Asset E: 12 months +15%, last month 0%",
          "Asset C: 12 months +5%, last month +6%",
          "Asset D: 12 months −10%, last month −8%",
          "Asset F: 12 months −25%, last month +9%",
        ],
        explain: "12-1 returns: B +25.8%, A +16.1%, E +15.0%, C −0.9%, D −2.2%, F −31.2%. Most of A's 12-month lead came last month, so it drops behind B. A long–short book buys the top and sells the bottom.",
        wrong: "Take the last month out before you rank: A is 1.30 ÷ 1.12 − 1 = +16.1%, B is 1.22 ÷ 0.97 − 1 = +25.8%.",
        concept: "cross-sectional-momentum",
      },
      {
        kind: "explain",
        title: "Where it shows up",
        text: "Asness, Moskowitz and Pedersen (2013) found momentum in eight markets and asset classes: stocks in several regions, currencies, bonds, commodities. Part of the gain fades over the following years. Grade A, decayed but persistent. A retail version holds the top 3 sector ETFs, long only. On the other side: investors who react late, then overreact.",
      },
      {
        kind: "figure",
        title: "A seeded crash",
        figure: {
          kind: "bars",
          bars: [
            { label: "Market, 12-month panic", value: -46.3, role: "down" },
            { label: "Market, rebound month", value: 28, role: "up" },
            { label: "Past winners, rebound month", value: 21.7, role: "up" },
            { label: "Past losers, rebound month", value: 43.2, role: "up" },
            { label: "Winners minus losers", value: -21.5, role: "down" },
          ],
          unit: "%",
          steps: [
            "30 synthetic assets, 10 years, long top 5, short bottom 5. The market falls 46.3% in a year.",
            "Then a rebound month, +28%. Past winners +21.7%, past losers +43.2%.",
            "Long winners, short losers: −21.5% in one month, the book's worst.",
          ],
        },
        text: "After a fall, the losers are the high-[[beta]] assets: the ones that fell most with the market. When it snaps back, they jump most, and the short leg explodes.",
        concept: "momentum-crash",
      },
      {
        kind: "worked",
        title: "The 2009 short leg",
        lines: ["1 vUSD long past winners, which rose 8%: +0.08.", "1 vUSD short past losers, which rose 163%: −1.63.", "Net for each 1 vUSD on each leg: 0.08 − 1.63 = ?"],
        ask: {
          answer: -1.55,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 1.55, text: "Right size, wrong sign: the short leg lost, and it lost more than the long leg made." },
            { value: 1.71, text: "That adds the legs. A short loses when the price rises: 0.08 − 1.63." },
          ],
          correct: "Right: −1.55 vUSD for every 1 vUSD on each leg, in three months.",
        },
        after: "That's a [[momentum-crash]]: a panic, then a sharp rebound led by beaten-down, high-beta losers. Daniel and Moskowitz found crashes come after market falls, while volatility is high, as the market turns up.",
        concept: "momentum-crash",
      },
      {
        kind: "predict",
        title: "Scale it down?",
        prompt: "Volatility scaling cuts exposure when the strategy's recent swings are large. In the seeded rebound month, what does it do to the −21.5% loss?",
        control: {
          kind: "choice",
          choices: [
            { id: "worse", label: "Makes it worse: it adds exposure after a fall", feedback: "It does the opposite. The panic months were wild, so scaling had already cut exposure." },
            { id: "smaller", label: "Shrinks it: exposure had been cut", feedback: "Right." },
            { id: "none", label: "No effect: the crash is a single month", feedback: "One month is enough: exposure is set before the month, from the volatility of the months just before it." },
          ],
          answer: "smaller",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "Crash month, unscaled", value: -21.5, role: "down" },
            { label: "Crash month, scaled (0.42×)", value: -9.1, role: "down" },
            { label: "Worst drawdown, unscaled", value: -26.6, role: "down" },
            { label: "Worst drawdown, scaled", value: -21.4, role: "down" },
          ],
          unit: "%",
          steps: ["Scaling had cut exposure to 0.42×: the crash month cost 9.1%, not 21.5%.", "The worst drawdown: −21.4% scaled, −26.6% unscaled."],
        },
        reveal: "Exposure was down to 0.42× because the panic months swung wildly, so the crash month cost 9.1%. Barroso and Santa-Clara (2015) found scaling nearly doubled momentum's Sharpe ratio. Here: 0.95 unscaled, 1.08 scaled, each about ±0.4: too close to call on 10 years.",
        concept: "percent-volatility-sizing",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Costs decide whether it pays. The seeded book replaced about a quarter of its names every month, and each change pays a spread both ways, plus the fee to borrow the shorts. A long-only top-3 version avoids the short leg's crash, but keeps the whole market's beta.",
      },
    ],
    check: ["q-3.13.2-1", "q-3.13.2-2", "q-3.13.2-3"],
    recap: {
      takeaways: [
        "Rank on 12-1, twelve months without the latest one, then buy winners and sell losers.",
        "Crashes follow a panic, when beaten-down, high-beta losers rebound: losers +163% in 2009.",
        "Volatility scaling cuts exposure in wild markets: the seeded crash month fell from −21.5% to −9.1%.",
      ],
    },
  },
};

const L3: Lesson = {
  id: "3.13.3",
  title: "Carry and its crashes",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Carry pays you to hold an asset while prices sit still: grade A across asset classes, with crashes that arrive together.",
  objectives: [
    "Compute the carry earned by an FX position, a rolled futures position and a spot–perp basis trade.",
    "Explain why carry has negative skew and crashes in the same periods across asset classes.",
    "Choose leverage from the crash scenario, not from the average carry.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M05", label: "Size Matters" },
    { kind: "arena", ref: "event_shock", label: "Arena: unexpected event" },
  ],
  script: {
    unit: "3.13",
    courseId: "3.13.3",
    hook: {
      prompt: "A position earns 4% a year in carry. A 10% adverse jump hits about once every five years. At 10× leverage, what's the chance of being wiped out within 10 years?",
      control: {
        kind: "slider",
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        start: 20,
        answer: 89,
        tolerance: 3,
        feedback: [
          { from: 0, to: 50, text: "Much higher. At 10×, one 10% jump costs 100%. The chance of at least one jump in 10 years is 1 − 0.8¹⁰ = 89%." },
          { from: 51, to: 85, text: "Higher: 89%. One jump is enough at 10×, and 1 − 0.8¹⁰ of decades contain one." },
          { from: 93, to: 100, text: "Slightly less: with a 20% chance a year, 0.8¹⁰ = 11% of decades have no jump at all." },
        ],
      },
      compare: "You said {yours}%. At 10×, one 10% jump wipes out the account, and 1 − 0.8¹⁰ = 89% of decades contain one.",
      concept: "carry",
    },
    learn: [
      {
        kind: "explain",
        title: "What carry is",
        text: "[[carry|Carry]] is what a position earns if prices don't move. In currencies it's the rate differential, paid through the swap ([[carry-trade]], 2.14 and 3.6). In futures it's roll yield: in backwardation, a long gains as the contract rises toward spot. In crypto, long spot plus short perpetual collects funding: a [[basis-trade]].",
      },
      {
        kind: "worked",
        title: "FX carry, per day",
        lines: ["Long 100,000 vUSD of the higher-yielding currency against the lower one.", "Rate differential: 4% a year, so 4,000 vUSD a year.", "Per calendar day: 4,000 ÷ 365 = ?"],
        ask: {
          answer: 10.96,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 16, text: "That divides by 250 trading days. Carry accrues on calendar days: divide by 365." },
            { value: 333.33, text: "That's per month. Divide the 4,000 by 365 days." },
          ],
          correct: "Right: 10.96 vUSD a day.",
        },
        after: "Wednesday's swap pays three days, 32.88, to cover the weekend ([[triple-swap]]). Brokers mark the rate up, so the credit you see is smaller than the interbank differential.",
        concept: "carry",
      },
      {
        kind: "match",
        title: "Four kinds of carry",
        prompt: "Match each position to where its carry comes from.",
        pairs: [
          { left: "Long a high-rate currency against a low-rate one", right: "The swap, from the rate differential", wrong: "Currencies pay their interest rate; holding the higher one earns the difference every night." },
          { left: "Long a future in backwardation", right: "Roll yield, as the future rises toward spot", wrong: "In backwardation the future sits below spot and converges up to it if spot stays put." },
          { left: "Long a bond on an upward-sloping curve", right: "Coupon minus funding, plus roll-down", wrong: "As time passes the bond's yield slides down the curve, so its price rises." },
          { left: "Long spot, short the perpetual", right: "Funding: 0.01% every 8 hours, about 10.95% a year", wrong: "When funding is positive, longs on the perpetual pay shorts; the short perpetual collects it." },
        ],
        columns: ["Position", "Where the carry comes from"],
        correct: "Right. Four markets, one idea: you're paid while prices sit still.",
        concept: "carry",
      },
      {
        kind: "explain",
        title: "The evidence, and the catch",
        text: "Koijen, Moskowitz, Pedersen and Vrugt (2018) found carry predicts returns in stocks, bonds, currencies, commodities, Treasuries, credit and options. Grade A. The catch: carry strategies did poorly in all of them at the same times, in global recessions. [[uncovered-interest-parity|Uncovered interest parity]] says carry shouldn't pay. It does, with crash risk. On the other side: hedgers buying insurance.",
      },
      {
        kind: "figure",
        title: "Three smooth years",
        figure: {
          kind: "chart",
          chart: CARRY_CHART,
          steps: [
            { text: "Seeded 3× carry: three years of small, steady gains, from 100 to 137.70.", visible: 157, layers: [ln(CARRY_PATH, "accent", "3× CARRY")] },
            { text: "Sharpe ratio 2.02 over those three years. The worst week lost 1.8%." },
            { text: "Week 157: one 10% jump at 3× costs 30%, from 137.70 to 96.39. Below the start.", visible: 169 },
          ],
        },
        text: "That's [[negative-skew]]: many small gains, rare large losses. A smooth curve says nothing about the jump it hasn't met yet. Seed 31339.",
        concept: "return-skew",
      },
      {
        kind: "predict",
        title: "Choose the leverage",
        prompt: "Carry 4% a year, a 20% yearly chance of a 10% jump, 10 years, 10,000 seeded paths. What's the highest leverage, in steps of 0.5, that keeps the 5th-percentile outcome above −30%?",
        control: {
          kind: "slider",
          min: 0.5,
          max: 10,
          step: 0.5,
          unit: "×",
          start: 5,
          answer: 3,
          tolerance: 0.2,
          feedback: [
            { from: 0.5, to: 2.5, text: "Safe, but you can go a little higher: at 3× the 5th percentile is −25.4%." },
            { from: 3.5, to: 10, text: "Too high: the 5th percentile is −33.8% at 3.5× and −61.3% at 5×." },
          ],
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "1×: median", value: 19.9, role: "up" },
            { label: "3×: median", value: 52.2, role: "up" },
            { label: "5×: median", value: 54.8, role: "up" },
            { label: "1×: 5th percentile", value: -2.9, role: "down" },
            { label: "3×: 5th percentile", value: -25.4, role: "down" },
            { label: "5×: 5th percentile", value: -61.3, role: "down" },
          ],
          unit: "%",
          steps: ["The median barely grows past 3×: +52.2% at 3×, +54.8% at 5×.", "The bad tail grows fast: −25.4% at 3×, −61.3% at 5×."],
        },
        reveal: "3×. The 5th-percentile path has four jumps in 10 years: at 3× it ends −25.4%, at 3.5× −33.8%. Above 3× the median hardly gains while the tail deepens fast. Size for the jump, not the average year.",
        concept: "carry",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A 3-year carry curve with a Sharpe ratio of 2 can hide the skew completely. Before you trust one, ask what a single jump does at its leverage: a 10% jump at 3× costs 30%.",
      },
    ],
    check: ["q-3.13.3-1", "q-3.13.3-2", "q-3.13.3-3"],
    recap: {
      takeaways: [
        "Carry is the return if prices don't move: swap, roll yield, roll-down or funding.",
        "Carry is grade A across asset classes, but its crashes arrive together, in global recessions.",
        "Choose leverage from the jump: at 3×, the 5th percentile was −25.4%; at 5×, −61.3%.",
      ],
    },
  },
};

const L4: Lesson = {
  id: "3.13.4",
  title: "Testing a seasonal edge",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Scan for a calendar edge, confirm it once on hold-out data, count your false discoveries, and use what survives as a tilt.",
  objectives: [
    "Test a calendar rule for significance in-sample and confirm it once on hold-out data.",
    "Measure your own detection rate and false-discovery rate across seeded and noise markets.",
    "Use a seasonal effect as a filter or tilt, not as a standalone system, and check the futures curve first.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "decision_making", label: "Decision making check" },
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
  ],
  script: {
    unit: "3.13",
    courseId: "3.13.4",
    hook: {
      prompt: "Ten synthetic markets: three carry a real turn-of-month drift, seven are pure noise. You test each at the 5% level. What's the chance at least one noise market passes?",
      control: {
        kind: "slider",
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        start: 5,
        answer: 30,
        tolerance: 3,
        feedback: [
          { from: 0, to: 26, text: "Higher. Each noise market has a 5% chance to pass; across seven, 1 − 0.95⁷ = 30%." },
          { from: 34, to: 100, text: "Lower: 1 − 0.95⁷ = 30%. Still nearly one scan in three." },
        ],
      },
      compare: "You said {yours}%. 1 − 0.95⁷ = 30%: about one scan in three flags at least one noise market.",
      concept: "false-discovery-rate",
    },
    learn: [
      {
        kind: "worked",
        title: "How many flags are false?",
        lines: [
          "3 real markets, tested with 70% power: 3 × 0.7 = 2.1 true flags expected.",
          "7 noise markets at the 5% level: 7 × 0.05 = 0.35 false flags.",
          "Share of flags that are false = 0.35 ÷ (2.1 + 0.35) = ? %",
        ],
        ask: {
          answer: 14.3,
          tolerance: 0.3,
          unit: "%",
          feedback: [
            { value: 5, text: "5% is the error rate per noise market. The question is different: of the flags you raised, how many are false?" },
            { value: 16.7, text: "That's 0.35 ÷ 2.1, false over true. Divide by all flags: 2.1 + 0.35 = 2.45." },
          ],
          correct: "Right: about 14%. One flag in seven is noise.",
        },
        after: "That share is the [[false-discovery-rate]]. Scan 100 noise markets with the same 3 real ones: 5 false flags against 2.1 true, and it jumps to 70%. The more you search, the more of your 'discoveries' are noise.",
        concept: "false-discovery-rate",
      },
      {
        kind: "explain",
        title: "Scan, then confirm once",
        text: "Fix the window, the test and the threshold before you look. Scan the first half; flag markets with a t-statistic of 2 or more, either sign. Then test each flag once on the sealed second half, the [[out-of-sample|hold-out]], in the same direction. That's where noise falls away. A second look at the hold-out turns it into in-sample data.",
      },
      {
        kind: "explain",
        title: "Turn of the month, graded",
        text: "McConnell and Xu (2008) found US stock returns bunched at the turn of the month, the last trading day plus the first three, and the pattern in 31 of 35 countries. That's 4 of about 21 days. Grade B: real, but small against costs. Use it as a [[seasonal-tilt]]: take long signals only in the window, or size up slightly.",
      },
      {
        kind: "reveal",
        title: "The season is in the price",
        prompt: "April, a synthetic gas market. Spot trades 3.00, and winter demand usually lifts it to about 3.60 by December. The December future already trades 3.55. You buy it. What happens by December?",
        chart: GAS_CHART,
        choices: [
          { id: "rise", label: "It rises with the season, about +0.60", feedback: "Spot rose about that much. The December contract didn't: it already priced the rise." },
          { id: "small", label: "It gains only if winter beats 3.55: here about +0.03", feedback: "Right." },
          { id: "fall", label: "It falls: futures always lose to spot", feedback: "Not always. It converged to winter spot, 3.58, a small gain over 3.55." },
        ],
        answer: "small",
        after: "Spot did its seasonal climb, 3.00 to 3.58. The December contract went from 3.55 to 3.58, +0.03: the predictable rise was already in its price. As a trade, commodity seasonality is grade C. Check the curve before you trade a season.",
        concept: "news-surprise",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Halloween, or 'sell in May': Bouman and Jacobsen (2002) found November–April returns beat May–October in 36 of 37 markets. Grade B/C: the gap varies a lot and many years go the other way. Calendar edges are thin; costs and noise eat most of them.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: TOM_CARDS,
      goal: "Ten synthetic markets, 20 years split in half. Flag a market if |t| is 2 or more in-sample; keep it only if the hold-out confirms with t of 2 or more, same sign.",
      success: { field: "solved", eq: 10 },
      correct: "In-sample you flagged four: B, C, F and I. C, F and I carried the real drift; B was noise, so your in-sample false-discovery rate was 1 ÷ 4 = 25%. On hold-out, B fell away: 3 flags, all real, and 3 of 3 detected.",
      hints: ["False-discovery rate = false flags ÷ all flags.", "The hold-out is where the noise markets fall away."],
      showMe: { solved: 10 },
      concept: "false-discovery-rate",
    },
    check: ["q-3.13.4-1", "q-3.13.4-2", "q-3.13.4-3"],
    recap: {
      takeaways: [
        "Many tests mean false flags: FDR = false flags ÷ all flags. Seven noise markets: 30% odds.",
        "Scan in-sample, confirm once on hold-out: noise market B fell away; C, F and I stayed.",
        "Use a calendar edge as a tilt or a filter, and check the futures curve first.",
      ],
    },
  },
};

const L5: Lesson = {
  id: "3.13.5",
  title: "Pairs trading and statistical arbitrage",
  topic: "portfolio_exposure",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Trade a spread only when the pair is cointegrated, with a z-score entry, a stop, and a time stop from its half-life.",
  objectives: [
    "Tell correlation from cointegration and test a candidate pair.",
    "Trade a spread with z-score entries, a mean exit, a stop and a time stop based on the half-life.",
    "Recognise a structural break and cap its loss.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
  ],
  script: {
    unit: "3.13",
    courseId: "3.13.5",
    hook: {
      prompt: "Two synthetic stocks have moved together for three years, with a correlation of 0.92. Their spread is now 2.2 standard deviations wide. Will it close?",
      control: {
        kind: "choice",
        choices: [
          { id: "likely", label: "Very likely", feedback: "Correlation says the two moved together day to day. It says nothing about whether the gap comes back." },
          { id: "coint", label: "Only if the pair is cointegrated", feedback: "Right." },
          { id: "always", label: "Always, eventually", feedback: "Two random walks can drift apart for good, and 'eventually' can outlast your capital." },
        ],
        answer: "coint",
      },
      compare: "You chose {yours}. A spread closes only if the pair is cointegrated: correlation alone doesn't bring it back.",
      concept: "cointegration",
    },
    learn: [
      {
        kind: "figure",
        title: "Correlated is not cointegrated",
        figure: {
          kind: "chart",
          chart: PAIRS_CHART,
          steps: [
            { text: "Pair 1: daily returns correlated 0.92, yet the spread wanders off to 6.2 standard deviations.", layers: [ln(Z_CORR, "down", "CORRELATED ONLY")] },
            { text: "Pair 2: the spread keeps returning to zero. That's cointegration.", layers: [ln(Z_COINT, "accent", "COINTEGRATED")] },
            { text: "Bands at ±2 standard deviations, measured on the first 250 days only.", layers: [rule(2, "+2"), rule(-2, "−2"), rule(0)] },
            { text: "After day 250 the bands are fixed: pair 1 escapes them, pair 2 keeps crossing back.", layers: [dot(50, 0, "DAY 250", "neutral")] },
          ],
        },
        text: "[[correlation|Correlation]] measures co-movement. [[cointegration|Cointegration]] means a combination of the two prices stays stationary, so its gaps close. Seed 31353, 750 synthetic days.",
        concept: "cointegration",
      },
      {
        kind: "explain",
        title: "The distance method, graded",
        text: "Gatev, Goetzmann and Rouwenhorst (2006) paired US stocks whose normalised prices stayed closest over 12 months, opened a trade at a 2 standard-deviation gap and closed it when prices met: up to 11% a year, 1962–2002. Do and Faff (2010) found the monthly return fell from 0.86% to 0.37% to 0.24% across later periods. [[pairs-trading|Pairs trading]]: grade B, decayed.",
      },
      {
        kind: "explain",
        title: "The cointegration method",
        text: "Estimate the [[hedge-ratio]] β, so spread = A − β × B. Test the spread: does it keep coming back? Then measure how fast. With a reversion speed θ per day, the [[half-life]] is ln 2 ÷ θ. Enter at a [[z-score]] of ±2, exit at 0, stop at ±3.5, and close anything older than about two half-lives.",
      },
      {
        kind: "worked",
        title: "Entry and time stop",
        lines: ["The spread is 2.60 above its mean; its standard deviation is 1.20.", "z = 2.60 ÷ 1.20 = ?"],
        ask: {
          answer: 2.17,
          tolerance: 0.01,
          feedback: [{ value: 0.46, text: "That's 1.20 ÷ 2.60, upside down. z = distance ÷ standard deviation." }],
          correct: "Right: z = 2.17, past +2. Sell the spread: short A, buy β of B.",
        },
        after: "With θ = 0.1 a day, half-life = ln 2 ÷ 0.1 = 6.9 days, so the time stop is about 14 days. The stop sits at |z| = 3.5. Both are set before the entry.",
        concept: "pairs-trading",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "The risks: a [[structural-break]] such as a merger, two sets of costs, the fee to borrow the short leg, one leg filling without the other, and crowding: LTCM's convergence trades unwound together in 1998. On the other side: traders who need liquidity now and push one price away for a while.",
      },
      {
        kind: "reveal",
        title: "Merger news",
        prompt: "You sold the spread at z = 2.21. Four days later, a merger is announced for one of the two companies and z jumps to 3.92, past your 3.5 stop. What now?",
        chart: BREAK_CHART,
        choices: [
          { id: "add", label: "Add: it's even more stretched", feedback: "Stretched only if the old relationship still holds. The merger rewired it: z kept climbing." },
          { id: "exit", label: "Exit at the stop, then re-test the pair", feedback: "Right." },
          { id: "hold", label: "Hold to the time stop: it reverts within two half-lives", feedback: "The half-life belonged to the old relationship. By the time stop, z was 5.71." },
        ],
        answer: "exit",
        after: "The merger broke the relationship: z climbed to 5.71 by the 14-day time stop and 6.35 later. Exiting at 3.92 cost 1.71 standard deviations; holding to the time stop would have cost 3.50. The stop exists for this day.",
        concept: "structural-break",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: PAIR_CARDS,
      goal: "Four candidate pairs, with statistics from 250 formation days. Trade only the cointegrated ones: a spread test with t below −3.4 means the spread keeps coming back.",
      success: { field: "solved", eq: 4 },
      correct: "W and Y: their spreads test stationary, with half-lives near 6 days. Over the next 500 seeded days, after costs on both legs, W made +13.13 per unit and Y +2.15, after a break cost it four stops in a row. X and Z lost 5.12 and 1.62.",
      hints: ["High correlation is not enough. The spread itself must keep coming back.", "Below −3.4 on the spread test: trade it. Time stop ≈ 2 × half-life."],
      showMe: { solved: 4 },
      concept: "cointegration",
    },
    check: ["q-3.13.5-1", "q-3.13.5-2", "q-3.13.5-3"],
    recap: {
      takeaways: [
        "Correlation is co-movement; cointegration means the spread keeps coming back. Trade only the second.",
        "Enter at z = ±2, exit at 0, stop at ±3.5, time stop near two half-lives (ln 2 ÷ θ).",
        "A spread blowing out on news is likely a structural break: exit at the stop, don't add.",
      ],
    },
  },
};

const L6: Lesson = {
  id: "3.13.6",
  title: "Event-driven strategies, systematically",
  topic: "scenario_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Measure an event effect as the average abnormal return over many events, with its band, and write the stop rule before the effect decays.",
  objectives: [
    "Run a simple event study: average abnormal return around many events, not one anecdote.",
    "Build a rule-based PEAD portfolio and evaluate it net of costs over time.",
    "Decide in advance when to stop trading a decaying event effect.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: unexpected event" },
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
  ],
  script: {
    unit: "3.13",
    courseId: "3.13.6",
    hook: {
      prompt: "The day after its earnings surprise, LABB rose 6%. The index rose 1%, and LABB's beta is 1.2. What was LABB's abnormal return?",
      control: {
        kind: "slider",
        min: 0,
        max: 10,
        step: 0.1,
        unit: "%",
        start: 6,
        answer: 4.8,
        tolerance: 0.1,
        feedback: [
          { from: 0, to: 4.6, text: "Higher. The market explains 1.2 × 1% = 1.2%; the rest, 6% − 1.2% = 4.8%, is abnormal." },
          { from: 5, to: 10, text: "Lower: take out what the market explains, 1.2 × 1% = 1.2%. 6 − 1.2 = 4.8%." },
        ],
      },
      compare: "You said {yours}%. Abnormal return = 6% − 1.2 × 1% = 4.8%.",
      concept: "event-study",
    },
    learn: [
      {
        kind: "worked",
        title: "Abnormal, then cumulative",
        lines: [
          "LABB's return: +6%.",
          "What the market explains: beta × index = 1.2 × 1% = 1.2%.",
          "Abnormal return: 6% − 1.2% = 4.8%.",
          "The next two days' abnormal returns: +0.4% and −0.1%. Cumulative over the three days = ?",
        ],
        ask: {
          answer: 5.1,
          tolerance: 0.05,
          unit: "%",
          feedback: [{ value: 5.3, text: "The second day was −0.1%, not +0.1%: 4.8 + 0.4 − 0.1." }],
          correct: "Right: 4.8 + 0.4 − 0.1 = 5.1%.",
        },
        after: "An [[abnormal-return]] strips out what the market explains through [[beta]]. Adding it up over a window gives the cumulative abnormal return, CAR. An [[event-study]] averages the CAR of many similar events.",
        concept: "event-study",
      },
      {
        kind: "figure",
        title: "Eighty surprises",
        figure: {
          kind: "chart",
          chart: CAR_CHART,
          steps: [
            { text: "Seeded: 40 good and 40 bad synthetic earnings surprises. Average CAR, day −5 to day +60.", layers: [rule(0), ln(CAR_POS, "up", "GOOD SURPRISES"), ln(CAR_NEG, "down", "BAD SURPRISES")] },
            { text: "By day 0: +3.70% for good surprises, −3.81% for bad ones.", layers: [dot(5, 3.7, "DAY 0", "up"), dot(5, -3.81, "DAY 0", "down")] },
            { text: "Dashed: the 95% band around each average. With 40 events, it's wide.", layers: [ln(CAR_POS_LO, "up", undefined, true), ln(CAR_POS_HI, "up", undefined, true), ln(CAR_NEG_LO, "down", undefined, true), ln(CAR_NEG_HI, "down", undefined, true)] },
            { text: "Day +60: good surprises +6.28%, band +3.17% to +9.39%; bad ones −7.21%.", layers: [dot(65, 6.28, "+6.28%", "up"), dot(65, -7.21, "−7.21%", "down")] },
          ],
        },
        text: "One event is an anecdote: in the bad-news group, 5 of 40 stocks were up by day +60, one by 10.55%. The average and its band are the evidence.",
        concept: "event-study",
      },
      {
        kind: "predict",
        title: "Is the drift real?",
        prompt: "Now only days +1 to +60, after the jump. Good surprises: +2.58%, band −0.24% to +5.40%. Bad: −3.41%, band −5.84% to −0.97%. Which drift can you tell apart from zero?",
        control: {
          kind: "choice",
          choices: [
            { id: "both", label: "Both: each is several percent", feedback: "Size isn't enough. The good group's band runs from −0.24% to +5.40%, so zero is inside it." },
            { id: "neg", label: "Only the bad-news drift: its band excludes zero", feedback: "Right." },
            { id: "neither", label: "Neither: 60 days is too short", feedback: "The bad-news band, −5.84% to −0.97%, stays below zero. The window is long enough there." },
          ],
          answer: "neg",
        },
        reveal: "Only the bad-news band stays below zero. The good-news drift may be real, but 40 events can't show it. Long the good and short the bad, the 80 events give about +6%, with a band of +2.26% to +9.71%. More events, narrower bands.",
        concept: "event-study",
      },
      {
        kind: "explain",
        title: "Event families, graded",
        text: "Earnings: post-earnings drift, grade B, much weaker since it was published, mostly gone in large stocks. Scheduled policy: the S&P 500 rose 49 bp on average in the 24 hours before Fed decisions, 1994–2011 (Lucca and Moench, 2015); grade B, less reliable since ([[pre-announcement-drift]], 3.7). Unscheduled headlines: grade D for retail, because machines react first.",
      },
      {
        kind: "explain",
        title: "PEAD as rules",
        text: "A systematic version ranks every report by its surprise, buys the top tenth, sells the bottom tenth, and holds about 60 trading days. Two limits: the drift is strongest in small stocks that are costly to trade, so capacity is small; and it decays. Write the stop rule before the first trade, not after a bad year.",
      },
      {
        kind: "fields",
        title: "Write the stop rule",
        prompt: "Write the rule that will stop your PEAD book. It's fixed now, before any result.",
        fields: [
          { id: "window", label: "Judge on the average net return of the last __ years", kind: "choice", options: [1, 2, 3, 5], default: 1 },
          { id: "floor", label: "Stop when that average falls to __ % or below", kind: "choice", options: [-2, -1, 0, 1], default: -2 },
          { id: "costs", label: "Measured net of costs (1) or gross (0)", kind: "choice", options: [0, 1], default: 0 },
          { id: "log", label: "Where the decision is logged, and who can change the rule", kind: "text", default: "", placeholder: "e.g. research log; changes only at the yearly review", required: true },
        ],
        valid: { all: [{ field: "window", gte: 2 }, { field: "costs", eq: 1 }] },
        feedback: [
          { when: { field: "window", lt: 2 }, text: "One year is mostly noise: a good effect has bad years. Judge on 2 years or more." },
          { when: { field: "costs", eq: 0 }, text: "Judge net of costs. A gross drift smaller than the costs pays the broker, not you." },
        ],
        correct: "Saved. A rule written now can't be bent by next year's result.",
        concept: "rule-change-governance",
      },
      {
        kind: "predict",
        title: "When does the rule stop it?",
        prompt: "Seeded PEAD book, published at the end of year 4, costs 1.2% a year. Rule: stop when the 3-year average net return falls to 0% or below. After which year do you stop?",
        control: {
          kind: "choice",
          choices: [
            { id: "y6", label: "After year 6, the first losing year", feedback: "Year 6 lost 1.1%, but the 3-year average was still +1.13%. One bad year is what the window absorbs." },
            { id: "y8", label: "After year 8", feedback: "Close: after year 8 the average is +0.03%, just above the line." },
            { id: "y9", label: "After year 9", feedback: "Right." },
          ],
          answer: "y9",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "Year 1", value: 2.9, role: "up" },
            { label: "Year 2", value: 4, role: "up" },
            { label: "Year 3", value: 2.5, role: "up" },
            { label: "Year 4, published", value: 2.3, role: "up" },
            { label: "Year 5", value: 2.2, role: "up" },
            { label: "Year 6", value: -1.1, role: "down" },
            { label: "Year 7", value: 1.2, role: "up" },
            { label: "Year 8", value: 0, role: "neutral" },
            { label: "Year 9", value: -2.1, role: "down" },
            { label: "Year 10", value: -0.8, role: "down" },
          ],
          unit: "%",
          steps: ["Net return by year, after 1.2% of costs. Published at the end of year 4.", "After year 9: (1.2 + 0.0 − 2.1) ÷ 3 = −0.3%. The rule stops it."],
        },
        reveal: "After year 9: the 3-year average is (1.2 + 0.0 − 2.1) ÷ 3 = −0.3%. After year 8 it was +0.03%. The rule ignored year 6's loss and stopped a decayed drift without a debate.",
        concept: "event-study",
      },
    ],
    check: ["q-3.13.6-1", "q-3.13.6-2", "q-3.13.6-3"],
    recap: {
      takeaways: [
        "Abnormal return = actual − beta × market; add it up over the window for the CAR.",
        "Average many events and judge the band: 40 events left the good-news drift unproven.",
        "Write the stop rule before trading: the seeded rule stopped the decayed drift after year 9.",
      ],
    },
  },
};

const L7: Lesson = {
  id: "3.13.7",
  title: "Decay, crowding and regime dependence",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Published edges shrink, crowded ones crash together, and a drawdown is judged against its corridor, regime and R0 control before an edge is called broken.",
  objectives: [
    "Quantify typical post-publication decay and separate it from statistical selection bias.",
    "Explain crowding and why crowded strategies crash together.",
    "Tell a normal drawdown from a broken edge, using the Monte Carlo corridor and a regime breakdown.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
  ],
  script: {
    unit: "3.13",
    courseId: "3.13.7",
    hook: {
      prompt: "97 published return predictors were re-tested after their papers came out. On average, their returns after publication were…",
      control: {
        kind: "choice",
        choices: [
          { id: "same", label: "Unchanged", feedback: "Published edges shrink: some of each result was luck, and traders read the papers too." },
          { id: "26", label: "About 26% lower", feedback: "That's the drop out of sample but before publication, the data-mining part. After publication it was bigger." },
          { id: "58", label: "About 58% lower", feedback: "Right." },
          { id: "gone", label: "Gone", feedback: "Not gone on average: about 58% lower. Something real usually remained." },
        ],
        answer: "58",
      },
      compare: "You chose {yours}. After publication, returns were about 58% lower; out of sample but before publication, 26% lower (McLean and Pontiff, 2016).",
      concept: "evidence-grades",
    },
    learn: [
      {
        kind: "explain",
        title: "Two kinds of shrinkage",
        text: "McLean and Pontiff (2016) re-tested 97 predictors. Out of sample but before publication, returns were 26% lower: part of each result was luck from searching the data. After publication, 58% lower: traders read the papers and traded the edge away. Grade A, as a finding about findings. Treat every published number as an upper bound.",
      },
      {
        kind: "figure",
        title: "The R0 control",
        figure: {
          kind: "bars",
          bars: [
            { label: "No edge (R0): best 10, in-sample", value: 0.87, role: "neutral" },
            { label: "No edge (R0): same 10, out of sample", value: 0.08, role: "down" },
            { label: "Real edge: best 10, in-sample", value: 1.73, role: "neutral" },
            { label: "Real edge: same 10, out of sample", value: 0.85, role: "up" },
          ],
          steps: [
            "Seeded: 200 strategies with no edge. The best 10 in-sample show a Sharpe ratio of 0.87.",
            "Out of sample, the same 10: 0.08. All of it was selection.",
            "200 strategies with a real edge: the best 10 fall from 1.73 to 0.85. About half survives.",
          ],
        },
        text: "Picking the best of many inflates in-sample results, edge or not. The R0 control shows how much is selection alone: what's left after it is the edge. Seed 31371, Sharpe ratios.",
        concept: "random-walk",
      },
      {
        kind: "explain",
        title: "Crowding",
        text: "Markets adapt ([[adaptive-markets]]): as more traders run the same strategy, its edge shrinks and its exits fill up. [[crowding|Crowded]] trades fall together: convergence trades around LTCM in 1998, momentum in 2009, the yen carry unwind in August 2024. Once a few holders must sell, everyone in the trade sells into the same few buyers.",
      },
      {
        kind: "match",
        title: "Where each family breaks",
        prompt: "Match each strategy family to the regime where it tends to fail.",
        pairs: [
          { left: "Trend following", right: "Choppy ranges: repeated false breakouts", wrong: "Trend systems lose small amounts again and again when breakouts keep failing." },
          { left: "Mean reversion", right: "Strong trends and crashes: oversold gets more oversold", wrong: "Buying dips fails when the dips keep going." },
          { left: "Carry", right: "Crises and volatility spikes: the jump", wrong: "Carry is paid for holding crash risk; the crash comes in crises." },
          { left: "Cross-sectional momentum", right: "The rebound after a panic", wrong: "The short leg holds beaten-down, high-beta losers, and they jump most in a rebound." },
        ],
        columns: ["Family", "Where it tends to fail"],
        correct: "Right. Each family has a regime that hurts it. Knowing it in advance turns a drawdown into a diagnosis.",
        concept: "strategy-regime-fit",
      },
      {
        kind: "figure",
        title: "Decay or variance?",
        text: "A trend system is down 12R. Its corridor's 95th-percentile drawdown is 15R, and the market has turned from trending to ranging. Walk the tree.",
        figure: {
          kind: "flow",
          start: "corridor",
          interactive: true,
          nodes: [
            { id: "corridor", text: "Is the 12R drawdown inside the Monte Carlo corridor?", kind: "question", yes: "regime", no: "r0", correct: "yes", explain: "12R is less than the corridor's 15R: inside what chance alone produces." },
            { id: "regime", text: "Has the regime shifted to one the system is known to struggle in?", kind: "question", yes: "filter", no: "keep", correct: "yes", explain: "Trending to ranging: ranges are exactly where trend systems lose." },
            { id: "keep", text: "Keep trading: normal variance. Log it.", kind: "end" },
            { id: "filter", text: "Keep, or reduce size by your rules. Test a regime filter through rule governance, not mid-drawdown.", kind: "end" },
            { id: "r0", text: "Did an R0 twin look just as good in-sample?", kind: "question", yes: "noise", no: "costs" },
            { id: "noise", text: "Stop: it was fitted to noise from the start.", kind: "end" },
            { id: "costs", text: "Have costs or crowding risen since the edge was measured?", kind: "question", yes: "decayed", no: "broken" },
            { id: "decayed", text: "Stop or cut size: the edge has decayed. Re-test before any return.", kind: "end" },
            { id: "broken", text: "Stop at the kill switch, then look for a bug or a structural break.", kind: "end" },
          ],
          steps: [
            "Inside the corridor and explained by the regime: keep, and test any filter properly.",
            "Outside the corridor: did an R0 twin do as well? Then it was noise.",
            "If not, check costs and crowding: a decayed edge, or a bug or break.",
          ],
        },
        concept: "strategy-regime-fit",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Most 'broken' systems are in a normal drawdown, and most abandoned systems are abandoned there. Decide with the corridor, the regime split and the R0 control, not with the last ten trades.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: DECAY_CARDS,
      goal: "Three systems, three stories: a normal drawdown, a decayed edge and a fit to noise. Classify each using the corridor, the regime breakdown and the R0 control.",
      success: { field: "solved", eq: 3 },
      correct: "All three. System 1 is inside its corridor, in a regime it's known to dislike: keep. System 2 is outside it with costs up: decayed. System 3's R0 twin did as well: noise from the start.",
      hints: ["Inside the corridor and explained by the regime: normal variance.", "If R0 looked just as good, it was noise from the start."],
      showMe: { solved: 3 },
      concept: "strategy-crowding",
    },
    check: ["q-3.13.7-1", "q-3.13.7-2", "q-3.13.7-3"],
    recap: {
      takeaways: [
        "Published edges shrink: 26% from selection, 58% after publication. Treat paper results as upper bounds.",
        "Crowded strategies crash together: the same holders sell into the same few buyers.",
        "Judge a drawdown by its corridor, regime and R0 control before calling an edge broken.",
      ],
    },
  },
};

const L8: Lesson = {
  id: "3.13.8",
  title: "Reading a strategy study critically",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "A ten-point checklist turns any paper, backtest or vendor claim into an evidence grade you can defend in two sentences.",
  objectives: [
    "Apply a ten-point checklist to any strategy paper, backtest or vendor claim.",
    "Compare a headline result with an independent replication after costs.",
    "Assign an evidence grade from Mechanic to F and defend it in two sentences.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "decision_making", label: "Decision making check" },
    { kind: "mission", ref: "M06", label: "The FOMO Trap" },
  ],
  script: {
    unit: "3.13",
    courseId: "3.13.8",
    hook: {
      prompt: "A 2024 working paper reports an opening-range strategy: over 1,600% net in eight years, Sharpe 2.81. An independent test on five index markets, after spreads and slippage, found…",
      control: {
        kind: "choice",
        choices: [
          { id: "same", label: "About the same result", feedback: "Headlines rarely survive intact: the paper had no true out-of-sample period, and the open is the costliest moment to trade." },
          { id: "half", label: "About half the result", feedback: "Worse than half: after costs, the replication found nothing it could tell apart from zero." },
          { id: "zero", label: "No market distinguishable from zero", feedback: "Right." },
        ],
        answer: "zero",
      },
      compare: "You chose {yours}. The replication found the gross edge, about +0.13R a trade on one index, but after costs no market was distinguishable from zero (2.9.4).",
      concept: "evidence-appraisal",
    },
    learn: [
      {
        kind: "match",
        title: "The ten-point checklist",
        prompt: "Sort the ten checks into three groups: the claim itself, how it was tested, and whether it holds up in the world.",
        pairs: [
          { left: "Sample: period, markets, number of trades", right: "The claim", wrong: "Before any test, you need to know what was studied and how much of it." },
          { left: "Status: working paper or peer-reviewed", right: "The claim", wrong: "Status describes the claim: has anyone independent checked it yet?" },
          { left: "A true out-of-sample test", right: "The test", wrong: "Whether data was held back is part of how the claim was tested." },
          { left: "Realistic costs and fills", right: "The test", wrong: "Costs are a test assumption: spreads, commissions, slippage." },
          { left: "Number of trials reported", right: "The test", wrong: "How many versions were tried decides how much luck the result contains." },
          { left: "Sensitivity to parameters", right: "The test", wrong: "Whether nearby settings also work is a test of the result's robustness." },
          { left: "Independent replication", right: "Holds up in the world", wrong: "Replication asks whether someone else, elsewhere, gets the same." },
          { left: "Mechanism: who is on the other side", right: "Holds up in the world", wrong: "A reason someone pays you is what lets an edge persist outside the sample." },
          { left: "Capacity and liquidity", right: "Holds up in the world", wrong: "Whether real money can trade it is a question about the world, not the test." },
          { left: "Decay after publication, crowding", right: "Holds up in the world", wrong: "Decay and crowding happen after the study, in live markets." },
        ],
        columns: ["Check", "Group"],
        correct: "Right: two checks on the claim, four on the test, four on the world. Work through them in that order.",
        concept: "evidence-appraisal",
      },
      {
        kind: "worked",
        title: "Case 1: the opening range breakout",
        lines: [
          "Claim: over 1,600% net, Sharpe 2.81, US 'stocks in play', 2016–2023 (Zarattini, Barbon and Aziz, 2024).",
          "Status: working paper. No true out-of-sample period.",
          "Independent replication on five index markets: the gross edge reproduced, about +0.13R a trade on one of them.",
          "A round trip at the open costs about 0.10R, and stop orders slip.",
          "Net of spreads and slippage: no market distinguishable from zero.",
        ],
        after: "Grade C: the pattern is real, the profit depends on costs, and the replication used different instruments from the paper. The detail is in 2.9.4.",
        concept: "evidence-appraisal",
      },
      {
        kind: "worked",
        title: "Case 2: data snooping",
        lines: [
          "Brock, Lakonishok and LeBaron (1992): simple moving-average and breakout rules predicted the Dow, 1897–1986.",
          "Sullivan, Timmermann and White (1999) re-tested them inside a universe of nearly 8,000 rules, correcting for the search.",
          "In the original period, the best rule still held up.",
          "In the next ten years, 1987–1996, it didn't.",
        ],
        after: "Data snooping: search the same data enough times and something always fits. The cure is to count every rule tried and to test on years the search never saw.",
        concept: "evidence-appraisal",
      },
      {
        kind: "explain",
        title: "The haircut",
        text: "When hundreds of factors have been tested, a t-statistic of 2 is too easy to reach by chance. Harvey, Liu and Zhu (2016) argue that a new factor should clear about 3.0. Deflated Sharpe ratios, overfitting probabilities and minimum backtest lengths formalise the same idea; they come in 4.3.",
      },
      {
        kind: "match",
        title: "Vendor red flags",
        prompt: "Each line from a signal seller leaves out one checklist item. Match them.",
        pairs: [
          { left: "'Tested on the last six months of one coin'", right: "Sample", wrong: "Six months of one market is a tiny sample." },
          { left: "'The best of 300 settings we tried'", right: "Number of trials", wrong: "The best of 300 is mostly luck unless the threshold accounts for all 300." },
          { left: "'Results before spreads and commissions'", right: "Costs and fills", wrong: "Gross results skip what you'd actually pay." },
          { left: "'Proprietary: we can't show the rules'", right: "Independent replication", wrong: "Secret rules can't be repeated by anyone else." },
          { left: "'Works on any market, any timeframe, always'", right: "Mechanism", wrong: "An edge with no reason and no losing regime has no one paying for it." },
        ],
        columns: ["The claim", "What's missing"],
        correct: "Right. Each claim skips one line of the checklist, and the missing line is the one that matters.",
        concept: "performance-claims",
      },
      {
        kind: "explain",
        title: "From checklist to grade",
        text: "[[evidence-grade|Grades]]: Mechanic, true by construction; A, robust across markets and decades; B, real but decayed or regime-bound; C, mixed or cost-dependent; D, unsupported when tested; F, loses by design. A [[working-paper]] without [[replication]] rarely rises above C, and [[peer-review]] alone doesn't make an A. Defend the grade in two sentences: what's shown, and what's missing.",
      },
      {
        kind: "fields",
        title: "Your evidence card",
        prompt: "Pick one strategy from 3.13.1–3.13.6 and write its evidence card. It's saved with the lesson.",
        fields: [
          { id: "strategy", label: "Strategy and the claim", kind: "text", default: "", placeholder: "e.g. pairs trading, distance method: about 11% a year, 1962–2002", required: true },
          { id: "grade", label: "Grade (Mechanic, A–F)", kind: "text", default: "", placeholder: "e.g. B", required: true },
          { id: "shown", label: "Sentence 1: what the evidence shows", kind: "text", default: "", placeholder: "e.g. peer-reviewed, decades of data, profitable after costs at the time", required: true },
          { id: "missing", label: "Sentence 2: what's missing or decayed", kind: "text", default: "", placeholder: "e.g. returns fell by more than two-thirds in later periods", required: true },
        ],
        correct: "Saved. Two sentences you can defend beat a grade you can't.",
        concept: "evidence-appraisal",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: REPORT_CARDS,
      goal: "Five synthetic strategy reports. Grade each from A to F with the checklist: what's the sample, was it tested out of sample with costs, and has anyone else replicated it?",
      success: { field: "solved", eq: 5 },
      correct: "Five grades. Report 3 earned its A with independent tests across markets and decades; Report 4 is B because it shrank after publication; Report 1 stays C until someone replicates it with costs.",
      hints: ["Start with costs, trials and out-of-sample.", "Without an independent replication, the grade rarely goes above C."],
      showMe: { solved: 5 },
      concept: "evidence-appraisal",
    },
    check: ["q-3.13.8-1", "q-3.13.8-2", "q-3.13.8-3"],
    recap: {
      takeaways: [
        "Check sample, status, out-of-sample, costs, trials, sensitivity, replication, mechanism, capacity and decay.",
        "The opening range paper's gross edge replicated; after costs, nothing was distinguishable from zero.",
        "Grade from Mechanic to F and defend it in two sentences: what's shown, what's missing.",
      ],
    },
  },
};

// ─── Check questions ────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 3.13.1 · Time-series momentum and the Turtles
  {
    id: "q-3.13.1-1",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "Account 100,000 vUSD. LXF's N is 2.0 points and each point is worth 50 vUSD. How many contracts is one Turtle unit?",
    numeric: { answer: 10, tolerance: 0, unit: "contracts" },
    explanation: "Unit = 1% of equity ÷ (N × value per point) = 1,000 ÷ (2.0 × 50) = 1,000 ÷ 100 = 10 contracts. One N then moves the account by 1,000 vUSD, 1%.",
    lesson: "3.13.1",
    concepts: ["percent-volatility-sizing"],
    hints: ["A unit is sized so that one N moves the account by 1%.", "Unit = 1% of equity ÷ (N × value per point).", "1,000 ÷ (2.0 × 50) = ?"],
    vary: {
      fields: { acct: [50000, 200000, 10000], n: [1, 4, 0.5], pv: [10, 50, 5] },
      constraints: ["acct * 0.01 / (n * pv) >= 1"],
      answer: "floor(acct * 0.01 / (n * pv))",
      prompt: "Account {acct} vUSD. A synthetic future's N is {n:1} points and each point is worth {pv} vUSD. How many whole contracts is one Turtle unit?",
      explanation: "Unit = 1% of equity ÷ (N × value per point) = {acct * 0.01} ÷ ({n:1} × {pv}) = {acct * 0.01 / (n * pv):2}, rounded down to {answer} contracts.",
      hint: "{acct * 0.01} ÷ ({n:1} × {pv}) = ?, then round down.",
    },
  },
  {
    id: "q-3.13.1-2",
    topic: "position_sizing",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why does the time-series momentum rule size each market to the same volatility?",
    options: [
      { id: "a", label: "Because volatile markets trend more, so they deserve more money", rationale: "Volatility isn't a trend signal. Sized by money alone, the wildest market would carry most of the risk, not most of the edge." },
      { id: "b", label: "To make every position the same size in vUSD", rationale: "That's equal notional, the opposite. Equal money means a 40%-volatility market moves the account five times as much as an 8% one." },
      { id: "c", label: "So each market adds similar risk, instead of the wildest one dominating", },
      { id: "d", label: "To cut costs, because scaled positions trade less", rationale: "Scaling can add trades as volatility changes. Its purpose is equal risk per market, not lower costs." },
    ],
    correct: "c",
    explanation: "Scaling makes each market move the account by about the same amount. In the seeded test, the most volatile of 12 markets carried 21.6% of an equal-notional portfolio's risk, and 8.5% of the scaled one's: close to 1 in 12.",
    lesson: "3.13.1",
    concepts: ["time-series-momentum", "percent-volatility-sizing"],
    hints: ["At the same notional, compare how much a 40%-volatility market and an 8% one move the account.", "What share of the risk should each of 12 markets carry?"],
  },
  {
    id: "q-3.13.1-3",
    topic: "psychology",
    kind: "scenario",
    difficulty: 3,
    scenario: "Your trend system, validated out of sample, has just lost 12 trades in a row. Its backtest win rate is 35%, and the Monte Carlo corridor built from its trades puts a 12-loss run inside the 95% band over its trade count.",
    prompt: "What do you do?",
    options: [
      { id: "a", label: "Stop trading it: 12 losses in a row means the edge is gone", rationale: "At a 35% win rate, long losing runs are normal. The seeded System 2 had one of 12 in 621 trades while its edge was intact." },
      { id: "b", label: "Tighten the stops to 1N to lose less per trade", rationale: "Changing the rules mid-drawdown creates an untested system. Tighter stops cut the winners too; the backtest no longer describes what you trade." },
      { id: "c", label: "Double the size: a win is overdue", rationale: "Trades are close to independent, so no win is 'due'. Doubling size into a drawdown raises the risk of ruin." },
      { id: "d", label: "Check the run against the corridor and the regime, keep following the rules, and log it" },
    ],
    correct: "d",
    explanation: "A run inside the corridor is variance, not evidence of a broken edge. Check the regime too: trend systems lose in ranges. Then follow the rules; abandoning a system at its worst point is the classic way to miss its recovery.",
    lesson: "3.13.1",
    concepts: ["streaks-and-runs", "time-series-momentum"],
    hints: ["Is a 12-loss run inside or outside what the system produces by chance?", "What does a 35% win rate imply for losing runs?"],
  },

  // 3.13.2 · Cross-sectional momentum and its crashes
  {
    id: "q-3.13.2-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Why do momentum strategies rank on 12-1, skipping the latest month?",
    options: [
      { id: "a", label: "Because the latest month's prices aren't published yet", rationale: "They're available. The month is skipped because one-month returns tend to partly reverse, which would dilute the signal." },
      { id: "b", label: "Because one-month returns tend to reverse, which works against the signal" },
      { id: "c", label: "To trade less often", rationale: "Turnover is set by how often you rebalance. The skip removes the short-term reversal effect." },
      { id: "d", label: "Because the latest month is the strongest predictor", rationale: "The opposite: over one month, winners tend to give some back. That's why it's left out." },
    ],
    correct: "b",
    explanation: "Short-horizon returns tend to partly reverse, so the latest month works against a 12-month momentum signal. Ranking on months 12 to 2 keeps the persistent part.",
    lesson: "3.13.2",
    concepts: ["cross-sectional-momentum"],
  },
  {
    id: "q-3.13.2-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "When are momentum crashes most likely?",
    options: [
      { id: "a", label: "After a steady, calm bull market", rationale: "Calm uptrends are momentum's good times. Crashes come after a deep fall, with volatility high, as the market rebounds." },
      { id: "b", label: "During any sharp fall", rationale: "During the fall, the short leg holds the falling losers and gains. The damage comes at the turn, when they rebound." },
      { id: "c", label: "After a deep fall with high volatility, when the market rebounds" },
      { id: "d", label: "At random: no market state comes before them", rationale: "Daniel and Moskowitz linked them to a state: after market falls, with volatility high, at the rebound." },
    ],
    correct: "c",
    explanation: "After a deep fall, the losers are the high-beta assets. When the market turns up, they rise most, and the short leg loses heavily: past losers +163% against past winners +8% in March–May 2009.",
    lesson: "3.13.2",
    concepts: ["momentum-crash"],
    hints: ["Which assets end up as 'losers' after a market crash?", "What do high-beta assets do when the market rebounds?"],
  },
  {
    id: "q-3.13.2-3",
    topic: "portfolio_exposure",
    kind: "scenario",
    difficulty: 3,
    scenario: "You compare two momentum versions: (1) hold the top 3 sector ETFs, long only; (2) long the top tenth and short the bottom tenth of 500 stocks.",
    prompt: "How does the risk of version 1 differ from version 2?",
    options: [
      { id: "a", label: "It has no crash risk at all: it only buys winners", rationale: "It drops the short leg's crash, but it keeps the market's full beta, so a bear market still hits it fully." },
      { id: "b", label: "It avoids the short-leg crash but carries the market's full beta" },
      { id: "c", label: "It's riskier only because three ETFs are less diversified than 100 stocks", rationale: "Sector ETFs are diversified inside. The bigger change is losing the short leg and taking on the whole market's beta." },
      { id: "d", label: "No difference: both are momentum", rationale: "Same signal, different exposures. Long-only holds market beta; long–short is roughly market-neutral but carries the short-leg crash." },
    ],
    correct: "b",
    explanation: "Long–short momentum is close to market-neutral but crashes when losers rebound. Long-only top-3 has no short leg to crash, but it rises and falls with the market, so it carries bear-market risk instead.",
    lesson: "3.13.2",
    concepts: ["cross-sectional-momentum", "momentum-crash"],
    hints: ["What does the short leg do in a rebound?", "Without a short leg, what exposure is left?"],
  },

  // 3.13.3 · Carry and its crashes
  {
    id: "q-3.13.3-1",
    topic: "portfolio_exposure",
    kind: "numeric",
    difficulty: 1,
    prompt: "You hold 50,000 vUSD long a currency that yields 3.5% a year more than the one you're short. Ignoring the broker's markup, how much carry do you earn per calendar day?",
    numeric: { answer: 4.79, tolerance: 0.01, unit: "vUSD" },
    explanation: "50,000 × 3.5% = 1,750 vUSD a year; ÷ 365 = 4.79 vUSD a day. Wednesday's swap pays three days.",
    lesson: "3.13.3",
    concepts: ["carry"],
    hints: ["Yearly carry = exposure × rate differential.", "Divide by 365 calendar days.", "1,750 ÷ 365 = ?"],
    vary: {
      fields: { x: [10000, 200000, 10000], d: [0.5, 6, 0.25] },
      answer: "round(x * d / 100 / 365, 2)",
      prompt: "You hold {x} vUSD long a currency that yields {d:2}% a year more than the one you're short. Ignoring the broker's markup, how much carry do you earn per calendar day?",
      explanation: "{x} × {d:2}% = {x * d / 100} vUSD a year; ÷ 365 = {answer:2} vUSD a day.",
      hint: "{x * d / 100} ÷ 365 = ?",
    },
  },
  {
    id: "q-3.13.3-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why do carry strategies in currencies, bonds and commodities tend to crash at the same time?",
    options: [
      { id: "a", label: "Because they all use the same brokers", rationale: "Brokers don't drive it. Carry is payment for holding crash risk, and the crash comes in global recessions and liquidity crises for all of them." },
      { id: "b", label: "Coincidence: their returns are independent", rationale: "Koijen and co-authors found the bad periods coincide, in global recessions. That shared timing is why carry diversifies less than it looks." },
      { id: "c", label: "Because central banks change rates in every country on the same day", rationale: "Policy rarely moves in lockstep. The common factor is global risk appetite and liquidity, which collapse together." },
      { id: "d", label: "Each is paid for holding risk that pays out in global crises, when everyone de-risks at once" },
    ],
    correct: "d",
    explanation: "Carry pays for bearing crash risk: it's the insurer's side. In a global recession or liquidity crisis, funding dries up and crowded carry positions unwind together, across asset classes. Spreading carry across markets helps less than it seems.",
    lesson: "3.13.3",
    concepts: ["carry", "carry-unwind"],
    hints: ["Whose risk is a carry trader paid to hold?", "What happens to funding and risk appetite everywhere in a global crisis?"],
  },
  {
    id: "q-3.13.3-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario: "A carry fund shows three years of smooth monthly gains, a Sharpe ratio of 2 and a worst month of −1.5%. It runs at 3× leverage.",
    prompt: "What does that record leave out?",
    options: [
      { id: "a", label: "The rare large jump: a negative-skew strategy looks safest just before its crash" },
      { id: "b", label: "Nothing: three years at Sharpe 2 is strong evidence of low risk", rationale: "Three calm years can't show a jump that comes once every few years. Negative skew stays invisible until it hits." },
      { id: "c", label: "Only the costs, which lower the Sharpe a little", rationale: "Costs matter, but the bigger gap is jump risk. A 10% move at 3× leverage costs 30% at once." },
      { id: "d", label: "That a Sharpe of 2 is too low to matter", rationale: "A Sharpe of 2 is high. The problem is that it was measured in a calm sample with no crash in it." },
    ],
    correct: "a",
    explanation: "Carry earns small steady gains and rarely loses big. A calm sample measures the small gains and misses the crash, so volatility and Sharpe look better than the risk. In the seeded path, a Sharpe of 2.02 over three years, then one jump took the account below where it started.",
    lesson: "3.13.3",
    concepts: ["carry", "return-skew"],
    hints: ["How often does the jump come, and how long is the record?", "Which tail does a calm sample miss?"],
  },

  // 3.13.4 · Testing a seasonal edge
  {
    id: "q-3.13.4-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "You scan 4 markets with a real calendar drift, tested with 60% power, and 16 noise markets at the 5% level. What share of your flags do you expect to be false?",
    numeric: { answer: 25, tolerance: 0.5, unit: "%" },
    explanation: "False flags: 16 × 0.05 = 0.8. True flags: 4 × 0.6 = 2.4. False-discovery rate = 0.8 ÷ (0.8 + 2.4) = 0.8 ÷ 3.2 = 25%.",
    lesson: "3.13.4",
    concepts: ["false-discovery-rate"],
    hints: ["False-discovery rate = false flags ÷ all flags.", "False flags = noise markets × 5%; true flags = real markets × power.", "0.8 ÷ (0.8 + 2.4) = ?"],
    vary: {
      fields: { real: [2, 6, 1], noise: [5, 60, 5], pw: [50, 90, 10] },
      answer: "round(noise * 0.05 / (noise * 0.05 + real * pw / 100) * 100, 1)",
      prompt: "You scan {real} markets with a real calendar drift, tested with {pw}% power, and {noise} noise markets at the 5% level. What share of your flags do you expect to be false?",
      explanation: "False flags: {noise} × 0.05 = {noise * 0.05:2}. True flags: {real} × {pw / 100:1} = {real * pw / 100:2}. False-discovery rate = {noise * 0.05:2} ÷ {noise * 0.05 + real * pw / 100:2} = {answer:1}%.",
      hint: "{noise * 0.05:2} ÷ ({noise * 0.05:2} + {real * pw / 100:2}) = ?",
    },
  },
  {
    id: "q-3.13.4-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "A turn-of-month effect passes your hold-out test. Why use it as a filter or tilt rather than a system on its own?",
    options: [
      { id: "a", label: "Because calendar effects are always fake", rationale: "Some, like the turn of the month, have real evidence (grade B). The issue is size: the edge is small against costs." },
      { id: "b", label: "Its edge per day is small against the costs of trading it alone; as a tilt it adds without new trades" },
      { id: "c", label: "Because the hold-out proves it will continue", rationale: "A hold-out lowers the chance it's noise. It proves nothing about the future, and the edge stays small against costs." },
      { id: "d", label: "Because filters always beat systems", rationale: "Not always. Here, a thin edge traded alone pays costs on every entry; as a tilt on trades you already take, it doesn't." },
    ],
    correct: "b",
    explanation: "About 4 trading days in 21 sit in the window, and the extra return per day is small. Traded alone, it pays spread and commission every month for a thin edge. Used to time or size signals you already take, it adds the edge without adding many trades.",
    lesson: "3.13.4",
    concepts: ["after-cost-evaluation"],
    hints: ["Compare the extra return per day with the cost of a round trip.", "What does a tilt cost that a separate system doesn't?"],
  },
  {
    id: "q-3.13.4-3",
    topic: "scenario_analysis",
    kind: "scenario",
    difficulty: 3,
    scenario: "A synthetic gas market: every year, spot tends to rise from spring to winter. In April, the December contract already trades 0.55 above spot.",
    prompt: "You plan to buy the December contract in April to catch the seasonal rise. What's the problem?",
    options: [
      { id: "a", label: "None: the seasonal rise is reliable, so the contract will rise with spot", rationale: "The contract's price already includes the expected rise. It gains only if winter spot ends more than 0.55 above today's." },
      { id: "b", label: "Futures can't be bought that far ahead", rationale: "They can. The issue is that the curve already prices the season, so buying it earns only the surprise." },
      { id: "c", label: "The expected rise is already in the December price; you gain only if winter beats it" },
      { id: "d", label: "Seasonal patterns only exist in stocks", rationale: "Commodity seasons come from real supply and demand. The catch is that the futures curve prices them in advance." },
    ],
    correct: "c",
    explanation: "When a seasonal move is predictable, the futures curve prices it: the December contract already trades near the expected winter level. Buying it earns only the gap between winter spot and that price. Check the curve before trading a commodity season (grade C as a trade).",
    lesson: "3.13.4",
    concepts: ["news-surprise"],
    hints: ["What does the 0.55 premium already contain?", "Where does the December contract end up at expiry?"],
  },

  // 3.13.5 · Pairs trading and statistical arbitrage
  {
    id: "q-3.13.5-1",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A pair's spread is 1.80 above its mean, and its standard deviation is 0.75. What is the z-score?",
    numeric: { answer: 2.4, tolerance: 0.01, unit: "" },
    explanation: "z = (spread − mean) ÷ standard deviation = 1.80 ÷ 0.75 = 2.40. Past +2, so the rule sells the spread.",
    lesson: "3.13.5",
    concepts: ["pairs-trading"],
    hints: ["A z-score measures distance from the mean in standard deviations.", "z = (spread − mean) ÷ standard deviation.", "1.80 ÷ 0.75 = ?"],
    vary: {
      fields: { dev: [0.5, 4, 0.1], s: [0.4, 2, 0.05] },
      answer: "round(dev / s, 2)",
      prompt: "A pair's spread is {dev:2} above its mean, and its standard deviation is {s:2}. What is the z-score?",
      explanation: "z = (spread − mean) ÷ standard deviation = {dev:2} ÷ {s:2} = {answer:2}.",
      hint: "{dev:2} ÷ {s:2} = ?",
    },
  },
  {
    id: "q-3.13.5-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A spread reverts at θ = 0.05 a day. What is its half-life, in days?",
    numeric: { answer: 13.9, tolerance: 0.1, unit: "days" },
    explanation: "Half-life = ln 2 ÷ θ = 0.693 ÷ 0.05 = 13.9 days. A time stop near two half-lives is about 28 days.",
    lesson: "3.13.5",
    concepts: ["pairs-trading", "cointegration"],
    hints: ["Half-life = ln 2 ÷ θ.", "ln 2 ≈ 0.693.", "0.693 ÷ 0.05 = ?"],
    vary: {
      fields: { th: [0.02, 0.3, 0.01] },
      answer: "round(0.6931 / th, 1)",
      prompt: "A spread reverts at θ = {th:2} a day. What is its half-life, in days?",
      explanation: "Half-life = ln 2 ÷ θ = 0.693 ÷ {th:2} = {answer:1} days. A time stop near two half-lives is about {2 * answer:0} days.",
      hint: "0.693 ÷ {th:2} = ?",
    },
  },
  {
    id: "q-3.13.5-3",
    topic: "stop_loss",
    kind: "scenario",
    difficulty: 3,
    scenario: "You're short a cointegrated pair's spread, entered at z = 2.1, with a stop at |z| = 3.5. A merger is announced for one of the two companies, and the spread jumps to z = 4.",
    prompt: "What do you do?",
    options: [
      { id: "a", label: "Add to the position: it's even more stretched", rationale: "Stretched only if the old relationship still holds. A merger rewires it, so the mean you're betting on may no longer exist." },
      { id: "b", label: "Hold until the time stop: it should revert within two half-lives", rationale: "The half-life was measured on the old relationship. After a structural break, it no longer describes the spread." },
      { id: "c", label: "Exit at the stop, and re-test the pair before trading it again" },
      { id: "d", label: "Remove the stop until the merger news settles", rationale: "That turns a capped loss into an open one, exactly when the relationship is most likely broken." },
    ],
    correct: "c",
    explanation: "A merger is a structural break: the economic link that held the spread together has changed. The stop exists for this. Exit, then re-test the relationship on new data before trading the pair again.",
    lesson: "3.13.5",
    concepts: ["structural-break", "pairs-trading"],
    hints: ["What has the merger done to the relationship the spread depended on?", "What is the stop for?"],
  },

  // 3.13.6 · Event-driven strategies, systematically
  {
    id: "q-3.13.6-1",
    topic: "scenario_analysis",
    kind: "numeric",
    difficulty: 1,
    prompt: "On the day of its earnings, a stock rose 3.5% while the index fell 0.5%. Its beta is 1.4. What was its abnormal return?",
    numeric: { answer: 4.2, tolerance: 0.05, unit: "%" },
    explanation: "Expected from the market: 1.4 × (−0.5%) = −0.7%. Abnormal = actual − expected = 3.5% − (−0.7%) = 4.2%. The stock beat a falling market.",
    lesson: "3.13.6",
    concepts: ["event-study"],
    hints: ["Abnormal = actual − beta × market.", "1.4 × (−0.5%) = −0.7%.", "3.5 − (−0.7) = ?"],
    vary: {
      fields: { r: [-6, 8, 0.5], m: [-2, 2, 0.25], b: [0.5, 2, 0.1] },
      answer: "round(r - b * m, 2)",
      prompt: "On the day of its earnings, a stock returned {r:1}% while the index returned {m:2}%. Its beta is {b:1}. What was its abnormal return, in %?",
      explanation: "Expected from the market: {b:1} × ({m:2}%) = {b * m:2}%. Abnormal = actual − expected = {r:1} − ({b * m:2}) = {answer:2}%.",
      hint: "{r:1} − ({b * m:2}) = ?",
    },
  },
  {
    id: "q-3.13.6-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why does an event study average the abnormal returns of many events instead of studying one closely?",
    options: [
      { id: "a", label: "Because single events are hard to find", rationale: "Events are easy to find. One event's move includes news and noise unique to it; only an average over many separates the effect." },
      { id: "b", label: "Because averaging makes the effect bigger", rationale: "Averaging doesn't enlarge the effect; it shrinks the noise around it, so the band narrows." },
      { id: "c", label: "To avoid having to estimate beta", rationale: "Beta is still needed for each abnormal return. Averaging deals with the noise, not the market adjustment." },
      { id: "d", label: "One event mixes the effect with its own noise; averaging cancels noise, and the band shows what's left" },
    ],
    correct: "d",
    explanation: "Each stock's reaction carries its own news and noise. In the seeded study, single bad-news stocks ranged from −26.55% to +10.55% by day +60. The average over many events, with its confidence band, tells you whether an effect exists.",
    lesson: "3.13.6",
    concepts: ["event-study", "sample-size"],
    hints: ["What else moves one stock on one day besides the event?", "What happens to unrelated noise when you average many cases?"],
  },
  {
    id: "q-3.13.6-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A course sells a method for trading breaking headlines: read the news on social media, then buy or sell within a minute.",
    prompt: "What evidence grade fits retail headline trading, and why?",
    options: [
      { id: "a", label: "A: news moves prices, so trading the news works", rationale: "News does move prices, but by the time a retail trader reads and clicks, faster traders have already moved them." },
      { id: "b", label: "D: professionals and machines react first, so a late reaction earns about zero before costs" },
      { id: "c", label: "B: it works in some regimes", rationale: "B needs peer-reviewed support that has weakened. For retail headline trading the evidence points the other way: latency leaves about zero minus costs." },
      { id: "d", label: "F: it loses by design", rationale: "F is for negative expectancy built into the structure, like doubling after losses. Headline trading isn't built to lose; it's simply too slow to win." },
    ],
    correct: "b",
    explanation: "Unscheduled headlines are traded first by machines with direct feeds. A retail trader enters after the move, with wide spreads and whipsaws, so the expected value is about zero before costs and negative after: grade D.",
    lesson: "3.13.6",
    concepts: ["evidence-grades"],
    hints: ["Who sees and trades the headline first?", "What's left of the move a minute later?"],
  },

  // 3.13.7 · Decay, crowding and regime dependence
  {
    id: "q-3.13.7-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "McLean and Pontiff found published predictors earned 26% less out of sample, before publication. What does that drop mostly reflect?",
    options: [
      { id: "a", label: "Traders copying the strategies after reading the papers", rationale: "That's the larger drop after publication, 58%. Before publication nobody could copy it, so the 26% reflects luck in the original search." },
      { id: "b", label: "Statistical bias: part of each original result was luck from searching the data" },
      { id: "c", label: "Higher trading costs in later years", rationale: "Costs can matter, but this drop mainly measures how much of each finding was selection luck." },
      { id: "d", label: "Markets turning random", rationale: "Most predictors kept some return. The drop says the original estimates were inflated, not that markets turned random." },
    ],
    correct: "b",
    explanation: "Out of sample but before publication, nobody was trading on the paper. The 26% drop is the data-mining part: picking results that looked best in one sample. The bigger 58% drop after publication adds traders learning from the papers.",
    lesson: "3.13.7",
    concepts: ["evidence-grades"],
  },
  {
    id: "q-3.13.7-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why do crowded strategies tend to lose together?",
    options: [
      { id: "a", label: "Because crowded strategies are usually bad ideas", rationale: "Many crowded trades had real edges. The problem is the shared exit, not the idea." },
      { id: "b", label: "Because regulators target popular strategies", rationale: "Regulation isn't the driver. Forced selling by holders of the same positions is." },
      { id: "c", label: "Many holders own the same positions, so when some must sell, all sell into the same few buyers" },
      { id: "d", label: "They don't: more traders means more liquidity", rationale: "More traders on the same side adds liquidity only until they all want out. Then liquidity vanishes on that side." },
    ],
    correct: "c",
    explanation: "Crowding shrinks the edge and links the exits. A shock forces a few holders to sell, prices move against everyone in the same trade, and more stops and margin calls follow: LTCM in 1998, momentum in 2009, the yen carry unwind in 2024.",
    lesson: "3.13.7",
    concepts: ["strategy-crowding"],
    hints: ["Who's on the other side when everyone wants to exit?", "What happens to stops and margin calls when prices gap?"],
  },
  {
    id: "q-3.13.7-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "Your system is down 14R. Its Monte Carlo corridor puts the 99th-percentile drawdown at 17R, where your kill switch sits. The market has moved from trending to ranging, a regime where the system has always done worse.",
    prompt: "What do you do?",
    options: [
      { id: "a", label: "Stop now: 14R is a big loss", rationale: "Big, but inside what the system produces by chance and short of your kill switch. Stopping here acts on emotion, not on your rule." },
      { id: "b", label: "Add a regime filter right away, tuned on the last few months", rationale: "An ad-hoc change mid-drawdown, fitted to recent data, is a new untested system. Run it through your rule-change process and test it out of sample." },
      { id: "c", label: "Keep trading under the rules; propose a regime filter through your rule-change process, tested out of sample first" },
      { id: "d", label: "Double the size to recover faster", rationale: "More size in a drawdown raises the chance of hitting the kill switch. Size follows the rules, not the drawdown." },
    ],
    correct: "c",
    explanation: "At 14R you're inside the corridor and short of the 17R kill switch, and the regime shift explains the losses. The rule says keep trading. A regime filter may help, but it's a rule change: write it down, test it out of sample, and adopt it only if it holds.",
    lesson: "3.13.7",
    concepts: ["market-regime", "rule-change-governance"],
    hints: ["Where is 14R relative to the corridor and the kill switch?", "How should a rule change be made?"],
  },

  // 3.13.8 · Reading a strategy study critically
  {
    id: "q-3.13.8-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "A signal service advertises: '92% winning trades over the last 4 months!' What's the most important thing missing?",
    options: [
      { id: "a", label: "The average win and loss after costs, and the number of trades" },
      { id: "b", label: "The name of the trader", rationale: "Who runs it matters less than what the record shows. Without the average loss, costs and trade count, the 92% can't be read." },
      { id: "c", label: "Which broker they use", rationale: "Execution matters, but first you need the record: average win and loss, costs and sample size." },
      { id: "d", label: "A testimonial from a happy client", rationale: "Testimonials are selected stories. They add nothing about expectancy." },
    ],
    correct: "a",
    explanation: "A win rate alone can't tell you whether a strategy makes money: 92% small wins and 8% large losses can be negative. Four months is also a small sample. Ask for the average win and loss after costs, the number of trades, and the worst drawdown.",
    lesson: "3.13.8",
    concepts: ["performance-claims", "evidence-appraisal"],
  },
  {
    id: "q-3.13.8-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "A study you like is labelled 'working paper'. What does that tell you?",
    options: [
      { id: "a", label: "It's wrong", rationale: "Many working papers later pass review. The label means unchecked, not false." },
      { id: "b", label: "It's newer, so more reliable than published studies", rationale: "Newer isn't more reliable. A working paper hasn't had independent experts check its method." },
      { id: "c", label: "Its data has been verified by a journal", rationale: "That's what review would add. A working paper hasn't had it yet." },
      { id: "d", label: "It hasn't been peer-reviewed yet; treat it as provisional until reviewed or replicated" },
    ],
    correct: "d",
    explanation: "A working paper circulates before peer review. Its method, data and costs haven't been checked by independent experts, so its grade usually stays at C until it's reviewed and, better, independently replicated.",
    lesson: "3.13.8",
    concepts: ["evidence-appraisal"],
    hints: ["What step comes between writing a study and a journal publishing it?", "Who has checked its method so far?"],
  },
  {
    id: "q-3.13.8-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A peer-reviewed study found a weekly reversal effect in small stocks. Two independent replications found it too, but about 60% smaller after publication, and mostly gone after realistic spreads in the smallest stocks.",
    prompt: "Which grade fits, and why?",
    options: [
      { id: "a", label: "A: peer-reviewed and replicated", rationale: "A needs robustness that survives out of sample. Here the effect shrank sharply and depends on costs in the very stocks where it lives." },
      { id: "b", label: "B: real and peer-reviewed, but decayed since publication and limited by costs" },
      { id: "c", label: "D: it doesn't work", rationale: "It was replicated, so it isn't unsupported. Weaker and cost-limited is B, not D." },
      { id: "d", label: "F: it loses by design", rationale: "F means negative expectancy built in. This effect is real but shrinking." },
    ],
    correct: "b",
    explanation: "Peer review and independent replications support the effect, so it isn't C or D. But it shrank after publication and depends on costs: real, decayed, segment-bound. That's B. In two sentences: what's shown, what's missing.",
    lesson: "3.13.8",
    concepts: ["evidence-appraisal", "evidence-grades"],
    hints: ["Was it replicated? Then it's above C and D.", "What does decay since publication mean on the grade scale?"],
  },
];

// ─── Glossary terms ─────────────────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "time-series-momentum",
    term: "Time-series momentum",
    definition: "A rule that goes long an asset whose own past return, usually over 12 months, was positive and short one whose return was negative, with positions typically scaled to equal volatility.",
    plain: "Long what has been rising and short what has been falling, judged on each asset's own past.",
    related: ["momentum", "trend-following", "cross-sectional-momentum"],
    lesson: "3.13.1",
    aka: ["TSMOM", "Absolute momentum"],
  },
  {
    id: "turtle-unit",
    term: "Turtle unit",
    definition: "A position size of 1% of equity divided by N times the value of one point, where N is the 20-day smoothed average true range, so that a move of one N changes the account by about 1%.",
    plain: "A position sized so one average daily range moves the account by 1%.",
    related: ["atr", "volatility-sizing"],
    lesson: "3.13.1",
  },
  {
    id: "crisis-alpha",
    term: "Crisis alpha",
    definition: "Gains a strategy tends to make during market crises, a label often given to trend following; how large it is depends on the period and the crises studied.",
    plain: "Gains a strategy tends to make during market crises.",
    related: ["time-series-momentum", "tail-event"],
    lesson: "3.13.1",
  },
  {
    id: "cross-sectional-momentum",
    term: "Cross-sectional momentum",
    definition: "Ranking the assets in a group by past return, typically over 12 months skipping the latest, then buying the top of the ranking and selling the bottom.",
    plain: "Buying the recent best performers in a group and selling the worst.",
    related: ["momentum", "time-series-momentum", "momentum-crash", "formation-period"],
    lesson: "3.13.2",
    aka: ["Relative momentum", "Winners minus losers"],
  },
  {
    id: "momentum-crash",
    term: "Momentum crash",
    definition: "A sudden large loss for a long–short momentum portfolio, typically when beaten-down past losers rebound sharply after a market fall with high volatility.",
    plain: "A sharp loss for momentum when past losers rebound strongly.",
    related: ["cross-sectional-momentum", "short-squeeze"],
    lesson: "3.13.2",
  },
  {
    id: "formation-period",
    term: "Formation period",
    definition: "The look-back window over which assets are ranked by past return before a momentum portfolio is formed, such as 12 months skipping the latest one (12-1).",
    plain: "The look-back window used to rank assets by past return.",
    related: ["cross-sectional-momentum"],
    lesson: "3.13.2",
    aka: ["Look-back period", "12-1"],
  },
  {
    id: "basis-trade",
    term: "Basis trade",
    definition: "Buying an asset in the spot market and selling its future or perpetual swap to earn the price difference or the funding payments, with little exposure to the price itself.",
    plain: "Buying spot and selling the related future or perpetual to earn the difference.",
    related: ["carry", "futures"],
    lesson: "3.13.3",
    aka: ["Cash-and-carry"],
  },
  {
    id: "uncovered-interest-parity",
    term: "Uncovered interest parity",
    definition: "The theory that a high-yielding currency's expected fall offsets its interest-rate advantage, so carry shouldn't pay on average. In the data, it often fails for long periods.",
    plain: "The theory that currency moves should cancel interest-rate differences; in practice they often don't.",
    related: ["carry", "carry-trade"],
    lesson: "3.13.3",
    aka: ["UIP"],
  },
  {
    id: "false-discovery-rate",
    term: "False discovery rate",
    definition: "The share of results flagged as significant that are actually false: false flags divided by all flags. It rises as more noise is searched.",
    plain: "The share of your 'discoveries' that are actually false.",
    related: ["sample-size", "out-of-sample"],
    lesson: "3.13.4",
    aka: ["FDR"],
  },
  {
    id: "seasonal-tilt",
    term: "Seasonal tilt",
    definition: "Using a calendar effect to filter entries or adjust the size of an existing strategy slightly, instead of trading the calendar on its own.",
    plain: "Adjusting size or filters slightly by calendar instead of trading the calendar alone.",
    related: ["false-discovery-rate"],
    lesson: "3.13.4",
  },
  {
    id: "pairs-trading",
    term: "Pairs trading",
    definition: "Trading the spread between two related instruments, long one and short the other, in the expectation that the spread returns to its mean.",
    plain: "Buying one related instrument and selling another, betting that their gap returns to normal.",
    related: ["cointegration", "z-score", "hedge-ratio", "half-life", "mean-reversion"],
    lesson: "3.13.5",
    aka: ["Pairs trade"],
  },
  {
    id: "cointegration",
    term: "Cointegration",
    definition: "A relationship between two wandering price series in which some combination of them, such as A − β × B, stays stationary, so gaps between them tend to close.",
    plain: "Two prices that wander but keep a stable gap between them.",
    related: ["pairs-trading", "correlation", "hedge-ratio"],
    lesson: "3.13.5",
  },
  {
    id: "z-score",
    term: "z-score",
    definition: "The number of standard deviations a value lies from its mean: (value − mean) ÷ standard deviation.",
    plain: "How many standard deviations a value is from its average.",
    related: ["standard-deviation", "pairs-trading"],
    lesson: "3.13.5",
  },
  {
    id: "half-life",
    term: "Half-life",
    definition: "For a mean-reverting series, the expected time for a gap to close halfway; for a reversion speed θ per period, about ln 2 ÷ θ.",
    plain: "The average time it takes a gap to close halfway.",
    related: ["pairs-trading", "mean-reversion"],
    lesson: "3.13.5",
  },
  {
    id: "hedge-ratio",
    term: "Hedge ratio",
    definition: "The number of units of one instrument held against one unit of another so the combination is neutral to their shared moves; in pairs trading, the β in A − β × B.",
    plain: "How many units of one instrument offset one unit of the other.",
    related: ["pairs-trading", "hedge"],
    lesson: "3.13.5",
  },
  {
    id: "structural-break",
    term: "Structural break",
    definition: "A lasting change in a relationship or process, such as a merger or a new business model, after which estimates from the past no longer apply.",
    plain: "A lasting change that ends a relationship that used to hold.",
    related: ["pairs-trading", "correlation-breakdown"],
    lesson: "3.13.5",
  },
  {
    id: "event-study",
    term: "Event study",
    definition: "A method that averages abnormal returns across many similar events, over a window around each one, and reports the average with a confidence band.",
    plain: "Measuring the average price reaction across many similar events.",
    related: ["abnormal-return", "beta", "confidence-interval"],
    lesson: "3.13.6",
  },
  {
    id: "abnormal-return",
    term: "Abnormal return",
    definition: "An asset's return minus the return expected from the market's move, usually beta times the market return. Summed over a window, it gives the cumulative abnormal return (CAR).",
    plain: "The return beyond what the market's move would predict.",
    related: ["beta", "event-study"],
    lesson: "3.13.6",
  },
  {
    id: "beta",
    term: "Beta",
    definition: "How strongly an asset's return has tended to move with the market's: a beta of 1.2 means about 1.2% for each 1% market move.",
    plain: "How much an asset tends to move when the market moves 1%.",
    related: ["abnormal-return", "correlation"],
    lesson: "3.13.6",
  },
  {
    id: "crowding",
    term: "Crowding",
    definition: "Many traders holding the same strategy or position, which shrinks its edge and makes their exits, and their losses, arrive together.",
    plain: "Too many traders using the same strategy, which shrinks its edge.",
    related: ["carry-unwind", "adaptive-markets"],
    lesson: "3.13.7",
  },
  {
    id: "adaptive-markets",
    term: "Adaptive markets",
    definition: "Andrew Lo's view that market efficiency varies over time as participants, competition and conditions change, so edges appear and fade.",
    plain: "The idea that market efficiency changes as participants and conditions change.",
    related: ["crowding", "market-regime"],
    lesson: "3.13.7",
  },
  {
    id: "working-paper",
    term: "Working paper",
    definition: "A research paper circulated publicly before peer review; its methods and results haven't yet been checked by independent referees.",
    plain: "A study published before peer review.",
    related: ["peer-review", "replication", "evidence-grade"],
    lesson: "3.13.8",
  },
  {
    id: "replication",
    term: "Replication",
    definition: "An independent repeat of a study, on the same or new data, to see whether its result holds.",
    plain: "Repeating a study independently to see whether the result holds.",
    related: ["working-paper", "peer-review", "out-of-sample"],
    lesson: "3.13.8",
  },
  {
    id: "peer-review",
    term: "Peer review",
    definition: "Evaluation of a study by independent experts before a journal publishes it. It checks method and reasoning; it doesn't promise the result will hold in the future.",
    plain: "Checking of a study by independent experts before publication.",
    related: ["working-paper", "replication"],
    lesson: "3.13.8",
  },
];

// ─── Concepts ───────────────────────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "time-series-momentum",
    name: "Time-series momentum",
    category: "technical_analysis",
    summary: "Going long assets whose own past returns were positive and short those whose past returns were negative.",
    body: [
      "Each market is judged on its own past: long if its last 12 months beat cash, short if not, with every position sized to the same volatility. Moskowitz, Ooi and Pedersen (2012) found the 12-month rule profitable in all 58 liquid futures they tested, across stock indices, currencies, commodities and bonds: grade A.",
      "Returns tended to persist for 1 to 12 months and partly reverse later. The Turtle rules are one public, crowded version of the idea; their exact parameters faded while the effect survived. Expect low win rates, long losing runs and multi-year flat stretches.",
    ],
    example: "Seeded test, 12 synthetic markets, 30 years: all 12 profitable, against 4 of 12 random-walk controls. The portfolio's Sharpe ratio was 1.13, yet it spent its first 35 months below its first peak.",
    related: ["trend-following", "percent-volatility-sizing", "cross-sectional-momentum"],
    missions: ["M02"],
    lessons: ["3.13.1"],
  },
  {
    id: "cross-sectional-momentum",
    name: "Cross-sectional momentum",
    category: "portfolio_exposure",
    summary: "Buying recent relative winners and selling relative losers within a universe.",
    body: [
      "Assets are ranked against each other on past return, usually 12 months skipping the latest one (12-1), because one-month returns tend to reverse. The top group is bought and the bottom group sold, rebalanced monthly. Jegadeesh and Titman (1993) found it in US stocks; Asness, Moskowitz and Pedersen (2013) across eight markets and asset classes. Grade A, decayed but persistent.",
      "Turnover, the cost of borrowing the shorts and crowding eat into it, and it crashes when losers rebound after a panic. A long-only version avoids the short-leg crash but keeps the market's beta.",
    ],
    example: "12-1 return: 12 months +22%, last month −3%: 1.22 ÷ 0.97 − 1 = +25.8%. That ranks above an asset with +30% over 12 months but +12% last month: 1.30 ÷ 1.12 − 1 = +16.1%.",
    related: ["time-series-momentum", "momentum-crash", "short-selling"],
    missions: [],
    lessons: ["3.13.2"],
  },
  {
    id: "momentum-crash",
    name: "Momentum crash",
    category: "risk_management",
    summary: "A sudden large loss for momentum strategies when beaten-down losers rebound sharply after a panic.",
    body: [
      "After a deep market fall, the past losers are mostly high-beta assets. When the market turns up, they rise most, and the short leg of a winners-minus-losers book loses heavily. Daniel and Moskowitz (2016) found crashes follow market declines, while volatility is high, at the rebound.",
      "Scaling exposure down when the strategy's recent volatility is high reduces the damage; studies of risk-managed momentum found it nearly doubled the Sharpe ratio.",
    ],
    example: "March to May 2009: past losers +163%, past winners +8%. With 1 vUSD on each leg: 0.08 − 1.63 = −1.55 vUSD. In a seeded test, scaling cut a −21.5% crash month to −9.1%.",
    related: ["cross-sectional-momentum", "percent-volatility-sizing", "tail-event"],
    missions: [],
    lessons: ["3.13.2"],
  },
  {
    id: "carry",
    name: "Carry",
    category: "portfolio_exposure",
    summary: "The return from holding an asset if prices don't move, such as a rate differential, roll yield or funding; prone to crashes.",
    body: [
      "Carry appears in every asset class: the swap on a currency pair, roll yield on a future in backwardation, coupon and roll-down on a bond, funding collected by long spot and short perpetual. Koijen, Moskowitz, Pedersen and Vrugt (2018) found it predicts returns across asset classes: grade A.",
      "Carry strategies did poorly at the same times across asset classes, in global recessions. Returns are negatively skewed: many small gains, rare large losses. Leverage has to be chosen from the jump, not from the average year.",
    ],
    example: "A 4% rate differential on 100,000 vUSD earns 10.96 vUSD a day. With a 20% yearly chance of a 10% jump, the 5th-percentile outcome over 10 years is −25.4% at 3× leverage and −61.3% at 5×.",
    related: ["carry-trade", "carry-unwind", "return-skew"],
    missions: ["M05"],
    lessons: ["3.13.3"],
  },
  {
    id: "false-discovery-rate",
    name: "False discovery rate",
    category: "decision_making",
    summary: "The share of flagged discoveries that are false.",
    body: [
      "A 5% test lets about 1 noise case in 20 pass. Scan many noise markets and those false flags pile up, while the number of real effects stays fixed, so a growing share of what you 'discover' is noise.",
      "Confirming each flag once on hold-out data cuts the false share sharply. Calendar effects are where this bites most: every date pattern you look for has a chance to appear.",
    ],
    example: "3 real markets at 70% power give 2.1 true flags; 7 noise markets at 5% give 0.35 false ones: 0.35 ÷ 2.45 = 14%. With 100 noise markets: 5 ÷ 7.1 = 70%.",
    related: ["sample-size", "random-walk", "luck-vs-skill"],
    missions: [],
    lessons: ["3.13.4"],
  },
  {
    id: "pairs-trading",
    name: "Pairs trading",
    category: "portfolio_exposure",
    summary: "Trading the spread between two related instruments in the expectation that it reverts.",
    body: [
      "Sell the spread when its z-score passes +2, buy it below −2, exit at 0, stop at about ±3.5, and close anything older than about two half-lives. It needs a cointegrated pair: correlation alone doesn't bring the spread back.",
      "The distance method earned up to 11% a year in US stocks from 1962 to 2002 (Gatev, Goetzmann and Rouwenhorst, 2006), but monthly returns fell from 0.86% to 0.37% to 0.24% in later periods (Do and Faff, 2010): grade B, decayed. Costs are paid on two legs, plus the borrow on the short.",
    ],
    example: "Spread 2.60 above its mean, standard deviation 1.20: z = 2.17, sell the spread. With θ = 0.1 a day, half-life = 0.693 ÷ 0.1 = 6.9 days, so the time stop is about 14 days.",
    related: ["cointegration", "structural-break", "mean-reversion", "short-selling"],
    missions: ["M07"],
    lessons: ["3.13.5"],
  },
  {
    id: "cointegration",
    name: "Cointegration",
    category: "portfolio_exposure",
    summary: "A relationship in which a combination of two series stays stationary even though each one wanders.",
    body: [
      "Two prices can each wander like random walks while A − β × B keeps returning to a stable mean. That's cointegration, and it's what makes a spread trade possible. Correlation measures daily co-movement and says nothing about whether a gap closes.",
      "Test the spread itself for stationarity on formation data, then measure its half-life. A pair that tests cointegrated can still break later, so the stop stays.",
    ],
    example: "Seeded pairs: one with prices correlated 0.96 had a spread test t of −2.05 and drifted to 6.2 standard deviations; one correlated 0.93 tested at −3.83, with a 5.9-day half-life, and kept coming back.",
    related: ["pairs-trading", "spurious-cycles", "correlation-instability"],
    missions: [],
    lessons: ["3.13.5"],
  },
  {
    id: "structural-break",
    name: "Structural break",
    category: "risk_management",
    summary: "A lasting change that ends a previously stable relationship.",
    body: [
      "A merger, a new business model or a regime change can rewire the link between two prices or the behaviour of one. After it, estimates from the past, the mean, the hedge ratio, the half-life, no longer apply.",
      "A spread blowing through its stop on news is the classic sign. Exit at the stop, don't add, and re-test the relationship on new data before trading it again.",
    ],
    example: "Short a spread at z = 2.21; merger news sends it to 3.92. Exiting there costs 1.71 standard deviations; holding to the 14-day time stop would have cost 3.50.",
    related: ["pairs-trading", "correlation-instability", "market-regime"],
    missions: ["M07"],
    lessons: ["3.13.5"],
  },
  {
    id: "event-study",
    name: "Event study",
    category: "scenario_analysis",
    summary: "Measuring the average abnormal return around many similar events, with a confidence band.",
    body: [
      "For each event, subtract what the market explains (beta × market return) to get the abnormal return, then add it up over a window for the CAR. Average across many events and report the band: one event is an anecdote.",
      "Event effects decay once known. Post-earnings drift is much weaker since publication; the pre-FOMC drift (49 bp in the 24 hours before announcements, 1994–2011) is less reliable since. Write the rule that will stop the strategy before the first trade.",
    ],
    example: "A stock rises 6% while the index rises 1% and its beta is 1.2: abnormal return 6% − 1.2% = 4.8%. In 40 seeded good-news events, the drift after day 0 was +2.58% with a band of −0.24% to +5.40%: not distinguishable from zero.",
    related: ["pre-event-drift", "news-surprise", "sample-size"],
    missions: ["M10"],
    lessons: ["3.13.6"],
  },
  {
    id: "strategy-crowding",
    name: "Strategy crowding",
    category: "risk_management",
    summary: "Many traders holding the same strategy, which shrinks its edge and makes losses arrive together.",
    body: [
      "As a strategy becomes known, more money runs it: its edge shrinks, and its holders share the same exit. When a shock forces some of them to sell, prices move against all of them, triggering more selling.",
      "Published edges shrink: across 97 predictors, returns were 26% lower out of sample and 58% lower after publication (McLean and Pontiff, 2016). Crowded trades fell together around LTCM in 1998, in momentum in 2009 and in the yen carry unwind of 2024.",
    ],
    example: "A seeded R0 control: the best 10 of 200 no-edge strategies showed a Sharpe ratio of 0.87 in-sample and 0.08 out of sample. With a real edge, the best 10 fell from 1.73 to 0.85.",
    related: ["carry-unwind", "evidence-grades", "strategy-regime-fit"],
    missions: [],
    lessons: ["3.13.7"],
  },
  {
    id: "evidence-appraisal",
    name: "Evidence appraisal",
    category: "decision_making",
    summary: "Grading a strategy claim by its sample, costs, trials, out-of-sample tests, replication and mechanism.",
    body: [
      "Ten checks: sample; status (working paper or peer-reviewed); a true out-of-sample test; realistic costs and fills; the number of trials; sensitivity to parameters; independent replication; the mechanism and who's on the other side; capacity; and decay after publication.",
      "The result is a grade from Mechanic to F, defended in two sentences: what the evidence shows and what's missing. Without independent replication, a claim rarely rises above C.",
    ],
    example: "An opening range breakout paper reported over 1,600% net and a Sharpe of 2.81. An independent replication found the gross edge, about +0.13R a trade, but nothing distinguishable from zero after costs: grade C.",
    related: ["evidence-grades", "performance-claims", "falsifiability"],
    missions: ["M06"],
    lessons: ["3.13.8"],
  },
];

export const UNIT_3_13: UnitContent = {
  lessons: [L1, L2, L3, L4, L5, L6, L7, L8],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
