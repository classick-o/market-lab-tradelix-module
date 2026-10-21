# R2 — Technical Analysis: Exhaustive Content Inventory for a Simulator-Based Trading Course

> Research deliverable for an interactive trading-education app (synthetic markets, virtual money, programmatically drawn charts).
> Scope: **technical analysis (TA) only**, from absolute beginner to expert, with honest evidence notes for every item.
> Date compiled: 2026-10-22.

**Contents**

| § | Topic |
|---|---|
| 0 | Conventions, metric definitions, method note |
| 1 | Chart types and timeframes |
| 2 | Candlesticks (single, double, triple+), context rules, evidence |
| 3 | Dow Theory, trends, trendlines, channels, S/R, round numbers, pivots, gaps, breakouts |
| 4 | Chart patterns, with a Bulkowski statistics master table |
| 5 | Indicators: trend, momentum, volatility, volume, breadth, divergences, OB/OS myths |
| 6 | Fibonacci, Elliott, harmonics, Wyckoff, Market/Volume Profile, Gann, RS/RRG, intermarket, cycles, sentiment |
| 7 | Process: multi-timeframe analysis, confluence, confirmation, signal vs noise, backtesting, trade plan |
| 8 | Evidence-based framing: scorecard, mechanisms, failure modes, honest-teaching principles, simulator experiments |
| 9 | Progressive course ordering: 24 modules with dependencies |
| 10 | Sources, with each URL's contribution |

---

## 0. How to read this document

### 0.1 Item template

Every item uses the same fields:

- **Def**: one-line definition.
- **Identify**: how to recognise or compute it. Precise rules are given where they exist; otherwise the usual practitioner guidelines.
- **Claim**: what practitioners say it means.
- **Evidence**: what testing says, as reliability or failure rates where known, or "no robust evidence".
- **Level**: B = Beginner, I = Intermediate, A = Advanced, E = Expert. **Prereq** lists the items to learn first.
- **Misuse**: the most common errors.
- **Practice**: an interaction idea for a synthetic chart.

### 0.2 Interaction vocabulary used in "Practice"

| Code | Interaction |
|---|---|
| TAP | Tap or click the bars or candles that satisfy a definition (auto-graded against the generator's ground truth). |
| DRAW | Draw a line, zone, box or Fib tool. Graded by geometric tolerance, e.g. both anchors within k·ATR of the true swing points. |
| LABEL | Drag labels (wave numbers, Wyckoff events, H/L swing tags) onto the chart. |
| PREDICT→REVEAL | The chart pauses. The learner commits to a direction, a target or a stop, then the next N bars animate in. Scored over many trials, never one. |
| SLIDER | Change an indicator parameter and watch the plot and the signal count update live. |
| BUILD | Construct a candle, bar or brick from raw O/H/L/C/V numbers, or the reverse. |
| CLASSIFY | Sort a deck of chart snippets into categories. |
| BACKTEST | Run a rule over 1,000+ synthetic paths and see the distribution of outcomes against a random-entry baseline. |

### 0.3 Two synthetic-data modes, and why the course needs both

1. **Didactic mode (rigged)**: the generator *injects* a clean pattern (e.g. a head-and-shoulders), so the learner can practise **recognition**. The ground truth is known exactly.
2. **Honest mode (null or realistic)**: the generator produces a random walk (GBM), or a regime model (trend, range and volatility regimes), with no planted edge. This lets the course teach **evidence**. Patterns still "appear", because human pattern detection finds shapes in noise. What happens after them then matches the base rate.

The killer lesson is to run "same pattern, random-walk market" and show that its follow-through equals a coin flip. Then run it in a market generated with momentum or stop-order clustering, and show where an edge could come from (see §8).

### 0.4 Key metric definitions used below (Bulkowski)

- **Break-even failure rate**: the share of patterns where price fails to move more than **5%** beyond the breakout price before reversing. Bulkowski defines chart pattern failure as: "A chart pattern fails if price does not move more than 5% away from the breakout price before reversing trend."
- **Average rise/decline**: measured from the breakout to the *ultimate* high or low ("perfect trades"). This is an idealised upper bound, not a tradable expectation.
- **Throwback / pullback**: price returns to the breakout level within ~30 days after an upward or downward breakout.
- **% meeting price target**: how often the classic full-height measure rule was reached. Bulkowski therefore suggests scaling the height by this percentage.
- **Candle "reversal %"**: how often price broke out in the reversal direction, judged by closing beyond the top or bottom of the candle pattern first. **50% = coin flip.**
- **Scope caveats**: mostly US stocks, daily data, from roughly the 1990s to the 2010s, with bull-market tables quoted unless stated otherwise. Stats on pattern pages were last updated about 2020.

### 0.5 Method note

The web-search budget for this session ran out after 9 searches, because the limit is shared across agents. Research continued with ~75 direct page fetches of primary sources: StockCharts ChartSchool, Bulkowski's thepatternsite.com, TA-Lib source code, Osler (FRBNY), Bajgrowicz & Scaillet, Bailey et al., the CMT 2026 Program Guide, AQR, IDEAS/RePEc and Wikipedia. Items marked **[not verified this session]** come from well-known literature that could not be re-fetched. Check them before quoting in course copy.

---

## 1. Chart types and timeframes

### 1.1 Line chart
- **Def**: a line connecting closing prices, one point per period.
- **Identify**: plot close[t] against t. Variants include the area chart and the "close-only" chart.
- **Claim**: closes are the most important price, being the "consensus" level of the session. Dow Theory used closes, and Hamilton suggested ignoring moves under 3%.
- **Evidence**: none needed, since it is a display choice. It does hide intraperiod range, gaps and volatility.
- **Level**: B. **Prereq**: what a price is, and what a trading session is.
- **Misuse**: comparing a line chart with a candle chart and "seeing" breakouts that only exist intraday. Forgetting that the line hides gaps.
- **Practice**: BUILD. Given 10 closes, plot the line. Then toggle to candles to reveal hidden wicks and gaps ("what the line didn't tell you").

### 1.2 Bar chart (OHLC)
- **Def**: a vertical bar from high to low per period, with a left tick at the open and a right tick at the close.
- **Identify**: four values per bar. HLC bars omit the open.
- **Claim**: shows range (volatility) and where the session closed within it.
- **Evidence**: display choice. Many TA tools need H and L (ATR, Stochastic, pivots).
- **Level**: B. **Prereq**: 1.1.
- **Misuse**: confusing the open and close ticks.
- **Practice**: BUILD. Drag the four ticks to match a given O/H/L/C. In reverse, read the O/H/L/C off a bar.

### 1.3 Candlestick chart
- **Def**: a Japanese charting form in which the **real body** spans open→close and the **shadows (wicks)** reach the high and low. A body is hollow/white/green when close > open, and filled/black/red when close < open.
- **Identify**: body = |C−O|. Upper shadow = H − max(O,C). Lower shadow = min(O,C) − L. Range = H − L.
- **Claim**: bodies show who won the session, and shadows show rejected prices. This is the basis of candle patterns (§2).
- **Evidence**: display choice. Pattern evidence is in §2.
- **Level**: B. **Prereq**: 1.2.
- **Misuse**: reading colour as "bullish/bearish" without context. Forgetting that some platforms colour by close-vs-previous-close (e.g. "hollow candles") rather than close-vs-open.
- **Practice**: BUILD a candle from O/H/L/C. TAP all candles whose upper shadow is longer than the body.

### 1.4 Heikin-Ashi ("average bar")
- **Def**: smoothed candles computed from averages, used to visualise trend.
- **Identify** (StockCharts):
  - HA-Close = (O+H+L+C)/4.
  - HA-Open = (HA-Open[−1] + HA-Close[−1])/2.
  - HA-High = max(H, HA-Open, HA-Close).
  - HA-Low = min(L, HA-Open, HA-Close).
  - Seed the first bar with HA-Open = (O+C)/2. The seed effect fades after about 7–10 bars.
- **Claim**: a run of hollow candles with no lower shadows means a strong uptrend; filled candles with no upper shadows mean a strong downtrend. Small bodies with long shadows signal indecision.
- **Evidence**: no robust evidence of predictive value. It is a smoothing filter that lags by construction. **HA prices are not traded prices**, so stops and fills must use real OHLC. StockCharts notes that traditional candlestick reversal patterns do not carry over to HA.
- **Level**: I. **Prereq**: 1.3, 5.1 (moving averages), the concept of lag.
- **Misuse**: backtesting HA entries at HA prices, which produces fake fills and inflated results. Applying candle patterns to HA bars.
- **Practice**: SLIDER/toggle between real and HA candles on the same series. PREDICT→REVEAL "first opposite-colour HA candle = exit?" over many paths, with real fill prices shown, to expose the lag cost.

### 1.5 Renko
- **Def**: a time-less chart of equal-sized "bricks". A new brick is drawn only when price moves a full box size.
- **Identify**:
  - The box is either fixed (e.g. 10 points) or ATR-based (default ATR 14, set at chart creation).
  - The source is either close-only (smoother) or high-low (more bricks).
  - A move smaller than one box draws nothing.
  - Most implementations need a 2-box move to reverse direction. StockCharts describes the two-brick reversal as a common signal rather than a documented construction rule.
- **Claim**: filters noise, making trends, support/resistance and swing structure obvious.
- **Evidence**: no robust evidence of predictive value. Visual cleanliness comes at the cost of delay and of hiding time. With ATR boxes the chart can **change retroactively** as data updates.
- **Level**: I. **Prereq**: 1.3, 5.16 (ATR), swing structure (3.2).
- **Misuse**: believing Renko backtests, which often assume fills at brick boundaries that never traded. A 10-period MA on Renko means 10 *bricks*, not 10 days.
- **Practice**: BUILD Renko from a tick stream by hand for 20 steps, then compare to auto-render. SLIDER on box size, watching how the "trend" appears and disappears.

### 1.6 Point & Figure (P&F)
- **Def**: a time-less chart of X columns (rising) and O columns (falling), built from box size and reversal amount.
- **Identify**:
  - Choose a box size (fixed, %, or ATR) and a reversal count (classic **3-box**).
  - Extend the current column while price moves ≥1 box in the same direction.
  - Start a new column only on a counter-move of ≥ reversal × box.
  - Use the high/low method or the close method. The CMT curriculum uses high-low plotting rules and a monthly column-labelling convention.
  - Basic signals:
    - **Double-top breakout**: an X column exceeds the prior X column's high.
    - **Double-bottom breakdown**: an O column falls below the prior O column's low.
    - Triple tops and bottoms, catapults, and 45° bullish support and bearish resistance lines.
  - **Price objectives**:
    - Vertical count ≈ boxes in the thrust column × box size × reversal, added to the low (bullish) or subtracted from the high (bearish).
    - Horizontal count ≈ pattern width in columns × box × reversal, projected from the base. StockCharts notes "the wider the pattern, the more important the break."
- **Claim**: pure supply/demand. Objective signals with built-in targets. Wyckoff's "cause" is measured horizontally on P&F.
- **Evidence**: no robust peer-reviewed evidence for counts. Signals are rule-based and therefore **backtestable**, which is a teaching advantage. Box/reversal choice changes everything, which is a data-snooping risk.
- **Level**: I (construction) → A (counts, patterns). **Prereq**: 1.2, 3.6 (S/R).
- **Misuse**: tuning box size until past signals look good. Treating count targets as certain.
- **Practice**: BUILD a P&F chart from a price list, with a step-by-step "plot X / plot O / new column?" quiz. TAP the double-top breakouts. BACKTEST the double-top-breakout rule against a random-entry baseline.

### 1.7 Kagi
- **Def**: a time-less line chart that changes direction only after a reversal amount. Thickness changes when prior shoulders or waists are broken.
- **Identify**:
  - Set a reversal (points, %, or ATR).
  - The line extends until price reverses by at least the reversal amount, then a short horizontal bar marks the turn.
  - The line becomes **yang (thick)** when it breaks above the prior peak ("shoulder") and **yin (thin)** when it breaks below the prior trough ("waist").
- **Claim**: buy on yang, sell on yin (Nison). Shoulders are resistance and waists are support.
- **Evidence**: no robust evidence. ATR-based reversal makes the chart's appearance drift over time (StockCharts).
- **Level**: A (niche). **Prereq**: 1.5/1.6, 3.2.
- **Misuse**: comparing Kagi-period ATR with time-based ATR.
- **Practice**: TAP where yin flips to yang. PREDICT→REVEAL after each flip.

### 1.8 Three-line break (Nison)
- **Def**: a time-less chart of "lines". A new line in the trend direction is drawn when the close exceeds the prior line's extreme. A reversal line needs the close to exceed the extreme of the last **three** lines.
- **Identify**: as defined. The reversal count (3) is a parameter.
- **Claim**: filters minor reversals.
- **Evidence**: no robust evidence.
- **Level**: A (optional). **Prereq**: 1.5.
- **Misuse**: same as Renko.
- **Practice**: BUILD from a list of closes.

### 1.9 Range bars
- **Def**: bars that each span a fixed high-low range R. A new bar opens when the current bar's range would exceed R. Time is ignored. Popularised in the 1990s, attributed to Vicente Nicolellis **[not verified this session]**.
- **Identify**: every bar has H−L = R, and the open of a new bar sits at the prior bar's extreme ± tick.
- **Claim**: normalises volatility; quiet periods compress and busy ones expand.
- **Evidence**: no robust evidence for trading value.
- **Level**: A. **Prereq**: 1.2, 5.16 (ATR).
- **Misuse**: assuming equal bars mean equal information.
- **Practice**: SLIDER on R over the same tick stream. Count the bars produced in quiet versus news periods.

### 1.10 Tick, volume and dollar bars ("information-driven bars")
- **Def**: a new bar every N trades (tick bars), every N units traded (volume bars), or every N currency units traded (dollar bars).
- **Identify**: aggregate a trade stream until the threshold is reached.
- **Claim**: sampling by activity gives returns closer to IID/normal than time bars, and adapts to activity. Argued by López de Prado, *Advances in Financial Machine Learning* (2018) **[not verified this session]**.
- **Evidence**: the statistical-property argument is plausible and widely cited in quant practice. There is no evidence that it alone creates trading edge.
- **Level**: E. **Prereq**: 1.2, volume (1.13, 5.24–5.29), basic statistics.
- **Misuse**: comparing indicators across bar types without re-tuning.
- **Practice**: the simulator can stream synthetic trades. Show the same day as 5-minute bars versus 500-trade bars, then a histogram of returns for each.

### 1.11 Linear vs logarithmic (semi-log) price scale
- **Def**: on a linear scale equal distances are equal *points*; on a log scale equal distances are equal *percentages*.
- **Identify**: a log axis is evenly spaced in ln(price).
- **Claim**: use log scales for long horizons and large moves. Trendlines on log charts often fit better, and their "breaks" differ from linear charts. StockCharts gives AMZN and EMC examples where semi-log avoided false breaks, or needed one line instead of three.
- **Evidence**: geometric fact. It changes which trendlines and pattern targets you get (the CMT curriculum computes P&F counts on both scales).
- **Level**: B (concept) → I (consequences for trendlines and targets). **Prereq**: percent change.
- **Misuse**: drawing long-term trendlines on linear charts of assets that rose 10×. Mixing point targets and percent targets.
- **Practice**: toggle the scale on an exponential-growth synthetic series. DRAW a trendline on each scale and see which one "breaks".

### 1.12 Timeframes (periodicity)
- **Def**: the time span represented by one bar (tick, 1m, 5m, 1h, 4h, D, W, M).
- **Identify**: resample OHLCV. Open = first, High = max, Low = min, Close = last, Volume = sum.
- **Claim**: every timeframe has its own trend. Higher timeframes "dominate". See §7.1 multi-timeframe analysis.
- **Evidence**: resampling identity. Noise (the share of random variation) is relatively larger on lower timeframes, while costs per trade are fixed, so the cost burden rises sharply at short horizons.
- **Level**: B. **Prereq**: 1.2.
- **Misuse**: switching timeframes until the chart agrees with your bias ("timeframe shopping").
- **Practice**: BUILD. Merge five 1-minute candles into one 5-minute candle by hand. Then reverse: guess which of four lower-timeframe sequences produced a given higher-timeframe candle.

### 1.13 Volume and open interest display
- **Def**: volume is units traded per bar, shown as a histogram, often coloured by up/down bar. Open interest is outstanding futures/option contracts.
- **Identify**: raw counts. Relative volume = volume / SMA(volume, 20 or 50).
- **Claim**: "volume confirms the trend" (Dow): heavier on advances in bull markets and on declines in bear markets. Climactic volume can mark exhaustion.
- **Evidence**: volume–price relationships have academic support as *information* (e.g. volume conditioning momentum) **[not verified this session]**. Simple "volume confirms breakout" rules are mixed. Bulkowski repeatedly finds that heavy breakout volume improves average outcomes, e.g. for symmetrical triangles and falling wedges.
- **Level**: B. **Prereq**: 1.2.
- **Misuse**: comparing raw volume across assets or eras. Ignoring volume spikes on index-rebalancing or option-expiry days.
- **Practice**: CLASSIFY breakouts as "high-volume" or "low-volume", then REVEAL the outcomes over 100 synthetic cases. The generator should encode a volume–continuation link only in "realistic mode", so the lesson is honest.

---

## 2. Candlesticks

### 2.0 Foundations that apply to every candle pattern

**2.0.1 Anatomy and vocabulary.** Body, upper and lower shadow, range, colour, gap (Nison: "window"), long day and short day. The CMT Level I objectives cover candles as illustrating "sentiment, specifically strength, volatility, and indecision".

**2.0.2 Programmable thresholds.** "Long", "small" and "near" are vague in the books. For a programmatic app, use the **TA-Lib defaults** (`TA_CANDLE_DEFAULT_SETTINGS`), which are the de facto industry standard:

| Setting | Compares | To | Lookback | Factor |
|---|---|---|---|---|
| BodyLong | real body | avg real body | 10 prev | > 1.0× |
| BodyVeryLong | real body | avg real body | 10 prev | > 3.0× |
| BodyShort | real body | avg real body | 10 prev | < 1.0× |
| BodyDoji | real body | avg high-low range | 10 prev | ≤ 0.1× |
| ShadowLong | shadow | *this candle's* real body | 0 | > 1.0× |
| ShadowVeryLong | shadow | *this candle's* real body | 0 | > 2.0× |
| ShadowShort | shadow | avg shadows | 10 prev | < 1.0× |
| ShadowVeryShort | shadow | avg high-low range | 10 prev | < 0.1× |
| Near | distance | avg high-low range | 5 prev | ≤ 0.2× |
| Far | distance | avg high-low range | 5 prev | ≥ 0.6× |
| Equal | distance | avg high-low range | 5 prev | ≤ 0.05× |

TA-Lib's engulfing detector has **no trend filter**: it checks only the last two bars. The app must add its own context rule.

**2.0.3 Context rules (Nison / Bulkowski / CMT), taught before any pattern:**
1. **A reversal pattern needs something to reverse.** Require a prior trend, e.g. close < SMA(10) with a falling SMA, or ≥3 lower highs in the last N bars. Bulkowski's identification guidelines always specify the "price trend leading into the pattern".
2. **Location matters.** The pattern should sit at support/resistance, a prior swing, or a band extreme. CMT Level II asks for "the implications for candlestick patterns when they occur at potential support or resistance zones".
3. **Confirmation.** Distinguish unconfirmed from confirmed patterns (CMT Level II). Confirmation means the next candle closes beyond the pattern's high (bullish) or low (bearish).
4. **Trade with the primary trend.** Bulkowski's two candlestick tips: trade bullish candles in a primary uptrend, at the bottom of a retracement, and bearish candles in a primary downtrend. Example: the bullish engulfing tip is to "avoid patterns that appear in a downward primary trend".
5. **Size relative to recent candles**, and **volume** (CMT relates candle meaning to volume).
6. **Names lie.** Several candles named "reversal" test as *continuation* (hanging man, inverted hammer, three-line strike, matching low). The course should show this explicitly.

**2.0.4 Candle evidence: summary for the whole family**
- **Bulkowski** (*Encyclopedia of Candlestick Charts*, 103 candle types) found many famous single candles at or near coin-flip:
  - Hammer 60% reversal ("not far from random (50%)"), shooting star 59%.
  - Doji types 50–51%, spinning top 50%, white marubozu 56%.
  - Bullish harami 53%, tweezers bottom 52% (acts as continuation), kicker 53%.
- Multi-candle patterns with **built-in confirmation** score higher: morning star 78%, evening star 72%, three white soldiers 82%, three black crows 78%, three outside up 75%. Part of this is mechanical, since the third candle already *is* the start of the move.
- **Reversal frequency ≠ profitability.** The bearish engulfing reverses 79% of the time yet ranks 91/103 overall. The bullish engulfing reverses 63% and ranks 84/103.
- **Academic:**
  - **Marshall, Young & Rose (2006)**, *Journal of Banking & Finance*: 28 candle signals on DJIA stocks, 1992–2002, held 10 days. Bootstrap tests found **no evidence that any of the 28 signals predicted price movements**.
  - **Caginalp & Laurent (1998)**: three-day reversal patterns on S&P 500 stocks, 1992–1996. Highly significant out-of-sample results, with a profit of ~1% over 2 days.
  - A replication on 60 JSE shares found only *Three Outside Down* predictive.
  - Greg Morris (practitioner) argues that such tests ignore context ("bogus at best" without trend).
- **Teaching stance**: candles are an excellent **vocabulary for describing a session** (who controlled, where price was rejected). They are a weak **stand-alone signal**. Use them for location-plus-context triggers inside a larger plan, and *test* them in the simulator.

---

### 2.1 Single-candle patterns

#### 2.1.1 Long day / short day (long or short body)
- **Def**: a candle whose real body is large (or small) relative to recent candles.
- **Identify**: body > avg(body, 10) (long) or > 3× (very long). Short means body < avg(body, 10).
- **Claim**: a long white body shows buyer conviction; a short body shows hesitation.
- **Evidence**: no robust stand-alone evidence. Useful as a *component* of other patterns.
- **Level**: B. **Prereq**: 1.3.
- **Misuse**: calling a candle "long" in absolute terms in a high-volatility regime.
- **Practice**: TAP every long-body candle (graded with the TA-Lib rule). SLIDER on the lookback to see the classification change.

#### 2.1.2 Marubozu (white/black; opening and closing variants)
- **Def**: a candle with no (or very short) shadows. An *opening* marubozu has no shadow at the open end; a *closing* marubozu has none at the close end.
- **Identify**: both shadows < 0.1 × avg range (ShadowVeryShort), with a long body.
- **Claim**: total control by one side. Continuation in the candle's direction.
- **Evidence**: Bulkowski's white marubozu acts as continuation **56%** ("near random"), rank 71/103, frequency rank 27.
- **Level**: B. **Prereq**: 2.1.1.
- **Misuse**: chasing a marubozu entry at the close, after the move has already happened.
- **Practice**: BUILD (drag O/H/L/C until the candle qualifies). PREDICT→REVEAL "next 5 bars" over 50 cases and compare with the base rate.

#### 2.1.3 Spinning top
- **Def**: a small body with upper and lower shadows each longer than the body.
- **Identify**: BodyShort, and both shadows > body.
- **Claim**: indecision. A possible pause or reversal after a trend.
- **Evidence**: Bulkowski's white spinning top reverses **50%** (random), rank 69/103. Frequency rank **2**, so it is one of the most common candles.
- **Level**: B. **Prereq**: 2.1.1.
- **Misuse**: treating every spinning top as a reversal. They are everywhere.
- **Practice**: TAP all spinning tops in 200 bars, then show how many there are. That number is the lesson.

#### 2.1.4 High-wave candle
- **Def**: a spinning top with *very* long shadows.
- **Identify**: BodyShort, and both shadows ShadowVeryLong (> 2× body).
- **Claim**: strong indecision or volatility. Often near turning points.
- **Evidence**: no robust evidence.
- **Level**: I. **Prereq**: 2.1.3.
- **Misuse**: same as the spinning top.
- **Practice**: CLASSIFY spinning top versus high wave versus long-legged doji.

#### 2.1.5 Doji family
- **Def**: open ≈ close, i.e. a body that is tiny relative to the range.
- **Identify**: body ≤ 0.1 × avg range (TA-Lib BodyDoji). Variants:
  - **Long-legged doji**: long shadows both sides, roughly centred.
  - **Dragonfly**: open and close at or near the high, long lower shadow.
  - **Gravestone**: open and close at or near the low, long upper shadow.
  - **Four-price doji**: O = H = L = C, which indicates illiquidity or a halted market.
  - **Northern / southern doji** (Bulkowski): a doji in an uptrend or a downtrend.
  - **Gapping up/down doji**.
- **Claim**: indecision and a balance of supply and demand. After a long trend, a "warning". Dragonfly is bullish at lows; gravestone is bearish at highs.
- **Evidence** (Bulkowski):
  - Long-legged doji: continuation 51% ("random"), rank 37.
  - Dragonfly: reversal 50%, rank 98/103.
  - Gravestone: bearish reversal 51% ("random"), rank 77.
  - Bulkowski treats doji as indecision, not signal.
- **Level**: B. **Prereq**: 2.1.3.
- **Misuse**: "doji = reversal". Using doji on illiquid instruments or on low timeframes where O = C by tick rounding.
- **Practice**: TAP the doji (strictness via slider: 5%, 10% or 20% of range). Then a predict-and-tally game showing ~50/50 outcomes.

#### 2.1.6 Hammer
- **Def**: after a decline, a small body near the top of the range with a long lower shadow.
- **Identify**:
  - Bulkowski: a lower shadow at least **2–3× the body**, with little or no upper shadow, after a downtrend.
  - TA-Lib: small body, ShadowLong lower, ShadowVeryShort upper, and body near or below the prior candle's low.
  - StockCharts: "price drops well below the open, then rallies to close well above the intraday low".
- **Claim**: sellers pushed price down and buyers rejected it, a bullish reversal. Confirmation is the next candle closing above the hammer's high.
- **Evidence**: Bulkowski reports bullish reversal **60%** of the time, "not far from random". Overall rank 65/103, frequency rank 36. Hammers within a third of the yearly low perform best, and white-bodied hammers do best. Hammers near the yearly *high* frequently act as reversals.
- **Level**: B. **Prereq**: 2.0, 3.2 (trend).
- **Misuse**: no prior downtrend. No confirmation. Calling every long-lower-wick candle a hammer, including mid-range ones.
- **Practice**: TAP hammers. Only those after ≥N bars of decline and near support count, and the grader explains rejects ("no prior trend"). PREDICT→REVEAL with a running tally against 50%.

#### 2.1.7 Hanging man
- **Def**: the hammer shape appearing after an advance.
- **Identify**: same geometry as the hammer, but with a prior uptrend.
- **Claim**: bearish warning (Nison): needs a lower close next session to confirm.
- **Evidence**: Bulkowski found that it acts as a **bullish continuation ~59%** of the time, i.e. it does *not* do what its theory says. Rank 87/103, frequency rank 16.
- **Level**: B. **Prereq**: 2.1.6.
- **Misuse**: shorting every hanging man.
- **Practice**: the "names lie" lab. Learners predict, the app reveals that most were continuations.

#### 2.1.8 Inverted hammer
- **Def**: after a decline, a small body near the low of the range with a long upper shadow.
- **Identify**:
  - StockCharts: one candle in a downtrend that "opens lower, trades higher, closes near the open".
  - Bulkowski uses a 2-line version: a tall black candle closing near its low, then a short candle with a tall upper shadow, little or no lower shadow, non-doji body, opening below the prior close.
- **Claim**: bullish reversal after confirmation.
- **Evidence**: Bulkowski found it acts as a **bearish continuation ~65%**. Its overall rank is 6/103 *as a continuation signal* (top-10 performer list: "65% bearish continuation").
- **Level**: B. **Prereq**: 2.1.6.
- **Misuse**: buying it because a book calls it bullish.
- **Practice**: as in 2.1.7.

#### 2.1.9 Shooting star
- **Def**: after an advance, a small body near the low of the range with a long upper shadow.
- **Identify**: Bulkowski: a single candle in an uptrend, small (non-doji) body, upper shadow ≥ **2× body**, little or no lower shadow. It often gaps up (Nison).
- **Claim**: buyers were rejected, a bearish reversal.
- **Evidence**: Bulkowski reports bearish reversal **59%** ("near random"), rank 55/103.
- **Level**: B. **Prereq**: 2.1.6.
- **Misuse**: shorting into a strong uptrend without confirmation.
- **Practice**: TAP, then PREDICT→REVEAL.

#### 2.1.10 Belt hold (bullish / bearish)
- **Def**:
  - Bullish: after a decline, a long white candle that opens at its low (no lower shadow) and closes near its high.
  - Bearish: mirrored, a long black candle opening at its high.
- **Identify**: an opening marubozu with a long body, in a trend context.
- **Claim**: a sudden reversal of control.
- **Evidence**: Bulkowski's bullish belt hold reverses **71%**, but its overall rank is only 62/103. Frequency rank 22.
- **Level**: I. **Prereq**: 2.1.2.
- **Misuse**: ignoring that the 71% "reversal" is measured from the candle's own breakout, so part of the move already occurred.
- **Practice**: TAP, then PREDICT→REVEAL.

#### 2.1.11 Takuri line
- **Def**: a hammer variant with a very long lower shadow, at least ~3× the body (Bulkowski page "Takuri line").
- **Identify**: as above, after a downtrend.
- **Claim**: strong rejection of lows.
- **Evidence**: see Bulkowski's Takuri page (not fetched). Treat it like the hammer.
- **Level**: I (optional). **Prereq**: 2.1.6.
- **Misuse / Practice**: as for the hammer.

#### 2.1.12 Western bar equivalents, taught alongside candles
- **Pin bar** (price-action jargon): a long-wick rejection bar, i.e. a generic hammer or shooting star. Same evidence caveats.
- **Inside bar**: H < H[−1] and L > L[−1]. A volatility contraction that is the range version of the harami. **Hikkake** (Dan Chesler; Bulkowski has bullish and bearish pages) is an inside bar followed by a false breakout, then a reversal through the other side. Level A.
- **Outside bar / outside reversal**: H > H[−1] and L < L[−1], closing opposite the prior direction. StockCharts notes the engulfing pattern differs from the outside reversal because the full high-low range need *not* be engulfed.
- **NR7**: the narrowest range of the last 7 bars, a volatility-contraction setup (StockCharts has a page). Level I.
- **Practice**: TAP inside bars, outside bars and NR7 bars. BACKTEST "breakout of an NR7 bar" against random entry on regime-switching synthetic data.

---

### 2.2 Two-candle patterns

#### 2.2.1 Bullish engulfing
- **Def**: after a decline, a white real body that engulfs the previous black real body.
- **Identify**:
  - Bulkowski: candle 1 black, candle 2 white with a taller body, C2 > O1 and O2 < C1. **Shadows ignored.**
  - TA-Lib allows equality at *one* end, returning 80 instead of 100 when an open equals the prior close or a close equals the prior open.
  - StockCharts: "a small body followed by a larger body that engulfs the prior body's open and close". Unlike the outside reversal, the high-low range need not be engulfed.
- **Claim**: a decisive shift from sellers to buyers, a bullish reversal.
- **Evidence**: Bulkowski reports **63%** (price closes above the top of the pattern first). Overall rank 84/103, frequency rank 12. It performs best within a third of the yearly low and with tall candles. **Avoid in a downward primary trend**, and use it for pullbacks within an uptrend.
- **Level**: B. **Prereq**: 2.0, 2.1.1.
- **Misuse**: no prior trend. Engulfing tiny bodies. Ignoring the primary trend.
- **Practice**: TAP. The grader checks body engulfment, colour and prior trend, with an explanation for each rejected tap. A "Find the false engulfing" mode shows shadow-engulfing but not body-engulfing cases.

#### 2.2.2 Bearish engulfing
- **Def**: the mirror image, a black body engulfing the prior white body after an advance.
- **Identify**: C1 > O1 (white), C2 < O2 (black), O2 ≥ C1 and C2 ≤ O1 with at least one strict inequality. Shadows ignored.
- **Claim**: bearish reversal.
- **Evidence**: Bulkowski reports bearish reversal **79%**, yet overall rank is only **91/103**. The reversal happens often but the follow-through is small. Frequency rank 11.
- **Level**: B. **Prereq**: 2.2.1.
- **Misuse**: confusing "it reverses" with "it pays".
- **Practice**: a two-metric reveal. Show the hit rate *and* the average move after costs, side by side.

#### 2.2.3 Harami (bullish / bearish)
- **Def**: a small body contained within the prior (larger, opposite-colour) body. It is the "pregnant" pattern.
- **Identify**: max(O2, C2) ≤ max(O1, C1) and min(O2, C2) ≥ min(O1, C1). Body 1 is long and body 2 is short. Shadows ignored (Bulkowski). StockCharts: "a small body completely inside the prior body, of the opposite color".
- **Claim**: momentum stalls, a possible reversal.
- **Evidence**: Bulkowski's bullish harami reverses **53%** and continues 47%, essentially random. Overall rank 38/103, frequency rank 25.
- **Level**: B. **Prereq**: 2.2.1.
- **Misuse**: trading it without confirmation, where three-inside-up (2.3.6) is the confirmed version.
- **Practice**: TAP harami. Then show how adding the confirmation candle changes the statistics.

#### 2.2.4 Harami cross
- **Def**: a harami whose second candle is a doji.
- **Identify**: as for the harami, with candle 2 meeting BodyDoji.
- **Claim**: stronger indecision than a plain harami.
- **Evidence**: see Bulkowski's harami cross pages (not fetched). No robust stand-alone evidence.
- **Level**: I. **Prereq**: 2.2.3, 2.1.5.
- **Misuse**: as for the harami.
- **Practice**: CLASSIFY harami versus harami cross.

#### 2.2.5 Piercing line (piercing pattern)
- **Def**: in a downtrend, a long black candle followed by a white candle that opens below the prior low and closes above the midpoint of the black body, but below its open.
- **Identify**:
  - Bulkowski: opens below the black candle's *low*.
  - StockCharts: "opens at a new low".
  - Close > (O1 + C1)/2 and close < O1.
- **Claim**: bullish reversal. Deeper penetration is stronger. If the close goes above O1, the pattern becomes an engulfing.
- **Evidence**: Bulkowski reports **64%** bullish reversal, overall rank **13/103**, which is good, and frequency rank 40.
- **Level**: B. **Prereq**: 2.2.1.
- **Misuse**: accepting closes below the midpoint. Those are thrusting, in-neck or on-neck patterns (2.2.9), which are *bearish continuation*.
- **Practice**: SLIDER on how far the white candle closes into the black body. Watch the label change across on-neck → in-neck → thrusting → piercing → engulfing. This is a great "continuum" lesson.

#### 2.2.6 Dark cloud cover
- **Def**: the bearish mirror of the piercing line. In an uptrend, a long white candle is followed by a black candle that opens above the prior high and closes below the midpoint of the white body.
- **Identify**: O2 > H1 (Bulkowski) or a "new high" (StockCharts). C2 < (O1 + C1)/2 and C2 > O1.
- **Claim**: bearish reversal.
- **Evidence**: Bulkowski reports a down-reversal ~**60%** in bull markets, rank 22/103, frequency rank 46.
- **Level**: B. **Prereq**: 2.2.5.
- **Misuse**: as for the piercing line.
- **Practice**: as for the piercing line.

#### 2.2.7 Tweezer top / tweezer bottom
- **Def**: two (or more) adjacent candles with matching highs (top) or matching lows (bottom).
- **Identify**: |L2 − L1| ≤ Equal tolerance (0.05 × avg range), after a decline (bottom) or an advance (top). Any colour.
- **Claim**: a double rejection of a level, i.e. mini support or resistance.
- **Evidence**: Bulkowski's tweezers bottom acts as a **bearish continuation 52%** ("near random"), rank 44/103.
- **Level**: B. **Prereq**: 3.6 (S/R).
- **Misuse**: treating exact-tick matches as meaningful on liquid instruments, where they occur by chance.
- **Practice**: TAP tweezers at different tolerance settings, then reveal outcomes.

#### 2.2.8 Kicker (kicking pattern)
- **Def**: two opposite-colour marubozu separated by a gap in the new direction.
- **Identify**: Bulkowski: a long black marubozu, an upward gap, then a long white marubozu (bullish). The bearish version is mirrored. No prior trend required.
- **Claim**: Nison and many educators call it one of the most powerful reversal signals.
- **Evidence**: Bulkowski reports bullish reversal **53%** ("near random"), overall rank **96/103**, frequency rank **100/103**, one of the rarest candles. This is a clear case where the popular claim conflicts with the data.
- **Level**: I. **Prereq**: 2.1.2, 3.11 (gaps).
- **Misuse**: over-weighting because "it's rare and powerful".
- **Practice**: a debate card. Show the claim, then the statistics, and ask the learner to decide how to treat it.

#### 2.2.9 On-neck, in-neck and thrusting lines (bearish continuation family)
- **Def**: in a downtrend, a long black candle followed by a white candle that opens lower and closes:
  - **On-neck**: at or about the prior low.
  - **In-neck**: just inside the prior body.
  - **Thrusting**: well into the body but below the midpoint.
- **Identify**: by penetration depth into the black body (see the 2.2.5 slider).
- **Claim**: weak buying, so the downtrend continues.
- **Evidence**: Bulkowski pages exist (OnNeck, InNeck, Thrusting). Not fetched. No robust academic evidence.
- **Level**: I. **Prereq**: 2.2.5.
- **Misuse**: confusing these with piercing.
- **Practice**: the 2.2.5 continuum slider.

#### 2.2.10 Doji star (bullish / bearish)
- **Def**: a long candle followed by a doji that gaps away from it, in the trend direction.
- **Identify**: candle 1 BodyLong. Candle 2 BodyDoji, with a real-body gap from candle 1.
- **Claim**: trend exhaustion warning. It needs a third candle, which turns it into a morning or evening doji star.
- **Evidence**: Bulkowski has pages for both. No robust evidence that the pattern works on its own.
- **Level**: I. **Prereq**: 2.1.5, 3.11.
- **Misuse**: acting before the third candle.
- **Practice**: PREDICT what the third candle must look like to complete a morning doji star.

#### 2.2.11 Meeting lines / separating lines
- **Def**:
  - **Meeting lines**: opposite-colour candles that *close* at the same price. Reversal theory.
  - **Separating lines**: opposite-colour candles that *open* at the same price, with the second in the trend direction. Continuation theory.
- **Identify**: Equal tolerance on closes (meeting) or opens (separating). Both bodies long.
- **Claim**: as above.
- **Evidence**: Bulkowski pages exist. No robust evidence.
- **Level**: A (low priority). **Prereq**: 2.2.x.
- **Misuse**: over-specifying rare shapes.
- **Practice**: CLASSIFY flashcards.

#### 2.2.12 Matching low / homing pigeon / last engulfing / two black gapping
- **Def**:
  - **Matching low**: two black candles with (nearly) equal closes in a downtrend. Theory says bullish support.
  - **Homing pigeon**: two black candles, the second's body inside the first's.
  - **Last engulfing top/bottom**: an engulfing pattern *against* expectation at the end of a trend.
  - **Two black gapping**: a gap down followed by two black candles.
- **Evidence** (Bulkowski): matching low acts as **61% bearish continuation**, against its theory. Two black gapping is **68% bearish continuation**, a top-10 overall performer.
- **Level**: A (catalogue completeness). **Prereq**: 2.2.x.
- **Misuse**: trusting the name.
- **Practice**: the "names lie" quiz.

---

### 2.3 Three-candle and longer patterns

#### 2.3.1 Morning star
- **Def**: after a decline, a long black candle, a small-bodied "star" gapping below it, then a long white candle closing well into the first body.
- **Identify**:
  - StockCharts: the third candle "closes above the first day's body midpoint".
  - Bulkowski: closes at least halfway into the first body. Also accepts a gap above the star.
  - TA-Lib: first candle long black (BodyLong), star with a short body and a real-body gap down, third candle a white body > BodyShort closing above C1 + **0.3** × body1 (the `optInPenetration` default).
- **Claim**: a three-stage reversal of selling, indecision and buying.
- **Evidence**: Bulkowski reports bullish reversal **78%**, rank 12/103, frequency rank 66.
- **Level**: B. **Prereq**: 2.1.5, 2.2.5, 3.11.
- **Misuse**: accepting the pattern without a real gap on markets that rarely gap (24h FX, crypto). Many educators then relax the gap rule, and that changes the statistics.
- **Practice**: TAP the 3 candles. A BUILD challenge: make the minimal valid morning star. PREDICT→REVEAL with the statistics.

#### 2.3.2 Evening star
- **Def**: the mirror of the morning star at a top.
- **Identify**: Bulkowski: a tall white candle, a small-bodied candle gapping above the adjacent bodies, then a tall black candle opening below the middle candle and closing at least halfway down the first body.
- **Claim**: bearish reversal.
- **Evidence**: Bulkowski reports bearish reversal **72%**, overall rank **4/103**, frequency 71 (relatively uncommon). It is a top-10 overall performer.
- **Level**: B. **Prereq**: 2.3.1.
- **Misuse**: as for the morning star.
- **Practice**: as for the morning star.

#### 2.3.3 Morning doji star / evening doji star
- **Def**: a morning or evening star whose middle candle is a doji.
- **Identify**: as for 2.3.1/2.3.2, with the middle candle meeting BodyDoji. StockCharts: a "gap-down Doji with a small range".
- **Claim**: a stronger version of the star.
- **Evidence**: Bulkowski's morning doji star reverses **76%**, rank 8/103.
- **Level**: I. **Prereq**: 2.3.1.
- **Misuse**: as above.
- **Practice**: CLASSIFY star versus doji star.

#### 2.3.4 Abandoned baby (bullish / bearish)
- **Def**: a star whose doji gaps beyond the *shadows* of both neighbouring candles, an "island doji".
- **Identify**: Bulkowski (bullish): a black candle, then a doji gapping below the adjacent candles' shadows, then a white candle whose lower shadow stays above the doji's top. StockCharts: the doji's "shadows fully gap away from the first and third days".
- **Claim**: a rare but strong reversal. CMT Level II asks learners to "compare the abandoned baby reversal and the island reversal patterns".
- **Evidence**: Bulkowski's bullish abandoned baby reverses **70%**, rank **9/103**, frequency **92/103** (rare). It appears on his top-10 overall list.
- **Level**: I. **Prereq**: 2.3.3, 3.11.5 (island).
- **Misuse**: forcing it on continuous markets with no gaps.
- **Practice**: TAP. Then a side-by-side drill comparing it with an island reversal (3.11.5).

#### 2.3.5 Three white soldiers / three black crows (and variants)
- **Def**: three consecutive long candles in the same direction, each opening within the prior body and closing near its extreme.
- **Identify**:
  - Soldiers: three tall white candles with higher closes. Each opens within the prior body and closes near its high (Bulkowski requires a prior *downtrend*).
  - Crows: three long black bodies closing at or near the low, each opening within the prior body.
  - **Identical three crows**: each opens at about the prior close.
  - **Advance block**: soldiers with shrinking bodies and growing upper shadows, a warning.
  - **Deliberation (stalled pattern)**: the third soldier is small, a warning.
- **Claim**: a strong reversal, or the start of a new trend.
- **Evidence** (Bulkowski):
  - Three white soldiers: bullish reversal **82%**, rank 32/103.
  - Three black crows: bearish reversal **78%**, #3 overall performer.
  - Identical three crows: **79%**.
  - Note: the move is largely *already done* by the time the pattern completes, so entry location is poor.
- **Level**: B. **Prereq**: 2.1.1.
- **Misuse**: buying after three big candles near resistance, which means chasing.
- **Practice**: PREDICT→REVEAL with *entry at the pattern close*, showing hit rate against reward/risk given that the stop sits at the pattern low.

#### 2.3.6 Three inside up / three inside down
- **Def**: a harami plus a confirmation candle.
- **Identify**: Bulkowski (up): in a downtrend, a tall black candle, then a small white candle inside its body, then a white candle closing above the prior close.
- **Claim**: a confirmed harami reversal.
- **Evidence**: Bulkowski's three inside up reverses **65%**, rank 20/103, frequency rank 31. Compare the harami without confirmation at 53%.
- **Level**: I. **Prereq**: 2.2.3.
- **Misuse**: forgetting that confirmation costs entry price.
- **Practice**: a two-step reveal. Trade the harami versus the three-inside, and compare the hit rate *and* the average R.

#### 2.3.7 Three outside up / three outside down
- **Def**: an engulfing pattern plus a confirmation candle.
- **Identify**: an engulfing pattern, then a third candle closing beyond the engulfing candle's close.
- **Claim**: a confirmed engulfing.
- **Evidence**: Bulkowski's three outside up reverses **75%** (top-10 reversal list). JSE replication of Caginalp-style tests: *Three Outside Down* was the only pattern with predictive ability.
- **Level**: I. **Prereq**: 2.2.1.
- **Misuse / Practice**: as for 2.3.6.

#### 2.3.8 Tri-star
- **Def**: three doji, the middle one gapping above (top) or below (bottom).
- **Identify**: three BodyDoji candles with real-body gaps around the middle one.
- **Claim**: rare, strong exhaustion.
- **Evidence**: Bulkowski pages exist. Rare, with no robust evidence.
- **Level**: A (catalogue). **Prereq**: 2.1.5.
- **Misuse / Practice**: catalogue quiz.

#### 2.3.9 Two crows / upside gap two crows
- **Def**: in an uptrend, a long white candle, then a black candle gapping up, then a second black candle.
  - StockCharts (upside gap two crows): the third candle engulfs the second and closes *above* the first day's close.
  - Two crows: the third closes into the first body.
- **Identify**: as described.
- **Claim**: bearish reversal.
- **Evidence**: Bulkowski pages exist. No robust evidence.
- **Level**: A. **Prereq**: 2.3.2.
- **Practice**: catalogue quiz.

#### 2.3.10 Unique three river bottom / three stars in the south / stick sandwich
- **Def**: rare bullish bottoming candle sequences.
  - **Stick sandwich** (StockCharts): "two black bodies with equal closes surrounding a white body".
- **Evidence**: Bulkowski's **three stars in the south reverses 86%**, #1 on his top-10 reversal list, but it is extremely rare. The others have pages but no robust evidence.
- **Level**: E (completeness only). **Prereq**: 2.3.x.
- **Misuse**: memorising rare names instead of principles.
- **Practice**: optional catalogue.

#### 2.3.11 Rising three methods / falling three methods / mat hold
- **Def**: a five-candle continuation pattern.
  - **Rising three methods**: a long white candle, three small candles drifting against the trend *within the first candle's range*, then a long white candle closing at a new high.
  - **Falling three methods**: the mirror image.
  - **Mat hold**: similar, but the small candles gap up first.
- **Identify**: StockCharts: three small bodies "contained within the first day's high-low range", then a fifth day closing at a new high (or low).
- **Claim**: a pause within the trend, then continuation.
- **Evidence**: Bulkowski's rising three methods acts as bullish continuation **74%**, but overall rank is 94/103 and frequency 88 (rare).
- **Level**: I. **Prereq**: 3.2, 4.x (flags, which are the chart-pattern cousin).
- **Misuse**: confusing it with a flag. It is the candle-scale analogue.
- **Practice**: TAP the 5 candles. CLASSIFY rising three methods versus a bull flag.

#### 2.3.12 Three-line strike (bullish / bearish)
- **Def**: three candles in the trend direction followed by a fourth candle that opens beyond and engulfs all three in the opposite direction.
- **Identify**: three same-colour trending candles, then one long opposite candle that closes beyond the first candle's open.
- **Claim**: in theory, continuation (a "strike" that clears the decks).
- **Evidence**: Bulkowski's **bearish three-line strike acts as a bullish reversal 84%**, the #1 overall performer. The **bullish version acts as a bearish reversal 65%**, #2 overall. Behaviour is the opposite of the name.
- **Level**: I. **Prereq**: 2.3.5.
- **Misuse**: following the textbook name.
- **Practice**: the "names lie" lab, showing the predicted versus actual outcome distribution.

#### 2.3.13 Upside / downside Tasuki gap; upside / downside gap three methods
- **Def**: continuation patterns around a gap ("window").
  - **Upside Tasuki** (StockCharts): a long white candle, a higher-gapped white candle, then a black candle that opens within the second body and closes *into the gap without filling it*.
  - **Gap three methods**: the third candle *does* close the gap.
- **Identify**: as described.
- **Claim**: a gap that holds equals continuation.
- **Evidence**: Bulkowski's upside Tasuki gap acts as bullish continuation **57%** and is #5 overall performer.
- **Level**: I. **Prereq**: 3.11 (gaps).
- **Misuse**: forgetting that "gap filled versus not" is the whole distinction.
- **Practice**: SLIDER on how far the third candle retraces into the gap. The label flips between Tasuki and gap three methods.

#### 2.3.14 Breakaway (bullish / bearish, 5 candles)
- **Def**: a gap in the trend direction, three candles extending the trend at a slowing pace, then a long opposite candle closing inside the gap.
- **Identify**: as described.
- **Claim**: exhaustion and reversal.
- **Evidence**: Bulkowski's bearish breakaway reverses **63%**, #10 overall performer.
- **Level**: A. **Prereq**: 3.11.
- **Practice**: catalogue.

#### 2.3.15 Rare multi-candle catalogue (completeness)
- Members: ladder bottom, concealing baby swallow, advance block, deliberation, collapsing doji star, side-by-side white lines, above/below the stomach, 8/10/12/13 new price lines (Japanese "count the new highs" exhaustion idea), and the hikkake.
- All are listed in Bulkowski's candle index (103 types). **Evidence**: individually weak or untested, and many are too rare for meaningful statistics.
- **Level**: E. **Teaching recommendation**: present them as *one* card ("there are 100+ named patterns; here is how to judge any of them"), not 30 lessons.
- **Practice**: a "Pattern name generator" game. The app randomly composes a 3-candle shape; the learner predicts the outcome and the app reveals the base rate. This shows that named and unnamed shapes perform alike in honest mode.

#### 2.3.16 Window (gap) in candlestick terminology
- **Def**: Nison's term for a gap. A rising window is bullish and a falling window is bearish. "Windows act as support/resistance". Bulkowski pages exist for rising and falling windows.
- **Identify**: L > H[−1] (rising) or H < L[−1] (falling).
- **Claim**: continuation; the window becomes support or resistance.
- **Evidence**: see Gaps (3.11).
- **Level**: B. **Prereq**: 1.3.
- **Practice**: see 3.11.

---

## 3. Dow Theory, trends, trendlines, channels, support/resistance, pivots, gaps

### 3.1 Dow Theory
- **Def**: the founding framework of Western TA. It grew out of Charles Dow's *Wall Street Journal* editorials, organised by Hamilton and Rhea.
- **Identify**, the tenets per StockCharts:
  1. The averages discount everything.
  2. **Three movements**: primary (months to years), secondary (weeks to months, counter-trend) and daily fluctuations.
  3. **Three phases**: bull = accumulation → big move → excess; bear = distribution → big move → despair.
  4. **The averages must confirm each other** (Industrials and Transports).
  5. **Volume confirms the trend.**
  6. **A trend persists until a definite reversal signal.**
  7. **Closing prices** are used, and Hamilton ignored moves under 3%.
- **Reversal rule (peak-trough analysis)**: a downtrend stays valid until a higher low forms *and* the subsequent advance exceeds the prior reaction high. An uptrend ends with a lower low that breaks the previous low.
- **Claim**: identifies the primary trend and keeps you in it.
- **Evidence**: StockCharts summarises one study showing that over 70 years the system beat buy-and-hold by ~2%/year with lower risk, but trailed by ~2.6%/year over the prior 18 years. Signals come late by design, and the Transports' composition has changed. The Wikipedia TA article notes that Dow never advocated it as a trading strategy.
- **Level**: B. **Prereq**: 1.1–1.2.
- **Misuse**: treating the Transports-confirmation rule as timeless. Expecting early entries.
- **Practice**: LABEL the primary, secondary and minor moves on a synthetic multi-scale series. PREDICT→REVEAL: "Has the trend changed yet?" at each new swing (peak-trough rule).

### 3.2 Swing structure (market structure)
- **Def**: the sequence of swing highs and swing lows. **Uptrend = higher highs (HH) and higher lows (HL)**; downtrend = lower highs (LH) and lower lows (LL).
- **Identify**: this needs an *operational* swing-point definition, which is critical for auto-grading. Options:
  - **N-bar pivot / fractal**: a high greater than the highs of N bars on each side. Bill Williams' fractal uses N = 2.
  - **ZigZag**: a new swing is confirmed when price reverses by ≥ X% or ≥ k·ATR.
  - **Dow/Hamilton filter**: ignore moves under 3%.
  - Note that **swing points are only known after the fact** (N bars later). This is look-ahead bias in naïve backtests.
- Modern "smart money" jargon: a **break of structure (BOS)** is a new HH in an uptrend; a **change of character (CHoCH)** is the first break against the trend. Both are rebrandings of Dow's peak-trough rule.
- **Claim**: structure is the most basic definition of trend and of trend change.
- **Evidence**: there are definitional tools, not testable claims on their own. Trend persistence at longer horizons does have strong support (time-series momentum, §8). The rule "trend persists until reversal" is consistent with that evidence.
- **Level**: B. **Prereq**: 1.x.
- **Misuse**: inconsistent swing definitions, where you pick small swings when it suits you. Repainting ZigZag indicators used for signals.
- **Practice**: LABEL HH/HL/LH/LL on a synthetic chart. The grader uses the chosen ZigZag threshold, shown to the learner. SLIDER on the ZigZag % to show that "the trend" depends on the scale.

### 3.3 Trend definition, strength and phases
- **Def**: the persistent directional tendency of price at a given scale.
- **Identify**, with several operational definitions taught side by side:
  1. Structure (3.2).
  2. MA slope, or price above/below a moving average (e.g. the 200-day).
  3. MA stack (e.g. 20 > 50 > 200).
  4. ADX > 20–25 for strength (5.5).
  5. Linear-regression slope or R².
  - Phases: Dow's three phases. CMT Level I covers "A Trend's Four Phases". **Weinstein stage analysis** gives Stage 1 base, 2 advance, 3 top and 4 decline, using the 30-week MA **[not verified this session]**.
- **Claim**: trade with the trend; most strategies need a trend filter.
- **Evidence**: the strongest TA-adjacent evidence is trend persistence, from time-series momentum (Moskowitz, Ooi & Pedersen 2012) and a century of trend following (Hurst, Ooi & Pedersen 2017). Wilder estimated that markets trend only about **30%** of the time (StockCharts, Parabolic SAR page), which explains whipsaw costs.
- **Level**: B → I. **Prereq**: 3.2, 5.1.
- **Misuse**: using a different trend definition for every trade.
- **Practice**: CLASSIFY 30 synthetic snippets as up, down or range under each definition, then show where the definitions disagree.

### 3.4 Trendlines
- **Def**: a straight line connecting rising lows (an uptrend line) or falling highs (a downtrend line).
- **Identify** (StockCharts):
  - Two points draw a line; "the third one confirms the validity".
  - The second low must be higher than the first.
  - Points should be reasonably spaced, neither too close nor too far apart.
  - **Don't force lines.**
  - Validity *decreases* as steepness increases.
  - *Internal* trendlines may ignore spikes.
  - Semi-log scales often fit long trends better.
  - A break is a **warning, not a final signal**: confirm it with horizontal S/R or peak-trough analysis.
  - Wick versus close anchoring is a convention: be consistent. Most teach wicks for drawing and closes for breaks.
- **Claim**: dynamic support/resistance; a break signals a trend change.
- **Evidence**: no robust evidence that trendline breaks predict reversals beyond chance. They are highly subjective: different analysts draw different lines. Osler (2000) notes that firms published *different* S/R levels, with mean agreement of only ~30% within 5 points.
- **Level**: B. **Prereq**: 3.2, 1.11.
- **Misuse**: redrawing the line after every break ("trendline elasticity"). Steep lines. Linear scale over large moves.
- **Practice**: DRAW the trendline, graded by the anchors matching true swing lows within tolerance. PREDICT→REVEAL after a break: reversal or continuation? A "Many analysts" view shows 10 algorithmically drawn valid lines on the same chart to teach subjectivity.

### 3.5 Channels
- **Def**: a trendline plus a parallel line through the opposite swings, containing price.
- **Identify**:
  - **Parallel channel**: draw the trendline, then clone it through the most extreme opposite swing.
  - **Regression channel**: a linear regression line ± k standard deviations.
  - **Andrews' pitchfork**: a median line from a pivot through the midpoint of the next two swings **[not verified this session]**.
- **Claim**: buy at the lower rail and sell at the upper rail inside the trend. A break of the channel means acceleration or reversal.
- **Evidence**: no robust evidence. Regression channels are fitted to past data (look-ahead), so live signals differ.
- **Level**: I. **Prereq**: 3.4.
- **Misuse**: using fitted regression channels in backtests (they repaint).
- **Practice**: DRAW the parallel channel. Then "freeze and forward-play": the learner's channel is kept fixed while new bars appear.

### 3.6 Support and resistance (horizontal)
- **Def**:
  - **Support**: "the price level at which demand is thought to be strong enough to prevent the price from declining further".
  - **Resistance**: the level at which selling prevents further rise (StockCharts).
- **Identify**:
  - Prior reaction lows and highs, trading-range boundaries, necklines.
  - Volume-by-price nodes (6.8), round numbers (3.9), pivots (3.10) and MAs (5.1).
  - Treat levels as **zones**, not lines (StockCharts): tight short ranges suit exact levels, multi-month ranges suit zones.
  - Strength grows with the number of tests, the volume at the level, and recency.
- **Claim**: price tends to stall or bounce at S/R; a decisive break signals that the supply/demand balance has shifted.
- **Evidence**: **Osler (2000, FRBNY)** is one of the best tests. Using levels published by 6 FX firms (1996–98; DEM, JPY and GBP against USD; 1-minute data), rates "bounced" off published levels **60.8%** of the time versus **56.2%** off arbitrary levels. The effect was statistically significant for all firms and **lasted at least five business days**. However, the firms' published "strength" ratings had **no** predictive value. A plausible mechanism is clustered order flow (Osler 2001/2003, see 3.9).
- **Level**: B. **Prereq**: 3.2.
- **Misuse**: drawing dozens of lines so that *something* always "worked". Exact-line thinking.
- **Practice**: DRAW the S/R zone, graded against the generator's clustered-order levels. BACKTEST "bounce frequency at your levels vs random levels" in the style of Osler's experiment. This is a perfect simulator lesson.

### 3.7 Role reversal (polarity principle)
- **Def**: broken resistance becomes support, and broken support becomes resistance.
- **Identify**: after a decisive break (3.12), watch for a retest from the other side. Bulkowski's "throwback" applies after upward breakouts and "pullback" after downward ones.
- **Claim**: the retest is a lower-risk entry.
- **Evidence**: Bulkowski finds throwbacks and pullbacks are **common**, in 54–74% of breakouts depending on the pattern. They also **hurt** average post-breakout performance. Retest entries therefore trade a better price against missing the strongest moves (those don't retest).
- **Level**: B. **Prereq**: 3.6, 3.12.
- **Misuse**: assuming every breakout will retest.
- **Practice**: PREDICT→REVEAL "will it retest within 30 bars?" Tally against Bulkowski's base rates.

### 3.8 Supply and demand zones
- **Def**: a retail-education variant of S/R. A zone is the *base* (tight consolidation) from which price left explosively: rally-base-rally, drop-base-rally (demand), rally-base-drop or drop-base-drop (supply).
- **Identify**: the base candles before a large-range departure. The zone spans the base's body or wick range. "Fresh" zones are untested.
- **Claim**: unfilled institutional orders remain in the zone, so the first return reacts.
- **Evidence**: **no robust evidence**. The narrative about "unfilled institutional orders" is not verified. Order-clustering research (Osler) supports the idea that order flow concentrates at certain prices, but not this specific zone definition.
- **Level**: I. **Prereq**: 3.6.
- **Misuse**: treating the zone as certain. Ignoring that most "zones" are drawn after the fact.
- **Practice**: DRAW the zone. In honest mode, compare first-touch reactions with random-zone reactions.

### 3.9 Round numbers (psychological levels)
- **Def**: prices ending in 0, 00, 50 and so on, e.g. 1.3000 or $100.
- **Identify**: multiples of a scale-appropriate increment.
- **Claim**: traders anchor on round numbers, so orders and reactions cluster there.
- **Evidence**:
  - Osler (2000): **>70%** of FX firms' published S/R levels ended in 0, and **96%** ended in 0 or 5.
  - Osler (2001, NY Fed Staff Report 125; published in the *Journal of Finance* 2003): stop-loss and take-profit order execution rates are "strongly clustered at round numbers". Take-profits concentrate *at* round numbers and stop-losses just *beyond* them. This explains why trends tend to **reverse at** S/R and **accelerate after** crossing it.
  - This is one of the few TA claims with a clear microstructure mechanism.
- **Level**: B. **Prereq**: 3.6.
- **Misuse**: assuming a level holds just because it is round, while ignoring that stops beyond it fuel breakouts.
- **Practice**: the simulator's agent model places take-profit and stop orders at round numbers. The learner watches the order book heat-map and predicts the reaction at, versus after crossing, a round level.

### 3.10 Pivot points (floor-trader pivots)
- **Def**: intraperiod S/R levels computed from the prior period's H, L and C (and sometimes O).
- **Identify**, formulas:
  - **Classic (standard)**:
    - P = (H+L+C)/3.
    - R1 = 2P − L; S1 = 2P − H.
    - R2 = P + (H − L); S2 = P − (H − L).
    - R3 = H + 2(P − L); S3 = L − 2(H − P) (common extension).
  - **Fibonacci**: P = (H+L+C)/3. R/S1 = P ± 0.382(H−L), R/S2 = P ± 0.618(H−L), R/S3 = P ± 1.000(H−L).
  - **Camarilla** (Nick Scott, 1989, per Babypips; uses the prior close): R1..R4 = C + (H−L)×1.1/12, /6, /4, /2. S1..S4 mirror these with subtraction. Convention: fade at R3/S3 with the stop near R4/S4, and trade breakouts beyond R4/S4.
  - **Woodie**: P = (H + L + 2C)/4 **[not verified this session]**.
  - **DeMark**:
    - X = H + 2L + C if C < O; X = 2H + L + C if C > O; X = H + L + 2C if C = O.
    - P = X/4; R1 = X/2 − L; S1 = X/2 − H.
  - **Timeframe convention** (StockCharts): 1–15-minute charts use the prior *day*; 30–120-minute charts use the prior *week*; daily charts use the prior *month*; weekly and monthly charts use the prior *year*.
- **Claim**: self-fulfilling intraday S/R, because many floor and day traders watch the same numbers. Price above P is a bullish bias.
- **Evidence**: no robust peer-reviewed evidence found in this research. The mechanism would be coordination, as with round numbers. They are testable in the simulator only if the synthetic agents use them; on pure GBM they will be random.
- **Level**: I. **Prereq**: 3.6, 1.12.
- **Misuse**: plotting 4 pivot systems at once, so some line is always "hit". Using different session definitions for 24h markets.
- **Practice**: BUILD the pivot levels from yesterday's H/L/C (a calculator exercise). BACKTEST "touch frequency of R1/S1 vs random levels at the same distance".

### 3.11 Gaps
General rules (StockCharts):
- Up gap: today's low > yesterday's high. Down gap: today's high < yesterday's low.
- A **partial gap** is open-only: the open is beyond the prior close, but the ranges overlap.
- A gap is **filled** when price retraces to the last pre-gap bar's extreme.
- Gaps are significant with above-average volume. They are common on daily charts and rare on weekly or monthly ones.
- Intraday gaps that close before the session end are just noise.
- Avoid thin securities that gap daily.
- The "all gaps get filled" adage does not reliably hold for breakaway and runaway gaps.

#### 3.11.1 Common (area) gap
- **Def**: a gap inside a trading range or congestion area.
- **Identify**: within a range, on low volume. Often caused by ex-dividend dates.
- **Claim**: meaningless; usually filled quickly.
- **Evidence**: practitioner consensus. No rigorous stats in the sources fetched.
- **Level**: I. **Prereq**: 3.6.
- **Misuse**: trading every gap fill.
- **Practice**: CLASSIFY the gap type from context (range, edge of range, mid-trend or late trend) plus volume.

#### 3.11.2 Breakaway gap
- **Def**: a gap that leaves a congestion area or pattern, beginning a new move.
- **Identify**: it happens at a pattern boundary, on high volume (ideally *after* the gap too).
- **Claim**: the start of a trend. The gap edge becomes support. It may stay unfilled for a long time.
- **Evidence**: Bulkowski repeatedly finds a breakout-day gap associated with better pattern performance (e.g. falling wedges: "An upward gap on breakout day suggests a better-performing wedge").
- **Level**: I. **Prereq**: 3.11.1, §4.
- **Misuse**: waiting for a fill that never comes.
- **Practice**: PREDICT→REVEAL "filled within 20 bars?" by gap type.

#### 3.11.3 Runaway (continuation / measuring) gap
- **Def**: a mid-trend gap on high volume, from late entrants chasing.
- **Identify**: it appears after the move has started, with no congestion around it.
- **Claim**: often roughly **halfway** through the move (the "measuring gap"), so it can project a target.
- **Evidence**: the "halfway" claim has no robust evidence.
- **Level**: I. **Prereq**: 3.11.2.
- **Misuse**: projecting targets precisely.
- **Practice**: CLASSIFY, then reveal where the move actually ended relative to the gap.

#### 3.11.4 Exhaustion gap
- **Def**: a late-trend gap on *exceptionally* high volume, quickly filled as the trend reverses.
- **Identify**: it can only be known for sure **after** it is filled. In real time it looks like a runaway gap, and volume is the main differentiator (StockCharts).
- **Claim**: the end of a trend.
- **Evidence**: no robust evidence for real-time identification.
- **Level**: I. **Prereq**: 3.11.3.
- **Misuse**: hindsight labelling.
- **Practice**: a "label in real time" game. The learner labels a gap at gap time, then the app reveals the outcome. The lesson is that ex-ante accuracy is low.

#### 3.11.5 Island reversal
- **Def**: a cluster of bars isolated by a gap on each side at overlapping prices: an exhaustion gap, then a gap in the opposite direction.
- **Identify** (Bulkowski): an up-trend into an island top (or down-trend into a bottom). The two gaps share some or all of the same price. Volume is high on the second gap. The island lasts from **one day to several months**.
- **Claim**: a sharp reversal.
- **Evidence** (Bulkowski, 2,000+ trades):
  - Break-even failure rate 31% (up) and 34% (down).
  - Average move 31% (up) and 13% (down).
  - Target met 82% and 62%.
  - Throwback/pullback 54–55%.
  - **Overall rank: island tops 31/36, island bottoms 38/39, among the worst.**
- **Level**: I. **Prereq**: 3.11.1–4. Compare it with the abandoned baby (2.3.4).
- **Misuse**: believing the dramatic look implies reliability.
- **Practice**: TAP both gaps. Then a reveal with Bulkowski's ranking.

### 3.12 Breakouts, false breakouts, retests and filters
- **Def**: a breakout is price closing beyond a pattern boundary or S/R. A false breakout ("fakeout", "bull/bear trap", "busted pattern") reverses back inside.
- **Identify**:
  - Bulkowski uses a **close** outside the boundary.
  - The CMT Level II curriculum explicitly contrasts the **3% rule** (a close ≥3% beyond the level) with the **ATR-multiple rule** (beyond by k·ATR) for confirming breakouts and breakdowns.
  - Time filters, e.g. 2 consecutive closes.
  - StockCharts notes that a tiny intraday poke is not a break, and a gap through the level is strong confirmation.
- **Claim**: filters reduce false signals at the cost of a worse entry.
- **Evidence**:
  - Bulkowski's statistics show false-breakout risk is large. Descending-triangle downward breakouts: "almost half … bust". Symmetrical-triangle breakouts fail 25–37% at break-even. Rising-wedge downward breakouts fail **51%**.
  - Failure rates **rose sharply in the 2000s**. The share of upward breakouts failing to gain 10% was 14% in the 1990s bull market versus 28% in 2003–2007. For downward breakouts it was 26% versus 49%. Bulkowski says patterns failed "two to four times more often in the 2000s than in the 1990s".
  - Busted patterns (breakout, then reversal through the other side) can produce strong moves (Bulkowski, descending triangles).
- **Level**: I. **Prereq**: 3.6, §4.
- **Misuse**: entering on intraday pokes. No invalidation level.
- **Practice**: SLIDER on the filter (0%, 1%, 3%, or 0.5–2 ATR). BACKTEST shows that the trade-off between false signals avoided and entry slippage is real, using the same simulated breakouts.

### 3.13 Trading ranges (consolidation) and the range/trend dichotomy
- **Def**: a sideways price movement bounded by support and resistance.
- **Identify**: flat MAs, ADX < 20, overlapping swings, and range boundaries with ≥2 touches each.
- **Claim**: mean-reversion tactics work inside ranges and breakout tactics work at the edges. The CMT Level II objective is "Employ rangebound mean-reversionary trading tactics and breakout tactics". Dow Theory treats ranges as neutral until they break.
- **Evidence**: regime-dependence is real, and strategy performance depends on regime. **Identifying the regime in real time is the hard part.**
- **Level**: I. **Prereq**: 3.3, 3.6, 5.5.
- **Misuse**: using oscillator fades in trends and breakout entries in ranges.
- **Practice**: a regime-switching synthetic market. The learner chooses a "fade" or "breakout" tool each episode, and the app shows P&L by the true (hidden) regime.

---

## 4. Chart patterns

### 4.0 Universal pattern anatomy, taught once and applied to all patterns
1. **Prior trend**: what the pattern reverses or continues.
2. **Boundaries**: neckline, trendlines or horizontal lines, with minimum touches (Bulkowski typically requires ≥3 touches on one line and ≥2 on the other for triangles, rectangles and wedges).
3. **Volume profile**: usually declining inside the pattern.
4. **Breakout and confirmation**: a close beyond the boundary, with filters per 3.12.
5. **Measure rule (target)**: the pattern height projected from the breakout. Bulkowski recommends multiplying the height by the historical "% meeting target" rather than using 100%.
6. **Invalidation and stop**: the opposite side of the pattern, or the last swing.
7. **Post-breakout behaviour**: throwback/pullback, busted pattern.
8. **Context modifiers** (Bulkowski): location in the yearly range (often best within a third of the yearly low), short versus long prior trend, tall versus short patterns, tight versus loose patterns, and the volume trend.

**Big caveats to teach with every pattern:**
- (a) **Subjectivity.** Lo, Mamaysky & Wang (2000) built an algorithm precisely because "identifying chart patterns is highly subjective".
- (b) **"Perfect trade" statistics overstate tradable results.**
- (c) **Era dependence**: failure rates doubled in the 2000s versus the 1990s.
- (d) **Base rates**: on a random walk, shapes resembling every pattern occur, and the post-pattern distribution equals the unconditional one. Demonstrate this in the simulator.

### 4.1 Head-and-shoulders top
- **Def**: three peaks with the middle one (the head) highest, and a neckline through the two intervening lows ("armpits"). A bearish reversal.
- **Identify**:
  - Bulkowski: an upward trend into the pattern. Shoulders peak at about the same price, are about the same distance from the head, and are similar in width; the pattern should look proportional, "not lopsided".
  - Volume is highest on the left shoulder, then the head, and trends down 61% of the time.
  - Confirmation is a close below an up-sloping neckline, or below the right armpit if the neckline slopes down.
  - Algorithmic definition, Lo-Mamaysky-Wang style **[recalled from the paper; verify before use]**: among five consecutive local extrema E1..E5, E1 is a maximum; E3 > E1 and E3 > E5; E1 and E5 lie within 1.5% of their average; E2 and E4 lie within 1.5% of their average.
- **Claim**: a distribution top and the end of the uptrend.
- **Evidence**:
  - Bulkowski (bull market, >2,800 trades): break-even failure rate **19%**, average decline 16%, pullback rate **68%**, **target met 51%**, overall rank 9/36.
  - Measure rule: (head − neckline) × 51%, subtracted from the breakout price.
  - Lo-Mamaysky-Wang (2000): automated patterns, including H&S, provided *incremental information* on US stocks 1962–96, especially Nasdaq. They also note that traditional patterns "may not be optimal". Jegadeesh's discussion concludes that the evidence does not support TA as an *independent* source of profits.
  - Chang & Osler (1999, cited in Osler 2000): an H&S trading strategy was profitable for the dollar against the mark and the yen, "although not for four other dollar exchange rates".
- **Level**: I. **Prereq**: 3.2, 3.4, 3.6, 3.12.
- **Misuse**:
  - Shorting before the neckline breaks (anticipation).
  - Seeing H&S in every three bumps.
  - Ignoring that half the time the full target isn't reached.
- **Practice**:
  - DRAW the neckline, graded by the anchors at the armpit lows.
  - LABEL the LS/H/RS.
  - PREDICT→REVEAL at the neckline break.
  - "H&S in noise": the app scans pure-GBM paths with the LMW rule and shows the outcome distribution versus the base rate.

### 4.2 Inverse head-and-shoulders (H&S bottom)
- **Def**: the mirror image: three valleys with the middle one lowest. A bullish reversal.
- **Identify**: Bulkowski: a downtrend into the pattern; symmetric shoulders; volume highest on the left shoulder or head and lower on the right shoulder (trends down 65%). Confirmation is a close above a down-sloping neckline, or above the right armpit if the neckline slopes up.
- **Claim**: a bottom or accumulation.
- **Evidence**: Bulkowski (3,197 trades): failure **11%**, average rise 45%, throwback 65%, **target met 71%**, rank 13/39. Down-sloping necklines are marginally better. A short prior decline (0–3 months) is best.
- **Level**: I. **Prereq**: 4.1.
- **Misuse / Practice**: as for 4.1.

### 4.3 Complex head-and-shoulders (multiple shoulders or heads)
- **Def**: an H&S with two or more left/right shoulders or a double head.
- **Identify**: symmetric shoulder clusters around the head(s), with a neckline through the armpits.
- **Claim**: as for H&S.
- **Evidence**: Bulkowski ranks:
  - Complex H&S **bottoms**: performance rank 9/39 and failure rank **3** (low failure), among the best upward-breakout patterns.
  - Complex **tops**: performance rank 7/36 and failure rank 9 for downward breakouts.
- **Level**: A. **Prereq**: 4.1–4.2.
- **Misuse**: forcing symmetry.
- **Practice**: LABEL the shoulders.

### 4.4 Double top (Adam & Eve variants)
- **Def**: two similar peaks separated by a valley. Bearish once price closes below the valley ("confirmation").
- **Identify**:
  - Bulkowski, Adam & Adam: peaks usually several weeks apart, **within ~3% in price**, with a drop between them of at least ~10% (exceptions allowed).
  - **Adam** = a narrow, spiky peak. **Eve** = a wide, rounded peak. That gives four variants: AA, AE, EA and EE.
  - Confirmation is a close below the valley floor.
- **Claim**: a failed attempt to make new highs, then reversal.
- **Evidence**:
  - Bulkowski, Adam & Adam bull market: failure 25%, average decline 15%, pullback 64%, target met 64%.
  - **Unconfirmed twin peaks fail ~60% of the time**: "traders who don't wait for confirmation face a 60% chance that price keeps rising".
  - Ranks for downward breakouts: Eve & Eve 12/36, Adam & Eve 10, Eve & Adam 16, Adam & Adam 19.
  - LMW found double tops and bottoms the most common patterns in their 1962–96 sample.
- **Level**: B/I. **Prereq**: 3.6, 3.12.
- **Misuse**: calling every pair of highs a double top before confirmation. This is the single most valuable lesson here.
- **Practice**: PREDICT→REVEAL at the *second peak*, before confirmation, versus at the confirmation close. Tally both. The data should reproduce the ~60% failure of unconfirmed setups.

### 4.5 Double bottom (Adam & Eve variants)
- **Def**: two similar valleys with a peak between them. Bullish on a close above the peak.
- **Identify**: Bulkowski, Eve & Eve: a downtrend into the pattern; two similar wide, rounded valleys; the rise between them is ideally ≥10%; bottoms vary by 0–6%; usually 2–7 weeks apart; volume usually higher on the left bottom; confirmation is a close above the intervening peak.
- **Claim**: support held twice, so the trend reverses.
- **Evidence**:
  - Bulkowski, Eve & Eve (952 trades): failure **12%**, average rise 50%, throwback 65%, target met 65%, rank **5/39**.
  - Without confirmation, there is a **~48% chance price keeps falling**.
  - Other variant ranks for upward breakouts: Adam & Eve 17, Eve & Adam 20, Adam & Adam 26.
  - The "Big W" (a tall left side) tends to return toward the start of the downtrend.
- **Level**: B/I. **Prereq**: 4.4.
- **Misuse**: as for 4.4.
- **Practice**: as for 4.4. Add a CLASSIFY Adam versus Eve shape drill.

### 4.6 Triple top
- **Def**: three peaks near the same price, confirmed by a close below the lowest valley.
- **Identify**: Bulkowski: an uptrend into the pattern; the middle peak is sometimes slightly lower; volume trends down 62% but is high under each peak. **More common in bear markets.**
- **Claim**: strong resistance and a reversal.
- **Evidence**: Bulkowski (1,964 trades): failure 25%, average decline 14%, pullback 66%, **target met 49%**, rank 24/36.
- **Level**: I. **Prereq**: 4.4.
- **Misuse**: forgetting it is just a range until confirmation. Many triple tops become rectangles that break *up*.
- **Practice**: PREDICT the breakout direction at the third peak, then reveal.

### 4.7 Triple bottom
- **Def**: three valleys near the same price, confirmed by a close above the highest intervening peak.
- **Identify**: Bulkowski: a downtrend into the pattern that doesn't go below the first bottom; three similar valleys; volume usually highest on the first bottom.
- **Claim**: reversal.
- **Evidence**: Bulkowski (2,500+ trades): failure **13%**, average rise 46%, throwback 65%, **target met 74%**, rank 12/39. Avoid triples that follow an extensive uptrend.
- **Level**: I. **Prereq**: 4.5.
- **Misuse / Practice**: as for 4.6.

### 4.8 Rounding bottom (saucer) / rounding top
- **Def**: a slow, bowl-shaped turn.
- **Identify**: Bulkowski: best seen on weekly charts, forming over many months. Price trends *up* into rounding bottoms **67%** of the time, so they usually act as **continuation**. A mid-turn "bump" may occur. Confirmation is a close above the left lip.
- **Claim**: gradual transition from supply to demand.
- **Evidence**: Bulkowski, rounding bottom (990 trades): failure **4%** (failure rank #1, the best), average rise 48%, throwback 64%, target met 65%, rank 7/39. **Rounding top**: performance rank 2/39 for upward breakouts and 3/36 for downward.
- **Level**: I. **Prereq**: 3.3.
- **Misuse**: identifying it before the right side forms, which is hindsight.
- **Practice**: DRAW a curve fit, then a live-forming exercise showing that the bowl is only visible late.

### 4.9 V-bottom / V-top (spike reversal)
- **Def**: a sharp reversal with no consolidation.
- **Identify**: a steep decline (or rise), immediately followed by a steep move the other way. There are no classical rules.
- **Claim**: capitulation and reversal.
- **Evidence**: Bulkowski ranks:
  - V-bottom: performance 24/39 (upward breakouts).
  - V-top extended: performance **2/36** (downward breakouts).
  - The "extended" variants are measured differently.
  - Real-time recognition is nearly impossible.
- **Level**: I. **Prereq**: 3.2.
- **Misuse**: "catching falling knives".
- **Practice**: PREDICT→REVEAL at the low. Show the many failed "V's" that kept falling.

### 4.10 Diamond top / diamond bottom
- **Def**: a broadening first half (higher highs, lower lows), then a narrowing second half (a symmetrical triangle), giving a diamond shape.
- **Identify**: Bulkowski, diamond top: an uptrend into the pattern; each trendline is touched once or twice; volume trends down 55–59%; the breakout is downward 54% of the time.
- **Claim**: a top (or bottom) formed by volatile distribution.
- **Evidence**:
  - Bulkowski, diamond top (733 trades), up/down breakouts: failure 21%/15%, average rise 29% and decline 17%, target met 65%/63%. Rank **39/39** (the worst) for upward breakouts but **3/36** for downward breakouts.
  - Diamond bottom: rank **1/36** for downward breakouts.
  - The pattern is rare and highly subjective.
- **Level**: A. **Prereq**: 4.11, 4.21.
- **Misuse**: drawing diamonds into ordinary congestion.
- **Practice**: DRAW the 4 boundary lines, graded by tolerance.

### 4.11 Broadening formations (megaphone) and broadening wedges
- **Def**: diverging trendlines with higher highs and lower lows, i.e. expanding volatility.
- **Identify**:
  - Bulkowski, broadening top: an uptrend into the pattern; ≥5 touches total (3 on one line, ≥2 on the other); price crosses side to side; the breakout is upward ~60%.
  - Variants: broadening bottom; right-angled ascending and descending (one flat side); ascending and descending broadening wedges.
- **Claim**: an emotional, unstable market. It is traded *inside* the pattern (buy the lower line, short the upper line).
- **Evidence**: Bulkowski calls the broadening top "a poor performer". Up/down: failure 18%/27%, average 42%/13%, target met 66%/42%, rank 22/39 and 28/36. Partial rises work 52% and partial declines 72%.
- **Level**: A. **Prereq**: 3.4, 3.5.
- **Misuse**: confusing them with channels.
- **Practice**: DRAW the diverging lines, then a simulated intra-pattern swing trade.

### 4.12 Bump-and-run reversal (BARR)
- **Def**: Bulkowski's pattern of a lead-in trend, then a steep "bump" phase (a trendline at roughly 2× the lead-in slope), then a "run" through the lead-in trendline the other way.
- **Identify**: the lead-in trendline, a bump height of ~2× the lead-in height, and a break of the lead-in line (see Bulkowski's barrt/barrb pages, not fetched in detail).
- **Claim**: a speculative blow-off followed by reversal.
- **Evidence**: Bulkowski ranks BARR bottoms **#1 in performance** for upward breakouts (failure rank 6), and BARR tops **#1 in failure rank** (fewest failures) for downward breakouts (performance 3). It is little known but statistically strong in his data.
- **Level**: A. **Prereq**: 3.4.
- **Misuse**: subjective trendline angles.
- **Practice**: DRAW both trendlines; the app computes the slope ratio.

### 4.13 Cup with handle (O'Neil)
- **Def**: a U-shaped base ("cup") followed by a small pullback ("handle") near the right rim, then a breakout above the rim. Bullish continuation.
- **Identify**: Bulkowski: a U shape (not V); rims near the same price; the **cup lasts 7–65 weeks**; the **handle lasts ≥1 week and forms in the upper half** of the cup; there is a rise into the pattern.
- **Claim**: a base and shake-out, then a new advance.
- **Evidence**:
  - Bulkowski (913 trades): failure **5%**, average rise 54%, throwback 62%, target met 61%, rank **3/39** (failure rank 2). Handles **shorter than the median 22 days** perform better.
  - Measure rule: (rim − cup low) × 61%, added to the breakout.
  - Entry is a close above the handle's down-sloping trendline, or above the rim. The stop goes at the handle low.
- **Level**: I. **Prereq**: 4.8, 3.12.
- **Misuse**: deep V-shaped cups; handles in the lower half; anticipating before the breakout.
- **Practice**: DRAW the cup rim line and the handle trendline, then PREDICT→REVEAL.

### 4.14 Flag
- **Def**: a short, small, parallel-sided consolidation that slopes against a sharp prior move (the "flagpole").
- **Identify**: Bulkowski: lasts **less than 3 weeks** (longer is a rectangle or channel); has a steep near-vertical flagpole; volume trends down (74% for up breakouts, 77% for down); the breakout is **up 60%** of the time.
- **Claim**: a "flag flies at half-mast": the move after equals the pole ("half staff").
- **Evidence**:
  - Bulkowski, up/down breakouts: **break-even failure 44%/45%**, average move 9%/8%, target met **46%/46%**. Measured on the short-term swing, so it is unranked.
  - Best when the inbound trend is up and the flag tilts down. Tight flags beat loose ones.
  - Takeaway: a famous pattern with near coin-flip break-even rates.
- **Level**: B/I. **Prereq**: 3.4, 3.12.
- **Misuse**: projecting the full flagpole as the target.
- **Practice**: DRAW the flag's parallel lines. SLIDER on the target projection (100% versus 46% of the pole) to see hit rates.

### 4.15 Pennant
- **Def**: like a flag but with converging lines, i.e. a short symmetrical triangle after a flagpole.
- **Identify**: Bulkowski: **≤3 weeks**; an unusually steep pole lasting several days; volume down 86%; the breakout is **up 57%**.
- **Claim**: continuation; the half-staff rule.
- **Evidence**: Bulkowski (1,600+ trades): **failure 54%/54%** (worse than a coin flip at break-even), average 7%/6%, target met 35%/32%. The trend after the pennant equals or exceeds the inbound trend only ~**30%** of the time.
- **Level**: I. **Prereq**: 4.14, 4.21.
- **Misuse**: believing the half-staff projection.
- **Practice**: as for 4.14.

### 4.16 High tight flag
- **Def**: a flag after price **roughly doubles (≥90%) within ~2 months**.
- **Identify**: Bulkowski: a sideways pause after the rise; declining volume is best; confirmation is a close above the highest peak, i.e. the flagpole top.
- **Claim**: extreme momentum continuation.
- **Evidence**: Bulkowski (1,028 trades): failure 15%, average rise 39%, throwback 67%, **target met 82%** (using a half-height target), rank 30/39. Poles near 45° outperform near-vertical ones.
- **Level**: A. **Prereq**: 4.14.
- **Misuse**: buying flags after small rises as if they were high tight flags.
- **Practice**: TAP candidate high tight flags; the grader checks the ≥90%-in-2-months rule.

### 4.17 Rectangle (top / bottom)
- **Def**: horizontal support and resistance bounding a sideways range.
- **Identify**: Bulkowski, rectangle top: an uptrend into the pattern; near-horizontal parallel lines; ≥3 touches on one line and ≥2 on the other ("be flexible"); volume trends down 70%; the breakout is **up 63%**.
- **Claim**: a pause, after which the breakout direction decides.
- **Evidence**:
  - Bulkowski, rectangle top, up/down: failure 15%/34%, average 51%/13%, throwback 66%/64%, target met **78%**/54%, rank **4/39** up and 32/36 down.
  - **Partial rise predicts a downward breakout 75%** of the time; a **partial decline predicts an upward breakout 79%**. This is a rare quantified "tell".
  - Intra-pattern swing trades are possible in tall rectangles.
- **Level**: B/I. **Prereq**: 3.6, 3.13.
- **Misuse**: guessing the breakout direction early.
- **Practice**: DRAW the box. PREDICT→REVEAL the breakout direction after a partial rise or decline.

### 4.18 Ascending triangle
- **Def**: a flat top (horizontal resistance) and rising lows.
- **Identify**: Bulkowski: any prior trend; a horizontal top line and an up-sloping bottom line; ≥3 touches on top and ≥2 on the bottom; price fills the triangle; volume trends down ≥78%; the breakout is **up 63%**, occurring **64% of the way to the apex**.
- **Claim**: buyers are increasingly aggressive, so an upside breakout.
- **Evidence**: Bulkowski (1,400+ trades), up/down: failure **17%/38%**, average 43%/13%, throwback 64%/63%, target met 70%/44%, rank 16/39 and 30/36. "Almost half" of downward breakouts bust upward.
- **Level**: I. **Prereq**: 3.4, 3.6.
- **Misuse**: assuming an upward breakout. Over a third of breakouts go down.
- **Practice**: DRAW, then PREDICT the direction. Reveal that the base rate is 63/37, not 100/0.

### 4.19 Descending triangle
- **Def**: a flat bottom and falling highs.
- **Identify**: Bulkowski: a horizontal bottom line and a down-sloping top line; ≥3 and ≥2 touches; "avoid descending triangles with abundant white space"; volume recedes 78%. The breakout is **upward 53%** of the time, against the textbook claim. If price rises into the pattern, the breakout is up 63% of the time.
- **Claim** (textbook): bearish.
- **Evidence**: Bulkowski (1,300+ trades), up/down: failure 22%/23%, average 38%/15%, throwback 60%/58%, target met 64%/50%, rank 33/39 and **15/36**. The median breakout comes 61–65% of the way to the apex, and the market tends to turn at the apex.
- **Level**: I. **Prereq**: 4.18.
- **Misuse**: shorting in anticipation.
- **Practice**: as for 4.18. The "textbook vs data" reveal is powerful here.

### 4.20 Symmetrical triangle
- **Def**: converging trendlines, with the top falling and the bottom rising.
- **Identify**: Bulkowski: price crosses side to side; touches ≥3 on one line and ≥2 on the other; volume trends down 84–86%; the breakout is **up 60%**, occurring **74% of the way to the apex**; price turns at the apex 60% of the time.
- **Claim**: neutral, with continuation of the prior trend more likely.
- **Evidence**: Bulkowski (3,000+ trades), up/down: failure 25%/37%, average 34%/12%, throwback 62%/65%, target met 58%/36%. Rank **36/39** and 34/36, among the worst performers. Heavy breakout volume (above the 30-day average) helps.
- **Level**: I. **Prereq**: 3.4.
- **Misuse**: drawing triangles on every coil. Late breakouts near the apex.
- **Practice**: DRAW, then a live "breakout or fizzle" game near the apex.

### 4.21 Rising wedge
- **Def**: two up-sloping converging lines, the bottom steeper. Bearish in theory.
- **Identify**: Bulkowski: ≥5 touches (3+2); **≥3 weeks** (shorter is a pennant); volume trends down 79%; the breakout is **down 60%**; confirmation is a close outside a trendline.
- **Claim**: weakening upward momentum, so a downside break.
- **Evidence**: Bulkowski, up/down: failure 19%/**51%**, average 38%/9%, throwback 72%/72%, target met 63%/32%. Rank 32/39 and **36/36, the worst downward-breakout pattern**. Upward breakouts occur about two-thirds of the way to the apex.
- **Level**: I. **Prereq**: 4.20.
- **Misuse**: shorting rising wedges because "wedges reverse".
- **Practice**: PREDICT→REVEAL with a statistics card.

### 4.22 Falling wedge
- **Def**: two down-sloping converging lines. Bullish in theory.
- **Identify**: Bulkowski: ≥5 touches; ≥3 weeks; volume trends down 72–75%; the breakout is **up 68%**, about 61–62% of the way to the apex.
- **Claim**: selling momentum fades, so an upside break.
- **Evidence**: Bulkowski (800+ trades), up/down: failure 26%/29%, average 38%/14%, throwback 62%/74%, target met 62%/29%, rank 31/39 and 27/36. An upward gap on breakout day and a tall pattern both help.
- **Level**: I. **Prereq**: 4.21.
- **Misuse / Practice**: as for 4.21.

### 4.23 Measured move (ABCD; "swing measurement")
- **Def**: two roughly equal legs separated by a correction: A→B (leg 1), B→C (correction), C→D (leg 2 ≈ leg 1).
- **Identify**: Bulkowski, measured move up: three consecutive turns. The automated method requires the correction to retrace ≥70% of leg 1 for the best measure-rule results.
- **Claim**: leg 2 equals leg 1 (AB = CD). This is the basis of the harmonic AB=CD (6.5).
- **Evidence**: Bulkowski (1,000+ trades, bull market): leg 1 averages +36% over 38 days; the correction retraces ~48% over 27 days; leg 2 averages +31% over 33 days. Using **60% of leg 1** as the target hit **60%** of the time. Leg 2 often falls short of exact equality.
- **Level**: I. **Prereq**: 3.2.
- **Misuse**: projecting 100% equality.
- **Practice**: DRAW A, B and C; the app projects D at 60% and 100%. PREDICT→REVEAL the hit rates.

### 4.24 Other patterns (catalogue for completeness)
- **Scallops** (ascending/descending, inverted), **three rising valleys / three falling peaks**, **Big W / Big M**, **pipe and horn** bottoms and tops (two adjacent spike bars on weekly charts), **roof and inverted roof**, and the **Wolfe wave** (a 5-point wedge-like pattern with an "EPA" target line; Bulkowski ranks it near the bottom: bull 34/39, bear 35/36).
- **Level**: A/E (catalogue). **Practice**: a single "pattern zoo" card with Bulkowski ranks, so that learners see how the obscure ones compare.

### 4.25 Busted patterns and failure as information
- **Def**: a pattern breaks out, fails (moves less than ~10%), then reverses through the opposite boundary.
- **Identify**: a breakout, a failure threshold, then an opposite-side close.
- **Claim**: trapped traders fuel the reverse move.
- **Evidence**: Bulkowski describes busted triangles as producing strong moves. Specific busted-pattern statistics are in his books (not fetched).
- **Level**: A. **Prereq**: 3.12, §4.
- **Misuse**: flip-flopping without a plan.
- **Practice**: a scenario tree. Pre-commit the actions for "breakout works", "fails" and "busts".

### 4.26 Master table: Bulkowski bull-market statistics (up / down breakouts)

| Pattern | Breakout bias | Break-even failure | Avg move | Throwback/pullback | Target met (full height × this %) | Perf. rank |
|---|---|---|---|---|---|---|
| H&S top | down (confirm) | 19% | −16% | 68% | 51% | 9/36 |
| H&S bottom | up (confirm) | 11% | +45% | 65% | 71% | 13/39 |
| Double top (A&A) | down (confirm) | 25% | −15% | 64% | 64% | 19/36 |
| Double bottom (E&E) | up (confirm) | 12% | +50% | 65% | 65% | 5/39 |
| Triple top | down (confirm) | 25% | −14% | 66% | 49% | 24/36 |
| Triple bottom | up (confirm) | 13% | +46% | 65% | 74% | 12/39 |
| Rounding bottom | up | 4% | +48% | 64% | 65% | 7/39 |
| Cup with handle | up | 5% | +54% | 62% | 61% | 3/39 |
| High tight flag | up | 15% | +39% | 67% | 82% (½ height) | 30/39 |
| Rectangle top | up 63% | 15% / 34% | +51% / −13% | 66% / 64% | 78% / 54% | 4/39 · 32/36 |
| Ascending triangle | up 63% | 17% / 38% | +43% / −13% | 64% / 63% | 70% / 44% | 16/39 · 30/36 |
| Descending triangle | up 53% | 22% / 23% | +38% / −15% | 60% / 58% | 64% / 50% | 33/39 · 15/36 |
| Symmetrical triangle | up 60% | 25% / 37% | +34% / −12% | 62% / 65% | 58% / 36% | 36/39 · 34/36 |
| Rising wedge | down 60% | 19% / 51% | +38% / −9% | 72% / 72% | 63% / 32% | 32/39 · 36/36 |
| Falling wedge | up 68% | 26% / 29% | +38% / −14% | 62% / 74% | 62% / 29% | 31/39 · 27/36 |
| Broadening top | up ~60% | 18% / 27% | +42% / −13% | 67% / 67% | 66% / 42% | 22/39 · 28/36 |
| Diamond top | down 54% | 21% / 15% | +29% / −17% | 57% / 58% | 65% / 63% | 39/39 · 3/36 |
| Island reversal | — | 31% / 34% | +31% / −13% | 54% / 55% | 82% / 62% | 38/39 (bottom) · 31/36 (top) |
| Flag | up 60% | 44% / 45% | +9% / −8% (swing) | — | 46% / 46% | unranked |
| Pennant | up 57% | 54% / 54% | +7% / −6% (swing) | — | 35% / 32% | unranked |
| Measured move up | — | — | leg2 +31% | — | 60% (at 60% of leg 1) | — |

*Average moves are from "perfect trades" (to the ultimate high or low). Use them as relative rankings, never as expected returns.*

### 4.27 Chart-pattern evidence: summary
- **Supportive but nuanced**:
  - Lo, Mamaysky & Wang (2000), *Journal of Finance*: kernel-regression detection of 10 patterns (H&S, inverse H&S, broadening, triangle, rectangle, double tops and bottoms) on US stocks 1962–96. The conditional return distributions differ from the unconditional ones, especially for Nasdaq. They do *not* establish profitability: "patterns that are optimal for detecting statistical anomalies need not be optimal for indicating trading profits".
  - Chang & Osler (1999): H&S profitable for 2 of 6 FX pairs.
- **Practitioner statistics**: Bulkowski. These are large samples, but the "perfect trade" measurement and his own pattern identification bias them. Failure rates doubled in the 2000s.
- **Teaching stance**: patterns are a **language for describing consolidations and reversals**, and they provide **structure for risk** (where am I wrong?). Their predictive edge is modest, unstable over time, and highly sensitive to definition. In the simulator, *always* show the base rate.

---

## 5. Indicators by family

### 5.0 Indicator literacy, taught before any specific indicator
- **Every indicator is a transformation of OHLCV.** It adds no new information; it re-weights the past. Teach the learner to compute at least SMA, RSI and ATR by hand.
- **Lag versus noise trade-off.** A shorter lookback gives less lag and more whipsaws. StockCharts' analogy: a 10-day MA is a speedboat, a 100-day MA an ocean tanker.
- **Smoothing methods**:
  - SMA: equal weights.
  - EMA: α = 2/(n+1), seeded with an SMA.
  - **Wilder smoothing**: prior × (n−1)/n + current/n, i.e. α = 1/n, equivalent to an EMA of length 2n−1.
  - Recursive indicators need warm-up history. StockCharts computes ≥250 bars back; ADX needs ~150 bars to settle.
- **Bounded versus unbounded**:
  - Bounded: RSI, Stochastic, Williams %R and MFI run 0–100 (or 0 to −100).
  - Unbounded: MACD, CCI, ROC and OBV. Unbounded means no fixed overbought/oversold, and values are not comparable across instruments (e.g. MACD; use PPO instead).
- **Collinearity.** Bollinger's rule 4: combine *non-collinear* indicators (momentum + volume), not two momentum oscillators. RSI, Stochastic, Williams %R and CCI are largely the same information.
- **Repainting and look-ahead.** ZigZag, centred averages, fitted regression channels, swing pivots and Ichimoku's forward-shifted cloud all use or display information that was not available at the bar's time. Backtests must use as-of values.
- **Default parameters are conventions, not laws** (14, 20, 12/26/9, 9/26/52). Optimising them on the past is the main path to overfitting (§7.5, §8).
- **Level**: B. **Practice**: BUILD. Compute a 5-period SMA, an EMA and an RSI by hand in a spreadsheet-like widget, and the app checks each cell. SLIDER: a lookback-lag explorer that shows the same series with n = 5…200.

---

### Trend family

#### 5.1 Simple Moving Average (SMA)
- **Def**: the arithmetic mean of the last n closes.
- **Identify**: SMA_t = (C_t + … + C_{t−n+1})/n. Common lengths: short 5–20, medium 20–60 (50 is popular), long 100+ (200 is the most followed) (StockCharts).
- **Claim**:
  - The slope gives trend direction.
  - Price above or below it gives the bias.
  - It acts as dynamic support or resistance: the 20-day for short trends, the 200-day for long ones. Treat it as a zone.
- **Evidence**:
  - **Brock, Lakonishok & LeBaron (1992)**: MA and trading-range-break rules on the DJIA 1897–1986. Buy signals earned higher, less volatile returns than sell signals, inconsistent with random walk, AR(1), GARCH-M and EGARCH nulls.
  - **Sullivan, Timmermann & White (1999)**: tested 7,846 rules on 100 years of the DJIA with White's Reality Check. In-sample results were robust to data snooping. However, the best rule's **out-of-sample (1987–96) performance was not significant**, per secondary sources.
  - **Bajgrowicz & Scaillet (2008/2012)**: false discovery rate on the same universe. They found investors **could not have selected the best rules ex ante** (persistence tests fail), and "performance fully disappears once transaction costs are taken into account".
  - Applied to **diversified futures**, MA-type trend rules relate to time-series momentum, which has strong long-run evidence (§8).
- **Level**: B. **Prereq**: 1.1, averages.
- **Misuse**: thinking the 200-day is "magic". Expecting MAs to catch tops and bottoms (they can't). Using them in sideways markets.
- **Practice**:
  - BUILD: compute a 5-SMA by hand.
  - SLIDER: change n and watch lag.
  - BACKTEST "price > SMA(n)" on (a) GBM, where it should fail after costs, and (b) the regime-switching trending market, where it should help in trends and bleed in ranges.

#### 5.2 Exponential Moving Average (EMA)
- **Def**: a moving average that weights recent prices exponentially more.
- **Identify**: EMA_t = (C_t − EMA_{t−1}) × k + EMA_{t−1}, with k = 2/(n+1). Seed with an SMA. A 10-EMA uses k ≈ 18.18% and a 20-EMA uses k ≈ 9.52%.
- **Claim**: turns earlier than an SMA with less lag.
- **Evidence**: same as the SMA. Signal timing differs only slightly, and there is no robust evidence that an EMA beats an SMA in general.
- **Level**: B. **Prereq**: 5.1.
- **Misuse**: believing the EMA's earlier signals are "better" without accounting for more whipsaws.
- **Practice**: SMA versus EMA on the same series, counting crossovers and whipsaws.

#### 5.3 Weighted MA and adaptive or low-lag averages
- **Def**:
  - **WMA**: linear weights n, n−1, … 1.
  - **HMA (Hull)** = WMA(2·WMA(n/2) − WMA(n), √n).
  - **DEMA** = 2·EMA − EMA(EMA); **TEMA** = 3E1 − 3E2 + E3.
  - **KAMA (Kaufman)**: adapts its speed by an "efficiency ratio".
  - These formulas are standard; they were not re-fetched this session.
- **Identify**: per the formulas above.
- **Claim**: less lag for the same smoothness.
- **Evidence**: no robust evidence of superiority. Less lag implies more noise; there is no free lunch.
- **Level**: I (WMA), A (HMA/DEMA/TEMA/KAMA). **Prereq**: 5.1–5.2.
- **Misuse**: indicator-hopping in search of the "perfect MA".
- **Practice**: "No free lunch" overlay. Plot all of them on a noisy synthetic series and compare lag (bars to turn) against whipsaw count.

#### 5.4 Moving-average crossovers (price cross, double cross, golden/death cross)
- **Def**:
  - **Price cross**: price crosses an MA.
  - **Double cross**: a short MA crosses a long MA. **Golden cross** = 50 crosses above 200; **death cross** = 50 crosses below 200.
  - **Triple cross**: three MAs.
- **Identify**: sign change of (fast − slow). Optional filters: a % band (BLL used 0% and 1% bands), N days of confirmation, and trading only in the direction of the 200-day (StockCharts).
- **Claim**: trend-change signals.
- **Evidence**: see 5.1 (BLL, STW, Bajgrowicz-Scaillet). Crossovers are late by construction and whipsaw in ranges.
- **Level**: B. **Prereq**: 5.1–5.2.
- **Misuse**: headline-trading golden and death crosses in isolation.
- **Practice**: BACKTEST with costs on and off. This is the clearest demonstration of how transaction costs kill marginal rules.

#### 5.5 ADX / DMI (Wilder)
- **Def**: +DI and −DI measure directional movement; ADX measures **trend strength** without direction.
- **Identify** (StockCharts, 14 periods):
  1. +DM = H − H[−1] if it is positive and > (L[−1] − L), else 0. −DM = L[−1] − L if it is positive and > (H − H[−1]), else 0. Inside days give 0.
  2. Wilder-smooth TR, +DM and −DM (the first value is a 14-period sum).
  3. +DI = 100 × sm(+DM)/sm(TR); −DI = 100 × sm(−DM)/sm(TR).
  4. DX = 100 × |+DI − −DI| / (+DI + −DI).
  5. ADX = Wilder average of DX: ((prior × 13) + DX)/14.
- **Claim**:
  - **ADX > 25: strong trend** (Wilder); **< 20: no trend**; 20–25 is a grey zone.
  - DI crossovers give direction. Wilder's system: buy on +DI crossing above −DI with ADX > 25 (many use 20), with the stop at the signal-day low.
  - A rising ADX strengthens the signal.
- **Evidence**: no robust academic evidence for DI crossovers. StockCharts notes ADX "is heavily smoothed and lags" and "can filter out as many good signals as bad". It is useful as a *regime filter* concept.
- **Level**: I. **Prereq**: 5.16 (ATR/TR), 5.0 smoothing.
- **Misuse**: reading ADX as bullish or bearish (it is direction-less). Reacting to ADX falling from 50 as "trend over".
- **Practice**:
  - CLASSIFY regime from ADX alone versus the hidden truth in the regime-switching generator.
  - SLIDER on the threshold, showing the trend-detection precision/recall trade-off.

#### 5.6 MACD (Appel), MACD histogram, PPO
- **Def**: the difference between two EMAs, plus a signal line.
- **Identify**: MACD = EMA12 − EMA26. Signal = EMA9(MACD). Histogram = MACD − Signal. PPO = (EMA12 − EMA26)/EMA26 × 100, which is comparable across instruments.
- **Claim**:
  - Signal-line crossovers.
  - Zero-line crossovers, which equal the 12/26 EMA cross.
  - Divergences.
  - Histogram slope as early momentum change, as in Elder's Triple Screen and Impulse system.
- **Evidence**:
  - No robust evidence for MACD signals per se; it is a variant of MA-crossover rules (5.4).
  - StockCharts: bearish divergences are "common in strong uptrends", and MACD is "not particularly useful for identifying overbought or oversold levels" because it is unbounded.
- **Level**: I. **Prereq**: 5.2, 5.4.
- **Misuse**: comparing MACD values across stocks with different prices. Overbought/oversold readings on MACD. Trading every crossover in chop.
- **Practice**: BUILD MACD from two EMAs (the app animates the subtraction). TAP the signal-line crossovers. BACKTEST.

#### 5.7 Parabolic SAR (Wilder)
- **Def**: a trailing stop-and-reverse level that accelerates with the trend.
- **Identify**:
  - Rising: SAR_t = SAR_{t−1} + AF × (EP − SAR_{t−1}), where EP is the extreme high of the trend.
  - **AF starts at 0.02, increases by 0.02 on each new EP, and is capped at 0.20.**
  - In a rising SAR, the value cannot exceed the lows of the prior two periods. Falling SAR is mirrored.
  - Flip when price crosses the SAR.
- **Claim**: a trend-following always-in system, and a trailing stop.
- **Evidence**: StockCharts notes Wilder estimated markets trend only ~30% of the time, so the SAR "is prone to whipsaws more than half the time". There is no universal setting, and no robust evidence as a stand-alone system.
- **Level**: I. **Prereq**: 3.3, 5.5.
- **Misuse**: using it in ranges. Optimising the step.
- **Practice**: SLIDER on the step and max, watching the whipsaw count. Use SAR as a trailing stop on a simulated position.

#### 5.8 Ichimoku Kinko Hyo (Hosoda)
- **Def**: a five-line system describing trend, momentum and S/R.
- **Identify** (StockCharts; defaults 9/26/52):
  - **Tenkan** = (9-period high + low)/2.
  - **Kijun** = (26-period high + low)/2.
  - **Senkou A** = (Tenkan + Kijun)/2, shifted **+26**.
  - **Senkou B** = (52-period high + low)/2, shifted **+26**.
  - **Chikou** = close shifted **−26**.
  - The cloud (kumo) is the area between Senkou A and B. It is green (bullish) when A > B.
- **Claim**:
  - Price above the cloud is an uptrend; below is a downtrend; inside is flat.
  - TK cross (Tenkan versus Kijun) in the trend direction.
  - A price/Kijun cross.
  - The cloud is future support or resistance.
  - Counter-trend signals are weaker.
- **Evidence**: no robust peer-reviewed evidence found in this research. It is essentially a bundle of Donchian midpoints, i.e. a channel-breakout/trend system. **The Chikou and forward-shifted cloud invite look-ahead mistakes** in backtests.
- **Level**: A. **Prereq**: 5.21 (Donchian), 5.4.
- **Misuse**: treating it as five independent confirmations; they share inputs. Look-ahead in backtests via Chikou.
- **Practice**: BUILD each line step by step from the highs and lows. A "Ichimoku = Donchian midpoints" reveal overlay. TAP TK crosses.

#### 5.9 SuperTrend
- **Def**: an ATR-based trailing band that flips with the trend.
- **Identify** (TradingView):
  - Basic bands = (H+L)/2 ± multiplier × ATR.
  - The final upper band only moves *down* unless the prior close was above it; the final lower band only moves *up* unless the prior close was below it.
  - The line equals the lower band in an uptrend and the upper band in a downtrend.
  - The trend flips on a close beyond the active band.
  - Common settings are ATR 10, multiplier 3, but **platform defaults vary** (TradingView's page lists the inputs without stating defaults).
- **Claim**: a simple trend direction indicator and trailing stop.
- **Evidence**: no robust evidence. TradingView: "there are times when it generates false signals".
- **Level**: I. **Prereq**: 5.16.
- **Misuse**: optimising the multiplier on history.
- **Practice**: SLIDER on the multiplier, comparing stop-out frequency against average trade length.

#### 5.10 Aroon and linear-regression slope (optional trend measures)
- **Def**:
  - **Aroon Up** = 100 × (n − bars since the n-high)/n; **Aroon Down** likewise for lows. Default n = 25 (Chande). StockCharts has a page.
  - **Regression slope / R²** measures trend steepness and consistency.
- **Identify**: per the formulas above.
- **Claim**: identifies new trends early, and measures their quality.
- **Evidence**: no robust evidence.
- **Level**: A. **Prereq**: 5.0.
- **Misuse**: indicator-stacking.
- **Practice**: CLASSIFY trends by R², as a quality score.

---

### Momentum / oscillator family

#### 5.11 RSI (Relative Strength Index, Wilder)
- **Def**: a bounded (0–100) ratio of average gains to average losses.
- **Identify** (StockCharts):
  - RSI = 100 − 100/(1 + RS), with RS = AvgGain/AvgLoss, n = 14.
  - The first averages are simple 14-period means; then (prior × 13 + current)/14.
  - If AvgLoss = 0, RSI = 100.
- **Claim**:
  - **70/30 overbought/oversold** (Wilder). 80/20 for fewer signals. RSI(2) with 80/20 for short-term trading.
  - **Failure swings** (Wilder): a pure-RSI reversal pattern around 30/70.
  - **Divergences.**
  - **Cardwell's positive/negative reversals** (5.36).
  - **Range shift (Constance Brown)**: in bull markets RSI oscillates ~**40–90** with 40–50 as support; in bear markets ~**10–60** with 50–60 as resistance.
  - The centreline (50) is a bias.
- **Evidence**:
  - No robust peer-reviewed evidence that 70/30 crossings predict reversals in general.
  - StockCharts: overbought or oversold "works best when prices move sideways", and in strong trends RSI "can stay overbought or oversold for extended periods".
  - Divergences "can mislead in strong trends".
  - Short-horizon mean-reversion edges (e.g. RSI(2) on equity indices) are popular in practitioner backtests but are **[not verified this session]**.
  - The academic literature has a *short-term reversal* effect (1 week to 1 month) alongside *intermediate-term momentum* (3–12 months). "Overbought" at monthly horizons is therefore, on average, *bullish* (Jegadeesh & Titman 1993).
- **Level**: B (reading) → I (failure swings, ranges, divergences). **Prereq**: 5.0, 3.3.
- **Misuse**: selling because "RSI > 70" in an uptrend. Mixing up RSI with relative strength comparison (6.10).
- **Practice**:
  - BUILD RSI for 15 bars by hand.
  - PREDICT→REVEAL on "RSI > 70" events in trending versus ranging synthetic regimes, showing the outcome split by regime.
  - SLIDER on the period, showing how the number of "overbought" bars changes.

#### 5.12 Stochastic oscillator (Lane): fast, slow, full; StochRSI
- **Def**: where the close sits within the recent high-low range.
- **Identify** (StockCharts):
  - %K = (C − LL_n)/(HH_n − LL_n) × 100, n = 14. %D = SMA3(%K).
  - **Fast**: %K raw, %D = SMA3.
  - **Slow**: %K = SMA3(fast %K), %D = SMA3(slow %K).
  - **Full (14,3,3)**: a parameterised version.
  - Levels 80/20.
  - **StochRSI** = the stochastic formula applied to RSI values (Chande & Kroll).
- **Claim**:
  - Overbought or oversold.
  - Signal-line crosses.
  - Divergences confirmed by a break of 50 or of price S/R.
  - Lane's **bull and bear set-ups** (a set-up is not a signal).
- **Evidence**: no robust evidence. StockCharts: overbought "isn't necessarily bearish", and early signals are "frequent and prone to whipsaw"; the oscillator is best in trading ranges.
- **Level**: B/I. **Prereq**: 5.11.
- **Misuse**: the same as RSI. Treating RSI and Stochastic signals as independent confirmation.
- **Practice**: "Same information?" overlay of RSI, Stochastic, Williams %R and CCI on one panel, showing their correlation.

#### 5.13 CCI (Commodity Channel Index, Lambert)
- **Def**: the deviation of typical price from its mean, scaled by mean deviation.
- **Identify**: TP = (H+L+C)/3. CCI = (TP − SMA20(TP)) / (0.015 × MeanDeviation20). Lambert chose **0.015 so that ~70–80% of values fall within ±100**; the share depends on lookback.
- **Claim**:
  - A move above +100 shows strong price action, the start of an uptrend (used *with* momentum).
  - Extremes beyond ±200 mean revert.
  - Divergences.
  - It is **unbounded**.
- **Evidence**: no robust evidence. StockCharts: "Securities can keep rising after becoming overbought".
- **Level**: I. **Prereq**: 5.11.
- **Misuse**: using fixed ±100 for all assets.
- **Practice**: SLIDER on the lookback, showing the % of values within ±100.

#### 5.14 Williams %R
- **Def**: the inverted stochastic %K.
- **Identify**: %R = (HH_n − C)/(HH_n − LL_n) × −100, n = 14. −20 is overbought and −80 oversold. It equals fast %K − 100.
- **Claim**: as for the stochastic.
- **Evidence**: no robust evidence. It is mathematically redundant with the stochastic.
- **Level**: B (as an "it's the same thing" lesson). **Prereq**: 5.12.
- **Misuse**: using it alongside the stochastic as "confirmation".
- **Practice**: overlay it to prove the identity.

#### 5.15 Rate of Change (ROC) and Momentum
- **Def**: ROC = (C/C_{t−n} − 1) × 100. Momentum = C − C_{t−n}.
- **Identify**: an unbounded oscillator around 0. Common n is 10, 12, 20, 125 or 250.
- **Claim**: positive means up-momentum; zero-line crosses; divergences.
- **Evidence**: **this is the purest form of the one TA idea with strong academic support.** Past 3–12-month return predicts the next months' return:
  - Time-series momentum: **Moskowitz, Ooi & Pedersen 2012**, 58 futures and forwards, 12-month lookback, positive "for every contract examined". The effect persists ~1 year, then partially reverses.
  - Cross-sectional momentum: **Jegadeesh & Titman 1993**, 3–12-month formation and holding periods. Part of the abnormal return dissipates over the following two years.
  - **Hurst, Ooi & Pedersen (2017)**: trend following was profitable consistently over 110 years of data back to 1880.
  - Caveat: Chan, Jegadeesh & Lakonishok (1996), cited on Wikipedia, argue that transaction costs can eliminate excess momentum returns in some implementations.
- **Level**: B (concept) → A (portfolio momentum). **Prereq**: percent change.
- **Misuse**: using 10-bar ROC on 5-minute charts and assuming the academic evidence applies. The horizon matters.
- **Practice**:
  - BACKTEST "12-period ROC > 0" in three generators: GBM (no edge), a momentum-drift market and a mean-reverting (OU) market. The learner sees that the edge exists only if the market has autocorrelation.
  - The link to evidence lessons (§8).

---

### Volatility family

#### 5.16 Average True Range (ATR, Wilder)
- **Def**: the average of the true range, a gap-inclusive volatility measure.
- **Identify**: TR = max(H − L, |H − C[−1]|, |L − C[−1]|). ATR = Wilder average over 14: ((prior × 13) + TR)/14.
- **Claim**:
  - Measures volatility, not direction.
  - Used for stops (k·ATR), position sizing (risk per trade / (k·ATR)), breakout filters (3.12) and Renko/P&F box sizing.
- **Evidence**: ATR is descriptive. Volatility clustering (high volatility follows high volatility) is one of the most robust facts in finance, so ATR *does* forecast near-term volatility reasonably well. This is the solid ground under ATR stops and sizing.
- **Level**: B. **Prereq**: 1.2.
- **Misuse**: comparing ATR across different prices (use ATR%). Treating rising ATR as bullish.
- **Practice**:
  - BUILD TR for bars with gaps.
  - Position-size calculator game: given an account, risk % and ATR stop, find the size.
  - Show volatility clustering in a GARCH-style synthetic market.

#### 5.17 Standard deviation and historical (realised) volatility
- **Def**: the dispersion of returns. Historical volatility (HV) is the annualised standard deviation of log returns.
- **Identify**: HV = stdev(ln(C_t/C_{t−1}), n) × √252 for daily data. Price standard deviation (on prices, as in Bollinger) differs from return standard deviation.
- **Claim**: measures risk, regime and option-pricing inputs.
- **Evidence**: descriptive, and it is predictable in the short run (volatility clustering).
- **Level**: I. **Prereq**: basic statistics. This is CMT Level I "Statistics for Technicians" and "Measuring Historical Volatility".
- **Misuse**: assuming normality. Bollinger: about 90% of closes fall inside ±2σ bands, not 95%, because prices aren't normal.
- **Practice**: BUILD HV from 20 returns. The CMT-style exercise: "a 2% daily expected move ≈ 31.7% annualised volatility" (2% × √252).

#### 5.18 Implied volatility (IV), VIX and historical-versus-implied
- **Def**: IV is the volatility implied by option prices, i.e. the market's forecast. **VIX** is the 30-day implied volatility of the S&P 500 from SPX options.
- **Identify**: back out σ from an option pricing model. Compare with realised volatility.
- **Claim**:
  - IV is usually above subsequently realised volatility. This **volatility risk premium** is covered in CMT Level II.
  - Extreme VIX marks fear and potential bottoms, a sentiment use.
- **Evidence**: the volatility risk premium is a well-documented empirical regularity (not re-verified here). VIX extremes as timing signals have mixed evidence.
- **Level**: A (requires options basics). **Prereq**: 5.17.
- **Misuse**: treating a VIX spike as an immediate buy signal.
- **Practice**: the simulator can quote synthetic options. The learner compares IV with subsequent realised volatility over many episodes.

#### 5.19 Bollinger Bands, %b, BandWidth and the squeeze
- **Def**: an SMA ± k standard deviations of price.
- **Identify**: Middle = SMA20. Upper/Lower = Middle ± 2σ20. %b = (P − Lower)/(Upper − Lower). BandWidth = (Upper − Lower)/Middle, which equals **4× the coefficient of variation** at the defaults.
- **Claim**, John Bollinger's own rules (paraphrased):
  - Price is "high" at the upper band and "low" at the lower band, in *relative* terms.
  - **"Tags of the bands are just that, tags not signals."**
  - In trends, price walks the band.
  - **Closes outside the bands are initially continuation, not reversal, signals.**
  - 20/2 is a starting point; use ~2.1 at 50 periods and ~1.9 at 10.
  - Combine with non-collinear indicators.
  - About **90%** of data falls inside the bands, not 95%.
  - BandWidth identifies **"The Squeeze"**, low volatility before expansion.
  - Use for M tops and W bottoms.
- **Evidence**:
  - Balsara, Chen & Zheng (2007), cited on Wikipedia: contrarian Bollinger, MA and channel rules showed significant returns in Chinese markets after 0.5% costs.
  - Otherwise no robust general evidence.
  - Volatility mean reversion after squeezes is consistent with volatility clustering and mean reversion of volatility.
- **Level**: B (reading) → I (%b, BandWidth, squeeze). **Prereq**: 5.1, 5.17.
- **Misuse**: **the #1 misuse is selling every upper-band tag**, against Bollinger's own rule 6.
- **Practice**:
  - PREDICT→REVEAL on band tags in trending versus ranging regimes.
  - CLASSIFY "walk the band" versus "tag and revert".
  - SLIDER on k, showing the % of closes inside.

#### 5.20 Keltner Channels
- **Def**: an EMA ± multiplier × ATR.
- **Identify**:
  - Modern version (Raschke): EMA20 ± 2 × ATR10.
  - **Original Keltner (1960)**: a 10-day SMA of typical price ± a 10-day SMA of the high-low range.
- **Claim**:
  - Channel direction gives trend.
  - Closes beyond the channel show strong pressure, the start of a trend.
  - In flat markets the bands act as overbought/oversold.
  - Smoother than Bollinger because ATR moves less than σ.
- **Evidence**: no robust evidence.
- **Level**: I. **Prereq**: 5.2, 5.16.
- **Misuse**: confusing it with Bollinger.
- **Practice**: overlay Bollinger and Keltner to see the squeeze (5.23).

#### 5.21 Donchian channels and price channels
- **Def**: the highest high and lowest low of the last n bars (n = 20 is typical), plus the midline.
- **Identify**: Upper = HH_n, Lower = LL_n, using *prior* bars for signals to avoid look-ahead.
- **Claim**:
  - Breakouts of n-bar highs are the core of classic trend-following systems: Donchian's rules, and the "Turtle" 20/55-day breakouts **[not verified this session]**.
  - The midline acts like an Ichimoku line.
- **Evidence**: the trading-range-break rule was among those tested by BLL (1992); see 5.1. Channel breakouts on diversified futures relate to time-series momentum evidence. Single-instrument results are noisy, and costs matter.
- **Level**: I. **Prereq**: 3.6, 3.12.
- **Misuse**: including the current bar in the channel, a look-ahead bug common in student code.
- **Practice**: BACKTEST the 20-bar breakout. Show the "look-ahead bug" version producing fake profits, a great lesson.

#### 5.22 Chandelier exit and volatility stops
- **Def**: a trailing stop at the highest high of the last n bars minus k × ATR (longs). LeBeau's Chandelier uses n = 22 and k = 3; StockCharts has a page.
- **Identify**: per the formula; mirror it for shorts.
- **Claim**: lets winners run while capping giveback relative to volatility.
- **Evidence**: no robust evidence for a specific parameter set. It is a risk-management tool, not a predictor.
- **Level**: I. **Prereq**: 5.16.
- **Misuse**: stops too tight relative to noise.
- **Practice**: SLIDER on k, showing the distribution of exit outcomes.

#### 5.23 TTM Squeeze / Bollinger squeeze
- **Def**: Bollinger Bands contracting *inside* Keltner Channels flags low volatility, before an expected expansion. TTM is John Carter's version; BandWidth at a multi-month low is Bollinger's version.
- **Identify**: Upper BB < Upper KC and Lower BB > Lower KC.
- **Claim**: a big move is coming; the direction comes from a momentum histogram or the breakout.
- **Evidence**: volatility mean reversion is real, so low volatility tends to be followed by higher volatility. **Direction is not predicted by the squeeze itself.** No robust evidence for the specific signal.
- **Level**: I. **Prereq**: 5.19, 5.20.
- **Misuse**: assuming the squeeze predicts direction.
- **Practice**: PREDICT→REVEAL the *size* of the next move versus its *direction* after squeezes. Learners discover that size is predictable and direction isn't.

---

### Volume family

#### 5.24 On-Balance Volume (OBV, Granville 1963)
- **Def**: a cumulative volume line.
- **Identify**: OBV_t = OBV_{t−1} + V if C > C[−1]; − V if C < C[−1]; unchanged otherwise.
- **Claim**: "volume precedes price". Watch OBV trends, breakouts and divergences.
- **Evidence**: no robust evidence for OBV signals. The absolute level is arbitrary, since it depends on the start date.
- **Level**: I. **Prereq**: 1.13.
- **Misuse**: reading the OBV level. One huge-volume day dominates the line.
- **Practice**: BUILD OBV by hand. Then show how one block-trade day dominates it.

#### 5.25 Accumulation/Distribution Line (Chaikin)
- **Def**: a cumulative sum of money-flow volume.
- **Identify**: Money Flow Multiplier (MFM) = [(C − L) − (H − C)]/(H − L), ranging from −1 to +1. Money flow volume = MFM × V. A/D = cumulative sum.
- **Claim**: closes near the high on volume mean accumulation. Watch divergences against price.
- **Evidence**: no robust evidence. **It ignores gaps**: a stock can gap down 10% and still show "accumulation" if it closes in the upper half of its range (StockCharts).
- **Level**: I. **Prereq**: 5.24.
- **Misuse**: treating A/D as "smart money".
- **Practice**: a gap-down-close-high case study, showing A/D rising while price collapses.

#### 5.26 Chaikin Money Flow (CMF)
- **Def**: the windowed version of A/D.
- **Identify**: CMF20 = Σ20(MFM × V) / Σ20(V). Typical range −0.5 to +0.5. Use ±0.05 buffers to filter zero-line whipsaws.
- **Claim**: positive means buying pressure; negative means selling pressure.
- **Evidence**: no robust evidence. It has the same gap blindness as A/D.
- **Level**: I. **Prereq**: 5.25.
- **Misuse / Practice**: as for 5.25.

#### 5.27 Money Flow Index (MFI)
- **Def**: a volume-weighted RSI.
- **Identify**:
  - TP = (H+L+C)/3. Raw money flow = TP × V, positive if TP rose and negative if it fell.
  - MFR = Σ14(positive)/Σ14(negative). MFI = 100 − 100/(1 + MFR).
  - 80/20 are the standard levels; 90/10 are extremes (Quong & Soudack).
- **Claim**: overbought/oversold with volume confirmation; divergences and failure swings.
- **Evidence**: no robust evidence. StockCharts: "Oversold levels alone are not reason enough to turn bullish".
- **Level**: I. **Prereq**: 5.11, 1.13.
- **Misuse**: as for RSI.
- **Practice**: RSI versus MFI overlay.

#### 5.28 VWAP and anchored VWAP
- **Def**: volume-weighted average price since the session open (VWAP), or since a chosen event (anchored VWAP).
- **Identify**: VWAP = Σ(TP × V)/Σ(V), cumulative from the open. It **resets each session** and is "not defined for daily, weekly, or monthly periods" (StockCharts). Anchored VWAP starts at a chosen bar, such as a swing high or low, earnings, or a gap. CMT Level III includes "Anchored VWAP Parts 1–2".
- **Claim**:
  - An **institutional execution benchmark**: buying below VWAP is a "good fill".
  - Price above VWAP gives an intraday bullish bias.
  - Anchored VWAP shows the average cost of participants since an event, acting as S/R.
- **Evidence**: VWAP as an *execution benchmark* is real market practice, and large orders are measured against it. **As a predictive S/R signal: no robust evidence.** The plausible mechanism is coordination by algorithms benchmarking to VWAP.
- **Level**: I (VWAP), A (anchored). **Prereq**: 1.12, 1.13.
- **Misuse**: plotting a session VWAP on daily bars. Over-reading early-session VWAP, which is erratic.
- **Practice**: an execution game. The learner must buy 10,000 shares over a session in the simulator and is scored against VWAP. This teaches its *real* use.

#### 5.29 Relative volume and volume rate of change
- **Def**: current volume relative to normal, e.g. V / SMA50(V), or volume at time of day t versus the average at the same time.
- **Identify**: a ratio.
- **Claim**: unusual volume flags news or institutional activity, and helps confirm breakouts (Bulkowski: heavy breakout volume improved symmetrical-triangle and falling-wedge results).
- **Evidence**: modest support via Bulkowski's pattern statistics. No robust stand-alone evidence.
- **Level**: B. **Prereq**: 1.13.
- **Misuse**: ignoring intraday volume seasonality (the U-shape).
- **Practice**: TAP the unusual-volume bars.

---

### Breadth family (index or market-level; needs a multi-asset synthetic universe)

#### 5.30 Advance-Decline (A/D) breadth line
- **Def**: the cumulative sum of (advancing issues − declining issues).
- **Identify**: daily net advances, cumulated. Also the A/D percent, and the A/D volume line (StockCharts).
- **Claim**: healthy rallies have broad participation. A/D divergence from the index warns of tops.
- **Evidence**: no robust peer-reviewed evidence found in this research. The divergences are mostly anecdotal.
- **Level**: I. **Prereq**: index construction (cap-weighted versus equal-weighted).
- **Misuse**: comparing A/D lines across exchanges with different listing compositions.
- **Practice**: the simulator generates 100 synthetic stocks and an index. Show a narrow rally (5 mega-caps up, the rest down) with a falling A/D line.

#### 5.31 McClellan Oscillator and Summation Index
- **Def**: breadth momentum, described as "the MACD for the AD Line".
- **Identify** (StockCharts):
  - Ratio-adjusted net advances (RANA) = (A − D)/(A + D), often ×1000.
  - McClellan Oscillator = EMA19(RANA) − EMA39(RANA), with smoothing factors 0.10 and 0.05.
  - The **Summation Index** is the running total of the oscillator **[definition not re-verified this session]**.
- **Claim**:
  - Centreline crosses.
  - **Breadth thrusts**: from below −50 to above +50.
  - Divergences.
- **Evidence**: no robust peer-reviewed evidence. StockCharts: volatile, "most of which won't lead to reversals or extended moves".
- **Level**: A. **Prereq**: 5.30, 5.6.
- **Misuse**: over-trading oscillator crosses.
- **Practice**: BUILD from the synthetic universe; mark the thrusts.

#### 5.32 Percent of stocks above a moving average
- **Def**: the % of index members trading above their 50- or 200-day MA.
- **Identify**: a count across constituents.
- **Claim**: extremes (e.g. >80% or <20%) mean overbought/oversold breadth. A crossing of 50% indicates trend participation.
- **Evidence**: no robust evidence found.
- **Level**: I. **Prereq**: 5.1, 5.30.
- **Misuse**: fixed thresholds across regimes.
- **Practice**: a synthetic-universe gauge.

#### 5.33 New highs − new lows (net new highs, High-Low Index, record high %)
- **Def**: the count of 52-week highs minus 52-week lows. The High-Low Index is a 10-day MA of the record-high percent (StockCharts pages).
- **Identify**: counts across constituents.
- **Claim**: expanding new highs confirm an uptrend. Rising lows during an index rally warn.
- **Evidence**: no robust evidence found.
- **Level**: I. **Prereq**: 5.30.
- **Practice**: as for 5.30.

#### 5.34 Other breadth and internals: TRIN (Arms Index), Bullish Percent Index, up/down volume, breadth thrusts
- **Def**:
  - **TRIN** = (Advancers/Decliners)/(Advancing volume/Declining volume). Below 1 is bullish pressure; it is often used contrarian at extremes.
  - **BPI** = the % of stocks on point-and-figure buy signals (Abe Cohen, 1955) **[origin not verified this session]**.
  - **Zweig breadth thrust**: a 10-day EMA of A/(A+D) rising from <0.40 to >0.615 within 10 days **[not verified this session]**.
- **Identify**: per the formulas above.
- **Claim**: these measure the quality of participation and extremes.
- **Evidence**: no robust evidence. Rare signals such as Zweig's have tiny samples.
- **Level**: A. **Prereq**: 5.30, 1.6.
- **Misuse**: drawing conclusions from small samples.
- **Practice**: "How many times has this happened?" counter. Show the sample size next to every breadth "signal".

---

### Divergences and overbought/oversold

#### 5.35 Regular (classic) divergence
- **Def**: price and oscillator disagree at swing extremes, suggesting weakening momentum and a possible **reversal**.
- **Identify** (StockCharts, RSI/MACD/Stochastic pages):
  - **Bullish**: price makes a lower low and the oscillator makes a higher low.
  - **Bearish**: price makes a higher high and the oscillator makes a lower high.
  - Compare oscillator values at the *same bars* as the price swings.
  - Divergences are "more reliable after an overbought or oversold reading" (Wilder via StockCharts).
  - **Confirmation**: a price S/R break, or an oscillator break of 50 or the zero line.
- **Claim**: momentum leads price.
- **Evidence**: **no robust peer-reviewed evidence found.** StockCharts repeatedly cautions:
  - "Strong uptrends can show many bearish divergences before a top."
  - Bearish MACD divergences are "common in strong uptrends".
  - Some divergences produce no reversal.
- **Level**: I. **Prereq**: 3.2 (swings), 5.11/5.6.
- **Misuse**: comparing non-corresponding swings. Trading divergences against strong trends with no confirmation. Seeing them on any oscillator until one "works".
- **Practice**: DRAW the two lines (price swing line and oscillator swing line); the app checks correspondence. PREDICT→REVEAL in trend versus range regimes. A tally of "divergences before the actual top".

#### 5.36 Hidden divergence (and Cardwell's positive/negative reversals)
- **Def**: a divergence suggesting trend **continuation**.
- **Identify**:
  - **Hidden bullish**: price makes a *higher low* while the oscillator makes a *lower low*, in an uptrend.
  - **Hidden bearish**: price makes a *lower high* while the oscillator makes a *higher high*, in a downtrend.
  - **Cardwell's equivalents** (StockCharts RSI page):
    - Positive reversal: the RSI lower low typically falls in the 30–50 area while price makes a higher low.
    - Negative reversal: the RSI higher high typically falls in the 50–70 area while price makes a lower high.
    - Cardwell viewed bearish divergences as more common in bull markets.
  - Definitions follow standard usage. Babypips' and Investopedia's pages could not be fetched this session, so the hidden-divergence definitions were taken from the StockCharts Cardwell description and standard practitioner usage.
- **Claim**: the pullback is ending and the trend resumes.
- **Evidence**: no robust evidence.
- **Level**: A. **Prereq**: 5.35, 3.2.
- **Misuse**: confusing hidden with regular divergence (they imply opposite outcomes). Learners often swap them.
- **Practice**: a CLASSIFY deck of 4 divergence types (regular/hidden × bull/bear) with the immediate rationale shown.

#### 5.37 Failure swings (Wilder)
- **Def**: an RSI-only reversal pattern.
- **Identify**:
  - **Bullish**: RSI drops below 30, bounces above it, pulls back while holding above 30, then breaks its prior high.
  - **Bearish**: the mirror around 70.
  - It ignores price action (StockCharts).
- **Claim**: a momentum reversal.
- **Evidence**: no robust evidence.
- **Level**: A. **Prereq**: 5.11.
- **Practice**: TAP failure swings on the RSI pane.

#### 5.38 Overbought/oversold: misconceptions to teach explicitly
1. **"Overbought" means "has risen a lot relative to its recent range", not "must fall".** Every source fetched (StockCharts RSI, Stochastic, CCI and MFI pages; Bollinger's rules) warns that indicators stay overbought in strong trends.
2. **Regime matters.** Oscillator fades work in ranges and fail in trends. Brown's RSI ranges (40–90 bull, 10–60 bear) show that the oscillator's *band itself* shifts with the trend.
3. **Horizon matters.** The academic literature finds intermediate-horizon momentum (3–12 months: strength persists) and only short-horizon reversal (1 week to 1 month) **[short-term reversal literature not verified this session]**. "Overbought" on a monthly chart has historically been a *bullish* sign on average.
4. **Oscillators are collinear.** RSI, Stochastic, Williams %R, CCI and MFI largely agree; "three oscillators agree" is not three confirmations.
5. **Thresholds are conventions** (70/30, 80/20, ±100), chosen by the inventors for display, not derived from predictive tests.
6. **Teaching device**: a two-panel simulation of the *same RSI rule* in a trending and a ranging synthetic market. Show the win rate flip.

---

## 6. Fibonacci, Elliott, Wyckoff, Gann, harmonics, Market/Volume Profile, relative strength, intermarket

### 6.1 Fibonacci retracements
- **Def**: horizontal levels at fixed ratios of a prior swing, where a pullback is expected to stall.
- **Identify**:
  - Anchor a swing low and a swing high (or the reverse). Levels sit at **23.6%, 38.2%, 50%, 61.8%**, often also 78.6% (√0.618) and 88.6%.
  - The ratios come from Fibonacci sequence quotients: n/(n+1) → 0.618 and n/(n+2) → 0.382.
  - **50% is not a Fibonacci ratio.** It comes from Dow Theory's observation that the averages often retrace half the prior move (StockCharts).
  - StockCharts treats levels as "alert zones" that need confirmation (candles, patterns, oscillators, MAs): "The more confirming factors, the more robust the signal". It notes "there will be failures", and that the 38.2–61.8% zone "covers most cases".
- **Claim**: the market respects "natural" proportions, so pullbacks end near the Fib levels.
- **Evidence**:
  - **No robust evidence.** Batchelor & Ramyar (2005), cited on Wikipedia, found **no significant non-random occurrence of Fibonacci ratios** in Dow Jones cycles.
  - The "38.2–61.8% zone" is almost unfalsifiable, since most pullbacks end between a third and two thirds of the prior move anyway.
  - Any reaction at Fib levels would come from *coordination* (many traders watching the same lines), not mathematics.
  - The subjectivity of the anchor choice multiplies the chance of a "hit".
- **Level**: I. **Prereq**: 3.2 (swings), 3.6, 7.2 (confluence).
- **Misuse**:
  - Re-anchoring until a level "worked".
  - Drawing 3+ Fib grids so some line is always near price.
  - Believing in "golden-ratio" metaphysics.
- **Practice**:
  - DRAW the Fib tool, graded on the anchors.
  - BACKTEST "reversal frequency within ±0.5 ATR of 38.2/50/61.8 versus random ratios (e.g. 41%, 55%, 67%)" on GBM data and on agent data where some agents watch Fibs. This is the honest lesson.

### 6.2 Fibonacci extensions and projections
- **Def**: targets beyond the swing.
  - **Extension** of A→B: levels at 127.2% (√1.618), 161.8% and 261.8% of AB, measured from A.
  - **Projection** (A-B-C): C + k × (B − A), with k = 0.618, 1.0, 1.618.
- **Identify**: 2 anchors (extension) or 3 anchors (projection). The 1.0 projection is the measured move (4.23).
- **Claim**: profit targets at "natural" ratios.
- **Evidence**: no robust evidence. Bulkowski's measured-move data show that leg 2 averages less than leg 1, and that using ~60% of leg 1 hit 60% of the time.
- **Level**: I. **Prereq**: 6.1, 4.23.
- **Misuse**: treating extension levels as magnets.
- **Practice**: DRAW the projection. PREDICT→REVEAL which level price reaches first, tallied over 100 synthetic cases.

### 6.3 Fibonacci clusters (confluence), time zones, fans and arcs
- **Def**:
  - **Clusters**: zones where several Fib levels from different swings coincide.
  - **Time zones**: vertical lines at Fibonacci-numbered bar counts (1, 2, 3, 5, 8, 13, …).
  - **Fans and arcs**: diagonal and curved variants. StockCharts has pages for arcs, fans and time zones.
- **Identify**: overlay multiple grids, then find overlaps within tolerance.
- **Claim**: overlapping levels are "stronger".
- **Evidence**: no robust evidence. Clusters are guaranteed to exist if enough swings are used. Fans and arcs depend on chart **scaling** (an aspect-ratio artefact), the same flaw as Gann angles.
- **Level**: A. **Prereq**: 6.1–6.2, 7.2.
- **Misuse**: the "more lines = more confidence" fallacy.
- **Practice**: a random-price experiment. Pick a random price, then count how many Fib, pivot, MA and round-number lines fall within 0.5 ATR of it. Learners see that "confluence" is nearly always available.

### 6.4 Elliott Wave Principle
- **Def**: R. N. Elliott's (1930s) theory that crowd psychology produces fractal wave patterns. Popularised by Frost & Prechter, *Elliott Wave Principle* (1978), and by Elliott Wave International.
- **Identify**:
  - **Motive (impulse) wave**: 5 waves (1-2-3-4-5) in the trend direction. Waves 1, 3 and 5 are actionary; 2 and 4 are corrective. Sub-waves run 5-3-5-3-5.
  - **Corrective wave**: 3 waves (A-B-C) against the trend. A 5-3 structure is "the minimum requirement" (StockCharts).
  - **Hard rules** for impulses (Wikipedia; StockCharts states the first two the same way):
    1. **Wave 2 never retraces more than 100% of wave 1.**
    2. **Wave 3 is never the shortest of waves 1, 3 and 5.**
    3. **Wave 4 never enters wave 1's price territory**, except in diagonals. StockCharts states a related rule: wave 4 retraces less than 100% of wave 3.
  - **Diagonals**: leading diagonals (in wave 1 or A) and ending diagonals (in wave 5 or C). They are wedge-shaped, and waves 1 and 4 overlap.
  - **Corrective patterns**:
    - **Zigzag** 5-3-5.
    - **Flat** 3-3-5: regular, expanded or running.
    - **Triangle** 3-3-3-3-3 (A-B-C-D-E): contracting, expanding or barrier.
    - **Combinations**: double and triple threes (W-X-Y(-X-Z)).
  - **Guidelines** (tendencies, not rules):
    - **Alternation**: if wave 2 is sharp, wave 4 tends to be sideways, and vice versa.
    - **Extension**: usually one impulse wave is extended (often wave 3 in stocks).
    - **Equality**: when wave 3 extends, waves 5 and 1 tend toward equality.
    - **Channelling.**
    - Typical Fibonacci relations: wave 2 ≈ 50–61.8% of wave 1; wave 3 ≈ 161.8% of wave 1; wave 4 ≈ 38.2% of wave 3. These ratios are standard practitioner guidelines, not verified this session.
  - **Degrees**, from largest to smallest: Grand Supercycle, Supercycle, Cycle, Primary, Intermediate, Minor, Minute, Minuette, Subminuette. Degrees are defined by form, not by size or duration (Wikipedia).
- **Claim**: identifies where in the larger cycle the market is, and therefore targets and invalidation levels.
- **Evidence**:
  - **No robust evidence.** Batchelor & Ramyar (2005) found no special Fibonacci ratios in Dow Jones cycles.
  - **Aronson (2006)**: as popularly practised, Elliott Wave is "not a legitimate theory, but a story". Its flexible rules and nested degrees can fit any history.
  - **Mandelbrot**: wave prediction is "a very uncertain business" in which subjective judgment dominates.
  - Critics note analysts cannot consistently agree where waves begin and end, and "alternate counts" make forecasts unfalsifiable.
  - StockCharts itself says it "is not a trading technique".
  - The CMT curriculum (Level II, "The Elliott Wave Principle Parts 1–2") still teaches it, as a widely used *language*.
- **Level**: A (rules and counting) → E (corrective patterns and degrees). **Prereq**: 3.2, 6.1, §7.
- **Misuse**:
  - Recounting after every surprise.
  - Precise long-range forecasts.
  - Using "wave 3" excitement to justify oversized positions.
- **Practice**:
  - LABEL waves on an *injected* textbook impulse; the auto-grader checks the 3 hard rules.
  - "Rule violation finder": the app shows a count and the learner TAPs the rule it breaks.
  - Honest-mode lab: the app shows a GBM path, the learner produces a valid count, and the app shows 3 other valid counts with opposite forecasts. This is the falsifiability lesson.

### 6.5 Harmonic patterns (Carney; after Gartley 1935)
- **Def**: five-point price structures (X-A-B-C-D) whose legs must satisfy specific Fibonacci ratios. They converge on a **Potential Reversal Zone (PRZ)** at D.
- **Identify**, from HarmonicTrader.com, Scott Carney's own pages:
  - **AB=CD**: CD equals AB in price (and often time). The "alternate" form has CD = 1.27 or 1.618 × AB. It is the base of all harmonics, and Bulkowski's measured move (4.23) is the Western equivalent.
  - **Gartley**:
    - **B at 0.618 of XA** ("the most critical aspect").
    - D at **0.786 XA**; it may slightly exceed this level but should not go beyond X.
    - BC projection 1.27 or 1.618.
    - A distinct AB=CD converges at D.
  - **Bat**:
    - B **< 0.618 XA**, preferably 0.50 or 0.382; 0.50 is ideal.
    - D defined by **0.886 XA**.
    - BC projection at least **1.618** (up to 2.618; 1.618 or 2.0 ideal). A 1.27 BC projection invalidates the pattern.
    - AB=CD usually extended at 1.27.
  - **Butterfly**:
    - B at a **mandatory 0.786 XA**.
    - D at a **1.27 XA** projection ("the most critical number").
    - BC 1.618 ("tame") or 2.0, 2.24 or 2.618 ("extreme").
    - CD often 1.27 or 1.618 × AB.
  - **Crab**:
    - D at **1.618 XA** (the defining PRZ element).
    - BC extreme projections 2.24, 2.618, 3.14 or 3.618.
    - Regular Crab B is 0.382–0.618 XA. The **Deep Crab** uses B at 0.886.
    - Carney notes "sharp price action" and a need for a very small stop loss.
  - **Shark, 5-0 and Cypher**: newer variants. The Shark and 5-0 are Carney's; the Cypher is a third-party pattern **[ratios not verified this session]**.
- **Claim**: high-probability reversals at the PRZ, with tight stops.
- **Evidence**:
  - **No robust peer-reviewed evidence found.**
  - Many free parameters: which X, ratio tolerances, alternate ratios. That makes the patterns highly susceptible to after-the-fact fitting.
  - Carney's own site disclaims that hypothetical performance results have limitations.
- **Level**: E. **Prereq**: 6.1–6.2, 4.23, 7.5.
- **Misuse**:
  - Loosening the tolerances until patterns appear everywhere.
  - Ignoring that the PRZ is a *zone*, so stops beyond it get hit by noise.
- **Practice**:
  - BUILD: drag the X, A, B, C and D points while the app shows live ratios and validates them against the pattern specs.
  - BACKTEST harmonic detections versus random 5-point zigzags with the same leg lengths. Tolerance as a SLIDER shows the detection count exploding.

### 6.6 Wyckoff method
- **Def**: Richard Wyckoff's (1910s–1930s) supply/demand method built on trading ranges, the "Composite Man", and accumulation and distribution schematics.
- **Identify** (StockCharts Wyckoff tutorial):
  - **Three laws**:
    1. **Supply and demand.**
    2. **Cause and effect**: the horizontal P&F count of a range is the "cause"; the subsequent move is the "effect".
    3. **Effort versus result**: volume against price progress.
  - **Composite Man**: a *heuristic*. Study price as if one large operator planned the campaign.
  - **Five-step approach**:
    1. Determine the market's trend.
    2. Pick stocks in harmony with it, with relative strength.
    3. Pick those with sufficient "cause".
    4. Assess readiness using the 9 tests.
    5. Time entry with market turns and use stops.
  - **Accumulation events**:
    - **PS**: preliminary support.
    - **SC**: selling climax.
    - **AR**: automatic rally, which defines the range top.
    - **ST**: secondary test.
    - **Spring**: a dip below the range low that closes back inside; a terminal shakeout is a stronger variant. Springs are *not required*.
    - **Test**: a probe for remaining supply.
    - **SOS**: sign of strength.
    - **LPS**: last point of support.
    - **BU**: back-up, the "jump across the creek" and return (Evans).
  - **Accumulation phases**:
    - **A**: stops the downtrend.
    - **B**: builds the cause.
    - **C**: the spring or test.
    - **D**: demand dominates; LPSs are entries.
    - **E**: markup.
  - **Distribution events**: PSY, BC (buying climax), AR, ST, UT (upthrust), UTAD (upthrust after distribution, not required), SOW (sign of weakness), LPSY (last point of supply). Distribution phases run A–E, ending in markdown.
  - **Nine buying tests** (e.g. downside objective accomplished, volume rises on rallies, higher highs and lows, stronger than the market, upside ≥ 3× risk) and **nine selling tests**.
- **Claim**: reading the footprints of large operators identifies accumulation before markup and distribution before markdown.
- **Evidence**:
  - **No robust peer-reviewed evidence found.** The schematics are idealised, and labels such as "spring" versus "breakdown" are often known only in hindsight.
  - Wyckoff's emphasis on relative strength, trend alignment and a reward/risk ≥ 3 is consistent with better-supported ideas (momentum, risk management).
  - The Composite Man is explicitly a heuristic, not a factual claim about manipulation.
- **Level**: A (events) → E (full phase analysis). **Prereq**: 3.6, 3.13, 1.13, 1.6 (P&F for cause/effect), 6.10.
- **Misuse**:
  - Literal conspiracy thinking about "smart money".
  - Labelling every false break a "spring".
- **Practice**:
  - LABEL Wyckoff events on a *generated* accumulation range. The generator can script SC, AR, ST and Spring exactly.
  - Real-time variant: label events as bars arrive (no hindsight). The app reveals how many "springs" became breakdowns.
  - CLASSIFY: accumulation or distribution?

### 6.7 Market Profile (TPO; Steidlmayer / CBOT)
- **Def**: J. Peter Steidlmayer's CBOT method (1980s) of plotting *time at price*. Each period (typically 30 minutes) is marked with a letter at every price traded, building a sideways histogram for the session.
- **Identify**:
  - **TPO**: time-price opportunity.
  - **Initial Balance (IB)**: the first hour's range.
  - **Point of Control (POC)**: the price with the most activity.
  - **Value Area (VA)**: the central ~**70%** of activity around the POC, ≈ ±1σ.
  - **Day types**: Steidlmayer defined 3, later 4. Dalton's *Mind Over Markets* lists nine (normal, normal variation, trend, double distribution, neutral, non-trend, and others).
  - Practitioner extras: single prints, poor highs/lows, excess and tails. These are *not* in the Wikipedia source.
- **Claim**:
  - Markets auction between value areas.
  - Acceptance or rejection of prices outside value signals the direction.
  - The day type reveals which participants control the market.
- **Evidence**: **no robust evidence.** Wikipedia's critique:
  - A valid profile requires an equilibrium (normal) distribution, which many users ignore.
  - A single day's profile is unreliable (research suggests ≥3 days).
  - Markets have changed since the open-outcry era.
  - Cleared-volume data is rarely available.
  - Time at a price ≠ volume at a price.
  - Day-type reading is subjective.
  - The CMT Level II curriculum includes "Market Profile".
- **Level**: A. **Prereq**: 1.12, 1.13, 3.6, basic distributions.
- **Misuse**: confusing a TPO profile with a volume profile. Rigid day-type labelling.
- **Practice**:
  - BUILD a TPO profile letter by letter from simulated 30-minute ranges.
  - TAP the POC and value-area bounds.
  - PREDICT→REVEAL "open outside value: accepted or rejected?"

### 6.8 Volume profile (volume-at-price)
- **Def**: a horizontal histogram of volume traded at each price over a chosen window: a session, fixed range, visible range or anchored window.
- **Identify**:
  - **POC**: the price with the highest volume.
  - **Value Area**: ~70% of volume around the POC.
  - **HVN / LVN**: high- and low-volume nodes.
  - Profile shapes: P (short-covering or buying), b (long liquidation), D (balanced).
  - The **naked (virgin) POC** is a prior POC not yet revisited.
  - StockCharts' simpler **Volume-by-Price**: equal price zones (default 12) using **closing prices** over the chart window, optionally split into up and down volume.
- **Claim**:
  - HVNs act as S/R ("acceptance"). Price moves quickly through LVNs ("rejection").
  - Naked POCs act as magnets.
- **Evidence**:
  - No robust evidence for the specific claims.
  - Mechanically, high-volume prices are where many participants hold positions, so plausible order-flow effects exist (compare Osler's clustering).
  - StockCharts warns that bars depend on the chart window: "Current bars should not be used to validate past support or resistance", which is a look-ahead problem.
- **Level**: I (concept) → A (profile trading). **Prereq**: 1.13, 3.6, 6.7.
- **Misuse**:
  - Look-ahead: using a profile built with future bars to "explain" past turns.
  - Using close-only profiles to infer intraday nodes.
- **Practice**:
  - The simulator knows *exact* volume at each price, so it can show the real profile next to a close-only approximation.
  - DRAW the value area.
  - BACKTEST "first touch of a prior-session POC" against random levels.

### 6.9 W. D. Gann (brief, critical)
- **Def**: early-20th-century methods mixing geometry, time cycles and astrology: Gann angles (1×1 = one price unit per time unit, 2×1 and so on), the Square of Nine, and anniversary dates.
- **Identify**: angle fans from major highs and lows; the Square of Nine is a spiral number table.
- **Claim**: price and time "square", and angles act as support and resistance.
- **Evidence**:
  - **No robust evidence**, and the methods are partly unfalsifiable.
  - Wikipedia describes the basis as "geometry, astronomy, astrology, time-cycle analysis".
  - No audited track record. Anecdotes (Elder; Larry Williams) say Gann's son reported he "could not support his family by trading" and earned money from courses. These are secondhand.
  - **Geometric flaw**: angles like 1×1 depend on the chart's price/time scaling, so they are not invariant.
- **Level**: E (history and critical thinking only). **Prereq**: 6.1.
- **Misuse**: any live use without testing.
- **Practice**: a "Scale trap" demo. Rescale the axes and watch the "1×1 angle" hit different bars. A critical-thinking card.

### 6.10 Relative strength (comparative), price relative and ratio charts
- **Def**: the performance of one asset relative to another or to a benchmark. **Not RSI.**
- **Identify**:
  - Price relative = P_A / P_B, plotted as a ratio line (StockCharts "Price Relative / Relative Strength").
  - A rising line means A outperforms B.
  - Also: RS rankings (percentile of 3–12-month returns), RS on P&F (CMT Level II), sector rotation.
  - The CMT curriculum covers "Introduction to Relative Strength" and "Relative Strength and its Uses" (Level I), "Advanced Applications" (Level II), and RS-based portfolio construction (Level III).
- **Claim**: buy leaders and avoid laggards. Leaders tend to keep leading.
- **Evidence**: **this is the best-supported concept in this inventory.** Cross-sectional momentum (Jegadeesh & Titman 1993): buying past 3–12-month winners and selling losers earned significant returns over 3–12-month holds, *not* explained by systematic risk, with partial dissipation in years 2–3. This is related to time-series momentum (MOP 2012). Caveats: costs, crashes (momentum crashes, **[not verified this session]**), and crowding.
- **Level**: I (ratio charts) → A (RS portfolios). **Prereq**: 1.11 (log scale), 5.15.
- **Misuse**: confusing it with RSI. Using very short lookbacks, where reversal dominates.
- **Practice**:
  - The synthetic universe has a built-in momentum factor of adjustable strength (0 = none).
  - The learner builds an RS ranking and holds the top decile.
  - Results are shown under factor strength 0 and > 0, plus a transaction-cost slider.

### 6.11 Relative Rotation Graphs (RRG)
- **Def**: Julius de Kempenaer's scatter of securities by **JdK RS-Ratio** (x axis, relative trend) and **JdK RS-Momentum** (y axis). There are four quadrants, Leading, Weakening, Lagging and Improving, and typical clockwise rotation. CMT Level III covers "RRG – Advanced Concepts", and StockCharts has a page.
- **Identify**: the exact formulas are proprietary. The concept is a normalised RS trend and its rate of change.
- **Claim**: visualises sector rotation and rotation timing.
- **Evidence**: no robust evidence for timing. It is a visualisation of RS (6.10).
- **Level**: A. **Prereq**: 6.10.
- **Misuse**: treating the clockwise rotation as deterministic.
- **Practice**: an animated RRG of the synthetic sector universe. PREDICT the next quadrant.

### 6.12 Intermarket analysis (Murphy)
- **Def**: TA of relationships among stocks, bonds, commodities and currencies.
- **Identify** (StockCharts, Murphy):
  - **Inflationary regime** (1970s to the late 1990s): stocks and bonds move together, with bonds turning first; bonds and commodities move inversely; the dollar and commodities move inversely.
  - **Deflationary regime** (from ~1998): stocks and bonds move inversely; stocks and commodities move together.
  - A weak dollar is not bearish for stocks unless commodities surge.
  - Industrial metals track growth, and the metals/bonds ratio is a growth and inflation gauge.
- **Claim**: other markets lead or confirm moves, especially through the business-cycle sequence.
- **Evidence**:
  - Relationships are **regime-dependent and unstable**. StockCharts: they "can have extended periods where they fail", and the stock–bond relationship flipped around 1998.
  - No robust evidence for short-term trading signals.
- **Level**: A. **Prereq**: 6.10, macro basics.
- **Misuse**: treating correlations as fixed laws.
- **Practice**: a multi-asset synthetic world with a hidden regime switch that flips the correlations. The learner detects the switch with rolling-correlation charts.

### 6.13 Cycles and seasonality (brief)
- **Def**: periodic tendencies, e.g. dominant cycles, the presidential cycle and calendar effects. The CMT curriculum covers "Foundations of Cycle Theory", "Common Cycles" and "Analysis of Seasonal Cycles", and treats Elliott Wave under cycle-driven approaches.
- **Identify**: spectral analysis or detrending; calendar averages.
- **Claim**: timing windows.
- **Evidence**: most published seasonal and cycle patterns suffer from data mining and decay after publication. There is no robust *general* evidence for this course's purposes.
- **Level**: E (optional). **Prereq**: 7.4–7.5.
- **Misuse**: finding cycles in noise.
- **Practice**: a "Find the cycle" lab. Run a spectral analysis on pure noise; it still shows peaks.

### 6.14 Sentiment indicators (pointer, brief)
- **Def**: crowd positioning and emotion gauges: put/call ratio, VIX, surveys, COT. StockCharts has put/call and volatility-index pages, and the CMT curriculum covers sentiment from market and external data.
- **Claim**: contrarian at extremes.
- **Evidence**: mixed and not re-verified here. Signals at extremes are rare, so small samples are the issue.
- **Level**: A. **Practice**: a synthetic crowd model in which the sentiment index is generated from agent positioning.

---

## 7. Process skills: multi-timeframe analysis, confluence, confirmation, signal vs noise, backtesting

### 7.1 Multi-timeframe (MTF) analysis
- **Def**: analyse a higher timeframe for trend and context, the trading timeframe for setups, and a lower timeframe for entry timing.
- **Identify**:
  - Use a ratio of roughly 4–6× between timeframes, e.g. weekly → daily → hourly.
  - **Elder's Triple Screen** (Elder, *Trading for a Living*, 1993) **[not verified online this session; Investopedia blocked]**:
    - Screen 1: the trend on a timeframe ~5× longer, e.g. the slope of the weekly MACD histogram or EMA.
    - Screen 2: an oscillator on the trading timeframe to find pullbacks *against* that trend.
    - Screen 3: an entry technique, e.g. a trailing buy-stop above the prior bar's high.
  - StockCharts has the related **Elder Impulse System** page (not fetched).
  - CMT Level II: "Charting Multiple Data Sets and Multiple Data Intervals".
- **Claim**: trade with the higher-timeframe trend to improve the odds. Bulkowski's candle tips say the same: check the weekly chart to identify the trend, and trade bullish candles in primary uptrends.
- **Evidence**: no robust direct evidence. It is plausible as a trend filter, given momentum evidence, but it is also a vector for **timeframe shopping** (bias confirmation).
- **Level**: I. **Prereq**: 1.12, 3.3, 5.1, 5.11.
- **Misuse**: switching timeframes until one agrees. Conflicting signals with no rule for which wins.
- **Practice**: a linked 3-pane view (weekly, daily, hourly) of the same synthetic series. The learner commits to a bias on the higher timeframe, a setup on the middle one and an entry on the lower one. The app enforces a rule hierarchy and scores consistency.

### 7.2 Confluence
- **Def**: multiple independent reasons pointing to the same price, time or direction.
- **Identify**: count the tools that agree within a tolerance, e.g. S/R + 61.8% Fib + 50-day MA + round number.
- **Claim**: "The more confirming factors, the more robust the signal" (StockCharts, Fibonacci page).
- **Evidence**:
  - It only works if the factors are **(a) individually predictive** and **(b) not collinear**. Bollinger's rule 4 warns against combining collinear indicators.
  - With enough tools, almost any price has "confluence" (see 6.3), so confluence is often an illusion of confirmation.
- **Level**: I. **Prereq**: 3.6, 5.x, 6.1.
- **Misuse**: piling up correlated signals. Post-hoc confluence.
- **Practice**: the random-price confluence counter (6.3). A CLASSIFY drill: which factors are independent?

### 7.3 Confirmation versus anticipation
- **Def**: *anticipation* means entering before the signal completes, e.g. at the second peak or before the neckline break. *Confirmation* means waiting for the defining close.
- **Identify**: a defined confirmation event, e.g. a close beyond the neckline or valley, a 3% or ATR filter, or the next candle closing beyond the pattern.
- **Claim**: confirmation raises the hit rate but gives a worse price. Anticipation gives a better price but more failures.
- **Evidence**:
  - Bulkowski: **unconfirmed** twin-peak double tops fail ~**60%** (price keeps rising). Eve & Eve double bottoms carry a ~**48%** chance price keeps falling without confirmation.
  - Candle reversal rates rise when the confirmation candle is part of the pattern: harami 53% → three inside up 65%; engulfing 63% → three outside up 75%.
- **Level**: I. **Prereq**: §4, 3.12.
- **Misuse**: comparing win rates without comparing reward/risk. The right comparison is **expectancy** = p·avgWin − (1−p)·avgLoss − costs.
- **Practice**: a split-screen of the same setups traded both ways in BACKTEST, with an expectancy readout.

### 7.4 Signal versus noise
- **Def**: separating genuine predictive structure from random variation.
- **Identify**, with the tools to teach:
  1. **Base rates**: what happens after *random* entries with the same holding period.
  2. **Sample size and confidence intervals**: with 20 trades at a 60% win rate, the 95% CI is roughly 36–81%, so it is uninformative. Hundreds of independent trades are needed.
  3. **Random-walk demonstrations**: H&S, triangles, divergences and "trends" all appear in GBM.
  4. **Regime awareness**: Wilder thought markets trend only ~30% of the time.
  5. **Fisher Black (1986)**: noise makes testing hard (via Wikipedia).
- **Claim**: most visual "signals" are noise. Edges, where they exist, are small.
- **Evidence**: this is the foundation of every academic result in §8.
- **Level**: B (intuition) → A (statistics). **Prereq**: basic probability. CMT Level I includes "Statistics for Technicians" and "Introduction to Probability".
- **Misuse**: judging a method by a handful of memorable trades.
- **Practice**: "Real or random?" CLASSIFY. Show 6 charts, half real-model and half GBM, and ask which is which. Learners usually can't tell. A coin-flip equity-curve generator then shows how convincing pure luck looks.

### 7.5 Backtesting a TA rule: procedure and pitfalls
- **Def**: simulating a fully specified rule on historical (here, synthetic or held-out) data to estimate its performance.
- **Procedure** for the course:
  1. **Hypothesis and mechanism first.** Why should this work? Which participants are on the other side?
  2. **Fully specify the rule**: entry, exit, stop, sizing, universe and timeframe. If two people code it differently, it isn't specified.
  3. **As-of data only**:
     - no look-ahead (e.g. Donchian channels must exclude the current bar);
     - no repainting indicators (ZigZag, centred MAs, Chikou misuse);
     - swing points confirmed N bars later.
  4. **Realistic costs**: commission, spread, slippage, and fills at real prices (not HA or Renko prices). Bajgrowicz & Scaillet: DJIA rule performance "fully disappears once transaction costs are taken into account".
  5. **Benchmarks**: buy-and-hold, **random entries with the same exposure and holding time**, and the null market. A synthetic simulator can run the rule on *known-null* data.
  6. **Split the data**: in-sample, out-of-sample, walk-forward. Record **every variant tried**.
  7. **Multiple-testing correction**:
     - White's **Reality Check** (Sullivan, Timmermann & White 1999: 7,846 rules).
     - **False Discovery Rate** (Bajgrowicz & Scaillet).
     - **Probability of Backtest Overfitting** via CSCV (Bailey, Borwein, López de Prado & Zhu).
  8. **Robustness**: parameter plateaus rather than peaks, other markets and eras, Monte Carlo resampling of trades, and sub-period stability. Bulkowski's failure rates doubled between the 1990s and the 2000s.
  9. **Forward test**: paper-trade in the simulator on unseen paths.
  10. **Report**: number of trades, exposure, expectancy, payoff ratio, win rate, max drawdown, Sharpe, and *how many configurations were tried*.
- **Pitfalls with evidence**:
  - **Data snooping**: Park & Irwin (2007) reviewed 95 modern studies (56 positive, 20 negative, 19 mixed). Most suffered from data snooping, ex-post rule selection, or problems estimating risk and costs.
  - **Overfitting**: in Bailey et al.'s illustrative example, 100% of the in-sample-optimal Sharpe ratios were positive while about 78% of the out-of-sample Sharpes were negative. In-sample Sharpe ratios between 1 and 3 "tell us nothing".
  - **Non-persistence**: Bajgrowicz & Scaillet found an investor "would not have been able to select ex ante the future best-performing rules".
  - **Out-of-sample decay**: the best BLL-style rules were insignificant on DJIA data for 1987–96 (STW, per a secondary source).
  - Survivorship bias in stock universes, and regime change.
- **Level**: A (core) → E (multiple-testing corrections). A *light* version is taught early, from Intermediate. **Prereq**: 5.0, 7.4, basic statistics.
- **Misuse**: optimise-then-report. Ignoring costs. Testing on the same data used to discover the idea.
- **Practice**:
  - An in-app backtest workbench with guard-rails: a cost slider, a mandatory random-entry benchmark, and an automatic "variants tried" counter that shows a deflated significance estimate.
  - "Overfit challenge": learners optimise a rule on 2 years of synthetic data, then the app reveals 20 unseen years.

### 7.6 Integration: the TA-based trade plan (bridge to the risk module)
- **Def**: TA's most defensible practical role is defining **where you are wrong** (invalidation), **where to take profit** (target or trail) and **how much to risk** (ATR-based size).
- **Identify**: setup → trigger → stop (structure or ATR) → size (risk % / stop distance) → management (trail with chandelier, SuperTrend or structure) → review.
- **Claim**: even without a forecasting edge, structure-based risk control prevents ruin. With a small edge, it lets the edge compound.
- **Evidence**: the arithmetic of position sizing and drawdowns is mathematical, not empirical. Rule-based stops are testable in the simulator.
- **Level**: B → I. **Prereq**: 3.6, 5.16.
- **Practice**: a trade-ticket simulator. Every simulated trade must carry a stop and a size before submission, and the app logs the plan against the outcome for a journal.

---

## 8. Evidence-based framing: what is testable, what is folklore, how to teach honestly

### 8.1 Evidence scorecard

Use these labels in the app as badges on every lesson:
- **Supported**: robust, replicated evidence with known caveats.
- **Mixed**: positive in some periods or markets, fragile after costs or out of sample.
- **Weak / untested**: testable, but no robust evidence found.
- **Folklore / unfalsifiable**: not testable as usually practised.

| Claim / tool | Testable? | Evidence status | Key sources |
|---|---|---|---|
| Trends persist at 3–12-month horizons (time-series momentum, trend following) | Yes | **Supported** | Moskowitz, Ooi & Pedersen 2012 (58 instruments; 12-month signal positive for every contract); Hurst, Ooi & Pedersen 2017 (profitable since 1880) |
| Relative strength: winners keep winning (cross-sectional momentum) | Yes | **Supported** (costs and crashes are caveats) | Jegadeesh & Titman 1993; costs caveat from Chan, Jegadeesh & Lakonishok 1996 (via Wikipedia) |
| Volatility clusters (ATR/σ forecast near-term volatility; squeezes precede expansion in *size*) | Yes | **Supported** (descriptive) | Standard finance stylised fact (not re-verified here) |
| Published S/R levels and round numbers interrupt intraday trends (FX) | Yes | **Supported, small effect** (60.8% vs 56.2% bounce) | Osler 2000; Osler 2001/2003 order clustering |
| Simple MA and range-break rules beat buy-and-hold (equity index) | Yes | **Mixed**: strong 1897–1986 in-sample, weak out of sample, gone after costs | Brock, Lakonishok & LeBaron 1992; Sullivan, Timmermann & White 1999; Bajgrowicz & Scaillet 2008/2012 |
| Classical chart patterns predict | Yes (needs algorithmic definitions) | **Mixed**: incremental information, unclear profits, deteriorating over time | Lo, Mamaysky & Wang 2000; Chang & Osler 1999 (2 of 6 FX pairs); Bulkowski statistics; failure rates doubled in the 2000s |
| Candlestick patterns predict | Yes | **Mixed → weak**: one strong early result, failed replications; most single candles near 50% | Caginalp & Laurent 1998; Marshall, Young & Rose 2006; Bulkowski |
| Oscillator overbought/oversold thresholds predict reversals | Yes | **Weak / untested** (trend-dependent) | StockCharts caveats; momentum literature runs against it at multi-month horizons |
| Divergences predict reversals | Yes | **Weak / untested** | StockCharts warnings (many divergences before tops) |
| Fibonacci ratios are special | Yes | **Weak**: no special ratios in DJ cycles | Batchelor & Ramyar 2005 |
| Pivot points, supply/demand zones, Ichimoku, SuperTrend, PSAR, harmonics, breadth signals | Yes | **Weak / untested** | No robust studies found in this research |
| Volume confirms breakouts | Yes | **Weak–mixed** (better average outcomes with heavy breakout volume in Bulkowski data) | Bulkowski triangle and wedge pages |
| Elliott Wave counts forecast | Barely (alternate counts) | **Folklore / unfalsifiable as practised** | Aronson 2006; Mandelbrot; Batchelor & Ramyar 2005 |
| Gann angles, Square of Nine, astrology | Partially | **Folklore** (scale-dependent geometry; no audited record) | Wikipedia (W. D. Gann) |
| "Composite Man" or "smart money" manipulation narratives | No (as stated) | **Heuristic, not fact** | StockCharts Wyckoff tutorial calls it a heuristic |
| "Price discounts everything", "history repeats" | Philosophical | **Premises, not findings**; debated against the EMH | Wikipedia TA article (Fama 1970; Malkiel; Lo & MacKinlay) |

### 8.2 Why TA *can* work when it works (mechanisms worth teaching)
1. **Coordination and self-fulfilment.** Widely watched levels (round numbers, prior highs, the 200-day, pivots) attract orders. FX survey facts cited by Osler (2000):
   - Technical analysis is a primary or secondary information source for **>90%** of FX market participants in London (Allen & Taylor 1992) and Hong Kong.
   - **25–30%** of FX traders base most trades on technical signals (Cheung & Chinn 1999; Cheung & Wong 1999).
   - Menkhoff (2010) surveyed **692** fund managers in 5 countries. The "vast majority" rely on TA, and at a horizon of weeks it is the *most important* form of analysis.
2. **Order clustering (microstructure).** Take-profits sit at round numbers, so trends reverse there. Stops sit just beyond, so moves accelerate after the break (Osler 2001/2003).
3. **Behavioural biases.** Under-reaction, herding and disposition effects can create momentum; Aronson (2006) argues behavioural finance supports TA. Menkhoff found TA use is most associated with believing psychology drives prices.
4. **Risk premia.** Trend following is often explained as compensation for bearing certain risks, or as "crisis alpha".
5. **Adaptive markets.** Edges decay as they become known. This is consistent with Bulkowski's failure rates doubling in the 2000s and with post-publication decay **[Neely, Weller & Ulrich 2009 on declining FX rule profits: not verified this session]**.

### 8.3 Why TA claims usually fail scrutiny
1. **Data snooping and ex-post selection.** Park & Irwin (2007): 95 modern studies, 56 positive, 20 negative, 19 mixed. Most suffer from snooping, ex-post selection, or hard-to-estimate risk and costs. Fix: Reality Check, FDR, PBO.
2. **Transaction costs.** Bajgrowicz & Scaillet: performance "fully disappears" after costs. Griffioen (via Wikipedia): out-of-sample unprofitable after small costs for US, Japanese and most European indices.
3. **Non-persistence.** The best past rule cannot be identified ex ante (Bajgrowicz & Scaillet persistence tests).
4. **Subjectivity and hindsight.** Patterns, trendlines, waves and "springs" are labelled after the fact. Lo, Mamaysky & Wang call identification "highly subjective", and Osler found that firms disagree on levels (~30% match).
5. **Base-rate neglect and small samples.** Rare patterns (kicker, abandoned baby, three stars in the south, breadth thrusts) have tiny samples.
6. **Measurement bias in practitioner statistics.** "Perfect trades" overstate tradable returns. Reversal % ≠ profitability (bearish engulfing: 79% reversal, rank 91/103).
7. **Regime change.** Relationships flip (Murphy's stock–bond correlation in ~1998), and failure rates change by era.

### 8.4 How to teach TA honestly: design principles for the app
1. **Two cards per tool**: a *Claim card* (what practitioners say) and an *Evidence card* (what tests show, with an evidence badge). Never show one without the other.
2. **Always show the base rate.** Every PREDICT→REVEAL tally shows the learner's hit rate, the pattern's historical rate, and the random-entry baseline side by side.
3. **TA as language plus risk structure, not prophecy.** Its most defensible uses are describing market state (trend, range, volatility), defining invalidation (stops), and sizing positions.
4. **Teach expectancy, not win rate.** Every outcome screen shows R-multiples and costs.
5. **Null-market labs are mandatory.** Every major tool gets one lab on a known-null synthetic market, where it must fail, and one on a market with the relevant structure (momentum, mean reversion, order clustering), where it may work. This teaches *why* an edge would exist.
6. **Label folklore explicitly, without mockery.** Teach Elliott, Gann and harmonics as widely used vocabularies that learners will encounter, with the falsifiability problem made experiential (the alternate-counts lab).
7. **Explain "names lie" cases** (hanging man, inverted hammer, three-line strike, descending triangle) to build data-first habits.
8. **Discuss time decay of edges** (the Bulkowski era change) to inoculate against "this pattern always works".
9. **Disclose that synthetic results ≠ real markets.** The simulator demonstrates principles; real edges must be validated on real data with costs.
10. **Ethics and safety**: no "win-rate" marketing language. Avoid "guaranteed" and "high-probability" without numbers. Show the sample size next to any statistic.

### 8.5 Ready-to-build "evidence experiments" for the simulator
1. **Pattern in noise**: auto-detect H&S, double tops and triangles in 10,000 GBM paths. Plot the post-pattern return distribution against the unconditional one; they should be identical.
2. **Osler replication**: bounce frequency at "published" levels (round numbers, swing levels) versus random levels, in a market whose agents cluster orders at round numbers versus one whose agents don't.
3. **Momentum switch**: the same 12-period ROC rule in GBM, momentum-drift and mean-reverting generators.
4. **Cost erosion**: an MA-crossover rule with a cost slider from 0 to 0.5% per trade. Watch the edge vanish (a Bajgrowicz–Scaillet echo).
5. **Overfit challenge**: optimise 3 parameters on 2 years, then test on 20 unseen years. Show the PBO-style degradation (Bailey et al.).
6. **Confirmation trade-off**: anticipation versus confirmation on double tops, compared by expectancy, not win rate.
7. **Names lie**: candle-pattern tallies whose outcomes contradict the textbook names (using Bulkowski's rates as the generator's calibration in "realistic mode").
8. **Confluence illusion**: random price → count the nearby "levels".
9. **Elliott alternate counts**: one path, multiple valid counts, opposite forecasts.
10. **Real or random**: a classification game.

---

## 9. Suggested progressive ordering for the course

**Design logic:**
- Structure and risk come before signals.
- Vocabulary comes before frameworks.
- Evidence literacy is taught *continuously* (a light version from Module 1, a full backtesting module before advanced frameworks).
- Frameworks with weak evidence come late, framed critically.

### 9.1 Module sequence

| # | Module | Level | Builds on | Core items (section refs) |
|---|---|---|---|---|
| M0 | What TA is and isn't. Randomness intuition. Evidence badges | B | — | 0.3, 7.4 (intuition), 8.1 (preview) |
| M1 | Reading price: line, bar and candle; timeframes; volume; linear vs log | B | M0 | 1.1–1.3, 1.11–1.13 |
| M2 | Trend and structure: swings, HH/HL, Dow Theory, trend definitions | B | M1 | 3.1–3.3 |
| M3 | Levels: S/R zones, role reversal, round numbers, gaps, breakouts and retests | B | M2 | 3.6–3.7, 3.9, 3.11, 3.12 |
| M4 | Risk structure from charts: invalidation, stops, ATR, position sizing, expectancy | B | M2–M3 | 5.16, 7.6, 7.3 (expectancy) |
| M5 | Candle vocabulary I: anatomy, singles, context rules, "names lie" | B | M1–M3 | 2.0, 2.1 |
| M6 | Trendlines and channels; ranges versus trends | B→I | M2–M3 | 3.4–3.5, 3.13 |
| M7 | Moving averages and trend indicators: SMA/EMA/WMA, crossovers, MACD, ADX, PSAR, SuperTrend | I | M2, M4 | 5.0–5.9 |
| M8 | Momentum oscillators: RSI, Stochastic, CCI, %R, ROC; OB/OS misconceptions | I | M7 | 5.11–5.15, 5.38 |
| M9 | Volatility tools: σ/HV, Bollinger, Keltner, Donchian, squeeze, chandelier | I | M4, M7 | 5.16–5.23 |
| M10 | Candle vocabulary II: two- and three-candle patterns, confirmation | I | M5, M3 | 2.2–2.3 |
| M11 | Chart patterns I: double/triple tops and bottoms, H&S, rectangles, triangles, flags, pennants, measured moves | I | M3, M6, M4 | 4.0–4.2, 4.4–4.7, 4.14–4.20, 4.23, 4.26 |
| M12 | Volume analysis: OBV, A/D, CMF, MFI, VWAP, relative volume | I | M1, M8 | 5.24–5.29 |
| M13 | Process: MTF, confluence, confirmation vs anticipation, signal vs noise | I→A | M7–M12 | 7.1–7.4 |
| M14 | **Backtesting and evidence** (full): procedure, costs, overfitting, multiple testing, the academic record | A | M13 | 7.5, §8 |
| M15 | Divergences (regular/hidden), failure swings | A | M8, M14 | 5.35–5.37 |
| M16 | Fibonacci and pivots (with the null-market lab) | I→A | M3, M14 | 6.1–6.3, 3.10 |
| M17 | Chart patterns II: wedges, broadening, diamonds, rounding, cup with handle, high tight flag, BARR, busted patterns | A | M11, M14 | 4.3, 4.8–4.13, 4.16, 4.21–4.22, 4.24–4.25 |
| M18 | Alternative charts: Heikin-Ashi, Renko, P&F (counts), Kagi, three-line break, range/tick/volume bars | I→A/E | M1, M9 | 1.4–1.10 |
| M19 | Auction and volume-at-price: Volume Profile, Market Profile, anchored VWAP | A | M12 | 6.7–6.8, 5.28 |
| M20 | Market-level: relative strength, RRG, breadth, intermarket, sentiment | A | M7, M14 | 6.10–6.12, 6.14, 5.30–5.34 |
| M21 | Wyckoff method | A→E | M3, M12, M18 (P&F), M20 (RS) | 6.6 |
| M22 | Elliott Wave and harmonics (critical treatment); Gann as history; cycles | E | M16, M14 | 6.4–6.5, 6.9, 6.13 |
| M23 | Capstone: design, backtest, forward-test and journal your own rule set on unseen synthetic markets | E | all | 7.5–7.6, §8 |

### 9.2 Dependency notes and rationale
- **Risk (M4) comes before patterns and indicators.** Every later lesson's trade ticket requires a stop and a size, so the plan habit forms early.
- **Candles are split in two (M5, M10).** Singles and context come early as vocabulary; multi-candle patterns come after S/R, because location is what matters.
- **Indicators come after structure.** Oscillators are only meaningful once the learner can tell trend from range (M2, M6). That is why the overbought/oversold misconceptions (5.38) sit in M8.
- **Backtesting (M14) comes before the "weak-evidence" frameworks** (Fibonacci, divergences, Wyckoff, Elliott, harmonics). Learners can then test claims themselves instead of absorbing them.
- **A light evidence thread runs from M0.** Each module ends with a 5-minute "Test the claim" lab: base rate versus pattern on a null market.
- **Alternative chart types are mid-to-late.** They depend on the ATR and volatility concepts (M9) and are prerequisites for Wyckoff cause/effect (P&F counts).
- **Expert content is optional and badged.** Harmonics, Gann, tick and dollar bars, and the rare-candle catalogue live in an "Expert/Encyclopedia" track that is not required for core certification.

### 9.3 Suggested assessment ladder per level
- **Beginner**: recognition (TAP, BUILD, LABEL) at ≥80% accuracy, and plan discipline (100% of trades carry a stop and a size).
- **Intermediate**: PREDICT→REVEAL calibration. The learner's stated probabilities must match outcomes (Brier score) over ≥100 synthetic cases.
- **Advanced**: a backtest report that passes guard-rails (costs, out-of-sample, random benchmark, variants disclosed).
- **Expert**: a capstone rule set with a positive forward-test on unseen paths of the *structured* generator, and correctly *no edge* on the null generator.

---

## 10. Sources

**Search-budget note:** WebSearch was exhausted after 9 queries (a per-turn limit shared by all agents). The remaining research used ~75 direct fetches of primary or authoritative pages. Some PDFs were text-extracted locally with `pdftotext`. Items marked **[not verified this session]** in the text rely on well-known literature that could not be re-fetched.

### 10.1 Practitioner references: StockCharts ChartSchool
Base URL: `https://chartschool.stockcharts.com/table-of-contents/`

| URL | Contribution |
|---|---|
| https://chartschool.stockcharts.com/table-of-contents | Full TOC; located indicator, pattern and breadth pages (Aroon, Chandelier, NR7, TTM Squeeze, RRG, BPI, TRIN, put/call, VIX pages listed but not fetched) |
| …/chart-analysis/candlestick-charts/candlestick-pattern-dictionary | 32 candle definitions (engulfing vs outside reversal, piercing, dark cloud, stars, tasuki, three methods, stick sandwich, doji types) |
| …/market-analysis/dow-theory | Dow tenets, peak-trough reversal rule, 3% filter, criticism and performance study |
| …/chart-analysis/trend-lines | Trendline drawing rules (3rd point confirms, spacing, steepness, internal lines), log vs arithmetic examples |
| …/chart-analysis/support-and-resistance | S/R definitions, zones vs lines, role reversal, breakout confirmation |
| …/chart-analysis/gaps-and-gap-analysis | Gap definitions (common, breakaway, runaway, exhaustion), gap fill, volume, caveats |
| …/technical-indicators-and-overlays/technical-overlays/pivot-points | Standard, Fibonacci and DeMark pivot formulas; timeframe conventions |
| …/chart-analysis/chart-types/heikin-ashi-candlesticks | HA formulas, interpretation, caveats |
| …/chart-analysis/chart-types/renko-charts | Renko construction (fixed/ATR box, close/HL basis), caveats |
| …/chart-analysis/chart-types/kagi-charts | Kagi construction (yin/yang, shoulders/waists), caveats |
| …/chart-analysis/point-and-figure-charts/point-and-figure-basics | P&F overview (X/O columns, signals) |
| …/chart-analysis/point-and-figure-charts/p-and-f-price-objectives | P&F vertical and horizontal count overview |
| …/market-analysis/elliott-wave-analysis-articles/introduction-to-elliott-wave-theory | 5-3 structure, impulse rules, degrees, subjectivity caveat |
| …/market-analysis/wyckoff-analysis-articles/the-wyckoff-method-a-tutorial | Three laws, Composite Man, five steps, accumulation/distribution events and phases, nine buying/selling tests |
| …/chart-analysis/chart-annotation-tools/fibonacci-retracements | Fib derivation, 50% origin (Dow), alert-zone usage, failures |
| …/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential | SMA/EMA formulas, lengths, crossovers, caveats |
| …/technical-indicators-and-overlays/technical-indicators/macd-moving-average-convergence-divergence-oscillator | MACD formulas, signals, unbounded caveat, PPO |
| …/technical-indicators-and-overlays/technical-indicators/average-directional-index-adx | +DM/−DM/DI/DX/ADX steps, 20/25 thresholds, Wilder system, lag caveat |
| …/technical-indicators-and-overlays/technical-overlays/parabolic-sar | SAR formula, AF 0.02/0.02/0.20, Wilder "trend 30% of time" |
| …/technical-indicators-and-overlays/technical-overlays/ichimoku-cloud | Ichimoku formulas (9/26/52, ±26 shifts), signals |
| …/technical-indicators-and-overlays/technical-indicators/relative-strength-index-rsi | RSI formula, 70/30, failure swings, divergences, Cardwell reversals, Brown ranges |
| …/technical-indicators-and-overlays/technical-indicators/stochastic-oscillator-fast-slow-and-full | Fast/slow/full stochastic formulas, Lane set-ups, caveats |
| …/technical-indicators-and-overlays/technical-indicators/commodity-channel-index-cci | CCI formula, 0.015 constant (70–80% within ±100), caveats |
| …/technical-indicators-and-overlays/technical-indicators/average-true-range-atr | TR and ATR definitions, uses, caveats |
| …/technical-indicators-and-overlays/technical-overlays/keltner-channels | Keltner formula (EMA20 ± 2·ATR10), original 1960 version |
| …/technical-indicators-and-overlays/technical-indicators/chaikin-money-flow-cmf | MFM, MFV, CMF formulas; A/D relation; gap caveat |
| …/technical-indicators-and-overlays/technical-indicators/money-flow-index-mfi | MFI formula, 80/20 and 90/10 levels, caveats |
| …/technical-indicators-and-overlays/technical-overlays/volume-weighted-average-price-vwap | VWAP formula, intraday-only, anchored concept, uses |
| …/technical-indicators-and-overlays/technical-overlays/volume-by-price | Volume-by-price construction (closes, 12 zones), look-ahead caveat |
| …/market-indicators/mcclellan-oscillator | McClellan formula (RANA, 19/39 EMAs), thrusts, caveats |
| …/market-analysis/intermarket-analysis | Murphy intermarket relationships, inflation/deflation regimes, caveats |

### 10.2 Bulkowski: thepatternsite.com (pattern and candle statistics)

| URL | Contribution |
|---|---|
| https://thepatternsite.com/ | Site index (chart patterns, candles, rankings) |
| https://thepatternsite.com/FailureRates.html | Failure-rate era change (10%/20%/40% thresholds; 1990s vs 2003–07; 2–4× more failures in the 2000s) |
| https://thepatternsite.com/rank.html | Ranking index |
| https://thepatternsite.com/id84.html | Failure ranks, all chart patterns (bull market; 5% failure definition) |
| https://thepatternsite.com/id75.html | Performance ranks, all chart patterns |
| https://thepatternsite.com/chartpatterns.html | Pattern URL index |
| https://thepatternsite.com/hst.html | H&S top guidelines and statistics |
| https://thepatternsite.com/hsb.html | H&S bottom statistics |
| https://thepatternsite.com/aadt.html | Double top (Adam & Adam); unconfirmed-failure 60% |
| https://thepatternsite.com/eedb.html | Double bottom (Eve & Eve); Adam/Eve definitions; 48% unconfirmed |
| https://thepatternsite.com/tt.html | Triple top |
| https://thepatternsite.com/tb.html | Triple bottom |
| https://thepatternsite.com/roundb.html | Rounding bottom |
| https://thepatternsite.com/cup.html | Cup with handle |
| https://thepatternsite.com/flags.html | Flags |
| https://thepatternsite.com/pennants.html | Pennants |
| https://thepatternsite.com/htf.html | High tight flag |
| https://thepatternsite.com/recttops.html | Rectangle tops (partial rise/decline tells) |
| https://thepatternsite.com/at.html | Ascending triangles |
| https://thepatternsite.com/dt.html | Descending triangles (53% up breakouts) |
| https://thepatternsite.com/st.html | Symmetrical triangles |
| https://thepatternsite.com/risewedge.html | Rising wedges |
| https://thepatternsite.com/fallwedge.html | Falling wedges |
| https://thepatternsite.com/bt.html | Broadening tops |
| https://thepatternsite.com/diamondt.html | Diamond tops |
| https://thepatternsite.com/islandrev.html | Island reversals |
| https://thepatternsite.com/mmu.html | Measured move up |
| https://thepatternsite.com/CandleEntry.html | Candle index (103 types) with URLs |
| https://thepatternsite.com/CandleReverse.html | Top-10 reversal candles with % |
| https://thepatternsite.com/CandlePerformers.html | Top-10 overall candle performers |
| https://thepatternsite.com/CandleTips.html | Candle trading tips (trade with the primary trend) |

Individual candle pages fetched, each giving identification, reversal or continuation %, overall rank and frequency rank:

| URL |
|---|
| https://thepatternsite.com/BullEngulfing.html |
| https://thepatternsite.com/BearEngulfing.html |
| https://thepatternsite.com/Hammer.html |
| https://thepatternsite.com/HangingMan.html |
| https://thepatternsite.com/HammerInv.html |
| https://thepatternsite.com/ShootingStar.html |
| https://thepatternsite.com/HaramiBull.html |
| https://thepatternsite.com/Piercing.html |
| https://thepatternsite.com/DarkCloudCover.html |
| https://thepatternsite.com/MorningStar.html |
| https://thepatternsite.com/EveningStar.html |
| https://thepatternsite.com/ThreeWhiteSoldiers.html |
| https://thepatternsite.com/ThreeInsideUp.html |
| https://thepatternsite.com/AbandonBabyBull.html |
| https://thepatternsite.com/KickingBull.html |
| https://thepatternsite.com/BeltHoldBull.html |
| https://thepatternsite.com/TweezersBottom.html |
| https://thepatternsite.com/LongLegDoji.html |
| https://thepatternsite.com/Gravestone.html |
| https://thepatternsite.com/Dragonfly.html |
| https://thepatternsite.com/WhiteMarubozu.html |
| https://thepatternsite.com/SpinTopWhite.html |
| https://thepatternsite.com/Rising3Methods.html |

### 10.3 Programmatic definitions: TA-Lib source

| URL | Contribution |
|---|---|
| https://raw.githubusercontent.com/TA-Lib/ta-lib/main/src/ta_common/ta_global.c | Default candle thresholds (BodyLong, BodyDoji, ShadowVeryShort, Near, Equal, …) |
| https://raw.githubusercontent.com/TA-Lib/ta-lib/main/src/ta_func/ta_CDLHAMMER.c | Hammer detection logic |
| https://raw.githubusercontent.com/TA-Lib/ta-lib/main/src/ta_func/ta_CDLENGULFING.c | Engulfing logic (equality handling, no trend filter) |
| https://raw.githubusercontent.com/TA-Lib/ta-lib/main/src/ta_func/ta_CDLMORNINGSTAR.c | Morning star logic (penetration 0.3) |

### 10.4 Other indicator and method references

| URL | Contribution |
|---|---|
| https://www.bollingerbands.com/bollinger-band-rules | John Bollinger's 22 rules (tags ≠ signals, 90% containment, multiplier scaling, BandWidth, squeeze) |
| https://www.tradingview.com/support/solutions/43000634738-supertrend/ | SuperTrend calculation and flip rules |
| https://www.babypips.com/pt/forexpedia/camarilla-pivot-points | Camarilla formulas and usage (via search result; Nick Scott 1989) |
| https://www.fxstreet.com/education/trading-stocks-with-camarilla-pivots-201211010000 | Camarilla inputs, R5/R6 (via search result) |
| https://harmonictrader.com/harmonic-patterns/ | Carney's pattern list, disclaimers |
| https://harmonictrader.com/harmonic-patterns/gartley-pattern/ | Gartley ratios |
| https://harmonictrader.com/harmonic-patterns/bat-pattern/ | Bat ratios |
| https://harmonictrader.com/harmonic-patterns/butterfly-pattern/ | Butterfly ratios |
| https://harmonictrader.com/harmonic-patterns/crab-pattern/ | Crab and Deep Crab ratios |
| https://en.wikipedia.org/wiki/Market_profile | Market Profile basics (TPO, IB, POC, 70% value area, day types) and criticisms |
| https://en.wikipedia.org/wiki/Elliott_wave_principle | Elliott rules, degrees; criticism (Aronson, Mandelbrot, Batchelor & Ramyar 2005) |
| https://en.wikipedia.org/wiki/W._D._Gann | Gann methods and criticism |
| https://en.wikipedia.org/wiki/Technical_analysis | TA premises; empirical evidence summary (Park & Irwin, Osler, BLL, STW, LMW, Caginalp, Griffioen, Chan et al., Fama, Malkiel, Aronson, Balsara et al.) |

### 10.5 Curriculum reference

| URL | Contribution |
|---|---|
| https://cmtassociation.org/cmt-program/ | CMT program structure |
| https://cmtassociation.org/cmt-program/learning-objectives/ | Level I/II/III descriptions |
| https://cmtassociation.org/wp-content/uploads/2026/05/2026-CMT-Program-Guide_v2026.03.20.pdf | Full section and learning-objective list, used for course ordering. Topic-weight chart as parsed: L1 ≈ Theory 3%, Classical 38%, Advanced 33%, Application 26%; L2 ≈ Ethics 10%, Theory 3%, Classical 7%, Advanced 40%, Application 40%; L3 mostly application. Also the "3% rule vs ATR multiple" breakout objective; Market Profile, Elliott and anchored VWAP placement |

### 10.6 Academic evidence

| URL | Contribution |
|---|---|
| https://web.mit.edu/Alo/www/Papers/techanal.html | Lo, Mamaysky & Wang (2000) abstract |
| https://www.nber.org/papers/w7613 | LMW working paper record (the PDF is scanned; not text-extractable) |
| https://rpc.cfainstitute.org/-/media/documents/article/cfa-digest/2001/dig-v31-n1-811-pdf.pdf | CFA Digest summary of LMW (10 patterns, Nasdaq, Jegadeesh discussion) |
| https://ideas.repec.org/a/bla/jfinan/v47y1992i5p1731-64.html | Brock, Lakonishok & LeBaron (1992) abstract |
| https://www.fmg.ac.uk/publications/discussion-papers/data-snooping-technical-trading-rule-performance-and-bootstrap | Sullivan, Timmermann & White (1999), via search result |
| https://www.efmaefm.org/0EFMAMEETINGS/EFMA%20ANNUAL%20MEETINGS/2008-Athens/papers/Bajgrowicz.pdf | Bajgrowicz & Scaillet: FDR, persistence, costs (abstract and introduction extracted; STW's 7,846 rules) |
| https://ideas.repec.org/a/bla/jecsur/v21y2007i4p786-826.html | Park & Irwin (2007) record (56/20/19 tally from secondary sources) |
| https://ageconsearch.umn.edu/record/37487/files/AgMAS04_04.pdf | Park & Irwin 2004 review (30–40% practitioner belief in TA at ≤6-month horizons; via search result) |
| https://ideas.repec.org:443/a/eee/jbfina/v30y2006i8p2303-2323.html | Marshall, Young & Rose (2006) record |
| https://www.cxoadvisory.com/technical-trading/candlesticks-fiddlesticks/ | Summary of Marshall et al. (28 signals, DJIA 1992–2002, bootstrap: no value) and Morris critique |
| https://mro.massey.ac.nz/handle/10179/1604 | Marshall PhD thesis (candlestick TA has no value; via search result) |
| https://c.mql5.com/forextsd/forum/210/The%20Predictive%20Power%20of%20Price%20Patterns.pdf | Caginalp & Laurent (1998), mirror copy, via search snippet (S&P 500 1992–96, ~1% over 2 days) |
| https://open.uct.ac.za/items/fecf7820-28a7-4bf9-9919-3cab4b200b43 | JSE replication: only Three Outside Down predictive (via search result) |
| https://www.newyorkfed.org/research/epr/00v06n2/0007osle.html | Osler (2000) abstract |
| https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf | Osler (2000) full text: 60.8% vs 56.2% bounce, ≥5-day persistence, strength ratings useless, >70% of levels end in 0, firm disagreement, survey stats, Chang & Osler H&S result |
| https://www.newyorkfed.org/research/staff_reports/sr125.html | Osler (2001) staff report: stop-loss and take-profit clustering at round numbers |
| https://www.aqr.com/Insights/Research/Journal-Article/Time-Series-Momentum | Moskowitz, Ooi & Pedersen (2012) summary |
| https://www.aqr.com/Insights/Research/Journal-Article/A-Century-of-Evidence-on-Trend-Following-Investing | Hurst, Ooi & Pedersen (2017) summary |
| https://ideas.repec.org/a/bla/jfinan/v48y1993i1p65-91.html | Jegadeesh & Titman (1993) abstract |
| https://ideas.repec.org/a/eee/jbfina/v34y2010i11p2573-2586.html | Menkhoff (2010): 692 fund managers, TA use |
| https://www.davidhbailey.com/dhbpapers/backtest-prob.pdf | Bailey, Borwein, López de Prado & Zhu, "The Probability of Backtest Overfitting" (PBO/CSCV; IS vs OOS Sharpe example) |

### 10.7 Attempted but unavailable (for follow-up)
- Babypips hidden-divergence lesson and School of Pipsology index: HTTP 403.
- Investopedia (all pages): fetch blocked. This includes Elder's Triple Screen and hidden divergence.
- AMS Notices "Pseudo-Mathematics and Financial Charlatanism" (Bailey et al. 2014) and SSRN: HTTP 403. The minimum-backtest-length figures were therefore not quoted.
- The NBER PDF of Lo-Mamaysky-Wang is a scanned image. The exact algorithmic H&S definition in 4.1 is recalled from the paper; **verify it before shipping**.
- Osler (2003, *Journal of Finance*) and Neely, Weller & Ulrich (2009) IDEAS pages: 404. Savin, Weller & Zvingelis (2007) H&S study: 404.
- Further reading to verify in a follow-up session:
  - Aronson, *Evidence-Based Technical Analysis* (2006).
  - Nison, *Japanese Candlestick Charting Techniques*.
  - Bulkowski, *Encyclopedia of Chart Patterns* and *Encyclopedia of Candlestick Charts*.
  - Frost & Prechter, *Elliott Wave Principle*.
  - Dalton, *Mind Over Markets*.
  - Murphy, *Technical Analysis of the Financial Markets* and *Intermarket Analysis*.
  - Elder, *Trading for a Living*.
  - López de Prado, *Advances in Financial Machine Learning*.
  - Harvey, Liu & Zhu (2016) on multiple testing.
  - Neely, Weller & Ulrich (2009) on adaptive FX TA profits.
