import type { CandleData, Concept, GlossaryTerm, Lesson, Question, UnitContent } from "../../types";

/**
 * Unit 1.4 · Risk comes first (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce.
 * 1.4.1 (L08), 1.4.3 (L10), 1.4.4 (L09), 1.4.5 (L11) and 1.4.7 (L12) live in content/scripts/u3.ts.
 * Every number follows the engine: commission 0.05% per fill, rounded up to the cent (riskAmount, maxQtyForRisk).
 */

const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

/** 1.4.8: account equity after each of 15 trades, one candle per trade (open = equity before, close = after). Peak 12,000 on trade 5, low 9,600 on trade 9, new high on trade 14. */
const EQUITY_PATH = [10000, 10400, 10900, 10700, 11500, 12000, 11500, 11000, 10300, 9600, 10100, 10800, 11500, 11900, 12300, 12500];
const EQUITY_CANDLES: CandleData[] = EQUITY_PATH.slice(1).map((v, i) => k(EQUITY_PATH[i], Math.max(EQUITY_PATH[i], v), Math.min(EQUITY_PATH[i], v), v));

// ─── 1.4.2 · R: one unit for every trade ───────────────────────────────────

const L_1_4_2: Lesson = {
  id: "1.4.2",
  title: "R: one unit for every trade",
  topic: "risk_management",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "R is the loss at the initial stop, costs included; measured in R, trades of any size can be compared.",
  objectives: [
    "Calculate 1R from the entry, the stop, the size and the costs.",
    "Express any trade result as an R-multiple.",
    "Explain why R is fixed at entry and doesn't change when a stop is moved.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
  ],
  script: {
    unit: "1.4",
    courseId: "1.4.2",
    hook: {
      prompt: "Trade A risked 100.00 and made 150.00. Trade B risked 400.00 and made 300.00. Which did better for what it risked?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Trade A" },
          { id: "b", label: "Trade B" },
          { id: "c", label: "They did the same" },
        ],
        answer: "a",
      },
      compare: "You picked {yours}. A made 1.5 times what it risked: +1.5R. B made more money but only 0.75 times its risk: +0.75R.",
      concept: "r-multiple",
    },
    learn: [
      {
        kind: "explain",
        title: "1R, with costs",
        text: "[[r|1R]] is what you lose if the [[stop-loss]] you set at entry fills as planned: units × distance to the stop, plus both [[commission|commissions]]. The simulator computes it the same way. In 1.3 R was a ratio; in 1.4.1 it was your budget. Now it becomes the unit for every result: the trade's [[initial-risk|initial risk]].",
      },
      {
        kind: "worked",
        title: "From money to R",
        lines: [
          "40 units at 50.00, stop 48.50: 40 × 1.50 = 60.00 before costs (61.97 with both commissions).",
          "Exit at 53.00: 40 × 3.00 = 120.00 before costs.",
          "Result in R, before costs: 120.00 ÷ 60.00 = ?",
        ],
        ask: {
          answer: 2,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 120, text: "That's the result in vUSD. Divide it by the 1R of 60.00." },
            { value: 0.5, text: "That's 1R divided by the result. Put the result on top: 120.00 ÷ 60.00." },
          ],
          correct: "Right. +2R: the trade made twice what it risked.",
        },
        after: "With costs: +117.94 on a 1R of 61.97, so +1.90R. Costs always pull a trade's R a little lower.",
        concept: "r-multiple",
      },
      {
        kind: "match",
        title: "Results in R",
        prompt: "Match each outcome to its result in R. 1R is the planned loss at the stop.",
        pairs: [
          { left: "Stopped exactly as planned", right: "−1R" },
          { left: "Target at twice the stop distance", right: "+2R" },
          { left: "A gap fills the stop 25% further away", right: "−1.25R", wrong: "A gap past the stop makes the loss bigger than planned: 25% further away is 1.25 times 1R." },
          { left: "Closed at the entry price", right: "Slightly below 0R, after costs", wrong: "Price didn't move, but you paid two commissions. The result is a small loss, just under 0R." },
        ],
        columns: ["Outcome", "Result"],
        concept: "r-multiple",
      },
      {
        kind: "predict",
        title: "A moved stop",
        prompt: "Same trade: 40 units at 50.00, stop 48.50, so 1R = 60.00 before costs. You moved the stop down to 47.00 and were stopped there. What's the result?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "−1R", feedback: "A stop-out is −1R only at the initial stop. You lost 120.00, twice the 60.00 you planned to risk." },
            { id: "b", label: "−2R" },
            { id: "c", label: "Can't say: the stop changed", feedback: "R was fixed when you entered: 60.00. The loss is measured against it." },
          ],
          answer: "b",
        },
        reveal: "40 × 3.00 = 120.00 lost against an initial 1R of 60.00: −2R before costs, −1.97R with them (121.94 ÷ 61.97). R is fixed at entry; moving the stop doesn't reset it. The simulator stores the initial risk with every trade.",
        concept: "initial-risk",
      },
      {
        kind: "explain",
        title: "Why measure in R",
        text: "R compares trades of any size, from any account. Make 200.00 on a 100.00 risk or 2,000.00 on a 1,000.00 risk: both are +2R. Your [[journal]], your [[expectancy]] and your scores all speak in R. Results in money change with the size; results in R show how well the trade worked.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "A trade without a stop has no R: its risk is undefined, so its result can't be measured or compared with anything. That's one more reason every entry needs a stop.",
      },
      {
        kind: "match",
        title: "Your R journal",
        prompt: "Six trades from a journal. Work out each result in R, before costs: (exit − entry) ÷ (entry − stop). Then match.",
        pairs: [
          { left: "50 units · entry 100.00 · stop 98.00 · exit 104.00", right: "+2.00R" },
          { left: "25 units · entry 100.00 · stop 96.00 · exit 96.00", right: "−1.00R" },
          { left: "80 units · entry 50.00 · stop 48.75 · exit 51.25", right: "+1.00R" },
          { left: "40 units · entry 50.00 · stop 48.50 · exit 47.00 after a gap", right: "−2.00R", wrong: "The gap filled 3.00 below the entry, twice the 1.50 risk per unit." },
          { left: "100 units · entry 20.00 · stop 19.60 · exit 20.20", right: "+0.50R" },
          { left: "30 units · entry 75.00 · stop 73.00 · exit 75.00", right: "0.00R" },
        ],
        columns: ["Trade", "R"],
        correct: "All six. Notice that the units never mattered: R compares the move with the risk per unit.",
        concept: "r-multiple",
      },
    ],
    check: ["q-1.4.2-1", "q-1.4.2-2", "q-1.4.2-3"],
    recap: {
      takeaways: [
        "1R is the loss at the initial stop: units × distance, plus both commissions.",
        "Result in R = result ÷ 1R. 120.00 on a 60.00 risk is +2R.",
        "R is fixed at entry. A stop moved to 47.00 turned a 1R plan into −2R.",
      ],
    },
  },
};

// ─── 1.4.6 · Costs in R and the real break-even ────────────────────────────

const L_1_4_6: Lesson = {
  id: "1.4.6",
  title: "Costs in R and the real break-even",
  topic: "risk_management",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Costs take a fixed amount per unit, so the tighter the stop, the bigger their share of every R and the higher the real break-even.",
  objectives: [
    "Express a trade's round-trip cost as a share of its stop distance.",
    "Recalculate the break-even win rate of a 2:1 plan once costs are included.",
    "Explain why tighter stops make costs a larger part of every R.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "low_volatility", label: "Arena: low volatility" },
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
  ],
  script: {
    unit: "1.4",
    courseId: "1.4.6",
    hook: {
      prompt: "Two plans on LABX at 100.00, both 2:1. Plan A: stop 2.00 away. Plan B: stop 0.20 away. A round trip costs about 0.20 per unit. Which needs the higher win rate to break even?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Plan A" },
          { id: "b", label: "Plan B" },
          { id: "c", label: "The same: both are 2:1" },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. In Plan B the costs equal the whole stop distance, so it must win 66.7% of the time. Plan A needs 36.7%.",
      concept: "costs-in-r",
    },
    learn: [
      {
        kind: "explain",
        title: "What a round trip costs",
        text: "In MARKET//LAB, 1R already includes commissions. This lesson splits a trade into its price part and its costs, to show how much of each R goes to costs. On LABX at 100.00 a [[round-trip|round trip]] costs about 0.20 per unit: the 0.10 [[spread]] plus two [[commission|commissions]] of about 0.05. Compare that with the stop distance.",
      },
      {
        kind: "worked",
        title: "Costs as a share of R",
        lines: ["Stop 2.00 away: 0.20 ÷ 2.00 = 0.10, a tenth of the risk.", "Stop 0.50 away: 0.20 ÷ 0.50 = ?"],
        ask: {
          answer: 0.4,
          tolerance: 0.005,
          feedback: [
            { value: 2.5, text: "That's 0.50 ÷ 0.20, upside down. Divide the costs by the stop distance." },
            { value: 40, text: "40% is right as a percentage. Here, type the ratio itself: 0.40." },
          ],
          correct: "Right. 0.40: costs take 40% of every R.",
        },
        after: "Every unit pays the same 0.20 whatever the stop. The tighter the stop, the bigger the slice of R it takes.",
        concept: "costs-in-r",
      },
      {
        kind: "figure",
        title: "Costs as a share of the stop",
        figure: {
          kind: "bars",
          bars: [
            { label: "Stop 2.00 away", value: 10, role: "accent" },
            { label: "Stop 1.00 away", value: 20, role: "accent" },
            { label: "Stop 0.50 away", value: 40, role: "down" },
            { label: "Stop 0.20 away", value: 100, role: "down" },
          ],
          unit: "%",
          steps: [
            "Stop 2.00 away: costs are 10% of the risk.",
            "Halve the stop and the share doubles: 20%, then 40%.",
            "At 0.20, costs equal the whole stop distance.",
          ],
        },
        concept: "costs-in-r",
      },
      {
        kind: "explain",
        title: "The real break-even",
        text: "With costs, a 2:1 plan loses the stop plus costs and wins the target minus costs. Stop 2.00, target 4.00: you lose 2.20 or win 3.80 per unit. [[break-even|Break-even]] = 2.20 ÷ (2.20 + 3.80) = 36.7%, not 33.3%. The share of the result that goes to costs is called [[cost-drag]].",
      },
      {
        kind: "worked",
        title: "A tight stop, after costs",
        lines: ["Stop 0.50, target 1.00, costs 0.20 per unit.", "A loss costs 0.50 + 0.20 = 0.70. A win pays 1.00 − 0.20 = 0.80.", "Break-even = 0.70 ÷ (0.70 + 0.80) = ?"],
        ask: {
          answer: 46.7,
          tolerance: 0.1,
          unit: "%",
          feedback: [
            { value: 33.3, text: "That's the break-even before costs. Use the loss and the win after costs: 0.70 and 0.80." },
            { value: 41.2, text: "That leaves the costs out of the win. A win pays 1.00 − 0.20 = 0.80, not 1.00." },
          ],
          correct: "Right. 46.7%: the tight stop has to win almost half the time just to break even.",
        },
        after: "Same 2:1 on the chart, yet the plan needs about 13 points more win rate than the 33.3% before costs. That's what costs do to a 0.50 stop.",
        concept: "costs-in-r",
      },
      {
        kind: "predict",
        title: "40% at 2:1, after costs",
        prompt: "A setup wins 40% of the time at 2:1. With a 0.50 stop and costs of 0.20 per unit, does it make money?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Yes: 40% is above the 33.3% break-even", feedback: "33.3% is the break-even before costs. With a 0.50 stop it's 46.7%, and 40% falls short." },
            { id: "b", label: "No" },
          ],
          answer: "b",
        },
        reveal: "No. In stop distances, a win brings 0.80 ÷ 0.50 = 1.6 and a loss costs 0.70 ÷ 0.50 = 1.4.\n0.40 × 1.6 − 0.60 × 1.4 = −0.20 per trade.\nWith a 2.00 stop: 0.40 × 1.9 − 0.60 × 1.1 = +0.10. Same setup, same win rate.",
        concept: "expectancy",
      },
      {
        kind: "predict",
        title: "The tightest stop that works",
        prompt: "Entry 100.00, costs 0.20 per unit, target always twice the stop distance. What's the tightest stop whose break-even after costs is 40% or lower?",
        control: {
          kind: "slider",
          min: 0.2,
          max: 2,
          step: 0.1,
          unit: "away",
          start: 0.2,
          answer: 1,
          tolerance: 0.01,
          feedback: [
            { from: 0.2, to: 0.95, text: "Too tight. At 0.90, break-even is 1.10 ÷ 2.70 = 40.7%, still above 40%." },
            { from: 1.05, to: 2, text: "That works, but a tighter stop does too. At 1.00 break-even is exactly 40.0%." },
          ],
        },
        reveal: "1.00: (1.00 + 0.20) ÷ 3.00 = 40.0%. For a stop d away, break-even after costs is (d + 0.20) ÷ 3d. Any tighter and costs push it above 40%.",
        concept: "costs-in-r",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Every edge is quoted after costs. Shorter stops and shorter timeframes need much bigger raw edges to survive them. You'll see it again with scalping, in 2.9.",
      },
    ],
    task: {
      widget: "expectancy",
      goal: "Stop 0.50, target 1.00, costs 0.20 per unit. In stop distances, a win pays +1.6 and a loss costs 1.4. Find the lowest win rate at which the plan stops losing money.",
      start: { winRate: 40, avgWin: 1.6, avgLoss: 1.4, runLength: 5 },
      locked: ["avgWin", "avgLoss", "runLength"],
      hidden: ["runProb"],
      success: { field: "winRate", eq: 47 },
      feedback: [
        { when: { field: "expectancy", lt: 0 }, text: "Expectancy is still negative at {winRate}%. Keep raising the win rate." },
        { when: { field: "winRate", gt: 47 }, text: "That's positive, but it already was at a lower rate. Step down to the first one." },
      ],
      correct: "Right. At 47% expectancy is +0.01 per trade; at 46%, −0.02. Break-even sits at 46.7%, against 33.3% before costs.",
      hints: [
        "Raise the win rate and watch the expectancy row change sign.",
        "Break-even = loss ÷ (loss + win) = 1.4 ÷ (1.4 + 1.6).",
        "1.4 ÷ 3.0 = 46.7%. The first whole rate above it is the answer.",
      ],
      showMe: { winRate: 47 },
      concept: "costs-in-r",
    },
    check: ["q-1.4.6-1", "q-1.4.6-2", "q-1.4.6-3"],
    recap: {
      takeaways: [
        "Costs ÷ stop distance is the share of every R lost to costs: 0.20 ÷ 0.50 = 40%.",
        "Break-even after costs = (stop + costs) ÷ (stop + target): 36.7% for a 2.00 stop at 2:1.",
        "Tighter stops make the same costs a bigger part of R and push break-even up.",
      ],
    },
  },
};

// ─── 1.4.8 · Drawdowns: depth, duration and what's normal ──────────────────

const L_1_4_8: Lesson = {
  id: "1.4.8",
  title: "Drawdowns: depth, duration and what's normal",
  topic: "risk_management",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Drawdown is measured from the equity peak; its depth and duration follow from your risk per trade and the losing runs a method normally has.",
  objectives: [
    "Measure drawdown from the equity peak, not from the starting balance.",
    "Estimate how deep a normal losing run goes at a given risk per trade.",
    "Read an underwater curve for depth and time to recover.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
    { kind: "check", ref: "risk_management", label: "Knowledge check: risk management" },
  ],
  script: {
    unit: "1.4",
    courseId: "1.4.8",
    hook: {
      prompt: "Your account went 10,000.00 → 12,000.00 → 9,600.00 → 12,500.00. What was the maximum drawdown?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "4%" },
          { id: "b", label: "20%" },
          { id: "c", label: "25%" },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. Drawdown is measured from the peak: 12,000.00 down to 9,600.00 is 20%. Measured from the start, it looks like only 4%.",
      concept: "drawdown",
    },
    learn: [
      {
        kind: "explain",
        title: "Measured from the peak",
        text: "A [[drawdown]] is a fall from the highest [[equity]] reached so far, not from where you started. The deepest one is the [[max-drawdown|maximum drawdown]]. A drawdown also lasts: its duration is the time spent below the old peak, until a new high is made.",
      },
      {
        kind: "figure",
        title: "Fifteen trades of equity",
        figure: {
          kind: "chart",
          chart: {
            candles: EQUITY_CANDLES,
            describe: "Account equity over fifteen trades, one candle per trade. It rises from 10,000.00 to a peak of 12,000.00 after trade 5, falls to 9,600.00 after trade 9 and makes a new high of 12,300.00 after trade 14.",
          },
          steps: [
            {
              text: "Each candle is one trade's change in equity. The peak: 12,000.00 after trade 5.",
              layers: [
                { kind: "level", price: 12000, role: "neutral", label: "Peak 12,000.00" },
                { kind: "marker", index: 4, at: "high", role: "neutral" },
              ],
            },
            {
              text: "The low after it: 9,600.00, after trade 9. That's 20% below the peak.",
              layers: [
                { kind: "bracket", from: 9600, to: 12000, index: 8, label: "−20%", role: "down" },
                { kind: "marker", index: 8, at: "low", role: "down" },
              ],
            },
            {
              text: "Trade 14 makes a new high. The account spent eight trades below its peak.",
              layers: [{ kind: "marker", index: 13, at: "high", label: "New high", role: "up" }],
            },
          ],
        },
        concept: "drawdown",
      },
      {
        kind: "worked",
        title: "Depth from the peak",
        lines: ["Peak: 12,000.00. Lowest point after it: 9,600.00.", "Drop: 12,000.00 − 9,600.00 = 2,400.00.", "Drawdown = 2,400.00 ÷ 12,000.00 = ?"],
        ask: {
          answer: 20,
          tolerance: 0.01,
          unit: "%",
          feedback: [
            { value: 24, text: "That divides by 10,000.00, the start. Divide by the peak, 12,000.00." },
            { value: 4, text: "That compares 9,600.00 with the start. Drawdown is measured from the peak." },
          ],
          correct: "Right. 20% from the peak, although the account never fell more than 4% below its start.",
        },
        after: "Climbing from 9,600.00 back to 12,000.00 took a 25% gain, as the recovery table in 1.4.1 predicts.",
        concept: "drawdown",
      },
      {
        kind: "figure",
        title: "Eight losses in a row",
        figure: {
          kind: "bars",
          bars: [
            { label: "At 1% per trade", value: -7.7, role: "down" },
            { label: "At 2% per trade", value: -14.9, role: "down" },
            { label: "At 5% per trade", value: -33.7, role: "down" },
          ],
          unit: "%",
          steps: [
            "Eight losses in a row at 1% risk: 7.7% below the peak.",
            "At 2%: 14.9%. Each loss takes 2% of what's left.",
            "At 5%: 33.7%. The same run, a third of the account.",
          ],
        },
        text: "Losing runs are what dig drawdowns. How common is a run of 8? You'll measure it in the Try.",
        concept: "expected-drawdown",
      },
      {
        kind: "predict",
        title: "Down by half",
        prompt: "At 1% risk per trade, about how many losses in a row take the account down 50%?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "50", feedback: "50 losses of 1% of the start would. But each loss is 1% of what's left, so it takes more." },
            { id: "b", label: "69" },
            { id: "c", label: "100", feedback: "After 100 losses at 1% you'd be down 63.4%. Half is gone sooner." },
          ],
          answer: "b",
        },
        reveal: "69. After 69 losses of 1% each, 49.98% of the account is left. At 1% risk, halving the account takes a run you'll almost never see. At 5% risk, it takes 14.",
        concept: "expected-drawdown",
      },
      {
        kind: "explain",
        title: "Depth and duration",
        text: "An [[underwater-curve]] plots how far equity sits below its last peak, trade by trade. It shows both sides of a drawdown: how deep it went and how long it lasted. Deeper holes take longer to climb out of, because the gain needed grows faster than the loss.",
        figure: {
          kind: "bars",
          bars: [
            { label: "Trade 6", value: -4.2, role: "down" },
            { label: "Trade 7", value: -8.3, role: "down" },
            { label: "Trade 8", value: -14.2, role: "down" },
            { label: "Trade 9", value: -20, role: "down" },
            { label: "Trade 10", value: -15.8, role: "down" },
            { label: "Trade 11", value: -10, role: "down" },
            { label: "Trade 12", value: -4.2, role: "down" },
            { label: "Trade 13", value: -0.8, role: "down" },
            { label: "Trade 14", value: 0, role: "up" },
          ],
          unit: "%",
          steps: [
            "Trades 6 to 8: equity slides to 14.2% below the 12,000.00 peak.",
            "Trade 9 is the bottom, 20% below. Then the climb back starts.",
            "Trade 14 makes a new high. Eight trades were spent underwater.",
          ],
        },
      },
      {
        kind: "predict",
        title: "A run of 12",
        prompt: "A run of 12 losses is unlikely but possible: at a 40% win rate it turns up in about 1 in 3 stretches of 500 trades. What's the highest risk per trade that keeps it within a 20% drawdown?",
        control: {
          kind: "slider",
          min: 0.5,
          max: 3,
          step: 0.25,
          unit: "%",
          start: 0.5,
          answer: 1.75,
          tolerance: 0.01,
          feedback: [
            { from: 0.5, to: 1.5, text: "That stays inside 20%, but a higher risk does too. At 1.75%, 12 losses take 19.1%." },
            { from: 2, to: 3, text: "Too far. At 2.00%, 12 losses take 21.5%; at 2.50%, 26.2%." },
          ],
        },
        reveal: "1.75%. After 12 losses, 0.9825 multiplied 12 times leaves 80.9% of the account: a 19.1% drawdown. At 2.00% it's 21.5%. Risk per trade and the depth that triggers a review have to be set together.",
        concept: "expected-drawdown",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A drawdown inside the normal range is [[variance]], not a broken method. Write in your plan, in advance, the depth at which you stop and review. Then a losing run triggers a review, not a panic.",
      },
    ],
    task: {
      widget: "expectancy",
      goal: "Your method wins 40% of its trades. Make the losing run longer until it shows up in fewer than half of all 100-trade stretches. Anything shorter is normal, not bad luck.",
      start: { winRate: 40, avgWin: 2, avgLoss: 1, runLength: 5 },
      locked: ["winRate", "avgWin", "avgLoss"],
      hidden: ["expectancy"],
      success: { field: "runLength", eq: 8 },
      feedback: [
        { when: { field: "runProb", gte: 50 }, text: "{runLength} losses in a row show up in {runProb:1}% of 100-trade stretches: more likely than not. Make the run longer." },
        { when: { field: "runLength", gt: 8 }, text: "That's under half, but a shorter run already was. Step back to the first one below 50%." },
      ],
      correct: "Right. 8 in a row shows up in 49.0% of 100-trade stretches, about a coin flip. At 1% risk it costs 7.7%; at 5%, 33.7%.",
      hints: ["Lengthen the run and watch the chance row fall.", "You want the first run length where the chance drops below 50%.", "7 in a row: 68.9%. Try one more."],
      showMe: { runLength: 8 },
      concept: "expected-drawdown",
    },
    check: ["q-1.4.8-1", "q-1.4.8-2", "q-1.4.8-3"],
    recap: {
      takeaways: [
        "Measure drawdown from the equity peak: 12,000.00 to 9,600.00 is 20%, not 4%.",
        "At a 40% win rate, 8 losses in a row is normal. At 1% risk it costs 7.7%.",
        "An underwater curve shows each drawdown's depth and how long the recovery took.",
      ],
    },
  },
};

// ─── 1.4.9 · Daily loss limits ─────────────────────────────────────────────

const L_1_4_9: Lesson = {
  id: "1.4.9",
  title: "Daily loss limits",
  topic: "risk_management",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "A daily loss limit, set before the session, ends the day once the next trade's risk no longer fits, before losses turn into revenge trades.",
  objectives: [
    "Set a daily loss limit in R and in vUSD before the session starts.",
    "Stop trading for the day when the next trade's risk no longer fits the limit.",
    "Explain why a daily limit protects against the most expensive behaviour after losses.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "check", ref: "risk_management", label: "Knowledge check: risk management" },
  ],
  script: {
    unit: "1.4",
    courseId: "1.4.9",
    hook: {
      prompt: "Your plan risks 1% per trade and you take six trades a day. At a 40% win rate, how often does a day bring at least three losses in a row?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "About 5% of days" },
          { id: "b", label: "About 20% of days" },
          { id: "c", label: "About 50% of days" },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. With six trades at a 40% win rate, a run of three losses happens on 47.5% of days: nearly one day in two.",
      concept: "daily-loss-limit",
    },
    learn: [
      {
        kind: "explain",
        title: "A limit for the day",
        text: "A [[daily-loss-limit|daily loss limit]] is the most you allow yourself to lose in one day, fixed before the session, in R or as a percentage of [[equity]]. Once it's reached, or once the next trade's risk would go past it, the day is over. No more entries until the next session.",
      },
      {
        kind: "figure",
        title: "A day with three losses",
        figure: {
          kind: "bars",
          bars: [
            { label: "After loss 1", value: -100, role: "down" },
            { label: "After loss 2", value: -199, role: "down" },
            { label: "After loss 3", value: -297.01, role: "down" },
            { label: "Daily limit, 3%", value: -300, role: "neutral" },
          ],
          steps: [
            "First stop-out: −100.00, 1% of 10,000.00.",
            "Second: −99.00, 1% of 9,900.00. The day is at −199.00.",
            "Third: −98.01. The day is at −297.01.",
            "The limit is 3% of 10,000.00: −300.00. How much room is left?",
          ],
        },
        text: "The plan: risk 1% of current equity per trade, with a daily limit of 3%, about 3R.",
        concept: "daily-loss-limit",
      },
      {
        kind: "worked",
        title: "Room left",
        lines: ["Limit: 3% of 10,000.00 = 300.00.", "Losses at 1% of current equity: 100.00, 99.00, 98.01.", "Used: 297.01.", "Room left = 300.00 − 297.01 = ?"],
        ask: {
          answer: 2.99,
          tolerance: 0.005,
          unit: "vUSD",
          feedback: [
            { value: 0, text: "Almost nothing, but not zero: 300.00 − 297.01." },
            { value: 3, text: "Close. The losses add up to 297.01, not 297.00." },
          ],
          correct: "Right. 2.99 left.",
        },
        after: "The next trade would risk 1% of 9,702.99: 97.02. It doesn't fit in 2.99, so the day is over, however good the next setup looks.",
        concept: "daily-loss-limit",
      },
      {
        kind: "predict",
        title: "One trade earlier",
        prompt: "Rewind: after two losses, 199.00 is used. A valid setup would risk 98.01. Does it fit within the 300.00 limit?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Yes" },
            { id: "b", label: "No", feedback: "199.00 + 98.01 = 297.01, under 300.00. This trade fits; the one after it won't." },
          ],
          answer: "a",
        },
        reveal: "Yes: 199.00 + 98.01 = 297.01, within 300.00. Before each entry, check the trade's full risk against the room left. After this one loses, a fourth trade would need 97.02 with only 2.99 left.",
        concept: "daily-loss-limit",
      },
      {
        kind: "explain",
        title: "Why a daily limit",
        text: "Mistakes cluster after losses: [[revenge-trading|revenge trades]], bigger sizes, setups that aren't in the plan. A daily limit stops a bad day before it becomes a bad week, and it decides before your emotions get a vote. Prop trading firms hold their traders to the same kind of rule; you'll meet them in 2.11.",
      },
      {
        kind: "match",
        title: "What each limit caps",
        prompt: "Each rule caps a different kind of damage. Match them.",
        pairs: [
          { left: "Risk per trade", right: "One trade" },
          { left: "Daily loss limit", right: "One bad day" },
          { left: "Most trades per day", right: "Overtrading" },
          { left: "Weekly and monthly limits", right: "A bad run of days" },
        ],
        columns: ["Rule", "What it caps"],
        concept: "daily-loss-limit",
      },
      {
        kind: "figure",
        title: "Follow the plan",
        text: "Three trades today, three stop-outs: 297.01 lost. A fourth setup appears, and it's valid. Walk through the decision.",
        figure: {
          kind: "flow",
          start: "n1",
          interactive: true,
          nodes: [
            {
              id: "n1",
              text: "Does the setup match the playbook?",
              kind: "question",
              yes: "n2",
              no: "skip",
              correct: "yes",
              explain: "The case says it's valid, so the playbook allows it. The question is the risk.",
            },
            {
              id: "n2",
              text: "Is the room left at least this trade's risk?",
              kind: "question",
              yes: "enter",
              no: "over",
              correct: "no",
              explain: "Room left: 2.99. This trade risks 97.02. It doesn't fit.",
            },
            { id: "skip", text: "No trade", kind: "end" },
            { id: "enter", text: "Enter with a stop", kind: "end" },
            { id: "over", text: "Day over: skip it and log 'daily limit'", kind: "end" },
          ],
          steps: [
            "The setup is valid, so the playbook alone would say yes.",
            "But 297.01 + 97.02 = 394.03, past the 300.00 limit.",
            "The day ends here. Log the skipped setup with its reason.",
          ],
        },
        concept: "daily-loss-limit",
      },
      {
        kind: "fields",
        title: "Your daily limit",
        prompt: "Set your own limit now, before any session, and never raise it during one. At 1% per trade, each R is 1% of equity.",
        fields: [
          { id: "limitR", label: "Daily loss limit", kind: "stepper", min: 1, max: 6, step: 1, unit: "R", default: 3 },
          { id: "maxTrades", label: "Most trades per day", kind: "stepper", min: 1, max: 10, step: 1, default: 6 },
        ],
        valid: { all: [{ field: "limitR", gte: 2 }, { field: "limitR", lte: 4 }] },
        feedback: [
          { when: { field: "limitR", lt: 2 }, text: "A 1R limit ends the day after a single normal stop-out. This course uses 2R to 4R." },
          { when: { field: "limitR", gt: 4 }, text: "At 1% per trade, {limitR}R lets one day take more than 4% of the account. This course uses 2R to 4R." },
        ],
        correct: "Saved. You'll write it into your plan v1 in 1.6.2, in R and in vUSD.",
        concept: "daily-loss-limit",
      },
    ],
    check: ["q-1.4.9-1", "q-1.4.9-2", "q-1.4.9-3"],
    recap: {
      takeaways: [
        "Set the daily limit before the session: 3% of 10,000.00 is 300.00, about 3R.",
        "Before each entry, check its full risk fits the room left. If not, the day is over.",
        "The limit stops revenge trades and bigger sizes before a bad day becomes a bad week.",
      ],
    },
  },
};

// ─── Check questions ───────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: "q-1.4.2-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 1,
    prompt: "You risked 80.00 on a trade, your 1R with costs included, and closed it for a net gain of 200.00. What was the result, in R?",
    numeric: { answer: 2.5, tolerance: 0.01, unit: "R" },
    explanation: "An R-multiple divides the result by the initial risk: 200.00 ÷ 80.00 = +2.5R. The trade made two and a half times what it put at stake, whatever the position size.",
    lesson: "1.4.2",
    concepts: ["r-multiple"],
    hints: ["R-multiple = result ÷ 1R.", "Put the result on top: 200.00 ÷ 80.00."],
    vary: {
      fields: { risk: [50, 200, 10], tenths: [5, 40, 5] },
      answer: "tenths / 10",
      prompt: "You risked {risk:2} on a trade, your 1R with costs included, and closed it for a net gain of {risk * tenths / 10:2}. What was the result, in R?",
      explanation: "An R-multiple divides the result by the initial risk: {risk * tenths / 10:2} ÷ {risk:2} = +{answer}R. It shows the result as a multiple of what was at stake, whatever the position size.",
      hint: "Put the result on top: {risk * tenths / 10:2} ÷ {risk:2}.",
    },
  },
  {
    id: "q-1.4.2-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "You buy 60 units of LABX at 80.00 with a stop at 78.00. Commission is 0.05% of each fill, rounded up to the cent. What is 1R, in vUSD, with both commissions?",
    numeric: { answer: 124.74, tolerance: 0.01, unit: "vUSD" },
    explanation: "Price part: 60 × 2.00 = 120.00. Entry commission: 0.05% of 4,800.00 = 2.40. Exit commission at the stop: 0.05% of 4,680.00 = 2.34. 1R = 120.00 + 2.40 + 2.34 = 124.74. Leaving out the commissions understates the risk.",
    lesson: "1.4.2",
    concepts: ["initial-risk"],
    hints: [
      "1R = units × distance to the stop, plus a commission at entry and another at the stop.",
      "The exit commission is charged on the stop price, not the entry: 60 × 78.00.",
      "120.00 + 0.05% of 4,800.00 + 0.05% of 4,680.00.",
    ],
    vary: {
      fields: { units: [20, 100, 10], entry: [40, 120, 1], dist: [1, 4, 0.5] },
      constraints: ["units * entry <= 9900"],
      answer: "round(units * dist + commission(units * entry) + commission(units * (entry - dist)), 2)",
      prompt: "You buy {units} units of LABX at {entry:2} with a stop at {entry - dist:2}. Commission is 0.05% of each fill, rounded up to the cent. What is 1R, in vUSD, with both commissions?",
      explanation: "Price part: {units} × {dist:2} = {units * dist:2}. Entry commission: 0.05% of {units * entry:2} = {commission(units * entry):2}. Exit commission at the stop: 0.05% of {units * (entry - dist):2} = {commission(units * (entry - dist)):2}. 1R = {answer:2}.",
      hint: "{units * dist:2} + 0.05% of {units * entry:2} + 0.05% of {units * (entry - dist):2}.",
    },
  },
  {
    id: "q-1.4.2-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "You bought 50 units at 60.00 with a stop at 59.00: 1R was 52.98 with costs. When price dipped, you moved the stop to 58.00. It filled there, for a loss of 102.95.",
    prompt: "How should your journal record the result?",
    options: [
      { id: "a", label: "−1R: a stop-out is always −1R", rationale: "A stop-out is −1R only at the initial stop. This loss, 102.95, is almost twice the 52.98 you planned to risk." },
      { id: "b", label: "−1R, because the moved stop became the new 1R", rationale: "R is fixed when you enter. Letting a moved stop reset it would hide exactly the extra risk the move added." },
      { id: "c", label: "−1.94R: the loss measured against the initial 1R of 52.98" },
      { id: "d", label: "Leave it out: trades with a moved stop don't count", rationale: "Leaving it out hides the most expensive kind of mistake. The journal needs it, measured against the initial risk." },
    ],
    correct: "c",
    explanation: "R is fixed at entry: 102.95 ÷ 52.98 = 1.94R lost. Moving the stop nearly doubled the risk you had agreed to, and the journal must show it so the cost of the mistake is counted.",
    lesson: "1.4.2",
    concepts: ["initial-risk", "r-multiple"],
    hints: ["Which 1R was agreed before the trade: the first stop or the moved one?", "Divide the actual loss by the initial 1R."],
  },
  {
    id: "q-1.4.6-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 1,
    prompt: "A round trip on LABX costs about 0.20 per unit. Your stop is 0.80 away. What share of the stop distance goes to costs, in %?",
    numeric: { answer: 25, tolerance: 0.1, unit: "%" },
    explanation: "Divide the costs by the stop distance: 0.20 ÷ 0.80 = 25%. A quarter of every R goes to costs before price does anything. With a 2.00 stop it would be 10%.",
    lesson: "1.4.6",
    concepts: ["costs-in-r"],
    hints: ["Costs ÷ stop distance.", "0.20 ÷ 0.80, then turn it into a percentage."],
    vary: {
      fields: { dist: [0.4, 4, 0.1] },
      answer: "round(0.2 / dist * 100, 1)",
      prompt: "A round trip on LABX costs about 0.20 per unit. Your stop is {dist:2} away. What share of the stop distance goes to costs, in %?",
      explanation: "Divide the costs by the stop distance: 0.20 ÷ {dist:2} = {answer:1}%. That share of every R goes to costs before price does anything.",
      hint: "0.20 ÷ {dist:2}, then turn it into a percentage.",
    },
  },
  {
    id: "q-1.4.6-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "A 2:1 plan: stop 0.80 away, target 1.60 away. Costs are 0.20 per unit. What win rate do you need to break even after costs, in %?",
    numeric: { answer: 41.7, tolerance: 0.1, unit: "%" },
    explanation: "After costs a loss costs 0.80 + 0.20 = 1.00 and a win pays 1.60 − 0.20 = 1.40. Break-even = 1.00 ÷ (1.00 + 1.40) = 41.7%, well above the 33.3% of a 2:1 plan before costs.",
    lesson: "1.4.6",
    concepts: ["costs-in-r", "reward-to-risk"],
    hints: [
      "Add the costs to the loss and take them off the win.",
      "Break-even = loss ÷ (loss + win), both after costs.",
      "Loss 1.00, win 1.40: 1.00 ÷ 2.40.",
    ],
    vary: {
      fields: { dist: [0.4, 3, 0.1] },
      answer: "round((dist + 0.2) / (3 * dist) * 100, 1)",
      prompt: "A 2:1 plan: stop {dist:2} away, target {2 * dist:2} away. Costs are 0.20 per unit. What win rate do you need to break even after costs, in %?",
      explanation: "After costs a loss costs {dist + 0.2:2} and a win pays {2 * dist - 0.2:2}. Break-even = {dist + 0.2:2} ÷ {3 * dist:2} = {answer:1}%, above the 33.3% of a 2:1 plan before costs.",
      hint: "Loss {dist + 0.2:2}, win {2 * dist - 0.2:2}: divide the loss by their sum.",
    },
  },
  {
    id: "q-1.4.6-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your setup wins 40% of the time at 2:1. On LABX at 100.00, costs are about 0.20 per unit. You can trade it with a 0.50 stop and a 1.00 target, or a 2.00 stop and a 4.00 target, sized to the same 1% risk.",
    prompt: "Which version makes money after costs?",
    options: [
      { id: "a", label: "Both: 40% beats the 33.3% break-even of any 2:1 plan", rationale: "33.3% is the break-even before costs. After costs the 0.50 stop needs 46.7%, and 40% falls short." },
      { id: "b", label: "Only the 0.50 stop: it allows four times as many units", rationale: "More units means more costs too. Sized to the same risk, what matters is the share of R that costs take: 40% against 10%." },
      { id: "c", label: "Neither: costs make every 2:1 plan lose", rationale: "With a 2.00 stop, break-even after costs is 36.7%. At 40% it earns about +0.10 per trade, in stop distances." },
      { id: "d", label: "Only the 2.00 stop: the tight stop's costs push its break-even to 46.7%" },
    ],
    correct: "d",
    explanation: "Costs are the same 0.20 per unit, but 40% of a 0.50 stop and only 10% of a 2.00 stop. Break-even after costs: 0.70 ÷ 1.50 = 46.7% against 2.20 ÷ 6.00 = 36.7%. At a 40% win rate, only the wide version is positive.",
    lesson: "1.4.6",
    concepts: ["costs-in-r"],
    hints: ["Work out the break-even after costs for each stop.", "Break-even = (stop + costs) ÷ (stop + target)."],
  },
  {
    id: "q-1.4.8-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 1,
    prompt: "Your account went 20,000.00 → 25,000.00 → 21,000.00 → 26,000.00 → 22,100.00. What was the maximum drawdown, in %?",
    numeric: { answer: 16, tolerance: 0.1, unit: "%" },
    explanation: "Measure each fall from the peak before it: 25,000.00 to 21,000.00 is 16%; 26,000.00 to 22,100.00 is 15%. The maximum is 16%. The account never fell below its 20,000.00 start, which is why measuring from the start misleads.",
    lesson: "1.4.8",
    concepts: ["drawdown"],
    hints: ["Each drawdown is measured from the highest point before it.", "There are two falls: from 25,000.00 and from 26,000.00. Compute both and keep the deeper."],
  },
  {
    id: "q-1.4.8-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "You risk 2% of current equity on every trade. After 10 losses in a row, how deep is the drawdown, in %?",
    numeric: { answer: 18.3, tolerance: 0.1, unit: "%" },
    explanation: "Each loss takes 2% of what is left, so 0.98 multiplied 10 times leaves 81.7% of the account: a drawdown of 18.3%. Adding 10 × 2% gives 20%, which overstates it because later losses are taken from a smaller account.",
    lesson: "1.4.8",
    concepts: ["expected-drawdown", "drawdown"],
    hints: ["Each loss takes 2% of what is left, not of the start.", "What's left after 10 losses = 0.98 multiplied by itself 10 times.", "0.98 to the 10th power is 0.817."],
    vary: {
      fields: { r: [0.5, 3, 0.25] },
      answer: "round((1 - (1 - r / 100) * (1 - r / 100) * (1 - r / 100) * (1 - r / 100) * (1 - r / 100) * (1 - r / 100) * (1 - r / 100) * (1 - r / 100) * (1 - r / 100) * (1 - r / 100)) * 100, 1)",
      prompt: "You risk {r:2}% of current equity on every trade. After 10 losses in a row, how deep is the drawdown, in %?",
      explanation: "Each loss takes {r:2}% of what is left, so {1 - r / 100:4} multiplied 10 times leaves {100 - answer:1}% of the account: a drawdown of {answer:1}%. Adding 10 × {r:2}% overstates it, because later losses come from a smaller account.",
      hint: "What's left after 10 losses = {1 - r / 100:4} multiplied by itself 10 times.",
    },
  },
  {
    id: "q-1.4.8-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your plan risks 1% per trade and wins about 40% of the time. The journal shows every trade followed the plan. After 9 losses in a row you're 8.6% below your peak. The plan says to stop and review at 15%.",
    prompt: "What does this drawdown most likely tell you?",
    options: [
      { id: "a", label: "The method is broken: switch to another one now", rationale: "At a 40% win rate, a run of 9 shows up in about a third of 100-trade stretches. Nothing here is outside the normal range." },
      { id: "b", label: "It's within the normal range: keep following the plan and review at 15%, as written" },
      { id: "c", label: "Double the risk per trade to recover faster", rationale: "That's doubling after losses. It deepens the hole if the run continues and breaks the plan's risk rule." },
      { id: "d", label: "Stop using stops until the market turns", rationale: "Removing stops makes every loss open-ended. The drawdown is normal; the plan doesn't need fewer protections." },
    ],
    correct: "b",
    explanation: "Nine losses at 1% each take 8.6%. At a 40% win rate, a run of 9 shows up in 32.4% of 100-trade stretches, so this is variance a valid method goes through. The review depth was set in advance for this moment: keep following it.",
    lesson: "1.4.8",
    concepts: ["expected-drawdown", "variance"],
    hints: ["How common is a run of 9 losses at a 40% win rate?", "Compare the drawdown with the review depth written in the plan."],
  },
  {
    id: "q-1.4.9-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 1,
    prompt: "Your account is 8,000.00 and your daily loss limit is 3% of it. What is the limit, in vUSD?",
    numeric: { answer: 240, tolerance: 0.01, unit: "vUSD" },
    explanation: "3% of 8,000.00 = 240.00. Once the day's losses plus the next trade's risk would pass 240.00, the day is over.",
    lesson: "1.4.9",
    concepts: ["daily-loss-limit"],
    hints: ["Multiply the account by the percentage.", "8,000.00 × 0.03."],
    vary: {
      fields: { acct: [5000, 20000, 500], pct: [2, 5, 1] },
      answer: "round(acct * pct / 100, 2)",
      prompt: "Your account is {acct:2} and your daily loss limit is {pct}% of it. What is the limit, in vUSD?",
      explanation: "{pct}% of {acct:2} = {answer:2}. Once the day's losses plus the next trade's risk would pass {answer:2}, the day is over.",
      hint: "{acct:2} × {pct / 100:2}.",
    },
  },
  {
    id: "q-1.4.9-2",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "Account 20,000.00, daily limit 2.5% of it. You risk 1% of current equity per trade and lose twice: 200.00, then 198.00. How much room is left today, in vUSD?",
    numeric: { answer: 102, tolerance: 0.01, unit: "vUSD" },
    explanation: "The limit is 2.5% of 20,000.00 = 500.00. Used: 200.00 + 198.00 = 398.00, so 102.00 is left. The next trade would risk 1% of 19,602.00 = 196.02, which doesn't fit: the day is over.",
    lesson: "1.4.9",
    concepts: ["daily-loss-limit"],
    hints: ["Start from the limit in vUSD: 2.5% of 20,000.00.", "Subtract what's already been lost today.", "500.00 − (200.00 + 198.00)."],
  },
  {
    id: "q-1.4.9-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your daily limit is 3R. Three trades have lost today, −3R in total. Twenty minutes later a textbook setup appears: it matches your playbook and the target is 3R away.",
    prompt: "What do you do?",
    options: [
      { id: "a", label: "Skip it and log it with the reason 'daily limit'" },
      { id: "b", label: "Take it at half size, so the risk is small", rationale: "The limit is already used up. Any new risk, even half of 1R, takes the day past it." },
      { id: "c", label: "Take it: a valid setup is always a trade", rationale: "A setup is valid only within the plan's limits. The daily limit is part of the plan, not a suggestion." },
      { id: "d", label: "Raise today's limit to 4R, since the setup is so good", rationale: "A limit is set before the session so it can't be argued with during one. Raising it after losses is how bad days grow." },
    ],
    correct: "a",
    explanation: "The day ended when the limit was reached. Skipping the setup and logging why keeps the record honest and shows later what the rule cost and saved. A good-looking setup after three losses is exactly when the limit matters most.",
    lesson: "1.4.9",
    concepts: ["daily-loss-limit"],
    hints: ["Is there any room left under the limit?", "When was the limit set, and can it change during the session?"],
  },
];

// ─── Terms and concepts introduced in 1.4 ──────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "initial-risk",
    term: "Initial risk",
    definition: "The loss a trade would take if the stop set at entry filled as planned, with both commissions included. It stays the trade's 1R even if the stop is moved later.",
    plain: "What you stood to lose when you entered. Every result of that trade is measured against it.",
    related: ["r", "r-multiple", "stop-loss", "risk-per-trade"],
    lesson: "1.4.2",
  },
  {
    id: "cost-drag",
    term: "Cost drag",
    definition: "The share of a trade's gross result taken by costs such as the spread and commissions. It grows as stops and targets get smaller.",
    plain: "How much of what you make or lose goes to costs. Small targets lose a bigger share.",
    related: ["spread", "commission", "round-trip", "break-even", "r"],
    lesson: "1.4.6",
  },
  {
    id: "underwater-curve",
    term: "Underwater curve",
    definition: "A chart of how far equity is below its previous peak at each point in time. It shows each drawdown's depth and how long it lasted.",
    plain: "A picture of every stretch spent below your best account value: how deep, and for how long.",
    related: ["drawdown", "max-drawdown", "equity"],
    lesson: "1.4.8",
  },
  {
    id: "daily-loss-limit",
    term: "Daily loss limit",
    definition: "The most you allow yourself to lose in one day, set before the session in R or as a percentage of equity. Once the next trade's risk no longer fits, trading stops until the next session.",
    plain: "A cap on a bad day. Reach it and you stop until tomorrow.",
    related: ["risk-per-trade", "r", "revenge-trading", "trading-plan"],
    lesson: "1.4.9",
  },
];

const CONCEPTS: Concept[] = [
  {
    id: "initial-risk",
    name: "Initial risk",
    category: "risk_management",
    summary: "The loss at the stop set at entry, costs included; it stays the trade's 1R even if the stop is moved.",
    body: [
      "Initial risk is units × distance from the entry to the stop, plus the commission at entry and the commission at the stop. It is fixed the moment you enter and becomes the trade's 1R.",
      "Every result is then measured against it. A stop moved further away doesn't create a new 1R: it makes the eventual loss a bigger multiple of the original one, and the journal shows that.",
    ],
    example: "40 units at 50.00 with a stop at 48.50: 60.00 plus 1.00 and 0.97 in commissions = 61.97, the trade's 1R. An exit at 53.00 nets 117.94, so +1.90R. Stopped at a moved stop of 47.00, it loses 121.94: −1.97R.",
    related: ["r-multiple", "risk-per-trade", "stop-loss-order"],
    missions: ["M04"],
    lessons: ["1.4.2"],
  },
  {
    id: "costs-in-r",
    name: "Costs in R",
    category: "risk_management",
    summary: "Round-trip costs as a share of the stop distance; tighter stops make costs a bigger part of every R.",
    body: [
      "Spread and commissions cost about the same per unit whatever the stop. Divided by the stop distance, they show how much of each R goes to costs before price moves.",
      "Costs also move the break-even: a loss costs the stop plus costs, a win pays the target minus costs. Break-even after costs = (stop + costs) ÷ (stop + target).",
    ],
    example: "Costs 0.20 per unit on LABX at 100.00. With a 2.00 stop they are 10% of R and a 2:1 plan breaks even at 36.7%. With a 0.50 stop they are 40% of R and break-even rises to 46.7%.",
    related: ["trading-costs", "reward-to-risk", "expectancy"],
    missions: [],
    lessons: ["1.4.6"],
  },
  {
    id: "expected-drawdown",
    name: "Expected drawdown",
    category: "risk_management",
    summary: "The drawdown a valid method should be expected to go through, given its risk per trade and normal losing runs.",
    body: [
      "Losing runs come with any method that doesn't win every time. Their length depends on the win rate and the number of trades; their cost depends on the risk per trade, compounded on what's left.",
      "Knowing the normal depth in advance separates variance from a broken method, and lets you set the depth at which you stop and review before the run arrives.",
    ],
    example: "At a 40% win rate, a run of 8 losses shows up in 49% of 100-trade stretches. At 1% risk it costs 7.7%; at 2%, 14.9%; at 5%, 33.7%.",
    related: ["drawdown", "risk-per-trade", "variance"],
    missions: ["M04"],
    lessons: ["1.4.8"],
  },
  {
    id: "daily-loss-limit",
    name: "Daily loss limit",
    category: "risk_management",
    summary: "A maximum loss per day, set before the session; when the next trade's risk no longer fits, the day is over.",
    body: [
      "The limit is written in R or as a percentage of equity before the session starts, and never raised during one. Before each entry, the trade's full risk must fit in the room that's left.",
      "Mistakes cluster after losses: revenge trades, bigger sizes, setups outside the plan. A daily limit ends a bad day before those mistakes can make it worse.",
    ],
    example: "Limit 3% of 10,000.00 = 300.00. Three 1% losses: 100.00, 99.00 and 98.01, so 297.01 used. The next trade would risk 97.02 with 2.99 left: the day is over.",
    related: ["risk-per-trade", "revenge-trading", "trading-plan"],
    missions: ["M10"],
    lessons: ["1.4.9"],
  },
];

/** Unit 1.4 · Risk comes first (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_1_4: UnitContent = { lessons: [L_1_4_2, L_1_4_6, L_1_4_8, L_1_4_9], questions: QUESTIONS, terms: TERMS, concepts: CONCEPTS };
