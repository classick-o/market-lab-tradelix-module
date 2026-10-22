import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, Question, UnitContent, UnitIntro } from "../../types";

/** Unit 1.3 · Orders and execution (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */

/** One candle, in price units with 2 decimals. */
const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

// ─── Chart data ─────────────────────────────────────────────────────────────

/**
 * 1.3.3 hook, B2 and Try: 14 hours ranging between 100.42 and 102.00; the mid now is 101.40.
 * The ask never reaches 102.10 (the highest mid is 102.00, ask 102.05).
 */
const S3_RANGE: CandleData[] = [
  k(101.0, 101.38, 100.86, 101.3),
  k(101.3, 101.86, 101.22, 101.78),
  k(101.78, 101.98, 101.52, 101.6),
  k(101.6, 101.68, 101.02, 101.1),
  k(101.1, 101.16, 100.52, 100.62),
  k(100.62, 100.96, 100.44, 100.9),
  k(100.9, 101.42, 100.84, 101.36),
  k(101.36, 101.9, 101.3, 101.84),
  k(101.84, 102.0, 101.66, 101.72),
  k(101.72, 101.8, 101.18, 101.26),
  k(101.26, 101.34, 100.7, 100.78),
  k(100.78, 100.88, 100.42, 100.6),
  k(100.6, 101.1, 100.54, 101.04),
  k(101.04, 101.46, 100.96, 101.4),
];

/**
 * 1.3.3 Try, under the veil: six more hours inside the range (highest mid 101.99, ask 102.04), then hour 7
 * opens with the mid at 102.40 (ask 102.45), over the 102.10 trigger. Its lowest mid is 102.34 (ask 102.39),
 * so a stop-limit capped at 102.30 never fills.
 */
const S3_BREAK: CandleData[] = [
  k(101.4, 101.72, 101.32, 101.66),
  k(101.66, 101.96, 101.58, 101.88),
  k(101.88, 101.94, 101.5, 101.58),
  k(101.58, 101.8, 101.48, 101.74),
  k(101.74, 101.99, 101.68, 101.92),
  k(101.92, 101.98, 101.8, 101.85),
  k(102.4, 102.86, 102.34, 102.78),
  k(102.78, 103.2, 102.7, 103.12),
];

const S3_RANGE_HIGH: ChartLayer = { kind: "level", price: 102.0, role: "resistance", label: "RANGE HIGH 102.00" };

/** 1.3.4 Try: 12 hours between 99.06 and 100.95 (ask at most 101.00, bid at least 99.01); the mid now is 100.50. */
const S4_RANGE: CandleData[] = [
  k(100.0, 100.48, 99.92, 100.4),
  k(100.4, 100.9, 100.34, 100.82),
  k(100.82, 100.95, 100.4, 100.48),
  k(100.48, 100.56, 99.9, 99.98),
  k(99.98, 100.04, 99.4, 99.48),
  k(99.48, 99.6, 99.06, 99.2),
  k(99.2, 99.74, 99.12, 99.66),
  k(99.66, 100.22, 99.58, 100.14),
  k(100.14, 100.7, 100.06, 100.62),
  k(100.62, 100.94, 100.5, 100.58),
  k(100.58, 100.66, 100.1, 100.2),
  k(100.2, 100.58, 100.12, 100.5),
];

/** 1.3.4 Try, under the veil: hour 2 opens at 100.80 (ask 100.85) and reaches 101.30, so the buy stop fills at 101.10. The bid stays above 100.00. */
const S4_BREAK: CandleData[] = [
  k(100.5, 100.86, 100.42, 100.8),
  k(100.8, 101.3, 100.72, 101.24),
  k(101.24, 101.62, 101.1, 101.55),
  k(101.55, 101.98, 101.44, 101.9),
  k(101.9, 102.08, 101.66, 101.74),
  k(101.74, 102.2, 101.68, 102.12),
  k(102.12, 102.46, 102.02, 102.38),
  k(102.38, 102.6, 102.24, 102.52),
];

/** 1.3.5 Try: eight 4-hour candles around 100.00, closing at 100.00. */
const S5_BEFORE: CandleData[] = [
  k(100.4, 100.62, 100.2, 100.3),
  k(100.3, 100.48, 99.96, 100.1),
  k(100.1, 100.38, 99.9, 100.24),
  k(100.24, 100.56, 100.12, 100.44),
  k(100.44, 100.5, 100.02, 100.12),
  k(100.12, 100.3, 99.84, 99.92),
  k(99.92, 100.2, 99.8, 100.08),
  k(100.08, 100.22, 99.92, 100.0),
];

/**
 * 1.3.5 Try, under the veil: three days of 4-hour candles. Days 1–2 stay above a mid of 99.20 (ask 99.25).
 * On day 3, candle 14 opens at 98.94 (ask 98.99) and falls to 97.76 (ask 97.81): the buy limit fills at 98.00.
 * Price closes at 96.40.
 */
const S5_DAYS: CandleData[] = [
  k(100.0, 100.44, 99.88, 100.36),
  k(100.36, 100.7, 100.24, 100.58),
  k(100.58, 100.66, 100.18, 100.26),
  k(100.26, 100.4, 99.94, 100.04),
  k(100.04, 100.3, 99.86, 100.22),
  k(100.22, 100.52, 100.1, 100.46),
  k(100.46, 100.8, 100.38, 100.62),
  k(100.62, 100.68, 100.06, 100.14),
  k(100.14, 100.2, 99.52, 99.6),
  k(99.6, 99.84, 99.38, 99.74),
  k(99.74, 99.96, 99.56, 99.66),
  k(99.66, 99.78, 99.2, 99.3),
  k(99.3, 99.42, 98.84, 98.94),
  k(98.94, 99.02, 97.76, 97.9),
  k(97.9, 97.98, 97.2, 97.32),
  k(97.32, 97.5, 96.7, 96.84),
  k(96.84, 97.06, 96.3, 96.52),
  k(96.52, 96.7, 96.34, 96.4),
];

/**
 * 1.3.8 hook and B2: one path from a long at 100.00 (close of candle index 3). Higher lows 100.70 (index 8),
 * 101.60 (index 14) and 102.90 (index 21); highs 101.20, 102.50, 103.80, 104.60; index 24 closes at 104.00;
 * then a drop to 102.00. The candles after the entry span 0.58 on average.
 */
const S8_PATH: CandleData[] = [
  k(99.6, 99.88, 99.5, 99.78),
  k(99.78, 99.86, 99.62, 99.7),
  k(99.7, 99.98, 99.6, 99.88),
  k(99.88, 100.1, 99.78, 100.0),
  k(100.0, 100.5, 99.9, 100.4),
  k(100.4, 100.92, 100.3, 100.82),
  k(100.82, 101.2, 100.72, 101.12),
  k(101.12, 101.2, 100.78, 100.86),
  k(100.86, 100.94, 100.7, 100.78),
  k(100.78, 101.3, 100.74, 101.2),
  k(101.2, 101.72, 101.1, 101.62),
  k(101.62, 102.14, 101.52, 102.04),
  k(102.04, 102.5, 101.94, 102.42),
  k(102.42, 102.5, 101.98, 102.06),
  k(102.06, 102.14, 101.6, 101.68),
  k(101.68, 102.2, 101.64, 102.1),
  k(102.1, 102.66, 102.0, 102.56),
  k(102.56, 103.1, 102.46, 103.0),
  k(103.0, 103.5, 102.94, 103.4),
  k(103.4, 103.8, 103.3, 103.72),
  k(103.72, 103.8, 103.26, 103.34),
  k(103.34, 103.42, 102.9, 102.98),
  k(102.98, 103.46, 102.94, 103.36),
  k(103.36, 103.8, 103.26, 103.7),
  k(103.7, 104.1, 103.6, 104.0),
  k(104.0, 104.6, 103.9, 104.52),
  k(104.52, 104.6, 103.72, 103.8),
  k(103.8, 103.88, 102.98, 103.06),
  k(103.06, 103.14, 102.32, 102.4),
  k(102.4, 102.48, 101.92, 102.0),
];

const S8_ENTRY: ChartLayer = { kind: "level", price: 100.0, role: "entry", label: "ENTRY 100.00" };
const S8_LOWS: ChartLayer[] = [
  { kind: "marker", index: 8, at: "low", label: "HL 100.70", role: "accent" },
  { kind: "marker", index: 14, at: "low", label: "HL 101.60", role: "accent" },
  { kind: "marker", index: 21, at: "low", label: "HL 102.90", role: "accent" },
];

/**
 * 1.3.8 B2: each trail's stop, candle by candle, as set at the previous close. A long stop fills when the bid
 * (mid − 0.05) reaches it. Tight: 0.50 under the highest high, out at 100.70 in candle 8. Wide: 1.50 under it,
 * out at 103.10 in candle 27. Structure: 0.20 under each higher low once price turns up, out at 102.70 in candle 28.
 */
const S8_TIGHT: ChartLayer = {
  kind: "path",
  role: "concept",
  label: "TIGHT 0.50",
  points: [
    { index: 3.5, price: 99.5 },
    { index: 4.5, price: 99.5 },
    { index: 4.5, price: 100.0 },
    { index: 5.5, price: 100.0 },
    { index: 5.5, price: 100.42 },
    { index: 6.5, price: 100.42 },
    { index: 6.5, price: 100.7 },
    { index: 8, price: 100.7 },
  ],
};
const S8_WIDE: ChartLayer = {
  kind: "path",
  role: "neutral",
  dashed: true,
  label: "WIDE 1.50",
  points: [
    { index: 3.5, price: 98.5 },
    { index: 4.5, price: 98.5 },
    { index: 4.5, price: 99.0 },
    { index: 5.5, price: 99.0 },
    { index: 5.5, price: 99.42 },
    { index: 6.5, price: 99.42 },
    { index: 6.5, price: 99.7 },
    { index: 9.5, price: 99.7 },
    { index: 9.5, price: 99.8 },
    { index: 10.5, price: 99.8 },
    { index: 10.5, price: 100.22 },
    { index: 11.5, price: 100.22 },
    { index: 11.5, price: 100.64 },
    { index: 12.5, price: 100.64 },
    { index: 12.5, price: 101.0 },
    { index: 16.5, price: 101.0 },
    { index: 16.5, price: 101.16 },
    { index: 17.5, price: 101.16 },
    { index: 17.5, price: 101.6 },
    { index: 18.5, price: 101.6 },
    { index: 18.5, price: 102.0 },
    { index: 19.5, price: 102.0 },
    { index: 19.5, price: 102.3 },
    { index: 24.5, price: 102.3 },
    { index: 24.5, price: 102.6 },
    { index: 25.5, price: 102.6 },
    { index: 25.5, price: 103.1 },
    { index: 27, price: 103.1 },
  ],
};
const S8_STRUCTURE: ChartLayer = {
  kind: "path",
  role: "accent",
  label: "STRUCTURE",
  points: [
    { index: 3.5, price: 98.0 },
    { index: 9.5, price: 98.0 },
    { index: 9.5, price: 100.5 },
    { index: 15.5, price: 100.5 },
    { index: 15.5, price: 101.4 },
    { index: 22.5, price: 101.4 },
    { index: 22.5, price: 102.7 },
    { index: 28, price: 102.7 },
  ],
};

/**
 * 1.3.8 Try: a second long from 100.00 (close of index 2), first stop 99.00. Higher lows 100.40 (index 6),
 * 101.30 (index 11) and 102.20 (index 16); the next candle's low stays above each. The trail moves after each
 * higher low: 100.20 from index 8, then the learner's stop. No bid after index 12 reaches 101.20, none after
 * index 17 reaches 102.10.
 */
const S8_TRY: CandleData[] = [
  k(99.7, 99.96, 99.6, 99.86),
  k(99.86, 99.94, 99.7, 99.78),
  k(99.78, 100.1, 99.68, 100.0),
  k(100.0, 100.48, 99.9, 100.38),
  k(100.38, 100.9, 100.28, 100.82),
  k(100.82, 100.9, 100.54, 100.62),
  k(100.62, 100.7, 100.4, 100.48),
  k(100.48, 100.96, 100.44, 100.86),
  k(100.86, 101.4, 100.76, 101.3),
  k(101.3, 101.8, 101.2, 101.72),
  k(101.72, 101.8, 101.46, 101.54),
  k(101.54, 101.62, 101.3, 101.38),
  k(101.38, 101.86, 101.34, 101.76),
  k(101.76, 102.3, 101.66, 102.2),
  k(102.2, 102.7, 102.1, 102.62),
  k(102.62, 102.7, 102.36, 102.44),
  k(102.44, 102.52, 102.2, 102.28),
  k(102.28, 102.76, 102.24, 102.66),
  k(102.66, 103.14, 102.56, 103.04),
  k(103.04, 103.4, 102.94, 103.32),
];

const S8_TRY_ENTRY: ChartLayer = { kind: "level", price: 100.0, role: "entry", label: "ENTRY 100.00" };

// ─── Lessons ────────────────────────────────────────────────────────────────

const L133: Lesson = {
  id: "1.3.3",
  title: "Stop entries and stop-limit orders",
  topic: "order_types",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "A stop entry waits beyond a level and buys or sells at market once it breaks; a stop-limit adds a price cap that a gap can skip.",
  objectives: [
    "Place a buy stop above the price to enter only if a level breaks.",
    "Predict where a stop entry fills when price gaps through its trigger.",
    "Explain why a stop-limit can leave you unfilled, or unprotected, in a gap.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
    { kind: "check", ref: "order_types", label: "Order types check" },
  ],
  script: {
    unit: "1.3",
    courseId: "1.3.3",
    bridge: "In 1.3.2 you used a stop to get out: once touched, it became a market order. Here the same trigger gets you in, with a buy stop above a range, and you meet the stop-limit, whose price cap a gap can skip.",
    hook: {
      prompt: "LABX is ranging below 102.00. You want to buy only if price breaks above it. Which order?",
      control: {
        kind: "choice",
        choices: [
          { id: "limit", label: "Buy limit at 102.10" },
          { id: "stop", label: "Buy stop at 102.10" },
          { id: "market", label: "Market buy now" },
        ],
        answer: "stop",
      },
      figure: {
        kind: "chart",
        chart: { candles: S3_RANGE, layers: [S3_RANGE_HIGH] },
        steps: [{ text: "Fourteen hours between about 100.40 and 102.00. The mid now: 101.40." }],
      },
      compare: "You chose {yours}. A buy stop at 102.10 waits for the break. A buy limit there sits above the ask, so it fills at once, inside the range.",
      concept: "stop-entry-order",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[stop-order]] waits for price to reach its trigger, then becomes a [[market-order]]. A **buy stop** sits above the current price: it buys only if price rises to it. A **sell stop** sits below: it sells only if price falls to it. [[limit-order|Limits]] are the mirror image: a buy limit waits below, a sell limit above.",
      },
      {
        kind: "figure",
        title: "Four orders around the price",
        figure: {
          kind: "chart",
          chart: { candles: S3_RANGE },
          steps: [
            {
              text: "Above the price: a sell limit sells into a rally, a buy stop buys a breakout.",
              layers: [
                { kind: "level", price: 102.1, role: "entry", label: "BUY STOP 102.10" },
                { kind: "level", price: 101.9, role: "target", label: "SELL LIMIT 101.90" },
              ],
            },
            {
              text: "Below the price: a buy limit buys a dip, a sell stop sells a breakdown.",
              layers: [
                { kind: "level", price: 100.5, role: "entry", label: "BUY LIMIT 100.50" },
                { kind: "level", price: 100.3, role: "stop", label: "SELL STOP 100.30" },
              ],
            },
            { text: "Limits wait for a better price. Stops wait for a break, then fill at market." },
          ],
        },
        concept: "stop-entry-order",
      },
      {
        kind: "match",
        prompt: "Match each plan to the order that carries it out.",
        pairs: [
          { left: "Buy only if price breaks above the range", right: "Buy stop", wrong: "A buy limit waits below the price for a dip. A break above needs a buy stop." },
          { left: "Buy only on a dip", right: "Buy limit", wrong: "A buy stop sits above the price and buys strength, not a dip." },
          { left: "Go short only if price breaks below support", right: "Sell stop", wrong: "A sell limit waits above the price. A break below needs a sell stop." },
          { left: "Sell only into a rally", right: "Sell limit", wrong: "A sell stop sells weakness below the price. A rally needs a sell limit above it." },
        ],
        columns: ["Plan", "Order"],
        concept: "stop-entry-order",
      },
      {
        kind: "worked",
        title: "A stop entry in a gap",
        lines: [
          "Buy stop at 102.10: it triggers when the ask reaches 102.10, then fills at market.",
          "The next candle opens with the mid at 102.60, so the ask is 102.65.",
          "Slippage per unit: 102.65 − 102.10 = 0.55.",
          "For 30 units: 30 × 0.55 = ?",
        ],
        ask: {
          answer: 16.5,
          tolerance: 0.005,
          unit: "vUSD",
          feedback: [
            { value: 0.55, text: "That's per unit. Multiply by the 30 units." },
            { value: 15.0, text: "That measures from the mid, 102.60. A buy fills at the ask, 102.65." },
          ],
          correct: "Right: 16.50 more than the trigger price promised.",
        },
        after: "Nothing traded between 102.10 and the open, so the order took the first price there was. A stop entry promises a fill, not a price.",
        concept: "stop-entry-order",
      },
      {
        kind: "explain",
        text: "A [[stop-limit-order]] has two prices: a trigger and a limit. Trigger 102.10, limit 102.30: once triggered, it buys only at 102.30 or lower. If the next candle opens with the ask at 102.65, nothing fills. Used as a protective stop, that same cap can leave your position open in a gap.",
      },
      {
        kind: "predict",
        prompt: "A sell stop-limit protects your long: trigger 98.00, limit 97.80. The market gaps down and the bid opens at 97.20. What happens?",
        control: {
          kind: "choice",
          choices: [
            { id: "limit", label: "Sold at 97.80", feedback: "A sell limit sells only at 97.80 or higher, and the bid is 97.20. Nothing sells." },
            { id: "open", label: "Sold at 97.20", feedback: "That's what a stop-market order would do. The limit forbids any sale below 97.80." },
            { id: "open-position", label: "Not sold: the position stays open", feedback: "Right. The trigger fired, but the limit can't fill below 97.80." },
          ],
          answer: "open-position",
        },
        reveal: "The trigger turned the order into a sell limit at 97.80, and the bid is already 0.60 below it. You're still long, and price is falling. A plain stop would have sold at 97.20: worse than planned, but out.",
        concept: "stop-limit-order",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Protective stops should be stop-market orders: in a gap they fill at a worse price, but they fill. Use stop-limits only for entries, where missing the trade is acceptable.",
      },
      {
        kind: "reveal",
        title: "Your turn: the breakout",
        prompt:
          "Plan: buy 30 LABX only if price breaks above the range high, 102.00, with the trigger 0.10 beyond it. Your buy stop waits at 102.10. Where will it fill? Pick, then reveal the next 8 hours.",
        chart: {
          candles: [...S3_RANGE, ...S3_BREAK],
          visible: 14,
          layers: [S3_RANGE_HIGH, { kind: "level", price: 102.1, role: "entry", label: "BUY STOP 30 · 102.10" }],
        },
        choices: [
          {
            id: "trigger",
            label: "At 102.10, its trigger",
            feedback: "Hour 7 opened above 102.10, so nothing traded at the trigger. A triggered stop takes the next price available.",
          },
          { id: "next", label: "At the ask when it triggers, whatever that is", feedback: "Right. Hour 7 opened with the ask at 102.45, and the order filled there." },
          {
            id: "none",
            label: "Not at all, if price jumps past it",
            feedback: "That's the risk of a stop-limit. A stop entry becomes a market order and fills at the next price, here 102.45.",
          },
        ],
        answer: "next",
        after:
          "Hour 7 opened with the mid at 102.40, so the ask was 102.45: slippage of 0.35 per unit, 10.50 on 30 units. A stop-limit capped at 102.30 would have missed this breakout entirely.",
        concept: "stop-entry-order",
      },
    ],
    check: ["q-1.3.3-1", "q-1.3.3-2", "q-1.3.3-3"],
    recap: {
      next: "Next, 1.3.4: brackets and OCO orders, which link a stop and a target so that one cancels the other.",
      takeaways: [
        "A buy stop sits above the price and enters only if price breaks up to it.",
        "A triggered stop fills at market: after a gap, at the open, beyond the trigger.",
        "A stop-limit can stay unfilled in a gap. Protect positions with stop-market orders.",
      ],
    },
  },
};

const L134: Lesson = {
  id: "1.3.4",
  title: "Brackets and OCO orders",
  topic: "order_types",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "A bracket links a stop and a target so one cancels the other; OCO pairs can also enter a breakout in either direction, as long as nothing is left behind.",
  objectives: [
    "Describe the life of a bracket: entry pending, entry filled, stop and target active, one fills, the other is cancelled.",
    "Set up an OCO pair that enters on a break in either direction.",
    "Spot an orphaned order left behind after a manual exit.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
    { kind: "check", ref: "order_types", label: "Order types check" },
  ],
  script: {
    unit: "1.3",
    courseId: "1.3.4",
    bridge: "In 1.3.3 you placed single stop orders, to enter or to exit. Here you link them: a bracket attaches the stop and the target from 1.3.2 to an entry, and when one exit fills, the other is cancelled.",
    hook: {
      prompt: "Your long has a stop at 98.00 and a target at 104.00, set as a bracket. The target fills. Days later, price falls to 98.00. What happens?",
      control: {
        kind: "choice",
        choices: [
          { id: "short", label: "It sells, opening a short" },
          { id: "nothing", label: "Nothing: the stop was cancelled when the target filled" },
          { id: "twice", label: "It closes the long a second time" },
        ],
        answer: "nothing",
      },
      compare: "You said {yours}. In a bracket the other leg is cancelled. Separate orders don't know about each other: a leftover stop would have sold into a short.",
      concept: "oco-order",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[bracket-order]] attaches a stop and a target to an entry (1.3.2). The two exits form an [[oco-order|OCO]] pair, one-cancels-other: when one fills, the other is cancelled automatically. That link is what stops a finished trade from leaving a live order behind.",
      },
      {
        kind: "figure",
        title: "The life of a bracket",
        figure: {
          kind: "flow",
          start: "pending",
          nodes: [
            { id: "pending", text: "Entry pending: the order waits for its price", kind: "pause", next: "filled" },
            { id: "filled", text: "Entry filled: you hold the position", kind: "pause", next: "live" },
            { id: "live", text: "Stop and target active, linked", kind: "pause", next: "first" },
            { id: "first", text: "Target reached before the stop?", kind: "question", yes: "target", no: "stop" },
            { id: "target", text: "Target fills; stop cancelled", kind: "end" },
            { id: "stop", text: "Stop fills; target cancelled", kind: "end" },
          ],
          steps: [
            "The entry waits as a pending order. Nothing else is live yet.",
            "Once it fills, the stop and the target start working, linked.",
            "The first exit to fill closes the trade and cancels the other.",
          ],
        },
        concept: "bracket-order",
      },
      {
        kind: "order",
        prompt: "Your bracket: buy limit at 99.00, stop 98.00, target 102.00. The mid dips to 98.95, then rallies to 102.10. Put the events in order.",
        items: [
          "The buy limit waits at 99.00, pending.",
          "The ask touches 99.00 and the entry fills.",
          "The stop at 98.00 and the target at 102.00 go live.",
          "The bid reaches 102.00 and the target fills.",
          "The stop at 98.00 is cancelled.",
        ],
        explain: "Right. At a mid of 98.95 the ask is 99.00, so the entry fills; at 102.10 the bid is 102.05, past the target. The stop ends with the trade.",
        concept: "bracket-order",
      },
      {
        kind: "explain",
        title: "OCO for entries",
        text: "OCO also works for entries. Put a buy stop above a range and a sell stop below it: whichever side breaks first fills, and the other order is cancelled. Two risks remain. Unlinked, both can fill in a fast whipsaw. And if one leg fills only in part, the other isn't always reduced to match.",
      },
      {
        kind: "predict",
        prompt: "You close a long by hand but leave its separate sell stop at 98.00. Days later price drops through 98.00. What is your position?",
        control: {
          kind: "choice",
          choices: [
            { id: "flat", label: "Flat", feedback: "The stop wasn't linked to the position. It doesn't know you're out, so it sells anyway." },
            { id: "short", label: "Short", feedback: "Right." },
            { id: "long", label: "Long", feedback: "You sold the long by hand. The stop sells again, on top of that." },
          ],
          answer: "short",
        },
        reveal:
          "Short. The leftover stop sold units you no longer held, opening a trade you never decided: an **orphaned order**. In MARKET//LAB a stop and a target belong to the position and close with it. Platforms that accept separate orders don't do that for you.",
        concept: "oco-order",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "After any manual exit, check the order list. A forgotten order is a trade you didn't decide.",
      },
      {
        kind: "match",
        title: "Your turn: build the OCO",
        prompt: "LABX ranges between 99.00 and 101.00. Build an OCO breakout with both protective stops at the middle of the range, 100.00. Match each order to its job.",
        pairs: [
          { left: "Buy stop 101.10", right: "Enters long if the top breaks", wrong: "A buy stop above the range buys only on a break up." },
          { left: "Sell stop 98.90", right: "Enters short if the bottom breaks", wrong: "A sell stop below the range sells only on a break down." },
          { left: "Sell stop 100.00", right: "The long's stop, below its entry", wrong: "The long enters at 101.10. Its stop has to sell, below that entry." },
          { left: "Buy stop 100.00", right: "The short's stop, above its entry", wrong: "A short is closed by buying. Its stop sits above the 98.90 entry." },
        ],
        columns: ["Order", "Job"],
        correct: "That's the OCO: two entries linked, each with its own stop, 1.10 away on either side.",
        concept: "oco-order",
      },
      {
        kind: "reveal",
        title: "Your turn: the break",
        prompt: "Your OCO is live: buy stop 101.10 and sell stop 98.90, linked. Reveal the next 8 hours. What happens to the sell stop?",
        chart: {
          candles: [...S4_RANGE, ...S4_BREAK],
          visible: 12,
          layers: [
            { kind: "zone", from: 99.0, to: 101.0, role: "neutral", label: "RANGE" },
            { kind: "level", price: 101.1, role: "entry", label: "BUY STOP 101.10" },
            { kind: "level", price: 98.9, role: "entry", label: "SELL STOP 98.90" },
          ],
        },
        choices: [
          { id: "cancel", label: "It's cancelled when the buy stop fills", feedback: "Right. The link removed it the moment the long began." },
          { id: "fills", label: "It fills too if price later drops to 98.90", feedback: "Only if the two weren't linked. In an OCO pair, the first fill cancels the other order." },
          { id: "becomes", label: "It becomes the long's stop", feedback: "The long has its own stop at 100.00. The sell stop at 98.90 was an entry, and it's cancelled." },
        ],
        answer: "cancel",
        after:
          "In hour 2 the ask reached 101.10 and the buy stop filled there. At that moment the sell stop at 98.90 was cancelled. Unlinked, it would still be waiting below: a live order for a trade the plan no longer wants.",
        concept: "oco-order",
      },
    ],
    check: ["q-1.3.4-1", "q-1.3.4-2", "q-1.3.4-3"],
    recap: {
      next: "Next, 1.3.5: time in force, how long each of these orders stays alive once you place it.",
      takeaways: [
        "A bracket's life: pending entry, fill, stop and target live, one exits, the other is cancelled.",
        "An OCO pair can enter a breakout either way: when one leg fills, the other is cancelled.",
        "After a manual exit, cancel leftover orders. An orphaned stop can open a trade you never chose.",
      ],
    },
  },
};

const L135: Lesson = {
  id: "1.3.5",
  title: "Time in force",
  topic: "order_types",
  level: "beginner",
  tier: "free",
  minutes: 5,
  summary: "Time in force sets how long an order lives, from a single session to until you cancel it, or only for an instant.",
  objectives: [
    "Choose between day, good-till-cancelled and good-till-date for a resting order.",
    "Predict what IOC and FOK do with an order larger than what's available.",
    "Explain the risk of a forgotten good-till-cancelled order.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "order_types", label: "Order types check" },
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
  ],
  script: {
    unit: "1.3",
    courseId: "1.3.5",
    bridge: "In 1.3.4 a linked order cancelled itself, but a leftover order lived on and opened a trade you never chose. Here you decide how long every order lives: one session, until a date, until cancelled, or only an instant.",
    hook: {
      prompt: "Three weeks ago you left a buy limit at 95.00, good till cancelled, and forgot it. Today LABX gaps from 97.00 to 94.50 on bad news. What happens?",
      control: {
        kind: "choice",
        choices: [
          { id: "expired", label: "Nothing: it expired" },
          { id: "open", label: "It fills at 94.55" },
          { id: "limit", label: "It fills at 95.00" },
        ],
        answer: "open",
      },
      compare: "You said {yours}. A GTC order waits until it fills or you cancel it. It filled at 94.55, the ask at the open, buying a position you no longer planned.",
      concept: "time-in-force",
    },
    learn: [
      {
        kind: "explain",
        text: "[[time-in-force|Time in force]] (TIF) says how long an order lives. A [[day-order|Day]] order expires when the session ends. [[gtc|GTC]] stays until you cancel it, though some brokers cancel it after a set period. GTD lasts until a date you choose. [[ioc|IOC]] fills what it can now and cancels the rest. [[fok|FOK]] fills the whole order now, or nothing.",
      },
      {
        kind: "match",
        prompt: "Sort the five settings: which ones rest and wait, and which act only now?",
        pairs: [
          { left: "Day", right: "Rests and waits", wrong: "A Day order rests in the book until it fills or the session ends." },
          { left: "GTC", right: "Rests and waits", wrong: "GTC rests in the book until it fills or you cancel it, even for weeks." },
          { left: "GTD", right: "Rests and waits", wrong: "GTD rests in the book until it fills or its date arrives." },
          { left: "IOC", right: "Acts now, then cancels", wrong: "IOC never rests: what can't fill at once is cancelled." },
          { left: "FOK", right: "Acts now, then cancels", wrong: "FOK never rests: all of it fills at once, or none of it does." },
        ],
        columns: ["Time in force", "What it does"],
        correct: "Day, GTC and GTD rest in the book until they fill or expire. IOC and FOK act at once and never wait.",
        concept: "time-in-force",
      },
      {
        kind: "worked",
        title: "IOC",
        lines: ["Buy 500 at a limit of 100.05, IOC.", "Only 320 are offered at 100.05 or better.", "Filled now: 320.", "Cancelled = ?"],
        ask: {
          answer: 180,
          tolerance: 0,
          unit: "units",
          feedback: [
            { value: 0, text: "IOC doesn't wait for the rest: what can't fill now is cancelled. 500 − 320." },
            { value: 500, text: "320 did fill. Only the part that couldn't fill now is cancelled." },
          ],
          correct: "Right: 180 units cancelled, 320 bought.",
        },
        after: "With FOK, nothing would fill: 320 is less than the 500 ordered, so the whole order is cancelled.",
        concept: "time-in-force",
      },
      {
        kind: "explain",
        title: "In MARKET//LAB",
        text: "Here a [[pending-order]] stays until it fills or you cancel it, and you can hold at most five. Day orders need a session clock, which comes later in the course.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Every resting order is a decision that will execute later without you. Review your open orders at the start of each session.",
      },
      {
        kind: "match",
        title: "Your turn: set the time in force",
        prompt: "Give each order the time in force its plan needs.",
        pairs: [
          { left: "Buy on a dip to 99.00, today only", right: "Day", wrong: "'Today only' means the order should die with the session: a Day order." },
          { left: "Take profit at 104.00 whenever it comes", right: "GTC", wrong: "'Whenever it comes' means it waits until it fills or you cancel it: GTC." },
          { left: "Buy 200 at 100.05 right now, only what's available", right: "IOC", wrong: "Take what's there now and drop the rest: IOC." },
          { left: "Buy all 500 at 100.05 now, or none", right: "FOK", wrong: "All now or nothing at all: FOK." },
          { left: "Sell at 103.00 any time before Friday's close", right: "GTD", wrong: "A fixed end date: good till date." },
        ],
        columns: ["Plan", "Time in force"],
        correct: "Each plan now says how long its order should live. Write it down with the order, not after.",
        concept: "time-in-force",
      },
      {
        kind: "reveal",
        title: "The forgotten GTC",
        prompt: "On Monday you left a GTC buy limit for 50 units at 98.00, then stopped watching. Reveal the next three days, in 4-hour candles. What happened to the order?",
        chart: {
          candles: [...S5_BEFORE, ...S5_DAYS],
          visible: 8,
          layers: [{ kind: "level", price: 98.0, role: "entry", label: "GTC BUY LIMIT 98.00" }],
        },
        choices: [
          { id: "never", label: "It never filled", feedback: "On day 3 the ask fell to 97.81, below the limit. The GTC order was still there, so it filled." },
          { id: "filled", label: "It filled at 98.00 on day 3", feedback: "Right." },
          { id: "low", label: "It filled at 97.76, the low", feedback: "A buy limit fills at its price when the ask crosses it. That candle opened above 98.00, so it filled at 98.00." },
        ],
        answer: "filled",
        after:
          "On day 3 the ask fell through 98.00 and the forgotten order bought 50 units there. Price kept falling, to 96.40, with no stop attached and no plan for the position.",
        concept: "time-in-force",
      },
    ],
    check: ["q-1.3.5-1", "q-1.3.5-2", "q-1.3.5-3"],
    recap: {
      next: "Next, 1.3.6: fills, partial fills and the queue, and why price touching your level isn't a fill.",
      takeaways: [
        "Day expires with the session, GTC waits until cancelled, GTD until a date.",
        "IOC fills what's there now and cancels the rest; FOK fills all now or nothing.",
        "A forgotten GTC order still fills, even in a gap. Review open orders every session.",
      ],
    },
  },
};

const L136: Lesson = {
  id: "1.3.6",
  title: "Fills, partial fills and the queue",
  topic: "order_types",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Orders in a book fill by price, then by time, so touching your price isn't a fill, and a large order walks the book to a worse average price.",
  objectives: [
    "Explain price-time priority in an order book.",
    "Predict whether a resting limit order fills when price only touches its level.",
    "Calculate the average price of an order filled across several price levels.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "order_types", label: "Order types check" },
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
  ],
  script: {
    unit: "1.3",
    courseId: "1.3.6",
    bridge: "In 1.3.5 an IOC order filled 320 of 500 units and cancelled the rest. Here you see why: the order book queues orders by price, then by time, and a large order walks through several prices to fill.",
    hook: {
      prompt: "Your buy limit sits at 99.00 with 300 units queued ahead of you. Sellers trade 200 units at 99.00, then price rises. Were you filled?",
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "partly", label: "Partly" },
        ],
        answer: "no",
      },
      compare: "You said {yours}. 300 units were ahead of you and only 200 traded at 99.00: 100 were still in front when price left.",
      concept: "order-queue",
    },
    learn: [
      {
        kind: "explain",
        text: "An [[order-book]] holds a queue of [[limit-order|limit orders]] at each price. [[queue-priority|Queue priority]] decides who fills: the best price first, then, at the same price, the oldest order. A new order joins the back of the queue at its price.",
      },
      {
        kind: "figure",
        title: "The book near the price",
        text: "Units waiting at each price: the [[market-depth]].",
        figure: {
          kind: "bars",
          bars: [
            { label: "Ask 100.15", value: 300, role: "neutral" },
            { label: "Ask 100.10", value: 100, role: "neutral" },
            { label: "Ask 100.05", value: 100, role: "neutral" },
            { label: "Bid 99.95", value: 150, role: "accent" },
            { label: "Bid 99.90", value: 200, role: "accent" },
            { label: "Bid 99.85", value: 400, role: "accent" },
          ],
          unit: " units",
          steps: [
            "Sellers wait on the asks: 100 at 100.05, 100 at 100.10, 300 at 100.15.",
            "Buyers wait on the bids. Join at 99.90 and the 200 units already there are ahead of you.",
          ],
        },
        concept: "order-queue",
      },
      {
        kind: "predict",
        prompt: "Your buy limit for 100 units joins at 99.90, behind the 200 units already there. Sellers then sell 250 units at 99.90 and price bounces. How many of your units fill?",
        control: {
          kind: "numeric",
          unit: "units",
          answer: 50,
          tolerance: 0,
          feedback: [
            { value: 100, text: "The first 200 units sold at 99.90 go to the orders ahead of you. Only 50 are left for yours." },
            { value: 0, text: "250 units traded, 50 more than the 200 ahead of you. Those 50 reach your order." },
            { value: 250, text: "Your order is only 100 units, and 200 of the 250 go to the orders ahead." },
          ],
        },
        reveal: "200 go to the orders ahead of you, 50 to yours: a [[partial-fill]]. Your other 50 units keep waiting at the front of the queue.",
        concept: "order-queue",
      },
      {
        kind: "worked",
        title: "Walking the book",
        lines: [
          "A market buy of 300 units arrives at the book above.",
          "It takes 100 at 100.05, 100 at 100.10 and 100 at 100.15.",
          "Cost: 10,005.00 + 10,010.00 + 10,015.00 = 30,030.00.",
          "Average fill price = 30,030.00 ÷ 300 = ?",
        ],
        ask: {
          answer: 100.1,
          tolerance: 0.005,
          feedback: [
            { value: 100.05, text: "That's only the best ask. A 300-unit order uses up three levels." },
            { value: 100.15, text: "That's the last price it reached. Average over all 300 units." },
          ],
          correct: "Right: 100.10, 0.05 a unit worse than the best ask on the screen.",
        },
        after: "That's the [[average-fill-price]]. The bigger the order against the depth, the further it walks and the worse the average.",
        concept: "order-queue",
      },
      {
        kind: "explain",
        title: "Partial fills",
        text: "Fills can come in parts. A limit can [[partial-fill|fill partly]] while the rest waits; an [[ioc|IOC]] order cancels the rest instead (1.3.5). LABX keeps it simple: each order fills in full at one price, with no queue and no depth. Unit 3.2 returns to the book in detail.",
      },
      {
        kind: "predict",
        prompt: "Price touched your buy limit's level on the chart. Are you filled?",
        control: {
          kind: "choice",
          choices: [
            { id: "always", label: "Always", feedback: "A touch is not a fill. The ask has to reach your price, and in a real book the queue ahead of you has to trade first." },
            { id: "maybe", label: "Not necessarily", feedback: "Right." },
          ],
          answer: "maybe",
        },
        reveal: "In LABX the ask, not the chart's mid, must reach your buy limit (1.3.1). In a real book, the orders queued ahead of you at that price must also trade before yours.",
        concept: "order-queue",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A price on the chart isn't a promise of a fill. Your size and the queue decide what you get.",
      },
      {
        kind: "worked",
        title: "Your turn: a bigger order",
        lines: ["A market buy of 500 units arrives at the same book.", "It takes 100 at 100.05, 100 at 100.10 and the last 300 at 100.15.", "Average fill price = ?"],
        ask: {
          answer: 100.12,
          tolerance: 0.005,
          feedback: [
            { value: 100.1, text: "That's the plain average of the three prices. Weight each price by its units: 300 of the 500 paid 100.15." },
            { value: 100.15, text: "Only 300 units paid 100.15; the other 200 paid less." },
            { value: 100.05, text: "Only the first 100 units got the best ask." },
          ],
          correct: "Right: 50,060.00 ÷ 500 = 100.12.",
        },
        after: "Before a large order, check the depth. Here 500 units paid 0.07 a unit more than the best ask, 35.00 in all.",
        concept: "order-queue",
      },
    ],
    check: ["q-1.3.6-1", "q-1.3.6-2", "q-1.3.6-3"],
    recap: {
      next: "Next, 1.3.7: slippage and gaps, when the fill you get lands far from the one you planned.",
      takeaways: [
        "Books fill by price, then time: the best price first, then the oldest order.",
        "Touching your price isn't a fill. The queue ahead of you must trade first.",
        "A big market order walks the book: average fill price = total cost ÷ units.",
      ],
    },
  },
};

const L137: Lesson = {
  id: "1.3.7",
  title: "Slippage and gaps",
  topic: "order_types",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Slippage is the distance between the fill you expected and the one you got; a gap through a stop turns 1R into more, and the size decides how much more.",
  objectives: [
    "Measure slippage as the difference between the expected and the actual fill.",
    "Express a gap-through-stop loss in R.",
    "Size a position so that a plausible gap is still survivable.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
  ],
  script: {
    unit: "1.3",
    courseId: "1.3.7",
    bridge: "In 1.3.6 a large order walked the book to a worse average price. The distance between the fill you expect and the one you get is slippage. Here you measure it, and what a gap through your 1.3.2 stop does to the planned loss.",
    hook: {
      prompt: "Long 50 at 100.00 with a stop at 98.00: 100.00 at risk, 1R, before costs. The market gaps and the stop fills at 97.00. What's the result in R?",
      control: {
        kind: "choice",
        choices: [
          { id: "1", label: "−1R" },
          { id: "1.5", label: "−1.5R" },
          { id: "3", label: "−3R" },
        ],
        answer: "1.5",
      },
      compare: "You said {yours}. The loss was 50 × 3.00 = 150.00, one and a half times the 100.00 you planned: −1.5R.",
      concept: "gap-risk",
    },
    learn: [
      {
        kind: "explain",
        text: "[[slippage|Slippage]] is the difference between the fill you expected and the fill you got. Say what you measure from: the price when you decided, or a stop's trigger. It's usually against you, but not always: a limit that price gaps through fills at a better price.",
      },
      {
        kind: "figure",
        title: "Three cases",
        text: "Slippage on 100 units, in vUSD.",
        figure: {
          kind: "bars",
          bars: [
            { label: "Market buy, fast candle", value: -20, role: "down" },
            { label: "Sell stop, gap", value: -100, role: "down" },
            { label: "Buy limit, gap", value: 45, role: "up" },
          ],
          unit: " vUSD",
          steps: [
            "In a fast real market, a buy decided at an ask of 100.05 fills at 100.25: 0.20 worse.",
            "A sell stop at 98.00 fills at a 97.00 open: 1.00 worse per unit.",
            "A buy limit at 95.00 gapped through fills at 94.55: 0.45 better. A limit can also miss.",
          ],
        },
        concept: "slippage",
      },
      {
        kind: "worked",
        title: "A gap through the stop, in R",
        lines: ["Planned: 50 × 2.00 = 100.00 at risk, or 1R.", "Filled at 97.00: 50 × 3.00 = 150.00.", "In R: 150.00 ÷ 100.00 = ?"],
        ask: {
          answer: 1.5,
          tolerance: 0.005,
          unit: "R",
          feedback: [
            { value: 3, text: "That's the gap from entry per unit. Divide the loss, 150.00, by the planned 100.00." },
            { value: 150, text: "That's the loss in vUSD. Express it in units of the planned risk, 100.00." },
            { value: 0.5, text: "That's only the extra. The whole loss is 1.5 times the plan." },
          ],
          correct: "Right: −1.5R, where the plan said −1R.",
        },
        after: "In R, a gap shows how far the plan broke, not just how much money it cost.",
        concept: "gap-risk",
      },
      {
        kind: "predict",
        title: "Same R, different gap",
        prompt:
          "Trade A: 50 units, stop 2.00 away. Trade B: 200 units, stop 0.50 away. Both risk 100.00. A gap opens 3.00 below both entries. Which loses more?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "A", feedback: "A's far stop means fewer units: 50 × 3.00 = 150.00. B holds four times as many." },
            { id: "b", label: "B", feedback: "Right." },
            { id: "same", label: "The same", feedback: "Same planned R, different size. In a gap every unit loses the full 3.00." },
          ],
          answer: "b",
        },
        reveal: "B loses 200 × 3.00 = 600.00, −6R. A loses 50 × 3.00 = 150.00, −1.5R. A gap loss follows the position size, not the R. Unit 1.4 comes back to this.",
        concept: "gap-risk",
      },
      {
        kind: "explain",
        text: "Some CFD brokers sell a [[guaranteed-stop]]: they promise your stop price even through a gap, for a premium. Without one, no stop is a guarantee. A [[stop-limit-order|stop-limit]] is the opposite of one: in a gap it may not fill at all (1.3.3).",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "A stop limits the loss you plan for, not the worst case. Size so that a plausible gap is still survivable.",
      },
    ],
    task: {
      widget: "position-size",
      goal: "Long at 100.00, stop 99.00. The widget treats the worst case, a gap fill at 97.00, as its stop, with a 200.00 budget. Type the most units that lose no more than 200.00 there.",
      start: { account: 10000, riskPct: 2, entry: 100, stop: 97, units: 66 },
      locked: ["account", "riskPct", "entry", "stop"],
      hidden: ["simpleQty", "qty"],
      success: { all: [{ field: "units", eq: 64 }, { field: "stop", eq: 97 }, { field: "riskPct", eq: 2 }] },
      feedback: [
        { when: { field: "units", eq: 66 }, text: "66 units lose 198.00 on price alone. The two commissions add 6.51: 204.51, over 200.00." },
        { when: { field: "units", eq: 65 }, text: "65 units lose 201.41 with both commissions, just over 200.00." },
        { when: { field: "units", gt: 66 }, text: "{units} units would lose {lossAtStop:2} if LABX opened at 97.00, over 200.00." },
        { when: { field: "units", lt: 64 }, text: "{units} units fit, but one more unit would still fit. Find the most that does." },
      ],
      correct: "Right. 64 units lose 198.31 in that gap. At your real stop, 99.00, they lose 70.37: under 1% of the account.",
      hints: [
        "The gap loss is units × (100.00 − 97.00), plus both commissions.",
        "Without commissions, 66 units lose 198.00. The commissions push that over 200.00.",
        "Step down one unit at a time until the loss fits within 200.00.",
      ],
      showMe: { units: 64 },
      concept: "gap-risk",
    },
    check: ["q-1.3.7-1", "q-1.3.7-2", "q-1.3.7-3"],
    recap: {
      next: "Next, 1.3.8: trailing stops, which move the stop as price moves your way, and never back.",
      takeaways: [
        "Slippage = expected fill − actual fill. Name your reference: decision price or trigger.",
        "Measure a gap loss in R: actual loss ÷ planned risk. 150.00 ÷ 100.00 = −1.5R.",
        "Size for the plausible gap too: tight stops allow more units, and a gap hits every one.",
      ],
    },
  },
};

const L138: Lesson = {
  id: "1.3.8",
  title: "Trailing stops",
  topic: "stop_loss",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "A trailing stop follows price in your favour by a rule set before entry and never moves back; how tight it sits decides whether noise or the trend ends the trade.",
  objectives: [
    "Move a stop only in the direction that reduces risk.",
    "Compare a tight trail, a wide trail and a structure trail on the same price path.",
    "Explain why a trail tighter than a normal candle tends to exit on noise.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
  ],
  script: {
    unit: "1.3",
    courseId: "1.3.8",
    bridge: "In 1.3.2 you set a stop once, and in 1.3.7 a gap pushed its fill past it. Here the stop moves: it follows price in your favour by a rule fixed before entry, sized against the normal candle from 1.2.5.",
    hook: {
      prompt: "Long from 100.00, stop at 98.00. Price has climbed to 104.00, making higher lows along the way. Where should the stop be now?",
      control: {
        kind: "choice",
        choices: [
          { id: "same", label: "Still at 98.00" },
          { id: "under-low", label: "Below the last higher low" },
          { id: "lower", label: "Lower, to give it room", feedback: "A stop never moves further away. That only raises the risk you agreed to." },
        ],
      },
      figure: {
        kind: "chart",
        chart: { candles: S8_PATH, visible: 25, layers: [S8_ENTRY, { kind: "level", price: 98.0, role: "stop", label: "STOP 98.00" }, ...S8_LOWS] },
        steps: [{ text: "Long from 100.00, stop 98.00. Three higher lows so far; price now 104.00." }],
      },
      compare: "You chose {yours}. A trail moves the stop up under the higher lows, never down. Just under 102.90 it locks in a gain.",
      concept: "trailing-stop",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[trailing-stop]] follows price in the trade's favour and never moves back. For a long, you raise the stop as price makes progress, by a rule fixed before entry: a set distance under the highest price, or just under each new higher low. It cuts the risk first, then locks in part of the gain.",
      },
      {
        kind: "predict",
        title: "One path, three trails",
        prompt:
          "The same long from 100.00, three trail rules. **Tight**: 0.50 under the highest price. **Wide**: 1.50 under it. **Structure**: 0.20 under each new higher low. Which trail kept the most on this path?",
        control: {
          kind: "choice",
          choices: [
            { id: "tight", label: "Tight", feedback: "The first pullback, to 100.70, reached the tight trail: +0.70 per unit." },
            { id: "wide", label: "Wide", feedback: "Right: it sat through every pullback and exited at 103.10, +3.10 per unit." },
            { id: "structure", label: "Structure", feedback: "Close: out at 102.70, +2.70. The wide trail sat 0.40 higher at the end." },
          ],
          answer: "wide",
        },
        figure: {
          kind: "chart",
          chart: { candles: S8_PATH, layers: [S8_ENTRY, ...S8_LOWS] },
          steps: [
            {
              text: "Tight trail, 0.50 under the high: hit at 100.70 on the first pullback. +0.70 per unit.",
              layers: [S8_TIGHT, { kind: "marker", index: 8, price: 100.7, label: "OUT 100.70", role: "down" }],
            },
            {
              text: "Wide trail, 1.50 under the high: hit at 103.10 in the final drop. +3.10 per unit.",
              layers: [S8_WIDE, { kind: "marker", index: 27, price: 103.1, label: "OUT 103.10", role: "down" }],
            },
            {
              text: "Structure trail, 0.20 under each higher low: hit at 102.70. +2.70 per unit.",
              layers: [S8_STRUCTURE, { kind: "marker", index: 28, price: 102.7, label: "OUT 102.70", role: "down" }],
            },
          ],
        },
        reveal:
          "Wide kept the most here. Had price reversed for good right after 101.20, the tight trail would have won: +0.70, against −0.30 for the wide one. No trail wins on every path.",
        concept: "trailing-stop",
      },
      {
        kind: "explain",
        title: "Size the trail against a normal candle",
        text: "On this chart a normal candle spans about 0.60. The 0.50 trail sat inside that ordinary noise, so the first small pullback closed the trade while the trend went on. A trail tighter than about one normal candle (1.2.5) tends to exit on noise, not on a change of trend.",
      },
      {
        kind: "explain",
        title: "In MARKET//LAB",
        text: "Here you trail by moving the stop yourself. Moving it closer to price is fine. Moving it further away counts against your Risk Discipline as a widened stop. There's no automatic trailing order yet.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A trail is a rule you decide before entry, like the stop itself. Moving the stop on a feeling is a discretionary exit, not a trail.",
      },
      {
        kind: "predict",
        title: "Your turn: the second higher low",
        prompt:
          "Your rule: after each higher low, the stop goes 0.10 to 0.40 under it, never down. A new long from 100.00 made a higher low at 100.40, so your stop moved to 100.20. Now another formed at 101.30. Set the stop.",
        control: {
          kind: "slider",
          min: 99.8,
          max: 101.4,
          step: 0.05,
          start: 100.2,
          answer: 101.05,
          tolerance: 0.15,
          feedback: [
            { from: 99.8, to: 100.15, text: "That's below your current stop, 100.20: further from price. A trailing stop never moves away." },
            { from: 100.2, to: 100.85, text: "Allowed, but more than 0.40 under the higher low. Your rule keeps it 0.10 to 0.40 under 101.30." },
            { from: 100.9, to: 101.2, text: "Inside the rule: 0.10 to 0.40 under the new higher low." },
            { from: 101.25, to: 101.4, text: "Less than 0.10 under the higher low. A normal dip back to 101.30 would close the trade." },
          ],
        },
        figure: {
          kind: "chart",
          chart: {
            candles: S8_TRY,
            visible: 13,
            layers: [
              S8_TRY_ENTRY,
              {
                kind: "path",
                role: "down",
                label: "YOUR STOP",
                points: [
                  { index: 2.5, price: 99.0 },
                  { index: 7.5, price: 99.0 },
                  { index: 7.5, price: 100.2 },
                  { index: 12.5, price: 100.2 },
                ],
              },
              { kind: "marker", index: 6, at: "low", label: "HL 100.40", role: "accent" },
              { kind: "marker", index: 11, at: "low", label: "HL 101.30", role: "accent" },
            ],
          },
          steps: [
            {
              text: "The rule's zone: 0.10 to 0.40 under 101.30, from 100.90 to 101.20.",
              layers: [{ kind: "zone", from: 100.9, to: 101.2, role: "stop", label: "NEW STOP ZONE" }],
            },
            { text: "Price kept climbing. No bid came back down to 101.20.", visible: 18 },
          ],
        },
        reveal: "A stop from 100.90 to 101.20 now locks in at least 0.90 per unit, before costs.",
        concept: "trailing-stop",
      },
      {
        kind: "predict",
        title: "Your turn: the third higher low",
        prompt: "Your stop is at 101.10. Price made a new higher low at 102.20 and turned up again. Set the stop by the same rule.",
        control: {
          kind: "slider",
          min: 100.8,
          max: 102.4,
          step: 0.05,
          start: 101.1,
          answer: 101.95,
          tolerance: 0.15,
          feedback: [
            { from: 100.8, to: 101.05, text: "That's below your current stop, 101.10. A trailing stop never moves further away." },
            { from: 101.1, to: 101.75, text: "Allowed, but more than 0.40 under the higher low. Your rule keeps it 0.10 to 0.40 under 102.20." },
            { from: 101.8, to: 102.1, text: "Inside the rule: 0.10 to 0.40 under the new higher low." },
            { from: 102.15, to: 102.4, text: "Less than 0.10 under the higher low. A normal dip back to 102.20 would close the trade." },
          ],
        },
        figure: {
          kind: "chart",
          chart: {
            candles: S8_TRY,
            visible: 18,
            layers: [
              S8_TRY_ENTRY,
              {
                kind: "path",
                role: "down",
                label: "YOUR STOP",
                points: [
                  { index: 2.5, price: 99.0 },
                  { index: 7.5, price: 99.0 },
                  { index: 7.5, price: 100.2 },
                  { index: 12.5, price: 100.2 },
                  { index: 12.5, price: 101.1 },
                  { index: 17.5, price: 101.1 },
                ],
              },
              { kind: "marker", index: 16, at: "low", label: "HL 102.20", role: "accent" },
            ],
          },
          steps: [
            {
              text: "The rule's zone: 0.10 to 0.40 under 102.20, from 101.80 to 102.10.",
              layers: [{ kind: "zone", from: 101.8, to: 102.1, role: "stop", label: "NEW STOP ZONE" }],
            },
            { text: "Price went on to 103.40 without coming back to the zone.", visible: 20 },
          ],
        },
        reveal: "Three steps up, never one down. A stop from 101.80 to 102.10 locks in at least 1.80 per unit, before costs.",
        concept: "trailing-stop",
      },
    ],
    check: ["q-1.3.8-1", "q-1.3.8-2", "q-1.3.8-3"],
    recap: {
      next: "Next, the Unit 1.3 checkpoint. Then Unit 1.4, Risk comes first: how much each of these stops may cost you.",
      takeaways: [
        "Move a stop only towards price: up for a long, never further away.",
        "No trail wins on every path: tight keeps more on quick reversals, wide on long trends.",
        "A trail tighter than a normal candle tends to exit on noise. Measure it first.",
      ],
    },
  },
};

// ─── Check questions ────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 1.3.3 · Stop entries and stop-limit orders
  {
    id: "q-1.3.3-1",
    topic: "order_types",
    kind: "mcq",
    difficulty: 1,
    prompt: "LABX trades at 100.00, under resistance at 101.00. You want to buy only if price breaks above it. Which order fits?",
    options: [
      { id: "a", label: "A buy limit at 101.10", rationale: "A buy limit above the ask fills at once, at the ask, about 100.05. You'd be in before any break." },
      { id: "b", label: "A buy stop at 101.10" },
      { id: "c", label: "A sell stop at 101.10", rationale: "A sell stop sells, and it sits below the price. A breakout entry to buy needs a buy stop." },
      { id: "d", label: "A buy limit at 99.90", rationale: "That buys a dip below the price, the opposite of buying a break above resistance." },
    ],
    correct: "b",
    explanation:
      "A buy stop waits above the price and becomes a market order only when the ask reaches 101.10, so you buy only after the break. A buy limit above the ask fills immediately, inside the range.",
    lesson: "1.3.3",
    concepts: ["stop-entry-order"],
  },
  {
    id: "q-1.3.3-2",
    topic: "order_types",
    kind: "numeric",
    difficulty: 2,
    prompt: "Your buy stop for 40 units sits at 105.20. The next candle opens with the mid at 105.65. Ignoring commission, how much does the slippage cost you, in vUSD?",
    numeric: { answer: 20, tolerance: 0.01, unit: "vUSD" },
    explanation:
      "Price gapped over the trigger, so the stop filled at the open's ask, 105.70: 0.50 above 105.20 per unit. 40 × 0.50 = 20.00. Measuring from the mid gives 18.00 and leaves out the half-spread.",
    lesson: "1.3.3",
    concepts: ["stop-entry-order", "slippage"],
    hints: [
      "A buy fills at the ask: the mid plus 0.05.",
      "After a gap the stop fills at the open's ask, not at the trigger. Slippage = fill − trigger.",
      "Ask 105.70 − trigger 105.20 = 0.50 per unit. Multiply by 40.",
    ],
    vary: {
      fields: { units: [10, 60, 5], trig: [60, 120, 0.1], gap: [0.1, 1.2, 0.05] },
      answer: "round(units * (gap + 0.05), 2)",
      prompt: "Your buy stop for {units} units sits at {trig:2}. The next candle opens with the mid at {trig + gap:2}. Ignoring commission, how much does the slippage cost you, in vUSD?",
      explanation:
        "Price gapped over the trigger, so the stop filled at the open's ask, {trig + gap + 0.05:2}: {gap + 0.05:2} above {trig:2} per unit. {units} × {gap + 0.05:2} = {answer:2}.",
      hint: "Ask {trig + gap + 0.05:2} − trigger {trig:2} = {gap + 0.05:2} per unit. Multiply by {units}.",
    },
  },
  {
    id: "q-1.3.3-3",
    topic: "order_types",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "You're long 50 LABX from 100.00. To avoid a bad fill, you protect it with a sell stop-limit: trigger 98.00, limit 97.90. After bad news, the next candle opens with the bid at 96.80 and keeps falling.",
    prompt: "What is your position once the market opens?",
    options: [
      { id: "a", label: "Flat: sold at 97.90, the limit", rationale: "A sell limit sells only at 97.90 or higher. The bid opened at 96.80, below it, so nothing sold." },
      { id: "b", label: "Flat: sold at 96.80, the open", rationale: "That's what a stop-market order would do. The limit forbids any sale below 97.90." },
      { id: "c", label: "Flat: sold at 98.00, the trigger", rationale: "Nothing traded at 98.00: the market opened below it. The trigger only turned the order into a limit." },
      { id: "d", label: "Still long 50, with the loss growing" },
    ],
    correct: "d",
    explanation:
      "The trigger fired and turned the order into a sell limit at 97.90. With the bid at 96.80 and falling, that limit can't fill, so the position stays open without protection. A protective stop should be a stop-market order: it fills worse in a gap, but it fills.",
    lesson: "1.3.3",
    concepts: ["stop-limit-order", "gap-risk"],
    hints: ["Once triggered, a stop-limit becomes a limit order.", "A sell limit at 97.90 can only sell at 97.90 or higher. Where is the bid?"],
  },

  // 1.3.4 · Brackets and OCO orders
  {
    id: "q-1.3.4-1",
    topic: "order_types",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does an OCO order pair do?",
    options: [
      { id: "a", label: "Both orders fill together, at the same price", rationale: "OCO means one cancels the other. Two orders filling at once is exactly what the link prevents." },
      { id: "b", label: "The second order is placed only after the first one fills", rationale: "That describes a sequence, like a bracket's exits waiting for the entry. OCO links two orders that are live at the same time." },
      { id: "c", label: "When one order fills, the other is cancelled automatically" },
      { id: "d", label: "Both orders stay active until you cancel them by hand", rationale: "That's two separate orders. The point of OCO is that a fill cancels the other order for you." },
    ],
    correct: "c",
    explanation: "One-cancels-other links two live orders. The first to fill cancels the other, as with a bracket's stop and target, or a buy stop and a sell stop either side of a range.",
    lesson: "1.3.4",
    concepts: ["oco-order"],
  },
  {
    id: "q-1.3.4-2",
    topic: "order_types",
    kind: "scenario",
    difficulty: 2,
    scenario: "You bought 40 LABX at 100.00 with a bracket: stop 98.00, target 104.00. The target fills. An hour later LABX drops to 97.50.",
    prompt: "Where do you stand?",
    options: [
      { id: "a", label: "Short 40, because the stop sold at 98.00", rationale: "In a bracket the stop was cancelled when the target filled. Only an unlinked order would sell again." },
      { id: "b", label: "Flat, with +160.00 before costs" },
      { id: "c", label: "Flat, with +160.00 from the target and −80.00 from the stop", rationale: "The stop never filled. Once the target closed the trade, it was cancelled, with nothing left to protect." },
      { id: "d", label: "Long 40 again, bought back at 97.50", rationale: "Exits don't re-enter. With the target filled, the trade is over and no order is working." },
    ],
    correct: "b",
    explanation:
      "40 × (104.00 − 100.00) = 160.00 before costs. When the target filled, the bracket cancelled the stop, so the drop to 97.50 doesn't touch you.",
    lesson: "1.3.4",
    concepts: ["bracket-order", "oco-order"],
    hints: ["In a bracket, the exits are linked as one-cancels-other.", "The target closed the trade. What happened to the stop at that moment?"],
  },
  {
    id: "q-1.3.4-3",
    topic: "order_types",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "On a platform that allows short selling, you bought 30 units with a separate sell stop at 97.00, not a bracket. At 101.50 you close the position by hand and forget the stop. A week later LABX falls through 97.00 to 96.00.",
    prompt: "What is your position now?",
    options: [
      { id: "a", label: "Short 30, sold near 97.00" },
      { id: "b", label: "Flat: the stop had nothing left to close", rationale: "A separate stop doesn't know the position is gone. When triggered, it sells 30 units you no longer hold." },
      { id: "c", label: "Long 30", rationale: "You closed the long by hand, and nothing bought it back. The stop could only sell." },
      { id: "d", label: "Short 60", rationale: "The stop was for 30 units, so it sells 30. Your manual exit already sold the original 30." },
    ],
    correct: "a",
    explanation:
      "The manual exit closed the long, but the separate stop stayed live. When the bid reached 97.00 it sold 30 units, opening a short you never decided on: an orphaned order. Check the order list after every manual exit.",
    lesson: "1.3.4",
    concepts: ["oco-order"],
    hints: ["Was the stop linked to the position, or a separate order?", "A separate sell stop sells when triggered, whether or not you still hold the units."],
  },

  // 1.3.5 · Time in force
  {
    id: "q-1.3.5-1",
    topic: "order_types",
    kind: "mcq",
    difficulty: 1,
    prompt: "You want a buy limit to cancel itself if it hasn't filled by the end of today's session. Which time in force?",
    options: [
      { id: "a", label: "GTC", rationale: "Good till cancelled stays active session after session, until it fills or you cancel it." },
      { id: "b", label: "Day" },
      { id: "c", label: "IOC", rationale: "Immediate or cancel fills what it can at once and cancels the rest right away, not at the session's end." },
      { id: "d", label: "FOK", rationale: "Fill or kill needs the whole order at once, or cancels it at once. It doesn't wait for the day." },
    ],
    correct: "b",
    explanation: "A Day order rests in the book for the session and is cancelled automatically at its end if it hasn't filled. GTC would keep waiting; IOC and FOK don't wait at all.",
    lesson: "1.3.5",
    concepts: ["time-in-force"],
  },
  {
    id: "q-1.3.5-2",
    topic: "order_types",
    kind: "numeric",
    difficulty: 2,
    prompt: "You send a buy of 400 units at a limit of 100.10, IOC. Only 250 units are offered at 100.10 or better. How many units are cancelled?",
    numeric: { answer: 150, tolerance: 0, unit: "units" },
    explanation: "IOC fills the 250 units available now and cancels the other 150. With FOK nothing would fill, since 250 is less than the 400 ordered.",
    lesson: "1.3.5",
    concepts: ["time-in-force"],
    hints: ["IOC fills what's available now and cancels the rest at once.", "Filled now: 250. The rest of the order doesn't wait.", "Ordered 400, filled 250. Cancelled: 400 − 250."],
    vary: {
      fields: { size: [200, 900, 50], avail: [50, 850, 50] },
      constraints: ["avail < size"],
      answer: "size - avail",
      prompt: "You send a buy of {size} units at a limit of 100.10, IOC. Only {avail} units are offered at 100.10 or better. How many units are cancelled?",
      explanation: "IOC fills the {avail} units available now and cancels the other {answer}. With FOK nothing would fill, since {avail} is less than the {size} ordered.",
      hint: "Ordered {size}, filled {avail}. Cancelled: {size} − {avail}.",
    },
  },
  {
    id: "q-1.3.5-3",
    topic: "order_types",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Ten days ago you placed a buy limit for 40 LABX at 72.00, good till cancelled. You then changed your mind about the trade but never cancelled the order. Today LABX opens with a gap after bad news: the ask is 70.60.",
    prompt: "What happens to the order?",
    options: [
      { id: "a", label: "Nothing: it expired at the end of the first session", rationale: "That's a Day order. A GTC order stays active until it fills or you cancel it." },
      { id: "b", label: "It fills at 72.00, its limit price", rationale: "A buy limit fills at its price or better. After a gap the first price is the open's ask, 70.60, which is better." },
      { id: "c", label: "It's skipped, because price jumped past the limit", rationale: "A better price can't skip a limit. The ask at 70.60 is below 72.00, so it fills at once." },
      { id: "d", label: "It fills at 70.60, and you hold 40 units you no longer wanted" },
    ],
    correct: "d",
    explanation:
      "The GTC order was still live. A gap through a buy limit fills it at the open's ask, 70.60, better than the limit, but it buys a position you had decided against, in a falling market. Cancel orders you no longer want.",
    lesson: "1.3.5",
    concepts: ["time-in-force", "limit-order"],
    hints: ["How long does a GTC order stay active?", "A buy limit fills at its price or better. Is 70.60 better than 72.00?"],
  },

  // 1.3.6 · Fills, partial fills and the queue
  {
    id: "q-1.3.6-1",
    topic: "order_types",
    kind: "mcq",
    difficulty: 1,
    prompt: "Buy limits A and B rest at 99.90; A arrived at 10:00, B at 10:05. Buy limit C rests at 99.95, placed at 10:10. A small market sell arrives. Which order fills first?",
    options: [
      { id: "a", label: "C" },
      { id: "b", label: "A", rationale: "A is the oldest, but price comes before time. C bids more, so it's first in line." },
      { id: "c", label: "B", rationale: "B is neither the best price nor the oldest order at 99.90." },
      { id: "d", label: "All three share it equally", rationale: "Price-time priority doesn't share: the best price fills first, then the oldest order at that price." },
    ],
    correct: "a",
    explanation: "Price-time priority ranks by price first: C's bid of 99.95 beats 99.90, so a seller meets C first. Between A and B, at the same price, A fills before B because it arrived earlier.",
    lesson: "1.3.6",
    concepts: ["order-queue"],
  },
  {
    id: "q-1.3.6-2",
    topic: "order_types",
    kind: "numeric",
    difficulty: 2,
    prompt: "A market buy of 500 units meets asks of 100 at 50.10, 200 at 50.15 and 200 at 50.20. What is the average fill price?",
    numeric: { answer: 50.16, tolerance: 0.005, unit: "vUSD" },
    explanation:
      "Cost: 100 × 50.10 + 200 × 50.15 + 200 × 50.20 = 5,010.00 + 10,030.00 + 10,040.00 = 25,080.00. Divided by 500 units: 50.16. The plain average of the three prices, 50.15, ignores that most units paid more.",
    lesson: "1.3.6",
    concepts: ["order-queue", "slippage"],
    hints: [
      "Average fill price = total cost ÷ total units.",
      "Multiply each price by the units filled there, then add the three amounts.",
      "Total cost 25,080.00 for 500 units.",
    ],
    vary: {
      fields: { p: [40, 120, 0.5], q1: [100, 300, 50], q2: [100, 300, 50], q3: [50, 300, 50] },
      constraints: ["(q2 * 5 + q3 * 10) / (q1 + q2 + q3) == floor((q2 * 5 + q3 * 10) / (q1 + q2 + q3))"],
      answer: "round(p + (q2 * 0.05 + q3 * 0.1) / (q1 + q2 + q3), 2)",
      prompt: "A market buy of {q1 + q2 + q3} units meets asks of {q1} at {p:2}, {q2} at {p + 0.05:2} and {q3} at {p + 0.1:2}. What is the average fill price?",
      explanation:
        "Cost: {q1} × {p:2} + {q2} × {p + 0.05:2} + {q3} × {p + 0.1:2} = {q1 * p + q2 * (p + 0.05) + q3 * (p + 0.1):2}. Divided by {q1 + q2 + q3} units: {answer:2}.",
      hint: "Total cost {q1 * p + q2 * (p + 0.05) + q3 * (p + 0.1):2} for {q1 + q2 + q3} units.",
    },
  },
  {
    id: "q-1.3.6-3",
    topic: "order_types",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your sell limit at 103.00 rests in a real order book, with 500 units queued ahead of you at that price. Buyers take 350 units at 103.00, then price falls away.",
    prompt: "How much of your order filled?",
    options: [
      { id: "a", label: "All of it: price traded at your limit", rationale: "Trading at your price reaches you only once the queue ahead is used up. Only 350 of the 500 ahead traded." },
      { id: "b", label: "None: 150 units were still ahead of you" },
      { id: "c", label: "Part of it: 350 units", rationale: "Those 350 went to the orders ahead of you, which arrived first at the same price." },
      { id: "d", label: "Part of it: the book splits fills equally between orders", rationale: "Under price-time priority fills aren't split equally. The earliest orders at the price fill first." },
    ],
    correct: "b",
    explanation:
      "At 103.00 the 500 units ahead of you fill first. Buyers took 350, so 150 were still in front of your order when price fell away. Price touched your level, but you weren't filled.",
    lesson: "1.3.6",
    concepts: ["order-queue"],
    hints: ["At the same price, who fills first?", "Compare the 350 units traded with the 500 queued ahead of you."],
  },

  // 1.3.7 · Slippage and gaps
  {
    id: "q-1.3.7-1",
    topic: "order_types",
    kind: "numeric",
    difficulty: 1,
    prompt: "Your sell stop at 54.00 protects a long. The market opens with the bid at 53.35. How much slippage is that per unit, against the stop price?",
    numeric: { answer: 0.65, tolerance: 0.005, unit: "vUSD" },
    explanation: "The stop expected 54.00 and filled at the open's bid, 53.35: 0.65 per unit worse than planned.",
    lesson: "1.3.7",
    concepts: ["slippage"],
    hints: ["Slippage is the gap between the price you expected and the fill.", "The stop expected 54.00. It filled at the open's bid.", "54.00 − 53.35 = ?"],
    vary: {
      fields: { stop: [40, 120, 0.5], gap: [0.05, 1.5, 0.05] },
      answer: "gap",
      prompt: "Your sell stop at {stop:2} protects a long. The market opens with the bid at {stop - gap:2}. How much slippage is that per unit, against the stop price?",
      explanation: "The stop expected {stop:2} and filled at the open's bid, {stop - gap:2}: {answer:2} per unit worse than planned.",
      hint: "{stop:2} − {stop - gap:2} = ?",
    },
  },
  {
    id: "q-1.3.7-2",
    topic: "stop_loss",
    kind: "numeric",
    difficulty: 2,
    prompt: "Long 25 LABX at 60.00, stop 56.00: 100.00 at risk before costs, your 1R. A gap fills the stop at 53.00. How many R did you lose?",
    numeric: { answer: 1.75, tolerance: 0.01, unit: "R" },
    explanation: "Real loss: 25 × (60.00 − 53.00) = 175.00. In R: 175.00 ÷ 100.00 = 1.75R lost, against the 1R you planned.",
    lesson: "1.3.7",
    concepts: ["gap-risk", "r-multiple"],
    hints: ["R compares the real loss with the planned loss.", "Real loss: 25 × (60.00 − 53.00).", "175.00 ÷ 100.00 = ?"],
    vary: {
      fields: { entry: [40, 120, 1], dist: [1, 5, 0.25], gap: [0.5, 4, 0.25] },
      constraints: ["100 / dist == floor(100 / dist)", "100 / dist * entry <= 9900"],
      answer: "round((dist + gap) / dist, 2)",
      prompt: "Long {100 / dist} LABX at {entry:2}, stop {entry - dist:2}: 100.00 at risk before costs, your 1R. A gap fills the stop at {entry - dist - gap:2}. How many R did you lose?",
      explanation:
        "Real loss: {100 / dist} × ({entry:2} − {entry - dist - gap:2}) = {100 / dist * (dist + gap):2}. In R: {100 / dist * (dist + gap):2} ÷ 100.00 = {answer:2}R lost, against the 1R you planned.",
      hint: "{100 / dist * (dist + gap):2} ÷ 100.00 = ?",
    },
  },
  {
    id: "q-1.3.7-3",
    topic: "position_sizing",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Trade A: long 25 units, stop 4.00 below entry. Trade B: long 125 units, stop 0.80 below entry. Both risk 100.00 before costs. Overnight news opens the market 5.00 below both entries, beyond both stops.",
    prompt: "What happens?",
    options: [
      { id: "a", label: "Both lose 100.00: the stops cap the loss", rationale: "A stop caps the loss you planned for. In a gap it fills at the open, 5.00 below entry for both trades." },
      { id: "b", label: "A loses more, because its stop was further away", rationale: "A's far stop means fewer units. 25 × 5.00 = 125.00, against B's 625.00." },
      { id: "c", label: "B loses 625.00, −6.25R; A loses 125.00, −1.25R" },
      { id: "d", label: "Both lose the same in R, since both risked 100.00", rationale: "Same planned R, different size. The gap loss is units × gap: 125.00 for A, 625.00 for B." },
    ],
    correct: "c",
    explanation:
      "In a gap the loss is units × the gap: A, 25 × 5.00 = 125.00; B, 125 × 5.00 = 625.00. Both planned −1R, but B's tight stop allowed five times the units, and the gap hits every unit.",
    lesson: "1.3.7",
    concepts: ["gap-risk", "position-sizing"],
    hints: ["In a gap, both stops fill at the open, 5.00 below entry.", "Loss = units × 5.00 for each trade. Then divide by 100.00 for R."],
  },

  // 1.3.8 · Trailing stops
  {
    id: "q-1.3.8-1",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 1,
    prompt: "What must a trailing stop on a long position never do?",
    options: [
      { id: "a", label: "Move up as price makes new highs", rationale: "That's its job: following price up cuts the risk and then locks in part of the gain." },
      { id: "b", label: "Stay where it is while price pulls back", rationale: "Holding still in a pullback is normal. A trail moves only when its rule says so, and only towards price." },
      { id: "c", label: "Sit just under the last higher low", rationale: "That's a common structure rule, not a mistake. The only forbidden move is away from price." },
      { id: "d", label: "Move down, further from price" },
    ],
    correct: "d",
    explanation: "A trailing stop only ever moves in the trade's favour. Lowering a long's stop is widening it: it raises the risk you agreed to, and MARKET//LAB counts it against Risk Discipline.",
    lesson: "1.3.8",
    concepts: ["trailing-stop"],
  },
  {
    id: "q-1.3.8-2",
    topic: "stop_loss",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "On LABX's 1-hour chart a normal candle spans about 0.80. You're long from 100.00 and trail the stop 0.30 under the highest price. The trend is intact: higher highs and higher lows.",
    prompt: "What is the most likely outcome?",
    options: [
      { id: "a", label: "An ordinary pullback hits the stop early, often while the trend goes on" },
      { id: "b", label: "The tight trail captures most of the trend, since it gives little back", rationale: "It gives back little per exit, but ordinary 0.80 candles reach a 0.30 trail long before the trend ends." },
      { id: "c", label: "Nothing changes: a trail's distance doesn't affect when it exits", rationale: "The distance decides which pullbacks reach the stop. At 0.30, most normal candles can." },
      { id: "d", label: "The stop can't be hit while the trend makes higher lows", rationale: "A higher low can still sit more than 0.30 under the high. A trail measured from the high ignores structure." },
    ],
    correct: "a",
    explanation:
      "A trail tighter than a normal candle sits inside ordinary noise. Even in a healthy trend, a routine pullback of one candle reaches it, so the trade ends on noise rather than on a change of trend.",
    lesson: "1.3.8",
    concepts: ["trailing-stop", "volatility"],
    hints: ["Compare the trail's distance with the size of a normal candle.", "A pullback of one ordinary candle can be 0.80. Where is the stop?"],
  },
  {
    id: "q-1.3.8-3",
    topic: "stop_loss",
    kind: "numeric",
    difficulty: 2,
    prompt:
      "Long from 50.00. You trail the stop 1.00 under the highest price reached. Price rises to 51.40, dips to 50.60, rises to 52.30, then falls to 50.90. At what price does the stop exit? Ignore the spread.",
    numeric: { answer: 51.3, tolerance: 0.005, unit: "vUSD" },
    explanation:
      "The stop follows the highest price: 51.40 puts it at 50.40, below the dip to 50.60. The new high, 52.30, lifts it to 51.30, and the fall to 50.90 passes through it there.",
    lesson: "1.3.8",
    concepts: ["trailing-stop"],
    hints: ["Track the highest price so far; the stop is always 1.00 under it.", "After 51.40 the stop is 50.40. Does the dip to 50.60 reach it?", "After 52.30 the stop is 51.30. Does the fall pass through it?"],
    vary: {
      fields: { e: [40, 120, 1], up1: [1, 2, 0.1], dip: [0.3, 0.9, 0.1], up2: [1, 2, 0.1], t: [0.5, 1.5, 0.1] },
      constraints: ["dip < t", "up2 > dip"],
      answer: "round(e + up1 - dip + up2 - t, 2)",
      prompt:
        "Long from {e:2}. You trail the stop {t:2} under the highest price reached. Price rises to {e + up1:2}, dips to {e + up1 - dip:2}, rises to {e + up1 - dip + up2:2}, then falls to {e + up1 - dip + up2 - t - 0.4:2}. At what price does the stop exit? Ignore the spread.",
      explanation:
        "The stop follows the highest price: {e + up1:2} puts it at {e + up1 - t:2}, below the dip to {e + up1 - dip:2}. The new high, {e + up1 - dip + up2:2}, lifts it to {answer:2}, and the fall passes through it there.",
      hint: "After {e + up1 - dip + up2:2} the stop is {answer:2}. Does the fall pass through it?",
    },
  },
];

// ─── Glossary terms and concepts ────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "stop-limit-order",
    term: "Stop-limit order",
    definition: "A stop order that becomes a limit order when its trigger is reached, so it fills only at the limit price or better and may not fill at all if price jumps past it.",
    plain: "A stop with a price cap: it won't chase price past your limit, even if that means no fill.",
    related: ["stop-order", "limit-order", "gap"],
    lesson: "1.3.3",
    aka: ["Stop limit"],
  },
  {
    id: "oco-order",
    term: "OCO order",
    definition: "One-cancels-other: two linked orders where the fill of one cancels the other automatically, as with a bracket's stop and target or a two-sided breakout entry.",
    plain: "Two orders tied together: whichever fills first, the other disappears.",
    related: ["bracket-order", "pending-order", "stop-order"],
    lesson: "1.3.4",
    aka: ["OCO", "One-cancels-other"],
  },
  {
    id: "pending-order",
    term: "Pending order",
    definition: "An order that has been placed but not yet filled, waiting for its price, such as a limit order or a stop entry.",
    plain: "An order that's still waiting for its price.",
    related: ["limit-order", "stop-order", "time-in-force"],
    lesson: "1.3.4",
    aka: ["Resting order", "Working order"],
  },
  {
    id: "time-in-force",
    term: "Time in force",
    definition: "How long an order stays active before it fills or is cancelled: Day, good till cancelled (GTC), good till date (GTD), immediate or cancel (IOC) or fill or kill (FOK).",
    plain: "The order's expiry setting: how long it's allowed to wait.",
    related: ["day-order", "gtc", "ioc", "fok", "pending-order"],
    lesson: "1.3.5",
    aka: ["TIF"],
  },
  {
    id: "day-order",
    term: "Day order",
    definition: "An order that is cancelled automatically at the end of the trading session if it hasn't filled.",
    plain: "An order that's good for today only.",
    related: ["time-in-force", "gtc"],
    lesson: "1.3.5",
  },
  {
    id: "gtc",
    term: "GTC",
    definition: "Good till cancelled: an order that stays active until it fills or you cancel it. Some brokers still cancel such orders after a set period.",
    plain: "An order that keeps waiting, for days or weeks, until it fills or you cancel it.",
    related: ["time-in-force", "day-order", "pending-order"],
    lesson: "1.3.5",
    aka: ["Good till cancelled"],
  },
  {
    id: "ioc",
    term: "IOC",
    definition: "Immediate or cancel: an order that fills whatever is available now, at its price or better, and cancels the rest.",
    plain: "Take what you can right now and forget the rest.",
    related: ["fok", "partial-fill", "time-in-force"],
    lesson: "1.3.5",
    aka: ["Immediate or cancel"],
  },
  {
    id: "fok",
    term: "FOK",
    definition: "Fill or kill: an order that fills in full at once, at its price or better, or is cancelled entirely.",
    plain: "All of it right now, or nothing.",
    related: ["ioc", "time-in-force"],
    lesson: "1.3.5",
    aka: ["Fill or kill"],
  },
  {
    id: "queue-priority",
    term: "Queue priority",
    definition: "The rule that decides which resting orders fill first: the best price first and, at the same price, the earliest order.",
    plain: "First in line at the best price gets filled first.",
    related: ["order-book", "limit-order", "partial-fill"],
    lesson: "1.3.6",
    aka: ["Price-time priority"],
  },
  {
    id: "average-fill-price",
    term: "Average fill price",
    definition: "The size-weighted average price of an order that filled in parts at several prices: the total cost divided by the total units.",
    plain: "What you paid per unit, on average, when an order filled at more than one price.",
    related: ["fill", "partial-fill", "market-depth"],
    lesson: "1.3.6",
    aka: ["Average price"],
  },
  {
    id: "market-depth",
    term: "Market depth",
    definition: "How many units are waiting to be bought and sold at each price near the current one, as listed in the order book.",
    plain: "How much is on offer at each price, not just at the best one.",
    related: ["order-book", "liquidity", "slippage"],
    lesson: "1.3.6",
    aka: ["Depth", "Level 2"],
  },
  {
    id: "guaranteed-stop",
    term: "Guaranteed stop",
    definition: "A stop a broker promises to fill at its exact price, even through a gap, in exchange for an extra fee.",
    plain: "Insurance on your stop: you pay a premium, and the broker takes on the gap.",
    related: ["stop-loss", "gap", "slippage"],
    lesson: "1.3.7",
    aka: ["Guaranteed stop-loss", "GSL"],
  },
];

const CONCEPTS: Concept[] = [
  {
    id: "stop-entry-order",
    name: "Stop entry order",
    category: "order_types",
    summary: "A buy stop above the price, or a sell stop below it, enters only if a level breaks, then fills at market.",
    body: [
      "A stop entry waits on the far side of a level. A buy stop sits above the price and triggers when the ask reaches it; a sell stop sits below and triggers when the bid does. Once triggered, it becomes a market order.",
      "Because it fills at market, it can fill worse than its trigger: after a gap, at the open. Limits work the other way round: a buy limit waits below the price for a dip, and one placed above the ask fills at once.",
    ],
    example:
      "A buy stop for 30 units at 102.10, above a range high of 102.00. The next candle opens with the ask at 102.45, so the order fills there: 0.35 above the trigger, 10.50 of slippage in all.",
    related: ["market-order", "limit-order", "breakout", "slippage"],
    missions: [],
    lessons: ["1.3.3"],
  },
  {
    id: "stop-limit-order",
    name: "Stop-limit order",
    category: "order_types",
    summary: "A stop that becomes a limit order when triggered, so it may not fill in a gap.",
    body: [
      "A stop-limit has two prices: a trigger and a limit. When the trigger is reached, it becomes a limit order that fills only at the limit or better.",
      "For an entry that can be useful: it skips a breakout that runs too far. For protection it's a danger: if price gaps past the limit, nothing sells and the position stays open.",
    ],
    example:
      "Long from 100.00, protected by a sell stop-limit with trigger 98.00 and limit 97.80. After bad news the bid opens at 97.20: the limit can't fill, and the long stays open while price keeps falling.",
    related: ["stop-entry-order", "stop-loss-order", "gap-risk", "limit-order"],
    missions: [],
    lessons: ["1.3.3"],
  },
  {
    id: "oco-order",
    name: "OCO order",
    category: "order_types",
    summary: "Two linked orders where the fill of one cancels the other, as in a bracket or a two-sided breakout entry.",
    body: [
      "One-cancels-other links two live orders. A bracket's stop and target are an OCO pair: when the target fills, the stop is cancelled.",
      "OCO also works for entries: a buy stop above a range and a sell stop below it. Without the link, both could fill in a whipsaw, and an exit left behind after a manual close can open a trade nobody decided.",
    ],
    example:
      "LABX ranges between 99.00 and 101.00. An OCO pair: a buy stop at 101.10 and a sell stop at 98.90, each with its own stop at 100.00. The ask reaches 101.10 and the buy fills; the sell stop is cancelled at the same moment.",
    related: ["bracket-order", "stop-entry-order", "breakout"],
    missions: [],
    lessons: ["1.3.4"],
  },
  {
    id: "time-in-force",
    name: "Time in force",
    category: "order_types",
    summary: "How long an order stays active: Day, GTC, GTD, IOC or FOK.",
    body: [
      "Day orders expire when the session ends; good-till-cancelled orders stay until they fill or you cancel them; good-till-date orders, until a date. IOC fills what it can now and cancels the rest; FOK fills everything at once or nothing.",
      "Every resting order is a decision that will execute later without you. A forgotten GTC order can fill in a gap and open a position you no longer planned.",
    ],
    example: "Buy 500 at 100.05, IOC, with 320 units offered at that price or better: 320 fill and 180 are cancelled. The same order as FOK fills nothing.",
    related: ["limit-order", "oco-order", "gap-risk"],
    missions: [],
    lessons: ["1.3.5"],
  },
  {
    id: "order-queue",
    name: "Order queue",
    category: "order_types",
    summary: "Resting orders fill by price, then by time, so a touched price doesn't guarantee a fill.",
    body: [
      "An order book holds a queue of limit orders at each price. Price-time priority fills the best price first and, at the same price, the oldest order first.",
      "A limit at a popular price may wait behind many units: price can trade at your level and leave before reaching you. A large market order walks the book, filling across several prices at a worse average.",
    ],
    example:
      "Your buy limit for 100 units joins at 99.90 behind 200 units. Sellers sell 250 units at 99.90: 200 go to the orders ahead, 50 to you. The other 50 keep waiting.",
    related: ["limit-order", "slippage", "time-in-force"],
    missions: [],
    lessons: ["1.3.6"],
  },
];

/** How the unit introduces itself on the course map. */
const INTRO: UnitIntro = {
  summary: "Orders turn a plan into a trade. This unit covers each basic order, from market and limit to brackets and trailing stops, and how it really fills: the queue, partial fills, slippage and gaps. It comes now because you can read quotes and candles, and because risk, in Unit 1.4, starts from the stop.",
  outcomes: [
    "Choose the order a plan needs: market, limit, stop entry, stop-limit, bracket or OCO.",
    "Place a stop-loss and a take-profit, and predict where each fills after a gap.",
    "Set how long an order lives, and clear leftover orders after every exit.",
    "Predict partial fills and slippage, and measure a gap through your stop in R.",
    "Trail a stop by a rule set before entry, never moving it further away.",
  ],
  buildsOn: "Unit 1.1: the bid, the ask and the cost of a round trip (1.1.1, 1.1.5). And 1.2.5: normal candle size and gaps. Every fill in this unit follows from those prices.",
};

export const UNIT_1_3: UnitContent = { intro: INTRO, lessons: [L133, L134, L135, L136, L137, L138], questions: QUESTIONS, terms: TERMS, concepts: CONCEPTS };
