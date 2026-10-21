# R6: Trading strategies, styles and asset classes (inventory for a progressive course)

Compiled 2026-10-22 for MARKET//LAB, the Tradelix learning-to-trade module (simulator with synthetic markets and virtual money).
Scope: every trading style, strategy family and asset-class/instrument topic that a complete trader education should cover. Each item has its mechanics, costs and risks, evidence quality, level, prerequisites and a simulator drill.

---

## 0. How to read this document

### 0.1 Research notes and reliability flags
- About 46 web searches and about 20 page fetches. The shared web-search budget ran out before the planned queries on commodity seasonality, covered-call index evidence (Cboe BXM), stock-borrow fees and tax rules could run. Those passages come from prior knowledge and are tagged **[PK, verify]**.
- Every CME Group contract-spec page timed out on fetch. Contract numbers (multipliers, tick values) come from secondary sources plus prior knowledge and are tagged **[verify on CME spec page]**. Check them against the exchange before any figure ships in the app.
- Untagged facts come from the sources in Section 8.

### 0.2 Regulatory changes that make older course material wrong (October 2026)
1. **The US Pattern Day Trader (PDT) rule is gone.** The SEC approved amendments to FINRA Rule 4210 in April 2026 (sources give 14 or 15 April). They removed the PDT designation, the "4 day trades in 5 business days" test, the **$25,000 minimum equity** requirement and day-trading buying power. The replacement is an **intraday margin** regime, where margin is measured against the customer's maximum intraday exposure. Effective date: **4 June 2026**. Brokers have a transition period to **20 October 2027**, so some may still apply the old rules. The course must teach the $25k rule as history plus a transition note. Teaching it as a current constraint would be wrong. (Details in 3.1.)
2. **EU/UK retail CFD rules** (ESMA 2018 product intervention, made permanent by national regulators): leverage caps from 30:1 to 2:1, a 50% margin close-out, negative balance protection, an incentives ban, and a mandatory "X% of retail accounts lose money" warning. Binary options are banned for EU retail clients.
3. **US equities settle T+1** (since May 2024) **[PK, verify]**. Reg SHO close-out deadlines follow T+1.

### 0.3 Level tags
- **B, Beginner:** no prior knowledge needed beyond the earlier modules.
- **I, Intermediate:** needs comfort with charts, sizing, stops and costs.
- **A, Advanced:** needs statistics, backtesting, multi-instrument portfolios or derivatives.
- **E, Expert:** institutional-style. Teach as a concept or demo. The app should not imply retail traders can run these competitively.

### 0.4 Evidence grades
| Grade | Meaning |
|---|---|
| **A** | Robust, peer-reviewed, multi-market and multi-decade, survives out-of-sample tests. It can still have long losing periods. |
| **B** | Peer-reviewed but weakened since publication (decay or crowding), or works only in certain regimes or segments. |
| **C** | Practitioner backtests or working papers, mixed replications, sensitive to parameters and costs. |
| **D** | Anecdotal, unfalsifiable, or not supported when tested. |
| **F** | Negative expectancy built into the structure, or near-certain ruin over the long run. Teach it as a warning. |

General decay benchmark: McLean & Pontiff (J. Finance 2016) studied **97** published return predictors. Portfolio returns were **26% lower out-of-sample** and **58% lower after publication**, which they read as investors learning from the academic papers. Treat any published edge as smaller and more crowded than its paper suggests.

### 0.5 Synthetic regime library (referenced by every simulator drill)
The simulator should generate these on demand and hide the label, so learners have to infer the regime.

| Code | Regime | Suggested generator |
|---|---|---|
| **R0** | Pure random walk, the control | GBM with zero drift and constant vol. No strategy should show an edge here, which is the main overfitting lesson. |
| **R1** | Trending | Drift plus positive return autocorrelation (AR(1) on returns or a momentum term), with persistent regimes |
| **R2** | Mean-reverting / range | Ornstein–Uhlenbeck around a slowly moving level, with soft support and resistance bands |
| **R3** | Volatility clustering | GARCH(1,1) or Markov-switching between low- and high-vol states |
| **R4** | Jumps and gaps | Merton jump-diffusion and overnight gap process (session-based) |
| **R5** | Scheduled event | Calendar of news times. Implied vol builds before the event, a jump of random sign hits at the event, then IV crushes. |
| **R6** | Intraday session | U-shaped volume and volatility, opening range, midday lull, closing auction, optional premarket |
| **R7** | Cointegrated pair | Two series sharing a stochastic trend plus an OU spread, with optional structural-break injection |
| **R8** | Carry with crash | Small steady positive carry plus rare large adverse jumps (negative skew) |
| **R9** | Futures term structure | Spot plus a curve in contango or backwardation, expiries, roll schedule, convergence |
| **R10** | Perpetual swap | Perp price, spot index, premium, and funding every 8h, with leverage, mark price and a liquidation engine |
| **R11** | Order-book microstructure | Limit order book with queues, a mix of noise and informed order flow, bid-ask spread |
| **R12** | Liquidity crisis | Spreads widen, correlations move toward 1, prices gap through stops, margin requirements rise mid-crisis |
| **R13** | Seasonal / calendar | A small calendar drift (turn of month, seasonal commodity pattern) hidden in noise |
| **R14** | Options surface | Black–Scholes or a stochastic-vol pricer with IV term structure, skew and event IV |

Scoring primitives that drills reuse:
- expectancy in R (R = initial risk)
- win rate × average win/loss
- profit factor
- maximum drawdown
- cost drag (costs ÷ gross P&L)
- rule-adherence %
- position-sizing error
- regime-identification accuracy
- "abstain when no edge" accuracy (rewarding no trade in R0)
- Sharpe/Sortino over many simulated runs (Monte Carlo)

---

## 1. Trading styles and time horizons

### 1.1 Overview table
| Style | Typical holding | Decision timeframe | Trades / week | Screen time | Cost sensitivity | Overnight/gap risk | Main psychological demand |
|---|---|---|---|---|---|---|---|
| Scalping | Seconds to minutes | Tick, 1-min, order book | 50 to 1,000+ | Continuous during the session | Extreme (costs can eat most of the gross edge) | None | Fast execution, no hesitation, tolerating many small losses |
| Day trading | Minutes to hours, flat by the close | 1 to 15 min | 5 to 50 | Several hours, fixed windows | High | None (but intraday news jumps) | Discipline under time pressure, accepting "no setup" days |
| Swing trading | 2 days to a few weeks | 1h, 4h, daily | 1 to 10 | 30 to 90 min a day | Moderate | Yes (overnight and weekend gaps) | Patience, holding through noise, no micromanaging |
| Position trading | Weeks to months | Daily, weekly | 0 to 3 | Weekly review | Low (financing and carry matter) | Yes, large | Tolerating long flat or losing streaks (trend-following win rates around 30 to 40%) |
| Investing | Years | Weekly, monthly, fundamentals | Rare | Periodic | Very low | Accepted as part of the return | Ignoring drawdowns, thinking long term, avoiding narrative chasing |

Systematic vs discretionary is a separate axis that combines with every style. Systematic means fixed, testable rules. Discretionary means rules plus judgment. Beginners learn faster with rules, because rules can be scored.

### 1.2 Scalping
- **Definition.** Very short-term trading that captures a few ticks or pips per trade, many times a day. The usual tools are the order book (DOM), tape (time & sales), and microstructure cues such as absorption, spoofing and liquidity pulls.
- **Mechanics.** Entry on order-flow imbalance, a reaction at a key level, or a breakout of a micro-range. Stop of a few ticks. Target of 1 to 2× the stop, or a scratch (exit flat). Execution quality (limit vs market orders, queue position) decides the result.
- **Demands.** Lowest-latency platform, direct-access broker, tight-spread instruments (ES/MES, NQ, EUR/USD, liquid large caps). Commissions must be negotiated per contract or share. Very high concentration.
- **Costs and risks.** Costs are the whole story. A 1-pip spread on a 5-pip target is a 20% haircut before slippage. In practice retail scalpers face professional HFT and market makers who have better latency and information. Overtrading and revenge trading are the typical failure modes.
- **Evidence.** Grade **D/F for retail**. In the Brazil study of futures day traders who persisted more than 300 days, **97% lost money** and only 1.1% earned more than the minimum wage (Chague, De-Losso & Giovannetti). For Taiwanese day traders, **less than 1%** reliably earn positive abnormal returns net of fees (Barber, Lee, Liu & Odean, J. Financial Markets 2014). Scalping as professional market making (Section 2.12) is a different business.
- **Level:** A (as a skill) / B (as a warning about costs). **Prerequisites:** order types, bid/ask, spread, tick value, cost math.
- **Simulator drill.** R11 order book at 1-second resolution. The learner places limit or market orders around a level over 200 decisions. Scoring: gross vs net P&L, cost drag %, average adverse excursion. Comparing the same trades under a 0-cost and a realistic-cost setting is the key moment.

### 1.3 Day trading
- **Definition.** Opening and closing positions within the same session. No overnight exposure.
- **Mechanics.** Pre-market preparation (news, gaps, "stocks in play", key levels such as the prior day's high, low and close, VWAP, opening range), a playbook of 2 to 4 setups (ORB, VWAP reversion or continuation, gap-and-go, gap fill, trend-day pullbacks), a daily loss limit, and a hard flat time before the close.
- **Demands.** Fixed availability during the most liquid hours. The US cash open 09:30 to 11:30 ET and the London–New York FX overlap 08:00 to 12:00 ET are the most liquid windows. Margin capital: in the US, **since 4 June 2026 the $25k PDT minimum no longer applies**, but brokers enforce intraday margin and may still apply the old rules during the transition to 20 Oct 2027. In the EU, CFDs and futures are the common vehicles.
- **Costs and risks.** Frequent costs, slippage at the open and on news, overtrading, hindsight bias, high variance of daily P&L. Leverage turns small errors into account-ending drawdowns.
- **Evidence.** Grade **C/D for retail populations** (see 1.2). Some setups have documented intraday patterns. One is "market intraday momentum": the first half-hour return predicts the last half-hour (Gao, Han, Li & Zhou, JFE 2018) **[PK, verify]**. The ORB evidence is in 2.2.2, and its edge is close to costs.
- **Level:** I to A. **Prerequisites:** sessions, order types, ATR, VWAP, sizing per R, daily loss limits, cost model.
- **Simulator drill.** R6 intraday session days (mixed trend, range and news days). The learner runs a 20-day "trading month" with a written plan, a daily loss limit and a forced flat time. Scoring: net expectancy, plan adherence, breaches of the daily loss limit (a breach ends the day automatically), and quality of the post-session journal.

### 1.4 Swing trading
- **Definition.** Capturing one "swing" (an impulse or a pullback leg) over days to weeks, mostly on daily and 4h charts.
- **Mechanics.** Scans after the close (trend filter, then pullback or breakout setup). Orders are placed in advance (stop-entry or limit), with a stop beyond the structure. Exits by target, trailing stop or time stop. Risk per trade is usually 0.5 to 1% of equity.
- **Demands.** Compatible with a day job. Needs tolerance for overnight and weekend gaps and the discipline not to watch intraday noise.
- **Costs and risks.** Gap risk (earnings, macro news), overnight financing on CFDs and FX swaps, short borrow fees, and concentration in correlated names.
- **Evidence.** Depends on the underlying family. Momentum and trend (A/B), short-horizon reversal (B, decaying), pattern setups (C).
- **Level:** B to I. **Recommended first style for the course:** slower decisions, forgiving of execution errors, costs that stay modest.
- **Simulator drill.** Daily bars across R1, R2 and R4, with time compressed. The learner places end-of-day orders only (no intraday peeking). Scoring: R-expectancy, gap losses beyond the stop (did sizing account for gaps?), adherence.

### 1.5 Position trading
- **Definition.** Holding trend or macro positions for weeks to months, often across asset classes (the classic CTA / Turtle style).
- **Mechanics.** Long-lookback signals (50 to 200-day breakouts or moving averages, 12-month momentum), volatility-based sizing (ATR or target vol), wide trailing exits, portfolio heat limits, diversification across 10 to 50+ markets.
- **Demands.** Capital for diversification (micro futures help), carry and financing awareness (futures rolls, FX swap, CFD funding), very high tolerance for long flat periods and win rates of 30 to 40%.
- **Costs and risks.** Roll costs, financing, whipsaw years, correlated drawdowns, and the psychological difficulty of giving back open profit.
- **Evidence.** **A** for diversified time-series momentum (Moskowitz, Ooi & Pedersen 2012; Hurst, Ooi & Pedersen, "A Century of Evidence on Trend-Following Investing"). It still has multi-year flat periods (the 2010s were weak for many CTAs **[PK, verify]**).
- **Level:** I to A. **Prerequisites:** ATR, volatility sizing, futures rolls or CFD financing, correlation.
- **Simulator drill.** A 10-year synthetic multi-asset universe (several R1/R2/R3 assets, one R12 crisis). The learner sets the lookback, the exit and risk per unit, then runs the simulation. Scoring: CAGR/MaxDD, worst-year experience, and a "did you abandon the system mid-drawdown" flag.

### 1.6 Investing vs trading
- **Investing:** buying assets for their long-run expected return (equity risk premium, dividends, coupons), usually diversified and low-turnover, using passive index funds or fundamental selection. Its main risks are drawdown tolerance and behaviour gaps (buying high, selling low).
- **Trading:** seeking returns from price changes over shorter horizons by exploiting a specific edge. Gross returns before costs are roughly zero-sum relative to the market, and negative-sum after costs.
- **What the course must say.** Buy-and-hold of a broad index (or DCA) is the **benchmark** every trading strategy must beat after costs and taxes, adjusted for risk and time. Most retail traders do not beat it (CFD loss rates of 74 to 89% in ESMA's 2018 analysis; the day-trader studies above). Trading is a skill business with high failure rates. Investing is the default way to build wealth.
- **Level:** B. **Simulator drill.** In every module, show a "benchmark ghost": the passive buy-and-hold equity curve of the same synthetic market next to the learner's curve.

### 1.7 Algorithmic / systematic trading (orthogonal axis)
- **Definition.** Rules coded into a system, backtested, forward-tested and executed automatically or semi-automatically.
- **What it demands.** Data hygiene (survivorship bias, split and dividend adjustment), realistic cost models, walk-forward and out-of-sample testing, multiple-testing awareness, monitoring for decay.
- **Evidence on overfitting.** On classic technical rules, the large backtest gains of Brock, Lakonishok & LeBaron (1992) did not survive data-snooping-adjusted tests out of sample (Sullivan, Timmermann & White 1999) **[PK, verify]**.
- **Level:** A. **Simulator drill.** A "strategy lab". The learner tunes parameters on an in-sample R0 random walk, sees fake edges appear, then tests out of sample and watches them vanish. Score: the gap between in-sample and out-of-sample Sharpe, and whether the learner predicted it.

---

## 2. Strategy families

Each entry: **Def**, **Rules** (setup, entry, stop, exit, filters), **Regime** (where it works and where it fails), **Costs/risks**, **Evidence**, **Level / prereqs**, **Sim drill**.

### 2.1 Trend following
#### 2.1.1 Moving-average trend following (crossover / price vs MA)
- **Def.** Hold long while a fast average is above a slow average (or price is above an MA) and short (or flat) otherwise.
- **Rules.** Examples: 50/200-day SMA cross ("golden/death cross"), or price vs the 200-day SMA, or 20/50 EMA. Entry on the close after the cross. Initial stop at an ATR multiple (2 to 3× ATR) or at the opposite cross. Exit on the opposite cross or a trailing ATR stop. Filters: ADX above 20 to 25, slope of the slow MA, volatility regime.
- **Regime.** Works in persistent trends (R1). Fails in choppy ranges (R2), where lag causes repeated whipsaws, and on V-shaped reversals.
- **Costs/risks.** Many small losses and few large wins, so the win rate is usually 30 to 45%. Lag gives back open profit. Turnover is moderate.
- **Evidence.** **B** for single-asset equity-index MA timing: mainly drawdown reduction, return edge contested after costs. Brock, Lakonishok & LeBaron (1992) found predictive power in MA and range-breakout rules on the DJIA 1897–1986, but the effect weakened after data-snooping adjustment and in later periods **[PK, verify]**. **A** when applied as diversified time-series momentum (2.6.2).
- **Level:** B. **Prereqs:** candlesticks, MA, ATR.
- **Sim drill.** Alternate R1 and R2 episodes. The learner chooses fast/slow lengths, then the market regime switches. Score: P&L by regime, number of whipsaws, and the learner's regime call before seeing results.

#### 2.1.2 Channel / price-structure trend following
- **Def.** Trade in the direction of higher highs and higher lows (or lower highs and lower lows), using swing structure or a regression or Donchian channel.
- **Rules.** Trend is defined by market structure. Enter on a break of the latest swing high (in an uptrend), or on a pullback (2.3). Stop below the last higher low. Trail under each new higher low.
- **Regime.** R1. Fails in R2 and in volatility spikes (R3, R12).
- **Evidence.** C (discretionary definition). It is a building block for most setups.
- **Level:** B. **Sim drill.** The learner marks swing points on unlabeled charts and the system scores labeling accuracy against the generator's true regime.

### 2.2 Breakout strategies
#### 2.2.1 Donchian channel / Turtle Trading system
- **Def.** Buy (sell) when price exceeds the highest high (lowest low) of the last N days. Turtle Trading is the most famous complete rule set built on it. Richard Dennis taught it in 1983–84 to 23 recruits to settle a bet with William Eckhardt that trading could be taught; the group reportedly made about $175M in aggregate over roughly 5 years.
- **Rules (original Turtle, per Curtis Faith's "Original Turtle Trading Rules"; secondary sources plus [PK, verify]).**
  - **Volatility N** = 20-day exponentially smoothed True Range (Wilder smoothing). True Range = max(H−L, |H−prevC|, |prevC−L|).
  - **Unit size** = (1% of account) ÷ (N × dollars per point). One unit moves equity about 1% per 1 N.
  - **System 1:** enter on a 20-day breakout. **Skip** the signal if the previous 20-day breakout signal would have been a winner. If skipped, take the 55-day "failsafe" breakout. Exit on the opposite **10-day** breakout.
  - **System 2:** enter on a 55-day breakout, always taken. Exit on the opposite **20-day** breakout.
  - **Stops:** 2N from entry, so each unit risks 2% of equity. When units are added, all stops move to 2N below the most recent entry.
  - **Pyramiding:** add 1 unit every ½N of favorable movement, max **4 units** per market. Portfolio limits [PK]: 6 units in closely correlated markets, 10 in loosely correlated markets, 12 per direction overall.
  - **Drawdown rule [PK]:** cut the notional account size used for sizing by 20% for each 10% drawdown.
  - Diversified futures portfolio: bonds, FX, metals, energy, softs, grains, stock indices.
- **Regime.** Large, persistent trends across many uncorrelated markets (R1). Fails in range-bound, mean-reverting and choppy markets (many false breakouts), as shown by the Turtle Soup reversal (2.7.3).
- **Costs/risks.** Long losing streaks (win rate around 35 to 40%). Big drawdowns, 20 to 50% for the original high-risk parameters. Slippage on breakout orders (stop orders fill in fast markets). Roll costs. Correlated losses.
- **Evidence.** **A/B.** The underlying effect (time-series momentum) is robust. Wikipedia cites later backtests showing a sharp drop in performance after 1986 and flat results from 1996 to 2009 for the exact original system. The exact parameters are crowded. Keep the concept and treat the 20/55 numbers as one example.
- **Level:** I (single-market Donchian) to A (full portfolio with unit and correlation limits). **Prereqs:** ATR, futures tick value, sizing, correlation.
- **Sim drill.** Twelve synthetic futures markets (mixed R1/R2/R3) with real-looking tick values. The learner computes N and unit size by hand for the first trades (scored for accuracy), then runs the system. Score: sizing accuracy, adherence to the skip rule, "abandonment" flag during drawdowns, final CAGR/MaxDD vs the benchmark ghost.

#### 2.2.2 Opening Range Breakout (ORB)
- **Def.** Define the high and low of the first X minutes of the session (5, 15, 30 or 60) and trade a break of that range in the breakout direction. Toby Crabel popularized it in 1990 ("Day Trading with Short Term Price Patterns and Opening Range Breakout") **[PK]**.
- **Rules (variant tested by Zarattini, Barbon & Aziz 2024, "A Profitable Day Trading Strategy for the U.S. Equity Market").**
  - Universe: "Stocks in Play", i.e. stocks with unusually high activity from news or earnings. The paper's top-20 ranking uses relative volume in the opening minutes plus price, liquidity and ATR filters **[PK, verify exact thresholds in the paper]**.
  - Direction: the direction of the first 5-min candle (long if bullish, short if bearish).
  - Entry: stop order at the opening-range high (long) or low (short).
  - Stop: a fraction of the daily ATR (the paper uses 10% of 14-day ATR **[PK, verify]**).
  - Exit: end of day.
  - Sizing: 1% risk per trade with a leverage cap (4× in the paper **[PK, verify]**).
  - A related index version: stop at the far side of the first candle, target 10R or the close.
- **Reported results.** 2016–2023, more than 7,000 US stocks. A portfolio of the top 20 Stocks in Play reportedly made **over 1,600% net, Sharpe 2.81, 36% annualized alpha**, vs about 198% for the S&P 500. The paper also compares 15-, 30- and 60-min ranges.
- **Caution.** The paper is a working paper (not peer-reviewed), with no true out-of-sample period. An independent replication on index CFDs (NQ, SPX, Dow, DAX, FTSE, 2015 to mid-2026) **reproduced the gross edge**, for example NQ at +0.13R with a 23% hit rate. **After spreads and slippage, no market was distinguishable from zero and 4 of 5 were negative.** The first candle carries about 0.1R of directional information, which is roughly the round-trip cost.
- **Regime.** Trend days and catalyst-driven names (R6 with a news catalyst, R4). Fails on range days (false breaks), on low relative volume, and when the opening range is huge relative to ATR.
- **Costs/risks.** Opening spreads and slippage are high. Stop-entry orders fill badly in fast markets. The edge per trade is small relative to costs.
- **Evidence.** **C.** The pattern is real, but whether the trade is profitable depends on costs.
- **Level:** I to A. **Prereqs:** sessions, ATR, R-multiples, slippage modelling.
- **Sim drill.** R6 intraday days with a hidden "in-play" flag (a catalyst raises volatility and directional persistence). The learner chooses the range length, the filter (trade only in-play names) and the cost tier. Score: net R with costs on vs off. The drill should show the result flipping sign as costs rise.

#### 2.2.3 Volatility-contraction breakout (NR7 / inside bar / Bollinger squeeze)
- **Def.** Volatility tends to cycle, so a compression (narrowest range in 7 days (NR7), inside bar, low Bollinger bandwidth) often precedes expansion. Trade the break of the compressed range.
- **Rules.** Setup: NR7, or an inside day, or Bollinger bandwidth at a 6-month low. Entry: stop orders above the high and below the low (OCO bracket). Stop: the opposite side of the compression range. Exit: a 1 to 3R target, a trailing stop, or a time stop of 2 to 5 bars.
- **Regime.** Transitions from R2 to R1 (range to trend). Fails when compression resolves sideways, with repeated false triggers.
- **Costs/risks.** Both-side brackets get whipsawed. Gaps can open beyond the bracket.
- **Evidence.** C. Volatility clustering itself is A-grade (GARCH-type persistence). Directional profitability is weak once costs are counted.
- **Level:** I. **Sim drill.** R3 Markov vol-switching with low-vol phases followed by expansion of random sign. The learner places brackets. Score: expectancy, plus the learner's estimate of the "probability of expansion within 5 bars" compared with the generator's truth (calibration).

#### 2.2.4 Support/resistance level breakout (with volume confirmation)
- **Def.** Trade a decisive close beyond a well-tested horizontal level, ideally on rising volume.
- **Rules.** Level touched 2 or more times. Entry on a close beyond the level (or a retest that holds). Stop back inside the range. Target a measured move (the range height projected from the break).
- **Regime.** R2 to R1 transitions. Fails on "fake-outs", the stop-hunts that the Turtle Soup setup trades in the opposite direction.
- **Evidence.** C/D. The level is subjective, and it is easy to overstate how good this looks in hindsight.
- **Level:** B to I. **Sim drill.** The learner draws levels before the reveal, then chooses breakout vs fade. Score: the decision against the hidden regime label.

### 2.3 Pullback / continuation
#### 2.3.1 Moving-average pullback in an established trend
- **Def.** In an uptrend, buy temporary dips toward a rising MA or value area rather than chasing highs.
- **Rules.** Trend filter (price above the 50/200 MA, rising slope, higher highs). Wait for a pullback to the 10/20 EMA or to the prior breakout level. Entry on a reversal trigger (close back above the prior bar high, or a bullish engulfing candle). Stop below the pullback low. Target the prior swing high or 2R, then trail.
- **Regime.** R1 with normal corrections. Fails at trend ends, when the "pullback" becomes a reversal.
- **Evidence.** C, as a practitioner staple. It overlaps with documented short-horizon reversal inside a long-horizon momentum effect, which gives it some theoretical support (B).
- **Level:** B to I. **Sim drill.** Several pullbacks per trend in R1. The learner picks the entry and stop. Score: R-expectancy, plus a "chase penalty" when buying more than 2 ATR above the MA.

#### 2.3.2 Holy Grail (Raschke & Connors, *Street Smarts*, 1995)
- **Def.** A strong-trend pullback setup filtered by ADX.
- **Rules.** 14-period **ADX above 30 and rising** (strong trend). Price retraces to the **20-period MA** (sources differ between EMA and SMA). Long entry: buy stop at the high of the bar that touched the MA. Short: sell stop at the low. Stop at the newly formed swing extreme **[PK]**. Initial target: retest of the recent swing high or low, then trail **[PK]**. The book also describes re-entry on a second retracement.
- **Regime.** R1 with strong momentum. Fails in sideways or low-vol markets. The ADX filter lags, so it can trigger late in an exhausted trend and miss slow, gradual trends.
- **Evidence.** C (practitioner).
- **Level:** I. **Prereqs:** ADX, MA, stop orders.
- **Sim drill.** The learner sets the ADX threshold (20/25/30/35). The engine reports trade count vs expectancy, which shows the trade-off between selectivity and frequency.

#### 2.3.3 Flags, pennants and continuation patterns
- **Def.** Short consolidations after a sharp impulse, expected to resolve in the impulse direction.
- **Rules.** Impulse ("pole"), then a tight, low-volume counter-trend channel. Entry on a break of the flag boundary. Stop at the opposite boundary. Target the pole length projected from the breakout (a practitioner rule of thumb).
- **Evidence.** C/D. Pattern statistics are mostly from practitioner encyclopedias. Lo, Mamaysky & Wang (J. Finance 2000) found that some algorithmically defined patterns add incremental information, which is modest support **[PK, verify]**.
- **Level:** B to I. **Sim drill.** Pattern-recognition quiz on synthetic charts where the generator plants true-continuation and false flags at known rates. Score: calibrated confidence (Brier score).

#### 2.3.4 Fibonacci retracements (taught critically)
- **Def.** Expecting pullbacks to stop at 38.2/50/61.8% of the prior leg.
- **Evidence.** **D.** No credible evidence that these ratios are special. Any effect is mostly self-fulfilling clustering or confirmation bias.
- **Level:** B (as a critical-thinking lesson). **Sim drill.** On R0 random walks, show that "Fib bounces" occur at the rate chance predicts.

### 2.4 Mean reversion
#### 2.4.1 Connors RSI(2)
- **Def.** Buy short-term oversold dips inside a long-term uptrend (Connors & Alvarez, *Short Term Trading Strategies That Work*, 2008).
- **Rules.** Filter: close above the **200-day SMA**. Setup: **2-period RSI below 10** (stricter: below 5, which Connors reported had higher subsequent returns). Entry at the close (or next open). Exit when the close crosses back above the **5-day SMA** (variants: RSI(2) above 70). Shorts mirror this: below the 200 SMA, RSI(2) above 90. Connors reported that **stops hurt** this strategy in his tests, which is a key risk-teaching point.
- **Regime.** Equity indices and large-cap ETFs in bull regimes (R1 with negative short-term autocorrelation). Fails in crashes and bear trends, when "oversold gets more oversold" (R12). Without stops, losses are unbounded in principle.
- **Costs/risks.** High win rate (often 65 to 75% in backtests) with occasional large losses (negative skew). Turnover is moderate. Gaps.
- **Evidence.** **C/B.** Many practitioner backtests on US indices. Results are sample-specific, and the short-horizon index mean reversion they rely on varies by era.
- **Level:** I. **Prereqs:** RSI, MA, distribution of returns, skew.
- **Sim drill.** Mixed regimes, including one R12 crash. The learner runs RSI(2) with and without a catastrophic stop. Score: return, MaxDD, worst trade. Then a reflection question: "is a high win rate good?"

#### 2.4.2 Bollinger Band reversion
- **Def.** Buy when price closes at or below the lower band, sell when it reaches the middle band or the upper band.
- **Rules.** Bands: **20-period SMA ± 2σ** (population σ). %b = (price − lower) ÷ (upper − lower). Entry: close below the lower band (%b < 0), optionally with confirmation such as a close back inside the band. Stop: an ATR multiple beyond the entry or a time stop. Exit: the middle band. Filter: avoid it when bandwidth is expanding or ADX is high, since that signals a trend.
- **Regime.** R2 ranges. In R1 trends, price "walks the band".
- **Evidence.** **C.** Lento et al. (2007) found no consistent advantage over buy-and-hold, but positive results for contrarian variants in some markets. Studies find roughly 88% of prices inside the bands, not the 95% a normal distribution implies (fat tails).
- **Level:** B to I. **Sim drill.** The same rules on R1 vs R2. The learner must state in advance which regime they think they are in. Score: P&L conditional on the correct regime call.

#### 2.4.3 VWAP reversion (intraday)
- **Def.** VWAP is the volume-weighted average price since the open and the main institutional execution benchmark. On non-trend days, price tends to oscillate around it.
- **Rules.** On a balanced or range day (no catalyst, opening range inside the prior range): fade moves 1.5 to 2 standard deviations from VWAP, target VWAP, stop beyond the deviation band. On trend days, use VWAP as pullback support instead (2.3).
- **Regime.** Intraday R2. Fails on trend or news days.
- **Evidence.** C. VWAP as an execution benchmark is standard practice. Its use as a trading signal is practitioner-only.
- **Level:** I. **Sim drill.** R6 intraday days drawn from a hidden mix of trend and balance days. The learner classifies the day by 10:30, then trades. Score: day-type accuracy × P&L.

#### 2.4.4 Short-term cross-sectional reversal
- **Def.** Last week's or month's losers outperform winners over the next week or month.
- **Evidence.** **B, decayed.** Lehmann (1990) found weekly reversal, and Jegadeesh (1990) found about 2% per month for the monthly version. Much of it comes from bid-ask bounce and liquidity provision (Nagel 2012). The effect is concentrated in illiquid stocks and smaller after 2000. It is costly to trade because of high turnover.
- **Level:** A. **Sim drill.** Cross-section of 50 synthetic stocks with an injected liquidity-shock reversal. Score: gross vs net after a spread model, which shows that liquidity provision is the edge.

### 2.5 Range trading
- **Def.** Buy near the bottom and sell near the top of a well-defined horizontal range until it breaks.
- **Rules.** Range confirmed by 2 or more touches on each side, flat MAs, ADX below 20. Buy near support with a stop just below, target the opposite side (or midpoint). Short near resistance in mirror. Exit all positions on a confirmed close outside the range.
- **Regime.** R2. Fails at breakouts, which are where the biggest losses come from. Must pair with a rule that flips to breakout when the range breaks.
- **Costs/risks.** Small targets make costs proportionally large. Gaps through stops at range edges.
- **Evidence.** C. Mean reversion in prices exists in some instruments and horizons (FX crosses, intraday). It is regime-dependent.
- **Level:** B. **Sim drill.** An R2 range that breaks into R1 at a random time. Score: profit during the range minus the loss at the break, plus how quickly the learner stopped range trading.

### 2.6 Momentum
#### 2.6.1 Cross-sectional (relative) momentum
- **Def.** Rank assets by past return. Buy the winners and sell or underweight the losers.
- **Rules.** Canonical academic version (Jegadeesh & Titman 1993): formation period J = 3 to 12 months, holding period K = 3 to 12 months, top vs bottom decile, often skipping the latest month ("12-1") to avoid short-term reversal. Rebalance monthly. Retail adaptation: rank a universe of ETFs or sectors, hold the top 3.
- **Regime.** Persistent dispersion between assets. **Momentum crashes** occur in "panic" states after market declines with high volatility, at the moment of the rebound. From March to May 2009 the past-loser decile rose **163%** vs 8% for past winners (Daniel & Moskowitz, JFE 2016). Volatility-scaled momentum roughly doubles the Sharpe in their study.
- **Costs/risks.** Turnover, short-side borrow costs, crash risk, crowding.
- **Evidence.** **A.** Original sample 1965–1989, 3 to 12-month horizons, not explained by systematic risk. It is found across asset classes ("Value and Momentum Everywhere", Asness, Moskowitz & Pedersen 2013 **[PK]**). Part of the profit reverses in years 2 and 3. Decayed but persistent.
- **Level:** A. **Prereqs:** ranking, portfolios, rebalancing, volatility scaling.
- **Sim drill.** 30 synthetic assets with a persistent momentum factor plus one engineered "panic rebound". The learner chooses the lookback, skip month and vol scaling. Score: Sharpe, crash drawdown, turnover cost.

#### 2.6.2 Time-series momentum (absolute momentum / trend)
- **Def.** Go long an asset if its own past 12-month excess return is positive, short or flat if negative.
- **Rules.** Moskowitz, Ooi & Pedersen (JFE 2012): 58 liquid futures (equity indices, currencies, commodities, bonds), long or short each based on the sign of its trailing 12-month excess return, held 1 month, positions **scaled to equal volatility**.
- **Evidence.** **A.** The 12-month strategy was profitable for **every one of the 58 contracts**. Returns persist for 1 to 12 months and partly reverse later (under-reaction, then delayed over-reaction). Hurst, Ooi & Pedersen extend this to 67 markets back to 1880: consistently profitable, best in low-correlation environments, with positive returns in most of the worst 60/40 drawdowns ("crisis alpha", per secondary summaries; verify the figures). Fidelity research attributes the crisis alpha mainly to beta timing. Long multi-year flat periods do occur.
- **Level:** I (single asset, long or flat) to A (vol-scaled multi-asset long/short). Dual momentum (relative plus absolute; Antonacci) is a popular retail variant **[PK]**.
- **Sim drill.** Same as 2.2.1 but with monthly decisions. The learner compares an equal-notional with a vol-scaled portfolio. Score: risk-adjusted return, and how much the high-vol asset contributes to risk.

#### 2.6.3 Intraday / short-term momentum ("stocks in play", relative strength day trading)
- **Def.** On days with a catalyst, stocks with strong relative volume and relative strength vs the index tend to keep moving intraday.
- **Rules.** Scan for gap plus catalyst plus relative volume of 2 to 3× or more. Trade in the direction of relative strength after the opening range or the first pullback to VWAP. Stop at the pullback low. Exit at the close or on loss of VWAP.
- **Evidence.** C. See the ORB caveats. Intraday market momentum (Gao et al. 2018) is B **[PK]**.
- **Level:** I to A. **Sim drill.** Combine with 2.8.1.

### 2.7 Reversal patterns
#### 2.7.1 Head & shoulders, double top/bottom
- **Def.** Classical chart patterns marking trend exhaustion.
- **Rules.** H&S top: left shoulder, higher head, lower right shoulder, neckline through the troughs. Entry on a close below the neckline (or a retest). Stop above the right shoulder. Target the head-to-neckline height projected down (practitioner rule). Double top: two similar highs with a trough between, entry on a break of the trough.
- **Regime.** The end of R1. Patterns "fail" often, and a failed pattern is itself a signal.
- **Evidence.** **C/D.** Lo, Mamaysky & Wang (2000) found some incremental information in certain patterns **[PK]**. Most popular statistics come from non-peer-reviewed sources. Hindsight bias is severe.
- **Level:** B to I. **Sim drill.** Forward-only reveal: the chart advances bar by bar, the learner commits to "pattern / no pattern" before completion. Score: calibration vs the generator's base rates.

#### 2.7.2 Key reversal bars, 80-20 days, exhaustion
- **Def.** Single-bar or two-bar reversal signals: an outside reversal, or a bar that opens at one extreme and closes at the other.
- **Rules (Raschke "80-20s", [PK, verify]).** Prior day opened in the top 20% of its range and closed in the bottom 20%. Today, if price trades 5 to 15 ticks below the prior low, place a buy stop at the prior low, stop at today's low, exit with a trailing stop or same day. The mirror applies for shorts.
- **Evidence.** C.
- **Level:** I. **Sim drill.** The learner writes an exact code-like rule definition and the engine backtests it on R0 and R2 to test whether there is any edge.

#### 2.7.3 Failed breakout / Turtle Soup (Connors & Raschke 1995)
- **Def.** Fade breakouts of 20-day extremes that fail. The name makes fun of the Turtles' breakout system.
- **Rules [PK, verify against Street Smarts].** Today prints a new 20-day low, and the previous 20-day low was at least 4 sessions earlier. When price trades below the old low, place a buy stop 5 to 10 ticks above the earlier 20-day low, valid today only. Initial stop 1 tick below today's low. Manage with a trailing stop. "Turtle Soup Plus One": the same setup, but the reclaim happens the next session. Shorts mirror at 20-day highs.
- **Regime.** R2 or after exhaustion. Fails in real breakouts (R1). It is the exact complement of 2.2.1, which makes the pair an ideal teaching contrast.
- **Evidence.** C.
- **Level:** I. **Sim drill.** "Breakout or fakeout?": the same chart is presented, and in a hidden-regime environment the learner chooses Donchian breakout or Turtle Soup. Score: regime inference accuracy.

#### 2.7.4 Divergences (RSI/MACD vs price)
- **Def.** Price makes a new extreme that the oscillator does not confirm.
- **Evidence.** D/C. Divergence is common and persists through long trends, so it needs a trigger.
- **Level:** B to I. **Sim drill.** A divergence-count game on R1 shows how many divergences appear before the trend actually ends.

### 2.8 Gap strategies
#### 2.8.1 Gap and go
- **Def.** Trade continuation in the direction of a large opening gap driven by a catalyst.
- **Rules (practitioner filters, untested thresholds).** Gap at least 2 to 4% (gaps above 10% carry fade risk). Catalyst (earnings, news). Pre-market volume 5 to 10× normal. Relative volume of 3× or more at the open. Price range $5 to $100. Lower float means faster moves but harder exits. Entry on a break of the pre-market high or of the 1 to 5-min opening range. Stop at the low of the opening range or at VWAP. Exit by scaling out at 1R/2R and trailing.
- **Regime.** R4 gap plus R1 intraday. Fails on gaps without a catalyst or on low relative volume, which tend to fill.
- **Costs/risks.** Wide spreads in small caps, halts (LULD), short-sale restriction days (Rule 201 triggers at a −10% move), slippage, dilution (offerings) in low-float names.
- **Evidence.** C/D (practitioner).
- **Level:** I to A. **Sim drill.** R4 plus R6: a morning gap list of 10 synthetic names with hidden catalyst and relative-volume variables. The learner selects 1 or 2 and trades them. Score: selection quality (did the chosen names trend?) plus execution.

#### 2.8.2 Gap fill / gap fade
- **Def.** Fade the gap back toward the prior close.
- **Rules.** Best candidates: modest gaps, no catalyst, price still inside the prior week's range, low to moderate opening volume. Avoid fading gaps through daily resistance on 3× relative volume, which is a breakout rather than a fill. Exits: partial at a 50% fill, the rest at the prior close.
- **Regime.** R2. Exhaustion gaps after extended moves often fill. Breakaway gaps may never fill.
- **Evidence.** C. Related academic fact: in US equities much of the long-run return has historically accrued **overnight** rather than intraday (Cliff, Cooper & Gulen 2008; Lou, Polk & Skouras 2019) **[PK, verify]**.
- **Level:** I. **Sim drill.** Same gap list as 2.8.1. The learner must choose "go", "fade" or "pass" per name. Score: decision accuracy against the hidden generator.

### 2.9 News and event strategies
#### 2.9.1 Scheduled macro releases (NFP, CPI, FOMC, central-bank decisions)
- **Def.** Trading around high-impact scheduled data.
- **Approaches.**
  - Stand aside and trade the post-release trend once spreads normalize. This is the beginner default.
  - A straddle-style bracket before the release, which is dangerous because of slippage and whipsaw.
  - Fading the first spike.
  - Trading the surprise vs consensus (needs a fast, reliable data feed, so institutional-only in practice).
- **Risks.** Spreads widen sharply, liquidity disappears, stops fill with heavy slippage, two-way whipsaw. Retail FX/CFD brokers may raise margins before events.
- **Evidence.** B for some drift effects. Example: the pre-FOMC announcement drift (Lucca & Moench 2015) was large historically and weaker afterwards **[PK, verify]**. D for retail "news scalping".
- **Level:** I (to stand aside) / A (to trade it). **Sim drill.** An R5 event calendar. The learner chooses flat, pre-positioned, or a post-event entry and sets the stop. The engine models slippage as a function of time since the release. Score: net R, and the cost of slippage vs the edge.

#### 2.9.2 Earnings: post-earnings announcement drift (PEAD)
- **Def.** After earnings surprises, prices keep drifting in the surprise direction.
- **Rules.** Measure the surprise (SUE = actual minus expected EPS, scaled by EPS variability, or the announcement-day return). Buy top-decile surprises and short the bottom decile. Hold about 60 trading days.
- **Evidence.** **B, strongly decayed.** Ball & Brown (1968), Bernard & Thomas (1989): the top-minus-bottom SUE spread was positive in 41 of 48 quarters (1974–1985). The spread fell from about 5% in the 1980s–90s to about 3% or less in the late 2010s. Martineau (2021) finds **no drift in large caps since about 2006**, with drift persisting only in microcaps.
- **Level:** A. **Sim drill.** A cross-section with injected drift whose strength decays over simulated "years". The learner must notice the decay and stop trading it. Score: P&L plus the timing of the abandonment decision.

#### 2.9.3 Earnings options plays (IV crush)
- **Def.** Implied volatility rises into earnings and collapses afterwards. Long straddles must beat the move the market already prices in. Short premium earns the crush but risks gaps. See 4.4.
- **Level:** A. **Sim drill.** R14 plus R5. The learner predicts the implied move (≈ ATM straddle price ÷ underlying) and chooses long or short vol or no trade. Score: P&L vs the implied-move forecast.

#### 2.9.4 Unscheduled headline trading
- **Def.** Reacting to breaking news (geopolitics, tariffs, company-specific).
- **Evidence.** D for retail. Latency means professionals and algorithms trade first. Teach the risk: headline whipsaw and fake news.
- **Level:** B (as a warning). **Sim drill.** Random-sign news shocks. The learner learns that the expected value of reacting late is about zero minus costs.

### 2.10 Carry
- **Def.** Earning the yield differential from holding a higher-yielding asset funded by a lower-yielding one. If prices don't move, carry is the return.
- **Variants and mechanics.**
  - **FX carry:** long the high-rate currency, short the low-rate one (e.g., long AUD/JPY historically). Daily swap is credited or debited at about 5 pm New York time, tripled on Wednesday for the weekend. Brokers mark up the interbank swap rate.
  - **Futures roll yield:** in backwardation, being long earns positive roll as futures converge up to spot. In contango, longs lose roll (2.14 and 3.3).
  - **Bond carry and roll-down:** the coupon minus funding, plus the price gain as a bond "rolls down" an upward-sloping curve.
  - **Crypto basis / funding carry:** long spot plus short perp collects positive funding (3.6).
  - **Options carry:** selling premium, via the volatility risk premium (2.14).
- **Evidence.** **A.** Koijen, Moskowitz, Pedersen & Vrugt ("Carry", JFE 2018): carry predicts returns across global equities, bonds, commodities, currencies, Treasuries, credit and options. Every carry strategy performs poorly in global recessions and liquidity crises, the same periods for all of them. Uncovered interest parity says carry should not pay, but empirically it does, with **crash risk** (negative skew; the 2008 yen carry reversal; the unwind in August 2024 **[PK]**).
- **Regime.** Calm, low-vol, risk-on (R8 without the jump). Fails in sudden risk-off events (R12) when funding currencies (JPY, CHF) spike.
- **Costs/risks.** Swap markups, leverage, negative skew ("picking up pennies in front of a steamroller" is a common phrase, not from the sources).
- **Level:** I (understanding swap) / A (carry portfolios). **Sim drill.** R8: steady carry accrual plus a rare crash. The learner chooses leverage. The engine runs 1,000 Monte Carlo paths. Score: median vs 5th-percentile outcome, and probability of ruin by leverage level.

### 2.11 Pairs trading / statistical arbitrage
- **Def.** Market-neutral relative-value trading on two related securities. Short the outperformer, buy the underperformer, profit if the spread reverts. Pioneered by Bamberger and Tartaglia's group at Morgan Stanley in the 1980s.
- **Rules.**
  - **Distance method (Gatev, Goetzmann & Rouwenhorst, RFS 2006):** 12-month formation period, pairs matched by the minimum sum of squared differences of normalized prices. Open when the spread diverges more than **2 historical standard deviations**. Close at convergence (prices cross) or at the end of the 6-month trading period.
  - **Cointegration method:** test for a stationary spread (Engle–Granger/Johansen), estimate the hedge ratio, model the spread as Ornstein–Uhlenbeck (half-life), enter at a ±2σ z-score, exit at 0, stop at ±3 to 4σ or on a time stop (about 2× the half-life).
- **Regime.** A stable relationship (R7). Fails on structural breaks (M&A, a business-model change, regime shifts), when the spread keeps diverging. Pairs trading performs poorly in some liquidity crises even though it does well in prolonged turbulence.
- **Costs/risks.** Two sets of costs, short borrow, model risk (a fitted relationship that does not persist), crowding (LTCM-style convergence trades in 1998), leg risk on execution.
- **Evidence.** **B, decayed.** Gatev et al.: 1962–2002, up to **11% annualized** excess for self-financing top-20 pairs. Do & Faff (FAJ 2010): mean monthly excess for the top 20 pairs fell **0.86% → 0.37% → 0.24%** (1962–88, 1989–2002, 2003–09). Performance stays strong in turbulent periods. Out-of-sample tests 2004–2009 across markets found no consistent excess returns.
- **Level:** A. **Prereqs:** correlation vs cointegration, z-scores, shorting, hedge ratios.
- **Sim drill.** R7: several candidate pairs, some truly cointegrated and some only correlated, plus one hidden structural break. The learner tests, selects, trades and sets the stop. Score: selection accuracy, P&L, and losses on the broken pair (did the stop or time-stop fire?).

### 2.12 Market making (concept)
- **Def.** Continuously quoting both a bid and an ask, earning the spread (plus exchange rebates) in exchange for providing liquidity.
- **Mechanics.** The two key risks are:
  - **Inventory risk:** accumulated positions lose value if price trends.
  - **Adverse selection:** trading against better-informed flow (Glosten–Milgrom and Kyle models **[PK]**).
  In the Avellaneda–Stoikov (2008) model the "reservation price" shifts against inventory (long inventory leads to lower quotes, encouraging a return to flat). The spread widens with volatility and risk aversion and narrows with order-arrival intensity.
- **Regime.** R2 and high noise-trader flow. Fails in trending markets and on informed flow, news and toxic order flow. The model gives limited protection against strong trends.
- **Evidence.** A, as an economic function. Competitive market making is an institutional business (latency, rebates, co-location). **E** for retail practicality.
- **Level:** A/E (concept). **Sim drill.** R11 order book. The learner sets the quote width and inventory skew while the engine mixes noise and informed flow. Score: spread captured minus adverse selection minus inventory P&L. It shows why market makers widen quotes before news.

### 2.13 Seasonality and calendar effects
- **Def.** Recurring calendar patterns in returns.
- **Inventory.**
  - **Turn of the month (TOM):** in US stocks 1926–2005, the whole market risk premium was earned at turns of the month (roughly the last trading day plus the first 3 days). It holds in 31 of 35 countries and is not explained by volume or flows (McConnell & Xu, FAJ 2008). Grade **B**.
  - **Halloween / "Sell in May":** November–April returns exceed May–October returns in 36 of 37 markets (Bouman & Jacobsen 2002). Later studies on 75 to 108 indices confirm it. The cause is unexplained. Grade **B/C**: large variance, and many years go against it.
  - **January effect, pre-holiday effect, day-of-week:** B/C, mostly decayed **[PK]**.
  - **Commodity seasonality [PK, verify]:** natural gas (winter heating demand vs the spring/summer injection season), gasoline (summer driving season, RVP spec switch), grains (the June–July "weather market" and harvest lows in Sep–Oct for corn and soybeans), heating oil (winter). These come from physical supply and demand and storage. Much of the pattern is already in the futures curve (2.10, 3.3), so the predictable part is less than it looks.
  - **Crypto:** no reliable seasonality. Weekend liquidity effects only.
- **Costs/risks.** Small edge relative to variance. Data mining (every calendar pattern you look for has a chance of appearing). Usually best as a filter or tilt rather than a standalone strategy.
- **Level:** I to A. **Sim drill.** R13: a small hidden calendar drift in some synthetic markets and none in others (R0). The learner tests for significance with proper statistics. Score: correct detection rate and false-positive rate. This drill is also the multiple-testing lesson.

### 2.14 Volatility strategies (concept)
- **Def.** Trading the level or direction of volatility itself, mainly through options, VIX futures or variance products.
- **Inventory.**
  - **Short volatility / volatility risk premium (VRP):** implied volatility exceeds later realized volatility on average. Carr & Wu (RFS 2009) find strongly negative variance risk premiums on indices. Average ATM straddle and delta-hedged option returns are negative, so option sellers are paid on average. The risk is extreme negative skew. **Volmageddon (5 Feb 2018):** VIX went from 17.31 to 37.32 in one session, short-vol ETPs lost more than 90% in a day, and XIV fell from about $1.9B to $63M in assets and was terminated.
  - **Long volatility:** straddles and strangles, VIX calls. It pays in crises and bleeds otherwise. Tail hedging.
  - **VIX futures term structure:** usually in contango, so long VIX ETPs decay over time and short VIX ETPs earn roll until a spike.
  - **Volatility targeting:** scale exposure inversely to recent volatility. Moreira & Muir (2017) is supportive, and later out-of-sample critiques find it weaker **[PK]**. Widely used in trend and momentum strategies (2.6).
  - **Dispersion / correlation trading:** index vol vs single-stock vol. **E**, concept only.
- **Evidence.** VRP: **A** (existence), with crash risk. Vol targeting: B. Retail short-vol products: F-adjacent without strict sizing.
- **Level:** A/E. **Prereqs:** options and Greeks (Section 4).
- **Sim drill.** R14 plus R3 vol-switching. The learner sells or buys 30-day straddles each month with a chosen size. Score: equity curve, max loss in the engineered vol spike, and an expected-shortfall readout.

### 2.15 Grid, martingale and averaging down (why they blow up)
- **Def.**
  - **Martingale:** double the position size after each loss so the first win recovers all losses plus the original stake.
  - **Grid:** place buy and sell orders at fixed intervals around a price, often without stops, adding positions as price moves away.
  - **Averaging down:** adding to losers without a predefined maximum.
- **Why they "work" short-term.** Very high win rate and a smooth equity curve: "tons of small wins, barely any red days" until one strong trend or news event wipes out weeks of gains in an afternoon.
- **Why they blow up (math).**
  - With finite capital and a limit on bets, the martingale cannot win in the long run (optional stopping theorem).
  - Expected profit per cycle is B(1 − (2q)^n), negative whenever the loss probability q > ½, which is where costs push a fair game.
  - Losing streaks are guaranteed with enough trials. On a roulette wheel a 6-loss streak occurs within 200 plays with about **84%** probability, and a 10-loss streak (costing **1,023×** the base bet) with about 11%.
  - Grid trading "will almost surely ruin an investment account in the long term" (Taranto & Khan 2020, gambler's-ruin analysis), despite short-term outperformance.
  - In trading, exposure grows exactly when the market is trending against you (R1), and leverage caps and margin calls force liquidation at the worst point.
- **Anti-martingale (pyramiding winners).** Adding to winners, as the Turtles did, keeps risk bounded with stops. The Wikipedia analysis notes that betting-system anti-martingales also fail as a profit engine in fair games. In trading, the edge must come from the signal. Sizing alone cannot create one.
- **Evidence.** **F.**
- **Level:** B (as a mandatory warning module).
- **Sim drill.** "Blow-up lab." The learner runs a martingale or grid bot on R2 (it looks brilliant) and then on a sequence ending in R1 (it blows up). The engine runs 1,000 paths and shows the distribution: median positive, mean negative, about X% ruin. Score: the learner's prediction of the ruin probability before seeing it.

### 2.16 Other approaches the course should name and grade
| Approach | One-line definition | Grade | Teaching note |
|---|---|---|---|
| Buy-and-hold / DCA | Hold a diversified index and invest regularly | A, as the benchmark | Shown as the ghost curve in every drill |
| Value / fundamental investing | Buy assets cheap relative to fundamentals | A/B (factor evidence, long periods of underperformance) | Investing module, not core trading |
| Sector / asset rotation | Rotate to the strongest sectors or assets | B (momentum variant) | Use 2.6 |
| Volume profile / Market Profile (Steidlmayer) | Price-volume distribution, value area, point of control | C | Context tool for day trading |
| Order flow / footprint / tape reading | Reading aggressive vs passive volume at prices | C/D for retail | Scalping context, needs a realistic order book simulator |
| Wyckoff method | Accumulation and distribution phases, "springs" | D/C | Overlaps with failed breakouts (2.7.3) |
| Elliott Wave | Markets move in 5-3 wave fractals | D (unfalsifiable after the fact) | Critical-thinking lesson |
| Harmonic patterns, Gann | Ratio-based geometric patterns | D | Critical-thinking lesson |
| "Smart Money Concepts" / ICT | Liquidity grabs, order blocks, fair-value gaps | D (unvalidated, renames older concepts) | Show mapping to failed breakout, gap fill and range concepts |
| Copy trading / signal services | Copying another trader's positions | D/F (survivorship bias, incentives, latency) | Teach due diligence |
| Execution algorithms (VWAP/TWAP, implementation shortfall) | Splitting orders to reduce market impact | A (execution, not alpha) | Teach in the costs module |
| Risk parity / volatility-weighted portfolios | Weight assets by risk contribution | B | Position/investing bridge |

### 2.17 Strategy × regime matrix (core of the "choose the right tool" lessons)
| Family | R1 Trend | R2 Range | R3 Vol spike | R4 Gaps/jumps | R5 Event | R7 Pair | R8 Carry calm | R12 Crisis |
|---|---|---|---|---|---|---|---|---|
| Trend following / TSMOM | ++ | −− | − (whipsaw), later + | ± | ± | n/a | ± | + (often crisis alpha) |
| Breakout (Donchian/ORB) | ++ | −− (false breaks) | + if direction persists | + (gap and go) | ± | n/a | − | ± |
| Pullback | + | − | − | − | − | n/a | ± | −− |
| Mean reversion (RSI2/BB/VWAP) | − (walks the band) | ++ | ± | − | − | n/a | + | −− (no-stop blowups) |
| Range trading | −− | ++ | − | − | − | n/a | + | −− |
| Cross-sectional momentum | + | ± | −− (crash at rebound) | ± | ± | n/a | + | −− at the turn |
| Reversal / failed breakout | − | + | ± | ± | ± | n/a | ± | ± |
| Carry | ± | + | −− | −− | − | n/a | ++ | −− |
| Pairs / stat arb | ± | + | ± | − (breaks) | − | ++ | + | ± (mixed) |
| Short vol | + (grind up) | ++ | −−− | −−− | −− | n/a | ++ | −−− |
| Long vol | ± | −− (bleed) | ++ | ++ | + | n/a | −− | ++ |
| Market making | − (inventory) | ++ | − | −− | −− | n/a | + | −−− |
| Grid / martingale | −−− (ruin) | ++ (until it isn't) | −− | −−− | −− | n/a | + | −−− |

The course's core skill is diagnosing the regime first, choosing (or skipping) a strategy second, and sizing for the regime you might be wrong about.

---

## 3. Asset classes and instrument specifics

### 3.0 Cross-asset comparison
| | Stocks/ETFs | Spot FX (retail) | Futures | Index/other CFDs | Commodities (via futures/CFDs) | Crypto spot | Crypto perps | Bonds/rates |
|---|---|---|---|---|---|---|---|---|
| Hours | Exchange session plus extended hours | 24h Sun–Fri | Nearly 24h Sun–Fri (CME Globex) with a daily break | Mirrors the underlying (some 24h) | Exchange hours | 24/7 | 24/7 | Cash OTC, futures nearly 24h |
| Leverage (retail) | Reg T 2:1 overnight (US) | US 50:1 majors / 20:1 others [PK]; EU 30:1 / 20:1 | Exchange margin, often 10 to 20× notional | EU 30:1 down to 2:1 | 10 to 20× via futures; EU CFD 20:1 (gold) and 10:1 | 1:1 (spot) | Up to 100×+ offshore; EU CFD 2:1 | Futures margin |
| Main costs | Commission, spread, borrow (shorts), taxes | Spread or commission, swap | Commission, exchange fees, spread, roll | Spread, overnight funding | Roll, spread, commission | Exchange fee, spread, withdrawal fees | Fees, funding, liquidation fees | Spread, roll |
| Shorting | Needs a borrow (locate) | Symmetric | Symmetric | Symmetric | Symmetric | Hard (needs margin or lending) | Symmetric | Symmetric |
| Expiry | None | None (rolled daily) | Yes, roll needed | None (financing instead), or dated CFDs | Yes | None | None (funding keeps it near spot) | Bonds mature; futures expire |
| Gap risk | Overnight, earnings | Weekend | Session breaks, limit moves | Mirrors the underlying | Weather, OPEC, reports | Low at the session level, high from events | Liquidation cascades | Central-bank events |
| Counterparty | Clearing house + broker (SIPC in US) | Dealer (often the counterparty) | Clearing house (segregated funds) | Provider (OTC) | Clearing house | Exchange or custodian (big risk) | Exchange (insurance fund, ADL) | Clearing house or dealer |

### 3.1 Stocks and ETFs
- **Definition.** Shares are ownership in a company. ETFs are exchange-traded funds holding baskets (indices, sectors, bonds, commodities). There are also leveraged and inverse ETFs (3.1.9).
- **Exchanges and microstructure.** US: NYSE, Nasdaq, Cboe and others, plus off-exchange venues (dark pools, wholesalers). Opening and closing **auctions** carry large volume (the close matters for index funds). Pre-market and after-hours sessions have thinner liquidity and wider spreads. Halts: LULD single-stock bands and market-wide circuit breakers (7%/13%/20% S&P 500 declines) **[PK, verify]**. Europe: national exchanges (Xetra, Euronext, LSE; BVB in Romania) plus MTFs.
- **Settlement.** US T+1 since May 2024 **[PK]**. EU T+2, with a planned move to T+1 in October 2027 **[PK, verify]**.
- **Margin (US).**
  - Reg T: initial margin **50%** for marginable stock. FINRA maintenance minimum **25%**, and brokers often require 30 to 40%. A margin call follows when equity falls below maintenance.
  - **Day-trading rules changed on 4 June 2026.** The old PDT framework is gone: 4 or more day trades in 5 business days, $25,000 minimum equity, day-trading buying power, 90-day restrictions. FINRA Rule 4210 now uses an **intraday margin** regime:
    - The **Intraday Margin Level** is the amount a customer could withdraw, or would need to deposit, while meeting maintenance.
    - An **Intraday Margin Deficit** is the largest negative level after any risk-increasing trade.
    - Firms either block deficit-creating trades in real time or calculate deficits at the end of the day.
    - Deficits must be met promptly (up to 15 business days). Habitual failure past day 5 triggers a 90-day freeze on new debit or short positions.
    - Small-deficit exception: the lesser of 5% of equity or $1,000.
    - Transition to 20 Oct 2027. Cash accounts are still constrained by settlement and free-riding rules **[PK]**.
- **Short selling.**
  - A short sale sells borrowed shares. The short seller pays borrow interest and any dividends owed to the lender, and is subject to margin.
  - Losses are theoretically **unlimited**. Squeeze risk: rising prices force buybacks (GameStop, January 2021 **[PK]**).
  - **Reg SHO Rule 203 (locate):** before shorting, the broker must have reasonable grounds to believe the shares can be borrowed and must document this.
  - **Rule 204 (close-out):** a fail-to-deliver from a short sale must be closed by the market open on the settlement day after settlement. Otherwise the broker is under a pre-borrow requirement.
  - **Threshold securities:** an aggregate fail-to-deliver of at least 10,000 shares and at least 0.5% of shares outstanding for 5 consecutive settlement days. Fails persisting 13 days must be bought in.
  - **Rule 201 (alternative uptick / SSR):** after a **10% or larger intraday decline** from the prior close, short sales are allowed only above the national best bid for the rest of that day and the next.
  - **Rule 200:** orders must be marked long, short or short-exempt.
  - **Borrow fees [PK, verify]:** "general collateral" names cost well under 1% a year. Hard-to-borrow names can cost tens or hundreds of percent a year, and the lender can **recall** shares at any time (forced buy-in).
- **Dividends.** The price drops by roughly the dividend on the **ex-dividend date**. Longs receive the dividend. Shorts pay it (as a "manufactured dividend"). Dividend capture strategies don't work because of this drop, taxes and costs **[PK]**. Total-return vs price-return data matters for backtests.
- **Splits and corporate actions.** Splits and reverse splits change share count and price but not value. Historical data must be **split- and dividend-adjusted**, or backtests produce fake gaps. Other corporate actions: spin-offs, mergers (merger arbitrage is E-level), rights issues, secondary offerings (dilution in small caps).
- **Data pitfalls.** Survivorship bias (delisted stocks missing from datasets), look-ahead bias (using restated fundamentals), and the fact that point-in-time index membership matters.
- **ETFs: specifics.** Creation and redemption by authorized participants keeps the price close to NAV, but premiums or discounts open up in stress. Expense ratios. Leveraged and inverse ETFs (3.1.9). Commodity ETFs hold futures and suffer roll costs (3.3).
- **3.1.9 Leveraged/inverse ETFs.** They target 2× or 3× the **daily** return. Over longer periods returns are path-dependent (**volatility decay**). Example: the index goes +10% then −9.09%, ending flat. The 2× ETF goes +20% then −18.18%, ending −1.8%. They are suitable only for short holding periods. Grade: risk-teaching item.
- **Level:** B (basics), I (margin, shorting), A (borrow economics, corporate actions in data).
- **Sim drills.**
  - **Short-squeeze drill:** the learner shorts a synthetic stock with rising borrow fees, a chance of recall and a squeeze jump. Score: total cost of shorting vs gross alpha.
  - **Ex-dividend drill:** shows that buying before the ex-date and selling after nets about zero before taxes.
  - **Leveraged ETF decay drill:** R3 vol regimes compare 1× and 3× holdings over 6 months.
  - **SSR drill:** after a −10% day, short orders at the bid are rejected and the learner must use limits above the bid.

### 3.2 Forex (spot FX)
- **Definition.** Exchanging one currency for another, quoted as BASE/QUOTE. EUR/USD 1.1000 means 1 euro = 1.10 dollars. It is the largest market by turnover (BIS triennial survey: about $7.5 trillion a day in 2022, about $9.6 trillion a day in 2025 **[PK, verify]**). It is decentralized and OTC, so there is no single exchange price.
- **Pairs.**
  - **Majors:** EUR/USD, USD/JPY, GBP/USD, USD/CHF, AUD/USD, USD/CAD, NZD/USD.
  - **Crosses** (no USD): EUR/GBP, EUR/JPY, AUD/JPY, and others.
  - **Exotics** (e.g., USD/TRY, EUR/RON, USD/ZAR): wide spreads, gap risk, high swaps, capital-control risk.
- **Pips, lots and pip value.**
  - A pip is usually 0.0001 (0.01 for JPY pairs). Many brokers quote a fractional "pipette" (a 5th decimal place).
  - Lot sizes: **standard 100,000** units of base currency, **mini 10,000**, **micro 1,000**, **nano 100**.
  - For USD-quoted pairs (EUR/USD), pip value is **$10 per standard lot**, $1 per mini, $0.10 per micro and $0.01 per nano.
  - For JPY pairs it is ¥1,000 per standard lot, converted at the USD/JPY rate.
  - For pairs where the USD is the base (USD/CHF), pip value varies with the rate (e.g., about $6.87 per pip per standard lot at 1.4555).
- **Leverage and margin.** Retail caps: EU/UK **30:1 majors**, 20:1 non-majors and gold (ESMA). US: 50:1 majors and 20:1 others (CFTC/NFA) **[PK]**. Offshore brokers offer 500:1 or more, which is a red flag. Margin close-out at 50% of required margin (EU) plus negative balance protection (EU retail).
- **Sessions (US Eastern Time, shifting with DST).** Sydney about 17:00–02:00, Tokyo about 19:00–04:00, London about 03:00–12:00, New York about 08:00–17:00.
  - **London–New York overlap, 08:00–12:00 ET,** is the most active window. Over 50% of volume involves these two centers.
  - **Tokyo–London overlap, about 03:00–04:00 ET,** is short and matters for JPY and EUR.
  - Avoid single-session hours for most strategies. Pair matters: JPY and AUD pairs are more active in Asia.
- **Swap / rollover.** Positions held past about **5 pm New York** are rolled. The trader earns or pays the interest-rate differential (positive or negative swap). **Wednesday rollover is tripled** to cover the weekend. Brokers add a markup, so credits are smaller and debits larger than the interbank rate. Islamic (swap-free) accounts replace swap with fees **[PK]**.
- **Specific risks.**
  - **Weekend gaps** at the Sunday open.
  - Central-bank interventions and de-pegs: the SNB removed the EUR/CHF floor on 15 Jan 2015, CHF jumped about 30% and several brokers failed **[PK]**.
  - Dealer as counterparty (B-book, 5.6), requotes, and stop-hunting allegations at unregulated firms.
  - Platform variability: spread widening at rollover and on news.
- **Strategies that fit FX.** Trend and TSMOM on majors, carry (2.10), range trading on crosses during the Asian session, session breakouts (London open), news trading (A).
- **Level:** B (pips and lots), I (swap, sessions, leverage).
- **Sim drills.**
  - **Position-size calculator drill:** given account size, risk %, stop in pips and pair, compute lots. Scored for exactness, including JPY and USD-base pairs.
  - **Session drill:** an R6-style FX day with session-dependent volatility. The learner picks trading hours. Score: net pips after spread by session.
  - **Swap drill:** hold a carry position over a Wednesday and see the triple swap.
  - **SNB drill:** a frozen-peg pair with a random de-peg jump, leverage chosen in advance, negative balance protection shown.

### 3.3 Futures
- **Definition.** Standardized, exchange-traded contracts to buy or sell an underlying at a future date. They are **cleared** by a central counterparty and **marked to market daily**.
- **Contract specs [verify on CME spec pages].**
  | Contract | Multiplier / size | Tick | Tick value | Settlement |
  |---|---|---|---|---|
  | E-mini S&P 500 (ES) | $50 × index | 0.25 | $12.50 | Cash, quarterly (Mar/Jun/Sep/Dec), 3rd Friday at 9:30 ET open |
  | Micro E-mini S&P (MES) | $5 × index | 0.25 | $1.25 | Cash |
  | E-mini Nasdaq-100 (NQ) / Micro (MNQ) [PK] | $20 / $2 × index | 0.25 | $5 / $0.50 | Cash |
  | WTI Crude Oil (CL) [PK] | 1,000 barrels | $0.01 | $10 | Physical delivery |
  | Gold (GC) [PK] | 100 troy oz | $0.10 | $10 | Physical delivery |
  | 10-Year T-Note (ZN) [PK] | $100,000 face | ½ of 1/32 | $15.625 | Physical (deliverable basket) |
  | Euro FX (6E) [PK] | €125,000 | 0.00005 | $6.25 | Physical currency |
  | Corn (ZC) [PK] | 5,000 bushels | ¼ cent | $12.50 | Physical delivery |
  | Natural Gas (NG) [PK] | 10,000 MMBtu | $0.001 | $10 | Physical delivery |
  Worked example: on ES, 1 point = 4 ticks = $50 per contract.
- **Notional and leverage.** ES at 6,000 is about $300,000 notional per contract. Exchange margin is a fraction of that, so implied leverage is around 10 to 20×. Micros are 1/10 the size, which makes them good for small accounts and for learning.
- **Margin.**
  - **Initial** margin to open and **maintenance** margin to hold. Both are performance bonds set by the exchange (risk-based), and brokers can add more.
  - **Daily variation margin:** P&L is settled in cash every day.
  - Brokers often offer reduced **intraday** margins for day trades, which encourages over-leverage.
  - Exchanges raise margins in volatile markets (R12), forcing liquidations at bad prices.
  - Price limits and circuit breakers apply on some contracts.
- **Expiry and roll.**
  - Contract months use the codes F G H J K M N Q U V X Z (H=Mar, M=Jun, U=Sep, Z=Dec) **[PK]**.
  - Equity index futures are cash-settled. Most speculators **offset or roll before expiry**.
  - Rolling uses a **calendar spread**: one order sells the expiring month and buys the next. The spread price is deferred minus nearby, and it reflects carry and dividends.
  - Equity-index liquidity shifts to the next contract about 8 days before expiry **[PK]**.
  - Physically delivered contracts (CL, GC, grains) have a **first notice day / last trading day**. Retail speculators must exit before then. The simulator should force this.
  - Continuous-contract charts must be **back-adjusted** for roll gaps, or backtests are wrong.
- **Contango and backwardation.**
  - **Contango:** futures above spot, typical of storable commodities, reflecting the cost of carry (storage, financing, insurance).
  - **Backwardation:** futures below spot, reflecting a **convenience yield** from holding physical inventory. The yield is higher when inventories are low.
  - Futures **converge** to spot at expiry (otherwise there would be an arbitrage).
  - **Roll yield:** in contango, a long rolled position loses as it repeatedly buys the more expensive deferred contract. In backwardation it gains. Commodity ETFs and VIX ETPs are the classic examples.
  - April 2020: WTI front-month settled **negative (about −$37)** when storage filled near expiry **[PK]**. The lesson is delivery and storage risk.
- **Spreads.** Calendar spreads (same product, two months), inter-commodity spreads (crack spread, soybean crush, NOB), reduced spread margins. These are A-level.
- **Regulation and protection.** US futures: CFTC and NFA. Customer funds are **segregated** at the futures commission merchant (FCM) **[PK]**. SIPC **does not** cover futures (except in portfolio-margin accounts). MF Global (2011) and PFG (2012) showed segregation failures can happen **[PK]**.
- **Taxes awareness.** In the US, Section 1256 contracts get 60/40 long/short-term treatment **[PK]**. Other countries differ (see 5.5).
- **Level:** I (specs, tick value, margin), A (roll, curve, spreads).
- **Sim drills.**
  - **Tick-value drill:** convert price moves into $ P&L for several contracts. Scored on exactness.
  - **Roll drill:** an R9 curve. Before expiry, the learner decides when to roll and pays the spread. Missing the first notice day on a physical contract triggers a "delivery notice" failure screen.
  - **Contango drill:** buy and hold a rolled commodity in contango while spot is flat, then see the steady loss.
  - **Margin-hike drill (R12):** the exchange doubles margin mid-drawdown.

### 3.4 Indices and CFDs
- **Indices.** You can't trade an index directly. Exposure comes through futures, ETFs, options or CFDs. Know each index's construction: price-weighted (Dow), cap-weighted (S&P 500, DAX as a performance index **[PK]**), sector concentration (Nasdaq-100). Rebalancing events have predictable flows.
- **CFDs (contracts for difference).**
  - An OTC agreement to exchange the price change of an underlying between open and close. No ownership.
  - Developed in the UK in the 1970s and 1990s.
  - **Not available to US retail** (SEC/CFTC). Restricted in Hong Kong and Belgium. Crypto CFDs banned for UK retail.
  - **Retail protections (EU, ESMA 2018, now permanent through national regulators):** leverage caps of **30:1** major FX, **20:1** non-major FX, gold and major indices, **10:1** other commodities and non-major indices, **5:1** single equities, **2:1** crypto. **50% margin close-out** per account. **Negative balance protection.** Ban on bonuses and incentives. **Standardised risk warning** showing the provider-specific % of losing accounts. The UK FCA (2019) and ASIC (2021) cap at 30:1. CySEC had capped at 50:1 in 2016.
  - **Loss rates:** EU regulators found **74–89% of retail CFD accounts lose money**, with average losses of €1,600 to €29,000 per client. The FCA's 2016 sample found 82% losing (average £2,200).
- **Overnight funding.**
  - Long index or stock CFDs pay a financing charge, typically benchmark rate plus a broker markup (e.g., ±2 to 3% a year **[PK, verify]**), charged daily, often tripled at weekends.
  - Shorts may receive the benchmark rate minus the markup, which can still be negative.
  - Dividend adjustments: longs are credited and shorts debited.
  - Holding CFDs for months often costs more than futures or ETFs.
- **Other specifics.**
  - The provider is the counterparty (5.6).
  - Prices may come from the provider's own feed, outside exchange hours too ("weekend indices").
  - Guaranteed stop-loss orders exist for a premium **[PK]**.
  - Spread betting (UK/Ireland) is economically similar, with a different tax treatment **[PK]**.
  - Barrier/turbo/knock-out certificates are popular in Germany and similar markets **[PK]**. They are listed products with a knock-out level and built-in financing.
- **Level:** B (mechanics), I (funding cost math).
- **Sim drills.**
  - **Funding-cost drill:** the same index view held via a CFD, a future and an ETF for 1, 30 and 180 days, with a cost-breakdown chart.
  - **Close-out drill:** with a set leverage, the learner watches the 50% close-out trigger during a gap. Negative balance protection is shown.

### 3.5 Commodities
- **Definition.** Physical raw materials traded mainly through futures:
  - energy (WTI, Brent, natural gas, heating oil, gasoline)
  - metals (gold, silver, copper, platinum)
  - grains and oilseeds (corn, wheat, soybeans)
  - softs (coffee, cocoa, sugar, cotton)
  - livestock
- **Specifics.**
  - Physical delivery and **storage** create term-structure effects (3.3), so the futures curve is part of the return.
  - **Supply shocks:** weather, OPEC+ decisions, geopolitics, disease, strikes, export bans. These produce volatility clustering and gaps (R4).
  - **Scheduled reports:** EIA weekly petroleum and natural gas storage, USDA WASDE monthly, USDA Crop Progress, Commitments of Traders (CFTC COT) **[PK]**.
  - **Daily price limits** on some agricultural contracts (limit-up and limit-down days can trap traders) **[PK]**.
  - **Seasonality (2.13) [PK, verify]:** natural gas demand peaks in winter and storage injects April–October. Grain weather markets run June–August, with harvest pressure in autumn. Gasoline demand peaks in summer.
  - Contract sizes are large, and micros exist for gold, crude and others.
  - Gold behaves as a macro and real-rate asset (inverse to real yields **[PK]**).
- **Strategies.** Trend following (2.1, 2.6.2: the classic CTA domain), carry and backwardation tilts (2.10), spreads (crack, crush, calendar), seasonal tilts. All are A-level.
- **Risks.** Gaps on reports, limit moves, delivery risk, extreme contango (April 2020 WTI), volatile margins, roll costs in ETFs.
- **Level:** I to A.
- **Sim drills.**
  - **Report-day drill:** R5 on a weekly "inventory report" with a surprise distribution.
  - **Seasonal-vs-curve drill:** the learner sees that a "predictable" seasonal rise is already priced into deferred futures, so buying the deferred contract earns no seasonal return.

### 3.6 Crypto
- **Definition.** Digital assets (BTC, ETH, others) traded **24/7/365** on centralized exchanges (CEX) and decentralized protocols (DEX), plus regulated products (spot ETFs, CME futures).
- **Specifics.**
  - **No closing auction and no weekend break.** Weekend and holiday liquidity is thin, which makes sudden moves and liquidation cascades more likely. Risk can't be "switched off" at the close.
  - **Volatility** is far higher than in equities. BTC realized vol is historically around 50 to 80% annualized vs about 15 to 20% for the S&P 500 **[PK, verify]**. Altcoins are higher still. Correlations move toward 1 in sell-offs.
  - **Venue fragmentation.** Prices differ across exchanges. Order books are often thin outside the majors. Wash trading and fake volume exist on unregulated venues **[PK]**.
  - **Custody and counterparty risk.** Exchange failure is a first-order risk. **FTX (November 2022):** a run withdrew about $6B in 72 hours, followed by bankruptcy on 11 Nov 2022. The company had an ~$8B hole, customer deposits had been lent to the affiliated trading firm Alameda, and executives described "a complete failure of corporate controls". **SIPC does not cover** crypto that isn't a security. Self-custody shifts the risk to key management.
  - **Stablecoins** are the base currency on most venues, with de-peg risk (UST collapse in 2022, USDC briefly in 2023 **[PK]**).
  - **Regulation.** EU MiCA licensing regime **[PK]**. EU retail crypto CFDs capped at 2:1. US spot BTC and ETH ETFs since 2024 **[PK]**.
- **Perpetual futures ("perps").**
  - Futures with **no expiry**, the most popular crypto derivative. Perps are not guaranteed to converge to spot, so a periodic **funding rate** keeps them near the index.
  - **Funding:** typically exchanged **every 8 hours** (some venues use 1h or 4h). When the rate is positive, **longs pay shorts** (crowded longs). When negative, shorts pay longs.
  - **Binance-style formula** (third-party description): funding rate = average premium index + clamp(interest − premium, −0.05%, +0.05%), with interest fixed at **0.01% per 8h**. The premium is measured from impact bid and ask prices vs the spot index and time-weighted.
  - **Worked example:** a +0.03% rate on a $100,000 position means $30 paid from longs to shorts for that interval. At +0.01% per 8h that is about 11% a year, which is significant for leveraged longs.
  - **Academic view** (He, Manela, Ross & von Wachter, "Fundamentals of Perpetual Futures"): perp deviations from no-arbitrage prices are larger in crypto than in traditional FX, comove across coins and have shrunk over time. An implied arbitrage strategy (spot vs perp, collecting funding) produced high Sharpe ratios, which is the **basis/funding carry** trade.
- **Liquidation mechanics.**
  - Leverage up to 100× or more on offshore venues. Each position needs **initial** and **maintenance** margin, often tiered by position size.
  - Liquidation triggers when equity falls below maintenance, measured off the **mark price** (index-based) rather than the last trade, to avoid wick manipulation.
  - **Isolated margin** risks only the margin allocated to one position. **Cross margin** puts the whole wallet at risk.
  - Approximate liquidation price for an isolated long ≈ entry × (1 − 1/leverage + maintenance-margin rate).
  - If the liquidation fills worse than the bankruptcy price, the **insurance fund** covers the shortfall. If that is exhausted, **auto-deleveraging (ADL)** force-closes profitable opposing traders, ranked by profit and leverage.
  - Liquidation cascades: forced selling triggers more liquidations. The 10–11 Oct 2025 event is reported as the largest liquidation day on record (about $19B), with widespread ADL **[PK, verify]**.
- **Strategies that fit.** Trend and momentum (2.1, 2.6) work historically but with crashes. Basis and funding carry (A). Avoid grid and martingale bots (2.15), which are heavily marketed in crypto.
- **Level:** B (spot, custody risk), I (perps, funding), A (basis trades).
- **Sim drills.**
  - **Perp drill (R10):** the learner opens a leveraged perp, sees funding debits every 8h, chooses isolated or cross margin, and the engine liquidates at the mark price. Score: survival, funding paid, liquidation-distance awareness (the learner must state the liquidation price before confirming).
  - **Weekend drill:** a 24/7 market with thin weekends and a cascade event.
  - **Exchange-risk drill:** part of the balance is held "on exchange". A random venue failure event freezes withdrawals, which teaches diversifying custody.
  - **Basis drill (A):** long spot plus short perp. P&L comes from funding minus fees, with the risk of funding flipping negative.

### 3.7 Bonds and interest rates (basics for traders)
- **Definition.** Bonds are loans with coupons. Price and yield move inversely.
- **Key concepts.**
  - **Duration:** the % price change for a 1% (100 bp) yield change. CME example: a 10-year note with duration 8.95 falls about 8.95% when yields rise 1%.
  - **DV01:** the $ change per 1 bp. It grows with maturity. CME table: about $37 per $1M for the 2-year vs about $289 for the Ultra 30-year.
  - **Convexity:** the price/yield relationship is nonlinear.
  - **Yield curve:** normal, flat or inverted. Inversions are historically associated with recessions **[PK]**.
  - **Curve trades:** steepeners and flatteners (e.g., 2s10s), weighted by DV01.
  - **Credit spreads:** corporate bonds yield more than government bonds (2.10 carry).
- **Instruments for traders.**
  - **Treasury futures** (ZT, ZF, ZN, ZB, UB). They track the cheapest-to-deliver bond, so DV01 shifts over time.
  - **CME Yield futures:** quoted in yield, cash-settled, with a fixed **$10 DV01**, so curve spreads trade 1:1.
  - **SOFR futures** (short-term rate expectations) **[PK]**.
  - **Bond ETFs**, and European Bund/Bobl/Schatz futures (Eurex) **[PK]**.
- **Why traders must know rates even if they don't trade them.** Rate decisions and CPI move every asset (R5). Rates drive FX carry and swaps, CFD funding, futures fair value, option pricing (rho) and equity valuations.
- **Risks.** Event risk on central-bank days. Leverage in futures: a small yield move becomes a large P&L change.
- **Level:** I (concepts), A (DV01-weighted trades).
- **Sim drills.**
  - **Rate-shock drill:** the learner holds 2y vs 10y futures positions, a central-bank surprise moves the curve, and the learner computes P&L from DV01.
  - **Cross-asset reaction drill:** after a synthetic CPI surprise, the learner predicts the sign of moves in the bond, currency and equity index.

---

## 4. Derivatives basics for traders

### 4.1 Options: definitions
- **Call:** the right, not the obligation, to **buy** the underlying at the **strike** on or before **expiration**.
- **Put:** the right to **sell** the underlying at the strike.
- **Premium:** the price the buyer pays and the writer (seller) receives.
- **Assignment:** when a holder exercises, the writer must deliver. A short call writer sells at the strike; a short put writer buys at the strike.
- **Contract size:** US equity options usually cover **100 shares** **[PK]**.
- **Exercise style:** American (any time, e.g., US single-stock options) vs European (only at expiry, e.g., SPX index options, which are cash-settled) **[PK]**.
- **Moneyness.** A call is in the money (ITM) when the underlying is above the strike and out of the money (OTM) when below. Puts are the reverse. ATM means the strike is close to the current price.
- **Intrinsic value** is the amount the option is ITM. **Extrinsic (time) value** = premium − intrinsic. Extrinsic value grows with time to expiry and implied volatility and decays toward zero at expiration.
- **Level:** I. **Prereqs:** stocks, leverage, probability basics.

### 4.2 The Greeks [PK, standard definitions; the OIC Greeks page returned 404]
| Greek | Measures | Behaviour |
|---|---|---|
| **Delta (Δ)** | Option price change per $1 move in the underlying. Also a rough probability of finishing ITM and an equivalent-share hedge ratio. | Calls 0 to 1, puts −1 to 0. ATM about ±0.5. Moves toward 1 or 0 as the option goes deep ITM or OTM and as expiry nears. |
| **Gamma (Γ)** | Change in delta per $1 move | Highest ATM near expiry, which makes 0DTE and short-dated options explosive. Long options are long gamma, short options short gamma. |
| **Theta (Θ)** | Value lost per day from time decay | Negative for long options. Accelerates in the final weeks, especially ATM. Sellers collect it. |
| **Vega (ν)** | Price change per 1 vol point change in IV | Highest for ATM and long-dated options. Long options are long vega. |
| **Rho (ρ)** | Price change per 1% rate change | Matters for long-dated options and in rate regime shifts |

The key trade-off to teach is the **gamma/theta trade-off**: long options pay theta to own gamma, and short options earn theta but carry gamma risk.

### 4.3 Implied volatility (IV)
- **Definition.** The volatility input that makes a pricing model (Black–Scholes) match the market price. It is the market's forecast of future volatility plus a risk premium.
- **Vol risk premium.** IV is on average **above** realized volatility (Carr & Wu 2009), which is why option sellers are paid on average and occasionally suffer large losses (2.14).
- **Structure.**
  - **IV term structure** (by expiry): usually upward-sloping, and inverted in crises.
  - **Skew/smile** (by strike): equity index puts carry higher IV (crash protection demand).
  - **IV crush:** IV collapses after a known event such as earnings.
  - **Implied move:** about the ATM straddle price ÷ underlying price, for the expiry just after the event.
- **IV rank/percentile:** practitioner context tools (C).
- **VIX:** the 30-day implied volatility of the S&P 500 from SPX options **[PK]**.
- **Level:** A.

### 4.4 Basic option strategies
| Strategy | Construction | View | Max profit | Max loss | Key risks / teaching points | Level |
|---|---|---|---|---|---|---|
| Long call | Buy call | Bullish, with timing | Unlimited | Premium | Theta decay, IV crush. A right direction with wrong timing still loses. | I |
| Long put | Buy put | Bearish or hedge | Strike − premium | Premium | Same as long call | I |
| **Covered call** | Long 100 shares + short 1 OTM call | Neutral to moderately bullish | (Strike − stock cost) + premium | Stock to zero, minus premium | Caps upside, full downside remains. Cboe BXM history: equity-like returns with lower volatility **[PK, verify]**. | I |
| Cash-secured put | Short put + cash for assignment | Neutral to bullish, willing to buy lower | Premium | Strike − premium | Equivalent risk to a covered call (put-call parity) | I |
| **Protective put** (married put) | Long stock + long put | Bullish, wants insurance | Unlimited | (Stock − strike) + premium | The cost of insurance drags returns. Teaches hedging. | I |
| Collar | Long stock + long put + short call | Hedged | Capped | Capped | Zero-cost collars trade upside for protection | I/A |
| **Bull call spread** (debit vertical) | Buy lower-strike call, sell higher-strike call | Moderately bullish | Strike width − net debit | Net debit | Defined risk. Lower vega and theta than a naked long call. | I |
| Bear put spread | Buy higher put, sell lower put | Moderately bearish | Width − debit | Debit | Mirror of the above | I |
| Credit verticals (bull put / bear call) | Sell the nearer strike, buy the farther one | Range or direction with a high probability of profit | Net credit | Width − credit | High win rate, larger losses. Assignment risk near expiry. | A |
| **Long straddle** | Buy ATM call + ATM put, same strike and expiry | Big move, direction unknown | Unlimited | Total premium | Must beat the implied move. IV crush after events. | A |
| **Long strangle** | Buy OTM call + OTM put | Bigger move | Unlimited | Total premium | Cheaper than a straddle, needs a larger move | A |
| Short straddle / strangle | Sell both | Range, IV high | Premium | Unlimited (call side) / large | Short gamma. The Volmageddon lesson. E for retail without defined risk. | E |
| Iron condor | Short strangle + long wings | Range | Net credit | Wing width − credit | Defined-risk short vol | A |
| Butterfly / calendar | Combinations around a target strike or across expiries | Pin or term-structure view | Defined | Defined | Teaches term structure and gamma/theta | A/E |

Practical notes [PK]:
- Early assignment of short calls before ex-dividend dates.
- Pin risk at expiry.
- Broker options-approval levels restrict naked selling.
- Liquidity: trade options with tight bid/ask spreads and use limit orders.
- **0DTE** (same-day expiry) options are now a large share of SPX volume. Extreme gamma makes them lottery-like for buyers and tail-risky for sellers.

**Sim drills (R14):**
- **Payoff builder:** the learner assembles strategies and predicts the expiry payoff graph before the reveal. Scored on max profit, max loss and breakevens.
- **Greeks sandbox:** move spot, time and IV sliders and predict the direction of the P&L change.
- **Earnings drill:** buy a straddle before the event, then see IV crush. Score: whether the learner compared the implied move with the expected move.
- **Covered-call vs stock:** the same synthetic path run under R1 (strong up), R2 and R12. The covered call underperforms in strong rallies and loses nearly as much in crashes.
- **Hedging drill:** a protective put vs a stop-loss through a gap-down (R4). The stop gaps through, the put doesn't.

### 4.5 Leverage products and their risks
| Product | How leverage arises | Can you lose more than the deposit? | Specific traps |
|---|---|---|---|
| Margin account (stocks) | Broker loan (Reg T 50% initial) | Yes (debit balance after a gap) | Margin calls at lows, forced liquidation, interest |
| Futures | Performance bond of about 5 to 10% of notional | Yes | Daily variation margin, margin hikes, limit moves, delivery |
| CFDs (EU/UK retail) | Provider margin (30:1 to 2:1) | **No** for EU retail (negative balance protection) | Funding costs, provider counterparty, 50% close-out, wide spreads |
| Spot FX (retail) | Dealer margin | EU retail: no. Elsewhere: possibly. | Weekend gaps, swap, offshore 500:1 offers |
| Crypto perps | Exchange margin up to 100×+ | Usually no (liquidation, insurance fund) but ADL and venue risk | Funding, mark-price liquidation, cascades, exchange failure |
| Leveraged/inverse ETFs | Daily-reset internal leverage | No | Volatility decay, path dependency |
| Options (long) | Embedded leverage via delta per premium | No (premium only) | Theta, IV crush, low probability of profit for OTM lottery buys |
| Options (short, naked) | Margin | Yes, potentially unlimited | Gamma, gaps, assignment |
| Knock-out / turbo certificates | Built-in financing with a barrier | No (knock-out = loss of premium) | Barrier hit on a wick, financing |
| Binary options | All-or-nothing payout | No, but negative expected value by design | **Banned for EU retail (ESMA 2018)**. Widely associated with fraud. |

**Core leverage lesson.** Leverage multiplies volatility, not edge. Effective leverage = position notional ÷ equity, and that number counts for more than the broker's "max leverage". Formula to drill: % account move = % price move × effective leverage. Corollary: at 20× effective leverage, a 5% adverse move wipes out the account.

**Sim drill.** A "leverage dial": the same strategy on the same R3 path at 1×, 3×, 10× and 30×, with Monte Carlo ruin probabilities and the volatility-drag effect (geometric vs arithmetic returns).

---

## 5. Costs and practicalities

### 5.1 Cost inventory
| Cost | What it is | Who pays it most | How to model it in the simulator |
|---|---|---|---|
| **Commission** | Per share, per contract, per lot or % of notional | Scalpers, day traders | Fixed per-unit fee, with tiered presets (zero-commission stock broker, futures $X per side, FX ECN $X per lot) |
| **Spread** | Ask − bid. Paid by crossing it with market orders. | Everyone, mostly high-frequency traders | Spread varies by instrument, time of day (wider at the open, at rollover, on news) and regime (R12 = wide) |
| **Slippage** | Fill price worse than the expected price, especially on stop orders and in fast markets | Breakout and news traders | Slippage as a function of volatility, order size vs depth, and the event window |
| **Market impact** | Your order moves the price | Larger accounts, illiquid names | A square-root impact model above a size threshold |
| **Financing / swap** | Interest on borrowed money, plus FX swap and CFD overnight funding | Swing and position traders using CFDs or FX | Daily accrual, triple Wednesday (FX), weekend multiples (CFD) |
| **Borrow fee** | Cost to borrow shares for shorting, plus recall risk | Short sellers | Annualized fee by "borrow tier", with recall events |
| **Roll cost** | Paying the calendar spread, contango drag | Futures position traders, commodity ETF holders | Calendar spread + curve shape (R9) |
| **Funding (perps)** | Periodic payments between longs and shorts | Leveraged crypto traders | 8h funding from the premium (R10) |
| **Exchange / regulatory fees** | Exchange, clearing and regulatory transaction fees | Futures and options traders | Small per-contract fee |
| **Data and platform fees** | Real-time data, charting, platform subscriptions | Active traders | A monthly fixed cost subtracted in "career mode" |
| **Taxes** | Capital gains or income tax on profits (5.5) | Everyone profitable | Optional "after-tax view" with a generic rate input (not country-specific advice) |
| **Opportunity cost** | Return given up vs the passive benchmark | Everyone | The benchmark ghost curve |

**Cost-drag rule of thumb to teach.** Cost per trade ÷ average gross profit per trade = the share of the edge lost. Example: EUR/USD with a 1-pip spread and a 5-pip average target loses 20% of the gross edge to spread before commission and slippage. A swing trade targeting 150 pips with the same spread loses under 1%. That is why shorter styles need much larger raw edges. The ORB replication (2.2.2), where a 0.1R edge was eaten by about 0.1R of costs, is the best real-world illustration.

**Sim drill (cost lab).** The learner's last 50 trades are replayed under 0-cost, retail-cost and stressed-cost settings, with a breakeven chart of the minimum win rate needed for a given reward-to-risk ratio after costs.

### 5.2 Order types and execution (prerequisite practicalities)
- **Orders.** Market, limit, stop (stop-market), stop-limit, trailing stop, OCO/bracket, time-in-force (day, GTC, IOC/FOK), market-on-open/close.
- **Execution concepts.** Queue priority for limit orders, partial fills, gaps through stops (a stop is not a guaranteed price), and guaranteed stops (CFD providers, at a premium).
- **Level:** B. **Sim drill.** An order-type quiz embedded in live simulation. The scenario "price gaps below your stop" shows the fill at the open price.

### 5.3 Platforms and data
- **Platforms.** Broker platforms. MetaTrader 4/5 and cTrader (FX/CFD). TradingView (charting plus broker integrations). NinjaTrader, Sierra Chart, Rithmic/CQG-based platforms (futures). Thinkorswim, IBKR TWS (multi-asset). Exchange web and app interfaces (crypto). API access for systematic traders **[PK]**.
- **Data quality issues.**
  - Free delayed data vs real-time (exchange fees).
  - Consolidated vs single-venue data.
  - **Survivorship bias**, split and dividend adjustment, continuous-contract back-adjustment.
  - Time zones and session definitions (daily bars differ by provider, especially FX and crypto).
  - Tick vs bar data for intraday backtests.
  - CFD and FX broker feeds differ from each other and from the exchange.
- **Backtesting hygiene checklist.**
  - out-of-sample and walk-forward testing
  - realistic costs
  - no look-ahead
  - point-in-time universes
  - a multiple-testing penalty
  - Monte Carlo on the trade order
  - parameter-stability heatmaps
  - a paper or small-size forward test before scaling

### 5.4 Brokers: regulation, client money, business models
- **Regulation by jurisdiction [PK unless noted].**
  - US securities: SEC + FINRA.
  - US futures and retail FX: CFTC + NFA. Retail FX dealers must register as an RFED or FCM.
  - EU: national regulators under MiFID II, coordinated by ESMA. Cyprus CySEC and Germany BaFin are common for CFD brokers. Romania: ASF.
  - UK: FCA. Australia: ASIC.
  - Offshore registrations (e.g., some island jurisdictions) offer minimal protection, which is a red flag for retail.
- **Client money.**
  - Regulated brokers must **segregate client funds** from company funds. The SEC bars broker-dealers from using customer money in their own business.
  - Compensation schemes if a broker fails:
    - **SIPC (US securities):** up to **$500,000 including $250,000 cash** per customer per capacity. It does **not** cover market losses, bad advice, commodity futures (except portfolio-margin accounts), FX trades, or crypto that isn't a security.
    - **EU investor compensation schemes:** minimum €20,000 **[PK]**.
    - **UK FSCS:** £85,000 for investments **[PK, verify]**.
  - Futures: segregated customer accounts at FCMs (no SIPC). Historical failures: MF Global, PFG **[PK]**.
  - Crypto exchanges: often no segregation guarantee (FTX).
- **Dealing models.**
  - **A-book / agency (STP/ECN):** orders are passed to external liquidity. The broker earns commission or markup and is not the counterparty.
  - **B-book / market maker:** the broker **takes the other side** and keeps the exposure. This creates a **conflict of interest**: a consistently winning client is a liability and losing clients are revenue. B-booking isn't illegal or automatically abusive. What matters is execution quality, disclosure and controls. Regulators scrutinize execution quality and conflicts.
  - **Hybrid:** most retail CFD/FX brokers internalize most flow and hedge net exposure or profitable clients.
  - **Payment for order flow (PFOF, US equities):** wholesalers pay brokers for retail orders, which enables "zero commission". Execution quality is debated. The EU is phasing PFOF out under the MiFIR review (member-state exemptions to 30 June 2026) **[PK, verify]**.
- **Broker due-diligence checklist for the course.**
  - regulator and licence number, verified on the regulator's own register
  - client-money segregation and compensation scheme
  - negative balance protection
  - execution model disclosure
  - spreads and commissions on your instruments and at your hours
  - financing and swap rates
  - withdrawal track record
  - platform stability
  - bonus or "managed account" offers (red flags)
  - complaints history
- **Level:** B (safety basics), I (business models).
- **Sim drill.** A "choose a broker" scenario with 5 fictional brokers (fictional names, not real firms). Profiles mix good regulation with wide spreads, offshore with 500:1 and a bonus, B-book with good execution, and so on. The learner ranks them. Score: whether the main red flags were identified.

### 5.5 Taxes awareness (general, not advice)
- Trading profits are usually taxable, but the treatment varies by country, instrument, holding period and account type. Some regimes distinguish short- from long-term gains. Some treat frequent trading as business income.
- **Examples of how rules differ [PK, illustrative, verify locally]:**
  - US wash-sale rule: losses are disallowed if the same security is repurchased within 30 days.
  - US Section 1256: 60/40 treatment for futures.
  - UK: spread betting is generally outside capital gains tax, while CFDs are taxed.
  - EU countries differ on withholding and reporting.
  - Romania: the treatment of gains depends on whether the broker is Romanian or foreign (withholding vs self-declaration via the annual return), and the rules changed in 2025–2026.
- **Course stance.** Teach record-keeping (trade log, fees, FX conversion), the after-tax lens (tax reduces compounding), and "consult a qualified adviser or the official tax authority". Give no specific tax advice in-app.

### 5.6 Prop firms (proprietary trading "challenges")
- **Two different things.**
  - **Institutional prop firms** hire traders, train them and allocate the firm's own capital.
  - **Retail "funded trader" / evaluation firms** sell evaluations. Traders pay a fee to attempt a challenge on a **simulated** account. If they pass, they get a "funded" account, often still simulated, and receive a profit split of payouts.
- **Typical rules (2026, third-party summaries; verify on the firms' sites).**
  - **FTMO 2-Step:** Phase 1 target **10%**, Phase 2 **5%**. **Max daily loss 5%** of the initial balance, measured on equity including open positions, commissions and swaps. **Max overall loss 10%** (static). **Minimum 4 trading days** per phase. Time limits reportedly removed. Profit split **80%**, rising to 90%. A **1-Step** variant (2026) is reported with a 3% daily loss limit, a "best day" consistency rule (no day above 50% of profits) and a 90% split. Sources conflict.
  - **Topstep (futures) Trading Combine:** $50K / $100K / $150K accounts. Profit targets $3,000 / $6,000 / $9,000. **Trailing Maximum Loss Limit** $2,000 / $3,000 / $4,500, based on the end-of-day balance high, which stops trailing at the starting balance. Daily loss limit $1,000 / $2,000 / $3,000 on some platforms (reported removed on TopstepX). **Consistency rule:** the best day must be under 50% of total profit in the Combine. Split about 90/10.
  - Other common rules: news-trading restrictions, no holding over the weekend (some), lot caps, bans on copy trading, HFT, latency arbitrage and grid/martingale, a "gambling" ban (maximum risk per trade), KYC before payout, and scaling plans.
- **Business model and statistics (unaudited estimates).**
  - Pass rates are commonly estimated at **5 to 10%** (range 2 to 20% depending on rules).
  - Community estimates of 2 to 4 attempts before a first funded account ($800 to $1,600 in fees). Payout rates among funded accounts are rarely disclosed (claims of "about 7%" or "under 10%" receiving payouts are unverified).
  - Critics note that fee revenue from failures funds the model. Many firms never route trades to a real market.
- **Regulatory and legal risk.** In 2023 the **CFTC sued My Forex Funds / Traders Global Group**: over 135,000 customers, at least **$310M** in fees, and the firm allegedly acted as counterparty while claiming third-party liquidity providers. In **May 2025 the case was dismissed**, with sanctions against CFTC enforcement staff (as reported by defense counsel), after the court questioned jurisdiction over **simulated** transactions. The lesson is that regulatory protection for evaluation-fee customers is unclear. Several firms closed or changed rules abruptly in 2024 **[PK]**. ASIC has issued warnings.
- **Why the rules matter mathematically.**
  - A 5% daily and 10% overall drawdown limit with a 10% target means the strategy needs high risk-adjusted returns **and** low variance in a short window.
  - Trailing drawdowns punish give-backs of open profit.
  - Consistency rules punish lucky single days.
  - Expected value of buying a challenge = P(pass) × E[payouts | funded] − fees. This is negative for most participants.
- **Level:** I (rules), A (EV analysis).
- **Sim drill ("Evaluation mode").** The simulator runs a configurable challenge: target, daily and max loss (static or trailing), minimum days, consistency rule. Monte Carlo on the learner's own trade history estimates pass probability. Score: pass/fail, rule-breach type, and the learner's estimate of challenge EV vs the computed value. Strong teaching value: show that risking 2% per trade gives the highest *pass* probability for some strategies but the lowest long-run survival.

---

## 6. Building a personal trading approach

### 6.1 Match style to life constraints (decision matrix)
| Constraint | Points toward | Avoid |
|---|---|---|
| Full-time job, fixed hours | Swing or position, end-of-day orders, systematic rules | Scalping, news trading |
| Free in the morning (US/EU sessions) | Day trading the open (ORB, gap plays) if costs are understood | Asian-session strategies |
| Lives in the EU/Romania (CET/EET) | EU index open (09:00 CET), London–NY overlap (14:00–18:00 CET), US open (15:30 CET) | Strategies that need the US close (22:00 CET) every day, unless automated |
| Small account (< €5k) | Micro futures, micro FX lots, unleveraged ETFs, fractional shares, swing horizon | Concentrated leverage, many simultaneous positions |
| Larger account | Diversified position trading across asset classes, options hedging | Liquidity-constrained small caps |
| Low tolerance for drawdowns | Lower risk per trade (0.25 to 0.5%), mean reversion with stops, diversified portfolios | Trend following with 35% win rates, short vol |
| Enjoys data/coding | Systematic strategies, backtesting | Purely discretionary pattern reading |
| Impulsive under stress (self-assessed or measured in the sim) | Automated orders, fixed rules, longer horizons | Discretionary intraday |

The simulator can run a **profile quiz plus a behaviour audit**: measured overtrading, revenge-trade frequency, stop-moving and holding time, which inform a suggested style.

### 6.2 Choosing markets
Criteria:
- **liquidity** (tight spreads in your hours)
- **cost per unit of volatility**: ATR ÷ (spread + commission) is a useful "tradability ratio"
- **availability** in your jurisdiction and account type (no CFDs for US residents; ESMA leverage in the EU)
- **contract size** vs account size (micros exist for this)
- **session fit**
- **correlation** with what you already trade
- **data availability**
- **personal edge** (knowledge of a sector or region)

Start with **one or two** highly liquid instruments (e.g., an index future or ETF and one major FX pair) to learn their "personality" before expanding.

### 6.3 Specialising
- One style, one or two setups, one or two markets until the trader has a statistically meaningful sample: 100 or more trades, or at least 30 for slower strategies.
- A **playbook** with an exact definition of each setup (screenshots, rules, stats), plus a "no trade" list.
- Journaling: entry and exit reasons, emotions, rule adherence, MAE/MFE (maximum adverse and favorable excursion).
- Diversify by strategy only once each component shows positive expectancy and the components have low correlation.

### 6.4 The development pipeline (teach as a repeatable process)
1. **Hypothesis**, with an economic rationale (who is on the other side, and why the edge should exist: risk premium, behavioural bias, structural flow, liquidity provision).
2. **Rule specification** (fully mechanical, or with documented discretionary filters).
3. **Backtest** with realistic costs, out-of-sample and walk-forward testing, and a random-walk control (R0).
4. **Robustness:** parameter neighbourhoods, other markets and periods, Monte Carlo on trade order, worst-case drawdown estimate.
5. **Forward test (paper or sim)** for N trades. Compare the live distribution with the backtest.
6. **Small live size** (minimum contract or micro lot) to test execution and psychology.
7. **Scale gradually** (6.5) with pre-agreed **kill criteria**: drawdown beyond the 95th-percentile Monte Carlo drawdown, expectancy confidence interval crossing zero, or a regime change detected.
8. **Monitor decay** (McLean & Pontiff: published edges shrink substantially, so assume yours will too).

### 6.5 Scaling up responsibly
- **Risk per trade:** 0.25 to 1% of equity for most retail traders. Full-Kelly sizing is far too aggressive given estimation error, so use at most fractional Kelly (¼ to ½) **[PK]**.
- **Portfolio heat cap:** total open risk at most about 5 to 6% of equity, and correlated positions count together (Turtle unit limits).
- **Drawdown-based de-risking:** cut size after defined drawdown steps (e.g., the Turtles cut the notional account by 20% per 10% drawdown). Increase size only after new equity highs, in steps of about 25%.
- **Capital stages:** simulator, then a minimum live size, then 25%, 50% and 100% of target size. Each stage is unlocked by sample size plus adherence metrics, not by P&L alone.
- **Avoid:** increasing size after a loss (martingale), adding leverage to fix underperformance, or scaling into illiquid instruments where impact grows.
- **Career realism:** few retail traders earn a living (Brazil: 97% of persistent day traders lost money; Taiwan: under 1% predictably profitable). Treat trading income as uncertain. Keep separate emergency savings. Don't trade with borrowed money.

**Sim drill ("Career mode").** A multi-month campaign. The learner must pass stage gates (sample size, adherence above 90%, drawdown within limits) to unlock larger virtual capital. Breaching kill criteria demotes them a stage.

---

## 7. Suggested progressive course order

Each stage lists its modules (with section references), its key sim drills, and the **gate** to the next stage. The gates use process metrics, so the course doesn't reward lucky P&L.

### Stage 0: Orientation (Beginner)
1. What markets are, who trades and why. Investing vs trading (1.6). The benchmark ghost.
2. The reality check: CFD loss rates, day-trader studies, how prop-firm economics work (1.2, 3.4, 5.6, light version).
3. Asset-class tour (3.0 table). How a price moves: bid/ask, spread, order types (5.2).
4. Risk basics: R-multiples, risk per trade, stop placement, the position-size formula.
5. **Warning module: martingale and grid "blow-up lab" (2.15)**, taught early so learners never adopt these.

*Gate:* passes the position-sizing calculator drill with ≥90% accuracy, plus the order-type quiz.

### Stage 1: Foundations (Beginner)
6. Stocks and ETFs mechanics (3.1 basics: exchanges, auctions, dividends, splits).
7. Charts, trend vs range identification, support and resistance (2.1.2, 2.5). The **regime-recognition game** (R0/R1/R2 unlabeled).
8. First strategies:
   - MA trend following (2.1.1)
   - range trading (2.5)
   - simple MA pullback (2.3.1)
   - Bollinger reversion (2.4.2)
9. Swing trading as the first style (1.4). End-of-day order placement.
10. Costs I: spread and commission math, cost-drag lab (5.1).
11. Journaling and the playbook (6.3).

*Gate:* 50 sim trades with a written plan. Adherence ≥85%. Regime-recognition accuracy above chance by a set margin.

### Stage 2: Core strategy toolkit (Intermediate)
12. Breakouts: Donchian (2.2.1, single market), volatility contraction (2.2.3), S/R breakout (2.2.4).
13. Failed breakouts and the Turtle Soup contrast drill (2.7.3), reversal patterns (2.7.1–2.7.4).
14. Mean reversion II: RSI(2) with and without stops (2.4.1). The skew lesson.
15. Holy Grail (2.3.2), flags (2.3.3), and Fibonacci critically (2.3.4).
16. Forex mechanics (3.2): pips, lots, sessions, swap, leverage.
17. Leverage and margin (4.5), the leverage dial, and the CFD rules and funding costs (3.4).
18. Backtesting basics and the overfitting lab on R0 (1.7, 5.3).

*Gate:* builds one fully specified setup, backtests it in the strategy lab with costs and out-of-sample testing, forward-tests 30 trades. Expectancy CI reported. Overfitting quiz passed.

### Stage 3: Intraday, events and new venues (Intermediate → Advanced)
19. Day trading (1.3). Sessions and intraday structure (R6). VWAP (2.4.3).
20. ORB (2.2.2) with the cost-flip demonstration.
21. Gaps: gap and go vs gap fill (2.8).
22. News and events: macro calendar, stand-aside discipline, slippage model (2.9.1). Headline whipsaw (2.9.4).
23. Futures mechanics (3.3): tick value, margin, expiry, roll, contango and backwardation.
24. Crypto (3.6): 24/7 markets, custody risk, perps, funding, liquidation drill.
25. Scalping as a cost lesson (1.2).
26. Day-trading regulation update (3.1: PDT history → intraday margin regime 2026). EU equivalents.

*Gate:* 20-day simulated "trading month" with a daily loss limit and no breaches. Net positive or flat with ≥90% adherence. Liquidation-price quiz passed.

### Stage 4: Systematic and portfolio trading (Advanced)
27. Time-series momentum and the full Turtle system with units, N-sizing and correlation limits (2.6.2, 2.2.1).
28. Cross-sectional momentum, momentum crashes and vol scaling (2.6.1).
29. Carry across asset classes and crash risk (2.10). Bonds and rates basics (3.7).
30. Seasonality and calendar effects, with the multiple-testing lab (2.13). Commodities (3.5).
31. Evidence literacy: decay (McLean & Pontiff), crowding, regime dependence, reading papers critically (ORB paper vs replication as a case study).
32. Position trading (1.5) and portfolio construction (heat, correlation, risk parity concept).

*Gate:* multi-asset 10-year simulation completed without "abandoning" mid-drawdown. Walk-forward report submitted.

### Stage 5: Derivatives and relative value (Advanced → Expert)
33. Options basics (4.1), the payoff builder.
34. Greeks and IV (4.2, 4.3), the Greeks sandbox.
35. Basic strategies (4.4): covered call, protective put, verticals, straddle and strangle. The earnings IV-crush drill (2.9.3).
36. Volatility strategies: VRP, long vs short vol, the Volmageddon replay (2.14).
37. Pairs trading and stat arb (2.11). The cointegration lab with a structural break.
38. Market making concept (2.12) on the order-book sim.
39. PEAD and event-driven equity (2.9.2) with the decay drill.
40. Futures spreads and the curve (3.3, A-level).

*Gate:* option-strategy selection quiz across scenarios. A defined-risk options campaign with no breaches of max-loss rules.

### Stage 6: Professionalisation (Advanced/Expert)
41. Brokers, regulation, client money, A/B-book, PFOF (5.4). The broker-choice scenario.
42. Prop-firm evaluations: rules, EV math, evaluation-mode simulator (5.6).
43. Taxes awareness and record-keeping (5.5).
44. Building a personal approach: constraints matrix, market choice, specialisation, development pipeline, scaling and kill criteria (6.1–6.5).
45. **Capstone:** an unknown multi-regime synthetic market (randomly drawn from R0–R14). The learner must diagnose the regimes, choose or abstain, size, and report results after costs vs the benchmark. Scored on risk-adjusted net return, regime-diagnosis accuracy, correct abstention in R0 periods, and rule adherence.

### Cross-cutting threads (run through every stage)
- Psychology and behaviour metrics: overtrading, revenge trading, stop-moving, FOMO entries. The simulator detects these and gives feedback.
- The benchmark ghost and the after-cost view, in every drill.
- "Who is on the other side?", a prompt before every new strategy.
- Regulatory freshness: date-stamp every rule in the content and review it at least yearly (the PDT change shows why).

---

## 8. Sources

### 8.1 Web sources consulted in this research (URL → contribution)
**Regulation: US equities, margin, short selling, investor protection**
- https://www.kslaw.com/insights/articles/finra-adopts-sweeping-changes-to-margin-requirements-for-day-trading: full detail on the 2026 replacement of the PDT rule: approval 15 Apr 2026, effective 4 Jun 2026, transition to 20 Oct 2027, intraday margin level and deficit, the 15-day and 90-day rules, the small-deficit exception.
- https://www.finra.org/sites/default/files/2026-01/SR_FINRA-2025-017-91-FR-1580.pdf: FINRA rule filing SR-FINRA-2025-017 (Federal Register), the primary document behind the PDT change.
- https://www.sofi.com/learn/content/pattern-day-trading-rules/: confirms the PDT replacement and the transition caveat.
- https://blog.firstrade.com/blog/2026/6/3/the-complete-guide-to-the-pdt-rule-elimination-everything-investors-need-to-know-on-day-one: broker explanation of the PDT elimination (effective date, practical effects).
- https://www.investor.gov/introduction-investing/investing-basics/glossary/pattern-day-trader: legacy PDT definition (fetch blocked; seen in search).
- https://www.sec.gov/investor/pubs/regsho.htm: Reg SHO short-sale rules: locate (203), close-out (204), threshold securities, Rule 201 circuit breaker, marking (200), short-seller risks.
- https://www.silverlaw.com/blog/margin-account-guidelines/ and https://www.benzinga.com/money/initial-margin-vs-maintenance-margin: Reg T 50% initial and FINRA 25% maintenance, margin calls (secondary).
- https://www.sipc.org/for-investors/what-sipc-protects and https://www.sipc.org/for-investors/investor-faqs: SIPC limits ($500k / $250k cash) and exclusions (market losses, futures, FX, non-security crypto).

**Regulation: EU/UK CFDs**
- https://www.esma.europa.eu/press-news/esma-news/esma-adopts-final-product-intervention-measures-cfds-and-binary-options: ESMA CFD measures: leverage tiers, 50% close-out, negative balance protection, incentives ban, risk warning, 1 Aug 2018 start.
- https://www.esma.europa.eu/node/84933: 74–89% of retail CFD accounts lose money, average losses €1,600–€29,000, binary options prohibition.
- https://www.esma.europa.eu/sites/default/files/library/esma35-43-1135_notice_of_pi_decisions_on_cfds_and_binary_options.pdf: risk-warning methodology (provider-specific loss %, 12-month window).
- https://en.wikipedia.org/wiki/Contract_for_difference: CFD mechanics, US ban, FCA 2016 82% loss stat, CySEC/FCA/ASIC leverage history, counterparty risk.

**Futures (CME Group education)**
- https://www.cmegroup.com/education/courses/micro-e-mini-futures/managing-micro-e-mini-futures-expiration.html: rolling via calendar spreads, choosing deferred months, spread pricing factors (search summary; fetch timed out).
- https://www.cmegroup.com/education/courses/introduction-to-bitcoin/managing-bitcoin-futures-expiration-rolling-forward: spread price quotation example (deferred − nearby), most speculators offset before expiry.
- https://www.cmegroup.com/education/courses/introduction-to-base-metals/what-is-contango-and-backwardation.html: contango (cost of carry), backwardation (convenience yield), convergence at expiry.
- https://tickertape.tdameritrade.com/amp/trading/contango-backwardation-futures-markets-18174: contango as the "normal" curve shape.
- https://www.cmegroup.com/education/courses/introduction-to-treasuries/how-can-you-measure-risk-in-treasuries: duration and DV01 definitions and examples.
- https://www.cmegroup.com/education/articles-and-reports/introducing-yield-futures and https://cmegroup.com/articles/2024/spreading-treasury-yield-futures.html: Yield futures with a fixed $10 DV01, curve spreads 1:1.
- https://ninjatrader.com/Futures/Blogs/What-are-E-Mini-S-P-500-ES-Futures and https://www.schwab.com.sg/story/stock-index-futures-tick-values: ES/MES multipliers and tick values (secondary; CME spec page timed out).

**Options**
- https://www.optionseducation.org/optionsoverview/what-is-an-option: OIC definitions of call, put, strike, premium, intrinsic and time value, moneyness, assignment.
- https://us.etrade.com/e/t/kc/oicmain: OIC strategy catalogue (covered call, spreads, straddle, strangle).
- https://prd-web.theocc.com/getmedia/f34f8a0d-806f-4f1a-adf7-d49d8d94b16e/option-strategies-quick-guide.pdf: OCC option strategies quick guide (payoff reference).
- https://www.m-x.ca/f_publications_en/options_strategies_quick_guide_en.pdf and https://www.finder.com/ca/stock-trading/options-strategies: strategy mechanics (secondary).

**Forex (Babypips and related)**
- https://www.babypips.com/forexpedia/lot: lot sizes (standard, mini, micro, nano) and the pip-value table.
- https://www.babypips.com/learn/forex/lots-leverage-and-profit-and-loss: lots, leverage and P&L lesson (fetch blocked; content via search).
- https://babypips.com/learn/forex/session-overlaps and https://babypips.com/tools/forex-market-hours: London–NY overlap 8–12 ET, Tokyo–London 3–4 ET, avoiding single-session hours.
- https://forums.babypips.com/t/what-determines-rollover-fees/81016 and https://forums.babypips.com/t/how-does-carry-trade-work/66054: rollover at 5 pm NY, carry mechanics and risks.
- https://www.vtmarkets.com/?p=61789: triple-swap Wednesday, broker markup on swap.

**Crypto**
- https://arxiv.org/abs/2212.06888: He, Manela, Ross & von Wachter, "Fundamentals of Perpetual Futures": funding mechanism, no convergence, larger deviations than FX, high-Sharpe arbitrage.
- https://www.bit.com/knowledge-hub/funding-rate: funding direction, 8h interval, worked example.
- https://eco.com/support/en/articles/15247705-hyperliquid-liquidations-explained-margin-calls-and-insurance-fund, https://mudrex.com/blog/liquidation-price-on-mudrex-futures/, https://trustwallet.com/glossary/liquidation: maintenance margin, mark price, isolated vs cross, insurance fund, ADL, liquidation-price formula.
- https://en.wikipedia.org/wiki/Bankruptcy_of_FTX: FTX collapse facts (run, $8B hole, commingling with Alameda, lessons on exchange risk).

**Academic strategy evidence**
- https://knowledge.wharton.upenn.edu/article/recognizing-an-investing-signal-that-defied-wisdom-and-endured/ and https://alphaarchitect.com/?p=29855: Jegadeesh & Titman 1993 momentum (3–12-month horizons, partial reversal).
- https://papers.ssrn.com/abstract=2089463, https://fairmodel.econ.yale.edu/ec439/jpde.pdf, https://quantpedia.com/strategies/time-series-momentum-effect/, https://www.aqr.com/Insights/Datasets/Time-Series-Momentum-Factors-Monthly: Moskowitz, Ooi & Pedersen 2012 TSMOM (58 futures, 12-1, positive for every contract).
- https://www.aqr.com/Insights/Research/Journal-Article/A-Century-of-Evidence-on-Trend-Following-Investing and https://fairmodel.econ.yale.edu/ec439/hurst.pdf: Hurst, Ooi & Pedersen century of trend following (67 markets, since 1880, best in low-correlation environments).
- https://institutional.fidelity.ca/en/insights/trend-following-crisis-alpha/: crisis alpha attributed mainly to beta timing.
- https://www.nber.org/papers/w20439 and https://alphaarchitect.com/avoiding-momentum-crashes/: Daniel & Moskowitz momentum crashes (panic states, 2009 losers +163%).
- https://Www.Gwern.net/doc/economics/2016-mclean.pdf and https://ivey.uwo.ca/media/3775549/pontiff.pdf: McLean & Pontiff (97 predictors, −26% out-of-sample, −58% post-publication).
- https://alphaarchitect.com/pairs-trading-kicks-butt/, https://www.cxoadvisory.com/technical-trading/classic-paper-matched-pairs-trading/, https://c.mql5.com/forextsd/forum/208/Pairs%20Trading%20-%20Performance%20of%20a%20Relative%20Value%20Arbitrage%20Rule.pdf: Gatev, Goetzmann & Rouwenhorst pairs trading (distance method, 2σ, about 11% annualized, 1962–2002).
- https://thesis.eur.nl/pub/8530/Cummins,%20R.L.%20%28299180%29.pdf: out-of-sample 2004–2009 test, no consistent excess returns, profitable in turmoil.
- https://ideas.repec.org/a/taf/ufajxx/v66y2010i4p83-95.html, https://research.bond.edu.au/en/publications/does-simple-pairs-trading-still-work/, https://quantpedia.com/Screener/Details/12: Do & Faff 2010 (0.86% → 0.37% → 0.24% monthly), strong in turbulence, weak in liquidity crises.
- https://en.wikipedia.org/wiki/Pairs_trade: history (Bamberger, Tartaglia), cointegration method, risks, LTCM.
- https://projects.nber.org/papers/19325, https://www.chicagobooth.edu/review/carry-trading-not-just-for-currencies, https://cbs.dk/node/526518: Koijen, Moskowitz, Pedersen & Vrugt "Carry" (JFE 2018), carry across asset classes and recession exposure.
- https://en.wikipedia.org/wiki/Carry_(investment): carry definitions, UIP, yen carry and its 2008 reversal, crash risk.
- https://en.wikipedia.org/wiki/Post%E2%80%93earnings-announcement_drift: PEAD history (Ball & Brown, Bernard & Thomas 41/48 quarters), SUE, decline to ≤3%.
- https://cfr.ivo-welch.info/published/papers/martineau2021rest.pdf: Martineau "Rest in Peace PEAD", no drift in large caps since about 2006.
- https://business.columbia.edu/sites/default/files-efs/imce-uploads/CEASA/Events%20Page/PEAD_Declined_over_time.pdf: PEAD decline explanations (arbitrage vs earnings persistence).
- https://alphaarchitect.com/quantitative-momentum-research-short-term-return-reversal/, https://mysimon.rochester.edu/novy-marx/research/RRLP.pdf, https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr513.html: short-term reversal (Lehmann, Jegadeesh 1990, liquidity provision, decline after 2000).
- https://engineering.nyu.edu/sites/default/files/2019-01/CarrReviewofFinStudiesMarch2009-a.pdf, https://ideas.repec.org/a/oup/rfinst/v22y2009i3p1311-1341..html: Carr & Wu variance risk premiums (negative VRP, negative straddle returns).
- https://rpc.cfainstitute.org/research/financial-analysts-journal/2021/volmageddon-failure-short-volatility-products, https://www.bloomberg.com/news/articles/2019-02-06/the-day-the-vix-doubled-tales-of-volmageddon, https://eco3min.fr/en/volmageddon-2018-volatility-feedback-loop/: Volmageddon 2018 (VIX 17→37, short-vol ETPs −90%+, XIV $1.9B→$63M).
- https://rpc.cfainstitute.org/research/financial-analysts-journal/2008/equity-returns-at-the-turn-of-the-month, https://quantpedia.com/strategies/turn-of-the-month-in-equity-indexes: McConnell & Xu turn-of-month (1926–2005, 31 of 35 countries).
- https://www.tias.edu/docs/default-source/Kennisartikelen/ssrn-id76248.pdf?sfvrsn=2, https://ideas.repec.org/a/taf/intecj/v33y2019i4p585-604.html, https://mro.massey.ac.nz/items/8a511a62-1bee-4f6f-b36e-3cad3a67e931/full: Halloween effect (Bouman & Jacobsen 36/37 markets; later replications on 75 and 108 indices).
- https://en.wikipedia.org/wiki/Bollinger_Bands: construction, %b, bandwidth, mixed effectiveness evidence (Lento et al.), about 88% containment.

**Day-trader and retail outcome evidence**
- https://econpapers.repec.org/RePEc:fgv:eesptd:525, https://repositorio.fgv.br/items/e87d04fc-4b4c-4a56-ab5a-1c84c1afde1b/full, https://www.cxoadvisory.com/investing-expertise/day-trading-a-bust/: Chague, De-Losso & Giovannetti, "Day Trading for a Living?" (97% lost money; 1.1% above minimum wage; no learning).
- https://faculty.haas.berkeley.edu/odean/papers/day%20traders/Day%20Trading%20Skill%20110523.pdf, https://ideas.repec.org/a/oup/rasset/v10y2020i1p61-93..html: Barber, Lee, Liu & Odean (Taiwan; under 1% predictably profitable net of fees).

**Named systems and setups**
- https://www.mql5.com/en/articles/23448: Original Turtle rules (System 1/2, N, 2N stop, ½N pyramiding, 4 units) (secondary).
- https://en.wikipedia.org/wiki/Richard_Dennis: Turtle experiment history (23 recruits, 1983–84, about $175M, later decay of the original system).
- https://www.turtletrader.com/trader-raschke/: Turtle Soup concept and origin (Street Smarts).
- https://concretumgroup.com/a-profitable-day-trading-strategy-for-the-u-s-equity-market/, https://ideas.repec.org/p/chf/rpseri/rp2498.html: Zarattini, Barbon & Aziz ORB paper (Stocks in Play, 1,600%, Sharpe 2.81).
- https://www.mql5.com/en/blogs/post/776235: independent ORB replication on 5 index CFDs (gross edge reproduced, net about zero or negative).
- https://www.luxalgo.com/library/concept/rsi-2/, https://quantifiedstrategies.substack.com/p/larry-connors-r3-strategy-it-still-795: Connors RSI(2) rules and variants, Connors' finding on stops.
- https://tradingsetupsreview.com/the-holy-grail-trading-setup, https://capital.com/en-gb/learn/trading-strategies/holy-grail-trading-strategy: Holy Grail rules (ADX >30 rising, 20-period MA, entry at the touch-bar high) and limitations.
- https://www.luxalgo.com/library/concept/turtle-soup/, https://www.antoinebuteau.com/lessons-from-linda-bradford-raschke/: Turtle Soup / Plus One rules, Raschke lessons, the 80-20 concept.
- https://www.tradezella.com/blog/gap-and-go-strategy, https://www.trade-ideas.com/learning-center/trading-strategies/gap-fill-trading-strategy/: gap-and-go filters (gap %, RVOL, float, catalyst) and gap-fill conditions (practitioner).

**Grid / martingale**
- https://en.wikipedia.org/wiki/Martingale_(betting_system): expected-value formula, streak probabilities, optional stopping theorem.
- https://research.usq.edu.au/item/q5x02/gambler-s-ruin-problem-and-bi-directional-grid-constrained-trading-and-investment-strategies: Taranto & Khan, grid trading almost surely ruins in the long run.
- https://www.mql5.com/en/forum/512226, https://forums.babypips.com/t/counter-trend-grid-martingale-account-killer/73109: practitioner accounts of grid/martingale blow-ups.

**Market making**
- https://www.hummingbot.org/academy-content/guide-to-the-avellaneda--stoikov-strategy/, https://themicrostructurelab.substack.com/p/microstructure-essentials-avellaneda: Avellaneda–Stoikov reservation price, inventory skew, spread drivers, adverse selection limits.

**Brokers and prop firms**
- https://tradelocker.com/broker-trading/a-book-vs-b-book/, https://quadcode.com/blog/a-book-vs-b-book-vs-hybrid-brokerage-models-comparison, https://track360.io/glossary/a-book-vs-b-book: A-book vs B-book vs hybrid, conflict of interest, regulatory scrutiny.
- https://tradetanto.com/learn/ftmo-rules-evaluation-process, https://propfirmmap.com/blog/ftmo-review-2026-is-it-still-the-best-prop-firm, https://www.pineconnector.com/blogs/pico-blog/ftmo-challenge-rules-automated-traders: FTMO 2-Step and 1-Step rules (2026).
- https://proptradingvibes.com/blog/topstep-trading-combine-rules, https://tradingfunder.com/topstep-rules, https://blog.traderspost.io/article/how-to-get-funded-with-topstep: Topstep Combine (trailing MLL, DLL, consistency rule, targets).
- https://www.quantvps.com/blog/prop-firm-statistics-2025, https://nexusfi.com/a/prop-firms/expected-value-prop-firm-evaluations, https://track360.io/glossary/challenge-pass-rate, https://thetrustedprop.com/blogs/can-you-make-money-with-prop-firms-the-reality-data: pass-rate estimates (5–10%), fee economics, payout data scarcity (unaudited).
- https://cftc.gov/node/247111, https://cftc.gov/media/9196/enftradersglobalgroupcomplaint082923/download: CFTC v. Traders Global Group (My Forex Funds) complaint (135,000 customers, $310M fees, firm as counterparty).
- https://www.kslaw.com/about/news/king-spalding-secures-dismissal-and-unprecedented-sanctions-against-cftc-enforcement-staff: dismissal of the MFF case and sanctions on CFTC staff (defense-counsel account).

### 8.2 Prior-knowledge references used (not fetched this session; marked [PK]; verify before publishing in-app)
- Brock, Lakonishok & LeBaron (1992), "Simple Technical Trading Rules and the Stochastic Properties of Stock Returns", J. Finance.
- Sullivan, Timmermann & White (1999), "Data-Snooping, Technical Trading Rule Performance, and the Bootstrap", J. Finance.
- Lo, Mamaysky & Wang (2000), "Foundations of Technical Analysis", J. Finance.
- Asness, Moskowitz & Pedersen (2013), "Value and Momentum Everywhere", J. Finance.
- Brunnermeier, Nagel & Pedersen (2008), "Carry Trades and Currency Crashes", NBER Macro Annual.
- Lucca & Moench (2015), "The Pre-FOMC Announcement Drift", J. Finance.
- Cliff, Cooper & Gulen (2008), "Return Differences between Trading and Non-trading Hours: Like Night and Day"; Lou, Polk & Skouras (2019), "A Tug of War: Overnight versus Intraday Expected Returns", JFE.
- Gao, Han, Li & Zhou (2018), "Market Intraday Momentum", JFE.
- Moreira & Muir (2017), "Volatility-Managed Portfolios", J. Finance.
- Lehmann (1990), "Fads, Martingales, and Market Efficiency", QJE; Jegadeesh (1990), "Evidence of Predictable Behavior of Security Returns", J. Finance; Nagel (2012), "Evaporating Liquidity", RFS.
- Glosten & Milgrom (1985); Kyle (1985); Avellaneda & Stoikov (2008), "High-frequency trading in a limit order book", Quantitative Finance.
- Crabel (1990), *Day Trading with Short Term Price Patterns and Opening Range Breakout*; Connors & Raschke (1995), *Street Smarts*; Connors & Alvarez (2008), *Short Term Trading Strategies That Work*; Faith (2003/2007), *The Original Turtle Trading Rules* / *Way of the Turtle*; Antonacci (2014), *Dual Momentum Investing*.
- Whaley (2002), "Return and Risk of CBOE Buy Write Monthly Index", J. Derivatives (covered-call evidence).
- Kelly (1956) criterion; Perold (1988) implementation shortfall.
- Market facts: US T+1 (May 2024), SNB EUR/CHF floor removal (15 Jan 2015), WTI negative settlement (20 Apr 2020), GameStop squeeze (Jan 2021), yen-carry unwind (Aug 2024), crypto liquidation event (10–11 Oct 2025), BIS FX turnover surveys (2022, 2025), EU PFOF phase-out (MiFIR review), EU T+1 plan (Oct 2027), FX leverage caps in the US (CFTC/NFA), CME contract specs for NQ/CL/GC/ZN/6E/ZC/NG, SIPC/FSCS/EU ICS limits.

### 8.3 Research gaps to close before content goes live
1. Verify all CME contract specs on the official spec pages. Those fetches timed out.
2. Confirm the ORB paper's exact Stocks-in-Play thresholds and stop rule from the SSRN PDF.
3. Confirm the exact Street Smarts rules (Turtle Soup, 80-20, Holy Grail stop and exit) from the book.
4. Cboe BXM covered-call statistics, commodity seasonality specifics, borrow-fee ranges, current US retail FX leverage. These searches were not run because the web-search budget was exhausted.
5. Country-specific tax notes (especially Romania) from official sources, if the app shows any.
6. Re-check the FTMO and Topstep rules at publication time, since they change often.
