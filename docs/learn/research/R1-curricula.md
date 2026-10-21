# R1: How the best curricula structure trading education

*Research input for the MARKET//LAB course map (beginner to advanced, simulator plus virtual money). Compiled 2026-10-22.*

---

## 0. Method, confidence markers and limits

- **Evidence markers** used throughout:
  - **[V]** Verified in this session from the source itself: official PDF, publisher table of contents, regulator rule text, or the live page.
  - **[S]** Taken from search-engine snippets of the official page, because the page itself could not be fetched.
  - **[K]** Background knowledge of a well-known published work, not re-fetched in this session. These are reliable in outline but should be spot-checked before anything is quoted verbatim.
- **Research limits hit:**
  - The shared WebSearch budget ran out after 16 searches; the cap is 200 per turn, shared by every parallel agent. All later work used direct WebFetch of known URLs, about 45 fetches.
  - Several sites block automated fetching:
    - babypips.com and forums.babypips.com return 403 (Cloudflare).
    - investopedia.com is refused by the fetch tool.
    - cmegroup.com timed out on every attempt.
    - interactivebrokers.com (Traders' Academy), oreilly.com, investor.gov and ssrn.com return 403.
  - For Babypips and CME, the structure below therefore combines official-page snippets **[S]**, an official 2006 Babypips e-book **[V]** and background knowledge **[K]**.
- **Strongest primary sources obtained:**
  - The **CMT Program Guide 2026**: the full learning-objective list for Levels I, II and III.
  - Publisher tables of contents for Kaufman (6th ed.), Bulkowski (3rd ed.), Al Brooks (*Trends*, *Reversals*), Chan (*Quantitative Trading* 2nd ed., *Algorithmic Trading*).
  - The full StockCharts ChartSchool table of contents.
  - The IG Academy catalogue with levels.
  - The current **FINRA Rule 4210** text (the pattern day trader rule was removed effective 4 June 2026).
  - The ESMA CFD retail measures.
  - Barber & Odean (2000).

---

## 1. Curricula compared

### 1.1 CMT Association: Chartered Market Technician, Levels I, II and III [V]

**Source:** *CMT Program Guide 2026* (official PDF). This is the most rigorous, most "professional" trading-analysis curriculum in existence, and the closest thing to a body of knowledge for technical analysis.

| Level | Official title | Study time | Exam | Cognitive goal |
|---|---|---|---|---|
| I | Foundational Principles of Technical Analysis: "Core Concepts and Underlying Theories and Terminology / The Tools and Methods Used in TA" | 40-100 h | 132 MCQ (120 scored), 2 h | Know and define |
| II | Application of Technical Analysis Methods: "...to Identify Opportunities and Manage Risk" | 100-140 h | 170 MCQ (150 scored), 4 h | Apply |
| III | The Work of a Technical Analyst: "Integrating Concepts and Tools into Methods for Analyzing Market Action and Managing Positions and Risk" | 120-160 h | MCQ + short answer (case groups of 3-7 items weaving 2+ domains), 4 h | Integrate and justify |

**Knowledge-domain weights (2026)** [V]

| Domain | Level I | Level II | Level III |
|---|---|---|---|
| Theory and History | 38% | 7% | - |
| Classical Techniques | 33% | 40% | - |
| Advanced Techniques | 26% | 40% | - |
| Application of Technical Analysis | - | 10% | 95% |
| Ethics | 3% | 3% | 5% |

*(Older third-party tables, for example Efficient Learning's "Chart & Pattern Analysis 23%, Trend 16%, Risk Management 15%...", reflect a pre-2024 topic taxonomy and are superseded.)*

**Level I domain outline** [V]

- **I. Theory and History:** Evolution of TA; Key Concepts in TA and Market Analysis; Behavioral Finance.
- **II. Classical Techniques:** Chart Types and Construction; Trend Analysis; Chart Pattern Analysis; Internal and External Technical Indicators; Cycles.
- **III. Advanced Techniques:** Statistical Analysis; Volatility Analysis; Systematic Trading; Cross-asset Analysis; Principles of Risk Management.
- **IV. Ethics:** CFA Institute Code and Standards, licensed; not in the textbooks.

**Level I sections and units, in curriculum order** [V]

1. **Theory and History of TA**
   - A Brief History of TA: Dow, early European and Asian charting.
   - The Dow Theory: tenets, confirmation, three price movements, the close as the key price.
   - Markets, Instruments, Data and the Technical Analyst: four asset classes, tradable instruments, data-handling issues.
   - The Opportunity of the Efficient Markets Hypothesis: EMH forms, joint-hypothesis problem, anomalies, arcsine law, random walk vs martingale, Fama's revision.
   - The Fibonacci Sequence and the Golden Ratio: retracements and extensions.
2. **Charts: Market Price Data**
   - Overview of Charting: line, bar and candle construction; four price points; range.
   - The X Axis: fractals, data interval, volume as the x-axis, point-and-figure (box size, reversal), range bars.
   - The Y Axis: arithmetic vs log scale.
   - Charting Volume and Open Interest.
3. **Trend Analysis**
   - What is a Trend: three primary movements, fractal price, principle of polarity.
   - A Trend's Four Phases: Wyckoff's four phases, the four primary trades, retracements, throwbacks vs pullbacks.
   - Trend Identification and Following: breakout confirmation, manual vs mathematical trend ID, one and two MAs, reward-to-risk, general risk principles.
   - Introduction to Volume Analysis: liquidity and participation.
   - Volume, Open Interest, and Price: VWAP defined.
   - Market Internals: breadth, leadership, volume.
4. **Chart Pattern Analysis**
   - Classical Chart Patterns: reversal and continuation patterns with their volume, the psychology of consolidation vs trend, flags and pennants, gaps.
   - Introduction to Candlesticks: history, anatomy, colouring, sentiment.
   - Introduction to Candlestick Patterns: reversal patterns, gaps, doji types, strengths and weaknesses.
   - Basics of Point-and-Figure: Xs and Os, box and reversal, basic patterns, trendlines.
5. **Technical Indicators**
   - Moving Averages: SMA, linearly weighted, Wilder, EMA; three common trend lengths; MA strategies; MA bands.
   - Technical Indicator Construction: two categories, momentum, volume indicators, price-and-volume indicators, DMI.
   - Introduction to Bollinger Bands.
6. **Statistics for Technicians**
   - Part 1: descriptive vs inferential, sample vs population, mean/median/mode, geometric mean, standard deviation and variance, z-scores.
   - Part 2: data visualisation, outliers, scatterplots, Pearson r, correlation vs causation, linear regression, R².
   - Probability: law of large numbers, i.i.d., normal distribution, Empirical Rule, skew and kurtosis.
7. **Behavioral Finance:** prospect theory, loss aversion, belief-perseverance, information-processing and emotional biases.
8. **Sentiment**
   - Crowd at trends and at turning points; challenges of sentiment indicators.
   - From market data: VIX, futures OI, options volume and OI, the three COT groups, insider activity, short interest.
   - From external data: news and advisories, contrary opinion, mutual-fund cash.
9. **Cycle Analysis**
   - Two types of cycles, three characteristics, Hurst's seven Principles of Commonality, harmonics, composite wave, left/right translation, dominant cycle, identification tools.
   - Common economic cycles.
10. **Comparative Market Analysis**
    - Equities: corporate actions, sectors, capitalisation.
    - Indexes: weighting, survivorship bias.
    - Fixed income: price/yield, issuers, terms, yield spread, yield curve.
    - Futures: purpose, terms, OI, classification, data challenges.
    - ETPs: ETF vs ETN, leveraged ETPs, impact on breadth.
    - FX: base/quote, majors/crosses, "dealer market" impact on TA, data.
    - Digital assets: blockchain, on-chain data.
    - Options: terms, the Greeks, implied volatility.
    - Relative Strength intro and uses: absolute vs relative trend, ranking, ratio analysis, top-down, "beach-ball effect", RS as a leading indicator.
11. **Volatility Analysis**
    - Meaning of volatility: HV vs IV, skew.
    - Measuring HV: Wilder True Range, Bollinger, volatility cycles, Keltner.
    - Options-derived volatility: VIX and its relation to the S&P 500, VIX base values, VIX spikes as bottoms.
12. **Systems and Quantitative Methods:** the investment process, the scientific method, survivorship bias in tests, trigger/filter/value rules, signals vs strategies vs models, "signal test before backtest".

**Level II sections** [V]

1. **Theory and History**
   - Alpha and Beta: EMH vs Adaptive Markets vs Fractal Market Hypothesis; anomalous supply/demand.
   - Fusion Analysis: technicians and fundamentalists working as a team.
2. **Behavioral Finance:** Anatomy of Market Bubbles, five stages.
3. **Charts**
   - Multiple data sets and intervals: multi-timeframe trend ID; intraday sampling issues.
   - Market Profile basics.
4. **Chart Patterns**
   - Price targets.
   - Breakout confirmation by the **3% rule vs the ATR-multiple rule**.
   - Range-bound mean-reversion vs breakout tactics.
   - Candlestick patterns in the real world: volume, confirmed vs unconfirmed, at S/R zones, complete vs incomplete, imperfect patterns, integration with chart patterns.
   - P&F vertical and horizontal counts.
5. **Trend Analysis**
   - Four phases of price-volume.
   - Market internals: A/D line, up/down volume, breadth and leadership indicators, qualitative analysis.
6. **Volatility**
   - Expected ranges from VIX.
   - Volatility Risk Premium: capturing it with options.
   - VIX term structure (contango/backwardation) as a hedging warning; VIX calls vs SPX puts.
7. **Sentiment**
   - Stock market: insider activity, short-interest ratio, surveys.
   - Derivatives: futures OI, COT, put/call ratios, options volatility data.
8. **Statistics:** inferential statistics; hypothesis testing; type I and II errors.
9. **Technical Indicators**
   - Momentum, Parts 1 and 2: velocity vs acceleration, overbought/oversold by trend regime, divergences, price vs momentum reversals, "three steps of a valid signal".
   - VWAP: execution quality, "true dollar average", buyers vs sellers in control, intraday volume pattern.
   - Bollinger: %b, BandWidth, two-bar reversals, squeezes and bulges.
10. **Comparative Market Analysis:** Relative Rotation Graphs (JdK RS-Ratio and RS-Momentum, rotation sequence).
11. **Cycle Analysis**
    - Mid-cycle dip, ¾-cycle high, inversions, translation, CMA envelope, valid trendline.
    - Applied cycle analysis: spectrogram, phasing.
    - Seasonal cycles: detrending.
    - **Elliott Wave** Parts 1 and 2: notation, motive vs corrective, impulse/extension/diagonal, zigzag/flat/triangle, alternation, depth, psychology, Fibonacci relationships.
    - Time-based tools.
12. **Systems and Quantitative Methods**
    - Five common trading models, go/no-go metrics, four ways to generate signals, seven steps to a consistently profitable system.
    - The quantitative process; trade, performance and accounting measures: annualised return and volatility, CAGR, max drawdown, profit factor, expected value.
    - Sharpe, Information, Sortino, Calmar.
    - Stop calculations; robustness in optimisation.
13. **Application of TA**, five standing objectives that carry into Level III:
    - Charts for entries and exits.
    - Risk plans using technical, behavioral, quantitative analysis and leverage.
    - Evaluating model output.
    - Asset weighting via RS, trend and momentum.
    - Volatility in forecasting and trade management.

**Level III sections** [V]

1. **Quantifying and Managing Risk** (note: risk opens Level III)
   - Utility for risk-seeking, risk-neutral and risk-averse investors; why risk appetite falls as the portfolio grows.
   - The professional approach to trading.
   - VaR and CVaR; the effect of leverage; risk targeting.
   - Diversification types and common mistakes; selecting uncorrelated securities.
2. **Classical Chart Analysis**
   - Designing trades: objective, entry and stop using the 3% and ATR rules.
   - Reward-to-risk; trading failed patterns.
   - Candlesticks within a broader Western framework and in risk management.
   - P&F case studies (Davis): stops, targets and position size.
3. **Trend Analysis:** market internals for judging market health.
4. **Technical Indicators**
   - Anchored VWAP, Parts 1 and 2: anchoring bias, time and event anchors, drawbacks.
   - Bollinger advanced implementation; multicollinearity; M-tops and W-bottoms with %b.
5. **Volatility:** VVIX, SKEW, MOVE; why VIX is a diversifier rather than a hedge; implied-volatility portfolio strategies; three rules for improving the probability of success.
6. **Comparative Market Analysis:** RRG advanced, open vs closed universes, RRG for FX, top-down stock selection.
7. **Systems and Quantitative Methods**
   - Statistics of backtesting: four statistical features of price series, log returns, signal test vs backtest.
   - Systematic development and risk: mark-to-market; risk-per-trade vs risk-per-unit-of-time.
   - Counter-trend models with volatility-based position sizing.
   - Systematic tactical asset allocation: All-Weather and its weaknesses.
   - Expectancy formula; contrasting systems.
8. **Portfolio Management**
   - Fusion analysis, P = (F × V) S: combining fundamentals, trend and relative outperformance.
   - Long-term trend following vs swing trading.
   - Sector-rotation portfolio construction; a practitioner's TA-in-portfolio view.
   - **Digital assets:** Bitcoin as benchmark, macro drivers, on-chain metrics, reflexivity.
   - Fusion analysis team practice (FINRA Rule 344 history).
   - Contrarianism, crowd behaviour, groupthink and its mitigation.

**What CMT emphasises**
- Theory and history first.
- Breadth across tools and asset classes.
- Statistics and behavioral finance from Level I.
- Volatility analysis as a first-class pillar.
- Systematic testing hygiene: signal test before backtest, survivorship bias, robustness.
- Portfolio context (relative strength, RRG, sector rotation, TAA).
- **Spiral design**: almost every topic recurs three times with rising depth:
  - candlesticks: intro, then real world, then within the broader framework and risk;
  - Bollinger: intro, then practical, then advanced;
  - RS: intro, then RRG, then RRG advanced;
  - VWAP: definition, then VWAP use, then Anchored VWAP.

**What CMT skips or under-weights**
- Order types and execution mechanics; broker selection; retail cost structure (spreads, swaps, CFDs).
- Taxes.
- Platform skills.
- Personal trading psychology as self-management: it is taught academically as biases.
- Journaling and review routines.
- Intraday bar-by-bar price action (Brooks-style) and order flow / DOM; Market Profile beyond basics.
- Harmonics and Gann; retail fads such as SMC.

**Ethics**
- Ethics is **not first**. It is a small constant domain at every level (3%, 3%, 5%), sourced from the CFA Code and Standards.
- Theory and History is the opening module. Risk opens Level III.

---

### 1.2 Babypips: School of Pipsology (forex; free core plus Premium)

**Current structure (2026): 11 courses, about 456 lessons** (the official progress counter reads "of 456"; one 2026 review says about 350) [S]

| # | Course | Access | Stated scope |
|---|---|---|---|
| 1 | Preschool | Free | "An introduction to the foreign exchange market" |
| 2 | Kindergarten | Free | "How to choose a forex broker and analyze the currency markets"; visible lessons: *Forex Brokers 101*, *How to Choose a Forex Broker*, execution models (A-Book, STP, internalization) |
| 3 | Elementary | Free | "The beginner's guide to technical analysis" |
| 4 | Middle School | Free | "Properly use chart indicators, spot chart patterns and use pivot points" (includes leading vs lagging indicators) |
| 5 | Summer School | Free | "Heikin Ashi, Elliott Wave Theory and harmonic price patterns" |
| 6 | High School | Premium | "Price action trading, trading breakouts, multiple time frames": market structure, swing points, supply/demand zones, candle context; breakouts vs fakeouts (retests, traps, break-and-retest entry, higher-timeframe filter); Grade 12 Multiple Time Frame Analysis (top-down, common mistakes); "market environment" lessons |
| 7 | Undergraduate: Freshman | Premium | "Fundamental Analysis: A Macro Fundamentals Approach": economic data, central bank decisions, geopolitical events |
| 8 | Undergraduate: Sophomore | Premium | Intermarket, "how institutional traders watch... gold, oil, bonds, equities, and global liquidity" and how they move currencies |
| 9 | Undergraduate: Junior | Premium | Personalised **trading plan**, choosing a **trading style** for your life and temperament, a **rule-based testable system**, a **trading journal**, reviewing performance data, risk and discipline |
| 10 | Undergraduate: Senior | Premium | **Risk Management** module ("Protect your account before..."): "the math of losing", rules that keep losses survivable, a personal risk management plan |
| 11 | Graduation | Premium | Graduation speech / capstone |

**Lesson-level detail of the pre-2025 free curriculum** [K] (approximate; it shows how the grades were filled)

- **Preschool:** What is Forex; How do you trade forex; When can you trade (sessions); Who trades; Why trade forex; pips, pipettes and lots; leverage and margin ("Margin Trading 101").
- **Kindergarten:** Forex Brokers 101; Three Types of Analysis (technical, fundamental, sentiment); Types of Charts.
- **Elementary:** Grade 1 Support and Resistance; Grade 2 Japanese Candlesticks; Grade 3 Fibonacci; Grade 4 Moving Averages.
- **Middle School:** Grade 5 Popular Chart Indicators (Bollinger, MACD, Parabolic SAR, Stochastic, RSI, ADX, Ichimoku); Grade 6 Oscillators and Momentum (leading vs lagging); Grade 7 Important Chart Patterns; Grade 8 Pivot Points.
- **Summer School:** Heikin Ashi; Elliott Wave; Harmonic Price Patterns.
- **High School:** Trading Divergences; Market Environment; Breakouts and Fakeouts; Multiple Time Frame Analysis.
- **Undergraduate (older version):**
  - Fundamental analysis; currency crosses; market sentiment (including the COT report); trading the news; carry trade; US Dollar Index.
  - Intermarket correlations; using equities to trade FX; country profiles.
  - Developing a trading system; creating a trading plan; "which type of trader are you".
  - Risk management; "the number one cause of death of forex traders" (undercapitalisation and over-leverage); position sizing; setting stop losses; scaling in and out; currency correlations.
  - Forex scams; personality quiz.

**Original 2006 e-book order** [V] (copyright 2006 BabyPips.com)
- Orientation: success defined as "Make pips, Keep pips, Repeat".
- Preschool: Types of Trading (fundamental vs technical).
- Kindergarten: Types of Charts.
- Grades 1 to 14, in order:
  1. Japanese Candlesticks
  2. Support & Resistance, Trend Lines, Channels
  3. Fibonacci
  4. Moving Averages
  5. Common Chart Indicators
  6. Oscillators and Momentum
  7. Important Chart Patterns
  8. Pivot Points
  9. Multiple Timeframes
  10. Elliott Wave
  11. **Create Your Own Trading System**
  12. Market Hours
  13. **Money Management**
  14. **Plan Your Trade and Trade Your Plan**

**What Babypips emphasises**
- Accessible, humorous, gamified "school grade" metaphor; zero-to-basic forex literacy.
- Technical tools first and in great breadth: S/R, candles, Fibonacci, MAs, indicators, patterns, pivots, then Elliott Wave and harmonics early.
- Newer versions add price action, multi-timeframe, macro and intermarket blocks and a much stronger plan/journal/risk capstone.

**What Babypips skips or under-weights**
- **Risk and money management arrive late.** In 2006 they were grade 13 of 14; in 2026 they are course 10 of 11 and Premium, so after a learner has met roughly 300+ lessons of tools.
- Little statistics (expectancy, sample size, significance).
- Backtesting rigour.
- Market microstructure, apart from broker execution models.
- Explicit cost accounting (spread, swap) beyond basics.
- Psychology is light.
- Single asset class (forex; a separate School of Crypto exists).
- No options or futures; no regulation or taxes depth.
- Reviews note no live practice integration and a possible conflict of interest (broker referral revenue).

---

### 1.3 CME Group Education (CME Institute) [S; site fetch timed out]

**Core courses surfaced from official course pages**
- **Introduction to Futures:** contract specifications, trading codes, expiration and settlement, tick sizes, price limits, notional value, **margin**, speculators vs hedgers. Aimed at people new to futures.
- **Things to Know Before Trading CME Futures:** account set-up with a broker/FCM, **order types**, how orders reach the exchange, managing and closing positions. Stresses that futures and options on futures differ importantly from stocks, ETFs and CFDs.
- **All About Options** (a curriculum of linked courses): options-on-futures basics, strike, expiration, calls and puts, moneyness, intrinsic value, **put-call parity**, volatility; options on futures vs ETFs.
- **Options on Futures for Equity Traders:** pricing of options on futures, diversification.
- Free **trading simulator**: charts, indicators, strategy testing, account management.
- CE credit: CFA (self-report) and some GARP.

**Product-level courses** [K] (not verified): equity index, interest rates, energy, metals, agriculture, FX, cryptocurrency and Micro contracts; contract roll and expiration; mark-to-market and daily settlement; physical vs cash settlement; spreads; options strategies.

**Emphasis:** product mechanics, margin and leverage, the exchange and clearing process, risk transfer (hedgers vs speculators); risk and margin are embedded from lesson one.

**Skips:** discretionary technical strategies, psychology, trade journaling, retail FX/CFD.

---

### 1.4 StockCharts ChartSchool [V], a reference encyclopedia rather than a sequenced course

**Overview**
- What is TA?
- Introduction to Investing: why analyse securities; TA; FA; random walk vs non-random walk; asset allocation and diversification; options trading.
- "Must-read": Murphy's Ten Laws of Technical Trading; Murphy's *Charting Made Easy*; TA 101.
- Psychology of Investing: irrational exuberance; cognitive biases.
- TA Rules and Guidelines: Arthur Hill on goals, style and strategy; MA crossovers; **multicollinearity**; Gatis Roze's *The Trader's Journal*; Bob Farrell's 10 Rules; Richard Rhodes' trading rules; Donchian guidelines; why and how to use correlation.

**Chart Analysis**
- Fundamentals: what are charts; S/R; trend lines; gaps and gap analysis; intro to chart patterns; chart patterns.
- Chart types: Arms CandleVolume, CandleVolume, Elder Impulse, EquiVolume, Heikin-Ashi, Kagi, Renko, Three Line Break, MarketCarpets, RRG, Seasonality, Yield Curve.
- Candlesticks: intro; candles and traditional analysis; candles at support; candles at resistance; bullish reversal patterns; bearish reversal patterns; pattern dictionary.
- Point and Figure.
- Annotation tools: Andrews' Pitchfork, cycles, Fibonacci retracements, arcs, fans and time zones, quadrant lines, Raff regression channel, speed resistance lines.

**Technical Indicators and Overlays**
- Introduction.
- **23 overlays:** Alligator, Anchored VWAP, Bollinger Bands, Chandelier Exit, DEMA, Highest High, Hull MA, Ichimoku, KAMA, Keltner, linear regression forecast and intercept, Lowest Low, Moving Averages, MA Ribbon, MA Envelopes, Parabolic SAR, Pivot Points, Price Channels, TEMA, Volume-by-Price, VWAP, ZigZag.
- **66 indicators**, including: A/D Line, Aroon, ATR (with bands, trailing stops, ATRP), ADX, Balance of Power, BandWidth, %B, CMF, Chaikin Oscillator, CCI, ConnorsRSI, Coppock, correlation coefficient, PMO, DPO, distance from highs/lows/MA, Ease of Movement, Force Index, linear regression R², Mass Index, MACD, MACD-Histogram, MACD-V, MFI, NVI, OBV, PPO, PVO, price relative/RS, KST, Special K, ROC/Momentum, RSI, RVOL, RRG RS, SCTR, slope, standard deviation, Stochastics, StochRSI, TRIX, TSI, TTM Squeeze, Ulcer Index, Ultimate Oscillator, Vortex, Williams %R.

**Market Indicators (breadth and sentiment)**
- A/D Line, A/D Percent, A/D Volume Line and Percent, Arms Index (TRIN), Bullish Percent Index, DecisionPoint ITBM/ITVM/Rydex Ratio/STO.
- High-Low Index and Percent, McClellan Oscillator and Summation, Net New 52-week Highs, Percent Above MA, Pring's indicators, Put/Call Ratio, Record High Percent, Volatility Indices.

**Market Analysis**
- Dow Theory; sector rotation; intermarket analysis; yield curve; DecisionPoint chart gallery and Rydex asset analysis.
- **Wyckoff**: market analysis, stock analysis, method tutorial.
- **Elliott Wave**: intro, identifying patterns, guidelines.

**Trading Strategies and Models (22)**
- DecisionPoint Trend Model; Bollinger Band Squeeze; CCI Correction; CVR3 VIX timing; Faber sector rotation; gap trading; harmonic patterns; Hindenburg Omen; Ichimoku.
- "Last" Stochastic; MACD zero-line crosses with swing points; MA strategies; Moving Momentum; NR7; % above 50-day; %B Money Flow; pre-holiday effect; **RSI(2)**; six-month cycle MACD; slope performance trend; Stochastic Pop and Drop; swing charting; trend quantification and asset allocation.

**Emphasis:** US equities; indicator and breadth encyclopaedia; Murphy-school classical TA.

**Skips:** order execution; position-sizing depth; statistics of testing; a sequenced pedagogy.

---

### 1.5 IG Academy (CFD/spread-bet broker) [V: titles and levels]

| Level | Courses |
|---|---|
| **Beginner** | Introducing the financial markets; How does trading work? (participants, price formation); How spread betting and CFD trading work; A beginner's guide to investing; Building your own investment strategy; Using trading and investment products; Choosing a market to spread bet on; How to choose the right product |
| **Intermediate** | **Orders, execution and leverage**; **Understanding risk and reward** ("five simple rules"); **Using stops and limits to manage risk**; **Planning and risk management**; Fundamental analysis; The basics of technical analysis; **Trading psychology**; Tools for traders (demo accounts); Finetuning your investment strategy |
| **Advanced** | Trading volatile markets; Fundamentals of trend trading; Range trading; Breakout trading; Trading options with CFDs; Trading listed options |

**Emphasis:** products and mechanics first. Orders, leverage, stops, risk/reward, planning and psychology sit at the **same intermediate tier as TA and FA, before any strategy course**. Strategies are organised by *market regime* (trend, range, breakout, volatile).

**Skips:** statistics and backtesting; microstructure; depth in indicators and patterns; cost transparency about the broker's own model (conflict of interest).

---

### 1.6 Other platforms (lighter evidence)

- **Saxo Learn** [V]:
  - New to investing: risk tolerance, fear of investing, mistakes.
  - Investing 101 product guides: stocks, ETFs, funds, bonds, options, CFDs, FX, commodities.
  - How-tos: volatility, stocks, quarterly earnings, trading strategies.
  - Diversification: 6-step portfolio, geographic, Markowitz to modern, six risk-management strategies.
  - Glossary, webinars, podcasts, compound-interest calculator.
  - Investor-oriented; little TA.
- **TradingView Education** [V]: no structured curriculum; a community feed of ideas tagged *Education*. Dominant topics: chart patterns, price action and market structure, **Smart Money Concepts (order blocks, liquidity, fair-value gaps)**, S/R and supply/demand zones, trendlines, occasional risk and order-execution explainers. Pine Script for automation. Important as a signal of **what modern retail learners already believe** (SMC/ICT vocabulary) and will expect to see addressed.
- **Interactive Brokers Traders' Academy** [K; 403]:
  - Free courses grouped by asset class (stocks, options, futures, forex, bonds, ETFs, mutual funds).
  - Margin and short selling; platform (TWS) and **API/Python** (IBKR Quant); technical and fundamental analysis.
  - Strongly product- and tool-centric with professional depth on options and futures.
- **Investopedia** [K; blocked]:
  - Free hub, roughly: TA basic education, chart patterns, candlesticks, indicators, trading strategies, risk management, day trading, options and derivatives.
  - Paid "Investopedia Academy" courses (day trading, TA, options).
  - Encyclopaedic, not sequenced.
- **NYU Stern, Hasbrouck, "Principles of Securities Trading" (FINC-UB.0049, Fall 2025)** [V]:
  - A university **market-microstructure** course: design, operation and regulation of trading mechanisms across stocks, bonds, derivatives and crypto.
  - Tensions it examines: efficiency vs fairness, fragmentation vs consolidation, speed vs stability.
  - Teaches by **trading simulations**: a floor-market exercise, then electronic exercises on the Rotman Interactive Trader.
  - States it "does not teach profitable trading strategies or day trading or HFT, and aims to show the substantial barriers to long-term success".
  - Teaching notes, *Securities Trading: Principles and Procedures*, cover limit order books, auctions, dealer markets, US regulation, and private-information models (Glosten-Milgrom, Easley-O'Hara).
  - A direct precedent for simulator-based teaching.

---

### 1.7 Regulators: what retail *must* understand [V]

**FINRA, US equities**

The investor day-trading page (2026) covers:
- Cash accounts: pay in full; "free-riding" and "good faith" violations; **T+1** settlement means intraday trades in a cash account need settled funds.
- Margin accounts: **$2,000 minimum equity**; intraday margin is computed on positions held *during* the day.
- An *intraday margin deficit* must be met "as promptly as possible"; repeated failure means a **90-day margin freeze**.
- Risks: you can lose more than you deposited; frequent trading brings costs, taxes and time.

**FINRA Rule 4210, current text**
- Paragraph (f)(8)(B), formerly the pattern-day-trader provision, is now "**Reserved**". There is **no $25,000 PDT minimum** any more.
- It is replaced by paragraph (d)(2) **intraday margin standards**:
  - A deficit is outstanding until met or until the 15th business day.
  - A "practice" of not curing deficits by the 5th business day means a 90-calendar-day restriction.
  - Deficits not exceeding the lesser of 5% of equity or $1,000 are excluded.
- Maintenance margin is 25%. Initial margin is the greatest of the Reg T amount, the (c) amount, or $2,000 equity.
- Amended by **SR-FINRA-2025-017, effective 4 June 2026**.
- **Implication:** most retail education (and most AI training data) still teaches the "$25k / 4 day trades in 5 days" PDT rule. Our course must date-stamp regulatory content and treat the PDT rule as *historical*.

**ESMA, EU CFD retail measures**
- Leverage caps:
  - **30:1** major FX pairs
  - **20:1** non-major FX, gold and major indices
  - **10:1** other commodities and non-major indices
  - **5:1** single equities
  - **2:1** crypto
- **Margin close-out at 50%** of required margin, per account.
- **Negative balance protection.**
- Ban on trading incentives.
- A standardised risk warning that discloses the provider's % of losing retail accounts. National regulator analyses found **74-89% of retail CFD accounts lose money**, with average losses of €1,600 to €29,000.
- Binary options are **banned** for retail.

**US retail FX (CFTC/NFA)** [K]: 50:1 leverage on majors and 20:1 on others; no CFDs for US retail.

---

### 1.8 Canonical books: structure, emphasis, gaps

**John J. Murphy, *Technical Analysis of the Financial Markets* (NYIF, 1999)** [K]

Chapters:
1. Philosophy of TA
2. Dow Theory
3. Chart Construction
4. Basic Concepts of Trend (S/R, trendlines, channels, percentage retracements, speed lines, reversal days, gaps)
5. Major Reversal Patterns
6. Continuation Patterns
7. Volume and Open Interest
8. Long-Term Charts
9. Moving Averages
10. Oscillators and Contrary Opinion
11. Point and Figure
12. Japanese Candlesticks
13. Elliott Wave
14. Time Cycles
15. Computers and Trading Systems
16. Money Management and Trading Tactics
17. Intermarket Analysis and Asset Allocation
18. Stock Market Indicators (breadth)
19. Pulling It All Together: a checklist

Appendices: advanced indicators, Market Profile, building a trading system, continuous futures.

- *Emphasis:* the classic canon and intermarket analysis. Close to CMT Level I.
- *Gap:* money management is chapter 16 of 19; little statistics; no psychology chapter.

**Steve Nison, *Japanese Candlestick Charting Techniques* (2nd ed.)** [K]
- *Part 1, The Basics:* history; constructing the lines; reversal patterns (hammer, hanging man, engulfing, dark cloud cover, piercing); stars (morning/evening, doji star, shooting star, inverted hammer); more reversals (harami, tweezers, belt-hold, upside-gap two crows, three black crows, three advancing white soldiers, three mountains/rivers, counterattack, dumpling tops/fry-pan bottoms, tower tops/bottoms); continuation patterns (windows, tasuki gaps, gapping plays, side-by-side white lines, rising/falling three methods, separating lines); the magic doji; putting it all together.
- *Part 2, The Convergence (East meets West):* candles with trendlines, retracements, moving averages, oscillators, volume; measured moves.
- *Emphasis:* candles only work **in context**: trend, S/R, confirmation. Part 2 is the pedagogically important half.
- *Gap:* no statistics of pattern reliability.

**Thomas Bulkowski, *Encyclopedia of Chart Patterns* (3rd ed., Wiley 2021)** [V]
- Introduction; ch. 1 **How to Trade Chart Patterns**.
- Then 75 patterns alphabetically:
  - AB=CD, Bat, Butterfly, Crab and Gartley (bullish and bearish), Big M/W.
  - Broadening bottoms, tops, formations (right-angled ascending/descending) and wedges.
  - Bump-and-run reversal tops and bottoms, Cloudbanks, Cup with Handle (and inverted), Diamond tops and bottoms, Diving Board.
  - Double tops and bottoms in four Adam/Eve variants each, flags, high-and-tight flags, gaps.
  - Head-and-shoulders tops and bottoms (and complex), horn tops and bottoms, island reversals, measured moves up and down, pennants, pipe tops and bottoms.
  - Rectangle tops and bottoms, Roof (and inverted), rounding tops and bottoms, scallops (four kinds), three falling peaks, three peaks and domed house, three rising valleys.
  - Triangles (ascending, descending, symmetrical), triple tops and bottoms, V-tops and V-bottoms (and extended), wedges (falling, rising), Wolfe Waves.
- Then a statistics summary, glossary and visual index.
- *Emphasis (per the publisher):* **performance statistics and failure rates** per pattern, stop-loss trigger tables, **busted patterns**, how performance changed over three decades, sample trades.
- This is the antidote to "pattern folklore": the first chapter is *how to trade them*, and every pattern carries base rates.

**Al Brooks, *Trading Price Action* trilogy (Wiley, 2011-12)**
- ***Trends*** [V]:
  - Intro, list of terms.
  - Part I Price Action: spectrum from extreme trends to extreme ranges; trend bars, doji bars, climaxes; breakouts, ranges, tests, reversals; signal bars, entry bars, setups and candle patterns; reversal and other signal bars; outside bars; importance of the close; ETFs and inverse charts; second entries; late and missed entries; pattern evolution.
  - Part II Trend Lines and Channels: trend lines; trend channel lines; channels; micro channels; horizontal lines (swing points and key levels).
  - Part III Trends: how to trade a trend; signs of strength; two legs.
  - Part IV Common Trend Patterns: spike and channel; trending trading-range days; trend from the open and small-pullback trends; reversal day; trend resumption day; stairs.
- ***Trading Ranges*** [K, approximate]:
  - Breakouts: signs of strength, failed breakouts, breakout pullbacks and tests, gaps.
  - Magnets (support/resistance): measured moves from legs, gaps and ranges; prior signal bars.
  - Pullbacks: first pullback sequences, double-top bear flags and double-bottom bull flags, 20-gap-bar and MA-gap-bar setups, counting legs (H1/H2, L1/L2), wedge flags, reversal attempts.
  - Trading ranges: tight ranges, triangles.
  - **Orders and Trade Management:** scalping vs swinging; **"mathematics of trading": the trader's equation** (probability × reward vs risk); needing two reasons; entering on stops vs limits; protective and trailing stops; profit targets; scaling in and out; getting trapped in or out.
- ***Reversals*** [V]:
  - Part I Trend Reversals: how to trade one; signs of strength; major trend reversal; climactic reversals; wedges and three-push patterns; expanding triangles; final flags; double top/bottom pullbacks; failures; huge-volume reversals on daily charts.
  - Part II Day Trading: key times of day; markets; time frames and chart types; Globex, pre- and post-market and overnight; "Always In"; extreme scalping.
  - Part III The First Hour (opening range): premarket patterns; patterns related to yesterday (breakouts, breakout pullbacks, failed breakouts); opening patterns and reversals; gap openings.
  - Part IV Putting It All Together: detailed day-trading examples; daily, weekly and monthly charts; options; the best trades; trading guidelines.
- *Emphasis:* bar-by-bar reading of context, probability and the trader's equation; intraday E-mini focus.
- *Gap:* very dense, idiosyncratic jargon, no statistics, a steep beginner barrier.

**Van K. Tharp, *Trade Your Way to Financial Freedom* (2nd ed.)** [K]
- Part One, "The Most Important Factor in Your Success: You!": the Holy Grail legend; judgmental biases; setting objectives.
- Part Two, Conceptualising your system: steps to develop a system; selecting a concept that works; the big picture.
- Part Three, Key parts of a system: **expectancy**; setups; entry/market timing; protective stops ("knowing when to fold them"); profit-taking.
- Part Four, Putting it together: opportunity and trading costs; **position sizing as the key to meeting objectives**; conclusion.
- *Emphasis:* **R-multiples, expectancy, position sizing**; entry is the *least* important part.
- *Gap:* light on market analysis.

**Mark Douglas, *Trading in the Zone* (2000)** [K]

Chapters:
1. The Road to Success: Fundamental, Technical or **Mental** Analysis?
2. The Lure and Dangers of Trading
3. Taking Responsibility
4. Consistency: a State of Mind
5. The Dynamics of Perception
6. The Market's Perspective
7. **The Trader's Edge: Thinking in Probabilities** (the "five fundamental truths")
8. Working with Your Beliefs
9. The Nature of Beliefs
10. The Impact of Beliefs on Trading
11. Thinking Like a Trader (a sample-of-20-trades exercise)

- *Emphasis:* probabilistic mindset, outcome independence, accepting risk.
- *Gap:* no method content at all, by design.

**Alexander Elder, *The New Trading for a Living* (Wiley, 2014)** [V publisher description; K structure]
- Built on "**Mind, Method, Money**" plus record-keeping.
- Parts, approximately: individual psychology (why trade, gamblers, self-destructiveness, losers' and winners' lessons); mass psychology (what is price, the market crowd, psychology of trends, managing vs forecasting); classical chart analysis; computerised TA (MAs, MACD, Directional System, oscillators, Stochastic, RSI); volume and time (OBV, Force Index, OI, timeframes); general market indicators (New High-New Low, % above MA); trading systems (system testing and paper trading, **Triple Screen**, **Impulse System**, channel trading); trading vehicles (stocks, ETFs, options, CFDs, futures, forex); **risk management (the 2% rule and 6% rule, the "iron triangle" of position sizing)**; practical details (targets and stops); **good record-keeping (trader's spreadsheet, trading journal, trade plan, readiness self-rating)**.
- *Emphasis (per the publisher):* psychology and discipline; risk and money management with entries, targets and stops; "asymmetrical market zones"; templates to rate trades and readiness; a record-keeping system "to make you your own teacher".
- *Psychology comes first in the sequence.*

**Perry Kaufman, *Trading Systems and Methods* (6th ed., Wiley 2019)** [V], 24 chapters
1. Introduction (role of TA, random walk, choosing a style, **measuring noise**, system development guidelines)
2. **Basic Concepts and Calculations** (data, error, averages, distributions and moments, standardising risk/return, index construction, probability, supply/demand)
3. Charting (Dow interpretation, trendlines, one-day patterns, continuation, accumulation/distribution, price objectives, candles)
4. Charting Systems (Dunnigan thrust, Nofri, inside/outside days, pivots, channel breakout, CCI, Wyckoff, computer pattern recognition)
5. Event-Driven Trends (swing trading, P&F, N-day breakout)
6. Regression Analysis (linear and nonlinear, ARIMA)
7. Time-Based Trend Calculations (moving averages, exponential smoothing, lags)
8. Trend Systems (why they work, bands, choosing the period, single, two and three trends, early exits)
9. Momentum and Oscillators (divergence, double smoothing, velocity and acceleration)
10. Seasonality and Calendar Patterns
11. Cycle Analysis (maximum entropy, phasing)
12. Volume, Open Interest and Breadth (intraday volume patterns, Market Facilitation Index)
13. Spreads and Arbitrage (carry trade, implied vs historical volatility)
14. Behavioral Techniques (measuring the news, event trading, **COT**, contrary opinion, Fibonacci, Elliott, Fischer, **Gann**, *financial astrology*)
15. Short-Term Patterns (time of day, opening gaps, weekday effects, AI)
16. Day Trading (**transaction costs, slippage and liquidity**, intraday breakouts, HFT)
17. Adaptive Techniques
18. Price Distribution Systems (Market Profile)
19. Multiple Time Frames (Elder Triple Screen, Krausz, Pring KST)
20. Advanced Techniques (volatility, liquidity, noise, fuzzy logic, game theory, fractals and chaos, genetic algorithms, neural networks, ML/AI)
21. **System Testing** (test data, integrity, parameters, optimisation, costs, robustness, price shocks)
22. **Adding Reality** (extreme events, theory of runs, too-good-to-be-true results)
23. **Risk Control** (mistaking luck for skill, measuring risk/return, position sizing, stops, leverage, compounding, **probability of ruin**, optimal f, expected vs actual)
24. Diversification and Portfolio Allocation

- *Emphasis:* statistics first, then the full method encyclopaedia, then testing, reality checks and risk. The systematic professional's reference.

**Ernest Chan, *Quantitative Trading* (2nd ed., Wiley 2021)** [V]
1. The whats, whos and whys (business case, scalability, time demand)
2. **Fishing for ideas** (strategy fit to working hours, programming skill, capital and goals; benchmark, drawdown, transaction costs, **survivorship bias**, regime change, **data-snooping**)
3. **Backtesting** (platforms: Excel, MATLAB, Python, R, QuantConnect, Blueshift; adjusted and survivorship-free data; performance measurement; look-ahead and data-snooping bias; costs; refinement)
4. Setting up your business (retail vs prop, broker choice, infrastructure)
5. Execution systems (semi- and fully automated, minimising costs, **paper trading**, why live diverges)
6. **Money and risk management** (optimal leverage, Kelly, model, software and disaster risk, **psychological preparedness**)
7. Special topics (mean reversion vs momentum, regime change and conditional parameter optimisation, **stationarity and cointegration**, factor models, exit strategy, seasonal, HFT, leverage vs beta)
8. Conclusion

**Chan, *Algorithmic Trading: Winning Strategies and Their Rationale* (Wiley 2013)** [V]
1. Backtesting and automated execution
2. Basics of mean reversion
3. Implementing mean reversion strategies
4. Mean reversion of stocks and ETFs
5. Mean reversion of currencies and futures
6. Interday momentum
7. Intraday momentum
8. Risk management

**Larry Harris, *Trading and Exchanges: Market Microstructure for Practitioners* (OUP 2003)** [K]
- I Introduction: the trading industry; **orders and order properties**; market structures; order-driven markets; brokers.
- II Benefits of trading: why people trade; good markets.
- III Speculators: informed traders and market efficiency; **order anticipators**; **bluffers and manipulation**; dealers; **bid/ask spreads**; block traders; value traders; arbitrageurs; buy-side traders.
- IV Origins of liquidity and volatility: liquidity; volatility; transaction-cost measurement; performance evaluation and prediction.
- V Evaluation of market structure: index markets; specialists; internalization, preferencing and crossing; competition within and among markets; floor vs automated systems.
- Later chapters: insider trading; bubbles, crashes and circuit breakers; transparency.
- *Emphasis:* **who is on the other side of your trade and why**; trading as a zero-sum game among trader types. The single best intermediate microstructure text for practitioners.

**Linda Raschke and Larry Connors, *Street Smarts* (1996)** [K, approximate]
- Short-term swing setups grouped by market behaviour:
  - **Tests:** Turtle Soup, Turtle Soup Plus One, 80-20s, Momentum Pinball, 2-Period ROC.
  - **Retracements:** The Anti, Holy Grail, ADX Gapper.
  - **Climax patterns:** Whiplash, three-day unfilled gap reversals, Wolfe Waves.
  - **Breakout mode:** news, range contraction (ID/NR4), historical volatility (Crabel).
  - Later parts: professional trading techniques and trade management.
- *Emphasis:* rule-based, testable short-term setups; failed-breakout trading; volatility contraction leads to expansion.

**Academic evidence on retail outcomes**
- **Barber & Odean (2000), "Trading Is Hazardous to Your Wealth"** (*J. Finance*) [V]:
  - 66,465 households, 1991-96.
  - The most active traders earned **11.4%/yr net vs 17.9%** for the market; the average household earned 16.4%.
  - Turnover was >75%/yr.
  - **Overconfidence** explains excessive trading.
- **Chague, De-Losso & Giovannetti (2019), "Day Trading for a Living?"**, Brazil, mini-index futures [K]:
  - Of individuals who day-traded on 300+ days, about **97% lost money**.
  - About 1% earned more than the minimum wage.
- **Barber, Lee, Liu & Odean**, Taiwan day traders [K]: **less than 1%** of day traders are predictably profitable net of fees.
- **ESMA** [V]: **74-89%** of retail CFD accounts lose money.

---

## 2. Master topic list: deduplicated taxonomy

**How to read the tables**
- **Level:**
  - **B** = Beginner (no prior knowledge)
  - **I** = Intermediate (can read a chart and size a trade)
  - **A** = Advanced (builds and evaluates their own method)
  - **E** = Expert / professional (quant, portfolio, institutional)
  - "B/I" means the topic is introduced at the first level and deepened at the second.
- **Prereq** lists topic IDs from this taxonomy.
- **Seen in** lists the curricula or books that teach the topic, using these codes:

| Code | Source | Code | Source |
|---|---|---|---|
| CMT1/2/3 | CMT Levels I, II, III | BP | Babypips |
| CME | CME Institute | SC | ChartSchool |
| IG | IG Academy | SAXO | Saxo Learn |
| TV | TradingView education | REG | FINRA/ESMA |
| HAS | NYU Hasbrouck course | MUR | Murphy |
| NIS | Nison | BUL | Bulkowski |
| BRK | Brooks | THA | Tharp |
| DOU | Douglas | ELD | Elder |
| KAU | Kaufman | CHAN | Chan |
| HAR | Harris | RAS | Raschke/Connors |

Domains:

| Code | Domain | Code | Domain |
|---|---|---|---|
| MB | Market basics and instruments | ME | Methodologies |
| MS | Market structure and microstructure | FA | Fundamental analysis |
| OX | Orders and execution | MN | Macro, news and intermarket |
| CH | Charting and candlesticks | SE | Sentiment |
| CP | Chart patterns | RM | Risk and money management |
| TR | Trend, S/R and zones | TM | Trade management |
| IN | Indicators and oscillators | PS | Psychology and behavioral finance |
| VP | Volume, OI, breadth and market profile | PJ | Plan, journal and review |
| PA | Price action | BT | Statistics, backtesting and system design |
| SS | Strategies and styles | AC | Asset-class specifics |
| DL | Derivatives and leverage | RG | Regulation, costs, taxes and ethics |
| TE | Technology and algo basics | | |

### 2.1 MB: Market basics and instruments

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| MB-01 | What a market is | A venue where buyers and sellers meet; price is the outcome of their supply and demand | B | none | all |
| MB-02 | Trading vs investing vs speculation vs gambling | Horizon, objective and expected-value differences; trading is a negative-sum game after costs | B | MB-01 | BP, IG, SAXO, DOU |
| MB-03 | Asset-class map | Equities, bonds, FX, commodities, indices, crypto, derivatives, and what drives each | B | MB-01 | CMT1, IG, SAXO |
| MB-04 | Bid, ask, last, spread | A two-sided quote; you buy at the ask and sell at the bid; the spread is the round-trip toll | B | MB-01 | BP, IG, HAR |
| MB-05 | Long vs short | Profit from rises or falls; short-selling mechanics (borrow, locate) | B | MB-04 | BP, IG, HAR |
| MB-06 | Units: tick, pip, point, lot, contract size, notional | How price changes convert into money per unit | B | MB-03 | BP, CME |
| MB-07 | P&L calculation | Absolute and % P&L, pip/tick value, account-currency conversion | B | MB-06 | BP, CME |
| MB-08 | Market participants | Retail, institutions, market makers, hedgers, speculators, arbitrageurs, central banks | B | MB-01 | BP, CME, IG, HAR |
| MB-09 | Sessions and market hours | Exchange hours, FX sessions (Sydney/Tokyo/London/NY) and overlaps, pre/post-market, holidays | B | MB-03 | BP, BRK |
| MB-10 | Currency pairs | Base/quote; majors, minors, crosses, exotics | B | MB-04 | BP, CMT1 |
| MB-11 | Equities and corporate actions | Shares; splits, dividends and spin-offs and their effect on price data | B | MB-03 | CMT1, SAXO |
| MB-12 | Indices and weighting | Price-, cap- and equal-weighted indices; rebalancing; survivorship bias in indices | B/I | MB-11 | CMT1, SC |
| MB-13 | ETPs (ETF/ETN), leveraged and inverse | Structure, tracking, leveraged-ETP decay, effect on breadth | I | MB-12 | CMT1, BRK, SAXO |
| MB-14 | Bonds basics | Price/yield inverse relation, coupon, maturity, yield curve, credit spreads | I | MB-03 | CMT1, SAXO |
| MB-15 | Commodities basics | Energy, metals, agriculturals; physical delivery; storage; seasonality | I | MB-03 | CME, KAU |
| MB-16 | Digital assets basics | Blockchain, exchanges, custody, 24/7 trading, on-chain data | B/I | MB-03 | CMT1, CMT3 |
| MB-17 | Brokers and account types | Dealing desk vs STP/ECN, A-book/B-book/internalisation; cash vs margin; demo accounts | B | MB-04 | BP, IG, CME, CHAN |
| MB-18 | Choosing a broker | Regulation, segregated funds, costs, execution quality, platform, red flags | B | MB-17, RG-01 | BP, IG |
| MB-19 | Liquidity and volatility (intro) | How easily size trades without moving price; how much price moves | B | MB-04 | CMT1, IG |
| MB-20 | Market data | OHLC, data intervals, adjusted data, continuous futures, FX dealer-quote data (no central volume) | I | MB-06 | CMT1, KAU, CHAN |
| MB-21 | Benchmarks, alpha and beta | Return vs benchmark; market sensitivity; the outperformance goal | I | MB-12 | CMT2, CHAN |
| MB-22 | Market efficiency debate | EMH, random walk vs martingale, Adaptive and Fractal Market Hypotheses; why TA might work | I/A | MB-21, BT-02 | CMT1, CMT2, KAU, SC |

### 2.2 MS: Market structure and microstructure

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| MS-01 | Exchange vs OTC vs dealer market | Where and how trades are matched; FX and CFDs are OTC and dealer-based | B/I | MB-17 | CMT1, HAR, HAS |
| MS-02 | Limit order book | Bids and asks queued by price-time priority; depth; how market orders "walk the book" | I | OX-01, OX-02 | HAR, HAS |
| MS-03 | Market makers and dealers | Liquidity providers quoting both sides; inventory and spread capture | I | MS-01 | HAR, HAS, BP |
| MS-04 | Auctions | Opening and closing auctions, call markets, auction imbalance | I/A | MS-02 | HAS, HAR |
| MS-05 | Clearing and settlement | CCP, T+1, daily mark-to-market, variation margin | I | MS-01 | CME, REG, HAS |
| MS-06 | Liquidity dimensions | Width (spread), depth, resilience, immediacy; liquidity changes by hour and event | I/A | MS-02 | HAR, KAU |
| MS-07 | Spread components | Order-processing, inventory and adverse-selection costs; informed-trading models (Glosten-Milgrom, Kyle) | A/E | MS-06 | HAR, HAS |
| MS-08 | Fragmentation and routing | NBBO, dark pools, internalisation, payment for order flow, crossing networks | A | MS-02 | HAR, HAS |
| MS-09 | Trader typology | Informed, order anticipators, bluffers, dealers, block, value, arbitrageurs, noise traders: who is on the other side | A | MS-03 | HAR |
| MS-10 | Price discovery | How information gets into prices; why markets are hard to beat | A | MS-09, MB-22 | HAR, HAS |
| MS-11 | Halts, circuit breakers, price limits | Limit up/down, futures daily limits, volatility halts | I | MS-01 | CME, HAR |
| MS-12 | Market impact and TCA | Implementation shortfall, effective spread, VWAP benchmark | A/E | MS-06, VP-03 | HAR, CMT2, KAU |
| MS-13 | HFT and algorithmic market making | Latency, speed races, what they mean for retail fills | A/E | MS-08 | KAU, CHAN, HAS |
| MS-14 | Manipulation forms | Spoofing, layering, wash trading, pump-and-dump; how to recognise them; illegal | I | MS-02 | HAR, RG |
| MS-15 | Crypto market structure | CEX vs DEX, AMMs, perpetual swaps, funding, liquidation cascades | A | MB-16, DL-09 | CMT3 (partial) |
| MS-16 | Short-selling mechanics | Locate, borrow fee, recall, short squeeze, uptick rules | I | MB-05 | HAR, CMT2 |

### 2.3 OX: Orders and execution

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| OX-01 | Market order | Immediate execution at the best available price; pays the spread; slippage risk | B | MB-04 | CME, IG, BP, HAR |
| OX-02 | Limit order | Execute at a price or better; may not fill | B | MB-04 | CME, IG, HAR |
| OX-03 | Stop and stop-limit orders | Trigger-based orders; a stop becomes a market order; gaps can skip the level | B | OX-01 | CME, IG, BRK |
| OX-04 | Take-profit, bracket/OCO/OTO | Linked orders that attach stop and target to an entry | B | OX-02, OX-03 | IG |
| OX-05 | Trailing stop orders | A stop that follows price by a distance or rule | B/I | OX-03 | IG, BP |
| OX-06 | Time-in-force | Day, GTC, GTD, IOC, FOK, market-on-open/close | I | OX-02 | CME, HAR |
| OX-07 | Order lifecycle | Placement, routing, matching, (partial) fill, confirmation, position | I | OX-01, MS-01 | CME, HAS |
| OX-08 | Slippage, gaps and execution quality | Difference between expected and actual fill; requotes; news spikes | B/I | OX-01 | KAU, CHAN, IG |
| OX-09 | Trading costs | Spread, commission, swap/financing/rollover, borrow fee, exchange and FX conversion fees | B | OX-01 | KAU, CHAN, IG, BP |
| OX-10 | Margin mechanics in the platform | Used/free margin, margin level, margin call, stop-out | B | DL-01 | BP, IG, REG |
| OX-11 | Netting vs hedging accounts; FIFO | How positions in the same instrument aggregate | I | OX-07 | BP |
| OX-12 | Advanced order types and execution algos | Iceberg, hidden, pegged; VWAP/TWAP algos | A | MS-02 | HAR, HAS |
| OX-13 | Platform literacy | Watchlist, order ticket, positions, history, statements | B | none | IG, CME, TE-01 |
| OX-14 | Pre-trade checklist and error prevention | Verify symbol, side, size, stop; avoid "fat-finger" errors | B | OX-13 | ELD, CHAN |

### 2.4 CH: Charting and candlesticks

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| CH-01 | Chart axes and timeframes | Time (x) vs price (y); data interval; fractal nature across timeframes | B | MB-20 | CMT1, BP, MUR |
| CH-02 | Line, OHLC bar, candlestick | Construction and information content of each | B | CH-01 | CMT1, BP, MUR, NIS |
| CH-03 | Candle anatomy | Body, wicks/shadows, range, colour conventions, what they say about who won the period | B | CH-02 | NIS, CMT1, BP |
| CH-04 | Arithmetic vs log scale | When % moves matter (log) | B/I | CH-01 | CMT1, MUR |
| CH-05 | Single-candle patterns | Doji family, hammer/hanging man, inverted hammer/shooting star, marubozu, spinning top, belt-hold | B | CH-03 | NIS, BP, SC, CMT1 |
| CH-06 | Two-candle patterns | Engulfing, harami (cross), piercing/dark cloud, tweezers, counterattack, kicker | B/I | CH-05 | NIS, SC, CMT1 |
| CH-07 | Multi-candle patterns | Morning/evening (doji) star, three soldiers/crows, abandoned baby, rising/falling three methods, tasuki gaps | I | CH-06 | NIS, SC, CMT2 |
| CH-08 | Candles in context | Location at S/R and in trend, volume, confirmation; complete vs incomplete; blending with Western tools | I/A | CH-07, TR-03 | NIS pt2, CMT2, CMT3, SC |
| CH-09 | Price-only alternative charts | Heikin-Ashi, Renko, Kagi, Three Line Break, range/tick/volume bars | I | CH-02 | SC, BP, CMT1 |
| CH-10 | Volume-weighted chart types | EquiVolume, CandleVolume | A | CH-02, VP-01 | SC |
| CH-11 | Ratio, spread and comparative charts | Plotting one series against another (RS, spreads) | I | CH-02 | SC, CMT1, KAU |
| CH-12 | Drawing and annotation tools | Trendline and channel tools, Fibonacci tools, pitchfork, regression channel, speed lines | I | TR-05 | SC, MUR |
| CH-13 | Gaps | Common, breakaway, runaway/measuring, exhaustion; island reversals; "windows" | B/I | CH-02 | MUR, NIS, BUL, CMT1, SC |
| CH-14 | Specialised visuals | Seasonality charts, yield curve, heatmaps/MarketCarpets, RRG | A | CH-11 | SC, CMT2 |

### 2.5 CP: Chart patterns

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| CP-01 | What a pattern is | Reversal vs continuation; volume signature; crowd psychology in consolidation | B/I | TR-03, VP-01 | CMT1, MUR, BUL, BP |
| CP-02 | Double tops and bottoms | Two tests of a level; confirmation on the neckline break; Adam/Eve variants | B | CP-01 | MUR, BUL, BP, BRK |
| CP-03 | Triple tops and bottoms | Three tests; rarer | I | CP-02 | MUR, BUL |
| CP-04 | Head and shoulders (and inverse, complex) | Three-peak reversal; neckline; measured target | B/I | CP-02 | MUR, BUL, BP, CMT1 |
| CP-05 | Triangles and broadening formations | Ascending, descending, symmetrical; expanding triangles/megaphones | B/I | CP-01 | MUR, BUL, BRK, BP |
| CP-06 | Flags and pennants (incl. high-tight flag) | Short continuation pauses after a strong move | B | CP-01 | MUR, BUL, CMT1 |
| CP-07 | Wedges (rising/falling, broadening) | Converging slanted ranges; three-push patterns | I | CP-05 | MUR, BUL, BRK |
| CP-08 | Rectangles | Horizontal ranges as patterns; range-to-breakout | B | TR-03 | MUR, BUL |
| CP-09 | Cup with handle, rounding, scallops | Gradual base patterns | I | CP-01 | BUL, SC |
| CP-10 | Rarer patterns | Diamonds, bump-and-run, island reversals, V-tops/bottoms, horns, pipes, three rising valleys/falling peaks | A | CP-04 | BUL |
| CP-11 | Measured moves | Leg 2 is about the size of leg 1; AB=CD logic | I | CP-06 | BUL, BRK, KAU |
| CP-12 | Price objectives | Measuring rules for targets from pattern height or width; P&F counts | I | CP-04 | CMT2, MUR, KAU |
| CP-13 | Breakout confirmation filters | Close beyond the level, **3% rule**, **ATR-multiple rule**, time filter, volume | I | CP-01, IN-09 | CMT2, CMT3, MUR |
| CP-14 | Failed and busted patterns | Throwbacks and pullbacks; trading the failure | I/A | CP-13 | BUL, CMT3, BRK, RAS |
| CP-15 | Pattern statistics | Success/failure rates, average move, stop-trigger frequency, decay over decades | A | CP-01, BT-01 | BUL |
| CP-16 | Harmonic patterns and Wolfe Waves | Gartley, Bat, Butterfly, Crab, AB=CD (Fibonacci-ratio-defined) | A | ME-02, CP-11 | BUL, BP, SC, RAS |
| CP-17 | Algorithmic pattern recognition | Coding patterns objectively; the subjectivity problem | E | CP-15, TE-05 | KAU |

### 2.6 TR: Trend, support/resistance and zones

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| TR-01 | What a trend is | Higher highs and higher lows (or the reverse); up, down, sideways | B | CH-02 | all |
| TR-02 | Degrees of trend and fractality | Primary, secondary, minor; trends nest across timeframes | B | TR-01 | CMT1, MUR, ME-01 |
| TR-03 | Support and resistance | Price areas where buying or selling previously overwhelmed; prior highs/lows; round numbers | B | TR-01 | all |
| TR-04 | Polarity / role reversal | Broken resistance becomes support and vice versa | B | TR-03 | CMT1, MUR |
| TR-05 | Trendlines | Drawing rules, validity, touches, slope, breaks; fan principle | B | TR-01 | MUR, BRK, BP, SC |
| TR-06 | Channels | Trend channel lines, parallel and regression channels, micro channels | B/I | TR-05 | MUR, BRK, BP |
| TR-07 | Supply and demand zones | S/R treated as zones with origin and freshness, not lines | I | TR-03 | BP, TV |
| TR-08 | Retracements, pullbacks, throwbacks | Counter-moves within a trend; post-breakout tests | B | TR-01 | CMT1, BRK, BP |
| TR-09 | Trend phases | Wyckoff accumulation, markup, distribution, markdown; Dow's three phases | I | TR-01 | CMT1, SC, ME-04 |
| TR-10 | Trend identification methods | Manual (swings) vs mathematical (MAs, regression slope, ADX) | I | TR-01, IN-02 | CMT1, KAU |
| TR-11 | Market regime | Trending vs ranging vs high-volatility; regime-dependent tactics | I | TR-10, IN-09 | IG, BP, CMT2, CHAN |
| TR-12 | Multiple-timeframe analysis | Top-down alignment; higher-timeframe filter (Elder Triple Screen) | I | TR-02 | BP, CMT2, ELD, KAU, BRK |
| TR-13 | Pivot points | Floor-trader levels (classic, Fibonacci, Camarilla, Woodie) | I | TR-03 | BP, SC, KAU |
| TR-14 | Dynamic S/R | Moving averages, VWAP and bands acting as moving support/resistance | I | IN-02, VP-03 | BRK, CMT2 |
| TR-15 | Magnets and targets | Measured moves, prior signal bars, gaps, round numbers as price attractors | A | CP-11 | BRK |

### 2.7 IN: Indicators and oscillators

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| IN-01 | Indicator fundamentals | Categories (trend, momentum, volatility, volume, breadth), overlays vs oscillators, leading vs lagging, **multicollinearity** | B/I | CH-02 | CMT1, CMT3, BP, SC, ELD |
| IN-02 | Moving averages | SMA, EMA, WMA, Wilder; crossovers; ribbons; envelopes; common lengths | B | IN-01 | CMT1, MUR, BP, KAU |
| IN-03 | Adaptive and low-lag MAs | DEMA, TEMA, Hull, KAMA; lag vs noise trade-off | A | IN-02 | SC, KAU |
| IN-04 | MACD family | MACD line/signal/histogram, PPO, MACD-V | B/I | IN-02 | MUR, ELD, BP, SC |
| IN-05 | RSI family | RSI, regime-shifted OB/OS zones, StochRSI, ConnorsRSI, RSI(2) | B/I | IN-01 | CMT2, SC, BP |
| IN-06 | Stochastics and Williams %R | Close relative to recent range; fast/slow/full | B | IN-01 | MUR, BP, SC |
| IN-07 | Other momentum oscillators | ROC/momentum, CCI, TRIX, KST, Ultimate, TSI, Coppock, DPO | I | IN-05 | SC, KAU, MUR |
| IN-08 | Directional and trend-strength indicators | ADX/DMI, Aroon, Vortex, Parabolic SAR | I | IN-01 | CMT1, SC, BP, ELD |
| IN-09 | Volatility indicators | ATR/ATR%, standard deviation, Bollinger Bands/%B/BandWidth, Keltner, Donchian, squeeze, Chandelier, Ulcer | B/I | IN-02 | CMT1-3, SC, KAU |
| IN-10 | Divergences and momentum reading | Regular and hidden divergence; velocity vs acceleration; "three steps of a valid signal" | I | IN-04, IN-05 | CMT2, BP, ELD, KAU |
| IN-11 | Ichimoku Kinko Hyo | Tenkan, Kijun, Senkou A/B, Chikou; cloud as trend/S-R system | I | IN-02 | BP, SC |
| IN-12 | Indicator construction | Lookback, smoothing, normalisation, parameter choice; designing your own | A | IN-01, BT-01 | CMT1, KAU |
| IN-13 | Regression-based indicators | Linear regression line/slope/R², forecast | A | BT-03 | SC, KAU, CMT1 |
| IN-14 | Relative strength and RRG | Price relative, RS ranking, JdK RS-Ratio/RS-Momentum, rotation | I/A | CH-11 | CMT1-3, SC |
| IN-15 | Elder tools | Force Index, Elder-ray, Impulse System | I | IN-02, VP-01 | ELD, SC |
| IN-16 | Rule roles | Trigger vs filter vs value rules; indicator as a setup vs a confirmation | A | IN-01 | CMT1, CMT2 |

### 2.8 VP: Volume, open interest, breadth and market profile

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| VP-01 | Volume basics | Participation and liquidity; volume confirming trend; climaxes | B | CH-02 | CMT1, MUR, ELD |
| VP-02 | Volume indicators | OBV, A/D, Chaikin Money Flow/Oscillator, MFI, Ease of Movement, NVI, PVO, RVOL | I | VP-01, IN-01 | CMT1, SC, KAU |
| VP-03 | VWAP and Anchored VWAP | Volume-weighted fair price; execution benchmark; event/time anchors | I/A | VP-01 | CMT1-3, SC |
| VP-04 | Volume profile / volume-by-price | Volume by price level: POC, value area, high/low-volume nodes | I/A | VP-01 | SC, KAU |
| VP-05 | Market Profile (auction market theory) | TPOs, initial balance, value area, day types (Steidlmayer) | A | VP-04 | CMT2, KAU, MUR app. |
| VP-06 | Open interest | Futures and options OI; the price-volume-OI matrix | I | DL-03 | CMT1, MUR, KAU, CME |
| VP-07 | Price-volume phases | Four phases of price-volume behaviour in trends | I | VP-01, TR-09 | CMT2 |
| VP-08 | Intraday volume patterns | U-shaped intraday volume; time-of-day effects | I | VP-01 | CMT2, KAU, BRK |
| VP-09 | Market internals / breadth | A/D line, new highs-lows, % above MA, McClellan, TRIN, Bullish % Index, up/down volume | I/A | VP-01, MB-12 | CMT1-3, SC, MUR, KAU |
| VP-10 | Order flow | Time and sales, Level II/DOM, footprint/delta, absorption | A/E | MS-02 | (gap: rarely taught formally) |
| VP-11 | Tick volume (FX/CFD) | Tick counts as a volume proxy in decentralised markets | I | VP-01, MS-01 | CMT1 (FX data) |

### 2.9 PA: Price action

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| PA-01 | Reading bars | Trend bars vs doji bars, close location, tails, bar size relative to recent bars | B/I | CH-03 | BRK, BP |
| PA-02 | Market structure | Swing highs/lows, break of structure, change of character | I | TR-01 | BP, TV, BRK |
| PA-03 | Signal and entry bars | Reversal bars, inside/outside bars, NR4/NR7, ID/NR4 | I | PA-01 | BRK, RAS, SC |
| PA-04 | Trend-to-range spectrum and "Always In" | Continuous assessment of directional bias | I/A | PA-02 | BRK |
| PA-05 | Breakouts, tests and failed breakouts | Real vs fake breaks; break-and-retest; traps | I | TR-03, CP-13 | BRK, BP, RAS, IG |
| PA-06 | Pullback anatomy | Two legs, H1/H2 and L1/L2 counts, wedges and three pushes | A | PA-02 | BRK |
| PA-07 | Trend day types | Spike and channel, trend from the open, small-pullback trend, trending trading range, stairs | A | PA-04 | BRK |
| PA-08 | Reversal anatomy | Major trend reversal, climactic reversal, final flag, double top/bottom pullback | A | PA-04 | BRK, CMT3 |
| PA-09 | Trading-range behaviour | Tight ranges, barbwire, buy-low/sell-high/scalp logic | A | PA-04 | BRK, IG |
| PA-10 | Opening range and session behaviour | First hour, gaps, premarket, key times of day | A | MB-09 | BRK, RAS, KAU |
| PA-11 | Second entries, late entries, pattern evolution | Managing imperfect real-time setups | A | PA-03 | BRK |
| PA-12 | Smart Money Concepts (critical lens) | Liquidity sweeps, order blocks, fair-value gaps, premium/discount; maps to classical S/R, failed breakouts, gaps; evidence status | I/A | PA-05, CH-13 | TV (community) |
| PA-13 | Clean-chart philosophy | Price and context first, indicators second | I | PA-01 | BRK, BP |

### 2.10 ME: Methodologies

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| ME-01 | Dow Theory | Averages must confirm; three trend degrees; three phases; volume confirms; trend persists until clearly reversed; closing prices | B/I | TR-02 | CMT1, MUR, SC, KAU |
| ME-02 | Fibonacci | Sequence and golden ratio; retracements (23.6/38.2/50/61.8/78.6), extensions, arcs, fans, time zones; confluence; weak evidence | B/I | TR-08 | CMT1, BP, SC, KAU |
| ME-03 | Elliott Wave Principle | 5-3 motive/corrective waves, impulse/diagonal/extension, zigzag/flat/triangle, rules vs guidelines, degrees, Fibonacci relations | A | ME-02, TR-02 | CMT2, BP, MUR, SC, KAU |
| ME-04 | Wyckoff method | Composite operator; accumulation/distribution schematics (PS, SC, AR, ST, Spring, SOS, LPS, UTAD); supply/demand, cause/effect, effort/result laws | A | TR-09, VP-01 | CMT1, SC, KAU |
| ME-05 | Point and Figure | Box/reversal; X/O columns; breakouts; 45° lines; vertical/horizontal counts | I/A | CH-01 | CMT1-3, MUR, SC, KAU |
| ME-06 | Ichimoku as a system | Cloud-based trend, S/R and momentum system | I | IN-11 | BP, SC |
| ME-07 | W.D. Gann | Angles, squares, time-price; historical and esoteric; little evidence | E (awareness) | ME-02 | KAU |
| ME-08 | Cycle analysis | Hurst principles, dominant cycle, translation, spectral analysis, seasonality, presidential cycle | A | BT-01 | CMT1, CMT2, MUR, KAU |
| ME-09 | Harmonic trading (Carney) | See CP-16 | A | CP-16 | BUL, BP |
| ME-10 | Auction market theory | See VP-05 | A | VP-05 | KAU, CMT2 |
| ME-11 | Intermarket analysis | See MN-07 | A | MN-07 | MUR, SC |
| ME-12 | Heikin-Ashi trading | Smoothed candles for trend persistence | I | CH-09 | BP, SC |
| ME-13 | Donchian/Turtle breakout trend following | N-day channel breakouts with volatility (N) sizing | I/A | IN-09, RM-10 | KAU, SC, RAS |
| ME-14 | Sector rotation and RS investing | Business-cycle rotation, Faber, RRG workflows | A | IN-14, MN-08 | SC, CMT3 |
| ME-15 | Esoteric methods (inoculation) | Astrology, numerology: why they persist; how to evaluate claims | E (awareness) | BT-09 | KAU |

### 2.11 FA: Fundamental analysis

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| FA-01 | Three lenses | Fundamental vs technical vs sentiment analysis; fusion analysis | B | MB-01 | BP, IG, CMT2, CMT3 |
| FA-02 | Company statements | Income statement, balance sheet, cash flow; EPS, revenue growth, margins | I | MB-11 | IG, SAXO |
| FA-03 | Valuation | P/E, P/B, P/S, EV/EBITDA, dividend yield, PEG; DCF intuition | I/A | FA-02 | IG, SAXO |
| FA-04 | Earnings and corporate events | Releases, guidance, surprise, earnings gaps; M&A, buybacks | I | FA-02 | SAXO, BRK |
| FA-05 | Currency fundamentals | Rate differentials, inflation, growth, balance of payments, safe havens, carry | I | MN-02 | BP, KAU |
| FA-06 | Commodity fundamentals | Supply/demand, inventories (EIA), OPEC, weather, crop reports, seasonality | I/A | MB-15 | KAU, CME |
| FA-07 | Crypto fundamentals | Tokenomics, on-chain metrics (active addresses, flows, MVRV), halving, reflexivity | I/A | MB-16 | CMT1, CMT3 |
| FA-08 | Sector/industry and top-down vs bottom-up | Economy, then sector, then stock | I | FA-02 | CMT3, SC |
| FA-09 | Fusion of FA and TA | Using fundamentals for *what*, technicals for *when* | A | FA-03, TR-12 | CMT2, CMT3 |

### 2.12 MN: Macro, news and intermarket

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| MN-01 | Economic indicators | GDP, CPI/PCE, employment (NFP), PMI, retail sales, sentiment; leading vs lagging | B/I | FA-01 | BP, IG |
| MN-02 | Central banks and monetary policy | Policy rates, forward guidance, QE/QT, meeting calendar, speeches | I | MN-01 | BP, IG |
| MN-03 | Fiscal policy, elections, geopolitics | Non-monetary macro shocks and risk premia | I | MN-01 | BP |
| MN-04 | Economic calendar | Consensus vs actual ("surprise"); impact tiers; scheduling trades around events | B | MN-01 | BP, IG |
| MN-05 | Trading the news | Spread widening, slippage, whipsaw; buy-the-rumour/sell-the-fact; measuring news | I | MN-04, OX-08 | BP, KAU, RAS |
| MN-06 | Yields and the yield curve | Inversion/steepening, real yields as macro signals | I/A | MB-14 | CMT1, SC |
| MN-07 | Intermarket relationships | Stocks-bonds-commodities-dollar links; gold vs real yields; oil vs CAD; risk-on/off; global liquidity | I/A | MN-06 | MUR, SC, BP, CMT1 |
| MN-08 | Business cycle and sector rotation | Which sectors lead in each cycle phase | I/A | MN-07 | SC, CMT3 |
| MN-09 | Correlation between instruments | Correlation matrices, hidden double exposure, instability of correlation | I | BT-03 | BP, SC, CMT3 |
| MN-10 | US Dollar Index | The dollar as the global pricing unit; DXY | I | MB-10 | BP |
| MN-11 | Event risk and tail events | Gaps, flash crashes, black swans, weekend risk | I | MN-05 | KAU, CHAN |
| MN-12 | Bubbles and crashes | Anatomy, five stages; reflexivity | A | PS-10 | CMT2, HAR, KAU |

### 2.13 SE: Sentiment

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| SE-01 | Crowd sentiment and contrary opinion | Why extremes in agreement mark turning points | I | PS-10 | CMT1, MUR, KAU |
| SE-02 | Surveys | AAII, Investors Intelligence, advisory sentiment | I | SE-01 | CMT1, CMT2 |
| SE-03 | Options- and volatility-based sentiment | VIX, put/call ratio, options volume/OI | I | SE-01, DL-05 | CMT1, CMT2, SC |
| SE-04 | Commitments of Traders | Commercials vs non-commercials vs non-reportables; positioning extremes | I/A | SE-01, DL-03 | CMT1, CMT2, KAU, BP |
| SE-05 | Positioning data | Retail long/short ratios, short interest and days-to-cover, insider buying/selling | I | SE-01 | CMT1, CMT2 |
| SE-06 | Flows and leverage | Fund flows, mutual-fund cash, margin debt | A | SE-01 | CMT1 |
| SE-07 | News and social sentiment | Headline tone, social-media hype, magazine-cover effect | I | SE-01 | CMT1, KAU |
| SE-08 | Crypto sentiment | Funding rates, OI, liquidations, fear/greed indices | I | DL-09 | (modern; few curricula) |
| SE-09 | Limits of sentiment | Extremes can persist; timing problem | A | SE-01 | CMT1 |

### 2.14 RM: Risk and money management

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| RM-01 | Why risk comes first | Asymmetry of losses (−50% needs +100%); survival as the first objective | B | MB-07 | BP, IG, ELD, THA, CMT3 |
| RM-02 | Risk per trade and total open risk | Fixed-fractional (e.g., 1-2% per trade; Elder 2% rule) and portfolio heat cap (Elder 6% rule) | B | RM-01 | ELD, BP, IG |
| RM-03 | Position sizing from stop distance | Units = (account × risk %) ÷ (stop distance × value per point) | B | RM-02, MB-07 | BP, ELD, THA, KAU |
| RM-04 | Leverage vs margin | Effective leverage = notional ÷ equity; leverage amplifies outcomes, not edge | B | DL-01 | BP, IG, REG, KAU |
| RM-05 | Stop-loss logic | Structural, volatility (ATR-multiple), time and money stops; invalidation point | B/I | TR-03, IN-09 | ELD, KAU, CMT3, BRK |
| RM-06 | Reward-to-risk and break-even win rate | Win rate needed = 1 ÷ (1 + R:R); trade-off between the two | B | RM-03 | CMT1, IG, BRK |
| RM-07 | Expectancy and R-multiples | E = (win% × avg win) − (loss% × avg loss); outcomes expressed in R | I | RM-06, BT-02 | THA, CMT3, BRK |
| RM-08 | Drawdown control | Max drawdown, recovery math, daily/weekly loss limits, circuit breakers | I | RM-02 | KAU, CHAN, CMT2 |
| RM-09 | Risk of ruin and streaks | Probability of ruin; losing-streak probabilities; Monte Carlo equity paths | A | RM-07, BT-02 | KAU, THA |
| RM-10 | Position-sizing models | Fixed units, fixed fractional, fixed ratio, volatility-based (ATR/vol target, Turtle N), Kelly, optimal f and over-betting | A | RM-03, RM-07 | THA, KAU, CHAN, CMT3 |
| RM-11 | Correlation and concentration risk | Same bet in several instruments; diversification types and mistakes | I/A | MN-09 | CMT3, KAU |
| RM-12 | Gap, overnight and liquidity risk | Stops not guaranteed; weekend gaps; thin markets | I | OX-03 | KAU, CHAN |
| RM-13 | Volatility targeting | Constant-risk sizing; risk-per-trade vs risk-per-unit-of-time | A | RM-10 | CMT3, KAU |
| RM-14 | Portfolio risk metrics | VaR, CVaR/expected shortfall, beta, stress and scenario tests | A/E | BT-01 | CMT3, KAU |
| RM-15 | Hedging | Protective puts, VIX calls vs SPX puts, offsetting positions | A | DL-05 | CMT2, CMT3 |
| RM-16 | Non-market risks | Counterparty/broker, model, software, operational (fat finger, outages), natural disaster | I/A | MB-17 | CHAN, REG |
| RM-17 | Capitalisation and scaling | Undercapitalisation as the top killer; when to increase size; prop-firm drawdown rules | I | RM-02 | BP, CHAN |
| RM-18 | Risk appetite and utility | Risk-seeking, neutral, averse; personal risk tolerance; why appetite falls as wealth grows | I | RM-01 | CMT3, SAXO, BP |

### 2.15 TM: Trade management

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| TM-01 | Entry techniques | Market vs limit vs stop entries; pullback vs breakout entries; confirmation | I | OX-03, PA-05 | BRK, IG, THA |
| TM-02 | Initial stop and invalidation | Where the trade idea is proven wrong | B | RM-05 | ELD, BRK, CMT3 |
| TM-03 | Profit taking | Fixed, measured-move, S/R and R-multiple targets; partial exits | I | CP-12, RM-07 | THA, BRK, ELD, KAU |
| TM-04 | Trailing exits | Swing, MA, ATR/Chandelier, Parabolic SAR trails; break-even rules and their pitfalls | I | OX-05, IN-09 | KAU, SC, BRK |
| TM-05 | Scaling and pyramiding | Scaling in and out; adding to winners; why not average down unplanned | I/A | RM-03 | BP, BRK, KAU |
| TM-06 | Time and signal exits | Exit when the setup does not work in N bars or on an opposite signal | I | TM-02 | KAU, RAS |
| TM-07 | Event-aware management | Around news, earnings and weekends | I | MN-04 | BP, BRK |
| TM-08 | Trapped trades and re-entries | Getting trapped in or out; second entries | A | PA-11 | BRK |
| TM-09 | Options position management | Rolling, adjusting, closing early | A | DL-06 | BRK (ch. 23), CME |
| TM-10 | Hedge vs close | When to hedge an open position instead of exiting | A | RM-15 | CMT3 |

### 2.16 PS: Psychology and behavioral finance

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| PS-01 | Base rates of retail failure | Most retail traders lose (ESMA 74-89% of CFD accounts; day-trader studies); why | B | MB-02 | REG, academic |
| PS-02 | Emotions in trading | Fear, greed, hope, regret, FOMO, revenge trading, tilt | B | none | IG, ELD, DOU, BP |
| PS-03 | Cognitive biases | Overconfidence, confirmation, anchoring, recency, availability, hindsight, gambler's fallacy, illusion of control, sunk cost | B/I | PS-02 | CMT1, SC, THA, ELD |
| PS-04 | Prospect theory, loss aversion, disposition effect | Holding losers and cutting winners | I | PS-03 | CMT1, THA |
| PS-05 | Thinking in probabilities | Edge as a distribution; outcome independence; Douglas' five truths | I | BT-02 | DOU, BRK, THA |
| PS-06 | Discipline and responsibility | Rule adherence, consistency, owning results | I | PJ-02 | DOU, ELD, BP |
| PS-07 | Process vs outcome; luck vs skill | Judge decisions, not single results; variance | I | PS-05 | KAU ("mistaking luck for skill"), DOU |
| PS-08 | Performance state | Routines, stress, sleep, breaks, environment | I | PS-02 | ELD, IG |
| PS-09 | Self-destructive patterns and gambling | Recognising addiction-like behaviour; when to stop | I | PS-02 | ELD |
| PS-10 | Crowd psychology | Herding, bubbles, groupthink, contrarianism | I/A | PS-03 | ELD, CMT2, CMT3 |
| PS-11 | Behavioral-finance taxonomy | Belief-perseverance vs information-processing vs emotional biases; implications for markets | A | PS-04 | CMT1 |
| PS-12 | Demo-to-live gap | Why simulated results overstate live results (fills, emotions); a staged transition | I | PJ-09 | CHAN, BP |

### 2.17 PJ: Trading plan, journaling and review

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| PJ-01 | Self-assessment and style fit | Goals, time, capital, temperament, then style and markets | B | SS-01 | BP, THA, CHAN, IG |
| PJ-02 | Trading plan | Markets, timeframes, setups, entry/exit, risk rules, routine, review cadence, contingencies | B/I | PJ-01, RM-02 | BP, IG, ELD, THA |
| PJ-03 | Routines | Pre-market preparation, watchlists, scanning, post-session review | I | PJ-02 | ELD, BRK |
| PJ-04 | Trade journal | Setup, rationale, screenshot, R result, emotions, mistakes, rule adherence | B | PJ-02 | BP, ELD, SC |
| PJ-05 | Performance analytics | Win rate, average win/loss, expectancy, profit factor, MAE/MFE, by-setup and by-time stats | I | PJ-04, RM-07 | ELD, CMT2, KAU |
| PJ-06 | Review and improvement loop | Weekly/monthly reviews, mistake taxonomy, controlled rule changes | I | PJ-05 | ELD, BP |
| PJ-07 | Record keeping | Spreadsheet of trades, equity curve, tax records | I | PJ-04 | ELD |
| PJ-08 | Trading as a business | Costs, infrastructure, capital plan, retail vs prop structure | A | PJ-02 | CHAN, THA |
| PJ-09 | Readiness and go-live criteria | Sample size, rule adherence, drawdown tolerance before moving from demo to live or scaling up | I | PJ-05 | ELD, CHAN |

### 2.18 BT: Statistics, backtesting and system design

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| BT-01 | Descriptive statistics | Mean/median/mode, geometric mean, variance/SD, z-scores, distributions, skew/kurtosis, fat tails | I | none | CMT1, KAU |
| BT-02 | Probability basics | Expected value, independence, i.i.d., law of large numbers, normal distribution | B/I | none | CMT1, KAU, DOU |
| BT-03 | Correlation and regression | Pearson r, R², linear regression, correlation ≠ causation | I | BT-01 | CMT1, KAU |
| BT-04 | Inferential statistics | Hypothesis tests, p-values, type I/II errors, confidence intervals, sample size | A | BT-03 | CMT2 |
| BT-05 | Returns mathematics | Simple vs log returns, compounding, CAGR, annualised volatility | I | BT-01 | CMT2, CMT3, CHAN |
| BT-06 | System development process | Idea, hypothesis, rules (trigger/filter/value), signal test, backtest, walk-forward, incubation/paper, small live, monitor | A | IN-16, BT-02 | CMT1-3, KAU, CHAN, THA |
| BT-07 | Manual backtesting and bar replay | Discretionary setup testing on historical charts; forward testing in a simulator | I | PJ-04 | BP, ELD |
| BT-08 | Performance measures | Total return, CAGR, max DD, profit factor, expectancy, payoff ratio, Sharpe, Sortino, Calmar, Information ratio, Ulcer | A | BT-05, RM-07 | CMT2, CHAN, KAU |
| BT-09 | Backtesting biases | Look-ahead, survivorship, data-snooping/overfitting, selection bias, unrealistic fills, ignoring costs | A | BT-06 | CMT1, CMT3, CHAN, KAU |
| BT-10 | Optimisation and robustness | Parameter stability, out-of-sample, walk-forward, Monte Carlo, multi-market tests, degrees of freedom | A/E | BT-09 | CMT2, KAU, CHAN |
| BT-11 | Data engineering for tests | Adjusted prices, continuous futures, time zones, survivorship-free data, high/low data issues | A | MB-20 | CHAN, KAU |
| BT-12 | Strategy archetypes for systems | Trend, mean reversion, breakout, momentum, counter-trend, seasonal, carry, pairs/stat-arb (stationarity, cointegration), factors | A/E | BT-06 | CHAN, KAU, CMT2, CMT3 |
| BT-13 | Regimes and adaptivity | Regime change, adaptive indicators, conditional parameter optimisation | E | BT-10 | CHAN, KAU |
| BT-14 | Live vs backtest divergence | Why live underperforms; incubation; system "kill switch" criteria | A | BT-10 | CHAN, KAU |
| BT-15 | Portfolio of strategies | Combining systems; risk parity; volatility stabilisation; All-Weather | E | RM-13 | KAU, CMT3 |
| BT-16 | ML/AI in strategy research | Genetic algorithms, neural nets, ML; extreme overfitting risk | E | BT-10 | KAU |

### 2.19 SS: Strategies and styles

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| SS-01 | Trading styles | Scalping, day, swing, position trading, investing; time demand and cost sensitivity of each | B | MB-02 | BP, IG, BRK, CHAN |
| SS-02 | Trend following | MA crossovers, channel breakouts, pullback entries in trend | I | TR-10, RM-05 | IG, KAU, CMT1, SC |
| SS-03 | Range trading / mean reversion | Fading range edges, oscillator extremes, Bollinger mean reversion, RSI(2) | I | TR-03, IN-05 | IG, CMT2, CHAN, SC |
| SS-04 | Breakout trading | Range and volatility-contraction breakouts (NR7, squeeze), opening-range breakout | I | CP-13, IN-09 | IG, RAS, BP, SC |
| SS-05 | Pullback trading | Fibonacci, MA and structure pullbacks (e.g., Raschke "Holy Grail") | I | TR-08 | RAS, BRK, BP |
| SS-06 | Reversal / counter-trend | Failed breakouts (Turtle Soup), climaxes, divergence reversals | A | CP-14, IN-10 | RAS, BRK, CMT3 |
| SS-07 | Momentum and relative strength | Buying strength; sector/stock rotation | I/A | IN-14 | CMT3, SC, CHAN |
| SS-08 | Event and gap trading | News, earnings, gap fills and continuations | A | MN-05 | KAU, SC, BRK |
| SS-09 | Carry, spreads and arbitrage | FX carry; futures calendar/inter-market spreads; pairs | A | DL-04, BT-12 | KAU, BP, CHAN |
| SS-10 | Seasonal and calendar strategies | Pre-holiday, turn-of-month, commodity seasonality | A | ME-08 | KAU, SC, CHAN |
| SS-11 | Options and volatility strategies | Covered calls, protective puts, spreads, straddles, condors; volatility risk premium | A | DL-06 | CMT2, CME, IG |
| SS-12 | Intraday-specific tactics | Opening range, VWAP reversion and trend, time-of-day | A | PA-10, VP-03 | BRK, KAU, CMT2 |
| SS-13 | Scalping | Very short holding times; extreme cost and execution sensitivity | A | OX-09, MS-06 | BRK, KAU |
| SS-14 | Allocation strategies | Tactical asset allocation, trend quantification, All-Weather | E | BT-15 | CMT3, SC |
| SS-15 | Strategy-regime fit | Choosing or combining strategies by regime; avoiding the "one strategy for all markets" myth | A | TR-11 | IG, CHAN, CMT2 |

### 2.20 AC: Asset-class specifics

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| AC-01 | Forex specifics | Pips, lots, pip value, sessions, rollover/swap, majors vs crosses, central-bank drivers, dealer market | B/I | MB-10 | BP, CMT1 |
| AC-02 | Stock specifics | Exchanges, sectors, market cap, earnings, dividends, halts, pre/post-market, short selling | B/I | MB-11 | IG, SAXO, CMT1 |
| AC-03 | Index products | Composition, cash vs futures vs CFD indices, rebalancing effects | I | MB-12 | CME, IG |
| AC-04 | Commodity specifics | Energy/metals/agriculturals, contract specs, seasonality, storage, contango | I | MB-15, DL-03 | CME, KAU |
| AC-05 | Rates and bonds | Duration intuition, curve trades, rate futures | A | MB-14 | CME, CMT1 |
| AC-06 | Crypto specifics | 24/7, exchange and custody risk, stablecoins, perps/funding, extreme volatility, on-chain data | I | MB-16 | CMT1, CMT3 |
| AC-07 | ETF/ETP specifics | Leveraged/inverse decay, creation/redemption, spreads | I | MB-13 | CMT1, BRK |

### 2.21 DL: Derivatives and leverage

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| DL-01 | Leverage | Controlling notional with less capital; margin requirements; amplifies gains and losses | B | MB-07 | BP, IG, CME, REG |
| DL-02 | CFDs and spread betting | OTC contracts on an underlying; financing; counterparty; ESMA limits; % of losing accounts | B/I | DL-01 | IG, REG |
| DL-03 | Futures | Contract specs, tick value, notional, initial vs maintenance margin, daily mark-to-market, expiry and roll, physical vs cash settlement, price limits, micros, hedgers vs speculators | I | DL-01 | CME, CMT1, KAU |
| DL-04 | Term structure | Contango/backwardation, basis, carry, roll yield; calendar spreads | A | DL-03 | KAU, CMT2 |
| DL-05 | Options basics | Calls/puts, strike, expiry, premium, moneyness, intrinsic/time value, payoff diagrams, exercise/assignment | I | DL-01 | CME, CMT1, IG |
| DL-06 | Option pricing intuition and Greeks | Delta, gamma, theta, vega, rho; put-call parity | A | DL-05 | CME, CMT1 |
| DL-07 | Volatility as an asset | IV vs HV, skew/smile, VIX, term structure, volatility risk premium, VVIX/SKEW/MOVE | A/E | DL-06, IN-09 | CMT1-3 |
| DL-08 | Options on futures | Specific pricing and margining | A | DL-03, DL-05 | CME |
| DL-09 | Perpetual swaps | Funding mechanism; liquidation engine | I/A | DL-01, AC-06 | (modern; few curricula) |
| DL-10 | Leveraged/inverse ETPs | Daily reset and path dependence | I | MB-13 | CMT1 |
| DL-11 | Margin call and liquidation | Stop-out, forced liquidation, negative balance, losing more than the deposit | B | DL-01 | REG, BP, IG |
| DL-12 | Other retail leveraged products | Turbos/knock-outs, warrants, binary options (banned for EU retail) | I (awareness) | DL-01 | REG |

### 2.22 RG: Regulation, costs, taxes and ethics awareness

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| RG-01 | Regulators and protection | SEC/FINRA/CFTC/NFA, ESMA plus national regulators (e.g., ASF Romania), FCA; checking licences; compensation schemes | B | none | REG, BP |
| RG-02 | Retail leverage limits | ESMA 30:1 / 20:1 / 10:1 / 5:1 / 2:1; 50% margin close-out; negative balance protection; US FX 50:1/20:1 | B/I | DL-01 | REG |
| RG-03 | US margin and day-trading rules | Reg T 50% initial; 25% maintenance; $2,000 minimum; **PDT $25k rule removed (eff. 4 June 2026)** and replaced by intraday margin deficits; cash-account good-faith/free-riding; T+1 | I | DL-01 | REG |
| RG-04 | Risk disclosures | Reading the "x% of retail accounts lose money" warning and key information documents | B | RG-01 | REG |
| RG-05 | Scams and red flags | Guaranteed returns, signal sellers, unregulated brokers, pump-and-dump, fake prop firms, finfluencers | B | RG-01 | BP, REG |
| RG-06 | Market abuse law | Insider trading, manipulation, spoofing: legal limits | I | MS-14 | HAR, CMT3, REG |
| RG-07 | Cost awareness | Annualised cost of a trading style; turnover drag (Barber & Odean) | B/I | OX-09 | KAU, CHAN, academic |
| RG-08 | Tax awareness | Capital gains, holding periods, wash-sale (US), product-specific treatment; records; jurisdiction-specific | I | PJ-07 | (rarely covered) |
| RG-09 | Professional ethics | CMT/CFA Code and Standards: objectivity, disclosure, conflicts of interest | A | none | CMT1-3 |
| RG-10 | Client categorisation and suitability | MiFID II appropriateness tests; retail vs professional status | I | RG-01 | REG |
| RG-11 | Prop firms and funded accounts | Business model, evaluation rules, payout risk | I | RM-17 | (modern; few curricula) |

### 2.23 TE: Technology and algo basics

| ID | Topic | One-line definition | Level | Prereq | Seen in |
|---|---|---|---|---|---|
| TE-01 | Platforms and charting software | Broker platforms, MT4/5, TradingView; demo/simulator; bar replay | B | none | IG, CME, BP |
| TE-02 | Alerts, scanners, watchlists, hotkeys | Workflow tooling | B/I | TE-01 | SC, BRK |
| TE-03 | Spreadsheets for journals and stats | Computing expectancy, drawdown, equity curve | I | PJ-04 | ELD, CHAN |
| TE-04 | Data sources and quality | Vendors, adjustments, gaps, time zones | I/A | MB-20 | CHAN, KAU |
| TE-05 | Scripting | Pine Script, MQL, EasyLanguage, Python (pandas) | A | BT-06 | CHAN, KAU |
| TE-06 | Backtesting platforms | Strategy testers, Python libraries, QuantConnect | A | TE-05 | CHAN |
| TE-07 | Automated execution | Semi- vs fully automated; broker APIs; paper trading; kill switches and risk checks | E | TE-06 | CHAN |
| TE-08 | Infrastructure and security | VPS, latency, failover; 2FA; API-key permissions | A/E | TE-07 | CHAN |
| TE-09 | HFT awareness | Why retail cannot compete on latency | A | MS-13 | KAU, HAS |
| TE-10 | AI/ML and LLM tools | Legitimate uses vs hype; overfitting | E | BT-16 | KAU |

**Count:** 303 rows across 23 domains. Three rows (ME-09, ME-10, ME-11) are cross-references, so there are about 300 distinct teachable topics.

**Coverage heat-map (qualitative)**

| Domain | Covered by most curricula | Covered by few | Almost nobody |
|---|---|---|---|
| Charting, patterns, S/R, indicators | Yes (all TA sources) | | |
| Orders and execution | CME, IG | Babypips (partial) | CMT |
| Microstructure | | Harris, Hasbrouck | retail courses |
| Statistics and backtesting rigour | CMT, Kaufman, Chan | | retail courses |
| Risk math (expectancy, ruin, sizing models) | Tharp, Elder, Kaufman, CMT3 | Babypips Senior, IG | most free retail content |
| Psychology as measurable behaviour | | Elder (journal), Douglas | most |
| Costs and taxes | | Kaufman, Chan (costs) | taxes: nearly nobody |
| Regulation (current) | | IG, Babypips (scams) | up-to-date PDT change: nobody yet |
| Modern retail topics (SMC, perps, prop firms) | | TradingView community | formal curricula |

---

## 3. Sequencing patterns

### 3.1 Observed orders, side by side

| Curriculum | Macro-order (first to last) | Where risk sits | Where psychology sits | Where statistics sits |
|---|---|---|---|---|
| **CMT** | History/theory (Dow, EMH, Fibonacci), then chart construction, trend, patterns, indicators, statistics, behavioral, sentiment, cycles, asset classes and RS, volatility, systems. Level II re-runs the same skeleton with *application*; Level III *integrates* | Level I: principles inside trend-following and the risk domain. Level II: risk plans. **Level III opens with "Quantifying and Managing Risk"** | Level I academic behavioral finance (biases, prospect theory); Level II bubbles; Level III groupthink and contrarianism | **From Level I** (descriptive, regression, probability); Level II inferential; Level III statistics of backtesting |
| **Babypips** (2026) | Market basics, broker, TA basics (S/R, candles, Fibonacci, MAs), indicators, patterns, pivots, Heikin-Ashi/Elliott/harmonics, price action/breakouts/MTF, macro, intermarket, plan/style/system/journal, **risk**, graduation | **Course 10 of 11** (earlier: grade 13 of 14) | Embedded late (Junior/Senior: discipline) | Barely; performance review in Junior |
| **IG Academy** | Markets and products (beginner); orders/leverage, stops/limits, risk/reward, planning, psychology, TA and FA basics (intermediate); trend/range/breakout/volatile-market/options strategies (advanced) | **Intermediate, before strategies** | Intermediate | None |
| **CME** | What a futures contract is, specs/codes/expiry/limits/**margin**, how an order reaches the exchange, options, asset-class products | **From lesson one** (margin, notional, limits) | None | None |
| **Murphy** | Philosophy, Dow, construction, trend, patterns, volume/OI, long-term charts, MAs, oscillators, P&F, candles, Elliott, cycles, systems, **money management (ch. 16)**, intermarket, breadth, checklist | Late (ch. 16/19) | Contrary opinion only | Light |
| **Elder** | **Psychology (individual, then mass)**, classical charts, computerised TA, volume and time, market indicators, systems, vehicles, **risk (2%/6%)**, practical details, **record-keeping** | Late-middle, framed as one of 3 Ms | **First** | Light |
| **Tharp** | **You (biases, objectives)**, system concept, **expectancy**, setups/entries/stops/exits, costs, **position sizing last as the "key"** | Throughout; sizing as capstone | **First** | Expectancy-centred |
| **Douglas** | Psychology only: responsibility, perception, probabilities, beliefs | n/a | Whole book | Probabilistic thinking |
| **Kaufman** | **Statistics first**, charting, systems, trend/momentum, seasonality/cycles, volume, spreads, behavioral techniques, short-term/day trading, adaptive, distribution, MTF, advanced, **testing, reality, risk control, portfolio** | Late (ch. 23/24) but after reality checks | Behavioral techniques, luck vs skill | **First** |
| **Chan** | Business case, idea generation (biases), **backtesting**, business set-up, execution/paper trading, **money and risk (Kelly)**, special topics | After execution | "Psychological preparedness" in the risk chapter | Throughout |
| **Brooks** | Bar reading, lines/channels, trends; then breakouts, magnets, pullbacks, ranges, **orders and trade management ("trader's equation")**; then reversals, day trading, first hour, synthesis | Embedded in the trader's equation | Implicit | Probability language, not statistics |
| **Harris** | Industry, orders, structures, brokers, why people trade, trader types, liquidity/volatility, market design, regulation | n/a | Trader motives | Light |
| **NYU POST** | Mechanisms with **simulated trading exercises** (floor, then electronic RIT), institutions, regulation, information models | n/a | n/a | Models |

### 3.2 Common progression principles that the best curricula share

1. **Mechanics before analysis.** CME, IG, Babypips' Preschool and Harris all start with what a market, a quote and an order are, and how P&L and margin work. Analysis without mechanics produces learners who cannot size a trade.
2. **Concrete and visual before abstract and quantitative.** Candles and S/R come before indicator formulas, and indicators before statistics. Exception: quant texts (Kaufman, Chan) put statistics first because their audience already has the visual layer.
3. **Spiral curriculum (revisit with depth).** CMT is the model. Candlesticks, Bollinger Bands, VWAP, relative strength, risk and systems each appear at Levels I, II and III with escalating verbs: *define, then apply, then integrate/justify*. Babypips does the same informally (S/R in Elementary, then supply/demand zones and market structure in High School).
4. **Single tool, then confluence, then a full plan.** Every curriculum ends with an integration capstone: Murphy's checklist, Brooks' "putting it all together", Babypips' plan/journal and Graduation, CMT Level III case groups.
5. **Knowledge, then application, then integration** (a Bloom-like ladder). CMT makes this explicit through exam formats: MCQ recall, then applied MCQ, then short-answer case analysis.
6. **Context before patterns.** Nison's Part 2, CMT Level II "Candlestick Analysis in the Real World", Brooks and Bulkowski all teach that a pattern's meaning depends on trend, location, volume and confirmation. Weak curricula teach the pattern catalogue and stop.
7. **Regime-based strategy grouping.** IG (trend, range, breakout, volatile markets), CMT Level II (range mean-reversion vs breakout tactics) and Chan (mean reversion vs momentum) organise strategies by *market condition*, not by indicator.
8. **Two schools on risk placement:**
   - **Risk early and embedded:** CME, IG, Elder's 2%/6% rules, Tharp, CMT Level III leading with risk.
   - **Risk as a late capstone:** Babypips, Murphy, Kaufman.
   - The late placement is a pedagogical choice to "hook" learners with chart tools first. It is widely criticised, because learners start (demo or live) trading long before they reach the risk module.
9. **Two schools on psychology placement:**
   - **First:** Elder, Tharp, Douglas, which treat psychology as the foundation.
   - **Middle or late:** IG, Babypips, CMT, which treat it as a refinement or an academic topic.
10. **Ethics and regulation as a thin constant layer.** CMT (3-5% at every level) does this rather than putting ethics first. Retail curricula mostly ignore it apart from scam warnings.
11. **Simulated practice is a recognised pedagogy.** The NYU course runs its exercises on a trading simulator (RIT). CME offers a simulator. Chan and Elder prescribe paper trading before live. Babypips forum culture says "demo first".

### 3.3 Where beginners usually get lost (and the likely cause)

| Sticking point | Why it happens | Typical curriculum culprit |
|---|---|---|
| Pip/tick value, lot size, leverage and margin arithmetic | Units differ per instrument; account-currency conversion | Taught once in Preschool and never practised |
| Margin vs leverage vs risk | Leverage is confused with risk; "a 1:500 account is riskier" (it is position size that matters) | Broker-sourced content |
| Stops are not guaranteed | Gaps and slippage are not shown | Pattern-first curricula |
| Indicator soup | Stacking redundant oscillators (multicollinearity) | Big indicator chapters before any testing framework |
| Timeframe conflict | Daily up, hourly down: which wins? | MTF taught late (Babypips High School Grade 12) |
| Subjectivity | Two people draw different S/R, trendlines and Elliott counts; hindsight-perfect textbook charts | Catalogue-style chapters without base rates |
| Advanced methods too early | Elliott, harmonics and Gann before the learner can manage a basic trade | Babypips puts Elliott and harmonics in course 5 of 11, before price action, macro and risk |
| Win rate vs expectancy | Learners chase high win rates and ignore payoff and costs | No statistics module before strategies |
| Small samples | Judging a method after 5-10 trades | No sample-size or variance teaching |
| News volatility | Spread widening and slippage are not simulated in demos | Demo platforms with idealised fills |
| Macro chain | Data surprise, then rate expectations, then the currency move is not obvious | Macro taught as a list of indicators, not as a causal chain |
| Demo-to-live gap | Emotional difference; overconfidence from demo results | No staged transition criteria |
| Too many methods at once | Hopping between systems | No plan and journal early on |
| Backtest overfitting | Optimising until the equity curve is perfect | System building taught without bias and robustness lessons (2006 Babypips grade 11) |

### 3.4 Implications for the MARKET//LAB sequence (synthesis, not prescriptive)

1. **Mechanics plus risk from day one.** Make the first simulator trade require a stop and auto-size the position (RM-02/RM-03), and teach P&L units through doing it (CME and IG model).
2. **Statistics-lite early.** Introduce expected value, variance and sample size (BT-02, PS-05, RM-07) *before* the first pattern or indicator. Re-spiral them at Intermediate and Advanced (CMT model).
3. **Context-first TA.** Order it as structure (trend, S/R), then candles in context, then a few orthogonal indicators, then patterns with **base rates** (Bulkowski) and confirmation filters (CMT 3%/ATR rules).
4. **Regime-organised strategies** (trend, range, breakout, reversal), each with an evidence badge and a cost and slippage profile.
5. **Plan and journal before strategies**, with the journal auto-filled by the simulator so that review analytics (PJ-05) are available from the first week.
6. **Advanced methods last**, and flagged by evidence level: Elliott, Wyckoff, Market Profile, harmonics, Gann (awareness).
7. **A professional track** at the expert level: microstructure (Harris), system design and robustness (Kaufman, Chan, CMT Level III), portfolio and volatility (CMT Level III).
8. **Spiral the core triad** (risk, statistics, psychology) at every level rather than giving each a single module.

---

## 4. Gaps and pitfalls in typical retail trading education

1. **Pattern and indicator overemphasis without base rates.** Retail content teaches catalogues (dozens of candles, patterns and indicators) but rarely shows success and failure rates, average move or stop-trigger frequency. Bulkowski's statistics and CMT's confirmation rules are the exception. The learner over-trusts setups.
2. **Risk management too late, too thin or too "rule-of-thumb".**
   - The "1-2% rule" is common, but the following are rarely taught: risk of ruin, losing-streak probability, drawdown recovery maths, volatility-based sizing, correlation-adjusted exposure, Kelly over-betting.
   - Babypips puts risk at course 10 of 11.
   - Murphy puts money management at chapter 16 of 19.
3. **No statistical literacy.** Expectancy, sample size, variance, significance and the difference between a "signal test" and a backtest (CMT) are absent from most retail courses. The result is win-rate obsession and judging methods on tiny samples.
4. **Survivorship and selection bias in methods and gurus.**
   - Methods survive in education because they are teachable and visually persuasive, not because they work.
   - Fibonacci, Elliott, harmonics and Gann are often presented as fact. Kaufman places Gann next to *financial astrology* under "Behavioral Techniques".
   - Success stories are survivorship-biased, and so is index data (CMT Level I).
5. **Hindsight-drawn, cherry-picked chart examples.** Textbook charts show perfect setups; real-time ambiguity (Brooks' "pattern evolution", late and missed entries) is rarely trained.
6. **Costs ignored.**
   - Spread, commission, swap/financing and slippage turn marginal edges negative.
   - Barber & Odean: the most active traders earned 11.4% vs the market's 17.9%.
   - Kaufman and Chan treat costs as first-class.
   - Retail courses mostly don't, especially for scalping.
7. **Microstructure ignored.** How orders fill, who the counterparty is (B-book brokers, internalisation), why stops cluster and get run, and why spreads widen at news. Harris' trader-type framework ("who is on the other side and why") is missing from retail curricula.
8. **Conflicts of interest.** Broker-funded education (IG, many CFD brokers) and affiliate-funded education (Babypips earns broker referral revenue, per reviews) has incentives to push activity and leverage. The ESMA-mandated warning that 74-89% of retail CFD accounts lose is rarely *taught* as a central fact.
9. **Base rates of failure hidden.** ESMA's 74-89%, the Brazilian day-trading study (~97% of persistent day traders lost) and the Taiwanese studies (<1% predictably profitable) are almost never in course content. The NYU POST course explicitly aims to show "the substantial barriers to long-term success" in day trading. A responsible simulator course should do the same.
10. **Psychology as slogans rather than measurable behaviour.** "Control your emotions" without journaling, rule-adherence metrics, tilt detection or pre-commitment devices. Elder's record-keeping and Douglas' sample-of-20-trades exercise are the operational exceptions.
11. **No feedback loop.** Reviews note that Babypips has no journal, live practice or personalised feedback. Most courses end at knowledge, with no performance analytics.
12. **No regime awareness.** Strategies are presented as universal; failure in the wrong regime is blamed on the trader. IG, CMT and Chan structure strategies by regime.
13. **The demo/simulator realism gap.** Idealised fills, no spread widening and no emotional stakes produce simulator overconfidence. Chan lists "why actual performance diverges from expectations". A simulator app must model spread, slippage and gaps, and show the gap explicitly.
14. **Outdated regulation.** Most content still teaches the US Pattern Day Trader $25,000 rule. As of **4 June 2026 it has been removed** from FINRA Rule 4210 and replaced by intraday-margin standards. Regulatory lessons must be dated and jurisdiction-aware (EU ESMA vs US FINRA/CFTC vs UK FCA vs Romanian ASF).
15. **Siloed asset classes.** Forex-only (Babypips) or stocks-only (ChartSchool) curricula miss intermarket context, volatility regimes and cross-asset correlation (CMT, Murphy).
16. **Entries over exits and sizing.** Tharp's central thesis: entry is the least important component; exits and position sizing dominate outcomes. Retail curricula invert this.
17. **No "when not to trade" or opportunity-cost lesson.** Comparing active trading to passive investing (Saxo, Barber & Odean) is rare. So is teaching that a valid outcome of the course is deciding *not* to day-trade.
18. **Modern retail memes taught as proprietary truth.** Smart Money Concepts / ICT vocabulary (order blocks, liquidity sweeps, fair-value gaps) dominates community education (TradingView). It is largely a renaming of classical S/R, failed breakouts and gaps, and has no published evidence base. Learners will arrive with it, so the course should map it to classical concepts and test it.
19. **Assessment tests recall, not judgement.** Quizzes check definitions. CMT Level III's case-based, multi-domain short answers are the model for "can you apply it".
20. **Taxes and record-keeping almost absent.** Only Elder (records) touches this. Tax treatment differs widely by product and country.
21. **New product risks missing.** Perpetual swaps/funding, crypto liquidation cascades, prop-firm evaluation economics, leveraged ETP decay and 0DTE options are under-covered relative to how often retail now meets them.

---

## 5. Sources

### Fetched and verified in this session

| URL | What it contributed |
|---|---|
| https://cmtassociation.org/wp-content/uploads/2025/12/CMT-PROGRAM-GUIDE-2026-1.pdf | **Primary.** CMT 2026 levels, study hours, exam formats, domain weights, and the full section, unit and learning-objective lists for Levels I-III (§1.1) |
| https://open-exam-prep.com/study-guides/cmt/introduction/exam-facts | Level I weights and exam facts (unofficial; cross-check), chapter grouping |
| https://efficientlearning.com/cmt/resources/program-overview/ | Older CMT topic-weight taxonomy (superseded; noted for context) and level emphases (knowledge, application, integration) |
| https://c.mql5.com/forextsd/forum/119/school_of_pipsology.pdf | Original 2006 Babypips School of Pipsology e-book: full grade-by-grade table of contents and the "make pips, keep pips, repeat" orientation |
| https://takeprofitapp.com/en/learn/babypips-school-of-pipsology-review | Third-party (promotional) Babypips review: grade bands, ~350-lesson claim, gaps (no journal, no live practice, no feedback) |
| https://www.alphaexcapital.com/forex/forex-trading-strategies/babypips-review | Third-party Babypips critique: beginner-level depth, no strategy-building coaching, broker-referral conflict |
| https://chartschool.stockcharts.com/ | ChartSchool top-level structure |
| https://chartschool.stockcharts.com/table-of-contents/overview | Overview TOC (investing intro, psychology, rules and guidelines, multicollinearity, trader's journal) |
| https://chartschool.stockcharts.com/table-of-contents/chart-analysis | Chart Analysis TOC (fundamentals, chart types, candlesticks, P&F, annotation tools) |
| https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays | Full list of 23 overlays and 66 indicators |
| https://chartschool.stockcharts.com/table-of-contents/market-indicators | Breadth and sentiment indicator list |
| https://chartschool.stockcharts.com/table-of-contents/market-analysis | Dow, sector rotation, intermarket, yield curve, Wyckoff, Elliott articles |
| https://chartschool.stockcharts.com/table-of-contents/trading-strategies-and-models | 22 named strategies and models |
| https://www.ig.com/uk/learn-to-trade/ig-academy | IG Academy course list |
| https://www.ig.com/uk/learn-to-trade/ig-academy/courses | IG Academy 23 courses with Beginner/Intermediate/Advanced levels and descriptions |
| https://www.home.saxo/learn | Saxo learning sections (investor-oriented, product guides, diversification) |
| https://www.tradingview.com/education/ | TradingView education feed structure; prevalence of SMC, price-action and pattern content |
| https://www.finra.org/investors/investing/investment-products/stocks/day-trading | FINRA investor guidance: cash-account violations, T+1, $2,000 margin minimum, intraday margin deficits, 90-day freeze, risks |
| https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210 | Current Rule 4210 text: (f)(8)(B) "Reserved" (PDT removed), (d)(2) intraday margin standards, 25% maintenance, amendment SR-FINRA-2025-017 effective 4 June 2026 |
| https://www.esma.europa.eu/press-news/esma-news/esma-agrees-prohibit-binary-options-and-restrict-cfds-protect-retail-investors | ESMA CFD leverage caps, 50% margin close-out, negative balance protection, incentives ban, 74-89% losing-accounts statistic, binary options ban |
| https://www.wiley.com/en-us/Trading+Systems+and+Methods%2C+6th+Edition-p-9781119605355 and https://media.wiley.com/product_data/excerpt/50/11196053/1119605350-38.pdf | Kaufman, *Trading Systems and Methods* 6th ed.: description and full 24-chapter TOC with sections |
| https://www.wiley.com/en-us/Encyclopedia+of+Chart+Patterns%2C+3rd+Edition-p-9781119739685 and https://media.wiley.com/product_data/excerpt/83/11197396/1119739683-31.pdf | Bulkowski, *Encyclopedia of Chart Patterns* 3rd ed.: description (statistics, failure rates, busted patterns, stop tables) and full 76-chapter TOC |
| https://www.wiley.com/en-us/The+New+Trading+for+a+Living%3A+Psychology%2C+Discipline%2C+Trading+Tools+and+Systems%2C+Risk+Control%2C+Trade+Management-p-9781118443927 | Elder, *The New Trading for a Living*: publisher description (psychology, discipline, money management, asymmetric zones, templates, record keeping, system development) |
| https://www.wiley.com/en-us/-p-9781118066515 and https://media.wiley.com/product_data/excerpt/10/11180665/1118066510-74.pdf | Al Brooks, *Trading Price Action Trends*: full TOC |
| https://www.wiley.com/en-us/-p-9781118066614 and https://catalogimages.wiley.com/images/db/pdf/9781118066614.toc.pdf | Al Brooks, *Trading Price Action Reversals*: full TOC |
| https://www.wiley.com/en-us/-p-9781119800064 and https://media.wiley.com/product_data/excerpt/64/11198000/1119800064-39.pdf | Ernest Chan, *Quantitative Trading* 2nd ed.: full TOC with sections |
| https://www.wiley.com/en-us/-p-9781118460146 and https://media.wiley.com/product_data/excerpt/46/11184601/1118460146-10.pdf | Ernest Chan, *Algorithmic Trading*: chapter list |
| https://faculty.haas.berkeley.edu/odean/papers/returns/Individual_Investor_Performance_Final.pdf | Barber & Odean (2000) abstract: 66,465 households; active traders 11.4% vs market 17.9%; turnover >75%; overconfidence |
| https://pages.stern.nyu.edu/~jhasbrou/ | Hasbrouck teaching materials (STPP notes, POST course, *Empirical Market Microstructure*) |
| https://pages.stern.nyu.edu/~jhasbrou/STPP/STPPindex.html | STPP microstructure notes: limit order books, auctions, dealer markets, US regulation, sequential-trade information models |
| https://pages.stern.nyu.edu/~jhasbrou/Teaching/POST%202025%20Fall/FINC-UB.0049%202025%20Fall.html | NYU "Principles of Securities Trading": scope, simulation exercises (floor and RIT), explicit stance on barriers to day-trading success |
| https://ocw.mit.edu/courses/15-433-investments-spring-2003/pages/syllabus/ | MIT Investments syllabus: academic framing of EMH and behavioral finance (no microstructure) |

### Search-snippet evidence (pages blocked or timed out; content taken from official-page snippets)

| URL | What it contributed |
|---|---|
| https://www.babypips.com/learn/forex | 11-course structure, course titles and descriptions, Premium split, "of 456" lessons counter |
| https://www.babypips.com/learn/forex/kindergarten | Broker-focused lessons (Forex Brokers 101, How to Choose, A-Book/STP/internalisation) |
| https://www.babypips.com/learn/forex/middle-school | Indicators, chart patterns, pivot points; leading vs lagging lesson |
| https://www.babypips.com/learn/forex/high-school | Price action, market structure, swing points, supply/demand zones, breakouts/fakeouts, MTF Grade 12 |
| https://www.babypips.com/learn/forex/undergraduate-freshman | Macro fundamentals approach |
| https://www.babypips.com/learn/forex/undergraduate-junior | Trading plan, style fit, testable rule-based system, journal, performance review |
| https://www.babypips.com/learn/forex/undergraduate-senior | Risk management module ("math of losing", survivable-loss rules, personal risk plan) |
| https://www.babypips.com/ja/learn/forex/congratulations-you-made-it | Graduation course (Premium) |
| https://www.cmegroup.com/education/courses/introduction-to-futures.html | Introduction to Futures scope (specs, codes, expiry, ticks, limits, notional, margin, hedgers/speculators) |
| https://cmegroup.com/education/courses/things-to-know-before-trading-cme-futures.html | First-order workflow, order types, routing, managing and closing positions; futures vs stocks/ETFs/CFDs |
| https://www.cmegroup.com/education/courses/curriculum-all-about-options.html | Options curriculum scope (strike, expiry, moneyness, intrinsic value, put-call parity, volatility) |
| https://cmegroup.com/education/courses/options-on-futures-for-equity-traders.html | Options on futures for equity-options traders |
| https://www.cmegroup.com/trading/why-futures/learn-to-trade-futures.html | CME simulator and CE credit context |

### Attempted but blocked (no content used)
- investopedia.com (fetch refused)
- interactivebrokers.com/campus/traders-academy (403)
- oreilly.com (403)
- investor.gov (403)
- papers.ssrn.com (403)
- forums.babypips.com (403)
- web.archive.org (refused)
- catalogimages.wiley.com TOCs for Brooks *Trading Ranges* and Elder (403)

### Background-knowledge items [K] (not re-fetched; verify before quoting verbatim)
- Murphy, *Technical Analysis of the Financial Markets* (1999) chapter list.
- Nison, *Japanese Candlestick Charting Techniques* (2nd ed.) structure.
- Al Brooks, *Trading Price Action Trading Ranges* structure.
- Van Tharp, *Trade Your Way to Financial Freedom* (2nd ed.) structure.
- Mark Douglas, *Trading in the Zone* chapter list.
- Elder, *The New Trading for a Living*, part structure.
- Larry Harris, *Trading and Exchanges* (2003) part structure.
- Raschke & Connors, *Street Smarts* (1996) setup groupings.
- Pre-2025 Babypips lesson-level structure.
- CME asset-class course list.
- IBKR Traders' Academy and Investopedia hub structures.
- US retail FX leverage caps (CFTC/NFA).
- Chague, De-Losso & Giovannetti (2019) "Day Trading for a Living?" (~97% of persistent day traders lost).
- Barber, Lee, Liu & Odean, Taiwan day-trading studies (<1% predictably profitable).


