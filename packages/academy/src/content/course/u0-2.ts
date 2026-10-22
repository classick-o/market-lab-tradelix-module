import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, Question, TaskData, UnitContent } from "../../types";

/** Unit 0.2 · Thinking in probabilities (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */

/** One candle, in price units with 2 decimals. */
const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

// ─── Data (every figure checked by script: exact binomial / dynamic programming) ─

/** 0.2.3 B2: a flat zero line, one slot per play (0–20), under the running results of game A. */
const ZERO_21: CandleData[] = Array.from({ length: 21 }, () => k(0, 0, 0, 0));

/** 0.2.3 B2: five seeded runs of game A (+15.00 / −10.00 on a coin flip), running total after each of 20 plays. */
const RUN_1 = [0, -10, -20, -5, -15, 0, 15, 30, 45, 35, 25, 40, 55, 45, 60, 75, 90, 80, 95, 85, 100];
const RUN_2 = [0, -10, 5, 20, 35, 25, 15, 30, 20, 10, 25, 40, 55, 70, 60, 50, 40, 30, 45, 35, 50];
const RUN_3 = [0, -10, 5, 20, 35, 50, 65, 80, 70, 60, 50, 40, 30, 20, 10, 0, -10, -20, -5, 10, 25];
const RUN_4 = [0, -10, -20, -5, 10, 0, -10, 5, -5, -15, -25, -35, -20, -30, -15, -25, -35, -45, -55, -40, -25];
const RUN_5 = [0, 15, 5, -5, -15, -25, -10, -20, -30, -40, -50, -35, -20, -30, -15, -25, -35, -45, -55, -65, -50];

/** 0.2.5 hook and B3: 60 one-hour candles, each five coin flips of ±0.20 from the open (seed 61). */
const WALK_HOOK: CandleData[] = [
  k(100, 100.6, 100, 100.6), k(100.6, 101.4, 100.6, 101.2), k(101.2, 101.8, 101.2, 101.8), k(101.8, 102.4, 101.8, 102), k(102, 102.4, 102, 102.2), k(102.2, 102.2, 101.6, 101.6),
  k(101.6, 101.8, 101.4, 101.4), k(101.4, 101.6, 101.2, 101.6), k(101.6, 101.8, 101.2, 101.8), k(101.8, 102.4, 101.8, 102.4), k(102.4, 103, 102.4, 103), k(103, 103, 102.6, 102.8),
  k(102.8, 103, 102.6, 103), k(103, 103.4, 102.8, 102.8), k(102.8, 102.8, 102.6, 102.6), k(102.6, 102.8, 102.4, 102.4), k(102.4, 102.8, 102.4, 102.6), k(102.6, 103.2, 102.6, 103.2),
  k(103.2, 103.2, 102.8, 103), k(103, 103, 102.2, 102.4), k(102.4, 102.8, 102.2, 102.6), k(102.6, 102.6, 102, 102), k(102, 102.4, 101.8, 102.2), k(102.2, 102.4, 102, 102.4),
  k(102.4, 102.6, 102.2, 102.6), k(102.6, 102.6, 101.6, 101.6), k(101.6, 102.2, 101.6, 102.2), k(102.2, 102.2, 101.8, 102), k(102, 102, 101.2, 101.4), k(101.4, 101.4, 101, 101.2),
  k(101.2, 101.2, 100.8, 101), k(101, 101.2, 100.6, 100.8), k(100.8, 101.8, 100.8, 101.8), k(101.8, 102.4, 101.8, 102.4), k(102.4, 103.2, 102.4, 103), k(103, 103.8, 103, 103.6),
  k(103.6, 104.6, 103.6, 104.6), k(104.6, 105.2, 104.6, 105.2), k(105.2, 106.2, 105.2, 106.2), k(106.2, 106.4, 106, 106.4), k(106.4, 106.8, 106.4, 106.6), k(106.6, 106.8, 106.4, 106.4),
  k(106.4, 106.6, 106, 106.2), k(106.2, 106.8, 106.2, 106.8), k(106.8, 107, 106.6, 107), k(107, 107.6, 107, 107.2), k(107.2, 107.2, 106.6, 106.6), k(106.6, 107, 106.6, 106.8),
  k(106.8, 106.8, 106.2, 106.2), k(106.2, 106.6, 106, 106.4), k(106.4, 107, 106.4, 107), k(107, 107, 106.4, 106.4), k(106.4, 107, 106.4, 106.6), k(106.6, 107, 106.6, 106.8),
  k(106.8, 106.8, 106.2, 106.2), k(106.2, 106.4, 105.8, 106), k(106, 106.2, 105.8, 106.2), k(106.2, 106.4, 105.6, 105.6), k(105.6, 106.6, 105.6, 106.6), k(106.6, 106.6, 106.2, 106.4),
];
/** 0.2.5 B2: 40 candles = 200 coin flips of ±0.20 (seed 47). */
const WALK_200: CandleData[] = [
  k(100, 100, 99.8, 99.8), k(99.8, 99.8, 99.2, 99.2), k(99.2, 99.8, 99, 99.8), k(99.8, 100, 99.4, 99.6), k(99.6, 100, 99.4, 99.4), k(99.4, 100.2, 99.4, 100),
  k(100, 101, 100, 101), k(101, 102, 101, 102), k(102, 102.6, 102, 102.6), k(102.6, 103.2, 102.4, 103.2), k(103.2, 103.4, 103, 103), k(103, 103.6, 103, 103.6),
  k(103.6, 104.2, 103.6, 104.2), k(104.2, 104.6, 104.2, 104.4), k(104.4, 104.4, 103.4, 103.4), k(103.4, 104, 103.2, 104), k(104, 104.4, 103.8, 104.2), k(104.2, 104.8, 104.2, 104.8),
  k(104.8, 105.4, 104.8, 105.4), k(105.4, 105.6, 105.4, 105.6), k(105.6, 105.6, 105.4, 105.4), k(105.4, 105.4, 104.8, 104.8), k(104.8, 105, 104.6, 104.6), k(104.6, 105.2, 104.6, 105.2),
  k(105.2, 105.6, 105.2, 105.4), k(105.4, 105.4, 105, 105.2), k(105.2, 105.6, 105.2, 105.4), k(105.4, 105.4, 105, 105.2), k(105.2, 106.2, 105.2, 106.2), k(106.2, 106.8, 106.2, 106.4),
  k(106.4, 107, 106.2, 107), k(107, 107, 106.4, 106.4), k(106.4, 106.6, 106.2, 106.2), k(106.2, 106.4, 105.6, 105.6), k(105.6, 105.6, 105.2, 105.4), k(105.4, 105.6, 105.2, 105.6),
  k(105.6, 106, 105.6, 105.8), k(105.8, 106, 105.6, 105.6), k(105.6, 106.2, 105.6, 106.2), k(106.2, 106.8, 106.2, 106.8),
];
/** 0.2.5 B7: 60 candles of coin flips (seed 112); the last 20 sit under the veil. */
const WALK_NEXT: CandleData[] = [
  k(100, 100.2, 99.8, 100.2), k(100.2, 100.4, 99.6, 99.6), k(99.6, 99.8, 99.4, 99.8), k(99.8, 100.2, 99.8, 100), k(100, 100, 99.6, 99.8), k(99.8, 100.4, 99.8, 100.4),
  k(100.4, 100.8, 100.2, 100.6), k(100.6, 101, 100.6, 100.8), k(100.8, 101.4, 100.6, 101.4), k(101.4, 102, 101.4, 102), k(102, 102, 101.8, 101.8), k(101.8, 102.8, 101.8, 102.8),
  k(102.8, 103, 102.6, 103), k(103, 103, 102.6, 102.8), k(102.8, 103.6, 102.8, 103.4), k(103.4, 104.2, 103.4, 104), k(104, 104.6, 104, 104.2), k(104.2, 104.4, 103.6, 103.6),
  k(103.6, 104.2, 103.4, 104.2), k(104.2, 105.2, 104.2, 105.2), k(105.2, 105.8, 105.2, 105.8), k(105.8, 105.8, 105.4, 105.6), k(105.6, 105.8, 105.2, 105.8), k(105.8, 106, 105.4, 106),
  k(106, 106.4, 106, 106.2), k(106.2, 106.2, 105.6, 105.6), k(105.6, 105.8, 105.2, 105.8), k(105.8, 106.4, 105.8, 106.4), k(106.4, 107, 106.4, 106.6), k(106.6, 106.6, 106.2, 106.4),
  k(106.4, 106.6, 106.4, 106.6), k(106.6, 107.6, 106.6, 107.6), k(107.6, 108.2, 107.6, 108.2), k(108.2, 108.8, 108.2, 108.8), k(108.8, 108.8, 108.2, 108.2), k(108.2, 108.4, 107.6, 107.6),
  k(107.6, 108.4, 107.6, 108.2), k(108.2, 108.2, 107.6, 107.6), k(107.6, 108, 107.4, 107.8), k(107.8, 108.8, 107.8, 108.8), k(108.8, 108.8, 108.4, 108.6), k(108.6, 108.6, 108.2, 108.4),
  k(108.4, 108.6, 108.2, 108.6), k(108.6, 108.6, 108.2, 108.4), k(108.4, 108.6, 108.2, 108.6), k(108.6, 108.6, 108.2, 108.4), k(108.4, 108.6, 108.2, 108.2), k(108.2, 108.4, 108.2, 108.4),
  k(108.4, 109, 108.4, 108.6), k(108.6, 108.6, 108.2, 108.4), k(108.4, 108.6, 107.8, 107.8), k(107.8, 107.8, 107, 107.2), k(107.2, 107.4, 107, 107), k(107, 107.6, 106.8, 107.6),
  k(107.6, 108, 107.6, 107.8), k(107.8, 107.8, 106.8, 106.8), k(106.8, 106.8, 106.2, 106.2), k(106.2, 106.4, 106, 106), k(106, 106.8, 106, 106.6), k(106.6, 106.8, 106.2, 106.4),
];

/** 0.2.5 B3: bands where the hook chart turned three times each (swing points, two candles either side). */
const WALK_BANDS: ChartLayer[] = [
  { kind: "zone", from: 106.8, to: 107.6, role: "concept" },
  { kind: "zone", from: 105.6, to: 106.0, role: "concept" },
  { kind: "zone", from: 103.0, to: 103.4, role: "concept" },
  { kind: "zone", from: 102.4, to: 102.6, role: "concept" },
  { kind: "zone", from: 101.2, to: 101.8, role: "concept" },
];

/** 0.2.1 Try: the four boxes, as bias-spotter answer buttons. */
const BOX_OPTIONS: NonNullable<TaskData["options"]> = [
  { id: "deserved", label: "Deserved success" },
  { id: "bad-luck", label: "Bad luck" },
  { id: "dumb-luck", label: "Dumb luck" },
  { id: "poetic", label: "Poetic justice" },
];

/** 0.2.1 Try: five decision cards (two from trading, three from everyday life), each with its outcome. */
const BOX_CARDS: NonNullable<TaskData["cards"]> = [
  {
    id: "stopped-out",
    text: "You buy LABX with a stop set before entry, risking 1% of the account, exactly as your plan says. Price dips to the stop and you lose 100.00 vUSD.",
    answer: "bad-luck",
    correct: "Bad luck. The plan, the stop and the 1% risk made it a sound decision. The loss was the outcome, not the decision.",
    rationales: {
      deserved: "Deserved success needs a good outcome. This one lost, even though the decision was sound.",
      "dumb-luck": "Dumb luck is a poor decision that worked out. This decision was sound, and it lost.",
      poetic: "Poetic justice punishes a poor decision. Planning the stop and the risk made this one sound.",
    },
  },
  {
    id: "no-stop",
    text: "You buy LABX at three times your usual size with no stop, sure that 'it can't fall further'. It rises and you make 300.00 vUSD.",
    answer: "dumb-luck",
    correct: "Dumb luck. No stop and triple size made it a poor decision; the profit doesn't change that. It's the most dangerous box, because it feels like skill.",
    rationales: {
      deserved: "The outcome was good, but the decision wasn't: no stop and three times the size. A good result can't make it sound.",
      "bad-luck": "Bad luck is a sound decision that lost. This one won, and the decision was poor.",
      poetic: "Poetic justice is a poor decision that loses. This one was poor, but it won.",
    },
  },
  {
    id: "umbrella",
    text: "The forecast says 70% chance of rain, so you take an umbrella. It pours all afternoon and you stay dry.",
    answer: "deserved",
    correct: "Deserved success: a sound decision with a good outcome. The decision would have been just as good if it hadn't rained.",
    rationales: {
      "bad-luck": "Bad luck needs a bad outcome. You stayed dry: a sound decision, and it paid off.",
      "dumb-luck": "Dumb luck needs a poor decision. With 70% rain forecast, taking the umbrella was sound.",
      poetic: "Poetic justice is a poor decision punished. Here the decision was sound and it worked.",
    },
  },
  {
    id: "airport",
    text: "You leave for the airport with 10 minutes to spare in rush hour, ignoring the traffic warnings. You miss your flight.",
    answer: "poetic",
    correct: "Poetic justice: a poor decision with a bad outcome. The outcome happens to match the decision, which is why it feels fair.",
    rationales: {
      deserved: "Neither part fits: the decision ignored the warnings, and the flight was missed.",
      "bad-luck": "Bad luck is a sound decision that turned out badly. Ten minutes in rush hour, against the warnings, wasn't sound.",
      "dumb-luck": "Dumb luck is a poor decision that turned out well. This one turned out badly.",
    },
  },
  {
    id: "rent-ticket",
    text: "You spend your rent money on lottery tickets, and one of them wins 500.00.",
    answer: "dumb-luck",
    correct: "Dumb luck. Lottery tickets lose on average, and rent money was never yours to bet. The win doesn't make it a good decision.",
    rationales: {
      deserved: "The outcome was good, but the decision wasn't: rent money on a bet that loses on average.",
      "bad-luck": "Bad luck is a sound decision that lost. This one was poor, and it won.",
      poetic: "Poetic justice would be losing the rent money. This poor decision happened to win.",
    },
  },
];

// ─── 0.2.1 · Process versus outcome ────────────────────────────────────────

const L_0_2_1: Lesson = {
  id: "0.2.1",
  title: "Process versus outcome",
  topic: "decision_making",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Judge a decision by what you knew and how you reasoned, not by how it turned out.",
  objectives: [
    "Judge a decision by the information and reasoning available at the time, not by its result.",
    "Place any decision in one of four boxes: good or poor decision, good or bad outcome.",
    "Explain why people still grade decisions by their outcomes, even when told not to.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "0.2",
    courseId: "0.2.1",
    bridge: "In 0.1.6 you saw that Decision Quality grades your reasoning while Simulated Outcome is never graded. Here is why: one result can't tell a good decision from a lucky one.",
    hook: {
      prompt: "A dice game: you win 10.00 if a 6 comes up and lose 10.00 on anything else. Ana plays once and wins. Bogdan declines. Who made the better decision?",
      control: {
        kind: "choice",
        choices: [
          { id: "ana", label: "Ana: she won" },
          { id: "bogdan", label: "Bogdan" },
          { id: "cant", label: "Can't tell" },
        ],
        answer: "bogdan",
      },
      compare: "You picked {yours}. Bogdan decided better: the bet wins 10.00 one time in six and loses the same 10.00 five times in six. Ana's win was luck.",
      concept: "outcome-bias",
    },
    learn: [
      {
        kind: "explain",
        text: "Every result has two ingredients: the decision and luck. A good decision can lose; a poor one can win. So one result can't tell you how good the decision was. Judge it by what you knew and how you reasoned when you made it. Grading by the result instead is [[outcome-bias]].",
      },
      {
        kind: "match",
        title: "The four boxes",
        prompt: "A decision can be good or poor, and its outcome good or bad. That makes four boxes. Match each combination to its name.",
        columns: ["Decision and outcome", "Box"],
        pairs: [
          { left: "Good decision, good outcome", right: "Deserved success", wrong: "A good decision that works out earned its result: deserved success." },
          { left: "Good decision, bad outcome", right: "Bad luck", wrong: "A good decision that still loses wasn't punished for anything. Chance went against it: bad luck." },
          { left: "Poor decision, good outcome", right: "Dumb luck", wrong: "A poor decision that wins didn't earn the win. Chance covered for it: dumb luck." },
          { left: "Poor decision, bad outcome", right: "Poetic justice", wrong: "A poor decision that loses gets what it asked for: poetic justice." },
        ],
        correct: "Two of the four boxes are about luck. Only the decision is yours to control.",
        concept: "outcome-bias",
      },
      {
        kind: "predict",
        title: "Grade it before you know",
        prompt: "The forecast gives a 70% chance of rain, so you carry an umbrella all day. Grade the decision from 1 (poor) to 5 (good).",
        control: {
          kind: "slider",
          min: 1,
          max: 5,
          step: 1,
          start: 3,
          feedback: [
            { from: 1, to: 2, text: "A low grade for following a 70% forecast. Did something other than the forecast pull it down?" },
            { from: 3, to: 3, text: "A middle grade. With only the forecast to go on, the umbrella was the sensible call." },
            { from: 4, to: 5, text: "A high grade, from the information you had: 70% rain makes an umbrella sensible." },
          ],
        },
        reveal: "It didn't rain. If you now want to lower your grade, that's outcome bias at work: nothing you knew in the morning has changed. The decision is as good as it was; only the outcome is different.",
        concept: "outcome-bias",
      },
      {
        kind: "figure",
        title: "Ana's bet, box by box",
        text: "Back to the hook. Judge Ana's decision first, then add the outcome.",
        figure: {
          kind: "flow",
          start: "decision",
          interactive: true,
          nodes: [
            {
              id: "decision",
              text: "Sound decision? One chance in six to win 10.00, five in six to lose 10.00.",
              kind: "question",
              yes: "outcome-good",
              no: "outcome-poor",
              correct: "no",
              explain: "She risks the same 10.00 she could win and loses five times in six. It's a poor bet before the dice roll.",
            },
            {
              id: "outcome-poor",
              text: "Good outcome? The 6 came up and she won 10.00.",
              kind: "question",
              yes: "dumb",
              no: "poetic",
              correct: "yes",
              explain: "Winning 10.00 is a good outcome. Keep it separate from the decision.",
            },
            { id: "outcome-good", text: "Good outcome? The 6 came up and she won 10.00.", kind: "question", yes: "deserved", no: "bad" },
            { id: "dumb", text: "Dumb luck: a poor decision that happened to win", kind: "end" },
            { id: "poetic", text: "Poetic justice", kind: "end" },
            { id: "deserved", text: "Deserved success", kind: "end" },
            { id: "bad", text: "Bad luck", kind: "end" },
          ],
          steps: [
            "Sound decision? No: she risks 10.00 to win 10.00 and loses five times in six.",
            "Good outcome? Yes: the 6 came up and she won 10.00.",
            "Poor decision, good outcome: dumb luck.",
          ],
        },
        concept: "outcome-bias",
      },
      {
        kind: "explain",
        title: "Even when you know better",
        text: "In a 1988 study, Baron and Hershey gave people the same decisions with different outcomes. People rated a decision higher when it had turned out well. A preregistered replication in 2023, with 692 people, found the same effect, even among those who said the outcome shouldn't matter.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "In MARKET//LAB the process grade, [[decision-quality|Decision Quality]], which rates your reasoning at the time, comes first and the outcome second. A good decision that lost is still a good decision.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: { cards: BOX_CARDS, options: BOX_OPTIONS },
      goal: "Five decisions, each with its outcome. Put each one in its box: judge the decision first, then add the outcome.",
      success: { field: "solved", eq: 5 },
      correct: "All five boxed. Two of the three good outcomes came from poor decisions. Only the decisions tell you what to repeat.",
      hints: [
        "Cover the outcome and judge the decision alone: was it sound, given what was known?",
        "Then add the outcome. Sound plus a bad outcome is bad luck; poor plus a good outcome is dumb luck.",
        "No stop, an oversized bet or rent money on a lottery make a decision poor, whatever happens next.",
      ],
      showMe: { solved: 5 },
      concept: "outcome-bias",
    },
    check: ["q-0.2.1-1", "q-0.2.1-2", "q-0.2.1-3"],
    recap: {
      takeaways: [
        "Judge a decision by what you knew and how you reasoned then, not by how it turned out.",
        "Four boxes: deserved success, bad luck, dumb luck, poetic justice. Dumb luck is the dangerous one.",
        "Outcomes sway everyone's grades, even people who know better. That's why the process is graded first.",
      ],
      next: "Next, 0.2.2: expected value, the tool for judging a decision before its result is known.",
    },
  },
};

// ─── 0.2.2 · Expected value ────────────────────────────────────────────────

const L_0_2_2: Lesson = {
  id: "0.2.2",
  title: "Expected value",
  topic: "risk_management",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Weigh each outcome by its probability to find what a game returns per play, on average, over many plays.",
  objectives: [
    "Calculate the expected value of a simple game from its probabilities and payoffs.",
    "Show that a game that wins most of the time can still lose on average.",
    "Explain why expected value describes many plays, not the next one.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "risk_management", label: "Risk management check" }],
  script: {
    unit: "0.2",
    courseId: "0.2.2",
    bridge: "In 0.2.1 you judged decisions apart from their outcomes. To do that with numbers, you need expected value: what a choice returns on average over many plays. Here you calculate it for two games.",
    hook: {
      prompt: "Game A: a coin flip, win 15.00 or lose 10.00. Game B: win 1.00 nine times in ten, lose 12.00 once in ten. Which would you rather play 100 times?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Game A" },
          { id: "b", label: "Game B" },
          { id: "same", label: "The same" },
        ],
        answer: "a",
      },
      compare: "You picked {yours}. Game A returns +2.50 per play, about +250.00 over 100 plays. Game B loses 0.30 per play, about −30.00, while winning nine times in ten.",
      concept: "expected-value",
    },
    learn: [
      {
        kind: "explain",
        text: "[[expected-value|Expected value]] (EV) is the average result of a game over very many plays. Multiply each outcome by its [[probability]], then add them up, with losses counted as negative amounts. The result is what one play is worth on average.",
      },
      {
        kind: "figure",
        title: "Game A",
        text: "Game A is a coin flip, so each outcome has a probability of 0.5.",
        figure: {
          kind: "formula",
          boxes: [{ text: "0.5 × 15.00" }, { text: "0.5 × 10.00" }, { text: "2.50", answer: 2.5, tolerance: 0, unit: "vUSD" }],
          operators: ["−", "="],
          steps: [
            "Wins: half the time, +15.00. Weighted: 0.5 × 15.00 = 7.50.",
            "Losses: half the time, −10.00. Weighted: 0.5 × 10.00 = 5.00.",
            "Wins minus losses: type the EV per play, in vUSD.",
          ],
        },
        concept: "expected-value",
      },
      {
        kind: "worked",
        title: "Game B",
        lines: ["Game B wins 1.00 nine times in ten and loses 12.00 once in ten.", "Wins: 0.9 × 1.00 = 0.90.", "Losses: 0.1 × 12.00 = 1.20.", "EV = 0.90 − 1.20 = ?"],
        ask: {
          answer: -0.3,
          tolerance: 0,
          unit: "vUSD",
          feedback: [
            { value: 0.3, text: "Check the sign: the loss side is bigger." },
            { value: 0.9, text: "That's only the wins. Subtract the losses." },
          ],
          correct: "Right: −0.30 per play, about −30.00 over 100 plays.",
        },
        after: "Game B wins nine plays in ten and still loses 0.30 per play on average. Its rare loss is twelve times its usual win.",
        concept: "expected-value",
      },
      {
        kind: "explain",
        title: "Likely isn't expected",
        text: "**Likely** isn't the same as **expected**. Game B wins nine times in ten and still loses money on average, because its rare loss is large. You'll meet this pattern again in 1.4.5, with win rates and profit targets, and in 1.8.1, with doubling after losses.",
      },
      {
        kind: "predict",
        title: "Ten plays of game A",
        prompt: "Game A makes +2.50 per play on average. You play it 10 times. Will you end up ahead?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes: the EV is positive", feedback: "A positive EV makes being ahead likely, not certain. Over 10 plays, about 38% of runs end behind or exactly even." },
            { id: "no", label: "No: 10 plays are too few", feedback: "Being ahead is the most likely result, 62.3% of the time. It just isn't guaranteed." },
            { id: "maybe", label: "Not necessarily", feedback: "Right: ahead 62.3% of the time, but behind 17.2% and exactly even 20.5%." },
          ],
          answer: "maybe",
        },
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "Behind", value: 17.2, role: "down" },
            { label: "Exactly even", value: 20.5, role: "neutral" },
            { label: "Ahead", value: 62.3, role: "accent" },
          ],
          steps: ["After 10 plays of game A: behind 17.2%, even 20.5%, ahead 62.3% of the time."],
        },
        reveal: "Over 10 plays, game A still ends behind about one time in six (17.2%). After 1,000 plays, the chance of being behind is less than one in a billion: the average settles near +2.50.",
        concept: "expected-value",
      },
      {
        kind: "callout",
        tone: "key",
        text: "An **edge** is a positive expected value after costs. It tells you nothing about the next play.",
      },
    ],
    task: {
      widget: "expectancy",
      goal: "This game wins 70% of the time and pays 1.00. Find the smallest loss, in steps of 0.10, that makes its expected value negative. The widget writes 1.00 as 1.0R, using R as a unit worth 1.00.",
      start: { winRate: 70, avgWin: 1.0, avgLoss: 1.0, runLength: 5 },
      locked: ["winRate", "avgWin", "runLength"],
      hidden: ["runProb"],
      success: {
        all: [
          { field: "avgLoss", eq: 2.4, tol: 0.001 },
          { field: "winRate", eq: 70 },
          { field: "avgWin", eq: 1, tol: 0.001 },
        ],
      },
      feedback: [
        { when: { field: "expectancy", gt: 0 }, text: "At a loss of {avgLoss:2}, the EV is still {expectancy:2} per play. Raise the loss." },
        { when: { field: "avgLoss", gt: 2.4 }, text: "At {avgLoss:2} the EV is negative ({expectancy:2}), but it turns negative at a smaller loss. Step back down." },
      ],
      correct: "Right: at a loss of 2.40 the EV is −0.02 per play; at 2.30 it was +0.01. This game wins 70% of the time and still loses on average.",
      hints: ["EV = 0.70 × 1.00 − 0.30 × loss.", "Find where 0.30 × loss passes 0.70.", "0.70 ÷ 0.30 ≈ 2.33, so the next step up is the answer."],
      showMe: { avgLoss: 2.4 },
      concept: "expected-value",
    },
    check: ["q-0.2.2-1", "q-0.2.2-2", "q-0.2.2-3"],
    recap: {
      takeaways: [
        "EV: each outcome times its probability, added up. Game A makes +2.50 per play; game B loses 0.30.",
        "A game can win most of the time and still lose on average, when its losses are large.",
        "Expected value describes many plays. The next play can always lose, even with an edge.",
      ],
      next: "Next, 0.2.3: why real runs of a good game still stray far from its expected value.",
    },
  },
};

// ─── 0.2.3 · Variance and streaks ──────────────────────────────────────────

const L_0_2_3: Lesson = {
  id: "0.2.3",
  title: "Variance and streaks",
  topic: "risk_management",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Results scatter around the expected value, and long losing streaks are a normal part of random sequences.",
  objectives: [
    "Explain variance as the spread of results around the expected value.",
    "Estimate how long losing streaks get over 100 independent trials.",
    "Recognise that a streak on its own is not evidence that something has changed.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "risk_management", label: "Risk management check" }],
  script: {
    unit: "0.2",
    courseId: "0.2.3",
    bridge: "In 0.2.2 you found that game A makes +2.50 per play on average. Here you play it in runs of 20 and watch results scatter around that average, with longer losing streaks than most people expect.",
    hook: {
      prompt: "You flip a fair coin 100 times. What's the longest run of tails in a row you expect to see?",
      control: { kind: "slider", min: 2, max: 15, step: 1, start: 2, unit: "in a row", answer: 6, tolerance: 1 },
      compare: "You guessed {yours}. The longest run of tails is about 6 on average. A run of 5 or more shows up in 81.0% of sequences, 6 or more in 54.6%.",
      concept: "streaks-and-runs",
    },
    learn: [
      {
        kind: "explain",
        text: "[[variance|Variance]] is how widely results spread around the expected value. Game A from the last lesson makes +2.50 per play on average, but a single play is +15.00 or −10.00. A short run of plays can land far from the average, in either direction.",
      },
      {
        kind: "figure",
        title: "Five runs of game A",
        text: "Each line is one run of 20 plays of game A, starting from zero.",
        figure: {
          kind: "chart",
          chart: {
            candles: ZERO_21,
            hideCandles: true,
            layers: [{ kind: "level", price: 0, role: "neutral", label: "BREAK-EVEN", chip: false }],
            describe:
              "Five lines show the running result of five runs of 20 plays of game A. They end at +100.00, +50.00, +25.00, −25.00 and −50.00. A dashed line shows the expected path to +50.00.",
          },
          steps: [
            {
              text: "Dashed: the expected path, +50.00 after 20 plays. Runs 1 and 2 end at +100.00 and +50.00.",
              layers: [
                { kind: "path", points: [{ index: 0, price: 0 }, { index: 20, price: 50 }], role: "concept", dashed: true },
                { kind: "line", values: RUN_1, role: "up", label: "+100" },
                { kind: "line", values: RUN_2, role: "up", label: "+50" },
              ],
            },
            {
              text: "Run 3 climbs to +80.00 by play 7, then gives most of it back: +25.00.",
              layers: [{ kind: "line", values: RUN_3, role: "accent", label: "+25" }],
            },
            {
              text: "Runs 4 and 5 end behind, at −25.00 and −50.00. Same game, same odds.",
              layers: [
                { kind: "line", values: RUN_4, role: "down", label: "−25" },
                { kind: "line", values: RUN_5, role: "down", label: "−50" },
              ],
            },
            { text: "Over many runs, about 13% end behind after 20 plays, and about 2% after 100." },
          ],
        },
        concept: "variance",
      },
      {
        kind: "predict",
        title: "Human or coin?",
        prompt:
          "One of these 30-flip sequences came from a real coin. A person typed the other, trying to look random. Which is the real coin? **A:** HTTHHTTTTT HHHTHTTTHH THTHHTHTHH. **B:** HTHHTHTTHT HTHHHTHTTH THHTTHTHTT.",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "A", feedback: "Right. A has a run of five tails and switches 16 times, close to the 14.5 a fair coin averages." },
            { id: "b", label: "B", feedback: "B was typed by a person. It switches 21 times in 29 flips and never runs longer than 3. Real coins switch less and run longer." },
          ],
          answer: "a",
        },
        reveal: "People switch too often and avoid long runs, so their sequences look 'too random'. Only about 1 in 10 real 30-flip sequences has no run longer than 3. Long runs are what randomness looks like.",
        concept: "streaks-and-runs",
      },
      {
        kind: "worked",
        title: "Five tails in a row",
        lines: ["Each flip lands tails with probability 0.5.", "Flips are independent, so the chances multiply.", "Five given flips all tails: 0.5 × 0.5 × 0.5 × 0.5 × 0.5 = ?"],
        ask: {
          answer: 3.1,
          tolerance: 0.1,
          unit: "%",
          feedback: [
            { value: 2.5, text: "That adds 0.5 five times. For all five to happen, multiply instead." },
            { value: 0.03, text: "That's the chance as a decimal, 0.03125. As a percentage, it's about 3.1%." },
            { value: 50, text: "That's one flip. Five in a row need 0.5 five times over." },
          ],
          correct: "Right: 0.03125, about 3.1%.",
        },
        after: "But a run can start almost anywhere in 100 flips, so a run of 5 shows up somewhere 81% of the time.",
        concept: "streaks-and-runs",
      },
      {
        kind: "figure",
        title: "Losing runs in 100 trades",
        text: "The chance of at least one losing run of each length somewhere in 100 independent trades, at a 50% and a 40% win rate.",
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "5 in a row · 50% wins", value: 81.0, role: "neutral" },
            { label: "5 in a row · 40% wins", value: 97.6, role: "down" },
            { label: "6 in a row · 50% wins", value: 54.6, role: "neutral" },
            { label: "6 in a row · 40% wins", value: 87.3, role: "down" },
            { label: "8 in a row · 50% wins", value: 17.0, role: "neutral" },
            { label: "8 in a row · 40% wins", value: 49.0, role: "down" },
            { label: "10 in a row · 50% wins", value: 4.4, role: "neutral" },
            { label: "10 in a row · 40% wins", value: 20.5, role: "down" },
          ],
          steps: [
            "Five losses in a row: 81.0% likely at 50% wins, 97.6% at 40%.",
            "Six or more: 54.6% and 87.3%. Still more likely than not.",
            "Eight or more: 17.0% and 49.0%. About a coin flip at 40% wins.",
            "Ten or more: 4.4% and 20.5%. Rare, but it happens.",
          ],
        },
        concept: "streaks-and-runs",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A [[losing-streak|losing streak]] is what randomness looks like. On its own it doesn't prove a method stopped working (1.6.6), and it doesn't make a win 'due' (1.7.3).",
      },
    ],
    task: {
      widget: "expectancy",
      goal: "At a 40% win rate, find the longest losing run that still shows up in at least half of all 100-trade sequences.",
      start: { winRate: 50, avgWin: 2.0, avgLoss: 1.0, runLength: 5 },
      locked: ["avgWin", "avgLoss"],
      hidden: ["expectancy", "over100"],
      success: {
        all: [
          { field: "winRate", eq: 40 },
          { field: "runLength", eq: 7 },
        ],
      },
      feedback: [
        { when: { not: { field: "winRate", eq: 40 } }, text: "The win rate is {winRate}%. Set it to 40% first." },
        { when: { field: "runLength", lt: 7 }, text: "A run of {runLength} shows up {runProb:1}% of the time, well above half. Try a longer run." },
        { when: { field: "runLength", gt: 7 }, text: "A run of {runLength} shows up only {runProb:1}% of the time, below half. Go shorter." },
      ],
      correct: "Right: a run of 7 losses shows up in 68.9% of 100-trade sequences at a 40% win rate, a run of 8 in 49.0%. Plan for runs like these.",
      hints: ["Set the win rate to 40% first.", "Raise the run length until the chance drops below 50%.", "The answer is the last length at or above 50%."],
      showMe: { winRate: 40, runLength: 7 },
      concept: "streaks-and-runs",
    },
    check: ["q-0.2.3-1", "q-0.2.3-2", "q-0.2.3-3"],
    recap: {
      takeaways: [
        "Variance spreads results around the expected value: game A still ends behind 13% of the time after 20 plays.",
        "Over 100 fair flips, a run of 5 tails appears 81% of the time. Expect long streaks.",
        "A streak alone isn't evidence that anything changed, and it doesn't make a win due.",
      ],
      next: "Next, 0.2.4: how many trades it takes before a win rate really tells you something.",
    },
  },
};

// ─── 0.2.4 · How many trades before you know? ─────────────────────────────

const L_0_2_4: Lesson = {
  id: "0.2.4",
  title: "How many trades before you know?",
  topic: "scenario_analysis",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "A win rate from a few trades is a wide range, so judge methods on hundreds of trades and single trades on their process.",
  objectives: [
    "Explain why a win rate measured on 20 trades is a wide range, not a single number.",
    "Estimate how the plausible range narrows as the number of trades grows.",
    "Judge methods on large samples and single trades on their process.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "scenario_analysis", label: "Scenario analysis check" }],
  script: {
    unit: "0.2",
    courseId: "0.2.4",
    bridge: "In 0.2.3 you saw streaks and swings in a game whose odds you knew. In trading you don't know them. Here you see how many trades it takes to measure a win rate.",
    hook: {
      prompt: "A method won 12 of its first 20 trades: 60%. What is its true win rate?",
      control: {
        kind: "choice",
        choices: [
          { id: "sixty", label: "60%" },
          { id: "range", label: "Somewhere between about 40% and 80%" },
          { id: "floor", label: "At least 55%" },
        ],
        answer: "range",
      },
      compare: "You picked {yours}. After 20 trades, the plausible range around 60% runs from about 38.5% to 81.5%: wide enough to include a coin flip.",
      concept: "sample-size",
    },
    learn: [
      {
        kind: "explain",
        text: "Your [[sample-size|sample]] is the trades you have. A small sample swings a lot from one set of trades to the next: with 20 trades, each win or loss moves the win rate by 5 points. So a win rate from 20 trades is a rough range, not a single number.",
      },
      {
        kind: "figure",
        title: "The plausible range narrows",
        text: "The plausible range around a 60% result: the true win rates that could easily have produced it. Bars show its width in percentage points.",
        figure: {
          kind: "bars",
          unit: " pts",
          bars: [
            { label: "20 trades: 38.5–81.5%", value: 43.0, role: "neutral" },
            { label: "100 trades: 50.4–69.6%", value: 19.2, role: "neutral" },
            { label: "400 trades: 55.2–64.8%", value: 9.6, role: "accent" },
          ],
          steps: [
            "20 trades: anywhere from 38.5% to 81.5%. A coin flip, 50%, fits easily.",
            "100 trades: 50.4% to 69.6%. Narrower, and just clear of 50%.",
            "400 trades: 55.2% to 64.8%. Four times the trades halves the width.",
          ],
        },
        concept: "sample-size",
      },
      {
        kind: "predict",
        title: "Guess the edge",
        prompt: "Two hidden methods, 20 trades each. Method A won 13, method B won 10. Only one of them has a real edge. Which?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "A: 13 of 20", feedback: "A looked better, but it had no edge: over 1,000 trades it won 49.8%." },
            { id: "b", label: "B: 10 of 20", feedback: "B did have the edge, but 10 of 20 couldn't show it. Picking B from these numbers would have been a guess." },
            { id: "cant", label: "Can't tell from 20 trades", feedback: "Right. At 20 trades, both results fit a coin flip and a 55% method alike." },
          ],
          answer: "cant",
        },
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "A, first 20 trades", value: 65, role: "neutral" },
            { label: "B, first 20 trades", value: 50, role: "neutral" },
            { label: "A, 100 trades", value: 47, role: "neutral" },
            { label: "B, 100 trades", value: 51, role: "neutral" },
            { label: "A, 1,000 trades", value: 49.8, role: "neutral" },
            { label: "B, 1,000 trades", value: 55.3, role: "accent" },
          ],
          steps: [
            "After 20 trades: A wins 65%, B wins 50%. A looks better.",
            "After 100 trades: A 47%, B 51%. The order flips.",
            "After 1,000 trades: A 49.8%, B 55.3%. B had the edge all along.",
          ],
        },
        reveal: "A had no edge: its true win rate is 50%. B's is 55%. At 20 trades, luck made the wrong one look better.",
        concept: "sample-size",
      },
      {
        kind: "predict",
        title: "Luck at 20 trades",
        prompt: "A method with no edge wins each trade with a 50% chance. Roughly how often does it reach 60% or better over 20 trades?",
        control: {
          kind: "choice",
          choices: [
            { id: "100", label: "1 in 100", feedback: "Far more often: 12 or more wins out of 20 happens 25.2% of the time." },
            { id: "20", label: "1 in 20", feedback: "More often still: 25.2% of the time, about 1 in 4." },
            { id: "4", label: "1 in 4", feedback: "Right: 25.2%. One method in four with no edge looks like a 60% method after 20 trades." },
          ],
          answer: "4",
        },
        reveal: "Twelve or more wins in 20 coin flips: 25.2%, calculated exactly. If four people each test a method with no edge, one of them will probably see 60% and think they've found something.",
        concept: "sample-size",
      },
      {
        kind: "explain",
        title: "The law of small numbers",
        text: "People expect small samples to look like the whole. Tversky and Kahneman (1971) called it the law of small numbers: researchers expected about 85% of repeat studies to succeed when the real chance was about 48%. Only the [[law-of-large-numbers|law of large numbers]] is real, and it needs many trials, not a few.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Judge a method on hundreds of trades. Judge each trade on whether it followed the plan. The 30 trades in Level 1 measure your process, not your edge.",
      },
      {
        kind: "predict",
        title: "When does 60% stop fitting a coin flip?",
        prompt: "A method keeps winning 60% of its trades. After how many trades does its plausible range finally leave 50%, a coin flip, behind?",
        control: {
          kind: "slider",
          min: 10,
          max: 400,
          step: 1,
          start: 20,
          unit: "trades",
          answer: 93,
          tolerance: 10,
          feedback: [
            { from: 10, to: 50, text: "Too few. At 50 trades the range still runs from 46.4% to 73.6%, so a coin flip fits." },
            { from: 51, to: 82, text: "Closer, but not yet. At 80 trades the bottom edge is 49.3%, still below 50%." },
            { from: 83, to: 103, text: "Right around there: the bottom edge passes 50% at 93 trades." },
            { from: 104, to: 200, text: "Past it. The bottom edge cleared 50% at 93 trades; at 100 the range is 50.4% to 69.6%." },
            { from: 201, to: 400, text: "Far past it. The bottom edge cleared 50% at 93 trades; at 400 the range is 55.2% to 64.8%." },
          ],
        },
        reveal: "The bottom edge of the range is 49.99% at 92 trades and 50.04% at 93. Below about 93 trades, a 60% result can't rule out a method with no edge.",
        concept: "sample-size",
      },
      {
        kind: "match",
        title: "Big sample or single trade?",
        prompt: "Some questions need hundreds of trades. Others can be answered on one trade. Sort them.",
        pairs: [
          { left: "Does this method make money?", right: "Hundreds of trades", wrong: "One trade can win or lose by luck. Whether a method makes money shows only over hundreds." },
          { left: "Did I enter only when my rules said so?", right: "This trade alone", wrong: "You can check this on each trade, right after it. No sample needed." },
          { left: "Is my win rate really 60%?", right: "Hundreds of trades", wrong: "A win rate needs many trades: at 20, 60% is a range from about 38% to 82%." },
          { left: "Did I set the stop before entering?", right: "This trade alone", wrong: "Whether the stop came first is a fact about this trade. Check it now." },
          { left: "Is method A better than method B?", right: "Hundreds of trades", wrong: "Comparing methods needs large samples of both. At 20 trades, luck can flip the order." },
        ],
        correct: "Edges need big samples. The process can be checked on every single trade, starting with the next one.",
        concept: "sample-size",
      },
    ],
    check: ["q-0.2.4-1", "q-0.2.4-2", "q-0.2.4-3"],
    recap: {
      takeaways: [
        "A win rate from 20 trades is a range: 60% fits anything from about 38.5% to 81.5%.",
        "The range narrows slowly: four times the trades halves its width. About 93 trades separate 60% from 50%.",
        "Judge methods on hundreds of trades; judge each single trade on whether it followed the plan.",
      ],
      next: "Next, 0.2.5: how coin flips draw trends and levels on a chart, and how to test a pattern against chance.",
    },
  },
};

// ─── 0.2.5 · Randomness draws patterns ─────────────────────────────────────

const L_0_2_5: Lesson = {
  id: "0.2.5",
  title: "Randomness draws patterns",
  topic: "technical_analysis",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Coin flips draw trends, ranges and levels, so a pattern earns trust only by beating random data after costs.",
  objectives: [
    "Describe a random walk and why it produces trends, ranges and turning points.",
    "Admit when a chart can't be told apart from a random one.",
    "Ask how often a pattern works compared with random data before trusting it.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "check", ref: "technical_analysis", label: "Technical analysis check" },
  ],
  script: {
    unit: "0.2",
    courseId: "0.2.5",
    bridge: "In 0.2.4 you saw 20 trades make a method with no edge look good. Charts fool you the same way: here coin flips draw trends, ranges and levels that look real.",
    hook: {
      prompt: "Here are 60 hours of LABX. Was this chart made by a real market, or by flipping coins?",
      figure: {
        kind: "chart",
        chart: { candles: WALK_HOOK },
        steps: [{ text: "Each candle is one hour of LABX; you'll learn to read them in 1.2.1." }],
      },
      control: {
        kind: "choice",
        choices: [
          { id: "market", label: "A real market: the moves look too purposeful" },
          { id: "coins", label: "Coin flips" },
          { id: "cant", label: "Can't tell from the chart" },
        ],
      },
      compare: "You picked {yours}. Every candle came from coin flips: five flips of 0.20 per hour. From the chart alone, 'Can't tell' was the honest reading.",
      concept: "random-walk",
    },
    learn: [
      {
        kind: "explain",
        text: "In a [[random-walk|random walk]], each step up or down is decided by chance, like a coin flip. The walk has no memory: the next step doesn't care what the last ten did. You'll meet that idea again in 1.7.3.",
      },
      {
        kind: "figure",
        title: "Two hundred coin flips",
        text: "Each hour here is five coin flips: on each one, price moves 0.20 up or down.",
        figure: {
          kind: "chart",
          chart: { candles: WALK_200 },
          steps: [
            { text: "Twenty flips: four hourly candles. Nothing to see yet.", visible: 4 },
            { text: "Two hundred flips: forty candles. It starts to look like a market.", visible: 40 },
            {
              text: "Hours 6 to 14 climb from 99.40 to 104.40: a 'trend', made of coin flips.",
              layers: [{ kind: "path", points: [{ index: 4, price: 99.4 }, { index: 13, price: 104.4 }], role: "concept", label: "TREND?" }],
            },
            {
              text: "Hours 19 to 28 stay between 104.60 and 105.60, topping out three times. Then a 'breakout' above it.",
              layers: [{ kind: "zone", from: 104.6, to: 105.6, role: "concept", label: "RANGE?" }],
            },
          ],
        },
        concept: "random-walk",
      },
      {
        kind: "predict",
        title: "Find a level",
        prompt: "Here's the hook chart again. Tap a price where it keeps turning.",
        control: {
          kind: "tap",
          chart: { candles: WALK_HOOK },
          zones: [
            { id: "top", label: "106.80–107.60", from: 106.8, to: 107.6, feedback: "Price turned down here three times: hours 41, 46 and 51." },
            { id: "upper", label: "105.60–106.00", from: 105.6, to: 106.0, feedback: "Price turned up here three times: hours 43, 50 and 58." },
            { id: "middle", label: "103.00–103.40", from: 103.0, to: 103.4, feedback: "Price turned down here three times: hours 11, 14 and 18." },
            { id: "pivot", label: "102.40–102.60", from: 102.4, to: 102.6, feedback: "Price turned here three times, both ways: hours 4, 16 and 25." },
            { id: "low", label: "101.20–101.80", from: 101.2, to: 101.8, feedback: "Price turned up here three times: hours 8, 23 and 26." },
          ],
        },
        figure: {
          kind: "chart",
          chart: { candles: WALK_HOOK },
          steps: [{ text: "Five bands, three turns each. All of them drawn by coin flips.", layers: WALK_BANDS }],
        },
        reveal: "Wherever you looked, price turned about three times. This chart is pure coin flips. Turns at a level happen by chance too: a level is useful only if it works more often than on random data.",
        concept: "random-walk",
      },
      {
        kind: "explain",
        title: "Compared with what?",
        text: "So count against chance. A popular rule says chart [[gap|gaps]], jumps that skip prices, 'fill'. In one test they were revisited 83.4% of the time; random levels the same distance away, 83.5%. In currency markets, price bounced at published support and resistance levels (floors and ceilings) 60.8% of the time, against 56.2% at random levels (Osler). More in 1.5.5.",
      },
      {
        kind: "order",
        title: "An honest test",
        prompt: "Put the steps of an honest pattern test in order.",
        items: ["Write the pattern as a rule", "Count how often it works", "Count how often it 'works' on random charts", "Keep it only if the difference survives costs"],
        explain: "A pattern earns trust only by beating random data by more than it costs to trade. Most of the work is the comparison.",
        concept: "random-walk",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Before you trust a pattern, ask: more often than chance, after costs?",
      },
      {
        kind: "reveal",
        title: "What comes next?",
        prompt: "Forty hours of coin flips, rising from 100.00 to 108.80. What will the next 20 hours do?",
        chart: { candles: WALK_NEXT, visible: 40 },
        choices: [
          { id: "up", label: "Keep climbing: the trend is strong", feedback: "The next 20 hours went sideways, then slipped. The rise gave the flips no momentum." },
          { id: "down", label: "Fall back: it has gone too far", feedback: "It did slip, from 108.80 to 106.40, but not because it was due. It could as easily have kept climbing." },
          { id: "unknown", label: "No way to know: each flip is 50/50", feedback: "Right. The walk has no memory, so the rise said nothing about the next hours." },
        ],
        answer: "unknown",
        after: "Hours 41 to 49 drifted sideways near 108.50, then price slipped to 106.40 by hour 60. Neither move was 'due': each flip ignored the ones before it.",
        concept: "random-walk",
      },
      {
        kind: "match",
        title: "Chance or tested?",
        prompt: "Sort each claim: could chance alone explain it, or has it been tested against chance?",
        pairs: [
          { left: "A level held three times this week", right: "Could be chance", wrong: "Random charts show levels holding two or three times all the time. Three holds aren't a test." },
          { left: "A pattern that won 4 of its last 5", right: "Could be chance", wrong: "Five cases is a tiny sample. A coin-flip rule wins 4 or more of 5 about 19% of the time." },
          { left: "A rule that beat 1,000 random charts, after costs", right: "Tested against chance", wrong: "This rule was compared with random charts and still came out ahead after costs. That's the honest test." },
          { left: "A chart in an ad with the pattern circled", right: "Could be chance", wrong: "One hand-picked chart shows the pattern can appear, not that it works more often than chance." },
        ],
        correct: "Only one claim was tested against chance. Evidence that skips the comparison with random data looks like the other three.",
        concept: "random-walk",
      },
    ],
    check: ["q-0.2.5-1", "q-0.2.5-2", "q-0.2.5-3"],
    recap: {
      takeaways: [
        "A random walk is coin flips with no memory, yet it draws trends, ranges and levels.",
        "If a chart can't be told apart from a random one, 'can't tell' is the honest answer.",
        "Before trusting a pattern, ask: does it work more often than on random data, after costs?",
      ],
      next: "Next, 0.2.6: how luck makes star traders, and what evidence actually points to skill.",
    },
  },
};

// ─── 0.2.6 · Luck or skill? ────────────────────────────────────────────────

const L_0_2_6: Lesson = {
  id: "0.2.6",
  title: "Luck or skill?",
  topic: "psychology",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "In a large group, luck alone makes stars; skill shows only as a consistent process over many trades, after costs.",
  objectives: [
    "Calculate how many people in a large group get impressive results by luck alone.",
    "Explain how showing only the winners makes luck look like skill.",
    "List the evidence that separates skill from luck: process, sample size, results after costs.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "psychology", label: "Psychology check" }],
  script: {
    unit: "0.2",
    courseId: "0.2.6",
    bridge: "In 0.2.5 coin flips drew convincing charts. Here they make convincing traders: among 1,000 people flipping coins, some look like stars. The sample sizes from 0.2.4 help you tell luck from skill.",
    hook: {
      prompt: "1,000 people 'predict' LABX for 10 days by flipping a coin. How many get at least 8 days right by luck alone?",
      control: { kind: "slider", min: 0, max: 200, step: 1, start: 0, unit: "people", answer: 55, tolerance: 10 },
      compare: "You guessed {yours}. About 55 of the 1,000 (5.47%) get 8 or more days right by pure luck.",
      concept: "luck-vs-skill",
    },
    learn: [
      {
        kind: "explain",
        text: "Over short runs, luck dominates results: a few lucky calls look just like skill. Skill shows in a consistent process, over a large sample. To see why, follow 1,000 people who 'predict' LABX for 10 days by flipping a coin.",
      },
      {
        kind: "figure",
        title: "1,000 coin-flippers",
        text: "How many of the 1,000 get each number of days right, out of 10.",
        figure: {
          kind: "bars",
          bars: [
            { label: "0 days", value: 1, role: "neutral" },
            { label: "1 day", value: 10, role: "neutral" },
            { label: "2 days", value: 44, role: "neutral" },
            { label: "3 days", value: 117, role: "neutral" },
            { label: "4 days", value: 205, role: "neutral" },
            { label: "5 days", value: 246, role: "neutral" },
            { label: "6 days", value: 205, role: "neutral" },
            { label: "7 days", value: 117, role: "neutral" },
            { label: "8 days", value: 44, role: "accent" },
            { label: "9 days", value: 10, role: "accent" },
            { label: "10 days", value: 1, role: "accent" },
          ],
          steps: [
            "0 to 3 days right: 172 people.",
            "4 to 6 right: 656 people. Most land near 5, as coin flips should.",
            "7 right: 117. Then 8, 9 or 10 right: 55 'stars', made by luck alone.",
          ],
        },
        concept: "luck-vs-skill",
      },
      {
        kind: "predict",
        title: "The stars' next 10 days",
        prompt: "The 55 'stars' keep flipping coins for 10 more days. How many days will they get right, on average?",
        control: {
          kind: "choice",
          choices: [
            { id: "eight", label: "About 8: they've shown they're good", feedback: "Their first 10 days were luck, and luck doesn't carry over. They average about 5.0, like everyone." },
            { id: "five", label: "About 5, like everyone else", feedback: "Right. Coin flips don't remember who was lucky last time." },
            { id: "fewer", label: "Fewer than 5: their luck runs out", feedback: "Luck doesn't run out any more than it builds up. Each flip is still 50/50, so they average 5.0." },
          ],
          answer: "five",
        },
        figure: {
          kind: "bars",
          unit: " right",
          bars: [
            { label: "Stars: first 10 days", value: 8.2, role: "accent" },
            { label: "Stars: next 10 days", value: 5.0, role: "neutral" },
          ],
          steps: ["The stars averaged 8.2 days right. Next time: 5.0, and only about 3 repeat 8 or more."],
        },
        reveal: "Their next 10 days look like everyone else's. That's what luck does: it doesn't stick to the people it favoured.",
        concept: "luck-vs-skill",
      },
      {
        kind: "explain",
        title: "Only the winners speak",
        text: "Now imagine you see only the 55, in ads or on social media. The 945 who did worse stay silent. Coin flips now look like talent. That's [[survivorship-bias]]: judging from the winners who remain while the many who failed are out of sight.",
      },
      {
        kind: "match",
        title: "Read the clues",
        prompt: "Each clue points somewhere. Match it to what it suggests.",
        columns: ["Clue", "What it suggests"],
        pairs: [
          { left: "Hundreds of trades with the same rules", right: "Could be skill", wrong: "A large sample under fixed rules is exactly what luck struggles to fake. It's the start of evidence for skill." },
          { left: "One great month, shown in an ad", right: "Could be luck", wrong: "One month is a tiny sample, and the ad picked it. Among many traders, someone always has a great month." },
          { left: "Results after costs, next to the benchmark", right: "A fair comparison", wrong: "Costs taken off and a benchmark beside it: that's how results should be compared." },
          { left: "Only the winning trades shown", right: "Survivorship", wrong: "Showing only winners hides everything that failed. That's survivorship bias." },
        ],
        correct: "Skill needs a large sample, fixed rules and results after costs. Luck needs only a good month and a camera.",
        concept: "survivorship-bias",
      },
      {
        kind: "callout",
        tone: "key",
        text: "You control your process, not your luck. That's why your scores here grade the process.",
      },
      {
        kind: "predict",
        title: "Next year's ranking",
        prompt: "1,000 traders who trade at random finish a year. How many of this year's top 10 will make next year's top 100?",
        control: {
          kind: "slider",
          min: 0,
          max: 10,
          step: 1,
          start: 0,
          unit: "traders",
          feedback: [
            { from: 0, to: 0, text: "Possible: with pure luck, none of them make it in about a third of years. The average is 1." },
            { from: 1, to: 1, text: "That's the average for pure luck: each has a 100-in-1,000 chance." },
            { from: 2, to: 4, text: "More than luck predicts. A random top 10 puts about 1 in next year's top 100, on average." },
            { from: 5, to: 10, text: "That would take real skill. With luck alone each has a 1-in-10 chance, so about 1 of the 10 makes it." },
          ],
        },
        reveal: "For random traders, next year's rank ignores this year's. Each of the 10 has a 100-in-1,000 chance of the top 100, so on average 1 makes it; in about a third of years, none do.",
        concept: "luck-vs-skill",
      },
      {
        kind: "predict",
        title: "Why the stars fade",
        prompt: "A year later, this year's top 10 random traders are scattered across the ranking. Which explanation fits?",
        control: {
          kind: "choice",
          choices: [
            { id: "careless", label: "They got careless after a great year", feedback: "Nothing changed in how they traded: they were random both years. The reshuffle needs no story." },
            { id: "luck", label: "Their results were luck; the ranking reshuffles", feedback: "Right. With no skill, last year's rank predicts nothing about this year's." },
            { id: "market", label: "The market turned against their style", feedback: "They had no style: every trade was random. Coin flips can't fall out of favour." },
          ],
          answer: "luck",
        },
        reveal: "When results are luck, rankings reshuffle every year. A trader who stays near the top year after year, with the same rules over many trades, is where skill becomes the better explanation.",
        concept: "luck-vs-skill",
      },
    ],
    check: ["q-0.2.6-1", "q-0.2.6-2", "q-0.2.6-3"],
    recap: {
      takeaways: [
        "Among 1,000 coin-flippers, about 55 get 8 of 10 days right. Luck alone makes stars.",
        "Seeing only the winners, in ads or online, makes luck look like skill: survivorship bias.",
        "Skill shows as the same process over many trades, with results after costs, next to the benchmark.",
      ],
      next: "Next comes the Unit 0.2 checkpoint, then unit 1.1, Prices, quotes and costs, starting with 1.1.1: bid, ask and the spread.",
    },
  },
};

// ─── Check questions ───────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 0.2.1
  {
    id: "q-0.2.1-1",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 1,
    scenario: "Mara buys LABX with a stop set before entry, risking 1% of her account, exactly as her plan says. Price falls to the stop and she loses 100.00 vUSD.",
    prompt: "Which box does this decision belong in?",
    options: [
      { id: "a", label: "Deserved success", rationale: "Deserved success needs a good outcome too. The decision was sound, but the result was a loss." },
      { id: "b", label: "Bad luck" },
      { id: "c", label: "Poetic justice", rationale: "Poetic justice is a poor decision punished. Hers followed the plan with a defined risk, so it wasn't poor." },
      { id: "d", label: "Dumb luck", rationale: "Dumb luck is a poor decision that turned out well. Here the decision was sound and the outcome was a loss." },
    ],
    correct: "b",
    explanation:
      "Judge the decision first: a planned entry, a stop set in advance and 1% risk make it sound. The outcome was a loss. A sound decision with a bad outcome is bad luck, and the right response is to keep the process.",
    lesson: "0.2.1",
    concepts: ["outcome-bias", "decision-quality"],
  },
  {
    id: "q-0.2.1-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why can't a single result tell you how good a decision was?",
    options: [
      { id: "a", label: "Because results are random and decisions never affect them", rationale: "Decisions do shift the odds; that's why the process matters. One result just mixes the decision's effect with luck you can't separate." },
      { id: "b", label: "Because only losses carry information; wins are always luck", rationale: "Wins and losses both mix decision and luck. Treating only losses as informative is outcome thinking turned upside down." },
      { id: "c", label: "Because each result mixes the decision with luck, and one result can't separate the two" },
      { id: "d", label: "Because a decision can only be judged after 10 results", rationale: "No count of results grades a decision. You judge it by what was known and reasoned at the time." },
    ],
    correct: "c",
    explanation:
      "A result comes from the decision and from luck together. A good decision can lose and a poor one can win, so one result can't show which part did the work. Judge the decision by what was known and how it was reasoned when it was made.",
    lesson: "0.2.1",
    concepts: ["outcome-bias"],
    hints: ["Think about what produces a result.", "A result has two ingredients. Can one result show how much came from each?"],
  },
  {
    id: "q-0.2.1-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Dan reads a tip on a forum, buys LABX at ten times his usual size with no stop, and says 'it can only go up'. Two days later he's up 900.00 vUSD and says the trade proves he has a feel for the market.",
    prompt: "What is the most accurate description?",
    options: [
      { id: "a", label: "Deserved success: the profit shows the tip was good", rationale: "The profit is the outcome. The decision broke every rule: a tip, ten times the size, no stop. That's a poor decision." },
      { id: "b", label: "Bad luck: he should have taken even more profit", rationale: "Bad luck is a sound decision with a bad result. Here the result was good and the decision was poor." },
      { id: "c", label: "Can't tell until he does it again", rationale: "Repeating it would only add outcomes. The decision can be judged now, from what he knew and did: a tip, oversized, no stop." },
      { id: "d", label: "Dumb luck: a poor decision with a good outcome" },
    ],
    correct: "d",
    explanation:
      "A tip, ten times the usual size and no stop make the decision poor, whatever happened next. The good outcome makes it dumb luck. Reading it as skill invites the same bet again: that's outcome bias at work.",
    lesson: "0.2.1",
    concepts: ["outcome-bias", "luck-vs-skill"],
    hints: ["Grade the decision before you look at the result.", "Was the decision sound, given what Dan knew? Then add the outcome to find the box."],
  },
  // 0.2.2
  {
    id: "q-0.2.2-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 1,
    prompt: "A game pays 8.00 with a 30% chance and loses 4.00 with a 70% chance. What is its expected value per play, in vUSD?",
    numeric: { answer: -0.4, tolerance: 0.001, unit: "vUSD" },
    explanation:
      "Wins: 0.30 × 8.00 = 2.40. Losses: 0.70 × 4.00 = 2.80. EV = 2.40 − 2.80 = −0.40 per play. Each win is twice the size of each loss, but losses come more than twice as often.",
    lesson: "0.2.2",
    concepts: ["expected-value"],
    hints: ["EV = chance of a win × the win − chance of a loss × the loss.", "Wins: 0.30 × 8.00. Losses: 0.70 × 4.00.", "2.40 − 2.80 = ?"],
    vary: {
      fields: { p: [20, 80, 10], win: [2, 20, 1], loss: [2, 20, 1] },
      constraints: ["round(pct(p) * win - (1 - pct(p)) * loss, 2) != 0"],
      answer: "round(pct(p) * win - (1 - pct(p)) * loss, 2)",
      prompt: "A game pays {win:2} with a {p}% chance and loses {loss:2} with a {100 - p}% chance. What is its expected value per play, in vUSD?",
      explanation: "Wins: {pct(p):2} × {win:2} = {pct(p) * win:2}. Losses: {1 - pct(p):2} × {loss:2} = {(1 - pct(p)) * loss:2}. EV = {pct(p) * win:2} − {(1 - pct(p)) * loss:2} = {answer:2} per play.",
      hint: "{pct(p) * win:2} − {(1 - pct(p)) * loss:2} = ?",
    },
  },
  {
    id: "q-0.2.2-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "A method wins 90% of its trades. Each win makes 20.00 vUSD; each loss costs 250.00. What can you say about it?",
    options: [
      { id: "a", label: "It's a strong method: it wins nine times in ten", rationale: "That judges by how often it wins, not by how much. One loss wipes out more than twelve wins, so the average is negative." },
      { id: "b", label: "It breaks even, because the wins and losses balance out", rationale: "Balance needs the weighted amounts to match: 0.9 × 20.00 = 18.00 against 0.1 × 250.00 = 25.00. They don't." },
      { id: "c", label: "It loses 7.00 per trade on average, despite winning 90% of the time" },
      { id: "d", label: "You can't say anything without knowing the next trade", rationale: "EV doesn't predict the next trade, but it does describe the average over many. Here that average is negative." },
    ],
    correct: "c",
    explanation:
      "EV = 0.90 × 20.00 − 0.10 × 250.00 = 18.00 − 25.00 = −7.00 per trade. A high win rate says how often you win, not whether you make money. Small, frequent wins and rare, large losses can lose on average.",
    lesson: "0.2.2",
    concepts: ["expected-value"],
    hints: ["Don't stop at the win rate. Weigh each amount by its chance.", "Wins: 0.90 × 20.00. Losses: 0.10 × 250.00. Which is bigger?"],
  },
  {
    id: "q-0.2.2-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "Game A pays +15.00 or −10.00 on a coin flip: an expected value of +2.50 per play. You play it once and lose 10.00. A friend says: 'So much for your expected value.'",
    prompt: "What's the best reply?",
    options: [
      { id: "a", label: "Expected value describes the average over many plays; any single play can still lose" },
      { id: "b", label: "Fair point: the expected value was wrong", rationale: "One loss doesn't test an average. A coin-flip game loses half its plays; +2.50 describes the average over many." },
      { id: "c", label: "The next play is now more likely to win, so I'll double the stake", rationale: "Each flip is independent: a loss doesn't make a win due. Doubling after losses raises the risk and leaves the odds unchanged." },
      { id: "d", label: "I should stop: a positive game shouldn't lose on the first play", rationale: "Half of all single plays of this game lose. Stopping after one loss judges the game on a sample of one." },
    ],
    correct: "a",
    explanation:
      "+2.50 is what game A returns per play on average, over many plays. A single play is either +15.00 or −10.00, each half the time. One loss is normal and says nothing against the expected value.",
    lesson: "0.2.2",
    concepts: ["expected-value", "variance"],
    hints: ["What does expected value describe: the next play, or many plays?", "How often does a single play of game A lose?"],
  },
  // 0.2.3
  {
    id: "q-0.2.3-1",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 1,
    prompt: "You flip a fair coin 100 times. How likely is it that, somewhere in the sequence, you get at least 5 tails in a row?",
    options: [
      { id: "a", label: "About 3%: five in a row is rare", rationale: "3.1% is the chance for five given flips. In 100 flips a run can start almost anywhere, so it shows up far more often." },
      { id: "b", label: "About 25%", rationale: "That underestimates how many places 100 flips give a run to start. The exact figure is about 81%." },
      { id: "c", label: "Exactly 50%, as with any coin flip", rationale: "50% is the chance of one flip. A run of five needs many flips in a row, and 100 flips give it many places to start." },
      { id: "d", label: "About 81%" },
    ],
    correct: "d",
    explanation:
      "Five given flips all land tails 0.5 × 0.5 × 0.5 × 0.5 × 0.5 ≈ 3.1% of the time. But a run can start at almost any of the 100 flips, so at least one run of five or more shows up in about 81% of sequences. Long streaks are normal.",
    lesson: "0.2.3",
    concepts: ["streaks-and-runs"],
  },
  {
    id: "q-0.2.3-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "A method wins 40% of its trades, and each trade is independent. What's the chance that the next 4 trades all lose, in %?",
    numeric: { answer: 12.96, tolerance: 0.1, unit: "%" },
    explanation:
      "Each trade loses with a 0.60 chance. Four losses in a row: 0.60 × 0.60 × 0.60 × 0.60 = 0.1296, about 13.0%. That's for four given trades; somewhere in 100 trades, a run of four is close to certain (99.9%).",
    lesson: "0.2.3",
    concepts: ["streaks-and-runs"],
    hints: ["The chance of a loss is 100% minus the win rate.", "Independent trades: multiply the chances.", "0.60 × 0.60 × 0.60 × 0.60 = ?"],
    vary: {
      fields: { w: [30, 70, 5] },
      answer: "round((1 - pct(w)) * (1 - pct(w)) * (1 - pct(w)) * (1 - pct(w)) * 100, 2)",
      prompt: "A method wins {w}% of its trades, and each trade is independent. What's the chance that the next 4 trades all lose, in %?",
      explanation:
        "Each trade loses with a {1 - pct(w):2} chance. Four losses in a row: {1 - pct(w):2} × {1 - pct(w):2} × {1 - pct(w):2} × {1 - pct(w):2} = {answer:2}%. That's for four given trades; somewhere in 100 trades, a run of four is far more likely.",
      hint: "{1 - pct(w):2} × {1 - pct(w):2} × {1 - pct(w):2} × {1 - pct(w):2} = ?",
    },
  },
  {
    id: "q-0.2.3-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Your method has won 45% of its last 300 trades, and its average win is about twice its average loss. It has just lost 6 trades in a row. Every one of them followed your rules.",
    prompt: "What does the streak tell you?",
    options: [
      { id: "a", label: "The method has stopped working; switch to a new one", rationale: "At a 45% win rate, a run of six losses somewhere in 100 trades is about 73% likely. The streak alone can't show that anything changed." },
      { id: "b", label: "On its own, very little: runs like this are normal for this method. Keep checking that the rules are followed" },
      { id: "c", label: "A win is now due, so the next trade should be bigger", rationale: "Trades are independent: six losses don't make a win more likely. Sizing up after losses adds risk exactly when you're under strain." },
      { id: "d", label: "Six losses prove the first 300 trades were luck", rationale: "Six trades can't overturn 300. A short run of losses is expected even when a method works." },
    ],
    correct: "b",
    explanation:
      "At a 45% win rate, at least one run of six losses somewhere in 100 trades is about 73% likely. A streak is what randomness looks like, so on its own it doesn't show the method stopped working, and it doesn't make a win due. What you can check is the process.",
    lesson: "0.2.3",
    concepts: ["streaks-and-runs", "variance"],
    hints: ["A method that loses 55% of the time: how often would six losses in a row turn up?", "A streak alone: evidence of change, or normal randomness?"],
  },
  // 0.2.4
  {
    id: "q-0.2.4-1",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "A method won 12 of its first 20 trades (60%). Which range of true win rates fits that result?",
    options: [
      { id: "a", label: "About 58% to 62%", rationale: "Far too narrow for 20 trades. Each single win or loss moves the result by 5 points." },
      { id: "b", label: "About 38% to 82%" },
      { id: "c", label: "Exactly 60%", rationale: "60% is what happened in this sample, not the method's true rate. Another 20 trades could easily show 45% or 70%." },
      { id: "d", label: "About 55% to 65%", rationale: "That's roughly the range after 400 trades. At 20 trades the plausible range is more than four times as wide." },
    ],
    correct: "b",
    explanation:
      "With only 20 trades, the plausible range around 60% runs from about 38.5% to 81.5%. That includes coin-flip methods (50%) and strong ones. The range narrows only as trades add up: about 50.4–69.6% at 100 trades.",
    lesson: "0.2.4",
    concepts: ["sample-size"],
  },
  {
    id: "q-0.2.4-2",
    topic: "scenario_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "A new method won 7 of its first 10 trades. You're thinking of doubling your risk per trade to make the most of it.",
    prompt: "What does the evidence support?",
    options: [
      { id: "a", label: "Double the risk: 70% is a clear edge", rationale: "Ten trades give a plausible range from about 42% to 98%. A coin-flip method wins 7 or more of 10 about 17% of the time." },
      { id: "b", label: "Drop the method: 7 of 10 is too good to be real", rationale: "A small sample can't prove it's bad either. The right response is the same: keep the risk fixed and gather more trades." },
      { id: "c", label: "Double the risk only for the next 10 trades, then decide", rationale: "Raising risk before the evidence exists bets more on an untested idea. Twenty trades still leave a wide range." },
      { id: "d", label: "Keep the risk the same and keep collecting trades: 10 can't show an edge" },
    ],
    correct: "d",
    explanation:
      "Seven of ten is a sample of ten. The plausible range runs from about 42% to 98%, and a pure coin flip wins 7 or more of 10 about 17% of the time. Keep the risk fixed and judge the method once it has hundreds of trades.",
    lesson: "0.2.4",
    concepts: ["sample-size"],
    hints: ["How many trades is this result based on?", "How often might a coin-flip method win 7 of 10?"],
  },
  {
    id: "q-0.2.4-3",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "You've made 8 trades with a new method. What can those 8 trades fairly tell you?",
    options: [
      { id: "a", label: "Whether the method has an edge", rationale: "Eight trades leave a plausible range dozens of points wide. An edge takes hundreds of trades to show." },
      { id: "b", label: "Your true win rate, to within a few percent", rationale: "Each trade moves an 8-trade win rate by 12.5 points. A few percent of precision needs hundreds of trades." },
      { id: "c", label: "Whether you followed your plan on each trade" },
      { id: "d", label: "Nothing at all, so there's no point reviewing them", rationale: "They can't measure an edge, but each one can be checked against the plan: entry rules, stop, size." },
    ],
    correct: "c",
    explanation:
      "Eight trades are far too few to measure an edge or a win rate. But each single trade can be judged on its process: did it follow the entry rules, have a stop and stay within the risk limit? That's what a small sample can fairly tell you.",
    lesson: "0.2.4",
    concepts: ["sample-size", "decision-quality"],
    hints: ["What can be checked on one trade, and what needs many?"],
  },
  // 0.2.5
  {
    id: "q-0.2.5-1",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "What is a random walk?",
    options: [
      { id: "a", label: "A market with no trends or ranges", rationale: "Random walks draw trends and ranges all the time, by chance. That's why a pattern alone doesn't prove anything." },
      { id: "b", label: "A price path where each step up or down is decided by chance" },
      { id: "c", label: "A chart that always returns to where it started", rationale: "A random walk has no pull back to its start. It can drift far away and stay there." },
      { id: "d", label: "A trend that reverses at random times", rationale: "There is no underlying trend in a random walk. Each step is independent; trends only appear by chance." },
    ],
    correct: "b",
    explanation:
      "In a random walk each step is like a coin flip, with no memory of earlier steps. It still draws trends, ranges and levels that look meaningful, which is why a chart alone can't prove a pattern.",
    lesson: "0.2.5",
    concepts: ["random-walk"],
  },
  {
    id: "q-0.2.5-2",
    topic: "technical_analysis",
    kind: "scenario",
    difficulty: 2,
    scenario: "A friend shows you three LABX charts where price bounced off the same kind of level, and says: 'It worked all three times. This pattern is reliable.'",
    prompt: "What's the most useful response?",
    options: [
      { id: "a", label: "Three out of three is 100%: it's reliable", rationale: "Three cases are a tiny sample, chosen after the fact. Random charts also bounce off levels two or three times." },
      { id: "b", label: "Patterns never work, so ignore it", rationale: "Some levels have shown a small real effect. The point isn't to reject patterns but to test them against chance." },
      { id: "c", label: "How often does it 'work' on random charts, and does the difference survive costs?" },
      { id: "d", label: "Try it with a bigger size to see if it keeps working", rationale: "That tests the idea with money before there's any evidence. Count it on many charts, random ones included, first." },
    ],
    correct: "c",
    explanation:
      "Random walks draw bounces at levels by chance, so three hand-picked examples prove little. The useful question is how often the pattern works compared with random data, over many cases, after costs.",
    lesson: "0.2.5",
    concepts: ["random-walk", "sample-size"],
    hints: ["Could a coin-flip chart show the same three bounces?", "Compare with what happens by chance, over many cases."],
  },
  {
    id: "q-0.2.5-3",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "Before you trust a chart pattern, which question matters most?",
    options: [
      { id: "a", label: "Does it work more often than on random data, after costs?" },
      { id: "b", label: "Does it look clean on the chart?", rationale: "Random walks draw clean-looking patterns too. Looks can't separate a real effect from chance." },
      { id: "c", label: "Have experienced traders recommended it?", rationale: "Recommendations may rest on remembered winners. The test is a count against chance, not who suggests it." },
      { id: "d", label: "Did it work the last time you saw it?", rationale: "One case is a sample of one. A pattern can 'work' once by chance on any chart." },
    ],
    correct: "a",
    explanation:
      "Any pattern can work sometimes by chance. In one test, chart gaps 'filled' 83.4% of the time, but random levels did as well (83.5%). A pattern earns trust only if it beats random data by enough to survive costs.",
    lesson: "0.2.5",
    concepts: ["random-walk", "base-rates"],
    hints: ["Random charts draw patterns too. What would you compare against?"],
  },
  // 0.2.6
  {
    id: "q-0.2.6-1",
    topic: "psychology",
    kind: "numeric",
    difficulty: 1,
    prompt: "500 people each guess LABX's direction for 10 days by flipping a coin. How many would you expect to get all 10 days right? Round to 1 decimal.",
    numeric: { answer: 0.5, tolerance: 0.1, unit: "people" },
    explanation:
      "Each person has a 1 in 1,024 chance of 10 right (0.5 multiplied by itself 10 times). 500 ÷ 1,024 ≈ 0.5: about one perfect record for every two groups this size, from luck alone.",
    lesson: "0.2.6",
    concepts: ["luck-vs-skill"],
    hints: ["One day right by luck: 1 in 2. Ten days in a row: multiply.", "0.5 multiplied by itself 10 times is 1 in 1,024.", "500 ÷ 1,024 = ?"],
    vary: {
      fields: { people: [200, 5000, 100] },
      answer: "round(people / 1024, 1)",
      prompt: "{people} people each guess LABX's direction for 10 days by flipping a coin. How many would you expect to get all 10 days right? Round to 1 decimal.",
      explanation: "Each person has a 1 in 1,024 chance of 10 right (0.5 multiplied by itself 10 times). {people} ÷ 1,024 ≈ {answer:1}, from luck alone.",
      hint: "{people} ÷ 1,024 = ?",
    },
  },
  {
    id: "q-0.2.6-2",
    topic: "psychology",
    kind: "mcq",
    difficulty: 2,
    prompt: "What is survivorship bias?",
    options: [
      { id: "a", label: "Holding on to losing trades so they can survive", rationale: "That describes avoiding losses, a different trap. Survivorship is about which results you get to see." },
      { id: "b", label: "The tendency of skilled traders to last longer", rationale: "That assumes the survivors are skilled. The bias is that survival alone can come from luck when many try." },
      { id: "c", label: "Judging from the winners you can see, while the many who failed are out of sight" },
      { id: "d", label: "Preferring methods that have survived many years", rationale: "Long testing is good evidence. The bias is seeing only the survivors and forgetting how many started." },
    ],
    correct: "c",
    explanation:
      "When many people try, some get great results by luck. If only those are shown, in ads or on social media, chance looks like talent. Ask how many started, not just how the winners did.",
    lesson: "0.2.6",
    concepts: ["survivorship-bias"],
    hints: ["Think about who you get to see, and who you don't."],
  },
  {
    id: "q-0.2.6-3",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario: "An online trader posts a screenshot of a +40% month and sells a course on his method. He says he has 'never had a losing month'.",
    prompt: "Which evidence would best help you tell skill from luck?",
    options: [
      { id: "a", label: "More screenshots of his best months", rationale: "Chosen winners are the problem, not the proof. Best months say nothing about the months you don't see." },
      { id: "b", label: "How many followers and students he has", rationale: "Popularity measures marketing, not skill. Many followers can come from a few lucky months, shown well." },
      { id: "c", label: "How confident he sounds about next month", rationale: "Confidence isn't evidence. Lucky and skilled traders can sound equally sure." },
      { id: "d", label: "Hundreds of trades under the same rules, results after costs, compared with the benchmark" },
    ],
    correct: "d",
    explanation:
      "Skill shows as a consistent process over a large sample, with results after costs and next to the benchmark. A single great month, shown in an ad, fits luck just as well: among many traders, someone always has one.",
    lesson: "0.2.6",
    concepts: ["luck-vs-skill", "survivorship-bias"],
    hints: ["What would a lucky trader be unable to fake?", "Think process, sample size and costs."],
  },
];

// ─── Glossary terms introduced in 0.2 ──────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "outcome-bias",
    term: "Outcome bias",
    definition: "Judging a decision by how it turned out rather than by how it was made: the information and reasoning available at the time.",
    plain: "Calling a choice good because it worked, or bad because it didn't.",
    related: ["decision-quality", "cognitive-bias", "hindsight-bias"],
    lesson: "0.2.1",
  },
  {
    id: "expected-value",
    term: "Expected value",
    definition: "The average result of a bet over many plays: each outcome times its probability, added up.",
    plain: "What a game pays per play, on average, if you play it many times.",
    related: ["probability", "expectancy", "variance"],
    lesson: "0.2.2",
    aka: ["EV"],
  },
  {
    id: "probability",
    term: "Probability",
    definition: "How likely something is, from 0 (never) to 1 (certain), often written as a percentage.",
    plain: "The chance that something happens: 0.5, or 50%, is a coin flip.",
    related: ["expected-value", "sample-size"],
    lesson: "0.2.2",
  },
  {
    id: "losing-streak",
    term: "Losing streak",
    definition: "Several losses in a row. In random sequences they are normal and often longer than expected.",
    plain: "A run of losses one after another, which chance alone produces regularly.",
    related: ["variance", "drawdown", "win-rate"],
    lesson: "0.2.3",
  },
  {
    id: "sample-size",
    term: "Sample size",
    definition: "How many trades or observations a figure is based on. Small samples can mislead.",
    plain: "How much evidence is behind a number: 20 trades is little, 500 is a lot more.",
    related: ["law-of-large-numbers", "win-rate", "backtest"],
    lesson: "0.2.4",
  },
  {
    id: "law-of-large-numbers",
    term: "Law of large numbers",
    definition: "As the number of trials grows, the average result moves closer to the expected value.",
    plain: "Play long enough and the average settles near what the odds say; play briefly and it can be far off.",
    related: ["sample-size", "expected-value"],
    lesson: "0.2.4",
  },
  {
    id: "random-walk",
    term: "Random walk",
    definition: "A price path in which each move is random. It still produces trends and levels by chance.",
    plain: "A chart drawn by coin flips. It can look just like a real market.",
    related: ["trend", "support", "resistance"],
    lesson: "0.2.5",
  },
  {
    id: "survivorship-bias",
    term: "Survivorship bias",
    definition: "Looking only at the winners that remain and forgetting the many that failed or disappeared.",
    plain: "Seeing the lucky few who made it and thinking their way must work.",
    related: ["cognitive-bias", "sample-size"],
    lesson: "0.2.6",
  },
];

// ─── Concepts introduced in 0.2 ────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "outcome-bias",
    name: "Outcome bias",
    category: "decision_making",
    summary: "Outcome bias is judging the quality of a decision by its result instead of by the information and reasoning available at the time.",
    body: [
      "A result mixes the decision with luck. A sound decision can lose and a poor one can win, so one outcome can't grade the decision. Together they make four boxes: deserved success, bad luck, dumb luck and poetic justice.",
      "People rate the same decision higher when it ends well, even when they say the outcome shouldn't matter (Baron and Hershey, 1988; a preregistered 2023 replication with 692 people). That's why MARKET//LAB grades the process first and shows the outcome separately.",
    ],
    example:
      "A dice bet pays 10.00 on a 6 and loses 10.00 on anything else. Ana takes it and wins 10.00. The bet loses five times in six, so the decision was poor: her win is dumb luck, not a good decision.",
    related: ["decision-quality", "counterfactual-thinking", "luck-vs-skill"],
    missions: ["M10"],
    lessons: ["0.2.1", "3.11.3"],
  },
  {
    id: "expected-value",
    name: "Expected value",
    category: "risk_management",
    summary: "Expected value is the probability-weighted average result of a bet: what it returns per play over many plays.",
    body: [
      "Multiply each outcome by its probability and add them up. A coin flip that wins 15.00 or loses 10.00 has an expected value of 0.5 × 15.00 − 0.5 × 10.00 = +2.50 per play.",
      "Expected value describes many plays, not the next one: any single play can still lose. A game can win most of the time and still lose on average if its rare losses are large. An edge is a positive expected value after costs.",
    ],
    example:
      "Game B wins 1.00 nine times in ten and loses 12.00 once in ten: 0.9 × 1.00 − 0.1 × 12.00 = −0.30 per play. Over 100 plays that is about −30.00, despite 90% wins.",
    related: ["expectancy", "variance", "reward-to-risk"],
    missions: [],
    lessons: ["0.2.2"],
  },
  {
    id: "variance",
    name: "Variance",
    category: "risk_management",
    summary: "Variance is how widely results spread around their expected value; short runs can differ a lot from it.",
    body: [
      "Even a game with a positive expected value has losing stretches. Game A (+15.00 or −10.00 on a coin flip, +2.50 per play) still ends behind about 13% of the time after 20 plays, and about 2% after 100.",
      "The more plays, the closer the average gets to the expected value, but the swings along the way never disappear. Plan for them instead of reading meaning into them.",
    ],
    example:
      "After 20 plays of game A the expected total is +50.00, yet five runs of 20 plays ended at +100.00, +50.00, +25.00, −25.00 and −50.00. That spread is variance.",
    related: ["expected-value", "streaks-and-runs", "drawdown"],
    missions: [],
    lessons: ["0.2.3"],
  },
  {
    id: "streaks-and-runs",
    name: "Streaks and runs",
    category: "risk_management",
    summary: "In independent trials, long runs of wins or losses are normal and longer than intuition expects.",
    body: [
      "Five tails from five given flips is only 3.1% likely, but in 100 flips a run of five or more shows up somewhere 81.0% of the time. At a 40% win rate, a run of eight losses appears in 49.0% of 100-trade sequences.",
      "People writing 'random' sequences switch too often and avoid long runs. A streak on its own doesn't prove a method stopped working, and it doesn't make a win due.",
    ],
    example:
      "A method that wins 40% of its trades: the chance of at least one run of 6 losses in 100 trades is 87.3%; of 10 losses, 20.5%.",
    related: ["variance", "drawdown", "revenge-trading"],
    missions: [],
    lessons: ["0.2.3"],
  },
  {
    id: "sample-size",
    name: "Sample size",
    category: "scenario_analysis",
    summary: "Sample size is the number of observations behind a statistic; small samples give wide, unreliable estimates.",
    body: [
      "A 60% win rate over 20 trades fits any true rate from about 38.5% to 81.5%. At 100 trades the plausible range is 50.4–69.6%, and at 400 trades 55.2–64.8%: four times the trades halves the width.",
      "Judge a method on hundreds of trades, and each single trade on whether it followed the plan. People expect small samples to look like the whole, which Tversky and Kahneman (1971) called the law of small numbers.",
    ],
    example:
      "A method with no edge reaches 60% or better over 20 trades about one time in four (25.2%). A 60% result needs about 93 trades before a 50% method no longer fits it.",
    related: ["expected-value", "luck-vs-skill", "base-rates"],
    missions: [],
    lessons: ["0.2.4"],
  },
  {
    id: "random-walk",
    name: "Random walk",
    category: "technical_analysis",
    summary: "A random walk is a price path in which each step is random; it still draws trends, ranges and levels by chance.",
    body: [
      "Each step up or down is a coin flip with no memory of the steps before. Yet a few hundred steps draw shapes that look like trends, ranges, breakouts and levels that 'hold'.",
      "So a pattern on a chart proves little by itself. The honest test asks how often it works compared with random data, after costs. In one test, chart gaps 'filled' 83.4% of the time; random levels the same distance away were revisited 83.5% of the time.",
    ],
    example:
      "Forty one-hour candles, each built from five coin flips of 0.20, climb from 99.40 to 104.40 in nine hours and then range between 104.60 and 105.60. None of it means anything.",
    related: ["trend", "range", "support-and-resistance", "base-rates"],
    missions: ["M02"],
    lessons: ["0.2.5"],
  },
  {
    id: "luck-vs-skill",
    name: "Luck versus skill",
    category: "decision_making",
    summary: "In short runs luck dominates results; skill shows as a consistent process over large samples.",
    body: [
      "If 1,000 people call LABX's direction for 10 days by flipping a coin, about 55 get 8 or more days right. Over the next 10 days those 'stars' average about 5, like everyone else.",
      "Evidence that separates skill from luck: the same rules over hundreds of trades, results after costs, and a comparison with the benchmark. You control the process, not the luck, which is why MARKET//LAB grades the process.",
    ],
    example:
      "Of 1,000 coin-flippers, about 55 (5.47%) get at least 8 of 10 days right. About 3 of them do it again over the next 10 days, which is what chance predicts.",
    related: ["survivorship-bias", "sample-size", "decision-quality"],
    missions: [],
    lessons: ["0.2.6"],
  },
  {
    id: "survivorship-bias",
    name: "Survivorship bias",
    category: "psychology",
    summary: "Survivorship bias is seeing only the winners that remain, which makes chance results look like skill.",
    body: [
      "When many people try something risky, some do well by luck. If you see only those, in ads or on social media, the many who failed are invisible and the winners look talented.",
      "Before believing a record, ask how many started, how many trades it covers, and whether the results are after costs and next to the benchmark.",
    ],
    example:
      "1,000 people flip coins to call LABX for 10 days. The 55 with 8 or more right post their records; the 945 others don't. Seen alone, the 55 look like experts.",
    related: ["luck-vs-skill", "confirmation-bias", "base-rates"],
    missions: [],
    lessons: ["0.2.6"],
  },
];

export const UNIT_0_2: UnitContent = {
  intro: {
    summary:
      "Trading results are noisy, so before any pattern or indicator you learn to think in probabilities: judge decisions apart from their results, weigh outcomes by their odds, expect long losing streaks, distrust small samples, and test patterns and star traders against chance.",
    outcomes: [
      "Judge a decision by what you knew then, not by how it turned out.",
      "Calculate the expected value of a simple game, and spot one that wins often but loses on average.",
      "Expect long losing streaks, and know how many trades a win rate needs.",
      "Ask whether a pattern beats random data, after costs, before you trust it.",
      "Tell luck from skill by sample size, fixed rules and results after costs.",
    ],
    buildsOn:
      "Builds on unit 0.1, mainly 0.1.6, where Decision Quality grades your reasoning and the outcome is never graded. The benchmark (0.1.4) and the honest numbers (0.1.5) showed why raw results mislead.",
  },
  lessons: [L_0_2_1, L_0_2_2, L_0_2_3, L_0_2_4, L_0_2_5, L_0_2_6],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
