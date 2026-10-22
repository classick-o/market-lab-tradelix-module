import type { CandleData, Concept, GlossaryTerm, Lesson, Question, TaskData, UnitContent } from "../../types";

type Cards = NonNullable<TaskData["cards"]>;
type Options = NonNullable<TaskData["options"]>;

// ─── 2.12.1 · Prospect theory ──────────────────────────────────────────────

const L_2_12_1: Lesson = {
  id: "2.12.1",
  title: "Prospect theory",
  topic: "psychology",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "People judge outcomes as gains or losses from a reference point and feel losses more, which pulls traders to cut winners and hold losers.",
  objectives: [
    "Describe the three parts of prospect theory: a reference point, diminishing sensitivity and loss aversion.",
    "Recognise your own risk-taking in gains versus in losses.",
    "Link prospect theory to holding losers, cutting winners and lottery-like targets.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
    { kind: "check", ref: "psychology", label: "Knowledge check: psychology" },
  ],
  script: {
    unit: "2.12",
    courseId: "2.12.1",
    hook: {
      prompt: "Choice 1: a sure +50.00 vUSD, or a 50% chance of +100.00. Choice 2: a sure −50.00, or a 50% chance of −100.00. Which do you pick in each?",
      control: {
        kind: "choice",
        choices: [
          { id: "safe-gamble", label: "Sure +50.00, then the gamble on −100.00" },
          { id: "safe-safe", label: "Sure +50.00, then the sure −50.00" },
          { id: "gamble-gamble", label: "Gamble on +100.00, then the gamble on −100.00" },
          { id: "gamble-safe", label: "Gamble on +100.00, then the sure −50.00" },
        ],
      },
      compare:
        "You chose “{yours}”. In each pair, both options have the same expected value. Most people take the sure gain and gamble on the loss: careful with gains, risky with losses. This lesson names that pattern.",
      concept: "prospect-theory",
    },
    learn: [
      {
        kind: "explain",
        title: "Gains and losses, from where you stand",
        text: "[[prospect-theory|Prospect theory]] (Kahneman and Tversky, 1979) describes how people actually choose under risk. It has three parts. You judge an outcome as a gain or a loss from a [[reference-point|reference point]], often your entry price. Each extra unit matters less as amounts grow: diminishing sensitivity. And losses weigh more than equal gains: [[loss-aversion|loss aversion]].",
      },
      {
        kind: "figure",
        title: "The value function",
        text: "How strongly each outcome is felt, with the median parameters of Tversky and Kahneman (1992). The pattern is well established ([[evidence-grade]] A), but the numbers are illustrative: the loss weight of 2.25 came from 25 students, and studies of professionals sometimes find less.",
        figure: {
          kind: "bars",
          bars: [
            { label: "+50.00 gain", value: 31.3, role: "up" },
            { label: "+100.00 gain", value: 57.5, role: "up" },
            { label: "−50.00 loss", value: -70.4, role: "down" },
            { label: "−100.00 loss", value: -129.5, role: "down" },
          ],
          steps: [
            "Felt value of each outcome, measured from your reference point at zero.",
            "+100.00 feels like 57.5, less than twice the 31.3 of +50.00: diminishing sensitivity.",
            "−100.00 feels like −129.5: 2.25 times as strong as the equal gain. That's loss aversion.",
          ],
        },
        concept: "prospect-theory",
      },
      {
        kind: "worked",
        title: "Same expected value, different feeling",
        lines: [
          "Choice 1, the gamble: 0.5 × (+100.00) + 0.5 × 0 = +50.00. The same as the sure +50.00.",
          "Choice 2, the gamble: 0.5 × (−100.00) + 0.5 × 0 = ?",
        ],
        ask: {
          answer: -50,
          tolerance: 0,
          unit: "vUSD",
          feedback: [
            { value: 50, text: "Check the sign: this gamble can only lose money, so its average is negative." },
            { value: -100, text: "−100.00 happens only half the time; the other half you lose nothing. Weight each outcome by its chance." },
          ],
          correct:
            "Right: −50.00, the same as the sure loss. Both pairs are worth the same on average either way, yet most people play safe with the gain and gamble with the loss.",
        },
        concept: "expected-value",
      },
      {
        kind: "match",
        title: "Where it shows up in trading",
        prompt: "Each habit below follows from the theory. Match it to the part behind it.",
        pairs: [
          {
            left: "Holding a −0.6R loser, hoping to get back to zero",
            right: "Risk-seeking in losses",
            wrong: "Below the reference point, a sure loss hurts more than a gamble on a comeback. Holding on is that gamble.",
          },
          {
            left: "Closing a +0.5R winner early, to lock it in",
            right: "Risk-averse in gains",
            wrong: "Above the reference point, a sure gain feels better than a chance of more. Closing early takes the sure thing.",
          },
          {
            left: "A 'moonshot' target, 15R away",
            right: "Overweighting small chances",
            wrong: "A tiny chance of a huge win feels bigger than it is. That's how small probabilities are weighted, not the gain or loss frame.",
          },
        ],
        columns: ["Habit", "Part of the theory"],
        concept: "prospect-theory",
      },
      {
        kind: "predict",
        title: "Does knowing fix it?",
        prompt: "Now that you know the pattern, will it stop pulling at your exits?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes: knowing it is enough", feedback: "Knowing the name rarely switches it off. The pull shows up even in people who can describe it." },
            { id: "no", label: "No: it needs structure", feedback: "Right. The pull stays; rules set before entry take the decision out of the moment." },
            {
              id: "beginners",
              label: "Only beginners feel it",
              feedback: "Studies of professionals sometimes find a weaker effect, but not none. Experience helps less than structure.",
            },
          ],
          answer: "no",
        },
        reveal:
          "Knowing about a bias doesn't remove it. What helps is structure decided in advance: a stop and a target set at entry, a time stop, and exits that don't ask how the trade feels. Your entry price is your reference point, not the market's.",
        concept: "loss-aversion",
      },
      {
        kind: "callout",
        tone: "key",
        text: "The market doesn't know your entry price. Let exits come from rules set at entry, not from where the trade stands against it.",
      },
      {
        kind: "predict",
        title: "Your pattern with small odds",
        prompt: "Two more pairs, with small odds. Pair 3: a sure +20.00, or a 10% chance of +200.00. Pair 4: a sure −20.00, or a 10% chance of −200.00. Which do you pick in each?",
        control: {
          kind: "choice",
          choices: [
            {
              id: "gamble-safe",
              label: "Gamble on +200.00, then the sure −20.00",
              feedback: "The common pattern with small odds: buy the lottery ticket, pay for the insurance. Small chances feel bigger than they are; in trading, that's the pull of the moonshot target.",
            },
            {
              id: "safe-gamble",
              label: "Sure +20.00, then the gamble on −200.00",
              feedback: "The same as most people's first two answers: safe with gains, risky with losses. With small odds most people flip it, so this pull may be strong for you.",
            },
            {
              id: "safe-safe",
              label: "Sure +20.00, then the sure −20.00",
              feedback: "You avoided risk in both frames. Check that the same holds when a real trade is underwater and the stop is close.",
            },
            {
              id: "gamble-gamble",
              label: "Gamble on +200.00, then the gamble on −200.00",
              feedback: "You took the risk in both frames. Your exit rules matter more than the preference: write them before entry.",
            },
          ],
        },
        reveal:
          "Tversky and Kahneman (1992) found a fourfold pattern: with moderate odds, people play safe with gains and gamble with losses; with small odds, they flip. All four pairs had equal expected values. Compare your four answers: in which frame did you take the gamble more often?",
        concept: "prospect-theory",
      },
    ],
    check: ["q-2.12.1-1", "q-2.12.1-2", "q-2.12.1-3"],
    recap: {
      takeaways: [
        "Outcomes are judged from a reference point; sensitivity shrinks with size, and losses weigh more than gains.",
        "Most people play safe with gains and gamble with losses, even at equal expected values.",
        "Holding losers, cutting winners and moonshot targets follow the pattern; exits set at entry counter it.",
      ],
    },
  },
};

// ─── 2.12.2 · The disposition effect ───────────────────────────────────────

const L_2_12_2: Lesson = {
  id: "2.12.2",
  title: "The disposition effect",
  topic: "psychology",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Selling winners early and holding losers is the disposition effect: measure it with PGR and PLR, and let exits come from rules.",
  objectives: [
    "Define the disposition effect and measure it with PGR and PLR.",
    "Show how selling winners early and holding losers damages expectancy.",
    "Set exit rules that don't depend on whether the trade is in profit.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
    { kind: "arena", ref: "reversal", label: "Arena: reversal" },
  ],
  script: {
    unit: "2.12",
    courseId: "2.12.2",
    hook: {
      prompt: "You hold two positions: one is +0.8R, the other −0.7R. You need to close one. Which do most people close?",
      control: {
        kind: "choice",
        choices: [
          { id: "winner", label: "The winner" },
          { id: "loser", label: "The loser" },
        ],
        answer: "winner",
      },
      compare:
        "You chose “{yours}”. Most people close the winner: it locks in a gain and avoids admitting a loss. The better question is what your plan says about each trade.",
      concept: "disposition-effect",
    },
    learn: [
      {
        kind: "explain",
        title: "Sell winners, hold losers",
        text: "The [[disposition-effect|disposition effect]] (Shefrin and Statman, 1985) is the habit of selling winners too early and holding losers too long. It follows from prospect theory: above your entry a sure gain feels good; below it, a sure loss feels worse than a gamble on a comeback. The result: small wins and large losses.",
      },
      {
        kind: "worked",
        title: "What 10,000 accounts showed",
        lines: [
          "Odean (1998) studied 10,000 accounts at a US discount broker.",
          "On each day an investor sold, Odean counted every stock in the account: sold or kept, at a gain or at a loss.",
          "They realised 14.8% of their paper gains (PGR = 0.148) but only 9.8% of their paper losses (PLR = 0.098). December, the tax-selling month, was the exception.",
          "The disposition measure is PGR − PLR = 0.05. How many times as likely was a gain to be sold as a loss? 0.148 ÷ 0.098 = ?",
        ],
        ask: {
          answer: 1.51,
          tolerance: 0.01,
          feedback: [{ value: 0.05, text: "That's the difference, PGR − PLR. Here divide: 0.148 ÷ 0.098." }],
          correct:
            "About 1.5 times. Rebalancing and trading costs didn't explain it, and the winners sold went on to do better than the losers kept. Evidence grade B; the size varies from one group of investors to another.",
        },
        concept: "disposition-effect",
      },
      {
        kind: "worked",
        title: "Measure it on a sample journal",
        lines: [
          "Each time a trade was closed, count every position open at that moment.",
          "Gains: 12 realised, 28 left on paper. PGR = 12 ÷ (12 + 28) = 0.30.",
          "Losses: 6 realised, 34 left on paper. PLR = 6 ÷ (6 + 34).",
          "Disposition = PGR − PLR = ?",
        ],
        ask: {
          answer: 0.15,
          tolerance: 0.01,
          feedback: [
            { value: 0.3, text: "That's PGR on its own. Subtract PLR: 6 ÷ 40 = 0.15." },
            { value: 0.12, text: "PLR divides by all losses, realised plus paper: 6 ÷ (6 + 34) = 0.15, not 6 ÷ 34." },
          ],
          correct:
            "Right: 0.30 − 0.15 = 0.15. Gains were sold at twice the rate of losses. Once you have 30 trades or more, run the same count on your own journal.",
        },
        concept: "disposition-effect",
      },
      {
        kind: "figure",
        title: "Holding times",
        text: "The same sample journal, 40 trades, sorted by how long each was held.",
        figure: {
          kind: "bars",
          unit: "trades",
          bars: [
            { label: "Wins, 1–5 candles", value: 9, role: "up" },
            { label: "Wins, 6–10", value: 4, role: "up" },
            { label: "Wins, 11–20", value: 2, role: "up" },
            { label: "Wins, 21+", value: 1, role: "up" },
            { label: "Losses, 1–5 candles", value: 3, role: "down" },
            { label: "Losses, 6–10", value: 5, role: "down" },
            { label: "Losses, 11–20", value: 8, role: "down" },
            { label: "Losses, 21+", value: 8, role: "down" },
          ],
          steps: [
            "Winners: 9 of 16 were closed within 5 candles.",
            "Losers: 16 of 24 were held for 11 candles or more.",
            "Cut short when green, given time when red: the disposition effect in holding times.",
          ],
        },
        concept: "disposition-effect",
      },
      {
        kind: "predict",
        title: "What it does to expectancy",
        prompt:
          "Your plan wins 40% of trades at a +2.5R target, with −1R losses: +0.40R per trade. You start closing winners at +0.8R. Assume the same trades win. What's the expectancy now?",
        control: {
          kind: "choice",
          choices: [
            { id: "same", label: "Still +0.40R", feedback: "The win rate stays, but each win shrinks from 2.5R to 0.8R. The average falls with it." },
            { id: "small", label: "About +0.10R", feedback: "Work it through: 0.4 × 0.8 = 0.32 from wins, minus 0.6 × 1 = 0.60 from losses." },
            { id: "negative", label: "−0.28R" },
          ],
          answer: "negative",
        },
        reveal:
          "0.4 × 0.8 − 0.6 × 1 = −0.28R per trade, against +0.40R with the target. Closing early does win a little more often, but at +0.8R you'd need 55.6% winners just to break even. The habit can turn a working method into a losing one.",
        concept: "expectancy",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Exits come from rules: the stop, the target, a time stop or an opposing signal. Never from how the profit or loss feels. When in doubt, ask: would I open this trade now?",
      },
      {
        kind: "fields",
        title: "Your exit rules",
        prompt: "Write exits that don't care whether the trade is green or red. Set them at entry; the only change allowed is a stop moved in your favour by a rule.",
        fields: [
          { id: "target", label: "Target", kind: "choice", options: [1.5, 2, 2.5, 3], unit: "R", default: 2 },
          { id: "timeStop", label: "Time stop: exit if neither stop nor target is hit after __ candles", kind: "stepper", min: 5, max: 50, step: 5, default: 20 },
          { id: "opposing", label: "Opposing signal that closes the trade early", kind: "text", default: "", placeholder: "e.g. a close below the 20-period MA", required: true },
        ],
        correct: "Saved. These exits apply the same way at +0.8R and at −0.7R: the open profit or loss doesn't get a vote.",
        concept: "exit-rules",
      },
    ],
    check: ["q-2.12.2-1", "q-2.12.2-2", "q-2.12.2-3"],
    recap: {
      takeaways: [
        "The disposition effect: winners sold early, losers held. Measure it as PGR − PLR.",
        "Cutting winners to +0.8R turns +0.40R per trade into −0.28R at a 40% win rate.",
        "Exit by rule: stop, target, time or an opposing signal, never by how P&L feels.",
      ],
    },
  },
};

// ─── 2.12.3 · Overconfidence and calibration ───────────────────────────────

const CALIBRATION_OPTIONS: Options = [
  { id: "over", label: "Overconfident" },
  { id: "calibrated", label: "Calibrated" },
  { id: "under", label: "Underconfident" },
];

/** Four confidence logs; gap = hit rate − average confidence, calibrated within 5 points. */
const CALIBRATION_CARDS: Cards = [
  {
    id: "log-a",
    text: "Log A: 40 calls at an average confidence of 75%. 22 of them were right.",
    answer: "over",
    correct: "Overconfident. 22 of 40 is 55%; 55 − 75 = −20 points.",
    rationales: {
      calibrated: "22 of 40 is 55%, 20 points under the 75% stated. That's far outside 5 points.",
      under: "Underconfident means right more often than stated. Here 55% is below the 75% stated.",
    },
  },
  {
    id: "log-b",
    text: "Log B: 50 calls at an average confidence of 68%. 35 of them were right.",
    answer: "calibrated",
    correct: "Calibrated. 35 of 50 is 70%; 70 − 68 = +2 points, inside the 5-point band.",
    rationales: {
      over: "35 of 50 is 70%, slightly above the 68% stated. Overconfidence needs the hit rate below the confidence.",
      under: "+2 points is within 5 either way. Underconfident would need a hit rate well above 68%.",
    },
  },
  {
    id: "log-c",
    text: "Log C: 30 calls at an average confidence of 60%. 24 of them were right.",
    answer: "under",
    correct: "Underconfident. 24 of 30 is 80%; 80 − 60 = +20 points. It's rarer, but it happens.",
    rationales: {
      over: "24 of 30 is 80%, above the 60% stated. The confidence was too low, not too high.",
      calibrated: "80 − 60 = +20 points, far outside the 5-point band.",
    },
  },
  {
    id: "log-d",
    text: "Log D: 60 calls, each one 'a sure thing' at 90%. 39 of them were right.",
    answer: "over",
    correct: "Overconfident. 39 of 60 is 65%; 65 − 90 = −25 points.",
    rationales: {
      calibrated: "39 of 60 is 65%, 25 points under the 90% stated.",
      under: "The hit rate, 65%, is below the 90% stated: confidence ran ahead of the record.",
    },
  },
];

const L_2_12_3: Lesson = {
  id: "2.12.3",
  title: "Overconfidence and calibration",
  topic: "psychology",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Overconfidence is being sure more often than you're right: log your confidence, compare it with your hit rate, and watch what it does to your trade count.",
  objectives: [
    "Explain overconfidence as miscalibration: being sure more often than you are right.",
    "Measure your calibration with a confidence log.",
    "Link overconfidence to overtrading and its cost.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "check", ref: "psychology", label: "Knowledge check: psychology" },
  ],
  script: {
    unit: "2.12",
    courseId: "2.12.3",
    hook: {
      prompt: "Picture giving five ranges for LABX's close 10 candles from now, each one you're 90% sure contains it. How many would actually contain it?",
      control: { kind: "slider", min: 0, max: 5, step: 1, unit: "of 5", start: 4 },
      compare:
        "You said {yours} of 5. If you were calibrated, about 4 or 5 would hit: 90% of 5 is 4.5. Ranges people call 90% sure are usually too narrow; 2 or 3 hits out of 5 is a typical illustration.",
      concept: "overconfidence",
    },
    learn: [
      {
        kind: "explain",
        title: "Sure more often than right",
        text: "[[overconfidence|Overconfidence]] isn't feeling bold; it's a gap you can measure. When your 90% calls come true 60% of the time, your confidence runs ahead of your record. [[calibration|Calibration]] is how closely the two match. In lab studies, ranges that people call 90% sure miss the answer far more often than 1 time in 10.",
      },
      {
        kind: "figure",
        title: "A calibration curve",
        text: "One trader's log of 100 calls, grouped by the confidence stated before each one. Each bar shows how often that group was right.",
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "Said 60% (10 calls)", value: 60, role: "neutral" },
            { label: "Said 70% (20 calls)", value: 55, role: "down" },
            { label: "Said 80% (30 calls)", value: 60, role: "down" },
            { label: "Said 90% (40 calls)", value: 62.5, role: "down" },
          ],
          steps: [
            "Calibrated bars would climb with confidence: 60, 70, 80, 90.",
            "These stay near 60%, whatever the stated confidence.",
            "Most calls were made at 80% or 90%: confidence rose, accuracy didn't.",
          ],
        },
        concept: "overconfidence",
      },
      {
        kind: "explain",
        title: "What it costs",
        text: "Barber and Odean studied 66,465 US households: the most active fifth earned 11.4% a year, against 17.9% for the market. Men traded about 45% more than women, which cut their net returns by 2.65 points a year, against 1.72. The authors read both as overconfidence; part of the trading may have rational reasons ([[evidence-grade]] B).",
      },
      {
        kind: "worked",
        title: "Your calibration gap",
        lines: [
          "Average confidence: (10 × 60 + 20 × 70 + 30 × 80 + 40 × 90) ÷ 100 = 80%.",
          "Hit rate: 60 right out of 100 = 60%.",
          "Calibration gap = hit rate − average confidence = ?",
        ],
        ask: {
          answer: -20,
          tolerance: 0,
          unit: "points",
          feedback: [{ value: 20, text: "Mind the order: hit rate minus confidence. A negative gap means confidence ran ahead of the record." }],
          correct:
            "Right: −20 points. Negative means overconfident, positive underconfident. In this lesson, within 5 points either way counts as calibrated. Small logs are noisy, so keep logging.",
        },
        concept: "overconfidence",
      },
      {
        kind: "predict",
        title: "Confidence and trade count",
        prompt: "Feeling sure, you go from 5 trades a week to 25. Costs take about 0.20R per trade. How many more R a week do costs take?",
        control: {
          kind: "numeric",
          unit: "R",
          answer: 4,
          tolerance: 0,
          feedback: [
            { value: 5, text: "5R is the total at 25 trades. Subtract what 5 trades already cost: 1R." },
            { value: 20, text: "That's the number of extra trades. Multiply by 0.20R each." },
          ],
        },
        reveal:
          "25 × 0.20R = 5R a week, against 5 × 0.20R = 1R: 4R more, certain, every week. Each extra trade needs an edge above 0.20R just to pay for itself.",
        concept: "trading-costs",
      },
      { kind: "callout", tone: "key", text: "Confidence should come from evidence that you execute the process, not from how sure a trade feels." },
    ],
    task: {
      widget: "bias-spotter",
      data: { cards: CALIBRATION_CARDS, options: CALIBRATION_OPTIONS },
      goal: "Four confidence logs. Work out each gap, hit rate minus average confidence, and label it. Within 5 points either way counts as calibrated.",
      success: { field: "solved", eq: 4 },
      correct: "All four labelled. A confidence number logged before each trade turns 'I'm sure' into something you can check against the record.",
      hints: [
        "Hit rate = right calls ÷ all calls, as a percentage.",
        "Gap = hit rate − average confidence. Negative means overconfident.",
        "Log A: 22 ÷ 40 = 55%. 55 − 75 = −20.",
      ],
      showMe: { solved: 4 },
      concept: "overconfidence",
    },
    check: ["q-2.12.3-1", "q-2.12.3-2", "q-2.12.3-3"],
    recap: {
      takeaways: [
        "Overconfidence is a measurable gap: your stated confidence running ahead of your hit rate.",
        "Log a confidence number before each trade; the gap is hit rate minus average confidence.",
        "Overconfidence adds trades, and each extra trade pays costs for certain while its edge is unproven.",
      ],
    },
  },
};

// ─── 2.12.4 · Recency and small samples ────────────────────────────────────

const EDGE_OPTIONS: Options = [
  { id: "edge", label: "Edge" },
  { id: "none", label: "No edge" },
  { id: "cant", label: "Can't tell" },
];

/**
 * Guess the edge: four synthetic systems of 20 trades. A and C win 40% at +1.5R (no edge); B and D win 40% at +2.25R
 * (+0.30R). Intervals: mean ± 1.96 × sample sd ÷ √20, as in 2.11.7.
 */
const EDGE_CARDS: Cards = [
  {
    id: "system-a",
    text: "System A: 10 wins at +1.5R, 10 losses at −1R. Average +0.25R per trade; 95% interval −0.31R to +0.81R.",
    answer: "cant",
    correct: "Can't tell: the interval includes zero. The truth: A has no edge (40% at +1.5R breaks even); 10 wins in 20 was luck.",
    rationales: {
      edge: "+0.25R looks good, but the interval runs down to −0.31R. Twenty trades can't rule out zero.",
      none: "The interval holds values above zero as well as below. That's 'can't tell', not 'no edge'.",
    },
  },
  {
    id: "system-b",
    text: "System B: 12 wins at +2.25R, 8 losses at −1R. Average +0.95R per trade; 95% interval +0.23R to +1.67R.",
    answer: "edge",
    correct: "Edge: the whole interval sits above zero. The truth: B's edge is +0.30R, so even this sample flatters it threefold.",
    rationales: {
      none: "The interval is entirely above zero, from +0.23R to +1.67R.",
      cant: "This interval doesn't include zero: its low end is +0.23R. The rule says Edge.",
    },
  },
  {
    id: "system-c",
    text: "System C: 4 wins at +1.5R, 16 losses at −1R. Average −0.50R per trade; 95% interval −0.95R to −0.05R.",
    answer: "none",
    correct: "No edge: the interval sits below zero. The truth: C breaks even, and 4 wins in 20 was bad luck.",
    rationales: {
      edge: "The average and the whole interval are negative, from −0.95R to −0.05R.",
      cant: "The interval stops at −0.05R: it doesn't reach zero. The evidence points below zero.",
    },
  },
  {
    id: "system-d",
    text: "System D: 8 wins at +2.25R, 12 losses at −1R. Average +0.30R per trade; 95% interval −0.42R to +1.02R.",
    answer: "cant",
    correct: "Can't tell: the interval includes zero. The truth: D has a real +0.30R edge, and 20 trades can't show it.",
    rationales: {
      edge: "+0.30R is the true edge, but this interval starts at −0.42R. Twenty trades can't separate it from zero.",
      none: "The interval reaches +1.02R. Values above zero are as plausible as zero.",
    },
  },
];

const L_2_12_4: Lesson = {
  id: "2.12.4",
  title: "Recency and small samples",
  topic: "psychology",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "The last few results feel like the truth, small samples mislead, and extreme runs drift back toward the base rate.",
  objectives: [
    "Recognise recency bias: letting the last few results outweigh the base rate.",
    "Explain why small samples look more convincing than they are.",
    "Expect regression to the mean after an extreme run.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    { kind: "check", ref: "psychology", label: "Knowledge check: psychology" },
  ],
  script: {
    unit: "2.12",
    courseId: "2.12.4",
    hook: {
      prompt: "Your pullback setup lost its last 3 trades. A fourth valid signal appears. Take it?",
      control: {
        kind: "choice",
        choices: [
          { id: "normal", label: "Take it at normal size" },
          { id: "half", label: "Take it at half size" },
          { id: "skip", label: "Skip it" },
        ],
      },
      compare:
        "You chose “{yours}”. The plan says normal size. At a 40% win rate, any three given trades all lose 21.6% of the time: common, not a signal.",
      concept: "recency-bias",
    },
    learn: [
      {
        kind: "explain",
        title: "The last three trades feel like the truth",
        text: "[[recency-bias|Recency bias]] gives the last few results more weight than the [[base-rate|base rate]] deserves. It rides on availability (Tversky and Kahneman, 1974): what comes to mind easily feels more likely, and your last three trades come to mind first. The evidence comes from lab studies ([[evidence-grade]] B). Your full record is the better guide.",
      },
      {
        kind: "worked",
        title: "How often do three losses happen?",
        lines: [
          "The setup wins 40% of trades, so each trade loses with a chance of 0.6.",
          "Assume each result is independent of the last.",
          "Chance that three given trades all lose: 0.6 × 0.6 × 0.6 = ?",
        ],
        ask: {
          answer: 21.6,
          tolerance: 0.1,
          unit: "%",
          feedback: [
            { value: 1.8, text: "That adds the chances. For all three to lose, multiply: 0.6 × 0.6 × 0.6." },
            { value: 6.4, text: "That's three wins in a row, 0.4 × 0.4 × 0.4. Use the loss chance, 0.6." },
          ],
          correct:
            "Right: 21.6%, more than one time in five. Three losses in a row are part of this setup's normal life, so they say almost nothing about whether it still works.",
        },
        concept: "recency-bias",
      },
      {
        kind: "explain",
        title: "Small samples look convincing",
        text: "Small samples feel as if they mirror the truth. Tversky and Kahneman (1971) asked research psychologists how likely a replication was to succeed: they expected about 85% when the real chance was about 48%. The authors called it belief in the [[law-of-small-numbers|law of small numbers]] ([[evidence-grade]] B). Fifteen trades are a small sample too.",
      },
      {
        kind: "figure",
        title: "Rookie of the year",
        text: "50 synthetic traders with no edge: each trade wins 40% at +1.5R and loses 60% at −1R, 20 trades a month. Rank them by month 1.",
        figure: {
          kind: "bars",
          unit: "R",
          bars: [
            { label: "Top 5, month 1", value: 11, role: "up" },
            { label: "Same 5, month 2", value: 0.5, role: "neutral" },
            { label: "All 50, month 1", value: 0.3, role: "neutral" },
            { label: "All 50, month 2", value: 0.25, role: "neutral" },
          ],
          steps: [
            "Month 1: the top five average +11.0R each. They look skilled.",
            "Month 2, same five: +0.5R on average. The luck didn't carry over.",
            "With no skill, the best month is luck, and luck regresses to the mean.",
          ],
        },
        concept: "regression-to-the-mean",
      },
      {
        kind: "worked",
        title: "Regression after a hot start",
        lines: [
          "A new setup made +1.5R per trade over its first 15 trades: +22.5R.",
          "A long test, after costs, puts its true edge at +0.3R per trade.",
          "The first 15 were edge plus luck. Best estimate for the next 15 trades, in total: 15 × 0.3R = ?",
        ],
        ask: {
          answer: 4.5,
          tolerance: 0.05,
          unit: "R",
          feedback: [
            { value: 22.5, text: "That assumes the hot start repeats. The luck part, +1.2R per trade, isn't expected to." },
            { value: 0.3, text: "That's per trade. Over 15 trades: 15 × 0.3R." },
          ],
          correct:
            "Right: +4.5R, against +22.5R in the first 15. That drop is [[regression-to-the-mean|regression to the mean]], a statistical fact ([[evidence-grade]] Mechanic), not proof that the setup broke.",
        },
        concept: "regression-to-the-mean",
      },
      {
        kind: "predict",
        title: "What your journal shows",
        prompt:
          "A journal check on 35 valid setups: after a win you skipped 1 of 20 (5%). After two or more losses in a row you skipped 6 of 15 (40%). What does it show?",
        control: {
          kind: "choice",
          choices: [
            { id: "recency", label: "Recent losses are steering my entries", feedback: "Right. The setups were valid either way; only the last results changed." },
            {
              id: "caution",
              label: "Sensible caution after losses",
              feedback: "Caution belongs in the plan as a rule, such as reduced size in a drawdown. Skipping valid setups after losses isn't a rule.",
            },
            { id: "broken", label: "The setup has stopped working", feedback: "Skips can't tell you that: they're trades you didn't take. Only the results of all valid setups can." },
          ],
          answer: "recency",
        },
        reveal:
          "A valid setup has the same base rate after a loss as after a win. Skipping 40% after losses lets the last results decide, though the skipped trades were as likely to win as any others. The fix: take every valid setup at the planned size, or change the plan.",
        concept: "recency-bias",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: { cards: EDGE_CARDS, options: EDGE_OPTIONS },
      goal: "Four synthetic systems, 20 trades each. Judge each one from its 95% interval: Edge if it's all above zero, No edge if all below, Can't tell if it includes zero.",
      success: { field: "solved", eq: 4 },
      correct:
        "All four judged by the rule. Two had no edge and two had +0.30R, yet two samples couldn't tell, and the one that showed an edge overstated it threefold. Twenty trades say little.",
      hints: [
        "Look only at the interval: does it include zero?",
        "Low end above zero: Edge. High end below zero: No edge.",
        "System A: −0.31R to +0.81R includes zero, so Can't tell.",
      ],
      showMe: { solved: 4 },
      concept: "sample-size",
    },
    check: ["q-2.12.4-1", "q-2.12.4-2", "q-2.12.4-3"],
    recap: {
      takeaways: [
        "Recency lets the last trades outweigh the base rate. At 40% wins, three straight losses: 21.6%.",
        "Small samples look convincing: with 20 trades, a 95% interval usually still includes zero.",
        "After an extreme run, expect results closer to the true edge: regression to the mean.",
      ],
    },
  },
};

// ─── 2.12.5 · Confirmation and anchoring ───────────────────────────────────

/**
 * B2: a LABX rally from 95.40 to a 103.80 top (c20), then three lower highs: 103.40 (c23), 103.00 (c26) and 102.60 (c29).
 * The 20-period MA still rises on every candle it is drawn (99.04 at c19 to 101.93 at c30); the last close is 102.15.
 */
const L_2_12_5_HIGHS: CandleData[] = [
  { o: 95.0, h: 95.48, l: 94.88, c: 95.4 },
  { o: 95.4, h: 95.98, l: 95.28, c: 95.9 },
  { o: 95.9, h: 96.38, l: 95.78, c: 96.3 },
  { o: 96.3, h: 96.88, l: 96.18, c: 96.8 },
  { o: 96.8, h: 97.28, l: 96.68, c: 97.2 },
  { o: 97.2, h: 97.78, l: 97.08, c: 97.7 },
  { o: 97.7, h: 97.82, l: 97.32, c: 97.4 },
  { o: 97.4, h: 97.98, l: 97.28, c: 97.9 },
  { o: 97.9, h: 98.48, l: 97.78, c: 98.4 },
  { o: 98.4, h: 98.98, l: 98.28, c: 98.9 },
  { o: 98.9, h: 99.38, l: 98.78, c: 99.3 },
  { o: 99.3, h: 99.88, l: 99.18, c: 99.8 },
  { o: 99.8, h: 99.92, l: 99.42, c: 99.5 },
  { o: 99.5, h: 100.08, l: 99.38, c: 100.0 },
  { o: 100.0, h: 100.58, l: 99.88, c: 100.5 },
  { o: 100.5, h: 101.08, l: 100.38, c: 101.0 },
  { o: 101.0, h: 101.58, l: 100.88, c: 101.5 },
  { o: 101.5, h: 102.08, l: 101.38, c: 102.0 },
  { o: 102.0, h: 102.48, l: 101.88, c: 102.4 },
  { o: 102.4, h: 102.98, l: 102.28, c: 102.9 },
  { o: 102.9, h: 103.8, l: 102.8, c: 103.5 },
  { o: 103.5, h: 103.6, l: 102.8, c: 102.9 },
  { o: 102.9, h: 103.05, l: 102.4, c: 102.6 },
  { o: 102.6, h: 103.4, l: 102.5, c: 103.2 },
  { o: 103.2, h: 103.3, l: 102.5, c: 102.6 },
  { o: 102.6, h: 102.7, l: 102.2, c: 102.4 },
  { o: 102.4, h: 103.0, l: 102.3, c: 102.85 },
  { o: 102.85, h: 102.9, l: 102.2, c: 102.3 },
  { o: 102.3, h: 102.4, l: 101.95, c: 102.1 },
  { o: 102.1, h: 102.6, l: 102.0, c: 102.45 },
  { o: 102.45, h: 102.5, l: 102.05, c: 102.15 },
];

const DEVIL_OPTIONS: Options = [
  { id: "for", label: "Supports the long" },
  { id: "against", label: "Argues against it" },
];

/** Devil's advocate: five items on a long idea at 101.20 (last swing low 100.90); two argue against it. */
const DEVIL_CARDS: Cards = [
  {
    id: "ma",
    text: "LABX is above its rising 20-period moving average.",
    answer: "for",
    correct: "Supports the long: price above a rising average fits an uptrend. Note it, then keep looking for the other side.",
    rationales: { against: "Price above a rising average is a classic sign for the long. The evidence against comes from elsewhere." },
  },
  {
    id: "lower-highs",
    text: "The last three rallies topped at 102.60, 102.30 and 101.90.",
    answer: "against",
    correct: "Against: lower highs show buyers getting weaker. This is the evidence a held long tends to wave off as noise.",
    rationales: { for: "Each rally stopping lower than the last shows weakening demand, the opposite of what a long needs." },
  },
  {
    id: "support",
    text: "The 100.90 swing low held twice this week.",
    answer: "for",
    correct: "Supports the long: a level that holds twice shows buyers defending it. It's also where your invalidation goes.",
    rationales: { against: "A low that holds is buyers defending a level. That's evidence for the long, as long as it holds." },
  },
  {
    id: "volume",
    text: "Volume on the down candles is twice the volume on the up candles.",
    answer: "against",
    correct: "Against: heavier volume on the falls than on the rises points to selling pressure.",
    rationales: { for: "Volume tells you where the effort is. Here it's on the falls, which points to sellers, not buyers." },
  },
  {
    id: "daily",
    text: "The daily chart still shows higher highs and higher lows.",
    answer: "for",
    correct: "Supports the long: the larger trend is still up. It frames the trade, but doesn't cancel the warnings on your timeframe.",
    rationales: { against: "Higher highs and higher lows on the daily chart are an uptrend. That's evidence for the long." },
  },
];

const L_2_12_5: Lesson = {
  id: "2.12.5",
  title: "Confirmation and anchoring",
  topic: "psychology",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Once you hold a trade you see what agrees with it and anchor to your entry; a written invalidation and a devil's-advocate check push back.",
  objectives: [
    "Spot confirmation bias in how you read the chart of a trade you already hold.",
    "Recognise anchoring to your entry price or to an old high.",
    "Use a written invalidation and a devil's-advocate check before and during a trade.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
    { kind: "arena", ref: "reversal", label: "Arena: reversal" },
  ],
  script: {
    unit: "2.12",
    courseId: "2.12.5",
    hook: {
      prompt: "You bought LABX at 104.00. It's 101.20 now and your plan's stop is 100.80. A voice says: 'I'll sell when it gets back to 104.00.' What is 104.00 to the market?",
      control: {
        kind: "choice",
        choices: [
          { id: "resistance", label: "Resistance" },
          { id: "level", label: "A meaningful level" },
          { id: "entry", label: "Just your entry price" },
        ],
        answer: "entry",
      },
      compare:
        "You chose “{yours}”. To the market, 104.00 is just your entry price: nobody else knows it, and price owes it nothing. The level your plan chose is the stop at 100.80.",
      concept: "anchoring",
    },
    learn: [
      {
        kind: "explain",
        title: "Seeing what agrees",
        text: "[[confirmation-bias|Confirmation bias]] is looking for, and believing, evidence that agrees with what you already think (Nickerson's 1998 review; [[evidence-grade]] B). It's strongest once you hold a position: every green candle confirms the idea, every red one is 'noise'. Willpower doesn't fix it. A written test does: what would prove this idea wrong?",
      },
      {
        kind: "hotspot",
        title: "Find the other side",
        prompt: "You're long, and the rising 20-period MA says 'hold'. Look for the other side: tap the evidence against the long.",
        chart: { candles: L_2_12_5_HIGHS, layers: [{ kind: "ma", period: 20, role: "concept", label: "20 MA" }] },
        zones: [
          {
            id: "rally",
            label: "Rally candle",
            index: 15,
            feedback: "That's part of the rally before the top: evidence for the trend, and old news. Look at what happened after 103.80.",
          },
          { id: "top", label: "The top", index: 20, feedback: "That's the top, 103.80. The evidence against the long is what came after it." },
          { id: "third-lower-high", label: "Third lower high", index: 29 },
          {
            id: "last",
            label: "Last candle",
            index: 30,
            feedback: "The last close, 102.15, sits above the rising MA: that's the evidence for the long you already see. Look at the rally highs since the top.",
          },
        ],
        answer: "third-lower-high",
        correct:
          "The third lower high. Since the 103.80 top, each rally has stopped lower: 103.40, 103.00, 102.60. The MA still rises because it averages 20 closes, most of them from the rally; the highs show what buyers are doing now.",
        concept: "confirmation-bias",
      },
      {
        kind: "explain",
        title: "Anchors",
        text: "[[anchoring|Anchoring]]: a number you've just seen pulls your estimate toward it. In a classic study, people spun a wheel that stopped at 10 or 65, then estimated the share of African countries in the UN. The median answers were 25% and 45% (Tversky and Kahneman, 1974; [[evidence-grade]] A in the lab). The wheel was irrelevant. So is your entry price.",
      },
      {
        kind: "match",
        title: "Anchors in trading",
        prompt: "Three common anchors. Match each one to how it sounds in your head.",
        pairs: [
          {
            left: "Your entry price",
            right: "'I'll get out once it's back to where I bought.'",
            wrong: "The entry anchor shows up as waiting for break-even: the price where you got in.",
          },
          {
            left: "An old high",
            right: "'It was 120.00 last year, so 95.00 is cheap.'",
            wrong: "An old high makes today's price look cheap or dear by comparison, though it says nothing about now.",
          },
          {
            left: "An analyst's target",
            right: "'The target is 130.00, so I'll hold through my stop.'",
            wrong: "Someone else's target can override your own stop. That's the anchor here.",
          },
        ],
        columns: ["Anchor", "In your head"],
        concept: "anchoring",
      },
      {
        kind: "worked",
        title: "The break-even detector",
        lines: [
          "Your last 60 trades: 20 went at least 0.5R against you before coming back.",
          "9 of those 20 were closed within 0.10 of the entry price.",
          "Of the other 40 trades, 3 closed that close to entry: 7.5%.",
          "Share of the 20 closed at break-even = ?",
        ],
        ask: {
          answer: 45,
          tolerance: 0.5,
          unit: "%",
          feedback: [{ value: 9, text: "That's the count. As a share: 9 ÷ 20." }],
          correct:
            "Right: 45%, against 7.5% for trades that never went against you. Exits pile up at your entry price only after a drawdown: the anchor, not the chart, picks the exit.",
        },
        concept: "anchoring",
      },
      { kind: "callout", tone: "key", text: "Before entry, write the price that proves you wrong. During the trade, list the evidence against you first." },
      {
        kind: "fields",
        title: "Your invalidation",
        prompt:
          "A new long idea at 101.20. The last swing low is 100.90, and your rule puts invalidation 0.10 below the last swing low. Set the price that proves the idea wrong.",
        fields: [
          { id: "invalidation", label: "Invalidation price", kind: "stepper", min: 100.0, max: 101.1, step: 0.1, default: 101.1 },
          { id: "other", label: "Anything else that would prove you wrong", kind: "text", default: "", placeholder: "e.g. a close below the 20-period MA" },
        ],
        valid: { field: "invalidation", lte: 100.8 },
        correct: "Written down: below 100.80, the idea is wrong. Your stop goes there, decided now, while you have no position to defend.",
        feedback: [
          {
            when: { field: "invalidation", gt: 100.8 },
            text: "That's above 100.80: at the 100.90 swing low or within 0.10 of it. Normal noise could hit it without proving anything. The rule: 0.10 below the swing low.",
          },
        ],
        concept: "invalidation-level",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: { cards: DEVIL_CARDS, options: DEVIL_OPTIONS },
      goal: "Now play devil's advocate on your 101.20 long. Five items from the chart and the data: sort each one as for or against the idea.",
      success: { field: "solved", eq: 5 },
      correct:
        "Two items argue against the long: the lower highs and the heavier volume on the falls. Written down before entry, they become conditions to watch, not noise to wave off.",
      hints: [
        "Ask of each item: would a buyer be glad to read this?",
        "Rallies that stop lower, and heavier volume on falls, both point to weaker demand.",
        "Two items are against: the lower highs and the volume.",
      ],
      showMe: { solved: 5 },
      concept: "confirmation-bias",
    },
    check: ["q-2.12.5-1", "q-2.12.5-2", "q-2.12.5-3"],
    recap: {
      takeaways: [
        "Once you hold a trade, you see what agrees with it. Look for the evidence against first.",
        "Your entry price is an anchor: it matters to you, not to the market.",
        "Write the invalidation before entry, and play devil's advocate while the trade is open.",
      ],
    },
  },
};

// ─── 2.12.6 · Sunk cost and house money ────────────────────────────────────

const L_2_12_6: Lesson = {
  id: "2.12.6",
  title: "Sunk cost and house money",
  topic: "psychology",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "What's already lost or won shouldn't change your next decision: apply the fresh-eyes test and keep risk per trade flat.",
  objectives: [
    "Recognise the sunk-cost trap in holding or adding to a loser.",
    "Recognise the house-money effect: taking more risk after gains.",
    "Apply the \"fresh eyes\" test and keep risk per trade flat after wins and after losses.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
    { kind: "mission", ref: "M05", label: "Size Matters" },
  ],
  script: {
    unit: "2.12",
    courseId: "2.12.6",
    hook: {
      prompt:
        "After three wins you're up 400.00 vUSD. The next setup appears and you size it at 2% because 'it's the market's money'. Is that money different from the rest of your account?",
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
        ],
        answer: "no",
      },
      compare: "You chose “{yours}”. It isn't: the 400.00 is your money now. The plan's 1% of 10,400.00 is 104.00; 2% puts 208.00 at risk.",
      concept: "house-money-effect",
    },
    learn: [
      {
        kind: "explain",
        title: "Sunk cost",
        text: "A [[sunk-cost|sunk cost]] is money already gone. Arkes and Blumer (1985) found that people who'd paid full price for theatre season tickets went to more plays than those given discounts ([[evidence-grade]] B). In trading: holding or adding to a loser because of what it has cost, or depositing more money to 'save' a position.",
      },
      {
        kind: "explain",
        title: "House money",
        text: "After a gain, people accept bets they'd otherwise refuse: the [[house-money-effect|house-money effect]]. After a loss, they seek bets that could get them back to even: the breakeven effect (Thaler and Johnson, 1990). The evidence comes from hypothetical choices in small samples ([[evidence-grade]] C). Both are mental accounting: money treated differently depending on where it came from.",
      },
      {
        kind: "worked",
        title: "Risk after a win, risk after a loss",
        lines: [
          "A sample journal of 30 trades, each planned at 1% risk. The first has no trade before it.",
          "17 trades followed a loss. Their risk adds up to 17.0% of equity: 1.0% each on average.",
          "12 trades followed a win. Their risk adds up to 19.2% of equity.",
          "Average risk after a win: 19.2% ÷ 12 = ?",
        ],
        ask: {
          answer: 1.6,
          tolerance: 0.05,
          unit: "%",
          feedback: [{ value: 1, text: "That's the average after a loss. After a win: 19.2 ÷ 12." }],
          correct: "Right: 1.6% after a win, against 1.0% after a loss. Risk climbs after gains: the house-money pattern, in numbers.",
        },
        concept: "house-money-effect",
      },
      {
        kind: "figure",
        title: "The pattern in one picture",
        text: "Average risk per trade in the sample journal, against the plan.",
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "Plan", value: 1, role: "neutral" },
            { label: "After a win", value: 1.6, role: "down" },
            { label: "After a loss", value: 1, role: "neutral" },
          ],
          steps: [
            "The plan: 1% on every trade.",
            "After a win: 1.6% on average, 60% more risk than planned.",
            "After a loss: 1.0%, as planned. The extra risk comes only after gains.",
          ],
        },
        concept: "house-money-effect",
      },
      {
        kind: "predict",
        title: "The fresh-eyes test",
        prompt:
          "Your long needed LABX to hold 101.00. It closed at 100.90 two candles ago; your stop at 100.40 isn't hit. You're down 0.7R. If you were flat now, would you open this long?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes, at the same size", feedback: "The level your idea relied on has broken. A trader looking at this chart fresh wouldn't buy on this idea." },
            { id: "no", label: "No" },
            {
              id: "add",
              label: "Yes, and bigger, to lower my average",
              feedback: "Adding to bring the average down is the sunk-cost trap with more size. What's already lost doesn't enter the decision.",
            },
          ],
          answer: "no",
        },
        reveal:
          "Then the position fails its own test: close it, or cut it to what you'd open now. The fresh-eyes question ignores what the trade has cost and asks only what the chart says now.",
        concept: "sunk-cost",
      },
      {
        kind: "match",
        title: "Name the voice",
        prompt: "Three sentences traders tell themselves. Match each one to the bias behind it.",
        pairs: [
          {
            left: "'I've lost too much on this to sell now.'",
            right: "Sunk cost",
            wrong: "This looks back at money already lost. That's sunk cost; house money is about profits.",
          },
          { left: "'It's the market's money, I can risk more.'", right: "House money", wrong: "Profits that feel like free money: the house-money effect." },
          {
            left: "'One more trade and I'm back to even.'",
            right: "Breakeven effect",
            wrong: "Getting back to even after a loss is the breakeven effect, the pull behind revenge trading.",
          },
        ],
        columns: ["What you hear", "Bias"],
        concept: "house-money-effect",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Fixed fractional sizing keeps risk flat by construction: [[risk-per-trade|risk per trade]] is 1% of current equity after a win, after a loss and after a streak. What's already won or lost never sets the size.",
      },
    ],
    check: ["q-2.12.6-1", "q-2.12.6-2", "q-2.12.6-3"],
    recap: {
      takeaways: [
        "Sunk cost: what a position has cost can't be recovered by holding it. Decide on today's chart.",
        "House money: profits are your money. Risk after a win should match risk after a loss.",
        "Fresh eyes: would you open it now, at this size? Keep risk per trade flat.",
      ],
    },
  },
};

// ─── 2.12.7 · Tilt and routines ────────────────────────────────────────────

const L_2_12_7: Lesson = {
  id: "2.12.7",
  title: "Tilt and routines",
  topic: "psychology",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Tilt shows up as a cluster of rule breaks; guard-rails set before the session and a reset routine keep it from running the account.",
  objectives: [
    "Recognise tilt as a cluster of rule breaks, not just a feeling.",
    "Set guard-rails before the session: a cool-down, a tilt threshold, a daily lock and a readiness check.",
    "Use reappraisal and a reset routine instead of suppressing emotion.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M06", label: "The FOMO Trap" },
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
  ],
  script: {
    unit: "2.12",
    courseId: "2.12.7",
    hook: {
      prompt: "Your last 10 trades include 4 rule breaks, 3 of them in the last 4 trades. What's the best next action?",
      control: {
        kind: "choice",
        choices: [
          { id: "smaller", label: "Trade smaller" },
          { id: "reset", label: "Pause and run your reset routine" },
          { id: "carry-on", label: "Keep going, carefully" },
          { id: "quit-week", label: "Quit for the week" },
        ],
        answer: "reset",
      },
      compare:
        "You chose “{yours}”. Three breaks in four trades is a cluster: the plan isn't running the account. Pause and reset first; size and the rest of the week come after.",
      concept: "tilt",
    },
    learn: [
      {
        kind: "explain",
        title: "Tilt is a pattern, not a mood",
        text: "[[tilt|Tilt]], a word from poker, is a state in which emotion overrides the plan. You can't see a feeling in your journal, but you can see what it does: rule breaks come in clusters. This course's tilt index counts the rule breaks in your last 10 trades. It's a process measure defined by the app, not a diagnosis.",
      },
      {
        kind: "figure",
        title: "A session, trade by trade",
        text: "The tilt index through one session. The hook's situation is trade 10.",
        figure: {
          kind: "bars",
          unit: "breaks",
          bars: [
            { label: "T1", value: 0, role: "neutral" },
            { label: "T2", value: 0, role: "neutral" },
            { label: "T3", value: 1, role: "neutral" },
            { label: "T4", value: 1, role: "neutral" },
            { label: "T5", value: 1, role: "neutral" },
            { label: "T6", value: 1, role: "neutral" },
            { label: "T7", value: 2, role: "neutral" },
            { label: "T8", value: 3, role: "down" },
            { label: "T9", value: 3, role: "down" },
            { label: "T10", value: 4, role: "down" },
          ],
          steps: [
            "Each bar: rule breaks in the last 10 trades, counted after that trade.",
            "Breaks at trades 3, 7, 8 and 10: three of them in four trades.",
            "With a threshold of 3, trading would have locked after trade 8.",
          ],
        },
        concept: "tilt",
      },
      {
        kind: "explain",
        title: "What the evidence says",
        text: "The evidence is modest. Lo, Repin and Steenbarger (2005) followed 80 day traders: more intense emotional reactions went with worse results ([[evidence-grade]] B). In interviews, better-performing bank traders regulated early, by reframing (Fenton-O'Creevy and colleagues, 2011; grade C, qualitative). Hormone studies are small, such as 17 traders in Coates and Herbert (2008): grade C.",
      },
      {
        kind: "match",
        title: "Three ways to handle a loss",
        prompt: "A loss can be handled early or late. Match each sentence to the strategy it uses.",
        pairs: [
          {
            left: "'This loss is one draw from my distribution.'",
            right: "Reappraisal: changes the meaning early",
            wrong: "This sentence reframes the loss before the feeling builds. That's reappraisal.",
          },
          { left: "'I feel nothing. Push on.'", right: "Suppression: hides the feeling", wrong: "Denying the feeling and carrying on is suppression: the feeling is still there." },
          { left: "'Don't look at the positions.'", right: "Avoidance: looks away", wrong: "Looking away from open risk is avoidance, not a reframe." },
        ],
        columns: ["What you say", "Strategy"],
        correct: "In the interview study, better traders leaned on reappraisal. Suppression leaves the feeling in place, and avoidance leaves open risk unwatched.",
        concept: "tilt",
      },
      {
        kind: "order",
        title: "The reset routine",
        prompt: "When the tilt index hits your threshold, run the reset. Put the steps in order.",
        items: [
          "Stop: hands off the order ticket",
          "Start the cool-down timer",
          "Breathe and reflect",
          "Name the rule you broke",
          "Run the pre-trade checklist",
          "Resume at normal size, or end the session",
        ],
        explain: "That's the routine. It turns 'I should calm down' into steps you can check, and it ends with a decision, not a mood.",
        concept: "cooling-off-pause",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Structure beats willpower. Guard-rails decided before the session make the right action the easy one when judgement is weakest.",
      },
      {
        kind: "fields",
        title: "Your guard-rails",
        prompt: "Set your [[guard-rail|guard-rails]] now, before any session. When the moment comes, they decide for you.",
        fields: [
          { id: "cooldown", label: "Cool-down after a loss", kind: "stepper", min: 5, max: 60, step: 5, unit: "min", default: 15 },
          { id: "tiltThreshold", label: "Lock trading at __ rule breaks in 10 trades", kind: "stepper", min: 2, max: 5, step: 1, default: 3 },
          { id: "dailyLock", label: "Daily lock: stop for the day at a loss of", kind: "stepper", min: 1, max: 5, step: 0.5, unit: "R", default: 3 },
          { id: "readiness", label: "Readiness check: I skip the session if", kind: "text", default: "", placeholder: "e.g. under 6 hours' sleep, stressed, or ill", required: true },
        ],
        correct: "Saved. Each one is a decision made while calm, ready for the moment when you won't be.",
        concept: "behavioural-guard-rails",
      },
      {
        kind: "worked",
        title: "Where would the lock have come?",
        lines: [
          "Guard-rails: lock at 3 rule breaks in 10 trades, or at a day's loss of 3R.",
          "T1 −1.0R. T2 +2.0R. T3 −1.0R. Day: 0.0R, no breaks.",
          "T4 −1.0R, entered before the cool-down ended. T5 −1.4R, stop moved further away.",
          "T6 +0.5R. T7 −1.0R, taken with no setup. Day: −2.9R.",
          "Which trade triggers the lock?",
        ],
        ask: {
          answer: 7,
          tolerance: 0,
          feedback: [
            { value: 5, text: "After trade 5 there are two breaks and the day is at −2.4R. Neither guard-rail has triggered yet." },
            { value: 8, text: "Trade 7 is the third break, so there's no trade 8." },
          ],
          correct: "Trade 7: the third rule break locks trading, although the day's loss, −2.9R, hasn't reached 3R. Rule breaks warn earlier than losses do.",
        },
        concept: "behavioural-guard-rails",
      },
    ],
    check: ["q-2.12.7-1", "q-2.12.7-2", "q-2.12.7-3"],
    recap: {
      takeaways: [
        "Tilt shows as a cluster of rule breaks; count them over your last 10 trades.",
        "Set guard-rails before the session: cool-down, tilt threshold, daily lock and readiness check.",
        "Reappraise early and run the reset routine, rather than pushing the feeling down.",
      ],
    },
  },
};

// ─── 2.12.9 · Thinking in probabilities ────────────────────────────────────

const L_2_12_9: Lesson = {
  id: "2.12.9",
  title: "Thinking in probabilities",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Each trade is one draw from a distribution: a positive-expectancy system still loses over short stretches, so judge blocks of trades by process.",
  objectives: [
    "Treat each trade as one draw from a distribution, not as a test of being right.",
    "Show that a positive-expectancy system still loses over short stretches.",
    "Commit to executing a block of 20 setups by the rules and judge the block by process.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "check", ref: "decision_making", label: "Knowledge check: decision making" },
  ],
  script: {
    unit: "2.12",
    courseId: "2.12.9",
    hook: {
      prompt:
        "Your system makes +0.40R per trade on average: it wins 40% of trades at +2.5R and loses 60% at −1R. Over the next 10 trades, how likely is a net loss?",
      control: { kind: "slider", min: 0, max: 100, step: 1, unit: "%", answer: 17 },
      compare: "You guessed {yours}%. It's 16.7%: about one stretch of 10 trades in six ends in a loss, with a positive edge and every rule followed.",
      concept: "probabilistic-thinking",
    },
    learn: [
      {
        kind: "explain",
        title: "One draw from many",
        text: "Mark Douglas put it this way: an edge is a higher probability over a series, not a certainty on any one trade. Each trade is one draw from your system's distribution. His 'five truths' are a practitioner's framework, not a tested result ([[evidence-grade]] C), but the arithmetic behind them is exact. That's [[probabilistic-thinking|probabilistic thinking]]: judge the series, not the draw.",
      },
      {
        kind: "worked",
        title: "How often a good system loses",
        lines: [
          "Same system, +0.40R per trade. Chance of a net loss over 10 trades: 16.7%; over 20: 12.6%; over 50: 5.4%; over 100: 0.8%.",
          "Over 5 trades, one win (+2.5R) can't cover four losses (−4R), so a net loss means zero or one win.",
          "No wins: 0.6⁵ = 0.0778. Exactly one win: 5 × 0.4 × 0.1296 (that's 0.6⁴).",
          "Chance of a net loss over 5 trades, in %: ?",
        ],
        ask: {
          answer: 33.7,
          tolerance: 0.1,
          unit: "%",
          feedback: [
            { value: 7.8, text: "That's only the no-win case. Add exactly one win: 5 × 0.4 × 0.1296 = 0.2592." },
            { value: 25.9, text: "That's only the one-win case. Add the no-win case, 0.0778." },
          ],
          correct: "Right: 0.0778 + 0.2592 = 33.7%. One stretch of five trades in three ends in a loss, from a system that makes +0.40R per trade.",
        },
        concept: "probabilistic-thinking",
      },
      {
        kind: "figure",
        title: "Five blocks, one system",
        text: "Five simulated blocks of 20 trades from that system, every rule followed. Expected result per block: 20 × 0.40R = +8.0R.",
        figure: {
          kind: "bars",
          unit: "R",
          bars: [
            { label: "Block 1", value: 8, role: "up" },
            { label: "Block 2", value: 15, role: "up" },
            { label: "Block 3", value: -2.5, role: "down" },
            { label: "Block 4", value: 1, role: "up" },
            { label: "Block 5", value: 15, role: "up" },
          ],
          steps: [
            "Same system, same rules, five blocks of 20 trades.",
            "Results run from −2.5R to +15.0R. One block lost; one barely made anything.",
            "Process score: 100% in every block. Only the draws differed.",
          ],
        },
        concept: "variance",
      },
      {
        kind: "match",
        title: "Five truths, five traps",
        prompt: "Douglas's five truths, paraphrased. Match each one to the trap it guards against.",
        pairs: [
          {
            left: "Anything can happen",
            right: "Skipping the stop because 'this one is certain'",
            wrong: "If anything can happen, no trade is certain enough to go without a stop.",
          },
          { left: "You don't need to know what happens next", right: "Waiting for certainty and missing valid setups" },
          { left: "Wins and losses come in random order", right: "Dropping the method after three losses" },
          {
            left: "An edge is only a higher probability",
            right: "Sizing up because a trade 'can't lose'",
            wrong: "An edge tilts the odds; it doesn't remove losses. Sizing up on a 'sure thing' forgets that.",
          },
          { left: "Every moment is unique", right: "Expecting a repeat of last week's big winner" },
        ],
        columns: ["Truth", "Trap it prevents"],
        concept: "probabilistic-thinking",
      },
      {
        kind: "explain",
        title: "Broad framing",
        text: "Narrow framing judges each trade on its own, so every loss feels like a verdict. [[broad-framing|Broad framing]] judges a series. In your journal, that means a block view: 20 trades at a time, scored first by process, then by net R. One trade shows what one draw did; a block starts to show what the system does.",
      },
      { kind: "callout", tone: "key", text: "You don't need to know what happens next to act on an edge. You need the next 20 trades taken by the rules." },
      {
        kind: "worked",
        title: "Five more blocks",
        lines: [
          "Five more simulated blocks of 20 trades from the same system, every rule followed.",
          "Net results: +11.5R, +11.5R, +18.5R, −9.5R, −2.5R. Process score: 100% in each.",
          "Gap between the best and the worst block, in R = ?",
        ],
        ask: {
          answer: 28,
          tolerance: 0.1,
          unit: "R",
          feedback: [
            { value: 9, text: "That's 18.5 − 9.5. The worst block lost 9.5R, so subtract a negative: 18.5 − (−9.5)." },
            { value: 21, text: "That's 18.5 − (−2.5). The worst block is −9.5R." },
          ],
          correct:
            "Right: 28.0R between blocks of the same system, run the same way. The −9.5R block wasn't a broken process; the journal says so. Judge it by the 100%.",
        },
        concept: "variance",
      },
      {
        kind: "fields",
        title: "Your next block",
        prompt: "Commit to your next block before it starts: how many trades, the risk, and how you'll judge it.",
        fields: [
          { id: "block", label: "Trades in the block", kind: "stepper", min: 20, max: 50, step: 5, default: 20 },
          { id: "risk", label: "Risk per trade, fixed for the whole block", kind: "choice", options: [0.5, 1, 2], unit: "%", default: 1 },
          { id: "judge", label: "How I'll judge the block", kind: "text", default: "", placeholder: "e.g. process score first, then net R", required: true },
        ],
        valid: { field: "risk", lte: 1 },
        correct: "Committed. No rule changes until the block is done; then review it as one result.",
        feedback: [{ when: { field: "risk", gt: 1 }, text: "2% doubles every loss in the block. The plan's 1% is the ceiling: you may use less, never more." }],
        concept: "probabilistic-thinking",
      },
    ],
    check: ["q-2.12.9-1", "q-2.12.9-2", "q-2.12.9-3"],
    recap: {
      takeaways: [
        "Each trade is one draw from a distribution; an edge shows over a series, not a trade.",
        "A +0.40R system still loses 33.7% of 5-trade stretches and 16.7% of 10-trade stretches.",
        "Commit to blocks of 20 trades by the rules, and judge each block by process first.",
      ],
    },
  },
};

// ─── Check questions ───────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 2.12.1
  {
    id: "q-2.12.1-1",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "Prospect theory says outcomes are judged as gains or losses from a reference point. Which two ideas complete its three parts?",
    options: [
      { id: "a", label: "Diminishing sensitivity and loss aversion" },
      {
        id: "b",
        label: "Expected value and the law of large numbers",
        rationale: "Those describe what a bet is worth on average. Prospect theory describes how people feel and choose, which often departs from expected value.",
      },
      {
        id: "c",
        label: "Anchoring and confirmation bias",
        rationale: "Both are biases, but other ones. Prospect theory's parts are about how gains and losses are felt.",
      },
      { id: "d", label: "Risk per trade and position size", rationale: "Those are rules you set. Prospect theory describes the pulls those rules have to resist." },
    ],
    correct: "a",
    explanation:
      "Prospect theory has three parts: a reference point that splits outcomes into gains and losses, diminishing sensitivity (each extra unit matters less) and loss aversion (losses weigh more than equal gains). Together they predict caution with gains and risk-taking with losses.",
    lesson: "2.12.1",
    concepts: ["prospect-theory"],
  },
  {
    id: "q-2.12.1-2",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Two open trades. Trade A is +0.5R and you feel the urge to close it now. Trade B is −0.6R and you feel the urge to give it more room, hoping it comes back to zero.",
    prompt: "What does prospect theory say about these two urges?",
    options: [
      { id: "a", label: "Risk-seeking in gains, risk-averse in losses", rationale: "That's the reverse. Closing A early avoids risk; holding B for a comeback takes more risk." },
      { id: "b", label: "Both show sound risk management", rationale: "Neither urge comes from the plan. Both come from where each trade stands against your entry price." },
      { id: "c", label: "Risk-averse in gains, risk-seeking in losses" },
      {
        id: "d",
        label: "Both are loss aversion alone; the frame plays no part",
        rationale: "Loss aversion explains part of B, but A has no loss. The frame, gain or loss from entry, flips your attitude to risk.",
      },
    ],
    correct: "c",
    explanation:
      "Above the reference point, a sure gain feels better than a chance of more, so you close A early. Below it, locking in a loss hurts more than a gamble on a comeback, so you hold B. Same trader, opposite attitudes to risk, set by the frame.",
    lesson: "2.12.1",
    concepts: ["prospect-theory", "loss-aversion"],
    hints: ["Compare where each trade stands against its entry price.", "Which urge avoids risk, and which one takes more?"],
  },
  {
    id: "q-2.12.1-3",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Your journal over 40 trades: average winner +0.7R, average loser −1.3R. Your plan's stop is 1R and your target 2R. You moved 9 stops further away and closed 11 winners before the target.",
    prompt: "What's the best reading, and the process fix?",
    options: [
      {
        id: "a",
        label: "The method has no edge: switch to a new one",
        rationale: "The journal shows exits that broke the plan, not a tested method failing. A new method would meet the same pulls.",
      },
      {
        id: "b",
        label: "Bad luck: keep going unchanged",
        rationale: "Moved stops and early exits are decisions, not luck. They explain why losers are bigger than 1R and winners smaller than 2R.",
      },
      {
        id: "c",
        label: "Use a closer target, so winners hit more often",
        rationale: "That bakes the early exits into the plan. Winners shrink while losers stay large.",
      },
      { id: "d", label: "The prospect-theory pattern: set exits at entry and never move the stop away" },
    ],
    correct: "d",
    explanation:
      "Losers averaging −1.3R against a 1R stop, and winners at +0.7R against a 2R target, show risk-seeking in losses and caution in gains. The fix is structure: stops and targets set at entry, stops never moved away, and early exits only by a rule such as a time stop.",
    lesson: "2.12.1",
    concepts: ["prospect-theory", "exit-rules"],
    hints: ["Compare the averages with the plan: a 1R stop and a 2R target.", "Which decisions made losers bigger and winners smaller?"],
  },
  // 2.12.2
  {
    id: "q-2.12.2-1",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "Your sample journal shows PGR 0.30 and PLR 0.15. What does that mean?",
    options: [
      { id: "a", label: "You hold winners too long and sell losers too fast", rationale: "That's the reverse. A PGR above PLR means gains are sold faster and losses kept." },
      { id: "b", label: "Your win rate is 30%", rationale: "PGR isn't a win rate. It's the share of available gains you chose to realise when you sold." },
      { id: "c", label: "You realise gains at twice the rate of losses: a disposition effect of 0.15" },
      { id: "d", label: "Your losses are twice as large as your gains", rationale: "PGR and PLR count how often you sell, not how big the results are." },
    ],
    correct: "c",
    explanation:
      "PGR is the share of paper gains you realised; PLR is the share of paper losses. 0.30 against 0.15 means gains were sold at twice the rate of losses: a disposition effect of 0.30 − 0.15 = 0.15. Zero would mean no difference.",
    lesson: "2.12.2",
    concepts: ["disposition-effect"],
  },
  {
    id: "q-2.12.2-2",
    topic: "psychology",
    kind: "numeric",
    difficulty: 2,
    prompt:
      "A plan wins 40% of trades at a +2.5R target and loses 1R otherwise. You start closing winners at +1.0R, with the same trades winning. What's the expectancy per trade, in R?",
    numeric: { answer: -0.2, tolerance: 0.01, unit: "R" },
    explanation:
      "Wins: 0.40 × 1.0R = 0.40R. Losses: 0.60 × 1R = 0.60R. Expectancy: 0.40 − 0.60 = −0.20R per trade, against +0.40R with the target. Early exits on winners can turn a working plan into a losing one.",
    lesson: "2.12.2",
    concepts: ["disposition-effect", "expectancy"],
    hints: [
      "Expectancy = win rate × average win − loss rate × average loss.",
      "Use the early exit, not the target, as the average win.",
      "0.40 × 1.0 − 0.60 × 1 = ?",
    ],
    vary: {
      fields: { w: [30, 50, 10], e: [0.5, 1.5, 0.1] },
      answer: "round(pct(w) * e - (1 - pct(w)), 2)",
      prompt:
        "A plan wins {w}% of trades at a +2.5R target and loses 1R otherwise. You start closing winners at +{e:1}R, with the same trades winning. What's the expectancy per trade, in R?",
      explanation:
        "Wins: {pct(w):2} × {e:1}R = {pct(w) * e:2}R. Losses: {1 - pct(w):2} × 1R = {1 - pct(w):2}R. Expectancy: {answer:2}R per trade, against {pct(w) * 2.5 - (1 - pct(w)):2}R with the target.",
      hint: "{pct(w):2} × {e:1} − {1 - pct(w):2} × 1 = ?",
    },
  },
  {
    id: "q-2.12.2-3",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "You're long at +1.1R. Your plan: stop 1R below entry, target +2.5R, time stop after 20 candles. It's candle 9, nothing in the setup has changed, and you feel a strong urge to lock it in.",
    prompt: "Which exit decision follows the plan?",
    options: [
      { id: "a", label: "Close now: a profit is a profit", rationale: "That's the disposition effect at work. None of the plan's exits has triggered, and the setup hasn't changed." },
      { id: "b", label: "Hold: let the stop, the target or the time stop end the trade" },
      {
        id: "c",
        label: "Move the target closer, to 1.5R, since you're in profit",
        rationale: "Changing the target because the trade is green lets P&L decide. Target changes belong in the plan, before entry.",
      },
      {
        id: "d",
        label: "Widen the stop, so a pullback can't stop you out",
        rationale: "Widening a stop raises risk and is never a rule-based exit. A stop moves only in your favour, by rule.",
      },
    ],
    correct: "b",
    explanation:
      "Exits come from rules set at entry: stop, target, time stop, or an opposing signal named in the plan. None has triggered, so the plan says hold. The urge to lock in a gain is the disposition effect, and it shrinks average winners.",
    lesson: "2.12.2",
    concepts: ["disposition-effect", "exit-rules"],
    hints: ["Which of the plan's exits has triggered?", "Is the urge coming from the chart or from the open profit?"],
  },
  // 2.12.3
  {
    id: "q-2.12.3-1",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which confidence log shows overconfidence as miscalibration?",
    options: [
      { id: "a", label: "Average confidence 85%, hit rate 62%" },
      { id: "b", label: "Average confidence 55%, hit rate 70%", rationale: "Here the hit rate beats the stated confidence. That's underconfidence, the opposite gap." },
      { id: "c", label: "Average confidence 70%, hit rate 71%", rationale: "A 1-point gap is calibrated: the stated confidence matches the record." },
      { id: "d", label: "Ten winning trades in a row", rationale: "A streak says nothing about calibration. Overconfidence is measured by comparing stated confidence with the hit rate." },
    ],
    correct: "a",
    explanation:
      "Overconfidence as miscalibration means being sure more often than you're right: stated confidence above the hit rate. 62 − 85 = −23 points is a clear gap.",
    lesson: "2.12.3",
    concepts: ["overconfidence"],
  },
  {
    id: "q-2.12.3-2",
    topic: "psychology",
    kind: "numeric",
    difficulty: 2,
    prompt: "Over 40 trades you logged an average confidence of 80% and were right 26 times. What's your calibration gap, in points?",
    numeric: { answer: -15, tolerance: 0.5, unit: "points" },
    explanation:
      "Hit rate: 26 ÷ 40 = 65%. Gap: 65 − 80 = −15 points. Negative means your confidence ran 15 points ahead of your record: overconfident.",
    lesson: "2.12.3",
    concepts: ["overconfidence"],
    hints: ["Gap = hit rate − average confidence.", "First turn 26 out of 40 into a percentage.", "26 ÷ 40 = 65%. 65 − 80 = ?"],
    vary: {
      fields: { conf: [60, 90, 5], hits: [16, 36, 1] },
      answer: "round(hits / 40 * 100 - conf, 1)",
      prompt: "Over 40 trades you logged an average confidence of {conf}% and were right {hits} times. What's your calibration gap, in points?",
      explanation:
        "Hit rate: {hits} ÷ 40 = {hits / 40 * 100:1}%. Gap: {hits / 40 * 100:1} − {conf} = {answer:1} points. Negative means confidence ran ahead of the record; positive means it lagged behind.",
      hint: "{hits} ÷ 40 = {hits / 40 * 100:1}%. Then subtract {conf}.",
    },
  },
  {
    id: "q-2.12.3-3",
    topic: "psychology",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "After a winning month you feel sharp. Your confidence log averages 85%, but your hit rate is 58%. You've gone from 6 to 18 trades a week. Costs are about 0.20R per trade.",
    prompt: "What's the best reading?",
    options: [
      {
        id: "a",
        label: "Good form: trade more while it lasts",
        rationale: "A 58% hit rate against 85% confidence says the feeling of form outruns the record. Each extra trade adds 0.20R of cost.",
      },
      {
        id: "b",
        label: "Calibrated: the winning month proves it",
        rationale: "A month of results can't show calibration. The log compares stated confidence with outcomes, and the gap is 27 points.",
      },
      { id: "c", label: "Underconfident: raise your size", rationale: "Underconfident means right more often than you said. Here you're right less often: 58% against 85%." },
      { id: "d", label: "Overconfident: the 12 extra trades cost about 2.4R a week. Back to playbook setups only" },
    ],
    correct: "d",
    explanation:
      "58 − 85 = −27 points: overconfident. The jump from 6 to 18 trades adds 12 × 0.20R = 2.4R of costs a week, for certain, while any edge in the extra trades is unproven. Overconfidence often shows first in the trade count.",
    lesson: "2.12.3",
    concepts: ["overconfidence", "overtrading"],
    hints: ["Compute the gap: hit rate − average confidence.", "Extra trades × cost per trade = extra cost a week."],
  },
  // 2.12.4
  {
    id: "q-2.12.4-1",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt:
      "A setup has won 45% of its 200 trades. After three losses in a row, a trader halves the size on the next valid signal, though the plan doesn't say to. Which bias is at work?",
    options: [
      { id: "a", label: "Anchoring", rationale: "Anchoring ties judgement to a number such as your entry price. Here the last three results are doing the steering." },
      { id: "b", label: "Recency bias" },
      { id: "c", label: "House-money effect", rationale: "House money raises risk after gains. This is a cut in size after losses." },
      { id: "d", label: "Disposition effect", rationale: "The disposition effect is about exits on open trades. This is the size of a new trade after recent losses." },
    ],
    correct: "b",
    explanation:
      "The base rate, 45% over 200 trades, hasn't changed, but the last three results feel more telling. Cutting size on a valid signal because of them is recency bias. A drawdown rule written in the plan is fine; an improvised cut isn't.",
    lesson: "2.12.4",
    concepts: ["recency-bias", "base-rates"],
  },
  {
    id: "q-2.12.4-2",
    topic: "psychology",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which result is the stronger evidence of a real edge?",
    options: [
      {
        id: "a",
        label: "System A: +1.20R per trade over 12 trades",
        rationale: "A high average from 12 trades sits inside a very wide interval. Small samples look more convincing than they are.",
      },
      {
        id: "b",
        label: "Both are equally strong; A's average is just higher",
        rationale: "Evidence depends on the sample size as well as the average. 300 trades narrow the interval far more than 12.",
      },
      { id: "c", label: "System B: +0.25R per trade over 300 trades" },
      {
        id: "d",
        label: "Neither: past results never show anything",
        rationale: "Large samples do carry evidence: the interval narrows as trades add up. That's why 300 trades beat 12.",
      },
    ],
    correct: "c",
    explanation:
      "The interval around an average narrows with the square root of the number of trades. Over 12 trades, +1.20R can easily be luck; over 300 trades, +0.25R is much harder to get by chance. Trusting the short, hot sample is the law of small numbers.",
    lesson: "2.12.4",
    concepts: ["sample-size"],
    hints: ["Which sample has the narrower interval?", "An interval's width shrinks as the number of trades grows."],
  },
  {
    id: "q-2.12.4-3",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario: "A new setup made +1.5R per trade over its first 15 trades. A long test, after costs, puts its edge at about +0.3R per trade.",
    prompt: "What should you expect from the next 15 trades?",
    options: [
      {
        id: "a",
        label: "About +1.5R per trade again: the setup is hot",
        rationale: "That treats the hot start as the edge. Part of it was luck, and luck doesn't carry over.",
      },
      {
        id: "b",
        label: "A loss, to balance out the good start",
        rationale: "That's the gambler's fallacy. Results don't owe the average anything; they just stop being extreme.",
      },
      {
        id: "c",
        label: "Nothing can be said at all",
        rationale: "The long test is the best estimate available. Expect results near it, with wide variation over 15 trades.",
      },
      { id: "d", label: "Something closer to +0.3R per trade" },
    ],
    correct: "d",
    explanation:
      "Extreme results mix edge and luck. The edge carries over and the luck doesn't, so the next stretch tends to sit closer to the long-run average: regression to the mean. A drop from +1.5R to around +0.3R isn't proof that the setup broke.",
    lesson: "2.12.4",
    concepts: ["regression-to-the-mean"],
    hints: ["Split the hot start into edge and luck.", "Which part carries over to the next 15 trades?"],
  },
  // 2.12.5
  {
    id: "q-2.12.5-1",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "You're long LABX. Since entry you've saved three bullish posts, noted the rising moving average twice in your journal, and skipped the volume panel, which shows heavy selling on every drop.",
    prompt: "What's going on, and what's the process fix?",
    options: [
      { id: "a", label: "Confirmation bias: list the evidence against the trade, starting with the volume" },
      {
        id: "b",
        label: "Anchoring: sell when price is back to entry",
        rationale: "Anchoring is about a reference number such as your entry. Here the problem is which evidence you look at.",
      },
      {
        id: "c",
        label: "Recency bias: ignore the last few candles",
        rationale: "Recency overweights the latest results. Here you're filtering evidence by whether it agrees with your position.",
      },
      {
        id: "d",
        label: "Nothing: bullish evidence is what a long needs",
        rationale: "A long needs an honest read of both sides. Skipping the panel that disagrees is the bias itself.",
      },
    ],
    correct: "a",
    explanation:
      "Collecting what agrees and skipping what doesn't is confirmation bias, strongest once you hold a position. The fix is a written devil's-advocate step: list the evidence against the trade and compare it with your invalidation.",
    lesson: "2.12.5",
    concepts: ["confirmation-bias", "invalidation-level"],
    hints: ["Which evidence did you look at, and which did you skip?"],
  },
  {
    id: "q-2.12.5-2",
    topic: "psychology",
    kind: "mcq",
    difficulty: 2,
    prompt: "LABX traded at 120.00 last year and is now 95.00. A trader says: 'It's cheap here, it was 120.00.' What's the main problem with that reasoning?",
    options: [
      {
        id: "a",
        label: "95.00 is too close to a round number",
        rationale: "Round numbers can matter for orders, but the issue here is judging today's price against an old, irrelevant one.",
      },
      {
        id: "b",
        label: "It's confirmation bias, not anchoring",
        rationale: "Confirmation bias filters evidence. Here a single past number sets the yardstick: that's anchoring.",
      },
      { id: "c", label: "The old high is an anchor: 120.00 says nothing about what 95.00 is worth now" },
      {
        id: "d",
        label: "Nothing: a 21% drop is always a chance to buy",
        rationale: "A drop isn't a signal by itself. Without a setup, 'cheaper than before' is the anchor talking.",
      },
    ],
    correct: "c",
    explanation:
      "Anchoring lets an irrelevant number set the yardstick. Last year's high doesn't make today's price cheap; only the current setup, levels and invalidation can justify a trade.",
    lesson: "2.12.5",
    concepts: ["anchoring"],
    hints: ["What is 120.00 being used for?", "Would the trade still make sense if you'd never seen 120.00?"],
  },
  {
    id: "q-2.12.5-3",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario: "You plan a long at 101.20. The last swing low is 100.90. Your rule puts the invalidation 0.10 below the last swing low.",
    prompt: "Which pre-trade note follows the process?",
    options: [
      {
        id: "a",
        label: "Invalidation: when it no longer feels right",
        rationale: "A feeling can't be checked before entry. Invalidation is a price, written down in advance.",
      },
      { id: "b", label: "Invalidation 100.80; against the idea: lower highs and heavy selling volume" },
      {
        id: "c",
        label: "Invalidation 101.00, so the loss stays small",
        rationale: "101.00 sits above the 100.90 swing low, inside normal noise. The rule puts it 0.10 below the swing low.",
      },
      {
        id: "d",
        label: "No invalidation needed: the trend is up",
        rationale: "Every idea needs a price that proves it wrong. Without one, confirmation bias decides when you exit.",
      },
    ],
    correct: "b",
    explanation:
      "A process note names a price, 100.90 − 0.10 = 100.80, and the evidence against the idea. Both are written before entry, when you have no position to defend.",
    lesson: "2.12.5",
    concepts: ["invalidation-level", "confirmation-bias"],
    hints: ["Invalidation is a price, set by the rule.", "100.90 − 0.10 = ?"],
  },
  // 2.12.6
  {
    id: "q-2.12.6-1",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "'I've already lost 300.00 on this trade; selling now would make it real.' Which bias is speaking?",
    options: [
      { id: "a", label: "House-money effect", rationale: "House money is about taking more risk with profits. This is about a loss already taken." },
      { id: "b", label: "Overconfidence", rationale: "Overconfidence is a gap between confidence and hit rate. This is about what's already been lost." },
      { id: "c", label: "Recency bias", rationale: "Recency overweights the latest results across trades. Here one position's past cost drives the decision." },
      { id: "d", label: "Sunk cost" },
    ],
    correct: "d",
    explanation:
      "The 300.00 is gone whether you sell or hold; selling only records it. Letting it decide is the sunk-cost trap. The question that matters: would you open this trade now, at this size?",
    lesson: "2.12.6",
    concepts: ["sunk-cost"],
  },
  {
    id: "q-2.12.6-2",
    topic: "position_sizing",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "After three wins your account is 10,400.00 vUSD. Your plan risks 1% per trade. The next setup looks great and you feel you're playing with the market's money.",
    prompt: "How much should the next trade risk?",
    options: [
      { id: "a", label: "104.00: 1% of the current account" },
      {
        id: "b",
        label: "208.00: 2%, since 400.00 of it is profit",
        rationale: "That's the house-money effect. The 400.00 is your money now, and the plan's 1% covers all of it.",
      },
      {
        id: "c",
        label: "100.00: 1% of the starting 10,000.00",
        rationale: "Close, but fixed fractional sizing uses current equity. 1% of 10,400.00 is 104.00.",
      },
      {
        id: "d",
        label: "400.00: the profit, since it was never really yours",
        rationale: "Risking all the profit on one trade is house money at its extreme: about 3.8% of the account.",
      },
    ],
    correct: "a",
    explanation:
      "Fixed fractional sizing takes 1% of current equity: 10,400.00 × 0.01 = 104.00. Profits join the account like any other money; risking more because they feel free is the house-money effect.",
    lesson: "2.12.6",
    concepts: ["house-money-effect", "fixed-fractional-sizing"],
    hints: ["Is profit different from the rest of the account?", "Take 1% of the current equity."],
  },
  {
    id: "q-2.12.6-3",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "You're long at −0.8R. The swing low your idea depended on broke an hour ago, but the stop hasn't been hit. You're tempted to buy more 'to lower the average'.",
    prompt: "What does the fresh-eyes test say?",
    options: [
      {
        id: "a",
        label: "Buy more: a lower average makes break-even easier",
        rationale: "That's sunk cost with more size: the average only matters because of what's already lost. It adds risk to a broken idea.",
      },
      { id: "b", label: "Close or cut the position: you wouldn't open it now" },
      { id: "c", label: "Hold until it gets back to entry", rationale: "Your entry price is an anchor. The market doesn't care where you got in." },
      {
        id: "d",
        label: "Move the stop lower to give it room",
        rationale: "Widening the stop raises the loss you accepted, on an idea that has already failed its test.",
      },
    ],
    correct: "b",
    explanation:
      "Ask: if I were flat now, would I open this position at this size? The level the idea needed has broken, so the answer is no, and the position goes. What it has cost doesn't enter the decision.",
    lesson: "2.12.6",
    concepts: ["sunk-cost", "averaging-down"],
    hints: ["Pretend you have no position. Would you buy here, at this size?"],
  },
  // 2.12.7
  {
    id: "q-2.12.7-1",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which journal pattern is the clearest sign of tilt?",
    options: [
      { id: "a", label: "Three losses in a row, every rule followed", rationale: "Losses with the rules kept are variance. Tilt is about broken rules, not results." },
      { id: "b", label: "Three rule breaks in your last four trades" },
      {
        id: "c",
        label: "Feeling nervous before entry, then following the plan",
        rationale: "A feeling handled by the plan isn't tilt. Tilt is when the feeling overrides the plan.",
      },
      { id: "d", label: "A single large winning trade", rationale: "One result says nothing about the process. Tilt shows as clustered rule breaks." },
    ],
    correct: "b",
    explanation:
      "Tilt is visible as a cluster of rule breaks, not as a feeling or a run of losses. Counting breaks over your last 10 trades, the tilt index, turns it into something a guard-rail can act on.",
    lesson: "2.12.7",
    concepts: ["tilt"],
  },
  {
    id: "q-2.12.7-2",
    topic: "psychology",
    kind: "numeric",
    difficulty: 2,
    scenario:
      "Your guard-rails lock trading at 3 rule breaks in 10 trades, or at a day's loss of 3R. Today: T1 −1R; T2 −1R, entered before the cool-down ended; T3 +1R; T4 −1R, no setup; T5 −1R.",
    prompt: "After which trade does trading lock?",
    numeric: { answer: 5, tolerance: 0, unit: "trade" },
    explanation:
      "Breaks come at trades 2 and 4: two, under the threshold. The day's running total is −1, −2, −1, −2 and −3R, so the daily lock triggers at trade 5. Either guard-rail can end the session.",
    lesson: "2.12.7",
    concepts: ["behavioural-guard-rails"],
    hints: [
      "Track two things: the number of rule breaks and the day's running total in R.",
      "Rule breaks come at trades 2 and 4 only.",
      "Running total: −1, −2, −1, −2, then?",
    ],
  },
  {
    id: "q-2.12.7-3",
    topic: "psychology",
    kind: "mcq",
    difficulty: 2,
    prompt: "You've just taken a loss that stung. Which response is reappraisal?",
    options: [
      { id: "a", label: "'This loss is one draw from my distribution. The stop did its job.'" },
      { id: "b", label: "'I feel nothing. Next trade.'", rationale: "That's suppression: hiding the feeling rather than reframing what happened." },
      { id: "c", label: "'I won't look at my positions for the rest of the day.'", rationale: "That's avoidance. It looks away instead of reframing the loss." },
      { id: "d", label: "'I'll win it back on the next one.'", rationale: "That's the breakeven pull behind revenge trading, not a reframe." },
    ],
    correct: "a",
    explanation:
      "Reappraisal changes what the event means, early: one loss is one draw from many, and the stop worked as planned. In interview research better traders leaned on it, though the evidence is small and qualitative (grade C).",
    lesson: "2.12.7",
    concepts: ["tilt", "cooling-off-pause"],
    hints: ["Which sentence changes what the loss means, rather than hiding it or looking away?"],
  },
  // 2.12.9
  {
    id: "q-2.12.9-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does it mean to treat a trade as 'one draw from a distribution'?",
    options: [
      {
        id: "a",
        label: "A good analysis makes each trade's result predictable",
        rationale: "No analysis makes one trade's result predictable. An edge is a higher probability across many trades.",
      },
      {
        id: "b",
        label: "A losing trade means the analysis was wrong",
        rationale: "A losing trade can follow a sound analysis; it's one draw. Judge it by the process.",
      },
      { id: "c", label: "You should change method after each loss", rationale: "Changing after each draw means never seeing the distribution. Judge a method over a series." },
      { id: "d", label: "Its result is one sample from many possible outcomes; the edge shows over a series" },
    ],
    correct: "d",
    explanation:
      "An edge is a higher probability over many trades, not a certainty on one. Each result is a single draw: a loss after a sound process is normal, and only a series of trades shows what the system does.",
    lesson: "2.12.9",
    concepts: ["probabilistic-thinking"],
  },
  {
    id: "q-2.12.9-2",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 3,
    prompt: "A system wins 40% of trades at +2.5R and loses 60% at −1R. Over 5 independent trades, what's the chance of a net loss, in %?",
    numeric: { answer: 33.7, tolerance: 0.2, unit: "%" },
    explanation:
      "One win (+2.5R) can't cover four losses (−4R), so a net loss means zero or one win. Zero wins: 0.6⁵ = 0.0778. One win: 5 × 0.4 × 0.6⁴ = 0.2592. Together: 33.7%, from a system worth +0.40R per trade.",
    lesson: "2.12.9",
    concepts: ["probabilistic-thinking", "variance"],
    hints: [
      "Find the most wins that still leave a net loss over 5 trades.",
      "Zero or one win: add those two chances.",
      "0.6⁵ = 0.0778 and 5 × 0.4 × 0.6⁴ = 0.2592.",
    ],
    vary: {
      fields: { w: [30, 50, 5] },
      answer:
        "round(((1 - pct(w)) * (1 - pct(w)) * (1 - pct(w)) * (1 - pct(w)) * (1 - pct(w)) + 5 * pct(w) * (1 - pct(w)) * (1 - pct(w)) * (1 - pct(w)) * (1 - pct(w))) * 100, 1)",
      prompt: "A system wins {w}% of trades at +2.5R and loses {100 - w}% at −1R. Over 5 independent trades, what's the chance of a net loss, in %?",
      explanation:
        "One win (+2.5R) can't cover four losses (−4R), so a net loss means zero or one win. Zero wins: {1 - pct(w):2}⁵. One win: 5 × {pct(w):2} × {1 - pct(w):2}⁴. Together: {answer:1}%.",
      hint: "{1 - pct(w):2}⁵ + 5 × {pct(w):2} × {1 - pct(w):2}⁴ = ?",
    },
  },
  {
    id: "q-2.12.9-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "You've committed to a block of 20 trades at 1% risk. After 8 trades you're at −4R. Every trade followed the rules, and your journal shows no errors.",
    prompt: "What does the commitment say to do?",
    options: [
      {
        id: "a",
        label: "Stop the block: −4R proves the system doesn't work",
        rationale: "Eight trades can't judge a system: a +0.40R system loses over 10 trades 16.7% of the time. The journal shows a clean process.",
      },
      {
        id: "b",
        label: "Raise risk to 2% to finish the block in profit",
        rationale: "That's the breakeven pull, and it doubles every loss. The block's risk was fixed before it started.",
      },
      { id: "c", label: "Keep executing the block by the rules, and judge it when it's done" },
      {
        id: "d",
        label: "Switch to a different setup for the rest of the block",
        rationale: "Changing the rules mid-block means the block measures nothing. Finish it, then review.",
      },
    ],
    correct: "c",
    explanation:
      "A block is judged as one result, by process first. With every rule followed, −4R after 8 trades is within normal variance for a positive-expectancy system. Finish the block, then review it.",
    lesson: "2.12.9",
    concepts: ["probabilistic-thinking", "decision-quality"],
    hints: ["Is there any process error in the journal?", "When does the commitment say to judge the block?"],
  },
];

// ─── Glossary terms introduced in unit 2.12 ────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "prospect-theory",
    term: "Prospect theory",
    definition:
      "A model of choice under risk in which outcomes are judged as gains or losses from a reference point, sensitivity shrinks as amounts grow, and losses weigh more than equal gains.",
    plain: "The finding that people judge gains and losses from a reference point and feel losses more.",
    related: ["reference-point", "loss-aversion", "disposition-effect"],
    lesson: "2.12.1",
  },
  {
    id: "reference-point",
    term: "Reference point",
    definition: "The value an outcome is compared with, such as your entry price; it decides whether a result feels like a gain or a loss.",
    plain: "The value you compare an outcome with, such as your entry price.",
    related: ["prospect-theory", "anchoring", "break-even"],
    lesson: "2.12.1",
  },
  {
    id: "disposition-effect",
    term: "Disposition effect",
    definition:
      "The tendency to sell winning positions too early and hold losing ones too long, measured as the proportion of gains realised minus the proportion of losses realised (PGR − PLR).",
    plain: "Selling winners too soon and holding losers too long.",
    related: ["prospect-theory", "loss-aversion", "exit-reason"],
    lesson: "2.12.2",
  },
  {
    id: "overconfidence",
    term: "Overconfidence",
    definition: "Being more sure of your judgement than your record justifies; in a confidence log, an average stated confidence above the hit rate.",
    plain: "Being more sure of your judgement than your track record justifies.",
    related: ["calibration", "overtrading", "cognitive-bias"],
    lesson: "2.12.3",
  },
  {
    id: "calibration",
    term: "Calibration",
    definition: "How closely stated confidence matches the actual hit rate. A calibrated trader's 70% calls come true about 70% of the time.",
    plain: "How well your stated confidence matches how often you are actually right.",
    related: ["overconfidence", "brier-score", "probability"],
    lesson: "2.12.3",
  },
  {
    id: "law-of-small-numbers",
    term: "Law of small numbers",
    definition: "The mistaken belief that a small sample closely mirrors the process behind it, so a few results seem to show what a method can do.",
    plain: "The mistaken belief that a few results reliably show what a method can do.",
    related: ["sample-size", "regression-to-the-mean", "recency-bias"],
    lesson: "2.12.4",
  },
  {
    id: "regression-to-the-mean",
    term: "Regression to the mean",
    definition: "When results contain noise, an extreme result tends to be followed by one closer to the average, because its luck doesn't repeat.",
    plain: "After an extreme result, the next one tends to be closer to average.",
    related: ["law-of-small-numbers", "variance", "sample-size"],
    lesson: "2.12.4",
  },
  {
    id: "anchoring",
    term: "Anchoring",
    definition: "Letting an initial or irrelevant number, such as your entry price or an old high, pull later estimates and decisions toward it.",
    plain: "Letting an irrelevant number, like your entry price, pull your judgement.",
    related: ["reference-point", "confirmation-bias", "invalidation"],
    lesson: "2.12.5",
  },
  {
    id: "sunk-cost",
    term: "Sunk cost",
    definition: "Money or effort already spent that can't be recovered. The sunk-cost trap is letting it decide whether to hold or add to a position.",
    plain: "Money already lost. It shouldn't change what you do next, but often does.",
    related: ["house-money-effect", "averaging-down", "loss-aversion"],
    lesson: "2.12.6",
  },
  {
    id: "house-money-effect",
    term: "House-money effect",
    definition:
      "Taking more risk after gains because the profits feel like someone else's money. Its mirror, the breakeven effect, seeks risk after losses to get back to even.",
    plain: "Taking more risk after a win because profits feel like free money.",
    related: ["sunk-cost", "risk-per-trade", "revenge-trading"],
    lesson: "2.12.6",
  },
  {
    id: "tilt",
    term: "Tilt",
    definition: "A state, named in poker, in which emotion overrides the plan; in a journal it shows as a cluster of rule breaks.",
    plain: "A state where emotion overrides your plan, shown by several broken rules in a row.",
    related: ["guard-rail", "revenge-trading", "cooling-off-pause"],
    lesson: "2.12.7",
  },
  {
    id: "probabilistic-thinking",
    term: "Probabilistic thinking",
    definition: "Treating each trade as one draw from a distribution of outcomes, and judging a method across a series rather than by any single result.",
    plain: "Seeing each trade as one draw from many, not as a test of being right.",
    related: ["broad-framing", "expectancy", "variance"],
    lesson: "2.12.9",
  },
  {
    id: "broad-framing",
    term: "Broad framing",
    definition: "Evaluating results across a series of decisions, such as a block of 20 trades, instead of one at a time (narrow framing).",
    plain: "Judging results across a series of trades rather than one trade at a time.",
    related: ["probabilistic-thinking", "sample-size", "expectancy"],
    lesson: "2.12.9",
  },
];

// ─── Concepts introduced in unit 2.12 ──────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "prospect-theory",
    name: "Prospect theory",
    category: "psychology",
    summary: "People judge outcomes as gains or losses from a reference point and feel losses more strongly than equal gains.",
    body: [
      "Kahneman and Tversky (1979, 1992) described three parts. Outcomes are coded as gains or losses from a reference point, often the entry price. Sensitivity diminishes as amounts grow, so people tend to play safe with gains and gamble with losses. And losses weigh more than equal gains: in the 1992 study, about 2.25 times as much.",
      "The pattern is well established (evidence grade A), but the parameters are illustrative: the 2.25 came from 25 students, and studies of professionals sometimes find less. Knowing about it doesn't remove it. Exits set at entry, which don't depend on where the trade stands, are the practical counter.",
    ],
    example:
      "A sure +50.00 or a 50% chance of +100.00: most people take the sure gain. A sure −50.00 or a 50% chance of −100.00: most take the gamble. Each pair has the same expected value, +50.00 and −50.00.",
    related: ["loss-aversion", "expected-value", "exit-rules"],
    missions: ["M07"],
    lessons: ["2.12.1"],
  },
  {
    id: "disposition-effect",
    name: "Disposition effect",
    category: "psychology",
    summary: "The tendency to sell winners too early and to hold losers too long, measured as PGR − PLR.",
    body: [
      "Shefrin and Statman (1985) named it, and Odean (1998) measured it in 10,000 brokerage accounts: on the days they sold, investors realised 14.8% of their paper gains but only 9.8% of their paper losses. The proportion of gains realised (PGR) minus the proportion of losses realised (PLR) is the disposition measure, 0.05 there. Rebalancing and costs didn't explain it (evidence grade B), and its size varies by group.",
      "In trading it shrinks winners and enlarges losers. At a 40% win rate with −1R losses, closing winners at +0.8R instead of a +2.5R target turns +0.40R per trade into −0.28R. Exits set by rules (stop, target, time stop, opposing signal) take the decision out of the moment.",
    ],
    example:
      "A sample journal: 12 gains realised and 28 left on paper, so PGR = 0.30; 6 losses realised and 34 left, so PLR = 0.15. Disposition = 0.15: gains were sold at twice the rate of losses.",
    related: ["prospect-theory", "loss-aversion", "exit-rules", "expectancy"],
    missions: ["M07"],
    lessons: ["2.12.2"],
  },
  {
    id: "overconfidence",
    name: "Overconfidence and calibration",
    category: "psychology",
    summary: "Being sure more often than you are right, measured by comparing stated confidence with the hit rate.",
    body: [
      "Overconfidence as miscalibration is a gap you can measure: log a confidence number before each decision, then compare the average with how often you were right. A negative gap, the hit rate below the confidence, is overconfidence; a positive one is underconfidence. Small logs are noisy, so read the gap over many entries.",
      "Its costliest form is trading too much. Barber and Odean found that the most active fifth of 66,465 US households earned 11.4% a year against the market's 17.9%, and that men traded about 45% more than women, which cut their net returns by 2.65 percentage points a year against 1.72 (evidence grade B; some of the trading may have rational reasons).",
    ],
    example:
      "100 logged calls at an average confidence of 80%, 60 of them right: a gap of 60 − 80 = −20 points. If the same trader goes from 5 to 25 trades a week, costs of 0.20R per trade take 4R more each week.",
    related: ["base-rates", "trading-costs", "overtrading"],
    missions: ["M10"],
    lessons: ["2.12.3"],
  },
  {
    id: "recency-bias",
    name: "Recency bias",
    category: "psychology",
    summary: "Giving the last few results more weight than the base rate deserves.",
    body: [
      "Recent trades come to mind first, and what's easy to recall feels more likely (availability; Tversky and Kahneman, 1974; evidence grade B). After three losses a valid setup feels broken; after three wins it feels certain. Both readings let a handful of trades override the record.",
      "A journal check makes it visible: compare how often you skip valid setups after losses with how often you skip them after wins. A valid setup's base rate doesn't change with the last result, so skipping more after losses is the bias, not caution.",
    ],
    example:
      "At a 40% win rate, any three given trades all lose 0.6 × 0.6 × 0.6 = 21.6% of the time. A journal showing 5% of valid setups skipped after a win and 40% after two losses shows recency steering the entries.",
    related: ["base-rates", "sample-size", "gamblers-fallacy", "streaks-and-runs"],
    missions: ["M07"],
    lessons: ["2.12.4"],
  },
  {
    id: "regression-to-the-mean",
    name: "Regression to the mean",
    category: "psychology",
    summary: "Extreme results tend to be followed by more ordinary ones when outcomes contain noise.",
    body: [
      "Any result mixes edge with luck. An extreme result usually had extreme luck, and luck doesn't carry over, so the next stretch tends to sit closer to the long-run average. It's a property of noisy numbers, not a force that pulls results back.",
      "It explains the 'rookie of the year': among traders with no skill, the best month is luck and fades the next month. It also explains why a setup's hot start rarely lasts. A drop after an extreme run isn't, by itself, proof that something broke.",
    ],
    example:
      "A setup makes +1.5R per trade over its first 15 trades; a long test puts its edge at +0.3R. The best estimate for the next 15 trades is 15 × 0.3R = +4.5R, not another +22.5R.",
    related: ["sample-size", "luck-vs-skill", "variance", "base-rates"],
    missions: [],
    lessons: ["2.12.4"],
  },
  {
    id: "anchoring",
    name: "Anchoring",
    category: "psychology",
    summary: "Letting an irrelevant number, such as your entry price, pull your judgement.",
    body: [
      "A number you've seen pulls later estimates toward it, even when it's irrelevant. In Tversky and Kahneman's (1974) study, a wheel of fortune stopping at 10 or 65 moved estimates of the share of African countries in the UN to medians of 25% and 45% (evidence grade A in the lab).",
      "In trading the common anchors are your entry price, an old high and someone else's target. The entry anchor shows in a journal as exits that cluster within 0.10 of entry after a trade has gone against you. The counter is a price, written before entry, that proves the idea wrong.",
    ],
    example:
      "Bought at 104.00, now 101.20, stop at 100.80. 'I'll sell when it's back to 104.00' lets the entry decide. The plan's stop at 100.80 is the only level that should.",
    related: ["invalidation-level", "confirmation-bias", "prospect-theory"],
    missions: ["M07"],
    lessons: ["2.12.5"],
  },
  {
    id: "sunk-cost",
    name: "Sunk cost",
    category: "psychology",
    summary: "Holding or adding to a position because of what has already been lost on it.",
    body: [
      "Money already lost is gone whatever you do next; selling only records it. The sunk-cost trap lets it decide anyway: holding a broken idea, adding to bring the average down, or depositing money to 'save' a position. Arkes and Blumer (1985) showed the pattern outside trading: people who paid full price for theatre season tickets went to more plays (evidence grade B).",
      "The fresh-eyes test cuts through it: if you were flat now, would you open this position at this size? If not, close it or cut it to what you would open.",
    ],
    example:
      "A long is down 0.7R and the 101.00 level the idea needed has broken, though the 100.40 stop hasn't been hit. Fresh eyes say no new long here, so the position goes; the 0.7R already lost doesn't enter the decision.",
    related: ["averaging-down", "loss-aversion", "invalidation-level"],
    missions: ["M07"],
    lessons: ["2.12.6"],
  },
  {
    id: "house-money-effect",
    name: "House-money effect",
    category: "psychology",
    summary: "Taking more risk after gains because the profits feel like someone else's money.",
    body: [
      "Thaler and Johnson (1990) found that after a gain people accept bets they'd otherwise refuse, and that after a loss they seek bets that could get them back to even, the breakeven effect. The evidence comes from hypothetical choices in small samples (evidence grade C). Both are mental accounting: money treated differently by where it came from.",
      "In a journal it shows as risk per trade that rises after wins. Fixed fractional sizing removes it by construction: the same percentage of current equity after a win, after a loss and after a streak.",
    ],
    example:
      "After three wins the account is 10,400.00. The plan's 1% is 104.00; sizing at 2% 'with the market's money' risks 208.00. A sample journal with 1.6% average risk after wins and 1.0% after losses is the pattern in numbers.",
    related: ["fixed-fractional-sizing", "risk-per-trade", "revenge-trading"],
    missions: ["M05"],
    lessons: ["2.12.6"],
  },
  {
    id: "tilt",
    name: "Tilt",
    category: "psychology",
    summary: "A state in which emotion overrides the plan, visible as a cluster of rule breaks.",
    body: [
      "The word comes from poker. A feeling can't be seen in a journal, but its effects can: rule breaks that bunch together. This course's tilt index counts the rule breaks in your last 10 trades; it's a process measure defined by the app, not a diagnosis.",
      "The evidence that intense emotional reactions go with worse trading is modest: Lo, Repin and Steenbarger (2005) followed 80 day traders (evidence grade B). Interview research suggests that better traders regulate early, by reappraisal (grade C). The practical answer is structure: a threshold that locks trading, and a reset routine.",
    ],
    example:
      "Rule breaks at trades 3, 7, 8 and 10 of a session put the tilt index at 4 after trade 10, with 3 breaks in the last 4 trades. A threshold of 3 would have locked trading after trade 8.",
    related: ["revenge-trading", "decision-quality", "cooling-off-pause", "emotions-in-trading"],
    missions: ["M06"],
    lessons: ["2.12.7"],
  },
  {
    id: "behavioural-guard-rails",
    name: "Behavioural guard-rails",
    category: "psychology",
    summary: "Pre-set limits such as cool-downs, tilt thresholds and daily locks that make the right action the easy one.",
    body: [
      "Guard-rails are set before the session, while judgement is clear, and apply on their own: a cool-down after a loss, a lock at a set number of rule breaks in 10 trades, a daily loss lock in R, and a readiness check of sleep, stress and health. Structure beats willpower: knowing a bias rarely removes it, but a rule that triggers by itself doesn't need willpower.",
      "When a guard-rail triggers, a reset routine fills the pause: stop, start the cool-down, breathe and reflect, name the broken rule, run the checklist, then resume at normal size or end the session.",
    ],
    example:
      "Guard-rails: lock at 3 rule breaks in 10 trades, or at −3R for the day. Trades 4, 5 and 7 break rules while the day reaches −2.9R: the third break locks trading at trade 7, before the loss limit.",
    related: ["if-then-rules", "cooling-off-pause", "daily-loss-limit", "revenge-trading"],
    missions: ["M06"],
    lessons: ["2.12.7"],
  },
  {
    id: "probabilistic-thinking",
    name: "Probabilistic thinking",
    category: "decision_making",
    summary: "Treating each trade as one draw from a distribution and judging results across a series.",
    body: [
      "An edge is a higher probability over many trades, not a certainty on one. Mark Douglas built a trading mindset on this idea; his framework is a practitioner's advice, not a tested result (evidence grade C), but the arithmetic is exact. A system that wins 40% at +2.5R and loses 60% at −1R, +0.40R per trade, still ends 33.7% of 5-trade stretches and 16.7% of 10-trade stretches in a loss.",
      "Broad framing turns this into practice: commit to a block of 20 trades taken by the rules, then judge the block by process first and net R second.",
    ],
    example:
      "Five blocks of 20 trades from that system, every rule followed, return +11.5R, +11.5R, +18.5R, −9.5R and −2.5R. The 28.0R gap between the best and the worst is variance; the process score was 100% in each.",
    related: ["expectancy", "variance", "decision-quality", "base-rates"],
    missions: ["M07"],
    lessons: ["2.12.9"],
  },
];

/** Unit 2.12 · The trader's mind II (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_2_12: UnitContent = {
  lessons: [L_2_12_1, L_2_12_2, L_2_12_3, L_2_12_4, L_2_12_5, L_2_12_6, L_2_12_7, L_2_12_9],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
