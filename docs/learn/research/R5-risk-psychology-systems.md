# R5: Risk & money management, trade management, psychology, planning/journaling, backtesting & statistics: content inventory

> Research deliverable for a progressive trading course (Beginner → Expert) inside an interactive education app with a simulator (synthetic markets, virtual money). Philosophy: decisions are scored on **process** (Decision Quality, Risk Discipline), never on profit.
>
> Compiled 2026-10-22. About 51 web searches plus several direct fetches/PDF reads (sources in §11). The shared web-search budget ran out before the last few planned lookups (purged cross-validation, Sharpe 1966/1994, Ulcer index, chandelier exit, Gollwitzer, Gawande), so those items come from background knowledge and are marked **[BK]**. Everything else is tied to a source number **[S#]** in §11.

## How to read this file

Every concept uses the same card:

- **Def.** one-line definition
- **Formula / example**, where applicable, with a small worked example (numbers checked with a script)
- **Why** it matters
- **Mistakes**: common errors
- **Level**: B = Beginner, I = Intermediate, A = Advanced, E = Expert. **Prereq**: concept IDs
- **Sim**: how to practise it in a simulator or calculator widget (what the learner manipulates, what is shown). **Score hook** = the process metric the app can grade (Decision Quality = DQ, Risk Discipline = RD)

The **reference system** used across examples is a synthetic strategy with win rate 40%, average win +2.5R and average loss −1R, so expectancy is +0.4R, profit factor 1.67 and the standard deviation of R is about 1.71. Several sections reuse it so learners see one system from many angles.

Concept IDs: `RF` risk fundamentals · `PR` portfolio risk · `TM` trade management · `PM` performance metrics · `PSY` psychology · `PL` plan/journal/review · `BT` backtesting/system design · `ST` statistics · `RR` retail reality.

---

## 1. Risk fundamentals

### RF-01 Risk capital
- **Def.** Money you can lose entirely without affecting living costs, debt service or emergency savings. It is the only money that belongs in a trading account.
- **Formula / example.** Risk capital = liquid net worth − emergency fund (e.g. 6 months of expenses) − near-term obligations. With €20,000 savings, a €12,000 emergency fund and €5,000 earmarked for tuition, risk capital is about €3,000.
- **Why.** Regulators attribute retail losses largely to excess leverage and products clients do not understand [S24][S26]. Trading money you need creates the "scared money" that distorts every later decision.
- **Mistakes.** Funding with credit; "topping up" after losses; treating a prop-firm challenge fee as not risk capital.
- **Level** B · **Prereq** none.
- **Sim.** Onboarding wizard: learner enters a fictional budget profile and the app computes the risk-capital ceiling. The simulated account is then funded with that amount only. **Score hook** (RD): attempts to "deposit more" after a drawdown are logged.

### RF-02 Risk per trade (% of equity)
- **Def.** The fraction of current account equity you accept to lose if the trade hits its initial stop.
- **Formula / example.** $Risk = Equity × r. With $10,000 and r = 1%, $Risk = $100. Typical retail guidance is 0.5–2% (Elder's "2% rule" is a ceiling, not a target [S71][S72]).
- **Why.** It is the main lever for survival. After 10 straight losses equity is 0.99^10 = 90.4% at 1% risk, 0.95^10 = 59.9% at 5%, and 0.90^10 = 34.9% at 10%.
- **Mistakes.** Measuring risk as position value instead of distance to stop; varying r with "conviction"; computing r on starting balance after a big drawdown (silently raising true risk).
- **Level** B · **Prereq** RF-01.
- **Sim.** Slider for r (0.25–10%) plus a "streak machine" that plays N consecutive losses and shows the equity curve and recovery needed. **Score hook** (RD): realised risk ÷ planned risk per trade, with a tolerance band (e.g. ±10%).

### RF-03 R, the initial risk unit (Van Tharp)
- **Def.** R is the money lost if the initial stop is hit. It is the unit all results are measured in [S1][S2].
- **Formula / example.** 1R = |Entry − Stop| × Units × PointValue (+ expected costs). Buy 50 shares at $50.00 with a stop at $48.00: 1R = $2 × 50 = $100.
- **Why.** It normalises results across instruments, sizes and accounts, so the course can score decisions in R rather than money (consistent with process-over-profit).
- **Mistakes.** Redefining R after entry (moving the stop changes R; always keep the *initial* R); ignoring costs and slippage; trades without a stop have undefined R, which is itself a rule violation.
- **Level** B · **Prereq** RF-02.
- **Sim.** Drag entry and stop lines on a chart and a live label shows R in money and as % of equity. **Score hook** (RD): every order must have a defined R before submission. A missing stop is flagged.

### RF-04 R-multiple
- **Def.** Trade outcome divided by initial risk [S1][S2].
- **Formula / example.** R-multiple = P&L ÷ 1R. Using RF-03 (1R = $100): exit at $54 gives +$200 = **+2R**. A gap through the stop to $47.50 gives −$125 = **−1.25R**, which shows slippage beyond the stop.
- **Why.** A list of R-multiples is the raw material for expectancy, SQN, Monte Carlo and position-sizing research. Tharp's drawdown studies are expressed entirely in R [S3].
- **Mistakes.** Averaging R-multiples from trades that used different stop logic without noting it (forum critics call naive averaging "nonsense" outside education [S123]); reporting only winners' R.
- **Level** B · **Prereq** RF-03.
- **Sim.** After each simulated trade the journal auto-computes the R-multiple. An "R histogram" panel builds up over time.

### RF-05 Reward-to-risk (planned) and breakeven win rate
- **Def.** Planned target distance ÷ stop distance, and the win rate needed to break even at that ratio.
- **Formula / example.** Breakeven win rate = 1 ÷ (1 + RR) [S14][S15]. RR 1:1 needs 50%, 2:1 needs 33.3%, 3:1 needs 25%.
- **Why.** It shows that win rate alone means nothing: a 70% win rate can lose money if losers are large [S103][S104].
- **Mistakes.** Choosing far targets to "improve RR" without accounting for the lower probability of reaching them; confusing planned RR with realised payoff (PM-02); ignoring costs (which raise the breakeven rate).
- **Level** B · **Prereq** RF-04.
- **Sim.** Two linked sliders (win rate, RR) with a heat-map of expectancy and a breakeven curve; the learner's own journal point is plotted on it.

### RF-06 Stop placement logic
- **Def.** The stop goes where the trade idea is **invalidated** (structure), or outside normal noise (volatility). It is never placed to fit a money amount.
- **Formula / example.** Volatility stop: Stop = Entry − k × ATR. Entry 100, ATR(14) = 2.0, k = 2 gives a stop at 96 (risk 4/share). Structure stop: just beyond the swing low that would negate the setup, plus a buffer (e.g. 0.25 × ATR). MAE-based stop: see TM-16.
- **Why.** Stop distance defines R and therefore position size (RF-07). A stop inside normal noise turns valid ideas into losses.
- **Mistakes.** Fitting the stop to the money you want to risk ("I can only lose $50, so the stop is 5 pips"); stops at obvious round numbers; mental stops not entered; widening the stop after entry; a too-tight stop on a high-leverage product.
- **Level** B → I · **Prereq** RF-03, ST-03 (volatility).
- **Sim.** "Noise test" drill: the learner places a stop, then the app replays the next 50 synthetic paths from that point and shows what % hit the stop before the target. Learners compare structure, ATR and arbitrary stops. **Score hook** (DQ): stop justified by a selected rationale tag (structure / ATR / MAE).

### RF-07 Position size, percent-risk formula
- **Def.** The number of units such that hitting the stop loses exactly the chosen $Risk.
- **Formula / example.** Units = (Equity × r) ÷ (|Entry − Stop| × PointValue).
  - Stocks: $25,000 × 1% = $250; entry $40.00, stop $38.50 (risk $1.50/share) gives **166 shares** (round down). Position value is $6,640 (26.6% of equity) while risk is only 1%.
  - FX: $10,000 × 1% = $100; EURUSD entry 1.0850, stop 1.0820 = 30 pips; a standard lot (100,000) is about $10/pip, so per-lot risk is $300 and size is 100/300 = **0.33 lots**. Notional is about $35.8k (effective leverage ≈ 3.6:1).
- **Why.** It separates "where is my stop?" (analysis) from "how much do I trade?" (risk). Wide stops automatically get smaller size.
- **Mistakes.** Rounding up; forgetting pip value differs by quote currency; ignoring contract multipliers; confusing lots with risk.
- **Level** B · **Prereq** RF-02, RF-03, RF-06.
- **Sim.** Position-size calculator built into the order ticket: the learner sets entry/stop and r, and the ticket proposes size. A "manual mode" makes the learner compute it first and then shows the error. **Score hook** (RD): |actual size − correct size| ÷ correct size.

### RF-08 Position-sizing models overview (Tharp's taxonomy)
- **Def.** Position sizing (Tharp's term for money management) is the rule set that answers "how much" across a series of trades. Tharp's core models are units per fixed amount, percent margin, percent risk and percent volatility [S106].
- **Why.** Tharp argues sizing is how a system meets its objectives. In one cited Tharp comparison on one system (595 trades), percent risk returned about 21%/yr and percent volatility about 23%/yr (forum report, unverified) [S106].
- **Mistakes.** Choosing a model by backtest return alone; mixing models without noting it.
- **Level** I · **Prereq** RF-07.
- **Sim.** "Same trades, different sizing": one fixed R-multiple sequence is replayed under each model below (RF-09…RF-16), with final equity, max DD and a risk-of-ruin estimate side by side.

### RF-09 Fixed units (fixed lots/contracts/shares) and units per fixed amount
- **Def.** Trade the same quantity every time (e.g. 1 lot), or 1 unit per $X of equity (Tharp's "units per fixed amount" [S106]).
- **Formula / example.** Fixed: always 1 lot. With a 20-pip stop R = $200; with a 60-pip stop R = $600, so **risk varies 3×** with stop distance. Units per fixed amount: 1 contract per $25,000, so a $60,000 account trades 2 contracts.
- **Why.** Simple and good for the first lessons (reading P&L), but it hides risk variability.
- **Mistakes.** Treating fixed lots as "constant risk"; risk % rises as the account shrinks.
- **Level** B · **Prereq** RF-03.
- **Sim.** Fixed-lot mode with an overlay showing each trade's risk as % of equity; learners see the dispersion.

### RF-10 Fixed fractional (percent risk) and fixed dollar risk
- **Def.** Risk a constant fraction r of *current* equity per trade (or a constant dollar amount for fixed-dollar).
- **Formula / example.** Size per RF-07. It is anti-martingale: size shrinks after losses and grows after wins. Ruin to zero is mathematically impossible with continuous sizing, so "ruin" must be defined as a drawdown threshold. Consecutive losses to reach −50%: ln(0.5)/ln(1−r), which is about 69 losses at r = 1%, 34 at 2%, 13.5 at 5% and 6.6 at 10%.
- **Why.** It is the industry default for discretionary traders and the right default for this course.
- **Mistakes.** Recomputing on peak equity (over-risking in drawdown); rounding small accounts to minimum lots that exceed r (the micro-lot problem); "conviction scaling" without rules.
- **Level** B · **Prereq** RF-07.
- **Sim.** Monte Carlo panel on the reference system (computed for this file, 20,000 paths × 100 trades):

| r per trade | median max DD | 95th pct max DD | median terminal wealth | 5th pct terminal |
|---|---|---|---|---|
| 0.5% | 4.2% | 7.5% | 1.22× | 1.06× |
| 1% | 8.3% | 14.8% | 1.47× | 1.11× |
| 2% | 16.2% | 27.9% | 2.09× | 1.21× |
| 4% | 30.7% | 49.3% | 3.91× | 1.32× |
| 8% (≈ ½ Kelly) | 53.0% | 76.6% | 9.87× | 1.18× |
| 16% (full Kelly) | 82.7% | 96.5% | 20.0× | 0.34× |
| 32% (2× Kelly) | 99.3% | 100% | 1.45× | 0.00× |

  The learner moves r and watches drawdown explode long before median growth peaks.

### RF-11 Fixed ratio (Ryan Jones)
- **Def.** Contract count increases by profit thresholds, not equity percentage. Going from N to N+1 contracts requires an additional N × Δ (delta) of profit [S12][S13].
- **Formula / example.** Cumulative profit to reach N contracts is Δ·N(N−1)/2, so Contracts = ½ × (1 + √(1 + 8P/Δ)). With Δ = $3,000: 2 contracts at $3,000 profit, 3 at $9,000, 4 at $18,000. At P = $10,000, the formula gives 3.13, so 3 contracts.
- **Why.** It is designed for futures traders with small accounts who cannot fraction contracts; it grows size more slowly as size increases.
- **Mistakes.** Choosing Δ without drawdown analysis (practice ties Δ to the max historical DD per contract [S13]); claiming it is "optimal"; there is no formula for the best Δ.
- **Level** A · **Prereq** RF-10.
- **Sim.** Staircase chart of contracts vs cumulative profit for several Δ values, overlaid on a simulated equity curve.

### RF-12 Percent volatility / ATR-based sizing (Tharp, Turtles)
- **Def.** Size so that one unit of volatility (ATR) equals a fixed % of equity [S105][S106][S107].
- **Formula / example.** Units = (Equity × v) ÷ (ATR × PointValue). Turtle "N" is a 20-day smoothed true range, and 1 unit = 1% of equity ÷ (N × $/point) [S105]. Example: $100,000, N = 2.5 points, $50/point gives 1,000 ÷ 125 = **8 contracts**. Stock example: $50,000, v = 0.5%, ATR = $1.20 gives 208 shares; with a 2×ATR stop that is about 1% risk.
- **Why.** It equalises risk contribution across instruments with different volatility and adapts automatically to volatility regimes.
- **Mistakes.** When volatility jumps faster than the ATR look-back, realised loss exceeds the risk budget [S107]; ignoring correlation across "equal-risk" units; confusing ATR in points with ATR in money.
- **Level** I · **Prereq** RF-07, ST-03.
- **Sim.** A two-instrument sandbox (calm vs volatile synthetic asset): the learner sizes both and the app shows each one's daily $ volatility contribution. The fixed-lot version is shown for contrast.

### RF-13 Kelly criterion and fractional Kelly
- **Def.** The bet fraction that maximises the long-run geometric growth rate of capital (Kelly 1956, Bell System Technical Journal; popularised for markets by Thorp) [S10][S11].
- **Formula / example.** Binary bets: f* = W − (1−W)/b, where b = avg win / avg loss [S8][S14]. Growth per bet: g(f) = W·ln(1+f·b) + (1−W)·ln(1−f). Continuous approximation for leverage: f* ≈ μ/σ² [S9].
  - With W = 0.55, b = 1.5: f* = 0.55 − 0.45/1.5 = **0.25**. Computed g: f = 0.125 (½ Kelly) gives 0.0344, which is **75% of the full-Kelly growth** (0.0457). f = 0.5 (2× Kelly) gives **−0.004**, i.e. negative growth despite a positive edge.
  - Reference system: f* = 0.40 − 0.60/2.5 = 16%. See the RF-10 table for its drawdowns.
  - Continuous: excess return 8%/yr and vol 20% give f* = 0.08/0.04 = 2× leverage.
- **Why.** It shows that over-betting destroys growth and that sizing is a maths problem, not a feelings problem. It is the theoretical ceiling for any sizing rule.
- **Mistakes.** Plugging in-sample (overestimated) edge into the formula [S8]; assuming independence, normality and no correlation [S9]; using full Kelly (drawdowns of roughly 40–80% are commonly cited [S9][S14]); treating f as position value instead of fraction lost on a loss.
- **Level** A · **Prereq** PM-03, ST-01, RF-10.
- **Sim.** "Kelly curve" widget: the learner sets W and b, sees g(f) as a curve with markers at ¼, ½, 1× and 2× Kelly, then runs 1,000 simulated paths at each and compares median wealth, 5th-percentile wealth and max DD. A second toggle adds estimation error (true W drawn ±5 pp from the estimate) to show why fractional Kelly is used.

### RF-14 Optimal f (Ralph Vince)
- **Def.** The fixed fraction that would have maximised Terminal Wealth Relative (TWR) over a historical trade list, with each trade scaled by the largest historical loss [S6][S7].
- **Formula / example.** HPR_i = 1 + f × (Trade_i ÷ |BiggestLoss|), TWR(f) = Π HPR_i, and f_opt = argmax TWR. Trade 1 contract per (|BiggestLoss| ÷ f_opt) of equity. Example trade list ($/contract): +300, −100, +200, −100, −100, +150, −100, +250, −100, +100 gives f_opt ≈ **0.239** (TWR 1.74; at f = 0.4 TWR is 1.38; at f = 0.6 it is 0.48), so 1 contract per $418. A repeat of the worst loss would cost 23.9% of equity in a single trade.
- **Why.** It shows the hump-shaped growth curve: there is a peak, and going past it is worse than staying below it.
- **Mistakes.** The worst loss is only known after the fact and the future one may be bigger [S6]; extreme drawdowns at f_opt; using it on small samples. Practitioners use a fraction of f_opt [S6][S7].
- **Level** E · **Prereq** RF-13.
- **Sim.** Upload or choose a trade list; the app plots TWR(f), marks f_opt, and stress-tests by inserting a loss 1.5× larger than the historical maximum.

### RF-15 Martingale vs anti-martingale
- **Def.** Martingale increases size after losses (e.g. doubling); anti-martingale increases after wins and decreases after losses (fixed fractional is anti-martingale).
- **Formula / example.** Doubling from 1 unit after 7 straight losses: the next bet is 128 units and the cumulative loss is 127 units. At a 50% loss rate, the probability of at least one run of 8 or more losses in 100 trades is 17% (ST-06).
- **Why.** Averaging down and "doubling to get back" are martingale in disguise and are a common path to account blow-ups.
- **Mistakes.** Calling averaging down "scaling in"; relying on "price always comes back".
- **Level** B · **Prereq** RF-10, ST-06.
- **Sim.** Side-by-side run of the same coin-flip sequence under martingale and anti-martingale with a margin limit. Martingale eventually hits it. **Score hook** (RD): size increase after a losing trade without a rule-based reason is flagged as martingale behaviour.

### RF-16 Leverage (maximum vs effective)
- **Def.** Effective leverage = notional exposure ÷ equity. Maximum leverage is what the broker or regulator allows.
- **Formula / example.** $10,000 equity, 1 standard lot EURUSD at 1.1000: notional $110,000, so effective leverage is 11:1. A 1% move (110 pips) is $1,100, i.e. **11% of equity**. EU/UK retail caps: 30:1 major FX, 20:1 non-major FX/gold/major indices, 10:1 other commodities/non-major indices, 5:1 single equities, 2:1 crypto [S23][S27].
- **Why.** With correct percent-risk sizing, leverage determines *margin*, not risk. But high available leverage makes oversizing easy, and ESMA cited "excessive leverage" as a cause of retail losses [S24].
- **Mistakes.** "I use 1:500 leverage" (the maximum says nothing about risk); confusing margin with risk; ignoring that leverage multiplies costs relative to equity.
- **Level** B · **Prereq** RF-07.
- **Sim.** Gauge showing effective leverage live as positions change, with regulatory-cap overlays. Exercise: same trade at 1:1, 10:1 and 30:1 effective leverage; observe equity impact of a 1% move.

### RF-17 Margin: required, used, free, margin level
- **Def.** Required margin is the collateral to open a leveraged position (notional ÷ max leverage). Free margin = equity − used margin. Margin level = equity ÷ used margin × 100%.
- **Formula / example.** At 30:1, 1 lot EURUSD at 1.1000 requires 110,000 / 30 = $3,667. With $10,000 equity, margin level is 273% and free margin is $6,333.
- **Why.** It is the mechanics behind margin calls and stop-outs.
- **Mistakes.** Treating free margin as "money I can still risk"; opening new positions on unrealised profit.
- **Level** B · **Prereq** RF-16.
- **Sim.** Live account panel (balance, equity, used and free margin, margin level) with colour thresholds. "What-if" slider on price shows the margin level path.

### RF-18 Margin call and margin close-out (stop-out)
- **Def.** A margin call is a broker demand for more funds when equity falls below a maintenance requirement [S108][S109]. A close-out (stop-out) is forced liquidation of positions. For EU/UK retail CFDs, providers must close out at **50% of the minimum required margin**, per account [S23][S27].
- **Formula / example.** $5,000 equity, 1 lot EURUSD at 1.1000 (required $3,667, effective leverage 22:1). Close-out when equity ≤ 50% × 3,667 = $1,833, i.e. after a $3,167 loss = **317 pips ≈ 2.9% adverse move** that wipes 63% of the account. In US securities margin accounts, firms may sell positions to meet a call, sometimes without contacting the client (reported by secondary sources [S108][S109]; verify with the broker agreement).
- **Why.** Learners must see that a stop-out is a *failure of sizing*, not a protective feature.
- **Mistakes.** Relying on stop-out as a stop-loss; adding funds to "save" a position (sunk cost, PSY-15); not knowing the broker's close-out order (largest loser first, etc.).
- **Level** B · **Prereq** RF-17.
- **Sim.** Scenario "the over-leveraged trader": the learner is handed an oversized position and must decide (cut, hedge, add funds). The replay ends at stop-out and the debrief computes the size that would have kept loss at 1%.

### RF-19 Liquidation and liquidation price (leveraged derivatives/crypto)
- **Def.** The price at which the exchange or broker force-closes a leveraged position because maintenance margin is breached.
- **Formula / example.** Isolated long (approximation; exchange formulas differ): Liq ≈ Entry × (1 − 1/L + MMR). Entry 30,000, L = 10, MMR 0.5% gives ≈ 27,150 (−9.5%). **[BK]**
- **Why.** In high-leverage venues, liquidation often sits closer than a sensible stop, so the "stop" becomes the liquidation engine plus fees.
- **Mistakes.** Setting the stop beyond the liquidation price; cross-margin contagion between positions; ignoring funding fees.
- **Level** I · **Prereq** RF-17.
- **Sim.** Liquidation-price calculator; the learner must place the stop *inside* the liquidation price and see the margin buffer.

### RF-20 Negative balance protection, gap risk and guaranteed stops
- **Def.** NBP caps a retail client's loss at account funds (mandatory for EU/UK retail CFDs [S23][S27]). Gap risk is price jumping past a stop (weekends, news). A guaranteed stop is a broker-guaranteed fill for a premium.
- **Formula / example.** Long at 100, stop 98, weekend gap open at 94 gives a −3R loss instead of −1R.
- **Why.** Stops are orders, not guarantees. Event risk needs separate rules (PR-12).
- **Mistakes.** Holding full size through scheduled binary events; assuming the stop price equals the fill price.
- **Level** B → I · **Prereq** RF-03.
- **Sim.** The synthetic market generator includes gap events (weekend, "news") with configurable frequency. The journal reports "slippage beyond stop" in R.

### RF-21 Costs as a fraction of R
- **Def.** Spread, commission, financing (swap) and slippage expressed relative to the trade's risk.
- **Formula / example.** Cost in R = (spread + commission + expected slippage) ÷ stop distance. With a 1-pip spread and a 10-pip stop, cost is **0.1R per trade**, enough to turn a +0.08R gross edge negative. The same spread on a 50-pip stop is 0.02R.
- **Why.** Short-timeframe trading multiplies costs; Barber & Odean attribute household underperformance mainly to trading costs and frequency [S31][S32].
- **Mistakes.** Backtesting on mid prices; ignoring overnight financing on held CFDs; not modelling wider spreads at news/open.
- **Level** B → I · **Prereq** RF-03, RF-04.
- **Sim.** Cost dashboard per trade (in money and R). A "timeframe ladder" exercise shows the same setup on 5-min vs daily bars and the cost share of R.

---

## 2. Portfolio-level risk

### PR-01 Portfolio heat (total open risk)
- **Def.** Sum of the money at risk across all open positions if every stop were hit, as % of equity [S17][S18][S19].
- **Formula / example.** Heat = Σ position risk ÷ Equity. Four positions risking 1%, 0.5%, 1% and 1.5% give **4% heat**. Practitioner caps are often 4–8% for swing traders (convention, not a standard [S17]); Elder's monthly 6% rule includes open risk [S71].
- **Why.** Per-trade limits alone hide clustered exposure: five 1% trades stopped in one session is a 5% day [S17].
- **Mistakes.** Counting positions moved to breakeven as zero risk while ignoring gap risk; forgetting pending orders; not reducing new size when heat is near the cap.
- **Level** I · **Prereq** RF-07.
- **Sim.** Heat bar in the order ticket: new orders that would push heat over the cap are blocked or need a justification. **Score hook** (RD): time spent above the heat cap; number of override attempts.

### PR-02 Correlation and effective number of bets
- **Def.** Correlated positions behave like one larger position. The effective number of independent bets shrinks as correlation rises.
- **Formula / example.** Two equal risks of 1% with correlation ρ: combined σ-risk = √(1² + 1² + 2ρ·1·1). At ρ = 0.9 that is **1.95%**; at ρ = 0 it is 1.41%. Effective bets for n equal positions with average ρ: N_eff = n ÷ (1 + (n−1)ρ). Five positions at ρ = 0.8 give **1.19 bets**. **[BK formula; standard portfolio maths]**
- **Why.** "Diversified" retail books are often one macro bet (e.g. long EURUSD, GBPUSD and AUDUSD = short USD three times).
- **Mistakes.** Using correlation from calm periods (correlations rise in stress); ignoring common-currency exposure.
- **Level** I → A · **Prereq** PR-01, ST-08.
- **Sim.** The synthetic market includes correlated instrument pairs with tunable ρ. The heat panel shows both "naive heat" and "correlation-adjusted heat". A drill asks the learner to build a 4-position book within a 3% adjusted-heat cap.

### PR-03 Concentration and exposure limits
- **Def.** Caps per instrument, sector, currency, direction and strategy.
- **Formula / example.** Example policy: max 2% risk per instrument, 4% per currency (net), 50% of heat in one direction, 1 position per highly correlated cluster.
- **Why.** Single-theme blow-ups are a classic failure.
- **Mistakes.** Counting long EURUSD and short USDCHF as diversification; strategy-level crowding (all positions are the same breakout setup).
- **Level** I · **Prereq** PR-01, PR-02.
- **Sim.** Exposure matrix (currency × direction) updates live; a limit breach turns the cell red.

### PR-04 Daily loss limit (circuit breaker)
- **Def.** A pre-committed maximum loss per day (in % or R), after which trading stops for the day.
- **Formula / example.** Daily limit = 3R = 3% at r = 1%. Size so the limit is ≥ the expected daily losing streak: with 6 trades/day at 40% win rate, P(at least 3 losses in a row on a given day) ≈ 47.5% (ST-06). Prop example: one popular firm's reported 5% daily loss including floating P&L, measured from the start-of-day balance [S77] (verify current rules).
- **Why.** It prevents tilt and revenge trading (PSY-18/19) from turning a bad day into a disastrous week; it is also the first prop-firm rule most traders break [S76].
- **Mistakes.** Measuring on closed P&L only when the rule uses equity; "one more trade to get back to the limit"; no limit on the number of trades.
- **Level** B · **Prereq** RF-02.
- **Sim.** Hard lock in the simulator once the limit is hit (a "cool-down" screen with a reflection prompt). **Score hook** (RD): limit respected; attempts to trade during lock.

### PR-05 Weekly and monthly loss limits (Elder's 6% rule)
- **Def.** Cumulative period limits. Elder: stop opening new trades for the rest of the month when realised monthly losses plus open risk reach 6% of month-start equity [S71][S72].
- **Formula / example.** Month-start equity $20,000 gives a 6% cap of $1,200. After −$700 realised and $400 open risk, only $100 of new risk is allowed.
- **Why.** Elder frames the 2% rule as protection against "sharks" (one big loss) and the 6% rule against "piranhas" (many small losses) [S72].
- **Mistakes.** Resetting the limit mid-month; critics note the rule can halt a professional after three losses early in the month [S73]. Tune it to trade frequency.
- **Level** I · **Prereq** PR-01, PR-04.
- **Sim.** Calendar view with daily, weekly and monthly budget bars; the learner sets limits in the trading plan (PL-01) and the app enforces them.

### PR-06 Drawdown: definition, depth, duration
- **Def.** Decline from a running equity peak. Max drawdown (MDD) is the largest; duration ("time under water") is the time from peak to new peak.
- **Formula / example.** DD_t = (Peak_t − Equity_t) ÷ Peak_t. Equity path 10,000 → 12,000 → 9,600 → 12,500: MDD = (12,000 − 9,600)/12,000 = **20%**.
- **Why.** Drawdown is what makes traders quit or break rules; it is the input to Calmar, recovery factor and prop-firm rules.
- **Mistakes.** Measuring from the starting balance instead of the peak; using closed-trade equity only (hides intra-trade drawdown); expecting live MDD ≤ backtest MDD (Monte Carlo shows live is usually worse [S84]).
- **Level** B · **Prereq** none.
- **Sim.** "Underwater chart" under every equity curve; hovering shows depth and duration.

### PR-07 Recovery mathematics
- **Def.** The gain needed to recover from a loss is larger than the loss.
- **Formula / example.** Gain needed = DD ÷ (1 − DD). 10% → 11.1%; 20% → 25%; 30% → 42.9%; 40% → 66.7%; 50% → **100%**; 60% → 150%; 75% → 300%; 90% → 900%.
- **Why.** It is the most intuitive argument for small r and hard drawdown rules.
- **Mistakes.** Thinking "I lost 30%, I need 30% back"; raising risk to recover faster (break-even effect, PSY-05).
- **Level** B · **Prereq** PR-06.
- **Sim.** Interactive asymmetry curve; the learner drags the drawdown and sees the required gain and the trades needed at their expectancy and r.

### PR-08 Drawdown rules and de-risking tiers
- **Def.** Pre-set actions at drawdown thresholds.
- **Formula / example.** Example policy: at −5% from peak, cut r from 1% to 0.5%; at −10%, stop live trading and do a full review (PL-12); resume full r only after recovering half the drawdown. Graduated de-risking is a practitioner pattern [S74][S75].
- **Why.** It turns an emotional crisis into a procedure and lowers risk of ruin.
- **Mistakes.** Thresholds too tight for the system's normal DD (compare with the Monte Carlo 95th percentile, BT-13); de-risking then never re-risking.
- **Level** I · **Prereq** PR-06, PR-07.
- **Sim.** The trading-plan builder includes a DD-tier table; the simulator applies it automatically and reports what it saved or cost on the learner's history.

### PR-09 Risk of ruin (RoR)
- **Def.** Probability that losses reduce the account to a level where trading must stop (zero or a defined drawdown) [S14][S15][S16].
- **Formula / example.**
  - Even payoffs (1:1), fixed bet, N bet-units of capital: RoR = ((1−W)/W)^N [S14]. W = 60%: N = 100 (1% bets) gives ≈ 2.5×10⁻¹⁸; N = 10 (10% bets) gives **1.7%**; W = 55%, N = 20 gives 1.8%.
  - Unequal payoffs: approximation RoR ≈ ((1−A)/(1+A))^N with A = edge per unit risk [S14]. This approximation is fragile and the source's own tables are inconsistent [S14], so use **Monte Carlo** for real systems (BT-13).
  - Define ruin as a drawdown limit (e.g. 30% or 50%), not zero: a trader who quits at 25% has a higher RoR than one who tolerates 50% [S16].
- **Why.** A positive-expectancy system can still be ruined by oversizing [S14].
- **Mistakes.** Using RoR formulas that assume independence and fixed payoffs on skewed, autocorrelated real results; computing with in-sample win rates.
- **Level** A · **Prereq** RF-10, PM-03, ST-01.
- **Sim.** RoR lab: inputs are win rate, payoff, r and ruin threshold; the output is analytic RoR (where valid) next to Monte Carlo RoR with a histogram of paths that hit the threshold.

### PR-10 Equity-curve trading (equity-curve filter)
- **Def.** Pause or reduce trading when the system's equity curve falls below its own moving average; resume when it recovers [S74][S75].
- **Formula / example.** Trade live only when Equity_closed > SMA(Equity, 20 trades); keep tracking "shadow" trades while paused [S74].
- **Why.** It can shorten drawdowns for systems whose results cluster, at the cost of lagged re-entry and lower total return [S74]; it does not stop drawdowns.
- **Mistakes.** Stopping the equity curve itself when paused (it must be simulated through) [S74]; using it on trend-following systems where the best trades follow losing streaks [S74]; optimising the MA length (overfitting).
- **Level** A · **Prereq** PR-06, BT-10.
- **Sim.** Toggle the filter on a historical R sequence; compare total R, MDD and missed big winners. A "shadow trades" lane shows what was skipped.

### PR-11 Prop-firm style risk rules (worked practical examples)
- **Def.** Evaluation-account rules: daily loss limit, maximum loss (static or trailing), trailing drawdown (intraday vs end-of-day), profit target, sometimes consistency rules and minimum days [S76][S77][S78].
- **Formula / example.**
  - *Static max loss:* $100k account, 10% max loss gives a fixed floor at $90,000 [S77] (reported; verify current firm rules).
  - *Intraday trailing DD:* $50k account, $2,500 trailing. Floor starts at $47,500. A trade runs to +$1,500 unrealised (equity $51,500), so the floor moves to $49,000. The trade then closes at breakeven: equity $50,000, buffer only $1,000. Under **EOD trailing** the floor is updated only from closing balance, so it would still be $47,500 [S76][S78].
  - *Daily limit vs per-trade risk:* with a 5% daily limit and 1% per trade, 5 full losses (fewer with slippage) end the day.
- **Why.** These rules are a concrete, gamified form of RD and translate well into simulator "challenges". They also show how rule design changes optimal behaviour (taking partials under intraday trailing).
- **Mistakes.** Not knowing whether limits use balance or equity [S76]; sizing to hit the profit target fast (oversizing); treating challenge fees as entertainment.
- **Level** I · **Prereq** PR-04, PR-06.
- **Sim.** "Challenge mode": configurable rule sets (static, trailing intraday, trailing EOD); a live floor line is drawn on the equity chart. The debrief is scored on rule compliance and process, *not* on passing.

### PR-12 Event and gap risk policy
- **Def.** Rules for scheduled events (rate decisions, payrolls, earnings) and unscheduled gaps (weekends).
- **Formula / example.** Policy: no new entries within 15 min of tier-1 events; halve size on positions held over events; worst-case gap scenario ≤ 2R per position.
- **Why.** Stops do not protect against gaps (RF-20).
- **Mistakes.** Not checking the calendar (pre-market routine, PL-05); assuming the stop limits loss.
- **Level** I · **Prereq** RF-20.
- **Sim.** The synthetic calendar flags events; the generator injects volatility spikes and gaps on event bars. **Score hook** (DQ): calendar checked before entry.

### PR-13 Value at Risk (VaR) and Expected Shortfall (ES), basics
- **Def.** VaR(α, h) is the loss threshold that is exceeded with probability 1−α over horizon h. ES (CVaR) is the average loss in those worst cases [S101][S102].
- **Formula / example.**
  - Parametric (normal, μ ≈ 0): VaR = z_α × σ_h × V. Portfolio $10,000, daily σ = 1.5%, 95% (z = 1.645): VaR = **$247**. ES_95% (normal) = σ × φ(1.645)/0.05 = 2.06σ, so **$309** (≈ 1.25 × VaR, matching [S101]).
  - Historical: sort the last 250 daily P&Ls; 95% VaR ≈ the 13th-worst loss; ES = average of the 12–13 worst.
- **Why.** It is the institutional language of risk (CFA/FRM), it shows learners "normal" vs "tail" days, and it motivates fat tails (ST-04).
- **Mistakes.** Reading VaR as the "maximum loss"; using normal VaR on fat-tailed data; short look-back windows during regime change.
- **Level** A · **Prereq** ST-02, ST-04.
- **Sim.** VaR widget on the learner's simulated daily P&L, with historical vs parametric vs Student-t; exceedances are highlighted on a timeline (a simple "VaR backtest").

### PR-14 Gross/net exposure and portfolio volatility targeting
- **Def.** Gross exposure = Σ|positions|, net = Σ positions; volatility targeting scales total exposure so predicted portfolio volatility hits a target (e.g. 10%/yr).
- **Formula / example.** Scale = σ_target ÷ σ_forecast. Target 10%, forecast 16% gives exposure × 0.625.
- **Why.** It is the bridge from per-trade sizing to professional portfolio risk.
- **Mistakes.** Forecasting volatility from too short a window; leverage creep in calm regimes before a shock.
- **Level** E · **Prereq** RF-12, PR-02.
- **Sim.** Multi-asset sandbox with a vol-target knob; regime switches show the lag problem.

---
## 3. Trade management

### TM-01 Order types: market, limit, stop, stop-limit
- **Def.** A market order fills now at the best available price (fill certainty, price uncertainty). A limit fills at your price or better (price certainty, fill uncertainty). A stop becomes a market order when triggered. A stop-limit becomes a limit when triggered (it may not fill).
- **Formula / example.** Slippage = |fill − intended price|. A buy-stop at 1.1050 during a news spike fills at 1.1058, so slippage is 8 pips; with a 20-pip stop distance that is 0.4R.
- **Why.** Order choice changes realised R and costs (RF-21).
- **Mistakes.** Stop-limit as a protective stop (it may never fill in a gap); market orders in thin liquidity; forgetting that limit orders suffer **adverse selection**: they fill more often when price keeps going against you and are missed on the best winners **[BK]**.
- **Level** B · **Prereq** RF-03.
- **Sim.** Order-book-lite simulator with spread widening and partial fills. Drill: the same setup executed with market vs limit entries over 50 synthetic replays; compare fill rate, average slippage and expectancy.

### TM-02 Entry techniques: anticipation vs confirmation; breakout vs pullback
- **Def.** Entering before a trigger completes (anticipation, better price, lower hit rate) vs after (confirmation, worse price, higher hit rate). Breakout entries use stop orders; pullback entries use limits.
- **Formula / example.** Entry efficiency (long) = (MaxHigh_during_trade − Entry) ÷ (MaxHigh − MinLow) **[BK; practitioner metric]**. 0.8 means you bought near the low of the trade's range.
- **Why.** Entry affects R (stop distance) and therefore size. A tighter entry gives the same idea a larger R-multiple potential.
- **Mistakes.** Chasing after a big candle (FOMO, PSY-16); "perfect entry" obsession at the expense of exits and sizing.
- **Level** I · **Prereq** TM-01, RF-06.
- **Sim.** Setup replay with three entry options (anticipate / trigger / retest); the app reveals the outcome distribution of each over many synthetic paths.

### TM-03 Scaling in: split entries vs pyramiding vs averaging down
- **Def.** A *split entry* divides a planned position across levels with **total risk ≤ 1R**. *Pyramiding* adds to a winner while keeping combined open risk ≤ the initial R. *Averaging down* adds to a loser (martingale behaviour, RF-15).
- **Formula / example.** Pyramiding: 100 sh at $50, stop $48 (R = $200). Price reaches $54; add 50 sh at $54 and move all stops to $51. Open risk: first lot locks +$100, second lot risks 50 × $3 = $150, so net worst case is −$50, below the original R.
- **Why.** Done right, pyramiding increases exposure only when the market confirms the idea, which gives positive skew.
- **Mistakes.** Adding without moving stops (heat explodes); averaging down "to improve the average price"; mixing up average price with risk.
- **Level** I → A · **Prereq** RF-07, PR-01.
- **Sim.** Pyramiding planner: the learner places adds and stop moves; the live "worst-case if all stops hit" line must stay ≤ 1R. **Score hook** (RD): averaging-down events (adding to a losing position below the original stop plan) are flagged automatically.

### TM-04 Initial stop: hard vs mental vs time-based
- **Def.** A hard stop is a resting order; a mental stop exists only in your head; a time stop exits after N bars if the trade has not progressed (TM-09).
- **Why.** Mental stops are where loss aversion and the disposition effect operate (PSY-02/03).
- **Mistakes.** Pulling the stop "just this once"; placing stops then cancelling before news.
- **Level** B · **Prereq** RF-06.
- **Sim.** Default requires a hard stop at entry; a "mental stop" mode lets the learner try it, then records every time price crossed the mental stop without action. **Score hook** (RD): stop honoured rate.

### TM-05 Profit targets: R-multiple, structure, volatility
- **Def.** Fixed-R targets (e.g. 2R), structural targets (prior swing, range edge) or volatility targets (k × ATR).
- **Formula / example.** Target = Entry + k × R. With entry 100, stop 98 (R = 2) and k = 2.5, the target is 105. There is a trade-off: a farther target lowers win rate and raises payoff (RF-05).
- **Why.** The target choice shapes the R distribution; the "best" target is an empirical question (MFE analysis, TM-17).
- **Mistakes.** Moving targets closer out of fear (cutting winners, PSY-03); targets beyond obvious opposing structure.
- **Level** B · **Prereq** RF-05.
- **Sim.** "Target sweep": on a fixed set of entries the learner tries 1R…5R targets and sees win rate, payoff and expectancy per target, plus an MFE histogram.

### TM-06 Trailing stops (ATR/chandelier, structure, MA, percent)
- **Def.** A stop that follows price in the trade's favour and never moves back.
- **Formula / example.** Chandelier (long): Stop = HighestHigh_since_entry − k × ATR **[BK: attributed to Chuck LeBeau]**. HH 120, ATR 2.5, k = 3 gives 112.5. Structure trail: below the last higher low. MA trail: close below the 20-EMA.
- **Why.** Trailing lets winners run (positive skew), which suits trend-following.
- **Mistakes.** Trailing too tight (constant noise stop-outs); switching trail method mid-trade; trailing on intrabar wicks in illiquid markets.
- **Level** I · **Prereq** TM-05, ST-03.
- **Sim.** Exit-policy comparator: one entry stream, several trailing rules (k = 1.5/2/3/4 ATR, swing, EMA) with result distributions, average giveback (TM-17) and average holding time.

### TM-07 Breakeven stops
- **Def.** Moving the stop to the entry price after a defined favourable move (e.g. +1R).
- **Formula / example.** If 30% of eventual winners first retrace to entry after reaching +1R, a BE rule converts them into scratches (0R). Whether that helps depends on the MAE-after-MFE distribution (TM-16/17).
- **Why.** It feels safe and lowers heat (PR-01), but it often **reduces expectancy** by stopping valid trades inside noise.
- **Mistakes.** Moving to BE because of discomfort rather than a rule; BE at exactly the entry price (spread and noise hunt it); counting BE positions as zero risk (gap risk remains).
- **Level** I · **Prereq** TM-04, TM-16.
- **Sim.** A/B on the learner's own trades: "with BE at +1R" vs "without"; the app shows how many winners were killed vs losers saved.

### TM-08 Partial profits / scaling out
- **Def.** Closing portions of a position at different levels.
- **Formula / example.** Blended R = Σ (fraction_i × R_i). Plan: ½ at +1R, ½ trailed. Outcomes: (a) runner hits +3R gives 0.5×1 + 0.5×3 = **+2R**; (b) runner stopped at BE gives **+0.5R**; (c) stopped before +1R gives **−1R**. Scaling out raises win rate and lowers variance; its effect on expectancy can go either way and depends on the trade's MFE distribution.
- **Why.** It is psychologically helpful and matters for prop trailing-drawdown rules (PR-11), but it can quietly cap the right tail.
- **Mistakes.** Taking partials too early on a positive-skew system; using partials to "feel right" rather than by rule; not adjusting the stop on the remainder.
- **Level** I · **Prereq** TM-05, TM-06.
- **Sim.** Exit planner with up to 3 partial levels; Monte Carlo on the learner's trade sample comparing expectancy, SD of R and max DD across plans.

### TM-09 Time stops
- **Def.** Exit if the trade has not reached a defined progress (e.g. +0.5R) within N bars, or at session end.
- **Formula / example.** Rule: if MFE < 0.5R after 10 bars, exit at market. Benefit = freed capital and attention; cost = trades that would have worked later.
- **Why.** Dead trades tie up heat and attention, and an idea that is not working in time is new information.
- **Mistakes.** Time stops too short for the setup's natural rhythm; ignoring overnight/weekend effects.
- **Level** I · **Prereq** TM-05.
- **Sim.** Bars-in-trade vs final R scatter from the learner's journal; the learner draws a time-stop line and the app recomputes results.

### TM-10 Exits on opposing signal / discretionary exits
- **Def.** Leaving because the reason for the trade has disappeared (structure broken, signal reversed), independent of the stop.
- **Why.** Valid if pre-defined. Ad-hoc exits are where fear and the disposition effect show up.
- **Mistakes.** Inventing a "reason" after the fact to justify fear (hindsight, PSY-13).
- **Level** I · **Prereq** PL-03.
- **Sim.** Discretionary exits require choosing a reason tag from the playbook; untagged exits count as rule deviations.

### TM-11 Management rules vs discretion
- **Def.** A spectrum from fully rule-based (all if-then rules written before entry) to discretionary (judgment in the moment). A middle way is **bounded discretion**: discretion allowed only inside pre-set limits (never widen the stop, never increase risk).
- **Formula / example.** Discretion quality = expectancy of trades with discretionary overrides − expectancy of the same trades under the base rule (computed in replay).
- **Why.** The app can score whether discretion *added* value, a core Decision Quality measure.
- **Mistakes.** Believing discretion helps without measuring it; changing rules mid-trade.
- **Level** I → A · **Prereq** PL-01, TM-03…TM-10.
- **Sim.** "Override ledger": every deviation from the plan is logged; after 30+ trades the app shows the counterfactual "rules-only" equity curve vs actual. **Score hook** (DQ): override value-add (in R) and override frequency.

### TM-12 Never widen the stop (stop discipline)
- **Def.** The stop may only move in the direction that reduces risk.
- **Why.** Widening the stop is loss aversion in action (PSY-02) and invalidates R.
- **Mistakes.** "Giving it room" after entry.
- **Level** B · **Prereq** TM-04.
- **Sim.** The simulator allows widening but marks the trade "R violated", and the R-multiple is recomputed against the original R. **Score hook** (RD): count of stop-widening events.

### TM-13 Hedging/locking positions (retail "lock")
- **Def.** Opening an opposite position in the same instrument instead of closing a loser.
- **Why.** It has the same net exposure as closing, plus double costs and swap; it delays decisions (sunk cost, PSY-15).
- **Mistakes.** Believing a locked loss is "not realised".
- **Level** B · **Prereq** RF-17.
- **Sim.** The app shows net exposure and the cost accumulating on locked positions; scenario debrief.

### TM-14 Trade management around events, sessions and weekends
- **Def.** Rules for reducing, closing or protecting positions before known volatility events or illiquid periods.
- **Why.** Gap risk (RF-20) and spread widening (RF-21).
- **Level** I · **Prereq** PR-12.
- **Sim.** Event-day scenarios with spread spikes; the learner chooses a hold, reduce or flatten policy before the event and sees the distribution of outcomes.

### TM-15 Re-entry rules
- **Def.** Whether and when to re-enter after being stopped out of a still-valid idea.
- **Why.** It separates a legitimate second attempt from revenge trading (PSY-18).
- **Mistakes.** Immediate re-entry at bigger size after a stop.
- **Level** I · **Prereq** PL-03.
- **Sim.** The playbook card must specify re-entry conditions. Re-entries within X minutes of a loss, or at bigger size, are flagged.

### TM-16 MAE: Maximum Adverse Excursion (John Sweeney)
- **Def.** The worst unrealised loss a trade experienced before it closed, usually expressed in R or ATR. Sweeney proposed adverse excursion as a rational basis for stop placement [S20][S21][S22].
- **Formula / example.** MAE_R = (Entry − LowestLow_during_trade) ÷ (Entry − Stop) for a long. Hypothetical journal: 90% of winners had MAE ≤ 0.6R while losers mostly went straight to −1R. A stop at about 0.7R would cut average loss by about 30% while stopping out roughly 10% of winners (the trade-off must be re-tested out-of-sample).
- **Why.** It replaces stop-placement folklore with your own data. Sweeney's book stresses that MAE works only if market behaviour shows some consistency [S20].
- **Mistakes.** Optimising stops on small samples (overfitting); mixing setups with different volatility; ignoring that tighter stops change position size and therefore costs.
- **Level** I → A · **Prereq** RF-04, TM-04, ST-02.
- **Sim.** MAE scatter (MAE_R on x, final R on y; winners and losers in different colours). The learner drags a vertical "stop line" and the app recomputes expectancy, win rate and number of winners lost.

### TM-17 MFE: Maximum Favorable Excursion, giveback and exit efficiency
- **Def.** The best unrealised profit reached during the trade [S21][S22].
- **Formula / example.** Giveback (end-trade drawdown) = MFE − realised. Exit efficiency = realised ÷ MFE. A trade reached +3R and closed at +1R: giveback 2R, efficiency 33%.
- **Why.** It shows whether exits leave too much on the table or whether targets are unrealistic (e.g. targets at 3R when 80% of trades never reach MFE 2R).
- **Mistakes.** Expecting 100% efficiency (impossible without hindsight, PSY-13); tightening exits based on a few big givebacks.
- **Level** I → A · **Prereq** TM-16.
- **Sim.** MFE histogram with the learner's target line; a "giveback" column in the journal; weekly KPI: average exit efficiency by setup.

### TM-18 Edge ratio (e-ratio)
- **Def.** Average MFE ÷ average MAE (both normalised by ATR) measured N bars after entry signals. It tests whether an entry signal has any edge, independent of exits **[BK: popularised by Curtis Faith, *Way of the Turtle*]**.
- **Formula / example.** At 10 bars, avg MFE 1.6 ATR and avg MAE 1.0 ATR give e-ratio 1.6. Random entries hover near 1.0.
- **Why.** It separates "is my entry better than random?" from exit design.
- **Mistakes.** Not comparing against random-entry baselines (BT-16).
- **Level** A · **Prereq** TM-16, TM-17, BT-16.
- **Sim.** e-ratio curve vs holding period for a setup and for random entries on the same synthetic data.

---

## 4. Performance metrics

> Teaching note: the app scores process. Outcome metrics are shown as **diagnostics with confidence intervals**, never as the grade. Each metric card ends with the sample size needed before it means anything (§8).

### PM-01 Win rate (hit rate)
- **Def.** Winning trades ÷ total trades.
- **Formula / example.** 22 wins in 40 trades is 55%. 95% CI ≈ p ± 1.96√(p(1−p)/n) = 55% ± 15.4%, i.e. **39.6%–70.4%**. At n = 400 the CI is 50.1%–59.9%. (12 wins of 20, Wilson interval: 38.7%–78.1% **[BK method]**.)
- **Why.** It is the most-watched and least informative metric on its own (RF-05).
- **Mistakes.** Optimising for win rate (cutting winners early); comparing win rates across systems with different payoff.
- **Level** B · **Prereq** none.
- **Sim.** Win-rate card always shows the CI band and n. A "how sure are we?" animation shows the CI shrinking as trades accumulate.

### PM-02 Payoff ratio (average win ÷ average loss)
- **Def.** Realised reward:risk.
- **Formula / example.** Avg win $250, avg loss $100 gives a payoff of 2.5.
- **Why.** Win rate and payoff together determine expectancy.
- **Mistakes.** Using the *planned* RR in place of the realised payoff; letting one outlier dominate (report the median too).
- **Level** B · **Prereq** PM-01.
- **Sim.** Win-rate × payoff scatter with iso-expectancy curves (same as RF-05).

### PM-03 Expectancy (in R and in money)
- **Def.** Average result per trade [S1][S2].
- **Formula / example.** E = W × AvgWin − (1−W) × AvgLoss. Reference system: 0.4 × 2.5 − 0.6 × 1 = **+0.4R**. With 1R = $100 that is $40/trade. Equivalent: E = mean of all R-multiples.
- **Why.** It is the single number that says whether a system has an edge, but only with enough trades (PM-13).
- **Mistakes.** Calculating on 15 trades; mixing setups; forgetting costs; using money expectancy when position sizes varied.
- **Level** B · **Prereq** PM-01, PM-02, RF-04.
- **Sim.** Expectancy card with bootstrap CI (for the reference system at n = 100: about +0.06R to +0.74R). Drill: the learner predicts the expectancy of a described system before the calculator reveals it.

### PM-04 Expectancy per unit time ("opportunity")
- **Def.** Expectancy × number of trades per period (Tharp's "opportunity" idea) **[BK]**.
- **Formula / example.** System A: +0.4R × 8 trades/month = 3.2R/month. System B: +1.0R × 2 trades/month = 2R/month.
- **Why.** It is the right way to compare systems with different frequencies, provided costs are included.
- **Mistakes.** Increasing frequency by lowering setup quality (expectancy drops); ignoring the cost per trade.
- **Level** I · **Prereq** PM-03.
- **Sim.** Two-system comparison widget with frequency and cost sliders.

### PM-05 Profit factor
- **Def.** Gross profit ÷ gross loss [S103][S104].
- **Formula / example.** Reference system (100 trades): 40 × 2.5R = 100R, divided by 60 × 1R = 60R, gives **PF 1.67**. Identity: PF = 1 + Net/GrossLoss. Practitioner bands: realistic backtests often fall around 1.2–2.0, and >3 in a backtest suggests over-optimisation [S104].
- **Why.** It is quick and scale-free.
- **Mistakes.** It ignores trade order and drawdown and can be inflated by one outlier [S103]; platforms sometimes confuse PF with "expected payoff" [S103].
- **Level** B → I · **Prereq** PM-03.
- **Sim.** PF shown alongside "PF without the top 5% of trades" (outlier dependence).

### PM-06 Maximum drawdown, average drawdown, drawdown duration, Ulcer Index
- **Def.** See PR-06. The Ulcer Index = √(mean of squared % drawdowns) captures both depth and duration **[BK: Peter Martin]**.
- **Formula / example.** DD series 0, 5, 10, 5, 0 (%) gives UI = √((0+25+100+25+0)/5) = √30 = **5.5%**.
- **Why.** Pain metrics predict whether a human will stick with the system.
- **Mistakes.** Quoting backtest MDD as the worst case (Monte Carlo 95th percentile is usually worse [S84]).
- **Level** I · **Prereq** PR-06.
- **Sim.** Underwater chart plus a UI gauge; compare two curves with equal MDD but different durations.

### PM-07 Sharpe ratio
- **Def.** Excess return per unit of total volatility: SR = (R̄_p − R_f) ÷ σ_p **[BK: Sharpe 1966/1994]**; Lo gives the formal definition and estimator [S97].
- **Formula / example.** Daily mean excess 0.05% and daily σ 1% give a daily SR of 0.05; annualised (IID) × √252 = **0.79**. Standard error (IID) ≈ √((1 + SR²/2)/T) [S97]. With annual SR 1.0 measured over 3 years: SE ≈ 0.71, so the 95% CI is **−0.39 to 2.39**. Even 10 years at SR 1.0 gives 0.24–1.76 (annualised form of the same variance: (1 + SR²/2)/years [S91]). Lo also shows that serial correlation can overstate annualised hedge-fund Sharpe ratios **by as much as 65%** and that √12 annualisation is only valid under special conditions [S97].
- **Why.** It is the industry standard, it explains why "my 3-month Sharpe of 3" means little, and it is the basis of the DSR (BT-19).
- **Mistakes.** Annualising with √N when returns are autocorrelated; using it for highly skewed strategies (option selling looks great until it does not); comparing Sharpe ratios computed at different frequencies.
- **Level** A · **Prereq** ST-02, ST-03.
- **Sim.** The Sharpe card always shows its CI; a "track-record length" slider shows how many years are needed before the CI excludes 0.

### PM-08 Sortino ratio
- **Def.** Excess return over a minimum acceptable return (MAR) divided by **downside deviation** (only returns below MAR count) [S100].
- **Formula / example.** Monthly returns (%) +3, −2, +1, −4, +2, +4 with MAR 0: mean 0.667%. Downside deviation = √((2² + 4²)/6) = 1.83%, so **Sortino 0.37** (monthly), while Sharpe (sample σ 3.08%) is 0.22. **[BK: Sortino & Price 1994; denominator conventions vary [S100]]**
- **Why.** It does not penalise upside volatility, which suits positively skewed systems.
- **Mistakes.** Inconsistent denominators (dividing by n vs by the number of negative periods); tiny samples with few negative months.
- **Level** A · **Prereq** PM-07.
- **Sim.** Toggle between Sharpe and Sortino on the same equity curve, plus a skewed vs symmetric synthetic strategy.

### PM-09 Calmar ratio (and MAR ratio)
- **Def.** CAGR ÷ |max drawdown|, classically over 36 months (Terry Young, 1991) [S99]. The MAR ratio uses the full history.
- **Formula / example.** CAGR 15% and MDD 20% give **0.75**.
- **Why.** It is the pain-adjusted return investors feel. It depends on a single worst episode; Sterling-type ratios use the average of several of the largest DDs [S99].
- **Mistakes.** Comparing Calmar ratios over different window lengths (MDD grows with time).
- **Level** A · **Prereq** PR-06, PM-11.
- **Sim.** Rolling 36-month Calmar line chart on a long synthetic history.

### PM-10 Recovery factor
- **Def.** Net profit ÷ max drawdown (in money) [S103].
- **Formula / example.** Net $30,000 with MDD $10,000 gives **3.0**.
- **Why.** It shows how many times the system "earned back" its worst pain.
- **Mistakes.** It grows mechanically with longer histories.
- **Level** I · **Prereq** PR-06.
- **Sim.** Shown in the strategy report next to Calmar.

### PM-11 CAGR, arithmetic vs geometric return, volatility drag
- **Def.** Compound annual growth rate; geometric mean ≈ arithmetic mean − σ²/2.
- **Formula / example.** +50% then −50% is an arithmetic mean of 0% but a total of 0.75× (**−25%**), a geometric mean of −13.4% per period.
- **Why.** It is why over-betting (RF-13) and big swings destroy compounding.
- **Mistakes.** Reporting average monthly return × 12 as the annual return.
- **Level** I · **Prereq** ST-02.
- **Sim.** Two sliders (up %, down %) and a path chart showing the drag.

### PM-12 SQN, System Quality Number (Van Tharp)
- **Def.** Expectancy relative to the standard deviation of R, scaled by √(number of trades) [S4][S5].
- **Formula / example.** SQN = √N × mean(R) ÷ sd(R), with N often capped at 100 [S4]. Reference system: sd(R) = 1.71, so SQN = 10 × 0.4 / 1.71 = **2.33**. Tharp-attributed bands commonly cited (verify): <1.6 hard to trade, 1.6–1.9 below average, 2.0–2.4 average, 2.5–2.9 good, 3.0–5.0 excellent, 5.1–6.9 superb, ≥7 "holy grail" **[BK]**. Tharp's own drawdown simulations used systems with SQN 1–6 [S3].
- **Why.** SQN is mathematically a **t-statistic of mean R**. That makes it a good bridge to significance testing (ST-09): SQN 2.33 with N = 100 is p ≈ 0.02 (two-sided).
- **Mistakes.** Comparing SQN at different N without the cap; reading SQN on 20 trades; ignoring that it assumes independent trades.
- **Level** I → A · **Prereq** PM-03, ST-02.
- **Sim.** SQN gauge with an "equivalent t-stat / p-value" toggle and a sample-size warning below 30 trades.

### PM-13 Statistical significance of expectancy (t-test, bootstrap)
- **Def.** Is mean R distinguishable from zero (or from a cost-adjusted hurdle)?
- **Formula / example.** t = mean(R) ÷ (sd(R)/√n). Mean 0.2R, sd 1.5R, n = 50 gives t = 0.94 (not significant). Trades needed for t ≈ 2: n = (2 × sd/mean)² = **225**. For mean 0.1R and sd 1.2R, about 550 trades are needed to exclude 0 at 95%. Bootstrap CIs (resample trades with replacement, take the 2.5th/97.5th percentiles) handle skew better [S85].
- **Why.** It is the antidote to the law of small numbers (PSY-09).
- **Mistakes.** Testing many setups and reporting the best (multiple testing, BT-08); ignoring autocorrelation.
- **Level** A · **Prereq** ST-05, ST-09.
- **Sim.** "Is it luck?" widget: enter trades; it outputs t, p, bootstrap CI and the number of trades needed at the current effect size.

### PM-14 Consistency and dependency metrics
- **Def.** % profitable weeks/months; largest winner as % of net profit; longest losing streak vs expected (ST-06); share of profit from the top 5 trades.
- **Formula / example.** Net +40R where the best trade is +15R gives **37.5% outlier dependence**.
- **Why.** It detects fragile edges and lucky streaks.
- **Mistakes.** Treating profit dependence on outliers as automatically bad (trend-following *requires* it); know your system type.
- **Level** I · **Prereq** PM-03.
- **Sim.** Dependency panel in the monthly report.

### PM-15 Exposure, turnover and return on risk
- **Def.** Time in market (%), turnover (traded notional ÷ equity), and return per unit of average heat.
- **Formula / example.** Barber & Odean: the most active households turned over more than 9.6% per month and earned 10.0%/yr vs the market's 17.1% (web version of the paper) [S31].
- **Why.** High turnover combined with costs is a measured drag on retail performance [S31].
- **Level** I · **Prereq** PM-03, RF-21.
- **Sim.** Turnover meter plus "cost paid this month" in R.

### PM-16 Benchmark comparison (alpha vs passive)
- **Def.** Compare risk-adjusted results against a passive alternative (buy-and-hold index, or cash).
- **Why.** The retail evidence (§9) says most active traders underperform a passive benchmark net of costs.
- **Level** I · **Prereq** PM-07.
- **Sim.** Every strategy report shows a "do nothing / buy-and-hold" line on the same synthetic market.

### PM-17 Process KPIs (the app's primary scores)
- **Def.** Measurable behaviours that define Decision Quality and Risk Discipline, independent of P&L.
- **Formula / example.** Suggested set:
  - **Plan adherence** = trades matching a playbook setup ÷ all trades.
  - **Risk accuracy** = 1 − mean |actual R$ − planned R$| ÷ planned R$.
  - **Stop integrity** = trades with a stop at entry and no widening ÷ all trades.
  - **Limit compliance** = days within daily/weekly limits ÷ days traded.
  - **Heat compliance** = time below the heat cap ÷ time in market.
  - **Error cost** = Σ R lost on trades tagged with errors (PL-09).
  - **Journal completeness** = required fields filled ÷ required fields.
  - **Pre-trade checklist completion** and **post-trade review latency**.
  - **Override value-add** (TM-11).
- **Why.** These make "process over outcome" operational and gradable at small sample sizes, where P&L metrics are noise.
- **Mistakes.** Weighting outcome metrics into the grade; KPIs that can be gamed (e.g. tagging everything as a setup); refine with spot audits.
- **Level** B (introduced early, deepened throughout) · **Prereq** PL-01.
- **Sim.** Process dashboard as the home screen; P&L is secondary and collapsed by default.

---
## 5. Psychology and behavioural finance

> Design principle: each bias gets (1) a short lesson, (2) a **staged scenario** in the simulator that reliably triggers it, and (3) a **behavioural detector** computed from the learner's own actions, so the app shows the bias in the learner's data rather than lecturing about it.

### PSY-01 Prospect theory (reference dependence, diminishing sensitivity, probability weighting)
- **Def.** People evaluate outcomes as gains or losses relative to a reference point, with a value function that is concave for gains, convex for losses and steeper for losses. They also overweight small probabilities and underweight moderate-to-large ones (Kahneman & Tversky 1979; Tversky & Kahneman 1992) [S43][S44][S45].
- **Formula / example.** v(x) = x^α for gains and −λ(−x)^β for losses. The 1992 median estimates were α = β ≈ 0.88 and λ ≈ 2.25, from a small sample of 25 graduate students [S43]. A probability-weighting γ ≈ 0.65 is often cited [S45]. Field studies of professionals sometimes find lower λ [S45]; treat 2.25 as illustrative, not universal.
- **Why.** It is the root model for loss aversion, the disposition effect, the break-even effect and lottery-like trade preferences (holding far OTM "moonshots").
- **Mistakes.** Treating λ = 2.25 as a law of nature; thinking knowledge of the bias removes it.
- **Level** I · **Prereq** ST-01.
- **Sim.** "Choice lab": a series of paired gambles (sure gain vs gamble, sure loss vs gamble). The app estimates the learner's own λ and risk-seeking-in-losses tendency and then links it to their journal behaviour.

### PSY-02 Loss aversion
- **Def.** Losses weigh about twice as heavily as equal gains [S43].
- **Why.** In trading it shows up as refusing to take small losses (no stop, widening stops), which produces large losses.
- **Mistakes.** Over-correcting into fear-based early exits (which is also loss aversion: fear of giving back open profit).
- **Level** B · **Prereq** none.
- **Sim.** Detector: stop-widening events, time-to-close for losers vs winners, % of losses larger than −1.2R. Scenario: a trade drifts slowly toward the stop and the app records the learner's reaction.

### PSY-03 Disposition effect
- **Def.** The tendency to sell winners too soon and hold losers too long (Shefrin & Statman 1985 **[BK]**). Odean (1998) studied 10,000 discount-brokerage accounts and found realised gains at 14.8% vs realised losses at 9.8% outside December, i.e. PGR > PLR, which lowered returns [S41][S42].
- **Formula / example.** PGR = realised gains ÷ (realised + paper gains); PLR = realised losses ÷ (realised + paper losses). Disposition = PGR − PLR. In Odean's data, 0.148 − 0.098 = **0.05**.
- **Why.** It is directly measurable in the simulator and directly harms expectancy (cuts the right tail and fattens the left).
- **Mistakes.** Calling it "taking profits responsibly"; Odean found the behaviour was not explained by rebalancing or trading costs [S42].
- **Level** I · **Prereq** PSY-02.
- **Sim.** The app computes the learner's PGR/PLR each time they close any position while holding others; winners' vs losers' holding time histograms. **Score hook** (DQ): exits not justified by plan rules, split by winner/loser.

### PSY-04 Myopic loss aversion and evaluation frequency
- **Def.** Loss aversion combined with frequent evaluation makes risk feel larger. Benartzi & Thaler (1995) showed the equity premium is consistent with investors evaluating portfolios about once a year [S46].
- **Why.** Watching tick-by-tick P&L amplifies loss aversion and leads to over-management.
- **Mistakes.** P&L always on screen; checking open trades every minute.
- **Level** I · **Prereq** PSY-01.
- **Sim.** Toggle "hide money P&L, show only R and plan status". An experiment mode compares the learner's interventions with P&L visible vs hidden.

### PSY-05 House-money and break-even effects
- **Def.** After gains, people take more risk ("house money"); after losses, options that offer a chance to break even become especially attractive (Thaler & Johnson 1990) [S47].
- **Why.** They explain the post-win size creep and the post-loss "get it back" trade (revenge, PSY-18). Caveat: the original evidence came from hypothetical choices and small lab samples [S47].
- **Level** I · **Prereq** PSY-01.
- **Sim.** Detector: risk per trade conditional on the previous trade/day outcome (should be flat under fixed fractional). A chart of "risk after win" vs "risk after loss" bars.

### PSY-06 Overconfidence (miscalibration, better-than-average, overtrading)
- **Def.** Overestimating the precision of one's knowledge and skill. Barber & Odean link it to excessive trading: the highest-turnover households earned 11.4% vs the market's 17.9% (JF 2000 version) [S31][S32], and men traded about 45% more than women, cutting net returns by 2.65 pp/yr vs 1.72 pp for women [S33].
- **Formula / example.** Calibration score: of the statements you rated "90% sure", what % were right? Turnover as a proxy.
- **Why.** It is a driver of overtrading, oversizing and skipping risk controls.
- **Mistakes.** Mistaking a lucky streak for skill (PSY-23); later research argues rational adjustment costs could also explain some patterns [S32], which is a useful nuance for advanced learners.
- **Level** B → I · **Prereq** none.
- **Sim.** Calibration quizzes ("give a 90% range for tomorrow's synthetic close"); prediction log before trades with a confidence %; the app plots calibration curves over time.

### PSY-07 Illusion of control
- **Def.** Believing you influence outcomes that are mostly chance (Langer 1975 **[BK]**).
- **Why.** It leads to over-management of trades and superstition (lucky setups, rituals unrelated to process).
- **Level** B · **Prereq** ST-01.
- **Sim.** "Random market" mode where the price process has zero edge by construction; learners still find "patterns". The debrief reveals the random seed.

### PSY-08 Availability and recency bias
- **Def.** Judging probability by how easily examples come to mind (availability heuristic; Tversky & Kahneman 1974 [S55]); overweighting the latest outcomes.
- **Why.** After three losses on a setup, traders skip the fourth (which may be the winner); after a big news move, they overestimate repeat odds.
- **Mistakes.** Changing rules after a short streak (see PL-14).
- **Level** B · **Prereq** ST-06.
- **Sim.** Detector: probability of skipping a valid setup as a function of the outcome of the last 1–3 trades of that setup.

### PSY-09 Representativeness and the law of small numbers
- **Def.** Expecting small samples to resemble the population. Tversky & Kahneman (1971) found research psychologists expected about 85% replication success when the true probability was about 48% [S58][S59].
- **Why.** Learners "validate" setups on 10–20 trades.
- **Level** B → I · **Prereq** ST-05.
- **Sim.** "Guess the edge" game: the app shows 20 trades from a hidden system (some with zero edge) and the learner bets on which has an edge; the answers are revealed with CIs. Statistic for the debrief: a zero-edge system with sd 1.7R shows an average ≥ +0.4R over 30 trades about **10%** of the time.

### PSY-10 Gambler's fallacy and hot-hand fallacy
- **Def.** The gambler's fallacy expects a reversal after a streak in an independent process; the hot-hand fallacy expects continuation. In casino roulette data, after six spins of the same colour about 85% of bettors bet the other colour (secondary summary) [S56][S57]. Note: Miller & Sanjurjo later found a methodological flaw in the classic basketball "no hot hand" result, so streakiness is an empirical question [S56].
- **Why.** "I've lost 5 in a row, the next must win" (raising size) or "I'm on fire" (raising size) are both sizing errors.
- **Level** B · **Prereq** ST-06.
- **Sim.** Streak detector: size and frequency after streaks of k wins or losses. Coin-flip micro-game with deliberately streaky (independent) sequences.

### PSY-11 Confirmation bias
- **Def.** Seeking, interpreting and remembering information that supports an existing view (Nickerson 1998 **[BK]**).
- **Why.** It fuels holding losers ("the thesis is still intact") and selective journaling.
- **Mistakes.** Only reading sources that agree; no written invalidation criteria.
- **Level** B · **Prereq** none.
- **Sim.** Pre-trade form requires "what would prove me wrong?" (invalidation). A "devil's advocate" prompt lists counter-evidence from the synthetic news feed.

### PSY-12 Anchoring
- **Def.** Estimates are pulled toward an initial value, even an irrelevant one. In the classic wheel-of-fortune demonstration, estimates of the share of African countries in the UN were about 25% after seeing 10 and 45% after seeing 65 [S54][S55].
- **Why.** Anchoring to entry price ("I'll exit when it gets back to my price"), to a prior high, or to analyst targets.
- **Level** B · **Prereq** none.
- **Sim.** Scenario where the learner bought at a "high" anchor. Detector: exits clustered near the entry price after a drawdown (the break-even exit).

### PSY-13 Hindsight bias ("knew it all along")
- **Def.** After an outcome is known, people judge it as having been more predictable. Fischhoff (1975) called this "creeping determinism" [S53].
- **Why.** It destroys learning from reviews ("obviously that was a fake breakout") and fuels regret.
- **Mistakes.** Reviewing charts with the future visible.
- **Level** I · **Prereq** none.
- **Sim.** Reviews are done in **blind replay**: the chart is cut at the decision point and the learner re-grades the decision before the outcome is revealed. Pre-trade forecasts are stored and compared later.

### PSY-14 Outcome bias and "resulting"
- **Def.** Judging decision quality by its outcome. Baron & Hershey (1988) showed people rate identical decisions as better when outcomes are good [S60][S61]. Annie Duke calls this "resulting" [S62]. A 2023 pre-registered replication (n = 692) reproduced the effect, even among people who said outcomes should not count [S61].
- **Why.** It is the **core rationale of the app's scoring**: process scores counter outcome bias.
- **Level** B · **Prereq** none.
- **Sim.** Two-axis review matrix (process good/bad × outcome good/bad): deserved success, bad luck, dumb luck, poetic justice **[BK: Russo & Schoemaker framing]**. Learners classify their own trades and the app compares their classification with its process score.

### PSY-15 Sunk-cost effect
- **Def.** Continuing an endeavour because of past investment (Arkes & Blumer 1985) [S52].
- **Why.** Holding or adding to losers "because I've already lost so much"; adding margin to save a position (RF-18).
- **Level** B · **Prereq** none.
- **Sim.** "Fresh eyes" button: "if you were flat now, would you open this position at this size?" A No answer prompts an exit or reduction decision, which is logged.

### PSY-16 FOMO and attention-induced trading
- **Def.** Fear of missing out: entering late or off-plan because others or prices are moving. Barber, Huang, Odean & Schwarz found Robinhood herding into "top mover" stocks was followed by average 5-day abnormal returns of about −3% (−6% for extreme herding) [S39][S40].
- **Why.** Chasing extended moves worsens entries (larger stop distance, lower R potential) and violates the playbook.
- **Mistakes.** Watching leaderboards/social feeds while trading.
- **Level** B · **Prereq** PL-03.
- **Sim.** Synthetic "social feed" and "top movers" ticker that hypes moves. Detector: entries after an X×ATR move without a playbook setup; distance from the setup's trigger at entry.

### PSY-17 Herding and social proof
- **Def.** Following the crowd's actions rather than one's own information.
- **Why.** Crowded trades reverse; forum signals are survivorship-filtered (ST-11).
- **Level** I · **Prereq** PSY-16.
- **Sim.** Same as PSY-16, plus a "simulated chatroom" whose calls have zero edge by construction.

### PSY-18 Revenge trading
- **Def.** Trading to win back a recent loss, usually with bigger size, lower setup quality and shorter decision time. It is behaviourally rooted in the break-even effect (PSY-05) and anger.
- **Formula / example.** Detector = new entry within T minutes of a loss **and** (size > plan, or no setup tag, or same instrument re-entry).
- **Why.** It is the most common path from a normal losing day to a limit breach.
- **Level** B · **Prereq** PR-04.
- **Sim.** Post-loss "cool-down" timer (configurable) and a quick emotion check-in (1–5). Revenge detector events are shown on the equity curve. **Score hook** (RD): revenge-pattern count per 100 trades.

### PSY-19 Tilt
- **Def.** A (poker-derived) state where emotion overrides strategy, typically after bad beats or streaks; it shows as rule-breaking clusters.
- **Formula / example.** Tilt index (app-defined): rolling 10-trade count of rule violations, size deviations and off-plan trades; threshold triggers a pause.
- **Why.** Errors cluster, and catching the first one prevents the cascade.
- **Level** I · **Prereq** PSY-18, PL-09.
- **Sim.** Tilt meter on screen; automatic soft lock at threshold, with a recovery protocol (breathing / reflection / checklist) before unlock.

### PSY-20 Regret aversion, hesitation and missed trades
- **Def.** Avoiding action to avoid the regret of being wrong (errors of omission), or overreacting to regret after missing a move.
- **Why.** Hesitation on valid setups distorts the realised sample (you take the "easy-looking" losers and skip the scary winners).
- **Level** I · **Prereq** PL-03.
- **Sim.** "Missed trade" log: when a playbook setup triggers and the learner does not act, the app records it and its shadow outcome. KPI: execution rate on A-setups.

### PSY-21 Endowment and status quo bias
- **Def.** Valuing what you own more than what you don't; preferring no change.
- **Why.** Holding positions beyond their thesis.
- **Level** I · **Prereq** PSY-15.
- **Sim.** Same "fresh eyes" check as PSY-15.

### PSY-22 Mental accounting and narrow framing
- **Def.** Treating money differently by its source or bucket (e.g. "profits are play money") and evaluating each trade in isolation rather than as part of a series **[BK: Thaler]**; related to house money (PSY-05) [S47].
- **Why.** Mark Douglas's "thinking in probabilities" is essentially **broad framing**: one trade is one draw from a distribution [S63][S64].
- **Level** I · **Prereq** PSY-01.
- **Sim.** "Series view": the journal groups trades into blocks of 20 and shows block expectancy; single-trade P&L is de-emphasised.

### PSY-23 Self-attribution bias
- **Def.** Attributing wins to skill and losses to bad luck or external factors.
- **Why.** It blocks learning and inflates overconfidence.
- **Level** I · **Prereq** PSY-14.
- **Sim.** In reviews the learner rates "skill vs luck" for each trade *before* seeing the process score; the app compares the asymmetry between wins and losses.

### PSY-24 Action bias and boredom trading
- **Def.** Preferring to do something over waiting; trading to relieve boredom.
- **Why.** It produces off-plan trades in low-quality conditions.
- **Level** B · **Prereq** PL-03.
- **Sim.** Sessions with long no-setup periods; detector for entries without a setup tag during quiet regimes. "Sitting on hands" is rewarded in the process score.

### PSY-25 Emotional reactivity and performance
- **Def.** In Lo, Repin & Steenbarger (2005), 80 day-traders tracked over five weeks showed that those with more intense emotional reactions to gains **and** losses performed significantly worse. No specific "trader personality" emerged [S48].
- **Why.** It is empirical support for emotion regulation as a trainable skill.
- **Level** I · **Prereq** none.
- **Sim.** Optional daily mood/arousal check-in (1–5) and per-trade emotion tags; the monthly report correlates emotional intensity with rule adherence (not P&L).

### PSY-26 Physiology, stress hormones and arousal
- **Def.** Coates & Herbert (2008) sampled 17 London floor traders over 8 days and found that morning testosterone predicted daily profitability while cortisol rose with the variance of results and market volatility. The sample was small and short, and critics warn against over-interpretation [S49][S50]. Arousal-performance follows an inverted U (Yerkes–Dodson) **[BK]**.
- **Why.** Sleep, fatigue and stress are risk factors, and the plan should include "not fit to trade" criteria.
- **Level** I · **Prereq** PSY-25.
- **Sim.** Pre-session readiness check (sleep, stress, illness); low readiness auto-suggests reduced r or sim-only. **Score hook** (RD): trading at full risk despite self-reported low readiness.

### PSY-27 Emotion regulation strategies
- **Def.** Antecedent-focused regulation (preparation, reappraisal: "this loss is one draw from my distribution") acts before the emotion; response-focused regulation (suppression) acts after. In Fenton-O'Creevy et al. (2011, four London investment banks, qualitative), higher-performing traders relied more on antecedent-focused strategies [S51].
- **Why.** It gives concrete trainable techniques rather than "control your emotions".
- **Mistakes.** Suppression ("I feel nothing"), venting, avoidance (not looking at positions).
- **Level** I → A · **Prereq** PSY-25.
- **Sim.** Reappraisal prompts after losses (choose a reframe from a list or write one); pre-session if-then scripts (PL-06). The app tracks whether post-loss behaviour normalises faster over weeks.

### PSY-28 Routines, implementation intentions and habits
- **Def.** Fixed pre-, during- and post-session routines; "if X happens, then I do Y" plans (implementation intentions, Gollwitzer **[BK]**).
- **Why.** They reduce decision load and make rule-following automatic.
- **Level** B · **Prereq** PL-05.
- **Sim.** Routine builder with check-off; streaks are rewarded for completing routines (process), not for profit.

### PSY-29 Discipline as measurable rule adherence
- **Def.** The proportion of decisions that follow the written plan.
- **Formula / example.** Discipline score = 1 − (rule violations ÷ rule-relevant decisions). 3 violations over 60 decisions gives 95%.
- **Why.** It is the backbone of the Risk Discipline grade.
- **Level** B · **Prereq** PL-01.
- **Sim.** Live discipline score per session; violation types broken down (PL-09).

### PSY-30 Process vs outcome thinking
- **Def.** Evaluating decisions by information, reasoning and execution quality at the time, not by the result [S60][S62].
- **Why.** Short-term outcomes are dominated by variance (ST-05/06), so outcome-based learning teaches the wrong lessons.
- **Level** B · **Prereq** PSY-14.
- **Sim.** Every trade card shows the process grade first and the outcome second; monthly "good process, bad luck" trades are highlighted and celebrated.

### PSY-31 Probabilistic thinking (Mark Douglas)
- **Def.** Douglas argues consistency comes from thinking in probabilities, not predictions: an edge is a higher probability over a series, not a certainty on one trade [S63][S64].
- **Five fundamental truths** (wording from the book via secondary summaries; partly **[BK]**): (1) anything can happen; (2) you don't need to know what will happen next to make money; (3) there is a random distribution of wins and losses for any given set of variables that define an edge; (4) an edge is nothing more than an indication of a higher probability of one thing happening over another; (5) every moment in the market is unique.
- **Seven principles of consistency** **[BK; not confirmed by a fetched source]**: objectively identify your edges; predefine the risk of every trade; completely accept the risk or let go of the trade; act on edges without hesitation; pay yourself as the market makes money available; continually monitor susceptibility to errors; never violate these principles.
- **Why.** It is the psychological counterpart to expectancy and the law of large numbers.
- **Level** I · **Prereq** PM-03, ST-05.
- **Sim.** "20-trade block" mode: the learner commits to executing the next 20 setups exactly by the playbook; the app shows that the block result varies a lot while the process score stays controllable. Compare blocks across weeks.

### PSY-32 Deliberate practice
- **Def.** Effortful, structured practice targeting specific weaknesses with immediate feedback (Ericsson, Krampe & Tesch-Römer 1993). Steenbarger applies expertise-development and deliberate practice to trading [S66][S67][S68]. Caveat: a 2019 replication of the original violin study found a much smaller effect [S69].
- **Formula / example.** Practice loop: pick one skill (e.g. stop placement on pullbacks), do 50 reps in replay, get scored feedback, review errors, repeat.
- **Why.** The simulator is ideal for compressing years of repetitions into weeks, as drills rather than open-ended play.
- **Mistakes.** "Practising" by free-form sim trading with no specific target; measuring improvement by P&L.
- **Level** I → A · **Prereq** PL-11.
- **Sim.** Drill library (one skill per drill, 20–50 reps, instant scoring, spaced repetition); personal weakness queue generated from journal error tags.

### PSY-33 Goal-setting: process goals vs outcome goals
- **Def.** Process goals ("100% stops at entry this week") are controllable; outcome goals ("make 5% this month") are not. Steenbarger stresses turning journal observations into concrete goals for the next session [S65].
- **Why.** Outcome goals encourage oversizing near period ends.
- **Level** B · **Prereq** PSY-30.
- **Sim.** Weekly goal picker restricted to process goals; the app auto-measures completion.

### PSY-34 Confidence, self-efficacy and "trading scared"
- **Def.** Healthy confidence comes from evidence of executing the process; "trading scared" (skipping setups, undersizing after drawdowns) is the mirror image of overconfidence.
- **Why.** Both distort the realised sample.
- **Level** I · **Prereq** PSY-06, PSY-20.
- **Sim.** Execution rate and size accuracy tracked through drawdown periods; a dip triggers a coaching prompt.

### PSY-35 Ego, identity and the need to be right
- **Def.** Attaching self-worth to being right on individual trades.
- **Why.** It drives refusing to exit, arguing with the market and confirmation bias.
- **Level** I · **Prereq** PSY-11.
- **Sim.** Language analysis of journal notes is possible but optional; simpler is a reflection prompt "Was I trying to be right or trying to execute?"

### PSY-36 Premortem (prospective hindsight)
- **Def.** Before committing, imagine the project or trade *has failed* and list the reasons (Klein, HBR 2007) [S70].
- **Why.** It surfaces risks that confirmation bias hides; it is cheap to add to the pre-trade checklist or to a new system's launch.
- **Level** I · **Prereq** PSY-11.
- **Sim.** Optional premortem field on large-risk trades and mandatory for "go-live" of a new system (BT-21).

### PSY-37 Behavioural guard-rails (pre-commitment and choice architecture)
- **Def.** Designing the environment so the right action is easy: hard stops by default, daily lockouts, cool-down timers, size presets, hidden P&L.
- **Why.** Knowledge of biases alone does not remove them (PSY-14 replication [S61]); structure does.
- **Level** B → I · **Prereq** PSY-02, PR-04.
- **Sim.** The learner configures their own guard-rails in the plan; the app tracks which ones were triggered and overridden.

---
## 6. Trading plan, journaling and review

### PL-01 Trading plan: components
- **Def.** A written, versioned document that defines what, when, how and how much you trade, and what you do when things go wrong.
- **Components (checklist for the plan builder):**
  1. **Purpose and constraints**: why you trade, risk capital (RF-01), time available, sim vs live status.
  2. **Markets and sessions**: instruments, liquidity filters, trading hours, no-trade windows (events, PR-12).
  3. **Playbook**: list of setups (PL-03), each with an evidence status (untested / sim-tested / live-small / validated).
  4. **Entry rules**: trigger, order type (TM-01), scaling-in rules (TM-03).
  5. **Risk rules**: r per trade (RF-02), sizing model (RF-08…12), max heat (PR-01), correlation/exposure caps (PR-02/03).
  6. **Exit rules**: initial stop logic (RF-06), targets, trailing, partials, BE, time stops (TM-05…09).
  7. **Limits and circuit breakers**: daily, weekly and monthly loss limits (PR-04/05), max trades per day, DD tiers (PR-08), cool-down after loss (PSY-18).
  8. **Routines**: pre-market (PL-05), in-session, post-session (PL-08).
  9. **Journal and review schedule**: fields (PL-07), daily, weekly and monthly reviews (PL-10…12).
  10. **Fitness-to-trade criteria**: sleep, stress, illness (PSY-26).
  11. **Contingencies**: platform failure, connectivity, unexpected gap; who and what to call.
  12. **Rule-change protocol**: how changes are proposed, tested and versioned (PL-14).
  13. **Process goals and KPIs** (PM-17, PSY-33).
- **Why.** The plan is the reference against which Decision Quality and Risk Discipline are measured. Without it there is nothing to adhere to.
- **Mistakes.** Plans that are vague ("trade with the trend"), too long to follow, never versioned, or rewritten after every loss.
- **Level** B (v1 simple) → I (full) · **Prereq** RF-02, RF-07.
- **Sim.** Guided plan builder with templates; the plan's numeric rules are compiled into simulator guard-rails (limits, heat caps, stop requirement). Plan versions are stored and diffed.

### PL-02 Process goals and outcome expectations
- **Def.** Process goals are controllable; outcome expectations should be **ranges** derived from statistics (e.g. a Monte Carlo band) [S82][S84].
- **Formula / example.** "At 1% risk on the reference system, a 15% drawdown is within the normal 95% range (RF-10 table)."
- **Why.** Realistic expectation ranges stop traders abandoning valid systems in normal drawdowns.
- **Level** I · **Prereq** BT-13.
- **Sim.** The plan shows an "expected corridor" for equity; the live curve is overlaid to show when you are outside normal variance.

### PL-03 Playbook (setup cards)
- **Def.** One card per setup: name, market context/regime, trigger, invalidation/stop logic, targets and management, re-entry rules, examples (screenshots), stats (n, win rate, avg R, MAE/MFE), and A/B/C quality criteria.
- **Why.** Setup-level statistics are the unit of improvement, and "no card, no trade" kills impulsive trades.
- **Mistakes.** Too many setups at once; cards without invalidation; stats not split by setup.
- **Level** B → I · **Prereq** PL-01.
- **Sim.** The order ticket requires choosing a setup card; untagged trades are allowed but scored as off-plan. Each card auto-builds its own statistics page.

### PL-04 Pre-trade checklist (go/no-go)
- **Def.** A short, binary checklist completed before each order (aviation/surgery-style checklists **[BK: Gawande]**).
- **Example items:** setup card matches? stop at invalidation? size computed and ≤ r? heat after the trade ≤ cap? event within X minutes? daily limit status OK? emotional state ≤ 3/5 arousal? premortem done for large trades?
- **Why.** It moves Decision Quality checks to the moment of decision.
- **Mistakes.** Checklists that are too long get skipped, so keep them to 5–9 items; ticking boxes without reading.
- **Level** B · **Prereq** PL-01, PL-03.
- **Sim.** Checklist modal on order entry (configurable). **Score hook** (DQ): completion and correctness (the app verifies the objective items itself).

### PL-05 Pre-market routine
- **Def.** A fixed preparation sequence: review overnight action, economic calendar, key levels, regime classification, scenario plans (if-then), watchlist, max risk for the day, readiness check.
- **Why.** Antecedent-focused regulation (PSY-27) and fewer surprises.
- **Level** B · **Prereq** PL-01.
- **Sim.** A "session start" ritual screen; the synthetic market releases a calendar and a context briefing, and the learner writes 2–3 if-then scenarios before the market opens.

### PL-06 Scenario planning (if-then plans)
- **Def.** Pre-written conditional responses: "If price breaks and holds above X, then I take setup A with stop Y; if the event surprises, then I stand aside for 15 minutes."
- **Why.** It turns in-the-moment judgement into recognition (PSY-28).
- **Level** I · **Prereq** PL-05.
- **Sim.** Scenarios are stored; after the session the app marks which triggered and whether the learner followed them.

### PL-07 Trade journal: fields
- **Def.** A structured record of each decision.
- **Quantitative fields:** timestamp, instrument, setup tag, direction, entry/stop/target, size, planned R ($ and %), heat after entry, actual exit(s), R-multiple, MAE/MFE (auto), costs, holding time, rule-check results.
- **Qualitative fields:** thesis, invalidation, emotion before/after (1–5), confidence %, screenshots (entry, exit), process grade (A–F), error tags (PL-09), lesson (one sentence).
- **Why.** The journal is the data set for every metric in §4 and every review in §6.
- **Mistakes.** Journaling only losers or only winners [S65]; free-text only (not analysable); journaling days later (hindsight, PSY-13).
- **Level** B · **Prereq** RF-04.
- **Sim.** Auto-journal (quant fields filled by the simulator) plus a 30-second qualitative prompt at close. **Score hook** (DQ): journal completeness and latency.

### PL-08 Post-trade review (immediate)
- **Def.** A brief review right after exit: was the trade in the playbook, executed to plan, sized correctly, managed per rules? Assign a **process grade independent of outcome**.
- **Why.** It counters outcome bias (PSY-14) while memory is fresh.
- **Level** B · **Prereq** PL-07.
- **Sim.** Grade the process first, then reveal P&L and the app's own process grade; the gap between them trains self-assessment calibration.

### PL-09 Error taxonomy and error tagging
- **Def.** A fixed list of process errors to tag trades, enabling an "error cost" metric.
- **Suggested taxonomy:**
  - **E-SETUP**: trade without a playbook setup / FOMO entry.
  - **E-SIZE**: size deviates from plan by more than 10%.
  - **E-STOP-NONE**: no stop at entry.
  - **E-STOP-WIDEN**: stop moved away.
  - **E-EXIT-EARLY**: exit before any rule triggered (fear).
  - **E-EXIT-LATE**: ignored an exit rule (hope).
  - **E-AVG-DOWN**: added to a loser.
  - **E-REVENGE**: re-entry within T minutes after a loss at bigger size.
  - **E-LIMIT**: traded beyond a daily/weekly limit.
  - **E-EVENT**: ignored the event policy.
  - **E-HEAT**: exceeded the heat cap.
  - **E-CHASE**: entry more than X ATR from the trigger.
  - **E-JOURNAL**: no journal entry.
- **Formula / example.** Error cost = Σ R of tagged trades − Σ R of the same trades replayed with rules (counterfactual). E.g. "E-STOP-WIDEN cost −6.4R this month."
- **Why.** It separates **mistakes** (process) from **variance** (cost of doing business).
- **Level** B → I · **Prereq** PL-07.
- **Sim.** Auto-detection for objective errors (most of the list) plus self-tagging for subjective ones (E-EXIT-EARLY). The monthly Pareto chart of error costs drives drill selection (PSY-32).

### PL-10 Daily review / end-of-session report card
- **Def.** A 5–10 minute review: process KPIs for the day, best and worst decision (not trade), one lesson, readiness for tomorrow.
- **Why.** It closes the loop and supports emotional decompression.
- **Level** B · **Prereq** PL-08.
- **Sim.** Auto-generated report card with process grade, error tags, limits status and a prompt for one lesson.

### PL-11 Weekly review
- **Def.** Statistics by setup, time of day, instrument and error tag; the equity curve against the expected corridor; one process goal for next week. Steenbarger's advice: turn the observation into a specific goal, and also log what went *right* (a "best practices" journal) [S65].
- **Level** I · **Prereq** PL-10, PM-03.
- **Sim.** Weekly review wizard; the goal chosen becomes a tracked KPI.

### PL-12 Monthly and quarterly review
- **Def.** Deeper analysis: R distribution, MAE/MFE, setup expectancy with CIs, drawdown vs Monte Carlo band, KPI trends, plan-change proposals.
- **Why.** Larger samples allow tentative conclusions; it is the point where rules may change (PL-14).
- **Level** I → A · **Prereq** PL-11, PM-13, BT-13.
- **Sim.** Monthly report: setup league table with confidence intervals, error Pareto, discipline trend, and a "proposed changes" form.

### PL-13 KPIs: a balanced set
- **Process (graded):** plan adherence, risk accuracy, stop integrity, limit and heat compliance, checklist completion, journal completeness, error cost, execution rate on A-setups (PM-17).
- **Outcome (diagnostic, with CIs):** expectancy, win rate, payoff, PF, MDD, SQN, Sharpe/Sortino (§4).
- **Behavioural:** disposition (PGR−PLR), risk-after-loss ratio, revenge events, tilt index, time-to-close losers vs winners (§5).
- **Level** I · **Prereq** §4, §5.
- **Sim.** KPI dashboard; outcome KPIs greyed out until n ≥ 30 (with explicit "not enough data" badges).

### PL-14 Rule-change governance
- **Def.** Rules change only through a documented process: hypothesis → evidence threshold (e.g. ≥ 30–50 trades or a backtest/walk-forward, BT-10/11) → test in simulator → versioned plan update.
- **Why.** It prevents recency-driven rule-hopping (PSY-08) and overfitting your own plan.
- **Mistakes.** Changing stops after three losses; adding filters to remove last week's losers (data snooping on yourself, BT-08).
- **Level** I → A · **Prereq** PL-12, BT-09.
- **Sim.** Plan version history with change rationale and attached evidence; the app shows the before/after performance of each change with CIs.

### PL-15 Mistake vs variance classification
- **Def.** For each losing trade: was it a valid trade that lost (variance) or a process error (mistake)?
- **Why.** Only mistakes are fixable; variance is accepted (Douglas's "accept the risk" [S63]).
- **Level** B · **Prereq** PL-08.
- **Sim.** Two-bucket sorter in the daily review; the app shows the proportion of losses that were "clean".

### PL-16 Blind replay review and screenshot discipline
- **Def.** Reviewing decisions with the future hidden; standard screenshots at entry and exit.
- **Why.** It counters hindsight bias (PSY-13).
- **Level** I · **Prereq** PL-08.
- **Sim.** Built-in replay that stops at the decision bar; the learner re-decides and the result is compared with the original choice.

### PL-17 Accountability and peer/mentor review
- **Def.** Sharing journals or KPIs with a mentor or peer group for external review.
- **Why.** External review reduces self-attribution bias (PSY-23).
- **Level** I · **Prereq** PL-11.
- **Sim.** Shareable review packs (anonymised) and cohort leaderboards **on process KPIs only**.

---

## 7. Backtesting and system design

> Workflow: **hypothesis → rules → data → test → validation → incubation → live small → scale**. Each stage has gates the learner must pass in the app.

### BT-01 Edge hypothesis (why should this work?)
- **Def.** A falsifiable statement of a market inefficiency or risk premium and who is on the other side.
- **Example.** "After volatility compression, breakouts in the direction of the higher-timeframe trend continue more often than random, because stop-orders cluster beyond the range."
- **Why.** A story-first approach reduces data mining; strategies with no rationale are more likely to be overfit [S91].
- **Mistakes.** Starting from indicator optimisation; post-hoc stories.
- **Level** I · **Prereq** PM-03.
- **Sim.** The "research notebook" requires a hypothesis statement before any backtest can be run.

### BT-02 Rule specification (objective, codifiable)
- **Def.** Rules precise enough that two people (or code) produce identical trades.
- **Why.** Ambiguous rules make backtests unreplicable and invite hindsight.
- **Level** I · **Prereq** BT-01.
- **Sim.** Rule builder (no-code blocks: condition, trigger, stop, exit, sizing); the app flags rules that reference future data (BT-06).

### BT-03 Data quality and preparation
- **Def.** Clean, appropriately adjusted, point-in-time data with correct timezone, bid/ask awareness and contract rolls.
- **Why.** Garbage in, garbage out; survivorship (BT-07) and look-ahead (BT-06) often enter through data.
- **Level** I → A · **Prereq** BT-02.
- **Sim.** Synthetic data sets with deliberately planted issues (missing bars, bad ticks, unadjusted splits, delisted instruments) for "spot the problem" drills.

### BT-04 Execution and fill assumptions
- **Def.** How signals become fills: same-bar close vs next-bar open, intrabar ambiguity (stop and target in the same bar), limit fill rules (touch vs trade-through), partial fills.
- **Example.** "If stop and target are both inside the same bar, assume the stop hit first" (conservative).
- **Level** A · **Prereq** TM-01.
- **Sim.** Toggle fill assumptions and watch expectancy change; a "worst-case intrabar" option.

### BT-05 Costs and slippage modelling
- **Def.** Spread, commission, financing, slippage (fixed, % of ATR, volume-share) and market impact (impact often modelled as growing with the square root of order size relative to volume; parameters are venue-specific) [S112][S113][S114].
- **Formula / example.** Gross expectancy 0.15R minus costs 0.10R per trade leaves **0.05R net (−67%)**. Default retail backtest settings can understate friction severely for illiquid instruments [S112].
- **Why.** For high-turnover strategies, realistic costs often erase the whole edge [S112].
- **Mistakes.** Zero-cost backtests; constant spread through news; ignoring swap on multi-day holds.
- **Level** I → A · **Prereq** RF-21.
- **Sim.** Cost-sensitivity slider (0×, 1×, 2×, 3× costs) on every backtest report; "breakeven cost" (the cost at which expectancy hits 0) is displayed.

### BT-06 Look-ahead bias
- **Def.** Using information not available at decision time, e.g. "using tomorrow's prices to trade today" or using a day's high/low before the day ends [S79].
- **Why.** It inflates backtests dramatically and is often invisible in results.
- **Level** I · **Prereq** BT-02.
- **Sim.** "Bug hunt" drills: backtests with planted look-ahead; the learner must find the line. The rule builder warns on same-bar close references with same-bar execution.

### BT-07 Survivorship bias
- **Def.** Testing only on instruments that exist today, excluding delisted or failed ones [S79].
- **Example.** Chan's example: a "buy the cheapest stocks in the index" strategy needs the historical index membership, not today's [S79].
- **Why.** It inflates returns, especially for mean-reversion and value-type rules.
- **Level** I · **Prereq** BT-03.
- **Sim.** The synthetic universe includes instruments that "delist"; the learner runs the test on survivors only vs the full universe and compares.

### BT-08 Data snooping and multiple testing
- **Def.** Reusing the same data for many tests makes the best result look significant by chance. White's Reality Check (Econometrica 2000) tests whether the best of many rules beats a benchmark after accounting for the whole search [S89]. Sullivan, Timmermann & White (1999) applied it to a much larger rule universe on 100 years of DJIA data: the best rules looked strong in the original sample, but the apparent edge did not carry into the later out-of-sample period [S89][S90] (period detail **[BK]**).
- **Why.** Every parameter tweak is another trial, so the number of trials must be recorded (BT-19).
- **Mistakes.** Not counting discarded trials; "torturing the data until it confesses".
- **Level** A · **Prereq** ST-09, BT-10.
- **Sim.** "Monkey lab": the learner generates N random strategies on pure-noise synthetic data and sees the best one's impressive backtest, then its OOS collapse.

### BT-09 Overfitting (curve fitting) and degrees of freedom
- **Def.** A model that targets particular observations rather than general structure (Bailey et al.) [S91]; too many parameters relative to independent data.
- **Formula / example.** Bailey et al.: with only N = 10 independent configurations of a zero-edge strategy, the expected best in-sample (annualised, 1-year) Sharpe is ≈ **1.57**, despite a true SR of 0 [S91]. Rules of thumb: few parameters (3–5 optimised at most [S87]); many trades per parameter.
- **Why.** It is the #1 reason backtests fail live.
- **Mistakes.** Optimising every input; adding filters to remove specific losing trades (data snooping) [S91].
- **Level** A · **Prereq** BT-08.
- **Sim.** "Complexity slider": add parameters/filters and watch the IS Sharpe rise while the OOS Sharpe falls (classic bias-variance chart on synthetic data).

### BT-10 In-sample / out-of-sample (hold-out)
- **Def.** Develop on IS data; evaluate once on untouched OOS data.
- **Why.** It is the first line of defence. Bailey et al. note hold-out alone is unreliable when the researcher has seen the full sample or runs many trials [S91][S93].
- **Mistakes.** Peeking at OOS and re-optimising (it becomes IS); OOS too short to mean anything (PM-07 CI).
- **Level** I · **Prereq** BT-02.
- **Sim.** The app locks the OOS segment; the learner gets **one** OOS "unlock" per hypothesis, and further unlocks are logged as additional trials.

### BT-11 Walk-forward analysis (Pardo)
- **Def.** Repeated optimise-then-test windows: tune on window k, trade the next unseen segment, roll forward, and concatenate OOS segments [S80][S81].
- **Formula / example.** Walk-forward efficiency WFE = annualised OOS return ÷ annualised IS return; ≥ 0.5 is a common "respectable" rule of thumb (not a standard) [S80]. *Anchored* windows keep the start fixed (stability); *rolling* windows drop old data (adaptation); neither is uniformly better [S80][S81].
- **Why.** It simulates how the system would actually be re-optimised in real life. Wildly jumping optimal parameters between windows signal fitting to noise [S80].
- **Mistakes.** Optimising the walk-forward settings themselves (meta-overfitting); too-short OOS windows.
- **Level** A · **Prereq** BT-10.
- **Sim.** Walk-forward visualiser: a timeline of IS/OOS windows, the chosen parameters per window (stability chart), the stitched OOS equity and the WFE.

### BT-12 Time-series cross-validation, purging and embargo
- **Def.** K-fold CV adapted to time series: remove ("purge") training observations whose labels overlap the test period and add an "embargo" gap after the test fold; combinatorial purged CV generates many backtest paths **[BK: López de Prado, *Advances in Financial Machine Learning*, 2018]**.
- **Why.** Standard CV leaks future information in serially correlated financial data.
- **Level** E · **Prereq** BT-10, BT-11.
- **Sim.** Fold diagram with leakage highlighting; toggle purge/embargo and see the inflated vs honest scores.

### BT-13 Monte Carlo simulation of trade sequences
- **Def.** Generate many alternative equity paths from the trade list: **reshuffle** (same trades, new order, so the same net profit with a different drawdown) or **bootstrap** (sample with replacement, so both profit and drawdown vary) [S82][S83]. Variants: randomly skip trades, perturb costs/slippage.
- **Formula / example.** Reference system (40 × +2.5R, 60 × −1R, 10,000 reshuffles): max DD median **8.5R**, 90th pct 12R, 95th pct **13.5R**, 99th pct 17R. At 1% risk, plan for about a 13–15% drawdown, not the single backtest number. Practitioners size from the 95th-percentile DD [S84].
- **Why.** It turns one historical path into a distribution, which sets realistic expectations (PL-02) and DD rules (PR-08).
- **Mistakes.** MC cannot create an edge that the trades don't have, and it inherits unrealistic execution assumptions [S82]; reshuffling destroys real autocorrelation (block bootstrap helps **[BK]**).
- **Level** I → A · **Prereq** PM-03, PR-06.
- **Sim.** Fan chart of 1,000 paths with percentile bands; histogram of max DD and longest losing streak; the learner's real path is overlaid.

### BT-14 Robustness testing
- **Def.** Checking that results survive reasonable perturbations: other markets/timeframes, noise added to prices, randomised start dates, cost stress, parameter neighbourhoods, removing the top trades.
- **Why.** A robust edge degrades gracefully; a fitted one collapses.
- **Level** A · **Prereq** BT-09.
- **Sim.** "Stress battery" one-click report: a pass/fail matrix across perturbations.

### BT-15 Parameter sensitivity (plateaus vs peaks)
- **Def.** Mapping performance across parameter values: prefer broad plateaus over isolated peaks (Pardo's view) [S87][S88]. Kaufman suggests stepping parameters in **percentage** increments rather than absolute ones (absolute steps bias toward longer periods) [S86].
- **Formula / example.** MA length tested at 10, 11, 12… vs 10, 11, 12.1, 13.3… (10% steps).
- **Level** A · **Prereq** BT-09.
- **Sim.** Interactive heat map (2 parameters) or 3D surface; the learner must choose a parameter set and the app scores whether it sits on a plateau (neighbourhood average ≥ X% of its value).

### BT-16 Random and naive benchmarks
- **Def.** Compare the strategy against random entries with the same exits/holding period, buy-and-hold, and simple rules.
- **Why.** It separates entry edge from exit or market drift (see the e-ratio, TM-18).
- **Level** I → A · **Prereq** BT-10.
- **Sim.** Every backtest auto-runs 1,000 random-entry twins; the report shows the strategy's percentile among them.

### BT-17 Statistical significance and multiple-testing corrections
- **Def.** Test whether results beat chance after accounting for all trials: t-tests/bootstrap (PM-13), White's Reality Check and Hansen's SPA [S89], Harvey & Liu's Sharpe "haircut" [S96], DSR (BT-19), PBO (BT-20).
- **Formula / example.** Harvey & Liu: a t-ratio of 3.0 that would be strong for one test can drop to about 2.0 after multiple-testing adjustment in their example; the haircut is nonlinear (marginal Sharpe ratios are penalised heavily, high ones moderately), and a flat 50% haircut is only a rule of thumb [S96].
- **Level** E · **Prereq** PM-13, BT-08.
- **Sim.** "Significance calculator": inputs are Sharpe, length and number of trials; outputs are naive p, Bonferroni-adjusted p **[BK]** and the haircut Sharpe.

### BT-18 Minimum backtest length (MinBTL)
- **Def.** The backtest length needed so that the best of N zero-edge configurations is not expected to show a given Sharpe by luck (Bailey, Borwein, López de Prado & Zhu 2014) [S91].
- **Formula / example.** E[max_N] ≈ (1−γ)·Z⁻¹(1 − 1/N) + γ·Z⁻¹(1 − 1/(N·e)), γ ≈ 0.5772 (Euler–Mascheroni); MinBTL ≈ (E[max_N] ÷ target SR)² years, with the upper bound 2·ln(N)/SR² [S91]. Examples from the paper: with 5 years of data, **no more than 45** independent configurations should be tried before an IS Sharpe of 1 is expected by chance; after only **7** configurations, a 2-year backtest is expected to show a Sharpe of 1 with zero true edge [S91]. Recomputed here: N = 100 needs about 6.4 years and N = 1,000 about 10.6 years.
- **Why.** "A backtest which does not report the number of trials … makes it impossible to assess the risk of overfitting" [S91].
- **Level** E · **Prereq** BT-09, PM-07.
- **Sim.** Trial counter in the research notebook (every run counts) and a MinBTL gauge that turns red when the data length is too short for the number of trials so far.

### BT-19 Deflated Sharpe Ratio (DSR) and Probabilistic Sharpe Ratio (PSR)
- **Def.** PSR is the probability that the true Sharpe exceeds a benchmark, given sample length, skewness and kurtosis. DSR is the PSR with the benchmark raised to the expected maximum Sharpe among N trials, correcting for selection bias and non-normal returns (Bailey & López de Prado 2014, *JPM* 40(5)) [S94][S95].
- **Formula / example.** PSR(SR*) = Φ[(SR̂ − SR*)·√(T−1) ÷ √(1 − γ₃·SR̂ + ((γ₄−1)/4)·SR̂²)] **[BK formula form]**; DSR uses SR* = expected max Sharpe from N trials (the same extreme-value formula as BT-18, scaled by the cross-sectional standard deviation of the trial Sharpe ratios) [S95]. A common convention flags DSR < 0.95 as a possible fluke (convention, not part of the derivation) [S95]. Sharpe ratios must be in the native (non-annualised) frequency for the formula [S95].
- **Why.** It is the honest "is my best backtest real?" number.
- **Level** E · **Prereq** BT-18, ST-04 (skew/kurtosis).
- **Sim.** DSR calculator wired to the trial log; shows naive Sharpe → PSR → DSR side by side.

### BT-20 Probability of Backtest Overfitting (PBO) via CSCV
- **Def.** The probability that the configuration chosen as best in-sample performs below the median out-of-sample, estimated with combinatorially symmetric cross-validation (Bailey, Borwein, López de Prado & Zhu, *J. Computational Finance* 2017) [S92][S93].
- **Procedure.** Build a T × N matrix of returns for N trials; split rows into S equal blocks; for every combination of S/2 blocks as IS (the rest OOS), pick the best IS trial and record its OOS relative rank ω; logit λ = ln(ω/(1−ω)); PBO = share of combinations with λ ≤ 0 **[BK details; paper confirmed]**. An R package (`pbo`) implements it [S93].
- **Why.** It gives a model-free, nonparametric overfitting estimate for the whole research process.
- **Level** E · **Prereq** BT-11, BT-18.
- **Sim.** CSCV visualiser: block grid, combinations animation, and a histogram of λ with the PBO area shaded.

### BT-21 Incubation: paper trading → small live → scale
- **Def.** A staged deployment: forward-test in sim (no hindsight) → live at minimal size → scale in steps, each gated by statistics.
- **Formula / example.** Gate: after 50 forward trades, expectancy inside the MC 5–95% band of the backtest and the process KPIs ≥ targets, then size ×2. Kill switch: drawdown > MC 99th percentile, or expectancy CI entirely below 0.
- **Why.** Execution, psychology and costs only appear live; small size limits the tuition fee.
- **Mistakes.** Skipping incubation after a great backtest; judging the go-live on 10 trades.
- **Level** I → A · **Prereq** BT-13, PL-14.
- **Sim.** The app's own progression: the "live-small" analogue is a separate virtual account with stricter rules; promotion requires process KPIs, never P&L alone.

### BT-22 Regime change, strategy decay and the adaptive markets view
- **Def.** Market behaviour changes (volatility, trend/mean-reversion, liquidity); edges decay as they are discovered. McLean & Pontiff (JF 2016) found 97 published predictors' returns were **26% lower out-of-sample and 58% lower post-publication** [S117][S118]. Lo's Adaptive Markets Hypothesis frames efficiency as varying with environment and participants [S116][S115].
- **Why.** "It worked for 10 years" is not a guarantee, so plans need retirement and re-validation rules.
- **Mistakes.** Abandoning a system in a normal drawdown (confusing variance with decay), or never abandoning one.
- **Level** A · **Prereq** BT-13, ST-07.
- **Sim.** The synthetic generator has switchable regimes (trend, range, high-vol, low-vol) with hidden switch points; learners segment performance by regime and design regime filters, then test whether filters survive OOS.

### BT-23 Separate signal from sizing; test in R first
- **Def.** Evaluate edge in R-multiples with fixed risk; add position sizing afterwards (RF-08).
- **Why.** Compounding and sizing can make weak edges look strong (or hide strong ones).
- **Level** I · **Prereq** RF-04, RF-10.
- **Sim.** Backtest reports default to R; a sizing layer is applied in a separate tab.

### BT-24 Capacity, liquidity and execution realism
- **Def.** How much size the strategy can absorb before impact erodes the edge.
- **Level** E · **Prereq** BT-05.
- **Sim.** Synthetic order book depth; the learner scales size and watches impact grow (square-root law illustration [S112]).

### BT-25 Simplicity and research hygiene (research log)
- **Def.** Prefer fewer rules; log every hypothesis, test and parameter change (needed for N in DSR/MinBTL).
- **Why.** Bailey et al.: without reporting N, overfitting risk cannot be assessed [S91].
- **Level** A · **Prereq** BT-18.
- **Sim.** Immutable research log; reports display "trials to date: N".

---
## 8. Statistics literacy for traders

### ST-01 Probability, random variables and expected value
- **Def.** A trade outcome is a random variable; expected value (EV) is its probability-weighted average.
- **Formula / example.** EV = Σ pᵢ·xᵢ. Reference system: 0.4 × 2.5 + 0.6 × (−1) = +0.4R.
- **Why.** It is the foundation for expectancy (PM-03), Kelly (RF-13) and Douglas's probabilistic mindset (PSY-31).
- **Mistakes.** Confusing a likely outcome with the expected outcome; ignoring small probabilities of large losses.
- **Level** B · **Prereq** none.
- **Sim.** Dice/coin "trade machine" with adjustable probabilities and payoffs; the learner predicts EV, then runs 1,000 trials.

### ST-02 Distributions: mean, median, standard deviation, shape of R
- **Def.** The distribution of trade results; trend-following R distributions are typically **positively skewed** (many small losses, few big wins) while mean-reversion and short-option styles are **negatively skewed** (many small wins, rare big losses) **[BK]**.
- **Formula / example.** Reference system: mean +0.4R, median −1R (most trades lose!), sd ≈ 1.71R.
- **Why.** Skew determines the psychological experience of a system and which biases bite (e.g. positive skew means long losing streaks, inviting PSY-08).
- **Level** B → I · **Prereq** ST-01.
- **Sim.** R histogram for the learner's trades and for three archetype systems; "which system would you stick with?" debrief.

### ST-03 Variance, volatility and square-root-of-time scaling
- **Def.** Variance is the average squared deviation; volatility is its square root; for IID returns, σ scales with √t.
- **Formula / example.** Daily σ 1% gives annual ≈ 1% × √252 ≈ 15.9%. Daily SR × √252 = annual SR (only under IID, per Lo [S97]).
- **Why.** It underlies ATR stops (RF-06), sizing (RF-12), VaR (PR-13) and Sharpe (PM-07).
- **Mistakes.** √t scaling with autocorrelated returns [S97]; using a too-short window.
- **Level** I · **Prereq** ST-02.
- **Sim.** Synthetic random walks with a volatility knob; overlay the √t cone and see how often price leaves it.

### ST-04 Fat tails, skewness and kurtosis
- **Def.** Market returns have more extreme moves than a normal distribution predicts. Mandelbrot (1963) found cotton price changes were non-Gaussian, with a stable-distribution tail parameter of about 1.7 (Gaussian = 2); Fama found the same long tails in the Dow 30 stocks; whether variance is infinite is disputed [S119].
- **Formula / example.** Excess kurtosis > 0 means fat tails. A normal model says a 5σ daily move should be essentially never seen in a human lifetime, yet such moves recur in market history **[BK]**.
- **Why.** Stops gap, VaR under-estimates (PR-13), Kelly over-sizes (RF-13), and Sharpe flatters negatively skewed strategies (PM-07).
- **Level** I → A · **Prereq** ST-02.
- **Sim.** Toggle the synthetic generator between normal and fat-tailed (Student-t / jump) innovations; compare the frequency of k-σ moves and stop-gap losses.

### ST-05 Sampling error, standard error and confidence intervals; law of large numbers
- **Def.** Sample statistics vary around true values; SE = sd/√n for means and √(p(1−p)/n) for proportions; averages converge as n grows.
- **Formula / example.** Win rate 60% on 20 trades gives a 95% CI of **38.5%–81.5%**; on 100 trades, 50.4%–69.6%. Expectancy of the reference system at n = 100: CI ≈ +0.06R to +0.74R.
- **Why.** "How many trades before I know?" is answered here, and it is the mathematical basis of the process-over-profit philosophy.
- **Level** B → I · **Prereq** ST-02.
- **Sim.** CI ribbon that tightens as the learner's trade count grows; "trades needed" estimator.

### ST-06 Streaks and runs
- **Def.** Losing (and winning) streaks are normal in independent sequences, and longer than intuition expects.
- **Formula / example.** Expected longest losing run ≈ ln(n) ÷ ln(1/q), with q = loss probability (an approximation; sources differ [S120][S121][S122]). Exact probabilities (computed for this file) of **at least one run of ≥ k losses in 100 trades**:

| Win rate | k = 5 | k = 6 | k = 8 | k = 10 | k = 12 | ≈ longest run |
|---|---|---|---|---|---|---|
| 60% | 45.9% | 21.2% | 3.6% | 0.6% | 0.1% | 5 |
| 50% | 81.0% | 54.6% | 17.0% | 4.4% | 1.1% | 6.6 |
| 40% | 97.6% | 87.3% | 49.0% | 20.5% | 7.7% | 9 |
| 30% | 99.9% | 99.0% | 85.8% | 58.0% | 32.9% | 12.9 |

  Over 500 trades at a 40% win rate, P(run ≥ 10) = 70.5% and P(run ≥ 12) = 35.1%. With 6 trades/day at 40%, P(≥ 3 losses in a row on a given day) ≈ 47.5%.
- **Why.** It sizes daily limits (PR-04) and r (RF-02), and it inoculates against the gambler's fallacy and abandoning systems (PSY-08/10).
- **Mistakes.** Assuming independence when outcomes cluster (regimes) [S121]; using a backtest's single longest streak as the worst case [S121].
- **Level** B → I · **Prereq** ST-01.
- **Sim.** Streak simulator: pick win rate and n; the app shows the distribution of the longest losing run; the learner's own streaks are plotted against it.

### ST-07 Regression to the mean
- **Def.** Extreme results tend to be followed by more average ones when outcomes contain noise.
- **Formula / example.** A setup that returned +1.5R/trade over its first 15 trades (true edge +0.3R) is likely to look much worse over the next 15. That is regression, not "the market changed".
- **Why.** It explains post-hot-streak disappointment, the "Sports Illustrated jinx" of trading competitions, and why selected best strategies underperform OOS (BT-09, BT-22).
- **Level** I · **Prereq** ST-05.
- **Sim.** "Rookie of the year" game: rank 50 random-skill synthetic traders on month 1 and watch the top decile in month 2.

### ST-08 Correlation, causation and spurious relationships
- **Def.** Correlation measures linear co-movement; it does not imply causation; with many variables, spurious correlations are guaranteed.
- **Why.** It is relevant to portfolio risk (PR-02) and to indicator "discoveries" (BT-08).
- **Level** I · **Prereq** ST-02.
- **Sim.** Generator of random series; the learner searches for "predictive" pairs and then tests them on new draws.

### ST-09 Hypothesis testing, p-values and multiple comparisons
- **Def.** A p-value is the probability of data at least this extreme if there were no edge; testing many hypotheses inflates false positives.
- **Formula / example.** 20 independent zero-edge strategies at α = 0.05 give P(at least one "significant") = 1 − 0.95²⁰ = **64%**. Corrections: Bonferroni α/N **[BK]**, Reality Check/SPA [S89], Harvey & Liu haircut [S96], DSR [S94].
- **Why.** It is the statistical backbone of backtest validation (§7).
- **Level** A · **Prereq** ST-05.
- **Sim.** "p-hacking arcade": the learner is rewarded for finding a significant strategy on noise, then shown the corrected result.

### ST-10 Base rates and Bayesian updating
- **Def.** Start from the prior probability (base rate) and update with evidence; base-rate neglect overweights vivid evidence.
- **Formula / example.** Suppose 10% of new setup ideas truly have edge, a test detects real edges 80% of the time, and it passes 20% of no-edge ideas (lenient). P(edge | passed) = 0.1·0.8 ÷ (0.1·0.8 + 0.9·0.2) = **31%**. With a stricter 5% false-positive rate it rises to 64%. Retail base rate: 74–89% of retail CFD accounts lose money [S24] (RR-01).
- **Why.** It produces realistic self-assessment and humility about "my backtest passed".
- **Level** I → A · **Prereq** ST-01, ST-09.
- **Sim.** Bayes slider widget (prior, power, false-positive rate) with a natural-frequency tree (out of 1,000 ideas…).

### ST-11 Survivorship and selection bias in everyday evidence
- **Def.** Seeing only the winners (social media traders, published systems, funds that still exist).
- **Why.** It inflates perceived success rates; it is the everyday cousin of BT-07.
- **Level** B · **Prereq** none.
- **Sim.** "Guru generator": 1,000 synthetic random traders, the 10 best are "showcased"; then their next year is revealed.

### ST-12 Independence and autocorrelation of outcomes
- **Def.** Whether trade outcomes depend on previous outcomes (clustering) — testable with a runs test or serial correlation **[BK: Wald–Wolfowitz]**.
- **Why.** Kelly, RoR and simple MC assume independence; clustering justifies equity-curve filters (PR-10) [S74] and lengthens streaks.
- **Level** A · **Prereq** ST-06, ST-09.
- **Sim.** Runs-test widget on the learner's W/L sequence, with a comparison to shuffled sequences.

### ST-13 Mean vs median outcome; time average vs ensemble average
- **Def.** With compounding and skew, the *typical* (median) path can be far below the *average* (mean) path; one trader lives one path (time average), not the average across traders.
- **Formula / example.** RF-10 table: at full Kelly the median terminal wealth is 20× but the 5th percentile is 0.34×; at 2× Kelly the median is 1.45× while 46% of paths are below the start after 100 trades.
- **Why.** It explains why over-betting fails even with positive EV (PM-11 volatility drag).
- **Level** A · **Prereq** RF-13, PM-11.
- **Sim.** Fan chart with mean vs median lines diverging as r increases.

### ST-14 Short-horizon noise: probability of losing with a real edge
- **Def.** A positive-expectancy system still loses over short windows with substantial probability.
- **Formula / example.** Reference system (+0.4R/trade), P(net loss) over: 5 trades **33.7%**, 10 trades 16.7%, 20 trades 12.6%, 50 trades 5.4%, 100 trades 0.8% (exact binomial, computed for this file).
- **Why.** It is the strongest single argument for scoring process rather than profit.
- **Level** B · **Prereq** ST-01.
- **Sim.** "Bad week generator": the learner trades the reference system perfectly and still sees losing weeks; the process score stays at 100%.

### ST-15 Reading simulations (fan charts, percentiles, histograms)
- **Def.** Interpreting Monte Carlo outputs: percentile bands, tails, what the 95th percentile drawdown means.
- **Level** I · **Prereq** BT-13.
- **Sim.** Quizzes on fan charts ("what fraction of paths ended below the start?").

---

## 9. Retail reality: taught honestly

### RR-01 Regulator statistics on retail CFD/FX losses
- **EU (ESMA, 2018):** national authorities' analyses showed **74–89% of retail accounts typically lose money**, with **average losses per client of €1,600 to €29,000**. ESMA's measures: leverage caps 30:1 → 2:1, a 50% margin close-out per account, negative balance protection, restrictions on incentives, a standardised risk warning that includes the provider's % of losing accounts, and a ban on binary options for retail. In force from 1 Aug 2018 [S23][S24][S25].
- **UK (FCA):** the 2016 review of a representative sample of CFD client accounts found **82% lost money**; leverage above 200:1 was then on offer [S26]. PS19/18 made the restrictions permanent from 1 Aug 2019 (CFDs, spread bets, rolling spot FX) and 1 Sep 2019 (CFD-like options); the FCA estimated retail consumers would save **£267m–£451m per year** [S27][S28].
- **France (AMF, 2009–2012):** about **89%** of 14,799 active retail clients lost money on forex/CFDs/binaries; average loss about €10,900; 13,224 losers lost about €175m while 1,575 winners gained about €13.8m. The most active and regular clients' losses grew over time [S29][S30].
- **Why.** These are the **base rates** (ST-10) every learner should know before risking real money.
- **Level** B · **Prereq** none.
- **Sim.** Onboarding "reality check" lesson with interactive charts; a recurring reminder in the go-live checklist. The app's own messaging must not imply that simulator success predicts live profits.

### RR-02 Academic evidence on individual and day traders
- **Overtrading (Barber & Odean 2000):** the most active fifth of 66,465 households earned 11.4%/yr vs the market's 17.9% (JF version; the authors' web version reports 10.0% vs 17.1% for >60,000 households); trading costs and frequency, not stock selection, explained the gap [S31][S32].
- **Gender and overconfidence (Barber & Odean 2001):** men traded about 45% more than women; trading reduced men's net returns by 2.65 pp/yr vs 1.72 pp for women [S33].
- **Taiwan day traders (Barber, Lee, Liu & Odean):** fewer than **1%** of day traders could predictably and reliably earn positive abnormal returns net of fees [S34][S35].
- **Brazil (Chague, De-Losso & Giovannetti):** of 19,646 individuals who began day trading mini-Ibovespa futures in 2013–2015, among those who persisted 300+ days **97% lost money**; only about 1.1% earned more than the minimum wage (versions differ); there was no evidence of learning by day trading [S36][S37][S38].
- **Attention-induced trading (Robinhood):** intense herding buys were followed by negative abnormal returns (about −3% over 5 days; −6% for extreme herding) [S39][S40].
- **Publication decay:** documented anomalies earn 26% less OOS and 58% less post-publication [S117].
- **Level** B → I · **Prereq** RR-01.
- **Sim.** An "evidence wall" with short animated summaries; a quiz on what each study does and does not show (e.g. Barber & Odean's results are for stock investors, not CFD traders).

### RR-03 The cost stack
- **Def.** Spread + commission + financing/swap + slippage + data/platform fees + taxes, plus the opportunity cost of time.
- **Formula / example.** A day trader taking 6 trades/day with 0.1R average cost pays 0.6R/day, about 12R/month, before any edge.
- **Why.** Costs are certain; edge is uncertain. Barber & Odean attribute household underperformance largely to trading costs [S31].
- **Level** B · **Prereq** RF-21.
- **Sim.** Monthly "cost receipt" in the simulator; an "edge needed to beat costs" calculator.

### RR-04 Why most retail traders fail (synthesis for the course)
1. **No measurable edge** after costs (most setups have zero or negative expectancy; ST-09, BT-08).
2. **Oversizing and leverage**: high risk per trade, margin close-outs (RF-16…18); ESMA explicitly cites excessive leverage [S24].
3. **Asymmetric behaviour**: cutting winners and riding losers (disposition effect, PSY-03), which destroys the right tail.
4. **Overtrading and attention-driven entries** (PSY-06, PSY-16) [S31][S39].
5. **Tilt and revenge** after losses (PSY-18/19), plus break-even seeking [S47].
6. **Small samples and outcome-based learning** (PSY-09, PSY-14): abandoning good processes, keeping bad ones.
7. **Undercapitalisation and unrealistic goals** (doubling accounts), which lead to oversizing.
8. **Marketing and survivorship** (ST-11): visible winners, invisible losers; incentives and bonuses (banned for EU/UK retail CFDs [S23][S27]).
9. **No plan, journal or review loop** (§6).
- **Level** B · **Prereq** RR-01.
- **Sim.** "Failure-mode bingo": the learner reviews a synthetic trader's month and tags the failure modes; the app grades the tagging.

### RR-05 Regulatory protections and their limits
- **Def.** EU/UK retail CFD protections (leverage caps, 50% margin close-out, negative balance protection, risk warnings) [S23][S27]; US margin rules (FINRA $2,000 minimum margin equity, intraday margin requirements) [S110]. The US pattern-day-trader $25,000 rule was reported as eliminated by SEC approval of FINRA Rule 4210 amendments in April 2026, effective June 2026; this is a secondary report to verify before teaching [S111].
- **Why.** Protections limit catastrophic losses but do not create an edge; most protected accounts still lose (RR-01).
- **Level** B · **Prereq** RF-16…RF-20.
- **Sim.** Jurisdiction selector in the simulator that applies the corresponding leverage caps and close-out rules.

### RR-06 Prop-firm and "funded trader" models, realistically
- **Def.** Evaluation programmes charge fees and impose strict risk rules (PR-11) [S76][S77][S78]. Their rules are good *teaching* devices for risk discipline; the business model and pass/payout rates should be discussed critically (no reliable public statistics were gathered in this research).
- **Level** I · **Prereq** PR-11.
- **Sim.** Challenge mode framed as a discipline exercise; the debrief emphasises rule compliance, not "passing".

### RR-07 Honest framing for an education app
- Simulator results do **not** predict live profitability (synthetic markets, no real fear, no real costs).
- The rational default for most people is long-term diversified investing; active trading is a high-variance, negative-sum-after-costs activity for the median participant (RR-01/02).
- The course goal is **competence in risk and decision-making**, which transfers to investing, business and life, not "becoming profitable".
- **Level** B · **Prereq** none.
- **Sim.** A persistent disclaimer pattern plus an end-of-course "should I trade live?" decision tool that asks about evidence, capital and process KPIs and can recommend *not* trading.

---

## 10. Suggested progressive ordering for the course

Principle: **risk before entries, process before outcomes, statistics woven in early, validation before scaling.** Each module = micro-lesson → calculator → simulator drill → scored assessment (Decision Quality / Risk Discipline). Unlock gates use **process KPIs**, never P&L.

### Level 0: Orientation (Beginner)
1. RR-07 honest framing → RR-01 regulator statistics → RR-04 why traders fail (light).
2. PSY-14 outcome bias / PSY-30 process vs outcome → ST-14 short-horizon noise.
3. ST-01 expected value (coin-flip trade machine).
- **Gate:** passes the "process vs outcome" classification quiz.

### Level 1: Risk foundations (Beginner)
4. RF-01 risk capital → RF-02 risk per trade → RF-03 R → RF-04 R-multiples.
5. RF-05 reward:risk and breakeven win rate → PM-01/02/03 win rate, payoff, expectancy.
6. RF-06 stop placement (structure + ATR intro) → RF-07 position-size formula → RF-09/10 fixed units vs fixed fractional.
7. RF-16 leverage → RF-17 margin → RF-18 margin call/close-out → RF-20 gaps/NBP → RF-21 costs in R.
8. TM-01 order types → TM-04 hard stops → TM-12 never widen → TM-13 no locking.
9. PR-06 drawdown → PR-07 recovery maths → PR-04 daily loss limit.
10. PSY-02 loss aversion, PSY-10 gambler's fallacy, PSY-18 revenge trading, PSY-24 boredom trading (with detectors switched on).
11. PL-01 plan v1 (simple), PL-04 checklist, PL-07 journal basics, PL-08 post-trade review, PL-15 mistake vs variance.
12. ST-05 sample size intuition, ST-06 streaks.
- **Gate:** 30 sim trades with ≥ 95% stop integrity, ≥ 90% risk accuracy, zero limit breaches.

### Level 2: Managing trades and the portfolio (Intermediate)
13. RF-12 ATR/volatility sizing → PR-01 portfolio heat → PR-02 correlation → PR-03 exposure limits → PR-05 weekly/monthly limits → PR-08 DD tiers → PR-12 event risk.
14. TM-02 entries → TM-03 scaling in vs averaging down → TM-05 targets → TM-06 trailing → TM-07 breakeven → TM-08 partials → TM-09 time stops → TM-10/11 discretion vs rules → TM-14/15.
15. TM-16/17 MAE/MFE on own journal data.
16. PM-05 PF, PM-06 drawdown metrics, PM-12 SQN, PM-14 consistency, PM-17 process KPIs.
17. PSY-01 prospect theory, PSY-03 disposition effect (personal PGR/PLR), PSY-04 myopic loss aversion, PSY-05 house money, PSY-06 overconfidence/calibration, PSY-08/09/11/12/13/15/16/19/20/22/23, PSY-25…29 emotion regulation and routines, PSY-31 Douglas, PSY-33 goals.
18. PL-03 playbook, PL-05 pre-market routine, PL-06 if-then, PL-09 error taxonomy, PL-10/11 daily and weekly reviews, PL-13 KPIs.
19. ST-02 distributions/skew, ST-03 volatility, ST-07 regression to the mean, ST-11 survivorship.
20. RR-02 academic evidence, RR-03 cost stack, PR-11 prop-rule challenge mode.
- **Gate:** 100 sim trades across ≥ 2 playbook setups; a weekly review done 4 weeks in a row; disposition score within a target band; error cost trending down.

### Level 3: Systems, statistics and sizing theory (Advanced)
21. BT-01…BT-07 hypothesis, rules, data, fills, costs, look-ahead, survivorship.
22. BT-10 IS/OOS → BT-13 Monte Carlo → PL-02 expectation corridors → BT-11 walk-forward → BT-14/15 robustness and sensitivity → BT-16 random benchmarks → BT-23 R-first testing.
23. BT-08/09 data snooping and overfitting → PM-13 significance → ST-09 p-values → ST-10 Bayes.
24. RF-11 fixed ratio → RF-13 Kelly / fractional Kelly → ST-13 mean vs median → PM-11 volatility drag → PR-09 risk of ruin → PR-10 equity-curve trading.
25. PM-07 Sharpe (with CI), PM-08 Sortino, PM-09 Calmar, PM-10 recovery factor, PR-13 VaR/ES, ST-04 fat tails, ST-12 autocorrelation.
26. BT-21 incubation, BT-22 regime change and decay, PL-12 monthly review, PL-14 rule-change governance, PSY-32 deliberate practice programme, PSY-36 premortem.
- **Gate:** a documented system passes the app's validation checklist (OOS + walk-forward + MC + cost stress) with a full research log; process KPIs maintained during a forced drawdown scenario.

### Level 4: Professional-grade validation (Expert)
27. RF-14 optimal f; PR-14 volatility targeting and gross/net exposure.
28. BT-17 multiple-testing corrections (Reality Check/SPA, Harvey–Liu haircut), BT-18 MinBTL, BT-19 PSR/DSR, BT-20 PBO/CSCV, BT-12 purged CV, BT-24 capacity, BT-25 research hygiene.
29. Capstone: design → validate → incubate a system in the simulator, with a written trading plan, a premortem, kill criteria and a 3-month review report, graded on process.

### Cross-cutting threads (every level)
- **Journal and review** from day 1 (PL-07…PL-11), growing in depth.
- **Behavioural detectors** (PSY-03/05/18/19) always on; feedback becomes more quantitative per level.
- **Statistics in context**: every outcome metric shows its confidence interval and sample size.
- **Honesty**: retail statistics revisited at each gate (RR-01/02).

---
## 11. Sources

Format: **[S#]** URL(s) — what it contributed. "Fetched" means the page or PDF was read directly; the others were used through search-result extracts. Many practitioner sources (LuxAlgo, NexusFi, CrossTrade, TradingView scripts) are secondary or educational, so their numbers are treated as conventions, not facts.

### Risk metrics, sizing, R-multiples
- **[S1]** https://crosstrade.io/learn/performance-metrics/r-multiple — R as initial risk; R-multiple = realised P&L ÷ 1R; expectancy in R.
- **[S2]** https://www.luxalgo.com/library/concept/r-multiple-framework/ — Tharp's R-multiple framework and its origins; expectancy formula.
- **[S3]** https://vantharpinstitute.com//Tharps-Thoughts/639_July_24_2013.html (fetched) — Tharp drawdown-equation simulations in R (33 distributions × 10,000 runs × 1,000 trades; SQN range 1–6; caution on equations).
- **[S4]** https://nexusfi.com/a/risk-management/system-quality-number-sqn — SQN = √N × expectancy ÷ sd(R); N capped at 100.
- **[S5]** https://www.tradesviz.com/glossary/system-quality-number/ — SQN description and interpretation bands (third-party).
- **[S6]** https://www.luxalgo.com/library/concept/optimal-f.md — Vince's optimal f, TWR/G(f), largest-loss scaling, worst-loss weakness, fractional use.
- **[S7]** https://www.turtletrader.com/optimal-f/ — practitioner critique of optimal f.
- **[S8]** https://nexusfi.com/a/risk-management/kelly-criterion — Kelly formula, overestimated edge, fractional Kelly, 2× Kelly gives zero growth.
- **[S9]** https://www.luxalgo.com/library/concept/kelly-criterion/ — continuous Kelly μ/σ², half-Kelly growth vs drawdown, assumptions (independence, fat tails, parameter uncertainty).
- **[S10]** https://en.wikipedia.org/wiki/John_Larry_Kelly_Jr. — Kelly (1956) citation, Bell System Technical Journal 35(4).
- **[S11]** https://www.americanscientist.org/article/bettor-math — Kelly/Shannon/Thorp history ("Fortune's Formula"), Thorp in markets.
- **[S12]** https://www.adaptrade.com/MSA/fixratio.htm — Ryan Jones fixed-ratio sizing.
- **[S13]** https://www.daytrading.com/fixed-ratio-betting — fixed-ratio delta example ($3,000 / $6,000 thresholds); choosing delta from drawdown.
- **[S14]** https://crosstrade.io/learn/risk-management/risk-of-ruin (fetched) — RoR formulas, worked examples (60% win rate, N = 100/10/4), Kelly example, caveats and internal inconsistencies.
- **[S15]** https://fxstreet.com/education/the-risk-of-ruin-tables-you-should-know-201911041256 — RoR tables; breakeven win rate = 1 ÷ (1 + RR).
- **[S16]** https://nexusfi.com/a/risk-management/risk-of-ruin — ruin threshold definition (25% vs 50% drawdown).
- **[S17]** https://www.liberatedstocktrader.com/portfolio-heat-calculator/ — portfolio heat formula; 4–8% practitioner range; five 1% trades example.
- **[S18]** https://www.luxalgo.com/library/concept/max-heat/ — heat cap ("max heat") concept.
- **[S19]** https://nexusfi.com/a/risk-management/portfolio-heat — portfolio heat definition.
- **[S105]** https://kr.tradingview.com/script/iyhUMSdt-Turtle-N-Normalized — Turtle N (20-day smoothed true range) and unit = 1% equity ÷ (N × $/point).
- **[S106]** https://zerodha.com/varsity/chapter/position-sizing-active-traders-part-3 and https://futures.io/psychology-money-management/24374-vant-tharps-percent-volatility-position-sizing-fx-equation-please-anyone.html — Tharp sizing models (units per fixed amount, percent margin, percent risk, percent volatility); percent-volatility formula; forum-reported comparison of 595 trades.
- **[S107]** https://www.luxalgo.com/library/concept/volatility-targeted-sizing.md — volatility sizing history; look-back lag risk.
- **[S123]** https://nexusfi.com/showthread.php?p=57165 — forum criticism of averaging R-multiples and of Tharp's maths (opinion).

### Trade management, MAE/MFE
- **[S20]** https://www.wiley-vch.de/en/areas-interest/finance-economics-law/maximum-adverse-excursion-978-0-471-14152-5 — Sweeney, *Maximum Adverse Excursion* (Wiley), consistency of market behaviour as a prerequisite.
- **[S21]** https://www.luxalgo.com/library/concept/mae-mfe-distributions.md — MAE/MFE definitions (via search extract; the page later returned 404).
- **[S22]** https://www.poems.com.sg/glossary/trading-terms/adverse-excursion/ — attribution of MAE to Sweeney; MAE for stop placement.

### Portfolio rules, limits, prop firms
- **[S71]** https://www.incrediblecharts.com/trading/6_percent_rule.php — Elder's 6% monthly rule.
- **[S72]** https://tickertape.tdameritrade.com/trading/rules-to-manage-risk-15908 — Elder's 2% and 6% rules, "sharks and piranhas".
- **[S73]** https://www.financialwisdomtv.com/post/dr-alexander-elder — critique of the 6% rule for professionals.
- **[S74]** https://nexusfi.com/a/risk-management/equity-curve-trading — equity-curve filter mechanics, look-backs, closed vs MTM equity, limitations.
- **[S75]** https://www.luxalgo.com/library/concept/equity-curve-based-throttling/ — graduated equity-curve throttling.
- **[S76]** https://tradetanto.com/learn/prop-firm-drawdown-rules-trailing-vs-static-vs-eod — trailing (intraday vs EOD) vs static drawdown; daily loss limit as a separate rule.
- **[S77]** https://tradingfunder.com/ftmo-rules/ — reported FTMO limits (5% daily incl. floating P&L, 10% max loss); conflicting third-party details, so verify.
- **[S78]** https://tradingfunder.com/concepts/trailing-drawdown/ — trailing drawdown worked example.

### Leverage, margin, regulation, retail statistics
- **[S23]** https://www.esma.europa.eu/press-news/esma-news/esma-adopts-final-product-intervention-measures-cfds-and-binary-options (fetched) — leverage caps 30:1…2:1, 50% margin close-out, negative balance protection, risk warning, from 1 Aug 2018.
- **[S24]** https://www.esma.europa.eu/node/84933 (fetched) — "74-89% of retail accounts typically lose money"; average losses €1,600–€29,000; excessive leverage rationale.
- **[S25]** https://exante.eu/retail_risk_warning/ — reference to ESMA Decision 2018/796 and the 74–89% range in broker disclosures.
- **[S26]** https://fca.org.uk/news/press-releases/fca-proposes-stricter-rules-contract-difference-products (fetched) — FCA Dec 2016: 82% of clients lost money; leverage above 200:1; proposed 50:1 and 25:1 caps; bonus ban.
- **[S27]** https://www.fca.org.uk/publications/policy-statements/ps19-18-restricting-contract-difference-products — PS19/18 permanent CFD restrictions (30:1–2:1, 50% close-out, NBP, inducements ban, risk warning).
- **[S28]** https://fca.org.uk/news/press-releases/fca-confirms-permanent-restrictions-sale-cfds-and-cfd-options-retail-consumers — effective dates; £267m–£451m annual consumer savings estimate.
- **[S29]** https://www.amf-france.org/sites/institutionnel/files/contenu_simple/lettre_ou_cahier/lettre_observatoire/La%20lettre%20de%20l%27Observatoire%20de%20l%27epargne%20de%20l%27AMF%20-%20ndeg%2010%20-%20Octobre%202014.pdf — AMF Observatoire letter (Oct 2014) on retail forex/CFD losses.
- **[S30]** https://www.lafinancepourtous.com/2014/10/13/forex-attention-danger/ and https://www.financemagnates.com/forex/analysis/analysis-binary-fx-companies-widely-abused-french-market-advertising-ban/ — AMF study details (14,799 clients, ~89% losing, ~€10,900 average loss, €175m vs €13.8m).
- **[S108]** https://www.nasdaq.com/glossary/m/margin-call — margin call definition.
- **[S109]** https://www.bankrate.com/investing/what-is-margin-call/ — broker may liquidate positions if a call is not met.
- **[S110]** https://www.finra.org/investors/insights/am-i-pattern-day-trader (fetched) — FINRA: $2,000 minimum margin equity, intraday margin requirements, 90-day restriction for repeated deficits.
- **[S111]** https://tastytrade.com/learn/markets/industry/pattern-day-trading/ — reported 2026 elimination of the PDT $25,000 rule (verify).

### Retail and individual-investor research
- **[S31]** https://faculty.haas.berkeley.edu/odean/papers/returns/Returns.html (fetched) — Barber & Odean "Trading is hazardous to your wealth": the most active quintile earned 10.0% vs the market's 17.1%; average turnover 80%/yr.
- **[S32]** https://faculty.haas.berkeley.edu/odean/Papers%20current%20versions/Individual_Investor_Performance_Final.pdf; https://hedgefundalpha.com/strategies/common-stock-investment-performance-individual-investors/; https://www.nber.org/system/files/working_papers/w25838/revisions/w25838.rev0.pdf — JF-version figures (66,465 households, 11.4% vs 17.9%, 75% turnover); risk-adjusted underperformance; rational adjustment-cost counter-argument.
- **[S33]** https://faculty.haas.berkeley.edu/odean/papers/gender/gender.html — "Boys will be boys": men trade 45% more; net return drag 2.65 vs 1.72 pp.
- **[S34]** https://faculty.haas.berkeley.edu/odean/papers/day%20traders/Day%20Trading%20Skill%20110523.pdf — Taiwan day traders: <1% predictably profitable net of fees; persistence of top/bottom performers.
- **[S35]** https://ideas.repec.org/a/eee/finmar/v18y2014icp1-24.html — published version record (J. Financial Markets 2014).
- **[S36]** https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3423101 — Chague, De-Losso & Giovannetti, "Day Trading for a Living?" (abstract via search).
- **[S37]** https://econpapers.repec.org/RePEc:fgv:eesptd:525 — FGV working-paper record.
- **[S38]** https://quantpedia.com/?p=4771 — summary: 19,646 individuals, 97% of persistent day traders lost money, no learning.
- **[S39]** https://iimb.ac.in/sites/default/files/inline-files/attention-induced-trading.pdf — Barber, Huang, Odean & Schwarz: Robinhood herding, −3%/−6% 5-day abnormal returns.
- **[S40]** https://gsm.ucdavis.edu/news/what-effect-brokerage-robinhood-having-stock-market — summary of the Robinhood findings.

### Behavioural finance and psychology
- **[S41]** https://en.wikipedia.org/wiki/Disposition_effect — disposition effect overview, Odean 1998.
- **[S42]** https://rpc.cfainstitute.org/research/cfa-digest/1999/05/are-investors-reluctant-to-realize-their-losses-digest-summary — Odean 1998: PGR 14.8% vs PLR 9.8%; December reversal; not explained by rebalancing or costs.
- **[S43]** https://www.youngju.dev/blog/psych-papers/prospect-theory-loss-aversion.en — λ = 2.25 and α = 0.88 from the 1992 CPT paper (25 graduate students).
- **[S44]** https://metricgate.com/docs/prospect-theory-utility/ — value-function parameters.
- **[S45]** https://theorempath.com/topics/prospect-theory — probability weighting (γ ≈ 0.65); lower λ in field studies of professionals.
- **[S46]** https://www.nber.org/papers/w4369 — Benartzi & Thaler myopic loss aversion; about annual evaluation horizon.
- **[S47]** https://ideas.repec.org/a/inm/ormnsc/v36y1990i6p643-660.html and https://purl.stanford.edu/hs316gy2015 — Thaler & Johnson house-money and break-even effects; caveat that the evidence came from hypothetical/lab choices.
- **[S48]** https://web.mit.edu/~alo/www/Papers/online.html — Lo, Repin & Steenbarger (2005): 80 day-traders; stronger emotional reactivity is linked to worse performance; no "trader personality".
- **[S49]** https://pubmed.ncbi.nlm.nih.gov/18413617/ — Coates & Herbert (2008) PNAS: testosterone/profit, cortisol/volatility, 17 traders over 8 days.
- **[S50]** https://www.discovermagazine.com/testosterone-fuelled-traders-make-higher-profits-9091 and https://neuroanthropology.net/2008/04/17/testosterone-and-cortisol-explain-market-behaviour/ — limitations and over-interpretation critique.
- **[S51]** https://researchonline.lse.ac.uk/id/eprint/36157 — Fenton-O'Creevy et al. (2011): emotion regulation in traders at four investment banks; antecedent-focused vs response-focused.
- **[S52]** https://cognition.aau.at/bg/BA/Arkes%20%26%20Blumer%201985.pdf — Arkes & Blumer (1985) sunk-cost effect.
- **[S53]** https://en.wikipedia.org/wiki/Hindsight_bias — Fischhoff (1975) "creeping determinism".
- **[S54]** https://en.wikipedia.org/wiki/Anchoring_effect — wheel-of-fortune anchoring (10 vs 65 → 25% vs 45%).
- **[S55]** https://causeweb.org/cause/node/6896 — Tversky & Kahneman (1974) heuristics abstract (representativeness, availability, anchoring).
- **[S56]** https://www.stat.berkeley.edu/~aldous/157/Papers/croson.pdf and https://www.cambridge.org/core/product/8A9D1813D42FFA25634E7FD26A46D484/core-reader — Croson & Sundali (2005) gambler's fallacy / hot hand in casino data; note on Miller & Sanjurjo's critique of hot-hand research.
- **[S57]** https://dlab.sauder.ubc.ca/sjdm/journal/06001/jdm06001.htm — Sundali & Croson (2006) roulette field evidence.
- **[S58]** https://scientificallysound.org/2018/04/19/small-sample-sizes-and-the-bias-of-small-numbers/ — law of small numbers (85% vs 48% replication).
- **[S59]** https://www.lesswrong.com/posts/ZfAqkomEFE9NGfwxG/judgment-under-uncertainty-summaries-part-1 — summary of Tversky & Kahneman (1971).
- **[S60]** https://en.wikipedia.org/wiki/Outcome_bias — Baron & Hershey (1988) outcome bias.
- **[S61]** https://pmc.ncbi.nlm.nih.gov/articles/PMC12372742/ — pre-registered replication (n = 692) of outcome bias.
- **[S62]** https://www.sachinrekhi.com/thinking-in-bets-annie-duke — Annie Duke's "resulting".
- **[S63]** https://www.supersummary.com/trading-in-the-zone/summary/ — Mark Douglas: five fundamental truths, probabilistic mindset.
- **[S64]** https://tradethatswing.com/key-takeaways-from-trading-in-the-zone-by-mark-douglas/ — Douglas: edge as statistical advantage over a series.
- **[S65]** https://www.babypips.com/trading/make-the-most-out-of-your-trading-journal — Steenbarger's journaling advice (concrete goals; log positives too).
- **[S66]** https://www.realvision.com/videos/brett-steenbarger-the-elements-that-create-successful-and-fulfilled-investors — Steenbarger on deliberate practice and adaptability.
- **[S67]** https://www.goodreads.com/book/show/701037.Enhancing_Trader_Performance — Steenbarger, *Enhancing Trader Performance* (expertise development).
- **[S68]** https://www.ebc.com/forex/brett-n-steenbarger — Steenbarger profile: performance as a trainable skill.
- **[S69]** https://pmc.ncbi.nlm.nih.gov/articles/PMC6731745/ — deliberate practice (Ericsson et al. 1993) definition and failed-replication debate.
- **[S70]** https://en.wikipedia.org/wiki/Pre-mortem — Klein's premortem (HBR 2007), prospective hindsight.

### Backtesting, validation, overfitting
- **[S79]** https://cmtassociation.org/wp-content/uploads/2024/01/erniechan-020211-1.pdf — Ernest Chan: look-ahead, survivorship and data-snooping biases inflate backtests.
- **[S80]** https://www.luxalgo.com/library/concept/walk-forward-analysis/ — walk-forward method, Pardo attribution, WFE ≥ 0.5 rule of thumb, anchored vs rolling, parameter-drift diagnostic.
- **[S81]** https://ungeracademy.com/posts/how-to-use-walk-forward-analysis-you-may-be-doing-it-wrong — anchored vs rolling by timeframe.
- **[S82]** https://nexusfi.com/a/risk-management/monte-carlo-simulation — Monte Carlo trade resampling; percentiles; limits (no edge creation).
- **[S83]** https://strategyquant.com/blog/what-is-monte-carlo-analysis-and-why-you-should-use-it/ — reshuffle vs resample-with-replacement.
- **[S84]** https://seeitmarket.com/?p=56496 and https://returnoneffort.beehiiv.com/p/setting-realistic-expectations-maximum-drawdown — size from the 95th-percentile simulated drawdown; simulated DD usually exceeds the backtest DD.
- **[S85]** https://www.mql5.com/en/articles/23125 — bootstrap confidence intervals for trading metrics.
- **[S86]** https://podwise.ai/episodes/1088078 — Kaufman (Better System Trader): step parameters in percentage increments.
- **[S87]** https://www.turtletrader.com/robust-trading-system/ — robustness criteria; 3–5 optimised parameters at most; plateaus.
- **[S88]** https://www.luxalgo.com/library/concept/parameter-stability.md — parameter-stability concept.
- **[S89]** https://www.econometricsociety.org/publications/econometrica/2000/09/01/reality-check-data-snooping — White (2000) Reality Check; Hansen's SPA as a refinement.
- **[S90]** https://data-snooping.martinsewell.com/ — data-snooping bibliography; Sullivan, Timmermann & White (1999) on DJIA rules.
- **[S91]** https://carmamaths.org/jon/backtest.pdf (PDF read) — Bailey, Borwein, López de Prado & Zhu, "Pseudo-Mathematics and Financial Charlatanism": E[max_N] formula, MinBTL formula and bound, N = 10 → IS SR ≈ 1.57, 5 years → ≤ 45 trials, 7 trials → 2-year SR 1; must report the number of trials.
- **[S92]** https://escholarship.org/content/qt4w1110bb/qt4w1110bb.pdf (PDF opened) — PBO paper (J. Computational Finance 20(4), 2017).
- **[S93]** https://papers.ssrn.com/abstract=2326253 and https://packages.oit.ncsu.edu/cran/web/packages/pbo/readme/README.html — PBO/CSCV abstract; hold-out unreliability; R `pbo` package.
- **[S94]** https://papers.ssrn.com/abstract=2460551 — Deflated Sharpe Ratio (JPM 40(5)): selection bias and non-normality corrections.
- **[S95]** https://en.wikipedia.org/wiki/Deflated_Sharpe_ratio and https://endgame-ml.readthedocs.io/en/latest/_modules/endgame/utils/sharpe.html — DSR structure (PSR with a raised benchmark), Euler–Mascheroni term, DSR < 0.95 convention, native-frequency requirement.
- **[S96]** https://people.duke.edu/~charvey/Research/Published_Papers/P120_Backtesting.PDF — Harvey & Liu "Backtesting": Sharpe haircut; t = 3.0 → about 2.0 adjusted; nonlinear haircut; 50% rule of thumb.
- **[S112]** https://www.luxalgo.com/library/concept/execution-cost-modeling/ and https://skills.cat/skills/jefrnc/quant-llm-skills/transaction-cost-modeling — execution cost modelling; costs erase high-turnover edges; square-root impact; default cost settings understated for small caps.
- **[S113]** https://www.quantstart.com/articles/Successful-Backtesting-of-Algorithmic-Trading-Strategies-Part-II — transaction-cost model tiers (linear, piece-wise, quadratic).
- **[S114]** https://rustybt.readthedocs.io/en/latest/api/order-management/transaction-costs/slippage/ — slippage model types (fixed, volume-share, basis points, square-root impact).
- **[S115]** https://www.etf.com/sections/index-investor-corner/swedroe-evidence-shrinking-alpha — evidence of shrinking alpha / self-correcting anomalies.
- **[S116]** https://papers.ssrn.com/abstract=602222 and https://web.mit.edu/Alo/www/Papers/JPM2004.html — Lo's Adaptive Markets Hypothesis.
- **[S117]** https://www.gwern.net/doc/economics/2016-mclean.pdf and https://afajof.org/issue/volume-71-issue-1/ — McLean & Pontiff (JF 2016): 97 predictors, −26% OOS, −58% post-publication.
- **[S118]** https://rpc.cfainstitute.org/research/cfa-digest/2016/06/does-academic-research-destroy-stock-return-predictability-digest-summary — CFA digest of McLean & Pontiff.

### Performance metrics and statistics
- **[S97]** https://traders.studentorg.berkeley.edu/papers/The-Statistics-of-Sharpe-Ratios.pdf (PDF read) — Lo (2002) FAJ: SR definition and estimator, IID SE = √((1 + SR²/2)/T), 95% CI, √12 annualisation invalid under serial correlation, hedge-fund SR overstated by up to 65%.
- **[S98]** https://rpc.cfainstitute.org/research/financial-analysts-journal/2002/the-statistics-of-sharpe-ratios — FAJ listing for Lo (2002).
- **[S99]** https://tradingstrategy.ai/glossary/calmar-ratio and https://www.tradesviz.com/glossary/calmar-ratio/ — Calmar = CAGR ÷ |MDD|, 36-month window, Terry Young 1991, Sterling variant.
- **[S100]** https://metricgate.com/docs/sortino-ratio/ — Sortino ratio with MAR and downside deviation.
- **[S101]** https://www.r-bloggers.com/2013/11/historical-value-at-risk-versus-historical-expected-shortfall/ — historical VaR vs ES; ES ≈ 1.25 × VaR under normality at 95%.
- **[S102]** https://www.mathworks.com/help/risk/expected-shortfall-estimation-and-backtesting-1.html — historical and parametric (normal, t) VaR/ES estimation and backtesting.
- **[S103]** https://nexusfi.com/a/risk-management/profit-factor and https://blog.traderspost.io/article/trading-strategy-performance-metrics-beyond-win-rate — profit factor caveats (order-blind, outlier-sensitive); recovery factor; expected payoff vs PF confusion.
- **[S104]** https://crosstrade.io/learn/performance-metrics/profit-factor — PF identity (1 + Net/GrossLoss); realistic 1.2–2.0 band; >3 suggests over-optimisation.
- **[S119]** https://guava.physics.ucsd.edu/~nigel/articles/mandelbrot.html, https://arxiv.org/pdf/cond-mat/0408143 and https://www.risknet.de/themen/risknews/fractals-fat-tails-and-the-end-of-comfortable-statistics/ — Mandelbrot (1963) cotton prices non-Gaussian, α ≈ 1.7; Fama's Dow 30 findings; dispute over infinite variance.
- **[S120]** https://retailtradersrepository.substack.com/p/s2-b-calculating-your-expected-losing — expected losing streak ≈ |ln(n) / ln(1−P)|.
- **[S121]** https://www.mql5.com/en/blogs/post/776451 — losing-streak arithmetic; independence caveat; a backtest streak is one draw from a long-tailed distribution.
- **[S122]** https://www.topendsports.com/sports-betting/tools/streak-calculator/ — streak calculator; common approximation overstates probabilities.

### Other background (search results consulted, not directly cited)
- Kelly 1956 primary PDF: https://homepage.sns.it/marmi/esameIUE/kelly.pdf (listed in search; not read).
- https://www.mathworks.com/help/risk/expected-shortfall-estimates-for-asset-portfolios.html — ES for portfolios.
- https://www.investmentexecutive.com/?p=65351 — press coverage of ESMA 74–89% range.

### Items marked [BK] (background knowledge; verify before publishing lesson text)
Sharpe (1966/1994) definition; Sortino & Price (1994); Ulcer Index (Peter Martin); chandelier exit (Chuck LeBeau); e-ratio (Curtis Faith); Langer (1975) illusion of control; Nickerson (1998) confirmation bias; Shefrin & Statman (1985) disposition effect naming; Gollwitzer implementation intentions; Gawande checklists; Russo & Schoemaker outcome/process matrix; Yerkes–Dodson; Wilson score interval; Bonferroni; Wald–Wolfowitz runs test; block bootstrap; López de Prado purged/embargoed and combinatorial purged CV (AFML 2018); PSR closed-form; CSCV step details; Tharp's SQN bands and "opportunity"; Douglas's seven principles (and part of the five truths wording); crypto liquidation-price approximation; portfolio σ and N_eff formulas; skew archetypes of trend vs mean-reversion systems; adverse selection of limit orders; 5σ-move frequency remark.

### Method notes and gaps
- All worked numbers (Kelly growth, optimal f, Monte Carlo drawdowns, streak probabilities, CIs, MinBTL values, VaR/ES) were recomputed with a small Python script for this file (Monte Carlo seeds fixed; percentiles from 10,000–20,000 paths).
- Not covered due to search-budget exhaustion: primary text of Douglas, Tharp, Vince, Kaufman, Pardo and Steenbarger books; independent pass/payout statistics for prop firms; ESMA's later (post-2018) annual retail statistics. Recommended follow-ups before writing final lesson copy.
