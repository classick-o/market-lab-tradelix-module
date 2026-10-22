import type { CandleData, ChartLayer, ChartSpec, Concept, GlossaryTerm, Lesson, MarkRole, Question, TaskData, UnitContent } from "../../types";

/** Unit 3.3 · Order flow (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */

/** One candle, in price units with 2 decimals; `v` is the volume in units (in PACE, the number of prints). */
const k = (o: number, h: number, l: number, c: number, v?: number): CandleData => (v === undefined ? { o, h, l, c } : { o, h, l, c, v });

// ─── Data ─────────────────────────────────────────────────────────────────────
// Every bar below is built from a synthetic trade tape (price, size, aggressor) generated and checked with a
// script: OHLC, volume, delta, CVD, footprint rows and imbalance ratios all come from the same trades.

/** 3.3.1 pace: 12 five-second bars; `v` is the number of prints. Prints per bar rise 4 → 19 while price climbs 100.00 → 100.12, then price slips back to 100.04. */
const PACE: CandleData[] = [
  k(100.00, 100.02, 99.99, 100.01, 4),
  k(100.01, 100.03, 100.00, 100.03, 6),
  k(100.03, 100.06, 100.02, 100.05, 9),
  k(100.05, 100.09, 100.04, 100.08, 12),
  k(100.08, 100.11, 100.07, 100.10, 16),
  k(100.10, 100.13, 100.09, 100.12, 19),
  k(100.12, 100.13, 100.07, 100.08, 17),
  k(100.08, 100.10, 100.04, 100.05, 13),
  k(100.05, 100.07, 100.02, 100.06, 9),
  k(100.06, 100.08, 100.03, 100.04, 7),
  k(100.04, 100.06, 100.01, 100.03, 5),
  k(100.03, 100.05, 100.01, 100.04, 4),
];

/** 3.3.2 fake wall: nine 1-minute bars climbing toward a 2,000-unit offer at 100.20. It is pulled with price at 100.17 (bar 6 high); bars 7–9 trade through to 100.28. */
const WALL: CandleData[] = [
  k(100.05, 100.09, 100.03, 100.08, 410),
  k(100.08, 100.12, 100.06, 100.11, 410),
  k(100.11, 100.13, 100.08, 100.10, 350),
  k(100.10, 100.15, 100.09, 100.14, 420),
  k(100.14, 100.16, 100.12, 100.15, 370),
  k(100.15, 100.17, 100.13, 100.17, 380),
  k(100.17, 100.23, 100.16, 100.22, 700),
  k(100.22, 100.27, 100.20, 100.26, 660),
  k(100.26, 100.28, 100.22, 100.24, 460),
];

/** 3.3.4: five 15-minute bars (deltas +295, +120, −80, +60, −40; CVD 295, 415, 335, 395, 355; highs 100.80 at bar 2 and 101.10 at bar 4). */
const CVD5: CandleData[] = [
  k(100.00, 100.42, 99.96, 100.38, 1105),
  k(100.38, 100.80, 100.33, 100.70, 1000),
  k(100.70, 100.74, 100.45, 100.52, 840),
  k(100.52, 101.10, 100.50, 100.98, 1000),
  k(100.98, 101.02, 100.80, 100.86, 700),
];

/** 3.3.4 rally: the same five bars, then three bars from 100.86 to 101.16 with deltas −10, −20, −10. */
const CVD8: CandleData[] = [
  k(100.00, 100.42, 99.96, 100.38, 1105),
  k(100.38, 100.80, 100.33, 100.70, 1000),
  k(100.70, 100.74, 100.45, 100.52, 840),
  k(100.52, 101.10, 100.50, 100.98, 1000),
  k(100.98, 101.02, 100.80, 100.86, 700),
  k(100.86, 100.98, 100.85, 100.96, 290),
  k(100.96, 101.07, 100.94, 101.06, 260),
  k(101.06, 101.17, 101.04, 101.16, 240),
];

/** 3.3.4 anchors: two sessions of six bars. Highs: A 101.00 (bar 5), B 101.20 (bar 10), C 101.30 (bar 12). */
const ANCH: CandleData[] = [
  k(100.20, 100.42, 100.15, 100.38, 950),
  k(100.38, 100.60, 100.32, 100.55, 920),
  k(100.55, 100.58, 100.40, 100.45, 700),
  k(100.45, 100.85, 100.42, 100.80, 1000),
  k(100.80, 101.00, 100.74, 100.90, 950),
  k(100.90, 100.94, 100.70, 100.76, 700),
  k(100.70, 100.88, 100.66, 100.84, 750),
  k(100.84, 100.90, 100.72, 100.78, 650),
  k(100.78, 101.02, 100.75, 100.98, 740),
  k(100.98, 101.20, 100.95, 101.12, 760),
  k(101.12, 101.14, 100.90, 100.96, 690),
  k(100.96, 101.30, 100.93, 101.25, 740),
];

/** Session CVD (resets at each open) and continuous CVD (from 300, anchored days earlier) of ANCH. */
const ANCH_SESSION1: (number | null)[] = [250,450,350,650,900,800,null,null,null,null,null,null];
const ANCH_SESSION2: (number | null)[] = [null,null,null,null,null,null,150,100,200,300,50,150];
const ANCH_CONT: (number | null)[] = [550,750,650,950,1200,1100,1250,1200,1300,1400,1150,1250];

/** 3.3.5 absorption: six 1-minute bars at 99.50–99.52 (1,800 sold into the 99.50 bid, 300 bought; delta −1,500), then branch A: the passive buyer still had size and price lifts to 99.80. */
const ABSORB: CandleData[] = [
  k(99.51, 99.52, 99.50, 99.50, 360),
  k(99.50, 99.52, 99.50, 99.51, 390),
  k(99.52, 99.52, 99.50, 99.50, 320),
  k(99.50, 99.51, 99.50, 99.50, 430),
  k(99.50, 99.52, 99.50, 99.51, 350),
  k(99.50, 99.52, 99.50, 99.51, 250),
  k(99.51, 99.56, 99.50, 99.55, 680),
  k(99.55, 99.63, 99.54, 99.62, 710),
  k(99.62, 99.66, 99.58, 99.60, 620),
  k(99.60, 99.72, 99.59, 99.70, 760),
  k(99.70, 99.80, 99.68, 99.77, 760),
  k(99.77, 99.79, 99.71, 99.74, 560),
];

/** 3.3.5 branch B as a path: the buyer had 200 left; 99.50 gives way, trades print below 99.48 and price falls to 99.30. */
const BRANCH_B = [{"index":5,"price":99.51},{"index":6,"price":99.47},{"index":7,"price":99.42},{"index":8,"price":99.38},{"index":9,"price":99.33},{"index":10,"price":99.3},{"index":11,"price":99.32}];

/** 3.3.5 exhaustion: six 15-minute bars. Deltas +220, +290, +380, +450, +300, then a new high (101.12) on 340 units with delta +30. */
const EXHAUST: CandleData[] = [
  k(100.00, 100.20, 99.97, 100.18, 820),
  k(100.18, 100.42, 100.15, 100.40, 910),
  k(100.40, 100.64, 100.37, 100.62, 920),
  k(100.62, 100.90, 100.60, 100.88, 1110),
  k(100.88, 101.07, 100.85, 101.05, 980),
  k(101.05, 101.12, 101.02, 101.08, 340),
];

/** 3.3.6 iceberg: ten 1-minute bars. The bid at 100.00 shows 50 throughout; 600 sell into it in fills of 50 (12 slices), and 50 still shows. */
const ICE: CandleData[] = [
  k(100.00, 100.03, 100.00, 100.03, 130),
  k(100.01, 100.02, 100.00, 100.00, 70),
  k(100.00, 100.04, 100.00, 100.04, 140),
  k(100.01, 100.02, 100.00, 100.00, 60),
  k(100.00, 100.03, 100.00, 100.03, 75),
  k(100.01, 100.02, 100.00, 100.00, 115),
  k(100.00, 100.04, 100.00, 100.04, 80),
  k(100.01, 100.03, 100.00, 100.00, 70),
  k(100.01, 100.05, 100.01, 100.05, 40),
  k(100.01, 100.03, 100.00, 100.00, 75),
];

/** 3.3.7 synthetic replay: ten 1-minute bars drifting from 100.40 to 100.21 under a ladder of large offers. */
const SPOOF: CandleData[] = [
  k(100.40, 100.42, 100.36, 100.37, 440),
  k(100.37, 100.39, 100.33, 100.34, 410),
  k(100.34, 100.37, 100.32, 100.35, 400),
  k(100.35, 100.36, 100.30, 100.31, 420),
  k(100.31, 100.33, 100.27, 100.28, 410),
  k(100.28, 100.31, 100.26, 100.30, 400),
  k(100.30, 100.31, 100.25, 100.26, 400),
  k(100.26, 100.28, 100.22, 100.23, 390),
  k(100.23, 100.26, 100.21, 100.25, 370),
  k(100.25, 100.26, 100.20, 100.21, 390),
];

/** Nearest and farthest of the five layered offers in SPOOF: 3 and 7 ticks above the best ask (close + 0.01). */
const SPOOF_NEAR = [{"index":0,"price":100.41},{"index":1,"price":100.38},{"index":2,"price":100.39},{"index":3,"price":100.35},{"index":4,"price":100.32},{"index":5,"price":100.34},{"index":6,"price":100.3},{"index":7,"price":100.27},{"index":8,"price":100.29},{"index":9,"price":100.25}];
const SPOOF_FAR = [{"index":0,"price":100.45},{"index":1,"price":100.42},{"index":2,"price":100.43},{"index":3,"price":100.39},{"index":4,"price":100.36},{"index":5,"price":100.38},{"index":6,"price":100.34},{"index":7,"price":100.31},{"index":8,"price":100.33},{"index":9,"price":100.29}];

/** 3.3.8: thirteen 30-minute periods, A to M (high, low and the prices touched make the TPO profile). IB (A+B) 100.10–100.70; day 100.00–101.00; close 100.40. */
const TPO_DAY: CandleData[] = [
  k(100.50, 100.70, 100.30, 100.40),
  k(100.40, 100.40, 100.10, 100.20),
  k(100.20, 100.20, 100.00, 100.20),
  k(100.20, 100.60, 100.20, 100.50),
  k(100.50, 100.50, 100.30, 100.40),
  k(100.40, 100.60, 100.40, 100.60),
  k(100.60, 100.70, 100.50, 100.70),
  k(100.70, 100.90, 100.70, 100.90),
  k(100.90, 101.00, 100.80, 100.80),
  k(100.80, 100.80, 100.60, 100.70),
  k(100.70, 100.70, 100.50, 100.50),
  k(100.50, 100.60, 100.50, 100.50),
  k(100.50, 100.50, 100.40, 100.40),
];

/** TPO letters per row of TPO_DAY, from 101.0 down to 100.0. */
const TPO_ROWS: [string, string][] = [["101.0","I"],["100.9","HI"],["100.8","HIJ"],["100.7","AGHJK"],["100.6","ADFGJKL"],["100.5","ADEFGKLM"],["100.4","ABDEFM"],["100.3","ABDE"],["100.2","BCD"],["100.1","BC"],["100.0","C"]];

// ─── Shared helpers and layers ──────────────────────────────────────────────

/** Flat placeholder candles for diagrams drawn only with layers (`hideCandles`). */
const blank = (n: number, p = 100): CandleData[] => Array.from({ length: n }, () => ({ o: p, h: p, l: p, c: p }));
/** A labelled horizontal level. */
const lvl = (price: number, label: string, role: "neutral" | "support" | "resistance" | "concept" | "stop" = "neutral", chip = true): ChartLayer => ({ kind: "level", price, role, label, chip });
/** A labelled dot at a candle's high (or low). */
const mk = (index: number, label: string, role: MarkRole, at: "high" | "low" = "high"): ChartLayer => ({ kind: "marker", index, at, label, role });
/** A dot at a given price. */
const pt = (index: number, price: number, role: MarkRole, label?: string): ChartLayer => (label ? { kind: "marker", index, price, role, label } : { kind: "marker", index, price, role });
/** An indicator line on a pane. */
const ln = (values: (number | null)[], label: string, role: MarkRole = "accent", dashed = false): ChartLayer => ({ kind: "line", values, role, label, dashed });

/** A footprint drawn as a ladder: one level per price (0.01 apart), labelled bid × ask; the price sits in the axis chip. */
const footprintChart = (rows: [number, number, number][], describe: string): ChartSpec => ({
  candles: blank(1, rows[0][0]),
  hideCandles: true,
  range: [rows[rows.length - 1][0] - 0.005, rows[0][0] + 0.005],
  height: 250,
  describe,
  layers: rows.map(([price, bid, ask]) => lvl(price, `${bid} × ${ask}`)),
});
/** A tap zone covering one footprint row. */
const rowZone = (id: string, price: number, feedback?: string) => (feedback ? { id, label: price.toFixed(2), from: price - 0.005, to: price + 0.005, feedback } : { id, label: price.toFixed(2), from: price - 0.005, to: price + 0.005 });

/** 3.3.3 B1: one 1-minute bar, rebuilt from its 34 prints. Rows: price, volume at the bid (aggressive sells), volume at the ask (aggressive buys). Ask 505, bid 210, delta +295, POC 100.04 (180). */
const FP1: [number, number, number][] = [
  [100.06, 10, 5],
  [100.05, 40, 60],
  [100.04, 30, 150],
  [100.03, 25, 120],
  [100.02, 20, 110],
  [100.01, 35, 40],
  [100.0, 50, 20],
];
/** 3.3.3 Try: the next bar. Ask 250, bid 395, delta −145, POC 100.22 (165); opened 100.20, closed 100.23. Sell imbalances 6:1 at 100.24 and 3.6:1 at 100.23. */
const FP2: [number, number, number][] = [
  [100.25, 15, 10],
  [100.24, 60, 25],
  [100.23, 90, 40],
  [100.22, 110, 55],
  [100.21, 70, 60],
  [100.2, 50, 60],
];
const FP1_CHART = footprintChart(FP1, "A footprint bar, bid × ask at each price: 100.06 10 × 5, 100.05 40 × 60, 100.04 30 × 150, 100.03 25 × 120, 100.02 20 × 110, 100.01 35 × 40, 100.00 50 × 20.");
const FP2_CHART = footprintChart(FP2, "The next footprint bar, bid × ask: 100.25 15 × 10, 100.24 60 × 25, 100.23 90 × 40, 100.22 110 × 55, 100.21 70 × 60, 100.20 50 × 60.");

/** Card sorting with the bias-spotter widget: a wrong pick explains what that option means, then what this card shows. */
interface SortOption {
  id: string;
  label: string;
  what: string;
}
interface SortCard {
  id: string;
  text: string;
  answer: string;
  correct: string;
  clue: string;
  override?: Record<string, string>;
}
const cardSort = (options: SortOption[], cards: SortCard[]): TaskData => ({
  options: options.map(({ id, label }) => ({ id, label })),
  cards: cards.map((c) => ({
    id: c.id,
    text: c.text,
    answer: c.answer,
    correct: c.correct,
    rationales: Object.fromEntries(options.filter((o) => o.id !== c.answer).map((o) => [o.id, c.override?.[o.id] ?? `${o.what} ${c.clue}`])),
  })),
});

// 3.3.1 Try: classify prints by the quote rule.
const PRINT_CARDS = cardSort(
  [
    { id: "buy", label: "Buyer-initiated", what: "A buyer-initiated print happens at the ask." },
    { id: "sell", label: "Seller-initiated", what: "A seller-initiated print happens at the bid." },
    { id: "mid", label: "Can't tell from the quotes", what: "Only a print between the quotes leaves the quote rule without an answer." },
  ],
  [
    { id: "p1", text: "Bid 99.95, ask 100.05. 300 units trade at 100.05.", answer: "buy", correct: "Buyer-initiated: the print is at the ask, so the buyer crossed the spread.", clue: "Here the print is at the ask, 100.05." },
    { id: "p2", text: "Bid 100.10, ask 100.20. 1,200 units trade at 100.10.", answer: "sell", correct: "Seller-initiated: a seller hit the bid. A big size doesn't change who crossed.", clue: "Here the print is at the bid, 100.10." },
    { id: "p3", text: "Bid 99.95, ask 100.05. 5,000 units trade at 100.00.", answer: "mid", correct: "Can't tell: 100.00 is the midpoint. A rule would fall back on the tick rule, which is a guess.", clue: "Here the print sits exactly between the quotes." },
    { id: "p4", text: "Bid 99.98, ask 100.08. 200 units trade at 100.08. The print before was 100.12.", answer: "buy", correct: "Buyer-initiated: it's at the ask. The tick rule would call this downtick a sell, and be wrong.", clue: "Here the print is at the ask, whatever the last price was." },
    { id: "p5", text: "Bid 100.03, ask 100.13. 400 units trade at 100.03. The print before was 99.98.", answer: "sell", correct: "Seller-initiated: it's at the bid. The quotes rose, so the price ticked up, but a seller crossed.", clue: "Here the print is at the bid, even though price ticked up." },
    { id: "p6", text: "Bid 100.20, ask 100.30. 50 units trade at 100.30, then 50 more at 100.30.", answer: "buy", correct: "Both buyer-initiated: each print is at the ask.", clue: "Here both prints are at the ask." },
  ],
);

// 3.3.2 Try: tag large-order events on a DOM replay.
const DOM_CARDS = cardSort(
  [
    { id: "pulled", label: "Pulled", what: "Pulled size is cancelled as price approaches, without trading." },
    { id: "stacked", label: "Stacked", what: "Stacking adds size to a level before it trades." },
    { id: "reloaded", label: "Reloaded", what: "Reloading is the same size reappearing after it trades." },
    { id: "absorbed", label: "Absorbed", what: "Absorption is heavy trading at a level that holds." },
  ],
  [
    { id: "e1", text: "A 900-unit bid at 99.80. Price falls to 99.83, and the bid drops to zero with no trades at 99.80.", answer: "pulled", correct: "Pulled: it vanished before any trade reached it.", clue: "Here the size left before a single trade." },
    { id: "e2", text: "300 units offered at 100.40 trade in full. Within a second, 300 show again at 100.40. It happens three times.", answer: "reloaded", correct: "Reloaded: the same 300 came back after each fill, a typical iceberg trace.", clue: "Here the same 300 returns after each fill." },
    { id: "e3", text: "The bid at 99.90 grows from 150 to 1,100 units in a minute, in several adds, before anything trades there.", answer: "stacked", correct: "Stacked: size arrived at the level. Whether it stays is another question.", clue: "Here size is added before anything trades." },
    { id: "e4", text: "Sellers hit 99.75 with 1,400 units over five minutes. No trade prints below 99.75.", answer: "absorbed", correct: "Absorbed: heavy selling, no progress. Someone passive took it all, for now.", clue: "Here 1,400 traded at the level and price didn't get through." },
    { id: "e5", text: "A 2,000-unit offer at 100.20 vanishes with price at 100.17. Nothing traded at 100.20.", answer: "pulled", correct: "Pulled: the fake wall from the replay. It left without a single trade.", clue: "Here the size disappeared before trading." },
  ],
);

// 3.3.5 Try: name the read in each snapshot.
const READ_CARDS = cardSort(
  [
    { id: "buyer", label: "Passive buyer absorbing", what: "A passive buyer absorbs heavy selling at a level that holds." },
    { id: "seller", label: "Passive seller absorbing", what: "A passive seller absorbs heavy buying at a level that holds." },
    { id: "exhaust", label: "Exhaustion", what: "Exhaustion is aggressive volume drying up at a new extreme." },
    { id: "none", label: "No clear read", what: "'No clear read' fits when no side shows heavy effort without result or fading aggression." },
  ],
  [
    { id: "s1", text: "Buyers lift 101.20 with 1,600 units in five minutes. No trade prints above 101.20. Delta +1,300.", answer: "seller", correct: "Passive seller absorbing: heavy buying, no progress. Invalidated by trades above 101.22.", clue: "Here buyers are the aggressors and 101.20 holds." },
    { id: "s2", text: "Sellers hit 98.80 with 2,200 units. The bid keeps refilling; price holds between 98.80 and 98.82.", answer: "buyer", correct: "Passive buyer absorbing. Invalidated by trades below 98.78.", clue: "Here sellers are the aggressors and 98.80 holds." },
    { id: "s3", text: "After a fall, a new low at 97.40 trades just 280 units with delta −20, against 1,000 or more on earlier bars.", answer: "exhaust", correct: "Exhaustion at the low: selling dried up. Invalidated by a new low with heavy selling.", clue: "Here aggression fades at a new extreme." },
    { id: "s4", text: "Price drifts 0.10 higher on average volume, delta +120. No level is being tested.", answer: "none", correct: "No clear read: ordinary two-way trade, no effort without result, no fading extreme.", clue: "Here volume is average and no level is under pressure." },
    { id: "s5", text: "A new high at 102.50 on 1,900 units and delta +900, the busiest bar of the move.", answer: "none", correct: "No clear read for a fade: aggression rose at the new high. That's momentum, the condition that kills an exhaustion read.", clue: "Here volume and delta rise at the new extreme.", override: { exhaust: "Exhaustion needs aggression fading at the extreme. Here volume and delta are the highest of the move: momentum." } },
  ],
);

// 3.3.6 Try: iceberg or not?
const ICEBERG_CARDS = cardSort(
  [
    { id: "ice", label: "Iceberg", what: "An iceberg trades well beyond its displayed size and refills again and again." },
    { id: "not", label: "Not an iceberg", what: "'Not an iceberg' fits when traded volume stays within what was displayed." },
    { id: "early", label: "Too early to tell", what: "'Too early' fits a single refill, which a new order could explain." },
  ],
  [
    { id: "c1", text: "Bid 99.80 shows 40. Over eight minutes, 520 trade there, and 40 reappear after each fill.", answer: "ice", correct: "Iceberg: 520 traded against 40 shown, refilled again and again. At least 480 were hidden.", clue: "Here 520 traded against 40 shown." },
    { id: "c2", text: "Offer 100.40 shows 1,500 for ten minutes. Nothing trades there.", answer: "not", correct: "Not an iceberg: no hidden size has shown itself. It's displayed size, maybe a wall, untested.", clue: "Here nothing traded at all." },
    { id: "c3", text: "Offer 100.10 shows 100. 100 trade, and the level empties.", answer: "not", correct: "Not an iceberg: it filled and was gone. Traded matched displayed.", clue: "Here traded volume equals displayed size, and the level emptied." },
    { id: "c4", text: "Bid 99.95 shows 30. 30 trade, then 30 show again. Nothing more happens.", answer: "early", correct: "Too early: one refill could be an iceberg or another trader joining. You need repeats.", clue: "Here there's just one refill." },
    { id: "c5", text: "Offer 100.25 shows 25. Buyers lift 400 there; 25 keep showing after each fill.", answer: "ice", correct: "Iceberg: 400 traded against 25 shown. At least 375 were hidden.", clue: "Here 400 traded against 25 shown." },
  ],
);

// 3.3.7 Try: the surveillance desk.
const DESK_CARDS = cardSort(
  [
    { id: "spoof", label: "Spoofing signature", what: "The spoofing signature: big orders off the touch, constant re-pricing, almost no fills, trades on the other side." },
    { id: "mm", label: "Market making", what: "Market making quotes both sides at the touch and ends near flat." },
    { id: "genuine", label: "Genuine orders", what: "Genuine orders are placed to trade, and often fill." },
    { id: "unknown", label: "Can't tell", what: "'Can't tell' fits when there's too little activity to show a pattern." },
  ],
  [
    { id: "a1", text: "Agent A: offers of 250 lots, 3–5 ticks above the best ask, re-priced 2,100 times an hour. Cancel-to-fill 99:1. Its fills: buys at the bid.", answer: "spoof", correct: "Spoofing signature: all four signals line up. Intent is for investigators, but this pattern gets reported.", clue: "Here every signal on the list is present." },
    { id: "a2", text: "Agent B: quotes both sides at the touch all day, cancels 9:1, ends the day nearly flat.", answer: "mm", correct: "Market making: heavy cancelling is part of quoting, and both sides fill.", clue: "Here the orders sit at the touch on both sides." },
    { id: "a3", text: "Agent C: buy orders at five prices below the market. Three fill as price dips; the rest stay until the close.", answer: "genuine", correct: "Genuine layering: orders willing to fill, and they did.", clue: "Here the orders rest until they fill." },
    { id: "a4", text: "Agent D: one 500-lot bid at the touch, half filled, the rest cancelled after a news headline.", answer: "genuine", correct: "Genuine: a real order, partly filled, then cancelled for a reason.", clue: "Here the order traded, then was cancelled after news." },
    { id: "a5", text: "Agent E: a single 300-lot offer appears and is cancelled 40 seconds later. No other activity.", answer: "unknown", correct: "Can't tell: one pulled order fits many innocent stories.", clue: "Here there's one order and nothing else." },
  ],
);

/** 3.3.4: offers resting within 0.05 above price, from the engine log, after bar 5 and after each rally bar. */
const OFFERS_NEAR: (number | null)[] = [null, null, null, null, 2400, 1500, 900, 500];
/** 3.3.6 B5: a tape summary for four prices over ten minutes. */
const ICE_LEVELS: ChartLayer[] = [
  lvl(100.2, "OFFER SHOWS 600 · TRADED 0"),
  lvl(100.1, "OFFER SHOWS 40 · TRADED 380 · STILL 40"),
  lvl(100.0, "BID SHOWS 150 · TRADED 90 · 60 LEFT"),
  lvl(99.9, "BID SHOWS 100 · TRADED 100 · NOW EMPTY"),
];
/** 3.3.8: the session's initial balance, periods A and B. */
const IB_ZONE: ChartLayer = { kind: "zone", from: 100.1, to: 100.7, role: "concept", label: "IB" };
const TPO_DESCRIBE = "Thirteen 30-minute periods, A to M, as bars: A 100.30–100.70, B 100.10–100.40, C 100.00–100.20, then up to 101.00 in period I and back to close at 100.40.";

// ─── Lessons ────────────────────────────────────────────────────────────────

const lessons: Lesson[] = [
  // 3.3.1 · The tape: time and sales
  {
    id: "3.3.1",
    title: "The tape: time and sales",
    topic: "market_fundamentals",
    level: "intermediate",
    tier: "free",
    minutes: 7,
    summary: "Reading time-and-sales prints by price, size and aggressor, and why the rules that guess the aggressor misclassify a share of trades.",
    objectives: [
      "Read a time-and-sales print (time, price, size, aggressor) and classify it as buyer- or seller-initiated.",
      'Explain why every trade has a buyer and a seller, and what "aggressor" adds.',
      'Say how trade-classification rules (tick rule, Lee–Ready) go wrong and why spot FX "volume" is a tick count.',
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
      { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
    ],
    script: {
      unit: "3.3",
      courseId: "3.3.1",
      hook: {
        prompt: "A 5,000-unit [[print]] appears at 100.00. Bullish or bearish?",
        control: {
          kind: "choice",
          choices: [
            { id: "bull", label: "Bullish", feedback: "5,000 units were bought, and the same 5,000 were sold. Size alone has no side." },
            { id: "bear", label: "Bearish", feedback: "Every unit sold was also bought. Without knowing who crossed the spread, size has no direction." },
            { id: "cant", label: "Can't tell", feedback: "Right. Each trade has a buyer and a seller. Who crossed the spread, and the context, add the clue." },
          ],
          answer: "cant",
        },
        compare: "You picked {yours}. A print alone can't say: every unit had a buyer and a seller. Only the aggressor and the context add a clue.",
        concept: "tape-reading",
      },
      learn: [
        {
          kind: "figure",
          title: "Prints against the quotes",
          figure: {
            kind: "chart",
            chart: {
              candles: blank(3),
              hideCandles: true,
              range: [99.9, 100.1],
              height: 200,
              layers: [lvl(100.05, "ASK 100.05"), lvl(99.95, "BID 99.95")],
              describe: "Quotes 99.95 bid and 100.05 ask, with three prints: 300 at 100.05, 500 at 99.95 and 5,000 at 100.00.",
            },
            steps: [
              { text: "A print at the ask, 100.05: a buyer crossed the spread. Buyer-initiated.", layers: [pt(0, 100.05, "up", "300 · BUY")] },
              { text: "A print at the bid, 99.95: a seller hit the bid. Seller-initiated.", layers: [pt(1, 99.95, "down", "500 · SELL")] },
              { text: "A print at 100.00, between the quotes: the quotes alone can't say who started it.", layers: [pt(2, 100.0, "neutral", "5,000 · ?")] },
            ],
          },
          text: "[[time-and-sales|Time and sales]] lists every trade: time, price and size. Compare each [[print]] with the quotes at that moment. The [[aggressor]] is the side that crossed the spread; the other side was resting in the book.",
          concept: "trade-classification",
        },
        {
          kind: "match",
          title: "Who started it?",
          prompt: "Bid 99.95, ask 100.05. Match each print with its classification.",
          pairs: [
            { left: "300 trade at 100.05", right: "Buyer-initiated", wrong: "100.05 is the ask. A buyer paid it, crossing the spread." },
            { left: "500 trade at 99.95", right: "Seller-initiated", wrong: "99.95 is the bid. A seller accepted it, crossing the spread." },
            { left: "5,000 trade at 100.00, the first print you see", right: "Ambiguous: the quote rule has no answer", wrong: "100.00 is the midpoint. Neither side crossed the spread, so the quotes can't say." },
            { left: "200 trade at 100.00, after a print at 99.95", right: "Buyer-initiated, by the tick rule", wrong: "The quotes can't settle a midpoint print, so the price change decides: up from 99.95, an uptick, counts as a buy." },
          ],
          correct: "The quote rule settles prints at the bid or the ask. At the midpoint, rules such as Lee–Ready fall back on the [[tick-rule|tick rule]]: up from the last print counts as a buy.",
          concept: "trade-classification",
        },
        {
          kind: "reveal",
          title: "The pace game",
          prompt: "Prints per five seconds climb from 4 to 19 while price rises to 100.12. Where is price 30 seconds later?",
          chart: { candles: PACE, visible: 6, volume: true, describe: "Twelve five-second bars. Prints per bar, in the lower pane, rise 4, 6, 9, 12, 16, 19 while price climbs from 100.00 to 100.12. The last six bars are hidden." },
          choices: [
            { id: "up", label: "Higher than 100.12", feedback: "The pace said 'urgent', not 'up'. This time price slipped back to 100.04." },
            { id: "down", label: "Lower than 100.12", feedback: "It was, this time: 100.04. But one round says nothing, as the 20-round score shows." },
            { id: "cant", label: "The pace can't tell you" },
          ],
          answer: "cant",
          after: "Price slipped back to 100.04. Over 20 rounds on the [[random-walk|random-walk]] control, following the pace scored 11 of 20. A coin flip lands between 6 and 14 about 96% of the time. Pace shows urgency, not direction.",
          concept: "tape-reading",
        },
        {
          kind: "explain",
          title: "Rules that guess the side",
          text: "Many feeds don't flag the aggressor, so software guesses. Lee–Ready uses the quotes, and the [[tick-rule|tick rule]] at the midpoint. Validation studies report about 75–90% accuracy (grade B), worse with fast quotes and hidden or midpoint fills. In spot FX there is no central tape: chart volume is usually [[tick-volume|tick volume]], price changes at one broker.",
        },
        {
          kind: "worked",
          title: "Tick rule against the engine",
          lines: [
            "The engine records who crossed the spread on each of 20 prints. The tick rule only sees price changes. B = buy, S = sell.",
            "Prints 1–10. Engine: B B S S B S S B B S. Tick rule: B B S S B S B B B S.",
            "Prints 11–20. Engine: B B S S S B S B S B. Tick rule: B S S S B B S S S B.",
            "Count the disagreements. Tick-rule error = disagreements ÷ 20 = ?",
          ],
          ask: {
            answer: 20,
            tolerance: 0,
            unit: "%",
            feedback: [
              { value: 4, text: "4 is the count. As a share of 20 prints: 4 ÷ 20 = 0.20, or 20%." },
              { value: 80, text: "80% is the share the tick rule got right. The error is the rest." },
            ],
            correct: "Right: 4 of 20, a 20% error. Prints 7 and 15 were sells on an uptick, 12 a buy on a downtick, 18 a buy at an unchanged price.",
          },
          after: "The quotes moved between prints, so the price change pointed the wrong way. Every delta or footprint built on guessed sides inherits this error.",
          concept: "trade-classification",
        },
        {
          kind: "callout",
          tone: "key",
          text: "The data are mechanics: time, price, size and, when the feed flags it, the aggressor. The reading, 'the tape predicts direction', is grade D. Use the tape to describe urgency, not to forecast.",
        },
      ],
      task: {
        widget: "bias-spotter",
        data: PRINT_CARDS,
        goal: "Six prints, each with the quotes at that moment. Classify each one by its aggressor, using the quote rule.",
        success: { field: "solved", eq: 6 },
        correct: "Six classified. The quote rule settles every print at the bid or the ask; only the midpoint print is a guess.",
        hints: [
          "Compare each print with the bid and the ask at that moment, not with the last price.",
          "At the ask, a buyer crossed. At the bid, a seller crossed. In between, the quotes give no answer.",
        ],
        showMe: { solved: 6 },
        concept: "trade-classification",
      },
      check: ["q-3.3.1-1", "q-3.3.1-2", "q-3.3.1-3"],
      recap: {
        takeaways: [
          "A print shows time, price and size; at the ask a buyer crossed, at the bid a seller.",
          "Every trade has a buyer and a seller; the aggressor only says who crossed the spread.",
          "Side-guessing rules misclassify about 10–25% of trades; spot FX volume is usually a tick count.",
        ],
      },
    },
  },

  // 3.3.2 · The DOM ladder
  {
    id: "3.3.2",
    title: "The DOM ladder",
    topic: "market_fundamentals",
    level: "intermediate",
    tier: "free",
    minutes: 7,
    summary: "Reading a depth-of-market ladder, naming four ways displayed size behaves, and why a large displayed order is a clue, not a commitment.",
    objectives: [
      "Read a DOM ladder: resting size at each price, last trades and your own working orders.",
      "Name four size behaviours (pulling, stacking, reloading, absorption) and what each can and cannot show.",
      "Avoid trading against a large displayed order that may disappear.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
      { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
    ],
    script: {
      unit: "3.3",
      courseId: "3.3.2",
      hook: {
        prompt: "A 2,000-unit offer sits at 100.20, ten times the usual size. Price climbs toward it. What happens?",
        control: {
          kind: "choice",
          choices: [
            { id: "stops", label: "Price stops there", feedback: "It might. But displayed size can be cancelled in a moment, and nothing obliges it to stay." },
            { id: "breaks", label: "The wall breaks", feedback: "It might, if buyers fill all 2,000. Nothing on the ladder tells you in advance." },
            { id: "pulled", label: "The order is pulled", feedback: "That's what happened in this replay. But you couldn't know it beforehand; such orders also fill." },
            { id: "cant", label: "You can't know in advance", feedback: "Right. Displayed size is a clue, not a commitment. It can fill, hold or vanish." },
          ],
          answer: "cant",
        },
        compare: "You picked {yours}. In the replay, the 2,000 was cancelled with price at 100.17. Displayed size is a clue, not a commitment.",
        concept: "depth-of-market",
      },
      learn: [
        {
          kind: "figure",
          title: "The ladder",
          figure: {
            kind: "bars",
            bars: [
              { label: "100.20 offer", value: 2000, role: "concept" },
              { label: "100.15 offer", value: 220, role: "neutral" },
              { label: "100.10 offer", value: 180, role: "neutral" },
              { label: "100.05 best offer", value: 200, role: "accent" },
              { label: "100.00 best bid", value: 210, role: "accent" },
              { label: "99.95 bid · yours 100", value: 190, role: "neutral" },
              { label: "99.90 bid", value: 230, role: "neutral" },
            ],
            unit: " units",
            steps: [
              "Offers above the market: 2,000 at 100.20 stands out against about 200 elsewhere.",
              "Down to the touch: best offer 100.05 (200 units), best bid 100.00 (210).",
              "Below: bids at 99.95 and 99.90. 100 of the 190 at 99.95 are your buy limit.",
            ],
          },
          text: "A [[dom|DOM]] ladder shows resting size at each price, the last trades beside it and your own working orders. Here the last trades were 40 and 25 at 100.05, then 60 at 100.00.",
          concept: "depth-of-market",
        },
        {
          kind: "match",
          title: "Four behaviours",
          prompt: "Match each size behaviour with what you see on the ladder.",
          pairs: [
            { left: "Pulling", right: "Size disappears as price comes near, with no trades there", wrong: "Pulled size leaves without trading: it's cancelled, not filled." },
            { left: "Stacking", right: "Size is added at a level", wrong: "Stacking is size arriving at a level, before any trading there." },
            { left: "Reloading", right: "The same size reappears after it trades", wrong: "Reloading is a refill: the level trades, then shows the same size again." },
            { left: "Absorption", right: "Repeated fills at a level, and the level holds", wrong: "Absorption is about the result: lots of trading at a level without price getting through." },
          ],
          correct: "Each behaviour is visible on the ladder. What it means, the intent, is not: a pull may be a changed mind, a risk limit or a spoof.",
          concept: "depth-of-market",
        },
        {
          kind: "reveal",
          title: "The wall",
          prompt: "The 2,000 offer still shows at 100.20, and price has reached 100.17. What happens next?",
          chart: {
            candles: WALL,
            visible: 6,
            volume: true,
            layers: [lvl(100.2, "OFFER 2,000", "resistance")],
            describe: "Nine 1-minute bars climbing from 100.05 toward a 2,000-unit offer at 100.20; six are visible, the last at 100.17.",
          },
          choices: [
            { id: "hold", label: "Price turns down from 100.20", feedback: "Not this time: the offer vanished first, and price went through." },
            { id: "fill", label: "Buyers fill all 2,000", feedback: "Nothing traded at 100.20 while the offer was there. It was cancelled." },
            { id: "pull", label: "The offer is cancelled" },
          ],
          answer: "pull",
          after: "This replay's agent cancelled all 2,000 at 100.17, before a unit traded there; price went on to 100.28. Other walls fill or hold. A [[liquidity-heatmap|liquidity heatmap]] shows such a wall as a bright band that stops abruptly.",
          concept: "depth-of-market",
        },
        {
          kind: "explain",
          title: "Traded beats displayed",
          text: "Displayed size costs nothing to show or to cancel. Traded volume actually happened. That's why many order-flow traders weight executed volume over resting depth. The cleanest ladders come from centralised futures books; a CFD or spot FX ladder shows only the liquidity your broker sees.",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "A pulled order is not automatically spoofing. Market makers modify and cancel constantly, and traders change their minds. The legal line is intent, covered in 3.3.7. And don't trade against a wall just because it's there: it can vanish before price arrives.",
        },
      ],
      task: {
        widget: "bias-spotter",
        data: DOM_CARDS,
        goal: "Five large-order events from a DOM replay. Tag each one: pulled, stacked, reloaded or absorbed.",
        success: { field: "solved", eq: 5 },
        correct: "Five tagged. Each tag describes what the ladder did; none says why, or what comes next.",
        hints: ["Ask first: did anything trade at that level?", "No trades and the size left: pulled. Size added: stacked. Same size back after fills: reloaded. Heavy fills, level holds: absorbed."],
        showMe: { solved: 5 },
        concept: "depth-of-market",
      },
      check: ["q-3.3.2-1", "q-3.3.2-2", "q-3.3.2-3"],
      recap: {
        takeaways: [
          "A DOM ladder shows resting size per price, the last trades and your working orders.",
          "Pulling, stacking, reloading and absorption are visible; the intent behind them is not.",
          "Displayed size is free to cancel: don't trade against a wall just because it's there.",
        ],
      },
    },
  },

  // 3.3.3 · Footprint charts
  {
    id: "3.3.3",
    title: "Footprint charts",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 8,
    summary: "Reading a footprint bar's bid and ask volume at each price, its delta and POC, and the diagonal and stacked imbalances that describe the past, not the future.",
    objectives: [
      "Read a footprint bar: bid × ask volume per price, bar delta and bar POC.",
      "Find diagonal imbalances at a 3:1 threshold and stacked imbalances.",
      "Explain why an imbalance describes what happened, not what must happen next.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "breakout", label: "Arena: breakout" },
      { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
    ],
    script: {
      unit: "3.3",
      courseId: "3.3.3",
      hook: {
        prompt: "This one-minute LABX candle closed 0.05 higher. Did aggressive buyers dominate inside it?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes", feedback: "In this bar, yes: delta +295. But a candle that closes higher can hide net selling. The candle alone can't say." },
            { id: "no", label: "No", feedback: "Here buyers did dominate, +295. But you couldn't know from the candle; only the trades inside it show that." },
            { id: "cant", label: "You can't tell from the candle", feedback: "Right. Open, high, low and close don't record who crossed the spread. The footprint does." },
          ],
          answer: "cant",
        },
        figure: {
          kind: "chart",
          chart: { candles: [k(100.0, 100.06, 100.0, 100.05)], range: [99.98, 100.08], height: 200, describe: "One candle: open 100.00, high 100.06, low 100.00, close 100.05." },
          steps: [{ text: "Open 100.00, high 100.06, low 100.00, close 100.05." }],
        },
        compare: "You picked {yours}. The candle can't say. Its footprint shows 505 bought at the ask and 210 sold at the bid: delta +295.",
        concept: "footprint-chart",
      },
      learn: [
        {
          kind: "figure",
          title: "One bar, split by price",
          figure: {
            kind: "bars",
            bars: [
              { label: "100.06 · 10 × 5", value: 15, role: "neutral" },
              { label: "100.05 · 40 × 60", value: 100, role: "neutral" },
              { label: "100.04 · 30 × 150", value: 180, role: "concept" },
              { label: "100.03 · 25 × 120", value: 145, role: "neutral" },
              { label: "100.02 · 20 × 110", value: 130, role: "neutral" },
              { label: "100.01 · 35 × 40", value: 75, role: "neutral" },
              { label: "100.00 · 50 × 20", value: 70, role: "neutral" },
            ],
            unit: " units",
            steps: [
              "Each row: volume sold at the bid × volume bought at the ask. The top is thin: 10 × 5.",
              "The middle is mostly ask: 150, 120 and 110 bought. 100.04 traded most, 180: the bar's POC.",
              "The low: 35 × 40 and 50 × 20. Sellers hit the bid harder at the bottom.",
            ],
          },
          text: "A [[footprint]] splits one bar by price, here 0.01 apart, using its 34 prints. Each bar's length is the total traded at that price; the longest is the bar's [[point-of-control|POC]].",
          concept: "footprint-chart",
        },
        {
          kind: "worked",
          title: "Bar delta",
          lines: [
            "Ask column, bought by aggressive buyers: 5 + 60 + 150 + 120 + 110 + 40 + 20 = 505.",
            "Bid column, sold by aggressive sellers: 10 + 40 + 30 + 25 + 20 + 35 + 50 = 210.",
            "[[bar-delta|Bar delta]] = ask − bid = ?",
          ],
          ask: {
            answer: 295,
            tolerance: 0,
            unit: "units",
            feedback: [
              { value: -295, text: "Reversed: delta is ask minus bid, aggressive buys minus aggressive sells. More traded at the ask here." },
              { value: 715, text: "715 is the bar's total volume, both columns added. Delta subtracts the bid column." },
            ],
            correct: "Right: +295. More volume crossed the spread to buy than to sell.",
          },
          after: "Delta says which side was more aggressive inside the bar. It doesn't say who was right: each of those 505 units had a passive seller.",
          concept: "footprint-chart",
        },
        {
          kind: "hotspot",
          title: "Stacked imbalances",
          prompt: "Compare each ask with the bid one row lower. Tap the stacked buy imbalances: three or more rows in a row at 3:1 or more.",
          chart: FP1_CHART,
          zones: [
            { id: "top", label: "100.05–100.06", from: 100.045, to: 100.065, feedback: "At 100.05, ask 60 against 30 bid at 100.04: 2:1. At 100.06, 5 against 40. Neither reaches 3:1." },
            { id: "stack", label: "100.02–100.04", from: 100.015, to: 100.045 },
            { id: "bottom", label: "100.00–100.01", from: 99.995, to: 100.015, feedback: "At 100.01, ask 40 against 50 bid at 100.00: 0.8:1. No buy imbalance here." },
          ],
          answer: "stack",
          correct: "Right. 110 ÷ 35 ≈ 3.1 at 100.02, 120 ÷ 20 = 6 at 100.03, 150 ÷ 25 = 6 at 100.04: three in a row, a [[stacked-imbalance|stacked imbalance]].",
          concept: "footprint-imbalance",
        },
        {
          kind: "explain",
          title: "The edges of the bar",
          text: "At the high, 10 × 5 is thin: practitioners call it an [[exhaustion-print|exhaustion print]], as if buyers ran out. The opposite, solid trading on both sides at an extreme, is an [[unfinished-auction|unfinished auction]], claimed to get revisited. Both claims are grade D: untested heuristics.",
        },
        {
          kind: "predict",
          title: "Move the threshold",
          prompt: "At 3:1 this bar has three [[diagonal-imbalance|diagonal]] buy imbalances. Raise the threshold to 4:1. How many remain?",
          control: {
            kind: "numeric",
            answer: 2,
            tolerance: 0,
            feedback: [
              { value: 3, text: "100.02 is 110 ÷ 35 ≈ 3.14: it passes 3:1 but not 4:1." },
              { value: 4, text: "That's the count at 2:1, where 100.05 (60 ÷ 30 = 2) also counts." },
            ],
          },
          figure: {
            kind: "bars",
            bars: [
              { label: "100.06 · 5 ÷ 40", value: 0.13, role: "neutral" },
              { label: "100.05 · 60 ÷ 30", value: 2, role: "neutral" },
              { label: "100.04 · 150 ÷ 25", value: 6, role: "concept" },
              { label: "100.03 · 120 ÷ 20", value: 6, role: "concept" },
              { label: "100.02 · 110 ÷ 35", value: 3.14, role: "concept" },
              { label: "100.01 · 40 ÷ 50", value: 0.8, role: "neutral" },
            ],
            unit: ":1",
          },
          reveal: "Two: 100.03 and 100.04. At 2:1 there are four, at 4:1 two, and the stack is gone. The threshold, not the market, decided what counted. The bar's one sell imbalance, 40 ÷ 5 = 8 at 100.05, stays isolated at any of them.",
          concept: "footprint-imbalance",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "A footprint can't be rebuilt from OHLCV: it needs every trade with its aggressor. On feeds without that flag, platforms guess the side, with the errors from 3.3.1. And an imbalance describes what happened, not what must happen next: 'stacked imbalances become support' is grade D.",
        },
        {
          kind: "hotspot",
          title: "Your turn: the POC",
          prompt: "The next bar's footprint, bid × ask. Tap its point of control.",
          chart: FP2_CHART,
          zones: [
            rowZone("p25", 100.25, "25 units: the thinnest row."),
            rowZone("p24", 100.24, "85 units: 60 + 25."),
            rowZone("p23", 100.23, "130 units: 90 + 40. Close, but one row traded more."),
            rowZone("p22", 100.22),
            rowZone("p21", 100.21, "130 units: 70 + 60, tied with 100.23 for second."),
            rowZone("p20", 100.2, "110 units: 50 + 60, at the open."),
          ],
          answer: "p22",
          correct: "Right: 110 + 55 = 165, the most of any price.",
          concept: "footprint-chart",
        },
        {
          kind: "predict",
          title: "Your turn: the delta",
          prompt: "That bar opened at 100.20 and closed at 100.23, 0.03 higher. What is the sign of its delta?",
          control: {
            kind: "choice",
            choices: [
              { id: "pos", label: "Positive", feedback: "The close is higher, but the bid column is bigger: 395 sold against 250 bought." },
              { id: "neg", label: "Negative", feedback: "Right: 250 − 395 = −145." },
              { id: "zero", label: "About zero", feedback: "Far from it: 250 at the ask against 395 at the bid." },
            ],
            answer: "neg",
          },
          figure: {
            kind: "bars",
            bars: [
              { label: "100.25 · 15 × 10", value: -5 },
              { label: "100.24 · 60 × 25", value: -35 },
              { label: "100.23 · 90 × 40", value: -50 },
              { label: "100.22 · 110 × 55", value: -55 },
              { label: "100.21 · 70 × 60", value: -10 },
              { label: "100.20 · 50 × 60", value: 10, role: "up" },
            ],
            unit: "",
          },
          reveal: "Delta −145: net aggressive selling in a bar that closed higher. The close comes from the last prints, delta from all of them. Two sell imbalances, 6:1 at 100.24 and 3.6:1 at 100.23, but two isn't a stack.",
          concept: "footprint-chart",
        },
      ],
      check: ["q-3.3.3-1", "q-3.3.3-2", "q-3.3.3-3"],
      recap: {
        takeaways: [
          "A footprint shows bid × ask volume at each price; delta is ask minus bid, POC the busiest row.",
          "A diagonal imbalance compares ask at one price with bid one tick lower; three in a row stack.",
          "Imbalances describe what happened, not what must happen next: grade D, and threshold-dependent.",
        ],
      },
    },
  },

  // 3.3.4 · Delta and cumulative delta
  {
    id: "3.3.4",
    title: "Delta and cumulative delta",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 7,
    summary: "Bar delta and cumulative volume delta from a chosen anchor, delta divergences that need price confirmation, and rallies built by sellers stepping back.",
    objectives: [
      "Compute bar delta and a cumulative volume delta from a chosen anchor.",
      "Spot a delta divergence and say what price confirmation it needs.",
      'Tell "aggressive buying" from "sellers withdrawing" as causes of a rally.',
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "reversal", label: "Arena: reversal" },
      { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
    ],
    script: {
      unit: "3.3",
      courseId: "3.3.4",
      hook: {
        prompt: "Price makes a higher high. Cumulative delta makes a lower high. Is a reversal coming?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes", feedback: "A divergence flags a move with less aggressive buying behind it. Plenty of such moves keep going." },
            { id: "likely", label: "Likely", feedback: "Not even 'likely' on its own: divergences are grade D. They flag fragility; price has to confirm." },
            { id: "confirm", label: "Not without price confirmation", feedback: "Right. The divergence says the move is thinner. Only price, such as a break of the last swing low, confirms a turn." },
          ],
          answer: "confirm",
        },
        compare: "You picked {yours}. A delta divergence flags a fragile move, not a reversal. Price has to confirm, for example by breaking the last swing low.",
        concept: "delta-divergence",
      },
      learn: [
        {
          kind: "figure",
          title: "Delta, bar by bar",
          figure: {
            kind: "bars",
            bars: [
              { label: "Bar 1", value: 295, role: "up" },
              { label: "Bar 2", value: 120, role: "up" },
              { label: "Bar 3", value: -80 },
              { label: "Bar 4", value: 60, role: "up" },
              { label: "Bar 5", value: -40 },
            ],
            unit: "",
          },
          text: "Five 15-minute LABX bars, each with its [[bar-delta|delta]]: ask volume minus bid volume. [[cvd|Cumulative volume delta]] (CVD) is their running total from a chosen start, the anchor. Counting from bar 1: 295, then 295 + 120 = 415.",
          concept: "cumulative-volume-delta",
        },
        {
          kind: "worked",
          title: "CVD at bar 4",
          lines: ["Start at the anchor: 0.", "Bar 1: +295. CVD 295.", "Bar 2: +120. CVD 415.", "Bar 3: −80. CVD 335.", "Bar 4: +60. CVD = ?"],
          ask: {
            answer: 395,
            tolerance: 0,
            unit: "units",
            feedback: [
              { value: 60, text: "That's bar 4's delta alone. Add it to the running total, 335." },
              { value: 275, text: "Bar 4's delta is +60, so add it: 335 + 60." },
            ],
            correct: "Right: 335 + 60 = 395. Bar 5 then subtracts 40: 355.",
          },
          after: "The CVD line: 295, 415, 335, 395, 355.",
          concept: "cumulative-volume-delta",
        },
        {
          kind: "hotspot",
          title: "Find the divergence",
          prompt: "Each high is labelled with CVD at that bar. Tap the bar where price and CVD disagree.",
          chart: {
            candles: CVD5,
            volume: true,
            layers: [mk(0, "CVD 295", "neutral"), mk(1, "CVD 415", "neutral"), mk(2, "CVD 335", "neutral"), mk(3, "CVD 395", "neutral"), mk(4, "CVD 355", "neutral")],
            describe: "Five 15-minute bars: highs 100.42, 100.80, 100.74, 101.10 and 101.02, labelled with CVD 295, 415, 335, 395 and 355.",
          },
          zones: [
            { id: "b1", label: "Bar 1", index: 0, feedback: "Bar 1 is the start: there's nothing to compare it with yet." },
            { id: "b2", label: "Bar 2", index: 1, feedback: "Bar 2 is the first high: 100.80 with CVD 415. A divergence needs a later high to compare with." },
            { id: "b3", label: "Bar 3", index: 2, feedback: "Bar 3 is a pullback, not a new high." },
            { id: "b4", label: "Bar 4", index: 3 },
            { id: "b5", label: "Bar 5", index: 4, feedback: "Bar 5 makes no new high: 101.02 is below bar 4's 101.10." },
          ],
          answer: "b4",
          correct: "Right. Bar 4's high, 101.10, beats bar 2's 100.80, but CVD reaches only 395 against 415: a [[delta-divergence|delta divergence]].",
          concept: "delta-divergence",
        },
        {
          kind: "figure",
          title: "The anchor sets the level",
          figure: {
            kind: "chart",
            chart: {
              candles: ANCH,
              hideCandles: true,
              range: [0, 1500],
              height: 200,
              describe: "Twelve bars over two sessions. Continuous CVD runs from 550 to 1,250. Session CVD restarts at each open: 250 to 800 in session 1, then 150, 100, 200, 300, 50 and 150 in session 2.",
            },
            steps: [
              { text: "Continuous CVD, counted from days earlier, starts this window at 550.", layers: [ln(ANCH_CONT, "CONTINUOUS", "concept")] },
              { text: "Session CVD restarts at zero each open: 800 at the first close, then 150.", layers: [ln(ANCH_SESSION1, "SESSION 1"), ln(ANCH_SESSION2, "SESSION 2")] },
              { text: "Inside session 2 both lines move in step, 1,100 apart. Only the reset changes the gap." },
            ],
          },
          text: "Same deltas, two anchors, two levels: only the changes compare. [[obv|OBV]] differs again. It gives each bar's whole volume the sign of its close; CVD signs each trade by its aggressor.",
          concept: "cumulative-volume-delta",
        },
        {
          kind: "predict",
          title: "What lifted price?",
          prompt: "After bar 5, LABX rallies from 100.86 to 101.16 in three bars. Their deltas: −10, −20, −10. What lifted price?",
          control: {
            kind: "choice",
            choices: [
              { id: "buyers", label: "Aggressive buyers", feedback: "Delta was slightly negative: aggressive buying didn't outweigh selling in any of the three bars." },
              { id: "withdraw", label: "Sellers withdrawing their offers", feedback: "Right: offers near price were cancelled, so small buys moved price through a thin book." },
              { id: "impossible", label: "Nothing: price can't rise on negative delta", feedback: "It can. Price moves when one side of the book thins out, even if aggressive volume is balanced." },
            ],
            answer: "withdraw",
          },
          figure: {
            kind: "chart",
            chart: {
              candles: CVD8,
              hideCandles: true,
              range: [0, 2600],
              height: 180,
              describe: "Offers resting within 0.05 above price, from the engine log: 2,400 after bar 5, then 1,500, 900 and 500 after the three rally bars.",
            },
            steps: [{ text: "Offers resting within 0.05 above price: 2,400 units after bar 5, 500 after bar 8.", layers: [ln(OFFERS_NEAR, "OFFERS NEAR PRICE", "down")] }],
          },
          reveal: "The engine log shows 1,900 units of offers cancelled during the rally while aggressive volume stayed balanced. Sellers stepped back; buyers didn't push. A delta chart alone shows a rally with no buying behind it.",
          concept: "cumulative-volume-delta",
        },
        {
          kind: "match",
          title: "Your turn: which divergence survives?",
          prompt: "Highs: A 101.00 (session 1), B 101.20 and C 101.30 (session 2). Session CVD at A, B, C: 900, 300, 150. Continuous: 1,200, 1,400, 1,250. Sort each comparison.",
          pairs: [
            { left: "A to B: a higher high", right: "Divergence only with the session anchor", wrong: "Session CVD falls from 900 to 300 only because it reset at the open. Continuous CVD rises from 1,200 to 1,400." },
            { left: "B to C: a higher high", right: "Divergence with both anchors", wrong: "Both fall: 300 to 150, and 1,400 to 1,250. Inside one session the anchor can't change the comparison." },
            { left: "A to C: a higher high", right: "Divergence only with the session anchor", wrong: "Session CVD 900 to 150 crosses the reset. Continuous rises from 1,200 to 1,250: no divergence." },
          ],
          columns: ["Comparison", "What it shows"],
          correct: "Only B to C survives both anchors: it sits inside one session. A divergence that crosses a reset may be an artefact of the anchor.",
          concept: "delta-divergence",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "Most platforms approximate CVD, often from small-timeframe candles or guessed trade sides, so the classification errors from 3.3.1 pile up in the running total. And a delta divergence is grade D: it flags a fragile move, not a reversal. Test it with and without price confirmation, against the random-walk control.",
        },
      ],
      check: ["q-3.3.4-1", "q-3.3.4-2", "q-3.3.4-3"],
      recap: {
        takeaways: [
          "Bar delta is ask minus bid volume; CVD is its running total from an anchor you choose.",
          "A delta divergence needs price confirmation, and should survive a change of anchor.",
          "Price can rise on flat delta when sellers cancel offers; delta shows aggression, not the book.",
        ],
      },
    },
  },

  // 3.3.5 · Absorption and exhaustion
  {
    id: "3.3.5",
    title: "Absorption and exhaustion",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 7,
    summary: "Absorption as heavy aggressive volume without price progress, exhaustion as aggression drying up at an extreme, and the price or condition that invalidates each read.",
    objectives: [
      "Recognise absorption: heavy aggressive volume at a level without price progress.",
      "Recognise exhaustion: aggressive volume drying up at the extreme of a move.",
      "State what invalidates each read: the level breaks, or volume returns.",
    ],
    blocks: [],
    practice: [
      { kind: "mission", ref: "M07", label: "Stop or Stay?" },
      { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    ],
    script: {
      unit: "3.3",
      courseId: "3.3.5",
      hook: {
        prompt: "Sellers hit 99.50 with 1,800 units in six minutes. Price is still at 99.50. Who is winning?",
        control: {
          kind: "choice",
          choices: [
            { id: "sellers", label: "The sellers", feedback: "They're the aggressors, but 1,800 units of selling moved price nowhere. Someone took the other side of all of it." },
            { id: "passive", label: "A passive buyer", feedback: "Right, for now. A resting buyer is soaking up the selling. If 99.50 gives way, that read was wrong." },
            { id: "nobody", label: "Nobody", feedback: "Someone bought 1,800 units at 99.50. Price stalling under that much selling is the clue." },
          ],
          answer: "passive",
        },
        compare: "You picked {yours}. A passive buyer absorbed the selling, for now. If 99.50 gives way, the absorption failed.",
        concept: "absorption",
      },
      learn: [
        {
          kind: "figure",
          title: "Effort without result",
          figure: {
            kind: "chart",
            chart: { candles: ABSORB.slice(0, 6), volume: true, describe: "Six 1-minute bars between 99.50 and 99.52 on 2,100 units: 1,800 sold into the 99.50 bid and 300 bought at the ask." },
            steps: [
              { text: "Six minutes: price stays between 99.50 and 99.52.", layers: [{ kind: "zone", from: 99.5, to: 99.52, role: "neutral", label: "99.50–99.52" }] },
              { text: "Delta −1,500: 1,800 units sold into the bid, 300 bought at the ask.", layers: [mk(5, "DELTA −1,500", "down", "low")] },
              { text: "The 99.50 bid shows 200 and refills after every 200 traded: nine times.", layers: [lvl(99.5, "BID 200, REFILLED", "support")] },
            ],
          },
          text: "That's [[absorption]]: heavy aggressive volume at a level without price progress, because passive orders take it all.",
          concept: "absorption",
        },
        {
          kind: "explain",
          title: "Effort versus result",
          text: "Wyckoff's [[effort-vs-result|effort versus result]] compares volume, the effort, with price progress, the result. Here 2,100 units traded and price moved 0.02. Big effort, no result: someone on the other side has size. It's a heuristic, grade D, and it says nothing about how much size the passive buyer has left.",
        },
        {
          kind: "predict",
          title: "Does 99.50 hold?",
          prompt: "The bid at 99.50 keeps refilling. Does the level hold?",
          control: {
            kind: "choice",
            choices: [
              { id: "holds", label: "It holds", feedback: "In one branch of the replay it did. In the other, the buyer ran out of size and it broke." },
              { id: "breaks", label: "It breaks", feedback: "In one branch it did, after the buyer finished. In the other, price lifted to 99.80." },
              { id: "unknown", label: "It depends on size you can't see", feedback: "Right. The hidden buyer's remaining size decides, and the ladder doesn't show it." },
            ],
            answer: "unknown",
          },
          figure: {
            kind: "chart",
            chart: { candles: ABSORB, volume: true, describe: "The six absorption bars, then branch A: six bars lifting to 99.80. Branch B, dashed, breaks 99.50 and falls to 99.30." },
            steps: [
              { text: "Branch A: the buyer still had size. Price lifts to 99.80." },
              { text: "Branch B: the buyer had 200 left. 99.50 breaks; price falls to 99.30.", layers: [{ kind: "path", points: BRANCH_B, role: "down", label: "BRANCH B", dashed: true }, lvl(99.48, "INVALIDATION 99.48", "stop")] },
            ],
          },
          reveal: "Same tape, two endings. Absorption describes what has happened at a level, not how much size remains. That's why the read needs an [[invalidation]] price before you act: here, trades below 99.48, two ticks under the level.",
          concept: "absorption",
        },
        {
          kind: "figure",
          title: "Exhaustion at the high",
          figure: {
            kind: "chart",
            chart: { candles: EXHAUST, volume: true, describe: "Six 15-minute bars rallying from 100.00 to a high of 101.12. Volume 820, 910, 920, 1,110, 980, then 340 on the last bar; delta +30 on the last bar." },
            steps: [
              { text: "A rally: each bar closes near its high, on 820 to 1,110 units.", layers: [mk(3, "DELTA +450", "up")] },
              { text: "Bar 6 makes a new high, 101.12, on 340 units and delta +30.", layers: [mk(5, "DELTA +30", "concept")] },
            ],
          },
          text: "[[exhaustion|Exhaustion]] in order-flow terms: aggressive volume drying up at the extreme of a move. Buyers stopped crossing the spread. It's a description; the read is grade D, and a new high on rising delta would undo it.",
          concept: "order-flow-exhaustion",
        },
        {
          kind: "match",
          title: "What would prove you wrong?",
          prompt: "Match each read with the evidence that invalidates it.",
          pairs: [
            { left: "A passive buyer absorbing at 99.50", right: "Trades below 99.48", wrong: "A buyer defending 99.50 is wrong once sellers trade through it, here two ticks under the level." },
            { left: "A passive seller absorbing at 101.20", right: "Trades above 101.22", wrong: "A seller defending 101.20 is wrong once buyers trade through it." },
            { left: "Exhaustion at the high", right: "A new high with rising delta", wrong: "Exhaustion says aggression dried up. Fresh buying at a new high says it came back." },
          ],
          correct: "Each read is a hypothesis with a price or condition that kills it. Write that down before you act.",
          concept: "invalidation-level",
        },
        {
          kind: "callout",
          tone: "key",
          text: "If the level breaks, the absorption failed. If aggressive volume returns at a new extreme, the exhaustion read failed. Both are grade D heuristics: treat them as hypotheses with an invalidation, never as certainties.",
        },
      ],
      task: {
        widget: "bias-spotter",
        data: READ_CARDS,
        goal: "Five order-flow snapshots. For each, name the read: a passive buyer absorbing, a passive seller absorbing, exhaustion, or no clear read.",
        success: { field: "solved", eq: 5 },
        correct: "Five reads. Each one comes with a price or a condition that would prove it wrong.",
        hints: ["Who is the aggressor, and did price make progress?", "Heavy effort and no progress: absorption by the other side. Thin volume at a new extreme: exhaustion."],
        showMe: { solved: 5 },
        concept: "absorption",
      },
      check: ["q-3.3.5-1", "q-3.3.5-2", "q-3.3.5-3"],
      recap: {
        takeaways: [
          "Absorption: heavy aggressive volume at a level, little price progress, because passive orders take it.",
          "Exhaustion: aggressive volume drying up at the extreme of a move.",
          "Each read dies at a price: the level breaks, or aggressive volume returns at a new extreme.",
        ],
      },
    },
  },

  // 3.3.6 · Icebergs: detection
  {
    id: "3.3.6",
    title: "Icebergs: detection",
    topic: "order_types",
    level: "intermediate",
    tier: "free",
    minutes: 7,
    summary: "Spotting an iceberg from traded volume that exceeds the displayed size, estimating the minimum hidden size, and why a synthetic iceberg looks like many new orders.",
    objectives: [
      "Detect an iceberg from traded volume exceeding displayed size and repeated refills at one price.",
      "Estimate the minimum hidden size from the tape.",
      "Explain why a synthetic iceberg looks like a series of new orders to the exchange.",
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "sideways", label: "Arena: sideways" },
      { kind: "check", ref: "order_types", label: "Order types check" },
    ],
    script: {
      unit: "3.3",
      courseId: "3.3.6",
      hook: {
        prompt: "50 units show at 100.00. 600 trade there. 50 still show. What is the smallest the hidden part can have been?",
        control: {
          kind: "numeric",
          unit: "units",
          answer: 550,
          tolerance: 0,
          feedback: [
            { value: 600, text: "600 traded, but 50 of them could have been the slice showing at the start. Only the rest must have been hidden." },
            { value: 650, text: "The 50 showing now might be someone else's new order, so you can't count it as hidden." },
          ],
        },
        compare: "You answered {yours}. At least 550: 600 traded against 50 shown. The 50 showing now may be another refill, or someone else's order.",
      },
      learn: [
        {
          kind: "figure",
          title: "Refills at one price",
          figure: {
            kind: "chart",
            chart: { candles: ICE, volume: true, describe: "Ten 1-minute bars between 100.00 and 100.05. The bid at 100.00 shows 50 throughout while 600 units sell into it." },
            steps: [
              { text: "Ten minutes. The bid at 100.00 shows 50 units the whole time.", layers: [lvl(100.0, "BID SHOWS 50", "support")] },
              { text: "Yet 600 units sell at 100.00: twelve fills of 50, the slice reappearing each time.", layers: [0, 1, 2, 3, 4, 5, 6, 7, 9].map((i) => pt(i, 100.0, "concept")) },
              { text: "When the selling stops, 50 still show at 100.00.", layers: [pt(9, 100.0, "accent", "STILL 50")] },
            ],
          },
          text: "Traded volume far above the displayed size, with the same slice coming back: the trace of an iceberg. Each [[iceberg-refill|refill]] draws on a [[reserve-quantity|reserve quantity]] you can't see.",
        },
        {
          kind: "worked",
          title: "The minimum hidden size",
          lines: ["Displayed at 100.00: 50.", "Traded at 100.00: 600.", "At most 50 of the 600 can have come from the slice showing at the start.", "Minimum hidden size = 600 − 50 = ?"],
          ask: {
            answer: 550,
            tolerance: 0,
            unit: "units",
            feedback: [
              { value: 650, text: "The 50 showing now may belong to a new order from someone else. Count only what must have been hidden." },
              { value: 600, text: "One slice of 50 was visible before the first fill, so it wasn't hidden." },
            ],
            correct: "Right: at least 550 units were hidden. The real reserve may be far larger.",
          },
          after: "That's a floor, not an estimate. The iceberg may hold thousands more, or the next refill may be its last.",
        },
        {
          kind: "explain",
          title: "Native and synthetic",
          text: "A native iceberg lives at the exchange: one order with a display slice and a hidden reserve. A synthetic one lives in a platform or broker, which sends a new order each time a slice fills. The exchange sees separate orders. Either way, a refill usually joins the back of the [[queue-priority|queue]] at its price.",
        },
        {
          kind: "predict",
          title: "Will price rise?",
          prompt: "An iceberg buyer at 100.00 has absorbed 600 units. Will price rise from here?",
          control: {
            kind: "choice",
            choices: [
              { id: "yes", label: "Yes: a big buyer is defending", feedback: "Maybe. But the buyer may be nearly finished, or buying here to cover a short held elsewhere, with no view on direction." },
              { id: "no", label: "No: the buyer is nearly done", feedback: "Maybe, but you can't see the reserve. It may hold thousands more." },
              { id: "cant", label: "It isn't guaranteed either way", feedback: "Right. The iceberg shows size at a price, not direction or what's left." },
            ],
            answer: "cant",
          },
          reveal: "An iceberg shows that someone has size at 100.00. It doesn't show how much is left, or why. A fund closing a short, or hedging a position elsewhere, buys without a view on LABX. 'The iceberg shows direction' is grade D.",
          concept: "absorption",
        },
        {
          kind: "hotspot",
          title: "Find the iceberg",
          prompt: "A tape summary for four prices over ten minutes. Tap the iceberg level.",
          chart: { candles: blank(1, 100.05), hideCandles: true, range: [99.85, 100.25], height: 220, layers: ICE_LEVELS, describe: "Four prices: 100.20 offer shows 600, traded 0. 100.10 offer shows 40, traded 380, still 40. 100.00 bid shows 150, traded 90. 99.90 bid shows 100, traded 100, now empty." },
          zones: [
            { id: "p20", label: "100.20", from: 100.15, to: 100.25, feedback: "600 shown and nothing traded: a large displayed order, maybe a wall. No sign of hidden size." },
            { id: "p10", label: "100.10", from: 100.05, to: 100.15 },
            { id: "p00", label: "100.00", from: 99.95, to: 100.05, feedback: "90 traded out of 150 shown: an ordinary order, partly filled." },
            { id: "p90", label: "99.90", from: 99.85, to: 99.95, feedback: "100 shown, 100 traded, then gone: an ordinary order, filled." },
          ],
          answer: "p10",
          correct: "Right. 380 traded against 40 shown, and 40 still show: at least 340 were hidden. A seller with reserve sits at 100.10.",
        },
      ],
      task: {
        widget: "bias-spotter",
        data: ICEBERG_CARDS,
        goal: "Five price levels from a replay. For each, decide: iceberg, not an iceberg, or too early to tell.",
        success: { field: "solved", eq: 5 },
        correct: "Five levels judged. Volume traded far beyond the displayed size, with repeated refills, is the signature; one refill isn't enough.",
        hints: ["Compare traded volume with displayed size at each level.", "One refill could be a new order. Repeated refills of the same slice point to an iceberg."],
        showMe: { solved: 5 },
      },
      check: ["q-3.3.6-1", "q-3.3.6-2", "q-3.3.6-3"],
      recap: {
        takeaways: [
          "An iceberg shows itself when traded volume far exceeds displayed size and the slice keeps refilling.",
          "Minimum hidden size = traded − displayed: a floor, not an estimate of what remains.",
          "Synthetic icebergs are new orders to the exchange; an iceberg shows size, not direction.",
        ],
      },
    },
  },

  // 3.3.7 · Spoofing and layering: illegal
  {
    id: "3.3.7",
    title: "Spoofing and layering: illegal",
    topic: "market_fundamentals",
    level: "intermediate",
    tier: "free",
    minutes: 8,
    summary: "What spoofing is and why it's illegal, the surveillance signature regulators look for, and why legitimate layering or one pulled order is no proof.",
    objectives: [
      "Define spoofing (bidding or offering with the intent to cancel before execution) and say why it is illegal in US futures and under EU market-abuse rules.",
      "Recognise the surveillance signature: large orders away from the touch, frequent modifications, a high cancel-to-fill ratio and trades on the opposite side.",
      "Tell legitimate layering of genuine orders from spoofing, and explain why a pulled order alone is not proof.",
    ],
    blocks: [],
    practice: [{ kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" }],
    script: {
      unit: "3.3",
      courseId: "3.3.7",
      hook: {
        prompt: "A program placed large sell orders 3–4 ticks above the best ask for over four hours, modified them more than 81,000 times and executed 81 lots. Legal?",
        control: {
          kind: "choice",
          choices: [
            { id: "legal", label: "Legal: you can cancel any order", feedback: "Cancelling is legal. Placing orders you intend to cancel before execution, to mislead, is spoofing. This trader was convicted." },
            { id: "illegal", label: "Illegal", feedback: "Right. Historical case: CFTC v. Sarao. He pleaded guilty to spoofing and wire fraud." },
            { id: "broker", label: "Depends on the broker", feedback: "It's a matter of law, not broker policy. US futures law bans bidding or offering with intent to cancel before execution." },
          ],
          answer: "illegal",
        },
        compare: "You picked {yours}. Illegal. Historical case: CFTC v. Sarao, E-mini S&P futures, 6 May 2010. He pleaded guilty to spoofing and wire fraud.",
        concept: "spoofing",
      },
      learn: [
        {
          kind: "explain",
          title: "The rule",
          text: "[[spoofing|Spoofing]] is bidding or offering with the intent to cancel before execution. In US futures, the Dodd-Frank Act added that ban to the Commodity Exchange Act. In the EU, the Market Abuse Regulation treats orders that give false signals about supply or demand as manipulation. The line is intent, which investigators infer from patterns.",
        },
        {
          kind: "figure",
          title: "The replay",
          figure: {
            kind: "chart",
            chart: { candles: SPOOF, describe: "Synthetic replay: ten 1-minute bars drifting from 100.40 to 100.21 under a ladder of five large offers that move down with price, 3 to 7 ticks above the best ask." },
            steps: [
              {
                text: "Synthetic replay: five large offers, one tick apart, the nearest three ticks above the best ask.",
                layers: [
                  { kind: "path", points: SPOOF_NEAR, role: "down", label: "NEAREST OFFER", dashed: true },
                  { kind: "path", points: SPOOF_FAR, role: "down", label: "FIFTH OFFER", dashed: true },
                ],
              },
              { text: "As price moves, the program re-prices them to stay out of reach. They almost never fill." },
              { text: "Historical case, 6 May 2010: over 4 h 25 min, more than 81,000 modifications, 81 lots executed." },
            ],
          },
          text: "Historical case: those orders were 20–29% of the E-mini S&P sell side. The CFTC found they contributed to the extreme order book imbalance before the flash crash; some researchers dispute how much. Sarao paid about $38.6 million, received permanent trading bans and pleaded guilty to spoofing and wire fraud.",
          concept: "spoofing",
        },
        {
          kind: "match",
          title: "Legal, illegal or unknown?",
          prompt: "Sort each behaviour.",
          pairs: [
            { left: "Genuine buy orders at five prices below the market, each one willing to fill", right: "Legal", wrong: "Orders at several prices that the trader is willing to have filled are legitimate layering." },
            { left: "Large offers placed to be cancelled as price nears, while buying on the other side", right: "Illegal", wrong: "Orders meant to be cancelled, with trades on the opposite side, are the spoofing pattern the law bans." },
            { left: "An order cancelled because the trader changed their mind after news", right: "Legal", wrong: "Cancelling a genuine order is normal. The intent when placing it is what matters." },
            { left: "One pulled order, seen from outside", right: "Can't tell", wrong: "From outside, you can't see intent. One pulled order fits a changed mind as well as a spoof." },
          ],
          correct: "On screen, the behaviours can look alike. Intent at the moment of placing the order separates [[layering]] from spoofing.",
          concept: "spoofing",
        },
        {
          kind: "worked",
          title: "Cancel-to-fill ratio",
          lines: [
            "Agent B, a market maker: 4,000 orders, 3,600 cancelled, 400 filled. Ratio 3,600 ÷ 400 = 9.",
            "Agent A: 4,000 orders, 3,960 cancelled, 40 filled.",
            "[[cancel-to-fill-ratio|Cancel-to-fill ratio]] = cancelled ÷ filled = ?",
          ],
          ask: {
            answer: 99,
            tolerance: 0,
            feedback: [
              { value: 0.01, text: "That's filled ÷ cancelled, upside down. Put the cancels on top: 3,960 ÷ 40." },
              { value: 100, text: "4,000 ÷ 40 counts all orders. Use only the cancelled ones: 3,960 ÷ 40." },
            ],
            correct: "Right: 99 to 1, eleven times the market maker's ratio.",
          },
          after: "Market makers cancel heavily too, so a high ratio alone proves nothing. Surveillance reads the whole signature: distance from the touch, modification rate, the ratio and trades on the opposite side. Then it looks for intent.",
          concept: "spoofing",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "Never try a spoofing pattern, even in a simulator. A trick that works against simulated agents doesn't transfer, and on real markets it's illegal. Exchanges run surveillance built to find exactly this signature, and spoofing convictions have brought prison sentences.",
        },
      ],
      task: {
        widget: "bias-spotter",
        data: DESK_CARDS,
        goal: "Order-by-order statistics for five agents. Classify each one's pattern and find the spoofing signature.",
        success: { field: "solved", eq: 5 },
        correct: "Agent A carries the spoofing signature: far from the touch, constant re-pricing, 99:1 and opposite-side fills. The others are normal trading.",
        hints: ["Check four signals: distance from the touch, modification rate, cancel-to-fill ratio, opposite-side trades.", "A high ratio alone fits a market maker too. Look for all four signals together."],
        showMe: { solved: 5 },
        concept: "spoofing",
      },
      check: ["q-3.3.7-1", "q-3.3.7-2", "q-3.3.7-3"],
      recap: {
        takeaways: [
          "Spoofing is placing orders you intend to cancel before execution: illegal in US futures and under EU rules.",
          "Surveillance reads the whole signature: far from the touch, constant changes, huge cancel-to-fill, opposite-side trades.",
          "Genuine layering is legal; one pulled order proves nothing, because intent decides.",
        ],
      },
    },
  },

  // 3.3.8 · Market Profile and the auction
  {
    id: "3.3.8",
    title: "Market Profile and the auction",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 8,
    summary: "Building a TPO profile from 30-minute periods, finding its POC, value area and initial balance, naming the day type, and testing the claims made about them.",
    objectives: [
      "Build a TPO profile from 30-minute periods and find the POC, the 70% value area and the initial balance.",
      "Classify a session as balance or imbalance and name its day type at the close.",
      'Test the "80% rule" and value-area claims against random bands and the R0 control.',
    ],
    blocks: [],
    practice: [
      { kind: "arena", ref: "sideways", label: "Arena: sideways" },
      { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
    ],
    script: {
      unit: "3.3",
      courseId: "3.3.8",
      hook: {
        prompt: "Does Market Profile count time at each price, or volume at each price?",
        control: {
          kind: "choice",
          choices: [
            { id: "time", label: "Time", feedback: "Right. Each 30-minute period that trades at a price adds one letter, a TPO, there." },
            { id: "volume", label: "Volume", feedback: "That's the volume profile from 2.5. Market Profile counts 30-minute periods: time at price." },
            { id: "both", label: "Both", feedback: "Market Profile counts only time, one letter per period. Platforms often show a volume profile beside it, but the counts differ." },
          ],
          answer: "time",
        },
        compare: "You picked {yours}. Market Profile counts time: one TPO per 30-minute period at each price. The volume profile from 2.5 counts units.",
        concept: "market-profile",
      },
      learn: [
        {
          kind: "figure",
          title: "One letter per period",
          figure: {
            kind: "chart",
            chart: { candles: TPO_DAY, style: "bar", range: [99.9, 101.1], describe: TPO_DESCRIBE },
            steps: [
              { text: "Period A trades 100.30–100.70: one letter A at each of those five prices.", visible: 1 },
              { text: "Period B adds a B at each price from 100.10 to 100.40.", visible: 2 },
              { text: "Thirteen periods, A to M. Slide every letter sideways and the profile appears.", visible: 13 },
            ],
          },
          text: "A [[tpo|TPO]] (time-price opportunity) is one letter for each 30-minute period that traded at a price. Prices are grouped in rows of 0.10.",
          concept: "market-profile",
        },
        {
          kind: "figure",
          title: "The profile",
          figure: {
            kind: "bars",
            bars: TPO_ROWS.map(([price, letters]) => ({ label: `${price} · ${letters}`, value: letters.length, role: (price === "100.5" ? "concept" : "neutral") as MarkRole })),
          },
          text: "Count the letters in each row: 42 in all. The longest row, 100.5 with 8, is the [[point-of-control|point of control]]. The one-letter rows at the extremes, 101.0 and 100.0, are where price spent least time. [[single-prints|Single prints]] inside a profile mark a fast move.",
          concept: "market-profile",
        },
        {
          kind: "worked",
          title: "The 70% value area",
          lines: [
            "42 TPOs; 70% of 42 = 29.4. Start at the POC: 100.5, with 8.",
            "Neighbours 100.6 (7) and 100.4 (6): add 100.6. Total 15.",
            "Next: 100.7 (5) and 100.4 (6): add 100.4. Total 21.",
            "Next: 100.7 (5) and 100.3 (4): add 100.7. Total 26.",
            "Next: 100.8 (3) and 100.3 (4): add 100.3. Total 30, past 29.4.",
            "Value area high (VAH) = ?",
          ],
          ask: {
            answer: 100.7,
            tolerance: 0,
            feedback: [
              { value: 100.8, text: "100.8 was never added: at that step 100.3 had more TPOs, 4 against 3." },
              { value: 101, text: "101.0 is the day's high, not the value area's." },
            ],
            correct: "Right: the value area runs from 100.3 (VAL) to 100.7 (VAH).",
          },
          after: "The [[value-area|value area]], 100.3 to 100.7, holds 30 of the 42 TPOs. This adds one row at a time; some platforms compare two rows at a time and get different edges.",
          concept: "market-profile",
        },
        {
          kind: "hotspot",
          title: "The initial balance",
          prompt: "The initial balance is the range of the first hour, periods A and B. Tap its high.",
          chart: { candles: TPO_DAY, style: "bar", range: [99.9, 101.1], describe: TPO_DESCRIBE },
          zones: [
            { id: "dayhigh", label: "101.00", from: 100.95, to: 101.05, feedback: "101.00 is the day's high, set by period I in the afternoon." },
            { id: "ibh", label: "100.70", from: 100.65, to: 100.75 },
            { id: "poc", label: "100.50", from: 100.45, to: 100.55, feedback: "100.50 is the POC, the most-visited row, not the first hour's high." },
            { id: "ibl", label: "100.10", from: 100.05, to: 100.15, feedback: "100.10 is the low of the initial balance, set by period B." },
          ],
          answer: "ibh",
          correct: "Right: period A's high, 100.70. The [[initial-balance|initial balance]] runs from 100.10 to 100.70.",
          concept: "initial-balance",
        },
        {
          kind: "match",
          title: "Day types",
          prompt: "Match each day type with its profile shape.",
          pairs: [
            { left: "Normal day", right: "A wide initial balance that holds most of the day", wrong: "On a normal day, the first hour sets a wide range and price rarely leaves it." },
            { left: "Trend day", right: "A narrow initial balance, then steady extension one way, closing near the extreme", wrong: "A trend day keeps moving value in one direction and closes near its extreme." },
            { left: "Double distribution", right: "Two separate value areas joined by single prints", wrong: "One fast move between two balanced areas leaves single prints between them." },
            { left: "Neutral day", right: "Range extension on both sides of the initial balance, close in the middle", wrong: "A neutral day breaks the first hour's range up and down, then closes in between." },
          ],
          correct: "These [[day-type|day types]] come from practitioners and are assigned partly by eye; two analysts can label the same day differently.",
          concept: "market-profile",
        },
        {
          kind: "explain",
          title: "Balance and imbalance",
          text: "Auction market theory reads each session as an auction. In balance, price rotates inside value. In imbalance, it leaves value to search for a new one. The '80% rule' says: if price re-enters the value area and stays for two periods, it often crosses to the other side. That's practitioner lore, grade D.",
        },
        {
          kind: "callout",
          tone: "warning",
          text: "The critique: a value area assumes a roughly balanced distribution, and one day's profile is noisy; research suggests three days or more. Time at price isn't volume at price. Day types are partly subjective. Test the 80% rule against random bands of the same width, and on the random-walk control, before trusting it.",
        },
        {
          kind: "predict",
          title: "Your turn: name the day",
          prompt: "This session's initial balance was 100.10–100.70. Later, price traded down to 100.00 and up to 101.00, then closed at 100.40. Which day type?",
          control: {
            kind: "choice",
            choices: [
              { id: "normal", label: "Normal", feedback: "The first hour's range didn't hold: price extended below it, to 100.00, and above it, to 101.00." },
              { id: "trend", label: "Trend", feedback: "A trend day extends one way and closes near its extreme. This one closed at 100.40, mid-range." },
              { id: "double", label: "Double distribution", feedback: "There's one value area, 100.3 to 100.7, with no band of single prints splitting the profile." },
              { id: "neutral", label: "Neutral", feedback: "Right: extension on both sides of the initial balance, and a close back in the middle." },
            ],
            answer: "neutral",
          },
          figure: {
            kind: "chart",
            chart: { candles: TPO_DAY, style: "bar", range: [99.9, 101.1], describe: TPO_DESCRIBE },
            steps: [{ text: "IB 100.10–100.70; extensions to 100.00 (period C) and 101.00 (period I); close 100.40.", layers: [IB_ZONE] }],
          },
          reveal: "A neutral day: the first hour's range broke on both sides and the close came back inside value, an auction in balance. The label describes the session at the close; it isn't a forecast for tomorrow.",
          concept: "auction-market-theory",
        },
      ],
      check: ["q-3.3.8-1", "q-3.3.8-2", "q-3.3.8-3"],
      recap: {
        takeaways: [
          "Market Profile counts time: one TPO per 30-minute period at each price; volume profile counts units.",
          "POC, 70% value area and initial balance come from the letters; day types label the session's shape.",
          "The 80% rule and day types are grade D: test them against random bands and R0.",
        ],
      },
    },
  },
];

// ─── Check questions ────────────────────────────────────────────────────────

const questions: Question[] = [
  // 3.3.1
  {
    id: "q-3.3.1-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "Bid 100.20, ask 100.30. A print of 800 units appears at 100.20. Who was the aggressor?",
    options: [
      { id: "a", label: "A buyer, because 800 is a large print", rationale: "Size doesn't set the side. A print at the bid means a seller accepted the bid price." },
      { id: "b", label: "A seller, who hit the bid" },
      { id: "c", label: "Neither: large prints are always negotiated blocks", rationale: "Some are, but a print at the bid on the tape is classified as seller-initiated by the quote rule." },
      { id: "d", label: "You can't tell without the next print", rationale: "The next print doesn't matter. The quotes at the time of the trade settle it: 100.20 is the bid." },
    ],
    correct: "b",
    explanation: "The quote rule compares the print with the quotes at that moment. At the bid, the seller crossed the spread to trade with a resting buyer, so the print is seller-initiated.",
    lesson: "3.3.1",
    concepts: ["trade-classification"],
  },
  {
    id: "q-3.3.1-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "Every trade has a buyer and a seller. So what does knowing the aggressor add?",
    options: [
      { id: "a", label: "Whether more units were bought than sold", rationale: "Units bought always equal units sold. The aggressor says who initiated, not who traded more." },
      { id: "b", label: "Who will win the next move", rationale: "Urgency isn't direction. The passive side can be better informed, and the tape's forecasting value is grade D." },
      { id: "c", label: "Which side was in a hurry: who crossed the spread to trade now" },
      { id: "d", label: "Nothing: the aggressor and the passive side are the same", rationale: "They differ: the aggressor crossed the spread and paid it; the passive side was resting in the book." },
    ],
    correct: "c",
    explanation: "Volume can't be lopsided: each unit has a buyer and a seller. The aggressor flag tells you which side chose to pay the spread for immediacy. That's urgency, and it doesn't make the aggressor right.",
    lesson: "3.3.1",
    concepts: ["tape-reading", "trade-classification"],
    hints: ["Can more units be bought than sold?", "Who pays the spread, and why would they?"],
  },
  {
    id: "q-3.3.1-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "Your retail FX chart shows a volume bar of 2,400 on EUR/USD. What is it most likely counting?",
    options: [
      { id: "a", label: "Euros traded across the whole market", rationale: "Spot FX has no central exchange or consolidated tape, so no single feed sees total market volume." },
      { id: "b", label: "Contracts traded on a futures exchange", rationale: "That would be futures volume. A spot FX chart from a broker usually counts ticks." },
      { id: "c", label: "Aggressive buy volume minus aggressive sell volume", rationale: "That's delta. Retail FX volume is usually tick volume, with no aggressor information at all." },
      { id: "d", label: "Price changes in that period on your broker's feed" },
    ],
    correct: "d",
    explanation: "Spot FX trades over the counter across many dealers and venues, with no central tape. Retail platforms usually show tick volume: how many times the price changed at that broker. It tracks activity roughly, not units or aggressors.",
    lesson: "3.3.1",
    concepts: ["volume", "trade-classification"],
    hints: ["Is there one central exchange for spot FX?"],
  },

  // 3.3.2
  {
    id: "q-3.3.2-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "On a DOM ladder, where do you find your own working buy limit order?",
    options: [
      { id: "a", label: "In the bid size at its price, marked as yours" },
      { id: "b", label: "In the last-trades column", rationale: "Last trades are executions that already happened. A working order hasn't traded yet." },
      { id: "c", label: "Among the offers above the best ask", rationale: "A buy limit rests on the bid side, at or below the best bid, not among the offers." },
      { id: "d", label: "Nowhere: the ladder shows only other traders' orders", rationale: "A trading ladder shows your working orders at their prices, so you can see where you stand." },
    ],
    correct: "a",
    explanation: "A DOM has three layers of information: resting size at each price, recent executions, and your own working orders, shown at their price on the side where they rest. A buy limit waits on the bid side.",
    lesson: "3.3.2",
    concepts: ["depth-of-market"],
  },
  {
    id: "q-3.3.2-2",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "The offer at 100.40 shows 300. A buyer takes all 300. Half a second later, 300 show at 100.40 again. This repeats four times.",
    prompt: "Which size behaviour is this?",
    options: [
      { id: "a", label: "Pulling", rationale: "Pulling is size leaving without trading. Here the size traded, then came back." },
      { id: "b", label: "Stacking", rationale: "Stacking adds new size before trading. Here the same size returns after each fill." },
      { id: "c", label: "Reloading" },
      { id: "d", label: "Spoofing", rationale: "Spoofing means orders meant to be cancelled. These orders filled, again and again." },
    ],
    correct: "c",
    explanation: "The same size reappearing at the same price after each fill is reloading, the usual trace of an iceberg order. It shows a persistent seller at 100.40, not how much is left or what price does next.",
    lesson: "3.3.2",
    concepts: ["depth-of-market"],
    hints: ["Did the 300 trade, or vanish untouched?", "Same size, same price, back after each fill."],
  },
  {
    id: "q-3.3.2-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why isn't a large displayed bid proof of strong demand?",
    options: [
      { id: "a", label: "Large bids are always placed by spoofers", rationale: "Most large orders are genuine. The point is that you can't tell from the ladder, and it may leave." },
      { id: "b", label: "It can be cancelled at any moment, at no cost, before it trades" },
      { id: "c", label: "Displayed size is delayed by several minutes", rationale: "On a live ladder, displayed size is current. The issue is that it isn't committed: it can be cancelled." },
      { id: "d", label: "Bids never trade; only offers do", rationale: "Both sides trade whenever an aggressor crosses the spread. The bid may well fill, or vanish first." },
    ],
    correct: "b",
    explanation: "Displayed size shows what someone is willing to do right now, and it can change in an instant. Executed volume is a record. That's why reading intent from displayed size is grade D, and a trade taken because of a wall needs its own invalidation.",
    lesson: "3.3.2",
    concepts: ["depth-of-market"],
    hints: ["What does it cost to cancel a resting order?"],
  },

  // 3.3.3
  {
    id: "q-3.3.3-1",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A footprint bar shows 640 units traded at the ask and 410 at the bid. What is its bar delta?",
    numeric: { answer: 230, tolerance: 0, unit: "units" },
    explanation: "Delta = ask volume − bid volume = 640 − 410 = +230. More volume crossed the spread to buy; it says nothing about where price goes next.",
    lesson: "3.3.3",
    concepts: ["footprint-chart"],
    hints: ["Delta compares aggressive buying with aggressive selling.", "Ask volume minus bid volume: 640 − 410."],
    vary: {
      fields: { ask: [200, 1500, 10], bid: [200, 1500, 10] },
      constraints: ["ask != bid"],
      answer: "ask - bid",
      prompt: "A footprint bar shows {ask} units traded at the ask and {bid} at the bid. What is its bar delta?",
      explanation: "Delta = ask volume − bid volume = {ask} − {bid} = {answer}. It measures aggressive buying against aggressive selling inside the bar, not what comes next.",
      hint: "Ask volume minus bid volume: {ask} − {bid}.",
    },
  },
  {
    id: "q-3.3.3-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Footprint rows, bid × ask: 100.12: 30 × 45; 100.11: 15 × 90; 100.10: 40 × 25. Where is there a buy diagonal imbalance at 3:1 or more?",
    options: [
      { id: "a", label: "100.11: 90 at the ask against 15 at the bid on the same row", rationale: "That compares one row with itself. The diagonal compares 90 with the bid one row lower, 40: only 2.25:1." },
      { id: "b", label: "100.10: 40 at the bid against 25 at the ask", rationale: "That's the bid side, a sell comparison, and a sell imbalance compares bid at 100.10 with ask one tick up, 90." },
      { id: "c", label: "None of them", rationale: "45 ÷ 15 = 3.0 at 100.12 meets a 3:1 threshold exactly." },
      { id: "d", label: "100.12: 45 at the ask against 15 at the bid one tick lower" },
    ],
    correct: "d",
    explanation: "A buy diagonal imbalance compares the ask at one price with the bid one tick lower, the two sides that were quoted together. 45 ÷ 15 = 3.0 qualifies; 90 ÷ 40 = 2.25 at 100.11 doesn't, despite the biggest ask.",
    lesson: "3.3.3",
    concepts: ["footprint-imbalance"],
    hints: ["Diagonal: the ask at a price against the bid one row below it.", "Check 45 ÷ 15 and 90 ÷ 40."],
  },
  {
    id: "q-3.3.3-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "A course says stacked buy imbalances 'become support'. Which evidence grade fits that claim, and why?",
    options: [
      { id: "a", label: "Mechanic: the imbalance is computed from real trades", rationale: "The computation is mechanic. The claim that it becomes support is a forecast, and that part is untested." },
      { id: "b", label: "D: a practitioner heuristic; the imbalance records what traded, not what must happen next" },
      { id: "c", label: "A: it's how professional order-flow traders work", rationale: "Popularity isn't evidence. A claim earns a grade from tests against random zones, not from how many people use it." },
      { id: "d", label: "F: footprints are fake data", rationale: "Footprints are real trade data when the feed flags the aggressor. The weak part is the forecast, not the data." },
    ],
    correct: "b",
    explanation: "Separate the data from the reading. The footprint itself is mechanic. 'Stacked imbalances become support' predicts future behaviour and hasn't been shown to beat random zones of the same width: grade D.",
    lesson: "3.3.3",
    concepts: ["footprint-imbalance", "evidence-grades"],
    hints: ["Split the claim into the data and the forecast."],
  },

  // 3.3.4
  {
    id: "q-3.3.4-1",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "CVD stands at 1,250. The next three bars have deltas +180, −320 and +90. What is CVD now?",
    numeric: { answer: 1200, tolerance: 0, unit: "units" },
    explanation: "Add each bar's delta to the running total: 1,250 + 180 − 320 + 90 = 1,200. The level depends on the anchor; the changes are what you read.",
    lesson: "3.3.4",
    concepts: ["cumulative-volume-delta"],
    hints: ["CVD is a running total of bar deltas.", "1,250 + 180 − 320 + 90."],
    vary: {
      fields: { s: [500, 3000, 50], a: [50, 400, 10], b: [50, 400, 10], c: [50, 400, 10] },
      answer: "s + a - b + c",
      prompt: "CVD stands at {s}. The next three bars have deltas +{a}, −{b} and +{c}. What is CVD now?",
      explanation: "Add each bar's delta to the running total: {s} + {a} − {b} + {c} = {answer}. The level depends on the anchor; the changes are what you read.",
      hint: "Add the deltas in order: {s} + {a} − {b} + {c}.",
    },
  },
  {
    id: "q-3.3.4-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Price breaks above its last high; CVD stays below its own last high. What's the sound way to use this?",
    options: [
      { id: "a", label: "Sell at once: the divergence shows the reversal", rationale: "A divergence is grade D. Many moves with weaker delta keep going; acting before price confirms means fighting a trend on a hint." },
      { id: "b", label: "Ignore it: delta never matters", rationale: "It describes the move: less aggressive buying behind the new high. That's useful context, just not a signal by itself." },
      { id: "c", label: "Treat the move as fragile and wait for price to confirm a turn, such as a break of the last swing low" },
      { id: "d", label: "Buy more: higher prices on less buying mean the sellers are gone", rationale: "That reads the opposite story into the same data. Neither story is confirmed until price acts." },
    ],
    correct: "c",
    explanation: "A delta divergence flags a move with less aggressive buying behind it. It isn't a timing signal: confirmation comes from price, such as a break of the last swing low. Test any rule with and without that confirmation.",
    lesson: "3.3.4",
    concepts: ["delta-divergence"],
    hints: ["What does the divergence say about the move, and what doesn't it say?"],
  },
  {
    id: "q-3.3.4-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "How does OBV differ from CVD?",
    options: [
      { id: "a", label: "OBV gives each bar's whole volume the sign of its close; CVD signs each trade by its aggressor" },
      { id: "b", label: "They're the same line with different names", rationale: "Both are running totals, but OBV uses closes and whole-bar volume, CVD uses each trade's aggressor." },
      { id: "c", label: "CVD uses closes; OBV uses each trade's aggressor", rationale: "Reversed. OBV only needs candles; CVD needs trade-level data with the aggressor." },
      { id: "d", label: "OBV is cumulative; CVD resets every bar", rationale: "Both are cumulative. CVD can restart at a session anchor, but resetting every bar would make it bar delta." },
    ],
    correct: "a",
    explanation: "OBV needs only candles: a higher close adds the bar's whole volume, a lower close subtracts it. CVD needs every trade: buys at the ask add, sells at the bid subtract. A bar can close higher with negative delta.",
    lesson: "3.3.4",
    concepts: ["cumulative-volume-delta", "cumulative-volume-indicators"],
    hints: ["Which one can you compute from candles alone?"],
  },

  // 3.3.5
  {
    id: "q-3.3.5-1",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "A DOM shows a 300-unit bid at 99.50. Over four minutes, sellers trade 1,500 units at 99.50. The bid still shows about 300, and no trade prints below 99.50.",
    prompt: "What best describes this?",
    options: [
      { id: "a", label: "Exhaustion: sellers have run out", rationale: "Sellers traded 1,500 units, so aggression hasn't dried up. The selling meets a buyer who doesn't move." },
      { id: "b", label: "Spoofing: the bid is fake", rationale: "The bid traded 1,500 units. Orders that fill aren't spoofing; that's real size." },
      { id: "c", label: "Absorption: a passive buyer is taking the selling" },
      { id: "d", label: "A bearish breakout", rationale: "No trade has printed below 99.50. A breakout needs price through the level, and that hasn't happened." },
    ],
    correct: "c",
    explanation: "Heavy aggressive selling at one price without progress, with the bid refilling, is absorption. It describes a passive buyer with size, for now. The read is invalidated if price trades through the level.",
    lesson: "3.3.5",
    concepts: ["absorption"],
    hints: ["Who is aggressive, and did price make progress?"],
  },
  {
    id: "q-3.3.5-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which bar best fits order-flow exhaustion at the top of a rally?",
    options: [
      { id: "a", label: "A new high on the biggest volume and delta of the move", rationale: "Rising volume and delta at a new high show aggression increasing: momentum, the opposite of exhaustion." },
      { id: "b", label: "A new high on the lowest volume of the move and a small positive delta" },
      { id: "c", label: "A large bar down from the high on heavy selling", rationale: "That's a reversal bar after the fact, driven by aggressive sellers. Exhaustion is about buyers fading at the high." },
      { id: "d", label: "A bar inside the previous bar's range on average volume", rationale: "An inside bar doesn't reach a new extreme, and average volume shows nothing drying up." },
    ],
    correct: "b",
    explanation: "Exhaustion means aggressive volume fading at the extreme: a new high on thin volume and little delta, like bar 6 in the lesson, 340 units and delta +30. It's a grade D read, invalidated if a new high comes with rising delta.",
    lesson: "3.3.5",
    concepts: ["order-flow-exhaustion"],
    hints: ["Exhaustion is about aggression fading. What does that look like at a new high?"],
  },
  {
    id: "q-3.3.5-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "You read absorption by a passive seller at 101.20. Which event invalidates the read?",
    options: [
      { id: "a", label: "Price dips to 101.05", rationale: "A dip away from 101.20 fits the seller defending it. The read fails only if buyers trade through the level." },
      { id: "b", label: "Delta turns negative", rationale: "Sellers turning aggressive would fit the seller winning. The read is wrong when price gets through, not when it falls." },
      { id: "c", label: "Volume at 101.20 doubles", rationale: "More buying absorbed at 101.20 strengthens the read, as long as the level holds." },
      { id: "d", label: "Trades print above 101.22" },
    ],
    correct: "d",
    explanation: "A passive seller at 101.20 is a hypothesis about a level. It dies when buyers trade through it, here with a two-tick margin, above 101.22. Write that price down before acting on the read.",
    lesson: "3.3.5",
    concepts: ["absorption", "invalidation-level"],
    hints: ["What would show that the seller at 101.20 has gone?"],
  },

  // 3.3.6
  {
    id: "q-3.3.6-1",
    topic: "order_types",
    kind: "numeric",
    difficulty: 2,
    prompt: "An offer at 101.50 shows 80 units. 1,000 units trade there, and 80 still show. What is the minimum hidden size?",
    numeric: { answer: 920, tolerance: 0, unit: "units" },
    explanation: "At most 80 of the 1,000 came from the slice showing at the start, so at least 1,000 − 80 = 920 were hidden. The 80 showing now may be someone else's new order, so it isn't counted.",
    lesson: "3.3.6",
    concepts: ["absorption"],
    hints: ["Only the slice showing at the start was visible.", "Traded minus displayed: 1,000 − 80."],
    vary: {
      fields: { d: [20, 200, 10], t: [300, 2000, 50] },
      constraints: ["t > 2 * d"],
      answer: "t - d",
      prompt: "An offer at 101.50 shows {d} units. {t} units trade there, and {d} still show. What is the minimum hidden size?",
      explanation: "At most {d} of the {t} came from the slice showing at the start, so at least {t} − {d} = {answer} were hidden. The {d} showing now may be someone else's new order.",
      hint: "Traded minus displayed: {t} − {d}.",
    },
  },
  {
    id: "q-3.3.6-2",
    topic: "order_types",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which tape pattern is the signature of an iceberg order?",
    options: [
      { id: "a", label: "A very large displayed order that never trades", rationale: "That's displayed size, possibly a wall. An iceberg hides size; it reveals itself only by trading." },
      { id: "b", label: "Traded volume at one price far above the displayed size, with the same slice refilling" },
      { id: "c", label: "A single large print at the midpoint", rationale: "That could be a block or a hidden midpoint order. An iceberg shows a pattern of repeated fills at one price." },
      { id: "d", label: "Price moving fast through several levels", rationale: "That's a market order walking thin liquidity, the opposite of size resting at one price." },
    ],
    correct: "b",
    explanation: "An iceberg displays a small slice and refills it from a hidden reserve. On the tape, that shows as much more volume trading at one price than was ever displayed, with the same size reappearing after each fill.",
    lesson: "3.3.6",
    concepts: ["absorption"],
  },
  {
    id: "q-3.3.6-3",
    topic: "order_types",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why does a synthetic iceberg look like many separate orders to the exchange?",
    options: [
      { id: "a", label: "The exchange splits large orders automatically", rationale: "That describes a native iceberg, which the exchange manages as one order. A synthetic one is managed outside the exchange." },
      { id: "b", label: "Synthetic icebergs are illegal, so they're disguised", rationale: "Icebergs, native or synthetic, are legal order types. The difference is only where the hidden reserve is kept." },
      { id: "c", label: "The platform sends a new order each time a slice fills; the exchange never sees the parent order" },
      { id: "d", label: "Because each slice gets better queue priority", rationale: "Each new slice usually joins the back of the queue. Being separate orders doesn't improve priority." },
    ],
    correct: "c",
    explanation: "A native iceberg is one exchange order with a display quantity and a reserve. A synthetic iceberg is kept by a platform or broker, which submits a fresh order after each fill. The exchange sees unrelated orders, each joining the back of the queue.",
    lesson: "3.3.6",
    concepts: ["order-queue"],
    hints: ["Where is the hidden reserve kept in each case?"],
  },

  // 3.3.7
  {
    id: "q-3.3.7-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "What makes an order spoofing under US futures law?",
    options: [
      { id: "a", label: "Cancelling any order within a second", rationale: "Fast cancels are normal, especially for market makers. The law targets intent at placement, not speed." },
      { id: "b", label: "Placing an order larger than the displayed market", rationale: "Large orders are legal. Size isn't the issue; placing an order you never mean to fill is." },
      { id: "c", label: "Bidding or offering with the intent to cancel before execution" },
      { id: "d", label: "Placing orders at several prices at once", rationale: "Genuine orders at several prices are legitimate layering. They become illegal only if they're meant to be cancelled." },
    ],
    correct: "c",
    explanation: "The Commodity Exchange Act, as amended by Dodd-Frank, bans 'bidding or offering with the intent to cancel the bid or offer before execution'. EU market-abuse rules also treat misleading orders as manipulation. Intent separates it from normal trading.",
    lesson: "3.3.7",
    concepts: ["spoofing"],
  },
  {
    id: "q-3.3.7-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which combination is the surveillance signature of spoofing?",
    options: [
      { id: "a", label: "A high cancel-to-fill ratio on its own", rationale: "Market makers cancel heavily too. The ratio alone doesn't separate them from a spoofer." },
      { id: "b", label: "Many small fills at the best bid and ask", rationale: "That's ordinary trading or market making: orders that fill aren't the problem." },
      { id: "c", label: "A single large order that is pulled", rationale: "One pulled order fits a changed mind. Surveillance needs a pattern, and intent." },
      { id: "d", label: "Large orders away from the touch, frequent modifications, a very high cancel-to-fill ratio and trades on the opposite side" },
    ],
    correct: "d",
    explanation: "No single statistic proves spoofing. The signature is the combination: big orders that stay out of reach, constant re-pricing, almost no fills, and trading done on the other side of the book.",
    lesson: "3.3.7",
    concepts: ["spoofing"],
    hints: ["Would a market maker match that description too?"],
  },
  {
    id: "q-3.3.7-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 3,
    scenario: "On the DOM you watch a 1,000-unit offer at 100.30. When price reaches 100.27, it disappears without trading.",
    prompt: "What can you conclude?",
    options: [
      { id: "a", label: "Nothing about intent: one pulled order fits a changed mind, a risk limit or a spoof" },
      { id: "b", label: "It's spoofing and should be reported as such", rationale: "From outside you see one cancel and no intent. Surveillance needs the whole pattern and records only investigators see." },
      { id: "c", label: "It was a hidden iceberg", rationale: "An iceberg reveals itself by trading beyond its displayed size. This order never traded." },
      { id: "d", label: "Sellers are weak, so price will rise", rationale: "Reading direction from one cancel is the grade D intent read this lesson warns against." },
    ],
    correct: "a",
    explanation: "Cancelling is normal. Spoofing needs intent to cancel at the moment of placing, inferred from a pattern of conduct and from records only investigators see. From the ladder, note the event and don't trade because of it.",
    lesson: "3.3.7",
    concepts: ["spoofing", "depth-of-market"],
    hints: ["What can you see from outside, and what can't you?", "Intent at the moment of placing is the legal line."],
  },

  // 3.3.8
  {
    id: "q-3.3.8-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "How does a Market Profile (TPO) differ from a volume profile?",
    options: [
      { id: "a", label: "It counts units traded at the ask only", rationale: "That's closer to a footprint's ask column. Market Profile ignores units entirely and counts time." },
      { id: "b", label: "It counts 30-minute periods at each price, not units traded" },
      { id: "c", label: "It's the same count drawn with letters", rationale: "The letters count periods. A price visited briefly by heavy volume gets one letter but a big volume bar." },
      { id: "d", label: "It counts only the first hour of trading", rationale: "That's the initial balance, one part of the profile. The profile covers every period of the session." },
    ],
    correct: "b",
    explanation: "A TPO profile adds one letter for each 30-minute period that traded at a price, so it measures time at price. A volume profile adds up units at each price. They often look alike but can disagree, for example after a short burst of heavy trading.",
    lesson: "3.3.8",
    concepts: ["market-profile", "volume-profile"],
  },
  {
    id: "q-3.3.8-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 3,
    prompt: "Building a value area, your running total is 21 TPOs. The next candidate rows hold 5 above and 4 below. Adding one row at a time, what is the running total after the next step?",
    numeric: { answer: 26, tolerance: 0, unit: "TPOs" },
    explanation: "Compare the two neighbours and add the larger: 21 + 5 = 26. In the lesson's profile, this step added 100.7. Repeat until the total reaches 70% of all TPOs.",
    lesson: "3.3.8",
    concepts: ["market-profile"],
    hints: ["The rule adds the neighbouring row with more TPOs.", "21 + 5."],
    vary: {
      fields: { run: [10, 40, 1], up: [1, 9, 1], dn: [1, 9, 1] },
      constraints: ["up != dn"],
      answer: "run + max(up, dn)",
      prompt: "Building a value area, your running total is {run} TPOs. The next candidate rows hold {up} above and {dn} below. Adding one row at a time, what is the running total after the next step?",
      explanation: "Add the larger neighbouring row: {run} + {max(up, dn)} = {answer}. Repeat until the total reaches 70% of all TPOs.",
      hint: "Add the larger of {up} and {dn} to {run}.",
    },
  },
  {
    id: "q-3.3.8-3",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 3,
    scenario: "A lab tests the 80% rule on 200 LABX sessions in which price re-entered the value area and stayed two periods. Price crossed to the other side in 58% of them. Random bands of the same width, placed by chance, were crossed in 55% of comparable cases.",
    prompt: "What does this test show?",
    options: [
      { id: "a", label: "The rule works: 58% beats a coin flip", rationale: "The fair comparison is the random bands at 55%, not a coin flip. Three points on 200 cases is within noise." },
      { id: "b", label: "The rule adds little beyond any band of that width, and nowhere near 80%" },
      { id: "c", label: "The rule works 80% of the time, as its name says", rationale: "The test measured 58%. A rule's name isn't its hit rate." },
      { id: "d", label: "Value areas are useless for anything", rationale: "The test is about one claim, the 80% rule. Value areas still describe where the session traded." },
    ],
    correct: "b",
    explanation: "Compare a rule with a control, not with its own name. 58% against 55% for random bands of the same width is a small gap on 200 cases, likely noise: one standard error is about 3.5 points. The claimed 80% doesn't appear.",
    lesson: "3.3.8",
    concepts: ["market-profile", "base-rates"],
    hints: ["What should 58% be compared with?", "Random bands of the same width are the baseline."],
  },
];

// ─── Glossary terms introduced in 3.3 ───────────────────────────────────────

const terms: GlossaryTerm[] = [
  {
    id: "time-and-sales",
    term: "Time and sales",
    definition: "A running list of trades with their time, price and size, and often the side that initiated each one.",
    plain: "The market's receipt roll: every trade as it happens.",
    related: ["print", "aggressor", "tick-rule"],
    lesson: "3.3.1",
    aka: ["T&S", "the tape"],
  },
  {
    id: "aggressor",
    term: "Aggressor",
    definition: "The side that crossed the spread to trade: a buyer paying the ask or a seller hitting the bid. The other side was resting in the book.",
    plain: "The trader who was in a hurry and took the price on offer.",
    related: ["time-and-sales", "bid", "ask"],
    lesson: "3.3.1",
  },
  {
    id: "print",
    term: "Print",
    definition: "One trade as reported on the tape, with its time, price and size.",
    plain: "A single trade on the time-and-sales list.",
    related: ["time-and-sales", "aggressor"],
    lesson: "3.3.1",
  },
  {
    id: "tick-rule",
    term: "Tick rule",
    definition: "Guessing a trade's side from the price change: an uptick counts as a buy, a downtick as a sell, and an unchanged price repeats the last direction.",
    plain: "If the price went up, assume a buyer started the trade. It's often wrong.",
    related: ["aggressor", "time-and-sales", "tick"],
    lesson: "3.3.1",
  },
  {
    id: "dom",
    term: "DOM (depth of market)",
    definition: "A price ladder showing resting size at each price, recent trades and your own working orders, updated as orders are added and cancelled.",
    plain: "A live ladder of who is waiting to buy and sell at each price.",
    related: ["order-book", "market-depth", "pulling", "stacking"],
    lesson: "3.3.2",
    aka: ["Depth of market", "price ladder"],
  },
  {
    id: "pulling",
    term: "Pulling",
    definition: "Resting orders cancelled as price approaches them, before they trade.",
    plain: "Size on the ladder that vanishes just before price gets there.",
    related: ["dom", "stacking", "spoofing"],
    lesson: "3.3.2",
  },
  {
    id: "stacking",
    term: "Stacking",
    definition: "Resting size added at a price level, usually before it trades.",
    plain: "More and more orders piling up at one price.",
    related: ["dom", "pulling"],
    lesson: "3.3.2",
  },
  {
    id: "reloading",
    term: "Reloading",
    definition: "The same size reappearing at a level after it trades, often the trace of an iceberg order.",
    plain: "A level that fills, then shows the same size again, and again.",
    related: ["dom", "iceberg-refill", "absorption"],
    lesson: "3.3.2",
  },
  {
    id: "liquidity-heatmap",
    term: "Liquidity heatmap",
    definition: "A chart that colours resting order size by price and time, so displayed size and its changes show as bands.",
    plain: "A picture of the order book over time: bright where many orders wait.",
    related: ["dom", "market-depth", "pulling"],
    lesson: "3.3.2",
  },
  {
    id: "footprint",
    term: "Footprint",
    definition: "A bar split by price that shows, at each price, the volume traded at the bid and at the ask.",
    plain: "A candle opened up to show who traded at each price inside it.",
    related: ["bar-delta", "diagonal-imbalance", "point-of-control"],
    lesson: "3.3.3",
    aka: ["Footprint chart"],
  },
  {
    id: "bar-delta",
    term: "Bar delta",
    definition: "Aggressive buy volume minus aggressive sell volume within one bar: ask volume minus bid volume.",
    plain: "How much more was bought than sold by traders in a hurry, in one bar.",
    related: ["footprint", "volume-delta", "cvd"],
    lesson: "3.3.3",
  },
  {
    id: "diagonal-imbalance",
    term: "Diagonal imbalance",
    definition: "Ask volume at one price several times the bid volume one tick lower (a buy imbalance), or bid volume several times the ask volume one tick higher (a sell imbalance), often at 3:1.",
    plain: "A spot in the footprint where one side traded far more than the other.",
    related: ["footprint", "stacked-imbalance"],
    lesson: "3.3.3",
  },
  {
    id: "stacked-imbalance",
    term: "Stacked imbalance",
    definition: "Three or more same-side diagonal imbalances at consecutive prices in one footprint bar.",
    plain: "Several imbalances in a row, all on the same side.",
    related: ["diagonal-imbalance", "footprint"],
    lesson: "3.3.3",
  },
  {
    id: "unfinished-auction",
    term: "Unfinished auction",
    definition: "A bar extreme with trading on both the bid and the ask, which practitioners claim price tends to revisit. The claim is untested.",
    plain: "A high or low where both sides were still trading, as if the auction didn't finish there.",
    related: ["footprint", "exhaustion-print"],
    lesson: "3.3.3",
  },
  {
    id: "exhaustion-print",
    term: "Exhaustion print",
    definition: "Very thin one-sided volume at a bar's extreme, read by practitioners as the aggressors running out.",
    plain: "Almost nothing traded at the very top or bottom of a bar.",
    related: ["footprint", "unfinished-auction", "exhaustion"],
    lesson: "3.3.3",
  },
  {
    id: "volume-delta",
    term: "Volume delta",
    definition: "Aggressive buy volume minus aggressive sell volume over a period, from trades classified by their aggressor.",
    plain: "Buying in a hurry minus selling in a hurry.",
    related: ["bar-delta", "cvd", "aggressor"],
    lesson: "3.3.4",
    aka: ["Delta"],
  },
  {
    id: "cvd",
    term: "Cumulative volume delta (CVD)",
    definition: "The running total of volume delta from a chosen starting point, the anchor. Its level depends on the anchor; only its changes compare.",
    plain: "Delta added up over time, from a start you pick.",
    related: ["volume-delta", "bar-delta", "obv", "delta-divergence"],
    lesson: "3.3.4",
    aka: ["CVD", "Cumulative delta"],
  },
  {
    id: "delta-divergence",
    term: "Delta divergence",
    definition: "Price makes a new high or low while cumulative delta does not. It flags a move with less aggression behind it, not a reversal.",
    plain: "Price goes further, but the buying (or selling) behind it doesn't.",
    related: ["cvd", "divergence"],
    lesson: "3.3.4",
  },
  {
    id: "absorption",
    term: "Absorption",
    definition: "Heavy aggressive trading at a level that doesn't move price, because passive orders take all of it.",
    plain: "Lots of selling (or buying) hits one price and price doesn't budge.",
    related: ["effort-vs-result", "reloading", "iceberg-refill"],
    lesson: "3.3.5",
  },
  {
    id: "effort-vs-result",
    term: "Effort vs result",
    definition: "Wyckoff's comparison of volume, the effort, with price progress, the result. Big effort with little result suggests size on the other side.",
    plain: "A lot of trading that gets price nowhere is a clue.",
    related: ["absorption", "volume"],
    lesson: "3.3.5",
  },
  {
    id: "iceberg-refill",
    term: "Iceberg refill",
    definition: "The visible slice of an iceberg order reappearing after it trades, drawn from the hidden reserve and usually placed at the back of the queue.",
    plain: "The small visible part of a big hidden order coming back after each fill.",
    related: ["reserve-quantity", "reloading", "queue-priority"],
    lesson: "3.3.6",
    aka: ["Refill"],
  },
  {
    id: "reserve-quantity",
    term: "Reserve quantity",
    definition: "The hidden part of an iceberg order still waiting to be shown. From outside, only a minimum can be estimated: traded minus displayed.",
    plain: "How much of a hidden order is still left. You can't see it.",
    related: ["iceberg-refill", "reloading"],
    lesson: "3.3.6",
  },
  {
    id: "spoofing",
    term: "Spoofing",
    definition: "Bidding or offering with the intent to cancel before execution, to mislead other traders about supply or demand. Illegal in US futures and treated as market manipulation in the EU.",
    plain: "Placing fake orders you never mean to fill. It's illegal.",
    related: ["layering", "cancel-to-fill-ratio", "market-abuse", "pulling"],
    lesson: "3.3.7",
  },
  {
    id: "layering",
    term: "Layering",
    definition: "Orders at several prices on one side of the book. Genuine layers are legal; layers meant to be cancelled are a form of illegal spoofing.",
    plain: "Orders stacked at several prices. Legal if real, illegal if fake.",
    related: ["spoofing", "stacking"],
    lesson: "3.3.7",
  },
  {
    id: "cancel-to-fill-ratio",
    term: "Cancel-to-fill ratio",
    definition: "Orders cancelled divided by orders filled. Market makers run high ratios too, so a high value alone doesn't prove manipulation.",
    plain: "How many orders someone cancels for each one that trades.",
    related: ["spoofing", "market-maker"],
    lesson: "3.3.7",
  },
  {
    id: "market-abuse",
    term: "Market abuse",
    definition: "Illegal conduct that distorts prices or exploits inside information, such as spoofing, manipulation or insider dealing.",
    plain: "Cheating the market: fake orders, rigged prices or trading on secrets.",
    related: ["spoofing", "regulator"],
    lesson: "3.3.7",
  },
  {
    id: "tpo",
    term: "TPO",
    definition: "Time-price opportunity: one letter in a Market Profile for each 30-minute period that traded at a price.",
    plain: "A letter marking that price traded during one half-hour.",
    related: ["initial-balance", "single-prints", "value-area", "point-of-control"],
    lesson: "3.3.8",
    aka: ["Time-price opportunity"],
  },
  {
    id: "initial-balance",
    term: "Initial balance",
    definition: "The price range of the first hour of the regular session, the first two 30-minute periods in Market Profile.",
    plain: "The high and low of the first hour of trading.",
    related: ["tpo", "opening-range", "day-type"],
    lesson: "3.3.8",
    aka: ["IB"],
  },
  {
    id: "single-prints",
    term: "Single prints",
    definition: "Prices inside a Market Profile traded in only one 30-minute period, the trace of a fast move.",
    plain: "Prices the market passed through only once, quickly.",
    related: ["tpo", "day-type"],
    lesson: "3.3.8",
  },
  {
    id: "day-type",
    term: "Day type",
    definition: "A Market Profile label for a session's shape, such as normal, trend, double distribution or neutral, assigned partly by eye.",
    plain: "A name for what kind of day it was, judged at the close.",
    related: ["initial-balance", "tpo", "single-prints"],
    lesson: "3.3.8",
  },
];

// ─── Concepts introduced in 3.3 ─────────────────────────────────────────────

const concepts: Concept[] = [
  {
    id: "tape-reading",
    name: "Tape reading",
    category: "market_fundamentals",
    summary: "Reading time-and-sales prints (price, size, aggressor, pace) to describe urgency, not to forecast direction.",
    body: [
      "The tape lists every trade: time, price, size and, when the feed flags it, the side that crossed the spread. Every unit traded had a buyer and a seller, so size alone has no direction; the aggressor tells you which side was in a hurry.",
      "Pace, the number of prints per second, shows urgency. As a forecast of direction it is a heuristic (grade D): over 20 rounds on a random-walk control, following the pace scored 11 of 20, inside the 6 to 14 range a coin flip gives about 96% of the time.",
    ],
    example: "Bid 99.95, ask 100.05: 300 at 100.05 is buyer-initiated, 500 at 99.95 seller-initiated, and 5,000 at 100.00 can't be classified from the quotes.",
    related: ["trade-classification", "bid-ask-spread", "volume"],
    missions: [],
    lessons: ["3.3.1"],
  },
  {
    id: "trade-classification",
    name: "Trade classification",
    category: "market_fundamentals",
    summary: "Labelling each trade buyer- or seller-initiated, by exchange flag or by rules that misclassify a share of trades.",
    body: [
      "Some feeds flag the aggressor. Others leave software to guess: the quote rule compares the print with the bid and ask, and Lee–Ready falls back on the tick rule for midpoint prints. Validation studies report accuracy of roughly 75–90% (grade B), worse with fast quotes and hidden or midpoint fills.",
      "Every order-flow tool built on guessed sides, delta, CVD and footprints among them, inherits the error. In spot FX there is no central tape, so retail volume is usually tick volume from one broker.",
    ],
    example: "Over 20 prints, the tick rule disagreed with the engine 4 times, a 20% error: two sells on upticks, one buy on a downtick and one buy at an unchanged price.",
    related: ["tape-reading", "bid-ask-spread"],
    missions: [],
    lessons: ["3.3.1"],
  },
  {
    id: "depth-of-market",
    name: "Depth of market (DOM)",
    category: "market_fundamentals",
    summary: "A price ladder of resting size, recent trades and working orders that changes as orders are added and pulled.",
    body: [
      "A DOM ladder shows the size waiting at each price, the last trades beside it and your own orders. Displayed size behaves in four visible ways: pulling, stacking, reloading and absorption.",
      "What the ladder can't show is intent. Displayed size is free to cancel, so reading direction from it is grade D; executed volume is a record. A pulled order isn't automatically spoofing: cancellations are a normal part of trading.",
    ],
    example: "A 2,000-unit offer at 100.20, ten times the usual size, was cancelled with price at 100.17 before a unit traded there. Price went on to 100.28.",
    related: ["order-queue", "tape-reading", "absorption"],
    missions: [],
    lessons: ["3.3.2"],
  },
  {
    id: "footprint-chart",
    name: "Footprint chart",
    category: "technical_analysis",
    summary: "A bar split by price level that shows volume traded at the bid and at the ask.",
    body: [
      "Each row of a footprint bar shows bid volume (aggressive sells) × ask volume (aggressive buys) at one price. Bar delta is ask minus bid; the bar's POC is the row with the most volume.",
      "A footprint needs every trade with its aggressor; it can't be rebuilt from OHLCV, and on feeds without the flag it inherits classification errors. A candle that closes higher can still hide negative delta.",
    ],
    example: "A bar from 100.00 to 100.05 traded 505 at the ask and 210 at the bid: delta +295, POC 100.04 with 180 units. The next bar closed 0.03 higher with delta −145.",
    related: ["footprint-imbalance", "volume-profile", "trade-classification"],
    missions: [],
    lessons: ["3.3.3"],
  },
  {
    id: "footprint-imbalance",
    name: "Footprint imbalance",
    category: "technical_analysis",
    summary: "Ask volume at one price far above bid volume one tick lower, or the reverse, often at 3:1.",
    body: [
      "A buy diagonal imbalance compares the ask at a price with the bid one tick lower; a sell imbalance compares the bid with the ask one tick higher. Three or more in a row on the same side form a stacked imbalance.",
      "The count depends on the threshold you pick, and the claim that stacked imbalances become support is a practitioner heuristic (grade D). An imbalance describes what happened, not what must happen next; test it against random zones of the same width.",
    ],
    example: "Ratios of 3.14, 6 and 6 at 100.02–100.04 stack at 3:1. At 4:1 only two remain and the stack disappears.",
    related: ["footprint-chart", "evidence-grades"],
    missions: [],
    lessons: ["3.3.3"],
  },
  {
    id: "cumulative-volume-delta",
    name: "Cumulative volume delta",
    category: "technical_analysis",
    summary: "Running sum of aggressive buy minus aggressive sell volume from a chosen anchor.",
    body: [
      "CVD adds each bar's delta to a running total. Its level depends on the anchor, a session open or a date long ago, so only changes are comparable. Unlike OBV, which signs a bar's whole volume by its close, CVD signs each trade by its aggressor.",
      "Delta measures aggression, not the book. Price can rise on flat or negative delta when sellers cancel their offers, and most platform CVDs are approximations that accumulate classification errors.",
    ],
    example: "Deltas +295, +120, −80, +60, −40 give CVD 295, 415, 335, 395, 355. A later rally of 0.30 came with deltas −10, −20, −10 while 1,900 units of offers were cancelled.",
    related: ["footprint-chart", "cumulative-volume-indicators", "delta-divergence"],
    missions: [],
    lessons: ["3.3.4"],
  },
  {
    id: "delta-divergence",
    name: "Delta divergence",
    category: "technical_analysis",
    summary: "Price makes a new extreme while cumulative delta does not; a fragile move, not a reversal signal.",
    body: [
      "A delta divergence says a new high (or low) came with less aggression behind it. It is grade D as a signal: many such moves keep going. Price has to confirm, for example by breaking the last swing low.",
      "Check the anchor too. A divergence that crosses a session reset can appear under a session anchor and vanish under a continuous one; inside one session, both anchors agree.",
    ],
    example: "Bar 4's high of 101.10 beat bar 2's 100.80 while CVD reached 395 against 415: a divergence, with no reversal until price confirms.",
    related: ["cumulative-volume-delta", "divergence"],
    missions: [],
    lessons: ["3.3.4"],
  },
  {
    id: "absorption",
    name: "Absorption",
    category: "technical_analysis",
    summary: "Heavy aggressive volume at a level that fails to move price because passive orders soak it up.",
    body: [
      "Absorption is Wyckoff's effort versus result read at one price: lots of aggressive volume, little progress. Often the passive side refills, as an iceberg does.",
      "It describes what has happened, not how much size remains, so it is a grade D heuristic. Every read needs an invalidation: if the level breaks, the absorption failed.",
    ],
    example: "Sellers traded 1,800 units into the 99.50 bid in six minutes, delta −1,500, while price stayed between 99.50 and 99.52. Trades below 99.48 would invalidate the read.",
    related: ["order-flow-exhaustion", "invalidation-level", "depth-of-market"],
    missions: ["M07"],
    lessons: ["3.3.5", "3.3.6"],
  },
  {
    id: "order-flow-exhaustion",
    name: "Order-flow exhaustion",
    category: "technical_analysis",
    summary: "Aggressive volume drying up at the extreme of a move.",
    body: [
      "Exhaustion shows as a new high on thin volume and little delta, or a new low with selling fading. It describes aggression fading at the extreme; as a reversal signal it is grade D.",
      "The read dies when aggression returns: a new high with rising delta is momentum, not exhaustion.",
    ],
    example: "Five rally bars traded 820 to 1,110 units; the sixth made a new high at 101.12 on 340 units and delta +30.",
    related: ["absorption", "momentum-vs-exhaustion", "invalidation-level"],
    missions: [],
    lessons: ["3.3.5"],
  },
  {
    id: "spoofing",
    name: "Spoofing and layering (illegal)",
    category: "market_fundamentals",
    summary: "Placing orders with intent to cancel before execution to mislead others about supply or demand.",
    body: [
      "US futures law, as amended by Dodd-Frank, bans bidding or offering with the intent to cancel before execution; EU market-abuse rules treat misleading orders as manipulation. Genuine orders at several prices, legitimate layering, are legal.",
      "Surveillance looks for a signature: large orders away from the touch, constant modification, a very high cancel-to-fill ratio and trades on the opposite side. No single statistic proves it; one pulled order seen from outside proves nothing.",
    ],
    example: "Historical case, CFTC v. Sarao: on 6 May 2010 a program's orders were modified more than 81,000 times with 81 lots executed. He paid about $38.6 million and pleaded guilty to spoofing and wire fraud.",
    related: ["depth-of-market", "market-participants"],
    missions: [],
    lessons: ["3.3.7"],
  },
  {
    id: "market-profile",
    name: "Market Profile (TPO)",
    category: "technical_analysis",
    summary: "A distribution of time at price from 30-minute periods, with point of control, value area and initial balance.",
    body: [
      "Each 30-minute period that trades at a price adds one letter, a TPO. The row with most letters is the POC; the value area grows from it, adding the larger neighbouring row until it holds 70% of the TPOs.",
      "Day types and the 80% rule are practitioner lore (grade D). One day's profile is noisy, time at price isn't volume at price, and day types are partly subjective; test the claims against random bands and the random-walk control.",
    ],
    example: "A 13-period session gives 42 TPOs. POC 100.5 with 8; adding 100.6, 100.4, 100.7 and 100.3 reaches 30, past 29.4: value area 100.3–100.7.",
    related: ["volume-profile", "initial-balance", "auction-market-theory"],
    missions: [],
    lessons: ["3.3.8"],
  },
  {
    id: "initial-balance",
    name: "Initial balance",
    category: "technical_analysis",
    summary: "The price range of the first hour of the regular session.",
    body: [
      "In Market Profile the initial balance is the range of the first two 30-minute periods, A and B. Practitioners classify days by how far price extends beyond it: little on a normal day, one way on a trend day, both ways on a neutral day.",
      "Classifying the day from the initial balance is grade D, and it overlaps with the opening range from 2.9.",
    ],
    example: "Periods A (100.30–100.70) and B (100.10–100.40) give an initial balance of 100.10–100.70. Later extensions to 100.00 and 101.00, with a close at 100.40, make a neutral day.",
    related: ["market-profile", "opening-range-breakout"],
    missions: [],
    lessons: ["3.3.8"],
  },
  {
    id: "auction-market-theory",
    name: "Auction market theory",
    category: "technical_analysis",
    summary: "Price moves to find trade: balance means rotation inside value, imbalance means a search for new value.",
    body: [
      "Auction market theory reads each session as an auction. In balance, price rotates inside the value area; in imbalance, it leaves value to search for a new one, and a new value area forms.",
      "It's a useful vocabulary for describing a session. Its trading rules, such as the 80% rule, are practitioner lore without robust tests (grade D).",
    ],
    example: "A session breaks its initial balance on both sides, then closes at 100.40, inside its 100.3–100.7 value area: balance, a neutral day.",
    related: ["market-profile", "market-as-auction"],
    missions: [],
    lessons: ["3.3.8"],
  },
];

export const UNIT_3_3: UnitContent = { lessons, questions, terms, concepts };
