import type { CandleData, ChartLayer, Concept, GlossaryTerm, Lesson, Question, UnitContent } from "../../types";

/**
 * Unit 3.10 · Statistics for traders (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce.
 * Every simulated figure comes from seeded scripts (mulberry32 PRNG, Box–Muller normals; fat tails = Student-t with 3 degrees
 * of freedom scaled to the same volatility). Exact values (normal and t tails, Bayes trees, runs-test moments) are computed,
 * Monte Carlo values are quoted as the runs produced them.
 */

const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });
/** Empty slots for figures that draw only their layers. */
const slots = (n: number, price: number): CandleData[] => Array.from({ length: n }, () => k(price, price, price, price));
/** A line drawn only between two slot indexes (inclusive); null elsewhere. */
const segment = (values: number[], from: number, to: number): (number | null)[] => values.map((v, i) => (i >= from && i <= to ? v : null));

// ─── Data ──────────────────────────────────────────────────────────────────

/**
 * 3.10.2 B3: the one-sigma cone at 1.00 a day from 100.00 (100 ± √t), and a seeded path (seed 936) with the same shocks:
 * calm throughout (inside the cone on 42 of 60 days), and with volatility 2.50 from day 31 (outside on 21 of days 31–60).
 * Over 10,000 seeded paths: 68.2% of calm path-days inside; 52.8% of switched days 31–60 outside.
 */
const CONE_UP = [
  100, 101, 101.41, 101.73, 102, 102.24, 102.45, 102.65, 102.83, 103, 103.16, 103.32, 103.46, 103.61, 103.74, 103.87, 104, 104.12, 104.24, 104.36, 104.47, 104.58, 104.69, 104.8, 104.9, 105,
  105.1, 105.2, 105.29, 105.39, 105.48, 105.57, 105.66, 105.74, 105.83, 105.92, 106, 106.08, 106.16, 106.24, 106.32, 106.4, 106.48, 106.56, 106.63, 106.71, 106.78, 106.86, 106.93, 107,
  107.07, 107.14, 107.21, 107.28, 107.35, 107.42, 107.48, 107.55, 107.62, 107.68, 107.75,
];
const CONE_LO = [
  100, 99, 98.59, 98.27, 98, 97.76, 97.55, 97.35, 97.17, 97, 96.84, 96.68, 96.54, 96.39, 96.26, 96.13, 96, 95.88, 95.76, 95.64, 95.53, 95.42, 95.31, 95.2, 95.1, 95, 94.9, 94.8, 94.71,
  94.61, 94.52, 94.43, 94.34, 94.26, 94.17, 94.08, 94, 93.92, 93.84, 93.76, 93.68, 93.6, 93.52, 93.44, 93.37, 93.29, 93.22, 93.14, 93.07, 93, 92.93, 92.86, 92.79, 92.72, 92.65, 92.58,
  92.52, 92.45, 92.38, 92.32, 92.25,
];
const CONE_CALM = [
  100, 100.51, 99.27, 98.24, 98.36, 97.88, 97.83, 98.35, 97.16, 97.53, 96.38, 95.97, 94.48, 94.5, 95.67, 94.45, 96.27, 97.9, 97.56, 98.63, 98.1, 99.2, 100.4, 99.42, 98.9, 98.63, 99.65,
  101.43, 102.32, 101.84, 104.13, 104.2, 106.46, 106.95, 105.53, 106.62, 105.71, 105.72, 105.11, 105.91, 106.06, 105.47, 104.24, 103.91, 104.28, 104.12, 103.21, 102.65, 104.52, 106.65,
  105.14, 107.04, 107.49, 107.64, 106.55, 107.33, 108.47, 109.14, 108.09, 108.4, 109.31,
];
const CONE_SWITCH = [
  100, 100.51, 99.27, 98.24, 98.36, 97.88, 97.83, 98.35, 97.16, 97.53, 96.38, 95.97, 94.48, 94.5, 95.67, 94.45, 96.27, 97.9, 97.56, 98.63, 98.1, 99.2, 100.4, 99.42, 98.9, 98.63, 99.65,
  101.43, 102.32, 101.84, 104.13, 104.29, 109.96, 111.18, 107.62, 110.35, 108.07, 108.1, 106.57, 108.58, 108.94, 107.47, 104.4, 103.57, 104.51, 104.1, 101.83, 100.43, 105.1, 110.42,
  106.64, 111.39, 112.53, 112.9, 110.18, 112.13, 114.98, 116.64, 114.02, 114.81, 117.08,
];

/**
 * 3.10.3 hook and B3: 50 zero-skill traders, monthly result −0.5% (costs) + 7% × noise (seed 46). Month-1 top five and the
 * same five in month 2, drawn as bars from 0. Month-1 average +12.07%, month 2 −1.07%; month-2 ranks 25, 44, 9, 27, 19 of 50;
 * whole group in month 2: −1.68%. Over 10,000 runs: top five +11.45% in month 1, −0.53% in month 2.
 */
const bar = (v: number): CandleData => k(0, Math.max(0, v), Math.min(0, v), v);
const ROOKIE: CandleData[] = [16.9, 13.8, 11.5, 10, 8.2, -0.5, -8.6, 3.9, -0.8, 0.6].map(bar);

/**
 * 3.10.4 B4: belief (%) that a setup has an edge, after each of 150 trades, from a 10% prior. Payoff +1.5R / −1R; "edge" wins
 * 50% of trades, "no edge" 40%. Seed 16 trades a real edge (12 wins of 20 → 27.3%; 19 of 44 → 7.5%; 75 of 150 → 70.4%);
 * seed 106 trades no edge (61 wins of 150 → 0.8%). Over 10,000 seeded real edges, the belief was above 50% at trade 150 in 65.2%.
 */
const BELIEF_EDGE = [
  10, 8.5, 10.4, 8.8, 10.8, 13.1, 15.9, 13.6, 11.6, 14.1, 12, 14.6, 17.6, 21, 25, 21.7, 18.8, 22.4, 26.5, 23.1, 27.3, 23.9, 28.1, 24.6, 21.4, 25.4, 22.1, 19.1, 16.4, 19.7, 23.5, 20.4,
  24.3, 21.1, 18.2, 15.6, 18.8, 16.2, 13.9, 11.8, 14.4, 12.3, 10.4, 8.8, 7.5, 9.2, 11.2, 9.5, 8.1, 9.9, 12.1, 14.6, 17.6, 15.1, 18.2, 15.7, 18.9, 22.5, 26.6, 31.2, 27.4, 24, 28.3, 33,
  38.1, 43.5, 39.1, 44.5, 50, 45.5, 41, 46.5, 42, 37.6, 43, 38.6, 34.4, 39.6, 45, 50.6, 46, 51.6, 47.1, 42.5, 38.2, 43.5, 49.1, 44.6, 40.1, 35.8, 41.1, 36.8, 32.6, 37.7, 43.1, 48.6, 44.1,
  49.6, 55.2, 50.7, 56.2, 61.6, 57.2, 62.6, 58.2, 63.5, 68.5, 64.5, 60.2, 55.7, 61.1, 56.7, 52.2, 57.7, 53.2, 58.7, 64, 69, 73.5, 77.6, 81.3, 78.3, 81.9, 79, 75.9, 72.4, 76.6, 80.4,
  83.6, 86.5, 84.2, 86.9, 89.3, 87.4, 89.7, 87.8, 85.8, 83.4, 80.7, 77.7, 74.4, 70.8, 66.8, 62.7, 67.7, 72.4, 68.6, 73.2, 69.5, 74, 70.4,
];
const BELIEF_NONE = [
  10, 12.2, 10.4, 12.6, 10.8, 13.1, 11.2, 9.5, 8, 9.8, 12, 10.2, 8.6, 10.6, 9, 11, 9.3, 7.9, 6.7, 5.6, 4.7, 5.8, 4.9, 6.1, 7.5, 9.2, 11.2, 13.6, 11.6, 9.9, 12, 14.6, 12.5, 10.6, 9, 7.6,
  9.3, 7.9, 9.7, 11.8, 14.4, 12.3, 10.4, 8.8, 10.8, 9.2, 7.8, 6.6, 8.1, 9.9, 12.1, 10.2, 8.7, 7.3, 6.2, 5.2, 4.4, 3.7, 3.1, 2.6, 2.2, 2.7, 2.3, 1.9, 2.3, 2, 2.4, 3, 2.5, 2.1, 2.6, 3.3,
  4.1, 5, 4.2, 5.2, 6.5, 7.9, 9.7, 8.2, 7, 8.6, 7.2, 6.1, 7.5, 9.2, 7.8, 9.6, 8.1, 9.9, 8.4, 10.3, 12.6, 10.7, 13, 15.7, 18.9, 16.3, 19.6, 23.3, 20.2, 17.4, 15, 12.8, 10.9, 9.2, 7.8,
  6.6, 5.6, 6.9, 8.4, 10.3, 8.8, 7.4, 6.2, 5.3, 4.4, 3.7, 3.1, 2.6, 2.2, 1.8, 2.3, 2.8, 3.5, 4.3, 3.6, 4.5, 3.8, 3.2, 2.7, 2.2, 1.9, 1.6, 1.9, 1.6, 1.4, 1.1, 0.9, 1.2, 1, 1.2, 1, 1.3,
  1.1, 0.9, 1.1, 1.4, 1.2, 1, 0.8,
];

/**
 * 3.10.6 B3: 48 monthly LABX returns (%), mean 0.5%, sd 4% (seed 25), and the best-matching of 100 random series over months
 * 1–24 (series 34), rescaled to LABX's spread for drawing. Correlation 0.52 in months 1–24, 0.00 in months 25–48.
 * Over 1,000 such searches: best in-sample correlation 0.50 on average, out of sample 0.00.
 */
const SPUR_LABX = [
  2.44, -3.06, 0.33, -3.71, 5.58, 4.46, -4.48, 2.05, 0.46, 6.41, 6.88, 2.47, 2.62, 4.51, -0.14, 3.49, -4.89, 4.58, 4.86, -1.96, 2.27, -0.35, 2.77, -0.82, 6.07, 8.44, -5.37, -1.78, 2.92,
  8.5, 3.55, 2.46, -0.27, 1.25, -1.61, 1.73, -3.83, 5.58, 1.33, 2.03, -4.04, -1.58, 2.74, -1.36, 5.94, -2.05, -2.83, -1.56,
];
const SPUR_SERIES = [
  2.76, -2.76, 4.11, -3.87, 3.97, -1.05, -4.07, 1.29, 0.75, 2.5, 12.21, 3.9, -1.58, 1.6, 1.5, -1.01, 1.62, 4.71, 1.61, 1.32, -2.11, 2.92, 3.03, 3.45, 3.39, 2.02, -0.16, 5.28, 7.15, -3.72,
  2.11, 2.78, 1.71, -3.65, -0.48, 2.82, -4.21, 3.56, 2.39, 13.93, 1.52, -0.51, 8.21, -1.5, 2.02, 10.43, 8.86, 5.47,
];

/**
 * 3.10.7 hook and B1: 41 daily returns (%, 1% volatility) of three AR(1) markets, plotted as today's return against yesterday's.
 * A: random walk (φ 0, seed 5031), lag-1 autocorrelation −0.003. B: trending (φ +0.5, seed 5516), +0.49. C: mean-reverting
 * (φ −0.5, seed 4512), −0.51. Each panel spans 21 slots: yesterday's return from −2.5% to +2.5% in steps of 0.25%.
 */
const AR_RANDOM = [-0.99, 0.93, 0, -0.49, -1.03, -1.13, 0.4, 0.17, 0.58, -0.06, 1.46, 2.01, -0.68, -0.47, -0.12, 1.39, -0.94, 0.53, 0.36, -0.07, -1.19, -0.72, 2.46, 0.85, 0.5, -0.49, 0.76, 0.73, -1.4, 0.73, 0.05, 0.81, 1.32, -1.19, 0.03, -2.11, 0.13, 0.32, -0.75, -1.04, -0.15];
const AR_TREND = [1.41, 1.09, 0.88, 0.27, -0.46, -0.81, 0.03, 0.85, 1.46, 1.87, 1.03, 0.56, 0.09, -0.37, 0.53, 0.39, 0, 0.14, -0.29, -0.13, 0.4, 0.26, 0.12, 0.7, 1.55, 1.86, -0.27, 0.19, -1.58, -1.47, 0.82, 2.26, 0.89, -0.16, -0.18, 1.04, -1.54, -0.86, -0.71, -0.71, -0.72];
const AR_REVERT = [0.58, -1.03, 0.88, -0.86, 0.22, 0.91, -0.56, 0.18, 1.59, 0.09, -0.09, 0.52, 0.91, -1.55, 0.86, -0.15, 0.59, -1.2, -1.17, 2.09, -0.11, -0.14, -1.49, 0.63, 0.42, -0.07, -0.16, 2.45, -1.61, 1.05, -1.23, 0.33, -0.23, 1.19, 0.37, -2.02, 1.63, -0.37, 1.48, -1.59, 0.09];

/** One dot per day: yesterday's return picks the slot inside the panel, today's return is the height. */
const scatter = (xs: number[], panel: number): ChartLayer[] =>
  xs.slice(0, -1).map((x, i): ChartLayer => ({ kind: "marker", index: panel * 23 + Math.round((x + 2.5) * 4), price: xs[i + 1], role: "accent" }));
const SCATTER_LAYERS: ChartLayer[] = [
  { kind: "level", price: 0, role: "neutral", chip: false },
  { kind: "path", points: [{ index: 21.5, price: -2.7 }, { index: 21.5, price: 2.7 }], role: "neutral", dashed: true },
  { kind: "path", points: [{ index: 44.5, price: -2.7 }, { index: 44.5, price: 2.7 }], role: "neutral", dashed: true },
  { kind: "path", points: [{ index: 0, price: 2.6 }], label: "A" },
  { kind: "path", points: [{ index: 23, price: 2.6 }], label: "B" },
  { kind: "path", points: [{ index: 46, price: 2.6 }], label: "C" },
  ...scatter(AR_RANDOM, 0),
  ...scatter(AR_TREND, 1),
  ...scatter(AR_REVERT, 2),
];
const SCATTER = {
  candles: slots(67, 0),
  hideCandles: true,
  range: [-2.8, 2.9] as [number, number],
  layers: SCATTER_LAYERS,
  describe:
    "Three scatter plots of 40 days each: yesterday's return across, today's return up, in % at 1% daily volatility. In panel A the dots show no tilt; in panel B they tilt upward from left to right; in panel C they tilt downward.",
};

// ─── 3.10.1 · Distributions, skew and fat tails ────────────────────────────

const L_3_10_1: Lesson = {
  id: "3.10.1",
  title: "Distributions, skew and fat tails",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "An average hides the shape of results: the median, the spread, the skew and the tails decide how a system feels and how badly it can surprise you.",
  objectives: [
    "Describe a return or R distribution by its mean, median, spread, skew and tails.",
    "Estimate how often a five-sigma move appears under normal versus fat-tailed assumptions.",
    "Match strategy styles to their typical skew and the kind of pain each skew brings.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
    { kind: "check", ref: "risk_management", label: "Risk management check" },
  ],
  script: {
    unit: "3.10",
    courseId: "3.10.1",
    bridge: "In 3.9.6 you counted how often noise looks like a pattern; this unit gives you the tools behind that question. In 1.4.5 expectancy, one average, summed up a system. Here you look at the whole shape of results: median, spread, skew and tails.",
    hook: {
      prompt: "LABX moves 1% a day, one standard deviation. Under a normal, bell-curve model, how often should it fall five standard deviations in a single day?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "About once a year" },
          { id: "b", label: "About once a decade" },
          { id: "c", label: "About once a century" },
          { id: "d", label: "About once in 14,000 years" },
        ],
        answer: "d",
      },
      compare:
        "You picked {yours}. A normal model gives a five-sigma drop a chance of 2.9 in 10 million: once in 3.5 million trading days, about 13,800 years. A fat-tailed model with the same volatility: 16 per 10,000 days, once every 2.5 years.",
      concept: "fat-tails",
    },
    learn: [
      {
        kind: "explain",
        title: "More than an average",
        text: "A [[distribution]] shows how often each result occurs. Describe it by its centre (the mean, and the [[median]], the middle result), its spread (the [[standard-deviation|standard deviation]]), its [[skew]] (which side has the long tail) and its tails. Two systems with the same mean can feel nothing alike.",
      },
      {
        kind: "worked",
        title: "The reference system",
        lines: [
          "40% of trades win +2.5R; 60% lose −1R.",
          "Median: more than half the trades lose, so the middle trade is −1R.",
          "Spread: the standard deviation is 1.71R.",
          "Mean = 0.4 × 2.5 − 0.6 × 1 = ?",
        ],
        ask: {
          answer: 0.4,
          tolerance: 0.001,
          unit: "R",
          feedback: [
            { value: 1, text: "That's 0.4 × 2.5, the wins alone. Subtract the losses: 0.6 × 1." },
            { value: 1.5, text: "That's 2.5 − 1, as if wins and losses were equally common. Weight each by how often it happens." },
          ],
          correct: "Right. +0.40R a trade on average, while the typical trade loses 1R.",
        },
        after: "Mean above median is positive skew: rare big wins pull the average up. On most days this system feels like losing.",
        concept: "return-distribution",
      },
      {
        kind: "match",
        title: "Three styles, three shapes",
        prompt: "Match each style to the shape of its R results and the pain that comes with it.",
        pairs: [
          {
            left: "Trend follower",
            right: "Positive skew: many small losses, rare big wins. The pain: long losing streaks.",
            wrong: "A trend follower cuts losers fast and rides the rare big trend: many small losses, a few large wins.",
          },
          {
            left: "Mean reverter",
            right: "Negative skew: many small wins, an occasional big loss. The pain: one loss erases weeks.",
            wrong: "Fading stretched moves wins small and often, but a move that keeps going costs one large loss.",
          },
          {
            left: "Option seller",
            right: "Strong negative skew: steady premiums, then a loss many times larger. The pain: it may not show for years.",
            wrong: "Selling options collects a small premium most days; one large move costs many premiums at once.",
          },
        ],
        columns: ["Style", "Shape and pain"],
        correct: "Right. Skew decides which pain you live with: long dry spells, or calm broken by a large loss. The typical skew of each style comes from practitioner literature, not from one study.",
        concept: "skewness",
      },
      {
        kind: "figure",
        title: "Ten thousand days, two models",
        figure: {
          kind: "bars",
          bars: [
            { label: "Normal: beyond −3σ", value: 17, role: "neutral" },
            { label: "Fat-tailed: beyond −3σ", value: 68, role: "down" },
            { label: "Normal: beyond −4σ", value: 0, role: "neutral" },
            { label: "Fat-tailed: beyond −4σ", value: 30, role: "down" },
            { label: "Normal: beyond −5σ", value: 0, role: "neutral" },
            { label: "Fat-tailed: beyond −5σ", value: 16, role: "down" },
          ],
          unit: " days",
          steps: [
            "Two seeded runs of 10,000 days, both at 1% daily volatility. Drops beyond 3σ: 17 against 68.",
            "Beyond 4σ: none against 30. On average the models expect 0.3 and 31.",
            "Beyond 5σ: none against 16. Same volatility, very different tails.",
          ],
        },
        text: "The fat-tailed generator is a Student-t with 3 degrees of freedom, scaled to the same 1% volatility. It has more quiet days and far more extreme ones: higher [[kurtosis]], the measure of how heavy the tails are.",
        concept: "fat-tails",
      },
      {
        kind: "explain",
        title: "Markets have fat tails",
        text: "Mandelbrot (1963) found cotton price changes far from normal, with a tail parameter near 1.7 where a bell curve has 2; Fama found the same long tails in Dow 30 stocks. [[fat-tails|Fat tails]] cost you: stops get gapped through, bell-curve risk models understate losses, Kelly oversizes (3.12.3), and the Sharpe ratio flatters negative skew.",
      },
      {
        kind: "worked",
        title: "What the normal model expects",
        lines: [
          "LABX's own history: 58 of its last 10,000 days moved beyond 4σ, either way.",
          "Under a normal model, a day beyond 4σ, either way, has probability 0.0063%.",
          "Expected such days in 10,000 = 10,000 × 0.000063 = ?",
        ],
        ask: {
          answer: 0.63,
          tolerance: 0.02,
          unit: "days",
          feedback: [{ value: 63, text: "0.0063% is 0.000063, not 0.0063. Move the decimal point: 10,000 × 0.000063." }],
          correct: "Right. Less than one such day in 10,000, against LABX's 58.",
        },
        after: "The fat-tailed model expects about 62 such days in 10,000.",
        concept: "fat-tails",
      },
      {
        kind: "predict",
        title: "Which model is LABX?",
        prompt: "LABX had 58 days beyond 4σ in 10,000. Seeded runs of the same length: the normal generator 0, the fat-tailed one 59. Which describes LABX?",
        control: {
          kind: "choice",
          choices: [
            { id: "normal", label: "The normal model: 58 is bad luck", feedback: "The normal model expects 0.63 such days. Even 3 would turn up in under 3% of 10,000-day samples; 58 is not luck." },
            { id: "fat", label: "The fat-tailed model" },
            { id: "neither", label: "Neither: you need more data", feedback: "10,000 days settle this one: the two models disagree by a factor of about 100." },
          ],
          answer: "fat",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "LABX history", value: 58, role: "accent" },
            { label: "Fat-tailed run", value: 59, role: "down" },
            { label: "Normal run", value: 0, role: "neutral" },
          ],
          unit: " days",
          steps: ["Days beyond 4σ, either way, out of 10,000."],
        },
        reveal: "The fat-tailed model. LABX's 58 sits beside its 59 and the 62 it expects on average. Plan for gaps through your stop, and for days a bell curve calls impossible.",
        concept: "fat-tails",
      },
    ],
    check: ["q-3.10.1-1", "q-3.10.1-2", "q-3.10.1-3"],
    recap: {
      takeaways: [
        "Describe results by mean, median, spread, skew and tails: here +0.40R mean, −1R median.",
        "A normal model expects a 5σ drop once in 13,800 years; fat tails, every 2.5 years.",
        "Trend following has positive skew and long dry spells; mean reversion and option selling, rare big losses.",
      ],
      next: "Next, 3.10.2: volatility, the spread of returns, how it scales with time and why it comes in clusters.",
    },
  },
};

// ─── 3.10.2 · Volatility: measure, scale, cluster ──────────────────────────

const L_3_10_2: Lesson = {
  id: "3.10.2",
  title: "Volatility: measure, scale, cluster",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Volatility scales with the square root of time when days are independent, but it comes in clusters, so an estimate from a calm window fails when the regime switches.",
  objectives: [
    "Compute volatility from returns and scale it with the square root of time.",
    "Explain volatility clustering and why an estimate from a calm window fails after a regime switch.",
    "Distinguish realised volatility from implied volatility.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "low_volatility", label: "Arena: low volatility" },
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
  ],
  script: {
    unit: "3.10",
    courseId: "3.10.2",
    bridge: "In 3.10.1 the standard deviation measured the spread of results; in 2.4.6 ATR measured price moves; in 3.9.3 you divided the VIX by √12. Here you scale volatility with the square root of time, and see why calm estimates fail when it clusters.",
    hook: {
      prompt: "LABX moves about 1% a day, one standard deviation. Roughly how much is that over a year of 252 trading days?",
      control: {
        kind: "slider",
        min: 1,
        max: 100,
        step: 1,
        unit: "%",
        start: 1,
        answer: 16,
        tolerance: 1,
        feedback: [
          { from: 1, to: 14, text: "Too low. Over 252 days the moves add up, even though many cancel: 1% × √252 = 15.9%." },
          { from: 18, to: 40, text: "A little high. Up and down days partly cancel, so a year is 1% × √252 = 15.9%." },
          { from: 41, to: 100, text: "That adds the days as if each moved the same way. Ups and downs cancel; volatility grows with √252, about 15.9." },
        ],
      },
      compare: "You answered {yours}%. Over 252 independent days, volatility grows with the square root of time: 1% × √252 = 15.9% a year.",
      concept: "square-root-of-time",
    },
    learn: [
      {
        kind: "explain",
        title: "Measure, then scale",
        text: "[[realised-volatility|Realised volatility]] is the standard deviation of past returns, usually daily. When each day is independent of the last, variances add up, so volatility grows with the square root of the number of days: the [[square-root-of-time-rule|square-root-of-time rule]]. Scaled to 252 trading days, it's the [[annualised-volatility|annualised volatility]].",
        figure: {
          kind: "formula",
          boxes: [{ text: "Daily volatility" }, { text: "√ days" }, { text: "Volatility over the period" }],
          operators: ["×", "="],
          steps: ["Start from one day's standard deviation.", "Multiply by the square root of the days, not by the days.", "1% × √252 = 15.9% a year."],
        },
      },
      {
        kind: "worked",
        title: "A week and a year",
        lines: ["Daily 1%: weekly = 1% × √5 = 2.24%; yearly = 1% × √252 = 15.9%.", "LABZ moves 0.8% a day. √5 = 2.236.", "LABZ's weekly volatility = 0.8% × 2.236 = ?"],
        ask: {
          answer: 1.79,
          tolerance: 0.01,
          unit: "%",
          feedback: [{ value: 4, text: "That's 0.8% × 5, as if every day moved the same way. Multiply by √5, not 5." }],
          correct: "Right. 0.8% × 2.236 = 1.79% a week.",
        },
        concept: "square-root-of-time",
      },
      {
        kind: "figure",
        title: "The cone",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(61, 100),
            hideCandles: true,
            range: [90, 120],
            describe:
              "A one-sigma cone from 100.00, widening to 92.25–107.75 by day 60. A calm path stays inside on 42 of 60 days. A path with the same shocks but 2.5 times the volatility from day 31 ends at 117.08, outside on 21 of the last 30 days.",
          },
          steps: [
            {
              text: "The one-sigma cone at 1.00 a day: 100.00 ± √days. Day 60: 92.25 to 107.75.",
              layers: [
                { kind: "line", values: CONE_UP, role: "concept", dashed: true },
                { kind: "line", values: CONE_LO, role: "concept", dashed: true },
              ],
            },
            { text: "A seeded calm path sits inside on 42 of 60 days: 70%, near the 68% expected.", layers: [{ kind: "line", values: CONE_CALM, role: "accent", label: "Calm" }] },
            {
              text: "Same shocks, but volatility jumps to 2.50 from day 31: outside on 21 of the last 30 days.",
              layers: [{ kind: "line", values: segment(CONE_SWITCH, 30, 60), role: "down", label: "Switch" }],
            },
            { text: "Over 10,000 seeded paths: 32% of days outside when calm, 53% after the switch." },
          ],
        },
        text: "The cone holds only while volatility stays where you measured it. Same shocks, bigger volatility: price leaves the old cone far more often.",
        concept: "square-root-of-time",
      },
      {
        kind: "explain",
        title: "Volatility comes in clusters",
        text: "Big moves bunch together: [[volatility-clustering]]. In a seeded 5,000-day clustering market, today's return said nothing about tomorrow's direction (correlation −0.02), but the day after one of the biggest 5% of moves averaged 1.49 times the usual size. In an independent market of the same size, 1.03 times.",
      },
      {
        kind: "predict",
        title: "A stop set in calm weather",
        prompt: "Your stop sits 2 ATRs away, measured in a calm month: 2 × 0.80 = 1.60. The regime switches, and the daily ATR is now 2.00. What happens to the stop?",
        control: {
          kind: "choice",
          choices: [
            { id: "safe", label: "Still safe: it's 2 ATRs away", feedback: "It was 2 ATRs of the calm market. Now 1.60 is 1.60 ÷ 2.00 = 0.8 of a typical day's range." },
            { id: "noise", label: "Ordinary noise now reaches it" },
            { id: "widens", label: "It widens with the ATR", feedback: "A stop doesn't move by itself. It sits where you set it, from the old ATR." },
          ],
          answer: "noise",
        },
        reveal: "1.60 is now 0.8 of a typical day's range: a stop meant to sit outside the noise sits inside it. An ATR from 20 calm days lags the switch. Re-measure, widen the stop, and cut the size so the risk stays the same.",
        concept: "volatility-clustering",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "The √t rule needs independent days (3.10.7). With a day-to-day correlation of +0.2, a 1%-a-day market moves 2.62% a week, not 2.24%; Lo showed the same flaw can overstate annualised Sharpe ratios. And realised volatility measures the past, while implied volatility, the kind the VIX tracks (3.9.3), is the options market's forecast.",
      },
      {
        kind: "worked",
        title: "Draw the 20-day cone",
        lines: ["LABX at 100.00, daily volatility 1.2%: 1.20 a day.", "√20 = 4.472.", "Half-width of the one-sigma cone at day 20 = 1.20 × 4.472 = ?"],
        ask: {
          answer: 5.37,
          tolerance: 0.01,
          feedback: [{ value: 24, text: "That's 1.20 × 20, as if every day moved the same way. Use √20 = 4.472." }],
          correct: "Right. The cone runs from 94.63 to 105.37.",
        },
        after: "In 10,000 seeded paths, 32.4% ended day 20 outside it. The bell curve says 31.7%.",
        concept: "square-root-of-time",
      },
      {
        kind: "predict",
        title: "Switch the regime",
        prompt: "Volatility doubles to 2.4% a day, but you keep the old cone, 94.63 to 105.37. How often does day 20 now end outside it?",
        control: {
          kind: "slider",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          start: 32,
          answer: 62,
          tolerance: 5,
          feedback: [
            { from: 0, to: 56, text: "More often than that. With volatility doubled, the old cone spans only ±0.5 of the new standard deviations." },
            { from: 68, to: 100, text: "Less often than that. About 38% of paths still end within ±0.5 of the new standard deviations." },
          ],
        },
        reveal: "62.9% of 10,000 seeded paths ended outside, against 32.4% before the switch; the bell curve says 61.7%. A calm-window estimate understates risk exactly when it matters.",
        concept: "volatility-clustering",
      },
    ],
    check: ["q-3.10.2-1", "q-3.10.2-2", "q-3.10.2-3"],
    recap: {
      takeaways: [
        "Volatility over n days = daily volatility × √n: 1% a day is 15.9% a year.",
        "Volatility clusters. After a switch, a calm-window cone or ATR stop is too narrow.",
        "Realised volatility measures the past; implied volatility is the options market's forecast.",
      ],
      next: "Next, 3.10.3: regression to the mean, why an extreme result, good or bad, is usually followed by a more ordinary one.",
    },
  },
};

// ─── 3.10.3 · Regression to the mean ───────────────────────────────────────

const L_3_10_3: Lesson = {
  id: "3.10.3",
  title: "Regression to the mean",
  topic: "psychology",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Every result is edge plus noise; after an extreme result the noise rarely repeats, so the next one tends to sit closer to the true edge.",
  objectives: [
    "Predict how an extreme early result will look in the next sample when outcomes contain noise.",
    'Tell regression from "the market changed" when a hot setup cools down.',
    "Explain why the best backtest out of many is likely to disappoint.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "psychology", label: "Knowledge check: psychology" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "3.10",
    courseId: "3.10.3",
    bridge: "In 3.10.2 volatility measured how widely returns scatter. In 0.2.6 luck made stars of coin-flippers; in 2.12.4 results after an extreme run drifted back toward the true edge. Here you split each result into edge plus noise and predict what the hottest performers do next.",
    hook: {
      prompt: "Fifty simulated traders with zero skill trade for a month. The top five averaged +12.1%. What will the same five average next month?",
      control: {
        kind: "slider",
        min: -12,
        max: 12,
        step: 1,
        unit: "%",
        start: 12,
        answer: 0,
        tolerance: 1,
        feedback: [
          { from: 2, to: 12, text: "Their month 1 was luck, and luck doesn't carry over. Expect the group's average: zero, minus costs." },
          { from: -12, to: -2, text: "Luck doesn't turn against them either; it's redrawn. Expect zero minus costs, about −0.5%." },
        ],
      },
      compare: "You answered {yours}%. In this run the five made −1.1% the next month. Over 10,000 runs the top five average +11.5% in month 1 and −0.5% in month 2: zero skill, minus costs.",
      concept: "regression-to-the-mean",
    },
    learn: [
      {
        kind: "explain",
        title: "Edge plus noise",
        text: "Every result is true edge plus noise. Rank by results, and the top of the list holds the best edges and the luckiest noise. Next period the edge stays and the noise is redrawn, so results slide back toward the true edge: [[regression-to-the-mean|regression to the mean]]. The more noise in a result, the harder the pull.",
      },
      {
        kind: "worked",
        title: "A hot start",
        lines: ["A setup made +1.5R a trade over its first 15 trades.", "Its true edge is +0.3R a trade; the rest was noise, which doesn't repeat.", "Expected average over the next 15 trades = ?"],
        ask: {
          answer: 0.3,
          tolerance: 0.05,
          unit: "R",
          feedback: [
            { value: 1.5, text: "That assumes the noise repeats. Only the edge carries over: +0.3R." },
            { value: 0.9, text: "Halfway assumes half the noise repeats. None of it does: expect the true edge." },
          ],
          correct: "Right. Expect the true edge, +0.3R, not the hot start.",
        },
        after: "In 100,000 seeded setups with a true edge of +0.3R and an R spread of 2R, 1,063 opened with +1.5R or better. Their next 15 trades averaged +0.28R.",
        concept: "regression-to-the-mean",
      },
      {
        kind: "reveal",
        title: "Rookie of the year",
        prompt: "The top five of 50 zero-skill traders in month 1, best first. Their month 2 is under the veil. What will it show?",
        chart: {
          candles: ROOKIE,
          visible: 5,
          range: [-15, 20],
          layers: [{ kind: "level", price: 0, role: "neutral", label: "0%", chip: false }],
          describe: "Monthly results in %, drawn as bars from zero. Month 1, the top five of 50: +16.9, +13.8, +11.5, +10.0 and +8.2. The same five traders' month 2 follows, hidden until revealed.",
        },
        choices: [
          { id: "stay", label: "They stay on top: they've found something", feedback: "With zero skill there was nothing to find. In month 2 they ranked 25th, 44th, 9th, 27th and 19th of 50." },
          { id: "fade", label: "They fall back toward the group" },
          { id: "worse", label: "They do worse than everyone: the luck reverses", feedback: "Luck doesn't reverse; it's redrawn. They averaged −1.1%, close to the whole group's −1.7%." },
        ],
        answer: "fade",
        after: "Month 2: −0.5%, −8.6%, +3.9%, −0.8% and +0.6%, an average of −1.1%. With zero skill, month 1 predicted nothing.",
        concept: "regression-to-the-mean",
      },
      {
        kind: "match",
        title: "Regression or a real change?",
        prompt: "Sort each case: is it most likely regression to the mean, or a real change worth investigating?",
        pairs: [
          {
            left: "A setup's first 15 trades made +1.5R each; the next 15 made +0.2R",
            right: "Regression",
            wrong: "A hot start over 15 trades is mostly noise. Falling back toward a modest edge is what regression predicts.",
          },
          {
            left: "Win rate fell from 70% to 52% between two 20-trade samples; 500 backtest trades say 55%",
            right: "Regression",
            wrong: "Twenty trades are noisy, and 52% sits near the 500-trade estimate. The 70% was the outlier.",
          },
          {
            left: "The exchange raised its fees: each trade now costs 0.1R more",
            right: "Real change",
            wrong: "A cost change is structural. It lowers every future trade, however lucky the sample.",
          },
          {
            left: "The setup traded a lunchtime lull that vanished when session hours changed",
            right: "Real change",
            wrong: "The market the setup relied on no longer exists. That's a cause you can name and check, not noise.",
          },
        ],
        columns: ["Case", "Most likely"],
        correct: "Right. When a hot setup cools, check for regression first. A real change has a cause you can name and confirm on new trades.",
        concept: "regression-to-the-mean",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Pick the best of 30 backtests and you pick its luck too: the [[winners-curse|winner's curse]]. Expect it to do worse on new data (3.11.5). And when a hot setup cools, 'the market changed' needs a cause you can name (3.13.7). Without one, regression is the simpler story.",
      },
      {
        kind: "predict",
        title: "How much skill survives?",
        prompt: "Each month's result = skill + luck, for 50 traders. Set the share of skill at which the month-1 top decile keeps about half its edge in month 2.",
        control: {
          kind: "slider",
          min: 0,
          max: 100,
          step: 5,
          unit: "%",
          start: 0,
          answer: 50,
          tolerance: 5,
          feedback: [
            { from: 0, to: 40, text: "Too little skill: most of the month-1 lead was luck, and it fades." },
            { from: 60, to: 100, text: "At that share, more than half the lead survives. Find where it's about half." },
          ],
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "Skill 0%", value: 0, role: "neutral" },
            { label: "Skill 25%", value: 25, role: "accent" },
            { label: "Skill 50%", value: 49, role: "accent" },
            { label: "Skill 75%", value: 74, role: "accent" },
            { label: "Skill 100%", value: 100, role: "accent" },
          ],
          unit: "%",
          steps: ["Share of its month-1 lead the top decile kept in month 2, over 1,000 seeded repeats."],
        },
        reveal: "At 50% skill the top decile kept 49% of its month-1 lead, over 1,000 seeded repeats. The share kept tracks the share of skill: luck fades, skill stays.",
        concept: "regression-to-the-mean",
      },
    ],
    check: ["q-3.10.3-1", "q-3.10.3-2", "q-3.10.3-3"],
    recap: {
      takeaways: [
        "Result = edge + noise. Expect the next sample near the true edge, not the hot start.",
        "Before blaming the market, check for regression: a real change has a cause you can name.",
        "The best of many backtests was chosen partly for its luck; expect less on new data.",
      ],
      next: "Next, 3.10.4: base rates and Bayesian updating, or how likely a setup that passed your test is to be real.",
    },
  },
};

// ─── 3.10.4 · Base rates and Bayesian updating ─────────────────────────────

const L_3_10_4: Lesson = {
  id: "3.10.4",
  title: "Base rates and Bayesian updating",
  topic: "scenario_analysis",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A passed test means little without the base rate: with 10% of ideas real, 80% power and 20% false alarms, a passed idea is real only 31% of the time.",
  objectives: [
    "Turn a base rate, a test's hit rate and its false-alarm rate into the probability that an idea has a real edge.",
    "Build a natural-frequency tree out of 1,000 ideas.",
    "Update a belief about a setup as trades arrive, without jumping to certainty.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "scenario_analysis", label: "Scenario analysis check" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "3.10",
    courseId: "3.10.4",
    bridge: "In 3.10.3 the best of many backtests was chosen partly for luck. In 0.2.4 a 60% win rate over 20 trades fitted anything from 38.5% to 81.5%. Here you start from the base rate of real ideas and update it with each test and trade.",
    hook: {
      prompt: "10% of new setup ideas have a real edge. Your test catches 80% of real edges but also passes 20% of useless ones. Your idea passed. How likely is it to be real?",
      control: {
        kind: "slider",
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        start: 50,
        answer: 31,
        tolerance: 2,
        feedback: [
          { from: 60, to: 100, text: "That trusts the test and forgets how many useless ideas there are. Most passes come from that large pool." },
          { from: 0, to: 20, text: "Lower than the truth. A pass does raise the odds, from 10% to about 31%." },
        ],
      },
      compare: "You answered {yours}%. Out of 1,000 ideas, 80 real ones pass and 180 useless ones pass too. 80 of 260 passes are real: 31%.",
      concept: "bayesian-updating",
    },
    learn: [
      {
        kind: "figure",
        title: "Count 1,000 ideas",
        figure: {
          kind: "flow",
          start: "all",
          nodes: [
            { id: "all", text: "1,000 setup ideas", kind: "pause", next: "real" },
            { id: "real", text: "100 have a real edge (10%). The test passes 80 of them (80%).", kind: "pause", next: "none" },
            { id: "none", text: "900 have none. The test still passes 180 of them (20%).", kind: "pause", next: "pass" },
            { id: "pass", text: "260 ideas pass: 80 real and 180 false alarms. 80 ÷ 260 = 31%.", kind: "end" },
          ],
          steps: [
            "Start with 1,000 ideas instead of percentages.",
            "10% have a real edge: 100. The test catches 80% of them: 80 pass.",
            "90% have none: 900. It passes 20% of those anyway: 180 false positives.",
            "Of 260 passes, 80 are real: a 31% posterior.",
          ],
        },
        text: "Your [[prior]] is the probability before the evidence, here 10%. The [[posterior]] is the probability after it. Counting 1,000 cases keeps the large pool of useless ideas, and their [[false-positive|false positives]], in sight.",
        concept: "bayesian-updating",
      },
      {
        kind: "worked",
        title: "A stricter test",
        lines: ["Same 1,000 ideas: 100 real, 80 of them pass.", "A stricter test passes only 5% of the 900 useless ones: 45.", "Chance a passed idea is real = 80 ÷ (80 + 45) = ?"],
        ask: {
          answer: 64,
          tolerance: 0.5,
          unit: "%",
          feedback: [
            { value: 80, text: "80% is the test's hit rate on real edges. Divide the real passes by all passes: 80 ÷ 125." },
            { value: 36, text: "That's the false-alarm share of the passes, 45 ÷ 125. The real share is 80 ÷ 125." },
          ],
          correct: "Right. 64%: cutting false alarms from 20% to 5% doubled what a pass is worth.",
        },
        after: "The prior didn't change. The test got better at saying no.",
        concept: "bayesian-updating",
      },
      {
        kind: "explain",
        title: "Evidence arrives slowly",
        text: "Trades update a belief one at a time, each by a little. A 60% win rate over 20 trades has a 95% [[confidence-interval|confidence interval]] of 38.5% to 81.5%: it fits a strong edge and no edge. From a 10% prior that a setup wins 50%, not 40%, at +1.5R/−1R, 12 wins in 20 lift it to just 27%.",
      },
      {
        kind: "figure",
        title: "One belief, 150 trades",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(151, 10),
            hideCandles: true,
            range: [0, 100],
            layers: [{ kind: "level", price: 10, role: "neutral", label: "Prior 10%", chip: false }],
            describe:
              "Belief, in %, that a setup has an edge, after each of 150 trades, from a 10% prior. A setup with a real edge: 27.3% after 20 trades, 7.5% after 44, 70.4% after 150. A setup with no edge: 0.8% after 150.",
          },
          steps: [
            { text: "A real edge: 12 wins in the first 20 trades lift the belief from 10% to 27%.", layers: [{ kind: "line", values: segment(BELIEF_EDGE, 0, 20), role: "accent" }] },
            { text: "Then a bad patch: 19 wins in 44 trades, and the belief sinks to 7.5%.", layers: [{ kind: "line", values: segment(BELIEF_EDGE, 20, 44), role: "accent" }] },
            { text: "By trade 150: 75 wins, belief 70%. A real edge, and still no certainty.", layers: [{ kind: "line", values: segment(BELIEF_EDGE, 44, 150), role: "accent", label: "Edge" }] },
            { text: "A setup with no edge: 61 wins in 150, belief 0.8%.", layers: [{ kind: "line", values: BELIEF_NONE, role: "neutral", dashed: true, label: "No edge" }] },
          ],
        },
        text: "Two seeded setups at +1.5R/−1R: an edge wins 50% of trades, no edge wins 40%. Across 10,000 seeded real edges, the belief stood above 50% at trade 150 only 65% of the time.",
        concept: "bayesian-updating",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Start every 'will this work?' from the base rate. For 'will I be profitable?' it's sobering: in the EU, 74% to 89% of retail CFD accounts lost money, per national regulators (ESMA, 2018). Judging the evidence without it is [[base-rate-neglect]].",
      },
      {
        kind: "predict",
        title: "How strict must the test be?",
        prompt: "Prior 10%, power 80%. Set the highest false-alarm rate at which a passed idea is real at least 60% of the time.",
        control: {
          kind: "slider",
          min: 0,
          max: 20,
          step: 0.1,
          unit: "%",
          start: 20,
          answer: 5.9,
          tolerance: 0.05,
          feedback: [
            { from: 6, to: 20, text: "Too many false alarms. At 6.0%, a pass is real only 59.7% of the time." },
            { from: 0, to: 5.8, text: "That works, but a looser test still reaches 60%. Find the highest rate that does." },
          ],
        },
        reveal: "5.9%. Then about 53 of the 900 useless ideas pass beside the 80 real ones: 80 ÷ 133 = 60.1%. To trust a pass, shrink the false alarms; the prior is what it is.",
        concept: "bayesian-updating",
      },
      {
        kind: "fields",
        title: "Your prior",
        prompt: "Before you test your next idea, write down your prior. It's saved with this lesson, for your research log in 3.11.",
        fields: [
          { id: "idea", label: "The idea, as a testable rule", kind: "text", default: "", placeholder: "Buy LABX on a close above the 20-day high, stop 2 ATRs below", required: true },
          { id: "prior", label: "How plausible is it before testing?", kind: "stepper", min: 1, max: 50, step: 1, unit: "%", default: 10 },
          { id: "otherSide", label: "Who is on the other side, and why would they keep losing?", kind: "text", default: "", placeholder: "Late sellers who exit at the low", required: true },
        ],
        valid: { field: "prior", lte: 30 },
        feedback: [{ when: { field: "prior", gt: 30 }, text: "A prior of {prior}% says most ideas like yours work. Few do: start nearer 10%, unless you can say why the other side keeps losing." }],
        correct: "Saved. When the test result arrives, put it beside this prior and the other side.",
        concept: "bayesian-updating",
      },
    ],
    check: ["q-3.10.4-1", "q-3.10.4-2", "q-3.10.4-3"],
    recap: {
      takeaways: [
        "P(real | passed) = real passes ÷ all passes: 80 ÷ 260 = 31% with a 10% prior.",
        "Count 1,000 ideas: 100 real, 80 pass; 900 useless, 180 pass anyway.",
        "Evidence moves beliefs slowly: 12 wins in 20 lift a 10% prior only to 27%.",
      ],
      next: "Next, 3.10.5: the t-statistic, which says whether your mean R is distinguishable from zero, and how many trades that takes.",
    },
  },
};

// ─── 3.10.5 · Significance: is your edge distinguishable from zero? ────────

const L_3_10_5: Lesson = {
  id: "3.10.5",
  title: "Significance: is your edge distinguishable from zero?",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "A t-statistic compares mean R with its standard error; small edges need hundreds of trades to show, and a Sharpe ratio means little without its standard error.",
  objectives: [
    "Compute a t-statistic for mean R and read its p-value correctly.",
    "Estimate how many trades a given edge needs before it is distinguishable from zero.",
    "Read a Sharpe ratio together with its standard error.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "decision_making", label: "Decision-making check" }],
  script: {
    unit: "3.10",
    courseId: "3.10.5",
    bridge: "In 3.10.4 a passed test meant little without the base rate. In 2.11.7 you put an interval around expectancy, and 2.11.8's SQN scaled mean R by its spread. Here those become a t-statistic and a p-value, and you count the trades a small edge needs.",
    hook: {
      prompt: "Your setup averages +0.2R per trade over 50 trades, with a standard deviation of 1.5R. Is that edge distinguishable from zero?",
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes: +0.2R is clearly above zero" },
          { id: "no", label: "No: it's within the noise" },
          { id: "cant", label: "Can't tell without the win rate" },
        ],
        answer: "no",
      },
      compare: "You picked {yours}. t = 0.2 ÷ (1.5 ÷ √50) = 0.94, well short of 2. At this edge it would take about 225 trades to reach t = 2.",
      concept: "statistical-significance",
    },
    learn: [
      {
        kind: "worked",
        title: "The t-statistic",
        lines: ["Standard error of the mean = sd ÷ √n = 1.5 ÷ √50 = 1.5 ÷ 7.07 = 0.212R.", "t = mean ÷ standard error = 0.2 ÷ 0.212 = ?"],
        ask: {
          answer: 0.94,
          tolerance: 0.01,
          feedback: [
            { value: 0.13, text: "That's 0.2 ÷ 1.5, without √n. Divide by the standard error, 0.212." },
            { value: 6.67, text: "That divides the sd by 50, not by √50 = 7.07." },
          ],
          correct: "Right. t = 0.94: the mean sits less than one standard error from zero. Two-sided p = 0.35.",
        },
        after: "To reach t = 2 at the same edge: n = (2 × 1.5 ÷ 0.2)² = 225 trades.",
        concept: "statistical-significance",
      },
      {
        kind: "explain",
        title: "What a p-value says",
        text: "The [[p-value]] is the chance of a result at least this far from zero if the true edge were zero. In 10,000 seeded 50-trade samples with no edge and sd 1.5R, 34% averaged at least 0.2R away from zero, either way: p ≈ 0.35. It is **not** the chance your edge is real. That needs a prior (3.10.4).",
      },
      {
        kind: "match",
        title: "Same idea, different names",
        prompt: "Match each statistic to what it is.",
        pairs: [
          { left: "SQN (2.11.8)", right: "√n × mean R ÷ sd: the t-statistic of mean R" },
          { left: "Standard error", right: "sd ÷ √n: how far an average wanders from sample to sample" },
          { left: "t ≈ 2", right: "p ≈ 0.05, two-sided" },
          { left: "SQN 2.33 over 100 trades", right: "p ≈ 0.02" },
        ],
        columns: ["Statistic", "What it is"],
        correct: "Right. SQN is the [[t-statistic]] of mean R. The reference system's SQN of 2.33 over 100 trades gives p ≈ 0.02.",
        concept: "sqn",
      },
      {
        kind: "worked",
        title: "A Sharpe ratio",
        lines: ["Sharpe ratio = average excess return ÷ its standard deviation.", "Daily: 0.05% ÷ 1% = 0.05. To annualise, multiply by √252 = 15.87.", "Annual Sharpe = 0.05 × 15.87 = ?"],
        ask: {
          answer: 0.79,
          tolerance: 0.01,
          feedback: [{ value: 12.6, text: "That multiplies by 252. The mean grows with the days but the sd with √days, so the ratio grows with √252." }],
          correct: "Right. 0.79 a year.",
        },
        after: "With daily data, its standard error is about 1 ÷ √years: 0.58 after 3 years, 0.32 after 10.",
        concept: "sharpe-ratio",
      },
      {
        kind: "figure",
        title: "How sure is a Sharpe of 1?",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(3, 1),
            hideCandles: true,
            range: [-1.5, 3.5],
            describe:
              "Middle 95% of measured Sharpe ratios when the true Sharpe is 1.0, over 10,000 seeded histories of daily returns: −0.90 to 3.00 after 1 year, −0.11 to 2.12 after 3 years, 0.39 to 1.63 after 10 years.",
          },
          steps: [
            {
              text: "True Sharpe 1.0, measured over 1 year: 95% of 10,000 seeded results fall between −0.90 and 3.00.",
              layers: [
                { kind: "level", price: 0, role: "neutral", label: "Zero" },
                { kind: "level", price: 1, role: "concept", label: "True Sharpe 1.0" },
                { kind: "bracket", from: -0.9, to: 3, index: 0, label: "1 year", role: "neutral" },
              ],
            },
            { text: "Over 3 years: −0.11 to 2.12. Zero is still inside.", layers: [{ kind: "bracket", from: -0.11, to: 2.12, index: 1, label: "3 years", role: "neutral" }] },
            { text: "Over 10 years: 0.39 to 1.63. Now zero is outside.", layers: [{ kind: "bracket", from: 0.39, to: 1.63, index: 2, label: "10 years", role: "up" }] },
          ],
        },
        text: "The [[standard-error|standard error]] of a [[sharpe-ratio|Sharpe ratio]] from daily data is about 1 ÷ √years: 1.00, 0.58 and 0.32 for these three lengths. A good Sharpe needs years of history before it means much.",
        concept: "sharpe-ratio",
      },
      {
        kind: "callout",
        tone: "info",
        text: "For skewed R, a [[bootstrap]], resampling your own trades thousands of times, gives a fairer interval than mean ± 1.96 standard errors. And small edges need many trades: +0.1R with sd 1.2R needs (1.96 × 1.2 ÷ 0.1)² ≈ 550 trades before its interval excludes zero.",
      },
      {
        kind: "worked",
        title: "Your sample",
        lines: ["A synthetic journal: 60 trades, mean +0.15R, sd 1.4R.", "Standard error = 1.4 ÷ √60 = 1.4 ÷ 7.75 = 0.181R.", "t = 0.15 ÷ 0.181 = ?"],
        ask: {
          answer: 0.83,
          tolerance: 0.01,
          feedback: [{ value: 0.11, text: "That's 0.15 ÷ 1.4, without √60. Divide by the standard error, 0.181." }],
          correct: "Right. t = 0.83, p ≈ 0.41: not distinguishable from zero yet.",
        },
        concept: "statistical-significance",
      },
      {
        kind: "predict",
        title: "Trades needed",
        prompt: "Same edge, +0.15R with sd 1.4R. How many trades would it take to reach t = 2?",
        control: {
          kind: "numeric",
          unit: "trades",
          answer: 349,
          tolerance: 17,
          feedback: [
            { value: 19, text: "That's 2 × 1.4 ÷ 0.15 = 18.67. Square it." },
            { value: 37, text: "That doubles 18.67 instead of squaring it: 18.67 × 18.67." },
          ],
        },
        reveal: "(2 × 1.4 ÷ 0.15)² = 18.67² = 348.4, so 349 trades: almost six times the 60 you have. Keep risk small and keep counting.",
        concept: "statistical-significance",
      },
    ],
    check: ["q-3.10.5-1", "q-3.10.5-2", "q-3.10.5-3"],
    recap: {
      takeaways: [
        "t = mean ÷ (sd ÷ √n). +0.2R, sd 1.5R, 50 trades: t = 0.94, p ≈ 0.35.",
        "Trades needed for t = 2: (2 × sd ÷ mean)². +0.2R with sd 1.5R needs 225.",
        "A Sharpe's standard error is about 1 ÷ √years: a Sharpe of 1.0 over 3 years could be zero.",
      ],
      next: "Next, 3.10.6: what happens to significance when you run many tests, and how to correct for every one.",
    },
  },
};

// ─── 3.10.6 · Many tests, false discoveries ────────────────────────────────

const L_3_10_6: Lesson = {
  id: "3.10.6",
  title: "Many tests, false discoveries",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Test enough useless rules and some will look significant; count every test, correct the threshold, and run the same search on random-walk data.",
  objectives: [
    "Compute the chance that at least one of N useless strategies looks significant.",
    "Apply a simple Bonferroni correction and see what it costs.",
    'Use an R0 random-walk control to expose spurious "discoveries".',
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "3.10",
    courseId: "3.10.6",
    bridge: "In 3.10.5 one test below the 5% level looked like an edge. Run twenty and noise will pass one. In 0.2.5 a random walk drew patterns, and in 3.9.6 calendar tests found 'hits' in pure noise. Here you count every test and correct the threshold.",
    hook: {
      prompt: "You test 20 indicator rules, none with any real edge, at the 5% level. What's the chance at least one looks like it works?",
      control: {
        kind: "slider",
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        start: 5,
        answer: 64,
        tolerance: 3,
        feedback: [
          { from: 0, to: 20, text: "That's close to the chance for a single test. With 20 tries, the chances pile up." },
          { from: 80, to: 100, text: "High, but not that high: each useless rule stays quiet 95% of the time, and all 20 do 36% of the time." },
        ],
      },
      compare: "You answered {yours}%. Each useless rule stays quiet with probability 0.95. All 20 stay quiet: 0.95²⁰ = 36%. So at least one 'works': 64%.",
      concept: "multiple-testing",
    },
    learn: [
      {
        kind: "worked",
        title: "Twenty chances",
        lines: ["One useless rule passes a 5% test with probability 0.05.", "All 20 fail it: 0.95²⁰ = 0.358.", "Chance at least one passes = 1 − 0.358 = ?"],
        ask: {
          answer: 64.2,
          tolerance: 0.3,
          unit: "%",
          feedback: [
            { value: 100, text: "That adds 20 × 5%. Chances of 'at least one' don't add up like that: take 1 − 0.95²⁰." },
            { value: 35.8, text: "That's the chance that none pass. Subtract it from 1." },
          ],
          correct: "Right. 64%: more likely than not, you 'discover' something that isn't there.",
        },
        concept: "multiple-testing",
      },
      {
        kind: "explain",
        title: "Correct the threshold",
        text: "The [[bonferroni-correction|Bonferroni correction]] divides the threshold by the number of tests: 0.05 ÷ 20 = 0.25%. The chance of any false discovery among the 20 then stays at 5% or less. The cost: real but modest edges get missed. In Harvey and Liu's example, met again in 4.3, adjusting for many tests turns a t of 3.0 into about 2.0.",
      },
      {
        kind: "figure",
        title: "The best of 100 random series",
        figure: {
          kind: "chart",
          chart: {
            candles: slots(48, 0),
            hideCandles: true,
            range: [-6, 15],
            layers: [
              { kind: "level", price: 0, role: "neutral", chip: false },
              { kind: "path", points: [{ index: 23.5, price: -6 }, { index: 23.5, price: 15 }], role: "neutral", dashed: true },
            ],
            describe:
              "Monthly returns, in %, of LABX and of the random series that matched it best over months 1–24, out of 100. Correlation 0.52 over months 1–24, 0.00 over months 25–48.",
          },
          steps: [
            { text: "LABX monthly returns, months 1 to 24.", layers: [{ kind: "line", values: segment(SPUR_LABX, 0, 23), role: "accent", label: "LABX" }] },
            {
              text: "Best match among 100 random series: correlation 0.52 with LABX over these 24 months.",
              layers: [{ kind: "line", values: segment(SPUR_SERIES, 0, 23), role: "concept", label: "Series 34" }],
            },
            {
              text: "Months 25 to 48: the same series' correlation with LABX is 0.00.",
              layers: [
                { kind: "line", values: segment(SPUR_LABX, 23, 47), role: "accent" },
                { kind: "line", values: segment(SPUR_SERIES, 23, 47), role: "concept", dashed: true },
              ],
            },
          ],
        },
        text: "A [[spurious-correlation|spurious correlation]]: search enough random series and one will match. Over 1,000 such searches, the best in-sample correlation averaged 0.50, and the same series' correlation on the next 24 months averaged 0.00.",
        concept: "spurious-correlation",
      },
      {
        kind: "figure",
        title: "Twenty rules, one discovery",
        figure: {
          kind: "bars",
          bars: [
            { label: "20-day momentum", value: 3.2, role: "accent" },
            { label: "10-day momentum", value: 6.6, role: "neutral" },
            { label: "60-day momentum", value: 9.3, role: "neutral" },
            { label: "Above 50-day MA", value: 14.2, role: "neutral" },
            { label: "Above 100-day MA", value: 14.8, role: "neutral" },
            { label: "Above 5-day MA", value: 20.4, role: "neutral" },
          ],
          unit: "%",
          steps: ["The three lowest p-values of the 20 rules. Only 20-day momentum clears 5%, at 3.2%.", "The next three: 14.2% to 20.4%. The other 14 rules: up to 98.6%."],
        },
        text: "Three years of unlabelled LABX data, 20 rules: five moving-average filters, five momentum lookbacks, five dip-buying thresholds and five weekdays. Each goes long for a day when its condition holds. The best: 20-day momentum, t = 2.16, p = 3.2%.",
        concept: "multiple-testing",
      },
      {
        kind: "predict",
        title: "One discovery",
        prompt: "20-day momentum has p = 3.2%, the best of the 20 rules you tried. What's your next step?",
        control: {
          kind: "choice",
          choices: [
            { id: "trade", label: "Trade it: p is under 5%", feedback: "Under 5% for one test, yes. But you ran 20, and among 20 useless rules a p under 5% turns up 64% of the time." },
            { id: "correct", label: "Correct the threshold for the 20 tries first" },
            { id: "more", label: "Try more rules until one gets under 1%", feedback: "That's p-hacking: every extra try raises the odds of a fluke. Count your tries; don't add to them." },
          ],
          answer: "correct",
        },
        reveal: "Count every rule you ran, including the ones you dropped. After 20 tries, 5% is no longer the bar.",
        concept: "multiple-testing",
      },
      {
        kind: "worked",
        title: "The corrected threshold",
        lines: ["You ran 20 rules. Bonferroni: 5% ÷ 20.", "Corrected threshold = ?"],
        ask: {
          answer: 0.25,
          tolerance: 0.001,
          unit: "%",
          feedback: [
            { value: 100, text: "That multiplies. Divide 5% by the 20 tries." },
            { value: 0.0025, text: "That's the threshold as a fraction. In percent it's 0.25%." },
          ],
          correct: "Right. 0.25%. The best rule's 3.2% is far above it: not significant.",
        },
        after: "The data were R0, a random walk: no rule could have an edge. Across 1,000 R0 series, this search found a p under 5% in 44.5% of them (fewer than 64%, as the rules overlap), and one under 0.25% in 3.1%.",
        concept: "multiple-testing",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Every parameter tweak is another test, and it counts. Keep a control: run the same search on R0 data, and if it 'discovers' as much there, yours is noise. Rules that looked strong on the Dow in Brock, Lakonishok and LeBaron (1992) showed no significant edge in the decade after (Sullivan, Timmermann and White, 1999).",
      },
    ],
    check: ["q-3.10.6-1", "q-3.10.6-2", "q-3.10.6-3"],
    recap: {
      takeaways: [
        "With N useless tests at 5%, the chance of at least one 'hit' is 1 − 0.95^N: 64% at 20.",
        "Bonferroni divides 5% by the tests run: 0.25% for 20. Modest real edges get harder to find.",
        "Count every tweak, and run the same search on R0: as many 'discoveries' there means noise.",
      ],
      next: "Next, 3.10.7: independence, the assumption behind most of these tests, and how to check it on your own trades.",
    },
  },
};

// ─── 3.10.7 · Autocorrelation and independence ─────────────────────────────

const L_3_10_7: Lesson = {
  id: "3.10.7",
  title: "Autocorrelation and independence",
  topic: "decision_making",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Autocorrelation fingerprints trending, mean-reverting and random markets; a runs test checks whether your wins and losses cluster, and clustering breaks tools that assume independence.",
  objectives: [
    "Read the sign of return autocorrelation as a fingerprint of trending, mean-reverting or random markets.",
    "Run a runs test on a win–loss sequence to check whether outcomes cluster.",
    "Explain which tools break when trades are not independent.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M02", label: "Trend or Noise?" },
    { kind: "arena", ref: "sideways", label: "Arena: sideways" },
  ],
  script: {
    unit: "3.10",
    courseId: "3.10.7",
    bridge: "In 3.10.6 you caught noise posing as edge. The t-statistic of 3.10.5, like the √t rule of 3.10.2, assumed each result ignores the last. In 2.8.1 trends and ranges needed different rules. Here autocorrelation fingerprints those regimes, and a runs test checks your own trades.",
    hook: {
      prompt: "Three markets, 40 days each. Each dot is one day: yesterday's return across, today's return up. Which market trends?",
      figure: { kind: "chart", chart: SCATTER, steps: [{ text: "Panels A, B and C. Dots to the right had an up day yesterday; dots up, an up day today." }] },
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "A" },
          { id: "b", label: "B" },
          { id: "c", label: "C" },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. In B an up day tends to follow an up day: the cloud tilts upward, a lag-1 autocorrelation of +0.49. C tilts down (−0.51); A is flat (0.00).",
      concept: "autocorrelation",
    },
    learn: [
      {
        kind: "figure",
        title: "Three fingerprints",
        figure: {
          kind: "chart",
          chart: SCATTER,
          steps: [
            {
              text: "B, trending: up days tend to follow up days. Lag-1 autocorrelation +0.49.",
              layers: [{ kind: "path", points: [{ index: 23, price: -1.13 }, { index: 43, price: 1.31 }], role: "up", label: "+0.49" }],
            },
            {
              text: "C, mean-reverting: an up day tends to be followed by a down day. −0.51.",
              layers: [{ kind: "path", points: [{ index: 46, price: 1.37 }, { index: 66, price: -1.15 }], role: "down", label: "−0.51" }],
            },
            {
              text: "A, random walk: yesterday says nothing about today. 0.00.",
              layers: [{ kind: "path", points: [{ index: 0, price: 0.07 }, { index: 20, price: 0.06 }], role: "concept", label: "0.00" }],
            },
          ],
        },
        text: "[[autocorrelation|Autocorrelation]] measures how much a value depends on the one before it. Its sign is a fingerprint: positive in a trending [[market-regime|regime]], negative in a range, near zero in a [[random-walk|random walk]]. The three markets here are seeded with +0.5, −0.5 and 0.",
        concept: "autocorrelation",
      },
      {
        kind: "worked",
        title: "Runs in your results",
        lines: [
          "A run is an unbroken streak of wins or of losses: W W L L L W has 3 runs.",
          "100 trades: 40 wins, 60 losses. If they're independent, expected runs = 2 × 40 × 60 ÷ 100 + 1.",
          "Expected runs = ?",
        ],
        ask: {
          answer: 49,
          tolerance: 0,
          unit: "runs",
          feedback: [
            { value: 48, text: "That's 2 × 40 × 60 ÷ 100. Add the 1." },
            { value: 50, text: "That would suit a 50/50 split. With 40 wins and 60 losses: 48 + 1 = 49." },
          ],
          correct: "Right. 49 runs if wins and losses are independent, with a standard deviation of 4.77.",
        },
        after: "Fewer runs than expected means streaks: wins and losses come in bunches. More means they alternate.",
        concept: "autocorrelation",
      },
      {
        kind: "explain",
        title: "What breaks when results cluster",
        text: "A [[runs-test|runs test]] checks the [[independence]] that many tools assume: the Kelly formula, risk-of-ruin formulas, Monte Carlo by reshuffling trades, the √t rule and Sharpe annualisation. Lo found autocorrelation can inflate annualised hedge-fund Sharpe ratios by as much as 65%. The fixes: resample blocks of trades instead of single trades, and test regime by regime.",
      },
      {
        kind: "figure",
        title: "Reshuffling hides the bunches",
        figure: {
          kind: "bars",
          bars: [
            { label: "Clustered: median max drawdown", value: 13, role: "down" },
            { label: "Same trades, reshuffled", value: 8.5, role: "neutral" },
            { label: "Clustered: 95th percentile", value: 25, role: "down" },
            { label: "Reshuffled: 95th percentile", value: 18, role: "neutral" },
          ],
          unit: "R",
          steps: ["Median max drawdown over 100 trades: 13R when results cluster, 8.5R once reshuffled.", "A bad case, the 95th percentile: 25R against 18R."],
        },
        text: "10,000 seeded 100-trade sequences: 40% wins at +2.5R, losses at −1R, each result tending to repeat the last (32.7 runs on average, not 49). A Monte Carlo that reshuffles single trades breaks the bunches and underestimates the drawdowns you'll live through.",
        concept: "autocorrelation",
      },
      {
        kind: "callout",
        tone: "key",
        text: "An equity-curve filter, such as trading only while the curve is above its average, can help only when results cluster. On independent trades it skips trades at random and leaves the average R unchanged (3.12.7).",
      },
      {
        kind: "worked",
        title: "Your last 100 trades",
        lines: ["40 wins, 60 losses, 38 runs. Expected 49, standard deviation 4.77.", "z = (observed − expected) ÷ sd = (38 − 49) ÷ 4.77 = ?"],
        ask: {
          answer: -2.3,
          tolerance: 0.05,
          feedback: [
            { value: 2.3, text: "Right size, wrong sign: 38 is below 49, so z is negative." },
            { value: -11, text: "That's the gap in runs. Divide it by the standard deviation, 4.77." },
          ],
          correct: "Right. z = −2.30.",
        },
        after: "In 10,000 random shuffles of the same 40 wins and 60 losses, only 1.32% had 38 runs or fewer.",
        concept: "autocorrelation",
      },
      {
        kind: "predict",
        title: "The verdict",
        prompt: "z = −2.30 for your last 100 trades. Do your outcomes cluster, alternate, or look independent?",
        control: {
          kind: "choice",
          choices: [
            { id: "cluster", label: "They cluster: fewer runs than expected, |z| above 1.96" },
            { id: "alternate", label: "They alternate", feedback: "Alternating gives more runs than expected and a positive z. Here there are fewer: 38 against 49." },
            { id: "random", label: "They look independent", feedback: "|z| = 2.30 is beyond 1.96: a shortfall of runs this large happens about 2% of the time by chance." },
          ],
          answer: "cluster",
        },
        reveal: "They cluster: wins and losses come in bunches. Treat Kelly, ruin formulas and reshuffled Monte Carlo as optimistic, and look for the regime behind the streaks.",
        concept: "autocorrelation",
      },
    ],
    check: ["q-3.10.7-1", "q-3.10.7-2", "q-3.10.7-3"],
    recap: {
      takeaways: [
        "Lag-1 autocorrelation: positive in trends, negative in ranges, near zero in a random walk.",
        "Runs test: expected runs = 2·n1·n2 ÷ (n1 + n2) + 1; |z| above 1.96 means non-random.",
        "Clustered results break Kelly, ruin formulas and reshuffled Monte Carlo: drawdowns run deeper.",
      ],
      next: "Next: the 3.10 checkpoint, then unit 3.11, Backtesting and system design, where these tools judge every rule you build.",
    },
  },
};

// ─── Check questions ───────────────────────────────────────────────────────

/** 0.95^N for N = 5n, n = 2…8 (10 to 40 tests), for the multiple-testing generator. */
const POW95 = "((n == 2) * 0.598737 + (n == 3) * 0.463291 + (n == 4) * 0.358486 + (n == 5) * 0.27739 + (n == 6) * 0.214639 + (n == 7) * 0.166083 + (n == 8) * 0.128512)";
/** Days and their square roots for the volatility-scaling generator: 5, 10, 21 and 63 trading days. */
const DAYS = "((h == 1) * 5 + (h == 2) * 10 + (h == 3) * 21 + (h == 4) * 63)";
const ROOT = "((h == 1) * 2.23607 + (h == 2) * 3.16228 + (h == 3) * 4.58258 + (h == 4) * 7.93725)";
/** Overall significance levels for the Bonferroni generator: 1%, 5% or 10%. */
const ALPHA = "((a == 1) * 1 + (a == 2) * 5 + (a == 3) * 10)";

const QUESTIONS: Question[] = [
  {
    id: "q-3.10.1-1",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 1,
    prompt: "A system wins 40% of trades at +2.5R and loses 60% at −1R. Its median trade is −1R, yet its expectancy is +0.40R. How can both be true?",
    options: [
      { id: "a", label: "Rare large wins pull the mean above the median" },
      { id: "b", label: "One of the two numbers must be miscalculated", rationale: "Both are right. The median is the middle trade, a loss; the mean also weighs how large the wins are." },
      { id: "c", label: "Expectancy counts only the winning trades", rationale: "Expectancy counts every trade: 0.4 × 2.5 − 0.6 × 1 = +0.40R. The losses are in it." },
      { id: "d", label: "The median includes costs and the mean doesn't", rationale: "Neither number here includes costs. They differ because the results are lopsided, not because of fees." },
    ],
    correct: "a",
    explanation: "More than half the trades lose, so the middle trade is −1R. The mean weighs each result by its size: 0.4 × 2.5 − 0.6 × 1 = +0.40R. Rare big wins make the distribution positively skewed, with the mean above the median.",
    lesson: "3.10.1",
    concepts: ["return-distribution"],
  },
  {
    id: "q-3.10.1-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which system is most likely to have negative skew in its R results?",
    options: [
      { id: "a", label: "A trend follower with a tight stop and no profit target", rationale: "Tight stops and open targets make many small losses and rare big wins: positive skew." },
      { id: "b", label: "A breakout system that lets winners run", rationale: "Letting winners run creates rare large wins on top of many small losses: positive skew." },
      { id: "c", label: "A mean-reversion system with a small target and a far stop" },
      { id: "d", label: "A coin-flip entry with stop and target at the same distance", rationale: "Equal distances give equal-sized wins and losses: a symmetric distribution, close to zero skew." },
    ],
    correct: "c",
    explanation: "A small target hit often and a far stop hit rarely produce many small wins and an occasional large loss: the long tail sits on the loss side. Option selling is the extreme case.",
    lesson: "3.10.1",
    concepts: ["skewness"],
    hints: ["Ask where the long tail sits: on the win side or the loss side?", "Small target, far stop: which results are frequent, and which are large?"],
  },
  {
    id: "q-3.10.1-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario:
      "An option-selling strategy shows 18 months of steady gains, no losing month and a Sharpe ratio of 2.5. It collects small premiums and would lose heavily on a sharp market move, which hasn't happened in those 18 months.",
    prompt: "Why might the Sharpe ratio flatter this strategy?",
    options: [
      { id: "a", label: "Its rare large losses may be missing from the sample, so the measured volatility is too low" },
      { id: "b", label: "Sharpe ignores returns, so steady gains don't count", rationale: "Sharpe divides the average excess return by volatility, so the gains count. The trouble is the denominator, which never saw a crash." },
      { id: "c", label: "18 months is too long a window for a Sharpe ratio", rationale: "Longer windows help. The trouble is that 18 months may hold none of the rare losses that define this strategy's risk." },
      { id: "d", label: "Option selling has positive skew, which Sharpe penalises", rationale: "Option selling has negative skew: small frequent gains, rare large losses. Sharpe hides that tail rather than penalising it." },
    ],
    correct: "a",
    explanation: "Sharpe sees only the volatility in the sample. A negatively skewed strategy can go many months without its rare large loss, so its measured volatility, and its risk, look small. Judge it by its worst plausible loss, not by its Sharpe.",
    lesson: "3.10.1",
    concepts: ["skewness", "sharpe-ratio"],
    hints: ["What does the standard deviation measure if the big loss never happened in the sample?", "Negative skew: frequent small gains, rare large losses."],
  },
  {
    id: "q-3.10.2-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "LABZ has a daily volatility of 0.8%. Assuming independent days, what is its volatility over a 5-day week, in %?",
    numeric: { answer: 1.79, tolerance: 0.02, unit: "%" },
    explanation: "Volatility scales with the square root of time: 0.8% × √5 = 0.8% × 2.236 = 1.79%. Multiplying by 5 would assume every day moves the same way.",
    lesson: "3.10.2",
    concepts: ["square-root-of-time"],
    hints: ["Multiply by the square root of the number of days, not by the days.", "√5 = 2.236."],
    vary: {
      fields: { d: [0.5, 3, 0.1], h: [1, 4, 1] },
      answer: `round(d * ${ROOT}, 2)`,
      prompt: `An instrument has a daily volatility of {d:1}%. Assuming independent days, what is its volatility over {${DAYS}} trading days, in %?`,
      explanation: `Volatility scales with the square root of time: {d:1}% × √{${DAYS}} = {d:1}% × {${ROOT}:3} = {answer:2}%. Multiplying by the days would assume every day moves the same way.`,
      hint: `√{${DAYS}} = {${ROOT}:3}. Multiply {d:1}% by it.`,
    },
  },
  {
    id: "q-3.10.2-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does volatility clustering mean?",
    options: [
      { id: "a", label: "Big moves tend to follow big moves, and quiet days follow quiet days" },
      { id: "b", label: "Prices cluster around round numbers", rationale: "That's about price levels. Clustering is about the size of moves over time: busy stretches follow busy ones." },
      { id: "c", label: "After a big up day, a big down day is due", rationale: "Clustering predicts size, not direction. In the lesson's seeded market, today's return said nothing about tomorrow's sign." },
      { id: "d", label: "Volatility stays about the same over time", rationale: "The opposite: volatility comes in calm and turbulent stretches, which is why a calm-window estimate fails after a switch." },
    ],
    correct: "a",
    explanation: "Large moves bunch together in time. In the lesson's seeded clustering market, the day after one of the biggest 5% of moves averaged 1.49 times the usual size, while its direction stayed unpredictable.",
    lesson: "3.10.2",
    concepts: ["volatility-clustering"],
  },
  {
    id: "q-3.10.2-3",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 3,
    prompt: "A market's daily returns have a correlation of +0.2 with the previous day's return. What does the √t rule do to its weekly volatility?",
    options: [
      { id: "a", label: "Gets it right: √t works for any market", rationale: "√t assumes independent days. With positive day-to-day correlation, moves build on each other and weeks get wider." },
      { id: "b", label: "Understates it: moves build on each other, so weeks are wider than daily × √5" },
      { id: "c", label: "Overstates it: the correlation cancels moves out", rationale: "Cancelling is what negative correlation does, as in a range. Positive correlation makes moves continue, so weeks are wider." },
      { id: "d", label: "Doubles it", rationale: "The error is real but smaller: with +0.2, weekly volatility is about 17% above the rule, 2.62% against 2.24%." },
    ],
    correct: "b",
    explanation: "Variances add only when days are independent. With a day-to-day correlation of +0.2, a 1%-a-day market moves about 2.62% a week, not 1% × √5 = 2.24%. Annualising a Sharpe ratio with √252 has the same flaw (Lo).",
    lesson: "3.10.2",
    concepts: ["square-root-of-time", "autocorrelation"],
    hints: ["What does the √t rule assume about one day and the next?", "If today's move tends to continue tomorrow, does a week get wider or narrower?"],
  },
  {
    id: "q-3.10.3-1",
    topic: "psychology",
    kind: "mcq",
    difficulty: 1,
    prompt: "Your setup just made +4R in five trades, far above its long-run +0.3R a trade. What should you expect from the next five?",
    options: [
      { id: "a", label: "About +4R again: it's in form", rationale: "Five trades are mostly noise. The 'form' was luck on top of the edge, and luck doesn't carry over." },
      { id: "b", label: "Results closer to its long-run +0.3R a trade" },
      { id: "c", label: "A losing run to balance it out", rationale: "Luck doesn't pay itself back; it's redrawn. Expect the long-run edge, not a payback." },
      { id: "d", label: "Nothing can be said", rationale: "The long-run edge from many trades is the best guide. Expect results near it." },
    ],
    correct: "b",
    explanation: "An extreme result over a few trades is edge plus a lot of luck. The luck is redrawn on the next trades, so results tend back toward the true edge, about +0.3R a trade. That's regression to the mean, not a payback.",
    lesson: "3.10.3",
    concepts: ["regression-to-the-mean"],
  },
  {
    id: "q-3.10.3-2",
    topic: "psychology",
    kind: "scenario",
    difficulty: 2,
    scenario: "A setup's R results have a standard deviation of about 1.5R. It averaged +0.9R over its first 20 trades and +0.1R over the next 20. Its 400-trade backtest shows +0.25R.",
    prompt: "What's the best first step?",
    options: [
      { id: "a", label: "Drop it: the edge is gone", rationale: "+0.1R over 20 trades is well within the noise around a +0.25R edge. Twenty trades can't show the edge is gone." },
      { id: "b", label: "Raise the size to win back the lost edge", rationale: "Size doesn't fix an edge. If nothing changed, the edge is still about +0.25R; if something did, more size makes it worse." },
      { id: "c", label: "Check both samples against the 400-trade edge, and look for a nameable cause before deciding" },
      { id: "d", label: "Re-optimise its parameters on the last 20 trades", rationale: "Fitting 20 trades chases noise, the same mistake as trusting the hot start." },
    ],
    correct: "c",
    explanation: "With an R spread of 1.5R, a 20-trade average has a standard error of about 0.34R. Both samples sit within the noise around +0.25R; the hot start was the outlier. Call it a real change only with a cause you can name, such as higher costs, and confirm it on new trades.",
    lesson: "3.10.3",
    concepts: ["regression-to-the-mean"],
    hints: ["How far can a 20-trade average wander from the true edge?", "Standard error = 1.5R ÷ √20 ≈ 0.34R."],
  },
  {
    id: "q-3.10.3-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "You tested 30 parameter settings of a breakout rule on the same five years of data. The best earned +0.6R a trade in-sample; the average setting earned +0.1R.",
    prompt: "What should you expect from the best setting on new data?",
    options: [
      { id: "a", label: "About +0.6R: it's the best setting", rationale: "It came out on top partly thanks to luck that fit those five years. That part won't repeat." },
      { id: "b", label: "Less than +0.6R, possibly close to the average setting" },
      { id: "c", label: "Exactly +0.1R, the average of all settings", rationale: "Some of its edge may be real, so it could beat the average. But expect it to fall well short of +0.6R." },
      { id: "d", label: "More than +0.6R, as it improves with fresh data", rationale: "Selection works the other way: the winner's luck is redrawn on new data, so its result shrinks." },
    ],
    correct: "b",
    explanation: "Picking the best of 30 picks the most luck as well as any real edge: the winner's curse. On new data the luck is redrawn, so expect a result between its in-sample score and the average, often near the average. 3.11 tests this out of sample.",
    lesson: "3.10.3",
    concepts: ["regression-to-the-mean", "multiple-testing"],
    hints: ["Why did this setting come out on top of 30?", "Which part of its result repeats on new data: the edge or the luck?"],
  },
  {
    id: "q-3.10.4-1",
    topic: "scenario_analysis",
    kind: "numeric",
    difficulty: 2,
    prompt: "20% of your setup ideas have a real edge. Your test passes 90% of real edges and 10% of useless ones. An idea passes. What's the chance it's real, in %?",
    numeric: { answer: 69.2, tolerance: 0.5, unit: "%" },
    explanation: "Out of 1,000 ideas: 200 real, 180 pass; 800 useless, 80 pass. Real passes ÷ all passes = 180 ÷ 260 = 69.2%.",
    lesson: "3.10.4",
    concepts: ["bayesian-updating", "base-rates"],
    hints: ["Count 1,000 ideas: how many are real, and how many of those pass?", "Then count the useless ideas that pass, and divide real passes by all passes.", "Real passes: 180 of 1,000. Useless passes: 80."],
    vary: {
      fields: { p: [5, 30, 1], pw: [50, 95, 5], fa: [2, 30, 1] },
      answer: "round(100 * p * pw / (p * pw + (100 - p) * fa), 1)",
      prompt: "{p}% of your setup ideas have a real edge. Your test passes {pw}% of real edges and {fa}% of useless ones. An idea passes. What's the chance it's real, in %?",
      explanation:
        "Out of 10,000 ideas: {p * 100} real, {p * pw} pass; {10000 - p * 100} useless, {(100 - p) * fa} pass. Real passes ÷ all passes = {p * pw} ÷ {p * pw + (100 - p) * fa} = {answer:1}%.",
      hint: "Out of 10,000 ideas, real passes: {p * pw}. Useless passes: {(100 - p) * fa}.",
    },
  },
  {
    id: "q-3.10.4-2",
    topic: "scenario_analysis",
    kind: "mcq",
    difficulty: 2,
    prompt: "What is base-rate neglect?",
    options: [
      { id: "a", label: "Judging new evidence while ignoring how common the thing was to begin with" },
      { id: "b", label: "Refusing to update a belief after new evidence", rationale: "That's under-reacting to evidence. Base-rate neglect over-reacts to it and forgets the starting odds." },
      { id: "c", label: "Drawing conclusions from too small a sample", rationale: "That's the law of small numbers. Base-rate neglect ignores the prior, even when the evidence itself is good." },
      { id: "d", label: "Comparing your results with the market's", rationale: "Comparing with a benchmark is good practice. Base-rate neglect is forgetting how rare the thing you test for is." },
    ],
    correct: "a",
    explanation: "A vivid pass, a hot streak or a convincing backtest pulls attention away from the base rate. With 10% of ideas real, 80% power and 20% false alarms, a pass means 31%, not 80%. The base rate sets where you start.",
    lesson: "3.10.4",
    concepts: ["base-rates"],
    hints: ["Base rate: how common something is before any evidence.", "What happens to the 31% if you forget the 900 useless ideas?"],
  },
  {
    id: "q-3.10.4-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A trader says: 'My backtest passed at the 5% level, so I'm 95% sure the strategy works.'",
    prompt: "What's missing from that reasoning?",
    options: [
      { id: "a", label: "Nothing: a 5% test means 95% confidence that it works", rationale: "5% is the chance a useless strategy passes. The chance a passing strategy is real depends on how many tested ideas are real." },
      { id: "b", label: "The share of real ideas and the test's power, needed to turn a pass into a probability" },
      { id: "c", label: "Only a longer backtest", rationale: "More data raises the test's power, but a pass still needs the prior. If few ideas are real, a pass is far from 95%." },
      { id: "d", label: "The strategy's maximum drawdown", rationale: "Drawdown matters for sizing, but it doesn't say whether the edge is real. That takes the prior and the error rates." },
    ],
    correct: "b",
    explanation: "A 5% level is the false-alarm rate on useless ideas, not the chance of being right. With a 10% prior and 80% power, 1,000 ideas give 80 real passes and 45 false ones, so a pass is 64% likely to be real, not 95%. Fewer real ideas, lower still.",
    lesson: "3.10.4",
    concepts: ["bayesian-updating", "statistical-significance"],
    hints: ["What does the 5% level measure: passes among useless ideas, or real edges among passes?", "Try it on 1,000 ideas with a 10% prior and 80% power."],
  },
  {
    id: "q-3.10.5-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "Your journal: 64 trades, mean +0.25R, standard deviation 1.6R. What is the t-statistic of the mean?",
    numeric: { answer: 1.25, tolerance: 0.02, unit: "" },
    explanation: "Standard error = 1.6 ÷ √64 = 1.6 ÷ 8 = 0.2R. t = 0.25 ÷ 0.2 = 1.25: under 2, so the edge isn't yet distinguishable from zero.",
    lesson: "3.10.5",
    concepts: ["statistical-significance"],
    hints: ["Standard error = sd ÷ √n; then divide the mean by it.", "√64 = 8, so the standard error is 1.6 ÷ 8 = 0.2R."],
    vary: {
      fields: { m: [0.05, 0.6, 0.05], s: [0.8, 2.5, 0.1], q: [5, 15, 1] },
      answer: "round(m * q / s, 2)",
      prompt: "Your journal: {q * q} trades, mean +{m:2}R, standard deviation {s:1}R. What is the t-statistic of the mean?",
      explanation: "Standard error = {s:1} ÷ √{q * q} = {s:1} ÷ {q} = {s / q:3}R. t = {m:2} ÷ {s / q:3} = {answer:2}. About 2 or more suggests more than noise.",
      hint: "√{q * q} = {q}, so the standard error is {s:1} ÷ {q} = {s / q:3}R.",
    },
  },
  {
    id: "q-3.10.5-2",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "Your setup's mean R has a p-value of 0.03. What does that mean?",
    options: [
      { id: "a", label: "There's a 97% chance the edge is real", rationale: "That reads p backwards. The chance the edge is real needs a prior, as in 3.10.4." },
      { id: "b", label: "If the true edge were zero, a result this far from zero would happen about 3% of the time" },
      { id: "c", label: "Future trades will be profitable 97% of the time", rationale: "A p-value says nothing about future win rates. It measures how surprising this sample would be with no edge." },
      { id: "d", label: "3% of your trades were lucky", rationale: "p isn't a count of lucky trades. It's the probability of data this extreme if the edge were zero." },
    ],
    correct: "b",
    explanation: "A p-value assumes no edge and asks how often chance alone would produce a result this extreme. p = 0.03 says that's uncommon; it does not say the edge is 97% likely to be real. That depends on the prior and on how many things you tested.",
    lesson: "3.10.5",
    concepts: ["statistical-significance"],
    hints: ["What does a p-value assume is true?", "p is computed under 'no edge'. It isn't the probability of 'no edge'."],
  },
  {
    id: "q-3.10.5-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A strategy shows an annualised Sharpe ratio of 3.0 over its first three months, measured on daily returns.",
    prompt: "What can you conclude?",
    options: [
      { id: "a", label: "It's exceptional: a Sharpe of 3 is rare", rationale: "Over three months the standard error is about 2. A zero-edge strategy shows 3 or more in about 7% of three-month samples." },
      { id: "b", label: "Very little: the standard error is about 2, so the plausible range runs from below zero to about 7" },
      { id: "c", label: "Its true Sharpe is at least 2", rationale: "A 95% range of about −0.8 to 7.2 fits a true Sharpe near zero as well as a high one." },
      { id: "d", label: "Three months is enough, since the data are daily", rationale: "More data points barely help: a Sharpe's standard error depends on years of history, here 1 ÷ √0.25 = 2." },
    ],
    correct: "b",
    explanation: "With daily data, the standard error of an annual Sharpe is about 1 ÷ √years = 1 ÷ √0.25 = 2. In 10,000 seeded three-month histories with a true Sharpe of 3, the middle 95% of measured values ran from −0.82 to 7.15; with a true Sharpe of zero, 6.7% still showed 3 or more.",
    lesson: "3.10.5",
    concepts: ["sharpe-ratio"],
    hints: ["Standard error of an annual Sharpe ≈ 1 ÷ √years.", "Three months is 0.25 years: 1 ÷ √0.25 = 2."],
  },
  {
    id: "q-3.10.6-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "You test 30 rules with no real edge, each at the 5% level. What's the chance at least one looks significant, in %?",
    numeric: { answer: 78.5, tolerance: 0.5, unit: "%" },
    explanation: "Each useless rule stays quiet with probability 0.95. All 30 stay quiet: 0.95³⁰ = 0.215. At least one 'works': 1 − 0.215 = 78.5%.",
    lesson: "3.10.6",
    concepts: ["multiple-testing"],
    hints: ["Find the chance that every rule stays quiet first.", "Multiply 0.95 by itself once per rule, then subtract from 1.", "0.95³⁰ = 0.215."],
    vary: {
      fields: { n: [2, 8, 1] },
      answer: `round(100 * (1 - ${POW95}), 1)`,
      prompt: "You test {5 * n} rules with no real edge, each at the 5% level. What's the chance at least one looks significant, in %?",
      explanation: `Each useless rule stays quiet with probability 0.95. All {5 * n} stay quiet: 0.95 to the power {5 * n} = {${POW95}:3}. At least one 'works': 1 − {${POW95}:3} = {answer:1}%.`,
      hint: `0.95 to the power {5 * n} = {${POW95}:3}.`,
    },
  },
  {
    id: "q-3.10.6-2",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "You ran 25 tests and want at most a 5% chance of any false discovery. Under Bonferroni, what p-value threshold should each test use, in %?",
    numeric: { answer: 0.2, tolerance: 0.005, unit: "%" },
    explanation: "Bonferroni divides the overall level by the number of tests: 5% ÷ 25 = 0.2%. A rule needs p below 0.2% to count, not below 5%.",
    lesson: "3.10.6",
    concepts: ["multiple-testing"],
    hints: ["Divide the overall level by the number of tests.", "5% ÷ 25."],
    vary: {
      fields: { a: [1, 3, 1], n: [2, 10, 1] },
      answer: `round(${ALPHA} / (5 * n), 4)`,
      prompt: `You ran {5 * n} tests and want at most a {${ALPHA}}% chance of any false discovery. Under Bonferroni, what p-value threshold should each test use, in %?`,
      explanation: `Bonferroni divides the overall level by the number of tests: {${ALPHA}}% ÷ {5 * n} = {answer:3}%. A rule needs p below that to count.`,
      hint: `{${ALPHA}}% ÷ {5 * n}.`,
    },
  },
  {
    id: "q-3.10.6-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "A trader tried 25 configurations of an indicator on the same data. One was significant at p = 0.03; the other 24 were not. The trader reports only that one.",
    prompt: "What's the fair verdict?",
    options: [
      { id: "a", label: "A real edge: p = 0.03 is below 5%", rationale: "Below 5% for one test. Among 25 useless configurations, at least one under 5% turns up 72% of the time." },
      { id: "b", label: "Compatible with luck: after 25 tries the bar is 0.2%, and 0.03 is far above it" },
      { id: "c", label: "Significant, because 24 failures show the test is strict", rationale: "The 24 failures are what chance predicts. They make the one hit less impressive, not more." },
      { id: "d", label: "Can't judge without the drawdown", rationale: "Drawdown matters for sizing, not for whether one hit in 25 is luck. Count the tries." },
    ],
    correct: "b",
    explanation: "One hit in 25 is roughly what chance delivers: 1 − 0.95²⁵ = 72% for at least one. Bonferroni puts the bar at 5% ÷ 25 = 0.2%. p = 0.03 doesn't clear it, and reporting only the hit hides the 24 tries.",
    lesson: "3.10.6",
    concepts: ["multiple-testing"],
    hints: ["How many configurations were tried in all?", "Divide 5% by the number of tries and compare."],
  },
  {
    id: "q-3.10.7-1",
    topic: "decision_making",
    kind: "numeric",
    difficulty: 2,
    prompt: "Your journal: 30 wins and 50 losses. If outcomes were independent, how many runs would you expect?",
    numeric: { answer: 38.5, tolerance: 0.05, unit: "runs" },
    explanation: "Expected runs = 2 × 30 × 50 ÷ 80 + 1 = 37.5 + 1 = 38.5. Clearly fewer runs than that means wins and losses bunch together.",
    lesson: "3.10.7",
    concepts: ["autocorrelation"],
    hints: ["Expected runs = 2 × wins × losses ÷ trades + 1.", "2 × 30 × 50 ÷ 80 = 37.5. Then add 1."],
    vary: {
      fields: { w: [20, 70, 1], l: [20, 70, 1] },
      answer: "round(2 * w * l / (w + l) + 1, 2)",
      prompt: "Your journal: {w} wins and {l} losses. If outcomes were independent, how many runs would you expect?",
      explanation: "Expected runs = 2 × {w} × {l} ÷ {w + l} + 1 = {2 * w * l / (w + l):2} + 1 = {answer:2}. Clearly fewer runs than that means wins and losses bunch together.",
      hint: "2 × {w} × {l} ÷ {w + l} = {2 * w * l / (w + l):2}. Then add 1.",
    },
  },
  {
    id: "q-3.10.7-2",
    topic: "technical_analysis",
    kind: "mcq",
    difficulty: 1,
    prompt: "In a market stuck in a range, what sign does the lag-1 autocorrelation of daily returns usually have?",
    options: [
      { id: "a", label: "Positive: moves continue", rationale: "Continuation is the trending fingerprint. In a range, a move up tends to be followed by a move back down." },
      { id: "b", label: "Negative: moves tend to reverse" },
      { id: "c", label: "Exactly zero", rationale: "Near zero is the random-walk fingerprint. A range pulls price back, so the sign turns negative." },
      { id: "d", label: "No sign: only its size matters", rationale: "The sign is the useful part: positive for trends, negative for mean reversion." },
    ],
    correct: "b",
    explanation: "In a range, an up day tends to be followed by a down day as price is pulled back toward the middle: negative autocorrelation, like the −0.51 of the mean-reverting market in the lesson.",
    lesson: "3.10.7",
    concepts: ["autocorrelation", "market-regime"],
  },
  {
    id: "q-3.10.7-3",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 3,
    scenario: "Your wins and losses cluster: 38 runs in 100 trades where 49 were expected. You estimate your worst drawdown by reshuffling your trade list 10,000 times.",
    prompt: "What does that Monte Carlo get wrong?",
    options: [
      { id: "a", label: "Nothing: reshuffling keeps every trade, so the drawdowns are right", rationale: "It keeps the trades but breaks their order. Clustering lives in the order, so the bunches of losses disappear." },
      { id: "b", label: "It underestimates drawdowns, because reshuffling breaks up the bunches of losses" },
      { id: "c", label: "It overestimates drawdowns, because clustering also bunches wins", rationale: "Bunched wins don't soften bunched losses. In the lesson's seeded test, reshuffling cut the median drawdown from 13R to 8.5R." },
      { id: "d", label: "It only matters for the Sharpe ratio", rationale: "Sharpe annualisation suffers too, but drawdown estimates, Kelly and ruin formulas all assume independence." },
    ],
    correct: "b",
    explanation: "Reshuffling assumes independent trades. Clustered losses arrive together, so real drawdowns run deeper: in 10,000 seeded clustered sequences the median max drawdown was 13R, but 8.5R after reshuffling. Resample blocks of trades instead.",
    lesson: "3.10.7",
    concepts: ["autocorrelation"],
    hints: ["What does reshuffling do to the order of trades?", "Where do clustered losses do their damage: in how many there are, or in when they come?"],
  },
];

// ─── Terms and concepts introduced in 3.10 ─────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "distribution",
    term: "Distribution",
    definition: "The full set of possible outcomes and how often each occurs, such as the spread of a system's R results or of daily returns.",
    plain: "How often each possible outcome occurs.",
    related: ["median", "skew", "fat-tails", "standard-deviation"],
    lesson: "3.10.1",
  },
  {
    id: "median",
    term: "Median",
    definition: "The middle value of a sorted set of results: half are above it and half below. Unlike the mean, it ignores how large the extremes are.",
    plain: "The middle value: half the outcomes are above it, half below.",
    related: ["distribution", "expectancy"],
    lesson: "3.10.1",
  },
  {
    id: "skew",
    term: "Skew",
    definition: "The asymmetry of a distribution. Positive skew has a long tail of rare large gains; negative skew has a long tail of rare large losses.",
    plain: "Lopsided outcomes, with a longer tail on one side.",
    related: ["distribution", "kurtosis", "fat-tails"],
    lesson: "3.10.1",
    aka: ["skewness"],
  },
  {
    id: "kurtosis",
    term: "Kurtosis",
    definition: "A measure of how heavy a distribution's tails are. Excess kurtosis above zero means more extreme outcomes than a normal distribution.",
    plain: "How heavy the tails are; high kurtosis means more extreme outcomes.",
    related: ["fat-tails", "skew", "distribution"],
    lesson: "3.10.1",
  },
  {
    id: "fat-tails",
    term: "Fat tails",
    definition: "Extreme outcomes that occur far more often than a normal distribution predicts. Daily market returns have them: multi-sigma days recur within years.",
    plain: "Extreme moves that happen far more often than a bell curve predicts.",
    related: ["kurtosis", "distribution", "gap"],
    lesson: "3.10.1",
    aka: ["heavy tails"],
  },
  {
    id: "realised-volatility",
    term: "Realised volatility",
    definition: "Volatility measured from actual past returns, usually the standard deviation of daily returns over a window.",
    plain: "Volatility measured from actual past price changes.",
    related: ["historical-volatility", "annualised-volatility", "volatility"],
    lesson: "3.10.2",
    aka: ["realized volatility"],
  },
  {
    id: "annualised-volatility",
    term: "Annualised volatility",
    definition: "Volatility scaled to a one-year horizon, usually daily volatility × √252 when days are independent.",
    plain: "Volatility scaled to a one-year horizon.",
    related: ["square-root-of-time-rule", "realised-volatility"],
    lesson: "3.10.2",
    aka: ["annualized volatility"],
  },
  {
    id: "square-root-of-time-rule",
    term: "Square-root-of-time rule",
    definition: "For independent returns, volatility over n periods equals one-period volatility × √n, because variances add up.",
    plain: "Volatility over n days is about daily volatility times the square root of n.",
    related: ["annualised-volatility", "autocorrelation", "independence"],
    lesson: "3.10.2",
    aka: ["√t rule"],
  },
  {
    id: "winners-curse",
    term: "Winner's curse",
    definition: "The best-scoring choice among many was selected partly for its luck, so its future results tend to fall short of its past score.",
    plain: "The best-looking pick among many was partly lucky, so it tends to disappoint.",
    related: ["regression-to-the-mean", "multiple-testing", "out-of-sample"],
    lesson: "3.10.3",
  },
  {
    id: "prior",
    term: "Prior",
    definition: "The probability you give a hypothesis before seeing new evidence, often taken from a base rate.",
    plain: "Your probability for something before seeing new evidence.",
    related: ["posterior", "base-rate", "base-rate-neglect"],
    lesson: "3.10.4",
  },
  {
    id: "posterior",
    term: "Posterior",
    definition: "The probability of a hypothesis after combining the prior with new evidence, by Bayes' rule.",
    plain: "Your updated probability after seeing the evidence.",
    related: ["prior", "false-positive"],
    lesson: "3.10.4",
  },
  {
    id: "false-positive",
    term: "False positive",
    definition: "A test result that says 'yes' when the true answer is 'no', such as a useless strategy passing a backtest.",
    plain: "A test saying 'yes' when the true answer is 'no'.",
    related: ["p-value", "multiple-testing", "posterior"],
    lesson: "3.10.4",
    aka: ["false alarm"],
  },
  {
    id: "base-rate-neglect",
    term: "Base-rate neglect",
    definition: "Judging new evidence while ignoring how common the thing judged was to begin with, which overstates what a positive result means.",
    plain: "Ignoring how common something is when judging new evidence about it.",
    related: ["base-rate", "prior"],
    lesson: "3.10.4",
  },
  {
    id: "t-statistic",
    term: "t-statistic",
    definition: "An estimate divided by its standard error, such as mean R ÷ (sd ÷ √n). Values around 2 or more suggest more than noise.",
    plain: "An average divided by its standard error; about 2 or more suggests more than noise.",
    related: ["standard-error", "p-value", "sqn"],
    lesson: "3.10.5",
    aka: ["t-stat"],
  },
  {
    id: "p-value",
    term: "p-value",
    definition: "The probability of a result at least as extreme as the one observed if there were truly no effect. It is not the probability that the effect is real.",
    plain: "The chance of a result this extreme if there were really no edge.",
    related: ["t-statistic", "multiple-testing", "false-positive"],
    lesson: "3.10.5",
  },
  {
    id: "standard-error",
    term: "Standard error",
    definition: "The standard deviation of an estimate from sample to sample. For a mean, the standard deviation ÷ √n.",
    plain: "How much an estimate, such as an average, would vary from sample to sample.",
    related: ["confidence-interval", "t-statistic", "sample-size"],
    lesson: "3.10.5",
    aka: ["SE"],
  },
  {
    id: "sharpe-ratio",
    term: "Sharpe ratio",
    definition: "Average return above cash divided by the standard deviation of returns, usually annualised. With daily data, its standard error is about 1 ÷ √years.",
    plain: "Return above cash divided by volatility.",
    related: ["standard-error", "skew", "annualised-volatility"],
    lesson: "3.10.5",
  },
  {
    id: "bootstrap",
    term: "Bootstrap",
    definition: "Estimating how uncertain a statistic is by resampling the observed data with replacement many times and recomputing the statistic each time.",
    plain: "Resampling your own results many times to estimate how uncertain they are.",
    related: ["confidence-interval", "standard-error"],
    lesson: "3.10.5",
  },
  {
    id: "multiple-testing",
    term: "Multiple testing",
    definition: "Running many tests on the same data, which makes some look significant by chance unless the threshold accounts for every test.",
    plain: "Running many tests, which makes chance 'discoveries' likely.",
    related: ["bonferroni-correction", "p-hacking", "false-positive"],
    lesson: "3.10.6",
    aka: ["data snooping"],
  },
  {
    id: "bonferroni-correction",
    term: "Bonferroni correction",
    definition: "Dividing the significance threshold by the number of tests run, so the chance of any false discovery stays at or below the original level.",
    plain: "Dividing the significance threshold by the number of tests run.",
    related: ["multiple-testing", "p-value"],
    lesson: "3.10.6",
  },
  {
    id: "p-hacking",
    term: "p-hacking",
    definition: "Trying analyses, rules or parameters until one produces a significant p-value, then reporting only that one.",
    plain: "Trying analyses until one gives a significant p-value.",
    related: ["multiple-testing", "p-value", "spurious-correlation"],
    lesson: "3.10.6",
  },
  {
    id: "spurious-correlation",
    term: "Spurious correlation",
    definition: "A correlation that appears by chance or through a shared trend and vanishes on new data.",
    plain: "A correlation that appears by chance and disappears on new data.",
    related: ["correlation", "multiple-testing", "out-of-sample"],
    lesson: "3.10.6",
  },
  {
    id: "autocorrelation",
    term: "Autocorrelation",
    definition: "The correlation of a series with its own past values. The lag-1 autocorrelation of returns is positive in trending markets and negative in mean-reverting ones.",
    plain: "How much a value depends on the values just before it.",
    related: ["independence", "runs-test", "market-regime"],
    lesson: "3.10.7",
    aka: ["serial correlation"],
  },
  {
    id: "runs-test",
    term: "Runs test",
    definition: "A test of whether a sequence, such as wins and losses, has as many runs as independence predicts: expected runs = 2·n1·n2 ÷ (n1 + n2) + 1.",
    plain: "A test of whether wins and losses alternate as randomly as expected.",
    related: ["autocorrelation", "independence", "losing-streak"],
    lesson: "3.10.7",
    aka: ["Wald–Wolfowitz test"],
  },
  {
    id: "independence",
    term: "Independence",
    definition: "Outcomes are independent when one gives no information about the next. Kelly, risk-of-ruin formulas, reshuffled Monte Carlo and the √t rule all assume it.",
    plain: "One outcome gives no information about the next.",
    related: ["autocorrelation", "runs-test", "square-root-of-time-rule"],
    lesson: "3.10.7",
  },
];

const CONCEPTS: Concept[] = [
  {
    id: "return-distribution",
    name: "Return distribution",
    category: "risk_management",
    summary: "The full shape of outcomes (mean, median, spread, skew and tails), not just the average.",
    body: [
      "An average tells you what a system earns per trade over many trades. It doesn't tell you what a typical trade looks like, how far results scatter, which side has the long tail, or how extreme the extremes get. Those decide how the system feels to trade and how it can hurt you.",
      "Describe any set of results by its centre (mean and median), its spread (standard deviation), its skew and its tails. When the mean sits above the median, rare large wins carry the system; when it sits below, rare large losses lurk.",
    ],
    example:
      "The reference system wins 40% of trades at +2.5R and loses 60% at −1R: mean +0.40R, median −1R, standard deviation 1.71R. Most trades lose, yet the system earns, because the rare wins are 2.5 times the losses.",
    related: ["skewness", "fat-tails", "expectancy"],
    missions: [],
    lessons: ["3.10.1"],
  },
  {
    id: "fat-tails",
    name: "Fat tails",
    category: "risk_management",
    summary: "Extreme moves occur far more often than a normal distribution predicts.",
    body: [
      "Market returns are not bell-shaped. Mandelbrot (1963) found cotton price changes with a tail parameter near 1.7, where a normal distribution has 2, and Fama found the same long tails in Dow 30 stocks. Multi-sigma days that a normal model calls once-in-millennia recur within years.",
      "The costs are practical: stops get gapped through, risk models built on the bell curve understate losses, the Kelly formula oversizes, and a Sharpe ratio flatters strategies with rare large losses. Plan for the tail, not the average day.",
    ],
    example:
      "At 1% daily volatility, a normal model puts a five-sigma drop at 2.9 in 10 million days, once in about 13,800 years. A Student-t model with 3 degrees of freedom and the same volatility gives 16 per 10,000 days, once every 2.5 years. In seeded runs of 10,000 days: 0 and 16.",
    related: ["return-distribution", "skewness", "gap-risk"],
    missions: [],
    lessons: ["3.10.1"],
  },
  {
    id: "skewness",
    name: "Skewness",
    category: "risk_management",
    summary: "Asymmetry of outcomes: positive skew means rare large wins, negative skew means rare large losses.",
    body: [
      "Skew says which side of the distribution has the long tail. Trend following tends toward positive skew: many small losses, rare big wins, and long losing streaks to sit through. Mean reversion and option selling tend toward negative skew: many small wins and an occasional loss that erases weeks of them.",
      "Negative skew is dangerous because it hides. A short record may contain none of the rare losses, so the measured volatility, and a Sharpe ratio built on it, look better than the strategy is.",
    ],
    example:
      "A trend system winning 30% of trades at +3.5R and losing 70% at −1R has a mean of +0.35R, a median of −1R and a skew of +0.87. A premium seller winning 92% at +0.3R and losing 8% at −3R has a skew of −3.1 and a mean of only +0.036R.",
    related: ["return-distribution", "fat-tails", "trend-following", "mean-reversion"],
    missions: [],
    lessons: ["3.10.1"],
  },
  {
    id: "square-root-of-time",
    name: "Square-root-of-time scaling",
    category: "risk_management",
    summary: "Volatility grows with the square root of the horizon when returns are independent.",
    body: [
      "When each day is independent of the last, the variances of daily returns add up, so the standard deviation over n days is the daily one times √n. That's how daily volatility becomes weekly (× √5) or annual (× √252), and how a price cone widens.",
      "The rule needs two things that markets don't always give: independent days and a stable volatility. With positive day-to-day correlation, weeks are wider than the rule says; after a regime switch, a cone measured in calm weather is too narrow.",
    ],
    example:
      "1% a day is 1% × √5 = 2.24% a week and 1% × √252 = 15.9% a year. With a day-to-day correlation of +0.2, the same market moves about 2.62% a week.",
    related: ["volatility", "volatility-clustering", "autocorrelation"],
    missions: [],
    lessons: ["3.10.2"],
  },
  {
    id: "bayesian-updating",
    name: "Bayesian updating",
    category: "decision_making",
    summary: "Combining a base rate with new evidence to get the probability that a hypothesis is true.",
    body: [
      "Start from the prior: how common real edges are among ideas like yours. A test result then moves that probability according to how often the test passes real edges (its power) and useless ones (its false-alarm rate). Counting 1,000 cases makes the arithmetic easy and keeps the large pool of useless ideas in sight.",
      "Evidence from trades arrives slowly. A few good trades move a belief only a little, and even a real edge can take hundreds of trades to look convincing.",
    ],
    example:
      "10% of ideas are real; a test passes 80% of real ones and 20% of useless ones. Of 1,000 ideas, 80 real and 180 useless pass: a pass is real 31% of the time. Cut false alarms to 5% and it's 80 ÷ 125 = 64%.",
    related: ["base-rates", "statistical-significance", "luck-vs-skill"],
    missions: [],
    lessons: ["3.10.4"],
  },
  {
    id: "statistical-significance",
    name: "Statistical significance",
    category: "decision_making",
    summary: "Whether a result, such as mean R, is distinguishable from zero given its sample size and variability.",
    body: [
      "Divide the average by its standard error, sd ÷ √n, to get a t-statistic. Around 2 or more, a result this far from zero would rarely come from a system with no edge; the p-value puts a number on 'rarely'. SQN is the same t-statistic, applied to mean R.",
      "A p-value is not the probability that the edge is real; that also needs a prior. And small edges take many trades: the number needed for t = 2 is (2 × sd ÷ mean)².",
    ],
    example:
      "+0.2R a trade with sd 1.5R over 50 trades: t = 0.2 ÷ (1.5 ÷ √50) = 0.94, p ≈ 0.35. In 10,000 seeded no-edge samples, 34% landed at least that far from zero. Reaching t = 2 at this edge takes (2 × 1.5 ÷ 0.2)² = 225 trades.",
    related: ["expectancy-confidence-interval", "sqn", "bayesian-updating", "multiple-testing"],
    missions: [],
    lessons: ["3.10.5"],
  },
  {
    id: "sharpe-ratio",
    name: "Sharpe ratio",
    category: "decision_making",
    summary: "Excess return per unit of volatility, meaningful only together with its standard error and sample length.",
    body: [
      "The Sharpe ratio divides the average return above cash by the standard deviation of returns, usually annualised: a daily Sharpe times √252, valid when days are independent. It rewards steady returns and punishes noisy ones.",
      "Read it with its standard error, about 1 ÷ √years with daily data. A short record says little, and a strategy with rare large losses can show a high Sharpe until the loss arrives.",
    ],
    example:
      "A mean daily excess return of 0.05% with a 1% daily sd is a daily Sharpe of 0.05, or 0.79 a year. With a true Sharpe of 1.0, 10,000 seeded histories gave measured values from −0.11 to 2.12 after 3 years (middle 95%) and from 0.39 to 1.63 after 10.",
    related: ["statistical-significance", "skewness", "performance-metrics"],
    missions: [],
    lessons: ["3.10.5"],
  },
  {
    id: "multiple-testing",
    name: "Multiple testing",
    category: "decision_making",
    summary: "Running many tests makes some look significant by chance, so thresholds must account for every trial.",
    body: [
      "Each useless rule tested at 5% has a 5% chance to look significant. Test N of them and the chance that at least one does is 1 − 0.95^N: 64% for 20. Every parameter tweak and every discarded rule counts as a test.",
      "Corrections raise the bar. Bonferroni divides the threshold by the number of tests; it controls false discoveries but misses modest real edges. A random-walk control helps too: if the same search finds as many 'discoveries' on random data, yours are noise.",
    ],
    example:
      "Twenty rules on three years of random-walk data: the best, 20-day momentum, had p = 3.2%. The corrected bar was 5% ÷ 20 = 0.25%. Across 1,000 random-walk series, the same search found a p under 5% in 44.5% of them, and one under 0.25% in 3.1%.",
    related: ["statistical-significance", "spurious-correlation", "random-walk"],
    missions: ["M02"],
    lessons: ["3.10.6"],
  },
  {
    id: "spurious-correlation",
    name: "Spurious correlation",
    category: "decision_making",
    summary: "A correlation that appears by chance or through a shared trend and vanishes on new data.",
    body: [
      "Search enough series and one will line up with yours by chance. The more candidates and the shorter the window, the stronger the best fake match. Series that both trend can also look related when they only share a direction.",
      "The test is new data. A real relationship holds up out of sample; a spurious one falls back toward zero, often at once.",
    ],
    example:
      "Out of 100 random series, the one that best matched LABX's monthly returns over 24 months had a correlation of 0.52; over the next 24 months, 0.00. Across 1,000 such searches, the best in-sample correlation averaged 0.50 and the out-of-sample one 0.00.",
    related: ["multiple-testing", "random-walk", "correlation-and-concentration"],
    missions: [],
    lessons: ["3.10.6"],
  },
  {
    id: "autocorrelation",
    name: "Autocorrelation",
    category: "technical_analysis",
    summary: "Dependence of a value on earlier values; its sign separates trending, mean-reverting and random series.",
    body: [
      "Lag-1 autocorrelation is the correlation of each return with the one before. Positive means moves continue, the fingerprint of a trend; negative means they reverse, the fingerprint of a range; near zero is a random walk.",
      "Trade outcomes can be autocorrelated too. A runs test counts streaks of wins and losses and compares them with what independence predicts. When results cluster, tools that assume independence mislead: Kelly, risk-of-ruin formulas, reshuffled Monte Carlo, the √t rule and annualised Sharpe ratios.",
    ],
    example:
      "40 wins and 60 losses should form 2 × 40 × 60 ÷ 100 + 1 = 49 runs, with a standard deviation of 4.77. 38 runs give z = −2.30: the outcomes cluster. Only 1.32% of 10,000 random shuffles had 38 runs or fewer.",
    related: ["market-regime", "random-walk", "volatility-clustering", "square-root-of-time"],
    missions: ["M02"],
    lessons: ["3.10.7"],
  },
];

export const UNIT_3_10: UnitContent = {
  intro: {
    summary: "Every lesson here asks one question from a new angle: luck or edge? You describe results by their full shape, scale volatility, expect regression to the mean, start from base rates, test significance, correct for many tests and check independence. It comes before backtesting in 3.11 and sizing theory in 3.12, which both need this language.",
    outcomes: [
      "Describe results by mean, median, spread, skew and tails, and expect fat tails.",
      "Scale volatility with the square root of time, and widen estimates when volatility clusters.",
      "Expect regression after extreme results, and update beliefs from the base rate.",
      "Test whether mean R is distinguishable from zero, and count the trades that takes.",
      "Correct for many tests, and check whether your wins and losses cluster.",
    ],
    buildsOn: "Expected value, variance and randomness from 0.2; expectancy from 1.4.5; ATR from 2.4.6; regimes from 2.8.1; recency from 2.12.4; and the confidence interval and SQN of 2.11.7 and 2.11.8.",
  },
  lessons: [L_3_10_1, L_3_10_2, L_3_10_3, L_3_10_4, L_3_10_5, L_3_10_6, L_3_10_7],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
