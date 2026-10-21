# R4 - Fundamentals, News Trading, Macro, Intermarket and Sentiment

Research inventory for a progressive trading course (beginner to expert) inside an interactive app with a synthetic-market simulator (virtual money, generated "news events" with consensus/actual, volatility spikes, gaps).

- Compiled: 2026-10-22. Real-world dates quoted below (release calendars, latest readings) are as of that date and only serve as realistic templates for synthetic events.
- Method: 40 web searches plus about 20 direct fetches of primary pages (BLS, BEA, DOL, Federal Reserve, ECB, BoE, BoJ, CFTC, Cboe, FINRA, AAII, CME, academic papers). The shared web-search budget ran out after 40 searches. Some pages blocked fetching (Babypips lessons, Forex Factory help, Investor.gov stock-split page, ISM site behind login), so those facts rely on search snippets or background knowledge.

## How to read this file

Each concept uses the same template:

- **Def**: one-line definition.
- **Mechanism**: why it moves prices.
- **Reaction / reliability**: typical market reaction patterns and how dependable they are.
- **Risks**: execution and trading risks (gaps, spread widening, slippage, whipsaw).
- **Level**: B = Beginner, I = Intermediate, A = Advanced, E = Expert.
- **Prereq**: concepts that should come first (section numbers).
- **Misconceptions**: common wrong beliefs.
- **Sim drill**: how to practise it with synthetic events in the simulator.

Evidence tags:

- `[S#]` refers to the numbered source list in Section 10.
- `[BK]` means established practitioner or textbook knowledge that was not re-verified this session (search budget). Verify before quoting figures to learners.
- Evidence quality ratings used in Sections 4, 5, 7, 8: **Strong** (official data or multiple peer-reviewed studies), **Moderate** (one solid study or consistent practitioner data), **Weak** (anecdotal, unstable or contested), **Folklore** (popular claim with little or contrary evidence).

---

## 1. Economic calendar literacy

### 1.1 The economic calendar
- **Def**: A schedule of upcoming data releases, central-bank events, speeches, auctions and earnings, showing for each one the time, country, impact rating, and the previous, forecast/consensus and (after release) actual values.
- **Mechanism**: Prices already embed expectations. A calendar tells you *when* expectations will be tested, so it tells you when volatility, spreads and gap risk will spike.
- **Reaction / reliability**: Very reliable as a *volatility* predictor: high-impact slots almost always produce a burst of volume and range. Unreliable as a *direction* predictor on its own.
- **Risks**: Wrong time zone, daylight-saving mismatches, and confusing the release period (data for the previous month) with the release date.
- **Level**: B. **Prereq**: none.
- **Misconceptions**: "The calendar tells me which way price will go." It only tells you when uncertainty gets resolved. "Low-impact events are safe." Low-impact events can matter when the market is focused on that theme.
- **Sim drill**: "Calendar triage". The learner gets a synthetic week of 25 events and must flag which ones to be flat for, which to reduce size for, and which to ignore. The sim then replays the week and scores the choices against the realised volatility of each slot.

### 1.2 Scheduled vs unscheduled news
- **Def**: Scheduled events have a known time and usually a consensus (NFP, CPI, rate decisions). Unscheduled events arrive without warning (geopolitical shocks, emergency rate moves, surprise FX interventions, company profit warnings, hacks, flash crashes).
- **Mechanism**: For scheduled events, liquidity providers pull quotes *before* the release, so spreads widen predictably and then the move happens. For unscheduled events there is no pre-positioning, so the first move is a pure repricing into a book that is not prepared. Gaps and slippage are larger relative to normal volatility.
- **Reaction / reliability**: Scheduled events have a fast initial repricing, mostly within seconds to minutes. ABDV (2003) show announcement surprises produce quick "conditional mean jumps" in FX [S62]. Unscheduled shocks often overshoot and partly retrace, but the size and direction of the retracement are not reliable.
- **Risks**: Unscheduled events cannot be avoided by being flat at a known time. The only defence is position size, leverage, and having no position that cannot survive a gap (example: the SNB floor removal, Section 4.10).
- **Level**: B. **Prereq**: 1.1.
- **Misconceptions**: "A stop-loss protects me from news." A stop becomes a market order once triggered and fills at the next available price, which may be far away [S66][S68].
- **Sim drill**: Run two sessions. In one a scheduled event appears on the calendar. In the other an identical-size shock arrives at a random time. Compare learner P&L and slippage, and show that the same stop distance produced very different realised losses.

### 1.3 Consensus / forecast
- **Def**: The median (sometimes mean) of economists' forecasts for a release, collected by data vendors and news agencies. Calendars show it as "Forecast" or "Consensus". Some calendars (e.g. Forex Factory) may show their own forecast rather than a vendor survey [S70][BK].
- **Mechanism**: The consensus is the market's best public proxy for what is "priced in". Only the deviation from it is news.
- **Reaction / reliability**: Moderate. Direction usually follows the sign of the surprise for top-tier releases [S62]. But the effective expectation can differ from the published consensus: whisper numbers, late forecast changes, and pre-release positioning.
- **Risks**: A stale consensus (forecasts collected days before new information arrives) makes the "surprise" misleading.
- **Level**: B. **Prereq**: 1.1.
- **Misconceptions**: "Consensus = what will happen." It is a central estimate with a range. Also, "beating consensus is always bullish": for inflation, a beat is hawkish; for unemployment, a beat (lower) is positive for the economy but may be negative for bonds.
- **Sim drill**: Show the consensus *and* the forecast range (min/max) and the historical distribution of surprises. The learner sets a "no-trade band". Actual values inside the band produce small, noisy moves; outside the band, clean moves.

### 1.4 Previous and revised previous
- **Def**: "Previous" is last period's published value. "Revised" means the previous value was changed in this release (e.g. NFP revises each initial monthly estimate in each of the next two months [S1][S2]).
- **Mechanism**: Markets trade the *total* information set. A headline beat with a big downward revision to prior months can be net negative.
- **Reaction / reliability**: Revisions frequently explain "the number beat but price fell". The effect is moderate and depends on revision size relative to the headline surprise.
- **Risks**: Knee-jerk algos trade the headline first. The revision-driven second move can reverse the first, which produces whipsaw.
- **Level**: I. **Prereq**: 1.3, 1.5.
- **Misconceptions**: "Previous is fixed." Many series are revised repeatedly: GDP has three monthly estimates plus annual and comprehensive updates [S8][S10]. NFP has annual benchmark revisions, which can be large: a secondary source reports a preliminary benchmark of more than -900k jobs in Sept 2025 [S3].
- **Sim drill**: Generate an NFP event where headline = consensus + 60k but the prior two months are revised by -120k. Watch an initial spike up, then a reversal. The learner must compute the "net surprise" before acting.

### 1.5 Actual and surprise
- **Def**: Actual is the released value. Surprise = Actual - Consensus. It can also be expressed as a standardised surprise z = (Actual - Consensus) / (standard deviation of past surprises). The standardisation follows the ABDV event-study convention [S62][BK].
- **Mechanism**: Price change is roughly proportional to the standardised surprise, with sensitivity (beta) varying by release, regime and asset. Negative surprises tend to move FX more than positive ones (sign asymmetry), and timing matters [S62].
- **Reaction / reliability**: For top-tier US releases the sign of the first move follows the sign of the surprise most of the time. Magnitude is noisy. Small surprises (inside about 1 standard deviation) are often noise.
- **Risks**: Misreading which direction is "good" (unemployment rate down = good; claims down = good; CPI up = hawkish).
- **Level**: B (concept) / I (standardised). **Prereq**: 1.3.
- **Misconceptions**: "A 0.1 beat on CPI is small." On CPI month-on-month, 0.1 pp is a large surprise because the series is quoted to one decimal and the surprise distribution is narrow [BK].
- **Sim drill**: "Predict the arrow." Show consensus, actual and the historical surprise standard deviation. The learner picks direction and size bucket (small/medium/large) for USD, the US 2-year yield, the equity index and gold, then watches the synthetic reaction. Score calibration over 20 events.

### 1.6 Impact tiers (high / medium / low)
- **Def**: Calendars colour-code events by expected market impact: red/high, orange/medium, yellow (or grey)/low on Forex Factory-style calendars [S70].
- **Mechanism**: Impact reflects how much the release changes expected central-bank policy and growth/inflation views. That depends on what the central bank is focused on now.
- **Reaction / reliability**: Tiers are a rough average. A "medium" release can become top-tier in a regime (claims during a recession scare; PPI when CPI components are being nowcast).
- **Risks**: Complacency on medium events; over-trading low events.
- **Level**: B. **Prereq**: 1.1.
- **Misconceptions**: "Impact ratings are objective and fixed." They are editorial and regime-dependent.
- **Sim drill**: The sim rotates a hidden "market focus" variable (inflation regime, growth-scare regime). The learner must infer from reactions which events are currently top-tier, then rewrite the impact colours.

### 1.7 Time zones, DST and release clocks
- **Def**: Release times are set in local time: US data mostly 08:30 or 10:00 ET [S4][S16][S18]; Fed statement 14:00 ET [S20-adjacent]; BoE 12:00 London [BK]; ECB decision 14:15 CET with press conference 14:45 CET [BK]; Japanese data and BoJ minutes 08:50 JST [S30]. Daylight-saving changes happen on different dates in the US and Europe, so for about 2-3 weeks a year the New York-London gap is 4 h instead of 5 h [BK].
- **Mechanism**: Misaligned clocks mean being in a position at the wrong moment.
- **Reaction / reliability**: n/a (operational).
- **Risks**: Opening a trade "an hour before" a release that is actually one minute away; overnight releases in other sessions (Asia data during the European night).
- **Level**: B. **Prereq**: 1.1.
- **Misconceptions**: "The platform shows my local time." It may show server time (often GMT+2/+3 for FX brokers) [BK].
- **Sim drill**: The sim server clock runs in a different zone from the learner's. The learner converts five event times and sets alarms. A wrong conversion means the sim fires the event while the learner believes they have an hour left.

### 1.8 Release mechanics: embargo, headline algos, second wave
- **Def**: Official data are released under embargo at an exact second (e.g. "embargoed until 8:30 a.m. (Eastern) Thursday" on DOL claims [S16]). Machine-readable headlines hit algorithmic traders first; details (components, revisions) are digested over the next minutes.
- **Mechanism**: First wave = headline vs consensus. Second wave = composition (core vs headline, wages, revisions, prices-paid sub-index, guidance).
- **Reaction / reliability**: The two-wave pattern is common. Whether wave 2 confirms or reverses wave 1 depends on whether the details agree with the headline.
- **Risks**: Whipsaw; stops hit by wave 1 just before wave 2 reverses.
- **Level**: I. **Prereq**: 1.4, 1.5.
- **Misconceptions**: "The first candle shows the market's verdict."
- **Sim drill**: Release a CPI where headline beats but core misses. The first 5 seconds trade headline, then the sim publishes "core" and reverses. Score whether the learner waited for the details.

### 1.9 Data disruptions, delays, cancellations
- **Def**: Releases can be delayed or cancelled (e.g. after the 2025 US government shutdown BEA cancelled the Q3 2025 advance GDP estimate and rescheduled others; BLS folded September 2025 JOLTS into the October release) [S9][S19].
- **Mechanism**: Missing data increases uncertainty. Markets lean more on private data (ADP, PMIs, claims) and central-bank speakers. Later "double releases" carry two months of information.
- **Reaction / reliability**: Moves on the first post-gap release are often larger [BK].
- **Risks**: Calendar shows an event that never happens; positions held for a non-event.
- **Level**: I. **Prereq**: 1.1.
- **Misconceptions**: "Official calendars never change." BLS states its schedule is updated as needed [S4].
- **Sim drill**: Randomly cancel one scheduled event per synthetic month and make the next release a two-month combined print with larger variance.

### 1.10 Non-data calendar items
- **Def**: Central-bank speeches, minutes, auctions (Treasury bid-to-cover, tails), options expiries, index rebalances, month/quarter-end flows, holidays (thin liquidity), earnings dates, token unlocks (crypto) [BK].
- **Mechanism**: Supply/demand imbalances (auctions, rebalances), information (speeches), or liquidity changes (holidays, expiries).
- **Reaction / reliability**: Mixed. Holidays reliably mean thin liquidity. Speeches only matter when the speaker is pivotal or the message deviates from the expected one.
- **Risks**: Thin-holiday markets give exaggerated moves and wider spreads.
- **Level**: I. **Prereq**: 1.1.
- **Misconceptions**: "No data = quiet day."
- **Sim drill**: Holiday session with 40% normal depth. The same order size causes 2.5x the slippage.

---

## 2. Major releases: inventory

Reaction notation: "Hot" = actual stronger/higher than consensus. Directions are *typical first reactions* in a normal regime; they flip in some regimes. See 2.0 ("good news is bad news").

### 2.0 Regime rule: "good news is bad news" (and vice versa)
- **Def**: When the central bank is fighting inflation, strong growth/jobs data raise rate expectations and can push equities *down*. In a growth scare, the same strong data push equities *up* [BK].
- **Mechanism**: Equities = discounted cash flows. Strong data raise cash-flow expectations (bullish) but also discount rates (bearish). Which effect dominates depends on what the market fears.
- **Reaction / reliability**: Regime-dependent. ABDV report that announcement effects depend on timing and conditions [S62], and the stock-bond correlation flips with the monetary regime [S72].
- **Risks**: Applying a fixed rulebook across regimes.
- **Level**: I. **Prereq**: 2.1-2.3, 6.1.
- **Misconceptions**: "Strong economy = stocks up, always."
- **Sim drill**: Run the same NFP beat twice: once in an "inflation-fight" regime (equities down, yields up, USD up) and once in a "recession-fear" regime (equities up). Ask the learner to identify the regime from a pre-event dashboard (CPI trend, dot plot, curve).

### 2.1 US Employment Situation: Nonfarm Payrolls (NFP), unemployment rate, average hourly earnings
- **Measures**: Monthly change in nonfarm payroll jobs from the establishment survey (CES). The unemployment rate and labour force come from the household survey (CPS). Also average hourly earnings (wage inflation) and average weekly hours [S1][S2].
- **Publisher / timing**: BLS, usually the first Friday of the month at 08:30 ET [BK]. Reference period: the pay period (CES) or week (CPS) that includes the 12th [S2]. The establishment sample is about 119-121k businesses covering about 622-631k worksites; BLS copies differ [S1].
- **Revisions**: Each month is revised twice in the following two months. An annual benchmark to unemployment-insurance tax records follows [S1][S2].
- **Noise**: The statistically significant monthly change is about 122k for CES and about 650k for CPS (BLS FAQ) [S2]. Many "surprises" are inside sampling error.
- **Why markets care**: The labour market is half of the Fed's dual mandate. Wages feed services inflation.
- **Typical reaction (hot print)**: 2-year yield up (most sensitive); USD up; gold down; equities ambiguous (see 2.0). The unemployment rate and wages can contradict the headline.
- **Reliability**: High volatility reliably. Direction is moderate because three sub-surprises (payrolls, unemployment, wages) plus revisions often conflict.
- **Risks**: Among the widest spread blowouts of the month in FX and index CFDs [BK]. Whipsaw from conflicting components. Canada's jobs report is often released at the same minute, making USD/CAD double-event risk [BK].
- **Level**: B (read), I (trade). **Prereq**: 1.3-1.8.
- **Misconceptions**: "+250k is always strong." Context depends on the consensus and the breakeven job growth needed. "The household and establishment surveys should match." They measure different things with different noise [S2].
- **Sim drill**: A "three-dial NFP": generate payrolls, unemployment rate, AHE and revisions independently. The learner writes a one-line net assessment before the reaction is revealed. Include CES sampling noise of about ±122k so learners see how often "surprises" are noise.

### 2.2 US Consumer Price Index (CPI)
- **Measures**: Average change in prices paid by urban consumers for a basket of goods and services. Covers more than 200 categories in 8 major groups; BLS collects about 80,000 prices a month. CPI-U covers about 90%+ of the population and CPI-W about 30%. Core = all items less food and energy [S5].
- **Publisher / timing**: BLS, around mid-month at 08:30 ET for the previous month. Example: October 2026 CPI is due November 10, 2026 [S4].
- **Revisions**: CPI-U and CPI-W are not revised (final when issued, except rare error corrections). Seasonal factors are re-estimated annually and seasonally adjusted (SA) data can be revised for up to 5 years [S5].
- **Why markets care**: Most-watched inflation gauge. It drives rate expectations directly. Traders focus on core month-on-month (to 2 decimals in practice) and on shelter/services components [BK].
- **Typical reaction (hot)**: Yields up (front end most), USD up, equities down (especially growth/tech, which are long-duration), gold down (higher real yields + USD). In a disinflation narrative a cool print gives the opposite and is often larger [BK].
- **Reliability**: High in inflation-focused regimes; lower when inflation is near target.
- **Risks**: Big index futures gaps at 08:30 ET; options implied volatility elevated into the print [BK].
- **Level**: B (read) / I (components). **Prereq**: 1.5, 6.3.
- **Misconceptions**: "Headline matters most." Markets usually weight core. "CPI is the Fed's target." The Fed's 2% goal is defined on PCE inflation [BK; see 2.4].
- **Sim drill**: A CPI "decomposition" mini-game: the learner assembles core MoM from synthetic component prints (shelter, goods, services ex-shelter), predicts the print, then trades it. Variant: headline hot due to energy, core cool. Reward fading the initial spike.

### 2.3 US Producer Price Index (PPI)
- **Measures**: Prices received by domestic producers. The headline is "final demand" (goods, services, construction sold for consumption, investment, government or export). "Intermediate demand" covers inputs to production [S6].
- **Publisher / timing**: BLS, usually in the second full week of the month after the reference month. Data are revised 4 months after first publication [S6].
- **Why markets care**: Pipeline inflation. Some PPI components (e.g. portfolio management fees, airfares, medical services) feed the PCE estimate, so PPI helps nowcast core PCE [BK].
- **Typical reaction**: Smaller than CPI. Larger when released before CPI in a given month, or when components shift the PCE nowcast [BK].
- **Reliability**: Moderate to low on its own.
- **Risks**: Over-reacting to headline PPI swings driven by trade margins/energy.
- **Level**: I. **Prereq**: 2.2.
- **Misconceptions**: "PPI leads CPI one-for-one."
- **Sim drill**: PPI arrives the day after CPI. The learner updates a "core PCE nowcast" gauge from CPI + PPI component numbers. The later PCE release (2.4) then produces only a small surprise, which teaches "already priced in".

### 2.4 US Personal Income and Outlays: PCE price index, core PCE, spending, saving rate
- **Measures**: Personal income, disposable income, personal consumption expenditures, the saving rate, and the PCE price index (headline and core) [S7].
- **Publisher / timing**: BEA, near month-end for the previous month, 08:30 ET [BK]. Example: next release October 29, 2026; the August 2026 data showed a 4.1% saving rate [S7].
- **Why markets care**: The Fed's 2% inflation objective is defined in terms of PCE inflation [BK; Fed "Statement on Longer-Run Goals", listed on S20]. Spending is about two-thirds of GDP [BK].
- **Typical reaction**: Usually modest, because core PCE is largely nowcast from CPI + PPI. Surprises vs. the nowcast still move front-end yields [BK].
- **Reliability**: Low-moderate as a trading event; high as a policy input.
- **Risks**: Month-end liquidity; often clustered with other releases.
- **Level**: I. **Prereq**: 2.2, 2.3.
- **Misconceptions**: "The Fed targets core CPI."
- **Sim drill**: Combine 2.2 + 2.3 + 2.4 into a three-day chain in which the learner's nowcast error determines whether trading PCE has any edge.

### 2.5 US GDP (advance / second / third estimates)
- **Measures**: Inflation-adjusted output growth, reported as a seasonally adjusted annualised rate (SAAR), with components: consumption, investment, government, net exports, inventories [BK].
- **Publisher / timing**: BEA. The advance estimate comes near the end of the month after the quarter, then second and third estimates at about one-month intervals. Annual updates come in late September; comprehensive updates about every 5 years [S8][S10].
- **Revisions**: The mean absolute revision to real GDP growth is 0.5 pp from advance to second estimate and 0.7 pp from advance to third [S8]. In 2025-26 the shutdown cancelled the Q3 2025 advance estimate [S9].
- **Why markets care**: The broadest growth measure. It is backward-looking, so the market reaction is usually smaller than for monthly data that already informed nowcasts [BK].
- **Typical reaction**: Advance estimate moderate; second and third small. The GDP price deflator / core PCE quarterly figure inside the release can matter more [BK].
- **Reliability**: Low-moderate as a trading event.
- **Risks**: Confusing quarter-on-quarter annualised with year-on-year; inventory/net-export noise.
- **Level**: B (concept) / I (components). **Prereq**: 6.6.
- **Misconceptions**: "Two negative quarters = official recession." In the US, the NBER dates recessions using a broader set of indicators [BK].
- **Sim drill**: The learner is shown nowcast trackers built from earlier synthetic monthly data and must predict that the GDP release will barely move prices. A "net exports/inventory distortion" scenario teaches looking at final sales.

### 2.6 US Retail Sales (Advance Monthly Retail Trade)
- **Measures**: Nominal (not inflation-adjusted) monthly sales at retailers and food services, seasonally adjusted [S13]. The "control group" excludes autos, gasoline stations, building materials and food services (some definitions exclude more) and feeds the GDP goods-consumption estimate [S11][S12].
- **Publisher / timing**: Census Bureau, about two weeks after month-end, 08:30 ET; revised at least twice [S13].
- **Why markets care**: The best monthly read of consumer demand.
- **Typical reaction (hot control group)**: Yields up, USD up; equities mixed (consumer discretionary up) [BK].
- **Reliability**: Moderate. Price effects (nominal) can masquerade as volume.
- **Risks**: Conflicts between headline and control group; revisions.
- **Level**: B/I. **Prereq**: 1.5, 2.2.
- **Misconceptions**: "Retail sales up 1% = consumers bought 1% more." It is nominal, so inflation inflates it.
- **Sim drill**: Headline +0.8% driven by gasoline prices, control group -0.2%. The learner must ignore the headline.

### 2.7 ISM Manufacturing and Services PMI (and S&P Global PMIs)
- **Measures**: Diffusion indices from purchasing-manager surveys. Above 50 = expansion versus the prior month. Components: new orders, production, employment, supplier deliveries, inventories, prices paid, exports/imports [S14][S15].
- **Publisher / timing**: Institute for Supply Management. Manufacturing comes on the first business day of the month at 10:00 ET, services on the third business day [BK; release times cited as 14:00 GMT in summer by S15]. S&P Global publishes "flash" PMIs late in the month for the US, euro area, UK and Japan [BK].
- **Why markets care**: Timely, forward-looking (new orders), and the prices-paid component is an early inflation signal [S14].
- **Typical reaction**: Moderate. Prices paid and employment components matter in inflation and labour regimes.
- **Reliability**: Moderate. Survey-based, so sentiment can diverge from hard data.
- **Risks**: Headline 50-line psychology. A cross from 49.8 to 50.1 gets disproportionate headlines.
- **Level**: B. **Prereq**: 1.5.
- **Misconceptions**: "PMI 48 means output fell 2%." It is a diffusion index (share of firms reporting improvement vs deterioration), not a growth rate.
- **Sim drill**: Diffusion-index builder: the learner sets synthetic survey answers and sees the index computed, then trades a PMI whose headline beats but whose new orders collapse.

### 2.8 US Weekly Jobless Claims (Unemployment Insurance Weekly Claims)
- **Measures**: Initial claims = new filings for unemployment insurance. Insured unemployment (continuing claims) is lagged one week. A 4-week moving average smooths the noise. The previous week is revised [S16].
- **Publisher / timing**: Department of Labor, Thursdays 08:30 ET (embargoed until then) [S16]. Example: week ending Oct 10, 2026: initial claims 199,000; 4-week average 198,500; insured unemployment 1.71M [S16].
- **Why markets care**: The most timely labour-market indicator. It becomes high-impact in slowdowns or when layoffs are the theme [S17].
- **Typical reaction**: Usually small. Large in regime shifts (rising trend), and around holidays when seasonal adjustment struggles [BK].
- **Reliability**: Low week-to-week; the trend (4-week average) is moderately informative.
- **Risks**: Over-trading weekly noise.
- **Level**: B. **Prereq**: 1.5.
- **Misconceptions**: "Claims up = bad for stocks." It depends on the regime (2.0).
- **Sim drill**: Twelve synthetic weekly prints with noise. The learner must identify the turning point using the 4-week average, and is rewarded for *not* trading single prints.

### 2.9 JOLTS (Job Openings and Labor Turnover Survey)
- **Measures**: Job openings, hires, quits, layoffs/discharges and total separations (levels and rates) [S18].
- **Publisher / timing**: BLS, 10:00 ET, about five weeks after the reference month. Example: September 2026 data due November 3, 2026; August 2026 openings were 7.079M, quits rate 1.9% [S18][S19].
- **Why markets care**: Labour-market tightness (openings per unemployed) and wage pressure (quits rate leads wages) [BK].
- **Typical reaction**: Moderate in labour-focused regimes. It lags NFP, so it often confirms rather than surprises.
- **Reliability**: Moderate-low. Response rates and revisions are large [BK].
- **Risks**: Treating a lagged release as new information.
- **Level**: I. **Prereq**: 2.1.
- **Misconceptions**: "JOLTS is about the current month." It describes a month that ended about five weeks earlier.
- **Sim drill**: The learner places JOLTS on a timeline with NFP and identifies which month each describes.

### 2.10 Other US releases (compact)

| Release | Publisher / timing | What it adds | Typical impact | Level |
|---|---|---|---|---|
| ADP National Employment | ADP, Wednesday before NFP [BK] | Private payroll proxy | Low-moderate; poor NFP predictor month to month [BK] | B |
| UMich Consumer Sentiment (prelim/final) incl. 1-yr and 5-10-yr inflation expectations | Univ. of Michigan, 10:00 ET, twice a month [BK] | Sentiment + inflation expectations | Moderate when inflation expectations are in focus [BK] | I |
| Conference Board Consumer Confidence | Last Tuesday, 10:00 ET [BK] | Labour differential (jobs plentiful vs hard to get) | Low-moderate | B |
| Durable Goods Orders | Census, 08:30 ET [BK] | Capex proxy: core capital goods orders ex-aircraft | Low-moderate; headline swings with aircraft | I |
| Housing starts/permits, new/existing home sales, Case-Shiller | Census/NAR/S&P [BK] | Rate-sensitive sector | Low; matters for homebuilders and mortgage rates | I |
| Industrial Production | Fed, mid-month [BK] | Manufacturing output | Low | I |
| Employment Cost Index (quarterly) | BLS [BK] | Best wage-cost gauge (composition-adjusted) | Moderate in wage-inflation regimes | A |
| Trade balance | BEA/Census [BK] | Net exports for GDP | Low | I |
| Beige Book | Fed, 2 weeks before FOMC [BK] | Anecdotal regional conditions | Low | I |
| Treasury auctions (2/5/10/30y) | Treasury, 13:00 ET [BK] | Demand for duration: tail vs when-issued yield, bid-to-cover, indirect bidders | Moderate for yields when tails are large | A |
| EIA Weekly Petroleum Status | EIA, Wednesday 10:30 ET [BK] | Crude/gasoline inventories | High for crude oil, low elsewhere | I |
| Fed H.4.1 balance sheet | Fed, Thursday [BK] | QT pace, liquidity | Low (slow-moving) | A |

### 2.11 Major non-US releases (compact)

| Region | Key releases | Why they matter | Typical FX sensitivity | Level |
|---|---|---|---|---|
| Euro area | Flash HICP (inflation), German Ifo/ZEW/PMIs, GDP flash [BK] | ECB policy path | EUR, Bund yields | I |
| UK | CPI, labour market (wages), GDP monthly, retail sales [BK] | BoE path; services inflation | GBP, gilts | I |
| Japan | Tokyo CPI (leads national), national CPI, Tankan (quarterly), wage negotiations (shunto) [BK] | BoJ normalisation | JPY, JGBs | A |
| China | Trade, CPI/PPI, credit (TSF), activity data, official and Caixin PMIs [BK] | Global growth, commodities | AUD, NZD, copper, iron ore | A |
| Canada | Labour Force Survey (often same minute as NFP), CPI [BK] | BoC path; oil link | CAD | I |
| Australia | Labour force, CPI (monthly and quarterly) [BK] | RBA path | AUD | I |
| Switzerland | CPI; SNB decisions (quarterly), FX intervention [BK] | Safe haven, SNB regime | CHF | A |

Sim design note: model each currency with its own calendar and "focus" weights. A synthetic AUD should react to synthetic China data, and CAD to synthetic oil inventories.

---

## 3. Central banks

### 3.0 Reference: meeting mechanics of the big four (verified where cited)

| Bank | Meetings / yr | Policy rate | Decision time (local) | Extra materials | Follow-up documents |
|---|---|---|---|---|---|
| Federal Reserve (FOMC) | 8 scheduled + unscheduled as needed [S20] | Fed funds target range | Statement 14:00 ET, press conference 14:30 ET [S20-adjacent eco3min; BK] | SEP + dot plot in Mar/Jun/Sep/Dec [S20][S21] | Minutes 3 weeks after decision [S20] |
| ECB (Governing Council) | 8 (about every 6 weeks) [S26] | Deposit facility rate (DFR) is the steering rate; MRO-DFR spread set at 15 bp from Sept 2024 [S25] | Decision 14:15 CET, press conference 14:45 CET [BK] | Staff projections quarterly [BK] | "Account" about 4 weeks later [BK] |
| Bank of England (MPC) | 8, Thursdays [S28] | Bank Rate | 12:00 UK [BK] | Monetary Policy Report in Feb/Apr/Jul/Nov [S28] | Summary + minutes with vote split published with the decision [S28][S29] |
| Bank of Japan (MPM) | 8 [S30] | Uncollateralised overnight call rate (guided to 0-0.1% at the March 2024 exit) [S31] | No fixed time; around midday JST, Governor press conference afternoon [BK] | Outlook Report in Jan/Apr/Jul/Oct [S30] | Summary of Opinions about 1-2 weeks later; minutes about 6 weeks later, 08:50 JST [S30] |

Realistic near-term template dates (as of 2026-10-22): FOMC Oct 27-28 and Dec 8-9, 2026 (Dec has SEP) [S20]; ECB Oct 28-29 and Dec 16-17, 2026 [S26]; BoE Nov 5, 2026 (with MPR) and Dec 17, 2026 [S28]; BoJ Oct 29-30, 2026 (with Outlook Report) and Dec 17-18, 2026 [S30].

### 3.1 Mandates and reaction functions
- **Def**: Fed = dual mandate (maximum employment, stable prices) with a 2% PCE inflation objective. ECB/BoE/BoJ = price stability with a 2% target (BoE via a government-set CPI target) [BK]. The "reaction function" is how the bank maps data into rate changes.
- **Mechanism**: Every macro release matters *only through* its effect on the expected reaction function. That is why the same data move markets differently across countries and regimes.
- **Reaction / reliability**: Conceptual foundation; reliable as a framework.
- **Risks**: Assuming the reaction function is stable. Shifts happen: NY Fed research found markets read the Fed's 2011 move to calendar-based guidance as a dovish change in its reaction function [S35].
- **Level**: B/I. **Prereq**: 6.1.
- **Misconceptions**: "Central banks react to the stock market." Only indirectly, via financial conditions.
- **Sim drill**: A hidden synthetic "central bank" has a Taylor-type rule with weights the learner must estimate from 12 synthetic meetings, then predict meeting 13.

### 3.2 Rate decisions and the "priced-in" principle
- **Def**: The announced change (or hold) in the policy rate.
- **Mechanism**: Markets price meeting outcomes in advance via futures/OIS. Only the *deviation* from what was priced moves prices. A fully expected 25 bp hike can be dovish if the market priced some chance of 50 bp.
- **Reaction / reliability**: Surprise vs pricing is a strong predictor of the front-end yield move [BK]. The FX/equity reaction depends further on guidance (3.4-3.7).
- **Risks**: Gaps in FX/indices at decision time; second move at the press conference.
- **Level**: B. **Prereq**: 1.5, 3.9.
- **Misconceptions**: "A rate hike makes the currency go up." The BoJ hiked in March 2024 (first hike in 17 years, ending negative rates and yield curve control), and the yen *weakened* toward 150/USD because the guidance was dovish and the gap with US rates stayed wide [S31][S32][S33].
- **Sim drill**: "BoJ paradox" scenario: the synthetic bank hikes as expected, with dovish guidance, and the currency falls. The learner must explain this using the implied-probability panel before seeing the answer.

### 3.3 Policy statement and vote split / dissents
- **Def**: The written decision text (statement) and, where published, the vote count and dissents (e.g. the BoE's May 2025 three-way split: 2 for a 50 bp cut, 5 for 25 bp, 2 for hold) [S29].
- **Mechanism**: Changes in wording versus the previous statement signal future direction. Dissents show the distribution of views and the likely next move.
- **Reaction / reliability**: Moderate. Algos parse word-level diffs within seconds [BK]. Dissent surprises move front-end rates.
- **Risks**: Misreading boilerplate; a fast reversal at the press conference.
- **Level**: I. **Prereq**: 3.2.
- **Misconceptions**: "Unchanged rate = no news."
- **Sim drill**: "Spot the diff": show two synthetic statements side by side. The learner highlights changed phrases and rates the tone (hawkish/dovish). The sim moves price according to a hidden tone score.

### 3.4 Hawkish vs dovish language
- **Def**: Hawkish = leaning toward tighter policy (higher rates, less accommodation). Dovish = leaning toward easier policy.
- **Mechanism**: Shifts the expected path of rates, which reprices yields, FX and equity discount rates.
- **Reaction / reliability**: The reaction depends on what was expected. In Sept 2014 the Fed kept its forward-guidance language; because markets had anticipated a hawkish shift, the unchanged text was read as relatively dovish [S34]. Communication by other officials can override the statement: in 2016, hawkish regional Fed presidents reversed the reading of a dovish March statement [S37]. Babypips runs a hawkish-or-dovish quiz [S39], which is a good format model.
- **Risks**: Whipsaw between statement, press conference and later speeches.
- **Level**: I. **Prereq**: 3.2, 3.3.
- **Misconceptions**: "Hawkish words = currency up, always." It must be *more* hawkish than priced.
- **Sim drill**: Tone-classification game: 30 synthetic sentences ("further policy firming may be appropriate", "the Committee will be patient"). The learner scores each from -2 (very dovish) to +2 (very hawkish). The sim then shows the market reaction, conditional on what was priced.

### 3.5 Press conferences
- **Def**: Live Q&A by the chair/president after the decision (Fed, ECB, BoJ; BoE around MPR releases [BK]).
- **Mechanism**: Unscripted answers reveal conviction, conditionality and dissent. They often create the "second move".
- **Reaction / reliability**: Frequently larger than the statement reaction. Example: in January 2022 Powell declined to rule out consecutive or larger hikes and said there was "quite a bit of room" to raise rates, and markets added hike pricing [S36].
- **Risks**: Prolonged high volatility (30-60 minutes); headline-by-headline whipsaw.
- **Level**: I. **Prereq**: 3.3, 3.4.
- **Misconceptions**: "The decision at 14:00 is the event; after that it is over."
- **Sim drill**: The decision releases neutral. Ten minutes later a synthetic press-conference "headline stream" (10 lines, each tagged with a tone) drives a second move that exceeds the first. The learner decides when to enter or stay flat.

### 3.6 Dot plot / Summary of Economic Projections (SEP)
- **Def**: Quarterly Fed projections. The dot plot shows each FOMC participant's (anonymous) view of the appropriate year-end fed funds rate for the next few years and the longer run (neutral rate). The market focuses on the median [S21].
- **Mechanism**: A shift in the median dot changes the expected policy path, and the longer-run dot changes the perceived neutral rate.
- **Reaction / reliability**: Moderate. The Fed itself cautions about the dots' predictive power, and dots are conditional forecasts, not commitments [S21].
- **Risks**: Over-reading one participant's shift; the median can move on a single dot.
- **Level**: I/A. **Prereq**: 3.2, 3.9.
- **Misconceptions**: "Dots are promises."
- **Sim drill**: Generate 19 synthetic dots. The learner computes the median, compares it to futures pricing, predicts the yield reaction, then sees how moving one dot changes the median.

### 3.7 Minutes, accounts, summaries of opinions
- **Def**: Detailed records released later. Fed minutes come 3 weeks after the decision [S20]. ECB "accounts" come about 4 weeks later [BK]. BoJ Summary of Opinions comes about 1-2 weeks later and minutes about 6 weeks later [S30].
- **Mechanism**: They reveal the breadth of views and conditions for future moves.
- **Reaction / reliability**: Usually low-moderate. Larger if they contradict the press-conference tone.
- **Risks**: Stale information; mostly priced.
- **Level**: I. **Prereq**: 3.3.
- **Misconceptions**: "Minutes = new decisions."
- **Sim drill**: A synthetic minutes release where "many participants" vs "a few participants" wording changes the market's probability of a hike, which teaches quantifier language.

### 3.8 Forward guidance
- **Def**: Communication about the likely future path of policy: calendar-based ("through mid-2013"), outcome-based/threshold ("until unemployment < x"), or qualitative ("data dependent", "patient") [BK][S35].
- **Mechanism**: Moves expectations of future short rates, and therefore longer yields, without changing the current rate. The QE literature attributes a large share of QE's effect to signalling the rate path [S43].
- **Reaction / reliability**: Strong when credible. Weakens when the bank reverses guidance. A June 2026 commentary claims the current Fed leadership is reducing forward guidance in favour of market pricing and real-time data [S40]; that is a single, unverified source and should be presented as a hypothesis, not a fact.
- **Risks**: Guidance reversals produce violent repricing.
- **Level**: A. **Prereq**: 3.2-3.5.
- **Misconceptions**: "Guidance is a promise."
- **Sim drill**: The synthetic bank issues guidance "no hikes for 4 meetings", then inflation surprises 3 times and it abandons guidance at meeting 3. Measure how much the learner's positions relied on the guidance.

### 3.9 Market-implied probabilities (CME FedWatch, OIS)
- **Def**: Probabilities of rate outcomes derived from 30-day Fed funds futures (ZQ). Implied rate = 100 - futures price. CME's tool builds a binary probability tree assuming 25 bp steps and that the end-of-month rate equals the next month's start rate [S22][S23][S24].
- **Mechanism**: Shows what is priced. The surprise at a meeting = actual outcome minus the probability-weighted expectation.
- **Reaction / reliability**: Strong as a gauge of expectations. The probabilities are model outputs: CME notes they vary if assumptions are compromised, and conditional vs aggregated views differ [S22][S23]. The simple formula P(hike) ≈ (implied - current)/0.25 omits day-weighting within meeting months [S22].
- **Risks**: Treating a 60% probability as certainty; late repricing in the blackout period.
- **Level**: I (read) / A (compute). **Prereq**: 3.2.
- **Misconceptions**: "FedWatch is a poll of economists." It is market pricing, which includes risk premia.
- **Sim drill**: Calculator exercise. The sim provides a synthetic futures price, current rate and meeting day. The learner computes the probability with the day-weighted formula, then trades the decision knowing the edge is only the gap between the learner's view and the priced view.

### 3.10 Quantitative easing (QE) and quantitative tightening (QT)
- **Def**: QE = large-scale central-bank purchases of bonds (and other assets). QT = shrinking the balance sheet, typically passively, by letting holdings mature without reinvestment [S45].
- **Mechanism**: QE compresses the term premium in long yields (portfolio-balance channel) and signals low rates for longer. Fed staff estimated the 10-year yield would have been about 85 bp higher at end-2017 without purchases [S41]. Fed estimates put the term-premium reduction from three QE rounds at about 100 bp, with about half of QE's impact attributed to signalling [S43]. QT effects are smaller and disputed: one estimate is about 17 bp on 10-year yields early in the 2017-19 runoff, comparable to a 68 bp policy hike [S41][S42][S44]. The balance sheet fell from about $8.9tn to about $7tn by early 2026 (secondary source) [S45].
- **Reaction / reliability**: Announcement effects of QE programmes were large historically. Ongoing QT is slow-moving background. It matters in liquidity stress episodes (e.g. the late-2018 "quantitative frightening" debate [S44]).
- **Risks**: Liquidity squeezes in money markets [BK].
- **Level**: A. **Prereq**: 6.1, 6.2.
- **Misconceptions**: "QE = printing money that directly goes into stocks." "QT is the mirror image of QE." Markets did not treat it symmetrically [S43].
- **Sim drill**: A synthetic "term premium" slider: the learner sees a synthetic 10-year yield split into expected-path + term premium, toggles a QE announcement, and watches which component moves.

### 3.11 Yield curve control (YCC), negative rates, and exits
- **Def**: YCC = targeting a long-term yield (the BoJ capped 10-year JGBs around zero from 2016). NIRP = negative policy rates. The BoJ exited both in March 2024, also ending ETF/J-REIT purchases [S31][S32].
- **Mechanism**: Caps suppress volatility in the targeted market and push adjustment into FX. Exits release that pressure.
- **Reaction / reliability**: Exits are telegraphed. "Buy the rumour, sell the fact" behaviour is common (the yen fell after the hike [S32]).
- **Risks**: Regime breaks: gaps when a peg/cap is abandoned (compare the SNB floor, 4.10).
- **Level**: A/E. **Prereq**: 3.2, 6.1, 6.4.
- **Misconceptions**: "A capped market is safe."
- **Sim drill**: A synthetic capped yield with a pressure gauge (central-bank purchases needed per day). The learner decides when the cap becomes unsustainable; the cap breaks with a gap.

### 3.12 FX intervention and currency regimes
- **Def**: Direct buying/selling of currency by authorities (e.g. Japan's Ministry of Finance, executed by the BoJ; the SNB) or pegs/floors [BK].
- **Mechanism**: Large, sudden flows. Verbal intervention ("watching with a high sense of urgency") is used first [BK].
- **Reaction / reliability**: Actual intervention often produces sharp moves of several big figures in minutes, frequently partly retraced if fundamentals (rate differentials) are unchanged [BK].
- **Risks**: Unscheduled; thin-liquidity timing (often outside main hours) [BK].
- **Level**: A. **Prereq**: 6.4.
- **Misconceptions**: "Intervention reverses a trend permanently."
- **Sim drill**: A synthetic "verbal warning ladder" (level 1-4 phrases), then a random intervention spike. The learner manages a carry-trade position through it.

### 3.13 Blackout periods, central-bank speakers, leaks and "sources" stories
- **Def**: Officials avoid policy talk around meetings (blackout) [S63]. Outside the blackout, speeches move markets according to the speaker's centrality (chair > voters > non-voters) [BK]. Media "sources" stories can pre-signal decisions [BK].
- **Mechanism**: Information flow concentrates before the blackout. Cieslak, Morse and Vissing-Jorgensen link the even-week pattern of stock returns to informal Fed communication [S64].
- **Reaction / reliability**: Speech impact varies widely by speaker. Treat it as a medium-impact, headline-driven event.
- **Risks**: Headline whipsaw; misattributed quotes.
- **Level**: A. **Prereq**: 3.4.
- **Misconceptions**: "All Fed speakers matter equally."
- **Sim drill**: A "speaker roster" with weights. The learner must rank synthetic headlines by expected impact before they hit.

### 3.14 Emergency / unscheduled central-bank actions
- **Def**: Inter-meeting cuts/hikes, swap lines, or facility launches (e.g. March 2020) [BK].
- **Mechanism**: Signals crisis. The reaction can be "relief" or "panic" (the bank knows something bad).
- **Reaction / reliability**: Unpredictable direction; large range.
- **Risks**: Gaps, limit moves, circuit breakers.
- **Level**: A/E. **Prereq**: 3.2, 4.9.
- **Misconceptions**: "Emergency cuts are always bullish."
- **Sim drill**: A crisis scenario where an emergency cut triggers a brief rally followed by a deeper sell-off. The learner must manage a leveraged long.

---

## 4. News trading: strategies, mechanics and risk controls

### 4.0 Microstructure around releases (what learners must "feel" before any strategy)
- **Def**: Before scheduled events, liquidity providers widen quotes and reduce depth. At the release, the price "jumps" to a new level through a thin book, then liquidity returns over seconds to minutes. Volatility and volume are depressed *before* FOMC announcements and spike *at* the release [S63].
- **Mechanism**: Dealers face adverse selection (fast traders with the number). They protect themselves by widening spreads and pulling size.
- **Reaction / reliability**: Spread widening around top-tier releases is near-certain on retail FX/CFD platforms [S66 forum reports][BK]. Pending stop orders are not guaranteed to fill near their trigger [S66].
- **Risks**: Spread-triggered stops (the bid/ask touches your stop even if mid-price does not); slippage; partial fills; requotes; temporary trading disablement by brokers [BK].
- **Level**: B. **Prereq**: 1.2, basic order types.
- **Misconceptions**: "My stop at 1.1000 means my max loss is fixed."
- **Sim drill**: Make spread, depth and fill-latency visible in a "liquidity HUD" during events. The spread multiplier ramps from 1x to 5-20x over the 60 s before release and decays over 1-3 minutes. Show the learner the fill price vs the stop price and an itemised "cost of news" (spread + slippage).

### 4.1 Trading the surprise (directional)
- **Def**: Enter in the direction implied by the sign and size of the surprise vs consensus (Babypips' "directional bias" [S66]).
- **Mechanism**: Prices adjust to new expectations. Larger standardised surprises produce larger moves [S62].
- **Reaction / reliability**: **Moderate** for top-tier releases in the first minutes, but most of the adjustment happens within seconds, before retail order entry [S62][BK]. The edge for a human is mostly in correctly reading *conflicting* components and revisions, not in speed.
- **Risks**: Entering after the jump (buying the high); slippage on market orders; reversal on details.
- **Level**: I. **Prereq**: 1.3-1.8, 4.0.
- **Misconceptions**: "If I am fast enough I can beat the move." Retail latency cannot compete with machine-readable feeds.
- **Sim drill**: Deliberately add a 300-1,500 ms human-reaction latency plus broker latency. Show that the average entry price is already 70-90% of the way to the 1-minute close, so the profitable variant is "trade the continuation only when the surprise is above 2 sigma and details agree".

### 4.2 Fading the spike (counter-trend after overreaction)
- **Def**: Trade against the initial move, expecting a partial retracement once liquidity returns.
- **Mechanism**: Liquidity vacuums and stop cascades overshoot fair value. Conflicting details can reverse the headline reaction.
- **Reaction / reliability**: **Weak-Moderate**. Works when the surprise is small or contradictory; fails badly when the surprise is genuine and large (trend days after CPI/NFP). Not robustly documented in academic literature; practitioner lore [BK].
- **Risks**: Catching a falling knife; the "second leg" in the surprise direction.
- **Level**: A. **Prereq**: 4.0, 4.1, 1.8.
- **Misconceptions**: "Spikes always retrace."
- **Sim drill**: Generate 50 events where the probability of retracement is a hidden function of |z| and component agreement. The learner discovers that fading only works for |z| < 1 with conflicting details.

### 4.3 Straddle entries (pending orders both sides / options straddle)
- **Def**: Place a buy-stop above and a sell-stop below price before the release (non-directional) [S66]. The options variant buys both a call and a put.
- **Mechanism**: Captures a large move in either direction.
- **Reaction / reliability**: **Weak** on retail platforms. Spread widening can trigger *both* sides (whipsaw), and fills slip [S66 forum reports]. The options straddle faces implied-volatility crush: the event premium is priced in, and actual moves have averaged about 85% of the implied move in one practitioner dataset [S83].
- **Risks**: Double fill, slippage, gap through entry, IV crush.
- **Level**: I (concept) / A (options). **Prereq**: 4.0.
- **Misconceptions**: "A straddle cannot lose if the market moves a lot."
- **Sim drill**: Let the learner set a straddle. The sim fires a headline spike up (fills buy-stop), then a details reversal (fills sell-stop), with spread costs on both. Then the options version: show a straddle priced at a 4% implied move vs a realised 3% move, and P&L after IV crush.

### 4.4 Waiting for the second move (trade the reaction, not the number)
- **Def**: Stay out during the first 1-15 minutes. Enter on a pullback/retest or a break of the post-release range once spreads normalise.
- **Mechanism**: The second wave reflects digestion of details. Spreads and slippage normalise.
- **Reaction / reliability**: **Moderate** as a risk-reduction method. Edge depends on the follow-through tendency of large surprises; post-announcement drift exists for earnings [S60], and intraday macro follow-through is plausible but less documented [BK].
- **Risks**: Missing the move; false breakouts of the initial range.
- **Level**: I. **Prereq**: 4.0, 1.8.
- **Misconceptions**: "Waiting = missing the opportunity."
- **Sim drill**: Compare learner P&L on 30 events under two policies (instant entry vs "wait for the 5-minute range break"), with costs. Visualise the equity curves.

### 4.5 Avoiding news (flat before, size down, or hedge)
- **Def**: Close or reduce positions before high-impact events. Or keep them with smaller size and wider stops at the same monetary risk.
- **Mechanism**: Removes gap/slippage tail risk.
- **Reaction / reliability**: **Strong** as a risk control (it reduces the variance of outcomes).
- **Risks**: Opportunity cost; unscheduled events cannot be avoided.
- **Level**: B. **Prereq**: 1.1.
- **Misconceptions**: "Professionals always trade the news."
- **Sim drill**: A "news filter" toggle that auto-flattens N minutes before red events. Compare drawdown statistics with and without it.

### 4.6 "Buy the rumour, sell the news"
- **Def**: Prices rise ahead of an expected positive event, then fall when it is confirmed, as positions are closed [S67].
- **Mechanism**: Expectations get priced in advance. The event removes uncertainty and triggers profit-taking. The reaction is driven by the surprise vs consensus, not by whether the news is "good" [S67].
- **Reaction / reliability**: **Moderate** and context-dependent. Examples: the yen falling after the BoJ's 2024 hike [S32]; stocks falling on good earnings after a run-up [S82]. Bespoke reported that in Q1 2021, 74% of companies beat on EPS and sales yet the average one-day reaction was -0.69% [S82].
- **Risks**: The "news" can exceed the rumour and extend the move.
- **Level**: I. **Prereq**: 1.3, 3.2.
- **Misconceptions**: "Good news = up."
- **Sim drill**: A synthetic run-up into an event (pre-event drift proportional to the probability priced). On a confirming result, a positioning unwind reverses the move. On an above-expected result, continuation. The learner reads a "positioning gauge" to decide.

### 4.7 Pre-event drift and positioning (FOMC drift, earnings run-ups)
- **Def**: Systematic price moves before an event: the S&P 500 rose on average 49 bp in the 24 h before scheduled FOMC announcements since 1994; that window accounted for about 80% of annual realised excess returns in the sample, with no comparable pattern in Treasuries or the dollar [S63].
- **Mechanism**: Unclear. Risk-premium and blackout-related explanations do not fully fit [S63].
- **Reaction / reliability**: **Moderate** (strong in the original sample). Robustness after publication should be treated cautiously (see 8.9 anomaly decay).
- **Risks**: Regime change; crowded trade.
- **Level**: A. **Prereq**: 3.2, 8.0.
- **Misconceptions**: "Free money every FOMC."
- **Sim drill**: Seed a weak synthetic pre-event drift with large noise. The learner estimates whether it is statistically real after N events (teaches sample size and t-stats).

### 4.8 Headline risk (unscheduled text shocks)
- **Def**: Market moves triggered by news headlines (tariffs, sanctions, officials' comments, company announcements) [BK].
- **Mechanism**: Instant repricing of probabilities. Algos parse keywords.
- **Reaction / reliability**: Direction often obvious, magnitude not. Partial reversals are common when headlines are clarified or denied [BK].
- **Risks**: Fake/erroneous headlines (e.g. the 2013 hacked news-agency tweet about explosions at the White House caused a brief equity drop [BK]); misread algos.
- **Level**: I. **Prereq**: 1.2, 4.0.
- **Misconceptions**: "Headlines are facts."
- **Sim drill**: A headline ticker with a reliability score (official, sources, rumour, fake). The learner decides the response; a false headline is denied 3 minutes later and reverses the move.

### 4.9 Geopolitical shocks
- **Def**: Wars, attacks, coups, elections, sanctions [BK].
- **Mechanism**: Flight to safety (USD, JPY, CHF, Treasuries, gold), oil spikes when supply is at risk, equity sell-off.
- **Reaction / reliability**: Initial risk-off is common. Persistence depends on economic transmission (e.g. energy supply). Many geopolitical sell-offs historically recovered within weeks, but this is not a law [BK].
- **Risks**: Weekend gaps; unscheduled; correlated across assets.
- **Level**: I. **Prereq**: 6.5.
- **Misconceptions**: "Always buy the dip on geopolitics."
- **Sim drill**: A weekend geopolitical shock that gaps the Monday open. The learner's Friday position size determines survival. Variant: an energy-supply shock where the risk-off persists.

### 4.10 Liquidity crises and flash crashes: two canonical case studies
- **SNB floor removal (15 Jan 2015)**: The SNB abandoned the EUR/CHF 1.20 floor. Liquidity vanished. One liquidity provider quoted about 1,000 pips below the floor; brokers activated circuit breakers within about 10 seconds; stops filled far beyond their levels; Alpari UK became insolvent the next day [S68]. Euromoney's lesson: "stop-loss orders don't always work" [S68].
- **US Flash Crash (6 May 2010)**: A large trader's algorithm sold 75,000 E-mini S&P 500 contracts targeting 9% of volume "without regard to price or time". High-frequency traders absorbed and then re-sold, liquidity evaporated, the Dow fell nearly 1,000 points and recovered much of it the same afternoon; about 8,000 equities dropped 5-15% [S69].
- **Mechanism**: Liquidity is endogenous. When it disappears, prices gap through levels and stop orders become market orders into a void.
- **Reaction / reliability**: Rare (fat tails) but recurring in different forms.
- **Risks**: Negative balances under leverage; broken trades; trading halts [BK].
- **Level**: I (story) / A (mechanics). **Prereq**: 4.0.
- **Misconceptions**: "Liquid markets (FX majors, S&P futures) cannot gap."
- **Sim drill**: "Floor break" scenario: a synthetic currency pinned at a floor for weeks (tempting leveraged trades) is released without warning. The order book empties and the first print comes 10-20% away. Show the learner's stop fill, the margin call and the negative-balance protection policy.

### 4.11 Risk controls around releases (checklist for the course)
1. Know every red event for your instruments this week (1.1, 1.7).
2. Decide in advance: flat / reduced / hold with hedge. Never decide at T-1 minute.
3. If holding: reduce size so a gap of k times normal ATR (choose k from the sim's history, e.g. 3-5x) stays within your max loss.
4. Wider stop + smaller size = same money at risk. Do not widen stops without cutting size.
5. Prefer limit orders for entries after news. Market orders into thin books slip.
6. Expect spread-triggered stops; consider mental/alert stops on the bid/ask side you trade [BK].
7. Know broker policies: news-time trading restrictions, margin increases, negative-balance protection, guaranteed stops (extra cost) [BK].
8. Weekend/holiday gap rule: reduce leverage before closures.
9. After the release: wait for spreads to normalise before acting (4.4).
10. Journal the realised slippage per event type and update the cost model.
- **Level**: B-I. **Sim drill**: A pre-event checklist gate. The sim requires the learner to tick each item before allowing new orders in the 15 minutes before a red event (can be relaxed at higher levels).

### 4.12 Sentiment of the "reaction to news" (market tells)
- **Def**: How price reacts to news reveals positioning. A market that falls on good news is "heavy"; one that rallies on bad news is "washed out" [BK].
- **Mechanism**: Positioning saturation (see Section 7).
- **Reaction / reliability**: **Weak-Moderate**, discretionary.
- **Level**: A. **Prereq**: 4.6, 7.x.
- **Misconceptions**: "Reactions are random noise."
- **Sim drill**: A hidden positioning variable makes reactions asymmetric. The learner infers positioning from 5 event reactions, then confirms with a synthetic COT report (7.1).

---

## 5. Company fundamentals for stock traders

### 5.1 The three financial statements and how they link
- **Def**: The income statement (revenue to net income over a period), the balance sheet (assets = liabilities + equity at a point in time), and the cash-flow statement (operating, investing and financing cash flows) [S81].
- **Mechanism**: Net income flows into retained earnings (balance sheet) and is the starting line of operating cash flow. Working-capital changes adjust cash. Depreciation is a non-cash expense added back. Capex raises PP&E and appears in investing cash flow [S81].
- **Reaction / reliability**: Foundation knowledge; the statements themselves rarely "move" prices except via surprises vs expectations.
- **Risks**: Accounting quality: earnings can rise while cash flow falls (receivables build-up).
- **Level**: B. **Prereq**: none.
- **Misconceptions**: "Profit = cash." "Revenue growth = value creation."
- **Sim drill**: A "statement builder": the learner runs a synthetic company for 4 quarters, makes decisions (credit sales, capex), and sees all three statements update and link. A quiz then asks why net income and operating cash flow diverged.

### 5.2 Core line items and metrics
- **Def**: Revenue, gross margin, operating margin (EBIT), EBITDA, net income, EPS (basic/diluted), operating cash flow, free cash flow (OCF - capex), net debt, working capital, share count [BK].
- **Mechanism**: Margins and growth drive future cash flows; dilution drives per-share value.
- **Reaction / reliability**: The market reacts to *changes versus expectations* in these metrics (5.6).
- **Risks**: GAAP vs adjusted ("non-GAAP") EPS: companies choose exclusions [BK].
- **Level**: B. **Prereq**: 5.1.
- **Misconceptions**: "Adjusted EPS is the real number." "EBITDA = cash flow" (it ignores capex, working capital, taxes, interest).
- **Sim drill**: Two synthetic companies with identical adjusted EPS but different stock-based comp, capex and dilution. The learner ranks them by FCF per share.

### 5.3 Key ratios (profitability, leverage, liquidity, efficiency)
- **Def**: ROE, ROA, ROIC, debt/equity, net debt/EBITDA, interest coverage, current/quick ratio, asset turnover, inventory days, receivable days [BK].
- **Mechanism**: Quality and risk inputs. Highly leveraged firms are more sensitive to rates and recession.
- **Reaction / reliability**: Slow-moving; matters more for investing than for short-term trading, except around credit events.
- **Risks**: Sector comparability (banks vs software).
- **Level**: I. **Prereq**: 5.1, 5.2.
- **Misconceptions**: "High ROE is always good." Leverage can inflate it.
- **Sim drill**: A "ratio detective" game: the learner gets three synthetic companies' ratios and must identify which one is levered, which has inventory problems, and which is a high-quality compounder.

### 5.4 Valuation multiples (P/E, PEG, P/B, P/S, EV/EBITDA, EV/Sales, FCF yield, dividend yield)
- **Def**: Price multiples relate share price to per-share fundamentals. Enterprise-value multiples relate the value of all capital (equity + net debt) to company-wide fundamentals (CFA Institute reading) [S80]. In a CFA survey of about 1,980 practitioners, about 93% use a market-multiples approach, and EV/EBITDA is the most common EV multiple [S80].
- **Mechanism**: Multiples encode expected growth, risk and discount rates. Multiple expansion/contraction is how macro (rates) hits stock prices.
- **Reaction / reliability**: Cheap stocks can stay cheap ("value traps"). Multiples are poor short-term timing tools [BK].
- **Risks**: Comparing across different capital structures (use EV multiples); cyclically depressed earnings make P/E look high at the bottom.
- **Level**: I. **Prereq**: 5.2.
- **Misconceptions**: "Low P/E = undervalued." "P/E ignores debt" (correct; that is why EV/EBITDA exists).
- **Sim drill**: A rate-shock lab: the synthetic discount rate rises 1 pp; long-duration (high-growth, high-P/E) stocks fall more than low-P/E ones. The learner predicts the ranking.

### 5.5 Intrinsic valuation: DCF, DDM, residual income (intro)
- **Def**: Present value of expected future cash flows (FCF to firm/equity), dividends, or excess returns, discounted at the cost of capital (WACC / cost of equity). Terminal value is often computed with a multiple or a perpetual-growth formula [S80][BK].
- **Mechanism**: Links fundamentals and rates to price. Small changes in discount rate or terminal growth produce large value changes.
- **Reaction / reliability**: A model, not a forecast. Garbage in, garbage out.
- **Risks**: Terminal-value dominance (often more than 60-70% of value) [BK]; false precision.
- **Level**: A. **Prereq**: 5.1-5.4, 6.1.
- **Misconceptions**: "DCF gives the true price."
- **Sim drill**: An interactive DCF with sliders (growth, margin, WACC, terminal growth). A sensitivity heat-map shows how ±1 pp WACC moves value. The sim's synthetic stock price is driven by the "market's" hidden assumptions; the learner tries to reverse-engineer them (reverse DCF).

### 5.6 Earnings season mechanics
- **Def**: Quarterly reports, usually with a press release before the open or after the close, followed by a conference call. The market compares EPS and revenue to consensus, plus key KPIs and guidance [BK][S82].
- **Mechanism**: New information about future cash flows. The surprise vs consensus and the guidance change drive the gap.
- **Reaction / reliability**: "Beats" are the norm. The FactSet-based 5-year average EPS beat rate is about 78% (10-year about 75%); about 86% of S&P 500 companies beat in Q2 2026 [S65]. A beat alone is therefore weak information; the *magnitude* and guidance matter.
- **Risks**: Overnight gaps (5.9), IV crush (5.8), conference-call whipsaw.
- **Level**: I. **Prereq**: 5.2, 1.5.
- **Misconceptions**: "Beat = up." "Consensus = the bar." The real bar can be the whisper number or buy-side expectations [BK].
- **Sim drill**: Earnings-season simulator: the learner sees consensus EPS/revenue, a whisper number, the implied move, and recent price run-up. They choose a position and then see the release, guidance, gap and post-call move.

### 5.7 Guidance and the "beat-and-raise" matrix
- **Def**: Management's outlook for next quarter/year (revenue, EPS, margins).
- **Mechanism**: Guidance changes the future cash-flow path more than one quarter's results. "Beat and raise" is historically the most reliable positive catalyst. "Beat and lower" can produce sharp drops. Mixed combinations (revenue beat + EPS miss, in-line + guide cut) are unpredictable [S82].
- **Reaction / reliability**: **Moderate** (practitioner sources; academic evidence on guidance exists but was not retrieved this session).
- **Risks**: Sandbagging (conservative guidance by habit) [BK]; guidance withdrawal in crises.
- **Level**: I. **Prereq**: 5.6.
- **Misconceptions**: "Results matter more than guidance."
- **Sim drill**: A 3x3 matrix (results miss/in-line/beat x guidance cut/maintain/raise). The learner predicts the gap sign and size for each cell, then 40 synthetic reports test the predictions. The sim includes a "sandbagger" company whose raises are expected.

### 5.8 Implied move, options pricing into earnings, IV crush
- **Def**: The at-the-money straddle price for the first expiry after earnings approximates the market's expected move. Implied volatility rises into the event and collapses after it ("IV crush") [S83].
- **Mechanism**: Uncertainty resolution. In one dataset the actual/implied move ratio was about 85% (straddles priced rich), while another study found aggregate pricing roughly fair, so evidence is mixed. Short-straddle backtests show that occasional large moves can wipe out IV-crush gains [S83].
- **Reaction / reliability**: **Moderate**.
- **Risks**: Tail moves; liquidity of options.
- **Level**: A. **Prereq**: 5.6, options basics.
- **Misconceptions**: "Buying calls before earnings is a cheap bet on a beat." Even if the stock rises, IV crush can make the call lose.
- **Sim drill**: Price a synthetic straddle from a synthetic IV term structure. The learner predicts whether the realised move will beat the implied move. Show option P&L decomposed into delta vs vega.

### 5.9 Earnings gaps, pre-market and after-hours trading
- **Def**: Earnings released outside regular hours cause the next session to open at a gap. Extended-hours trading has fewer participants, potentially wider swings, no NBBO protection, possible inferior prices, options generally not trading, and brokers often restricting order types (limit only) [S86].
- **Mechanism**: Information arrives when liquidity is lowest.
- **Reaction / reliability**: Gaps are the norm for large surprises. Extended-hours prices are less reliable than regular-session prices [S86].
- **Risks**: Stops do not protect against overnight gaps (a stop executes at the open, possibly far beyond the level); extended-hours fills at poor prices [S86].
- **Level**: I. **Prereq**: 4.0, 5.6.
- **Misconceptions**: "The after-hours price is where it will open." "A stop-loss limits overnight losses."
- **Sim drill**: An "after-hours" mode with 10% depth and a limit-orders-only rule. The learner's regular-hours stop executes at the gap-open price. Compare outcomes against a protective put.

### 5.10 Post-earnings announcement drift (PEAD)
- **Def**: The tendency of stock returns to continue in the direction of an earnings surprise for weeks/months. First documented by Ball and Brown (1968). Bernard and Thomas (1989) found the top-minus-bottom SUE decile spread positive in 41 of 48 quarters (1974-1985) [S60].
- **Mechanism**: Underreaction (investors use naive earnings models). 25-30% of the drift occurs around the next quarters' announcements [S60]. Risk-based and limits-to-arbitrage explanations also exist [S60].
- **Reaction / reliability**: **Moderate and declining**. The high-minus-low spread fell from about 5% in the 1980s-90s to 3% or less in the late 2010s, possibly because of more arbitrage or lower earnings persistence [S60][S61]. Drift is concentrated in small, illiquid, low-coverage stocks where costs are highest [S60].
- **Risks**: Transaction costs eat the edge; crowding.
- **Level**: A. **Prereq**: 5.6, 8.9.
- **Misconceptions**: "PEAD is a free lunch in large caps."
- **Sim drill**: Seed a small synthetic drift. The learner builds a SUE-ranked portfolio, sees gross vs net-of-costs results, then the sim "decays" the effect after publication (8.9).

### 5.11 Analyst ratings, price targets and estimate revisions
- **Def**: Sell-side Buy/Hold/Sell ratings, 12-month price targets, and EPS estimate revisions [BK].
- **Mechanism**: Information plus attention and flows. Upgrades/downgrades cause short-term moves, with larger effects for downgrades and influential analysts. Literature such as Womack (1996) is widely cited but was not retrieved this session [BK].
- **Reaction / reliability**: **Moderate** for the initial reaction; the drift evidence is mixed [BK]. Estimate-revision momentum is a known quant factor [BK].
- **Risks**: Conflicts of interest; herding; price targets that chase price.
- **Level**: I. **Prereq**: 5.6.
- **Misconceptions**: "A price target is a forecast with high accuracy." "Most ratings are Sell." Historically, Buy ratings dominate [BK].
- **Sim drill**: Synthetic analysts with different hidden accuracies. The learner tracks their records and learns to weight them.

### 5.12 Corporate actions
- **Dividends**: The record date determines entitlement. Under T+1 settlement (since May 2024) the ex-dividend date is generally the same as the record date; for special dividends of 25% or more of the stock's value, the ex-date is deferred to one business day after payment [S84]. The price typically drops by about the dividend on the ex-date [BK]. Level B. Misconception: "Buying before ex-date = free money." Sim drill: the ex-date price adjustment is shown on a synthetic chart, with a tax/fee setting.
- **Stock splits / reverse splits**: Splits change share count and price proportionally and leave market cap unchanged [S85]. Possible signalling or "cheap-looking price" demand effects are discussed but contested [S85]. Reverse splits are often associated with distressed or low-priced stocks (exchange listing thresholds) [BK]. Level B. Misconception: "A split makes the stock cheaper/more valuable." Sim drill: split a synthetic stock; the learner verifies that position value is unchanged; adjusted vs unadjusted charts (indicator distortion).
- **Buybacks**: Reduce shares outstanding, which raises EPS mechanically. Open-market programmes (about 95% of buybacks) are not binding and can be "cheap talk". Short-term announcement price increases are modest and do not reverse on average [S85]. Long-run drift after buybacks (Ikenberry, Lakonishok and Vermaelen 1995) is widely cited but was not retrieved [BK]. Level I. Misconception: "EPS growth from buybacks = business growth." Sim drill: two companies with identical EPS growth, one from operations and one from buybacks financed by debt; the learner compares risk.
- **Equity issuance / secondary offerings**: Dilution plus a supply overhang; prices typically drop on announcement [BK]. Level I.
- **M&A**: The target jumps toward the offer price; the acquirer often falls; the spread reflects deal-failure risk (merger arbitrage) [BK]. Level A.
- **Index inclusion/deletion, spin-offs, insider buying**: Flow and information events [BK]. Level A.

### 5.13 Sector-specific KPIs (brief)
- Examples: retail same-store sales; SaaS ARR/net retention; banks net interest margin/credit losses; energy production/breakeven; semis book-to-bill; airlines load factor [BK].
- **Level**: A. **Sim drill**: Each synthetic company has one "headline KPI" that dominates its reaction function. The learner must find it from past reactions.

### 5.14 Crypto-specific fundamentals (brief; all [BK], not verified this session)
- **On-chain activity**: active addresses, transaction counts and fees. These are network-usage proxies, noisy and gameable. Level I.
- **Exchange flows**: net inflows to exchanges are read as potential selling supply; outflows as accumulation/self-custody. Weak-moderate signal; wallet labelling is imperfect. Level I.
- **MVRV / realised cap**: market cap vs realised cap (coins valued at last on-chain movement price). Extremes are read as over/undervaluation. Descriptive, not a timing tool. Level A.
- **Supply mechanics**: issuance schedules, Bitcoin halvings (about every 4 years; most recent April 2024), burn mechanisms, staking yields. Level I.
- **Token unlocks / vesting cliffs**: scheduled releases of team/investor tokens add supply. Large unlocks relative to circulating supply and daily volume are often associated with pre-unlock weakness; evidence is mostly from industry research and varies. This maps directly to the simulator's "scheduled event" engine. Level I.
- **Derivatives positioning**: perpetual funding rates, open interest, liquidation clusters. Crowded leverage plus a move gives liquidation cascades (crypto "flash crashes"). Level A.
- **Stablecoin supply, ETF flows, regulatory and exchange-hack headlines**: liquidity and headline-risk drivers. Level I.
- **Market-structure specifics**: 24/7 trading, weekend thin liquidity, fragmented venues, de-pegs. Level I.
- **Sim drill**: A synthetic token with a public unlock schedule (cliff = 8% of float on day X). The learner sees funding rates and OI build; at the unlock, a supply event + long-liquidation cascade fires. The learner must choose position size and leverage beforehand.

---

## 6. Macro and intermarket

### 6.1 Interest rates: policy rates, market rates, real vs nominal
- **Def**: Policy rate (set by the central bank) vs market yields (2y, 10y, 30y). Real yield ≈ nominal yield - expected inflation (TIPS yields measure it directly; breakeven = nominal - TIPS) [BK].
- **Mechanism**: Rates are the price of money and the discount rate for all assets. Rate differentials drive FX. Real yields are the opportunity cost of holding gold [S75].
- **Reaction / reliability**: Rising real yields have historically pressured long-duration equities and gold, but relationships shift (6.9).
- **Risks**: Confusing price and yield (bond prices fall when yields rise).
- **Level**: B. **Prereq**: none.
- **Misconceptions**: "Higher rates are always bad for stocks." It depends on why rates rise (growth vs inflation/term premium).
- **Sim drill**: A bond price/yield toy: the learner moves the yield slider and sees bond, growth-stock and gold prices respond. Then a "why did yields rise?" twist: growth-driven (equities ok) vs inflation-driven (equities down).

### 6.2 Yield curve: shape, inversion, steepeners and flatteners
- **Def**: Yields across maturities. The 10y-3m and 10y-2y spreads are standard. Inversion (short above long) has preceded each US recession since the 1950s, with false positives (e.g. the late 1960s and 1998) [S46][S47]. The NY Fed's probit model (Estrella and Mishkin) converts the 10y-3m spread into a 12-month recession probability; it exceeded 70% in May 2023, the highest since 1982 [S47][S48].
- **Mechanism**: The front end follows expected policy; the long end reflects growth/inflation expectations plus term premium. Inversion = expected cuts (often because of an expected slowdown). Bull steepening (front-end rally) often occurs as the central bank starts cutting near a downturn [BK].
- **Reaction / reliability**: **Moderate** as a long-lead recession signal with variable and long lags. The 2022-24 inversion produced a very high model probability without a recession immediately following, a lesson in false positives and lag uncertainty [S48][BK].
- **Risks**: Treating inversion as a timing signal for equity tops.
- **Level**: I. **Prereq**: 6.1.
- **Misconceptions**: "Inversion = sell stocks now."
- **Sim drill**: A synthetic curve animates through a business cycle. The learner labels bear flattener / bull steepener phases and estimates a probit-style recession probability from the spread.

### 6.3 Inflation: drivers and expectations
- **Def**: The general rise in prices. Drivers: demand-pull, cost-push (energy, supply chains), wages, inflation expectations, shelter dynamics [BK].
- **Mechanism**: Inflation shapes central-bank reaction functions and real returns. High-inflation regimes change asset correlations: the stock-bond correlation turns positive when monetary policy is restrictive (average -11.5% in accommodative regimes vs +28.1% in restrictive ones, Baele and Van Holle) [S72].
- **Reaction / reliability**: Strong as a regime determinant.
- **Risks**: Regime misidentification.
- **Level**: B/I. **Prereq**: 2.2.
- **Misconceptions**: "Gold always hedges inflation" (6.9). "Stocks are an inflation hedge in the short run."
- **Sim drill**: Regime switcher: the same portfolio (60/40) is run in a synthetic disinflation regime and an inflation regime. The learner observes the 2022-style simultaneous stock + bond drawdown (in 2022 both the S&P 500, -18.1%, and long Treasuries, -26.1%, fell by double digits for the first time [S72]).

### 6.4 The US dollar: rate differentials, safe-haven role, dollar smile
- **Def**: The dollar's value vs other currencies (DXY index vs a basket) [BK]. "Dollar smile" (Stephen Jen): the USD tends to strengthen when the US economy is very strong (capital inflows) *or* in global stress (reserve-currency safe haven), and weaken in the middle (synchronised global growth) [S73].
- **Mechanism**: Rate differentials, growth differentials, global dollar funding demand in crises.
- **Reaction / reliability**: **Moderate**. Exceptions occur, e.g. the August 2024 sell-off, when the dollar struggled because the shock was a yen carry-trade unwind triggered by a BoJ hike and a yen surge [S73].
- **Risks**: Assuming USD always rallies in risk-off.
- **Level**: I. **Prereq**: 6.1.
- **Misconceptions**: "Strong economy = strong currency, always."
- **Sim drill**: Three synthetic world states (US boom, global boom, global crisis). The learner places the USD on the smile and positions accordingly; a fourth "carry-unwind" state breaks the rule.

### 6.5 Risk-on / risk-off (RORO) and safe havens
- **Def**: Regime in which assets move together according to global risk appetite. Risk-on: equities, high-beta FX (AUD, NZD, EM), credit and commodities up. Risk-off: USD, JPY, CHF, Treasuries and gold up [BK].
- **Mechanism**: Leverage, volatility targeting and funding liquidity force correlated de-risking [BK].
- **Reaction / reliability**: **Moderate**, regime-dependent. The yen's safe-haven role weakened when rate differentials were very wide and was described as returning as the gap narrowed [S73].
- **Risks**: Correlations spike to 1 in crises, so diversification fails exactly when needed.
- **Level**: I. **Prereq**: 6.4.
- **Misconceptions**: "Safe havens are fixed."
- **Sim drill**: A "RORO meter" built from synthetic VIX, credit spreads and AUD/JPY. The learner predicts the cross-asset reaction to a risk-off shock and sees correlation matrices before and after.

### 6.6 Business cycle
- **Def**: Expansion and contraction phases: early, mid, late, recession. Average US expansions in Fidelity's dataset lasted about 5 years 4 months and contractions a little over 10 months [S74].
- **Mechanism**: Credit, inventories, policy and confidence cycles.
- **Reaction / reliability**: Phases are identified with hindsight. Real-time classification is error-prone.
- **Risks**: Over-confidence in phase calls.
- **Level**: I. **Prereq**: 2.x.
- **Misconceptions**: "Cycles are regular and periodic."
- **Sim drill**: A synthetic economy with hidden phase. The learner classifies the phase each month from synthetic PMI new orders, claims, curve slope and credit spreads; the score is revealed at the end.

### 6.7 Sector rotation across the cycle
- **Def**: Shifting sector leadership through the cycle. Early cycle: rate-sensitive sectors (consumer discretionary, financials, industrials). Mid: technology/growth. Late: energy/materials. Recession: defensives (staples, utilities, healthcare); Treasuries do best relative to stocks in recessions [S74].
- **Mechanism**: Earnings sensitivity to growth, rates and inflation.
- **Reaction / reliability**: **Weak-Moderate**. Mappings differ by source, and one academic study finds conventional rotation yields modest outperformance that largely disappears after costs and cycle-timing errors [S74].
- **Risks**: Mistiming phases; sector composition changes over time.
- **Level**: I/A. **Prereq**: 6.6.
- **Misconceptions**: "Rotation is a reliable timing system."
- **Sim drill**: The learner allocates across 6 synthetic sectors each quarter; the sim scores against a perfect-hindsight rotation and against buy-and-hold, net of costs.

### 6.8 Intermarket analysis (John Murphy)
- **Def**: A framework linking bonds, stocks, commodities and the dollar. The "normal" relationships summarised from Murphy: stocks and bonds positive; stocks and commodities inverse; stocks and dollar positive; bonds and commodities inverse; bonds and dollar positive; commodities and dollar inverse. Turning-point sequence: bonds turn before stocks, and stocks before commodities [S71].
- **Mechanism**: Inflation expectations link commodities to bond yields; rates link bonds to stocks; the dollar prices commodities.
- **Reaction / reliability**: **Weak-Moderate**. The relationships are regime-dependent [S71]. Murphy himself described a deflationary regime (late 1990s onward) in which bond prices and stocks decoupled [BK]. The 2022 inflation regime flipped the stock-bond relationship again [S72].
- **Risks**: Mechanical use of fixed signs.
- **Level**: A. **Prereq**: 6.1-6.5.
- **Misconceptions**: "Intermarket rules are laws."
- **Sim drill**: A synthetic multi-asset world with a hidden regime (inflationary vs deflationary). The learner estimates rolling correlations and identifies which Murphy relationships currently hold.

### 6.9 Correlations and their instability (case studies)
- **Stock-bond**: Negative (or barely above zero) from about Nov 2000 to 2020; often positive over multiyear periods historically; about +0.58 in 2022 and 2023 [S72]. A 2025 Markov-switching study finds Treasury diversification fails in inflation-driven downturns [S72].
- **Gold vs real yields**: A historically strong inverse correlation (about -0.72 average 1997-2020 in one analysis) broke in 2022-24, with gold rising despite positive real yields. This is attributed largely to central-bank buying (about 1,100 t/yr per WGC data as cited), sanctions-related reserve diversification and geopolitics [S75].
- **Yen as safe haven**: Weakened during wide rate differentials [S73].
- **Mechanism**: Correlations are outputs of the dominant shock type (growth vs inflation vs policy vs flows).
- **Level**: A. **Prereq**: 6.8.
- **Misconceptions**: "Correlation is a constant you can hedge with."
- **Sim drill**: A rolling-correlation chart of two synthetic assets; the sim flips the regime mid-session. The learner's "hedged" portfolio loses on both legs; debrief on correlation risk.

### 6.10 Commodities in macro (oil, copper, gold)
- **Def**: Oil = growth + supply shocks (OPEC, geopolitics, EIA inventories). Copper = industrial demand ("Dr. Copper"). The copper/gold ratio is used as a growth proxy that tends to track bond yields. Gold = real yields, USD, safe-haven and official demand [S71][S75][BK].
- **Mechanism**: Supply/demand plus the USD denomination (a weaker USD supports commodity prices).
- **Reaction / reliability**: Moderate; supply shocks dominate in oil.
- **Risks**: Inventory-report spikes; weekend geopolitical gaps; contango/backwardation roll effects in futures [BK].
- **Level**: I. **Prereq**: 6.4.
- **Misconceptions**: "Oil up = good for stocks." Energy stocks yes; consumers and inflation no.
- **Sim drill**: A weekly synthetic EIA release that moves synthetic crude and a "petro-currency" (CAD/NOK analogue). The learner trades the spread.

### 6.11 Commodity currencies and terms of trade
- **Def**: AUD (iron ore, China), CAD (oil), NOK (oil), NZD (dairy), and emerging-market FX [BK].
- **Mechanism**: Export prices drive terms of trade, national income and currency demand.
- **Reaction / reliability**: Moderate; rate differentials often dominate.
- **Level**: I. **Prereq**: 6.10.
- **Sim drill**: Link synthetic China PMI to synthetic AUD and copper; the learner exploits (or fails to exploit) the lag.

### 6.12 Carry trade and unwinds
- **Def**: Borrowing in low-yield currencies (JPY, CHF historically) to invest in high-yield ones; the trader earns the rate differential [BK].
- **Mechanism**: Steady small gains, then crash risk when volatility spikes or the funding currency rallies (August 2024 yen surge after the BoJ hike) [S73].
- **Reaction / reliability**: "Picking up pennies in front of a steamroller" [BK]; carry returns are negatively skewed.
- **Level**: A. **Prereq**: 6.4, 6.5.
- **Misconceptions**: "Positive swap = free income."
- **Sim drill**: The learner holds a synthetic carry position earning daily swap; a volatility shock + funding-currency rally wipes months of carry in a day. Show the skew of the return distribution.

### 6.13 Credit spreads and financial conditions
- **Def**: Corporate yield minus Treasury yield (investment grade, high yield). Financial-conditions indices combine rates, spreads, equities and the USD [BK].
- **Mechanism**: Default-risk pricing; tightening conditions slow the economy.
- **Reaction / reliability**: Credit often leads equities at turning points (practitioner view) [BK].
- **Level**: A. **Prereq**: 6.1, 6.6.
- **Sim drill**: A synthetic HY spread widens 2 weeks before a synthetic equity drawdown in some (not all) cycles. The learner tests whether it is a reliable lead.

### 6.14 Fiscal policy, deficits, term premium
- **Def**: Government spending/taxation, bond supply (auction sizes), and the term premium [S41][BK].
- **Mechanism**: More supply needs higher yields to clear, especially without central-bank buying (QT).
- **Reaction / reliability**: Slow; occasionally acute (weak auctions, budget events) [BK].
- **Level**: A/E. **Prereq**: 3.10, 2.10 (auctions).
- **Sim drill**: A synthetic auction with a large "tail" shows a sudden long-end sell-off and steepening.

---

## 7. Sentiment and positioning

### 7.0 Principle: sentiment is a condition, not a trigger
- **Def**: Sentiment gauges describe how one-sided expectations or positions are. Extremes raise the *probability* of reversal but do not time it. AAII notes its survey can stay on one side of the pendulum for prolonged periods [S58].
- **Level**: I. **Sim drill**: Every sentiment drill should include "extreme sentiment, and the trend continues for N more weeks" cases.

### 7.1 CFTC Commitments of Traders (COT)
- **Def**: Weekly breakdown of futures (and futures+options) open interest by trader category. Positions are as of Tuesday and published Friday 15:30 ET (3-day lag) [S49][S50].
- **Report types**: Legacy (commercial / non-commercial / non-reportable); Disaggregated (producer/merchant, swap dealer, managed money, other reportables; physical commodities, since 2009); Traders in Financial Futures (dealer/intermediary, asset manager/institutional, leveraged funds, other reportables) [S50]. Reportable positions usually cover about 70-90% of open interest. Non-reportable = residual with unknown trader classification. Classification is by CFTC judgement (Form 40) and may be reclassified; one trader can be commercial in one market and non-commercial in another [S49].
- **Mechanism**: Extreme speculative (non-commercial / managed money / leveraged funds) net positioning signals crowding. Unwinds amplify moves. Commercials hedge and are often "on the other side" at extremes [BK].
- **Reaction / reliability**: **Weak-Moderate** as a contrarian condition at multi-year extremes (e.g. a COT index at 0/100 over 3 years) [BK]. It is weak as a timing signal: lagged, weekly, and categories mix motives.
- **Risks**: Data lag (Friday release on Tuesday data); misinterpreting commercials' hedging as a directional view.
- **Level**: I (read) / A (use). **Prereq**: futures basics, 7.0.
- **Misconceptions**: "COT shows what smart money will do next." "Non-commercials are retail."
- **Sim drill**: The sim publishes a synthetic COT every Friday with Tuesday data, computed from its own agent population. The learner builds a COT index (percentile of net position over 156 weeks) and tests contrarian entries against trend-following. A "crowded long + negative surprise" event shows the unwind amplification.

### 7.2 VIX (Cboe Volatility Index)
- **Def**: The market's expectation of 30-day S&P 500 volatility, derived from a strip of SPX option prices across strikes (not from Black-Scholes), using options with about 23-37 days to expiry interpolated to 30 days. Introduced in 1993 on OEX at-the-money options and redesigned in 2003 on SPX [S51][S52]. Intraday values update from 15-second snapshots [S51].
- **Mechanism**: Demand for downside protection raises implied volatility. VIX tends to rise when stocks fall (leverage/fear effect) [BK]. Rule of thumb: VIX/√12 ≈ the expected 1-standard-deviation one-month % move (e.g. VIX 20 means about 5.8%) [BK math].
- **Reaction / reliability**: Mean-reverting. Spikes are usually short-lived and very high levels have historically coincided with high-fear periods that preceded above-average forward returns, but with huge variance and no timing guarantee [BK]. The VIX futures curve in backwardation (front > back) indicates acute stress [BK].
- **Risks**: VIX is not tradable directly; VIX ETPs suffer roll decay [BK]; short-vol blowups (e.g. Feb 2018 "Volmageddon") [BK].
- **Level**: I. **Prereq**: options basics (implied volatility).
- **Misconceptions**: "VIX predicts direction." "Low VIX = safe" (low VIX can precede shocks; complacency).
- **Sim drill**: The synthetic VIX is computed from the simulator's own option chain. The learner sees VIX and term structure react to a crash event, then mean-revert. Quiz: convert VIX to an expected weekly range and check how often realised moves exceed it.

### 7.3 Put/call ratios
- **Def**: Put volume / call volume. Cboe publishes total, index, equity, VIX-option and SPX+SPXW ratios daily (e.g. one recent day: total 0.87, index 1.01, equity 0.56) [S53].
- **Mechanism**: Heavy put buying = fear (contrarian bullish at extremes); heavy call buying = greed/complacency (contrarian bearish) [S54][S55].
- **Reaction / reliability**: **Weak-Moderate**. One secondary dataset gives the total-ratio long-run average about 0.97 (2007-2022), with extremes above 1.23 and below 0.72 as top/bottom 5% [S54]. Thresholds drift by regime. The equity ratio is the purer speculative gauge, while index puts are dominated by hedging [S54]. Cboe-only data were distorted by new daily expiries (e.g. a 2022 record not matched in the composite) [S55]. Smooth with 5-10 day averages and wait for price confirmation [S54].
- **Risks**: Structural changes (0DTE options) break historical thresholds.
- **Level**: I. **Prereq**: options basics, 7.0.
- **Misconceptions**: "Put buying = bearish bets." Much is hedging.
- **Sim drill**: The synthetic options market generates daily put/call. The learner sets thresholds and backtests contrarian signals; the sim then introduces "0DTE" flow that shifts the baseline and breaks the thresholds.

### 7.4 AAII Sentiment Survey and other surveys
- **Def**: Weekly AAII member poll: will stocks be up, neutral or down over the next 6 months? Voting runs Thursday-Wednesday, results are published Thursday, and it has run since 1987. Historical averages are about 37.5% bullish, 31% neutral, 31.5% bearish (AAII's page is inconsistent between text and table). The week ending Oct 14, 2026 read 38.7% bullish, 19.7% neutral, 41.6% bearish [S57].
- **Mechanism**: Retail-investor mood as a contrarian gauge at extremes. The record bearish reading of 70.3% came on March 5, 2009, near the bear-market bottom [S58].
- **Reaction / reliability**: **Weak-Moderate**; useful mainly at about ±2 standard-deviation extremes. Claims such as "bullish < 20% reliably predicts strong returns" come from secondary sources and are unverified [S59].
- **Other surveys [BK]**: Investors Intelligence (newsletter writers), NAAIM exposure (active managers), BofA Global Fund Manager Survey (cash levels, "most crowded trade"), CNN Fear & Greed composite, UMich consumer sentiment (macro).
- **Risks**: Small sample, self-selection; sentiment can stay extreme.
- **Level**: B (read) / I (use). **Prereq**: 7.0.
- **Misconceptions**: "Bearish majority = market will go down."
- **Sim drill**: The synthetic agent population answers a weekly survey derived from recent returns (adaptive expectations). The learner plots the bull-bear spread and sees that extremes follow price rather than lead it, except at climaxes.

### 7.5 Positioning (beyond COT)
- **Def**: Who holds what, and how forced their flows are: CTA trend-follower exposure, volatility-targeting and risk-parity funds, dealer options gamma, short interest and days-to-cover, margin debt, fund flows [BK].
- **Mechanism**: Mechanical flows amplify or dampen moves. Short squeezes occur when crowded shorts must buy (e.g. 2021 meme-stock episode) [BK].
- **Reaction / reliability**: **Moderate** for explaining moves after the fact; weaker for forecasting. Data often comes from paid or estimated sources [BK].
- **Risks**: Squeezes against the obvious trade.
- **Level**: A/E. **Prereq**: 7.1, options basics.
- **Misconceptions**: "Price moves only on news."
- **Sim drill**: An agent-based scenario: a population of trend followers plus a crowded short. A small positive news event triggers a squeeze many times larger than the fundamental surprise. The learner identifies the fuel (short interest, days-to-cover) beforehand.

### 7.6 Contrarian vs trend-confirming use of sentiment
- **Def**: Contrarian = fade extremes. Confirming = moderate optimism in uptrends is healthy.
- **Mechanism**: Extremes mean the marginal buyer/seller is exhausted.
- **Reaction / reliability**: Mixed; works best combined with price confirmation [S54].
- **Level**: I/A. **Prereq**: 7.1-7.4.
- **Sim drill**: A two-signal game. Contrarian entries are only allowed after a price-reversal confirmation; compare against naive fades.

### 7.7 Social and news sentiment
- **Def**: Text-derived sentiment from social media (Reddit, X), news tone scores, search trends, crypto community metrics [BK].
- **Mechanism**: Attention-driven retail flows (meme stocks, altcoins), coordination, FOMO.
- **Reaction / reliability**: **Weak**; high noise, manipulation (pump-and-dumps, bots). Some academic studies report predictive power in specific samples, but robustness is low [BK].
- **Risks**: Pump-and-dump; extreme volatility; halts.
- **Level**: I. **Prereq**: 7.0.
- **Misconceptions**: "Trending = going up."
- **Sim drill**: A synthetic "social feed" with bot amplification on a small-cap. Price spikes on hype, then collapses as insiders sell. The learner tracks volume/float and avoids being exit liquidity.

### 7.8 Crypto sentiment/positioning specifics (brief; [BK])
- Funding rates (persistently positive = crowded longs), open-interest surges, liquidation heat maps, long/short ratios, stablecoin exchange balances, Fear & Greed indices.
- **Level**: I/A. **Sim drill**: See 5.14 (liquidation-cascade scenario).

---

## 8. Seasonality and calendar effects (with evidence quality)

### 8.0 How to teach seasonality
- Present each effect with: original study, sample, effect size, post-publication evidence, plausible mechanism, and trading costs. Emphasise data mining. McLean and Pontiff replicated 97 published predictors and found returns decline out-of-sample, with only about a 26% decline before publication. Larger post-publication declines (about 58% in the original paper) are cited but were not re-verified [S77][BK].
- **Sim drill (core)**: A "seasonality lab" where the sim injects a *known* synthetic effect (or none) into synthetic data. The learner must detect it, estimate significance, and see how often pure noise produces "significant" calendar effects (multiple-testing lesson).

| # | Effect | Claim | Key evidence | Post-publication / robustness | Evidence quality | Level |
|---|---|---|---|---|---|---|
| 8.1 | Halloween / "Sell in May" | Nov-Apr returns > May-Oct | Bouman and Jacobsen (AER 2002): 36 of 37 markets, 1970-98; UK back to 1694; Jacobsen and Zhang: 108 of 109 markets, winter-summer gap 4.52% (t = 9.69) [S76] | Critique: driven by outliers such as Oct 1987 and Aug 1998 (Maberly and Pierce 2004); weaker in Asia/FTSE recently (Schroders) [S76] | **Moderate** (unusually broad out-of-sample support, but small per-year edge, contested) | I |
| 8.2 | January effect | Small caps outperform in January (tax-loss selling reversal) | Haug and Hirschey find persistence in small caps [S78] | Others report a decline; "all but nonexistent except for the smallest" by the late 1990s; tax-advantaged accounts reduce the motive [S78] | **Weak-Moderate** (small caps only, costs high) | I |
| 8.3 | January barometer | January direction predicts the year | Hirsch, Stock Trader's Almanac [S78] | Accuracy advantage over "always predict up" is modest [S78] | **Folklore/Weak** | B (as myth-busting) |
| 8.4 | Santa Claus rally | Last 5 days of Dec + first 2 of Jan positive | Hirsch / Almanac [BK] | Not verified academically this session | **Weak** | B |
| 8.5 | Turn-of-the-month (TOTM) | Returns concentrated from the last day of the month to the first 3 days of the next | Ariel (1987); Lakonishok and Smidt (1988): Dow stronger from the last trading day through the next three [S77] | Mixed: an Erasmus study finds TOTM still present while other calendar effects vanished; a Fed working paper finds it disappeared in S&P futures/spot after 1990; cross-country persistence (19/20 countries); a link to month-end fund flows and payment cycles (Etula et al.) [S77] | **Moderate** (mechanism plausible: flows) | I |
| 8.6 | Day-of-week / Monday effect | Monday returns negative | French (1980): S&P 1953-77 Mondays significantly negative; Cross (1973); Gibbons and Hess (1981) [S79] | Widely believed to have weakened after the 1990s; recent econometric critique of French's method; no systematic post-2000 confirmation found [S79] | **Weak** (historical) | B/I |
| 8.7 | Pre-FOMC drift | S&P +49 bp in the 24 h before FOMC (1994-2011 sample); about 80% of annual excess returns | Lucca and Moench (NY Fed SR512 / JF 2015) [S63] | Treat as uncertain post-publication; not present in Treasuries/USD [S63] | **Moderate** (strong in-sample) | A |
| 8.8 | FOMC-cycle even weeks | Equity premium earned in weeks 0, 2, 4, 6 after FOMC | Cieslak, Morse and Vissing-Jorgensen (JF 2019), 1994-2016 [S64] | Mechanism: informal Fed communication; robustness after 2016 unverified | **Moderate** | E |
| 8.9 | Anomaly decay | Published anomalies shrink | McLean and Pontiff (97 predictors) [S77] | Core meta-lesson | **Strong** (as a meta-finding) | A |
| 8.10 | Pre-holiday effect | Days before holidays positive | Classic literature (e.g. Ariel 1990; Lakonishok and Smidt 1988) [BK] | Reported weakening, like other calendar effects (Erasmus study) [S77] | **Weak** | I |
| 8.11 | Earnings-season seasonality | Announcement-month premium; volatility clusters in reporting weeks | Earnings-announcement premium literature [BK]; PEAD timing (25-30% of drift near later announcements) [S60] | Moderate | **Moderate** | A |
| 8.12 | FX month-end / London 4pm fix flows | Rebalancing flows around month-end fix | Practitioner [BK] | Mechanism (hedge rebalancing) real, direction varies | **Weak-Moderate** | A |
| 8.13 | Options-expiration (OPEX) week, triple witching | Pinning and volatility around expiries | Practitioner [BK] | Changing with 0DTE growth | **Weak** | A |
| 8.14 | Presidential cycle (US) | Year 3 strongest | Almanac [BK] | Very few observations (about 20 cycles) | **Folklore/Weak** | B (myth-busting) |
| 8.15 | Commodity seasonality | Natural gas winter demand, gasoline driving season, grain planting/harvest | Physical supply/demand [BK] | Largely priced into the futures curve (seasonal spreads), so spot seasonality does not equal a futures profit | **Moderate** (mechanism) / **Weak** (as a trade) | I |
| 8.16 | Crypto weekly/intraday patterns | Weekend thin liquidity, session effects | Practitioner [BK] | Unstable | **Weak** | I |

Teaching note: in the simulator, seasonality should be *off by default*. Expose it only in "lab" mode, so learners do not learn fake patterns from synthetic data.

---

## 9. Suggested progressive ordering for the course

The guiding idea is to teach *risk mechanics of news before news strategies*, and *expectations vs surprise before any specific release*.

### Level 1: Beginner ("News is a volatility event")
| # | Module | Concepts | Key sim experience |
|---|---|---|---|
| B1 | What moves prices? | Expectations vs reality; priced in (1.3, 1.5) | "Predict the arrow" with simple surprises |
| B2 | Reading an economic calendar | 1.1, 1.6, 1.7, 1.10 | Calendar triage week; time-zone trap |
| B3 | What happens to spreads and stops at news time | 4.0, 1.2, 4.5, 4.11 (basic) | Liquidity HUD; stop slips; "cost of news" receipt |
| B4 | The big three US releases (read, don't trade) | 2.1 NFP, 2.2 CPI, 2.8 claims; 2.0 good-news-bad-news intro | Watch-only replays with commentary |
| B5 | Central banks 101 | 3.1, 3.2 (priced-in), 6.1 rates basics | Rate decision as expected → small move; surprise → big move |
| B6 | Company basics | 5.1, 5.2, 5.12 (dividends, splits) | Statement builder; split-value check |
| B7 | Myth-busting seasonality | 8.3, 8.4, 8.14 | Noise-generates-patterns demo |

### Level 2: Intermediate ("Trade the surprise, manage the risk")
| # | Module | Concepts | Key sim experience |
|---|---|---|---|
| I1 | Standardised surprise and revisions | 1.4, 1.5 (z-scores), 1.8 two-wave reactions | NFP with revisions; CPI headline vs core |
| I2 | Full release inventory | 2.3-2.11 | Nowcast chain CPI → PPI → PCE |
| I3 | News strategies I | 4.1 surprise, 4.4 second move, 4.6 rumour/news, 4.8 headlines | Policy comparison over 30 events with costs |
| I4 | Central-bank communication | 3.3-3.5, 3.7, 3.9 (reading FedWatch) | Statement diff + press-conference second move |
| I5 | Earnings season | 5.6, 5.7, 5.9, 5.11 | Earnings simulator; after-hours gap with stop |
| I6 | Valuation basics | 5.3, 5.4 | Rate-shock vs P/E ranking |
| I7 | Macro picture | 6.2-6.7, 6.10, 6.11 | Business-cycle classifier; sector allocation game |
| I8 | Sentiment toolkit | 7.0-7.4, 7.6, 7.7 | Synthetic COT, VIX, put/call, survey |
| I9 | Calendar effects with evidence | 8.1, 8.2, 8.5, 8.6, 8.10, 8.15 | Seasonality lab (detect injected vs noise) |
| I10 | Crypto fundamentals | 5.14, 7.8 | Token-unlock + liquidation-cascade scenario |

### Level 3: Advanced ("Regimes, correlations and tails")
| # | Module | Concepts | Key sim experience |
|---|---|---|---|
| A1 | Regime dependence | 2.0 deep dive, 6.3, 6.8, 6.9 | Same data, different regimes; correlation flip |
| A2 | Policy tools | 3.6 dots, 3.8 guidance, 3.10 QE/QT, 3.11 YCC, 3.12 intervention | Term-premium slider; capped-yield break |
| A3 | News strategies II | 4.2 fade, 4.3 straddles/IV crush, 4.7 pre-event drift, 4.12 market tells | Fade-or-follow classifier; straddle double-fill |
| A4 | Tail events | 4.9, 4.10, 3.14, 6.12 carry crash | Floor break; flash crash; weekend gap |
| A5 | Intrinsic valuation and drift | 5.5 DCF, 5.8 implied move, 5.10 PEAD, 5.12 buybacks/M&A | Reverse DCF; PEAD net of costs |
| A6 | Positioning | 7.5 | Short-squeeze agent scenario |
| A7 | Evidence discipline | 8.0, 8.7, 8.9, 8.11-8.13 | Anomaly decay after "publication" |

### Level 4: Expert ("Build and test your own event playbook")
| # | Module | Concepts | Key sim experience |
|---|---|---|---|
| E1 | Event-study methodology | ABDV standardised surprises, abnormal returns, multiple testing | Run event studies on the sim's history, estimate betas per release and regime |
| E2 | Cross-asset event playbooks | Combining rates, FX, equity, gold reactions; relative-value around events | Multi-asset event with hedged expression (e.g. long front-end yields vs short equities) |
| E3 | Central-bank modelling | Reaction-function estimation (3.1), FOMC-cycle (8.8), fiscal/term premium (6.14) | Predict the synthetic central bank from data |
| E4 | Execution under stress | Optimal order types, sizing for gap risk, broker-policy stress tests | Monte Carlo of gap risk on the learner's actual rules |
| E5 | Capstone | Full synthetic quarter: data calendar, CB meetings, earnings season, one unscheduled shock | Graded on risk-adjusted return, rule adherence, journal quality |

Prerequisite spine (minimum path): B1 → B2 → B3 → B4 → I1 → I3 → I4 → A1 → A3 → A4 → E1 → E5. Company, sentiment, seasonality and crypto modules can branch off after B3.

---

## 9A. Synthetic news-event engine (design appendix to Section 9)

These are design parameters, not empirical facts. Values marked "tunable" should be calibrated by the team.

1. **Event schema**: `id, name, region, asset_links[], impact_tier, scheduled_time (UTC + local), period_covered, consensus, forecast_min, forecast_max, previous, previous_revised, actual, components{headline, core, ...}, surprise_sigma (historical std of surprises), is_cancelled, is_double_release`.
2. **Standardised surprise**: `z = (actual - consensus) / surprise_sigma`. Effective surprise = weighted sum of component z's + revision z's. Weights depend on the current "market focus" regime (1.6, 2.0).
3. **Price impact**: `Δp_asset = β_asset,release,regime × z_eff × (1 + asym × 1[z_eff in "bad news" direction])`, with asym > 0 to reflect larger reactions to negative surprises [S62]. Add noise. Use a no-reaction band for |z| < 0.5 (tunable).
4. **Priced-in drift**: before the event, drift price toward `E[outcome]` according to a hidden "whisper" expectation that may differ from the published consensus (4.6, 5.6). On release, the surprise is measured against the whisper for the price impact, but the learner sees only the consensus (teaching "buy the rumour, sell the news").
5. **Two-wave reaction**: wave 1 (0-5 s) driven by the headline only; wave 2 (10 s-15 min) driven by details/revisions/press conference. P(reversal) rises when components conflict (1.8, 3.5).
6. **Liquidity model**: spread multiplier ramps from 1x at T-120 s to 5-20x at T-0 (tunable by tier). Depth falls 50-90%. Fill latency spikes; recovery half-life 30-120 s. Stops become market orders and fill at the first available price after the gap (4.0, 4.10).
7. **Gaps**: weekend/overnight and after-hours earnings gaps. Stops execute at the open price (5.9). Provide optional guaranteed stops at an extra cost to teach the trade-off.
8. **Unscheduled shocks**: Poisson arrivals (tunable λ) with heavy-tailed sizes. A rare "regime break" (floor removal, flash crash with partial recovery); negative-balance protection on/off (4.10).
9. **Central-bank module**: a hidden reaction function; synthetic fed-funds futures → implied probabilities via the FedWatch logic [S22]; statement text with a tone score; vote split; a dot plot of 19 dots; a press-conference headline stream; minutes 3 synthetic weeks later.
10. **Earnings module**: consensus EPS/revenue, whisper, implied move from a synthetic straddle, beat rate around 75-80% to mirror reality [S65], a guidance matrix (5.7), IV crush, an optional small PEAD with decay.
11. **Sentiment outputs**: weekly synthetic COT (Tuesday snapshot, Friday publish), VIX computed from the sim's option surface, daily put/call, a weekly survey generated from adaptive expectations (Section 7).
12. **Regime engine**: states such as {disinflation, inflation-fight, growth-scare, crisis, carry-calm}. Each state sets β tables, cross-asset correlations, safe-haven behaviour and event focus weights (2.0, 6.5, 6.9).
13. **Learning telemetry**: per event, log the learner's predicted direction/size, realised slippage, spread paid, whether they were flat or hedged, rule-checklist adherence. Use it for adaptive difficulty.

---

## 10. Sources (every URL used, with what it contributed)

### Official statistics and release descriptions
- **[S1]** BLS, Employment Situation Technical Note: https://www.bls.gov/news.release/empsit.tn.htm (also mirror https://blsmon1.bls.gov/news.release/empsit.tn.htm). CES vs CPS scope, sample size, two-month revisions, annual benchmark, reference week.
- **[S2]** BLS, Employment Situation FAQ: https://www.bls.gov/news.release/empsit.faq.htm. Survey differences, reference periods, revision policy, significance thresholds (about 122k CES, about 650k CPS), unemployment definition.
- **[S3]** IMPLAN blog on BLS revisions: https://implan.com/resources/blog/bls-jobs-data-revisions/. Secondary report of a more than 900k downward preliminary benchmark (Sept 2025). Also consulted: https://heritage.org/node/17611 and https://econbrowser.com/?p=8749 (benchmark context).
- **[S4]** BLS CPI release schedule: https://www.bls.gov/schedule/news_release/cpi.htm. 08:30 ET releases; Oct 2026 CPI on Nov 10, 2026; schedule subject to change.
- **[S5]** BLS CPI Questions and Answers: https://www.bls.gov/cpi/questions-and-answers.htm. Basket, about 80,000 prices, CPI-U vs CPI-W coverage, seasonal factors revised up to 5 years, non-revision of NSA CPI, core definition.
- **[S6]** BLS PPI "about" page: https://www.bls.gov/beta/nextgen/ppi/producer-price-index-about-2026-09-10.htm. Final demand vs intermediate demand, release timing, 4-month revision. Also a BLS TED note: https://www.bls.gov:443/opub/ted/2019/producer-price-index-for-final-demand-increased-2-point-5-percent-in-2018.htm.
- **[S7]** BEA Personal Income and Outlays: https://www.bea.gov/data/income-saving/personal-income. Contents of the release, Aug 2026 values (saving rate 4.1%), next release Oct 29, 2026.
- **[S8]** BEA, reliability of GDP estimates (Oct 2024): https://www.bea.gov/sites/default/files/2024-10/relia.pdf (2023 edition: https://www.bea.gov/system/files/2023-10/relia.pdf). Mean absolute revisions 0.5 pp / 0.7 pp; annual/comprehensive updates.
- **[S9]** BEA blog, Economic release schedule updates (Dec 10, 2025): https://bea.gov/news/blog/2025-12-10/economic-release-schedule-updates. Shutdown disruption, cancelled Q3 2025 advance GDP.
- **[S10]** BEA blogs on GDP revisions: https://bea.gov/news/blog/2015-07-13/why-does-bea-revise-gdp-estimates and https://www.bea.gov/news/blog/2014-07-22/measurement-us-economy-job-never-stops-heres-why-gdp-numbers-get-revised. Rationale for the estimate vintages.
- **[S11]** Trading Economics, Retail Sales Control Group: https://tradingeconomics.com/united-states/retail-sales-control-group. Control-group exclusions; recent readings.
- **[S12]** FXStreet calendar, Retail Sales Control Group: https://fxstreet.com/economic-calendar/event/a2a2843d-443a-480a-b83a-a8f0dd0c3f04. Broader exclusion definition.
- **[S13]** DataSetIQ, Retail sales data (Census MARTS): https://datasetiq.com/blog/retail-sales-data-census-bureau. Release timing about 2 weeks after month-end at 08:30 ET; nominal, SA; revisions.
- **[S14]** Trading Economics, ISM Manufacturing New Orders: https://www.tradingeconomics.com/united-states/ism-manufacturing-new-orders. ISM components, 50 threshold, prices paid reading.
- **[S15]** FXStreet ISM preview: https://www.fxstreet.com/news/us-ism-manufacturing-pmi-april-preview-gloom-persists-despite-expanding-us-economy-202305010700. Release time (14:00 GMT in summer) and market framing. Also https://reliableplant.com/Articles/Print/24329?id=24329 (older timing).
- **[S16]** US DOL, Unemployment Insurance Weekly Claims release (PDF): https://www.dol.gov/ui/data.pdf. Embargo 08:30 ET Thursday; initial claims, 4-week average, insured unemployment, revisions; Oct 15, 2026 release values.
- **[S17]** Calculated Risk weekly claims posts, e.g. https://www.calculatedriskblog.com/2025/12/weekly-initial-unemployment-claims_31.html?m=1. Release wording and context. Also TrendForce data page https://datatrack.trendforce.com/Chart/content/2369/united-states-four-week-moving-average-of-initial-claims-for-unemployment-insurance-sa.
- **[S18]** BLS JOLTS home: https://www.bls.gov/jlt/. Measures, Aug 2026 values, next release Nov 3, 2026, 10:00 ET.
- **[S19]** CME Group / Econoday JOLTS notes: https://www.cmegroup.com/education/events/econoday/691582 and https://www.cmegroup.com/education/events/econoday/636740. JOLTS lag vs NFP; Sept 2025 release merged into Oct. Also https://equalsmoney.com/economic-calendar/events/jolts-report (about 5-week lag) and https://www.newsquawk.com/headlines/us-jolts-job-openings-jul-7271m-vs-exp-73m-prev-7182m (quits example).

### Central banks and policy expectations
- **[S20]** Federal Reserve, FOMC meeting calendars, statements and minutes: https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm. 8 scheduled meetings; 2026 dates; SEP meetings; minutes 3 weeks after decision. Timing of statement/presser from https://eco3min.fr/en/fomc-meeting-calendar/ (third party).
- **[S21]** Bankrate dot-plot explainers: https://www.bankrate.com/banking/federal-reserve/how-to-read-fed-dot-plot-explained/ and https://www.bankrate.com/banking/federal-reserve/federal-reserve-dot-plot-explained-how-to-read-interest-rates. SEP/dot-plot structure, quarterly timing, longer-run dot, caveats on predictive power. Also https://www.moomoo.com/us/learn/the-fed-dot-plot-explained-what-it-says-about-us-interest-rates.
- **[S22]** CME, Understanding the FedWatch Tool methodology: https://www.cmegroup.com/articles/2023/understanding-the-cme-group-fedwatch-tool-methodology.html (content via search; direct fetch timed out). Probability-tree method, assumptions, formula. Also https://www.cmegroup.com/education/fed-funds-futures-probability-tree-calculator.html.
- **[S23]** CME, FedWatch aggregated enhancement: https://cmegroup.com/articles/2024/the-cme-fedwatch-tool-aggregated-enhancement-explained.html. Conditional vs aggregated probabilities.
- **[S24]** Babypips FedWatch explainer (Sept 2026): https://www.babypips.com/analysis/explainer-cme-fed-watch-tool-central-bank-commentary-2026-09-04. 100 - price arithmetic. Also third-party replications https://www.frenzycap.com/fedwatch and https://glama.ai/mcp/servers/@yoniassia/quantclaw-data/blob/344ed0fb2ae492f30a717bff38aaa32fbf45736a/modules/fed_funds_futures.py (day-weighting differences).
- **[S25]** Banco de España on the ECB Sept 2024 cut: https://www.bde.es/wbe/en/noticias-eventos/actualidad-bce/decisiones-politica-monetaria/el-bce-baja-los-tipos-25-puntos-basicos-en-septiembre.html. DFR as steering rate; 15 bp MRO-DFR spread.
- **[S26]** ECB Governing Council meeting calendar: https://www.ecb.europa.eu/press/calendars/mgcgc/html/index.en.html. 2026-2028 meeting and press-conference dates.
- **[S27]** ECB historic decision press release: https://www.ecb.europa.eu/press/pr/date/2000/html/pr001214.en.html; FXStreet 2019 DFR cut https://www.fxstreet.com/news/ecb-lowers-rate-on-deposit-facility-by-10-basis-points-to-050-as-expected-201909121151. Announcement format, negative-rate era context.
- **[S28]** Bank of England, upcoming MPC dates: https://www.bankofengland.co.uk/monetary-policy/upcoming-mpc-dates. 2026-27 dates, MPR months.
- **[S29]** J.P. Morgan AM on the May 2025 BoE split decision: https://am.jpmorgan.com/dk/en/asset-management/liq/insights/liquidity-insights/updates/navigating-uncertainty-the-bank-of-england-remains-cautious-after-a-split-mpc-decision/. Three-way vote split example.
- **[S30]** Bank of Japan, MPM schedule: https://www.boj.or.jp/en/mopo/mpmsche_minu/index.htm. 2026-27 meetings; Outlook Report months; Summary of Opinions and minutes timing (08:50).
- **[S31]** FXCM on BoJ ending negative rates and YCC: https://www.fxcm.com/za/insights/the-bank-of-japan-ended-the-negative-rates-era-scrapped-the-yield-curve-control/. March 2024 exit details.
- **[S32]** Reuters via Metrobank: https://wealthinsights.metrobank.com.ph/reuters/yen-down-with-jgb-yields-stocks-rally-after-landmark-boj-stimulus-exit. Yen weakened after the hike. Also https://bworldonline.com/uncategorized/2024/03/19/582748/bank-of-japan-ends-negative-rates-farewells-era-of-radical-policy/.
- **[S33]** nippon.com on the BoJ exit: https://nippon.com/en/japan-topics/g02387. Context (first hike in 17 years).
- **[S34]** FXStreet ecoflash, Sept 2014 Fed: https://www.fxstreet.com/analysis/ecoflash/2014/09/17. Unchanged guidance read as less hawkish than expected.
- **[S35]** Central Banking on NY Fed research (Femia, Friedman, Sack): https://www.centralbanking.com/central-banking/news/2305150/fed-breaks-with-other-central-banks-in-reaction-function-shift. 2011 calendar guidance as a dovish reaction-function shift.
- **[S36]** Saxo, Jan 2022 hawkish Fed: https://home.saxo/en-ch/content/articles/forex/fx-update-another-hawkish-broadside-from-the-fed-27012022. Press conference adding hike pricing.
- **[S37]** Mining.com "April Fools in March" (2016): https://www.mining.com/web/april-fools-march/. Regional Fed speakers reversing the statement's dovish reading.
- **[S38]** WisdomTree "Fed Monitor: Watch your language": https://www.wisdomtree.com/us/insights/blog/fed-monitor-watch-your-language. Fed communication framing (supplementary).
- **[S39]** Babypips Fed decision quiz (hawkish or dovish): https://www.babypips.com/quizzes/fed-decision-quiz-hawkish-or-dovish. Format model for tone-classification drills.
- **[S40]** Fundstrat note (June 2026), "The Warsh Doctrine": https://fundstrat.com/wp-content/uploads/2026/06/20260617-Digital-Asset-Strategy-The-Warsh-Doctrine-Less-Guidance-More-Market-And-What-This-Could-Mean-for-the-Coins.pdf. Single-source claim of reduced forward guidance (unverified).
- **[S41]** CFR, "The Fed is tightening more than it realizes": https://www.cfr.org/blog/fed-tightening-more-it-realizes. Term premium; QE about 85 bp; QT about 17 bp, about 68 bp hike-equivalent.
- **[S42]** Société Générale, "Fed and markets can both be right": https://www.societegenerale.com/en/news/economic-research/lagefi-fed-and-markets-can-both-be-right. QT works via the term premium.
- **[S43]** Generali Investments, Fed balance sheet focal point (Feb 2019): https://www.generali.com/doc/jcr:ee5b6644-2cdd-4af2-b199-ac0a1eff9548/FP_Fed_balance_sheet_Feb_2019.pdf/lang:it/FP_Fed_balance_sheet_Feb_2019.pdf. QE about 100 bp term premium; signalling share; QT asymmetry.
- **[S44]** Atlanta Fed macroblog, "Quantitative Frightening?" (2019): https://www.atlantafed.org/blogs/macroblog/2019/01/16/quantitative-frightening. QT market-stress debate.
- **[S45]** eco3min, QT market impact: https://eco3min.fr/en/qa/quantitative-tightening-market-impact/. Passive QT; balance sheet about $8.9tn to about $7tn (secondary). Also https://www.datasetiq.com/blog/quantitative-tightening-qt-data-tracking.

### Yield curve and macro
- **[S46]** St. Louis Fed, recession probability from yield spreads (2023): https://www.stlouisfed.org/on-the-economy/2023/sep/what-probability-recession-message-yield-spreads. Spread-based recession models.
- **[S47]** Ryan O'Connell, NY Fed model explainer: https://ryanoconnellfinance.com/probability-of-recession/. Estrella and Mishkin probit; false positives; formula (unofficial).
- **[S48]** Benzinga on the NY Fed probability above 70% (2023): https://drupal-cloudfront.benzinga.com/economics/macro-economic-events/23/06/32719092/us-economy-alarmed-new-york-fed-indicates-highest-likelihood-of-recession-in-over. Highest since 1982.

### Sentiment and positioning
- **[S49]** CFTC COT Explanatory Notes: https://www.cftc.gov/MarketReports/CommitmentsofTraders/ExplanatoryNotes/index.htm; COT report descriptions: https://www.cftc.gov/node/128971. Categories, reporting levels, 70-90% OI coverage, classification caveats.
- **[S50]** COT explainers: StoneX https://futures.stonex.com/blog/how-to-read-the-commitment-of-traders-report; OpenBB https://docs.openbb.co/platform/user_guides/commitments_of_traders; Barchart https://www.barchart.com/futures/commitment-of-traders; SuperMoney https://www.supermoney.com/encyclopedia/commitments-of-traders-reports; WallStreetMojo https://www.wallstreetmojo.com/commitments-of-traders-report/. Tuesday data / Friday 15:30 ET release; legacy/disaggregated/TFF categories.
- **[S51]** Cboe VIX methodology documents: https://cdn.cboe.com/resources/indices/Volatility_Index_Methodology_Cboe_Volatility_Index.pdf and https://cdn.cboe.com/resources/vix/VIX_Methodology.pdf; VIX white paper copy https://www.asx.com.au/content/dam/asx/investors/investment-options/vix/cboe-vix-white-paper.pdf. History (1993/2003), 23-37 DTE options, 15-second snapshots.
- **[S52]** Macroption VIX calculation: https://macroption.com/vix-calculation/. Model-free variance approach (secondary).
- **[S53]** Cboe daily market statistics: https://www.cboe.com/us/options/market_statistics/daily/. Published put/call ratio types and example values.
- **[S54]** Financer, put/call ratios guide: https://financer.com/invest/put-call-ratios/. Long-run averages and extreme thresholds (secondary); smoothing advice. Also LuxAlgo https://www.luxalgo.com/blog/putcall-ratio-key-options-sentiment/.
- **[S55]** Interactive Brokers, Understanding put/call ratios: https://www.interactivebrokers.com/campus/traders-insight/understanding-put-call-ratios/. Cboe-only data distortion from daily expirations.
- **[S56]** SentimenTrader total put/call page: https://sentimentrader.com/indicators/total-put-call-ratio. Supplementary readings.
- **[S57]** AAII Sentiment Survey: https://www.aaii.com/sentimentsurvey. Methodology, averages, Oct 14, 2026 reading.
- **[S58]** AAII Journal, "Is the AAII Sentiment Survey a contrarian indicator?": https://www.aaii.com/journal/article/is-the-aaii-sentiment-survey-a-contrarian-indicator. Pendulum behaviour; 70.3% bearish record (Mar 5, 2009); long-run averages and standard deviations.
- **[S59]** Financer AAII guide: https://financer.com/invest/aaii-sentiment/. Secondary claims about ±2 standard-deviation extremes and the bullish < 20% rule (unverified). Also https://www.wealthmanagement.com/investment-news/bullish-sentiment-as-contrarian-indicator-explained.

### Academic evidence on announcements, earnings and anomalies
- **[S60]** Wikipedia, Post-earnings-announcement drift: https://en.wikipedia.org/wiki/Post%E2%80%93earnings-announcement_drift. Ball and Brown 1968; Bernard and Thomas 1989/1990; magnitudes; explanations; decline; small-cap concentration.
- **[S61]** "PEAD declined over time" (Columbia CEASA / UT Austin): https://business.columbia.edu/sites/default/files-efs/imce-uploads/CEASA/Events%20Page/PEAD_Declined_over_time.pdf. Declining SUE persistence explanation. Also https://quantpedia.com/strategy-tags/earnings-announcement/.
- **[S62]** Andersen, Bollerslev, Diebold and Vega (2003), "Micro Effects of Macro Announcements", AER 93(1): NBER w8959 https://www.nber.org/system/files/working_papers/w8959/w8959.pdf; SSRN https://papers.ssrn.com/abstract=313660; Duke https://scholars.duke.edu/publication/712364. Surprises cause conditional-mean jumps in FX; timing effects; sign asymmetry (bad news bigger).
- **[S63]** Lucca and Moench, "The Pre-FOMC Announcement Drift", NY Fed SR512: https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr512.html; VoxEU summary https://cepr.org/voxeu/columns/predictable-movements-asset-prices-around-fomc-meetings. +49 bp in 24 h pre-FOMC; about 80% of excess returns; Sharpe above 1.1; no effect in bonds/USD; low pre-announcement volume/volatility.
- **[S64]** Cieslak, Morse and Vissing-Jorgensen, "Stock Returns over the FOMC Cycle" (JF 2019): https://papers.ssrn.com/abstract=2687614; https://stern.nyu.edu/sites/default/files/assets/documents/cycle_paper_cieslak_morse_vissingjorgensen.pdf; CFA digest https://rpc.cfainstitute.org/research/cfa-digest/2020/05/dig-v50-n5-2. Even-week equity premium; informal communication channel.
- **[S65]** First Trust, S&P 500 earnings beat-rate snapshots: https://www.ftportfolios.com/Commentary/MarketCommentary/2026/9/1/snapshot-of-the-sp-500-index-earnings-beat-rate; https://www.ftportfolios.com/blogs/MarketBlog/2026/5/12/a-snapshot-of-the-sp-500-index-earnings-beat-rate; https://www.ftportfolios.com/blogs/MarketBlog/2024/3/5/a-snapshot-of-the-sp-500-earnings-beat-rate. FactSet-based beat rates (86% Q2 2026; 5-yr avg 78%; 10-yr avg 75%). Also https://benzinga.com/analyst-stock-ratings/analyst-color/25/06/45758803/sp-500-q1-earnings-stun-again-the-street-with-broad-based-beats-double-digit-growth.

### News trading practice and case studies
- **[S66]** Babypips news-trading lessons and forum (lessons blocked direct fetch; content via search): https://www.babypips.com/learn/forex/directional-bias-vs-non-directional-bias, https://www.babypips.com/learn/forex/letting-the-market-decide-which-direction-to-take, https://www.babypips.com/learn/forex/summary-of-trading-the-news, forum https://forums.babypips.com/t/straddle-trade-strategy/146268 and https://forums.babypips.com/t/news-trading-choosing-a-broker/35798. Directional vs non-directional bias; straddles; fills not guaranteed; spread widening (anecdotal).
- **[S67]** "Buy the rumour, sell the news": Forex.com https://forex.com/en/news-and-analysis/buy-the-rumour-sell-the-news-meaning; CMC Markets https://www.cmcmarkets.com/en-gb/trading-strategy/buy-the-rumor-sell-the-news; City Index https://cityindex.com/en-uk/news-and-analysis/buy-the-rumour-sell-the-news-meaning/?amp=true. Definition, priced-in logic, earnings and CB examples.
- **[S68]** SNB floor removal (Jan 15, 2015): Finance Magnates FxPro CEO interview https://www.financemagnates.com/executives/interview/fxpros-ceo-talks-leverage-decentralization-agency-model-prospects-post-snb/; FXCM timeline https://www.financemagnates.com/forex/brokers/fxcm-publishes-data-of-snb-mishandling-of-the-swiss-franc/; Euromoney https://www.euromoney.com/article/b12kp9wj6t6bq6/fx-brexit-volatility-triggers-warnings-on-stop-loss-orders; Money.it on Alpari UK https://www.money.it/Alpari-forex-broker-in-fallimento; ForexLive wrap https://www.forexlive.com/news/!/forexlive-americas-wrap-swiss-shocker-20150115; EarnForex history https://www.earnforex.com/guides/history-of-2015-eurchf-floor-failure/. Timeline, liquidity vacuum, stop slippage, broker insolvency.
- **[S69]** SEC-CFTC joint staff report on May 6, 2010: https://SEC.GOV/files/marketevents-report.pdf; CNN summary https://money.cnn.com/2010/10/01/markets/SEC_CFTC_flash_crash/index.htm; WatersTechnology https://www.waterstechnology.com/node/1740190; Econbrowser https://econbrowser.com/archives/2010/10/causes_of_the_f. 75,000 E-mini sell algorithm at 9% of volume; liquidity evaporation; Dow nearly -1,000 points.
- **[S70]** Forex Factory calendar guides (secondary; Forex Factory's own help page blocked fetch): https://postecards.poste.it/bold-stats/mastering-forex-factory-a-traders-guide-1767646717; https://newyorkcityservers.com/blog/how-to-use-forex-economic-calendar; https://apify.com/xtracto/forexfactory-calendar. Impact colours; actual/forecast/previous; revision field.

### Intermarket, correlations, cycle
- **[S71]** Murphy intermarket summaries: StockCharts https://articles.stockcharts.com/article/articles-chartwatchers-2011-04-intermarket-picture-points-to-change-in-market-directions/; LuxAlgo https://www.luxalgo.com/library/concept/intermarket-analysis/; Wiley book page https://wiley-vch.de/en/areas-interest/finance-economics-law/intermarket-technical-analysis-978-0-471-52433-5. Normal relationships, turning-point sequence, regime dependence, copper/gold.
- **[S72]** Stock-bond correlation: Alpha Architect https://alphaarchitect.com/stock-bond-correlation/; Morningstar https://www.morningstar.com/portfolios/what-higher-inflation-means-stock-bond-correlations and https://morningstar.co.uk/uk/news/249276/what-higher-inflation-means-for-stock-and-bond-correlations.aspx; Evidence Investor (Swedroe) https://www.evidenceinvestor.com/?p=21662; Markov-switching paper https://raw.githack.com/lusiki/The-Breakdown-of-the-Classic-Portfolio-Hedge-A-Comprehensive-Markov-Switching-Analysis/main/paper/main_analysis.html; William Blair https://www.williamblair.com/-/media/downloads/pwm/2026/williamblair_economics-weekly-20260417.pdf. Baele and Van Holle regime figures; 2022 double-digit losses in both; 0.58 correlation; regime-switching evidence.
- **[S73]** Dollar/yen smile and carry: Wellington https://www.wellington.com/en-sg/individual/insights/the-yen-smile-new-economic-era; investingLive (Aug 7, 2024) https://investinglive.com/news/the-dollar-needs-the-economy-to-work-for-it-20240807. Dollar smile definition; Aug 2024 carry unwind; yen safe-haven status.
- **[S74]** Sector rotation: Fidelity handbook https://www.fidelity.com/products/pdf/a-tactical-handbook-of-sector-rotations.pdf; Fidelity learning center https://fidelity.com/learning-center/trading-investing/markets-sectors/intro-sector-rotation-strats; Massey University paper https://mro.massey.ac.nz/bitstreams/1f32a859-5ef9-442d-a5f8-ac8e0f5b1a83/download; NerdWallet https://www.nerdwallet.com/investing/learn/sector-rotation; eco3min https://eco3min.fr/en/qa/sector-rotation-across-cycles/; Wikipedia https://en.wikipedia.org/wiki/Sector_rotation. Phase-sector mappings; cycle lengths; critique net of costs.
- **[S75]** Gold vs real yields: eco3min empirical read https://eco3min.fr/en/gold-vs-real-yields-tips-inverse-correlation-history/; University of Malta study https://www.um.edu.mt/library/oar/handle/123456789/140667; HeyGoTrade https://www.heygotrade.com/en/blog/real-yields-gold-2026-macro-trade-setup/; AhaSignals tracker https://ahasignals.com/gold-real-yield-divergence-tracker/. Historical inverse correlation, 2022-24 break, central-bank buying.

### Seasonality
- **[S76]** Halloween indicator: Bouman and Jacobsen working paper https://www.tias.edu/docs/default-source/Kennisartikelen/ssrn-id76248.pdf?sfvrsn=2; Jacobsen and Zhang https://www.bnains.org/backtest/periode/The_Halloween_Indicator_everywhere_and_all_the_time_-_Ben_Jacobsen_%26_Cherry_Y._Zhang.pdf; Schroders Asia note https://www.schroders.com/bg-bg/bg/profesionalisti-investitori/analizi/sell-in-may-and-go-away-does-it-work-for-asian-stockmarkets/; Journalist's Resource https://journalistsresource.org/?p=60987. 36/37 markets, 108/109 markets, 4.52% gap, critiques.
- **[S77]** Turn-of-the-month and anomaly decay: CXO Advisory https://www.cxoadvisory.com/calendar-effects/turn-of-the-month-effect-persistence-and-robustness; Erasmus repository https://repub.eur.nl/pub/76280; Fed working paper https://fedinprint.org/item/fedawp/13394/original; Quantpedia https://quantpedia.com/an-examination-of-the-turn-of-the-month-effect/; Validea https://blog.validea.com/turn-month-effect-persists-stock-price-movements; publication-bias paper (McLean and Pontiff summary) https://arxiv.org/pdf/2209.13623. Mixed TOTM persistence; flows mechanism; 26% decay figure.
- **[S78]** January effect / barometer: FPA "The January Effect Revisited" https://www.financialplanningassociation.org/sites/default/files/2021-08/APR04%20Investment%20Research%20The%20January%20Effect%20Revisited.pdf; Haug and Hirschey (FAJ 2006) https://ideas.repec.org/a/taf/ufajxx/v62y2006i5p78-88.html; Quantpedia https://quantpedia.com/Screener/Details/114; HumbleDollar https://humbledollar.com/2023/02/january-junkie/; LuxAlgo https://www.luxalgo.com/library/concept/january-effect/. Persistence vs decline; tax-loss mechanism; barometer weakness.
- **[S79]** Day-of-week effect: Erasmus bachelor thesis https://thesis.eur.nl/pub/62247/Bachelor-thesis-Lars-Otten-488790.pdf; LuxAlgo https://www.luxalgo.com/library/concept/day-of-week-effects.md; EBSCO abstract of the critique of French's method https://www.ebsco.com/articles/business-and-management/9bdb58e8-ab65-5479-84e8-310c1ebd2c96/drastic-econometric-failures-and-theoretical-pitfalls-in-french-s-method-of-day-of-the-week-anomaly-detection; Edinburgh repository https://era.ed.ac.uk/bitstreams/bbda7f15-25e0-43d4-91f6-162e14acde23/download. French 1980 findings; precursors; weakening and critique.

### Company fundamentals and corporate actions
- **[S80]** CFA Institute, "Market-Based Valuation: Price and Enterprise Value Multiples": https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2024/market-based-valuation-price-enterprise-value-multiples (2025/2026 versions also listed); CXO Advisory survey summary https://cxoadvisory.com/fundamental-valuation/professional-equity-valuation-methods; AnalystPrep CFA L2 notes https://analystprep.com/study-notes/cfa-level-2/study-notes-for-cfa-level-ii-equity-valuation-offered-by-analystprep/. Price vs EV multiples; practitioner survey (about 93% multiples, EV/EBITDA most common); model categories.
- **[S81]** Linking the three statements: Wall Street Prep https://www.wallstreetprep.com/knowledge/how-are-the-three-financial-statements-linked/; CFI https://corporatefinanceinstitute.com/resources/knowledge/accounting/three-financial-statements/; William & Mary https://online.mason.wm.edu/blog/how-are-the-three-financial-statements-linked. Net income → retained earnings and CFO; working capital; D&A; capex.
- **[S82]** Earnings guidance and reactions: BIT knowledge hub https://www.bit.com/knowledge-hub/earnings-reports; StockAlarm https://pro.stockalarm.io/blog/earnings-guidance-vs-results; Bespoke https://www.bespokepremium.com/premium-logged-in/page/833/; Moomoo https://www.moomoo.com/us/learn/options-earnings-series-1-what-s-behind-the-rise-and-fall-of-stock-prices-after-earnings. Beat/raise matrix; Q1 2021 example; sell-the-news after run-ups.
- **[S83]** Implied move and IV crush: ORATS https://blog.orats.com/the-wildest-earnings-week-on-record; Option Alpha https://optionalpha.com/learn/iv-crush; OptionStrat https://optionstrat.com/blog/expected-moves-vol-crush; Quantcha https://quantcha.com/news/an-analysis-of-trading-earnings-releases-using-options/; SpotGamma https://spotgamma.com/how-to-trade-iv-crush-earnings/; Paragon Signals https://buttondown.com/Paragon-Signals/archive/that-expected-move-isnt-a-forecast/. ATM straddle as expected move; about 85% actual/implied; IV crush; short-straddle tail risk.
- **[S84]** Investor.gov ex-dividend dates: https://www.investor.gov/introduction-investing/investing-basics/glossary/ex-dividend-dates; SEC Fast Answers https://www.sec.gov/fast-answers/answers-dividenhtm.html. Record vs ex-date under T+1; special-dividend rule.
- **[S85]** Wikipedia, Stock split https://en.wikipedia.org/wiki/Stock_split and Share repurchase https://en.wikipedia.org/wiki/Share_repurchase. Split mechanics and contested signalling; buyback methods, EPS effect, signalling, modest non-reversing announcement effect, criticisms.
- **[S86]** FINRA, Extended-hours trading: https://www.finra.org/investors/insights/extended-hours-trading. Liquidity, volatility, no NBBO, inferior prices, opening gaps, limit-only restrictions, no options.

---

## 11. Research limitations and open items

- The shared web-search budget was exhausted after 40 searches. Items tagged `[BK]` were not re-verified this session. The most important ones to verify before publishing figures to learners:
  - Exact ISM release rules (first/third business day, 10:00 ET).
  - ECB 14:15/14:45 CET and BoE 12:00 timings.
  - Womack (1996) and other analyst-recommendation evidence.
  - Ikenberry, Lakonishok and Vermaelen (1995) buyback drift.
  - McLean and Pontiff's post-publication decay of about 58%.
  - Crypto on-chain metrics and token-unlock studies.
  - Santa Claus rally, presidential cycle and pre-holiday statistics.
  - Typical point/pip moves per release (deliberately not quantified here).
- Blocked or failed fetches: Babypips lesson pages (403), Forex Factory help (403), Investor.gov stock-split page (403), ISM site (login redirect), Census retail page (500), CME FedWatch methodology page (timeout; content obtained via search snippet).
- Real-world numbers (2026 readings, calendars) are examples for realistic synthetic parameterisation, not live data. The simulator should never present them as current market data.
- Any real-world case study shown to learners (SNB 2015, Flash Crash 2010, BoJ 2024, Aug 2024 carry unwind) should be labelled historical. Synthetic replays should be clearly marked as synthetic.

