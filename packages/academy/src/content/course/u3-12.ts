import type { CandleData, Concept, GlossaryTerm, Lesson, Question, UnitContent } from "../../types";

/**
 * Unit 3.12 · Position sizing theory (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce.
 * Simulated figures come from seeded Monte Carlo runs (seededRandom); unit counts follow the engine (maxQtyForRisk, riskAmount:
 * commission 0.05% per fill, rounded up to the cent; buying power caps notional plus the entry fee at equity).
 * The reference system is the one from 3.10 and 3.11: 40% winners at +2.5R, losers at −1R.
 */

const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });
/** Flat placeholder candles for charts drawn only with layers (`hideCandles`). */
const blank = (n: number, p: number): CandleData[] => Array.from({ length: n }, () => k(p, p, p, p));
/** Every tenth point of a per-trade series, as path points (smooths the step-to-step jitter of discrete outcomes). */
const every10 = (a: number[]) => a.flatMap((price, index) => (index % 10 === 0 ? [{ index, price }] : []));

/** 3.12.1 fan: pointwise median and 5th percentile of 100,000 simulated paths of the reference system (seed 312), trades 0–100, as multiples of the start. */
const FAN_4_MED = [1, 0.96, 1.06, 1.01, 1.12, 1.07, 1.03, 1.13, 1.09, 1.19, 1.15, 1.1, 1.21, 1.16, 1.28, 1.23, 1.18, 1.3, 1.24, 1.37, 1.31, 1.26, 1.39, 1.33, 1.46, 1.41, 1.35, 1.48, 1.43, 1.57, 1.51, 1.44, 1.59, 1.53, 1.68, 1.61, 1.55, 1.7, 1.63, 1.8, 1.73, 1.66, 1.82, 1.75, 1.92, 1.85, 1.77, 1.95, 1.87, 2.06, 1.98, 1.9, 2.09, 2, 2.2, 2.12, 2.03, 2.23, 2.15, 2.36, 2.27, 2.18, 2.39, 2.3, 2.53, 2.43, 2.33, 2.56, 2.46, 2.7, 2.6, 2.49, 2.74, 2.63, 2.9, 2.78, 2.67, 2.94, 2.82, 3.1, 2.98, 2.86, 3.14, 3.02, 3.32, 3.19, 3.06, 3.36, 3.23, 3.55, 3.41, 3.27, 3.6, 3.46, 3.8, 3.65, 3.5, 3.86, 3.7, 4.07, 3.91];
const FAN_4_P5 = [1, 0.96, 0.92, 0.88, 0.85, 0.82, 0.9, 0.86, 0.83, 0.79, 0.87, 0.84, 0.8, 0.77, 0.85, 0.82, 0.78, 0.86, 0.83, 0.79, 0.76, 0.84, 0.8, 0.77, 0.85, 0.82, 0.78, 0.86, 0.83, 0.79, 0.87, 0.84, 0.8, 0.89, 0.85, 0.82, 0.9, 0.86, 0.83, 0.91, 0.87, 0.84, 0.92, 0.89, 0.85, 0.93, 0.9, 0.86, 0.95, 0.91, 0.87, 0.96, 0.92, 0.89, 0.97, 0.94, 0.9, 0.99, 0.95, 1.04, 1, 0.96, 1.06, 1.01, 0.97, 1.07, 1.03, 0.99, 1.09, 1.04, 1, 1.1, 1.06, 1.02, 1.12, 1.07, 1.03, 1.13, 1.09, 1.04, 1.15, 1.1, 1.21, 1.16, 1.12, 1.23, 1.18, 1.13, 1.25, 1.2, 1.15, 1.26, 1.21, 1.16, 1.28, 1.23, 1.35, 1.3, 1.25, 1.37, 1.32];
const FAN_16_MED = [1, 0.84, 1.18, 0.99, 1.38, 1.16, 0.98, 1.37, 1.15, 1.61, 1.35, 1.13, 1.59, 1.33, 1.87, 1.57, 1.32, 1.84, 1.55, 2.17, 1.82, 1.53, 2.14, 1.8, 2.52, 2.12, 1.78, 2.49, 2.09, 2.93, 2.46, 2.06, 2.89, 2.43, 3.4, 2.86, 2.4, 3.36, 2.82, 3.95, 3.32, 2.79, 3.9, 3.28, 4.59, 3.85, 3.24, 4.53, 3.81, 5.33, 4.48, 3.76, 5.26, 4.42, 6.19, 5.2, 4.37, 6.12, 5.14, 7.19, 6.04, 5.07, 7.1, 5.97, 8.35, 7.02, 5.9, 8.25, 6.93, 9.71, 8.15, 6.85, 9.59, 8.05, 11.28, 9.47, 7.96, 11.14, 9.36, 13.1, 11, 9.24, 12.94, 10.87, 15.22, 12.78, 10.74, 15.03, 12.63, 17.68, 14.85, 12.47, 17.46, 14.67, 20.54, 17.25, 14.49, 20.29, 17.04, 23.86, 20.04];
const FAN_16_P5 = [1, 0.84, 0.71, 0.59, 0.5, 0.42, 0.59, 0.49, 0.41, 0.35, 0.49, 0.41, 0.34, 0.29, 0.4, 0.34, 0.28, 0.4, 0.33, 0.28, 0.24, 0.33, 0.28, 0.23, 0.33, 0.27, 0.23, 0.32, 0.27, 0.23, 0.32, 0.27, 0.22, 0.31, 0.26, 0.22, 0.31, 0.26, 0.22, 0.31, 0.26, 0.22, 0.3, 0.25, 0.21, 0.3, 0.25, 0.21, 0.3, 0.25, 0.21, 0.29, 0.25, 0.21, 0.29, 0.24, 0.2, 0.29, 0.24, 0.34, 0.28, 0.24, 0.33, 0.28, 0.23, 0.33, 0.28, 0.23, 0.32, 0.27, 0.23, 0.32, 0.27, 0.23, 0.32, 0.27, 0.22, 0.31, 0.26, 0.22, 0.31, 0.26, 0.36, 0.3, 0.26, 0.36, 0.3, 0.25, 0.35, 0.3, 0.25, 0.35, 0.29, 0.25, 0.34, 0.29, 0.41, 0.34, 0.29, 0.4, 0.34];
const FAN_32_MED = [1, 0.68, 1.22, 0.83, 1.5, 1.02, 0.69, 1.25, 0.85, 1.53, 1.04, 0.71, 1.27, 0.86, 1.55, 1.06, 0.72, 1.29, 0.88, 1.58, 1.08, 0.73, 1.32, 0.9, 1.61, 1.1, 0.75, 1.34, 0.91, 1.64, 1.12, 0.76, 1.37, 0.93, 1.67, 1.14, 0.77, 1.39, 0.95, 1.71, 1.16, 0.79, 1.42, 0.97, 1.74, 1.18, 0.8, 1.45, 0.98, 1.77, 1.2, 0.82, 1.47, 1, 1.8, 1.23, 0.83, 1.5, 1.02, 1.84, 1.25, 0.85, 1.53, 1.04, 1.87, 1.27, 0.87, 1.56, 1.06, 1.91, 1.3, 0.88, 1.59, 1.08, 1.94, 1.32, 0.9, 1.62, 1.1, 1.98, 1.35, 0.92, 1.65, 1.12, 2.02, 1.37, 0.93, 1.68, 1.14, 2.05, 1.4, 0.95, 1.71, 1.16, 2.09, 1.42, 0.97, 1.74, 1.18, 2.13, 1.45];

/** 3.12.2 replay (seed 40): equity after each of the 100 trades under each rule. */
const REPLAY_UNITS = [10000, 9825, 10200, 10637.5, 10562.5, 11000, 11250, 11437.5, 11875, 11775, 11625, 11475, 11350, 11275, 11225, 11100, 10950, 10900, 10750, 10550, 11050, 10875, 11250, 11437.5, 11750, 11625, 11937.5, 12062.5, 12187.5, 12137.5, 12450, 12250, 12100, 11950, 11850, 11650, 11450, 11575, 12075, 11875, 11775, 11900, 12150, 12650, 12500, 13000, 12850, 12675, 12600, 12912.5, 12787.5, 12737.5, 12662.5, 12462.5, 12362.5, 12675, 12625, 13062.5, 13012.5, 12812.5, 13250, 13750, 13700, 13650, 13525, 13375, 13750, 13650, 13900, 14087.5, 13912.5, 13837.5, 13737.5, 13925, 13825, 14200, 14050, 14362.5, 14212.5, 14712.5, 14962.5, 14862.5, 14712.5, 14587.5, 15025, 14850, 14725, 14850, 14725, 14675, 15050, 15237.5, 15112.5, 14962.5, 14812.5, 14737.5, 14637.5, 14887.5, 15262.5, 15512.5, 15412.5];
const REPLAY_FF = [10000, 9900, 10147.5, 10401.2, 10297.19, 10554.62, 10818.5, 11088.98, 11366.21, 11252.55, 11140.02, 11028.62, 10918.33, 10809.15, 10701.06, 10594.05, 10488.11, 10383.23, 10279.4, 10176.61, 10431.04, 10326.73, 10584.91, 10849.54, 11120.79, 11009.58, 11284.83, 11566.96, 11856.13, 11737.57, 12031.02, 11910.71, 11791.6, 11673.68, 11556.94, 11441.37, 11326.96, 11610.13, 11900.38, 11781.38, 11663.57, 11955.17, 12254.05, 12560.4, 12434.8, 12745.68, 12618.22, 12492.04, 12367.12, 12676.3, 12549.54, 12424.04, 12299.8, 12176.8, 12055.03, 12356.41, 12232.85, 12538.68, 12413.29, 12289.16, 12596.39, 12911.29, 12782.18, 12654.36, 12527.82, 12402.54, 12712.62, 12585.49, 12900.12, 13222.62, 13090.39, 12959.49, 12829.9, 13150.65, 13019.14, 13344.62, 13211.17, 13541.45, 13406.04, 13741.19, 14084.72, 13943.87, 13804.43, 13666.39, 14008.04, 13867.96, 13729.28, 14072.51, 13931.78, 13792.46, 14137.26, 14490.69, 14345.78, 14202.32, 14060.3, 13919.7, 13780.5, 14125.03, 14478.16, 14840.11, 14691.71];
const REPLAY_FR500 = [10000, 9900, 10150, 10400, 10300, 10550, 11050, 11550, 12300, 12000, 11700, 11400, 11200, 11000, 10800, 10600, 10400, 10300, 10200, 10100, 10350, 10250, 10500, 11000, 11500, 11200, 11700, 12450, 13200, 12800, 13550, 13150, 12750, 12450, 12150, 11850, 11550, 12300, 13050, 12650, 12350, 13100, 14100, 15100, 14600, 15600, 15100, 14600, 14200, 15200, 14700, 14300, 13900, 13500, 13100, 14100, 13700, 14700, 14300, 13900, 14900, 15900, 15400, 14900, 14500, 14100, 15100, 14600, 15600, 16850, 16350, 15850, 15350, 16600, 16100, 17350, 16850, 18100, 17500, 19000, 20500, 19800, 19200, 18600, 20100, 19500, 18900, 20400, 19800, 19200, 20700, 22450, 21750, 21050, 20350, 19750, 19150, 20650, 22400, 24150, 23350];

/** 3.12.6 (seed 29): daily P&L of the volatility-targeted LABX position, days 1–60. */
const VOL_PNL = [40.67, 32.64, 117.3, -49.92, 64.39, 12, -83.72, 58, -54.39, -86.24, 92.12, 110.7, 67.2, 24.51, -29.14, -83.52, -2.35, 30.55, 76.61, -24.3, 90.16, -128.48, -57.6, 10.66, 109.2, 26, -46.8, -34, -31.2, -26.65, -252, 114.88, -40.8, 72.6, 42.6, 8.7, -58.2, -160.08, -59.75, 26, -21.5, 1, -138.84, -230, -38.88, -27.72, -133.2, -14.24, -5.44, -4, -32.64, 43.69, -6.29, -43.52, 20.4, 73.61, 41.82, 3.57, 1.8, -58.5];

/** 3.12.7 (seed 57): shadow equity in R after each trade (0 = start) and the live equity with the filter. */
const FILTER_EQ = [0, -1, 2, 5, 4, 3, 2, 5, 4, 3, 2, 1, 0, -1, 2, 1, 0, -1, 2, 1, 0, -1, -2, -3, 0, -1, -2, 1, 0, 3, 6, 5, 4, 7, 10, 9, 8, 11, 10, 9, 8, 11, 10, 9, 12, 15, 14, 13, 12, 11, 10, 13, 12, 15, 14, 13, 16, 15, 18, 17, 16];
const FILTER_LIVE = [0, -1, 2, 5, 4, 3, 2, 5, 4, 3, 2, 1, 0, -1, 2, 1, 0, -1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, 2, 1, 0, 3, 6, 5, 4, 7, 6, 5, 4, 7, 6, 5, 8, 11, 10, 9, 8, 7, 6, 9, 8, 11, 10, 9, 12, 11, 14, 13, 12];

/** Long-run growth per trade (expected log gain) when risking f of equity: a share w of trades win b R, the rest lose 1R. */
const growth = (f: number, w: number, b: number) => w * Math.log(1 + f * b) + (1 - w) * Math.log(1 - f);
/** 3.12.3: g(f) for 55% winners at 1.5R, f = 0 to 0.60 in steps of 0.005 (index 50 = full Kelly). */
const KELLY_G = Array.from({ length: 121 }, (_, i) => Math.round(growth(i * 0.005, 0.55, 1.5) * 10000) / 10000);

/** 3.12.4: the ten-trade list (vUSD per contract) and its TWR for f = 0 to 0.80 in steps of 0.01. Largest loss: 100. */
const OPTF_LIST = [300, -100, 200, -100, -100, 150, -100, 250, -100, 100];
const twr = (f: number) => OPTF_LIST.reduce((p, t) => p * (1 + (f * t) / 100), 1);
const TWR_CURVE = Array.from({ length: 81 }, (_, i) => Math.round(twr(i / 100) * 100) / 100);

/** 3.12.2: fixed-ratio lots for a cumulative profit and a delta (lot N needs delta × N(N − 1) ÷ 2), profit 0 to 30,000 by 1,000. */
const lots = (profit: number, delta: number) => (profit <= 0 ? 1 : Math.floor(0.5 * (1 + Math.sqrt(1 + (8 * profit) / delta))));
const ladder = (delta: number) => Array.from({ length: 31 }, (_, i) => lots(i * 1000, delta));

/** 3.12.7: one candle per trade (open = equity before, close = after), drawn as a line. */
const FILTER_CANDLES = FILTER_EQ.slice(1).map((v, i) => k(FILTER_EQ[i], Math.max(FILTER_EQ[i], v), Math.min(FILTER_EQ[i], v), v));

// ─── 3.12.1 · Geometric growth and volatility drag ─────────────────────────

const L_3_12_1: Lesson = {
  id: "3.12.1",
  title: "Geometric growth and volatility drag",
  topic: "position_sizing",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Returns compound by multiplying, so swings pull growth below the average return and the typical path below the average one.",
  objectives: [
    "Compute the compound result of a sequence of gains and losses, and its geometric mean.",
    "Estimate volatility drag with g ≈ μ − σ²/2.",
    "Explain why the median trader's path can sit far below the average path.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M05", label: "Size Matters" },
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
  ],
  script: {
    unit: "3.12",
    courseId: "3.12.1",
    hook: {
      prompt: "Your account of 10,000.00 vUSD gains 50%, then loses 50%. Where does it end?",
      control: {
        kind: "slider",
        min: 5000,
        max: 15000,
        step: 100,
        unit: "vUSD",
        start: 10000,
        answer: 7500,
        tolerance: 0,
        feedback: [
          { from: 9900, to: 10100, text: "Plus 50% and minus 50% add up to zero, but returns multiply: 10,000.00 × 1.5 × 0.5." },
          { from: 12000, to: 15000, text: "The loss comes off a bigger balance: 50% of 15,000.00 is 7,500.00." },
        ],
      },
      compare: "You said {yours}. 10,000.00 × 1.5 = 15,000.00, then × 0.5 = 7,500.00. The average return is 0%; the compound result is −25%.",
      concept: "volatility-drag",
    },
    learn: [
      {
        kind: "worked",
        title: "Multiply, don't add",
        lines: [
          "Turn each return into a growth factor: +50% is 1.5, −50% is 0.5.",
          "Both periods: 1.5 × 0.5 = 0.75, a 25% loss.",
          "The [[geometric-mean|geometric mean]] per period: √0.75 − 1 = ?",
        ],
        ask: {
          answer: -13.4,
          tolerance: 0.1,
          unit: "%",
          feedback: [
            { value: 0, text: "0% is the simple average of +50% and −50%. Compounding takes the root of the product: √0.75 − 1." },
            { value: -25, text: "−25% is the result over both periods. Per period, take the square root first: √0.75 − 1." },
            { value: 13.4, text: "Right size, wrong sign: √0.75 is 0.866, below 1." },
          ],
          correct: "Right. −13.4% per period: two of those in a row also leave 0.75.",
        },
        after: "The geometric mean is the steady rate that gives the same end result; per year it's called [[cagr|CAGR]]. It's never above the simple average, and bigger swings widen the gap.",
        concept: "volatility-drag",
      },
      {
        kind: "figure",
        title: "Volatility drag",
        figure: {
          kind: "formula",
          boxes: [{ text: "μ = 10% a year" }, { text: "σ²/2 = 0.30² ÷ 2 = 4.5%" }, { text: "g ≈ 5.5%", answer: 5.5, tolerance: 0.05, unit: "%" }],
          operators: ["−", "="],
          steps: ["The average yearly return, μ: 10%.", "Volatility σ of 30%: drag = 0.30² ÷ 2 = 0.045, or 4.5 points.", "Compound growth g ≈ 10% − 4.5%. Type it."],
        },
        text: "That gap is [[volatility-drag|volatility drag]]. A rule of thumb links compound growth g to the average return μ and the volatility σ: g ≈ μ − σ²/2. The swings cost about half the variance every period, even when the average return stays the same.",
        concept: "volatility-drag",
      },
      {
        kind: "worked",
        title: "A 2× fund",
        lines: [
          "An index rises 10%, then falls 9.09%: 1.10 × 0.9091 = 1.000, back where it started.",
          "A 2× [[leveraged-etf|leveraged ETF]] doubles each day's move: +20%, then −18.18%.",
          "The fund: 1.20 × 0.8182 = ?",
        ],
        ask: {
          answer: 0.982,
          tolerance: 0.001,
          feedback: [
            { value: 1, text: "The index is back at 1.000; the fund isn't. Multiply 1.20 by 0.8182." },
            { value: 0.98, text: "Close. Keep three decimals: 1.20 × 0.8182 = 0.982." },
          ],
          correct: "Right. 0.982: the fund lost 1.8% while its index went nowhere.",
        },
        after: "Leverage multiplies the swings, and drag grows with their square: twice the leverage, four times the drag. In choppy markets a daily-reset fund bleeds even when its index ends flat.",
        concept: "volatility-drag",
      },
      {
        kind: "figure",
        title: "One system, three sizes",
        figure: {
          kind: "chart",
          chart: {
            candles: blank(101, 1),
            hideCandles: true,
            scale: "log",
            range: [0.15, 30],
            layers: [{ kind: "level", price: 1, role: "neutral", label: "Start" }],
            describe:
              "Simulated equity over 100 trades on a log scale, as multiples of the start. At 4% risk the median path ends at 3.91 and the 5th percentile at 1.32. At 16% the median ends at 20 and the 5th percentile at 0.34. At 32% the median ends at 1.45.",
          },
          steps: [
            {
              text: "Risking 4% a trade: median 3.91×; the worst 5% of paths end at 1.32× or below.",
              layers: [
                { kind: "path", points: every10(FAN_4_MED), role: "accent", label: "4%" },
                { kind: "path", points: every10(FAN_4_P5), role: "accent", dashed: true },
              ],
            },
            {
              text: "Risking 16%: the median reaches 20×, but the worst 5% end at 0.34× or below.",
              layers: [
                { kind: "path", points: every10(FAN_16_MED), role: "concept", label: "16%" },
                { kind: "path", points: every10(FAN_16_P5), role: "concept", dashed: true },
              ],
            },
            {
              text: "Risking 32%: the median is only 1.45×, and 46% of paths end below the start.",
              layers: [{ kind: "path", points: every10(FAN_32_MED), role: "down", label: "32%" }],
            },
          ],
        },
        text: "The reference system, 40% winners at +2.5R and losers at −1R, over 100 trades: 100,000 simulated paths at three risk levels. Solid lines are the median path; dashed lines mark the worst 5% of paths. Log scale.",
        concept: "time-vs-ensemble-average",
      },
      {
        kind: "callout",
        tone: "key",
        text: "You live one path. At 16% risk, the average of the 100,000 paths ends at 481×, pulled up by a few enormous ones; the median ends at 20×, and 13% of paths lose money. That's the gap between the ensemble average, across traders, and the time average, along your own path.",
      },
      {
        kind: "predict",
        title: "Two equal swings",
        prompt: "Up x%, then down x%, with no trend at all. Find the smallest swing that costs 10% over the two periods.",
        control: {
          kind: "slider",
          min: 0,
          max: 50,
          step: 0.1,
          unit: "%",
          start: 10,
          answer: 31.6,
          tolerance: 0.5,
          feedback: [
            { from: 0, to: 31, text: "Too small. At 20%: 1.20 × 0.80 = 0.96, only 4% lost." },
            { from: 32.2, to: 50, text: "That costs more than 10%. At 40%: 1.40 × 0.60 = 0.84." },
          ],
        },
        reveal: "31.6%. (1 + x)(1 − x) = 1 − x², so 1 − x² = 0.90 and x = √0.10 = 0.316. Drag grows with the square of the swing: double the swing, four times the cost.",
        concept: "volatility-drag",
      },
    ],
    check: ["q-3.12.1-1", "q-3.12.1-2", "q-3.12.1-3"],
    recap: {
      takeaways: [
        "Returns multiply: +50% then −50% leaves 0.75, a geometric mean of −13.4% per period.",
        "Volatility drag: g ≈ μ − σ²/2. A 10% average with 30% volatility compounds near 5.5%.",
        "You live one path: at 16% risk the average ends at 481×, the median at 20×.",
      ],
    },
  },
};

// ─── 3.12.2 · Same trades, different sizing ────────────────────────────────

const L_3_12_2: Lesson = {
  id: "3.12.2",
  title: "Same trades, different sizing",
  topic: "position_sizing",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Fixed units, fixed fractional and fixed ratio send the same trades down different paths; none of them can turn a losing list into a winner.",
  objectives: [
    "Replay one trade list under fixed units, fixed fractional and fixed ratio sizing.",
    "Compute contract counts under fixed ratio for a given delta.",
    "Explain why sizing changes the path and the drawdown but cannot create an edge.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M05", label: "Size Matters" },
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
  ],
  script: {
    unit: "3.12",
    courseId: "3.12.2",
    hook: {
      prompt: "You always buy 100 units of LABX at 50.00. Trade A's stop is 0.50 below, trade B's 1.50 below. How many times bigger is your risk on trade B?",
      control: {
        kind: "slider",
        min: 1,
        max: 5,
        step: 0.5,
        unit: "×",
        start: 1,
        answer: 3,
        tolerance: 0,
        feedback: [{ from: 1, to: 1, text: "Same units, not the same risk: each unit loses three times as much at B's stop." }],
      },
      compare: "You said {yours}. 100 × 0.50 = 50.00 against 100 × 1.50 = 150.00: three times. With both commissions, 54.98 against 154.93.",
      concept: "position-sizing",
    },
    learn: [
      {
        kind: "explain",
        title: "Fix the risk, not the units",
        text: "With fixed units, your risk follows the stop: 50.00 on one trade, 150.00 on the next. Fixed fractional sizing fixes the risk instead: 1% of 10,000.00 buys 181 units for A and 64 for B, commissions included. And because 1% of a smaller account is less, size shrinks after losses and grows after wins: an [[anti-martingale]] rule.",
      },
      {
        kind: "worked",
        title: "How many losses to halve the account?",
        lines: [
          "At risk r per trade, n losses in a row leave (1 − r)^n of the account.",
          "Half is gone when n = ln(0.5) ÷ ln(1 − r). At 1%: 69.0 losses.",
          "At 2%: ln(0.5) ÷ ln(0.98) = ?",
        ],
        ask: {
          answer: 34.3,
          tolerance: 0.1,
          unit: "losses",
          feedback: [
            { value: 50, text: "50 × 2% is 100%, but each loss takes 2% of what's left. Use the formula: ln(0.5) ÷ ln(0.98)." },
            { value: 25, text: "That treats 2% as a fixed slice of the start. Each loss is 2% of a smaller account, so it takes longer." },
          ],
          correct: "Right. 34.3: the 35th loss in a row takes you past −50%.",
        },
        after: "At 5%: 13.5 losses. At 10%: 6.6. Doubling the risk roughly halves the losing run you can take before half the account is gone.",
        concept: "fixed-fractional-sizing",
      },
      {
        kind: "worked",
        title: "Fixed ratio",
        lines: [
          "[[fixed-ratio-sizing|Fixed ratio]] (Ryan Jones) adds one lot each time profit climbs another step: lot N needs Δ × N(N − 1) ÷ 2 of profit.",
          "With Δ = 3,000: 2 lots at 3,000 of profit, 3 at 9,000, 4 at 18,000.",
          "Lots = ½ × (1 + √(1 + 8P ÷ Δ)), rounded down. At P = 10,000 that's 3.13, so ?",
        ],
        ask: {
          answer: 3,
          tolerance: 0,
          unit: "lots",
          feedback: [
            { value: 4, text: "3.13 rounds down. The fourth lot needs 18,000 of profit." },
            { value: 3.33, text: "That's 10,000 ÷ 3,000. The steps grow: lot N needs Δ × N(N − 1) ÷ 2." },
          ],
          correct: "Right. 3 lots, until profit reaches 18,000.",
        },
        after: "Here a lot is a block of risk: 100.00, 1% of the starting account. Each new lot needs a bigger step than the last, so size grows more slowly than profit.",
        concept: "fixed-ratio-sizing",
      },
      {
        kind: "figure",
        title: "Three deltas",
        figure: {
          kind: "chart",
          chart: {
            candles: blank(31, 1),
            hideCandles: true,
            range: [0, 9],
            describe: "Lots traded against cumulative profit from 0 to 30,000. With a delta of 1,000 they climb to 8, with 3,000 to 5, with 5,000 to 4.",
          },
          steps: [
            { text: "Δ = 1,000: a new lot comes quickly. 8 lots by 30,000 of profit.", layers: [{ kind: "line", values: ladder(1000), role: "down", label: "Δ 1,000" }] },
            { text: "Δ = 3,000: 5 lots by 30,000.", layers: [{ kind: "line", values: ladder(3000), role: "accent", label: "Δ 3,000" }] },
            { text: "Δ = 5,000: only 4. A larger delta adds lots more slowly.", layers: [{ kind: "line", values: ladder(5000), role: "concept", label: "Δ 5,000" }] },
          ],
        },
        text: "Lots traded as cumulative profit grows from 0 to 30,000, left to right, for three deltas.",
        concept: "fixed-ratio-sizing",
      },
      {
        kind: "figure",
        title: "Same 100 trades, three rules",
        figure: {
          kind: "chart",
          chart: {
            candles: blank(101, 10000),
            hideCandles: true,
            range: [9000, 25000],
            describe: "Account equity over the same 100 trades under three sizing rules. Fixed units ends at 15,412.50, 1% fixed fractional at 14,691.71, and fixed ratio with a delta of 500 at 23,350.00.",
          },
          steps: [
            { text: "Fixed units: ends at 15,412.50. Deepest drawdown 11.2%.", layers: [{ kind: "line", values: REPLAY_UNITS, role: "neutral", label: "Fixed units" }] },
            { text: "Fixed fractional, 1%: ends at 14,691.71. Deepest drawdown 10.5%.", layers: [{ kind: "line", values: REPLAY_FF, role: "accent", label: "1%" }] },
            { text: "Fixed ratio, Δ = 500: ends at 23,350.00, but its drawdown reaches 17.9%.", layers: [{ kind: "line", values: REPLAY_FR500, role: "concept", label: "Δ 500" }] },
          ],
        },
        text: "One list of 100 reference-system trades: 40 winners at +2.5R, 60 losers at −1R, +40R in all. Fixed units: 100 units, stops 0.50 to 2.00 away. Fixed fractional: 1%. Fixed ratio: lots of 100.00, Δ = 500.",
        concept: "position-sizing",
      },
      {
        kind: "predict",
        title: "Pick the delta",
        prompt: "Same 100 trades. Which is the smallest Δ that keeps fixed ratio's maximum drawdown under 15%?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "600", feedback: "Not quite: lots still pile up fast, and the drawdown reaches 15.3%." },
            { id: "b", label: "750" },
            { id: "c", label: "1,000", feedback: "Inside the limit at 12.1%, but 750 already is, and it ends higher: 19,850.00 against 17,600.00." },
            { id: "d", label: "1,500", feedback: "9.7%, well inside, but growth suffers: 15,700.00. A smaller delta already meets the limit." },
          ],
          answer: "b",
        },
        reveal: "750: drawdown 14.4%, final 19,850.00. A larger delta cuts the drawdown and the growth together: at 1,500, 9.7% and 15,700.00. Check the drawdown first, then the final equity.",
        concept: "fixed-ratio-sizing",
      },
      {
        kind: "predict",
        title: "A breakeven system",
        prompt: "A system breaks even before costs: 40% winners at +1.5R, losers at −1R. Costs take 0.05R a trade. Which sizing rule makes it profitable?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Fixed fractional: it bets more after wins", feedback: "It also bets less after losses. Over 10,000 simulated lists of 100 trades, its median ended at 9,441.28." },
            { id: "b", label: "Fixed ratio: it adds lots only from profit", feedback: "With a losing average trade, profit rarely comes. With Δ = 1,000, its median ended at 9,500.00 over the same 10,000 lists." },
            { id: "c", label: "None of them" },
          ],
          answer: "c",
        },
        reveal: "None. Over 10,000 simulated lists, every rule's median ended below 10,000.00: 9,408.75 with fixed units, 9,441.28 with 1%, 9,500.00 with fixed ratio at Δ = 1,000. About a third of lists ended up under each rule: luck of the order, not sizing.",
        concept: "position-sizing",
      },
      {
        kind: "callout",
        tone: "key",
        text: "No formula gives the best delta; in practice it's set from the drawdown you'd accept per lot. And no sizing rule wins a game without an edge: anti-martingale schemes only reshape the path. Write your sizing rule in your plan, apart from your entry signal.",
      },
    ],
    check: ["q-3.12.2-1", "q-3.12.2-2", "q-3.12.2-3"],
    recap: {
      takeaways: [
        "Fixed units let risk follow the stop. Fixed fractional fixes it: 181 units or 64, both about 100.00.",
        "Fixed ratio: lot N needs Δ × N(N − 1) ÷ 2 of profit, so size grows slowly.",
        "Sizing reshapes the path and the drawdown. It can't turn a losing list into a winner.",
      ],
    },
  },
};

// ─── 3.12.3 · The Kelly criterion ──────────────────────────────────────────

const L_3_12_3: Lesson = {
  id: "3.12.3",
  title: "The Kelly criterion",
  topic: "position_sizing",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "The Kelly fraction maximises long-run growth for a known edge; above it growth falls, and near twice Kelly it stops.",
  objectives: [
    "Compute the Kelly fraction from the win rate and the payoff ratio.",
    "Read the growth curve g(f) and place full, half and double Kelly on it.",
    "Explain why betting above Kelly lowers growth even with a positive edge.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M05", label: "Size Matters" },
    { kind: "check", ref: "position_sizing", label: "Knowledge check: position sizing" },
  ],
  script: {
    unit: "3.12",
    courseId: "3.12.3",
    hook: {
      prompt: "You win 55% of trades; winners pay 1.5R and losers cost 1R. What fraction of equity should you risk per trade to grow fastest in the long run?",
      control: {
        kind: "slider",
        min: 0,
        max: 60,
        step: 1,
        unit: "%",
        start: 0,
        answer: 25,
        tolerance: 1,
        feedback: [
          { from: 0, to: 15, text: "Safe, but slower than it could be: long-run growth keeps rising up to 25%." },
          { from: 35, to: 60, text: "Too much. Past 25% growth falls, and above about 49% it turns negative, even with this edge." },
        ],
      },
      compare: "You said {yours}. The Kelly fraction is 0.55 − 0.45 ÷ 1.5 = 25%. Long-run growth peaks there and falls on either side.",
      concept: "kelly-criterion",
    },
    learn: [
      {
        kind: "worked",
        title: "The Kelly fraction",
        lines: ["[[kelly-criterion|Kelly]]: f* = W − (1 − W) ÷ b, with W the win rate and b the payoff in R.", "W = 0.55 and b = 1.5: f* = 0.55 − 0.45 ÷ 1.5 = ?"],
        ask: {
          answer: 0.25,
          tolerance: 0.005,
          feedback: [
            { value: 0.1, text: "That's 0.55 − 0.45. Divide first: 0.45 ÷ 1.5 = 0.30." },
            { value: 25, text: "25% is right. Type it as a fraction here: 0.25." },
          ],
          correct: "Right. 0.25: risk 25% of equity per trade, if the edge is exactly right.",
        },
        after: "Another way to see it: the edge per trade is 0.55 × 1.5 − 0.45 = +0.375R, and Kelly = edge ÷ payoff = 0.375 ÷ 1.5 = 0.25.",
        concept: "kelly-criterion",
      },
      {
        kind: "figure",
        title: "The growth curve",
        figure: {
          kind: "chart",
          chart: {
            candles: blank(121, 0),
            hideCandles: true,
            range: [-0.065, 0.055],
            layers: [
              { kind: "level", price: 0, role: "neutral", label: "Zero growth" },
              { kind: "line", values: KELLY_G, role: "accent", label: "g(f)" },
            ],
            describe: "The growth curve for 55% winners at 1.5R, for f from 0 to 60%. It rises to a peak of 0.0457 at 25%, is 0.0344 at 12.5%, crosses zero near 49% and is negative beyond.",
          },
          steps: [
            { text: "Half Kelly, 12.5%: g = 0.0344 per trade, 75% of the peak.", layers: [{ kind: "marker", index: 25, price: 0.0344, label: "½ Kelly", role: "up" }] },
            { text: "Full Kelly, 25%: g = 0.0457, the top of the curve.", layers: [{ kind: "marker", index: 50, price: 0.0457, label: "Full Kelly", role: "accent" }] },
            { text: "Twice Kelly, 50%: g = −0.0041. A positive edge, and the account shrinks.", layers: [{ kind: "marker", index: 100, price: -0.0041, label: "2× Kelly", role: "down" }] },
            { text: "Growth crosses zero near 49%, just under twice Kelly.", layers: [{ kind: "marker", index: 98, price: 0, label: "Zero", role: "neutral" }] },
          ],
        },
        text: "[[growth-rate|Growth per trade]], the average log gain, for every fraction f from 0 to 60%, left to right: g(f) = W · ln(1 + f · b) + (1 − W) · ln(1 − f). Here W = 0.55 and b = 1.5.",
        concept: "kelly-criterion",
      },
      {
        kind: "worked",
        title: "Kelly for the reference system",
        lines: ["In trading, f is the share of equity lost when the stop is hit, not the position's value.", "Reference system: W = 0.40, b = 2.5.", "f* = 0.40 − 0.60 ÷ 2.5 = ?"],
        ask: {
          answer: 0.16,
          tolerance: 0.005,
          feedback: [
            { value: 0.24, text: "0.60 ÷ 2.5 = 0.24 is the part you subtract: f* = 0.40 − 0.24." },
            { value: 16, text: "16% is right. Type it as a fraction: 0.16." },
          ],
          correct: "Right. 0.16: 16% of equity at risk on every trade.",
        },
        after: "Simulated over 100 trades, [[full-kelly|full Kelly]] here has a median maximum drawdown of 82.7%, and the worst 5% of paths end at 0.34× their start or below. Mathematically optimal, and almost impossible to live through.",
        concept: "kelly-criterion",
      },
      {
        kind: "predict",
        title: "Where growth stops",
        prompt: "Reference system, full Kelly 16%. Raise the risk per trade until long-run growth falls back to zero. Where does that happen?",
        control: {
          kind: "slider",
          min: 16,
          max: 60,
          step: 1,
          unit: "%",
          start: 16,
          answer: 33,
          tolerance: 1,
          feedback: [
            { from: 16, to: 31, text: "Growth is still positive there: at 30%, g = +0.0098 per trade. Keep going right." },
            { from: 35, to: 60, text: "Past it: growth is already negative at 34%, g = −0.0032." },
          ],
        },
        reveal: "About 33%: g = +0.0003 at 33% and −0.0032 at 34%. Twice Kelly, 32%, barely grows: after 100 trades its median path ends at 1.45×, and 46% of paths end below the start.",
        concept: "kelly-criterion",
      },
      {
        kind: "explain",
        title: "Kelly for returns",
        text: "For a position with continuous returns, Kelly becomes a leverage: f* ≈ μ ÷ σ². An 8% expected excess return with 20% volatility gives 0.08 ÷ 0.04 = 2× leverage. The same warning applies: μ is a guess, and a small error in it moves the answer a lot.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Kelly is a ceiling, not a target. It assumes the edge is known exactly, trades are independent and payoffs are fixed. In trading none of that holds, and an edge you overestimate pushes you past the peak, where growth falls. The next lesson measures that cost.",
      },
    ],
    check: ["q-3.12.3-1", "q-3.12.3-2", "q-3.12.3-3"],
    recap: {
      takeaways: [
        "Kelly: f* = W − (1 − W) ÷ b. The reference system gives 16% per trade.",
        "Growth peaks at full Kelly; half Kelly keeps 75% of it. Twice Kelly grows almost nothing.",
        "Kelly is a ceiling: it assumes a known edge, independent trades and fixed payoffs.",
      ],
    },
  },
};

// ─── 3.12.4 · Fractional Kelly and optimal f ───────────────────────────────

const L_3_12_4: Lesson = {
  id: "3.12.4",
  title: "Fractional Kelly and optimal f",
  topic: "position_sizing",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "A fraction of Kelly survives an overestimated edge, and optimal f is fitted to the past list's worst loss; choose the size by the drawdown you accept.",
  objectives: [
    "Show how an overestimated edge turns full Kelly into over-betting.",
    "Compute optimal f on a trade list and the account size per contract it implies.",
    "Choose a fraction of Kelly or of optimal f and justify it with drawdown, not with growth.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M05", label: "Size Matters" },
    { kind: "check", ref: "position_sizing", label: "Knowledge check: position sizing" },
  ],
  script: {
    unit: "3.12",
    courseId: "3.12.4",
    hook: {
      prompt: "You estimated a 55% win rate at 1.5R, so Kelly said 25%. The true win rate is 45%. Risking 25% per trade, your long-run growth is…",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Smaller, but positive" },
          { id: "b", label: "About zero" },
          { id: "c", label: "Negative" },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. At a true 45%, risking 25% gives g = −0.0149 per trade: the account shrinks. Half Kelly, 12.5%, still grows, at +0.0039.",
      concept: "fractional-kelly",
    },
    learn: [
      {
        kind: "worked",
        title: "An edge that isn't there",
        lines: [
          "Estimated: W 0.55 at b 1.5, so Kelly said 25%. Half Kelly is 12.5%.",
          "If the true W is 0.50: true Kelly 16.7%. Growth at 25%: 0.0154; at 12.5%: 0.0192.",
          "If the true W is 0.45: true Kelly = 0.45 − 0.55 ÷ 1.5 = ?",
        ],
        ask: {
          answer: 0.083,
          tolerance: 0.001,
          feedback: [
            { value: 0.25, text: "That's Kelly for the estimated 55%. Use the true win rate, 0.45, and its losing rate, 0.55." },
            { value: 8.3, text: "8.3% is right. Type it as a fraction: 0.083." },
          ],
          correct: "Right. 0.083: at a true 45%, Kelly is only 8.3%.",
        },
        after: "Betting 25% is three times true Kelly: g = −0.0149, and the account shrinks. Half Kelly still grows, at +0.0039. A fraction of Kelly survives the mistake; full Kelly doesn't.",
        concept: "fractional-kelly",
      },
      {
        kind: "figure",
        title: "Fractions of Kelly",
        figure: {
          kind: "bars",
          bars: [
            { label: "¼ Kelly, 4%", value: 30.7, role: "down" },
            { label: "½ Kelly, 8%", value: 53, role: "down" },
            { label: "Full Kelly, 16%", value: 82.7, role: "down" },
            { label: "2× Kelly, 32%", value: 99.3, role: "down" },
          ],
          unit: "%",
          steps: [
            "¼ Kelly, 4%: median path 3.91×, median drawdown 30.7%.",
            "½ Kelly, 8%: median path 9.88×, median drawdown 53.0%.",
            "Full Kelly, 16%: median path 20.0×, median drawdown 82.7%.",
            "2× Kelly, 32%: median path 1.45×, median drawdown 99.3%.",
          ],
        },
        text: "[[fractional-kelly|Fractional Kelly]] on the reference system: the median maximum drawdown over 100 trades, from 100,000 simulated paths. Half Kelly keeps 76% of full Kelly's growth rate per trade.",
        concept: "fractional-kelly",
      },
      {
        kind: "explain",
        title: "Why a fraction",
        text: "Half Kelly keeps most of the growth with far shallower drawdowns; a quarter is a common choice. There's a second reason: an edge measured in-sample is usually bigger than the real one, because the best-looking results regress toward the mean. A fraction leaves room for that error. Choose it by the drawdown you can live through.",
      },
      {
        kind: "worked",
        title: "Optimal f",
        lines: [
          "[[optimal-f|Optimal f]] (Ralph Vince) works on a past trade list, in vUSD per contract: +300, −100, +200, −100, −100, +150, −100, +250, −100, +100.",
          "Each trade's [[hpr|HPR]] = 1 + f × trade ÷ 100, where 100 is the largest loss.",
          "The [[twr|TWR]] multiplies all ten HPRs. It peaks at f = 0.239, with TWR 1.74.",
          "Equity per contract = largest loss ÷ f = 100 ÷ 0.239 = ?",
        ],
        ask: {
          answer: 418,
          tolerance: 1,
          unit: "vUSD",
          feedback: [{ value: 23.9, text: "That's 100 × 0.239. Divide the largest loss by f: 100 ÷ 0.239." }],
          correct: "Right. About 418 vUSD of equity per contract: 23 contracts on 10,000.00.",
        },
        after: "On the same list, f = 0.4 gives TWR 1.38 and f = 0.6 gives 0.48. Same trades: past the peak, more size means less money.",
        concept: "optimal-f",
      },
      {
        kind: "figure",
        title: "The TWR hump",
        figure: {
          kind: "chart",
          chart: {
            candles: blank(81, 1),
            hideCandles: true,
            range: [0, 2],
            layers: [
              { kind: "level", price: 1, role: "neutral", label: "Break-even" },
              { kind: "line", values: TWR_CURVE, role: "accent", label: "TWR" },
            ],
            describe: "TWR of the ten-trade list for f from 0 to 0.80. It rises from 1 to a peak of 1.74 near 0.24, falls back to 1 near 0.48 and reaches 0.48 at 0.6.",
          },
          steps: [
            { text: "f = 0.239: TWR 1.74, the peak. The list would have grown 74%.", layers: [{ kind: "marker", index: 24, price: 1.74, label: "Optimal f", role: "up" }] },
            { text: "f = 0.4: TWR 1.38. Same trades, less growth.", layers: [{ kind: "marker", index: 40, price: 1.38, label: "0.4", role: "accent" }] },
            { text: "f = 0.6: TWR 0.48. Same trades, and over half the account is gone.", layers: [{ kind: "marker", index: 60, price: 0.48, label: "0.6", role: "down" }] },
          ],
        },
        text: "TWR on the ten-trade list for every f from 0 to 0.80, left to right.",
        concept: "optimal-f",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Optimal f is fitted to the past: it hangs on the largest loss so far, and the next one can be bigger. A loss of 150 per contract, 1.5 times the worst, costs 35.9% of equity in a single trade at f = 0.239.",
      },
      {
        kind: "predict",
        title: "A safer f",
        prompt: "Plan for a future loss 1.5 times the worst: 150 per contract. What's the largest f that keeps that one loss within 10% of equity?",
        control: {
          kind: "numeric",
          answer: 0.0667,
          tolerance: 0.001,
          feedback: [
            { value: 0.1, text: "At 0.1, a loss of 1.5 times the worst costs 15% of equity." },
            { value: 0.239, text: "That's optimal f itself: the loss would cost 35.9%." },
            { value: 6.67, text: "6.67% is right. Type it as a fraction: 0.0667." },
          ],
        },
        reveal: "0.0667 = 0.10 ÷ 1.5. That's 28% of optimal f, close to a quarter, and the past list still grows: TWR 1.32 instead of 1.74. You give up some growth to survive a loss the list hasn't shown yet.",
        concept: "optimal-f",
      },
    ],
    check: ["q-3.12.4-1", "q-3.12.4-2", "q-3.12.4-3"],
    recap: {
      takeaways: [
        "An overestimated edge turns full Kelly into over-betting: 25% at a true 45% shrinks the account.",
        "Optimal f peaks the past list's TWR: f 0.239, one contract per 418 vUSD.",
        "Choose a fraction by the drawdown you accept: half Kelly keeps 76% of the growth.",
      ],
    },
  },
};

// ─── 3.12.5 · Risk of ruin, defined honestly ───────────────────────────────

const L_3_12_5: Lesson = {
  id: "3.12.5",
  title: "Risk of ruin, defined honestly",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Define ruin as the drawdown at which you'd stop, estimate its chance by Monte Carlo, and size so it stays under 1%.",
  objectives: [
    "Compute risk of ruin with the even-payoff formula and know when it stops applying.",
    "Define ruin as the drawdown at which you would stop trading, not as zero.",
    "Estimate risk of ruin by Monte Carlo for your own system and size so it stays under 1%.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M04", label: "Define Your Risk" },
    { kind: "check", ref: "risk_management", label: "Knowledge check: risk management" },
  ],
  script: {
    unit: "3.12",
    courseId: "3.12.5",
    hook: {
      prompt: "Reference system, 4% risk per trade, 100 trades. What's the chance of hitting a 30% drawdown at least once?",
      control: {
        kind: "slider",
        min: 0,
        max: 100,
        step: 1,
        unit: "%",
        start: 0,
        answer: 52,
        tolerance: 2,
        feedback: [{ from: 0, to: 25, text: "Much higher. A quarter of Kelly sounds cautious, but 4% a trade digs deep holes." }],
      },
      compare: "You said {yours}. In 100,000 simulated paths, 51.8% hit a 30% drawdown within 100 trades: a coin flip, at a quarter of Kelly.",
      concept: "risk-of-ruin",
    },
    learn: [
      {
        kind: "worked",
        title: "The textbook formula",
        lines: [
          "Even payoffs, a fixed stake and N stakes of capital: [[risk-of-ruin|risk of ruin]] = ((1 − W) ÷ W)^N.",
          "W 60%, N 10: (0.40 ÷ 0.60)^10 = 1.7%. With N 100: 2.5 × 10^−18.",
          "W 55%, N 20: (0.45 ÷ 0.55)^20 = ?",
        ],
        ask: {
          answer: 1.8,
          tolerance: 0.05,
          unit: "%",
          feedback: [
            { value: 0.018, text: "That's the probability as a fraction. Type it in %: 1.8." },
            { value: 0.82, text: "0.82 is the ratio itself. Raise it to the 20th power." },
          ],
          correct: "Right. 1.8%: about one ruin in 55 tries.",
        },
        after: "The formula assumes a fixed stake: every loss costs one unit, however small the account gets. With fixed fractional sizing the stake shrinks after losses, the account never quite reaches zero, and the formula stops applying.",
        concept: "risk-of-ruin",
      },
      {
        kind: "explain",
        title: "Ruin is where you'd stop",
        text: "So define ruin honestly: the drawdown at which you would stop trading, your [[ruin-threshold|ruin threshold]]. It might be 25%, 30% or 50%, set by your account, your rules or your nerves. The lower the threshold, the higher the risk of ruin at the same size per trade.",
      },
      {
        kind: "figure",
        title: "A 30% threshold",
        figure: {
          kind: "bars",
          bars: [
            { label: "1% risk", value: 0.004, role: "accent" },
            { label: "2% risk", value: 3.1, role: "accent" },
            { label: "4% risk", value: 51.8, role: "down" },
            { label: "8% risk", value: 99, role: "down" },
          ],
          unit: "%",
          steps: [
            "1% risk: 4 paths in 100,000 hit a 30% drawdown.",
            "2% risk: 3.1%, about 1 path in 33.",
            "4% risk, a quarter of Kelly: 51.8%, a coin flip.",
            "8% risk, half Kelly: 99.0%, close to certain.",
          ],
        },
        text: "Reference system, ruin at a 30% drawdown: the share of 100,000 simulated paths that hit it within 100 trades.",
        concept: "risk-of-ruin",
      },
      {
        kind: "predict",
        title: "Two thresholds",
        prompt: "Same system at 2% risk. Trader A stops at a 25% drawdown, trader B at 50%. What's each one's chance of ruin within 100 trades?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "About 3% for both", feedback: "3.1% is for a 30% threshold. Move the threshold and the answer moves a lot." },
            { id: "b", label: "A 9.2%, B 0.004%" },
            { id: "c", label: "A 0.004%, B 9.2%", feedback: "Reversed. A deeper threshold is harder to reach, so B's chance is the smaller one." },
          ],
          answer: "b",
        },
        reveal: "A: 9.2%. B: 0.004%, 4 paths in 100,000. Same system, same size: the chance of ruin depends on where you'd stop. Set the threshold before the drawdown, then size for it.",
        concept: "risk-of-ruin",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "These numbers assume independent trades, fixed payoffs and a known win rate. Real outcomes can cluster, payoffs vary, and an in-sample win rate is usually too high. For your own system, run the Monte Carlo on out-of-sample trades, resampled many times, and size from that.",
      },
      {
        kind: "predict",
        title: "The ceiling",
        prompt: "Reference system, ruin at a 30% drawdown, 100 trades. What's the largest risk per trade that keeps the chance of ruin under 1%?",
        control: {
          kind: "slider",
          min: 1,
          max: 3,
          step: 0.1,
          unit: "%",
          start: 1,
          answer: 1.6,
          tolerance: 0,
          feedback: [
            { from: 1, to: 1.5, text: "Inside the limit, but you can go higher: at 1.5%, 0.37% of paths hit 30%." },
            { from: 1.7, to: 3, text: "Over the limit: 1.05% of paths at 1.7%, 3.1% at 2%." },
          ],
        },
        reveal: "1.6%: 0.66% of paths hit a 30% drawdown; at 1.7%, 1.05%. That's a tenth of Kelly. For this system and this threshold, 1.6% is the ceiling, not the target.",
        concept: "risk-of-ruin",
      },
      {
        kind: "fields",
        title: "Your ruin threshold",
        prompt: "Write your own threshold into your plan now, before any drawdown, with the risk-per-trade ceiling you'll check with a Monte Carlo of your trades.",
        fields: [
          { id: "ruinThreshold", label: "Ruin threshold: the drawdown at which I stop", kind: "choice", options: [20, 25, 30, 40, 50], unit: "%", default: 30 },
          { id: "riskCeiling", label: "Risk-per-trade ceiling", kind: "stepper", min: 0.25, max: 3, step: 0.25, unit: "%", default: 1 },
        ],
        correct: "Saved. Before you use the ceiling, check it: under a 1% chance of reaching your threshold in 100 out-of-sample trades.",
        concept: "risk-of-ruin",
      },
    ],
    check: ["q-3.12.5-1", "q-3.12.5-2", "q-3.12.5-3"],
    recap: {
      takeaways: [
        "((1 − W) ÷ W)^N needs a fixed stake. Fixed fractional never reaches zero, so the formula stops applying.",
        "Ruin is the drawdown where you'd stop. At 2% risk: 9.2% for 25%, 0.004% for 50%.",
        "Size so a Monte Carlo keeps ruin under 1%: 1.6% for the reference system at 30%.",
      ],
    },
  },
};

// ─── 3.12.6 · Volatility targeting ─────────────────────────────────────────

const L_3_12_6: Lesson = {
  id: "3.12.6",
  title: "Volatility targeting",
  topic: "position_sizing",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Size a position so its normal daily swing fits a fixed budget, resize as the forecast changes, and cap exposure for calm spells.",
  objectives: [
    "Size a position so its expected daily swing matches a volatility budget.",
    "Rescale exposure when the volatility forecast changes.",
    "Explain the lag problem when volatility jumps faster than the forecast.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
    { kind: "arena", ref: "low_volatility", label: "Arena: low volatility" },
  ],
  script: {
    unit: "3.12",
    courseId: "3.12.6",
    hook: {
      prompt: "Your account is 10,000 vUSD and your volatility budget is 0.63% a day, about 10% a year. LABX moves about 1.50 vUSD a day, one standard deviation. How many units fit the budget?",
      control: {
        kind: "slider",
        min: 0,
        max: 200,
        step: 1,
        unit: "units",
        start: 0,
        answer: 42,
        tolerance: 0,
        feedback: [{ from: 63, to: 63, text: "63.00 is the budget in vUSD. Divide it by how far one unit moves in a day, 1.50." }],
      },
      compare: "You said {yours}. The budget is 0.63% × 10,000 = 63.00 a day, and 63.00 ÷ 1.50 = 42 units: about 4,200.00 of LABX at 100.00.",
      concept: "volatility-targeting",
    },
    learn: [
      {
        kind: "worked",
        title: "From a yearly target to units",
        lines: [
          "[[volatility-target|Target]]: 10% a year. A year has about 252 trading days, so 10% ÷ √252 = 0.63% a day.",
          "Daily budget: 0.63% × 10,000.00 = 63.00.",
          "Units = 63.00 ÷ 1.50 = ?",
        ],
        ask: {
          answer: 42,
          tolerance: 0,
          unit: "units",
          feedback: [
            { value: 41, text: "41 comes from the unrounded budget, 62.99. Here the plan fixes the budget at 63.00." },
            { value: 63, text: "63.00 is the budget in vUSD. Divide it by the daily move per unit, 1.50." },
          ],
          correct: "Right. 42 units: on a normal day the position moves about 63.00 either way.",
        },
        after: "Unrounded, 10% ÷ √252 gives 62.99, and 62.99 ÷ 1.50 = 41.99: 41 units after rounding down. That's why the plan fixes the budget in vUSD instead of recomputing it each time. 42 units at 100.00 is 4,200.00 of exposure.",
        concept: "volatility-targeting",
      },
      {
        kind: "predict",
        title: "Volatility doubles",
        prompt: "Your [[volatility-forecast|forecast]] for LABX doubles to 3.00 a day. The budget stays 63.00. How many units now?",
        control: {
          kind: "numeric",
          unit: "units",
          answer: 21,
          tolerance: 0,
          feedback: [
            { value: 84, text: "That doubles the units. When volatility doubles, the same budget buys half as many." },
            { value: 42, text: "42 units would now swing about 126.00 a day, twice the budget." },
          ],
        },
        reveal: "21 units: 63.00 ÷ 3.00. Exposure halves to about 2,100.00, and the normal daily swing stays at 63.00. As volatility rises, the position shrinks; as it falls, the position grows.",
        concept: "volatility-targeting",
      },
      {
        kind: "explain",
        title: "Scale, ATR and the stop",
        text: "In general, exposure scales by target ÷ forecast: a 10% target on an asset forecast at 16% a year means 0.625 times full exposure. It's the idea behind [[atr|ATR]] sizing in 2.4 and the Turtles' N in 3.13.1. Volatility targeting sets the size of normal swings; the stop sets the loss when you're wrong. Use both.",
      },
      {
        kind: "figure",
        title: "When volatility jumps",
        figure: {
          kind: "chart",
          chart: {
            candles: blank(60, 0),
            hideCandles: true,
            range: [-270, 130],
            layers: [
              { kind: "zone", from: -63, to: 63, role: "concept", label: "Budget ±63.00" },
              { kind: "level", price: 0, role: "neutral" },
            ],
            describe: "Daily P&L of the LABX position over 60 simulated days. For 30 days it mostly stays within plus or minus 63.00. On day 31 it loses 252.00, and for about two weeks the swings run near twice the budget.",
          },
          steps: [
            { text: "Days 1–30: 40 to 52 units. Daily P&L mostly stays inside the 63.00 band.", layers: [{ kind: "line", values: VOL_PNL.map((v, i) => (i < 30 ? v : null)), role: "accent" }] },
            {
              text: "Day 31: a 6.00 drop hits 42 units. −252.00, four times the budget.",
              layers: [
                { kind: "line", values: VOL_PNL.map((v, i) => (i >= 29 ? v : null)), role: "accent" },
                { kind: "marker", index: 30, price: -252, label: "−252.00", role: "down" },
              ],
            },
            {
              text: "The 20-day forecast catches up slowly: 30 units on day 33, 18 by day 45.",
              layers: [
                { kind: "marker", index: 32, price: VOL_PNL[32], label: "30 units", role: "neutral" },
                { kind: "marker", index: 44, price: VOL_PNL[44], label: "18 units", role: "neutral" },
              ],
            },
            { text: "Days 31–45: the typical daily swing was 113.41, almost twice the budget.", layers: [{ kind: "bracket", from: -113.41, to: 113.41, index: 37, label: "±113.41", role: "down" }] },
          ],
        },
        text: "A simulated 60 days of LABX. Each day, units = 63.00 ÷ the 20-day forecast. Daily volatility is 1.50 for 30 days, then 3.00, starting with a 6.00 drop. The line is the position's daily P&L.",
        concept: "volatility-targeting",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "The reverse happens in long calm spells: the forecast falls and units climb. At a forecast of 0.50, 63.00 asks for 126 units, more than 10,000.00 can hold at 100.00. That's [[leverage-creep|leverage creep]]. Put a cap on exposure in your plan; here, buying power stops you at 99 units.",
      },
      {
        kind: "match",
        title: "Monday rebalance",
        prompt: "Each Monday you resize LABX, at 100.00, to the new forecast. Budget 63.00, account 10,000.00. Match each forecast to your units.",
        pairs: [
          { left: "Forecast 1.50 a day", right: "42 units" },
          { left: "Forecast 2.10 a day", right: "30 units" },
          { left: "Forecast 3.00 a day", right: "21 units" },
          { left: "Forecast 1.20 a day", right: "52 units", wrong: "63.00 ÷ 1.20 = 52.5, and units round down: 52." },
          { left: "Forecast 0.50 a day", right: "99 units, the buying-power cap", wrong: "63.00 ÷ 0.50 = 126, but 10,000.00 holds at most 99 units at 100.00. The cap wins." },
        ],
        columns: ["Forecast", "Units"],
        correct: "All five. Units = budget ÷ forecast, rounded down, and never above the cap.",
        concept: "volatility-targeting",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Volatility targeting for a whole portfolio, with gross and net exposure across several assets, comes in 4.4.",
      },
    ],
    check: ["q-3.12.6-1", "q-3.12.6-2", "q-3.12.6-3"],
    recap: {
      takeaways: [
        "Units = daily budget ÷ forecast daily move: 63.00 ÷ 1.50 = 42 units of LABX.",
        "When the forecast doubles, units halve: 21 at 3.00. Resize on a fixed schedule.",
        "Forecasts lag jumps: day 31 cost 252.00. In calm spells, cap exposure.",
      ],
    },
  },
};

// ─── 3.12.7 · Equity-curve trading ─────────────────────────────────────────

const L_3_12_7: Lesson = {
  id: "3.12.7",
  title: "Equity-curve trading",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 6,
  summary: "Pausing a system below its own equity average helps only when outcomes cluster; keep shadow trades, and fix the average in advance.",
  objectives: [
    "Apply an equity-curve filter and keep tracking shadow trades while paused.",
    "Measure what the filter saved and what it missed.",
    "Predict when a filter helps (clustered outcomes) and when it hurts (trend following, independent trades).",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "check", ref: "risk_management", label: "Knowledge check: risk management" },
  ],
  script: {
    unit: "3.12",
    courseId: "3.12.7",
    hook: {
      prompt: "A trend-following system pauses whenever its equity is below its 20-trade average. Over 10 synthetic years, does it end with more or less than the unfiltered system?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "More" },
          { id: "b", label: "Less" },
          { id: "c", label: "The same" },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. Less, in 92.7% of 4,000 simulated 10-year runs: a median of +14R with the filter against +48R without. Its big wins tend to come right after losing runs, while it's paused.",
      concept: "equity-curve-filter",
    },
    learn: [
      {
        kind: "explain",
        title: "The filter",
        text: "An [[equity-curve-filter|equity-curve filter]] trades live only while the system's equity is above its own average over the last 20 trades. Below it, you pause, but keep recording every signal as [[shadow-trades|shadow trades]]. The shadow equity tells you when to resume: without it, you couldn't see the system recover.",
      },
      {
        kind: "figure",
        title: "Paused through the wins",
        figure: {
          kind: "chart",
          chart: {
            candles: FILTER_CANDLES,
            style: "line",
            describe:
              "Equity in R over 60 trades with its 20-trade average. After trade 20 the equity is below the average; trades 21 to 27 and 29 are shadow trades, including wins on trades 24, 27 and 29. The shadow system ends at +16R, the live one at +12R.",
          },
          steps: [
            { text: "Equity in R, trade by trade, with its 20-trade average.", layers: [{ kind: "ma", period: 20, role: "concept", label: "20-trade average" }] },
            { text: "After trade 20, equity is below the average: trades 21–27 go to the shadow list.", layers: [{ kind: "marker", index: 19, at: "close", label: "Pause", role: "neutral" }] },
            {
              text: "Trades 24 and 27 win +3R each, in the shadow only. So does trade 29.",
              layers: [
                { kind: "marker", index: 23, at: "close", label: "+3R missed", role: "down" },
                { kind: "marker", index: 26, at: "close", role: "down" },
                { kind: "marker", index: 28, at: "close", role: "down" },
              ],
            },
            { text: "Live equity, dashed: +12R at the end, against +16R for the shadow system.", layers: [{ kind: "line", values: FILTER_LIVE.slice(1), role: "accent", dashed: true, label: "Live" }] },
          ],
        },
        text: "60 trades of a synthetic trend-following system, in R. Its chance of a +3R win rises with every loss in a row: trends tend to arrive after long chop.",
        concept: "equity-curve-filter",
      },
      {
        kind: "figure",
        title: "Three kinds of lists",
        figure: {
          kind: "bars",
          bars: [
            { label: "Clustered, no filter", value: 61, role: "neutral" },
            { label: "Clustered, filter", value: 87, role: "up" },
            { label: "Independent, no filter", value: 200, role: "neutral" },
            { label: "Independent, filter", value: 161.5, role: "down" },
            { label: "Trend following, no filter", value: 48, role: "neutral" },
            { label: "Trend following, filter", value: 14, role: "down" },
          ],
          unit: "R",
          steps: [
            "Clustered outcomes: +61R becomes +87R, and the median drawdown falls from 37R to 14R.",
            "Independent outcomes: fewer trades, +200R becomes +161.5R, and the drawdown barely moves: 13.5R to 13R.",
            "Trend following: +48R becomes +14R, and the drawdown doesn't improve: 26R to 27R.",
          ],
        },
        text: "Median results over 4,000 simulated lists of 500 trades each, with and without the 20-trade filter.",
        concept: "equity-curve-filter",
      },
      {
        kind: "match",
        title: "When does it help?",
        prompt: "Match each kind of trade list to what the filter does to it.",
        pairs: [
          { left: "Wins and losses come in long streaks", right: "Helps: it sits out the bad streaks" },
          { left: "Big wins tend to follow losing runs", right: "Hurts: it's paused when they arrive" },
          { left: "Each trade is independent of the last", right: "No gain: fewer trades, same drawdown" },
        ],
        columns: ["Trade list", "Filter"],
        correct: "Right. The filter only works when the recent past says something about the next trade.",
        concept: "equity-curve-filter",
      },
      {
        kind: "predict",
        title: "Should you add it?",
        prompt: "Your system's runs test, from 3.10.7, gives z = 0.4: no sign that its outcomes cluster. Should you add the equity-curve filter?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "Yes: a filter can only cut drawdowns", feedback: "Not on independent trades: the median drawdown barely moved, 13.5R to 13R, and 38.5R of profit was lost." },
            { id: "b", label: "No: with independent outcomes it only skips trades" },
            { id: "c", label: "Yes, once you've tested averages from 5 to 50 trades", feedback: "Picking the best of many lengths fits past noise: the overfitting of 3.11.5." },
          ],
          answer: "b",
        },
        reveal: "No. With |z| under 1.96 there's no evidence of clustering, so the filter mostly removes trades with the same edge as the rest. Write the rejection into your plan, with the z you measured.",
        concept: "equity-curve-filter",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Testing average lengths from 5 to 50 and keeping the best is overfitting (3.11.5): the winner fits this sample's noise. And the filter isn't the drawdown tiers of 2.11, which cut size at set depths, or the kill switch of 3.11.10, which retires a system that stopped working.",
      },
    ],
    check: ["q-3.12.7-1", "q-3.12.7-2", "q-3.12.7-3"],
    recap: {
      takeaways: [
        "Pause below the 20-trade average, but keep shadow trades: they tell you when to resume.",
        "Measure both sides: the drawdown the filter saved and the R it missed.",
        "It helps clustered outcomes, hurts trend following, and only costs R on independent trades.",
      ],
    },
  },
};

// ─── Check questions ───────────────────────────────────────────────────────

/** ln(0.5) ÷ ln(1 − r) without logarithms: −ln(1 − x) = x + x²/2 + … + x⁹/9 (error below 1e-10 for x ≤ 0.10). */
const HALVING = "round(0.693147 / ((r / 100) + (r / 100) * (r / 100) / 2 + (r / 100) * (r / 100) * (r / 100) / 3 + (r / 100) * (r / 100) * (r / 100) * (r / 100) / 4 + (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) / 5 + (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) / 6 + (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) / 7 + (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) / 8 + (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) * (r / 100) / 9), 1)";
/** ((100 − w) ÷ w) to the power n, for n = 10, 15 or 20, in %. */
const RUIN_POW = (n: number) => Array.from({ length: n }, () => "((100 - w) / w)").join(" * ");
const RUIN = `round(100 * ((n == 10) * ${RUIN_POW(10)} + (n == 15) * ${RUIN_POW(15)} + (n == 20) * ${RUIN_POW(20)}), 2)`;

const QUESTIONS: Question[] = [
  {
    id: "q-3.12.1-1",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 1,
    prompt: "Your account of 10,000.00 gains 30%, then loses 20%. What is it worth after both periods, in vUSD?",
    numeric: { answer: 10400, tolerance: 0.5, unit: "vUSD" },
    explanation: "Returns multiply: 10,000.00 × 1.30 × 0.80 = 10,400.00, a 4% gain. Adding the returns would suggest 10%, but the 20% loss is taken from a bigger balance than the one the gain started from.",
    lesson: "3.12.1",
    concepts: ["volatility-drag"],
    hints: ["Turn each return into a growth factor and multiply them.", "10,000.00 × 1.30 × 0.80."],
    vary: {
      fields: { up: [10, 60, 5], down: [10, 50, 5] },
      answer: "round(10000 * (1 + up / 100) * (1 - down / 100), 2)",
      prompt: "Your account of 10,000.00 gains {up}%, then loses {down}%. What is it worth after both periods, in vUSD?",
      explanation: "Returns multiply: 10,000.00 × {1 + up / 100:2} × {1 - down / 100:2} = {answer:2}. Adding the returns ignores that the loss is taken from a different balance than the gain.",
      hint: "10,000.00 × {1 + up / 100:2} × {1 - down / 100:2}.",
    },
  },
  {
    id: "q-3.12.1-2",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "A strategy averages 12% a year with 25% volatility. Using g ≈ μ − σ²/2, what is its approximate compound growth rate, in % a year?",
    numeric: { answer: 8.875, tolerance: 0.1, unit: "%" },
    explanation: "Drag = σ²/2 = 0.25² ÷ 2 = 0.03125, or 3.125 points. g ≈ 12% − 3.125% = 8.875%, about 8.9% a year. The swings cost a quarter of the average return.",
    lesson: "3.12.1",
    concepts: ["volatility-drag"],
    hints: ["Square the volatility as a decimal, then halve it.", "0.25 × 0.25 ÷ 2 = 0.03125, or 3.125 points.", "Subtract the drag from the 12% average."],
    vary: {
      fields: { mu: [6, 20, 1], sig: [10, 40, 5] },
      answer: "mu - sig * sig / 200",
      prompt: "A strategy averages {mu}% a year with {sig}% volatility. Using g ≈ μ − σ²/2, what is its approximate compound growth rate, in % a year?",
      explanation: "Drag = σ²/2 = {sig / 100:2}² ÷ 2 = {sig * sig / 20000:4}, or {sig * sig / 200:3} points. g ≈ {mu}% − {sig * sig / 200:3}% = {answer:3}% a year.",
      hint: "Drag = {sig / 100:2} × {sig / 100:2} ÷ 2; subtract it from {mu}%.",
    },
  },
  {
    id: "q-3.12.1-3",
    topic: "position_sizing",
    kind: "mcq",
    difficulty: 3,
    prompt: "\"The average of 1,000 simulated traders made +20%, yet most of them lost money.\" How is that possible?",
    options: [
      { id: "a", label: "It isn't: an average of +20% means most traders gained", rationale: "An average can sit far above the typical result when outcomes are skewed. A few huge gains can outweigh many small losses." },
      { id: "b", label: "Costs cut every trader's result by the same amount", rationale: "Equal costs would lower the average and the typical result together. They can't open a gap between them." },
      { id: "c", label: "A few very large winners pull the average up; the median shows what happened to the typical trader" },
      { id: "d", label: "Most traders traded too rarely for the average to apply", rationale: "The number of trades isn't the point. Compounding makes results skewed: a few paths grow enormously while most lag." },
    ],
    correct: "c",
    explanation: "Compounded results are skewed: a few paths grow enormously and pull the mean up, while the median path lags. At 16% risk on the reference system, the mean of 100,000 paths ended at 481×, the median at 20×. You live one path, so judge sizing by the median and the bad tail.",
    lesson: "3.12.1",
    concepts: ["time-vs-ensemble-average", "volatility-drag"],
    hints: ["Think about what a few enormous results do to an average.", "Which statistic tells you what happened to the typical trader?"],
  },
  {
    id: "q-3.12.2-1",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "Fixed ratio with Δ = 5,000. Your cumulative profit is 12,000. How many lots do you trade?",
    numeric: { answer: 2, tolerance: 0, unit: "lots" },
    explanation: "Lot N needs Δ × N(N − 1) ÷ 2 of profit: 2 lots at 5,000, 3 at 15,000. With 12,000 you trade 2. The formula ½ × (1 + √(1 + 8 × 12,000 ÷ 5,000)) gives 2.75, rounded down to 2.",
    lesson: "3.12.2",
    concepts: ["fixed-ratio-sizing"],
    hints: ["Lot N needs Δ × N(N − 1) ÷ 2 of profit.", "Thresholds: 2 lots at Δ, 3 at 3Δ, 4 at 6Δ.", "5,000 and 15,000: where does 12,000 fall?"],
    vary: {
      fields: { delta: [2000, 6000, 1000], profit: [1000, 60000, 1000] },
      constraints: ["profit < 21 * delta"],
      answer: "1 + (profit >= delta) + (profit >= 3 * delta) + (profit >= 6 * delta) + (profit >= 10 * delta) + (profit >= 15 * delta)",
      prompt: "Fixed ratio with Δ = {delta}. Your cumulative profit is {profit}. How many lots do you trade?",
      explanation: "Lot N needs Δ × N(N − 1) ÷ 2 of profit: 2 lots at {delta}, 3 at {3 * delta}, 4 at {6 * delta}, 5 at {10 * delta}. With {profit} of profit you trade {answer}.",
      hint: "Thresholds: {delta}, {3 * delta}, {6 * delta}, {10 * delta}. Where does {profit} fall?",
    },
  },
  {
    id: "q-3.12.2-2",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "You risk 3% of current equity per trade. How many losses in a row halve the account? Answer with ln(0.5) ÷ ln(1 − r), to one decimal.",
    numeric: { answer: 22.8, tolerance: 0.1, unit: "losses" },
    explanation: "Each loss leaves 0.97 of the account, so n losses leave 0.97^n. Setting it to 0.5: n = ln(0.5) ÷ ln(0.97) = 22.8. Adding up 3% steps would say 16.7, too few, because each loss comes from a smaller account.",
    lesson: "3.12.2",
    concepts: ["fixed-fractional-sizing"],
    hints: ["Each loss leaves (1 − r) of the account: solve (1 − r)^n = 0.5.", "n = ln(0.5) ÷ ln(1 − r).", "ln(0.5) = −0.693 and ln(0.97) = −0.0305."],
    vary: {
      fields: { r: [1, 10, 0.5] },
      answer: HALVING,
      prompt: "You risk {r}% of current equity per trade. How many losses in a row halve the account? Answer with ln(0.5) ÷ ln(1 − r), to one decimal.",
      explanation: "Each loss leaves {1 - r / 100:3} of the account, so n losses leave {1 - r / 100:3}^n. Setting it to 0.5: n = ln(0.5) ÷ ln({1 - r / 100:3}) = {answer:1}. Adding up {r}% steps would say {50 / r:1}, too few, because each loss comes from a smaller account.",
      hint: "n = ln(0.5) ÷ ln({1 - r / 100:3}).",
    },
  },
  {
    id: "q-3.12.2-3",
    topic: "position_sizing",
    kind: "scenario",
    difficulty: 3,
    scenario: "A trader's system breaks even before costs. He switched from fixed units to 1% fixed fractional sizing, and over the last 100 trades the account ended up 6%.",
    prompt: "What's the best explanation?",
    options: [
      { id: "a", label: "Fixed fractional added an edge by betting more after wins", rationale: "It also bets less after losses. With an average R of zero or below, it can't make the expected result positive." },
      { id: "b", label: "The order of wins and losses was lucky: sizing changed the path, not the edge" },
      { id: "c", label: "Compounding turns any breakeven system into a winner over time", rationale: "Compounding works against a zero-edge system: volatility drag pulls its typical path below the start." },
      { id: "d", label: "Fixed units had hidden an edge that fixed fractional revealed", rationale: "Sizing can't reveal an edge that isn't in the trades. Check the average R of the list itself." },
    ],
    correct: "b",
    explanation: "Sizing multiplies each trade's R by a size; it can't change the average R. A profit from a breakeven list comes from the order of the trades. In the simulation of a slightly losing system, about a third of 100-trade lists still ended up, under every sizing rule.",
    lesson: "3.12.2",
    concepts: ["position-sizing", "fixed-fractional-sizing"],
    hints: ["What does sizing change: the trades' results in R, or how much each one counts?", "Would the same rule win on a different order of the same trades?"],
  },
  {
    id: "q-3.12.3-1",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 1,
    prompt: "A system wins 60% of trades; winners pay 1R and losers cost 1R. What is the Kelly fraction, in %?",
    numeric: { answer: 20, tolerance: 0.1, unit: "%" },
    explanation: "f* = W − (1 − W) ÷ b = 0.60 − 0.40 ÷ 1 = 0.20, or 20%. It's the risk per trade that maximises long-run growth if the edge is exactly right; in practice it's a ceiling.",
    lesson: "3.12.3",
    concepts: ["kelly-criterion"],
    hints: ["f* = W − (1 − W) ÷ b, with W as a decimal.", "0.60 − 0.40 ÷ 1."],
    vary: {
      fields: { w: [40, 65, 1], b: [1, 3, 0.5] },
      constraints: ["w / 100 - (1 - w / 100) / b >= 0.02"],
      answer: "round((w / 100 - (1 - w / 100) / b) * 100, 1)",
      prompt: "A system wins {w}% of trades; winners pay {b:1}R and losers cost 1R. What is the Kelly fraction, in %?",
      explanation: "f* = W − (1 − W) ÷ b = {w / 100:2} − {1 - w / 100:2} ÷ {b:1} = {answer:1}%. It maximises long-run growth only if the edge is exactly right; in practice it's a ceiling.",
      hint: "{w / 100:2} − {1 - w / 100:2} ÷ {b:1}.",
    },
  },
  {
    id: "q-3.12.3-2",
    topic: "position_sizing",
    kind: "mcq",
    difficulty: 2,
    prompt: "A trader with a real, positive edge risks twice the Kelly fraction on every trade. What happens to long-run growth?",
    options: [
      { id: "a", label: "It doubles, because the edge works on twice the stake", rationale: "Growth isn't proportional to size. Past Kelly, the bigger losses on a shrinking account cost more than the extra gains bring." },
      { id: "b", label: "It's slightly above full Kelly's, with deeper drawdowns", rationale: "Full Kelly is the peak of the growth curve. Any fraction above it grows more slowly, not faster." },
      { id: "c", label: "It falls to about zero, even though every trade has a positive expectancy" },
      { id: "d", label: "It's unchanged: only the drawdowns get deeper", rationale: "The growth rate itself drops above Kelly. At twice Kelly it's close to zero." },
    ],
    correct: "c",
    explanation: "The growth curve peaks at Kelly and crosses zero close to twice Kelly. For the reference system, 32% risk per trade leaves the median path at 1.45× after 100 trades, against 20× at 16%, and 46% of paths end below the start.",
    lesson: "3.12.3",
    concepts: ["kelly-criterion"],
    hints: ["Picture the growth curve: where is its peak?", "Where does the curve cross zero?"],
  },
  {
    id: "q-3.12.3-3",
    topic: "position_sizing",
    kind: "scenario",
    difficulty: 3,
    scenario: "\"Kelly says 16% for my system, so I'll risk 16% per trade.\" The system's 40% win rate and 2.5R payoff come from a backtest.",
    prompt: "What's wrong with this plan?",
    options: [
      { id: "a", label: "The edge is only an estimate, full Kelly's median drawdown is near 83%, and its assumptions don't hold" },
      { id: "b", label: "Nothing: Kelly is the optimal size by definition", rationale: "Optimal only if the edge is known exactly and trades are independent. A backtest gives an estimate, usually too high." },
      { id: "c", label: "16% is too low: Kelly should be doubled to make up for costs", rationale: "Costs shrink the edge, which lowers Kelly. Doubling it moves toward zero growth." },
      { id: "d", label: "Kelly applies to position value, so holding 16% of equity in the position is fine", rationale: "In trading, f is the share of equity lost at the stop, not the position's value. 16% at risk per trade is enormous." },
    ],
    correct: "a",
    explanation: "Kelly maximises growth only for a known edge with independent trades and fixed payoffs. A backtest estimate is usually too optimistic, and even with the true edge, full Kelly's median maximum drawdown over 100 trades is about 83%. Treat Kelly as a ceiling and bet a fraction of it.",
    lesson: "3.12.3",
    concepts: ["kelly-criterion", "fractional-kelly"],
    hints: ["Where did the 40% and the 2.5R come from?", "How deep are full Kelly's drawdowns over 100 trades?"],
  },
  {
    id: "q-3.12.4-1",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "Optimal f is 0.25 and the list's largest loss is 200 per contract. A trade made +300 per contract. What is its HPR?",
    numeric: { answer: 1.375, tolerance: 0.001, unit: "" },
    explanation: "HPR = 1 + f × trade ÷ |largest loss| = 1 + 0.25 × 300 ÷ 200 = 1.375. Multiply the HPRs of every trade in the list to get its TWR.",
    lesson: "3.12.4",
    concepts: ["optimal-f"],
    hints: ["HPR = 1 + f × trade ÷ |largest loss|.", "1 + 0.25 × 300 ÷ 200."],
    vary: {
      fields: { f: [0.1, 0.4, 0.05], worst: [100, 400, 50], trade: [-400, 800, 50] },
      constraints: ["trade >= 0 - worst", "trade != 0"],
      answer: "round(1 + f * trade / worst, 4)",
      prompt: "Optimal f is {f:2} and the list's largest loss is {worst} per contract. A trade made {trade} per contract. What is its HPR?",
      explanation: "HPR = 1 + f × trade ÷ |largest loss| = 1 + {f:2} × {trade} ÷ {worst} = {answer:4}. Multiply the HPRs of every trade in the list to get its TWR.",
      hint: "1 + {f:2} × {trade} ÷ {worst}.",
    },
  },
  {
    id: "q-3.12.4-2",
    topic: "position_sizing",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why do many traders bet a fraction of Kelly rather than full Kelly?",
    options: [
      { id: "a", label: "A fraction grows faster than full Kelly over the long run", rationale: "Full Kelly is the peak of long-run growth for a known edge. A fraction grows a little slower; it's chosen for safety." },
      { id: "b", label: "Kelly only works for coin flips, not for trading", rationale: "Kelly applies to any known payoff distribution. The trouble is that a trading edge is only estimated." },
      { id: "c", label: "A smaller size raises the win rate", rationale: "Sizing doesn't change the win rate or the payoff. It only changes how much each trade counts." },
      { id: "d", label: "It keeps most of the growth with much shallower drawdowns, and survives an overestimated edge" },
    ],
    correct: "d",
    explanation: "Half Kelly keeps about three quarters of the growth rate with far smaller drawdowns: on the reference system, a median maximum drawdown of 53% instead of 83%. And if the edge is overestimated, a fraction may still grow where full Kelly shrinks.",
    lesson: "3.12.4",
    concepts: ["fractional-kelly"],
    hints: ["Compare growth and drawdown at half Kelly.", "What happens to full Kelly if the true edge is smaller?"],
  },
  {
    id: "q-3.12.4-3",
    topic: "position_sizing",
    kind: "scenario",
    difficulty: 3,
    scenario: "You computed optimal f = 0.30 from your last 40 trades. The largest loss among them was 250 per contract, so the rule says one contract per 833 vUSD of equity.",
    prompt: "What's the main danger in sizing your next trades this way?",
    options: [
      { id: "a", label: "Little: 40 trades is plenty to fix the size", rationale: "40 trades rarely contain the worst loss you'll see. Optimal f is fitted to this sample and its largest loss." },
      { id: "b", label: "The next large loss can exceed 250, and an f fitted to 40 trades overstates the edge" },
      { id: "c", label: "Optimal f is too cautious and wastes growth", rationale: "Optimal f is the most aggressive useful point: the peak of the past list's TWR. Beyond it, growth falls." },
      { id: "d", label: "HPRs can't be multiplied over 40 trades", rationale: "TWR is exactly the product of the HPRs. The problem is what the past list leaves out." },
    ],
    correct: "b",
    explanation: "Optimal f maximises growth on the past list only. A loss 1.5 times 250 at f = 0.30 would cost 45% of equity in one trade, and a small sample flatters the edge. Use a fraction of it, set by the single loss you can survive.",
    lesson: "3.12.4",
    concepts: ["optimal-f", "fractional-kelly"],
    hints: ["Is 250 the worst loss your system can produce?", "At f = 0.30, what would a loss of 375 per contract cost?"],
  },
  {
    id: "q-3.12.5-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "Even payoffs and a fixed stake: you win 55% of bets and your capital covers N = 20 stakes. What is the risk of ruin, in %?",
    numeric: { answer: 1.81, tolerance: 0.05, unit: "%" },
    explanation: "Risk of ruin = ((1 − W) ÷ W)^N = (0.45 ÷ 0.55)^20 = 0.818^20 = 1.8%. The formula assumes a fixed stake and independent bets, so for fixed fractional sizing it's only a starting point.",
    lesson: "3.12.5",
    concepts: ["risk-of-ruin"],
    hints: ["Risk of ruin = ((1 − W) ÷ W)^N.", "0.45 ÷ 0.55 = 0.818; raise it to the 20th power."],
    vary: {
      fields: { w: [52, 58, 1], n: [10, 20, 5] },
      answer: RUIN,
      prompt: "Even payoffs and a fixed stake: you win {w}% of bets and your capital covers N = {n} stakes. What is the risk of ruin, in %?",
      explanation: "Risk of ruin = ((1 − W) ÷ W)^N = ({1 - w / 100:2} ÷ {w / 100:2})^{n} = {answer:2}%. The formula assumes a fixed stake and independent bets, so for fixed fractional sizing it's only a starting point.",
      hint: "({1 - w / 100:2} ÷ {w / 100:2}) to the power {n}.",
    },
  },
  {
    id: "q-3.12.5-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why does this course define ruin as a drawdown threshold rather than a zero balance?",
    options: [
      { id: "a", label: "With fixed fractional sizing the account never reaches zero, and you'd stop trading long before it did" },
      { id: "b", label: "Brokers close accounts at a 30% drawdown", rationale: "There's no such rule here. The threshold is your own: the drawdown at which you'd stop, or be made to stop." },
      { id: "c", label: "A zero balance is impossible when every trade has a stop", rationale: "Gaps and fixed stakes can still wipe an account out. The reasons are fixed fractional sizing and where people really stop." },
      { id: "d", label: "A threshold makes the risk of ruin smaller", rationale: "The opposite: a threshold above zero is easier to reach, so the honest risk of ruin is larger." },
    ],
    correct: "a",
    explanation: "Risking a fraction of current equity, each loss is smaller than the last, so the balance approaches zero without reaching it. In practice you stop much earlier, at 25%, 30% or 50%. Measuring ruin there gives a number that matches how you'd actually stop.",
    lesson: "3.12.5",
    concepts: ["risk-of-ruin", "fixed-fractional-sizing"],
    hints: ["What does 1% of a shrinking account do as losses pile up?", "Where would you really stop trading?"],
  },
  {
    id: "q-3.12.5-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario: "A trader computes risk of ruin with even payoffs, N = 10 and the 60% win rate of an in-sample backtest: 1.7%. Out of sample, the system wins 52%.",
    prompt: "What does that do to the risk of ruin?",
    options: [
      { id: "a", label: "Little: 52% is still above 50%", rationale: "Near 50% the formula is very sensitive. With N = 10, the risk of ruin jumps from 1.7% to about 45%." },
      { id: "b", label: "It falls, because out-of-sample results are more reliable", rationale: "More reliable, yes, but worse. A lower win rate raises the risk of ruin." },
      { id: "c", label: "It rises sharply: with the same N = 10, from 1.7% to about 45%" },
      { id: "d", label: "Nothing: risk of ruin depends only on the stake", rationale: "It depends on the win rate, the payoff and the stake. The win rate is what moved here." },
    ],
    correct: "c",
    explanation: "((1 − W) ÷ W)^N with N = 10: (0.40 ÷ 0.60)^10 = 1.7%, but (0.48 ÷ 0.52)^10 = 44.9%. Near a 50% win rate the result swings wildly, so an in-sample win rate makes the risk of ruin look far smaller than it is.",
    lesson: "3.12.5",
    concepts: ["risk-of-ruin"],
    hints: ["Recompute ((1 − W) ÷ W)^N with the out-of-sample win rate.", "(0.48 ÷ 0.52)^10."],
  },
  {
    id: "q-3.12.6-1",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "Account 20,000.00, daily volatility budget 0.5% of it. LABX's forecast daily move is 2.00 per unit. How many units fit the budget?",
    numeric: { answer: 50, tolerance: 0, unit: "units" },
    explanation: "Budget: 0.5% of 20,000.00 = 100.00 a day. Units = 100.00 ÷ 2.00 = 50. On a normal day the position then moves about 100.00 either way.",
    lesson: "3.12.6",
    concepts: ["volatility-targeting"],
    hints: ["Turn the percentage into a daily budget in vUSD first.", "Units = budget ÷ forecast daily move, rounded down.", "0.5% of 20,000.00 = 100.00; 100.00 ÷ 2.00."],
    vary: {
      fields: { acct: [5000, 30000, 1000], pct: [0.4, 1, 0.1], sig: [0.8, 3, 0.1] },
      answer: "floor(round(acct * pct / 100, 2) / sig + 0.000001)",
      prompt: "Account {acct:2}, daily volatility budget {pct:1}% of it. LABX's forecast daily move is {sig:2} per unit. How many units fit the budget?",
      explanation: "Budget: {pct:1}% of {acct:2} = {round(acct * pct / 100, 2):2} a day. Units = {round(acct * pct / 100, 2):2} ÷ {sig:2} = {round(acct * pct / 100, 2) / sig:2}, rounded down to {answer}.",
      hint: "{round(acct * pct / 100, 2):2} ÷ {sig:2}, rounded down.",
    },
  },
  {
    id: "q-3.12.6-2",
    topic: "position_sizing",
    kind: "mcq",
    difficulty: 2,
    prompt: "Your LABX position is sized to a 20-day volatility forecast. Overnight, volatility jumps to twice its old level. What happens before the forecast catches up?",
    options: [
      { id: "a", label: "Nothing: the forecast resizes the position the same day", rationale: "A 20-day forecast moves only a little each day. It takes weeks to reflect a jump fully." },
      { id: "b", label: "The position stays too big, so daily swings and losses run above the budget" },
      { id: "c", label: "The position becomes too small, so you miss the move", rationale: "That can happen later, while the jump sits in the window. Right after it, units are still sized for calm." },
      { id: "d", label: "The stop-loss stops working", rationale: "The stop still works. The issue is size: units set for the old volatility swing twice as hard." },
    ],
    correct: "b",
    explanation: "Units were set for the old volatility, and a 20-day forecast only creeps up. In the lesson's simulation, the typical daily swing over the 15 days after the jump was 113.41, against a 63.00 budget. Faster forecasts and exposure caps narrow the gap; nothing removes it.",
    lesson: "3.12.6",
    concepts: ["volatility-targeting", "volatility-clustering"],
    hints: ["How quickly does a 20-day average react to one big day?", "Units = budget ÷ forecast. Which of the two is out of date?"],
  },
  {
    id: "q-3.12.6-3",
    topic: "position_sizing",
    kind: "scenario",
    difficulty: 3,
    scenario: "Volatility has been falling for months. Your volatility-targeted LABX position has grown from 40 to 90 units, and the forecast keeps dropping.",
    prompt: "What should your plan add?",
    options: [
      { id: "a", label: "Nothing: lower volatility means lower risk, so more units are safe", rationale: "Calm can end abruptly. The bigger position then meets the jump at full size, sized for calm." },
      { id: "b", label: "A higher volatility target, so units grow faster", rationale: "That raises exposure further. Leverage creep is already the problem." },
      { id: "c", label: "A longer forecast window, so units never change", rationale: "A longer window lags even more after a jump. The fix for calm spells is a ceiling on exposure." },
      { id: "d", label: "A cap on units, exposure or leverage, whatever the forecast says" },
    ],
    correct: "d",
    explanation: "As forecasts fall, volatility targeting raises exposure: leverage creep. When calm ends with a jump, the forecast lags and the oversized position takes the hit. A fixed cap limits the damage. In MARKET//LAB, buying power caps LABX at 99 units at 100.00.",
    lesson: "3.12.6",
    concepts: ["volatility-targeting"],
    hints: ["What does units = budget ÷ forecast do as the forecast keeps shrinking?", "What happens to that position when calm ends?"],
  },
  {
    id: "q-3.12.7-1",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 1,
    prompt: "Why must shadow trades continue while an equity-curve filter has paused the system?",
    options: [
      { id: "a", label: "So the system's live record looks better", rationale: "Shadow trades aren't live results. They're recorded to keep measuring the system, not to dress up its record." },
      { id: "b", label: "They don't need to: you resume after a fixed number of trades", rationale: "The filter's rule is the equity average. Without shadow trades the curve stops, and you can't tell when it recovers." },
      { id: "c", label: "The shadow equity decides when the system climbs back above its average and you resume" },
      { id: "d", label: "To double the sample for the next backtest", rationale: "They're part of the same system's record, not extra data. Their job is to tell you when to resume." },
    ],
    correct: "c",
    explanation: "The filter compares the system's own equity with its average. That curve has to keep moving while you're paused, so every signal is recorded as a shadow trade. Without it you'd resume at random, or never.",
    lesson: "3.12.7",
    concepts: ["equity-curve-filter"],
  },
  {
    id: "q-3.12.7-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "When is an equity-curve filter most likely to help?",
    options: [
      { id: "a", label: "When wins and losses come in long streaks" },
      { id: "b", label: "When trades are independent of each other", rationale: "Then the recent past says nothing about the next trade. The filter only skips trades with the same edge." },
      { id: "c", label: "For trend following, where big wins follow losing runs", rationale: "That's where it hurts: it's paused right when the big wins arrive." },
      { id: "d", label: "Whenever the system has a positive edge", rationale: "An edge alone isn't enough: skipping its trades costs profit unless the skipped ones are worse than the rest." },
    ],
    correct: "a",
    explanation: "The filter bets that a falling equity curve keeps falling, which is true only when outcomes cluster. In the simulation, clustered lists went from +61R to +87R and their median drawdown from 37R to 14R; independent lists gave up 38.5R.",
    lesson: "3.12.7",
    concepts: ["equity-curve-filter"],
    hints: ["The filter assumes the recent past predicts the next trades. When is that true?", "Compare clustered and independent lists."],
  },
  {
    id: "q-3.12.7-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario: "A trader tests equity-curve filters with averages from 5 to 50 trades on one backtest. The 37-trade average gives the best result, so it goes into the plan.",
    prompt: "What's the problem?",
    options: [
      { id: "a", label: "None: the backtest found the best length", rationale: "It found the best length for this sample. With 46 lengths tried, the winner partly fits noise." },
      { id: "b", label: "The average should be longer than 50 trades", rationale: "No length is right in advance. The issue is choosing it by trying many on the same data." },
      { id: "c", label: "Filters only work on intraday systems", rationale: "Timeframe isn't the issue. Choosing the length by searching the past is." },
      { id: "d", label: "It's overfitting: the best of 46 tries fits past noise and will likely disappoint" },
    ],
    correct: "d",
    explanation: "Searching 46 lengths and keeping the best is the overfitting of 3.11.5: the winner fits this sample's noise. Fix a length in advance, check whether outcomes cluster at all, with a runs test, and judge the filter out of sample.",
    lesson: "3.12.7",
    concepts: ["equity-curve-filter"],
    hints: ["How many versions were tried before one was picked?", "Would the 37-trade average still be best on new data?"],
  },
];

// ─── Terms and concepts introduced in 3.12 ─────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "geometric-mean",
    term: "Geometric mean",
    definition: "The constant return per period that, compounded, gives the same end result as a sequence of returns: the n-th root of the product of the growth factors, minus 1.",
    plain: "The average growth per period once gains and losses are compounded.",
    related: ["cagr", "volatility-drag"],
    lesson: "3.12.1",
  },
  {
    id: "cagr",
    term: "CAGR",
    definition: "Compound annual growth rate: the steady yearly rate that turns the starting value into the ending value over the period, (end ÷ start)^(1 ÷ years) − 1.",
    plain: "The steady yearly rate that would give the same end result.",
    related: ["geometric-mean"],
    lesson: "3.12.1",
    aka: ["Compound annual growth rate"],
  },
  {
    id: "volatility-drag",
    term: "Volatility drag",
    definition: "The gap between the average return and the compound growth rate caused by swings: roughly σ²/2 per period, so g ≈ μ − σ²/2.",
    plain: "Swings lowering compound growth even when the average return stays the same.",
    related: ["geometric-mean", "volatility", "leveraged-etf"],
    lesson: "3.12.1",
  },
  {
    id: "fixed-ratio-sizing",
    term: "Fixed-ratio sizing",
    definition: "A sizing method that adds one contract or lot each time profit grows by a further step: lot N needs Δ × N(N − 1) ÷ 2 of profit, where Δ is the delta.",
    plain: "Adding contracts only after profit grows by set, ever larger steps.",
    related: ["anti-martingale", "position-size"],
    lesson: "3.12.2",
  },
  {
    id: "anti-martingale",
    term: "Anti-martingale",
    definition: "Any sizing that increases size after wins and reduces it after losses, such as fixed fractional sizing. It shapes the account's path but cannot create an edge.",
    plain: "Sizing that grows after wins and shrinks after losses.",
    related: ["martingale", "fixed-ratio-sizing", "risk-per-trade"],
    lesson: "3.12.2",
  },
  {
    id: "kelly-criterion",
    term: "Kelly criterion",
    definition: "The fraction of equity to risk per bet that maximises long-run growth when the edge is known: f* = W − (1 − W) ÷ b for a win rate W and a payoff of b.",
    plain: "The bet size that grows money fastest in the long run, if you know your edge exactly.",
    related: ["growth-rate", "full-kelly", "fractional-kelly"],
    lesson: "3.12.3",
    aka: ["Kelly fraction"],
  },
  {
    id: "growth-rate",
    term: "Growth rate",
    definition: "The average compound gain per bet or period, measured as the expected log return. Risking f per trade: g(f) = W · ln(1 + f · b) + (1 − W) · ln(1 − f).",
    plain: "How fast money grows per bet or period, once results compound.",
    related: ["kelly-criterion", "geometric-mean"],
    lesson: "3.12.3",
  },
  {
    id: "full-kelly",
    term: "Full Kelly",
    definition: "Betting the whole Kelly fraction. It maximises long-run growth for a known edge but brings very deep drawdowns, and over-bets when the edge is overestimated.",
    plain: "Betting the entire Kelly amount: the fastest growth, with very deep drawdowns.",
    related: ["kelly-criterion", "fractional-kelly"],
    lesson: "3.12.3",
  },
  {
    id: "fractional-kelly",
    term: "Fractional Kelly",
    definition: "Betting a fixed fraction of the Kelly fraction, often a half or a quarter. Half Kelly keeps about three quarters of the growth rate with much shallower drawdowns.",
    plain: "Betting part of the Kelly amount, such as a half or a quarter.",
    related: ["kelly-criterion", "full-kelly"],
    lesson: "3.12.4",
  },
  {
    id: "optimal-f",
    term: "Optimal f",
    definition: "Ralph Vince's fixed fraction that would have maximised terminal wealth over a past trade list, with each trade scaled by the list's largest loss. It implies one contract per largest loss ÷ f of equity.",
    plain: "The bet fraction that would have grown a past list of trades the most.",
    related: ["hpr", "twr", "kelly-criterion"],
    lesson: "3.12.4",
  },
  {
    id: "hpr",
    term: "HPR",
    definition: "Holding period return: 1 plus a trade's gain or loss as a fraction of equity. For optimal f, HPR = 1 + f × trade ÷ |largest loss|.",
    plain: "One trade's result as a growth factor, such as 1.05 for +5%.",
    related: ["twr", "optimal-f"],
    lesson: "3.12.4",
    aka: ["Holding period return"],
  },
  {
    id: "twr",
    term: "TWR",
    definition: "Terminal wealth relative: the product of all the HPRs in a trade list, the factor by which equity would have grown.",
    plain: "All the trade results multiplied together: how many times the account grew.",
    related: ["hpr", "optimal-f"],
    lesson: "3.12.4",
    aka: ["Terminal wealth relative"],
  },
  {
    id: "risk-of-ruin",
    term: "Risk of ruin",
    definition: "The probability that losses reach the ruin threshold, the drawdown at which you would stop trading. With even payoffs and a fixed stake it is ((1 − W) ÷ W)^N.",
    plain: "The chance of losing enough that you must stop trading.",
    related: ["ruin-threshold", "drawdown", "risk-per-trade"],
    lesson: "3.12.5",
  },
  {
    id: "ruin-threshold",
    term: "Ruin threshold",
    definition: "The drawdown, set in advance, at which you would stop trading. Risk of ruin is measured against it rather than against a zero balance.",
    plain: "The drawdown at which you'd stop, used to define ruin.",
    related: ["risk-of-ruin", "max-drawdown"],
    lesson: "3.12.5",
  },
  {
    id: "volatility-target",
    term: "Volatility target",
    definition: "The level of volatility a position or account is sized to, such as 10% a year. Divided by √252 it becomes a daily budget.",
    plain: "How much you want a position to swing, set in advance.",
    related: ["volatility-forecast", "leverage-creep", "volatility"],
    lesson: "3.12.6",
  },
  {
    id: "volatility-forecast",
    term: "Volatility forecast",
    definition: "An estimate of how much prices will move in the coming period, often the standard deviation of recent daily changes over a window such as 20 days. It lags sudden jumps.",
    plain: "A guess of how much prices will move next, based on recent moves.",
    related: ["volatility-target", "standard-deviation", "atr"],
    lesson: "3.12.6",
  },
  {
    id: "leverage-creep",
    term: "Leverage creep",
    definition: "Exposure rising quietly as volatility forecasts fall in calm markets, because a volatility target buys more units with the same budget.",
    plain: "Positions growing bigger and bigger while markets stay calm.",
    related: ["volatility-target", "leverage", "exposure"],
    lesson: "3.12.6",
  },
  {
    id: "equity-curve-filter",
    term: "Equity-curve filter",
    definition: "A rule that pauses live trading while a system's equity is below its own moving average and resumes when it climbs back above, tracked with shadow trades.",
    plain: "Pausing a system while its results are below their own average.",
    related: ["shadow-trades", "drawdown"],
    lesson: "3.12.7",
  },
  {
    id: "shadow-trades",
    term: "Shadow trades",
    definition: "Trades a paused system would have taken, recorded but not executed, so its equity curve and the filter's signal keep updating.",
    plain: "Trades written down but not taken while a system is paused.",
    related: ["equity-curve-filter"],
    lesson: "3.12.7",
  },
];

const CONCEPTS: Concept[] = [
  {
    id: "volatility-drag",
    name: "Volatility drag",
    category: "position_sizing",
    summary: "Swings pull compound growth below the average return, by roughly σ²/2 per period.",
    body: [
      "Returns compound by multiplying. +50% then −50% averages 0% but leaves 0.75 of the account: a geometric mean of −13.4% per period. Compound growth g sits below the average return μ by about half the variance: g ≈ μ − σ²/2.",
      "Drag grows with the square of the swings, so leverage multiplies it: a 2× daily fund carries four times its index's drag and can lose money while the index ends flat.",
    ],
    example: "μ = 10% a year with σ = 30%: g ≈ 10% − 0.30² ÷ 2 = 5.5%. An index that goes +10% then −9.09% ends flat; a 2× fund ends at 1.20 × 0.8182 = 0.982.",
    related: ["volatility", "position-sizing"],
    missions: [],
    lessons: ["3.12.1"],
  },
  {
    id: "time-vs-ensemble-average",
    name: "Time vs ensemble average",
    category: "position_sizing",
    summary: "A trader lives one path over time; the typical path can sit far below the average across many traders.",
    body: [
      "The ensemble average averages many traders at one moment; the time average follows one trader through many trades. With compounding, a few enormous paths pull the ensemble average up while the median path lags.",
      "Since you live one path, judge a sizing rule by its median and its bad tail, not by its average result.",
    ],
    example: "Reference system at 16% risk, 100 trades, 100,000 simulated paths: the average ends at 481×, the median at 20×, and 13% of paths lose money.",
    related: ["volatility-drag", "position-sizing"],
    missions: [],
    lessons: ["3.12.1"],
  },
  {
    id: "fixed-ratio-sizing",
    name: "Fixed-ratio sizing",
    category: "position_sizing",
    summary: "Adding one lot each time profit grows by another, larger step, so size grows more slowly than profit.",
    body: [
      "Ryan Jones's fixed ratio sets a delta Δ: lot N needs Δ × N(N − 1) ÷ 2 of cumulative profit, so lots = ½ × (1 + √(1 + 8P ÷ Δ)), rounded down.",
      "No formula gives the best delta. A larger delta adds lots more slowly, cutting both drawdown and growth; in practice it's tied to the drawdown you'd accept per lot.",
    ],
    example: "Δ = 3,000: 2 lots at 3,000 of profit, 3 at 9,000, 4 at 18,000. At 10,000 of profit the formula gives 3.13, so 3 lots.",
    related: ["fixed-fractional-sizing", "position-sizing"],
    missions: ["M05"],
    lessons: ["3.12.2"],
  },
  {
    id: "kelly-criterion",
    name: "Kelly criterion",
    category: "position_sizing",
    summary: "The bet fraction that maximises long-run growth for a known edge; a ceiling, not a target.",
    body: [
      "For a win rate W and a payoff of b R, Kelly is f* = W − (1 − W) ÷ b. Long-run growth per trade, g(f) = W · ln(1 + f · b) + (1 − W) · ln(1 − f), peaks at f* and crosses zero near twice f*.",
      "Kelly assumes a known edge, independent trades and fixed payoffs. In trading the edge is only estimated and full Kelly's drawdowns are extreme, so it serves as an upper limit.",
    ],
    example: "55% winners at 1.5R: f* = 0.55 − 0.45 ÷ 1.5 = 25%. Growth peaks at 0.0457 per trade; half Kelly gives 0.0344, twice Kelly −0.0041. The reference system's Kelly is 16%, with a median maximum drawdown of 82.7% over 100 trades.",
    related: ["fractional-kelly", "position-sizing", "expectancy"],
    missions: ["M05"],
    lessons: ["3.12.3"],
  },
  {
    id: "fractional-kelly",
    name: "Fractional Kelly",
    category: "position_sizing",
    summary: "Betting a fraction of Kelly to cut drawdowns and to survive an overestimated edge.",
    body: [
      "Half Kelly keeps about three quarters of the growth rate with far shallower drawdowns; a quarter is a common choice.",
      "An edge measured in-sample is usually too high. If the true edge is smaller, full Kelly can over-bet into negative growth while a fraction still grows.",
    ],
    example: "Kelly from an estimated 55% at 1.5R is 25%. If the true rate is 45%, 25% gives g = −0.0149 per trade, while half Kelly, 12.5%, still gives +0.0039.",
    related: ["kelly-criterion", "drawdown"],
    missions: ["M05"],
    lessons: ["3.12.4"],
  },
  {
    id: "optimal-f",
    name: "Optimal f",
    category: "position_sizing",
    summary: "The fixed fraction that would have maximised terminal wealth over a past trade list, scaled by its largest loss.",
    body: [
      "Each trade's HPR is 1 + f × trade ÷ |largest loss|, and the TWR multiplies them. The f at the TWR peak is optimal f; equity per contract = largest loss ÷ f.",
      "It is fitted to the past: the next largest loss can be bigger, and a short list flatters the edge. Use a fraction of it, chosen by the single loss you can survive.",
    ],
    example: "On +300, −100, +200, −100, −100, +150, −100, +250, −100, +100: optimal f = 0.239, TWR 1.74, one contract per 418 vUSD. A loss of 150 at that f costs 35.9% of equity.",
    related: ["kelly-criterion", "fractional-kelly"],
    missions: [],
    lessons: ["3.12.4"],
  },
  {
    id: "risk-of-ruin",
    name: "Risk of ruin",
    category: "risk_management",
    summary: "The probability that losses reach the drawdown at which you would stop trading.",
    body: [
      "With even payoffs and a fixed stake, risk of ruin is ((1 − W) ÷ W)^N for N stakes of capital. With fixed fractional sizing the account never reaches zero, so ruin is defined by a drawdown threshold instead.",
      "For a real system, estimate it by Monte Carlo on out-of-sample trades and size so it stays under about 1%.",
    ],
    example: "Reference system, ruin at a 30% drawdown, 100 trades: 0.004% at 1% risk, 3.1% at 2%, 51.8% at 4%. The largest risk that stays under 1% is 1.6%.",
    related: ["drawdown", "risk-per-trade"],
    missions: ["M04"],
    lessons: ["3.12.5"],
  },
  {
    id: "volatility-targeting",
    name: "Volatility targeting",
    category: "position_sizing",
    summary: "Scaling exposure so a position's expected swing matches a set budget as volatility changes.",
    body: [
      "Units = daily budget ÷ forecast daily move. A yearly target becomes daily by dividing by √252. When the forecast doubles, units halve.",
      "Forecasts lag jumps, so losses can exceed the budget for days after a volatility spike; in long calm spells, exposure creeps up. A cap on exposure handles the second; nothing fully removes the first.",
    ],
    example: "10% a year on 10,000.00 is 63.00 a day. With LABX moving 1.50 a day: 42 units. At 3.00: 21 units. At 0.50 the formula asks for 126, but buying power caps it at 99.",
    related: ["volatility", "volatility-clustering", "position-sizing", "leverage"],
    missions: [],
    lessons: ["3.12.6"],
  },
  {
    id: "equity-curve-filter",
    name: "Equity-curve filter",
    category: "risk_management",
    summary: "Pausing a system while its equity is below its own moving average, while still tracking shadow trades.",
    body: [
      "The filter bets that a falling equity curve keeps falling. That holds only when outcomes cluster; on independent trades it skips trades with the same edge, and in trend following it tends to miss the big wins that follow losing runs.",
      "Fix the average's length in advance: choosing the best of many lengths is overfitting. Keep shadow trades so you know when to resume.",
    ],
    example: "4,000 simulated lists of 500 trades each: clustered outcomes went from +61R to +87R with the filter, independent ones from +200R to +161.5R, and trend following from +48R to +14R.",
    related: ["drawdown", "risk-per-trade"],
    missions: ["M10"],
    lessons: ["3.12.7"],
  },
];

/** Unit 3.12 · Position sizing theory (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_3_12: UnitContent = {
  lessons: [L_3_12_1, L_3_12_2, L_3_12_3, L_3_12_4, L_3_12_5, L_3_12_6, L_3_12_7],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
