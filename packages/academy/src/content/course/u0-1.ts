import type { CandleData, ChartLayer, ChartSpec, Concept, GlossaryTerm, Lesson, Question, TaskData, UnitContent } from "../../types";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** A flat candle: level 0 charts are lines, so candles only mark a value. */
const flat = (p: number): CandleData => ({ o: p, h: p, l: p, c: p });
const p2 = (v: number) => v.toFixed(2);
const round2 = (v: number) => Math.round(v * 100) / 100;

/** A call auction with one-unit orders: buyers pay at most their price, sellers accept at least theirs. */
interface Book {
  buyers: number[];
  sellers: number[];
}

function willing(book: Book, price: number) {
  const buyers = book.buyers.filter((x) => x >= price - 1e-9).length;
  const sellers = book.sellers.filter((x) => x <= price + 1e-9).length;
  return { buyers, sellers, units: Math.min(buyers, sellers) };
}

const many = (n: number, one: string, more: string) => `${n} ${n === 1 ? one : more}`;

/** Slider feedback for every price on the grid, counted from the book (no hand-typed counts). */
function auctionFeedback(book: Book, from: number, to: number, step: number, best: number) {
  const n = Math.round((to - from) / step);
  return Array.from({ length: n + 1 }, (_, i) => {
    const p = round2(from + i * step);
    const w = willing(book, p);
    const head = `At ${p2(p)}, ${many(w.buyers, "buyer", "buyers")} will pay that much and ${many(w.sellers, "seller", "sellers")} will accept it: ${many(w.units, "unit trades", "units trade")}.`;
    const tail = Math.abs(p - best) < 1e-9 ? " No other price clears more." : w.buyers > w.sellers ? " Sellers are the short side here: try a higher price." : w.buyers < w.sellers ? " Buyers are the short side here: try a lower price." : "";
    return { from: p, to: p, text: head + tail };
  });
}

/** Book charts: buyers in the left column, sellers in the right, the last trade as a dash in the middle. */
const buyMarks = (prices: number[]): ChartLayer[] => prices.map((p) => ({ kind: "marker", index: 0, price: p, label: `BUY ${p2(p)}`, role: "up" }));
const sellMarks = (prices: number[]): ChartLayer[] => prices.map((p) => ({ kind: "marker", index: 2, price: p, label: `SELL ${p2(p)}`, role: "down" }));
const bookChart = (layers: ChartLayer[], describe: string): ChartSpec => ({
  candles: [flat(100), flat(100), flat(100)],
  layers,
  range: [99.6, 100.4],
  height: 320,
  describe,
});

/** Card-sort on the bias-spotter widget: a wrong pick explains that option, then the card's clue. */
interface SortCard {
  id: string;
  text: string;
  answer: string;
  correct: string;
  clue: string;
  /** Rationales for the most tempting wrong picks, in place of the generated one. */
  override?: Record<string, string>;
}
function cardSort(options: { id: string; label: string; what: string }[], cards: SortCard[]): TaskData {
  return {
    options: options.map(({ id, label }) => ({ id, label })),
    cards: cards.map((c) => ({
      id: c.id,
      text: c.text,
      answer: c.answer,
      correct: c.correct,
      rationales: Object.fromEntries(options.filter((o) => o.id !== c.answer).map((o) => [o.id, c.override?.[o.id] ?? `${o.what} ${c.clue}`])),
    })),
  };
}

// ─── 0.1.1 data ─────────────────────────────────────────────────────────────

/** B2–B3: the lesson's book. At 100.00, 3 buyers and 3 sellers agree (3 units); 99.95 and 100.05 clear only 2. */
const BOOK_A: Book = { buyers: [100.3, 100.2, 100.0, 99.95, 99.8], sellers: [99.7, 99.85, 100.0, 100.05, 100.25] };
/** B4–B5: what is left after the auction at 100.00. */
const BOOK_A_LEFT: Book = { buyers: [99.95, 99.8], sellers: [100.05, 100.25] };
/** Try: 50.20 clears 3 units; 50.10 and 50.30 clear 2. */
const BOOK_TRY: Book = { buyers: [50.4, 50.3, 50.2, 50.1], sellers: [50.0, 50.1, 50.2, 50.5] };

const BOOK_A_DESCRIBE =
  "An order book. Left column, buyers paying at most 100.30, 100.20, 100.00, 99.95 and 99.80. Right column, sellers accepting at least 99.70, 99.85, 100.00, 100.05 and 100.25. A dash in the middle marks the last trade, 100.00.";
const BOOK_LEFT_DESCRIBE = "After the auction: buyers left at 99.95 and 99.80, sellers left at 100.05 and 100.25. A dash in the middle marks the last trade, 100.00.";

// ─── 0.1.2 data ─────────────────────────────────────────────────────────────

const PARTICIPANTS = [
  { id: "hedger", label: "Hedger", what: "A hedger trades to reduce a risk it already has." },
  { id: "investor", label: "Investor", what: "An investor holds for years, for income and growth." },
  { id: "institution", label: "Institution", what: "An institution moves very large orders for a fund or its clients." },
  { id: "market-maker", label: "Market maker", what: "A market maker quotes a bid and an ask and earns the spread." },
  { id: "speculator", label: "Speculator", what: "A speculator takes a risk to profit from a price move." },
  { id: "central-bank", label: "Central bank", what: "A central bank trades for a policy goal, not for profit." },
];

const PARTICIPANT_CARDS = cardSort(PARTICIPANTS, [
  {
    id: "airline",
    text: "An airline buys oil futures to fix next year's fuel cost.",
    answer: "hedger",
    correct: "Hedger. The airline already faces a fuel bill. The futures lock in its cost, whatever oil does next.",
    clue: "Here the airline already faces a fuel bill and uses futures to lock in its cost.",
    override: { speculator: "The airline isn't betting on oil. It already carries the fuel risk and trades to remove it, not to profit from a move." },
  },
  {
    id: "pension",
    text: "A pension fund buys 2 million shares over one day, with an algorithm that splits the order into small pieces.",
    answer: "institution",
    correct: "Institution. An order that big would move the price, so the fund splits it to keep its own impact small.",
    clue: "Here a fund splits a huge order so that its own size doesn't move the price.",
    override: { investor: "It may well hold for years. What sets this card apart is the size: 2 million shares, split up so the order doesn't move the price." },
  },
  {
    id: "quotes",
    text: "A firm quotes a bid and an ask on LABX all day and ends the day flat.",
    answer: "market-maker",
    correct: "Market maker. It buys at its bid, sells at its ask and earns the spread, without betting on a direction.",
    clue: "Here the firm quotes both sides all day and ends with no position.",
  },
  {
    id: "you",
    text: "You buy LABX because you expect a rise this week.",
    answer: "speculator",
    correct: "Speculator. You accept a risk for a price move. Every trade you'll place in this course is speculation.",
    clue: "Here you buy because you expect a rise: a bet on the move itself.",
  },
  {
    id: "saver",
    text: "A saver adds 200.00 to an index fund every month.",
    answer: "investor",
    correct: "Investor. Small regular amounts, held for years: the return comes from the market, not from timing it.",
    clue: "Here a saver buys a little every month and holds, whatever the price does.",
  },
  {
    id: "policy",
    text: "A central bank sells its own currency to slow its rise.",
    answer: "central-bank",
    correct: "Central bank. It trades for a policy goal, the exchange rate, not for profit.",
    clue: "Here a central bank trades its own currency to steer the exchange rate.",
  },
]);

// ─── 0.1.3 data ─────────────────────────────────────────────────────────────

const CLASSES = [
  { id: "stocks", label: "Stocks", what: "A stock is a share of one company, traded on an exchange." },
  { id: "etf-index", label: "ETFs and indices", what: "An ETF is a fund holding a basket, often tracking an index." },
  { id: "forex", label: "Forex", what: "Forex is one currency quoted against another." },
  { id: "futures", label: "Futures", what: "A futures contract trades on an exchange and expires on a set date." },
  { id: "cfd", label: "CFDs", what: "A CFD is a provider's contract on a price change; you never own the asset." },
  { id: "bonds", label: "Bonds", what: "A bond is a loan that pays interest." },
  { id: "crypto", label: "Crypto", what: "Crypto is a digital asset that trades around the clock." },
  { id: "options", label: "Options", what: "An option is a right, not a duty, to buy or sell at a fixed price." },
];

const CLASS_CARDS = cardSort(CLASSES, [
  {
    id: "eurusd",
    text: "EUR/USD",
    answer: "forex",
    correct: "Forex. A pair: how many US dollars one euro costs. It trades 24 hours a day, Sunday evening to Friday evening.",
    clue: "Here two currencies are quoted as a pair: euros priced in dollars.",
  },
  {
    id: "gold",
    text: "One gold futures contract",
    answer: "futures",
    correct: "Futures. Gold is the commodity; the contract expires, so keeping the position means rolling it to the next contract.",
    clue: "Here gold is traded through an exchange contract with an expiry date.",
    override: {
      cfd: "Both pay on gold's price, but this one is an exchange contract that expires. A CFD is a deal with a provider, with no expiry.",
      options: "A futures contract binds both sides to trade. An option gives a right that its holder can choose not to use.",
    },
  },
  {
    id: "shares",
    text: "100 shares of a listed company",
    answer: "stocks",
    correct: "Stocks. You own a slice of one company. Selling it short would need borrowed shares.",
    clue: "Here you own part of one company, bought on its exchange.",
  },
  {
    id: "bitcoin",
    text: "Bitcoin on an exchange",
    answer: "crypto",
    correct: "Crypto. It trades around the clock, even on a Saturday.",
    clue: "Here a digital asset trades on an exchange, 24/7.",
  },
  {
    id: "right",
    text: "The right to buy a share at a fixed price before a date",
    answer: "options",
    correct: "Options. A derivative, like futures and CFDs. Options come much later in the course.",
    clue: "Here you hold a right, not a duty, to buy at a fixed price before a date.",
    override: {
      futures: "Futures oblige both sides to trade. This is a right you can choose not to use: an option.",
      stocks: "It's about a share, but you don't own the share: you own the right to buy it. That's an option.",
      cfd: "A CFD pays every price change and never expires. This is a right to buy at a fixed price before a date: an option.",
    },
  },
  {
    id: "fund",
    text: "A fund that tracks 500 large companies",
    answer: "etf-index",
    correct: "ETFs and indices. One share of the fund gives you a slice of the whole basket.",
    clue: "Here one fund holds a basket that follows an index of 500 companies.",
    override: { stocks: "It trades like a share, but it holds 500 companies at once: a fund tracking an index, an ETF." },
  },
  {
    id: "govt",
    text: "A government bond paying a coupon",
    answer: "bonds",
    correct: "Bonds. A loan that pays interest, the coupon. When interest rates rise, its price falls.",
    clue: "Here you lend to a government and receive regular interest, the coupon.",
  },
  {
    id: "index-cfd",
    text: "A CFD on a stock index",
    answer: "cfd",
    correct: "CFDs. The index is only what the price tracks. Your counterparty is the provider, not an exchange.",
    clue: "Here you hold a contract with a provider that pays the index's price change.",
    override: { "etf-index": "The index is only what the price follows. You hold a contract with a provider, not a fund: that's a CFD." },
  },
]);

// ─── 0.1.4 data ─────────────────────────────────────────────────────────────

/** The benchmark ghost: LABX bought on day one and held, % return at each month-end (after costs). */
const GHOST = [0, 0.8, 1.5, 1.1, 2.4, 3.2, 2.9, 4.1, 5.0, 5.8, 6.9, 8.1, 9.0];
/** Dana's trading before costs, % at each month-end. */
const DANA_GROSS = [0, 1.0, 2.6, 3.0, 4.2, 5.5, 6.1, 7.4, 8.8, 10.1, 11.0, 12.6, 14.0];
/** Dana's round trips so far (3 or 4 a month, 40 in the year). */
const DANA_TRADES = [0, 3, 7, 10, 13, 17, 20, 23, 27, 30, 33, 37, 40];
/** After costs: about 0.2% of the account per round trip. Ends at 14.0 − 40 × 0.2 = 6.0. */
const DANA_NET = DANA_GROSS.map((g, i) => round2(g - 0.2 * DANA_TRADES[i]));

// ─── 0.1.5 data ─────────────────────────────────────────────────────────────

const FAILURES = [
  { id: "no_stop", label: "Entering without a stop", what: "That tag is for an entry with no stop at all." },
  { id: "oversized", label: "Position too large", what: "That tag is for more at risk than the 100.00 limit." },
  { id: "revenge_size_up", label: "Sizing up after a loss", what: "That tag is for a bigger size right after a loss." },
  { id: "chased_entry", label: "Chasing extended moves", what: "That tag is for buying after a big run, outside the plan." },
  { id: "overtrading", label: "Trading too often", what: "That tag is for many trades with no plan behind them." },
  { id: "clean", label: "Within the rules", what: "Within the rules needs a stop, risk under 100.00 and a planned setup." },
];

const FAILURE_CARDS = cardSort(FAILURES, [
  {
    id: "t2",
    text: "Trade 2: Lee buys 80 LABX at 100.00 with the stop at 95.00. That's 400.00 at risk before costs, 4% of the account.",
    answer: "oversized",
    correct: "Position too large. 80 × 5.00 = 400.00 at risk: four times the 1% limit.",
    clue: "Here 400.00 is at risk, four times the 100.00 limit.",
  },
  {
    id: "t4",
    text: "Trade 4: Lee buys 20 LABX at 100.00 on a planned setup, stop at 98.00: 41.98 at risk with costs. The trade loses.",
    answer: "clean",
    correct: "Within the rules. A stop, risk under 100.00, a planned setup. It lost, and it was still a sound decision.",
    clue: "Here the stop, the size and the setup all follow the plan; only the result was bad.",
  },
  {
    id: "t5",
    text: "Trade 5: five minutes after trade 4's loss, Lee buys 45 LABX instead of the usual 20, stop 2.00 away.",
    answer: "revenge_size_up",
    correct: "Sizing up after a loss. The risk, 94.46 with costs, is under the limit, but the size jumped because of the last loss.",
    clue: "Here the size more than doubles minutes after a loss.",
    override: { oversized: "45 × 2.00 = 90.00, or 94.46 with costs: still under 100.00. The problem is what changed the size: the loss five minutes earlier." },
  },
  {
    id: "t7",
    text: "Trade 7: Lee buys 20 LABX at 100.00 on a planned pullback, with no stop: 'I'll watch it.'",
    answer: "no_stop",
    correct: "Entering without a stop. The loss has no limit, so the risk can't even be measured.",
    clue: "Here there's no stop at all, so the loss has no limit.",
  },
  {
    id: "t9",
    text: "Trade 9: LABX has run up 5% in three hours. Lee buys at the top of the run, with no setup from the plan.",
    answer: "chased_entry",
    correct: "Chasing extended moves. The move made the decision, not the plan.",
    clue: "Here Lee buys after a big run, without a planned setup.",
    override: { overtrading: "It's one trade, not many. What's wrong is the entry: buying at the top of a 5% run, with no setup." },
  },
  {
    id: "day12",
    text: "Day 12: Lee makes 14 trades in four hours, none from the plan's setups, each one paying the spread.",
    answer: "overtrading",
    correct: "Trading too often. Fourteen round trips of costs, and no setup behind any of them.",
    clue: "Here there are 14 trades in four hours, none of them planned.",
  },
]);

// ─── Lessons ────────────────────────────────────────────────────────────────

const L011: Lesson = {
  id: "0.1.1",
  title: "What a market is: an auction",
  topic: "market_fundamentals",
  level: "beginner",
  tier: "free",
  minutes: 5,
  summary: "A market price is the last price a buyer and a seller agreed on, and it moves when one side is in more of a hurry.",
  objectives: [
    "Explain a market price as the price at which a buyer and a seller last agreed.",
    "Find the price at which the most units change hands in a simple auction.",
    "Predict which way price moves when buyers are more eager than sellers.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" }],
  script: {
    unit: "0.1",
    courseId: "0.1.1",
    hook: {
      prompt: "LABX last traded at 100.00. A buyer arrives who wants 200 [[unit|units]] right now, and only a few sellers are offering. Where will the next trades print?",
      control: {
        kind: "choice",
        choices: [
          { id: "below", label: "Below 100.00" },
          { id: "around", label: "Around 100.00" },
          { id: "above", label: "Above 100.00" },
        ],
        answer: "above",
      },
      compare: "You picked {yours}. The hurried buyer has to take the sellers' prices, one after another, so the next trades print above 100.00.",
      concept: "market-as-auction",
    },
    learn: [
      {
        kind: "explain",
        title: "Nobody sets the price",
        text: "A [[market]] is where [[order|orders]] to buy meet orders to sell. A trade needs a buyer and a seller who agree on a price. The price on a chart is simply the last price at which that happened. Nobody sets it: it comes out of the orders.",
      },
      {
        kind: "figure",
        title: "Two queues of orders",
        figure: {
          kind: "chart",
          chart: bookChart([], BOOK_A_DESCRIBE),
          steps: [
            { text: "Buyers, one unit each. Each will pay **at most** their price.", layers: buyMarks(BOOK_A.buyers) },
            { text: "Sellers, one unit each. Each will accept **at least** their price.", layers: sellMarks(BOOK_A.sellers) },
            { text: "A buyer and a seller can trade when the buyer's price is at or above the seller's." },
          ],
        },
        concept: "market-as-auction",
      },
      {
        kind: "predict",
        title: "Run the auction",
        prompt: "Everyone trades at one price. Slide it: where do the most units change hands?",
        control: { kind: "slider", min: 99.7, max: 100.3, step: 0.05, start: 99.7, answer: 100.0, tolerance: 0, feedback: auctionFeedback(BOOK_A, 99.7, 100.3, 0.05, 100.0) },
        figure: {
          kind: "chart",
          chart: bookChart([...buyMarks(BOOK_A.buyers), ...sellMarks(BOOK_A.sellers)], BOOK_A_DESCRIBE),
          steps: [{ text: "At 100.00, three buyers and three sellers agree: 3 units trade.", layers: [{ kind: "level", price: 100.0, role: "concept", chip: true }] }],
        },
        reveal: "At each price, count the buyers who would pay it and the sellers who would accept it. Units traded is the smaller count. At 100.00 both counts are 3; at 99.95 or 100.05 only 2 units can trade. That price becomes the last trade.",
        concept: "market-as-auction",
      },
      {
        kind: "figure",
        title: "What's left after the auction",
        text: "The spread you'll pay on every LABX trade is this gap: the space between the best buyer and the best seller still waiting.",
        figure: {
          kind: "chart",
          chart: bookChart([...buyMarks(BOOK_A_LEFT.buyers), ...sellMarks(BOOK_A_LEFT.sellers)], BOOK_LEFT_DESCRIBE),
          steps: [
            { text: "Three units traded at 100.00. Still waiting: buyers at 99.95 and 99.80, sellers at 100.05 and 100.25." },
            {
              text: "The best [[bid]], 99.95, is the highest buyer left. The best [[ask]], 100.05, is the lowest seller.",
              layers: [
                { kind: "level", price: 99.95, role: "neutral" },
                { kind: "level", price: 100.05, role: "neutral" },
              ],
            },
            {
              text: "The gap, 0.10, is the [[spread]]. Its middle, 100.00, is the mid that LABX charts draw.",
              layers: [
                { kind: "bracket", from: 99.95, to: 100.05, index: 1, label: "SPREAD 0.10" },
                { kind: "level", price: 100.0, role: "neutral" },
              ],
            },
          ],
        },
      },
      {
        kind: "predict",
        title: "An eager buyer",
        prompt: "A new buyer wants 2 units now and will pay at most 100.20. Sellers wait at 100.05 and 100.25. Where does the last price print?",
        control: {
          kind: "choice",
          choices: [
            { id: "same", label: "It stays at 100.00", feedback: "A trade needs a seller's price. The cheapest seller left asks 100.05, so that's where the next trade prints." },
            { id: "ask", label: "100.05", feedback: "Right. One unit trades at the best ask, 100.05, and that becomes the last price." },
            { id: "limit", label: "100.20", feedback: "100.20 is the buyer's limit, not a seller's price. The trade happens at a price both accept: 100.05." },
            { id: "next", label: "100.25", feedback: "The next seller wants 100.25, above the buyer's 100.20 limit, so no trade happens there." },
          ],
          answer: "ask",
        },
        figure: {
          kind: "chart",
          chart: bookChart(
            [...buyMarks(BOOK_A_LEFT.buyers), ...sellMarks(BOOK_A_LEFT.sellers), { kind: "marker", index: 0, price: 100.2, label: "NEW BUY 100.20 ×2", role: "accent" }],
            "The book after the auction, plus a new buyer for 2 units at up to 100.20. Sellers wait at 100.05 and 100.25.",
          ),
          steps: [
            { text: "One unit trades at 100.05, the best ask. The last price rises to 100.05.", layers: [{ kind: "marker", index: 1, price: 100.05, label: "LAST 100.05", role: "accent" }] },
            {
              text: "The next seller wants 100.25, above the limit. The second unit waits as a bid at 100.20.",
              layers: [
                { kind: "level", price: 100.2, role: "neutral" },
                { kind: "level", price: 100.25, role: "neutral" },
              ],
            },
          ],
        },
        reveal: "The eager buyer took the seller's price, so the last price rose from 100.00 to 100.05. The unfilled unit now waits as the best bid, 100.20, against the best ask, 100.25.",
        concept: "market-as-auction",
      },
      { kind: "callout", tone: "key", text: "Price moves when one side is in more of a hurry than the other. Nobody sets it; orders do." },
      {
        kind: "predict",
        title: "Your turn: a new book",
        prompt: "One unit per order. Buyers pay at most 50.40, 50.30, 50.20 and 50.10. Sellers accept at least 50.00, 50.10, 50.20 and 50.50. Set the price where the most units change hands.",
        control: { kind: "slider", min: 50.0, max: 50.5, step: 0.05, start: 50.0, answer: 50.2, tolerance: 0, feedback: auctionFeedback(BOOK_TRY, 50.0, 50.5, 0.05, 50.2) },
        reveal: "50.20: three buyers will pay it and three sellers will accept it, so 3 units trade. At 50.10 or 50.30 only 2 can. Count both sides, take the smaller.",
        concept: "market-as-auction",
      },
    ],
    check: ["q-0.1.1-1", "q-0.1.1-2", "q-0.1.1-3"],
    recap: {
      takeaways: [
        "A price is where a buyer and a seller last agreed. Nobody sets it; orders do.",
        "The auction price is where the most units trade: count buyers and sellers willing, take the smaller.",
        "When buyers are in more of a hurry, they take sellers' prices and the price rises.",
      ],
    },
  },
};

const L012: Lesson = {
  id: "0.1.2",
  title: "Who trades, and why",
  topic: "market_fundamentals",
  level: "beginner",
  tier: "free",
  minutes: 5,
  summary: "Every trade has someone on the other side, trading for their own reasons and often with better tools than yours.",
  objectives: [
    "Name the main market participants and the reason each one trades.",
    "Explain that every trade has a counterparty with its own horizon and information.",
    "Describe why retail traders usually face better-equipped counterparties.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" }],
  script: {
    unit: "0.1",
    courseId: "0.1.2",
    hook: {
      prompt: "Every time you buy 50 LABX, someone sells you 50. Who is most likely on the other side?",
      control: {
        kind: "choice",
        choices: [
          { id: "bear", label: "Someone who thinks price will fall" },
          { id: "dealer", label: "A dealer or market maker who earns the spread" },
          { id: "unknown", label: "Can't tell from the chart" },
        ],
      },
      compare: "You picked {yours}. Any of the three can be true. In retail FX and CFDs it's often a dealer or the broker itself, but the chart never shows who. 'Can't tell from the chart' is the honest reading.",
      concept: "market-participants",
    },
    learn: [
      {
        kind: "explain",
        title: "Two sides to every trade",
        text: "When you buy, your [[counterparty]] sells. They aren't necessarily wrong. They may have a different horizon, a different need or different information. A pension fund selling to rebalance and you buying for a quick rise can both be acting sensibly.",
      },
      {
        kind: "explain",
        title: "Who is in the market",
        text: "A [[hedger]] reduces a risk it already carries. Investors hold for years. Institutions move huge sums, often with algorithms. A [[market-maker]] quotes both sides and earns the spread. A [[speculator]] trades for a price move. Central banks act for policy, not profit. A [[retail-trader]] is an individual trading their own money, like you.",
      },
      {
        kind: "match",
        title: "Who trades for what",
        prompt: "Match each reason to the participant who trades for it.",
        columns: ["Reason", "Participant"],
        pairs: [
          { left: "Locks in next year's fuel cost", right: "Hedger" },
          { left: "Earns the spread, ends the day flat", right: "Market maker" },
          { left: "Holds for decades for dividends and growth", right: "Investor" },
          { left: "Buys because it expects a rise this week", right: "Speculator" },
          { left: "Splits a huge order over the day to avoid moving the price", right: "Institution" },
        ],
        correct: "Right. Same market, five different reasons to trade. None of them needs you to be wrong for them to be right.",
        concept: "market-participants",
      },
      {
        kind: "explain",
        title: "Different worries",
        text: "Institutions worry about their own size: a huge order can push the price against them, so they split it up. Retail traders face different problems: costs, and their own behaviour. Neither side is a villain. But the firms across from you trade full time, with faster tools and lower costs.",
      },
      {
        kind: "predict",
        title: "Who hunted the stop?",
        prompt: "A trader says: 'They hunted my stop.' Who is 'they'?",
        control: {
          kind: "choice",
          choices: [
            { id: "watcher", label: "A big trader watching my account", feedback: "Nothing on a chart shows who traded or why. Blaming a watcher can't be checked, so it teaches you nothing." },
            { id: "nobody", label: "Nobody in particular: stops gather at obvious levels", feedback: "Right. Many traders put stops in the same obvious places, so a move through that level fills them all." },
            { id: "app", label: "The app", feedback: "In MARKET//LAB, prices come from a simulation that can't see your orders. Stops get hit because price reaches them." },
          ],
          answer: "nobody",
        },
        reveal: "The market isn't a person. Stops do tend to gather just beyond obvious levels, so a move there fills many at once. But nobody's intent can be read from a chart. The useful question is whether your stop sat where everyone else's did.",
        concept: "market-participants",
      },
      { kind: "callout", tone: "key", text: "When you trade, you trade against people and firms who do this full time, often with better tools and lower costs. Plan with that in mind." },
    ],
    task: {
      widget: "bias-spotter",
      data: PARTICIPANT_CARDS,
      goal: "Six trades, six reasons. Read each card and name who is trading.",
      success: { field: "solved", eq: 6 },
      correct: "All six named. Same market, six reasons to trade, and the chart shows none of them.",
      hints: [
        "Ask why they trade: to remove a risk, to earn the spread, to bet on a move, or for a policy goal?",
        "Size and method point to an institution; small monthly amounts held for years point to an investor.",
      ],
      showMe: { solved: 6 },
      concept: "market-participants",
    },
    check: ["q-0.1.2-1", "q-0.1.2-2", "q-0.1.2-3"],
    recap: {
      takeaways: [
        "Hedgers, investors, institutions, market makers, speculators and central banks all trade, each for its own reason.",
        "Every trade has a counterparty with its own horizon, need and information. The chart doesn't show who.",
        "Across from you are full-time firms with better tools and lower costs. Plan with that in mind.",
      ],
    },
  },
};

const L013: Lesson = {
  id: "0.1.3",
  title: "A tour of the asset classes",
  topic: "market_fundamentals",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Stocks, forex, futures, CFDs, bonds and crypto differ in hours, leverage, costs and counterparty; the habits you learn on LABX carry over to all of them.",
  objectives: [
    "Name the main asset classes and one feature that sets each apart.",
    "Compare asset classes by trading hours, typical leverage, costs and gap risk.",
    "Explain which habits transfer from LABX to any instrument and which numbers don't.",
  ],
  blocks: [],
  practice: [{ kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" }],
  script: {
    unit: "0.1",
    courseId: "0.1.3",
    hook: {
      prompt: "It's Saturday. Which of these can you trade right now?",
      control: {
        kind: "choice",
        choices: [
          { id: "shares", label: "Shares on a stock exchange" },
          { id: "futures", label: "A futures contract" },
          { id: "eurusd", label: "EUR/USD" },
          { id: "bitcoin", label: "Bitcoin" },
        ],
        answer: "bitcoin",
      },
      compare: "You picked {yours}. Only Bitcoin: crypto trades 24/7. Forex and most futures pause from Friday evening to Sunday evening, and stock exchanges keep weekday sessions.",
      concept: "asset-classes",
    },
    learn: [
      {
        kind: "explain",
        title: "Families of instruments",
        text: "An [[asset-class]] is a family of instruments with its own rules, hours and costs. The main ones: [[stock|stocks]], [[etf|ETFs]] that track an [[index]], [[forex]], [[futures]] on a [[commodity]] or an index, [[cryptocurrency]], [[bond|bonds]], and [[derivative|derivatives]] such as [[cfd|CFDs]] and options.",
      },
      {
        kind: "figure",
        title: "Hours open in a normal week",
        text: "Fewer hours means more time when price can move while you can't trade. When trading reopens, price can jump: a [[gap]] past your stop.",
        figure: {
          kind: "bars",
          unit: " h",
          bars: [
            { label: "Crypto spot", value: 168 },
            { label: "Forex", value: 120 },
            { label: "Futures (daily break)", value: 115 },
            { label: "US stocks, main session", value: 32.5 },
          ],
          steps: [
            "Crypto spot never closes: 24 hours × 7 days = 168.",
            "Forex runs 24 hours a day from Sunday evening to Friday evening: 120.",
            "Futures trade nearly around the clock, Sunday to Friday, with a one-hour daily break: about 115.",
            "A US exchange's main session is 6.5 hours a day: 32.5 a week. Prices can gap overnight.",
          ],
        },
        concept: "asset-classes",
      },
      {
        kind: "explain",
        title: "Leverage, costs and who's across",
        text: "Classes differ in [[leverage]] too. Since 2018, EU retail CFD leverage has been capped between 30:1 and 2:1 by asset. Costs differ: futures add a roll, shorting stocks needs borrowed shares, CFDs charge overnight funding. And so does the counterparty: an exchange's clearing house for futures, the provider itself for a CFD.",
      },
      {
        kind: "match",
        title: "One feature each",
        prompt: "Match each feature to the asset class it describes.",
        columns: ["Feature", "Asset class"],
        pairs: [
          { left: "Expires and must be rolled", right: "Futures" },
          { left: "Quoted as a pair, one currency against another", right: "Forex" },
          { left: "Trades 24/7", right: "Crypto" },
          { left: "Shorting needs borrowed shares", right: "Stocks" },
          { left: "You never own the asset; the provider is your counterparty", right: "CFDs" },
          { left: "Price falls when interest rates rise", right: "Bonds" },
        ],
        correct: "Right. One feature is often enough to tell the classes apart, and each one changes how you trade it.",
        concept: "asset-classes",
      },
      {
        kind: "match",
        title: "What carries over from LABX",
        prompt: "LABX is one synthetic instrument. Sort each item: does it work the same on any instrument, or does it change from one class to the next?",
        columns: ["Item", "On a real instrument"],
        pairs: [
          { left: "Buying at the ask, selling at the bid", right: "Works the same" },
          { left: "Deciding the risk per trade first", right: "Works the same" },
          { left: "A stop with every entry, and sizing from it", right: "Works the same" },
          { left: "Trading hours", right: "Changes" },
          { left: "Leverage limits", right: "Changes" },
          { left: "Expiry and roll", right: "Changes" },
        ],
        correct: "Right. The habits transfer; the numbers change. Real instruments get their own units later in the course.",
        concept: "asset-classes",
      },
      { kind: "callout", tone: "info", text: "LABX is synthetic: one liquid instrument, a fixed 0.10 spread, no expiry and no leverage. The habits transfer; the numbers change." },
    ],
    task: {
      widget: "bias-spotter",
      data: CLASS_CARDS,
      goal: "Eight products. Read each card and name its asset class.",
      success: { field: "solved", eq: 8 },
      correct: "All eight sorted. Each class brings its own hours, costs and counterparty, so check them before you trade any of them.",
      hints: [
        "Look for the giveaway: a currency pair, an expiry date, a provider contract, a coupon, or trading 24/7.",
        "Futures oblige both sides to trade at a set date; an option is only a right; a CFD is a deal with a provider.",
      ],
      showMe: { solved: 8 },
      concept: "asset-classes",
    },
    check: ["q-0.1.3-1", "q-0.1.3-2", "q-0.1.3-3"],
    recap: {
      takeaways: [
        "Stocks, ETFs, forex, futures, CFDs, bonds and crypto each have their own rules, hours and costs.",
        "Classes differ in trading hours, leverage, costs, gap risk and who your counterparty is.",
        "From LABX the habits transfer: bid and ask, costs, stops, sizing. Hours, leverage and expiry change.",
      ],
    },
  },
};

const L014: Lesson = {
  id: "0.1.4",
  title: "Investing, trading and the benchmark",
  topic: "market_fundamentals",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Any trading result has to beat buy-and-hold on the same market, after costs, and the more often you trade, the bigger the edge that takes.",
  objectives: [
    "Distinguish investing from trading by holding period, turnover and source of return.",
    "Compare an active result with the buy-and-hold benchmark on the same market, after costs.",
    "Explain why frequent trading needs a larger edge to beat the benchmark.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
  ],
  script: {
    unit: "0.1",
    courseId: "0.1.4",
    hook: {
      prompt: "Over one year, Dana traded LABX 40 times and finished +6.0% after costs. [[buy-and-hold|Buying on day one and holding]] finished +9.0%. Who did better?",
      control: {
        kind: "choice",
        choices: [
          { id: "dana", label: "Dana: she was active and profitable" },
          { id: "hold", label: "Buy-and-hold" },
          { id: "same", label: "The same" },
        ],
        answer: "hold",
      },
      compare: "You picked {yours}. Buy-and-hold did better by 3.0 points, with no effort. A full comparison would also weigh the risk taken, which comes later.",
      concept: "passive-benchmark",
    },
    learn: [
      {
        kind: "explain",
        title: "Two ways to use a market",
        text: "**Investing** means holding assets for their return over years: dividends, coupons and growth, with few trades. **Trading** seeks profit from price changes over shorter horizons, and only works with a specific edge. Investing earns what the market pays. Trading adds value only if it beats that.",
      },
      {
        kind: "match",
        title: "How long do you hold?",
        prompt: "Trading styles differ mainly in how long a position stays open. Match each holding period to its style.",
        columns: ["Holding period", "Style"],
        pairs: [
          { left: "Seconds to minutes, many trades a day", right: "Scalping" },
          { left: "Minutes to hours, flat by the close", right: "Day trading" },
          { left: "Two days to a few weeks", right: "Swing trading" },
          { left: "Weeks to months", right: "Position trading" },
          { left: "Years", right: "Investing" },
        ],
        correct: "Right. The shorter the hold, the more trades a week, and the more often you pay the spread and the commission.",
        concept: "trading-styles",
      },
      {
        kind: "explain",
        title: "Costs decide the game",
        text: "[[scalping|Scalpers]] and [[day-trading|day traders]] pay costs many times a week; [[swing-trading|swing]] and [[position-trading|position traders]] far less often. Before costs, trading is close to zero-sum around the market's own return. After costs, it's negative-sum for the median trader. Costs are certain; an edge is not.",
      },
      {
        kind: "figure",
        title: "The benchmark ghost",
        text: "The ghost is your [[benchmark]]: the same market, bought and held, after costs. A trading result only counts as good if it beats it.",
        figure: {
          kind: "chart",
          chart: {
            candles: GHOST.map(flat),
            range: [-1, 15],
            height: 260,
            describe: "One year of month-end results in percent. Buy-and-hold rises to +9.0%. Dana's trading reaches +14.0% before costs but +6.0% after the costs of 40 round trips.",
          },
          steps: [
            { text: "The ghost: buy LABX on day one and hold. After costs, +9.0% at year end.", layers: [{ kind: "line", values: GHOST, role: "neutral", dashed: true, label: "GHOST" }] },
            { text: "Dana's 40 trades before costs (GROSS): +14.0%. On paper, she beat the ghost.", layers: [{ kind: "line", values: DANA_GROSS, role: "concept", dashed: true, label: "GROSS" }] },
            { text: "Each round trip costs about 0.2%. Forty of them: 8.0 points. After costs (NET): +6.0%.", layers: [{ kind: "line", values: DANA_NET, role: "accent", label: "NET" }] },
            { text: "After costs, Dana is 3.0 points behind the ghost.", layers: [{ kind: "bracket", from: 6.0, to: 9.0, index: 12, label: "−3.0" }] },
          ],
        },
        concept: "passive-benchmark",
      },
      {
        kind: "worked",
        title: "The most active fifth",
        lines: [
          "A study followed 66,465 US households, 1991–96.",
          "The most active fifth earned 11.4% a year.",
          "The market earned 17.9% a year.",
          "Gap = 17.9 − 11.4 = ?",
        ],
        ask: {
          answer: 6.5,
          tolerance: 0,
          unit: "points",
          feedback: [
            { value: 29.3, text: "That adds the two. The gap is the difference: subtract 11.4 from 17.9." },
            { value: -6.5, text: "Right size, wrong sign. The market earned more, so the gap in its favour is positive." },
          ],
          correct: "Right: 6.5 points a year behind the market.",
        },
        after: "6.5 points a year. Trading costs and frequency explained the gap, not the choice of stocks (Barber and Odean, 2000).",
        concept: "passive-benchmark",
      },
      { kind: "callout", tone: "key", text: "Every result in this course is shown after costs, next to the benchmark ghost. Beating it is the real test, and most active traders don't." },
      {
        kind: "predict",
        title: "Your turn: trade down to the ghost",
        prompt: "Before costs you made +10.0%; the ghost made +6.0%. Each round trip costs about 0.2% of the account. How many trades pull your result down to the ghost's?",
        control: {
          kind: "slider",
          min: 0,
          max: 60,
          step: 1,
          start: 0,
          unit: "trades",
          answer: 20,
          tolerance: 0,
          feedback: [
            { from: 0, to: 19, text: "Not yet: below 20 trades, costs take less than 4.0 points, so you stay above the ghost. At 10 trades you're at +8.0%." },
            { from: 20, to: 20, text: "Right: 20 × 0.2 = 4.0 points of costs, and 10.0 − 4.0 = 6.0, level with the ghost." },
            { from: 21, to: 60, text: "Too many: past 20 trades, costs drop you below the ghost. At 30 trades you're at +4.0%." },
          ],
        },
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "Before costs", value: 10.0, role: "up" },
            { label: "Costs, 20 × 0.2", value: -4.0, role: "down" },
            { label: "After costs", value: 6.0, role: "accent" },
            { label: "Benchmark ghost", value: 6.0, role: "neutral" },
          ],
          steps: ["Before costs, +10.0%. Twenty round trips at 0.2% each cost 4.0 points.", "After costs, +6.0%: exactly the ghost."],
        },
        reveal: "20 trades: the gap to close is 10.0 − 6.0 = 4.0 points, and 4.0 ÷ 0.2 = 20. About, ignoring compounding. The 0.2% is a position as big as the account, 99 units near 100.00, paying 19.81 in spread and commission per round trip.",
        concept: "passive-benchmark",
      },
    ],
    check: ["q-0.1.4-1", "q-0.1.4-2", "q-0.1.4-3"],
    recap: {
      takeaways: [
        "Investing holds for years with few trades; trading seeks short-term price changes and needs an edge.",
        "Compare any result with buy-and-hold on the same market, after costs: the benchmark ghost.",
        "Every round trip costs something, so the more you trade, the larger the edge you need.",
      ],
    },
  },
};

const L015: Lesson = {
  id: "0.1.5",
  title: "The honest numbers",
  topic: "risk_management",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "Most retail CFD accounts and almost all persistent day traders lose money, and deciding not to trade real money is a valid result of this course.",
  objectives: [
    "State the share of retail CFD accounts that lose money and where the figure comes from.",
    "Match the most common reasons retail traders fail to the parts of this course that address them.",
    "Explain why deciding not to trade with real money is a valid outcome of the course.",
  ],
  blocks: [],
  practice: [
    { kind: "mission", ref: "M10", label: "No Trade Is a Trade" },
    { kind: "check", ref: "risk_management", label: "Risk management check" },
  ],
  script: {
    unit: "0.1",
    courseId: "0.1.5",
    hook: {
      prompt: "Out of every 100 retail CFD accounts in the EU, how many lose money?",
      control: { kind: "slider", min: 0, max: 100, step: 1, start: 50, answer: 81.5, tolerance: 7.5 },
      compare: "You guessed {yours}. The national regulators' analyses cited by ESMA in 2018 found 74 to 89 out of every 100.",
      concept: "retail-loss-rates",
    },
    learn: [
      {
        kind: "explain",
        title: "A number every provider must show",
        text: "In the EU and the UK, CFD providers must state what share of their retail accounts lose money, in a standard [[risk-warning]]. The figures come from [[regulator|regulators]] and from the providers' own client data. They are a base rate: what usually happens to people like you, not anyone's opinion.",
      },
      {
        kind: "figure",
        title: "What the regulators and studies found",
        text: "These are whole populations, not a few unlucky traders. The Brazil figure counts only those who kept going; the study found no sign that they learned to win.",
        figure: {
          kind: "bars",
          unit: "%",
          bars: [
            { label: "EU (ESMA), low end", value: 74, role: "down" },
            { label: "EU (ESMA), high end", value: 89, role: "down" },
            { label: "UK (FCA), 2016 sample", value: 82, role: "down" },
            { label: "France (AMF), 2009–12", value: 89, role: "down" },
            { label: "Brazil, 300+ days of day trading", value: 97, role: "down" },
          ],
          steps: [
            "ESMA, 2018: in national analyses, at least 74% of retail CFD accounts lost money.",
            "And up to 89%, with average losses of €1,600 to €29,000 per client.",
            "UK: in the FCA's 2016 sample of CFD accounts, 82% lost money.",
            "France, 2009–2012: about 89% of 14,799 active clients lost, about €10,900 each on average.",
            "Brazil: 97% of those who day traded futures for 300+ days lost. Taiwan: under 1% reliably profit.",
          ],
        },
        concept: "retail-loss-rates",
      },
      {
        kind: "match",
        title: "Why most fail, and where this course answers",
        prompt: "Each common reason for failing has a unit of this course built against it. Match them.",
        columns: ["Why traders fail", "Where you'll work on it"],
        pairs: [
          { left: "No stop, and too big a size", right: "1.4 Risk comes first" },
          { left: "Costs eaten by many small trades", right: "1.1 Prices, quotes and costs" },
          { left: "Doubling the size after losses", right: "1.8 Danger zone" },
          { left: "No plan and no review", right: "1.6 Your first plan and journal" },
          { left: "A revenge trade after a loss", right: "1.7 The trader's mind I" },
          { left: "Judging a method on a few trades", right: "0.2 Thinking in probabilities" },
        ],
        correct: "Right. None of these is about finding a magic setup. They're about risk, costs, behaviour and evidence.",
        concept: "retail-loss-rates",
      },
      {
        kind: "predict",
        title: "Good results here",
        prompt: "You finish this course with great results in the simulator. What does that tell you about trading real money?",
        control: {
          kind: "choice",
          choices: [
            { id: "ready", label: "That I'm ready", feedback: "Skills, yes. But a synthetic market without real fear can't show how you'd trade your own money." },
            { id: "little", label: "Very little on its own", feedback: "Right. It shows you can follow a process here. It doesn't prove profits with real money." },
            { id: "edge", label: "That I've found an edge", feedback: "A good run over a small sample can easily be luck. An edge needs far more evidence, after costs." },
          ],
          answer: "little",
        },
        reveal: "Very little on its own. The market here is synthetic, there's no real fear of losing your own money, and the sample is small. A simulator builds skills; it doesn't prove profits.",
        concept: "when-not-to-trade",
      },
      {
        kind: "explain",
        title: "Not trading is a valid result",
        text: "Deciding not to day trade with real money, or to invest passively instead, is a valid result of this course. The goal here is competence in risk and in decisions under uncertainty. That carries over to investing, to work and to everyday choices, whatever you decide about trading.",
      },
      { kind: "callout", tone: "warning", text: "If you ever trade real money: only money you can afford to lose, and only through a regulated broker. Both come back later in the course." },
    ],
    task: {
      widget: "bias-spotter",
      data: FAILURE_CARDS,
      goal: "Lee's month in the simulator: a 10,000.00 account and a 1% limit, 100.00 per trade. Name the failure on each card, or mark it within the rules.",
      success: { field: "solved", eq: 6 },
      correct: "All six tagged. Five of the most common failures, and one losing trade that broke no rule. The result alone doesn't tell them apart.",
      hints: [
        "Start with the easy one: which trade had no stop at all?",
        "Compare each size with the one before it, and check whether a loss came just before.",
        "A trade can lose and still be within the rules. Check the stop, the risk and the setup, not the result.",
      ],
      showMe: { solved: 6 },
      concept: "retail-loss-rates",
    },
    check: ["q-0.1.5-1", "q-0.1.5-2", "q-0.1.5-3"],
    recap: {
      takeaways: [
        "In the EU, 74% to 89% of retail CFD accounts lost money, per national regulators (ESMA, 2018).",
        "Most failures are no stop, oversizing, costs, revenge and small samples. Each has a unit here.",
        "Deciding not to trade real money, or to invest passively, is a valid result of this course.",
      ],
    },
  },
};

const L016: Lesson = {
  id: "0.1.6",
  title: "How this course and the simulator work",
  topic: "decision_making",
  level: "beginner",
  tier: "free",
  minutes: 6,
  summary: "The simulator runs on fixed rules, grades your decisions and your risk discipline rather than your profit, and labels every method with its evidence grade.",
  objectives: [
    "Describe the simulated world: LABX, vUSD, the 10,000.00 account, the spread and the commission.",
    "Tell the three scores apart and name the actions that move each one.",
    "Read an evidence grade and say what it does and doesn't promise.",
  ],
  blocks: [],
  practice: [
    { kind: "arena", ref: "bullish", label: "Arena: bullish" },
    { kind: "check", ref: "decision_making", label: "Decision-making check" },
  ],
  script: {
    unit: "0.1",
    courseId: "0.1.6",
    hook: {
      prompt: "Your Arena account grows from 10,000.00 to 12,000.00 vUSD in one week. Which score does that raise?",
      control: {
        kind: "choice",
        choices: [
          { id: "dq", label: "Decision Quality" },
          { id: "rd", label: "Risk Discipline" },
          { id: "outcome", label: "Only Simulated Outcome" },
        ],
        answer: "outcome",
      },
      compare: "You picked {yours}. Only Simulated Outcome rises. A profit alone doesn't show whether your decisions or your risk control were any good.",
      concept: "process-scores",
    },
    learn: [
      {
        kind: "explain",
        title: "The simulated world",
        text: "You trade **LABX**, a synthetic instrument, in **vUSD**, from a 10,000.00 account. Each candle is one hour. The [[spread]] is 0.10: bid = mid − 0.05, ask = mid + 0.05. Every fill pays 0.05% [[commission]], rounded up to the cent. Risk is 1% per trade in missions and 2% in the Arena. No leverage.",
      },
      {
        kind: "explain",
        title: "Three scores, kept apart",
        text: "[[decision-quality|Decision Quality]] grades your reasoning, given what you knew then. [[risk-discipline|Risk Discipline]] grades your risk rules: a stop on every entry, risk within the limit, no widened stop, no bigger size after a loss. [[simulated-outcome|Simulated Outcome]] is your simulated profit or loss: always shown, never graded.",
      },
      {
        kind: "match",
        title: "Which score moves?",
        prompt: "Match each action to the score it feeds.",
        columns: ["Action", "Score"],
        pairs: [
          { left: "Write the reason for the trade before entering", right: "Decision Quality" },
          { left: "Place a stop with every entry", right: "Risk Discipline" },
          { left: "Price happens to rise after you buy", right: "Simulated Outcome" },
          { left: "Skip a setup that breaks your rules", right: "Decision Quality" },
        ],
        correct: "Right. Everything you control feeds the two graded scores. What price does next only moves the outcome.",
        concept: "process-scores",
      },
      {
        kind: "figure",
        title: "Evidence grades",
        text: "Every method in this course carries an [[evidence-grade]]. **Mechanic**: true by construction, like the spread. **A**: robust across markets and decades. **B**: supported, but weaker since published or only in some regimes. **C**: mixed. **D**: unproven when tested. **F**: loses by design. Even an A shrinks once it's known.",
        figure: {
          kind: "bars",
          bars: [
            { label: "In the original studies", value: 100, role: "accent" },
            { label: "Out of sample", value: 74, role: "concept" },
            { label: "After publication", value: 42, role: "neutral" },
          ],
          steps: [
            "97 published return predictors. Their returns in the original studies: call that 100.",
            "On data outside the studies: 26% less.",
            "After publication, once everyone could read them: 58% less (McLean and Pontiff, 2016).",
          ],
        },
        concept: "evidence-grades",
      },
      {
        kind: "match",
        title: "Grade the claim",
        prompt: "Match each claim to its evidence grade.",
        columns: ["Claim", "Grade"],
        pairs: [
          { left: "A round trip pays the spread", right: "Mechanic" },
          { left: "Diversified trend following over decades", right: "A" },
          { left: "Stops cluster just beyond round numbers", right: "B" },
          { left: "Elliott waves predict turning points", right: "D" },
          { left: "Doubling your size after each loss", right: "F" },
        ],
        correct: "Right. A grade tells you how well an idea has held up when tested, not that it will work for you.",
        concept: "evidence-grades",
      },
      { kind: "callout", tone: "key", text: "Results here are always after costs and next to the benchmark ghost. Each lesson runs Hook, Learn, Try, Check, Recap; missed questions come back for review, and nothing is locked." },
      {
        kind: "worked",
        title: "Your turn: check the ticket",
        lines: [
          "Buy 40 LABX at 100.00, stop at 98.00.",
          "Loss at the stop: 40 × 2.00 = 80.00.",
          "Commission in: 40 × 100.00 × 0.05% = 2.00.",
          "Commission out: 40 × 98.00 × 0.05% = 1.96.",
          "At risk: 80.00 + 2.00 + 1.96 = ?",
        ],
        ask: {
          answer: 83.96,
          tolerance: 0,
          unit: "vUSD",
          feedback: [
            { value: 80, text: "That's the price move only. Add both commissions: 2.00 in and 1.96 out." },
            { value: 82, text: "You added one commission. The exit pays one too: 1.96." },
          ],
          correct: "Right: 83.96, under the 1% limit of 100.00.",
        },
        after: "83.96 is under the 100.00 limit. With the stop on, the risk is defined and within the rule.",
        concept: "process-scores",
      },
      {
        kind: "predict",
        title: "Your turn: fix the ticket",
        prompt: "This ticket has the stop switched off and an empty Reason field. Which changes earn full Risk Discipline and give Decision Quality something to grade?",
        control: {
          kind: "choice",
          choices: [
            { id: "both", label: "Stop on at 98.00, and a reason written before entry", feedback: "Right. The stop defines the risk, 83.96, and the reason gives your decision something to be judged on." },
            { id: "wait", label: "Stop on at 98.00, then wait to see if it wins", feedback: "The stop covers Risk Discipline, but Decision Quality needs your reason, written before you enter. Winning doesn't supply it." },
            { id: "reason", label: "No stop, but a strong written reason", feedback: "A reason helps Decision Quality, but without a stop the risk has no limit, so Risk Discipline can't be full." },
            { id: "after", label: "A reason written after the trade closes in profit", feedback: "Written afterwards, a reason only describes the result. And without a stop, the risk was never limited." },
          ],
          answer: "both",
        },
        reveal: "A stop at 98.00 puts 83.96 at risk, within the 100.00 limit, and a reason written before entry is what Decision Quality grades. Whether the trade then wins or loses moves only Simulated Outcome.",
        concept: "process-scores",
      },
    ],
    check: ["q-0.1.6-1", "q-0.1.6-2", "q-0.1.6-3"],
    recap: {
      takeaways: [
        "LABX, vUSD, a 10,000.00 account, a 0.10 spread and 0.05% commission per fill. No leverage.",
        "Decision Quality and Risk Discipline grade your process. Simulated Outcome shows profit but is never graded.",
        "An evidence grade says how well an idea held up when tested, not that it will work.",
      ],
    },
  },
};

// ─── Check questions ────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  // 0.1.1
  {
    id: "q-0.1.1-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "A quote screen shows a share's last price as 25.40. What does that number tell you?",
    options: [
      { id: "a", label: "The price the exchange set for the session", rationale: "Exchanges match orders; they don't pick prices. The number comes out of the orders: it's where the latest buyer and seller agreed." },
      { id: "b", label: "The fair value of the share, worked out by analysts", rationale: "Analysts' views only matter if they turn into orders. The last price records a trade, not anyone's estimate of value." },
      { id: "c", label: "The price at which a buyer and a seller last agreed to trade" },
      { id: "d", label: "The price you'll pay if you buy right now", rationale: "Buying now means taking the lowest seller's price, the ask, which can differ from the last trade. The last price is history." },
    ],
    correct: "c",
    explanation: "A last price is a record: the most recent price at which a buyer's order and a seller's order met. Nobody sets it, and it isn't a promise about the next trade, which happens at whatever price the next buyer and seller accept.",
    lesson: "0.1.1",
    concepts: ["market-as-auction"],
  },
  {
    id: "q-0.1.1-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt:
      "One unit per order. Buyers will pay at most 20.60, 20.50, 20.40 and 20.20. Sellers will accept at least 20.10, 20.30, 20.40 and 20.70. At what single price do the most units change hands?",
    numeric: { answer: 20.4, tolerance: 0.001, unit: "vUSD" },
    explanation:
      "At 20.40, three buyers will pay at least 20.40 (20.60, 20.50, 20.40) and three sellers will accept at most 20.40 (20.10, 20.30, 20.40): 3 units. At 20.30 only 2 sellers accept, and at 20.50 only 2 buyers pay, so 2 units each.",
    lesson: "0.1.1",
    concepts: ["market-as-auction"],
    hints: [
      "Pick a price and count the buyers who would pay at least that much.",
      "Then count the sellers who would accept at most that much. Units traded is the smaller count.",
      "Compare 20.30, 20.40 and 20.50. Which gives the largest smaller count?",
    ],
  },
  {
    id: "q-0.1.1-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "LABX's best bid is 99.95 and its best ask is 100.05. Over the next minutes, buyers keep paying whatever sellers ask: they take every unit offered at 100.05, then at 100.10, then at 100.15.",
    prompt: "Why is the last price rising?",
    options: [
      { id: "a", label: "Because the exchange raises the price when trading gets busy", rationale: "No one raises the price. Each trade prints where a buyer and a seller agree, and here buyers keep accepting higher offers." },
      { id: "b", label: "Because there are more buyers than sellers in the market", rationale: "Each unit traded has exactly one buyer and one seller. What moves price is which side is eager enough to accept the other's price." },
      { id: "c", label: "Because buyers are in a hurry: they keep taking the next seller's higher price" },
      { id: "d", label: "Because the sellers raised their prices to match demand", rationale: "The sellers' prices were already waiting there. Buyers used up the cheaper offers and moved on to the next, higher ones." },
    ],
    correct: "c",
    explanation:
      "Each trade prints at a price both sides accept. When buyers are eager enough to take sellers' prices, they use up the offers at 100.05 and move to 100.10, then 100.15, so the last price climbs. If sellers were the hurried side, they would hit lower bids and it would fall.",
    lesson: "0.1.1",
    concepts: ["market-as-auction"],
    hints: ["Ask which side is accepting the other side's price.", "Every unit traded has one buyer and one seller, so counting people doesn't explain the move."],
  },
  // 0.1.2
  {
    id: "q-0.1.2-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "You buy 50 LABX. Who is your counterparty?",
    options: [
      { id: "a", label: "Whoever sold you the 50 units" },
      { id: "b", label: "Anyone else who bought LABX at the same time", rationale: "Other buyers are on your side of the market. Your counterparty is on the other side of your own trade: the seller." },
      { id: "c", label: "The regulator that supervises your broker", rationale: "A regulator supervises the market but never takes the other side of a trade. The counterparty is whoever sold to you." },
      { id: "d", label: "The next person who buys LABX after you", rationale: "They trade with someone else. Your counterparty is the one who took the opposite side of your trade when it happened." },
    ],
    correct: "a",
    explanation: "Every trade has two sides. When you buy, your counterparty is whoever sold to you; when you sell, it's whoever bought. In retail FX and CFDs that is often a dealer or the broker itself.",
    lesson: "0.1.2",
    concepts: ["market-participants"],
  },
  {
    id: "q-0.1.2-2",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario:
      "In spring, a wheat farmer sells futures for her autumn harvest at a fixed price. She thinks wheat prices will probably rise by autumn, which would make the futures a loss for her.",
    prompt: "Why might she sell the futures anyway?",
    options: [
      { id: "a", label: "She's betting that prices will fall after all", rationale: "Her own view is that prices rise. She sells to remove the risk of a fall in her harvest's value, not to bet on one." },
      { id: "b", label: "She wants a known price for her harvest more than the chance of a higher one" },
      { id: "c", label: "Futures always pay more than selling the harvest later", rationale: "Futures promise no extra. If prices rise she loses on the futures but sells her wheat for more; the total stays close to the fixed price." },
      { id: "d", label: "She has no wheat yet, so she carries no risk", rationale: "Her coming harvest is the risk: its value drops if prices fall. The futures offset exactly that." },
    ],
    correct: "b",
    explanation:
      "She is a hedger. Her harvest already exposes her to falling prices, and the futures lock in a price whatever happens. If prices rise, the futures lose but her wheat sells for more, so the hedge did its job even though the contract lost.",
    lesson: "0.1.2",
    concepts: ["market-participants"],
    hints: ["What risk does she already carry before she trades anything?", "A hedger judges the futures and the harvest together, not the futures alone."],
  },
  {
    id: "q-0.1.2-3",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "After a quick drop fills his stop, a trader says: 'They hunted my stop.' Why isn't that a useful explanation?",
    options: [
      { id: "a", label: "Stops are invisible to everyone, so nobody could target them", rationale: "Too strong: dealers and brokers can see their own clients' orders. The point is that a chart can't show anyone's intent." },
      { id: "b", label: "Stops are only hit by news, never by normal moves", rationale: "Normal moves hit stops all the time. Stops at obvious levels are reached simply because so many traders chose the same spot." },
      { id: "c", label: "It blames someone a chart can't show; stops simply gather at obvious levels" },
      { id: "d", label: "It's fine if a single candle hit the stop", rationale: "One fast candle shows a move, not a motive. The useful question is whether the stop sat at an obvious, crowded level." },
    ],
    correct: "c",
    explanation:
      "The market isn't a person, and no chart shows who traded or why. Stops tend to gather just beyond obvious levels, so a move there fills many at once. Asking whether your stop was at a crowded level is something you can act on; blaming a hunter is not.",
    lesson: "0.1.2",
    concepts: ["market-participants"],
    hints: ["Can a chart show who traded, or why?", "Think about where many traders put their stops, and what happens when price gets there."],
  },
  // 0.1.3
  {
    id: "q-0.1.3-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which of these markets is open 24 hours a day, 7 days a week?",
    options: [
      { id: "a", label: "A US stock exchange", rationale: "Stock exchanges keep weekday sessions, with extra hours before and after. They're closed at weekends." },
      { id: "b", label: "Spot forex", rationale: "Forex runs 24 hours a day from Sunday evening to Friday evening, then pauses for the weekend." },
      { id: "c", label: "Gold futures", rationale: "Futures trade nearly around the clock from Sunday to Friday, with a daily break, but not at the weekend." },
      { id: "d", label: "Crypto spot exchanges" },
    ],
    correct: "d",
    explanation: "Crypto spot trades 24/7, weekends included. Forex and most futures run almost around the clock on weekdays, while stock exchanges keep sessions. The fewer the hours, the more room for gaps when trading reopens.",
    lesson: "0.1.3",
    concepts: ["asset-classes"],
  },
  {
    id: "q-0.1.3-2",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 2,
    prompt: "You hold a futures contract that expires next week, and you want to keep the position. What do you do?",
    options: [
      { id: "a", label: "Nothing: futures don't expire if you keep holding them", rationale: "Every futures contract has an expiry date. Holding past it means delivery or cash settlement, not a longer position." },
      { id: "b", label: "Roll it: close the expiring contract and open the next one" },
      { id: "c", label: "Ask the exchange to turn it into a CFD", rationale: "Exchanges don't convert contracts. A CFD is a separate deal with a provider. To stay in, you roll to the next futures contract." },
      { id: "d", label: "Wait: it renews itself at the same price", rationale: "Contracts don't renew. The next one trades at its own price, so rolling can cost or earn the difference between them." },
    ],
    correct: "b",
    explanation:
      "Futures expire on a set date. To keep the exposure you roll: close the contract that's about to expire and open the next one. The two usually trade at different prices, so the roll has a cost or a gain of its own.",
    lesson: "0.1.3",
    concepts: ["asset-classes"],
    hints: ["Every futures contract has an end date.", "To keep the same exposure, you need a contract that's still alive next month."],
  },
  {
    id: "q-0.1.3-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "Mara buys a CFD on gold from an online provider. She never owns any gold.",
    prompt: "Who is on the other side of her trade, and why does it matter?",
    options: [
      { id: "a", label: "A gold miner selling its output", rationale: "No gold changes hands. A CFD only pays the price change, and the contract is between Mara and her provider." },
      { id: "b", label: "The exchange's clearing house, which guarantees the trade", rationale: "That's how exchange futures work. A CFD is an over-the-counter contract with the provider itself." },
      { id: "c", label: "The provider: it pays her gains, collects her losses and sets the spread and funding" },
      { id: "d", label: "Nobody: a CFD only tracks the price", rationale: "Every trade has two sides. With a CFD, the provider is the other side of the contract." },
    ],
    correct: "c",
    explanation:
      "A CFD is a contract with the provider, which is her counterparty. It pays her gains and collects her losses, sets the spread and the overnight funding, and her money depends on it staying sound. That is why regulation and the choice of provider matter.",
    lesson: "0.1.3",
    concepts: ["asset-classes"],
    hints: ["Does Mara own gold, or a contract about gold's price?", "Who signed that contract with her?"],
  },
  // 0.1.4
  {
    id: "q-0.1.4-1",
    topic: "market_fundamentals",
    kind: "mcq",
    difficulty: 1,
    prompt: "Which of these is investing rather than trading?",
    options: [
      { id: "a", label: "Buying LABX because you expect a rise this week", rationale: "That seeks profit from a short-term price change: trading. Investing holds for years for the asset's own return." },
      { id: "b", label: "Opening and closing ten positions in one day", rationale: "That's day trading: short holds and many trades. Investing means few trades held for years." },
      { id: "c", label: "Holding a position for two weeks to catch one swing", rationale: "That's swing trading. Two weeks is a short horizon aimed at one price move, not the long-run return of the asset." },
      { id: "d", label: "Adding to an index fund every month and holding it for decades" },
    ],
    correct: "d",
    explanation: "Investing holds assets for years for their own return, such as dividends and growth, with few trades. The other three seek profit from price changes over days or hours, which is trading.",
    lesson: "0.1.4",
    concepts: ["trading-styles"],
  },
  {
    id: "q-0.1.4-2",
    topic: "market_fundamentals",
    kind: "numeric",
    difficulty: 2,
    prompt:
      "Over a year, a trader made +12.0% before costs with 25 round trips, each costing about 0.2% of the account. Buy-and-hold on the same market made +8.5% after costs. By how many points did the trader beat the ghost? Use a minus sign if they trailed it.",
    numeric: { answer: -1.5, tolerance: 0.05, unit: "points" },
    explanation: "Costs: 25 × 0.2 = 5.0 points. After costs: 12.0 − 5.0 = 7.0%. Against the ghost: 7.0 − 8.5 = −1.5 points. Before costs the trader looked 3.5 points ahead; after costs they trail.",
    lesson: "0.1.4",
    concepts: ["passive-benchmark"],
    hints: [
      "Compare like with like: the ghost is after costs, so take costs off the trader's result first.",
      "Costs = number of round trips × 0.2 points.",
      "25 × 0.2 = 5.0, so the trader's result after costs is 12.0 − 5.0 = 7.0%. Now compare with 8.5.",
    ],
    vary: {
      fields: { gross: [8, 16, 0.5], n: [10, 40, 5], ghost: [4, 12, 0.5] },
      constraints: ["abs(gross - n * 0.2 - ghost) >= 0.5", "gross > ghost"],
      answer: "round(gross - n * 0.2 - ghost, 1)",
      prompt:
        "Over a year, a trader made +{gross:1}% before costs with {n} round trips, each costing about 0.2% of the account. Buy-and-hold on the same market made +{ghost:1}% after costs. By how many points did the trader beat the ghost? Use a minus sign if they trailed it.",
      explanation:
        "Costs: {n} × 0.2 = {n * 0.2:1} points. After costs: {gross:1} − {n * 0.2:1} = {gross - n * 0.2:1}%. Against the ghost: {gross - n * 0.2:1} − {ghost:1} = {answer:1} points.",
      hint: "{n} × 0.2 = {n * 0.2:1}, so the trader's result after costs is {gross:1} − {n * 0.2:1} = {gross - n * 0.2:1}%. Now compare with {ghost:1}.",
    },
  },
  {
    id: "q-0.1.4-3",
    topic: "market_fundamentals",
    kind: "scenario",
    difficulty: 2,
    scenario: "On LABX, a scalper aims to make 0.30 per unit on each trade; a swing trader aims for 3.00. Both pay the same 0.10 spread on every round trip, plus commission.",
    prompt: "Why does the scalper need a bigger edge to beat the benchmark?",
    options: [
      { id: "a", label: "The spread takes a third of each scalping target but a thirtieth of the swing target, and the scalper pays it far more often" },
      { id: "b", label: "Regulators charge more per trade for short-term trading", rationale: "Costs per round trip are the same here: 0.10 of spread plus commission. The difference is how big that cost is next to the target." },
      { id: "c", label: "The swing trader pays no costs on positions held overnight", rationale: "Both pay the spread and commission on every round trip. Holding longer just means fewer round trips and bigger targets." },
      { id: "d", label: "Short-term trading can never be profitable", rationale: "Too strong. It can be, but costs eat a much bigger share of each small target, so the edge per trade must be larger." },
    ],
    correct: "a",
    explanation:
      "A 0.10 spread is 0.10 ÷ 0.30, a third, of the scalper's target, but 0.10 ÷ 3.00, a thirtieth, of the swing trader's. The scalper also pays it many more times, so a far larger share of any edge goes to costs before it can beat buy-and-hold.",
    lesson: "0.1.4",
    concepts: ["trading-styles", "passive-benchmark"],
    hints: ["Compare the cost of a round trip with the size of each target.", "Then think about how many round trips each style makes in a month."],
  },
  // 0.1.5
  {
    id: "q-0.1.5-1",
    topic: "risk_management",
    kind: "numeric",
    difficulty: 1,
    prompt: "ESMA found that 74% to 89% of retail CFD accounts lose money. A provider's risk warning says 78%. Out of 500 of its retail accounts, how many lose money?",
    numeric: { answer: 390, tolerance: 0, unit: "accounts" },
    explanation: "78% of 500 is 500 × 78 ÷ 100 = 390. A risk warning turns the base rate into a count you can picture: 390 of every 500 accounts lose money.",
    lesson: "0.1.5",
    concepts: ["retail-loss-rates"],
    hints: ["A percentage means 'out of 100'.", "Multiply the number of accounts by the percentage, then divide by 100.", "500 × 78 ÷ 100 = ?"],
    vary: {
      fields: { pct: [74, 89, 1], n: [200, 2000, 100] },
      answer: "n * pct / 100",
      prompt: "ESMA found that 74% to 89% of retail CFD accounts lose money. A provider's risk warning says {pct}%. Out of {n} of its retail accounts, how many lose money?",
      explanation: "{pct}% of {n} is {n} × {pct} ÷ 100 = {answer}. A risk warning turns the base rate into a count you can picture: {answer} of every {n} accounts lose money.",
      hint: "{n} × {pct} ÷ 100 = ?",
    },
  },
  {
    id: "q-0.1.5-2",
    topic: "risk_management",
    kind: "mcq",
    difficulty: 2,
    prompt: "In Brazil, 97% of people who day traded futures for more than 300 days lost money. What does this figure show?",
    options: [
      { id: "a", label: "97% of everyone who ever tried day trading lost money", rationale: "The figure covers only those who kept going for 300+ days, not everyone who tried. Many people stopped earlier." },
      { id: "b", label: "Almost everyone who kept day trading for that long lost money" },
      { id: "c", label: "Day traders learn and turn profitable after about 300 days", rationale: "The opposite: those who persisted still lost, and the study found no sign that they learned to win." },
      { id: "d", label: "Only Brazil's markets are this hard", rationale: "Other base rates point the same way: under 1% of Taiwan's day traders reliably profit after fees, and 74–89% of EU retail CFD accounts lose." },
    ],
    correct: "b",
    explanation:
      "The 97% describes persistent day traders: people who kept at it for more than 300 days. It doesn't cover everyone who tried, and it shows that sticking with it didn't turn them into winners. Studies elsewhere, such as Taiwan's, point the same way.",
    lesson: "0.1.5",
    concepts: ["retail-loss-rates", "base-rates"],
    hints: ["Read who the figure counts: everyone, or a specific group?", "Did persistence help? Think about what 97% of the persistent group tells you."],
  },
  {
    id: "q-0.1.5-3",
    topic: "risk_management",
    kind: "scenario",
    difficulty: 2,
    scenario: "After 60 simulated trades, Ana is up 12% in the Arena and well ahead of the benchmark ghost. She plans to open a real account next week and trade her savings the same way.",
    prompt: "What's the soundest reading of her result?",
    options: [
      { id: "a", label: "She has proven an edge, so real money will behave the same", rationale: "60 trades in a synthetic market prove little. Real money adds real fear and different costs, and a short good run can be luck." },
      { id: "b", label: "A good start, but 60 trades in a synthetic market, without real fear, say little about real money" },
      { id: "c", label: "Her savings are safe as long as she keeps using stops", rationale: "Stops limit each loss but don't create an edge. Most retail accounts lose money even with protections in place." },
      { id: "d", label: "She should size up with real money to make the most of her edge", rationale: "Sizing up on a small, simulated sample adds risk to an edge that hasn't been shown to exist." },
    ],
    correct: "b",
    explanation:
      "Simulator results don't predict live profits: the market is synthetic, there's no real fear, and 60 trades is a small sample. Not trading her savings, or only risking money she can afford to lose, is a sound decision.",
    lesson: "0.1.5",
    concepts: ["when-not-to-trade"],
    hints: ["What's different about real money compared with the simulator?", "Is 60 trades enough to separate an edge from a lucky run?"],
  },
  // 0.1.6
  {
    id: "q-0.1.6-1",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 1,
    prompt: "In MARKET//LAB, a trade makes 300.00 vUSD of simulated profit. Which score does the profit itself raise?",
    options: [
      { id: "a", label: "Decision Quality", rationale: "Decision Quality grades the reasoning with what you knew at the time. A profit can come from a poor decision and luck." },
      { id: "b", label: "Risk Discipline", rationale: "Risk Discipline grades your risk rules, such as a stop on every entry. A profit says nothing about whether you followed them." },
      { id: "c", label: "All three equally", rationale: "The scores are kept apart on purpose, so that luck can't grade your process. Profit moves only the outcome." },
      { id: "d", label: "Only Simulated Outcome" },
    ],
    correct: "d",
    explanation: "Profit moves only Simulated Outcome, which is shown but never graded. Decision Quality and Risk Discipline grade what you control: your reasoning and your risk rules.",
    lesson: "0.1.6",
    concepts: ["process-scores"],
  },
  {
    id: "q-0.1.6-2",
    topic: "decision_making",
    kind: "scenario",
    difficulty: 2,
    scenario: "You enter a long on LABX without a stop. Price rises, and you close the trade for +150.00 vUSD.",
    prompt: "How does MARKET//LAB score this trade?",
    options: [
      { id: "a", label: "Well on all three scores, because it made money", rationale: "The scores are separate. The profit shows in Simulated Outcome, but entering without a stop breaks a risk rule whatever the result." },
      { id: "b", label: "Simulated Outcome shows +150.00, but Risk Discipline drops: there was no stop" },
      { id: "c", label: "Decision Quality is high, because the idea worked", rationale: "Decision Quality judges the reasoning and information at the time, not whether price happened to rise." },
      { id: "d", label: "It isn't scored, because it won", rationale: "Every trade is scored. A win doesn't hide a missing stop; it only makes the mistake easier to repeat." },
    ],
    correct: "b",
    explanation:
      "The profit appears in Simulated Outcome. Risk Discipline requires a stop with every entry, so this trade loses points there no matter how it ended. Grading the process stops a lucky win from teaching a risky habit.",
    lesson: "0.1.6",
    concepts: ["process-scores", "decision-quality"],
    hints: ["Which score grades whether you had a stop?", "Does the result change whether a rule was followed?"],
  },
  {
    id: "q-0.1.6-3",
    topic: "decision_making",
    kind: "mcq",
    difficulty: 2,
    prompt: "A method in the course carries evidence grade D. What does that tell you?",
    options: [
      { id: "a", label: "It's supported, but weaker since it was published", rationale: "That's grade B: supported evidence that has faded or holds only in some regimes. D is weaker than that." },
      { id: "b", label: "It loses money by design", rationale: "That's grade F, such as doubling your size after each loss. D means unproven, not built to lose." },
      { id: "c", label: "It's true by construction, like the spread", rationale: "That's Mechanic: facts about how markets and orders work. D is for claims that haven't held up." },
      { id: "d", label: "It's unproven: anecdotal, untestable, or not supported when tested" },
    ],
    correct: "d",
    explanation: "D means unproven: the claim rests on anecdotes, can't be tested, or failed when it was tested. Elliott wave forecasts are an example. A grade describes the evidence, not what will happen to you.",
    lesson: "0.1.6",
    concepts: ["evidence-grades"],
    hints: ["Grades run from Mechanic and A, the strongest, down to F.", "D sits between mixed evidence, C, and losing by design, F."],
  },
];

// ─── Glossary terms ─────────────────────────────────────────────────────────

const TERMS: GlossaryTerm[] = [
  // 0.1.1
  {
    id: "market",
    term: "Market",
    definition: "A place or system where buyers and sellers trade an instrument. The price is where they agree.",
    plain: "Where people who want to buy meet people who want to sell.",
    related: ["auction", "order", "instrument"],
    lesson: "0.1.1",
  },
  {
    id: "auction",
    term: "Auction",
    definition: "A way of matching buyers and sellers at the price where the most units can change hands.",
    plain: "Everyone names a price, and the price that lets the most trades happen wins.",
    related: ["market", "order", "order-book"],
    lesson: "0.1.1",
  },
  {
    id: "order",
    term: "Order",
    definition: "An instruction to buy or sell a quantity of an instrument, at the market price or at a chosen price.",
    plain: "Your request to buy or sell: how many, and at what price.",
    related: ["market-order", "limit-order", "order-book"],
    lesson: "0.1.1",
  },
  // 0.1.2
  {
    id: "counterparty",
    term: "Counterparty",
    definition: "The person or firm on the other side of your trade: the seller when you buy, the buyer when you sell.",
    plain: "Whoever takes the other side of your trade.",
    related: ["market-maker", "hedger", "speculator"],
    lesson: "0.1.2",
  },
  {
    id: "hedger",
    term: "Hedger",
    definition: "Someone who trades to reduce a risk they already have, such as a future cost or income.",
    plain: "A business or person using the market as insurance.",
    related: ["hedge", "speculator", "futures"],
    lesson: "0.1.2",
  },
  {
    id: "speculator",
    term: "Speculator",
    definition: "Someone who trades to profit from price changes and accepts the risk of losing.",
    plain: "Someone betting on where the price goes next. In this course, that's you.",
    related: ["hedger", "retail-trader"],
    lesson: "0.1.2",
  },
  {
    id: "retail-trader",
    term: "Retail trader",
    definition: "An individual trading their own money, usually in small amounts, through a broker.",
    plain: "A private person trading for themselves, not a professional firm.",
    related: ["speculator", "counterparty"],
    lesson: "0.1.2",
  },
  // 0.1.3
  {
    id: "asset-class",
    term: "Asset class",
    definition: "A group of instruments with similar features, such as stocks, bonds, currencies, commodities or crypto.",
    plain: "A family of things you can trade that follow similar rules.",
    related: ["stock", "bond", "forex", "futures", "cryptocurrency"],
    lesson: "0.1.3",
  },
  {
    id: "stock",
    term: "Stock",
    definition: "A share of ownership in a company, usually traded on an exchange.",
    plain: "A small piece of a company.",
    related: ["etf", "index", "asset-class"],
    lesson: "0.1.3",
    aka: ["Share", "Equity"],
  },
  {
    id: "etf",
    term: "ETF",
    definition: "Exchange-traded fund: a fund holding a basket of assets, traded like a single share.",
    plain: "One share that holds many investments at once.",
    related: ["index", "stock"],
    lesson: "0.1.3",
    aka: ["Exchange-traded fund"],
  },
  {
    id: "index",
    term: "Index",
    definition: "A number that tracks the value of a group of assets, such as 500 large companies.",
    plain: "A scoreboard for a whole group of shares.",
    related: ["etf", "stock"],
    lesson: "0.1.3",
  },
  {
    id: "forex",
    term: "Forex",
    definition: "The market for exchanging currencies, quoted in pairs such as EUR/USD.",
    plain: "Trading one currency for another.",
    related: ["asset-class", "leverage"],
    lesson: "0.1.3",
    aka: ["FX", "Foreign exchange"],
  },
  {
    id: "futures",
    term: "Futures",
    definition: "Exchange-traded contracts to buy or sell an asset at a set price on a future date.",
    plain: "A deal made now for a trade later, at a price fixed today.",
    related: ["derivative", "commodity", "hedger"],
    lesson: "0.1.3",
    aka: ["Futures contract"],
  },
  {
    id: "commodity",
    term: "Commodity",
    definition: "A raw material traded in bulk, such as oil, gold or wheat, usually through futures.",
    plain: "Physical goods like oil, metals or crops.",
    related: ["futures", "asset-class"],
    lesson: "0.1.3",
  },
  {
    id: "cfd",
    term: "CFD",
    definition: "Contract for difference: a contract with a provider that pays the price change of an asset you don't own.",
    plain: "A deal with your provider on a price, without owning the asset. The provider is on the other side.",
    related: ["derivative", "leverage", "counterparty"],
    lesson: "0.1.3",
    aka: ["Contract for difference"],
  },
  {
    id: "cryptocurrency",
    term: "Cryptocurrency",
    definition: "A digital asset recorded on a blockchain and traded on exchanges around the clock.",
    plain: "Digital money like Bitcoin, traded 24/7.",
    related: ["asset-class"],
    lesson: "0.1.3",
    aka: ["Crypto"],
  },
  {
    id: "bond",
    term: "Bond",
    definition: "A loan to a government or company that pays interest. Its price falls when interest rates rise.",
    plain: "An IOU that pays you interest.",
    related: ["asset-class"],
    lesson: "0.1.3",
  },
  {
    id: "derivative",
    term: "Derivative",
    definition: "An instrument whose value comes from another asset, such as a futures contract, an option or a CFD.",
    plain: "A contract based on the price of something else.",
    related: ["futures", "cfd"],
    lesson: "0.1.3",
  },
  // 0.1.4
  {
    id: "benchmark",
    term: "Benchmark",
    definition: "A reference result to compare against, such as buying and holding the same market.",
    plain: "The result you'd have got without trying: the score to beat.",
    related: ["buy-and-hold"],
    lesson: "0.1.4",
  },
  {
    id: "buy-and-hold",
    term: "Buy-and-hold",
    definition: "Buying an asset and keeping it for a long time, whatever it does in the short term.",
    plain: "Buy once and sit tight.",
    related: ["benchmark", "position-trading"],
    lesson: "0.1.4",
  },
  {
    id: "scalping",
    term: "Scalping",
    definition: "Trading tiny moves held for seconds or minutes, many times a day. Costs weigh most here.",
    plain: "Lots of very quick trades for very small gains.",
    related: ["day-trading", "spread", "commission"],
    lesson: "0.1.4",
  },
  {
    id: "day-trading",
    term: "Day trading",
    definition: "Opening and closing positions within the same day, with nothing held overnight.",
    plain: "Every trade is closed before the day ends.",
    related: ["scalping", "swing-trading"],
    lesson: "0.1.4",
  },
  {
    id: "swing-trading",
    term: "Swing trading",
    definition: "Holding positions for days to a few weeks to capture one swing in price.",
    plain: "Riding one move up or down over several days.",
    related: ["day-trading", "position-trading"],
    lesson: "0.1.4",
  },
  {
    id: "position-trading",
    term: "Position trading",
    definition: "Holding positions for weeks to months, usually to follow longer trends.",
    plain: "Holding a trade for months to follow a big trend.",
    related: ["swing-trading", "trend"],
    lesson: "0.1.4",
  },
  // 0.1.5
  {
    id: "risk-warning",
    term: "Risk warning",
    definition: "A broker's required notice stating what share of its retail clients lose money.",
    plain: "The line on a CFD provider's site saying what share of its clients lose money.",
    related: ["regulator", "cfd"],
    lesson: "0.1.5",
  },
  {
    id: "regulator",
    term: "Regulator",
    definition: "A public authority that licenses and supervises brokers and markets, such as ESMA, the FCA or the ASF.",
    plain: "The official watchdog that brokers must answer to.",
    related: ["risk-warning"],
    lesson: "0.1.5",
  },
  // 0.1.6
  {
    id: "risk-discipline",
    term: "Risk Discipline",
    definition: "The MARKET//LAB score for following risk rules: a stop on every entry, risk within limits, no widened stops.",
    plain: "Did you stick to your safety rules, whatever the result?",
    related: ["decision-quality", "simulated-outcome", "stop-loss", "risk-per-trade"],
    lesson: "0.1.6",
  },
  {
    id: "simulated-outcome",
    term: "Simulated Outcome",
    definition: "The simulated profit or loss of your trades. It is shown, but never used to grade decisions.",
    plain: "What you'd have made or lost. Shown, never scored.",
    related: ["decision-quality", "risk-discipline", "simulation"],
    lesson: "0.1.6",
  },
  {
    id: "evidence-grade",
    term: "Evidence grade",
    definition: "A label, from Mechanic and A to F, showing how well a method has held up when tested.",
    plain: "A report card for an idea: how well it held up in tests.",
    related: ["backtest"],
    lesson: "0.1.6",
  },
];

// ─── Concepts ───────────────────────────────────────────────────────────────

const CONCEPTS: Concept[] = [
  {
    id: "market-as-auction",
    name: "Market as an auction",
    category: "market_fundamentals",
    summary: "A market price is where the latest buyer and seller agreed; it moves when one side is more eager than the other.",
    body: [
      "Buyers send orders saying the most they will pay; sellers, the least they will accept. A trade happens only when a buyer's price meets a seller's, and the price on a chart is the last price at which that happened.",
      "When buyers are in more of a hurry, they accept sellers' higher prices and the last price climbs. When sellers hurry, they accept lower bids and it falls. Nobody sets the price; orders do.",
    ],
    example:
      "Buyers will pay at most 100.30, 100.20, 100.00, 99.95 and 99.80; sellers accept at least 99.70, 99.85, 100.00, 100.05 and 100.25, one unit each. At 100.00, three buyers and three sellers agree, so 3 units trade; at 99.95 or 100.05 only 2 could. Left waiting: a best bid of 99.95 and a best ask of 100.05.",
    related: ["bid-ask-spread", "market-order", "limit-order", "market-participants"],
    missions: [],
    lessons: ["0.1.1"],
  },
  {
    id: "market-participants",
    name: "Market participants",
    category: "market_fundamentals",
    summary: "Hedgers, investors, institutions, market makers, speculators and central banks trade for different reasons, horizons and information.",
    body: [
      "Every trade has two sides, and the other side isn't necessarily wrong. A hedger sells to protect a harvest, a pension fund rebalances, a market maker earns the spread, a speculator bets on a move, a central bank pursues a policy goal.",
      "Institutions worry about the impact of their own large orders; retail traders mostly struggle with costs and their own behaviour. The firms across from a retail trader usually work full time, with better tools and lower costs.",
    ],
    example:
      "An airline buys oil futures to fix next year's fuel cost. If oil then falls, it loses on the futures but pays less for fuel: the hedge did its job. The trader who sold it those futures made money, and both acted sensibly.",
    related: ["market-as-auction", "bid-ask-spread"],
    missions: [],
    lessons: ["0.1.2"],
  },
  {
    id: "asset-classes",
    name: "Asset classes",
    category: "market_fundamentals",
    summary: "Families of instruments, such as stocks, forex, futures, crypto, bonds and CFDs, each with its own hours, costs, leverage and risks.",
    body: [
      "Stocks and ETFs trade in exchange sessions; forex runs 24 hours from Sunday to Friday; futures expire and must be rolled; crypto trades 24/7; bond prices fall when interest rates rise; with a CFD the provider is your counterparty.",
      "The habits of this course transfer to all of them: bid and ask, costs, risk per trade, stops and sizing. The numbers don't: hours, leverage limits, specific costs and expiry differ by class.",
    ],
    example:
      "On a Saturday only crypto trades. Crypto spot is open 168 hours a week, forex 120, futures about 115 with a daily break, and a US exchange's main session 32.5 (6.5 hours × 5 days). Fewer hours means more chances of a gap when trading reopens.",
    related: ["gap-risk", "trading-costs", "market-participants"],
    missions: [],
    lessons: ["0.1.3"],
  },
  {
    id: "passive-benchmark",
    name: "Passive benchmark",
    category: "market_fundamentals",
    summary: "The buy-and-hold result on the same market, after costs, that any trading result has to beat.",
    body: [
      "Buying on day one and holding takes no skill and no screen time. So the fair test of any active result is the gap to buy-and-hold on the same market, over the same period, after costs.",
      "Before costs, trading is close to zero-sum around the market's return; after costs it is negative-sum for the median trader. In a study of 66,465 US households (1991–96), the most active fifth earned 11.4% a year against the market's 17.9% (Barber and Odean, 2000).",
    ],
    example:
      "Dana trades LABX 40 times in a year and makes +14.0% before costs. At about 0.2% of the account per round trip, costs take 40 × 0.2 = 8.0 points, leaving +6.0%. Buy-and-hold made +9.0% after costs, so Dana trails the benchmark by 3.0 points.",
    related: ["trading-costs", "trading-styles"],
    missions: [],
    lessons: ["0.1.4"],
  },
  {
    id: "trading-styles",
    name: "Trading styles",
    category: "market_fundamentals",
    summary: "Scalping, day, swing and position trading differ in holding period, screen time and sensitivity to costs.",
    body: [
      "Scalpers hold for seconds to minutes and trade many times a day. Day traders are flat by the close. Swing traders hold for days to a few weeks, position traders for weeks to months, investors for years.",
      "The shorter the hold, the smaller the move each trade aims for and the more often costs are paid, so costs weigh most on the fastest styles.",
    ],
    example:
      "On LABX, a 0.10 spread is a third of a 0.30 scalping target but a thirtieth of a 3.00 swing target. The scalper also pays it far more often, so costs take a much bigger share of the scalper's results.",
    related: ["trading-costs", "passive-benchmark"],
    missions: [],
    lessons: ["0.1.4"],
  },
  {
    id: "retail-loss-rates",
    name: "Retail loss rates",
    category: "risk_management",
    summary: "Regulator and academic base rates showing that most retail CFD accounts and almost all persistent day traders lose money.",
    body: [
      "National regulators' analyses cited by ESMA in 2018 found that 74% to 89% of retail CFD accounts lost money, with average losses of €1,600 to €29,000 per client. The FCA found 82% in a 2016 UK sample, and the AMF about 89% of 14,799 active French clients (2009–2012).",
      "Studies of whole populations agree. In Brazil, 97% of those who day traded futures for more than 300 days lost money; in Taiwan, fewer than 1% of day traders reliably earned returns after fees. These are base rates to start from, not opinions.",
    ],
    example: "A provider's risk warning says 78% of its retail accounts lose money. Out of 500 accounts, that is 500 × 78 ÷ 100 = 390 losing accounts.",
    related: ["base-rates", "when-not-to-trade", "leverage"],
    missions: [],
    lessons: ["0.1.5"],
  },
  {
    id: "when-not-to-trade",
    name: "When not to trade",
    category: "decision_making",
    summary: "Choosing not to trade, or not to trade with real money, is a valid and often rational decision.",
    body: [
      "Given the base rates, deciding not to day trade with real money, or to invest passively instead, is a reasonable result of learning to trade. The skills this course builds, judging risk and decisions under uncertainty, are useful either way.",
      "Good simulator results don't prove an edge with real money: the market is synthetic, there is no real fear, and the sample is small. If you ever trade real money, use only money you can afford to lose, and only a regulated broker.",
    ],
    example:
      "After 60 simulated trades you are up 12% and ahead of the benchmark ghost. That's a start, but 60 trades in a synthetic market say little about real money. Not trading your savings for now, or investing passively, is a sound decision.",
    related: ["retail-loss-rates", "decision-quality", "base-rates"],
    missions: ["M10"],
    lessons: ["0.1.5"],
  },
  {
    id: "process-scores",
    name: "Process scores",
    category: "decision_making",
    summary: "MARKET//LAB keeps Decision Quality, Risk Discipline and Simulated Outcome apart and grades only the first two.",
    body: [
      "Decision Quality grades your reasoning with the information you had when you decided. Risk Discipline grades your risk rules: a stop on every entry, risk within the limit, no widened stop and no bigger size after a loss. Simulated Outcome is the simulated profit or loss: shown, but never graded.",
      "Keeping them apart stops luck from grading you. A trade without a stop that happens to win still breaks Risk Discipline; a well-planned trade that loses can still score well.",
    ],
    example:
      "A ticket buys 40 LABX at 100.00 with the stop at 98.00. Loss at the stop: 40 × 2.00 = 80.00, plus 2.00 and 1.96 in commission, 83.96 in all, under the 1% limit of 100.00. With the stop on and a reason written before entry, the trade can score well whether it wins or loses.",
    related: ["decision-quality", "risk-per-trade", "stop-loss-order"],
    missions: ["M04", "M10"],
    lessons: ["0.1.6"],
  },
  {
    id: "evidence-grades",
    name: "Evidence grades",
    category: "decision_making",
    summary: "Mechanic and A to F labels showing how well a method, pattern or claim has held up when tested.",
    body: [
      "Mechanic means true by construction, like the spread. A is robust across markets and decades; B is supported but weaker since publication or limited to some regimes; C is mixed; D is unproven when tested; F loses by design.",
      "A grade describes the evidence, not your future results. Even robust edges shrink once published: across 97 published return predictors, returns were 26% lower out of sample and 58% lower after publication (McLean and Pontiff, 2016).",
    ],
    example:
      "'A round trip pays the spread' is Mechanic. Diversified trend following over decades is A. Stops clustering just beyond round numbers is B. Elliott waves predicting turning points is D. Doubling your size after each loss is F.",
    related: ["base-rates", "process-scores"],
    missions: [],
    lessons: ["0.1.6"],
  },
];

/** Unit 0.1 · Welcome to the markets (docs/learn/course). Lessons, their check questions, and the terms and concepts they introduce. */
export const UNIT_0_1: UnitContent = {
  lessons: [L011, L012, L013, L014, L015, L016],
  questions: QUESTIONS,
  terms: TERMS,
  concepts: CONCEPTS,
};
