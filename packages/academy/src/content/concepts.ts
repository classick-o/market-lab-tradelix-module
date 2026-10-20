import type { Concept } from "../types";

/**
 * Concept Library: short reference entries, grouped by topic.
 * Plain text only. All prices are in vUSD on the synthetic instrument LABX.
 * Examples are illustrations of the arithmetic, not predictions or advice.
 */
export const CONCEPTS: Concept[] = [
  // ─── Market fundamentals ────────────────────────────────────────────────
  {
    id: "candlestick",
    name: "Candlestick (OHLC)",
    category: "market_fundamentals",
    summary: "A candlestick summarises one period of trading with four prices: open, high, low and close.",
    body: [
      "The body spans the open and the close; the wicks reach up to the high and down to the low. A close above the open is drawn as a bullish candle, a close below it as a bearish one. In MARKET//LAB each candle covers one hour.",
      "A candle records what happened, not why it happened or what comes next. It also hides the path inside the hour: from the candle alone you cannot tell whether the high or the low came first.",
    ],
    example:
      "A LABX candle opens at 100.20, trades up to 101.10 and down to 99.80, then closes at 100.90. It is bullish: the body is 0.70 tall, the upper wick 0.20, the lower wick 0.40 and the full range 1.30 vUSD.",
    related: ["timeframe", "volatility", "trend"],
    missions: ["M01"],
    lessons: ["L01"],
  },
  {
    id: "timeframe",
    name: "Timeframe",
    category: "market_fundamentals",
    summary: "The timeframe is the length of time that each candle on a chart represents.",
    body: [
      "The same price history looks different at different timeframes. A pullback that dominates a short window can be a small wiggle in a longer one, so calling something a trend, a range or noise is always a statement about a particular timeframe and window.",
      "MARKET//LAB charts use 1-hour candles. When you judge structure, look at enough candles for a pattern to mean something, not just the last two or three.",
    ],
    example:
      "Over 24 hourly candles LABX climbs from 95.00 to 103.00 with higher highs and higher lows. The last three candles slip from 104.20 to 103.00. Seen alone they look like a decline; in the 24-hour context they are a 1.20 pullback within an uptrend that has gained 8.00.",
    related: ["candlestick", "trend", "range"],
    missions: ["M02"],
    lessons: ["L01", "L05"],
  },
  {
    id: "bid-ask-spread",
    name: "Bid, ask and spread",
    category: "market_fundamentals",
    summary: "The bid is the price you can sell at, the ask is the price you can buy at, and the spread is the gap between them.",
    body: [
      "Quotes come in pairs. A buyer pays the higher price (the ask) and a seller receives the lower one (the bid), so every round trip gives up the spread even if the price does not move at all.",
      "In MARKET//LAB the LABX spread is 0.10 vUSD: the bid is the mid price minus 0.05 and the ask is the mid price plus 0.05. Buys fill at the ask and sells fill at the bid.",
    ],
    example:
      "With LABX at a mid price of 100.00, the bid is 99.95 and the ask is 100.05. Buying 10 units and selling them straight back at an unchanged mid loses 10 × 0.10 = 1.00 vUSD to the spread, before commission.",
    related: ["trading-costs", "market-order", "slippage"],
    missions: ["M05"],
    lessons: ["L02"],
  },
  {
    id: "trading-costs",
    name: "Trading costs",
    category: "market_fundamentals",
    summary: "Trading costs are what you pay to open and close a trade, mainly the spread and commission, whatever the trade's result.",
    body: [
      "Costs are certain; profits are not. They are small on a single trade, but they shrink every winner, enlarge every loser and add up across many trades.",
      "In MARKET//LAB you pay the spread (0.10 vUSD per unit over a round trip) and a commission of 0.05%, or 5 basis points, of the fill value on every fill, entry and exit. Count both when you plan your risk.",
    ],
    example:
      "Buy 40 LABX at the ask of 100.00 (mid 99.95): fill value 4,000.00, commission 2.00. Later sell at the bid of 102.00 (mid 102.05): fill value 4,080.00, commission 2.04. The mid rose 2.10, worth 84.00 on 40 units; the spread took 4.00 and commissions 4.04, leaving 75.96 vUSD.",
    related: ["bid-ask-spread", "cost-adjusted-sizing", "slippage"],
    missions: ["M05"],
    lessons: ["L02", "L09"],
  },

  // ─── Technical analysis ─────────────────────────────────────────────────
  {
    id: "trend",
    name: "Trend and market structure",
    category: "technical_analysis",
    summary: "A trend is a persistent directional move, identified by the sequence of swing highs and swing lows.",
    body: [
      "In an uptrend price makes higher highs and higher lows; in a downtrend, lower highs and lower lows. Reading this sequence of swings is called reading market structure.",
      "A trend describes the past; it does not guarantee the future. It stays intact until the structure breaks, for example when an uptrend makes a lower low. Pullbacks against the trend are normal and do not end it by themselves.",
    ],
    example:
      "LABX prints swing highs at 101.00, 102.40 and 103.10 and swing lows at 99.50, 100.60 and 101.80. Each high and each low is above the previous one, so the structure is an uptrend. A move below 101.80 would break that sequence.",
    related: ["range", "timeframe", "support-and-resistance", "moving-average"],
    missions: ["M02", "M04"],
    lessons: ["L05"],
  },
  {
    id: "range",
    name: "Range",
    category: "technical_analysis",
    summary: "A range is a sideways market in which price moves back and forth between a fairly stable floor and ceiling.",
    body: [
      "In a range neither buyers nor sellers make lasting progress. The edges are zones rather than exact lines, and price often pokes slightly beyond them before returning.",
      "A range is not the same as noise. A range has boundaries that are tested repeatedly; noise is overlapping candles with no direction and no clear boundaries. Neither suits an approach that needs a trend.",
    ],
    example:
      "For 30 hours LABX moves between about 98.00 and 100.00, touching each side several times. The range is 2.00 tall, so a long taken at 98.20 has only about 1.80 of room before it reaches the ceiling.",
    related: ["trend", "support-and-resistance", "breakout"],
    missions: ["M02"],
    lessons: ["L05"],
  },
  {
    id: "support-and-resistance",
    name: "Support and resistance",
    category: "technical_analysis",
    summary: "Support is a price zone where falls have repeatedly stalled; resistance is a zone where rises have repeatedly stalled.",
    body: [
      "These zones exist because many participants remember and react to the same prices. They are areas, not precise lines, and they fail regularly. A level is useful mainly because it gives you a clear place to say an idea is wrong.",
      "Once broken, a level often changes role: old resistance can act as support when price comes back to test it, and old support as resistance.",
    ],
    example:
      "LABX has bounced from the 97.40 to 97.60 zone three times. A trader buying near 98.10 on the idea that support holds can place the stop below the zone, at 97.20, because a decisive break there is evidence against the idea. The risk is 0.90 per unit before costs.",
    related: ["breakout", "invalidation-level", "range"],
    missions: ["M04"],
    lessons: ["L06", "L10"],
  },
  {
    id: "breakout",
    name: "Breakout",
    category: "technical_analysis",
    summary: "A breakout is a move that carries price beyond a support or resistance zone that previously contained it.",
    body: [
      "Breakouts matter because they can signal that the balance between buyers and sellers has changed. Many traders want more than a brief poke through a level, for example a candle close beyond it, ideally on rising volume.",
      "Not every breakout follows through. Buying after a large move also puts the logical stop far away, which shrinks the position you can take for the same risk.",
    ],
    example:
      "LABX is capped at 105.00 for 20 hours, then a candle closes at 105.60 on volume above its recent average. A playbook rule might require exactly that: a close above the range high plus higher volume. A wick to 105.30 that closes at 104.90 would not qualify.",
    related: ["false-breakout", "support-and-resistance", "fomo", "range"],
    missions: ["M06", "M10"],
    lessons: ["L06"],
  },
  {
    id: "false-breakout",
    name: "False breakout",
    category: "technical_analysis",
    summary: "A false breakout is a move beyond a level that quickly fails and returns inside the previous range.",
    body: [
      "False breakouts trap traders who bought the first move beyond the level. When price falls back, their stop-loss orders add to the selling and can push it lower still.",
      "You cannot know in advance which breakouts will fail. What you control is a predefined stop, a size that respects your risk budget and rules that ask for confirmation, such as a close beyond the level.",
    ],
    example:
      "LABX trades up to 105.40, above its 105.00 range high, then closes the hour at 104.70. A trader who bought at 105.35 with a stop at 104.50 is now 0.65 per unit under water, and the breakout that justified the trade no longer exists.",
    related: ["breakout", "fomo", "confirmation-bias"],
    missions: ["M06", "M10"],
    lessons: ["L06"],
  },
  {
    id: "moving-average",
    name: "Moving average",
    category: "technical_analysis",
    summary: "A moving average is the average of the last N closing prices, recalculated on every new candle to smooth out short-term noise.",
    body: [
      "A simple moving average (SMA) weights each close equally; an exponential moving average (EMA) gives more weight to recent closes, so it reacts faster. Both lag price, because they are built only from past data.",
      "Moving averages describe; they do not predict. A rising average summarises an uptrend, and price crossing it is information to weigh, not a signal that works on its own.",
    ],
    example:
      "The last five LABX closes are 100.00, 100.40, 100.80, 101.00 and 101.30. Their sum is 503.50, so the 5-period SMA is 503.50 ÷ 5 = 100.70. If the next close is 101.50, the oldest close (100.00) drops out and the SMA becomes 505.00 ÷ 5 = 101.00.",
    related: ["trend", "volatility", "confirmation-bias"],
    missions: [],
    lessons: ["L07"],
  },
  {
    id: "volatility",
    name: "Volatility and ATR",
    category: "technical_analysis",
    summary: "Volatility is how much price typically moves, and the average true range (ATR) measures it as the average size of recent candles.",
    body: [
      "A candle's true range is the largest of three distances: high to low, previous close to high, and previous close to low. ATR(14) averages the true range over 14 candles and is expressed in price units.",
      "Volatility changes over time. When it rises, normal noise reaches further, so a stop placed too close is hit more easily. Keeping the same risk in vUSD then means a wider stop and fewer units.",
    ],
    example:
      "LABX ATR(14) is 0.80 and a trader places stops 1.5 ATR away: 1.20 per unit. With a 100.00 vUSD budget, ignoring costs, that is 83 units. If ATR rises to 1.60, the stop moves to 2.40 away and the same budget buys 41 units.",
    related: ["position-sizing", "candlestick", "invalidation-level"],
    missions: ["M04"],
    lessons: ["L16", "L05"],
  },

  // ─── Order types ────────────────────────────────────────────────────────
  {
    id: "market-order",
    name: "Market order",
    category: "order_types",
    summary: "A market order buys or sells immediately at the best price currently available.",
    body: [
      "A market order puts getting filled ahead of the exact price. In MARKET//LAB a market buy fills at the ask and a market sell at the bid, so you cross the spread every time.",
      "In real markets a market order can fill at a worse price than the one on screen when prices move fast or few orders are available. That difference is called slippage.",
    ],
    example:
      "The LABX mid price is 100.00. A market buy of 30 units fills at the ask, 100.05, for a fill value of 3,001.50 vUSD plus the 0.05% commission. Selling them at once would fill at the bid, 99.95.",
    related: ["limit-order", "bid-ask-spread", "slippage"],
    missions: [],
    lessons: ["L03"],
  },
  {
    id: "limit-order",
    name: "Limit order",
    category: "order_types",
    summary: "A limit order buys or sells only at a price you specify or better.",
    body: [
      "A buy limit sits at or below the current price and a sell limit at or above it. You control the price but not whether the order fills: in MARKET//LAB a limit order fills only if price trades at or through the limit.",
      "A missed fill is not a loss. Waiting with a limit at a planned level is one alternative to chasing a move that has already happened.",
    ],
    example:
      "LABX trades at 101.20. You place a buy limit at 100.50, just above a support zone. If the next candles dip only to 100.60 and turn up, the order never fills and you have no position. If price trades down to 100.40, it fills at 100.50 or better.",
    related: ["market-order", "fomo", "support-and-resistance"],
    missions: [],
    lessons: ["L03"],
  },
  {
    id: "bracket-order",
    name: "Bracket order (stop-loss and take-profit)",
    category: "order_types",
    summary: "A bracket order attaches a stop-loss and a take-profit to an entry, so both exits are set before the trade begins.",
    body: [
      "The take-profit closes the position at a target; the stop-loss closes it at the level where the idea is wrong. When one exit fills, the other is cancelled.",
      "Setting both exits in advance turns the plan into orders, so decisions made in a calm moment are not renegotiated while the trade is moving.",
    ],
    example:
      "Buy 40 LABX at 100.00 with a stop-loss at 99.00 and a take-profit at 102.00. The bracket risks 1.00 per unit (40.00 vUSD) to make 2.00 per unit (80.00 vUSD), before costs: a 2:1 reward-to-risk ratio.",
    related: ["stop-loss-order", "reward-to-risk", "trading-plan"],
    missions: ["M07"],
    lessons: ["L04"],
  },
  {
    id: "slippage",
    name: "Slippage",
    category: "order_types",
    summary: "Slippage is the difference between the price you expected and the price at which your order actually filled.",
    body: [
      "Slippage happens when price moves between the decision and the fill, or when there are not enough orders near the quoted price. It mostly affects market orders and stops, which accept whatever price is available.",
      "In MARKET//LAB the clearest case is a gap: a stop that price jumps past fills at the open, which can be well beyond the stop level.",
    ],
    example:
      "A long position has its stop at 98.50, but the next candle opens below it and the stop fills at 97.90, which is 0.60 worse than planned. On 50 units that adds 30.00 vUSD to the loss.",
    related: ["gap-risk", "market-order", "trading-costs"],
    missions: [],
    lessons: ["L03", "L04"],
  },

  // ─── Stop-loss ──────────────────────────────────────────────────────────
  {
    id: "stop-loss-order",
    name: "Stop-loss order",
    category: "stop_loss",
    summary: "A stop-loss order closes a position automatically if price reaches a level chosen in advance, capping the planned loss.",
    body: [
      "A stop-loss does not guarantee a price. In MARKET//LAB a stop becomes a market order when touched, so a long position's stop sells at the bid, and a gap through the stop fills at the open.",
      "Its job is to turn 'I was wrong' into an action without a debate. The stop goes where the idea fails and is never moved further away during the trade; the position is then sized so a loss at the stop fits the risk budget.",
    ],
    example:
      "Long 60 LABX at 100.05 with a stop at 98.80. If the stop is touched, the planned loss is 60 × 1.25 = 75.00 vUSD plus commissions, inside a 100.00 budget.",
    related: ["invalidation-level", "gap-risk", "bracket-order", "risk-per-trade"],
    missions: ["M04", "M07"],
    lessons: ["L04", "L10"],
  },
  {
    id: "invalidation-level",
    name: "Invalidation level",
    category: "stop_loss",
    summary: "The invalidation level is the price at which the reason for a trade no longer holds.",
    body: [
      "Every trade idea implies a price that would prove it wrong: a broken support, a lower low in an uptrend, a close back inside a range. That price, plus a small buffer for noise, is where the stop belongs.",
      "Placing the stop by feel, or so that the loss looks small, cuts the link between the stop and the idea. Decide the invalidation first, then size the position from it.",
    ],
    example:
      "Idea: the LABX uptrend holds above the pullback low at 98.40. A break below 98.40 ends the higher-low sequence, so with a 0.15 buffer the stop goes at 98.25. A stop at 99.50, chosen only to keep the loss small, could be hit by ordinary noise while the idea was still valid.",
    related: ["stop-loss-order", "support-and-resistance", "position-sizing"],
    missions: ["M04", "M06"],
    lessons: ["L10"],
  },
  {
    id: "trailing-stop",
    name: "Trailing stop",
    category: "stop_loss",
    summary: "A trailing stop is a stop-loss that is moved in the direction of a profitable trade to protect part of the gain.",
    body: [
      "A trailing stop can follow new swing lows in an uptrend, a fixed distance, or a multiple of ATR. It only ever moves in the trade's favour; moving a stop further away is widening it, not trailing it.",
      "Trailing too tightly turns ordinary pullbacks into exits. The trailing rule belongs in the plan before entry.",
    ],
    example:
      "Long from 100.00 with the initial stop at 98.00. LABX rises to 104.00 and forms a higher low at 102.50, so the trader moves the stop to 102.30. The worst planned outcome is now a gain of 2.30 per unit before costs, unless a gap jumps the stop.",
    related: ["stop-loss-order", "trend", "volatility"],
    missions: [],
    lessons: ["L10"],
  },
  {
    id: "gap-risk",
    name: "Gap risk",
    category: "stop_loss",
    summary: "Gap risk is the chance that price jumps past your stop between one candle and the next, so the loss is larger than planned.",
    body: [
      "A gap is an opening price far from the previous close, with no trading in between. Because a stop becomes a market order when touched, a gap through it fills at the open, not at the stop level.",
      "A stop cannot remove gap risk. You can limit it by keeping exposure moderate and by not relying on a risk budget that only works if every stop fills exactly.",
    ],
    example:
      "Long 50 LABX at 100.00 with a stop at 98.50: planned loss 50 × 1.50 = 75.00 vUSD. The next candle gaps lower and the stop fills at 97.80, so the loss is 50 × 2.20 = 110.00 vUSD before costs, 35.00 more than planned.",
    related: ["slippage", "stop-loss-order", "exposure"],
    missions: [],
    lessons: ["L04", "L10"],
  },

  // ─── Risk management ────────────────────────────────────────────────────
  {
    id: "risk-per-trade",
    name: "Risk per trade",
    category: "risk_management",
    summary: "Risk per trade is the amount you stand to lose if a trade reaches its stop, usually set as a small percentage of equity.",
    body: [
      "Defining risk before entry makes any single loss survivable and makes trades comparable. It is the distance to the stop multiplied by the size, plus costs.",
      "MARKET//LAB missions typically limit risk to 1% of equity per trade, and the Arena to 2%. The percentage is a ceiling, not a target.",
    ],
    example:
      "With 10,000.00 vUSD of equity, 1% risk is 100.00 and 2% is 200.00. A trade that would lose 140.00 at its stop, costs included, breaks a 1% rule even if it later turns out to be profitable.",
    related: ["position-sizing", "r-multiple", "drawdown", "fixed-fractional-sizing"],
    missions: ["M04", "M05"],
    lessons: ["L08"],
  },
  {
    id: "r-multiple",
    name: "R multiple",
    category: "risk_management",
    summary: "An R multiple expresses a trade's result as a multiple of the amount risked on it, where 1R is the planned loss at the stop.",
    body: [
      "Measuring results in R makes trades of different sizes comparable and shows whether losses stayed within plan. A result of −1R is a stop doing its job; a loss well beyond 1R means something went outside the plan, such as a widened stop or a gap.",
    ],
    example:
      "1R = 100.00 vUSD. A trade closing at +250.00 is +2.5R, one closing at −60.00 is −0.6R, and one closing at −160.00 is −1.6R, a sign that the stop was moved or a gap jumped it.",
    related: ["risk-per-trade", "reward-to-risk", "expectancy"],
    missions: [],
    lessons: ["L08", "L11"],
  },
  {
    id: "reward-to-risk",
    name: "Reward-to-risk ratio",
    category: "risk_management",
    summary: "The reward-to-risk ratio compares the distance from entry to target with the distance from entry to stop.",
    body: [
      "A 2:1 ratio means the target is twice as far from entry as the stop. A higher ratio lowers the share of trades that must win to break even, but distant targets are usually reached less often, so the ratio alone says nothing about quality.",
      "The levels must be realistic. A target placed beyond strong resistance just to improve the ratio is wishful thinking.",
    ],
    example:
      "Entry 100.00, stop 99.00, target 102.50: risk 1.00, reward 2.50, a 2.5:1 ratio. Ignoring costs, the break-even win rate is 1 ÷ (1 + 2.5), about 28.6%.",
    related: ["expectancy", "r-multiple", "bracket-order"],
    missions: ["M06"],
    lessons: ["L11"],
  },
  {
    id: "expectancy",
    name: "Expectancy",
    category: "risk_management",
    summary: "Expectancy is the average result per trade you would expect from a set of rules, combining the win rate with the average sizes of wins and losses.",
    body: [
      "Expectancy = (win rate × average win) − (loss rate × average loss), usually in R. A positive expectancy only shows up over many trades; any single trade can still lose.",
      "Estimates from small samples are unreliable, and costs reduce expectancy on every trade. Treat any figure as a hypothesis to test, not a promise.",
    ],
    example:
      "Suppose a set of rules wins 40% of the time, with an average win of 2R and an average loss of 1R. Expectancy = 0.40 × 2 − 0.60 × 1 = +0.20R per trade before costs. With 1R = 100.00 vUSD that is +20.00 on average, although each trade either wins about 200.00 or loses about 100.00.",
    related: ["reward-to-risk", "r-multiple", "base-rates"],
    missions: [],
    lessons: ["L11"],
  },
  {
    id: "drawdown",
    name: "Drawdown",
    category: "risk_management",
    summary: "A drawdown is a decline in equity from its previous peak, measured in vUSD or as a percentage of that peak.",
    body: [
      "Losing streaks happen to any approach that does not win every time. Drawdowns are harder to recover from than they look, because the percentage gain needed to get back exceeds the percentage lost.",
      "Risking too much per trade raises the chance that a streak causes a drawdown you cannot recover from, which is the idea behind risk of ruin. Small, consistent risk keeps streaks survivable.",
    ],
    example:
      "Equity rises to 10,800.00 vUSD, then falls to 9,720.00: a drawdown of 1,080.00, which is 10% of the peak. Getting back to 10,800.00 needs a gain of 1,080.00 ÷ 9,720.00, about 11.1%.",
    related: ["risk-per-trade", "fixed-fractional-sizing", "revenge-trading"],
    missions: [],
    lessons: ["L18", "L08"],
  },

  // ─── Position sizing ────────────────────────────────────────────────────
  {
    id: "position-sizing",
    name: "Position sizing",
    category: "position_sizing",
    summary: "Position sizing is choosing how many units to trade so that a loss at the stop is no larger than your risk budget.",
    body: [
      "Size follows from two decisions already made: how much you are willing to lose (the risk budget) and where the idea is wrong (the stop). Units = risk budget ÷ risk per unit, rounded down.",
      "Choosing the size first and then fitting a stop around it reverses the logic and usually puts the stop in the wrong place.",
    ],
    example:
      "Risk budget 100.00 vUSD. Entry at the ask of 100.05, stop at 98.05: 2.00 of risk per unit. The textbook size is 100.00 ÷ 2.00 = 50 units, before costs.",
    related: ["risk-per-trade", "cost-adjusted-sizing", "invalidation-level", "fixed-fractional-sizing"],
    missions: ["M05"],
    lessons: ["L09"],
  },
  {
    id: "fixed-fractional-sizing",
    name: "Fixed-fractional sizing",
    category: "position_sizing",
    summary: "Fixed-fractional sizing risks the same percentage of current equity on every trade, so the vUSD amount at risk changes as the account changes.",
    body: [
      "After losses the amount at risk shrinks automatically, which slows a drawdown; after gains it grows. Each trade stays proportionate to the account rather than to confidence or recent results.",
    ],
    example:
      "At 1%: with 10,000.00 vUSD of equity the risk is 100.00; after losses take equity to 9,500.00 it is 95.00; after gains take it to 11,000.00 it is 110.00.",
    related: ["risk-per-trade", "position-sizing", "drawdown"],
    missions: ["M05"],
    lessons: ["L08", "L09"],
  },
  {
    id: "cost-adjusted-sizing",
    name: "Cost-adjusted sizing",
    category: "position_sizing",
    summary: "Cost-adjusted sizing includes trading costs in the risk per unit, so the loss at the stop stays within budget after costs.",
    body: [
      "The textbook formula ignores costs, so a stop-out loses slightly more than the budget. Including them: units = risk budget ÷ (entry-to-stop distance + costs per unit), rounded down.",
      "In MARKET//LAB you buy at the ask, so the spread is already inside the entry-to-stop distance. The costs per unit are then the two commissions: 0.05% of the entry price plus 0.05% of the stop price.",
    ],
    example:
      "Budget 100.00 vUSD, entry (ask) 100.05, stop 98.05. Commissions per unit = 0.0005 × (100.05 + 98.05) = 0.09905. Units = 100.00 ÷ (2.00 + 0.09905), about 47.6, rounded down to 47, compared with 50 from the textbook formula.",
    related: ["position-sizing", "trading-costs", "bid-ask-spread"],
    missions: ["M05"],
    lessons: ["L09"],
  },

  // ─── Psychology ─────────────────────────────────────────────────────────
  {
    id: "fomo",
    name: "FOMO (fear of missing out)",
    category: "psychology",
    summary: "FOMO is the urge to enter a trade because a move is happening without you, rather than because your setup is present.",
    body: [
      "FOMO typically appears after a large, fast move. Entering late usually means the logical stop is far away, the reward-to-risk is worse and the move itself is making the decision.",
      "A useful test: would you take this trade if you had not just watched the move? Waiting for a pullback, or passing altogether, are valid decisions.",
    ],
    example:
      "LABX rallies from 100.00 to 106.00 in five candles. Buying at 106.00 with the stop at 103.00, just under the old range high, risks 3.00 per unit, so a 100.00 vUSD budget buys 33 units. If price pulls back to 104.50 and holds, the same stop risks 1.50 and the budget buys 66 units, ignoring costs.",
    related: ["breakout", "revenge-trading", "trading-plan", "reward-to-risk"],
    missions: ["M06"],
    lessons: ["L13"],
  },
  {
    id: "revenge-trading",
    name: "Revenge trading",
    category: "psychology",
    summary: "Revenge trading is taking impulsive, often larger trades straight after a loss in an attempt to win the money back quickly.",
    body: [
      "After a loss, the goal can quietly shift from following the process to repairing the balance. Size tends to rise and the setup criteria fall away, so one planned loss can turn into several unplanned ones.",
      "Simple circuit breakers help: a pause after a stop-out, a daily loss limit, and a rule that risk per trade never rises after a loss.",
    ],
    example:
      "A trader loses 100.00 vUSD (−1R) and immediately opens a new trade with no setup, risking 300.00 to get it back. If that one also hits its stop, the total loss is 400.00, four times the planned risk per trade.",
    related: ["loss-aversion", "fomo", "drawdown", "journaling"],
    missions: [],
    lessons: ["L13", "L18"],
  },
  {
    id: "loss-aversion",
    name: "Loss aversion",
    category: "psychology",
    summary: "Loss aversion is the tendency to feel a loss more strongly than a gain of the same size, which makes people reluctant to accept losses.",
    body: [
      "In trading it shows up as holding losers in the hope they come back, widening stops to give the trade room, and closing winners early to lock in a gain.",
      "A stop exists so that the decision to accept a loss is made before the pain starts. Moving it further away turns a planned, limited loss into an open-ended one.",
    ],
    example:
      "A long sized to lose 100.00 vUSD at its stop is down 70.00. Moving the stop to twice its original distance from entry would raise the planned loss to about 200.00, although nothing about the setup has improved.",
    related: ["stop-loss-order", "revenge-trading", "decision-quality"],
    missions: ["M07"],
    lessons: ["L13"],
  },
  {
    id: "confirmation-bias",
    name: "Confirmation bias",
    category: "psychology",
    summary: "Confirmation bias is the tendency to notice and favour information that supports what you already believe, and to discount evidence against it.",
    body: [
      "Once a trade idea forms, every rising candle looks like proof and every warning sign looks like noise. The bias is strongest when you already hold a position.",
      "Counter it by writing down, before entry, what would prove the idea wrong, and by checking each setup against a written list of conditions rather than against your hopes.",
    ],
    example:
      "Bullish on LABX, a trader points to the rising 20-period moving average but overlooks three lower highs printed over the last 10 hours. Writing 'the idea is wrong below 98.40' before entry turns that evidence into a rule.",
    related: ["trading-plan", "invalidation-level", "false-breakout"],
    missions: ["M10"],
    lessons: ["L13", "L14"],
  },

  // ─── Decision making ────────────────────────────────────────────────────
  {
    id: "trading-plan",
    name: "Trading plan and playbook",
    category: "decision_making",
    summary: "A trading plan sets out in advance what you trade, when you enter, where you exit and how much you risk; a playbook lists its specific setups.",
    body: [
      "A playbook setup works like a checklist: every condition must be true before entry. If one fails, the answer is no trade, and that counts as following the plan.",
      "Plans are written when calm and followed when not. Changes are made between trades, after review, not in the middle of one.",
    ],
    example:
      "Playbook rule: enter long only if (1) the last candle closed above the 30-candle high, (2) its volume is above the 20-candle average and (3) a stop below the last three candles' low is within 3% of price. If only two of the three are true, there is no trade.",
    related: ["decision-quality", "journaling", "confirmation-bias", "scenario-planning"],
    missions: ["M10", "M07"],
    lessons: ["L14"],
  },
  {
    id: "decision-quality",
    name: "Decision quality (process vs outcome)",
    category: "decision_making",
    summary: "Decision quality judges a trade by the information, reasoning and risk control at the moment of the decision, not by how it turned out.",
    body: [
      "In an uncertain market a good decision can lose and a poor one can win. Judging only by outcomes rewards luck and punishes discipline.",
      "MARKET//LAB therefore scores Decision Quality, Risk Discipline and the Simulated Outcome separately. A profitable trade does not by itself mean the decision was good.",
    ],
    example:
      "Trade A followed the playbook, risked 1% and was stopped out for −1R. Trade B had no stop, sat through a loss of 180.00 vUSD and was eventually closed at +150.00. Trade A was the better decision; Trade B was a poor decision with a lucky outcome.",
    related: ["trading-plan", "journaling", "counterfactual-thinking", "loss-aversion"],
    missions: ["M04", "M10"],
    lessons: ["L17"],
  },
  {
    id: "journaling",
    name: "Trading journal",
    category: "decision_making",
    summary: "A trading journal records each trade's plan, reasons, execution, emotions and result, so decisions can be reviewed later.",
    body: [
      "Memory favours the dramatic and the flattering. A journal reveals patterns, such as whether losses beyond 1R come from gaps or from widened stops, and whether a setup works as often as it feels it does.",
      "Record the plan before entry and the review after exit, and grade the decision separately from the result.",
    ],
    example:
      "Entry: LABX long, pullback setup, entry 100.05, stop 98.05, 47 units, risk 98.67 vUSD including commissions. Exit: stopped at 98.05, −1R. Followed plan: yes. Note: calm entry, every condition met.",
    related: ["decision-quality", "base-rates", "trading-plan"],
    missions: [],
    lessons: ["L17"],
  },

  // ─── Portfolio exposure ─────────────────────────────────────────────────
  {
    id: "exposure",
    name: "Exposure",
    category: "portfolio_exposure",
    summary: "Exposure is the total market value of your open positions, often expressed as a percentage of equity.",
    body: [
      "Risk per trade measures the loss at the stop; exposure measures how much of the account is in the market. Two trades with the same 1% risk can carry very different exposure, because a tight stop allows a larger position.",
      "High exposure magnifies the impact of gaps and fast moves, so it is worth watching alongside risk per trade, especially when positions are related.",
    ],
    example:
      "Holding 60 LABX at 100.00 is 6,000.00 vUSD of exposure on a 10,000.00 account, or 60%. A 5% gap down would cost 300.00, three times a 1% risk budget, whatever the stop said.",
    related: ["leverage", "correlation-and-concentration", "gap-risk"],
    missions: [],
    lessons: ["L12"],
  },
  {
    id: "leverage",
    name: "Leverage",
    category: "portfolio_exposure",
    summary: "Leverage lets you hold positions worth more than your equity, magnifying both gains and losses relative to the account.",
    body: [
      "With 5:1 leverage, each vUSD of equity controls 5 vUSD of position. Price moves act on the whole position, so a small move against it becomes a large share of the account.",
      "MARKET//LAB missions and the Arena use no leverage: the most you can hold is what your equity can pay for. Leverage is explained here so you can recognise its risks elsewhere.",
    ],
    example:
      "With 10,000.00 vUSD and 5:1 leverage, a trader could hold 50,000.00 of LABX. A 2% move against the position costs 1,000.00, which is 10% of the account. Without leverage, the same move on a 10,000.00 position costs 200.00.",
    related: ["exposure", "drawdown", "risk-per-trade"],
    missions: [],
    lessons: ["L12"],
  },
  {
    id: "correlation-and-concentration",
    name: "Correlation and concentration",
    category: "portfolio_exposure",
    summary: "Correlation describes how closely positions move together; concentration is having much of your risk tied to one idea, instrument or driver.",
    body: [
      "Positions that move together behave like one large position. Several 1% trades on closely related instruments, or several entries on the same instrument, can add up to a much larger single bet.",
      "Diversification helps only when positions are genuinely independent, and correlations can rise sharply when markets are under stress.",
    ],
    example:
      "A trader holds two LABX longs opened at different times, each risking 1%. If one stop is hit, the other is probably under pressure too: together they behave like a single 2% bet on the same idea.",
    related: ["exposure", "leverage", "risk-per-trade"],
    missions: [],
    lessons: ["L12"],
  },

  // ─── Scenario analysis ──────────────────────────────────────────────────
  {
    id: "scenario-planning",
    name: "Scenario planning",
    category: "scenario_analysis",
    summary: "Scenario planning means deciding, before entry, how you will respond to each of the main ways a trade could develop.",
    body: [
      "Instead of a single forecast, list a few plausible paths, for example the trend resumes, the level fails, or price goes sideways, and write down the action for each. The goal is preparation, not prediction.",
      "When a scenario plays out, you execute instead of improvising. Scenarios without probabilities are still useful; invented precision is not.",
    ],
    example:
      "Long LABX at 100.05, stop 98.05, target 104.05. A: the trend resumes, hold to the target (+2R). B: price breaks 98.05, accept −1R. C: price stays between 99.00 and 101.00 for 12 candles, close the trade, because the idea expected momentum.",
    related: ["trading-plan", "base-rates", "counterfactual-thinking"],
    missions: [],
    lessons: ["L15"],
  },
  {
    id: "base-rates",
    name: "Base rates",
    category: "scenario_analysis",
    summary: "A base rate is how often an outcome occurs across a broad set of similar situations, used as a starting point before the details of the current case.",
    body: [
      "People tend to judge a setup by how convincing it looks and to ignore how often similar setups have worked. Starting from the base rate and then adjusting keeps vivid examples in proportion.",
      "A base rate needs a large, honest sample, such as your own journal or a backtest. A handful of memorable trades is not a base rate.",
    ],
    example:
      "Suppose your journal holds 30 breakout trades taken under the same rules, and 12 followed through: a base rate of 12 ÷ 30 = 40%. A new breakout that looks perfect still starts from about 40% until you have evidence that it is different.",
    related: ["expectancy", "journaling", "scenario-planning", "false-breakout"],
    missions: [],
    lessons: ["L15", "L17"],
  },
  {
    id: "counterfactual-thinking",
    name: "Counterfactual thinking",
    category: "scenario_analysis",
    summary: "Counterfactual thinking asks what else could have happened, so a decision is judged against all the plausible outcomes, not just the one that occurred.",
    body: [
      "The outcome you saw was only one of several that were possible when you decided. Asking how the decision would have fared on the other paths helps separate skill from luck.",
      "Use it with care: 'if only I had held' is hindsight, not analysis. The useful question is what could reasonably have been known at the time of the decision.",
    ],
    example:
      "Stopped out at 98.05 for −1R, a trader then watches LABX rally to 105.00. Counterfactual review: had price kept falling, the stop would have prevented a larger loss. The stop sat at the invalidation level, so the decision was sound on both paths.",
    related: ["decision-quality", "scenario-planning", "loss-aversion"],
    missions: ["M04", "M07"],
    lessons: ["L15", "L17"],
  },
];
