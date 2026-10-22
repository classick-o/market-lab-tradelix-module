import type { Lesson } from "../types";

/**
 * Lessons L01–L07, L09 and L12: market fundamentals, order types, technical analysis,
 * position sizing and exposure. All prices in vUSD on the synthetic instrument LABX.
 */
export const LESSONS_A: Lesson[] = [
  {
    id: "L01",
    title: "What a candle shows",
    topic: "market_fundamentals",
    level: "beginner",
    tier: "free",
    minutes: 5,
    summary: "A candle packs one hour of trading into four prices: the open, the high, the low and the close.",
    objectives: [
      "Read the open, high, low and close of any candle.",
      "Tell a bullish candle from a bearish one and describe its body and wicks.",
      "Separate what a candle records from what it cannot predict.",
    ],
    blocks: [
      {
        kind: "text",
        text: "A **candle** summarises trading over one period. In MARKET//LAB each candle covers one hour, so a chart of 48 candles shows two days. Every candle is built from just four prices, often shortened to **OHLC**: open, high, low and close.",
      },
      {
        kind: "points",
        items: [
          "**Open**: the first price of the hour.",
          "**High**: the highest price traded during the hour.",
          "**Low**: the lowest price traded during the hour.",
          "**Close**: the last price of the hour.",
        ],
      },
      {
        kind: "figure",
        diagram: "candle-anatomy",
        caption: "The body runs from the open to the close; the wicks reach the high and the low. Whether the close ends up above or below the open decides if the candle is bullish or bearish.",
      },
      { kind: "heading", text: "Body, wicks and direction" },
      {
        kind: "text",
        text: "The **body** is the thick part between the open and the close. The thin lines above and below it are the **wicks** (also called shadows); their tips mark the high and the low. A **bullish** candle closed above its open. A **bearish** candle closed below its open. Charts draw the two kinds in different colours or fills.",
      },
      {
        kind: "example",
        title: "Reading one candle",
        lines: [
          "Open 100.00, high 101.50, low 99.20, close 101.00.",
          "Close above open: the candle is bullish.",
          "Body: 101.00 − 100.00 = 1.00.",
          "Upper wick: 101.50 − 101.00 = 0.50.",
          "Lower wick: 100.00 − 99.20 = 0.80.",
          "Range (high − low): 101.50 − 99.20 = 2.30, which is 1.00 + 0.50 + 0.80.",
        ],
        result: "During the hour price traded as low as 99.20 and as high as 101.50, and it finished at 101.00.",
      },
      {
        kind: "interactive",
        widget: "candle-builder",
        title: "Build a candle",
        prompt: "Set the open, high, low and close. Make the close lower than the open, then give the candle a long lower wick, and read how the description changes.",
      },
      { kind: "heading", text: "What a candle cannot tell you" },
      {
        kind: "text",
        text: "A candle shows where price went, not the order in which it got there. From the candle alone you cannot tell whether the high or the low came first. One candle also says nothing reliable about the next one: a strong bullish hour can be followed by anything. Read each candle as a record of the past hour, not as a forecast.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A candle is a summary, not a signal. It records four prices from one hour; what happens next depends on things the candle does not show.",
      },
      { kind: "check", questionIds: ["q-mf-1", "q-mf-2", "q-mf-3"] },
    ],
    practice: [
      { kind: "mission", ref: "M01", label: "Read the Candle" },
      { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
    ],
  },

  {
    id: "L02",
    title: "Bid, ask and the spread",
    topic: "market_fundamentals",
    level: "beginner",
    tier: "free",
    minutes: 6,
    summary: "You buy at the higher ask and sell at the lower bid, and pay commission on every fill, so each new position starts slightly behind.",
    objectives: [
      "Name the bid, the ask, the mid and the spread, and say which price a buyer and a seller get.",
      "Calculate the round-trip cost of a position, including spread and commission.",
      "Explain why a new position shows a small loss straight away.",
    ],
    blocks: [
      {
        kind: "text",
        text: "At any moment there are two prices, not one. The **bid** is the highest price a buyer will pay, so it is what you receive when you sell. The **ask** is the lowest price a seller will accept, so it is what you pay when you buy. The gap between them is the **spread**.",
      },
      {
        kind: "figure",
        diagram: "bid-ask-spread",
        caption: "Buyers pay the ask, sellers receive the bid. The mid sits halfway between them, and the distance from bid to ask is the spread.",
      },
      {
        kind: "points",
        items: [
          "**Mid**: halfway between the bid and the ask. The candles on MARKET//LAB charts are drawn from the mid.",
          "On LABX the spread is 0.10 vUSD: bid = mid − 0.05, ask = mid + 0.05.",
          "Buy orders fill at the ask. Sell orders fill at the bid.",
          "**Commission**: a fee of 0.05% of the fill value, charged when you enter and again when you exit.",
        ],
      },
      {
        kind: "example",
        title: "The three prices at a mid of 100.00",
        lines: [
          "Ask, what a buyer pays: 100.00 + 0.05 = 100.05.",
          "Bid, what a seller receives: 100.00 − 0.05 = 99.95.",
          "Spread: 100.05 − 99.95 = 0.10.",
        ],
        result: "Buy and sell straight back, and you lose 0.10 per unit before any commission.",
      },
      { kind: "heading", text: "The round-trip cost" },
      {
        kind: "text",
        text: "A **round trip** means opening a position and closing it. You cross the spread once, because you enter on one side and leave on the other, and you pay commission twice. Costs are certain; the price move is not. That is why a position shows a small loss the moment it opens, even if the mid has not moved.",
      },
      {
        kind: "example",
        title: "Buy 50 units and sell them straight back (mid stays at 100.00)",
        lines: [
          "Buy 50 at the ask, 100.05: fill value 50 × 100.05 = 5,002.50.",
          "Sell 50 at the bid, 99.95: fill value 50 × 99.95 = 4,997.50.",
          "Spread cost: 50 × 0.10 = 5.00.",
          "Commission: 0.05% × (5,002.50 + 4,997.50) = 0.05% × 10,000.00 = 5.00.",
          "Round-trip cost: 5.00 + 5.00 = 10.00, or 0.20 per unit.",
          "The simulator rounds each fee up to the next cent, so it would charge 2.51 + 2.50 = 5.01 in commission.",
        ],
        result: "The mid has to rise by about 0.20 before this position gets back to zero.",
      },
      {
        kind: "interactive",
        widget: "spread-cost",
        title: "What does a round trip cost?",
        prompt: "Enter a spread of 0.10 and a commission of 0.05% for 50 units at a mid of 100.00, and compare the result with the example. Then double the size and see how the cost changes.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "A common mistake is to ignore costs because each one looks tiny. They are paid on every trade, winning or losing, and they take a bigger share of the result when price moves only a little.",
      },
      { kind: "check", questionIds: ["q-mf-4", "q-mf-5", "q-mf-6"] },
    ],
    practice: [
      { kind: "mission", ref: "M05", label: "Size Matters" },
      { kind: "arena", ref: "low_volatility", label: "Arena: low volatility" },
      { kind: "check", ref: "market_fundamentals", label: "Market fundamentals check" },
    ],
  },

  {
    id: "L03",
    title: "Market and limit orders",
    topic: "order_types",
    level: "beginner",
    tier: "free",
    minutes: 5,
    summary: "A market order trades now at the current price, while a limit order names your price and waits, and may never fill.",
    objectives: [
      "Choose between a market order and a limit order for a given plan.",
      "Predict the fill price of a market order from the bid and the ask.",
      "Explain when a buy limit or a sell limit can fill.",
    ],
    blocks: [
      {
        kind: "text",
        text: "An **order** is an instruction to buy or sell. The two basic types answer one question differently: what matters more right now, getting filled or getting a particular price? A **market order** buys or sells immediately at the best price available. A **limit order** buys or sells only at your chosen price or better.",
      },
      {
        kind: "figure",
        diagram: "market-vs-limit",
        caption: "A market buy fills now at the ask. A buy limit placed lower waits for price to come down to it, and never fills if price keeps rising.",
      },
      { kind: "heading", text: "Market orders: certainty of a fill" },
      {
        kind: "points",
        items: [
          "A market buy fills at the ask; a market sell fills at the bid.",
          "In the simulator you fill at the current ask or bid. In real markets a fast move can make the fill worse than the price you saw; this is called **slippage**.",
          "Use one when your plan says 'enter now' and being in the trade matters more than a few cents.",
        ],
      },
      { kind: "heading", text: "Limit orders: certainty of price" },
      {
        kind: "points",
        items: [
          "A **buy limit** sits below the current price: buy only at 99.00 or lower.",
          "A **sell limit** sits above the current price: sell only at 102.00 or higher.",
          "A buy limit fills only if the ask trades at or through your limit; a sell limit only if the bid does. Coming close is not enough.",
          "If it never fills, there is no trade. That is the price of insisting on a price.",
        ],
      },
      {
        kind: "example",
        title: "Same idea, two orders (mid 100.00, ask 100.05)",
        lines: [
          "Market buy, 30 units: fills now at 100.05. Position value: 30 × 100.05 = 3,001.50.",
          "Buy limit, 30 units at 99.00: waits. It fills only if the ask reaches 99.00, which means the mid falling to 98.95.",
          "Suppose the mid dips to 99.10, so the ask only reaches 99.15, and then climbs to 103.00.",
          "The limit never fills. The market order is in the trade.",
        ],
        result: "The limit order did exactly what it was told. Missing the move is the known cost of a limit, not a mistake.",
      },
      {
        kind: "text",
        text: "Neither order is better in general. A market order suits a plan that says 'enter now'. A limit order suits a plan that says 'only at this price'. Decide which one your plan needs before you click, not after price has moved.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Chasing is a common mistake: you set a limit, price runs away from it, and you cancel it and buy at market at a worse price. If the plan said 'only at 99.00', price leaving without you has not changed the plan.",
      },
      { kind: "check", questionIds: ["q-ot-1", "q-ot-2", "q-ot-3"] },
    ],
    practice: [
      { kind: "mission", ref: "M06", label: "The FOMO Trap" },
      { kind: "check", ref: "order_types", label: "Order types check" },
    ],
  },

  {
    id: "L04",
    title: "Stop-loss and take-profit orders",
    topic: "order_types",
    level: "beginner",
    tier: "free",
    minutes: 6,
    summary: "A stop-loss closes a losing position at a level you chose in advance, and a take-profit closes a winning one at a planned target.",
    objectives: [
      "Place a stop-loss where the trade idea is proven wrong rather than at an arbitrary distance.",
      "Explain why a stop can fill at a worse price than the stop after a gap.",
      "Set a take-profit that follows from the plan.",
    ],
    blocks: [
      {
        kind: "text",
        text: "A **stop-loss** (SL) is an exit order that closes your position if price moves against you to a level you chose in advance. A **take-profit** (TP) closes it if price reaches your target. Both are decided before entry, while you are calm, and both stay attached to the position so they work while you are not watching.",
      },
      { kind: "heading", text: "How a stop-loss fills" },
      {
        kind: "points",
        items: [
          "For a long position the stop sits below the entry. When the bid touches it, it becomes a market order to sell.",
          "Usually the fill is at the stop price or very close to it.",
          "If price **gaps** through the stop, opening beyond it with no trading in between, the fill is at the open, worse than the stop.",
          "A stop limits the loss you plan for. It does not guarantee it.",
        ],
      },
      {
        kind: "example",
        title: "A gap through the stop",
        lines: [
          "Long 25 units bought at 100.00, stop at 96.00.",
          "Planned loss: 25 × (100.00 − 96.00) = 100.00 before commission, which is 1% of 10,000.00.",
          "The next candle opens with the bid at 94.00, below the stop.",
          "The stop fills at 94.00: 25 × (100.00 − 94.00) = 150.00 before commission.",
        ],
        result: "The gap added 50.00 to the planned loss. A stop controls the loss in normal trading, not in every situation.",
      },
      {
        kind: "figure",
        diagram: "stop-placement",
        caption: "A stop just under support sits inside normal noise and is easily hit. A stop beyond the level is hit only if the idea has actually failed.",
      },
      { kind: "heading", text: "Where to put the stop" },
      {
        kind: "text",
        text: "Put the stop where your reason for the trade would be proven wrong: the **invalidation** point. If you bought because support at 98.00 held, a clear break below 98.00 invalidates the idea. A stop a few cents under 98.00 sits inside ordinary noise and can be hit even when the idea was right. Choose the stop first, then size the position to fit it.",
      },
      {
        kind: "text",
        text: "A take-profit works like a limit order on the way out: for a long position it sells when the bid reaches your target, at that price or better. Put it where the plan says price could reasonably go, such as the next resistance level, not at a number picked to make the trade look attractive.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Moving a stop further away as price approaches it is a common mistake. It turns a planned, sized loss into a larger, unplanned one. Move a stop only in the direction that reduces risk.",
      },
      { kind: "check", questionIds: ["q-ot-4", "q-ot-5", "q-ot-6"] },
    ],
    practice: [
      { kind: "mission", ref: "M04", label: "Define Your Risk" },
      { kind: "mission", ref: "M07", label: "Stop or Stay?" },
      { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
    ],
  },

  {
    id: "L05",
    title: "Trends, ranges and noise",
    topic: "technical_analysis",
    level: "beginner",
    tier: "free",
    minutes: 6,
    summary: "Most stretches of a chart look like a trend, a range or plain noise, and naming which one you see comes before any trade idea.",
    objectives: [
      "Identify an uptrend or a downtrend from its swing highs and swing lows.",
      "Recognise a range and the levels that bound it.",
      "Tell structured moves apart from noise.",
    ],
    blocks: [
      {
        kind: "text",
        text: "Before asking whether to trade, ask what kind of market you are looking at. A useful first sort has three boxes: **trend**, **range** and **noise**. The labels describe what has happened so far. They are not promises about what happens next, and the same chart can move from one box to another.",
      },
      {
        kind: "figure",
        diagram: "trend-range-noise",
        caption: "An uptrend makes higher highs and higher lows. A range turns between two levels. Noise moves back and forth with no clear structure.",
      },
      { kind: "heading", text: "Trends" },
      {
        kind: "text",
        text: "A **swing high** is a peak with lower highs on either side; a **swing low** is a trough with higher lows on either side. An **uptrend** makes higher swing highs and higher swing lows. A **downtrend** makes lower highs and lower lows. The trend is intact while that pattern holds.",
      },
      {
        kind: "example",
        title: "Is this still an uptrend?",
        lines: [
          "Swing highs: 102.00, 103.50, 105.00. Each is higher than the last.",
          "Swing lows: 100.00, 101.20, 102.40. Each is higher than the last.",
          "The next swing low is 101.00, below 102.40.",
        ],
        result: "Up to 102.40 the swings describe an uptrend. The lower low at 101.00 breaks the pattern: the trend is now in question, though not necessarily reversed.",
      },
      { kind: "heading", text: "Ranges and noise" },
      {
        kind: "points",
        items: [
          "**Range**: price keeps turning near the same floor and ceiling, and new highs or lows do not last.",
          "**Noise**: small back-and-forth moves with no clear swings. On 1-hour candles, two or three candles in the same direction are often just noise.",
          "If you cannot tell which box a stretch belongs in, that is information too: the picture is unclear.",
        ],
      },
      {
        kind: "text",
        text: "Why it matters: an idea built for a trend, such as buying a pullback, relies on a structure that a range does not have, and the reverse is also true. In noise there is no structure to rely on at all, only costs to pay.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "Name the market before you trade it. If you cannot say whether it is trending, ranging or just noise, staying out is a valid decision.",
      },
      { kind: "check", questionIds: ["q-ta-1", "q-ta-2", "q-ta-3"] },
    ],
    practice: [
      { kind: "mission", ref: "M02", label: "Trend or Noise?" },
      { kind: "arena", ref: "bullish", label: "Arena: bullish" },
      { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    ],
  },

  {
    id: "L06",
    title: "Support, resistance and breakouts",
    topic: "technical_analysis",
    level: "beginner",
    tier: "free",
    minutes: 6,
    summary: "Support and resistance are price zones where moves have repeatedly stalled, and a break through one can either hold or fail.",
    objectives: [
      "Mark support and resistance as zones from repeated turns in price.",
      "Describe what separates a breakout from a false breakout.",
      "Plan a stop that allows for a breakout failing.",
    ],
    blocks: [
      {
        kind: "text",
        text: "**Support** is a price area where falls have repeatedly stopped and turned up. **Resistance** is an area where rises have repeatedly stopped and turned down. They are zones, not exact lines: price might turn at 98.10 one time and at 97.90 the next. The more clearly a level has been respected, the more traders notice it.",
      },
      {
        kind: "figure",
        diagram: "support-resistance",
        caption: "A range with several touches of support below and resistance above. No two touches turn at exactly the same price.",
      },
      {
        kind: "points",
        items: [
          "Look for at least two clear turns near the same price.",
          "Draw a band, not a single line, wide enough to cover the touches.",
          "Watch the closes as well as the wicks: a wick that pokes through and closes back inside is a test, not a break.",
          "A level that breaks can swap roles: old resistance may act as support later.",
        ],
      },
      { kind: "heading", text: "Breakouts and false breakouts" },
      {
        kind: "text",
        text: "A **breakout** is when price closes beyond a level and keeps going. A **false breakout** is when price closes beyond the level and then falls back inside the range. At the moment of the break they look the same. The difference only shows in the candles that follow.",
      },
      {
        kind: "figure",
        diagram: "breakout-false-breakout",
        caption: "Left: a breakout above resistance that holds. Right: a false breakout that closes back inside the range.",
      },
      {
        kind: "example",
        title: "Same start, two endings",
        lines: [
          "Range: support at 98.00, resistance at 102.00.",
          "A 1-hour candle closes at 102.60. A buyer enters at the ask, 102.65, with a stop at 101.70, back inside the range.",
          "Ending A: the next candles close at 102.90 and 103.40, and dips hold above 102.00. The breakout holds.",
          "Ending B: the next candle falls to 101.30 and closes at 101.40. The stop fills at 101.70: a loss of 102.65 − 101.70 = 0.95 per unit before commission.",
        ],
        result: "At the moment of entry the two endings looked identical. The stop is what kept ending B a small, planned loss.",
      },
      {
        kind: "text",
        text: "Waiting for a candle to close beyond the level, rather than reacting to a wick, filters out some false moves at the cost of a later entry. Nothing filters out all of them. Decide before entering where price would be if the breakout had failed, and put the stop there.",
      },
      {
        kind: "callout",
        tone: "warning",
        text: "A common mistake is buying the instant price pokes above resistance with no plan for a false breakout. If price falls back into the range, there is no exit ready and the decision gets made under pressure.",
      },
      { kind: "check", questionIds: ["q-ta-4", "q-ta-5", "q-ta-6"] },
    ],
    practice: [
      { kind: "arena", ref: "breakout", label: "Arena: breakout" },
      { kind: "arena", ref: "false_breakout", label: "Arena: false breakout" },
      { kind: "mission", ref: "M04", label: "Define Your Risk" },
    ],
  },

  {
    id: "L07",
    title: "Moving averages without the magic",
    topic: "technical_analysis",
    level: "intermediate",
    tier: "free",
    minutes: 6,
    summary: "A moving average smooths past closes into one line that lags price, which makes it a description of trend rather than a prediction.",
    objectives: [
      "Calculate a simple moving average from a list of closes.",
      "Explain why a moving average lags and what that means for signals based on it.",
      "Use a moving average to describe trend direction, not to forecast it.",
    ],
    blocks: [
      {
        kind: "text",
        text: "A **simple moving average** (SMA) is the average of the last N closes, recalculated at every candle. A 20-period SMA on 1-hour candles averages the last 20 hours. When a new candle closes, the oldest close drops out and the newest joins. The result is a smoother line that filters out some of the candle-to-candle noise.",
      },
      {
        kind: "example",
        title: "A 5-period SMA by hand",
        lines: [
          "Closes: 100.00, 101.00, 102.00, 103.00, 104.00.",
          "SMA = (100.00 + 101.00 + 102.00 + 103.00 + 104.00) ÷ 5 = 510.00 ÷ 5 = 102.00.",
          "The next candle closes at 110.00. Drop 100.00, add 110.00.",
          "New SMA = (101.00 + 102.00 + 103.00 + 104.00 + 110.00) ÷ 5 = 520.00 ÷ 5 = 104.00.",
        ],
        result: "Price is at 110.00, but the average is only 104.00. The average always trails behind price.",
      },
      {
        kind: "figure",
        diagram: "moving-average",
        caption: "A 20-period SMA follows price but turns later than it does, at tops and at bottoms alike.",
      },
      { kind: "heading", text: "Lag is the price of smoothness" },
      {
        kind: "text",
        text: "Because it averages the past, a moving average turns only after price has already turned. A longer period gives a smoother line and more lag. A shorter period reacts faster but follows more of the noise. No setting removes this trade-off; choosing a period only chooses where you sit on it.",
      },
      {
        kind: "points",
        items: [
          "It can describe direction: price mostly above a rising average fits an uptrend.",
          "It can show how far price has moved from its recent average.",
          "It cannot predict a turn. By the time the line turns, much of the move may be over.",
          "In a range, price crosses the average again and again, so each crossing means little.",
        ],
      },
      {
        kind: "text",
        text: "Crossover rules turn the average into a signal: buy when price crosses above it, sell when price crosses below. In a steady trend the signals arrive late. In a range they arrive often and reverse quickly, and every one of those trades pays the spread and commission.",
      },
      {
        kind: "callout",
        tone: "key",
        text: "A moving average summarises where price has been. Use it as one description of the trend, alongside swing highs and lows, not as a rule that makes decisions for you.",
      },
      { kind: "check", questionIds: ["q-ta-7", "q-ta-8", "q-ta-10"] },
    ],
    practice: [
      { kind: "arena", ref: "bullish", label: "Arena: bullish, with SMA 20 and SMA 50" },
      { kind: "arena", ref: "sideways", label: "Arena: sideways" },
    ],
  },

  {
    id: "L09",
    title: "Sizing a position from the stop",
    topic: "position_sizing",
    level: "beginner",
    tier: "free",
    minutes: 7,
    summary: "Choose the stop first, then let the risk budget and the distance to that stop decide how many units to buy.",
    objectives: [
      "Calculate position size from a risk budget and the distance to the stop.",
      "Adjust the size for commission so the loss at the stop stays within budget.",
      "Explain why a wider stop means fewer units rather than more risk.",
    ],
    blocks: [
      {
        kind: "text",
        text: "Many beginners pick a size first, say a round 100 units, and then place the stop wherever the loss feels bearable. That is backwards. The stop belongs where the idea is proven wrong. The size is what you adjust so that being wrong costs a fixed, small share of the account.",
      },
      { kind: "heading", text: "The formula" },
      {
        kind: "steps",
        items: [
          "Set the **risk budget**: the most you accept losing on this trade. In missions it is 1% of 10,000.00, which is 100.00.",
          "Find the **distance to the stop**: for a long position, entry price minus stop price.",
          "Divide: units = risk budget ÷ distance to the stop.",
          "Round down to a whole number of units. Rounding up would break the budget.",
        ],
      },
      {
        kind: "figure",
        diagram: "position-size-formula",
        caption: "The risk budget split into equal blocks, one per unit. Each block is the distance from entry to stop.",
      },
      {
        kind: "example",
        title: "Textbook size",
        lines: [
          "Account 10,000.00, risk 1%: budget 100.00.",
          "Buy at the ask, 100.00. Stop at 98.00.",
          "Distance: 100.00 − 98.00 = 2.00 per unit.",
          "Units: 100.00 ÷ 2.00 = 50.",
          "Position value: 50 × 100.00 = 5,000.00.",
        ],
        result: "50 units lose 100.00 if the stop fills at 98.00, before costs.",
      },
      { kind: "heading", text: "Adding the costs" },
      {
        kind: "text",
        text: "The textbook formula ignores costs. In MARKET//LAB you pay 0.05% commission on entry and again on exit, so each unit can lose a little more than the distance to the stop. The spread is already counted, because the entry price is the ask. Add the commission per unit to the distance, then divide again.",
      },
      {
        kind: "example",
        title: "Cost-adjusted size",
        lines: [
          "Commission per unit at entry: 0.05% × 100.00 = 0.05.",
          "Commission per unit at the stop: 0.05% × 98.00 = 0.049.",
          "Loss per unit: 2.00 + 0.05 + 0.049 = 2.099.",
          "Units: 100.00 ÷ 2.099 ≈ 47.64, rounded down to 47.",
          "Check: 47 × 2.099 = 98.653, within the 100.00 budget. 48 units would lose 48 × 2.099 = 100.752, over it.",
        ],
        result: "Cost-adjusted size: 47 units rather than 50. The three missing units are what the costs take.",
      },
      {
        kind: "interactive",
        widget: "position-size",
        title: "Size it yourself",
        prompt: "Enter an account of 10,000, 1% risk, entry 100.00 and stop 98.00, and compare the textbook and cost-adjusted sizes. Then move the stop to 96.00 and watch the size fall while the risk stays the same.",
      },
      {
        kind: "points",
        items: [
          "Wider stop, fewer units: with the stop at 96.00 the distance is 4.00, so 100.00 ÷ 4.00 = 25 units, or 24 after costs. The money at risk stays close to 100.00.",
          "A bigger budget means more units for the same stop: the Arena allows 2%, 200.00, so a 4.00 stop gives 200.00 ÷ 4.00 = 50 units before costs.",
          "The account sets a ceiling: with no leverage, position value cannot exceed equity, so at an entry of 100.00 you can hold at most 100 units, whatever the formula says.",
        ],
      },
      {
        kind: "callout",
        tone: "key",
        text: "Stop first, size second. If the size feels too small, do not pull the stop closer to fit more units: a stop inside the noise is easily hit. Accept the smaller size, or skip the trade.",
      },
      { kind: "check", questionIds: ["q-ps-1", "q-ps-3", "q-ps-4"] },
    ],
    practice: [
      { kind: "mission", ref: "M05", label: "Size Matters" },
      { kind: "mission", ref: "M04", label: "Define Your Risk" },
      { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
    ],
  },

  {
    id: "L12",
    title: "Exposure and leverage",
    topic: "portfolio_exposure",
    level: "intermediate",
    tier: "free",
    minutes: 6,
    summary: "Exposure is the value of what you hold compared with your account, and leverage lets that value exceed the account, which magnifies the effect of every price move.",
    objectives: [
      "Calculate exposure as a percentage of equity.",
      "Work out what a given price move does to the account at different levels of leverage.",
      "Distinguish the risk planned at the stop from the full exposure behind it.",
    ],
    blocks: [
      {
        kind: "text",
        text: "**Exposure** is the total value of the positions you hold. Measured against your **equity**, the value of the account, it shows how much of the account is riding on price. If you hold 5,000.00 of LABX in a 10,000.00 account, your exposure is 50%. A 10% fall in LABX then costs 500.00, or 5% of the account.",
      },
      {
        kind: "points",
        items: [
          "Exposure % = position value ÷ equity × 100.",
          "Loss from an adverse move = position value × the size of the move.",
          "Effect on the account = that loss ÷ equity.",
          "Positions that tend to move together add up to one larger exposure, not several small ones.",
        ],
      },
      { kind: "heading", text: "What leverage does" },
      {
        kind: "text",
        text: "**Leverage** lets you hold a position worth more than your equity, with a broker lending the difference. At 2× leverage a 10,000.00 account controls 20,000.00; at 5× it controls 50,000.00. Price moves by the same amount either way. What changes is how big that move is compared with your account.",
      },
      {
        kind: "figure",
        diagram: "exposure-leverage",
        caption: "The same 10,000.00 account at 1×, 2× and 5×. The position grows; the account does not.",
      },
      {
        kind: "example",
        title: "A 5% fall at three levels of leverage (account 10,000.00)",
        lines: [
          "1×: position 10,000.00. Loss 5% × 10,000.00 = 500.00, or 5% of the account.",
          "2×: position 20,000.00. Loss 5% × 20,000.00 = 1,000.00, or 10% of the account.",
          "5×: position 50,000.00. Loss 5% × 50,000.00 = 2,500.00, or 25% of the account.",
        ],
        result: "At 5×, a 20% fall would cost 20% × 50,000.00 = 10,000.00: the whole account.",
      },
      {
        kind: "interactive",
        widget: "exposure",
        title: "See the effect of leverage",
        prompt: "Start with an account of 10,000 and a position of 5,000. Then raise the position and the leverage, and compare the losses for 1%, 5% and 10% adverse moves.",
      },
      { kind: "heading", text: "Exposure is not the same as risk" },
      {
        kind: "text",
        text: "Your **risk** is what you lose if the stop fills as planned. Your exposure is what is at stake if it does not. A 50-unit position at 100.00 with a stop 2.00 away risks 100.00, but its exposure is 5,000.00. If price gaps past the stop, the size of the gap and the exposure decide the loss, not the plan.",
      },
      {
        kind: "points",
        items: [
          "Missions and the Arena use no leverage: position value cannot exceed equity, so exposure is at most 100%.",
          "Within that, sizing from the stop keeps the planned loss at 1% in missions and 2% in the Arena.",
          "With real leveraged products, a broker may close your position automatically once losses use up the margin you put down.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        text: "Leverage does not make a trade better; it makes the same trade bigger. A common mistake is using it to reach a profit target faster, forgetting that losses arrive faster in exactly the same proportion.",
      },
      { kind: "check", questionIds: ["q-pe-1", "q-pe-2", "q-pe-6"] },
    ],
    practice: [
      { kind: "calculator", ref: "risk-calculator", label: "Risk calculator" },
      { kind: "arena", ref: "event_shock", label: "Arena: event shock" },
      { kind: "check", ref: "portfolio_exposure", label: "Exposure check" },
    ],
  },
];
