import type { CandleData, ChartSpec, Concept, GlossaryTerm, Lesson, Question, UnitContent } from "../../types";

/*
 * Unit 3.14 · Instruments II: futures, commodities, crypto, bonds (docs/learn/course): 3.14.1–3.14.8.
 *
 * Conventions in this file:
 * - LXF / LXM (index future and micro, 50 and 5 vUSD a point, tick 0.25), LXO (crude, 1,000 units, tick 0.01),
 *   LXN (10-year note future, DV01 80 vUSD) and LXC (coin, spot and perpetual) are the synthetic instruments of
 *   level 3. Margins, limits, curves and funding rates are each lesson's own example values, not simulator specs.
 * - Futures lessons use a 100,000 vUSD account so one contract fits a 1% risk; sizing is shown before fees.
 * - Every number was checked with a scratch script: tick and point values, daily settlement, back-adjustment,
 *   roll yield ((70 ÷ 71)^12 − 1 = −15.7%), limit-move losses, √365 annualising, funding, liquidation price
 *   (entry × (1 − 1 ÷ L + MMR)), duration and DV01 (a 10-year 2.16% semiannual note at par: duration 8.95,
 *   exact moves −8.52% / +9.42% for ±1 point).
 * - Market and regulatory facts are stated generally (no exchange specs, no event sizes) and were checked in October 2026.
 */

/** Flat candles at the given closes, for figures drawn as lines or layers only. */
const flat = (values: number[]): CandleData[] => values.map((v) => ({ o: v, h: v, l: v, c: v }));
/** Rows of [open, high, low, close] → candles. */
const k = (rows: [number, number, number, number][]): CandleData[] => rows.map(([o, h, l, c]) => ({ o, h, l, c }));

// ─── Chart data ─────────────────────────────────────────────────────────────

/** 3.14.1 B4: margin balance for 2 LXF: posted 25,000; −3,750; −4,000 (margin call); topped up to 25,000; margins raised. */
const MARGIN_CHART: ChartSpec = {
  candles: flat([25000, 21250, 17250, 25000, 25000]),
  style: "line",
  range: [15000, 28000],
  describe:
    "A margin balance over five points in time: 25,000 posted, 21,250 after day 1, 17,250 after day 2, back to 25,000 after a top-up, then unchanged while the maintenance level is raised to 26,000.",
};

/** 3.14.2 B3: March and June LXF closes over six days; the spread narrows from 30.50 to 30.00 by roll day. */
const MARCH = [4978.75, 4986.5, 4983.25, 4975.0, 4984.75, 5000.0];
const JUNE = [5009.25, 5016.75, 5013.5, 5005.0, 5014.75, 5030.0];
const ROLL_CHART: ChartSpec = {
  candles: flat(MARCH),
  hideCandles: true,
  range: [4960, 5045],
  describe: "Two lines over six days: the March LXF contract from 4,978.75 to 5,000.00 and the June contract about 30 points above it, ending at 5,030.00.",
};

/** 3.14.2 B5: eight March candles (roll-day close 5,000.00), then four June candles after the roll (June was 5,030.00 that day). */
const BACKADJ_ROWS: [number, number, number, number][] = [
  [4972.0, 4981.25, 4966.5, 4978.75],
  [4978.75, 4990.0, 4974.25, 4986.5],
  [4986.5, 4998.75, 4980.0, 4983.25],
  [4983.25, 4993.5, 4971.75, 4975.0],
  [4975.0, 4988.25, 4969.5, 4984.75],
  [4984.75, 4999.25, 4979.0, 4994.5],
  [4994.5, 5000.75, 4985.25, 4989.0],
  [4989.0, 5002.5, 4983.75, 5000.0],
  [5029.5, 5031.75, 5022.25, 5025.5],
  [5025.5, 5030.25, 5016.75, 5019.0],
  [5019.0, 5027.5, 5011.25, 5024.25],
  [5024.25, 5029.75, 5017.5, 5021.0],
];
const BACKADJ_CHART: ChartSpec = {
  candles: k(BACKADJ_ROWS),
  range: [4960, 5045],
  describe:
    "Twelve daily candles of a continuous LXF chart. Eight March candles stay below 5,002.50 and close at 5,000.00 on roll day; the chart then switches to June, which opens at 5,029.50, looking like a breakout.",
};
/** Back-adjusted closes: March closes + 30.00, June closes as traded. */
const BACKADJ_LINE = BACKADJ_ROWS.map((r, i) => (i < 8 ? r[3] + 30 : r[3]));

/** 3.14.3 B1: spot and futures one to six months out (index 0 = spot). */
const CURVE_CHART: ChartSpec = {
  candles: flat([70, 70, 70, 70, 70, 70, 70]),
  hideCandles: true,
  range: [64, 76],
  describe: "Futures prices by expiry, from spot at 70.00 to six months out. The contango curve rises to 74.50; the backwardation curve falls to 66.00.",
};

/** 3.14.6 B4: LXC last price with a wick to 28,900 at bar 7; the mark price dips only to 29,780. */
const MARK_CHART: ChartSpec = {
  candles: k([
    [30050, 30180, 29960, 30120],
    [30120, 30210, 30010, 30040],
    [30040, 30090, 29880, 29930],
    [29930, 30020, 29850, 29990],
    [29990, 30070, 29910, 29960],
    [29960, 30010, 29870, 29900],
    [29900, 29940, 28900, 29840],
    [29840, 29950, 29790, 29910],
    [29910, 30030, 29880, 30000],
    [30000, 30090, 29940, 30050],
  ]),
  range: [28700, 30300],
  describe: "Ten candles of LXC last price around 30,000. The seventh has a long lower wick to 28,900 and closes at 29,840; the mark price stays near the closes.",
};

// ─── 3.14.1 · Futures contracts: specs, margin and daily settlement ─────────

const L3141: Lesson = {
  id: "3.14.1",
  title: "Futures contracts: specs, margin and daily settlement",
  topic: "position_sizing",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "A futures contract turns points into money through its multiplier, settles gains and losses in cash every day, and is sized in whole contracts from the stop, with micros when one contract is too big.",
  objectives: [
    "Convert price moves into money with a contract's multiplier and tick value.",
    "Track initial, maintenance and variation margin through a losing day.",
    "Size in whole contracts from a stop, and switch to micros when one contract is too big.",
  ],
  blocks: [],
  practice: [
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
    { kind: "mission", ref: "M05", label: "Size Matters" },
  ],
  script: {
    unit: "3.14",
    courseId: "3.14.1",
    hook: {
      prompt: "LXF, the synthetic index future, is worth 50 vUSD per point and trades at 5,000.00. You buy 2 contracts. By the close, price is 4,962.50. How much leaves your account tonight?",
      control: {
        kind: "slider",
        min: 0,
        max: 10000,
        step: 50,
        unit: " vUSD",
        start: 1000,
        answer: 3750,
        tolerance: 0,
        feedback: [
          { from: 0, to: 1900, text: "That's one contract or less. One LXF loses 37.50 × 50 = 1,875.00, and you hold two." },
          { from: 1950, to: 3700, text: "Count the points first: 5,000.00 − 4,962.50 = 37.50. Then × 50 vUSD × 2 contracts." },
          { from: 3800, to: 10000, text: "Too much. 37.50 points × 50 vUSD × 2 contracts covers the whole move." },
        ],
      },
      compare: "You picked {yours}. 37.50 points × 50 vUSD × 2 contracts = 3,750.00, paid in cash tonight as variation margin, whatever your plan says.",
      concept: "futures-contract",
    },
    learn: [
      {
        kind: "explain",
        title: "What a future is",
        text: "A [[futures|futures contract]] is a standard agreement, traded on an exchange, to buy or sell an underlying on a set date. A clearing house stands between buyer and seller. The [[contract-multiplier]] turns points into money; the [[tick-value]] is the money in one minimum step, a [[tick]].",
      },
      {
        kind: "match",
        title: "Synthetic contract specs",
        prompt: "Tick value = tick size × value per point. Match each synthetic contract to what its step is worth.",
        columns: ["Contract", "Value"],
        pairs: [
          { left: "LXF: 50 vUSD a point, tick 0.25", right: "12.50 vUSD a tick", wrong: "A quarter of a point × 50 vUSD = 12.50." },
          { left: "LXM, the micro: 5 vUSD a point, tick 0.25", right: "1.25 vUSD a tick", wrong: "LXM is a tenth of LXF: 0.25 × 5 = 1.25." },
          { left: "LXO, crude: 1,000 units, tick 0.01", right: "10.00 vUSD a tick", wrong: "A 0.01 move on 1,000 units is 10.00." },
          { left: "LXO, crude: a 1.00 move", right: "1,000.00 vUSD a contract", wrong: "1.00 on 1,000 units is 1,000.00: a hundred ticks of 10.00." },
        ],
        correct: "Right. These synthetic contracts copy the shape of real ones: an index future, its micro and crude oil. Real specs are on each exchange's contract page.",
        concept: "futures-contract",
      },
      {
        kind: "worked",
        title: "Built-in leverage",
        lines: [
          "One LXF at 5,000.00 controls 5,000.00 × 50 = 250,000.00 of the index: its [[notional-value|notional value]].",
          "In this example the exchange asks 12,500.00 of [[initial-margin|initial margin]] per contract: 5% of that value.",
          "Implied leverage = 250,000.00 ÷ 12,500.00 = ?",
        ],
        ask: {
          answer: 20,
          tolerance: 0,
          unit: "×",
          feedback: [
            { value: 5, text: "5 is the margin as a percentage. Leverage is the contract's value divided by the margin." },
            { value: 0.05, text: "That's margin ÷ value. Flip it: value ÷ margin." },
          ],
          correct: "Right: 20×. A 1% index move, 50 points, is 2,500.00: a fifth of the margin.",
        },
        after: "Exchange margins are usually a small share of the contract's value, so the leverage is built in. The margin is a deposit, not a measure of risk: the stop and the size are.",
        concept: "leverage",
      },
      {
        kind: "figure",
        title: "Settled in cash, every day",
        text: "Every evening the exchange marks each position to the settlement price and moves the gain or loss in cash: the [[variation-margin|variation margin]]. Fall below the [[maintenance-margin|maintenance margin]] and you must top up to the initial level, or the broker closes the position.",
        figure: {
          kind: "chart",
          chart: MARGIN_CHART,
          steps: [
            {
              text: "You post 25,000.00 of initial margin for 2 LXF: 12,500.00 each.",
              visible: 1,
              layers: [
                { kind: "level", price: 25000, role: "neutral", label: "INITIAL 25,000" },
                { kind: "level", price: 20000, role: "stop", label: "MAINTENANCE 20,000" },
              ],
            },
            { text: "Day 1: LXF settles 37.50 lower. 3,750.00 leaves in cash; 21,250.00 remain.", visible: 2 },
            { text: "Day 2: 40 more points, −4,000.00. 17,250.00 is below 20,000.00: margin call. You add 7,750.00.", visible: 4 },
            {
              text: "The exchange raises maintenance to 13,000.00 a contract. Price is flat, yet 25,000.00 now triggers a call.",
              visible: 5,
              layers: [{ kind: "level", price: 26000, role: "concept", label: "NEW MAINTENANCE 26,000" }],
            },
          ],
        },
        concept: "mark-to-market",
      },
      {
        kind: "worked",
        title: "Whole contracts from the stop",
        lines: [
          "Futures lessons use a 100,000.00 account, so one contract can fit. Risk 1% = 1,000.00.",
          "Stop 20 points: 20 × 50 = 1,000.00 per LXF. One contract fits exactly.",
          "Stop 45 points: 2,250.00 per LXF. Even one breaks the rule: 0 LXF.",
          "A [[micro-contract|micro]], LXM, is a tenth of the size: 45 × 5 = 225.00 per contract.",
          "LXM contracts within 1,000.00: ?",
        ],
        ask: {
          answer: 4,
          tolerance: 0,
          unit: "LXM",
          feedback: [
            { value: 5, text: "5 × 225.00 = 1,125.00: over the 1,000.00 budget. Round down." },
            { value: 0, text: "That's the full-size answer. An LXM risks a tenth as much: 225.00." },
            { value: 44, text: "Each LXM risks 45 points × 5 = 225.00, not 22.50." },
          ],
          correct: "Right: 4 LXM risk 900.00 at the stop, before fees.",
          incorrect: "1,000.00 ÷ 225.00, rounded down to whole contracts.",
        },
        after: "Whole contracts make sizing lumpy: with LXF alone the choice was 0 or 2,250.00 of risk. Micros cut the step to 225.00. The margin never entered the sum.",
        concept: "futures-contract",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Low intraday margins from brokers invite oversizing. Exchanges can halt trading at price limits, and prices gap across session breaks. Client money sits in [[segregated-funds|segregated accounts]], but protection varies: in the US, SIPC doesn't cover futures, and a broker's failure can freeze funds for months.",
      },
      // Try (tick-converter isn't built yet): choose the mix of full-size and micro contracts.
      {
        kind: "fields",
        title: "Your turn: LXF or LXM?",
        prompt: "Account 100,000.00, risk 1%. LXF at 5,000.00, stop 30 points. Choose LXF and LXM contracts so the loss at the stop is as large as fits within 1,000.00.",
        fields: [
          { id: "lxf", label: "LXF contracts (50 vUSD a point)", kind: "stepper", min: 0, max: 3, step: 1, default: 1 },
          { id: "lxm", label: "LXM contracts (5 vUSD a point)", kind: "stepper", min: 0, max: 12, step: 1, default: 0 },
        ],
        valid: { all: [{ field: "lxf", eq: 0 }, { field: "lxm", eq: 6 }] },
        feedback: [
          { when: { field: "lxf", gte: 1 }, text: "One LXF risks 30 × 50 = 1,500.00 at the stop: over the 1,000.00 budget on its own. Use micros." },
          { when: { field: "lxm", gt: 6 }, text: "Each LXM risks 30 × 5 = 150.00 at the stop, so {lxm} of them go over 1,000.00." },
          { when: { field: "lxm", lt: 6 }, text: "That fits, but leaves room: each LXM risks 150.00, and 1,000.00 holds more of them." },
        ],
        correct: "Right: 0 LXF and 6 LXM, 900.00 at the stop. A seventh would make it 1,050.00.",
        concept: "futures-contract",
      },
    ],
    check: ["q-3.14.1-1", "q-3.14.1-2", "q-3.14.1-3"],
    recap: {
      takeaways: [
        "The multiplier turns points into money: 37.50 points × 50 × 2 LXF = 3,750.00 tonight.",
        "Gains and losses settle in cash daily; below maintenance margin, you top up to initial.",
        "Size from the stop in whole contracts; when one is too big, use micros: 6 LXM.",
      ],
    },
  },
};

// ─── 3.14.2 · Expiry, roll and continuous charts ────────────────────────────

const L3142: Lesson = {
  id: "3.14.2",
  title: "Expiry, roll and continuous charts",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Futures expire, so positions roll to the next contract with one calendar-spread order before expiry or first notice day, and continuous charts are back-adjusted so roll gaps don't fake signals.",
  objectives: [
    "Read contract month codes and plan a roll before expiry or before first notice day.",
    "Execute a roll as a calendar spread and account for its cost.",
    "Back-adjust a continuous chart so a backtest sees no fake roll gaps.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" }],
  script: {
    unit: "3.14",
    courseId: "3.14.2",
    hook: {
      prompt: "On roll day, the LXF continuous chart jumps 30 points overnight, with no news. Did holders of the expiring contract just earn 30 points?",
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes", feedback: "March holders saw no jump: March closed at 5,000.00. The chart switched to June, which trades 30 points higher." },
          { id: "no", label: "No" },
        ],
        answer: "no",
      },
      compare: "You picked {yours}. No: the chart switched from the expiring contract to the next one, 30 points higher. Nobody earned the gap; it exists only on the chart.",
      concept: "continuous-contract",
    },
    learn: [
      {
        kind: "match",
        title: "Month codes",
        prompt: "A contract's name is root + month code + year: LXFZ6 is the December 2026 LXF. Match the quarterly codes that index futures use.",
        columns: ["Code", "Month"],
        pairs: [
          { left: "H", right: "March", wrong: "H is March, the first quarterly month." },
          { left: "M", right: "June", wrong: "M is June." },
          { left: "U", right: "September", wrong: "U is September." },
          { left: "Z", right: "December", wrong: "Z is December, the last month of the year and of the alphabet." },
        ],
        correct: "Right. Every month has a code: F, G, H, J, K, M, N, Q, U, V, X and Z, January to December. Crude oil lists every month.",
        concept: "contract-roll",
      },
      {
        kind: "explain",
        title: "How a contract ends",
        text: "At [[expiry]] a contract ends. Index futures settle in cash. Others end in [[physical-delivery]]: from the [[first-notice-day]], a long can be told to take the commodity, so the simulator forces you out before it. Trading moves to the next contract days before expiry; rolling when it moves keeps costs low.",
      },
      {
        kind: "figure",
        title: "The roll is one order",
        text: "A [[calendar-spread]] buys one expiry and sells another as a single order. You cross one bid/ask instead of two, and price can't move between the legs. That's how a roll is done.",
        figure: {
          kind: "chart",
          chart: ROLL_CHART,
          steps: [
            {
              text: "March and June contracts on the same index. June trades about 30 points higher.",
              layers: [
                { kind: "line", values: MARCH, role: "neutral", label: "MARCH" },
                { kind: "line", values: JUNE, role: "accent", label: "JUNE" },
              ],
            },
            {
              text: "Roll day: one order sells March at 5,000.00 and buys June at 5,030.00.",
              layers: [
                { kind: "marker", index: 5, price: 5000, label: "SELL MARCH", role: "down" },
                { kind: "marker", index: 5, price: 5030, label: "BUY JUNE", role: "up" },
              ],
            },
            { text: "The 30-point gap is carry: three months of financing, 4.0%, minus dividends, 1.6%, on 5,000." },
          ],
        },
        concept: "contract-roll",
      },
      {
        kind: "worked",
        title: "Your stop moves with the roll",
        lines: [
          "You're long 2 LXF March at 5,000.00, stop 4,960.00: 40 points of risk.",
          "You roll by spread: sell March at 5,000.00, buy June at 5,030.00. The spread is 30.00.",
          "June trades 30.00 above March. To keep the same 40 points of risk, the June stop goes at: ?",
        ],
        ask: {
          answer: 4990,
          tolerance: 0,
          feedback: [
            { value: 4960, text: "On June, 4,960.00 is 70 points below 5,030.00: more risk than planned. Add the spread." },
            { value: 4930, text: "That moves it the wrong way. June trades higher, so the stop moves up by 30.00." },
          ],
          correct: "Right: 4,990.00, still 40 points below the June price.",
        },
        after: "Move targets and alerts too. The roll costs one order's bid/ask and fees. The 30 points aren't lost at the roll: they're the June contract's carry, which 3.14.3 unpacks.",
        concept: "contract-roll",
      },
      {
        kind: "figure",
        title: "Fake gaps on continuous charts",
        text: "A [[continuous-contract|continuous contract]] joins expiring contracts into one long chart. Unadjusted, every roll leaves a gap no holder ever had. [[back-adjustment|Back-adjustment]] shifts all prices before the roll by the gap, so the series runs on without a jump. Proportional adjustment multiplies them by the price ratio instead.",
        figure: {
          kind: "chart",
          chart: BACKADJ_CHART,
          steps: [
            {
              text: "Unadjusted: March prices until the roll, then June. Price seems to break out overnight.",
              layers: [{ kind: "level", price: 5002.5, role: "resistance", label: "MARCH HIGH 5,002.50" }],
            },
            {
              text: "Back-adjusted: add the 30.00 roll gap to every March price. The breakout disappears.",
              layers: [
                { kind: "line", values: BACKADJ_LINE, role: "accent", label: "BACK-ADJUSTED" },
                { kind: "level", price: 5032.5, role: "concept", label: "ADJUSTED HIGH 5,032.50" },
              ],
            },
          ],
        },
        concept: "continuous-contract",
      },
      {
        kind: "worked",
        title: "Back-adjust a price",
        lines: [
          "Roll day: March closes at 5,000.00, June at 5,030.00. The gap is 30.00.",
          "Back-adjustment adds 30.00 to every price before the roll; prices after it stay as traded.",
          "A bar from before the roll closed at 4,962.50. Its adjusted close: ?",
        ],
        ask: {
          answer: 4992.5,
          tolerance: 0.01,
          feedback: [
            { value: 4932.5, text: "Subtracting widens the gap. Earlier prices move up to meet June's level." },
            { value: 4962.5, text: "That's the unadjusted close. Every price before the roll shifts by the gap." },
          ],
          correct: "Right: 4,992.50. Proportional adjustment gives 4,962.50 × 5,030 ÷ 5,000 = 4,992.28.",
        },
        after: "Signals and backtests use the adjusted series; fills, stops and P&L use the real contract's prices. Over many rolls, additive adjustment can even push old prices below zero, so percentage maths needs the proportional kind.",
        concept: "continuous-contract",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Delivery is real. In April 2020, the expiring US crude oil future settled below zero, near −37 dollars a barrel, as storage filled up: holders who couldn't take delivery paid to get out. On physically delivered contracts, roll before first notice day.",
      },
      // Try (roll-desk isn't built yet): the roll procedure, in order.
      {
        kind: "order",
        title: "Your turn: roll the LXO long",
        prompt: "You're long LXO crude, 6 days before first notice day, and volume is moving to the next month. Put the roll in order.",
        items: [
          "Check the first notice day and which month the volume is in",
          "Send one calendar-spread order: sell the front month, buy the next",
          "Move the stop and target by the spread",
          "Back-adjust the chart: add the roll gap to every earlier price",
          "Check the adjusted series: no gap left at the roll",
        ],
        explain: "Date first, then one spread order, then the risk, then the data. In this order the position never sits past first notice day, the stop keeps its distance, and no backtest sees a fake gap.",
        wrong: "A roll is a trade first: date it, execute it as one order, fix the stop, then fix the chart.",
        concept: "contract-roll",
      },
    ],
    check: ["q-3.14.2-1", "q-3.14.2-2", "q-3.14.2-3"],
    recap: {
      takeaways: [
        "Month codes name expiries (H, M, U, Z); roll before expiry, and before first notice day.",
        "Roll with one calendar-spread order, then shift the stop by the spread: 4,960 becomes 4,990.",
        "Back-adjust continuous charts: add each roll gap to earlier prices, or backtests trade fake gaps.",
      ],
    },
  },
};

// ─── 3.14.3 · Contango, backwardation and roll yield ────────────────────────

const L3143: Lesson = {
  id: "3.14.3",
  title: "Contango, backwardation and roll yield",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A futures curve sits above spot in contango and below it in backwardation; a rolled position pays or earns the gap as each contract converges, which is why commodity ETFs can fall while spot is flat.",
  objectives: [
    "Tell contango from backwardation on a futures curve and name what causes each.",
    "Compute the roll yield a rolled long position earns or pays when spot doesn't move.",
    "Explain why commodity ETFs and VIX products can fall while spot is flat.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" }],
  script: {
    unit: "3.14",
    courseId: "3.14.3",
    hook: {
      prompt: "Spot crude stays at 70.00 all year. The one-month future always trades at 71.00, and you roll every month. After 12 months, your long position has…",
      control: {
        kind: "slider",
        min: -30,
        max: 30,
        step: 0.5,
        unit: "%",
        start: 0,
        answer: -15.5,
        tolerance: 1.5,
        feedback: [
          { from: -30, to: -17.5, text: "That's more than twelve rolls lose. Each month the future falls from 71.00 to 70.00: −1.41%." },
          { from: -13.5, to: -0.5, text: "Each roll buys at 71.00 and ends at 70.00: −1.41% a month, twelve times over." },
          { from: 0, to: 30, text: "Spot is flat, but the future isn't: it falls from 71.00 to 70.00 every month as it converges." },
        ],
      },
      compare: "You picked {yours}. Each roll buys at 71.00 and the contract converges to 70.00: −1.41% a month, (1 − 0.0141)¹² − 1 = −15.7% a year, with spot flat.",
      concept: "roll-yield",
    },
    learn: [
      {
        kind: "figure",
        title: "Two shapes of curve",
        text: "The term structure plots futures prices by expiry. Left to right: spot, then contracts one to six months out. Each contract converges to spot as it ages.",
        figure: {
          kind: "chart",
          chart: CURVE_CHART,
          steps: [
            {
              text: "Contango: futures above spot. Storage, financing and insurance cost money until delivery.",
              layers: [
                { kind: "level", price: 70, role: "neutral", label: "SPOT 70.00" },
                { kind: "line", values: [70, 71, 71.9, 72.7, 73.4, 74.0, 74.5], role: "down", label: "CONTANGO" },
              ],
            },
            {
              text: "Backwardation: futures below spot. When stocks are short, a barrel today is worth more.",
              layers: [{ kind: "line", values: [70, 69, 68.2, 67.5, 66.9, 66.4, 66.0], role: "up", label: "BACKWARDATION" }],
            },
            {
              text: "A month later, if nothing changes, the 71.00 contract has become spot: 70.00.",
              layers: [
                {
                  kind: "path",
                  points: [
                    { index: 1, price: 71 },
                    { index: 0, price: 70 },
                  ],
                  role: "accent",
                  label: "ONE MONTH ON",
                  dashed: true,
                },
              ],
            },
          ],
        },
        concept: "term-structure",
      },
      {
        kind: "worked",
        title: "Roll yield",
        lines: [
          "Contango: you buy the one-month future at 71.00; by expiry it converges to spot, 70.00.",
          "Per roll: 70.00 ÷ 71.00 − 1 = −1.41%. Twelve rolls: (1 − 0.0141)¹² − 1 = −15.7% a year.",
          "Backwardation: spot 70.00, one-month future 69.00. Roll yield per month, in %: ?",
        ],
        ask: {
          answer: 1.45,
          tolerance: 0.01,
          unit: "%",
          feedback: [
            { value: -1.43, text: "That's 69 ÷ 70 − 1, the wrong way round. The future rises from 69.00 to 70.00." },
            { value: 1.43, text: "That divides by spot. You paid 69.00, so divide the 1.00 gain by 69.00." },
          ],
          correct: "Right: +1.45% a month, about +18.8% a year if the curve stayed the same.",
        },
        after: "That's [[roll-yield]]: what a rolled position earns or pays as each contract converges to spot. In [[contango]] a long pays it; in [[backwardation]] a long earns it. Curves and spot rarely stay put, so it's a tilt, not a promise.",
        concept: "roll-yield",
      },
      {
        kind: "worked",
        title: "Why the curve has a shape",
        lines: [
          "Fair future ≈ spot + financing + storage − [[convenience-yield]]. Financing and storage are the [[cost-of-carry]].",
          "Spot 70.00. Financing at 6% a year: 70.00 × 6% ÷ 12 = 0.35 a month.",
          "Storage and insurance: 0.65 a month. No convenience yield.",
          "Fair one-month future: ?",
        ],
        ask: {
          answer: 71,
          tolerance: 0.01,
          feedback: [
            { value: 70.35, text: "That covers financing only. Storage and insurance add 0.65." },
            { value: 70.65, text: "Add the financing too: 0.35." },
          ],
          correct: "Right: 71.00, the hook's contango. The carry sets the curve's slope.",
        },
        after: "When stocks run low, the barrel in hand has a value of its own, the convenience yield. It can outweigh the carry and tip the curve into backwardation.",
        concept: "term-structure",
      },
      {
        kind: "predict",
        title: "A commodity ETF",
        prompt: "A commodity ETF holds the front-month future and rolls monthly. For a year, spot stays at 70.00 and the curve looks like the hook's. Before fees, the ETF…",
        control: {
          kind: "choice",
          choices: [
            { id: "flat", label: "Ends flat, like spot", feedback: "It doesn't hold spot. It holds futures bought at 71.00 that keep converging down to 70.00." },
            { id: "down", label: "Falls about 16%" },
            { id: "up", label: "Rises: it earns the premium", feedback: "In contango the long pays the premium: each contract loses it as it converges." },
          ],
          answer: "down",
        },
        reveal: "It falls about 15.7%, the roll yield, before fees. Products on VIX futures work the same way: that curve is usually in contango, so long VIX products tend to lose value when nothing happens. Check what a fund holds, not just its name.",
        concept: "roll-yield",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Roll yield is a kind of carry: what a position earns or pays if prices don't move, like the interest gap in FX [[carry]]. Positive carry often comes with crash risk; 3.13.3 tests carry strategies.",
      },
      // Try (curve-lab isn't built yet): set the one-month future.
      {
        kind: "fields",
        title: "Your turn: build the curve",
        prompt: "Spot stays at 70.00. Set the one-month future so a long that rolls every month earns at least 1% a month.",
        fields: [{ id: "future", label: "One-month future", kind: "stepper", min: 66, max: 74, step: 0.1, default: 71 }],
        valid: { field: "future", lte: 69.3 },
        feedback: [
          { when: { field: "future", gte: 70 }, text: "That's not below spot. A long gains nothing, or pays, as the future converges to 70.00." },
          { when: { field: "future", gt: 69.3 }, text: "Backwardation, but not enough: spot ÷ future − 1 is still under 1% a month. Go lower." },
        ],
        correct: "Right: at 69.30 or lower, 70.00 ÷ 69.30 − 1 = 1.01% a month, as long as spot and the curve stay put.",
        concept: "roll-yield",
      },
    ],
    check: ["q-3.14.3-1", "q-3.14.3-2", "q-3.14.3-3"],
    recap: {
      takeaways: [
        "Contango: futures above spot (storage, financing). Backwardation: below spot, when stocks are short.",
        "Roll yield ≈ spot ÷ future − 1 per roll: 71.00 against 70.00 costs 1.41% a month.",
        "Rolled longs in contango, like many commodity ETFs and long VIX products, lose while spot is flat.",
      ],
    },
  },
};

// ─── 3.14.4 · Commodities: supply shocks, reports and limits ────────────────

const L3144: Lesson = {
  id: "3.14.4",
  title: "Commodities: supply shocks, reports and limits",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Commodity futures move on supply shocks, storage and scheduled reports; limit moves can lock a market past your stop, so positions held through reports are sized for the gap, and seasons are already in the curve.",
  objectives: [
    "Name the supply, storage and report drivers that move a commodity future.",
    "Size a position held through a scheduled inventory report and a possible limit move.",
    "Explain why a famous seasonal pattern rarely pays once the curve has priced it.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
    { kind: "check", ref: "risk_management", label: "Risk management check" },
  ],
  script: {
    unit: "3.14",
    courseId: "3.14.4",
    hook: {
      prompt: "A synthetic grain future is locked limit-down for two days. Your stop sits 3% below entry; the daily limit is 5%. Where can your stop fill?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "At −3%", feedback: "A stop needs someone to trade with. Locked limit-down means no buyers at any allowed price, so nothing fills." },
          { id: "b", label: "At −5%", feedback: "Trading stops at the limit, but nobody buys there: the market is locked. The next day can lock lower again." },
          { id: "c", label: "Only when trading resumes, possibly near −10% or worse" },
        ],
        answer: "c",
      },
      compare: "You picked {yours}. Locked limit days skip stops: two 5% limits take price 9.75% lower, and the first fill can be lower still.",
      concept: "gap-risk",
    },
    learn: [
      {
        kind: "explain",
        title: "What moves commodities",
        text: "[[commodity|Commodity]] futures come in families: energy, metals, grains and oilseeds, softs such as coffee and sugar, and livestock. Supply shocks move them hardest: weather, OPEC+ output decisions, wars, disease, strikes and export bans. They arrive as jumps, and volatility stays high for a while after.",
      },
      {
        kind: "predict",
        title: "An inventory report",
        prompt: "Before a weekly [[inventory-report]], the consensus is that crude stocks fell 2.0 million barrels. The report shows a rise of 1.0 million. What does LXO most likely do first?",
        control: {
          kind: "choice",
          choices: [
            { id: "up", label: "Rises", feedback: "Stocks rose when a fall was expected: more supply than priced in. That pushes price down." },
            { id: "down", label: "Falls" },
            { id: "flat", label: "Nothing: a 1.0 million rise is small", feedback: "Markets react to the surprise, not the number: up 1.0 million against an expected 2.0 million fall is a 3.0 million miss." },
          ],
          answer: "down",
        },
        reveal: "It falls: a 3.0-million-barrel surprise toward more supply. Weekly US oil and gas stock reports, monthly crop estimates such as the USDA's WASDE, and the weekly COT positioning report (3.9.2) are the scheduled ones. Spreads widen and the first minutes swing both ways.",
        concept: "commodity-drivers",
      },
      {
        kind: "worked",
        title: "When the stop can't fill",
        lines: [
          "Long a grain future at 500.00, stop 485.00: 1R = 15.00 a unit. The daily limit is 5%.",
          "Day 1: locked [[limit-move|limit-down]] at 475.00. Nobody buys, so the stop can't fill.",
          "Day 2: locked again, 5% lower: 451.25.",
          "Day 3 reopens at 451.25 and your stop fills there. Loss in R: ?",
        ],
        ask: {
          answer: 3.25,
          tolerance: 0.01,
          unit: "R",
          feedback: [
            { value: 1, text: "That's the plan. A stop needs a buyer, and a locked market has none." },
            { value: 1.67, text: "That's after one limit day. The market locked again, down to 451.25." },
          ],
          correct: "Right: 48.75 ÷ 15.00 = 3.25R.",
        },
        after: "Size from the worst plausible gap, not from the stop. To hold two limit days to 2R here, trade about 0.62 of the stop-based size: 30.00 ÷ 48.75.",
        concept: "gap-risk",
      },
      {
        kind: "match",
        title: "Drivers and markets",
        prompt: "Match each driver to the market it moves first.",
        columns: ["Driver", "Market"],
        pairs: [
          { left: "OPEC+ agrees to cut output", right: "Crude oil", wrong: "OPEC+ sets oil production quotas: a cut tightens crude supply." },
          { left: "A drought in the growing season", right: "Grains such as corn and wheat", wrong: "Weather hits crops: a drought shrinks the harvest." },
          { left: "Real yields fall", right: "Gold", wrong: "Gold pays no interest, so it tends to gain when real yields fall (3.6.5)." },
          { left: "A colder-than-normal winter forecast", right: "Natural gas", wrong: "Heating demand drives winter gas: a cold forecast lifts it." },
        ],
        correct: "Right. Each market has its own drivers; trading one means learning its calendar and its shocks.",
        concept: "commodity-drivers",
      },
      {
        kind: "explain",
        title: "Delivery and limits",
        text: "Many commodity futures end in [[physical-delivery]], so roll before first notice day (3.14.2). Many contracts, grains especially, have daily price limits; others pause trading briefly instead. Micro contracts cut the size for smaller accounts. Know which rules your contract has before you hold it through a report.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Seasonal patterns are public, so the curve prices them: winter natural gas futures already trade above summer ones. Buying winter in summer pays only if winter beats what the curve expected. As a trade, seasonality rates C (3.13.4). Commodities are also the classic ground of trend following (3.13.1).",
      },
      // Try (report-day isn't built yet): decide the size held through the report.
      {
        kind: "fields",
        title: "Your turn: the report in 10 minutes",
        prompt: "Long 2 LXO at 70.00, stop 69.50: 1R = 1,000.00, 1% of 100,000.00. A report is due in 10 minutes; this drill's daily limit is 1.00. Keep two limit days within 2R.",
        fields: [
          { id: "contracts", label: "LXO contracts held through the report", kind: "stepper", min: 0, max: 2, step: 1, default: 2 },
          { id: "rule", label: "Your rule for report days", kind: "text", default: "", placeholder: "e.g. Size for two limit days, not for the stop", required: false },
        ],
        valid: { field: "contracts", lte: 1 },
        feedback: [{ when: { field: "contracts", gte: 2 }, text: "Two limit days cost 2.00 × 1,000 = 2,000.00 per contract. Two contracts lose 4,000.00: 4R." }],
        correct: "Right. One contract loses 2,000.00 over two limit days: 2R. Flat also meets the rule: reducing keeps the trade, flat removes the event.",
        concept: "gap-risk",
      },
    ],
    check: ["q-3.14.4-1", "q-3.14.4-2", "q-3.14.4-3"],
    recap: {
      takeaways: [
        "Commodities move on supply shocks, storage and scheduled reports; prices react to the surprise.",
        "Locked limit days skip stops: 1R planned became 3.25R. Size for two limit days.",
        "Seasonal patterns are already in the curve; you earn only what it didn't expect.",
      ],
    },
  },
};

// ─── 3.14.5 · Crypto markets: 24/7, venues and custody ──────────────────────

const L3145: Lesson = {
  id: "3.14.5",
  title: "Crypto markets: 24/7, venues and custody",
  topic: "risk_management",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Crypto trades around the clock with thin weekends and no closing auction; its larger volatility means smaller positions for the same risk, and coins left on a venue carry that venue's failure risk.",
  objectives: [
    "Describe what changes when a market never closes: weekends, thin hours, no closing auction.",
    "Size a crypto position from its much larger volatility so risk per trade stays at 1%.",
    "Rank custody and counterparty risks: exchange failure, stablecoin de-pegs, self-custody.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
    { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
  ],
  script: {
    unit: "3.14",
    courseId: "3.14.5",
    hook: {
      prompt: "You risk 1% with a stop 2 ATR away. LXC, the synthetic coin, has a daily ATR of 4% of price; LABX's is 1.5%. Compared with a LABX trade, your LXC position value should be…",
      control: {
        kind: "choice",
        choices: [
          { id: "same", label: "About the same", feedback: "Same risk, not same size. Each LXC unit moves 4% a day against 1.5%, so you need less of it." },
          { id: "smaller", label: "About 2.7 times smaller" },
          { id: "bigger", label: "Bigger", feedback: "A wider stop means fewer units for the same risk, not more. LXC's stop is 2.7 times wider in %." },
        ],
        answer: "smaller",
      },
      compare: "You picked {yours}. 4% ÷ 1.5% = 2.67: with a stop 2.67 times wider in %, the same 1% risk buys a position 2.67 times smaller.",
      concept: "crypto-market-structure",
    },
    learn: [
      {
        kind: "worked",
        title: "Same risk, smaller position",
        lines: [
          "Account 10,000.00, risk 1% = 100.00, stop 2 ATR away, before costs.",
          "LABX at 100.00, ATR 1.50: stop 3.00 away. 100.00 ÷ 3.00 = 33 units, 3,300.00 of LABX.",
          "LXC at 30,000.00, ATR 1,200.00: stop 2,400.00 away. 100.00 ÷ 2,400.00 = 0.0417 coins.",
          "LXC position value, in vUSD: ?",
        ],
        ask: {
          answer: 1250,
          tolerance: 1.5,
          unit: "vUSD",
          feedback: [
            { value: 3300, text: "That's the LABX position. Now LXC: 0.0417 coins × 30,000.00." },
            { value: 30000, text: "That's one whole coin. The budget covers only 0.0417 of one." },
          ],
          correct: "Right: about 1,250.00, against 3,300.00 of LABX. Same 100.00 at risk, 2.6 times smaller.",
        },
        after: "That's [[volatility-sizing]]: the coin's position is smaller because each unit moves more. Crypto venues sell fractions of a coin, so the size can match the risk closely.",
        concept: "percent-volatility-sizing",
      },
      {
        kind: "explain",
        title: "A market that never closes",
        text: "Crypto trades 24 hours a day, every day, with no closing auction. Weekends and quiet hours are thin: spreads widen and stops slip. A 4% daily move annualises to about 76% (4% × √365, since it trades every day); large stock indices usually run nearer 15–20%. In sell-offs, coins tend to fall together.",
      },
      {
        kind: "figure",
        title: "Where your coins live",
        text: "When FTX failed in November 2022, withdrawals froze and customer money turned out to have been used by an affiliated trading firm. [[counterparty-risk|Counterparty risk]] is per venue. In the US, SIPC covers securities at a failed broker, not crypto that isn't a security.",
        figure: {
          kind: "flow",
          start: "where",
          nodes: [
            { id: "where", text: "Are your coins held on an exchange?", kind: "question", yes: "venue", no: "self" },
            { id: "venue", text: "The exchange holds the keys; your balance is a claim on the firm", kind: "pause", next: "fail" },
            { id: "fail", text: "If it fails, withdrawals freeze and you queue with its creditors", kind: "end" },
            { id: "self", text: "Self-custody: no venue risk, but lost keys mean lost coins", kind: "end" },
          ],
          steps: [
            "On an exchange, the venue holds the keys. Your balance is a claim on the firm.",
            "If it fails, withdrawals freeze and you queue with its other creditors.",
            "Self-custody removes venue risk and adds yours: lose the keys and the coins are gone.",
          ],
        },
        concept: "counterparty-risk",
      },
      {
        kind: "match",
        title: "Name the risk",
        prompt: "Match each event to the kind of risk it is.",
        columns: ["Event", "Risk"],
        pairs: [
          { left: "A dollar stablecoin trades at 0.90", right: "A de-peg: the 'stable' token loses its value", wrong: "A stablecoin is only as good as its reserves and design. Below 1.00, it has de-pegged." },
          { left: "8% of a token's supply unlocks next week", right: "Scheduled new supply", wrong: "A token unlock releases locked coins on a known date: supply that holders may sell." },
          { left: "An exchange's wallet is hacked", right: "Venue risk", wrong: "Coins held on that exchange share its security and its solvency." },
          { left: "A regulator sues a large exchange", right: "Regulatory headline risk", wrong: "A lawsuit can freeze services or delist tokens, and moves prices within minutes." },
        ],
        correct: "Right. Real cases: an algorithmic stablecoin collapsed in 2022, and a large reserve-backed one briefly fell below its peg in March 2023, when a bank holding part of its reserves failed.",
        concept: "counterparty-risk",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Rules differ by place and change often. The EU licenses crypto service providers under MiCA and caps retail crypto CFDs at 2:1; the US has had spot bitcoin and ether ETFs since 2024. On-chain 'fundamentals' are noisy signals, grade C to D. [[grid-trading|Grid]] and [[martingale]] bots, heavily promoted in crypto, are grade F.",
      },
      // Try (custody-sim isn't built yet): the worst single-venue loss, then a custody rule.
      {
        kind: "worked",
        title: "One venue fails",
        lines: [
          "You hold 10,000.00 of synthetic crypto: venue A 4,000.00, venue B 3,000.00, venue C 2,000.00, your own wallet 1,000.00.",
          "Any one venue can fail. Plan for the worst: the biggest balance.",
          "Worst single-venue loss, as % of your holdings: ?",
        ],
        ask: {
          answer: 40,
          tolerance: 0,
          unit: "%",
          feedback: [
            { value: 30, text: "That's venue B. Plan for the worst case: venue A holds 4,000.00." },
            { value: 90, text: "In this drill venues fail one at a time: only the largest balance counts." },
          ],
          correct: "Right: 40%. To cap any one failure at 25%, no venue may hold more than 2,500.00.",
        },
        after: "Spreading across venues limits the damage from one failure; it doesn't help if they fail together. [[self-custody|Self-custody]] moves the risk to you: keys, backups and mistakes.",
        concept: "counterparty-risk",
      },
      {
        kind: "fields",
        title: "Your custody rules",
        prompt: "Write your crypto rules: the most you'll keep on any one venue, and a cap on open risk over a weekend.",
        fields: [
          { id: "venueCap", label: "Most on any one venue, % of your crypto", kind: "stepper", min: 5, max: 100, step: 5, unit: "%", default: 40 },
          { id: "weekendRisk", label: "Most open risk over a weekend, % of equity", kind: "stepper", min: 0.5, max: 5, step: 0.5, unit: "%", default: 2 },
          { id: "keys", label: "Where your key backup lives", kind: "text", default: "", placeholder: "e.g. Two paper copies in two places, never online", required: false },
        ],
        valid: { field: "venueCap", lte: 25 },
        feedback: [{ when: { field: "venueCap", gt: 25 }, text: "At {venueCap}% on one venue, a single failure takes more than a quarter of your crypto." }],
        correct: "Saved. One venue failing now costs at most a quarter of your crypto, and weekend exposure has a ceiling.",
        concept: "counterparty-risk",
      },
    ],
    check: ["q-3.14.5-1", "q-3.14.5-2", "q-3.14.5-3"],
    recap: {
      takeaways: [
        "24/7, no closing auction, thin weekends: 4% a day annualises to about 76%.",
        "Size from volatility: same 1% risk, an LXC position about 2.6 times smaller than LABX.",
        "Coins on a venue are a claim on it: cap each venue; self-custody trades for key risk.",
      ],
    },
  },
};

// ─── 3.14.6 · Perpetual swaps and funding ───────────────────────────────────

const L3146: Lesson = {
  id: "3.14.6",
  title: "Perpetual swaps and funding",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "A perpetual swap never expires; funding payments between longs and shorts keep it near spot, cost a leveraged long real money over time, and show crowded positioning without timing anything.",
  objectives: [
    "Explain how funding payments keep a perpetual swap near its spot index.",
    "Compute the funding paid or received per interval and per year.",
    "Read persistently positive funding as crowded longs: a condition, not a signal.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" }],
  script: {
    unit: "3.14",
    courseId: "3.14.6",
    hook: {
      prompt: "You hold a 100,000 vUSD long in the LXC perpetual. Funding for this 8-hour interval is +0.03%. Who pays whom, and how much?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "You receive 30 vUSD", feedback: "Positive funding flows from longs to shorts. You're long, so you pay." },
          { id: "b", label: "You pay 30 vUSD to the shorts" },
          { id: "c", label: "You pay 300 vUSD", feedback: "0.03% is 0.0003: 100,000 × 0.0003 = 30, not 300." },
          { id: "d", label: "Nobody pays", feedback: "Funding is charged at every interval while the rate isn't zero. It's a payment between traders." },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. Positive funding: longs pay shorts. 100,000.00 × 0.03% = 30.00 for this interval, and there are three a day.",
      concept: "funding-rate",
    },
    learn: [
      {
        kind: "explain",
        title: "A future with no expiry",
        text: "A [[perpetual-swap]] is a future that never expires, so nothing forces it back to spot. [[funding-rate|Funding]] does that job: every 8 hours (every 1 or 4 on some venues), longs and shorts pay each other. When the perpetual trades above its spot index, funding is positive and longs pay shorts, which pulls the price back.",
      },
      {
        kind: "worked",
        title: "Where the rate comes from",
        lines: [
          "One large venue's method, as third parties describe it: funding = [[premium-index]] + clamp(interest − premium, −0.05%, +0.05%).",
          "Interest is fixed at 0.01% per 8 hours. With a small premium, the clamp brings funding back to 0.01%.",
          "Now the premium averages 0.08%. Interest − premium = −0.07%, clamped to −0.05%.",
          "Funding for the interval, in %: ?",
        ],
        ask: {
          answer: 0.03,
          tolerance: 0.001,
          unit: "%",
          feedback: [
            { value: 0.01, text: "That's the default when the premium is small. Here it's 0.08%: 0.08% − 0.05%." },
            { value: 0.08, text: "Add the clamped term: 0.08% + (−0.05%)." },
            { value: 0.15, text: "The clamped term is negative: interest minus premium is −0.07%, capped at −0.05%." },
          ],
          correct: "Right: 0.03%, the hook's rate. The richer the perpetual, the more longs pay.",
        },
        after: "Venues differ in intervals, caps and formulas. Read the contract page before you trade one.",
        concept: "funding-rate",
      },
      {
        kind: "predict",
        title: "What funding costs",
        prompt: "A 5× long: 50,000.00 of LXC perpetual on 10,000.00 margin, held 30 days at +0.01% every 8 hours. What share of the margin goes to funding?",
        control: {
          kind: "choice",
          choices: [
            { id: "a", label: "0.9%", feedback: "That charges funding on the margin. It's charged on the 50,000.00 position." },
            { id: "b", label: "1.5%", feedback: "That's one payment a day. Funding comes every 8 hours: three a day." },
            { id: "c", label: "4.5%" },
            { id: "d", label: "10.95%", feedback: "10.95% is the yearly rate on the position. Over 30 days, at 5×, it's 4.5% of the margin." },
          ],
          answer: "c",
        },
        reveal: "50,000.00 × 0.01% × 3 × 30 = 450.00: 4.5% of the margin in a month, before any price move. 0.01% every 8 hours is 10.95% a year on the position, and leverage multiplies it as a share of margin.",
        concept: "funding-rate",
      },
      {
        kind: "figure",
        title: "Mark price and last price",
        text: "Venues value positions at the [[mark-price|mark price]], built from a spot index across several venues, not at the last trade. A thin moment on one venue can print a wick that the mark price ignores.",
        figure: {
          kind: "chart",
          chart: MARK_CHART,
          steps: [
            {
              text: "Last price on one venue: a thin moment, and a wick to 28,900.",
              layers: [{ kind: "marker", index: 6, price: 28900, label: "LAST 28,900", role: "down" }],
            },
            {
              text: "The mark price, from a multi-venue index, barely moved: its low was 29,780.",
              layers: [
                { kind: "line", values: [30110, 30050, 29950, 29980, 29960, 29910, 29850, 29900, 29990, 30040], role: "accent", label: "MARK" },
                { kind: "marker", index: 6, price: 29780, label: "MARK LOW 29,780", role: "accent" },
              ],
            },
            {
              text: "Liquidation at 29,200 uses mark price: no liquidation. A last-price stop there would have filled.",
              layers: [{ kind: "level", price: 29200, role: "stop", label: "LIQUIDATION 29,200" }],
            },
          ],
        },
        concept: "perpetual-swap",
      },
      {
        kind: "explain",
        title: "Funding as positioning",
        text: "Funding also shows positioning. Persistently positive funding means longs are crowded and paying to stay in. That's a condition, not a trigger (3.9.1): crowded trades can stay crowded. As a signal it rates C. Research finds perpetual prices stray from their no-arbitrage value more than FX rates do, together across coins, though less over time.",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Long spot plus short perpetual collects positive funding with little price risk: a basis trade, a form of carry (3.13.3), grade B. It pays while funding is positive and costs when it turns negative. The short leg still carries venue and liquidation risk.",
      },
      // Try (perp-ticket isn't built yet): the funding total entered before confirming.
      {
        kind: "worked",
        title: "Your turn: the ticket",
        lines: [
          "Ticket: LXC perpetual, long, margin 10,000.00, position 30,000.00 (3×).",
          "Funding is +0.01% every 8 hours. You plan to hold 14 days.",
          "Total funding you expect to pay at this rate, in vUSD: ?",
        ],
        ask: {
          answer: 126,
          tolerance: 1,
          unit: "vUSD",
          feedback: [
            { value: 42, text: "Funding is charged on the 30,000.00 position, three times a day: 30,000.00 × 0.01% × 3 × 14." },
            { value: 3, text: "That's one interval. 14 days hold 42 of them." },
          ],
          correct: "Right: 126.00, before any price move. It goes on the ticket before you confirm.",
        },
        after: "The rate changes every interval: if longs crowd in, it rises and so does your cost. Check it daily, like a swap.",
        concept: "funding-rate",
      },
    ],
    check: ["q-3.14.6-1", "q-3.14.6-2", "q-3.14.6-3"],
    recap: {
      takeaways: [
        "Funding keeps a perpetual near spot: when positive, longs pay shorts, usually every 8 hours.",
        "0.01% per 8 hours is 10.95% a year on the position: 126.00 over 14 days at 3×.",
        "Persistently positive funding means crowded longs: a condition to respect, not a trigger.",
      ],
    },
  },
};

// ─── 3.14.7 · Leverage, liquidation and cascades ────────────────────────────

const L3147: Lesson = {
  id: "3.14.7",
  title: "Leverage, liquidation and cascades",
  topic: "portfolio_exposure",
  level: "intermediate",
  tier: "free",
  minutes: 8,
  summary: "An isolated long is liquidated about 1 ÷ leverage minus the maintenance margin below entry; set the stop first, size from it, and choose leverage so liquidation sits well beyond the stop.",
  objectives: [
    "Compute an approximate liquidation price for an isolated long from leverage and maintenance margin.",
    "Place the stop well inside the liquidation price and let leverage set margin, not risk.",
    "Explain liquidation cascades, insurance funds and auto-deleveraging, and why cross margin spreads the damage.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M04", label: "Define Your Risk" },
    { kind: "arena", ref: "high_volatility", label: "Arena: high volatility" },
  ],
  script: {
    unit: "3.14",
    courseId: "3.14.7",
    hook: {
      prompt: "Long LXC at 30,000 with 10× isolated leverage. Maintenance margin is 0.5%. Roughly where are you liquidated?",
      control: {
        kind: "slider",
        min: 20000,
        max: 30000,
        step: 50,
        start: 25000,
        answer: 27150,
        tolerance: 100,
        feedback: [
          { from: 20000, to: 26950, text: "Too far. At 10× the margin covers only a 10% fall, and the venue doesn't wait for all of it." },
          { from: 27000, to: 27000, text: "That's −10%, where the margin is all gone. The venue liquidates while 0.5% maintenance is left: −9.5%." },
          { from: 27300, to: 30000, text: "Too close. 10× margin is 10% of the position; liquidation comes when about 9.5% is gone." },
        ],
      },
      compare: "You picked {yours}. Liquidation ≈ 30,000 × (1 − 1 ÷ 10 + 0.005) = 27,150, a 9.5% fall. Exact formulas vary by venue.",
      concept: "liquidation-price",
    },
    learn: [
      {
        kind: "worked",
        title: "Where liquidation sits",
        lines: [
          "Isolated long: [[liquidation-price]] ≈ entry × (1 − 1 ÷ leverage + maintenance margin rate). Venues' exact formulas differ.",
          "10×: 30,000 × (1 − 0.10 + 0.005) = 27,150, a 9.5% fall.",
          "25×: 30,000 × (1 − 0.04 + 0.005) = 28,950, a 3.5% fall.",
          "50×: 30,000 × (1 − 0.02 + 0.005) = ?",
        ],
        ask: {
          answer: 29550,
          tolerance: 1,
          feedback: [
            { value: 29400, text: "That leaves out the maintenance margin. Liquidation comes 0.5% earlier." },
            { value: 15000, text: "1 ÷ 50 is 0.02, not 0.5." },
          ],
          correct: "Right: 29,550, a 1.5% fall: ordinary noise for a coin that moves 4% a day.",
        },
        after: "At 50× the margin covers a 2% move, and the venue liquidates once only the 0.5% maintenance is left. More leverage pulls liquidation toward entry.",
        concept: "liquidation-price",
      },
      {
        kind: "worked",
        title: "Stop first, then leverage",
        lines: [
          "1. Stop: 3% below entry, at 29,100. Risk 1% of 10,000.00 = 100.00.",
          "2. Size from the stop: 100.00 ÷ 3% = 3,333.33 of LXC.",
          "3. Leverage sets only the margin: 333.33 at 10×, 133.33 at 25×. The risk stays 100.00.",
          "4. Check: at 25×, liquidation is 28,950. Gap between stop and liquidation, in vUSD of price: ?",
        ],
        ask: {
          answer: 150,
          tolerance: 0,
          feedback: [
            { value: 1050, text: "That's entry to liquidation. Measure from the stop, 29,100." },
            { value: 900, text: "That's entry to stop. Measure from the stop down to the liquidation price." },
          ],
          correct: "Right: 150, 0.5% of price. A wick on the mark price can cover that before your stop fills.",
        },
        after: "This course's design rule: liquidation at least twice as far as the stop. At 10×, 9.5% against a 3% stop passes. At 25×, 3.5% fails, and a liquidation charges a fee on top.",
        concept: "liquidation-price",
      },
      {
        kind: "explain",
        title: "When liquidations go wrong",
        text: "[[isolated-margin|Isolated margin]] risks only that position's margin. [[cross-margin|Cross margin]] lets positions share the account: fewer liquidations, but one bad trade can drain everything. If a liquidation closes below zero equity, the venue's [[insurance-fund]] covers the gap; when it runs dry, [[auto-deleveraging]] closes profitable traders on the other side.",
      },
      {
        kind: "match",
        title: "Isolated or cross?",
        prompt: "Sort each statement under the margin mode it describes.",
        columns: ["Statement", "Margin mode"],
        pairs: [
          { left: "A liquidation can take only this position's margin", right: "Isolated", wrong: "Capping the loss at one position's margin is what isolated margin does." },
          { left: "Gains on one position hold up another", right: "Cross", wrong: "Sharing the balance across positions is cross margin." },
          { left: "One bad trade can drain the whole account", right: "Cross", wrong: "Only cross margin lets one position reach the rest of the account." },
          { left: "You top up each position yourself, or it's closed", right: "Isolated", wrong: "With isolated margin, each position stands on its own margin." },
        ],
        correct: "Right. Isolated caps the damage per position; cross spreads it across the account.",
        concept: "leverage",
      },
      {
        kind: "figure",
        title: "A liquidation cascade",
        text: "A liquidation cascade is a [[stop-cascade]] with leverage. In October 2025, a sell-off produced what was reported as the largest day of crypto liquidations on record, and several venues used auto-deleveraging.",
        figure: {
          kind: "flow",
          start: "drop",
          nodes: [
            { id: "drop", text: "Price drops, often in thin hours", kind: "pause", next: "liq" },
            { id: "liq", text: "Highly levered positions hit their liquidation prices", kind: "pause", next: "sell" },
            { id: "sell", text: "The venue sells them at market", kind: "pause", next: "lower" },
            { id: "lower", text: "The selling pushes price into the next layer of liquidations", kind: "end" },
          ],
          steps: [
            "A fall starts, often in thin hours or on a weekend.",
            "The most levered longs reach their liquidation prices first.",
            "Their positions are sold at market, into a thin book.",
            "Price falls further, into the next layer of liquidations: the chain feeds itself.",
          ],
        },
        concept: "liquidation-cascade",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Leverage multiplies volatility, not edge. Account move ≈ price move × [[effective-leverage]]: at 20×, a 5% move against you is 100% of the margin. EU rules cap retail crypto CFDs at 2:1.",
      },
      // Try (liq-calculator isn't built yet): choose the leverage.
      {
        kind: "fields",
        title: "Your turn: pick the leverage",
        prompt: "LXC at 30,000, account 10,000.00, risk 1%, stop 3%, maintenance margin 0.5%. Choose leverage so liquidation sits at least twice as far as your stop.",
        fields: [{ id: "leverage", label: "Leverage", kind: "stepper", min: 1, max: 50, step: 1, unit: "×", default: 25 }],
        valid: { field: "leverage", lte: 15 },
        feedback: [{ when: { field: "leverage", gt: 15 }, text: "At {leverage}×, liquidation sits 1 ÷ {leverage} − 0.5% below entry: under 6%, twice your 3% stop." }],
        correct: "Right. At 15×, the most that passes: 1 ÷ 15 − 0.5% = 6.17%. Risk is still 100.00, set by the stop; leverage only set the margin.",
        concept: "liquidation-price",
      },
    ],
    check: ["q-3.14.7-1", "q-3.14.7-2", "q-3.14.7-3"],
    recap: {
      takeaways: [
        "Liquidation ≈ entry × (1 − 1 ÷ L + maintenance): 27,150 at 10×, 29,550 at 50×.",
        "Stop first, size from it; leverage sets margin. Keep liquidation twice the stop's distance: 15× here.",
        "Cascades feed on forced selling; insurance funds and auto-deleveraging can close even winners.",
      ],
    },
  },
};

// ─── 3.14.8 · Bonds and rates for traders ───────────────────────────────────

const L3148: Lesson = {
  id: "3.14.8",
  title: "Bonds and rates for traders",
  topic: "market_fundamentals",
  level: "intermediate",
  tier: "free",
  minutes: 7,
  summary: "Bond prices move opposite to yields by about the duration per point; DV01 turns a yield move in basis points into money, and one rate surprise reaches FX carry, funding costs, futures and stock valuations.",
  objectives: [
    "Explain the inverse price–yield link and estimate a price change from duration.",
    "Compute a position's DV01 and its P&L from a yield move in basis points.",
    "Trace how one rate surprise reaches carry, CFD funding, futures fair value and equity valuations.",
  ],
  blocks: [],
  practice: [
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
    { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
  ],
  script: {
    unit: "3.14",
    courseId: "3.14.8",
    hook: {
      prompt: "A synthetic 10-year note has a duration of 8.95. Yields rise one percentage point. Its price moves by about…",
      control: {
        kind: "slider",
        min: -20,
        max: 20,
        step: 0.5,
        unit: "%",
        start: 0,
        answer: -9,
        tolerance: 0.5,
        feedback: [
          { from: 0, to: 20, text: "Yields up, prices down: a bond's price moves opposite to its yield." },
          { from: -20, to: -10, text: "Too much. Duration 8.95 means about 8.95% per percentage point." },
          { from: -8, to: -0.5, text: "Too little. Duration 8.95 means about 8.95% per percentage point." },
        ],
      },
      compare: "You picked {yours}. Duration 8.95 × 1 point ≈ −8.95%. The exact fall is a little smaller, −8.52%, because of convexity.",
      concept: "bond-duration",
    },
    learn: [
      {
        kind: "explain",
        title: "Price, yield, duration",
        text: "A bond pays coupons and its face value at maturity. Its price and [[yield]] move in opposite directions (3.6.1). [[duration|Duration]] says how far: roughly the percentage price change for a one-point change in yield. LXN's note has a duration of 8.95, so a one-point rise costs about 8.95%.",
      },
      {
        kind: "worked",
        title: "The line bends",
        lines: [
          "LXN tracks a synthetic 10-year note: a 2.16% coupon, paid twice a year, priced at 100.00. Duration 8.95.",
          "Duration's estimate: yields +1 point → −8.95%; −1 point → +8.95%.",
          "Repriced exactly: +1 point → −8.52%; −1 point → +9.42%.",
          "How much smaller is the real fall than the estimate, in percentage points: ?",
        ],
        ask: {
          answer: 0.43,
          tolerance: 0.01,
          feedback: [
            { value: 0.47, text: "That's the rise: 9.42 − 8.95. Compare the fall: 8.95 − 8.52." },
            { value: 17.47, text: "Compare the estimate with the exact fall, not the fall with the rise." },
          ],
          correct: "Right: 0.43 points. Falls are smaller, and rises larger, than duration says.",
        },
        after: "That bend is [[convexity]]. It's small for small moves, so duration works for everyday sizing; for big moves, reprice the bond.",
        concept: "bond-duration",
      },
      {
        kind: "worked",
        title: "DV01: money per basis point",
        lines: [
          "[[dv01|DV01]] ≈ duration × value × 0.0001: the money change for one [[basis-point]] of yield.",
          "1,000,000.00 of the note at 100.00, duration 8.95: 8.95 × 1,000,000.00 × 0.0001 = 895.00 per basis point.",
          "A surprise lifts yields 25 basis points. P&L of the long: ?",
        ],
        ask: {
          answer: -22375,
          tolerance: 1,
          unit: "vUSD",
          feedback: [
            { value: 22375, text: "Check the sign: yields up, price down. The long loses." },
            { value: -2237.5, text: "25 basis points × 895.00, not 2.5." },
          ],
          correct: "Right: −22,375.00, 2.24% of the position.",
        },
        after: "DV01 adds across positions, so a desk sums it to see its total rate risk in money. Short bonds carry far less DV01 per million than long ones.",
        concept: "dv01",
      },
      {
        kind: "match",
        title: "Rate instruments",
        prompt: "Match each rate instrument to its feature.",
        columns: ["Instrument", "Feature"],
        pairs: [
          { left: "Treasury and Bund futures", right: "Track the cheapest bond to deliver, so their DV01 drifts", wrong: "Bond futures deliver one of a basket of bonds; the cheapest one drives the price and the DV01." },
          { left: "Yield-quoted futures", right: "A fixed money value per basis point", wrong: "Quoted in yield, they pay a set amount per basis point: DV01 is fixed by design." },
          { left: "Short-term rate futures, such as SOFR", right: "Price the expected path of policy rates (3.7)", wrong: "Priced as 100 minus the expected rate, they show where markets think policy is going." },
          { left: "Bond ETFs", right: "A fund of bonds traded like a share, with no expiry", wrong: "An ETF holds bonds and rolls them itself; you never roll or face delivery." },
        ],
        correct: "Right. Same rates, different wrappers: check the DV01 of whatever you trade.",
        concept: "dv01",
      },
      {
        kind: "figure",
        title: "One surprise, many markets",
        text: "Rates feed into almost every price. Even if you trade only stocks, a rate surprise reaches your positions through several doors at once.",
        figure: {
          kind: "flow",
          start: "cpi",
          nodes: [
            { id: "cpi", text: "A hot CPI print: more hikes priced, yields jump", kind: "pause", next: "fx" },
            { id: "fx", text: "FX carry shifts; CFD and swap financing rise", kind: "pause", next: "fut" },
            { id: "fut", text: "Index futures' fair value over spot widens", kind: "pause", next: "eq" },
            { id: "eq", text: "Stock valuations fall, long-duration growth most; options reprice", kind: "end" },
          ],
          steps: [
            "A hot CPI print: markets price more rate hikes, and yields jump.",
            "FX: rate differentials and carry move; CFD overnight funding rises (2.14).",
            "Futures: more financing raises index futures' fair value over spot (3.14.3).",
            "Stocks: a higher discount rate lowers valuations, long-duration growth most (3.8.3). Options reprice too (4.1).",
          ],
        },
        concept: "bond-duration",
      },
      {
        kind: "callout",
        tone: "info",
        text: "Curve trades weighted by DV01, such as 2-year against 10-year, size each leg so both move the same money per basis point. That's Advanced to Expert ground; the [[yield-curve]] itself is in 3.6.",
      },
      // Try (dv01-desk isn't built yet): cut the position to the rate-risk cap.
      {
        kind: "fields",
        title: "Your turn: cut the rate risk",
        prompt: "You hold 3 LXN contracts, DV01 80.00 vUSD each, on a 100,000.00 account. Keep as many as you can while a 10 bp surprise costs at most 1%.",
        fields: [{ id: "contracts", label: "LXN contracts to keep", kind: "stepper", min: 0, max: 3, step: 1, default: 3 }],
        valid: { field: "contracts", eq: 1 },
        feedback: [
          { when: { field: "contracts", gte: 2 }, text: "Each contract loses 80.00 × 10 = 800.00 on a 10 bp move. Two lose 1,600.00, over the 1,000.00 cap." },
          { when: { field: "contracts", eq: 0 }, text: "Flat is safe, but one contract fits: 800.00 is within 1,000.00." },
        ],
        correct: "Right: 1 contract, 800.00 on a 10 bp surprise. Three would have lost 2,400.00.",
        concept: "dv01",
      },
    ],
    check: ["q-3.14.8-1", "q-3.14.8-2", "q-3.14.8-3"],
    recap: {
      takeaways: [
        "Price and yield move opposite; duration 8.95 means about −8.95% for a one-point rise.",
        "DV01 is money per basis point: 895.00 on 1,000,000 at duration 8.95; 25 bp costs 22,375.00.",
        "One rate surprise reaches FX carry, CFD funding, futures fair value, stock valuations and options.",
      ],
    },
  },
};

// ─── Questions ──────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 3.14.1 · Futures contracts
  {
    id: "q-3.14.1-1",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 1,
    prompt: "LXO, the synthetic crude future, is 1,000 units a contract, with a 0.01 tick worth 10.00 vUSD. You're long 1 LXO at 72.40 and it settles at 73.25. Your gain, in vUSD?",
    numeric: { answer: 850, tolerance: 0, unit: "vUSD" },
    explanation: "73.25 − 72.40 = 0.85, or 85 ticks. 85 × 10.00 = 850.00, the same as 0.85 × 1,000 units. The multiplier turns every price move into money.",
    lesson: "3.14.1",
    concepts: ["futures-contract"],
    hints: ["Find the move in price, then in ticks.", "0.85 is 85 ticks of 0.01.", "85 × 10.00."],
    vary: {
      fields: { entry: [65, 80, 0.05], ticks: [20, 150, 5], n: [1, 3, 1] },
      answer: "ticks * 10 * n",
      prompt: "LXO, the synthetic crude future, is 1,000 units a contract, with a 0.01 tick worth 10.00 vUSD. You're long {n} LXO at {entry:2} and it settles at {entry + ticks * 0.01:2}. Your gain, in vUSD?",
      explanation: "{entry + ticks * 0.01:2} − {entry:2} = {ticks * 0.01:2}, or {ticks} ticks. {ticks} × 10.00 × {n} = {answer:2}. The multiplier turns every price move into money.",
      hint: "{ticks} ticks × 10.00 × {n}.",
    },
  },
  {
    id: "q-3.14.1-2",
    topic: "position_sizing",
    kind: "numeric",
    difficulty: 2,
    prompt: "You're long 3 LXF (50 vUSD a point). Yesterday's settlement was 5,010.25; today's is 4,987.75. How much variation margin leaves your account today, in vUSD?",
    numeric: { answer: 3375, tolerance: 0, unit: "vUSD" },
    explanation: "The fall is 22.50 points. 22.50 × 50 × 3 = 3,375.00, debited in cash tonight whatever your stop says. Tomorrow's P&L starts from 4,987.75.",
    lesson: "3.14.1",
    concepts: ["mark-to-market"],
    hints: ["Variation margin is the day's move, settlement to settlement, in money.", "5,010.25 − 4,987.75 = 22.50 points.", "22.50 × 50 × 3."],
    vary: {
      fields: { n: [1, 4, 1], drop: [5, 60, 0.25] },
      answer: "drop * 50 * n",
      prompt: "You're long {n} LXF (50 vUSD a point). Yesterday's settlement was 5,010.25; today's is {5010.25 - drop:2}. How much variation margin leaves your account today, in vUSD?",
      explanation: "The fall is {drop:2} points. {drop:2} × 50 × {n} = {answer:2}, debited in cash tonight whatever your stop says.",
      hint: "{drop:2} × 50 × {n}.",
    },
  },
  {
    id: "q-3.14.1-3",
    topic: "position_sizing",
    kind: "scenario",
    difficulty: 3,
    scenario: "LXM's margin is 1,250.00 a contract. A trader with 100,000.00 buys 6 LXM, posts 7,500.00 of margin and sets no stop. 'The margin is the most I can lose,' he says.",
    prompt: "What's wrong with his reasoning?",
    options: [
      { id: "a", label: "Nothing: losses stop at the margin posted", rationale: "Margin is a deposit. Losses settle in cash every day and keep coming out of the account beyond it, until he closes or is closed out." },
      { id: "b", label: "Losses settle daily in cash and can exceed the margin; only a stop and the size limit the risk" },
      { id: "c", label: "The margin is a fee, so he loses it whatever happens", rationale: "Margin comes back when the position closes, plus gains or minus losses. It's collateral, not a cost." },
      { id: "d", label: "The exchange closes the trade before losses pass the margin", rationale: "Falling below maintenance brings a margin call, not a guaranteed exit at that level. Gaps and limit moves can carry losses far past it." },
    ],
    correct: "b",
    explanation: "Margin is collateral held against daily losses. Each evening the loss is debited in cash, and below maintenance he must top up. Without a stop, nothing caps the loss: 6 LXM lose 30.00 for every point.",
    lesson: "3.14.1",
    concepts: ["mark-to-market", "leverage"],
    hints: ["Ask what happens to a loss bigger than the margin.", "Variation margin is paid daily, in cash, from the account."],
  },

  // 3.14.2 · Expiry, roll and continuous charts
  {
    id: "q-3.14.2-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does the contract name LXFU7 tell you?",
    options: [
      { id: "a", label: "The LXF contract expiring in June 2027", rationale: "June is M. U is September: H, M, U and Z are the quarterly months." },
      { id: "b", label: "The LXF contract expiring in September 2027" },
      { id: "c", label: "An unadjusted continuous LXF chart", rationale: "Month codes name single contracts. Continuous charts are built from many of them." },
      { id: "d", label: "The seventh LXF contract listed this year", rationale: "The digit is the year of expiry, here 2027; the letter is the month." },
    ],
    correct: "b",
    explanation: "Root LXF, month code U for September, year 7 for 2027. Index futures list March (H), June (M), September (U) and December (Z).",
    lesson: "3.14.2",
    concepts: ["contract-roll"],
  },
  {
    id: "q-3.14.2-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "At the roll, the old LXF contract closes at 4,880.00 and the new one at 4,904.50. You back-adjust by adding the gap to earlier prices. A bar before the roll closed at 4,812.25. Its adjusted close?",
    numeric: { answer: 4836.75, tolerance: 0.01, unit: "" },
    explanation: "The gap is 4,904.50 − 4,880.00 = 24.50. Every price before the roll shifts up by it: 4,812.25 + 24.50 = 4,836.75. Prices after the roll stay as traded.",
    lesson: "3.14.2",
    concepts: ["continuous-contract"],
    hints: ["Find the roll gap first.", "4,904.50 − 4,880.00 = 24.50.", "Add it to 4,812.25."],
    vary: {
      fields: { old: [4500, 5500, 0.25], gap: [5, 45, 0.25], d: [10, 150, 0.25] },
      answer: "old - d + gap",
      prompt: "At the roll, the old LXF contract closes at {old:2} and the new one at {old + gap:2}. You back-adjust by adding the gap to earlier prices. A bar before the roll closed at {old - d:2}. Its adjusted close?",
      explanation: "The gap is {old + gap:2} − {old:2} = {gap:2}. Every price before the roll shifts up by it: {old - d:2} + {gap:2} = {answer:2}. Prices after the roll stay as traded.",
      hint: "{old - d:2} + {gap:2}.",
    },
  },
  {
    id: "q-3.14.2-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 3,
    scenario: "A breakout system tested on an unadjusted continuous LXF chart shows its best trades entering on roll days, buying 20–40-point jumps and keeping the gains.",
    prompt: "What's the problem?",
    options: [
      { id: "a", label: "Nothing: roll days are liquid, so those fills are realistic", rationale: "Liquidity isn't the issue. The jumps are where the chart switches contracts; no holder ever saw that price change." },
      { id: "b", label: "The roll gaps are jumps no position ever earned, so those signals and gains are fake" },
      { id: "c", label: "The test should hold each contract until delivery", rationale: "Holding to delivery isn't an option for most traders, and it doesn't fix the chart. Back-adjusting removes the gaps." },
      { id: "d", label: "Nothing: a gap is a gap, and real traders saw it too", rationale: "A real gap moves one contract's price. A roll gap exists only where the chart joins two contracts." },
    ],
    correct: "b",
    explanation: "Each roll joins two contracts that trade at different prices. Unadjusted, the joint looks like a jump, and a breakout rule buys it. Back-adjusting shifts earlier prices by each gap, so signals see only moves a holder could have had.",
    lesson: "3.14.2",
    concepts: ["continuous-contract", "adjusted-price-data"],
    hints: ["Ask what happens to the chart on roll day.", "Did anyone holding a contract see that jump?"],
  },

  // 3.14.3 · Contango, backwardation and roll yield
  {
    id: "q-3.14.3-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "Spot is 80.00 and the one-month future 81.20. If both stay where they are, what does a long earn per monthly roll, in %? Use a minus sign for a cost.",
    numeric: { answer: -1.48, tolerance: 0.02, unit: "%" },
    explanation: "The future converges from 81.20 to 80.00: 80.00 ÷ 81.20 − 1 = −1.48%. That's contango: the long pays roll yield every month, even with spot flat.",
    lesson: "3.14.3",
    concepts: ["roll-yield"],
    hints: ["The future ends the month at spot.", "Return per roll = spot ÷ future − 1.", "80.00 ÷ 81.20 − 1."],
    vary: {
      fields: { spot: [50, 100, 1], diff: [-2, 2, 0.1] },
      constraints: ["abs(diff) >= 0.2"],
      answer: "round((spot / (spot + diff) - 1) * 100, 2)",
      prompt: "Spot is {spot:2} and the one-month future {spot + diff:2}. If both stay where they are, what does a long earn per monthly roll, in %? Use a minus sign for a cost.",
      explanation: "The future converges from {spot + diff:2} to {spot:2}: {spot:2} ÷ {spot + diff:2} − 1 = {answer:2}%. Futures above spot (contango) cost a long; futures below spot (backwardation) pay it.",
      hint: "{spot:2} ÷ {spot + diff:2} − 1.",
    },
  },
  {
    id: "q-3.14.3-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "What most often puts a commodity's futures curve into backwardation?",
    options: [
      { id: "a", label: "High storage costs", rationale: "Storage is part of the cost of carry. It lifts futures above spot: contango." },
      { id: "b", label: "High interest rates", rationale: "Financing is a carrying cost too. Higher rates lift futures relative to spot." },
      { id: "c", label: "Low inventories, so having the commodity now is worth a premium" },
      { id: "d", label: "Traders expecting prices to rise", rationale: "Expected rises would lift futures above spot, not below. Backwardation signals scarcity now." },
    ],
    correct: "c",
    explanation: "When stocks are low, users pay up for the barrel or bushel in hand: the convenience yield. It can outweigh financing and storage, so spot trades above the futures. Ample stocks do the opposite.",
    lesson: "3.14.3",
    concepts: ["term-structure"],
  },
  {
    id: "q-3.14.3-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 3,
    scenario: "A commodity ETF that holds front-month futures and rolls monthly fell 20% in a year. Spot was flat over the same year. The fund's fee is 0.75% a year.",
    prompt: "What best explains the gap?",
    options: [
      { id: "a", label: "The fee", rationale: "0.75% a year explains less than one point of a 20-point gap." },
      { id: "b", label: "Backwardation made it overpay for each contract", rationale: "In backwardation futures sit below spot, so a rolled long gains as they converge up." },
      { id: "c", label: "Spot was quoted wrong", rationale: "The fund never held spot; it held futures, and their curve explains the loss." },
      { id: "d", label: "Steep contango: each roll bought a contract above spot that then converged down" },
    ],
    correct: "d",
    explanation: "A long that rolls in contango buys each contract above spot and loses the premium as it converges. About 1.8% a month compounds to roughly −20% a year with spot flat. Check a fund's holdings and their curve, not just its name.",
    lesson: "3.14.3",
    concepts: ["roll-yield", "term-structure"],
    hints: ["The fund holds futures, not spot.", "Ask what a monthly roll costs when futures sit above spot."],
  },

  // 3.14.4 · Commodities
  {
    id: "q-3.14.4-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 2,
    prompt: "Long a synthetic grain future at 800.00, stop at 780.00. The daily limit is 5%. It locks limit-down two days in a row; trading reopens at the second day's limit price, where your stop fills. Loss in R?",
    numeric: { answer: 3.9, tolerance: 0.02, unit: "R" },
    explanation: "Day 1: 800.00 × 0.95 = 760.00. Day 2: 760.00 × 0.95 = 722.00. Loss 78.00 a unit ÷ 1R of 20.00 = 3.9R. The stop couldn't fill while the market was locked.",
    lesson: "3.14.4",
    concepts: ["gap-risk", "commodity-drivers"],
    hints: ["Each limit day is 5% below the previous settlement.", "800.00 → 760.00 → 722.00.", "Loss per unit ÷ (800.00 − 780.00)."],
    vary: {
      fields: { entry: [200, 1000, 10], stopPct: [1, 4, 0.5], limit: [3, 7, 1] },
      constraints: ["stopPct < limit"],
      answer: "round((1 - (1 - pct(limit)) * (1 - pct(limit))) / pct(stopPct), 2)",
      prompt: "Long a synthetic grain future at {entry:2}, stop at {entry * (1 - pct(stopPct)):2}. The daily limit is {limit}%. It locks limit-down two days in a row; trading reopens at the second day's limit price, where your stop fills. Loss in R?",
      explanation: "Day 1: {entry * (1 - pct(limit)):2}. Day 2: {entry * (1 - pct(limit)) * (1 - pct(limit)):2}. Loss {entry - entry * (1 - pct(limit)) * (1 - pct(limit)):2} a unit ÷ 1R of {entry * pct(stopPct):2} = {answer:2}R. The stop couldn't fill while the market was locked.",
      hint: "Loss per unit ÷ {entry * pct(stopPct):2}.",
    },
  },
  {
    id: "q-3.14.4-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 1,
    prompt: "What does a weekly inventory report do for a commodity market?",
    options: [
      { id: "a", label: "Publishes scheduled data on how much of the commodity is in storage" },
      { id: "b", label: "Sets the official price for the coming week", rationale: "Prices come from trading. The report adds supply information, and the market reprices on the surprise." },
      { id: "c", label: "Shows how speculators are positioned", rationale: "That's the COT report. An inventory report counts the commodity in storage." },
      { id: "d", label: "Announces the exchange's new margin levels", rationale: "Margin changes come from the exchange or clearing house, not from supply data." },
    ],
    correct: "a",
    explanation: "Inventory reports are scheduled supply information. Prices move on the surprise against expectations: a build when a draw was expected pushes price down. Spreads widen around the release, as with any scheduled event.",
    lesson: "3.14.4",
    concepts: ["commodity-drivers"],
  },
  {
    id: "q-3.14.4-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario: "It's June. You buy the January natural gas future, expecting winter demand to lift gas prices.",
    prompt: "Why is this a weak trade on its own?",
    options: [
      { id: "a", label: "Gas prices don't rise in winter", rationale: "Winter demand is real. The issue is that the January contract's price already includes it." },
      { id: "b", label: "January contracts can't be traded in June", rationale: "Gas futures list many months ahead; you can buy January in June." },
      { id: "c", label: "The curve already prices winter: January trades above summer contracts, so you profit only if winter beats that" },
      { id: "d", label: "The January future won't follow winter gas prices", rationale: "It converges to spot in January, so it does. What it already contains is the expected winter premium." },
    ],
    correct: "c",
    explanation: "Seasonal demand is public, so the curve builds it in: winter contracts trade at a premium to summer ones. Buying January in June earns only if winter turns out tighter than priced. As a trade, seasonality rates C.",
    lesson: "3.14.4",
    concepts: ["term-structure", "commodity-drivers"],
    hints: ["Compare the January price with the summer contracts.", "What does the market already expect for winter?"],
  },

  // 3.14.5 · Crypto markets
  {
    id: "q-3.14.5-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 1,
    prompt: "LXC's daily volatility is 4%. It trades every day of the year. Annualised volatility, in %?",
    numeric: { answer: 76.42, tolerance: 0.5, unit: "%" },
    explanation: "Volatility scales with the square root of time. Crypto trades 365 days a year: 4% × √365 = 4% × 19.10 = 76.4%. Markets that trade about 252 days a year use √252.",
    lesson: "3.14.5",
    concepts: ["crypto-market-structure"],
    hints: ["Volatility grows with the square root of the number of trading days.", "√365 ≈ 19.10.", "4% × 19.10."],
    vary: {
      fields: { daily: [2, 6, 0.5] },
      answer: "round(daily * 19.105, 2)",
      prompt: "LXC's daily volatility is {daily:1}%. It trades every day of the year. Annualised volatility, in %?",
      explanation: "Volatility scales with the square root of time. Crypto trades 365 days a year: {daily:1}% × √365 = {daily:1}% × 19.10 = {answer:1}%.",
      hint: "{daily:1}% × 19.10.",
    },
  },
  {
    id: "q-3.14.5-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "A US broker that is a SIPC member fails. What does SIPC protection cover?",
    options: [
      { id: "a", label: "Any losses in the account, market losses included", rationale: "SIPC replaces missing assets at a failed broker. It never covers market losses." },
      { id: "b", label: "Crypto held at any US-licensed exchange", rationale: "Crypto that isn't a security is outside SIPC, whoever holds it." },
      { id: "c", label: "Missing securities and cash, up to a limit, but not crypto that isn't a security" },
      { id: "d", label: "Futures positions at the broker", rationale: "SIPC doesn't cover futures. Futures customers rely on the segregation of their funds instead." },
    ],
    correct: "c",
    explanation: "SIPC restores customers' missing securities and cash when a member broker fails, up to set limits. It doesn't cover market losses, futures, or crypto that isn't a security. Venue failure risk on crypto stays with you.",
    lesson: "3.14.5",
    concepts: ["counterparty-risk"],
    hints: ["SIPC is about missing assets, not losses.", "Which assets count as securities?"],
  },
  {
    id: "q-3.14.5-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 3,
    scenario: "You hold a mid-sized token. Next week a scheduled unlock releases tokens equal to 8% of the supply now trading.",
    prompt: "What's the sound plan?",
    options: [
      { id: "a", label: "Buy more now: unlocks rally", rationale: "Nothing about an unlock forces a rally. New supply that holders may sell is the usual concern." },
      { id: "b", label: "Treat it as a scheduled supply event: cut size or stay flat, and watch funding and open interest" },
      { id: "c", label: "Change nothing: scheduled events are priced in", rationale: "Being expected doesn't make the day calm. Like an earnings date, it fixes when a gap may come." },
      { id: "d", label: "Short as much as you can: the price must fall", rationale: "The unlock may already be priced, and crowded shorts pay funding and get squeezed. 'Must' isn't a plan." },
    ],
    correct: "b",
    explanation: "An unlock adds supply on a known date, like a report or an earnings release. You can't know the reaction, but you know when risk rises: size down or stand aside, and check positioning, such as funding and open interest, going in.",
    lesson: "3.14.5",
    concepts: ["crypto-market-structure"],
    hints: ["Treat it like any scheduled event.", "You know when risk rises, not which way price goes."],
  },

  // 3.14.6 · Perpetual swaps and funding
  {
    id: "q-3.14.6-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 1,
    prompt: "You're short 40,000.00 vUSD of the LXC perpetual. Funding for this 8-hour interval is +0.02%. What do you receive, in vUSD? Use a minus sign if you pay.",
    numeric: { answer: 8, tolerance: 0.01, unit: "vUSD" },
    explanation: "Positive funding: longs pay shorts. 40,000.00 × 0.02% = 8.00, received by your short for this interval. If the rate turned negative, you'd pay instead.",
    lesson: "3.14.6",
    concepts: ["funding-rate"],
    hints: ["Positive funding flows from longs to shorts.", "Funding is charged on the position value.", "40,000.00 × 0.0002."],
    vary: {
      fields: { size: [10000, 200000, 5000], rate: [-0.05, 0.05, 0.005] },
      constraints: ["abs(rate) >= 0.005"],
      answer: "round(size * pct(rate), 2)",
      prompt: "You're short {size:2} vUSD of the LXC perpetual. Funding for this 8-hour interval is {rate:3}%. What do you receive, in vUSD? Use a minus sign if you pay.",
      explanation: "Positive funding: longs pay shorts; negative funding: shorts pay longs. {size:2} × {rate:3}% = {answer:2} for your short this interval.",
      hint: "{size:2} × {rate:3}%.",
    },
  },
  {
    id: "q-3.14.6-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "Funding on the LXC perpetual has been positive for three weeks, often 0.05% per 8 hours. What does that tell you?",
    options: [
      { id: "a", label: "Price will fall soon, so short now", rationale: "Crowded longs can stay crowded for weeks. Funding describes positioning; it doesn't time the turn." },
      { id: "b", label: "Shorts are paying longs to hold", rationale: "Positive funding flows from longs to shorts." },
      { id: "c", label: "The perpetual trades below its spot index", rationale: "Positive funding means the perpetual trades above the index; funding pulls it back down." },
      { id: "d", label: "Longs are crowded and paying to stay in: a condition that raises squeeze risk, not a signal" },
    ],
    correct: "d",
    explanation: "Positive funding means the perpetual trades above spot and longs pay to hold. Persistent, high funding marks a crowded long side, which can unwind fast. It's a condition to size for, not a trigger to trade against (grade C).",
    lesson: "3.14.6",
    concepts: ["funding-rate"],
    hints: ["Who pays when funding is positive?", "Does crowding tell you when it ends?"],
  },
  {
    id: "q-3.14.6-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 3,
    scenario: "You run a basis trade: long 50,000.00 of LXC spot, short 50,000.00 of the LXC perpetual. Funding, positive for months, flips to −0.05% per 8 hours.",
    prompt: "What happens to the trade?",
    options: [
      { id: "a", label: "Nothing: it's hedged", rationale: "The legs offset on price, not on funding. Funding is the trade's income, and it just changed sign." },
      { id: "b", label: "The short perpetual now pays funding: about 0.15% a day, 75.00, until the rate turns" },
      { id: "c", label: "It earns more: negative funding favours shorts", rationale: "Negative funding means shorts pay longs, and your perpetual leg is the short." },
      { id: "d", label: "The spot leg pays the funding", rationale: "Spot has no funding. Only the perpetual leg pays or receives it." },
    ],
    correct: "b",
    explanation: "The basis trade earns funding on its short perpetual while the rate is positive. At −0.05% the short pays: 50,000.00 × 0.05% × 3 = 75.00 a day. A carry trade works until the carry flips.",
    lesson: "3.14.6",
    concepts: ["funding-rate", "perpetual-swap"],
    hints: ["Which leg has funding at all?", "Negative funding: shorts pay longs."],
  },

  // 3.14.7 · Leverage, liquidation and cascades
  {
    id: "q-3.14.7-1",
    topic: "portfolio_exposure",
    kind: "numeric",
    difficulty: 2,
    prompt: "An isolated long at 2,000.00, 20× leverage, maintenance margin 0.5%. Approximate liquidation price?",
    numeric: { answer: 1910, tolerance: 1, unit: "" },
    explanation: "2,000.00 × (1 − 1 ÷ 20 + 0.005) = 2,000.00 × 0.955 = 1,910.00, a 4.5% fall. The margin covers 5%; liquidation comes when only the 0.5% maintenance is left.",
    lesson: "3.14.7",
    concepts: ["liquidation-price"],
    hints: ["Liquidation ≈ entry × (1 − 1 ÷ leverage + maintenance).", "1 ÷ 20 = 0.05.", "2,000.00 × 0.955."],
    vary: {
      fields: { entry: [1000, 5000, 50], lev: [5, 50, 5], mmr: [0.4, 1, 0.1] },
      constraints: ["1 / lev > pct(mmr)"],
      answer: "round(entry * (1 - 1 / lev + pct(mmr)), 2)",
      prompt: "An isolated long at {entry:2}, {lev}× leverage, maintenance margin {mmr:1}%. Approximate liquidation price?",
      explanation: "{entry:2} × (1 − 1 ÷ {lev} + {pct(mmr):3}) = {answer:2}. The margin covers {100 / lev:2}%; liquidation comes when only the {mmr:1}% maintenance is left.",
      hint: "{entry:2} × (1 − {1 / lev:3} + {pct(mmr):3}).",
    },
  },
  {
    id: "q-3.14.7-2",
    topic: "portfolio_exposure",
    kind: "mcq",
    difficulty: 2,
    prompt: "What does cross margin change, compared with isolated margin?",
    options: [
      { id: "a", label: "A losing position can draw on the whole account, so one loss can drain everything" },
      { id: "b", label: "Positions on cross margin can't be liquidated", rationale: "They can. Cross margin delays liquidation by sharing the balance, so when it comes, it can take more." },
      { id: "c", label: "Isolated margin guarantees that your stop fills", rationale: "Margin mode doesn't affect fills. Stops can slip in fast markets either way." },
      { id: "d", label: "Cross margin always means higher leverage", rationale: "Leverage is chosen separately. The mode decides which money backs each position." },
    ],
    correct: "a",
    explanation: "Isolated margin caps what one position can lose at its own margin. Cross margin lets every position use the account's balance: fewer liquidations from small moves, but a large one can take the whole account.",
    lesson: "3.14.7",
    concepts: ["liquidation-price", "leverage"],
    hints: ["Which money backs a position in each mode?", "Can one position reach the rest of the account?"],
  },
  {
    id: "q-3.14.7-3",
    topic: "portfolio_exposure",
    kind: "scenario",
    difficulty: 3,
    scenario: "During a crash, the venue closes your profitable LXC short at the market price, with a note: auto-deleveraging. You never hit a stop or a liquidation price.",
    prompt: "Why did it happen?",
    options: [
      { id: "a", label: "Your short reached its own liquidation price", rationale: "A short in profit during a crash is far from its liquidation price, and the note says ADL, not liquidation." },
      { id: "b", label: "Liquidated longs closed below zero equity and the insurance fund couldn't cover it, so the venue closed opposite winners" },
      { id: "c", label: "The venue took a fee for the profit", rationale: "Fees don't close positions. ADL is a loss-sharing step when the insurance fund runs short." },
      { id: "d", label: "Your stop triggered on the mark price", rationale: "No stop was hit. ADL closes positions by the venue's ranking, usually most profit and leverage first." },
    ],
    correct: "b",
    explanation: "In a cascade, some liquidations fill below zero equity. The insurance fund absorbs those losses; when it can't, the venue auto-deleverages, closing opposite positions, usually the most profitable and levered first. Even winners carry the venue's rules.",
    lesson: "3.14.7",
    concepts: ["liquidation-cascade"],
    hints: ["Who pays when a liquidation closes below zero?", "What happens when that reserve runs out?"],
  },

  // 3.14.8 · Bonds and rates for traders
  {
    id: "q-3.14.8-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "A bond has a duration of 4.5. Yields rise 0.5 percentage points. Approximate price change, in %?",
    numeric: { answer: -2.25, tolerance: 0.01, unit: "%" },
    explanation: "Price change ≈ −duration × yield change = −4.5 × 0.5 = −2.25%. Yields up, price down. Convexity makes the real move slightly better than the estimate.",
    lesson: "3.14.8",
    concepts: ["bond-duration"],
    hints: ["Price moves opposite to yield.", "−duration × change in yield, in points.", "−4.5 × 0.5."],
    vary: {
      fields: { dur: [2, 12, 0.5], dy: [-1.5, 1.5, 0.25] },
      constraints: ["abs(dy) >= 0.25"],
      answer: "round(-dur * dy, 2)",
      prompt: "A bond has a duration of {dur:1}. Yields change by {dy:2} percentage points. Approximate price change, in %?",
      explanation: "Price change ≈ −duration × yield change: {dur:1} × {abs(dy):2} = {abs(answer):2}%, opposite to the yield move, so {answer:2}%. Convexity makes the real move slightly better than the estimate.",
      hint: "{dur:1} × {abs(dy):2}, with the sign opposite to the yield move.",
    },
  },
  {
    id: "q-3.14.8-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "You're long 4 LXN contracts, DV01 80.00 vUSD each. Yields fall 12 basis points. Your P&L, in vUSD?",
    numeric: { answer: 3840, tolerance: 0, unit: "vUSD" },
    explanation: "4 × 80.00 = 320.00 per basis point. Yields fell, so prices rose: 320.00 × 12 = +3,840.00.",
    lesson: "3.14.8",
    concepts: ["dv01"],
    hints: ["Total DV01 = contracts × DV01 each.", "Yields down means bond prices up.", "4 × 80.00 × 12."],
    vary: {
      fields: { n: [2, 6, 1], bp: [-25, 25, 1] },
      constraints: ["abs(bp) >= 2"],
      answer: "-n * 80 * bp",
      prompt: "You're long {n} LXN contracts, DV01 80.00 vUSD each. Yields change by {bp} basis points (positive = rise). Your P&L, in vUSD?",
      explanation: "{n} × 80.00 = {n * 80:2} per basis point. Yields moved {bp} bp, and a long gains when yields fall and loses when they rise: {answer:2}.",
      hint: "{n * 80:2} per basis point × {abs(bp)} bp; check the sign.",
    },
  },
  {
    id: "q-3.14.8-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 3,
    prompt: "You trade only stocks. Why should a surprise jump in interest rates matter to you?",
    options: [
      { id: "a", label: "It doesn't: rates matter only to bond traders", rationale: "Rates set the discount rate in valuations and the cost of leverage. Stocks react within seconds of rate surprises." },
      { id: "b", label: "Higher rates always lift stocks, because they signal a strong economy", rationale: "Growth news can help, but a higher discount rate weighs on valuations. The sign depends on the regime (3.6.3)." },
      { id: "c", label: "Rates feed the discount rate, funding costs and futures fair value, so one surprise moves them all" },
      { id: "d", label: "Only through dividend yields", rationale: "Dividends are one channel. Valuations, CFD and margin funding, and index futures pricing all move with rates." },
    ],
    correct: "c",
    explanation: "A rate surprise changes the discount rate in every valuation, most for long-duration growth stocks, raises the cost of leveraged positions and moves index futures' fair value. Stocks react through all of these at once.",
    lesson: "3.14.8",
    concepts: ["bond-duration", "equity-duration"],
    hints: ["List what a stock price depends on that involves a rate.", "Think valuation, financing and futures."],
  },
];

// ─── Glossary terms ─────────────────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  // 3.14.1
  {
    id: "tick-value",
    term: "Tick value",
    definition: "The money one contract gains or loses when price moves one tick: tick size × contract multiplier. LXF's 0.25 tick at 50 vUSD a point is worth 12.50.",
    plain: "What the smallest price step is worth on one contract.",
    related: ["tick", "contract-multiplier", "point"],
    lesson: "3.14.1",
  },
  {
    id: "initial-margin",
    term: "Initial margin",
    definition: "The collateral an exchange or broker requires to open a futures position, set per contract and raised or lowered as volatility changes.",
    plain: "The deposit you need to open a futures trade.",
    related: ["maintenance-margin", "variation-margin", "margin"],
    lesson: "3.14.1",
  },
  {
    id: "maintenance-margin",
    term: "Maintenance margin",
    definition: "The minimum collateral needed to keep a futures position open. Below it comes a margin call, usually to top up to the initial margin, or the position is closed.",
    plain: "The level your margin can't fall below without a top-up.",
    related: ["initial-margin", "margin-call", "variation-margin"],
    lesson: "3.14.1",
  },
  {
    id: "variation-margin",
    term: "Variation margin",
    definition: "The gain or loss on a futures position, paid or received in cash after each day's settlement.",
    plain: "Each day's profit or loss, settled in cash that evening.",
    related: ["initial-margin", "maintenance-margin", "futures"],
    lesson: "3.14.1",
    aka: ["Daily settlement"],
  },
  {
    id: "micro-contract",
    term: "Micro contract",
    definition: "A smaller version of a futures contract, often a tenth of the standard size, on the same underlying and at the same price.",
    plain: "A futures contract a tenth the size of the standard one, for finer sizing.",
    related: ["futures", "contract-multiplier", "tick-value"],
    lesson: "3.14.1",
    aka: ["Micro"],
  },
  // 3.14.2
  {
    id: "expiry",
    term: "Expiry",
    definition: "The date a futures or options contract ends and is settled, in cash or by delivery.",
    plain: "The last day a contract exists.",
    related: ["first-notice-day", "physical-delivery", "futures"],
    lesson: "3.14.2",
    aka: ["Expiration"],
  },
  {
    id: "first-notice-day",
    term: "First notice day",
    definition: "The first day a long in a physically delivered futures contract can be assigned delivery. Most traders close or roll before it.",
    plain: "The day a long can start being handed the actual goods.",
    related: ["physical-delivery", "expiry", "calendar-spread"],
    lesson: "3.14.2",
    aka: ["FND"],
  },
  {
    id: "calendar-spread",
    term: "Calendar spread",
    definition: "Buying one expiry and selling another of the same futures contract as a single order. A roll is a calendar spread, priced at the gap between the two months.",
    plain: "One order that sells one month and buys another.",
    related: ["expiry", "continuous-contract"],
    lesson: "3.14.2",
  },
  {
    id: "continuous-contract",
    term: "Continuous contract",
    definition: "A long price series built by joining successive futures contracts at each roll, usually back-adjusted to remove the roll gaps.",
    plain: "One long chart stitched from many short-lived contracts.",
    related: ["back-adjustment", "calendar-spread", "expiry"],
    lesson: "3.14.2",
  },
  {
    id: "back-adjustment",
    term: "Back-adjustment",
    definition: "Shifting every price before a roll by the roll gap, or scaling it by the price ratio, so a continuous chart has no false jumps. Recent prices stay as traded.",
    plain: "Moving old prices so the chart doesn't jump at each roll.",
    related: ["continuous-contract", "look-ahead-bias"],
    lesson: "3.14.2",
  },
  // 3.14.3
  {
    id: "contango",
    term: "Contango",
    definition: "A futures curve with later contracts priced above spot, usually because storage, financing and insurance cost money. A rolled long loses as each contract converges down to spot.",
    plain: "Futures above spot: a rolled long position loses over time.",
    related: ["backwardation", "roll-yield", "cost-of-carry"],
    lesson: "3.14.3",
  },
  {
    id: "backwardation",
    term: "Backwardation",
    definition: "A futures curve with later contracts priced below spot, usually when inventories are low and holding the commodity now earns a premium. A rolled long gains as contracts converge up.",
    plain: "Futures below spot: a rolled long gains as they rise toward it.",
    related: ["contango", "convenience-yield", "roll-yield"],
    lesson: "3.14.3",
  },
  {
    id: "roll-yield",
    term: "Roll yield",
    definition: "The gain or loss from rolling futures as each contract converges to spot, even when spot doesn't move: about spot ÷ future − 1 per roll.",
    plain: "What rolling futures earns or costs you while spot stands still.",
    related: ["contango", "backwardation", "carry"],
    lesson: "3.14.3",
  },
  {
    id: "convenience-yield",
    term: "Convenience yield",
    definition: "The benefit of holding the physical commodity rather than a future, such as keeping a plant running; high when inventories are low.",
    plain: "The value of having the goods in hand now, highest when they're scarce.",
    related: ["backwardation", "cost-of-carry"],
    lesson: "3.14.3",
  },
  {
    id: "cost-of-carry",
    term: "Cost of carry",
    definition: "The cost of holding an asset until a future date: financing plus storage and insurance, minus any income. Fair future ≈ spot + cost of carry − convenience yield.",
    plain: "What it costs to hold something until later: interest, storage and insurance.",
    related: ["contango", "convenience-yield", "overnight-financing"],
    lesson: "3.14.3",
  },
  // 3.14.4
  {
    id: "limit-move",
    term: "Limit move",
    definition: "A move to the exchange's daily price limit, beyond which no trades are allowed that day. A market locked at the limit may not trade at all, so stops can't fill.",
    plain: "A day when price hits the exchange's maximum move and trading stops there.",
    related: ["gap", "stop-loss"],
    lesson: "3.14.4",
    aka: ["Limit up", "Limit down", "Locked limit"],
  },
  {
    id: "inventory-report",
    term: "Inventory report",
    definition: "Scheduled data on how much of a commodity is held in storage, such as weekly oil and gas stock figures. Prices react to the surprise against expectations.",
    plain: "A regular count of how much oil, gas or grain is in storage.",
    related: ["surprise", "consensus", "economic-calendar"],
    lesson: "3.14.4",
  },
  {
    id: "physical-delivery",
    term: "Physical delivery",
    definition: "Settling a futures contract by handing over the commodity itself at expiry, rather than paying cash.",
    plain: "Ending a contract by actually delivering the barrels or bushels.",
    related: ["first-notice-day", "expiry"],
    lesson: "3.14.4",
    aka: ["Physical settlement"],
  },
  // 3.14.5
  {
    id: "stablecoin",
    term: "Stablecoin",
    definition: "A crypto token designed to hold a fixed value, usually one US dollar, backed by reserves or by an algorithm. It can lose that value.",
    plain: "A crypto token meant to stay worth one dollar.",
    related: ["de-peg", "cryptocurrency"],
    lesson: "3.14.5",
  },
  {
    id: "de-peg",
    term: "De-peg",
    definition: "A stablecoin trading away from its fixed value, usually below it, when holders doubt its reserves or its design.",
    plain: "When a 'stable' coin stops being worth its dollar.",
    related: ["stablecoin", "counterparty-risk"],
    lesson: "3.14.5",
  },
  {
    id: "self-custody",
    term: "Self-custody",
    definition: "Holding your own crypto private keys in a wallet you control, instead of leaving coins with an exchange. It removes venue risk and adds the risk of losing the keys.",
    plain: "Keeping your own keys: no exchange can freeze your coins, and nobody can recover lost keys.",
    related: ["counterparty-risk", "cryptocurrency"],
    lesson: "3.14.5",
  },
  {
    id: "token-unlock",
    term: "Token unlock",
    definition: "A scheduled release of previously locked tokens, such as team or investor allocations, into the tradable supply.",
    plain: "A set date when new tokens can be sold into the market.",
    related: ["cryptocurrency", "economic-calendar"],
    lesson: "3.14.5",
  },
  {
    id: "counterparty-risk",
    term: "Counterparty risk",
    definition: "The risk that the venue, broker or custodian holding your assets fails, freezes withdrawals or doesn't pay.",
    plain: "The risk that the firm holding your money or coins fails.",
    related: ["counterparty", "segregated-funds", "self-custody"],
    lesson: "3.14.5",
  },
  // 3.14.6
  {
    id: "perpetual-swap",
    term: "Perpetual swap",
    definition: "A futures-like contract with no expiry, mostly on crypto, kept near its spot index by periodic funding payments between longs and shorts.",
    plain: "A crypto future that never expires.",
    related: ["funding-rate", "mark-price", "futures"],
    lesson: "3.14.6",
    aka: ["Perpetual", "Perp"],
  },
  {
    id: "funding-rate",
    term: "Funding rate",
    definition: "The periodic rate exchanged between longs and shorts in a perpetual swap, usually every 8 hours and charged on position value. When positive, longs pay shorts.",
    plain: "The fee longs and shorts pay each other every few hours to keep a perpetual near spot.",
    related: ["perpetual-swap", "premium-index", "overnight-financing"],
    lesson: "3.14.6",
    aka: ["Funding"],
  },
  {
    id: "mark-price",
    term: "Mark price",
    definition: "A reference price built from a spot index across venues, used to value perpetual and futures positions and to trigger liquidations.",
    plain: "The fair price a venue uses to value your position, instead of the last trade.",
    related: ["perpetual-swap", "liquidation-price", "last-price"],
    lesson: "3.14.6",
  },
  {
    id: "premium-index",
    term: "Premium index",
    definition: "How far a perpetual swap trades above or below its spot index, as a percentage; the main input to the funding rate.",
    plain: "How much the perpetual trades above or below spot.",
    related: ["funding-rate", "perpetual-swap"],
    lesson: "3.14.6",
  },
  // 3.14.7
  {
    id: "liquidation-price",
    term: "Liquidation price",
    definition: "The price at which a venue force-closes a leveraged position because its margin has fallen to the maintenance level. For an isolated long, about entry × (1 − 1 ÷ leverage + maintenance rate).",
    plain: "The price where the venue closes your trade for you.",
    related: ["isolated-margin", "mark-price", "margin-close-out"],
    lesson: "3.14.7",
  },
  {
    id: "isolated-margin",
    term: "Isolated margin",
    definition: "A margin mode in which each position has its own margin; a liquidation can take only that margin.",
    plain: "Each trade's margin stands alone, so one trade can't drain the account.",
    related: ["cross-margin", "liquidation-price"],
    lesson: "3.14.7",
  },
  {
    id: "cross-margin",
    term: "Cross margin",
    definition: "A margin mode in which all positions share the account's balance: fewer liquidations from small moves, but one large loss can take the whole account.",
    plain: "All your trades share one pot of margin.",
    related: ["isolated-margin", "liquidation-price", "margin"],
    lesson: "3.14.7",
  },
  {
    id: "insurance-fund",
    term: "Insurance fund",
    definition: "A venue's reserve that absorbs losses when liquidated positions close below zero equity, so traders on the other side still get paid.",
    plain: "The venue's safety pot for liquidations that go below zero.",
    related: ["auto-deleveraging", "liquidation-price"],
    lesson: "3.14.7",
  },
  {
    id: "auto-deleveraging",
    term: "Auto-deleveraging",
    definition: "When the insurance fund can't cover a liquidation that closed below zero equity, the venue closes opposite positions, usually ranked by profit and leverage, to cover it.",
    plain: "The venue closing winners' positions to cover losses it can't absorb.",
    related: ["insurance-fund", "liquidation-price"],
    lesson: "3.14.7",
    aka: ["ADL"],
  },
  // 3.14.8
  {
    id: "duration",
    term: "Duration",
    definition: "The approximate percentage change in a bond's price for a one-percentage-point change in its yield (modified duration). A duration of 8.95 means about −8.95% if yields rise one point.",
    plain: "How much a bond's price moves, in %, when yields move one point.",
    related: ["yield", "dv01", "convexity"],
    lesson: "3.14.8",
    aka: ["Modified duration"],
  },
  {
    id: "dv01",
    term: "DV01",
    definition: "The change in a position's value for a one-basis-point (0.01%) move in yield: about duration × value × 0.0001.",
    plain: "Money gained or lost per 0.01% move in yields.",
    related: ["duration", "basis-point", "yield"],
    lesson: "3.14.8",
    aka: ["Dollar value of a basis point", "PVBP"],
  },
  {
    id: "convexity",
    term: "Convexity",
    definition: "The curvature of a bond's price–yield relation: duration's straight-line estimate overstates price falls and understates rises, more so for large moves.",
    plain: "Bond prices fall a little less, and rise a little more, than duration says.",
    related: ["duration", "yield"],
    lesson: "3.14.8",
  },
];

// ─── Concepts ───────────────────────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "futures-contract",
    name: "Futures contract",
    category: "market_fundamentals",
    summary: "A standardised, exchange-cleared agreement to buy or sell an underlying at a future date.",
    body: [
      "A futures contract fixes everything but the price: the underlying, the size, the tick and the expiry. A clearing house stands between buyer and seller, and the contract's multiplier turns points into money.",
      "You post margin, a small share of the contract's value, so leverage is built in. Size in whole contracts from the stop: risk per contract = stop in points × value per point. When one contract is too big, a micro, a tenth of the size, gives finer steps.",
    ],
    example: "Account 100,000.00, risk 1,000.00, stop 30 points. One LXF risks 30 × 50 = 1,500.00: too much. One LXM risks 150.00, so 6 LXM risk 900.00.",
    related: ["mark-to-market", "point-value", "leverage", "position-sizing"],
    missions: [],
    lessons: ["3.14.1"],
  },
  {
    id: "mark-to-market",
    name: "Mark-to-market",
    category: "portfolio_exposure",
    summary: "Daily settlement of futures gains and losses in cash, through variation margin.",
    body: [
      "Each evening the exchange values every position at the settlement price and moves the day's gain or loss in cash. Losses come out of your margin; if it falls below the maintenance level, you top up to the initial level or the position is closed.",
      "The exchange can raise margins when volatility jumps, so a margin call can come even when price hasn't moved. Margin is collateral, not risk: the stop and the size set the risk.",
    ],
    example: "2 LXF on 25,000.00 of margin, maintenance 20,000.00. Day 1: −37.50 points, −3,750.00, 21,250.00 left. Day 2: −40 points, −4,000.00, 17,250.00: margin call, add 7,750.00.",
    related: ["futures-contract", "margin-close-out", "leverage"],
    missions: [],
    lessons: ["3.14.1"],
  },
  {
    id: "contract-roll",
    name: "Contract roll",
    category: "market_fundamentals",
    summary: "Closing an expiring futures contract and opening the next one, usually as one calendar-spread order.",
    body: [
      "Futures expire, so a position held longer than one contract must roll: sell the expiring month and buy the next. One calendar-spread order does both legs at once, crossing one bid/ask instead of two, with no risk of price moving between the legs.",
      "Roll when trading moves to the next month, and always before first notice day on physically delivered contracts. After the roll, move the stop and target by the spread so the risk stays the same.",
    ],
    example: "Long LXF March at 5,000.00, stop 4,960.00. Roll by spread to June at 5,030.00 (spread 30.00): the June stop goes at 4,990.00, still 40 points away.",
    related: ["continuous-contract", "term-structure", "futures-contract"],
    missions: [],
    lessons: ["3.14.2"],
  },
  {
    id: "continuous-contract",
    name: "Continuous contract",
    category: "technical_analysis",
    summary: "A long price series stitched from successive futures contracts and adjusted for roll gaps.",
    body: [
      "Each contract lives a few months, so long charts join them at the rolls. The two contracts trade at different prices, so an unadjusted join leaves a gap no holder ever had, and breakout rules and indicators trade it.",
      "Back-adjustment adds each roll gap to every earlier price, or scales earlier prices by the ratio, so the series runs on smoothly. Use it for signals and backtests; use the real contract's prices for fills, stops and P&L.",
    ],
    example: "March closes at 5,000.00 and June at 5,030.00 on roll day. A pre-roll close of 4,962.50 becomes 4,992.50; proportionally, 4,962.50 × 5,030 ÷ 5,000 = 4,992.28.",
    related: ["adjusted-price-data", "contract-roll", "look-ahead-bias"],
    missions: [],
    lessons: ["3.14.2"],
  },
  {
    id: "term-structure",
    name: "Term structure",
    category: "market_fundamentals",
    summary: "The curve of futures prices across expiries, in contango or in backwardation.",
    body: [
      "Plot futures prices by expiry and you get the term structure. In contango later contracts sit above spot, because storage, financing and insurance cost money. In backwardation they sit below, usually when inventories are low and the commodity in hand earns a convenience yield.",
      "A rough fair price: future ≈ spot + cost of carry − convenience yield. The curve also prices known seasons, so a seasonal pattern pays only when the season beats what the curve expected.",
    ],
    example: "Spot 70.00, financing 6% a year (0.35 a month), storage and insurance 0.65 a month: a fair one-month future of 71.00, a contango curve.",
    related: ["roll-yield", "contract-roll", "commodity-drivers"],
    missions: [],
    lessons: ["3.14.3", "3.14.4"],
  },
  {
    id: "roll-yield",
    name: "Roll yield",
    category: "market_fundamentals",
    summary: "The gain or loss from rolling futures as they converge to spot, even when spot does not move.",
    body: [
      "A future converges to spot as it expires. A long that rolls in contango keeps buying above spot and losing the difference; in backwardation it buys below spot and gains it. Per roll, roll yield ≈ spot ÷ future − 1.",
      "It explains why commodity ETFs that hold and roll futures, and long products on VIX futures, can fall while spot is flat. It's a form of carry, and it depends on the curve staying put, which it often doesn't.",
    ],
    example: "Spot stays at 70.00 and the one-month future at 71.00. Each roll returns 70 ÷ 71 − 1 = −1.41%; twelve rolls compound to −15.7%.",
    related: ["term-structure", "carry-trade", "contract-roll"],
    missions: [],
    lessons: ["3.14.3"],
  },
  {
    id: "commodity-drivers",
    name: "Commodity drivers",
    category: "market_fundamentals",
    summary: "Supply shocks, storage, inventories and scheduled reports that move commodity prices.",
    body: [
      "Each commodity family has its own drivers: OPEC+ output and geopolitics for oil, weather and disease for crops and livestock, heating demand for natural gas, real yields and official buying for gold. Supply shocks arrive as jumps, and volatility stays high after them.",
      "Scheduled reports, such as weekly oil stocks and monthly crop estimates, move prices on the surprise. Daily price limits can lock a market and skip your stop, so positions held through reports are sized for the worst plausible gap.",
    ],
    example: "Long at 500.00, stop 485.00 (1R = 15.00). Two 5% limit-down days lock the market down to 451.25: a 48.75 loss, 3.25R.",
    related: ["commodities-in-macro", "term-structure", "gap-risk", "news-surprise"],
    missions: [],
    lessons: ["3.14.4"],
  },
  {
    id: "crypto-market-structure",
    name: "Crypto market structure",
    category: "market_fundamentals",
    summary: "A 24/7 market with fragmented venues, thin weekends, no closing auction and very high volatility.",
    body: [
      "Crypto never closes: there's no closing auction, and weekends and quiet hours are thin, so spreads widen and stops slip. Trading is split across many venues, some lightly regulated, so prices and reported volumes differ from one to the next.",
      "Volatility is several times that of large stock indices, so the same 1% risk means a much smaller position. Annualise with √365, since it trades every day. In sell-offs, coins tend to fall together.",
    ],
    example: "Risk 100.00 with a 2-ATR stop. LABX (ATR 1.5%): 3,300.00 of stock. LXC (ATR 4%): about 1,250.00. A 4% daily move annualises to about 76%.",
    related: ["counterparty-risk", "percent-volatility-sizing", "weekend-and-holiday-risk", "venue-fragmentation"],
    missions: [],
    lessons: ["3.14.5"],
  },
  {
    id: "counterparty-risk",
    name: "Counterparty risk",
    category: "risk_management",
    summary: "The risk that the venue, broker or custodian holding your assets fails or freezes them.",
    body: [
      "Coins or cash held at a venue are a claim on that firm. If it fails, withdrawals freeze and you queue with its creditors. Segregation rules and protection schemes vary, and crypto that isn't a security falls outside the US SIPC scheme.",
      "Counterparty risk is per venue, so cap how much sits on any one. Self-custody removes venue risk and adds your own: lost keys can't be recovered.",
    ],
    example: "10,000.00 held as 4,000.00, 3,000.00 and 2,000.00 on three venues plus 1,000.00 self-custodied: one failure can cost 40%. Capping each venue at 2,500.00 limits it to 25%.",
    related: ["broker-due-diligence", "crypto-market-structure", "negative-balance-protection"],
    missions: [],
    lessons: ["3.14.5"],
  },
  {
    id: "perpetual-swap",
    name: "Perpetual swap",
    category: "market_fundamentals",
    summary: "A futures-like contract with no expiry, kept near spot by periodic funding payments.",
    body: [
      "A perpetual swap never expires, so it never has to converge to spot. Funding payments between longs and shorts do that job: when the perpetual trades above its spot index, longs pay shorts, and the reverse below it.",
      "Positions are valued at a mark price built from a multi-venue index, which also triggers liquidations, so a wick on one venue's last price doesn't liquidate on its own. Leverage, funding and liquidation rules differ by venue.",
    ],
    example: "Last price on one venue wicks to 28,900 while the mark price dips only to 29,780: a long with liquidation at 29,200, measured on mark price, survives.",
    related: ["funding-rate", "liquidation-price", "futures-contract"],
    missions: [],
    lessons: ["3.14.6"],
  },
  {
    id: "funding-rate",
    name: "Funding rate",
    category: "market_fundamentals",
    summary: "The periodic payment between longs and shorts in a perpetual swap; when positive, longs pay shorts.",
    body: [
      "Funding is charged on position value, usually every 8 hours. 0.01% per 8 hours is 10.95% a year on the position, and leverage multiplies it as a share of margin. The rate changes every interval with the perpetual's premium to spot.",
      "Persistently positive funding marks crowded longs paying to stay in: a condition, not a trigger (grade C). A basis trade, long spot and short perpetual, earns funding while it's positive and pays when it flips.",
    ],
    example: "A 3× long, 30,000.00 on 10,000.00 of margin, held 14 days at +0.01% every 8 hours: 30,000.00 × 0.01% × 3 × 14 = 126.00.",
    related: ["perpetual-swap", "carry-trade", "overnight-financing"],
    missions: [],
    lessons: ["3.14.6"],
  },
  {
    id: "liquidation-price",
    name: "Liquidation price",
    category: "portfolio_exposure",
    summary: "The price at which a leveraged position is force-closed because margin falls below the maintenance level.",
    body: [
      "For an isolated long, liquidation ≈ entry × (1 − 1 ÷ leverage + maintenance margin rate); venues' exact formulas differ. Higher leverage pulls it toward entry: at 50× it's only 1.5% away.",
      "Set the stop first, size from it, then choose leverage: it changes only the margin. Keep liquidation well beyond the stop (this course uses twice the distance), because a wick on the mark price plus a liquidation fee can beat your stop.",
    ],
    example: "LXC at 30,000, stop 3%, risk 100.00: 3,333.33 of LXC. At 10× liquidation is 27,150 (−9.5%), well past the stop; at 25× it's 28,950, only 150 below the stop.",
    related: ["leverage", "effective-leverage", "margin-close-out", "liquidation-cascade"],
    missions: [],
    lessons: ["3.14.7"],
  },
  {
    id: "liquidation-cascade",
    name: "Liquidation cascade",
    category: "risk_management",
    summary: "Forced selling that triggers more liquidations in a self-reinforcing chain.",
    body: [
      "When price falls into a band of liquidation prices, the venue sells those positions at market. The selling pushes price into the next band, and the chain feeds itself, like a stop cascade with leverage.",
      "When liquidations close below zero equity, an insurance fund covers the gap; if it runs out, auto-deleveraging closes profitable opposite positions. Cross margin delays liquidations but can let one loss take the whole account.",
    ],
    example: "From 30,000, longs at 50× liquidate near 29,550 (−1.5%) and at 25× near 28,950 (−3.5%). A 2% drop clears the 50× layer, and its forced selling can carry price on to the next.",
    related: ["liquidation-price", "stop-cascade", "leverage"],
    missions: [],
    lessons: ["3.14.7"],
  },
  {
    id: "bond-duration",
    name: "Bond duration",
    category: "market_fundamentals",
    summary: "The approximate percentage price change of a bond for a one-point change in yield.",
    body: [
      "Duration turns a yield move into a price move: price change ≈ −duration × yield change. Longer maturities and lower coupons mean higher duration and more rate risk.",
      "It's a straight-line estimate. Convexity bends the real curve: falls are a little smaller and rises a little larger than duration says, which matters for big moves.",
    ],
    example: "A 10-year note with a 2.16% coupon at 100.00 has a duration of 8.95. Yields +1 point: estimate −8.95%, exact −8.52%. Yields −1 point: estimate +8.95%, exact +9.42%.",
    related: ["bond-price-yield", "dv01", "yield-curve", "equity-duration"],
    missions: [],
    lessons: ["3.14.8"],
  },
  {
    id: "dv01",
    name: "DV01",
    category: "risk_management",
    summary: "The change in a position's money value for a one-basis-point move in yield.",
    body: [
      "DV01 ≈ duration × position value × 0.0001. It adds across positions, so it shows a book's total rate risk in money, and it sizes rate trades the way a stop sizes a stock trade.",
      "Futures carry their own DV01 per contract. Curve trades weight each leg by DV01 so both legs move the same money per basis point.",
    ],
    example: "1,000,000.00 of a note with duration 8.95: DV01 895.00, so a 25 bp rise costs 22,375.00. Three LXN at 80.00 each lose 2,400.00 on 10 bp; one loses 800.00.",
    related: ["bond-duration", "position-sizing", "risk-per-trade"],
    missions: [],
    lessons: ["3.14.8"],
  },
];

/** Unit 3.14 · Instruments II: futures, commodities, crypto, bonds (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_3_14: UnitContent = {
  lessons: [L3141, L3142, L3143, L3144, L3145, L3146, L3147, L3148],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
