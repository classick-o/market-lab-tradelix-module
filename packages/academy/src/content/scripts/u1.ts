import type { CandleData, ChartLayer, Concept, GlossaryTerm, LessonScript } from "../../types";

/** One candle, in price units with 2 decimals. */
const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

// ─── Chart data (docs/learn/U1-how-markets-work.md) ─────────────────────────

/** L01: the hook candle, also used in B2, B5, B6 and as the Try start. */
const L01_CANDLE = k(100.0, 101.5, 99.2, 101.0);

/** L03 B2, B6 and hook: 10 hours drifting down from 100.70 to a close of 100.00 (the mid now). */
const L03_HISTORY: CandleData[] = [
  k(100.7, 100.78, 100.58, 100.62),
  k(100.62, 100.69, 100.5, 100.54),
  k(100.54, 100.63, 100.47, 100.58),
  k(100.58, 100.61, 100.42, 100.46),
  k(100.46, 100.52, 100.33, 100.38),
  k(100.38, 100.47, 100.31, 100.41),
  k(100.41, 100.44, 100.24, 100.27),
  k(100.27, 100.33, 100.12, 100.16),
  k(100.16, 100.22, 100.03, 100.08),
  k(100.08, 100.13, 99.96, 100.0),
];

/** L03 B6, under the veil: lowest mid 99.10 in hour 4 (ask 99.15), so a buy limit at 99.00 never fills; close 103.00 in hour 12. */
const L03_B6_FUTURE: CandleData[] = [
  k(100.0, 100.06, 99.62, 99.7),
  k(99.7, 99.76, 99.38, 99.45),
  k(99.45, 99.52, 99.22, 99.3),
  k(99.3, 99.48, 99.1, 99.4),
  k(99.4, 99.97, 99.34, 99.9),
  k(99.9, 100.58, 99.84, 100.5),
  k(100.5, 101.0, 100.42, 100.9),
  k(100.9, 101.48, 100.82, 101.4),
  k(101.4, 101.92, 101.3, 101.8),
  k(101.8, 102.38, 101.71, 102.3),
  k(102.3, 102.74, 102.22, 102.6),
  k(102.6, 103.08, 102.52, 103.0),
];

/** L03 Try: 10 hours of history from 100.80 to a close of 100.00. */
const L03_TRY_HISTORY: CandleData[] = [
  k(100.8, 100.88, 100.66, 100.71),
  k(100.71, 100.79, 100.58, 100.63),
  k(100.63, 100.74, 100.55, 100.68),
  k(100.68, 100.71, 100.49, 100.52),
  k(100.52, 100.6, 100.4, 100.45),
  k(100.45, 100.53, 100.36, 100.48),
  k(100.48, 100.51, 100.28, 100.31),
  k(100.31, 100.37, 100.15, 100.19),
  k(100.19, 100.26, 100.05, 100.1),
  k(100.1, 100.14, 99.96, 100.0),
];

/** L03 Try, under the veil: lowest mid 98.90 in hour 6 (ask 98.95), the first hour a buy limit at 99.00 can fill. */
const L03_TRY_FUTURE: CandleData[] = [
  k(100.0, 100.07, 99.72, 99.8),
  k(99.8, 99.88, 99.51, 99.6),
  k(99.6, 99.66, 99.31, 99.4),
  k(99.4, 99.58, 99.28, 99.5),
  k(99.5, 99.56, 99.11, 99.2),
  k(99.2, 99.38, 98.9, 99.3),
  k(99.3, 99.79, 99.22, 99.7),
  k(99.7, 100.18, 99.63, 100.1),
  k(100.1, 100.41, 100.02, 100.3),
  k(100.3, 100.78, 100.21, 100.7),
  k(100.7, 101.02, 100.62, 100.9),
  k(100.9, 101.29, 100.81, 101.2),
];

/**
 * L04, the lesson chart (hook, B4, Try): 24 one-hour candles. Highs stall at 103.85 (h3) and 103.96 (h5);
 * support near 98.00 is touched three times: h10 low 98.04, h15 low 97.96, h20 low 98.02. Close 100.00 now.
 */
const L04_CHART: CandleData[] = [
  k(101.2, 102.05, 101.12, 101.9),
  k(101.9, 102.95, 101.84, 102.8),
  k(102.8, 103.85, 102.71, 103.4),
  k(103.4, 103.62, 102.88, 103.1),
  k(103.1, 103.96, 103.02, 103.55),
  k(103.55, 103.78, 102.94, 103.05),
  k(103.05, 103.12, 101.76, 101.9),
  k(101.9, 102.02, 100.45, 100.6),
  k(100.6, 100.71, 99.05, 99.2),
  k(99.2, 99.31, 98.04, 98.4),
  k(98.4, 99.02, 98.33, 98.9),
  k(98.9, 99.38, 98.81, 99.25),
  k(99.25, 99.57, 99.14, 99.45),
  k(99.45, 99.72, 99.36, 99.6),
  k(99.6, 99.66, 97.96, 98.3),
  k(98.3, 98.94, 98.21, 98.85),
  k(98.85, 99.42, 98.77, 99.3),
  k(99.3, 99.71, 99.19, 99.6),
  k(99.6, 99.91, 99.48, 99.8),
  k(99.8, 99.86, 98.02, 98.5),
  k(98.5, 99.06, 98.42, 98.95),
  k(98.95, 99.47, 98.86, 99.35),
  k(99.35, 99.81, 99.26, 99.7),
  k(99.7, 100.09, 99.61, 100.0),
];

/** L04 B4, under the veil: h26 dips to 97.94 (bid 97.89 hits a stop at 97.95, not one at 97.70), then price climbs to 101.40 in h30. */
const L04_FUTURE: CandleData[] = [
  k(100.0, 100.06, 98.88, 99.0),
  k(99.0, 99.08, 97.94, 98.3),
  k(98.3, 99.31, 98.22, 99.2),
  k(99.2, 100.22, 99.12, 100.1),
  k(100.1, 100.93, 100.01, 100.8),
  k(100.8, 101.4, 100.72, 101.4),
];

const L04_SUPPORT: ChartLayer = { kind: "zone", from: 97.9, to: 98.1, role: "support", label: "SUPPORT" };
const L04_RESISTANCE: ChartLayer = { kind: "zone", from: 103.8, to: 104.0, role: "resistance", label: "RESISTANCE" };
const L04_ENTRY: ChartLayer = { kind: "level", price: 100.0, role: "entry", label: "ENTRY 100.00", chip: true };

/** L03 B2: the two possible futures, drawn over the veil from the mid now (candle 10, index 9). */
const L03_PATH_FILLED: ChartLayer = {
  kind: "path",
  role: "accent",
  points: [
    { index: 9, price: 100.0 },
    { index: 12, price: 99.4 },
    { index: 15, price: 98.9 },
    { index: 18, price: 99.8 },
  ],
};
const L03_PATH_MISSED: ChartLayer = {
  kind: "path",
  role: "neutral",
  dashed: true,
  label: "NEVER FILLED",
  points: [
    { index: 9, price: 100.0 },
    { index: 12, price: 100.8 },
    { index: 15, price: 101.6 },
    { index: 18, price: 102.0 },
  ],
};

// ─── Scripts ────────────────────────────────────────────────────────────────

/** Interactive scripts for unit U1 lessons (docs/learn). Filled in from the lesson scripts. */
export const SCRIPTS_U1: Record<string, LessonScript> = {
  // L01 · What a candle shows
  L01: {
    unit: "1.2",
    courseId: "1.2.1",
    bridge: "Unit 1.1 ended in 1.1.7 on the quote screen: the last price, the bid and ask, and the day's high and low. Unit 1.2 turns prices into charts. It starts with the candle, which packs one hour of trading into four prices.",
    hook: {
      prompt: "This [[candle]] is one hour of LABX trading. Tap the price where the hour ended.",
      control: {
        kind: "tap",
        chart: {
          candles: [L01_CANDLE],
          describe: "One candle, drawn in the up colour. Its body spans 100.00 to 101.00; thin wicks reach up to 101.50 and down to 99.20.",
        },
        zones: [
          { id: "high", label: "101.50", index: 0, price: 101.5 },
          { id: "close", label: "101.00", index: 0, price: 101.0 },
          { id: "open", label: "100.00", index: 0, price: 100.0 },
          { id: "low", label: "99.20", index: 0, price: 99.2 },
        ],
        answer: "close",
      },
      compare: "You tapped {yours}. The hour ended at the top of the body, 101.00. The wick tip, 101.50, was only the high.",
      concept: "candlestick",
    },
    learn: [
      {
        kind: "explain",
        text: "A candle summarises trading over one period. In MARKET//LAB each candle covers one hour, its [[timeframe]], so a chart of 48 candles shows two days. Every candle is built from just four prices, **OHLC**: the [[open]], the [[high]], the [[low]] and the [[close]].",
      },
      {
        kind: "figure",
        figure: {
          kind: "chart",
          chart: { candles: [L01_CANDLE, k(101.0, 101.5, 99.2, 100.0)], visible: 1 },
          steps: [
            {
              text: "Open, 100.00: the first price of the hour.",
              layers: [{ kind: "marker", index: 0, at: "open", label: "OPEN 100.00" }],
            },
            {
              text: "Close, 101.00: the last price. The [[body]] fills the space between open and close.",
              layers: [
                { kind: "marker", index: 0, at: "close", label: "CLOSE 101.00" },
                { kind: "bracket", from: 100.0, to: 101.0, index: 0, label: "BODY" },
              ],
            },
            {
              text: "High, 101.50, and low, 99.20: the [[wick|wicks]] reach the highest and lowest prices traded.",
              layers: [
                { kind: "marker", index: 0, at: "high", label: "HIGH 101.50" },
                { kind: "marker", index: 0, at: "low", label: "LOW 99.20" },
                { kind: "bracket", from: 101.0, to: 101.5, index: 0, label: "UPPER WICK" },
                { kind: "bracket", from: 99.2, to: 100.0, index: 0, label: "LOWER WICK" },
              ],
            },
            {
              text: "Close above open: a bullish candle. A bearish candle flips it: open on top, close at the bottom.",
              visible: 2,
              layers: [
                { kind: "marker", index: 1, at: "open", label: "OPEN 101.00" },
                { kind: "marker", index: 1, at: "close", label: "CLOSE 100.00" },
              ],
            },
          ],
        },
      },
      {
        kind: "explain",
        text: "The **body** is the thick part between the open and the close. The thin lines above and below it are the **wicks**, also called shadows; their tips mark the high and the low. A **bullish** candle closed above its open. A **bearish** candle closed below its open. Charts draw the two in different colours or fills.",
      },
      {
        kind: "hotspot",
        title: "Find the close",
        prompt: "This candle is bearish. Tap its close.",
        chart: {
          candles: [k(100.6, 100.9, 99.3, 99.7)],
          describe: "One bearish candle. Its body spans 100.60 down to 99.70; thin wicks reach up to 100.90 and down to 99.30.",
        },
        zones: [
          { id: "high", label: "100.90", index: 0, price: 100.9, feedback: "That's the high, the tip of the upper wick. The close is where the body ends: 99.70." },
          { id: "open", label: "100.60", index: 0, price: 100.6, feedback: "That's the open. On a bearish candle the open is the top of the body; the close is the bottom, 99.70." },
          { id: "close", label: "99.70", index: 0, price: 99.7 },
          { id: "low", label: "99.30", index: 0, price: 99.3, feedback: "That's the low, the tip of the lower wick. Price traded there but finished higher, at 99.70." },
        ],
        answer: "close",
        correct: "Right. A bearish candle closed below its open, so the close is the bottom of the body: 99.70.",
        concept: "candlestick",
      },
      {
        kind: "worked",
        title: "Reading one candle",
        lines: [
          "Open 100.00, high 101.50, low 99.20, close 101.00.",
          "Close above open: the candle is bullish.",
          "Body: 101.00 − 100.00 = 1.00.",
          "Upper wick: 101.50 − 101.00 = 0.50.",
          "Lower wick: 100.00 − 99.20 = 0.80.",
          "Range, high − low: 101.50 − 99.20 = ?",
        ],
        ask: {
          answer: 2.3,
          tolerance: 0,
          feedback: [
            { value: 1.8, text: "That's close − low. The range is the full height, from the low to the high." },
            { value: 1.5, text: "That's high − open. The range runs from the low, 99.20, to the high, 101.50." },
          ],
          correct: "Right: 2.30. The body and both wicks add up to the full range.",
        },
        after: "2.30, which is 1.00 + 0.50 + 0.80. During the hour price traded as low as 99.20 and as high as 101.50, and it finished at 101.00.",
        concept: "candlestick",
      },
      {
        kind: "predict",
        title: "Which came first?",
        prompt: "Inside this hour, which came first: the high or the low?",
        control: {
          kind: "choice",
          choices: [
            { id: "high", label: "The high, 101.50", feedback: "That's possible, and so is the other. Both paths below draw the same candle." },
            { id: "low", label: "The low, 99.20", feedback: "That's possible, and so is the other. Both paths below draw the same candle." },
            { id: "unknown", label: "The candle can't tell you", feedback: "Right. The candle keeps four prices, not the path between them." },
          ],
          answer: "unknown",
        },
        figure: {
          kind: "chart",
          chart: {
            candles: [L01_CANDLE],
            layers: [
              { kind: "marker", index: 0, at: "high", label: "HIGH 101.50" },
              { kind: "marker", index: 0, at: "close", label: "CLOSE 101.00" },
              { kind: "marker", index: 0, at: "open", label: "OPEN 100.00" },
              { kind: "marker", index: 0, at: "low", label: "LOW 99.20" },
            ],
          },
          steps: [
            {
              text: "Path A: up to the high first, then down to the low, then up to the close.",
              layers: [
                {
                  kind: "path",
                  label: "PATH A",
                  role: "accent",
                  points: [
                    { index: -0.36, price: 100.0 },
                    { index: -0.24, price: 100.8 },
                    { index: -0.12, price: 101.5 },
                    { index: 0, price: 100.3 },
                    { index: 0.12, price: 99.2 },
                    { index: 0.24, price: 100.1 },
                    { index: 0.36, price: 101.0 },
                  ],
                },
              ],
            },
            {
              text: "Path B: down to the low first, then up to the high, then back to the close.",
              layers: [
                {
                  kind: "path",
                  label: "PATH B",
                  role: "concept",
                  dashed: true,
                  points: [
                    { index: -0.36, price: 100.0 },
                    { index: -0.24, price: 99.6 },
                    { index: -0.12, price: 99.2 },
                    { index: 0, price: 100.4 },
                    { index: 0.12, price: 101.5 },
                    { index: 0.24, price: 101.2 },
                    { index: 0.36, price: 101.0 },
                  ],
                },
              ],
            },
          ],
        },
        reveal: "Both paths draw exactly this candle. A candle shows where price went, not the order in which it got there.",
        concept: "candlestick",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A candle is a summary, not a signal. It records four prices from one hour. A strong bullish hour can be followed by anything: what happens next depends on things the candle doesn't show.",
      },
    ],
    task: {
      widget: "candle-builder",
      goal: "Build a bearish candle with a long lower wick: at least twice the body, and longer than the upper wick.",
      start: { open: 100.0, high: 101.5, low: 99.2, close: 101.0 },
      // Evaluated on the effective values (high ≥ max(open, close), low ≤ min(open, close)), as the widget's outputs are.
      success: {
        all: [
          { field: "direction", eq: "bearish" },
          { field: "lowerOverBody", gte: 2 },
          { field: "lowerMinusUpper", gt: 0 },
        ],
      },
      feedback: [
        { when: { not: { field: "direction", eq: "bearish" } }, text: "The close isn't below the open, so the candle isn't bearish. Move the close under the open." },
        { when: { field: "lowerOverBody", lt: 2 }, text: "The lower wick is {lowerWick:2}, less than twice the body ({body:2}). Lower the low, or shrink the body." },
        { when: { field: "lowerMinusUpper", lte: 0 }, text: "The upper wick ({upperWick:2}) is at least as long as the lower one. Bring the high closer to the top of the body." },
      ],
      correct: "Right: a bearish body of {body:2} and a lower wick of {lowerWick:2}. Price traded down to {low:2} during the hour but closed {lowerWick:2} above it.",
      hints: [
        "Start with direction: a bearish candle closes below its open. Move the close under 100.00.",
        "Lower wick = bottom of the body − low. Make it at least twice the body and longer than the upper wick.",
        "With the open at 100.00, close 99.70 gives a body of 0.30. Set the low to 99.10 or lower and the high to 100.20.",
      ],
      showMe: { open: 100.0, high: 100.2, low: 98.8, close: 99.7 },
      concept: "candlestick",
    },
    check: ["q-mf-1", "q-mf-2", "q-mf-3"],
    recap: {
      takeaways: [
        "Every candle is four prices: open, high, low, close. The body spans open to close; wicks reach the extremes.",
        "Close above open is bullish; close below open is bearish. The wicks don't decide the direction.",
        "A candle records one hour. It can't show which extreme came first or what comes next.",
      ],
      next: "Next, 1.2.2: line, bar and candle charts, three ways to draw the same prices, and what each one leaves out.",
    },
  },

  // L02 · Bid, ask and the spread
  L02: {
    unit: "1.1",
    courseId: "1.1.1",
    bridge: "Unit 0.2 ended in 0.2.6: skill shows as results after costs, over many trades. Unit 1.1 looks at prices and those costs. In 0.1.1 buyers and sellers met in an auction; here you meet the two prices they quote, the bid and the ask.",
    hook: {
      prompt: "The chart shows LABX at 100.00. You buy 50 [[unit|units]], single pieces of LABX, and sell them straight back. Price hasn't moved. What's your result?",
      control: {
        kind: "choice",
        choices: [
          { id: "zero", label: "Zero: price didn't move" },
          { id: "gain", label: "A small gain" },
          { id: "loss", label: "A small loss" },
        ],
        answer: "loss",
      },
      compare: "You picked {yours}. The round trip lost 10.01 vUSD: 5.00 to the spread and 5.01 in commission, with the mid unchanged.",
      concept: "trading-costs",
    },
    learn: [
      {
        kind: "explain",
        text: "At any moment there are two prices, not one. The [[bid]] is the highest price a buyer will pay, so it's what you receive when you sell. The [[ask]] is the lowest price a seller will accept, so it's what you pay when you buy. The gap between them is the [[spread]].",
      },
      {
        kind: "figure",
        figure: {
          kind: "chart",
          // The figure has no candles; the chart kit needs one, so a flat candle sits on the mid.
          chart: {
            candles: [k(100.0, 100.0, 100.0, 100.0)],
            range: [99.8, 100.2],
            describe: "The mid at 100.00, the ask 0.05 above it at 100.05 and the bid 0.05 below it at 99.95. The spread between them is 0.10.",
          },
          steps: [
            {
              text: "The [[mid-price|mid]], 100.00, sits halfway. Chart candles are drawn from it, but you can't trade at it.",
              layers: [{ kind: "level", price: 100.0, role: "neutral", label: "MID 100.00" }],
            },
            {
              text: "Ask 100.05, the mid + 0.05: buyers pay it. Bid 99.95, the mid − 0.05: sellers get it.",
              layers: [
                { kind: "level", price: 100.05, role: "neutral", label: "ASK 100.05 · YOU BUY HERE", chip: true },
                { kind: "level", price: 99.95, role: "neutral", label: "BID 99.95 · YOU SELL HERE", chip: true },
              ],
            },
            {
              text: "The spread: 100.05 − 99.95 = 0.10. Buy and sell straight back, and each unit loses 0.10 before any fees.",
              layers: [{ kind: "bracket", from: 99.95, to: 100.05, label: "SPREAD 0.10", role: "concept" }],
            },
          ],
        },
      },
      {
        kind: "match",
        prompt: "LABX mid is 100.00. Match each item to its price.",
        pairs: [
          { left: "You buy now", right: "Ask, 100.05", wrong: "Buyers pay the higher price, the ask." },
          { left: "You sell now", right: "Bid, 99.95", wrong: "Sellers receive the lower price, the bid." },
          { left: "The candles on the chart", right: "Mid, 100.00", wrong: "Candles are drawn from the mid, halfway between bid and ask." },
          { left: "The gap from bid to ask", right: "Spread, 0.10", wrong: "The gap is a distance, not a price: 100.05 − 99.95." },
        ],
        concept: "bid-ask-spread",
      },
      {
        kind: "explain",
        text: "You also pay [[commission]]: 0.05% of the fill value, or 5 [[basis-point|basis points]], when you enter and again when you exit. A **round trip** means opening a [[position]] and closing it. You cross the spread once, because you enter on one side and leave on the other, and you pay commission twice.",
      },
      {
        kind: "worked",
        title: "Buy 50 units, sell them straight back (mid stays 100.00)",
        lines: [
          "Buy 50 at 100.05: 50 × 100.05 = 5,002.50.",
          "Sell 50 at 99.95: 50 × 99.95 = 4,997.50.",
          "Spread cost: 50 × 0.10 = 5.00.",
          "Commission: 0.05% × (5,002.50 + 4,997.50) = 0.05% × 10,000.00 = 5.00.",
          "Round-trip cost: 5.00 + 5.00 = ?",
        ],
        ask: {
          answer: 10.0,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 5.0, text: "That's one cost. Add the spread and the commission together." },
            { value: 7.5, text: "That counts commission once. You pay it on entry and again on exit." },
          ],
          correct: "Right: 5.00 of spread plus 5.00 of commission.",
        },
        after: "10.00, or 0.20 per unit. The simulator rounds each fee up to the cent, 2.51 + 2.50, so it charges 10.01.",
        concept: "trading-costs",
      },
      {
        kind: "predict",
        title: "Back to zero",
        prompt: "You've just bought 50 units at the ask, 100.05. The mid is still 100.00. How far must the mid rise before selling gets you back to zero?",
        control: {
          kind: "choice",
          choices: [
            { id: "none", label: "Not at all: you're at zero now", feedback: "The mid hasn't moved, but you paid the ask and a fee. Selling now gets the bid, 99.95." },
            { id: "spread", label: "0.10, the spread", feedback: "That covers the spread. The two fees add about 0.05 a unit each." },
            { id: "both", label: "About 0.20: the spread plus two fees", feedback: "Right. The bid must climb 0.10 to reach 100.05, and the fees add about 0.10 more." },
          ],
          answer: "both",
        },
        figure: {
          kind: "formula",
          boxes: [{ text: "0.10 spread" }, { text: "0.05 entry fee" }, { text: "0.05 exit fee" }, { text: "0.20 per unit" }],
          operators: ["+", "+", "≈"],
          steps: [
            "The bid must climb 0.10 to reach 100.05, the price you paid.",
            "The entry fee adds about 0.05 a unit.",
            "The exit fee adds about 0.05 more.",
            "Together: about 0.20 a unit before selling gets you back to zero.",
          ],
        },
        reveal: "Costs are paid up front; the price move isn't. That's why a new position's [[unrealised-pnl|open P&L]] starts below zero, even before the mid moves.",
        concept: "trading-costs",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Costs are certain; the price move is not. Each cost looks tiny, so it's easy to ignore. But you pay it on every trade, winning or losing, and it takes a bigger share of the result when price moves only a little.",
      },
    ],
    task: {
      widget: "spread-cost",
      goal: "Set up 100 units at a mid of 50.00, spread 0.10 and commission 0.05%. Enter the round-trip cost before the widget shows it.",
      start: { units: 50, mid: 100.0, spread: 0.1, commissionPct: 0.05 },
      hidden: ["spreadCost", "feeIn", "feeOut", "roundTrip", "breakEven"],
      // [15.00, 15.02] accepts the exact sum (15.00) and what the simulator charges (15.01).
      success: {
        all: [
          { field: "units", eq: 100 },
          { field: "mid", eq: 50.0 },
          { field: "spread", eq: 0.1 },
          { field: "commissionPct", eq: 0.05 },
          { field: "answer", eq: 15.01, tol: 0.01 },
        ],
      },
      feedback: [
        {
          when: {
            not: {
              all: [
                { field: "units", eq: 100 },
                { field: "mid", eq: 50.0 },
                { field: "spread", eq: 0.1 },
                { field: "commissionPct", eq: 0.05 },
              ],
            },
          },
          text: "The widget isn't set to the task yet: 100 units at a mid of 50.00, spread 0.10, commission 0.05%.",
        },
        { when: { field: "answer", eq: 10.0 }, text: "That's the spread alone, 100 × 0.10. Add the commission on both fills." },
        { when: { field: "answer", gte: 12.5, lte: 12.51 }, text: "That counts commission once. You pay it on entry and again on exit." },
        { when: { field: "answer", gte: 5.0, lte: 5.01 }, text: "That's the commission alone. Add the spread: 100 × 0.10 = 10.00." },
        { when: { field: "answer", gte: 20.0, lte: 20.01 }, text: "That's the cost at a mid of 100.00. At 50.00, each fee is about half as big." },
      ],
      correct:
        "Right: 10.00 of spread plus 2.51 + 2.50 of commission is 15.01 vUSD. At half the price, the fee per unit halved; the spread didn't. Now drag Units to 200. The cost roughly doubles, to 30.01: costs scale with size.",
      incorrect: "Add three parts: the spread cost, the entry fee and the exit fee.",
      hints: [
        "A round trip is two fills. Add what you give up on the spread to what you pay in fees.",
        "Spread cost = units × 0.10. Commission = 0.05% of each fill's value, once on entry and once on exit.",
        "Spread: 100 × 0.10 = 10.00. Buy fill: 100 × 50.05 = 5,005.00, so the entry fee is 2.51.",
      ],
      showMe: { units: 100, mid: 50.0, spread: 0.1, commissionPct: 0.05, answer: 15.01 },
      concept: "trading-costs",
    },
    check: ["q-mf-4", "q-mf-5", "q-mf-6"],
    recap: {
      takeaways: [
        "You buy at the ask and sell at the bid. The mid sits between them; the gap is the spread.",
        "A round trip costs the spread once plus commission twice: about 0.20 per unit at 100.00.",
        "Costs are paid up front, so every new position starts slightly behind, even if the mid hasn't moved.",
      ],
      next: "Next, 1.1.2: long and short. With the round-trip cost known, see how buying first or selling first makes or loses money.",
    },
  },

  // L03 · Market and limit orders
  L03: {
    unit: "1.3",
    courseId: "1.3.1",
    bridge: "Unit 1.2 ended in 1.2.7 with what a chart can't tell you. Unit 1.3 moves from reading to acting: the orders that get you in and out. In 1.1.1 you bought at the ask; here you choose between filling now and waiting for your price.",
    hook: {
      prompt: "LABX is at 100.00 on the chart. You leave an order to buy at 99.00 or lower. How low must the chart price go before it [[fill|fills]]?",
      control: { kind: "slider", min: 98.8, max: 99.2, step: 0.05, start: 99.2, answer: 98.95, tolerance: 0 },
      figure: {
        kind: "chart",
        // The level sits in the base layers so it shows before the answer; the MID cursor is the slider.
        chart: { candles: L03_HISTORY, layers: [{ kind: "level", price: 99.0, role: "entry", label: "BUY 99.00" }] },
        steps: [{ text: "The chart now: 100.00. Your buy order waits at 99.00." }],
      },
      compare: "You said {yours}. The chart, the mid, had to reach 98.95: a buy fills at the ask, 0.05 above the mid.",
      concept: "limit-order",
    },
    learn: [
      {
        kind: "explain",
        text: "An **order** is an instruction to buy or sell. The two basic types answer one question differently: what matters more right now, getting filled or getting a particular price? A [[market-order]] buys or sells immediately at the best price available. A [[limit-order]] buys or sells only at your chosen price or better.",
      },
      {
        kind: "figure",
        figure: {
          kind: "chart",
          // The future stays under the veil; it only gives the two paths room after "now".
          chart: { candles: [...L03_HISTORY, ...L03_B6_FUTURE], visible: 10 },
          steps: [
            {
              text: "[[mid-price|Mid]] now 100.00. The [[ask]] is 100.05, the [[bid]] 99.95.",
              layers: [
                { kind: "level", price: 100.05, role: "neutral", label: "ASK 100.05", chip: true },
                { kind: "level", price: 99.95, role: "neutral", label: "BID 99.95", chip: true },
              ],
            },
            {
              text: "A market buy fills at once, at the ask: 100.05.",
              layers: [{ kind: "marker", index: 9, price: 100.05, label: "MARKET BUY 100.05", role: "accent" }],
            },
            {
              text: "A buy limit at 99.00 waits below. It needs the ask at 99.00: a mid of 98.95.",
              layers: [{ kind: "level", price: 99.0, role: "entry", label: "BUY LIMIT 99.00" }],
            },
            {
              text: "Path one dips to 98.90: filled at 99.00. Path two keeps rising: never filled.",
              // Path one's mid passes 98.95 (ask 99.00) 0.9 of the way from 99.40 to 98.90: index 14.7.
              layers: [L03_PATH_FILLED, { kind: "marker", index: 14.7, price: 99.0, label: "FILLED 99.00", role: "accent" }, L03_PATH_MISSED],
            },
          ],
        },
      },
      {
        kind: "explain",
        text: "**Market orders: certainty of a fill.** A market buy fills at the ask, a market sell at the bid. The simulator uses the current ask or bid. In real markets a fast move can fill you worse than the price you saw: [[slippage]]. Use one when the plan says 'enter now' and being in matters more than a few cents.",
      },
      {
        kind: "explain",
        text: "**Limit orders: certainty of price.** A **buy limit** sits below the current price: buy only at 99.00 or lower. A **sell limit** sits above it: sell only at 102.00 or higher. A buy limit fills only if the ask trades at or through your limit; a sell limit, only if the bid does. If it never fills, there's no trade.",
      },
      {
        kind: "match",
        prompt: "LABX mid is 100.00. Match each plan to the order that carries it out.",
        pairs: [
          { left: "Get in now, whatever the price", right: "Market buy", wrong: "A limit waits for its price. 'Now' needs a market order." },
          { left: "Buy only on a dip to 99.50 or lower", right: "Buy limit at 99.50", wrong: "A market buy fills now at 100.05, above your 99.50." },
          { left: "Sell only at 102.00 or higher", right: "Sell limit at 102.00", wrong: "A market sell fills now at the bid, 99.95, not at 102.00." },
          { left: "Get out now", right: "Market sell", wrong: "A sell limit waits above the price. 'Now' needs a market sell." },
        ],
        concept: "market-order",
      },
      {
        kind: "reveal",
        title: "Same idea, two orders",
        prompt:
          "A market buy of 30 fills now at 100.05. Its [[notional-value|position value]], what the 30 units are worth, is 30 × 100.05 = 3,001.50. A buy limit of 30 waits at 99.00. Reveal the next 12 hours. Then say what happened to the limit.",
        chart: {
          candles: [...L03_HISTORY, ...L03_B6_FUTURE],
          visible: 10,
          layers: [
            { kind: "marker", index: 9, price: 100.05, label: "MARKET BUY 30 · 100.05", role: "accent" },
            { kind: "level", price: 99.0, role: "entry", label: "BUY LIMIT 30 · 99.00" },
          ],
        },
        choices: [
          { id: "filled-limit", label: "Filled at 99.00", feedback: "The ask never got to 99.00. Its lowest was 99.15, at a mid of 99.10." },
          { id: "filled-low", label: "Filled at 99.10", feedback: "A buy limit never fills above its price. And 99.10 was the mid; the ask was 99.15." },
          { id: "not-filled", label: "Not filled", feedback: "Right. The ask bottomed at 99.15, above your limit." },
        ],
        answer: "not-filled",
        after: "At a mid of 99.10 the ask was 99.15, still above 99.00. Coming close isn't enough. The limit did exactly what it was told, and the market order rode the move to 103.00. Missing it is the known cost of a limit, not a mistake.",
        concept: "limit-order",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Neither order is better in general. Decide which one your plan needs before you click. Chasing is a common mistake: price runs away from your limit, you cancel it and buy at market, higher. If the plan said 'only at 99.00', price leaving without you hasn't changed the plan.",
      },
    ],
    task: {
      widget: "order-fill",
      goal: "Place the order that follows your plan, then play the next 12 hours.",
      data: {
        chart: { candles: [...L03_TRY_HISTORY, ...L03_TRY_FUTURE], visible: 10 },
        units: 30,
        plan: "Buy 30 LABX only if price drops to 99.00 or lower.",
      },
      start: { side: "buy", type: "market", limit: 100.0 },
      // Checked at "Place order": the process, not the outcome of the play.
      success: {
        all: [
          { field: "side", eq: "buy" },
          { field: "type", eq: "limit" },
          { field: "limit", eq: 99.0 },
        ],
      },
      feedback: [
        {
          when: { all: [{ field: "side", eq: "buy" }, { field: "type", eq: "market" }] },
          text: "Your market buy filled at once, at 100.05, above the plan's 99.00. It's showing a gain, but the plan was broken, not followed.",
        },
        { when: { field: "side", eq: "sell" }, text: "That's an order to sell. Your plan is to buy." },
        { when: { field: "limit", gte: 100.05 }, text: "A buy limit at or above the ask fills at once, at the ask: 100.05. Your plan said 99.00 or lower." },
        { when: { field: "limit", gt: 99.0 }, text: "At {limit:2}, the order could fill above 99.00, which your plan rules out. Set the limit at 99.00." },
        { when: { field: "limit", lt: 99.0 }, text: "{limit:2} is stricter than your plan, which accepts anything up to 99.00. Set the limit at 99.00." },
      ],
      correct: "Right order for the plan. The ask reached 99.00 in hour 6, so it filled there. Had price kept rising, it would be just as right.",
      hints: [
        "Your plan names a price. Which order type waits for its price?",
        "A buy limit sits below the current price and fills only at its price or lower.",
        "Choose Buy and Limit, then drag the limit line down from 100.00 to 99.00.",
      ],
      showMe: { side: "buy", type: "limit", limit: 99.0 },
      concept: "limit-order",
    },
    check: ["q-ot-1", "q-ot-2", "q-ot-8"],
    recap: {
      takeaways: [
        "Pick the order from the plan: 'enter now' needs a market order, 'only at this price' needs a limit.",
        "A market buy fills at the ask, a market sell at the bid: you cross the spread.",
        "A buy limit fills only when the ask reaches it; a sell limit, when the bid does. Close isn't enough.",
      ],
      next: "Next, 1.3.2: stop-loss and take-profit orders, the two exits you plan as soon as you're in.",
    },
  },

  // L04 · Stop-loss and take-profit orders
  L04: {
    unit: "1.3",
    courseId: "1.3.2",
    bridge: "In 1.3.1 you got in with market and limit orders. Now you plan the way out: a stop for when you're wrong, a target for when you're right. The normal candles and gaps from 1.2.5 show where a stop sits and how it fills.",
    hook: {
      prompt: "You buy LABX at 100.00 because [[support]] near 98.00, a floor where falls have stopped, has held three times. Drag the line to where you'd get out if you're wrong.",
      // A stop level dragged on the lesson chart; {yours} is its price. There is no single right answer.
      control: { kind: "slider", min: 95.0, max: 99.9, step: 0.01, start: 99.5 },
      figure: {
        kind: "chart",
        // Base layers, so they show before the answer; the resistance zone is left out on purpose (Try only).
        chart: { candles: L04_CHART, layers: [L04_SUPPORT, L04_ENTRY] },
        steps: [{ text: "You bought at 100.00. The shaded band is support, where three dips stopped." }],
      },
      compare: "You put your exit at {yours}. Support runs down to 97.90; a stop just beyond it, like 97.70, is hit only if support breaks.",
      concept: "stop-loss-order",
    },
    learn: [
      {
        kind: "explain",
        text: "A [[stop-loss]] (SL) is an [[exit]] order that closes your position if price moves against you to a level you chose in advance. A [[take-profit]] (TP) closes it if price reaches your target. Both are decided before [[entry]], while you're calm, and stay attached to the position, so they work while you're not watching.",
      },
      {
        kind: "explain",
        text: "For a [[long]] position the stop sits below the entry. It's a [[stop-order]]: when the bid touches it, it becomes a market order to sell, usually filling at the stop or very close. If price [[gap|gaps]] through it, opening beyond the stop with no trading in between, it fills at the open, worse than the stop.",
      },
      {
        kind: "worked",
        title: "A gap through the stop",
        lines: [
          "Long 25 units bought at 100.00, stop at 96.00.",
          "Planned loss: 25 × (100.00 − 96.00) = 100.00 before commission: 1% of 10,000.00.",
          "The next candle opens with the bid at 94.00.",
          "The stop fills at 94.00. Loss: 25 × (100.00 − 94.00) = ?",
        ],
        ask: {
          answer: 150.0,
          tolerance: 0,
          unit: "vUSD",
          feedback: [
            { value: 100.0, text: "That's the planned loss, at 96.00. After the gap the stop filled at 94.00." },
            { value: 50.0, text: "That's only the extra from the gap. Measure from the entry, 100.00." },
          ],
          correct: "Right: 150.00, which is 50.00 more than planned.",
        },
        after: "The gap added 50.00. A stop limits the loss you plan for; it doesn't guarantee it.",
        concept: "gap-risk",
      },
      {
        kind: "figure",
        figure: {
          kind: "chart",
          chart: { candles: [...L04_CHART, ...L04_FUTURE], visible: 24 },
          steps: [
            {
              text: "You bought at 100.00 because support near 98.00 held three times.",
              layers: [L04_SUPPORT, L04_ENTRY],
            },
            {
              text: "A stop at 97.95, a few cents under 98.00, sits inside the zone, where wicks already poked.",
              layers: [{ kind: "level", price: 97.95, role: "stop", label: "STOP 97.95" }],
            },
            {
              text: "The next dip reaches 97.94. Support holds, but that stop fills at 97.95. Price then climbs to 101.40.",
              visible: 30,
              layers: [{ kind: "marker", index: 25, price: 97.95, label: "STOPPED 97.95", role: "down" }],
            },
            {
              text: "At 97.70, beyond the zone, the stop is hit only if support breaks: the [[invalidation]] point, where the idea fails.",
              layers: [
                { kind: "level", price: 97.7, role: "stop", label: "STOP 97.70" },
                { kind: "bracket", from: 97.9, to: 97.7, label: "BUFFER 0.20", role: "concept" },
              ],
            },
          ],
        },
      },
      {
        kind: "explain",
        text: "A take-profit works like a limit order on the way out. For a long, it sells when the bid reaches your target, at that price or better. Put it where the plan says price could reasonably go, such as the next [[resistance]], a ceiling where rises have stalled, not at a number picked to make the trade look attractive.",
      },
      {
        kind: "worked",
        title: "A bracket, measured in R",
        lines: [
          "Stop plus target on one entry: a [[bracket-order|bracket]]. When one fills, the other is cancelled. [[r|1R]] is the loss at your stop.",
          "Long 40 bought at 100.00, stop 99.00, target 102.00.",
          "Risk: 40 × (100.00 − 99.00) = 40.00 vUSD = 1R.",
          "Reward: 40 × (102.00 − 100.00) = 80.00 vUSD.",
          "In R: 80.00 ÷ 40.00 = ?",
        ],
        ask: {
          answer: 2,
          tolerance: 0,
          unit: "R",
          feedback: [
            { value: 0.5, text: "That's risk ÷ reward. Divide the reward by the risk." },
            { value: 40, text: "Express the reward in units of risk: 80.00 ÷ 40.00." },
            { value: 80, text: "Express the reward in units of risk: 80.00 ÷ 40.00." },
          ],
          correct: "Right: the target is twice as far as the stop, so +2R.",
        },
        after: "+2R, before costs.",
        concept: "bracket-order",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Choose the stop first, then size the position to fit it. Moving a stop further away as price approaches it is a common mistake: it turns a planned, sized loss into a larger, unplanned one. Move a stop only in the direction that reduces risk.",
      },
    ],
    task: {
      widget: "bracket-builder",
      goal: "Your idea: support near 98.00 holds and price returns to resistance near 104.00. Place the stop just beyond support and the target at resistance.",
      // The widget draws the entry level and both brackets itself.
      data: { chart: { candles: L04_CHART, layers: [L04_SUPPORT, L04_RESISTANCE] }, entry: 100.0, units: 25 },
      start: { stop: 99.5, target: 101.0, units: 25 },
      locked: ["units"],
      success: {
        all: [
          { field: "stop", gte: 97.4 },
          { field: "stop", lte: 97.8 },
          { field: "target", gte: 103.6 },
          { field: "target", lte: 104.0 },
        ],
      },
      feedback: [
        { when: { field: "stop", gte: 97.9 }, text: "A stop at {stop:2} sits above or inside the support zone, where ordinary noise reaches. It can be hit while the idea is still right." },
        { when: { field: "stop", gt: 97.8 }, text: "Just under the zone, with almost no room. A poke to the zone's edge, 97.90, puts the bid at 97.85. Leave about 0.10 or more." },
        { when: { field: "stop", lt: 97.4 }, text: "That stop is beyond support but far from it. The extra distance adds loss without telling you more about the idea." },
        { when: { field: "target", gt: 104.0 }, text: "That target sits beyond the resistance where rises have stalled. Your plan gives no reason to expect more." },
        { when: { field: "target", lt: 103.6 }, text: "That target stops short of the level your plan names. Set it at the resistance, 103.80–104.00." },
      ],
      correct: "Right. Stop where the idea fails, target where the plan points. This bracket is {rr:2}R, and the chart set it, not a wish.",
      hints: [
        "Start with the stop. Where would 'support holds' be proven wrong?",
        "The stop goes a little below the support zone, under 97.90. The target goes at the resistance zone, 103.80–104.00.",
        "Drag the stop to 97.70, 0.20 under the zone. Loss at the stop: 25 × 2.30 = 57.50 vUSD, your 1R.",
      ],
      showMe: { stop: 97.7, target: 103.8 },
      concept: "bracket-order",
    },
    check: ["q-ot-6", "q-ot-7", "q-ot-9"],
    recap: {
      takeaways: [
        "Put the stop where the idea is proven wrong, just beyond the level, not where the loss feels small.",
        "A stop becomes a market order when touched. After a gap, it fills at the open, worse than planned.",
        "Set the take-profit where the plan says price can go, such as the next resistance. Measure both exits in R.",
      ],
      next: "Next, 1.3.3: stop entries and stop-limit orders, where the same trigger gets you into a breakout instead of out of a trade.",
    },
  },
};

/** Glossary terms these lessons introduce that the glossary didn't have. */
export const TERMS_U1: GlossaryTerm[] = [];
/** Concepts these lessons introduce that the concept library didn't have. */
export const CONCEPTS_U1: Concept[] = [];
