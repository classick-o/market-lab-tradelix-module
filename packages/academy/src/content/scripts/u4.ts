import type { CandleData, ChartLayer, Concept, GlossaryTerm, LessonScript, TapZone } from "../../types";

// ─── Chart data (docs/learn/U4-plan-and-decide.md) ─────────────────────────

/** L14 hook: 20 LABX candles. Swing lows 45.90, 46.60, 47.40; swing highs 48.30, 49.60, 50.50; pullback to 48.20; last close 49.00. */
const L14_HOOK_CANDLES: CandleData[] = [
  { o: 47.2, h: 47.26, l: 46.75, c: 46.8 },
  { o: 46.8, h: 46.89, l: 45.9, c: 46.1 },
  { o: 46.1, h: 46.82, l: 46.02, c: 46.7 },
  { o: 46.7, h: 47.56, l: 46.65, c: 47.5 },
  { o: 47.5, h: 48.3, l: 47.4, c: 48.1 },
  { o: 48.1, h: 48.22, l: 47.22, c: 47.3 },
  { o: 47.3, h: 47.36, l: 46.6, c: 46.8 },
  { o: 46.8, h: 47.89, l: 46.7, c: 47.8 },
  { o: 47.8, h: 48.82, l: 47.72, c: 48.7 },
  { o: 48.7, h: 49.6, l: 48.65, c: 49.4 },
  { o: 49.4, h: 49.49, l: 48.3, c: 48.4 },
  { o: 48.4, h: 48.52, l: 47.4, c: 47.6 },
  { o: 47.6, h: 48.66, l: 47.55, c: 48.6 },
  { o: 48.6, h: 49.79, l: 48.5, c: 49.7 },
  { o: 49.7, h: 50.5, l: 49.62, c: 50.3 },
  { o: 50.3, h: 50.36, l: 49.55, c: 49.6 },
  { o: 49.6, h: 49.69, l: 48.8, c: 48.9 },
  { o: 48.9, h: 49.02, l: 48.2, c: 48.4 },
  { o: 48.4, h: 48.76, l: 48.35, c: 48.7 },
  { o: 48.7, h: 49.09, l: 48.6, c: 49.0 },
];

/** L14 B4: 22 LABX candles, another day. Swing lows 45.90 (c3), 46.60 (c8), 47.40 (c13); swing highs 48.30 (c6), 49.60 (c11), 51.50 (c17); pullback to 48.20 (c20); last close 49.00. */
const L14_PLAYBOOK_CANDLES: CandleData[] = [
  { o: 46.9, h: 46.96, l: 46.55, c: 46.6 },
  { o: 46.6, h: 46.69, l: 46.1, c: 46.2 },
  { o: 46.2, h: 46.32, l: 45.9, c: 46.05 },
  { o: 46.05, h: 46.86, l: 46.0, c: 46.8 },
  { o: 46.8, h: 47.69, l: 46.7, c: 47.6 },
  { o: 47.6, h: 48.3, l: 47.52, c: 48.15 },
  { o: 48.15, h: 48.21, l: 47.35, c: 47.4 },
  { o: 47.4, h: 47.49, l: 46.6, c: 46.75 },
  { o: 46.75, h: 47.82, l: 46.67, c: 47.7 },
  { o: 47.7, h: 48.86, l: 47.65, c: 48.8 },
  { o: 48.8, h: 49.6, l: 48.7, c: 49.45 },
  { o: 49.45, h: 49.57, l: 48.42, c: 48.5 },
  { o: 48.5, h: 48.56, l: 47.4, c: 47.55 },
  { o: 47.55, h: 48.69, l: 47.45, c: 48.6 },
  { o: 48.6, h: 49.82, l: 48.52, c: 49.7 },
  { o: 49.7, h: 50.86, l: 49.65, c: 50.8 },
  { o: 50.8, h: 51.5, l: 50.7, c: 51.3 },
  { o: 51.3, h: 51.42, l: 50.32, c: 50.4 },
  { o: 50.4, h: 50.46, l: 49.25, c: 49.3 },
  { o: 49.3, h: 49.39, l: 48.2, c: 48.35 },
  { o: 48.35, h: 48.82, l: 48.27, c: 48.7 },
  { o: 48.7, h: 49.06, l: 48.65, c: 49.0 },
];

/**
 * L15: 30 LABX candles, the first 24 visible. Range 59.00–60.50: resistance touched on c7, c15, c21,
 * support on c4, c12; last visible close 60.10. Hidden: c25 closes 60.62, c26 60.18, c27 59.80,
 * c28–c30 stay between 59.60 and 60.10 (a false breakout).
 */
const L15_CANDLES: CandleData[] = [
  { o: 59.6, h: 59.86, l: 59.55, c: 59.8 },
  { o: 59.8, h: 59.89, l: 59.4, c: 59.5 },
  { o: 59.5, h: 59.62, l: 59.22, c: 59.3 },
  { o: 59.3, h: 59.36, l: 59.0, c: 59.2 },
  { o: 59.2, h: 59.69, l: 59.1, c: 59.6 },
  { o: 59.6, h: 60.12, l: 59.52, c: 60.0 },
  { o: 60.0, h: 60.5, l: 59.95, c: 60.3 },
  { o: 60.3, h: 60.39, l: 59.85, c: 59.95 },
  { o: 59.95, h: 60.07, l: 59.62, c: 59.7 },
  { o: 59.7, h: 59.76, l: 59.4, c: 59.45 },
  { o: 59.45, h: 59.54, l: 59.2, c: 59.3 },
  { o: 59.3, h: 59.42, l: 59.0, c: 59.25 },
  { o: 59.25, h: 59.76, l: 59.2, c: 59.7 },
  { o: 59.7, h: 60.14, l: 59.6, c: 60.05 },
  { o: 60.05, h: 60.5, l: 59.97, c: 60.35 },
  { o: 60.35, h: 60.41, l: 59.95, c: 60.0 },
  { o: 60.0, h: 60.09, l: 59.6, c: 59.7 },
  { o: 59.7, h: 59.82, l: 59.52, c: 59.6 },
  { o: 59.6, h: 59.91, l: 59.55, c: 59.85 },
  { o: 59.85, h: 60.19, l: 59.75, c: 60.1 },
  { o: 60.1, h: 60.5, l: 60.02, c: 60.3 },
  { o: 60.3, h: 60.36, l: 59.85, c: 59.9 },
  { o: 59.9, h: 59.99, l: 59.65, c: 59.75 },
  { o: 59.75, h: 60.22, l: 59.67, c: 60.1 },
  { o: 60.1, h: 60.7, l: 60.04, c: 60.62 },
  { o: 60.62, h: 60.68, l: 60.1, c: 60.18 },
  { o: 60.18, h: 60.3, l: 59.7, c: 59.8 },
  { o: 59.8, h: 60.02, l: 59.72, c: 59.9 },
  { o: 59.9, h: 60.1, l: 59.82, c: 60.05 },
  { o: 60.05, h: 60.08, l: 59.78, c: 59.85 },
];

/** L17 B5: replay of the B4 trade. Entry at 50.00 on c8, dip to 48.10 on c13, exit at 52.40 on c24. */
const L17_REPLAY_CANDLES: CandleData[] = [
  { o: 48.9, h: 49.26, l: 48.85, c: 49.2 },
  { o: 49.2, h: 49.89, l: 49.1, c: 49.8 },
  { o: 49.8, h: 50.52, l: 49.72, c: 50.4 },
  { o: 50.4, h: 50.8, l: 50.35, c: 50.6 },
  { o: 50.6, h: 50.69, l: 49.6, c: 49.7 },
  { o: 49.7, h: 49.82, l: 48.2, c: 48.4 },
  { o: 48.4, h: 49.26, l: 48.35, c: 49.2 },
  { o: 49.2, h: 50.09, l: 49.1, c: 50.0 },
  { o: 50.0, h: 50.12, l: 49.62, c: 49.7 },
  { o: 49.7, h: 49.76, l: 49.25, c: 49.3 },
  { o: 49.3, h: 49.39, l: 48.8, c: 48.9 },
  { o: 48.9, h: 49.02, l: 48.52, c: 48.6 },
  { o: 48.6, h: 48.66, l: 48.1, c: 48.3 },
  { o: 48.3, h: 48.99, l: 48.2, c: 48.9 },
  { o: 48.9, h: 49.62, l: 48.82, c: 49.5 },
  { o: 49.5, h: 49.96, l: 49.45, c: 49.9 },
  { o: 49.9, h: 50.49, l: 49.8, c: 50.4 },
  { o: 50.4, h: 50.52, l: 50.12, c: 50.2 },
  { o: 50.2, h: 50.86, l: 50.15, c: 50.8 },
  { o: 50.8, h: 51.39, l: 50.7, c: 51.3 },
  { o: 51.3, h: 51.42, l: 51.02, c: 51.1 },
  { o: 51.1, h: 51.76, l: 51.05, c: 51.7 },
  { o: 51.7, h: 52.19, l: 51.6, c: 52.1 },
  { o: 52.1, h: 52.52, l: 52.02, c: 52.4 },
  { o: 52.4, h: 52.66, l: 52.35, c: 52.6 },
  { o: 52.6, h: 52.69, l: 52.2, c: 52.3 },
];

/** One tap zone per candle (ids "c1"…), with feedback for candles before and after the answer. */
function candleZones(count: number, answer: number, before: string, after: string): TapZone[] {
  return Array.from({ length: count }, (_, i): TapZone => {
    const n = i + 1;
    const zone: TapZone = { id: `c${n}`, label: `Candle ${n}`, index: i };
    if (n < answer) zone.feedback = before;
    if (n > answer) zone.feedback = after;
    return zone;
  });
}

/** L15: the range and its two levels, shared by the hook, B2 and B4. */
const RANGE_LAYERS: ChartLayer[] = [
  { kind: "zone", from: 59.0, to: 60.5, role: "neutral", label: "Range" },
  { kind: "level", price: 60.5, role: "resistance", label: "Resistance 60.50" },
  { kind: "level", price: 59.0, role: "support", label: "Support 59.00" },
];

const RR_INVALID = "Put the stop below the entry and the target above it.";

// ─── L14 · Writing a trading plan ──────────────────────────────────────────

const L14: LessonScript = {
  unit: "1.6",
  courseId: "1.6.1",
  hook: {
    prompt:
      "LABX is rising and has [[pullback|pulled back]]. You could buy at 49.00 with a [[stop-loss|stop]] at 48.00, under the pullback low. The previous high is 50.50. Would you buy?",
    control: {
      kind: "choice",
      choices: [
        { id: "buy", label: "Buy it" },
        { id: "skip", label: "Skip it" },
        { id: "cant", label: "Can't tell yet" },
      ],
      answer: "skip",
    },
    figure: {
      kind: "chart",
      chart: {
        candles: L14_HOOK_CANDLES,
        layers: [
          { kind: "level", price: 49.0, role: "entry", label: "Entry 49.00" },
          { kind: "level", price: 48.0, role: "stop", label: "Stop 48.00" },
          { kind: "level", price: 50.5, role: "neutral", label: "Previous high" },
        ],
      },
      steps: [{ text: "Entry 49.00, stop 48.00 under the pullback low, previous high 50.50." }],
    },
    compare: "You chose “{yours}”. The playbook says no trade: the previous high was 1.50 away, 1.5R, below the 2R minimum.",
    concept: "trading-plan",
  },
  learn: [
    {
      kind: "explain",
      text: "A [[trading-plan|trading plan]] is a written set of rules you decide while calm and follow while under pressure. The hard thinking is done before money is at risk. Its core is a [[playbook]]: the setups you trade, each described by conditions specific enough to answer yes or no.",
    },
    {
      kind: "match",
      title: "What a plan contains",
      prompt:
        "A plan first names the market and the [[timeframe]]: what you trade and which candle interval you read. Then come five parts. Match each one to its line in a pullback playbook.",
      pairs: [
        { left: "Setups", right: "Pullback in an uptrend", wrong: "A setup is the pattern. Its conditions are the checklist that confirms it." },
        { left: "Entry conditions", right: "A checklist where every item must be true" },
        { left: "Risk", right: "1% per trade, stop 0.20 below the pullback low", wrong: "That caps a whole session. Risk is what one trade may lose, and where its stop goes." },
        { left: "Exits", right: "Stop or target hit, or a time limit if nothing happens", wrong: "The 1% sets how much a trade may lose. Exits say how the trade ends: stop, target or time." },
        { left: "Limits", right: "Stop for the session after three losses in a row" },
      ],
      concept: "trading-plan",
    },
    {
      kind: "explain",
      title: "Make every condition checkable",
      text: "Vague rules leave room for wishful thinking, or [[confirmation-bias|confirmation bias]]. 'The trend looks strong' can be argued either way; 'the last two swing lows are each higher than the one before' is simply true or false. If two people could look at the same chart and disagree about a condition, rewrite it until they couldn't.",
    },
    {
      kind: "figure",
      title: "A playbook entry",
      text: "The same playbook on another LABX day. Check it one condition at a time.",
      figure: {
        kind: "chart",
        chart: { candles: L14_PLAYBOOK_CANDLES },
        steps: [
          {
            text: "Condition 1: the last two swing highs and swing lows are each higher than the ones before.",
            layers: [
              { kind: "marker", index: 2, at: "low", label: "45.90" },
              { kind: "marker", index: 5, at: "high", label: "48.30" },
              { kind: "marker", index: 7, at: "low", label: "46.60" },
              { kind: "marker", index: 10, at: "high", label: "49.60" },
              { kind: "marker", index: 12, at: "low", label: "47.40" },
              { kind: "marker", index: 16, at: "high", label: "51.50" },
            ],
          },
          {
            text: "Condition 2: the pullback low, 48.20, has held above the previous swing low at 47.40.",
            layers: [{ kind: "marker", index: 19, at: "low", label: "48.20", role: "accent" }],
          },
          {
            text: "Stop rule: 0.20 below the pullback low, so 48.00. Entry 49.00 is 1.00 above: 1R.",
            layers: [
              { kind: "level", price: 49.0, role: "entry", label: "Entry 49.00" },
              { kind: "level", price: 48.0, role: "stop", label: "Stop 48.00" },
              { kind: "bracket", from: 49.0, to: 48.0, index: 21, label: "1.00" },
            ],
          },
          {
            text: "Condition 3: the previous high, 51.50, is the target. Is it at least 2R away?",
            layers: [
              { kind: "level", price: 51.5, role: "target", label: "Target 51.50" },
              { kind: "bracket", from: 49.0, to: 51.5, index: 21, label: "2.50" },
            ],
          },
        ],
      },
    },
    {
      kind: "worked",
      title: "Does condition 3 pass?",
      lines: [
        "Risk per unit: 49.00 − 48.00 = 1.00.",
        "Reward per unit: 51.50 − 49.00 = 2.50.",
        "[[reward-to-risk|Reward-to-risk]] in [[r|R]]: 2.50 ÷ 1.00 = ?",
      ],
      ask: {
        answer: 2.5,
        tolerance: 0,
        unit: "R",
        feedback: [{ value: 0.4, text: "That's risk ÷ reward. R counts the reward in units of risk: 2.50 ÷ 1.00." }],
        correct: "Right: 2.5R clears the 2R minimum. All three conditions are met and the stop is defined, so the plan allows the trade.",
      },
    },
    {
      kind: "figure",
      title: "Run it through the plan",
      text: "Next day, same playbook. The pullback fell to 47.30, below the previous swing low at 47.40, and price is back at 48.60. Walk it through the plan: choose a branch at each node.",
      figure: {
        kind: "flow",
        start: "n1",
        interactive: true,
        nodes: [
          {
            id: "n1",
            text: "Setup present?",
            kind: "question",
            yes: "n2",
            no: "no-trade-1",
            correct: "yes",
            explain: "Fair doubt, but the pattern is still a pullback in an uptrend. Whether it qualifies is what the conditions check next.",
          },
          {
            id: "n2",
            text: "All conditions met?",
            kind: "question",
            yes: "n3",
            no: "no-trade-2",
            correct: "no",
            explain: "Check condition 2: the pullback had to hold above 47.40. It reached 47.30.",
          },
          { id: "n3", text: "Risk defined and within the limit?", kind: "question", yes: "enter", no: "resize" },
          { id: "no-trade-1", text: "No trade", kind: "end" },
          { id: "no-trade-2", text: "No trade", kind: "end" },
          { id: "enter", text: "Enter with a stop", kind: "end" },
          { id: "resize", text: "Resize within the limit, or skip", kind: "end" },
        ],
        steps: [
          "Setup present? A pullback in an uptrend: yes.",
          "All conditions met? The pullback broke 47.40, so condition 2 fails: no trade.",
          "Only three yeses lead to an entry. A 'no' on risk means resize or skip.",
        ],
      },
    },
    {
      kind: "order",
      title: "Before every trade",
      prompt:
        "Declining a trade that fails the plan is not a missed opportunity; it is the plan working. In MARKET//LAB, **Decision Quality** judges whether a decision fitted the plan and the information you had, not what price did afterwards. A well-reasoned 'no trade' is a good decision too, worth a line in your [[journal]]. Put the routine in order.",
      items: [
        "Name the setup you think you see.",
        "Check each condition against the chart, one at a time: yes or no.",
        "Define the stop and size the position within your risk limit.",
        "Enter only if every answer is yes.",
        "Record the decision and why in your journal, trade or no trade.",
      ],
      explain: "That's the routine. The journal entry is the same whether you trade or not.",
      concept: "trading-plan",
    },
  ],
  task: {
    widget: "risk-reward",
    goal: "Condition 3 needs a target at least 2R from entry. Entry and stop are fixed by the setup. Find the lowest target the plan still accepts.",
    start: { entry: 49.0, stop: 48.0, target: 51.5 },
    locked: ["entry", "stop"],
    success: { all: [{ field: "target", eq: 51.0 }, { field: "entry", eq: 49.0 }, { field: "stop", eq: 48.0 }] },
    feedback: [
      { when: { field: "target", lte: 49.0 }, text: RR_INVALID },
      { when: { field: "target", lt: 51.0 }, text: "At {target:2} the ratio is {rr:2} : 1. Condition 3 fails, so the plan says no trade." },
      { when: { field: "target", gt: 51.0 }, text: "{target:2} passes at {rr:2} : 1, but a lower target still clears 2R. Find the lowest." },
    ],
    correct: "Right. 51.00 is exactly 2R. Any lower target fails condition 3. On the hook's chart, 50.50 gave only 1.5 : 1, so the plan said no trade.",
    hints: [
      "Condition 3 is about distance: the target must be at least twice as far from entry as the stop.",
      "Here 1R is 49.00 − 48.00 = 1.00, so 2R is 2.00.",
      "Add 2R to the entry: 49.00 + 2.00.",
    ],
    showMe: { target: 51.0 },
    concept: "trading-plan",
  },
  check: ["q-dm-1", "q-dm-3", "q-dm-8"],
  recap: {
    takeaways: [
      "A plan names setups, conditions, risk, exits and limits, written before the session.",
      "Check every condition, one at a time. All yes: trade. Any no: no trade.",
      "No trade is a decision. Decision Quality judges fit with the plan, not later prices.",
    ],
  },
};

// ─── L15 · Thinking in scenarios ───────────────────────────────────────────

const L15: LessonScript = {
  unit: "2.13",
  courseId: "2.13.1",
  hook: {
    prompt: "LABX trades at 60.10, just under [[resistance]] at 60.50. The [[range|range floor]] is 59.00. What happens next?",
    control: {
      kind: "choice",
      choices: [
        { id: "up", label: "Breaks out above 60.50" },
        { id: "down", label: "Falls below 59.00" },
        { id: "inside", label: "Stays inside the range" },
      ],
    },
    figure: {
      kind: "chart",
      chart: { candles: L15_CANDLES, visible: 24, layers: RANGE_LAYERS },
      steps: [{ text: "LABX ranges between 59.00 and 60.50. The last close is 60.10." }],
    },
    compare: "You predicted “{yours}”. What came was a false breakout. The plan didn't need the right guess: that case already said no entry.",
    concept: "scenario-planning",
  },
  learn: [
    {
      kind: "explain",
      text: "Nobody knows what price will do next. [[scenario-analysis|Scenario analysis]] accepts that: instead of one prediction, you list the few plausible paths, what would show that each is happening, and what you would do. The aim is not to be right, but never to be pushed into an unplanned decision by a move you hadn't considered.",
    },
    {
      kind: "figure",
      title: "Four paths from here",
      figure: {
        kind: "chart",
        chart: { candles: L15_CANDLES, visible: 24, range: [58.4, 61.4], layers: RANGE_LAYERS },
        steps: [
          {
            text: "Bullish: two candles close above 60.50 and the breakout holds.",
            layers: [
              {
                kind: "path",
                points: [{ index: 23, price: 60.1 }, { index: 24, price: 60.7 }, { index: 25, price: 60.95 }, { index: 26, price: 61.2 }],
                role: "up",
                label: "Bullish",
                dashed: true,
              },
            ],
          },
          {
            text: "[[breakout|False breakout]]: one close above 60.50, then straight back into the range.",
            layers: [
              {
                kind: "path",
                points: [{ index: 23, price: 60.1 }, { index: 24, price: 60.62 }, { index: 25, price: 60.18 }, { index: 26, price: 59.8 }],
                role: "accent",
                label: "False breakout",
                dashed: true,
              },
            ],
          },
          {
            text: "Bearish: a candle closes below the range floor at 59.00.",
            layers: [
              {
                kind: "path",
                points: [{ index: 23, price: 60.1 }, { index: 24, price: 59.7 }, { index: 25, price: 59.2 }, { index: 26, price: 58.8 }, { index: 27, price: 58.6 }],
                role: "down",
                label: "Bearish",
                dashed: true,
              },
            ],
          },
          {
            text: "Sideways: price keeps moving between 59.00 and 60.50.",
            layers: [
              {
                kind: "path",
                points: [
                  { index: 23, price: 60.1 },
                  { index: 24, price: 59.4 },
                  { index: 25, price: 60.3 },
                  { index: 26, price: 59.4 },
                  { index: 27, price: 60.3 },
                  { index: 28, price: 59.8 },
                ],
                role: "neutral",
                label: "Sideways",
                dashed: true,
              },
            ],
          },
        ],
      },
    },
    {
      kind: "match",
      title: "Decide the actions now",
      prompt:
        "A simple frame: the idea works (**bullish**), fails (**bearish**) or nothing much happens (**sideways**); at a level, add the false breakout. Each case needs a [[trigger]], an observable event, and an **action** you decide now, not when it happens. Match them for LABX at 60.10, no position.",
      columns: ["Trigger", "Action"],
      pairs: [
        {
          left: "Two candles close above 60.50",
          right: "Buy near 60.80, stop 59.90, target 62.60",
          wrong: "That action belongs to another path. Ask what this trigger says about the idea: working, failed, false or not yet.",
        },
        {
          left: "One close above 60.50, then back below it",
          right: "No entry: the breakout didn't hold",
          wrong: "That action belongs to another path. Ask what this trigger says about the idea: working, failed, false or not yet.",
        },
        {
          left: "A candle closes below 59.00",
          right: "Drop the long idea: no trade",
          wrong: "That action belongs to another path. Ask what this trigger says about the idea: working, failed, false or not yet.",
        },
        {
          left: "Price stays between 59.00 and 60.50",
          right: "Wait inside the range",
          wrong: "That action belongs to another path. Ask what this trigger says about the idea: working, failed, false or not yet.",
        },
      ],
      concept: "scenario-planning",
    },
    {
      kind: "reveal",
      title: "What came next",
      prompt: "Reveal the next candles. Which case is this, and what does your plan do?",
      chart: { candles: L15_CANDLES, visible: 24, layers: RANGE_LAYERS },
      choices: [
        {
          id: "bullish",
          label: "Bullish: buy near 60.80",
          feedback: "Only one candle closed above 60.50; the bullish trigger needs two. Buying the first close is how false breakouts catch traders.",
        },
        { id: "false", label: "False breakout: no entry" },
        { id: "bearish", label: "Bearish: no trade", feedback: "Price fell back into the range, but no candle closed below 59.00." },
        { id: "sideways", label: "Sideways: wait", feedback: "Close, but price pushed above 60.50 first. That failed push is what makes it a false breakout." },
      ],
      answer: "false",
      after: "Right. One close above 60.50, then back inside: a false breakout. The plan already said no entry, so nothing had to be decided in a hurry.",
      concept: "false-breakout",
    },
    {
      kind: "explain",
      title: "Acceptable in every case",
      text: "You can estimate how likely each case is: start from how often similar setups worked in your [[journal]], and treat any estimate as judgement, not fact. What matters more is that the plan is acceptable in every case. If the bearish case would cost more than your risk limit, the trade is too big, however unlikely that case looks.",
    },
    {
      kind: "callout",
      tone: "key",
      text: "Before entering, ask: What would show the idea is working? What would show it failed, and where does the stop go? What if nothing happens, and how long will I wait? Is an event due that could make price [[gap]] past my stop? It deserves its own case. Can I accept the loss in the worst plausible case?",
    },
    {
      kind: "predict",
      title: "Outcome versus decision",
      prompt:
        "Afterwards, judge the plan by whether it covered what happened and whether you followed it, not by the profit. MARKET//LAB scores **Decision Quality** and the **Simulated Outcome** separately for exactly this reason. Trader A followed the plan and was stopped out at −1R. Trader B bought the first close above 60.50, outside the plan, and the move ran: +2R. Who made the better decision?",
      control: {
        kind: "choice",
        choices: [
          {
            id: "a",
            label: "Trader A",
            feedback: "Right. A stop-out in a case you planned for is a plan well executed. B's win came from a path the plan said to skip: that was luck.",
          },
          {
            id: "b",
            label: "Trader B",
            feedback: "B's profit is real, but the entry broke the two-close rule. A win in a case you never planned for is luck, not skill.",
          },
          { id: "both", label: "Both equally", feedback: "The outcomes differ, but so do the decisions: only A followed the plan." },
        ],
        answer: "a",
      },
      concept: "counterfactual-thinking",
    },
  ],
  task: {
    widget: "risk-reward",
    goal: "The breakout is running and you're tempted to buy late at 61.40. Stop and target stay where the plan put them. Find the highest entry that still gives 2 : 1.",
    start: { entry: 61.4, stop: 59.9, target: 62.6 },
    locked: ["stop", "target"],
    success: { all: [{ field: "entry", eq: 60.8 }, { field: "stop", eq: 59.9 }, { field: "target", eq: 62.6 }] },
    feedback: [
      { when: { any: [{ field: "entry", lte: 59.9 }, { field: "entry", gte: 62.6 }] }, text: RR_INVALID },
      {
        when: { field: "entry", gt: 60.8 },
        text: "At {entry:2} the ratio is {rr:2} : 1, and you'd need to win {breakEven:1}% of the time just to break even. Chasing makes the bullish case worse.",
      },
      {
        when: { field: "entry", lt: 60.8 },
        text: "{entry:2} clears 2 : 1, but after two closes above 60.50 price may never come back there. Find the highest entry that still works.",
      },
    ],
    correct:
      "Right. Above 60.80 the bullish case pays less than 2 : 1. That's why the plan says buy near 60.80, not wherever the breakout has run. Even at 2 : 1 it must work about one time in three to break even, before costs.",
    hints: [
      "Stop and target are fixed, so every cent higher on entry adds risk and removes reward.",
      "At 2 : 1 the reward is twice the risk. From stop to target is 62.60 − 59.90 = 2.70.",
      "Split 2.70 into one part risk and two parts reward: 0.90 and 1.80.",
    ],
    showMe: { entry: 60.8 },
    concept: "scenario-planning",
  },
  check: ["q-sa-3", "q-sa-4", "q-sa-6"],
  recap: {
    takeaways: [
      "List the paths before entering: bullish, bearish, sideways, and the false breakout at a level.",
      "Give each case an observable trigger and an action decided now, not in the moment.",
      "Judge the plan by coverage and execution. A planned stop-out beats an unplanned win.",
    ],
  },
};

// ─── L17 · Reviewing your decisions ────────────────────────────────────────

const L17: LessonScript = {
  unit: "1.6",
  courseId: "1.6.5",
  hook: {
    prompt:
      "Trade A followed the playbook, risked 1% and was stopped out for −1R. Trade B had no stop, sat through −180.00 vUSD and closed at +150.00. Which was the better decision?",
    control: {
      kind: "choice",
      choices: [
        { id: "a", label: "Trade A" },
        { id: "b", label: "Trade B" },
        { id: "cant", label: "Can't tell from this" },
      ],
      answer: "a",
    },
    compare: "You picked “{yours}”. Trade A was the better decision: it followed the plan and lost. Trade B was a poor decision with a lucky outcome.",
    concept: "decision-quality",
  },
  learn: [
    {
      kind: "explain",
      text: "After a trade, the result is the loudest piece of information and often the least useful. One profit or loss owes a lot to chance. A useful review asks a different question: given what I knew at that moment, was the decision sound, and did I follow my plan?",
    },
    {
      kind: "match",
      title: "Four boxes",
      prompt: "Decision and outcome are different things, so every trade lands in one of four boxes. Match each trade to its box.",
      pairs: [
        { left: "Every condition met, 1% risk, target hit at +2R", right: "Good decision, good outcome" },
        {
          left: "Every condition met, 1% risk, stopped out at −1R",
          right: "Good decision, bad outcome",
          wrong: "Every rule was followed. A loss on its own doesn't make the decision bad.",
        },
        {
          left: "Stop moved from 48.00 to 47.00, closed at +115.20",
          right: "Bad decision, good outcome",
          wrong: "The profit is real, but moving the stop broke a rule. Judge the decision first, then the outcome.",
        },
        {
          left: "Entered on two of three conditions, stopped out at −1R",
          right: "Bad decision, bad outcome",
          wrong: "The playbook needs every condition. Entering on two of three was the mistake, whatever the result.",
        },
      ],
      concept: "decision-quality",
    },
    {
      kind: "explain",
      text: "Good decision, good outcome: note what made it sound, so you can repeat it. Good, bad: a normal cost of trading; don't change the plan because of one result. Bad, good: the most dangerous, because the profit rewards the habit. Bad, bad: name the rule that was broken.",
    },
    {
      kind: "explain",
      title: "Three scores",
      text: "MARKET//LAB keeps three scores apart. [[decision-quality|Decision Quality]] rates your reasoning with the information you had at the time. **Risk Discipline** checks the rules: a [[stop-loss|stop]] on every entry, risk within the limit, no widened stops, no sizing up after a loss. The **Simulated Outcome** is the profit or loss. A profitable trade can still score poorly on the first two.",
    },
    {
      kind: "figure",
      title: "A profitable mistake",
      text: "Review with the same path you use to decide. The trade: buy 48 units at 50.00, stop at 48.00. [[risk-per-trade|Risk]]: 48 × 2.00 = 96.00 vUSD, 98.36 with costs, within 1% of the account. Every playbook condition was met. Choose a branch at each node.",
      figure: {
        kind: "flow",
        start: "n1",
        interactive: true,
        nodes: [
          { id: "n1", text: "Setup present?", kind: "question", yes: "n2", no: "no-trade-1", correct: "yes" },
          { id: "n2", text: "All conditions met?", kind: "question", yes: "n3", no: "no-trade-2", correct: "yes" },
          {
            id: "n3",
            text: "Risk defined and within the limit?",
            kind: "question",
            yes: "enter",
            no: "resize",
            correct: "yes",
            explain: "48 × 2.00 = 96.00 vUSD, 98.36 with costs, within 1% of 10,000.00. At entry the risk was within the limit.",
          },
          { id: "enter", text: "Enter with a stop", next: "n4" },
          {
            id: "n4",
            text: "Stop kept where planned?",
            kind: "question",
            yes: "followed",
            no: "learn",
            correct: "no",
            explain: "The stop moved from 48.00 to 47.00, away from price. That raised the risk above the 1% limit.",
          },
          { id: "no-trade-1", text: "No trade", kind: "end" },
          { id: "no-trade-2", text: "No trade", kind: "end" },
          { id: "resize", text: "Resize within the limit, or skip", kind: "end" },
          { id: "followed", text: "Plan followed", kind: "end" },
          { id: "learn", text: "A decision to learn from", kind: "end" },
        ],
        steps: [
          "At entry: setup present, every condition met, 98.36 at risk with costs. Three yeses.",
          "Price dipped towards 48.00. The stop was moved down to 47.00.",
          "New risk: 48 × 3.00 = 144.00 vUSD before costs, 1.44% of the account.",
          "Closed at 52.40: 48 × 2.40 = +115.20. The lesson is the broken rule, not the profit.",
        ],
      },
    },
    {
      kind: "hotspot",
      title: "What could you see?",
      prompt:
        "Two biases distort reviews. [[hindsight-bias|Hindsight bias]] makes what happened feel obvious once you know it, so replay only the candles you could see at the time. [[recency-bias|Recency bias]] gives the last few results too much weight, so look at decisions across many trades before changing a rule. The whole trade is on screen. Tap the last candle you could see when you moved the stop.",
      chart: {
        candles: L17_REPLAY_CANDLES,
        layers: [
          { kind: "level", price: 50.0, role: "entry", label: "Entry 50.00" },
          {
            kind: "path",
            points: [{ index: 7, price: 48.0 }, { index: 12, price: 48.0 }, { index: 12, price: 47.0 }, { index: 23, price: 47.0 }],
            role: "down",
            label: "Stop",
          },
        ],
      },
      zones: candleZones(
        26,
        13,
        "Too early: the stop hadn't moved yet. Find the candle where it steps from 48.00 to 47.00.",
        "That candle came later. When you moved the stop, the chart ended at the dip towards 48.00; the recovery wasn't there yet.",
      ),
      answer: "c13",
      correct: "Right. Nothing after this candle existed yet. Judge the stop move against this view: a dip towards 48.00, and no new information about the setup.",
      concept: "journaling",
    },
    {
      kind: "order",
      title: "A review routine",
      prompt: "Put the review routine in order. It ends with one line in your [[journal]].",
      items: [
        "Replay the trade up to your first decision point.",
        "Note what you could see then: the setup, the conditions met, the stop and the size.",
        "Compare the decision with your plan, condition by condition, and check Risk Discipline.",
        "Look at alternative decisions, without treating any single path as proof.",
        "Write one lesson: a rule to keep, add or change.",
      ],
      explain: "That's the routine. One rule per review is enough: it's the part that changes your next decision.",
      note: { key: "L17:6", label: "Your rule from the trade above (optional)", placeholder: "Never move a stop further from price." },
      concept: "journaling",
    },
  ],
  task: {
    widget: "expectancy",
    goal: "Your journal says this method wins 50% of trades at 1.5R and loses 1R: +0.25R per trade. Three of your last four trades lost. Find the lowest [[win-rate|win rate]] at which the method still breaks even.",
    start: { winRate: 50, avgWin: 1.5, avgLoss: 1.0 },
    locked: ["avgWin", "avgLoss"],
    success: { all: [{ field: "winRate", eq: 40 }, { field: "avgWin", eq: 1.5 }, { field: "avgLoss", eq: 1.0 }] },
    feedback: [
      { when: { field: "winRate", gt: 40 }, text: "At {winRate}% the method still makes {expectancy:2}R per trade. Lower the win rate until expectancy reaches zero." },
      { when: { field: "winRate", lt: 40 }, text: "At {winRate}% expectancy is {expectancy:2}R per trade: the method loses. Raise the win rate until expectancy is exactly zero." },
    ],
    correct:
      "Right. At 40% the method breaks even while losing 6 trades in 10. Three losses in four can't tell a 50% method from a 40% one: judge the method across many trades, and each trade by the plan.",
    hints: [
      "Keep the average win and loss as they are; move only the win rate.",
      "Break-even means win rate × 1.5 equals loss rate × 1.",
      "Try 40%: 0.40 × 1.5 = 0.60, and the loss rate is also 0.60.",
    ],
    showMe: { winRate: 40 },
    concept: "expectancy",
  },
  check: ["q-dm-4", "q-dm-5", "q-dm-6"],
  recap: {
    takeaways: [
      "Grade the decision and the outcome separately. A profit can hide a broken rule.",
      "Replay only what you could see at the decision point, then compare with the plan.",
      "End every review with one rule to keep, add or change.",
    ],
  },
};

/**
 * L17 B6 (the "A review routine" order beat): optional free-text field shown after the order is solved.
 * Saved in the lesson notes under `key`; not graded and never blocks Continue. `beat` is the 0-based index in `learn`.
 */
export const L17_RULE_NOTE = {
  lesson: "L17",
  beat: 6,
  key: "L17:6",
  label: "Your rule from the trade above (optional)",
  placeholder: "Never move a stop further from price.",
} as const;

/** Interactive scripts for unit U4 lessons (docs/learn). Filled in from the lesson scripts. */
export const SCRIPTS_U4: Record<string, LessonScript> = { L14, L15, L17 };
/** Glossary terms these lessons introduce that the glossary didn't have. */
export const TERMS_U4: GlossaryTerm[] = [
  {
    id: "scenario-analysis",
    term: "Scenario analysis",
    definition: "Listing the few plausible ways a trade could develop and deciding in advance what you will do in each.",
    plain: "A plan for every likely path, not a single guess.",
    related: ["trigger", "trading-plan", "playbook"],
    lesson: "L15",
    aka: ["Scenario planning"],
  },
  {
    id: "trigger",
    term: "Trigger",
    definition: "An observable event, such as a candle closing beyond a level, that shows a scenario has begun.",
    plain: "The sign on the chart that tells you which case you're in.",
    related: ["scenario-analysis", "breakout", "close"],
    lesson: "L15",
  },
  {
    id: "hindsight-bias",
    term: "Hindsight bias",
    definition: "The tendency, once you know what happened, to see it as obvious and to judge a past decision with information you did not have at the time.",
    plain: "Knowing the ending makes it feel as if you should have seen it coming.",
    related: ["recency-bias", "cognitive-bias", "journal"],
    lesson: "L17",
  },
  {
    id: "recency-bias",
    term: "Recency bias",
    definition: "The tendency to give the last few results too much weight compared with the whole record of decisions.",
    plain: "Letting the last few trades count for more than all the others.",
    related: ["hindsight-bias", "cognitive-bias", "variance"],
    lesson: "L17",
  },
  {
    id: "decision-quality",
    term: "Decision Quality",
    definition: "The MARKET//LAB score that rates a decision by the information, reasoning and risk control at the moment it was made, not by how the trade turned out.",
    plain: "Was it a good decision with what you knew then? The profit doesn't decide that.",
    related: ["trading-plan", "playbook", "journal"],
    lesson: "L17",
  },
];
/** Concepts these lessons introduce that the concept library didn't have. */
export const CONCEPTS_U4: Concept[] = [];
