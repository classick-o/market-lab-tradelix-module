import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, MarkRole, Question, TaskData, UnitContent } from "../../types";

/*
 * Unit 3.5 · Smart money concepts, decoded: 3.5.1–3.5.6.
 *
 * Conventions in this file:
 * - Candle indices in layers and tap zones are 0-based; copy uses 1-based candle numbers ("candle 30" is index 29).
 * - Swings use N candles on each side, strictly (a swing high's high is above the highs of the N candles on each side).
 *   A swing is confirmed when the Nth candle after it closes and can be broken from the next candle on.
 * - Structure labels: the level to break is the latest confirmed swing high (low), each broken once. Close rule: a close
 *   beyond it; wick rule: a high (low) beyond it. A break against the current direction is a CHoCH, otherwise a BOS
 *   (the first break of all is a BOS).
 * - Order blocks (strict rules): a displacement candle with a body of at least 1.5 × the 14-candle ATR before it, closing
 *   above the latest swing high (N = 3); the block is the last down candle in the 5 candles before it; the zone is its body.
 *
 * Simulated figures come from a seeded script (1-hour candles, each 12 Gaussian sub-steps of sd 0.06, closes rounded to
 * the cent). Markets: R0 random walk; R1 trending (R0 plus a slowly varying drift); R2 ranging (R0 plus a pull back to
 * the start); stops ON (R0 plus stop clusters 0.02 beyond the prior day's high and low: the first trade through adds a
 * 0.18 push over half a candle; stops OFF is the same draws without it); session markets (R0 with a 24-hour volatility
 * profile, with and without stops ON). These are simulator settings, not facts about real markets.
 * - 3.5.2 CHoCH test (N = 3, close rule, next 10 candles): R0 49.8% of 7,024 (any candle 49.7%), R1 60.8% of 5,215,
 *   R2 45.5% of 8,011; average net per unit after spread and commission: −0.21, +0.03, −0.27.
 * - 3.5.3 H1 (first trade 1 tick above the prior-day high, close back below in that candle; next 10 candles lower):
 *   R0 49.1% of 1,850; stops OFF 48.5% of 1,849; stops ON 46.7% of 670 (any candle about 50%). First breaks that closed
 *   beyond the high: stops ON 87.3% of 5,310, OFF 66.8% of 5,604; average push beyond it 0.22 against 0.13.
 *   A short at the sweep's close, out 10 candles later, averaged −0.22, −0.23 and −0.27 per unit after costs.
 * - 3.5.4 H3 (from the close of the first candle that touches the zone, does price rise 1 ATR before it falls 1 ATR;
 *   control: a zone at the same distance under a random candle of the same path): R0 50.3% of 1,466 vs 49.6% of 960
 *   (noise band ±4.1); stops ON 49.8% of 1,529 vs 49.9% of 981 (±4.0); R2 51.9% of 1,684 vs 56.7% of 1,117 (±3.8);
 *   R1 44.1% of 970 vs 40.6% of 625 (±5.0).
 * - 3.5.5 H4 (a close beyond the 6 candles before it; windows 07:00–10:00 and 12:00–15:00 lab time; next 3 candles):
 *   random walk with sessions: in windows 22,886 breakouts, average move 0.34, direction 50.5%; outside 42,638, 0.25,
 *   49.8%. With stops ON: 23,095, 0.35, 52.1%; 44,435, 0.27, 52.7%. Noise band on the direction gap ±0.8.
 *   Average candle range by block: 00–07 0.17, 07–10 0.39, 10–12 0.27, 12–15 0.39, 15–18 0.25, 18–24 0.17.
 * - 3.5.6 IS/OOS: 72 order-block variants (displacement 1.0/1.5/2.0 ATR, body or full candle, four 6-hour windows,
 *   reaction 0.5/1/1.5 ATR) tuned on 150 random-walk paths of 240 candles; best with N ≥ 30: 65.1% of 43. Frozen and run
 *   on 1,500 fresh paths: 49.1% of 395 (±4.9).
 */

/** Rows of [open, high, low, close] → candles. */
const k = (rows: [number, number, number, number][]): CandleData[] => rows.map(([o, h, l, c]) => ({ o, h, l, c }));
const mark = (index: number, at: "high" | "low" | "close", label?: string, role: MarkRole = "concept"): ChartLayer => ({ kind: "marker", index, at, label, role });
/** A short horizontal segment from a swing to the candle that breaks it. */
const brk = (from: number, to: number, price: number, label: string, role: MarkRole = "accent"): ChartLayer => ({
  kind: "path",
  points: [
    { index: from, price },
    { index: to, price },
  ],
  label,
  role,
});

/** A card sort for the bias-spotter widget: each wrong option gets its own rationale (or a generic one plus the card's clue). */
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

/**
 * 3.5.2 hook and Learn: 60 random-walk candles. N = 3 swings: highs 100.67 (c16), 101.07 (c21), 100.96 (c26), 101.06 (c40),
 * 100.91 (c45); lows 100.55 (c24), 100.48 (c30), 100.49 (c42), 100.16 (c48), 100.09 (c52).
 * Close rule, N = 3: BOS up c20 (over 100.67), BOS up c36 (over 100.96), CHoCH down c46 (under 100.49), CHoCH up c57 (over 100.91).
 * Wick rule, N = 3: BOS c20, CHoCH c30 (low 100.48 under 100.55; close 100.68), CHoCH c34 (high 100.98 over 100.96),
 * CHoCH c46, BOS c52, CHoCH c57. CHoCH count, close rule: N 2 → 3, 3 → 2, 4 → 1, 5 → 1, 6 → 1, 8 → 1, 10 → 0.
 * N = 5: lows c30, c52 only (none confirmed before c30); close rule BOS down c47, CHoCH up c57.
 * c42's swing low (100.49) is confirmed when c45 closes (lows of c43–c45: 100.57, 100.67, 100.60).
 */
const S60: CandleData[] = k([
  [100.0, 100.31, 100.0, 100.16], [100.16, 100.33, 100.16, 100.27], [100.27, 100.52, 100.23, 100.31], [100.31, 100.36, 100.06, 100.07], [100.07, 100.18, 99.97, 100.05],
  [100.05, 100.4, 100.0, 100.27], [100.27, 100.29, 100.08, 100.16], [100.16, 100.17, 99.87, 99.92], [99.92, 99.92, 99.44, 99.44], [99.44, 100.02, 99.44, 100.02],
  [100.02, 100.15, 99.91, 100.15], [100.15, 100.36, 100.1, 100.14], [100.14, 100.41, 100.07, 100.41], [100.41, 100.45, 100.19, 100.38], [100.38, 100.64, 100.38, 100.58],
  [100.58, 100.67, 100.42, 100.42], [100.42, 100.42, 100.23, 100.36], [100.36, 100.58, 100.32, 100.37], [100.37, 100.59, 100.28, 100.47], [100.47, 100.87, 100.46, 100.83],
  [100.83, 101.07, 100.73, 100.91], [100.91, 100.99, 100.66, 100.81], [100.81, 100.93, 100.59, 100.72], [100.72, 100.8, 100.55, 100.64], [100.64, 100.81, 100.62, 100.65],
  [100.65, 100.96, 100.62, 100.74], [100.74, 100.87, 100.74, 100.87], [100.87, 100.93, 100.76, 100.77], [100.77, 100.78, 100.6, 100.62], [100.62, 100.83, 100.48, 100.68],
  [100.68, 100.75, 100.6, 100.71], [100.71, 100.81, 100.5, 100.59], [100.59, 100.85, 100.55, 100.84], [100.84, 100.98, 100.77, 100.79], [100.79, 101.0, 100.79, 100.89],
  [100.89, 101.03, 100.73, 100.99], [100.99, 101.05, 100.65, 100.71], [100.71, 100.87, 100.54, 100.54], [100.54, 101.03, 100.54, 100.97], [100.97, 101.06, 100.68, 100.74],
  [100.74, 100.74, 100.54, 100.6], [100.6, 100.74, 100.49, 100.6], [100.6, 100.73, 100.57, 100.72], [100.72, 100.84, 100.67, 100.75], [100.75, 100.91, 100.6, 100.72],
  [100.72, 100.72, 100.36, 100.48], [100.48, 100.71, 100.34, 100.34], [100.34, 100.37, 100.16, 100.28], [100.28, 100.47, 100.18, 100.27], [100.27, 100.43, 100.2, 100.36],
  [100.36, 100.37, 100.2, 100.23], [100.23, 100.49, 100.09, 100.49], [100.49, 100.58, 100.39, 100.4], [100.4, 100.74, 100.38, 100.53], [100.53, 100.63, 100.43, 100.59],
  [100.59, 100.69, 100.53, 100.69], [100.69, 101.1, 100.69, 101.1], [101.1, 101.46, 101.06, 101.33], [101.33, 101.42, 101.15, 101.24], [101.24, 101.39, 101.14, 101.23],
]);

/**
 * 3.5.2 Try: 45 random-walk candles. N = 3, close rule: BOS up c20 (close 99.44 over 99.21, c12), BOS up c33 (close 99.90
 * over 99.76, c22), CHoCH down c37 (close 98.90 under the c25 low, 99.21). c36 dips to 99.15 but closes at 99.21, on the
 * level, not below it (the wick rule would print the CHoCH there). With N = 5 the first CHoCH is c42 (close 97.97 under 98.23).
 */
const T45: CandleData[] = k([
  [100.0, 100.19, 99.91, 99.91], [99.91, 100.26, 99.91, 100.26], [100.26, 100.35, 100.06, 100.06], [100.06, 100.29, 100.0, 100.26], [100.26, 100.31, 99.88, 99.91],
  [99.91, 99.91, 99.52, 99.55], [99.55, 99.57, 99.28, 99.35], [99.35, 99.35, 98.9, 98.97], [98.97, 99.01, 98.81, 99.01], [99.01, 99.04, 98.7, 98.83],
  [98.83, 98.96, 98.76, 98.95], [98.95, 99.21, 98.92, 98.92], [98.92, 99.0, 98.69, 98.71], [98.71, 98.73, 98.26, 98.32], [98.32, 98.48, 98.23, 98.45],
  [98.45, 98.68, 98.32, 98.67], [98.67, 98.94, 98.59, 98.74], [98.74, 99.07, 98.66, 98.84], [98.84, 99.09, 98.76, 99.04], [99.04, 99.5, 99.04, 99.44],
  [99.44, 99.6, 99.44, 99.49], [99.49, 99.76, 99.49, 99.65], [99.65, 99.66, 99.43, 99.48], [99.48, 99.53, 99.27, 99.27], [99.27, 99.6, 99.21, 99.58],
  [99.58, 99.72, 99.38, 99.46], [99.46, 99.58, 99.26, 99.48], [99.48, 99.73, 99.42, 99.7], [99.7, 99.76, 99.45, 99.6], [99.6, 99.64, 99.4, 99.51],
  [99.51, 99.64, 99.4, 99.57], [99.57, 99.86, 99.56, 99.72], [99.72, 100.03, 99.66, 99.9], [99.9, 99.91, 99.58, 99.7], [99.7, 99.88, 99.56, 99.58],
  [99.58, 99.58, 99.15, 99.21], [99.21, 99.35, 98.9, 98.9], [98.9, 98.96, 98.81, 98.91], [98.91, 98.91, 98.53, 98.53], [98.53, 98.66, 98.33, 98.41],
  [98.41, 98.54, 98.23, 98.28], [98.28, 98.32, 97.97, 97.97], [97.97, 98.03, 97.73, 97.73], [97.73, 97.91, 97.7, 97.85], [97.85, 98.02, 97.76, 97.79],
]);

/**
 * 3.5.4 B5: 27 random-walk candles. N = 3 swing high 101.06 (c21), confirmed at c24. c27 is the displacement: body
 * 101.31 − 100.71 = 0.60, against a 14-candle ATR of 0.32 (0.3193): 1.9 ×. Its close breaks 101.06. The last down candle
 * before it is c26 (100.95 → 100.71): the order block's zone is 100.71–100.95.
 */
const OB27: CandleData[] = k([
  [100.0, 100.22, 99.87, 100.22], [100.22, 100.23, 100.03, 100.08], [100.08, 100.2, 100.0, 100.11], [100.11, 100.21, 100.1, 100.13], [100.13, 100.3, 100.09, 100.27],
  [100.27, 100.35, 100.18, 100.3], [100.3, 100.57, 100.19, 100.53], [100.53, 100.53, 100.24, 100.29], [100.29, 100.35, 100.16, 100.24], [100.24, 100.25, 99.78, 99.86],
  [99.86, 100.12, 99.86, 100.02], [100.02, 100.16, 99.93, 100.09], [100.09, 100.3, 100.02, 100.3], [100.3, 100.37, 100.04, 100.04], [100.04, 100.52, 100.04, 100.45],
  [100.45, 100.69, 100.41, 100.53], [100.53, 100.8, 100.44, 100.8], [100.8, 100.83, 100.54, 100.67], [100.67, 100.95, 100.66, 100.83], [100.83, 101.0, 100.71, 100.71],
  [100.71, 101.06, 100.71, 100.89], [100.89, 100.89, 100.63, 100.69], [100.69, 100.84, 100.66, 100.82], [100.82, 100.84, 100.58, 100.58], [100.58, 101.04, 100.58, 100.95],
  [100.95, 100.97, 100.61, 100.71], [100.71, 101.34, 100.71, 101.31],
]);

/** 3.5.5 B5: five daily candles, each 24 one-hour random-walk candles. Every up day dips under its open; every down day spikes above it. */
const D5: CandleData[] = k([
  [100.0, 100.31, 98.9, 99.62], [99.62, 100.78, 99.2, 100.68], [100.68, 102.38, 100.34, 102.2], [102.2, 104.16, 101.46, 103.09], [103.09, 103.53, 102.09, 102.94],
]);

// ─── 3.5.1 · Where SMC comes from and how to read it ────────────────────────

const LAYERS = [
  { id: "mechanics", label: "Mechanics", what: "Mechanics is how orders work, true by construction." },
  { id: "tendency", label: "Statistical tendency", what: "A tendency is a measured rate, true more often than not, with exceptions." },
  { id: "narrative", label: "Narrative", what: "A narrative is a story about intent that no data can check." },
];

const LAYER_CARDS = cardSort(LAYERS, [
  {
    id: "fill-ask",
    text: "A buy market order fills at the ask.",
    answer: "mechanics",
    correct: "Mechanics. That's how a market order works, every time, on every chart.",
    clue: "Here nothing is measured or claimed about intent: it's how the order is executed.",
  },
  {
    id: "stop-market",
    text: "A buy stop above a swing high turns into a market order when price touches it.",
    answer: "mechanics",
    correct: "Mechanics. A triggered stop becomes a market order by definition.",
    clue: "Here the order type itself guarantees the result.",
  },
  {
    id: "limit-waits",
    text: "A limit order waits in the book until price reaches it.",
    answer: "mechanics",
    correct: "Mechanics. A resting limit order is how the order book works.",
    clue: "Here it's a rule of the order book, not a rate or a story.",
  },
  {
    id: "walk-book",
    text: "A large market order that eats several price levels gets a worse average price.",
    answer: "mechanics",
    correct: "Mechanics. Each level it eats fills at a worse price, so the average gets worse.",
    clue: "Here the arithmetic of the order book decides it.",
  },
  {
    id: "round-stops",
    text: "Stop-loss orders cluster just beyond round numbers.",
    answer: "tendency",
    correct: "Tendency. Osler measured it in one bank's order book: real, but a rate, not a law.",
    clue: "Here someone counted orders and found a pattern that holds more often than not.",
  },
  {
    id: "open-vol",
    text: "Volatility is higher around session opens than at midday.",
    answer: "tendency",
    correct: "Tendency. A measured, well-documented pattern, with quiet opens and busy middays now and then.",
    clue: "Here it's an average over many days, with exceptions.",
  },
  {
    id: "stop-speed",
    text: "Price moves faster after it reaches a cluster of stops.",
    answer: "tendency",
    correct: "Tendency. Osler found currency trends speed up at documented stop clusters. Measured, not guaranteed.",
    clue: "Here it's a measured effect on average, not a rule that holds every time.",
  },
  {
    id: "overlap",
    text: "Trading activity rises when two major sessions overlap.",
    answer: "tendency",
    correct: "Tendency. Activity peaks in overlaps on average; any one day can be quiet.",
    clue: "Here it's an average pattern of activity by hour.",
  },
  {
    id: "swept-lows",
    text: "Smart money swept the lows to fill its buy orders.",
    answer: "narrative",
    correct: "Narrative. The sweep is visible; who did it and why is not.",
    clue: "Here the claim is about who acted and why, which a chart can't show.",
  },
  {
    id: "algo-gap",
    text: "The algorithm will deliver price back to the fair value gap.",
    answer: "narrative",
    correct: "Narrative. No such algorithm is documented, and gaps are revisited about as often as random levels.",
    clue: "Here a hidden actor steers price, and no test could catch it.",
  },
  {
    id: "defend-ob",
    text: "Institutions are defending this order block.",
    answer: "narrative",
    correct: "Narrative. If the zone holds, they defended it; if it breaks, they let it go. Any outcome fits.",
    clue: "Here a story explains the outcome after the fact, whichever way it goes.",
  },
  {
    id: "inducement",
    text: "That wick was inducement, set up to trap retail traders.",
    answer: "narrative",
    correct: "Narrative. The wick is a fact; 'set up to trap' is intent nobody can observe.",
    clue: "Here 'set up' claims a plan behind a wick.",
  },
]);

const L351: Lesson = {
  id: "3.5.1",
  title: "Where SMC comes from and how to read it",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "SMC is a retail vocabulary with no official rulebook; sort each claim into mechanics, statistical tendency or narrative, and check who earns from selling it.",
  objectives: [
    "Describe where ICT and SMC come from and why there is no official rulebook.",
    "Sort any trading claim into mechanics, statistical tendency or narrative.",
    "Spot the conflicts of interest in how a method is sold (courses, paid indicators, prop-challenge funnels).",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "decision_making", label: "Decision making check" },
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
  ],
  script: {
    unit: "3.5",
    courseId: "3.5.1",
    bridge: "Unit 3.4 ended in 3.4.8, where 3.4.1's protocol rejected the full-moon claim. SMC is a newer retail vocabulary, and its liquidity words reuse the stop clusters of 3.1. Before testing any of it, you sort each claim: mechanics, tendency or narrative.",
    hook: {
      prompt: "\"Smart money engineered liquidity above the highs, then delivered price to the order block.\" Which part could you check on a chart?",
      control: {
        kind: "choice",
        choices: [
          { id: "engineered", label: "\"Engineered\"", feedback: "That's a claim about intent. The chart shows prices, not who planned them." },
          { id: "liquidity", label: "\"Liquidity above the highs\"", feedback: "Yes, and only indirectly: stops plausibly rest just above highs, as you saw in 3.1." },
          { id: "delivered", label: "\"Delivered\"", feedback: "Delivered by whom? It names an actor steering price, which no chart can show." },
          { id: "all", label: "All of it", feedback: "Only one part touches anything observable. The verbs are about intent." },
          { id: "none", label: "None of it", feedback: "One part is checkable, indirectly: stops tend to rest just beyond highs." },
        ],
        answer: "liquidity",
      },
      compare: "You picked {yours}. Only \"liquidity above the highs\" is checkable, and indirectly: stops plausibly rest there. \"Engineered\" and \"delivered\" are intent, which no chart shows.",
      concept: "claim-layers",
    },
    learn: [
      {
        kind: "explain",
        title: "No rulebook",
        text: "[[ict|ICT]], the \"Inner Circle Trader\", is an online mentorship run by Michael J. Huddleston. [[smc|SMC]] is the wider retail movement that repackaged its terms, plus ideas from supply and demand and Wyckoff. There is no official rulebook: definitions differ between authors and years, and indicator vendors have become the standard-setters.",
      },
      {
        kind: "figure",
        title: "Three layers",
        figure: {
          kind: "flow",
          start: "mech",
          nodes: [
            { id: "mech", text: "Mechanics: a triggered stop becomes a market order. True by construction.", kind: "pause", next: "tend" },
            { id: "tend", text: "Tendencies: stops cluster just beyond round numbers. Measured rates, with exceptions.", kind: "pause", next: "narr" },
            { id: "narr", text: "Narratives: \"smart money hunted the stops\". A story about intent, which no data can check.", kind: "end" },
          ],
          steps: ["Mechanics hold every time.", "Tendencies hold more often than not, and come with a base rate.", "Narratives fit any outcome after the fact."],
        },
        text: "Sort every claim before you weigh it. Mechanics you can rely on, tendencies you can test, narratives you can only believe.",
        concept: "claim-layers",
      },
      {
        kind: "match",
        title: "Sort them, round 1",
        prompt: "Match each claim to its layer.",
        pairs: [
          { left: "A triggered stop becomes a market order", right: "Mechanics", wrong: "That's how a stop order works, every time." },
          { left: "Stops cluster just beyond round numbers", right: "Tendency", wrong: "A measured rate in order data, with exceptions." },
          { left: "The algorithm delivers price to the gap", right: "Narrative", wrong: "No such algorithm is documented, and no outcome could disprove it." },
        ],
        columns: ["Claim", "Layer"],
        correct: "Right. One rule of the order book, one measured rate, one story.",
        concept: "claim-layers",
      },
      {
        kind: "match",
        title: "Round 2",
        prompt: "Three more.",
        pairs: [
          { left: "Volatility rises at session opens", right: "Tendency", wrong: "A documented average pattern, with quiet opens now and then." },
          { left: "Institutions defend the order block", right: "Narrative", wrong: "Nobody can see who defended what. The story fits any outcome." },
          { left: "Spreads widen before scheduled news", right: "Mechanics", wrong: "Market makers quote wider when risk jumps: it's how quoting works around releases." },
        ],
        columns: ["Claim", "Layer"],
        correct: "Right. Three different layers again, under the same confident voice.",
        concept: "claim-layers",
      },
      {
        kind: "explain",
        title: "Every outcome has a story",
        text: "[[intent-attribution|Intent attribution]] explains a move by what \"they\" wanted. If the level holds, institutions defended it; if it breaks, they induced liquidity. An explanation that fits every outcome predicts none. \"Institutional order flow\" read from candles is a misnomer too: real order flow needs trade and order-book data, as in 3.3.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "There is no single \"smart money\". Participants range from informed and uninformed traders to index funds, hedgers and [[market-maker|market makers]] (Kyle; Harris): grade B. One coordinated actor: grade D. Check who earns: SMC is often sold with courses, paid indicators and prop-challenge discounts, which pay whether or not the method works.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: LAYER_CARDS,
      goal: "Twelve claims from trading videos. Sort each one: mechanics, statistical tendency or narrative.",
      success: { field: "solved", eq: 12 },
      correct: "All twelve sorted. Rely on mechanics, test tendencies against their base rate, and treat narratives as vocabulary.",
      hints: ["Mechanics hold every time, by how orders work.", "A tendency was counted in data. A narrative names who wanted what."],
      showMe: { solved: 12 },
      concept: "claim-layers",
    },
    check: ["q-3.5.1-1", "q-3.5.1-2", "q-3.5.1-3"],
    recap: {
      takeaways: [
        "ICT and SMC have no official rulebook; definitions change by author, year and indicator vendor.",
        "Sort each claim: mechanics hold always, tendencies have base rates, narratives fit any outcome.",
        "Courses, paid indicators and prop-challenge links earn whether or not the method works.",
      ],
      next: "Next, 3.5.2: structure words. BOS, CHoCH, MSS and displacement, mapped back to the Dow structure you already know.",
    },
  },
};

// ─── 3.5.2 · Structure words: BOS, CHoCH, MSS, displacement ─────────────────

const S60_SWINGS: ChartLayer[] = [
  ...[15, 20, 25, 39, 44].map((i) => mark(i, "high", undefined, "neutral")),
  ...[23, 29, 41, 47, 51].map((i) => mark(i, "low", undefined, "neutral")),
];

const L352: Lesson = {
  id: "3.5.2",
  title: "Structure words: BOS, CHoCH, MSS, displacement",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "BOS, CHoCH, MSS and displacement rename Dow structure and momentum; their labels depend on the swing length and the close rule, and a CHoCH predicts nothing on a random walk.",
  objectives: [
    "Map BOS, CHoCH, MSS and displacement to Dow-theory structure and momentum.",
    "Show that structure labels change with the swing length N and with the close-versus-wick rule.",
    "Test a CHoCH reversal rule against the R0 control.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "reversal", label: "Arena: reversal" },
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
  ],
  script: {
    unit: "3.5",
    courseId: "3.5.2",
    bridge: "In 3.5.1 you sorted claims into three layers. Now structure. In 1.5.7 an uptrend broke at the first close below its last higher low: Dow's peak-trough rule from 2.3.1. SMC renames it a CHoCH, and the label shifts with swing length and close rule.",
    hook: {
      prompt: "An uptrend. Its last higher low, with N = 3, is 100.55. Candle 30 dips to 100.48 and closes at 100.68. Is this a change of character?",
      figure: {
        kind: "chart",
        chart: { candles: S60.slice(0, 30) },
        steps: [{ text: "Last higher low: 100.55, candle 24. Candle 30: low 100.48, close 100.68.", layers: [mark(23, "low", "100.55"), mark(29, "low", "100.48", "accent")] }],
      },
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes", feedback: "Under a wick rule, yes. Under a close rule, no: candle 30 closed above 100.55." },
          { id: "no", label: "No", feedback: "Under a close rule, no. Under a wick rule, yes: the low broke 100.55." },
          { id: "depends", label: "It depends on the rule" },
        ],
        answer: "depends",
      },
      compare: "You said {yours}. It depends: the wick broke 100.55, the close didn't, and with N = 5 candle 24 isn't a swing at all.",
      concept: "change-of-character",
    },
    learn: [
      {
        kind: "match",
        title: "Old names",
        prompt: "Match each SMC term to the classical idea it renames.",
        pairs: [
          { left: "BOS (break of structure)", right: "A new high in an uptrend: Dow's continuation", wrong: "A with-trend break: the trend makes its next higher high." },
          { left: "CHoCH (change of character)", right: "First break of the last higher low: Dow's warning", wrong: "The first counter-trend break, the structure break from 1.5." },
          { left: "MSS (market structure shift)", right: "A failed breakout, then a reversal: the 1-2-3", wrong: "A run beyond an extreme that fails and reverses sharply." },
          { left: "Displacement", right: "Momentum: a run of large trend bars", wrong: "A fast one-sided run, Brooks's spike." },
          { left: "Internal vs external structure", right: "Small swings inside a leg vs the trend's big swings", wrong: "Two swing lengths on one chart: a small N and a large N." },
        ],
        columns: ["SMC term", "Classical idea"],
        correct: "Right. Same structure, new names. A definition match predicts nothing: it's Mechanic, not evidence.",
        concept: "break-of-structure",
      },
      {
        kind: "figure",
        title: "Labels by rule",
        figure: {
          kind: "chart",
          chart: { candles: S60 },
          steps: [
            { text: "Swings with N = 3: five highs and five lows.", layers: S60_SWINGS },
            { text: "Closes above the latest swing high: BOS at candles 20 and 36.", layers: [brk(15, 19, 100.67, "BOS"), brk(25, 35, 100.96, "BOS")] },
            { text: "Candle 46 closes under 100.49: CHoCH down. Candle 57 closes over 100.91: CHoCH up.", layers: [brk(41, 45, 100.49, "CHoCH", "down"), brk(44, 56, 100.91, "CHoCH", "up")] },
          ],
        },
        text: "A detector needs three choices: the swing length N, which swing counts as the level, and whether a close or a wick breaks it. Here: N = 3, the latest swing, the close.",
        concept: "break-of-structure",
      },
      {
        kind: "predict",
        title: "Close or wick?",
        prompt: "Keep N = 3 and switch the close rule to the wick rule. Which gives more CHoCH labels on this chart?",
        control: {
          kind: "choice",
          choices: [
            { id: "close", label: "The close rule", feedback: "A close beyond a level also puts the wick beyond it, so the wick rule breaks at least as often." },
            { id: "wick", label: "The wick rule" },
            { id: "same", label: "The same number", feedback: "Not here: wicks poke through levels that closes respect." },
          ],
          answer: "wick",
        },
        figure: {
          kind: "chart",
          chart: { candles: S60 },
          steps: [
            { text: "Close rule: CHoCH at candles 46 and 57.", layers: [brk(41, 45, 100.49, "CHoCH", "down"), brk(44, 56, 100.91, "CHoCH", "up")] },
            { text: "Wick rule adds candles 30 and 34: four CHoCH labels on the same candles.", layers: [brk(23, 29, 100.55, "wick", "accent"), brk(25, 33, 100.96, "wick", "accent")] },
          ],
        },
        reveal: "The wick rule doubles the CHoCH labels here, from 2 to 4. Candle 30's wick broke 100.55 by 0.07 and closed back above. One convention, a different story.",
        concept: "change-of-character",
      },
      {
        kind: "predict",
        title: "Change N",
        prompt: "Close rule, same 60 candles. N = 3 gives 2 CHoCH labels. Switch to N = 5. How many are left?",
        control: {
          kind: "numeric",
          answer: 1,
          tolerance: 0,
          feedback: [
            { value: 2, text: "Wider swings are fewer. Candle 42's low isn't a swing with N = 5, so its break disappears." },
            { value: 3, text: "That's N = 2. A larger N keeps fewer swings, and fewer labels." },
            { value: 0, text: "One survives: candle 57 still breaks the swing high at candle 40." },
          ],
        },
        figure: {
          kind: "bars",
          unit: " CHoCH",
          bars: [
            { label: "N = 2", value: 3, role: "neutral" },
            { label: "N = 3", value: 2, role: "neutral" },
            { label: "N = 4", value: 1, role: "neutral" },
            { label: "N = 5", value: 1, role: "concept" },
            { label: "N = 6", value: 1, role: "neutral" },
            { label: "N = 8", value: 1, role: "neutral" },
            { label: "N = 10", value: 0, role: "neutral" },
          ],
          steps: ["CHoCH labels on the same 60 candles, close rule, by swing length N."],
        },
        reveal: "One: candle 57. The count runs from 3 at N = 2 to 0 at N = 10. Add timeframes, \"daily bias\" and \"top-down alignment\", and every extra choice is one more chance to find the label you wanted.",
        concept: "change-of-character",
      },
      {
        kind: "reveal",
        title: "Labels arrive late",
        prompt: "Candle 42 dipped to 100.49 and candle 43 closed higher. With N = 3, can a detector call candle 42 a swing low yet?",
        chart: { candles: S60, visible: 43, layers: [mark(41, "low", "100.49")] },
        choices: [
          { id: "yes", label: "Yes: it's the lowest low around" },
          { id: "no", label: "Not yet: it needs two more candles" },
        ],
        answer: "no",
        after: "Candles 44 and 45 had to close above 100.49 first. The swing appears at candle 45, though it's drawn on 42, so every BOS and CHoCH using it comes at least three candles late. An indicator that draws it on 42 without saying so is [[repainting]].",
        concept: "swing-points",
      },
      {
        kind: "predict",
        title: "Test the reversal claim",
        prompt: "We ran a CHoCH rule (N = 3, close rule) on three simulated markets. On the random walk, how often did the next 10 candles move in the new direction?",
        control: {
          kind: "choice",
          choices: [
            { id: "above", label: "Well above half", feedback: "Only where the market itself trends. On the random walk it was 49.8%." },
            { id: "half", label: "About half" },
            { id: "below", label: "Well below half", feedback: "Only in the ranging market, 45.5%. On the random walk it was 49.8%." },
          ],
          answer: "half",
        },
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "Random walk (7,024)", value: 49.8, role: "concept" },
            { label: "Trending (5,215)", value: 60.8, role: "neutral" },
            { label: "Ranging (8,011)", value: 45.5, role: "neutral" },
          ],
          steps: ["After a CHoCH: the next 10 candles moved in the new direction. Any candle: 49.7%."],
        },
        reveal: "Random walk: 49.8% against 49.7% for any candle, and −0.21 per unit after costs. The trending market gave 60.8%, the ranging one 45.5%: the label inherits the market's persistence. That's trend following, not the label. Simulator results, not facts about real markets.",
        concept: "change-of-character",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Grades. BOS, CHoCH, MSS and [[displacement]] as renamed Dow structure and [[momentum]]: Mechanic, a match of definitions. Trend following over months in futures: A (Moskowitz, Ooi and Pedersen, 2012). \"A CHoCH signals a reversal\": D, because intraday swing rules haven't been tested as such.",
      },
      {
        kind: "hotspot",
        title: "Label it yourself",
        prompt: "N = 3, close rule. The uptrend's last higher low is 99.21, candle 25. Tap the candle where the CHoCH prints.",
        chart: { candles: T45, layers: [mark(24, "low", "99.21")] },
        zones: [
          { id: "c25", label: "Candle 25", index: 24, feedback: "That's the swing low itself. The CHoCH prints on the candle that closes under it." },
          { id: "c33", label: "Candle 33", index: 32, feedback: "Candle 33 closes at 99.90, above the 99.76 swing high: a BOS, with the trend." },
          { id: "c36", label: "Candle 36", index: 35, feedback: "Its wick reaches 99.15, but it closes at 99.21, on the level, not under it. Only the wick rule counts it." },
          { id: "c37", label: "Candle 37", index: 36 },
          { id: "c42", label: "Candle 42", index: 41, feedback: "That's where N = 5 prints its CHoCH, under 98.23. With N = 3 it came five candles earlier." },
        ],
        answer: "c37",
        correct: "Right. Candle 37 closes at 98.90, under 99.21: CHoCH down. The wick rule would say candle 36; N = 5 would say candle 42.",
        concept: "change-of-character",
      },
    ],
    check: ["q-3.5.2-1", "q-3.5.2-2", "q-3.5.2-3"],
    recap: {
      takeaways: [
        "BOS and CHoCH are Dow structure renamed; MSS is a failed breakout; displacement is momentum.",
        "Labels change with N and with close versus wick: from 3 CHoCH to none on one chart.",
        "On a random walk a CHoCH predicted nothing: 49.8% against 49.7%. Grade D for reversal.",
      ],
      next: "Next, 3.5.3: liquidity words. BSL, SSL, sweeps and inducement rename the stop clusters and failed breakouts of 3.1.",
    },
  },
};

// ─── 3.5.3 · Liquidity words: BSL, SSL, sweeps, inducement ──────────────────

const LIQ_NAMES = [
  { id: "stops", label: "Stops resting beyond a level", what: "That's stop clustering: orders waiting beyond a high or low." },
  { id: "double", label: "Double top or double bottom", what: "That's two extremes at about the same price." },
  { id: "failed", label: "Failed breakout", what: "That's a move beyond a level that closes back inside." },
  { id: "shakeout", label: "Shake-out of trapped traders", what: "That's a small move that stops out early traders before the larger one." },
  { id: "target", label: "A target at a prior high or low", what: "That's an exit placed at an earlier extreme." },
];

const LIQ_CARDS = cardSort(LIQ_NAMES, [
  {
    id: "erl",
    text: "External range liquidity: the stops beyond the range's high and low.",
    answer: "stops",
    correct: "Stops resting beyond a level, at the edges of a range.",
    clue: "Here the term names orders waiting beyond the range's edges.",
  },
  {
    id: "eqh",
    text: "Relative equal highs.",
    answer: "double",
    correct: "A double top: two highs at about the same price, with stops plausibly above them.",
    clue: "Here two highs sit at nearly the same price.",
  },
  {
    id: "sweep",
    text: "Stop hunt: price runs above the old high, then closes back under it.",
    answer: "failed",
    correct: "A failed breakout, also called a 2B or a Wyckoff upthrust. \"Hunt\" adds intent the chart can't show.",
    clue: "Here price trades beyond a level, then closes back inside.",
  },
  {
    id: "soup",
    text: "Turtle soup, as ICT uses it.",
    answer: "failed",
    correct: "A failed breakout. The name is borrowed from Connors and Raschke's 1995 trade.",
    clue: "Here it's a fade of a false break of a prior high or low.",
  },
  {
    id: "judas",
    text: "Judas swing: an early-session move against the day's later direction.",
    answer: "failed",
    correct: "A failed breakout of the opening range. Only the rest of the day tells you it was one.",
    clue: "Here an opening move breaks one way, then fails.",
  },
  {
    id: "idm",
    text: "Inducement: a small swing said to be bait before the real move.",
    answer: "shakeout",
    correct: "A shake-out: traders trapped by a small move. \"Bait\" is intent nobody can prove.",
    clue: "Here a minor swing takes out early traders' stops.",
  },
  {
    id: "dol",
    text: "Draw on liquidity: the old high that price \"is going to\".",
    answer: "target",
    correct: "A target at a prior high: an exit idea, not a force pulling price.",
    clue: "Here a prior extreme is used as the next destination.",
  },
]);

const L353: Lesson = {
  id: "3.5.3",
  title: "Liquidity words: BSL, SSL, sweeps, inducement",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "SMC's liquidity words rename stop clustering and failed breakouts: stops really do cluster and speed price up, but \"sweep, then reverse\" is contradicted by the evidence.",
  objectives: [
    "Map buy-side and sell-side liquidity, equal highs and lows, sweeps, inducement, the Judas swing and turtle soup to stop clustering and failed breakouts.",
    "State which part is documented (stops cluster and accelerate price) and which is contradicted (sweeps reverse).",
    "Rewrite one liquidity claim as a testable hypothesis (H1).",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
    { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
  ],
  script: {
    unit: "3.5",
    courseId: "3.5.3",
    bridge: "In 3.5.2 a CHoCH predicted nothing on a random walk. Liquidity words lean on firmer ground: in 3.1.2 stops clustered beyond round numbers, in 3.1.3 sweeps closed back inside, in 3.1.4 equal highs needed a tolerance. Here you split what's real from what's contradicted.",
    hook: {
      prompt: "\"They swept the lows, now we go up.\" The only systematic test our research found looked at swept levels in G10 currencies. What did it find?",
      control: {
        kind: "choice",
        choices: [
          { id: "reversal", label: "Reversal, as claimed", feedback: "The opposite. Swept levels predicted continuation more often." },
          { id: "continuation", label: "Continuation" },
          { id: "none", label: "No effect either way", feedback: "There was an effect, but not the claimed one: continuation." },
        ],
        answer: "continuation",
      },
      compare: "You picked {yours}. Continuation: three separately built sweep rules agreed in 65 of 66 test folds (Mahadzva, 2026, an unreviewed preprint).",
      concept: "inducement",
    },
    learn: [
      {
        kind: "match",
        title: "Old names",
        prompt: "Match each SMC liquidity term to its classical name.",
        pairs: [
          { left: "Buy-side liquidity (BSL)", right: "Buy stops resting above swing highs", wrong: "Shorts' stop-losses and breakout buy stops sit above highs." },
          { left: "Sell-side liquidity (SSL)", right: "Sell stops resting below swing lows", wrong: "Longs' stop-losses and breakout sell stops sit below lows." },
          { left: "Equal highs / equal lows", right: "Double top / double bottom", wrong: "Two extremes at nearly the same price." },
          { left: "Sweep, raid, stop hunt", right: "Failed breakout: 2B, spring, swing failure", wrong: "A run beyond a level that closes back inside." },
        ],
        columns: ["SMC term", "Classical name"],
        correct: "Right. Stop clustering and failed breakouts, both older than SMC.",
        concept: "liquidity-pool",
      },
      {
        kind: "explain",
        title: "Three parts, three verdicts",
        text: "Real: stops cluster beyond obvious levels and, once triggered, [[stop-cascade|speed price up]] (Osler; grade B). Contradicted: \"after the sweep comes the reversal\" (grade D). Untestable: the intent in [[inducement]], the [[judas-swing|Judas swing]] or \"they hunted the stops\". The neutral word is [[liquidity-sweep|sweep]]; \"hunt\" claims a hunter.",
      },
      {
        kind: "predict",
        title: "Sweeps on three markets",
        prompt: "Event: price first trades 1 tick above the prior day's high, then closes back under it in the same candle. How often was price lower 10 candles later with stops ON?",
        control: {
          kind: "choice",
          choices: [
            { id: "most", label: "Most of the time: about 65%", feedback: "That's the claim. With stops ON it was 46.7%, slightly less than half." },
            { id: "half", label: "About half" },
            { id: "rare", label: "Rarely: about 30%", feedback: "Not that rare: 46.7%, within noise of half." },
          ],
          answer: "half",
        },
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "Random walk (1,850)", value: 49.1, role: "neutral" },
            { label: "Stops OFF (1,849)", value: 48.5, role: "neutral" },
            { label: "Stops ON (670)", value: 46.7, role: "concept" },
          ],
          steps: ["Sweeps followed by a lower close 10 candles later. Any candle: about 50%."],
        },
        reveal: "About half everywhere: 46.7% with stops ON, ±3.8. What the stops did change was the break itself: 87.3% of first breaks closed above the high, against 66.8% with stops OFF. A short at each sweep lost 0.27 per unit after costs. Simulator results.",
        concept: "liquidity-sweep",
      },
      {
        kind: "order",
        title: "Build H1",
        prompt: "Put the parts of the testable version of \"sweep, then reverse\" in order.",
        items: [
          "Event: a trade at least 1 tick above the prior day's high",
          "Condition: a close back under that high in the same candle",
          "Outcome: the return over the next 10 candles is negative",
          "Baseline: the same outcome after a random candle",
          "Markets: the random walk, stops ON and stops OFF",
        ],
        explain: "An event, an outcome over a fixed horizon, a baseline and the markets. Each part can be checked, so the data can say no.",
        wrong: "Start with what must happen on the chart, then what you measure, then what you compare it with.",
        concept: "testable-reformulation",
      },
      {
        kind: "fields",
        title: "Your H1",
        prompt: "Set the parameters of your H1 before you run it. The lab keeps them fixed.",
        fields: [
          { id: "ticks", label: "Ticks beyond the prior-day high", kind: "stepper", min: 1, max: 5, step: 1, default: 1 },
          { id: "within", label: "Close back under it within", kind: "stepper", min: 1, max: 3, step: 1, unit: " candles", default: 1 },
          { id: "horizon", label: "Outcome horizon", kind: "choice", options: [5, 10, 20], unit: " candles", default: 10 },
          { id: "events", label: "Events per market", kind: "choice", options: [50, 100, 200, 500], default: 50 },
          { id: "drop", label: "The result that would make you drop the claim", kind: "text", placeholder: "For example: lower after 10 candles no more often than after a random candle", required: true, default: "" },
        ],
        valid: { all: [{ field: "events", gte: 200 }, { field: "drop", ne: "" }] },
        feedback: [
          { when: { field: "events", lt: 200 }, text: "With {events} events the noise band is wider than most claimed effects. Use 200 or more per market." },
          { when: { field: "drop", eq: "" }, text: "Write the result that would make you drop it. Without one, no result can count against the claim." },
        ],
        correct: "Saved. Every parameter is written down before the run, and you've said in advance what would count against the claim.",
        concept: "testable-reformulation",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "\"I was the liquidity\" turns every loss into a story about someone else. It feels like insight, and it blocks the one review that helps: was the stop where the plan said, was the size right, and was the setup in your rules? Review the decision, not the villain.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: LIQ_CARDS,
      goal: "Seven SMC liquidity terms. Name the classical idea behind each one.",
      success: { field: "solved", eq: 7 },
      correct: "All seven named. Stops beyond levels, double tops, failed breakouts, shake-outs and targets: nothing new, only new names.",
      hints: ["Ask what you would see on the chart, with the intent removed.", "Three of the seven are failed breakouts under different names."],
      showMe: { solved: 7 },
      concept: "inducement",
    },
    check: ["q-3.5.3-1", "q-3.5.3-2", "q-3.5.3-3"],
    recap: {
      takeaways: [
        "BSL and SSL are stop clusters; sweeps, turtle soup and Judas swings are failed breakouts.",
        "Stops cluster and speed price up (B). \"Sweep, then reverse\" is contradicted (D).",
        "H1 names an event, a 10-candle outcome, a random-candle baseline and three markets.",
      ],
      next: "Next, 3.5.4: zone words. Order blocks, FVGs, premium and discount, set against random zones at the same distance.",
    },
  },
};

// ─── 3.5.4 · Zone words: order blocks, FVGs, premium and discount ───────────

const NOISE = [
  { id: "within", label: "Within noise", what: "Within noise means the gap is smaller than the noise band." },
  { id: "beyond", label: "Beyond noise", what: "Beyond noise means the gap is larger than the noise band." },
  { id: "cant", label: "Can't judge yet", what: "Can't judge yet means a control, a method or an out-of-sample run is missing." },
];

const NOISE_CARDS = cardSort(NOISE, [
  {
    id: "r0",
    text: "Random walk: order blocks 50.3% of 1,466; random zones at the same distance 49.6% of 960. Noise band ±4.1 points.",
    answer: "within",
    correct: "Within noise. A 0.7-point gap against a ±4.1 band: the blocks did what any zone does.",
    clue: "Here the gap is 0.7 points and the band is 4.1.",
  },
  {
    id: "on",
    text: "Stops ON market: order blocks 49.8% of 1,529; random zones 49.9% of 981. Noise band ±4.0.",
    answer: "within",
    correct: "Within noise. A 0.1-point gap. Stop clusters in the market didn't make the blocks special.",
    clue: "Here the gap is 0.1 points against a 4.0 band.",
  },
  {
    id: "r2",
    text: "Ranging market: order blocks 51.9% of 1,684; random zones 56.7% of 1,117. Noise band ±3.8.",
    answer: "beyond",
    correct: "Beyond noise, and worse than random zones by 4.8 points. Blocks form after strong rallies, where a ranging market tends to pull back further.",
    clue: "Here the gap is 4.8 points against a 3.8 band.",
  },
  {
    id: "r1",
    text: "Trending market: order blocks 44.1% of 970; random zones 40.6% of 625. Noise band ±5.0.",
    answer: "within",
    correct: "Within noise. A 3.5-point gap looks like something, but the band is 5.0.",
    clue: "Here the gap is 3.5 points against a 5.0 band.",
  },
  {
    id: "small",
    text: "The best of 72 tuned variants: 65.1% on 43 trades, against a 50% base rate. Noise band ±14.9. No out-of-sample run.",
    answer: "cant",
    correct: "Can't judge yet. 65.1% clears the band on paper, but picking the best of 72 on the same trades also picks luck. Only an out-of-sample run can tell.",
    clue: "Here the result is the best of 72 variants, scored on the data it was tuned on.",
    override: {
      beyond: "Past the band on paper, but it's the best of 72 variants tuned on these trades. Without an out-of-sample run, luck can't be ruled out.",
      within: "The gap, 15.1 points, is just past the ±14.9 band. The real problem: it was tuned on these same trades.",
    },
  },
  {
    id: "broker",
    text: "A broker's backtest: order blocks alone held in about 43% of 1,000 trades. Method unpublished.",
    answer: "cant",
    correct: "Can't judge yet. No control, no definition of \"held\" and no published method: the 43% has nothing to be compared with.",
    clue: "Here there's no random-zone control and no published method.",
  },
]);

const L354: Lesson = {
  id: "3.5.4",
  title: "Zone words: order blocks, FVGs, premium and discount",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Order blocks, breakers, FVGs, premium and discount and OTE rename supply and demand zones, role reversal, gaps, the 50% rule and Fibonacci; tested strictly, order blocks reacted like random zones.",
  objectives: [
    "Map order block, breaker, mitigation block, FVG, consequent encroachment, premium and discount and OTE to supply and demand zones, role reversal, gaps, the 50% rule and Fibonacci 61.8–78.6%.",
    "Apply a strict order-block rule set and notice how \"mitigation\" can explain every outcome.",
    "Test order-block reactions against random candles at equal distance (H3).",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
  ],
  script: {
    unit: "3.5",
    courseId: "3.5.4",
    bridge: "In 3.5.3 you wrote H1 for sweeps. Zone words come next, and most have a classical twin: 3.1.6's supply and demand zones, 3.1.5's three-candle gaps, 3.4.2's Fibonacci ratios. Order blocks add 3.5.2's displacement. Then, as in 3.1.6, the zones face random ones.",
    hook: {
      prompt: "An order block fails: price closes straight through it. In SMC language, the block now becomes…",
      control: {
        kind: "choice",
        choices: [
          { id: "mistake", label: "A mistake", feedback: "Some authors would say so. Others would rename it, and that choice is the problem." },
          { id: "breaker", label: "A breaker block", feedback: "Some authors would call it a breaker. Others would say \"mitigated\", or a mistake." },
          { id: "mitigated", label: "\"Mitigated\"", feedback: "Some authors would say so. Others would call it a breaker, or a mistake." },
          { id: "any", label: "Any of these, depending on the author" },
        ],
        answer: "any",
      },
      compare: "You picked {yours}. Any of them, depending on the author. When a failure can be renamed, no outcome counts against the claim.",
      concept: "order-block",
    },
    learn: [
      {
        kind: "match",
        title: "Zones",
        prompt: "Match each SMC zone to the classical idea it renames.",
        pairs: [
          { left: "Order block", right: "The base of a supply or demand zone", wrong: "The last opposite candle before a strong move: a zone's base." },
          { left: "Breaker block", right: "Role reversal after a failed zone", wrong: "A broken zone flips: old support acts as resistance." },
          { left: "Mitigation block", right: "Role reversal after a failed swing", wrong: "The same flip, after a swing that fell short of the old extreme." },
          { left: "Rejection block", right: "The wick zone of a pin bar", wrong: "Long wicks at an extreme: a hammer or shooting star's tail." },
        ],
        columns: ["SMC term", "Classical idea"],
        correct: "Right. Supply and demand zones and role reversal, from 1.5 and 2.5, under new names.",
        concept: "order-block",
      },
      {
        kind: "match",
        title: "Gaps",
        prompt: "Four gap words.",
        pairs: [
          { left: "Fair value gap (FVG)", right: "A three-candle gap, the candlestick window", wrong: "Candle 1's high below candle 3's low, or the reverse." },
          { left: "Consequent encroachment", right: "The 50% point of a gap", wrong: "The middle of the gap, or of a wick." },
          { left: "Inversion FVG", right: "Role reversal of a gap", wrong: "A gap closed through by a body, then treated as the opposite zone." },
          { left: "Balanced price range", right: "Two opposite gaps that overlap", wrong: "A bullish and a bearish gap sharing prices." },
        ],
        columns: ["SMC term", "Classical idea"],
        correct: "Right. A gap is a real feature, a fast move with little two-sided trading. Its pull on price is the unproven part.",
        concept: "fair-value-gap",
      },
      {
        kind: "explain",
        title: "Rare words",
        text: "You'll meet these too. Volume imbalance: a small gap between bodies. NWOG and NDOG: the [[weekend-gap|weekend]] or session gap. Propulsion block: a continuation zone. Vacuum block: a news gap. Unicorn: a breaker overlapping an [[fair-value-gap|FVG]]. Quasimodo: a [[head-and-shoulders|head-and-shoulders]] variant. [[mitigation|Mitigation]]: price returning to an earlier trading area.",
      },
      {
        kind: "worked",
        title: "Premium, discount, OTE",
        lines: [
          "Dealing range for a long: 100.00 up to 110.00. Size: 10.00.",
          "Equilibrium, the 50% line: 110.00 − 0.50 × 10.00 = 105.00. Below it is discount, above it premium.",
          "OTE band: 110.00 − 0.62 × 10.00 = 103.80 down to 110.00 − 0.79 × 10.00 = 102.10.",
          "Sweet spot, 70.5%: 110.00 − 0.705 × 10.00 = ?",
        ],
        ask: {
          answer: 102.95,
          tolerance: 0.01,
          feedback: [
            { value: 107.05, text: "That measures up from the low. A long's retracement is measured down from the high: 110.00 − 7.05." },
            { value: 7.05, text: "That's the distance. Take it off the high: 110.00 − 7.05." },
          ],
          correct: "Right: 102.95. Equilibrium is the old 50% rule; the OTE band sits on Fibonacci's 61.8–78.6%.",
        },
        after: "[[premium-discount|Premium and discount]] is the 50% rule, and [[optimal-trade-entry|OTE]] is [[fibonacci-retracement|Fibonacci]] with rounded ratios. Both grade D: the ratios have no shown mechanical force, and trends can stay in \"premium\" for a long time.",
        concept: "optimal-trade-entry",
      },
      {
        kind: "figure",
        title: "A strict order block",
        figure: {
          kind: "chart",
          chart: { candles: OB27 },
          steps: [
            { text: "Candle 27's body is 0.60, 1.9 × the 0.32 ATR of the 14 candles before it.", layers: [mark(26, "close", "1.9 ATR", "accent")] },
            { text: "It closes at 101.31, above the latest swing high, 101.06: structure breaks.", layers: [brk(20, 26, 101.06, "Swing high", "neutral")] },
            { text: "The last down candle before it: candle 26, from 100.95 to 100.71.", layers: [mark(25, "high", "Last down candle")] },
            { text: "The zone is that candle's body: 100.71 to 100.95.", layers: [{ kind: "zone", from: 100.71, to: 100.95, role: "concept", label: "Order block" }] },
          ],
        },
        text: "Four rules, each a parameter: the displacement size, the swing length, how far back to look, and body or full candle. Without them, any candle can be called a block after the move.",
        concept: "order-block",
      },
      {
        kind: "fields",
        title: "Your rule set",
        prompt: "Fix your order-block rules before you see any result. The lab tests them as written.",
        fields: [
          { id: "disp", label: "Displacement body, at least", kind: "choice", options: [1, 1.5, 2, 2.5], unit: " × ATR", default: 1.5 },
          { id: "swing", label: "Swing length N", kind: "stepper", min: 2, max: 10, step: 1, default: 3 },
          { id: "look", label: "Look back for the last opposite candle", kind: "stepper", min: 1, max: 10, step: 1, unit: " candles", default: 5 },
          { id: "react", label: "A reaction is a move of", kind: "choice", options: [0.5, 1, 1.5], unit: " × ATR", default: 1 },
          { id: "fail", label: "When the block counts as failed", kind: "text", placeholder: "For example: a close under the zone before the reaction", required: true, default: "" },
        ],
        valid: { field: "fail", ne: "" },
        feedback: [{ when: { field: "fail", eq: "" }, text: "Write when the block has failed. If a failure can become \"mitigated\" later, the rule can never lose." }],
        correct: "Saved. A failure is now a failure, whatever it would be called afterwards.",
        concept: "order-block",
      },
      {
        kind: "predict",
        title: "Blocks against random zones",
        prompt: "Strict blocks on the random walk. From the first touch, price rose 1 ATR before it fell 1 ATR how often, compared with random zones at the same distance?",
        control: {
          kind: "choice",
          choices: [
            { id: "better", label: "Clearly more often", feedback: "Not here: 50.3% against 49.6%, inside a ±4.1-point noise band." },
            { id: "same", label: "About as often" },
            { id: "worse", label: "Clearly less often", feedback: "Not on the random walk: 50.3% against 49.6%." },
          ],
          answer: "same",
        },
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "Random walk: blocks (1,466)", value: 50.3, role: "concept" },
            { label: "Random walk: random zones (960)", value: 49.6, role: "neutral" },
            { label: "Stops ON: blocks (1,529)", value: 49.8, role: "concept" },
            { label: "Stops ON: random zones (981)", value: 49.9, role: "neutral" },
          ],
          steps: ["Rose 1 ATR before falling 1 ATR, from the first touch of the zone."],
        },
        reveal: "Within noise on both markets. Outside the simulator there's no peer-reviewed support; one broker reported about 43% for blocks alone, method unpublished. Gaps fare the same: in a 1,000,000-candle random walk, FVGs were revisited within 20 candles 83.4% of the time, random levels 83.5%. Grade D.",
        concept: "order-block",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Fifteen zones on one chart means everything is a zone, and something will \"react\". Switching timeframes until a block appears is the same mistake: [[timeframe-shopping]]. And if a broken block can still become \"mitigated\" or a [[breaker-block|breaker]], no result can ever count against it.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: NOISE_CARDS,
      goal: "Six order-block results. Label each one: within noise, beyond noise, or can't judge.",
      success: { field: "solved", eq: 6 },
      correct: "All six labelled. The one clear gap went against the blocks, and a number without a control or an out-of-sample run can't be judged yet.",
      hints: [
        "Compare the gap between the two rates with the noise band.",
        "No random-zone control and no published method means there's nothing to compare with.",
        "Tuned and scored on the same trades? That needs an out-of-sample run first.",
      ],
      showMe: { solved: 6 },
      concept: "order-block",
    },
    check: ["q-3.5.4-1", "q-3.5.4-2", "q-3.5.4-3"],
    recap: {
      takeaways: [
        "Order blocks, breakers and FVGs rename supply and demand zones, role reversal and gaps.",
        "Premium and discount is the 50% rule; OTE is Fibonacci 61.8–78.6%. Both grade D.",
        "Strict blocks reacted like random zones at the same distance: 50.3% against 49.6%.",
      ],
      next: "Next, 3.5.5: time and algorithm words. Killzones, PO3, IPDA and SMT, checked against the session clock of 2.9.",
    },
  },
};

// ─── 3.5.5 · Time and algorithm words: killzones, PO3, IPDA, SMT ────────────

const TIME_CLAIMS = [
  { id: "documented", label: "Documented", what: "Documented means measured in market data." },
  { id: "undocumented", label: "Not shown", what: "Not shown means it could be tested but no test supports it." },
  { id: "unfalsifiable", label: "Unfalsifiable as stated", what: "Unfalsifiable means no result could count against it." },
];

const TIME_CARDS = cardSort(TIME_CLAIMS, [
  {
    id: "vol-open",
    text: "Price moves more around the London open than in the middle of the Asian session.",
    answer: "documented",
    correct: "Documented. Volatility follows the session clock, with U-shapes in Tokyo and London hours (Ito and Hashimoto): grade A.",
    clue: "Here it's about how much price moves, measured by hour.",
  },
  {
    id: "overlap",
    text: "Spreads tend to be narrowest when trading is busiest, such as the London–New York overlap.",
    answer: "documented",
    correct: "Documented. More deals go with narrower spreads in the same data.",
    clue: "Here it's about activity and spreads, both measured.",
  },
  {
    id: "london-high",
    text: "London sets the day's high or low, and New York reverses it.",
    answer: "undocumented",
    correct: "Not shown. It's testable, sometimes true, and no published test supports it as a rule: grade D.",
    clue: "Here a session gets a fixed directional role you could count.",
  },
  {
    id: "silver",
    text: "Setups inside the 10:00–11:00 Silver Bullet window win more often.",
    answer: "undocumented",
    correct: "Not shown. A time filter on a setup can be tested; no published test exists.",
    clue: "Here a window is said to give better results, which you could count.",
  },
  {
    id: "ipda",
    text: "An interbank algorithm delivers price between liquidity pools and gaps.",
    answer: "unfalsifiable",
    correct: "Unfalsifiable as stated. No documented algorithm, and any path can be described as \"delivered\".",
    clue: "Here a hidden actor steers price, and every path fits.",
  },
  {
    id: "po3",
    text: "Each daily candle runs accumulation, manipulation, then distribution.",
    answer: "unfalsifiable",
    correct: "Unfalsifiable as stated. Any closed candle with a wick can be told this way afterwards.",
    clue: "Here a story is fitted to each candle after it closes.",
  },
]);

const L355: Lesson = {
  id: "3.5.5",
  title: "Time and algorithm words: killzones, PO3, IPDA, SMT",
  topic: "technical_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Killzones rename session volatility, which is real; the direction claimed for each window is not shown, PO3 fits any candle after it closes, and IPDA can't be falsified.",
  objectives: [
    "Map killzones, the Silver Bullet, \"macros\", the Power of Three, the Asian range and SMT divergence to session volatility, Wyckoff cycles and Dow's confirmation principle.",
    "Separate the documented part (volatility follows the session clock) from the undocumented part (direction by time window).",
    "Explain why the IPDA claim cannot be falsified and conflicts with what is known about FX market structure.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
    { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
  ],
  script: {
    unit: "3.5",
    courseId: "3.5.5",
    bridge: "In 3.5.4 strict order blocks reacted like random zones. The last words are about time and an algorithm. In 2.9.2 volatility followed the sessions; 3.4.5's Wyckoff cycle returns as PO3; and 3.2.1 showed FX has no central book. 3.5.1's three layers sort them.",
    hook: {
      prompt: "Breakouts during the London-open window travel further than breakouts at other hours. Does that make their direction more predictable?",
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes", feedback: "Further isn't the same as more predictable. Bigger moves in both directions come from higher volatility." },
          { id: "no", label: "No" },
        ],
        answer: "no",
      },
      compare: "You said {yours}. No: the extra distance comes from volatility, which moves price further both ways. In our test, direction stayed near 50/50 in and out of the windows.",
      concept: "killzones",
    },
    learn: [
      {
        kind: "match",
        title: "Clock words",
        prompt: "Match each SMC time term to the classical idea behind it.",
        pairs: [
          { left: "Killzones", right: "Session opens and overlaps", wrong: "Windows when sessions open or overlap and volatility rises." },
          { left: "Silver Bullet", right: "A setup filtered by time of day", wrong: "A gap entry after a sweep, only inside a fixed hour." },
          { left: "\"Macros\"", right: "Volatility bursts at fixed times: data, fixes, auctions", wrong: "Releases on the hour and half-hour, fixes and auctions." },
          { left: "Power of three (AMD)", right: "Wyckoff's cycle: open, false move, trend day", wrong: "Accumulation, a false move, then the real move." },
        ],
        columns: ["SMC term", "Classical idea"],
        correct: "Right. Session timing and Wyckoff, renamed.",
        concept: "killzones",
      },
      {
        kind: "match",
        title: "Reference words",
        prompt: "Four more.",
        pairs: [
          { left: "Asian range, CBDR", right: "The overnight range", wrong: "The high and low of the quiet session, used later in the day." },
          { left: "Midnight open", right: "A session-open reference price", wrong: "A fixed opening price used as the day's reference." },
          { left: "SMT divergence", right: "Dow's confirmation principle", wrong: "Two related markets disagreeing at a swing high or low." },
          { left: "Market maker buy/sell model", right: "Wyckoff accumulation and distribution", wrong: "Range, run, reversal, delivery: Wyckoff's schematics." },
        ],
        columns: ["SMC term", "Classical idea"],
        correct: "Right. Reference prices, Dow and Wyckoff again.",
        concept: "smt-divergence",
      },
      {
        kind: "figure",
        title: "The real part",
        figure: {
          kind: "bars",
          bars: [
            { label: "00–07", value: 0.17, role: "neutral" },
            { label: "07–10", value: 0.39, role: "concept" },
            { label: "10–12", value: 0.27, role: "neutral" },
            { label: "12–15", value: 0.39, role: "concept" },
            { label: "15–18", value: 0.25, role: "neutral" },
            { label: "18–24", value: 0.17, role: "neutral" },
          ],
          steps: ["Average candle range by time of day, lab clock. Session opens are the busiest hours."],
        },
        text: "Volatility follows the session clock: activity and price changes form U-shapes within Tokyo and London hours (Ito and Hashimoto): grade A. The simulator's profile copies that shape; its numbers are a setting, not data. [[killzone|Killzones]] point at exactly these hours.",
        concept: "killzones",
      },
      {
        kind: "predict",
        title: "Distance and direction",
        prompt: "Breakouts of the prior 6 candles' range, on a random walk with that session profile. In the windows (07:00–10:00 and 12:00–15:00), which way did the next 3 candles go?",
        control: {
          kind: "choice",
          choices: [
            { id: "with", label: "With the breakout, clearly more often", feedback: "Not clearly: 50.5% inside the windows, 49.8% outside." },
            { id: "half", label: "About half the time, as outside" },
            { id: "against", label: "Against it, clearly more often", feedback: "No: 50.5% with it, about the same as outside." },
          ],
          answer: "half",
        },
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "Windows (22,886)", value: 50.5, role: "concept" },
            { label: "Other hours (42,638)", value: 49.8, role: "neutral" },
            { label: "Stops ON, windows (23,095)", value: 52.1, role: "concept" },
            { label: "Stops ON, other hours (44,435)", value: 52.7, role: "neutral" },
          ],
          steps: ["Breakouts followed by a move their way over the next 3 candles."],
        },
        reveal: "In the windows the next 3 candles moved 0.34 on average, against 0.25: about a third further. Direction: 50.5% against 49.8%, inside a ±0.8 band. With stops ON, 52.1% against 52.7%: stops add continuation at any hour. Distance follows volatility; direction ignores the clock. Simulator results.",
        concept: "killzones",
      },
      {
        kind: "figure",
        title: "A story for every candle",
        figure: {
          kind: "chart",
          chart: { candles: D5 },
          steps: [
            { text: "Day 2 closes up. Its dip to 99.20 is \"manipulation\", the run to 100.68 \"distribution\".", layers: [mark(1, "low", "M"), mark(1, "close", "D", "accent")] },
            { text: "Day 5 closes down. Now the spike to 103.53 is the \"manipulation\".", layers: [mark(4, "high", "M"), mark(4, "close", "D", "accent")] },
            { text: "All five days fit the story. They come from a random walk." },
          ],
        },
        text: "[[power-of-three|Power of three]] can narrate any candle once it has closed: the wick against the close becomes the trap. Quarterly theory tells the same story about \"quarters\" of years, weeks, days and 90 minutes, and is just as untested: grade D.",
        concept: "power-of-three",
      },
      {
        kind: "explain",
        title: "The algorithm",
        text: "[[ipda|IPDA]] claims one algorithm delivers price between liquidity and gaps. FX is fragmented: hundreds of dealers on many platforms, and dealers internalise over 80% of their clients' trades (BIS). No counterpart is documented, and as stated no result could disprove it. Grade D, and unfalsifiable.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "SMC sources disagree on the windows by 30 to 90 minutes, and on how they move with [[daylight-saving-time|daylight saving time]]. A window that shifts with the author can't be tested until you fix it. [[smt-divergence|SMT divergence]] is Dow's confirmation principle: grade D as a signal.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: TIME_CARDS,
      goal: "Six time and algorithm claims. Sort each: documented, not shown, or unfalsifiable as stated.",
      success: { field: "solved", eq: 6 },
      correct: "All six sorted. The clock moves volatility; no window owns a direction; stories fitted after the close test nothing.",
      hints: ["Is it about how much price moves, or which way?", "Could any result count against it? If not, it's unfalsifiable."],
      showMe: { solved: 6 },
      concept: "killzones",
    },
    check: ["q-3.5.5-1", "q-3.5.5-2", "q-3.5.5-3"],
    recap: {
      takeaways: [
        "Killzones are session opens; PO3 is Wyckoff's story; SMT divergence is Dow's confirmation.",
        "Volatility follows the clock (A). Direction by window isn't shown (D).",
        "IPDA can't be falsified and clashes with a fragmented, dealer-internalised FX market.",
      ],
      next: "Next, 3.5.6: the SMC claim-test lab, where you freeze one claim's rules and run the whole test yourself.",
    },
  },
};

// ─── 3.5.6 · SMC claim-test lab ─────────────────────────────────────────────

const REPORT_FLAWS = [
  { id: "ready", label: "Ready to grade", what: "Ready to grade means every run is there, with N, costs and frozen parameters." },
  { id: "no-oos", label: "No out-of-sample run", what: "No out-of-sample run means the rule was only scored on the data used to tune it." },
  { id: "no-r0", label: "No R0 control", what: "No R0 control means nobody checked what the rule scores where no edge can exist." },
  { id: "no-costs", label: "Costs left out", what: "Costs left out means spread and commission weren't taken off." },
  { id: "grade", label: "Grade not backed by the result", what: "A grade not backed by the result means the grade claims more than the runs show." },
];

const REPORT_CARDS = cardSort(REPORT_FLAWS, [
  {
    id: "r1",
    text: "H3, order blocks. In-sample 58% (N 240), out-of-sample 51% ± 4 (N 410), R0 50%, net −0.12R. Grade D.",
    answer: "ready",
    correct: "Ready to grade. Every run is there, and D fits: out of sample is inside the noise around the R0 result.",
    clue: "Here every run, the sample sizes and the costs are reported.",
  },
  {
    id: "r2",
    text: "H1, sweeps. In-sample 61% (N 220), R0 49%, net +0.08R after costs. Grade B.",
    answer: "no-oos",
    correct: "No out-of-sample run. The 61% was measured on the data the rule was tuned on.",
    clue: "Here only the tuning data scored the rule.",
  },
  {
    id: "r3",
    text: "H4, killzones. In-sample 54% (N 900), out-of-sample 53% (N 880), net +0.02R. Grade C.",
    answer: "no-r0",
    correct: "No R0 control. Without it, you can't tell 53% from what the same rule does on a random walk.",
    clue: "Here there's no run on a market without any edge.",
  },
  {
    id: "r4",
    text: "CHoCH rule. In-sample 57% (N 300), out-of-sample 55% (N 310), R0 50%. Average +0.04 per unit. Grade B.",
    answer: "no-costs",
    correct: "Costs left out. At about 0.20 per unit for a round trip, +0.04 gross is a loss.",
    clue: "Here the average is gross: spread and commission are missing.",
  },
  {
    id: "r5",
    text: "H2, gaps. In-sample 55% (N 260), out-of-sample 50% ± 5 (N 300), R0 50%, net −0.20R. Grade B.",
    answer: "grade",
    correct: "Grade not backed. Out of sample sits on the R0 result and the net is negative: that's D, not B.",
    clue: "Here the runs are complete, but they don't support the grade.",
  },
]);

const L356: Lesson = {
  id: "3.5.6",
  title: "SMC claim-test lab",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 9,
  summary: "Turn one SMC idea into frozen rules, run it in-sample, out-of-sample, on the random walk and after costs, and grade it yourself with the result that would change your mind.",
  objectives: [
    "Turn one SMC idea into mechanical rules with every parameter exposed.",
    "Run it in-sample, out-of-sample, on R0 and with costs, and report the result with its sample size.",
    "Grade the claim yourself (A–F) and write which result would change your mind.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
  ],
  script: {
    unit: "3.5",
    courseId: "3.5.6",
    bridge: "From 3.5.2 to 3.5.5 the lessons ran the tests: CHoCH, sweeps, order blocks, killzones. Now you run one. 3.4.1's rule holds: fix rules, parameters and sample size before any result. Then in-sample, out-of-sample, the random walk and costs, and you grade it.",
    hook: {
      prompt: "You tune an order-block rule across 72 variants until one wins 65% in-sample. What win rate do you expect out-of-sample?",
      control: {
        kind: "slider",
        min: 30,
        max: 80,
        step: 1,
        unit: "%",
        start: 65,
        feedback: [
          { from: 30, to: 44, text: "Lower than it turned out: about 49%." },
          { from: 45, to: 55, text: "That's where it landed: about 49%." },
          { from: 56, to: 80, text: "Higher than it turned out: about 49%." },
        ],
      },
      compare: "You expected {yours}. In this lesson's run the best of 72 variants won 65.1% of 43 trades in-sample, then 49.1% of 395 out-of-sample, on a random walk.",
      concept: "testable-reformulation",
    },
    learn: [
      {
        kind: "explain",
        title: "Four claims, one form",
        text: "H1: sweeps reverse. H2: gaps get revisited more than random levels. H3: order blocks react more than random zones. H4: killzone breakouts are more predictable. Each report holds the rule, every parameter, N, in-sample, out-of-sample, the random-walk run, costs, a grade and \"what would change my mind\".",
      },
      {
        kind: "order",
        title: "The lab, step by step",
        prompt: "Put the steps of a claim test in order.",
        items: [
          "Pick the claim",
          "Write the rules with every parameter",
          "Freeze the parameters",
          "Run in-sample",
          "Run out-of-sample",
          "Run on the random walk",
          "Apply the costs",
          "Grade it",
        ],
        explain: "Rules and parameters come before any data. Freezing them before the out-of-sample run is what makes that run a test, not more tuning.",
        wrong: "Nothing gets tuned after you've seen the out-of-sample data. Freeze first, then run.",
        concept: "testable-reformulation",
      },
      {
        kind: "worked",
        title: "Tight stops, real costs",
        lines: [
          "Average win 0.30, stop 0.15, win rate 40%.",
          "Gross per unit: 0.40 × 0.30 − 0.60 × 0.15 = 0.12 − 0.09 = 0.03.",
          "Costs per unit at 100.00: spread 0.10 + commission about 0.05 × 2 = 0.20.",
          "Net per unit: 0.03 − 0.20 = ?",
        ],
        ask: {
          answer: -0.17,
          tolerance: 0.01,
          feedback: [
            { value: 0.17, text: "Check the sign: costs are bigger than the gross edge, so the result is a loss." },
            { value: -0.07, text: "That counts only the spread. Commission is paid twice, about 0.05 each way." },
            { value: -0.12, text: "That counts the commission once. A round trip pays it on the way in and the way out." },
          ],
          correct: "Right: −0.17 per unit. An edge of 0.03 can't carry costs of 0.20.",
        },
        after: "Tight-stop entries make the gross edge per trade tiny, smaller than the [[round-trip]] cost. Always report the result after costs: [[after-cost-expectancy]].",
        concept: "testable-reformulation",
      },
      {
        kind: "predict",
        title: "In-sample, then out",
        prompt: "We tuned 72 order-block variants on a random walk and froze the best one. Out of sample, did its 65.1% hold?",
        control: {
          kind: "choice",
          choices: [
            { id: "held", label: "Mostly: about 62%", feedback: "It didn't: 49.1%. On a random walk, the best tuned result is luck." },
            { id: "fell", label: "No: back to about 50%" },
            { id: "worse", label: "It flipped to about 35%", feedback: "Not that far: 49.1%, which is about where any rule lands on a random walk." },
          ],
          answer: "fell",
        },
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "In-sample, best of 72 (43 trades)", value: 65.1, role: "concept" },
            { label: "Out-of-sample, frozen (395 trades)", value: 49.1, role: "neutral" },
          ],
          steps: ["Win rate: price rose 1 ATR before it fell 1 ATR."],
        },
        reveal: "65.1% on 43 trades became 49.1% on 395, ±4.9. Pick the best of 72 on small samples and you pick the luckiest. Real edges shrink too: published predictors returned 58% less after publication (McLean and Pontiff, 2016; grade B).",
        concept: "testable-reformulation",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Grade it like a reviewer. Write the result that would make you drop the claim before you run it. If no result could, the claim isn't testable. Smart money concepts as a whole: grade D. No peer-reviewed test was found, and one preprint found \"no evidence… as literally taught\", with one CHoCH-plus-gap variant surviving on one currency pair.",
      },
      {
        kind: "fields",
        title: "Your report",
        prompt: "Write your lab report. The app checks that it's complete and consistent, not whether the rule made money.",
        fields: [
          { id: "claim", label: "Claim (H1–H4 or your own)", kind: "text", placeholder: "For example: H3, order blocks react more than random zones", required: true, default: "" },
          { id: "n", label: "Events per run", kind: "choice", options: [50, 100, 200, 500], default: 100 },
          { id: "results", label: "In-sample, out-of-sample and random-walk results, with their N", kind: "text", placeholder: "For example: IS 58% (N 240); OOS 51% ± 4 (N 410); R0 50%", required: true, default: "" },
          { id: "net", label: "Net result per trade after costs", kind: "stepper", min: -1, max: 1, step: 0.05, unit: "R", default: 0 },
          { id: "clear", label: "How far out-of-sample clears its noise band around the random-walk result (0 if inside)", kind: "stepper", min: 0, max: 20, step: 1, unit: " points", default: 0 },
          { id: "grade", label: "Your grade (A = 4, B = 3, C = 2, D = 1, F = 0)", kind: "choice", options: [4, 3, 2, 1, 0], default: 3 },
          { id: "change", label: "What would change my mind", kind: "text", placeholder: "The result that would raise or lower the grade", required: true, default: "" },
        ],
        valid: {
          all: [
            { field: "claim", ne: "" },
            { field: "results", ne: "" },
            { field: "change", ne: "" },
            { field: "n", gte: 200 },
            { not: { all: [{ field: "grade", gte: 3 }, { any: [{ field: "clear", lte: 0 }, { field: "net", lte: 0 }] }] } },
          ],
        },
        feedback: [
          { when: { field: "claim", eq: "" }, text: "Name the claim you tested." },
          { when: { field: "results", eq: "" }, text: "Write all three results with their sample sizes. A rate without its N can't be judged." },
          { when: { field: "n", lt: 200 }, text: "With {n} events per run the noise band is too wide to grade anything. Use at least 200." },
          { when: { all: [{ field: "grade", gte: 3 }, { field: "clear", lte: 0 }] }, text: "B or better needs an out-of-sample result clear of its noise band. Yours sits inside it: D fits." },
          { when: { all: [{ field: "grade", gte: 3 }, { field: "net", lte: 0 }] }, text: "B or better needs a positive result after costs. At {net}R, the edge doesn't survive them." },
          { when: { field: "change", eq: "" }, text: "Write what would change your mind. A grade no result could move isn't a grade." },
        ],
        correct: "Saved. Complete and consistent: every run has its N, the costs are in, and the grade claims no more than the results show.",
        concept: "testable-reformulation",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: REPORT_CARDS,
      goal: "Five lab reports from other learners. Review each one: ready to grade, or name what's missing.",
      success: { field: "solved", eq: 5 },
      correct: "All five reviewed. A report needs in-sample, out-of-sample, the random walk and costs, and a grade the numbers support.",
      hints: ["Check for four runs: in-sample, out-of-sample, random walk, and the result after costs.", "Then ask whether the grade claims more than the runs show."],
      showMe: { solved: 5 },
      concept: "testable-reformulation",
    },
    check: ["q-3.5.6-1", "q-3.5.6-2", "q-3.5.6-3"],
    recap: {
      takeaways: [
        "Write every rule and parameter, then freeze them before the out-of-sample run.",
        "Report N, in-sample, out-of-sample, the random walk and the result after costs.",
        "Grade it yourself, and write the result that would change your mind.",
      ],
      next: "Next, the Unit 3.5 checkpoint. Then Unit 3.6, Macro and intermarket: from chart vocabulary to rates, the dollar and commodities.",
    },
  },
};

// ─── Check questions ────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 3.5.1
  {
    id: "q-3.5.1-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which of these claims is mechanics, true by how orders work?",
    options: [
      { id: "a", label: "Stop-losses cluster just beyond round numbers", rationale: "That's a measured tendency from order data: true more often than not, with exceptions." },
      { id: "b", label: "Institutions defend their order blocks", rationale: "That's a narrative about intent. If the zone breaks, the story simply changes." },
      { id: "c", label: "A triggered stop-loss becomes a market order" },
      { id: "d", label: "Volatility rises at session opens", rationale: "That's a documented tendency, an average by hour, not a rule that holds every day." },
    ],
    correct: "c",
    explanation: "A stop order turns into a market order when its price trades: that's how the order type works, every time. Clustering beyond round numbers and busier opens are measured tendencies. \"Defending\" a block is a story about intent.",
    lesson: "3.5.1",
    concepts: ["claim-layers"],
  },
  {
    id: "q-3.5.1-2",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "A level holds, and a video says \"institutions defended it\". A week later the same level breaks, and the video says \"they were inducing liquidity\".",
    prompt: "Why can't this explanation be tested?",
    options: [
      { id: "a", label: "It fits both outcomes, so no result could count against it" },
      { id: "b", label: "Only because retail traders can't see order-book data", rationale: "Data would test order flows, not this story. As told, it fits a hold and a break alike." },
      { id: "c", label: "Two examples are too few to judge it", rationale: "More examples wouldn't help: every one, hold or break, already has a story ready." },
      { id: "d", label: "It can: price moved, which confirms the institutions acted", rationale: "Price moves either way. A claim confirmed by every outcome predicts nothing." },
    ],
    correct: "a",
    explanation: "A testable claim says in advance what would prove it wrong. Here a hold means defence and a break means inducement, so every outcome confirms it. That's intent attribution: it explains everything and predicts nothing.",
    lesson: "3.5.1",
    concepts: ["intent-attribution"],
    hints: ["What would the video say if the level had done the opposite?", "A testable claim names a result that would count against it."],
  },
  {
    id: "q-3.5.1-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "A channel teaches SMC for free. Each video links a paid indicator and a prop-firm challenge with a discount code.",
    prompt: "What matters most when you judge its claims?",
    options: [
      { id: "a", label: "Free lessons can't be accurate", rationale: "Price isn't the issue. Free or paid, the question is what the claims are based on and who gains." },
      { id: "b", label: "It earns from your purchases whether or not the method works" },
      { id: "c", label: "Prop-firm challenges are illegal", rationale: "They're legal products. The point is the channel earns from your sign-up, not from your results." },
      { id: "d", label: "Indicators can't show SMC concepts", rationale: "Vendors do code them. That makes them standard-setters with an interest in the method looking good." },
    ],
    correct: "b",
    explanation: "Course, indicator and challenge sales pay the seller whether or not the method has an edge: a conflict of interest. It doesn't make every claim false, but it means the claims need independent tests, with base rates and costs.",
    lesson: "3.5.1",
    concepts: ["smart-money-concepts", "performance-claims"],
    hints: ["Follow the money: when does the channel get paid?", "Does it get paid only if your trading works?"],
  },
  // 3.5.2
  {
    id: "q-3.5.2-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "In classical terms, a change of character (CHoCH) in an uptrend is…",
    options: [
      { id: "a", label: "A new higher high, so the trend continues", rationale: "That's a BOS, a with-trend break. A CHoCH breaks against the trend." },
      { id: "b", label: "A fast run of large trend bars", rationale: "That's displacement, which is momentum renamed." },
      { id: "c", label: "The first break of the last higher low: Dow's warning" },
      { id: "d", label: "A gap between candle 1 and candle 3", rationale: "That's a fair value gap, a zone word, not a structure word." },
    ],
    correct: "c",
    explanation: "A CHoCH is the first counter-trend break of the last protected swing: in an uptrend, the last higher low. Dow theory and the structure break of 1.5 describe the same event. Only the name is new.",
    lesson: "3.5.2",
    concepts: ["change-of-character", "structure-break"],
  },
  {
    id: "q-3.5.2-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "Two traders run a CHoCH detector on the same 60 candles. One sees 3 CHoCH labels, the other 1.",
    prompt: "What is the most likely reason?",
    options: [
      { id: "a", label: "One detector has a bug", rationale: "Possible, but rarely needed. Different settings already give 3 or 1 on the same candles." },
      { id: "b", label: "They use a different swing length N, or close versus wick" },
      { id: "c", label: "The candles changed between their looks", rationale: "Closed candles don't change. The settings do." },
      { id: "d", label: "Only one count can be right", rationale: "Both are right under their own settings. Structure depends on definitions you choose." },
    ],
    correct: "b",
    explanation: "On one 60-candle chart the close rule gave 3 CHoCH labels with N = 2, 2 with N = 3 and 1 with N = 5; the wick rule gave more. Each setting is a choice, and every choice is another degree of freedom.",
    lesson: "3.5.2",
    concepts: ["change-of-character", "swing-points"],
    hints: ["What does a detector have to decide before it labels anything?", "A larger N keeps fewer swings; a wick rule breaks levels more often."],
  },
  {
    id: "q-3.5.2-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which grade fits the claim \"a CHoCH signals a reversal\"?",
    options: [
      { id: "a", label: "A: trend following is well documented", rationale: "That's monthly trend following in futures. Intraday swing-label rules haven't been tested as such." },
      { id: "b", label: "Mechanic: a CHoCH is a defined event", rationale: "The definition is Mechanic. The prediction that a reversal follows is a separate claim." },
      { id: "c", label: "F: it loses by design", rationale: "F is for rules built to lose, such as martingale. This one is unproven, not doomed by construction." },
      { id: "d", label: "D: unproven when tested" },
    ],
    correct: "d",
    explanation: "Intraday swing rules haven't been tested as such, and on a random walk the CHoCH rule matched any candle: 49.8% against 49.7%. Where it did better, in a trending market, the edge came from the trend, as with any trend-following rule.",
    lesson: "3.5.2",
    concepts: ["change-of-character", "evidence-grades"],
    hints: ["Separate the definition from the prediction.", "What did the CHoCH rule do on the random walk?"],
  },
  // 3.5.3
  {
    id: "q-3.5.3-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "In classical terms, sell-side liquidity is…",
    options: [
      { id: "a", label: "Sell stops resting below swing lows" },
      { id: "b", label: "Large sellers waiting to sell at the highs", rationale: "SMC's sell-side is below the lows: the sell stops of longs and breakout traders." },
      { id: "c", label: "The bid side of the order book", rationale: "The term isn't about resting bids. It names stop orders below lows, which become sells when triggered." },
      { id: "d", label: "A failed breakout below a low", rationale: "That's the sweep. Sell-side liquidity is the orders the sweep would trigger." },
    ],
    correct: "a",
    explanation: "Longs put stop-losses under swing lows, and breakout traders put sell stops there too. Triggered, they become market sells. SMC calls that pool sell-side liquidity; classically it's stop clustering.",
    lesson: "3.5.3",
    concepts: ["liquidity-pool", "stop-clustering"],
  },
  {
    id: "q-3.5.3-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "\"They swept the stops, now we reverse.\" Which part is documented?",
    options: [
      { id: "a", label: "The reversal after the sweep", rationale: "That's the contradicted part: the only systematic test found continuation, not reversal." },
      { id: "b", label: "That someone planned the sweep", rationale: "Intent can't be seen in prices. It's the untestable part." },
      { id: "c", label: "Stops cluster beyond levels and speed price up when triggered" },
      { id: "d", label: "All of it, given enough examples", rationale: "Examples chosen after the fact show nothing. Two of the three parts fail or can't be tested." },
    ],
    correct: "c",
    explanation: "Osler's order data show stops clustering beyond obvious levels and trends speeding up through them: grade B. The reversal is contradicted (grade D), and the plan behind it can't be observed.",
    lesson: "3.5.3",
    concepts: ["liquidity-sweep", "stop-clustering"],
    hints: ["Split the sentence into what happened, why, and what comes next.", "Which part has order data behind it?"],
  },
  {
    id: "q-3.5.3-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which version of \"sweeps reverse\" is a testable hypothesis?",
    options: [
      { id: "a", label: "Smart money reverses price after taking the highs", rationale: "No event rule, no horizon, no baseline, and an actor nobody can observe." },
      { id: "b", label: "After a sweep, price falls over the next 10 candles", rationale: "Close, but with no baseline: price falls after half of all candles anyway." },
      { id: "c", label: "Sweeps usually reverse, so watch for them", rationale: "\"Usually\" has no number, no horizon and no comparison. Nothing could count against it." },
      { id: "d", label: "After a trade 1 tick above the prior-day high and a close back under it, the next 10 candles fall more often than after a random candle" },
    ],
    correct: "d",
    explanation: "A testable hypothesis names the event exactly, the outcome over a fixed horizon and a baseline to beat. Run it on the random walk and with stops on and off, and the data can say no.",
    lesson: "3.5.3",
    concepts: ["testable-reformulation"],
    hints: ["Look for an exact event, a fixed horizon and a comparison.", "Only one option says what the result is compared with."],
  },
  // 3.5.4
  {
    id: "q-3.5.4-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "A breaker block is SMC's name for…",
    options: [
      { id: "a", label: "A zone that broke and now acts the opposite way: role reversal" },
      { id: "b", label: "The last opposite candle before a strong move", rationale: "That's the order block itself. A breaker is what SMC calls it after it fails." },
      { id: "c", label: "A three-candle gap", rationale: "That's a fair value gap." },
      { id: "d", label: "The 50% point of a range", rationale: "That's equilibrium, the line between premium and discount." },
    ],
    correct: "a",
    explanation: "A broken support acting as resistance, or the reverse, is role reversal from 1.5. SMC calls a failed order block that flips this way a breaker. The rename also turns a failure into a new zone.",
    lesson: "3.5.4",
    concepts: ["order-block", "role-reversal"],
  },
  {
    id: "q-3.5.4-2",
    topic: "technical_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "A dealing range runs from 80.00 up to 92.00. Where is the OTE \"sweet spot\", the 70.5% retracement, for a long?",
    numeric: { answer: 83.54, tolerance: 0.01, unit: "" },
    explanation: "The range is 12.00. A long's retracement is measured down from the high: 92.00 − 0.705 × 12.00 = 92.00 − 8.46 = 83.54. It sits inside Fibonacci's 61.8–78.6% band: OTE is that band with rounded ratios.",
    lesson: "3.5.4",
    concepts: ["optimal-trade-entry", "fibonacci-levels"],
    hints: ["Find the size of the range first.", "Measure down from the high: high − 0.705 × range.", "92.00 − 0.705 × 12.00."],
    vary: {
      fields: { low: [50, 150, 1], size: [4, 20, 1] },
      answer: "round(low + size - 0.705 * size, 2)",
      prompt: "A dealing range runs from {low:2} up to {low + size:2}. Where is the OTE \"sweet spot\", the 70.5% retracement, for a long?",
      explanation: "The range is {size:2}. A long's retracement is measured down from the high: {low + size:2} − 0.705 × {size:2} = {low + size:2} − {0.705 * size:2} = {answer:2}. It sits inside Fibonacci's 61.8–78.6% band: OTE is that band with rounded ratios.",
      hint: "{low + size:2} − 0.705 × {size:2}.",
    },
  },
  {
    id: "q-3.5.4-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "An order block holds: \"institutions defended it\". It breaks: \"it was mitigated\", or \"it's a breaker now\". What does this do to the claim \"order blocks hold\"?",
    options: [
      { id: "a", label: "It makes the claim stronger, because it explains more cases", rationale: "Explaining every case is the problem: a claim that fits every outcome predicts none." },
      { id: "b", label: "It makes it unfalsifiable: no outcome counts against it" },
      { id: "c", label: "Nothing, as long as the zones are drawn carefully", rationale: "Careful drawing doesn't help if failures are renamed afterwards. The rule must say in advance what failure is." },
      { id: "d", label: "It proves order blocks fail", rationale: "It proves nothing either way. It removes the possibility of a test." },
    ],
    correct: "b",
    explanation: "If a hold confirms the claim and a break gets a new name, no result can count against it. A testable version fixes the rules and says in advance when a block has failed, then compares blocks with random zones.",
    lesson: "3.5.4",
    concepts: ["order-block", "intent-attribution"],
    hints: ["What result would the claim accept as a failure?", "A testable claim says in advance what failure looks like."],
  },
  // 3.5.5
  {
    id: "q-3.5.5-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "SMT divergence, two related markets disagreeing at a swing, is a new name for…",
    options: [
      { id: "a", label: "The Wyckoff cycle", rationale: "That's what the power of three and the market maker models rename." },
      { id: "b", label: "Session opens and overlaps", rationale: "That's what killzones rename." },
      { id: "c", label: "An RSI divergence", rationale: "Close, but RSI divergence compares price with an oscillator. SMT compares two markets." },
      { id: "d", label: "Dow's confirmation principle" },
    ],
    correct: "d",
    explanation: "Dow wanted the Industrials and the Transports to confirm each other's highs. SMT divergence applies the same check to pairs like two stock indices or two currency pairs. As a signal it grades D.",
    lesson: "3.5.5",
    concepts: ["smt-divergence", "dow-theory"],
  },
  {
    id: "q-3.5.5-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which part of the killzone idea is documented?",
    options: [
      { id: "a", label: "London sets the day's high or low", rationale: "A directional role for a session: testable, but no published test supports it as a rule." },
      { id: "b", label: "Volatility and activity rise around session opens and overlaps" },
      { id: "c", label: "Setups inside the windows win more often", rationale: "No published test shows it. In our test, direction stayed near 50/50 in and out of the windows." },
      { id: "d", label: "Breakouts inside the windows are more predictable", rationale: "They travel further, about a third, because volatility is higher. Their direction isn't more predictable." },
    ],
    correct: "b",
    explanation: "Volatility follows the session clock, with U-shapes in Tokyo and London hours (Ito and Hashimoto): grade A. Directional roles for the windows are grade D. Bigger moves in both directions aren't a direction.",
    lesson: "3.5.5",
    concepts: ["killzones", "fx-sessions"],
    hints: ["Separate how much price moves from which way it moves.", "Which part has been measured in market data?"],
  },
  {
    id: "q-3.5.5-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why is the IPDA claim graded D and called unfalsifiable?",
    options: [
      { id: "a", label: "Its code is secret, but it could be leaked one day", rationale: "The problem isn't secrecy. As stated, any price path can be called \"delivered\", so no result could count against it." },
      { id: "b", label: "Algorithms are banned in FX", rationale: "Algorithms trade FX all the time. What's missing is one central algorithm that steers price." },
      { id: "c", label: "No result could disprove it, and FX is fragmented across many dealers" },
      { id: "d", label: "It was tested and lost money", rationale: "It can't be tested at all as stated. That's worse than losing money in a test." },
    ],
    correct: "c",
    explanation: "Any price path can be described as delivered between liquidity and gaps, so nothing could count against the claim. It also clashes with what's known: FX runs through hundreds of dealers and platforms, and dealers internalise over 80% of client trades (BIS).",
    lesson: "3.5.5",
    concepts: ["ipda-claim"],
    hints: ["What price path would the claim fail to explain?", "Think about how many dealers and platforms make up FX."],
  },
  // 3.5.6
  {
    id: "q-3.5.6-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "In a claim-test report, what does the random-walk (R0) run tell you?",
    options: [
      { id: "a", label: "What the rule scores where no edge can exist" },
      { id: "b", label: "How the rule did on the data used to tune it", rationale: "That's the in-sample run." },
      { id: "c", label: "How the rule did on fresh data it wasn't tuned on", rationale: "That's the out-of-sample run." },
      { id: "d", label: "How much the costs take", rationale: "Costs are a separate step, applied to every run." },
    ],
    correct: "a",
    explanation: "On a random walk with the same volatility, no rule can have an edge. Whatever the rule scores there is what chance and the rule's geometry give. A real edge has to beat it out of sample and after costs.",
    lesson: "3.5.6",
    concepts: ["testable-reformulation", "random-walk"],
  },
  {
    id: "q-3.5.6-2",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "A tight-stop rule: average win 0.40, stop 0.20, win rate 45%, price 80.00. Spread 0.10; commission 0.05% of the price each way. What is the net result per unit?",
    numeric: { answer: -0.11, tolerance: 0.01, unit: "" },
    explanation: "Gross: 0.45 × 0.40 − 0.55 × 0.20 = 0.18 − 0.11 = 0.07. Costs: spread 0.10 + commission 2 × 0.0005 × 80.00 = 0.08, so 0.18. Net: 0.07 − 0.18 = −0.11 per unit.",
    lesson: "3.5.6",
    concepts: ["trading-costs", "expectancy"],
    hints: ["Gross first: win rate × win − loss rate × stop.", "Costs: the spread once, commission on both executions.", "0.07 gross minus 0.10 + 0.08 of costs."],
    vary: {
      fields: { win: [0.2, 0.6, 0.05], stop: [0.1, 0.3, 0.05], rate: [30, 60, 5], price: [50, 200, 10] },
      answer: "round(rate / 100 * win - (1 - rate / 100) * stop - 0.1 - 0.001 * price, 2)",
      prompt: "A tight-stop rule: average win {win:2}, stop {stop:2}, win rate {rate}%, price {price:2}. Spread 0.10; commission 0.05% of the price each way. What is the net result per unit?",
      explanation: "Gross: {rate / 100:2} × {win:2} − {1 - rate / 100:2} × {stop:2} = {rate / 100 * win - (1 - rate / 100) * stop:3}. Costs: spread 0.10 + commission 2 × 0.0005 × {price:2} = {0.001 * price:2}, so {0.1 + 0.001 * price:2}. Net: {answer:2} per unit.",
      hint: "{rate / 100 * win - (1 - rate / 100) * stop:3} gross minus {0.1 + 0.001 * price:2} of costs.",
    },
  },
  {
    id: "q-3.5.6-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A report on H3: in-sample 60% (N 250); out-of-sample 52.0% ± 4.4 (N 480); random walk 50%; net −0.05R after costs. Parameters were frozen before the out-of-sample run.",
    prompt: "Which grade is consistent with this report?",
    options: [
      { id: "a", label: "B: out of sample is above 50%", rationale: "52.0 ± 4.4 includes 50, the random-walk result, and the net is negative. B needs an edge clear of noise." },
      { id: "b", label: "D: unproven when tested" },
      { id: "c", label: "A: the in-sample result is strong", rationale: "In-sample results are inflated by tuning. Grades rest on out-of-sample results after costs." },
      { id: "d", label: "Mechanic: the rule is fully specified", rationale: "Mechanic means true by construction, like the spread. A specified rule still needs evidence." },
    ],
    correct: "b",
    explanation: "The out-of-sample interval, 47.6% to 56.4%, includes the random-walk 50%, and the net is negative after costs. The test ran properly and found nothing: grade D. A clear out-of-sample edge after costs, repeated, would change it.",
    lesson: "3.5.6",
    concepts: ["evidence-grades", "testable-reformulation"],
    hints: ["Does the out-of-sample interval include the random-walk result?", "Check the sign of the net result.", "52.0 − 4.4 = 47.6, below 50."],
  },
];

// ─── Glossary terms new in this unit ────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "smc",
    term: "SMC (smart money concepts)",
    definition: "A retail trading vocabulary built on a story of institutions hunting liquidity. It renames stop clustering, Dow structure, supply and demand zones and session timing, with no official rulebook.",
    plain: "A popular set of trading words that tells a story about big players. Most of the words are old ideas with new names.",
    related: ["ict", "intent-attribution", "order-block"],
    lesson: "3.5.1",
    aka: ["Smart money concepts"],
  },
  {
    id: "ict",
    term: "ICT",
    definition: "\"Inner Circle Trader\", the online mentorship run by Michael J. Huddleston whose terms SMC repackaged.",
    plain: "The online teacher and course where most SMC words started.",
    related: ["smc"],
    lesson: "3.5.1",
    aka: ["Inner Circle Trader"],
  },
  {
    id: "intent-attribution",
    term: "Intent attribution",
    definition: "Explaining a price move by what \"they\" wanted, which no chart can show. Because a story can be told for any outcome, it predicts nothing.",
    plain: "Saying the market moved because someone planned it, without any way to check.",
    related: ["smc", "hindsight-bias", "confirmation-bias"],
    lesson: "3.5.1",
  },
  {
    id: "bos",
    term: "BOS (break of structure)",
    definition: "SMC term for a with-trend break of the latest swing: a new high in an uptrend or a new low in a downtrend, Dow's continuation.",
    plain: "The trend makes its next new high, or new low, as expected.",
    related: ["choch", "market-structure", "dow-theory", "swing-high"],
    lesson: "3.5.2",
    aka: ["Break of structure"],
  },
  {
    id: "choch",
    term: "CHoCH (change of character)",
    definition: "SMC term for the first break against the trend of its last swing, such as a close under the last higher low of an uptrend. Classically, a structure break.",
    plain: "The first sign that the trend's pattern of swings has broken.",
    related: ["bos", "mss", "structure-break", "swing-low"],
    lesson: "3.5.2",
    aka: ["Change of character"],
  },
  {
    id: "mss",
    term: "MSS (market structure shift)",
    definition: "SMC term for a failed breakout followed by a sharp reversal, close to the classical 1-2-3 reversal. Some authors use it for any CHoCH.",
    plain: "Price breaks out, fails, and turns hard the other way.",
    related: ["choch", "failed-breakout", "displacement"],
    lesson: "3.5.2",
    aka: ["Market structure shift"],
  },
  {
    id: "displacement",
    term: "Displacement",
    definition: "SMC term for a fast run of large candles in one direction, with no fixed size threshold. Classically, momentum: trend bars or a breakout spike.",
    plain: "A burst of big candles all going the same way.",
    related: ["momentum", "trend-bar", "spike-and-channel"],
    lesson: "3.5.2",
  },
  {
    id: "buy-side-liquidity",
    term: "Buy-side liquidity",
    definition: "SMC term for buy stops resting above swing highs: shorts' stop-losses and breakout traders' buy stops.",
    plain: "The buy orders waiting just above old highs.",
    related: ["sell-side-liquidity", "liquidity-pool", "stop-cluster", "swing-high"],
    lesson: "3.5.3",
    aka: ["BSL"],
  },
  {
    id: "sell-side-liquidity",
    term: "Sell-side liquidity",
    definition: "SMC term for sell stops resting below swing lows: longs' stop-losses and breakout traders' sell stops.",
    plain: "The sell orders waiting just below old lows.",
    related: ["buy-side-liquidity", "liquidity-pool", "stop-cluster", "swing-low"],
    lesson: "3.5.3",
    aka: ["SSL"],
  },
  {
    id: "inducement",
    term: "Inducement",
    definition: "SMC term for a small swing said to be bait before the real move. Classically a shake-out of trapped traders; the bait is intent nobody can prove.",
    plain: "A small move said to be a trap set on purpose. The move is visible; the purpose isn't.",
    related: ["trapped-trader", "intent-attribution", "false-breakout"],
    lesson: "3.5.3",
    aka: ["IDM"],
  },
  {
    id: "judas-swing",
    term: "Judas swing",
    definition: "SMC term for an early-session false move against the day's later direction: classically, a failed break of the opening range.",
    plain: "The day starts one way, then goes the other. You only know which was which afterwards.",
    related: ["opening-range", "failed-breakout", "inducement"],
    lesson: "3.5.3",
  },
  {
    id: "swing-failure-pattern",
    term: "Swing failure pattern",
    definition: "Price trades beyond a prior swing extreme, then closes back inside. The classical 2B pattern.",
    plain: "Price pokes past an old high or low and closes back on the near side.",
    related: ["liquidity-sweep", "failed-breakout", "turtle-soup"],
    lesson: "3.5.3",
    aka: ["SFP", "2B"],
  },
  {
    id: "draw-on-liquidity",
    term: "Draw on liquidity",
    definition: "SMC term for the high or low that price is expected to reach next. Classically, a target at a prior extreme, not a force acting on price.",
    plain: "The old high or low a trader expects price to go to next.",
    related: ["liquidity-pool", "buy-side-liquidity", "take-profit"],
    lesson: "3.5.3",
    aka: ["DOL"],
  },
  {
    id: "order-block",
    term: "Order block",
    definition: "SMC term for the last opposite candle before a strong move, used as a zone: a renamed supply or demand base.",
    plain: "The last down candle before a big rally, or the last up candle before a big drop, marked as a zone.",
    related: ["demand-zone", "supply-zone", "breaker-block", "mitigation"],
    lesson: "3.5.4",
    aka: ["OB"],
  },
  {
    id: "breaker-block",
    term: "Breaker block",
    definition: "SMC term for a failed order block that flips its role: classic role reversal.",
    plain: "A zone that broke and is now expected to work the other way.",
    related: ["order-block", "role-reversal"],
    lesson: "3.5.4",
  },
  {
    id: "mitigation",
    term: "Mitigation",
    definition: "SMC term for price returning to an earlier zone, said to let institutions finish their orders. Classically, a retracement into a prior trading area.",
    plain: "Price coming back to an old zone. The story about why can't be checked.",
    related: ["order-block", "retracement", "intent-attribution"],
    lesson: "3.5.4",
  },
  {
    id: "consequent-encroachment",
    term: "Consequent encroachment",
    definition: "SMC term for the 50% point of a gap or a wick.",
    plain: "The middle of a gap.",
    related: ["fair-value-gap", "window", "premium-discount"],
    lesson: "3.5.4",
    aka: ["CE"],
  },
  {
    id: "premium-discount",
    term: "Premium and discount",
    definition: "SMC terms for the upper and lower halves of a range, split at 50%: buy in discount, sell in premium. The old 50% retracement rule.",
    plain: "The top half of a range is \"expensive\", the bottom half \"cheap\".",
    related: ["dealing-range", "optimal-trade-entry", "fibonacci-retracement"],
    lesson: "3.5.4",
  },
  {
    id: "optimal-trade-entry",
    term: "Optimal trade entry (OTE)",
    definition: "SMC term for a 62–79% retracement zone with a 70.5% \"sweet spot\", close to Fibonacci 61.8–78.6%.",
    plain: "A deep pullback zone, the same area as the Fibonacci 61.8% to 78.6% levels.",
    related: ["fibonacci-retracement", "premium-discount", "dealing-range"],
    lesson: "3.5.4",
    aka: ["OTE"],
  },
  {
    id: "dealing-range",
    term: "Dealing range",
    definition: "SMC term for the swing range used to measure premium and discount: classically, the trading range or the last impulse leg. Which swing to use is a choice.",
    plain: "The high and low a trader picks to split into a top and bottom half.",
    related: ["premium-discount", "range", "leg"],
    lesson: "3.5.4",
  },
  {
    id: "pd-array",
    term: "PD array",
    definition: "SMC list of zone types, such as order blocks, gaps and old highs, ranked by importance: a catalogue of support and resistance zones.",
    plain: "A ranked list of the kinds of zones SMC traders mark.",
    related: ["order-block", "fair-value-gap", "premium-discount", "support"],
    lesson: "3.5.4",
  },
  {
    id: "killzone",
    term: "Killzone",
    definition: "SMC term for a session window, such as the London open, said to give better setups. Its higher volatility is documented; a directional edge is not.",
    plain: "A busy time of day that SMC traders watch. Busier, yes; more predictable, no.",
    related: ["trading-session", "session-overlap", "silver-bullet"],
    lesson: "3.5.5",
  },
  {
    id: "silver-bullet",
    term: "Silver Bullet",
    definition: "An SMC setup: a gap entry after a sweep, inside a fixed one-hour window. No published test exists.",
    plain: "An SMC trade allowed only during one hour of the day.",
    related: ["killzone", "window"],
    lesson: "3.5.5",
  },
  {
    id: "power-of-three",
    term: "Power of three (AMD)",
    definition: "SMC claim that each bar runs accumulation, manipulation, then distribution. Any closed bar with a wick against its close can be narrated this way.",
    plain: "A three-act story told about every candle after it closes.",
    related: ["hindsight-bias", "candle"],
    lesson: "3.5.5",
    aka: ["PO3", "AMD"],
  },
  {
    id: "ipda",
    term: "IPDA",
    definition: "SMC claim of an \"interbank price delivery algorithm\" steering price between liquidity and gaps. There is no evidence it exists, and as stated no result could disprove it.",
    plain: "A claimed secret algorithm that moves prices. Nobody has shown it exists.",
    related: ["smc", "intent-attribution", "market-maker"],
    lesson: "3.5.5",
  },
  {
    id: "smt-divergence",
    term: "SMT divergence",
    definition: "SMC term for two correlated markets disagreeing at a swing high or low: Dow's confirmation principle.",
    plain: "One market makes a new high and its usual partner doesn't.",
    related: ["dow-theory", "divergence", "correlation"],
    lesson: "3.5.5",
    aka: ["SMT"],
  },
  {
    id: "asian-range",
    term: "Asian range",
    definition: "The high-low range of the Asian session, used as a reference later in the day: classically, the overnight range.",
    plain: "How high and low price went during the quiet Asian hours.",
    related: ["trading-session", "opening-range", "killzone"],
    lesson: "3.5.5",
    aka: ["CBDR"],
  },
  {
    id: "testable-hypothesis",
    term: "Testable hypothesis",
    definition: "A claim written as an exact event, an outcome over a fixed horizon and a baseline, so data can reject it.",
    plain: "A claim phrased so that a test could prove it wrong.",
    related: ["backtest", "out-of-sample", "base-rate", "random-walk"],
    lesson: "3.5.6",
  },
];

// ─── Concepts new in this unit ──────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "smart-money-concepts",
    name: "Smart money concepts (SMC/ICT)",
    category: "technical_analysis",
    summary: "Retail vocabulary that renames liquidity, structure and zone ideas around a story of institutional intent.",
    body: [
      "ICT, the \"Inner Circle Trader\" mentorship, and the wider SMC movement that repackaged it, give new names to old ideas: stop clustering, Dow structure, supply and demand zones, role reversal, gaps, Fibonacci and session timing. There is no official rulebook; definitions vary by author, year and indicator vendor.",
      "For each term, ask three things: what mechanical fact sits behind it, which classical concept it renames, and what testable claim it makes. The vocabulary is worth knowing because it is everywhere. The story of a single \"smart money\" steering price is grade D, and the method as a whole has no peer-reviewed support.",
    ],
    example: "\"Smart money swept the sell-side liquidity, then delivered price to the order block\" decodes to: price ran the stops under a swing low, then rallied back to the base of a demand zone. Only the stops are documented; the intent is not.",
    related: ["claim-layers", "intent-attribution", "evidence-grades", "market-participants"],
    missions: [],
    lessons: ["3.5.1"],
  },
  {
    id: "claim-layers",
    name: "Mechanics, tendencies, narratives",
    category: "decision_making",
    summary: "Sorting a claim into market mechanics, measured statistical tendencies or untestable stories.",
    body: [
      "Mechanics are true by construction: a buy market order fills at the ask, a triggered stop becomes a market order. Tendencies are measured rates with exceptions: stops cluster beyond round numbers, volatility rises at session opens. Narratives are stories about intent: \"institutions defended the zone\".",
      "Each layer is handled differently. Rely on mechanics, test tendencies against their base rate and sample size, and treat narratives as vocabulary, because a story that fits every outcome predicts none.",
    ],
    example: "\"Stops above the highs got triggered and price jumped 0.20\" is mechanics plus a measurable tendency. \"They engineered that liquidity\" adds a narrative nobody can check.",
    related: ["base-rates", "evidence-grades", "smart-money-concepts"],
    missions: ["M02"],
    lessons: ["3.5.1"],
  },
  {
    id: "intent-attribution",
    name: "Intent attribution",
    category: "psychology",
    summary: "Explaining a price move by what \"they\" intended, which a chart cannot show.",
    body: [
      "Any outcome can be narrated afterwards: if a level holds, \"institutions defended it\"; if it breaks, \"they were inducing liquidity\". An explanation that fits every outcome cannot be wrong, so it cannot predict.",
      "Intent attribution also hurts reviews. \"I was the liquidity\" turns a loss into a story about others, and skips the questions that help: was the stop where the plan said, was the size right, was the setup in the rules?",
    ],
    example: "A level at 100.00 holds on Monday and breaks on Thursday. One video calls Monday a defence and Thursday a stop hunt. Neither story said in advance which would happen.",
    related: ["hindsight-bias", "confirmation-bias", "claim-layers"],
    missions: [],
    lessons: ["3.5.1"],
  },
  {
    id: "break-of-structure",
    name: "Break of structure (BOS)",
    category: "technical_analysis",
    summary: "SMC name for a with-trend break of the last swing: Dow theory's new high or low.",
    body: [
      "In an uptrend, a BOS is a break above the latest swing high; in a downtrend, below the latest swing low. It is Dow's continuation, the next higher high or lower low.",
      "Every detector makes three choices: the swing length N, which swing counts as the level, and whether a close or only a wick breaks it. Swings are confirmed only N candles later, so every label lags. Different choices give different labels on the same candles.",
    ],
    example: "With N = 3 and the close rule, a 60-candle chart printed BOS labels at candles 20 and 36, where closes cleared the latest swing highs at 100.67 and 100.96.",
    related: ["dow-theory", "swing-points", "change-of-character", "trend"],
    missions: ["M02"],
    lessons: ["3.5.2"],
  },
  {
    id: "change-of-character",
    name: "Change of character (CHoCH)",
    category: "technical_analysis",
    summary: "SMC name for the first counter-trend break of the last protected swing.",
    body: [
      "In an uptrend, a CHoCH is the first break below the last higher low: the structure break of 1.5 and Dow's first warning that a trend may be failing. MSS adds a failed breakout before it, the classical 1-2-3 reversal.",
      "The label depends on N and on the close or wick rule: one 60-candle chart had 3 CHoCH labels at N = 2, 2 at N = 3, 1 at N = 5, and 4 under the wick rule at N = 3. As a reversal signal it grades D: on a random walk, the next 10 candles went the new way 49.8% of the time, against 49.7% for any candle.",
    ],
    example: "An uptrend's last higher low is 99.21. One candle wicks to 99.15 and closes at 99.21; the next closes at 98.90. The close rule prints the CHoCH on the second candle, the wick rule on the first.",
    related: ["structure-break", "dow-theory", "swing-points", "break-of-structure"],
    missions: ["M02"],
    lessons: ["3.5.2"],
  },
  {
    id: "displacement",
    name: "Displacement",
    category: "technical_analysis",
    summary: "SMC name for a fast run of large trend bars: classical momentum.",
    body: [
      "Displacement describes a one-sided burst of large-bodied candles, often leaving gaps behind. There is no fixed threshold; strict rule sets use a body of at least 1.5 times the ATR.",
      "As a description of a fast move it is Mechanic. As a sign of institutional intent or of what comes next, it is grade D. Momentum's documented evidence is at horizons of months, not single candles.",
    ],
    example: "A candle opens at 100.71 and closes at 101.31: a body of 0.60, 1.9 times the 0.32 ATR of the 14 candles before it. Under a 1.5 × ATR rule it counts as displacement.",
    related: ["momentum-roc", "momentum-vs-exhaustion", "break-of-structure"],
    missions: [],
    lessons: ["3.5.2"],
  },
  {
    id: "inducement",
    name: "Inducement",
    category: "technical_analysis",
    summary: "SMC claim that a minor swing is bait whose stops are taken before the real move; the intent is unprovable.",
    body: [
      "The liquidity words decode to stop clustering and failed breakouts. Buy-side and sell-side liquidity are stops beyond highs and lows; equal highs are a double top; a sweep, turtle soup, the Judas swing and the swing failure pattern are failed breakouts; inducement is a shake-out of trapped traders.",
      "The documented part: stops cluster beyond obvious levels and speed price up when triggered (Osler, grade B). The contradicted part: \"after the sweep comes the reversal\" (grade D). The untestable part: that anyone set the trap.",
    ],
    example: "In the simulator, with stops resting above the prior day's high, 87.3% of first breaks closed above it, against 66.8% without them. After the sweeps that did close back under, price was lower 10 candles later 46.7% of the time: no reversal edge.",
    related: ["liquidity-sweep", "stop-clustering", "trapped-traders", "intent-attribution"],
    missions: [],
    lessons: ["3.5.3"],
  },
  {
    id: "order-block",
    name: "Order block",
    category: "technical_analysis",
    summary: "SMC name for the last opposite candle before a strong move: a renamed supply or demand base.",
    body: [
      "A bullish order block is the last down candle before a displacement that breaks structure; the zone is its body or its full range. Breakers and mitigation blocks are role reversal after a failure; fair value gaps are three-candle gaps.",
      "No peer-reviewed evidence supports the claim that blocks hold. Tested with strict rules on a random walk, blocks reacted as often as random zones at the same distance: 50.3% against 49.6%. Renaming failures as \"mitigated\" or as breakers makes the claim unfalsifiable. Grade D.",
    ],
    example: "Candle 27 rises from 100.71 to 101.31, 1.9 × ATR, and closes above the 101.06 swing high. The last down candle before it, 100.95 to 100.71, is the block; its body is the zone.",
    related: ["supply-demand-zones", "role-reversal", "fair-value-gap", "zone-grading"],
    missions: [],
    lessons: ["3.5.4"],
  },
  {
    id: "premium-discount",
    name: "Premium and discount",
    category: "technical_analysis",
    summary: "SMC split of a range at 50%: buy below, sell above; the old 50% rule.",
    body: [
      "Premium and discount split a dealing range at its midpoint, called equilibrium. Buying only in discount is the 50% retracement rule, which practitioners used long before SMC.",
      "The range itself is a choice: which swing high and low you pick moves the line. Trends can stay in \"premium\" for a long time, so the split is a filter at best. Grade D.",
    ],
    example: "Range 100.00 to 110.00: equilibrium is 105.00. A long in discount buys under 105.00; a strong uptrend may never come back there.",
    related: ["fibonacci-levels", "optimal-trade-entry", "range-trading"],
    missions: [],
    lessons: ["3.5.4"],
  },
  {
    id: "optimal-trade-entry",
    name: "Optimal trade entry (OTE)",
    category: "technical_analysis",
    summary: "SMC retracement band of 62–79%, overlapping Fibonacci 61.8–78.6%.",
    body: [
      "OTE is the band 62% to 79% of an impulse, measured back from its end, with a 70.5% \"sweet spot\". It is Fibonacci's 61.8–78.6% band with rounded ratios.",
      "Fibonacci ratios have shown no special power in tests, and OTE inherits that: grade D. It also inherits the anchor problem: a different swing gives a different band.",
    ],
    example: "Impulse 100.00 to 110.00: OTE runs from 103.80 (62%) to 102.10 (79%), and the sweet spot is 110.00 − 0.705 × 10.00 = 102.95.",
    related: ["fibonacci-levels", "premium-discount", "pullback"],
    missions: [],
    lessons: ["3.5.4"],
  },
  {
    id: "killzones",
    name: "Killzones",
    category: "technical_analysis",
    summary: "SMC session windows; their higher volatility is real, their directional role is unproven.",
    body: [
      "Killzones are session opens and overlaps, such as the London open. Volatility and activity really do follow the session clock, with U-shapes in Tokyo and London hours (Ito and Hashimoto): grade A.",
      "The directional roles, such as \"London sets the day's high\", have no published support: grade D. In a simulated test, breakouts inside the windows moved about a third further, but their direction stayed near 50/50, as outside. Sources also disagree on the windows by 30 to 90 minutes.",
    ],
    example: "Range breakouts inside the windows moved 0.34 over the next 3 candles, against 0.25 outside. Direction: 50.5% against 49.8%, within a ±0.8-point noise band.",
    related: ["fx-sessions", "intraday-cycle", "market-hours"],
    missions: [],
    lessons: ["3.5.5"],
  },
  {
    id: "power-of-three",
    name: "Power of three (AMD)",
    category: "technical_analysis",
    summary: "SMC claim that each bar runs accumulation, manipulation, distribution; any closed bar can be narrated so.",
    body: [
      "Power of three reads each candle as accumulation near the open, a false move against the close, then the real move. It renames Wyckoff's cycle and the classic \"open, false move, trend day\".",
      "Any closed candle with a wick against its close fits the story, so it explains everything after the fact and predicts nothing. Quarterly theory applies the same story to quarters of years, weeks and days. Grade D.",
    ],
    example: "Five daily candles from a random walk all fit: day 2 dips to 99.20 before closing at 100.68, day 5 spikes to 103.53 before closing at 102.94.",
    related: ["hindsight-bias", "intent-attribution", "candlestick"],
    missions: [],
    lessons: ["3.5.5"],
  },
  {
    id: "ipda-claim",
    name: "IPDA claim",
    category: "market_fundamentals",
    summary: "The unfalsifiable claim that one algorithm delivers price between liquidity pools and gaps.",
    body: [
      "IPDA, the \"interbank price delivery algorithm\", is said to move price between liquidity and gaps on fixed look-back windows. No such algorithm is documented.",
      "It also clashes with what is known about FX: a fragmented market of hundreds of dealers and platforms, where dealers internalise over 80% of client trades (BIS). And as stated, any price path can be called \"delivered\", so no result could count against it. Grade D.",
    ],
    example: "Price rises to an old high: \"the algorithm delivered it to buy-side liquidity\". Price falls to a gap instead: \"it delivered it to the gap\". Both paths fit, so neither tests anything.",
    related: ["market-participants", "intent-attribution", "smart-money-concepts"],
    missions: [],
    lessons: ["3.5.5"],
  },
  {
    id: "smt-divergence",
    name: "SMT divergence",
    category: "technical_analysis",
    summary: "SMC name for correlated markets disagreeing at a swing: Dow's confirmation principle.",
    body: [
      "SMT divergence compares two related markets at a swing: one makes a new high, the other doesn't. Dow applied the same check to the Industrials and the Transports.",
      "As a timing signal it has no published support: grade D. Correlations also shift, so a \"divergence\" may only mean the two markets stopped moving together.",
    ],
    example: "Index A makes a new high at 5,120 while index B stops 0.4% under its prior high. SMT reads a reversal; Dow would call it an unconfirmed high. Neither is a tested signal.",
    related: ["dow-theory", "divergence", "correlation-and-concentration"],
    missions: [],
    lessons: ["3.5.5"],
  },
  {
    id: "testable-reformulation",
    name: "Testable reformulation",
    category: "decision_making",
    summary: "Rewriting a narrative claim as a rule, an event, an outcome, a horizon and a baseline.",
    body: [
      "\"They swept the lows, now we go up\" can't be tested as said. Rewritten as an exact event, an outcome over a fixed horizon and a baseline, it can: run it on a random walk, on a market with the mechanism, and after costs.",
      "Freeze the parameters before the out-of-sample run, report the sample size and noise band, and write in advance the result that would change your mind. On small samples the best of many variants is mostly luck: one rule won 65.1% of 43 trades in-sample and 49.1% of 395 out of sample.",
    ],
    example: "H1: after a trade 1 tick above the prior-day high and a close back under it in the same candle, the next 10 candles are lower more often than after a random candle. Result: 46.7% to 49.1% across three simulated markets, against about 50%.",
    related: ["base-rates", "sample-size", "after-cost-evaluation", "evidence-grades"],
    missions: [],
    lessons: ["3.5.3", "3.5.6"],
  },
];

/** Unit 3.5 · Smart money concepts, decoded (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_3_5: UnitContent = {
  intro: {
    summary: "You'll meet SMC and ICT words everywhere. This unit decodes them: for each term, the mechanical fact behind it, the classical idea it renames, and a claim you can test against R0. It comes after 3.1's liquidity evidence, 3.3's real order flow and 3.4's testing protocol, so every word meets data, not authority.",
    outcomes: [
      "Sort any trading claim into mechanics, statistical tendency or narrative, and check who earns from selling it.",
      "Map structure, liquidity, zone and time words to the Dow, stop-cluster, supply-demand and session ideas they rename.",
      "Show how labels like CHoCH or order block change with swing length, close rule and author.",
      "Separate what's documented, such as stop clustering and session volatility, from claims the evidence contradicts or can't test.",
      "Turn one SMC claim into frozen rules, test it out-of-sample, on R0 and after costs, then grade it.",
    ],
    buildsOn: "Stop clusters and sweeps (3.1.1–3.1.4), gaps and zones (3.1.5, 3.1.6), real order flow (3.3), the testing protocol (3.4.1), Fibonacci (3.4.2) and Wyckoff (3.4.5); also market structure (1.5), Dow theory (2.3.1) and FX sessions (2.9.2).",
  },
  lessons: [L351, L352, L353, L354, L355, L356],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
