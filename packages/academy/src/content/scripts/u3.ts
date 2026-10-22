import type { CandleData, ChartLayer, ChartSpec, Concept, GlossaryTerm, LessonScript } from "../../types";

/**
 * Unit U3 · Risk comes first (docs/learn/U3-risk-comes-first.md): L08, L10, L09, L11, L12, L16.
 * Every number is checked against the engine rules (commission 0.05% per fill, rounded up to the
 * cent; whole units, rounded down; no leverage, and the entry commission must fit in the account).
 */

const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

// ─── Shared chart data ─────────────────────────────────────────────────────

/**
 * L10: 14 one-hour candles. Range 48.40–49.80 on candles 1–9, lows on support at 48.45 (candle 3)
 * and 48.42 (candle 8); then a rise to a 50.00 close on candle 14. Lows of candles 10–14:
 * 49.45, 49.60, 49.38, 49.55, 49.62 (normal swings of about 0.40).
 */
const L10_CANDLES: CandleData[] = [
  k(49.7, 49.8, 49.38, 49.42),
  k(49.42, 49.5, 49.05, 49.1),
  k(49.1, 49.15, 48.45, 48.7),
  k(48.7, 49.1, 48.65, 49.05),
  k(49.05, 49.5, 49.0, 49.4),
  k(49.4, 49.55, 49.1, 49.15),
  k(49.15, 49.2, 48.8, 48.85),
  k(48.85, 48.9, 48.42, 48.8),
  k(48.8, 49.6, 48.75, 49.55),
  k(49.55, 49.9, 49.45, 49.8),
  k(49.8, 50.05, 49.6, 49.7),
  k(49.7, 49.85, 49.38, 49.75),
  k(49.75, 50.0, 49.55, 49.9),
  k(49.9, 50.1, 49.62, 50.0),
];

/** L11 B2: a short run up to the 100.00 entry. */
const L11_CANDLES: CandleData[] = [
  k(99.2, 99.45, 99.05, 99.4),
  k(99.4, 99.6, 99.25, 99.3),
  k(99.3, 99.55, 99.15, 99.5),
  k(99.5, 99.8, 99.4, 99.7),
  k(99.7, 99.85, 99.45, 99.55),
  k(99.55, 99.9, 99.5, 99.85),
  k(99.85, 100.1, 99.7, 99.8),
  k(99.8, 100.05, 99.65, 100.0),
];

/**
 * L16 B2: candles 1–10 calm (high–low ≈ 0.40, lows 49.70–49.85), candles 11–20 volatile
 * (high–low ≈ 1.20, lows below 49.40 only on volatile candles 4 and 8: 49.25 and 49.10).
 */
const L16_REGIMES: CandleData[] = [
  k(49.95, 50.15, 49.78, 50.05),
  k(50.05, 50.2, 49.8, 49.88),
  k(49.88, 50.12, 49.72, 50.08),
  k(50.08, 50.22, 49.84, 49.92),
  k(49.92, 50.15, 49.75, 50.1),
  k(50.1, 50.25, 49.85, 49.95),
  k(49.95, 50.18, 49.78, 50.12),
  k(50.12, 50.2, 49.8, 49.9),
  k(49.9, 50.14, 49.7, 50.02),
  k(50.02, 50.22, 49.82, 50.0),
  k(50.0, 50.75, 49.55, 50.4),
  k(50.4, 50.8, 49.6, 49.75),
  k(49.75, 50.65, 49.45, 50.2),
  k(50.2, 50.45, 49.25, 49.5),
  k(49.5, 50.65, 49.45, 50.45),
  k(50.45, 50.8, 49.6, 49.85),
  k(49.85, 50.7, 49.5, 50.25),
  k(50.25, 50.3, 49.1, 49.5),
  k(49.5, 50.6, 49.45, 50.3),
  k(50.3, 50.75, 49.55, 50.0),
];

/**
 * L16 B4: the previous candle (close 50.00), then the five candles of the exercise.
 * True ranges 0.50, 0.60, 0.50, 0.90 (gap down from 50.10), 0.50; ATR(5) = 0.60.
 */
const L16_ATR: CandleData[] = [
  k(49.8, 50.1, 49.7, 50.0),
  k(50.0, 50.3, 49.8, 50.2),
  k(50.2, 50.6, 50.0, 50.4),
  k(50.4, 50.5, 50.0, 50.1),
  k(49.3, 49.6, 49.2, 49.5),
  k(49.5, 49.9, 49.4, 49.8),
];

/** L16 B6: 12 candles between 49.70 and 50.40 (last close 50.10), then the gap candle under the veil. */
const L16_GAP: CandleData[] = [
  k(49.9, 50.1, 49.75, 50.05),
  k(50.05, 50.25, 49.95, 50.2),
  k(50.2, 50.4, 50.1, 50.3),
  k(50.3, 50.35, 50.0, 50.05),
  k(50.05, 50.15, 49.8, 49.85),
  k(49.85, 49.95, 49.7, 49.9),
  k(49.9, 50.2, 49.85, 50.15),
  k(50.15, 50.3, 50.05, 50.25),
  k(50.25, 50.35, 50.0, 50.05),
  k(50.05, 50.1, 49.8, 49.95),
  k(49.95, 50.2, 49.9, 50.15),
  k(50.15, 50.25, 50.0, 50.1),
  k(47.6, 47.9, 47.3, 47.7),
];

// ─── Widget context the task contract doesn't carry ────────────────────────

/** L10 Try (position-size, units "auto"): the price ruler's context level, card and fixed comparison row. */
export const L10_TRY_RULER = {
  layers: [{ kind: "level", price: 48.4, role: "support", label: "Support 48.40" }] as ChartLayer[],
  card: "Normal candle ≈ 0.40",
  compare: "Start, stop 49.50: 181 units · loss 99.51",
};

/** L16 Try (position-size, units "learner"): the price ruler's context level, card and fixed comparison row. */
export const L16_TRY_RULER = {
  layers: [{ kind: "level", price: 48.4, role: "support", label: "Pullback low 48.40" }] as ChartLayer[],
  card: "ATR (14) 1.60",
  compare: "Calm, stop 49.40: 153 units · 7,650.00",
};

/** L10 hook and B3: the support range and the rise to the 50.00 entry. */
export const L10_CHART: ChartSpec = {
  candles: L10_CANDLES,
  layers: [{ kind: "level", price: 50.0, role: "entry", label: "Entry 50.00" }],
  describe: "Fourteen one-hour candles. Price ranges between 48.40 and 49.80, bouncing from 48.45 and 48.42, then rises to close at 50.00.",
};

// ─── Lessons ───────────────────────────────────────────────────────────────

const L08: LessonScript = {
  unit: "1.4",
  courseId: "1.4.1",
  hook: {
    prompt: "Your account falls 50%, from 10,000.00 to 5,000.00. What gain do you need to get back to 10,000.00?",
    control: { kind: "slider", min: 10, max: 200, step: 10, unit: "%", start: 10, answer: 100, tolerance: 0 },
    compare: "You guessed +{yours}%. From 5,000.00, getting back to 10,000.00 takes +100%: the gain is earned on half the account.",
    concept: "drawdown",
  },
  learn: [
    {
      kind: "explain",
      text: "Every trade can lose. [[risk-per-trade|Risk per trade]] is the amount you accept losing if price reaches your [[stop-loss]], decided before you enter and including costs such as [[spread|the spread]] and [[commission]]. It is not the value of the position. It is the slice of the account on the line if you are wrong. Traders call it [[r|1R]].",
    },
    {
      kind: "predict",
      title: "Risk or position value?",
      prompt: "You buy 40 units of LABX at 50.00 with a stop at 48.50. Which number is your risk on this trade?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "2,000.00", feedback: "That's the position value, 40 × 50.00. At the stop you lose 40 × 1.50 = 60.00, plus costs." },
          { id: "b", label: "60.00, plus costs", feedback: "Right." },
          { id: "c", label: "48.50", feedback: "48.50 is the stop price, not an amount of money. The loss is 40 units × 1.50 per unit." },
          { id: "d", label: "1.50", feedback: "1.50 is the loss per unit. You hold 40 units, so 40 × 1.50 = 60.00, plus costs." },
        ],
        answer: "b",
      },
      reveal: "40 × 1.50 = 60.00 before costs, 61.97 with both commissions. The 2,000.00 is the [[notional-value|position value]]: what you hold, not what you lose at the stop.",
      concept: "risk-per-trade",
    },
    {
      kind: "explain",
      text: "Most risk rules are written as a percentage of the account. Missions allow 1% per trade and the Arena 2%. On a 10,000.00 vUSD account, 1% is 100.00. The **Risk Discipline** score checks that every entry has a stop and that the planned loss stays within the limit.",
      figure: {
        kind: "formula",
        boxes: [{ text: "10,000.00 account" }, { text: "1% limit" }, { text: "100.00 budget" }],
        operators: ["×", "="],
        steps: ["Start from the account: 10,000.00.", "Missions: × 1% = 100.00. That is your 1R.", "Arena: × 2% = 200.00, the most you may risk there."],
      },
    },
    {
      kind: "worked",
      title: "Turning a percentage into vUSD",
      lines: [
        "Account: 10,000.00 vUSD. Risk limit: 1%.",
        "Budget: 10,000.00 × 1% = 100.00 vUSD.",
        "After a few losses the account is 9,500.00 vUSD.",
        "New budget: 9,500.00 × 1% = ?",
      ],
      ask: {
        answer: 95,
        tolerance: 0.01,
        unit: "vUSD",
        feedback: [{ value: 100, text: "That's 1% of the starting account. The limit follows what the account is worth now: 9,500.00 × 1%." }],
        correct: "Right. 1% of the current [[equity|account value]] is 95.00. A smaller account risks less, automatically.",
      },
      after: "Because the rule is a percentage, the budget shrinks after losses and grows after gains, with no extra decision.",
      concept: "fixed-fractional-sizing",
    },
    {
      kind: "order",
      title: "Before any trade",
      prompt: "Put these four steps in the order you take them, before any trade.",
      items: [
        "Write down your limit as a percentage: 1% in missions, at most 2% in the Arena.",
        "Convert it to vUSD using the current account value.",
        "Find the [[invalidation]] price, where the idea is wrong. The stop goes there.",
        "[[position-size|Size the position]] so a stop-out, costs included, fits the budget.",
      ],
      explain: "Right. Risk first, then the stop, then the size. If even a small position breaks the limit, there is no trade. The next lesson covers the stop; the one after, the size.",
      concept: "risk-per-trade",
    },
    {
      kind: "figure",
      figure: {
        kind: "bars",
        bars: [
          { label: "Drawdown", value: -10, role: "down" },
          { label: "Gain to recover", value: 11.1, role: "up" },
          { label: "Drawdown", value: -20, role: "down" },
          { label: "Gain to recover", value: 25, role: "up" },
          { label: "Drawdown", value: -50, role: "down" },
          { label: "Gain to recover", value: 100, role: "up" },
        ],
        unit: "%",
        steps: [
          "A [[drawdown]] is a fall from the account's peak. −10% leaves 9,000.00; getting back needs +11.1%.",
          "−20% needs +25%. The gain is earned on a smaller account.",
          "−50% needs +100%. Keep each loss small and a losing run stays shallow.",
        ],
      },
      concept: "drawdown",
    },
    {
      kind: "predict",
      title: "Ten losses in a row",
      prompt: "Ten losing trades in a row, each risking 5% of the current account. Roughly what is left of 10,000.00?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "About 5,000.00", feedback: "Each loss is 5% of what is left, not of 10,000.00, so ten of them take 40.1%. Still a deep hole." },
          { id: "b", label: "About 6,000.00" },
          { id: "c", label: "About 9,000.00", feedback: "That is close to the 1% case. At 5% per trade, ten losses take about 40% of the account." },
        ],
        answer: "b",
      },
      reveal:
        "At 5% per trade: 10,000.00 → 5,987.37 (−40.1%). To recover: about +67.0%.\nAt 1% per trade: 10,000.00 → 9,043.82 (−9.6%). To recover: about +10.6%.\nThe same run of losses is a setback at 1% and a serious hole at 5%.",
      concept: "drawdown",
    },
  ],
  task: {
    widget: "loss-recovery",
    goal: "Find the deepest drawdown you could still recover from with a gain of 25% or less.",
    start: { drawdown: 5 },
    success: { field: "drawdown", eq: 20 },
    feedback: [
      { when: { field: "gainNeeded", lt: 25 }, text: "That works, but you can go deeper and still need +25% or less." },
      { when: { field: "gainNeeded", gt: 25 }, text: "At that depth the gain needed is over +25%. Step back a little." },
    ],
    correct: "Right. −20% needs +25.0%; −21% would need +26.6%. At 1% per trade, it takes 23 losses in a row to fall that far.",
    hints: [
      "Increase the drawdown until the gain needed passes +25%, then step back.",
      "Gain needed = loss ÷ what is left. You want that ratio to be 0.25.",
      "At −20%, 80% is left: 20 ÷ 80 = 0.25, exactly +25%.",
    ],
    showMe: { drawdown: 20 },
    concept: "drawdown",
  },
  check: ["q-rm-1", "q-rm-3", "q-rm-11"],
  recap: {
    takeaways: [
      "Decide your maximum loss before you enter. That amount, costs included, is 1R.",
      "Set it as a percentage of the current account: 1% of 9,500.00 is 95.00.",
      "Losses compound: −50% needs +100%. Small, fixed risk keeps a losing run recoverable.",
    ],
  },
};

const L10: LessonScript = {
  unit: "1.4",
  courseId: "1.4.3",
  hook: {
    prompt: "You bought LABX at 50.00 because support at 48.40 held. A normal candle moves about 0.40. Tap where your stop belongs.",
    control: {
      kind: "tap",
      chart: { ...L10_CHART, range: [44.8, 50.4] },
      zones: [
        { id: "s4950", label: "49.50", price: 49.5, feedback: "That stop sits inside the normal swings. Noise alone can reach it." },
        { id: "s4840", label: "48.40", price: 48.4, feedback: "Obvious levels get tested briefly, so a stop exactly on the level is easily hit." },
        { id: "s4800", label: "48.00", price: 48.0, feedback: "One normal candle beyond support: it is hit only if support breaks." },
        { id: "s4500", label: "45.00", price: 45.0, feedback: "That protects you, but it's further than the idea needs. One normal candle below 48.40 is enough." },
      ],
      answer: "s4800",
    },
    compare: "You picked {yours}. The idea fails below support at 48.40, so the stop belongs just beyond it: about 48.00.",
    concept: "invalidation-level",
  },
  learn: [
    {
      kind: "explain",
      text: "You met the [[stop-loss]] order in Unit 1. Its job is not to prevent every loss. It gets you out when the reason for the trade no longer holds, at a cost you accepted before you entered. It is not a guaranteed price: once touched it becomes a [[market-order|market order]], and a [[gap]] through it fills at the open.",
    },
    {
      kind: "explain",
      text: "Ask what price would have to do to prove the idea wrong. That is the [[invalidation]] point. If you bought because [[support]] held, the idea is wrong once price breaks clearly through it. The stop goes just beyond that point, with a small buffer for noise, not at a round number or at a loss that feels comfortable.",
    },
    {
      kind: "figure",
      figure: {
        kind: "chart",
        chart: L10_CHART,
        steps: [
          {
            text: "Support: price turned up from 48.40 twice.",
            layers: [
              { kind: "level", price: 48.4, role: "support", label: "Support 48.40" },
              { kind: "marker", index: 2, at: "low", role: "neutral" },
              { kind: "marker", index: 7, at: "low", role: "neutral" },
            ],
          },
          {
            text: "A stop at 49.50 sits inside the normal swings. Noise alone can reach it.",
            layers: [
              { kind: "zone", from: 49.38, to: 50.0, role: "concept", label: "normal swings" },
              { kind: "level", price: 49.5, role: "stop", label: "too tight" },
            ],
          },
          {
            text: "At 48.00, one normal candle beyond support, it is hit only if support breaks.",
            layers: [
              { kind: "level", price: 48.0, role: "stop", label: "beyond the level" },
              { kind: "bracket", from: 48.0, to: 48.4, index: 13, label: "buffer 0.40", role: "concept" },
            ],
          },
        ],
      },
      concept: "invalidation-level",
    },
    {
      kind: "match",
      title: "Four ways to misplace a stop",
      prompt: "Match each stop to what goes wrong with it.",
      pairs: [
        { left: "Too tight", right: "Inside the normal back-and-forth, so noise stops out a sound idea." },
        { left: "Arbitrary", right: "Set by a round number or a fixed amount, not by the chart." },
        { left: "Exactly on the level", right: "Obvious levels get tested briefly, so it is easily hit." },
        { left: "Missing", right: "No stop at all, so the possible loss has no limit." },
      ],
      columns: ["Stop", "What goes wrong"],
      concept: "stop-loss-order",
    },
    {
      kind: "explain",
      text: "A stop placed by logic will sometimes be far from the entry. That's fine. Don't move the stop to suit the size you wanted; change the size to suit the stop. A wider stop means fewer [[unit|units]] for the same [[risk-per-trade|risk]] in vUSD. The next lesson shows how to calculate it. For now, watch what happens.",
    },
    {
      kind: "predict",
      title: "Same risk, two stops",
      prompt: "Stop A at 49.50 is 0.50 below the 50.00 entry. Stop B at 48.00 is 2.00 below. Both risk about 100.00. How many units does B allow?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Four times as many as A", feedback: "Each unit of B can lose four times as much, so fewer units fit in the same 100.00." },
          { id: "b", label: "The same as A", feedback: "Keeping A's 181 units with B's stop would lose 362.00 plus costs, not 100.00." },
          { id: "c", label: "About a quarter of A" },
          { id: "d", label: "None: B is too risky", feedback: "Risk is size times distance, not distance alone. Sized to fit, B risks the same 100.00." },
        ],
        answer: "c",
      },
      figure: {
        kind: "bars",
        bars: [
          { label: "Stop A, 49.50: units", value: 181, role: "accent" },
          { label: "Stop B, 48.00: units", value: 48, role: "accent" },
          { label: "Stop A: loss at the stop", value: -99.51, role: "down" },
          { label: "Stop B: loss at the stop", value: -98.36, role: "down" },
        ],
      },
      reveal: "A allows 181 units, B 48, after commissions. Both lose under 100.00 at the stop: 99.51 and 98.36. B just gives the idea room to be right.",
      concept: "position-sizing",
    },
    {
      kind: "callout",
      tone: "warning",
      text: "Never widen a stop once a trade is open. Moving it further away raises the risk you agreed to, and MARKET//LAB counts it against your Risk Discipline. If the stop is hit, either the idea was wrong or the noise was bigger than planned. Both are lessons for the next plan.",
    },
  ],
  task: {
    widget: "position-size",
    data: { ruler: L10_TRY_RULER },
    goal: "Support is at 48.40 and a normal candle moves about 0.40. Move the stop to where the idea fails, plus a buffer, and watch what happens to the size.",
    start: { account: 10000, riskPct: 1, entry: 50, stop: 49.5 },
    locked: ["account", "riskPct", "entry"],
    hidden: ["simpleQty"],
    success: {
      all: [
        { field: "stop", gte: 48 },
        { field: "stop", lte: 48.3 },
        { field: "account", eq: 10000 },
        { field: "riskPct", eq: 1 },
        { field: "entry", eq: 50 },
      ],
    },
    feedback: [
      { when: { field: "stop", gte: 48.4 }, text: "That stop is still above support, inside the noise. Price can reach it while the idea still holds." },
      { when: { field: "stop", gt: 48.3 }, text: "Just under the level is where brief tests reach. Leave more of a buffer." },
      { when: { field: "stop", lt: 48 }, text: "That protects you, but it's further than the idea needs. One normal candle below 48.40 is enough." },
    ],
    correct: "Done. The stop now sits beyond support. The size fell sharply from 181 units, yet the loss if stopped is still under 100.00.",
    hints: [
      "Go lower. The idea fails below 48.40, so the stop belongs under it.",
      "Leave a buffer of up to one normal candle, 0.40, below support.",
      "48.40 − 0.40 = 48.00. Any stop from 48.00 to 48.30 works.",
    ],
    showMe: { stop: 48 },
    concept: "invalidation-level",
  },
  check: ["q-sl-1", "q-sl-4", "q-sl-3"],
  recap: {
    takeaways: [
      "Put the stop where the idea is proven wrong, plus a small buffer, not where the loss feels small.",
      "A stop inside normal noise gets hit while the idea still holds. Go beyond the level.",
      "Keep the stop where it belongs and change the size: a wider stop means fewer units.",
    ],
  },
};

const L09: LessonScript = {
  unit: "1.4",
  courseId: "1.4.4",
  hook: {
    prompt: "Your account is 10,000.00 and you accept losing 1% on this trade. You buy LABX at 100.00 with the stop at 98.00. How many units do you buy?",
    control: { kind: "slider", min: 1, max: 200, step: 1, unit: "units", start: 1, answer: 50, tolerance: 0 },
    compare: "You guessed {yours} units. The rule gives 50: 100.00 ÷ 2.00. With commission on both fills, 47.",
    concept: "position-sizing",
  },
  learn: [
    {
      kind: "explain",
      text: "Many beginners pick a size first, say a round 100 [[unit|units]], then place the stop wherever the loss feels bearable. That is backwards. In the last lesson the stop went where the idea is proven wrong. Now the [[position-size|size]] is what you adjust, so that being wrong costs a fixed, small share of the account.",
    },
    {
      kind: "figure",
      figure: {
        kind: "formula",
        boxes: [{ text: "100.00 risk budget" }, { text: "2.00 distance to stop" }, { text: "50 units", answer: 50, tolerance: 0, unit: "units" }],
        operators: ["÷", "="],
        steps: [
          "Risk budget: 1% of 10,000.00 = 100.00.",
          "Distance to the stop: 100.00 − 98.00 = 2.00 per unit.",
          "Divide the budget by the distance and round down to whole units. Type the result.",
          "50 units × 100.00 = 5,000.00 of LABX. At the stop it loses 100.00, before costs.",
        ],
      },
      concept: "position-sizing",
    },
    {
      kind: "explain",
      text: "The textbook formula ignores costs. In MARKET//LAB you pay 0.05% [[commission]] on entry and again on exit, so each unit can lose a little more than the distance to the stop. The spread is already counted, because you buy at the [[ask]]. Add the commission per unit to the distance, then divide again.",
    },
    {
      kind: "worked",
      title: "Cost-adjusted size",
      lines: [
        "Commission per unit at entry: 0.05% × 100.00 = 0.05.",
        "At the stop: 0.05% × 98.00 = 0.049.",
        "Loss per unit: 2.00 + 0.05 + 0.049 = 2.099.",
        "Units: 100.00 ÷ 2.099 ≈ 47.64, rounded down: ?",
      ],
      ask: {
        answer: 47,
        tolerance: 0,
        unit: "units",
        feedback: [
          { value: 48, text: "That rounds to the nearest. 48 units lose 100.76 at the stop, over the 100.00 budget. Round down." },
          { value: 50, text: "50 ignores the costs. Divide by 2.099, not 2.00." },
        ],
        correct: "Right. 47 units fit; a 48th would go over by 0.76.",
      },
      after: "Check, fees rounded up per fill: 47 units lose 94.00 + 2.35 + 2.31 = 98.66. 48 would lose 100.76.\n47, not 50: the costs take three units.",
      concept: "cost-adjusted-sizing",
    },
    {
      kind: "predict",
      title: "A wider stop",
      prompt: "Same entry, 100.00, but the stop that proves you wrong is at 96.00. The budget is still 100.00. How many units, before costs?",
      control: {
        kind: "numeric",
        unit: "units",
        answer: 25,
        tolerance: 0,
        feedback: [
          { value: 50, text: "Keeping 50 units with a 4.00 stop would lose 200.00, double the budget." },
          { value: 100, text: "Twice the distance doesn't double the units: it halves them." },
        ],
      },
      reveal: "100.00 ÷ 4.00 = 25 units, 24 after costs. Twice the distance, half the units. The loss at the stop stays within budget: 98.36 with 24 units. A wider stop means fewer units, not more risk.",
      concept: "position-sizing",
    },
    {
      kind: "explain",
      text: "Two more limits. A bigger budget buys more units for the same stop: the Arena allows 2%, 200.00, so a 4.00 stop gives 50 units before costs. And [[buying-power|buying power]] sets a ceiling: with no [[leverage]], [[notional-value|position value]] plus the entry fee can't exceed [[equity]]. At 100.00 you can hold at most 99 units, whatever the formula says.",
    },
    {
      kind: "callout",
      tone: "key",
      text: "Stop first, size second. If the size feels too small, don't pull the stop closer to fit more units: a stop inside the noise is easily hit. Accept the smaller size, or skip the trade.",
    },
  ],
  task: {
    widget: "position-size",
    goal: "Arena rules: risk 2% of 10,000.00. You buy at 100.00 with the stop at 96.00. Enter the most units whose loss at the stop, commissions included, stays within budget.",
    start: { account: 10000, riskPct: 2, entry: 100, stop: 96, units: 0 },
    locked: ["account", "riskPct", "entry", "stop"],
    hidden: ["simpleQty", "qty"],
    success: { field: "units", eq: 48 },
    feedback: [
      { when: { field: "units", eq: 50 }, text: "50 is the textbook size. With both commissions it would lose 204.90, over the 200.00 budget." },
      { when: { field: "units", eq: 49 }, text: "Close. 49 units lose 200.81 at the stop, 0.81 over. Round down." },
      { when: { field: "units", lt: 48 }, text: "That fits the budget, but one more unit still would. Find the largest size that stays within 200.00." },
      { when: { field: "units", gt: 50 }, text: "That size loses well over 200.00 at the stop. Start from the budget and the distance." },
    ],
    correct: "Right. 48 units lose 196.71 at the stop, costs included. A 49th would take it to 200.81, just over the limit.",
    hints: [
      "Start from the budget: 2% of 10,000.00 is 200.00, and the stop is 4.00 away.",
      "Units = budget ÷ (distance + commission per unit), rounded down.",
      "Commission per unit: 0.05 at entry plus 0.048 at the stop. 200.00 ÷ 4.098 ≈ 48.8.",
    ],
    showMe: { units: 48 },
    concept: "cost-adjusted-sizing",
  },
  check: ["q-ps-6", "q-ps-3", "q-ps-5"],
  recap: {
    takeaways: [
      "Units = risk budget ÷ distance to the stop, rounded down to a whole number.",
      "Add both commissions to the distance per unit: 100.00 ÷ 2.099 gives 47 units, not 50.",
      "A wider stop means fewer units, not more risk: the loss at the stop stays within budget.",
    ],
  },
};

const L11: LessonScript = {
  unit: "1.4",
  courseId: "1.4.5",
  hook: {
    prompt: "Two methods, 100 trades each. Losses are always −1R. Method A wins 70% of trades at +0.4R. Method B wins 40% at +2R. Which has the better average result?",
    control: {
      kind: "choice",
      choices: [
        { id: "a", label: "Method A" },
        { id: "b", label: "Method B" },
        { id: "c", label: "They come out even" },
      ],
      answer: "b",
    },
    compare: "You picked {yours}. Method B, winning 40% at +2R, made +20R over 100 trades. Method A, winning 70% at +0.4R, lost 2R.",
    concept: "expectancy",
  },
  learn: [
    {
      kind: "explain",
      text: "Measuring results in [[r|R]] makes trades comparable. R is the amount you risked: the distance to the stop times the units, plus costs, which is exactly what you sized in the last lesson. Risk 100.00 and make 200.00, and the result is [[r-multiple|+2R]]. A loss at the stop is −1R, whatever the position size.",
    },
    {
      kind: "figure",
      figure: {
        kind: "chart",
        chart: { candles: L11_CANDLES, range: [97.5, 104.5] },
        steps: [
          {
            text: "Entry 100.00, stop 98.00. The 2.00 between them is your risk: 1R.",
            layers: [
              { kind: "level", price: 100.0, role: "entry", label: "Entry 100.00" },
              { kind: "level", price: 98.0, role: "stop", label: "Stop 98.00" },
              { kind: "bracket", from: 98.0, to: 100.0, index: 7, label: "Risk 1R", role: "down" },
            ],
          },
          {
            text: "[[take-profit|Target]] 104.00, 4.00 away. The reward is 2R.",
            layers: [
              { kind: "level", price: 104.0, role: "target", label: "Target 104.00" },
              { kind: "bracket", from: 100.0, to: 104.0, index: 7, label: "Reward 2R", role: "up" },
            ],
          },
          { text: "The [[reward-to-risk|reward-to-risk ratio]] compares the two distances: 4.00 ÷ 2.00 = 2:1." },
          { text: "Break-even: 2 ÷ (2 + 4) ≈ 33%. Drag the target: 1:1 needs 50%, 3:1 only 25%." },
        ],
      },
      concept: "reward-to-risk",
    },
    {
      kind: "worked",
      title: "From prices to a ratio",
      lines: [
        "Entry 50.00, stop 49.00, target 52.00.",
        "Risk per unit: 50.00 − 49.00 = 1.00. Reward per unit: 52.00 − 50.00 = 2.00.",
        "Reward-to-risk: 2.00 ÷ 1.00 = 2:1.",
        "Break-even [[win-rate|win rate]]: 1.00 ÷ (1.00 + 2.00) = ?",
      ],
      ask: {
        answer: 33.3,
        tolerance: 0.1,
        unit: "%",
        feedback: [
          { value: 50, text: "50% is 1.00 ÷ 2.00, risk over reward. Divide the risk by risk plus reward: 1.00 ÷ 3.00." },
          { value: 66.7, text: "That is the loss rate at break-even. The win rate is 1.00 ÷ 3.00." },
        ],
        correct: "Right. 1.00 ÷ 3.00 = 33.3%. Win less often than that and the trade loses on average, before costs.",
      },
      after: "At 2:1 the trade must work more than one time in three just to break even, before costs.",
      concept: "reward-to-risk",
    },
    {
      kind: "explain",
      text: "A higher ratio lowers the break-even rate, but a distant target that price rarely reaches is no better than a closer one it often reaches. [[expectancy|Expectancy]] puts both sides together: the average result per trade, in R. Positive means the method made money on average over a sample; negative means it lost, however good some trades felt.",
      figure: {
        kind: "formula",
        boxes: [{ text: "0.40 × 2R" }, { text: "0.60 × 1R" }, { text: "+0.20R" }],
        operators: ["−", "="],
        steps: [
          "Wins: win rate × average win. 0.40 × 2R = 0.80R.",
          "Losses: loss rate × average loss. 0.60 × 1R = 0.60R.",
          "Expectancy: 0.80R − 0.60R = +0.20R per trade.",
        ],
      },
    },
    {
      kind: "worked",
      title: "Three methods, before costs",
      lines: [
        "A: wins 40% at +2R, so 0.40 × 2 − 0.60 × 1 = +0.20R. Per 100 trades: +20R.",
        "B: wins 60% at +0.8R, so 0.60 × 0.8 − 0.40 × 1 = +0.08R. Per 100 trades: +8R.",
        "C: wins 70% at +0.4R, so 0.70 × 0.4 − 0.30 × 1 = ?",
      ],
      ask: {
        answer: -0.02,
        tolerance: 0.005,
        unit: "R",
        feedback: [
          { value: 0.02, text: "Check the sign: 0.28 − 0.30 is below zero." },
          { value: 0.28, text: "That is only the wins. Subtract the losses: 0.30 × 1R." },
        ],
        correct: "Right. 0.28 − 0.30 = −0.02R, despite winning 7 trades in 10.",
      },
      after: "C loses 2R per 100 trades. The method that wins most often is the only one that loses.",
      concept: "expectancy",
    },
    {
      kind: "task",
      task: {
        widget: "expectancy",
        goal: "Average win 2R, average loss 1R. Lower the win rate until expectancy turns negative.",
        start: { winRate: 45, avgWin: 2, avgLoss: 1 },
        locked: ["avgWin", "avgLoss"],
        success: { field: "winRate", eq: 33 },
        feedback: [
          { when: { field: "expectancy", gte: 0 }, text: "Expectancy is still above zero. Keep lowering the win rate." },
          { when: { field: "winRate", lt: 33 }, text: "Expectancy is negative there, but it turned negative sooner. Raise the win rate to where the sign first flips." },
        ],
        correct: "Right. +0.02R at 34%, −0.01R at 33%. Break-even sits at 33.3%, the same rate a 2:1 trade needs.",
        hints: ["Each point of win rate moves expectancy by 0.03R here. Watch for the sign to flip."],
        showMe: { winRate: 33 },
        concept: "expectancy",
      },
    },
    {
      kind: "callout",
      tone: "key",
      text: "Judge a method by its expectancy over many trades, in R, and judge each trade by whether it followed the plan. A single result, good or bad, proves almost nothing on its own. The bigger the sample, the more the figure means.",
    },
  ],
  task: {
    widget: "risk-reward",
    goal: "You buy at 50.00 with the stop at 49.40. Set the nearest target that gives at least 2R.",
    start: { entry: 50, stop: 49.4, target: 50.6 },
    locked: ["entry", "stop"],
    success: { field: "target", eq: 51.2 },
    feedback: [
      { when: { field: "rr", lt: 2 }, text: "The reward is still under twice the risk. Move the target a little higher." },
      { when: { field: "rr", gt: 2 }, text: "That clears 2R, but it isn't the nearest target. A closer one is more likely to be reached." },
    ],
    correct: "Right. 51.20 is 1.20 away, twice the 0.60 risk. You'd need to win a third of the time to break even, before costs.",
    hints: [
      "Move the target up until the ratio reads 2.00 : 1.",
      "2R means the reward per unit is twice the risk per unit.",
      "Risk is 50.00 − 49.40 = 0.60, so the reward must be 1.20.",
    ],
    showMe: { target: 51.2 },
    concept: "reward-to-risk",
  },
  check: ["q-rm-4", "q-rm-5", "q-rm-7"],
  recap: {
    takeaways: [
      "Reward-to-risk compares the target distance with the stop distance. Break-even = risk ÷ (risk + reward).",
      "Expectancy = win rate × average win − loss rate × average loss, measured in R.",
      "Judge a method over many trades, and each trade by the plan, never by one result.",
    ],
  },
};

const L12: LessonScript = {
  unit: "1.4",
  courseId: "1.4.7",
  hook: {
    prompt: "Your account is 10,000.00. With leverage you hold 40,000.00 of LABX. Price falls 5%. What share of your account is gone?",
    control: { kind: "slider", min: 0, max: 100, step: 5, unit: "%", start: 0, answer: 20, tolerance: 0 },
    compare: "You guessed {yours}%. A 5% fall on 40,000.00 costs 2,000.00: 20% of the account.",
    concept: "leverage",
  },
  learn: [
    {
      kind: "explain",
      text: "[[exposure|Exposure]] is the total value of the positions you hold. As a share of your [[equity]], it shows how much of the account rides on price. Hold 5,000.00 of LABX in a 10,000.00 account and your exposure is 50%. A 10% fall then costs 500.00, or 5% of the account.",
      figure: {
        kind: "formula",
        boxes: [{ text: "50% exposure" }, { text: "10% fall" }, { text: "5% of the account" }],
        operators: ["×", "="],
        steps: [
          "Exposure: 5,000.00 ÷ 10,000.00 × 100 = 50%.",
          "A 10% fall acts on the position: 10% × 5,000.00 = 500.00.",
          "Effect on the account: 500.00 ÷ 10,000.00 = 5%.",
        ],
      },
    },
    {
      kind: "worked",
      title: "Exposure behind a position",
      lines: [
        "You hold 60 LABX at 100.00 in a 10,000.00 account.",
        "[[notional-value|Position value]]: 60 × 100.00 = 6,000.00. Exposure: 60%.",
        "A 5% [[gap]] down costs 5% × 6,000.00 = 300.00.",
        "Effect on the account: 300.00 ÷ 10,000.00 = ?",
      ],
      ask: {
        answer: 3,
        tolerance: 0.01,
        unit: "%",
        feedback: [
          { value: 5, text: "5% is the move in price. The account loses 5% of the position, 300.00, which is 3% of 10,000.00." },
          { value: 60, text: "60% is the exposure. Divide the loss, 300.00, by the account." },
        ],
        correct: "Right. 300.00 is 3% of 10,000.00.",
      },
      after: "3% of the account: three times a 1% risk budget, whatever the [[stop-loss|stop]] said.",
      concept: "exposure",
    },
    {
      kind: "explain",
      text: "[[leverage|Leverage]] lets you hold a position worth more than your equity, with a broker lending the difference. At 2× a 10,000.00 account controls 20,000.00; at 5×, 50,000.00. Price moves the same either way. What changes is the size of that move against your account. Real brokers may close you out once losses use up your [[margin]].",
    },
    {
      kind: "figure",
      figure: {
        kind: "bars",
        bars: [
          { label: "Account", value: 10000, role: "neutral" },
          { label: "Position at 1×", value: 10000, role: "accent" },
          { label: "Position at 2×", value: 20000, role: "accent" },
          { label: "Position at 5×", value: 50000, role: "down" },
          { label: "5% fall at 1×", value: -500, role: "down" },
          { label: "5% fall at 2×", value: -1000, role: "down" },
          { label: "5% fall at 5×", value: -2500, role: "down" },
        ],
        steps: [
          "Account 10,000.00. Without leverage, the largest position is the same size: 1×.",
          "With leverage the position grows to 20,000.00 at 2× and 50,000.00 at 5×. The account does not.",
          "A 5% fall costs 500.00, 1,000.00 and 2,500.00: 5%, 10% and 25% of the account.",
        ],
      },
      concept: "leverage",
    },
    {
      kind: "predict",
      title: "When is the account gone?",
      prompt: "At 5×, how big a fall wipes out the whole 10,000.00 account?",
      control: { kind: "slider", min: 5, max: 100, step: 5, unit: "%", start: 5, answer: 20, tolerance: 0 },
      reveal: "20%. 20% × 50,000.00 = 10,000.00: the whole account. Without leverage, the same fall costs 2,000.00.",
      concept: "leverage",
    },
    {
      kind: "explain",
      text: "Your risk is what you lose if the stop fills as planned. Your exposure is what is at stake if it does not. 50 units at 100.00 with a stop 2.00 away risk 100.00, but their exposure is 5,000.00. If price gaps past the stop, the gap and the exposure set the loss. Positions that [[correlation|move together]] add up.",
    },
    {
      kind: "callout",
      tone: "warning",
      text: "Leverage does not make a trade better; it makes the same trade bigger. Using it to reach a target faster means losses arrive faster, in the same proportion. Missions and the Arena use none: position value can't exceed equity, so exposure tops out at 100%, and sizing from the stop keeps the planned loss at 1% or 2%.",
    },
  ],
  task: {
    widget: "exposure",
    goal: "You have 5× leverage available and hold 50,000.00 of LABX. Find the largest position where a 10% drop costs no more than 5% of your 10,000.00 account.",
    start: { account: 10000, leverage: 5, position: 50000, move: 10 },
    locked: ["account", "leverage", "move"],
    success: { field: "position", eq: 5000 },
    feedback: [
      { when: { field: "position", gt: 5000 }, text: "A 10% drop on that position costs more than 500.00. Go smaller." },
      { when: { field: "position", lt: 5000 }, text: "That stays within 5%, but a larger position would too. Find the largest that fits." },
    ],
    correct: "Right. 10% of 5,000.00 is 500.00, 5% of the account. Having 5× available didn't mean you had to use it.",
    hints: [
      "Shrink the position: the loss is the move times the position, not the account.",
      "A 10% drop may cost at most 5% of 10,000.00, which is 500.00.",
      "Position × 10% = 500.00, so the position is 500.00 ÷ 0.10.",
    ],
    showMe: { position: 5000 },
    concept: "exposure",
  },
  check: ["q-pe-1", "q-pe-3", "q-pe-6"],
  recap: {
    takeaways: [
      "Exposure % = position value ÷ equity × 100: how much of the account moves with price.",
      "Leverage scales every move against the account: at 5×, a 5% fall costs 25%.",
      "Risk is the planned loss at the stop. Exposure is what a gap acts on.",
    ],
  },
};

const L16: LessonScript = {
  unit: "2.4",
  courseId: "2.4.7",
  hook: {
    prompt: "Both trades buy LABX at 50.00. Calm week: 200 units, stop 0.50 below. Volatile week: 50 units, stop 2.00 below. Which loses more if its stop is hit?",
    control: {
      kind: "choice",
      choices: [
        { id: "a", label: "The calm-week trade" },
        { id: "b", label: "The volatile-week trade" },
        { id: "c", label: "About the same" },
      ],
      answer: "c",
    },
    compare: "You picked {yours}. Both lose 100.00 at the stop, before costs: 200 × 0.50 and 50 × 2.00. Only the exposure differs: 10,000.00 against 2,500.00.",
    concept: "position-sizing",
  },
  learn: [
    {
      kind: "explain",
      text: "[[volatility|Volatility]] is how far price typically moves in a given period. It changes over time: quiet phases alternate with busy ones. A [[stop-loss|stop]] distance that sits comfortably outside the noise in a calm market can sit right inside it in a volatile one, so neither a fixed stop distance nor a fixed size works in both.",
    },
    {
      kind: "figure",
      figure: {
        kind: "chart",
        chart: {
          candles: L16_REGIMES,
          layers: [
            { kind: "level", price: 50.0, role: "entry", label: "Entry 50.00" },
            { kind: "level", price: 49.4, role: "stop", label: "Stop 49.40" },
            { kind: "marker", index: 0, at: "high", label: "Calm", role: "neutral" },
            { kind: "marker", index: 10, at: "high", label: "Volatile", role: "neutral" },
          ],
          describe: "Twenty candles around 50.00. The first ten span about 0.40 each and stay above 49.70. The last ten span about 1.20; two of them dip below the 49.40 stop.",
        },
        steps: [
          {
            text: "Calm market: candles span about 0.40. A stop 0.60 below entry sits outside the noise.",
            layers: [{ kind: "bracket", from: 49.75, to: 50.15, index: 4, label: "≈ 0.40", role: "concept" }],
          },
          {
            text: "Volatile market: candles span about 1.20. The same stop sits inside the noise.",
            layers: [{ kind: "bracket", from: 49.45, to: 50.65, index: 12, label: "≈ 1.20", role: "concept" }],
          },
          {
            text: "Same distance, different meaning. The stop has to follow the noise.",
            layers: [
              { kind: "marker", index: 13, at: "low", label: "stop hit", role: "down" },
              { kind: "marker", index: 17, at: "low", label: "stop hit", role: "down" },
            ],
          },
        ],
      },
      concept: "volatility",
    },
    {
      kind: "explain",
      text: "A common yardstick is the [[atr|average true range (ATR)]]: the average size of recent candles, from high to low, counting any [[gap]] from the previous close. Put the stop beyond the [[invalidation]] level by a fraction of the ATR. This lesson uses half.",
    },
    {
      kind: "hotspot",
      title: "Which candle moved most?",
      prompt: "Tap the candle with the largest true range.",
      chart: {
        candles: L16_ATR,
        layers: [{ kind: "marker", index: 0, at: "close", label: "Previous close 50.00", role: "neutral" }],
        describe: "A previous candle closing at 50.00, then five candles. Candle 4 opens at 49.30, below candle 3's 50.10 close.",
      },
      zones: [
        { id: "c1", label: "Candle 1", index: 1, feedback: "That candle covers 0.50. One candle opened far from the previous close, and the gap counts too." },
        { id: "c2", label: "Candle 2", index: 2, feedback: "Candle 2 is the tallest, 0.60 from high to low. True range also counts gaps: look for a jump from the previous close." },
        { id: "c3", label: "Candle 3", index: 3, feedback: "That candle covers 0.50. One candle opened far from the previous close, and the gap counts too." },
        { id: "c4", label: "Candle 4", index: 4 },
        { id: "c5", label: "Candle 5", index: 5, feedback: "That candle covers 0.50. One candle opened far from the previous close, and the gap counts too." },
      ],
      answer: "c4",
      correct: "Right. Candle 4 is only 0.40 tall, but it gapped: from the previous close, 50.10, to its low, 49.20, is 0.90. These five average 0.60.",
      concept: "volatility",
    },
    {
      kind: "worked",
      title: "Calm versus volatile market",
      lines: [
        "Budget 100.00, entry 50.00, stop half an ATR under the [[pullback]] low.",
        "Calm, ATR 0.40, low 49.60: stop 49.40. 100.00 ÷ 0.60 → 166 units.",
        "Volatile, ATR 1.20, low 48.80: stop 48.20. 100.00 ÷ 1.80 = 55.56 → ?",
      ],
      ask: {
        answer: 55,
        tolerance: 0,
        unit: "units",
        feedback: [
          { value: 56, text: "That rounds up. 56 × 1.80 = 100.80, over the budget." },
          { value: 166, text: "That's the calm size. With a 1.80 stop, 166 units would lose 298.80." },
        ],
        correct: "Right. 55 units lose 99.00 at the stop, about the same as 166 units in the calm market.",
      },
      after:
        "Risk: 99.60 calm, 99.00 volatile. Value held: 8,300.00 against 2,750.00.\nAfter commissions: 153 and 54 units.\nSame risk, a third of the units. Only the [[exposure]] shrinks.",
      concept: "position-sizing",
    },
    {
      kind: "reveal",
      title: "When the stop is gapped",
      prompt: "You're long 55 units from 50.00, stop 48.20. An event is due. Where will the stop fill?",
      chart: {
        candles: L16_GAP,
        visible: 12,
        layers: [
          { kind: "level", price: 50.0, role: "entry", label: "Entry 50.00" },
          { kind: "level", price: 48.2, role: "stop", label: "Stop 48.20" },
        ],
      },
      choices: [
        { id: "a", label: "At 48.20, as planned", feedback: "The stop is a trigger, not a price guarantee. Nothing traded at 48.20, so it fills at the open." },
        { id: "b", label: "At the next candle's open" },
        { id: "c", label: "It won't fill", feedback: "It does fill. Once touched it becomes a market order, at the first price available." },
      ],
      answer: "b",
      after:
        "It opens at 47.60. The stop becomes a [[market-order|market order]] and fills there.\nLoss: 55 × (50.00 − 47.60) = 132.00, not the planned 99.00.\nIn R: 132.00 ÷ 99.00 = 1.33R.\nA gap can turn a 1R plan into more. Small risk per trade keeps it survivable.",
      concept: "gap-risk",
    },
    {
      kind: "callout",
      tone: "warning",
      text: "Don't keep your usual size and squeeze the stop to fit a volatile market: a stop inside the noise turns ordinary swings into losses. Change the size, not the logic of the stop. The limit doesn't change either: 2% in the high-volatility Arena is still 2%. If a sensible stop leaves too small a size, waiting is a valid decision.",
    },
  ],
  task: {
    widget: "position-size",
    data: { ruler: L16_TRY_RULER },
    goal: "Volatility is up: ATR 1.60, pullback low 48.40. Move the stop half an ATR below the low, then resize so the loss if stopped stays within 100.00.",
    start: { account: 10000, riskPct: 1, entry: 50, stop: 49.4, units: 153 },
    locked: ["account", "riskPct", "entry"],
    hidden: ["simpleQty", "qty"],
    success: { all: [{ field: "stop", eq: 47.6 }, { field: "units", eq: 40 }] },
    feedback: [
      {
        when: { all: [{ field: "stop", eq: 47.6 }, { field: "units", eq: 153 }] },
        text: "The stop is right, but 153 units would lose 374.68 there, almost four times the budget. Keep the stop; cut the units.",
      },
      {
        when: { all: [{ field: "stop", eq: 47.6 }, { field: "units", eq: 41 }] },
        text: "41 is the textbook size. With both commissions it loses 100.41, just over 100.00.",
      },
      { when: { field: "stop", ne: 47.6 }, text: "Check the stop: half of 1.60 is 0.80, below the 48.40 low." },
      { when: { field: "units", lt: 40 }, text: "That fits, but one more unit still would. Find the largest size within 100.00." },
      { when: { field: "units", gt: 41 }, text: "{units} units would lose {lossAtStop:2} at that stop, over the 100.00 budget. Keep the stop; cut the units." },
    ],
    correct: "Right. A 2.40 stop, 40 units, 97.96 at risk: the same budget as in the calm market. Your exposure fell from 7,650.00 to 2,000.00.",
    hints: [
      "Stop first: the pullback low minus half an ATR. Then change the units, not the stop.",
      "Units = budget ÷ (distance + commission per unit), rounded down.",
      "Stop 48.40 − 0.80 = 47.60, so 2.40 away. 100.00 ÷ 2.4488 ≈ 40.8.",
    ],
    showMe: { stop: 47.6, units: 40 },
    concept: "volatility",
  },
  check: ["q-rm-8", "q-rm-9", "q-rm-10"],
  recap: {
    takeaways: [
      "ATR measures normal movement: the average candle range, counting gaps from the previous close.",
      "When volatility rises, put the stop beyond the wider noise and cut the size to match.",
      "Keep the risk budget fixed in every market. The units and the exposure change, not the risk.",
    ],
  },
};

/** Interactive scripts for unit U3 lessons (docs/learn). Filled in from the lesson scripts. */
export const SCRIPTS_U3: Record<string, LessonScript> = { L08, L10, L09, L11, L12, L16 };
/** Glossary terms these lessons introduce that the glossary didn't have. */
export const TERMS_U3: GlossaryTerm[] = [];
/** Concepts these lessons introduce that the concept library didn't have. */
export const CONCEPTS_U3: Concept[] = [];
