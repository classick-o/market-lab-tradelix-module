import type { CandleData, ChartLayer, ChartSpec, Concept, GlossaryTerm, Lesson, Question, UnitContent } from "../../types";

/**
 * Unit 4.1 · Options and volatility (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce.
 * Option prices are Black–Scholes (European, no dividends, r = 0 unless stated, T = days ÷ 365), checked with a script.
 * Reference chain, LABX 100.00, 30 days, IV 25%: call/put 90 10.21/0.21, 95 5.97/0.97, 100 2.86/2.86, 105 1.08/6.08,
 * 110 0.32/10.32. One contract = 10 units. Structures are priced from the quotes, which are rounded to the cent, so the
 * 7-day event straddle is 3.31 + 3.31 = 6.62 and the event strangle 1.47 + 1.33 = 2.80.
 */

const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });
/** Empty slots for figures that draw only their layers. */
const slots = (n: number, p = 0): CandleData[] => Array.from({ length: n }, () => k(p, p, p, p));
const r2 = (x: number): number => Math.round(x * 100) / 100;
/** A text label with no line: a one-point path. */
const tag = (index: number, price: number, label: string): ChartLayer => ({ kind: "path", points: [{ index, price }], role: "neutral", label });
const dot = (index: number, price: number, label: string, role: "accent" | "concept" | "up" | "down" | "neutral" = "accent"): ChartLayer => ({ kind: "marker", index, price, label, role });
const ZERO: ChartLayer = { kind: "level", price: 0, role: "neutral", chip: false };

// ─── Payoff axis ───────────────────────────────────────────────────────────

/** Payoff charts: LABX at expiry from 80 to 120; slot i is LABX = 80 + i. The y-axis is P&L (or value) per unit. */
const AXIS = Array.from({ length: 41 }, (_, i) => 80 + i);
const at = (s: number): number => s - 80;
const call = (strike: number) => (s: number) => Math.max(s - strike, 0);
const put = (strike: number) => (s: number) => Math.max(strike - s, 0);
/** One line across the payoff axis. */
const curve = (f: (s: number) => number, role: "accent" | "concept" | "up" | "down" | "neutral" = "accent", dashed = false): ChartLayer => ({
  kind: "line",
  values: AXIS.map((s) => r2(f(s))),
  role,
  dashed,
});
/** A payoff chart with the zero line and LABX price labels along the bottom. */
const payoffChart = (range: [number, number], describe: string, layers: ChartLayer[] = []): ChartSpec => ({
  candles: slots(41),
  hideCandles: true,
  range,
  height: 260,
  layers: [ZERO, ...[80, 90, 100, 110].map((s) => tag(at(s), range[0], s === 80 ? "LABX 80" : `${s}`)), ...layers],
  describe,
});

// ─── Data ──────────────────────────────────────────────────────────────────

/**
 * 4.1.2 B1: four payoff panels side by side (long call, short call, long put, short put; strike 100, premium 2.86).
 * Each panel spans LABX 80–120 in steps of 2.5 (17 slots), with 2 empty slots between panels.
 */
const PANEL = Array.from({ length: 17 }, (_, i) => 80 + i * 2.5);
const panelAt = (p: number, s: number): number => p * 19 + (s - 80) / 2.5;
const panelLine = (p: number, f: (s: number) => number, role: "accent" | "concept" | "up" | "down"): ChartLayer => {
  const values: (number | null)[] = Array.from({ length: 74 }, () => null);
  PANEL.forEach((s, i) => (values[p * 19 + i] = r2(f(s))));
  return { kind: "line", values, role };
};
const PANELS: ChartSpec = {
  candles: slots(74),
  hideCandles: true,
  range: [-19, 19],
  height: 260,
  layers: [
    ZERO,
    ...[17.5, 36.5, 55.5].map((x): ChartLayer => ({ kind: "path", points: [{ index: x, price: -19 }, { index: x, price: 19 }], role: "neutral", dashed: true })),
  ],
  describe:
    "Four payoff panels for the 100-strike LABX option bought or sold at 2.86, each across LABX 80 to 120 at expiry. Long call: −2.86 below 100, breakeven 102.86, rising without limit. Short call: the mirror. Long put: −2.86 above 100, breakeven 97.14, +17.14 at 80. Short put: +2.86 above 100, losing below 97.14.",
};

/** 4.1.5 B5: gamma of the 100-strike option across LABX 90–110 (steps of 0.5), IV 25%, with 30 days and 1 day left. */
const GAMMA_30 = [
  0.0221, 0.0245, 0.027, 0.0295, 0.032, 0.0346, 0.0371, 0.0396, 0.042, 0.0443, 0.0465, 0.0485, 0.0503, 0.0519, 0.0532, 0.0543, 0.0551, 0.0557, 0.0559, 0.0559, 0.0556,
  0.0551, 0.0543, 0.0532, 0.052, 0.0505, 0.0489, 0.0471, 0.0452, 0.0431, 0.041, 0.0388, 0.0366, 0.0344, 0.0322, 0.03, 0.0278, 0.0258, 0.0237, 0.0218, 0.0199,
];
const GAMMA_1 = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.0002, 0.0007, 0.0025, 0.0079, 0.0213, 0.0487, 0.0954, 0.1601, 0.2304, 0.2854, 0.3049, 0.2814, 0.2249, 0.1561, 0.0942, 0.0495, 0.0227,
  0.0091, 0.0032, 0.001, 0.0003, 0.0001, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

/** 4.1.6 B1: the at-the-money call (IV 25%) day by day; slot i has 30 − i days left. */
const DECAY = [
  2.86, 2.81, 2.76, 2.71, 2.66, 2.61, 2.56, 2.5, 2.45, 2.39, 2.33, 2.28, 2.21, 2.15, 2.09, 2.02, 1.95, 1.88, 1.81, 1.73, 1.65, 1.57, 1.48, 1.38, 1.28, 1.17, 1.04, 0.9,
  0.74, 0.52, 0,
];
const segment = (values: number[], from: number, to: number): (number | null)[] => values.map((v, i) => (i >= from && i <= to ? v : null));

/**
 * 4.1.7: a fictional LABX surface. Skew and smile of the 30-day expiry by strike (85–115, slot = strike − 85); term
 * structures by expiry (7, 14, 30, 60, 90, 180 days at even slots). The event curve: base IV 22% plus a one-day event move
 * of 6% between day 7 and day 14, so IV = √((0.22² × T + 0.06²) ÷ T) for expiries after the event.
 */
const SKEW_PTS: [number, number][] = [
  [85, 34],
  [90, 31],
  [95, 28],
  [100, 25],
  [105, 23],
  [110, 22],
  [115, 21.5],
];
const SMILE_PTS: [number, number][] = [
  [85, 31],
  [90, 28],
  [95, 26],
  [100, 25],
  [105, 26],
  [110, 28],
  [115, 31],
];
const TENORS = ["7d", "14d", "30d", "60d", "90d", "180d"];
const TERM_CALM = [22, 23, 25, 26.5, 27.5, 28.5];
const TERM_CRISIS = [55, 50, 44, 38, 34, 30];
const TERM_EVENT = [22, 37.7, 30.4, 26.5, 25.1, 23.6];
const termPath = (values: number[], role: "accent" | "concept" | "down", dashed = false): ChartLayer => ({
  kind: "path",
  points: values.map((v, i) => ({ index: i * 2, price: v })),
  role,
  dashed,
});
const TENOR_TAGS = (y: number): ChartLayer[] => TENORS.map((t, i) => tag(i * 2, y, t));

/**
 * 4.1.8 B3: LABX in daily candles (seed 7, Brownian bridges): 10 sessions to the entry close of 100.00 (slot 10), then
 * 20 sessions to expiry, closing at 80.00. Covered call 105, protective put 95 and collar marked.
 */
const CRASH: CandleData[] = [
  k(98.7, 99.35, 98.01, 98.4), k(98.4, 101.23, 97.67, 100.71), k(100.71, 100.97, 100.47, 100.77), k(100.77, 101.57, 99.41, 100.11), k(100.11, 100.91, 99.47, 100.28),
  k(100.28, 100.79, 100.28, 100.28), k(100.28, 101.32, 99.84, 101.12), k(101.12, 101.6, 100.02, 100.64), k(100.64, 101.16, 99.51, 99.78), k(99.78, 100.29, 98.28, 98.66),
  k(98.66, 100.12, 98.66, 100), k(100, 100.59, 99.73, 100.28), k(100.28, 100.47, 99.63, 100.45), k(100.45, 101.18, 97.35, 98.36), k(98.36, 98.98, 96.66, 97.07),
  k(97.07, 99.19, 96.02, 98.4), k(98.4, 98.86, 95.65, 95.89), k(95.89, 96.05, 95.3, 95.69), k(95.69, 96.14, 95, 95.48), k(95.48, 96.26, 93.74, 94.91),
  k(94.91, 95.67, 90.89, 91.88), k(91.88, 92.49, 91.36, 92.29), k(92.29, 93.36, 91, 91.24), k(91.24, 91.7, 87.55, 88.06), k(88.06, 88.42, 87.83, 88.29),
  k(88.29, 88.44, 86.44, 86.44), k(86.44, 86.45, 83.7, 83.75), k(83.75, 85.53, 83.67, 84.2), k(84.2, 84.41, 82.29, 82.54), k(82.54, 82.97, 79, 79.42),
  k(79.42, 80.89, 78.42, 80),
];

/**
 * 4.1.10 B2: the 6.62 event straddle across LABX 86–114 (slot = LABX − 86). At expiry: |S − 100| − 6.62. The day after the
 * event, IV 25% with 6 days left: Black–Scholes value − 6.62 (−4.06 at 100, −2.32 at 96, −2.27 at 104; breakevens 93.42 and 106.56).
 */
const EVENT_EXPIRY = Array.from({ length: 29 }, (_, i) => r2(Math.abs(86 + i - 100) - 6.62));
const EVENT_DAY_AFTER = [
  7.38, 6.38, 5.38, 4.38, 3.38, 2.38, 1.39, 0.41, -0.56, -1.47, -2.32, -3.04, -3.6, -3.95, -4.06, -3.93, -3.56, -2.99, -2.27, -1.44, -0.53, 0.42, 1.4, 2.39, 3.38,
  4.38, 5.38, 6.38, 7.38,
];

// ─── 4.1.1 · Calls and puts: the right, not the obligation ─────────────────

const L_4_1_1: Lesson = {
  id: "4.1.1",
  title: "Calls and puts: the right, not the obligation",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "An option is a paid right to buy or sell at a set price: the buyer risks only the premium, and the premium splits into intrinsic and extrinsic value.",
  objectives: [
    "Explain the difference between buying a call and buying a put.",
    "Classify an option as in, at or out of the money from its strike and the underlying price.",
    "Split an option's premium into intrinsic and extrinsic value.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "low_volatility", label: "Arena: low volatility" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "4.1",
    courseId: "4.1.1",
    bridge: "Level 3 closed with 3.14.8, where rate surprises reached futures and options. Level 4 starts with options. In 3.8.7 IV crush sank a call after earnings; in 1.4.1 you fixed your loss before entry. Here a premium buys a right and caps the buyer's loss.",
    hook: {
      prompt: "You pay 2.86 for a 30-day LABX call with strike 100. At expiry LABX is at 102.00. Did you make money?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Yes, +2.00", feedback: "2.00 is what the call is worth at expiry. It cost you 2.86, so you're 0.86 short." },
          { id: "b", label: "Yes, +0.86", feedback: "The sign is flipped: the call is worth 2.00 and cost 2.86." },
          { id: "c", label: "No, −0.86" },
          { id: "d", label: "No, −2.86", feedback: "The call isn't worthless: LABX ended 2.00 above the strike, so 2.00 of the 2.86 comes back." },
        ],
        answer: "c",
      },
      compare:
        "You picked {yours}. At expiry the call is worth 102.00 − 100.00 = 2.00, and it cost 2.86: −0.86 a unit, −8.60 on a 10-unit contract. Right on direction, still a loss.",
      concept: "option-contract",
    },
    learn: [
      {
        kind: "explain",
        title: "A right with a price",
        text: "An [[option]] gives its buyer a right, not an obligation, to trade at a set price, the [[strike-price|strike]], until the [[expiration-date|expiration date]]. A [[call-option|call]] is the right to buy; a [[put-option|put]], the right to sell. The buyer pays the [[option-premium|premium]]. The seller, the [[option-writer|writer]], collects it and takes on the obligation.",
      },
      {
        kind: "figure",
        title: "What the right is worth at expiry",
        figure: {
          kind: "chart",
          chart: payoffChart(
            [0, 21],
            "Value at expiry of the 100-strike LABX call and put, across LABX prices from 80 to 120. The call is worth LABX minus 100 above the strike and nothing below; the put is worth 100 minus LABX below the strike and nothing above.",
          ),
          steps: [
            { text: "A call at expiry: worth LABX minus 100 above the strike, nothing below.", layers: [curve(call(100), "accent"), dot(at(110), 10, "Call at 110: 10.00")] },
            { text: "A put at expiry: worth 100 minus LABX below the strike, nothing above.", layers: [curve(put(100), "concept"), dot(at(90), 10, "Put at 90: 10.00", "concept")] },
          ],
        },
        text: "These lines show the value of the right, before what you paid for it. The holder exercises only when it pays; otherwise the option expires worthless and the whole premium is lost.",
        concept: "option-contract",
      },
      {
        kind: "worked",
        title: "Intrinsic plus extrinsic",
        lines: [
          "[[intrinsic-value|Intrinsic value]]: call = max(S − K, 0); put = max(K − S, 0). [[extrinsic-value|Extrinsic value]] = premium − intrinsic.",
          "LABX at 100.00, 30 days. Call 95 at 5.97 = 5.00 + 0.97.",
          "Call 100 at 2.86 = 0 + 2.86. Call 105 at 1.08 = 0 + 1.08.",
          "Put 105 at 6.08: intrinsic 105 − 100 = 5.00. Extrinsic = 6.08 − 5.00 = ?",
        ],
        ask: {
          answer: 1.08,
          tolerance: 0.005,
          feedback: [
            { value: 6.08, text: "That's the whole premium. The put is 5.00 in the money: take that intrinsic part out." },
            { value: 5, text: "That's the intrinsic part, max(105 − 100, 0). The question asks what's left of 6.08." },
          ],
          correct: "Right. 1.08, the same extrinsic value as the call 105: paid for time and volatility, not direction.",
        },
        after: "Extrinsic value melts to zero by expiry. At the end, only intrinsic value is left.",
        concept: "option-moneyness",
      },
      {
        kind: "match",
        title: "In, at or out of the money",
        prompt: "LABX is at 100.00. Sort each option: [[in-the-money|in the money]], [[at-the-money|at the money]] or [[out-of-the-money|out of the money]].",
        pairs: [
          { left: "Call 95", right: "In the money", wrong: "The right to buy at 95 what trades at 100 is worth 5.00 today: in the money." },
          { left: "Call 100", right: "At the money", wrong: "The strike equals the price: at the money, with no intrinsic value yet." },
          { left: "Call 105", right: "Out of the money", wrong: "Buying at 105 what trades at 100 is worth nothing today: out of the money." },
          { left: "Put 95", right: "Out of the money", wrong: "Selling at 95 what trades at 100 is worth nothing today: out of the money." },
          { left: "Put 100", right: "At the money", wrong: "The strike equals the price: at the money, for a put as for a call." },
          { left: "Put 105", right: "In the money", wrong: "The right to sell at 105 what trades at 100 is worth 5.00 today: in the money." },
        ],
        columns: ["Option", "Moneyness"],
        correct: "Right. A call is in the money when its strike is below the price, a put when its strike is above. Only those have intrinsic value.",
        concept: "option-moneyness",
      },
      {
        kind: "explain",
        title: "One contract, ten units",
        text: "A LABX option contract covers 10 units, its [[contract-multiplier|contract multiplier]]. The call 100 costs 2.86 × 10 = 28.60 vUSD, and that is all the buyer can lose. The [[leverage]] comes from a small premium controlling 10 units worth 1,000.00. Real US stock options usually cover 100 shares.",
      },
      {
        kind: "predict",
        title: "Read the chain",
        prompt: "LABX calls, 30 days: 90 at 10.21, 95 at 5.97, 100 at 2.86, 105 at 1.08, 110 at 0.32. Which call is all extrinsic value, costs under 15.00 a contract, and sits closest to the money?",
        control: {
          kind: "choice",
          choices: [
            { id: "c95", label: "Call 95", feedback: "It's in the money: 5.00 of its 5.97 is intrinsic. And a contract costs 59.70." },
            { id: "c100", label: "Call 100", feedback: "All extrinsic, yes, but 2.86 × 10 = 28.60 a contract, over 15.00." },
            { id: "c105", label: "Call 105" },
            { id: "c110", label: "Call 110", feedback: "All extrinsic and 3.20 a contract, but the 105 is closer to the money and still under 15.00." },
          ],
          answer: "c105",
        },
        reveal: "The call 105: out of the money, so all 1.08 is extrinsic, and 1.08 × 10 = 10.80 a contract. LABX must rise above 105 before it has any value at expiry.",
        concept: "option-moneyness",
      },
    ],
    check: ["q-4.1.1-1", "q-4.1.1-2", "q-4.1.1-3"],
    recap: {
      takeaways: [
        "A call is the right to buy, a put the right to sell, at the strike; the writer is obliged.",
        "Calls are in the money with the strike below the price, puts above. Only they have intrinsic value.",
        "Premium = intrinsic + extrinsic: the put 105 at 6.08 is 5.00 + 1.08.",
      ],
      next: "Next, 4.1.2: the four building blocks, long and short calls and puts, each with its breakeven and worst case.",
    },
  },
};

// ─── 4.1.2 · Payoffs at expiry: four building blocks ───────────────────────

const L_4_1_2: Lesson = {
  id: "4.1.2",
  title: "Payoffs at expiry: four building blocks",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Long and short calls and puts are the four building blocks: buyers risk only the premium, writers can lose far more, and each has a breakeven you compute before trading.",
  objectives: [
    "Draw the expiry payoff of a long call, short call, long put and short put.",
    "Compute the breakeven, maximum loss and maximum gain of each building block.",
    "Explain exercise and assignment, and the difference between American and European style.",
  ],
  blocks: [],
  practice: [
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
    { kind: "check", ref: "risk_management", label: "Risk management check" },
  ],
  script: {
    unit: "4.1",
    courseId: "4.1.2",
    bridge: "In 4.1.1 you bought the right and split its premium into intrinsic and extrinsic value. Now the writer's side: collect the premium, carry the obligation. Long and short calls and puts are four building blocks, each with a breakeven and worst case.",
    hook: {
      prompt: "The 100-strike LABX call and put cost 2.86 a unit; a contract is 10 units. Which positions can lose more than 900 vUSD on one contract?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "The long call and the long put", feedback: "Buyers can lose only what they paid: 2.86 × 10 = 28.60 a contract." },
          { id: "b", label: "The short call and the short put" },
          { id: "c", label: "Only the short call", feedback: "The short put can too: if LABX goes to zero, (100 − 2.86) × 10 = 971.40." },
          { id: "d", label: "None: options cap the loss at the premium", feedback: "Only for the buyer. The writer took the obligation, and that can cost far more than the premium collected." },
        ],
        answer: "b",
      },
      compare:
        "You picked {yours}. Buyers can lose only the premium, 28.60 a contract. Writers can lose far more: the short call without limit, the short put up to (100 − 2.86) × 10 = 971.40.",
      concept: "option-payoff",
    },
    learn: [
      {
        kind: "figure",
        title: "Four building blocks",
        figure: {
          kind: "chart",
          chart: PANELS,
          steps: [
            {
              text: "Long call: −2.86 below 100, then rising without limit. Breakeven 102.86.",
              layers: [tag(3, 17, "Long call"), panelLine(0, (s) => call(100)(s) - 2.86, "accent"), dot(panelAt(0, 102.86), 0, "102.86")],
            },
            {
              text: "Short call: the mirror. Keeps 2.86 below 100, loses without limit above.",
              layers: [tag(22, 17, "Short call"), panelLine(1, (s) => 2.86 - call(100)(s), "down"), dot(panelAt(1, 102.86), 0, "102.86", "down")],
            },
            {
              text: "Long put: −2.86 above 100, rising as LABX falls. Breakeven 97.14.",
              layers: [tag(41, 17, "Long put"), panelLine(2, (s) => put(100)(s) - 2.86, "concept"), dot(panelAt(2, 97.14), 0, "97.14", "concept")],
            },
            {
              text: "Short put: keeps 2.86 above 100; at LABX zero it would lose 97.14.",
              layers: [tag(60, 17, "Short put"), panelLine(3, (s) => 2.86 - put(100)(s), "down"), dot(panelAt(3, 97.14), 0, "97.14", "down")],
            },
          ],
        },
        text: "A [[payoff-diagram|payoff diagram]] shows the result at expiry across LABX prices, premium included. The [[option-breakeven|breakeven]] is where the line crosses zero. Each short position is its long position upside down.",
        concept: "option-payoff",
      },
      {
        kind: "worked",
        title: "Breakeven, maximum loss, maximum gain",
        lines: [
          "Long call: P&L = max(S − 100, 0) − 2.86. Breakeven 100 + 2.86 = 102.86. Max loss 2.86; max gain unlimited.",
          "Long put: P&L = max(100 − S, 0) − 2.86. Max loss 2.86; max gain 97.14, if LABX goes to zero.",
          "Short call and short put: the mirror. Max gain 2.86; max loss unlimited, or 97.14.",
          "Long put breakeven = 100 − 2.86 = ?",
        ],
        ask: {
          answer: 97.14,
          tolerance: 0.005,
          feedback: [{ value: 102.86, text: "That's the call's breakeven, strike plus premium. A put gains as LABX falls: strike minus premium." }],
          correct: "Right. Below 97.14 the long put makes money, and there the short put starts losing.",
        },
        after: "In R terms, a long option's 1R is its premium: 28.60 a contract. A short option has no such cap unless you add one.",
        concept: "option-payoff",
      },
      {
        kind: "explain",
        title: "Exercise, assignment, style",
        text: "To [[exercise]] is to use the right. The writer then receives an [[assignment]] notice and must deliver. An [[american-option|American option]] can be exercised on any day up to expiry, like most US stock options; a [[european-option|European option]] only at expiry, like cash-settled SPX index options. LABX options are European.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Two writer risks. A short call on a stock that pays dividends can be assigned early, typically just before the ex-dividend date. And [[pin-risk|pin risk]]: when LABX closes right at your short strike, you may not know until after the close whether you were assigned.",
      },
      {
        kind: "match",
        title: "Pick the block",
        prompt: "Match each view to the building block that expresses it.",
        pairs: [
          { left: "Bullish, wants a small fixed cost", right: "Long call", wrong: "A small fixed cost and profit from a rise: buy the call." },
          { left: "Bearish, wants a small fixed cost", right: "Long put", wrong: "A small fixed cost and profit from a fall: buy the put." },
          { left: "Neutral to bullish, happy to buy LABX lower", right: "Short put", wrong: "Selling the put collects 2.86, and if LABX falls you buy it at 100, an effective 97.14." },
          { left: "Neutral to bearish, accepts unlimited risk above", right: "Short call", wrong: "Selling the call keeps 2.86 unless LABX rises, and above 100 the loss has no limit." },
        ],
        columns: ["View", "Building block"],
        correct: "Right. Every buyer's gain is a writer's loss: before costs, each option trade is zero-sum between the two sides.",
        concept: "option-payoff",
      },
      {
        kind: "predict",
        title: "Build it",
        prompt: "Which position profits if LABX ends below 97.14 and can never lose more than 28.60 vUSD a contract?",
        control: {
          kind: "choice",
          choices: [
            { id: "lp", label: "Long put 100" },
            { id: "sc", label: "Short call 100", feedback: "It profits below 102.86, but its loss above is unlimited." },
            { id: "sp", label: "Short put 100", feedback: "It loses below 97.14, up to 971.40 a contract." },
            { id: "lc", label: "Long call 100", feedback: "Its loss is capped at 28.60, but it profits only above 102.86." },
          ],
          answer: "lp",
        },
        figure: {
          kind: "chart",
          chart: payoffChart([-4, 18], "Payoff at expiry of one long 100-strike LABX put bought at 2.86: a loss of 2.86 above 100, breakeven at 97.14, a gain of 17.14 at LABX 80."),
          steps: [{ text: "Long put 100: profit below 97.14, loss capped at 2.86, 28.60 a contract.", layers: [curve((s) => put(100)(s) - 2.86, "concept"), dot(at(97.14), 0, "97.14", "concept")] }],
        },
        reveal: "The long put 100. Bearish means a put; a fixed maximum loss means you paid the premium rather than collected it. Below 97.14 it profits; at worst it loses 28.60 a contract.",
        concept: "option-payoff",
      },
    ],
    check: ["q-4.1.2-1", "q-4.1.2-2", "q-4.1.2-3"],
    recap: {
      takeaways: [
        "Long options risk only the premium; short options can lose without limit, or strike minus premium.",
        "Breakeven: long call = strike + premium, 102.86; long put = strike − premium, 97.14.",
        "Exercise uses the right; assignment enforces the obligation. American any day, European only at expiry.",
      ],
      next: "Next, 4.1.3: put-call parity, which ties these four blocks to LABX and cash, so any one can be built from the others.",
    },
  },
};

// ─── 4.1.3 · Put-call parity and synthetic positions ───────────────────────

const L_4_1_3: Lesson = {
  id: "4.1.3",
  title: "Put-call parity and synthetic positions",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Calls, puts, the underlying and cash are tied together by put-call parity, so any one can be built from the others, and small gaps rarely survive costs.",
  objectives: [
    "State put-call parity and use it to find a missing option price.",
    "Build a synthetic long position from options and recognise that a covered call has the same payoff as a short put.",
    "Show why a small parity gap disappears after realistic costs.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "4.1",
    courseId: "4.1.3",
    bridge: "In 4.1.2 you drew the four payoffs one at a time. Here they combine: a long call plus a short put copies owning LABX. Put-call parity prices that link, and the spread and commission from 1.1.4 decide whether a small gap is worth trading.",
    hook: {
      prompt: "The 100-strike LABX call and put both expire in 30 days. LABX is at 100.00 and rates are zero. The call costs 2.86. What should the put cost?",
      control: {
        kind: "numeric",
        answer: 2.86,
        tolerance: 0.01,
        feedback: [
          { value: 0, text: "The put isn't worthless: with LABX at the strike it has as much time value as the call." },
          { value: 5.72, text: "That's the call and the put together, a straddle. The put alone costs the same as the call here." },
        ],
      },
      compare: "You answered {yours}. With S = K and zero rates, parity says C − P = 100 − 100 = 0, so the put also costs 2.86.",
      concept: "put-call-parity",
    },
    learn: [
      {
        kind: "worked",
        title: "The parity equation",
        lines: [
          "[[put-call-parity|Put-call parity]], no dividends: C − P = S − K·e^(−rT).",
          "S = 100, K = 100, T = 0.25 years, r = 4%, IV 20%: the model gives call 4.49, put 3.49.",
          "K·e^(−rT) = 100 × e^(−0.01) = 99.00, the strike's value today. So S − 99.00 = 1.00.",
          "And C − P = 4.49 − 3.49 = ?",
        ],
        ask: {
          answer: 1,
          tolerance: 0.005,
          feedback: [
            { value: 7.98, text: "That adds the prices. Parity is about the difference: call minus put." },
            { value: 0, text: "That's the zero-rate answer. At 4% the strike is discounted to 99.00, so the call is worth 1.00 more." },
          ],
          correct: "Right. Both sides equal 1.00: the equation holds.",
        },
        after: "The [[risk-free-rate|risk-free rate]] matters because owning LABX ties up cash today, while the strike is paid later. At r = 0 the equation is simply C − P = S − K.",
        concept: "put-call-parity",
      },
      {
        kind: "figure",
        title: "A synthetic long",
        figure: {
          kind: "chart",
          chart: payoffChart(
            [-22, 22],
            "Payoffs at expiry across LABX 80 to 120: a long 100-call bought at 2.86, a short 100-put sold at 2.86, and their sum, which is LABX minus 100 at every price, from −20 at 80 to +20 at 120.",
          ),
          steps: [
            { text: "Long call 100 at 2.86: −2.86 below 100, rising above.", layers: [curve((s) => call(100)(s) - 2.86, "accent")] },
            { text: "Short put 100 at 2.86: +2.86 above 100, falling below.", layers: [curve((s) => 2.86 - put(100)(s), "concept")] },
            { text: "Add them: LABX − 100 at every price. Owning LABX from 100, made of options.", layers: [curve((s) => s - 100, "up"), dot(at(115), 15, "Synthetic long", "up")] },
          ],
        },
        text: "Same strike, same expiry: long call plus short put is a [[synthetic-position|synthetic]] long, a forward on LABX at 100. Here the premiums cancel because both cost 2.86.",
        concept: "synthetic-position",
      },
      {
        kind: "match",
        title: "Four equivalences",
        prompt: "Match each combination, same strike and expiry, to the position it copies at expiry.",
        pairs: [
          { left: "Long call + short put", right: "Synthetic long LABX", wrong: "Above the strike the call gains, below it the short put loses, one for one: like owning LABX." },
          { left: "Long LABX + long put", right: "Long call, plus cash", wrong: "The put floors the stock's loss while the upside stays open: a call's shape, with cash tied up in the stock." },
          { left: "Long LABX + short call", right: "Short put, plus cash", wrong: "The call caps the upside and the stock keeps the downside: a short put's shape." },
          { left: "Short call + long put", right: "Synthetic short LABX", wrong: "The mirror of the synthetic long: it gains as LABX falls and loses as it rises." },
        ],
        columns: ["Combination", "Same payoff as"],
        correct: "Right. Rearrange C − P = S − K and each one falls out: options, stock and cash are interchangeable parts.",
        concept: "synthetic-position",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A covered call, long LABX plus a short call, has the same payoff as a [[cash-secured-put|cash-secured put]] at the same strike: parity says so. Same expiry, same loss if LABX falls. Calling one conservative income and the other risky is a label, not a difference.",
      },
      {
        kind: "worked",
        title: "Lock in a gap",
        lines: [
          "Rates zero. Call 100 at 2.86, but put 100 at 2.50. Parity says 2.86: the put is 0.36 cheap.",
          "Buy LABX at 100.00, buy the put at 2.50, sell the call at 2.86. Cost: 100.00 + 2.50 − 2.86 = 99.64.",
          "At expiry you sell LABX at 100 either way: by exercising the put, or when the call is assigned.",
          "Locked-in gain per unit = 100.00 − 99.64 = ?",
        ],
        ask: {
          answer: 0.36,
          tolerance: 0.005,
          feedback: [{ value: 99.64, text: "That's the cost. The gain is what you collect at expiry, 100.00, minus that cost." }],
          correct: "Right. 0.36 whatever LABX does: an [[arbitrage]], before costs.",
        },
        concept: "put-call-parity",
      },
      {
        kind: "worked",
        title: "Now add the costs",
        lines: [
          "Half the 0.10 spread on each of three legs: 3 × 0.05 = 0.15.",
          "Commission 0.05% on LABX, at entry and at exit: 0.05 + 0.05 = 0.10. Options carry no commission here.",
          "Net gain per unit = 0.36 − 0.15 − 0.10 = ?",
        ],
        ask: {
          answer: 0.11,
          tolerance: 0.005,
          feedback: [
            { value: 0.21, text: "That counts the spreads but not the two commissions on LABX." },
            { value: 0.26, text: "That counts the commissions but not half the spread on each of the three legs." },
          ],
          correct: "Right. 0.11 a unit, 1.10 a contract.",
        },
        after:
          "With crisis spreads of 0.40 on options, the costs reach 0.20 + 0.20 + 0.05 + 0.10 = 0.55 and the trade loses 0.19. In liquid markets such gaps close in milliseconds: you are checking consistency, not racing arbitrage desks.",
        concept: "trading-costs",
      },
    ],
    check: ["q-4.1.3-1", "q-4.1.3-2", "q-4.1.3-3"],
    recap: {
      takeaways: [
        "Parity: C − P = S − K·e^(−rT); with zero rates and S = K, the call equals the put.",
        "Long call plus short put copies owning LABX; a covered call copies a cash-secured put.",
        "A 0.36 parity gap left 0.11 after costs, and a loss with wide spreads.",
      ],
      next: "Next, 4.1.4: what sets an option's price, and why volatility is the one input you have to guess.",
    },
  },
};

// ─── 4.1.4 · What sets an option's price ───────────────────────────────────

const L_4_1_4: Lesson = {
  id: "4.1.4",
  title: "What sets an option's price",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Black–Scholes turns price, strike, time, volatility and rates into an option price; volatility is the only input you have to guess, and the model's assumptions break in real markets.",
  objectives: [
    "Name the five Black–Scholes inputs and the direction each one pushes a call price.",
    "Estimate an at-the-money option price with the 0.4 × S × σ × √T rule.",
    "Explain which model assumptions fail in real markets.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "4.1",
    courseId: "4.1.4",
    bridge: "In 4.1.3 parity priced the put from the call, not the call itself. Black–Scholes does, from five inputs. Four are known; the fifth is volatility, measured in 2.4.6 and scaled by √time in 3.10.2. The fat tails of 3.10.1 show where the model breaks.",
    hook: {
      prompt: "The 30-day, 100-strike LABX call costs 2.86 with LABX at 100.00. Which pair of changes would make it more expensive?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "More time to expiry and higher volatility" },
          { id: "b", label: "Less time and higher volatility", feedback: "Higher volatility adds value, but less time takes it away: fewer days for LABX to move." },
          { id: "c", label: "More time and a higher strike", feedback: "More time adds value, but a higher strike makes the right to buy worth less: 1.08 at 105." },
          { id: "d", label: "A higher strike and lower volatility", feedback: "Both push a call down: a higher purchase price, and less movement to pay for." },
        ],
        answer: "a",
      },
      compare: "You picked {yours}. More time and more volatility both widen the range LABX can reach, so the call costs more: 4.00 at IV 35%, 5.71 with 120 days.",
      concept: "option-pricing-model",
    },
    learn: [
      {
        kind: "explain",
        title: "Five inputs, one guess",
        text: "The [[black-scholes|Black–Scholes]] model prices a European option from five inputs: LABX's price S, the strike K, the [[time-to-expiry|time to expiry]] T in years, the volatility σ and the rate r, plus dividends if any. Four are on your screen. σ, the volatility over the option's life, is the only estimate.",
      },
      {
        kind: "worked",
        title: "The formula, once",
        lines: [
          "d1 = [ln(S/K) + (r + σ²/2)·T] ÷ (σ·√T); d2 = d1 − σ·√T.",
          "C = S·N(d1) − K·e^(−rT)·N(d2), where N(x) is the normal probability of a value below x.",
          "S = K = 100, T = 30/365 = 0.0822, σ = 0.25, r = 0: σ·√T = 0.0717, d1 = 0.0358, d2 = −0.0358.",
          "N(d1) = 0.5143, N(d2) = 0.4857. C = 51.43 − 48.57 = ?",
        ],
        ask: {
          answer: 2.86,
          tolerance: 0.005,
          feedback: [{ value: 100, text: "That adds the two terms. The formula subtracts: S·N(d1) minus K·N(d2)." }],
          correct: "Right. 2.86, the call in the reference chain. Parity then gives the put: 2.86 at r = 0.",
        },
        concept: "option-pricing-model",
      },
      {
        kind: "worked",
        title: "The quick rule",
        lines: ["At the money: price ≈ 0.4 × S × σ × √T.", "√(30/365) = 0.2867.", "0.4 × 100 × 0.25 × 0.2867 = ?"],
        ask: {
          answer: 2.87,
          tolerance: 0.01,
          feedback: [{ value: 10, text: "That leaves out √T. Thirty days is 0.0822 of a year, and √0.0822 = 0.2867." }],
          correct: "Right. 2.87 against the model's 2.86: close enough to check a quote in your head.",
        },
        after: "0.4 is 1 ÷ √(2π), rounded. The rule works near the money; away from it, use the model.",
        concept: "option-pricing-model",
      },
      {
        kind: "predict",
        title: "Turn up volatility",
        prompt: "Same call, but implied volatility rises from 25% to 35%. What does the 2.86 call cost now?",
        control: {
          kind: "slider",
          min: 2,
          max: 7,
          step: 0.05,
          start: 2,
          answer: 4,
          tolerance: 0.15,
          feedback: [
            { from: 2, to: 3.6, text: "More than that. At the money the price grows almost in proportion to σ: 35 ÷ 25 = 1.4 times." },
            { from: 4.4, to: 7, text: "Less than that. The price grows about in line with σ, 1.4 times, not faster." },
          ],
        },
        reveal: "4.00. At the money the price is nearly proportional to σ: 2.86 × 35 ÷ 25 = 4.00.",
        concept: "option-pricing-model",
      },
      {
        kind: "predict",
        title: "Take away time",
        prompt: "Back to IV 25%, but now only 7 days to expiry instead of 30. What does the call cost?",
        control: {
          kind: "slider",
          min: 0,
          max: 3,
          step: 0.02,
          start: 3,
          answer: 1.38,
          tolerance: 0.1,
          feedback: [
            { from: 0, to: 1, text: "More than that. Price scales with √T, not T: a quarter of the time keeps about half the value." },
            { from: 1.6, to: 3, text: "Less than that. Fewer days leave less room to move: 2.86 × √(7/30)." },
          ],
        },
        reveal: "1.38. Price scales with √T: 2.86 × √(7/30) = 1.38. Less than a quarter of the time keeps nearly half the price.",
        concept: "option-pricing-model",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "The model assumes constant volatility, lognormal returns, continuous trading and no jumps. Real markets have skew, [[fat-tails|fat tails]] and overnight [[gap|gaps]]. Treat Black–Scholes as a common language for quoting prices, not as a description of how LABX moves.",
      },
      {
        kind: "fields",
        title: "Double it",
        prompt: "Double the 30-day 100-call from 2.86 to about 5.72 without moving LABX or the strike. Pick the implied volatility and the days to expiry.",
        fields: [
          { id: "iv", label: "Implied volatility", kind: "choice", options: [25, 35, 50], unit: "%", default: 25 },
          { id: "days", label: "Days to expiry", kind: "choice", options: [30, 60, 120], unit: " days", default: 30 },
        ],
        valid: {
          any: [
            { all: [{ field: "iv", eq: 50 }, { field: "days", eq: 30 }] },
            { all: [{ field: "iv", eq: 25 }, { field: "days", eq: 120 }] },
            { all: [{ field: "iv", eq: 35 }, { field: "days", eq: 60 }] },
          ],
        },
        feedback: [
          { when: { all: [{ field: "iv", eq: 25 }, { field: "days", eq: 30 }] }, text: "That's where you started: 2.86." },
          { when: { all: [{ field: "iv", eq: 35 }, { field: "days", eq: 30 }] }, text: "IV 35% gives 4.00: higher, but not double. Price grows in line with σ." },
          { when: { all: [{ field: "iv", eq: 25 }, { field: "days", eq: 60 }] }, text: "60 days gives 4.04: twice the time adds only √2, about 41%." },
          { when: { field: "iv", gte: 35 }, text: "Too far: that combination prices the call near 8.00 or more. Raise one input, or both a little." },
        ],
        correct: "Right. IV 50% at 30 days, or 120 days at IV 25%, both give 5.71; IV 35% for 60 days gives 5.66. Price grows with σ and with √T.",
        concept: "option-pricing-model",
      },
    ],
    check: ["q-4.1.4-1", "q-4.1.4-2", "q-4.1.4-3"],
    recap: {
      takeaways: [
        "A call gains with LABX, time and volatility, and loses with the strike; σ is the only guess.",
        "At the money, price ≈ 0.4 × S × σ × √T: 2.87 against the model's 2.86.",
        "The model assumes no jumps and constant volatility; real markets gap and skew.",
      ],
      next: "Next, 4.1.5: delta and gamma, how much the option moves when LABX does, and how fast that changes.",
    },
  },
};

// ─── 4.1.5 · Delta and gamma: how the price moves with LABX ────────────────

const L_4_1_5: Lesson = {
  id: "4.1.5",
  title: "Delta and gamma: how the price moves with LABX",
  topic: "portfolio_exposure",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Delta says how much an option moves with LABX and how many units hedge it; gamma says how fast delta changes, and it explodes at the money near expiry.",
  objectives: [
    "Estimate an option's price change from delta and gamma for a small move in LABX.",
    "Size a share hedge that makes an options position delta-neutral.",
    "Explain why gamma explodes for at-the-money options close to expiry.",
  ],
  blocks: [],
  practice: [
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
    { kind: "check", ref: "portfolio_exposure", label: "Portfolio exposure check" },
  ],
  script: {
    unit: "4.1",
    courseId: "4.1.5",
    bridge: "In 4.1.4 you priced the call at one LABX price. Now LABX moves. Delta says how much the call follows it: exposure, as in 1.4.7, counted in LABX units; gamma says how fast that exposure changes as the price moves.",
    hook: {
      prompt: "LABX rises 1.00, from 100.00 to 101.00. Roughly how much does the 30-day 100-strike call, now at 2.86, gain?",
      control: {
        kind: "slider",
        min: 0,
        max: 1,
        step: 0.01,
        start: 0,
        answer: 0.54,
        tolerance: 0.05,
        feedback: [
          { from: 0, to: 0.4, text: "More than that. Near the money the call moves about half as much as LABX." },
          { from: 0.7, to: 1, text: "That's close to owning LABX itself. An at-the-money call moves about half as much." },
        ],
      },
      compare: "You answered {yours}. The call goes from 2.86 to 3.40: +0.54, about half of LABX's 1.00.",
      concept: "option-delta",
    },
    learn: [
      {
        kind: "explain",
        title: "Delta",
        text: "[[delta|Delta]] is how much an option's price moves when LABX moves 1.00. Calls run from 0 to 1, puts from −1 to 0, and at the money they sit near ±0.5. Delta is also the [[hedge-ratio|hedge ratio]] and, roughly, the chance of ending in the money. It's the first of the [[greeks|Greeks]].",
      },
      {
        kind: "figure",
        title: "Delta across strikes",
        figure: {
          kind: "bars",
          bars: [
            { label: "Call 90", value: 0.93, role: "accent" },
            { label: "Call 95", value: 0.77, role: "accent" },
            { label: "Call 100", value: 0.51, role: "concept" },
            { label: "Call 105", value: 0.26, role: "neutral" },
            { label: "Call 110", value: 0.1, role: "neutral" },
          ],
          steps: [
            "In the money, calls 90 and 95 move almost like LABX: 0.93 and 0.77.",
            "At the money, the call 100: 0.51, about half of LABX's move.",
            "Out of the money, calls 105 and 110 barely move: 0.26 and 0.10.",
          ],
        },
        text: "LABX at 100.00, 30 days, IV 25%. A put's delta is its call's delta minus 1: the put 100 has −0.49.",
        concept: "option-delta",
      },
      {
        kind: "worked",
        title: "Gamma bends delta",
        lines: [
          "[[gamma|Gamma]] is how much delta changes when LABX moves 1.00. Call 100: delta 0.514, gamma 0.056.",
          "Price change ≈ delta × move + ½ × gamma × move².",
          "For a 1.00 rise: 0.514 × 1 + 0.5 × 0.056 × 1 = ?",
        ],
        ask: {
          answer: 0.54,
          tolerance: 0.005,
          feedback: [{ value: 0.51, text: "That's delta alone. Add the gamma term: ½ × 0.056 × 1² = 0.028." }],
          correct: "Right. +0.54. Repricing the call at 101.00 gives 3.40: also +0.54.",
        },
        after: "Gamma is why a long option gains more on the way up than delta alone says, and loses less on the way down.",
        concept: "option-gamma",
      },
      {
        kind: "worked",
        title: "Hedge the delta",
        lines: [
          "You hold 10 contracts of the call 100: 10 × 10 = 100 units of options.",
          "Position delta = 100 × 0.514 = 51.4: the position moves like about 51 LABX.",
          "LABX to sell short for a [[delta-neutral|delta-neutral]] position = ?",
        ],
        ask: {
          answer: 51,
          tolerance: 0.5,
          unit: "units",
          feedback: [
            { value: 100, text: "That treats each option unit like a whole LABX. Multiply by delta, 0.514, first." },
            { value: 5, text: "That forgets the multiplier: each contract covers 10 units." },
          ],
          correct: "Right. Short 51 LABX. Small moves now barely change the position's value.",
        },
        after: "This is [[delta-hedging|delta hedging]]. Desks hedge this way so their result comes from volatility, not from direction.",
        concept: "delta-hedging",
      },
      {
        kind: "figure",
        title: "Gamma near expiry",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(41),
            hideCandles: true,
            range: [0, 0.34],
            height: 240,
            layers: [tag(0, 0, "LABX 90"), tag(20, 0, "100"), tag(30, 0, "105")],
            describe:
              "Gamma of the 100-strike LABX option across LABX 90 to 110, IV 25%. With 30 days left it is a low, wide hump peaking at 0.056. With 1 day left it is a narrow spike peaking at 0.30 at 100, near zero beyond about 97 and 103.",
          },
          steps: [
            { text: "Gamma across LABX, 30 days left: a low hump, 0.056 at the money.", layers: [{ kind: "line", values: GAMMA_30, role: "concept" }, dot(20, 0.056, "0.056", "concept")] },
            { text: "One day left: a spike of 0.30 at the money, 5.5 times higher.", layers: [{ kind: "line", values: GAMMA_1, role: "down" }, dot(20, 0.305, "0.30", "down")] },
          ],
        },
        text: "Near expiry a small move decides whether an at-the-money option ends worth something or nothing, so its delta swings between 0 and 1. That's why [[0dte-option|0DTE options]] move violently: lottery tickets for buyers, tail risk for sellers.",
        concept: "option-gamma",
      },
      {
        kind: "predict",
        title: "Neutral doesn't stay neutral",
        prompt: "You're long 10 calls 100 and short 51 LABX: delta neutral. LABX jumps 3.00 to 103.00. What is your position delta now?",
        control: {
          kind: "choice",
          choices: [
            { id: "pos", label: "Positive: you're now net long" },
            { id: "zero", label: "Still about zero", feedback: "Delta was neutral only at 100.00. As LABX rose, the calls' delta rose to 0.67; your short stayed at 51." },
            { id: "neg", label: "Negative: the short now dominates", feedback: "The short is fixed at 51 units. The calls' delta grew to 0.67, so the options side got bigger, not smaller." },
          ],
          answer: "pos",
        },
        reveal: "The calls' delta is now 0.67: 100 × 0.67 = 67 against your short 51, net +16. Gamma made you longer as LABX rose, and would make you shorter as it fell. Staying neutral means re-hedging.",
        concept: "delta-hedging",
      },
    ],
    check: ["q-4.1.5-1", "q-4.1.5-2", "q-4.1.5-3"],
    recap: {
      takeaways: [
        "Price change ≈ delta × move + ½ × gamma × move²: +0.54 for a 1.00 rise.",
        "Hedge = contracts × 10 × delta: 10 calls at 0.514 need 51 LABX short.",
        "Gamma peaks at the money near expiry: 0.30 with one day left, 0.056 with 30.",
      ],
      next: "Next, 4.1.6: theta and vega, what time and implied volatility do to the same call while you wait.",
    },
  },
};

// ─── 4.1.6 · Theta, vega and the gamma–theta trade-off ─────────────────────

const L_4_1_6: Lesson = {
  id: "4.1.6",
  title: "Theta, vega and the gamma–theta trade-off",
  topic: "scenario_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Theta charges an option holder for each day, vega reprices it when implied volatility moves, and a hedged long option wins only if LABX moves more than the market implied.",
  objectives: [
    "Explain why time decay speeds up near expiry and which options carry the most vega.",
    "Decompose a one-day option P&L into delta, gamma, theta and vega.",
    "Find the daily move at which a delta-hedged long option breaks even, and link it to implied volatility.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "low_volatility", label: "Arena: low volatility" },
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
  ],
  script: {
    unit: "4.1",
    courseId: "4.1.6",
    bridge: "In 4.1.5 you hedged the delta of 10 calls with 51 LABX short. The hedge still pays rent: theta charges every day, and vega reprices the call when implied volatility moves. Realised volatility, measured in 2.4.6, decides whether gamma earns that rent back.",
    hook: {
      prompt: "You own the 30-day 100-call at 2.86. Tomorrow LABX rises 2.00, but implied volatility drops 3 points. What happens to the call?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "It gains about 1.03", feedback: "That's delta alone, 0.514 × 2. The fall in implied volatility takes back about 0.34." },
          { id: "b", label: "It gains about 0.75" },
          { id: "c", label: "About flat", feedback: "The vega loss is real, 0.34, but the 2.00 rise adds more: about 1.14 from delta and gamma." },
          { id: "d", label: "It loses", feedback: "A 2.00 rise adds about 1.14 through delta and gamma; volatility and a day of decay take back only 0.39." },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. Delta adds 1.03, gamma 0.11, a day of theta takes 0.05 and vega takes 0.34: about +0.75. Full repricing: +0.77.",
      concept: "option-vega",
    },
    learn: [
      {
        kind: "figure",
        title: "Decay speeds up",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(31),
            hideCandles: true,
            range: [0, 3.2],
            height: 240,
            layers: [tag(0, 0, "30 days left"), tag(23, 0, "7 days")],
            describe:
              "Value of the at-the-money LABX call, IV 25%, as expiry approaches: 2.86 with 30 days left, 1.38 with 7 days, 0.52 with 1 day and zero at expiry. The curve sags slowly at first and drops steeply in the last week.",
          },
          steps: [
            { text: "30 days left: 2.86, losing 0.048 a day. The curve sags slowly at first.", layers: [{ kind: "line", values: segment(DECAY, 0, 23), role: "accent" }, dot(0, 2.86, "2.86")] },
            { text: "7 days left: 1.38, now losing 0.099 a day.", layers: [{ kind: "line", values: segment(DECAY, 23, 29), role: "accent" }, dot(23, 1.38, "1.38")] },
            { text: "1 day left: 0.52, losing 0.261 a day. Then zero at expiry.", layers: [{ kind: "line", values: segment(DECAY, 29, 30), role: "down" }, dot(29, 0.52, "0.52", "down")] },
          ],
        },
        text: "[[theta|Theta]] is the value an option loses per day as time passes, all else equal. [[time-decay|Time decay]] follows the square root of time, so it speeds up near expiry: with one day left the call loses more than five times as much per day as with 30.",
        concept: "option-theta",
      },
      {
        kind: "explain",
        title: "Vega and rho",
        text: "[[vega|Vega]] is the price change for a 1-point move in implied volatility: 0.114 for the 30-day at-the-money call, 0.397 for a one-year one at IV 20%. Long-dated, at-the-money options carry the most vega. [[rho|Rho]] is the change for a 1% move in rates; it matters mostly for long-dated options.",
      },
      {
        kind: "worked",
        title: "One day, four Greeks",
        lines: [
          "dV ≈ Δ·dS + ½·Γ·dS² + Θ·dt + ν·dσ.",
          "Delta: 0.514 × 2 = 1.03. Gamma: 0.5 × 0.056 × 4 = 0.11. Theta, one day: −0.05.",
          "Vega: 0.114 × (−3) = ?",
        ],
        ask: {
          answer: -0.34,
          tolerance: 0.005,
          feedback: [{ value: 0.34, text: "Implied volatility fell, so vega's term is negative." }],
          correct: "Right. Total ≈ 1.03 + 0.11 − 0.05 − 0.34 = 0.75. Full repricing gives 0.77; the rest is higher-order terms.",
        },
        after: "Read your P&L this way every day: how much came from direction, from movement, from time and from volatility.",
        concept: "option-vega",
      },
      {
        kind: "worked",
        title: "The gamma–theta trade-off",
        lines: [
          "Hedge the delta every day. Each day you earn ½ × Γ × dS² from the move and pay |Θ| in decay.",
          "Break-even: ½ × 0.056 × dS² = 0.048, so dS = √(2 × 0.048 ÷ 0.056).",
          "Break-even daily move = ?",
        ],
        ask: {
          answer: 1.31,
          tolerance: 0.02,
          feedback: [{ value: 1.71, text: "That's 2 × 0.048 ÷ 0.056 before the square root. Take the root." }],
          correct: "Right. 1.31 a day. Smaller moves lose to theta; bigger ones earn more gamma than they pay.",
        },
        after:
          "The implied daily move is S × σ ÷ √365 = 100 × 0.25 ÷ 19.1 = 1.31: the same number. Re-hedging again and again is [[gamma-scalping|gamma scalping]], and it pays only if [[realised-volatility|realised volatility]] beats implied volatility.",
        concept: "gamma-theta-tradeoff",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Long options pay theta to own gamma; short options collect theta and are short gamma. Neither side is free: the seller wins on quiet days and pays on violent ones. Over time, realised against implied volatility decides who comes out ahead.",
      },
      {
        kind: "predict",
        title: "A quiet month",
        prompt: "You hold the delta-hedged long 100-call at IV 25%. For weeks LABX moves about 0.79 a day, a realised volatility of 15%. What happens to the position?",
        control: {
          kind: "choice",
          choices: [
            { id: "lose", label: "It loses a little each day" },
            { id: "gain", label: "It gains: the hedge locks in profit", feedback: "Gamma earns ½ × 0.056 × 0.79² = 0.017 a day; theta costs 0.048. Moves under 1.31 lose." },
            { id: "flat", label: "Nothing: the hedge removes all risk", feedback: "The hedge removes direction, not volatility. What's left is gamma against theta." },
          ],
          answer: "lose",
        },
        reveal: "About −0.03 a day: gamma earns 0.017, theta takes 0.048. At 35% realised, 1.83 a day, gamma earns 0.094 and the position gains. Realised against implied decides.",
        concept: "gamma-theta-tradeoff",
      },
    ],
    check: ["q-4.1.6-1", "q-4.1.6-2", "q-4.1.6-3"],
    recap: {
      takeaways: [
        "Theta speeds up near expiry; long-dated, at-the-money options carry the most vega.",
        "A day's P&L ≈ delta + gamma + theta + vega terms: 1.03 + 0.11 − 0.05 − 0.34.",
        "A hedged long option breaks even at the implied daily move, 1.31: realised must beat implied.",
      ],
      next: "Next, 4.1.7: implied volatility itself, how it varies by strike and expiry, and the move a straddle prices.",
    },
  },
};

// ─── 4.1.7 · Implied volatility, skew and the term structure ───────────────

const L_4_1_7: Lesson = {
  id: "4.1.7",
  title: "Implied volatility, skew and the term structure",
  topic: "scenario_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Implied volatility is the σ hidden in an option's price; it varies by strike and by expiry, and a straddle's price tells you the move the market is charging for.",
  objectives: ["Back out implied volatility from an option price.", "Read skew and term structure on a volatility surface.", "Convert a straddle price into the move the market is pricing in."],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
    { kind: "check", ref: "scenario_analysis", label: "Scenario analysis check" },
  ],
  script: {
    unit: "4.1",
    courseId: "4.1.7",
    bridge: "In 4.1.6 implied volatility moved the call through vega. Here you back it out of the price and map it across strikes and expiries. In 3.8.7 a straddle gave an implied move and 3.9.3 read the VIX; both are built on it.",
    hook: {
      prompt: "LABX reports tomorrow. With LABX at 100.00, the 7-day at-the-money straddle costs 6.62. What move is the market pricing in, in %?",
      control: {
        kind: "slider",
        min: 0,
        max: 15,
        step: 0.1,
        start: 0,
        answer: 6.6,
        tolerance: 0.3,
        feedback: [
          { from: 0, to: 4, text: "More than that. The straddle's price is the move it needs to break even: 6.62 on 100.00." },
          { from: 9, to: 15, text: "Less than that. Divide the straddle's price by LABX's price: 6.62 ÷ 100.00." },
        ],
      },
      compare: "You answered {yours}%. Straddle ÷ price: 6.62 ÷ 100.00 = 6.6%. The market prices a move of about ±6.6 by expiry, either way.",
      concept: "implied-move",
    },
    learn: [
      {
        kind: "explain",
        title: "The market's σ",
        text: "[[implied-volatility|Implied volatility]] is the σ that makes the model match the market price. It's the market's forecast plus a risk premium: on average, index implied volatility has run above the volatility that followed (Carr and Wu, 2009). Lesson 4.1.11 takes up that premium.",
      },
      {
        kind: "worked",
        title: "Back it out",
        lines: [
          "The 30-day 100-call trades at 4.00. At IV 25% the model says 2.86, with vega 0.114 a point.",
          "You need 4.00 − 2.86 = 1.14 more: 1.14 ÷ 0.114 = 10 points.",
          "Implied volatility = 25 + 10 = ?",
        ],
        ask: {
          answer: 35,
          tolerance: 1,
          unit: "%",
          feedback: [{ value: 10, text: "That's the points to add. Add them to the 25% you started from." }],
          correct: "Right. 35%: the model at 35% gives 4.00. Solvers repeat this step until model and market agree.",
        },
        concept: "implied-volatility",
      },
      {
        kind: "figure",
        title: "Skew across strikes",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(31),
            hideCandles: true,
            range: [18, 36],
            height: 240,
            layers: [tag(0, 18, "Strike 85"), tag(15, 18, "100"), tag(25, 18, "110")],
            describe:
              "Implied volatility of a fictional 30-day LABX expiry by strike, 85 to 115. Skew: 34% at 85, 31% at 90, 25% at 100, 22% at 110, 21.5% at 115. Smile: 31% at 85 and 115, 28% at 90 and 110, 25% at 100.",
          },
          steps: [
            {
              text: "A skew: downside strikes carry higher IV. 31% at 90, 25% at 100, 22% at 110.",
              layers: [
                { kind: "path", points: SKEW_PTS.map(([s, v]) => ({ index: s - 85, price: v })), role: "accent" },
                dot(5, 31, "31%"),
                dot(25, 22, "22%"),
              ],
            },
            {
              text: "A smile, for comparison: both wings above the middle.",
              layers: [{ kind: "path", points: SMILE_PTS.map(([s, v]) => ({ index: s - 85, price: v })), role: "concept", dashed: true }],
            },
          ],
        },
        text: "Real surfaces aren't flat, unlike our 25% reference chain. On index and stock options, a [[volatility-skew|skew]] is typical: buyers pay up for crash protection. A [[volatility-smile|smile]] lifts both wings, as in many currency options.",
        concept: "volatility-surface",
      },
      {
        kind: "figure",
        title: "Skew across time",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(11),
            hideCandles: true,
            range: [15, 60],
            height: 240,
            layers: TENOR_TAGS(15),
            describe:
              "At-the-money implied volatility of LABX by expiry, 7 to 180 days. Calm market: 22% rising to 28.5%. Crisis: 55% at 7 days, falling to 30% at 180 days.",
          },
          steps: [
            { text: "Calm: implied volatility rises with expiry, from 22% to 28.5%.", layers: [termPath(TERM_CALM, "accent")] },
            { text: "Crisis: the curve inverts. 55% for 7 days, 30% for 180.", layers: [termPath(TERM_CRISIS, "down", true)] },
          ],
        },
        text: "The [[iv-term-structure|term structure]] is implied volatility by expiry. Calm markets usually slope upward; in a crisis it inverts, because near-term fear is priced above the long run. Strikes and expiries together make the [[volatility-surface|volatility surface]].",
        concept: "volatility-surface",
      },
      {
        kind: "hotspot",
        title: "Find the event",
        prompt: "A LABX event is scheduled between the 7-day and the 14-day expiry. Tap the expiry whose implied volatility it lifts the most.",
        chart: {
          candles: slots(11),
          hideCandles: true,
          range: [15, 42],
          height: 240,
          layers: [...TENOR_TAGS(15), termPath(TERM_EVENT, "accent")],
          describe: "At-the-money implied volatility by expiry: 7 days 22%, 14 days 37.7%, 30 days 30.4%, 60 days 26.5%, 90 days 25.1%, 180 days 23.6%.",
        },
        zones: [
          { id: "d7", label: "7 days, 22%", index: 0, price: 22, feedback: "This expiry ends before the event: no event inside, a plain 22%." },
          { id: "d14", label: "14 days, 37.7%", index: 2, price: 37.7 },
          { id: "d30", label: "30 days, 30.4%", index: 4, price: 30.4, feedback: "It holds the event too, but spread over 30 days: 30.4%." },
          { id: "d60", label: "60 days, 26.5%", index: 6, price: 26.5, feedback: "The event is diluted over 60 days here: 26.5%." },
          { id: "d90", label: "90 days, 25.1%", index: 8, price: 25.1, feedback: "Over 90 days one event adds little: 25.1%." },
          { id: "d180", label: "180 days, 23.6%", index: 10, price: 23.6, feedback: "Over 180 days one event barely shows: 23.6%." },
        ],
        answer: "d14",
        correct: "Right. The 14-day expiry is the first after the event: 37.7%. Later expiries hold the same event, diluted over more days. That bump, the extra implied volatility a scheduled event adds, is [[event-volatility|event volatility]].",
        concept: "volatility-surface",
      },
      {
        kind: "worked",
        title: "The implied move",
        lines: [
          "Implied move ≈ at-the-money straddle ÷ S ≈ 0.8 × σ × √T.",
          "Event, 7 days, IV 60%: 3.31 + 3.31 = 6.62, so 6.6%. Check: 0.8 × 0.60 × √(7/365) = 6.65%.",
          "No event: the 30-day straddle at IV 25% costs 2.86 + 2.86 = 5.72. Implied move over 30 days, in % = ?",
        ],
        ask: {
          answer: 5.72,
          tolerance: 0.05,
          unit: "%",
          feedback: [{ value: 2.86, text: "That's one leg. A straddle is the call and the put together: 5.72." }],
          correct: "Right. About ±5.7% over 30 days, against ±6.6% in a single week with the event.",
        },
        after: "That's the [[implied-move|implied move]] from 3.8: the straddle's price is the move the market charges for.",
        concept: "implied-move",
      },
      {
        kind: "callout",
        tone: "info",
        text: "The [[vix|VIX]] is the 30-day implied volatility of the S&P 500, computed from SPX options. [[iv-rank|IV rank]] places today's implied volatility within its past-year range. Practitioners use both as context; neither is a tested trading signal on its own (evidence grade C).",
      },
    ],
    check: ["q-4.1.7-1", "q-4.1.7-2", "q-4.1.7-3"],
    recap: {
      takeaways: [
        "Implied volatility is the σ that matches the market price: 4.00 implies 35%.",
        "Skew: downside puts carry higher IV. Term structure rises when calm and inverts in crises.",
        "Implied move ≈ straddle ÷ price: 6.62 on 100.00 prices about ±6.6%.",
      ],
      next: "Next, 4.1.8: the first structures, LABX plus options: covered calls, protective puts and collars.",
    },
  },
};

// ─── 4.1.8 · Stock plus options: covered calls, protective puts and collars ─

const L_4_1_8: Lesson = {
  id: "4.1.8",
  title: "Stock plus options: covered calls, protective puts and collars",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Adding options to a stock position reshapes its outcomes: a covered call sells the upside, a protective put buys a floor that holds through gaps, and a collar does both.",
  objectives: [
    "Compute the maximum gain, maximum loss and breakeven of a covered call, a protective put and a collar.",
    "Compare a protective put with a stop-loss through an overnight gap.",
    "Match each structure to the regime where it helps and the regime where it hurts.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
  ],
  script: {
    unit: "4.1",
    courseId: "4.1.8",
    bridge: "In 4.1.7 you read prices; now you use them. In 1.3.7 a gap carried a stop past its level; a put fixes the exit price in advance. LABX plus 4.1.2's blocks, linked by 4.1.3's parity, gives three structures, each with a home regime from 2.8.1.",
    hook: {
      prompt: "You hold LABX bought at 100.00. Overnight it gaps to 88.00. Your stop was at 95.00; a 95-strike put would have cost 0.97. Which protected you better?",
      control: {
        kind: "choice",
        choices: [
          { id: "stop", label: "The stop: it capped the loss at 5.00", feedback: "A triggered stop becomes a market order. After the gap it fills near 88.00: a loss of about 12.00." },
          { id: "put", label: "The put" },
          { id: "same", label: "Both lose the same", feedback: "The put pays 95 − 88 = 7.00 however far LABX gaps. The stop gets no such help." },
        ],
        answer: "put",
      },
      compare: "You picked {yours}. The stop fills at the open, near 88.00: about −12.00 a unit. With the put: −12.00 + 7.00 − 0.97 = −5.97.",
      concept: "protective-put",
    },
    learn: [
      {
        kind: "worked",
        title: "Three structures",
        lines: [
          "LABX bought at 100.00; options 30 days, IV 25%; all per unit.",
          "[[covered-call|Covered call]], short call 105 at 1.08: max gain (105 − 100) + 1.08 = 6.08; max loss 100 − 1.08 = 98.92; breakeven 98.92.",
          "[[protective-put|Protective put]], long put 95 at 0.97: max gain unlimited; max loss (100 − 95) + 0.97 = 5.97; breakeven 100.97.",
          "[[collar|Collar]]: long put 95, short call 105, a net credit of 1.08 − 0.97 = 0.11. Max loss = 5.00 − 0.11 = ?",
        ],
        ask: {
          answer: 4.89,
          tolerance: 0.005,
          feedback: [
            { value: 5.11, text: "That's the max gain, 5.00 + 0.11. The floor is 5.00 below, softened by the credit." },
            { value: 5.97, text: "That's the plain protective put. In the collar the call's 1.08 pays for the put." },
          ],
          correct: "Right. Max loss 4.89, max gain 5.11, breakeven 99.89: a narrow band of outcomes for almost no cost.",
        },
        concept: "option-collar",
      },
      {
        kind: "figure",
        title: "Three shapes",
        figure: {
          kind: "chart",
          chart: payoffChart(
            [-21, 21],
            "P&L at expiry per unit across LABX 80 to 120 for LABX bought at 100: the stock alone (−20 to +20), a covered call with the 105 call (capped at +6.08, −18.92 at 80), a protective put with the 95 put (floored at −5.97, +19.03 at 120) and a collar (between −4.89 and +5.11).",
          ),
          steps: [
            {
              text: "Stock alone, dashed, and the covered call: capped at +6.08 above 105.",
              layers: [curve((s) => s - 100, "neutral", true), curve((s) => s - 100 + 1.08 - call(105)(s), "accent"), dot(at(115), 6.08, "+6.08")],
            },
            { text: "Protective put: floored at −5.97 below 95, open above.", layers: [curve((s) => s - 100 - 0.97 + put(95)(s), "up"), dot(at(85), -5.97, "−5.97", "up")] },
            { text: "Collar: every outcome between −4.89 and +5.11.", layers: [curve((s) => s - 100 + 0.11 + put(95)(s) - call(105)(s), "concept")] },
          ],
        },
        text: "Each structure trades away part of the distribution. The covered call sells the upside for 1.08; the protective put buys a floor for 0.97; the collar does both, almost for free.",
        concept: "covered-call",
      },
      {
        kind: "reveal",
        title: "Hold it through a fall",
        prompt: "You bought LABX at 100.00 and hold it to the 30-day expiry. If LABX falls 20% by then, which structure loses least?",
        chart: {
          candles: CRASH,
          visible: 11,
          layers: [
            { kind: "level", price: 105, role: "resistance", label: "Call 105" },
            { kind: "level", price: 100, role: "entry", label: "Entry 100.00" },
            { kind: "level", price: 95, role: "support", label: "Put 95" },
          ],
          describe: "LABX daily candles: ten sessions near 100, the entry at 100.00, then twenty sessions to expiry, hidden until revealed. LABX falls steadily and closes at 80.00 on expiry.",
        },
        choices: [
          { id: "cc", label: "The covered call", feedback: "Its 1.08 premium barely helps: at 80.00 it loses 18.92." },
          { id: "pp", label: "The protective put" },
          { id: "stock", label: "Stock alone", feedback: "Stock alone has no floor: −20.00 at 80.00." },
        ],
        answer: "pp",
        after: "LABX expired at 80.00. Stock alone −20.00; covered call −18.92; protective put −5.97; collar −4.89. Only the put and the collar had a floor.",
        concept: "protective-put",
      },
      {
        kind: "match",
        title: "Which structure, which regime",
        prompt: "Match each situation to the structure that fits it best.",
        pairs: [
          { left: "A month in a range near 100", right: "Covered call", wrong: "In a range the covered call keeps its 1.08 premium, while a put's 0.97 is simply spent." },
          { left: "Holding through overnight gaps and a scheduled event", right: "Protective put", wrong: "Gaps jump past stops. A put pays its strike however far LABX opens." },
          { left: "A strong rally, +12%", right: "Stock alone", wrong: "Stock gains 12.00. The covered call stops at 6.08, the collar at 5.11, the put gives up 0.97." },
          { left: "You must hold, accept a cap, and want a cheap floor", right: "Collar", wrong: "Selling the call 105 pays for the put 95: a floor for a 0.11 credit, at the price of a cap." },
        ],
        columns: ["Situation", "Best fit"],
        correct: "Right. No structure wins everywhere. Covered calls lag rallies and keep almost all of a crash; puts cost money in calm markets.",
        concept: "covered-call",
      },
      {
        kind: "explain",
        title: "Size from the floor",
        text: "A protective put defines the loss: 5.97 a unit. One put covers 10 units, so 10 LABX plus one put risks 59.70; 20 units would risk 119.40, over a 100.00 budget. A stop at 95.00 claims 5.00 a unit but can't promise it: through a gap it fills wherever LABX opens.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "A covered call isn't free income: it sells the top of the distribution. Long-run studies of covered-call indexes such as Cboe's BXM, on the S&P 500, report returns near the index with lower volatility, but the evidence is mixed (grade B/C) and depends on the period.",
      },
      {
        kind: "fields",
        title: "Build a collar",
        prompt: "You hold LABX at 100.00. Build a collar that costs nothing or pays a credit and caps your loss at 5.00 or less a unit. Puts: 90 at 0.21, 95 at 0.97, 100 at 2.86. Calls: 105 at 1.08, 110 at 0.32.",
        fields: [
          { id: "put", label: "Buy the put, strike", kind: "choice", options: [90, 95, 100], default: 90 },
          { id: "call", label: "Sell the call, strike", kind: "choice", options: [105, 110], default: 110 },
        ],
        valid: { all: [{ field: "put", eq: 95 }, { field: "call", eq: 105 }] },
        feedback: [
          { when: { field: "put", eq: 90 }, text: "The put 90 leaves 10.00 of open downside. Even with the call's credit, the loss passes 5.00." },
          { when: { field: "put", eq: 100 }, text: "The put 100 costs 2.86, more than either call brings in: you'd pay a debit." },
          { when: { field: "call", eq: 110 }, text: "The put 95 costs 0.97 and the call 110 brings only 0.32: a 0.65 debit." },
        ],
        correct: "Right. Put 95 and call 105: a 0.11 credit, max loss 4.89, max gain 5.11.",
        concept: "option-collar",
      },
    ],
    check: ["q-4.1.8-1", "q-4.1.8-2", "q-4.1.8-3"],
    recap: {
      takeaways: [
        "Covered call: gain capped at 6.08, loss up to 98.92. Protective put: loss 5.97. Collar: −4.89 to +5.11.",
        "Through a gap to 88.00 the put held the loss at 5.97; the stop lost about 12.00.",
        "Covered calls suit ranges, puts suit gaps and events, and stock alone wins a strong rally.",
      ],
      next: "Next, 4.1.9: vertical spreads, two options of one type that cap both the loss and the gain.",
    },
  },
};

// ─── 4.1.9 · Vertical spreads: defined risk, defined reward ────────────────

const L_4_1_9: Lesson = {
  id: "4.1.9",
  title: "Vertical spreads: defined risk, defined reward",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "A vertical spread buys one option and sells another of the same type and expiry, so both the maximum loss and the maximum gain are known before you trade.",
  objectives: [
    "Compute the debit or credit, maximum gain, maximum loss and breakeven of the four vertical spreads.",
    "Explain why a credit spread's high win rate says nothing about its edge.",
    "Size a spread so its maximum loss fits a 1% risk budget.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M05", label: "Size Matters" },
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
  ],
  script: {
    unit: "4.1",
    courseId: "4.1.9",
    bridge: "In 4.1.8 an option sat on top of LABX. A vertical spread pairs two calls or two puts, capping both loss and gain. In 1.4.5 expectancy needed the size of wins and losses, not just the rate; here a high win rate faces that test.",
    hook: {
      prompt: "A credit spread wins about 4 times out of 5 at expiry. Is it a good trade?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Yes: it wins 80% of the time", feedback: "A win rate says nothing without the payoffs. Small wins four times can be wiped out by one large loss." },
          { id: "b", label: "Only if it costs nothing", feedback: "A credit spread pays you up front; the question is what the losing fifth costs." },
          { id: "c", label: "Can't tell without the size of the loss" },
          { id: "d", label: "Only in a trend", feedback: "Regime matters, but first you need the payoffs: how much it wins and how much it loses." },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. The bull put spread in this lesson wins 0.76 about 79% of the time and loses up to 4.24. In the model, that averages about zero.",
      concept: "vertical-spread",
    },
    learn: [
      {
        kind: "worked",
        title: "Four verticals",
        lines: [
          "Same expiry, strikes 5 apart. Debit spread: max gain = width − debit. Credit spread: max loss = width − credit.",
          "Bull call: +call 100 (2.86), −call 105 (1.08). Debit 1.78; max gain 3.22; max loss 1.78; breakeven 101.78.",
          "Bear put: +put 100 (2.86), −put 95 (0.97). Debit 1.89; max gain 3.11; max loss 1.89; breakeven 98.11.",
          "Bull put: −put 95 (0.97), +put 90 (0.21). Credit 0.76; max gain 0.76; max loss 4.24; breakeven 94.24.",
          "Bear call: −call 105 (1.08), +call 110 (0.32). Credit 0.76; max loss 4.24. Breakeven = 105 + 0.76 = ?",
        ],
        ask: {
          answer: 105.76,
          tolerance: 0.005,
          feedback: [{ value: 104.24, text: "That subtracts the credit. A bear call loses as LABX rises: the short strike plus the credit." }],
          correct: "Right. 105.76. Below it the bear call keeps money; at 110 and above it loses the full 4.24.",
        },
        after: "A [[vertical-spread|vertical spread]] you pay for is a [[debit-spread|debit spread]]; one that pays you is a credit spread. The [[spread-width|spread width]] caps both sides.",
        concept: "vertical-spread",
      },
      {
        kind: "figure",
        title: "A cap for a floor",
        figure: {
          kind: "chart",
          chart: payoffChart(
            [-5, 18],
            "P&L at expiry per unit across LABX 80 to 120: a long 100-call bought at 2.86 (−2.86 below 100, breakeven 102.86, +17.14 at 120) and a 100/105 bull call spread bought for 1.78 (−1.78 below 100, breakeven 101.78, +3.22 above 105).",
          ),
          steps: [
            { text: "Long call 100: −2.86 below 100, unlimited above. Breakeven 102.86.", layers: [curve((s) => call(100)(s) - 2.86, "neutral", true)] },
            {
              text: "Bull call 100/105: risks 1.78, capped at +3.22 above 105. Breakeven 101.78.",
              layers: [curve((s) => call(100)(s) - call(105)(s) - 1.78, "accent"), dot(at(110), 3.22, "+3.22"), dot(at(101.78), 0, "101.78")],
            },
          ],
        },
        text: "[[defined-risk|Defined risk]] comes with a cap. The short call also cuts vega and theta, so the spread cares far less about volatility and time than the single call does.",
        concept: "vertical-spread",
      },
      {
        kind: "explain",
        title: "Win rate isn't edge",
        text: "In the model, the bull put spread ends above 94.24 about 79% of the time. It wins up to 0.76 four times in five and loses up to 4.24 the fifth: on average +0.74 per win, −2.72 per loss. Expected value: about zero before costs. An edge must come from elsewhere, such as the premium in 4.1.11.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Selling out-of-the-money spreads feels safe because it wins often. Practitioner records show the familiar pattern: many small wins, occasional full-width losses (evidence grade C). Judge a spread by its [[expectancy]] after costs, never by its [[win-rate|win rate]].",
      },
      {
        kind: "worked",
        title: "Size it at 1%",
        lines: [
          "Bull call max loss: 1.78 × 10 = 17.80 vUSD a contract.",
          "Budget: 1% of 10,000.00 = 100.00.",
          "Contracts = floor(100.00 ÷ 17.80) = ?",
        ],
        ask: {
          answer: 5,
          tolerance: 0,
          unit: "contracts",
          feedback: [
            { value: 6, text: "6 × 17.80 = 106.80, over the 100.00 budget. Round down." },
            { value: 56, text: "That divides by the per-unit loss, 1.78. A contract is 10 units: 17.80." },
          ],
          correct: "Right. 5 contracts, 89.00 at risk. Size from the defined maximum loss, never from the hoped-for gain.",
        },
        concept: "position-sizing",
      },
      {
        kind: "fields",
        title: "Build a bullish spread",
        prompt: "Build a bull call spread with a maximum loss of at most 2.00 and a maximum gain of at least 3.00 a unit. Calls: 90 at 10.21, 95 at 5.97, 100 at 2.86, 105 at 1.08, 110 at 0.32.",
        fields: [
          { id: "buy", label: "Buy the call, strike", kind: "choice", options: [90, 95, 100, 105], default: 90 },
          { id: "sell", label: "Sell the call, strike", kind: "choice", options: [95, 100, 105, 110], default: 95 },
        ],
        valid: {
          any: [
            { all: [{ field: "buy", eq: 100 }, { field: "sell", eq: 105 }] },
            { all: [{ field: "buy", eq: 105 }, { field: "sell", eq: 110 }] },
          ],
        },
        feedback: [
          {
            when: {
              any: [
                { all: [{ field: "buy", eq: 95 }, { field: "sell", eq: 95 }] },
                { all: [{ field: "buy", eq: 100 }, { field: "sell", lte: 100 }] },
                { all: [{ field: "buy", eq: 105 }, { field: "sell", lte: 105 }] },
              ],
            },
            text: "Buy the lower strike and sell the higher one. The other way round is a bearish spread, or no spread at all.",
          },
          { when: { field: "buy", lte: 95 }, text: "In-the-money calls cost too much: the debit, your max loss, passes 2.00." },
          { when: { field: "sell", eq: 110 }, text: "Buying the 100 and selling the 110 costs 2.54, over the 2.00 limit." },
        ],
        correct: "Right. Bull call 100/105: max loss 1.78, max gain 3.22. The 105/110 also fits, 0.76 against 4.24, but LABX must rise further.",
        concept: "vertical-spread",
      },
    ],
    check: ["q-4.1.9-1", "q-4.1.9-2", "q-4.1.9-3"],
    recap: {
      takeaways: [
        "Debit spread: max gain = width − debit. Credit spread: max loss = width − credit.",
        "Winning 79% of the time, with 0.76 wins and 4.24 losses, averages about zero.",
        "Size from the maximum loss: 100.00 ÷ 17.80 gives 5 bull call contracts.",
      ],
      next: "Next, 4.1.10: straddles and strangles, which buy movement in either direction, and the event trap.",
    },
  },
};

// ─── 4.1.10 · Buying movement: straddles, strangles and the event trap ─────

const L_4_1_10: Lesson = {
  id: "4.1.10",
  title: "Buying movement: straddles, strangles and the event trap",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "A straddle or strangle profits only if LABX moves more than the move already priced in, so a correct big-move call can still lose once implied volatility collapses.",
  objectives: [
    "Compute the breakevens, maximum loss and maximum gain of a long straddle and a long strangle.",
    'Show why a correct "big move" call can still lose after implied volatility collapses.',
    "Decide between long straddle, long strangle and no trade by comparing the implied move with your expected move.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
  ],
  script: {
    unit: "4.1",
    courseId: "4.1.10",
    bridge: "In 4.1.9 every spread needed a direction. A straddle needs only a big move, either way. In 3.7.6 a pending-order straddle got whipsawed; in 3.8.7 IV crush hit a call. Here theta, vega and the implied move of 4.1.6 and 4.1.7 price the options version.",
    hook: {
      prompt: "LABX reports tomorrow. You expect a big move, direction unknown, and buy the 7-day straddle for 6.62. The day after, LABX is up 4%. Do you profit?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Yes, about +4.00", feedback: "4.00 is the call's intrinsic value. The straddle cost 6.62, and its time value collapsed after the report." },
          { id: "b", label: "Yes, a little", feedback: "The 4% move was below the 6.6% the market had priced, and implied volatility fell from 60% to 25%." },
          { id: "c", label: "No, about −2.27" },
          { id: "d", label: "No, the whole 6.62", feedback: "Not all of it: the call is 4.00 in the money and some time value is left. The straddle is worth 4.35." },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. After the report implied volatility fell from 60% to 25%. With 6 days left the straddle is worth 4.35: −2.27 a unit despite the 4% move.",
      concept: "long-volatility",
    },
    learn: [
      {
        kind: "worked",
        title: "Two ways to buy movement",
        lines: [
          "Event tomorrow; 7-day options at IV 60%; LABX at 100.00.",
          "Long [[straddle]]: call 100 at 3.31 + put 100 at 3.31 = 6.62. Max loss 6.62; breakevens 93.38 and 106.62.",
          "Long [[strangle]]: call 105 at 1.47 + put 95 at 1.33 = 2.80. Max loss 2.80; lower breakeven 95 − 2.80 = 92.20.",
          "Strangle's upper breakeven = 105 + 2.80 = ?",
        ],
        ask: {
          answer: 107.8,
          tolerance: 0.005,
          feedback: [{ value: 102.2, text: "That subtracts the cost. On the call side LABX must rise above 105 by the whole 2.80." }],
          correct: "Right. 107.80. Cheaper than the straddle, but LABX must move further before it pays.",
        },
        after: "Max gain: unlimited up; down, 93.38 for the straddle and 92.20 for the strangle if LABX went to zero. Both are [[long-volatility|long volatility]].",
        concept: "long-volatility",
      },
      {
        kind: "figure",
        title: "The event trap",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(29),
            hideCandles: true,
            range: [-7.5, 8],
            height: 260,
            layers: [ZERO, tag(0, -7.5, "LABX 86"), tag(14, -7.5, "100"), tag(24, -7.5, "110")],
            describe:
              "P&L per unit of the 6.62 straddle across LABX 86 to 114. At expiry: −6.62 at 100, zero at 93.38 and 106.62. The day after the event, with IV 25% and 6 days left: −4.06 at 100, −2.32 at 96, −2.27 at 104, zero near 93.42 and 106.56.",
          },
          steps: [
            {
              text: "At expiry, dashed: −6.62 at 100, zero at 93.38 and 106.62.",
              layers: [{ kind: "line", values: EVENT_EXPIRY, role: "neutral", dashed: true }, dot(7.38, 0, "93.38", "neutral"), dot(20.62, 0, "106.62", "neutral")],
            },
            { text: "The day after, IV 25%: −4.06 at 100. Still a loss inside about ±6.6.", layers: [{ kind: "line", values: EVENT_DAY_AFTER, role: "accent" }, dot(14, -4.06, "−4.06")] },
            { text: "LABX at 104.00: worth 4.35, −2.27. At 96.00: worth 4.30, −2.32.", layers: [dot(18, -2.27, "−2.27", "down"), dot(10, -2.32, "−2.32", "down")] },
          ],
        },
        text: "The 60% implied volatility priced the event in. Once the news is out, [[iv-crush|IV crush]] strips most of the extrinsic value. The day-after breakevens sit near 93.42 and 106.56: about ±6.6, almost exactly the [[implied-move|implied move]].",
        concept: "iv-crush",
      },
      {
        kind: "explain",
        title: "What the evidence says",
        text: "In one practitioner data set, realised event moves averaged about 85% of the implied ones; another study finds event options roughly fairly priced (evidence grade C). Either way, a straddle bought before an event is a bet that the move will beat the one the market already prices, not a sure thing.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "The pending-order version from 3.7, a [[news-straddle|news straddle]] with a buy stop above and a sell stop below, carries a different risk: a spread that widens at the news can fill both sides and stop out both. That's a whipsaw, not a volatility trade.",
      },
      {
        kind: "predict",
        title: "How big a move?",
        prompt: "Implied volatility falls to 25% the day after the event. What's the smallest move in LABX, either way, that makes the 6.62 straddle profitable?",
        control: {
          kind: "slider",
          min: 0,
          max: 12,
          step: 0.1,
          start: 0,
          answer: 6.6,
          tolerance: 0.2,
          feedback: [
            { from: 0, to: 5.5, text: "Bigger than that. At a 4.00 move the straddle is worth only 4.35, well below 6.62." },
            { from: 7.5, to: 12, text: "Smaller than that. With 6 days of time value left, the straddle passes 6.62 a little before a 6.62 move." },
          ],
        },
        reveal: "About 6.6: LABX near 93.42 or 106.56. The day-after breakeven is almost exactly the implied move. To profit, you need a bigger move than the market priced.",
        concept: "implied-move",
      },
      {
        kind: "match",
        title: "Straddle, strangle or no trade",
        prompt: "The implied move is ±6.6%. Match each view to the decision it supports.",
        pairs: [
          { left: "Your honest estimate of the move: about 4%", right: "No trade", wrong: "You'd pay for 6.6% and expect 4%: a losing bet before it starts." },
          { left: "You expect about 6.6%, the same as priced", right: "No trade", wrong: "A fair price leaves no edge, and you would still pay the spread." },
          { left: "Past events of this kind moved about 10%, either way", right: "Long straddle", wrong: "Your expected move beats the implied one, and you don't know the direction: buy both at the money." },
          { left: "You expect rare, very large moves and want to pay less up front", right: "Long strangle", wrong: "The strangle costs 2.80 instead of 6.62, but needs LABX beyond 92.20 or 107.80." },
        ],
        columns: ["Your view", "Decision"],
        correct: "Right. Compare your expected move with the implied move first. Most of the time the honest answer is no trade.",
        concept: "long-volatility",
      },
    ],
    check: ["q-4.1.10-1", "q-4.1.10-2", "q-4.1.10-3"],
    recap: {
      takeaways: [
        "Straddle 6.62: breakevens 93.38 and 106.62. Strangle 2.80: cheaper, breakevens 92.20 and 107.80.",
        "After the IV crush, a 4% move left the straddle at −2.27: right on movement, still a loss.",
        "Buy movement only when your expected move beats the implied move; otherwise, no trade.",
      ],
      next: "Next, 4.1.11: the seller's side, getting paid for the volatility risk premium, and the crash risk that comes with it.",
    },
  },
};

// ─── 4.1.11 · The volatility risk premium: getting paid to sell insurance ──

const L_4_1_11: Lesson = {
  id: "4.1.11",
  title: "The volatility risk premium: getting paid to sell insurance",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Option sellers are paid on average because implied volatility tends to exceed realised volatility, but the pay comes as small steady gains and rare, very large losses.",
  objectives: [
    "Explain the volatility risk premium and why option sellers are paid on average.",
    "Compare the risk of a naked short straddle with a defined-risk iron condor.",
    "Size a short-volatility position from a stress loss, not from the premium collected.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
    { kind: "check", ref: "risk_management", label: "Risk management check" },
  ],
  script: {
    unit: "4.1",
    courseId: "4.1.11",
    bridge: "In 4.1.10 the straddle buyer lost when the move fell short of the implied one. Here you take the seller's side. In 3.10.1 option selling showed rare, big losses, and 3.12.5 defined ruin; 4.1.9's capped spreads and a stress test now decide the size.",
    hook: {
      prompt: "A strategy made money in 22 of the last 24 months, with tiny losses. What is the most likely hidden risk?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "None: it's skill", feedback: "Maybe, but 22 good months fit many strategies that sell insurance: steady premiums until the rare bad month." },
          { id: "b", label: "A rare, very large loss" },
          { id: "c", label: "Taxes", feedback: "Taxes matter, but they don't hide in a smooth equity curve. A tail loss does." },
          { id: "d", label: "Boredom", feedback: "Boredom is a risk to discipline, not to the account. Ask what this shape of returns usually hides." },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. Steady small gains with tiny losses is the shape of selling options. The bill comes rarely, and all at once.",
      concept: "short-volatility-risk",
    },
    learn: [
      {
        kind: "explain",
        title: "Paid to sell insurance",
        text: "On average, implied volatility has exceeded the volatility that followed. Carr and Wu (2009) find strongly negative variance risk premiums on stock indexes: option buyers pay for insurance and sellers collect it, on average. That is the [[volatility-risk-premium|volatility risk premium]], evidence grade A. It is payment for bearing crash risk.",
      },
      {
        kind: "predict",
        title: "One Monday",
        prompt: "Friday 2 February 2018: the VIX, the S&P 500's 30-day implied volatility, closed at 17.31. Products betting on calm had earned steadily for years. Where did it close on Monday?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "About 19", feedback: "A normal bad day. This was not one." },
            { id: "b", label: "About 25", feedback: "Higher still: the VIX more than doubled in one session." },
            { id: "c", label: "Above 37" },
          ],
          answer: "c",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "VIX close, Fri 2 Feb 2018", value: 17.31, role: "neutral" },
            { label: "VIX close, Mon 5 Feb 2018", value: 37.32, role: "down" },
          ],
          steps: ["One session apart: 17.31, then 37.32, up 116%."],
        },
        reveal: "37.32, up 116% in one session. Products short volatility lost over 90% in a day; XIV shrank from about $1.9 billion to $63 million and was closed. Years of premiums went in one day.",
        concept: "short-volatility-risk",
      },
      {
        kind: "worked",
        title: "Naked or winged",
        lines: [
          "30 days, IV 25%, per unit.",
          "Short straddle, −call 100 and −put 100: credit 5.72, the max gain. Breakevens 94.28 and 105.72. Max loss unlimited up, 94.28 down.",
          "[[iron-condor|Iron condor]], −put 95, +put 90, −call 105, +call 110: credit 0.97 − 0.21 + 1.08 − 0.32 = 1.52. Breakevens 93.48 and 106.52.",
          "Condor max loss = wing width − credit = 5 − 1.52 = ?",
        ],
        ask: {
          answer: 3.48,
          tolerance: 0.005,
          feedback: [{ value: 6.52, text: "That adds the credit. The credit you keep reduces the loss: width minus credit." }],
          correct: "Right. 3.48 at most, on either side. The model gives about 64% odds of ending between the breakevens.",
        },
        concept: "short-volatility-risk",
      },
      {
        kind: "figure",
        title: "Open-ended or capped",
        figure: {
          kind: "chart",
          chart: payoffChart(
            [-15, 7],
            "P&L at expiry per unit across LABX 80 to 120: a short 100 straddle sold for 5.72 (+5.72 at 100, −14.28 at 80 and 120) and an iron condor 90/95/105/110 sold for 1.52 (+1.52 between 95 and 105, −3.48 below 90 and above 110).",
          ),
          steps: [
            { text: "Short straddle: +5.72 at 100, losses growing without limit both ways.", layers: [curve((s) => 5.72 - Math.abs(s - 100), "down"), dot(at(100), 5.72, "+5.72", "down")] },
            {
              text: "Iron condor: +1.52 between 95 and 105, never worse than −3.48.",
              layers: [curve((s) => 1.52 - put(95)(s) + put(90)(s) - call(105)(s) + call(110)(s), "accent"), dot(at(115), -3.48, "−3.48")],
            },
          ],
        },
        text: "Both are [[short-volatility|short volatility]]: they win when LABX moves less than priced. The condor buys wings, so an open-ended loss becomes a known one. That cap is what makes sizing exact.",
        concept: "short-volatility-risk",
      },
      {
        kind: "worked",
        title: "Size from stress",
        lines: [
          "Budget 1% = 100.00. Condor: max loss 3.48 × 10 = 34.80 a contract, so 2 contracts, 69.60.",
          "Short straddle: no max loss. Held to expiry, a −15% gap to 85.00 costs 15.00 − 5.72 = 9.28 a unit, 92.80 a contract.",
          "A −25% gap to 75.00: loss per contract = (25.00 − 5.72) × 10 = ?",
        ],
        ask: {
          answer: 192.8,
          tolerance: 0.005,
          unit: "vUSD",
          feedback: [{ value: 250, text: "That forgets the 5.72 premium collected, which offsets part of the loss." }],
          correct: "Right. 192.80 on one contract, almost twice the budget. Size from the stress you choose, not from the 57.20 premium.",
        },
        after: "Sized from the premium, a few contracts could lose several times the budget in one gap, a short road to [[risk-of-ruin|ruin]]. Fix the stress loss first, then the size.",
        concept: "short-volatility-risk",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "The Sharpe ratio flatters negative skew: a smooth equity curve with a hidden [[tail-risk|tail]] looks excellent until the tail arrives. Judge short-volatility strategies by their worst stress loss and by Expected Shortfall (4.4.1). Never sell options without defined risk or a size fixed from stress.",
      },
      {
        kind: "fields",
        title: "Survive the spike",
        prompt: "Stress test: a volatility spike and a −25% gap. Each iron condor loses its maximum, 34.80; each short straddle loses 192.80. Choose a size whose total stress loss is at most 300.00, 3% of the account.",
        fields: [
          { id: "condors", label: "Iron condors", kind: "stepper", min: 0, max: 12, step: 1, unit: " contracts", default: 10 },
          { id: "straddles", label: "Short straddles", kind: "stepper", min: 0, max: 3, step: 1, unit: " contracts", default: 0 },
        ],
        valid: {
          any: [
            { all: [{ field: "straddles", eq: 0 }, { field: "condors", gte: 1 }, { field: "condors", lte: 8 }] },
            { all: [{ field: "straddles", eq: 1 }, { field: "condors", lte: 3 }] },
          ],
        },
        feedback: [
          { when: { all: [{ field: "straddles", eq: 0 }, { field: "condors", eq: 0 }] }, text: "No position, no risk, but no premium either. Size something within 300.00." },
          { when: { field: "straddles", gte: 2 }, text: "{straddles} short straddles lose at least 385.60 in the gap: over 300.00 before any condor." },
          { when: { field: "straddles", eq: 1 }, text: "192.80 for the straddle plus {condors} × 34.80 for the condors passes 300.00. Three condors is the most." },
          { when: { field: "condors", gte: 9 }, text: "{condors} × 34.80 passes 300.00. Eight condors, 278.40, is the most." },
        ],
        correct: "Right. Your stress loss fits within 300.00. Defined-risk condors let you count exactly; each short straddle uses most of the budget on a single gap.",
        concept: "short-volatility-risk",
      },
    ],
    check: ["q-4.1.11-1", "q-4.1.11-2", "q-4.1.11-3"],
    recap: {
      takeaways: [
        "Implied volatility tends to exceed realised: sellers earn a premium for bearing crash risk.",
        "A short straddle's loss is open-ended; an iron condor caps it at 3.48 a unit.",
        "Size short volatility from a stress loss: one straddle lost 192.80 in a −25% gap.",
      ],
      next: "Next: the 4.1 checkpoint, then unit 4.2, Execution and market impact, where your own orders move the price.",
    },
  },
};

// ─── Check questions ───────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: "q-4.1.1-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "You sell a LABX call and collect the premium. Who carries the obligation?",
    options: [
      { id: "a", label: "The buyer: they must buy LABX at the strike at expiry", rationale: "The buyer holds a right, not a duty. They exercise only when it pays and can let the option lapse." },
      { id: "b", label: "The exchange, which takes both sides", rationale: "Clearing guarantees the trade, but the obligation to deliver falls on a writer like you, once assigned." },
      { id: "c", label: "You, the writer: you must sell LABX at the strike if assigned" },
      { id: "d", label: "Nobody: an option is only a bet on direction", rationale: "An option is a contract that settles. The writer's obligation is exactly what the premium pays for." },
    ],
    correct: "c",
    explanation: "Buying an option buys a right; selling one sells an obligation. As the call's writer you collected the premium, and you must sell LABX at the strike if the holder exercises and you are assigned.",
    lesson: "4.1.1",
    concepts: ["option-contract"],
  },
  {
    id: "q-4.1.1-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "LABX is at 100.00. A put with strike 95 is:",
    options: [
      { id: "a", label: "In the money: its strike is below the price", rationale: "That's the rule for calls. A put is the right to sell; selling at 95 what trades at 100 is worth nothing now." },
      { id: "b", label: "Out of the money" },
      { id: "c", label: "At the money", rationale: "At the money means the strike is at or very near the price. 95 is 5.00 away." },
      { id: "d", label: "In the money, because puts profit from falls", rationale: "It would profit if LABX fell below 95, but today it has no intrinsic value, so it's out of the money." },
    ],
    correct: "b",
    explanation: "A put's intrinsic value is max(K − S, 0) = max(95 − 100, 0) = 0. With no intrinsic value it's out of the money: its whole 0.97 premium is extrinsic.",
    lesson: "4.1.1",
    concepts: ["option-moneyness"],
  },
  {
    id: "q-4.1.1-3",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "LABX is at 100.00. A put with strike 105 is quoted at 6.08. What is its extrinsic value, in vUSD per unit?",
    numeric: { answer: 1.08, tolerance: 0.005, unit: "vUSD" },
    explanation: "A put's intrinsic value is max(K − S, 0) = 105 − 100 = 5.00. Extrinsic value = premium − intrinsic = 6.08 − 5.00 = 1.08, the part paid for time and volatility.",
    lesson: "4.1.1",
    concepts: ["option-moneyness"],
    hints: ["Split the premium into intrinsic and extrinsic value.", "A put's intrinsic value is the strike minus the price, if positive.", "105 − 100 = 5.00. Subtract it from 6.08."],
    vary: {
      fields: { k: [101, 115, 1], e: [0.3, 2.5, 0.01] },
      answer: "e",
      prompt: "LABX is at 100.00. A put with strike {k} is quoted at {k - 100 + e:2}. What is its extrinsic value, in vUSD per unit?",
      explanation: "A put's intrinsic value is max(K − S, 0) = {k} − 100 = {k - 100:2}. Extrinsic value = premium − intrinsic = {k - 100 + e:2} − {k - 100:2} = {answer:2}.",
      hint: "{k} − 100 = {k - 100:2}. Subtract it from {k - 100 + e:2}.",
    },
  },
  {
    id: "q-4.1.2-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "You buy a LABX put with strike 95 for 0.97. What is its breakeven at expiry?",
    numeric: { answer: 94.03, tolerance: 0.005, unit: "vUSD" },
    explanation: "A long put gains as LABX falls, and it must fall far enough below the strike to repay the premium: 95 − 0.97 = 94.03. Below that, profit; above it, a loss of up to 0.97.",
    lesson: "4.1.2",
    concepts: ["option-payoff"],
    hints: ["A put pays only below its strike.", "Breakeven of a long put = strike − premium."],
    vary: {
      fields: { k: [80, 120, 5], p: [0.2, 4, 0.01] },
      answer: "k - p",
      prompt: "You buy a LABX put with strike {k} for {p:2}. What is its breakeven at expiry?",
      explanation: "A long put must fall far enough below the strike to repay the premium: {k} − {p:2} = {answer:2}. Below that, profit; above it, a loss of up to {p:2}.",
      hint: "Strike − premium: {k} − {p:2}.",
    },
  },
  {
    id: "q-4.1.2-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "You sell the 100-strike LABX put for 2.86. What is your maximum loss per unit?",
    options: [
      { id: "a", label: "2.86", rationale: "That's your maximum gain: the premium you keep if LABX stays above 100." },
      { id: "b", label: "100.00", rationale: "That forgets the 2.86 you collected, which offsets part of the loss." },
      { id: "c", label: "Unlimited", rationale: "An unlimited loss belongs to the short call. A put's loss stops when LABX reaches zero." },
      { id: "d", label: "97.14" },
    ],
    correct: "d",
    explanation: "If LABX falls to zero you must buy it at 100 and it's worth nothing: −100.00, offset by the 2.86 premium. Maximum loss = 100 − 2.86 = 97.14 a unit, 971.40 a contract.",
    lesson: "4.1.2",
    concepts: ["option-payoff"],
    hints: ["How low can LABX go?", "At zero you pay the strike for something worthless, minus the premium you kept."],
  },
  {
    id: "q-4.1.2-3",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 1,
    prompt: "You wrote a LABX call and receive an assignment notice. What does it mean?",
    options: [
      { id: "a", label: "You must sell LABX at the strike" },
      { id: "b", label: "You may buy LABX at the strike if you wish", rationale: "That's the holder's kind of right, not yours. Assignment is where the writer's obligation is enforced." },
      { id: "c", label: "You must return the premium you collected", rationale: "The premium is yours whatever happens. Assignment obliges you to deliver LABX at the strike." },
      { id: "d", label: "The option has expired worthless", rationale: "Worthless options aren't exercised, so no one is assigned. A notice means the holder exercised." },
    ],
    correct: "a",
    explanation: "The holder exercised the call and you, a writer, were assigned: you must deliver LABX at the strike. If you don't own it, you sell at the strike what you must buy at the market price.",
    lesson: "4.1.2",
    concepts: ["exercise-and-assignment"],
  },
  {
    id: "q-4.1.3-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "Rates are zero and LABX is at 100.00. The 105-strike call costs 1.08. What should the 105-strike put with the same expiry cost?",
    numeric: { answer: 6.08, tolerance: 0.01, unit: "vUSD" },
    explanation: "Parity at r = 0: C − P = S − K, so P = C − S + K = 1.08 − 100 + 105 = 6.08. That's 5.00 of intrinsic value plus the same 1.08 of extrinsic value as the call.",
    lesson: "4.1.3",
    concepts: ["put-call-parity"],
    hints: ["Put-call parity at zero rates: C − P = S − K.", "Rearrange for the put: P = C − S + K."],
    vary: {
      fields: { k: [101, 115, 1], c: [0.2, 3, 0.01] },
      answer: "c + k - 100",
      prompt: "Rates are zero and LABX is at 100.00. The {k}-strike call costs {c:2}. What should the {k}-strike put with the same expiry cost?",
      explanation: "Parity at r = 0: P = C − S + K = {c:2} − 100 + {k} = {answer:2}. That's {k - 100:2} of intrinsic value plus the call's {c:2} of extrinsic value.",
      hint: "P = C − S + K = {c:2} − 100 + {k}.",
    },
  },
  {
    id: "q-4.1.3-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which position has the same payoff at expiry as a covered call: long LABX plus a short call at strike K?",
    options: [
      { id: "a", label: "A long put at K", rationale: "A long put gains as LABX falls, while the covered call loses then. Their payoffs point opposite ways." },
      { id: "b", label: "A long call at K", rationale: "Long stock plus a long put copies a long call. A covered call contains a short option." },
      { id: "c", label: "A short put at K with the cash to buy the stock: a cash-secured put" },
      { id: "d", label: "A short call at K on its own", rationale: "Without the stock, the short call loses without limit as LABX rises. The stock is what covers it." },
    ],
    correct: "c",
    explanation: "Rearrange parity: S − C = K·e^(−rT) − P. Long stock plus a short call equals cash plus a short put. Same payoff, same downside: a covered call is no safer than a cash-secured put.",
    lesson: "4.1.3",
    concepts: ["synthetic-position", "put-call-parity"],
    hints: ["Start from C − P = S − K and move the terms around.", "What's left when you write S − C?"],
  },
  {
    id: "q-4.1.3-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 3,
    scenario: "Rates are zero. The LABX 100-call is quoted at 2.86 and the 100-put at 2.50. Buying LABX, buying the put and selling the call locks in 0.36 a unit before costs.",
    prompt: "Why isn't this free money for a retail account?",
    options: [
      { id: "a", label: "The 0.36 depends on where LABX ends", rationale: "The combination is worth exactly 100.00 at expiry whatever LABX does. That certainty is what makes it an arbitrage." },
      { id: "b", label: "Parity holds only for American options", rationale: "Parity holds exactly for European options like LABX's. American options add early-exercise caveats, not the reverse." },
      { id: "c", label: "Brokers forbid holding a put and a short call together", rationale: "It's a standard combination, called a conversion. The obstacle is cost, not permission." },
      { id: "d", label: "Spreads and commissions on three legs eat most or all of it, and such gaps close in milliseconds" },
    ],
    correct: "d",
    explanation: "Half-spreads of 0.05 on three legs and two commissions of 0.05 on LABX cost 0.25, leaving 0.11. With option spreads of 0.40 the trade loses 0.19. And in liquid markets faster traders close such gaps first.",
    lesson: "4.1.3",
    concepts: ["put-call-parity", "trading-costs"],
    hints: ["Count every leg you have to trade.", "Each leg pays half its spread; LABX also pays commission in and out."],
  },
  {
    id: "q-4.1.4-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which Black–Scholes input can't you read off your screen?",
    options: [
      { id: "a", label: "LABX's price", rationale: "The price is quoted live. The input you have to estimate is how much LABX will move." },
      { id: "b", label: "The strike", rationale: "The strike is written in the contract. The unknown is the volatility over the option's life." },
      { id: "c", label: "The volatility over the option's life" },
      { id: "d", label: "The time to expiry", rationale: "The expiry date is in the contract, so the time left is a simple count." },
    ],
    correct: "c",
    explanation: "Price, strike, time and the rate are all known. Future volatility is not: you must estimate it, which is why the market quotes options by their implied volatility.",
    lesson: "4.1.4",
    concepts: ["option-pricing-model"],
  },
  {
    id: "q-4.1.4-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "Use the quick rule 0.4 × S × σ × √T. LABX is at 100.00, implied volatility is 20% and expiry is one year away. What is the estimated at-the-money call price?",
    numeric: { answer: 8, tolerance: 0.05, unit: "vUSD" },
    explanation: "0.4 × 100 × 0.20 × √1 = 8.00. The full model gives 7.97: near the money, the rule is close.",
    lesson: "4.1.4",
    concepts: ["option-pricing-model"],
    hints: ["For one year, √T = 1.", "0.4 × 100 × 0.20."],
    vary: {
      fields: { s: [50, 200, 10], v: [10, 60, 5] },
      answer: "round(0.4 * s * v / 100, 2)",
      prompt: "Use the quick rule 0.4 × S × σ × √T. LABX is at {s:2}, implied volatility is {v}% and expiry is one year away. What is the estimated at-the-money call price?",
      explanation: "0.4 × {s:2} × {v / 100:2} × √1 = {answer:2}. For one year √T = 1, so the estimate is 0.4 × price × volatility.",
      hint: "0.4 × {s} × {v / 100:2}.",
    },
  },
  {
    id: "q-4.1.4-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "LABX gaps 8% overnight on news. Which Black–Scholes assumption does that break?",
    options: [
      { id: "a", label: "European exercise", rationale: "Exercise style is about when the holder may exercise. A gap breaks the model's picture of how the price moves." },
      { id: "b", label: "Continuous trading with no jumps" },
      { id: "c", label: "A fixed strike", rationale: "The strike stays as written. What fails is the smooth, continuous path the model assumes for LABX." },
      { id: "d", label: "Zero interest rates", rationale: "Rates are an input you can set. The gap breaks the assumption that the price moves continuously." },
    ],
    correct: "b",
    explanation: "The model assumes LABX moves continuously, with lognormal returns and constant volatility. A gap is a jump: no trading in between and no chance to hedge. Real markets also show fat tails and skew that the model leaves out.",
    lesson: "4.1.4",
    concepts: ["option-pricing-model", "gap-risk"],
    hints: ["What happens between the close and the next open during a gap?", "The model pictures a price path with no breaks in it."],
  },
  {
    id: "q-4.1.5-1",
    topic: "portfolio_exposure",
    kind: "mcq",
    difficulty: 1,
    prompt: "What is the delta of the 30-day at-the-money LABX put, strike 100 with LABX at 100.00?",
    options: [
      { id: "a", label: "+0.51", rationale: "That's the call. A put gains as LABX falls, so its delta is negative." },
      { id: "b", label: "−1.00", rationale: "That's a deep in-the-money put, moving one for one with LABX. At the money it's about half." },
      { id: "c", label: "−0.49" },
      { id: "d", label: "0", rationale: "Zero is a far out-of-the-money put. At the money the put moves about half as much as LABX, the other way." },
    ],
    correct: "c",
    explanation: "Put delta = call delta − 1 = 0.51 − 1 = −0.49. For each 1.00 LABX rises, the put loses about 0.49, and gains about as much when LABX falls 1.00.",
    lesson: "4.1.5",
    concepts: ["option-delta"],
  },
  {
    id: "q-4.1.5-2",
    topic: "portfolio_exposure",
    kind: "numeric",
    difficulty: 2,
    prompt: "You hold 20 contracts of a LABX call with delta 0.26; a contract covers 10 units. How many LABX do you sell short to be delta neutral?",
    numeric: { answer: 52, tolerance: 0.5, unit: "units" },
    explanation: "Position delta = contracts × 10 × delta = 20 × 10 × 0.26 = 52. Short 52 LABX, and small moves barely change the combined value.",
    lesson: "4.1.5",
    concepts: ["delta-hedging"],
    hints: ["Position delta = contracts × units per contract × delta.", "20 × 10 × 0.26."],
    vary: {
      fields: { c: [2, 40, 1], d: [0.1, 0.9, 0.01] },
      constraints: ["abs(c * 10 * d - floor(c * 10 * d) - 0.5) > 0.05"],
      answer: "round(c * 10 * d, 0)",
      prompt: "You hold {c} contracts of a LABX call with delta {d:2}; a contract covers 10 units. How many LABX do you sell short to be delta neutral?",
      explanation: "Position delta = {c} × 10 × {d:2} = {c * 10 * d:1}. Short {answer} LABX, and small moves barely change the combined value.",
      hint: "{c} × 10 × {d:2}.",
    },
  },
  {
    id: "q-4.1.5-3",
    topic: "portfolio_exposure",
    kind: "mcq",
    difficulty: 2,
    prompt: "Where is an option's gamma largest?",
    options: [
      { id: "a", label: "Deep in the money, months from expiry", rationale: "Deep in the money, delta is already near 1 and barely changes. Gamma is small there." },
      { id: "b", label: "Far out of the money, close to expiry", rationale: "Near expiry a far out-of-the-money option stays worthless through small moves: its delta, and its gamma, stay near zero." },
      { id: "c", label: "At the money, months from expiry", rationale: "At the money is right, but with months left the hump is low and wide: 0.028 at 120 days." },
      { id: "d", label: "At the money, close to expiry" },
    ],
    correct: "d",
    explanation: "Near expiry, a small move decides whether an at-the-money option ends worth something or nothing, so its delta swings between 0 and 1. The 100-call's gamma: 0.056 with 30 days left, 0.30 with one day.",
    lesson: "4.1.5",
    concepts: ["option-gamma"],
    hints: ["Gamma is how fast delta changes.", "Where can a small move flip an option from worthless to valuable?"],
  },
  {
    id: "q-4.1.6-1",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "What sign does theta have for a short put position?",
    options: [
      { id: "a", label: "Negative: time costs you money", rationale: "That's the buyer's side. The writer collected the premium and gains as it decays." },
      { id: "b", label: "Positive: time decay works for you" },
      { id: "c", label: "Zero: only direction matters", rationale: "All else equal, the option loses value each day, and that loss is the writer's gain." },
      { id: "d", label: "It depends on whether LABX rises", rationale: "Theta measures time alone, all else equal. A short option's theta is positive whatever LABX does." },
    ],
    correct: "b",
    explanation: "A long option loses extrinsic value each day: negative theta. The writer is on the other side, so a short put or short call has positive theta. The price of that steady income is negative gamma.",
    lesson: "4.1.6",
    concepts: ["option-theta"],
  },
  {
    id: "q-4.1.6-2",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which LABX option has the most vega?",
    options: [
      { id: "a", label: "At the money, one day to expiry", rationale: "With one day left there's little time for volatility to matter: vega 0.021, against 0.114 at 30 days." },
      { id: "b", label: "At the money, one year to expiry" },
      { id: "c", label: "Deep in the money, 30 days to expiry", rationale: "Deep in the money options are mostly intrinsic value and behave like stock: little to reprice when volatility changes." },
      { id: "d", label: "Far out of the money, 30 days to expiry", rationale: "It has some vega, 0.050 for the call 110, but less than the at-the-money option and far less than a long-dated one." },
    ],
    correct: "b",
    explanation: "Vega grows with time to expiry and peaks at the money. At IV 25%, the 100-strike option's vega is 0.021 with one day left, 0.114 with 30 days and 0.396 with a year.",
    lesson: "4.1.6",
    concepts: ["option-vega"],
  },
  {
    id: "q-4.1.6-3",
    topic: "scenario_analysis",
    kind: "numeric",
    difficulty: 3,
    prompt: "The 100-call has delta 0.51, gamma 0.056, theta −0.048 a day and vega 0.114. Over one day LABX falls 1.00 and implied volatility rises 2 points. Estimated change in the call's price?",
    numeric: { answer: -0.3, tolerance: 0.02, unit: "vUSD" },
    explanation: "Delta: −0.51 × 1 = −0.51. Gamma: ½ × 0.056 × 1² = +0.028, positive whichever way LABX moves. Theta: −0.048. Vega: 0.114 × 2 = +0.228. Total ≈ −0.30; full repricing gives −0.31.",
    lesson: "4.1.6",
    concepts: ["option-vega", "option-theta"],
    hints: ["Add four terms: delta, gamma, theta and vega.", "The gamma term is ½ × gamma × move², positive either way.", "−0.51 + 0.028 − 0.048 + 0.228."],
    vary: {
      fields: { m: [1, 3, 1], v: [1, 4, 1] },
      answer: "round(-0.51 * m + 0.028 * m * m - 0.048 + 0.114 * v, 2)",
      prompt: "The 100-call has delta 0.51, gamma 0.056, theta −0.048 a day and vega 0.114. Over one day LABX falls {m}.00 and implied volatility rises {v} points. Estimated change in the call's price?",
      explanation: "Delta takes 0.51 × {m} = {0.51 * m:2}. Gamma adds ½ × 0.056 × {m}² = {0.028 * m * m:3}, whichever way LABX moves. Theta takes 0.048. Vega adds 0.114 × {v} = {0.114 * v:3}. Net: a loss of about {0 - answer:2}.",
      hint: "−0.51 × {m} + 0.028 × {m * m} − 0.048 + 0.114 × {v}.",
    },
  },
  {
    id: "q-4.1.7-1",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "What is implied volatility?",
    options: [
      { id: "a", label: "The volatility LABX actually showed over the past 30 days", rationale: "That's realised, or historical, volatility. Implied volatility is read from option prices, looking forward." },
      { id: "b", label: "The volatility that makes a pricing model match the option's market price" },
      { id: "c", label: "A volatility the exchange sets for margin", rationale: "Exchanges set margins, not option prices. Implied volatility comes from the prices traders agree on." },
      { id: "d", label: "A forecast that is right on average", rationale: "On average it has run above the volatility that followed: it includes a risk premium." },
    ],
    correct: "b",
    explanation: "Put the market price into the model and solve for σ: that's implied volatility. It mixes the market's forecast with a premium, which is why it has tended to sit above the volatility that followed.",
    lesson: "4.1.7",
    concepts: ["implied-volatility"],
  },
  {
    id: "q-4.1.7-2",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "On a 30-day LABX expiry, implied volatility is 31% at the 90 strike, 25% at 100 and 22% at 110. What does this shape show?",
    options: [
      { id: "a", label: "The market expects LABX to rise", rationale: "Skew prices the size and fear of falls, not a forecast of direction." },
      { id: "b", label: "A put skew: downside protection is priced richer" },
      { id: "c", label: "Calls at 110 are a bargain to buy", rationale: "Lower IV isn't a mispricing by itself. The shape reflects demand for crash protection on the put side." },
      { id: "d", label: "A pricing error: IV should be equal across strikes", rationale: "Only in the Black–Scholes world. Real surfaces have skew, and that's information, not error." },
    ],
    correct: "b",
    explanation: "Higher implied volatility on low strikes is a put skew, typical of index and stock options: investors pay up for protection against crashes, so downside puts carry richer volatility than calls.",
    lesson: "4.1.7",
    concepts: ["volatility-surface"],
    hints: ["Which strikes carry the highest implied volatility: the low ones or the high ones?", "Low strikes are where downside puts sit."],
  },
  {
    id: "q-4.1.7-3",
    topic: "scenario_analysis",
    kind: "numeric",
    difficulty: 1,
    prompt: "LABX is at 100.00 and the at-the-money straddle costs 4.20. What move is the market pricing in, in %?",
    numeric: { answer: 4.2, tolerance: 0.05, unit: "%" },
    explanation: "Implied move ≈ straddle ÷ price = 4.20 ÷ 100.00 = 4.2%: the market prices a move of about ±4.20 by expiry.",
    lesson: "4.1.7",
    concepts: ["implied-move", "implied-volatility"],
    hints: ["Divide the straddle by the price.", "4.20 ÷ 100.00, as a percentage."],
    vary: {
      fields: { s: [40, 200, 10], m: [20, 120, 1] },
      answer: "m / 10",
      prompt: "LABX is at {s:2} and the at-the-money straddle costs {s * m / 1000:2}. What move is the market pricing in, in %?",
      explanation: "Implied move ≈ straddle ÷ price = {s * m / 1000:2} ÷ {s:2} = {answer:1}%: the market prices a move of about ±{s * m / 1000:2} by expiry.",
      hint: "{s * m / 1000:2} ÷ {s:2}, as a percentage.",
    },
  },
  {
    id: "q-4.1.8-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "You own LABX at 100.00 and sell a 110-strike call for 0.32. What is the covered call's maximum gain per unit?",
    numeric: { answer: 10.32, tolerance: 0.005, unit: "vUSD" },
    explanation: "Above 110 the stock is called away at 110: (110 − 100) + 0.32 = 10.32. Any rise beyond 110 belongs to the call's buyer.",
    lesson: "4.1.8",
    concepts: ["covered-call"],
    hints: ["Above the strike, you sell LABX at the strike.", "Gain on the stock up to the strike, plus the premium."],
    vary: {
      fields: { k: [101, 120, 1], c: [0.1, 3, 0.01] },
      answer: "k - 100 + c",
      prompt: "You own LABX at 100.00 and sell a {k}-strike call for {c:2}. What is the covered call's maximum gain per unit?",
      explanation: "Above {k} the stock is called away at {k}: ({k} − 100) + {c:2} = {answer:2}. Any rise beyond {k} belongs to the call's buyer.",
      hint: "({k} − 100) + {c:2}.",
    },
  },
  {
    id: "q-4.1.8-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why does a protective put hold through an overnight gap when a stop-loss doesn't?",
    options: [
      { id: "a", label: "Puts are executed before stops at the open", rationale: "It isn't about queue order. The put's value doesn't depend on any fill: it pays the strike." },
      { id: "b", label: "The put lets you sell at the strike whatever price LABX opens at; a triggered stop just becomes a market order" },
      { id: "c", label: "The put's premium is refunded after a gap", rationale: "The premium is spent either way. What the put gives back is the right to sell at the strike." },
      { id: "d", label: "Stops are cancelled overnight", rationale: "Stops stay working; the trouble is their fill price after the gap, not their existence." },
    ],
    correct: "b",
    explanation: "A stop at 95.00 triggers on the gap and fills near the open, say 88.00. A 95 put lets you sell at 95 however far LABX opens: the loss stays at 5.00 plus the 0.97 premium.",
    lesson: "4.1.8",
    concepts: ["protective-put", "gap-risk"],
    hints: ["What does a stop become once it triggers?", "Does the put's payout depend on any fill price?"],
  },
  {
    id: "q-4.1.8-3",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "In which regime does a covered call fall furthest behind simply owning LABX?",
    options: [
      { id: "a", label: "A quiet range", rationale: "In a range the covered call beats the stock by the premium it collected." },
      { id: "b", label: "A slow decline", rationale: "In a decline the premium cushions the loss, so the covered call does a little better than the stock." },
      { id: "c", label: "A crash", rationale: "In a crash both lose almost the same; the covered call loses slightly less, by the premium." },
      { id: "d", label: "A strong rally" },
    ],
    correct: "d",
    explanation: "The short call caps the gain at the strike plus the premium: 6.08 with the 105 call. In a +12% rally the stock makes 12.00, so the covered call lags by 5.92. It sells the upside of the distribution.",
    lesson: "4.1.8",
    concepts: ["covered-call", "market-regime"],
    hints: ["The short call caps the gain at strike plus premium.", "Where does a cap cost the most?"],
  },
  {
    id: "q-4.1.9-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "You buy the 100/95 bear put spread for a debit of 1.89: long the 100 put, short the 95 put. What is its breakeven at expiry?",
    numeric: { answer: 98.11, tolerance: 0.005, unit: "vUSD" },
    explanation: "A bear put spread profits as LABX falls below the long strike by more than the debit: 100 − 1.89 = 98.11. Its max gain is 5 − 1.89 = 3.11 and its max loss the 1.89 debit.",
    lesson: "4.1.9",
    concepts: ["vertical-spread"],
    hints: ["The long put does the work; the short put only caps it.", "Breakeven = long strike − debit."],
    vary: {
      fields: { k: [90, 120, 1], d: [0.5, 4.5, 0.01] },
      answer: "k - d",
      prompt: "You buy the {k}/{k - 5} bear put spread for a debit of {d:2}: long the {k} put, short the {k - 5} put. What is its breakeven at expiry?",
      explanation: "A bear put spread profits as LABX falls below the long strike by more than the debit: {k} − {d:2} = {answer:2}. Its max gain is 5 − {d:2} = {5 - d:2} and its max loss the {d:2} debit.",
      hint: "Long strike − debit: {k} − {d:2}.",
    },
  },
  {
    id: "q-4.1.9-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "A credit spread with strikes 5 apart collects a credit of 1.20. What is its maximum loss per unit?",
    numeric: { answer: 3.8, tolerance: 0.005, unit: "vUSD" },
    explanation: "At worst the spread is worth its full width, 5.00, against you; the credit you kept offsets part of it: 5 − 1.20 = 3.80. A contract risks 38.00.",
    lesson: "4.1.9",
    concepts: ["vertical-spread"],
    hints: ["The most a vertical can be worth is its width.", "Max loss of a credit spread = width − credit."],
    vary: {
      fields: { w: [2, 10, 1], c: [0.2, 4, 0.05] },
      constraints: ["c < w - 0.5"],
      answer: "w - c",
      prompt: "A credit spread with strikes {w} apart collects a credit of {c:2}. What is its maximum loss per unit?",
      explanation: "At worst the spread is worth its full width, {w:2}, against you; the credit you kept offsets part of it: {w} − {c:2} = {answer:2}. A contract risks {answer * 10:2}.",
      hint: "Width − credit: {w} − {c:2}.",
    },
  },
  {
    id: "q-4.1.9-3",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 3,
    prompt: "A bull put spread wins about 79% of the time at expiry. Why doesn't that prove an edge?",
    options: [
      { id: "a", label: "79% is too low; an edge needs 90% or more", rationale: "No win rate proves an edge by itself. What matters is the win rate together with the size of wins and losses." },
      { id: "b", label: "Win rates only matter for debit spreads", rationale: "Win rate means the same for any strategy: nothing without the payoffs." },
      { id: "c", label: "Its wins of up to 0.76 against losses of up to 4.24 make the model's expected value about zero" },
      { id: "d", label: "Model probabilities are always wrong", rationale: "The model may be imperfect, but the problem here is the payoff sizes, which wipe out the win rate." },
    ],
    correct: "c",
    explanation: "The spread wins about 0.74 on average four times in five and loses about 2.72 on average the fifth: about zero before costs. A high win rate bought with large losses is a payoff shape, not an edge.",
    lesson: "4.1.9",
    concepts: ["vertical-spread", "expectancy"],
    hints: ["Expectancy needs both the win rate and the payoff sizes.", "Compare the most it can win with the most it can lose."],
  },
  {
    id: "q-4.1.10-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "You buy the 30-day 100-strike LABX straddle for 5.72. What is its upper breakeven at expiry?",
    numeric: { answer: 105.72, tolerance: 0.005, unit: "vUSD" },
    explanation: "A long straddle needs LABX to move by its whole cost, either way: 100 + 5.72 = 105.72 above, and 100 − 5.72 = 94.28 below.",
    lesson: "4.1.10",
    concepts: ["long-volatility"],
    hints: ["Only one leg pays at expiry, and it must cover both premiums.", "Strike + total cost."],
    vary: {
      fields: { k: [50, 150, 5], c: [1, 12, 0.01] },
      answer: "k + c",
      prompt: "You buy the 30-day {k}-strike LABX straddle for {c:2}. What is its upper breakeven at expiry?",
      explanation: "A long straddle needs LABX to move by its whole cost, either way: {k} + {c:2} = {answer:2} above, and {k} − {c:2} = {k - c:2} below.",
      hint: "{k} + {c:2}.",
    },
  },
  {
    id: "q-4.1.10-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "You bought a straddle before an event and the big move came, 4%. Why can it still lose?",
    options: [
      { id: "a", label: "Straddles lose whenever direction is guessed", rationale: "A straddle doesn't care about direction. It cares whether the move beats the price paid." },
      { id: "b", label: "The move was smaller than the one already priced in, and implied volatility collapsed after the event" },
      { id: "c", label: "One day of theta ate the gain", rationale: "A day of decay is small. The collapse of implied volatility after the event did most of the damage." },
      { id: "d", label: "The put leg expired worthless, so the trade failed", rationale: "One leg always ends worthless. The question is whether the other covers the whole cost." },
    ],
    correct: "b",
    explanation: "The 6.62 straddle priced a 6.6% move at IV 60%. After the report IV fell to 25%, and a 4% move left it worth 4.35: −2.27. Being right about movement isn't enough; you must beat the implied move.",
    lesson: "4.1.10",
    concepts: ["iv-crush", "long-volatility"],
    hints: ["What did the straddle's price already assume?", "What happens to implied volatility once the news is out?"],
  },
  {
    id: "q-4.1.10-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Strangle or straddle on the same event: what do you gain with the strangle, and what do you give up?",
    options: [
      { id: "a", label: "A higher cost but closer breakevens", rationale: "That describes the straddle: 6.62 with breakevens at 93.38 and 106.62." },
      { id: "b", label: "The same cost, with more vega", rationale: "The strangle is cheaper: 2.80 against 6.62. Out-of-the-money options carry less vega, not more." },
      { id: "c", label: "A lower cost and maximum loss, but LABX must move further to profit" },
      { id: "d", label: "A strangle can't lose more than half its premium", rationale: "If LABX ends between the strikes, both legs expire worthless: the whole 2.80 is lost." },
    ],
    correct: "c",
    explanation: "The 95/105 strangle costs 2.80 against the straddle's 6.62, so less is at risk. But it needs LABX below 92.20 or above 107.80, against 93.38 and 106.62 for the straddle.",
    lesson: "4.1.10",
    concepts: ["long-volatility"],
    hints: ["Out-of-the-money options are cheaper than at-the-money ones.", "Where do the strangle's breakevens sit compared with the straddle's?"],
  },
  {
    id: "q-4.1.11-1",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "What is the volatility risk premium?",
    options: [
      { id: "a", label: "The extra return from buying options before events", rationale: "Event options usually have the premium priced in. Buyers pay it rather than earn it." },
      { id: "b", label: "A fee exchanges charge on volatile days", rationale: "It's not a fee. It's the gap between implied volatility and the volatility that follows." },
      { id: "c", label: "A guaranteed profit from selling options", rationale: "Paid on average, not guaranteed: sellers are paid for bearing rare, large losses like February 2018." },
      { id: "d", label: "The tendency of implied volatility to exceed the volatility that follows, which pays option sellers on average" },
    ],
    correct: "d",
    explanation: "Option buyers pay for insurance. On index options, implied volatility has on average exceeded realised volatility (Carr and Wu, 2009), so sellers collect a premium: the compensation for bearing crash risk.",
    lesson: "4.1.11",
    concepts: ["volatility-risk-premium"],
    hints: ["Compare implied volatility with the volatility that actually followed.", "Who is paid on average, the insurance buyer or the seller?"],
  },
  {
    id: "q-4.1.11-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "An iron condor has wings 5 wide and collects a credit of 1.10. What is its maximum loss per unit?",
    numeric: { answer: 3.9, tolerance: 0.005, unit: "vUSD" },
    explanation: "Only one side can lose at expiry, and at worst it loses the wing width, 5.00, less the total credit kept: 5 − 1.10 = 3.90. A contract risks 39.00.",
    lesson: "4.1.11",
    concepts: ["short-volatility-risk"],
    hints: ["LABX can only end beyond one wing.", "Max loss = wing width − total credit."],
    vary: {
      fields: { w: [2, 10, 1], c: [0.2, 3, 0.05] },
      constraints: ["c < w - 0.5"],
      answer: "w - c",
      prompt: "An iron condor has wings {w} wide and collects a credit of {c:2}. What is its maximum loss per unit?",
      explanation: "Only one side can lose at expiry, and at worst it loses the wing width, {w:2}, less the total credit kept: {w} − {c:2} = {answer:2}. A contract risks {answer * 10:2}.",
      hint: "Wing width − credit: {w} − {c:2}.",
    },
  },
  {
    id: "q-4.1.11-3",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 3,
    prompt: "Why is a high Sharpe ratio no argument for a short-volatility strategy?",
    options: [
      { id: "a", label: "Sharpe ratios can't be computed for options", rationale: "They can be computed for any return series. The trouble is what the Sharpe ratio leaves out." },
      { id: "b", label: "Its smooth returns may not yet include the rare large loss, and Sharpe ignores skew" },
      { id: "c", label: "Short-volatility strategies always have low Sharpe ratios", rationale: "The opposite: steady premiums make the Sharpe look excellent until the tail arrives." },
      { id: "d", label: "A high Sharpe means too little risk was taken", rationale: "A high Sharpe can hide large risk. Short volatility's risk sits in a tail the sample may not contain." },
    ],
    correct: "b",
    explanation: "The Sharpe ratio uses the average and the standard deviation of returns. A record of small steady gains can miss the rare crash entirely, so the ratio looks best just before the loss. Judge by stress loss and Expected Shortfall instead.",
    lesson: "4.1.11",
    concepts: ["short-volatility-risk", "sharpe-ratio"],
    hints: ["What does the Sharpe ratio measure, and what does it ignore?", "What happens to the ratio before the first big loss?"],
  },
];

// ─── Terms and concepts introduced in 4.1 ──────────────────────────────────

const TERMS: GlossaryTerm[] = [
  // 4.1.1
  {
    id: "option",
    term: "Option",
    definition: "A contract that gives its buyer the right, but not the obligation, to buy or sell an underlying asset at a set price on or before a set date. The buyer pays a premium; the seller takes on the obligation.",
    plain: "A contract giving the buyer a right, but not an obligation, to trade an asset at a set price.",
    related: ["call-option", "put-option", "strike-price", "option-premium", "derivative"],
    lesson: "4.1.1",
  },
  {
    id: "call-option",
    term: "Call option",
    definition: "An option that gives its holder the right to buy the underlying at the strike price, on or before expiry.",
    plain: "The right to buy the underlying at the strike price until or at expiry.",
    related: ["option", "put-option", "strike-price"],
    lesson: "4.1.1",
    aka: ["call"],
  },
  {
    id: "put-option",
    term: "Put option",
    definition: "An option that gives its holder the right to sell the underlying at the strike price, on or before expiry.",
    plain: "The right to sell the underlying at the strike price until or at expiry.",
    related: ["option", "call-option", "strike-price"],
    lesson: "4.1.1",
    aka: ["put"],
  },
  {
    id: "strike-price",
    term: "Strike price",
    definition: "The fixed price at which an option's holder may buy (call) or sell (put) the underlying.",
    plain: "The price at which an option lets you buy or sell the underlying.",
    related: ["option", "in-the-money", "out-of-the-money"],
    lesson: "4.1.1",
    aka: ["strike", "exercise price"],
  },
  {
    id: "expiration-date",
    term: "Expiration date",
    definition: "The last day on which an option can be exercised. After it, the option is settled or expires worthless.",
    plain: "The last day an option can be exercised; after it, the option is settled or worthless.",
    related: ["option", "time-to-expiry", "time-decay"],
    lesson: "4.1.1",
    aka: ["expiry"],
  },
  {
    id: "option-premium",
    term: "Option premium",
    definition: "The price of an option, paid by the buyer and received by the writer. It equals intrinsic value plus extrinsic value.",
    plain: "The price the option buyer pays and the seller receives.",
    related: ["intrinsic-value", "extrinsic-value", "option-writer"],
    lesson: "4.1.1",
    aka: ["premium"],
  },
  {
    id: "in-the-money",
    term: "In the money",
    definition: "An option with intrinsic value: a call whose strike is below the underlying price, or a put whose strike is above it.",
    plain: "An option with intrinsic value: a call with a strike below the price, a put above it.",
    related: ["at-the-money", "out-of-the-money", "intrinsic-value"],
    lesson: "4.1.1",
    aka: ["ITM"],
  },
  {
    id: "at-the-money",
    term: "At the money",
    definition: "An option whose strike is at, or very near, the current price of the underlying.",
    plain: "An option whose strike is at or very near the current price.",
    related: ["in-the-money", "out-of-the-money"],
    lesson: "4.1.1",
    aka: ["ATM"],
  },
  {
    id: "out-of-the-money",
    term: "Out of the money",
    definition: "An option with no intrinsic value: a call whose strike is above the underlying price, or a put whose strike is below it. Its whole premium is extrinsic value.",
    plain: "An option with no intrinsic value: a call with a strike above the price, a put below it.",
    related: ["in-the-money", "at-the-money", "extrinsic-value"],
    lesson: "4.1.1",
    aka: ["OTM"],
  },
  {
    id: "intrinsic-value",
    term: "Intrinsic value",
    definition: "What an option would be worth if exercised now: max(S − K, 0) for a call, max(K − S, 0) for a put.",
    plain: "What an option would be worth if exercised right now; never below zero.",
    related: ["extrinsic-value", "in-the-money", "option-premium"],
    lesson: "4.1.1",
  },
  {
    id: "extrinsic-value",
    term: "Extrinsic value",
    definition: "The part of an option's premium above its intrinsic value, paid for the time left and the chance of a larger move. It decays to zero at expiry.",
    plain: "The part of the premium above intrinsic value, paid for time and volatility.",
    related: ["intrinsic-value", "time-decay", "option-premium"],
    lesson: "4.1.1",
    aka: ["time value"],
  },
  // 4.1.2
  {
    id: "payoff-diagram",
    term: "Payoff diagram",
    definition: "A chart of a position's profit or loss at expiry across possible prices of the underlying, premiums included.",
    plain: "A chart of a position's profit or loss at expiry across possible prices.",
    related: ["option-breakeven", "option"],
    lesson: "4.1.2",
  },
  {
    id: "option-breakeven",
    term: "Option breakeven",
    definition: "The underlying price at expiry at which an option position neither gains nor loses, premium included: strike plus premium for a long call, strike minus premium for a long put.",
    plain: "The price at expiry where an option position neither gains nor loses, premium included.",
    related: ["payoff-diagram", "option-premium"],
    lesson: "4.1.2",
  },
  {
    id: "option-writer",
    term: "Option writer",
    definition: "The seller of an option, who receives the premium and takes on the obligation to deliver or buy the underlying if assigned.",
    plain: "The seller of an option, who receives the premium and takes on the obligation.",
    related: ["assignment", "option-premium", "option"],
    lesson: "4.1.2",
    aka: ["writer", "option seller"],
  },
  {
    id: "exercise",
    term: "Exercise",
    definition: "The holder's use of an option's right: buying the underlying at the strike with a call, or selling it at the strike with a put.",
    plain: "Using an option's right to buy or sell the underlying at the strike.",
    related: ["assignment", "american-option", "european-option"],
    lesson: "4.1.2",
  },
  {
    id: "assignment",
    term: "Assignment",
    definition: "The notice that obliges an option writer to fulfil the contract after a holder exercises: deliver the underlying at the strike on a call, or buy it on a put.",
    plain: "The notice that obliges an option writer to deliver or take the underlying at the strike.",
    related: ["exercise", "option-writer", "pin-risk"],
    lesson: "4.1.2",
  },
  {
    id: "american-option",
    term: "American option",
    definition: "An option that can be exercised on any day up to and including expiry. Most US stock options are American.",
    plain: "An option that can be exercised on any day up to expiry.",
    related: ["european-option", "exercise"],
    lesson: "4.1.2",
  },
  {
    id: "european-option",
    term: "European option",
    definition: "An option that can be exercised only at expiry, such as cash-settled index options. LABX options are European.",
    plain: "An option that can be exercised only at expiry.",
    related: ["american-option", "exercise"],
    lesson: "4.1.2",
  },
  {
    id: "pin-risk",
    term: "Pin risk",
    definition: "The uncertainty, when the underlying closes at or very near a short option's strike at expiry, about whether you will be assigned.",
    plain: "Not knowing whether you will be assigned when the price ends right at a short option's strike.",
    related: ["assignment", "strike-price"],
    lesson: "4.1.2",
  },
  // 4.1.3
  {
    id: "put-call-parity",
    term: "Put-call parity",
    definition: "The no-arbitrage relation between European calls and puts with the same strike and expiry: C − P = S − K·e^(−rT), without dividends.",
    plain: "The fixed link between call, put, underlying and cash prices that rules out riskless profit.",
    related: ["synthetic-position", "arbitrage", "risk-free-rate"],
    lesson: "4.1.3",
  },
  {
    id: "synthetic-position",
    term: "Synthetic position",
    definition: "A combination of options, the underlying and cash that copies another position's payoff, such as a long call plus a short put copying a long position in the underlying.",
    plain: "A mix of options, underlying and cash that copies another position's payoff.",
    related: ["put-call-parity", "option"],
    lesson: "4.1.3",
  },
  {
    id: "arbitrage",
    term: "Arbitrage",
    definition: "Locking in a riskless profit from prices that are inconsistent with each other. In liquid markets such gaps close almost instantly, and costs usually exceed what's left.",
    plain: "Locking in a riskless profit from inconsistent prices; in liquid markets it disappears almost instantly.",
    related: ["put-call-parity", "spread"],
    lesson: "4.1.3",
  },
  {
    id: "risk-free-rate",
    term: "Risk-free rate",
    definition: "The interest earned on cash with no default risk, usually a short-term government rate. In option pricing it discounts the strike paid at expiry.",
    plain: "The interest earned on cash with no default risk; one input to option prices.",
    related: ["put-call-parity", "black-scholes"],
    lesson: "4.1.3",
  },
  {
    id: "cash-secured-put",
    term: "Cash-secured put",
    definition: "A short put held with enough cash to buy the underlying at the strike if assigned. By put-call parity its payoff equals a covered call's.",
    plain: "Selling a put while holding enough cash to buy the underlying if assigned.",
    related: ["covered-call", "put-call-parity", "put-option"],
    lesson: "4.1.3",
  },
  // 4.1.4
  {
    id: "black-scholes",
    term: "Black–Scholes model",
    definition: "A formula that prices European options from the underlying price, strike, time to expiry, volatility and interest rate, assuming lognormal prices, constant volatility and no jumps.",
    plain: "A formula that prices European options from price, strike, time, volatility and interest rate.",
    related: ["implied-volatility", "time-to-expiry", "risk-free-rate"],
    lesson: "4.1.4",
    aka: ["Black–Scholes–Merton"],
  },
  {
    id: "time-to-expiry",
    term: "Time to expiry",
    definition: "The time left until an option expires, written T and measured in years in pricing formulas: 30 days is 30 ÷ 365 = 0.0822.",
    plain: "The time left until an option expires, measured in years in pricing formulas.",
    related: ["expiration-date", "time-decay", "black-scholes"],
    lesson: "4.1.4",
  },
  // 4.1.5
  {
    id: "greeks",
    term: "Greeks",
    definition: "Sensitivities of an option's price to its inputs: delta and gamma to the underlying price, theta to time, vega to implied volatility and rho to interest rates.",
    plain: "Measures of how an option's price reacts to changes in price, time, volatility and rates.",
    related: ["delta", "gamma", "theta", "vega", "rho"],
    lesson: "4.1.5",
  },
  {
    id: "delta",
    term: "Delta",
    definition: "The change in an option's price for a one-unit move in the underlying: 0 to 1 for calls, −1 to 0 for puts. It is also the hedge ratio.",
    plain: "How much an option's price changes when the underlying moves by one unit.",
    related: ["gamma", "hedge-ratio", "delta-neutral", "greeks"],
    lesson: "4.1.5",
    aka: ["Δ"],
  },
  {
    id: "gamma",
    term: "Gamma",
    definition: "The change in an option's delta for a one-unit move in the underlying. It is largest for at-the-money options close to expiry.",
    plain: "How much delta changes when the underlying moves by one unit.",
    related: ["delta", "theta", "greeks"],
    lesson: "4.1.5",
    aka: ["Γ"],
  },
  {
    id: "delta-neutral",
    term: "Delta neutral",
    definition: "A position whose combined delta is zero, so its value barely changes for small moves in the underlying.",
    plain: "A position whose value barely changes for small moves in the underlying.",
    related: ["delta", "delta-hedging"],
    lesson: "4.1.5",
  },
  {
    id: "delta-hedging",
    term: "Delta hedging",
    definition: "Trading the underlying to bring an options position's delta to zero, and adjusting as delta changes with the price.",
    plain: "Trading the underlying to keep an options position delta neutral as prices move.",
    related: ["delta-neutral", "hedge-ratio", "gamma-scalping"],
    lesson: "4.1.5",
  },
  {
    id: "0dte-option",
    term: "0DTE option",
    definition: "An option traded on its expiration day, with zero days to expiry. With almost no time left, its gamma is extreme and its price swings violently.",
    plain: "An option that expires on the same day it is traded; its price swings violently.",
    related: ["gamma", "time-decay"],
    lesson: "4.1.5",
    aka: ["zero days to expiry"],
  },
  // 4.1.6
  {
    id: "theta",
    term: "Theta",
    definition: "The change in an option's price as one day passes, all else equal. Negative for long options, positive for short ones.",
    plain: "How much value an option loses per day as time passes.",
    related: ["time-decay", "gamma", "greeks"],
    lesson: "4.1.6",
    aka: ["Θ"],
  },
  {
    id: "vega",
    term: "Vega",
    definition: "The change in an option's price for a one-point change in implied volatility. Largest for at-the-money, long-dated options.",
    plain: "How much an option's price changes when implied volatility moves one percentage point.",
    related: ["implied-volatility", "greeks"],
    lesson: "4.1.6",
    aka: ["ν"],
  },
  {
    id: "rho",
    term: "Rho",
    definition: "The change in an option's price for a one-percentage-point change in interest rates. It matters mostly for long-dated options.",
    plain: "How much an option's price changes when interest rates move one percentage point.",
    related: ["risk-free-rate", "greeks"],
    lesson: "4.1.6",
    aka: ["ρ"],
  },
  {
    id: "time-decay",
    term: "Time decay",
    definition: "The loss of an option's extrinsic value as expiry approaches, measured by theta. It follows the square root of time, so it accelerates in the final weeks.",
    plain: "The loss of an option's extrinsic value as expiry approaches; fastest near the end.",
    related: ["theta", "extrinsic-value"],
    lesson: "4.1.6",
  },
  {
    id: "gamma-scalping",
    term: "Gamma scalping",
    definition: "Repeatedly re-hedging the delta of a long options position, selling the underlying after rises and buying after falls, to earn from price swings against the option's time decay.",
    plain: "Re-hedging a long options position again and again to capture gains from price swings.",
    related: ["delta-hedging", "gamma", "theta"],
    lesson: "4.1.6",
  },
  // 4.1.7
  {
    id: "volatility-skew",
    term: "Volatility skew",
    definition: "Different implied volatilities across the strikes of one expiry. On index and stock options, downside puts usually carry higher implied volatility than calls.",
    plain: "Different implied volatilities across strikes of one expiry, often higher for downside puts.",
    related: ["volatility-smile", "volatility-surface", "implied-volatility"],
    lesson: "4.1.7",
  },
  {
    id: "volatility-smile",
    term: "Volatility smile",
    definition: "A shape of implied volatility across strikes in which both far out-of-the-money puts and far out-of-the-money calls carry more implied volatility than at-the-money options.",
    plain: "A skew where both far-out puts and far-out calls carry higher implied volatility.",
    related: ["volatility-skew", "volatility-surface"],
    lesson: "4.1.7",
  },
  {
    id: "iv-term-structure",
    term: "IV term structure",
    definition: "Implied volatility across expiries for the same underlying. It usually rises with time to expiry in calm markets and inverts in crises.",
    plain: "Implied volatility across expiries; usually rising with time, inverted in crises.",
    related: ["volatility-surface", "implied-volatility", "event-volatility"],
    lesson: "4.1.7",
  },
  {
    id: "volatility-surface",
    term: "Volatility surface",
    definition: "Implied volatility across all strikes and expiries of an underlying, combining the skew and the term structure into one map.",
    plain: "Implied volatility across all strikes and expiries, shown as a single map.",
    related: ["volatility-skew", "iv-term-structure", "implied-volatility"],
    lesson: "4.1.7",
  },
  {
    id: "iv-rank",
    term: "IV rank",
    definition: "Where current implied volatility sits within its range over the past year, from 0 (the low) to 100 (the high). A context tool, not a tested signal.",
    plain: "Where current implied volatility sits within its past year's range; context, not a signal.",
    related: ["implied-volatility"],
    lesson: "4.1.7",
  },
  // 4.1.8
  {
    id: "covered-call",
    term: "Covered call",
    definition: "Owning the underlying and selling a call on it. The premium adds income and a small cushion, but the gain is capped at the strike and almost all of the downside remains.",
    plain: "Owning the underlying and selling a call on it to collect premium, which caps the upside.",
    related: ["call-option", "cash-secured-put", "collar"],
    lesson: "4.1.8",
  },
  {
    id: "protective-put",
    term: "Protective put",
    definition: "Owning the underlying and buying a put on it, which sets a floor on losses at the strike plus the premium, even through gaps.",
    plain: "Owning the underlying and buying a put to set a floor under losses.",
    related: ["put-option", "collar", "gap"],
    lesson: "4.1.8",
  },
  {
    id: "collar",
    term: "Collar",
    definition: "Owning the underlying, buying a put below the price and selling a call above it, often for near-zero net premium, which limits both losses and gains.",
    plain: "Owning the underlying, buying a put and selling a call to limit both losses and gains.",
    related: ["protective-put", "covered-call"],
    lesson: "4.1.8",
  },
  // 4.1.9
  {
    id: "vertical-spread",
    term: "Vertical spread",
    definition: "Buying one option and selling another of the same type and expiry at a different strike. Its maximum gain and maximum loss are both fixed by the strikes and the premium.",
    plain: "Buying one option and selling another of the same type and expiry at a different strike.",
    related: ["debit-spread", "spread-width", "defined-risk"],
    lesson: "4.1.9",
  },
  {
    id: "debit-spread",
    term: "Debit spread",
    definition: "A vertical spread that costs money to open. Its maximum loss is the debit paid; its maximum gain is the spread width minus the debit.",
    plain: "A vertical spread you pay for; the most you can lose is what you paid.",
    related: ["vertical-spread", "spread-width"],
    lesson: "4.1.9",
  },
  {
    id: "spread-width",
    term: "Spread width",
    definition: "The distance between the two strikes of an options spread. It caps what the spread can be worth, and so its maximum gain and loss.",
    plain: "The distance between the two strikes of a spread; it caps gains and losses.",
    related: ["vertical-spread", "debit-spread", "iron-condor"],
    lesson: "4.1.9",
  },
  {
    id: "defined-risk",
    term: "Defined risk",
    definition: "A position whose maximum possible loss is known before entry, such as a long option or a vertical spread, as opposed to a naked short option.",
    plain: "A position whose maximum possible loss is known before you enter.",
    related: ["vertical-spread", "iron-condor"],
    lesson: "4.1.9",
  },
  // 4.1.10
  {
    id: "strangle",
    term: "Strangle",
    definition: "Buying an out-of-the-money call and an out-of-the-money put with the same expiry. It costs less than a straddle but needs a bigger move to profit.",
    plain: "Buying an out-of-the-money call and put; cheaper than a straddle but needs a bigger move.",
    related: ["straddle", "long-volatility"],
    lesson: "4.1.10",
  },
  {
    id: "long-volatility",
    term: "Long volatility",
    definition: "A position that gains when the underlying moves more than options imply, or when implied volatility rises, such as a long straddle or strangle.",
    plain: "A position that profits when prices move more than options imply.",
    related: ["straddle", "strangle", "short-volatility"],
    lesson: "4.1.10",
  },
  {
    id: "event-volatility",
    term: "Event volatility",
    definition: "Extra implied volatility in options that expire just after a scheduled event, such as an earnings report. It collapses once the event passes.",
    plain: "Extra implied volatility priced into options that expire just after a scheduled event.",
    related: ["iv-crush", "implied-move", "iv-term-structure"],
    lesson: "4.1.10",
  },
  // 4.1.11
  {
    id: "volatility-risk-premium",
    term: "Volatility risk premium",
    definition: "The average amount by which implied volatility exceeds the volatility that later occurs. It pays option sellers on average, as compensation for crash risk.",
    plain: "The average gap by which implied volatility exceeds the volatility that later occurs.",
    related: ["implied-volatility", "realised-volatility", "short-volatility"],
    lesson: "4.1.11",
    aka: ["VRP"],
  },
  {
    id: "short-volatility",
    term: "Short volatility",
    definition: "A position that gains when the underlying moves less than options imply, such as a short straddle or iron condor. It earns small, steady amounts and is exposed to sudden spikes.",
    plain: "A position that profits when prices move less than options imply; exposed to sudden spikes.",
    related: ["long-volatility", "iron-condor", "tail-risk"],
    lesson: "4.1.11",
  },
  {
    id: "iron-condor",
    term: "Iron condor",
    definition: "A short out-of-the-money put spread plus a short out-of-the-money call spread on the same expiry: a short strangle with bought wings, so the maximum loss is the wing width minus the credit.",
    plain: "Selling a strangle and buying further-out options as wings, so the maximum loss is capped.",
    related: ["short-volatility", "strangle", "defined-risk"],
    lesson: "4.1.11",
  },
  {
    id: "tail-risk",
    term: "Tail risk",
    definition: "The risk of rare, extreme losses far beyond normal day-to-day moves, the kind a strategy's recent record may not contain.",
    plain: "The risk of rare, extreme losses far beyond normal day-to-day moves.",
    related: ["fat-tails", "tail-event", "short-volatility", "risk-of-ruin"],
    lesson: "4.1.11",
  },
];

const CONCEPTS: Concept[] = [
  {
    id: "option-contract",
    name: "Call and put options",
    category: "market_fundamentals",
    summary: "A contract giving the buyer the right, not the obligation, to buy (call) or sell (put) at a set price until expiry.",
    body: [
      "A call is the right to buy the underlying at the strike price; a put, the right to sell it. The buyer pays a premium for the right and uses it only when it pays. The seller, or writer, collects the premium and takes on the obligation to deliver or buy if assigned.",
      "The buyer can lose at most the premium; that small, fixed cost controlling a whole contract is where options get their leverage. Being right about direction isn't enough: the move must also cover the premium.",
    ],
    example: "A 30-day LABX call with strike 100 costs 2.86, or 28.60 for a 10-unit contract. If LABX ends at 102.00, the call is worth 2.00 and the buyer loses 0.86 a unit despite the rise.",
    related: ["option-moneyness", "option-payoff", "leverage"],
    missions: [],
    lessons: ["4.1.1"],
  },
  {
    id: "option-moneyness",
    name: "Moneyness, intrinsic and extrinsic value",
    category: "market_fundamentals",
    summary: "Whether an option is in, at or out of the money, and how its premium splits into intrinsic and time value.",
    body: [
      "A call is in the money when its strike is below the price, a put when its strike is above it; at the money means the strike is at the price. Only in-the-money options have intrinsic value: max(S − K, 0) for a call, max(K − S, 0) for a put.",
      "Everything in the premium above intrinsic value is extrinsic, or time, value: payment for the chance of a bigger move before expiry. It decays to zero by expiry.",
    ],
    example: "LABX at 100.00, 30 days, IV 25%. The call 95 at 5.97 is 5.00 intrinsic + 0.97 extrinsic. The put 105 at 6.08 is 5.00 + 1.08. The call 105 at 1.08 is out of the money: all 1.08 is extrinsic.",
    related: ["option-contract", "option-pricing-model"],
    missions: [],
    lessons: ["4.1.1"],
  },
  {
    id: "option-payoff",
    name: "Option payoff at expiry",
    category: "risk_management",
    summary: "The profit or loss of an option position at expiry as a function of the underlying price, with its breakevens.",
    body: [
      "Four building blocks: long call, short call, long put, short put. A long option's payoff is its value at expiry minus the premium paid; the short position is the mirror image. Buyers can lose only the premium. Writers keep the premium at best and can lose without limit on a short call, or the strike minus the premium on a short put.",
      "Every option position has a breakeven at expiry: strike plus premium for a long call, strike minus premium for a long put. Compute the maximum loss, the maximum gain and the breakeven before any order.",
    ],
    example: "Strike 100, premium 2.86. Long call: breakeven 102.86, max loss 2.86, max gain unlimited. Long put: breakeven 97.14, max loss 2.86, max gain 97.14. A short put can lose 971.40 on one 10-unit contract.",
    related: ["option-contract", "r-multiple", "exercise-and-assignment"],
    missions: [],
    lessons: ["4.1.2"],
  },
  {
    id: "exercise-and-assignment",
    name: "Exercise and assignment",
    category: "market_fundamentals",
    summary: "The holder using the option's right and the writer being obliged to deliver; American versus European timing.",
    body: [
      "Exercise is the holder using the right: buying at the strike with a call, selling with a put. The exchange then assigns a writer, who must fulfil the contract. American options can be exercised on any day up to expiry; European options only at expiry.",
      "Writers face two practical risks: early assignment on American short calls, typically just before an ex-dividend date, and pin risk when the price closes right at a short strike at expiry.",
    ],
    example: "You wrote a LABX call with strike 100. LABX closes at 104.00 and the holder exercises: you are assigned and must sell 10 units at 100.00 per contract, buying them at 104.00 if you don't own them.",
    related: ["option-contract", "option-payoff"],
    missions: [],
    lessons: ["4.1.2"],
  },
  {
    id: "put-call-parity",
    name: "Put-call parity",
    category: "market_fundamentals",
    summary: "The no-arbitrage link C − P = S − K·e^(−rT) between European calls, puts, the underlying and cash.",
    body: [
      "A long call plus a short put with the same strike and expiry is worth S − K at expiry, the same as owning the underlying financed with a loan of the strike. So their prices today must differ by S − K·e^(−rT). With zero rates and S = K, call and put cost the same.",
      "Parity lets you find a missing price and spot inconsistent quotes. But a small gap is rarely free money: three legs pay spreads and commissions, and liquid markets close gaps in milliseconds.",
    ],
    example: "S = 100, K = 100, T = 0.25, r = 4%: K·e^(−rT) = 99.00, so C − P must be 1.00, and the model gives 4.49 − 3.49. At r = 0, a put quoted at 2.50 against a call at 2.86 locks in 0.36, but costs of 0.25 leave 0.11.",
    related: ["synthetic-position", "trading-costs", "option-pricing-model"],
    missions: [],
    lessons: ["4.1.3"],
  },
  {
    id: "synthetic-position",
    name: "Synthetic positions",
    category: "market_fundamentals",
    summary: "Combinations of options, underlying and cash that replicate another position's payoff, such as a synthetic long.",
    body: [
      "Rearranging put-call parity shows which combinations are the same position in disguise. Long call plus short put is a synthetic long; short call plus long put a synthetic short. Long stock plus a long put copies a long call, and long stock plus a short call copies a short put.",
      "The practical lesson: a covered call and a cash-secured put at the same strike have the same payoff and the same downside. Judge positions by their payoff, not by their labels.",
    ],
    example: "Long the LABX 100-call at 2.86 and short the 100-put at 2.86: at expiry the pair is worth LABX − 100 at every price, from −20.00 at 80 to +20.00 at 120, exactly like owning LABX from 100.",
    related: ["put-call-parity", "covered-call", "option-payoff"],
    missions: [],
    lessons: ["4.1.3"],
  },
  {
    id: "option-pricing-model",
    name: "Option pricing inputs (Black–Scholes)",
    category: "market_fundamentals",
    summary: "How price, strike, time, volatility and rates set an option's value, and where the model's assumptions fail.",
    body: [
      "Black–Scholes prices a European option from the underlying price, the strike, the time to expiry, the volatility and the rate. A call gains with the price, time and volatility, and loses with the strike. Every input is observable except volatility, the one estimate.",
      "Near the money, price ≈ 0.4 × S × σ × √T, so it grows almost in line with σ and with the square root of time. The model assumes constant volatility, lognormal returns and no jumps; real markets have skew, fat tails and gaps, so treat it as a common language for prices, not a description of reality.",
    ],
    example: "LABX 100.00, 30 days, IV 25%: the 100-call is 2.86, and the quick rule gives 2.87. At IV 35% it's 4.00; with 7 days left, 1.38; at IV 50%, or with 120 days, 5.71.",
    related: ["volatility", "fat-tails", "gap-risk", "implied-volatility"],
    missions: [],
    lessons: ["4.1.4"],
  },
  {
    id: "option-delta",
    name: "Delta",
    category: "portfolio_exposure",
    summary: "The change in an option's price for a one-unit move in the underlying; also its hedge ratio.",
    body: [
      "Calls have delta between 0 and 1, puts between −1 and 0; at the money they sit near ±0.5, deep in the money near ±1. A position's delta is contracts × units per contract × delta: the number of units of the underlying it behaves like.",
      "Delta is also the hedge ratio, and roughly the chance of ending in the money. It changes as the price moves, which is gamma's job to describe.",
    ],
    example: "LABX 100.00, 30 days, IV 25%: call deltas 0.93, 0.77, 0.51, 0.26 and 0.10 for strikes 90 to 110. Ten contracts of the 100-call behave like 100 × 0.514 = 51 LABX.",
    related: ["option-gamma", "delta-hedging", "exposure"],
    missions: [],
    lessons: ["4.1.5"],
  },
  {
    id: "option-gamma",
    name: "Gamma",
    category: "portfolio_exposure",
    summary: "The change in delta for a one-unit move in the underlying; largest at the money near expiry.",
    body: [
      "Gamma bends the option's price curve: a long option gains more on the way up and loses less on the way down than delta alone says. Price change ≈ delta × move + ½ × gamma × move².",
      "Gamma peaks at the money and grows as expiry approaches, because a small move then decides whether the option ends worth something or nothing. That's why same-day options swing so violently, for buyers and for sellers.",
    ],
    example: "The LABX 100-call: delta 0.514, gamma 0.056 with 30 days left. A 1.00 rise adds 0.514 + 0.028 = 0.54, from 2.86 to 3.40. With one day left, gamma is 0.30, 5.5 times higher.",
    related: ["option-delta", "option-theta", "gamma-theta-tradeoff"],
    missions: [],
    lessons: ["4.1.5"],
  },
  {
    id: "delta-hedging",
    name: "Delta hedging",
    category: "portfolio_exposure",
    summary: "Offsetting an options position's delta with the underlying so small price moves leave the combined value flat.",
    body: [
      "To hedge, trade the underlying against the position's delta: sell short what a long call position behaves like, or buy what a long put position is short. The combined position is delta neutral, so its result comes from volatility and time rather than from direction.",
      "Neutral doesn't stay neutral. Gamma changes the options' delta as the price moves, so the hedge must be adjusted. A long-gamma position gets longer as the price rises and shorter as it falls.",
    ],
    example: "Long 10 LABX 100-calls, delta 0.514: position delta 51.4, so short 51 LABX. After a 3.00 rise the calls' delta is 0.67: 67 against the short 51, net +16, and the hedge needs re-setting.",
    related: ["option-delta", "option-gamma", "gamma-theta-tradeoff"],
    missions: [],
    lessons: ["4.1.5"],
  },
  {
    id: "option-theta",
    name: "Theta",
    category: "scenario_analysis",
    summary: "The value an option loses per day as time passes, all else equal.",
    body: [
      "Long options pay theta every day; writers collect it. Time decay follows the square root of time, so an at-the-money option loses value slowly at first and fast in its final weeks.",
      "Positive theta is not free income: it is the payment for being short gamma, and it comes with losses on large moves.",
    ],
    example: "The LABX 100-call at IV 25% loses 0.048 a day with 30 days left, 0.099 with 7 days and 0.261 with 1 day: more than five times the 30-day rate.",
    related: ["option-gamma", "option-vega", "gamma-theta-tradeoff"],
    missions: [],
    lessons: ["4.1.6"],
  },
  {
    id: "option-vega",
    name: "Vega",
    category: "scenario_analysis",
    summary: "The change in an option's price for a one-point change in implied volatility.",
    body: [
      "Vega is largest for at-the-money options with a long time to expiry and small near expiry. A position can gain on direction and still lose if implied volatility falls, as it does after an event.",
      "A day's option P&L splits into delta, gamma, theta and vega terms: dV ≈ Δ·dS + ½·Γ·dS² + Θ·dt + ν·dσ. Reading it this way shows where a result came from.",
    ],
    example: "The 30-day LABX 100-call has vega 0.114. LABX up 2.00 and IV down 3 points in a day: 1.03 + 0.11 − 0.05 − 0.34 = +0.75, against +1.03 from delta alone. Full repricing: +0.77.",
    related: ["option-theta", "implied-volatility", "iv-crush"],
    missions: [],
    lessons: ["4.1.6"],
  },
  {
    id: "gamma-theta-tradeoff",
    name: "Gamma–theta trade-off",
    category: "scenario_analysis",
    summary: "Long options pay time decay to own gamma and profit only if realised volatility exceeds implied volatility.",
    body: [
      "A delta-hedged long option earns about ½ × gamma × move² each day and pays theta. The two balance at a daily move equal to the move implied by the option's volatility, S × σ ÷ √365.",
      "So a hedged option buyer wins when the underlying moves more than implied, and the seller wins when it moves less. Owning an option is a bet on realised against implied volatility, not just on direction.",
    ],
    example: "The 30-day LABX 100-call: gamma 0.056, theta −0.048. Break-even daily move √(2 × 0.048 ÷ 0.056) = 1.31, the same as 100 × 0.25 ÷ 19.1. At 15% realised, about 0.79 a day, the hedged position loses about 0.03 a day.",
    related: ["option-gamma", "option-theta", "delta-hedging", "implied-volatility"],
    missions: [],
    lessons: ["4.1.6"],
  },
  {
    id: "implied-volatility",
    name: "Implied volatility",
    category: "scenario_analysis",
    summary: "The volatility that makes a pricing model match an option's market price: the market's forecast plus a premium.",
    body: [
      "Put an option's market price into the model and solve for σ: that is its implied volatility. Options are quoted and compared by it, because it strips out price, strike and time.",
      "It is a forecast with a premium built in. On index options it has, on average, exceeded the volatility that followed, which is why selling options has paid on average, with crash risk attached.",
    ],
    example: "The 30-day LABX 100-call trades at 4.00. At IV 25% the model gives 2.86, with vega 0.114: (4.00 − 2.86) ÷ 0.114 = 10 more points, so the implied volatility is 35%.",
    related: ["volatility-surface", "implied-move", "option-pricing-model", "volatility-risk-premium", "vix"],
    missions: [],
    lessons: ["4.1.7"],
  },
  {
    id: "volatility-surface",
    name: "Volatility surface",
    category: "scenario_analysis",
    summary: "Implied volatility across strikes (skew) and expiries (term structure), including event-driven bumps.",
    body: [
      "Across strikes, index and stock options usually show a skew: downside puts carry higher implied volatility, the price of crash protection. Across expiries, the term structure usually rises in calm markets and inverts in crises.",
      "A scheduled event lifts the first expiry after it most, because the event's move is spread over fewer days. Later expiries carry the same event, diluted.",
    ],
    example: "A fictional LABX surface: 30-day IV 31% at strike 90, 25% at 100, 22% at 110. With an event between day 7 and day 14: 7-day IV 22%, 14-day 37.7%, 30-day 30.4%, 180-day 23.6%.",
    related: ["implied-volatility", "iv-crush", "skewness"],
    missions: [],
    lessons: ["4.1.7"],
  },
  {
    id: "covered-call",
    name: "Covered call",
    category: "risk_management",
    summary: "Long underlying plus a short call: collects premium, caps the upside and keeps nearly all of the downside.",
    body: [
      "Selling a call against stock you own adds the premium to your result and caps your gain at the strike. The premium cushions a fall only by its own size, so almost all of the downside remains.",
      "By put-call parity, a covered call has the same payoff as a cash-secured put. It beats the stock in a range, lags it in a strong rally and loses nearly as much in a crash.",
    ],
    example: "LABX bought at 100.00, call 105 sold at 1.08: max gain 6.08, max loss 98.92, breakeven 98.92. If LABX ends at 112.00 the stock makes 12.00 and the covered call 6.08; at 80.00, −20.00 against −18.92.",
    related: ["synthetic-position", "protective-put", "option-collar", "market-regime"],
    missions: [],
    lessons: ["4.1.8"],
  },
  {
    id: "protective-put",
    name: "Protective put",
    category: "risk_management",
    summary: "Long underlying plus a long put: a paid floor on losses that also holds through gaps.",
    body: [
      "A put lets you sell at its strike however far the price falls, so the loss is fixed at the distance to the strike plus the premium. Unlike a stop-loss, it doesn't depend on a fill, so it holds through overnight gaps and events.",
      "The cost is the premium, spent whether or not the floor is needed. In calm markets that is a steady drag.",
    ],
    example: "LABX bought at 100.00 with the put 95 at 0.97: max loss 5.97, breakeven 100.97. LABX gaps to 88.00: the stop at 95 fills near 88 for about −12.00, the put holds the loss at −5.97.",
    related: ["gap-risk", "stop-loss-order", "option-collar"],
    missions: ["M07"],
    lessons: ["4.1.8"],
  },
  {
    id: "option-collar",
    name: "Collar",
    category: "risk_management",
    summary: "Long underlying, long put and short call: a capped range of outcomes, often at near-zero net cost.",
    body: [
      "A collar buys a put below the price and pays for it by selling a call above it. The result is a band: losses floored at the put, gains capped at the call, for little or no net premium.",
      "It suits holding a position you must keep while accepting a cap. A strong rally is where it costs most.",
    ],
    example: "LABX at 100.00, put 95 bought at 0.97, call 105 sold at 1.08: a net credit of 0.11. Max loss 5.00 − 0.11 = 4.89, max gain 5.00 + 0.11 = 5.11, breakeven 99.89.",
    related: ["protective-put", "covered-call"],
    missions: [],
    lessons: ["4.1.8"],
  },
  {
    id: "vertical-spread",
    name: "Vertical spreads",
    category: "risk_management",
    summary: "Buying and selling options of the same type and expiry at two strikes, with defined maximum gain and loss.",
    body: [
      "A debit spread costs money: its maximum loss is the debit and its maximum gain the width minus the debit. A credit spread pays you: its maximum gain is the credit and its maximum loss the width minus the credit. The short leg also cuts vega and theta.",
      "Credit spreads win often and lose big; in the model their expected value is about zero before costs. Judge them by expectancy, and size them from the defined maximum loss.",
    ],
    example: "Bull call 100/105: debit 1.78, max gain 3.22, breakeven 101.78; at 1% risk, 100.00 ÷ 17.80 = 5 contracts. Bull put 95/90: credit 0.76, max loss 4.24, wins about 79% of the time, expected value about zero.",
    related: ["expectancy", "reward-to-risk", "position-sizing"],
    missions: ["M05"],
    lessons: ["4.1.9"],
  },
  {
    id: "long-volatility",
    name: "Long volatility (straddles and strangles)",
    category: "decision_making",
    summary: "Owning options on both sides to profit from a move larger than the one already priced in.",
    body: [
      "A long straddle buys the at-the-money call and put; a long strangle buys an out-of-the-money call and put. Both lose at most their cost and profit from a large move either way. The strangle is cheaper but needs a bigger move.",
      "Before events, implied volatility already prices the move, and it collapses afterwards. Buy movement only when your expected move, from evidence, beats the implied move; otherwise the honest choice is no trade.",
    ],
    example: "Event tomorrow, 7-day options at IV 60%: straddle 6.62, breakevens 93.38 and 106.62; strangle 95/105 at 2.80, breakevens 92.20 and 107.80. After the event IV falls to 25%: a 4% move leaves the straddle at 4.35, −2.27.",
    related: ["implied-move", "iv-crush", "news-straddle"],
    missions: ["M10"],
    lessons: ["4.1.10"],
  },
  {
    id: "volatility-risk-premium",
    name: "Volatility risk premium",
    category: "risk_management",
    summary: "The tendency of implied volatility to exceed later realised volatility, which pays option sellers on average.",
    body: [
      "Option buyers pay for insurance. On stock indexes, implied volatility has on average exceeded the volatility that followed: Carr and Wu (2009) find strongly negative variance risk premiums. The evidence for the premium is strong (grade A).",
      "The premium is payment for crash risk, and it is collected as many small gains and given back in rare, very large losses. In February 2018 the VIX rose from 17.31 to 37.32 in one session.",
    ],
    example: "Selling the 30-day LABX straddle collects 5.72 and wins if LABX ends between 94.28 and 105.72. A −25% gap costs 19.28 a unit, 192.80 a contract: years of small premiums can go in one move.",
    related: ["implied-volatility", "short-volatility-risk", "sharpe-ratio", "vix"],
    missions: [],
    lessons: ["4.1.11"],
  },
  {
    id: "short-volatility-risk",
    name: "Short-volatility tail risk",
    category: "risk_management",
    summary: "Selling options earns small, steady gains with rare, very large losses, so size comes from stress, not premium.",
    body: [
      "Short straddles and strangles have open-ended losses; an iron condor buys wings to cap them. Either way, the return series looks smooth until the tail arrives, so its Sharpe ratio flatters it.",
      "Size from a stress scenario you choose in advance, such as a −25% gap, never from the premium collected. Defined-risk structures make that sum exact.",
    ],
    example: "Iron condor 90/95/105/110 for 1.52: max loss 3.48 a unit, 34.80 a contract, so 2 contracts at a 100.00 budget. A short straddle has no maximum: −92.80 a contract in a −15% gap, −192.80 in a −25% gap.",
    related: ["volatility-risk-premium", "fat-tails", "skewness", "tail-event", "risk-of-ruin"],
    missions: [],
    lessons: ["4.1.11"],
  },
];

export const UNIT_4_1: UnitContent = {
  intro: {
    summary: "Level 3 ended with 3.14's futures, crypto and bonds, where one rate surprise reached options too. Level 4 opens with options as risk contracts, not lottery tickets: payoffs and parity, what sets the price, the Greeks and implied volatility, then structures, each with its maximum loss, maximum gain, breakeven and the regime where it fits.",
    outcomes: [
      "Compute an option's breakeven, maximum loss and maximum gain at expiry before you place the order.",
      "Price a missing option with put-call parity, build a synthetic position, and check the gap after costs.",
      "Estimate a day's option P&L from delta, gamma, theta and vega, and hedge the delta in LABX.",
      "Read implied volatility, skew and the implied move, and buy movement only when your expected move beats it.",
      "Choose a defined-risk structure for the regime, or no trade, and size it from its maximum or stress loss.",
    ],
    buildsOn: "Risk, R and leverage (1.4.1, 1.4.7); ATR and volatility (2.4.6); regimes (2.8.1); event straddles (3.7.6); implied move and IV crush (3.8.7); the VIX (3.9.3); fat tails and √time (3.10.1, 3.10.2); risk of ruin (3.12.5); futures expiry (3.14.2).",
  },
  lessons: [L_4_1_1, L_4_1_2, L_4_1_3, L_4_1_4, L_4_1_5, L_4_1_6, L_4_1_7, L_4_1_8, L_4_1_9, L_4_1_10, L_4_1_11],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
