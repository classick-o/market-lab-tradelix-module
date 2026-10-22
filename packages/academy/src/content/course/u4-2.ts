import type { CandleData, ChartLayer, ChartSpec, Concept, GlossaryTerm, Lesson, MarkRole, Question, UnitContent } from "../../types";

/** Unit 4.2 · Execution and market impact (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */

const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });
/** One flat point (o = h = l = c), for line charts and diagrams. */
const flat = (p: number): CandleData => k(p, p, p, p);
/** Flat placeholder slots for diagrams drawn only with layers (`hideCandles`). */
const slots = (n: number, p: number): CandleData[] => Array.from({ length: n }, () => flat(p));
/** A bar from zero to v, drawn as a candle. */
const bar = (v: number): CandleData => k(0, Math.max(0, v), Math.min(0, v), v);
/** A path through consecutive values starting at `from`. */
const run = (from: number, values: number[], role: MarkRole = "accent"): ChartLayer => ({ kind: "path", points: values.map((price, i) => ({ index: from + i, price })), role });

// ─── Chart data ─────────────────────────────────────────────────────────────

/**
 * 4.2.1 B2: LABX mid through the order. Decision 100.00 (slot 0), arrival 100.04 (1). Four child orders of 10,000 at slots
 * 2, 4, 6, 8, each a market buy against asks of 2,000 every cent from mid + 0.05: fill = mid + 0.07 → 100.10, 100.15,
 * 100.20, 100.27 (average 100.18). From slot 9 the ask (mid + 0.05) is above the parent's 100.30 limit; close 101.00.
 */
const IS_DAY = [100, 100.04, 100.03, 100.06, 100.08, 100.1, 100.13, 100.16, 100.2, 100.27, 100.36, 100.41, 100.49, 100.55, 100.62, 100.66, 100.74, 100.8, 100.86, 100.91, 100.95, 101];
const IS_DAY_CHART: ChartSpec = {
  candles: IS_DAY.map(flat),
  style: "line",
  range: [99.9, 101.1],
  height: 260,
  describe: "LABX mid price during a 50,000-unit buy. It starts at 100.00, is 100.04 when the order arrives, rises to 100.20 by the fourth fill and climbs to 101.00 by the close.",
};

/** 4.2.2 B1: mid around a 50,000-unit buy. Slots 0–4 before; 5–16 buying, 100 + 0.32 × √(k/12); 17–29 after, 100.21 + 0.11 × e^(−j/2.5). */
const IMPACT_PATH = [
  100, 100.01, 99.99, 100, 100, 100.09, 100.13, 100.16, 100.18, 100.21, 100.23, 100.24, 100.26, 100.28, 100.29, 100.31, 100.32, 100.28, 100.26, 100.24, 100.23, 100.22,
  100.22, 100.22, 100.21, 100.21, 100.21, 100.21, 100.21, 100.21,
];
const IMPACT_CHART: ChartSpec = {
  candles: IMPACT_PATH.map(flat),
  style: "line",
  range: [99.9, 100.4],
  height: 260,
  describe: "LABX mid price around a large buy: near 100.00 before, rising to 100.32 by the last fill, then easing back to settle at 100.21.",
};

/**
 * 4.2.3 B2: share of 50,000 LABX filled by each half hour (09:30 = slot 0 … 16:00 = slot 13), on a U-shaped day of
 * 2,000,000: 240,000 / 180,000 / 150,000 / 130,000 / 120,000 / 110,000 / 110,000 / 120,000 / 130,000 / 140,000 / 160,000 /
 * 180,000 / 230,000 per half hour. TWAP: 50,000 ÷ 13 per half hour. VWAP: 2.5% of each. POV 10%: done at minute 76 (10:46).
 * IS: Almgren–Chriss in volume time, κ = 3.
 */
const TWAP_CUM = [0, 7.7, 15.4, 23.1, 30.8, 38.5, 46.2, 53.8, 61.5, 69.2, 76.9, 84.6, 92.3, 100];
const VWAP_CUM = [0, 12, 21, 28.5, 35, 41, 46.5, 52, 58, 64.5, 71.5, 79.5, 88.5, 100];
const IS_CUM = [0, 30.4, 47.1, 58, 65.6, 71.5, 76.2, 80.1, 83.8, 87.2, 90.4, 93.5, 96.5, 100];
const SCHEDULES: ChartSpec = {
  candles: slots(14, 50),
  hideCandles: true,
  range: [0, 105],
  height: 260,
  layers: [{ kind: "level", price: 100, role: "neutral", label: "ORDER DONE", chip: false }],
  describe:
    "Share of a 50,000-unit order filled, in %, each half hour from 09:30 to 16:00. TWAP rises in a straight line to 100% at 16:00. VWAP rises faster at the open and close. POV 10% reaches 100% at 10:46. IS fills 30% in the first half hour, then slows.",
};

/**
 * 4.2.3 B4: implementation shortfall in bps over 200 synthetic sessions (seed 42, the same price paths for every plan).
 * Mid: random walk, 2% a day over 390 minutes. Each child order pays the half spread (0.05) plus 100 × 2% × √(its share of
 * that minute's volume), and 0.05% commission. Market order: walks asks of 200 units every cent from 100.05 to 102.54
 * (average 101.295, impact 124.5 bps), 134.6 bps with commission, every session.
 * Averages: market 134.6, POV 10% 69.3, IS 44.0, VWAP 38.6, TWAP 38.9. 95th percentiles: 134.6, 144.7, 167.4, 213.6, 215.4.
 * Sessions costing more than the market order: VWAP 38, TWAP 37, IS 18, POV 10% 17.
 */
const RACE: ChartSpec = {
  candles: [134.6, 69.3, 44, 38.6, 38.9, 0, 134.6, 144.7, 167.4, 213.6, 215.4].map(bar),
  visible: 6,
  range: [0, 235],
  height: 260,
  layers: [
    { kind: "path", points: [{ index: 0, price: 226 }], label: "AVERAGE" },
    { kind: "path", points: [{ index: 6, price: 226 }], label: "95TH PERCENTILE" },
  ],
  describe:
    "Shortfall in bps over 200 sessions, as bars. Averages, left to right: market order 134.6, POV 10% 69.3, IS 44.0, VWAP 38.6, TWAP 38.9. The 95th percentiles of the same five plans follow under the veil.",
};

/** 4.2.4 B1: a timeline, one slot per 10 ms from −20 ms (slot 0); the news lands at slot 2, your cancel at slot 17 (150 ms). */
const PICKOFF: ChartSpec = {
  candles: slots(18, 100),
  hideCandles: true,
  range: [99.7, 100.15],
  height: 240,
  describe: "A timeline in 10-millisecond steps. Fair value is 100.05 until the news at time 0, then 99.80. Your bid rests at 100.00. A fast trader fills it at 0.5 ms; your cancel arrives at 150 ms.",
};

/** 4.2.5 B1: synthetic S&P 500, one slot per 15 minutes (09:30 = 0 … 16:00 = 26); Level 1 at 10:30 (slot 4), 15-minute halt to slot 5. */
const MWCB_PATH = [4900, 4860, 4800, 4720, 4650, 4650, 4610, 4580, 4600, 4620, 4640, 4630, 4660, 4680, 4670, 4690, 4700, 4710, 4690, 4700, 4720, 4710, 4700, 4720, 4730, 4710, 4720];
const MWCB: ChartSpec = {
  candles: slots(27, 4700),
  hideCandles: true,
  range: [3950, 5050],
  height: 280,
  describe: "A synthetic S&P 500 day against yesterday's close of 5,000. Level 1 sits at 4,650, Level 2 at 4,350, Level 3 at 4,000. The index falls to 4,650 at 10:30, halts 15 minutes, and ends near 4,720.",
};

/** 4.2.5 B2: LABX under LULD, reference 100.00, 10% band (90.00–110.00). Slots 0–11 fall to the band; pause 12–17; reopening auction at slot 18 at 84.00. */
const LULD_BEFORE = [100, 99.8, 99.6, 99.1, 98.4, 97.2, 95.6, 93.4, 91.2, 90, 90, 90];
const LULD_AFTER = [84, 84.3, 84.1, 84.5, 84.4, 84.7];
const LULD: ChartSpec = {
  candles: slots(24, 95),
  hideCandles: true,
  range: [82, 112],
  height: 280,
  describe: "LABX falls from 100.00 to its lower LULD band at 90.00 and stays there, then pauses for 5 minutes and reopens by auction at 84.00. A stop sits at 89.50.",
};

/**
 * 4.2.5 B5: a stylised Dow on 6 May 2010, in % of the previous close, one slot per 5 minutes (14:00 = 0 … 16:00 = 24).
 * The two real anchors: intraday low −9.2% (9,869.62 vs 10,868.12) and close −3.2% (10,520.32). The rest is drawn to shape.
 */
const FLASH = [97.2, 97, 96.9, 96.7, 96.6, 96.5, 96.4, 96.1, 95.8, 90.8, 93.6, 95, 95.7, 96.2, 96.4, 96.5, 96.4, 96.6, 96.7, 96.6, 96.8, 96.9, 96.7, 96.8, 96.8];
const FLASH_CHART: ChartSpec = {
  candles: FLASH.map(flat),
  style: "line",
  visible: 10,
  range: [89, 101],
  height: 260,
  layers: [{ kind: "level", price: 100, role: "neutral", label: "PREVIOUS CLOSE = 100", chip: false }],
  describe: "A stylised Dow from 14:00 to 16:00 on 6 May 2010, in % of the previous close. It slides from 97.2 to 95.8, then drops to 90.8 around 14:45. The rest of the afternoon is hidden.",
};

/**
 * 4.2.6 B1: synthetic LABC (FX) one-minute bars, 15:40 (slot 0) to 16:20 (slot 40). Volume averages exactly 120 a minute
 * from 15:40 to 15:57 and from 16:03 to 16:20, and 600 from 15:58 to 16:02 (the fix window). Closes drawn by hand.
 */
const FIX_CLOSES = [
  150, 150.01, 150.01, 150, 149.99, 150, 150.01, 150.02, 150.01, 150, 150, 149.99, 150, 150.01, 150.02, 150.01, 150.01, 150, 150.06, 149.97, 150.05, 149.98, 150.03, 150.02,
  150.01, 150.02, 150.01, 150, 149.99, 150, 150.01, 150, 150, 150.01, 150.02, 150.01, 150, 150.01, 150.02, 150.01, 150.01,
];
const FIX_VOLUME = [
  124, 116, 137, 134, 106, 109, 137, 144, 114, 98, 99, 132, 118, 102, 106, 115, 119, 150, 632, 542, 575, 586, 665, 143, 143, 132, 103, 102, 112, 104, 127, 138, 105, 142, 92,
  89, 107, 133, 132, 111, 145,
];
const FIX_CHART: ChartSpec = {
  candles: FIX_CLOSES.map((c, i) => {
    const o = i === 0 ? c : FIX_CLOSES[i - 1];
    return { o, h: Math.max(o, c), l: Math.min(o, c), c, v: FIX_VOLUME[i] };
  }),
  style: "line",
  volume: true,
  range: [149.9, 150.1],
  height: 280,
  describe: "LABC one-minute prices and volume from 15:40 to 16:20 London. Volume is about 120 a minute, jumps to about 600 from 15:58 to 16:02, then returns to about 120. Price stays between 149.97 and 150.06 and ends at 150.01.",
};

/** 4.2.6 B3: synthetic LABC average spread in pips, each hour from 00:00 to 23:00 London. 22:00 London = 17:00 New York (rollover). */
const SPREAD_DAY = [1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.2, 1, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.8, 0.8, 0.9, 0.9, 1.1, 3.8, 1.6];
const SPREAD_CHART: ChartSpec = {
  candles: SPREAD_DAY.map(flat),
  style: "line",
  range: [0, 4.2],
  height: 240,
  describe: "A synthetic day of LABC's average spread in pips, hour by hour from 00:00 to 23:00 London: 1.4 overnight, 0.7 through the London day including 16:00, 0.8 to 1.1 in the evening, 3.8 at 22:00 and 1.6 at 23:00.",
};

// ─── Lessons ────────────────────────────────────────────────────────────────

const L421: Lesson = {
  id: "4.2.1",
  title: "Implementation shortfall: what execution really costs",
  topic: "order_types",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Implementation shortfall measures execution against the price when you decided, so it counts delay, spread, impact, commission and the units you never filled.",
  objectives: [
    "Define implementation shortfall against the decision price.",
    "Split a shortfall into delay, spread, impact, commission and opportunity cost.",
    "Express execution cost in basis points of the intended trade.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "order_types", label: "Order types check" }],
  script: {
    unit: "4.2",
    courseId: "4.2.1",
    hook: {
      prompt: "You decided to buy 50,000 LABX at 100.00. You filled 40,000 at an average of 100.18 and the price closed at 101.00 before you got the rest. What cost you most?",
      control: {
        kind: "choice",
        choices: [
          { id: "commission", label: "The commission", feedback: "Commission was 0.05% × 40,000 × 100.18 = 2,003.60. Real, but not the largest cost here." },
          { id: "above", label: "The 0.18 paid above 100.00", feedback: "That's 40,000 × 0.18 = 7,200.00. Large, but the units you never bought cost more." },
          { id: "missed", label: "The 10,000 units you never bought" },
          { id: "spread", label: "The spread", feedback: "Half the spread on 40,000 units was 2,000.00, small next to the move you missed." },
        ],
        answer: "missed",
      },
      compare: "You said {yours}. The 10,000 units you never bought missed a 1.00 move: 10,000.00, more than delay, spread and impact together (7,200.00).",
      concept: "implementation-shortfall",
    },
    learn: [
      {
        kind: "explain",
        title: "Measure from the decision",
        text: "[[implementation-shortfall|Implementation shortfall]] (Perold, 1988) compares a paper trade, filled in full at the price when you decided, with what you really got. The gap holds every cost: the delay, half the spread, your own impact, [[commission]], and the [[opportunity-cost|opportunity cost]] of units that never filled. Grade: Mechanic.",
      },
      {
        kind: "figure",
        title: "One order, many prices",
        text: "Your [[parent-order|parent order]] is 50,000 units. It reaches the market as [[child-order|child orders]], and every price on the way is measured against the [[decision-price|decision price]], starting with the [[arrival-price|arrival price]].",
        figure: {
          kind: "chart",
          chart: IS_DAY_CHART,
          steps: [
            {
              text: "10:00: you decide to buy 50,000 LABX. The mid is 100.00: your decision price.",
              visible: 1,
              layers: [
                { kind: "level", price: 100, role: "neutral", label: "DECISION 100.00", chip: false },
                { kind: "marker", index: 0, price: 100, label: "DECIDE" },
              ],
            },
            {
              text: "10:05: the order arrives at 100.04. Four child orders of 10,000 fill at 100.10, 100.15, 100.20 and 100.27.",
              visible: 9,
              layers: [
                { kind: "marker", index: 1, price: 100.04, label: "ARRIVE", role: "neutral" },
                { kind: "marker", index: 2, price: 100.1, role: "up" },
                { kind: "marker", index: 4, price: 100.15, role: "up" },
                { kind: "marker", index: 6, price: 100.2, role: "up" },
                { kind: "marker", index: 8, price: 100.27, role: "up" },
                { kind: "level", price: 100.18, role: "entry", label: "AVERAGE FILL 100.18" },
              ],
            },
            {
              text: "Price runs past your 100.30 limit. The last 10,000 never fill; LABX closes at 101.00.",
              visible: 22,
              layers: [
                { kind: "level", price: 100.3, role: "neutral", label: "YOUR LIMIT 100.30", chip: false },
                { kind: "marker", index: 21, price: 101, label: "CLOSE 101.00", role: "down" },
              ],
            },
          ],
        },
        concept: "implementation-shortfall",
      },
      {
        kind: "worked",
        title: "Split the shortfall",
        lines: [
          "Parent order: 50,000 at a decision price of 100.00, or 5,000,000.00 on paper.",
          "Delay: 40,000 × (100.04 − 100.00) = 1,600.00.",
          "Half spread: 40,000 × 0.05 = 2,000.00.",
          "Impact: 40,000 × (100.18 − 100.04 − 0.05) = 3,600.00.",
          "Commission: 0.05% × 40,000 × 100.18 = 2,003.60.",
          "Opportunity: 10,000 unfilled × (101.00 − 100.00) = ?",
        ],
        ask: {
          answer: 10000,
          tolerance: 0.5,
          unit: "vUSD",
          feedback: [
            { value: 8200, text: "That measures the missed move from your average fill. Measure it from the decision price, 100.00." },
            { value: 9600, text: "That starts at the arrival price. Implementation shortfall measures from the decision price, 100.00." },
            { value: 50000, text: "That's all 50,000 units. Only the 10,000 that never filled missed the move." },
          ],
          correct: "Right: 10,000.00, the largest line of all.",
        },
        after: "Total: 19,203.60, or 38.4 [[basis-point|bps]] of the 5,000,000.00 you meant to trade. The 3,600.00 of impact is your own buying: it lifted the mid, and each child order walked the book.",
        concept: "implementation-shortfall",
      },
      {
        kind: "figure",
        title: "From paper to real",
        text: "The same shortfall as a waterfall, from the paper P&L to the real one, both marked at the 101.00 close.",
        figure: {
          kind: "bars",
          bars: [
            { label: "Paper P&L", value: 50000, role: "up" },
            { label: "Delay", value: -1600 },
            { label: "Half spread", value: -2000 },
            { label: "Impact", value: -3600 },
            { label: "Commission", value: -2003.6 },
            { label: "Missed units", value: -10000 },
            { label: "Real P&L", value: 30796.4, role: "up" },
          ],
          unit: " vUSD",
          steps: [
            "On paper: 50,000 units at 100.00, worth 101.00 at the close: +50,000. Delay takes 1,600 first.",
            "Trading the 40,000 costs half the spread, your impact and commission: 7,603.60 more.",
            "The 10,000 missed units cost the most. Real P&L: 30,796.40, a 19,203.60 shortfall.",
          ],
        },
        concept: "implementation-shortfall",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Opportunity cost never appears on a statement, so traders ignore it. A 'cheap' limit order that never fills can be the most expensive choice you make: here the 10,000 missed units cost more than delay, spread and impact together.",
      },
      {
        kind: "match",
        title: "Which line moves?",
        prompt: "Match each choice to the line of the shortfall it mostly changes.",
        pairs: [
          { left: "Sending the order 5 minutes after deciding", right: "Delay", wrong: "Price can move between your decision and your order's arrival. That gap is delay cost." },
          { left: "Buying at the ask instead of waiting at the bid", right: "Spread", wrong: "Crossing to the ask pays half the spread on every unit." },
          { left: "Buying all 50,000 within ten minutes", right: "Impact", wrong: "Trading fast against limited depth pushes the price up: market impact." },
          { left: "A limit far below the market that never fills", right: "Opportunity cost", wrong: "Unfilled units cost the move they missed." },
          { left: "A broker charging 0.05% per fill", right: "Commission", wrong: "A fee on each fill is commission." },
        ],
        columns: ["Choice", "Shortfall line"],
        correct: "Each choice moves one line, and implementation shortfall adds them all: a saving on one line can cost more on another.",
        concept: "implementation-shortfall",
      },
      {
        kind: "predict",
        title: "Your turn: price a shortfall",
        prompt: "A new order for 50,000 LABX. Decision 100.00, arrival 100.02. You fill 30,000 at 100.12; the rest never fills, and LABX closes at 100.30. What is the total shortfall in bps, commission included?",
        control: {
          kind: "numeric",
          unit: "bps",
          answer: 22.2,
          tolerance: 0.2,
          feedback: [
            { value: 10.2, text: "That leaves out the 20,000 unfilled units. They missed a 0.30 move: 6,000.00." },
            { value: 19.2, text: "Commission is missing: 0.05% × 30,000 × 100.12 = 1,501.80." },
            { value: 37, text: "Divide by the 5,000,000.00 you meant to trade, not by what you filled." },
            { value: 21.4, text: "The missed move starts at the decision price, 100.00, not the arrival price." },
          ],
        },
        reveal:
          "Delay 600.00 + spread and impact 3,000.00 + commission 1,501.80 + opportunity 6,000.00 = 11,101.80, or 22.2 bps of 5,000,000.00. Again, the units you never bought are the biggest line.",
        concept: "implementation-shortfall",
      },
    ],
    check: ["q-4.2.1-1", "q-4.2.1-2", "q-4.2.1-3"],
    recap: {
      takeaways: [
        "Implementation shortfall measures every cost against the decision price, not the price your order arrived at.",
        "Split it into delay, half spread, impact, commission and the opportunity cost of unfilled units.",
        "Divide the total by the intended trade's value: 19,203.60 on 5,000,000.00 is 38.4 bps.",
      ],
    },
  },
};

const L422: Lesson = {
  id: "4.2.2",
  title: "Market impact and the square-root law",
  topic: "order_types",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Your own trading moves the price; the square-root law estimates that impact from order size, daily volume and volatility, and total cost grows faster than size.",
  objectives: [
    "Distinguish temporary from permanent market impact.",
    "Estimate impact with the square-root law from order size, daily volume and volatility.",
    "Explain why doubling an order more than doubles its total impact cost.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M05", label: "Size Matters" },
    { kind: "check", ref: "order_types", label: "Order types check" },
  ],
  script: {
    unit: "4.2",
    courseId: "4.2.2",
    hook: {
      prompt: "Buying 50,000 LABX costs about 32 bps in market impact. You quadruple the order to 200,000. How many times larger is the impact per unit?",
      control: {
        kind: "slider",
        min: 1,
        max: 4,
        step: 0.5,
        unit: "×",
        start: 1,
        answer: 2,
        tolerance: 0,
        feedback: [
          { from: 1, to: 1.5, text: "Bigger orders do cost more per unit: √4 = 2 times as much." },
          { from: 2, to: 2, text: "Right: √4 = 2, so about 63 bps instead of 32." },
          { from: 2.5, to: 3.5, text: "Too high. Impact per unit grows with the square root of size, and √4 = 2." },
          { from: 4, to: 4, text: "That's growth in proportion to size. Per-unit impact grows with √size: √4 = 2." },
        ],
      },
      compare: "You said ×{yours}. Impact per unit grows with the square root of size: √4 = 2, so about 63 bps instead of 32. The total cost grows about 8 times.",
      concept: "square-root-impact",
    },
    learn: [
      {
        kind: "figure",
        title: "Push, then a partial fade",
        text: "Your buying pushes the price up. Part of the push fades when you stop and the book refills: [[temporary-impact|temporary impact]]. Part stays, because the market has learned that someone big was buying: [[permanent-impact|permanent impact]].",
        figure: {
          kind: "chart",
          chart: IMPACT_CHART,
          steps: [
            { text: "Before: LABX trades near 100.00. You start buying 50,000 units.", visible: 5, layers: [{ kind: "level", price: 100, role: "neutral", label: "BEFORE 100.00", chip: false }] },
            { text: "While you buy, the mid climbs. By your last fill it is 100.32.", visible: 17, layers: [{ kind: "level", price: 100.32, role: "concept", label: "LAST FILL 100.32" }] },
            {
              text: "Later it settles at 100.21: 0.11 faded, 0.21 stayed.",
              visible: 30,
              layers: [
                { kind: "level", price: 100.21, role: "entry", label: "SETTLES 100.21" },
                { kind: "bracket", from: 100.21, to: 100.32, index: 21, label: "TEMPORARY 0.11", role: "concept" },
                { kind: "bracket", from: 100, to: 100.21, index: 21, label: "PERMANENT 0.21", role: "accent" },
              ],
            },
          ],
        },
        concept: "market-impact",
      },
      {
        kind: "worked",
        title: "The square-root law",
        lines: [
          "[[square-root-law|Square-root law]]: impact ≈ Y × σ × √(Q ÷ V), with Y about 1 (Tóth, Bouchaud and others, 2011).",
          "LABX: daily volatility σ = 2%, daily volume V = 2,000,000.",
          "Q = 50,000: √0.025 = 0.158, so impact ≈ 0.32%, or 31.6 bps: about 15,811 vUSD on 5,000,000.",
          "Q = 100: √0.00005 = 0.0071, so 1.4 bps, below the 5 bps half spread.",
          "Q = 200,000: √0.10 = 0.316. Impact in bps = ?",
        ],
        ask: {
          answer: 63.2,
          tolerance: 0.2,
          unit: "bps",
          feedback: [
            { value: 126.4, text: "That grows impact in proportion to size. It grows with √4 = 2: 31.6 × 2." },
            { value: 31.6, text: "That's the 50,000 order. Use √0.10 = 0.316 for 200,000." },
            { value: 6.3, text: "σ is 2%, which is 200 bps: 200 × 0.316." },
          ],
          correct: "Right: 63.2 bps, twice the 31.6 for four times the size.",
        },
        after: "On 20,000,000.00 that's about 126,491 vUSD: 8 times the cost of 50,000 units, for 4 times the size. Q ÷ V is your [[participation-rate|participation rate]] if you spread the order over the whole day.",
        concept: "square-root-impact",
      },
      {
        kind: "predict",
        title: "Double the order",
        prompt: "You double an order from 50,000 to 100,000 LABX. By how much does its total impact cost grow?",
        control: {
          kind: "choice",
          choices: [
            { id: "x2", label: "About 2 times", feedback: "That holds only if impact per unit stayed flat. It rises too, by √2." },
            { id: "x28", label: "About 2.8 times" },
            { id: "x4", label: "About 4 times", feedback: "That needs impact per unit to double. It grows by √2 = 1.41, not 2." },
            { id: "x14", label: "About 1.4 times", feedback: "1.41 is the growth of impact per unit. You also trade twice the units." },
          ],
          answer: "x28",
        },
        figure: {
          kind: "bars",
          bars: [
            { label: "50,000 units", value: 15811, role: "neutral" },
            { label: "100,000 units", value: 44721, role: "accent" },
            { label: "200,000 units", value: 126491, role: "down" },
          ],
          unit: " vUSD",
        },
        reveal: "Twice the units, each paying √2 = 1.41 times the impact: 2 × 1.41 = 2.83. Total impact cost grows with size to the power 1.5: 15,811, then 44,721, then 126,491 vUSD.",
        concept: "square-root-impact",
      },
      {
        kind: "match",
        title: "Fades or stays?",
        prompt: "Sort each effect of a large buy order: temporary or permanent impact?",
        pairs: [
          { left: "Sell orders you emptied refill within minutes", right: "Temporary", wrong: "Liquidity coming back lets the price relax: that part fades." },
          { left: "Traders who saw the buying raise their view of value", right: "Permanent", wrong: "What the market learned from your flow stays in the price." },
          { left: "The ask sits higher only while your child orders keep lifting it", right: "Temporary", wrong: "Pressure that lasts only while you trade fades when you stop." },
          { left: "After the fund's purchase is reported, the price holds its gain", right: "Permanent", wrong: "The market took the purchase as news: that part of the move stays." },
        ],
        columns: ["Effect", "Impact"],
        correct: "Temporary impact is the price of demanding liquidity now; permanent impact is what the market learned. Slower trading shrinks the first, not the second.",
        concept: "market-impact",
      },
      {
        kind: "callout",
        tone: "info",
        text: "The square-root law is an empirical regularity found in many markets, not a law of physics: Y and the fit differ by market (grade A). It describes orders worked over hours. Send the same order at once and you walk the visible book instead, which can cost far more. How fast to trade is lesson 4.2.3's question.",
      },
      {
        kind: "predict",
        title: "Your turn: an impact budget",
        prompt: "Your fund allows at most 20 bps of expected impact on LABX (σ = 2%, V = 2,000,000). What is the largest order you can work in a day?",
        control: {
          kind: "slider",
          min: 0,
          max: 100000,
          step: 1000,
          unit: " units",
          start: 50000,
          answer: 20000,
          tolerance: 0,
          feedback: [
            { from: 0, to: 15000, text: "Safe, but small: at 15,000 units, impact is only 17.3 bps. Go bigger." },
            { from: 16000, to: 19000, text: "Close, and still under 20 bps. Solve 2% × √(Q ÷ 2,000,000) = 0.20%." },
            { from: 20000, to: 20000, text: "Right: 20,000 units, exactly 20 bps." },
            { from: 21000, to: 40000, text: "Over budget: at 21,000 units, impact is already 20.5 bps." },
            { from: 41000, to: 100000, text: "Far over. Impact grows with √Q: 80,000 units would cost 40 bps." },
          ],
        },
        reveal: "20,000 units: 2% × √(20,000 ÷ 2,000,000) = 2% × 0.10 = 0.20%, or 20 bps. That's 1% of daily volume. Doubling the budget to 40 bps allows four times the size: 80,000.",
        concept: "square-root-impact",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Why you never feel it: a 10,000 vUSD account buys about 100 LABX, 0.005% of daily volume. The law gives 1.4 bps, far below the 5 bps half spread, so your costs are spread and commission. A fund buying 200,000 pays 63.2 bps in impact alone.",
      },
    ],
    check: ["q-4.2.2-1", "q-4.2.2-2", "q-4.2.2-3"],
    recap: {
      takeaways: [
        "Temporary impact fades as the book refills; permanent impact stays because the market learned from your trades.",
        "Square-root law: impact ≈ σ × √(Q ÷ V). With σ 2%, 1% of volume costs 20 bps.",
        "Twice the size costs √2 more per unit, so about 2.8 times more in total.",
      ],
    },
  },
};

const L423: Lesson = {
  id: "4.2.3",
  title: "Execution algorithms: TWAP, VWAP, POV and IS",
  topic: "order_types",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "TWAP, VWAP, POV and IS algorithms slice a parent order in different ways, trading market impact against timing risk; you choose by urgency, benchmark and liquidity.",
  objectives: [
    "Describe how TWAP, VWAP, POV and implementation-shortfall algorithms slice a parent order.",
    "Explain the trade-off between market impact and timing risk.",
    "Choose an algorithm for a given urgency and liquidity profile.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "order_types", label: "Order types check" }],
  script: {
    unit: "4.2",
    courseId: "4.2.3",
    hook: {
      prompt: "You must buy 50,000 LABX today; the market trades 2,000,000. Which plan pays the most market impact?",
      control: {
        kind: "choice",
        choices: [
          { id: "market", label: "All at once, with one market order", feedback: "Right: it walks 250 levels of the book, from 100.05 to 102.54, for 124.5 bps of impact." },
          { id: "twap", label: "Evenly through the day", feedback: "Even slices are thin next to the market's volume: about 32.4 bps of impact here." },
          { id: "vwap", label: "Following the volume curve", feedback: "Trading 2.5% of volume all day costs the least impact here: 31.6 bps." },
          { id: "same", label: "They all pay the same", feedback: "Same order, very different impact: from 31.6 bps spread over the day to 124.5 bps in one go." },
        ],
        answer: "market",
      },
      compare: "You said {yours}. The market order paid 124.5 bps of impact; following the volume curve paid 31.6. But slow plans stay exposed to the price until they finish: that's timing risk.",
      concept: "execution-algorithm",
    },
    learn: [
      {
        kind: "match",
        title: "Four ways to slice",
        prompt: "Match each execution algorithm to how it slices a parent order.",
        pairs: [
          { left: "TWAP", right: "Equal slices at equal time intervals", wrong: "Time-weighted: the clock sets the pace, whatever the volume." },
          { left: "VWAP", right: "Slices sized to the expected volume curve", wrong: "Volume-weighted: it trades more when the market usually trades more." },
          { left: "POV", right: "A fixed share of the market's volume, such as 10%", wrong: "Percentage of volume: it speeds up and slows down with live trading." },
          { left: "IS", right: "Front-loaded, to stay close to the decision price", wrong: "Implementation shortfall: it trades early to cut the risk of waiting." },
        ],
        columns: ["Algorithm", "Rule"],
        correct: "TWAP follows the clock, VWAP the volume forecast, POV live volume, and IS the decision price.",
        concept: "execution-algorithm",
      },
      {
        kind: "figure",
        title: "Four schedules, one order",
        text: "Each line is the share of 50,000 LABX filled by each half hour, 09:30 to 16:00, under a [[twap|TWAP]], [[vwap-algorithm|VWAP]], [[pov-algorithm|POV]] or IS [[execution-algorithm|execution algorithm]]. At POV 10%, the order needs 500,000 traded in the market: a quarter of the day's 2,000,000.",
        figure: {
          kind: "chart",
          chart: SCHEDULES,
          steps: [
            {
              text: "TWAP: about 3,846 units every half hour, a straight line to 100% at 16:00.",
              layers: [
                { kind: "line", values: TWAP_CUM, role: "neutral" },
                { kind: "marker", index: 5, price: 38.5, label: "TWAP", role: "neutral" },
              ],
            },
            {
              text: "VWAP follows the U-shaped volume: 6,000 in the first half hour, 2,750 at midday.",
              layers: [
                { kind: "line", values: VWAP_CUM, role: "accent" },
                { kind: "marker", index: 9, price: 64.5, label: "VWAP", role: "accent" },
              ],
            },
            {
              text: "POV 10%: 24,000 in the first half hour, and done by 10:46.",
              layers: [
                {
                  kind: "path",
                  points: [
                    { index: 0, price: 0 },
                    { index: 1, price: 48 },
                    { index: 2, price: 84 },
                    { index: 2.53, price: 100 },
                    { index: 13, price: 100 },
                  ],
                  role: "down",
                },
                { kind: "marker", index: 2, price: 84, label: "POV 10%", role: "down" },
              ],
            },
            {
              text: "IS: 30% in the first half hour, then slower: less waiting, more impact than VWAP.",
              layers: [
                { kind: "line", values: IS_CUM, role: "concept" },
                { kind: "marker", index: 1, price: 30.4, label: "IS", role: "concept" },
              ],
            },
          ],
        },
        concept: "execution-algorithm",
      },
      {
        kind: "explain",
        title: "Impact or timing risk",
        text: "Every plan trades off two costs (Almgren and Chriss, 2000). Trade fast and you pay more impact. Trade slowly and the unfilled part rides the market: [[timing-risk|timing risk]]. Predictable slicing adds a third cost: others spot the pattern and trade ahead of you, which is [[information-leakage|information leakage]]. Grade: Mechanic.",
      },
      {
        kind: "reveal",
        title: "The algo race",
        prompt:
          "200 synthetic sessions, the same price paths for every plan. Each child order pays half the spread plus impact ≈ σ × √(participation). Bars, left to right: market order, POV 10%, IS, VWAP, TWAP. Averages are shown; the 95th percentiles, the bad days, are veiled. Whose bad day is cheapest?",
        chart: RACE,
        choices: [
          { id: "market", label: "The single market order" },
          { id: "pov", label: "POV 10%", feedback: "Close: 144.7 bps. But the market order's 134.6 is the same every day." },
          { id: "is", label: "The IS algorithm", feedback: "Its 95th percentile is 167.4: it still waits on part of the order." },
          { id: "vwap", label: "VWAP", feedback: "VWAP is cheapest on average, 38.6, but its bad days reach 213.6 bps." },
        ],
        answer: "market",
        after:
          "The market order costs 134.6 bps every day: no waiting, no timing risk. VWAP averages 38.6 but reaches 213.6 on bad days, and cost more than the market order in 38 of 200 sessions. No plan wins on both.",
        concept: "impact-timing-tradeoff",
      },
      {
        kind: "worked",
        title: "Your turn: meet the desk's limits",
        lines: [
          "Your desk's limits: an average below the market order's 134.6 bps, and a 95th percentile below 150 bps.",
          "POV 5%: average 49.0, 95th percentile 169.4.",
          "POV 10%: 69.3 and 144.7. POV 15%: 85.1 and 145.1.",
          "POV 20%: 98.2 and 151.5. POV 30%: 119.8 and 164.2.",
          "The cheapest POV rate that meets both limits, in % = ?",
        ],
        ask: {
          answer: 10,
          tolerance: 0,
          unit: "%",
          feedback: [
            { value: 5, text: "Cheapest on average, but its 95th percentile, 169.4, breaks the 150 limit." },
            { value: 15, text: "It meets both limits, but 10% does too, and averages 15.8 bps less." },
            { value: 20, text: "Its 95th percentile, 151.5, is just over the 150 limit." },
            { value: 30, text: "Its 95th percentile, 164.2, is over the limit, and its average is the highest of the five." },
          ],
          correct: "Right: POV 10%, done in 76 minutes. It beats the market order on average and keeps the bad days under 150 bps.",
        },
        after: "Slower plans cut the average but widen the bad days; faster ones do the reverse. Your limits pick the point on that trade-off.",
        concept: "impact-timing-tradeoff",
      },
      {
        kind: "match",
        title: "Pick the algorithm",
        prompt: "Match each order to the algorithm that fits it best.",
        pairs: [
          { left: "Your fund is judged against the day's VWAP", right: "VWAP", wrong: "If VWAP is the benchmark, trading with the volume curve keeps you close to it." },
          { left: "A thin stock: you must never be more than 5% of trading", right: "POV", wrong: "A cap on your share of volume is exactly what POV enforces." },
          { left: "Your idea will leak soon; get most of it done early", right: "IS", wrong: "Urgency favours front-loading: the IS algorithm cuts timing risk first." },
          { left: "No volume forecast; spread it evenly until the close", right: "TWAP", wrong: "Without a volume curve, the clock is the simplest schedule." },
        ],
        columns: ["Order", "Algorithm"],
        correct: "The benchmark, the liquidity and the urgency choose the algorithm. None is best in general.",
        concept: "execution-algorithm",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Execution saves costs; it doesn't create an edge. Good slicing trims basis points, but it can't turn a losing idea into a winner. Give every algorithm a price limit too: a sell algorithm set to 9% of volume, with no regard to price, helped set off the 2010 Flash Crash (lesson 4.2.5).",
      },
    ],
    check: ["q-4.2.3-1", "q-4.2.3-2", "q-4.2.3-3"],
    recap: {
      takeaways: [
        "TWAP follows the clock, VWAP the volume curve, POV live volume, and IS the decision price.",
        "Faster means more impact; slower means more timing risk. No plan wins on both.",
        "Choose by benchmark, urgency and liquidity, and cap the price so an algorithm can't chase.",
      ],
    },
  },
};

const L424: Lesson = {
  id: "4.2.4",
  title: "Latency, HFT and who is on the other side",
  topic: "order_types",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A resting order goes stale the instant news lands, and faster traders fill it before you can cancel; you can't win that race, so don't leave orders in the book at news.",
  objectives: [
    "Explain how a stale limit order gets picked off after a fast price change.",
    "List the traits regulators use to describe high-frequency trading.",
    "Decide which of your own orders are exposed to latency and how to reduce that exposure.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: unexpected event" },
    { kind: "check", ref: "order_types", label: "Order types check" },
  ],
  script: {
    unit: "4.2",
    courseId: "4.2.4",
    hook: {
      prompt: "Your limit buy rests at 100.00. News moves fair value to 99.80. Your platform needs 150 ms to cancel; a fast trader reacts in under a millisecond. What happens?",
      control: {
        kind: "choice",
        choices: [
          { id: "cancel", label: "You cancel in time", feedback: "Your cancel needs 150 ms; the fast trader needs under 1 ms. The race is over long before your message lands." },
          { id: "filled", label: "It fills at 100.00 before your cancel arrives" },
          { id: "exchange", label: "The exchange cancels it for you", feedback: "Exchanges don't cancel orders because news arrived. A resting order stays live until you pull it." },
          { id: "better", label: "It fills at 99.80, the new value", feedback: "A limit buy fills at its limit. The seller is glad to get 100.00 for something worth 99.80." },
        ],
        answer: "filled",
      },
      compare: "You said {yours}. A fast trader sold to you at 100.00 within a millisecond, and your cancel landed about 149 ms too late. You paid 0.20 above the new value.",
      concept: "latency-arbitrage",
    },
    learn: [
      {
        kind: "figure",
        title: "A race in milliseconds",
        text: "[[latency|Latency]] is the delay between an event and your order or cancel reaching the market. A resting order priced before the news is a [[stale-quote|stale quote]], and whoever reacts first trades against it.",
        figure: {
          kind: "chart",
          chart: PICKOFF,
          steps: [
            {
              text: "t = 0: news. Fair value drops from 100.05 to 99.80. Your bid still says 100.00.",
              layers: [
                { kind: "line", values: [100.05, 100.05, ...Array.from({ length: 16 }, () => 99.8)], role: "neutral", label: "FAIR VALUE" },
                { kind: "level", price: 100, role: "entry", label: "YOUR BID 100.00" },
                { kind: "marker", index: 2, price: 99.8, label: "NEWS, t = 0", role: "neutral" },
              ],
            },
            { text: "t = 0.5 ms: a fast trader sells 500 units into your stale bid.", layers: [{ kind: "marker", index: 2, price: 100, label: "FILLED, 0.5 ms", role: "down" }] },
            { text: "t = 150 ms: your cancel arrives. Too late: you own 500 at 100.00, worth 99.80.", layers: [{ kind: "marker", index: 17, price: 100, label: "CANCEL, 150 ms", role: "neutral" }] },
          ],
        },
        concept: "latency-arbitrage",
      },
      {
        kind: "explain",
        title: "What regulators call HFT",
        text: "The SEC (2010) describes [[high-frequency-trading|high-frequency trading]] by five traits: very fast programs; [[co-location]] and direct data feeds; very short holding periods; many orders cancelled soon after they're sent; and ending the day close to flat. Races between the fastest firms are decided in microseconds. Grade: Mechanic.",
      },
      {
        kind: "match",
        title: "Four families",
        prompt: "Match each family of high-frequency strategies (SEC, 2010) to what it does.",
        pairs: [
          { left: "Passive market making", right: "Quotes both sides to earn the spread and rebates", wrong: "Market makers rest bids and offers, and earn the spread plus rebates for adding liquidity." },
          { left: "Arbitrage", right: "Trades price gaps between related instruments or venues", wrong: "Arbitrage buys the cheap version and sells the dear one, such as an ETF against its stocks." },
          { left: "Structural", right: "Uses speed to hit quotes that haven't caught up yet", wrong: "Structural strategies live on latency: they trade against stale quotes." },
          { left: "Directional", right: "Bets on very short moves after news or order flow", wrong: "Directional strategies take a view, for seconds or minutes, on where price goes next." },
        ],
        columns: ["Family", "What it does"],
        correct: "Only the structural family lives on speed alone, picking off stale quotes. Whether HFT helps or harms depends on the family, and on market conditions.",
        concept: "latency-arbitrage",
      },
      {
        kind: "worked",
        title: "A free option",
        lines: [
          "Through a release you rest a bid of 500 at 100.00 and an offer of 500 at 100.10. Mid 100.05.",
          "Good news: fair value 100.30. A fast trader buys your offer at 100.10: you're short 500 at 0.20 below value.",
          "Bad news: fair value 99.80. A fast trader sells to your bid at 100.00: you're long 500 at 0.20 above value.",
          "Your loss, whichever way the news goes = ?",
        ],
        ask: {
          answer: 100,
          tolerance: 0.5,
          unit: "vUSD",
          feedback: [
            { value: 0, text: "Only if your cancel wins the race, and at 150 ms it doesn't. The stale side gets hit either way." },
            { value: 200, text: "Only one side gets hit: the one the news makes stale. 500 × 0.20." },
            { value: 0.2, text: "That's per unit. Multiply by the 500 units." },
          ],
          correct: "Right: 500 × 0.20 = 100.00, up or down.",
        },
        after: "A resting order is a free option for anyone faster: they exercise it only when it pays them. That's [[adverse-selection|adverse selection]] at machine speed.",
        concept: "latency-arbitrage",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Two myths. 'HFT hunts my one-lot order': one small order matters to nobody. 'HFT is always bad': effects depend on the strategy and conditions, and the SEC warns against judging from one study. Two real details: [[maker-taker]] rebates pay those who add liquidity, and FX dealers may use [[last-look|last look]].",
      },
      {
        kind: "callout",
        tone: "key",
        text: "This is how professionals do it. You are learning to recognise it, not to compete with it. A retail account doesn't win the latency race; it avoids running it.",
      },
      {
        kind: "match",
        title: "Your turn: which orders can go stale?",
        prompt: "Payrolls are due at 14:30. Sort each order: can a faster trader pick it off at a stale price?",
        pairs: [
          { left: "A GTC limit buy 0.10 under the market, left in the book", right: "Exposed", wrong: "It rests through the release. On bad news it fills at a price that's suddenly too high." },
          { left: "A day sell limit 0.30 above the market, left in the book", right: "Exposed", wrong: "Good news can lift value past it in microseconds, and it fills at the old price." },
          { left: "A limit buy you cancel at 14:25", right: "Safe", wrong: "Nothing rests at 14:30, so nothing can go stale." },
          { left: "A limit buy whose time in force ends at 14:29", right: "Safe", wrong: "It expires before the release: as safe as a cancelled order." },
          { left: "A new limit sent at 14:31, priced off the new quotes", right: "Safe", wrong: "It's priced after the news, so it isn't stale." },
        ],
        columns: ["Order", "At 14:30"],
        correct: "Only orders resting at 14:30 can go stale. Cancel them or let them expire first, and price new orders after the release.",
        concept: "latency-arbitrage",
      },
    ],
    check: ["q-4.2.4-1", "q-4.2.4-2", "q-4.2.4-3"],
    recap: {
      takeaways: [
        "A resting order goes stale the instant news lands; faster traders fill it before your cancel arrives.",
        "SEC traits of HFT: fast programs, co-location, short holds, many cancels, flat at day's end.",
        "You can't win the race: cancel or expire resting orders before scheduled news.",
      ],
    },
  },
};

const L425: Lesson = {
  id: "4.2.5",
  title: "Halts, limit up–limit down and circuit breakers",
  topic: "stop_loss",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "Market-wide circuit breakers and single-stock LULD pauses stop trading after big moves; trading restarts by auction, where stops fill at the reopening price and only a limit caps it.",
  objectives: [
    "Describe US market-wide circuit breakers and single-stock limit up–limit down pauses.",
    "Predict where a stop order fills when a halted stock reopens through an auction.",
    "Choose order handling that caps your exit price during a halt, and state the risk of no fill.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: unexpected event" },
    { kind: "mission", ref: "M07", label: "Stop or Stay?" },
  ],
  script: {
    unit: "4.2",
    courseId: "4.2.5",
    hook: {
      prompt: "LABX is halted at 90.00 after a fast drop. Your stop-loss sits at 89.50. It reopens at 84.00. Where does your stop fill?",
      control: {
        kind: "choice",
        choices: [
          { id: "stop", label: "89.50, your stop price", feedback: "A stop isn't a guaranteed price. No trade printed between 90.00 and 84.00, so 89.50 was never there." },
          { id: "halt", label: "90.00, where trading halted", feedback: "Your stop hadn't triggered at 90.00. It triggers at the first trade after the halt." },
          { id: "reopen", label: "About 84.00, the reopening price" },
          { id: "none", label: "It doesn't fill", feedback: "Once triggered, a stop becomes a market order. It fills: at the reopening price, not yours." },
        ],
        answer: "reopen",
      },
      compare: "You said {yours}. The reopening auction printed 84.00. Your stop triggered there and filled near 84.00: 5.50 below the stop, on every unit.",
      concept: "trading-halts",
    },
    learn: [
      {
        kind: "figure",
        title: "Market-wide circuit breakers",
        text: "Market-wide [[circuit-breaker|circuit breakers]] halt all US stocks after big falls in the S&P 500. Level 1 was hit four times in March 2020: on the 9th, 12th, 16th and 18th.",
        figure: {
          kind: "chart",
          chart: MWCB,
          steps: [
            {
              text: "Yesterday's S&P 500 close: 5,000. Circuit breakers measure today's fall from it.",
              layers: [
                { kind: "level", price: 5000, role: "neutral", label: "PREVIOUS CLOSE 5,000", chip: false },
                run(0, MWCB_PATH, "accent"),
              ],
            },
            {
              text: "Level 1, −7%, at 4,650: every US stock halts 15 minutes, if before 15:25 ET.",
              layers: [
                { kind: "level", price: 4650, role: "stop", label: "LEVEL 1: −7% = 4,650", chip: false },
                { kind: "marker", index: 4, price: 4650, label: "15-MIN HALT", role: "down" },
              ],
            },
            { text: "Level 2, −13%, at 4,350: another 15-minute halt, again only before 15:25 ET.", layers: [{ kind: "level", price: 4350, role: "stop", label: "LEVEL 2: −13% = 4,350", chip: false }] },
            { text: "Level 3, −20%, at 4,000: trading stops for the rest of the day, at any time.", layers: [{ kind: "level", price: 4000, role: "stop", label: "LEVEL 3: −20% = 4,000", chip: false }] },
          ],
        },
        concept: "trading-halts",
      },
      {
        kind: "figure",
        title: "Limit up–limit down",
        text: "Single US stocks have [[limit-up-limit-down]] bands: 5%, 10% or 20% around the average price of the last 5 minutes, set by the stock's tier and price. A [[trading-halt|pause]] ends in a [[reopening-auction|reopening auction]] on the listing exchange.",
        figure: {
          kind: "chart",
          chart: LULD,
          steps: [
            {
              text: "LULD bands: 10% around LABX's 5-minute average price of 100.00, so 90.00 to 110.00.",
              layers: [
                { kind: "zone", from: 90, to: 110, role: "concept", label: "BAND 90.00–110.00" },
                run(0, LULD_BEFORE.slice(0, 9)),
              ],
            },
            {
              text: "Price hits 90.00. No trade can print below it. Fifteen seconds stuck there: a 5-minute pause.",
              layers: [run(8, LULD_BEFORE.slice(8)), { kind: "marker", index: 10, price: 90, label: "15 S AT THE BAND", role: "neutral" }],
            },
            {
              text: "The listing exchange reopens LABX by auction at 84.00. Your 89.50 stop triggers at that print.",
              layers: [
                { kind: "marker", index: 14, price: 87, label: "5-MIN PAUSE", role: "neutral" },
                run(18, LULD_AFTER),
                { kind: "level", price: 89.5, role: "stop", label: "YOUR STOP 89.50" },
                { kind: "marker", index: 18, price: 84, label: "REOPEN 84.00", role: "down" },
              ],
            },
          ],
        },
        concept: "trading-halts",
      },
      {
        kind: "match",
        title: "Read the halt code",
        prompt: "Match each Nasdaq halt code to its meaning.",
        pairs: [
          { left: "T1", right: "Halt: news pending", wrong: "T1 stops trading while material news is about to come out." },
          { left: "T2", right: "Halt: news released", wrong: "T2 follows T1: the news is out, and trading will resume shortly." },
          { left: "LUDP", right: "Volatility trading pause (LULD)", wrong: "LUDP is the 5-minute pause after a stock sits at its LULD band." },
          { left: "MWC1", right: "Market-wide circuit breaker, Level 1", wrong: "MWC codes are market-wide: MWC1 is the −7% Level 1 halt." },
        ],
        columns: ["Code", "Meaning"],
        correct: "News halts (T1, T2), volatility pauses (LUDP) and market-wide breakers (MWC1–3) all end the same way: a reopening auction.",
        concept: "trading-halts",
      },
      {
        kind: "explain",
        title: "Outside the US",
        text: "Europe uses [[volatility-auction|volatility auctions]] instead of pauses. On the London Stock Exchange, a trade beyond the price tolerance starts a 5-minute auction, which can be extended and ends at a random moment within 30 seconds. Futures exchanges set price limits and pause on sudden spikes. Grade: Mechanic.",
      },
      {
        kind: "reveal",
        title: "6 May 2010",
        prompt: "A stylised Dow on 6 May 2010, in % of the previous close. It has just dropped to 90.8, down 9.2%. The rest of the afternoon is under the veil. What happens next?",
        chart: FLASH_CHART,
        choices: [
          { id: "low", label: "It stays near the low", feedback: "Most of the fall came back within about 20 minutes: 96.2 by 15:05." },
          { id: "back", label: "It recovers most of the fall within the hour" },
          { id: "l3", label: "It falls on to −20% and closes for the day", feedback: "It turned around at −9.2%. The 2010 breakers were set at 10%, 20% and 30% of the Dow, so none fired." },
        ],
        answer: "back",
        after:
          "It closed down 3.2%. In this [[flash-crash|flash crash]], a fund's algorithm was selling 75,000 E-mini futures at 9% of volume, 'without regard to price or time' (SEC–CFTC, 2010). Many of almost 8,000 stocks and ETFs fell 5% to 15%; some traded at a cent. LULD came after.",
        concept: "trading-halts",
      },
      {
        kind: "predict",
        title: "Your turn: exit through the auction",
        prompt: "LABX is paused at 90.00 and will reopen by auction, probably lower. You hold 100 and want out, but at no worse than 85.00. What do you send?",
        control: {
          kind: "choice",
          choices: [
            { id: "stop", label: "Keep the 89.50 stop", feedback: "It becomes a market order at the reopening print, about 84.00 here: below your 85.00 floor." },
            { id: "market", label: "A market sell into the auction", feedback: "A market order takes whatever the auction prints: 84.00 here, below your floor." },
            { id: "limit", label: "A sell limit at 85.00, accepting it may not fill" },
            { id: "wait", label: "Nothing; sell after it reopens", feedback: "After the print the book is thin and moving fast. You'd sell at the bid with no cap at all." },
          ],
          answer: "limit",
        },
        reveal: "The auction prints 84.00, so your 85.00 limit doesn't fill: you still hold 100 LABX, now worth 8,400.00. The limit capped the price, not the risk. Had the auction printed 86.20, you'd have sold at 86.20.",
        concept: "trading-halts",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "A stop is a trigger, not a price: in a halt it waits for the reopening print. A limit caps the price but may leave you holding. Spot FX has no halts at all: when the SNB dropped the EUR/CHF floor on 15 January 2015, stops filled far past their levels and Alpari UK announced insolvency the next day.",
      },
    ],
    check: ["q-4.2.5-1", "q-4.2.5-2", "q-4.2.5-3"],
    recap: {
      takeaways: [
        "S&P 500 down 7% or 13% before 15:25 ET: 15-minute halt. Down 20%: closed for the day.",
        "After a halt, a stop triggers at the reopening auction price, however far from its level.",
        "A sell limit caps your exit price in the auction, but you may not get filled.",
      ],
    },
  },
};

const L426: Lesson = {
  id: "4.2.6",
  title: "Fixes, expiries and crowded clocks",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Fixes, month-ends, closing auctions and expiries move volume and spreads for mechanical reasons: they change your costs, not the market's direction.",
  objectives: [
    "Identify the scheduled windows where liquidity, volume and volatility change for mechanical reasons.",
    "Explain option pinning near large open-interest strikes on expiry days.",
    "Tell a clock-driven volume spike from a directional signal.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "4.2",
    courseId: "4.2.6",
    hook: {
      prompt: "At 16:00 London, LABC (FX) volume jumps five-fold for five minutes, then fades. What is it?",
      control: {
        kind: "choice",
        choices: [
          { id: "breakout", label: "A breakout signal", feedback: "Nothing broke out: price barely moved. The volume came from orders that had to trade at that time." },
          { id: "money", label: "Big money entering", feedback: "Big money, yes, but trading at a benchmark price, not taking a view. It comes back every day at 16:00." },
          { id: "fix", label: "The benchmark fix" },
          { id: "error", label: "A data error", feedback: "It's real volume, and it shows up every day in the same five minutes: the fix window." },
        ],
        answer: "fix",
      },
      compare: "You said {yours}. It's the WM/Reuters fix: funds trade FX at the 16:00 London benchmark, so their orders crowd into a 5-minute window every day.",
      concept: "liquidity-clock",
    },
    learn: [
      {
        kind: "figure",
        title: "The fix window",
        text: "Big funds trade currencies at the [[benchmark-fix|benchmark fix]], so their orders crowd into the window around 16:00 London. Volume jumps, but the flow is scheduled: orders that had to trade then, not a view on direction.",
        figure: {
          kind: "chart",
          chart: FIX_CHART,
          steps: [
            { text: "15:40 to 15:57: LABC trades about 120 a minute, near 150.00.", visible: 18 },
            { text: "15:58 to 16:02: 600 a minute, five times normal. That's the fix window.", visible: 23, layers: [{ kind: "marker", index: 20, price: 150.05, label: "FIX 16:00", role: "concept" }] },
            { text: "From 16:03, back to about 120. LABC ends at 150.01, 0.01 from where it started.", visible: 41 },
          ],
        },
        concept: "liquidity-clock",
      },
      {
        kind: "match",
        title: "Who trades on the clock?",
        prompt: "Match each scheduled window to the mechanical flow behind it.",
        pairs: [
          { left: "Five minutes around 16:00 London", right: "Funds trading the FX benchmark fix", wrong: "The WM/Reuters fix is set in a 5-minute window around 16:00 London." },
          { left: "The last trading day of the month or quarter", right: "Funds rebalancing to target weights", wrong: "Month- and quarter-end bring rebalancing back to target weights, often at the close." },
          { left: "The third Friday of March, June, September and December", right: "Futures and options expiring together", wrong: "Quarterly witching: many derivatives expire the same day." },
          { left: "The last print of every session", right: "Index funds trading the official close", wrong: "Index funds track closing prices, so they trade in the closing auction." },
        ],
        columns: ["Window", "Flow"],
        correct: "The fix, [[month-end-rebalancing|month-end rebalancing]], the [[witching-day|witching day]] and the [[closing-auction|closing auction]] all move volume on schedule.",
        concept: "liquidity-clock",
      },
      {
        kind: "hotspot",
        title: "When does the spread jump?",
        prompt: "A synthetic LABC day: the average spread each hour, in pips, London time from 00:00. Tap the hour where it jumps for a scheduled, mechanical reason.",
        chart: SPREAD_CHART,
        zones: [
          { id: "asia", label: "03:00, Asian session", index: 3, feedback: "Spreads are a little wider all night, as fewer dealers quote, but there's no jump here." },
          { id: "london", label: "08:00, London open", index: 8, feedback: "Spreads narrow here: London brings the most liquidity of the day." },
          { id: "fix", label: "16:00, the fix", index: 16, feedback: "Volume jumps at the fix, but here the spread holds at 0.7: lots of orders on both sides." },
          { id: "rollover", label: "22:00, rollover", index: 22 },
        ],
        answer: "rollover",
        correct: "Right: 22:00 London is 17:00 New York, the daily [[rollover]]. Dealers widen quotes as positions roll: 3.8 pips, against 0.7 through the London day.",
        concept: "liquidity-clock",
      },
      {
        kind: "explain",
        title: "Option pinning",
        text: "On expiry days, prices can settle near strikes with large [[open-interest|open interest]] (Ni, Pearson and Poteshman, 2005). Dealers' hedging is the usual explanation: long-gamma dealers sell rallies and buy dips, damping moves; short-gamma dealers buy rallies and sell dips, amplifying them. Retail 'gamma level' maps are far noisier. Grade: B.",
      },
      {
        kind: "predict",
        title: "Your turn: is there pinning?",
        prompt:
          "A synthetic test, strike 100. Expiry days: 20 of 50 closed within ±0.50 of 100 (40%). Normal days: 13 of 50 (26%). With no pinning, two 50-day samples differ by up to 18 points in 95% of runs. Is pinning present?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes: 40% is well above 26%", feedback: "The gap is 14 points, inside the 18 that luck alone produces. This sample can't tell." },
            { id: "cant", label: "Can't tell from this sample" },
            { id: "no", label: "No: pinning is a myth", feedback: "Not showing it isn't the same as not having it. These expiry days were built with pinning." },
          ],
          answer: "cant",
        },
        reveal:
          "The 14-point gap sits inside the noise band, so this sample can't tell, yet these synthetic expiry days were built with a pull toward 100. With 10 days of each, the band would be 40 points. Real studies use thousands of stock-expiry days.",
        concept: "option-pinning",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Flow at these hours is mechanical, not informative: don't read it as direction. It does change your costs. Before a large order, check the clock: the fix, month-end, the close, expiries and the rollover each reshape volume and spreads.",
      },
      {
        kind: "predict",
        title: "Signal or schedule?",
        prompt: "Last trading day of the quarter. LABX's closing auction trades 4 times its usual size, and the close prints 0.6% above the 15:50 price. What do you do with it?",
        control: {
          kind: "choice",
          choices: [
            { id: "buy", label: "Buy tomorrow: big money is accumulating", feedback: "Rebalancing funds had to trade at that print, whatever they think about value. It isn't a view." },
            { id: "cal", label: "Check the calendar: quarter-end flow is mechanical" },
            { id: "short", label: "Short it: the pop will reverse", feedback: "That's a direction call too. Mechanical flow says little either way about tomorrow." },
          ],
          answer: "cal",
        },
        reveal: "Quarter-end: funds rebalance to their target weights, and index funds trade the official close. That flow was scheduled, not informed. It changes your execution cost at the close, not tomorrow's direction.",
        concept: "liquidity-clock",
      },
    ],
    check: ["q-4.2.6-1", "q-4.2.6-2", "q-4.2.6-3"],
    recap: {
      takeaways: [
        "Fixes, month-ends, closing auctions and expiries change volume and spreads on schedule, for mechanical reasons.",
        "Near expiry, prices can pin to strikes with big open interest; test it against a noise band.",
        "A clock-driven volume spike is flow that had to trade, not a signal of direction.",
      ],
    },
  },
};

// ─── Check questions ────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 4.2.1 · Implementation shortfall
  {
    id: "q-4.2.1-1",
    topic: "order_types",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which cost does implementation shortfall count that slippage on your fills never shows?",
    options: [
      { id: "a", label: "The spread you crossed on filled units", rationale: "Fill prices already include the spread you crossed, so slippage on fills shows it." },
      { id: "b", label: "The levels your order walked through in the book", rationale: "Walking the book worsens your fill prices, so it shows up in slippage too." },
      { id: "c", label: "The move you missed on units that never filled" },
      { id: "d", label: "The gap between the price you expected and your fill", rationale: "That gap is the definition of slippage itself." },
    ],
    correct: "c",
    explanation:
      "Slippage is measured on fills, so units that never filled leave no trace. Implementation shortfall prices them at the move they missed from the decision price: the opportunity cost, often the largest line.",
    lesson: "4.2.1",
    concepts: ["implementation-shortfall", "slippage"],
  },
  {
    id: "q-4.2.1-2",
    topic: "order_types",
    kind: "numeric",
    difficulty: 2,
    prompt: "You decide to buy 20,000 LABX at 50.00. You fill 15,000 at an average of 50.08; the rest never fills, and the price closes at 50.30. With 0.05% commission, what is the implementation shortfall in bps?",
    numeric: { answer: 30.8, tolerance: 0.2, unit: "bps" },
    explanation:
      "Filled: 15,000 × 0.08 = 1,200.00. Commission: 0.05% × 751,200.00 = 375.60. Opportunity: 5,000 × 0.30 = 1,500.00. Total 3,075.60 on the 1,000,000.00 you meant to trade: 30.8 bps.",
    lesson: "4.2.1",
    concepts: ["implementation-shortfall"],
    hints: [
      "Measure every price against the decision price, 50.00.",
      "Unfilled units cost the move they missed: 5,000 × 0.30.",
      "Total 3,075.60; divide by 20,000 × 50.00 and multiply by 10,000.",
    ],
    vary: {
      fields: { qk: [10, 40, 5], p: [40, 120, 10], fill: [50, 90, 5], a: [0.04, 0.12, 0.02], b: [0.2, 0.6, 0.1] },
      answer: "round((qk * 10 * fill * a + commission(qk * 10 * fill * (p + a)) + qk * 10 * (100 - fill) * b) / (qk * 1000 * p) * 10000, 1)",
      prompt:
        "You decide to buy {qk * 1000} LABX at {p:2}. You fill {qk * 10 * fill} at an average of {p + a:2}; the rest never fills, and the price closes at {p + b:2}. With 0.05% commission, what is the implementation shortfall in bps?",
      explanation:
        "Filled: {qk * 10 * fill} × {a:2} = {qk * 10 * fill * a:2}. Commission: 0.05% × {qk * 10 * fill * (p + a):2} = {commission(qk * 10 * fill * (p + a)):2}. Opportunity: {qk * 10 * (100 - fill)} × {b:2} = {qk * 10 * (100 - fill) * b:2}. Divided by the {qk * 1000 * p:2} you meant to trade: {answer:1} bps.",
      hint: "Total {qk * 10 * fill * a + commission(qk * 10 * fill * (p + a)) + qk * 10 * (100 - fill) * b:2}; divide by {qk * 1000 * p:2} and multiply by 10,000.",
    },
  },
  {
    id: "q-4.2.1-3",
    topic: "order_types",
    kind: "mcq",
    difficulty: 2,
    prompt: "A portfolio manager decides to buy at 10:00, with LABX at 100.00. The trader sends the order at 10:30, with LABX at 100.40. Why measure the shortfall from 100.00?",
    options: [
      { id: "a", label: "The 0.40 move while the order waited is a real cost of the decision, and the arrival price would hide it" },
      { id: "b", label: "The arrival price can't be known after the trade", rationale: "Arrival prices are recorded. The problem is that measuring from them leaves the delay out." },
      { id: "c", label: "The decision price is always the lower of the two", rationale: "Price can rise or fall during a delay. Either way, the delay is part of the cost." },
      { id: "d", label: "Commission is charged on the decision price", rationale: "Commission is charged on fill value. The reference price decides which costs get counted." },
    ],
    correct: "a",
    explanation:
      "The paper portfolio's return starts when the decision is made. Measured from the arrival price, the 0.40 delay vanishes and slow hand-offs look free. From the decision price, every cost of turning the idea into a position is counted.",
    lesson: "4.2.1",
    concepts: ["implementation-shortfall"],
    hints: ["Ask which price the paper portfolio would have paid.", "What happens to the 0.40 if you start measuring at 10:30?"],
  },

  // 4.2.2 · Market impact and the square-root law
  {
    id: "q-4.2.2-1",
    topic: "order_types",
    kind: "mcq",
    difficulty: 1,
    prompt: "A fund finishes buying LABX at 100.32. Over the next hour the price eases to 100.21 and stays there. What was the 0.11 that faded?",
    options: [
      { id: "a", label: "Permanent impact", rationale: "Permanent impact is the part that stays: here, the 0.21 that held." },
      { id: "b", label: "Temporary impact" },
      { id: "c", label: "The bid-ask spread", rationale: "The spread is the width of the quotes at any time; it doesn't fade after an order." },
      { id: "d", label: "New negative news", rationale: "Nothing new happened. The fade is the book refilling after the buying stopped." },
    ],
    correct: "b",
    explanation:
      "Temporary impact is the price pressure of demanding liquidity, and it fades when you stop and the book refills. The 0.21 that stayed is permanent impact: what the market learned from the buying.",
    lesson: "4.2.2",
    concepts: ["market-impact"],
  },
  {
    id: "q-4.2.2-2",
    topic: "order_types",
    kind: "numeric",
    difficulty: 2,
    prompt: "An order is 1% of the day's volume, and daily volatility is 3%. With Y = 1, what market impact does the square-root law predict, in bps?",
    numeric: { answer: 30, tolerance: 0.5, unit: "bps" },
    explanation: "√1% = √0.01 = 0.1. Impact ≈ 3% × 0.1 = 0.3%, or 30 bps.",
    lesson: "4.2.2",
    concepts: ["square-root-impact"],
    hints: ["Impact ≈ Y × σ × √(Q ÷ V).", "√0.01 = 0.1.", "3% × 0.1 = 0.3%. Convert to bps: 1% = 100 bps."],
    vary: {
      fields: { s: [1, 4, 0.5], r: [1, 4, 1] },
      answer: "10 * s * r",
      prompt: "An order is {r * r}% of the day's volume, and daily volatility is {s:1}%. With Y = 1, what market impact does the square-root law predict, in bps?",
      explanation: "√{r * r}% = {r / 10:1}. Impact ≈ {s:1}% × {r / 10:1} = {s * r / 10:2}%, or {answer} bps.",
      hint: "{s:1}% × {r / 10:1} = {s * r / 10:2}%. Convert to bps: 1% = 100 bps.",
    },
  },
  {
    id: "q-4.2.2-3",
    topic: "order_types",
    kind: "mcq",
    difficulty: 2,
    prompt: "Why does a 10,000 vUSD account barely feel market impact on LABX, while a fund buying 200,000 units pays about 63 bps?",
    options: [
      { id: "a", label: "Impact grows with order size relative to daily volume, and 100 units is a tiny share" },
      { id: "b", label: "Brokers protect retail orders from impact", rationale: "No broker can remove impact: it comes from the size you ask the market to absorb." },
      { id: "c", label: "Funds pay higher commissions", rationale: "Commission is a fee on each fill. Impact is a separate price move caused by your size." },
      { id: "d", label: "Impact only applies to market orders", rationale: "Large limit orders worked over hours move the price too: impact follows size, not order type." },
    ],
    correct: "a",
    explanation:
      "Impact ≈ σ × √(Q ÷ V). 100 units is 0.005% of the 2,000,000 daily volume: 1.4 bps, below the 5 bps half spread. 200,000 units is 10%: about 63 bps. Retail costs are spread and commission; a fund's is impact.",
    lesson: "4.2.2",
    concepts: ["square-root-impact"],
    hints: ["Compare each order with the 2,000,000 units LABX trades in a day."],
  },

  // 4.2.3 · Execution algorithms
  {
    id: "q-4.2.3-1",
    topic: "order_types",
    kind: "scenario",
    difficulty: 2,
    scenario: "You must buy 50,000 LABX today, and daily volume is 2,000,000. You expect the price to drift up during the day as others learn what you know.",
    prompt: "Which algorithm fits best?",
    options: [
      { id: "a", label: "VWAP over the whole day", rationale: "VWAP leaves much of the order for the afternoon, exposed to the rise you expect." },
      { id: "b", label: "An IS algorithm that front-loads the order" },
      { id: "c", label: "TWAP over the whole day", rationale: "Even slices until the close keep most of the order waiting while the price drifts up." },
      { id: "d", label: "POV at 2%", rationale: "At 2% of volume, 50,000 units need 2,500,000 traded: more than a whole day." },
    ],
    correct: "b",
    explanation:
      "When you expect the price to move against you, timing risk dominates: front-loading pays more impact but leaves less of the order exposed. That's what an implementation-shortfall algorithm does.",
    lesson: "4.2.3",
    concepts: ["execution-algorithm", "impact-timing-tradeoff"],
    hints: ["Which cost grows when the price is expected to run away: impact or timing risk?"],
  },
  {
    id: "q-4.2.3-2",
    topic: "order_types",
    kind: "mcq",
    difficulty: 2,
    prompt: "You switch a 50,000-unit LABX order from POV 20% to VWAP over the whole day. Which cost rises?",
    options: [
      { id: "a", label: "Market impact", rationale: "Slower trading lowers impact: VWAP's participation is 2.5% of volume, not 20%." },
      { id: "b", label: "Commission", rationale: "Commission is 0.05% of each fill, whatever the schedule." },
      { id: "c", label: "Timing risk" },
      { id: "d", label: "The half spread", rationale: "Each child order still crosses half the spread; the schedule doesn't change that." },
    ],
    correct: "c",
    explanation:
      "VWAP spreads the order over the day, so impact falls, but the unfilled part stays exposed to price moves for hours. In this lesson's race, the 95th percentile rose from 151.5 to 213.6 bps.",
    lesson: "4.2.3",
    concepts: ["impact-timing-tradeoff"],
    hints: ["What happens to the unfilled units while you wait?"],
  },
  {
    id: "q-4.2.3-3",
    topic: "order_types",
    kind: "mcq",
    difficulty: 3,
    prompt: "A trader's algorithm buys exactly 1,000 LABX every 5 minutes, on the minute. Why is that a problem?",
    options: [
      { id: "a", label: "Others can spot the pattern and buy ahead of the next slice, raising its price" },
      { id: "b", label: "Exchanges reject orders sent at regular times", rationale: "Exchanges accept them. The danger is what other traders learn from the pattern." },
      { id: "c", label: "Equal slices always pay more commission", rationale: "Commission is a share of fill value; slicing barely changes the total." },
      { id: "d", label: "Regular slices can't fill in thin markets", rationale: "They can fill. The problem is that their rhythm advertises a large buyer." },
    ],
    correct: "a",
    explanation:
      "A regular rhythm leaks information: others infer a large buyer and trade ahead, so each child order pays more. Real algorithms randomise sizes and timing to hide their footprint.",
    lesson: "4.2.3",
    concepts: ["execution-algorithm"],
    hints: ["Who else watches the tape, and what does a steady rhythm tell them?"],
  },

  // 4.2.4 · Latency and HFT
  {
    id: "q-4.2.4-1",
    topic: "order_types",
    kind: "mcq",
    difficulty: 1,
    prompt: "What is a stale quote?",
    options: [
      { id: "a", label: "A resting order whose price no longer reflects the latest information" },
      { id: "b", label: "A quote that has been in the book for more than a day", rationale: "Age isn't the point: a quote goes stale the moment news changes value, even a millisecond after it was placed." },
      { id: "c", label: "An order the exchange has cancelled", rationale: "A cancelled order can't trade. A stale quote is dangerous because it is still live." },
      { id: "d", label: "A price shown late on a delayed data feed", rationale: "A delayed feed is a display problem. A stale quote is a live order at an outdated price." },
    ],
    correct: "a",
    explanation:
      "When news changes value, resting orders priced before it are stale. Faster traders trade against them before their owners can cancel, which is why a resting order is a free option for anyone faster.",
    lesson: "4.2.4",
    concepts: ["latency-arbitrage"],
  },
  {
    id: "q-4.2.4-2",
    topic: "order_types",
    kind: "mcq",
    difficulty: 2,
    prompt: "Which of these is one of the traits the SEC uses to describe high-frequency trading?",
    options: [
      { id: "a", label: "Holding positions for weeks", rationale: "HFT holds positions for very short periods, often seconds or less." },
      { id: "b", label: "Ending the trading day close to flat" },
      { id: "c", label: "Trading only at the open and the close", rationale: "HFT trades all day; its speed matters most when quotes change." },
      { id: "d", label: "Always taking the other side of retail orders", rationale: "That's not a trait in the SEC's list. HFT trades with everyone, and many orders never meet a retail one." },
    ],
    correct: "b",
    explanation:
      "The SEC's 2010 list: very fast programs; co-location and direct data feeds; very short holding periods; many orders cancelled soon after they're sent; and ending the day close to flat.",
    lesson: "4.2.4",
    concepts: ["latency-arbitrage"],
    hints: ["Think about how long HFT firms want to carry risk."],
  },
  {
    id: "q-4.2.4-3",
    topic: "order_types",
    kind: "scenario",
    difficulty: 2,
    scenario: "Payrolls are due at 14:30. You have a limit buy 0.10 below the market that would rest through the release. Your platform takes 150 ms to cancel an order.",
    prompt: "What is your realistic fix?",
    options: [
      { id: "a", label: "Move to a faster broker so you can cancel in time", rationale: "Races between the fastest firms are decided in microseconds. A retail setup can't win them." },
      { id: "b", label: "Widen the limit to 0.30 below the market", rationale: "A bigger move still finds it stale. Any order resting through news is a free option for someone faster." },
      { id: "c", label: "Cancel it or let it expire before 14:30, and decide after the release" },
      { id: "d", label: "Switch it to a GTC order", rationale: "Time in force doesn't help if the order still rests at 14:30. GTC rests through the release just the same." },
    ],
    correct: "c",
    explanation:
      "You can't be faster than professionals, so don't race them. Make sure nothing rests at the release: cancel or let orders expire before it, then price new orders off the new quotes.",
    lesson: "4.2.4",
    concepts: ["latency-arbitrage", "limit-order"],
    hints: ["Which orders can go stale? Only the ones resting when the news lands."],
  },

  // 4.2.5 · Halts, LULD and circuit breakers
  {
    id: "q-4.2.5-1",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 1,
    prompt: "At 14:10 ET, the S&P 500 is down 13% from yesterday's close. What happens?",
    options: [
      { id: "a", label: "Trading stops for the rest of the day", rationale: "That's Level 3, at −20%. Level 2, at −13%, is a 15-minute halt." },
      { id: "b", label: "Nothing: only Level 1 can halt the market", rationale: "Level 1 (−7%) and Level 2 (−13%) each halt for 15 minutes when hit before 15:25 ET." },
      { id: "c", label: "All US stocks halt for 15 minutes (Level 2)" },
      { id: "d", label: "Only the stocks that fell most are paused", rationale: "Single-stock pauses are LULD. A 13% index fall triggers a market-wide halt." },
    ],
    correct: "c",
    explanation:
      "Market-wide circuit breakers use the S&P 500's fall from the previous close: −7% (Level 1) and −13% (Level 2) halt all US stocks for 15 minutes if hit before 15:25 ET; −20% (Level 3) closes the market for the day.",
    lesson: "4.2.5",
    concepts: ["trading-halts"],
  },
  {
    id: "q-4.2.5-2",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 2,
    prompt: "A stock halts at 50.00 after a fast fall. Your sell stop is at 49.50. Trading reopens by auction at 46.00. Where does your stop most likely fill?",
    options: [
      { id: "a", label: "49.50, the stop price", rationale: "No trade printed between 50.00 and 46.00, so 49.50 was never available." },
      { id: "b", label: "50.00, the halt price", rationale: "Your stop hadn't triggered at 50.00. It triggers at the first trade after the halt." },
      { id: "c", label: "Near 46.00, the reopening price" },
      { id: "d", label: "Nowhere: stops cancel during a halt", rationale: "Stops usually stay live through a halt. They trigger at the reopening print and become market orders." },
    ],
    correct: "c",
    explanation:
      "A stop is a trigger, not a price. The reopening auction prints 46.00, the stop triggers there and becomes a market order, filling near 46.00: 3.50 worse than the stop on every unit.",
    lesson: "4.2.5",
    concepts: ["trading-halts", "stop-loss-order"],
    hints: ["Where is the first trade after the halt?", "Once triggered, a stop is a market order."],
  },
  {
    id: "q-4.2.5-3",
    topic: "stop_loss",
    kind: "mcq",
    difficulty: 2,
    prompt: "Before a halt-prone event, you replace your sell stop at 49.50 with a stop-limit: stop 49.50, limit 48.00. What do you gain, and what do you risk?",
    options: [
      { id: "a", label: "You're guaranteed to sell at 49.50", rationale: "No order guarantees a price through a gap. The limit only sets the worst price you accept." },
      { id: "b", label: "You never sell below 48.00, but you may not sell at all" },
      { id: "c", label: "You sell at 48.00 whatever happens", rationale: "If the stock reopens below 48.00, the limit can't fill, and you keep the position." },
      { id: "d", label: "Nothing changes: both fill the same way", rationale: "A triggered stop becomes a market order; a triggered stop-limit becomes a limit order with a floor." },
    ],
    correct: "b",
    explanation:
      "Once triggered, a stop-limit becomes a limit order: it fills only at 48.00 or better. If the stock reopens at 46.00, you keep the position and its risk. The limit caps the price, not the loss.",
    lesson: "4.2.5",
    concepts: ["trading-halts", "stop-limit-order"],
    hints: ["What does a triggered stop-limit become?", "What if the reopening price is below the limit?"],
  },

  // 4.2.6 · Fixes, expiries and crowded clocks
  {
    id: "q-4.2.6-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "What is the 16:00 London FX fix?",
    options: [
      { id: "a", label: "A daily limit on how far a currency may move", rationale: "Spot FX has no daily price limits. The fix is a reference price, not a cap." },
      { id: "b", label: "The rate a central bank sets each afternoon", rationale: "No central bank sets it: it's calculated from market trades in the window." },
      { id: "c", label: "The moment FX positions roll to the next day", rationale: "That's the rollover, at 17:00 New York, which is 22:00 in London." },
      { id: "d", label: "A benchmark rate set from trades in a short window around 16:00, used by funds" },
    ],
    correct: "d",
    explanation:
      "Funds value and trade currencies at the WM/Reuters benchmark, set from trades in a 5-minute window around 16:00 London. Their orders crowd into the window, so volume jumps for a mechanical reason.",
    lesson: "4.2.6",
    concepts: ["liquidity-clock"],
  },
  {
    id: "q-4.2.6-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "On a quarterly witching day, LABX trades twice its normal volume and closes 0.4% higher. Why is that weak evidence of a buyer with a view?",
    options: [
      { id: "a", label: "Volume on Fridays doesn't count", rationale: "All volume is real trading. The question is why it happened, and the calendar explains it." },
      { id: "b", label: "Much of the volume is expiring futures and options being closed, rolled or hedged on schedule" },
      { id: "c", label: "Prices can't move on expiry days", rationale: "They can and do move; hedging flows can push prices or hold them near strikes." },
      { id: "d", label: "High volume always means sellers are in control", rationale: "Volume has no direction by itself. On witching days it's mostly scheduled flow." },
    ],
    correct: "b",
    explanation:
      "On witching days many futures and options expire together, and positions are closed, rolled and re-hedged on schedule. That flow had to trade then, whatever anyone thought about value, so the spike says little about direction.",
    lesson: "4.2.6",
    concepts: ["liquidity-clock"],
    hints: ["What is scheduled to happen on that date?"],
  },
  {
    id: "q-4.2.6-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 3,
    prompt: "A dealer is short gamma on LABX options and hedges its delta. LABX rises. What does its hedging do?",
    options: [
      { id: "a", label: "It sells LABX, damping the rise", rationale: "That's a long-gamma dealer: its delta grows as price rises, so it sells to rebalance." },
      { id: "b", label: "Nothing until expiry", rationale: "Delta hedgers rebalance as price moves, not only at expiry." },
      { id: "c", label: "It buys more options", rationale: "Delta hedging trades the underlying, LABX, not more options." },
      { id: "d", label: "It buys LABX, which can amplify the rise" },
    ],
    correct: "d",
    explanation:
      "Short gamma means the position's delta falls as price rises: the dealer gets shorter. To stay hedged it buys LABX into the rise, which can amplify the move. Long-gamma dealers do the opposite and damp moves, one explanation for pinning.",
    lesson: "4.2.6",
    concepts: ["option-pinning"],
    hints: ["As LABX rises, does a short-gamma position get longer or shorter?", "To stay hedged, the dealer trades against that change."],
  },
];

// ─── Glossary terms ─────────────────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  // 4.2.1
  {
    id: "implementation-shortfall",
    term: "Implementation shortfall",
    definition:
      "The difference between a paper trade filled in full at the decision price and the real result: delay, spread, market impact, fees and the opportunity cost of units that never filled.",
    plain: "The full cost of executing a trade compared with the price when you decided to trade.",
    related: ["decision-price", "arrival-price", "opportunity-cost", "slippage"],
    lesson: "4.2.1",
    aka: ["IS"],
  },
  {
    id: "decision-price",
    term: "Decision price",
    definition: "The market price, usually the mid, at the moment the decision to trade is made; the reference for implementation shortfall.",
    plain: "The market price at the moment you decided to trade.",
    related: ["arrival-price", "implementation-shortfall"],
    lesson: "4.2.1",
  },
  {
    id: "arrival-price",
    term: "Arrival price",
    definition: "The market price, usually the mid, when an order reaches the market; its gap from the decision price is the delay cost.",
    plain: "The market price when your order reaches the market.",
    related: ["decision-price", "slippage"],
    lesson: "4.2.1",
  },
  {
    id: "opportunity-cost",
    term: "Opportunity cost",
    definition: "In execution, the price move missed on the part of an order that never filled, measured from the decision price.",
    plain: "The gain you missed on the part of an order that never got filled.",
    related: ["implementation-shortfall", "partial-fill"],
    lesson: "4.2.1",
  },
  {
    id: "parent-order",
    term: "Parent order",
    definition: "A large order, set by one decision, that a trader or an execution algorithm splits into smaller child orders over time.",
    plain: "A large order that an algorithm splits into many smaller orders.",
    related: ["child-order", "execution-algorithm"],
    lesson: "4.2.1",
  },
  {
    id: "child-order",
    term: "Child order",
    definition: "One of the smaller orders sent to the market to work a parent order.",
    plain: "One of the small orders sent to the market to fill a parent order.",
    related: ["parent-order", "fill"],
    lesson: "4.2.1",
  },
  // 4.2.2
  {
    id: "temporary-impact",
    term: "Temporary impact",
    definition: "The part of the price move caused by your trading that reverses after you stop, as liquidity refills the book.",
    plain: "The part of your price impact that fades after you stop trading.",
    related: ["permanent-impact", "square-root-law", "resiliency"],
    lesson: "4.2.2",
  },
  {
    id: "permanent-impact",
    term: "Permanent impact",
    definition: "The part of the price move caused by your trading that remains after you stop, because other traders infer information from your flow.",
    plain: "The part of your price impact that stays, because the market learned something from your trades.",
    related: ["temporary-impact", "square-root-law"],
    lesson: "4.2.2",
  },
  {
    id: "square-root-law",
    term: "Square-root law",
    definition: "The empirical rule that market impact ≈ Y × σ × √(Q ÷ V): it grows with the square root of order size Q over daily volume V, scaled by daily volatility σ, with Y about 1.",
    plain: "Market impact grows with the square root of order size relative to daily volume.",
    related: ["participation-rate", "temporary-impact", "permanent-impact"],
    lesson: "4.2.2",
    aka: ["Square-root impact"],
  },
  {
    id: "participation-rate",
    term: "Participation rate",
    definition: "Your traded volume as a share of the market's total volume over the same period; 10% means one unit in ten traded is yours.",
    plain: "Your traded volume as a share of the market's volume over the same period.",
    related: ["pov-algorithm", "square-root-law"],
    lesson: "4.2.2",
  },
  // 4.2.3
  {
    id: "execution-algorithm",
    term: "Execution algorithm",
    definition: "A set of rules that splits a parent order into child orders and times them to cut cost against a benchmark, such as TWAP, VWAP, POV or implementation shortfall.",
    plain: "A set of rules that splits and times an order to reduce trading cost.",
    related: ["parent-order", "twap", "vwap-algorithm", "pov-algorithm"],
    lesson: "4.2.3",
    aka: ["Algo"],
  },
  {
    id: "twap",
    term: "TWAP",
    definition: "Time-weighted average price: an algorithm that sends equal slices at equal time intervals until the order is done.",
    plain: "An algorithm that trades equal slices at equal time intervals.",
    related: ["vwap-algorithm", "execution-algorithm"],
    lesson: "4.2.3",
    aka: ["Time-weighted average price"],
  },
  {
    id: "vwap-algorithm",
    term: "VWAP algorithm",
    definition: "An algorithm that sizes its slices to the market's expected volume curve through the day, aiming to fill close to the day's VWAP.",
    plain: "An algorithm that trades in step with the market's expected volume through the day.",
    related: ["vwap", "twap", "pov-algorithm"],
    lesson: "4.2.3",
  },
  {
    id: "pov-algorithm",
    term: "POV algorithm",
    definition: "Percentage of volume: an algorithm that trades a fixed share of the market's live volume, such as 10%, so it speeds up and slows down with the market.",
    plain: "An algorithm that trades a fixed share of the market's volume.",
    related: ["participation-rate", "vwap-algorithm", "execution-algorithm"],
    lesson: "4.2.3",
    aka: ["POV", "Percentage of volume"],
  },
  {
    id: "timing-risk",
    term: "Timing risk",
    definition: "The risk that price moves against you while part of an order is still unfilled; it grows the longer execution takes.",
    plain: "The risk that price moves against you while part of your order is still unfilled.",
    related: ["opportunity-cost", "implementation-shortfall"],
    lesson: "4.2.3",
  },
  {
    id: "information-leakage",
    term: "Information leakage",
    definition: "Other traders inferring your intentions from the pattern of your orders and trading ahead of you, which raises your cost.",
    plain: "When the pattern of your orders lets others guess what you're doing and trade ahead.",
    related: ["execution-algorithm", "high-frequency-trading"],
    lesson: "4.2.3",
  },
  // 4.2.4
  {
    id: "latency",
    term: "Latency",
    definition: "The delay between an event and your order or cancel reaching the market, through data feeds, your systems and the network.",
    plain: "The delay between something happening and your order reaching the market.",
    related: ["co-location", "stale-quote"],
    lesson: "4.2.4",
  },
  {
    id: "stale-quote",
    term: "Stale quote",
    definition: "A resting order whose price no longer reflects the latest information, so faster traders can trade against it at a profit.",
    plain: "A resting order whose price no longer reflects the latest news.",
    related: ["latency", "adverse-selection"],
    lesson: "4.2.4",
  },
  {
    id: "co-location",
    term: "Co-location",
    definition: "Placing trading servers in an exchange's data centre, next to its matching engine, to cut latency.",
    plain: "Putting trading computers right next to the exchange's, to be faster.",
    related: ["latency", "high-frequency-trading"],
    lesson: "4.2.4",
  },
  // 4.2.5
  {
    id: "trading-halt",
    term: "Trading halt",
    definition: "A pause in trading of one instrument or a whole market, for pending news, a volatility pause or a circuit breaker; it usually ends with a reopening auction.",
    plain: "A pause in trading, often for pending news or a very fast move.",
    related: ["circuit-breaker", "limit-up-limit-down", "reopening-auction"],
    lesson: "4.2.5",
    aka: ["Trading pause"],
  },
  {
    id: "circuit-breaker",
    term: "Circuit breaker",
    definition: "A market-wide halt triggered by a large index fall. In the US, S&P 500 falls of 7% and 13% halt trading for 15 minutes before 15:25 ET; a 20% fall closes the market for the day.",
    plain: "A market-wide halt triggered by a big fall in the index, such as 7%, 13% or 20%.",
    related: ["trading-halt", "limit-up-limit-down"],
    lesson: "4.2.5",
    aka: ["MWCB", "Market-wide circuit breaker"],
  },
  {
    id: "limit-up-limit-down",
    term: "Limit up–limit down",
    definition: "The US single-stock rule that blocks trades outside price bands around the last 5 minutes' average price, and pauses the stock for 5 minutes if it stays at a band for 15 seconds.",
    plain: "A US rule that pauses a stock when its price hits bands around its recent average.",
    related: ["trading-halt", "circuit-breaker"],
    lesson: "4.2.5",
    aka: ["LULD"],
  },
  {
    id: "reopening-auction",
    term: "Reopening auction",
    definition: "The call auction that restarts trading after a halt; stops can trigger at its price, far from their levels.",
    plain: "The single-price auction that restarts trading after a halt.",
    related: ["call-auction", "trading-halt", "gap"],
    lesson: "4.2.5",
  },
  {
    id: "volatility-auction",
    term: "Volatility auction",
    definition: "A short call auction that replaces continuous trading when a trade would move the price beyond a set tolerance, as on European exchanges.",
    plain: "A short auction that takes over when the price would jump too far.",
    related: ["call-auction", "trading-halt"],
    lesson: "4.2.5",
  },
  // 4.2.6
  {
    id: "benchmark-fix",
    term: "Benchmark fix",
    definition: "A reference price set from trading in a short daily window, such as the WM/Reuters FX fix around 16:00 London; funds trade at it, so volume crowds into the window.",
    plain: "A reference price set in a short daily window, such as the 4 pm London FX fix.",
    related: ["closing-auction", "month-end-rebalancing"],
    lesson: "4.2.6",
    aka: ["Fix", "London 4 pm fix"],
  },
  {
    id: "month-end-rebalancing",
    term: "Month-end rebalancing",
    definition: "Mechanical trades by funds at month or quarter end to bring holdings back to their target weights, often concentrated at the close.",
    plain: "Big scheduled trades by funds at month or quarter end to restore their target mix.",
    related: ["benchmark-fix", "closing-auction"],
    lesson: "4.2.6",
  },
  {
    id: "witching-day",
    term: "Witching day",
    definition: "A quarterly day, the third Friday of March, June, September and December in the US, when stock options, index options and index futures expire together and volume rises.",
    plain: "A day each quarter when many futures and options expire together.",
    related: ["option-pinning", "open-interest"],
    lesson: "4.2.6",
    aka: ["Triple witching", "Quadruple witching"],
  },
  {
    id: "option-pinning",
    term: "Option pinning",
    definition: "The tendency of a stock to close near a strike with large open interest on an expiry day, usually linked to dealers' delta hedging.",
    plain: "A price's tendency to finish near a busy option strike on expiry day.",
    related: ["open-interest", "witching-day"],
    lesson: "4.2.6",
  },
];

// ─── Concepts ───────────────────────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "implementation-shortfall",
    name: "Implementation shortfall",
    category: "order_types",
    summary: "The full cost of executing a decision versus the decision price: delay, spread, impact, fees and missed fills.",
    body: [
      "Implementation shortfall (Perold, 1988) compares a paper portfolio, filled in full at the decision price, with the real one. The difference splits into delay (decision to arrival), half the spread, market impact, commission, and the opportunity cost of units that never filled.",
      "Slippage on fills misses the last line, and it is often the largest. Divide the total by the intended trade's value to express it in basis points.",
    ],
    example:
      "Buy 50,000 LABX, decided at 100.00; arrival 100.04; 40,000 filled at an average of 100.18; close 101.00. Delay 1,600.00, half spread 2,000.00, impact 3,600.00, commission 2,003.60, opportunity 10,000.00: 19,203.60, or 38.4 bps of 5,000,000.00.",
    related: ["market-impact", "slippage", "trading-costs"],
    missions: [],
    lessons: ["4.2.1"],
  },
  {
    id: "market-impact",
    name: "Market impact",
    category: "order_types",
    summary: "The price move caused by your own trading, split into a temporary and a permanent part.",
    body: [
      "Buying pushes the price up and selling pushes it down, because you use up the liquidity waiting in the book. Part of the move fades when you stop and the book refills: temporary impact. Part stays, because others infer information from your trades: permanent impact.",
      "Impact is invisible on small orders and dominant on large ones. Trading more slowly shrinks the temporary part, at the price of timing risk.",
    ],
    example: "A fund buys 50,000 LABX. The mid climbs from 100.00 to 100.32 by the last fill, then settles at 100.21: temporary impact 0.11, permanent impact 0.21.",
    related: ["square-root-impact", "implementation-shortfall", "market-depth"],
    missions: [],
    lessons: ["4.2.1", "4.2.2"],
  },
  {
    id: "square-root-impact",
    name: "Square-root impact law",
    category: "order_types",
    summary: "Impact grows roughly with volatility times the square root of order size over daily volume.",
    body: [
      "The square-root law estimates impact ≈ Y × σ × √(Q ÷ V), with σ the daily volatility, Q the order size, V the daily volume and Y about 1. It is an empirical regularity found in many markets (grade A), not a law of physics; the constant and the fit differ by market.",
      "Because impact per unit grows with √Q, total impact cost grows with Q to the power 1.5: twice the size costs about 2.8 times as much. That is why the size an edge can carry is limited.",
    ],
    example: "LABX: σ = 2%, V = 2,000,000. 50,000 units: 2% × √0.025 = 31.6 bps, about 15,811 vUSD. 200,000 units: 63.2 bps, about 126,491 vUSD: 4 times the size, 8 times the cost.",
    related: ["market-impact", "volatility", "impact-timing-tradeoff"],
    missions: [],
    lessons: ["4.2.2"],
  },
  {
    id: "execution-algorithm",
    name: "Execution algorithms",
    category: "order_types",
    summary: "Rules that slice a parent order over time or volume, such as TWAP, VWAP, POV and implementation shortfall.",
    body: [
      "TWAP sends equal slices at equal time intervals. VWAP sizes slices to the expected volume curve. POV trades a fixed share of live volume, such as 10%. An implementation-shortfall algorithm front-loads the order to stay close to the decision price.",
      "Choose by benchmark, urgency and liquidity, and cap the price. Predictable slicing leaks information, so real algorithms randomise sizes and timing.",
    ],
    example: "50,000 LABX on a 2,000,000-unit day: VWAP buys 6,000 in the first half hour and 2,750 at midday; POV 10% buys 24,000 in the first half hour and is done by 10:46.",
    related: ["impact-timing-tradeoff", "vwap", "implementation-shortfall"],
    missions: [],
    lessons: ["4.2.3"],
  },
  {
    id: "impact-timing-tradeoff",
    name: "Impact versus timing risk",
    category: "order_types",
    summary: "Trading faster raises market impact; trading slower leaves the unfilled part exposed to price moves.",
    body: [
      "Every execution plan balances two costs (Almgren and Chriss, 2000). A single market order pays the most impact but carries no timing risk. A day-long VWAP pays the least impact, but the unfilled part rides the market for hours, so its outcomes spread widely.",
      "No plan wins on both. Urgency, risk limits and your view of where the price is heading decide where on the trade-off you sit.",
    ],
    example: "Over 200 synthetic sessions for 50,000 LABX: a market order costs 134.6 bps every day; POV 10% averages 69.3 with a 95th percentile of 144.7; VWAP averages 38.6 but reaches 213.6.",
    related: ["execution-algorithm", "square-root-impact", "implementation-shortfall"],
    missions: [],
    lessons: ["4.2.3"],
  },
  {
    id: "latency-arbitrage",
    name: "Latency and stale quotes",
    category: "order_types",
    summary: "Faster traders execute against resting orders whose prices have not yet caught up with new information.",
    body: [
      "When news changes value, every resting order priced before it is stale. Whoever reacts first trades against it: a fast trader can hit your bid within a millisecond, long before a 150 ms cancel arrives. A resting quote is a free option for anyone faster.",
      "Retail traders can't win this race, so they avoid it: cancel resting orders or let them expire before scheduled releases, and price new orders after the news.",
    ],
    example: "You rest a bid of 500 at 100.00 and an offer of 500 at 100.10 through a release. News takes value to 99.80 or to 100.30; either way the stale side is hit, and you lose 500 × 0.20 = 100.00.",
    related: ["adverse-selection", "market-making", "limit-order"],
    missions: [],
    lessons: ["4.2.4"],
  },
  {
    id: "trading-halts",
    name: "Halts, LULD and circuit breakers",
    category: "stop_loss",
    summary: "Rules that pause or stop trading after large moves and reopen through auctions, where stops can fill far away.",
    body: [
      "US market-wide circuit breakers halt all stocks for 15 minutes when the S&P 500 falls 7% or 13% from the previous close before 15:25 ET, and close the market for the day at 20%. Single stocks have limit up–limit down bands around a 5-minute average; 15 seconds at a band brings a 5-minute pause. Europe uses volatility auctions.",
      "Trading restarts through a reopening auction. A stop triggers at that print and fills near it, however far from the stop. A limit caps the price but may not fill.",
    ],
    example: "LABX pauses at its 90.00 band and reopens at 84.00. A stop at 89.50 fills near 84.00. A sell limit at 85.00 doesn't fill, and the position stays open.",
    related: ["gap-risk", "stop-loss-order", "call-auction"],
    missions: ["M07"],
    lessons: ["4.2.5"],
  },
  {
    id: "liquidity-clock",
    name: "Liquidity clock",
    category: "market_fundamentals",
    summary: "Scheduled windows (fixes, month-end, closing auctions, expiries) where volume and spreads change for mechanical reasons.",
    body: [
      "Some flow is set by the clock: FX funds trade the 16:00 London fix, index funds trade the official close, funds rebalance at month and quarter end, futures and options expire on witching days, and FX spreads widen around the 17:00 New York rollover.",
      "This flow is mechanical, not informed, so it isn't a direction signal. It does change execution cost and slippage, so check the clock before a large order.",
    ],
    example: "In a synthetic LABC session, volume runs at about 120 a minute, jumps to 600 a minute from 15:58 to 16:02 around the fix, and the price ends 0.01 from where it started.",
    related: ["intraday-cycle", "option-pinning", "call-auction"],
    missions: [],
    lessons: ["4.2.6"],
  },
  {
    id: "option-pinning",
    name: "Option pinning",
    category: "market_fundamentals",
    summary: "The tendency of prices to settle near strikes with large open interest on expiry days.",
    body: [
      "On expiry days, optionable stocks close near strikes more often than chance would suggest (Ni, Pearson and Poteshman, 2005; grade B). The usual explanation is dealers' delta hedging: long-gamma dealers sell rallies and buy dips near the strike, damping moves; short-gamma dealers do the opposite and amplify them.",
      "Real studies use thousands of stock-expiry days to see it. Retail 'gamma level' maps are much noisier than the research behind them.",
    ],
    example:
      "A synthetic test with strike 100: 20 of 50 expiry days closed within ±0.50 (40%), against 13 of 50 normal days (26%). The 14-point gap sits inside an 18-point noise band, so 50 days can't tell.",
    related: ["liquidity-clock"],
    missions: [],
    lessons: ["4.2.6"],
  },
];

export const UNIT_4_2: UnitContent = { lessons: [L421, L422, L423, L424, L425, L426], questions: QUESTIONS, terms: TERMS, concepts: CONCEPTS };
