import type { CandleData, Concept, GlossaryTerm, LessonScript, PlanField } from "../../types";
import type { Condition, FeedbackCase } from "../../success";

// ─── Chart data (docs/learn/U5-traders-mind.md) ────────────────────────────

/**
 * L13 B2: 12 LABX candles in a range between 100.00 and 103.10, then 5 candles rallying from 100.00
 * to 106.00 (c17), then a 3-candle pullback to 104.50 that holds (c18–c20, revealed in step 3).
 */
const L13_FOMO_CANDLES: CandleData[] = [
  { o: 101.0, h: 101.56, l: 100.95, c: 101.5 },
  { o: 101.5, h: 102.39, l: 101.4, c: 102.3 },
  { o: 102.3, h: 103.1, l: 102.22, c: 102.8 },
  { o: 102.8, h: 102.86, l: 101.85, c: 101.9 },
  { o: 101.9, h: 101.99, l: 100.0, c: 100.4 },
  { o: 100.4, h: 101.32, l: 100.32, c: 101.2 },
  { o: 101.2, h: 102.16, l: 101.15, c: 102.1 },
  { o: 102.1, h: 103.1, l: 102.0, c: 102.9 },
  { o: 102.9, h: 103.02, l: 101.92, c: 102.0 },
  { o: 102.0, h: 102.06, l: 100.0, c: 100.5 },
  { o: 100.5, h: 101.19, l: 100.4, c: 101.1 },
  { o: 101.1, h: 101.22, l: 100.0, c: 100.0 },
  { o: 100.0, h: 101.46, l: 100.0, c: 101.4 },
  { o: 101.4, h: 102.79, l: 101.3, c: 102.7 },
  { o: 102.7, h: 104.02, l: 102.62, c: 103.9 },
  { o: 103.9, h: 105.06, l: 103.85, c: 105.0 },
  { o: 105.0, h: 106.09, l: 104.9, c: 106.0 },
  { o: 106.0, h: 106.12, l: 105.12, c: 105.2 },
  { o: 105.2, h: 105.26, l: 104.5, c: 104.7 },
  { o: 104.7, h: 105.19, l: 104.6, c: 105.1 },
];

/** L13 B5: a long from 50.00 (c6) drifting down to 48.60 (c14); the stop at 48.00 is never touched. */
const L13_LOSS_AVERSION_CANDLES: CandleData[] = [
  { o: 48.6, h: 48.96, l: 48.55, c: 48.9 },
  { o: 48.9, h: 49.39, l: 48.8, c: 49.3 },
  { o: 49.3, h: 49.42, l: 49.02, c: 49.1 },
  { o: 49.1, h: 49.66, l: 49.05, c: 49.6 },
  { o: 49.6, h: 49.89, l: 49.5, c: 49.8 },
  { o: 49.8, h: 50.12, l: 49.72, c: 50.0 },
  { o: 50.0, h: 50.36, l: 49.95, c: 50.3 },
  { o: 50.3, h: 50.39, l: 49.8, c: 49.9 },
  { o: 49.9, h: 50.02, l: 49.52, c: 49.6 },
  { o: 49.6, h: 49.76, l: 49.55, c: 49.7 },
  { o: 49.7, h: 49.79, l: 49.2, c: 49.3 },
  { o: 49.3, h: 49.42, l: 48.82, c: 48.9 },
  { o: 48.9, h: 49.16, l: 48.85, c: 49.1 },
  { o: 49.1, h: 49.19, l: 48.5, c: 48.6 },
];

// ─── L13 · bias-spotter cards ──────────────────────────────────────────────

/** The four biases the bias-spotter asks about. Ids match the concept ids in concepts.ts. */
export type BiasId = "fomo" | "revenge-trading" | "loss-aversion" | "confirmation-bias";

/** One bias-spotter card: `answer` is the right bias (and the card's concept); `rationales` explain each wrong pick. */
export interface BiasCard {
  id: string;
  text: string;
  answer: BiasId;
  correct: string;
  rationales: Partial<Record<BiasId, string>>;
}

/** The four answer buttons, in their fixed order (keys 1–4). */
export const L13_BIAS_OPTIONS: { id: BiasId; label: string }[] = [
  { id: "fomo", label: "FOMO" },
  { id: "revenge-trading", label: "Revenge trading" },
  { id: "loss-aversion", label: "Loss aversion" },
  { id: "confirmation-bias", label: "Confirmation bias" },
];

/** L13 Try: the bias-spotter cards, in order. */
export const L13_BIAS_CARDS: BiasCard[] = [
  {
    id: "give-it-room",
    text: "Your long is 70.00 vUSD down and close to the stop. Nothing in the setup has changed, but you drag the stop lower 'to give it room'.",
    answer: "loss-aversion",
    correct: "Loss aversion. The stop was decided with a clear head; moving it raises the loss you already accepted.",
    rationales: {
      fomo: "Nothing here is about getting into a move. You're already in, and the stop moves to avoid taking the loss.",
      "revenge-trading": "There's no new trade to win anything back. This is about not accepting a loss that was already planned.",
      "confirmation-bias": "No evidence is being filtered: the setup hasn't changed. The stop moves only because the loss hurts.",
    },
  },
  {
    id: "just-noise",
    text: "You're long LABX. You point to the rising 20-period moving average as proof, and wave off three lower highs in a row as 'just noise'.",
    answer: "confirmation-bias",
    correct: "Confirmation bias. Three lower highs are evidence against the trade. Writing the price that proves you wrong, before entry, turns it into a rule.",
    rationales: {
      fomo: "You're already in the trade. The issue is which evidence you let count, not the fear of missing a move.",
      "revenge-trading": "No recent loss drives this. The pattern is keeping the evidence that agrees and dismissing what doesn't.",
      "loss-aversion": "No stop is being moved and no loss avoided yet. It's how the chart is read: only the supporting signs count.",
    },
  },
  {
    id: "get-it-back",
    text: "Your stop was hit for −100.00 vUSD. Five minutes later you enter again at three times your usual size, on a setup you'd normally skip: 'I just need to get that back.'",
    answer: "revenge-trading",
    correct: "Revenge trading. The size comes from the last result. The rule: a pause first, and risk never rises after a loss.",
    rationales: {
      fomo: "The trigger is the loss, not a fast move. Tripling the size to 'get it back' is revenge trading.",
      "loss-aversion": "Close: both start with a loss. But here you open a new, bigger trade to recover it, instead of avoiding taking it.",
      "confirmation-bias": "No evidence is being weighed. The size and the timing come from the last result, not from the chart.",
    },
  },
  {
    id: "miss-it",
    text: "LABX has jumped 5% in three candles and everyone is talking about it. It isn't one of your setups, but you open the ticket anyway: 'If I wait, I'll miss it.'",
    answer: "fomo",
    correct: "FOMO. The move is making the decision. The rule: a move that is not in the plan is not a trade.",
    rationales: {
      "revenge-trading": "There's no loss to win back. The move itself, and the fear of missing it, is what pulls you in.",
      "loss-aversion": "No loss is being avoided: you have no position. The pull is to get in before the move leaves without you.",
      "confirmation-bias": "Close, but you're not defending a view with chosen evidence. The urge is simply not to be left out.",
    },
  },
];

// ─── L13 · FOMO, revenge and loss aversion ─────────────────────────────────

const L13: LessonScript = {
  unit: "1.7",
  courseId: "1.7.2",
  hook: {
    prompt: "You were stopped out for −100.00 vUSD ten minutes ago. A new setup appears and looks good. What would you do next?",
    control: {
      kind: "choice",
      choices: [
        { id: "usual", label: "Take it at my usual 1% risk" },
        { id: "triple", label: "Take it at 3%, to win the loss back" },
        { id: "pause", label: "Pause first, then check it against my plan" },
        { id: "close", label: "Close the app for today" },
      ],
    },
    compare:
      "You chose “{yours}”. Wanting to win a loss back is normal; almost everyone feels it. A rule written in advance answers for you: a set pause, then the checklist, at your usual 1%.",
    concept: "revenge-trading",
  },
  learn: [
    {
      kind: "explain",
      text: "Decisions under uncertainty are rarely calm. Three well-known patterns often pull traders away from their plan: chasing a move, trying to win back a loss, and refusing to accept one. Everyone feels them: they are common [[cognitive-bias|biases]], not personal flaws. Naming them makes them easier to notice while they are happening, which is when it matters.",
    },
    {
      kind: "figure",
      title: "FOMO",
      text: "[[fomo|FOMO]] (fear of missing out) is the urge to enter because price is already moving fast and you don't want to be left behind. The entry is late, the stop is usually far away or missing, and the move itself makes the decision, not a setup in your plan.",
      figure: {
        kind: "chart",
        chart: {
          candles: L13_FOMO_CANDLES,
          visible: 17,
          layers: [
            { kind: "zone", from: 100.0, to: 103.1, role: "neutral", label: "Range" },
            { kind: "level", price: 103.1, role: "neutral", label: "Old range high" },
          ],
        },
        steps: [
          {
            text: "LABX rallies from 100.00 to 106.00 in five candles. The urge: buy now.",
            layers: [{ kind: "level", price: 106.0, role: "entry", label: "Entry 106.00" }],
          },
          {
            text: "The logical stop sits just under the old range high, at 103.00: 3.00 away.",
            layers: [
              { kind: "level", price: 103.0, role: "stop", label: "Stop 103.00" },
              { kind: "bracket", from: 106.0, to: 103.0, index: 16, label: "3.00" },
            ],
          },
          {
            text: "If price pulls back to 104.50 and holds, the same stop is only 1.50 away.",
            visible: 20,
            layers: [
              { kind: "level", price: 104.5, role: "entry", label: "Entry 104.50" },
              { kind: "bracket", from: 104.5, to: 103.0, index: 19, label: "1.50" },
            ],
          },
          { text: "Same 100.00 vUSD budget: 32 units when chasing, 62 after the pullback, costs included." },
        ],
      },
    },
    {
      kind: "explain",
      title: "Revenge trading",
      text: "[[revenge-trading|Revenge trading]] is entering again soon after a loss, often with a larger size, to win the money back. The new trade is about the last result, not about the market in front of you. Sizing up after a loss raises the risk exactly when judgement is under the most strain. Repeated, it becomes [[overtrading]].",
    },
    {
      kind: "worked",
      title: "What revenge sizing costs",
      lines: [
        "Account 10,000.00 vUSD. A trade hits its stop: −100.00 (1%). Account: 9,900.00.",
        "Plan: the next trade risks 1% of 9,900.00 = 99.00. If it also loses: 9,801.00, −1.99% in total.",
        "Revenge: the next trade risks 3% of 9,900.00 = 297.00. If it also loses: 9,603.00, −3.97% in total.",
        "Total lost with the revenge trade: 100.00 + 297.00 = ?",
      ],
      ask: {
        answer: 397.0,
        tolerance: 0,
        unit: "vUSD",
        feedback: [
          { value: 199.0, text: "That's the plan's total. The revenge trade risked 297.00 on the second loss." },
          { value: 400.0, text: "The second trade risked 3% of 9,900.00, which is 297.00, not 300.00." },
        ],
        correct: "Right: 397.00 against 199.00 with the plan, roughly double. And the bigger size was chosen because of a feeling, not a setup.",
      },
    },
    {
      kind: "explain",
      title: "Loss aversion",
      text: "[[loss-aversion|Loss aversion]] is the tendency to feel a loss more strongly than a gain of the same size. In trading it shows up as widening the [[stop-loss|stop]] to avoid taking a loss, or closing winners early to lock in a good feeling. A close relative is the **sunk cost** trap: 'I've lost too much already to sell now.'",
      figure: {
        kind: "chart",
        chart: {
          candles: L13_LOSS_AVERSION_CANDLES,
          range: [45.6, 50.8],
          layers: [
            { kind: "level", price: 50.0, role: "entry", label: "Entry 50.00" },
            { kind: "level", price: 48.0, role: "stop", label: "Stop 48.00" },
          ],
        },
        steps: [
          {
            text: "A long sized to lose 100.00 vUSD at its stop is down 70.00.",
            layers: [
              { kind: "bracket", from: 50.0, to: 48.6, index: 13, label: "−70.00" },
              { kind: "bracket", from: 50.0, to: 48.0, index: 11, label: "1R = 100.00" },
            ],
          },
          {
            text: "Moving the stop to twice its distance raises the planned loss to about 200.00.",
            layers: [
              { kind: "line", values: [null, null, null, null, null, 46.0, 46.0, 46.0, 46.0, 46.0, 46.0, 46.0, 46.0, 46.0], role: "down", label: "Moved stop 46.00", dashed: true },
              { kind: "bracket", from: 50.0, to: 46.0, index: 9, label: "≈ 200.00" },
            ],
          },
        ],
      },
    },
    {
      kind: "match",
      title: "A rule for each trap",
      prompt:
        "One more bias hides in your analysis: [[confirmation-bias|confirmation bias]], noticing what supports your view and discounting evidence against it. It is strongest once you hold a position. Each trap has a counter: a rule written in advance. Match them.",
      pairs: [
        {
          left: "FOMO",
          right: "Write your setups before the session. A move that is not in the plan is not a trade.",
          wrong: "A stop limits the loss once you're in. FOMO is about getting in at all, and the plan's setups decide that.",
        },
        { left: "Revenge trading", right: "Fix risk per trade as a percentage. Never increase the size after a loss." },
        {
          left: "Loss aversion",
          right: "Place the stop when you enter, and never widen it.",
          wrong: "Fixed risk stops the size growing after a loss. Loss aversion shows up in the stop: keep it where you put it.",
        },
        {
          left: "Confirmation bias",
          right: "Before entry, write down the price that would prove the idea wrong.",
          wrong: "Close, but confirmation bias is about evidence. Writing the price that proves you wrong turns contrary evidence into a rule.",
        },
      ],
      concept: "confirmation-bias",
    },
    {
      kind: "explain",
      title: "Process beats willpower",
      text: "A strong urge to act right now, after a big move or a painful loss, is not evidence that the trade is good. Treat it as the signal to slow down and run the checklist. Afterwards, note in the [[journal]] how you felt, so patterns show over time.",
    },
    {
      kind: "figure",
      text: "You were stopped out minutes ago. A pullback setup appears: all three conditions are met. You want to double your size. Walk this case through.",
      figure: {
        kind: "flow",
        start: "n0",
        interactive: true,
        nodes: [
          {
            id: "n0",
            text: "Loss or big move just now?",
            kind: "question",
            yes: "pause",
            no: "n1",
            correct: "yes",
            explain: "A stop-out minutes ago counts. The pause comes first, whatever the setup looks like.",
          },
          { id: "pause", text: "Pause for your set time", kind: "pause", next: "n1" },
          { id: "n1", text: "Setup present?", kind: "question", yes: "n2", no: "no-trade-1", correct: "yes" },
          {
            id: "n2",
            text: "All conditions met?",
            kind: "question",
            yes: "n3",
            no: "no-trade-2",
            correct: "yes",
            explain: "The case says all three conditions are met. The checklist allows this trade.",
          },
          {
            id: "n3",
            text: "Risk within the limit?",
            kind: "question",
            yes: "enter",
            no: "resize",
            correct: "no",
            explain: "Doubling the size doubles the risk to 2%. The rule: risk never rises after a loss.",
          },
          { id: "no-trade-1", text: "No trade", kind: "end" },
          { id: "no-trade-2", text: "No trade", kind: "end" },
          { id: "enter", text: "Enter with a stop", kind: "end" },
          { id: "resize", text: "Resize within the limit, or skip", kind: "end" },
        ],
        steps: [
          "A loss just now? Pause for your set time before deciding anything.",
          "Setup present, all conditions met: the checklist says this trade is allowed.",
          "Risk within the limit? Doubled size means 2%: no. Back to 1%, or skip.",
        ],
      },
    },
  ],
  task: {
    widget: "bias-spotter",
    data: { cards: L13_BIAS_CARDS, options: L13_BIAS_OPTIONS },
    goal: "Four moments, four pulls. Read each one and name the bias behind the decision.",
    success: { field: "solved", eq: 4 },
    correct: "All four named. Everyone feels these pulls. The goal isn't to stop feeling them; it's to have a rule that holds when they show up.",
    hints: [
      "Ask what set off the decision: a fast move, a recent loss, a loss you're sitting in, or a view you hold.",
      "Getting in or getting even? FOMO chases a move; revenge chases a past loss.",
      "Already in a trade? Moving the stop is loss aversion; waving off warning signs is confirmation bias.",
    ],
    showMe: { solved: 4 },
  },
  check: ["q-psy-2", "q-psy-5", "q-psy-4"],
  recap: {
    takeaways: [
      "Name the pull: FOMO chases a move, revenge chases a loss, loss aversion avoids one.",
      "Rules written in advance decide for you: setups first, fixed risk, stops never widened.",
      "After a big move or a loss, pause for a set time before any decision.",
    ],
  },
};

// ─── L18 · streak rules (plan fields) ──────────────────────────────────────


/**
 * L18 B5 ("Your streak rules"): the plan fields the beat collects. Any combination for which `valid` holds is
 * accepted (there is no single answer); `feedback` explains an invalid one. Values are kept in the lesson state
 * for the recap and Practice (decision D12). The beat's `choice` control covers the first field until the
 * fields control exists. `beat` is the 0-based index in `learn`.
 */
export const L18_STREAK_RULES: {
  lesson: string;
  beat: number;
  fields: PlanField[];
  valid: Condition;
  correct: string;
  feedback: FeedbackCase[];
} = {
  lesson: "L18",
  beat: 4,
  fields: [
    { id: "risk", label: "Risk per trade during a drawdown", kind: "choice", options: [0.5, 1, 2], unit: "%", default: 1 },
    { id: "pauseAfter", label: "Stop for the session after __ losses in a row", kind: "stepper", min: 2, max: 5, step: 1, default: 3 },
    { id: "reviewAt", label: "Full review when the account is __% below its peak", kind: "stepper", min: 3, max: 10, step: 1, unit: "%", default: 5 },
  ],
  valid: { field: "risk", lte: 1 },
  correct: "These are your streak rules. Written now, they decide for you when the streak arrives.",
  feedback: [
    {
      when: { field: "risk", gt: 1 },
      text: "Raising risk to recover is the revenge pattern, and it counts against Risk Discipline. You may reduce risk in a drawdown, never increase it.",
    },
  ],
};

// ─── L18 · Handling losing streaks ─────────────────────────────────────────

const L18: LessonScript = {
  unit: "2.12",
  courseId: "2.12.8",
  hook: {
    prompt: "A method wins 40% of its trades and makes +0.20R per trade on average. Over 100 trades, how likely is at least one run of five losses in a row?",
    control: { kind: "slider", min: 0, max: 100, step: 1, unit: "%", answer: 98 },
    compare: "You guessed {yours}%. For this method it is about 98%: a run of five losses is close to certain over 100 trades.",
    concept: "expectancy",
  },
  learn: [
    {
      kind: "explain",
      text: "Any method that sometimes loses will sometimes lose several times in a row. A run of losses does not by itself mean the method is broken, just as a run of wins does not mean it is perfect. The real danger is the response: streaks invite exactly the decisions that turn a normal [[drawdown]] into a deep one.",
    },
    {
      kind: "worked",
      title: "How likely is a run of losses?",
      lines: [
        "Method: wins 40% at +2R, loses 60% at −1R. [[expectancy|Expectancy]]: 0.40 × 2 − 0.60 × 1 = +0.20R.",
        "Assume each trade's result is independent of the last.",
        "Chance that five given trades in a row all lose: 0.6 × 0.6 × 0.6 × 0.6 × 0.6 = ?",
      ],
      ask: {
        answer: 7.8,
        tolerance: 0.1,
        unit: "%",
        feedback: [
          { value: 3, text: "That adds the chances. For all five to lose, multiply: 0.6 × 0.6 × 0.6 × 0.6 × 0.6." },
          { value: 60, text: "That's one trade. Five losses in a row need 0.6 five times over." },
        ],
        correct:
          "Right: 7.8% for five given trades. But 100 trades hold many stretches of five: a run of five or more somewhere is about 98% likely, and eight or more about 49%.",
      },
      after: "For a method like this, a run of five losses is close to certain over 100 trades, even though its expectancy is positive.",
    },
    {
      kind: "figure",
      title: "Eight losses in a row",
      text: "The same streak of eight losses at three risk sizes. The deepest fall from a peak is the [[max-drawdown|maximum drawdown]].",
      figure: {
        kind: "bars",
        unit: "%",
        bars: [
          { label: "1%: fall", value: -7.7, role: "down" },
          { label: "1%: gain needed", value: 8.4, role: "neutral" },
          { label: "2%: fall", value: -14.9, role: "down" },
          { label: "2%: gain needed", value: 17.5, role: "neutral" },
          { label: "3%: fall", value: -21.6, role: "down" },
          { label: "3%: gain needed", value: 27.6, role: "neutral" },
        ],
        steps: [
          "At 1% risk, eight losses take 10,000.00 to 9,227.45: −7.7%. Recovery needs +8.4%.",
          "At 2%, the same streak ends at 8,507.63: −14.9%. Recovery needs +17.5%.",
          "At 3%, it ends at 7,837.43: −21.6%. Recovery needs +27.6%.",
          "Larger risk per trade pushes the same streak into the steep part of the curve.",
        ],
      },
    },
    {
      kind: "match",
      title: "Where the damage really comes from",
      prompt: "During a streak, the damage comes from the response. Match each behaviour to what it sounds like in your head.",
      pairs: [
        { left: "Sizing up to win it back", right: "'One bigger trade and I'm back to even.'" },
        { left: "Loosening the rules", right: "'Not another loss. No stop on this one.'" },
        {
          left: "Recency bias",
          right: "'The last five lost. That's all I need to know.'",
          wrong: "Recency bias is the weighting: the last few results count too much. Method-hopping is the action it often leads to.",
        },
        { left: "Method-hopping", right: "'Third new strategy this month. This one will work.'" },
        {
          left: "Overcorrection",
          right: "'Every condition is met, but I'll skip it, just in case.'",
          wrong: "Loosening skips the rules to avoid a loss. Overcorrection skips valid trades the rules allow.",
        },
      ],
      concept: "revenge-trading",
    },
    {
      kind: "fields",
      title: "Your streak rules",
      prompt:
        "Decide how you'll behave in a losing streak before it starts. Keep [[risk-per-trade|risk per trade]] fixed as a percentage: you may reduce it during a drawdown, never increase it to recover. Then set a pause rule and a review trigger. Fill in yours.",
      fields: L18_STREAK_RULES.fields,
      valid: L18_STREAK_RULES.valid,
      correct: L18_STREAK_RULES.correct,
      feedback: L18_STREAK_RULES.feedback,
      concept: "drawdown",
    },
    {
      kind: "predict",
      title: "Bad luck or broken process?",
      prompt:
        "Six of your last eight trades lost. Your [[journal]] shows three late entries after big candles, two widened stops and one setup that missed a condition. Bad luck or a broken process?",
      control: {
        kind: "choice",
        choices: [
          {
            id: "luck",
            label: "Bad luck: normal variance",
            feedback: "Variance fits when the journal shows complete setups and stops kept. Here it shows late entries, widened stops and a missed condition.",
          },
          { id: "process", label: "A broken process", feedback: "Right. The journal shows broken rules, so this isn't just variance. The fix is a rule, not a new method." },
          {
            id: "cant",
            label: "Can't tell yet",
            feedback: "Eight trades can't judge a method's expectancy, but they can show broken rules. The journal already answers this one.",
          },
        ],
        answer: "process",
      },
      reveal:
        "To tell bad luck from a broken process, look at the decisions, not the profit and loss. Complete setups, stops placed at entry and risk within the limit point to [[variance]]: the normal clustering of random results. Skipped conditions, late entries or widened stops mean the process is the problem, and the fix is a rule.",
      concept: "decision-quality",
    },
  ],
  task: {
    widget: "expectancy",
    goal: "This method makes +0.20R per trade, yet a run of five losses is almost certain. Raise the run length: find the shortest losing run that is less likely than not over 100 trades.",
    start: { winRate: 40, avgWin: 2.0, avgLoss: 1.0, runLength: 5 },
    locked: ["winRate", "avgWin", "avgLoss"],
    success: { all: [{ field: "runLength", eq: 8 }, { field: "winRate", eq: 40 }] },
    feedback: [
      { when: { field: "runLength", lt: 8 }, text: "A run of {runLength} is still about {runProb:0}% likely over 100 trades. Go one longer." },
      { when: { field: "runLength", gt: 8 }, text: "{runLength} is below 50%, but so is a shorter run. Find the shortest." },
    ],
    correct:
      "Right. Even a run of eight is about a coin flip over 100 trades, at +0.20R per trade. A streak like that is part of the method, not proof it broke. Plan for it before it starts.",
    hints: [
      "'Less likely than not' means a chance below 50%.",
      "Step the run length up one at a time and watch the chance fall.",
      "A run of 7 is still about 69% likely. Try one longer.",
    ],
    showMe: { runLength: 8 },
    concept: "expectancy",
  },
  check: ["q-psy-6", "q-psy-7", "q-psy-9"],
  recap: {
    takeaways: [
      "Losing streaks are normal: a +0.20R method almost surely loses five in a row.",
      "Fix risk, set a pause rule and a review trigger before the streak starts.",
      "Sort each loss: sound decision, bad outcome, or broken rule? Fix rules, not methods.",
    ],
  },
};

/** Interactive scripts for unit U5 lessons (docs/learn). Filled in from the lesson scripts. */
export const SCRIPTS_U5: Record<string, LessonScript> = { L13, L18 };
/** Glossary terms these lessons introduce that the glossary didn't have. */
export const TERMS_U5: GlossaryTerm[] = [
  {
    id: "variance",
    term: "Variance",
    definition: "The normal clustering of random results; a run of losses with sound decisions is most likely variance.",
    plain: "The ups and downs that come from chance, not from your decisions.",
    related: ["expectancy", "drawdown", "recency-bias"],
    lesson: "L18",
  },
];
/** Concepts these lessons introduce that the concept library didn't have. */
export const CONCEPTS_U5: Concept[] = [];
