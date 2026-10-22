import type { CandleData, Concept, GlossaryTerm, Lesson, Question, TaskData, UnitContent } from "../../types";

/**
 * Unit 3.11 · Backtesting and system design (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce.
 * Every simulated figure comes from seeded runs of a small bar-by-bar backtester (long only, daily bars, 12 sub-steps per bar):
 * - The course system: buy at the next open after a close above the 20-bar high, while the 50-bar average is above its value
 *   10 bars earlier; stop 1 ATR(14) below the entry; exit at +2R, at the stop, or at the close of the 10th bar. Results in R.
 * - Costs per round trip and unit: spread 0.10 plus 0.05% of each fill, subtracted in R; stops and targets trigger on mid prices.
 * - The reference series: LABX, ten synthetic years (2,520 bars) of the trending regime R1, seed 2130. R0 controls are random walks.
 * - Monte Carlo: the reference trade list, 40 trades at +2.5R and 60 at −1R; 10,000 reshuffles, 1,000 bootstrap paths.
 */

const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });
/** One candle per step of a series: open = previous value, close = this value. */
const pathCandles = (path: number[]): CandleData[] => path.slice(1).map((v, i) => k(path[i], Math.max(path[i], v), Math.min(path[i], v), v));
/** Flat candles that only set the time axis of a line chart (candles hidden). */
const slots = (values: number[]): CandleData[] => values.map((v) => k(v, v, v, v));

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
}
const cardSort = (options: SortOption[], cards: SortCard[]): TaskData => ({
  options: options.map(({ id, label }) => ({ id, label })),
  cards: cards.map((c) => ({
    id: c.id,
    text: c.text,
    answer: c.answer,
    correct: c.correct,
    rationales: Object.fromEntries(options.filter((o) => o.id !== c.answer).map((o) => [o.id, `${o.what} ${c.clue}`])),
  })),
});

/** 3.11.2: a breakout, its next-bar fill, a bar that holds both stop and target, and a limit that is only touched. */
const FILLS: CandleData[] = [
  k(100.0, 100.6, 99.7, 100.3),
  k(100.3, 100.8, 100.0, 100.5),
  k(100.5, 100.9, 100.2, 100.4),
  k(100.4, 101.6, 100.3, 101.5),
  k(101.8, 102.2, 101.4, 101.9),
  k(101.9, 103.9, 100.7, 102.5),
  k(102.5, 104.0, 102.3, 103.6),
  k(103.6, 103.9, 103.1, 103.4),
];

/** 3.11.4: cumulative R of the course system with lookback 22: 64 in-sample trades (7 years), then 24 out-of-sample trades (3 years). */
const CURVE = [
  0, 1.86, 3.73, 2.6, 4.44, 3.28, 2.14, 0.98, -0.15, 1.71, 0.57, 2.42, 1.28, 0.13, 1.99, 0.85, 2.72, 2.84, 1.69, 3.56, 2.44, 4.31, 6.18, 8.04, 9.92, 8.8, 7.69, 6.58, 5.47, 4.36,
  6.25, 5.15, 4.03, 2.92, 1.8, 0.7, 2.58, 1.47, 3.37, 2.26, 1.16, 0.07, -0.68, 1.22, 3.12, 5.01, 5.54, 7.43, 9.32, 11.21, 10.1, 9, 7.89, 6.79, 7.61, 9.51, 8.41, 7.32, 9.23, 8.13,
  10.03, 11.94, 10.85, 9.76, 10.4, 9.31, 8.22, 7.12, 6.01, 4.89, 6.79, 5.68, 7.58, 6.49, 8.39, 10.29, 9.21, 11.11, 10, 8.88, 10.77, 12.65, 12.57, 11.47, 10.38, 12.28, 11.17, 13.07,
  11.97,
];
const CURVE_CANDLES = pathCandles(CURVE);

/** 3.11.5: pooled expectancy (R a trade) over 120 seeded R1 series, as filters are added one at a time by in-sample result. */
const FIT_IS = [0.12, 0.4, 0.54, 0.64, 0.71, 0.74, 0.76, 0.79, 0.81];
const FIT_OOS = [0.08, 0.1, 0.12, 0.14, 0.11, 0.1, 0.1, 0.08, 0.07];

/** 3.11.7: cumulative R at trades 0, 10, …, 100. Bootstrap percentiles of 1,000 paths, and the one backtest (worst drawdown 7R). */
const FAN_P5 = [0, -3, -6, -5.5, -1.5, -1, 3, 3.5, 4, 8, 12];
const FAN_P50 = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40];
const FAN_P95 = [0, 14.5, 22, 26, 33.5, 41, 48.5, 52.5, 56.5, 64, 68];
const FAN_BACKTEST = [0, 4, 8, 12, 19.5, 23.5, 27.5, 31.5, 35.5, 36, 40];

/** 3.11.8: net expectancy (R a trade) of the course system over ten years, by lookback in 10% steps. */
const LOOKBACKS = [10, 11, 12, 13, 15, 16, 18, 19, 21, 24, 26, 29, 31, 35, 38, 42, 46, 51, 56, 61];
const SWEEP = [0.053, 0.025, 0.047, 0.04, 0.114, 0.127, 0.127, 0.127, 0.122, 0.179, 0.154, 0.103, 0.103, 0.116, 0.147, 0.086, 0.086, 0.086, 0.086, 0.102];

/** 3.11.9: edge ratio by holding time (1, 2, 3, 5, 7, 10, 15, 20 bars): the course system's 212 signals and 2,000 random entries. */
const E_SYSTEM = [1.26, 1.36, 1.39, 1.45, 1.42, 1.44, 1.44, 1.33];
const E_RANDOM = [1.11, 1.19, 1.22, 1.22, 1.22, 1.26, 1.3, 1.32];

// ─── 3.11.1 · From hypothesis to rules ─────────────────────────────────────

const RULE_CARDS = cardSort(
  [
    { id: "codified", label: "Codified", what: "Codified means a number, a level or a yes-or-no test that anyone reads the same way." },
    { id: "vague", label: "Vague", what: "Vague means two people, or code, could read it differently." },
    { id: "future", label: "Uses the future", what: "Using the future means the line needs a fact that isn't known at the decision." },
  ],
  [
    { id: "r1", text: "Only trade when the 50-bar average is above its value 10 bars ago.", answer: "codified", correct: "Codified: one number against another, known at the close.", clue: "Here both averages are known at the decision, and anyone computes the same answer." },
    { id: "r2", text: "Only take strong breakouts.", answer: "vague", correct: "Vague: 'strong' needs a number, for example a bar range above 1.2 ATR(14).", clue: "Here 'strong' has no number, so each reader picks their own." },
    { id: "r3", text: "Signal: the close is above the highest high of the previous 20 bars.", answer: "codified", correct: "Codified: a fixed lookback and a fixed comparison.", clue: "Here the lookback and the comparison are fixed, and all of it is known at the close." },
    { id: "r4", text: "Entry: buy at the low of the breakout day.", answer: "future", correct: "Uses the future: the day's low is known only when the day ends.", clue: "Here the day's low is known only after the close, too late to buy at it." },
    { id: "r5", text: "Stop: below the recent swing low.", answer: "vague", correct: "Vague: which swing, and how far below? Two readers place two stops.", clue: "Here 'recent' and 'below' have no numbers." },
    { id: "r6", text: "Stop: 1 × ATR(14) below the entry price.", answer: "codified", correct: "Codified: a fixed distance from a known price.", clue: "Here the distance is a number and the entry is known when the order is placed." },
    { id: "r7", text: "Skip the trade if the next day closes lower.", answer: "future", correct: "Uses the future: tomorrow's close decides today's trade.", clue: "Here the next day's close isn't known when the trade is taken." },
    { id: "r8", text: "Exit when momentum fades.", answer: "vague", correct: "Vague: 'fades' needs a test, such as a close below the 10-bar low.", clue: "Here 'fades' has no test that two readers would apply alike." },
  ],
);

const L_3_11_1: Lesson = {
  id: "3.11.1",
  title: "From hypothesis to rules",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A testable edge starts as a falsifiable hypothesis that names who is on the other side, then becomes rules exact enough that two people, or code, take the same trades.",
  objectives: [
    "Write a falsifiable edge hypothesis that names who is on the other side.",
    "Turn it into rules precise enough that two people, or code, produce identical trades.",
    "Prepare data that matches the rules, and test in R before any sizing.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "3.11",
    courseId: "3.11.1",
    hook: {
      prompt: "Two traders apply the same rule, 'buy strong breakouts in an uptrend', to the first 40 breakouts in a LABX test. On how many of the 40 do both of them buy?",
      control: {
        kind: "slider",
        min: 0,
        max: 40,
        step: 1,
        start: 20,
        answer: 13,
        tolerance: 3,
        feedback: [
          { from: 30, to: 40, text: "Same words, different readings. 'Strong' and 'uptrend' have no numbers, so each trader supplies their own." },
          { from: 0, to: 5, text: "Their readings overlap more than that: both look for big bars in rising markets." },
        ],
      },
      compare: "You answered {yours}. Trader A read 'strong' as a range over 1.2 ATR and 'uptrend' as a close above the 50-bar average: 18 buys. Trader B read a close in the bar's top quarter and the 20-bar average above the 50-bar: 20 buys. Only 13 matched.",
      concept: "codified-rules",
    },
    learn: [
      {
        kind: "explain",
        title: "The hypothesis card",
        text: "An [[edge-hypothesis]] fills a template: because [mechanism], when [condition], price tends to [effect] over [horizon] in [market]. The other side is [who], because [why]. Example: after volatility contracts, breakouts in the trend's direction continue more often than chance, because stops cluster beyond the range. The other side: traders whose stops get run.",
      },
      {
        kind: "match",
        title: "Can a test prove it wrong?",
        prompt: "Sort each hypothesis: could some result count against it?",
        pairs: [
          { left: "After a 20-bar breakout with a rising 50-bar average, +2R comes before −1R in over 40% of trades within 10 bars.", right: "Falsifiable" },
          { left: "Price respects key levels whenever smart money defends them.", right: "Not falsifiable", wrong: "Any failed level can be blamed on smart money not defending it, so no result counts against it." },
          { left: "When Friday closes down, LABX's Monday closes above its own open more than 55% of the time, over 500 Mondays.", right: "Falsifiable" },
          { left: "Markets move in waves, though the count can be revised as new prices arrive.", right: "Not falsifiable", wrong: "A count revised after the fact fits any path. A claim that adapts to every outcome can't be wrong." },
        ],
        columns: ["Hypothesis", "Verdict"],
        correct: "Right. The testable two name an event, an outcome, a horizon and a threshold. The others explain any result after the fact.",
        concept: "falsifiability",
      },
      {
        kind: "order",
        title: "The parts of a rule",
        prompt: "Put the parts of a codified rule in the order a trade meets them.",
        items: [
          "Condition: when the setup is allowed, such as the 50-bar average rising",
          "Trigger: the exact event that creates the order",
          "Stop: where the idea is wrong, as a price or a distance",
          "Exit: a target, a time limit or a trailing rule",
          "Size: a fixed 1R per trade while testing",
        ],
        explain: "Each part is a number or a yes-or-no test that uses only data known at the decision. Size stays fixed at 1R until the signal has been judged on its own.",
        concept: "codified-rules",
      },
      {
        kind: "explain",
        title: "Data that match the rules",
        text: "The data must fit the rules. Use prices adjusted for splits and dividends, [[point-in-time-data]] for anything revised later, continuous contracts for futures, one time zone for every bar, and the bid or ask where the fill happens. A split left unadjusted shows a crash or a breakout that no one could have traded.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Test in R first, with a fixed 1R per trade. Compounding and sizing can hide a weak edge or flatter it, so they come later (3.12). And your [[research-log]] starts now: every run from here on counts as a trial, including the ones you throw away.",
      },
      {
        kind: "fields",
        title: "Your first research-log entry",
        prompt: "Write the entry before any test runs: the idea first, the data second. From here on, every run counts as a trial.",
        fields: [
          { id: "hypothesis", label: "Hypothesis: mechanism, condition, effect, horizon", kind: "text", default: "", placeholder: "e.g. After volatility contracts, 20-bar breakouts with the trend reach +2R before −1R more often than chance, within 10 bars", required: true },
          { id: "otherSide", label: "Who is on the other side, and why", kind: "text", default: "", placeholder: "e.g. Traders whose stops sit just beyond the range", required: true },
          { id: "prior", label: "Your prior: how likely is it to hold up?", kind: "text", default: "", placeholder: "e.g. Low: most simple breakout edges don't survive costs", required: true },
          { id: "data", label: "Data and regime", kind: "text", default: "", placeholder: "e.g. LABX daily, adjusted prices, trending regime R1, with R0 as control", required: true },
        ],
        correct: "Logged as trial 0. Every run, tweak and extra look from here on adds one.",
        concept: "research-log",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: RULE_CARDS,
      goal: "Eight lines from a draft rule. Sort each: codified (anyone reads it the same way), vague (two readers could differ), or uses the future (needs a fact not known at the decision).",
      success: { field: "solved", eq: 8 },
      correct: "Sorted. The three codified lines, plus an exit at +2R or after 10 bars, make the course system for this unit.",
      hints: ["Ask of each line: could two people, or code, read it differently?", "Every input must be known at the decision. A day's low or close isn't known until the day ends."],
      showMe: { solved: 8 },
      concept: "codified-rules",
    },
    check: ["q-3.11.1-1", "q-3.11.1-2", "q-3.11.1-3"],
    recap: {
      takeaways: [
        "A hypothesis names mechanism, condition, effect, horizon and who loses to you, and can be proved wrong.",
        "Codified rules give anyone the same trades: condition, trigger, stop, exit, and a fixed 1R size.",
        "Use adjusted, point-in-time data, judge the signal in R first, and log every run.",
      ],
    },
  },
};

// ─── 3.11.2 · Fills and costs in a backtest ─────────────────────────────────

const L_3_11_2: Lesson = {
  id: "3.11.2",
  title: "Fills and costs in a backtest",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Conservative fill rules and every cost expressed in R turn a flattering backtest into an honest one; the breakeven cost shows how much room the edge has.",
  objectives: [
    "Choose conservative fill rules: next-bar execution, stop first when stop and target share a bar, limits filled only when price trades through.",
    "Express every cost as a fraction of R and subtract it from gross expectancy.",
    "Find a strategy's breakeven cost and compare it with the costs you will actually pay.",
  ],
  blocks: [],
  practice: [
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
  ],
  script: {
    unit: "3.11",
    courseId: "3.11.2",
    hook: {
      prompt: "A LABX strategy earns +0.15R a trade before costs. Its stop is 2.00 away, and spread plus commissions cost 0.20 per unit. What's left per trade?",
      control: {
        kind: "slider",
        min: -0.2,
        max: 0.2,
        step: 0.01,
        unit: "R",
        start: 0.15,
        answer: 0.05,
        tolerance: 0.01,
        feedback: [
          { from: 0.12, to: 0.2, text: "That's about the gross figure. Costs come off every trade: 0.20 ÷ 2.00 = 0.10R." },
          { from: -0.2, to: -0.01, text: "Costs take 0.10R here, less than the 0.15R edge, so something positive is left." },
        ],
      },
      compare: "You answered {yours}. Costs are 0.20 ÷ 2.00 = 0.10R a trade, so +0.15R − 0.10R = +0.05R: two thirds of the edge gone.",
      concept: "breakeven-cost",
    },
    learn: [
      {
        kind: "worked",
        title: "Costs in R",
        lines: [
          "Spread 0.10, plus 0.05% commission at 100.00 on entry and exit: 0.10 + 0.05 + 0.05 = 0.20 per unit.",
          "Stop 2.00 away: 0.20 ÷ 2.00 = 0.10R a trade.",
          "Same costs, stop 0.50 away: 0.20 ÷ 0.50 = ?",
        ],
        ask: {
          answer: 0.4,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 0.1, text: "That's the 2.00 stop. A quarter of the distance makes the same costs four times bigger in R." },
            { value: 2.5, text: "That divides the stop by the costs. Costs go on top: 0.20 ÷ 0.50." },
          ],
          correct: "Right. 0.40R: a tight stop pays four times as much of every R in costs.",
        },
        after: "Net expectancy = gross expectancy − costs in R. Make this subtraction in every backtest.",
        concept: "costs-in-r",
      },
      {
        kind: "worked",
        title: "The breakeven cost",
        lines: ["Gross edge +0.15R with a 2.00 stop: 0.15 × 2.00 = 0.30 per unit.", "Costs today: 0.20 per unit.", "Breakeven cost multiple = 0.30 ÷ 0.20 = ?"],
        ask: {
          answer: 1.5,
          tolerance: 0.01,
          unit: "×",
          feedback: [{ value: 0.67, text: "That's costs ÷ edge. The edge goes on top: 0.30 ÷ 0.20." }],
          correct: "Right. 1.5×: if costs rise by half, to 0.30 per unit, the edge is gone.",
        },
        after: "A multiple near 1 leaves no room for a wider spread at the open or slippage on a news day.",
        concept: "breakeven-cost",
      },
      {
        kind: "figure",
        title: "Conservative fills",
        figure: {
          kind: "chart",
          chart: {
            candles: FILLS,
            describe: "Eight LABX candles. Bar 4 closes at 101.50 above the earlier highs; bar 5 opens at 101.80. Bar 6 spans 100.70 to 103.90. Bar 7's high is exactly 104.00.",
          },
          steps: [
            {
              text: "The signal needs bar 4's close, 101.50. The test fills at the next open, 101.80.",
              layers: [
                { kind: "marker", index: 3, at: "close", label: "Signal", role: "accent" },
                { kind: "marker", index: 4, at: "open", label: "Fill 101.80", role: "up" },
              ],
            },
            {
              text: "Stop 100.80, target 103.80. Bar 6 touches both. Assume the stop came first: −1R.",
              layers: [
                { kind: "level", price: 100.8, role: "stop", label: "Stop 100.80" },
                { kind: "level", price: 103.8, role: "target", label: "Target 103.80" },
                { kind: "marker", index: 5, at: "low", label: "Both", role: "down" },
              ],
            },
            {
              text: "A sell limit at 104.00 that the high only touches: count it unfilled.",
              layers: [
                { kind: "level", price: 104, role: "neutral", label: "Limit 104.00" },
                { kind: "marker", index: 6, at: "high", label: "Touch", role: "neutral" },
              ],
            },
            { text: "A large order may fill only in part at a limit. Test the size you will trade." },
          ],
        },
        text: "Each rule picks the worse of two possible fills. Bar data can't show the order of prices inside a bar, or your place in the queue.",
        concept: "fill-assumptions",
      },
      {
        kind: "predict",
        title: "Which fill belongs in the test?",
        prompt: "Your system's signal comes from the daily close. Which fill rule belongs in the backtest?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Buy at that close", feedback: "The close is known only once it prints. Filling at it assumes you acted at a price you couldn't know in time." },
            { id: "b", label: "Buy at the next open" },
            { id: "c", label: "Buy at the day's low after the signal", feedback: "The low is known only after the fact: that's look-ahead, the subject of 3.11.3." },
          ],
          answer: "b",
        },
        reveal: "The next open. On the course system it barely changed the result: +0.255R gross with conservative fills, +0.261R with optimistic ones, because its 1-ATR stop and 2R target never shared a bar. On a tight variant, stop 0.5 ATR, target 1R and a 5-bar exit, 12 trades did. There, optimistic rules gave +0.156R and conservative ones +0.001R.",
        concept: "fill-assumptions",
      },
      {
        kind: "figure",
        title: "The course system after costs",
        figure: {
          kind: "bars",
          bars: [
            { label: "Gross, optimistic fills", value: 0.261, role: "neutral" },
            { label: "Gross, conservative fills", value: 0.255, role: "accent" },
            { label: "Net, 1× costs", value: 0.141, role: "up" },
            { label: "Net, 2× costs", value: 0.027, role: "up" },
            { label: "Net, 3× costs", value: -0.087, role: "down" },
          ],
          unit: "R a trade",
          steps: [
            "Ten synthetic LABX years, 91 trades: +0.255R gross with conservative fills.",
            "Costs average 0.114R a trade, so net +0.141R.",
            "Double the costs: +0.027R. Triple them: −0.087R.",
          ],
        },
        text: "The course system on its reference series: costs of about 0.25 per unit on stops averaging 2.33. They weigh more in R when stops are tight or spreads widen.",
        concept: "breakeven-cost",
      },
      {
        kind: "worked",
        title: "Your breakeven multiple",
        lines: ["The course system: +0.255R gross a trade, conservative fills.", "Costs at today's spread and commission: 0.114R a trade.", "Breakeven cost multiple = 0.255 ÷ 0.114 = ?"],
        ask: {
          answer: 2.24,
          tolerance: 0.05,
          unit: "×",
          feedback: [
            { value: 0.45, text: "That's costs ÷ edge. Put the gross edge on top: 0.255 ÷ 0.114." },
            { value: 0.141, text: "That's the net edge, gross minus costs. The multiple divides gross by costs." },
          ],
          correct: "Right. 2.24×: costs could more than double before this edge is gone.",
        },
        after: "Compare it with the costs you'll really pay. Spreads at the open and on news days can be a multiple of the quiet-hours spread.",
        concept: "breakeven-cost",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Recall the opening range breakout replication from 2.9: about +0.13R gross a trade on one index market, with round-trip costs near 0.1R. After spread and slippage, none of five index markets was distinguishable from zero, and four were negative. A small gross edge is a cost problem first.",
      },
    ],
    check: ["q-3.11.2-1", "q-3.11.2-2", "q-3.11.2-3"],
    recap: {
      takeaways: [
        "Fill at the next bar, take the stop first in shared bars, fill limits only when price trades through.",
        "Costs in R = cost per unit ÷ stop distance. Subtract them from gross expectancy.",
        "Breakeven multiple = gross edge ÷ current costs. Near 1, the edge has no room.",
      ],
    },
  },
};

// ─── 3.11.3 · Look-ahead and survivorship ───────────────────────────────────

const BUG_CARDS = cardSort(
  [
    { id: "lookahead", label: "Look-ahead", what: "Look-ahead means the test uses a fact the trader couldn't have known yet." },
    { id: "survivor", label: "Survivorship", what: "Survivorship means instruments that failed or left are missing from the test." },
    { id: "clean", label: "No bug", what: "No bug means every input was known in time and the universe is complete." },
  ],
  [
    { id: "b1", text: "Buys at the open on days whose range ends up above 2 ATR.", answer: "lookahead", correct: "Look-ahead: the day's range is known only at the close.", clue: "Here the day's range is known only after the close, and the buy happens at the open." },
    { id: "b2", text: "Tests a value rule from 2015 to today on the 100 stocks in the LABX index today.", answer: "survivor", correct: "Survivorship: today's members exclude every stock that failed or dropped out since 2015.", clue: "Here the list is today's, so every stock that failed since 2015 is missing." },
    { id: "b3", text: "Signal at the close, buy at the next open, stop 1 ATR below the fill, costs on, universe as of each date.", answer: "clean", correct: "No bug: every input is known in time, and the universe is the one that existed then.", clue: "Here every input is known before the order, and the universe is dated." },
    { id: "b4", text: "Ranks stocks by earnings as restated a year later, and buys on the original report date.", answer: "lookahead", correct: "Look-ahead: on the report date, only the first figures existed.", clue: "Here the restated figures were published a year after the trade." },
    { id: "b5", text: "Runs a mean-reversion rule on the list of coins an exchange shows this morning.", answer: "survivor", correct: "Survivorship: coins the exchange delisted aren't on today's list.", clue: "Here the list was downloaded today, so delisted coins are gone." },
  ],
);

const L_3_11_3: Lesson = {
  id: "3.11.3",
  title: "Look-ahead and survivorship",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Two bugs make worthless rules look brilliant: information that wasn't known yet, and a universe that contains only the survivors.",
  objectives: [
    "Find the line in a backtest that uses information not available at decision time.",
    "Show how testing only today's survivors inflates results.",
    "Build a pre-test checklist against both biases.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "3.11",
    courseId: "3.11.3",
    hook: {
      prompt: "A rule buys LABX at the open whenever the day closes above its 20-day high, and sells at that close. Ten-year backtest: 95.2% winners after costs. Real edge or a bug?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Real edge", feedback: "A win rate that high should make you suspicious first. Check when each input was known." },
          { id: "b", label: "A bug" },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. It's a bug: at the open, the day's close isn't known yet. The data were R0, a random walk. Buying the next day's open instead won 40.7% of the time, 77 of 189.",
      concept: "look-ahead-bias",
    },
    learn: [
      {
        kind: "predict",
        title: "Find the line",
        prompt: "A backtest runs these four lines on each bar. Which one sees the future?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "1. ATR = average true range of the last 14 closed bars", feedback: "Closed bars are known at the decision. This line is fine." },
            { id: "b", label: "2. Signal when today's close is above the 20-bar high", feedback: "Fine on its own: the signal exists once the bar closes. The trouble is where the order fills." },
            { id: "c", label: "3. Buy at today's open" },
            { id: "d", label: "4. Stop at the entry minus 1 ATR", feedback: "The entry and a past ATR are both known when the order goes in." },
          ],
          answer: "c",
        },
        reveal: "Line 3. The signal needs today's close, but the order fills at today's open, hours earlier. Fill at the next open instead. Ask of every input: when exactly was this known?",
        concept: "look-ahead-bias",
      },
      {
        kind: "explain",
        title: "Where look-ahead hides",
        text: "[[look-ahead-bias|Look-ahead]] slips in four common ways: a bar's close used with a fill inside that bar; the day's high or low used before the day ends; fundamentals as revised later, not as first reported; and today's index members used for past years. Each one hands the test a fact the trader didn't have.",
      },
      {
        kind: "figure",
        title: "Fifty stocks, twelve gone",
        figure: {
          kind: "bars",
          bars: [
            { label: "Today's 38 survivors", value: 18.9, role: "down" },
            { label: "All 50, delisted included", value: 4.8, role: "accent" },
          ],
          unit: "% a year",
          steps: [
            "50 synthetic stocks over ten years. 12 were delisted after falling 75%.",
            "'Buy the 10 biggest 12-month losers' on today's 38 survivors: +18.9% a year.",
            "The same rule on all 50, delisted stocks included: +4.8% a year.",
          ],
        },
        text: "Survivors are, by definition, the losers that came back. Rules that buy what has fallen, such as mean reversion and value, gain the most from leaving out the [[delisting|delisted]] stocks.",
        concept: "survivorship-bias",
      },
      {
        kind: "order",
        title: "The pre-test checklist",
        prompt: "Put the checks in the order you run them before a backtest.",
        items: [
          "Mark when each input was known",
          "Check the universe as it was on each date",
          "Use prices adjusted for splits and dividends",
          "Include the delisted instruments",
          "Turn the costs on",
        ],
        explain: "Timing first, because look-ahead hides in the rules. Then the universe and the prices the rules run on, then the costs.",
        concept: "look-ahead-bias",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Look-ahead bugs rarely look like bugs. They look like a great system: a very high win rate, a smooth curve, an edge on R0. A result that works on a random walk is a leak, not a discovery.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: BUG_CARDS,
      goal: "Five backtests. Name the bug in each: look-ahead (it uses facts not yet known), survivorship (the dead are missing), or no bug.",
      success: { field: "solved", eq: 5 },
      correct: "Five sorted: two leaks of the future, two missing dead, one clean test. Run the checklist before you trust any result.",
      hints: ["Ask of every input: when exactly was this known?", "Count the instruments at the start of the test, not today."],
      showMe: { solved: 5 },
      concept: "look-ahead-bias",
    },
    check: ["q-3.11.3-1", "q-3.11.3-2", "q-3.11.3-3"],
    recap: {
      takeaways: [
        "Look-ahead: the test uses a fact the trader didn't have yet. Ask when each input was known.",
        "Survivors-only tests flatter: +18.9% a year on survivors, +4.8% with the delisted included.",
        "Before any test: input timing, the universe at each date, adjusted prices, delisted names, costs.",
      ],
    },
  },
};

// ─── 3.11.4 · In-sample and out-of-sample ───────────────────────────────────

const L_3_11_4: Lesson = {
  id: "3.11.4",
  title: "In-sample and out-of-sample",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Develop on in-sample data, then test once on an untouched later stretch; every extra look turns the test into more in-sample, and a short test says little.",
  objectives: [
    "Split data into an in-sample part for development and an untouched out-of-sample part for one final test.",
    "Explain why peeking at the out-of-sample turns it into in-sample.",
    "Judge whether an out-of-sample result is long enough to mean anything.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "3.11",
    courseId: "3.11.4",
    hook: {
      prompt: "You tuned a system on 2018–2023 synthetic data. The 2024–2025 hold-out lost money. You tweak one filter and re-run the hold-out: now it wins. How much should you trust that?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Fully", feedback: "The tweak was chosen by looking at the hold-out, so the hold-out helped build the rule it now 'confirms'." },
          { id: "b", label: "More than before", feedback: "The second run isn't new evidence: the same years picked the tweak and then judged it." },
          { id: "c", label: "Very little: the hold-out is now in-sample" },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. Once a tweak is chosen by looking at the hold-out, those years helped build the system. They're in-sample now, and the log counts another trial.",
      concept: "in-sample-out-of-sample",
    },
    learn: [
      {
        kind: "figure",
        title: "The vault",
        figure: {
          kind: "chart",
          chart: {
            candles: CURVE_CANDLES,
            style: "line",
            visible: 64,
            describe: "Cumulative R of the course system with lookback 22 over ten synthetic years: +10.40R after 64 in-sample trades, then +1.57R over 24 out-of-sample trades, ending at +11.97R.",
          },
          steps: [
            { text: "Seven years in time order, never shuffled: the in-sample. The lookback was tuned here: 22 bars.", layers: [{ kind: "marker", index: 63, at: "close", label: "+10.40R", role: "accent" }] },
            { text: "64 in-sample trades, +0.162R each. The last three years stay locked." },
            { text: "One unlock: 24 trades, +0.066R each. Positive, but much weaker.", visible: 88, layers: [{ kind: "marker", index: 87, at: "close", label: "+11.97R", role: "neutral" }] },
          ],
        },
        text: "Split by time, about 70/30, never at random: shuffled days let the test learn from neighbours it shouldn't know. Develop on the [[in-sample]]; the [[hold-out]] stays locked until the rules are final.",
        concept: "in-sample-out-of-sample",
      },
      {
        kind: "worked",
        title: "How long is long enough?",
        lines: [
          "[[standard-error|Standard error]] of a yearly [[sharpe-ratio|Sharpe ratio]] ≈ √((1 + Sharpe² ÷ 2) ÷ years).",
          "One year at Sharpe 1.0: √(1.5 ÷ 1) = 1.22. The 95% range is 1.0 ± 2.40: −1.40 to 3.40.",
          "Four years at Sharpe 1.0: √(1.5 ÷ 4) = ?",
        ],
        ask: {
          answer: 0.61,
          tolerance: 0.01,
          feedback: [
            { value: 1.22, text: "That's one year. Divide by 4 inside the root." },
            { value: 0.375, text: "That's before the square root: √0.375." },
          ],
          correct: "Right. 0.61: the range is 1.0 ± 1.20, about −0.20 to 2.20. Zero is still inside.",
        },
        after: "One year of out-of-sample says almost nothing about a Sharpe of 1. You need years of data, or many more trades.",
        concept: "in-sample-out-of-sample",
      },
      {
        kind: "explain",
        title: "Peeking",
        text: "A hold-out is clean only if nothing about it shaped the rules. Bailey and colleagues warn that it fails when the researcher has already seen the whole sample, or ran many trials and kept the one that passed. Every extra unlock is a new trial in the [[research-log]], and the hold-out counts as in-sample from then on.",
      },
      {
        kind: "predict",
        title: "Real structure or noise?",
        prompt: "The course system runs on 300 trending R1 series and 300 R0 random walks. Each tunes its lookback on 7 years, then runs 3 unseen years. What happens out of sample?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Both keep their in-sample results", feedback: "Tuning picks the luckiest setting, so results shrink out of sample, and on R0 there was nothing to keep." },
            { id: "b", label: "R1 keeps part of its edge; R0 falls to about minus costs" },
            { id: "c", label: "Both fall to zero", feedback: "R1 has real trend structure, so part of the edge survives: +0.107R a trade on average." },
          ],
          answer: "b",
        },
        reveal: "In-sample, the best lookback averaged +0.233R a trade on R1 and −0.007R on R0. Out of sample: +0.107R on R1, about half; −0.113R on R0, roughly the cost of trading. Real structure shrinks; noise disappears.",
        concept: "in-sample-out-of-sample",
      },
      {
        kind: "fields",
        title: "Write the pass rule first",
        prompt: "Before the vault opens, write the rule that decides pass or fail. Nothing you see afterwards may change it.",
        fields: [
          { id: "passRule", label: "Pass rule for the out-of-sample", kind: "text", default: "", placeholder: "e.g. Pass only if the 95% interval of expectancy is above zero", required: true },
          { id: "ifFail", label: "What you'll do if it fails", kind: "text", default: "", placeholder: "e.g. No re-tuning: back to research, or forward-test on new data", required: true },
        ],
        correct: "Saved before the unlock. The verdict now follows from the rule, not from your hopes.",
        concept: "in-sample-out-of-sample",
      },
      {
        kind: "reveal",
        title: "One unlock",
        prompt: "Rule: pass only if the 95% interval of expectancy is above zero. Tuned to lookback 22, the system made +0.162R a trade in-sample. Predict the verdict, then unlock.",
        chart: { candles: CURVE_CANDLES, style: "line", visible: 64 },
        choices: [
          { id: "a", label: "Pass: the interval is above zero" },
          { id: "b", label: "No pass: zero is inside the interval" },
        ],
        answer: "b",
        after: "24 trades, +0.066R each. Positive, but on 24 trades the interval is wide. Check it below.",
        concept: "in-sample-out-of-sample",
      },
      {
        kind: "worked",
        title: "The verdict",
        lines: ["Out of sample: 24 trades, mean +0.066R, standard deviation 1.46R.", "Standard error = 1.46 ÷ √24 = 0.298R.", "Lower end of the 95% interval: 0.066 − 1.96 × 0.298 = ?"],
        ask: {
          answer: -0.52,
          tolerance: 0.01,
          unit: "R",
          feedback: [{ value: 0.65, text: "That's the upper end. Subtract 1.96 standard errors." }],
          correct: "Right. −0.52R to +0.65R: zero is well inside. By the rule, no pass.",
        },
        after: "Don't re-tune: that would spend the vault. Extend the test forward on new data instead (3.11.10).",
        concept: "in-sample-out-of-sample",
      },
    ],
    check: ["q-3.11.4-1", "q-3.11.4-2", "q-3.11.4-3"],
    recap: {
      takeaways: [
        "Split in time order: tune on the in-sample, then test once on a later, untouched out-of-sample.",
        "Each extra look is a trial in the log and turns the hold-out into in-sample.",
        "A short out-of-sample barely tells: Sharpe SE ≈ √((1 + Sharpe² ÷ 2) ÷ years).",
      ],
    },
  },
};

// ─── 3.11.5 · Overfitting and the random-walk control ───────────────────────

const L_3_11_5: Lesson = {
  id: "3.11.5",
  title: "Overfitting and the random-walk control",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Many tuned parameters on few trades fit noise, and the best of many zero-edge tries looks impressive by chance; that's why every result runs next to an R0 control.",
  objectives: [
    "Recognise an overfit backtest: many parameters, few trades, a perfect curve.",
    "Show that the best of N zero-edge configurations has an impressive in-sample Sharpe by chance alone.",
    "Run an R0 random-walk control next to every result you plan to trust.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "3.11",
    courseId: "3.11.5",
    hook: {
      prompt: "This LABX strategy made +58.5% in four synthetic years: Sharpe 1.29 after costs, 6 tuned parameters, 46 trades. Predict its next two years.",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "About the same", feedback: "That assumes the parameters found something lasting. Six choices tuned on 46 trades mostly find noise." },
          { id: "b", label: "About half", feedback: "Halving is what a real edge often does out of sample. Here there was no edge to halve." },
          { id: "c", label: "Around zero, or worse" },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. The prices were R0, a random walk. The strategy was the best of 2,000 settings, and the best of 40 such searches. Next two years: −10.6%.",
      concept: "overfitting",
    },
    learn: [
      {
        kind: "explain",
        title: "Fitting the noise",
        text: "[[overfitting|Overfitting]] means rules that target particular past observations instead of a lasting structure (Bailey and colleagues). Six tuned parameters on 46 trades leave under 8 trades for each. Practical limits: optimise 3 to 5 parameters at most, and want many trades for each. Every choice you can tune is a [[degrees-of-freedom|degree of freedom]] that can fit noise.",
      },
      {
        kind: "worked",
        title: "The best of N tries",
        lines: [
          "N strategies with zero edge, one year of daily results each. Keep the best Sharpe.",
          "10,000 simulated trials: N = 20 averages 1.88; N = 100 averages 2.52.",
          "N = 10: the best Sharpe, on average = ?",
        ],
        ask: {
          answer: 1.55,
          tolerance: 0.05,
          feedback: [
            { value: 0, text: "Each one's true Sharpe is 0, but you keep the best of 10. The maximum of ten noisy results sits well above zero." },
            { value: 2.52, text: "That's the best of 100. With 10 tries, the luckiest is less extreme." },
          ],
          correct: "Right. About 1.55, from pure noise. Bailey and colleagues' formula gives 1.57 for the same case.",
        },
        after: "A Sharpe of 1.5 from ten tries is what luck alone produces. That's [[multiple-testing]] at work: count the tries before you judge the winner.",
        concept: "overfitting",
      },
      {
        kind: "figure",
        title: "The complexity curve",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(FIT_IS.map(() => 0.45)),
            hideCandles: true,
            range: [0, 0.9],
            describe: "Expectancy per trade as filters are added, 0 to 8. In-sample: 0.12, 0.40, 0.54, 0.64, 0.71, 0.74, 0.76, 0.79, 0.81R. Out of sample: 0.08, 0.10, 0.12, 0.14, 0.11, 0.10, 0.10, 0.08, 0.07R.",
          },
          steps: [
            { text: "Add filters one at a time, each the best in-sample: +0.12R grows to +0.81R a trade.", layers: [{ kind: "line", values: FIT_IS, role: "accent", label: "In-sample" }] },
            { text: "Out of sample: +0.08R with no filters, +0.14R at three.", layers: [{ kind: "line", values: FIT_OOS, role: "up", label: "Out of sample" }] },
            { text: "After that, each filter fits noise: +0.07R with eight.", layers: [{ kind: "marker", index: 3, price: 0.14, label: "Peak", role: "up" }] },
          ],
        },
        text: "120 seeded R1 series. A plain 20-bar breakout; each step adds whichever of 34 candidate filters most improves the in-sample result. The widening gap is the fit to noise.",
        concept: "overfitting",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Adding a filter because it removes three particular losing trades is [[data-snooping]]: the data chose the rule. From now on, every report in this course runs a [[random-walk-control]] beside it: the same test on R0. If R0 shows an 'edge', something leaks (3.11.3).",
      },
      {
        kind: "predict",
        title: "The best of 100 random rules",
        prompt: "100 random moving-average rules ran on one year of R0. The best scored a Sharpe of 1.93. Predict its Sharpe over the next R0 year.",
        control: {
          kind: "slider",
          min: -2,
          max: 2,
          step: 0.1,
          start: 1.9,
          answer: 0,
          tolerance: 0.5,
          feedback: [
            { from: 0.6, to: 2, text: "That assumes the best rule found something. On R0 there's nothing to find: the best of 100 is just the luckiest." },
            { from: -2, to: -0.6, text: "There's no reason to expect a big loss either. The honest forecast on R0 is zero, minus costs." },
          ],
        },
        reveal: "It scored +0.25: noise around zero. Across 500 such labs, the best rule's year-one Sharpe averaged 1.30, and its next year −0.08. The best of 100 coin-flippers still flipped coins.",
        concept: "data-snooping",
      },
      {
        kind: "match",
        title: "Warning sign or reasonable?",
        prompt: "Sort each backtest report.",
        pairs: [
          { left: "6 tuned parameters, 46 trades, a smooth curve", right: "Warning sign" },
          { left: "3 parameters, 400 trades over ten years", right: "Reasonable", wrong: "Few parameters and many trades per parameter: the test has room to show a real edge." },
          { left: "A Sharpe of 2 on R0 data", right: "Warning sign" },
          { left: "+0.30R in-sample, +0.15R out of sample", right: "Reasonable", wrong: "Some shrinkage out of sample is normal for a real edge. Collapse to zero would be the warning." },
          { left: "A filter added to remove last month's three losers", right: "Warning sign" },
        ],
        columns: ["Report", "Read"],
        correct: "Right. Too many parameters, an edge on noise and filters chosen by past losers all point to a fit.",
        concept: "overfitting",
      },
    ],
    check: ["q-3.11.5-1", "q-3.11.5-2", "q-3.11.5-3"],
    recap: {
      takeaways: [
        "Many tuned parameters, few trades and a perfect curve: suspect the fit, not the edge.",
        "The best of 10 zero-edge tries shows a Sharpe near 1.5 by luck alone.",
        "Run every test on R0 too. An 'edge' on a random walk is a leak.",
      ],
    },
  },
};

// ─── 3.11.6 · Walk-forward analysis ─────────────────────────────────────────

const L_3_11_6: Lesson = {
  id: "3.11.6",
  title: "Walk-forward analysis",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Walk-forward analysis repeats tune-then-trade on rolling windows and keeps only the unseen segments, which shows how a system would really have been re-optimised.",
  objectives: [
    "Run a walk-forward test: optimise on one window, trade the next unseen segment, roll forward.",
    "Compute walk-forward efficiency and read the parameter-stability chart.",
    "Choose between anchored and rolling windows, without tuning the walk-forward itself.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "decision_making", label: "Decision-making check" }],
  script: {
    unit: "3.11",
    courseId: "3.11.6",
    hook: {
      prompt: "A system's best breakout lookback, re-tuned each year on the four years before: 10, 22, 40, 40, 18, 16. Is it adapting to the market, or fitting noise?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Adapting to the market", feedback: "Markets change, but not this fast: the choice jumps from one end of the range to the other." },
          { id: "b", label: "Fitting noise" },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. This was R0, a random walk: there was nothing to adapt to. The unseen years lost 10.42R in total. Choices that jump across the range are the classic sign (Pardo).",
      concept: "walk-forward-analysis",
    },
    learn: [
      {
        kind: "figure",
        title: "Six unseen years",
        figure: {
          kind: "bars",
          bars: [
            { label: "Year 5 · lookback 22", value: -2.03, role: "down" },
            { label: "Year 6 · lookback 22", value: 6.98, role: "up" },
            { label: "Year 7 · lookback 25", value: -0.34, role: "down" },
            { label: "Year 8 · lookback 20", value: -4.39, role: "down" },
            { label: "Year 9 · lookback 20", value: 5.7, role: "up" },
            { label: "Year 10 · lookback 20", value: -0.6, role: "down" },
          ],
          unit: "R",
          steps: [
            "Tune the lookback on years 1–4, trade year 5 unseen. Then roll forward a year.",
            "Six unseen years, each with its own lookback: 22, 22, 25, 20, 20, 20.",
            "Stitched together: +5.32R in six years, +0.89R a year.",
          ],
        },
        text: "The course system, [[walk-forward-analysis|walked forward]] on its reference series. Only the unseen years count. In-sample, the same choices earned +1.74R a year on average.",
        concept: "walk-forward-analysis",
      },
      {
        kind: "worked",
        title: "Walk-forward efficiency",
        lines: [
          "[[walk-forward-efficiency|WFE]] = out-of-sample return a year ÷ in-sample return a year.",
          "In-sample: +1.74R a year on average. Out of sample: +0.89R a year.",
          "WFE = 0.89 ÷ 1.74 = ?",
        ],
        ask: {
          answer: 0.51,
          tolerance: 0.02,
          feedback: [{ value: 1.96, text: "That's in-sample ÷ out-of-sample. The unseen result goes on top." }],
          correct: "Right. 0.51: about half of the in-sample return survived. Practitioners often ask for 0.5 or more; it's a rule of thumb, not a standard.",
        },
        after: "The chosen lookbacks also stayed close: all within ±20% of their median, 21.",
        concept: "walk-forward-analysis",
      },
      {
        kind: "match",
        title: "Anchored or rolling?",
        prompt: "Sort each feature by window type.",
        pairs: [
          { left: "Always starts at the first year and grows each step", right: "Anchored" },
          { left: "Keeps a fixed length and drops the oldest year", right: "Rolling" },
          { left: "Favours settings that fit all the history", right: "Anchored" },
          { left: "Adapts faster when the market changes", right: "Rolling" },
          { left: "On the course system: lookback 22 in all six windows", right: "Anchored" },
        ],
        columns: ["Feature", "Window"],
        correct: "Right. Neither is better in general. Pick one before you run it, for a reason you can write down.",
        concept: "walk-forward-analysis",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Here, [[rolling-window|rolling windows]] gave a WFE of 0.51 and [[anchored-window|anchored]] ones 0.92. Trying both, or five window lengths, and reporting the best is overfitting one level up. Fix the method first. On R0, the control fails as it should: across 200 series, +0.30R a year in-sample, −0.52R out of sample.",
      },
      {
        kind: "predict",
        title: "Stable or not?",
        prompt: "Six windows chose 22, 22, 25, 20, 20, 20. The median is 21. Stability rule: every choice within ±20% of the median. Stable?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Stable: all within 16.8 to 25.2" },
            { id: "b", label: "Unstable: the choice changed", feedback: "Small moves are normal. The rule asks whether they stay near the median, between 16.8 and 25.2." },
          ],
          answer: "a",
        },
        reveal: "Stable. Compare the R0 control: 10, 22, 40, 40, 18, 16. Its median is 20 and its band 16 to 24: three of six choices fall outside.",
        concept: "walk-forward-analysis",
      },
    ],
    check: ["q-3.11.6-1", "q-3.11.6-2", "q-3.11.6-3"],
    recap: {
      takeaways: [
        "Walk-forward: tune on one window, trade the next unseen one, roll on, stitch only the unseen parts.",
        "WFE = out-of-sample ÷ in-sample annual return; 0.5 is a rule of thumb. Check stability too.",
        "Choose anchored or rolling, and the window length, before running. Choosing afterwards is meta-overfitting.",
      ],
    },
  },
};

// ─── 3.11.7 · Monte Carlo: one backtest, many futures ───────────────────────

const L_3_11_7: Lesson = {
  id: "3.11.7",
  title: "Monte Carlo: one backtest, many futures",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Reshuffling and bootstrapping a trade list turn one equity curve into a range of futures, so drawdown plans come from the 95th percentile, not from the one path you happened to see.",
  objectives: [
    "Reshuffle and bootstrap a trade list to turn one equity curve into a distribution.",
    "Set drawdown expectations from the 95th percentile, not from the single backtest.",
    "Draw an expectation corridor that tells normal variance from a broken system.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M04", label: "Define Your Risk" },
    { kind: "check", ref: "risk_management", label: "Risk management check" },
  ],
  script: {
    unit: "3.11",
    courseId: "3.11.7",
    hook: {
      prompt: "The reference system (40% winners at +2.5R, 60% losers at −1R) showed a worst drawdown of 7R in its one backtest. Reshuffle the same 100 trades 10,000 times. 95th-percentile worst drawdown?",
      control: {
        kind: "slider",
        min: 5,
        max: 25,
        step: 0.5,
        unit: "R",
        start: 7,
        answer: 13.5,
        tolerance: 1,
        feedback: [
          { from: 5, to: 8, text: "The backtest's 7R was one ordering. 71.4% of the reshuffles went deeper." },
          { from: 17, to: 25, text: "Deeper than that is rare: even the 99th percentile is 16.5R." },
        ],
      },
      compare: "You answered {yours}. Reshuffled, the same trades give a median worst drawdown of 8.5R and a 95th percentile of 13.5R. The backtest's 7R was a kind ordering.",
      concept: "monte-carlo-resampling",
    },
    learn: [
      {
        kind: "explain",
        title: "Two ways to resample",
        text: "A [[reshuffle]] keeps the same trades in a new order: the total profit stays the same, the drawdowns change. A [[bootstrap]] draws trades with replacement: some repeat, some drop out, so the profit varies too. Reshuffle to plan drawdowns; bootstrap to see where the result itself could have landed. Both are [[monte-carlo|Monte Carlo]] methods.",
      },
      {
        kind: "figure",
        title: "1,000 futures",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(FAN_P50),
            hideCandles: true,
            range: [-10, 70],
            describe: "Cumulative R over 100 trades, every 10 trades. Backtest: 4, 8, 12, 19.5, 23.5, 27.5, 31.5, 35.5, 36, 40. Bootstrap median 4 to 40; 5th percentile ends at 12, 95th at 68.",
          },
          steps: [
            { text: "The backtest: 100 trades, +40R, worst drawdown 7R.", layers: [{ kind: "line", values: FAN_BACKTEST, role: "concept", label: "Backtest" }] },
            { text: "1,000 bootstrap paths from the same trades. The median path ends at +40R.", layers: [{ kind: "line", values: FAN_P50, role: "accent", label: "Median" }] },
            {
              text: "5th to 95th percentile after 100 trades: +12R to +68R.",
              layers: [
                { kind: "line", values: FAN_P95, role: "neutral", dashed: true, label: "95th" },
                { kind: "line", values: FAN_P5, role: "neutral", dashed: true, label: "5th" },
              ],
            },
            { text: "Bootstrap drawdowns run deeper than reshuffled ones: 95th percentile 16R, against 13.5R.", layers: [{ kind: "level", price: 0, role: "neutral", label: "0R" }] },
          ],
        },
        text: "This [[fan-chart|fan chart]] shows where the same edge could have landed by trade 100. Your backtest is one line inside it.",
        concept: "monte-carlo-resampling",
      },
      {
        kind: "figure",
        title: "The drawdown histogram",
        figure: {
          kind: "bars",
          bars: [
            { label: "4–6R", value: 453, role: "neutral" },
            { label: "6–8R", value: 3063, role: "neutral" },
            { label: "8–10R", value: 3320, role: "accent" },
            { label: "10–12R", value: 1878, role: "neutral" },
            { label: "12–14R", value: 813, role: "neutral" },
            { label: "14–16R", value: 304, role: "down" },
            { label: "16–18R", value: 117, role: "down" },
            { label: "18–20R", value: 41, role: "down" },
            { label: "20R or more", value: 11, role: "down" },
          ],
          unit: "reshuffles",
          steps: [
            "10,000 reshuffles of the same 100 trades. Median worst drawdown: 8.5R.",
            "90th percentile 12R, 95th 13.5R, 99th 16.5R.",
            "Against the backtest's 7R: 71.4% of the orderings went deeper.",
          ],
        },
        text: "Plan from the 95th [[percentile]]. The single backtest is one draw, and usually a kind one.",
        concept: "monte-carlo-resampling",
      },
      {
        kind: "worked",
        title: "Drawdown in the plan",
        lines: ["95th-percentile worst drawdown: 13.5R.", "At 1% risk per trade, 1R = 1% of the account.", "Drawdown the plan should accept, roughly = ?"],
        ask: {
          answer: 13.5,
          tolerance: 0.5,
          unit: "%",
          feedback: [{ value: 7, text: "7% is the single backtest. 71.4% of reshuffles went deeper." }],
          correct: "Right. About 13.5%, a little less with risk taken on a shrinking account. Plan for 13–15%, not 7%.",
        },
        after: "Set the drawdown tiers from 2.11 with this number, not with the backtest's.",
        concept: "monte-carlo-resampling",
      },
      {
        kind: "explain",
        title: "The expectation corridor",
        text: "An [[expectation-corridor]] marks what variance alone can do. For the reference system, the 5th to 95th percentile of the average result after 50 trades runs from −0.02R to +0.82R. After only 20 trades, a net loss has a 12.6% chance. Inside the corridor, keep executing; outside it, investigate.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Monte Carlo can't create an edge the trades don't have, and it inherits every fill and cost assumption of the backtest. Reshuffling also breaks any real clustering of wins and losses. If your results cluster (3.10.7), resample blocks of consecutive trades instead.",
      },
      {
        kind: "fields",
        title: "Set your tiers",
        prompt: "From the reshuffle histogram: set the drawdown that cuts your risk at the 95th percentile, and the kill switch at the 99th.",
        fields: [
          { id: "tier", label: "Drawdown tier: cut risk at", kind: "stepper", min: 5, max: 25, step: 0.5, unit: "R", default: 7 },
          { id: "kill", label: "Kill switch: stop the system at", kind: "stepper", min: 5, max: 30, step: 0.5, unit: "R", default: 10 },
        ],
        valid: { all: [{ field: "tier", gte: 13, lte: 14 }, { field: "kill", gte: 16, lte: 17 }] },
        feedback: [
          { when: { field: "tier", lt: 13 }, text: "{tier:1}R sits inside normal bad luck. Read the 95th percentile off the histogram: 13.5R." },
          { when: { field: "tier", gt: 14 }, text: "{tier:1}R is past the 95th percentile, 13.5R: the tier would act late." },
          { when: { field: "kill", lt: 16 }, text: "A kill at {kill:1}R would stop a healthy system in a normal bad run. The 99th percentile is 16.5R." },
          { when: { field: "kill", gt: 17 }, text: "{kill:1}R waits past the 99th percentile, 16.5R. Set it there, where variance stops explaining the loss." },
        ],
        correct: "Saved to your plan: cut risk at 13.5R, stop at 16.5R. The kill switch sits beyond normal bad luck.",
        concept: "monte-carlo-resampling",
      },
    ],
    check: ["q-3.11.7-1", "q-3.11.7-2", "q-3.11.7-3"],
    recap: {
      takeaways: [
        "Reshuffle: same trades, new order, new drawdowns. Bootstrap: profit and drawdowns both vary.",
        "Plan drawdowns from the 95th percentile, 13.5R here, not from the backtest's 7R.",
        "A corridor of normal variance tells bad luck from breakage. Monte Carlo can't create edge.",
      ],
    },
  },
};

// ─── 3.11.8 · Robustness: plateaus, not peaks ───────────────────────────────

const L_3_11_8: Lesson = {
  id: "3.11.8",
  title: "Robustness: plateaus, not peaks",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A robust system sits on a broad plateau of parameter values and survives a battery of stress tests, growing weaker but staying positive; a fitted one collapses.",
  objectives: [
    "Map performance across parameter values and pick a value on a broad plateau.",
    "Run a stress battery: double costs, drop the best trades, add noise, shift start dates, try other markets.",
    "Decide whether a system degrades gracefully or collapses.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "decision_making", label: "Decision-making check" }],
  script: {
    unit: "3.11",
    courseId: "3.11.8",
    hook: {
      prompt: "The course system, run with breakout lookbacks from 10 to 61 bars in 10% steps. Each point is the net result per trade over ten years. Tap the lookback you would trade.",
      control: {
        kind: "tap",
        chart: {
          candles: slots(SWEEP),
          hideCandles: true,
          range: [0, 0.2],
          layers: [{ kind: "line", values: SWEEP, role: "accent", label: "R a trade" }],
          describe: "Net R a trade by lookback: 10: 0.053, 11: 0.025, 12: 0.047, 13: 0.040, 15: 0.114, 16: 0.127, 18: 0.127, 19: 0.127, 21: 0.122, 24: 0.179, 26: 0.154, 29: 0.103, 31: 0.103, 35: 0.116, 38: 0.147, 42 to 56: 0.086, 61: 0.102.",
        },
        zones: [
          { id: "a", label: "24 bars, the highest point", index: LOOKBACKS.indexOf(24), price: SWEEP[LOOKBACKS.indexOf(24)], feedback: "The top of the curve, +0.179R, but its neighbours, 21 and 26, average +0.138R: 77% of it." },
          { id: "b", label: "18 bars, the middle of the flat stretch", index: LOOKBACKS.indexOf(18), price: SWEEP[LOOKBACKS.indexOf(18)], feedback: "16, 18 and 19 all earn +0.127R: nearby settings agree." },
          { id: "c", label: "38 bars, a lone bump", index: LOOKBACKS.indexOf(38), price: SWEEP[LOOKBACKS.indexOf(38)], feedback: "+0.147R, but its neighbours average +0.101R: 69% of it. A bump the settings around it don't support." },
          { id: "d", label: "11 bars, the low point", index: LOOKBACKS.indexOf(11), price: SWEEP[LOOKBACKS.indexOf(11)], feedback: "The weakest setting, +0.025R. Short lookbacks catch more false breakouts here." },
        ],
        answer: "b",
      },
      compare: "You tapped {yours}. Around 18, the lookbacks 16 and 19 earn the same +0.127R: a plateau. 24 is the top, +0.179R, but its neighbours average only 77% of it.",
      concept: "parameter-plateau",
    },
    learn: [
      {
        kind: "explain",
        title: "Plateaus, in percent steps",
        text: "Prefer a broad [[parameter-plateau]] to the single best value (Pardo): when nearby settings work alike, the rule likely captures structure; an isolated peak suggests luck. Step in percent, not units (Kaufman): 10, 11, 12.1, 13.3, 14.6. Steps of one bar treat 10 to 11, a 10% change, like 50 to 51, a 2% change.",
      },
      {
        kind: "worked",
        title: "The neighbourhood rule",
        lines: [
          "Course design rule: the neighbours' average must be at least 80% of the chosen cell.",
          "Lookback 18: +0.127R; neighbours 16 and 19: +0.127R each. 100%.",
          "Lookback 24: +0.179R; neighbours 21 and 26 average +0.138R. Ratio, in % = ?",
        ],
        ask: {
          answer: 77,
          tolerance: 1,
          unit: "%",
          feedback: [{ value: 130, text: "That's the cell ÷ its neighbours. Neighbours go on top: 0.138 ÷ 0.179." }],
          correct: "Right. 77%: under 80%, so 24 fails the rule. 38, at +0.147R with neighbours averaging +0.101R, scores 69%.",
        },
        after: "80% is a course convention, not a law. Its job is to make you look at the neighbours before the cell.",
        concept: "parameter-plateau",
      },
      {
        kind: "order",
        title: "The stress battery",
        prompt: "Put the five stress tests in the order the course runs them.",
        items: ["Double the costs", "Drop the best 5% of trades", "Add noise to the prices", "Start at a later date", "Run another market or timeframe"],
        explain: "Costs first: the cheapest test, and it kills the most systems. Then dependence on outliers, sensitivity to the exact prices and dates, and finally whether the idea travels.",
        concept: "robustness-testing",
      },
      {
        kind: "figure",
        title: "The battery on lookback 18",
        figure: {
          kind: "bars",
          bars: [
            { label: "Base", value: 0.127, role: "accent" },
            { label: "Double costs", value: 0.014, role: "up" },
            { label: "Without the best 5%", value: 0.025, role: "up" },
            { label: "Noise added", value: 0.213, role: "up" },
            { label: "Start a year later", value: 0.103, role: "up" },
            { label: "Another R1 market", value: 0.221, role: "up" },
          ],
          unit: "R a trade",
          steps: [
            "Base: 92 trades, +0.127R each, profit factor 1.20.",
            "Double costs: +0.014R. Without the best 5 trades: +0.025R, profit factor 1.04.",
            "Noise, a later start, another R1 market: +0.213R, +0.103R, +0.221R. Five of five positive.",
          ],
        },
        text: "It gets much weaker under cost and outlier stress, but stays above zero: that's [[robustness]], degrading gracefully. Costs are its weak point, and the [[stress-test|stress tests]] show it before live trading does.",
        concept: "robustness-testing",
      },
      {
        kind: "predict",
        title: "Two verdicts",
        prompt: "Pass rule: positive in at least four of the five stress tests. Lookback 18 is positive in five. The same battery on the R0 control: −0.281R, −0.257R, −0.088R, −0.040R, +0.264R. Verdicts?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Both pass", feedback: "R0 is positive in one test of five. One hot result is what noise produces." },
            { id: "b", label: "18 passes; R0 fails with one of five" },
            { id: "c", label: "Both fail: 18 barely survives double costs", feedback: "+0.014R is thin, but the rule asks for positive. It flags costs as the weak point; it isn't a failure." },
          ],
          answer: "b",
        },
        reveal: "Lookback 18 passes, five of five. R0 fails, one of five: its other-market run gained +0.264R by luck, which is exactly what a random walk's lucky cell looks like.",
        concept: "robustness-testing",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Dropping the best 5% of trades measures [[outlier-dependence]]. Trend followers rely on a few big winners by design, so a large drop is normal for them. A mean reverter that needs its best trades to stay positive is fragile. Know your system's type before you judge.",
      },
    ],
    check: ["q-3.11.8-1", "q-3.11.8-2", "q-3.11.8-3"],
    recap: {
      takeaways: [
        "Pick a value on a broad plateau; check the neighbours before the cell. Step parameters in percent.",
        "Stress battery: double costs, drop the best 5%, add noise, start later, try another market.",
        "A robust edge weakens under stress; a fitted one collapses. R0 fails the same battery.",
      ],
    },
  },
};

// ─── 3.11.9 · Random benchmarks and the edge ratio ──────────────────────────

const TWIN_CARDS = cardSort(
  [
    { id: "entry", label: "Entry edge", what: "An entry edge means the system beats its random-entry twins clearly: percentile 95 or more, e-ratio 1.2 or more." },
    { id: "drift", label: "Market drift", what: "Drift means random entries with the same exits made similar money because the market rose." },
    { id: "none", label: "Not proven", what: "Not proven means the system isn't clearly better than its twins, so luck can't be ruled out." },
  ],
  [
    { id: "t1", text: "+21.9% in ten years. Median twin −2.8%; the system beats 97.7% of its twins. E-ratio 1.66; random entries 1.04.", answer: "entry", correct: "Entry edge: far above its twins, and the e-ratio is well above random.", clue: "Here the system beats 97.7% of its twins, and its e-ratio is 1.66 against 1.04." },
    { id: "t2", text: "+17.1% in ten years, while LABX rose 5.7-fold. Median twin +15.4%; the system beats 53.8%.", answer: "drift", correct: "Market drift: random entries made nearly as much in a rising market.", clue: "Here the twins made +15.4% with random entries, so the rise did the work." },
    { id: "t3", text: "−5.3% on R0. Median twin −5.4%; the system beats 50.0%.", answer: "none", correct: "Not proven: exactly like random entries, on a random walk.", clue: "Here the system sits at the 50th percentile on a random walk." },
    { id: "t4", text: "+12.6% in ten years. Median twin +1.3%; the system beats 81.3%. E-ratio 1.44; random entries 1.26.", answer: "none", correct: "Not proven yet: promising, but under the 95th percentile. More trades could settle it.", clue: "Here 81.3% is promising but short of the 95th percentile." },
  ],
);

const L_3_11_9: Lesson = {
  id: "3.11.9",
  title: "Random benchmarks and the edge ratio",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Random-entry twins with the same exits show what your entry adds beyond exits and market drift, and the edge ratio measures the entry on its own.",
  objectives: [
    "Compare a strategy with 1,000 random-entry twins that use the same exits and holding time.",
    "Compute an edge ratio to test whether the entry beats random.",
    "Separate entry edge, exit effect and market drift, using the benchmark ghost.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "breakout", label: "Arena: breakout" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "3.11",
    courseId: "3.11.9",
    hook: {
      prompt: "Your breakout system made +17.1% on LABX in ten synthetic years. 1,000 random-entry twins with the same exits made −6.9% to +41.8%; the median twin, +15.4%. How much does your entry add?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "A lot", feedback: "+17.1% is a profit, but random entries with the same exits made +15.4% at the median." },
          { id: "b", label: "A little", feedback: "+17.1% against a median of +15.4% is well inside the twins' spread. Nothing separates it from luck." },
          { id: "c", label: "Nothing measurable" },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. The system beat 53.8% of its twins: a coin flip. LABX rose 5.7-fold over those years, so almost any long entry with these exits made money. The drift did the work.",
      concept: "random-entry-benchmark",
    },
    learn: [
      {
        kind: "explain",
        title: "Twins",
        text: "A [[random-entry-benchmark]] builds 1,000 twins of your system: same exits, same market, about the same number of trades, but random entries. Your percentile among them measures the entry. Near the 50th, it adds nothing; at the 95th or above, it probably adds something. Buy-and-hold stays on the chart as the ghost: the drift anyone could have had.",
      },
      {
        kind: "worked",
        title: "The edge ratio",
        lines: [
          "[[edge-ratio|Edge ratio]] = average MFE ÷ average MAE, N bars after entry, both in ATR.",
          "The course system's 212 signals on its reference series, 10 bars on: MFE 2.32 ATR, MAE 1.61 ATR.",
          "E-ratio = 2.32 ÷ 1.61 = ?",
        ],
        ask: {
          answer: 1.44,
          tolerance: 0.02,
          feedback: [{ value: 0.69, text: "That's MAE ÷ MFE. The favourable excursion goes on top." }],
          correct: "Right. 1.44. Random entries on the same data score 1.26, above 1 because this market drifted up. Compare with them, not with 1.",
        },
        after: "Exits play no part in the e-ratio, so it isolates the entry.",
        concept: "edge-ratio",
      },
      {
        kind: "figure",
        title: "How long the entry knows something",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(E_SYSTEM.map(() => 1.3)),
            hideCandles: true,
            range: [1, 1.5],
            describe: "Edge ratio after 1, 2, 3, 5, 7, 10, 15 and 20 bars. Course system signals: 1.26, 1.36, 1.39, 1.45, 1.42, 1.44, 1.44, 1.33. Random entries: 1.11, 1.19, 1.22, 1.22, 1.22, 1.26, 1.30, 1.32.",
          },
          steps: [
            { text: "The course system's signals: 1.26 after 1 bar, about 1.44 from 5 to 15 bars.", layers: [{ kind: "line", values: E_SYSTEM, role: "accent", label: "Signals" }] },
            { text: "Random entries on the same data: 1.11 to 1.32, lifted by the drift.", layers: [{ kind: "line", values: E_RANDOM, role: "neutral", dashed: true, label: "Random" }] },
            { text: "By 20 bars the lines meet, 1.33 against 1.32: the entry's information is spent.", layers: [{ kind: "marker", index: 7, price: 1.33, label: "20 bars", role: "neutral" }] },
          ],
        },
        text: "The gap between the lines is what the entry knows. It's widest from 5 to 15 bars, which suits a 10-bar time exit.",
        concept: "edge-ratio",
      },
      {
        kind: "match",
        title: "Where did the profit come from?",
        prompt: "Match each finding to the most likely source of the profit.",
        pairs: [
          { left: "Random twins earn almost as much as you, in a market that rose all decade", right: "Drift" },
          { left: "You beat 98% of your twins, and your e-ratio is well above random entries'", right: "Entry" },
          { left: "Random entries with your exits profit even on a flat market", right: "Exits" },
        ],
        columns: ["Finding", "Source"],
        correct: "Right. Twins separate the entry from the other two. Buy-and-hold on the same chart shows how much was drift.",
        concept: "random-entry-benchmark",
      },
      {
        kind: "callout",
        tone: "key",
        text: "The course system on its reference series: +12.6% against a median twin of +1.3%, beating 81.3% of its twins, with an e-ratio of 1.44 against 1.26. Promising. But under the course rule, percentile 95 or more and e-ratio 1.2 or more, the entry edge isn't proven yet.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: TWIN_CARDS,
      goal: "Four systems, each checked against 1,000 random-entry twins with the same exits. Label where each result comes from: an entry edge, market drift, or not proven.",
      success: { field: "solved", eq: 4 },
      correct: "Labelled. Only the first shows an entry edge. The course system may have one, but its 91 trades can't separate it from its twins yet.",
      hints: ["If random entries also profit, the market's drift is doing the work.", "Entry edge here: percentile 95 or more and an edge ratio of at least 1.2."],
      showMe: { solved: 4 },
      concept: "random-entry-benchmark",
    },
    check: ["q-3.11.9-1", "q-3.11.9-2", "q-3.11.9-3"],
    recap: {
      takeaways: [
        "Random-entry twins share your exits and market; your percentile among them measures the entry.",
        "E-ratio = average MFE ÷ average MAE in ATR. Compare it with random entries on the same data.",
        "Profit comes from the entry, the exits or drift. Only beating your twins shows entry edge.",
      ],
    },
  },
};

// ─── 3.11.10 · Incubation, kill switches and the research log ───────────────

const L_3_11_10: Lesson = {
  id: "3.11.10",
  title: "Incubation, kill switches and the research log",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "A validated system earns full size in steps: go-live gates and kill criteria written from its Monte Carlo bands, a premortem, and rule changes only through a logged process.",
  objectives: [
    "Write go-live gates and kill criteria before a system trades, using its Monte Carlo bands.",
    "Run a premortem: list the reasons the system will have failed six months from now.",
    "Change a rule only through the documented process: hypothesis, evidence threshold, test, versioned plan.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
  ],
  script: {
    unit: "3.11",
    courseId: "3.11.10",
    hook: {
      prompt: "Your validated system goes live on a small simulated account and loses 6 of its first 10 trades. What do you do?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Stop it", feedback: "Six losses in ten is ordinary for a system that wins 40% of the time. Stopping now judges it on noise." },
          { id: "b", label: "Double the size to recover", feedback: "Raising size in a losing run turns variance into ruin risk. Size grows only through the gates." },
          { id: "c", label: "Change the stop", feedback: "A rule changed after ten trades is fitted to those ten. Changes go through a process, with a test." },
          { id: "d", label: "Check it against the corridor and keep executing" },
        ],
        answer: "d",
      },
      compare: "You picked {yours}. The reference system wins 40% of its trades, so 4 wins in 10 is its single most likely result, about 25% of the time. Check the corridor and keep executing.",
      concept: "incubation",
    },
    learn: [
      {
        kind: "order",
        title: "From test to full size",
        prompt: "Put the stages of [[incubation]] in order.",
        items: ["Forward test in the simulator", "A small account at small size", "Size steps, each behind a gate", "Full size"],
        explain: "Each stage adds what a backtest can't show: live fills, your execution, your behaviour in a losing run. Size grows only when a gate is passed.",
        concept: "incubation",
      },
      {
        kind: "worked",
        title: "Gate and kill switch",
        lines: [
          "Gate: after 50 forward trades, average R inside the Monte Carlo 5–95% band, −0.02R to +0.82R, and process KPIs on target → size × 2.",
          "Kill switch: a drawdown past the 99th percentile, 16.5R, or a 95% interval of expectancy entirely below zero.",
          "After 50 trades your average is +0.10R and your KPIs are on target. Size multiplier now = ?",
        ],
        ask: {
          answer: 2,
          tolerance: 0,
          unit: "×",
          feedback: [
            { value: 1, text: "+0.10R sits inside −0.02R to +0.82R, and the KPIs are on target. The gate is passed: double." },
            { value: 0, text: "Nothing triggers the kill switch: no 16.5R drawdown, and +0.10R isn't below zero." },
          ],
          correct: "Right. Double. Below the band, you would hold size and investigate.",
        },
        after: "Write the gates before the first trade, while you're calm.",
        concept: "kill-switch",
      },
      {
        kind: "explain",
        title: "The premortem",
        text: "A [[premortem]] (Klein, 2007) flips the question. Imagine it's six months from now and the system has failed. Write down why: costs were higher live, the regime changed, you overrode signals in a drawdown, the edge was a fit. Each reason becomes a check you can run or a rule in the plan.",
      },
      {
        kind: "order",
        title: "Changing a rule",
        prompt: "A rule change goes through four steps. Put them in order.",
        items: [
          "Write the hypothesis for the change",
          "Set the evidence threshold: 30–50 trades or a walk-forward",
          "Test it in the simulator",
          "Release a new plan version, comparing before and after with intervals",
        ],
        explain: "Changing a rule after three losses fits your plan to noise. The process makes every change a logged trial with a fair test.",
        concept: "rule-change-governance",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Variance or decay? Edges do fade: published anomalies earned 26% less out of sample and 58% less after publication (McLean and Pontiff, 2016). But only results outside your bands say so. Your [[research-log]] can't be edited and shows 'trials to date: N'.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Practise one skill at a time: executing through a losing run, say, 20 to 50 times in the simulator with scored feedback. Capstone 3 puts you through a drawdown phase on purpose.",
      },
      {
        kind: "fields",
        title: "Your go-live card",
        prompt: "Fill in the card for the reference system before it trades. Its Monte Carlo: 95th-percentile drawdown 13.5R, 99th 16.5R.",
        fields: [
          { id: "gate", label: "Gate to double the size", kind: "text", default: "", placeholder: "e.g. After 50 trades: average R between −0.02R and +0.82R, process KPIs at 90% or more", required: true },
          { id: "kill", label: "Kill switch: stop at a drawdown of", kind: "stepper", min: 5, max: 30, step: 0.5, unit: "R", default: 10 },
          { id: "steps", label: "Size steps", kind: "text", default: "", placeholder: "e.g. 0.25% → 0.5% → 1% risk per trade", required: true },
        ],
        valid: { field: "kill", gte: 16.5 },
        feedback: [
          { when: { field: "kill", lt: 13.5 }, text: "A kill at {kill:1}R sits inside normal bad luck: 95% of reshuffles stay above 13.5R. It would stop a healthy system." },
          { when: { field: "kill", lt: 16.5 }, text: "{kill:1}R is between the 95th and 99th percentiles. Kill on breakage: 16.5R or beyond." },
        ],
        correct: "Saved. The kill switch sits beyond normal bad luck.",
        concept: "kill-switch",
      },
      {
        kind: "fields",
        title: "Your premortem",
        prompt: "Six months from now, the system has failed. Write five different reasons, each with the check or rule that would catch it.",
        fields: [
          { id: "p1", label: "Reason 1 and its check", kind: "text", default: "", placeholder: "e.g. Live costs were higher → compare fills with the cost model every week", required: true },
          { id: "p2", label: "Reason 2 and its check", kind: "text", default: "", placeholder: "e.g. The regime changed → regime label on every trade", required: true },
          { id: "p3", label: "Reason 3 and its check", kind: "text", default: "", placeholder: "e.g. I skipped signals in a drawdown → KPI: signals taken", required: true },
          { id: "p4", label: "Reason 4 and its check", kind: "text", default: "", placeholder: "e.g. The edge was a fit → R0 control and walk-forward on file", required: true },
          { id: "p5", label: "Reason 5 and its check", kind: "text", default: "", placeholder: "e.g. I raised size early → size only through the gates", required: true },
        ],
        correct: "Saved with your go-live card. Each reason now has a check you can run.",
        concept: "premortem",
      },
    ],
    check: ["q-3.11.10-1", "q-3.11.10-2", "q-3.11.10-3"],
    recap: {
      takeaways: [
        "Write gates and kill criteria before going live, from Monte Carlo bands: kill beyond the 99th percentile.",
        "A premortem lists why the system failed, before it trades. Each reason becomes a check.",
        "Change rules only by hypothesis, evidence threshold, simulator test and a new plan version.",
      ],
    },
  },
};

// ─── Check questions ─────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 3.11.1
  {
    id: "q-3.11.1-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which hypothesis could a test prove wrong?",
    options: [
      { id: "a", label: "Price respects key levels whenever smart money defends them.", rationale: "It has an escape clause: any failed level can be blamed on smart money not defending it. No result could refute it." },
      { id: "b", label: "After a 20-bar breakout with a rising 50-bar average, +2R comes before −1R in over 40% of trades within 10 bars." },
      { id: "c", label: "Markets move in waves, though the count can be revised as new prices arrive.", rationale: "Revising the count after the fact fits any path. A claim that adapts to every outcome can't be wrong." },
      { id: "d", label: "Good setups work when the trader is in the right state of mind.", rationale: "Neither 'good setup' nor 'right state' is defined, so every loss can be explained away." },
    ],
    correct: "b",
    explanation: "Only b names a condition, an outcome, a horizon and a threshold that the data could fail to meet. The others can explain any result after the fact, so no test can reject them.",
    lesson: "3.11.1",
    concepts: ["edge-hypothesis", "falsifiability"],
  },
  {
    id: "q-3.11.1-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why test a new rule in R, with a fixed 1R per trade, before adding any position sizing?",
    options: [
      { id: "a", label: "Sizing can hide a weak edge or inflate a strong one, so the signal must be judged on its own first" },
      { id: "b", label: "R results are always larger than percentage results", rationale: "R is a unit of risk. It doesn't make results bigger; it makes trades comparable, whatever their stop distance." },
      { id: "c", label: "Sizing doesn't matter once the edge is positive", rationale: "Sizing matters a lot: it sets drawdowns and growth (3.12). It's designed second, not ignored." },
      { id: "d", label: "A fixed size removes the need to count costs", rationale: "Costs still apply to every trade. In R they're the cost per unit divided by the stop distance." },
    ],
    correct: "a",
    explanation: "Compounding and sizing rules change the equity curve without changing the signal. A weak edge with aggressive sizing can look strong, and a strong one can look poor after a bad run. Judge the signal in R first, then design the sizing.",
    lesson: "3.11.1",
    concepts: ["codified-rules", "r-multiple"],
    hints: ["Think about what compounding does to an equity curve.", "Separate 'does the signal work?' from 'how much do I bet?'"],
  },
  {
    id: "q-3.11.1-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "Your breakout test on LABA shows its best trade on 3 March: the price jumped from 40.00 to 80.00 overnight, far above every earlier high, and the trade made +12R. LABA did a 1-for-2 reverse split that day.",
    prompt: "What's wrong with this result?",
    options: [
      { id: "a", label: "The prices weren't adjusted for the split: the breakout never happened, and the trade must go" },
      { id: "b", label: "Nothing: reverse splits often come before rallies", rationale: "A reverse split merges shares and doubles the price. Nothing of value changed, so no holder earned +12R from it." },
      { id: "c", label: "The stop would have filled worse after the gap", rationale: "There was no real gap. The price doubled on paper because each new share replaced two old ones." },
      { id: "d", label: "It's survivorship bias", rationale: "Survivorship is about missing instruments. This is a data error inside an instrument that is in the test." },
    ],
    correct: "a",
    explanation: "Unadjusted data make a corporate action look like a price move. Adjust the history for splits and dividends, or the test trades events that never happened. The biggest single trades are the first place to look for data errors.",
    lesson: "3.11.1",
    concepts: ["corporate-actions"],
    hints: ["What does a reverse split do to the share price?", "Would anyone holding the stock have earned that move?"],
  },
  // 3.11.2
  {
    id: "q-3.11.2-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "LABX trades near 80.00. The spread is 0.10, commission is 0.05% of each fill, and your stop is 1.60 away. What do costs take from each trade, in R?",
    numeric: { answer: 0.11, tolerance: 0.01, unit: "R" },
    explanation: "Per unit: the spread, 0.10, plus 0.05% of 80.00 on entry and on exit, 0.04 each: 0.18. Divided by the 1.60 stop: about 0.11R. A tighter stop would make the same costs a bigger share of R.",
    lesson: "3.11.2",
    concepts: ["costs-in-r", "breakeven-cost"],
    hints: ["Add the spread and both commissions, per unit.", "Commission per fill: 0.05% of 80.00 = 0.04. Then divide by the stop distance."],
    vary: {
      fields: { px: [20, 200, 5], sp: [0.04, 0.3, 0.02], st: [0.5, 5, 0.1] },
      constraints: ["(sp + 2 * px * 0.0005) / st >= 0.03", "(sp + 2 * px * 0.0005) / st <= 0.6"],
      answer: "round((sp + 2 * px * 0.0005) / st, 2)",
      prompt: "LABX trades near {px:2}. The spread is {sp:2}, commission is 0.05% of each fill, and your stop is {st:2} away. What do costs take from each trade, in R?",
      explanation: "Per unit: the spread, {sp:2}, plus 0.05% of {px:2} on entry and on exit, {px * 0.0005:3} each: {sp + 2 * px * 0.0005:3}. Divided by the {st:2} stop: {answer:2}R.",
      hint: "({sp:2} + 2 × {px * 0.0005:3}) ÷ {st:2}.",
    },
  },
  {
    id: "q-3.11.2-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "In your backtest, one daily bar touched both your stop and your target. The bar data can't say which came first. What should the test assume?",
    options: [
      { id: "a", label: "The target, since the bar closed above the entry", rationale: "The close says nothing about the order inside the bar. Assuming the better outcome flatters every ambiguous trade." },
      { id: "b", label: "The stop, unless finer data show otherwise" },
      { id: "c", label: "Half a win and half a loss", rationale: "No real trade ends half and half, and splitting the difference still flatters when stops come first." },
      { id: "d", label: "Skip the trade", rationale: "Dropping trades you can't score removes losers selectively. Score it the conservative way instead." },
    ],
    correct: "b",
    explanation: "Intrabar ambiguity is settled the conservative way: the stop first. If the system survives that, it survives reality. With intraday data you can check the real order.",
    lesson: "3.11.2",
    concepts: ["fill-assumptions"],
    hints: ["Which assumption could only make the test look worse than reality, never better?"],
  },
  {
    id: "q-3.11.2-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A backtest fills every buy limit as soon as a bar's low touches the limit price. In the test, 70% of the limit entries filled at the exact low of the bar.",
    prompt: "Why is this optimistic?",
    options: [
      { id: "a", label: "Limit prices are always worse than the market", rationale: "A buy limit is a better price than the market. The question is whether it would have filled at all." },
      { id: "b", label: "At a touch, orders ahead of yours in the queue may take all the volume; you might get nothing" },
      { id: "c", label: "Limit orders pay a higher commission", rationale: "Commission is the same 0.05% per fill. The issue is the fill itself." },
      { id: "d", label: "It isn't: a touch always means a fill", rationale: "A touch means some volume traded at that price, not that it reached your order. Many orders at the low never fill." },
    ],
    correct: "b",
    explanation: "Orders at one price fill in queue order. When price only touches your limit, the orders ahead of you may absorb the volume, and the touch is often the turn: the fills you'd miss are the best trades. Count a limit filled only when price trades through it.",
    lesson: "3.11.2",
    concepts: ["fill-assumptions", "queue-priority"],
    hints: ["Who gets filled first at a price?", "Which limit orders fill at the exact low, and which trades would you miss?"],
  },
  // 3.11.3
  {
    id: "q-3.11.3-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which rule uses information from the future?",
    options: [
      { id: "a", label: "Buy at the next open when today closes above the 20-day high", rationale: "Today's close is known before the next open. This one is clean." },
      { id: "b", label: "Buy at today's open when today's range is above 2 ATR" },
      { id: "c", label: "Sell at the next open when the close falls below the 10-day low", rationale: "The signal uses closes up to today and acts after the close: no leak." },
      { id: "d", label: "Stop 1 ATR(14) below the entry price", rationale: "The entry and the past ATR are both known when the order is placed." },
    ],
    correct: "b",
    explanation: "Today's range is known only when the day ends, but the rule buys at the open. A backtest can do that; a trader can't. Ask of every input when exactly it was known.",
    lesson: "3.11.3",
    concepts: ["look-ahead-bias"],
  },
  {
    id: "q-3.11.3-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "A value rule is tested only on stocks listed today. Compared with a test on the full history, delisted stocks included, how will its results tend to look?",
    options: [
      { id: "a", label: "Better than the truth" },
      { id: "b", label: "Worse than the truth", rationale: "The missing stocks are mostly failures. Removing them removes losses, so results look better, not worse." },
      { id: "c", label: "The same: delisted stocks are a small share", rationale: "In the lesson's universe, 12 of 50 were delisted, and the rule's return fell from +18.9% to +4.8% a year with them included." },
      { id: "d", label: "It depends only on the costs", rationale: "Costs are a separate check. Survivorship changes which stocks are in the test." },
    ],
    correct: "a",
    explanation: "Survivors are the stocks that didn't fail. Rules that buy what has fallen, such as value and mean reversion, gain the most from dropping the dead: in the lesson, +18.9% a year on survivors against +4.8% on the full universe.",
    lesson: "3.11.3",
    concepts: ["survivorship-bias"],
    hints: ["What do the delisted stocks have in common?", "Which stocks would a 'buy the cheapest' rule have held?"],
  },
  {
    id: "q-3.11.3-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A test buys stocks whose quarterly earnings beat the same quarter a year earlier by 20%, on the report date. It uses a data file of earnings as they stand today, after several companies restated past quarters.",
    prompt: "What's the problem?",
    options: [
      { id: "a", label: "Look-ahead: on the report date, only the first, unrevised figures existed" },
      { id: "b", label: "Survivorship: restated companies are missing", rationale: "The companies are in the test. The problem is which version of their numbers it used." },
      { id: "c", label: "None, as long as costs are on", rationale: "Costs don't fix timing. The test trades on numbers nobody had on the report date." },
      { id: "d", label: "Overfitting to the 20% threshold", rationale: "That may be a second problem, but the first is the data: revised figures used as if they were known earlier." },
    ],
    correct: "a",
    explanation: "Restated figures are later information. Point-in-time data keep each number as first published, with its date, so the test sees only what a trader could have seen.",
    lesson: "3.11.3",
    concepts: ["look-ahead-bias"],
    hints: ["When were the restated figures published?", "Which version of the number existed on the report date?"],
  },
  // 3.11.4
  {
    id: "q-3.11.4-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does 'peeking' at the out-of-sample mean?",
    options: [
      { id: "a", label: "Looking at its results, then changing the rules" },
      { id: "b", label: "Running the final test once, with the rules fixed in advance", rationale: "That's the proper use of the hold-out: one run, rules frozen." },
      { id: "c", label: "Splitting the data in time order", rationale: "A split in time order is the right way to build a hold-out." },
      { id: "d", label: "Testing on a second market", rationale: "Another market is a robustness check, not a look at the hold-out." },
    ],
    correct: "a",
    explanation: "Any decision made after seeing hold-out results, a tweak, a filter, a new parameter, lets those results shape the rules. The hold-out becomes in-sample, and the log counts another trial.",
    lesson: "3.11.4",
    concepts: ["in-sample-out-of-sample"],
  },
  {
    id: "q-3.11.4-2",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "Your system's Sharpe ratio is about 1.0. Its standard error is about √((1 + Sharpe² ÷ 2) ÷ years). How many years of out-of-sample data bring the standard error down to 0.5?",
    numeric: { answer: 6, tolerance: 0.1, unit: "years" },
    explanation: "Square both sides: 1.5 ÷ years = 0.25, so years = 1.5 ÷ 0.25 = 6. Even then, the 95% range is 1.0 ± 0.98. Short out-of-sample periods can't tell a good system from a lucky one.",
    lesson: "3.11.4",
    concepts: ["in-sample-out-of-sample", "sample-size"],
    hints: ["Square both sides to remove the root.", "1 + 1.0² ÷ 2 = 1.5, and 0.5² = 0.25. Then 1.5 ÷ 0.25."],
    vary: {
      fields: { s10: [5, 20, 5], e100: [30, 70, 5] },
      answer: "round((1 + s10 * s10 / 200) / (e100 * e100 / 10000), 1)",
      prompt: "Your system's Sharpe ratio is about {s10 / 10:1}. Its standard error is about √((1 + Sharpe² ÷ 2) ÷ years). How many years of out-of-sample data bring the standard error down to {e100 / 100:2}?",
      explanation: "Square both sides: {1 + s10 * s10 / 200:3} ÷ years = {e100 / 100:2}² = {e100 * e100 / 10000:4}. Years = {1 + s10 * s10 / 200:3} ÷ {e100 * e100 / 10000:4} = {answer:1}.",
      hint: "{1 + s10 * s10 / 200:3} ÷ {e100 * e100 / 10000:4}.",
    },
  },
  {
    id: "q-3.11.4-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "Dana tuned a system on 2016–2022. The 2023–2025 hold-out lost money. She changed the stop from 1.5 ATR to 2 ATR, re-ran the hold-out, and it now shows a profit. Her report says: 'validated out of sample'.",
    prompt: "What should her research log show, and what are 2023–2025 now?",
    options: [
      { id: "a", label: "One more trial; 2023–2025 are now in-sample and can't validate anything" },
      { id: "b", label: "Nothing new; 2023–2025 are still a clean hold-out", rationale: "The new stop was chosen because of the hold-out's result. Those years now helped build the rule." },
      { id: "c", label: "One more trial, but 2023–2025 still count as out-of-sample", rationale: "Logging the trial is right, but the years are spent: they shaped the new stop." },
      { id: "d", label: "Nothing: a stop change isn't a new trial", rationale: "Every change tested on the data is a trial. A stop change can turn a loser into a winner purely by fitting." },
    ],
    correct: "a",
    explanation: "Re-optimising after a failed hold-out uses it for development. The log adds a trial, and the system needs data it has never seen: a forward test (3.11.10) or a walk-forward (3.11.6).",
    lesson: "3.11.4",
    concepts: ["in-sample-out-of-sample", "research-log"],
    hints: ["Did the hold-out influence the new stop?", "Once data shape a rule, can they still test it?"],
  },
  // 3.11.5
  {
    id: "q-3.11.5-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which backtest shows the classic signs of overfitting?",
    options: [
      { id: "a", label: "Three parameters, 400 trades over ten years, similar results on nearby settings", rationale: "Few parameters, many trades and a plateau are the signs of a sound test." },
      { id: "b", label: "Seven tuned parameters, 38 trades, an almost straight equity curve" },
      { id: "c", label: "Two parameters, a modest Sharpe of 0.6, tested on two markets", rationale: "Modest, simple and tested across markets: the opposite of the warning signs." },
      { id: "d", label: "A rule that loses about its costs on R0", rationale: "That's what a clean rule should do on a random walk: no edge, minus costs." },
    ],
    correct: "b",
    explanation: "Many tuned parameters, few trades and a curve that's too smooth: seven parameters on 38 trades leave about 5 trades for each. Real edges in markets are noisy.",
    lesson: "3.11.5",
    concepts: ["overfitting"],
  },
  {
    id: "q-3.11.5-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "You try 10 versions of a strategy, all with zero true edge, on one year of daily data, and keep the best. What Sharpe ratio should you expect the winner to show, by luck alone?",
    options: [
      { id: "a", label: "About 0", rationale: "Each version's true Sharpe is 0, but you keep the best of 10. The maximum of ten noisy results sits well above zero." },
      { id: "b", label: "About 0.5", rationale: "Too low. With one year of data, each Sharpe has a standard error near 1, so the best of 10 lands around 1.5." },
      { id: "c", label: "About 1.5" },
      { id: "d", label: "About 3", rationale: "Too high for 10 tries: even the best of 100 averages about 2.5." },
    ],
    correct: "c",
    explanation: "In 10,000 simulated trials, the best of 10 zero-edge strategies averaged a one-year Sharpe of 1.55; Bailey and colleagues' formula gives 1.57. The best of 100 reaches about 2.5. Count the tries before you judge the winner.",
    lesson: "3.11.5",
    concepts: ["overfitting", "multiple-testing"],
    hints: ["One year of data gives each Sharpe a standard error of about 1.", "You keep the maximum of 10 draws, not a typical one."],
  },
  {
    id: "q-3.11.5-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A system made +0.20R a trade over 150 trades. Its three worst losses all came on Fridays, so you add 'no trades on Fridays'. The backtest now shows +0.29R.",
    prompt: "What happened?",
    options: [
      { id: "a", label: "Data snooping: the filter was chosen to remove known losers, so most of the gain is fit" },
      { id: "b", label: "A real discovery: Fridays are bad for this system", rationale: "Three trades are not evidence of a Friday effect. The filter was picked after seeing which trades lost." },
      { id: "c", label: "Nothing important: one filter can't overfit", rationale: "A single filter chosen from the data can fit noise, especially one aimed at particular trades." },
      { id: "d", label: "The system is now more robust", rationale: "Robustness means surviving changes. Removing chosen losers does the opposite: it tailors the rule to past noise." },
    ],
    correct: "a",
    explanation: "The data chose the rule. Treat 'no Fridays' as a new hypothesis: log it as a trial and test it on data that played no part in finding it, or on R0, where a filter like this should add nothing.",
    lesson: "3.11.5",
    concepts: ["data-snooping", "overfitting"],
    hints: ["Was the filter suggested by a theory, or by the losing trades themselves?", "Where could you test it fairly?"],
  },
  // 3.11.6
  {
    id: "q-3.11.6-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "Over six walk-forward windows, the in-sample settings earned 20% a year on average, and the stitched out-of-sample segments 9% a year. What is the walk-forward efficiency?",
    numeric: { answer: 0.45, tolerance: 0.01, unit: "" },
    explanation: "WFE = out-of-sample annual return ÷ in-sample annual return = 9 ÷ 20 = 0.45. That's below the practitioners' rule of thumb of 0.5: a warning, not a verdict.",
    lesson: "3.11.6",
    concepts: ["walk-forward-analysis"],
    hints: ["The unseen result goes on top.", "9 ÷ 20."],
    vary: {
      fields: { is: [8, 30, 1], oos: [-4, 24, 1] },
      constraints: ["oos < is"],
      answer: "round(oos / is, 2)",
      prompt: "Over six walk-forward windows, the in-sample settings earned {is}% a year on average, and the stitched out-of-sample segments {oos}% a year. What is the walk-forward efficiency?",
      explanation: "WFE = out-of-sample ÷ in-sample annual return = {oos} ÷ {is} = {answer:2}. Practitioners often ask for 0.5 or more; it's a rule of thumb, not a standard.",
      hint: "{oos} ÷ {is}.",
    },
  },
  {
    id: "q-3.11.6-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "When does an anchored walk-forward window make more sense than a rolling one?",
    options: [
      { id: "a", label: "When you expect the market's behaviour to stay stable, and want settings that fit all the history" },
      { id: "b", label: "When the market changes regime often and old data mislead", rationale: "That's the case for rolling windows: they drop old data to adapt." },
      { id: "c", label: "When it gives the higher walk-forward efficiency", rationale: "Choosing the window type by its result is meta-overfitting. Choose it for a reason, before running." },
      { id: "d", label: "Always: more data is always better", rationale: "More data helps only if the past still resembles the present. Neither window type is better in general." },
    ],
    correct: "a",
    explanation: "Anchored windows keep the start fixed and grow, favouring stability. Rolling windows keep a fixed length and drop old data, favouring adaptation. Decide which assumption fits your market before you run the test.",
    lesson: "3.11.6",
    concepts: ["walk-forward-analysis"],
    hints: ["What does each window type do with the oldest data?"],
  },
  {
    id: "q-3.11.6-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A researcher ran walk-forward tests with windows of 1, 2, 3, 4 and 5 years. The 3-year run had a WFE of 0.72; the others were between 0.18 and 0.41. The report shows only the 3-year run.",
    prompt: "What's wrong?",
    options: [
      { id: "a", label: "Meta-overfitting: the walk-forward itself was tuned, and the other trials weren't reported" },
      { id: "b", label: "Nothing: 3 years is simply the best window", rationale: "The best of five runs is a selection. Its 0.72 includes luck, like any tuned parameter." },
      { id: "c", label: "A WFE of 0.72 is too high to be real", rationale: "0.72 isn't impossible. The problem is that it was picked as the best of five." },
      { id: "d", label: "Walk-forward tests need 10-year windows", rationale: "No window length is right in general. The error is choosing it after seeing the results." },
    ],
    correct: "a",
    explanation: "The walk-forward has settings of its own, and tuning them is overfitting one level up. Fix the window length for a stated reason, log all five runs as trials, and report all of them.",
    lesson: "3.11.6",
    concepts: ["walk-forward-analysis", "data-snooping"],
    hints: ["How many walk-forward runs were tried?", "Is the best of five a fair estimate of one run?"],
  },
  // 3.11.7
  {
    id: "q-3.11.7-1",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 1,
    prompt: "What's the difference between reshuffling and bootstrapping a trade list?",
    options: [
      { id: "a", label: "Reshuffling keeps the same trades in a new order; bootstrapping draws trades with replacement, so the total changes too" },
      { id: "b", label: "They are the same thing", rationale: "Reshuffling never changes which trades are in the list; bootstrapping can repeat some and leave others out." },
      { id: "c", label: "Bootstrapping keeps the order; reshuffling changes the trades", rationale: "It's the other way round: reshuffling changes only the order." },
      { id: "d", label: "Reshuffling adds new random trades", rationale: "No new trades are created. Monte Carlo reuses the trades you have." },
    ],
    correct: "a",
    explanation: "A reshuffle keeps the final profit and changes the path, so it's used to plan drawdowns. A bootstrap samples with replacement, so the final result varies as well: it shows how far the result itself could have landed.",
    lesson: "3.11.7",
    concepts: ["monte-carlo-resampling"],
  },
  {
    id: "q-3.11.7-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "Your Monte Carlo puts the 95th-percentile worst drawdown at 13.5R. You risk 1% of the account per trade. Roughly how deep a drawdown, in %, should your plan accept?",
    numeric: { answer: 13.5, tolerance: 0.1, unit: "%" },
    explanation: "1R = 1% of the account, so 13.5R ≈ 13.5%, a little less with risk taken on a shrinking account. Plan for that, not for the single backtest's drawdown.",
    lesson: "3.11.7",
    concepts: ["monte-carlo-resampling", "drawdown"],
    hints: ["1R is your risk per trade as a share of the account.", "13.5 × 1%."],
    vary: {
      fields: { dd2: [16, 50, 1], r4: [1, 8, 1] },
      answer: "round(dd2 / 2 * r4 / 4, 2)",
      prompt: "Your Monte Carlo puts the 95th-percentile worst drawdown at {dd2 / 2:1}R. You risk {r4 / 4:2}% of the account per trade. Roughly how deep a drawdown, in %, should your plan accept?",
      explanation: "1R = {r4 / 4:2}% of the account, so {dd2 / 2:1}R ≈ {answer:2}%, a little less with risk taken on a shrinking account. Plan for that, not for the single backtest's drawdown.",
      hint: "{dd2 / 2:1} × {r4 / 4:2}%.",
    },
  },
  {
    id: "q-3.11.7-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario: "The reference system's Monte Carlo: 95th-percentile worst drawdown 13.5R, 99th 16.5R. Its backtest's worst was 7R. Live, after 60 trades executed by the rules, you're 11R below your peak.",
    prompt: "What do you do?",
    options: [
      { id: "a", label: "Keep executing, with the plan's drawdown tiers: 11R is inside normal variance" },
      { id: "b", label: "Stop the system: 11R is deeper than the backtest's 7R", rationale: "The backtest was one ordering. 71.4% of reshuffles of the same trades went deeper than 7R." },
      { id: "c", label: "Double the size to recover faster", rationale: "Raising size in a drawdown turns variance into ruin risk. The tiers cut risk here; they never raise it." },
      { id: "d", label: "Change the stop and the target", rationale: "Changing rules mid-drawdown fits the plan to noise. Changes go through the governance process (3.11.10)." },
    ],
    correct: "a",
    explanation: "11R sits below the 95th percentile, 13.5R: painful, but inside the corridor. Follow the plan's drawdown tiers, check your process, and keep executing. The kill switch waits beyond 16.5R.",
    lesson: "3.11.7",
    concepts: ["expectation-corridor", "drawdown"],
    hints: ["Compare 11R with the percentiles, not with the backtest.", "Where does the kill switch sit?"],
  },
  // 3.11.8
  {
    id: "q-3.11.8-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Setting A earns +0.18R a trade, but its neighbours earn far less. Setting B earns +0.13R, and its neighbours earn the same. Which do you trade?",
    options: [
      { id: "a", label: "A: it has the higher result", rationale: "The best cell of a grid is partly luck. Neighbours far below it suggest a spike that won't repeat." },
      { id: "b", label: "B: it sits on a plateau" },
      { id: "c", label: "Either: both are positive", rationale: "Both are positive in this sample. The question is which is more likely to stay positive, and the neighbours answer it." },
      { id: "d", label: "Neither: optimise further", rationale: "More optimisation makes the spike problem worse. Choose on a plateau, then stress-test." },
    ],
    correct: "b",
    explanation: "A plateau, where nearby settings behave alike, suggests the rule captures structure. An isolated peak suggests it captured noise. The course's design rule asks for neighbours averaging at least 80% of the chosen cell.",
    lesson: "3.11.8",
    concepts: ["parameter-plateau"],
  },
  {
    id: "q-3.11.8-2",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "You step a lookback by 10% each time: 10, 11, 12.1, 13.3 and so on. What's the next value after 13.3?",
    numeric: { answer: 14.6, tolerance: 0.1, unit: "bars" },
    explanation: "Each step multiplies by 1.1: 13.3 × 1.1 = 14.6. Steps in percent give short and long lookbacks the same relative attention.",
    lesson: "3.11.8",
    concepts: ["parameter-plateau"],
    hints: ["A 10% step multiplies by 1.1.", "13.3 × 1.1."],
    vary: {
      fields: { x10: [100, 600, 1] },
      answer: "round(x10 / 10 * 1.1, 1)",
      prompt: "You step a lookback by 10% each time. What's the next value after {x10 / 10:1}?",
      explanation: "Each step multiplies by 1.1: {x10 / 10:1} × 1.1 = {answer:1}. Steps in percent give short and long lookbacks the same relative attention.",
      hint: "{x10 / 10:1} × 1.1.",
    },
  },
  {
    id: "q-3.11.8-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A system's profit factor is 2.4. Without its best 5% of trades, it falls to 1.1.",
    prompt: "How should you read this?",
    options: [
      { id: "a", label: "Normal for a trend follower, whose edge lives in rare big winners; a warning for a mean reverter, which should earn through many small gains" },
      { id: "b", label: "The system is broken, whatever its type", rationale: "Trend following depends on a few large winners by design. Losing most of the profit factor without them is expected." },
      { id: "c", label: "Fine for any system: 1.1 is still above 1", rationale: "For a mean reverter, needing a handful of outliers means the edge isn't where its design says it is." },
      { id: "d", label: "The best trades should be removed from the results for good", rationale: "Outliers are part of the return. The test measures how much the system depends on them; it doesn't delete them." },
    ],
    correct: "a",
    explanation: "Outlier dependence has to match the system's type. Trend followers live on rare large winners, so the drop is normal. A mean reverter's edge is many small wins; if it needs its best 5% to stay above 1, it's fragile.",
    lesson: "3.11.8",
    concepts: ["robustness-testing", "performance-metrics"],
    hints: ["Where should each type's profit come from?", "Many small wins, or a few large ones?"],
  },
  // 3.11.9
  {
    id: "q-3.11.9-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "Ten bars after its entries, a setup's average MFE is 1.8 ATR and its average MAE is 1.2 ATR. What's its edge ratio?",
    numeric: { answer: 1.5, tolerance: 0.01, unit: "" },
    explanation: "E-ratio = average MFE ÷ average MAE = 1.8 ÷ 1.2 = 1.5. Compare it with random entries on the same data: about 1 in a flat market, more in a rising one.",
    lesson: "3.11.9",
    concepts: ["edge-ratio", "mae-mfe"],
    hints: ["The favourable excursion goes on top.", "1.8 ÷ 1.2."],
    vary: {
      fields: { mfe: [0.8, 3, 0.1], mae: [0.8, 2.5, 0.1] },
      answer: "round(mfe / mae, 2)",
      prompt: "Ten bars after its entries, a setup's average MFE is {mfe:1} ATR and its average MAE is {mae:1} ATR. What's its edge ratio?",
      explanation: "E-ratio = average MFE ÷ average MAE = {mfe:1} ÷ {mae:1} = {answer:2}. Compare it with random entries on the same data.",
      hint: "{mfe:1} ÷ {mae:1}.",
    },
  },
  {
    id: "q-3.11.9-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "What do random-entry twins keep the same as your system?",
    options: [
      { id: "a", label: "The exits, the market and about the number of trades; only the entries are random" },
      { id: "b", label: "The entries; only the exits are random", rationale: "It's the other way round. Twins test the entry, so the entry is what's randomised." },
      { id: "c", label: "Nothing: they're completely random strategies", rationale: "Twins keep your exits, so any difference comes from the entry alone." },
      { id: "d", label: "The final profit", rationale: "The profit is what's being compared, so it can't be held fixed." },
    ],
    correct: "a",
    explanation: "Twins share everything except the entry: the same exits, the same market, a similar number of trades. Your percentile among them then measures what the entry adds.",
    lesson: "3.11.9",
    concepts: ["random-entry-benchmark"],
  },
  {
    id: "q-3.11.9-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A breakout system made +25% over five years. Against 1,000 random-entry twins with the same exits, it ranks at the 60th percentile. The market rose steadily over the period.",
    prompt: "What's the verdict?",
    options: [
      { id: "a", label: "The entry adds little or nothing: exits and the market's drift explain most of the profit" },
      { id: "b", label: "A strong entry edge: +25% is a good result", rationale: "The twins made similar money with random entries. The result is good; the entry isn't what made it." },
      { id: "c", label: "The exits are useless", rationale: "Twins with the same exits did well too, so if anything, the exits and the drift did the work." },
      { id: "d", label: "Not enough information: percentiles don't measure edge", rationale: "The percentile among twins is exactly the measure of entry edge, and 60 is close to the 50 of a random entry." },
    ],
    correct: "a",
    explanation: "At the 60th percentile, the system did about as well as random entries with its exits. In a rising market, buying almost anywhere paid. Credit the drift and the exits, not the entry, and compare with buy-and-hold.",
    lesson: "3.11.9",
    concepts: ["random-entry-benchmark", "passive-benchmark"],
    hints: ["Where would a random entry rank among its twins?", "What did the market do over those years?"],
  },
  // 3.11.10
  {
    id: "q-3.11.10-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which condition should trigger the reference system's kill switch?",
    options: [
      { id: "a", label: "A drawdown beyond the 99th percentile of its Monte Carlo, 16.5R" },
      { id: "b", label: "Three losses in a row", rationale: "With 60% losers, a run of three is common: from any trade, the chance is 0.6³ = 21.6%." },
      { id: "c", label: "A drawdown deeper than the backtest's 7R", rationale: "The backtest's 7R was one ordering; 71.4% of reshuffles went deeper. A kill there stops a healthy system." },
      { id: "d", label: "A losing month", rationale: "Losing months are part of variance. The kill switch watches for results that variance can't explain." },
    ],
    correct: "a",
    explanation: "A kill switch fires on breakage, not bad luck: a drawdown past the 99th percentile, or an expectancy interval entirely below zero. Milder setbacks belong to the drawdown tiers.",
    lesson: "3.11.10",
    concepts: ["kill-switch"],
  },
  {
    id: "q-3.11.10-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which order follows rule-change governance?",
    options: [
      { id: "a", label: "Hypothesis → evidence threshold → simulator test → new plan version" },
      { id: "b", label: "Simulator test → hypothesis → new plan version → evidence threshold", rationale: "Testing before stating a hypothesis invites fishing. The hypothesis comes first, and the threshold before the test." },
      { id: "c", label: "New plan version → simulator test → hypothesis → evidence threshold", rationale: "Changing the plan first and justifying it later is exactly what governance prevents." },
      { id: "d", label: "Evidence threshold → new plan version → hypothesis → simulator test", rationale: "The plan changes last, after the test has met the threshold." },
    ],
    correct: "a",
    explanation: "State the change and why it should help; fix how much evidence you'll need, such as 30–50 trades or a walk-forward; test it in the simulator; then release a new version and compare before and after with intervals.",
    lesson: "3.11.10",
    concepts: ["rule-change-governance"],
    hints: ["What should come before any test?", "When does the plan itself change?"],
  },
  {
    id: "q-3.11.10-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "Three trades in a row hit their stops. You think: 'The stops are too tight. I'll widen them from 1 ATR to 1.5 ATR from tomorrow.'",
    prompt: "What does rule-change governance say?",
    options: [
      { id: "a", label: "Log it as a hypothesis, set an evidence threshold, test it in the simulator, and change the plan only through a new version" },
      { id: "b", label: "Widen them: three stops in a row prove they're too tight", rationale: "Three losses are ordinary for a system that wins 40% of the time. Changing rules on them fits the plan to noise." },
      { id: "c", label: "Tighten them instead, to lose less", rationale: "Any change made because of the last three trades is the same mistake, in the other direction." },
      { id: "d", label: "Never change a rule", rationale: "Rules can change, through a process: hypothesis, threshold, test, new version." },
    ],
    correct: "a",
    explanation: "Changing a rule after a few losses is data snooping on your own results. A wider stop may be better, but only a test with enough trades can say so. Until then, the current version runs.",
    lesson: "3.11.10",
    concepts: ["rule-change-governance", "mistake-vs-variance"],
    hints: ["How unusual are three losses for this system?", "What steps does a change go through?"],
  },
];

// ─── Terms and concepts introduced in 3.11 ───────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "edge-hypothesis",
    term: "Edge hypothesis",
    definition: "A falsifiable statement of why a pattern should pay: the mechanism, the conditions, the expected effect and horizon, and who is on the other side of the trade.",
    plain: "A testable reason why a pattern should pay, and who loses to you.",
    related: ["falsifiable", "testable-hypothesis", "research-log", "backtest"],
    lesson: "3.11.1",
  },
  {
    id: "research-log",
    term: "Research log",
    definition: "A permanent, append-only record of every hypothesis, test, parameter change and result, with the running number of trials.",
    plain: "A permanent record of every idea, test and change, including the number of trials.",
    related: ["edge-hypothesis", "data-snooping", "journal", "backtest"],
    lesson: "3.11.1",
  },
  {
    id: "point-in-time-data",
    term: "Point-in-time data",
    definition: "Data stored exactly as it was known on each past date, with publication dates, so later revisions and index changes can't leak into a test.",
    plain: "Data exactly as it was known on each past date, without later corrections.",
    related: ["look-ahead-bias", "survivorship-bias", "backtest"],
    lesson: "3.11.1",
  },
  {
    id: "next-bar-execution",
    term: "Next-bar execution",
    definition: "A fill rule that executes a signal at the open of the bar after the one that produced it, because the signal bar's close is known only when the bar ends.",
    plain: "Filling a signal at the next bar's open, not in the bar that produced it.",
    related: ["intrabar-ambiguity", "look-ahead-bias", "backtest", "fill"],
    lesson: "3.11.2",
  },
  {
    id: "intrabar-ambiguity",
    term: "Intrabar ambiguity",
    definition: "When one bar's range contains both the stop and the target, bar data can't show which was hit first; conservative tests assume the stop.",
    plain: "Not knowing whether the stop or the target was hit first inside one bar.",
    related: ["next-bar-execution", "stop-loss", "take-profit", "backtest"],
    lesson: "3.11.2",
  },
  {
    id: "breakeven-cost",
    term: "Breakeven cost",
    definition: "The cost per trade at which a strategy's net expectancy falls to zero. Divided by the current cost, it gives the breakeven cost multiple.",
    plain: "The cost per trade at which a strategy stops making money.",
    related: ["cost-drag", "cost-stress", "expectancy", "after-cost-expectancy"],
    lesson: "3.11.2",
  },
  {
    id: "cost-stress",
    term: "Cost stress",
    definition: "Re-running a backtest with costs raised, for example doubled, to check whether the edge survives wider spreads and slippage.",
    plain: "Re-running a backtest with higher costs to see whether the edge survives.",
    related: ["breakeven-cost", "stress-test", "slippage", "cost-drag"],
    lesson: "3.11.2",
  },
  {
    id: "delisting",
    term: "Delisting",
    definition: "The removal of a security from its exchange, often after failure, a takeover or a breach of listing rules. Delisted securities vanish from lists of current instruments.",
    plain: "A stock removed from its exchange, often after failure or a takeover.",
    related: ["survivorship-bias", "point-in-time-data"],
    lesson: "3.11.3",
  },
  {
    id: "in-sample",
    term: "In-sample",
    definition: "The part of the data used to develop and tune a strategy. Results there are biased upward by the tuning.",
    plain: "The data used to build and tune a strategy.",
    related: ["out-of-sample", "hold-out", "overfitting"],
    lesson: "3.11.4",
  },
  {
    id: "hold-out",
    term: "Hold-out",
    definition: "A later stretch of data set aside, untouched, for one final out-of-sample test once development is finished.",
    plain: "The part of the data set aside for the out-of-sample test.",
    related: ["in-sample", "out-of-sample", "research-log"],
    lesson: "3.11.4",
  },
  {
    id: "overfitting",
    term: "Overfitting",
    definition: "Tuning rules to the noise of one sample, so they describe past accidents rather than a lasting structure and fail on new data.",
    plain: "Tuning rules to past noise so they fail on new data.",
    related: ["degrees-of-freedom", "data-snooping", "out-of-sample", "parameter-plateau"],
    lesson: "3.11.5",
    aka: ["Curve fitting"],
  },
  {
    id: "data-snooping",
    term: "Data snooping",
    definition: "Testing many ideas or tweaks on the same data until one looks good by chance. The more trials, the better the best one looks.",
    plain: "Testing so many ideas on the same data that one works by luck.",
    related: ["overfitting", "research-log", "random-walk-control"],
    lesson: "3.11.5",
  },
  {
    id: "degrees-of-freedom",
    term: "Degrees of freedom",
    definition: "The number of choices a strategy can tune, such as parameters, filters, anchors and timeframes. Each one gives a test another way to fit noise.",
    plain: "The number of choices and parameters a strategy can tune.",
    related: ["overfitting", "data-snooping"],
    lesson: "3.11.5",
  },
  {
    id: "random-walk-control",
    term: "Random-walk control",
    definition: "Running the same test on random-walk data, where no rule has an edge, to check that the apparent edge disappears. An edge there signals a leak or a fit.",
    plain: "Running the same test on random data to check that the 'edge' disappears.",
    related: ["random-walk", "look-ahead-bias", "overfitting"],
    lesson: "3.11.5",
  },
  {
    id: "walk-forward-analysis",
    term: "Walk-forward analysis",
    definition: "Repeatedly tuning a strategy on one window and testing it on the next unseen window, then rolling forward and joining only the unseen segments.",
    plain: "Tune on one period, test on the next unseen one, then roll forward.",
    related: ["walk-forward-efficiency", "anchored-window", "rolling-window", "out-of-sample"],
    lesson: "3.11.6",
  },
  {
    id: "walk-forward-efficiency",
    term: "Walk-forward efficiency",
    definition: "The annualised out-of-sample return of a walk-forward test divided by the annualised in-sample return. 0.5 or more is a practitioners' rule of thumb, not a standard.",
    plain: "Out-of-sample return divided by in-sample return.",
    related: ["walk-forward-analysis", "in-sample", "out-of-sample"],
    lesson: "3.11.6",
    aka: ["WFE"],
  },
  {
    id: "anchored-window",
    term: "Anchored window",
    definition: "A walk-forward window that always starts at the beginning of the data and grows by one step each time.",
    plain: "A walk-forward window that always starts at the beginning of the data.",
    related: ["walk-forward-analysis", "rolling-window"],
    lesson: "3.11.6",
  },
  {
    id: "rolling-window",
    term: "Rolling window",
    definition: "A walk-forward window of fixed length that drops its oldest data as it moves forward.",
    plain: "A walk-forward window of fixed length that drops old data as it moves.",
    related: ["walk-forward-analysis", "anchored-window"],
    lesson: "3.11.6",
  },
  {
    id: "monte-carlo",
    term: "Monte Carlo",
    definition: "Running many random simulations, such as reshuffles or resamples of a trade list, to see the range of outcomes a process can produce.",
    plain: "Running many random simulations to see the range of possible outcomes.",
    related: ["reshuffle", "fan-chart", "percentile", "drawdown"],
    lesson: "3.11.7",
  },
  {
    id: "reshuffle",
    term: "Reshuffle",
    definition: "Putting the same list of trades in a new random order. The total stays the same, while the path and the drawdowns change.",
    plain: "Putting the same trades in a new random order.",
    related: ["monte-carlo", "max-drawdown"],
    lesson: "3.11.7",
  },
  {
    id: "fan-chart",
    term: "Fan chart",
    definition: "A chart of many simulated equity paths, summarised by percentile bands such as the 5th, 50th and 95th.",
    plain: "A chart of many simulated paths with percentile bands.",
    related: ["monte-carlo", "percentile"],
    lesson: "3.11.7",
  },
  {
    id: "expectation-corridor",
    term: "Expectation corridor",
    definition: "The band of results a validated system should produce by chance alone, taken from its Monte Carlo percentiles. Results inside it are variance; results outside it need investigating.",
    plain: "The range a system's results should stay within by chance alone.",
    related: ["monte-carlo", "percentile", "variance", "kill-switch"],
    lesson: "3.11.7",
  },
  {
    id: "percentile",
    term: "Percentile",
    definition: "The value below which a given percentage of outcomes fall. A 95th-percentile drawdown is deeper than 95% of the simulated drawdowns.",
    plain: "The value below which a given percentage of outcomes fall.",
    related: ["monte-carlo", "fan-chart"],
    lesson: "3.11.7",
  },
  {
    id: "robustness",
    term: "Robustness",
    definition: "The quality of results that hold up when conditions change a little: other parameters, higher costs, added noise, other periods or markets.",
    plain: "Results that hold up when conditions change a little.",
    related: ["stress-test", "parameter-plateau", "overfitting"],
    lesson: "3.11.8",
  },
  {
    id: "parameter-plateau",
    term: "Parameter plateau",
    definition: "A broad region of parameter values with similar results, preferred to an isolated peak that its neighbours don't support.",
    plain: "A wide area of settings that all give similar results.",
    related: ["parameter-grid", "robustness", "overfitting"],
    lesson: "3.11.8",
  },
  {
    id: "stress-test",
    term: "Stress test",
    definition: "Re-running a backtest under harsher conditions, such as doubled costs, removed best trades, noisier prices or a later start, to see whether the edge survives.",
    plain: "Checking results under harsher conditions, such as double costs.",
    related: ["robustness", "cost-stress", "outlier-dependence"],
    lesson: "3.11.8",
  },
  {
    id: "outlier-dependence",
    term: "Outlier dependence",
    definition: "The share of a strategy's profit that comes from a few very large trades, measured by removing the best trades, for example the top 5%.",
    plain: "How much of the total profit comes from a few very large trades.",
    related: ["profit-factor", "stress-test", "trend-following"],
    lesson: "3.11.8",
  },
  {
    id: "random-entry-benchmark",
    term: "Random-entry benchmark",
    definition: "Many twins of a strategy that keep its exits, market and trade count but enter at random. The strategy's percentile among them measures what its entry adds.",
    plain: "The same strategy with random entries, used to judge whether your entry adds anything.",
    related: ["edge-ratio", "benchmark", "buy-and-hold"],
    lesson: "3.11.9",
  },
  {
    id: "incubation",
    term: "Incubation",
    definition: "Forward-testing a validated system at small size before scaling up, with gates based on its Monte Carlo bands and its process measures.",
    plain: "Trading a new system small and forward before trusting it with full size.",
    related: ["go-live-gate", "kill-switch", "expectation-corridor"],
    lesson: "3.11.10",
  },
  {
    id: "kill-switch",
    term: "Kill switch",
    definition: "A condition written in advance that stops a system when its results fall outside what variance can explain, such as a drawdown past the 99th Monte Carlo percentile.",
    plain: "A rule written in advance that stops a system that has stopped working.",
    related: ["expectation-corridor", "incubation", "percentile"],
    lesson: "3.11.10",
  },
  {
    id: "premortem",
    term: "Premortem",
    definition: "Imagining that a plan has already failed and listing the reasons, before committing to it. Each reason becomes a check or a rule.",
    plain: "Imagining that a plan has already failed and listing why.",
    related: ["incubation", "trading-plan", "confirmation-bias"],
    lesson: "3.11.10",
  },
  {
    id: "go-live-gate",
    term: "Go-live gate",
    definition: "The conditions a system must meet before its size increases, such as results inside its Monte Carlo band and process KPIs on target after a set number of trades.",
    plain: "The conditions a system must meet before its size increases.",
    related: ["incubation", "kill-switch", "kpi"],
    lesson: "3.11.10",
  },
];

const CONCEPTS: Concept[] = [
  {
    id: "edge-hypothesis",
    name: "Edge hypothesis",
    category: "decision_making",
    summary: "A falsifiable statement of why a pattern should pay, under which conditions, and who is on the other side.",
    body: [
      "Write it before any test: because [mechanism], when [condition], price tends to [effect] over [horizon] in [market or regime]. The other side is [who], because [why]. A hypothesis that names its mechanism and its losers can be checked, and it narrows the search: you test what the story predicts, not every indicator setting.",
      "It must be falsifiable: some result has to count against it. Claims with escape clauses, such as relabelling after the fact, can't fail, so they can't be tested.",
    ],
    example: "After volatility contracts, breakouts in the direction of the higher-timeframe trend continue more often than chance over 10 bars, because stops cluster beyond the range; the other side is traders whose stops are run. Test: +2R before −1R in more than 40% of 20-bar breakouts with a rising 50-bar average.",
    related: ["falsifiability", "testable-reformulation", "codified-rules", "research-log"],
    missions: ["M02"],
    lessons: ["3.11.1"],
  },
  {
    id: "codified-rules",
    name: "Codified rules",
    category: "decision_making",
    summary: "Rules precise enough that two people, or a program, produce identical trades from the same data.",
    body: [
      "A codified rule has five parts: a condition, a trigger, a stop, an exit and, while testing, a fixed 1R size. Each part is a number, a level or a yes-or-no test that uses only data known at the decision.",
      "Vague words such as 'strong' or 'recent' let two traders build two different backtests from one idea, and let hindsight pick the better one.",
    ],
    example: "'Buy strong breakouts in an uptrend', read by two traders on the first 40 breakouts of a LABX test: 18 buys and 20 buys, only 13 in common. Codified: close above the 20-bar high, 50-bar average above its value 10 bars earlier, stop 1 ATR(14), exit at +2R or after 10 bars. Any reader takes the same trades.",
    related: ["if-then-rules", "edge-hypothesis", "look-ahead-bias", "setup-card"],
    missions: [],
    lessons: ["3.11.1"],
  },
  {
    id: "research-log",
    name: "Research log",
    category: "decision_making",
    summary: "An immutable record of every hypothesis, test and parameter change, including the number of trials.",
    body: [
      "The log starts before the first test, with the hypothesis, the prior, who is on the other side, the data and the target regime. Every run after that is a trial: the discarded ones, the extra looks at a hold-out and the walk-forward variants included.",
      "The trial count is what lets anyone judge a result: the best of 10 zero-edge tries shows a Sharpe near 1.5 by luck. Bailey and colleagues point out that a backtest reported without its number of trials can't be assessed for overfitting.",
    ],
    example: "Trials to date: 14. Entry 12 widened the stop from 1 to 1.5 ATR after the hold-out lost money, so the hold-out became in-sample and the system went back to forward testing on new data.",
    related: ["data-snooping", "in-sample-out-of-sample", "journaling", "rule-change-governance"],
    missions: [],
    lessons: ["3.11.1", "3.11.10"],
  },
  {
    id: "fill-assumptions",
    name: "Fill assumptions",
    category: "decision_making",
    summary: "The rules a backtest uses to turn signals into executions; conservative choices avoid flattering results.",
    body: [
      "Conservative fills: a signal from a bar's close fills at the next bar's open; when the stop and the target share a bar, the stop came first; a limit fills only if price trades through it; large orders may fill only in part.",
      "How much they matter depends on the stop's size relative to the bars. On the course system, with a 1-ATR stop and a 2R target, stop and target never shared a bar. On a tight variant they often did, and the optimistic rules invented most of the edge.",
    ],
    example: "Tight variant, stop 0.5 ATR, target 1R and a 5-bar exit, ten synthetic LABX years: 12 of 136 trades had stop and target in one bar. Gross result: +0.001R a trade with conservative fills, +0.156R with optimistic ones.",
    related: ["slippage", "trading-costs", "queue-priority", "look-ahead-bias"],
    missions: [],
    lessons: ["3.11.2"],
  },
  {
    id: "breakeven-cost",
    name: "Breakeven cost",
    category: "risk_management",
    summary: "The trading cost at which a strategy's net expectancy falls to zero.",
    body: [
      "Express costs in R, cost per unit ÷ stop distance; net expectancy = gross expectancy − costs in R. The breakeven cost multiple, gross expectancy ÷ current costs, says how many times today's costs the edge could absorb.",
      "A multiple near 1 leaves no room for a wider spread at the open, slippage on news or a worse broker. Stress every result at double costs.",
    ],
    example: "The course system: +0.255R gross, costs 0.114R a trade, net +0.141R. Breakeven multiple 0.255 ÷ 0.114 = 2.24. At double costs it nets +0.027R; at triple, −0.087R.",
    related: ["costs-in-r", "cost-drag", "trading-costs", "after-cost-evaluation"],
    missions: [],
    lessons: ["3.11.2"],
  },
  {
    id: "in-sample-out-of-sample",
    name: "In-sample / out-of-sample",
    category: "decision_making",
    summary: "Developing rules on one part of the data and testing them once on an untouched later part.",
    body: [
      "Split in time order, never at random: develop and tune on the earlier in-sample part, about 70%, and keep the later out-of-sample part locked. Unlock it once, with the pass rule written first.",
      "Any change made after looking at the out-of-sample turns it into in-sample and adds a trial to the log. And a short out-of-sample says little: one year at a Sharpe of 1.0 has a standard error of 1.22.",
    ],
    example: "The course system, lookback tuned on 7 of 10 synthetic years: +0.162R a trade in-sample. The 3 locked years: 24 trades at +0.066R, with a 95% interval from −0.52R to +0.65R. Positive, but not distinguishable from zero.",
    related: ["sample-size", "statistical-significance", "expectancy-confidence-interval", "overfitting", "research-log"],
    missions: [],
    lessons: ["3.11.4"],
  },
  {
    id: "overfitting",
    name: "Overfitting",
    category: "decision_making",
    summary: "Fitting rules to the noise of one sample so that results collapse on new data.",
    body: [
      "The signs: many tuned parameters, few trades for each, a curve that's too smooth. Keep optimised parameters to 3–5 and want many trades for each one.",
      "Selection alone creates impressive numbers: the best of 10 zero-edge strategies shows a one-year Sharpe near 1.55. As filters are added, in-sample results keep rising while out-of-sample results peak early and then fall. Every result should run next to an R0 random-walk control.",
    ],
    example: "On 120 seeded trending series, filters picked one at a time for the best in-sample result raised it from +0.12R to +0.81R a trade over eight filters. Out of sample: +0.08R, a peak of +0.14R at three filters, then +0.07R at eight.",
    related: ["data-snooping", "multiple-testing", "random-walk", "in-sample-out-of-sample"],
    missions: ["M02"],
    lessons: ["3.11.5"],
  },
  {
    id: "data-snooping",
    name: "Data snooping",
    category: "decision_making",
    summary: "Reusing the same data for many tests or tweaks until something looks good by chance.",
    body: [
      "Each test on the same data is another draw, and the best of many draws looks good by luck. Filters added to remove particular losing trades are the most common form: the data chose the rule.",
      "The defences: count every trial in the research log, test new ideas on data that played no part in finding them, and run the R0 control, where a snooped rule adds nothing.",
    ],
    example: "100 random moving-average rules on one R0 year: the best scored a Sharpe of 1.93, and +0.25 the next year. Across 500 such runs, the best year-one Sharpe averaged 1.30 and the next year's −0.08.",
    related: ["overfitting", "multiple-testing", "research-log", "random-walk"],
    missions: [],
    lessons: ["3.11.5"],
  },
  {
    id: "walk-forward-analysis",
    name: "Walk-forward analysis",
    category: "decision_making",
    summary: "Repeatedly optimising on one window and testing on the next unseen one, then joining the test segments.",
    body: [
      "Tune on a window, trade the next segment unseen, roll forward and repeat; only the unseen segments count. Walk-forward efficiency, out-of-sample annual return ÷ in-sample annual return, summarises how much survives. 0.5 is a practitioners' rule of thumb, not a standard.",
      "Watch the chosen parameters too: stable choices suggest structure, choices that jump across the range suggest noise. Choose anchored or rolling windows, and their length, before running: tuning the walk-forward is meta-overfitting.",
    ],
    example: "The course system, 4-year rolling windows, six unseen years: lookbacks 22, 22, 25, 20, 20, 20; in-sample +1.74R a year, out of sample +0.89R, WFE 0.51. On an R0 control the choices jumped from 10 to 40, and the unseen years lost 10.42R.",
    related: ["in-sample-out-of-sample", "overfitting", "parameter-plateau"],
    missions: [],
    lessons: ["3.11.6"],
  },
  {
    id: "monte-carlo-resampling",
    name: "Monte Carlo resampling",
    category: "risk_management",
    summary: "Reshuffling or bootstrapping a trade list to see the range of drawdowns and outcomes it could produce.",
    body: [
      "A reshuffle keeps the same trades in new orders: same total, different drawdowns. A bootstrap draws with replacement, so the total varies too. Plan drawdowns from the 95th percentile and kill switches from the 99th, not from the single backtest.",
      "Monte Carlo can't create an edge and inherits the backtest's fill and cost assumptions. Reshuffling breaks real clustering of results; if they cluster, resample blocks of consecutive trades.",
    ],
    example: "100 trades, 40 at +2.5R and 60 at −1R; the backtest's worst drawdown was 7R. 10,000 reshuffles: median 8.5R, 90th percentile 12R, 95th 13.5R, 99th 16.5R. At 1% risk per trade, plan for about 13.5%.",
    related: ["drawdown", "expected-drawdown", "drawdown-tiers", "variance"],
    missions: ["M04"],
    lessons: ["3.11.7"],
  },
  {
    id: "expectation-corridor",
    name: "Expectation corridor",
    category: "risk_management",
    summary: "The band of results a validated system should produce by chance alone, used to tell variance from breakage.",
    body: [
      "From the Monte Carlo, or the system's binomial odds, mark the 5th to 95th percentile of the average result after a given number of trades, and the drawdown percentiles. Inside the corridor, keep executing; outside it, investigate before anything else.",
      "The corridor turns 'it stopped working' into a measurable claim instead of a feeling, and it sets the gates and the kill switch for incubation.",
    ],
    example: "Reference system, 40% winners at +2.5R: after 50 trades the average result sits between −0.02R and +0.82R (5th to 95th percentile). After 20 trades a net loss has a 12.6% chance. A live drawdown of 11R is inside a 95th percentile of 13.5R.",
    related: ["mistake-vs-variance", "variance", "monte-carlo-resampling", "kill-switch"],
    missions: [],
    lessons: ["3.11.7"],
  },
  {
    id: "robustness-testing",
    name: "Robustness testing",
    category: "decision_making",
    summary: "Checking that results survive perturbations such as higher costs, added noise, other markets and missing best trades.",
    body: [
      "The stress battery: double the costs, drop the best 5% of trades, add noise to prices, start at a later date, run another market or timeframe. A robust edge weakens; a fitted one collapses. The same battery on the R0 control should fail.",
      "Read outlier dependence by type: trend followers rely on rare large winners by design, while a mean reverter that needs its best trades is fragile.",
    ],
    example: "The course system at lookback 18: base +0.127R; double costs +0.014R; without its best 5 trades +0.025R, profit factor 1.20 → 1.04; noise +0.213R; a year later start +0.103R; another R1 market +0.221R. Five of five positive; the R0 control, one of five.",
    related: ["parameter-plateau", "overfitting", "performance-metrics", "breakeven-cost"],
    missions: [],
    lessons: ["3.11.8"],
  },
  {
    id: "parameter-plateau",
    name: "Parameter plateau",
    category: "decision_making",
    summary: "A broad region of parameter values with similar results, preferred over an isolated peak.",
    body: [
      "Map results across parameter values, stepped in percent (10, 11, 12.1, 13.3…), and choose the middle of a wide region where neighbours behave alike. A cell far above its neighbours is more likely luck.",
      "The course's design rule: the neighbours' average must be at least 80% of the chosen cell. It's a convention, not a law; its job is to make you look at the neighbours before the cell.",
    ],
    example: "Course system lookbacks in 10% steps: 18 earns +0.127R and its neighbours the same, 100%. 24 earns the most, +0.179R, but its neighbours average +0.138R, 77%. 38 earns +0.147R with neighbours at +0.101R, 69%.",
    related: ["robustness-testing", "overfitting", "walk-forward-analysis"],
    missions: [],
    lessons: ["3.11.8"],
  },
  {
    id: "random-entry-benchmark",
    name: "Random-entry benchmark",
    category: "decision_making",
    summary: "Many twins of a strategy with random entries and the same exits, used to measure what the entry adds.",
    body: [
      "Build 1,000 twins that keep your exits, market and trade count but enter at random. Your percentile among them measures the entry: near 50, it adds nothing; at 95 or more, it probably adds something. Keep buy-and-hold on the chart as the ghost.",
      "Profit can come from the entry, from the exits or from the market's drift. Twins separate the first from the other two.",
    ],
    example: "A breakout system made +17.1% in ten synthetic years while LABX rose 5.7-fold. Its 1,000 twins made −6.9% to +41.8% (5th to 95th percentile), median +15.4%, and the system beat 53.8% of them: the drift did the work.",
    related: ["edge-ratio", "passive-benchmark", "mae-mfe"],
    missions: [],
    lessons: ["3.11.9"],
  },
  {
    id: "edge-ratio",
    name: "Edge ratio",
    category: "decision_making",
    summary: "Average favourable excursion divided by average adverse excursion after entry; random entries score about 1.",
    body: [
      "Measure MFE and MAE a set number of bars after each entry signal, in ATR, and divide the averages. Exits play no part, so the ratio tests the entry alone.",
      "Compare with random entries on the same data: in a rising market they score above 1 too. Plot the ratio against holding time to see how long the entry's information lasts.",
    ],
    example: "The course system's signals, 10 bars on: MFE 2.32 ATR, MAE 1.61 ATR, e-ratio 1.44. Random entries on the same series: 1.26. By 20 bars the two meet, 1.33 against 1.32.",
    related: ["mae-mfe", "random-entry-benchmark"],
    missions: [],
    lessons: ["3.11.9"],
  },
  {
    id: "incubation",
    name: "Incubation",
    category: "decision_making",
    summary: "Forward-testing a validated system at small size before scaling, with gates based on statistics and process.",
    body: [
      "The pipeline: a forward test in the simulator, a small account, size steps, then full size. Each stage adds what a backtest can't show: live fills, your execution and your behaviour in a losing run.",
      "Gates are written before the first trade: after a set number of trades, results inside the Monte Carlo band and process KPIs on target. Size grows on process and statistics, never on profit alone.",
    ],
    example: "Reference system gate: after 50 forward trades, average R between −0.02R and +0.82R and process KPIs on target, then double the size. Kill switch: a drawdown past 16.5R, or an expectancy interval entirely below zero.",
    related: ["kill-switch", "expectation-corridor", "process-kpis", "trading-plan"],
    missions: ["M10"],
    lessons: ["3.11.10"],
  },
  {
    id: "kill-switch",
    name: "Kill switch",
    category: "risk_management",
    summary: "A pre-written condition that stops a system when its results fall outside what variance can explain.",
    body: [
      "Set it from the system's own Monte Carlo: a drawdown beyond the 99th percentile, or a 95% interval of expectancy entirely below zero. A trigger inside normal variance, such as the backtest's own drawdown, would stop a healthy system.",
      "Write it before going live and don't move it during a drawdown. When it fires, the system goes back to research, not to a quick tweak.",
    ],
    example: "Reference system: 95th-percentile drawdown 13.5R, 99th 16.5R, so the kill sits at 16.5R or beyond. A kill at the backtest's 7R would have fired in 71.4% of the reshuffled histories of the same trades.",
    related: ["expectation-corridor", "incubation", "drawdown-tiers", "monte-carlo-resampling"],
    missions: [],
    lessons: ["3.11.10"],
  },
  {
    id: "premortem",
    name: "Premortem",
    category: "psychology",
    summary: "Imagining that a plan has already failed and listing the reasons, before committing to it.",
    body: [
      "Before a system goes live, assume it's six months later and it has failed, and write down why (Klein, 2007): costs were higher live, the regime changed, signals were overridden, the edge was a fit. Imagined hindsight brings up risks that confidence hides.",
      "Each reason becomes a check you can run or a rule in the plan, so the premortem changes what you do, not only how you feel.",
    ],
    example: "Five reasons and their checks: higher live costs → compare fills with the cost model weekly; a regime change → a regime label on every trade; skipped signals → a KPI for signals taken; a fitted edge → R0 control and walk-forward on file; size raised early → size only through the gates.",
    related: ["incubation", "confirmation-bias", "trading-plan", "overconfidence"],
    missions: [],
    lessons: ["3.11.10"],
  },
];

/** Unit 3.11 · Backtesting and system design (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_3_11: UnitContent = {
  lessons: [L_3_11_1, L_3_11_2, L_3_11_3, L_3_11_4, L_3_11_5, L_3_11_6, L_3_11_7, L_3_11_8, L_3_11_9, L_3_11_10],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
