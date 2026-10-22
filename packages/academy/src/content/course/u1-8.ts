import type { CandleData, Concept, GlossaryTerm, Lesson, Question, UnitContent } from "../../types";

/**
 * Unit 1.8 · Danger zone (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce.
 * The ruin maths is exact: losing-run chances come from losingRunProbability (widget-math), grid and martingale
 * figures from the step-by-step simulations described next to each series.
 */

const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

/** One candle per step of an equity path (open = before, close = after). */
const equityCandles = (path: number[]): CandleData[] => path.slice(1).map((v, i) => k(path[i], Math.max(path[i], v), Math.min(path[i], v), v));

/**
 * 1.8.1: a martingale bot with a 10.00 first bet on fair coin flips, starting from 10,000.00. One candle per cycle
 * (losses, then the win that ends the cycle). The first 19 cycles end in a win (+10.00 each, lows show the losses
 * inside the cycle); cycle 20 is nine losses in a row, 10 + 20 + … + 2,560 = 5,110.00, leaving 5,080.00.
 */
const MARTINGALE_LOSSES = [0, 1, 0, 2, 0, 0, 1, 3, 0, 1, 0, 0, 2, 1, 0, 4, 0, 1, 0];
const MARTINGALE_CANDLES: CandleData[] = (() => {
  const out: CandleData[] = [];
  let eq = 10000;
  for (const losses of MARTINGALE_LOSSES) {
    const open = eq;
    let bet = 10;
    for (let i = 0; i < losses; i++) {
      eq -= bet;
      bet *= 2;
    }
    const low = eq;
    eq += bet;
    out.push(k(open, eq, low, eq));
  }
  out.push(k(eq, eq, eq - 5110, eq - 5110));
  return out;
})();

/**
 * 1.8.2: LABX with a grid that buys 10 units at every whole price from 99.00 down to 90.00 and sells each lot 1.00
 * higher (no stop). No candle reaches both a buy level and a sell target, so the fills don't depend on the path inside it.
 * Range (candles 1–12): lots bought at 99.00, 98.00 and 99.00 sell on candles 4, 8 and 10, +30.00 in all.
 * Trend (candles 13–25): buys at 99.00 … 90.00, never sold; at the 90.00 close, 100 units at an average 94.50.
 */
const GRID_CANDLES: CandleData[] = [
  k(100.2, 100.35, 99.7, 99.8),
  k(99.8, 99.9, 98.9, 99.05),
  k(99.05, 99.6, 99.0, 99.5),
  k(99.5, 100.1, 99.4, 100.05),
  k(100.05, 100.2, 99.3, 99.4),
  k(99.4, 99.5, 98.85, 98.95),
  k(98.95, 98.98, 97.9, 98.1),
  k(98.1, 99.1, 98.05, 99.0),
  k(99.0, 99.9, 98.95, 99.85),
  k(99.85, 100.2, 99.7, 100.15),
  k(100.15, 100.3, 99.55, 99.6),
  k(99.6, 100.25, 99.5, 100.2),
  k(100.2, 100.28, 99.33, 99.4),
  k(99.4, 99.48, 98.53, 98.6),
  k(98.6, 98.68, 97.68, 97.75),
  k(97.75, 97.83, 96.88, 96.95),
  k(96.95, 97.03, 96.08, 96.15),
  k(96.15, 96.23, 95.23, 95.3),
  k(95.3, 95.38, 94.43, 94.5),
  k(94.5, 94.58, 93.63, 93.7),
  k(93.7, 93.78, 92.78, 92.85),
  k(92.85, 92.93, 91.98, 92.05),
  k(92.05, 92.13, 91.13, 91.2),
  k(91.2, 91.28, 90.33, 90.4),
  k(90.4, 90.48, 89.95, 90.0),
];

/** 1.8.2: the grid's equity at each close of GRID_CANDLES (10,000.00 + closed wins + open P&L of the lots held). */
const GRID_EQUITY = [
  10000, 10000, 10000.5, 10005, 10010, 10010, 10009.5, 10002, 10020, 10028.5, 10030, 10030, 10030, 10030, 10026, 10015, 9998.5, 9974.5, 9942, 9905, 9862, 9809.5, 9754,
  9686, 9616, 9580,
];

// ─── 1.8.1 · Martingale and averaging down ─────────────────────────────────

const L_1_8_1: Lesson = {
  id: "1.8.1",
  title: "Martingale and averaging down",
  topic: "risk_management",
  level: "beginner",
  tier: "free",
  minutes: 7,
  summary: "Doubling after losses and adding to losers win small most of the time and lose catastrophically once; the maths of losing runs makes that loss a matter of time.",
  objectives: [
    "Calculate the size and the total loss of a doubling sequence after a run of losses.",
    "Explain why a very high win rate can hide a ruinous loss.",
    "Tell averaging down from a planned split entry with a fixed total risk.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M05", label: "Size Matters" },
    { kind: "check", ref: "risk_management", label: "Knowledge check: risk management" },
  ],
  script: {
    unit: "1.8",
    courseId: "1.8.1",
    bridge: "Unit 1.7 ended with rules that hold under pressure. In 1.7.3, six doubled bets cost 6,300.00 against 600.00 at a fixed size; in 0.2.2, a game that won nine times in ten still lost. Here doubling gets its name: martingale.",
    hook: {
      prompt: "Start with a bet of 1 unit and double it after each loss. After 7 losses in a row, how big is the next bet?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "14 units" },
          { id: "b", label: "64 units" },
          { id: "c", label: "128 units" },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. The bets were 1, 2, 4, 8, 16, 32 and 64: 127 already lost. The next one is 128, to win back 127 and make 1.",
      concept: "martingale",
    },
    learn: [
      {
        kind: "explain",
        title: "Doubling after losses",
        text: "[[martingale|Martingale]] means doubling the stake after every loss, so the first win recovers all the losses plus the first stake. It wins small almost every time, which makes it feel safe. [[averaging-down|Averaging down]], adding to a losing position to lower its average price, works the same way: it's martingale in disguise.",
      },
      {
        kind: "worked",
        title: "The doubling table",
        lines: ["Bets after each loss: 1, 2, 4, 8, 16, 32, 64.", "Lost so far = 1 + 2 + 4 + 8 + 16 + 32 + 64 = ?"],
        ask: {
          answer: 127,
          tolerance: 0,
          unit: "units",
          feedback: [
            { value: 128, text: "128 is the next bet. Add only the seven bets already lost." },
            { value: 64, text: "64 is the last bet lost. Add all seven." },
          ],
          correct: "Right. 127 lost, and the next bet is 128, to win back 127 and make 1.",
        },
        after: "Each loss doubles the next bet. After 10 losses the bet is 1,024 times the first, and 1,023 times the first is already gone.",
        concept: "martingale",
      },
      {
        kind: "figure",
        title: "A martingale bot",
        text: "A bot bets 10.00 on fair coin flips from 10,000.00 and doubles after every loss.",
        figure: {
          kind: "chart",
          chart: {
            candles: MARTINGALE_CANDLES,
            visible: 19,
            describe: "Twenty betting cycles of a martingale bot on fair coin flips. Equity creeps from 10,000.00 to 10,190.00 over 19 cycles, then falls to 5,080.00 in one cycle of nine losses.",
          },
          steps: [
            {
              text: "Each candle is one cycle: losses, then a win. Nineteen cycles, nineteen wins of 10.00.",
              visible: 19,
              layers: [{ kind: "level", price: 10000, role: "neutral", label: "Start 10,000.00" }],
            },
            {
              text: "Cycle 20: nine losses in a row. 10 + 20 + … + 2,560 = 5,110.00 gone.",
              visible: 20,
              layers: [{ kind: "bracket", from: 5080, to: 10190, index: 19, label: "−5,110.00", role: "down" }],
            },
            {
              text: "5,080.00 is left. The next bet, 5,120.00, doesn't fit. The bot is finished.",
              layers: [{ kind: "level", price: 5080, role: "stop", label: "Left 5,080.00" }],
            },
          ],
        },
        concept: "martingale",
      },
      {
        kind: "explain",
        title: "Why it can't win",
        text: "Doubling can't beat a fair game: each cycle's expected result is zero, and costs make it negative. Losing runs are rare on any one bet but common over many. At 50%, a run of 8 losses turns up in 17% of 100-flip stretches. Betting red in European roulette, a run of 6 losses turns up in 84% of 200-spin sessions.",
      },
      {
        kind: "worked",
        title: "Averaging down",
        lines: [
          "Buy 50 at 100.00, stop planned at 98.00: 1R = 100.00 before costs.",
          "At 98.00, instead of exiting, buy 50 more. Average price: 99.00.",
          "Price falls to 96.00. Loss = 100 units × 3.00 = ?",
        ],
        ask: {
          answer: 300,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 200, text: "That's the first 50 units only. All 100 units lost 3.00 each from the 99.00 average." },
            { value: 100, text: "100.00 was the plan, 1R. Averaging down made the loss bigger." },
          ],
          correct: "Right. 300.00: 3R, three times what the plan allowed, on an idea that was already wrong.",
        },
        after: "A lower average price feels like progress. It's a bigger position on a losing idea, with the stop gone.",
        concept: "averaging-down",
      },
      {
        kind: "match",
        title: "Split entry or averaging down?",
        prompt: "Sort each case. A planned split entry fixes the total risk before the first order; averaging down adds risk after the idea starts failing.",
        pairs: [
          { left: "50 units planned in two halves, one stop for both, total risk 1R", right: "Planned split entry" },
          { left: "Adding to a loser because it's 'cheaper now'", right: "Averaging down" },
          { left: "Second half bought at 99.00 as the plan said, stop unchanged", right: "Planned split entry" },
          { left: "Cancelling the stop and buying more to lower the average", right: "Averaging down" },
        ],
        columns: ["Case", "Type"],
        correct: "Right. The difference isn't buying lower; it's whether the total risk was fixed before you started. Scaling in to a plan is allowed (2.7). Averaging down is grade F.",
        concept: "averaging-down",
      },
      {
        kind: "predict",
        title: "Before you run it",
        prompt: "The bot from the figure plays 1,000 fair flips. A run of 9 losses would cost it 5,110.00 in one sequence. What's the chance that run turns up at least once?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "About 1 in 50", feedback: "Any 9 particular flips all lose 1 time in 512. But 1,000 flips give that run hundreds of chances to start." },
            { id: "b", label: "About 1 in 10", feedback: "Higher. Each flip can start a new run, and there are 1,000 of them." },
            { id: "c", label: "About 1 in 3", feedback: "Higher still. Even a run of 10 has a 38.5% chance; a run of 9 is more likely than not." },
            { id: "d", label: "More likely than not" },
          ],
          answer: "d",
        },
        reveal: "62.4%, calculated exactly. A long losing run is rare on any one flip but likely over many flips, and the capital is finite. Paths that escape show small, steady gains. On average the result is zero before costs and negative after.",
        concept: "martingale",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Doubling after losses and averaging down without a limit lead to a [[blow-up]] by construction: grade F. No skill fixes the maths. Keep the risk per trade fixed, win or lose.",
      },
    ],
    check: ["q-1.8.1-1", "q-1.8.1-2", "q-1.8.1-3"],
    recap: {
      takeaways: [
        "After 7 losses, a doubling bet is 128 times the first, with 127 already lost.",
        "A high win rate can hide one ruinous loss: a run of 9 losses in 1,000 flips is likely.",
        "A split entry fixes total risk before the first order. Averaging down adds risk after.",
      ],
      next: "Next, 1.8.2: grid trading, averaging down on a schedule, and what one trend does to it.",
    },
  },
};

// ─── 1.8.2 · Grid trading ──────────────────────────────────────────────────

const L_1_8_2: Lesson = {
  id: "1.8.2",
  title: "Grid trading",
  topic: "risk_management",
  level: "beginner",
  tier: "free",
  minutes: 5,
  summary: "A grid without stops collects small wins in a range and piles up units, and open losses, as soon as price trends away.",
  objectives: [
    "Describe how a grid without stops adds exposure as price moves away.",
    "Calculate the open loss of a grid after a one-way move.",
    "Explain why a grid's smooth equity curve hides the risk of ruin.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "portfolio_exposure", label: "Exposure check" },
    { kind: "check", ref: "risk_management", label: "Knowledge check: risk management" },
  ],
  script: {
    unit: "1.8",
    courseId: "1.8.2",
    bridge: "1.8.1 showed averaging down: adding to a loser after the idea starts failing. A grid does the same on a schedule. In 1.4.7 you measured exposure as a share of the account; here you watch it grow, unit by unit, as price trends away.",
    hook: {
      prompt: "A grid bot buys 10 units at every 1.00 step below 100.00 and sells each at +1.00. It has won 40 trades in a row. Now price falls to 90.00 without a bounce. How many units does it hold?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "10 units" },
          { id: "b", label: "50 units" },
          { id: "c", label: "100 units" },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. It bought 10 units at each of 99.00, 98.00 … 90.00: 100 units, and none could be sold 1.00 higher.",
      concept: "grid-trading",
    },
    learn: [
      {
        kind: "explain",
        title: "How a grid works",
        text: "A [[grid-trading|grid]] places orders at fixed steps around a price, often with no stop. Each buy has a sell 1.00 above it. In a range, price keeps crossing the steps and lots close for small wins. When price moves away and keeps going, the grid keeps buying: [[exposure]] grows exactly when the idea is failing.",
      },
      {
        kind: "figure",
        title: "Range, then trend",
        figure: {
          kind: "chart",
          chart: {
            candles: GRID_CANDLES,
            visible: 12,
            describe: "LABX in a range between 97.90 and 100.35 for twelve candles, then a steady fall from 100.20 to 90.00 over thirteen candles.",
          },
          steps: [
            {
              text: "In the range, lots bought at 99.00 and 98.00 sell 1.00 higher: three wins, +30.00.",
              layers: [
                { kind: "level", price: 99, role: "neutral", label: "Buy 99.00" },
                { kind: "level", price: 98, role: "neutral", label: "Buy 98.00" },
                { kind: "marker", index: 3, at: "high", label: "+10.00", role: "up" },
                { kind: "marker", index: 7, at: "high", label: "+10.00", role: "up" },
                { kind: "marker", index: 9, at: "high", label: "+10.00", role: "up" },
              ],
            },
            {
              text: "Then a trend: at every 1.00 lower, the grid buys 10 more units.",
              visible: 25,
              layers: [97, 96, 95, 94, 93, 92, 91, 90].map((price) => ({ kind: "level" as const, price, role: "neutral" as const })),
            },
            {
              text: "At 90.00 it holds 100 units at an average of 94.50.",
              layers: [
                { kind: "level", price: 94.5, role: "concept", label: "Average 94.50" },
                { kind: "bracket", from: 90, to: 94.5, index: 24, label: "−4.50 per unit", role: "down" },
              ],
            },
          ],
        },
        concept: "grid-trading",
      },
      {
        kind: "worked",
        title: "The open loss",
        lines: ["The grid from the chart holds 100 units bought from 99.00 down to 90.00: average price 94.50.", "Price now: 90.00. Costs ignored.", "Open loss = 100 × (94.50 − 90.00) = ?"],
        ask: {
          answer: 450,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 1000, text: "That prices every unit at 100.00. They were bought on the way down, at an average of 94.50." },
            { value: 45, text: "That's 10 units' worth. The grid holds 100." },
          ],
          correct: "Right. 450.00 open, and still no stop.",
        },
        after: "It has put 9,450.00 into LABX, almost the whole 10,030.00 account, after a 10% fall. One more step down and it runs out of cash.",
        concept: "grid-trading",
      },
      {
        kind: "explain",
        title: "What the research says",
        text: "Taranto and Khan (2020) analysed grid trading as a gambler's-ruin problem and concluded that it 'will almost surely ruin an investment account in the long term', even though it can look like it beats the market over short stretches. Across market regimes, a grid profits in a range, until it doesn't, and is badly hurt by a trend.",
      },
      {
        kind: "reveal",
        title: "The equity curve",
        prompt: "This is the grid's equity through the range: three wins, +30.00, barely a wobble. What does the trend from the chart above do to it?",
        chart: {
          candles: equityCandles(GRID_EQUITY),
          visible: 12,
          layers: [{ kind: "level", price: 10000, role: "neutral", label: "Start 10,000.00" }],
          describe: "The grid's equity, one candle per LABX candle. It creeps from 10,000.00 to 10,030.00 during the range, then slides to 9,580.00 during the trend.",
        },
        choices: [
          { id: "a", label: "It keeps creeping up", feedback: "Every lot bought in the trend waits for a sale 1.00 higher that never comes." },
          { id: "b", label: "It slides far below the start" },
          { id: "c", label: "It stays flat until the grid stops", feedback: "Open positions are marked at every close. Each step down adds 10 more units to the loss." },
        ],
        answer: "b",
        after: "From 10,030.00 to 9,580.00. The 450.00 open loss is 15 times what the range earned, and it grows with every step down.\nA smooth curve only meant the trend hadn't come yet.",
        concept: "grid-trading",
      },
      {
        kind: "predict",
        title: "Where 5% is gone",
        prompt: "Another grid: 5 units at every 1.00 step below 100.00, each sold at +1.00, no stop. How many steps can price fall in one move before the open loss passes 500.00, 5% of the account?",
        control: {
          kind: "slider",
          min: 1,
          max: 20,
          step: 1,
          unit: "steps",
          start: 1,
          answer: 15,
          tolerance: 0,
          feedback: [
            { from: 1, to: 14, text: "Not yet. After 14 steps, at 86.00: 70 units, average 92.50, open loss 455.00." },
            { from: 16, to: 20, text: "It passed 500.00 one step earlier. At 85.00: 75 units, average 92.00, open loss 525.00." },
          ],
        },
        reveal: "15 steps, at 85.00: 75 units at an average of 92.00, an open loss of 525.00. The loss grows faster than the fall: 225.00 after 10 steps, 950.00 after 20.",
        concept: "grid-trading",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Grade F. A grid without stops is averaging down on a schedule: small, steady wins until a trend turns them into one large loss. Many prop firms ban grid and martingale strategies outright.",
      },
    ],
    check: ["q-1.8.2-1", "q-1.8.2-2", "q-1.8.2-3"],
    recap: {
      takeaways: [
        "A grid without stops adds units as price moves away: exposure grows as the idea fails.",
        "Open loss = units × (average price − current price): 100 × 4.50 = 450.00.",
        "A smooth equity curve hides open losses; one trend can erase many small wins.",
      ],
      next: "Next, 1.8.3: holy grails and survivorship bias, and how to read a performance claim before you believe it.",
    },
  },
};

// ─── 1.8.3 · Holy grails and survivorship bias ─────────────────────────────

const L_1_8_3: Lesson = {
  id: "1.8.3",
  title: "Holy grails and survivorship bias",
  topic: "decision_making",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "A performance claim means little until you know its sample, costs, period, worst loss and what was left out; even real edges shrink once published.",
  objectives: [
    "Check a performance claim for sample size, costs, period, worst loss and selection.",
    "Explain how survivorship and cherry-picking make random results look skilled.",
    "Apply the publication-decay rule of thumb to any published edge.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "decision_making", label: "Decision-making check" }],
  script: {
    unit: "1.8",
    courseId: "1.8.3",
    bridge: "In 1.8.2 a smooth equity curve hid a large open loss. Ads hide things too. In 0.2.6 luck alone made stars among coin-flippers, and 1.2.7 showed cherry-picked charts. Here you check a performance claim before you believe it.",
    hook: {
      prompt: "An ad says: 'Our system: 92% win rate, +340% last year.' What's the first thing to ask?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "How do I buy it?" },
          { id: "b", label: "How many trades, after which costs, and what was the largest loss?" },
          { id: "c", label: "Which indicator does it use?" },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. A claim means little until you know the sample, the costs and the worst loss. 92% says nothing without the size of the other 8%.",
      concept: "performance-claims",
    },
    learn: [
      {
        kind: "explain",
        title: "Questions for any claim",
        text: "Before believing a [[backtest]] or a track record, ask: how many trades, over what period? After which costs? What were the largest loss and the [[max-drawdown|maximum drawdown]], the deepest fall from a peak? Simulated or real money? How many systems were tried before this one? And how did it compare with simply holding the market?",
      },
      {
        kind: "figure",
        title: "1,000 systems with no edge",
        text: "Each system takes 100 trades, each with a 50% chance to win or lose 1R. None has an edge. The bars show how many of 1,000 such systems land in each band, on average. Showing only the top band is [[survivorship-bias|survivorship bias]].",
        figure: {
          kind: "bars",
          bars: [
            { label: "+20R or more", value: 28, role: "up" },
            { label: "+10R to +18R", value: 156, role: "accent" },
            { label: "−8R to +8R", value: 632, role: "neutral" },
            { label: "−10R to −18R", value: 156, role: "down" },
            { label: "−20R or worse", value: 28, role: "down" },
          ],
          steps: [
            "The ad shows one system with +20R over 100 trades. About 28 in 1,000 get there by luck.",
            "Run all 1,000 coin-flip systems: most finish within 8R of zero.",
            "As many lose 10R to 18R as make it.",
            "And 28 lose 20R or more. Nobody advertises those.",
          ],
        },
        concept: "performance-claims",
      },
      {
        kind: "worked",
        title: "92% and still losing",
        lines: ["A system wins 92% of its trades at +0.5R.", "The other 8% lose 8R each: rare, but large.", "Expectancy = 0.92 × 0.5 − 0.08 × 8 = ?"],
        ask: {
          answer: -0.18,
          tolerance: 0.005,
          unit: "R",
          feedback: [
            { value: 0.46, text: "That's the wins only. Subtract the losses: 0.08 × 8 = 0.64." },
            { value: 0.18, text: "Check the sign: 0.46 − 0.64 is below zero." },
          ],
          correct: "Right. −0.18R per trade, with a 92% win rate.",
        },
        after: "The rare large loss has the same shape as martingale's and the grid's. A win rate without the size of the losses tells you nothing.",
        concept: "performance-claims",
      },
      {
        kind: "explain",
        title: "Even real edges shrink",
        text: "McLean and Pontiff (2016) followed 97 return predictors published in finance journals. Their returns were 26% lower [[out-of-sample]] and 58% lower after publication. Even edges that were real shrink once they're known and traded. A rule of thumb: halve any published edge before counting on it, then subtract your costs.",
      },
      {
        kind: "match",
        title: "Red flags",
        prompt: "Match each red flag in an ad with what it hides.",
        pairs: [
          { left: "Guaranteed returns", right: "No edge is guaranteed" },
          { left: "Only winning months shown", right: "Cherry-picking" },
          { left: "Backtest only, no live record", right: "May be fitted to the past" },
          { left: "Results without costs", right: "Costs can erase the edge" },
          { left: "Thousands of happy members", right: "Survivors speak; losers don't" },
        ],
        columns: ["Red flag", "What it hides"],
        concept: "performance-claims",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Ask who earns what when you buy. A seller paid per subscriber earns the same whether the system works or not.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: {
        options: [
          { id: "sample", label: "How many trades" },
          { id: "costs", label: "Costs" },
          { id: "worst", label: "Worst loss and drawdown" },
          { id: "selection", label: "What wasn't shown" },
        ],
        cards: [
          {
            id: "c1",
            text: "'+18% in March!' One screenshot of one month: 3 trades.",
            answer: "sample",
            correct: "Right. Three trades in one good month can't separate skill from luck. Verdict: can't judge yet.",
            rationales: {
              costs: "Costs matter, but the first gap is bigger: 3 trades can't tell skill from luck.",
              worst: "With 3 trades there's barely a worst case to show. The sample itself is the gap.",
              selection: "It may be the best month, but even an honest 3-trade month is too small to judge.",
            },
          },
          {
            id: "c2",
            text: "'Our scalping bot: 2,400 trades this year, 61% winners, +31% before fees.'",
            answer: "costs",
            correct: "Right. 2,400 short trades pay 2,400 round trips. A result before fees can turn negative after them. Verdict: can't judge yet.",
            rationales: {
              sample: "2,400 trades is a decent sample. What's missing is what those round trips cost.",
              worst: "Worth asking, but the bigger gap is written in the claim: '+31% before fees'.",
              selection: "Possibly, but the claim itself admits the gap: the result is before fees.",
            },
          },
          {
            id: "c3",
            text: "'97% of our trades win. Steady income every week for two years.'",
            answer: "worst",
            correct: "Right. A 97% win rate fits a strategy with rare, huge losses, like a grid or martingale. Without the worst loss: red flag.",
            rationales: {
              sample: "Two years of weekly trades is plenty. The gap is the size of the 3% that lose.",
              costs: "Costs matter, but a 97% win rate says nothing until you know how big the losses are.",
              selection: "Possibly, but the first question for any very high win rate is the size of the losses.",
            },
          },
          {
            id: "c4",
            text: "'Our members' best results this year: +400%, +250%, +180%.'",
            answer: "selection",
            correct: "Right. The best three out of how many? The members who lost aren't in the ad. Survivorship: red flag.",
            rationales: {
              sample: "Three numbers, yes, but they were chosen. The gap is everyone who wasn't shown.",
              costs: "Costs matter, but the bigger problem is that these are the best results, picked from many.",
              worst: "Close: the worst results are missing, and so are all the ordinary ones. That's selection.",
            },
          },
        ],
      },
      goal: "Four marketing claims. For each one, pick what's missing before you could judge it.",
      success: { field: "solved", eq: 4 },
      correct: "All four. The gaps differ, but the habit is the same: before believing a number, ask what it leaves out.",
      hints: [
        "Ask what you'd need to know before the number means anything.",
        "Few trades, results before fees, no losses mentioned, best results only: each points to one gap.",
        "A very high win rate hides the size of the losses; 'best results' hides everyone else.",
      ],
      showMe: { solved: 4 },
      concept: "performance-claims",
    },
    check: ["q-1.8.3-1", "q-1.8.3-2", "q-1.8.3-3"],
    recap: {
      takeaways: [
        "Check any claim for sample size, costs, period, worst loss, selection and a benchmark.",
        "Of 1,000 systems with no edge, about 28 make +20R by luck. Ads show only those.",
        "Published edges fell about 58% after publication. Halve them, then subtract your costs.",
      ],
      next: "Next, 1.8.4: the people who sell those claims, signal sellers, scams and unregulated brokers, and how to check a licence.",
    },
  },
};

// ─── 1.8.4 · Signal sellers, scams and unregulated brokers ─────────────────

const L_1_8_4: Lesson = {
  id: "1.8.4",
  title: "Signal sellers, scams and unregulated brokers",
  topic: "decision_making",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Check a broker's licence on the regulator's own register, know the red flags of scams and paid signals, and know who is on the other side of your trades.",
  objectives: [
    "Check a broker's licence on the regulator's own register.",
    "Recognise the red flags of scams, signal services and pay-to-play challenges.",
    "Explain the conflict of interest when a broker is the counterparty to your trades.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "1.8",
    courseId: "1.8.4",
    bridge: "1.8.3 gave you questions for any performance claim. Now the people selling them: signal services, scams and unregulated brokers. In 0.1.5, 74% to 89% of EU retail CFD accounts lost money; here you check who holds your money and who gains when you lose.",
    hook: {
      prompt: "A broker offers 500:1 leverage, a 100% deposit bonus and a personal account manager. It is registered offshore. How many red flags?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "One" },
          { id: "b", label: "Two" },
          { id: "c", label: "Four" },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. All four: extreme leverage, a deposit bonus, a salesperson presented as service, and an offshore registration that gives you little protection.",
      concept: "scam-red-flags",
    },
    learn: [
      {
        kind: "explain",
        title: "Who licenses brokers",
        text: "In the EU, national authorities license brokers under rules coordinated by ESMA; in Romania, that's the ASF. The UK has the FCA. The US has the SEC and FINRA, plus the CFTC and NFA for futures and forex. Check a licence on the regulator's own register, never only on the broker's website. Rules change, so recheck them.",
      },
      {
        kind: "match",
        title: "Red flags and why",
        prompt: "Match each red flag with the reason it matters.",
        pairs: [
          { left: "Deposit bonus", right: "Banned for EU retail CFD clients" },
          { left: "Guaranteed monthly returns", right: "No market return is guaranteed" },
          { left: "Pressure to deposit more, now", right: "A sales tactic, not advice" },
          { left: "Slow or blocked withdrawals", right: "A classic sign of fraud" },
          { left: "Offshore licence only", right: "Little protection for you" },
        ],
        columns: ["Red flag", "Why it matters"],
        concept: "scam-red-flags",
      },
      {
        kind: "predict",
        title: "What protects your money?",
        prompt: "Your regulated broker goes bust and its compensation scheme pays out. Does the scheme cover the 2,000.00 you lost on trades last month?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Yes, up to the scheme's limit", feedback: "Schemes cover client money a failed firm can't return, within limits. Trading losses are never covered." },
            { id: "b", label: "No" },
            { id: "c", label: "Only if the broker caused the loss", feedback: "A compensation scheme isn't insurance against trading. It covers missing client money when a firm fails." },
          ],
          answer: "b",
        },
        reveal: "No. Regulated brokers must keep client money as [[segregated-funds|segregated funds]], apart from their own. If a firm fails, compensation schemes cover missing client money within limits: in the US, SIPC up to $500,000, of which $250,000 in cash; in the EU, at least €20,000. Trading losses are never covered. Check current limits.",
        concept: "broker-due-diligence",
      },
      {
        kind: "predict",
        title: "Who is on the other side?",
        prompt: "Your broker runs a [[b-book]]: it takes the other side of your trades itself. You lose 100.00 on a trade. Who gains it?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Other traders in the market", feedback: "That's an A-book broker, which passes your order on. A B-book broker is the market for you." },
            { id: "b", label: "The broker" },
            { id: "c", label: "Nobody: the money just disappears", feedback: "Trading is zero-sum before costs: what you lose, someone gains. Here, the broker." },
          ],
          answer: "b",
        },
        reveal: "The broker. An A-book broker passes your order to the market; a B-book broker takes the other side, so your loss is its revenue. That's a structural conflict of interest. It's legal and regulated, not automatically abusive, but you should know which model you're trading against.",
        concept: "broker-due-diligence",
      },
      {
        kind: "explain",
        title: "Signals, copy trading and paid challenges",
        text: "[[signal-service|Signal services]] and copy trading show selected track records, with delays and with incentives to sell rather than perform. [[pump-and-dump|Pump-and-dump]] groups hype a coin or a stock, then sell to the buyers they attract. Paid 'funded trader' challenges earn from fees; pass rates are estimated at 5–10%, and those estimates are unaudited. More in 4.5.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "If someone contacts you first with an opportunity, treat it as a scam until you've checked it yourself, on the regulator's own register.",
      },
    ],
    task: {
      widget: "bias-spotter",
      data: {
        options: [
          { id: "ok", label: "Worth a closer look" },
          { id: "licence", label: "No real licence" },
          { id: "bonus", label: "Bonus and extreme leverage" },
          { id: "withdraw", label: "Withdrawal problems" },
        ],
        cards: [
          {
            id: "a",
            text: "Broker A · Licensed by the FCA, and the FCA register lists it under the same name and website. Leverage up to 30:1 for retail clients, no bonuses, client money segregated.",
            answer: "ok",
            correct: "Right. Licence confirmed on the register, retail caps, no incentives. Worth a closer look: next, read its fees and execution model.",
            rationales: {
              licence: "The licence was checked on the FCA's own register, for the same name and website.",
              bonus: "30:1 is the UK and EU retail cap on major currency pairs, and there's no bonus.",
              withdraw: "Nothing in the profile mentions withdrawal problems.",
            },
          },
          {
            id: "b",
            text: "Broker B · 'Regulated' only by an offshore commission, with no EU, UK or US licence. Its website still signs up EU clients. Spreads from 0.0.",
            answer: "licence",
            correct: "Right. An offshore-only licence gives you little protection, whatever the spreads. Red flag.",
            rationales: {
              ok: "Tight spreads don't help if no serious regulator watches the firm. Check the licence first.",
              bonus: "No bonus is mentioned. The problem is who regulates it.",
              withdraw: "No complaints are mentioned yet. The licence is the problem.",
            },
          },
          {
            id: "c",
            text: "Broker C · Its EU company is licensed, but sign-up routes you to a sister company abroad that offers 500:1 and a 100% deposit bonus.",
            answer: "bonus",
            correct: "Right. The bonus and the 500:1 come from a company outside EU rules, so EU retail protections don't apply to you. Red flag.",
            rationales: {
              ok: "The licensed company isn't the one you'd sign with. Check which company holds your account.",
              licence: "Partly: the licence covers a different company. The offer itself, 500:1 and a bonus, is the clearest flag.",
              withdraw: "No withdrawal complaints are mentioned. Look at what it offers you to sign up.",
            },
          },
          {
            id: "d",
            text: "Broker D · Licensed in Cyprus and listed on the CySEC register. Many recent reviews say withdrawals take months or are refused.",
            answer: "withdraw",
            correct: "Right. A licence doesn't make withdrawals work. Blocked or very slow withdrawals are a classic warning sign. Red flag.",
            rationales: {
              ok: "The licence checks out, but many reports of refused withdrawals outweigh it.",
              licence: "The licence is real and on the register. The problem is getting your money out.",
              bonus: "No bonus or extreme leverage is mentioned. Read the reviews again.",
            },
          },
          {
            id: "e",
            text: "Broker E · Licensed by the ASF in Romania and on its register. Takes the other side of client trades (B-book), disclosed in its terms. Negative balance protection for retail clients.",
            answer: "ok",
            correct: "Right. A disclosed B-book is a conflict to know about, not a red flag on its own. Worth a closer look.",
            rationales: {
              licence: "The licence was found on the ASF's own register.",
              bonus: "No bonus is mentioned, and negative balance protection is a retail safeguard.",
              withdraw: "Nothing in the profile mentions withdrawal problems.",
            },
          },
        ],
      },
      goal: "Five broker profiles, all made up. For each one, pick its biggest problem, or mark it worth a closer look.",
      success: { field: "solved", eq: 5 },
      correct: "Done. Two of the five are worth a closer look, and even those need checking: fees, execution model and the register again before you deposit.",
      hints: [
        "Start with the licence: is it on a real regulator's register, for the company you'd sign with?",
        "Then look at incentives and leverage, then at what clients say about getting money out.",
        "Two of the five profiles are worth a closer look.",
      ],
      showMe: { solved: 5 },
      concept: "broker-due-diligence",
    },
    check: ["q-1.8.4-1", "q-1.8.4-2", "q-1.8.4-3"],
    recap: {
      takeaways: [
        "Check a licence on the regulator's own register, for the exact company you'd sign with.",
        "Red flags: guaranteed returns, bonuses, pressure, offshore-only licences, blocked withdrawals, unsolicited offers.",
        "A B-book broker gains when you lose: a legal conflict to know before you trade.",
      ],
      next: "Next, 1.8.5: the leverage illusion, why the leverage a broker allows isn't the leverage that hits your account.",
    },
  },
};

// ─── 1.8.5 · The leverage illusion ─────────────────────────────────────────

const L_1_8_5: Lesson = {
  id: "1.8.5",
  title: "The leverage illusion",
  topic: "portfolio_exposure",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Effective leverage, position value divided by equity, sets how hard a move hits the account; a broker's close-out comes after the damage, not instead of a stop.",
  objectives: [
    "Calculate effective leverage as position value ÷ equity.",
    "Work out the price move that wipes out an account at a given effective leverage.",
    "Explain why a broker's close-out is a failure of sizing, not a protective stop.",
  ],
  blocks: [],
  practice: [
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
    { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
    { kind: "check", ref: "portfolio_exposure", label: "Exposure check" },
  ],
  script: {
    unit: "1.8",
    courseId: "1.8.5",
    bridge: "In 1.8.4, 500:1 leverage was a red flag. In 1.4.7 you saw leverage scale every move: at 5×, a 5% fall costs 25%. Here you separate the leverage a broker allows from the leverage you use, and see why a close-out isn't a stop.",
    hook: {
      prompt: "Your broker offers 1:500. Trader A holds positions worth 2 times her equity; Trader B, 20 times his. Who carries more risk?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Both the same: the broker's 1:500 decides" },
          { id: "b", label: "Trader B" },
          { id: "c", label: "Trader A" },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. The 1:500 is only a ceiling. B's positions are 20 times his equity, so a 5% move costs him the whole account; A loses 10%.",
      concept: "effective-leverage",
    },
    learn: [
      {
        kind: "explain",
        title: "Allowed versus used",
        text: "The leverage a broker allows, such as 1:500, is a ceiling. What hits your account is [[effective-leverage|effective leverage]]: the value of your open positions divided by your [[equity]]. Two traders at the same broker can run 2× and 20×. The broker's number only tells you how far you could go.",
      },
      {
        kind: "worked",
        title: "One formula",
        lines: ["% of the account lost = % price move × effective leverage.", "At 2×, a 5% move against you costs 10% of the account.", "At 20×, a 5% move against you costs ?"],
        ask: {
          answer: 100,
          tolerance: 0.01,
          unit: "%",
          feedback: [
            { value: 5, text: "5% is the price move. Multiply it by the leverage: 20 × 5%." },
            { value: 20, text: "20 is the leverage. Multiply it by the 5% move." },
          ],
          correct: "Right. 100%: the whole account, from an ordinary 5% move.",
        },
        after: "The move that wipes you out is 100% ÷ effective leverage: 50% at 2×, 5% at 20×.",
        concept: "effective-leverage",
      },
      {
        kind: "figure",
        title: "The leverage dial",
        text: "The same trade, the same 3% move against you, at four sizes. The bars show the loss as a share of the account.",
        figure: {
          kind: "bars",
          bars: [
            { label: "1× effective", value: -3, role: "down" },
            { label: "3× effective", value: -9, role: "down" },
            { label: "10× effective", value: -30, role: "down" },
            { label: "30× effective", value: -90, role: "down" },
          ],
          unit: "%",
          steps: ["At 1×, a 3% move costs 3% of the account.", "At 3×, 9%. At 10×, 30%.", "At 30×, 90%. Nothing about the trade changed, only its size."],
        },
        concept: "effective-leverage",
      },
      {
        kind: "worked",
        title: "How a close-out happens",
        lines: [
          "Equity 5,000. You buy 1 lot of EUR/USD at 1.1000: 110,000 of currency.",
          "At 30:1 the broker requires margin of 110,000 ÷ 30 = 3,666.67.",
          "EU retail rules close you out at 50% of that: when equity falls to 1,833.33.",
          "Loss at the close-out = 5,000 − 1,833.33 = ?",
        ],
        ask: {
          answer: 3166.67,
          tolerance: 0.01,
          unit: "USD",
          feedback: [
            { value: 1833.33, text: "That's the equity left at the close-out. The loss is what's gone: 5,000 − 1,833.33." },
            { value: 3666.67, text: "That's the required margin. The close-out comes at half of it." },
          ],
          correct: "Right. 3,166.67: 63% of the account.",
        },
        after: "Price only had to fall 2.9%: 3,166.67 ÷ 110,000. A [[margin-call]] may warn you first; the [[margin-close-out]] doesn't ask. It closes at whatever price is there.",
        concept: "margin-close-out",
      },
      {
        kind: "explain",
        title: "The rules for retail",
        text: "For EU retail clients trading CFDs, leverage is capped from 30:1 on major currency pairs down to 2:1 on crypto. Positions are closed out at 50% of the required margin, per account, and [[negative-balance-protection|negative balance protection]] stops losses at the money in the account. The UK has similar rules. They limit damage; they don't size your trades.",
      },
      {
        kind: "predict",
        title: "Leverage and your planned risk",
        prompt: "You size every trade from the stop to risk 1%. Your broker raises your maximum leverage from 1:30 to 1:500. Does your planned risk change?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Yes, it rises with the leverage", feedback: "Your size comes from the stop and the 1% budget, not from the leverage. Same units, same loss at the stop." },
            { id: "b", label: "No" },
          ],
          answer: "b",
        },
        reveal: "No. Sizing decides the risk. Leverage only changes the margin set aside and how big a position you could open, which makes oversizing easy. And if price gaps past your stop, your exposure, not your plan, sets the loss.",
        concept: "effective-leverage",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Leverage multiplies volatility, not edge. Using the maximum to grow a small account fast is grade F. MARKET//LAB uses no leverage; margin mechanics come back in 2.14.",
      },
    ],
    task: {
      widget: "exposure",
      goal: "Your broker allows 10×. A 4% move against you is ordinary. Set the position so that move costs exactly 20% of your 10,000.00 equity, then read your effective leverage.",
      start: { account: 10000, leverage: 10, position: 10000, move: 4 },
      locked: ["account", "leverage", "move"],
      success: { field: "position", eq: 50000 },
      feedback: [
        { when: { field: "lossPct", lt: 20 }, text: "At {leverageUsed}× a 4% move costs {lossPct:1}% of the account. Go bigger." },
        { when: { field: "lossPct", gt: 20 }, text: "At {leverageUsed}× a 4% move costs {lossPct:1}% of the account. Go smaller." },
      ],
      correct: "Right. 50,000.00 is 5× effective leverage: 4% × 5 = 20%. A 20% move would wipe the account out, with 10× still available.",
      hints: ["% of the account lost = move × effective leverage.", "20% ÷ 4% = 5, so you need positions worth 5 times your equity.", "5 × 10,000.00 = 50,000.00."],
      showMe: { position: 50000 },
      concept: "effective-leverage",
    },
    check: ["q-1.8.5-1", "q-1.8.5-2", "q-1.8.5-3"],
    recap: {
      takeaways: [
        "Effective leverage = position value ÷ equity: 60,000.00 on 4,000.00 is 15×.",
        "The move that wipes out the account is 100% ÷ effective leverage: 5% at 20×.",
        "A close-out comes after most of the account is gone. Size from the stop instead.",
      ],
      next: "Next: the 1.8 checkpoint closes Level 1. Level 2 opens with unit 2.1, Candlesticks in context: the candle from 1.2, judged against its neighbours.",
    },
  },
};

// ─── Check questions ───────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: "q-1.8.1-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 1,
    prompt: "A martingale bot starts with a first bet of 5.00 and doubles it after each loss. After 6 losses in a row, how big is its next bet, in vUSD?",
    numeric: { answer: 320, tolerance: 0.01, unit: "vUSD" },
    explanation: "The bets were 5, 10, 20, 40, 80 and 160: 315.00 lost. The next bet doubles the last one: 320.00, to win back 315.00 and make 5.00.",
    lesson: "1.8.1",
    concepts: ["martingale"],
    hints: ["Each bet is twice the one before.", "Write out the six losing bets, then double the last one."],
    vary: {
      fields: { base: [1, 20, 1] },
      answer: "base * 64",
      prompt: "A martingale bot starts with a first bet of {base:2} and doubles it after each loss. After 6 losses in a row, how big is its next bet, in vUSD?",
      explanation: "The bets were {base:2}, {base * 2:2}, {base * 4:2}, {base * 8:2}, {base * 16:2} and {base * 32:2}: {base * 63:2} lost. The next bet doubles the last one: {answer:2}, to win back {base * 63:2} and make {base:2}.",
      hint: "The sixth losing bet was {base * 32:2}. Double it.",
    },
  },
  {
    id: "q-1.8.1-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "You buy 40 units at 50.00 with a stop planned at 49.00, so 1R is 40.00 before costs. At 49.00 you skip the stop and buy 40 more. Price falls to 47.50, where you finally exit. What was the loss, in R? Ignore costs.",
    numeric: { answer: 4, tolerance: 0.01, unit: "R" },
    explanation: "Average price: (50.00 + 49.00) ÷ 2 = 49.50. Loss: 80 × (49.50 − 47.50) = 160.00, which is 160.00 ÷ 40.00 = 4R. The plan allowed 1R; adding to the loser and dropping the stop made it four times bigger.",
    lesson: "1.8.1",
    concepts: ["averaging-down"],
    hints: [
      "Find the average price of all 80 units first.",
      "Loss = 80 × (average price − exit price).",
      "Average 49.50, exit 47.50: 80 × 2.00. Then divide by 40.00.",
    ],
  },
  {
    id: "q-1.8.1-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "Ana plans 60 units in two halves: 30 at 100.00 and 30 at 99.00 if price dips, one stop at 97.50 for both, sized before the first order so the total loss at the stop fits her 1% budget. Ben buys 30 at 100.00 with a stop at 99.00; at 99.00 he cancels the stop and buys 30 more because it's 'cheaper now'.",
    prompt: "Which statement is right?",
    options: [
      { id: "a", label: "Both are averaging down: they both buy lower", rationale: "Buying lower isn't the test. Ana fixed her total risk before the first order; Ben added risk after his idea had failed." },
      { id: "b", label: "Ana's is a planned split entry with a fixed total risk; Ben's is averaging down, with no limit" },
      { id: "c", label: "Ben's is safer, because his average price is lower", rationale: "His average is lower, but his position is bigger and has no stop. His possible loss has no limit at all." },
      { id: "d", label: "Ana's is riskier, because her stop is further away", rationale: "She sized both halves so the loss at 97.50 fits 1%. A wider stop with a smaller size isn't more risk." },
    ],
    correct: "b",
    explanation: "A split entry is decided in full before the first order: sizes, levels and one stop, with the total loss at the stop inside the budget. Averaging down adds units after the idea starts failing, usually removing the stop, so the risk keeps growing.",
    lesson: "1.8.1",
    concepts: ["averaging-down"],
    hints: ["Ask when each trader fixed the total risk.", "Which trader still has a stop after the second purchase?"],
  },
  {
    id: "q-1.8.2-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 1,
    prompt: "A grid bot buys 20 units at every 0.50 step below 50.00 and has no stop. Price falls in one move from 50.00 to 46.00. How many units does it hold?",
    numeric: { answer: 160, tolerance: 0, unit: "units" },
    explanation: "It buys at 49.50, 49.00, 48.50, 48.00, 47.50, 47.00, 46.50 and 46.00: 8 levels × 20 units = 160 units, none of them sold, since price never rose 0.50 above a buy.",
    lesson: "1.8.2",
    concepts: ["grid-trading"],
    hints: ["Count the buy levels between 49.50 and 46.00.", "A 4.00 fall in 0.50 steps is 8 levels. Multiply by 20 units."],
    vary: {
      fields: { units: [5, 20, 5], fall: [2, 5, 0.5] },
      answer: "units * fall * 2",
      prompt: "A grid bot buys {units} units at every 0.50 step below 50.00 and has no stop. Price falls in one move from 50.00 to {50 - fall:2}. How many units does it hold?",
      explanation: "A {fall:2} fall in 0.50 steps passes {fall * 2} buy levels, from 49.50 down to {50 - fall:2}: {fall * 2} × {units} = {answer} units, none of them sold.",
      hint: "{fall:2} ÷ 0.50 = {fall * 2} levels. Multiply by {units} units.",
    },
  },
  {
    id: "q-1.8.2-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "The same grid: 20 units bought at every 0.50 step from 49.50 down to 46.00, 160 units in all. Price is now 46.00. What is the open loss, in vUSD? Ignore costs.",
    numeric: { answer: 280, tolerance: 0.01, unit: "vUSD" },
    explanation: "The average price of the eight equal lots is (49.50 + 46.00) ÷ 2 = 47.75. Open loss: 160 × (47.75 − 46.00) = 280.00. Using 50.00 as the cost of every unit would give 640.00 and overstate it.",
    lesson: "1.8.2",
    concepts: ["grid-trading", "exposure"],
    hints: [
      "Equal lots at evenly spaced prices: the average is halfway between the first and the last.",
      "Open loss = units × (average price − current price).",
      "Average 47.75: 160 × 1.75.",
    ],
    vary: {
      fields: { units: [5, 20, 5], fall: [2, 5, 0.5] },
      answer: "round(units * fall * (fall - 0.5), 2)",
      prompt: "A grid bought {units} units at every 0.50 step from 49.50 down to {50 - fall:2}, {units * fall * 2} units in all. Price is now {50 - fall:2}. What is the open loss, in vUSD? Ignore costs.",
      explanation: "The average price of the equal lots is (49.50 + {50 - fall:2}) ÷ 2 = {(99.5 - fall) / 2:2}. Open loss: {units * fall * 2} × ({(99.5 - fall) / 2:2} − {50 - fall:2}) = {answer:2}.",
      hint: "Average {(99.5 - fall) / 2:2}: multiply {units * fall * 2} units by {(fall - 0.5) / 2:2}.",
    },
  },
  {
    id: "q-1.8.2-3",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "A grid bot's equity curve rose smoothly for six months without a single losing week. Why is that weak evidence that it's safe?",
    options: [
      { id: "a", label: "Six months is too short for any strategy to be judged", rationale: "Length helps, but isn't the point. A grid's risk sits in open positions, and a smooth curve can't show it until a trend arrives." },
      { id: "b", label: "Smooth equity curves are always faked", rationale: "Some are real. The issue isn't honesty: the curve leaves out the open risk the grid is carrying." },
      { id: "c", label: "Grids only lose money on high-volatility days", rationale: "Grids lose in trends, quiet or fast. A slow one-way move fills every level just the same." },
      { id: "d", label: "Its losing lots stay open instead of being closed, and they grow as price moves away until a trend turns them into one large loss" },
    ],
    correct: "d",
    explanation: "A grid closes its winners and keeps its losers open, without a stop. Each week can look profitable while open losses build. When a trend comes, the lots pile up and one move can erase months of small wins.",
    lesson: "1.8.2",
    concepts: ["grid-trading"],
    hints: ["Which of the grid's trades get closed, and which stay open?", "What happens to the open lots when price keeps moving one way?"],
  },
  {
    id: "q-1.8.3-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "An ad says: 'Our system: 85% win rate, +210% last year.' What do you need to know first?",
    options: [
      { id: "a", label: "Which indicator it uses", rationale: "The method matters less than the evidence. Without sample, costs and worst loss, you can't tell skill from luck." },
      { id: "b", label: "How many people have bought it", rationale: "Popularity isn't evidence. Happy buyers speak up; the ones who lost usually don't." },
      { id: "c", label: "How many trades, after which costs, and the largest loss and drawdown" },
      { id: "d", label: "Whether the price is discounted today", rationale: "A deadline is a sales tactic. The first questions are about the evidence behind the claim." },
    ],
    correct: "c",
    explanation: "A win rate and a return mean little alone. The sample says whether luck could explain them, the costs whether they survive trading, and the largest loss whether an 85% win rate hides rare, ruinous losses.",
    lesson: "1.8.3",
    concepts: ["performance-claims"],
  },
  {
    id: "q-1.8.3-2",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "A signal group's ad shows 12 members who each turned 1,000 into more than 10,000 in a year. The group has had about 5,000 members.",
    prompt: "What's the strongest reason to doubt the ad?",
    options: [
      { id: "a", label: "The 12 are survivors picked from 5,000; the members who lost aren't shown" },
      { id: "b", label: "Turning 1,000 into 10,000 in a year is impossible", rationale: "It's possible, often through luck and very large risk. The problem is that the ad shows only those who got lucky." },
      { id: "c", label: "The members may not be real people", rationale: "Maybe, but even if they're real, 12 picked from 5,000 prove nothing about the signals." },
      { id: "d", label: "The ad should show monthly returns instead", rationale: "Monthly figures for the same 12 would still be the survivors. You need the results of all 5,000." },
    ],
    correct: "a",
    explanation: "With 5,000 members taking big risks, some will hit extreme results by luck alone. Showing only them is survivorship and cherry-picking: the evidence you need is what happened to everyone who followed the signals.",
    lesson: "1.8.3",
    concepts: ["performance-claims", "survivorship-bias"],
    hints: ["How many members are in the ad, and how many in the group?", "What would the ad look like if the signals had no edge at all?"],
  },
  {
    id: "q-1.8.3-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "A study publishes an edge that earned 1.0% a month in its test period. Using McLean and Pontiff's findings as a rule of thumb, what should you expect once it's published?",
    options: [
      { id: "a", label: "About 1.0% a month: published results are peer-reviewed", rationale: "Review checks the method, not the future. Across 97 published predictors, returns fell about 58% after publication." },
      { id: "b", label: "Roughly 0.4% a month, before your own costs" },
      { id: "c", label: "Zero: published edges disappear completely", rationale: "On average they shrank by about 58%, not to zero. Some edge often remains, but much less than the paper shows." },
      { id: "d", label: "More than 1.0%: publicity brings in more buyers", rationale: "More traders using an edge usually shrinks it, as they compete for the same opportunities." },
    ],
    correct: "b",
    explanation: "McLean and Pontiff found that 97 published predictors earned 26% less out of sample and 58% less after publication. 1.0% × (1 − 0.58) ≈ 0.4% a month, and your costs still come off that.",
    lesson: "1.8.3",
    concepts: ["performance-claims"],
    hints: ["How much did published predictors lose after publication, on average?", "1.0% × (1 − 0.58)."],
  },
  {
    id: "q-1.8.4-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "Where should you check that a broker is licensed?",
    options: [
      { id: "a", label: "On the broker's website, where the licence number is shown", rationale: "Anyone can display a number. Only the regulator's register shows whether it's real and which company it belongs to." },
      { id: "b", label: "In online reviews and forums", rationale: "Reviews can warn you of problems, but they can't confirm a licence. The register can." },
      { id: "c", label: "On the regulator's own online register, searching the firm's name and licence number" },
      { id: "d", label: "By asking the account manager for a copy of the licence", rationale: "Documents can be forged, and a salesperson isn't a neutral source. Go to the regulator directly." },
    ],
    correct: "c",
    explanation: "Only the regulator's own register confirms that a licence exists, that it's current and which company and website it covers. Clone firms copy real licence numbers, so check that the name and web address match too.",
    lesson: "1.8.4",
    concepts: ["broker-due-diligence"],
  },
  {
    id: "q-1.8.4-2",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "A stranger messages you: 'Join our VIP signals. 30% a month guaranteed. Only 3 places left today. Deposit with our partner broker, licensed offshore, and get a 100% bonus.'",
    prompt: "What's the right reading of this offer?",
    options: [
      { id: "a", label: "Only the offshore licence is a problem; the rest is normal marketing", rationale: "Guaranteed returns, time pressure and deposit bonuses are red flags on their own, not marketing style." },
      { id: "b", label: "It's fine if the signals have a good track record", rationale: "A track record from people selling signals is usually selective. And nothing makes a 30% monthly guarantee believable." },
      { id: "c", label: "Every part is a red flag: unsolicited contact, guaranteed returns, time pressure, an offshore-only licence and a deposit bonus" },
      { id: "d", label: "It's safe if you start with a small deposit", rationale: "A small deposit limits what you can lose, but it doesn't make the offer legitimate. Treat it as a scam until checked." },
    ],
    correct: "c",
    explanation: "Each element is a known warning sign: contact you didn't ask for, a guaranteed return no market can give, pressure to act now, a licence with little protection and a bonus that ties up your money. Together they describe a likely scam.",
    lesson: "1.8.4",
    concepts: ["scam-red-flags"],
    hints: ["Go through the message one claim at a time.", "Which of these would a regulated, honest firm never offer?"],
  },
  {
    id: "q-1.8.4-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Your broker runs a B-book model. What follows from that?",
    options: [
      { id: "a", label: "When you lose, the broker gains: a conflict of interest that rules and disclosures are meant to manage" },
      { id: "b", label: "The broker is breaking the law", rationale: "B-booking is legal and regulated in many places. It's a conflict to know about, not a crime." },
      { id: "c", label: "It can't affect you, since prices come from the market", rationale: "The broker is your counterparty, so your losses are its revenue. That's exactly why the model matters." },
      { id: "d", label: "Your orders are sent on to the exchange", rationale: "That's an A-book broker. A B-book broker keeps your trades and takes the other side itself." },
    ],
    correct: "a",
    explanation: "In a B-book the broker takes the other side of client trades, so client losses become its income. That's a structural conflict of interest. It's legal and regulated, not automatically abusive, but you should know it before choosing a broker.",
    lesson: "1.8.4",
    concepts: ["broker-due-diligence"],
    hints: ["Who is on the other side of your trade in a B-book?", "If the broker is your counterparty, where does your loss go?"],
  },
  {
    id: "q-1.8.5-1",
    topic: "portfolio_exposure",
    kind: "numeric",
    difficulty: 1,
    prompt: "Your equity is 4,000.00 and your open positions are worth 60,000.00. What is your effective leverage?",
    numeric: { answer: 15, tolerance: 0.01, unit: "×" },
    explanation: "Effective leverage = position value ÷ equity = 60,000.00 ÷ 4,000.00 = 15×. Whatever the broker allows, a 1% move now costs 15% of the account.",
    lesson: "1.8.5",
    concepts: ["effective-leverage"],
    hints: ["Divide the position value by the equity.", "60,000.00 ÷ 4,000.00."],
    vary: {
      fields: { equity: [2000, 20000, 1000], lev: [2, 30, 1] },
      answer: "lev",
      prompt: "Your equity is {equity:2} and your open positions are worth {equity * lev:2}. What is your effective leverage?",
      explanation: "Effective leverage = position value ÷ equity = {equity * lev:2} ÷ {equity:2} = {answer}×. Whatever the broker allows, a 1% move now costs {answer}% of the account.",
      hint: "{equity * lev:2} ÷ {equity:2}.",
    },
  },
  {
    id: "q-1.8.5-2",
    topic: "portfolio_exposure",
    kind: "numeric",
    difficulty: 2,
    prompt: "You run 15× effective leverage. How big a move against you wipes out the whole account, in %?",
    numeric: { answer: 6.67, tolerance: 0.01, unit: "%" },
    explanation: "The account loses the price move times the leverage. It's gone when that reaches 100%: 100% ÷ 15 = 6.67%. At 1× the same account would need the price to fall to zero.",
    lesson: "1.8.5",
    concepts: ["effective-leverage"],
    hints: ["% of the account lost = % move × effective leverage.", "Set that equal to 100% and solve for the move: 100 ÷ 15."],
    vary: {
      fields: { lev: [2, 40, 1] },
      answer: "round(100 / lev, 2)",
      prompt: "You run {lev}× effective leverage. How big a move against you wipes out the whole account, in %?",
      explanation: "The account loses the price move times the leverage. It's gone when that reaches 100%: 100% ÷ {lev} = {answer:2}%.",
      hint: "Set move × {lev} equal to 100% and solve: 100 ÷ {lev}.",
    },
  },
  {
    id: "q-1.8.5-3",
    topic: "portfolio_exposure",
    kind: "scenario",
    difficulty: 2,
    scenario: "Mia trades CFDs at 20× effective leverage with no stop. A fast move takes her equity down to half the required margin and the broker closes all her positions. She says: 'At least the close-out worked like a stop.'",
    prompt: "What's wrong with her view?",
    options: [
      { id: "a", label: "A close-out is a failure of sizing: it comes after most of the account is gone, at a price she didn't choose" },
      { id: "b", label: "Nothing: the close-out limited her loss the way a stop would", rationale: "A stop limits the loss to a planned 1R. The close-out came only after most of her account was already gone." },
      { id: "c", label: "The close-out should have come later, to give the trade room", rationale: "Later would mean an even bigger loss. The problem is the size of the position, not the timing of the close-out." },
      { id: "d", label: "She should ask for more leverage, so close-outs come later", rationale: "More leverage makes the same move cost more. It would make the next close-out arrive faster, not later." },
    ],
    correct: "a",
    explanation: "A stop is a price chosen in advance where the idea fails, sized so the loss is 1R. A close-out happens when the account can no longer carry the position: by then most of the equity is gone, and it fills at whatever price is there.",
    lesson: "1.8.5",
    concepts: ["margin-close-out", "effective-leverage"],
    hints: ["Who chose the exit price, and when?", "How much of the account was gone when the close-out happened?"],
  },
];

// ─── Terms and concepts introduced in 1.8 ──────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "martingale",
    term: "Martingale",
    definition: "A betting system that doubles the stake after every loss, so that one win recovers all the losses plus the first stake. With limited capital, a long enough losing run wipes it out.",
    plain: "Doubling up after each loss. It wins small most of the time and eventually loses a huge amount at once.",
    related: ["averaging-down", "blow-up", "position-size"],
    lesson: "1.8.1",
    aka: ["Doubling up"],
  },
  {
    id: "averaging-down",
    term: "Averaging down",
    definition: "Adding to a losing position to lower its average price, usually without a limit set in advance. It raises the risk on an idea that is already going wrong.",
    plain: "Buying more because the price fell. It makes the bet bigger exactly when it's going wrong.",
    related: ["martingale", "scaling-in", "blow-up"],
    lesson: "1.8.1",
  },
  {
    id: "blow-up",
    term: "Blow-up",
    definition: "Losing most or all of an account, usually through oversizing, leverage or doubling after losses.",
    plain: "When an account is wiped out, or damaged so badly it can't realistically recover.",
    related: ["martingale", "leverage", "drawdown"],
    lesson: "1.8.1",
  },
  {
    id: "grid-trading",
    term: "Grid trading",
    definition: "Placing buy and sell orders at fixed price steps around a price, often without stops, so positions are added as price moves away.",
    plain: "A net of orders every so many points. It earns small amounts in a range and piles up losses in a trend.",
    related: ["averaging-down", "martingale", "exposure"],
    lesson: "1.8.2",
    aka: ["Grid bot"],
  },
  {
    id: "out-of-sample",
    term: "Out-of-sample",
    definition: "Data a method was not built or tuned on. Results there are a fairer test than results on the data used to design it.",
    plain: "New data the method has never seen. A system that only fits the past it was built on fails here.",
    related: ["backtest", "cherry-picking", "survivorship-bias"],
    lesson: "1.8.3",
  },
  {
    id: "signal-service",
    term: "Signal service",
    definition: "A paid service that tells subscribers when to buy or sell. Its published track record is often selective and rarely audited.",
    plain: "Someone sells you trade alerts. The results they show are usually their best ones.",
    related: ["pump-and-dump", "out-of-sample"],
    lesson: "1.8.4",
  },
  {
    id: "segregated-funds",
    term: "Segregated funds",
    definition: "Client money that a regulated broker must keep in accounts separate from its own, so it can't use it to run its business.",
    plain: "Your deposit is kept apart from the broker's own money, which protects it if the broker fails.",
    related: ["b-book", "margin"],
    lesson: "1.8.4",
    aka: ["Client money segregation"],
  },
  {
    id: "pump-and-dump",
    term: "Pump-and-dump",
    definition: "Hyping an asset to push its price up, then selling to the buyers the hype attracted. It is illegal market manipulation.",
    plain: "Someone talks a price up, sells to you at the top, and leaves you holding it.",
    related: ["signal-service", "liquidity"],
    lesson: "1.8.4",
  },
  {
    id: "b-book",
    term: "B-book",
    definition: "A broker model in which the broker takes the other side of client trades instead of passing them to the market, so a client's loss is the broker's gain.",
    plain: "The broker is your counterparty: when you lose, it earns.",
    related: ["market-maker", "segregated-funds"],
    lesson: "1.8.4",
  },
  {
    id: "effective-leverage",
    term: "Effective leverage",
    definition: "The total value of open positions divided by equity. It, not the broker's maximum, sets how hard a price move hits the account.",
    plain: "How big your positions really are compared with your money. At 10×, a 1% move is 10% of your account.",
    related: ["leverage", "exposure", "margin", "margin-close-out"],
    lesson: "1.8.5",
  },
  {
    id: "margin-call",
    term: "Margin call",
    definition: "A broker's warning or demand for more funds when equity falls below the margin needed to keep positions open.",
    plain: "The broker telling you that your account is too small for the positions you hold.",
    related: ["margin", "margin-close-out", "leverage"],
    lesson: "1.8.5",
  },
  {
    id: "margin-close-out",
    term: "Margin close-out",
    definition: "The broker closing positions automatically when equity falls too far below the required margin. For EU retail CFD accounts it happens at 50% of the required margin.",
    plain: "The broker closes your trades for you, at whatever price is there, because your money ran out.",
    related: ["margin-call", "margin", "effective-leverage", "negative-balance-protection"],
    lesson: "1.8.5",
    aka: ["Stop-out"],
  },
  {
    id: "negative-balance-protection",
    term: "Negative balance protection",
    definition: "A rule for retail clients in the EU and the UK that limits losses on leveraged products such as CFDs to the money in the account.",
    plain: "You can't end up owing the broker more than you put in.",
    related: ["margin-close-out", "leverage"],
    lesson: "1.8.5",
  },
];

const CONCEPTS: Concept[] = [
  {
    id: "martingale",
    name: "Martingale",
    category: "risk_management",
    summary: "Doubling the stake after each loss so one win recovers everything; with finite capital it ends in ruin.",
    body: [
      "After n losses a doubling bet is 2ⁿ times the first, and 2ⁿ − 1 times the first is already lost. The first win recovers it all plus one stake, so the method wins small almost every cycle.",
      "In a fair game each cycle's expected result is exactly zero, and costs make it negative. Long losing runs are rare on any one bet but likely over many, and the money runs out before the doubling can continue.",
    ],
    example: "A 10.00 first bet on fair coin flips: 9 losses in a row cost 5,110.00, and the next bet is 5,120.00. Over 1,000 flips, a run of 9 shows up 62.4% of the time.",
    related: ["averaging-down", "position-sizing", "drawdown"],
    missions: ["M05"],
    lessons: ["1.8.1"],
  },
  {
    id: "averaging-down",
    name: "Averaging down",
    category: "risk_management",
    summary: "Adding to a losing position without a predefined limit; martingale in disguise.",
    body: [
      "Averaging down buys more of a position that is losing, to lower its average price. The stop is usually skipped or moved, so the risk grows exactly when the idea is failing.",
      "A planned split entry is different: sizes, levels and one stop are fixed before the first order, and the total loss at the stop stays inside the budget.",
    ],
    example: "Buy 50 at 100.00 with a stop at 98.00, so 1R = 100.00. Buy 50 more at 98.00 instead of exiting: at 96.00 the loss is 100 × (99.00 − 96.00) = 300.00, 3R.",
    related: ["martingale", "position-sizing", "stop-loss-order"],
    missions: ["M07"],
    lessons: ["1.8.1"],
  },
  {
    id: "grid-trading",
    name: "Grid trading",
    category: "risk_management",
    summary: "Orders at fixed steps around a price, often without stops, that pile up exposure when a trend arrives.",
    body: [
      "A grid buys at fixed steps below the price and sells each lot a step higher. In a range it closes many small wins; its losing lots stay open.",
      "When price trends away, every step adds units and the open loss grows faster than the fall. The equity curve looks smooth until the trend makes the hidden loss visible.",
    ],
    example: "10 units bought at every 1.00 from 99.00 to 90.00: 100 units at an average of 94.50. At 90.00 the open loss is 450.00, 15 times the 30.00 the grid earned in the range before.",
    related: ["martingale", "averaging-down", "exposure"],
    missions: [],
    lessons: ["1.8.2"],
  },
  {
    id: "performance-claims",
    name: "Performance claims",
    category: "decision_making",
    summary: "A performance claim is judged on sample size, costs, period, worst loss, selection and a benchmark comparison.",
    body: [
      "A win rate or a return means little alone. The sample says whether luck could explain it, costs whether it survives trading, the worst loss whether a high win rate hides rare disasters, and the benchmark whether it beat simply holding the market.",
      "Selection is the hardest part to see: only survivors are shown. Even real edges shrink once published, so a published figure is an upper bound.",
    ],
    example: "Of 1,000 coin-flip systems with no edge, about 28 show +20R or more over 100 trades. Show only those and luck looks like skill.",
    related: ["survivorship-bias", "expectancy", "base-rates"],
    missions: [],
    lessons: ["1.8.3"],
  },
  {
    id: "broker-due-diligence",
    name: "Broker due diligence",
    category: "market_fundamentals",
    summary: "Checking a broker's licence, client-money rules, protections and execution model before opening an account.",
    body: [
      "The licence is checked on the regulator's own register, for the exact company and website you'd sign with. Then come client-money rules, compensation schemes and retail protections such as negative balance protection.",
      "Finally the execution model: an A-book broker passes orders to the market, a B-book broker takes the other side, so client losses are its revenue.",
    ],
    example: "Search the firm on the FCA register in the UK or the ASF register in Romania, check that the name and web address match, read how client money is held and whether the broker takes the other side of your trades.",
    related: ["scam-red-flags", "leverage"],
    missions: [],
    lessons: ["1.8.4"],
  },
  {
    id: "scam-red-flags",
    name: "Scam red flags",
    category: "decision_making",
    summary: "Guaranteed returns, bonuses, pressure, offshore-only licences and blocked withdrawals signal a likely scam.",
    body: [
      "No market return can be guaranteed, and regulated firms don't promise one. Bonuses tie up deposits, deadlines cut your checking short, and offshore-only licences leave little protection.",
      "An offer that reaches you without being asked for is a scam until you've checked it yourself, on the regulator's register.",
    ],
    example: "'30% a month guaranteed, 3 places left today, deposit with our offshore partner for a 100% bonus': at least four red flags in one message.",
    related: ["broker-due-diligence", "fomo"],
    missions: ["M06"],
    lessons: ["1.8.4"],
  },
  {
    id: "effective-leverage",
    name: "Effective leverage",
    category: "portfolio_exposure",
    summary: "Position value divided by equity; it sets how hard a price move hits the account, whatever the broker allows.",
    body: [
      "The broker's maximum leverage is only a ceiling. Effective leverage measures what you actually hold: a 1% move costs 1% of the account for each 1× of effective leverage.",
      "The move that wipes out the account is 100% ÷ effective leverage. Sizing from the stop keeps the planned risk fixed; leverage only decides how easy it is to oversize.",
    ],
    example: "Equity 10,000.00, positions 50,000.00: 5×. A 4% move costs 2,000.00, 20% of the account, and a 20% move wipes it out.",
    related: ["leverage", "exposure", "margin-close-out"],
    missions: [],
    lessons: ["1.8.5"],
  },
  {
    id: "margin-close-out",
    name: "Margin close-out",
    category: "portfolio_exposure",
    summary: "The forced closing of positions when equity falls too far below required margin; a failure of sizing, not a stop.",
    body: [
      "When losses eat into the margin a position needs, the broker may call for funds and then close positions automatically. For EU retail CFD accounts the close-out comes at 50% of the required margin.",
      "Unlike a stop, nobody chose the price: it comes after most of the account is gone, at whatever price is there.",
    ],
    example: "Equity 5,000, 1 lot of EUR/USD at 1.1000 (110,000) at 30:1: margin 3,666.67. The close-out comes at 1,833.33 of equity, a 3,166.67 loss, 63% of the account, after a 2.9% move.",
    related: ["effective-leverage", "leverage", "stop-loss-order"],
    missions: [],
    lessons: ["1.8.5"],
  },
];

/** Unit 1.8 · Danger zone (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_1_8: UnitContent = {
  intro: {
    summary: "This unit shows what destroys accounts and how it looks from outside: martingale and averaging down, grids, holy-grail claims, signal sellers and unregulated brokers, and maximum leverage. It closes Level 1 because you now have the tools to see why: expected value, streaks, survivorship, risk per trade and exposure.",
    outcomes: [
      "Calculate the next bet and the total loss of a doubling sequence after a losing run.",
      "Work out the open loss of a grid without stops when price trends away.",
      "Check a performance claim for sample, costs, period, worst loss and what was left out.",
      "Verify a broker's licence on the regulator's own register and spot the red flags of scams.",
      "Calculate effective leverage and the price move that would wipe out an account.",
    ],
    buildsOn: "Builds on expected value (0.2.2), streaks (0.2.3) and survivorship bias (0.2.6); risk per trade (1.4.1), exposure and leverage (1.4.7) and drawdowns (1.4.8); and the gambler's fallacy (1.7.3).",
  },
  lessons: [L_1_8_1, L_1_8_2, L_1_8_3, L_1_8_4, L_1_8_5],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
