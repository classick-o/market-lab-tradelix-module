import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, MarkRole, Question, UnitContent } from "../../types";

/**
 * Unit 4.3 · Professional validation (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce.
 * Simulated figures come from seeded scripts (mulberry32 PRNG, Box–Muller normals, daily volatility 1%). R0 = iid normal returns;
 * R1 = a trend regime whose daily drift is ±0.20% and flips with probability 1/50 a day. Rule families are long/short momentum
 * lookbacks (position = sign of the return over the last L days). Closed-form values (Bonferroni bars, E[max], PSR/DSR, MinBTL,
 * Sharpe intervals, capacity) are computed exactly; Monte Carlo values are quoted as the runs produced them. Published figures:
 * Harvey & Liu (2015, JPM, "Backtesting"), Lo (2002, FAJ), McLean & Pontiff (2016, JF), Bailey et al. (2014, 2017).
 */

const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });
/** Empty slots for figures that draw only their layers. */
const slots = (n: number, price: number): CandleData[] => Array.from({ length: n }, () => k(price, price, price, price));
/** A histogram bar drawn as a candle from 0 to its value. */
const bar = (v: number): CandleData => k(0, v, 0, v);
/** A horizontal line between two slot indexes at one height. */
const span = (from: number, to: number, price: number, role: MarkRole, label?: string): ChartLayer => ({
  kind: "path",
  points: [
    { index: from, price },
    { index: to, price },
  ],
  role,
  label,
});

// ─── Data ──────────────────────────────────────────────────────────────────

/**
 * 4.3.1 B3: White's Reality Check on 50 momentum lookbacks (1–50 days) over 756 days of R0 (seed 200060). Stationary bootstrap,
 * mean block 10 days, 5,000 resamples (seed 99), each rule recentred to zero edge; statistic = best |t|. Share of resamples (%)
 * in bins of 0.25 from 0.75 to 4.50 (0.04% lie above). Winner: 1-day lookback, |t| 2.07; 95th percentile 2.99; p = 0.403.
 * The R1 family (seed 300037): winner 23-day lookback, t 3.45 (annual Sharpe 1.99, true ≈ 1.36), 95th percentile 3.26, p = 0.033.
 * Over 200 seeded families each (500 resamples): R0 winners passed at 5% in 6.5%, R1 winners in 58%.
 */
const RC_HIST = [0.6, 4.3, 12.6, 18.4, 18.9, 15.7, 11.4, 8.2, 4.9, 2.4, 1.5, 0.6, 0.3, 0.1, 0.1];
/** Slot of a |t| value: slot i is the bin [0.75 + 0.25i, 1.00 + 0.25i), centred at 0.875 + 0.25i. */
const rcSlot = (t: number): number => Math.round(((t - 0.875) / 0.25) * 100) / 100;

/** 4.3.5 B1: a timeline of days 371–540, one slot per day. */
const day = (d: number): number => d - 371;

/**
 * 4.3.6 B3: total profit per trade (vUSD) against size, 0 to 12,000 units in steps of 250. Gross edge 40 bps, fixed costs 10 bps,
 * round-trip impact 400 × √(Q ÷ 2,000,000) bps, LABX at 100: profit = Q × (30 − 400√(Q/V)) ÷ 100.
 */
const CAPACITY = [
  0, 63.82, 118.38, 166.91, 210.56, 250, 285.68, 317.94, 347.02, 373.13, 396.45, 417.11, 435.24, 450.95, 464.34, 475.48, 484.46, 491.34, 496.19, 499.05, 500, 499.07, 496.31, 491.76,
  485.47, 477.46, 467.77, 456.44, 443.5, 428.97, 412.88, 395.27, 376.14, 355.54, 333.47, 309.97, 285.05, 258.73, 231.03, 201.97, 171.57, 139.85, 106.81, 72.48, 36.87, 0, -38.12, -77.48,
  -118.06,
];

// ─── 4.3.1 · Testing the winner of a search ────────────────────────────────

const L_4_3_1: Lesson = {
  id: "4.3.1",
  title: "Testing the winner of a search: Reality Check and the Sharpe haircut",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "The best rule of a search has to beat the best that luck produces across the whole search, not zero; the Reality Check, SPA and the Sharpe haircut set that bar.",
  objectives: [
    "Explain why correlated variants make Bonferroni too strict and a single naive test far too lenient.",
    "Describe how White's Reality Check and Hansen's SPA test the best rule of a search against a benchmark.",
    "Apply a Sharpe haircut and count trials across the whole research process, not per backtest.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "4.3",
    courseId: "4.3.1",
    hook: {
      prompt: "The best of your 200 variants has a t-statistic of 3.0, which alone would mean p ≈ 0.003. After a Bonferroni correction for 200 tests, is it still significant at 5%?",
      control: {
        kind: "choice",
        choices: [
          { id: "easily", label: "Yes, easily", feedback: "For one test, yes. For 200, Bonferroni moves the bar to p below 0.025%, about t = 3.66." },
          { id: "barely", label: "Yes, barely", feedback: "3.0 sits below the corrected bar of about 3.66, so it doesn't pass at all." },
          { id: "no", label: "No: it would need t ≈ 3.7" },
          { id: "na", label: "The correction doesn't apply to variants", feedback: "Every variant you ran is a test, parameter tweaks of one rule included." },
        ],
        answer: "no",
      },
      compare:
        "You picked {yours}. Bonferroni needs p below 0.05 ÷ 200 = 0.025%, about t = 3.66. And on R0 data, the same kind of 200-variant search reached 3.0 in 10.5% of 2,000 seeded runs.",
      concept: "multiple-testing",
    },
    learn: [
      {
        kind: "worked",
        title: "The Bonferroni bar",
        lines: ["200 variants, tested at an overall level of 5%.", "Bonferroni (3.10.6): divide the level by the number of tests.", "Per-test threshold = 5% ÷ 200 = ?"],
        ask: {
          answer: 0.025,
          tolerance: 0.0005,
          unit: "%",
          feedback: [
            { value: 0.25, text: "That divides by 20. Divide 5% by the 200 variants." },
            { value: 0.00025, text: "That's the threshold as a fraction. In percent it's 0.025%." },
          ],
          correct: "Right. 0.025%, two-sided, which needs t ≈ 3.66. Your 3.0 falls short.",
        },
        after: "But 200 variants of one rule are not 200 independent tests.",
        concept: "multiple-testing",
      },
      {
        kind: "explain",
        title: "Too strict and too lenient",
        text: "Neighbouring variants trade almost the same days. In 2,000 seeded searches of 200 momentum lookbacks on 3 years of R0, the best beat the naive t = 1.96 in 73%: far too lenient. It beat Bonferroni's 3.66 in only 1.3%, under the 5% [[family-wise-error-rate|family-wise error rate]] it promises: too strict. The search acted like about 48 independent tests.",
      },
      {
        kind: "figure",
        title: "The Reality Check",
        figure: {
          kind: "chart",
          chart: {
            candles: RC_HIST.map(bar),
            range: [0, 21],
            layers: [{ kind: "level", price: 0, role: "neutral", chip: false }],
            describe:
              "Bars: the share of 5,000 bootstrap resamples by their best |t| among 50 rules, in bins of 0.25 from 0.75 to 4.5. Most fall between 1.25 and 2.5. The 95th percentile is 2.99; the real winner's |t| is 2.07.",
          },
          steps: [
            { text: "Resample the days of all 50 rules, each recentred to zero edge. Keep the best |t|." },
            {
              text: "5,000 resamples show the best that luck alone gives. 95% stay below 2.99.",
              layers: [
                {
                  kind: "path",
                  points: [
                    { index: rcSlot(2.99), price: 0 },
                    { index: rcSlot(2.99), price: 20 },
                  ],
                  role: "concept",
                  dashed: true,
                  label: "95%: 2.99",
                },
              ],
            },
            {
              text: "The real winner, |t| 2.07, sits mid-pack: 40% of resamples beat it. p = 0.40.",
              layers: [
                {
                  kind: "path",
                  points: [
                    { index: rcSlot(2.07), price: 0 },
                    { index: rcSlot(2.07), price: 20 },
                  ],
                  role: "accent",
                  label: "Winner 2.07",
                },
              ],
            },
          ],
        },
        text: "White's [[reality-check|Reality Check]] (2000) on 50 momentum lookbacks over 3 years of R0. The bar is the best of many no-edge worlds, not zero. Hansen's [[spa-test|SPA test]] (2005) refines it so that very poor rules in the family don't dilute the test.",
        concept: "reality-check-testing",
      },
      {
        kind: "predict",
        title: "The family with an edge",
        prompt: "Now 50 lookbacks on 3 years of R1, a trend regime with a planted edge. The best, 23 days, has |t| = 3.45; its Reality Check bar is 3.26. Does it survive?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes: it beats the best that luck gives" },
            { id: "no", label: "No: nothing survives 50 tries", feedback: "The bar is the 95th percentile of the best |t| by luck, 3.26. A winner at 3.45 is above it." },
            { id: "cant", label: "Can't tell without more data", feedback: "The Reality Check gives a p-value for exactly this question: 0.033." },
          ],
          answer: "yes",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "R0 winner", value: 2.07, role: "neutral" },
            { label: "R0 bar (95%)", value: 2.99, role: "concept" },
            { label: "R1 winner", value: 3.45, role: "up" },
            { label: "R1 bar (95%)", value: 3.26, role: "concept" },
          ],
          steps: ["Best |t| of each family against its Reality Check bar."],
        },
        reveal:
          "It survives: p = 0.033. Its measured Sharpe, 1.99, still flatters the true 1.36 of that lookback. Over 200 seeded families each, R1 winners survived 58% of the time and R0 winners 6.5%, close to the 5% false-alarm rate the test allows.",
        concept: "reality-check-testing",
      },
      {
        kind: "explain",
        title: "The Sharpe haircut",
        text: "In Harvey and Liu's (2015) illustration, a t of 3.0 becomes 2.0 once the tests behind it are counted. Their [[sharpe-haircut|haircut]] is nonlinear: at 50 tests, a Sharpe of 0.43 loses 50%, one of 0.78 only 7.9%. A flat 50% cut is a rule of thumb, too lenient for weak results and too harsh for strong ones.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Count trials across the whole research process: every lookback, filter and quick check, every abandoned idea, every variant run on these data before. Your [[research-log]] from 3.11 is where N comes from, and 4.3.2 to 4.3.4 all need it.",
      },
    ],
    check: ["q-4.3.1-1", "q-4.3.1-2", "q-4.3.1-3"],
    recap: {
      takeaways: [
        "Correlated variants make Bonferroni too strict and a single test far too lenient: 73% of R0 searches beat 1.96.",
        "The Reality Check compares the winner with the best of many no-edge resamples, not with zero.",
        "Haircuts are nonlinear. Count every trial in the whole process, abandoned ideas included.",
      ],
    },
  },
};

// ─── 4.3.2 · The deflated Sharpe ratio ─────────────────────────────────────

const L_4_3_2: Lesson = {
  id: "4.3.2",
  title: "The deflated Sharpe ratio",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "The deflated Sharpe ratio asks how likely a backtest's true Sharpe is to beat the best that luck gives all the trials run, allowing for skew and fat tails.",
  objectives: [
    "Explain why the expected best Sharpe of N zero-edge trials is well above zero.",
    "Read a probabilistic Sharpe ratio and a deflated Sharpe ratio card.",
    "Judge whether a backtest is likely a fluke from its DSR and the number of trials.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "decision_making", label: "Decision-making check" }],
  script: {
    unit: "4.3",
    courseId: "4.3.2",
    hook: {
      prompt: "Your best of 50 backtests shows an annual Sharpe of 1.5 over 3 years of daily data. How confident can you be that it's more than the luck of 50 tries?",
      control: {
        kind: "slider",
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        start: 50,
        answer: 73,
        tolerance: 8,
        feedback: [
          { from: 90, to: 100, text: "That's what a single test says, 99%. It ignores the other 49 tries." },
          { from: 0, to: 40, text: "Too pessimistic: a Sharpe of 1.5 over 3 years still clears most of what luck gives 50 tries." },
        ],
      },
      compare: "You answered {yours}%. Tested alone, the probabilistic Sharpe ratio says 99.4%. Allowing for the 50 tries, the deflated Sharpe ratio says 73%: below the usual 95% bar.",
      concept: "deflated-sharpe-ratio",
    },
    learn: [
      {
        kind: "worked",
        title: "The best of N, by luck",
        lines: [
          "N trials with no edge. Bailey and colleagues: E[max] ≈ (1 − γ) × Z⁻¹(1 − 1/N) + γ × Z⁻¹(1 − 1/(N × e)), with γ = 0.5772 and Z⁻¹ turning a probability into a z-score.",
          "E[max] is in units of the trials' Sharpe spread: 1.57 for N = 10, 2.28 for 50, 2.53 for 100.",
          "One year of daily data gives a spread near 1, so the best of 10 shows an annual Sharpe near 1.57 (3.11.5).",
          "Your 50 trials over 3 years have a Sharpe spread of 0.5. Benchmark SR* = 2.28 × 0.5 = ?",
        ],
        ask: {
          answer: 1.14,
          tolerance: 0.01,
          feedback: [
            { value: 2.28, text: "That's E[max] in spread units. Multiply by the trials' spread, 0.5." },
            { value: 4.56, text: "That divides by 0.5. Multiply: 2.28 × 0.5." },
          ],
          correct: "Right. 1.14: luck alone would hand the best of your 50 tries an annual Sharpe near 1.14.",
        },
        after: "Seeded check: across 10,000 searches, the best of 50 zero-edge one-year backtests averaged 2.26; the formula says 2.28.",
        concept: "deflated-sharpe-ratio",
      },
      {
        kind: "explain",
        title: "Probabilistic, then deflated",
        text: "The [[probabilistic-sharpe-ratio|probabilistic Sharpe ratio]] (PSR) is the probability that the true Sharpe beats a benchmark SR*. It falls with fewer observations, negative skew and fat tails. The [[deflated-sharpe-ratio|deflated Sharpe ratio]] (DSR) is the PSR with SR* raised to the [[expected-maximum-sharpe|best Sharpe luck would give]] your N trials (Bailey and López de Prado, 2014).",
      },
      {
        kind: "worked",
        title: "Read the card",
        lines: [
          "Daily Sharpe = 1.5 ÷ √252 = 0.0945; T = 756 days; skew −0.5; kurtosis 5 (a normal curve has 3).",
          "PSR = Φ[(SR − SR*) × √(T − 1) ÷ √(1 − skew × SR + (kurtosis − 1) ÷ 4 × SR²)]. Φ turns a z-score into a probability.",
          "Against zero: z = 0.0945 × 27.5 ÷ 1.028 = 2.53, so PSR = 0.994.",
          "Against SR* = 1.14 a year, 0.0717 a day: z = (0.0945 − 0.0717) × 27.5 ÷ 1.028 = 0.61.",
          "DSR = Φ(0.61) = ?",
        ],
        ask: {
          answer: 0.73,
          tolerance: 0.01,
          feedback: [
            { value: 0.99, text: "That's the PSR against zero. The DSR uses SR* = 1.14, the best luck gives 50 tries." },
            { value: 0.27, text: "That's 1 − Φ(0.61), the other side. Φ of a positive z is above one half." },
          ],
          correct: "Right. DSR 0.73: a 73% probability that the true Sharpe beats the luck of 50 tries.",
        },
        after: "0.73 is below the conventional 0.95. Possibly a fluke: gather more data before trusting it.",
        concept: "deflated-sharpe-ratio",
      },
      {
        kind: "figure",
        title: "One backtest, three readings",
        figure: {
          kind: "bars",
          bars: [
            { label: "Single test, normal returns", value: 99.5, role: "neutral" },
            { label: "PSR: skew and fat tails", value: 99.4, role: "neutral" },
            { label: "DSR: after 50 trials", value: 72.9, role: "down" },
          ],
          unit: "%",
          steps: [
            "A Sharpe of 1.5 over 3 years: a single test says 99.5%.",
            "Skew −0.5 and kurtosis 5 barely move it: PSR 99.4%.",
            "Raise the bar to the best of 50 lucky tries: DSR 72.9%.",
          ],
        },
        text: "Here the 50 tries do most of the damage. Skew and fat tails weigh more with monthly data, where each return carries more of the Sharpe, or when the skew is extreme.",
        concept: "probabilistic-sharpe-ratio",
      },
      {
        kind: "callout",
        tone: "info",
        text: "The 0.95 bar is a convention, like p < 0.05, not part of the derivation. Read a DSR together with its trial count, never as a stamp. A DSR of 0.73 says 'not yet', not 'no edge'.",
      },
      {
        kind: "predict",
        title: "How many tries spend it?",
        prompt: "Keep everything else fixed. How many trials would push this backtest's DSR below 0.50?",
        control: {
          kind: "numeric",
          unit: "trials",
          answer: 421,
          tolerance: 40,
          feedback: [
            { value: 100, text: "At 100 trials DSR is still 0.65. It reaches 0.50 when SR* equals your own Sharpe." },
            { value: 50, text: "That's where you are now: DSR 0.73. Keep adding trials until E[max] × 0.5 = 1.5." },
          ],
        },
        reveal: "About 421. DSR is 0.50 when the benchmark equals your Sharpe: E[max] × 0.5 = 1.5, so E[max] = 3.0, reached at N = 421. A long search quietly spends the Sharpe it finds.",
        concept: "deflated-sharpe-ratio",
      },
    ],
    check: ["q-4.3.2-1", "q-4.3.2-2", "q-4.3.2-3"],
    recap: {
      takeaways: [
        "The best of N zero-edge trials looks good: E[max] is 1.57 at 10, 2.28 at 50, 2.53 at 100.",
        "PSR is the chance the true Sharpe beats a benchmark; DSR sets that benchmark at luck's best.",
        "Best of 50, Sharpe 1.5 over 3 years: PSR 0.994, DSR 0.73, below the 0.95 convention.",
      ],
    },
  },
};

// ─── 4.3.3 · How long must a backtest be? ──────────────────────────────────

const L_4_3_3: Lesson = {
  id: "4.3.3",
  title: "How long must a backtest be? MinBTL and the Sharpe's error bars",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A Sharpe ratio's error bars shrink only with the square root of time, and every extra configuration you try raises the length of data you need.",
  objectives: [
    "Compute a 95% confidence interval for an annual Sharpe ratio from its track-record length.",
    "Use the minimum backtest length rule to cap the number of configurations you try.",
    "Explain why autocorrelation can inflate an annualised Sharpe.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "decision_making", label: "Decision-making check" }],
  script: {
    unit: "4.3",
    courseId: "4.3.3",
    hook: {
      prompt: "A strategy shows a Sharpe of 1.0 over 3 years of daily data. Which range most likely contains its true Sharpe?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "0.9 to 1.1", feedback: "That would take decades of data. Three years leave a standard error near 0.58." },
          { id: "b", label: "0.5 to 1.5", feedback: "That's about one standard error either side, not the 1.96 a 95% range needs." },
          { id: "c", label: "−0.1 to 2.1" },
          { id: "d", label: "0 to 1", feedback: "The measured 1.0 is the centre of the range, not its top." },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. The standard error is about 1 ÷ √3 = 0.58, so the 95% range runs from −0.13 to 2.13: zero is inside.",
      concept: "sharpe-ratio-uncertainty",
    },
    learn: [
      {
        kind: "worked",
        title: "Error bars",
        lines: [
          "Lo (2002): SE = √((1 + SR²/2) ÷ n), with SR and n in the data's own frequency.",
          "Yearly figures: n = years and SR is annual, the formula of 3.11.4.",
          "Daily data: SR²/2 is tiny (0.002 at an annual 1.0), so the annual [[sharpe-standard-error|SE]] ≈ 1 ÷ √years, as in 3.10.5.",
          "Sharpe 1.0 over 3 years: SE 0.58, 95% range 1 ± 1.96 × 0.58 = −0.13 to 2.13.",
          "Over 10 years, SE = 0.32. Lower end = 1 − 1.96 × 0.32 = ?",
        ],
        ask: {
          answer: 0.38,
          tolerance: 0.015,
          feedback: [
            { value: 0.68, text: "That's 1 − 0.32, one standard error. A 95% range uses 1.96 of them." },
            { value: -0.13, text: "That's the 3-year range. Use SE 0.32 for 10 years." },
          ],
          correct: "Right. 0.38 to 1.62: now zero is outside.",
        },
        after: "Seeded check, 10,000 daily histories at a true Sharpe of 1.0: −0.14 to 2.16 over 3 years, 0.38 to 1.62 over 10. Excluding zero at a Sharpe of 1 takes 1.96² ≈ 3.8 years.",
        concept: "sharpe-ratio-uncertainty",
      },
      {
        kind: "worked",
        title: "Minimum backtest length",
        lines: [
          "The best of N zero-edge configurations shows an annual Sharpe near E[max] ÷ √years (4.3.2).",
          "Luck reaches a target Sharpe unless years > (E[max] ÷ target)²: the [[minimum-backtest-length|minimum backtest length]] (Bailey, Borwein, López de Prado and Zhu, 2014).",
          "Target 1.0: N = 7 → 1.39² = 1.9 years; N = 45 → 2.24² = 5.0 years.",
          "N = 100: E[max] = 2.53. MinBTL = 2.53² = ?",
        ],
        ask: {
          answer: 6.4,
          tolerance: 0.05,
          unit: "years",
          feedback: [
            { value: 2.53, text: "Square it: with a target of 1, MinBTL = E[max]²." },
            { value: 5.06, text: "That doubles 2.53. Square it: 2.53 × 2.53." },
          ],
          correct: "Right. 6.4 years: with less data, luck alone lets the best of 100 tries reach a Sharpe of 1.",
        },
        after: "A simpler upper bound: 2 × ln(N) ÷ target², 9.2 years for N = 100.",
        concept: "minimum-backtest-length",
      },
      {
        kind: "figure",
        title: "More tries, more years",
        figure: {
          kind: "bars",
          bars: [
            { label: "N = 7", value: 1.9, role: "neutral" },
            { label: "N = 45", value: 5, role: "neutral" },
            { label: "N = 100", value: 6.4, role: "neutral" },
            { label: "N = 1,000", value: 10.6, role: "down" },
          ],
          unit: " years",
          steps: ["Target Sharpe 1.0: seven tries need 1.9 years of data.", "45 tries need 5 years; 100 need 6.4.", "1,000 tries need 10.6 years before a Sharpe of 1 means anything."],
        },
        text: "The paper's example: after only 7 configurations, a 2-year backtest is expected to show a Sharpe of about 1 with no edge. Seeded check: the best of 45 zero-edge configurations over 5 years averaged 0.99. Read MinBTL as a cap on your search.",
        concept: "minimum-backtest-length",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Annualising assumes independent returns. Lo (2002) found that [[autocorrelation]] in monthly returns can overstate a hedge fund's annual Sharpe by as much as 65%, and that multiplying a monthly Sharpe by √12 is right only in special cases.",
      },
      {
        kind: "predict",
        title: "Annualise with care",
        prompt: "Monthly returns: mean 0.5%, sd 4%, a monthly Sharpe of 0.125, so 0.125 × √12 = 0.43 a year. Their lag-1 autocorrelation is +0.3. Which is the true annual Sharpe closer to?",
        control: {
          kind: "choice",
          choices: [
            { id: "same", label: "0.43", feedback: "√12 assumes independent months. Positive autocorrelation makes a year more volatile than √12 says." },
            { id: "lower", label: "0.33" },
            { id: "higher", label: "0.55", feedback: "Positive autocorrelation adds risk over a year, so the true Sharpe is lower, not higher." },
          ],
          answer: "lower",
        },
        reveal: "About 0.33. With autocorrelation +0.3, a year's volatility is √21.06 = 4.59 monthly sds, not √12 = 3.46. True Sharpe = 12 × 0.125 ÷ 4.59 = 0.33; √12 overstates it by about 32%. A seeded run of 200,000 years agrees.",
        concept: "autocorrelation",
      },
      {
        kind: "predict",
        title: "Cap your search",
        prompt: "You have 4 years of data and target a Sharpe of 1.0. What is the largest number of independent configurations you may try?",
        control: {
          kind: "numeric",
          unit: "configurations",
          answer: 25,
          tolerance: 1,
          feedback: [
            { value: 45, text: "45 needs 5 years. With 4, E[max]² must stay at or below 4." },
            { value: 7, text: "7 needs only 1.9 years. You can afford more: raise N until E[max]² passes 4." },
          ],
        },
        reveal: "25. E[max] for 25 tries is 2.00, so MinBTL = 3.99 years; at 26 it's 4.06. Correlated variants count for less than independent ones, but you rarely know how much less: count them all.",
        concept: "minimum-backtest-length",
      },
    ],
    check: ["q-4.3.3-1", "q-4.3.3-2", "q-4.3.3-3"],
    recap: {
      takeaways: [
        "With daily data, a Sharpe's SE ≈ 1 ÷ √years: Sharpe 1 over 3 years spans −0.13 to 2.13.",
        "MinBTL = (E[max] ÷ target)² years. For a Sharpe of 1, 45 tries need 5 years.",
        "Autocorrelation breaks √12 annualising: Lo found hedge fund Sharpes overstated by up to 65%.",
      ],
    },
  },
};

// ─── 4.3.4 · Probability of backtest overfitting ───────────────────────────

const L_4_3_4: Lesson = {
  id: "4.3.4",
  title: "Probability of backtest overfitting",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "CSCV splits the data every way into in-sample and out-of-sample halves and counts how often the in-sample winner lands in the bottom half out of sample.",
  objectives: [
    "Describe the CSCV procedure that estimates the probability of backtest overfitting.",
    "Interpret a PBO value and the in-sample vs out-of-sample degradation plot.",
    "Classify a strategy family as likely overfit, uncertain or worth further testing.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "4.3",
    courseId: "4.3.4",
    hook: {
      prompt: "On pure noise, how often does the in-sample winner of a strategy family finish in the bottom half out of sample?",
      control: {
        kind: "slider",
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        start: 10,
        answer: 50,
        tolerance: 8,
        feedback: [
          { from: 0, to: 30, text: "That expects the winner to keep some of its edge. On noise it has none to keep." },
          { from: 70, to: 100, text: "That would make the winner worse than average. On noise it's no better and no worse: a coin toss." },
        ],
      },
      compare: "You answered {yours}%. Across 1,000 seeded R0 families, the in-sample winner finished in the bottom half out of sample in 50% of splits on average.",
      concept: "backtest-overfitting-probability",
    },
    learn: [
      {
        kind: "figure",
        title: "The CSCV procedure",
        figure: {
          kind: "flow",
          start: "matrix",
          nodes: [
            { id: "matrix", text: "A T × N matrix: the daily returns of all N variants tried", kind: "pause", next: "blocks" },
            { id: "blocks", text: "Cut the rows into S = 8 equal blocks", kind: "pause", next: "splits" },
            { id: "splits", text: "Every way to pick 4 blocks in-sample: C(8,4) = 70 splits", kind: "pause", next: "rank" },
            { id: "rank", text: "Each split: take the in-sample winner and find its out-of-sample rank", kind: "end" },
          ],
          steps: [
            "The matrix holds every variant you tried: here 20 variants over 4 years.",
            "Eight blocks of 126 days each.",
            "Each split uses 4 blocks in-sample and the other 4 out of sample.",
            "The winner's relative rank ω: near 1 at the top, near 0 at the bottom.",
          ],
        },
        text: "[[cscv|CSCV]], combinatorially symmetric cross-validation (Bailey, Borwein, López de Prado and Zhu, 2017), judges the whole [[strategy-family|strategy family]], not one backtest. Every block serves in-sample and out of sample equally often.",
        concept: "backtest-overfitting-probability",
      },
      {
        kind: "worked",
        title: "From ranks to PBO",
        lines: [
          "Relative rank ω = rank ÷ (N + 1); logit λ = ln(ω ÷ (1 − ω)).",
          "λ ≤ 0 means the in-sample winner landed at or below the middle out of sample.",
          "PBO = the share of the 70 splits with λ ≤ 0.",
          "A family has λ ≤ 0 in 49 of 70 splits. PBO = ?",
        ],
        ask: {
          answer: 70,
          tolerance: 0.5,
          unit: "%",
          feedback: [
            { value: 0.7, text: "That's the fraction. As a percentage it's 70%." },
            { value: 30, text: "That's the share with λ above 0. PBO counts λ ≤ 0." },
          ],
          correct: "Right. 70%: in most splits the in-sample favourite disappoints.",
        },
        concept: "backtest-overfitting-probability",
      },
      {
        kind: "explain",
        title: "Noise sits at one half",
        text: "On R0 the in-sample winner is a coin toss out of sample, so [[probability-of-backtest-overfitting|PBO]] sits near 0.5. A seeded family of 20 variants, 10 lookbacks each traded with the move and against it, averaged 0.50 over 1,000 R0 series. On R1, with a real trend edge, the same family averaged 0.105.",
      },
      {
        kind: "figure",
        title: "In-sample against out of sample",
        figure: {
          kind: "bars",
          bars: [
            { label: "R0 winner, in-sample", value: 1.18, role: "neutral" },
            { label: "R0 winner, out of sample", value: -0.03, role: "down" },
            { label: "R1 winner, in-sample", value: 1.89, role: "neutral" },
            { label: "R1 winner, out of sample", value: 1.16, role: "up" },
          ],
          steps: ["R0 family: the winners' Sharpe averaged 1.18 in-sample, −0.03 out of sample. PBO 0.51.", "R1 family: 1.89 in-sample, 1.16 out of sample. PBO 0.03."],
        },
        text: "Annual Sharpe of each split's in-sample winner, averaged over the 70 splits of one seeded family each. Some decay from in-sample to out of sample is normal; a collapse to zero is the warning.",
        concept: "backtest-overfitting-probability",
      },
      {
        kind: "callout",
        tone: "key",
        text: "App convention, not a standard: a PBO of 0.50 or more → reject; 0.20 to 0.50 → incubate and gather data; below 0.20 → carry on with the rest of the validation. This is how professionals do it. You are learning to recognise it, not to compete with it.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "PBO judges the choice, not the edge. Twenty similar trend lookbacks on R1, all with a real edge, averaged a PBO of 0.46: the winner did no better out of sample than the family's median, 1.16. Read a high PBO as 'expect the family average', and judge the edge itself with DSR.",
      },
      {
        kind: "match",
        title: "Classify the families",
        prompt: "Sort each family by the app's PBO thresholds.",
        pairs: [
          { left: "R0 family: λ ≤ 0 in 36 of 70 splits", right: "Likely overfit: reject", wrong: "36 of 70 is a PBO of 0.51: at or above 0.50." },
          { left: "R1 family: λ ≤ 0 in 2 of 70 splits", right: "Worth further testing", wrong: "2 of 70 is 0.03, well below 0.20." },
          { left: "A family with λ ≤ 0 in 25 of 70 splits", right: "Uncertain: incubate", wrong: "25 of 70 is 0.36: between 0.20 and 0.50." },
          { left: "A family with λ ≤ 0 in 10 of 70 splits", right: "Worth further testing", wrong: "10 of 70 is 0.14: below 0.20." },
        ],
        columns: ["Family", "Verdict"],
        correct: "Right. PBO 0.51, 0.03, 0.36 and 0.14. PBO is one test of several: the dossier in 4.3.7 combines them.",
        concept: "backtest-overfitting-probability",
      },
    ],
    check: ["q-4.3.4-1", "q-4.3.4-2", "q-4.3.4-3"],
    recap: {
      takeaways: [
        "CSCV tests all 70 ways to split 8 blocks into in-sample and out-of-sample halves.",
        "PBO is the share of splits where the in-sample winner ranks at or below the median out of sample.",
        "Noise gives a PBO near 0.5. App thresholds: 0.50 or more reject, 0.20 to 0.50 incubate.",
      ],
    },
  },
};

// ─── 4.3.5 · Purged cross-validation and the embargo ───────────────────────

const L_4_3_5: Lesson = {
  id: "4.3.5",
  title: "Purged cross-validation and the embargo",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Labels built from the days ahead leak test information into training; purge the overlapping days and embargo the ones right after each test fold.",
  objectives: [
    "Explain how overlapping labels leak future information into standard k-fold cross-validation.",
    "Mark which training observations to purge and embargo around a test fold.",
    "Compare an inflated score with an honest one on the same data.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "decision_making", label: "Decision-making check" }],
  script: {
    unit: "4.3",
    courseId: "4.3.5",
    hook: {
      prompt: "You label each day by the next 10 days' return and shuffle days into random folds. Your model scores well above 50% on pure noise. Why?",
      control: {
        kind: "choice",
        choices: [
          { id: "good", label: "The model is good", feedback: "On pure noise there's nothing to be good at. The score comes from somewhere else." },
          { id: "overlap", label: "Labels overlap across folds" },
          { id: "few", label: "Too few days", feedback: "Few days would add noise around 50%, not lift the average above it." },
          { id: "costs", label: "Costs were ignored", feedback: "Costs lower a trading result; they can't raise a prediction score on noise." },
        ],
        answer: "overlap",
      },
      compare: "You picked {yours}. Neighbouring days share 9 of their 10 label days, and shuffled folds put those neighbours in training. On 300 seeded R0 series a simple model scored 56.0%, and 50.0% once purged.",
      concept: "purged-cross-validation",
    },
    learn: [
      {
        kind: "figure",
        title: "How a label leaks",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(170, 2),
            hideCandles: true,
            range: [0.5, 2.6],
            describe:
              "A timeline of days 371 to 540. The test fold covers days 401 to 500, with training days on both sides. Day 395's label spans days 396 to 405, five of them inside the test fold. Days 391 to 400 are purged and days 501 to 510 embargoed.",
          },
          steps: [
            {
              text: "Test fold: days 401–500. Training: the days on either side.",
              layers: [span(day(371), day(400), 2, "neutral", "Training"), span(day(401), day(500), 2, "accent", "Test fold: 401–500"), span(day(501), day(540), 2, "neutral", "Training")],
            },
            {
              text: "Day 395's label is the return over days 396–405. Five of them are in the test fold.",
              layers: [{ kind: "marker", index: day(395), price: 2, label: "Day 395", role: "down" }, span(day(396), day(405), 1, "down", "Its label: 396–405")],
            },
            {
              text: "Purge days 391–400 before the fold; embargo days 501–510 after it.",
              layers: [span(day(391), day(400), 2, "down", "Purge"), span(day(501), day(510), 2, "concept", "Embargo")],
            },
          ],
        },
        text: "[[cross-validation|Cross-validation]] trains on some folds and scores on the one held out. With overlapping labels, a training day can carry the test fold's own price moves: [[data-leakage|data leakage]].",
        concept: "purged-cross-validation",
      },
      {
        kind: "explain",
        title: "Purge and embargo",
        text: "[[purging|Purging]] removes training days whose labels overlap the test period. An [[embargo-period|embargo]] also removes a gap right after the test fold: those days fed the last test labels and share their serial correlation. López de Prado (2018) combines both in combinatorial purged cross-validation, which yields many backtest paths instead of one.",
      },
      {
        kind: "worked",
        title: "Mark the days",
        lines: [
          "Labels: the return over the next 10 days. Test fold: days 401–500.",
          "Day 391's label covers days 392–401, so it reaches the fold. Day 390's ends at 400.",
          "Embargo: the 10 days after the fold, 501–510, which the last test labels used.",
          "Training days removed in total, purge plus embargo = ?",
        ],
        ask: {
          answer: 20,
          tolerance: 0,
          unit: "days",
          feedback: [
            { value: 10, text: "That's one side. Count the purge before the fold and the embargo after it." },
            { value: 22, text: "Day 390's label ends at 400 and day 511's starts after 510, so both stay. Ten days each side." },
          ],
          correct: "Right. 20 days: 391–400 purged, 501–510 embargoed. Training keeps days up to 390 and from 511.",
        },
        concept: "purged-cross-validation",
      },
      {
        kind: "predict",
        title: "An honest score",
        prompt: "Same R0 data, same 5-nearest-neighbour model on the trailing 10- and 30-day returns. Shuffled folds scored 56.0%. With contiguous folds, purge and embargo, what do you expect?",
        control: {
          kind: "choice",
          choices: [
            { id: "same", label: "About 56%: the model is the same", feedback: "The model is the same, but it can no longer copy its neighbours' overlapping labels." },
            { id: "half", label: "About 50%" },
            { id: "more", label: "Above 60%", feedback: "Removing leaked days can't make noise more predictable." },
          ],
          answer: "half",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "Shuffled folds", value: 56, role: "down" },
            { label: "Contiguous folds", value: 50.2, role: "neutral" },
            { label: "Contiguous, purge and embargo", value: 50, role: "up" },
          ],
          unit: "%",
          steps: ["Mean accuracy over 300 seeded R0 series of 1,000 days, 10 folds each."],
        },
        reveal: "50.0%. In 90% of the series the shuffled score was 52.1% to 60.3%; purged, 45.3% to 54.9%: noise around a coin toss. Contiguous folds alone scored 50.2%, as only their edges leak. Report the honest number.",
        concept: "purged-cross-validation",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "'AI' and machine-learning strategies fall into the same trap, multiplied by their many parameters: a flexible model finds leaked labels faster than you do. This is how professionals do it. You are learning to recognise it, not to compete with it.",
      },
      {
        kind: "match",
        title: "Mark the fold",
        prompt: "10-day labels, test fold 401–500. Sort each block of days.",
        pairs: [
          { left: "Days 381–390", right: "Train", wrong: "Their labels end by day 400, before the fold starts." },
          { left: "Days 391–400", right: "Purge", wrong: "Their 10-day labels reach into days 401–410, inside the test fold." },
          { left: "Days 401–500", right: "Test" },
          { left: "Days 501–510", right: "Embargo", wrong: "The last test labels used these days' moves. Keep them out of training." },
          { left: "Days 511–520", right: "Train", wrong: "They come after the last test label ends at day 510. They're safe to train on." },
        ],
        columns: ["Days", "Use"],
        correct: "Right. Purge 391–400, embargo 501–510, train on the rest.",
        concept: "purged-cross-validation",
      },
    ],
    check: ["q-4.3.5-1", "q-4.3.5-2", "q-4.3.5-3"],
    recap: {
      takeaways: [
        "Overlapping labels let shuffled folds see the test: 56.0% accuracy on pure noise.",
        "Purge training days whose labels reach the test fold; embargo the days right after it.",
        "Report the purged score: 50.0% on R0, a coin toss, as noise should be.",
      ],
    },
  },
};

// ─── 4.3.6 · Capacity ──────────────────────────────────────────────────────

const L_4_3_6: Lesson = {
  id: "4.3.6",
  title: "Capacity: how much money an edge can carry",
  topic: "position_sizing",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Square-root impact eats a fixed edge as size grows: total profit peaks well before the edge reaches zero, and crowding pulls the peak lower.",
  objectives: [
    "Compute net edge per trade after fixed costs and square-root impact at a given size.",
    "Find the trade size that maximises total profit, and the larger size where the edge reaches zero.",
    "Explain how crowding reduces capacity.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "position_sizing", label: "Position sizing check" }],
  script: {
    unit: "4.3",
    courseId: "4.3.6",
    hook: {
      prompt: "Your strategy nets 15.9 bps per trade at 2,500 units. You trade 4 times bigger. What happens to total profit per trade?",
      control: {
        kind: "choice",
        choices: [
          { id: "x4", label: "×4", feedback: "That assumes the edge per unit stays the same. Impact grows with size and eats it." },
          { id: "x2", label: "×2", feedback: "Still too high: the edge per unit falls from 15.86 to 1.72 bps, faster than the size grows." },
          { id: "falls", label: "It falls" },
          { id: "same", label: "Unchanged", feedback: "Size changes both the units and the edge per unit. Here the second wins." },
        ],
        answer: "falls",
      },
      compare: "You picked {yours}. At 10,000 units the edge is 1.72 bps, so total profit falls from about 396 to 172 vUSD per trade.",
      concept: "strategy-capacity",
    },
    learn: [
      {
        kind: "worked",
        title: "Edge after impact",
        lines: [
          "Fund mode (4.2): daily volume V = 2,000,000 units, daily volatility 2%, LABX at 100.",
          "Gross edge 40 bps a trade; fixed costs 10 bps. Impact per side, by the [[square-root-law|square-root law]] (4.2.2): 200 × √(Q ÷ V) bps, so 400 × √(Q ÷ V) round trip.",
          "Q = 2,500: impact 14.14 bps, net 15.86 bps on 250,000 vUSD = 396.45 vUSD.",
          "Q = 10,000: impact 28.28 bps, net 1.72 bps on 1,000,000 vUSD. Total = ?",
        ],
        ask: {
          answer: 171.57,
          tolerance: 1,
          unit: "vUSD",
          feedback: [
            { value: 1585.8, text: "That's four times 396.45. The edge per unit fell from 15.86 to 1.72 bps." },
            { value: 1720, text: "1.72 bps is 0.000172, not 0.00172: 1,000,000 × 0.000172." },
          ],
          correct: "Right. About 172 vUSD: four times the size, less than half the profit.",
        },
        concept: "strategy-capacity",
      },
      {
        kind: "predict",
        title: "Find the peak",
        prompt: "Total profit per trade = size × net edge, with net edge = 30 − 400 × √(Q ÷ V) bps. Which size maximises it?",
        control: {
          kind: "numeric",
          unit: "units",
          answer: 5000,
          tolerance: 250,
          feedback: [
            { value: 11250, text: "That's where the edge reaches zero, so profit is zero there. The peak comes earlier." },
            { value: 2500, text: "Profit still rises past 2,500: 396 there, more at larger sizes. Keep going." },
          ],
        },
        reveal: "5,000 units: net edge 10 bps on 500,000 vUSD = 500 vUSD. The extra profit from one more unit is zero where 600 × √(Q ÷ V) = 30, so √(Q ÷ V) = 0.05 and Q = 5,000.",
        concept: "strategy-capacity",
      },
      {
        kind: "figure",
        title: "Total profit against size",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(49, 0),
            hideCandles: true,
            range: [-130, 540],
            layers: [{ kind: "level", price: 0, role: "neutral", chip: false }],
            describe:
              "Total profit per trade in vUSD against trade size, 0 to 12,000 units in steps of 250. It rises to a peak of 500 at 5,000 units, falls to 171.57 at 10,000, reaches zero at 11,250 and is −118.06 at 12,000.",
          },
          steps: [
            { text: "Total profit per trade, from 0 to 12,000 units.", layers: [{ kind: "line", values: CAPACITY, role: "accent", label: "Total profit, vUSD" }] },
            { text: "The peak: 500 vUSD at 5,000 units, where the net edge is 10 bps.", layers: [{ kind: "marker", index: 20, price: 500, label: "5,000: 500", role: "up" }] },
            { text: "Zero at 11,250 units: the edge is gone. Beyond it, every trade loses.", layers: [{ kind: "marker", index: 45, price: 0, label: "11,250", role: "down" }] },
          ],
        },
        text: "The capacity that matters is the peak, not the zero. [[marginal-profit|Marginal profit]], the extra profit from one more unit, falls to zero at 5,000 units; past it, extra size only gives profit away.",
        concept: "strategy-capacity",
      },
      {
        kind: "explain",
        title: "Crowding",
        text: "[[crowding|Crowding]] (3.13) shrinks capacity without you changing a thing. If another fund trades the same signal at the same moments with 5,000 units, impact is set by 10,000: your 500 vUSD per trade falls to 86, and your best size drops to about 2,985 units, earning 141. McLean and Pontiff link part of the post-publication decline to such traders.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Capacity is a fund-sized problem, not one for a 10,000 vUSD account. Your lesson is smaller: a thin edge on an illiquid instrument vanishes fast as size grows, so scale only where volume can carry you. This is how professionals do it. You are learning to recognise it, not to compete with it.",
      },
    ],
    check: ["q-4.3.6-1", "q-4.3.6-2", "q-4.3.6-3"],
    recap: {
      takeaways: [
        "Net edge = gross − fixed costs − round-trip impact; impact grows with √(size ÷ volume).",
        "Total profit peaks where marginal profit is zero: 5,000 units, 500 vUSD, before the 11,250 break-even.",
        "Crowding adds others' size to your impact: one twin fund cuts your 500 to 86 vUSD.",
      ],
    },
  },
};

// ─── 4.3.7 · The validation dossier and the verdict ────────────────────────

const L_4_3_7: Lesson = {
  id: "4.3.7",
  title: "The validation dossier and the verdict",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Pre-register the thresholds and the decay haircut, audit the research log, then reach deploy, incubate or reject by criteria written before the results.",
  objectives: [
    "Audit a research log for the violations that make a result unreportable.",
    "Pre-register the test plan, thresholds and decay haircut before seeing out-of-sample results.",
    "Complete a validation dossier and reach a deploy, incubate or reject verdict.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "4.3",
    courseId: "4.3.7",
    hook: {
      prompt: "Two researchers report the same Sharpe of 1.2. One tried 3 ideas, the other 300. Whose result do you trust more?",
      control: {
        kind: "choice",
        choices: [
          { id: "three", label: "The one with 3 ideas" },
          { id: "many", label: "The one with 300: more thorough", feedback: "More tries means a higher best by luck alone. 300 tries need far more evidence." },
          { id: "equal", label: "Equally: same Sharpe", feedback: "Same Sharpe, different bars: the best of 300 is expected to look good by luck alone." },
        ],
        answer: "three",
      },
      compare: "You picked {yours}. The best of 300 zero-edge tries is expected to sit about 2.9 Sharpe spreads above zero, the best of 3 about 0.85. The same 1.2 means far less after 300.",
      concept: "research-hygiene",
    },
    learn: [
      {
        kind: "explain",
        title: "Write it down first",
        text: "From 3.11: a written [[edge-hypothesis]] with its economic reason, an immutable [[research-log]], one out-of-sample unlock, few parameters. New here: [[pre-registration]] of the test plan. Before any unlock, write the DSR, MinBTL and PBO thresholds, the decay haircut and the verdict rules. They don't change after the results.",
      },
      {
        kind: "order",
        title: "The dossier, step by step",
        prompt: "Put the sections of a validation dossier in order.",
        items: [
          "Hypothesis and its economic reason",
          "Rules, data and costs",
          "In-sample, out-of-sample and walk-forward",
          "Monte Carlo and the R0 control",
          "Trial count, DSR and MinBTL",
          "PBO and capacity",
          "Decay haircut and kill criteria",
          "Verdict",
        ],
        explain: "Each section uses only what came before it, and the thresholds behind sections 5 to 8 were written before the out-of-sample unlock.",
        wrong: "Start from the idea and end with the verdict. The statistics on the search come after the basic tests.",
        note: { key: "dossier-system", label: "Which system will your dossier cover?", placeholder: "e.g. My Capstone 3 breakout system on LABX" },
        concept: "research-hygiene",
      },
      {
        kind: "worked",
        title: "The decay haircut",
        lines: [
          "McLean and Pontiff (2016), met in 3.13: 97 published predictors earned 26% less out of sample and 58% less after publication.",
          "App convention: for a published idea, plan with at most half the backtest expectancy.",
          "Backtest: +0.30R a trade. Planned expectancy = ?",
        ],
        ask: {
          answer: 0.15,
          tolerance: 0.005,
          unit: "R",
          feedback: [
            { value: 0.6, text: "That doubles it. The haircut cuts the backtest figure in half." },
            { value: 0.126, text: "That applies the full 58% post-publication drop. The app's planning rule is a 50% cut." },
          ],
          correct: "Right. +0.15R goes in the plan; sizing, gates and kill criteria all use it.",
        },
        concept: "anomaly-decay",
      },
      {
        kind: "fields",
        title: "Pre-register your rules",
        prompt: "Fix your verdict rules before you unlock any out-of-sample data. They are saved with this lesson.",
        fields: [
          { id: "dsr", label: "Deploy needs a DSR of at least", kind: "choice", options: [0.5, 0.8, 0.9, 0.95], default: 0.95 },
          { id: "pbo", label: "Reject when PBO is at least", kind: "choice", options: [0.2, 0.35, 0.5, 0.7], default: 0.5 },
          { id: "haircut", label: "Decay haircut for a published idea", kind: "choice", options: [0, 25, 50, 75], unit: "%", default: 50 },
          { id: "trials", label: "Most configurations you will try", kind: "stepper", min: 5, max: 200, step: 5, default: 25 },
        ],
        valid: { all: [{ field: "dsr", gte: 0.8 }, { field: "pbo", lte: 0.5 }, { field: "haircut", gte: 25 }] },
        feedback: [
          { when: { field: "dsr", lt: 0.8 }, text: "A DSR of {dsr:2} would deploy results close to a coin toss against luck. Ask for more." },
          { when: { field: "pbo", gt: 0.5 }, text: "A PBO of {pbo:2} accepts families whose winner lands in the bottom half most of the time: worse than noise." },
          { when: { field: "haircut", lt: 25 }, text: "Published edges earned 58% less after publication. Planning with the full backtest figure sizes for an edge you probably won't get." },
        ],
        correct: "Saved. Check your trial cap against MinBTL: with 4 years of data and a target Sharpe of 1, it's 25.",
        concept: "research-hygiene",
      },
      {
        kind: "match",
        title: "Audit the log",
        prompt: "Sort each entry of this research log.",
        pairs: [
          { left: "Out-of-sample data unlocked on 3 March, and again on 9 March after a rule change", right: "Violation", wrong: "A second unlock turns the out-of-sample data into in-sample data: the test is spent." },
          { left: "A 40-setting parameter sweep, logged as one trial", right: "Violation", wrong: "Each of the 40 settings is a trial. N is now understated by 39." },
          { left: "Hypothesis dated 12 March, after the 9 March results", right: "Violation", wrong: "A hypothesis written after the results is fitted to them." },
          { left: "Universe: only the stocks still listed today", right: "Violation", wrong: "Only survivors: survivorship bias flatters every result." },
          { left: "Costs fixed at a 0.10 spread and 0.05% commission before the first run", right: "Fine", wrong: "Fixing costs before any result is exactly what hygiene asks." },
          { left: "A failed variant kept in the log with its result", right: "Fine", wrong: "Failed variants belong in the log: they are part of N." },
        ],
        columns: ["Log entry", "Audit"],
        correct: "Right. Four violations: a second unlock, an unlogged sweep, a hypothesis written after the results and a survivors-only universe. Each makes the result unreportable until it's redone.",
        concept: "research-hygiene",
      },
      {
        kind: "predict",
        title: "The verdict",
        prompt: "Your rules: deploy to a forward test needs DSR ≥ 0.95 and PBO < 0.20; reject if DSR < 0.50 or PBO ≥ 0.50. The dossier: 40 trials, Sharpe 1.2 over 5 years, DSR 0.76, PBO 0.14, MinBTL 3.3 years. Verdict?",
        control: {
          kind: "choice",
          choices: [
            { id: "deploy", label: "Deploy to a forward test", feedback: "DSR 0.76 misses the 0.95 you wrote down. Moving the bar now would undo the pre-registration." },
            { id: "incubate", label: "Incubate longer" },
            { id: "reject", label: "Reject", feedback: "Nothing triggers a reject: DSR is above 0.50 and PBO below 0.50." },
          ],
          answer: "incubate",
        },
        reveal: "Incubate longer. DSR 0.76 sits between your bars, while PBO 0.14 and 5 years of data against a MinBTL of 3.3 pass. More clean data, not more trials, is what can lift the DSR.",
        concept: "research-hygiene",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A 'reject' is a good result: the process caught a false positive before it cost money. And a forward test can't prove a small edge quickly: at a real +0.15R, with 2R wins and 1R losses, 22% of 10,000 seeded 50-trade forward tests still lost money. Judge them against bands written in advance (3.11).",
      },
    ],
    check: ["q-4.3.7-1", "q-4.3.7-2", "q-4.3.7-3"],
    recap: {
      takeaways: [
        "Audit the log: one out-of-sample unlock, every trial counted, hypothesis dated first, no survivors-only universe.",
        "Pre-register thresholds and the decay haircut: a published 0.30R backtest enters the plan as 0.15R.",
        "Deploy, incubate or reject by rules written first. A justified reject is a success.",
      ],
    },
  },
};

// ─── Check questions ───────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 4.3.1
  {
    id: "q-4.3.1-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "What does White's Reality Check test?",
    options: [
      { id: "a", label: "Whether each rule, on its own, is significant at 5%", rationale: "That's the single test it replaces. Judged one at a time, the best of many rules usually looks significant by luck." },
      { id: "b", label: "Whether the best rule of the whole search beats the benchmark by more than the best rule would by luck alone" },
      { id: "c", label: "Whether the rule still works on out-of-sample data", rationale: "Out-of-sample testing is a separate step. The Reality Check corrects for the search on the data that were searched." },
      { id: "d", label: "Whether the backtest has look-ahead bias", rationale: "Look-ahead is a coding error. The Reality Check assumes clean data and asks how much of the winner is luck from searching." },
    ],
    correct: "b",
    explanation:
      "The Reality Check resamples the returns of every rule tried, recentred to no edge, and records the best result each time. The real winner must beat that distribution of lucky maxima: on R0, a winner with |t| = 2.07 got p = 0.40.",
    lesson: "4.3.1",
    concepts: ["reality-check-testing", "multiple-testing"],
    hints: ["Which rule does it judge, and against what?", "It builds the distribution of the best result when no rule has an edge."],
  },
  {
    id: "q-4.3.1-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "You test 200 lookbacks of one momentum rule. Why is a Bonferroni correction too strict here?",
    options: [
      { id: "a", label: "It treats 200 near-copies as 200 independent chances, but the search behaves like far fewer tests" },
      { id: "b", label: "Bonferroni only works for fewer than 20 tests", rationale: "It works for any number of tests. The issue is that it assumes the worst case: fully independent tests." },
      { id: "c", label: "Momentum rules can't be tested for significance", rationale: "They can, with a t-statistic on their returns. The question is how to correct for 200 related tries." },
      { id: "d", label: "It isn't too strict: 200 variants need the full correction", rationale: "On R0 the best of these 200 crossed Bonferroni's 3.66 in 1.3% of searches, not the 5% it allows: the bar is too high." },
    ],
    correct: "a",
    explanation:
      "Neighbouring lookbacks trade almost the same days, so their results move together. In 2,000 seeded R0 searches, the 200 lookbacks behaved like about 48 independent tests: the best crossed Bonferroni's 3.66 in only 1.3%, against a 5% target.",
    lesson: "4.3.1",
    concepts: ["multiple-testing", "reality-check-testing"],
    hints: ["Do neighbouring lookbacks give independent results?", "Bonferroni assumes every test is a fresh, independent chance."],
  },
  {
    id: "q-4.3.1-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "Over six months you tried 12 ideas on LABX. You dropped 9 after a quick look, swept 30 settings of one of the others, and now present its best setting.",
    prompt: "Which tries belong in your trial count, N?",
    options: [
      { id: "a", label: "Only the 30 settings of the final idea", rationale: "The quick looks and the other ideas were tries on the same data too. Leaving them out understates N." },
      { id: "b", label: "Only the 3 ideas you kept", rationale: "Dropped ideas count: each was a chance for luck to hand you a winner." },
      { id: "c", label: "Every try: all 12 ideas, the quick looks and all 30 settings" },
      { id: "d", label: "Just 1: you present one strategy", rationale: "That's the naive single test. The winner was selected from many tries, and the bar must reflect them." },
    ],
    correct: "c",
    explanation:
      "N counts every configuration that could have become the winner: the 9 ideas dropped after a quick look, the others, and all 30 settings of the sweep. Your research log is where the count comes from; without it, the risk of overfitting can't be judged.",
    lesson: "4.3.1",
    concepts: ["reality-check-testing", "research-log"],
    hints: ["Would a dropped idea have been presented if it had looked good?", "Every configuration that could have become the winner is a trial."],
  },
  // 4.3.2
  {
    id: "q-4.3.2-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why does the expected best Sharpe of N zero-edge trials rise as N grows?",
    options: [
      { id: "a", label: "Each trial is another draw of noise, and the best of more draws is higher" },
      { id: "b", label: "Later trials learn from earlier ones", rationale: "Zero-edge trials learn nothing. The best rises only because more noisy results are compared." },
      { id: "c", label: "Longer searches use more data", rationale: "N counts tries on the same data. The rise comes from keeping the best of more noisy results." },
      { id: "d", label: "It doesn't: zero-edge trials average zero", rationale: "Their average is zero, but you keep the best. The best of 50 one-year trials averaged 2.26 in seeded runs." },
    ],
    correct: "a",
    explanation:
      "With no edge, each trial's Sharpe is noise around zero. Keep the best and you keep the luckiest draw: about 1.57 spreads above zero for N = 10, 2.28 for 50 and 2.53 for 100.",
    lesson: "4.3.2",
    concepts: ["deflated-sharpe-ratio", "multiple-testing"],
    hints: ["What happens to the maximum of a set of random numbers as the set grows?"],
  },
  {
    id: "q-4.3.2-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "A validation card shows a deflated Sharpe ratio of 0.73. What does it say?",
    options: [
      { id: "a", label: "The true Sharpe is 73% of the measured one", rationale: "DSR is a probability, not a shrink factor. A haircut lowers the Sharpe; the DSR judges it." },
      { id: "b", label: "73% of the trials were profitable", rationale: "DSR is about the winner against luck's benchmark, not the share of profitable trials." },
      { id: "c", label: "There's a 73% probability the true Sharpe beats the best Sharpe luck would give the trials run" },
      { id: "d", label: "It passes: anything above 0.5 is significant", rationale: "At 0.5 the Sharpe only equals luck's benchmark. The usual convention asks for 0.95." },
    ],
    correct: "c",
    explanation:
      "DSR is the probabilistic Sharpe ratio measured against SR*, the best Sharpe the trials are expected to show by luck, with skew and fat tails included. 0.73 is below the conventional 0.95: the result may be a fluke.",
    lesson: "4.3.2",
    concepts: ["deflated-sharpe-ratio", "probabilistic-sharpe-ratio"],
    hints: ["Is DSR a probability or a reduced Sharpe?", "Its benchmark is the best Sharpe the trials would show with no edge."],
  },
  {
    id: "q-4.3.2-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 3,
    prompt: "Two backtests have the same Sharpe ratio and length. One has negative skew, the other positive. Why is the negative-skew PSR lower?",
    options: [
      { id: "a", label: "Negative skew lowers the average return", rationale: "Both have the same Sharpe, so the same average for their volatility. Skew changes how reliable that Sharpe is." },
      { id: "b", label: "Rare large losses make a measured Sharpe less reliable, which widens its error" },
      { id: "c", label: "PSR ignores skew; the gap is rounding", rationale: "PSR includes skew directly: the term 1 − skew × SR grows when skew is negative." },
      { id: "d", label: "Positive skew means more trades", rationale: "Skew describes the shape of returns, not how many there are." },
    ],
    correct: "b",
    explanation:
      "In the PSR's denominator, √(1 − skew × SR + (kurtosis − 1) ÷ 4 × SR²), negative skew makes the term larger, so the same Sharpe gives a smaller z-score. In the lesson's backtest, skew −0.5 gives a PSR of 0.9942 against 0.9959 at +0.5.",
    lesson: "4.3.2",
    concepts: ["probabilistic-sharpe-ratio", "skewness"],
    hints: ["Look at the term 1 − skew × SR in the denominator.", "A larger denominator means a smaller z-score."],
  },
  // 4.3.3
  {
    id: "q-4.3.3-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "A strategy shows an annual Sharpe of 1.0 over 5 years of daily data. Using SE ≈ 1 ÷ √years, what is the lower end of its 95% interval?",
    numeric: { answer: 0.12, tolerance: 0.02, unit: "" },
    explanation: "SE = 1 ÷ √5 = 0.447. Lower end = 1.0 − 1.96 × 0.447 = 0.12; the upper end is 1.88. Zero is only just outside.",
    lesson: "4.3.3",
    concepts: ["sharpe-ratio-uncertainty"],
    hints: ["SE of an annual Sharpe ≈ 1 ÷ √years.", "Lower end = Sharpe − 1.96 × SE.", "1 ÷ √5 = 0.447."],
    vary: {
      fields: { s: [0.6, 2, 0.1], y: [2, 12, 1] },
      answer: "round(s - 1.96 / sqrt(y), 2)",
      prompt: "A strategy shows an annual Sharpe of {s:1} over {y} years of daily data. Using SE ≈ 1 ÷ √years, what is the lower end of its 95% interval?",
      explanation: "SE = 1 ÷ √{y} = {1 / sqrt(y):3}. Lower end = {s:1} − 1.96 × {1 / sqrt(y):3} = {answer:2}.",
      hint: "1 ÷ √{y} = {1 / sqrt(y):3}.",
    },
  },
  {
    id: "q-4.3.3-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "With 100 configurations tried and a target Sharpe of 1, the minimum backtest length is 6.4 years. What does that mean?",
    options: [
      { id: "a", label: "The strategy needs 6.4 years to become profitable", rationale: "MinBTL is about how much data a test needs, not about when profits arrive." },
      { id: "b", label: "Each of the 100 configurations needs its own 6.4 years", rationale: "All 100 run on the same history. MinBTL is how long that one history must be." },
      { id: "c", label: "After 6.4 years of data, the edge is proven", rationale: "MinBTL is a minimum, a necessary condition. Passing it proves nothing on its own; DSR and PBO still apply." },
      { id: "d", label: "With less than 6.4 years of data, the best of 100 zero-edge tries is expected to reach a Sharpe of 1 by luck" },
    ],
    correct: "d",
    explanation:
      "E[max] for 100 zero-edge tries is 2.53, so the best shows an annual Sharpe near 2.53 ÷ √years. That stays above 1 until years exceed 2.53² = 6.4. Shorter data can't tell a Sharpe of 1 from the luck of 100 tries.",
    lesson: "4.3.3",
    concepts: ["minimum-backtest-length"],
    hints: ["MinBTL compares a target Sharpe with the best that luck gives N tries.", "Luck's best shrinks with √years."],
  },
  {
    id: "q-4.3.3-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "You tried 20 variants on the last 3 months of daily data. The best shows an annual Sharpe of 3.0.",
    prompt: "What does that tell you?",
    options: [
      { id: "a", label: "A lot: a Sharpe of 3 is rare", rationale: "Rare for one test. The best of 20 zero-edge 3-month tries averaged 3.80 in seeded runs and reached 3.0 in 76% of them." },
      { id: "b", label: "Almost nothing: luck alone would be expected to give the best of 20 about 3.8 over 3 months" },
      { id: "c", label: "The edge is real but smaller, around 1.5", rationale: "Nothing here separates a Sharpe of 1.5 from zero. The data are far too short for 20 tries." },
      { id: "d", label: "Enough to start trading at full size", rationale: "MinBTL for 20 tries at a target of 3 is about 4.8 months: 3 months can't carry this search." },
    ],
    correct: "b",
    explanation:
      "E[max] for 20 tries is 1.90; over 0.25 years that's an annual Sharpe near 1.90 ÷ √0.25 = 3.8. In 10,000 seeded searches the best averaged 3.80. MinBTL at a target of 3 is (1.90 ÷ 3)² = 0.40 years, about 4.8 months.",
    lesson: "4.3.3",
    concepts: ["minimum-backtest-length", "sharpe-ratio-uncertainty"],
    hints: ["How high is the best of 20 tries expected to be by luck alone?", "Over 0.25 years, divide E[max] by √0.25 = 0.5."],
  },
  // 4.3.4
  {
    id: "q-4.3.4-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "What does the probability of backtest overfitting (PBO) measure?",
    options: [
      { id: "a", label: "The chance the strategy loses money next year", rationale: "PBO is about ranks inside the family, not future profit. A family with a low PBO can still lose to costs." },
      { id: "b", label: "How often the in-sample winner of a family ranks at or below the median out of sample" },
      { id: "c", label: "The share of variants that are profitable", rationale: "That counts winners. PBO asks whether picking the in-sample best helps out of sample." },
      { id: "d", label: "How much the Sharpe falls from in-sample to out of sample", rationale: "That's the degradation, read beside PBO. PBO counts the splits where the winner's rank falls to the bottom half." },
    ],
    correct: "b",
    explanation: "CSCV splits the data every way into in-sample and out-of-sample halves. PBO is the share of splits where the in-sample winner's out-of-sample rank is at or below the median (λ ≤ 0).",
    lesson: "4.3.4",
    concepts: ["backtest-overfitting-probability"],
    hints: ["It's about the winner's rank inside its family.", "Count the splits where that rank falls to the bottom half."],
  },
  {
    id: "q-4.3.4-2",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "CSCV with 8 blocks gives 70 splits. In 21 of them the in-sample winner ranks at or below the median out of sample. What is the PBO, in %?",
    numeric: { answer: 30, tolerance: 0.5, unit: "%" },
    explanation: "PBO = splits with λ ≤ 0 ÷ all splits = 21 ÷ 70 = 30%. By the app's convention, 20% to 50% means incubate.",
    lesson: "4.3.4",
    concepts: ["backtest-overfitting-probability"],
    hints: ["PBO is a share of the splits.", "Divide the splits with λ ≤ 0 by 70."],
    vary: {
      fields: { n: [3, 60, 1] },
      answer: "round(100 * n / 70, 1)",
      prompt: "CSCV with 8 blocks gives 70 splits. In {n} of them the in-sample winner ranks at or below the median out of sample. What is the PBO, in %?",
      explanation: "PBO = {n} ÷ 70 = {answer:1}%. App convention: 50% or more reject, 20% to 50% incubate, under 20% keep testing.",
      hint: "{n} ÷ 70.",
    },
  },
  {
    id: "q-4.3.4-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why does PBO sit near 0.5 on R0, random-walk data?",
    options: [
      { id: "a", label: "R0 data have exactly half winning days", rationale: "PBO counts the winner's ranks, not winning days. Any no-edge family gives about one half." },
      { id: "b", label: "Half the variants are overfit", rationale: "On R0 every variant is noise. The winner's out-of-sample rank is random, so half the splits put it in the bottom half." },
      { id: "c", label: "On a random walk the in-sample winner is a coin toss out of sample" },
      { id: "d", label: "CSCV uses half the data in-sample", rationale: "The halves don't fix PBO. A family with a real, varied edge scores far lower on the same splits: 0.105 on R1." },
    ],
    correct: "c",
    explanation: "With no edge, in-sample rank says nothing about out-of-sample rank, so the winner lands above or below the median with equal odds. Across 1,000 seeded R0 families, PBO averaged 0.50.",
    lesson: "4.3.4",
    concepts: ["backtest-overfitting-probability", "random-walk"],
    hints: ["Does an in-sample rank carry any information when there is no edge?"],
  },
  // 4.3.5
  {
    id: "q-4.3.5-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why does shuffled k-fold cross-validation overstate results on daily data with 10-day labels?",
    options: [
      { id: "a", label: "It uses too few folds", rationale: "More folds don't help. The leak comes from labels that overlap between training and test days." },
      { id: "b", label: "Daily data are too noisy for any model", rationale: "Noise would pull the score toward 50%, not lift it above." },
      { id: "c", label: "Shuffling removes the trend", rationale: "Shuffling folds doesn't change the prices. It puts each test day's neighbours, with overlapping labels, into training." },
      { id: "d", label: "Neighbouring days share most of their label days, so training holds near-copies of the test labels" },
    ],
    correct: "d",
    explanation:
      "Day t's label uses days t+1 to t+10; day t+1's uses t+2 to t+11, nine days shared. Shuffled folds put such neighbours on both sides, and the model copies near-identical labels. On R0 that gave 56.0% accuracy, and 50.0% after purge and embargo.",
    lesson: "4.3.5",
    concepts: ["purged-cross-validation", "look-ahead-bias"],
    hints: ["How many label days do two neighbouring days share?"],
  },
  {
    id: "q-4.3.5-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "What is the difference between purging and an embargo?",
    options: [
      { id: "a", label: "Purging deletes outliers; the embargo delays trading", rationale: "Neither is about outliers or live trading. Both remove training days near the test fold." },
      { id: "b", label: "Purging drops training days whose labels overlap the test period; the embargo drops a gap right after the test fold" },
      { id: "c", label: "They're the same thing, on opposite sides", rationale: "They sit on opposite sides here, but for different reasons: label overlap before, the test labels' days and serial correlation after." },
      { id: "d", label: "Purging is for prices, the embargo for news", rationale: "Both apply to any time series whose labels are built over a horizon." },
    ],
    correct: "b",
    explanation: "Purging removes training observations whose labels reach into the test period. The embargo removes the days just after the fold, which the last test labels used and which share their serial correlation.",
    lesson: "4.3.5",
    concepts: ["purged-cross-validation"],
    hints: ["One deals with labels reaching forward into the test fold; the other with the days just after it."],
  },
  {
    id: "q-4.3.5-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 3,
    prompt: "Labels use the next 5 days' return. The test fold is days 201–300. Which training days do you drop?",
    options: [
      { id: "a", label: "Purge 191–200 and embargo 301–310", rationale: "That uses 10 days. With 5-day labels, only days 196–200 reach into the fold." },
      { id: "b", label: "Only 196–200", rationale: "That's the purge. The days after the fold fed the last test labels: embargo 301–305 too." },
      { id: "c", label: "Purge 196–200 and embargo 301–305" },
      { id: "d", label: "Only 301–305", rationale: "Days 196–200 have labels reaching into days 201–205, inside the fold. Purge them." },
    ],
    correct: "c",
    explanation: "Day 196's label covers days 197–201 and reaches the fold; day 195's ends at 200. The last test labels use days 301–305, so those are embargoed. Train on days up to 195 and from 306.",
    lesson: "4.3.5",
    concepts: ["purged-cross-validation"],
    hints: ["Which training labels reach day 201 or later?", "Then protect the days the last test labels used."],
  },
  // 4.3.6
  {
    id: "q-4.3.6-1",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "Gross edge 40 bps a trade, fixed costs 10 bps, impact 200 × √(Q ÷ V) bps per side. At Q ÷ V = 0.25%, what is the net edge per trade, in bps?",
    numeric: { answer: 10, tolerance: 0.05, unit: "bps" },
    explanation: "√0.0025 = 0.05. Impact per side = 200 × 0.05 = 10 bps, so 20 bps round trip. Net = 40 − 10 − 20 = 10 bps.",
    lesson: "4.3.6",
    concepts: ["strategy-capacity", "square-root-impact"],
    hints: ["Round-trip impact is twice the per-side figure.", "√0.0025 = 0.05."],
    vary: {
      fields: { g: [30, 60, 5], c: [5, 15, 5], q: [1, 6, 1] },
      constraints: ["g - c - 4 * q > 0"],
      answer: "round(g - c - 4 * q, 2)",
      prompt: "Gross edge {g} bps a trade, fixed costs {c} bps, impact 200 × √(Q ÷ V) bps per side. At Q ÷ V = {q * q / 100:2}%, what is the net edge per trade, in bps?",
      explanation: "√{q * q / 10000:4} = {q / 100:2}. Impact per side = 200 × {q / 100:2} = {2 * q} bps, so {4 * q} bps round trip. Net = {g} − {c} − {4 * q} = {answer:2} bps.",
      hint: "√{q * q / 10000:4} = {q / 100:2}.",
    },
  },
  {
    id: "q-4.3.6-2",
    topic: "position_sizing",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why is the size that maximises total profit per trade smaller than the size where the edge reaches zero?",
    options: [
      { id: "a", label: "Brokers cap position size", rationale: "No cap is involved. The peak comes from impact growing with size." },
      { id: "b", label: "Fixed costs rise with size", rationale: "Fixed costs are a constant 10 bps per trade here. Impact is what grows with size." },
      { id: "c", label: "Past the peak, each extra unit raises impact on every unit, so total profit falls long before the edge hits zero" },
      { id: "d", label: "They're the same size", rationale: "Where the edge per unit is zero, total profit is zero. The peak, at 5,000 units, comes much earlier." },
    ],
    correct: "c",
    explanation:
      "Total profit = size × net edge. More size adds units but lowers the edge on all of them. Marginal profit reaches zero at 5,000 units (500 vUSD); the edge itself reaches zero only at 11,250 units, where total profit is zero.",
    lesson: "4.3.6",
    concepts: ["strategy-capacity"],
    hints: ["Total profit is size × net edge; both change as size grows.", "Find where one more unit stops adding profit."],
  },
  {
    id: "q-4.3.6-3",
    topic: "position_sizing",
    kind: "mcq",
    difficulty: 2,
    prompt: "Another fund starts trading your signal at the same moments. What happens to your capacity?",
    options: [
      { id: "a", label: "It falls: impact depends on the combined size, so your profitable size shrinks" },
      { id: "b", label: "Nothing, as long as you keep your size", rationale: "Your size is the same, but impact is set by everyone trading. In the lesson, a twin fund cut 500 vUSD per trade to 86." },
      { id: "c", label: "It rises: more volume makes the market deeper", rationale: "Their orders don't add depth on your side; they compete for it at the same moments." },
      { id: "d", label: "Only their capacity falls", rationale: "Impact is shared: both of you pay the price move set by the combined size." },
    ],
    correct: "a",
    explanation:
      "With a twin trading 5,000 units alongside your 5,000, impact is set by 10,000: your profit per trade falls from 500 to 86 vUSD, and your best size drops to about 2,985 units. Crowding shrinks capacity without you changing anything.",
    lesson: "4.3.6",
    concepts: ["strategy-capacity", "strategy-crowding"],
    hints: ["Which size sets the impact: yours alone, or everyone's trading at that moment?"],
  },
  // 4.3.7
  {
    id: "q-4.3.7-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why must a strategy report state the number of trials, N?",
    options: [
      { id: "a", label: "Regulators require it", rationale: "This is about statistics, not regulation: N sets the bar that luck would reach." },
      { id: "b", label: "More trials show a more thorough strategy", rationale: "More trials raise the bar luck sets, so the same result means less." },
      { id: "c", label: "It sets the position size", rationale: "Sizing comes from risk and expectancy. N tells readers how to judge the backtest." },
      { id: "d", label: "Without N, nobody can judge how much of the result could be luck from searching" },
    ],
    correct: "d",
    explanation: "The best of N tries is expected to look good by luck alone, and that bar rises with N. DSR, MinBTL and PBO all need it: without N, the risk of overfitting can't be assessed.",
    lesson: "4.3.7",
    concepts: ["research-hygiene", "deflated-sharpe-ratio"],
    hints: ["What does the bar set by luck depend on?"],
  },
  {
    id: "q-4.3.7-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Your research log shows a second out-of-sample unlock, after a rule change. What does it mean?",
    options: [
      { id: "a", label: "The out-of-sample data have become in-sample: the result is no longer an out-of-sample test" },
      { id: "b", label: "Nothing, if the second result was better", rationale: "Better is the problem: the rule was changed after seeing those data, so they helped choose it." },
      { id: "c", label: "The out-of-sample result counts double", rationale: "It counts less, not more: the data were used to pick the rule." },
      { id: "d", label: "It's fine as long as the hypothesis stayed the same", rationale: "The rules changed between the unlocks, guided by the first look. The hold-out is spent." },
    ],
    correct: "a",
    explanation: "An out-of-sample set tests a rule once. After you look, change the rule and look again, those data helped choose the rule. Report the result as in-sample and test on fresh data or forward.",
    lesson: "4.3.7",
    concepts: ["research-hygiene", "in-sample-out-of-sample"],
    hints: ["Did the out-of-sample data help choose the final rule?"],
  },
  {
    id: "q-4.3.7-3",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 1,
    prompt: "A published idea shows +0.24R per trade in your backtest. With a 50% decay haircut, what expectancy goes in your plan, in R?",
    numeric: { answer: 0.12, tolerance: 0.005, unit: "R" },
    explanation: "0.24 × (1 − 0.50) = 0.12R. Sizing, gates and kill criteria use 0.12R, not 0.24R.",
    lesson: "4.3.7",
    concepts: ["research-hygiene", "anomaly-decay"],
    hints: ["Cut the backtest figure by the haircut.", "0.24 × 0.5."],
    vary: {
      fields: { e: [0.1, 0.6, 0.02], h: [25, 75, 25] },
      answer: "round(e * (1 - h / 100), 3)",
      prompt: "A published idea shows +{e:2}R per trade in your backtest. With a {h}% decay haircut, what expectancy goes in your plan, in R?",
      explanation: "{e:2} × (1 − {h / 100:2}) = {answer:3}R. Sizing, gates and kill criteria use the planned figure.",
      hint: "{e:2} × {1 - h / 100:2}.",
    },
  },
];

// ─── Terms and concepts introduced in 4.3 ──────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "family-wise-error-rate",
    term: "Family-wise error rate",
    definition: "The probability of at least one false discovery across a whole set of tests. Bonferroni keeps it at or below the chosen level by dividing the threshold by the number of tests.",
    plain: "The chance of at least one false discovery across a whole set of tests.",
    related: ["multiple-testing", "bonferroni-correction", "false-positive"],
    lesson: "4.3.1",
    aka: ["FWER"],
  },
  {
    id: "reality-check",
    term: "Reality Check",
    definition: "White's (2000) bootstrap test of whether the best of many rules tried on the same data beats a benchmark by more than the best of them would by luck alone.",
    plain: "A test of whether the best of many tried rules is better than luck.",
    related: ["bootstrap", "multiple-testing", "spa-test"],
    lesson: "4.3.1",
    aka: ["White's Reality Check"],
  },
  {
    id: "spa-test",
    term: "SPA test",
    definition: "Hansen's (2005) test for superior predictive ability, a refinement of the Reality Check that stops very poor rules in the family from diluting the test.",
    plain: "A sharper version of the Reality Check.",
    related: ["reality-check", "bootstrap"],
    lesson: "4.3.1",
    aka: ["superior predictive ability test"],
  },
  {
    id: "sharpe-haircut",
    term: "Sharpe haircut",
    definition: "A reduction of a backtest's Sharpe ratio for the number of tests behind it. Harvey and Liu show it is nonlinear: marginal Sharpe ratios are cut hard, high ones only moderately.",
    plain: "A cut to a backtest's Sharpe ratio for how many tests were tried.",
    related: ["sharpe-ratio", "multiple-testing", "deflated-sharpe-ratio"],
    lesson: "4.3.1",
  },
  {
    id: "selection-bias",
    term: "Selection bias",
    definition: "Distortion from keeping only the best-looking results out of many: the selected result is inflated by the luck that got it selected.",
    plain: "Keeping only the best-looking results, which makes them look better than they are.",
    related: ["winners-curse", "multiple-testing", "survivorship-bias"],
    lesson: "4.3.1",
  },
  {
    id: "expected-maximum-sharpe",
    term: "Expected maximum Sharpe",
    definition: "The best Sharpe ratio expected from N trials with no edge, by luck alone: about 1.57, 2.28 and 2.53 times the trials' Sharpe spread for N = 10, 50 and 100.",
    plain: "The best Sharpe ratio luck alone would give N trials.",
    related: ["sharpe-ratio", "deflated-sharpe-ratio", "selection-bias"],
    lesson: "4.3.2",
    aka: ["E[max]"],
  },
  {
    id: "probabilistic-sharpe-ratio",
    term: "Probabilistic Sharpe ratio",
    definition: "The probability that a strategy's true Sharpe ratio exceeds a benchmark, given the measured Sharpe, the number of observations, skewness and kurtosis.",
    plain: "The chance that the true Sharpe ratio beats a chosen benchmark.",
    related: ["sharpe-ratio", "skew", "kurtosis", "deflated-sharpe-ratio"],
    lesson: "4.3.2",
    aka: ["PSR"],
  },
  {
    id: "deflated-sharpe-ratio",
    term: "Deflated Sharpe ratio",
    definition: "A probabilistic Sharpe ratio whose benchmark is the expected maximum Sharpe of all the trials run, so it corrects for selection as well as for non-normal returns.",
    plain: "The chance a Sharpe ratio beats the best that luck gives all your trials.",
    related: ["probabilistic-sharpe-ratio", "expected-maximum-sharpe", "trial-count"],
    lesson: "4.3.2",
    aka: ["DSR"],
  },
  {
    id: "minimum-backtest-length",
    term: "Minimum backtest length",
    definition: "The years of data needed before the best of N zero-edge trials is no longer expected to reach a target Sharpe ratio: (E[max] ÷ target)².",
    plain: "How many years a backtest needs before its Sharpe ratio beats what luck gives N trials.",
    related: ["expected-maximum-sharpe", "track-record-length", "trial-count"],
    lesson: "4.3.3",
    aka: ["MinBTL"],
  },
  {
    id: "sharpe-standard-error",
    term: "Sharpe standard error",
    definition: "The typical error of a measured Sharpe ratio: √((1 + SR²/2) ÷ n) for independent returns, in the data's own frequency. For an annual Sharpe from daily data, about 1 ÷ √years.",
    plain: "How far a measured Sharpe ratio may be from the true one; it shrinks with the square root of years.",
    related: ["standard-error", "sharpe-ratio", "track-record-length"],
    lesson: "4.3.3",
  },
  {
    id: "track-record-length",
    term: "Track record length",
    definition: "How long a strategy's results have been measured. The error bars on its statistics shrink only with the square root of that length.",
    plain: "How long results have been measured; longer records give tighter estimates.",
    related: ["sharpe-standard-error", "sample-size", "minimum-backtest-length"],
    lesson: "4.3.3",
  },
  {
    id: "probability-of-backtest-overfitting",
    term: "Probability of backtest overfitting",
    definition: "The share of in-sample/out-of-sample splits in which a strategy family's in-sample winner ranks at or below the median out of sample, estimated by CSCV.",
    plain: "How often the best in-sample variant ranks in the bottom half out of sample.",
    related: ["cscv", "strategy-family", "overfitting"],
    lesson: "4.3.4",
    aka: ["PBO"],
  },
  {
    id: "cscv",
    term: "CSCV",
    definition: "Combinatorially symmetric cross-validation: cut the data into S blocks and test every way of using half of them in-sample and the rest out of sample. Eight blocks give 70 splits.",
    plain: "Testing every way to split data blocks into in-sample and out-of-sample halves.",
    related: ["probability-of-backtest-overfitting", "cross-validation", "in-sample"],
    lesson: "4.3.4",
    aka: ["combinatorially symmetric cross-validation"],
  },
  {
    id: "strategy-family",
    term: "Strategy family",
    definition: "All the variants of one idea tried during research, such as every parameter setting, filter or lookback. Overfitting tests judge the family, not only its winner.",
    plain: "All the variants of one idea that you tried.",
    related: ["trial-count", "probability-of-backtest-overfitting", "data-snooping"],
    lesson: "4.3.4",
  },
  {
    id: "cross-validation",
    term: "Cross-validation",
    definition: "Testing a model in turns on parts of the data (folds) it was not fitted on, then combining the scores.",
    plain: "Testing a model, in turns, on parts of the data it wasn't fitted on.",
    related: ["out-of-sample", "data-leakage", "purging"],
    lesson: "4.3.5",
  },
  {
    id: "data-leakage",
    term: "Data leakage",
    definition: "Information from the test period reaching training, for example through labels that overlap the test days, so scores look better than they are.",
    plain: "Test information slipping into training, which makes results look too good.",
    related: ["look-ahead-bias", "cross-validation", "purging"],
    lesson: "4.3.5",
  },
  {
    id: "purging",
    term: "Purging",
    definition: "Removing from training every observation whose label window overlaps the test period.",
    plain: "Dropping training days whose labels overlap the test period.",
    related: ["embargo-period", "data-leakage", "cross-validation"],
    lesson: "4.3.5",
  },
  {
    id: "embargo-period",
    term: "Embargo period",
    definition: "A gap after each test fold kept out of training. It covers the days that fed the last test labels and share their serial correlation.",
    plain: "A gap after the test period kept out of training to block leakage.",
    related: ["purging", "autocorrelation", "data-leakage"],
    lesson: "4.3.5",
    aka: ["embargo"],
  },
  {
    id: "strategy-capacity",
    term: "Strategy capacity",
    definition: "The trading size a strategy can carry before impact and costs erode its edge. Total profit peaks well before the edge per unit reaches zero.",
    plain: "How much size a strategy can carry before costs and impact eat its edge.",
    related: ["marginal-profit", "square-root-law", "crowding"],
    lesson: "4.3.6",
  },
  {
    id: "marginal-profit",
    term: "Marginal profit",
    definition: "The extra total profit from trading one more unit. Total profit peaks where marginal profit falls to zero.",
    plain: "The extra profit from trading one more unit.",
    related: ["strategy-capacity"],
    lesson: "4.3.6",
  },
  {
    id: "trial-count",
    term: "Trial count",
    definition: "The number of configurations, variants and ideas tried on the same data during research, abandoned ones included. Every honest backtest report states it.",
    plain: "How many variants and tests you tried; every honest report states it.",
    related: ["research-log", "multiple-testing", "deflated-sharpe-ratio"],
    lesson: "4.3.7",
    aka: ["N"],
  },
  {
    id: "validation-dossier",
    term: "Validation dossier",
    definition: "A fixed-format report of one strategy's hypothesis, tests, trial count, DSR, MinBTL, PBO, capacity, decay haircut and verdict, judged against thresholds set in advance.",
    plain: "A fixed report of all tests, thresholds and the verdict for one strategy.",
    related: ["pre-registration", "research-log", "trial-count"],
    lesson: "4.3.7",
  },
  {
    id: "decay-haircut",
    term: "Decay haircut",
    definition: "A planned cut to backtest expectancy that allows for edges weakening after discovery. The app plans published ideas at no more than half their backtest figure.",
    plain: "A planned cut to backtest expectancy because edges tend to fade.",
    related: ["sharpe-haircut", "validation-dossier"],
    lesson: "4.3.7",
  },
];

const CONCEPTS: Concept[] = [
  {
    id: "reality-check-testing",
    name: "Testing the winner of a search",
    category: "decision_making",
    summary: "Judging the best of many tried rules against the best result expected with no edge (Reality Check, SPA, haircuts).",
    body: [
      "When you try many variants of an idea and keep the best, the winner was chosen partly for its luck. A single test of the winner is far too lenient, and Bonferroni, which assumes independent tests, is too strict when the variants are near-copies of each other.",
      "White's Reality Check (2000) resamples the returns of every rule tried, recentred to no edge, and records the best result each time; the real winner has to beat that distribution of lucky maxima. Hansen's SPA test (2005) refines it, and Harvey and Liu's haircut turns the same idea into a lower Sharpe ratio.",
    ],
    example:
      "200 momentum lookbacks on 3 years of random-walk data: the best beat t = 1.96 in 73% of 2,000 seeded searches and Bonferroni's 3.66 in only 1.3%. With 50 lookbacks, the Reality Check gave a random-walk winner of |t| 2.07 p = 0.40, and a trend-regime winner of 3.45 p = 0.033.",
    related: ["multiple-testing", "statistical-significance", "data-snooping"],
    missions: ["M02"],
    lessons: ["4.3.1"],
  },
  {
    id: "deflated-sharpe-ratio",
    name: "Deflated Sharpe ratio",
    category: "decision_making",
    summary: "The probability that a strategy's true Sharpe beats the best Sharpe expected by luck from all the trials run.",
    body: [
      "The best of N trials with no edge shows a Sharpe ratio well above zero: about 1.57 times the trials' Sharpe spread at N = 10 and 2.28 at 50. The deflated Sharpe ratio uses that expected maximum as the benchmark and asks how likely the true Sharpe is to beat it, allowing for track length, skew and fat tails (Bailey and López de Prado, 2014).",
      "A DSR of 0.95 or more is the usual convention for a result unlikely to be a fluke. The threshold is a convention, not part of the derivation, and the DSR is only as honest as the trial count behind it.",
    ],
    example:
      "Best of 50 backtests, annual Sharpe 1.5 over 3 years of daily data, trials' Sharpe spread 0.5, skew −0.5, kurtosis 5. Benchmark 2.28 × 0.5 = 1.14. PSR against zero 0.994; DSR 0.73. At 421 trials the DSR falls to 0.50.",
    related: ["probabilistic-sharpe-ratio", "sharpe-ratio", "multiple-testing", "reality-check-testing"],
    missions: [],
    lessons: ["4.3.2"],
  },
  {
    id: "probabilistic-sharpe-ratio",
    name: "Probabilistic Sharpe ratio",
    category: "decision_making",
    summary: "The probability that the true Sharpe exceeds a benchmark, given track length, skewness and kurtosis.",
    body: [
      "PSR = Φ[(SR − SR*) × √(T − 1) ÷ √(1 − skew × SR + (kurtosis − 1) ÷ 4 × SR²)], with the Sharpe ratio in the data's own frequency and T observations. A longer record raises it; negative skew and fat tails lower it at the same Sharpe.",
    ],
    example: "Daily Sharpe 0.0945 (1.5 a year) over 756 days, skew −0.5, kurtosis 5: PSR against zero = Φ(2.53) = 0.994. With skew +0.5 it would be 0.996.",
    related: ["sharpe-ratio", "skewness", "fat-tails", "deflated-sharpe-ratio"],
    missions: [],
    lessons: ["4.3.2"],
  },
  {
    id: "minimum-backtest-length",
    name: "Minimum backtest length",
    category: "decision_making",
    summary: "The data length needed so the best of N zero-edge trials is not expected to reach a target Sharpe by luck.",
    body: [
      "The best of N zero-edge configurations shows an annual Sharpe near E[max] ÷ √years. It stays above a target Sharpe until the years exceed (E[max] ÷ target)²: the minimum backtest length (Bailey, Borwein, López de Prado and Zhu, 2014). A simpler upper bound is 2 × ln(N) ÷ target².",
      "Read it the other way round as a cap: the data you have limit how many configurations you may try. It is a necessary condition, not proof of an edge.",
    ],
    example:
      "Target Sharpe 1: 7 tries need 1.9 years, 45 need 5.0, 100 need 6.4 and 1,000 need 10.6. With 4 years of data, at most 25 independent configurations. Seeded check: the best of 45 zero-edge configurations over 5 years averaged 0.99.",
    related: ["deflated-sharpe-ratio", "sharpe-ratio-uncertainty", "multiple-testing"],
    missions: [],
    lessons: ["4.3.3"],
  },
  {
    id: "sharpe-ratio-uncertainty",
    name: "Sharpe ratio error bars",
    category: "decision_making",
    summary: "The confidence interval around a measured Sharpe ratio, which narrows only with the square root of track length.",
    body: [
      "For independent returns, the standard error of a Sharpe ratio is √((1 + SR²/2) ÷ n) in the data's own frequency (Lo, 2002). For an annual Sharpe from daily data that is about 1 ÷ √years, so a 95% interval is the Sharpe ± 1.96 ÷ √years.",
      "Autocorrelation breaks the simple scaling. Multiplying a monthly Sharpe by √12 is right only in special cases, and Lo found hedge fund Sharpe ratios overstated by as much as 65%.",
    ],
    example:
      "A Sharpe of 1.0 over 3 years: 95% interval −0.13 to 2.13; over 10 years, 0.38 to 1.62. Seeded daily histories gave −0.14 to 2.16 and 0.38 to 1.62. Monthly returns with autocorrelation +0.3: √12 overstates the annual Sharpe by about 32%.",
    related: ["sharpe-ratio", "autocorrelation", "statistical-significance"],
    missions: [],
    lessons: ["4.3.3"],
  },
  {
    id: "backtest-overfitting-probability",
    name: "Probability of backtest overfitting",
    category: "decision_making",
    summary: "The share of in-sample/out-of-sample splits in which the in-sample winner ranks at or below the median out of sample.",
    body: [
      "CSCV (Bailey, Borwein, López de Prado and Zhu, 2017) cuts the returns of every variant in a family into S blocks, tries every way of using half of them in-sample, picks the in-sample winner and records its out-of-sample rank. PBO is the share of splits where that rank falls to the median or below.",
      "On pure noise the winner is a coin toss out of sample, so PBO sits near 0.5. A low PBO says the selection carries over; it doesn't prove the edge, which DSR and the other tests judge. The app's convention: 0.50 or more reject, 0.20 to 0.50 incubate, under 0.20 continue.",
    ],
    example:
      "8 blocks give 70 splits. A family of 10 lookbacks, each traded with and against the move, averaged a PBO of 0.50 over 1,000 seeded random-walk series and 0.105 on a trend regime with a real edge. 49 of 70 splits with λ ≤ 0 is a PBO of 70%.",
    related: ["overfitting", "walk-forward-analysis", "in-sample-out-of-sample"],
    missions: ["M02"],
    lessons: ["4.3.4"],
  },
  {
    id: "purged-cross-validation",
    name: "Purged cross-validation",
    category: "decision_making",
    summary: "Time-series cross-validation that removes overlapping labels and adds an embargo so test information cannot leak into training.",
    body: [
      "When each day's label is built from the days that follow, neighbouring days share most of their labels. Shuffled k-fold cross-validation then trains on near-copies of the test labels and scores well even on noise.",
      "Purging drops training days whose labels overlap the test period; an embargo also drops the days just after each fold. López de Prado (2018) combines them in combinatorial purged cross-validation, which yields many backtest paths.",
    ],
    example:
      "10-day labels, test fold days 401–500: purge 391–400, embargo 501–510. On 300 seeded random-walk series, a 5-nearest-neighbour model scored 56.0% with shuffled folds and 50.0% with purged, embargoed folds.",
    related: ["look-ahead-bias", "autocorrelation", "in-sample-out-of-sample"],
    missions: [],
    lessons: ["4.3.5"],
  },
  {
    id: "strategy-capacity",
    name: "Strategy capacity",
    category: "position_sizing",
    summary: "The size at which market impact erodes an edge; total profit peaks well before the edge reaches zero.",
    body: [
      "Impact grows with the square root of size relative to volume, so the net edge per unit falls as size rises. Total profit, size times net edge, rises, peaks where marginal profit is zero, then falls to zero where the edge is gone.",
      "Crowding shrinks capacity from outside: others trading the same signal add their size to your impact. For a small account the practical lesson is not to scale a thin edge into illiquid instruments.",
    ],
    example:
      "Gross 40 bps, fixed costs 10 bps, round-trip impact 400 × √(Q ÷ V) bps with V = 2,000,000: 396 vUSD per trade at 2,500 units, a peak of 500 at 5,000, 172 at 10,000 and zero at 11,250. A twin fund trading 5,000 alongside cuts the 500 to 86.",
    related: ["square-root-impact", "trading-costs", "strategy-crowding", "anomaly-decay"],
    missions: [],
    lessons: ["4.3.6"],
  },
  {
    id: "research-hygiene",
    name: "Validation dossier and pre-registration",
    category: "decision_making",
    summary: "Fixing thresholds, haircuts and verdict criteria before out-of-sample results, then reporting every trial in a fixed dossier.",
    body: [
      "The validation dossier runs from the hypothesis through rules, costs, in-sample and out-of-sample tests, walk-forward, Monte Carlo, the R0 control, the trial count, DSR, MinBTL, PBO, capacity and the decay haircut to a verdict: deploy to a forward test, incubate longer, or reject.",
      "Pre-registration fixes the thresholds and verdict rules before the out-of-sample unlock, so results can't move the bar. A second unlock, unlogged sweeps, a hypothesis written after the results or a survivors-only universe make a result unreportable. A justified reject is a good outcome.",
    ],
    example:
      "Rules: deploy needs DSR ≥ 0.95 and PBO < 0.20; reject if DSR < 0.50 or PBO ≥ 0.50. A dossier with 40 trials, Sharpe 1.2 over 5 years, DSR 0.76, PBO 0.14 and MinBTL 3.3 years: incubate longer. A published idea's +0.30R backtest enters the plan as +0.15R.",
    related: ["research-log", "edge-hypothesis", "incubation", "anomaly-decay"],
    missions: ["M10"],
    lessons: ["4.3.7"],
  },
];

export const UNIT_4_3: UnitContent = {
  lessons: [L_4_3_1, L_4_3_2, L_4_3_3, L_4_3_4, L_4_3_5, L_4_3_6, L_4_3_7],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
