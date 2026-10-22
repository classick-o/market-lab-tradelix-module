import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, MarkRole, Question, TaskData, UnitContent } from "../../types";

/*
 * Unit 2.6 · Price action bar by bar (docs/learn/course/level-2-practitioner-a.md).
 *
 * Conventions in this file:
 * - Candle indices in layers and tap zones are 0-based; copy uses 1-based bar numbers ("bar 13" is index 12).
 * - Bar rules (the app's conventions after Al Brooks, card 2.6.1): trend bar = body ≥ 0.5 × range and close in the
 *   extreme third in the body's direction; doji bar = body ≤ 0.25 × range. Overlap of two bars = shared range ÷ the
 *   smaller bar's range (0 if they don't touch).
 * - Inside bar: H ≤ H₋₁ and L ≥ L₋₁. Outside bar: H > H₋₁ and L < L₋₁. NR7: range narrower than each of the six before.
 * - ATR(14) is Wilder's, seeded with the mean of the first 14 true ranges; EMA 20 is seeded with the SMA of 20 closes.
 * Every number quoted in the copy was checked against these series with a script.
 */

/** Rows of [open, high, low, close] → candles. */
const k = (rows: [number, number, number, number][]): CandleData[] => rows.map(([o, h, l, c]) => ({ o, h, l, c }));
const mark = (index: number, at: "high" | "low" | "open" | "close", label: string, role: MarkRole = "concept"): ChartLayer => ({ kind: "marker", index, at, label, role });

// ─── 2.6.1 data ─────────────────────────────────────────────────────────────

/** Hook: six small-bodied bars; overlaps 92%, 85%, 77%, 85%, 100%, average 88%. */
const L261_HOOK = k([
  [100.1, 100.45, 99.8, 100.2], [100.2, 100.5, 99.85, 100.05], [100.05, 100.4, 99.75, 100.15], [100.15, 100.55, 99.9, 100.1], [100.1, 100.45, 99.8, 99.95],
  [99.95, 100.4, 99.85, 100.1],
]);
/** B1: a bull trend bar (body 1.00 of 1.10) and a doji bar (body 0.10 of 0.80); they share 100.45–101.05, 0.60 = 75% of 0.80. */
const L261_DEF = k([
  [100.0, 101.05, 99.95, 101.0], [101.0, 101.25, 100.45, 100.9],
]);
/** B4: 11 bars of an uptrend: five bull trend bars, a doji (bar 6), five bull trend bars. Overlaps 13, 10, 19, 12, 47, 47, 14, 10, 14, 14 %; average 19.8%. */
const L261_TREND = k([
  [100.0, 100.43, 99.98, 100.4], [100.4, 100.84, 100.37, 100.82], [100.82, 101.22, 100.8, 101.18], [101.18, 101.65, 101.14, 101.62], [101.62, 102.02, 101.6, 102.0],
  [102.0, 102.18, 101.88, 102.06], [102.06, 102.5, 102.04, 102.47], [102.47, 102.86, 102.44, 102.84], [102.84, 103.31, 102.82, 103.27], [103.27, 103.69, 103.25, 103.66],
  [103.66, 104.08, 103.63, 104.06],
]);
/** B6: 12 bars between 99.50 and 100.50 (average overlap 64%), bar 13 a bull trend bar closing 100.55, then closes 100.30, 100.05, 99.90, 100.05. */
const L261_RANGE = k([
  [100.0, 100.3, 99.75, 99.9], [99.9, 100.15, 99.6, 100.05], [100.05, 100.45, 99.95, 100.35], [100.35, 100.5, 100.0, 100.1], [100.1, 100.2, 99.7, 99.8],
  [99.8, 99.95, 99.5, 99.65], [99.65, 100.0, 99.55, 99.95], [99.95, 100.3, 99.85, 100.2], [100.2, 100.4, 99.9, 100.0], [100.0, 100.1, 99.6, 99.75],
  [99.75, 100.05, 99.65, 99.95], [99.95, 100.25, 99.85, 100.05], [100.05, 100.6, 100.0, 100.55], [100.55, 100.65, 100.25, 100.3], [100.3, 100.4, 99.95, 100.05],
  [100.05, 100.2, 99.8, 99.9], [99.9, 100.15, 99.75, 100.05],
]);

const BAR_OPTIONS = [
  { id: "bull", label: "Bull trend bar", what: "A bull trend bar needs a body of at least half the range and a close in the top third." },
  { id: "bear", label: "Bear trend bar", what: "A bear trend bar needs a body of at least half the range and a close in the bottom third." },
  { id: "doji", label: "Doji bar", what: "A doji bar has a body of a quarter of the range or less." },
  { id: "neither", label: "Neither", what: "Neither is for bodies between a quarter and a half of the range, or big bodies closing mid-range." },
];
/** Try: eight bars as cards; a wrong pick shows that option's rule, then the card's measurements. */
function barCards(cards: { id: string; text: string; answer: string; clue: string; correct: string }[]): TaskData {
  return {
    options: BAR_OPTIONS.map(({ id, label }) => ({ id, label })),
    cards: cards.map((c) => ({
      id: c.id,
      text: c.text,
      answer: c.answer,
      correct: c.correct,
      rationales: Object.fromEntries(BAR_OPTIONS.filter((o) => o.id !== c.answer).map((o) => [o.id, `${o.what} Here: ${c.clue}`])),
    })),
  };
}
const L261_CARDS = barCards([
  { id: "b1", text: "Open 100.00, high 101.00, low 99.90, close 100.95.", answer: "bull", clue: "body 0.95 of a 1.10 range, 86%; close 100.95, top third from 100.63.", correct: "Body 0.95 of 1.10, 86%, and the close sits in the top third: a bull trend bar." },
  { id: "b2", text: "Open 100.50, high 100.90, low 100.10, close 100.55.", answer: "doji", clue: "body 0.05 of a 0.80 range, 6%.", correct: "Body 0.05 of 0.80, 6%: a doji bar. Price went both ways and ended where it began." },
  { id: "b3", text: "Open 100.20, high 100.80, low 100.00, close 100.50.", answer: "neither", clue: "body 0.30 of a 0.80 range, 38%.", correct: "Body 0.30 of 0.80, 38%: too big for a doji bar, too small for a trend bar." },
  { id: "b4", text: "Open 101.20, high 101.30, low 100.40, close 100.50.", answer: "bear", clue: "body 0.70 of a 0.90 range, 78%; close 100.50, bottom third up to 100.70.", correct: "Body 0.70 of 0.90, 78%, closing in the bottom third: a bear trend bar." },
  { id: "b5", text: "Open 100.00, high 101.00, low 100.00, close 100.60.", answer: "neither", clue: "body 0.60 of a 1.00 range, 60%, but close 100.60 is under the top third, which starts at 100.67.", correct: "A big body, 60%, but the close, 100.60, sits mid-range, under 100.67. Sellers took back the top: neither." },
  { id: "b6", text: "Open 100.00, high 100.60, low 99.40, close 100.10.", answer: "doji", clue: "body 0.10 of a 1.20 range, 8%.", correct: "Body 0.10 of 1.20, 8%: a doji bar with long wicks both ways." },
  { id: "b7", text: "Open 100.80, high 100.85, low 100.00, close 100.10.", answer: "bear", clue: "body 0.70 of a 0.85 range, 82%; close 100.10, bottom third up to 100.28.", correct: "Body 0.70 of 0.85, 82%, closing near the low: a bear trend bar." },
  { id: "b8", text: "Open 100.30, high 100.70, low 100.10, close 100.40.", answer: "doji", clue: "body 0.10 of a 0.60 range, 17%.", correct: "Body 0.10 of 0.60, 17%: under a quarter, so a doji bar." },
]);

// ─── 2.6.2 data ─────────────────────────────────────────────────────────────

/**
 * 12 bars: a prior low 100.25 (bar 3), a rally to 101.60, a decline into the signal bar (bar 10: o 100.36, h 100.80,
 * l 100.20, c 100.72; body 60%, lower wick 0.16 = 27%, upper wick 0.08 = 13%), and the entry bar (bar 11: h 101.10, c 101.05).
 */
const L262_SIGNAL = k([
  [101.0, 101.1, 100.6, 100.7], [100.7, 100.8, 100.35, 100.45], [100.45, 100.55, 100.25, 100.4], [100.4, 100.9, 100.35, 100.85], [100.85, 101.3, 100.8, 101.25],
  [101.25, 101.6, 101.1, 101.2], [101.2, 101.3, 100.9, 101.0], [101.0, 101.05, 100.65, 100.7], [100.7, 100.75, 100.3, 100.36], [100.36, 100.8, 100.2, 100.72],
  [100.72, 101.1, 100.65, 101.05], [101.05, 101.3, 100.95, 101.25],
]);

// ─── 2.6.3 data ─────────────────────────────────────────────────────────────

/** B1: bar 2 inside bar 1 (100.80 ≤ 100.90, 100.20 ≥ 99.90); bar 3 outside bar 2 (101.00, 100.10). */
const L263_DEF = k([
  [100.2, 100.9, 99.9, 100.7], [100.7, 100.8, 100.2, 100.4], [100.4, 101.0, 100.1, 100.95],
]);
/** B2–B3: bar 4 inside, bar 5 outside, bar 11 NR7 (0.30 vs 0.90, 0.50, 0.50, 0.55, 0.48, 0.50) and not inside. Ranges: 0.70 0.60 0.60 0.45 0.90 0.50 0.50 0.55 0.48 0.50 0.30 0.55. */
const L263_TAP = k([
  [100.0, 100.5, 99.8, 100.4], [100.4, 100.9, 100.3, 100.8], [100.8, 101.1, 100.5, 100.6], [100.6, 101.0, 100.55, 100.9], [100.9, 101.3, 100.4, 101.2],
  [101.2, 101.6, 101.1, 101.5], [101.5, 101.7, 101.2, 101.3], [101.3, 101.55, 101.0, 101.1], [101.1, 101.4, 100.92, 101.35], [101.35, 101.55, 101.05, 101.45],
  [101.45, 101.6, 101.3, 101.4], [101.4, 101.9, 101.35, 101.85],
]);
/** B4 and Try: the ii of the card. Bar 4 h 101.00 l 99.80; bar 5 h 100.80 l 100.00; bar 6 h 100.70 l 100.10. */
const L263_II = k([
  [100.1, 100.4, 99.9, 100.3], [100.3, 100.55, 100.05, 100.15], [100.15, 100.35, 99.75, 99.9], [99.9, 101.0, 99.8, 100.8], [100.8, 100.8, 100.0, 100.2],
  [100.2, 100.7, 100.1, 100.55],
]);
/** B5 hikkake: bar 5 inside bar 4 (h 100.85, l 100.35); bar 6 breaks to 100.10 and closes 100.20; bar 8 closes 100.95, above 100.85, with a high of 101.00. */
const L263_HIKKAKE = k([
  [100.8, 101.1, 100.6, 101.0], [101.0, 101.2, 100.7, 100.8], [100.8, 100.95, 100.4, 100.5], [100.5, 100.9, 100.3, 100.85], [100.85, 100.85, 100.35, 100.45],
  [100.45, 100.5, 100.1, 100.2], [100.2, 100.6, 100.15, 100.55], [100.55, 101.0, 100.5, 100.95], [100.95, 101.25, 100.9, 101.2],
]);

// ─── 2.6.4 data ─────────────────────────────────────────────────────────────

/**
 * 13 bars: an uptrend to bar 7 (high 105.00), then the card's pullback. Bar 9 ends leg A (h 104.30, l 103.90);
 * bar 10 is H1 (104.50 > 104.30); bar 12 makes the pullback low 103.70 (signal bar, h 104.00); bar 13 is H2 (104.35 > 104.00).
 */
const L264_PULLBACK = k([
  [102.4, 102.75, 102.35, 102.7], [102.7, 103.05, 102.55, 102.95], [102.95, 103.1, 102.7, 102.8], [102.8, 103.4, 102.75, 103.35], [103.35, 103.9, 103.3, 103.85],
  [103.85, 104.55, 103.8, 104.5], [104.5, 105.0, 104.4, 104.6], [104.6, 104.6, 104.1, 104.2], [104.2, 104.3, 103.9, 104.05], [104.05, 104.5, 104.0, 104.15],
  [104.15, 104.2, 103.85, 103.88], [103.88, 104.0, 103.7, 103.97], [103.97, 104.35, 103.95, 104.3],
]);
/** B3: a bear trend to 96.80 (bar 5), a rally: L1 = bar 8 (97.20 < 97.30), new rally high 97.95 on bar 10, L2 = bar 11 (97.25 < 97.60). */
const L264_BEAR = k([
  [98.6, 98.65, 98.25, 98.3], [98.3, 98.45, 97.95, 98.05], [98.05, 98.2, 97.65, 97.7], [97.7, 97.75, 97.2, 97.25], [97.25, 97.35, 96.8, 97.15],
  [97.15, 97.45, 97.05, 97.4], [97.4, 97.7, 97.3, 97.6], [97.6, 97.65, 97.2, 97.35], [97.35, 97.85, 97.3, 97.8], [97.8, 97.95, 97.6, 97.63],
  [97.63, 97.68, 97.25, 97.3],
]);

// ─── 2.6.5 data ─────────────────────────────────────────────────────────────

/** Hook and B1: bars 2–9 never take out the previous low (a micro channel); bar 10 dips to 101.20 under bar 9's 101.30. */
const L265_MICRO = k([
  [100.0, 100.3, 99.9, 100.25], [100.25, 100.5, 100.1, 100.45], [100.45, 100.7, 100.3, 100.6], [100.6, 100.85, 100.45, 100.8], [100.8, 100.95, 100.6, 100.7],
  [100.7, 101.1, 100.65, 101.05], [101.05, 101.3, 100.9, 101.25], [101.25, 101.45, 101.1, 101.35], [101.35, 101.7, 101.3, 101.65], [101.65, 101.75, 101.2, 101.3],
]);
/** B3: three pushes up. Swing highs 101.00 (bar 3), 101.20 (bar 7), 101.25 (bar 11); legs from 99.80, 100.40, 100.75: 1.20, 0.80, 0.50. Bar 13 falls to 100.40. */
const L265_WEDGE = k([
  [100.0, 100.2, 99.8, 100.1], [100.1, 100.6, 100.05, 100.55], [100.55, 101.0, 100.5, 100.95], [100.95, 100.98, 100.6, 100.65], [100.65, 100.7, 100.4, 100.5],
  [100.5, 100.9, 100.45, 100.85], [100.85, 101.2, 100.8, 101.15], [101.15, 101.18, 100.85, 100.9], [100.9, 100.95, 100.75, 100.85], [100.85, 101.1, 100.8, 101.05],
  [101.05, 101.25, 100.95, 101.1], [101.1, 101.15, 100.7, 100.75], [100.75, 100.8, 100.4, 100.45],
]);
/**
 * B6–B7: a channel. Swing lows 100.20 (bar 4) and 100.70 (bar 9) set the line, 100.20 + 0.10 a bar. After bar 11 the
 * only touch (low within 0.05, close above) is bar 14 (low 101.22, line 101.20); bar 18 closes 101.50 under the line at 101.60.
 * Pullbacks: 101.35 → 100.70 (0.65 of a 1.15 leg, 57%) and 101.85 → 101.22 (0.63 of 1.15, 55%). Average range of bars 1–11: 0.38.
 */
const L265_CHANNEL = k([
  [100.1, 100.4, 100.05, 100.35], [100.35, 100.65, 100.3, 100.6], [100.6, 100.75, 100.4, 100.45], [100.45, 100.55, 100.2, 100.5], [100.5, 100.95, 100.45, 100.9],
  [100.9, 101.25, 100.85, 101.2], [101.2, 101.35, 101.0, 101.05], [101.05, 101.1, 100.8, 100.85], [100.85, 101.0, 100.7, 100.95], [100.95, 101.4, 100.9, 101.35],
  [101.35, 101.7, 101.3, 101.65], [101.65, 101.85, 101.5, 101.55], [101.55, 101.6, 101.25, 101.3], [101.3, 101.5, 101.22, 101.45], [101.45, 101.8, 101.42, 101.75],
  [101.75, 102.0, 101.7, 101.9], [101.9, 101.95, 101.6, 101.65], [101.65, 101.7, 101.45, 101.5], [101.5, 101.55, 101.2, 101.25], [101.25, 101.4, 101.1, 101.35],
]);
const L265_LINE: ChartLayer = { kind: "line", values: L265_CHANNEL.map((_, i) => Math.round((100.2 + 0.1 * (i - 3)) * 100) / 100), role: "accent", label: "YOUR LINE" };

// ─── 2.6.6 data ─────────────────────────────────────────────────────────────

/** B2: a range 98.00–99.95; bar 13 closes 97.70 (h 98.20); bar 14 closes 98.30, back inside (h 98.40); bar 17 closes 99.30. */
const L266_BREAKDOWN = k([
  [99.0, 99.4, 98.85, 99.3], [99.3, 99.8, 99.2, 99.7], [99.7, 99.95, 99.4, 99.5], [99.5, 99.6, 99.0, 99.1], [99.1, 99.25, 98.6, 98.7],
  [98.7, 98.9, 98.05, 98.2], [98.2, 98.75, 98.1, 98.65], [98.65, 99.2, 98.55, 99.05], [99.05, 99.55, 98.95, 99.4], [99.4, 99.6, 98.9, 99.0],
  [99.0, 99.1, 98.4, 98.5], [98.5, 98.6, 98.0, 98.15], [98.15, 98.2, 97.6, 97.7], [97.7, 98.4, 97.65, 98.3], [98.3, 98.8, 98.2, 98.7],
  [98.7, 99.15, 98.6, 99.05], [99.05, 99.4, 98.95, 99.3],
]);
/** 14 bars between 100.05 and 102.00, shared by both breakouts. */
const L266_RANGE: [number, number, number, number][] = [
  [101.0, 101.4, 100.85, 101.3], [101.3, 101.75, 101.2, 101.65], [101.65, 101.95, 101.5, 101.6], [101.6, 101.7, 101.1, 101.2], [101.2, 101.3, 100.6, 100.7],
  [100.7, 100.8, 100.05, 100.2], [100.2, 100.7, 100.1, 100.65], [100.65, 101.2, 100.55, 101.1], [101.1, 101.6, 101.0, 101.5], [101.5, 102.0, 101.4, 101.85],
  [101.85, 101.95, 101.35, 101.45], [101.45, 101.55, 100.95, 101.1], [101.1, 101.6, 101.0, 101.55], [101.55, 101.95, 101.45, 101.9],
];
/** Breakout 1: bar 15 closes 102.40 (h 102.55, l 101.90); bar 16 closes 101.80 (l 101.70), back inside; lows 101.30, 100.90, 100.70 after. */
const L266_FAIL = k([
  ...L266_RANGE,
  [101.9, 102.55, 101.9, 102.4], [102.4, 102.5, 101.7, 101.8], [101.8, 101.85, 101.3, 101.4], [101.4, 101.5, 100.9, 101.0], [101.0, 101.2, 100.7, 100.85],
]);
/** Breakout 2: bar 15 closes 102.55 (l 101.85); bar 16 closes 102.90; the lowest low after is 102.45, so nothing closes back inside. */
const L266_HOLD = k([
  ...L266_RANGE,
  [101.9, 102.6, 101.85, 102.55], [102.55, 102.95, 102.45, 102.9], [102.9, 103.05, 102.6, 102.7], [102.7, 103.2, 102.65, 103.1], [103.1, 103.45, 103.0, 103.4],
]);
const L266_LEVEL: ChartLayer = { kind: "level", price: 102.0, role: "resistance", label: "RANGE HIGH 102.00" };

// ─── 2.6.7 data ─────────────────────────────────────────────────────────────

/**
 * 42 bars: 12 quiet bars, a 24-bar rally (bars 13–36, 20 of them bull trend bars), bar 37 (o 105.52, h 106.74,
 * l 105.49, c 106.72): range 1.25 against ATR(14) 0.40 on bar 36, about 3.1×; EMA 20 103.63, 3.09 below the close.
 * Bars 38–42 close 106.54, 106.58, 106.36, 106.44, 106.19: none above 106.72.
 */
const L267_MOVE = k([
  [100.0, 100.25, 99.85, 100.15], [100.15, 100.29, 99.84, 99.95], [99.95, 100.25, 99.8, 100.05], [100.05, 100.21, 99.84, 100.0], [100.0, 100.36, 99.87, 100.2],
  [100.2, 100.33, 99.76, 99.95], [99.95, 100.12, 99.8, 100.0], [100.0, 100.32, 99.8, 100.15], [100.15, 100.3, 99.94, 100.05], [100.05, 100.23, 99.86, 100.1],
  [100.1, 100.27, 99.78, 99.95], [99.95, 100.21, 99.82, 100.05], [100.05, 100.39, 99.98, 100.35], [100.35, 100.66, 100.31, 100.63], [100.63, 100.71, 100.43, 100.51],
  [100.51, 100.87, 100.46, 100.84], [100.84, 101.21, 100.78, 101.14], [101.14, 101.39, 101.08, 101.36], [101.36, 101.46, 101.15, 101.21], [101.21, 101.58, 101.18, 101.51],
  [101.51, 101.89, 101.44, 101.83], [101.83, 102.17, 101.79, 102.1], [102.1, 102.44, 102.03, 102.4], [102.4, 102.5, 102.22, 102.3], [102.3, 102.71, 102.23, 102.64],
  [102.64, 102.99, 102.6, 102.94], [102.94, 103.25, 102.91, 103.2], [103.2, 103.58, 103.13, 103.51], [103.51, 103.58, 103.31, 103.39], [103.39, 103.75, 103.33, 103.72],
  [103.72, 104.09, 103.66, 104.02], [104.02, 104.4, 103.96, 104.34], [104.34, 104.69, 104.29, 104.63], [104.63, 104.96, 104.55, 104.89], [104.89, 105.27, 104.82, 105.22],
  [105.22, 105.57, 105.18, 105.52], [105.52, 106.74, 105.49, 106.72], [106.72, 106.82, 106.32, 106.54], [106.54, 106.8, 106.39, 106.58], [106.58, 106.82, 106.26, 106.36],
  [106.36, 106.64, 106.18, 106.44], [106.44, 106.59, 106.07, 106.19],
]);
/** EMA 20 of the closes, from bar 20. */
const L267_EMA_VALUES: (number | null)[] = [
  null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 100.41,
  100.54, 100.69, 100.85, 100.99, 101.15, 101.32, 101.5, 101.69, 101.85, 102.03, 102.22, 102.42, 102.63, 102.85, 103.07, 103.31, 103.63, 103.91, 104.16, 104.37,
  104.57, 104.72,
];
const L267_EMA: ChartLayer = { kind: "line", role: "concept", label: "EMA 20", values: L267_EMA_VALUES };
/** The same line up to bar 37, for the charts that stop at the big bar. */
const L267_EMA_37: ChartLayer = { kind: "line", role: "concept", label: "EMA 20", values: L267_EMA_VALUES.slice(0, 37) };

// ─── 2.6.8 data ─────────────────────────────────────────────────────────────

/** B5: 14 one-hour bars. Swing lows 100.60 (bar 4) and 101.40 (bar 11); swing high 102.05 (bar 8); bar 14 low 101.75. */
const L268_HOURLY = k([
  [100.8, 101.0, 100.7, 100.95], [100.95, 101.2, 100.85, 101.1], [101.1, 101.15, 100.75, 100.8], [100.8, 100.85, 100.6, 100.75], [100.75, 101.1, 100.7, 101.05],
  [101.05, 101.45, 101.0, 101.4], [101.4, 101.8, 101.35, 101.75], [101.75, 102.05, 101.7, 101.95], [101.95, 102.0, 101.65, 101.7], [101.7, 101.75, 101.45, 101.5],
  [101.5, 101.6, 101.4, 101.55], [101.55, 101.85, 101.5, 101.8], [101.8, 101.95, 101.62, 101.9], [101.9, 102.0, 101.75, 101.85],
]);

const L268_JOURNAL: TaskData = {
  options: [
    { id: "followed", label: "Followed the rule" },
    { id: "shopping", label: "Timeframe shopping" },
    { id: "change", label: "Proper rule change" },
  ],
  cards: [
    {
      id: "j1",
      text: "Lost on a 1H long. Ten minutes later I switched to the 15m, found a buy signal there and went long again.",
      answer: "shopping",
      correct: "A switch right after a loss, to a chart that offers a fresh entry: timeframe shopping.",
      rationales: {
        followed: "The rule didn't change; the chart did, ten minutes after a loss. That's the shopping pattern.",
        change: "Rule changes happen in a review, in writing, not ten minutes after a loss.",
      },
    },
    {
      id: "j2",
      text: "Wrote the 4H bias, up, at 09:00. Took a 1H pullback long, timed on the 15m, stop under the 1H swing low.",
      answer: "followed",
      correct: "Direction from the 4H, setup and stop from the 1H, timing from the 15m: the hierarchy as written.",
      rationales: {
        shopping: "Every timeframe did the job the rule gave it, and the bias was written first. Nothing was shopped.",
        change: "Nothing changed: the trader applied the rule already written.",
      },
    },
    {
      id: "j3",
      text: "The 4H was falling. The 1H looked bullish, so I opened the daily: rising. I went long on the daily's word.",
      answer: "shopping",
      correct: "The trader looked for a chart that agreed with the long they wanted. That's timeframe shopping.",
      rationales: {
        followed: "The rule ranks the 4H first, and it was falling. Opening the daily to overrule it breaks the rule.",
        change: "A new hierarchy chosen mid-trade, to justify one entry, isn't a rule change. It's shopping.",
      },
    },
    {
      id: "j4",
      text: "The 4H was in a range: no direction. I skipped a 1H buy setup, as my rule says.",
      answer: "followed",
      correct: "No direction on the higher timeframe, so no trade in its direction. Skipping is following the rule.",
      rationales: {
        shopping: "No timeframe was switched to find agreement. The trader stood aside, as written.",
        change: "The rule was applied, not changed.",
      },
    },
    {
      id: "j5",
      text: "Weekend review of 40 journaled trades. I wrote a new rule for next week: 1D, 4H, 1H.",
      answer: "change",
      correct: "Changed in a review, on a sample of trades, in writing, before the next session: a proper rule change.",
      rationales: {
        followed: "Here the rule itself changed. What makes it proper is when and how: in a review, written down.",
        shopping: "Shopping happens trade by trade, to justify an entry. This change came from a review of 40 trades.",
      },
    },
    {
      id: "j6",
      text: "Long with the 4H. A sharp 15m drop scared me, so I closed and went short on the 15m.",
      answer: "shopping",
      correct: "The 15m overruled the 4H bias mid-trade. The lower timeframe only times entries; it can't flip the direction.",
      rationales: {
        followed: "The rule gives the 15m timing only. Letting it flip the direction breaks the hierarchy.",
        change: "A rule change made in fear, mid-trade, is shopping for a chart that matches the feeling.",
      },
    },
  ],
};

// ─── Lessons ────────────────────────────────────────────────────────────────

const L261: Lesson = {
  id: "2.6.1",
  title: "Trend bars and doji bars",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Classify each bar by its body and close, then read runs of trend bars and the overlap between bars as signs of a trend or a range.",
  objectives: [
    "Classify bars as trend bars or doji bars from body size and where the bar closed.",
    "Read runs of trend bars and the overlap between bars as signs of a trend or a range.",
    "Explain why the same bar means something different in a trend and in a range.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
  ],
  script: {
    unit: "2.6",
    courseId: "2.6.1",
    hook: {
      prompt: "Six bars in a row overlap heavily and have small bodies. Trend or range?",
      figure: { kind: "chart", chart: { candles: L261_HOOK }, steps: [{ text: "Six bars, each mostly inside the one before. The bodies are small next to the ranges." }] },
      control: {
        kind: "choice",
        choices: [
          { id: "trend", label: "Trend", feedback: "A trend leaves bars behind: each bar shares little with the one before. These share most of their range." },
          { id: "range", label: "Range", feedback: "That's the reading: heavy overlap and small bodies show buyers and sellers roughly in balance." },
          { id: "unclear", label: "Can't tell", feedback: "Overlap and body size can be measured, and here both point the same way: a range." },
        ],
        answer: "range",
      },
      compare: "You picked {yours}. Those six bars overlapped by 88% on average, with small bodies: two-sided trading, a range reading.",
      concept: "bar-reading",
    },
    learn: [
      {
        kind: "explain",
        text: "Price action reads each bar for who won it. A [[trend-bar]] has a body of at least half its range and closes in the third nearest its extreme. A [[doji-bar]] has a body of a quarter of its range or less: neither side won. [[bar-overlap|Overlap]] is how much of a bar's range the bar before also covered.",
        figure: {
          kind: "chart",
          chart: { candles: L261_DEF, visible: 1 },
          steps: [
            { text: "A bull trend bar: body 1.00 of a 1.10 range, closing 0.05 under the high.", layers: [{ kind: "bracket", from: 100.0, to: 101.0, index: 0, label: "BODY 1.00" }] },
            { text: "A doji bar: body 0.10 of a 0.80 range. Neither side won the hour.", visible: 2, layers: [{ kind: "bracket", from: 100.9, to: 101.0, index: 1, label: "BODY 0.10" }] },
            { text: "They share 100.45 to 101.05: 0.60, which is 75% of the smaller range, 0.80.", layers: [{ kind: "zone", from: 100.45, to: 101.05, role: "concept", label: "OVERLAP 0.60" }] },
          ],
        },
      },
      {
        kind: "callout",
        tone: "info",
        text: "A **doji bar** is broader than the candle doji of unit 2.1, whose body is nearly flat, about a tenth of a typical range. Here any body of a quarter of the range or less counts. These thresholds are the app's conventions, after Al Brooks: measurable, not laws.",
      },
      {
        kind: "worked",
        title: "Measuring overlap",
        lines: [
          "Bar A: high 100.80, low 100.20. Range 0.60.",
          "Bar B: high 101.00, low 100.50. Range 0.50.",
          "Shared part: the lower high minus the higher low, 100.80 − 100.50 = 0.30.",
          "Divide by the smaller range: 0.30 ÷ 0.50.",
          "Overlap, in % = ?",
        ],
        ask: {
          answer: 60,
          tolerance: 0.5,
          unit: "%",
          feedback: [
            { value: 50, text: "That divides by the larger range, 0.60. The rule uses the smaller bar: 0.30 ÷ 0.50." },
            { value: 0.6, text: "Right ratio; give it in percent: 0.6 is 60%." },
          ],
          correct: "Right: 60%. Bar B spent most of its hour inside bar A's range.",
        },
        after: "60%. Two bars that don't touch at all overlap 0%; a bar fully inside the other overlaps 100%.",
        concept: "bar-reading",
      },
      {
        kind: "predict",
        title: "Overlap in a trend",
        prompt: "Eleven bars of an uptrend. Estimate the average overlap of the last ten, each with the bar before it.",
        control: {
          kind: "slider",
          min: 0,
          max: 100,
          step: 5,
          unit: "%",
          start: 50,
          answer: 20,
          tolerance: 10,
          feedback: [
            { from: 0, to: 5, text: "Lower than it is. The doji bar in the middle shares 47% with each neighbour." },
            { from: 10, to: 30, text: "Close: the average is 19.8%." },
            { from: 35, to: 100, text: "Higher than it is. Each bar opens near the last close and pushes on, so most pairs share under 20%." },
          ],
        },
        figure: {
          kind: "chart",
          chart: { candles: L261_TREND },
          steps: [
            { text: "Eight of the ten pairs share under 20%: each bar opens near the last close and pushes on." },
            { text: "The doji bar shares 47% with each neighbour. The average of all ten: 19.8%.", layers: [mark(5, "high", "DOJI")] },
          ],
        },
        reveal: "19.8%, under 30%: a trend reading. The six bars from the start averaged 88%, over 50%: a range reading. Between 30% and 50%, overlap alone doesn't decide. Two runs of five bull trend bars add to the trend reading: three or more in a row show urgency.",
        concept: "bar-reading",
      },
      {
        kind: "match",
        prompt: "Match each 10-bar stretch to its reading.",
        columns: ["Stretch", "Reading"],
        pairs: [
          { left: "Five bull trend bars in a row; average overlap 12%", right: "Strong trend", wrong: "A run of trend bars with little overlap is the strongest reading. Weak trends mix in doji bars and more overlap." },
          { left: "Higher highs, but bull, bear and doji bars mix; overlap 42%", right: "Weak trend", wrong: "There's a direction, higher highs, but mixed bars and 42% overlap make it a weak one." },
          { left: "Small bodies, overlap 66%, the same highs and lows again and again", right: "Range", wrong: "High overlap and repeated highs and lows are two-sided trading: a range." },
          { left: "Twelve overlapping bars, then two bull trend bars closing above all their highs", right: "Breakout", wrong: "The overlap belongs to the range before. What's new is two trend bars closing beyond it: a breakout attempt." },
        ],
        correct: "Runs of trend bars and overlap tell them apart. A breakout still needs follow-through to last.",
        concept: "bar-reading",
      },
      {
        kind: "reveal",
        title: "Same bar, different place",
        prompt: "LABX has ranged between 99.50 and 100.50 for 12 bars. Bar 13 is a big bull trend bar closing at 100.55. On its own, what does it tell you?",
        chart: { candles: L261_RANGE, visible: 13, layers: [{ kind: "zone", from: 99.5, to: 100.5, role: "neutral", label: "RANGE" }] },
        choices: [
          { id: "trend", label: "A new uptrend has started", feedback: "One bar can't make a trend. Near the top of a range it meets sellers who have sold there for 12 bars." },
          { id: "wait", label: "Little on its own: the next bars decide", feedback: "Right. In a range, only follow-through turns a big bar into a breakout." },
          { id: "fade", label: "It will fail, so sell it", feedback: "That's a forecast from one bar too. Brooks expects most such bars to fail, but that's his estimate, not a measured rate." },
        ],
        answer: "wait",
        after: "The next four bars overlapped it and closed at 100.30, 100.05, 99.90 and 100.05, back inside. In a trend, the same bar would extend a run of trend bars. In a range, it often marks buyers arriving late, at the top.",
        concept: "bar-reading",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "The measurements are mechanical: anyone gets the same numbers. Reading them as urgency or balance is Al Brooks' heuristic, with no published statistics: [[evidence-grade]] D. By his own account, most bars leave traders unsure, and most setups work 40–60% of the time.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: L261_CARDS,
      goal: "Eight bars. Classify each one by the app's rules: bull trend bar, bear trend bar, doji bar or neither.",
      success: { field: "solved", eq: 8 },
      correct: "All eight classified. Two numbers decide it: the body as a share of the range, then where the close sits.",
      hints: [
        "Work out body ÷ range first: a quarter or less is a doji bar; half or more may be a trend bar.",
        "For a big body, check the close: top third for bull, bottom third for bear. Otherwise it's neither.",
      ],
      showMe: { solved: 8 },
      concept: "bar-reading",
    },
    check: ["q-2.6.1-1", "q-2.6.1-2", "q-2.6.1-3"],
    recap: {
      takeaways: [
        "Trend bar: body at least half the range, close near the extreme. Doji bar: body a quarter or less.",
        "Average overlap under 30% suggests a trend, over 50% a range. Runs of trend bars show urgency.",
        "In a trend, a big trend bar adds to a run; inside a range it needs follow-through to mean much.",
      ],
    },
  },
};

const L262: Lesson = {
  id: "2.6.2",
  title: "Signal bars, entry bars and the trader's equation",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Grade a signal bar, enter one tick beyond it with a stop entry, and check the trade with the trader's equation before you take it.",
  objectives: [
    "Rate a bull reversal signal bar with a five-point checklist.",
    "Place a stop entry one tick above a signal bar and the protective stop one tick below it.",
    "Check a setup with the trader's equation: chance of winning times reward against chance of losing times risk, after costs.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "reversal", label: "Arena: reversal" },
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
  ],
  script: {
    unit: "2.6",
    courseId: "2.6.2",
    hook: {
      prompt: "A setup wins 40% of the time. What is the smallest reward-to-risk that breaks even, before costs?",
      control: {
        kind: "numeric",
        unit: ": 1",
        answer: 1.5,
        tolerance: 0.05,
        feedback: [
          { value: 0.67, text: "That's 0.40 ÷ 0.60, upside down. The wins must pay for the losses: 0.60 ÷ 0.40." },
          { value: 2.5, text: "That's 1 ÷ 0.40. Break-even needs 0.40 × reward = 0.60 × 1." },
          { value: 1, text: "At 1:1, 40 wins of 1R can't pay for 60 losses of 1R." },
        ],
      },
      compare: "You said {yours}. Break-even: 0.40 × reward = 0.60 × 1R, so the reward must be 1.5R. Below that, a 40% setup loses money even before costs.",
      concept: "traders-equation",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[signal-bar]] is the bar that sets up your trade. For a long, you place a buy [[stop-order|stop]] one tick, 0.01, above its high, and a protective stop one tick below its low. The bar in which the buy stop fills is the [[entry-bar]]. If price never trades above the signal bar, you never enter.",
      },
      {
        kind: "figure",
        title: "From signal bar to entry bar",
        figure: {
          kind: "chart",
          chart: { candles: L262_SIGNAL, visible: 10 },
          steps: [
            { text: "Signal bar: a bull bar at the prior low, high 100.80, low 100.20.", layers: [mark(2, "low", "PRIOR LOW 100.25"), mark(9, "low", "SIGNAL BAR")] },
            {
              text: "Buy stop at 100.81 and protective stop at 100.19: one tick beyond each end.",
              layers: [
                { kind: "level", price: 100.81, role: "entry", label: "BUY STOP 100.81" },
                { kind: "level", price: 100.19, role: "stop", label: "STOP 100.19" },
              ],
            },
            { text: "Bar 11 trades through 100.81 and the order fills: that's the entry bar.", visible: 11, layers: [{ kind: "marker", index: 10, price: 100.81, label: "ENTRY BAR", role: "accent" }] },
            { text: "It closes at 101.05, near its high: the first information about the trade.", layers: [mark(10, "close", "CLOSE 101.05", "up")] },
          ],
        },
        text: "The gap between the two orders is your risk: 100.81 − 100.19 = 0.62 a unit, before slippage and costs.",
        concept: "signal-and-entry-bars",
      },
      {
        kind: "worked",
        title: "Grade a signal bar",
        lines: [
          "Five tests for a bull reversal signal bar, 1 point each.",
          "The bar: open 100.30, high 100.90, low 100.20, close 100.60. Range 0.70. ATR(14): 0.50.",
          "1. Bull body closing in the top third? The top third starts at 100.67.",
          "2. Lower wick at least 25% of the range? It's 0.10: 14%.",
          "3. Upper wick at most 15% of the range? It's 0.30: 43%.",
          "4. Range between 0.5 and 2 × ATR? 0.70 is 1.4 × ATR.",
          "5. At a location? It formed at the prior low, a support zone.",
          "Score, out of 5 = ?",
        ],
        ask: {
          answer: 2,
          tolerance: 0,
          feedback: [
            { value: 3, text: "Check test 1 again: the close, 100.60, is under 100.67, so it's not in the top third." },
            { value: 4, text: "Tests 1, 2 and 3 all fail: a mid-range close, a short lower wick, a long upper wick." },
            { value: 5, text: "Count only the tests it passes. A close at 100.60 under a wick to 100.90 fails three of them." },
          ],
          correct: "Right: 2 of 5, tests 4 and 5.",
        },
        after: "2 of 5: the right place, a weak bar. Sellers pushed it back from 100.90 and nothing shows buyers rejecting the low. The chart's signal bar passed tests 1–3: close 100.72 in its top third, a 0.16 tail below (27%), a 0.08 wick on top (13%).",
        concept: "signal-and-entry-bars",
      },
      {
        kind: "figure",
        text: "The [[traders-equation|trader's equation]] checks a setup before you take it: chance of winning × reward must beat chance of losing × risk, after costs. It's the same arithmetic as [[expectancy]].",
        figure: {
          kind: "formula",
          boxes: [{ text: "0.40 × 2R" }, { text: "0.60 × 1R" }, { text: "0.05R costs" }, { text: "edge", answer: 0.15, tolerance: 0.001, unit: "R" }],
          operators: ["−", "−", "="],
          steps: ["Wins: 40% of trades at +2R gives 0.80R.", "Losses: 60% at −1R gives 0.60R.", "Costs, spread and commission: about 0.05R a trade.", "What's left per trade? Type it, in R."],
        },
        concept: "traders-equation",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Brooks pairs probability with reward-to-risk: setups he rates near 60% need at least 1:1, and most reversals, near 40%, need at least 1:2. The probabilities are his subjective estimates. No published statistics show that higher-scoring signal bars win more often: [[evidence-grade]] D.",
      },
      {
        kind: "predict",
        prompt: "You rate a reversal at 40%. The stop is 0.62 below the entry and the target 0.62 above: 1:1. Take it?",
        control: {
          kind: "choice",
          choices: [
            { id: "bar", label: "Yes: the signal bar scored 5 of 5", feedback: "A good bar doesn't fix the arithmetic: 0.40 × 1 − 0.60 × 1 = −0.20R a trade." },
            { id: "no", label: "No: at 40%, 1:1 loses 0.20R a trade before costs", feedback: "Right." },
            { id: "size", label: "Yes, with a bigger size to make it worth it", feedback: "Size scales the loss too: −0.20R a trade stays −0.20R, in bigger money." },
          ],
          answer: "no",
        },
        reveal: "0.40 × 1R − 0.60 × 1R = −0.20R a trade, before costs. At 40%, the target must sit at least 1.5R away to break even, and further to pay for costs. Move the target to where structure allows it, or skip the trade.",
        concept: "traders-equation",
      },
    ],
    task: {
      widget: "bracket-builder",
      data: { chart: { candles: L262_SIGNAL.slice(0, 10), layers: [mark(9, "low", "SIGNAL BAR LOW 100.20")] }, entry: 100.81, units: 100 },
      goal: "Your buy stop at 100.81 is the entry. Drag the protective stop one tick below the signal bar's low, and the target to 2R.",
      start: { stop: 99.9, target: 101.5, units: 100 },
      locked: ["units"],
      success: { all: [{ field: "stop", eq: 100.19 }, { field: "target", eq: 102.05 }] },
      feedback: [
        { when: { field: "stop", eq: 100.2 }, text: "That's the bar's low itself. One tick below, 100.19, so a touch of the low doesn't stop you out." },
        { when: { field: "stop", gt: 100.2 }, text: "At {stop:2} the stop sits inside the signal bar. The idea is wrong only if price falls below its low, 100.20." },
        { when: { field: "stop", lt: 100.19 }, text: "At {stop:2} you risk {stopDistance:2} a unit. The idea fails below the signal bar's low, 100.20: one tick under is 100.19." },
        { when: { field: "target", ne: 102.05 }, text: "Stop right: 0.62 of risk. 2R is 2 × 0.62 = 1.24 above 100.81. You're at {rr:2}R." },
      ],
      correct: "Risk 0.62 a unit, target 1.24 away: 2R. At 40%, that's +0.20R a trade before costs. A stop entry fills only if price trades through it, and in a fast market above 100.81.",
      hints: ["One tick is 0.01, and the signal bar's low is 100.20.", "Risk = 100.81 − 100.19 = 0.62. The target sits twice that above the entry.", "Stop 100.19; target 100.81 + 1.24 = 102.05."],
      showMe: { stop: 100.19, target: 102.05 },
      concept: "signal-and-entry-bars",
    },
    check: ["q-2.6.2-1", "q-2.6.2-2", "q-2.6.2-3"],
    recap: {
      takeaways: [
        "Grade a bull signal bar on five tests: close, lower tail, upper wick, size and location.",
        "Buy stop one tick above the signal bar, protective stop one tick below: the gap is your risk.",
        "Trader's equation: win chance × reward − loss chance × risk − costs must stay above zero.",
      ],
    },
  },
};

const L263: Lesson = {
  id: "2.6.3",
  title: "Inside, outside and narrow-range bars",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Spot inside, outside and NR7 bars from highs and lows, bracket a quiet bar with OCO stop entries sized from the stop, and recognise a hikkake.",
  objectives: [
    "Identify inside bars, ii and iii sequences, outside bars and NR7 bars from highs and lows.",
    "Set up a one-cancels-the-other pair of stop entries around an inside bar, and size it so the stop-out loss stays within budget.",
    "Explain a hikkake: an inside bar, a false breakout, then a move through the other side.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "low_volatility", label: "Arena: low volatility" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "2.6",
    courseId: "2.6.3",
    hook: {
      prompt: "Two inside bars in a row: the range has shrunk to half the ATR. Is the next move more likely to be bigger or smaller than usual?",
      control: {
        kind: "choice",
        choices: [
          { id: "bigger", label: "A bigger move", feedback: "That's the usual pattern for size: quiet spells tend to be followed by wider ranges. Direction is another matter." },
          { id: "smaller", label: "A smaller move", feedback: "Quiet bars don't predict more quiet. Volatility tends to drift back to its average, so ranges usually widen again." },
          { id: "unknown", label: "No idea", feedback: "For direction, that's honest. For size there is a pattern: ranges tend to widen again after a squeeze." },
        ],
        answer: "bigger",
      },
      compare: "You picked {yours}. Contraction tends to be followed by expansion in size, because volatility reverts to its average. The direction stays unknown.",
      concept: "inside-outside-bars",
    },
    learn: [
      {
        kind: "explain",
        text: "An [[inside-bar]] has its high at or below the previous high and its low at or above the previous low. Two in a row make **ii**, three make **iii**. An [[outside-bar]] goes beyond both ends of the previous bar. An [[nr7|NR7]] bar has the narrowest range of the last seven bars.",
        figure: {
          kind: "chart",
          chart: { candles: L263_DEF, visible: 2 },
          steps: [
            { text: "Bar 2 stays inside bar 1: high 100.80 under 100.90, low 100.20 above 99.90.", layers: [{ kind: "zone", from: 99.9, to: 100.9, role: "neutral", label: "BAR 1 RANGE" }] },
            { text: "Bar 3 goes beyond bar 2 at both ends, 101.00 and 100.10: an outside bar.", visible: 3, layers: [mark(2, "high", "101.00"), mark(2, "low", "100.10")] },
          ],
        },
      },
      {
        kind: "hotspot",
        title: "Find the outside bar",
        prompt: "Tap the outside bar.",
        chart: { candles: L263_TAP },
        zones: [
          { id: "b4", label: "Bar 4", index: 3, feedback: "Bar 4 is an inside bar: its high, 101.00, and low, 100.55, stay within bar 3's 101.10 and 100.50." },
          { id: "b5", label: "Bar 5", index: 4 },
          { id: "b8", label: "Bar 8", index: 7, feedback: "Bar 8's low, 101.00, is under bar 7's, but its high, 101.55, isn't above bar 7's 101.70. An outside bar needs both." },
          { id: "b11", label: "Bar 11", index: 10, feedback: "Bar 11 is the narrow one, a range of 0.30. An outside bar reaches beyond the bar before at both ends." },
        ],
        answer: "b5",
        correct: "Bar 5: high 101.30 above bar 4's 101.00, low 100.40 below its 100.55. It covers bar 4's whole range and more.",
        concept: "inside-outside-bars",
      },
      {
        kind: "hotspot",
        title: "Find the NR7",
        prompt: "Now tap the NR7 bar: the narrowest range of the last seven bars.",
        chart: { candles: L263_TAP },
        zones: [
          { id: "b4", label: "Bar 4", index: 3, feedback: "Bar 4's range, 0.45, is narrow, but there aren't six bars before it to compare with." },
          { id: "b9", label: "Bar 9", index: 8, feedback: "Bar 9's range is 0.48, but bar 4's 0.45 is within its last seven, so bar 9 isn't the narrowest." },
          { id: "b10", label: "Bar 10", index: 9, feedback: "Bar 10's range is 0.50, the same as bars 6 and 7. NR7 has to be narrower than all six before it." },
          { id: "b11", label: "Bar 11", index: 10 },
        ],
        answer: "b11",
        correct: "Bar 11: a range of 0.30, under each of the six before it (0.90, 0.50, 0.50, 0.55, 0.48, 0.50). It isn't an inside bar: its high, 101.60, tops bar 10's.",
        concept: "inside-outside-bars",
      },
      {
        kind: "figure",
        title: "Bracketing the ii",
        figure: {
          kind: "chart",
          chart: { candles: L263_II },
          steps: [
            { text: "ii: bar 5 sits inside bar 4, and bar 6 inside bar 5.", layers: [{ kind: "zone", from: 100.1, to: 100.7, role: "neutral", label: "BAR 6 RANGE" }] },
            {
              text: "Buy stop one tick above bar 6, 100.71. Sell stop one tick below, 100.09.",
              layers: [
                { kind: "level", price: 100.71, role: "entry", label: "BUY STOP · SHORT'S STOP 100.71" },
                { kind: "level", price: 100.09, role: "entry", label: "SELL STOP · LONG'S STOP 100.09" },
              ],
            },
            { text: "Each leg's stop is the other entry: 0.62 of risk either way." },
          ],
        },
        text: "That's an [[oco-order|OCO]] pair: whichever side breaks first fills, and the other entry is cancelled. Size it from the larger of the two distances; here both are 0.62.",
        concept: "oco-order",
      },
      {
        kind: "reveal",
        title: "A break that fails",
        prompt: "Bar 5 is an inside bar: high 100.85, low 100.35. Bar 6 broke below it and closed at 100.20. Reveal the next three bars.",
        chart: { candles: L263_HIKKAKE, visible: 6, layers: [{ kind: "zone", from: 100.35, to: 100.85, role: "neutral", label: "INSIDE BAR" }] },
        choices: [
          { id: "falls", label: "The fall continues" },
          { id: "back", label: "Price closes back above 100.85" },
        ],
        after: "Bar 8 closed at 100.95, above the inside bar's high: a [[hikkake]]. The break below trapped sellers: a short from 100.34 with its stop at 100.86 was stopped out on bar 8, which reached 101.00. Hikkake traders buy that second break. The setup has no published statistics.",
        concept: "inside-outside-bars",
      },
      {
        kind: "match",
        title: "Inside bar or harami?",
        prompt: "An inside bar compares ranges; a harami (unit 2.1) compares bodies. Sort each pair of bars.",
        pairs: [
          { left: "Bar 2's high and low are inside bar 1's, and its body is inside bar 1's body", right: "Both", wrong: "Range inside range and body inside body: it's both at once." },
          { left: "Bar 2's body is inside bar 1's body, but its upper wick pokes above bar 1's high", right: "Harami only", wrong: "The bodies nest, so it's a harami. The wick above bar 1's high stops it being an inside bar." },
          { left: "Bar 2's range is inside bar 1's, but bar 1 is a doji and bar 2's body is larger than its body", right: "Inside bar only", wrong: "The range nests, so it's an inside bar. A body bigger than bar 1's tiny body can't be a harami." },
          { left: "Bar 2's high is above bar 1's high and its low is below bar 1's low", right: "Neither", wrong: "That's an outside bar: bigger at both ends. Neither inside bar nor harami." },
        ],
        correct: "Inside bars compare ranges, harami compares bodies. They often coincide, but not always.",
        concept: "inside-outside-bars",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "The definitions are mechanical. The setups built on them, OCO breakouts and hikkakes, are heuristics with no published statistics. What has support is size, not direction: quiet stretches tend to be followed by wider ranges, because [[volatility]] reverts toward its average.",
      },
    ],
    task: {
      widget: "position-size",
      goal: "OCO on the ii: buy stop 100.71, sell stop 100.09, each stopped at the other. Size it so a stop-out loses at most 100.00 (0.5% of 20,000.00), costs included.",
      start: { account: 20000, riskPct: 0.5, entry: 100.71, stop: 100.09, units: 161 },
      locked: ["account", "riskPct", "entry", "stop"],
      hidden: ["simpleQty", "qty"],
      success: { all: [{ field: "units", eq: 138 }, { field: "entry", eq: 100.71 }, { field: "stop", eq: 100.09 }] },
      feedback: [
        { when: { field: "units", eq: 161 }, text: "161 is the textbook size, 100.00 ÷ 0.62, before costs. The two commissions add about 0.10 a unit: 115.99 at the stop." },
        { when: { field: "units", eq: 139 }, text: "139 units lose 100.14 with both commissions, just over 100.00." },
        { when: { field: "units", gt: 139 }, text: "{units} units would lose {lossAtStop:2} at the stop, over 100.00." },
        { when: { field: "units", lt: 138 }, text: "{units} units fit, losing {lossAtStop:2}. One more unit would still fit: find the most that does." },
      ],
      correct: "138 units lose 99.42 at the stop: 0.62 a unit plus about 0.10 of commission. The short leg has the same distance, so the same size fits it. Stop entries can slip, so the real loss can be larger.",
      hints: [
        "The cost per unit at the stop is 0.62 plus 0.05% of 100.71 and 0.05% of 100.09.",
        "0.62 + 0.0005 × (100.71 + 100.09) = 0.7204 a unit. Divide 100.00 by it.",
        "100.00 ÷ 0.7204 = 138.8. Round down.",
      ],
      showMe: { units: 138 },
      concept: "inside-outside-bars",
    },
    check: ["q-2.6.3-1", "q-2.6.3-2", "q-2.6.3-3"],
    recap: {
      takeaways: [
        "Inside bar: range within the last bar's. Outside bar: beyond both ends. NR7: narrowest of seven.",
        "Bracket an inside bar with OCO stop entries, each stopped at the other side; size from the larger distance.",
        "Hikkake: an inside bar, a false break one way, then a close beyond the other side.",
      ],
    },
  },
};

const L264: Lesson = {
  id: "2.6.4",
  title: "Two-legged pullbacks and bar counting",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Count H1 and H2 bars in a pullback, enter the second attempt with a stop entry, and know why the count means little outside a trend.",
  objectives: [
    "Count H1 and H2 bars (L1 and L2 in a bear trend) in a pullback.",
    "Identify a two-legged pullback, and place an H2 stop entry with its protective stop.",
    "Explain why the second entry can trap counter-trend traders, and why bar counts mean little in a range.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
  ],
  script: {
    unit: "2.6",
    courseId: "2.6.4",
    hook: {
      prompt: "During this pullback in an uptrend, tap the first bar whose high goes above the previous bar's high.",
      control: {
        kind: "tap",
        chart: { candles: L264_PULLBACK, layers: [mark(6, "high", "HIGH 105.00")] },
        zones: [
          { id: "b8", label: "Bar 8", index: 7, feedback: "Bar 8's high, 104.60, is under bar 7's 105.00." },
          { id: "b9", label: "Bar 9", index: 8, feedback: "Bar 9's high, 104.30, is under bar 8's 104.60." },
          { id: "b10", label: "Bar 10", index: 9 },
          { id: "b11", label: "Bar 11", index: 10, feedback: "Bar 11's high, 104.20, is under bar 10's 104.50. Look one bar earlier." },
          { id: "b12", label: "Bar 12", index: 11, feedback: "Bar 12's high, 104.00, is under bar 11's." },
          { id: "b13", label: "Bar 13", index: 12, feedback: "Bar 13 does beat the bar before, but it isn't the first to do so." },
        ],
        answer: "b10",
      },
      compare: "You tapped {yours}. Bar 10's high, 104.50, was the first above the bar before, 104.30: H1, the first attempt to resume the uptrend.",
      concept: "bar-counting",
    },
    learn: [
      {
        kind: "explain",
        text: "Count bars, not swings. In a bull [[pullback]], **H1** is the first bar whose high beats the previous bar's high: the first attempt to resume the trend. If the pullback then makes a lower low, the next such bar is **H2**. Bear trends mirror [[high-1-high-2|H1 and H2]] as L1 and L2. A new trend extreme resets the count.",
      },
      {
        kind: "figure",
        title: "Two legs, two attempts",
        figure: {
          kind: "chart",
          chart: { candles: L264_PULLBACK },
          steps: [
            { text: "Leg A: from the 105.00 high down to 103.90 in two bars.", layers: [{ kind: "path", role: "down", label: "LEG A", points: [{ index: 6, price: 105.0 }, { index: 8, price: 103.9 }] }] },
            { text: "Bar 10's high, 104.50, beats bar 9's 104.30: H1. The bounce stalls.", layers: [mark(9, "high", "H1")] },
            {
              text: "Leg C: bars 11 and 12 fall to a lower pullback low, 103.70.",
              layers: [{ kind: "path", role: "down", label: "LEG C", points: [{ index: 9, price: 104.5 }, { index: 11, price: 103.7 }] }, mark(11, "low", "103.70")],
            },
            { text: "Bar 13's high, 104.35, beats bar 12's 104.00: H2, the second entry.", layers: [mark(12, "high", "H2", "up")] },
          ],
        },
        text: "That's a [[two-legged-pullback]]: leg A down, a small bounce, then leg C to a lower low.",
        concept: "two-legged-pullback",
      },
      {
        kind: "hotspot",
        title: "The mirror: L1 and L2",
        prompt: "A bear trend made its low at 96.80, then rallied in two legs. Tap L2.",
        chart: { candles: L264_BEAR, layers: [mark(4, "low", "LOW 96.80")] },
        zones: [
          { id: "a8", label: "Bar 8", index: 7, feedback: "Bar 8 is L1: its low, 97.20, was the first under the bar before. L2 comes after the rally's next leg up." },
          { id: "a9", label: "Bar 9", index: 8, feedback: "Bar 9's low, 97.30, stayed above bar 8's 97.20. It's the second leg up, not a count." },
          { id: "a10", label: "Bar 10", index: 9, feedback: "Bar 10 made the new rally high, 97.95. It's the signal bar; the next bar to dip under its low is L2." },
          { id: "a11", label: "Bar 11", index: 10 },
        ],
        answer: "a11",
        correct: "Bar 11: its low, 97.25, went under bar 10's 97.60, after the rally's second leg. That's L2, the second attempt down.",
        concept: "bar-counting",
      },
      {
        kind: "callout",
        tone: "key",
        text: "In Brooks' reading, the first attempt to resume a trend often fails, so H2 is his preferred entry. In a strong trend, H1 can work. A third or fourth attempt suggests the trend is turning into a range. These are heuristics with no published statistics: [[evidence-grade]] D.",
      },
      {
        kind: "explain",
        title: "Why the second attempt can trap",
        text: "Traders who sold the failed H1 read leg C as a reversal. Their protective stops sit above the pullback's highs. When H2 trades above the signal bar, those buy stops add to the move: a [[second-entry]] can trap them. In a [[range]] there's no trend to resume, so counts happen everywhere and mean little.",
      },
      {
        kind: "predict",
        prompt: "LABX has ranged between 98.00 and 100.00 for two days. An H2 forms at 99.00, mid-range. How much does the count tell you?",
        control: {
          kind: "choice",
          choices: [
            { id: "lot", label: "A lot: H2 is the preferred entry", feedback: "H2 is a trend tool: a second attempt to resume a trend. Mid-range, there's no trend to resume." },
            { id: "little", label: "Little: in a range, counts appear all the time", feedback: "Right." },
            { id: "breakout", label: "It signals a breakout above 100.00", feedback: "A count says nothing about a breakout. Mid-range bars go both ways." },
          ],
          answer: "little",
        },
        reveal: "Counting needs a trend first: higher highs and higher lows. A count is only a bar beating the previous high, and random data produces those too. That's why the trend check comes before the count.",
        concept: "bar-counting",
      },
      {
        kind: "worked",
        title: "The H2 order",
        lines: [
          "Signal bar: bar 12, high 104.00, low 103.70, the pullback's low.",
          "The protective stop goes one tick under the pullback low: 103.69.",
          "The entry is a buy stop one tick above the signal bar's high.",
          "Buy stop = ?",
        ],
        ask: {
          answer: 104.01,
          tolerance: 0,
          feedback: [
            { value: 104.35, text: "That's bar 13's high, the H2 bar itself. The order is placed before it, above the signal bar: 104.00 + 0.01." },
            { value: 104, text: "One tick above the high, so a mere touch of 104.00 doesn't fill you: 104.01." },
          ],
          correct: "Right: 104.01. Bar 13 traded through it, so bar 13 is both the H2 and the entry bar.",
        },
        after: "Buy stop 104.01, stop 103.69: 0.32 of risk a unit. Had bar 13 never traded above 104.00, there would be no trade.",
        concept: "signal-and-entry-bars",
      },
    ],
    task: {
      widget: "bracket-builder",
      data: { chart: { candles: L264_PULLBACK, layers: [mark(9, "high", "H1"), mark(12, "high", "H2"), mark(11, "low", "103.70")] }, entry: 104.01, units: 100 },
      goal: "Entry: the H2 buy stop at 104.01. Drag the stop one tick under the pullback low, and the target to the trend high, 105.00. Then read the reward-to-risk.",
      start: { stop: 103.8, target: 104.5, units: 100 },
      locked: ["units"],
      success: { all: [{ field: "stop", eq: 103.69 }, { field: "target", eq: 105 }] },
      feedback: [
        { when: { field: "stop", eq: 103.7 }, text: "That's the pullback low itself. One tick under it: 103.69." },
        { when: { field: "stop", gt: 103.7 }, text: "At {stop:2} the stop sits above the pullback low, 103.70. The H2 idea fails only if price makes a new pullback low." },
        { when: { field: "stop", lt: 103.69 }, text: "At {stop:2} you risk {stopDistance:2} a unit. The invalidation is the pullback low: one tick under 103.70." },
        { when: { field: "target", ne: 105 }, text: "Stop right. The target is a test of the trend high, 105.00. You're at {target:2}." },
      ],
      correct: "Risk 0.32, reward 0.99: about 3.1R if the high is tested. A test of the prior high is a common first target, not a promise.",
      hints: ["The pullback low is 103.70, on bar 12.", "Stop at 103.69. The trend high is bar 7's, 105.00.", "Stop 103.69, target 105.00."],
      showMe: { stop: 103.69, target: 105 },
      concept: "bar-counting",
    },
    check: ["q-2.6.4-1", "q-2.6.4-2", "q-2.6.4-3"],
    recap: {
      takeaways: [
        "H1: the first bar above the previous high in a bull pullback. H2: the next one, after a lower low.",
        "H2 entry: buy stop one tick above the signal bar; stop one tick under the pullback low.",
        "A second entry can trap counter-trend traders. In a range, counts appear everywhere and mean little.",
      ],
    },
  },
};

const L265: Lesson = {
  id: "2.6.5",
  title: "Channels and wedges, bar by bar",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Grade a trend by its channel, tight, broad or micro, spot three pushes with fading momentum, and count only the channel touches you could have traded.",
  objectives: [
    "Tell tight, broad and micro channels apart by the size of the pullbacks and the bars' lows.",
    "Identify a three-push wedge and a wedge flag.",
    "Explain why a channel line drawn after the fact scores touches you could not have traded.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
  ],
  script: {
    unit: "2.6",
    courseId: "2.6.5",
    hook: {
      prompt: "For 8 bars in a row, no bar's low went below the previous bar's low. Is this uptrend strong or weak?",
      figure: {
        kind: "chart",
        chart: { candles: L265_MICRO.slice(0, 9) },
        steps: [{ text: "From bar 2 to bar 9, every low is at or above the low before it." }],
      },
      control: {
        kind: "choice",
        choices: [
          { id: "strong", label: "Strong", feedback: "That's Brooks' reading: sellers couldn't take out a single prior low." },
          { id: "weak", label: "Weak", feedback: "Weak trends have deep, overlapping pullbacks. Here no bar even dipped under the bar before." },
          { id: "unclear", label: "Can't tell", feedback: "The rule is measurable: eight bars without a lower low is a micro channel, a strong reading." },
        ],
        answer: "strong",
      },
      compare: "You picked {yours}. Eight bars without a lower low is a micro channel: sellers never took out a prior bar's low. Brooks reads that as strong.",
      concept: "price-channels",
    },
    learn: [
      {
        kind: "explain",
        text: "Al Brooks grades channels by their pullbacks. **Tight**: pullbacks of at most 1 ATR and 3 bars. **Broad**: pullbacks give back more than half of the leg before, close to a range. [[micro-channel|Micro]]: five or more bars in a row with no low below the previous low, or no high above it in a bear trend.",
        figure: {
          kind: "chart",
          chart: { candles: L265_MICRO, visible: 9 },
          steps: [
            {
              text: "Bars 2 to 9: no low below the previous bar's low. A micro channel.",
              layers: [{ kind: "path", role: "up", label: "LOWS", points: L265_MICRO.slice(0, 9).map((c, i) => ({ index: i, price: c.l })) }],
            },
            { text: "Bar 10 dips to 101.20, under bar 9's 101.30: the micro channel ends.", visible: 10, layers: [mark(9, "low", "LOWER LOW", "down")] },
          ],
        },
      },
      {
        kind: "match",
        prompt: "Match each description to its channel.",
        columns: ["Description", "Channel"],
        pairs: [
          { left: "Seven bars in a row, each low at or above the one before", right: "Micro channel", wrong: "No lower low bar after bar is the micro channel's signature." },
          { left: "Pullbacks of one or two bars, each smaller than 1 ATR", right: "Tight channel", wrong: "Small, short pullbacks: the trend barely pauses. That's tight, not broad." },
          { left: "Each pullback gives back more than half of the leg before it", right: "Broad channel", wrong: "Deep pullbacks make a broad channel, close to a range." },
        ],
        correct: "Pullback size and length grade the trend: micro and tight are strong, broad is weak.",
        concept: "price-channels",
      },
      {
        kind: "predict",
        title: "Three pushes",
        prompt: "Three pushes up, each to a slightly higher high. Tap the push with the shortest leg: the weakest momentum.",
        control: {
          kind: "tap",
          chart: { candles: L265_WEDGE },
          zones: [
            { id: "p1", label: "Push 1, 101.00", index: 2, price: 101.0, feedback: "Push 1 climbed from 99.80 to 101.00: 1.20, the longest leg." },
            { id: "p2", label: "Push 2, 101.20", index: 6, price: 101.2, feedback: "Push 2 climbed 0.80, from 100.40. Shorter than push 1, but not the shortest." },
            { id: "p3", label: "Push 3, 101.25", index: 10, price: 101.25, feedback: "Right." },
          ],
          answer: "p3",
        },
        figure: {
          kind: "chart",
          chart: { candles: L265_WEDGE },
          steps: [
            { text: "Push 1: from 99.80 to 101.00, a 1.20 leg.", layers: [{ kind: "bracket", from: 99.8, to: 101.0, index: 2, label: "1.20" }] },
            { text: "Push 2: from 100.40 to 101.20, a 0.80 leg.", layers: [{ kind: "bracket", from: 100.4, to: 101.2, index: 6, label: "0.80" }] },
            { text: "Push 3: from 100.75 to 101.25, only 0.50. Momentum fades.", layers: [{ kind: "bracket", from: 100.75, to: 101.25, index: 10, label: "0.50" }] },
          ],
        },
        reveal: "Each push gained less: 1.20, 0.80, 0.50. That's a [[three-push-wedge]]: three pushes with fading momentum, read as a possible reversal. Here the bars after push 3 fell back to 100.40; another time they might not.",
        concept: "three-push-wedge",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Brooks' wedge is a three-push idea; its lines don't need to converge. The classic wedge of unit 2.2 is a converging-lines idea. Bulkowski's statistics describe the classic one. Brooks' version has no published statistics.",
      },
      {
        kind: "explain",
        text: "A pullback can push three times against the trend. In a bull trend, three pushes down make a **wedge bull flag**, and its buy setup is an H3, the third attempt up. Another common shape is a [[spike-and-channel]]: a strong breakout, the spike, followed by a slower channel in the same direction.",
      },
      {
        kind: "reveal",
        title: "Draw it now",
        prompt: "You draw the lower channel line now, through the two swing lows so far: 100.20 and 100.70. A touch is a low within 0.05 of the line, closing above it. Reveal 9 more bars. How many touches count?",
        chart: { candles: L265_CHANNEL, visible: 11, layers: [L265_LINE, mark(3, "low", "100.20"), mark(8, "low", "100.70")] },
        choices: [
          { id: "none", label: "None", feedback: "Bar 14's low, 101.22, came within 0.02 of the line, at 101.20 there, and the bar closed above it. That counts." },
          { id: "one", label: "One", feedback: "Right." },
          { id: "three", label: "Three", feedback: "The two anchors don't count: you drew the line through them. Only touches after you drew it are evidence." },
        ],
        answer: "one",
        after: "One touch: bar 14 dipped to 101.22, 0.02 from the line, and closed above it. Bar 18 closed at 101.50, under the line at 101.60: the channel broke. Drawn afterwards, the same line shows three touches, but two of them were the anchors you chose.",
        concept: "price-channels",
      },
      {
        kind: "predict",
        title: "Name the channel",
        prompt: "Measure its pullbacks: 101.35 down to 100.70 after a leg up from 100.20, and 101.85 down to 101.22 after a leg up from 100.70. Which channel is it?",
        control: {
          kind: "choice",
          choices: [
            { id: "tight", label: "Tight", feedback: "Each pullback is 0.65 or 0.63 deep, well over the average bar range of about 0.38. Tight pullbacks stay within 1 ATR." },
            { id: "broad", label: "Broad", feedback: "Right." },
            { id: "micro", label: "Micro", feedback: "Bars 8–9 and 13–14 make lower lows, so it isn't a micro channel." },
          ],
          answer: "broad",
        },
        reveal: "Pullback 1 gave back 0.65 of a 1.15 leg, 57%; pullback 2 gave back 0.63 of 1.15, 55%. Both over half: a broad channel. Broad channels behave more like ranges: two-sided, with deep pullbacks.",
        concept: "price-channels",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "A line drawn after the fact always fits, because you choose the lows it passes through. Count only the touches after you could have drawn it. Channel types and wedges are Brooks' heuristics with no published statistics, and the same shapes can appear in random data.",
      },
    ],
    check: ["q-2.6.5-1", "q-2.6.5-2", "q-2.6.5-3"],
    recap: {
      takeaways: [
        "Micro: no lower lows for five or more bars. Tight: shallow, short pullbacks. Broad: pullbacks over half the leg.",
        "A three-push wedge has fading pushes; three pushes against the trend make a wedge flag, H3 or L3.",
        "Touches before you drew a line are its anchors, not evidence. Count only the later ones.",
      ],
    },
  },
};

const L266: Lesson = {
  id: "2.6.6",
  title: "Traps and failed breakouts",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Call a breakout failed only when a bar closes back inside, find where the trapped traders' stops sit, and decide at the close with the invalidation written down.",
  objectives: [
    "Identify a failed breakout as a close back inside the range within one to three bars.",
    "Locate where trapped breakout traders' stops sit, and explain how their exits can fuel the move against them.",
    "Decide between \"breakout\" and \"failure\" only after the bar closes, and write the invalidation for either choice.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "2.6",
    courseId: "2.6.6",
    hook: {
      prompt: "Al Brooks estimates what share of attempts to break out of a trading range fail?",
      control: {
        kind: "slider",
        min: 0,
        max: 100,
        step: 5,
        unit: "%",
        start: 50,
        answer: 80,
        tolerance: 10,
        feedback: [
          { from: 0, to: 45, text: "Lower than his figure. Brooks says most range breakouts fail: about 80%, by his estimate." },
          { from: 50, to: 65, text: "A bit low. Brooks puts it at about 80%: his estimate, not a measured rate." },
          { from: 70, to: 90, text: "Close to his figure, about 80%. It's an estimate, not a published statistic." },
          { from: 95, to: 100, text: "Higher than his figure, about 80%. Some breakouts do run." },
        ],
      },
      compare: "You said {yours}. Brooks says about 80%: an experienced trader's estimate, not a statistic. Treat it as a reason for caution, not as a rate to trade on.",
      concept: "false-breakout",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[failed-breakout]]: price closes beyond a level, then closes back inside the range within one to three bars. A breakout that holds closes beyond by a meaningful amount, about half an ATR, and the next bar keeps going: follow-through. At the breakout bar's close, the two look the same.",
      },
      {
        kind: "figure",
        title: "Who gets trapped",
        figure: {
          kind: "chart",
          chart: { candles: L266_BREAKDOWN, visible: 13, layers: [{ kind: "level", price: 98.0, role: "support", label: "RANGE LOW 98.00" }] },
          steps: [
            { text: "Bar 13 closes at 97.70, under the 98.00 range low. Sellers short the breakdown." },
            { text: "Bar 14 closes at 98.30, back inside: a failed breakdown.", visible: 14 },
            { text: "The shorts' stops sat above bar 13's high, 98.20. Bar 14 ran through them.", layers: [{ kind: "zone", from: 98.2, to: 98.4, role: "stop", label: "SHORTS' STOPS" }] },
            { text: "A short's stop is a buy order, so their exits add to the rally. Bar 17 closes at 99.30.", visible: 17 },
          ],
        },
        text: "[[trapped-trader|Trapped traders]] are caught on the wrong side; their exits can fuel the move against them. The same event has many names: 2B, turtle soup, swing failure, liquidity sweep (units 3.1 and 3.5).",
        concept: "trapped-traders",
      },
      {
        kind: "callout",
        tone: "key",
        text: "The mechanism has evidence: stop orders cluster just beyond round numbers, and because stops are trend-following orders, price tends to accelerate when it reaches them (Osler, 2001–2005; [[evidence-grade]] B). So a break through stops can continue as easily as it can fail. The 80% figure is a heuristic.",
      },
      {
        kind: "predict",
        title: "Before the close",
        prompt: "Bar 15 is still forming: price is 0.40 above the 102.00 range high, with 10 minutes left in the hour. What do you do?",
        control: {
          kind: "choice",
          choices: [
            { id: "enter", label: "Buy now, before it runs", feedback: "Price can still close back inside. Until the close, you don't know whether it's a breakout or a failure." },
            { id: "wait", label: "Wait for the bar to close", feedback: "Right." },
            { id: "fade", label: "Sell now: most breakouts fail", feedback: "A fade needs a close back inside. Right now price is above the level." },
          ],
          answer: "wait",
        },
        reveal: "Decide at the close. A bar that's above the level now can still close inside it, and then the breakout you bought is the failure you should have faded.",
        concept: "false-breakout",
      },
      {
        kind: "reveal",
        title: "Breakout 1",
        prompt: "Bar 15 closed at 102.40, above the 102.00 range high. It's your call, at the close: buy the breakout, wait to fade a close back inside, or stand aside?",
        chart: { candles: L266_FAIL, visible: 15, layers: [L266_LEVEL] },
        choices: [
          { id: "enter", label: "Buy the breakout at 102.45" },
          { id: "fade", label: "Wait to fade a close back inside" },
          { id: "aside", label: "Stand aside" },
        ],
        after: "Bar 16 closed at 101.80, back inside: a failed breakout. Bought at 102.45: the stop under the breakout bar's low, 101.90, filled on bar 16. Waited to fade: short at 101.75 after that close, stop above the failed high, 102.55. Stood aside: no cost, no trade.",
        concept: "trapped-traders",
      },
      {
        kind: "fields",
        title: "Write the invalidation",
        prompt: "For breakout 1, pick where each idea is proven wrong. Then write the fade's invalidation in your own words.",
        fields: [
          { id: "longStop", label: "Breakout long from 102.45: stop", kind: "choice", options: [101.85, 102.15, 102.35], default: 102.35 },
          { id: "fadeStop", label: "Fade short from 101.75: stop", kind: "choice", options: [101.95, 102.35, 102.56], default: 101.95 },
          { id: "why", label: "The fade is wrong if…", kind: "text", default: "", placeholder: "e.g. price trades back above the failed high, 102.55", required: true },
        ],
        valid: { all: [{ field: "longStop", eq: 101.85 }, { field: "fadeStop", eq: 102.56 }] },
        feedback: [
          { when: { field: "longStop", ne: 101.85 }, text: "At {longStop:2} the long's stop is still above the 102.00 level. The breakout is wrong once price is back inside: under the breakout bar's low, 101.90." },
          { when: { field: "fadeStop", ne: 102.56 }, text: "At {fadeStop:2} the fade's stop is under the failed high, 102.55. The fade is wrong only if price takes out that high: one tick above it." },
        ],
        correct: "Both on the right side: the breakout is wrong back inside the range, the fade is wrong above the failed high. Standing aside needs no stop.",
        concept: "invalidation-level",
      },
      {
        kind: "reveal",
        title: "Breakout 2",
        prompt: "Same range, another day. Bar 15 closed at 102.55, above 102.00. At the close: buy the breakout, wait to fade, or stand aside?",
        chart: { candles: L266_HOLD, visible: 15, layers: [L266_LEVEL] },
        choices: [
          { id: "enter", label: "Buy the breakout at 102.60" },
          { id: "fade", label: "Wait to fade a close back inside" },
          { id: "aside", label: "Stand aside" },
        ],
        after: "This one held: bar 16 closed at 102.90, and no bar dipped below 102.45, let alone closed back inside. Bought at 102.60 with the stop under 101.85: still open. The fade never triggered. Same range, the same kind of bar, opposite endings.",
        concept: "breakout",
      },
    ],
    check: ["q-2.6.6-1", "q-2.6.6-2", "q-2.6.6-3"],
    recap: {
      takeaways: [
        "Failed breakout: a close beyond the level, then a close back inside within one to three bars.",
        "Trapped breakout buyers' stops sit back inside the range; their stop sells can fuel the drop.",
        "Decide only after the bar closes, and write the invalidation for the choice you make.",
      ],
    },
  },
};

const L267: Lesson = {
  id: "2.6.7",
  title: "Momentum or exhaustion?",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Score a move's strength against its signs of exhaustion, flag climax bars by their size and context, and state a probability you can score later.",
  objectives: [
    "Score a move's strength with a checklist: runs of trend bars, overlap, pullback depth, closes near extremes, gaps between bars.",
    "Flag a climax bar as a bar more than 2.5 ATR tall late in an extended move.",
    "Explain why the same large bar can be a breakout or a climax, and record a calibrated probability instead of a certainty.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
    { kind: "arena", ref: "reversal", label: "Arena: reversal" },
  ],
  script: {
    unit: "2.6",
    courseId: "2.6.7",
    hook: {
      prompt: "A bar three times the ATR closes at its high after a long rally. Breakout or climax?",
      figure: {
        kind: "chart",
        chart: { candles: L267_MOVE.slice(0, 37) },
        steps: [{ text: "Bar 37: range 1.25, about 3.1 times the ATR(14) of 0.40, closing 0.02 under its high." }],
      },
      control: {
        kind: "choice",
        choices: [
          { id: "breakout", label: "Breakout", feedback: "It could be: big bars start legs too. But after 24 bars of rally, it could just as well end one." },
          { id: "climax", label: "Climax", feedback: "The context leans that way, but one bar can't settle it. Big bars also start new legs." },
          { id: "unclear", label: "Can't tell from one bar", feedback: "That's the honest answer: the reading is a probability, and only later bars confirm it." },
        ],
        answer: "unclear",
      },
      compare: "You picked {yours}. One bar can't settle it. The same big bar can start a leg or end one; context shifts the odds, and only the bars after it confirm.",
      concept: "momentum-vs-exhaustion",
    },
    learn: [
      {
        kind: "explain",
        text: "Score a move by adding a point for each sign of strength and taking one away for each sign of exhaustion. Strength: runs of trend bars, low overlap, shallow pullbacks, closes near the extremes, gap bars. Exhaustion: a [[climax]] bar, distance from the EMA 20, rising overlap, tails against the move, no follow-through.",
      },
      {
        kind: "match",
        title: "Strength or exhaustion?",
        prompt: "Sort each sign, for a rally. Strength adds 1 point, exhaustion takes 1 away; the score runs from −5 to +5.",
        pairs: [
          { left: "Three or more bull trend bars in a row", right: "Strength +1", wrong: "A run of trend bars is urgency: buyers winning bar after bar." },
          { left: "Average overlap of the last 5 bars under 30%", right: "Strength +1", wrong: "Little overlap means each bar moves on from the last: a sign of strength." },
          { left: "Pullbacks no deeper than 1 ATR", right: "Strength +1", wrong: "Shallow pullbacks mean sellers can't get much back: strength." },
          { left: "7 of the last 10 bars close in their top third", right: "Strength +1", wrong: "Closes near the highs, bar after bar, show buyers in control: strength." },
          { left: "A bar's low above the high of the bar two before it", right: "Strength +1", wrong: "That's a gap bar: price left a whole bar's range behind. A sign of strength." },
          { left: "A bar 2.5 ATR tall after 20 or more trend bars", right: "Exhaustion −1", wrong: "A huge bar late in a long move is the climax flag: often the last buyers rushing in." },
          { left: "Price more than 3 ATR above the EMA 20", right: "Exhaustion −1", wrong: "Far from its average, a move is stretched: an exhaustion flag." },
          { left: "Upper tails on each of the last 3 bars", right: "Exhaustion −1", wrong: "Tails on top mean higher prices were rejected: exhaustion, in a rally." },
          { left: "Overlap rising over the last 5 bars", right: "Exhaustion −1", wrong: "Rising overlap means bars stop moving on: the move is tiring." },
          { left: "No close above the big bar's close in the bars after it", right: "Exhaustion −1", wrong: "A big bar without follow-through is the clearest exhaustion flag." },
        ],
        correct: "Strength shows as urgency: runs, little overlap, small pullbacks. [[exhaustion|Exhaustion]] shows as stretch and hesitation.",
        concept: "momentum-vs-exhaustion",
      },
      {
        kind: "figure",
        title: "The climax detector",
        figure: {
          kind: "chart",
          chart: { candles: L267_MOVE.slice(0, 37) },
          steps: [
            { text: "Bars 13 to 36: a 24-bar rally, mostly bull trend bars.", layers: [mark(12, "low", "RALLY STARTS", "up")] },
            { text: "Bar 37: range 1.25, about 3.1 × the ATR(14) of 0.40 before it.", layers: [mark(36, "high", "3.1 ATR", "accent")] },
            { text: "It closes 3.09 above the EMA 20, 103.63: far beyond 3 ATR, 1.20.", layers: [L267_EMA_37] },
          ],
        },
        text: "The app flags a [[climax]] bar when its range is at least 2.5 ATR after 20 or more bars of trend. Context adds weight: the distance from the EMA 20, and whether the next bars follow through.",
        concept: "momentum-vs-exhaustion",
      },
      {
        kind: "callout",
        tone: "key",
        text: "The same big bar reads two ways. After a quiet range, it's a breakout candidate. After 24 trend bars and far from the EMA, it's a climax candidate. Context shifts the odds; it doesn't settle them. Write down a probability, not a certainty.",
      },
      {
        kind: "predict",
        title: "How likely?",
        prompt: "Will any of the next 5 bars close above bar 37's close, 106.72? Give your probability.",
        control: {
          kind: "slider",
          min: 0,
          max: 100,
          step: 10,
          unit: "%",
          start: 50,
          feedback: [
            { from: 0, to: 30, text: "Outcome: no. Your Brier score for this one: 0.09 or less. Lower is better." },
            { from: 40, to: 60, text: "Outcome: no. Your Brier score for this one: between 0.16 and 0.36." },
            { from: 70, to: 100, text: "Outcome: no. Your Brier score for this one: 0.49 to 1.00. Confidence costs most when it's wrong." },
          ],
        },
        figure: {
          kind: "chart",
          chart: { candles: L267_MOVE, visible: 37, layers: [L267_EMA] },
          steps: [{ text: "The next five closes: 106.54, 106.58, 106.36, 106.44, 106.19. None above 106.72.", visible: 42 }],
        },
        reveal: "No continuation this time. One outcome can't grade one forecast: a [[brier-score]] averages (probability − outcome)² over many forecasts. 0 is perfect; always saying 50% earns 0.25.",
        concept: "momentum-vs-exhaustion",
      },
      {
        kind: "worked",
        title: "Scoring three forecasts",
        lines: [
          "Brier score: the average of (your probability − outcome)², with outcome 1 if it happened and 0 if not.",
          "Forecast 1: 0.70, didn't happen. (0.70 − 0)² = 0.49.",
          "Forecast 2: 0.60, happened. (0.60 − 1)² = 0.16.",
          "Forecast 3: 0.90, happened. (0.90 − 1)² = 0.01.",
          "Average of the three = ?",
        ],
        ask: {
          answer: 0.22,
          tolerance: 0.005,
          feedback: [{ value: 0.66, text: "That's the sum. Divide by the 3 forecasts." }],
          correct: "Right: 0.66 ÷ 3 = 0.22.",
        },
        after: "0.22, a little better than the 0.25 that always saying 50% earns. Calibration builds over weeks: of all the times you say 70%, about 70% should happen.",
        concept: "momentum-vs-exhaustion",
      },
      {
        kind: "worked",
        title: "Score move A",
        lines: [
          "Move A: a rally in progress. ATR 0.45.",
          "The last 4 bars are all bull trend bars. Average overlap of the last 5: 22%.",
          "Deepest pullback so far: 0.35. Closes in the top third: 8 of the last 10.",
          "No gap bars.",
          "No bar taller than 1.4 ATR. The close is 2.1 ATR above the EMA 20.",
          "Overlap falling, no upper tails, still making new highs.",
          "Score, from −5 to +5 = ?",
        ],
        ask: {
          answer: 4,
          tolerance: 0,
          feedback: [
            { value: 5, text: "There are no gap bars, so that point is missing." },
            { value: 3, text: "Recount the strength side: the run, the overlap, the pullbacks and the closes all pass. Only gap bars are missing." },
          ],
          correct: "Right: 4 points of strength, no exhaustion flag.",
        },
        after: "+4: strength on four counts and no flag of exhaustion. That describes the move so far. It isn't the probability that it continues.",
        concept: "momentum-vs-exhaustion",
      },
      {
        kind: "worked",
        title: "Score move B",
        lines: [
          "Move B: another rally, three bars after a big bar. ATR 0.45.",
          "Trend bars in a row now: none. Average overlap of the last 5: 61%, up from 25%.",
          "Deepest pullback in the rally: 0.40. Closes in the top third: 5 of the last 10. No gap bars.",
          "The big bar was 3.1 ATR tall, after 24 trend bars. The close is 3.4 ATR above the EMA 20.",
          "Upper tails on each of the last 3 bars. No close above the big bar's close since.",
          "Score, from −5 to +5 = ?",
        ],
        ask: {
          answer: -4,
          tolerance: 0,
          feedback: [
            { value: -5, text: "One strength point survives: the deepest pullback, 0.40, is within 1 ATR. +1 − 5." },
            { value: 4, text: "Check the sign: five exhaustion flags at −1 each, one strength point." },
          ],
          correct: "Right: +1 − 5 = −4.",
        },
        after: "Move A scores +4, move B −4. The score describes the move; your probability is the forecast, and over many forecasts the Brier score shows how good they are.",
        concept: "momentum-vs-exhaustion",
      },
    ],
    check: ["q-2.6.7-1", "q-2.6.7-2", "q-2.6.7-3"],
    recap: {
      takeaways: [
        "Score a move: +1 per sign of strength, −1 per sign of exhaustion, from −5 to +5.",
        "Climax flag: a bar at least 2.5 ATR tall after 20 or more trend bars.",
        "A big bar can start or end a move. State a probability, then track your Brier score.",
      ],
    },
  },
};

const L268: Lesson = {
  id: "2.6.8",
  title: "Aligning timeframes",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Pick three timeframes about 4–6 times apart, rank them with a rule written before the trade, and catch timeframe shopping in your journal.",
  objectives: [
    "Choose a higher, a trading and a lower timeframe about 4–6 times apart.",
    "Apply a rule written in advance for which timeframe wins when they disagree.",
    "Recognise timeframe shopping in your own journal.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "check", ref: "decision_making", label: "Decision making check" },
  ],
  script: {
    unit: "2.6",
    courseId: "2.6.8",
    hook: {
      prompt: "The daily chart is in an uptrend. The hourly chart is falling. Which one wins?",
      control: {
        kind: "choice",
        choices: [
          { id: "daily", label: "The daily", feedback: "Often a sound rule, but only if you wrote it before looking. Choosing per trade is how timeframe shopping starts." },
          { id: "hourly", label: "The hourly", feedback: "Same problem the other way round: the answer should come from a rule written in advance." },
          { id: "rule", label: "Whatever my written rule says", feedback: "Right: the hierarchy is decided before the trade." },
        ],
        answer: "rule",
      },
      compare: "You picked {yours}. The hierarchy is decided before the trade, not trade by trade. Otherwise you'll pick whichever chart agrees with you.",
      concept: "timeframe-alignment",
    },
    learn: [
      {
        kind: "explain",
        text: "Use three [[timeframe|timeframes]] about 4–6 times apart. The **higher** one gives the direction, the **trading** one gives the setup and the stop, and the **lower** one only times the entry. For example: 1D, 4H and 1H (6× and 4×), or 4H, 1H and 15m (4× and 4×).",
      },
      {
        kind: "match",
        title: "How far apart?",
        prompt: "Sort each set of higher, trading and lower timeframes.",
        pairs: [
          { left: "1D, 4H, 1H", right: "Fits 4–6×", wrong: "1D is 6 × 4H, and 4H is 4 × 1H: both steps fit." },
          { left: "4H, 1H, 15m", right: "Fits 4–6×", wrong: "4× and 4×: both steps fit the guideline." },
          { left: "1H, 30m, 15m", right: "Too close", wrong: "2× steps: the three charts tell nearly the same story." },
          { left: "4H, 2H, 1H", right: "Too close", wrong: "2× steps again: the extra charts add little information." },
          { left: "1W, 1H, 1m", right: "Too far", wrong: "168× and 60×: the charts no longer connect." },
        ],
        correct: "4–6× keeps each chart different enough to add information, and close enough to connect.",
        concept: "timeframe-alignment",
      },
      {
        kind: "order",
        prompt: "Put the default hierarchy in order, from the rule that ranks first.",
        items: [
          "Higher timeframe: sets the direction. If it's a range, there's no direction to follow.",
          "Trading timeframe: gives the setup and the stop.",
          "Lower timeframe: only times the entry. It can't overrule the other two.",
        ],
        explain: "The order is the point: a lower timeframe can time an entry, but never overrule the direction or move the stop.",
        note: { key: "mtf-rule", label: "Your hierarchy rule, in one sentence", placeholder: "e.g. Trade only in the 4H direction; stop on 1H structure; time entries on 15m." },
        concept: "timeframe-alignment",
      },
      {
        kind: "explain",
        text: "Alexander Elder's [[triple-screen]] is one written version: the trend on a timeframe about 5× longer, an oscillator moving against it on the trading timeframe, and an entry with a buy stop above the previous bar. The research behind this course couldn't verify his original description, so treat it as an example, not a tested system.",
      },
      {
        kind: "hotspot",
        title: "Stop on the trading timeframe",
        prompt: "Your rule: trade in the 4H direction, up; set the stop on 1H structure. Tap the 1H low your stop goes under.",
        chart: { candles: L268_HOURLY },
        zones: [
          { id: "old", label: "Bar 4 low, 100.60", index: 3, price: 100.6, feedback: "That's an older swing low. The setup is wrong as soon as the last swing low breaks, 0.80 higher." },
          { id: "last", label: "Bar 11 low, 101.40", index: 10, price: 101.4 },
          { id: "now", label: "Bar 14 low, 101.75", index: 13, price: 101.75, feedback: "That's just the current bar's low, not structure. Small wiggles like this belong to the lower timeframe, which only times the entry." },
        ],
        answer: "last",
        correct: "The last 1H swing low, 101.40. Below it, the 1H pullback setup is wrong. A 15m low would be too close: the lower timeframe times the entry, it doesn't set the stop.",
        concept: "timeframe-alignment",
      },
      {
        kind: "predict",
        prompt: "Your written rule: trade only in the 4H direction. The 4H is rising; the 1H shows a clean sell setup. What do you do?",
        control: {
          kind: "choice",
          choices: [
            { id: "short", label: "Take the short: the setup is clean", feedback: "The setup is on the trading timeframe, but your rule ranks the 4H first. Shorts are off the table." },
            { id: "skip", label: "Skip it, and wait for a 1H buy setup", feedback: "Right." },
            { id: "daily", label: "Check the daily to break the tie", feedback: "That's timeframe shopping: looking for a chart that agrees. Your rule already decided." },
          ],
          answer: "skip",
        },
        reveal: "Your rule decided before the chart did. Skipping a clean-looking setup is part of following a hierarchy; switching charts until one agrees is [[timeframe-shopping]].",
        concept: "timeframe-alignment",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "No robust studies show directly that aligning timeframes improves results: [[evidence-grade]] D. It's plausible as a trend filter, given the evidence for momentum. But every extra timeframe adds choices, and with them the risk of overfitting and of timeframe shopping.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: L268_JOURNAL,
      goal: "Six journal entries. For each one, say whether the trader followed their timeframe rule, shopped for a timeframe, or changed the rule properly.",
      success: { field: "solved", eq: 6 },
      correct: "Six read. Shopping is a timeframe change that follows a feeling; a rule change follows a review.",
      hints: ["Ask when the timeframe changed: after a loss or a scare, or in a calm review?", "A lower timeframe that overrules the higher one breaks the hierarchy."],
      showMe: { solved: 6 },
      concept: "timeframe-alignment",
    },
    check: ["q-2.6.8-1", "q-2.6.8-2", "q-2.6.8-3"],
    recap: {
      takeaways: [
        "Pick three timeframes about 4–6× apart: direction, setup and stop, entry timing.",
        "Write the hierarchy before trading: the lower timeframe times entries and never overrules the higher.",
        "Switching charts after a loss, or to find agreement, is timeframe shopping. Change rules only in review.",
      ],
    },
  },
};

// ─── Check questions ────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // ─── 2.6.1 ───
  {
    id: "q-2.6.1-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "A bar opens at 100.40, trades up to 100.90 and down to 100.30, and closes at 100.85. How does the app classify it?",
    options: [
      { id: "a", label: "Doji bar", rationale: "A doji bar's body is a quarter of the range or less. Here the body is 0.45 of 0.60: 75%." },
      { id: "b", label: "Bull trend bar" },
      { id: "c", label: "Neither", rationale: "Neither is for middling bodies or big bodies closing mid-range. This close, 100.85, is in the top third." },
      { id: "d", label: "Bear trend bar", rationale: "It closed above its open, so the body is bull. A bear trend bar closes near its low." },
    ],
    correct: "b",
    explanation: "Body 100.85 − 100.40 = 0.45 of a 0.60 range: 75%, over half. The close, 100.85, is in the top third, which starts at 100.70. Both tests pass: a bull trend bar.",
    lesson: "2.6.1",
    concepts: ["bar-reading"],
  },
  {
    id: "q-2.6.1-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Over the last 10 bars, each bar shares on average 65% of its range with the bar before. What does that suggest?",
    options: [
      { id: "a", label: "Nothing: overlap can't be measured objectively", rationale: "Overlap is mechanical: shared range ÷ the smaller range. Its meaning is the heuristic part." },
      { id: "b", label: "A strong trend: price keeps returning to the same prices", rationale: "Strong trends leave prices behind: low overlap, under 30%. Returning to the same prices is two-sided trading." },
      { id: "c", label: "A breakout is about to happen", rationale: "Overlap describes what has happened. It doesn't time a breakout or say which way one would go." },
      { id: "d", label: "Two-sided trading, roughly in balance: a range reading" },
    ],
    correct: "d",
    explanation: "Over 50% average overlap suggests a range: each bar covers mostly the same prices as the last, so neither side is winning. The measurement is mechanical; reading it as balance is Brooks' heuristic, without published statistics.",
    lesson: "2.6.1",
    concepts: ["bar-reading", "range"],
    hints: ["Under 30% suggests a trend; over 50% suggests a range.", "What does it mean when bar after bar covers the same prices?"],
  },
  {
    id: "q-2.6.1-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "LABX has ranged between 99.00 and 101.00 for 30 hours, its bars overlapping about 60%. Now a big bull trend bar runs from 99.80 to 100.70 and closes near its high, in the middle of the range.",
    prompt: "How do you read it?",
    options: [
      { id: "a", label: "Buy now: a trend bar shows urgency", rationale: "In a trend, a run of trend bars shows urgency. One bar mid-range is still inside two-sided trading." },
      { id: "b", label: "Sell now: trend bars in ranges always fail", rationale: "Nothing always fails. Brooks expects big bars in ranges to fade, but that's a heuristic, not a rule to trade blindly." },
      { id: "c", label: "As range behaviour until later bars show follow-through" },
      { id: "d", label: "As proof that the range will break upwards", rationale: "It hasn't even reached the range high, 101.00. A breakout needs a close beyond the range and follow-through." },
    ],
    correct: "c",
    explanation: "Context changes the bar. Mid-range, with 60% overlap behind it, one big bar hasn't changed the regime: the range is still the best description. Only follow-through, more trend bars and less overlap, would turn it into a trend reading.",
    lesson: "2.6.1",
    concepts: ["bar-reading", "range"],
    hints: ["Where is the bar: at an edge or in the middle?", "One bar against 30 hours of overlap: which describes the market better?"],
  },
  // ─── 2.6.2 ───
  {
    id: "q-2.6.2-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "A bull bar forms at the prior low: open 100.20, high 100.80, low 100.20, close 100.75. ATR(14) is 0.50. Which signal-bar test does it fail?",
    options: [
      { id: "a", label: "Close in the top third", rationale: "The top third starts at 100.60, and it closed at 100.75. It passes." },
      { id: "b", label: "An upper wick of at most 15% of the range", rationale: "The upper wick is 0.05 of a 0.60 range, 8%. It passes." },
      { id: "c", label: "A lower wick of at least 25% of the range" },
      { id: "d", label: "A range between 0.5 and 2 × ATR", rationale: "0.60 is 1.2 × ATR, inside the band. It passes." },
    ],
    correct: "c",
    explanation: "It opened at its low, so it has no lower wick: nothing shows sellers being rejected below. The close is in the top third, the upper wick is 8%, the range is 1.2 × ATR and it's at the prior low: 4 of 5.",
    lesson: "2.6.2",
    concepts: ["signal-and-entry-bars"],
    hints: ["Measure each wick as a share of the 0.60 range.", "Where did the bar open, compared with its low?"],
  },
  {
    id: "q-2.6.2-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "A setup wins 45% of the time. Winners make 1.6R, losers lose 1R, and costs take 0.07R a trade. What is the expectancy per trade, in R?",
    numeric: { answer: 0.1, tolerance: 0.005, unit: "R" },
    explanation: "0.45 × 1.6R − 0.55 × 1R − 0.07R = 0.72 − 0.55 − 0.07 = +0.10R a trade. Positive, but thin: a slightly lower win rate or higher costs would wipe it out.",
    lesson: "2.6.2",
    concepts: ["traders-equation", "expectancy"],
    hints: ["Multiply each outcome by its chance, then subtract the costs.", "Wins: 0.45 × 1.6. Losses: 0.55 × 1.", "0.72 − 0.55 − 0.07."],
    vary: {
      fields: { p: [35, 60, 5], w: [1.2, 3, 0.2], cost: [0.03, 0.1, 0.01] },
      constraints: ["abs(p / 100 * w - (1 - p / 100) - cost) >= 0.01"],
      answer: "round(p / 100 * w - (1 - p / 100) - cost, 2)",
      prompt: "A setup wins {p}% of the time. Winners make {w:1}R, losers lose 1R, and costs take {cost:2}R a trade. What is the expectancy per trade, in R?",
      explanation:
        "{p / 100:2} × {w:1}R − {1 - p / 100:2} × 1R − {cost:2}R = {p / 100 * w:2} − {1 - p / 100:2} − {cost:2} = {answer:2}R a trade. Above zero is an edge after costs; below zero loses money however good the bars look.",
      hint: "{p / 100 * w:2} − {1 - p / 100:2} − {cost:2}.",
    },
  },
  {
    id: "q-2.6.2-3",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 1,
    prompt: "A bull signal bar has a high of 101.36 and a low of 100.92. You place a buy stop one tick above it and a protective stop one tick below it. What is your risk per unit, before slippage and costs?",
    numeric: { answer: 0.46, tolerance: 0.001, unit: "vUSD" },
    explanation: "Buy stop 101.36 + 0.01 = 101.37; stop 100.92 − 0.01 = 100.91. Risk = 101.37 − 100.91 = 0.46 a unit: the bar's 0.44 range plus the two ticks.",
    lesson: "2.6.2",
    concepts: ["signal-and-entry-bars", "stop-entry-order"],
    hints: ["One tick on LABX is 0.01.", "Buy stop: 101.36 + 0.01. Stop: 100.92 − 0.01.", "101.37 − 100.91."],
    vary: {
      fields: { lo: [99, 102, 0.01], d: [0.2, 1.2, 0.01] },
      answer: "round(d + 0.02, 2)",
      prompt: "A bull signal bar has a high of {lo + d:2} and a low of {lo:2}. You place a buy stop one tick above it and a protective stop one tick below it. What is your risk per unit, before slippage and costs?",
      explanation: "Buy stop {lo + d + 0.01:2}; stop {lo - 0.01:2}. Risk = {lo + d + 0.01:2} − {lo - 0.01:2} = {answer:2} a unit: the bar's {d:2} range plus the two ticks.",
      hint: "{lo + d + 0.01:2} − {lo - 0.01:2}.",
    },
  },
  // ─── 2.6.3 ───
  {
    id: "q-2.6.3-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "The last seven bars have ranges 0.80, 0.65, 0.90, 0.55, 0.70, 0.60 and 0.50. The newest bar runs from 100.10 to 100.60; the one before ran from 100.15 to 100.75. What is the newest bar?",
    options: [
      { id: "a", label: "An inside bar", rationale: "Its low, 100.10, is under the previous low, 100.15, so it isn't contained." },
      { id: "b", label: "An outside bar", rationale: "Its high, 100.60, is under the previous 100.75. An outside bar must go beyond both ends." },
      { id: "c", label: "An NR7 bar" },
      { id: "d", label: "An inside bar and an NR7 bar", rationale: "It is NR7, but not inside: its low pokes 0.05 under the previous low." },
    ],
    correct: "c",
    explanation: "0.50 is the narrowest of the seven ranges, so it's NR7. It isn't an inside bar, because its low, 100.10, is under the previous low, 100.15; and it isn't an outside bar, because its high is lower too.",
    lesson: "2.6.3",
    concepts: ["inside-outside-bars"],
    hints: ["Compare its range with the six before it.", "An inside bar needs both its high and its low within the previous bar."],
  },
  {
    id: "q-2.6.3-2",
    topic: "order_types",
    kind: "numeric",
    difficulty: 2,
    prompt: "An inside bar runs from 99.18 to 99.64. You bracket it with stop entries one tick beyond each side, and each leg's protective stop sits at the other entry. What is the risk per unit of either leg, before costs?",
    numeric: { answer: 0.48, tolerance: 0.001, unit: "vUSD" },
    explanation: "Buy stop 99.65, sell stop 99.17. The long's stop is at 99.17 and the short's at 99.65, so both legs risk 99.65 − 99.17 = 0.48 a unit.",
    lesson: "2.6.3",
    concepts: ["inside-outside-bars", "oco-order"],
    hints: ["Buy stop: one tick above the high. Sell stop: one tick below the low.", "Each leg's stop is the other entry.", "99.65 − 99.17."],
    vary: {
      fields: { lo: [98.5, 101.5, 0.01], d: [0.2, 1, 0.01] },
      answer: "round(d + 0.02, 2)",
      prompt: "An inside bar runs from {lo:2} to {lo + d:2}. You bracket it with stop entries one tick beyond each side, and each leg's protective stop sits at the other entry. What is the risk per unit of either leg, before costs?",
      explanation: "Buy stop {lo + d + 0.01:2}, sell stop {lo - 0.01:2}. Each leg's stop is the other entry, so both risk {lo + d + 0.01:2} − {lo - 0.01:2} = {answer:2} a unit.",
      hint: "{lo + d + 0.01:2} − {lo - 0.01:2}.",
    },
  },
  {
    id: "q-2.6.3-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "What is a hikkake?",
    options: [
      { id: "a", label: "Two inside bars in a row, followed by a breakout", rationale: "That's ii and a breakout. A hikkake needs the first break to fail." },
      { id: "b", label: "An outside bar that closes at its extreme", rationale: "That's a strong outside bar. A hikkake starts with an inside bar." },
      { id: "c", label: "An inside bar, a break of one side that fails, then a close beyond the other side" },
      { id: "d", label: "A gap that fills within the same session", rationale: "Gap fills are a different idea. A hikkake is a false break of an inside bar." },
    ],
    correct: "c",
    explanation: "The first break traps traders on the wrong side; the move through the opposite side of the inside bar is the trade. By the app's convention, that close must come within 3 bars. No published statistics back the setup.",
    lesson: "2.6.3",
    concepts: ["inside-outside-bars", "false-breakout"],
  },
  // ─── 2.6.4 ───
  {
    id: "q-2.6.4-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "A bull pullback starts at the trend high. Bar highs, in order: 103.20 (the high), 102.90, 102.70, 102.95, 102.60, 102.40, 102.75. The sixth bar makes the pullback's lowest low. Which bar is H2?",
    options: [
      { id: "a", label: "The fourth, 102.95", rationale: "That's H1: the first high above the bar before. H2 comes after the next lower low." },
      { id: "b", label: "The sixth, 102.40", rationale: "That's the pullback's low bar, the signal bar for H2. H2 is the next bar to trade above its high." },
      { id: "c", label: "The fifth, 102.60", rationale: "102.60 is under the fourth bar's 102.95, so it isn't a count." },
      { id: "d", label: "The seventh, 102.75" },
    ],
    correct: "d",
    explanation: "Count bars whose high beats the previous bar's high. The fourth (102.95 > 102.70) is H1. After the pullback makes its lower low on the sixth, the seventh (102.75 > 102.40) is H2.",
    lesson: "2.6.4",
    concepts: ["bar-counting", "two-legged-pullback"],
    hints: ["Compare each high only with the one right before it.", "The first bar that beats its neighbour is H1."],
  },
  {
    id: "q-2.6.4-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "An H2 signal bar has a high of 98.42, and the pullback low is 97.96. You place a buy stop one tick above the signal bar and a stop one tick under the pullback low. What is the risk per unit, before costs?",
    numeric: { answer: 0.48, tolerance: 0.001, unit: "vUSD" },
    explanation: "Buy stop 98.42 + 0.01 = 98.43; stop 97.96 − 0.01 = 97.95. Risk = 98.43 − 97.95 = 0.48 a unit.",
    lesson: "2.6.4",
    concepts: ["bar-counting", "signal-and-entry-bars"],
    hints: ["One tick is 0.01: add it to the high, take it off the low.", "Buy stop 98.43; stop 97.95.", "98.43 − 97.95."],
    vary: {
      fields: { low: [96, 102, 0.01], d: [0.2, 0.9, 0.01] },
      answer: "round(d + 0.02, 2)",
      prompt: "An H2 signal bar has a high of {low + d:2}, and the pullback low is {low:2}. You place a buy stop one tick above the signal bar and a stop one tick under the pullback low. What is the risk per unit, before costs?",
      explanation: "Buy stop {low + d + 0.01:2}; stop {low - 0.01:2}. Risk = {low + d + 0.01:2} − {low - 0.01:2} = {answer:2} a unit.",
      hint: "{low + d + 0.01:2} − {low - 0.01:2}.",
    },
  },
  {
    id: "q-2.6.4-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why do H1 and H2 counts mean little in a trading range?",
    options: [
      { id: "a", label: "Ranges have too few bars to count", rationale: "Ranges can last hundreds of bars. The problem isn't the number of bars but what they'd be resuming." },
      { id: "b", label: "Counting only works on daily charts", rationale: "Counting works on any timeframe. In a range, there's no trend for a second attempt to resume." },
      { id: "c", label: "In a range, H2 always fails", rationale: "Not always. It just has no edge from the count: mid-range bars go both ways." },
      { id: "d", label: "Without a trend there's nothing to resume, and every bounce produces counts" },
    ],
    correct: "d",
    explanation: "H1 and H2 are attempts to resume a trend. In a range there's no trend, and since a count is only a bar beating the previous high, counts appear on almost every bounce, random data included. The trend check comes first.",
    lesson: "2.6.4",
    concepts: ["bar-counting", "range"],
    hints: ["What is an H2 an attempt to do?"],
  },
  // ─── 2.6.5 ───
  {
    id: "q-2.6.5-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "In an uptrend, pullbacks last one or two bars and the deepest is 0.30, with an ATR of 0.50. Now and then a bar dips under the previous bar's low. Which channel is it?",
    options: [
      { id: "a", label: "Tight channel" },
      { id: "b", label: "Broad channel", rationale: "Broad pullbacks give back more than half the leg before. These are shallow: 0.30 against an ATR of 0.50." },
      { id: "c", label: "Micro channel", rationale: "Some bars dip under the previous low, so it isn't micro." },
      { id: "d", label: "A trading range", rationale: "Short, shallow pullbacks in an uptrend are a strong trend, not two-sided trading." },
    ],
    correct: "a",
    explanation: "Pullbacks of at most 1 ATR and at most 3 bars make a tight channel. It isn't micro, because some bars take out the previous low, and it isn't broad, because the pullbacks are shallow.",
    lesson: "2.6.5",
    concepts: ["price-channels"],
    hints: ["Compare the deepest pullback with the ATR.", "Micro needs no lower lows at all."],
  },
  {
    id: "q-2.6.5-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "What is a wedge bull flag?",
    options: [
      { id: "a", label: "Three pushes up with fading momentum at the top of a rally", rationale: "That's a wedge top, read as a possible reversal. A flag pushes against the trend it sits in." },
      { id: "b", label: "A pullback in a bull trend that pushes down three times; its buy setup is an H3" },
      { id: "c", label: "A flag whose lines converge, with no pushes counted", rationale: "That's the classic wedge of unit 2.2. Brooks' version counts pushes." },
      { id: "d", label: "A strong breakout followed by a slower channel", rationale: "That's a spike and channel." },
    ],
    correct: "b",
    explanation: "In a bull trend, a pullback that pushes down three times is a wedge bull flag; the third attempt up, H3, is the buy setup. It's Brooks' heuristic, with no published statistics.",
    lesson: "2.6.5",
    concepts: ["three-push-wedge", "bar-counting"],
    hints: ["A flag is a pause against the trend.", "Count the pushes, then the attempts to resume."],
  },
  {
    id: "q-2.6.5-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Today you draw a channel line through three lows from last week, and note that the channel has been 'tested three times'. What's wrong with that count?",
    options: [
      { id: "a", label: "Nothing: three touches make a valid channel", rationale: "Three touches you chose to draw through are a fit, not a test. Price never had to respect a line that didn't exist." },
      { id: "b", label: "You need at least five touches", rationale: "More anchors don't help: you'd still be fitting the line to the past. The problem is when the touches happened." },
      { id: "c", label: "The lows are the anchors you chose; only touches after you drew the line are evidence" },
      { id: "d", label: "Channel lines only work on closes", rationale: "Lows or closes, the problem is the same: touches chosen after the fact." },
    ],
    correct: "c",
    explanation: "Drawn after the fact, a line always fits the lows you picked. Those touches couldn't have been traded, because the line didn't exist yet. Only touches after you draw it count as tests.",
    lesson: "2.6.5",
    concepts: ["price-channels", "hindsight-bias"],
    hints: ["When did the line exist?"],
  },
  // ─── 2.6.6 ───
  {
    id: "q-2.6.6-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "By the app's rule, when has a breakout above a range failed?",
    options: [
      { id: "a", label: "When a wick pokes above the range and the bar closes inside", rationale: "That bar never closed beyond, so it's a test, not a breakout. Failure needs a close beyond first." },
      { id: "b", label: "When a bar closes above the level, then a bar closes back inside within one to three bars" },
      { id: "c", label: "When price trades back to the level at any later time", rationale: "Retests are common in breakouts that hold. Failure is a close back inside within one to three bars." },
      { id: "d", label: "When the breakout bar is a doji bar", rationale: "A weak breakout bar raises doubt, but failure is defined by the close back inside." },
    ],
    correct: "b",
    explanation: "A failed breakout needs two closes: one beyond the level, then one back inside within one to three bars. A wick that doesn't close beyond is a test; a later retest that holds isn't a failure.",
    lesson: "2.6.6",
    concepts: ["false-breakout", "trapped-traders"],
  },
  {
    id: "q-2.6.6-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "A range runs from 98.00 to 100.00. A bar closes at 100.40, with a low of 99.90. The next bar closes at 99.60.",
    prompt: "Where are the stops of the traders who bought that breakout most likely to sit?",
    options: [
      { id: "a", label: "Above the breakout bar's high", rationale: "Stops above the high protect shorts. A long is protected by a sell stop below the entry." },
      { id: "b", label: "At 98.00, the bottom of the range", rationale: "A few might sit there, but the breakout idea is wrong as soon as price is back inside: most stops sit just under the breakout bar." },
      { id: "c", label: "Just under the breakout bar's low, around 99.89, back inside the range" },
      { id: "d", label: "Nowhere: breakout traders don't use stops", rationale: "Some don't, but a breakout plan's stop belongs where the idea fails: back inside the range." },
    ],
    correct: "c",
    explanation: "A breakout long is wrong once price is back inside, so its stop sits under the breakout bar or just inside the range. As the next bar falls to close at 99.60, those sell stops fill together and can push price lower: trapped traders fuelling the move against them.",
    lesson: "2.6.6",
    concepts: ["trapped-traders", "invalidation-level"],
    hints: ["A long's stop is a sell order. Where is the breakout idea proven wrong?"],
  },
  {
    id: "q-2.6.6-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why decide on a breakout only after the breakout bar closes?",
    options: [
      { id: "a", label: "Until it closes, a bar above the level can still close back inside: the close is its final verdict" },
      { id: "b", label: "Spreads are wider before the close", rationale: "On LABX the spread is a fixed 0.10. The reason is information: the close decides breakout or failure." },
      { id: "c", label: "The close is always the best price to enter at", rationale: "Waiting often costs some price. You accept that to know what the bar actually did." },
      { id: "d", label: "Stop orders only work at the close", rationale: "Stop orders trigger whenever price reaches them. The point is your decision, not the order type." },
    ],
    correct: "a",
    explanation: "Mid-bar, price above the level is only a possibility. The same bar can close back inside, turning a breakout into a failure. Deciding at the close, with the invalidation written, trades a little price for real information.",
    lesson: "2.6.6",
    concepts: ["false-breakout", "breakout"],
    hints: ["What can still change before a bar closes?"],
  },
  // ─── 2.6.7 ───
  {
    id: "q-2.6.7-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "In a rally, which of these adds a point of strength on the checklist?",
    options: [
      { id: "a", label: "A bar 3 ATR tall after 25 bars of trend", rationale: "That's the climax flag: a huge bar late in a long move counts as exhaustion." },
      { id: "b", label: "8 of the last 10 bars closing in their top third" },
      { id: "c", label: "Overlap rising over the last 5 bars", rationale: "Rising overlap means bars stop moving on: an exhaustion flag." },
      { id: "d", label: "Upper tails on each of the last 3 bars", rationale: "Tails on top mean higher prices were rejected: exhaustion, in a rally." },
    ],
    correct: "b",
    explanation: "Closes near the highs, bar after bar, show buyers in control: 7 or more of the last 10 in the top third adds a point. The other three are exhaustion flags.",
    lesson: "2.6.7",
    concepts: ["momentum-vs-exhaustion"],
  },
  {
    id: "q-2.6.7-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Two bars are each 3 ATR tall and close at their highs. What makes one of them a climax candidate rather than a breakout candidate?",
    options: [
      { id: "a", label: "Its context: late in a long trend and far from the EMA 20, rather than right after a range" },
      { id: "b", label: "Its colour and the size of its body", rationale: "Both bars look the same. Bar shape alone can't separate them; the difference is where they come in the move." },
      { id: "c", label: "Its volume, which is always higher at a climax", rationale: "Volume can help, but nothing is always true here. The checklist's flag is about context: trend length and stretch." },
      { id: "d", label: "Nothing: any bar over 2.5 ATR is a climax", rationale: "The flag needs both size and context: 20 or more trend bars before it. After a range, the same bar is a breakout candidate." },
    ],
    correct: "a",
    explanation: "The climax flag combines size with context: at least 2.5 ATR, after 20 or more trend bars, ideally far from the EMA 20. The same bar after a quiet range is a breakout candidate. Either way it's a probability, confirmed only by the bars after.",
    lesson: "2.6.7",
    concepts: ["momentum-vs-exhaustion", "volatility"],
    hints: ["The bars are identical. What differs is what came before them."],
  },
  {
    id: "q-2.6.7-3",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "You gave a 0.70 probability that a move would continue. It didn't. What is the Brier score of that one forecast?",
    numeric: { answer: 0.49, tolerance: 0.005, unit: "" },
    explanation: "Brier = (probability − outcome)², with outcome 0 because it didn't happen: (0.70 − 0)² = 0.49. Over many forecasts you average these; always saying 50% scores 0.25.",
    lesson: "2.6.7",
    concepts: ["momentum-vs-exhaustion"],
    hints: ["The outcome is 1 if it happened, 0 if not.", "Square the gap between your probability and the outcome.", "(0.70 − 0)²."],
    vary: {
      fields: { p: [0.1, 0.9, 0.05], hit: [0, 1, 1] },
      answer: "round((p - hit) * (p - hit), 4)",
      prompt: "You gave a {p:2} probability that a move would continue. The outcome was {hit}, where 1 means it continued and 0 means it didn't. What is the Brier score of that one forecast?",
      explanation: "Brier = (probability − outcome)² = ({p:2} − {hit})² = {answer:4}. Over many forecasts you average these; always saying 50% scores 0.25.",
      hint: "({p:2} − {hit})².",
    },
  },
  // ─── 2.6.8 ───
  {
    id: "q-2.6.8-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Your trading timeframe is 1H. Which pair of higher and lower timeframes fits the 4–6× guideline?",
    options: [
      { id: "a", label: "2H and 30m", rationale: "2× steps are too close: the three charts tell nearly the same story." },
      { id: "b", label: "1W and 1m", rationale: "168× and 60×: far too wide for the charts to connect." },
      { id: "c", label: "4H and 15m" },
      { id: "d", label: "1D and 5m", rationale: "24× and 12×: too far apart to link a daily direction to a 5-minute entry." },
    ],
    correct: "c",
    explanation: "4H is 4 × 1H, and 1H is 4 × 15m: both steps sit in the 4–6× band. Each chart adds information without losing the link to the next.",
    lesson: "2.6.8",
    concepts: ["timeframe-alignment", "timeframe"],
  },
  {
    id: "q-2.6.8-2",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your plan says: trade only in the 4H direction; set the stop on 1H structure; time entries on 15m. The 4H is in an uptrend. On the 1H, price has fallen for 12 bars and just broke a swing low.",
    prompt: "What does your rule allow?",
    options: [
      { id: "a", label: "A 1H short: the 1H trend is down now", rationale: "The 1H gives setups in the 4H direction only. A 1H downtrend against a rising 4H is a pullback, not a short." },
      { id: "b", label: "A short at half size", rationale: "Half a trade against the rule is still against the rule." },
      { id: "c", label: "Switching the bias to the 1H for today", rationale: "Changing the hierarchy mid-session is timeframe shopping. Rule changes belong in a review." },
      { id: "d", label: "No short: wait for the 1H to set up a long, or stand aside" },
    ],
    correct: "d",
    explanation: "The written hierarchy settles the conflict: the 4H gives the direction, so only longs are allowed. The 1H decline is, at most, a pullback to wait out until a 1H buy setup forms.",
    lesson: "2.6.8",
    concepts: ["timeframe-alignment"],
    hints: ["Which timeframe ranks first in your rule?"],
  },
  {
    id: "q-2.6.8-3",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your rule: trade the 1H setup; use the 15m for timing only. Journal: '09:40 long on a 1H setup, stopped out at −1R. 09:48 opened the 15m, saw a fresh buy signal, entered long again.'",
    prompt: "What does the journal show?",
    options: [
      { id: "a", label: "Timeframe shopping: a switch right after a loss, to find a new signal" },
      { id: "b", label: "Persistence: the idea was right, only the timing was off", rationale: "The 1H setup had failed. The 15m was used to find a new reason to buy, not to time a valid setup." },
      { id: "c", label: "A proper rule change", rationale: "Rule changes happen in review, in writing, not eight minutes after a loss." },
      { id: "d", label: "Nothing wrong: the 15m is part of the rule", rationale: "The 15m times a 1H setup. Here it supplied a new setup after the 1H one failed." },
    ],
    correct: "a",
    explanation: "Eight minutes after a loss, the trader moved to a lower timeframe and found the agreement they wanted. That's timeframe shopping: the chart changed to fit the decision, not the other way round.",
    lesson: "2.6.8",
    concepts: ["timeframe-alignment", "confirmation-bias"],
    hints: ["What happened just before the timeframe changed?"],
  },
];

// ─── Glossary terms ─────────────────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "trend-bar",
    term: "Trend bar",
    definition: "A bar with a large body that closes near its extreme. In the app: a body of at least half the range, with the close in the third of the range nearest the extreme.",
    plain: "A bar where one side clearly won.",
    related: ["doji-bar", "bar-overlap", "body"],
    lesson: "2.6.1",
  },
  {
    id: "doji-bar",
    term: "Doji bar",
    definition: "In price action, a bar with a small body compared with its range. In the app: a body of at most a quarter of the range.",
    plain: "A bar where neither buyers nor sellers won.",
    related: ["trend-bar", "bar-overlap", "body"],
    lesson: "2.6.1",
  },
  {
    id: "bar-overlap",
    term: "Bar overlap",
    definition: "How much of a bar's range is shared with the previous bar's range: the shared part divided by the smaller bar's range, 0 if they don't touch.",
    plain: "How much two neighbouring bars cover the same prices.",
    related: ["trend-bar", "doji-bar", "range"],
    lesson: "2.6.1",
  },
  {
    id: "signal-bar",
    term: "Signal bar",
    definition: "The bar whose high or low sets the price of a stop entry, usually one tick beyond it.",
    plain: "The bar that tells you where to place your entry order.",
    related: ["entry-bar", "stop-order", "invalidation"],
    lesson: "2.6.2",
  },
  {
    id: "entry-bar",
    term: "Entry bar",
    definition: "The bar during which your entry order fills.",
    plain: "The bar in which you get into the trade.",
    related: ["signal-bar", "entry", "fill"],
    lesson: "2.6.2",
  },
  {
    id: "traders-equation",
    term: "Trader's equation",
    definition: "Win chance times reward must beat loss chance times risk, after costs: P(win) × reward − P(loss) × risk − costs > 0.",
    plain: "A quick check that a setup can pay for its losers and its costs.",
    related: ["expectancy", "reward-to-risk", "win-rate"],
    lesson: "2.6.2",
  },
  {
    id: "inside-bar",
    term: "Inside bar",
    definition: "A bar whose high and low stay within the previous bar's range; equal highs or lows still count. Two in a row are called ii, three iii.",
    plain: "A bar that fits completely inside the bar before it.",
    related: ["outside-bar", "nr7", "hikkake"],
    lesson: "2.6.3",
    aka: ["ii", "iii"],
  },
  {
    id: "outside-bar",
    term: "Outside bar",
    definition: "A bar whose high is above the previous bar's high and whose low is below the previous bar's low.",
    plain: "A bar that is bigger than the bar before it at both ends.",
    related: ["inside-bar", "nr7", "volatility"],
    lesson: "2.6.3",
  },
  {
    id: "nr7",
    term: "NR7",
    definition: "The bar with the narrowest range of the last seven bars. NR4 is the same idea over four bars.",
    plain: "The quietest bar of the last seven.",
    related: ["inside-bar", "volatility", "candle-range"],
    lesson: "2.6.3",
    aka: ["narrow range 7"],
  },
  {
    id: "hikkake",
    term: "Hikkake",
    definition: "An inside bar, a false break out of one side, then a close beyond the other side; within three bars, by the app's convention.",
    plain: "A fake breakout of a quiet bar that turns into a move the other way.",
    related: ["inside-bar", "failed-breakout", "breakout"],
    lesson: "2.6.3",
  },
  {
    id: "high-1-high-2",
    term: "H1 / H2",
    definition: "In a bull pullback, the first and second bars whose high goes above the previous bar's high. L1 and L2 are the bear-trend mirror, using lows.",
    plain: "The first and second attempts to restart an uptrend after a dip.",
    related: ["two-legged-pullback", "second-entry", "pullback"],
    lesson: "2.6.4",
    aka: ["H1", "H2", "L1", "L2"],
  },
  {
    id: "two-legged-pullback",
    term: "Two-legged pullback",
    definition: "A pullback against the trend in two legs, separated by a small bounce.",
    plain: "A dip that comes in two steps instead of one.",
    related: ["pullback", "high-1-high-2", "second-entry"],
    lesson: "2.6.4",
  },
  {
    id: "second-entry",
    term: "Second entry",
    definition: "A trade taken on the second attempt in one direction, after the first attempt failed.",
    plain: "Getting in on the second try, after the first one didn't work.",
    related: ["high-1-high-2", "two-legged-pullback", "entry"],
    lesson: "2.6.4",
  },
  {
    id: "micro-channel",
    term: "Micro channel",
    definition: "A run of bars where no bar's low goes below the previous bar's low; in a bear trend, no high goes above the previous high.",
    plain: "A trend so steady that no bar dips under the bar before it.",
    related: ["trend", "three-push-wedge", "spike-and-channel"],
    lesson: "2.6.5",
  },
  {
    id: "three-push-wedge",
    term: "Three-push wedge",
    definition: "Three pushes in the same direction with fading momentum, each leg shorter than the last.",
    plain: "Three tries to go further, each one weaker.",
    related: ["micro-channel", "reversal", "high-1-high-2"],
    lesson: "2.6.5",
  },
  {
    id: "spike-and-channel",
    term: "Spike and channel",
    definition: "A strong breakout, the spike, followed by a slower trending channel in the same direction.",
    plain: "A fast burst, then a slower drift the same way.",
    related: ["breakout", "micro-channel", "trend"],
    lesson: "2.6.5",
  },
  {
    id: "trapped-trader",
    term: "Trapped trader",
    definition: "A trader caught on the wrong side of a failed move, whose exit can fuel the move against them.",
    plain: "Someone who entered just before the market turned, and now has to get out.",
    related: ["failed-breakout", "stop-loss", "breakout"],
    lesson: "2.6.6",
  },
  {
    id: "failed-breakout",
    term: "Failed breakout",
    definition: "A close beyond a level followed by a close back inside within one to three bars.",
    plain: "A break out of a range that quickly falls back in.",
    related: ["breakout", "trapped-trader", "hikkake"],
    lesson: "2.6.6",
    aka: ["false breakout"],
  },
  {
    id: "climax",
    term: "Climax",
    definition: "An unusually large bar late in a long move, often followed by a pause or reversal. The app flags bars at least 2.5 ATR tall after 20 or more trend bars.",
    plain: "A huge bar at the end of a long run, when the last buyers or sellers rush in.",
    related: ["exhaustion", "atr", "reversal"],
    lesson: "2.6.7",
  },
  {
    id: "exhaustion",
    term: "Exhaustion",
    definition: "Signs that a move is tiring: more overlap, tails against it, no follow-through after a big bar.",
    plain: "Clues that a move is running out of energy.",
    related: ["climax", "trend", "reversal"],
    lesson: "2.6.7",
  },
  {
    id: "brier-score",
    term: "Brier score",
    definition: "The average squared gap between your stated probabilities and what happened, scored 1 or 0. Lower is better: 0 is perfect, and always saying 50% scores 0.25.",
    plain: "A score for how well your probabilities match what actually happens.",
    related: ["probability", "sample-size", "variance"],
    lesson: "2.6.7",
  },
  {
    id: "timeframe-shopping",
    term: "Timeframe shopping",
    definition: "Switching timeframes until one agrees with what you already wanted to do.",
    plain: "Changing charts until one tells you what you want to hear.",
    related: ["timeframe", "confirmation-bias", "triple-screen"],
    lesson: "2.6.8",
  },
  {
    id: "triple-screen",
    term: "Triple Screen",
    definition: "Alexander Elder's method: the trend on a longer timeframe, a pullback on the trading one, and the entry timed on a shorter one.",
    plain: "Three charts, each with one job: direction, setup, timing.",
    related: ["timeframe", "timeframe-shopping", "pullback"],
    lesson: "2.6.8",
  },
];

// ─── Concepts ───────────────────────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "bar-reading",
    name: "Bar reading",
    category: "technical_analysis",
    summary: "Classifying bars as trend bars or doji bars, and reading runs of trend bars and the overlap between bars as signs of a trend or a range.",
    body: [
      "Each bar gets a label from two measurements: the body as a share of the range, and where the close sits. The app calls a bar a trend bar when the body is at least half the range and the close is in the third nearest its extreme, and a doji bar when the body is a quarter of the range or less. Overlap is the share of a bar's range the bar before also covered.",
      "Average overlap under 30% over 10 bars suggests a trend, over 50% a range; three or more trend bars in a row suggest urgency. The measurements are mechanical, but reading them as urgency or balance is Al Brooks' heuristic, without published statistics, and the same bar means different things in a trend and in a range.",
    ],
    example: "Open 100.00, high 101.05, low 99.95, close 101.00: body 1.00 of a 1.10 range (91%), close in the top third, so a bull trend bar. The next bar, 101.00 / 101.25 / 100.45 / 100.90, has a body of 0.10 of 0.80 (12.5%): a doji bar. The two share 0.60, 75% of the smaller range.",
    related: ["trend", "range", "candlestick", "momentum-vs-exhaustion"],
    missions: ["M01", "M02"],
    lessons: ["2.6.1", "2.6.7"],
  },
  {
    id: "signal-and-entry-bars",
    name: "Signal and entry bars",
    category: "technical_analysis",
    summary: "The signal bar sets a stop-entry price one tick beyond it; the entry bar is the bar in which that order fills. A checklist grades the signal bar.",
    body: [
      "For a long, a buy stop goes one tick above the signal bar's high and the protective stop one tick below its low; the distance between them is the risk. If price never trades through the buy stop, there is no trade. The entry bar's close is the first information about the trade.",
      "The app grades a bull reversal signal bar on five tests: a bull body closing in the top third, a lower wick of at least 25% of the range, an upper wick of at most 15%, a range between 0.5 and 2 × ATR, and a location such as a prior low. That higher scores win more often is a heuristic without published statistics.",
    ],
    example: "Signal bar high 100.80, low 100.20: buy stop 100.81, protective stop 100.19, risk 0.62 a unit. The next bar trades to 101.10 and fills the order: it's the entry bar.",
    related: ["stop-entry-order", "invalidation-level", "traders-equation"],
    missions: ["M04"],
    lessons: ["2.6.2", "2.6.4"],
  },
  {
    id: "traders-equation",
    name: "Trader's equation",
    category: "risk_management",
    summary: "Win probability times reward must exceed loss probability times risk, after costs.",
    body: [
      "Before taking a setup, multiply the chance of winning by the reward and subtract the chance of losing times the risk, then the costs. Above zero, the setup has an edge on paper; below zero, it loses money however good the chart looks. It is the arithmetic of expectancy, applied to one setup.",
      "The equation is mechanical; the probability you put in is an estimate. Al Brooks pairs setups he rates near 60% with at least 1:1, and most reversals, near 40%, with at least 1:2, but those percentages are his subjective estimates.",
    ],
    example: "P(win) 0.40, reward 2R, risk 1R: 0.40 × 2 − 0.60 × 1 = +0.20R; after costs of 0.05R, +0.15R a trade. At 1:1 the same setup gives 0.40 − 0.60 = −0.20R.",
    related: ["expectancy", "reward-to-risk", "trading-costs"],
    missions: ["M05"],
    lessons: ["2.6.2"],
  },
  {
    id: "inside-outside-bars",
    name: "Inside, outside and narrow-range bars",
    category: "technical_analysis",
    summary: "Bars contained in, or extending beyond, the previous bar's range, and the narrowest bar of recent bars.",
    body: [
      "An inside bar's high and low stay within the previous bar's; two in a row are ii, three iii. An outside bar goes beyond both ends of the previous bar. An NR7 bar has the narrowest range of the last seven. A hikkake is an inside bar, a false break of one side, then a close beyond the other side.",
      "A common way to trade a quiet bar is an OCO pair of stop entries one tick beyond each side, each leg stopped at the other entry, sized from the larger distance. The definitions are mechanical; the setups are heuristics without published statistics. What has support is size: quiet stretches tend to be followed by wider ranges.",
    ],
    example: "ii ending with a bar from 100.10 to 100.70: buy stop 100.71, sell stop 100.09, 0.62 of risk either way. With a 100.00 budget and 0.05% commission on each fill, 138 units lose 99.42 at the stop; 139 would lose 100.14.",
    related: ["oco-order", "volatility", "false-breakout"],
    missions: ["M05"],
    lessons: ["2.6.3"],
  },
  {
    id: "two-legged-pullback",
    name: "Two-legged pullback",
    category: "technical_analysis",
    summary: "A pullback that runs in two legs, often ending with a second attempt to resume the trend.",
    body: [
      "Leg A moves against the trend, a small bounce follows, and leg C makes a new pullback extreme. In a bull trend, the bounce is the first attempt to resume (H1); the bar that trades above the signal bar after leg C is the second (H2).",
      "In Al Brooks' reading, the first attempt often fails, so the second entry is preferred: traders who faded the first attempt are trapped when the second one breaks out. It is a heuristic without published statistics, and it needs a trend to start with.",
    ],
    example: "From a 105.00 high, leg A falls to 103.90; H1 reaches 104.50; leg C falls to 103.70; the next bar trades above the signal bar's 104.00 high. Buy stop 104.01, stop 103.69: 0.32 of risk.",
    related: ["trend", "bar-counting", "signal-and-entry-bars"],
    missions: ["M02"],
    lessons: ["2.6.4"],
  },
  {
    id: "bar-counting",
    name: "Bar counting (H1/H2)",
    category: "technical_analysis",
    summary: "Counting attempts to resume a trend during a pullback: H1 and H2 in bull trends, L1 and L2 in bear trends.",
    body: [
      "In a bull pullback, H1 is the first bar whose high goes above the previous bar's high; after a lower low, the next such bar is H2. Bear trends mirror it with lows. Bars are counted, not swings, and a new trend extreme resets the count.",
      "A count is only a bar beating the previous high, so ranges and random data produce counts all the time. The count means something only after a trend check: higher highs and higher lows first.",
    ],
    example: "Pullback highs 105.00, 104.60, 104.30, 104.50, 104.20, 104.00, 104.35: H1 is the fourth bar (104.50 > 104.30), H2 the seventh (104.35 > 104.00).",
    related: ["two-legged-pullback", "trend", "range"],
    missions: ["M02"],
    lessons: ["2.6.4"],
  },
  {
    id: "price-channels",
    name: "Tight, broad and micro channels",
    category: "technical_analysis",
    summary: "Bar-by-bar channel types that grade a trend's strength by pullback size and by the bars' lows or highs.",
    body: [
      "A tight channel has pullbacks of at most 1 ATR and 3 bars; a broad channel's pullbacks give back more than half the leg before, close to a range; a micro channel has five or more bars without a lower low in a bull trend, or without a higher high in a bear trend.",
      "Channel lines drawn after the fact always fit, because you choose the points they pass through. Only touches after the line was drawn are evidence. The channel types are Al Brooks' heuristics without published statistics.",
    ],
    example: "A line through swing lows 100.20 and 100.70 drawn after bar 11: one later touch, a low of 101.22 against the line at 101.20, then a close under the line on bar 18. Pullbacks of 57% and 55% of the legs before make it a broad channel.",
    related: ["trend", "three-push-wedge", "hindsight-bias"],
    missions: ["M02"],
    lessons: ["2.6.5"],
  },
  {
    id: "three-push-wedge",
    name: "Three-push wedge",
    category: "technical_analysis",
    summary: "Three pushes in one direction with fading momentum, read as a possible reversal or, against the trend, as a wedge flag.",
    body: [
      "Al Brooks' wedge is a count of pushes, each reaching a little further with a shorter leg; the lines don't need to converge. Three pushes up at the end of a rally suggest a possible reversal; three pushes down inside a bull trend make a wedge bull flag, whose buy setup is H3.",
      "It differs from the classic converging-lines wedge, for which Bulkowski published statistics. Brooks' version has none.",
    ],
    example: "Pushes to 101.00, 101.20 and 101.25, from lows of 99.80, 100.40 and 100.75: legs of 1.20, 0.80 and 0.50. Each push gained less.",
    related: ["price-channels", "bar-counting", "trend"],
    missions: ["M02"],
    lessons: ["2.6.5"],
  },
  {
    id: "trapped-traders",
    name: "Trapped traders",
    category: "technical_analysis",
    summary: "Traders caught by a failed move, whose exits can fuel the move against them.",
    body: [
      "When a breakout fails, the traders who bought it hold losing longs with sell stops back inside the range. As price returns, those stops fill together and add to the drop; the mirror holds for failed breakdowns. The same event is called a 2B, turtle soup, swing failure or liquidity sweep.",
      "The mechanism has support: stop orders cluster beyond round numbers, and price tends to accelerate when it reaches them (Osler). But that cuts both ways: a break through clustered stops can continue as easily as it can fail. Al Brooks' estimate that about 80% of range breakouts fail is a heuristic, and a single unreviewed study of currency pairs found that swept levels predicted continuation, not reversal.",
    ],
    example: "A range from 100.05 to 102.00; bar 15 closes at 102.40 with a low of 101.90; bar 16 closes at 101.80. Breakout longs stopped under 101.90 are out; a fade short from 101.75 has its stop above the failed high, 102.55.",
    related: ["false-breakout", "breakout", "invalidation-level"],
    missions: ["M07"],
    lessons: ["2.6.6"],
  },
  {
    id: "momentum-vs-exhaustion",
    name: "Momentum versus exhaustion",
    category: "technical_analysis",
    summary: "Reading whether a move is strengthening or tiring from bar size, overlap, pullbacks and climax bars, and stating the result as a probability.",
    body: [
      "The app's checklist adds a point for each sign of strength (runs of trend bars, overlap under 30%, pullbacks within 1 ATR, closes near the extremes, gap bars) and takes one for each sign of exhaustion (a climax bar of at least 2.5 ATR after 20 or more trend bars, more than 3 ATR from the EMA 20, rising overlap, tails against the move, no follow-through). The score runs from −5 to +5.",
      "The score describes; it isn't a probability. The same big bar can start or end a move, so state a probability and track how well calibrated you are with the Brier score. The checklist items are heuristics; the Brier score is a mechanical scoring rule.",
    ],
    example: "A bar 1.25 tall against an ATR of 0.40, after a 24-bar rally, closing 3.09 above the EMA 20: a climax flag. Forecasts of 0.70 (didn't happen), 0.60 and 0.90 (happened) score (0.49 + 0.16 + 0.01) ÷ 3 = 0.22.",
    related: ["bar-reading", "volatility", "trend"],
    missions: ["M02"],
    lessons: ["2.6.7"],
  },
  {
    id: "timeframe-alignment",
    name: "Timeframe alignment",
    category: "decision_making",
    summary: "Using a higher, a trading and a lower timeframe under a hierarchy written before the trade.",
    body: [
      "Pick three timeframes about 4–6 times apart, such as 4H, 1H and 15m. The higher one gives the direction, the trading one the setup and the stop, the lower one only the timing of the entry; a lower timeframe can't overrule a higher one.",
      "No robust studies show directly that alignment improves results; it's plausible as a trend filter. Each extra timeframe adds choices, and with them the risk of timeframe shopping: switching charts until one agrees with what you wanted to do.",
    ],
    example: "Rule: trade only in the 4H direction, stop on 1H structure, entry timed on 15m. The 4H rises and the 1H shows a sell setup: no trade. A 1H pullback long gets its stop under the last 1H swing low, 101.40.",
    related: ["timeframe", "confirmation-bias", "trading-plan"],
    missions: ["M10"],
    lessons: ["2.6.8"],
  },
];

/** Unit 2.6 · Price action bar by bar (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_2_6: UnitContent = {
  lessons: [L261, L262, L263, L264, L265, L266, L267, L268],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
