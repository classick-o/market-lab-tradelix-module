import type { CandleData, ChartLayer, ChartSpec, Concept, GlossaryTerm, Lesson, MarkRole, Question, TaskData, UnitContent } from "../../types";

/** Unit 3.6 · Macro and intermarket (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */

// Every macro relationship below is drawn from synthetic series (generated and checked by a script, seeds noted);
// real-world relationships are stated with their evidence grade and as unstable over time.

/** One candle, in price units with 2 decimals. */
const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });
/** n flat candles: they only set the time axis of a chart that draws its layers alone. */
const blank = (n: number, p: number): CandleData[] => Array.from({ length: n }, () => k(p, p, p, p));
/** A line layer. */
const ln = (values: (number | null)[], role: MarkRole, label?: string, dashed?: boolean): ChartLayer => ({ kind: "line", values, role, ...(label ? { label } : {}), ...(dashed ? { dashed } : {}) });
/** A marker at a price. */
const dot = (index: number, price: number, label?: string, role: MarkRole = "concept"): ChartLayer => ({ kind: "marker", index, price, role, ...(label ? { label } : {}) });
/** A path through (index, price) points. */
const path = (pts: [number, number][], role: MarkRole, label?: string, dashed?: boolean): ChartLayer => ({
  kind: "path",
  points: pts.map(([index, price]) => ({ index, price })),
  role,
  ...(label ? { label } : {}),
  ...(dashed ? { dashed } : {}),
});
/** A horizontal reference line without a price chip. */
const rule = (price: number, label?: string): ChartLayer => ({ kind: "level", price, role: "neutral", chip: false, ...(label ? { label } : {}) });
/** `values` placed from index `from` in a series of length n, nulls elsewhere. */
const at = (n: number, from: number, values: number[]): (number | null)[] => Array.from({ length: n }, (_, i) => (i >= from && i < from + values.length ? values[i - from] : null));

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

/** 3.6.5 B2: 60 synthetic weeks of LB10 (%), 3.83 at week 0, 4.61 at week 30, 4.17 at week 59. gen.mjs seed 3605. */
const CG_LB10 = [3.83, 3.85, 3.82, 3.84, 3.94, 3.96, 4.05, 4, 4.05, 4.05, 4.06, 4.1, 4.19, 4.14, 4.14, 4.15, 4.16, 4.21, 4.27, 4.24, 4.35, 4.3, 4.4, 4.39, 4.43, 4.48, 4.48, 4.66, 4.44, 4.63, 4.61, 4.54, 4.54, 4.6, 4.52, 4.53, 4.54, 4.54, 4.43, 4.44, 4.43, 4.36, 4.42, 4.33, 4.39, 4.36, 4.3, 4.22, 4.27, 4.24, 4.27, 4.23, 4.16, 4.23, 4.24, 4.18, 4.17, 4.13, 4.11, 4.17];
/** 3.6.5 B2: the copper–gold ratio, scaled to share LB10's axis. It tracks LB10 except weeks 38–47: 4.42 at week 38, 3.97 at week 43. */
const CG_RATIO = [3.81, 3.82, 3.84, 3.91, 3.88, 3.91, 3.9, 3.96, 3.93, 4.12, 4.13, 3.97, 4.06, 4.1, 4.2, 4.3, 4.22, 4.25, 4.25, 4.26, 4.31, 4.44, 4.35, 4.5, 4.48, 4.53, 4.41, 4.55, 4.51, 4.62, 4.73, 4.66, 4.64, 4.52, 4.67, 4.47, 4.49, 4.46, 4.42, 4.2, 4.07, 4.04, 3.98, 3.97, 3.98, 4.05, 4.19, 4.22, 4.37, 4.27, 4.15, 4.25, 4.13, 4.23, 4.3, 4.17, 4.07, 4.19, 4.02, 4.06];
/** 3.6.6 B1: 40 synthetic days, each reading mapped onto 0 (calm) to 100 (stress) with fixed ranges. gen.mjs seed 3606. */
const RORO_VOL = [14, 12, 17, 15, 17, 14, 20, 17, 17, 14, 15, 13, 10, 11, 11, 10, 11, 12, 12, 15, 13, 16, 16, 16, 17, 19, 33, 48, 59, 77, 91, 92, 83, 75, 71, 67, 65, 59, 52, 49];
const RORO_SPR = [7, 7, 8, 8, 7, 9, 8, 8, 9, 9, 7, 7, 6, 6, 6, 6, 5, 6, 7, 5, 5, 6, 5, 5, 6, 19, 33, 48, 59, 73, 87, 83, 80, 76, 73, 67, 65, 60, 59, 55];
const RORO_LFX = [19, 19, 21, 18, 17, 17, 18, 17, 18, 19, 18, 19, 21, 19, 19, 17, 21, 20, 21, 22, 21, 24, 23, 21, 23, 30, 40, 49, 61, 71, 80, 75, 76, 76, 77, 73, 71, 69, 69, 67];
/** The meter: the average of the three. 60 on day 28, peak 86 on day 30, 57 on day 39. */
const RORO_METER = [13, 13, 15, 14, 14, 13, 15, 14, 15, 14, 13, 13, 12, 12, 12, 11, 12, 13, 13, 14, 13, 15, 15, 14, 15, 23, 35, 48, 60, 74, 86, 83, 80, 76, 74, 69, 67, 63, 60, 57];
/** 3.6.7 B1: 48 synthetic months of activity relative to trend (%), from −3.00 at the trough to +2.50 at month 35. */
const CYCLE = [-3, -2.82, -2.58, -2.29, -1.98, -1.67, -1.4, -1.11, -0.83, -0.55, -0.28, 0, 0.16, 0.32, 0.49, 0.66, 0.83, 0.99, 1.14, 1.28, 1.4, 1.51, 1.61, 1.7, 1.78, 1.85, 1.91, 1.98, 2.04, 2.1, 2.19, 2.29, 2.38, 2.44, 2.49, 2.5, 2.46, 2.38, 2.22, 2, 1.69, 1.31, 0.87, 0.4, -0.16, -0.8, -1.39, -1.8];
/** 3.6.7 B3: 36 synthetic months of PMI new orders. Months 26–29: 56.0, 54.0, 53.0, 52.0; then back to 55.6 by month 35. */
const PMI = [50, 50.1, 50.3, 50.5, 50.8, 51.2, 51.7, 52.2, 52.8, 53.4, 54, 54.4, 54.8, 55.1, 55.3, 55.4, 55.5, 55.7, 55.8, 56.1, 56.4, 56.5, 56.4, 56.3, 56.2, 56.1, 56, 54, 53, 52, 52.6, 53.2, 53.8, 54.4, 55, 55.6];
/**
 * 3.6.8: rolling correlations of 160 synthetic LABX and LBND returns (gen.mjs seed 2). True correlation −0.5 to bar 79,
 * +0.6 from bar 80. The 20-bar line peaks at -0.14 (bar 50) before the switch and first closes above 0 at bar 89;
 * the 60-bar line first closes above 0 at bar 115.
 */
const C20 = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, -0.49, -0.69, -0.77, -0.79, -0.75, -0.79, -0.78, -0.72, -0.78, -0.79, -0.86, -0.86, -0.88, -0.87, -0.84, -0.83, -0.83, -0.8, -0.74, -0.75, -0.72, -0.7, -0.72, -0.67, -0.44, -0.42, -0.44, -0.46, -0.36, -0.32, -0.26, -0.14, -0.23, -0.34, -0.31, -0.24, -0.21, -0.22, -0.24, -0.27, -0.33, -0.33, -0.27, -0.31, -0.58, -0.59, -0.61, -0.62, -0.64, -0.66, -0.65, -0.66, -0.64, -0.61, -0.69, -0.72, -0.73, -0.69, -0.79, -0.77, -0.75, -0.75, -0.68, -0.65, -0.58, -0.44, -0.29, -0.13, -0.1, -0.05, 0.01, 0.02, 0.11, 0.15, 0.18, 0.23, 0.23, 0.32, 0.38, 0.41, 0.46, 0.49, 0.49, 0.59, 0.56, 0.57, 0.61, 0.58, 0.51, 0.51, 0.5, 0.44, 0.48, 0.56, 0.56, 0.51, 0.63, 0.65, 0.64, 0.64, 0.7, 0.64, 0.66, 0.61, 0.59, 0.67, 0.64, 0.64, 0.7, 0.7, 0.73, 0.77, 0.76, 0.76, 0.76, 0.72, 0.75, 0.75, 0.72, 0.68, 0.69, 0.71, 0.71, 0.7, 0.7, 0.67, 0.67, 0.72, 0.7, 0.72, 0.66, 0.64, 0.64, 0.64, 0.71, 0.74, 0.71, 0.65, 0.61, 0.64, 0.63];
const C60 = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, -0.49, -0.52, -0.53, -0.53, -0.54, -0.54, -0.56, -0.56, -0.56, -0.56, -0.58, -0.58, -0.6, -0.59, -0.6, -0.59, -0.59, -0.56, -0.56, -0.56, -0.55, -0.54, -0.52, -0.51, -0.5, -0.45, -0.45, -0.45, -0.39, -0.37, -0.34, -0.31, -0.3, -0.3, -0.3, -0.26, -0.25, -0.24, -0.25, -0.23, -0.23, -0.22, -0.18, -0.13, -0.21, -0.21, -0.17, -0.17, -0.18, -0.17, -0.17, -0.18, -0.09, -0.03, 0, -0.01, 0.03, 0.08, 0.07, 0.11, 0.18, 0.17, 0.2, 0.21, 0.22, 0.28, 0.34, 0.37, 0.39, 0.42, 0.47, 0.48, 0.52, 0.54, 0.56, 0.55, 0.6, 0.62, 0.61, 0.61, 0.63, 0.62, 0.62, 0.62, 0.62, 0.63, 0.64, 0.65, 0.65, 0.66, 0.66, 0.66, 0.66, 0.67, 0.69, 0.69, 0.7, 0.68, 0.66, 0.66, 0.66];

/** 3.6.2 B1: three curves on 9 evenly spaced slots; maturities 3M, 2Y, 5Y, 10Y, 30Y sit on slots 0, 2, 4, 6, 8 (not to scale). */
const CURVE_NORMAL: [number, number][] = [
  [0, 3.0],
  [2, 3.5],
  [4, 3.9],
  [6, 4.3],
  [8, 4.6],
];
const CURVE_FLAT: [number, number][] = [
  [0, 4.0],
  [2, 4.05],
  [4, 4.05],
  [6, 4.05],
  [8, 4.1],
];
/** Matches 3.6.2 B2: 3-month 5.10%, LB2 4.80%, LB10 4.20%. */
const CURVE_INVERTED: [number, number][] = [
  [0, 5.1],
  [2, 4.8],
  [4, 4.4],
  [6, 4.2],
  [8, 4.35],
];
const CURVE_CHART: ChartSpec = {
  candles: blank(9, 4),
  hideCandles: true,
  range: [2.6, 5.4],
  height: 220,
  describe: "Three yield curves by maturity. Normal: 3-month 3.00% rising to 30-year 4.60%. Flat: about 4.05% everywhere. Inverted: 3-month 5.10%, 2-year 4.80%, 10-year 4.20%, 30-year 4.35%.",
};

/** 3.6.3 B2: LABX around a payrolls beat at index 5 (100.00). Inflation-fight: 98.80 by index 12 (−1.20%). Growth scare: 101.00 (+1.00%). */
const REGIME_PRE = [100.0, 100.04, 99.98, 100.02, 99.98, 100.0];
const REGIME_FIGHT = [100.0, 99.5, 99.2, 99.0, 98.9, 98.85, 98.8, 98.8];
const REGIME_SCARE = [100.0, 100.5, 100.7, 100.8, 100.9, 100.95, 101.0, 101.0];
const REGIME_CHART: ChartSpec = {
  candles: blank(13, 100),
  hideCandles: true,
  range: [98.4, 101.4],
  height: 220,
  describe: "LABX at 100.00 before a payrolls beat. In the inflation-fight regime it falls to 98.80; in the growth-scare regime it rises to 101.00.",
};

/**
 * 3.6.3 B5: a pre-event dashboard, four panels stacked on one 0–40 scale: CPI trend (30–40), dot-plot median (20–30),
 * curve slope (10–20) and LABX's reaction to the last strong data (0–10), where it drops after index 11 (−1.1%).
 */
const DASH_CPI = [34.6, 34.9, 35.2, 35.0, 34.8, 35.1, 35.3, 35.0, 34.7, 35.0, 35.2, 34.9, 35.1, 35.3, 35.0, 34.8, 35.0, 35.2, 35.1, 34.9, 35.0, 35.2, 35.0, 35.1];
const DASH_DOTS = Array.from({ length: 24 }, () => 25);
const DASH_CURVE = [15.4, 15.2, 15.0, 15.1, 14.9, 15.0, 14.8, 15.0, 15.2, 15.1, 14.9, 15.0, 15.1, 14.8, 14.9, 15.0, 15.1, 15.0, 14.9, 15.0, 15.2, 15.0, 14.9, 15.0];
const DASH_REACT = [6.0, 6.1, 5.9, 6.0, 6.2, 6.0, 5.9, 6.1, 6.0, 6.1, 6.0, 6.1, 4.6, 4.0, 3.7, 3.8, 3.6, 3.7, 3.5, 3.6, 3.5, 3.4, 3.5, 3.5];
const DASHBOARD: ChartSpec = {
  candles: blank(24, 20),
  hideCandles: true,
  range: [0, 40],
  height: 280,
  layers: [
    rule(10),
    rule(20),
    rule(30),
    ln(DASH_CPI, "concept", "CPI 3.3% A YEAR, FLAT"),
    ln(DASH_DOTS, "neutral", "DOT MEDIAN: NO CHANGE"),
    ln(DASH_CURVE, "neutral", "10Y–2Y NEAR 0"),
    ln(DASH_REACT, "down", "LABX ON STRONG DATA −1.1%"),
    dot(12, 4.6, "STRONG RETAIL SALES", "accent"),
  ],
  describe: "Four panels. CPI at 3.3% a year, flat. Dot-plot median unchanged. 10y–2y spread near zero. Last strong retail sales report: LABX fell 1.1%.",
};

/** 3.6.4 B1: LDX against the state of the world, left (US boom) to right (global crisis). A sketch, not data. */
const SMILE_LEFT: [number, number][] = [
  [0, 104.5],
  [2, 102.6],
  [4, 101.0],
  [6, 99.9],
];
const SMILE_MID: [number, number][] = [
  [6, 99.9],
  [8, 99.2],
  [9, 99.0],
  [10, 99.2],
  [12, 99.9],
];
const SMILE_RIGHT: [number, number][] = [
  [12, 99.9],
  [14, 101.0],
  [16, 102.6],
  [18, 104.5],
];
const SMILE_CHART: ChartSpec = {
  candles: blank(19, 101),
  hideCandles: true,
  range: [97.5, 105.5],
  height: 220,
  describe: "The dollar smile: LDX high on the left (US boom), low in the middle (synchronised global growth) and high again on the right (global crisis).",
};

/** 3.6.4 B3: LDX in risk-off. Up to 100.60 by index 9 (visible); then, as VFUN jumps, down to 98.60 by index 17. */
const LDX_UNWIND: CandleData[] = [
  k(100.0, 100.08, 99.94, 100.04),
  k(100.04, 100.12, 99.98, 100.08),
  k(100.08, 100.2, 100.02, 100.16),
  k(100.16, 100.26, 100.1, 100.22),
  k(100.22, 100.34, 100.16, 100.3),
  k(100.3, 100.42, 100.24, 100.38),
  k(100.38, 100.5, 100.3, 100.44),
  k(100.44, 100.56, 100.36, 100.5),
  k(100.5, 100.64, 100.42, 100.58),
  k(100.58, 100.66, 100.48, 100.6),
  k(100.6, 100.62, 100.1, 100.18),
  k(100.18, 100.24, 99.6, 99.7),
  k(99.7, 99.8, 99.2, 99.3),
  k(99.3, 99.42, 98.9, 99.0),
  k(99.0, 99.1, 98.6, 98.7),
  k(98.7, 98.9, 98.5, 98.8),
  k(98.8, 98.86, 98.5, 98.6),
  k(98.6, 98.74, 98.46, 98.6),
];

const CG_CHART: ChartSpec = {
  candles: blank(60, 4),
  hideCandles: true,
  range: [3.6, 4.9],
  height: 220,
  describe: "60 synthetic weeks. LB10 rises from 3.83% to 4.61% by week 30, then eases to 4.17%. The scaled copper–gold ratio tracks it, except in weeks 38 to 47, when it dips to 3.97 while LB10 stays near 4.4.",
};

const RORO_CHART: ChartSpec = {
  candles: blank(40, 50),
  hideCandles: true,
  range: [0, 100],
  height: 240,
  describe:
    "40 synthetic days on a 0–100 stress scale. Calm for 25 days with the meter between 11 and 15; then volatility, credit spreads and LFX all turn, and the meter reaches 60 on day 28 and 86 on day 30.",
};

/** 3.6.7 B1: activity relative to trend with the four textbook phases. */
const CYCLE_CHART: ChartSpec = {
  candles: blank(48, 0),
  hideCandles: true,
  range: [-4, 4],
  height: 220,
  layers: [rule(0, "TREND"), ln(CYCLE, "accent", "ACTIVITY")],
  describe: "48 synthetic months: activity rises from 3.00% below trend to 2.50% above it by month 35, then falls to 1.80% below trend by month 47.",
};

/** 3.6.7 B3: PMI new orders as a line; the veil hides months 30–35. */
const PMI_CHART: ChartSpec = {
  candles: PMI.map((v) => k(v, v, v, v)),
  style: "line",
  visible: 30,
  range: [46, 60],
  height: 220,
  layers: [rule(50, "50 = NO CHANGE")],
  describe: "36 synthetic months of PMI new orders: from 50.0 up to 56.5, then 56.0, 54.0, 53.0 and 52.0 in months 26 to 29. Under the veil, a rebound to 55.6 by month 35.",
};

/** 3.6.8: the two rolling correlations on one −1 to +1 scale. */
const CORR_CHART: ChartSpec = {
  candles: blank(160, 0),
  hideCandles: true,
  range: [-1, 1],
  height: 240,
  layers: [rule(0, "0"), ln(C20, "accent", "20-BAR"), ln(C60, "concept", "60-BAR")],
  describe:
    "Rolling correlations of 160 synthetic bars. Before bar 80 the 20-bar line swings between −0.88 and −0.14 and the 60-bar line stays near −0.55. Both then rise above zero: the 20-bar line at bar 89, the 60-bar line at bar 115.",
};


// ─── Card sets for the sorting tasks ────────────────────────────────────────

/** 3.6.2 Try: a synthetic rate cycle in six phases; LB2 and LB10 changes in percentage points. */
const CURVE_CARDS = cardSort(
  [
    { id: "bull-steep", label: "Bull steepener", what: "A bull steepener means yields fall, the short end more." },
    { id: "bull-flat", label: "Bull flattener", what: "A bull flattener means yields fall, the long end more." },
    { id: "bear-steep", label: "Bear steepener", what: "A bear steepener means yields rise, the long end more." },
    { id: "bear-flat", label: "Bear flattener", what: "A bear flattener means yields rise, the short end more." },
  ],
  [
    {
      id: "a",
      text: "**Phase 1** · Recovery, bond supply rising · LB2 **+0.10** · LB10 **+0.50**",
      answer: "bear-steep",
      correct: "Bear steepener: both yields rose, LB10 more. The 10y–2y spread widened by 0.40.",
      clue: "Here both rose, LB10 more: the spread widened by 0.40.",
    },
    {
      id: "b",
      text: "**Phase 2** · LCB starts hiking · LB2 **+0.70** · LB10 **+0.30**",
      answer: "bear-flat",
      correct: "Bear flattener: both rose, LB2 more. Hikes priced in lift the short end most; the spread narrowed by 0.40.",
      clue: "Here both rose, LB2 more: the spread narrowed by 0.40.",
    },
    {
      id: "c",
      text: "**Phase 3** · Growth scare, hikes on hold · LB2 **−0.05** · LB10 **−0.40**",
      answer: "bull-flat",
      correct: "Bull flattener: both fell, LB10 more. The long end rallied on growth fears; the spread narrowed by 0.35.",
      clue: "Here both fell, LB10 more: the spread narrowed by 0.35.",
    },
    {
      id: "d",
      text: "**Phase 4** · Cuts priced in · LB2 **−0.60** · LB10 **−0.20**",
      answer: "bull-steep",
      correct: "Bull steepener: both fell, LB2 more. The spread widened by 0.40.",
      clue: "Here both fell, LB2 more: the spread widened by 0.40.",
    },
    {
      id: "e",
      text: "**Phase 5** · Cuts delivered · LB2 **−0.90** · LB10 **−0.35**",
      answer: "bull-steep",
      correct: "Bull steepener again: LB2 fell 0.55 more than LB10, and the spread widened by 0.55.",
      clue: "Here both fell, LB2 more: the spread widened by 0.55.",
    },
    {
      id: "f",
      text: "**Phase 6** · Recovery returns · LB2 **+0.15** · LB10 **+0.45**",
      answer: "bear-steep",
      correct: "Bear steepener: both rose, LB10 more. The spread widened by 0.30, and the cycle starts over.",
      clue: "Here both rose, LB10 more: the spread widened by 0.30.",
    },
  ],
);

/** 3.6.3 Try: a hot CPI print (z = +2.0) in the inflation-fight regime, with that regime's simulator reactions. */
const REGIME_CARDS: TaskData = {
  options: [
    { id: "up", label: "Up" },
    { id: "down", label: "Down" },
  ],
  cards: [
    {
      id: "labx",
      text: "**LABX**, the stock index",
      answer: "down",
      correct: "Down: more hikes raise the discount rate, and no growth news offsets it.",
      rationales: { up: "Up is the growth-scare reading. Here inflation is the fear, so a hot print means more hikes, and that weighs on stocks." },
    },
    {
      id: "lb2",
      text: "**LB2**, the 2-year yield",
      answer: "up",
      correct: "Up: the 2-year tracks expected policy rates, and a hot print adds hikes.",
      rationales: { down: "Down would mean fewer hikes expected. In an inflation fight, a hot print adds hikes, and the 2-year yield follows them up." },
    },
    {
      id: "ldx",
      text: "**LDX**, the dollar index",
      answer: "up",
      correct: "Up: more LCB hikes widen the rate differential in vUSD's favour.",
      rationales: { down: "More hikes widen the rate gap in vUSD's favour, which tends to lift LDX." },
    },
    {
      id: "lgld",
      text: "**LGLD**, gold",
      answer: "down",
      correct: "Down: higher real yields and a firmer LDX both weigh on an asset that pays nothing.",
      rationales: { up: "Gold pays no interest. Higher real yields and a firmer LDX make holding it costlier, so in this regime it tends to fall." },
    },
  ],
};

/** 3.6.4 Try: four synthetic world states; one breaks the smile. */
const SMILE_CARDS = cardSort(
  [
    { id: "left", label: "Left side: LDX up (US outperforms)", what: "The left side is a US boom: US growth and rates ahead of the rest." },
    { id: "bottom", label: "Bottom: LDX down (synchronised growth)", what: "The bottom is growth everywhere at once, in calm markets." },
    { id: "right", label: "Right side: LDX up (global crisis)", what: "The right side is a global crisis, with demand for safety and for dollars." },
    { id: "off", label: "Off the smile: LDX down in a crisis", what: "Off the smile is risk-off led by a jump in a funding currency." },
  ],
  [
    {
      id: "a",
      text: "US growth **3.5%**, the rest of the world **1.0%**. LCB is hiking; the other central banks hold.",
      answer: "left",
      correct: "Left side: US growth and rates pull capital in, and LDX tends to rise.",
      clue: "Here the US is far ahead, and its rates are rising.",
    },
    {
      id: "b",
      text: "Growth picks up across every major economy. Volatility is low; commodity prices rise.",
      answer: "bottom",
      correct: "Bottom: returns improve abroad, money flows out of vUSD, and LDX tends to fall.",
      clue: "Here growth is broad and markets are calm.",
    },
    {
      id: "c",
      text: "A large bank fails abroad. Credit spreads widen fast; LABX falls **8%** in a week.",
      answer: "right",
      correct: "Right side: a global crisis drives demand for safety and for dollars to repay dollar debts.",
      clue: "Here a global crisis is under way, and nothing points to a funding-currency squeeze.",
    },
    {
      id: "d",
      text: "VFUN's central bank hikes by surprise. VFUN jumps **6%**; carry positions are cut; LABX falls.",
      answer: "off",
      correct: "Off the smile: carry traders buy back VFUN, which weighs heavily in LDX's basket, so LDX falls despite the stress.",
      clue: "Here the stress starts with a jump in VFUN, the funding currency.",
    },
  ],
);

/** 3.6.7 Try: twelve synthetic months; hidden phases late (1–3), recession (4–6), early (7–9), mid (10–12). */
const CYCLE_CARDS = cardSort(
  [
    { id: "early", label: "Early", what: "Early fits new orders rebounding from lows, claims falling from a peak, a steep curve and narrowing spreads." },
    { id: "mid", label: "Mid", what: "Mid fits steady new orders above 50, low and flat claims, a positive curve and tight, stable spreads." },
    { id: "late", label: "Late", what: "Late fits new orders falling from high levels, claims turning up, a flat or inverted curve and spreads starting to widen." },
    { id: "recession", label: "Recession", what: "Recession fits new orders well below 50, claims rising fast, a curve steepening as cuts begin and wide spreads." },
  ],
  [
    {
      id: "m1",
      text: "**Month 1** · new orders **53**, down from 57 · claims **210K**, off their low · 10y–2y **+0.10**, flattening · spreads **1.20%**, starting to widen",
      answer: "late",
      correct: "Late: orders falling from high levels, claims turning up, a flat curve, spreads starting to widen.",
      clue: "Here orders are falling from a high, claims are turning up and the curve is nearly flat.",
    },
    {
      id: "m2",
      text: "**Month 2** · new orders **51**, falling · claims **225K**, rising · 10y–2y **−0.20**, inverted · spreads **1.40%**, widening",
      answer: "late",
      correct: "Late: still above 50 but falling, with an inverted curve and widening spreads.",
      clue: "Here orders are still above 50 but falling, and the curve has inverted.",
    },
    {
      id: "m3",
      text: "**Month 3** · new orders **50**, falling · claims **235K**, rising · 10y–2y **−0.40**, inverted · spreads **1.60%**, widening",
      answer: "late",
      correct: "Late, close to the turn: orders at 50, the curve inverted, spreads widening.",
      clue: "Here orders have slid to 50, but not yet well below it, and the curve is inverted.",
    },
    {
      id: "m4",
      text: "**Month 4** · new orders **46**, falling fast · claims **300K**, rising fast · 10y–2y **−0.10**, steepening as cuts begin · spreads **2.60%**, wide",
      answer: "recession",
      correct: "Recession: orders well below 50, claims jumping, cuts steepening the curve, wide spreads.",
      clue: "Here orders are well below 50, claims are jumping and spreads are wide.",
    },
    {
      id: "m5",
      text: "**Month 5** · new orders **43**, falling · claims **360K**, rising · 10y–2y **+0.40**, steepening fast · spreads **3.40%**, wider",
      answer: "recession",
      correct: "Recession: the worst readings so far, with the curve steepening as the bank cuts.",
      clue: "Here every reading is still getting worse.",
    },
    {
      id: "m6",
      text: "**Month 6** · new orders **42** · claims **390K**, still rising · 10y–2y **+0.90** · spreads **3.60%**, still widening",
      answer: "recession",
      correct: "Recession: nothing has turned yet. Claims and spreads are still getting worse.",
      clue: "Here claims and spreads are still getting worse; nothing has turned yet.",
    },
    {
      id: "m7",
      text: "**Month 7** · new orders **47**, up 5 points in two months · claims **350K**, falling from the peak · 10y–2y **+1.60**, steep · spreads **2.80%**, narrowing",
      answer: "early",
      correct: "Early: orders still below 50 but rebounding fast, claims past their peak, a steep curve.",
      clue: "Here orders are below 50 but rebounding fast, and claims and spreads have turned.",
    },
    {
      id: "m8",
      text: "**Month 8** · new orders **51**, rising fast · claims **310K**, falling · 10y–2y **+1.80** · spreads **2.20%**, narrowing",
      answer: "early",
      correct: "Early: a fast rebound through 50, falling claims, narrowing spreads.",
      clue: "Here orders are rising fast through 50 from a low, with claims and spreads improving.",
    },
    {
      id: "m9",
      text: "**Month 9** · new orders **54**, rising fast · claims **280K**, falling · 10y–2y **+1.90**, steepest of the cycle · spreads **1.80%**, narrowing",
      answer: "early",
      correct: "Early, still: everything is improving quickly, and the curve is at its steepest.",
      clue: "Here everything is still improving quickly from the trough.",
    },
    {
      id: "m10",
      text: "**Month 10** · new orders **55**, steady · claims **240K**, low and flat · 10y–2y **+1.40**, flattening slowly · spreads **1.30%**, tight and stable",
      answer: "mid",
      correct: "Mid: steady orders above 50, low claims, tight and stable spreads.",
      clue: "Here the readings are steady rather than rebounding or deteriorating.",
    },
    {
      id: "m11",
      text: "**Month 11** · new orders **56**, steady · claims **230K**, flat · 10y–2y **+1.20** · spreads **1.20%**, stable",
      answer: "mid",
      correct: "Mid: steady growth on every reading.",
      clue: "Here every reading is steady.",
    },
    {
      id: "m12",
      text: "**Month 12** · new orders **55**, steady · claims **225K**, flat · 10y–2y **+1.00** · spreads **1.15%**, stable",
      answer: "mid",
      correct: "Mid: still steady. The flattening curve is the first thing to watch for the late phase.",
      clue: "Here the readings are steady; only the curve is slowly flattening.",
    },
  ],
);


// ─── Lessons ────────────────────────────────────────────────────────────────

const L361: Lesson = {
  id: "3.6.1",
  title: "Rates: the price of money",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Bond prices fall when yields rise, long maturities most; subtract expected inflation for the real yield; and rate differentials push currencies.",
  objectives: [
    "Convert between bond price and yield, and explain why long bonds move more for the same change in yield.",
    "Compute a real yield from a nominal yield and expected inflation.",
    "Explain how a change in the rate differential moves a currency pair.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: unexpected event" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "3.6",
    courseId: "3.6.1",
    hook: {
      prompt: "The 10-year yield rises from 4% to 5%. By roughly how much does a 10-year zero-coupon bond fall in price?",
      control: {
        kind: "slider",
        min: 0,
        max: 20,
        step: 0.1,
        unit: "%",
        start: 0,
        answer: 9.1,
        tolerance: 0.5,
        feedback: [
          { from: 0, to: 8.5, text: "More than that. The price goes from 100 ÷ 1.04^10 = 67.56 to 100 ÷ 1.05^10 = 61.39." },
          { from: 9.7, to: 20, text: "Less than that: 67.56 to 61.39 is −9.1%. A 30-year zero would lose about 25%." },
        ],
      },
      compare: "You said {yours}%. At 4% the 10-year zero costs 67.56; at 5%, 61.39: −9.1%. A 2-year zero loses only 1.9%.",
      concept: "bond-price-yield",
    },
    learn: [
      {
        kind: "explain",
        title: "The price of a promise",
        text: "A [[zero-coupon-bond]] pays 100 at maturity and nothing before. Its price today is 100 ÷ (1 + y)^n, where y is its [[yield]] and n the years left. Raise y and the same 100 is worth less today. Price and yield move in opposite directions: that's arithmetic, not a market tendency.",
      },
      {
        kind: "worked",
        title: "One point of yield",
        lines: [
          "10-year zero at a 4% yield: 100 ÷ 1.04^10 = 67.56.",
          "At 5%: 100 ÷ 1.05^10 = 61.39.",
          "A 2-year zero over the same move: 92.46 → 90.70, −1.9%.",
          "10-year change, in %: (61.39 − 67.56) ÷ 67.56 = ?",
        ],
        ask: {
          answer: -9.1,
          tolerance: 0.2,
          unit: "%",
          feedback: [
            { value: 9.1, text: "Right size, wrong sign: the price fell, so the change is negative." },
            { value: -6.17, text: "That's the change in price. Divide it by the starting price, 67.56, for the percentage." },
          ],
          correct: "Right: −9.1%, nearly five times the 2-year's −1.9%.",
        },
        after: "Each extra year is discounted once more, so a longer bond reacts more to the same change in yield. That sensitivity is called duration; its mechanics are in 3.14.",
        concept: "bond-price-yield",
      },
      {
        kind: "figure",
        title: "Longer means bigger",
        figure: {
          kind: "bars",
          bars: [
            { label: "2-year zero", value: -1.9, role: "down" },
            { label: "5-year zero", value: -4.7, role: "down" },
            { label: "10-year zero", value: -9.1, role: "down" },
            { label: "30-year zero", value: -24.9, role: "down" },
          ],
          unit: "%",
          steps: ["Yield up one point, from 4% to 5%: the 2-year zero loses 1.9%.", "The 5-year loses 4.7%, the 10-year 9.1%.", "The 30-year loses 24.9%, about 13 times the 2-year's loss."],
        },
        text: "Assets whose payoffs lie far in the future, such as fast-growing companies, tend to react like long bonds when yields jump. That part is a tendency (grade B), not arithmetic.",
        concept: "bond-price-yield",
      },
      {
        kind: "worked",
        title: "Real yield",
        lines: [
          "Nominal 10-year yield: 4.50%.",
          "Expected inflation over the same 10 years: 2.50%. Markets price it as [[breakeven-inflation]].",
          "Real yield ≈ nominal yield − expected inflation = ?",
        ],
        ask: {
          answer: 2.0,
          tolerance: 0.01,
          unit: "%",
          feedback: [{ value: 7, text: "Inflation eats into the yield: subtract it, don't add it." }],
          correct: "Right: about 2.00%. The exact figure, 1.045 ÷ 1.025 − 1, is 1.95%.",
        },
        after: "The [[real-yield]] is what lending pays after inflation. It's also the cost of holding assets that pay nothing, such as gold (3.6.5). This part is arithmetic too.",
        concept: "real-yield",
      },
      {
        kind: "explain",
        title: "Rates move currencies",
        text: "A currency pays its holder that currency's interest rate. If LCB lifts vUSD rates while VFUN's stay low, the [[rate-differential]] widens: holding vUSD pays more, money tends to flow in, and LFX, vUSD priced in VFUN, tends to rise. Grade B: what moves price is the change against expectations, and flows can dominate.",
      },
      {
        kind: "predict",
        title: "Why did yields rise?",
        prompt: "LB10 rises 0.30 in two worlds. In world A, because growth forecasts improved. In world B, because inflation fears rose. Where is LABX more likely to fall?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "World A: growth", feedback: "Better growth also lifts expected profits, which can outweigh the higher discount rate." },
            { id: "b", label: "World B: inflation", feedback: "Right." },
            { id: "same", label: "Equally in both: yields are yields", feedback: "The yield change is the same, but the reason differs, and the reason decides what happens to profits." },
          ],
          answer: "b",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "World A, growth: LABX", value: 1.2, role: "up" },
            { label: "World B, inflation: LABX", value: -1.8, role: "down" },
          ],
          unit: "%",
          steps: ["Synthetic replay, LB10 +0.30 in both. Growth: LABX +1.2%.", "Inflation: LABX −1.8%."],
        },
        reveal: "World B. In A, higher yields come with higher expected profits, and stocks can rise. In B, the discount rate goes up and profits don't. Before you read a yield move, ask why yields moved.",
        concept: "bond-price-yield",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "The most common slip: price and yield move in opposite directions. 'Yields up' means bond prices down. Translate every headline into prices before you act on it.",
      },
      {
        kind: "predict",
        title: "Price a bond",
        prompt: "Set the yield so the 10-year zero-coupon bond prices at 70.00.",
        control: {
          kind: "slider",
          min: 2,
          max: 6,
          step: 0.01,
          unit: "%",
          start: 4,
          answer: 3.63,
          tolerance: 0.02,
          feedback: [
            { from: 2, to: 3.6, text: "At that yield the price is above 70.00. Raise the yield to bring the price down." },
            { from: 3.66, to: 6, text: "At that yield the price is below 70.00. Lower the yield: price and yield move opposite." },
          ],
        },
        reveal: "3.63%: 100 ÷ 1.0363^10 = 70.01. At 4.00% the price was 67.56: a lower yield means a higher price.",
        concept: "bond-price-yield",
      },
    ],
    check: ["q-3.6.1-1", "q-3.6.1-2", "q-3.6.1-3"],
    recap: {
      takeaways: [
        "Price = 100 ÷ (1 + y)^n: yields up, prices down, and long bonds fall most.",
        "Real yield = nominal yield − expected inflation: 4.50% − 2.50% = 2.00%.",
        "A wider rate differential tends to lift the currency (grade B). Ask why yields moved.",
      ],
    },
  },
};

const L362: Lesson = {
  id: "3.6.2",
  title: "The yield curve",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Read the curve's slope and its four moves, and treat an inversion as a long-lead recession warning with false alarms, not a signal to sell stocks.",
  objectives: [
    "Read a yield curve and compute the 10y–2y and 10y–3m spreads.",
    "Name the four curve moves (bull or bear, steepener or flattener) from changes in short and long yields.",
    "Explain why an inversion is a long-lead recession signal with false positives, not a timing signal for equities.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
  ],
  script: {
    unit: "3.6",
    courseId: "3.6.2",
    hook: {
      prompt: "The 10y–2y curve has been inverted for a year, and there is still no recession. Is the signal broken?",
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes: a year is long enough", feedback: "Not by itself. Inversions have led recessions by roughly 6 to 24 months, so a quiet year is within the usual lag." },
          { id: "no", label: "Not necessarily", feedback: "Right. The lead is long and variable, and the signal has given false alarms too: a warning, not a timer." },
        ],
        answer: "no",
      },
      compare: "You chose {yours}. Inversions have come 6 to 24 months before US recessions, with false alarms. One quiet year neither breaks the signal nor confirms it.",
      concept: "yield-curve",
    },
    learn: [
      {
        kind: "figure",
        title: "Three shapes",
        figure: {
          kind: "chart",
          chart: CURVE_CHART,
          steps: [
            {
              text: "Normal: longer maturities pay more. 3-month 3.00%, 10-year 4.30%.",
              layers: [path(CURVE_NORMAL, "accent", "NORMAL"), dot(0, 3.0, "3M"), dot(2, 3.5, "2Y"), dot(4, 3.9, "5Y"), dot(6, 4.3, "10Y"), dot(8, 4.6, "30Y")],
            },
            { text: "Flat: every maturity pays about the same, near 4%.", layers: [path(CURVE_FLAT, "neutral", "FLAT", true)] },
            {
              text: "Inverted: 3-month 5.10%, above the 10-year's 4.20%. Rates are expected to fall.",
              layers: [path(CURVE_INVERTED, "down", "INVERTED"), { kind: "bracket", from: 4.2, to: 4.8, index: 6, label: "10Y–2Y −60 BP", role: "down" }],
            },
          ],
        },
        text: "A [[yield-curve]] plots government yields by maturity. Its slope reflects expected policy rates, growth and inflation, plus the [[term-premium]]. Maturities are spaced evenly here, not to scale.",
        concept: "yield-curve",
      },
      {
        kind: "worked",
        title: "Reading the spread",
        lines: [
          "Yields: 3-month 5.10%, LB2 4.80%, LB10 4.20%.",
          "10y–3m = 4.20 − 5.10 = −0.90 points = −90 bp.",
          "10y–2y = 4.20 − 4.80 = −0.60 points.",
          "In [[basis-point|basis points]], at 100 bp per point: ?",
        ],
        ask: {
          answer: -60,
          tolerance: 0,
          unit: "bp",
          feedback: [
            { value: 60, text: "The size is right, but the 10-year is below the 2-year: the spread is negative." },
            { value: -0.6, text: "That's in percentage points. Multiply by 100 for basis points." },
          ],
          correct: "Right: −60 bp. Both spreads are negative: the curve is inverted.",
        },
        after: "Traders quote the 10y–2y most; the New York Fed's recession model uses the 10y–3m. An [[inversion]] of either is the classic warning.",
        concept: "yield-curve",
      },
      {
        kind: "match",
        title: "Four curve moves",
        prompt: "Bull: yields fall (bond prices rise). Bear: yields rise. [[steepener|Steepener]]: the 10y–2y spread widens. [[flattener|Flattener]]: it narrows. Name each move.",
        pairs: [
          { left: "Short yields fall more than long ones", right: "Bull steepener", wrong: "Yields fall, so it's bull; the short end falls more, so the spread widens: a steepener." },
          { left: "Short yields rise more than long ones", right: "Bear flattener", wrong: "Yields rise, so it's bear; the short end rises more, so the spread narrows: a flattener." },
          { left: "Long yields rise more than short ones", right: "Bear steepener", wrong: "Yields rise, so it's bear; the long end rises more, so the spread widens: a steepener." },
          { left: "Long yields fall more than short ones", right: "Bull flattener", wrong: "Yields fall, so it's bull; the long end falls more, so the spread narrows: a flattener." },
        ],
        columns: ["What happened", "The move"],
        correct: "Right. Hikes being priced in usually bear-flatten the curve; cuts being priced in usually bull-steepen it.",
        concept: "curve-moves",
      },
      {
        kind: "explain",
        title: "The record",
        text: "**Evidence, grade B.** An inversion has come before every US recession since the 1950s, usually 6 to 24 months ahead, with false alarms such as the mid-1960s. Historical case: the 10y–2y inverted in mid-2022 for about two years, its longest stretch on record, and no recession had begun when it turned positive in 2024.",
      },
      {
        kind: "explain",
        title: "The term premium",
        text: "Long yields aren't only the average of expected short rates. They include a [[term-premium]]: extra pay for locking money up for years. Heavy bond supply, from big deficits and auctions, or a central bank shrinking its bond holdings can lift it. The curve then steepens with no change in the growth outlook, muddying the signal.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "'Inversion = sell stocks now' is the classic misuse: as a timing signal, grade D. In 2023 a New York Fed curve model put the odds of a recession within a year above 70%, its highest since the early 1980s. None began in that window. Use the curve for scenarios and risk budgets.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: CURVE_CARDS,
      goal: "A synthetic curve moves through six phases of a rate cycle. For each, read the changes in LB2 and LB10 and name the move.",
      success: { field: "solved", eq: 6 },
      correct: "All six named. Recovery bear-steepens the curve, hikes bear-flatten it, a growth scare bull-flattens it and cuts bull-steepen it.",
      hints: ["Bull or bear: did yields fall or rise?", "Steepener or flattener: did LB10 − LB2 widen or narrow?"],
      showMe: { solved: 6 },
      concept: "curve-moves",
    },
    check: ["q-3.6.2-1", "q-3.6.2-2", "q-3.6.2-3"],
    recap: {
      takeaways: [
        "10y–2y = the 10-year yield minus the 2-year: 4.20% − 4.80% = −60 bp.",
        "Bull or bear: yields fell or rose. Steepener or flattener: the spread widened or narrowed.",
        "An inversion warns of recession with a long, variable lag and false alarms. It doesn't time stocks.",
      ],
    },
  },
};

const L363: Lesson = {
  id: "3.6.3",
  title: "Inflation and regimes",
  topic: "scenario_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "The inflation backdrop sets the central bank's reaction, so the same data move assets differently and the stock–bond correlation can change sign.",
  objectives: [
    "Explain how the inflation backdrop changes a central bank's reaction function and therefore how assets react to the same data.",
    "Show that the stock–bond correlation depends on the monetary regime, using the 2022 case.",
    "Identify the regime from a pre-event dashboard before predicting a reaction.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: unexpected event" },
    { kind: "check", ref: "scenario_analysis", label: "Scenario analysis check" },
  ],
  script: {
    unit: "3.6",
    courseId: "3.6.3",
    hook: {
      prompt: "Payrolls beat expectations by a wide margin. What do equities do?",
      control: {
        kind: "choice",
        choices: [
          { id: "rise", label: "Rise", feedback: "They can, when growth is the worry. When inflation is the fear, strong jobs mean more hikes, and stocks tend to fall." },
          { id: "fall", label: "Fall", feedback: "They can, when inflation is the fear. In a growth scare the same beat tends to lift stocks." },
          { id: "depends", label: "It depends", feedback: "Right. The same number, read through a different fear, moves stocks the other way." },
        ],
        answer: "depends",
      },
      compare: "You chose {yours}. It depends on the regime: when the central bank is fighting inflation, good news for jobs is often bad news for stocks.",
      concept: "regime-dependent-reaction",
    },
    learn: [
      {
        kind: "explain",
        title: "Inflation through the central bank",
        text: "Inflation comes from demand running ahead of supply, cost shocks such as energy, wages, and expectations that feed on themselves. Markets feel it mostly through the central bank's response. High inflation means a bank fighting it; [[disinflation]], inflation still positive but falling, lets it ease. That stance is the [[policy-regime]].",
      },
      {
        kind: "figure",
        title: "Same data, two regimes",
        figure: {
          kind: "chart",
          chart: REGIME_CHART,
          steps: [
            { text: "Payrolls beat consensus by z = +1.5. At T0, LABX sits at 100.00.", layers: [ln(at(13, 0, REGIME_PRE), "neutral"), dot(5, 100.0, "T0", "accent")] },
            { text: "Inflation-fight regime: hikes priced in. LB2 +0.12, LDX +0.5%, LABX down to 98.80.", layers: [ln(at(13, 5, REGIME_FIGHT), "down", "INFLATION FIGHT")] },
            { text: "Growth-scare regime: recession fears ease. LABX up to 101.00.", layers: [ln(at(13, 5, REGIME_SCARE), "up", "GROWTH SCARE")] },
          ],
        },
        text: "Strong data lift expected profits and the discount rate together. Which effect wins depends on what the market fears most. The sizes are simulator settings, not measured reactions.",
        concept: "regime-dependent-reaction",
      },
      {
        kind: "worked",
        title: "When the hedge fails",
        lines: ["A 60/40 portfolio: 60% LABX, 40% LBND.", "The regime turns to inflation-fight: LABX −12%, LBND −8%.", "Portfolio: 0.6 × (−12%) + 0.4 × (−8%) = ?"],
        ask: {
          answer: -10.4,
          tolerance: 0.05,
          unit: "%",
          feedback: [
            { value: -20, text: "That adds the two moves. Weight each by its share: 0.6 and 0.4." },
            { value: -7.2, text: "That's the LABX part only. Add 0.4 × (−8%) = −3.2%." },
          ],
          correct: "Right: −10.4%. The bond leg added to the loss instead of cushioning it.",
        },
        after: "Historical case: in 2022 the S&P 500 lost 18.1% and 20-year US Treasuries 26.1%, both double-digit losses in the same year. Inflation, not growth, was the dominant shock.",
        concept: "stock-bond-correlation",
      },
      {
        kind: "explain",
        title: "What decades of data show",
        text: "**Evidence, grade A.** The stock–bond correlation depends on the regime: usually negative when inflation is low and the central bank can cut in a slowdown, positive when inflation is high and policy tight. 'Good news is bad news' is a tendency of inflation-fight regimes (grade B). One fixed rule for every regime: grade D.",
      },
      {
        kind: "hotspot",
        title: "Read the dashboard",
        prompt: "Four panels before a CPI release. Tap the one that tells you most directly which regime the market is trading.",
        chart: DASHBOARD,
        zones: [
          { id: "cpi", label: "CPI trend", from: 30, to: 40, feedback: "CPI at 3.3% and flat is the backdrop, but it doesn't show how the market reads new data." },
          { id: "dots", label: "Dot-plot median", from: 20, to: 30, feedback: "Unchanged dots say what the bank planned, not what the market fears now." },
          { id: "curve", label: "Curve slope", from: 10, to: 20, feedback: "A flat curve fits several regimes: hikes ending, or growth worries starting." },
          { id: "react", label: "Last reaction to strong data", from: 0, to: 10 },
        ],
        answer: "react",
        correct: "Right. Strong data, and LABX fell 1.1%: the market reads good news as more hikes. That's an inflation-fight regime.",
        concept: "inflation-regime",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Name the regime before you predict a reaction. And 'gold always hedges inflation' gets its own test in 3.6.8.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: REGIME_CARDS,
      goal: "The dashboard says inflation-fight. CPI comes in hot, z = +2.0. Predict each asset's first move, using that regime's reactions in the simulator.",
      success: { field: "solved", eq: 4 },
      correct: "Four for four. In this regime hot inflation data mean hikes: LB2 and LDX up, LABX and LGLD down. Simulator settings; real reactions vary.",
      hints: ["In an inflation fight, a hot print means more hikes. Start with LB2.", "Then follow the hikes: the rate gap, the discount rate, the cost of holding gold."],
      showMe: { solved: 4 },
      concept: "regime-dependent-reaction",
    },
    check: ["q-3.6.3-1", "q-3.6.3-2", "q-3.6.3-3"],
    recap: {
      takeaways: [
        "The same data move assets differently by regime, because the central bank's reaction differs.",
        "Bonds hedge stocks when growth shocks dominate, not when inflation does, as in 2022.",
        "Read the regime from how markets reacted to recent data, then predict.",
      ],
    },
  },
};

const L364: Lesson = {
  id: "3.6.4",
  title: "The dollar",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Rate and growth differentials drive the dollar over time; in global stress it tends to rise as a haven, except when a funding-currency unwind pulls it down.",
  objectives: [
    "Explain the main drivers of the dollar: rate and growth differentials, and safe-haven demand under stress.",
    "Place a world state on the dollar smile and predict the dollar's direction.",
    "Recognise an exception, such as a funding-currency unwind, where the smile fails.",
  ],
  blocks: [],
  practice: [
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "3.6",
    courseId: "3.6.4",
    hook: {
      prompt: "A global crisis starts. Does the dollar tend to rise or fall?",
      control: {
        kind: "choice",
        choices: [
          { id: "rise", label: "Rise", feedback: "Right, usually: investors seek safety and scramble for dollars to repay dollar debts." },
          { id: "fall", label: "Fall", feedback: "Usually not. In most global crises the dollar has risen, as a haven and as the currency of global funding." },
          { id: "flat", label: "Stay put", feedback: "Crises tend to move the dollar a lot. The usual direction has been up." },
        ],
        answer: "rise",
      },
      compare: "You chose {yours}. In most global crises the dollar has risen. Not in all: a carry unwind can push it down, as this lesson shows.",
      concept: "dollar-smile",
    },
    learn: [
      {
        kind: "figure",
        title: "The dollar smile",
        figure: {
          kind: "chart",
          chart: SMILE_CHART,
          steps: [
            { text: "Left: a US boom. Capital chases higher US growth and rates; LDX rises.", layers: [path(SMILE_LEFT, "up"), dot(1, 103.6, "US BOOM", "up")] },
            { text: "Middle: synchronised global growth. Money goes abroad for better returns; LDX falls.", layers: [path(SMILE_MID, "down"), dot(9, 99.0, "GLOBAL GROWTH", "down")] },
            { text: "Right: a global crisis. Investors flee to safety and dollar funding; LDX rises.", layers: [path(SMILE_RIGHT, "up"), dot(17, 103.6, "CRISIS", "up")] },
          ],
        },
        text: "The [[dollar-smile]] is a practitioner framework (grade C): a tendency with exceptions. LDX, this lab's [[dollar-index]], prices vUSD against a basket of currencies.",
        concept: "dollar-smile",
      },
      {
        kind: "match",
        title: "Place the world on the smile",
        prompt: "Sort each state of the world by what LDX tends to do.",
        pairs: [
          { left: "US growth far ahead of the rest of the world", right: "LDX tends to rise", wrong: "US outperformance draws capital in: the left side of the smile." },
          { left: "Growth picks up everywhere at once", right: "LDX tends to fall", wrong: "When the rest of the world catches up, money goes abroad: the bottom of the smile." },
          { left: "A global crisis: spreads blow out, stocks crash", right: "LDX tends to rise", wrong: "Stress drives demand for safety and for dollar funding: the right side of the smile." },
          { left: "LCB rates rise against the basket's", right: "LDX tends to rise", wrong: "A wider rate differential in vUSD's favour tends to lift it." },
        ],
        columns: ["State of the world", "Dollar"],
        correct: "Right. Both ends of the smile push the dollar up, for different reasons.",
        concept: "dollar-smile",
      },
      {
        kind: "reveal",
        title: "A crisis that breaks the rule",
        prompt: "Risk-off has begun and LABX is sliding. VFUN, the low-rate funding currency with a big weight in LDX's basket, starts to jump. What does LDX do next?",
        chart: { candles: LDX_UNWIND, visible: 10 },
        choices: [
          { id: "up", label: "Keeps rising: risk-off means dollar up", feedback: "That's the smile's rule. Here the funding currency's jump dragged LDX down." },
          { id: "down", label: "Falls: VFUN's jump drags LDX down", feedback: "Right." },
          { id: "flat", label: "Goes flat: the two effects cancel", feedback: "They didn't cancel. Carry traders buying back VFUN outweighed haven demand." },
        ],
        answer: "down",
        after: "LDX fell from 100.60 to 98.60. Carry traders who borrowed VFUN had to buy it back, and that outweighed haven demand. Historical case: in summer 2024, after a Bank of Japan rate rise, the yen jumped and yen-funded carry trades unwound within days.",
        concept: "dollar-smile",
      },
      {
        kind: "explain",
        title: "What drives the dollar",
        text: "Over months and years, the dollar tends to follow [[rate-differential|rate]] and growth differentials: money goes where returns are higher (grade B). In stress a second driver takes over: [[safe-haven]] demand and the need for dollars to repay dollar debts. The smile combines the two. A [[funding-currency]] unwind is the known exception.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "'A strong economy means a strong currency, always' is wrong. Currencies move on the economy relative to others, the rate differential and the regime. A strong US economy in a world growing even faster can come with a falling dollar.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: SMILE_CARDS,
      goal: "Place four synthetic world states on the smile and predict LDX. One state breaks the rule: find it.",
      success: { field: "solved", eq: 4 },
      correct: "All four placed. In card D the funding currency jumps as carry trades close, so LDX falls despite the crisis.",
      hints: ["First ask: is this calm growth, a US boom, or stress?", "In stress, check what's causing it. A jump in the funding currency changes the answer."],
      showMe: { solved: 4 },
      concept: "dollar-smile",
    },
    check: ["q-3.6.4-1", "q-3.6.4-2", "q-3.6.4-3"],
    recap: {
      takeaways: [
        "Over time, rate and growth differentials drive the dollar; in stress, haven demand takes over.",
        "The smile: LDX up in US booms and global crises, down in synchronised growth.",
        "A funding-currency unwind can sink LDX in risk-off. Write that exception into your plan.",
      ],
    },
  },
};

const L365: Lesson = {
  id: "3.6.5",
  title: "Commodities and commodity currencies",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Oil follows supply shocks, copper industrial demand, gold real yields and official buying; exporters' currencies follow their terms of trade, loosely.",
  objectives: [
    "Name the main driver of oil, copper and gold: supply shocks, industrial demand, real yields plus official demand.",
    "Link a commodity price to its exporter's currency through the terms of trade.",
    "Explain why the gold–real-yield relationship broke in 2022–24.",
  ],
  blocks: [],
  practice: [
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "3.6",
    courseId: "3.6.5",
    hook: {
      prompt: "Oil jumps 10% on a supply shock. Is that good for the stock index?",
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes", feedback: "Good for energy producers. Most other companies and consumers pay more, and inflation risk rises." },
          { id: "no", label: "No", feedback: "Bad for most companies and consumers, but energy producers gain. The net depends on the index's mix and the regime." },
          { id: "depends", label: "It depends", feedback: "Right. Winners and losers sit inside the same index." },
        ],
        answer: "depends",
      },
      compare: "You chose {yours}. Energy shares gain; higher costs and inflation risk hurt most others. The net depends on the index's mix and the regime.",
      concept: "commodities-in-macro",
    },
    learn: [
      {
        kind: "match",
        title: "What moves each one",
        prompt: "Match each commodity to its main driver.",
        pairs: [
          { left: "LOIL, oil", right: "Supply shocks and global growth", wrong: "Oil is dominated by supply: output decisions, disruptions and inventories, plus the growth that sets demand." },
          { left: "LCPR, copper", right: "Industrial demand: building and manufacturing", wrong: "Copper goes into wiring, buildings and machines, so it tracks industrial activity: 'Dr. Copper'." },
          { left: "LGLD, gold", right: "Real yields, the dollar, havens and central-bank buying", wrong: "Gold pays nothing, so its cost is the real yield given up; haven seekers and central banks add demand." },
        ],
        columns: ["Commodity", "Main driver"],
        correct: "Right. Oil is mostly supply (grade B), copper is a growth gauge, and gold is a mix whose weights change over time.",
        concept: "commodities-in-macro",
      },
      {
        kind: "figure",
        title: "Copper, gold and yields",
        figure: {
          kind: "chart",
          chart: CG_CHART,
          steps: [
            { text: "LB10 over 60 synthetic weeks: 3.83% to 4.61% by week 30, then 4.17%.", layers: [ln(CG_LB10, "accent", "LB10")] },
            { text: "The copper–gold ratio, scaled to share the axis, tracks the yield.", layers: [ln(CG_RATIO, "concept", "COPPER/GOLD")] },
            { text: "Weeks 38–43: the ratio falls from 4.42 to 3.97; LB10 stays between 4.33 and 4.44.", layers: [dot(38, 4.42, "38"), dot(43, 3.97, "43")] },
          ],
        },
        text: "Both respond to growth expectations, so the [[copper-gold-ratio]] tends to move with yields. It's a practitioner gauge (grade C) and can diverge for weeks at a time, as here. Synthetic data.",
        concept: "commodities-in-macro",
      },
      {
        kind: "explain",
        title: "Gold and real yields",
        text: "Gold pays nothing, so a higher [[real-yield]] raises the cost of holding it: for years gold tended to fall as real yields rose (grade B). Historical case: from 2022 the link broke. Real yields turned clearly positive and gold still climbed. The cited reasons: heavy central-bank buying, reserve diversification after sanctions, and geopolitics.",
      },
      {
        kind: "predict",
        title: "An inventory surprise",
        prompt: "A synthetic weekly report shows oil inventories fell far more than forecast. LCOM is the currency of an oil exporter, priced in vUSD. Which way do LOIL and LCOM likely move?",
        control: {
          kind: "choice",
          choices: [
            { id: "both-up", label: "Both up", feedback: "Right." },
            { id: "split", label: "LOIL up, LCOM down", feedback: "LOIL rises on tighter supply, and the exporter earns more per barrel, which tends to lift LCOM too." },
            { id: "both-down", label: "Both down", feedback: "A bigger draw means tighter supply: that lifts the oil price, not lowers it." },
          ],
          answer: "both-up",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "LOIL", value: 2.4, role: "up" },
            { label: "LCOM", value: 0.6, role: "up" },
          ],
          unit: "%",
          steps: ["Synthetic replay, first hour: LOIL +2.4%.", "LCOM +0.6%: the same direction, a quarter of the size."],
        },
        reveal: "Both up. A larger draw means tighter supply, so LOIL rises. The exporter earns more per barrel: its [[terms-of-trade]] improve, and LCOM tends to follow. In real markets that currency link is loose (grade C).",
        concept: "commodity-currencies",
      },
      {
        kind: "explain",
        title: "Terms of trade",
        text: "A country's [[terms-of-trade]] are its export prices divided by its import prices. When its main export gets dearer, national income rises and foreign buyers need more of its currency. That's the link behind a [[commodity-currency]]. It's grade C: rate differentials and risk appetite often matter more.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Futures add roll yield: contango and backwardation change what a commodity position earns even when the spot price doesn't move. That's in 3.14.",
      },
    ],
    task: {
      widget: "position-size",
      goal: "After the draw, you buy LOIL at 80.00 with a stop at 78.40. Risk 1% of 10,000.00, costs included. Type the most units that fit.",
      start: { account: 10000, riskPct: 1, entry: 80, stop: 78.4, units: 62 },
      locked: ["account", "riskPct", "entry", "stop"],
      hidden: ["simpleQty", "qty"],
      success: { all: [{ field: "units", eq: 59 }, { field: "stop", eq: 78.4 }] },
      feedback: [
        { when: { field: "units", gt: 59 }, text: "{units} units would lose {lossAtStop:2} at the stop, over the 100.00 budget." },
        { when: { field: "units", lt: 59 }, text: "{units} units fit, but more would too. Find the most that does." },
      ],
      correct: "Right. 59 units lose 99.08 at 78.40, commissions included. 62, the size before costs, would lose 104.12.",
      hints: [
        "Budget: 1% of 10,000.00 = 100.00. The stop is 1.60 away.",
        "100.00 ÷ 1.60 = 62.5, but commissions on both fills come on top.",
        "Step down from 62 until the loss at the stop is 100.00 or less.",
      ],
      showMe: { units: 59 },
      concept: "commodities-in-macro",
    },
    check: ["q-3.6.5-1", "q-3.6.5-2", "q-3.6.5-3"],
    recap: {
      takeaways: [
        "Oil follows supply and growth, copper industrial demand, gold real yields plus official buying.",
        "Dearer exports improve the terms of trade, and the exporter's currency tends to follow, loosely.",
        "Gold rose with positive real yields from 2022 as central banks bought. Relationships drift.",
      ],
    },
  },
};

const L366: Lesson = {
  id: "3.6.6",
  title: "Risk-on, risk-off and carry",
  topic: "portfolio_exposure",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "In risk-off, risky assets fall together and havens rise; carry pays small steady gains and loses big ones fast, so size it for the crash.",
  objectives: [
    "Predict the cross-asset reaction to a risk-off shock: equities, high-beta currencies, credit and safe havens.",
    "Explain why correlations rise toward 1 in a crisis and what that does to diversification.",
    "Show the negative skew of a carry trade: months of small gains erased in days.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M05", label: "Size Matters" },
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
  ],
  script: {
    unit: "3.6",
    courseId: "3.6.6",
    hook: {
      prompt: "You earn 2,000 vUSD a year of carry on a 50,000 vUSD position. The funding currency jumps 5% in a day. How many months of carry are gone?",
      control: {
        kind: "slider",
        min: 0,
        max: 24,
        step: 1,
        unit: "months",
        start: 0,
        answer: 15,
        tolerance: 0,
        feedback: [
          { from: 0, to: 14, text: "More. 5% of 50,000 is 2,500 vUSD, against 2,000 of carry a year." },
          { from: 16, to: 24, text: "Fewer. 2,500 ÷ 2,000 = 1.25 years: 15 months." },
        ],
      },
      compare: "You said {yours} months. 5% of 50,000 is 2,500 vUSD: 1.25 years, or 15 months, of carry gone in a day.",
      concept: "carry-trade",
    },
    learn: [
      {
        kind: "figure",
        title: "A risk meter",
        figure: {
          kind: "chart",
          chart: RORO_CHART,
          steps: [
            { text: "Volatility index: about 14 in calm, 37.7 at the peak. Scaled from 0, calm, to 100, stress.", layers: [ln(RORO_VOL, "neutral", "VOLATILITY", true)] },
            { text: "Credit spreads: 1.10% in calm, 2.30% at the peak.", layers: [ln(RORO_SPR, "concept", "CREDIT", true)] },
            { text: "LFX: from about 152 down to 143, as carry trades unwind.", layers: [ln(RORO_LFX, "down", "LFX, INVERTED", true)] },
            { text: "The meter averages the three: 60 on day 28, 86 on day 30.", layers: [ln(RORO_METER, "accent", "METER"), rule(60, "RISK-OFF")] },
          ],
        },
        text: "A [[risk-off]] meter built from synthetic data. Each reading is mapped onto 0 to 100 with fixed ranges, so the meter never peeks ahead. At 60 or more, this lab calls the regime risk-off; below, [[risk-on]] or neutral.",
        concept: "risk-on-risk-off",
      },
      {
        kind: "match",
        title: "Sort the shock",
        prompt: "A risk-off shock hits the lab's base regime. Sort each asset by its typical first move.",
        pairs: [
          { left: "LABX, the stock index", right: "Falls", wrong: "Equities are the core risk asset: they fall when appetite for risk drops." },
          { left: "LCOM, a commodity currency", right: "Falls", wrong: "A commodity currency is high-beta: it falls with growth hopes and risk appetite." },
          { left: "LFX, the carry pair", right: "Falls", wrong: "Carry traders buy back the funding currency, VFUN, so LFX falls." },
          { left: "LDX, the dollar index", right: "Rises", wrong: "In the base regime, haven and funding demand lift the dollar index." },
          { left: "LBND, the 10-year bond", right: "Rises", wrong: "Government bonds are bought for safety, and rate cuts get priced in." },
          { left: "LGLD, gold", right: "Rises", wrong: "Gold is a traditional haven when stress hits." },
        ],
        columns: ["Asset", "Risk-off"],
        correct: "Right, for the base regime. In a carry unwind LDX can fall too (3.6.4); in an inflation shock LBND can fall with LABX (3.6.8).",
        concept: "risk-on-risk-off",
      },
      {
        kind: "worked",
        title: "The carry arithmetic",
        lines: [
          "Long LFX, 50,000 vUSD: you hold vUSD at 4% and borrow VFUN at 0%.",
          "Carry: 50,000 × 4% = 2,000 vUSD a year, about 5.48 a day, before any swap markup.",
          "VFUN jumps 5% in a day: 50,000 × 5% = 2,500 vUSD lost.",
          "Days of carry that one day erases: 2,500 ÷ 5.48 = ?",
        ],
        ask: {
          answer: 456,
          tolerance: 1,
          unit: "days",
          feedback: [
            { value: 15, text: "That's in months. The question asks for days of carry." },
            { value: 1.25, text: "That's in years. In days: 2,500 ÷ 5.48." },
          ],
          correct: "Right: about 456 days, a year and three months of carry, gone in one.",
        },
        after: "A [[carry-trade]] earns the rate gap through the [[overnight-financing|swap]] every day, and gives it back in a [[carry-unwind]] when volatility jumps or the funding currency rallies.",
        concept: "carry-trade",
      },
      {
        kind: "figure",
        title: "Carry's lopsided returns",
        figure: {
          kind: "bars",
          bars: [
            { label: "+0.5% or better", value: 4, role: "accent" },
            { label: "0 to +0.5%", value: 74, role: "accent" },
            { label: "−0.5% to 0", value: 23, role: "neutral" },
            { label: "−2% to −0.5%", value: 0, role: "neutral" },
            { label: "−4% to −2%", value: 2, role: "down" },
            { label: "−4% or worse", value: 1, role: "down" },
          ],
          unit: " weeks",
          steps: ["104 synthetic weeks of carry: 78 gains, none above +0.57%.", "23 small losing weeks, then none between −0.5% and −2%.", "Three weeks lost 5.1%, 3.8% and 2.6%: 11.5 points together."],
        },
        text: "Added up, the other 101 weeks made 15.67 points; the worst three took back 11.5. A positive mean with a long left tail is carry's [[negative-skew]]. Synthetic data, but long samples of real carry returns show the same shape (grade A).",
        concept: "carry-unwind",
      },
      {
        kind: "explain",
        title: "Why everything falls together",
        text: "In a crisis many investors must cut risk at once. Leveraged funds meet margin calls, volatility-targeting funds sell as volatility jumps, and funding dries up. They sell what they can, not what they want, so assets that usually move apart fall together. Diversification thins out exactly when you need it (grade B: documented, but uneven across crises).",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "A positive [[overnight-financing|swap]] isn't free income: it's payment for crash risk. Historical case: in summer 2024, a Bank of Japan rate rise and a jump in the yen forced yen-funded carry trades to unwind within days. Size carry for the jump, not for the daily gain.",
      },
    ],
    task: {
      widget: "exposure",
      goal: "Your LFX carry position: 50,000 vUSD on a 10,000.00 account, 5× leverage allowed. Size it so a 5% jump in VFUN costs at most 2% of the account.",
      start: { account: 10000, leverage: 5, position: 50000, move: 5 },
      locked: ["account", "leverage", "move"],
      success: { all: [{ field: "lossPct", lte: 2 }, { field: "position", gt: 0 }] },
      feedback: [
        { when: { field: "position", eq: 0 }, text: "No position, no carry. Find the largest size that keeps the jump within 2%." },
        { when: { field: "lossPct", gt: 2 }, text: "This size loses {loss:2} on a 5% jump: {lossPct:1}% of the account. Go smaller." },
      ],
      correct: "Right. Up to 4,000 vUSD, a 5% jump costs at most 200.00, 2% of the account. At 4,000 the carry is 160 a year: the honest price of the risk.",
      hints: ["The loss on the jump is the position × 5%.", "2% of 10,000.00 is 200.00. Which position loses 200.00 on a 5% move?", "200.00 ÷ 5% = 4,000 vUSD."],
      showMe: { position: 4000 },
      concept: "carry-trade",
    },
    check: ["q-3.6.6-1", "q-3.6.6-2", "q-3.6.6-3"],
    recap: {
      takeaways: [
        "In risk-off, LABX, LCOM and LFX tend to fall; LDX, LBND and LGLD tend to rise.",
        "In crises, forced selling pushes correlations toward 1. Diversification thins out when you need it.",
        "Carry earns small and loses big: size it for the jump, 4,000 vUSD, not the swap.",
      ],
    },
  },
};

const L367: Lesson = {
  id: "3.6.7",
  title: "Business cycle and sector rotation",
  topic: "scenario_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Leading data hint at the cycle phase and the textbook sector leaders, but phases are clear only in hindsight, and rotation's edge mostly vanishes after costs.",
  objectives: [
    "Classify the cycle phase from leading data (PMI new orders, jobless claims, curve slope, credit spreads).",
    "Name the textbook sector leaders in each phase and why they lead.",
    "Show that the rotation edge shrinks after costs and phase-timing errors.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "scenario_analysis", label: "Scenario analysis check" },
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
  ],
  script: {
    unit: "3.6",
    courseId: "3.6.7",
    hook: {
      prompt: "Since 1945, how long has a US economic expansion lasted on average?",
      control: {
        kind: "slider",
        min: 1,
        max: 10,
        step: 0.5,
        unit: "years",
        start: 1,
        answer: 5.5,
        tolerance: 0.5,
        feedback: [
          { from: 1, to: 4.5, text: "Longer. By the NBER's dating, expansions since 1945 averaged about 64 months: five years and four months." },
          { from: 6.5, to: 10, text: "Shorter on average, though the 2009–2020 expansion ran almost 11 years. The average since 1945 is about 64 months." },
        ],
      },
      compare: "You said {yours} years. By NBER dating for 1945–2020, expansions averaged about 64 months, five years and four months; contractions about 10 months.",
      concept: "business-cycle",
    },
    learn: [
      {
        kind: "figure",
        title: "Four phases",
        figure: {
          kind: "chart",
          chart: CYCLE_CHART,
          steps: [
            { text: "Early: activity rebounds from the trough. New orders jump, claims fall, the curve is steep.", layers: [dot(5, -1.67, "EARLY", "up")] },
            { text: "Mid: steady growth. New orders above 50, claims low, spreads tight and stable.", layers: [dot(20, 1.4, "MID", "accent")] },
            { text: "Late: growth slows near the peak. Claims turn up, the curve flattens, spreads widen.", layers: [dot(37, 2.38, "LATE", "neutral")] },
            { text: "Recession: activity contracts. New orders well below 50, claims climb, spreads blow out.", layers: [dot(45, -0.8, "RECESSION", "down")] },
          ],
        },
        text: "A stylised [[business-cycle]], drawn from synthetic activity relative to trend. Real cycles are irregular in length and depth: this shape is a map, not a clock.",
        concept: "business-cycle",
      },
      {
        kind: "match",
        title: "Textbook leaders",
        prompt: "Match each sector group to the phase where the textbook says it leads.",
        pairs: [
          { left: "Consumer discretionary, financials, industrials", right: "Early", wrong: "Cheap money and recovering demand help spending, lending and capital goods first." },
          { left: "Technology", right: "Mid", wrong: "Steady growth rewards companies investing for the long run: the textbook mid-cycle leader." },
          { left: "Energy, materials", right: "Late", wrong: "Commodity prices tend to peak late, as capacity runs tight." },
          { left: "Staples, utilities, health care", right: "Recession", wrong: "Demand for essentials holds up when incomes fall: the defensive sectors." },
        ],
        columns: ["Sector group", "Phase"],
        correct: "Right. Add government bonds to the recession column. This is the textbook map; the evidence that trading it pays is weak (grade C).",
        concept: "sector-rotation",
      },
      {
        kind: "reveal",
        title: "Real time versus hindsight",
        prompt: "Month 29. PMI new orders have fallen three months in a row, from 56 to 52. Is the late phase starting?",
        chart: PMI_CHART,
        choices: [
          { id: "late", label: "Yes: the late phase has begun", feedback: "Plausible from the data so far, and wrong this time: orders rebounded." },
          { id: "pause", label: "No: it's a mid-cycle pause", feedback: "Right this time, but nothing in the first 30 months could tell you." },
          { id: "cant", label: "Can't tell yet: both fit the data", feedback: "Right." },
        ],
        answer: "cant",
        after: "New orders rebounded to 55.6 by month 35: a mid-cycle pause, visible only with hindsight. In real time, the same three months looked like the turn. Real-time phase calls are grade C; hindsight makes them look easy.",
        concept: "business-cycle",
      },
      {
        kind: "explain",
        title: "Credit and conditions",
        text: "A [[credit-spread]] is the extra yield a company pays over the government to borrow. It widens when lenders fear defaults, so it's a core input to [[financial-conditions]], along with rates, stocks and the currency. 'Credit leads equities' is a practitioner observation (grade C): sometimes spreads widen first, sometimes not. Test it before you rely on it.",
      },
      {
        kind: "worked",
        title: "What rotation keeps",
        lines: [
          "Synthetic economy: rotating with phases dated afterwards beats buy-and-hold by 2.4 points a year.",
          "Four switches a year at 0.30% round trip each: −1.2 points.",
          "Calling each phase late, as happens in real time: −1.0 point.",
          "Edge left: 2.4 − 1.2 − 1.0 = ?",
        ],
        ask: {
          answer: 0.2,
          tolerance: 0.01,
          unit: "points",
          feedback: [
            { value: 1.2, text: "That leaves out the timing errors. Subtract the 1.0 point too." },
            { value: 1.4, text: "That leaves out the costs. Subtract 4 × 0.30 = 1.2 points." },
          ],
          correct: "Right: 0.2 points a year, before taxes and with no bad luck.",
        },
        after: "Research on textbook rotation points the same way: a modest edge with phases dated in hindsight, which mostly disappears after costs and realistic timing errors (grade C).",
        concept: "sector-rotation",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Treat the cycle as context for risk and scenarios, not as a trading clock. Hindsight makes every phase look obvious; real time never does.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: CYCLE_CARDS,
      goal: "Twelve synthetic months, one card each. Read new orders, jobless claims, the 10y–2y curve and credit spreads, and name the phase. Chance alone gets about 3 right first time.",
      success: { field: "solved", eq: 12 },
      correct: "All twelve named: late, recession, early, mid, in the textbook's order. Eight or more on the first try beats chance clearly; real months come less clean.",
      hints: ["Start with new orders: above or below 50, rising or falling?", "Then claims and spreads: improving or worsening? And is the curve steep, flat or inverted?"],
      showMe: { solved: 12 },
      concept: "business-cycle",
    },
    check: ["q-3.6.7-1", "q-3.6.7-2", "q-3.6.7-3"],
    recap: {
      takeaways: [
        "Read the phase from orders, claims, curve and spreads; reliable labels come only with hindsight.",
        "Textbook leaders: cyclicals early, tech mid, energy and materials late, defensives in recession.",
        "Rotation's 2.4-point edge shrank to 0.2 after costs and late calls.",
      ],
    },
  },
};

const L368: Lesson = {
  id: "3.6.8",
  title: "When correlations flip",
  topic: "portfolio_exposure",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Correlations are footprints of the dominant shock: measure them on a rolling window, know its noise, and size hedged books as if both legs can lose together.",
  objectives: [
    "Compute and read a rolling correlation and say how many observations it rests on.",
    "Name three historical correlation breaks (stock–bond in 2022, gold–real yields in 2022–24, the yen as a safe haven) and their cause.",
    'Size a "hedged" portfolio for the case in which both legs lose together.',
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M05", label: "Size Matters" },
    { kind: "check", ref: "portfolio_exposure", label: "Portfolio exposure check" },
  ],
  script: {
    unit: "3.6",
    courseId: "3.6.8",
    hook: {
      prompt: "You're long LABX and long LBND, 5,000 vUSD each. Is that a hedge?",
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes", feedback: "Only while growth shocks dominate: then bonds tend to rise as stocks fall. In an inflation shock both can fall." },
          { id: "no", label: "No", feedback: "Often it is: when growth shocks dominate, bonds cushion stock losses. Not when inflation dominates." },
          { id: "depends", label: "It depends", feedback: "Right. It depends on which shock dominates." },
        ],
        answer: "depends",
      },
      compare: "You chose {yours}. When growth shocks dominate, LBND tends to cushion LABX. When inflation dominates, both can fall together, as in 2022.",
      concept: "correlation-instability",
    },
    learn: [
      {
        kind: "match",
        title: "The textbook map",
        prompt: "The classic intermarket relationships, drawn from markets where inflation was the main shock. Sort each pair.",
        pairs: [
          { left: "Stocks and bonds", right: "Move together", wrong: "In the classic map, falling bond prices, that is rising yields, weigh on stocks: they move together." },
          { left: "Stocks and commodities", right: "Move opposite", wrong: "Rising commodities meant inflation and higher yields, which weighed on stocks." },
          { left: "Bonds and commodities", right: "Move opposite", wrong: "Rising commodity prices signal inflation, which pushes bond prices down." },
          { left: "Commodities and the dollar", right: "Move opposite", wrong: "Commodities are priced in dollars, so a weaker dollar tends to lift them." },
        ],
        columns: ["Pair", "Classic relationship"],
        correct: "Right, for the textbook map. From the late 1990s, with deflation the fear, stocks and bonds decoupled; 2022 flipped them back. As fixed laws: grade D. As regime tendencies: grade C.",
        concept: "intermarket-relationships",
      },
      {
        kind: "hotspot",
        title: "Spot the flip",
        prompt: "160 synthetic bars of LABX and LBND returns, two rolling correlations. Your rule: flag a flip when the 20-bar line closes above zero. Tap where it first fires.",
        chart: CORR_CHART,
        zones: [
          { id: "bump", label: "Bar 50, 20-bar at −0.14", index: 50, price: -0.14, feedback: "The 20-bar line jumped here but stayed below zero: noise inside the old regime." },
          { id: "fire", label: "Bar 89, 20-bar at 0.01", index: 89, price: 0.01 },
          { id: "high", label: "Bar 96, 20-bar at 0.32", index: 96, price: 0.32, feedback: "Above zero, but not the first close above it. The rule fired earlier." },
          { id: "slow", label: "Bar 115, 60-bar at 0.03", index: 115, price: 0.03, feedback: "That's the 60-bar line crossing. Your rule watches the 20-bar line, which crossed earlier." },
        ],
        answer: "fire",
        correct: "Right. Bar 89 is the 20-bar line's first close above zero. Next, where the switch really was.",
        concept: "rolling-correlation",
      },
      {
        kind: "figure",
        title: "Noise and lag",
        figure: {
          kind: "chart",
          chart: CORR_CHART,
          steps: [
            { text: "The 20-bar line rests on 20 pairs of returns: it swung from −0.88 to −0.14 in one regime." },
            { text: "The 60-bar line is smoother, but slower to turn." },
            {
              text: "The hidden switch: bar 80. The 20-bar line fired 9 bars later; the 60-bar, 35.",
              layers: [dot(80, -0.75, "SWITCH", "down"), dot(89, 0.01, "89", "accent"), dot(115, 0.03, "115", "concept")],
            },
          ],
        },
        text: "At a true correlation of zero, 95% of 20-bar readings fall within about ±0.44; for 60 bars, about ±0.25. Short windows are noisy, long ones lag. Say how many observations a [[rolling-correlation]] rests on whenever you quote one.",
        concept: "rolling-correlation",
      },
      {
        kind: "worked",
        title: "When the hedge doubles the loss",
        lines: [
          "LABX: 50 units at 100.00 = 5,000 vUSD. LBND: 50 units at 100.00 = 5,000 vUSD.",
          "Old regime, a growth scare: LABX −10% (−500), LBND +4% (+200). Total −300.",
          "After the flip, an inflation shock: LABX −10% (−500), LBND −8% (−400).",
          "Total = ?",
        ],
        ask: {
          answer: -900,
          tolerance: 0,
          unit: "vUSD",
          feedback: [
            { value: -300, text: "That's the old regime. After the flip LBND loses 400 too." },
            { value: -100, text: "LBND fell 8% here, so it subtracts: −500 − 400." },
            { value: 900, text: "Right size, but it's a loss: −900." },
          ],
          correct: "Right: −900, 9% of a 10,000 account and three times the −300 the 'hedge' was planned for.",
        },
        after: "The 'hedge' tripled the loss instead of cushioning it. Plan for the correlation you'd face in stress, not the one in your sample.",
        concept: "correlation-instability",
      },
      {
        kind: "explain",
        title: "Three breaks",
        text: "**Historical cases.** The stock–bond correlation, negative or near zero for most of 2000–2020, turned positive in 2022 as inflation became the dominant shock. Gold stopped tracking real yields from 2022, as central banks bought heavily. The yen's [[safe-haven]] role weakened while its rate gap with other currencies was wide. Each is a [[correlation-breakdown]].",
      },
      {
        kind: "explain",
        title: "Why correlations move",
        text: "Correlations aren't constants; they're footprints of the dominant shock. Growth shocks move stocks and yields the same way, so stock and bond prices move apart. Inflation and policy shocks push yields up and stocks down, so both prices fall. Forced selling can override both. [[intermarket-analysis|Intermarket]] rules hold only within a regime (grade A).",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Risk rule: in stress, size as if correlation were 1. Two legs that 'hedge' each other are two bets until the regime proves otherwise. Count both in your [[portfolio-heat]] (2.11).",
      },
    ],
    task: {
      widget: "exposure",
      goal: "Your 'hedged' book: 5,000 LABX + 5,000 LBND on a 10,000.00 account. Assume both legs fall 10% together. Cut the total so that costs at most 2% of the account.",
      start: { account: 10000, leverage: 1, position: 10000, move: 10 },
      locked: ["account", "leverage", "move"],
      success: { all: [{ field: "lossPct", lte: 2 }, { field: "position", gt: 0 }] },
      feedback: [
        { when: { field: "position", eq: 0 }, text: "Flat is safe, but it isn't the task. Find the largest book that fits." },
        { when: { field: "lossPct", gt: 2 }, text: "This book loses {loss:2} if both legs fall 10%: {lossPct:1}% of the account. Cut it further." },
      ],
      correct: "Right. Up to 2,000 vUSD in total, 1,000 per leg, a joint 10% fall costs at most 200.00, 2% of the account.",
      hints: ["Treat both legs as one position: correlation 1.", "2% of 10,000.00 is 200.00. A 10% fall on what total loses 200.00?", "200.00 ÷ 10% = 2,000 vUSD, 1,000 per leg."],
      showMe: { position: 2000 },
      concept: "correlation-instability",
    },
    check: ["q-3.6.8-1", "q-3.6.8-2", "q-3.6.8-3"],
    recap: {
      takeaways: [
        "A rolling correlation rests on its window: 20 bars is noisy, about ±0.44; 60 bars lags.",
        "Stock–bond in 2022, gold–real yields, the yen: correlations flip when the dominant shock changes.",
        "Size hedged books as if correlation were 1: a joint 10% fall within 2%.",
      ],
    },
  },
};


// ─── Questions ──────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 3.6.1 · Rates: the price of money
  {
    id: "q-3.6.1-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "A zero-coupon bond pays 100 in 5 years. Its yield is 3.0%. What is its price?",
    numeric: { answer: 86.26, tolerance: 0.05, unit: "per 100" },
    explanation: "Price = 100 ÷ (1 + y)^n = 100 ÷ 1.03^5 = 100 ÷ 1.1593 = 86.26. A higher yield or a longer maturity would lower it.",
    lesson: "3.6.1",
    concepts: ["bond-price-yield"],
    hints: ["Price = 100 ÷ (1 + y)^n, with y as a decimal.", "1.03 multiplied by itself 5 times is 1.1593.", "100 ÷ 1.1593 = ?"],
    vary: {
      fields: { y: [1, 8, 0.5], n: [2, 5, 1] },
      answer: "round(100 / ((1 + y / 100) * (1 + y / 100) * (1 + y / 100 * (n >= 3)) * (1 + y / 100 * (n >= 4)) * (1 + y / 100 * (n >= 5))), 2)",
      prompt: "A zero-coupon bond pays 100 in {n} years. Its yield is {y:1}%. What is its price?",
      explanation: "Price = 100 ÷ (1 + y)^n = 100 ÷ {1 + y / 100:3}^{n} = {answer:2}. Each extra year divides by {1 + y / 100:3} once more.",
      hint: "100 ÷ {1 + y / 100:3}^{n} = ?",
    },
  },
  {
    id: "q-3.6.1-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 1,
    prompt: "LB10 yields 3.80%. Breakeven inflation over the same 10 years is 2.30%. What is the approximate real yield?",
    numeric: { answer: 1.5, tolerance: 0.01, unit: "%" },
    explanation: "Real yield ≈ nominal yield − expected inflation = 3.80% − 2.30% = 1.50%. The exact figure, 1.038 ÷ 1.023 − 1, is 1.47%.",
    lesson: "3.6.1",
    concepts: ["real-yield"],
    hints: ["Inflation eats into the nominal yield.", "Subtract expected inflation from the nominal yield."],
    vary: {
      fields: { nom: [2, 6, 0.05], inf: [1, 4, 0.05] },
      answer: "round(nom - inf, 2)",
      prompt: "LB10 yields {nom:2}%. Breakeven inflation over the same 10 years is {inf:2}%. What is the approximate real yield?",
      explanation: "Real yield ≈ nominal yield − expected inflation = {nom:2}% − {inf:2}% = {answer:2}%.",
      hint: "{nom:2} − {inf:2} = ?",
    },
  },
  {
    id: "q-3.6.1-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "LCB unexpectedly raises its rate by 0.50 points; VFUN's central bank holds. Other things equal, what does LFX, vUSD priced in VFUN, tend to do?",
    options: [
      { id: "a", label: "Fall: higher rates slow the economy, so the currency weakens", rationale: "That's a later, slower effect. On the day, holding vUSD now pays more, which tends to lift it." },
      { id: "b", label: "Rise: the rate differential widens in vUSD's favour" },
      { id: "c", label: "Nothing: rate decisions move bonds, not currencies", rationale: "Rate changes are one of the main drivers of currencies. Holding vUSD now pays more than holding VFUN." },
      { id: "d", label: "Fall: vUSD becomes costlier to borrow, so traders sell it", rationale: "Costlier borrowing discourages funding with vUSD and makes holding it more attractive. Both push vUSD up." },
    ],
    correct: "b",
    explanation: "A currency pays its holder its interest rate. A surprise hike widens the differential, so money tends to flow into vUSD and LFX tends to rise. Grade B: risk appetite and flows can dominate on a given day.",
    lesson: "3.6.1",
    concepts: ["rate-differential"],
    hints: ["Ask what holding each currency pays after the hike.", "Money tends to move toward the higher yield."],
  },

  // 3.6.2 · The yield curve
  {
    id: "q-3.6.2-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 1,
    prompt: "LB2 yields 3.95% and LB10 yields 4.30%. What is the 10y–2y spread, in basis points?",
    numeric: { answer: 35, tolerance: 0, unit: "bp" },
    explanation: "10y–2y = 4.30 − 3.95 = +0.35 percentage points = +35 bp. Positive: the curve slopes up between 2 and 10 years.",
    lesson: "3.6.2",
    concepts: ["yield-curve"],
    hints: ["Spread = the 10-year yield minus the 2-year yield.", "1 percentage point = 100 basis points."],
    vary: {
      fields: { two: [2, 6, 0.05], ten: [2, 6, 0.05] },
      constraints: ["abs(ten - two) >= 0.1"],
      answer: "round((ten - two) * 100, 0)",
      prompt: "LB2 yields {two:2}% and LB10 yields {ten:2}%. What is the 10y–2y spread, in basis points?",
      explanation: "10y–2y = {ten:2} − {two:2} = {ten - two:2} percentage points = {answer} bp. A negative spread means the curve is inverted between 2 and 10 years.",
      hint: "({ten:2} − {two:2}) × 100 = ?",
    },
  },
  {
    id: "q-3.6.2-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "Over a month, LB2 falls 0.50 points and LB10 falls 0.15 points. Which curve move is this?",
    options: [
      { id: "a", label: "Bull flattener", rationale: "Both fell, so it's bull. But the short end fell more, so the 10y–2y spread widened by 0.35: a steepener." },
      { id: "b", label: "Bear steepener", rationale: "Bear means yields rose. Here both fell." },
      { id: "c", label: "Bull steepener" },
      { id: "d", label: "Bear flattener", rationale: "Both yields fell, so it's bull, and the spread widened, so it's a steepener." },
    ],
    correct: "c",
    explanation: "Yields fell: bull. The 2-year fell more, so 10y–2y rose by 0.35 points: a steepener. That's what a market pricing in rate cuts usually does.",
    lesson: "3.6.2",
    concepts: ["curve-moves"],
    hints: ["Bull or bear: did yields rise or fall?", "Then compare the changes: did 10y − 2y widen or narrow?"],
  },
  {
    id: "q-3.6.2-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "The 10y–2y and 10y–3m spreads both turn negative. What does the evidence support?",
    options: [
      { id: "a", label: "Sell stocks now: a crash usually follows within weeks", rationale: "As a timing signal for stocks the inversion is grade D: equities have often risen for months after one." },
      { id: "b", label: "Nothing: the 2022–24 inversion proved the signal broken", rationale: "One long inversion without a quick recession fits a long, variable lag. It lowers confidence but doesn't erase the record." },
      { id: "c", label: "A recession within 12 months is certain", rationale: "Lags have run from about 6 to 24 months, and there have been false alarms. A warning, not a certainty." },
      { id: "d", label: "A long-lead recession warning, with a variable lag and some false alarms" },
    ],
    correct: "d",
    explanation: "Inversions have come before every US recession since the 1950s, typically 6 to 24 months ahead, with false alarms such as the mid-1960s (grade B). They don't time stocks (grade D). Use them for scenarios and risk budgets.",
    lesson: "3.6.2",
    concepts: ["yield-curve", "base-rates"],
    hints: ["Separate two claims: a recession warning, and a signal to time stocks.", "How long has the lead been, and has it always been right?"],
  },

  // 3.6.3 · Inflation and regimes
  {
    id: "q-3.6.3-1",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Payrolls beat consensus by the same margin in March and in September. LABX rose in March and fell in September. What best explains it?",
    options: [
      { id: "a", label: "The market's main fear moved from growth to inflation, changing how it reads the central bank's response" },
      { id: "b", label: "Payrolls are random, so the reactions are noise", rationale: "Large surprises move markets reliably. The direction flipped because the market's reading of the bank changed." },
      { id: "c", label: "Traders forgot the March reaction", rationale: "Memory isn't the mechanism. The same number implied different policy, because the regime changed." },
      { id: "d", label: "Strong jobs are always bad for stocks; March was an exception", rationale: "Neither direction is always right. Strong jobs help stocks in a growth scare and hurt them in an inflation fight." },
    ],
    correct: "a",
    explanation: "Data move markets through the expected policy response. In a growth scare, strong jobs ease recession fears. When the bank is fighting inflation, the same beat means more hikes: good news is bad news (grade B).",
    lesson: "3.6.3",
    concepts: ["regime-dependent-reaction", "inflation-regime"],
    hints: ["What does strong data imply for the central bank in each case?"],
  },
  {
    id: "q-3.6.3-2",
    topic: "scenario_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "Historical case: in 2022 the S&P 500 lost 18.1% and 20-year US Treasuries lost 26.1%, double-digit losses for both in the same year. Inflation was high and central banks were raising rates fast.",
    prompt: "What does this case show about the stock–bond correlation?",
    options: [
      { id: "a", label: "Bonds stopped working as a hedge forever", rationale: "One regime doesn't settle forever. When growth shocks dominate again, bonds can cushion stocks again." },
      { id: "b", label: "Bonds always fall when stocks fall", rationale: "For most of 2000–2020 the two moved opposite or barely together. The sign depends on the dominant shock." },
      { id: "c", label: "It was a one-off with no economic cause", rationale: "There was a cause: rising inflation and rate hikes push stock and bond prices down together." },
      { id: "d", label: "Its sign depends on the regime: positive when inflation and tight policy dominate" },
    ],
    correct: "d",
    explanation: "Decades of data show the stock–bond correlation is negative when inflation is low and stable, and positive when inflation is high and policy tight (grade A). 2022 was the second kind, so the bond leg added to losses.",
    lesson: "3.6.3",
    concepts: ["stock-bond-correlation"],
    hints: ["What was the dominant shock in 2022: growth or inflation?", "Which way do inflation shocks push stock prices and bond prices?"],
  },
  {
    id: "q-3.6.3-3",
    topic: "scenario_analysis",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "A pre-CPI dashboard: core inflation has been falling for six months. The dot-plot median shows two cuts next year. The curve is steepening out of an inversion. Last week, strong retail sales lifted LABX 0.8% and barely moved LB2.",
    prompt: "Which regime is the market trading?",
    options: [
      { id: "a", label: "Disinflation, with growth the main focus" },
      { id: "b", label: "Inflation fight: good news is bad news", rationale: "In an inflation fight, strong data would have sunk LABX and lifted LB2. Here LABX rose and LB2 barely moved." },
      { id: "c", label: "Crisis: haven demand dominates", rationale: "Nothing here signals stress: no widening spreads, no haven bid. Strong data lifting stocks is a calm-market reaction." },
      { id: "d", label: "Can't tell before the CPI number", rationale: "The regime is read before the release, from recent reactions and policy signals. Here they all point one way." },
    ],
    correct: "a",
    explanation: "Falling inflation, cuts in the dots and strong data lifting stocks without lifting the 2-year all say the bank isn't fighting inflation. With growth the focus, a hot CPI print would matter less than in an inflation fight.",
    lesson: "3.6.3",
    concepts: ["inflation-regime"],
    hints: ["Start with the last reaction: what did strong data do to LABX and LB2?", "Then check the backdrop: inflation's direction and the dots.", "Good news lifting stocks without lifting LB2 rules out an inflation fight."],
  },

  // 3.6.4 · The dollar
  {
    id: "q-3.6.4-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "Over several years, which most consistently pushes a currency higher?",
    options: [
      { id: "a", label: "Rate and growth differentials moving in its favour" },
      { id: "b", label: "A rising stock market at home, whatever happens abroad", rationale: "Stocks can rise everywhere at once. What matters is the home economy relative to others, and the rate gap." },
      { id: "c", label: "Higher inflation at home", rationale: "Higher inflation erodes a currency's value unless rates rise even faster. The differential is what counts." },
      { id: "d", label: "A bigger economy", rationale: "Size isn't the driver. Growth and rates relative to other economies are." },
    ],
    correct: "a",
    explanation: "Money flows toward higher expected returns, so rate and growth differentials drive currencies over time (grade B). In stress, haven and funding demand can dominate.",
    lesson: "3.6.4",
    concepts: ["rate-differential", "dollar-smile"],
  },
  {
    id: "q-3.6.4-2",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "Growth accelerates in every major economy at once. Volatility is low and commodity prices are rising. US growth is steady but no longer the fastest.",
    prompt: "Where is the world on the dollar smile, and what does LDX tend to do?",
    options: [
      { id: "a", label: "Left side: LDX rises", rationale: "The left side needs the US to outgrow the rest. Here the rest of the world is catching up." },
      { id: "b", label: "Right side: LDX rises", rationale: "The right side is a global crisis. Low volatility and rising commodities describe calm, broad growth." },
      { id: "c", label: "Bottom: LDX tends to fall" },
      { id: "d", label: "Off the smile: LDX rises as a haven", rationale: "Nothing here calls for a haven. Calm, synchronised growth sends money abroad." },
    ],
    correct: "c",
    explanation: "Synchronised global growth is the bottom of the smile: returns abroad improve, money flows out of the dollar, and LDX tends to fall. The smile is a grade C tendency.",
    lesson: "3.6.4",
    concepts: ["dollar-smile"],
    hints: ["Is this a US boom, broad growth or a crisis?", "In calm, broad growth, where does money look for better returns?"],
  },
  {
    id: "q-3.6.4-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "Risk-off: LABX falls 6% in two days, yet LDX also falls. What is the most likely reason?",
    options: [
      { id: "a", label: "The dollar has lost its haven role for good", rationale: "One episode doesn't end a role. A funding-currency jump is a known, temporary exception." },
      { id: "b", label: "US growth is accelerating", rationale: "A growth spurt wouldn't fit a 6% two-day fall in stocks. The stress points to a carry unwind." },
      { id: "c", label: "LDX always falls when stocks fall", rationale: "In most crises the dollar has risen. Falling with stocks is the exception, here driven by the funding currency." },
      { id: "d", label: "A funding currency in LDX's basket is jumping as carry trades unwind" },
    ],
    correct: "d",
    explanation: "When a low-rate funding currency jumps, carry traders who borrowed it must buy it back. If it weighs heavily in LDX's basket, LDX falls even in risk-off. Historical case: the yen in summer 2024.",
    lesson: "3.6.4",
    concepts: ["dollar-smile", "carry-unwind"],
    hints: ["Which currency rises when carry trades close?", "Check what's in LDX's basket."],
  },

  // 3.6.5 · Commodities and commodity currencies
  {
    id: "q-3.6.5-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which pairing of a commodity and its main driver is right?",
    options: [
      { id: "a", label: "Gold: industrial demand from manufacturing", rationale: "That's copper. Gold is driven by real yields, the dollar, haven demand and central-bank buying." },
      { id: "b", label: "Oil: central-bank buying", rationale: "Central banks buy gold, not oil. Oil is dominated by supply shocks and global growth." },
      { id: "c", label: "Copper: industrial demand, which makes it a growth gauge" },
      { id: "d", label: "Copper: real yields and haven demand", rationale: "That describes gold. Copper tracks building and manufacturing activity." },
    ],
    correct: "c",
    explanation: "Oil: supply shocks and growth (grade B). Copper: industrial demand, hence 'Dr. Copper'. Gold: real yields, the dollar, haven demand and official buying, a mix that shifts over time.",
    lesson: "3.6.5",
    concepts: ["commodities-in-macro"],
  },
  {
    id: "q-3.6.5-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "A country's main export, iron ore, rises 20% while its import prices stay flat. What happens to its terms of trade, and what does its currency tend to do?",
    options: [
      { id: "a", label: "They worsen; the currency tends to fall", rationale: "Terms of trade are export prices over import prices. Dearer exports improve them." },
      { id: "b", label: "Nothing: terms of trade depend only on volumes", rationale: "Terms of trade are about prices, not volumes. Export prices up 20% with import prices flat: they improve." },
      { id: "c", label: "They improve; the currency must rise", rationale: "It tends to rise; it doesn't have to. Rate differentials and risk appetite often dominate commodity currencies (grade C)." },
      { id: "d", label: "They improve; the currency tends to rise, unless rate differentials dominate" },
    ],
    correct: "d",
    explanation: "Terms of trade = export prices ÷ import prices, here up 20%. National income rises and foreign buyers need more of the currency, so it tends to strengthen. The link is grade C: rate differentials often matter more.",
    lesson: "3.6.5",
    concepts: ["commodity-currencies"],
    hints: ["Terms of trade compare two sets of prices.", "Is the link to the currency a rule or a tendency?"],
  },
  {
    id: "q-3.6.5-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "Historical case: from 2022, real yields rose well above zero. For years before, gold had tended to fall when real yields rose. This time gold climbed.",
    prompt: "Which explanation fits the evidence best?",
    options: [
      { id: "a", label: "Heavy central-bank buying and reserve diversification outweighed the opportunity cost" },
      { id: "b", label: "Gold has no relationship with real yields at all", rationale: "The inverse link held for years (grade B). It broke because another source of demand overwhelmed it." },
      { id: "c", label: "Real yields actually fell in that period", rationale: "Real yields rose clearly above zero. That's what makes the break notable." },
      { id: "d", label: "Gold always rises in years of high inflation", rationale: "Gold's record as an inflation hedge is mixed. The cited driver of this break is official buying." },
    ],
    correct: "a",
    explanation: "Holding gold costs the real yield you give up, so higher real yields usually weigh on it. From 2022, heavy central-bank buying, linked to reserve diversification after sanctions and to geopolitics, outweighed that cost. Relationships drift when a new buyer arrives.",
    lesson: "3.6.5",
    concepts: ["commodities-in-macro", "real-yield"],
    hints: ["What usually makes gold costlier to hold?", "Who else buys gold, besides investors?"],
  },

  // 3.6.6 · Risk-on, risk-off and carry
  {
    id: "q-3.6.6-1",
    topic: "portfolio_exposure",
    kind: "scenario",
    difficulty: 2,
    scenario: "A sudden risk-off shock hits the lab's base regime: volatility doubles and credit spreads widen.",
    prompt: "Which set of first moves is most typical?",
    options: [
      { id: "a", label: "Everything falls, including LBND and LGLD", rationale: "Forced selling can hit havens briefly, but in the base regime bonds and gold are bought for safety." },
      { id: "b", label: "LABX falls; LFX rises as carry looks more attractive", rationale: "In stress, carry traders buy back the funding currency, VFUN, so LFX falls." },
      { id: "c", label: "LABX, LCOM and LFX fall; LDX, LBND and LGLD rise" },
      { id: "d", label: "LDX falls; LCOM rises as a haven", rationale: "A commodity currency is high-beta: it falls with risk appetite. In the base regime LDX rises." },
    ],
    correct: "c",
    explanation: "Risk assets and high-beta currencies fall; carry unwinds push LFX down; havens such as government bonds, gold and, in the base regime, the dollar rise. These are tendencies (grade B); 3.6.4 and 3.6.8 show the exceptions.",
    lesson: "3.6.6",
    concepts: ["risk-on-risk-off"],
    hints: ["Sort the assets into risk assets and havens.", "What do carry traders do with the funding currency in stress?"],
  },
  {
    id: "q-3.6.6-2",
    topic: "portfolio_exposure",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why do correlations between risky assets tend to rise toward 1 in a crisis?",
    options: [
      { id: "a", label: "Investors suddenly agree on fundamentals", rationale: "Fundamentals differ across assets. What's shared is the need to cut risk at the same time." },
      { id: "b", label: "Correlations never change; crises just make them visible", rationale: "Correlations do change, with the dominant shock and with forced flows. That's why diversification fails in stress." },
      { id: "c", label: "Central banks buy all assets equally", rationale: "Central-bank support comes later and isn't uniform. The rise in correlation comes from forced selling." },
      { id: "d", label: "Forced, simultaneous selling: margin calls, volatility targeting and funding stress" },
    ],
    correct: "d",
    explanation: "In a crisis, leverage, volatility-targeting rules and funding needs force many holders to sell at once. They sell what they can, so assets that usually move apart fall together (grade B: documented, but uneven across crises).",
    lesson: "3.6.6",
    concepts: ["correlation-and-concentration", "risk-on-risk-off"],
    hints: ["Think about who is forced to sell, not who wants to."],
  },
  {
    id: "q-3.6.6-3",
    topic: "portfolio_exposure",
    kind: "numeric",
    difficulty: 2,
    prompt: "A carry position of 40,000 vUSD earns 3% a year. The funding currency jumps 4% in a day. How many months of carry does that day erase?",
    numeric: { answer: 16, tolerance: 0.1, unit: "months" },
    explanation: "Carry: 40,000 × 3% = 1,200 a year. Loss: 40,000 × 4% = 1,600. 1,600 ÷ 1,200 = 1.33 years = 16 months. The position size cancels out: months = jump ÷ carry rate × 12.",
    lesson: "3.6.6",
    concepts: ["carry-trade"],
    hints: ["Compute a year of carry and the one-day loss.", "Months lost = loss ÷ yearly carry × 12.", "1,600 ÷ 1,200 × 12 = ?"],
    vary: {
      fields: { pos: [20000, 100000, 5000], r: [1, 6, 0.5], j: [2, 10, 1] },
      answer: "round(j / r * 12, 1)",
      prompt: "A carry position of {pos} vUSD earns {r:1}% a year. The funding currency jumps {j}% in a day. How many months of carry does that day erase?",
      explanation: "Carry: {pos} × {r:1}% = {pos * r / 100:2} a year. Loss: {pos} × {j}% = {pos * j / 100:2}. Months = {pos * j / 100:2} ÷ {pos * r / 100:2} × 12 = {answer:1}.",
      hint: "{pos * j / 100:2} ÷ {pos * r / 100:2} × 12 = ?",
    },
  },

  // 3.6.7 · Business cycle and sector rotation
  {
    id: "q-3.6.7-1",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "PMI new orders are 47 but up 5 points in two months. Jobless claims are falling from a peak, the curve is steep and credit spreads are narrowing from wide levels. Which phase fits best?",
    options: [
      { id: "a", label: "Mid", rationale: "Mid-cycle has new orders steadily above 50 and spreads already tight. Here orders are below 50 but rebounding fast." },
      { id: "b", label: "Late", rationale: "Late cycle has orders falling from high levels and spreads starting to widen. These readings are improving from lows." },
      { id: "c", label: "Recession", rationale: "Orders below 50 fit, but everything has turned up from its worst. That's the start of the early phase." },
      { id: "d", label: "Early" },
    ],
    correct: "d",
    explanation: "Rebounding orders, falling claims, a steep curve and narrowing spreads are the textbook early phase. In real time, though, phase calls are grade C: wait for several readings to agree.",
    lesson: "3.6.7",
    concepts: ["business-cycle"],
    hints: ["Look at the direction of each indicator, not only its level."],
  },
  {
    id: "q-3.6.7-2",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "In the textbook map, which sectors lead in the late phase, and why?",
    options: [
      { id: "a", label: "Technology: steady growth rewards long-run investment", rationale: "That's the textbook mid-cycle leader." },
      { id: "b", label: "Energy and materials: commodity prices tend to peak as capacity runs tight" },
      { id: "c", label: "Staples and utilities: demand for essentials holds up", rationale: "Defensive sectors are the textbook recession leaders." },
      { id: "d", label: "Financials and discretionary: cheap money revives lending and spending", rationale: "That's the textbook early phase, after rates have been cut." },
    ],
    correct: "b",
    explanation: "Late in the cycle, demand presses on tight capacity and commodity prices tend to peak, which favours energy and materials. It's a textbook map; the evidence that trading it pays is weak (grade C).",
    lesson: "3.6.7",
    concepts: ["sector-rotation"],
    hints: ["What tends to be scarce, and pricey, late in an expansion?"],
  },
  {
    id: "q-3.6.7-3",
    topic: "scenario_analysis",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "A backtest shows sector rotation beating buy-and-hold by 2.5 points a year. The phases were dated using data published years later. Each switch costs 0.30% round trip, with about four switches a year.",
    prompt: "What is the main caveat?",
    options: [
      { id: "a", label: "None: 2.5 points a year is a robust edge", rationale: "The phases were dated with hindsight. Real-time calls come late, and costs come off the top." },
      { id: "b", label: "The costs alone wipe out the edge", rationale: "Costs take about 1.2 of the 2.5 points. The hindsight dating is the bigger problem." },
      { id: "c", label: "Phase dating used hindsight; after 1.2 points of costs and late calls, little edge may remain" },
      { id: "d", label: "Rotation fails because sectors don't differ across the cycle", rationale: "Sector leadership does shift. The problem is that you can't date the phases in real time." },
    ],
    correct: "c",
    explanation: "Four switches at 0.30% cost 1.2 points a year. More importantly, phases dated afterwards are recognised only late in real time. Research finds the modest edge mostly disappears after costs and timing errors (grade C).",
    lesson: "3.6.7",
    concepts: ["sector-rotation", "business-cycle"],
    hints: ["When were the phases known: at the time, or later?", "Compute the yearly costs: 4 × 0.30%.", "Then ask what late phase calls would do to the rest."],
  },

  // 3.6.8 · When correlations flip
  {
    id: "q-3.6.8-1",
    topic: "portfolio_exposure",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your 20-day rolling correlation between LABX and LBND reads +0.35 today, up from −0.10 a week ago. Over the past year it averaged −0.40.",
    prompt: "How should you read it?",
    options: [
      { id: "a", label: "The correlation has flipped to +0.35 for good: re-hedge now", rationale: "With 20 observations, readings within about ±0.44 of zero are common by chance. One reading proves little." },
      { id: "b", label: "It rests on 20 pairs of daily returns, so +0.35 is within the noise band around zero: check a longer window and the news flow" },
      { id: "c", label: "It rests on a year of data, so it's reliable", rationale: "A 20-day window uses only the last 20 days. The yearly average is a different number." },
      { id: "d", label: "Ignore it: rolling correlations carry no information", rationale: "They carry information, with noise. A rising reading is a reason to check, not to ignore." },
    ],
    correct: "b",
    explanation: "A 20-day rolling correlation uses 20 pairs of returns. At a true correlation of zero, 95% of such readings fall within about ±0.44, so +0.35 alone isn't proof. Check a longer window and the dominant shock, and size for correlation 1 meanwhile.",
    lesson: "3.6.8",
    concepts: ["rolling-correlation"],
    hints: ["How many observations sit behind a 20-day correlation?", "What range does chance alone produce with 20 pairs?"],
  },
  {
    id: "q-3.6.8-2",
    topic: "portfolio_exposure",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which pairing of a historical correlation break and its cause is right?",
    options: [
      { id: "a", label: "Stocks and bonds, 2022: inflation became the dominant shock, so both fell together" },
      { id: "b", label: "Gold and real yields, 2022–24: real yields fell, so gold rose", rationale: "Real yields rose clearly. Gold climbed anyway, as central banks bought heavily." },
      { id: "c", label: "The yen's haven role: Japan raised rates far above other countries'", rationale: "The reverse: Japan's rates stayed far below others'. Wide rate gaps made the yen a funding currency and weakened its haven role." },
      { id: "d", label: "Stocks and bonds, 2022: a deep recession pushed both down", rationale: "The driver was inflation and fast rate hikes, not a deep recession." },
    ],
    correct: "a",
    explanation: "Correlations follow the dominant shock. In 2022 inflation and hikes pushed stocks and bonds down together. Gold and real yields broke on official buying. The yen's haven role weakened while its rate gap was wide.",
    lesson: "3.6.8",
    concepts: ["correlation-instability"],
    hints: ["For each, ask what the dominant shock, or the new buyer, was."],
  },
  {
    id: "q-3.6.8-3",
    topic: "portfolio_exposure",
    kind: "numeric",
    difficulty: 2,
    prompt: "Your account is 20,000.00 vUSD. In stress you assume both legs of your hedged book fall 8% together, and you accept at most a 2% account loss. What is the largest total value of the two positions?",
    numeric: { answer: 5000, tolerance: 1, unit: "vUSD" },
    explanation: "Maximum loss = 2% × 20,000.00 = 400.00. With correlation 1 the book falls 8% as one: 400.00 ÷ 8% = 5,000.00 in total, 2,500.00 per leg if split evenly.",
    lesson: "3.6.8",
    concepts: ["correlation-instability", "exposure"],
    hints: ["Treat both legs as one position.", "Maximum loss = 2% of the account.", "400.00 ÷ 8% = ?"],
    vary: {
      fields: { acc: [5000, 50000, 5000], f: [5, 20, 1], L: [1, 3, 0.5] },
      answer: "round(acc * L / f, 2)",
      prompt: "Your account is {acc:2} vUSD. In stress you assume both legs of your hedged book fall {f}% together, and you accept at most a {L:1}% account loss. What is the largest total value of the two positions?",
      explanation: "Maximum loss = {L:1}% × {acc:2} = {acc * L / 100:2}. With correlation 1 the book falls {f}% as one: {acc * L / 100:2} ÷ {f}% = {answer:2}.",
      hint: "{acc * L / 100:2} ÷ {f}% = ?",
    },
  },
];


// ─── Glossary terms ─────────────────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "yield",
    term: "Yield",
    definition: "The annual return a bond pays if bought at today's price and held to maturity. For a zero-coupon bond it is the y in price = 100 ÷ (1 + y)^n, so it moves opposite to the price.",
    plain: "The yearly return a bond pays at its current price. When the price falls, the yield rises.",
    related: ["zero-coupon-bond", "real-yield", "bond", "basis-point"],
    lesson: "3.6.1",
    aka: ["Bond yield", "Yield to maturity"],
  },
  {
    id: "real-yield",
    term: "Real yield",
    definition: "A nominal yield minus the inflation expected over the same horizon: what lending earns after inflation.",
    plain: "What a bond pays after taking off expected inflation.",
    related: ["yield", "breakeven-inflation"],
    lesson: "3.6.1",
  },
  {
    id: "breakeven-inflation",
    term: "Breakeven inflation",
    definition: "The inflation rate priced by markets: the yield on a nominal government bond minus the yield on an inflation-protected bond of the same maturity.",
    plain: "The inflation rate the bond market is expecting.",
    related: ["real-yield", "yield", "cpi"],
    lesson: "3.6.1",
  },
  {
    id: "zero-coupon-bond",
    term: "Zero-coupon bond",
    definition: "A bond that pays no coupons, only its face value at maturity. Its price is the face value discounted at its yield: 100 ÷ (1 + y)^n.",
    plain: "A bond that pays 100 at the end and nothing before, so it costs less than 100 today.",
    related: ["yield", "bond"],
    lesson: "3.6.1",
    aka: ["Zero"],
  },
  {
    id: "rate-differential",
    term: "Rate differential",
    definition: "The difference between two currencies' interest rates. Changes in it, measured against what was expected, are a main driver of exchange rates.",
    plain: "How much more one currency's interest rate pays than another's.",
    related: ["carry-trade", "yield"],
    lesson: "3.6.1",
    aka: ["Interest rate differential"],
  },
  {
    id: "yield-curve",
    term: "Yield curve",
    definition: "Government bond yields plotted by maturity, from months to decades. Its slope reflects expected policy rates, growth, inflation and the term premium.",
    plain: "A line of government bond yields from short to long maturities.",
    related: ["inversion", "steepener", "flattener", "term-premium"],
    lesson: "3.6.2",
  },
  {
    id: "inversion",
    term: "Curve inversion",
    definition: "A yield curve with short-term yields above long-term ones, such as a negative 10y–2y spread. Historically a long-lead recession warning, with a variable lag and false alarms.",
    plain: "When short-term bonds pay more than long-term ones: a classic recession warning, but not a timer.",
    related: ["yield-curve", "flattener"],
    lesson: "3.6.2",
    aka: ["Inverted yield curve"],
  },
  {
    id: "steepener",
    term: "Steepener",
    definition: "A curve move that widens the gap between long and short yields: a bull steepener when short yields fall more, a bear steepener when long yields rise more.",
    plain: "When long-term yields rise relative to short-term ones.",
    related: ["flattener", "yield-curve"],
    lesson: "3.6.2",
  },
  {
    id: "flattener",
    term: "Flattener",
    definition: "A curve move that narrows the gap between long and short yields: a bear flattener when short yields rise more, a bull flattener when long yields fall more.",
    plain: "When the gap between long and short yields shrinks.",
    related: ["steepener", "yield-curve", "inversion"],
    lesson: "3.6.2",
  },
  {
    id: "term-premium",
    term: "Term premium",
    definition: "The extra yield investors demand to hold a long bond instead of rolling short ones. Bond supply and central-bank balance sheets can move it.",
    plain: "Extra pay for locking money into a long bond.",
    related: ["yield-curve", "yield"],
    lesson: "3.6.2",
  },
  {
    id: "disinflation",
    term: "Disinflation",
    definition: "A fall in the rate of inflation while it stays positive: prices still rise, but more slowly.",
    plain: "Inflation that is still positive but falling.",
    related: ["cpi", "policy-regime"],
    lesson: "3.6.3",
  },
  {
    id: "policy-regime",
    term: "Policy regime",
    definition: "The central bank's current stance, and the market's reading of it, such as fighting inflation or supporting growth. It decides how assets react to the same data.",
    plain: "What the central bank is mainly trying to do right now.",
    related: ["hawkish", "dovish", "central-bank", "disinflation"],
    lesson: "3.6.3",
  },
  {
    id: "dollar-index",
    term: "Dollar index",
    definition: "An index of the US dollar against a weighted basket of major currencies. In this lab, LDX tracks vUSD the same way.",
    plain: "One number for the dollar's value against several big currencies.",
    related: ["dollar-smile", "safe-haven"],
    lesson: "3.6.4",
    aka: ["LDX"],
  },
  {
    id: "dollar-smile",
    term: "Dollar smile",
    definition: "A framework in which the dollar tends to rise in US booms and in global crises and to fall in synchronised global growth. A tendency with known exceptions, such as carry unwinds.",
    plain: "The idea that the dollar rises in US booms and in global crises, and weakens in between.",
    related: ["dollar-index", "safe-haven", "funding-currency"],
    lesson: "3.6.4",
  },
  {
    id: "safe-haven",
    term: "Safe haven",
    definition: "An asset that tends to hold its value or rise when risky assets fall. Which assets play the role changes with the regime.",
    plain: "Where investors put money when markets get scary.",
    related: ["risk-off", "dollar-smile"],
    lesson: "3.6.4",
    aka: ["Haven"],
  },
  {
    id: "funding-currency",
    term: "Funding currency",
    definition: "A low-interest currency borrowed to finance carry trades. It tends to jump when those trades are unwound.",
    plain: "A cheap currency people borrow to buy higher-paying ones.",
    related: ["carry-trade", "carry-unwind"],
    lesson: "3.6.4",
  },
  {
    id: "terms-of-trade",
    term: "Terms of trade",
    definition: "A country's export prices divided by its import prices. When they rise, national income rises and the currency tends to strengthen.",
    plain: "How much a country's exports buy in imports.",
    related: ["commodity-currency"],
    lesson: "3.6.5",
  },
  {
    id: "commodity-currency",
    term: "Commodity currency",
    definition: "A currency that tends to move with the prices of its country's main commodity exports, through the terms of trade. Rate differentials often matter more.",
    plain: "A currency that tends to follow the price of what its country sells abroad.",
    related: ["terms-of-trade", "risk-on"],
    lesson: "3.6.5",
  },
  {
    id: "copper-gold-ratio",
    term: "Copper-gold ratio",
    definition: "The copper price divided by the gold price: a practitioner gauge of growth expectations that tends to move with long-term yields.",
    plain: "Copper's price over gold's: a rough gauge of growth.",
    related: ["yield", "commodity-currency"],
    lesson: "3.6.5",
  },
  {
    id: "risk-on",
    term: "Risk-on",
    definition: "A market phase in which investors favour equities, credit and high-yield or commodity currencies, and risky assets tend to rise together.",
    plain: "When investors feel brave and buy riskier assets.",
    related: ["risk-off", "carry-trade"],
    lesson: "3.6.6",
  },
  {
    id: "risk-off",
    term: "Risk-off",
    definition: "A market phase in which investors cut risk, selling equities, credit and high-beta currencies and buying government bonds and safe havens. Correlations among risky assets tend to rise.",
    plain: "When investors get scared and move to safer assets.",
    related: ["risk-on", "safe-haven", "correlation"],
    lesson: "3.6.6",
  },
  {
    id: "carry-trade",
    term: "Carry trade",
    definition: "Borrowing a low-interest currency to hold a high-interest one and earn the difference through the swap: small steady gains, with a risk of large, fast losses.",
    plain: "Borrowing cheap money to hold a better-paying currency, and pocketing the gap.",
    related: ["carry", "funding-currency", "carry-unwind", "overnight-financing", "negative-skew"],
    lesson: "3.6.6",
  },
  {
    id: "carry-unwind",
    term: "Carry unwind",
    definition: "Many carry trades closed at once, usually after a jump in volatility or a rally in the funding currency, which drives the funding currency sharply higher.",
    plain: "Everyone exiting carry trades at the same time.",
    related: ["carry-trade", "funding-currency", "risk-off"],
    lesson: "3.6.6",
  },
  {
    id: "business-cycle",
    term: "Business cycle",
    definition: "The economy's recurring but irregular sequence of expansion and contraction, often split into early, mid, late and recession phases. Phases are dated reliably only afterwards.",
    plain: "The economy's ups and downs over several years.",
    related: ["sector-rotation", "credit-spread"],
    lesson: "3.6.7",
    aka: ["Economic cycle"],
  },
  {
    id: "sector-rotation",
    term: "Sector rotation",
    definition: "Shifting money between industry sectors as the business cycle changes. Its edge shrinks after costs and real-time errors in dating the phase.",
    plain: "Moving between sectors as the economy's phase changes.",
    related: ["business-cycle"],
    lesson: "3.6.7",
  },
  {
    id: "credit-spread",
    term: "Credit spread",
    definition: "The extra yield a company bond pays over a government bond of similar maturity. It widens when default fears rise.",
    plain: "The extra interest companies pay to borrow, compared with the government.",
    related: ["financial-conditions", "yield", "business-cycle"],
    lesson: "3.6.7",
  },
  {
    id: "financial-conditions",
    term: "Financial conditions",
    definition: "How easy it is to borrow and raise money, judged from interest rates, credit spreads, stock prices and the currency together.",
    plain: "How easy money is to get right now.",
    related: ["credit-spread", "yield"],
    lesson: "3.6.7",
  },
  {
    id: "rolling-correlation",
    term: "Rolling correlation",
    definition: "A correlation recomputed over a moving window of the most recent observations. Short windows are noisy; long ones lag.",
    plain: "A correlation recalculated as each new bar arrives, using only recent data.",
    related: ["correlation", "correlation-breakdown"],
    lesson: "3.6.8",
  },
  {
    id: "intermarket-analysis",
    term: "Intermarket analysis",
    definition: "The study of how bonds, stocks, commodities and currencies affect each other. Its relationships hold only within a regime.",
    plain: "Studying how bonds, stocks, commodities and currencies affect each other.",
    related: ["correlation", "rolling-correlation"],
    lesson: "3.6.8",
  },
  {
    id: "correlation-breakdown",
    term: "Correlation breakdown",
    definition: "A familiar relationship between two assets weakening or reversing its sign, usually because the dominant shock or buyer has changed.",
    plain: "When two assets that used to move one way start moving another.",
    related: ["correlation", "rolling-correlation", "intermarket-analysis"],
    lesson: "3.6.8",
  },
];

// ─── Concepts ───────────────────────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "bond-price-yield",
    name: "Bond price and yield",
    category: "market_fundamentals",
    summary: "Bond prices fall when yields rise, and long maturities move more for the same change in yield.",
    body: [
      "A zero-coupon bond's price is 100 ÷ (1 + y)^n: the face value discounted at the yield for n years. Raise the yield and every future payment is worth less today, so price and yield always move in opposite directions. That's arithmetic, not a market tendency.",
      "Each extra year is discounted once more, so the same change in yield moves a long bond far more than a short one. Assets whose payoffs lie far in the future, such as fast-growing companies, tend to react like long bonds; that part is a tendency, not arithmetic.",
    ],
    example: "A yield rise from 4% to 5%: a 2-year zero goes from 92.46 to 90.70 (−1.9%), a 10-year from 67.56 to 61.39 (−9.1%), a 30-year from 30.83 to 23.14 (−24.9%).",
    related: ["volatility", "real-yield", "yield-curve"],
    missions: [],
    lessons: ["3.6.1"],
  },
  {
    id: "real-yield",
    name: "Real yield",
    category: "market_fundamentals",
    summary: "A nominal yield minus expected inflation.",
    body: [
      "The real yield is what lending earns after inflation: the nominal yield minus the inflation expected over the same horizon. Markets price expected inflation as breakeven inflation, the gap between nominal and inflation-protected bond yields.",
      "Real yields are the cost of holding assets that pay nothing, such as gold. For years gold tended to fall when real yields rose, until heavy central-bank buying broke the link from 2022.",
    ],
    example: "A 10-year yield of 4.50% with 2.50% expected inflation: real yield ≈ 2.00% (exactly 1.045 ÷ 1.025 − 1 = 1.95%).",
    related: ["bond-price-yield", "commodities-in-macro"],
    missions: [],
    lessons: ["3.6.1", "3.6.5"],
  },
  {
    id: "rate-differential",
    name: "Rate differential",
    category: "market_fundamentals",
    summary: "The gap between two currencies' interest rates, a main driver of exchange rates.",
    body: [
      "A currency pays its holder that currency's interest rate. When one central bank raises rates against another's, holding its currency pays more, money tends to flow in and the pair tends to rise. What matters is the change against what was expected.",
      "The link is moderate (grade B): risk appetite, flows and haven demand can dominate, especially in stress. The same gap is what a carry trade earns, and what it can lose in an unwind.",
    ],
    example: "LCB lifts vUSD rates while VFUN stays at 0%: the differential widens, and LFX, vUSD priced in VFUN, tends to rise.",
    related: ["carry-trade", "dollar-smile"],
    missions: [],
    lessons: ["3.6.1", "3.6.4"],
  },
  {
    id: "yield-curve",
    name: "Yield curve",
    category: "market_fundamentals",
    summary: "Yields across maturities; its slope reflects expected policy, growth, inflation and the term premium.",
    body: [
      "The yield curve plots government bond yields by maturity. Normally longer maturities pay more. A flat curve pays about the same everywhere; an inverted one pays more at the short end, usually because the market expects policy rates to fall.",
      "An inversion has come before every US recession since the 1950s, usually 6 to 24 months ahead, with false alarms (grade B). As a timing signal for stocks it is grade D: equities have often risen for months after an inversion.",
    ],
    example: "3-month 5.10%, LB2 4.80%, LB10 4.20%: 10y–3m = −90 bp and 10y–2y = −60 bp. The curve is inverted.",
    related: ["curve-moves", "term-premium", "base-rates", "business-cycle"],
    missions: [],
    lessons: ["3.6.2"],
  },
  {
    id: "curve-moves",
    name: "Steepeners and flatteners",
    category: "market_fundamentals",
    summary: "Bull or bear changes in curve slope, named by which end of the curve moves more.",
    body: [
      "Bull means yields fall (bond prices rise); bear means yields rise. A steepener widens the 10y–2y spread; a flattener narrows it. So a bull steepener has short yields falling more, a bear flattener short yields rising more, a bear steepener long yields rising more and a bull flattener long yields falling more.",
      "Rate hikes being priced in usually bear-flatten the curve; cuts being priced in usually bull-steepen it.",
    ],
    example: "LB2 −0.60, LB10 −0.20: yields fell and the spread widened by 0.40, a bull steepener.",
    related: ["yield-curve", "term-premium"],
    missions: [],
    lessons: ["3.6.2"],
  },
  {
    id: "term-premium",
    name: "Term premium",
    category: "market_fundamentals",
    summary: "Extra yield investors demand to hold long bonds instead of rolling short ones.",
    body: [
      "A long yield is roughly the average of expected short rates plus a term premium: pay for locking money up for years and bearing the larger price swings of a long bond.",
      "Heavy bond supply, from large deficits and auctions, or a central bank shrinking its bond holdings can lift the term premium. The curve then steepens with no change in the growth outlook, which muddies its signal.",
    ],
    example: "If short rates are expected to average 3.80% over 10 years and LB10 yields 4.20%, the term premium is roughly 0.40 points.",
    related: ["yield-curve", "curve-moves"],
    missions: [],
    lessons: ["3.6.2"],
  },
  {
    id: "inflation-regime",
    name: "Inflation regime",
    category: "scenario_analysis",
    summary: "The inflation and policy backdrop that decides how assets react to the same data.",
    body: [
      "Inflation comes from demand, cost shocks, wages and expectations, but markets feel it mainly through the central bank's response. High inflation means a bank fighting it; disinflation lets it ease.",
      "Read the regime before predicting any reaction: from the inflation trend, the bank's guidance, the curve, and above all from how markets reacted to recent data.",
    ],
    example: "Strong retail sales sink LABX 1.1%: the market reads good news as more hikes. That's an inflation-fight regime.",
    related: ["market-regime", "regime-dependent-reaction", "stock-bond-correlation"],
    missions: [],
    lessons: ["3.6.3"],
  },
  {
    id: "stock-bond-correlation",
    name: "Stock-bond correlation",
    category: "portfolio_exposure",
    summary: "The co-movement of equities and government bonds; its sign changes with the monetary regime.",
    body: [
      "When growth shocks dominate and inflation is low, bond prices tend to rise as stocks fall: the correlation is negative and bonds hedge equities. When inflation and tight policy dominate, both fall together and the correlation turns positive (grade A, decades of data).",
      "Historical case: in 2022 the S&P 500 lost 18.1% and 20-year US Treasuries 26.1%, double-digit losses in the same year, with inflation the dominant shock.",
    ],
    example: "A 60/40 portfolio with LABX −12% and LBND −8% loses 0.6 × (−12%) + 0.4 × (−8%) = −10.4%.",
    related: ["correlation-and-concentration", "inflation-regime", "correlation-instability"],
    missions: [],
    lessons: ["3.6.3", "3.6.8"],
  },
  {
    id: "regime-dependent-reaction",
    name: "Regime-dependent reaction",
    category: "scenario_analysis",
    summary: "The same release moves assets differently depending on what the market fears most.",
    body: [
      "Strong data lift expected profits and the expected path of rates at the same time. In a growth scare the first effect wins and stocks rise; when the central bank is fighting inflation the second wins: good news is bad news (grade B).",
      "A fixed rule applied in every regime (grade D) fails exactly when the regime changes. Name the regime first, then predict.",
    ],
    example: "Payrolls beat by z = +1.5. Inflation fight: LABX 100.00 → 98.80, with LB2 +0.12. Growth scare: LABX 100.00 → 101.00. Simulator settings.",
    related: ["news-surprise", "inflation-regime", "market-regime"],
    missions: [],
    lessons: ["3.6.3"],
  },
  {
    id: "dollar-smile",
    name: "Dollar smile",
    category: "market_fundamentals",
    summary: "The dollar tends to rise in US booms and in global stress and to fall in synchronised global growth.",
    body: [
      "On the left of the smile, a US boom draws capital in. At the bottom, growth everywhere sends money abroad. On the right, a global crisis drives demand for safety and for dollars to repay dollar debts.",
      "It's a practitioner framework (grade C). The known exception is a funding-currency unwind: when a low-rate currency in the basket jumps as carry trades close, the dollar index can fall in risk-off.",
    ],
    example: "Risk-off begins and LDX rises to 100.60; then VFUN jumps as carry unwinds and LDX falls to 98.60.",
    related: ["rate-differential", "safe-haven", "carry-unwind"],
    missions: [],
    lessons: ["3.6.4"],
  },
  {
    id: "safe-haven",
    name: "Safe haven",
    category: "portfolio_exposure",
    summary: "An asset that tends to gain in stress; which assets play the role changes with the regime.",
    body: [
      "Government bonds, gold, the dollar and some funding currencies have tended to rise when risky assets fall, as investors seek safety and close leveraged positions.",
      "The role isn't permanent. Bonds failed as a haven in 2022's inflation shock, and the yen's haven role weakened while its rate gap with other currencies was wide.",
    ],
    example: "In the lab's base regime, a risk-off shock lifts LBND, LGLD and LDX while LABX falls.",
    related: ["dollar-smile", "risk-on-risk-off", "correlation-instability"],
    missions: [],
    lessons: ["3.6.4", "3.6.6"],
  },
  {
    id: "commodities-in-macro",
    name: "Commodities in macro",
    category: "market_fundamentals",
    summary: "Oil, copper and gold as macro signals: supply and growth, industrial demand, real yields and official buying.",
    body: [
      "Oil is dominated by supply shocks and global growth (grade B). Copper follows industrial demand, which makes it a growth gauge; the copper–gold ratio tends to move with long yields (grade C). Gold reacts to real yields, the dollar, haven demand and central-bank buying.",
      "These drivers shift. From 2022 gold rose despite positive real yields, as central banks bought heavily.",
    ],
    example: "A surprise oil inventory draw, in a synthetic replay: LOIL +2.4% and LCOM, an oil exporter's currency, +0.6% in the first hour.",
    related: ["real-yield", "commodity-currencies"],
    missions: [],
    lessons: ["3.6.5"],
  },
  {
    id: "commodity-currencies",
    name: "Commodity currencies",
    category: "market_fundamentals",
    summary: "Currencies whose terms of trade follow the prices of their main commodity exports.",
    body: [
      "When a country's main export gets dearer, its terms of trade improve, national income rises and foreign buyers need more of its currency, so the currency tends to strengthen.",
      "The link is grade C: rate differentials and risk appetite often dominate. Commodity currencies are also high-beta: they tend to fall in risk-off.",
    ],
    example: "Iron ore +20% with import prices flat: the terms of trade rise 20%, and the exporter's currency tends to rise, unless rate differentials pull the other way.",
    related: ["commodities-in-macro", "rate-differential", "risk-on-risk-off"],
    missions: [],
    lessons: ["3.6.5"],
  },
  {
    id: "risk-on-risk-off",
    name: "Risk-on / risk-off",
    category: "portfolio_exposure",
    summary: "A regime in which assets move together with global risk appetite.",
    body: [
      "In risk-on, investors favour equities, credit and high-yield or commodity currencies. In risk-off they sell them and buy government bonds and havens; carry pairs fall as funding currencies are bought back.",
      "In a crisis, forced selling through margin calls, volatility targeting and funding stress pushes correlations among risky assets toward 1 (grade B). Diversification thins out exactly when you need it.",
    ],
    example: "A risk-off shock in the base regime: LABX, LCOM and LFX fall; LDX, LBND and LGLD rise.",
    related: ["correlation-and-concentration", "safe-haven", "carry-unwind"],
    missions: [],
    lessons: ["3.6.6"],
  },
  {
    id: "carry-trade",
    name: "Carry trade",
    category: "portfolio_exposure",
    summary: "Borrowing a low-yield currency to hold a high-yield one: small steady gains, rare large losses.",
    body: [
      "A carry trade earns the rate differential through the swap every day. Over long samples its average return has been positive, with negative skew and crash risk (grade A).",
      "Size carry for the jump, not for the daily gain: a single day's rally in the funding currency can erase more than a year of carry.",
    ],
    example: "50,000 vUSD at a 4% rate gap earns 2,000 a year, about 5.48 a day. A 5% jump in the funding currency costs 2,500: about 456 days of carry.",
    related: ["return-skew", "carry-unwind", "overnight-financing", "rate-differential"],
    missions: ["M05"],
    lessons: ["3.6.6"],
  },
  {
    id: "carry-unwind",
    name: "Carry unwind",
    category: "portfolio_exposure",
    summary: "A fast reversal of carry positions when volatility jumps or the funding currency rallies.",
    body: [
      "When volatility jumps or the funding currency starts to rise, carry traders close positions at once, buying back the funding currency. The rally feeds on itself as more stops and margin calls are hit.",
      "An unwind can break other relationships: the dollar index can fall in risk-off if the funding currency weighs heavily in its basket. Historical case: in summer 2024, a Bank of Japan rate rise and a jump in the yen forced yen-funded carry trades to unwind within days.",
    ],
    example: "104 synthetic weeks of carry: 78 gains, none above +0.57%. The three worst weeks lost 11.5 points together.",
    related: ["carry-trade", "dollar-smile", "drawdown"],
    missions: [],
    lessons: ["3.6.6"],
  },
  {
    id: "business-cycle",
    name: "Business cycle",
    category: "scenario_analysis",
    summary: "Expansion and contraction phases that are identified reliably only in hindsight.",
    body: [
      "Textbook phases: early (new orders rebound, claims fall, a steep curve, narrowing spreads), mid (steady growth), late (growth slows, claims turn up, the curve flattens or inverts, spreads widen) and recession (new orders well below 50, rising claims, wide spreads).",
      "Real-time phase calls are grade C: the same three months of data can be a mid-cycle pause or the turn, and only later data tell them apart.",
    ],
    example: "By NBER dating for 1945–2020, US expansions averaged about 64 months and contractions about 10.",
    related: ["yield-curve", "sector-rotation", "credit-spreads"],
    missions: [],
    lessons: ["3.6.7"],
  },
  {
    id: "sector-rotation",
    name: "Sector rotation",
    category: "scenario_analysis",
    summary: "Shifting sector leadership through the cycle; the edge shrinks after costs and timing errors.",
    body: [
      "The textbook map: cyclicals such as consumer discretionary, financials and industrials lead early; technology mid; energy and materials late; staples, utilities and health care in recession.",
      "Research finds a modest edge when phases are dated in hindsight, which mostly disappears after switching costs and realistic timing errors (grade C).",
    ],
    example: "Synthetic: hindsight rotation beats buy-and-hold by 2.4 points a year; four switches at 0.30% cost 1.2; late calls cost 1.0. Edge left: 0.2 points.",
    related: ["business-cycle", "trading-costs"],
    missions: [],
    lessons: ["3.6.7"],
  },
  {
    id: "credit-spreads",
    name: "Credit spreads",
    category: "scenario_analysis",
    summary: "Corporate minus government yields: a gauge of default risk and financial conditions.",
    body: [
      "A credit spread is what a company pays over the government to borrow. It widens when lenders fear defaults and narrows as they relax, so it's a core input to financial conditions, along with rates, stocks and the currency.",
      "'Credit leads equities' is a practitioner observation (grade C). Sometimes spreads widen first, sometimes not: test it before relying on it.",
    ],
    example: "In a synthetic stress episode, credit spreads widen from about 1.10% to 2.30% in six days while a volatility index jumps from about 15 to 37.2.",
    related: ["business-cycle", "risk-on-risk-off"],
    missions: [],
    lessons: ["3.6.7"],
  },
  {
    id: "correlation-instability",
    name: "Correlation instability",
    category: "portfolio_exposure",
    summary: "Correlations change sign and size with the dominant shock and often rise toward 1 in crises.",
    body: [
      "Correlations are footprints of the dominant shock. Growth shocks push stocks and yields the same way, so stock and bond prices move apart; inflation and policy shocks push both prices down together (grade A for regime dependence).",
      "Historical breaks: the stock–bond correlation turned positive in 2022; gold stopped tracking real yields from 2022; the yen's haven role weakened while rate gaps were wide. Risk rule: in stress, size as if correlation were 1.",
    ],
    example: "LABX 5,000 + LBND 5,000. Growth scare: −500 + 200 = −300. Inflation shock: −500 − 400 = −900, 9% of a 10,000 account.",
    related: ["correlation-and-concentration", "stock-bond-correlation", "portfolio-heat", "exposure"],
    missions: ["M05"],
    lessons: ["3.6.8"],
  },
  {
    id: "rolling-correlation",
    name: "Rolling correlation",
    category: "portfolio_exposure",
    summary: "A correlation recomputed over a moving window; short windows are noisy, long ones lag.",
    body: [
      "A 20-bar rolling correlation rests on 20 pairs of returns. At a true correlation of zero, 95% of such readings fall within about ±0.44; for 60 bars, within about ±0.25.",
      "Short windows flag a regime change sooner but give false alarms; long windows are steadier but late. State the window, and so the number of observations, whenever you quote one.",
    ],
    example: "Synthetic switch at bar 80: the 20-bar correlation first closes above zero at bar 89, the 60-bar at bar 115.",
    related: ["correlation-instability", "sample-size"],
    missions: [],
    lessons: ["3.6.8"],
  },
  {
    id: "intermarket-relationships",
    name: "Intermarket relationships",
    category: "portfolio_exposure",
    summary: "Links among bonds, stocks, commodities and the dollar that hold only within a regime.",
    body: [
      "The classic map, built in inflation-era markets: stocks and bonds move together; commodities move opposite to bonds and to the dollar. From the late 1990s, with deflation the fear, stocks and bonds decoupled; 2022 flipped them back.",
      "As fixed laws these relationships are grade D; as regime-dependent tendencies, grade C. Check which shock dominates before relying on any of them.",
    ],
    example: "In 2022 stocks and long bonds both fell by double digits: what the classic inflation-era map predicts, and what 2000–2020 experience didn't.",
    related: ["correlation-instability", "stock-bond-correlation", "market-regime"],
    missions: [],
    lessons: ["3.6.8"],
  },
];

export const UNIT_3_6: UnitContent = {
  lessons: [L361, L362, L363, L364, L365, L366, L367, L368],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
