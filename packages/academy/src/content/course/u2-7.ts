import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, Question, TaskData, UnitContent } from "../../types";

/** Unit 2.7 · Managing the trade (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */

type Cards = NonNullable<TaskData["cards"]>;
type Options = NonNullable<TaskData["options"]>;

/** One candle, in price units with 2 decimals. */
const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

// ─── Chart data ─────────────────────────────────────────────────────────────

/**
 * 2.7.1: a double bottom on LABX 1H. Lows 96.00 (index 5) and 96.20 (index 14), peak 99.00 (index 10), higher
 * low 98.30 (index 19); index 21 closes at 99.30, above the peak (ask 99.35). A buy limit at 96.40 fills in
 * index 14 (ask 96.25 at the low). Under the veil: the dip in hour 2 stops at 99.12 (ask 99.17), so a buy limit at
 * 99.10 never fills; hour 7 reaches 101.10 (bid 101.05), past the 100.95 target. No bid reaches 98.20.
 */
const DB: CandleData[] = [
  k(99.6, 99.8, 99.2, 99.3),
  k(99.3, 99.4, 98.6, 98.7),
  k(98.7, 98.8, 97.9, 98.0),
  k(98.0, 98.1, 97.2, 97.3),
  k(97.3, 97.4, 96.5, 96.6),
  k(96.6, 96.8, 96.0, 96.5),
  k(96.5, 97.2, 96.4, 97.1),
  k(97.1, 97.8, 97.0, 97.7),
  k(97.7, 98.4, 97.6, 98.3),
  k(98.3, 98.9, 98.2, 98.8),
  k(98.8, 99.0, 98.5, 98.6),
  k(98.6, 98.7, 97.9, 98.0),
  k(98.0, 98.1, 97.3, 97.4),
  k(97.4, 97.5, 96.7, 96.8),
  k(96.8, 96.9, 96.2, 96.4),
  k(96.4, 97.1, 96.3, 97.0),
  k(97.0, 97.7, 96.9, 97.6),
  k(97.6, 98.4, 97.5, 98.3),
  k(98.3, 98.8, 98.25, 98.7),
  k(98.7, 98.75, 98.3, 98.4),
  k(98.4, 98.9, 98.35, 98.85),
  k(98.85, 99.4, 98.8, 99.3),
  // under the veil
  k(99.3, 99.7, 99.2, 99.6),
  k(99.6, 99.65, 99.12, 99.2),
  k(99.2, 99.6, 99.15, 99.55),
  k(99.55, 100.1, 99.5, 100.0),
  k(100.0, 100.5, 99.9, 100.4),
  k(100.4, 100.9, 100.3, 100.8),
  k(100.8, 101.1, 100.7, 101.0),
  k(101.0, 101.2, 100.8, 100.9),
];
const DB_PATTERN: ChartLayer[] = [
  { kind: "marker", index: 5, at: "low", label: "LOW 96.00", role: "neutral" },
  { kind: "marker", index: 10, at: "high", label: "PEAK 99.00", role: "neutral" },
  { kind: "marker", index: 14, at: "low", label: "LOW 96.20", role: "neutral" },
];
const DB_TARGET: ChartLayer = { kind: "level", price: 100.95, role: "target", label: "TARGET 100.95" };

/**
 * 2.7.2: a long of 50 at 50.00 (ask; index 3 closes at 49.95), stop 48.00. Higher lows 50.60 (index 8) and
 * 52.10 (index 13); index 15 closes at 53.95, so 25 more fill at the ask, 54.00. No bid reaches 48.00 before
 * the add, or 51.00 after it.
 */
const PY: CandleData[] = [
  k(49.4, 49.7, 49.2, 49.6),
  k(49.6, 49.9, 49.4, 49.5),
  k(49.5, 49.8, 49.3, 49.7),
  k(49.7, 50.1, 49.6, 49.95),
  k(49.95, 50.6, 49.85, 50.5),
  k(50.5, 51.1, 50.4, 51.0),
  k(51.0, 51.5, 50.8, 51.3),
  k(51.3, 51.4, 50.7, 50.9),
  k(50.9, 51.2, 50.6, 50.8),
  k(50.8, 51.6, 50.75, 51.5),
  k(51.5, 52.2, 51.4, 52.1),
  k(52.1, 52.7, 52.0, 52.6),
  k(52.6, 53.0, 52.3, 52.5),
  k(52.5, 52.7, 52.1, 52.3),
  k(52.3, 53.2, 52.2, 53.1),
  k(53.1, 54.1, 53.0, 53.95),
  k(53.95, 54.6, 53.8, 54.5),
  k(54.5, 55.0, 54.2, 54.8),
  k(54.8, 55.2, 54.3, 54.4),
  k(54.4, 55.6, 54.3, 55.5),
];
const PY_LOT1: ChartLayer = { kind: "level", price: 50.0, role: "entry", label: "LOT 1 · 50 AT 50.00" };
const PY_LOT2: ChartLayer = { kind: "level", price: 54.0, role: "entry", label: "LOT 2 · 25 AT 54.00" };
const PY_OLD_STOP: ChartLayer = { kind: "path", role: "down", label: "STOP 48.00", points: [{ index: 3.5, price: 48.0 }, { index: 15.5, price: 48.0 }] };
const PY_LOWS: ChartLayer[] = [
  { kind: "marker", index: 8, at: "low", label: "HL 50.60", role: "accent" },
  { kind: "marker", index: 13, at: "low", label: "HL 52.10", role: "accent" },
];
const PY_NEW_STOP: ChartLayer = { kind: "path", role: "down", label: "SHARED STOP 51.00", points: [{ index: 15.5, price: 51.0 }, { index: 19, price: 51.0 }] };

/**
 * 2.7.3: two rallies stall at 104.50 (index 4) and 104.40 (index 8), the resistance zone 104.20–104.60; swing low
 * 98.30 (index 15); the last candle closes at 100.00. True ranges of the last 14 candles sum to 16.80: ATR(14) 1.20.
 */
const TG: CandleData[] = [
  k(99.6, 100.6, 99.3, 100.3),
  k(100.3, 101.5, 100.1, 101.3),
  k(101.3, 102.5, 101.0, 102.2),
  k(102.2, 103.4, 101.9, 103.1),
  k(103.1, 104.5, 102.9, 103.6),
  k(103.6, 103.9, 102.7, 102.9),
  k(102.9, 103.2, 102.0, 102.4),
  k(102.4, 103.5, 102.3, 103.4),
  k(103.4, 104.4, 103.2, 103.5),
  k(103.5, 103.8, 102.5, 102.7),
  k(102.7, 103.0, 101.7, 101.9),
  k(101.9, 102.2, 101.0, 101.2),
  k(101.2, 101.5, 100.2, 100.5),
  k(100.5, 100.7, 99.5, 99.6),
  k(99.6, 99.9, 98.7, 98.9),
  k(98.9, 99.5, 98.3, 99.3),
  k(99.3, 100.1, 99.0, 99.8),
  k(99.8, 100.2, 99.1, 99.4),
  k(99.4, 100.3, 99.2, 100.0),
];
const TG_ZONE: ChartLayer = { kind: "zone", from: 104.2, to: 104.6, role: "resistance", label: "RESISTANCE 104.20–104.60" };

/**
 * 2.7.4: one long of LABX from 50.00 (index 21 closes at 49.95, ask 50.00), initial stop 48.00, 1R = 2.00 per unit.
 * ATR(14) at entry is 0.80 (true ranges of indexes 8–21 sum to 11.20); the trails hold it fixed. Each stop is set at
 * the previous close and fills when the bid (mid − 0.05) reaches it:
 * - chandelier 2 ATR (highest high since entry − 1.60): out at 50.80 in index 28 (low 50.70): +0.40R, 7 candles;
 *   highest high 52.40, so MFE 1.20R and giveback 0.80R;
 * - chandelier 3 ATR (− 2.40): out at 53.80 in index 46 (low 53.20): +1.90R, 25 candles; MFE 3.10R (high 56.20), giveback 1.20R;
 * - structure, 0.10 under each swing low confirmed by two higher lows on each side (50.70 at index 28, 54.20 at
 *   index 38): out at 54.10 in index 45 (low 53.90): +2.05R, 24 candles, giveback 1.05R;
 * - close under EMA 20: index 46 closes at 53.47 under the EMA's 53.72, sold at the bid 53.42: +1.71R, 25 candles,
 *   giveback 1.39R. No earlier close after entry is under the EMA.
 */
const TR: CandleData[] = [
  k(47.0, 47.5, 46.7, 47.3),
  k(47.3, 47.8, 47.0, 47.6),
  k(47.6, 48.0, 47.2, 47.4),
  k(47.4, 47.9, 47.1, 47.8),
  k(47.8, 48.4, 47.6, 48.2),
  k(48.2, 48.6, 47.8, 48.0),
  k(48.0, 48.5, 47.7, 48.4),
  k(48.4, 49.0, 48.2, 48.8),
  k(48.8, 49.2, 48.4, 48.6),
  k(48.6, 49.0, 48.2, 48.9),
  k(48.9, 49.4, 48.6, 49.2),
  k(49.2, 49.5, 48.7, 48.9),
  k(48.9, 49.3, 48.5, 49.1),
  k(49.1, 49.6, 48.8, 49.4),
  k(49.4, 49.8, 49.0, 49.2),
  k(49.2, 49.6, 48.8, 49.5),
  k(49.5, 50.0, 49.2, 49.7),
  k(49.7, 50.0, 49.2, 49.4),
  k(49.4, 49.8, 49.0, 49.1),
  k(49.1, 49.5, 48.7, 49.3),
  k(49.3, 49.9, 49.1, 49.6),
  k(49.6, 50.1, 49.3, 49.95),
  k(49.95, 50.6, 49.8, 50.5),
  k(50.5, 51.2, 50.3, 51.0),
  k(51.0, 51.7, 50.8, 51.5),
  k(51.5, 52.1, 51.3, 51.9),
  k(51.9, 52.4, 51.6, 52.0),
  k(52.0, 52.2, 51.3, 51.5),
  k(51.5, 51.7, 50.7, 50.9),
  k(50.9, 51.4, 50.75, 51.3),
  k(51.3, 52.0, 51.1, 51.8),
  k(51.8, 52.6, 51.6, 52.4),
  k(52.4, 53.2, 52.2, 53.0),
  k(53.0, 53.8, 52.8, 53.6),
  k(53.6, 54.3, 53.3, 54.0),
  k(54.0, 54.8, 53.8, 54.6),
  k(54.6, 55.2, 54.3, 54.8),
  k(54.8, 55.0, 54.4, 54.5),
  k(54.5, 54.6, 54.2, 54.4),
  k(54.4, 54.9, 54.3, 54.8),
  k(54.8, 55.4, 54.5, 55.2),
  k(55.2, 55.8, 55.0, 55.6),
  k(55.6, 56.2, 55.4, 55.9),
  k(55.9, 56.0, 55.2, 55.4),
  k(55.4, 55.6, 54.6, 54.8),
  k(54.8, 55.0, 53.9, 54.1),
  k(54.1, 54.3, 53.2, 53.47),
  k(53.47, 53.6, 52.6, 52.8),
  k(52.8, 53.1, 52.2, 52.5),
  k(52.5, 52.8, 51.9, 52.1),
];
/** EMA 20 of TR's closes, seeded with the SMA of the first 20, rounded to the cent. */
const TR_EMA20: (number | null)[] = [
  null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 48.69, 48.78, 48.89, 49.04, 49.23,
  49.44, 49.68, 49.9, 50.05, 50.13, 50.24, 50.39, 50.58, 50.81, 51.08, 51.36, 51.67, 51.96, 52.21, 52.41, 52.64, 52.89, 53.14, 53.41, 53.6, 53.71,
  53.75, 53.72, 53.63, 53.53, 53.39,
];
type PathLayer = Extract<ChartLayer, { kind: "path" }>;
const TR_ENTRY: ChartLayer = { kind: "level", price: 50.0, role: "entry", label: "ENTRY 50.00" };
const TR_CH2: PathLayer = {
  kind: "path",
  role: "down",
  label: "2 ATR",
  points: [
    { index: 21.5, price: 48.0 },
    { index: 22.5, price: 48.0 },
    { index: 22.5, price: 49.0 },
    { index: 23.5, price: 49.0 },
    { index: 23.5, price: 49.6 },
    { index: 24.5, price: 49.6 },
    { index: 24.5, price: 50.1 },
    { index: 25.5, price: 50.1 },
    { index: 25.5, price: 50.5 },
    { index: 26.5, price: 50.5 },
    { index: 26.5, price: 50.8 },
    { index: 28, price: 50.8 },
  ],
};
const TR_CH3: PathLayer = {
  kind: "path",
  role: "concept",
  label: "3 ATR",
  points: [
    { index: 21.5, price: 48.0 },
    { index: 22.5, price: 48.0 },
    { index: 22.5, price: 48.2 },
    { index: 23.5, price: 48.2 },
    { index: 23.5, price: 48.8 },
    { index: 24.5, price: 48.8 },
    { index: 24.5, price: 49.3 },
    { index: 25.5, price: 49.3 },
    { index: 25.5, price: 49.7 },
    { index: 26.5, price: 49.7 },
    { index: 26.5, price: 50.0 },
    { index: 31.5, price: 50.0 },
    { index: 31.5, price: 50.2 },
    { index: 32.5, price: 50.2 },
    { index: 32.5, price: 50.8 },
    { index: 33.5, price: 50.8 },
    { index: 33.5, price: 51.4 },
    { index: 34.5, price: 51.4 },
    { index: 34.5, price: 51.9 },
    { index: 35.5, price: 51.9 },
    { index: 35.5, price: 52.4 },
    { index: 36.5, price: 52.4 },
    { index: 36.5, price: 52.8 },
    { index: 40.5, price: 52.8 },
    { index: 40.5, price: 53.0 },
    { index: 41.5, price: 53.0 },
    { index: 41.5, price: 53.4 },
    { index: 42.5, price: 53.4 },
    { index: 42.5, price: 53.8 },
    { index: 46, price: 53.8 },
  ],
};
/** The 3-ATR trail through index 42, at the stop set at index 41's close (53.40), for the "your turn" beat. */
const TR_CH3_TO_42: PathLayer = { ...TR_CH3, points: TR_CH3.points.slice(0, 28) };
/** No label: it would sit on top of the 3-ATR label at the end of the chart; the step text names it. */
const TR_STRUCTURE: PathLayer = {
  kind: "path",
  role: "accent",
  points: [
    { index: 21.5, price: 48.0 },
    { index: 30.5, price: 48.0 },
    { index: 30.5, price: 50.6 },
    { index: 40.5, price: 50.6 },
    { index: 40.5, price: 54.1 },
    { index: 45, price: 54.1 },
  ],
};

/**
 * 2.7.5: a long of 50 at 100.00 (index 5 closes at 99.95), stop 98.00, target 104.00 (+2R). Hour 4 (index 9) reaches
 * 102.30, a bid of 102.25, past +1R: the rule moves the stop to 100.00 at its close. Hour 7 (index 12) dips to 100.03,
 * a bid of 99.98, so the stop fills at 100.00. Hour 12 (index 17) reaches 104.30, a bid of 104.25: the target.
 * No bid reaches 98.00.
 */
const BE: CandleData[] = [
  k(99.2, 99.6, 99.0, 99.5),
  k(99.5, 99.9, 99.3, 99.4),
  k(99.4, 99.8, 99.1, 99.7),
  k(99.7, 100.1, 99.5, 99.6),
  k(99.6, 100.0, 99.4, 99.8),
  k(99.8, 100.2, 99.6, 99.95),
  // under the veil
  k(99.95, 100.7, 99.85, 100.6),
  k(100.6, 101.3, 100.5, 101.2),
  k(101.2, 101.9, 101.1, 101.8),
  k(101.8, 102.3, 101.6, 102.1),
  k(102.1, 102.2, 101.3, 101.4),
  k(101.4, 101.5, 100.6, 100.7),
  k(100.7, 100.9, 100.03, 100.4),
  k(100.4, 101.2, 100.3, 101.1),
  k(101.1, 102.0, 101.0, 101.9),
  k(101.9, 102.8, 101.8, 102.7),
  k(102.7, 103.6, 102.6, 103.5),
  k(103.5, 104.3, 103.4, 104.2),
  k(104.2, 104.4, 103.8, 103.9),
];

/**
 * 2.7.7: a long of 50 at 100.00 (index 3 closes at 99.95), stop 98.00. Over bars 1–10 (indexes 4–13) the highest
 * high is 100.90 (index 9): MFE 0.45R. Bar 10 closes at 99.65, so a time stop sells at the bid, 99.60: −0.20R before
 * costs. Held instead, bar 13 (index 16) reaches 97.90, a bid of 97.85: stopped at 98.00, −1R.
 */
const TS: CandleData[] = [
  k(99.4, 99.8, 99.2, 99.7),
  k(99.7, 100.0, 99.5, 99.6),
  k(99.6, 100.1, 99.4, 99.9),
  k(99.9, 100.2, 99.7, 99.95),
  k(99.95, 100.6, 99.8, 100.5),
  k(100.5, 100.8, 100.2, 100.3),
  k(100.3, 100.5, 99.8, 99.9),
  k(99.9, 100.2, 99.5, 99.7),
  k(99.7, 100.4, 99.6, 100.3),
  k(100.3, 100.9, 100.1, 100.4),
  k(100.4, 100.5, 99.7, 99.8),
  k(99.8, 100.1, 99.3, 99.5),
  k(99.5, 100.0, 99.2, 99.9),
  k(99.9, 100.1, 99.5, 99.65),
  k(99.65, 99.8, 99.0, 99.1),
  k(99.1, 99.3, 98.4, 98.6),
  k(98.6, 98.8, 97.9, 98.1),
];

/**
 * 2.7.8: the 20-trade sample as a dot plot. Slots only (hideCandles); each dot's height is the trade's MAE in R.
 * Winners (+2R each) had MAE 0.10, 0.20, 0.25, 0.30, 0.40, 0.50, 0.60 and 0.80; the 12 losers went the full 1.00R.
 */
const MAE_SLOTS: CandleData[] = Array.from({ length: 20 }, () => k(0.5, 0.5, 0.5, 0.5));
const MAE_WINNERS = [0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8];
const MAE_WIN_DOTS: ChartLayer[] = MAE_WINNERS.map((m, i) => ({ kind: "marker", index: i, price: m, role: "up" }));
const MAE_LOSS_DOTS: ChartLayer[] = Array.from({ length: 12 }, (_, i) => ({ kind: "marker", index: 8 + i, price: 1.0, role: "down" }));
const MAE_STOP: ChartLayer = { kind: "level", price: 1.0, role: "neutral", label: "STOP 1.00R" };
const MAE_TIGHT: ChartLayer = { kind: "level", price: 0.7, role: "stop", label: "STOP 0.70R" };
const MAE_DESCRIBE =
  "Twenty dots, one per trade, placed by MAE in R. Eight winners of +2R at MAE 0.10, 0.20, 0.25, 0.30, 0.40, 0.50, 0.60 and 0.80. Twelve losers of −1R at MAE 1.00.";

// ─── Cards for the Try phases ───────────────────────────────────────────────

const ADD_OPTIONS: Options = [
  { id: "split", label: "Split entry" },
  { id: "pyramid", label: "Pyramid" },
  { id: "breach", label: "Rule breach" },
];

const ADD_CARDS: Cards = [
  {
    id: "a1",
    text: "Plan: 60 units with a 1R of 75.00. You buy 30 at 50.00 and leave a buy limit for 30 at 49.50. One stop for all 60, at 48.50.",
    answer: "split",
    correct: "Split entry. If both halves fill and the stop is hit: 30 × 1.50 + 30 × 1.00 = 75.00, the planned 1R.",
    rationales: {
      pyramid: "Nothing has risen yet: the second half waits for a dip, as planned before entry.",
      breach: "The dip buy was planned and sized with the first half. The full loss at the stop is the planned 1R.",
    },
  },
  {
    id: "a2",
    text: "Long 40 from 20.00, stop 19.00. At 23.00 you add 20 and lift the shared stop to 21.50.",
    answer: "pyramid",
    correct: "Pyramid. Worst case: 40 × 1.50 − 20 × 1.50 = +30.00, a gain even if the stop is hit.",
    rationales: {
      split: "The add wasn't part of the entry plan. It came after a rise, with the stop moved up.",
      breach: "The stop rose with the add. Lot 1 now keeps +60.00 at the stop, more than lot 2 can lose.",
    },
  },
  {
    id: "a3",
    text: "Long 50 from 80.00, stop 78.00. Price falls to 79.00. 'It's cheaper now', so you buy 50 more with the same stop.",
    answer: "breach",
    correct: "Rule breach: averaging down. At the stop: 50 × 2.00 + 50 × 1.00 = 150.00, 1.5R.",
    rationales: {
      split: "A split entry is planned before entry, with risk for the full size. This add was decided after the fall.",
      pyramid: "A pyramid adds to a winner. This position is losing.",
    },
  },
  {
    id: "a4",
    text: "Long 100 from 40.00, stop 39.00. At 42.00 you add 50 and leave the stop at 39.00.",
    answer: "breach",
    correct: "Rule breach. Worst case: 100 × −1.00 + 50 × −3.00 = −250.00, 2.5R. A pyramid lifts the stop.",
    rationales: {
      split: "The add came after a rise and wasn't in the plan's sizing.",
      pyramid: "Adding to a winner is a pyramid only if the stops rise. Here the worst case grew to 2.5R.",
    },
  },
  {
    id: "a5",
    text: "Long 50 from 60.00, stop 58.00. Price drops to 59.00. You buy 50 more and lower the stop to 57.00 'to give it room'.",
    answer: "breach",
    correct: "Rule breach twice: averaging down and a widened stop. Loss at 57.00: 150.00 + 100.00 = 250.00, 2.5R.",
    rationales: {
      split: "Neither the add nor the lower stop was planned before entry.",
      pyramid: "A pyramid adds to a winner and raises the stop. This adds to a loser and lowers it.",
    },
  },
];

const TRAIL_OPTIONS: Options = [
  { id: "ok", label: "Follows the rule" },
  { id: "down", label: "Moves the stop down" },
  { id: "switch", label: "Switches method" },
  { id: "tight", label: "Too tight for the noise" },
];

const TRAIL_CARDS: Cards = [
  {
    id: "t1",
    text: "3-ATR chandelier, ATR 0.80. A new high at 55.20: you lift the stop from 52.40 to 52.80.",
    answer: "ok",
    correct: "Follows the rule: 55.20 − 2.40 = 52.80, and it moved up.",
    rationales: {
      down: "52.80 is above 52.40: the stop moved up, toward price.",
      switch: "Same rule, same k, same ATR. Only the high changed.",
      tight: "2.40 is three normal candles of 0.80: wide enough for the noise.",
    },
  },
  {
    id: "t2",
    text: "3-ATR chandelier. ATR jumps from 0.80 to 1.00, so the formula drops from 52.80 to 52.20. You lower the stop to 52.20.",
    answer: "down",
    correct: "Moves the stop down. The formula fell, but a trailing stop only moves in the trade's favour: keep 52.80.",
    rationales: {
      ok: "Following the formula down widens the stop. The rule is: up or stay, never down.",
      switch: "The method is the same. The problem is the direction of the move.",
      tight: "It got wider, not tighter.",
    },
  },
  {
    id: "t3",
    text: "Your chandelier stop is about to be hit in a pullback, so you switch to 'close under EMA 20', which sits 0.90 lower.",
    answer: "switch",
    correct: "Switches method, and widens the exit by 0.90 on the way. Pick the trail before entry and keep it.",
    rationales: {
      ok: "The rule was the chandelier. Changing it as the stop gets close is a decision made under pressure.",
      down: "The exit does end up lower, but it gets there by swapping rules mid-trade. That's the mistake to name.",
      tight: "The new rule is looser, not tighter.",
    },
  },
  {
    id: "t4",
    text: "Candles on this chart span about 0.80. You trail the stop 0.25 under the highest high.",
    answer: "tight",
    correct: "Too tight: a third of a normal candle. Ordinary noise will end the trade, not a change of trend.",
    rationales: {
      ok: "It moves the right way, but 0.25 sits inside a normal 0.80 candle.",
      down: "Nothing moved down. The problem is how close it sits.",
      switch: "It's one rule all along. It's just too tight.",
    },
  },
  {
    id: "t5",
    text: "Structure trail: a higher low at 54.20 is now confirmed by two higher lows on each side. You lift the stop to 54.10.",
    answer: "ok",
    correct: "Follows the rule: 0.10 under the newly confirmed higher low, up from 50.60.",
    rationales: {
      down: "54.10 is above the old 50.60: it moved up.",
      switch: "It's the same structure rule as at entry.",
      tight: "It sits under a confirmed swing low, outside the normal noise of the pullback.",
    },
  },
];

const BE_OPTIONS: Options = [
  { id: "killed", label: "Winner killed" },
  { id: "saved", label: "Loser saved" },
  { id: "same", label: "No change" },
];

const BE_CARDS: Cards = [
  {
    id: "b1",
    text: "Reached +1.4R, came back to the entry, then went on to the +2R target.",
    answer: "killed",
    correct: "Winner killed: the dip to the entry hit the moved stop, and the +2R came without you.",
    rationales: {
      saved: "Without the rule it wins +2R. With it, it's a scratch: a winner lost.",
      same: "Without the rule it wins +2R; with it, it's scratched at the entry.",
    },
  },
  {
    id: "b2",
    text: "Reached +1.2R, then fell all the way to the original stop.",
    answer: "saved",
    correct: "Loser saved: −1R becomes a scratch at the entry.",
    rationales: {
      killed: "It never reached the target. Without the rule it's a full −1R.",
      same: "Without the rule it loses 1R. With it, the fall ends at the entry.",
    },
  },
  {
    id: "b3",
    text: "Never got past +0.6R, then hit the stop: −1R.",
    answer: "same",
    correct: "No change: it never reached +1R, so the stop never moved.",
    rationales: {
      killed: "It's a loser either way.",
      saved: "The rule acts only after +1R. This trade never got there.",
    },
  },
  {
    id: "b4",
    text: "Went from the entry to the +2R target without ever dipping back.",
    answer: "same",
    correct: "No change: the moved stop was never touched.",
    rationales: {
      killed: "It never came back to the entry, so the moved stop never fired.",
      saved: "It was a winner either way.",
    },
  },
  {
    id: "b5",
    text: "Reached +1.0R, fell back through the entry and on to the original stop.",
    answer: "saved",
    correct: "Loser saved: +1R switched the rule on, and the fall was stopped at the entry.",
    rationales: {
      killed: "It was never going to win: without the rule it loses 1R.",
      same: "At +1R the stop moved, so the fall ended at the entry, not at −1R.",
    },
  },
  {
    id: "b6",
    text: "Dipped to −0.5R first, then climbed straight to the +2R target.",
    answer: "same",
    correct: "No change: after +1R it never came back to the entry.",
    rationales: {
      killed: "The dip came before +1R, while the original stop was still in place.",
      saved: "It was a winner either way.",
    },
  },
];

const EXIT_OPTIONS: Options = [
  { id: "structure", label: "Structure broke" },
  { id: "signal", label: "Opposite signal" },
  { id: "time", label: "Time stop" },
  { id: "event", label: "Event ahead" },
  { id: "none", label: "No planned reason" },
];

const EXIT_CARDS: Cards = [
  {
    id: "x1",
    text: "Your setup needs higher lows. A candle closes under the last one, still 0.30 above your stop. You sell at market.",
    answer: "structure",
    correct: "Structure broke: the idea needed higher lows, and the last one failed on a close.",
    rationales: {
      signal: "No opposing pattern here: the trade's own structure failed.",
      time: "Nothing to do with elapsed bars. The swing low broke.",
      event: "No scheduled news is involved.",
      none: "The plan names this reason: the setup's structure broke on a close.",
    },
  },
  {
    id: "x2",
    text: "A bearish engulfing closes at resistance: the exit signal your playbook lists for this setup. You sell.",
    answer: "signal",
    correct: "Opposite signal: a pattern the playbook names as an exit.",
    rationales: {
      structure: "The swing structure is intact. A written signal triggered the exit.",
      time: "The exit came from a pattern, not a bar count.",
      event: "No scheduled event was involved.",
      none: "The playbook lists this signal, so the exit is planned.",
    },
  },
  {
    id: "x3",
    text: "After 10 bars the trade has never reached +0.5R. Your rule says exit at market, so you sell.",
    answer: "time",
    correct: "Time stop: the written rule fired at bar 10.",
    rationales: {
      structure: "Structure didn't break. The trade simply didn't move.",
      signal: "No signal appeared. The clock ran out.",
      event: "Nothing is scheduled. It's a bar count.",
      none: "The rule was written before entry: a planned exit.",
    },
  },
  {
    id: "x4",
    text: "A rate decision is due in 20 minutes. Your plan says no open trades through scheduled news. You close.",
    answer: "event",
    correct: "Event ahead: the plan's rule for scheduled news.",
    rationales: {
      structure: "The chart's structure is intact. The reason is the calendar.",
      signal: "No chart signal fired. The plan's news rule did.",
      time: "It's the news time, not a bar count, that triggers the exit.",
      none: "The plan has a written news rule, so the exit is planned.",
    },
  },
  {
    id: "x5",
    text: "Three red candles in a row make you nervous, though nothing in your plan has happened. You sell.",
    answer: "none",
    correct: "No planned reason: nerves, not a rule. Log it as a deviation.",
    rationales: {
      structure: "Red candles alone aren't a broken structure: no swing low failed.",
      signal: "Three red candles aren't the signal your playbook lists.",
      time: "No bar-count rule fired.",
      event: "There's no scheduled event.",
    },
  },
  {
    id: "x6",
    text: "You read a post predicting a crash. Your trade is at +0.3R and nothing in your plan has changed. You close 'to be safe'.",
    answer: "none",
    correct: "No planned reason: an outside opinion, not a rule. A deviation, even if it turns out well.",
    rationales: {
      structure: "The chart's structure is intact.",
      signal: "A post isn't a chart signal from your playbook.",
      time: "No bar-count rule fired.",
      event: "A prediction isn't a scheduled event in your plan.",
    },
  },
];

// ─── Lessons ────────────────────────────────────────────────────────────────

const L271: Lesson = {
  id: "2.7.1",
  title: "Entries: anticipate, confirm or wait for the retest",
  topic: "order_types",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "One setup can be entered early with a limit, after confirmation with a stop or market order, or on a retest; each trades price for certainty, so compare them by expectancy.",
  objectives: [
    "Compare anticipation, confirmation and retest entries on the same setup in entry price, stop distance and reward-to-risk.",
    "Match each entry to its order type (limit, stop or market) and name each one's fill risk.",
    "Judge entry methods by expectancy over many trades, not by hit rate.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "reversal", label: "Arena: reversal" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "2.7",
    courseId: "2.7.1",
    hook: {
      prompt: "Same double bottom, three ways in. Which entry has the best reward-to-risk?",
      control: {
        kind: "choice",
        choices: [
          { id: "anticipation", label: "Anticipation" },
          { id: "confirmation", label: "Confirmation" },
          { id: "retest", label: "Retest" },
        ],
        answer: "anticipation",
      },
      figure: {
        kind: "chart",
        chart: { candles: DB.slice(0, 22), layers: [...DB_PATTERN, DB_TARGET] },
        steps: [{ text: "Lows 96.00 and 96.20, peak 99.00. The close at 99.30 confirms. Target 100.95." }],
      },
      compare: "You picked {yours}. Anticipation has the best reward-to-risk, 7.58, because its stop is closest. It's also the entry that fails most often. Best R:R is not best expectancy.",
      concept: "entry-techniques",
    },
    learn: [
      {
        kind: "figure",
        title: "Three ways into one setup",
        text: "An [[anticipation-entry]] buys before the pattern confirms. A [[confirmation-entry]] buys after it does. A [[retest-entry]] waits for price to come back to the level it broke.",
        figure: {
          kind: "chart",
          chart: { candles: DB.slice(0, 22) },
          steps: [
            { text: "The pattern: lows 96.00 and 96.20, peak 99.00 between them. Target 100.95.", layers: [...DB_PATTERN, DB_TARGET] },
            {
              text: "Anticipation: a buy limit at 96.40, near the second low. Stop 95.80, under the first.",
              layers: [
                { kind: "marker", index: 14, price: 96.4, label: "BUY 96.40", role: "accent" },
                { kind: "level", price: 95.8, role: "stop", label: "STOP 95.80" },
              ],
            },
            {
              text: "Confirmation: buy 99.35, the ask after the close above 99.00. Stop 98.20, under the higher low.",
              layers: [
                { kind: "marker", index: 21, price: 99.35, label: "BUY 99.35", role: "accent" },
                { kind: "marker", index: 19, at: "low", label: "HL 98.30", role: "neutral" },
                { kind: "level", price: 98.2, role: "stop", label: "STOP 98.20" },
              ],
            },
            { text: "Retest: a buy limit at 99.10, just above the broken peak. Same stop, 98.20.", layers: [{ kind: "level", price: 99.1, role: "entry", label: "BUY LIMIT 99.10" }] },
          ],
        },
        concept: "entry-techniques",
      },
      {
        kind: "worked",
        title: "Reward-to-risk, entry by entry",
        lines: [
          "Target for all three: 99.00 + 65% of the 3.00 pattern height = 100.95.",
          "Anticipation: limit 96.40, stop 95.80. 4.55 ÷ 0.60 = 7.58.",
          "Confirmation: 99.35, stop 98.20. 1.60 ÷ 1.15 = 1.39.",
          "Retest: limit 99.10, stop 98.20. 1.85 ÷ 0.90 = ?",
        ],
        ask: {
          answer: 2.06,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 0.49, text: "That's risk ÷ reward. Divide the reward, 1.85, by the risk, 0.90." },
            { value: 1.85, text: "That's the reward per unit. Divide it by the risk per unit, 0.90." },
          ],
          correct: "Right: 1.85 ÷ 0.90 = 2.06.",
        },
        after:
          "Before costs. With both commissions on 100 units, a win at the target is +6.39R, +1.20R or +1.75R. Commissions take 14% of the anticipation's R, 8% of the confirmation's.",
        concept: "entry-techniques",
      },
      {
        kind: "match",
        title: "Order and fill risk",
        prompt: "Each entry needs its own order, and each order can fail in its own way. Match them.",
        pairs: [
          {
            left: "Anticipation at 96.40",
            right: "Buy limit: fills before the pattern proves anything",
            wrong: "A limit below the price waits for the dip. It fills while the bottom is still a guess.",
          },
          {
            left: "Confirmation at 99.35",
            right: "Buy stop or market: sure fill, worse price, slippage",
            wrong: "Buying the break means paying up after it: a stop or market order, which can slip past the trigger.",
          },
          {
            left: "Retest at 99.10",
            right: "Buy limit: no trade if price never comes back",
            wrong: "A limit at the broken peak fills only on a throwback. If price runs, you're left out.",
          },
        ],
        columns: ["Entry", "Order and its risk"],
        correct: "Two limits and a stop. The limits risk a bad fill or no fill; the stop risks a worse price.",
        concept: "entry-techniques",
      },
      {
        kind: "reveal",
        title: "Waiting for the retest",
        prompt: "You chose the retest: a buy limit at 99.10, stop 98.20. Reveal the next 8 hours. What happened to the order?",
        chart: {
          candles: DB,
          visible: 22,
          layers: [DB_TARGET, { kind: "level", price: 99.1, role: "entry", label: "BUY LIMIT 99.10" }, { kind: "level", price: 98.2, role: "stop", label: "STOP 98.20" }],
        },
        choices: [
          { id: "filled", label: "Filled at 99.10", feedback: "The dip in hour 2 stopped at 99.12. The ask was 99.17, never 99.10." },
          { id: "low", label: "Filled at 99.12, the low", feedback: "99.12 was the mid. A buy limit needs the ask, 0.05 higher, at or under 99.10." },
          { id: "none", label: "Never filled", feedback: "Right. The ask bottomed at 99.17." },
        ],
        answer: "none",
        after:
          "Price reached 101.10 in hour 7, past the target. The confirmation entry made +1.20R after costs on 100 units; the retest made nothing. Missed trades belong in a limit entry's results.",
        concept: "entry-techniques",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "[[adverse-selection|Adverse selection]] works against resting limits. Your buy limit fills for sure when sellers push price through it: the trades most likely to keep falling. The strongest moves often never come back to fill you. Count the trades your limits missed, not only the ones they caught.",
      },
      {
        kind: "explain",
        title: "What the evidence says",
        text: "Does confirmation pay? In Bulkowski's counts on stock charts, about 48% of unconfirmed double bottoms kept falling, and confirmed patterns hit more often. [[evidence-grade|Evidence grade]] C, mixed: other markets, other samples. A higher hit rate bought with a worse price can still lose. Compare entries by [[expectancy]] after costs, over many trades.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "On random price data no entry has an edge: anticipation, confirmation and retest all lose about their costs. An entry method moves the price, the stop and the fill odds around. It can't create an edge the setup doesn't have.",
      },
    ],
    task: {
      widget: "expectancy",
      goal: "One illustrative set of 100 trades per entry, after costs. Anticipation wins 18% at +4.5R, confirmation 55% at +1.2R, retest 46% at +1.7R; losses −1R. Leave the widget on the best expectancy.",
      start: { winRate: 18, avgWin: 4.5, avgLoss: 1 },
      locked: ["avgLoss"],
      success: {
        all: [
          { field: "winRate", eq: 46 },
          { field: "avgWin", eq: 1.7, tol: 0.001 },
          { field: "avgLoss", eq: 1, tol: 0.001 },
        ],
      },
      feedback: [
        {
          when: { all: [{ field: "winRate", eq: 18 }, { field: "avgWin", eq: 4.5, tol: 0.001 }] },
          text: "That's anticipation: {expectancy:2}R per trade. The best reward-to-risk, and the only entry that loses here.",
        },
        {
          when: { all: [{ field: "winRate", eq: 55 }, { field: "avgWin", eq: 1.2, tol: 0.001 }] },
          text: "That's confirmation: +{expectancy:2}R, with the highest hit rate. One entry does better.",
        },
      ],
      incorrect: "Those numbers aren't one of the three entries. Set the win rate and average win from the goal, one entry at a time.",
      correct:
        "Right: the retest, +0.24R per trade. Confirmation won most often, 55%, for +0.21R; anticipation had the best R:R and lost 0.01R. Illustrative numbers: measure your own.",
      hints: [
        "Set each entry in turn: its win rate and average win. Read the expectancy each time.",
        "Expectancy = win rate × average win − loss rate × average loss.",
        "Retest: 0.46 × 1.7 − 0.54 × 1 = +0.24R. Compare it with the other two.",
      ],
      showMe: { winRate: 46, avgWin: 1.7 },
      concept: "expectancy",
    },
    check: ["q-2.7.1-1", "q-2.7.1-2", "q-2.7.1-3"],
    recap: {
      takeaways: [
        "Anticipation buys a better price and a tighter stop; confirmation buys a higher hit rate at a worse price.",
        "Limits risk a bad fill or no fill; stop and market orders risk slippage.",
        "Best R:R isn't best expectancy. Compare entries over many trades, after costs, counting the ones you missed.",
      ],
    },
  },
};

const L272: Lesson = {
  id: "2.7.2",
  title: "Scaling in versus averaging down",
  topic: "position_sizing",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Adding to a position is safe only while the worst case, every stop hit, stays within the 1R you planned: split entries and pyramids do that, averaging down doesn't.",
  objectives: [
    "Plan a split entry whose total risk stays within 1R.",
    "Add to a winning position and move the stops so the worst case stays below the original 1R.",
    "Show why adding to a losing position pushes risk beyond 1R, and why the app flags it as a rule breach.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "check", ref: "position_sizing", label: "Position sizing check" },
  ],
  script: {
    unit: "2.7",
    courseId: "2.7.2",
    hook: {
      prompt: "You're long 50 LABX at 50.00, stop 48.00: 1R is 100.00 before costs. Price dips to 49.00 and you buy 50 more, same stop. How much do you lose if the stop is hit?",
      control: {
        kind: "numeric",
        unit: "vUSD",
        answer: 150,
        tolerance: 0,
        feedback: [
          { value: 100, text: "That's the first 50 units only. The second 50 lose 1.00 each on the way to 48.00." },
          { value: 50, text: "That's only the second lot. The first 50 still lose 2.00 each." },
          { value: 200, text: "That treats both lots as bought at 50.00. The second paid 49.00." },
        ],
      },
      compare: "You said {yours}. 50 × 2.00 + 50 × 1.00 = 150.00: 1.5R. The average price improved to 49.50, and the loss at the stop grew by half.",
      concept: "risk-per-trade",
    },
    learn: [
      {
        kind: "explain",
        title: "Three ways to add",
        text: "You can add to a trade in three ways. A [[split-entry]] buys a planned size in parts, with the risk set for the full size. [[pyramiding|Pyramiding]] adds to a winner and lifts the stops. Averaging down adds to a loser. Only the first two keep the total within the 1R you planned.",
      },
      {
        kind: "worked",
        title: "Averaging down, in R",
        lines: [
          "Lot 1: 50 at 50.00, stop 48.00. 1R = 50 × 2.00 = 100.00, before costs.",
          "Lot 2: 50 more at 49.00. Average price: (2,500.00 + 2,450.00) ÷ 100 = 49.50.",
          "At the stop: 100 × (49.50 − 48.00) = 150.00.",
          "In R: 150.00 ÷ 100.00 = ?",
        ],
        ask: {
          answer: 1.5,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 1, text: "The plan was 1R. The second lot adds 50.00 more at the stop." },
            { value: 150, text: "That's the loss in vUSD. Divide it by the 100.00 you planned to risk." },
          ],
          correct: "Right: a loss of 1.5R, half again the planned loss.",
        },
        after: "With both commissions the loss is 154.88 against a 1R of 102.45: −1.51R. Lower the stop 'to give it room' as well, and the planned 1R stops meaning anything.",
        concept: "risk-per-trade",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Averaging down with no limit is a martingale in disguise: every add raises the loss at the same stop, and a long fall turns it into ruin. [[evidence-grade|Evidence grade]] F: harmful (1.8). This course counts any add to a losing position as a breach of the plan.",
      },
      {
        kind: "figure",
        title: "A pyramid, step by step",
        text: "Adding to a winner is different, as long as the stops move with it.",
        figure: {
          kind: "chart",
          chart: { candles: PY, visible: 16 },
          steps: [
            { text: "Lot 1: 50 at 50.00, stop 48.00. Price climbs to 54.00 with higher lows.", layers: [PY_LOT1, PY_OLD_STOP, ...PY_LOWS] },
            { text: "Add 25 at 54.00. Leave the stop at 48.00 and the worst case is −250.00: 2.5R.", layers: [PY_LOT2] },
            { text: "Lift both stops to 51.00: lot 1 keeps +50.00, lot 2 risks −75.00.", layers: [PY_NEW_STOP] },
            { text: "Worst case −25.00: the position grew by half, its risk fell to a quarter.", visible: 20 },
          ],
        },
        concept: "pyramiding",
      },
      {
        kind: "worked",
        title: "The pyramid's worst case",
        lines: [
          "Worst case = Σ units × (stop − entry), with every lot stopped at the shared stop.",
          "Lot 1: 50 × (51.00 − 50.00) = +50.00.",
          "Lot 2: 25 × (51.00 − 54.00) = −75.00.",
          "Total, before costs = ?",
        ],
        ask: {
          answer: -25,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 25, text: "Check the sign: lot 2 loses 75.00, more than lot 1 keeps." },
            { value: -75, text: "That's lot 2 alone. Lot 1 keeps +50.00 at 51.00." },
          ],
          correct: "Right: −25.00, a quarter of the original 1R.",
        },
        after: "With commissions, −28.85: −0.28R of the 102.45 initial risk. The [[open-risk|open risk]] fell from 1R to about a quarter while the position grew by half.",
        concept: "pyramiding",
      },
      {
        kind: "match",
        title: "Within the plan or beyond it?",
        prompt: "Sort four adds by what they do to the total risk.",
        pairs: [
          {
            left: "Plan 60 units at 1R: buy 30 now, 30 on a dip, one stop for all 60",
            right: "Within the plan",
            wrong: "The second half was planned and sized with the first. If both fill and the stop is hit, the loss is the planned 1R.",
          },
          { left: "Add 25 after a rise and lift both stops: worst case −0.25R", right: "Within the plan", wrong: "The stops moved with the add, so the worst case shrank to a quarter of 1R." },
          { left: "Buy 50 more after a dip, 'cheaper now', same stop", right: "Beyond the plan", wrong: "The add was never planned, and it raises the loss at the stop to 1.5R." },
          { left: "Add 25 after a rise, stop left at 48.00", right: "Beyond the plan", wrong: "Adding to a winner without moving the stop: worst case −250.00, 2.5R." },
        ],
        columns: ["Add", "Total risk"],
        correct: "The same action, adding units, with opposite results. What decides it is the worst case if every stop is hit.",
        concept: "pyramiding",
      },
      {
        kind: "predict",
        title: "Your turn: move the shared stop",
        prompt: "Lot 1: 50 at 50.00. You've just added 25 at 54.00. Set the lowest shared stop that keeps the worst case within a 25.00 loss, 0.25R.",
        control: {
          kind: "slider",
          min: 48,
          max: 53.5,
          step: 0.25,
          start: 48,
          answer: 51,
          tolerance: 0.001,
          feedback: [
            { from: 48, to: 50.75, text: "Too low. Worst case = 75 × stop − 3,850.00: at 50.50 it's −62.50, past the 25.00 limit." },
            { from: 51, to: 51, text: "The lowest stop that fits: +50.00 on lot 1, −75.00 on lot 2, −25.00 in all." },
            { from: 51.25, to: 53.5, text: "Within the limit, but not the lowest. 51.00 already fits, and leaves price more room to pull back." },
          ],
        },
        figure: {
          kind: "chart",
          chart: { candles: PY, visible: 16, layers: [PY_LOT1, PY_LOT2, PY_OLD_STOP, ...PY_LOWS] },
          steps: [
            { text: "75 × 51.00 − 3,850.00 = −25.00: the lowest stop within 0.25R.", layers: [PY_NEW_STOP] },
            { text: "Price kept rising. No bid came back to 51.00.", visible: 20 },
          ],
        },
        reveal: "Every stop from 51.00 up keeps the worst case within 25.00, before costs. 51.00 is the lowest: it sits under the last higher low, 52.10, and gives the trade the most room.",
        concept: "pyramiding",
      },
    ],
    task: {
      widget: "bias-spotter",
      goal: "Five adds to a position. For each, decide: a split entry, a pyramid, or a rule breach that pushes the risk past the plan.",
      data: { cards: ADD_CARDS, options: ADD_OPTIONS },
      success: { field: "solved", eq: 5 },
      correct: "Five adds sorted. The test is always the same: if every stop is hit, does the loss stay within the 1R you planned?",
      hints: [
        "Was the add planned and sized before entry? Then it's a split entry.",
        "Adding to a winner is a pyramid only if the stops rise so the worst case stays within 1R.",
        "Work out the worst case: units × (stop − entry) for each lot, added up.",
      ],
      showMe: { solved: 5 },
      concept: "pyramiding",
    },
    check: ["q-2.7.2-1", "q-2.7.2-2", "q-2.7.2-3"],
    recap: {
      takeaways: [
        "A split entry plans the full size first: if every part fills and the stop hits, the loss is 1R.",
        "Pyramid only by lifting the stops: worst case = Σ units × (stop − entry), within 1R.",
        "Averaging down raises the loss at the same stop. A better average price is more risk, not less.",
      ],
    },
  },
};

const L273: Lesson = {
  id: "2.7.3",
  title: "Targets: R-multiples, structure and volatility",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A target can come from a fixed R-multiple, the next structure or a multiple of ATR; which one pays best depends on how far trades travel, and that changes with the regime.",
  objectives: [
    "Set a target three ways: a fixed R-multiple, the next structure level, or a multiple of ATR.",
    "Calculate the expectancy of each target from the share of trades whose maximum favourable move reached it.",
    "Explain why the best target depends on the market regime and must be measured, not assumed.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
  ],
  script: {
    unit: "2.7",
    courseId: "2.7.3",
    hook: {
      prompt: "You move your target from 2R to 4R. Does expectancy go up or down?",
      control: {
        kind: "choice",
        choices: [
          { id: "up", label: "Higher expectancy" },
          { id: "down", label: "Lower expectancy" },
          { id: "depends", label: "It depends" },
        ],
        answer: "depends",
      },
      compare: "You said {yours}. It depends on how many trades travel 4R before the stop. That share, read from the trades' MFE, changes with the market regime.",
      concept: "profit-targets",
    },
    learn: [
      {
        kind: "figure",
        title: "Three targets for one trade",
        text: "Long at 100.00, stop 98.00. Three ways to set the [[take-profit|target]]: a fixed R-multiple, a [[structural-target]] at the next zone, or a multiple of [[atr|ATR]].",
        figure: {
          kind: "chart",
          chart: { candles: TG },
          steps: [
            {
              text: "Long at 100.00, stop 98.00 under the swing low at 98.30: 1R = 2.00.",
              layers: [
                { kind: "level", price: 100.0, role: "entry", label: "ENTRY 100.00" },
                { kind: "level", price: 98.0, role: "stop", label: "STOP 98.00" },
                { kind: "marker", index: 15, at: "low", label: "LOW 98.30", role: "neutral" },
              ],
            },
            { text: "Fixed R-multiple: 100.00 + 2.5 × 2.00 = 105.00, beyond resistance.", layers: [TG_ZONE, { kind: "level", price: 105.0, role: "target", label: "2.5R · 105.00" }] },
            {
              text: "Structure: just under the zone where two rallies stalled: 104.00.",
              layers: [
                { kind: "marker", index: 4, at: "high", role: "neutral" },
                { kind: "marker", index: 8, at: "high", role: "neutral" },
                { kind: "level", price: 104.0, role: "target", label: "STRUCTURE · 104.00" },
              ],
            },
            { text: "Volatility: 3 × ATR(14) = 3 × 1.20 = 3.60 above the entry: 103.60.", layers: [{ kind: "level", price: 103.6, role: "target", label: "3 ATR · 103.60" }] },
          ],
        },
        concept: "profit-targets",
      },
      {
        kind: "explain",
        title: "The MFE decides",
        text: "A target pays only on trades that travel that far before the stop. Record how far each trade went in your favour at best, its [[mfe|MFE]], and count the share P that reached k R. Simplest model: those win k R, the rest lose 1R.",
        figure: {
          kind: "formula",
          boxes: [{ text: "P × k" }, { text: "(1 − P) × 1R" }, { text: "Expectancy" }],
          operators: ["−", "="],
          steps: ["Wins: the share P whose MFE reached the target, times k.", "Losses: everyone else, at −1R.", "The difference is the expectancy per trade, before costs."],
        },
      },
      {
        kind: "worked",
        title: "A trending market, before costs",
        lines: [
          "Share of trades whose MFE reached each target, in a trending market:",
          "1R: 55% → 0.55 × 1 − 0.45 = +0.10R. 2R: 42% → 0.84 − 0.58 = +0.26R.",
          "4R: 26% → +0.30R. 5R: 21% → +0.26R.",
          "3R: 33% → 0.33 × 3 − 0.67 = ?",
        ],
        ask: {
          answer: 0.32,
          tolerance: 0.005,
          unit: "R",
          feedback: [
            { value: 0.99, text: "That's only the wins. Subtract the 67% that lose 1R." },
            { value: -0.32, text: "Check the sign: 0.99 − 0.67 is positive." },
          ],
          correct: "Right: +0.32R, the best of the five in this market.",
        },
        after: "Illustrative numbers. Costs come off every line, more with a tight stop, and some trades end on time rather than at −1R.",
        concept: "profit-targets",
      },
      {
        kind: "predict",
        title: "The range market",
        prompt: "Same entries in a range market: MFE reached 1R in 60% of trades, 2R in 40%, 3R in 22%. Which target has the best expectancy?",
        control: {
          kind: "choice",
          choices: [
            { id: "1r", label: "1R", feedback: "+0.20R, but it isn't alone: 2R gives 0.80 − 0.60 = +0.20R too." },
            { id: "2r", label: "2R", feedback: "+0.20R, tied with 1R: 0.60 − 0.40 = +0.20R." },
            { id: "3r", label: "3R", feedback: "Only 22% get there: 0.66 − 0.78 = −0.12R." },
            { id: "tie", label: "1R and 2R tie", feedback: "Right." },
          ],
          answer: "tie",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "Range 1R", value: 0.2, role: "up" },
            { label: "Range 2R", value: 0.2, role: "up" },
            { label: "Range 3R", value: -0.12, role: "down" },
            { label: "Range 4R", value: -0.4, role: "down" },
            { label: "Range 5R", value: -0.64, role: "down" },
          ],
          unit: "R",
          steps: ["In a range, few trades travel far: past 2R, expectancy turns negative.", "In the trending market, 3R was best: +0.32R. Same entries, different regime."],
        },
        reveal: "1R and 2R both give +0.20R; from 3R on, expectancy falls fast. In the trending market the best was 3R. The best target belongs to the regime, and you find it by measuring.",
        concept: "profit-targets",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Two target mistakes. A target beyond obvious opposing structure assumes a break your plan never argued for. And a target pulled closer mid-trade out of fear isn't a new plan: it's the urge to lock in gains, the disposition effect (2.12). Set the target before entry; change it only by a written rule.",
      },
      {
        kind: "explain",
        title: "What the evidence says",
        text: "The arithmetic of expectancy is certain; its inputs aren't. Pattern targets scaled from past data have mixed evidence, grade C. Treat any target rule as a hypothesis: measure the share of your own trades that reached it, separately for trending and ranging markets, over a [[sample-size|sample]] large enough to mean something.",
      },
    ],
    task: {
      widget: "bracket-builder",
      goal: "Your fixed 2.5R target, 105.00, sits beyond resistance at 104.20–104.60. Move it to a structural target: under the zone, with a small buffer.",
      data: { chart: { candles: TG, layers: [TG_ZONE] }, entry: 100, units: 25 },
      start: { stop: 98, target: 105, units: 25 },
      locked: ["stop", "units"],
      success: {
        all: [
          { field: "target", gte: 103.8 },
          { field: "target", lte: 104.1 },
        ],
      },
      feedback: [
        { when: { field: "target", gte: 104.2 }, text: "{target:2} is inside or beyond the zone where two rallies stalled. Your plan gives no reason to expect a break." },
        { when: { field: "target", gt: 104.1 }, text: "Too close to the zone. The bid must reach {target:2}, so the mid has to touch the zone's edge. Leave about 0.10 or more." },
        { when: { field: "target", lt: 103.8 }, text: "{target:2} gives away more than a buffer needs. Set it just under 104.20, about 0.10 to 0.40 below." },
      ],
      correct: "Right. Target {target:2}: {rr:2}R before costs. After commissions: +{gainAfter:2} at the target against −{lossAfter:2} at the stop.",
      hints: [
        "Start from the zone's bottom edge, 104.20. How far does your plan say price can go?",
        "A sell target fills when the bid, 0.05 under the mid, reaches it. Leave a small buffer.",
        "Drag the target to 104.00: 0.20 under the zone, 2.00R before costs.",
      ],
      showMe: { target: 104 },
      concept: "profit-targets",
    },
    check: ["q-2.7.3-1", "q-2.7.3-2", "q-2.7.3-3"],
    recap: {
      takeaways: [
        "Set the target before entry: a fixed R, the next structure, or a multiple of ATR.",
        "Expectancy of a target = share whose MFE reached it × k − the rest × 1R.",
        "The best target depends on the regime: measure it on enough of your own trades.",
      ],
    },
  },
};

const L274: Lesson = {
  id: "2.7.4",
  title: "Trailing stops",
  topic: "stop_loss",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A trailing stop follows price by a rule fixed before entry; a chandelier hangs a multiple of ATR under the highest high, and every trail trades giveback against holding time.",
  objectives: [
    "Calculate a chandelier stop from the highest high since entry and the ATR.",
    "Compare ATR, structure, moving-average and Parabolic SAR trails by giveback, holding time and stop-outs.",
    "Keep the rule that a trailing stop only moves in the trade's favour, and never switches method mid-trade.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
  ],
  script: {
    unit: "2.7",
    courseId: "2.7.4",
    hook: {
      prompt: "Highest high since entry is 54.00, ATR is 0.80 and k = 3. Where is the chandelier stop?",
      control: {
        kind: "numeric",
        answer: 51.6,
        tolerance: 0.005,
        feedback: [
          { value: 53.2, text: "That's one ATR under the high. With k = 3 the stop sits 3 × 0.80 = 2.40 below." },
          { value: 56.4, text: "For a long the stop hangs under the high: 54.00 − 2.40." },
          { value: 51.2, text: "Close, but 3 × 0.80 is 2.40, not 2.80." },
        ],
      },
      compare: "You said {yours}. 54.00 − 3 × 0.80 = 51.60: the chandelier hangs 2.40 under the highest high since entry.",
      concept: "chandelier-exit",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[chandelier-exit|chandelier exit]] hangs the stop k × [[atr|ATR]] under the highest high since entry. As price makes new highs, the stop rises; when price pulls back, it stays put. Like every [[trailing-stop]], it moves only in the trade's favour. The common setting is k = 3, but no setting has robust evidence behind it: grade D.",
      },
      {
        kind: "worked",
        title: "Step by step",
        lines: [
          "Long from 50.00. ATR 0.80, k = 3: the stop hangs 2.40 under the highest high.",
          "Highest high 52.40: stop 52.40 − 2.40 = 50.00.",
          "New high 55.20: stop 52.80.",
          "No new high, but ATR rises to 1.00: the formula gives 55.20 − 3.00 = 52.20. Your stop = ?",
        ],
        ask: {
          answer: 52.8,
          tolerance: 0.005,
          feedback: [{ value: 52.2, text: "The formula fell, but a trailing stop never moves down. It stays at 52.80." }],
          correct: "Right: 52.80. The stop only moves up; a wider ATR just pauses it.",
        },
        after: "Some traders recompute with the latest ATR, some freeze it at entry. Either way, write the choice down before entry.",
        concept: "chandelier-exit",
      },
      {
        kind: "figure",
        title: "Four trails, one trade",
        text: "One long from 50.00, initial stop 48.00: 1R = 2.00 per unit. ATR held at 0.80, its value at entry. Results before costs.",
        figure: {
          kind: "chart",
          chart: { candles: TR, height: 300, layers: [TR_ENTRY, { kind: "line", values: TR_EMA20, role: "neutral", label: "EMA 20" }] },
          steps: [
            { text: "Chandelier, 2 ATR (1.60) under the high: out at 50.80 in the first pullback. +0.40R.", layers: [TR_CH2, { kind: "marker", index: 28, price: 50.8, role: "down" }] },
            { text: "Chandelier, 3 ATR (2.40): sat through both pullbacks, out at 53.80. +1.90R.", layers: [TR_CH3, { kind: "marker", index: 46, price: 53.8, role: "down" }] },
            { text: "Structure, 0.10 under each confirmed higher low: out at 54.10. +2.05R.", layers: [TR_STRUCTURE, { kind: "marker", index: 45, price: 54.1, role: "down" }] },
            { text: "First close under EMA 20: sold at that close's bid, 53.42. +1.71R.", layers: [{ kind: "marker", index: 46, price: 53.42, role: "down" }] },
          ],
        },
        concept: "trailing-stop",
      },
      {
        kind: "worked",
        title: "Giveback",
        lines: [
          "[[giveback|Giveback]] = the best unrealised result − the result you kept, in R.",
          "3-ATR trail: highest high 56.20, so the best was (56.20 − 50.00) ÷ 2.00 = 3.10R.",
          "Exit at 53.80: (53.80 − 50.00) ÷ 2.00 = +1.90R.",
          "Giveback = 3.10 − 1.90 = ?",
        ],
        ask: {
          answer: 1.2,
          tolerance: 0.005,
          unit: "R",
          feedback: [
            { value: 1.9, text: "That's what you kept. Giveback is the part of the best result you didn't keep." },
            { value: 3.1, text: "That's the best result, the MFE. Subtract the 1.90R you kept." },
          ],
          correct: "Right: 1.20R, exactly the trail's width, 2.40, in R.",
        },
        after: "A chandelier hit without a gap gives back its own width: 3 × 0.80 = 2.40 = 1.20R. Wider trail: longer holds, more giveback.",
        concept: "chandelier-exit",
      },
      {
        kind: "predict",
        title: "Pick by the rule",
        prompt: "Your rule: the trail with the lowest giveback among those that held the trade at least 15 candles. Which do you pick on this trade?",
        control: {
          kind: "choice",
          choices: [
            { id: "ch2", label: "2 ATR: gave back 0.80R, held 7 candles", feedback: "Lowest giveback, but it was out after 7 candles, in the first pullback. It fails the 15-candle test." },
            { id: "ch3", label: "3 ATR: gave back 1.20R, held 25 candles", feedback: "It passes the test, but structure gave back less: 1.05R." },
            { id: "st", label: "Structure: gave back 1.05R, held 24 candles", feedback: "Right." },
            { id: "ema", label: "EMA 20: gave back 1.39R, held 25 candles", feedback: "It held long, but gave back the most: 1.39R." },
          ],
          answer: "st",
        },
        reveal: "Structure: 1.05R given back over 24 candles. That's one trade. On another path the order changes, and in a range, wide trails give back nearly everything. Compare trails on many entries, by regime, before choosing one.",
        concept: "trailing-stop",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Three trailing mistakes. A trail tighter than normal noise exits on noise. Switching method mid-trade, to a looser rule as the stop gets close, is a widened stop in disguise. In thin markets, one odd wick can trigger a trail. Parabolic SAR and SuperTrend (2.3.7) serve here only as stops, never as reversals.",
      },
      {
        kind: "predict",
        title: "Your turn: the next high",
        prompt: "The latest candle makes a new high, 56.20. Your 3-ATR chandelier stop is at 53.40, with ATR held at 0.80. Move it by the rule.",
        control: {
          kind: "slider",
          min: 52.8,
          max: 55,
          step: 0.1,
          start: 53.4,
          answer: 53.8,
          tolerance: 0.05,
          feedback: [
            { from: 52.75, to: 53.35, text: "That's below your current stop, 53.40. A trailing stop never moves down." },
            { from: 53.35, to: 53.75, text: "Allowed, but looser than the rule: 56.20 − 3 × 0.80 = 53.80." },
            { from: 53.75, to: 53.85, text: "Right: 56.20 − 2.40 = 53.80." },
            { from: 53.85, to: 55.05, text: "Tighter than the rule. Changing the distance mid-trade is switching method." },
          ],
        },
        figure: {
          kind: "chart",
          chart: { candles: TR, visible: 43, height: 300, layers: [TR_ENTRY, TR_CH3_TO_42, { kind: "marker", index: 42, at: "high", label: "HIGH 56.20", role: "accent" }] },
          steps: [
            { text: "The rule's stop: 56.20 − 2.40 = 53.80, from the next candle.", layers: [{ kind: "path", role: "concept", points: [{ index: 42.5, price: 53.8 }, { index: 46, price: 53.8 }] }] },
            { text: "Four candles later the bid reached 53.80: out at +1.90R.", visible: 47, layers: [{ kind: "marker", index: 46, price: 53.8, label: "OUT 53.80", role: "down" }] },
          ],
        },
        reveal: "53.80. The stop rose 0.40 with the new high and held through the next pullback, until the drop in candle 46.",
        concept: "chandelier-exit",
      },
    ],
    task: {
      widget: "bias-spotter",
      goal: "Five moves of a trailing stop on a long. For each, decide: does it follow the rule, move the stop down, switch method, or sit too tight for the noise?",
      data: { cards: TRAIL_CARDS, options: TRAIL_OPTIONS },
      success: { field: "solved", eq: 5 },
      correct: "Five checked. A trail is a rule chosen before entry: same method, same setting, and for a long only ever up.",
      hints: [
        "Check the direction first: a long's stop may only move up or stay.",
        "Then check the rule: is it the same method and setting chosen at entry?",
        "Finally compare the distance with a normal candle.",
      ],
      showMe: { solved: 5 },
      concept: "trailing-stop",
    },
    check: ["q-2.7.4-1", "q-2.7.4-2", "q-2.7.4-3"],
    recap: {
      takeaways: [
        "Chandelier stop = highest high since entry − k × ATR. It rises with new highs, never falls.",
        "Tight trails give back less but exit sooner; wide ones hold trends and give back more.",
        "Pick the trail before entry. Never lower it, and never swap methods mid-trade.",
      ],
    },
  },
};

const L275: Lesson = {
  id: "2.7.5",
  title: "Breakeven stops",
  topic: "stop_loss",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Moving the stop to the entry after a gain saves some losers and kills some winners; whether it helps depends on your own trades, and it never removes the risk of a gap.",
  objectives: [
    "Move a stop to breakeven only by a written rule, and name the cost of putting it exactly at the entry price.",
    "Count how many winners a breakeven rule kills and how many losers it saves.",
    "Calculate the expectancy of a set of trades with and without the rule.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
    { kind: "check", ref: "stop_loss", label: "Stop-loss check" },
  ],
  script: {
    unit: "2.7",
    courseId: "2.7.5",
    hook: {
      prompt: "Moving your stop to breakeven at +1R always improves your results. True or false?",
      control: {
        kind: "choice",
        choices: [
          { id: "true", label: "True" },
          { id: "false", label: "False" },
        ],
        answer: "false",
      },
      compare: "You said {yours}. False: it depends on how many winners dip back to the entry after +1R. On this lesson's ten trades it cut expectancy from +0.20R to −0.10R.",
      concept: "breakeven-stop",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[breakeven-stop]] moves the stop to the entry price once a trade has gained a set amount, often +1R. From then on, a reversal ends as a [[scratch-trade|scratch]] instead of a loss. The cost: some trades that dip back to the entry and then win are now stopped at zero.",
      },
      {
        kind: "worked",
        title: "Ten trades, with and without",
        lines: [
          "Ten trades, target +2R. Without the rule: 4 winners, 6 losers. 8 − 6 = +2R: +0.20R per trade.",
          "With breakeven at +1R: 2 winners had dipped back to the entry first. Scratched: 0R.",
          "1 loser had reached +1R before falling. Saved: 0R.",
          "Now 2 × 2 + 0 + 0 − 5 × 1 = −1R. Per trade = ?",
        ],
        ask: {
          answer: -0.1,
          tolerance: 0.005,
          unit: "R",
          feedback: [
            { value: 0.1, text: "Check the sign: 4 − 5 = −1R over 10 trades." },
            { value: -1, text: "That's the total. Divide it by the 10 trades." },
            { value: 0.2, text: "That's without the rule. Use the new results: 2 winners, 3 scratches, 5 losers." },
          ],
          correct: "Right: −0.10R. Two winners killed, one loser saved.",
        },
        after: "Before costs. Here the rule turned a positive method negative. On another set it can help: it depends on where trades go after +1R.",
        concept: "breakeven-stop",
      },
      {
        kind: "reveal",
        title: "Scratched by a few cents",
        prompt: "Long 50 at 100.00, stop 98.00, target 104.00. Your rule: at +1R, the stop moves to 100.00. Reveal the next 13 hours. How does the trade end?",
        chart: {
          candles: BE,
          visible: 6,
          layers: [
            { kind: "level", price: 104.0, role: "target", label: "TARGET 104.00" },
            { kind: "level", price: 100.0, role: "entry", label: "ENTRY 100.00" },
            { kind: "level", price: 98.0, role: "stop", label: "STOP 98.00" },
          ],
        },
        choices: [
          { id: "scratch", label: "Scratched at 100.00", feedback: "Right." },
          { id: "stop", label: "Stopped at 98.00", feedback: "By then the rule had moved the stop up to 100.00. Price never came near 98.00." },
          { id: "target", label: "At the target, 104.00", feedback: "Price did reach 104.00 in hour 12, but you were already out at 100.00 in hour 7." },
        ],
        answer: "scratch",
        after:
          "Hour 4 passed +1R and the stop moved to 100.00. In hour 7 the low was 100.03, above your entry price, but the bid touched 99.98: out at 100.00, −5.00 in commissions. Without the rule: +194.90, +1.86R.",
        concept: "breakeven-stop",
      },
      {
        kind: "explain",
        title: "Breakeven isn't free",
        text: "A stop at your exact entry price still loses. You bought at the ask; the stop sells at the bid, so it triggers while the mid is still above your entry, and both commissions are paid: −5.00 on 50 units here, −0.05R. A stop a little above the entry covers costs, but gets hit even more often.",
      },
      {
        kind: "predict",
        title: "Breakeven and a gap",
        prompt: "Your stop sits at breakeven, 100.00, on 50 units. Overnight news: the next candle opens with the bid at 98.50. What's the result, before costs?",
        control: {
          kind: "numeric",
          unit: "vUSD",
          answer: -75,
          tolerance: 0.01,
          feedback: [
            { value: 0, text: "A stop fills at the next price there is. After a gap, that's the open: 98.50." },
            { value: 75, text: "Right size, wrong sign: you sold 1.50 under your entry." },
          ],
        },
        reveal: "50 × (98.50 − 100.00) = −75.00, −0.75R before costs, −79.97 with commissions. A position at breakeven isn't risk-free: a gap still goes straight past the stop (1.3.7).",
        concept: "gap-risk",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Move to breakeven only when a rule written before entry says so. Moving it because the trade 'can't become a loser now' is [[loss-aversion]] at work: the pain of giving back a gain decides, not the plan. Test the rule on your own trades, with and without it.",
      },
      {
        kind: "worked",
        title: "Your turn: score a rule",
        lines: [
          "Twelve trades, target +2R. Without the rule: 5 winners, 7 losers. 10 − 7 = +3R: +0.25R per trade.",
          "With breakeven at +1R: 1 winner killed, scratched at 0R.",
          "4 losers saved: they had reached +1R first. 0R each.",
          "With the rule: 4 × 2 + 0 + 0 − 3 × 1 = +5R. Per trade = ?",
        ],
        ask: {
          answer: 0.42,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 5, text: "That's the total. Divide it by the 12 trades." },
            { value: 0.25, text: "That's without the rule." },
          ],
          correct: "Right: +0.42R, up from +0.25R. On this set the rule helps.",
        },
        after: "The same rule, the opposite verdict to the ten trades before. Before costs: each scratch also costs about 0.05R in commissions.",
        concept: "breakeven-stop",
      },
    ],
    task: {
      widget: "bias-spotter",
      goal: "Rule: at +1R the stop moves to the entry; the target is +2R. For each trade's path, did the rule kill a winner, save a loser, or change nothing?",
      data: { cards: BE_CARDS, options: BE_OPTIONS },
      success: { field: "solved", eq: 6 },
      correct: "Six sorted. The rule is worth the losers it saves minus the winners it kills, and only your own trades can count them.",
      hints: [
        "First ask: did the trade reach +1R? If not, the rule never acted.",
        "If it did: did price come back to the entry afterwards?",
        "Then compare with the result without the rule: +2R or −1R.",
      ],
      showMe: { solved: 6 },
      concept: "breakeven-stop",
    },
    check: ["q-2.7.5-1", "q-2.7.5-2", "q-2.7.5-3"],
    recap: {
      takeaways: [
        "Move to breakeven only by a written rule. At the exact entry, spread and commissions still cost you.",
        "A breakeven rule kills winners that dip back and saves losers that peaked first. Count both.",
        "Compare expectancy with and without the rule on your own trades. A gap still jumps the stop.",
      ],
    },
  },
};

const L276: Lesson = {
  id: "2.7.6",
  title: "Partial exits",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A trade closed in parts has a blended R; partials raise the win rate and narrow the spread of results, but can cap the trades that pay for everything else.",
  objectives: [
    "Calculate the blended R of a trade closed in parts.",
    "Compare an all-in exit with a half-off-at-1R plan in expectancy and in the spread of outcomes.",
    "Explain why partial exits raise the win rate and can quietly cap the best trades.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "check", ref: "risk_management", label: "Risk management check" },
  ],
  script: {
    unit: "2.7",
    courseId: "2.7.6",
    hook: {
      prompt: "You close half at +1R. The other half is stopped at breakeven. What is the trade's total in R?",
      control: {
        kind: "numeric",
        unit: "R",
        answer: 0.5,
        tolerance: 0.01,
        feedback: [
          { value: 1, text: "+1R was earned on half the position only. Half of 1R is 0.5R." },
          { value: 0, text: "The first half did bank +1R. Weighted by its size, that's +0.5R." },
        ],
      },
      compare: "You said {yours}. 0.5 × 1R + 0.5 × 0R = +0.5R: each part counts by its share of the position.",
      concept: "scaling-out",
    },
    learn: [
      {
        kind: "explain",
        text: "[[scaling-out|Scaling out]] closes a position in parts: say half at +1R and the rest as a [[runner]] under a trailing stop. The trade's result is its [[blended-r|blended R]]: each part's R weighted by its share of the position, measured against the 1R you risked on the whole.",
      },
      {
        kind: "figure",
        title: "Three ways it can end",
        text: "Half off at +1R, the runner trailed.",
        figure: {
          kind: "formula",
          boxes: [{ text: "0.5 × 1R" }, { text: "0.5 × 3R" }, { text: "+2.0R" }],
          operators: ["+", "="],
          steps: [
            "Runner reaches +3R: 0.5 × 1R + 0.5 × 3R = +2.0R.",
            "Runner stopped at breakeven: 0.5 × 1R + 0.5 × 0R = +0.5R.",
            "Stopped before +1R: nothing was sold yet, so the whole position loses 1R.",
          ],
        },
        concept: "scaling-out",
      },
      {
        kind: "worked",
        title: "Two plans, same trades",
        lines: [
          "Illustrative frequencies: runner reaches +3R 20%, stopped at breakeven 30%, stopped before +1R 50%.",
          "All-in, stop to breakeven after +1R: 0.2 × 3 + 0.3 × 0 − 0.5 × 1 = +0.10R.",
          "Half at +1R, runner trailed: 0.2 × 2.0 + 0.3 × 0.5 − 0.5 × 1 = ?",
        ],
        ask: {
          answer: 0.05,
          tolerance: 0.005,
          unit: "R",
          feedback: [
            { value: 0.55, text: "That leaves out the losers: subtract 0.5 × 1R." },
            { value: 0.1, text: "That's the all-in plan. Use the blended results: +2.0R, +0.5R, −1.0R." },
          ],
          correct: "Right: +0.05R, half the all-in plan's +0.10R.",
        },
        after: "The partial plan's results spread less: a standard deviation of 1.17R, against 1.51R all-in.",
        concept: "scaling-out",
      },
      {
        kind: "predict",
        title: "More winners?",
        prompt: "On the same frequencies, which plan ends with more trades in profit?",
        control: {
          kind: "choice",
          choices: [
            { id: "all", label: "All-in", feedback: "All-in profits only when the runner reaches +3R: 20% of trades." },
            { id: "part", label: "Half at +1R", feedback: "Right." },
            { id: "same", label: "The same", feedback: "The 30% stopped at breakeven are 0R all-in, but +0.5R with half sold." },
          ],
          answer: "part",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "All-in", value: 20, role: "neutral" },
            { label: "Half at +1R", value: 50, role: "accent" },
          ],
          unit: "%",
          steps: ["Trades that end in profit: 20% all-in, 50% with half off at +1R.", "Yet the average is lower: +0.05R against +0.10R."],
        },
        reveal: "50% against 20%: every trade that reaches +1R banks something. More winners and a narrower spread, for a lower average on these numbers. Other frequencies can flip the comparison.",
        concept: "scaling-out",
      },
      {
        kind: "explain",
        title: "Costs in LABX",
        text: "With costs, the half-and-runner trade on 100 units bought at 50.00, stop 49.00 (1R = 104.95), nets +1.86R when the runner reaches +3R, and +0.43R when it's stopped at breakeven. LABX commission is a share of value, so the extra exit adds at most a cent of rounding. A fee per order would cost more.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Partials feel good: more trades end green, and a smaller swing helps with prop-firm drawdown limits (2.11). But a trend system lives on a few large winners, and selling half early caps exactly those: the right tail. Taking gains too soon is the disposition effect (2.12). Decide partials before entry, by rule.",
      },
      {
        kind: "fields",
        title: "Your turn: plan the exits",
        prompt: "Your plan: half off at +1R, the runner trailed. Enter the blended R of each outcome.",
        fields: [
          { id: "runner3", label: "Runner reaches +3R", kind: "choice", options: [-1, -0.5, 0, 0.5, 1, 2, 3, 4], unit: "R", default: 0 },
          { id: "runnerBE", label: "Runner stopped at breakeven", kind: "choice", options: [-1, -0.5, 0, 0.5, 1, 2, 3, 4], unit: "R", default: 0 },
          { id: "stopped", label: "Stopped out before +1R", kind: "choice", options: [-1, -0.5, 0, 0.5, 1, 2, 3, 4], unit: "R", default: 0 },
        ],
        valid: {
          all: [
            { field: "runner3", eq: 2 },
            { field: "runnerBE", eq: 0.5 },
            { field: "stopped", eq: -1 },
          ],
        },
        feedback: [
          { when: { field: "runner3", eq: 3 }, text: "+3R is the runner's result, on half the position. Add the first half: 0.5 × 1 + 0.5 × 3." },
          { when: { field: "runner3", eq: 4 }, text: "Weight each half by its size: 0.5 × 1 + 0.5 × 3, not 1 + 3." },
          { when: { field: "runnerBE", eq: 1 }, text: "+1R was earned on half the position: 0.5 × 1 = +0.5R." },
          { when: { field: "stopped", gt: -1 }, text: "Stopped before +1R, nothing was sold yet: the whole position takes the full −1R." },
          { when: { field: "runner3", gte: -1 }, text: "Weight each part's R by its share: blended R = 0.5 × the first part's R + 0.5 × the runner's." },
        ],
        correct: "Right: +2.0R, +0.5R and −1.0R. Three outcomes, one rule written before entry.",
        concept: "scaling-out",
      },
    ],
    check: ["q-2.7.6-1", "q-2.7.6-2", "q-2.7.6-3"],
    recap: {
      takeaways: [
        "Blended R = Σ share × R of each part: half at +1R and half at 0R is +0.5R.",
        "Partials raise the win rate and narrow the spread; the average can fall, as here: +0.05R vs +0.10R.",
        "Selling early caps the big winners a trend system needs. Decide partials before entry, by rule.",
      ],
    },
  },
};

/**
 * 2.7.7's sample of 40 trades (target +2R, stop −1R, before costs), and the total R for each time-stop bar N
 * ("exit at market if MFE is still under 0.5R after N bars"):
 * - 13 fast winners reach 0.5R by bar 3 and end +2R; 10 fast losers are stopped by bar 3 (−1R);
 * - 5 slow winners reach 0.5R at bars 5, 6, 7, 8 and 11, ending +2R, or −0.1R if the time stop comes first;
 * - 12 slow trades never reach 0.5R by bar 12, worth −0.2R at any time stop: 11 are stopped at bars 9, 9, 10, 10,
 *   11, 11, 12, 12, 13, 15 and 17 (−1R), one reaches 0.5R at bar 14 and ends +2R.
 * Totals: N = 4 → 13.1R; 6 → 17.3R; 8 → 21.5R; 10 → 18.3R; 12 → 17.2R; no time stop → 17.0R.
 */
const L277: Lesson = {
  id: "2.7.7",
  title: "Time stops and planned exits",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A time stop closes a trade that hasn't progressed in N bars; every other early exit needs a reason from the plan, and a stop only ever moves toward less risk.",
  objectives: [
    "Write a time stop: exit if the trade has not reached a set progress within N bars.",
    "Separate planned exits on an opposing signal from fear exits by tagging the reason for every exit.",
    "Keep stop discipline: a stop moves only toward less risk, never wider.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
  ],
  script: {
    unit: "2.7",
    courseId: "2.7.7",
    hook: {
      prompt: "Six trades are going nowhere after 10 bars. Which costs less in total: holding all six to their stops or targets, or exiting all six now at about −0.2R each?",
      control: {
        kind: "choice",
        choices: [
          { id: "hold", label: "Holding all six" },
          { id: "exit", label: "Exiting all six at bar 10" },
        ],
        answer: "exit",
      },
      compare: "You picked {yours}. In the example, holding ended at −3.0R: one +2R winner, five −1R losers. Exiting at bar 10 cost −1.2R, and gave up the winner.",
      concept: "time-stop",
    },
    learn: [
      {
        kind: "worked",
        title: "Six dead trades",
        lines: [
          "Six trades with an MFE under 0.5R after 10 bars.",
          "Held to the end: 1 × (+2R) + 5 × (−1R) = −3.0R.",
          "Time stop at bar 10, about −0.2R each: 6 × (−0.2R) = ?",
        ],
        ask: {
          answer: -1.2,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 1.2, text: "Each exit is a small loss: −0.2R, six times." },
            { value: -3, text: "That's holding them all. The time stop exits each at about −0.2R." },
          ],
          correct: "Right: −1.2R, 1.8R better than holding.",
        },
        after: "The price: the one +2R winner is gone too. A time stop also frees capital and attention for the next setup.",
        concept: "time-stop",
      },
      {
        kind: "figure",
        title: "A time stop on the chart",
        text: "One of the six: long 50 at 100.00, stop 98.00.",
        figure: {
          kind: "chart",
          chart: {
            candles: TS,
            visible: 14,
            layers: [
              { kind: "level", price: 100.0, role: "entry", label: "ENTRY 100.00" },
              { kind: "level", price: 98.0, role: "stop", label: "STOP 98.00" },
            ],
          },
          steps: [
            { text: "Ten bars in, the best high is 100.90: MFE 0.45R, under the 0.5R bar.", layers: [{ kind: "marker", index: 9, at: "high", label: "HIGH 100.90", role: "neutral" }] },
            { text: "The time stop sells at bar 10's bid, 99.60: −0.20R, or −0.24R with commissions.", layers: [{ kind: "marker", index: 13, price: 99.6, label: "TIME STOP 99.60", role: "down" }] },
            { text: "Held instead, three bars later the stop fills at 98.00: −1R.", visible: 17, layers: [{ kind: "marker", index: 16, price: 98.0, label: "STOPPED 98.00", role: "down" }] },
          ],
        },
        concept: "time-stop",
      },
      {
        kind: "explain",
        title: "Write it as a rule",
        text: "A [[time-stop]] is a written exit: 'If MFE is under 0.5R after 10 bars, exit at market.' Choose N from how fast your setup usually works: a breakout that hasn't moved in 10 bars is behaving unlike the ones that win. Then re-test N on new trades.",
      },
      {
        kind: "figure",
        title: "One sample, five lines",
        text: "Total R on one sample of 40 trades, by time-stop bar, before costs.",
        figure: {
          kind: "bars",
          bars: [
            { label: "Bar 4", value: 13.1, role: "neutral" },
            { label: "Bar 6", value: 17.3, role: "neutral" },
            { label: "Bar 8", value: 21.5, role: "accent" },
            { label: "Bar 10", value: 18.3, role: "neutral" },
            { label: "Bar 12", value: 17.2, role: "neutral" },
            { label: "No time stop", value: 17.0, role: "neutral" },
          ],
          unit: "R",
          steps: ["An early line, bar 4, cuts slow winners: 13.1R.", "Bar 8 scores best: 21.5R, about +0.54R a trade.", "Later lines let dead trades run on to the full −1R stop."],
        },
        concept: "time-stop",
      },
      {
        kind: "predict",
        title: "Before you adopt it",
        prompt: "Bar 8 scored best on these 40 trades. What do you do before writing 'N = 8' into your plan?",
        control: {
          kind: "choice",
          choices: [
            { id: "adopt", label: "Adopt it: the data chose it", feedback: "40 trades can favour one line by chance. A handful of trades separates bar 8 from bar 10." },
            { id: "retest", label: "Re-test it on new trades first", feedback: "Right." },
            { id: "seven", label: "Use bar 7, to cut dead trades sooner", feedback: "That tunes the line even harder to this sample, and earlier lines cut more slow winners." },
          ],
          answer: "retest",
        },
        reveal: "A line optimised on a few dozen trades fits their quirks: overfitting. Keep it as a hypothesis, track it on the next 30 or more trades, and adopt it only if it still helps.",
        concept: "time-stop",
      },
      {
        kind: "explain",
        title: "Every exit gets a reason",
        text: "Exits away from the stop or target need an [[exit-reason]] from your [[playbook]]: 'Structure broke', 'Opposite signal', 'Time stop' or 'Event ahead'. Tag each one in your [[journal]]. An exit with no tag is a deviation from the plan, and over time the tags show whether rules or fear drive your exits.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Never widen a stop. Moving it further away 'to give it room' turns a sized loss into an unsized one: measured against the initial 1R, the result is worse than −1R. MARKET//LAB counts it against your Risk Discipline. Re-entering soon after a loss, or bigger, is the same urge as revenge trading (1.7).",
      },
    ],
    task: {
      widget: "bias-spotter",
      goal: "Six exits from long trades. Tag each with its reason from the playbook, or flag it as an exit with no planned reason.",
      data: { cards: EXIT_CARDS, options: EXIT_OPTIONS },
      success: { field: "solved", eq: 6 },
      correct: "Six tagged. A planned exit has a reason you could have written before entry; the rest are deviations to review.",
      hints: [
        "Ask: does the plan name this reason, written before entry?",
        "Structure, a listed signal, a bar count and scheduled news are reasons. Feelings and opinions aren't.",
        "An exit can turn out well and still be a deviation.",
      ],
      showMe: { solved: 6 },
      concept: "exit-rules",
    },
    check: ["q-2.7.7-1", "q-2.7.7-2", "q-2.7.7-3"],
    recap: {
      takeaways: [
        "Write a time stop: if MFE stays under 0.5R after N bars, exit at market.",
        "Tag every early exit with a reason from the plan. An untagged exit is a deviation.",
        "Stops move only toward less risk. Widening one turns a sized loss into an unsized one.",
      ],
    },
  },
};

const L278: Lesson = {
  id: "2.7.8",
  title: "MAE and MFE: learning from your own excursions",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "MAE and MFE measure how far each trade went against you and for you, in R; over enough of your own trades they test your stops and show how much of each move your exits keep.",
  objectives: [
    "Calculate a trade's maximum adverse and maximum favourable excursion in R.",
    "Use an MAE scatter to test a tighter stop, and count the winners it would have cut.",
    "Calculate giveback and exit efficiency, and read them by setup.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "risk_management", label: "Risk management check" },
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
  ],
  script: {
    unit: "2.7",
    courseId: "2.7.8",
    hook: {
      prompt: "Your trade went 2.50R in your favour at best, and you closed it at +1.00R. What share of the best move did you keep?",
      control: { kind: "slider", min: 0, max: 100, step: 5, start: 50, unit: "%", answer: 40, tolerance: 0 },
      compare: "You said {yours}. 1.00 ÷ 2.50 = 40%: your exit efficiency on this trade. The other 1.50R was giveback.",
      concept: "exit-efficiency",
    },
    learn: [
      {
        kind: "explain",
        text: "Every trade has two extremes worth recording. [[mae|MAE]], maximum adverse excursion: how far price went against you, at worst. [[mfe|MFE]], maximum favourable excursion: how far it went for you, at best. Both in R: divide the distance from the entry by the distance to the stop.",
      },
      {
        kind: "worked",
        title: "One trade, four numbers",
        lines: [
          "Entry 50.00, stop 49.00: 1R is 1.00 per unit.",
          "Highest high 52.50: MFE = (52.50 − 50.00) ÷ 1.00 = 2.50R.",
          "Exit at 51.00: +1.00R. [[giveback|Giveback]] 1.50R; [[exit-efficiency|exit efficiency]] 1.00 ÷ 2.50 = 40%.",
          "Lowest low 49.40: MAE = (50.00 − 49.40) ÷ 1.00 = ?",
        ],
        ask: {
          answer: 0.6,
          tolerance: 0.005,
          unit: "R",
          feedback: [
            { value: 0.4, text: "That's how far the low stayed above the stop. MAE is measured from the entry: 50.00 − 49.40." },
            { value: 49.4, text: "That's the price. Express its distance from the entry in R." },
          ],
          correct: "Right: 0.60R. Price went 60% of the way to the stop before turning.",
        },
        after: "MAE shows how much room the trade needed; MFE, how much it offered. Giveback and efficiency show how much of that you kept.",
        concept: "mae-mfe",
      },
      {
        kind: "explain",
        title: "Read them by setup",
        text: "Average exit efficiency and giveback per setup make a weekly number to watch. A setup that keeps 30% of its MFE leaves more on the table than one that keeps 60%. But 100% is impossible without hindsight: no rule sells the exact top. Compare setups with each other, not with perfection.",
      },
      {
        kind: "explain",
        title: "A preview: the edge ratio",
        text: "Average MFE divided by average MAE is the [[edge-ratio]]. Random entries score about 1.0: price wanders as far for you as against you. A setup worth trading should show more room in its favour than against it, after costs. Level 3 tests this properly, against random entries.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Before you tighten a stop from MAE: 20 trades are too few, and a line fitted to them is overfitting. Don't mix setups of different volatility. A tighter stop at the same risk means a bigger size, so costs take a bigger share of R. And re-test the new stop on new trades (Sweeney's method, evidence grade C).",
      },
      {
        kind: "figure",
        title: "Twenty trades, by MAE",
        text: "Each dot is one trade, placed by its MAE in R: eight winners of +2R and twelve losers of −1R.",
        figure: {
          kind: "chart",
          chart: { candles: MAE_SLOTS, hideCandles: true, range: [0, 1.15], describe: MAE_DESCRIBE },
          steps: [
            { text: "Twelve losers went the full 1.00R against you: their MAE is the stop.", layers: [MAE_STOP, ...MAE_LOSS_DOTS] },
            { text: "The eight winners dipped between 0.10R and 0.80R before winning.", layers: MAE_WIN_DOTS },
            { text: "A tighter stop at 0.70R: every dot above the line is stopped out.", layers: [MAE_TIGHT] },
          ],
        },
        concept: "mae-mfe",
      },
      {
        kind: "hotspot",
        title: "Your turn: the cut winner",
        prompt: "The same 20 trades with the stop moved to 0.70R. Tap the winner the tighter stop would have cut.",
        chart: { candles: MAE_SLOTS, hideCandles: true, range: [0, 1.15], describe: MAE_DESCRIBE, layers: [MAE_STOP, MAE_TIGHT, ...MAE_WIN_DOTS, ...MAE_LOSS_DOTS] },
        zones: [
          ...MAE_WINNERS.map((m, i) => ({
            id: `w${i}`,
            label: `Winner, MAE ${m.toFixed(2)}R`,
            index: i,
            price: m,
            feedback: i === 7 ? undefined : `MAE ${m.toFixed(2)}R stays under 0.70R: this winner survives the tighter stop.`,
          })),
          { id: "losers", label: "Losers, MAE 1.00R", index: 14, price: 1.0, feedback: "The losers are stopped either way, now at 0.70R instead of 1.00R." },
        ],
        answer: "w7",
        correct: "Right: that winner dipped 0.80R before winning, past 0.70R. The tighter stop closes it at −0.70R.",
        concept: "mae-mfe",
      },
      {
        kind: "worked",
        title: "Your turn: the new expectancy",
        lines: [
          "Stop at 1.00R: 8 × 2R − 12 × 1R = +4R over 20 trades: +0.20R a trade.",
          "Stop at 0.70R: 7 winners kept; the cut winner and the 12 losers lose 0.70R each.",
          "(7 × 2 − 13 × 0.70) ÷ 20 = ?",
        ],
        ask: {
          answer: 0.245,
          tolerance: 0.005,
          unit: "R",
          feedback: [
            { value: 0.2, text: "That's the old stop. With 0.70R, 13 trades lose 0.70R each and 7 win 2R." },
            { value: 4.9, text: "That's the total. Divide it by the 20 trades." },
            { value: 0.26, text: "That keeps all 8 winners. The one with MAE 0.80 is cut." },
          ],
          correct: "Right: +0.245R in units of the original R, up from +0.20R. One winner lost of eight.",
        },
        after: "That's in the original R. At the same risk, the tighter stop means about 1.43 times the size, and the costs grow with it. Re-test on new trades before adopting it.",
        concept: "mae-mfe",
      },
    ],
    check: ["q-2.7.8-1", "q-2.7.8-2", "q-2.7.8-3"],
    recap: {
      takeaways: [
        "MAE = (entry − lowest low) ÷ R; MFE = (highest high − entry) ÷ R, for a long.",
        "Test a tighter stop on the MAE scatter: count the winners cut, recompute expectancy, on enough trades.",
        "Giveback = MFE − result; efficiency = result ÷ MFE. Compare setups, never against 100%.",
      ],
    },
  },
};

// ─── Check questions ────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 2.7.1 · Entries: anticipate, confirm or wait for the retest
  {
    id: "q-2.7.1-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "A double bottom's peak is 54.00. Your confirmation entry fills at 54.30, with the stop at 53.40 and the target at 56.10. How many R does the target pay, before costs?",
    numeric: { answer: 2, tolerance: 0.01, unit: "R" },
    explanation: "Risk per unit: 54.30 − 53.40 = 0.90. Reward: 56.10 − 54.30 = 1.80. 1.80 ÷ 0.90 = 2.00R. An anticipation entry near the second low would show a far bigger ratio, and fail more often.",
    lesson: "2.7.1",
    concepts: ["entry-techniques", "reward-to-risk"],
    hints: ["Reward-to-risk = (target − entry) ÷ (entry − stop).", "Risk: 54.30 − 53.40. Reward: 56.10 − 54.30.", "1.80 ÷ 0.90 = ?"],
    vary: {
      fields: { e: [40, 120, 0.1], r: [0.4, 2, 0.05], w: [0.5, 5, 0.05] },
      answer: "round(w / r, 2)",
      prompt: "Your confirmation entry fills at {e:2}, with the stop at {e - r:2} and the target at {e + w:2}. How many R does the target pay, before costs?",
      explanation: "Risk per unit: {e:2} − {e - r:2} = {r:2}. Reward: {e + w:2} − {e:2} = {w:2}. {w:2} ÷ {r:2} = {answer:2}R.",
      hint: "{w:2} ÷ {r:2} = ?",
    },
  },
  {
    id: "q-2.7.1-2",
    topic: "order_types",
    kind: "mcq",
    difficulty: 1,
    prompt: "LABX broke above resistance at 99.00 and now trades at 99.60. You want to buy only if price comes back to the broken level. Which order, and what is its main risk?",
    options: [
      { id: "a", label: "A buy limit at 99.10: it may never fill" },
      { id: "b", label: "A buy stop at 99.10: it may slip", rationale: "A buy stop waits above the price. At 99.10, under the ask, it would trigger at once and buy now, not on the retest." },
      { id: "c", label: "A market buy now: it may not fill", rationale: "A market order fills at once, at the ask near 99.65. That isn't the retest, and filling is never its problem." },
      { id: "d", label: "A buy limit at 99.10: it's certain to fill at 99.10", rationale: "A limit controls the price, not the fill. If price never comes back to 99.10, nothing fills." },
    ],
    correct: "a",
    explanation: "A retest entry waits under the price for a return to the broken level: a buy limit. It fills only if the ask comes back to 99.10, so its risk is missing the trade, often one of the strongest.",
    lesson: "2.7.1",
    concepts: ["entry-techniques", "limit-order"],
  },
  {
    id: "q-2.7.1-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "A friend's entry method won 130 of its last 200 trades, 65%. Its expectancy after costs over those trades is −0.05R. He says it's a great entry because it's usually right.",
    prompt: "What do you conclude?",
    options: [
      { id: "a", label: "It's a strong method: winning two trades in three is what matters", rationale: "Hit rate ignores size. If the wins are small and the losses full, a 65% method can lose on average, as this one does." },
      { id: "b", label: "On this record it loses about 0.05R a trade: frequent small wins don't cover the losses" },
      { id: "c", label: "It will turn positive over the next 200 trades, since it wins most of the time", rationale: "Nothing in the method changes with more trades. More data sharpens the estimate; it doesn't fix a negative one." },
      { id: "d", label: "Expectancy can't be negative when the win rate is over 50%", rationale: "It can, whenever the average win is small enough against the average loss." },
    ],
    correct: "b",
    explanation: "Expectancy combines how often and how much: 0.65 × average win − 0.35 × average loss. With full 1R losses, wins averaging about 0.46R give −0.05R. Over 200 trades that's −10R from a method that is usually right.",
    lesson: "2.7.1",
    concepts: ["expectancy", "entry-techniques"],
    hints: ["Expectancy uses the size of wins and losses, not only how often you win.", "Over 200 trades, −0.05R a trade is −10R in total."],
  },

  // 2.7.2 · Scaling in versus averaging down
  {
    id: "q-2.7.2-1",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "Long 40 LABX at 30.00. Price rises to 32.00, and you add 20 more, moving the shared stop to 30.50. Before costs, how much do you lose if that stop is hit?",
    numeric: { answer: 10, tolerance: 0.01, unit: "vUSD" },
    explanation: "Lot 1 at 30.50: 40 × 0.50 = +20.00. Lot 2: 20 × (30.50 − 32.00) = −30.00. Together: −10.00. The position grew by half, and the worst case is a small loss.",
    lesson: "2.7.2",
    concepts: ["pyramiding"],
    hints: ["Worst case = Σ units × (stop − entry), for each lot at the shared stop.", "Lot 1 gains at 30.50; lot 2 loses.", "+20.00 − 30.00 = ?"],
    vary: {
      fields: { u1: [20, 100, 10], u2: [10, 50, 5], e: [20, 80, 1], up: [1, 4, 0.5], s: [0.25, 1.5, 0.25] },
      constraints: ["s < up", "u2 * (up - s) - u1 * s > 0"],
      answer: "round(u2 * (up - s) - u1 * s, 2)",
      prompt: "Long {u1} LABX at {e:2}. Price rises to {e + up:2}, and you add {u2} more, moving the shared stop to {e + s:2}. Before costs, how much do you lose if that stop is hit?",
      explanation: "Lot 1 at {e + s:2}: {u1} × {s:2} = +{u1 * s:2}. Lot 2: {u2} × ({e + s:2} − {e + up:2}) = −{u2 * (up - s):2}. Together: −{answer:2}.",
      hint: "+{u1 * s:2} − {u2 * (up - s):2} = ?",
    },
  },
  {
    id: "q-2.7.2-2",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "Long 40 LABX at 25.00, stop 24.00: 1R is 40.00 before costs. At 24.40 you buy 60 more, same stop. If the stop is hit, how many R do you lose?",
    numeric: { answer: 1.6, tolerance: 0.01, unit: "R" },
    explanation: "Lot 1: 40 × 1.00 = 40.00. Lot 2: 60 × (24.40 − 24.00) = 24.00. Total 64.00 ÷ 40.00 = 1.6R, against the 1R planned.",
    lesson: "2.7.2",
    concepts: ["risk-per-trade", "r-multiple"],
    hints: ["The loss at the stop counts every unit you hold, each from its own price.", "Lot 2 loses 60 × 0.40.", "(40.00 + 24.00) ÷ 40.00 = ?"],
    vary: {
      fields: { u1: [20, 80, 10], u2: [20, 100, 10], e: [20, 100, 1], d: [0.5, 3, 0.25], x: [0.1, 2.5, 0.05] },
      constraints: ["x < d"],
      answer: "round((u1 * d + u2 * (d - x)) / (u1 * d), 2)",
      prompt: "Long {u1} LABX at {e:2}, stop {e - d:2}: 1R is {u1 * d:2} before costs. At {e - x:2} you buy {u2} more, same stop. If the stop is hit, how many R do you lose?",
      explanation: "Lot 1: {u1} × {d:2} = {u1 * d:2}. Lot 2: {u2} × ({e - x:2} − {e - d:2}) = {u2 * (d - x):2}. Total {u1 * d + u2 * (d - x):2} ÷ {u1 * d:2} = {answer:2}R, against the 1R planned.",
      hint: "({u1 * d:2} + {u2 * (d - x):2}) ÷ {u1 * d:2} = ?",
    },
  },
  {
    id: "q-2.7.2-3",
    topic: "position_sizing",
    kind: "mcq",
    difficulty: 2,
    prompt: "After averaging down, your average entry price is better. Why isn't your risk lower?",
    options: [
      { id: "a", label: "It is lower: a better average means a smaller loss at the stop", rationale: "The average improves, but more units sit above the same stop. 100 units 1.50 above it lose more than 50 units 2.00 above it." },
      { id: "b", label: "Commissions double when you add", rationale: "Commission is a share of the value traded. The add costs a little more, but that isn't what turns 1R into 1.5R." },
      { id: "c", label: "More units now sit above the same stop, so the loss at the stop grows" },
      { id: "d", label: "The stop then has to move closer to the price", rationale: "Nothing forces the stop closer. With the same stop, the extra units alone raise the loss." },
    ],
    correct: "c",
    explanation: "Risk is the loss if the stop is hit: units × (average price − stop). Averaging down lowers the average, but raises the units faster. 50 at 50.00 with a 48.00 stop risks 100.00; adding 50 at 49.00 makes it 150.00.",
    lesson: "2.7.2",
    concepts: ["risk-per-trade"],
    hints: ["Write the loss at the stop as units × (average price − stop).", "Compare 50 × 2.00 with 100 × 1.50."],
  },

  // 2.7.3 · Targets: R-multiples, structure and volatility
  {
    id: "q-2.7.3-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "In your last 50 trades, MFE reached 2.5R in 34% of them. With a 2.5R target, and every trade that misses it closing at −1R, what is the expectancy per trade, before costs?",
    numeric: { answer: 0.19, tolerance: 0.005, unit: "R" },
    explanation: "Wins: 0.34 × 2.5R = 0.85R. Losses: 0.66 × 1R = 0.66R. Expectancy: 0.85 − 0.66 = +0.19R per trade, before costs.",
    lesson: "2.7.3",
    concepts: ["profit-targets", "expectancy"],
    hints: ["Expectancy = P × k − (1 − P) × 1R, with P the share that reached the target.", "Wins: 0.34 × 2.5. Losses: 0.66 × 1.", "0.85 − 0.66 = ?"],
    vary: {
      fields: { p: [10, 70, 1], kk: [1, 5, 0.5] },
      constraints: ["abs(p * kk - round(p * kk, 0)) < 0.000001"],
      answer: "round(p / 100 * kk - (1 - p / 100), 2)",
      prompt: "In your last 50 trades, MFE reached {kk:1}R in {p}% of them. With a {kk:1}R target, and every trade that misses it closing at −1R, what is the expectancy per trade, before costs?",
      explanation: "Wins: {p / 100:2} × {kk:1}R = {p / 100 * kk:2}R. Losses: {1 - p / 100:2} × 1R. Expectancy: {answer:2}R per trade, before costs.",
      hint: "{p / 100 * kk:2} − {1 - p / 100:2} = ?",
    },
  },
  {
    id: "q-2.7.3-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 1,
    prompt: "All else equal, what happens to the win rate when you move the target further away?",
    options: [
      { id: "a", label: "It rises, because each win pays more", rationale: "What a win pays and how often you win are different things. Fewer trades travel the extra distance." },
      { id: "b", label: "It stays the same; only the payoff changes", rationale: "A trade counts as a win only if price reaches the target. A further target is reached by fewer trades." },
      { id: "c", label: "It depends only on where the stop is", rationale: "The stop matters, but with it fixed, a further target alone lowers the share of trades that reach it." },
      { id: "d", label: "It falls, because fewer trades travel that far before the stop" },
    ],
    correct: "d",
    explanation: "Only trades whose MFE reaches the target win, and a further target is reached by a smaller share. Each win pays more, so expectancy can rise or fall: it depends on how fast that share drops.",
    lesson: "2.7.3",
    concepts: ["profit-targets", "expectancy"],
  },
  {
    id: "q-2.7.3-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "You're long LABX at 100.00 with the stop at 98.00. Three rallies in the past month stalled at 103.80–104.20. Your fixed rule says 3R, so the target would be 106.00.",
    prompt: "What's the best way to handle the target?",
    options: [
      { id: "a", label: "Keep 106.00: the rule is the rule", rationale: "A rule that ignores obvious opposing structure assumes a break nobody argued for. Rules can, and should, include structure." },
      { id: "b", label: "Set it just under 103.80, or write down why price should break the zone" },
      { id: "c", label: "Put it at 104.20, the top of the zone", rationale: "That's inside the zone where rallies stalled. Price must push through most of the resistance to fill it." },
      { id: "d", label: "Move the stop to 99.00 so a target near 103.80 still pays 3R", rationale: "The stop belongs where the idea fails. Moving it to fit a ratio raises the chance of being stopped by noise." },
    ],
    correct: "b",
    explanation: "A target past clear resistance needs a break your plan hasn't argued for. Either take the structural target just under 103.80, a little under 1.9R, or treat the break as a separate scenario with its own evidence.",
    lesson: "2.7.3",
    concepts: ["profit-targets", "support-and-resistance"],
    hints: ["Where have rallies stopped before?", "A target belongs where the plan says price can reasonably go."],
  },

  // 2.7.4 · Trailing stops
  {
    id: "q-2.7.4-1",
    topic: "stop_loss",
    kind: "numeric",
    difficulty: 1,
    prompt: "Highest high since entry 72.40, ATR 1.10, k = 3. Where is the chandelier stop for your long?",
    numeric: { answer: 69.1, tolerance: 0.005, unit: "vUSD" },
    explanation: "The chandelier hangs k × ATR under the highest high since entry: 72.40 − 3 × 1.10 = 72.40 − 3.30 = 69.10.",
    lesson: "2.7.4",
    concepts: ["chandelier-exit"],
    hints: ["The chandelier hangs k × ATR under the highest high since entry.", "k × ATR = 3 × 1.10 = 3.30.", "72.40 − 3.30 = ?"],
    vary: {
      fields: { hh: [20, 150, 0.1], a: [0.2, 2, 0.05], kk: [2, 4, 0.5] },
      constraints: ["abs(kk * a * 100 - round(kk * a * 100, 0)) < 0.000001"],
      answer: "round(hh - kk * a, 2)",
      prompt: "Highest high since entry {hh:2}, ATR {a:2}, k = {kk:1}. Where is the chandelier stop for your long?",
      explanation: "The chandelier hangs k × ATR under the highest high since entry: {hh:2} − {kk:1} × {a:2} = {hh:2} − {kk * a:2} = {answer:2}.",
      hint: "{hh:2} − {kk * a:2} = ?",
    },
  },
  {
    id: "q-2.7.4-2",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 2,
    prompt: "You switch from a 2-ATR trail to a 4-ATR trail on the same setup. What should you expect, on average?",
    options: [
      { id: "a", label: "Less giveback and longer holds", rationale: "A wider trail sits further from the high, so when it's hit it gives back more, not less." },
      { id: "b", label: "Longer holds and bigger winners, with more of each peak given back" },
      { id: "c", label: "More stop-outs from noise", rationale: "That's the tight trail's problem. A 4-ATR trail sits outside most normal pullbacks." },
      { id: "d", label: "The same results: the trail doesn't change the edge", rationale: "It doesn't create edge, but it changes how long you hold, how much you give back and the spread of results." },
    ],
    correct: "b",
    explanation: "A wider trail survives pullbacks a tighter one wouldn't, so trades last longer and trends can pay more. The price is giveback: when it's finally hit, it sits 4 ATR under the high. Wide trails suit trends and give back nearly everything in ranges.",
    lesson: "2.7.4",
    concepts: ["trailing-stop", "chandelier-exit"],
    hints: ["How far under the high does each trail sit when it's hit?", "Which one survives a 3-ATR pullback?"],
  },
  {
    id: "q-2.7.4-3",
    topic: "stop_loss",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your plan trails a long with a 3-ATR chandelier, now at 61.40. Price pulls back to 61.60. You notice the 20-period EMA is at 60.70 and decide to trail with that instead, 'because it fits this trend better'.",
    prompt: "What's the problem?",
    options: [
      { id: "a", label: "None: the EMA is a valid trailing method", rationale: "It's valid if chosen before entry. Switched in mid-trade, as the stop gets close, it just moves your exit 0.70 further away." },
      { id: "b", label: "The EMA lags, so it will exit too early", rationale: "The EMA sits under the chandelier here, so it would exit later, not earlier. That's the point of the switch." },
      { id: "c", label: "It widens the stop by 0.70 under cover of a new method, decided under pressure" },
      { id: "d", label: "Trailing stops must use ATR", rationale: "Structure, averages and ATR are all valid trails. The problem is changing between them mid-trade." },
    ],
    correct: "c",
    explanation: "Changing the trail as the stop gets close is a widened stop in disguise: the exit moves from 61.40 to 60.70, decided under pressure rather than by the plan. Choose the trail before entry and keep it for the whole trade.",
    lesson: "2.7.4",
    concepts: ["trailing-stop", "stop-loss-order"],
    hints: ["Compare the two exits: 61.40 and 60.70.", "Which way did the exit move, and when was the new rule chosen?"],
  },

  // 2.7.5 · Breakeven stops
  {
    id: "q-2.7.5-1",
    topic: "stop_loss",
    kind: "numeric",
    difficulty: 2,
    prompt: "20 trades, target +2R, stop −1R. Without a breakeven rule: 8 winners, 12 losers. With breakeven at +1R, 2 winners came back to the entry first and 3 losers had reached +1R first. Expectancy with the rule, per trade, before costs?",
    numeric: { answer: 0.15, tolerance: 0.005, unit: "R" },
    explanation: "Winners kept: 6 × 2R = 12R. Losers left: 9 × 1R. The five scratches count 0. (12 − 9) ÷ 20 = +0.15R per trade, down from +0.20R without the rule.",
    lesson: "2.7.5",
    concepts: ["breakeven-stop", "expectancy"],
    hints: ["Killed winners and saved losers both become scratches at 0R.", "Winners left: 8 − 2 = 6. Losers left: 12 − 3 = 9.", "(6 × 2 − 9) ÷ 20 = ?"],
    vary: {
      fields: { w: [4, 10, 1], l: [6, 14, 1], kd: [0, 4, 1], sv: [0, 5, 1] },
      constraints: ["kd <= w", "sv <= l"],
      answer: "round(((w - kd) * 2 - (l - sv)) / (w + l), 2)",
      prompt: "{w + l} trades, target +2R, stop −1R. Without a breakeven rule: {w} winners, {l} losers. With breakeven at +1R, {kd} winners came back to the entry first and {sv} losers had reached +1R first. Expectancy with the rule, per trade, before costs?",
      explanation: "Winners kept: {w - kd} × 2R = {(w - kd) * 2}R. Losers left: {l - sv} × 1R. Scratches count 0. ({(w - kd) * 2} − {l - sv}) ÷ {w + l} = {answer:2}R per trade.",
      hint: "({(w - kd) * 2} − {l - sv}) ÷ {w + l} = ?",
    },
  },
  {
    id: "q-2.7.5-2",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 2,
    prompt: "You bought LABX at the ask, 100.00, and later moved the stop to exactly 100.00. Why does a stop like that get hit so often?",
    options: [
      { id: "a", label: "Brokers move prices to hit breakeven stops", rationale: "The simulator has no such mechanism, and none is needed: the spread and normal noise explain the hits." },
      { id: "b", label: "A breakeven stop fills at a worse price than other stops", rationale: "It fills like any stop: at its price, or at the open after a gap. The problem is where it sits, not how it fills." },
      { id: "c", label: "Moving the stop resets the trade's risk to 1R", rationale: "Moving the stop doesn't change the initial 1R. It only changes where the trade can end." },
      { id: "d", label: "It triggers when the bid falls to 100.00, a mid of 100.05: ordinary noise around your entry gets there" },
    ],
    correct: "d",
    explanation: "A long's stop watches the bid. With a 0.10 spread, the bid reaches 100.00 when the mid is 100.05, above the 99.95 mid when you bought. Any normal wiggle around the entry gets there, and both commissions make the 'breakeven' a small loss.",
    lesson: "2.7.5",
    concepts: ["breakeven-stop"],
    hints: ["Which price does a long's stop watch: the bid or the ask?", "At which mid is the bid 100.00?"],
  },
  {
    id: "q-2.7.5-3",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your trade is up +0.8R. Nothing in your plan mentions breakeven, but you move the stop to your entry: 'I just can't stand watching this one turn into a loss.'",
    prompt: "Which bias is steering this exit?",
    options: [
      { id: "a", label: "Confirmation bias", rationale: "That's seeking evidence that agrees with you. Here the driver is the pain of a possible loss." },
      { id: "b", label: "Loss aversion" },
      { id: "c", label: "FOMO", rationale: "Fear of missing out pushes you into trades. This is about protecting one you're already in." },
      { id: "d", label: "Overconfidence", rationale: "Overconfidence loosens risk control. This tightens it, out of discomfort rather than a rule." },
    ],
    correct: "b",
    explanation: "Losses hurt more than equal gains please. Moving the stop to avoid that pain, not because a written rule says so, is loss aversion steering the exit, and it can end valid trades in ordinary noise. Write a breakeven rule before entry, or leave the stop alone.",
    lesson: "2.7.5",
    concepts: ["loss-aversion", "breakeven-stop"],
    hints: ["What feeling is behind 'I can't stand it'?", "Was the move in the plan before entry?"],
  },

  // 2.7.6 · Partial exits
  {
    id: "q-2.7.6-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "You close half the position at +1.5R and a quarter at +3R. The last quarter is stopped at breakeven. What is the trade's blended R?",
    numeric: { answer: 1.5, tolerance: 0.01, unit: "R" },
    explanation: "Each part's R times its share: 0.5 × 1.5 + 0.25 × 3 + 0.25 × 0 = 0.75 + 0.75 + 0 = +1.5R.",
    lesson: "2.7.6",
    concepts: ["scaling-out", "r-multiple"],
    hints: ["Weight each part's R by its share of the position.", "Half: 0.5 × 1.5. A quarter: 0.25 × 3.", "0.75 + 0.75 + 0 = ?"],
    vary: {
      fields: { a: [1, 2, 0.5], b: [2, 6, 1] },
      answer: "round(0.5 * a + 0.25 * b, 2)",
      prompt: "You close half the position at +{a:1}R and a quarter at +{b:1}R. The last quarter is stopped at breakeven. What is the trade's blended R?",
      explanation: "Each part's R times its share: 0.5 × {a:1} + 0.25 × {b:1} + 0.25 × 0 = {0.5 * a:2} + {0.25 * b:2} + 0 = {answer:2}R.",
      hint: "{0.5 * a:2} + {0.25 * b:2} + 0 = ?",
    },
  },
  {
    id: "q-2.7.6-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "Compared with exiting all at once, what does taking half off at +1R usually do?",
    options: [
      { id: "a", label: "Raises expectancy, because profits are locked in", rationale: "Banking half early also caps half of every big winner. On the lesson's numbers expectancy fell from +0.10R to +0.05R." },
      { id: "b", label: "Lowers the win rate but raises the average win", rationale: "It's the reverse: more trades bank something, and the biggest wins shrink." },
      { id: "c", label: "Raises the win rate and narrows the spread of results; expectancy may rise or fall" },
      { id: "d", label: "Changes nothing, since the entries are the same", rationale: "Same entries, different exits: the distribution of results changes, even if the edge doesn't." },
    ],
    correct: "c",
    explanation: "Every trade that reaches +1R banks something, so more trades end positive, and the largest wins are halved, so results spread less. The average depends on how often runners go far: it can rise or fall.",
    lesson: "2.7.6",
    concepts: ["scaling-out", "expectancy"],
    hints: ["What happens to trades that reach +1R and then reverse?", "And to the rare trade that runs to +5R?"],
  },
  {
    id: "q-2.7.6-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario: "Your trend system wins 30% of its trades. Most of its profit comes from a few trades that run past +5R. A friend suggests taking half off at +1R on every trade, 'to smooth things out'.",
    prompt: "What's the most likely effect?",
    options: [
      { id: "a", label: "Smoother results, but the big runners that pay for the losses are halved: expectancy likely falls" },
      { id: "b", label: "Higher expectancy, since half of every winner is banked", rationale: "Banking +1R on half caps half of each +5R runner, and that's where this system's profit comes from." },
      { id: "c", label: "No effect on results, only on how the trades feel", rationale: "The exits change real results: half of each big runner is sold at +1R." },
      { id: "d", label: "Fewer winners, because half the position is gone", rationale: "The opposite: more trades end positive. What shrinks is the size of the big wins." },
    ],
    correct: "a",
    explanation: "A system with rare big winners earns its expectancy in the right tail. Selling half at +1R raises the win rate and lowers the variance, but halves the large winners. Test the change on the system's own trades before adopting it.",
    lesson: "2.7.6",
    concepts: ["scaling-out", "expectancy"],
    hints: ["Where does this system make its money?", "What happens to a +5R runner when half is sold at +1R?", "Half × 1R + half × 5R = 3R, against 5R."],
  },

  // 2.7.7 · Time stops and planned exits
  {
    id: "q-2.7.7-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "Eight trades are still under +0.5R after 12 bars. Held to the end, 2 would win +2R and 6 would lose 1R. A time stop at bar 12 would exit each at −0.15R. How much better (+) or worse (−) is the total with the time stop, in R?",
    numeric: { answer: 0.8, tolerance: 0.01, unit: "R" },
    explanation: "Held: 2 × 2R − 6 × 1R = −2.0R. Time stop: 8 × (−0.15R) = −1.2R. The time stop is 0.8R better here, at the cost of the two +2R winners.",
    lesson: "2.7.7",
    concepts: ["time-stop"],
    hints: ["Work out both totals, then subtract.", "Held: 2 × 2R − 6 × 1R. Time stop: 8 × −0.15R.", "−1.2 − (−2.0) = ?"],
    vary: {
      fields: { w: [1, 3, 1], l: [3, 9, 1], x: [0.1, 0.3, 0.05] },
      constraints: ["l > 2 * w", "abs((l - 2 * w) - (w + l) * x) > 0.001"],
      answer: "round((l - 2 * w) - (w + l) * x, 2)",
      prompt: "{w + l} trades are still under +0.5R after 12 bars. Held to the end, {w} would win +2R and {l} would lose 1R. A time stop at bar 12 would exit each at −{x:2}R. How much better (+) or worse (−) is the total with the time stop, in R?",
      explanation: "Held: {w} × 2R − {l} × 1R = −{l - 2 * w}R. Time stop: {w + l} × −{x:2}R = −{(w + l) * x:2}R. The difference is {l - 2 * w} − {(w + l) * x:2} = {answer:2}R.",
      hint: "{l - 2 * w} − {(w + l) * x:2} = ?",
    },
  },
  {
    id: "q-2.7.7-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "What makes an exit 'planned'?",
    options: [
      { id: "a", label: "It made money", rationale: "A profitable exit can still be a whim. Planned means the reason existed before the trade." },
      { id: "b", label: "You thought about it for a while first", rationale: "Thinking longer doesn't make a reason part of the plan. It has to be written before entry." },
      { id: "c", label: "Its reason was written in the plan before entry, and you tag it" },
      { id: "d", label: "It happened at the stop or the target", rationale: "Those are planned, but so are time stops and listed signals. The test is a reason written in advance." },
    ],
    correct: "c",
    explanation: "A planned exit follows a reason written before entry: structure broke, a listed opposite signal, a time stop, scheduled news. Tagging each exit lets you check later whether rules or fear drove them.",
    lesson: "2.7.7",
    concepts: ["exit-rules", "trading-plan"],
  },
  {
    id: "q-2.7.7-3",
    topic: "stop_loss",
    kind: "scenario",
    difficulty: 2,
    scenario: "Long 40 LABX at 75.00, stop 73.50: 1R is 60.00 before costs. Price drops to 73.80, and you move the stop to 72.80 'to give it room'. Price then falls to 72.70.",
    prompt: "How should this trade go into your journal?",
    options: [
      { id: "a", label: "−1R: a normal stop-out", rationale: "The loss is 40 × 2.20 = 88.00, about −1.47R against the initial 60.00. And the stop was widened." },
      { id: "b", label: "−1R, since the new stop set the trade's new 1R", rationale: "R is fixed at entry. Moving the stop doesn't create a new 1R; it makes the loss a bigger multiple of the old one." },
      { id: "c", label: "Leave it out: the stop was changed", rationale: "Every trade counts. Leaving out the widened ones would make your journal lie about your risk." },
      { id: "d", label: "About −1.47R, flagged as a widened stop" },
    ],
    correct: "d",
    explanation: "R is set at entry: 60.00. Widening the stop to 72.80 made the loss 40 × 2.20 = 88.00, about −1.47R, and broke the rule that a stop only moves toward less risk. Record it against the initial R and tag it as a widened stop.",
    lesson: "2.7.7",
    concepts: ["stop-loss-order", "initial-risk"],
    hints: ["Which 1R counts: the one at entry, or the one after the move?", "Loss: 40 × (75.00 − 72.80) = 88.00."],
  },

  // 2.7.8 · MAE and MFE
  {
    id: "q-2.7.8-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 1,
    prompt: "Long at 80.00, stop 78.00. The lowest price during the trade was 79.10. What was the MAE, in R?",
    numeric: { answer: 0.45, tolerance: 0.005, unit: "R" },
    explanation: "MAE = (entry − lowest low) ÷ (entry − stop) = (80.00 − 79.10) ÷ (80.00 − 78.00) = 0.90 ÷ 2.00 = 0.45R.",
    lesson: "2.7.8",
    concepts: ["mae-mfe"],
    hints: ["MAE measures how far price went against you, from the entry, in units of the stop distance.", "Distance: 80.00 − 79.10 = 0.90. Stop distance: 2.00.", "0.90 ÷ 2.00 = ?"],
    vary: {
      fields: { e: [20, 150, 0.5], d: [0.5, 4, 0.25], f: [5, 95, 5] },
      constraints: ["abs(d * f - round(d * f, 0)) < 0.000001"],
      answer: "round(f / 100, 2)",
      prompt: "Long at {e:2}, stop {e - d:2}. The lowest price during the trade was {e - d * f / 100:2}. What was the MAE, in R?",
      explanation: "MAE = ({e:2} − {e - d * f / 100:2}) ÷ ({e:2} − {e - d:2}) = {d * f / 100:2} ÷ {d:2} = {answer:2}R.",
      hint: "{d * f / 100:2} ÷ {d:2} = ?",
    },
  },
  {
    id: "q-2.7.8-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "A trade's MFE was +2.40R. You exited at +1.80R. What was your exit efficiency, in percent?",
    numeric: { answer: 75, tolerance: 0.5, unit: "%" },
    explanation: "Efficiency = result ÷ MFE = 1.80 ÷ 2.40 = 75%. The giveback was 0.60R.",
    lesson: "2.7.8",
    concepts: ["exit-efficiency"],
    hints: ["Efficiency is the share of the best unrealised result you kept.", "Divide the exit result by the MFE.", "1.80 ÷ 2.40 = ?"],
    vary: {
      fields: { m: [1, 5, 0.1], p: [10, 90, 5] },
      constraints: ["abs(m * p - round(m * p, 0)) < 0.000001"],
      answer: "p",
      prompt: "A trade's MFE was +{m:2}R. You exited at +{m * p / 100:2}R. What was your exit efficiency, in percent?",
      explanation: "Efficiency = result ÷ MFE = {m * p / 100:2} ÷ {m:2} = {answer}%. The giveback was {m - m * p / 100:2}R.",
      hint: "{m * p / 100:2} ÷ {m:2} = ?",
    },
  },
  {
    id: "q-2.7.8-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "After 12 trades, a trader notices that no winner had an MAE above 0.5R. She tightens every stop to 0.5R from now on.",
    prompt: "What's missing from her decision?",
    options: [
      { id: "a", label: "Nothing: the data show winners never need more than 0.5R", rationale: "Twelve trades can't show that. One winner with a deeper dip in the next 20 would be cut." },
      { id: "b", label: "A wider stop, since tight stops always lose", rationale: "Tight stops aren't always worse; the point is she can't know yet. What's missing is the test, not a rule against tight stops." },
      { id: "c", label: "Enough trades, a re-test on new trades, and the higher cost in R of a tighter stop" },
      { id: "d", label: "Nothing, as long as she keeps her risk per trade at 1%", rationale: "Sizing fixes the loss per trade, but doesn't make 12 trades a reliable guide. A tighter stop also means a bigger size and more cost in R." },
    ],
    correct: "c",
    explanation: "Twelve trades are far too few to fit a stop: the pattern can be chance. She needs a larger sample of one setup, 30 or more, a re-test on trades that didn't shape the rule, and an allowance for costs, which grow in R as the stop tightens.",
    lesson: "2.7.8",
    concepts: ["mae-mfe", "sample-size"],
    hints: ["How many trades are behind the rule?", "Was the rule tested on trades that didn't help create it?"],
  },
];

// ─── Glossary terms and concepts ────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "anticipation-entry",
    term: "Anticipation entry",
    definition: "An entry taken before a pattern or signal is confirmed, usually with a limit order near the expected turn: a better price and a tighter stop, for a lower hit rate.",
    plain: "Getting in early, before the pattern has proved itself.",
    related: ["confirmation-entry", "retest-entry", "limit-order"],
    lesson: "2.7.1",
  },
  {
    id: "confirmation-entry",
    term: "Confirmation entry",
    definition: "An entry taken after a pattern or signal is confirmed, for example by a close beyond a level, usually with a stop or market order: a higher hit rate at a worse price.",
    plain: "Getting in once the pattern has proved itself, at a higher price.",
    related: ["anticipation-entry", "retest-entry", "stop-order"],
    lesson: "2.7.1",
  },
  {
    id: "retest-entry",
    term: "Retest entry",
    definition: "An entry with a limit order at a level price has just broken, filled only if price comes back to it. The price is better than a confirmation entry's, but the trade can be missed entirely.",
    plain: "Waiting for price to come back to the level it broke. It may never come.",
    related: ["confirmation-entry", "adverse-selection", "limit-order"],
    lesson: "2.7.1",
  },
  {
    id: "adverse-selection",
    term: "Adverse selection",
    definition: "The tendency of resting limit orders to fill most surely when price keeps moving through them, and to miss the moves that never come back to them.",
    plain: "Your limit order fills on the trades that go wrong and misses the best ones.",
    related: ["limit-order", "fill", "retest-entry"],
    lesson: "2.7.1",
  },
  {
    id: "pyramiding",
    term: "Pyramiding",
    definition: "Adding to a winning position while moving the stops so that the total result, if every stop is hit, stays within the original 1R.",
    plain: "Adding to a winner, and lifting the stops so the risk doesn't grow.",
    related: ["scaling-in", "open-risk", "split-entry"],
    lesson: "2.7.2",
  },
  {
    id: "split-entry",
    term: "Split entry",
    definition: "Entering a planned position in several parts, with the stop and the total risk set for the full size before the first part is bought.",
    plain: "Buying a planned position in pieces, with the risk planned for all of it.",
    related: ["scaling-in", "pyramiding", "risk-per-trade"],
    lesson: "2.7.2",
  },
  {
    id: "open-risk",
    term: "Open risk",
    definition: "The loss your open positions would take, counted from their entry prices, if every stop were hit now. Stops raised above the entry shrink it, and can turn it into a locked-in gain.",
    plain: "What you'd lose overall if all your stops were hit right now.",
    related: ["r", "pyramiding", "risk-per-trade"],
    lesson: "2.7.2",
  },
  {
    id: "structural-target",
    term: "Structural target",
    definition: "A profit target set just before the next support or resistance zone in the trade's direction, rather than at a fixed multiple of R.",
    plain: "A target at the next level where price has turned before.",
    related: ["take-profit", "resistance", "mfe"],
    lesson: "2.7.3",
  },
  {
    id: "mfe",
    term: "MFE",
    definition: "Maximum favourable excursion: the best unrealised result a trade reached before its exit, usually in R. For a long: (highest high − entry) ÷ (entry − stop).",
    plain: "How far a trade went in your favour, at its best.",
    related: ["mae", "giveback", "exit-efficiency"],
    lesson: "2.7.3",
    aka: ["Maximum favourable excursion"],
  },
  {
    id: "chandelier-exit",
    term: "Chandelier exit",
    definition: "A trailing stop for a long at the highest high since entry minus a multiple of ATR, often 3. It rises with new highs and never moves down.",
    plain: "A stop that hangs a few ATRs under the trade's highest point.",
    related: ["trailing-stop", "atr", "giveback"],
    lesson: "2.7.4",
    aka: ["Chandelier stop"],
  },
  {
    id: "giveback",
    term: "Giveback",
    definition: "The part of a trade's best unrealised gain given back before the exit: the MFE minus the realised result, in R.",
    plain: "How much of the best profit you handed back before you got out.",
    related: ["mfe", "exit-efficiency", "trailing-stop"],
    lesson: "2.7.4",
  },
  {
    id: "breakeven-stop",
    term: "Breakeven stop",
    definition: "A stop moved to the entry price after the trade has gained a set amount, often +1R. Spread and commissions still make an exit there a small loss.",
    plain: "Moving the stop to where you got in, once the trade is up.",
    related: ["scratch-trade", "stop-loss", "trailing-stop"],
    lesson: "2.7.5",
    aka: ["Stop to breakeven"],
  },
  {
    id: "scratch-trade",
    term: "Scratch trade",
    definition: "A trade closed at about zero before costs, often by a breakeven stop.",
    plain: "A trade that ends roughly flat.",
    related: ["breakeven-stop", "commission"],
    lesson: "2.7.5",
    aka: ["Scratch"],
  },
  {
    id: "blended-r",
    term: "Blended R",
    definition: "The total R of a trade closed in parts: each part's R multiplied by its share of the position, then added up.",
    plain: "The overall R of a trade you sold in pieces.",
    related: ["scaling-out", "runner", "r-multiple"],
    lesson: "2.7.6",
  },
  {
    id: "runner",
    term: "Runner",
    definition: "The part of a position kept open after a partial exit, usually under a trailing stop.",
    plain: "The piece you leave running after taking some profit.",
    related: ["scaling-out", "blended-r", "trailing-stop"],
    lesson: "2.7.6",
  },
  {
    id: "time-stop",
    term: "Time stop",
    definition: "A written rule to exit a trade that hasn't made a set progress, such as +0.5R, within a set number of bars.",
    plain: "Getting out of a trade that's going nowhere, after a set time.",
    related: ["exit-reason", "stop-loss", "trading-plan"],
    lesson: "2.7.7",
  },
  {
    id: "exit-reason",
    term: "Exit reason",
    definition: "A tag recording why a trade was closed, chosen from reasons written in the plan before entry: structure broke, opposite signal, time stop or event ahead.",
    plain: "A label saying why you got out, picked from your plan.",
    related: ["time-stop", "journal", "playbook"],
    lesson: "2.7.7",
  },
  {
    id: "mae",
    term: "MAE",
    definition: "Maximum adverse excursion: the worst unrealised result a trade reached before its exit, usually in R. For a long: (entry − lowest low) ÷ (entry − stop).",
    plain: "How far a trade went against you, at its worst.",
    related: ["mfe", "stop-loss", "edge-ratio"],
    lesson: "2.7.8",
    aka: ["Maximum adverse excursion"],
  },
  {
    id: "exit-efficiency",
    term: "Exit efficiency",
    definition: "The share of a trade's MFE kept at the exit: the realised result divided by the MFE.",
    plain: "How much of the best profit you actually kept.",
    related: ["mfe", "giveback"],
    lesson: "2.7.8",
  },
  {
    id: "edge-ratio",
    term: "Edge ratio",
    definition: "Average MFE divided by average MAE over a set of entries, both measured in the same unit, such as R or ATR. Random entries score about 1.",
    plain: "How much further trades go for you than against you, on average.",
    related: ["mae", "mfe"],
    lesson: "2.7.8",
    aka: ["E-ratio"],
  },
];

const CONCEPTS: Concept[] = [
  {
    id: "entry-techniques",
    name: "Entry techniques",
    category: "order_types",
    summary: "Anticipation, confirmation and retest entries and their order types, compared in R and expectancy.",
    body: [
      "The same setup can be entered three ways. Anticipation buys before confirmation, usually with a limit: the best price and the tightest stop, and the lowest hit rate. Confirmation buys after the signal completes, with a stop or market order: a higher hit rate at a worse price. A retest waits with a limit at the broken level: a good price if price comes back, no trade if it doesn't.",
      "Reward-to-risk favours the early entry; hit rate favours the late one. Neither decides alone. Compare entries by expectancy after costs, over many trades, and count the trades a limit never filled.",
    ],
    example:
      "A double bottom with lows 96.00 and 96.20, peak 99.00 and target 100.95. Anticipation at 96.40, stop 95.80: 7.58R. Confirmation at 99.35, stop 98.20: 1.39R. Retest at 99.10, stop 98.20: 2.06R. All before costs.",
    related: ["limit-order", "market-order", "expectancy"],
    missions: [],
    lessons: ["2.7.1"],
  },
  {
    id: "pyramiding",
    name: "Pyramiding",
    category: "position_sizing",
    summary: "Adding to a winning position while moving stops so total open risk stays within the original R.",
    body: [
      "Every add raises the loss at the stop unless the stop moves. A pyramid adds only to a winner and lifts the stops, so the worst case if every stop is hit, Σ units × (stop − entry), stays within the original 1R.",
      "Averaging down is the opposite: adding to a loser raises the loss at the same stop beyond the plan. A split entry is different again: the full size and its risk are planned before the first part is bought.",
    ],
    example: "50 at 50.00, stop 48.00: 1R = 100.00. At 54.00, add 25 and lift both stops to 51.00: lot 1 +50.00, lot 2 −75.00, worst case −25.00, a quarter of 1R before costs.",
    related: ["risk-per-trade", "r-multiple", "position-sizing"],
    missions: [],
    lessons: ["2.7.2"],
  },
  {
    id: "profit-targets",
    name: "Profit targets",
    category: "risk_management",
    summary: "Exit levels set by R-multiple, structure or volatility, whose best choice depends on the regime.",
    body: [
      "A target can be a fixed multiple of R, the next structure level with a small buffer, or a multiple of ATR from the entry. Whichever it is, it's set before entry.",
      "Which pays best depends on how far trades travel. With P the share whose MFE reached k R, and the rest closing at −1R, expectancy is about P × k − (1 − P). Trends favour further targets, ranges closer ones: measure it, don't assume it.",
    ],
    example: "Trending market: MFE reached 3R in 33% of trades, 0.33 × 3 − 0.67 = +0.32R. Range: 3R was reached in 22%, −0.12R, while 1R and 2R both gave +0.20R. Illustrative, before costs.",
    related: ["reward-to-risk", "expectancy", "support-and-resistance"],
    missions: [],
    lessons: ["2.7.3"],
  },
  {
    id: "chandelier-exit",
    name: "Chandelier exit",
    category: "stop_loss",
    summary: "A trailing stop at the highest high since entry minus a multiple of ATR.",
    body: [
      "The chandelier hangs k × ATR under the highest high since entry, often with k = 3. New highs lift it, pullbacks leave it where it is, and it never moves down, even when ATR grows.",
      "It's a risk tool, not a predictor: no setting has robust evidence behind it. A wide k holds trends longer and gives back more when it's hit; a tight k exits sooner, often on noise.",
    ],
    example: "Highest high 54.00, ATR 0.80, k = 3: stop 54.00 − 2.40 = 51.60. Hit without a gap, it gives back exactly 2.40 per unit from the high.",
    related: ["trailing-stop", "volatility", "stop-loss-order"],
    missions: ["M07"],
    lessons: ["2.7.4"],
  },
  {
    id: "breakeven-stop",
    name: "Breakeven stop",
    category: "stop_loss",
    summary: "Moving the stop to the entry price after a set gain; it can lower expectancy.",
    body: [
      "After a gain such as +1R, the stop moves to the entry, so a reversal ends as a scratch instead of a loss. The rule saves losers that had passed +1R and kills winners that dip back to the entry before going on.",
      "Its net effect depends on your trades' paths, so test it with and without on your own record. At the exact entry, the spread and commissions still cost you, and a gap can still fill the stop well below it.",
    ],
    example: "Ten trades, target +2R: 4 winners and 6 losers, +0.20R a trade. With breakeven at +1R, 2 winners are scratched and 1 loser saved: 4 − 5 = −1R, −0.10R a trade.",
    related: ["trailing-stop", "expectancy", "loss-aversion"],
    missions: ["M07"],
    lessons: ["2.7.5"],
  },
  {
    id: "scaling-out",
    name: "Scaling out",
    category: "risk_management",
    summary: "Closing a position in parts, which raises the win rate and lowers variance, with an uncertain effect on expectancy.",
    body: [
      "A trade closed in parts has a blended R: each part's R times its share of the position. Half at +1R and half at breakeven is +0.5R.",
      "Partials turn more trades positive and narrow the spread of results, but they also cap the largest winners. For a system that lives on rare big trades, that can cost more than it smooths.",
    ],
    example: "Runner to +3R in 20% of trades, runner at breakeven 30%, stopped 50%: all-in +0.10R a trade with a standard deviation of 1.51R; half at +1R +0.05R with 1.17R. Illustrative, before costs.",
    related: ["r-multiple", "expectancy", "variance"],
    missions: [],
    lessons: ["2.7.6"],
  },
  {
    id: "time-stop",
    name: "Time stop",
    category: "stop_loss",
    summary: "Exiting a trade that has not made set progress within a set number of bars.",
    body: [
      "A time stop is written before entry: 'If MFE is under 0.5R after N bars, exit at market.' It closes trades that aren't behaving like the setup's winners, for a small loss instead of a full one, and frees capital and attention.",
      "It also cuts some slow winners. N should match the setup's pace and be re-tested on new trades: a line optimised on a few dozen trades is overfitting.",
    ],
    example: "Six trades under 0.5R after 10 bars. Held: one +2R, five −1R, −3.0R. Time stop at about −0.2R each: −1.2R, without the winner.",
    related: ["exit-rules", "stop-loss-order", "trading-plan"],
    missions: [],
    lessons: ["2.7.7"],
  },
  {
    id: "exit-rules",
    name: "Planned exits",
    category: "decision_making",
    summary: "Exits decided by written rules and tagged with a reason, as opposed to exits driven by fear.",
    body: [
      "Besides the stop and the target, a plan lists the reasons that justify an early exit: structure broke, an opposite signal, a time stop, an event ahead. Each exit gets its reason as a tag in the journal.",
      "An exit with no tag is a deviation, even when it works out. Over time the tags show whether rules or fear drive your exits. Stops follow the same discipline: they move only toward less risk, never wider.",
    ],
    example: "Three red candles make you nervous and you sell, though nothing in the plan happened: 'no planned reason'. A close under the higher low your setup needed: 'structure broke'.",
    related: ["time-stop", "trading-plan", "loss-aversion", "journaling"],
    missions: ["M07"],
    lessons: ["2.7.7"],
  },
  {
    id: "mae-mfe",
    name: "MAE and MFE",
    category: "risk_management",
    summary: "The worst and the best unrealised result during a trade, in R, used to review stops and targets.",
    body: [
      "For a long, MAE = (entry − lowest low) ÷ (entry − stop) and MFE = (highest high − entry) ÷ (entry − stop). MAE shows how much room winners needed; MFE, how far trades travelled.",
      "Plotting MAE against the final result tests a tighter stop: count the winners it would have cut and recompute expectancy. It only means something with enough trades from one setup, and the result has to be re-tested on new trades.",
    ],
    example:
      "Entry 50.00, stop 49.00, low 49.40, high 52.50: MAE 0.60R, MFE 2.50R. On 20 trades, a stop at 0.70R instead of 1.00R cut one winner and raised expectancy from +0.20R to +0.245R, in the original R.",
    related: ["exit-efficiency", "journaling", "r-multiple", "sample-size"],
    missions: [],
    lessons: ["2.7.8"],
  },
  {
    id: "exit-efficiency",
    name: "Exit efficiency",
    category: "risk_management",
    summary: "The share of a trade's best unrealised gain that was actually kept at the exit.",
    body: [
      "Exit efficiency = realised result ÷ MFE; giveback = MFE − realised result. Averaged by setup, they show which exits leave the most on the table.",
      "100% is impossible without hindsight, since no rule sells the exact top. Compare setups and exit rules with each other, over enough trades, not with perfection.",
    ],
    example: "MFE 2.50R, exit at +1.00R: efficiency 40%, giveback 1.50R.",
    related: ["mae-mfe", "trailing-stop"],
    missions: [],
    lessons: ["2.7.8"],
  },
];

export const UNIT_2_7: UnitContent = { lessons: [L271, L272, L273, L274, L275, L276, L277, L278], questions: QUESTIONS, terms: TERMS, concepts: CONCEPTS };
