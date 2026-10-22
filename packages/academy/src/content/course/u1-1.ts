import type { CandleData, ChartSpec, Concept, GlossaryTerm, Lesson, Question, UnitContent, UnitIntro } from "../../types";

/** One candle, in price units with 2 decimals. */
const k = (o: number, h: number, l: number, c: number): CandleData => ({ o, h, l, c });

// ─── Chart data ─────────────────────────────────────────────────────────────

/** A figure with no price history: one flat candle sits on the mid. */
const flat = (mid: number, range: [number, number], describe: string, layers: ChartSpec["layers"] = []): ChartSpec => ({
  candles: [k(mid, mid, mid, mid)],
  range,
  layers,
  describe,
});

/** 1.1.2 B2: two possible hours from a mid of 100.00, one up to 102.00, one down to 98.00. */
const L112_PATHS: ChartSpec = {
  candles: [k(100.0, 102.0, 100.0, 102.0), k(100.0, 100.0, 98.0, 98.0)],
  range: [97.6, 102.4],
  describe: "Two candles from a mid of 100.00: the left one rises to 102.00, the right one falls to 98.00.",
};

/** 1.1.3 hook, B2 and B8: ten hours rising to a mid high of 100.97 (index 7), never touching 101.00. */
const L113_RISE: CandleData[] = [
  k(100.1, 100.22, 100.04, 100.18),
  k(100.18, 100.31, 100.12, 100.27),
  k(100.27, 100.35, 100.15, 100.21),
  k(100.21, 100.44, 100.18, 100.4),
  k(100.4, 100.58, 100.33, 100.52),
  k(100.52, 100.66, 100.45, 100.61),
  k(100.61, 100.83, 100.57, 100.78),
  k(100.78, 100.97, 100.72, 100.88),
  k(100.88, 100.92, 100.7, 100.74),
  k(100.74, 100.81, 100.62, 100.66),
];
const L113_SHORT_STOP = { kind: "level", price: 101.0, role: "stop", label: "SHORT STOP 101.00" } as const;
const L113_CHART: ChartSpec = {
  candles: L113_RISE,
  range: [100.0, 101.2],
  layers: [L113_SHORT_STOP],
  describe: "Ten one-hour candles rising from 100.10 to a high of 100.97, then easing to 100.66. A short's stop sits at 101.00, just above the high.",
};

/** 1.1.3 B7: eight hours drifting down to a mid low of 99.64, above a long's stop at 99.50. */
const L113_FALL: ChartSpec = {
  candles: [
    k(100.2, 100.26, 100.08, 100.12),
    k(100.12, 100.18, 99.98, 100.03),
    k(100.03, 100.11, 99.96, 100.07),
    k(100.07, 100.09, 99.88, 99.92),
    k(99.92, 99.97, 99.8, 99.84),
    k(99.84, 99.9, 99.74, 99.86),
    k(99.86, 99.88, 99.7, 99.75),
    k(99.75, 99.81, 99.64, 99.7),
  ],
  range: [99.3, 100.3],
  layers: [{ kind: "level", price: 99.5, role: "stop", label: "LONG STOP 99.50" }],
  describe: "Eight one-hour candles drifting down from 100.20 to a low of 99.64. A long's stop sits at 99.50.",
};

// ─── Lessons ────────────────────────────────────────────────────────────────

const L112: Lesson = {
  id: "1.1.2",
  title: "Long and short",
  topic: "market_fundamentals",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "A long buys first and sells later; a short sells first and buys back later. Each opens on one side of the spread and closes on the other.",
  objectives: [
    "Calculate the P&L of a long and of a short from the entry and exit fills.",
    "Name the price, bid or ask, that opens and closes a long and a short.",
    "Explain why a short's possible loss has no fixed ceiling while a long's is limited to the price falling to zero.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bearish", label: "Arena: bearish" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "1.1",
    courseId: "1.1.2",
    bridge: "In 1.1.1 you saw that a buy pays the ask and a sale gets the bid. Here you use both in either order: buy first and sell later, or sell first and buy back later, so a fall can pay too.",
    hook: {
      prompt: "LABX is at 100.00 and you think it will fall. Can you make money from a fall?",
      control: {
        kind: "choice",
        choices: [
          { id: "no", label: "No, only by buying" },
          { id: "short", label: "Yes: sell first, buy back later" },
          { id: "options", label: "Only with options" },
        ],
        answer: "short",
      },
      compare: "You picked {yours}. A short sells first and buys back later, so it gains when price falls. The Arena lets you short LABX.",
      concept: "long-and-short",
    },
    learn: [
      {
        kind: "explain",
        title: "Two directions",
        text: "A [[long]] buys first and sells later, so it gains if price rises. A [[short]] sells first and buys back later, so it gains if price falls. To sell shares you don't own, a stock trader borrows them; a contract can simply be sold. Once the position is closed, you're [[flat]] again.",
      },
      {
        kind: "figure",
        title: "Same move, either way",
        figure: {
          kind: "chart",
          chart: L112_PATHS,
          steps: [
            { text: "Two possible hours from a mid of 100.00: up to 102.00, or down to 98.00." },
            {
              text: "A long buys at the ask, 100.05, and sells at the bid, 101.95: +1.90 a unit.",
              layers: [
                { kind: "marker", index: 0, price: 100.05, label: "BUY 100.05", role: "accent" },
                { kind: "marker", index: 0, price: 101.95, label: "SELL 101.95", role: "accent" },
                { kind: "bracket", from: 100.05, to: 101.95, index: 0, label: "LONG +1.90", role: "up" },
              ],
            },
            {
              text: "A short sells at the bid, 99.95, and buys back at the ask, 98.05: +1.90 a unit.",
              layers: [
                { kind: "marker", index: 1, price: 99.95, label: "SELL 99.95", role: "accent" },
                { kind: "marker", index: 1, price: 98.05, label: "BUY BACK 98.05", role: "accent" },
                { kind: "bracket", from: 98.05, to: 99.95, index: 1, label: "SHORT +1.90", role: "up" },
              ],
            },
            { text: "Same 2.00 move of the mid, same 0.10 lost to the spread. Direction doesn't change the cost." },
          ],
        },
      },
      {
        kind: "match",
        prompt: "LABX mid is 100.00: bid 99.95, ask 100.05. Sort each action by the quote it fills at.",
        columns: ["Action", "Fills at"],
        pairs: [
          { left: "Open a long", right: "Ask, 100.05", wrong: "Opening a long is a buy, and buys pay the ask." },
          { left: "Close a long", right: "Bid, 99.95", wrong: "Closing a long is a sale, and sales get the bid." },
          { left: "Open a short", right: "Bid, 99.95", wrong: "Opening a short is a sale, so it gets the bid." },
          { left: "Close a short", right: "Ask, 100.05", wrong: "Closing a short is a buy, so it pays the ask." },
        ],
        correct: "Right. Every buy pays the ask and every sale gets the bid, whichever direction you trade.",
        concept: "long-and-short",
      },
      {
        kind: "worked",
        title: "A short, line by line",
        lines: [
          "Short 30 units at the bid, 99.95.",
          "The mid falls to 97.00; you buy back at the ask, 97.05.",
          "P&L before commission: 30 × (99.95 − 97.05) = ?",
        ],
        ask: {
          answer: 87.0,
          tolerance: 0,
          unit: "vUSD",
          feedback: [
            { value: 90.0, text: "That uses the mids, 100.00 − 97.00. A short sells at the bid and buys back at the ask." },
            { value: 88.5, text: "That buys back at the mid, 97.00. A short closes at the ask, 97.05." },
            { value: -87.0, text: "Check the sign: you sold higher than you bought back, so the short gained." },
          ],
          correct: "Right: 2.90 a unit on 30 units.",
        },
        after: "Commission: 1.50 on the sale and 1.46 on the buy-back. Net: 87.00 − 2.96 = +84.04.",
        concept: "long-and-short",
      },
      {
        kind: "predict",
        title: "Which can lose more?",
        prompt: "You're long from 100.05, or short from 99.95. Which position could lose more than 150.00 a unit?",
        control: {
          kind: "choice",
          choices: [
            { id: "long", label: "The long", feedback: "A long loses as price falls, and price can't fall below zero. The most it can lose is the 100.05 it paid." },
            { id: "short", label: "The short", feedback: "Right. Nothing stops a price from rising, so nothing caps a short's loss." },
            { id: "both", label: "Both", feedback: "Only one of them can. A long can't lose more than 100.05 a unit: price stops at zero." },
            { id: "neither", label: "Neither", feedback: "The short can. If the mid reached 300.00, buying back at 300.05 would lose 200.10 a unit." },
          ],
          answer: "short",
        },
        reveal: "A long's worst case is price falling to zero: −100.05 a unit. A short loses whatever price rises: −100.10 a unit if the mid doubles to 200.00, −200.10 at 300.00. There is no fixed ceiling.",
        concept: "long-and-short",
      },
      {
        kind: "explain",
        title: "Shorts on LABX",
        text: "Shorting a stock means borrowing shares, and the lender charges a [[borrow-fee]] for as long as the short stays open. A later unit covers it. On LABX a short is a long in reverse: no borrowing, no fee. Its stop sits above the entry and triggers when the [[ask]] reaches it.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Sized from a stop, a short risks the same 1% as a long. Without a stop, its loss has no ceiling.",
      },
      {
        kind: "predict",
        title: "Your turn: a short's P&L",
        prompt: "You're short 40 units from 99.95. Drag the mid until your P&L before commission is exactly +40.00.",
        control: {
          kind: "slider",
          min: 98.5,
          max: 100.0,
          step: 0.05,
          start: 100.0,
          answer: 98.9,
          tolerance: 0,
          feedback: [
            { from: 98.95, to: 98.95, text: "Close. At a mid of 98.95 you'd buy back at the ask, 99.00: +38.00. One step lower." },
            { from: 99.0, to: 100.0, text: "Not there yet. A short buys back at the ask, mid + 0.05, and you need it 1.00 below 99.95." },
            { from: 98.5, to: 98.85, text: "Too far: at that mid the short makes more than 40.00. You need exactly 1.00 a unit." },
          ],
        },
        figure: {
          kind: "chart",
          chart: flat(100.0, [98.6, 100.2], "The mid at 100.00 when you sold short at the bid, 99.95.", [{ kind: "level", price: 99.95, role: "entry", label: "SHORT 99.95" }]),
          steps: [
            {
              text: "At a mid of 98.90 the ask is 98.95: that's where the short buys back.",
              layers: [{ kind: "level", price: 98.95, role: "neutral", label: "ASK 98.95 · BUY BACK", chip: true }],
            },
            {
              text: "40 × (99.95 − 98.95) = 40 × 1.00 = +40.00, before commission.",
              layers: [{ kind: "bracket", from: 98.95, to: 99.95, label: "+1.00 A UNIT", role: "up" }],
            },
          ],
        },
        reveal: "A mid of 98.90 puts the ask at 98.95, 1.00 a unit below where you sold. Commission of 2.00 + 1.98 would leave +36.02.",
        concept: "long-and-short",
      },
    ],
    check: ["q-1.1.2-1", "q-1.1.2-2", "q-1.1.2-3"],
    recap: {
      next: "Next, 1.1.3: which of these prices a chart draws, and which one triggers your stop.",
      takeaways: [
        "A long gains when price rises, a short when it falls: P&L = units × (sell − buy).",
        "Longs open at the ask and close at the bid; shorts open at the bid and close at the ask.",
        "A long can lose at most its price. A short's loss has no ceiling, so it needs a stop.",
      ],
    },
  },
};

const L113: Lesson = {
  id: "1.1.3",
  title: 'Which price is "the price"?',
  topic: "market_fundamentals",
  level: "beginner",
  tier: "free",
  minutes: 5,
  summary: "Last, bid, ask and mid are different prices: a chart plots one of them, and your stops trigger on the quote that closes the position.",
  objectives: [
    "Distinguish last, bid, ask and mid, and say which one a chart is drawn from.",
    "Predict which quote triggers a long's stop and a short's stop.",
    "Explain how a wider spread can trigger a stop while the chart barely moves.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bearish", label: "Arena: bearish" },
    { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
  ],
  script: {
    unit: "1.1",
    courseId: "1.1.3",
    bridge: "In 1.1.2 every long and short opened on one side of the spread and closed on the other. Here you see which price a chart plots, and why your stop can trigger while the chart stays below it.",
    hook: {
      prompt: "Your short has a stop at 101.00. The LABX chart, drawn from the mid, peaks at 100.97. Were you stopped out?",
      control: {
        kind: "choice",
        choices: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "unknown", label: "Can't tell" },
        ],
        answer: "yes",
      },
      figure: {
        kind: "chart",
        chart: L113_CHART,
        steps: [
          {
            text: "The chart peaks at 100.97. Your short's stop waits at 101.00.",
            layers: [{ kind: "marker", index: 7, at: "high", label: "HIGH 100.97" }],
          },
        ],
      },
      compare: "You picked {yours}. At a mid of 100.97 the ask was 101.02. A short's stop triggers on the ask, so it filled at 101.00.",
      concept: "price-types",
    },
    learn: [
      {
        kind: "explain",
        title: "Four prices",
        text: "Four prices get called 'the price'. The [[last-price|last price]] is where the most recent trade happened. The [[bid]] and [[ask]] make up the [[quote]]: what you can sell at and buy at right now. The [[mid-price|mid]] sits halfway between them. Stock charts usually plot the last, many FX and CFD platforms plot the bid, and LABX plots the mid.",
      },
      {
        kind: "figure",
        title: "Where the stop really is",
        figure: {
          kind: "chart",
          chart: L113_CHART,
          steps: [
            {
              text: "The candles are the mid. Its high, 100.97, stays under the short's stop at 101.00.",
              layers: [{ kind: "marker", index: 7, at: "high", label: "MID HIGH 100.97" }],
            },
            {
              text: "The bid and the ask travel 0.05 either side of the mid, all the time.",
              layers: [
                { kind: "line", values: L113_RISE.map((c) => Math.round((c.c + 0.05) * 100) / 100), role: "neutral", dashed: true, label: "ASK" },
                { kind: "line", values: L113_RISE.map((c) => Math.round((c.c - 0.05) * 100) / 100), role: "neutral", dashed: true, label: "BID" },
              ],
            },
            {
              text: "At the high, the ask was 100.97 + 0.05 = 101.02. It crossed the stop, which filled at 101.00.",
              layers: [{ kind: "marker", index: 7, price: 101.02, label: "ASK 101.02", role: "down" }],
            },
          ],
        },
        concept: "price-types",
      },
      {
        kind: "match",
        prompt: "Match each item to the price it uses.",
        columns: ["Item", "Price"],
        pairs: [
          { left: "A stock chart usually shows", right: "Last", wrong: "Stock charts usually plot trades: the last price." },
          { left: "LABX candles", right: "Mid", wrong: "LABX draws its candles from the mid, halfway between bid and ask." },
          { left: "A long's stop triggers on", right: "Bid", wrong: "A long's stop sells, and sales happen at the bid." },
          { left: "A short's stop triggers on", right: "Ask", wrong: "A short's stop buys back, and buys happen at the ask." },
        ],
        correct: "Right. A chart plots one price; your orders trigger on the quote that closes the position.",
        concept: "price-types",
      },
      {
        kind: "explain",
        title: "Spreads move",
        text: "On real markets the [[spread]] isn't constant. It tends to widen at the open, around news and when few orders are waiting. A wider spread pushes the ask up and the bid down while the mid stays put, so a stop can trigger with the chart nearly still. On LABX it stays 0.10 for now.",
      },
      {
        kind: "predict",
        title: "News hits",
        prompt: "At a news release the spread widens from 0.10 to 0.60, while the mid sits at 100.70. Does a short's stop at 101.00 trigger?",
        control: {
          kind: "choice",
          choices: [
            { id: "yes", label: "Yes", feedback: "Right. Half of 0.60 is 0.30, so the ask reaches 100.70 + 0.30 = 101.00." },
            { id: "no", label: "No", feedback: "The mid is 0.30 below the stop, but the ask is half the spread above the mid: 100.70 + 0.30 = 101.00." },
          ],
          answer: "yes",
        },
        figure: {
          kind: "chart",
          chart: flat(100.7, [100.2, 101.2], "The mid at 100.70 and a short's stop at 101.00.", [
            { kind: "level", price: 101.0, role: "stop", label: "SHORT STOP 101.00" },
            { kind: "level", price: 100.7, role: "neutral", label: "MID 100.70" },
          ]),
          steps: [
            {
              text: "Half the spread is 0.30. Ask: 100.70 + 0.30 = 101.00, right on the stop.",
              layers: [
                { kind: "bracket", from: 100.7, to: 101.0, label: "HALF SPREAD 0.30", role: "concept" },
                { kind: "level", price: 100.4, role: "neutral", label: "BID 100.40" },
              ],
            },
          ],
        },
        reveal: "The ask touched 101.00 and the stop filled, though the chart sat 0.30 below it. A wider spread moves both quotes away from the mid.",
        concept: "price-types",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Know which quote triggers your orders: the bid for a long's stop, the ask for a short's. A stop just beyond a level also needs room for half the spread, and more when spreads widen.",
      },
      {
        kind: "predict",
        title: "Your turn: a long's stop",
        prompt: "A long's stop is at 99.50. Drag the mid to the highest price at which the stop triggers.",
        control: {
          kind: "slider",
          min: 99.3,
          max: 99.8,
          step: 0.01,
          start: 99.8,
          answer: 99.55,
          tolerance: 0,
          feedback: [
            { from: 99.56, to: 99.8, text: "At that mid the bid is still above 99.50, so the stop waits." },
            { from: 99.3, to: 99.54, text: "The stop has triggered there, but a higher mid already does it. Find the highest." },
          ],
        },
        figure: {
          kind: "chart",
          chart: L113_FALL,
          steps: [
            {
              text: "Bid = mid − 0.05. A mid of 99.55 puts the bid on 99.50: the stop triggers.",
              layers: [{ kind: "bracket", from: 99.5, to: 99.55, index: 7, label: "0.05", role: "concept" }],
            },
          ],
        },
        reveal: "A long's stop sells, so it watches the bid. The bid is 99.50 when the mid is 99.55, half a spread above the stop.",
        concept: "price-types",
      },
      {
        kind: "predict",
        title: "Now a short's stop",
        prompt: "A short's stop is at 101.00. Drag the mid to the lowest price at which it triggers.",
        control: {
          kind: "slider",
          min: 100.7,
          max: 101.2,
          step: 0.01,
          start: 100.7,
          answer: 100.95,
          tolerance: 0,
          feedback: [
            { from: 100.7, to: 100.94, text: "At that mid the ask is still below 101.00, so the stop waits." },
            { from: 100.96, to: 101.2, text: "The stop has triggered there, but a lower mid already does it. Find the lowest." },
          ],
        },
        figure: {
          kind: "chart",
          chart: L113_CHART,
          steps: [
            {
              text: "Ask = mid + 0.05. A mid of 100.95 puts the ask on 101.00. The peak, 100.97, passed it.",
              layers: [{ kind: "bracket", from: 100.95, to: 101.0, index: 7, label: "0.05", role: "concept" }],
            },
          ],
        },
        reveal: "A short's stop buys, so it watches the ask. The ask is 101.00 when the mid is 100.95. That's why the hook's chart, peaking at 100.97, triggered it.",
        concept: "price-types",
      },
    ],
    check: ["q-1.1.3-1", "q-1.1.3-2", "q-1.1.3-3"],
    recap: {
      next: "Next, 1.1.4: commission, fees and the other costs that stack on top of the spread.",
      takeaways: [
        "Last is the latest trade, bid and ask are the quote, mid sits halfway. LABX charts plot the mid.",
        "A long's stop triggers on the bid, a short's on the ask: half a spread from the chart.",
        "Wider spreads can trigger stops while the chart barely moves. Leave room for half the spread.",
      ],
    },
  },
};

const L114: Lesson = {
  id: "1.1.4",
  title: "Commission, fees and the cost stack",
  topic: "market_fundamentals",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Commission comes in several models; with the spread, slippage, financing and fees it forms the cost stack between a gross and a net result.",
  objectives: [
    "Calculate the commission on a fill under a percentage model, rounded up to the cent.",
    "List the costs that stand between a gross and a net result.",
    'Explain why "zero commission" doesn\'t mean zero cost.',
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "low_volatility", label: "Arena: low volatility" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "1.1",
    courseId: "1.1.4",
    bridge: "In 1.1.3 a wider spread pushed the ask into a stop. The spread is only one cost, though. Here you calculate commission on each fill and stack every cost that stands between a gross and a net result.",
    hook: {
      prompt: "Broker A: zero commission, spread 0.30. Broker B: 0.05% commission, spread 0.10. You buy and sell 100 LABX at a mid of 100.00. Which is cheaper?",
      control: {
        kind: "choice",
        choices: [
          { id: "a", label: "Broker A" },
          { id: "b", label: "Broker B" },
          { id: "same", label: "The same" },
        ],
        answer: "b",
      },
      compare: "You picked {yours}. Broker A's round trip costs 30.00, all spread. Broker B's costs 20.01: 10.00 of spread plus 5.01 + 5.00 commission.",
      concept: "cost-stack",
    },
    learn: [
      {
        kind: "explain",
        title: "How brokers charge",
        text: "Brokers charge [[commission]] in a few ways: a percentage of the fill value, quoted in [[basis-point|basis points]] (LABX charges 5, or 0.05%); a fixed amount per share or unit; a fixed amount per lot or contract; or no commission at all. Whatever the model, it applies to every fill, so a round trip pays it twice.",
      },
      {
        kind: "worked",
        title: "One fill",
        lines: ["Buy 37 units at the ask, 100.05.", "Fill value: 37 × 100.05 = 3,701.85.", "0.05% of 3,701.85 = 1.850925.", "Rounded up to the cent = ?"],
        ask: {
          answer: 1.86,
          tolerance: 0,
          unit: "vUSD",
          feedback: [
            { value: 1.85, text: "That rounds to the nearest cent. The simulator always rounds up: any fraction of a cent counts as a full cent." },
            { value: 18.51, text: "That's 0.5%. 0.05% is five hundredths of a percent: 0.0005 × the fill value." },
          ],
          correct: "Right: 1.850925 rounds up to 1.86.",
        },
        after: "Rounding up adds less than a cent per fill. The exit pays its own commission, on its own fill value.",
        concept: "trading-costs",
      },
      {
        kind: "figure",
        title: "The cost stack",
        text: "An illustrative long of 100 units, from gross to net. LABX itself charges no [[overnight-financing]], and its fills slip only through gaps.",
        figure: {
          kind: "bars",
          unit: "vUSD",
          bars: [
            { label: "Gross: the mid's move", value: 200, role: "up" },
            { label: "Spread", value: -10, role: "down" },
            { label: "Commission", value: -10.11, role: "down" },
            { label: "Slippage", value: -3, role: "down" },
            { label: "Overnight financing", value: -2, role: "down" },
            { label: "Net", value: 174.89, role: "accent" },
          ],
          steps: [
            "Gross: the mid rises 2.00 on 100 units, 200.00. The spread takes 10.00 of it.",
            "Two commissions take 10.11: 5.01 on entry, 5.10 on the exit.",
            "If the exit slips 0.03, that's 3.00. A leveraged position held overnight pays financing: 2.00 here.",
            "Net: 174.89. Every cost comes off before you keep a gain.",
          ],
        },
        concept: "cost-stack",
      },
      {
        kind: "match",
        prompt: "Match each cost to when you pay it.",
        columns: ["Cost", "When you pay it"],
        pairs: [
          { left: "Spread", right: "Once per round trip", wrong: "You cross the spread once: in on one side, out on the other." },
          { left: "Commission", right: "On every fill", wrong: "Commission is charged on each fill, entry and exit." },
          { left: "Slippage", right: "In fast markets, gaps and stop fills", wrong: "Slippage comes when price moves before or during your fill." },
          { left: "Overnight financing", right: "Leveraged positions held past the daily cut-off", wrong: "Financing is interest on borrowed money, charged for each night held." },
          { left: "Data and platform fees", right: "Every month, trade or not", wrong: "Subscriptions are charged on a schedule, not per trade." },
        ],
        correct: "Right. The spread and commission come with every trade; the rest depend on how and when you trade.",
        concept: "cost-stack",
      },
      {
        kind: "explain",
        title: "Zero commission",
        text: "'Zero commission' brokers still earn from your trades: through a wider spread, or by being paid to send your orders to a particular firm, known as [[payment-for-order-flow]]. Rules differ by country: it is allowed in the US, while the EU has moved to ban it. Taxes on gains are another cost, covered in a later unit.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Costs are certain; edge is not. Count every cost before you count on any edge.",
      },
    ],
    task: {
      widget: "spread-cost",
      goal: "The widget shows Broker B: 100 units at a mid of 100.00, spread 0.10, commission 0.05%. Switch to Broker A, with 0% commission, and find the widest spread at which A is still cheaper.",
      start: { units: 100, mid: 100.0, spread: 0.1, commissionPct: 0.05 },
      locked: ["units", "mid"],
      success: {
        all: [
          { field: "commissionPct", eq: 0 },
          { field: "spread", eq: 0.2 },
          { field: "units", eq: 100 },
          { field: "mid", eq: 100.0 },
        ],
      },
      feedback: [
        { when: { not: { field: "commissionPct", eq: 0 } }, text: "Broker A charges no commission. Set the commission to 0.00% first; Broker B's round trip was 20.01." },
        { when: { field: "roundTrip", gte: 20.01 }, text: "At a spread of {spread:2}, Broker A's round trip costs {roundTrip:2}: not cheaper than B's 20.01. Narrow the spread." },
        { when: { field: "spread", lt: 0.2 }, text: "At {spread:2}, A costs {roundTrip:2}, cheaper than B. It stays cheaper a little wider: find the widest spread." },
      ],
      correct: "Right. At 0.20, Broker A costs 20.00, one cent under B's 20.01; at 0.22 it costs 22.00. 'Zero commission' is cheaper only while its spread stays narrow.",
      hints: [
        "Broker B's round trip costs 20.01. Note it before you change anything.",
        "With no commission, Broker A's round trip is 100 × its spread.",
        "Find the widest spread that keeps 100 × spread under 20.01.",
      ],
      showMe: { commissionPct: 0, spread: 0.2 },
      concept: "cost-stack",
    },
    check: ["q-1.1.4-1", "q-1.1.4-2", "q-1.1.4-3"],
    recap: {
      next: "Next, 1.1.5: add those costs up for a round trip and find how far price must move just to break even.",
      takeaways: [
        "Commission = fill value × rate, rounded up to the cent, on every fill: 1.86 on 3,701.85.",
        "Spread, commission, slippage, financing and fees all sit between a gross and a net result.",
        "Zero commission isn't zero cost: a wider spread can cost more than a fee.",
      ],
    },
  },
};

const L115: Lesson = {
  id: "1.1.5",
  title: "Round trips and break-even",
  topic: "market_fundamentals",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "A round trip must cover the spread and two commissions before it gains anything, and that cost takes a bigger share of small targets.",
  objectives: [
    "Find the break-even exit price of a long and of a short, costs included.",
    "Express the round-trip cost as a share of a planned move.",
    "Explain why small targets and frequent trading magnify the share of costs.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "low_volatility", label: "Arena: low volatility" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "1.1",
    courseId: "1.1.5",
    bridge: "In 1.1.4 you priced each cost on its own: 1.86 of commission on one fill, the spread once per round trip. Here you add them up and find how far the mid must move before closing stops losing money.",
    hook: {
      prompt: "You bought 100 LABX at the ask, 100.05. How high must the mid go before selling breaks even, after both commissions?",
      control: {
        kind: "choice",
        choices: [
          { id: "entry", label: "100.05" },
          { id: "tenth", label: "About 100.10" },
          { id: "fifth", label: "About 100.20" },
        ],
        answer: "fifth",
      },
      compare: "You picked {yours}. Selling gets the bid, and both fees need covering: break-even is a mid of 100.21. At 100.20 you're still 0.02 short.",
      concept: "break-even-move",
    },
    learn: [
      {
        kind: "explain",
        title: "Covering the costs",
        text: "A [[round-trip]] is the entry and the exit together. Its [[break-even]] move is how far price must go your way just to cover the costs, before any gain. Until the mid has moved that far, closing the trade loses money, even if the chart says you're up.",
      },
      {
        kind: "worked",
        title: "The break-even move",
        lines: ["Spread: 0.10 per unit, crossed once.", "Commission: about 0.05 per unit at entry, and 0.05 at exit.", "Break-even move of the mid ≈ 0.10 + 0.05 + 0.05 = ?"],
        ask: {
          answer: 0.2,
          tolerance: 0.01,
          unit: "vUSD",
          feedback: [
            { value: 0.1, text: "That covers the spread only. Add a fee for each fill." },
            { value: 0.15, text: "That counts one fee. A round trip pays commission twice." },
          ],
          correct: "Right: about 0.20 a unit, with LABX near 100.00.",
        },
        after: "For 100 units bought at 100.05 it's exactly 0.21, because each fee rounds up to the cent. At other prices the fees scale with the price; the spread doesn't.",
        concept: "break-even-move",
      },
      {
        kind: "figure",
        title: "Same cost, three targets",
        text: "Cost share = round-trip cost ÷ gross gain at the target.",
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "Target 0.40", value: 50, role: "down" },
            { label: "Target 1.00", value: 20, role: "down" },
            { label: "Target 4.00", value: 5, role: "down" },
          ],
          steps: [
            "A 0.20 round trip against a 0.40 target: costs take 50% of the gross gain.",
            "Against a 1.00 target: 20%.",
            "Against 4.00: 5%. The bigger the planned move, the smaller the share costs take.",
          ],
        },
        concept: "break-even-move",
      },
      {
        kind: "predict",
        title: "Small targets",
        prompt: "A plan targets 0.30 a unit per trade, six trades a day. What share of each gross gain goes to costs?",
        control: {
          kind: "choice",
          choices: [
            { id: "seven", label: "About 7%", feedback: "That would need a target of about 3.00. Here it's 0.20 ÷ 0.30." },
            { id: "thirty", label: "About 30%", feedback: "30 is the target in cents, not the share. Divide the cost by the target: 0.20 ÷ 0.30." },
            { id: "two-thirds", label: "About 67%", feedback: "Right: 0.20 ÷ 0.30 ≈ 67%." },
          ],
          answer: "two-thirds",
        },
        reveal: "0.20 ÷ 0.30 ≈ 67%. Six trades a day pay it six times: 1.20 a unit in costs against 1.80 of gross gains, even if every target is hit.",
        concept: "break-even-move",
      },
      {
        kind: "explain",
        title: "The cost wall",
        text: "Short-term traders hit a wall of costs. In forex, a spread of 1 [[pip]] (the usual price step) on a 5-pip target hands 20% of the gross gain to the spread alone, before commission and [[slippage]] (fills worse than quoted). The smaller the target and the more often you trade, the bigger the bill. Unit 2.9 comes back to this.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Before entering, check that the target is worth the costs. If they take a large share of the planned gain, the trade has little room for error.",
      },
      {
        kind: "predict",
        title: "Your turn: a long's break-even",
        prompt: "Part 1: you're long 100 units filled at 100.05. Drag the exit mid to the lowest price where the round trip isn't a loss, after both commissions.",
        control: {
          kind: "slider",
          min: 100.0,
          max: 100.4,
          step: 0.01,
          start: 100.0,
          answer: 100.21,
          tolerance: 0,
          feedback: [
            { from: 100.0, to: 100.2, text: "Not yet. Selling at the bid there doesn't cover the spread and both fees. At 100.20 the net is still −0.02." },
            { from: 100.22, to: 100.4, text: "That's past break-even. Find the lowest mid where the net first reaches zero or more." },
          ],
        },
        figure: {
          kind: "chart",
          chart: flat(100.0, [99.9, 100.4], "The mid at 100.00 when the long was filled at the ask, 100.05.", [{ kind: "level", price: 100.05, role: "entry", label: "LONG FILLED 100.05" }]),
          steps: [
            {
              text: "Mid 100.21: you sell at the bid, 100.16. Gross 11.00, fees 5.01 + 5.01: net +0.98.",
              layers: [{ kind: "level", price: 100.16, role: "neutral", label: "SELL AT THE BID 100.16", chip: true }],
            },
            { text: "At 100.20 the bid is 100.15: gross 10.00, net −0.02. One cent of mid decides it." },
          ],
        },
        reveal: "Break-even is a mid of 100.21, 0.21 above where you started. Below it, closing loses money even though the chart is up.",
        concept: "break-even-move",
      },
      {
        kind: "predict",
        title: "Part 2: a short's break-even",
        prompt: "Part 2: you're short 100 units filled at 99.95. Drag the exit mid to the highest price where the round trip isn't a loss.",
        control: {
          kind: "slider",
          min: 99.6,
          max: 100.0,
          step: 0.01,
          start: 100.0,
          answer: 99.8,
          tolerance: 0,
          feedback: [
            { from: 99.81, to: 100.0, text: "Not yet. Buying back at the ask there costs more than the short made after both fees. At 99.81 the net is −1.00." },
            { from: 99.6, to: 99.79, text: "That's past break-even. Find the highest mid where the net first reaches zero." },
          ],
        },
        figure: {
          kind: "chart",
          chart: flat(100.0, [99.6, 100.1], "The mid at 100.00 when the short was filled at the bid, 99.95.", [{ kind: "level", price: 99.95, role: "entry", label: "SHORT FILLED 99.95" }]),
          steps: [
            {
              text: "Mid 99.80: you buy back at the ask, 99.85. Gross 10.00, fees 5.00 + 5.00: net 0.00.",
              layers: [{ kind: "level", price: 99.85, role: "neutral", label: "BUY BACK AT THE ASK 99.85", chip: true }],
            },
          ],
        },
        reveal: "A short's break-even mirrors the long's: the mid must fall about 0.20, here to 99.80. Its fees are a cent lower each, because they're charged on lower prices.",
        concept: "break-even-move",
      },
    ],
    check: ["q-1.1.5-1", "q-1.1.5-2", "q-1.1.5-3"],
    recap: {
      next: "Next, 1.1.6: count a move in ticks, points or pips, and turn it into money and a share of your account.",
      takeaways: [
        "Break-even covers the spread and both fees: a long from 100.05 needs a mid of 100.21.",
        "Cost share = round-trip cost ÷ planned gain: 0.20 on a 0.30 target is 67%.",
        "Small targets and frequent trades multiply costs. Check that a target is worth them first.",
      ],
    },
  },
};

const L116: Lesson = {
  id: "1.1.6",
  title: "P&L in ticks, points, pips and units",
  topic: "market_fundamentals",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Ticks, points and pips count a price move; the position size and the value per point turn it into money and a share of your account.",
  objectives: [
    "Calculate P&L as units × price change, in vUSD and as a percentage of the account.",
    "Convert a price change into ticks, points or pips and into money with a value per point.",
    "Explain why the same price move is worth different amounts in different instruments.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "1.1",
    courseId: "1.1.6",
    bridge: "In 1.1.2 you worked out P&L as units × (sell − buy), and in 1.1.5 you measured break-even as a move of about 0.20. Here you count moves in ticks, points and pips, and turn each into money and a share of your account.",
    hook: {
      prompt: "LABX moves from 100.00 to 101.25. How many ticks is that?",
      control: {
        kind: "choice",
        choices: [
          { id: "points", label: "1.25" },
          { id: "tenths", label: "12.5" },
          { id: "ticks", label: "125" },
        ],
        answer: "ticks",
      },
      compare: "You picked {yours}. A LABX tick is 0.01, so a move of 1.25 is 125 ticks. What it's worth depends on your size.",
      concept: "point-value",
    },
    learn: [
      {
        kind: "explain",
        title: "Ticks and points",
        text: "A [[tick]] is the smallest step a price can take: 0.01 on LABX. A [[point]] is a move of 1.00. Your P&L is units × price change, so on LABX each point is worth 1.00 vUSD for every [[unit]] you hold, one whole piece of LABX.",
      },
      {
        kind: "worked",
        title: "Points into money",
        lines: ["Long 30 units; the price rises 1.25.", "P&L = 30 × 1.25 = ?"],
        ask: {
          answer: 37.5,
          tolerance: 0,
          unit: "vUSD",
          feedback: [
            { value: 1.25, text: "That's the move per unit. Multiply by the 30 units you hold." },
            { value: 125, text: "125 is the move in ticks. Money = units × price change: 30 × 1.25." },
            { value: 3.75, text: "Check the decimal point: 30 × 1.25 = 37.50." },
          ],
          correct: "Right: 37.50 vUSD.",
        },
        after: "37.50 is 0.375% of a 10,000.00 account. The percentage lets you compare results across sizes and accounts.",
        concept: "point-value",
      },
      {
        kind: "figure",
        title: "One move, three sizes",
        text: "The same 1% move, from 100.00 to 101.00. The future is made up for this lesson, with a [[contract-multiplier]] of 100 vUSD per point. Real contracts have their own specifications.",
        figure: {
          kind: "bars",
          unit: "vUSD",
          bars: [
            { label: "LABX, 1 unit", value: 1, role: "accent" },
            { label: "LABX, 30 units", value: 30, role: "accent" },
            { label: "LABX future, 1 contract", value: 100, role: "accent" },
          ],
          steps: [
            "A 1% move on LABX is 1.00, one point: 1.00 vUSD on 1 unit.",
            "On 30 units, the same move is worth 30.00.",
            "One contract covers 100 units, so each 0.01 tick is worth 1.00: 1% is 100 ticks, 100.00.",
          ],
        },
        concept: "point-value",
      },
      {
        kind: "worked",
        title: "Pips",
        lines: [
          "EUR/USD moves from 1.1000 to 1.1030: 30 [[pip|pips]].",
          "On 10,000 units, each pip is worth 10,000 × 0.0001 = 1.00 USD.",
          "P&L = 30 × 1.00 = ?",
        ],
        ask: {
          answer: 30,
          tolerance: 0,
          unit: "USD",
          feedback: [
            { value: 0.003, text: "That's the price change. Count it in pips first: 0.0030 ÷ 0.0001 = 30." },
            { value: 300, text: "On 10,000 units a pip is worth 1.00, not 10.00: 10,000 × 0.0001." },
          ],
          correct: "Right: 30 pips × 1.00 = 30.00 USD.",
        },
        after: "Pip value = units × 0.0001: 1.00 on 10,000 units, 10.00 on a standard [[lot]] of 100,000. In pairs quoted in yen, a pip is 0.01.",
        concept: "point-value",
      },
      {
        kind: "match",
        prompt: "Match each term to its meaning.",
        columns: ["Term", "Meaning"],
        pairs: [
          { left: "Tick", right: "The smallest price step", wrong: "A tick is the minimum step: 0.01 on LABX." },
          { left: "Pip", right: "0.0001 in most currency pairs", wrong: "Pips are the forex step: 0.0001, or 0.01 in yen pairs." },
          { left: "Lot", right: "A standard block of units", wrong: "A lot is a size, such as 100,000 units of a currency pair." },
          { left: "Contract multiplier", right: "Money per point for one contract", wrong: "The multiplier turns a futures price move into money." },
          { left: "Point", right: "A move of 1.00 in price", wrong: "A point is 1.00 of price: 100 LABX ticks." },
        ],
        correct: "Right. Tick, pip and point measure the move; lot and multiplier set what it's worth.",
        concept: "point-value",
      },
      {
        kind: "callout",
        tone: "key",
        text: "The same 1% move can be worth 1.00 or 100.00. Always turn a move into money and into a share of your account. Unit 1.4 builds position sizing on this.",
      },
      {
        kind: "predict",
        title: "Your turn: +30.00 with LABX",
        prompt: "30 pips on 10,000 units of EUR/USD made +30.00. Now make +30.00 with 20 LABX units: how far must the price move your way?",
        control: {
          kind: "numeric",
          answer: 1.5,
          tolerance: 0,
          feedback: [
            { value: 0.67, text: "That's 20 ÷ 30. Divide the money by the units: 30.00 ÷ 20." },
            { value: 600, text: "That multiplies the two. You need the move: 30.00 ÷ 20 units." },
          ],
        },
        reveal: "30.00 ÷ 20 units = 1.50. 20 × 1.50 = 30.00 vUSD: a 1.5% move from 100.00.",
        concept: "point-value",
      },
      {
        kind: "predict",
        title: "And with the future",
        prompt: "Make the same +30.00 with 1 contract of the illustrative LABX future, worth 1.00 vUSD a tick. How many ticks must it move?",
        control: {
          kind: "numeric",
          unit: "ticks",
          answer: 30,
          tolerance: 0,
          feedback: [
            { value: 0.3, text: "0.30 is the price move. In ticks of 0.01, that's 30." },
            { value: 3000, text: "Each tick is worth 1.00 here, so 30.00 needs 30 ticks." },
          ],
        },
        reveal: "30 ticks is a price move of 0.30, a fifth of the 1.50 that 20 units needed. Same money, three instruments: convert every move to money first.",
        concept: "point-value",
      },
    ],
    check: ["q-1.1.6-1", "q-1.1.6-2", "q-1.1.6-3"],
    recap: {
      next: "Next, 1.1.7: find these numbers on screen, in the quote line and the account panel, and check a ticket before sending it.",
      takeaways: [
        "P&L = units × price change: 30 × 1.25 = 37.50 vUSD, or 0.375% of 10,000.00.",
        "Ticks, points and pips count the move; size and value per point turn it into money.",
        "The same move is worth different amounts. Convert it to money and to a share of your account.",
      ],
    },
  },
};

const L117: Lesson = {
  id: "1.1.7",
  title: "The quote screen and the order ticket",
  topic: "market_fundamentals",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Read a quote line field by field, tell balance from equity on the account panel, and check the order ticket before you send it.",
  objectives: [
    "Read last, bid, ask, the change and the day's range on a quote line.",
    "Tell balance, equity, realised and unrealised P&L apart on the account panel.",
    "Check side, size, price and stop on a ticket before sending it.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "1.1",
    courseId: "1.1.7",
    bridge: "In 1.1.5 you found a long's break-even after both fees, and in 1.1.6 you turned moves into money. Here you meet those numbers on screen: a quote line, an account panel that shows fees and open P&L, and an order ticket.",
    hook: {
      prompt: "One open long of 50 units, bought at 100.05. The panel shows Balance 9,997.49 and Equity 9,992.49. Why is equity lower?",
      control: {
        kind: "choice",
        choices: [
          { id: "fee", label: "A fee not charged yet" },
          { id: "loss", label: "The open position is showing a loss" },
          { id: "error", label: "A display error" },
        ],
        answer: "loss",
      },
      compare: "You picked {yours}. At a mid of 99.95 the open long shows −5.00, and equity counts it. The balance already has the 2.51 entry fee taken off.",
      concept: "balance-and-equity",
    },
    learn: [
      {
        kind: "explain",
        title: "The quote line",
        text: "A [[quote]] line packs a market into one row: **XYZ · Last 50.60 · Bid 50.58 · Ask 50.62 · Chg +0.60 (+1.20%) · High 50.90 · Low 49.70.** Last is the latest trade, bid and ask are what you can sell and buy at, the change runs from the previous close, and high and low are today's range.",
      },
      {
        kind: "match",
        prompt: "XYZ · Last 50.60 · Bid 50.58 · Ask 50.62 · Chg +0.60 · High 50.90 · Low 49.70. Match each number to what it tells you.",
        columns: ["Number", "What it tells you"],
        pairs: [
          { left: "50.62", right: "What you pay to buy now", wrong: "50.62 is the ask: the higher quote, the one buyers pay." },
          { left: "50.58", right: "What you get if you sell now", wrong: "50.58 is the bid: what buyers offer, so what a seller gets." },
          { left: "50.60", right: "Where the latest trade happened", wrong: "50.60 is the last price: a trade that has already happened." },
          { left: "+0.60", right: "The move since the previous close", wrong: "The change compares the last price with the previous session's close." },
          { left: "49.70", right: "The lowest price traded today", wrong: "49.70 is the day's low, the bottom of today's range so far." },
        ],
        correct: "Right. Two of these you can trade at now; the rest describe what already happened.",
        concept: "price-types",
      },
      {
        kind: "explain",
        title: "The account panel",
        text: "[[balance|Balance]] is deposits plus closed trades, after costs: a fee comes off the moment it's paid. [[equity|Equity]] is balance plus the [[unrealised-pnl|unrealised P&L]] of open positions, valued at the mid. Closing a position turns it into [[realised-pnl|realised P&L]]. Risk percentages in MARKET//LAB use equity.",
      },
      {
        kind: "worked",
        title: "From balance to equity",
        lines: [
          "Bought 50 at 100.05; commission 2.51.",
          "Balance: 10,000.00 − 2.51 = 9,997.49.",
          "Mid now 99.95: open P&L = 50 × (99.95 − 100.05) = −5.00.",
          "Equity = 9,997.49 − 5.00 = ?",
        ],
        ask: {
          answer: 9992.49,
          tolerance: 0,
          unit: "vUSD",
          feedback: [
            { value: 9995, text: "That takes the open loss off 10,000.00 but forgets the entry fee, already paid." },
            { value: 9997.49, text: "That's the balance. Equity adds the open P&L, −5.00." },
          ],
          correct: "Right: 9,992.49 vUSD.",
        },
        after: "Closing now would sell at the bid, 99.90: −7.50 realised and a 2.50 exit fee, so the balance would drop to 9,987.49.",
        concept: "balance-and-equity",
      },
      {
        kind: "predict",
        title: "The field that sets your loss",
        prompt: "LABX mid 100.00. Ticket: Buy · 40 units · Market · Stop 98.00 · Target 104.00. Which field decides how much you lose if you're wrong?",
        control: {
          kind: "choice",
          choices: [
            { id: "side", label: "Side: Buy", feedback: "Side decides which way you profit, not how much you lose." },
            { id: "units", label: "Units: 40", feedback: "Units multiply the loss, but the stop sets its distance. You need both." },
            { id: "stop", label: "Stop 98.00, together with the units", feedback: "Right. The stop sets the distance; the units multiply it." },
            { id: "target", label: "Target 104.00", feedback: "The target sets the gain if you're right, not the loss if you're wrong." },
          ],
          answer: "stop",
        },
        reveal: "Loss at the stop = units × (fill − stop) + both fees: 40 × (100.05 − 98.00) = 82.00, plus 2.01 + 1.96, so 85.97. Check those two fields hardest.",
        concept: "order-ticket",
      },
      {
        kind: "order",
        title: "Before you press Send",
        prompt: "Put the ticket check in order, from the top of the ticket to the button.",
        items: ["Instrument: LABX", "Side: buy or sell", "Units", "Order type and price", "Stop and target", "Send"],
        explain: "Right. Read it once, top to bottom: what, which way, how much, how, and where you get out. Then send.",
        wrong: "Follow the ticket from the top: what you trade comes first, Send comes last.",
        concept: "order-ticket",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Most costly mistakes happen in the ticket, not in the analysis: the wrong side, an extra zero, no stop. A [[fat-finger-error]] takes a second to make. Read the [[order-ticket]] once before you send.",
      },
      {
        kind: "match",
        title: "Your turn: check the tickets",
        prompt: "Your plan: buy 40 LABX at market, stop 98.00, target 104.00. Match each ticket to your verdict.",
        columns: ["Ticket", "Verdict"],
        pairs: [
          { left: "1 · Sell 40 · Market · Stop 98.00 · Target 104.00", right: "Wrong side", wrong: "Sell opens a short, a bet on a fall your plan doesn't make." },
          { left: "2 · Buy 400 · Market · Stop 98.00 · Target 104.00", right: "Extra zero in the size", wrong: "400 units is ten times the plan: 859.61 lost at the stop instead of 85.97." },
          { left: "3 · Buy 40 · Market · No stop · Target 104.00", right: "Missing stop", wrong: "Without a stop, nothing limits the loss." },
          { left: "4 · Buy 40 · Market · Stop 98.00 · Target 104.00", right: "Matches the plan: send", wrong: "Check each field: side, size, stop and target all match the plan." },
        ],
        correct: "Right. Three of the four tickets would have broken the plan before the market did anything.",
        concept: "order-ticket",
      },
    ],
    check: ["q-1.1.7-1", "q-1.1.7-2", "q-1.1.7-3"],
    recap: {
      next: "Next: the 1.1 checkpoint, then unit 1.2, Charts and candles, which starts with 1.2.1: what one candle, drawn from the mid, shows.",
      takeaways: [
        "Last is the latest trade; bid and ask are the quote; change and high–low describe the day.",
        "Balance counts closed results after fees; equity adds open P&L at the mid.",
        "Before Send, read the ticket top to bottom: instrument, side, units, type, stop and target.",
      ],
    },
  },
};

// ─── Check questions ────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 1.1.2 · Long and short
  {
    id: "q-1.1.2-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 1,
    prompt: "You short 20 units of LABX at the bid, 99.95. Later the mid is 98.50 and you buy back at the ask. What is your P&L before commission, in vUSD?",
    numeric: { answer: 28, tolerance: 0.01, unit: "vUSD" },
    explanation: "A short buys back at the ask: 98.50 + 0.05 = 98.55. P&L = 20 × (99.95 − 98.55) = 20 × 1.40 = 28.00. Buying back at the mid would give 29.00, but no order fills there.",
    lesson: "1.1.2",
    concepts: ["long-and-short"],
    hints: [
      "A short makes money when it buys back lower than it sold.",
      "A short closes with a buy, at the ask: mid + 0.05.",
      "Buy back at 98.55. P&L = 20 × (99.95 − 98.55).",
    ],
    vary: {
      fields: { units: [10, 60, 5], mid: [97, 99.5, 0.05] },
      answer: "round(units * (99.95 - (mid + 0.05)), 2)",
      prompt: "You short {units} units of LABX at the bid, 99.95. Later the mid is {mid:2} and you buy back at the ask. What is your P&L before commission, in vUSD?",
      explanation:
        "A short buys back at the ask: {mid:2} + 0.05 = {mid + 0.05:2}. P&L = {units} × (99.95 − {mid + 0.05:2}) = {answer:2}. Buying back at the mid would give {units * (99.95 - mid):2}, but no order fills there.",
      hint: "Buy back at {mid + 0.05:2}. P&L = {units} × (99.95 − {mid + 0.05:2}).",
    },
  },
  {
    id: "q-1.1.2-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "You're short LABX and close the position with a market order. At which price does it fill?",
    options: [
      { id: "a", label: "The bid, mid − 0.05", rationale: "The bid is where a short opens, because opening is a sale. Closing a short is a buy, and buys pay the ask." },
      { id: "b", label: "The mid", rationale: "The mid is what the chart draws and how open positions are valued, but no order fills there." },
      { id: "c", label: "The ask, mid + 0.05" },
      { id: "d", label: "Your entry price", rationale: "Your exit price comes from the market when you close, not from where you entered." },
    ],
    correct: "c",
    explanation: "Closing a short means buying back, and every buy fills at the ask, half a spread above the mid. A short opens at the bid and closes at the ask: the mirror image of a long.",
    lesson: "1.1.2",
    concepts: ["long-and-short", "bid-ask-spread"],
  },
  {
    id: "q-1.1.2-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "You short 50 LABX at 99.95 with no stop, planning to wait it out if price rises. Overnight, unexpected news lifts the mid from 100.00 to 112.00.",
    prompt: "What does this show about a short with no stop?",
    options: [
      { id: "a", label: "It loses more because shorts pay a wider spread", rationale: "The spread is the same 0.10 in both directions. The danger is the open-ended rise, not the cost." },
      { id: "b", label: "The loss doesn't count until the short is closed", rationale: "An open loss is already in your equity, and waiting can make it bigger. Without a stop nothing limits it." },
      { id: "c", label: "It can lose at most 99.95 a unit, the price it sold at", rationale: "That's a long's limit turned around. A long can't lose more than its price; a short loses whatever price rises." },
      { id: "d", label: "Its loss has no fixed limit: price can keep rising" },
    ],
    correct: "d",
    explanation: "At a mid of 112.00 you'd buy back at 112.05: −12.10 a unit, −605.00 on 50 units before commission, about 6% of a 10,000.00 account. Price could keep rising. A short needs a stop above the entry, sized like any trade.",
    lesson: "1.1.2",
    concepts: ["long-and-short", "stop-loss-order"],
    hints: [
      "Compare the most a long can lose with the most a short can lose.",
      "A long's loss stops when price reaches zero. What stops a rising price?",
      "Only a stop, set before entry, limits a short's loss.",
    ],
  },

  // 1.1.3 · Which price is "the price"?
  {
    id: "q-1.1.3-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which price are LABX candles drawn from?",
    options: [
      { id: "a", label: "The bid", rationale: "Many FX and CFD platforms plot the bid, but LABX candles are drawn from the mid." },
      { id: "b", label: "The mid, halfway between bid and ask" },
      { id: "c", label: "The ask", rationale: "The ask is what buyers pay. LABX plots the mid, 0.05 below it." },
      { id: "d", label: "The last trade", rationale: "Stock charts usually plot the last trade. LABX plots the mid, halfway between bid and ask." },
    ],
    correct: "b",
    explanation: "LABX candles are drawn from the mid, halfway between the bid and the ask. Stock charts usually plot the last trade and many FX platforms the bid, so check which price a chart shows before reading your stop against it.",
    lesson: "1.1.3",
    concepts: ["price-types"],
  },
  {
    id: "q-1.1.3-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "You're long LABX with a stop at 97.40. What is the highest mid at which the stop triggers?",
    numeric: { answer: 97.45, tolerance: 0, unit: "vUSD" },
    explanation: "A long's stop sells, so it triggers when the bid reaches it. Bid = mid − 0.05, so the bid is 97.40 when the mid is 97.45. Any lower mid triggers it too; a higher one doesn't.",
    lesson: "1.1.3",
    concepts: ["price-types", "stop-loss-order"],
    hints: ["Which quote closes a long: the bid or the ask?", "A long's stop triggers when the bid reaches it. Bid = mid − 0.05.", "Solve mid − 0.05 = 97.40."],
    vary: {
      fields: { stop: [95, 99.5, 0.1] },
      answer: "round(stop + 0.05, 2)",
      prompt: "You're long LABX with a stop at {stop:2}. What is the highest mid at which the stop triggers?",
      explanation: "A long's stop sells, so it triggers when the bid reaches it. Bid = mid − 0.05, so the bid is {stop:2} when the mid is {answer:2}. Any lower mid triggers it too; a higher one doesn't.",
      hint: "Solve mid − 0.05 = {stop:2}.",
    },
  },
  {
    id: "q-1.1.3-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "You're short LABX with a stop at 102.00. The chart, drawn from the mid, peaked at 101.96 this hour. Your trade history says the short was stopped out at 102.00.",
    prompt: "What happened?",
    options: [
      { id: "a", label: "A platform error: the chart never reached the stop", rationale: "The chart shows the mid. A short's stop triggers on the ask, 0.05 higher: 101.96 + 0.05 = 102.01." },
      { id: "b", label: "The stop triggered on the bid, which sits above the mid", rationale: "The bid is below the mid, not above. A short's stop is a buy, and buys trigger on the ask." },
      { id: "c", label: "The ask reached 102.00: it runs 0.05 above the mid the chart shows" },
      { id: "d", label: "Stops trigger on the close, and this hour closed above 102.00", rationale: "The chart peaked at 101.96, so no close was above 102.00. Stops act on live quotes, not on closes." },
    ],
    correct: "c",
    explanation: "A short's stop is a buy, so it triggers on the ask. With the mid at 101.96 the ask was 102.01, through the stop. The chart plots the mid, so it never showed 102.00. Wider spreads make the gap bigger.",
    lesson: "1.1.3",
    concepts: ["price-types", "stop-loss-order"],
    hints: ["Which price does the chart plot, and which price closes a short?", "A short's stop triggers on the ask: mid + 0.05.", "At a mid of 101.96, the ask is 102.01."],
  },

  // 1.1.4 · Commission, fees and the cost stack
  {
    id: "q-1.1.4-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "You buy 43 units of LABX at the ask, 100.05. Commission is 0.05% of the fill value, rounded up to the cent. What is the commission, in vUSD?",
    numeric: { answer: 2.16, tolerance: 0, unit: "vUSD" },
    explanation: "Fill value: 43 × 100.05 = 4,302.15. 0.05% of it is 2.151075, and any fraction of a cent rounds up: 2.16. Rounding to the nearest cent would give 2.15.",
    lesson: "1.1.4",
    concepts: ["cost-stack", "trading-costs"],
    hints: [
      "Commission is charged on the fill value: units × price.",
      "0.05% is 0.0005. Multiply, then round any fraction of a cent up.",
      "Fill value: 43 × 100.05 = 4,302.15. Times 0.0005 = 2.151075.",
    ],
    vary: {
      fields: { units: [11, 99, 1], ask: [50.05, 150.05, 1] },
      answer: "commission(units * ask)",
      prompt: "You buy {units} units of LABX at the ask, {ask:2}. Commission is 0.05% of the fill value, rounded up to the cent. What is the commission, in vUSD?",
      explanation: "Fill value: {units} × {ask:2} = {units * ask:2}. 0.05% of it is {units * ask * 0.0005:6}, and any fraction of a cent rounds up: {answer:2}.",
      hint: "Fill value: {units} × {ask:2} = {units * ask:2}. Times 0.0005 = {units * ask * 0.0005:6}.",
    },
  },
  {
    id: "q-1.1.4-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "A trade's gross result is +200.00. Which costs can stand between that and your net result?",
    options: [
      { id: "a", label: "Spread, commission, slippage, financing and account fees" },
      { id: "b", label: "Only commission: the spread is already in the price", rationale: "The spread is a cost too: you buy above the mid and sell below it. A gross result measured on the mid doesn't include it." },
      { id: "c", label: "Spread and commission, but only on losing trades", rationale: "Costs are paid on every trade, winning or losing. They shrink winners and enlarge losers." },
      { id: "d", label: "Only the costs shown on the ticket before you send it", rationale: "The ticket can show commission, but slippage and overnight financing appear later: at the fill or at the cut-off." },
    ],
    correct: "a",
    explanation: "The cost stack: the spread, a commission on each fill, slippage when a fill comes worse than expected, financing on leveraged positions held overnight, and data or platform fees. Each comes off the gross result, win or lose.",
    lesson: "1.1.4",
    concepts: ["cost-stack"],
  },
  {
    id: "q-1.1.4-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "A broker advertises zero commission with a 0.40 spread. Your current broker charges 0.05% per fill with a 0.10 spread. You plan round trips of 50 LABX at a mid of 100.00.",
    prompt: "Which statement is right?",
    options: [
      { id: "a", label: "The zero-commission broker is cheaper: there's no fee", rationale: "No fee, but a 0.40 spread costs 50 × 0.40 = 20.00 a round trip, against 10.01 at your broker." },
      { id: "b", label: "Your current broker is cheaper: 10.01 against 20.00 a round trip" },
      { id: "c", label: "They cost the same: brokers price to match each other", rationale: "Nothing makes their costs equal. Add up each round trip: 10.01 against 20.00." },
      { id: "d", label: "You can't compare them until you know whether the trade wins", rationale: "Costs are known before the trade: the spread and commission don't depend on the result." },
    ],
    correct: "b",
    explanation: "Current broker: 50 × 0.10 = 5.00 of spread plus 2.51 + 2.50 commission = 10.01. Zero commission: 50 × 0.40 = 20.00, all in the spread. The cost didn't disappear; it moved into the spread and doubled.",
    lesson: "1.1.4",
    concepts: ["cost-stack", "trading-costs"],
    hints: [
      "Add up each broker's full round trip, not just the commission line.",
      "Spread cost = units × spread. Commission is paid on both fills.",
      "Zero commission: 50 × 0.40 = 20.00. Current: 5.00 + 2.51 + 2.50.",
    ],
  },

  // 1.1.5 · Round trips and break-even
  {
    id: "q-1.1.5-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 1,
    prompt: "LABX trades near a mid of 100.00, with a 0.10 spread and 0.05% commission per fill. Roughly how far must the mid move in your favour, per unit, to cover a round trip's costs?",
    numeric: { answer: 0.2, tolerance: 0.01, unit: "vUSD" },
    explanation: "The spread costs 0.10 a unit, crossed once. Each fee is about 0.05% of 100.00 = 0.05 a unit, paid twice. Together: about 0.20. Counting one fee would give 0.15.",
    lesson: "1.1.5",
    concepts: ["break-even-move", "trading-costs"],
    hints: ["Count the spread once and the commission twice.", "Each fee is about 0.05% of the price, per unit.", "0.10 + 0.05 + 0.05."],
    vary: {
      fields: { mid: [40, 200, 20] },
      answer: "round(0.1 + 0.001 * mid, 2)",
      prompt: "LABX trades near a mid of {mid:2}, with a 0.10 spread and 0.05% commission per fill. Roughly how far must the mid move in your favour, per unit, to cover a round trip's costs?",
      explanation: "The spread costs 0.10 a unit, crossed once. Each fee is about 0.05% of {mid:2} = {0.0005 * mid:2} a unit, paid twice. Together: about {answer:2}.",
      hint: "0.10 + {0.0005 * mid:2} + {0.0005 * mid:2}.",
    },
  },
  {
    id: "q-1.1.5-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "Your LABX round trip costs about 0.20 a unit. Your target is a mid move of 0.80 a unit. What percentage of the gross gain at the target goes to costs?",
    numeric: { answer: 25, tolerance: 0.5, unit: "%" },
    explanation: "Cost share = cost ÷ gross gain = 0.20 ÷ 0.80 = 0.25, or 25%. The same 0.20 would be 50% of a 0.40 target and 5% of a 4.00 one.",
    lesson: "1.1.5",
    concepts: ["break-even-move"],
    hints: ["Divide the cost by the gross gain, then turn it into a percentage.", "Cost share = round-trip cost ÷ planned move × 100.", "0.20 ÷ 0.80 = 0.25."],
    vary: {
      fields: { target: [0.4, 4, 0.2] },
      answer: "round(0.2 / target * 100, 1)",
      prompt: "Your LABX round trip costs about 0.20 a unit. Your target is a mid move of {target:2} a unit. What percentage of the gross gain at the target goes to costs?",
      explanation: "Cost share = cost ÷ gross gain = 0.20 ÷ {target:2} = {answer:1}%. A bigger target shrinks the share; a smaller one grows it.",
      hint: "0.20 ÷ {target:2} = {0.2 / target:3}.",
    },
  },
  {
    id: "q-1.1.5-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "Trader A takes 20 trades a day, aiming for 0.30 a unit each. Trader B takes 2 trades a day, aiming for 3.00. Both trade 100 LABX units, with round trips of about 0.20 a unit.",
    prompt: "Whose results do costs hurt most, and why?",
    options: [
      { id: "a", label: "A's: costs take about 67% of each planned gain, 20 times a day" },
      { id: "b", label: "B's: bigger targets mean bigger costs", rationale: "Costs depend on size and price, not on the target. B pays the same 0.20 a unit, under 7% of a 3.00 target." },
      { id: "c", label: "Neither: each round trip costs the same", rationale: "Each costs about the same, but A pays it ten times as often, against gains a tenth the size." },
      { id: "d", label: "B's: holding positions longer adds more spread", rationale: "The spread is crossed once per round trip, however long you hold. LABX charges nothing for holding." },
    ],
    correct: "a",
    explanation: "A pays about 0.20 to chase 0.30: two-thirds of each planned gain, 20 times a day, about 400.20 in costs on 100 units at 100.00. B pays the same 0.20 against 3.00, under 7%, twice a day: about 40.02.",
    lesson: "1.1.5",
    concepts: ["break-even-move", "trading-costs"],
    hints: [
      "Compare each trader's cost with the gain they're aiming for.",
      "Cost share = 0.20 ÷ target. Then count how often each pays it.",
      "A: 0.20 ÷ 0.30 ≈ 67%. B: 0.20 ÷ 3.00 ≈ 7%.",
    ],
  },

  // 1.1.6 · P&L in ticks, points, pips and units
  {
    id: "q-1.1.6-1",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 1,
    prompt: "You're long 40 units of LABX and the price rises 0.85. What is your P&L before costs, in vUSD?",
    numeric: { answer: 34, tolerance: 0.01, unit: "vUSD" },
    explanation: "P&L = units × price change = 40 × 0.85 = 34.00 vUSD. On LABX each point is worth 1.00 per unit, so 0.85 of a point on 40 units is 34.00.",
    lesson: "1.1.6",
    concepts: ["point-value"],
    hints: ["P&L = units × price change.", "Each LABX point is worth 1.00 vUSD per unit.", "40 × 0.85."],
    vary: {
      fields: { units: [10, 80, 5], move: [0.25, 3, 0.05] },
      answer: "round(units * move, 2)",
      prompt: "You're long {units} units of LABX and the price rises {move:2}. What is your P&L before costs, in vUSD?",
      explanation: "P&L = units × price change = {units} × {move:2} = {answer:2} vUSD. On LABX each point is worth 1.00 per unit.",
      hint: "{units} × {move:2}.",
    },
  },
  {
    id: "q-1.1.6-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "You buy 20,000 units of EUR/USD at 1.0850 and sell at 1.0895. What is your P&L before costs, in USD?",
    numeric: { answer: 90, tolerance: 0.01, unit: "USD" },
    explanation: "1.0895 − 1.0850 = 0.0045, which is 45 pips. On 20,000 units a pip is worth 20,000 × 0.0001 = 2.00 USD, so the P&L is 45 × 2.00 = 90.00 USD.",
    lesson: "1.1.6",
    concepts: ["point-value"],
    hints: ["Count the move in pips: one pip is 0.0001.", "Pip value = units × 0.0001.", "45 pips × 2.00 USD."],
    vary: {
      fields: { units: [10000, 50000, 10000], pips: [10, 80, 5] },
      answer: "round(units * 0.0001 * pips, 2)",
      prompt: "You buy {units} units of EUR/USD at 1.0850 and sell at {1.085 + pips * 0.0001:4}. What is your P&L before costs, in USD?",
      explanation:
        "{1.085 + pips * 0.0001:4} − 1.0850 = {pips * 0.0001:4}, which is {pips} pips. On {units} units a pip is worth {units} × 0.0001 = {units * 0.0001:2} USD, so the P&L is {pips} × {units * 0.0001:2} = {answer:2} USD.",
      hint: "{pips} pips × {units * 0.0001:2} USD.",
    },
  },
  {
    id: "q-1.1.6-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "A friend says their trade 'made 10 points'. What do you need to know before you can say how much money that is?",
    options: [
      { id: "a", label: "Nothing: 10 points is always 10.00", rationale: "A point is worth 1.00 only per LABX unit. On 30 units it's 30.00; on a futures contract it depends on the multiplier." },
      { id: "b", label: "The direction of the trade", rationale: "Direction says whether 10 points is a gain or a loss, not how much money it is." },
      { id: "c", label: "Only the instrument's name", rationale: "The instrument gives the value per point, but not how many units or contracts were held." },
      { id: "d", label: "The position size and the value of one point" },
    ],
    correct: "d",
    explanation: "Money = points × size × value per point. 10 points on 1 LABX unit is 10.00 vUSD; on 30 units, 300.00; on one contract with a multiplier of 100, 1,000.00. The points alone say nothing about the money.",
    lesson: "1.1.6",
    concepts: ["point-value"],
    hints: [
      "Think of the formula that turns a price move into money.",
      "Money = move × size × value per point.",
      "10 points on 1 unit and on 30 units are different amounts.",
    ],
  },

  // 1.1.7 · The quote screen and the order ticket
  {
    id: "q-1.1.7-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "A quote line reads: XYZ · Last 24.31 · Bid 24.30 · Ask 24.33. You buy now with a market order. Which price do you expect to pay?",
    options: [
      { id: "a", label: "24.30, the bid", rationale: "The bid is what buyers offer, so it's what you'd get selling. A market buy pays the ask." },
      { id: "b", label: "24.31, the last price", rationale: "The last price is a trade that already happened. Your buy fills against the sellers waiting at the ask." },
      { id: "c", label: "24.33, the ask" },
      { id: "d", label: "24.315, the midpoint", rationale: "The mid is a reference halfway between bid and ask. No market order fills there." },
    ],
    correct: "c",
    explanation: "A market buy fills against the sellers' best offer, the ask: 24.33. The last price, 24.31, is a trade that already happened, and the bid, 24.30, is what a seller would get.",
    lesson: "1.1.7",
    concepts: ["price-types", "bid-ask-spread"],
  },
  {
    id: "q-1.1.7-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt: "Your balance is 9,874.20. You hold one open long of 60 units bought at 101.45, and the mid is now 102.30. What is your equity, in vUSD?",
    numeric: { answer: 9925.2, tolerance: 0.01, unit: "vUSD" },
    explanation: "Open P&L at the mid: 60 × (102.30 − 101.45) = +51.00. Equity = balance + open P&L = 9,874.20 + 51.00 = 9,925.20. The entry fee is already in the balance, so don't take it off again.",
    lesson: "1.1.7",
    concepts: ["balance-and-equity"],
    hints: ["Equity = balance + the open P&L of positions, valued at the mid.", "Open P&L of a long = units × (mid − entry price).", "60 × (102.30 − 101.45) = 51.00."],
    vary: {
      fields: { balance: [9800, 10200, 0.01], units: [10, 80, 10], entry: [98.05, 102.05, 0.1], mid: [97.5, 104, 0.05] },
      answer: "round(balance + units * (mid - entry), 2)",
      prompt: "Your balance is {balance:2}. You hold one open long of {units} units bought at {entry:2}, and the mid is now {mid:2}. What is your equity, in vUSD?",
      explanation:
        "Open P&L at the mid: {units} × ({mid:2} − {entry:2}) = {units * (mid - entry):2}. Equity = balance + open P&L = {balance:2} + ({units * (mid - entry):2}) = {answer:2}. The entry fee is already in the balance.",
      hint: "{units} × ({mid:2} − {entry:2}) = {units * (mid - entry):2}.",
    },
  },
  {
    id: "q-1.1.7-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "Your plan: buy 25 LABX at market with a stop at 97.50. The ticket on screen reads: LABX · Sell · 25 units · Market · Stop 97.50.",
    prompt: "What should you do?",
    options: [
      { id: "a", label: "Send it: the size and the stop match the plan", rationale: "Size and stop match, but the side is Sell. That opens a short, a bet on a fall your plan doesn't make." },
      { id: "b", label: "Change the side to Buy, read the ticket again, then send" },
      { id: "c", label: "Send it, then fix the side once the order has filled", rationale: "After the fill you hold a position you never planned and pay costs to undo it. Fix the ticket first." },
      { id: "d", label: "Remove the stop so the order fills faster", rationale: "A stop doesn't slow an entry. Removing it leaves the loss with no limit." },
    ],
    correct: "b",
    explanation: "The side is wrong: Sell would open a short, a bet against your plan. Fix it before sending, then read the rest of the ticket once more. Fixing it after the fill means paying costs twice for a position you never planned.",
    lesson: "1.1.7",
    concepts: ["order-ticket"],
    hints: ["Compare the ticket with the plan field by field.", "Side, units, type, stop: which one differs?", "The plan says buy; the ticket says Sell."],
  },
];

// ─── New glossary terms ─────────────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  {
    id: "borrow-fee",
    term: "Borrow fee",
    definition: "The fee a short seller pays to borrow shares, charged for as long as the short stays open.",
    plain: "Rent on the shares you borrowed so you could sell them.",
    related: ["short", "commission", "overnight-financing"],
    lesson: "1.1.2",
  },
  {
    id: "last-price",
    term: "Last price",
    definition: "The price of the most recent trade. Stock charts usually plot it; LABX charts plot the mid.",
    plain: "Where the latest deal happened, not necessarily a price you can trade at now.",
    related: ["bid", "ask", "mid-price", "quote"],
    lesson: "1.1.3",
    aka: ["Last"],
  },
  {
    id: "quote",
    term: "Quote",
    definition: "The current bid and ask for an instrument, often shown with the last price and the day's range.",
    plain: "The two prices on offer right now: one to sell at, one to buy at.",
    related: ["bid", "ask", "spread", "last-price"],
    lesson: "1.1.3",
  },
  {
    id: "overnight-financing",
    term: "Overnight financing",
    definition: "Interest charged or paid for holding a leveraged position, such as a CFD or forex trade, past the daily cut-off.",
    plain: "A nightly charge for keeping a position open with borrowed money.",
    related: ["leverage", "commission", "borrow-fee"],
    lesson: "1.1.4",
    aka: ["Swap", "Rollover"],
  },
  {
    id: "payment-for-order-flow",
    term: "Payment for order flow",
    definition: "Money a broker receives for sending clients' orders to a particular firm to be filled.",
    plain: "How some 'zero commission' brokers get paid: by the firm that fills your orders.",
    related: ["commission", "spread", "market-maker"],
    lesson: "1.1.4",
    aka: ["PFOF"],
  },
  {
    id: "round-trip",
    term: "Round trip",
    definition: "Opening a position and closing it again. You pay commission twice and cross the spread once.",
    plain: "In and out of a trade: its full cost is paid only once you've done both.",
    related: ["commission", "spread", "break-even"],
    lesson: "1.1.5",
  },
  {
    id: "break-even",
    term: "Break-even",
    definition: "The exit price, or win rate, at which a trade or method neither makes nor loses money after costs.",
    plain: "The point where the costs are covered: no gain, no loss.",
    related: ["round-trip", "commission", "win-rate"],
    lesson: "1.1.5",
  },
  {
    id: "point",
    term: "Point",
    definition: "A price move of 1.00. On LABX, one point on one unit is worth 1.00 vUSD.",
    plain: "One whole step of price: from 100.00 to 101.00 is one point.",
    related: ["tick", "pip", "contract-multiplier"],
    lesson: "1.1.6",
  },
  {
    id: "pip",
    term: "Pip",
    definition: "The usual price step in most currency pairs, 0.0001. On 10,000 units of EUR/USD it is worth 1.00 USD.",
    plain: "The small step forex prices are counted in.",
    related: ["point", "tick", "lot"],
    lesson: "1.1.6",
  },
  {
    id: "lot",
    term: "Lot",
    definition: "A standard block of units, such as 100,000 units of a currency pair in forex.",
    plain: "A ready-made trade size: you order 1 lot instead of 100,000 units.",
    related: ["unit", "pip", "position-size"],
    lesson: "1.1.6",
  },
  {
    id: "contract-multiplier",
    term: "Contract multiplier",
    definition: "The money one futures contract gains or loses for each point of price movement.",
    plain: "What one point is worth on one contract.",
    related: ["point", "tick", "notional-value"],
    lesson: "1.1.6",
  },
  {
    id: "order-ticket",
    term: "Order ticket",
    definition: "The form where you set an order's instrument, side, size, type, price, stop and target before sending it.",
    plain: "The order form you check before pressing Send.",
    related: ["market-order", "limit-order", "stop-loss"],
    lesson: "1.1.7",
  },
  {
    id: "fat-finger-error",
    term: "Fat-finger error",
    definition: "A typing mistake in an order, such as an extra zero in the size or the wrong side.",
    plain: "A slip of the finger that sends the wrong order.",
    related: ["order-ticket", "position-size"],
    lesson: "1.1.7",
    aka: ["Fat finger"],
  },
];

// ─── New concepts ───────────────────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "long-and-short",
    name: "Long and short",
    category: "market_fundamentals",
    summary: "A long profits from a rise and closes at the bid; a short profits from a fall and closes at the ask.",
    body: [
      "A long buys first and sells later; a short sells first and buys back later. Every buy fills at the ask and every sale at the bid, so a long opens at the ask and closes at the bid, and a short does the reverse. The spread costs both directions the same.",
      "A long can lose at most what it paid, because price can't fall below zero. A short loses whatever price rises, with no fixed ceiling, so it needs a stop above the entry, sized like any other trade. Shorting stocks also means borrowing shares and paying a borrow fee; LABX shorts have neither.",
    ],
    example: "Short 30 LABX at the bid, 99.95. The mid falls to 97.00 and you buy back at the ask, 97.05: 30 × 2.90 = +87.00 before commission, +84.04 after fees of 1.50 and 1.46.",
    related: ["bid-ask-spread", "stop-loss-order", "price-types"],
    missions: [],
    lessons: ["1.1.2"],
  },
  {
    id: "price-types",
    name: "Price types",
    category: "market_fundamentals",
    summary: "Last, bid, ask and mid are different prices; charts plot one of them, and stops trigger on the side that closes the position.",
    body: [
      "The last price is the latest trade; the bid and ask are the quote now; the mid sits halfway between them. Stock charts usually plot the last, many FX and CFD platforms plot the bid, and LABX plots the mid.",
      "Orders don't trigger on the chart. A long's stop triggers when the bid reaches it and a short's when the ask does, half a spread away from the mid. When spreads widen, at the open or around news, a stop can trigger while the chart barely moves.",
    ],
    example: "A short's stop sits at 101.00. The LABX chart peaks at 100.97, but at that moment the ask is 101.02, so the stop triggers and fills at 101.00.",
    related: ["bid-ask-spread", "stop-loss-order", "long-and-short"],
    missions: [],
    lessons: ["1.1.3"],
  },
  {
    id: "cost-stack",
    name: "Cost stack",
    category: "market_fundamentals",
    summary: "Spread, commission, slippage, financing and fees that stand between a gross and a net result.",
    body: [
      "A trade's gross result is the price move times the size. Before any of it is yours, the spread, the commission on each fill, any slippage, overnight financing on leveraged positions and account fees come off.",
      "Commission comes in several models: a percentage of the fill value (LABX: 0.05%, rounded up to the cent), a fixed amount per share or contract, or zero. 'Zero commission' is not zero cost: such brokers earn through wider spreads or payment for order flow.",
    ],
    example: "Long 100 units while the mid rises from 100.00 to 102.00: 200.00 gross. Spread 10.00, commissions 5.01 + 5.10, a 0.03 slip on the exit 3.00 and 2.00 of financing leave 174.89 net.",
    related: ["trading-costs", "slippage", "break-even-move"],
    missions: [],
    lessons: ["1.1.4"],
  },
  {
    id: "break-even-move",
    name: "Break-even move",
    category: "market_fundamentals",
    summary: "The price move needed to cover a round trip's costs before any gain.",
    body: [
      "A round trip crosses the spread once and pays commission twice, so the mid has to move your way by about the spread plus two fees before closing breaks even: about 0.20 a unit on LABX near 100.00.",
      "The same cost takes a bigger share of a small target: 0.20 is 50% of a 0.40 gain and 5% of a 4.00 gain. Trading often with small targets pays that share again and again, so check that a target is worth the costs before entering.",
    ],
    example: "Long 100 LABX filled at 100.05: at a mid of 100.21 you sell at 100.16, gross 11.00, fees 5.01 + 5.01, net +0.98; at 100.20 the net is −0.02. A short filled at 99.95 breaks even at a mid of 99.80.",
    related: ["trading-costs", "cost-stack", "reward-to-risk"],
    missions: [],
    lessons: ["1.1.5"],
  },
  {
    id: "point-value",
    name: "Point value",
    category: "market_fundamentals",
    summary: "The money a one-point move is worth for a position: units or contracts times the value per point.",
    body: [
      "Price moves are counted in ticks (the smallest step, 0.01 on LABX), points (1.00) or, in forex, pips (0.0001 in most pairs). None of these is money until you multiply by the size and by the value per point.",
      "On LABX a point is worth 1.00 vUSD per unit. On 10,000 units of EUR/USD a pip is worth 1.00 USD. A futures contract has a multiplier, the money per point for one contract. The same percentage move can be worth very different amounts, so convert every move into money and into a share of the account.",
    ],
    example: "30 LABX units × 1.25 points = 37.50 vUSD, 0.375% of 10,000.00. 30 pips on 10,000 units of EUR/USD = 30.00 USD. One illustrative LABX future of 100 units: 1.00 vUSD a tick.",
    related: ["position-sizing", "risk-per-trade", "exposure"],
    missions: [],
    lessons: ["1.1.6"],
  },
  {
    id: "balance-and-equity",
    name: "Balance and equity",
    category: "market_fundamentals",
    summary: "Balance counts closed results after costs; equity adds the open P&L of current positions.",
    body: [
      "Balance is deposits plus realised P&L, minus every fee already paid, including the entry commission of a position that is still open. Equity is balance plus the unrealised P&L of open positions, valued at the mid.",
      "Equity is what the account is worth right now, so MARKET//LAB calculates risk percentages on equity. The difference between the two is the open P&L: it becomes realised, and moves into the balance, only when the position closes.",
    ],
    example: "Buy 50 LABX at 100.05: the 2.51 fee takes the balance from 10,000.00 to 9,997.49. With the mid at 99.95 the open P&L is −5.00, so equity is 9,992.49.",
    related: ["risk-per-trade", "drawdown", "trading-costs"],
    missions: [],
    lessons: ["1.1.7"],
  },
  {
    id: "order-ticket",
    name: "Order ticket",
    category: "market_fundamentals",
    summary: "The form that turns a decision into an order; checking side, size, type, price and stop prevents costly errors.",
    body: [
      "The ticket holds the instrument, the side, the size, the order type and price, and the stop and target. Each field carries out one part of the plan; the stop and the size together set the loss if you're wrong.",
      "Most costly mistakes happen here rather than in the analysis: the wrong side, an extra zero, a missing stop. One read from top to bottom against the plan, before pressing Send, catches them.",
    ],
    example: "Plan: buy 40 LABX at market, stop 98.00. Filled at 100.05, the stop loses 85.97 with fees. A ticket with 400 units would lose 859.61: one extra zero, ten times the risk.",
    related: ["stop-loss-order", "position-sizing", "trading-plan"],
    missions: [],
    lessons: ["1.1.7"],
  },
];

/** How the unit introduces itself on the course map. */
const INTRO: UnitIntro = {
  summary: "The prices you actually trade at and what each trade costs: bid and ask, long and short, commission, break-even, and P&L in money. It comes before any chart because costs are the one certain part of a trade, and because LABX charts are drawn from the mid, which needs the bid and ask first.",
  outcomes: [
    "Name the bid, ask, mid and last, and say which one fills each order and triggers each stop.",
    "Work out the P&L of a long and of a short from the correct side of the spread.",
    "Calculate commission on each fill and the break-even move of a round trip.",
    "Turn ticks, points and pips into money and into a share of your account.",
    "Read a quote line and the account panel, and check an order ticket before you send it.",
  ],
  buildsOn: "Lesson 0.1.1: a price is where a buyer and a seller agree, and the bid and ask are the best ones waiting. In 0.2.5 and 0.2.6 you judged results after costs; here you learn to count those costs.",
};

/** Unit 1.1 · Prices, quotes and costs (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_1_1: UnitContent = { intro: INTRO, lessons: [L112, L113, L114, L115, L116, L117], questions: QUESTIONS, terms: TERMS, concepts: CONCEPTS };
