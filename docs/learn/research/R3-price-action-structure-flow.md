# R3 — Price Action, Market Structure, Liquidity, Microstructure, Order Flow & Execution

**Research inventory for an interactive trading course with a synthetic-market simulator**
Prepared: 2026-10-22 · Scope: beginner → expert · Audience: curriculum designers + simulator/engine team

---

## How to read this document

Every concept uses the same compact template:

> **Concept** — Level · Prerequisites
> - **Def** – one-line definition
> - **Identify** – precise identification rules, where they exist (or "none canonical")
> - **Claim** – what practitioners claim it does
> - **Evidence / critique** – what research, regulators or honest critics say, tagged (see legend)
> - **Misuse** – the most common way learners get it wrong
> - **Sim** – how to practise it in the simulator (what the learner does, what the app shows)

**Levels:** **B** = Beginner, **I** = Intermediate, **A** = Advanced, **E** = Expert.

**Evidence tags**

| Tag | Meaning |
|---|---|
| `[MECH]` | Mechanical / institutional fact: exchange rules, regulation, arithmetic. True by construction. |
| `[EMP+]` | Supported by peer-reviewed, central-bank or regulator empirical research. |
| `[EMP~]` | Mixed, weak, small-sample, vendor-run or unreviewed evidence. |
| `[HEUR]` | Practitioner heuristic; plausible, but untested or untestable as usually stated. |
| `[MKT]` | Marketing/branding label; renames an older concept. The mapping is given. |
| `[BK]` | Background literature/knowledge not re-fetched in this session (see §9 note). Treat as "verify before publishing". |

**Big-picture honesty statement for the course.** Three layers must be kept separate in every lesson:
1. **Mechanics** (how orders, books, auctions, sessions, halts and costs actually work) – facts; teach them as facts.
2. **Statistical tendencies** (e.g., round-number order clustering, intraday U-shaped volatility, stop cascades) – documented, but modest and conditional; teach with base rates.
3. **Narratives** (e.g., "smart money engineers liquidity", "the algorithm (IPDA) delivers price to fair value gaps") – unfalsifiable as stated; teach as vocabulary, mapped to layers 1 and 2, with explicit critique.

A synthetic-market simulator is uniquely placed to teach layer 3 critically: the app *knows* the data-generating process, so it can show learners that many "patterns" appear just as often in a random walk (null-model toggle; see Appendix A).

---

## 1. Market participants and venues

### 1.1 Market, venue, instrument
**Market vs. venue** — B · none
- **Def:** A *market* is the set of all trading interest in an instrument; a *venue* is one place where orders meet (exchange, ATS/dark pool, dealer platform, broker internaliser).
- **Identify:** Ask "who is my counterparty and whose rules match my order?"
- **Claim:** One price per instrument.
- **Evidence:** `[MECH][EMP+]` US equities are fragmented across ~15 exchanges, 30+ ATSs, single-dealer platforms and internalisers (SEC staff, 2020). In 2019 ≈63% of share volume executed on-exchange, ≈37% off-exchange; ATSs ≈10.2%; broker-dealer internalisers ≈27% of NMS share volume. FX has no central venue at all.
- **Misuse:** Believing your broker's chart is "the market" (especially in CFDs/FX, where it is the broker's own price stream).
- **Sim:** Show the same instrument on two simulated venues with slightly different books; learner routes an order and sees fill differences.

### 1.2 Market structures: order-driven, quote-driven, brokered, hybrid
**Order-driven market (auction / CLOB)** — B · 1.1
- **Def:** Buyers' and sellers' orders meet in a central limit order book (CLOB) under explicit priority rules; prices are set by the orders themselves.
- **Identify:** Visible book of limit orders; anyone can post a bid/offer (equity exchanges, CME Globex).
- **Claim:** Transparent, competitive price formation.
- **Evidence:** `[MECH]` Harris (*Trading and Exchanges*, 2003) classifies markets as quote-driven (dealer), order-driven (continuous auction or call auction) and brokered; most modern exchanges are hybrids `[BK]`.
- **Misuse:** Assuming displayed depth is all the liquidity (hidden/iceberg/off-exchange liquidity exists).
- **Sim:** Default simulator mode: a CLOB where the learner sees L2 and can place limit/market orders.

**Quote-driven (dealer) market** — B · 1.1
- **Def:** Dealers/market makers continuously quote bid and ask; customers trade against the dealer, who earns the spread and bears inventory risk.
- **Identify:** You request a quote (RFQ) or click a streaming price; you never see other customers' orders (FX dealer-to-customer, most bonds, retail CFDs).
- **Claim:** Guaranteed immediacy.
- **Evidence:** `[MECH]` Dealers widen quotes when uncertain and may *skew* them to offload inventory. FX: dealers internalise >80% of customer trades in their own pools (BIS, Dec 2025, from the 2025 Triennial). Bonds: ~26% of corporate bond volume was electronic in Q3 2018; much of it automated RFQ (SEC 2020).
- **Misuse:** Thinking the dealer's quote is a neutral "market price".
- **Sim:** "Dealer mode": the learner trades against a simulated dealer whose spread widens with volatility and whose mid skews with its inventory; a panel reveals dealer inventory after the session.

**Brokered market** — I · 1.2
- **Def:** A broker searches for a counterparty (blocks, illiquid assets) without taking principal risk.
- **Evidence:** `[MECH]` Block crossing networks/conditional orders in dark pools are the electronic analogue (SEC 2020).
- **Sim:** Optional scenario: learner must sell a block; compare "work it in the lit book" vs. "find a block counterparty" (simulated with probability and delay).

**Hybrid market / designated market makers** — I · 1.2
- **Def:** A CLOB plus obligated liquidity providers (NYSE DMMs, CME Lead Market Makers, LSE Registered Market Makers).
- **Evidence:** `[MECH]` NYSE DMMs and floor brokers play a significant role in opening/closing auctions; Brogaard, Ringgenberg & Roesch (2020) found effective spreads widened more in NYSE stocks when the floor closed in 2020, mostly around the open/close (cited in SEC 2020).
- **Sim:** Toggle "DMM present" in the auction module; compare auction price stability.

### 1.3 Continuous trading vs. call auctions
**Call auction (uncross)** — I · 1.2, 2.2
- **Def:** Orders accumulate for a period without matching, then execute all at once at a single clearing price.
- **Identify (typical algorithm):** choose the price that (1) maximises executable volume; ties broken by (2) minimum surplus/imbalance, (3) market pressure, (4) proximity to a reference price `[BK]` for the tie-break order. Nasdaq's reference price is "the price within the Nasdaq BBO at which paired shares are maximised" `[MECH]`. LSE describes the goal as "to find the most popular price, rather than the highest or lowest price".
- **Claim:** Concentrates liquidity, reduces volatility at critical moments (open, close, after halts).
- **Evidence:** `[MECH][EMP+]` Auctions have grown in importance with index products benchmarked to closing prices; in 2019 auctions were ~12% (Nasdaq) and ~34% (NYSE) of the listing exchange's own share volume (SEC staff 2020, Table 3). LSE adds random end periods (up to 30 s) to deter last-second gaming.
- **Misuse:** Placing a market-on-open order in a thin stock and being surprised by the print.
- **Sim:** Auction mini-game: during a 5-minute call phase the app streams indicative price, paired volume and imbalance; the learner submits MOO/LOO or imbalance-only orders and sees the uncross computed step by step.

### 1.4 The order book
**Limit order book (L1 / L2 / L3; MBP vs MBO)** — B · 1.2
- **Def:** The list of resting buy (bids) and sell (asks/offers) limit orders by price. *L1* = best bid/ask (+ last); *L2/market-by-price* = aggregated size per price level; *L3/market-by-order* = each individual order.
- **Identify:** Bids below, asks above; best bid < best ask (otherwise the book is "crossed" and would match).
- **Claim:** Shows supply and demand.
- **Evidence:** `[MECH]` Displayed size is "intentions rather than transactions" and can be cancelled any time; equity depth is fragmented across venues; crypto books are per-exchange (LuxAlgo DOM notes). Proprietary exchange feeds can carry every order message, including odd lots, modifications and cancellations, and often reach users faster than the consolidated SIP (SEC 2020).
- **Misuse:** Reading a big resting order as a guaranteed wall.
- **Sim:** L2 ladder always on screen in microstructure modules; an "MBO x-ray" toggle (Expert) reveals individual orders and their queue positions.

### 1.5 Bid, ask, last, mid, microprice
**Bid / ask / last / mid** — B · 1.4
- **Def:** Bid = highest price someone will buy at now; ask = lowest price someone will sell at now; last = price of the most recent trade; mid = (bid+ask)/2.
- **Identify:** Market buys execute at the ask, market sells at the bid. A chart usually plots *last* (or *bid* in FX/CFD platforms).
- **Claim:** n/a (definitions).
- **Evidence:** `[MECH]` Charting bid-only data in FX/CFD means a long position's stop (sell, triggered on bid) and a short's stop (buy, triggered on ask) behave differently: shorts can be stopped "without the chart touching the level" when the spread widens.
- **Misuse:** Expecting to buy at the last-traded price; not knowing which price triggers stops.
- **Sim:** Chart shows bid, ask and last as three toggleable lines; when a short's stop is hit by the ask while the bid-chart did not touch the level, the app highlights why.

**Microprice / size-weighted mid** — E · 1.5, 6.10
- **Def:** Mid adjusted for top-of-book size imbalance: microprice ≈ (bid·askSize + ask·bidSize)/(bidSize+askSize).
- **Evidence:** `[EMP+][BK]` Top-of-book imbalance predicts the next mid move over very short horizons (Cont, Kukanov & Stoikov 2014 on order-flow imbalance; Stoikov 2018 microprice). Edge is measured in fractions of a tick – irrelevant for retail costs.
- **Sim:** Expert overlay plotting microprice vs mid; learner predicts the next tick direction 50 times; app scores vs. coin-flip.

### 1.6 Spread
**Bid–ask spread (quoted, effective, realised)** — B → A · 1.5
- **Def:** Quoted spread = ask − bid. Effective spread = 2 × |trade price − mid at arrival|. Realised spread = effective spread minus the subsequent mid move (what the liquidity provider actually keeps).
- **Identify:** Quoted is visible; effective/realised are computed post-trade.
- **Claim:** Spread is the cost of immediacy.
- **Evidence:** `[EMP+][BK]` Classic decomposition: order-processing costs + inventory costs + adverse-selection (Glosten–Milgrom 1985; Stoll 1989). Spread widens with volatility and around news; narrows with activity (Ito & Hashimoto 2006 for FX: more deals ↔ narrower spreads during business hours). Wholesalers frequently fill retail orders *inside* the NBBO ("price improvement") (SEC 2020).
- **Misuse:** Ignoring spread in scalping; thinking "zero commission" means zero cost.
- **Sim:** Every fill ticket shows quoted spread, effective spread paid and the spread as % of the trade's target; a "cost meter" accumulates spread + commission per session.

**Tick size / tick-constrained instruments** — I · 1.6
- **Def:** Minimum price increment. When the natural spread is smaller than one tick, the quoted spread is pinned at one tick and long queues form.
- **Evidence:** `[MECH]` Queue position then matters more than price (see 2.12). US stocks ≥$1 have quoted in $0.01 under Reg NMS Rule 612 (recently amended for some tick-constrained names) `[BK]`.
- **Sim:** Instrument A (wide-tick, deep queues) vs Instrument B (fine tick) – learner experiences "my limit order never fills" vs "I keep getting price-improved".

### 1.7 Depth and liquidity
**Liquidity (tightness, depth, resiliency, immediacy)** — B → I · 1.4–1.6
- **Def:** The ability to trade size quickly at low cost. Dimensions: *tightness* (spread), *depth* (size available near the touch), *resiliency* (how fast the book refills after a shock), *immediacy* (how fast you can trade) (Kyle 1985; Harris 2003) `[BK]`.
- **Identify:** Spread, cumulative size within N ticks, refill time after a sweep.
- **Claim:** Liquid markets are "safer".
- **Evidence:** `[EMP+]` Liquidity is endogenous and vanishes in stress (6 May 2010 Flash Crash; CFTC found spoof orders contributed to an extreme book imbalance that preceded a sudden loss of liquidity in E-mini S&P). Market-wide circuit breakers exist because severe declines "may exhaust market liquidity" (Fed. Register 2019).
- **Misuse:** Using average volume to size an order in a news spike.
- **Sim:** "Liquidity shock" events: the generator pulls 70% of depth; learner sees the same market order walk 1 tick vs 12 ticks.

**Depth chart / cumulative depth** — I · 1.7
- **Def:** Cumulative bid and ask size plotted against price.
- **Sim:** Toggle depth chart; ask learner to estimate the average price of a 500-lot market order before sending it, then compare.

### 1.8 NBBO, Reg NMS, best execution, PFOF
**NBBO and consolidated data** — I · 1.5
- **Def:** National Best Bid and Offer: the highest bid and lowest offer across all US exchanges, disseminated by the SIPs.
- **Identify:** Core data = last sale, each exchange's best bid/offer and sizes, and the NBBO (SEC 2020).
- **Evidence:** `[MECH]` Off-exchange venues do not display quotes in the consolidated feed ("dark"); all NMS-stock ATSs operated as dark pools in 2020. Direct proprietary feeds often arrive faster than the SIP, giving faster participants an informational edge (SEC 2020).
- **Sim:** Two-venue mode with a delayed "SIP" panel and a fast "direct feed" panel; learner sees stale-quote risk.

**Order Protection Rule / trade-through (Reg NMS Rule 611)** — A · NBBO
- **Def:** Trading centres must have policies to prevent executing at prices inferior to protected displayed quotes elsewhere (adopted 2005).
- **Evidence:** `[MECH]` Under active debate: SEC roundtables in 2025; the SEC Chairman said Reg NMS and the rule "have not served investors… well"; Nasdaq reports a proposal to rescind Rule 611 (status to verify).
- **Sim:** Expert sandbox: turn trade-through protection on/off and watch routing outcomes.

**Best execution** — I · 1.8
- **Def:** FINRA Rule 5310: firms must use "reasonable diligence" to find the best market so the customer's price is "as favorable as possible under prevailing market conditions".
- **Evidence:** `[MECH]` Applies to routing and receiving firms and cannot be transferred; requires "regular and rigorous" reviews (at least quarterly) of price improvement, fill likelihood, speed, size, costs (FINRA RN 21-23).
- **Sim:** Post-trade "execution quality report" for the learner's own orders: price improvement, fill rate, average slippage.

**Payment for order flow (PFOF) and internalisation** — I · 1.8
- **Def:** Brokers receive payment (or rebates) for routing customer orders to a wholesaler/venue.
- **Identify:** Rule 606 quarterly routing reports; Rule 607 disclosures; confirmations (Rule 10b-10).
- **Claim (pro):** Retail orders get price improvement and "zero commission". **Claim (con):** Conflict of interest; routing for payment, not quality.
- **Evidence:** `[MECH][EMP~]` FINRA: receiving PFOF is not itself a violation but must not interfere with best execution; firms cannot negotiate terms that reduce price improvement customers would otherwise get; disclosure is not a shield. Internalisation handles "almost 100%" of US retail marketable flow (CFA Institute via SEC 2020). The EU's MiFIR review bans PFOF with a phase-out to mid-2026 `[BK]`.
- **Sim:** Broker-model module: same order routed to (a) lit book, (b) simulated wholesaler with price improvement and PFOF; show who earned what.

### 1.9 Participants
**Participant map (Harris taxonomy)** — B → I · 1.1
- **Def:** Who trades and why. Harris separates *utilitarian traders* (investors, hedgers, borrowers, gamblers – trade for reasons other than trading profits), *profit-motivated traders* (informed traders, value/news traders, arbitrageurs, dealers) and *parasitic* strategies (front-runners, order anticipators, "bluffers"/manipulators) `[BK]`.
- **Identify (modern map):** asset managers/pensions (large, slow, benchmark-driven, use VWAP/TWAP/IS algos), hedge funds, banks/dealers, principal trading firms (PTFs/HFT), wholesalers, corporates (hedging), central banks, retail.
- **Claim (retail lore):** "Smart money vs dumb money."
- **Evidence:** `[EMP+]` Real heterogeneity is about *information, horizon, size and constraints*, not a single coordinated "smart money". PTFs handle ~56–60% of electronic interdealer US Treasury volume (Treasury data cited in SEC 2020). In FX, four centres (UK, US, Singapore, HK) host 75% of trading; UK alone 38% (BIS 2025).
- **Misuse:** Personifying the market ("they hunted my stop").
- **Sim:** Agent-based generator with labelled agent types; a post-session "who traded with you" breakdown (e.g., "62% of your fills were against the market-maker agent, 20% against the momentum agent").

**Institutions vs retail – practical differences** — B · 1.9
- **Def:** Institutions trade size relative to liquidity, so they care about impact and information leakage; retail trades tiny size and cares about spread, commission and behaviour.
- **Evidence:** `[MECH]` Broker algos (VWAP, TWAP, implementation shortfall, POV) slice parent orders (SEC 2020). ESMA: 74–89% of retail CFD accounts lose money; average losses €1,600–€29,000 per client (2018).
- **Sim:** "Be the institution": learner must buy 50,000 units within a session with an impact-aware cost score; then "be retail" with 10 units.

**Market makers and adverse selection** — I · 1.6
- **Def:** Liquidity providers quoting both sides, earning spread (plus rebates) and suffering *adverse selection* when informed traders hit them before price moves.
- **Evidence:** `[MECH][EMP+]` SEC 2020: passive market making earns spread and rebates, is "vulnerable to adverse selection", and generates enormous modification/cancellation traffic. Kyle (1985) and Glosten–Milgrom (1985) are the foundational models `[BK]`.
- **Sim:** "Play market maker": learner quotes both sides; the generator injects informed flow before news; P&L decomposes into spread captured vs adverse selection lost.

**HFT / principal trading firms** — A · market makers, latency
- **Def:** No statutory definition. SEC (2010 Concept Release, via SEC 2020) lists five traits: very fast programs; co-location and direct feeds; very short holding periods; many orders cancelled shortly after submission; ending flat. Strategy families: passive market making, arbitrage, structural (latency), directional (incl. order anticipation).
- **Evidence:** `[MECH][EMP~]` Latency-arbitrage response times reportedly fell from ~5 µs (2011) to ~300 ns (2018) (MacKenzie, cited by SEC). Effects on market quality are strategy- and condition-dependent; SEC staff warn against concluding from single studies.
- **Misuse:** "HFTs front-run my 1-lot" (they don't care about it individually), or "HFT = always bad".
- **Sim:** Expert scenario: learner's stale limit order gets picked off by a fast agent after a reference-price jump; app shows the latency timeline in microseconds.

### 1.10 Retail broker models
**Agency vs. principal; A-book / STP / ECN / B-book / hybrid** — B → I · 1.2, 1.8
- **Def:** *Agency/STP/A-book*: the broker passes your order to external liquidity and earns commission/markup. *ECN-style*: you access a multi-participant book. *B-book / market maker / dealing desk*: the broker is your counterparty and keeps your losses (and pays your profits), often hedging only aggregate exposure. *Hybrid*: the broker profiles clients and routes consistently profitable ones to A-book `[BK]` (industry practice, rarely documented publicly).
- **Identify:** Client agreement ("we act as principal/counterparty"), order execution policy, conflict-of-interest disclosures, last-look/requote language.
- **Claim:** Marketing claims ("no dealing desk", "true ECN") are often unverifiable from outside.
- **Evidence:** `[MECH][EMP+]` ESMA restricted retail CFDs in 2018: leverage caps 30:1 majors, 20:1 non-majors/gold/major indices, 10:1 other commodities/non-major indices, 5:1 single stocks, 2:1 crypto; 50% margin close-out per account; negative balance protection; mandatory "% of retail accounts lose money" warning. The B-book conflict is structural (client loss = broker revenue) and managed by regulation, not eliminated.
- **Misuse:** Believing a B-book broker must be "stop hunting"; or believing an A-book label guarantees good fills.
- **Sim:** Broker-type switch: identical strategy run under (a) STP with commission + raw spread, (b) B-book with wider spread and requotes/last look, (c) ECN with partial fills. App shows the broker's P&L next to the learner's.

**Last look (FX)** — A · 1.10
- **Def:** An electronic practice where the liquidity provider receiving a trade request gets a final window to accept or reject it at the quoted price.
- **Evidence:** `[MECH]` FX Global Code Principle 17 covers purpose, governance, use of information during the window (after the Dec 2017 revision, participants "should not undertake trading activity that utilises information from the client's trade request during the last look window") and disclosure. Reconfirmed in the GFXC's three-year review (2021).
- **Sim:** In "dealer FX" mode, a configurable % of fills are rejected when price moved against the dealer during a 50–200 ms window; learner sees reject statistics and their asymmetry.

### 1.11 FX market structure (special case)
**FX: OTC, tiered, internalised** — I · 1.2, 1.10
- **Def:** Spot FX trades OTC: interdealer venues (primary venues such as EBS and LSEG/Refinitiv Matching), multi-dealer platforms/ECNs, single-dealer platforms, prime-brokered access, retail aggregators/brokers.
- **Evidence:** `[EMP+]` $9.6 trillion/day in April 2025 (+28% vs 2022); USD on one side of 89% of trades (BIS Triennial 2025). Dealers internalise >80% of customer trades; much trading is "invisible" to the market (BIS Dec 2025). Spot internalisation was 63% in 2016 and ~80% in UK/US by 2019. Bilateral (non-transparent) trading gained share by 2022.
- **Consequence for teaching:** There is **no consolidated FX volume**; "volume" on retail FX charts is *tick volume* (count of price changes) at one broker. Order-flow tools on spot FX are approximations.
- **Sim:** FX module uses dealer-quote mode + tick-volume; contrast with futures module showing true exchange volume.

### 1.12 Volatility
**Volatility (realised, range-based, implied)** — B → I · 1.5
- **Def:** Dispersion of returns. Realised (std. dev. of returns), range-based (ATR = average true range), implied (from option prices).
- **Identify:** ATR(14) on the chart's timeframe; daily range vs. average daily range; volatility percentile.
- **Claim:** Size and stops should scale with volatility.
- **Evidence:** `[EMP+]` Volatility clusters (calm follows calm, storm follows storm) and is highly correlated with trading activity (Ito & Hashimoto 2006 for FX). Spreads widen when uncertainty rises.
- **Misuse:** Using fixed-pip stops across instruments and regimes.
- **Sim:** Regime switch in the generator (low/normal/high vol); learner sets stop distance in ATR multiples and sees stop-out rates change.

**Volatility regimes & clustering** — I · 1.12
- **Sim:** Show a volatility "heat strip" under the chart; ask the learner to predict tomorrow's range from today's; score vs. naive average.

### 1.13 Price discovery and information
**Informed flow, price impact, Kyle's lambda** — A · 1.9
- **Def:** Prices move because trades carry information; λ (lambda) = price change per unit of net order flow.
- **Evidence:** `[EMP+][BK]` Order flow is the proximate driver of short-run FX moves (Evans & Lyons 2002; Lyons 2001) – and Osler shows even *non-informative* order flow (stop-loss triggers) moves FX rates.
- **Sim:** Regress price change on signed volume per minute in the learner's session; show lambda rising when depth is thin.

---

## 2. Orders and execution

### 2.1 Market order
**Market order** — B · 1.5
- **Def:** Buy/sell immediately at the best available prices.
- **Identify:** Executes against resting liquidity; walks the book if size > top-level depth.
- **Claim:** Certainty of execution.
- **Evidence:** `[MECH]` Certainty of *execution*, not of *price*. In fast markets the fill can be far from the last price seen (SEC investor bulletins).
- **Misuse:** Market orders in thin pre-market, at news, or just after a halt reopens.
- **Sim:** Fill ticket shows each price level consumed ("10 @ 100.02, 25 @ 100.03, 15 @ 100.05 → avg 100.034") and slippage vs. the price on screen at click.

### 2.2 Limit order
**Limit order (marketable vs. resting/passive)** — B · 1.4
- **Def:** Buy at or below / sell at or above a specified price. If it can execute immediately it is *marketable* (takes liquidity); otherwise it *rests* (provides liquidity).
- **Evidence:** `[MECH]` Price certainty, execution uncertainty (SEC bulletin: a limit buy at $10 executes only at $10 or lower). A resting limit order is a free option granted to the market (Harris) `[BK]`: it fills most often when price moves through it – i.e., when you are "wrong" in the short run (adverse selection).
- **Misuse:** Chasing (repeatedly moving the limit), or not realising a "limit buy above market" fills instantly.
- **Sim:** Fill-probability heat map for resting limits; post-trade "adverse selection" stat: average move 1 min after your passive fills.

### 2.3 Stop (stop-market) order
**Stop order** — B · 2.1
- **Def:** Becomes a market order once a trigger (stop) price is reached. Buy stops sit above market; sell stops below.
- **Identify:** Trigger reference varies by broker: last trade vs. bid/ask quotes; check the rule (SEC bulletin).
- **Claim:** Limits losses.
- **Evidence:** `[MECH]` Not a price guarantee: gaps and fast markets fill beyond the stop. Short-term swings can trigger stops before price recovers. Stops cluster just beyond round numbers (Osler 2001/2003) and their triggering *amplifies* moves (Osler 2005 "price cascades").
- **Misuse:** Treating a stop as guaranteed; placing it at the most obvious level.
- **Sim:** Gap scenario: sell stop at 99.50, market opens at 98.70; ticket shows trigger price vs fill price and "gap slippage".

### 2.4 Stop-limit
**Stop-limit order** — B · 2.2, 2.3
- **Def:** Becomes a *limit* order when triggered.
- **Evidence:** `[MECH]` SEC example: sell stop 3.00 / limit 2.50 fills only at 2.50 or better – it can fail to execute entirely in a gap, leaving the position open.
- **Misuse:** Using stop-limits as protective stops in gap-prone markets.
- **Sim:** Same gap scenario run with stop-limit: position remains open, app shows an "unprotected" warning.

### 2.5 Trailing stop
**Trailing stop** — B · 2.3
- **Def:** A stop whose trigger follows price by a fixed amount/percentage/ATR multiple in the favourable direction and never moves back.
- **Evidence:** `[MECH]` Not available at all brokers; may be held server-side or client-side (platform must be online). Too-tight trails convert trends into many small wins and frequent stop-outs on noise. `[HEUR]` Structure-based trailing (below each new higher low) is the price-action alternative.
- **Sim:** Compare fixed, %-based, ATR-based and swing-based trailing on the same replay; equity curves side by side.

### 2.6 Market-if-touched / take-profit
**Take-profit (limit) and MIT/LIT** — B · 2.2
- **Def:** Take-profit is usually a resting limit. MIT becomes a market order when touched (used to buy dips/sell rallies with certainty of execution once touched).
- **Evidence:** `[EMP+]` Take-profit orders cluster *exactly at* round numbers (9.3% at "00" vs 4.4% for stop-losses) and tend to *reverse* price; stop-losses cluster *just beyond* and tend to *accelerate* price (Osler, FRBNY SR125).
- **Sim:** Learner places TP at 1.1000 vs 1.0995; the generator (with Osler-style clustering) shows partial fill/miss frequencies at round numbers.

### 2.7 OCO, OTO, bracket
**One-Cancels-Other (OCO)** — B · 2.2, 2.3
- **Def:** Two linked orders; when one executes, the other is cancelled (e.g., TP + SL; or breakout buy-stop above range + sell-stop below).
- **Misuse:** Assuming OCO is atomic across venues/brokers – a partial fill on one leg may not reduce the other leg proportionally.
- **Sim:** Range-breakout OCO drill; show the partial-fill edge case.

**Bracket / OTO (entry + stop + target)** — B · OCO
- **Def:** An entry order that, once filled, activates an OCO pair (SL + TP).
- **Sim:** Default trade ticket in the app: entry, stop, target, with live R-multiple and $-risk preview.

### 2.8 Time-in-force and conditions
**Day / GTC / GTD** — B · 2.2
- **Def:** Day = expires at session end; GTC = until cancelled (brokers often cap, e.g., 60–90 days) `[BK]`; GTD = until a date/time.
- **Misuse:** Forgotten GTC orders filling weeks later after a gap.
- **Sim:** Order blotter with expiries; a "forgotten order" scenario.

**IOC / FOK / AON** — I · 2.2
- **Def:** IOC = fill what you can immediately, cancel the rest. FOK = fill the whole quantity immediately or nothing. AON = all-or-none (may rest, but only fills in full).
- **Sim:** Send a 500-lot IOC into a 320-lot top level (limit at best price): 320 filled, 180 cancelled; FOK: nothing filled.

**Extended-hours eligibility** — B · 3.1
- **Def:** Many brokers accept only limit orders outside regular hours; spreads are wider and depth thinner.
- **Sim:** Pre-market session with wide spreads; market orders disabled with an explanation.

### 2.9 Auction orders
**MOO / LOO / MOC / LOC / imbalance-only** — I · 1.3
- **Def:** Orders that participate only in the opening/closing cross. Imbalance-only (IO) orders must be limit-priced and only offset on-open/on-close imbalances (Nasdaq).
- **Identify:** Nasdaq: order entry from 04:00 ET; opening imbalance data from 09:25, opening cross 09:30; closing imbalance from 15:50 (every 10 s 15:50–15:55 per FAQ), closing cross 16:00 ET.
- **Evidence:** `[MECH]` The closing cross sets the Nasdaq Official Closing Price, used by index providers (Russell, S&P, Dow Jones) – hence large passive/index flows.
- **Sim:** Closing-auction drill: learner sees NOII (paired shares, imbalance side/size, reference price) and decides whether to supply liquidity against the imbalance.

### 2.10 Hidden, iceberg, pegged, post-only
**Iceberg / reserve order** — I · 2.2, 2.12
- **Def:** Displays only a slice ("display quantity") of a larger order; the visible slice refills from a hidden reserve after each fill.
- **Identify:** Repeated refills at one price; traded volume at a level far exceeding displayed size.
- **Evidence:** `[MECH]` Some venues support native icebergs (e.g., display quantity on CME Globex `[BK]`); platforms also create *synthetic* icebergs by re-entering limit orders after each fill, so the exchange sees a series of new orders. Refilled slices typically go to the back of the queue `[BK]`.
- **Sim:** Learner can place an iceberg (Advanced) and also must detect agent icebergs (see 6.8).

**Hidden / non-displayed / midpoint peg** — A · 2.10
- **Def:** Non-displayed orders rest invisibly; midpoint pegs float at the NBBO mid. On most US exchanges displayed orders keep priority over non-displayed at the same price `[BK]`.
- **Sim:** Midpoint-peg order type in the two-venue sandbox; shows price improvement vs fill probability.

**Post-only (add-liquidity-only)** — A · 2.2, 2.18
- **Def:** Rejected or repriced if it would take liquidity; used to guarantee maker fees/rebates.
- **Sim:** Fee-schedule sandbox (maker rebate/taker fee).

### 2.11 Fills
**Fills, partial fills, average price, rejects, requotes** — B · 2.1, 2.2
- **Def:** A fill is an execution; partial fills split an order across prices/times; average price is size-weighted. A *requote* is a dealer declining your price and offering another; a *reject* is a refusal (risk checks, last look, price bands).
- **Evidence:** `[MECH]` Broker risk controls under the SEC Market Access Rule (15c3-5) block orders exceeding pre-set credit/capital thresholds or appearing erroneous.
- **Sim:** Fill log with timestamps; position average-price recalculation; reject reasons ("price band", "insufficient margin", "last look").

### 2.12 Queue priority
**Price-time priority (FIFO)** — I · 1.4
- **Def:** Best price first; at the same price, earliest order first.
- **Identify:** Your queue position = displayed size ahead of you at your price.
- **Evidence:** `[MECH]` FIFO handles ~70% of CME volume (ES, NQ, ZN, ZF, ZB, CL outrights, per Databento). Changing price, increasing quantity or changing account resets time priority (reducing size usually does not) `[MECH]` (NexusFi summary of CME rules; verify per venue).
- **Misuse:** Cancel/replace to "nudge" an order and losing the queue.
- **Sim:** Queue-position indicator ("you are 340th lot of 900 at 100.25"); a drill where moving your order loses priority and misses a fill.

**Pro-rata, LMM, top-order and hybrid algorithms** — A · FIFO
- **Def:** Pro-rata allocates incoming size in proportion to resting size (rounded down; leftovers FIFO); some products give a share to a Lead Market Maker or reward the first order that improves the market ("top order").
- **Evidence:** `[MECH]` CME uses FIFO, FIFO+LMM, a configurable FIFO/pro-rata split (e.g., ZT, ZQ, grains ≈12.7% of volume), top-order + pro-rata with minimums (SR3 ≈10.5%), threshold pro-rata + LMM (10-yr T-note options ≈4.6%) (Databento summary of CME Globex docs). Pro-rata incentivises oversizing resting orders.
- **Sim:** Matching-engine switch: same order flow under FIFO vs pro-rata; learner sees why size matters in pro-rata and time in FIFO.

### 2.13 Slippage
**Slippage** — B · 2.1
- **Def:** Difference between expected price (decision, arrival, or stop/trigger price) and actual fill. Can be negative (worse) or positive (better).
- **Identify:** Define the benchmark explicitly: decision price, arrival mid, trigger price.
- **Evidence:** `[MECH]` Causes: spread, depth consumed, latency (price moved before arrival), gaps, volatility, broker practices (asymmetric slippage – only negative passed on – is a red flag).
- **Misuse:** Backtesting without slippage; assuming slippage is always negative noise.
- **Sim:** Per-trade slippage column + histogram; a "latency" slider (0–500 ms) changes realised slippage.

**Implementation shortfall** — A · slippage
- **Def:** (Paper portfolio return at decision price) − (actual return), including delay, spread, impact, opportunity cost of unfilled shares (Perold 1988) `[BK]`.
- **Sim:** Institutional-execution mission scores the learner on implementation shortfall vs. arrival price.

### 2.14 Gaps through stops
**Gap risk / stop not guaranteed / guaranteed stops** — B · 2.3
- **Def:** When price jumps past your stop (overnight, weekend, news, halt), the stop fills at the first available price.
- **Evidence:** `[MECH]` SEC: in fast markets stop fills can be significantly away from the stop price. Halted stocks reopen via auction – stops can trigger at the reopening print. Some CFD brokers sell *guaranteed* stops for a premium.
- **Sim:** Weekend-gap and halt-reopen scenarios; compare loss with stop-market vs stop-limit vs guaranteed stop (fee).

### 2.15 Market impact
**Market impact (temporary vs permanent; walking the book)** — I → E · 1.7, 2.1
- **Def:** Price movement caused by your own trading. Temporary impact decays after you stop; permanent impact reflects information the market inferred.
- **Identify:** Mid before vs during vs after your execution.
- **Claim / evidence:** `[EMP+]` The "square-root law": impact ≈ Y·σ·√(Q/V) (Q = order size, V = daily volume, σ = daily volatility, Y ≈ order 1) is one of the most robust empirical regularities (Tóth, Bouchaud et al., *PRX* 2011, explain it via small local liquidity; formula form `[BK]`). Optimal execution trades off impact vs. timing risk (Almgren–Chriss 2000) `[BK]`.
- **Misuse:** Retail ignores impact (fine at 1 lot) but then scales up without changing execution.
- **Sim:** "Scale-up challenge": same strategy at 1×, 10×, 100× size; impact model in the engine shows edge decaying.

### 2.16 Execution algorithms
**VWAP / TWAP / POV / Implementation-shortfall algos** — A · 2.15, 6.11
- **Def:** Broker algorithms that slice a parent order: VWAP (track volume curve), TWAP (equal time slices), POV (fixed % of volume), IS (minimise cost vs decision price) (SEC 2020).
- **Evidence:** `[MECH]` Ubiquitous among institutions; creates predictable intraday flow patterns (and order-anticipation strategies targeting them).
- **Sim:** Learner configures a VWAP algo for a 50k parent order; app plots child orders vs. market volume curve and the resulting cost vs. VWAP.

### 2.17 Latency
**Latency and stale quotes** — A · 1.9
- **Def:** Delay between event and your reaction (data + decision + order transit).
- **Evidence:** `[MECH]` Co-location, microwave links, direct feeds; slower participants trade against stale prices (SEC 2020).
- **Sim:** Latency slider; pick-off scenario.

### 2.18 Total transaction-cost model
**All-in cost: commission + spread + exchange/regulatory fees + financing/swap + slippage + impact** — B → I · 2.1–2.15
- **Def:** Everything that separates gross from net P&L.
- **Evidence:** `[MECH]` Maker-taker: most US exchanges pay rebates to liquidity providers and charge takers (SEC 2020). Financing applies to leveraged/CFD/FX positions held over rollover (see 3.8).
- **Misuse:** Strategy looks profitable gross, loses net (especially high-frequency scalping).
- **Sim:** Every session ends with a waterfall chart: gross P&L → −spread → −commission → −swap → −slippage → net.

### 2.19 Short selling (brief)
**Short selling** — B → I · 2.1
- **Def:** Selling borrowed shares (or opening a short in futures/CFDs/FX) to profit from a decline.
- **Evidence:** `[MECH]` Equities: borrow availability/fees; US Rule 201 (alternative uptick rule) restricts shorting at or below the national best bid after a 10% daily decline `[BK]`. Losses are theoretically unlimited; squeezes.
- **Sim:** Borrow fee and "hard-to-borrow" flag on some synthetic stocks; short-squeeze scenario.

### 2.20 Halts and orders
**Order handling during halts / pauses** — I · 3.12
- **Def:** During a halt, continuous matching stops; on reopening an auction is run; resting orders may participate.
- **Evidence:** `[MECH]` Nasdaq halt codes: T1 news pending, T2 news released, T5 single-stock pause (10%+ move in 5 min), T6 extraordinary activity, T12 information requested, H10 SEC suspension, LUDP/M volatility pauses, MWC1–3 market-wide circuit breakers (Nasdaq Trader).
- **Sim:** Halt scenario with code banner, auction reopening, and stop orders triggering at the reopening print.

---

## 3. Sessions and time

### 3.1 Trading hours by asset class
**Trading-hours map** — B · 1.1
- **Def:** When each market is open, and which session is "primary" (most liquid).
- **Identify (typical, verify per venue; times ET unless noted):**

| Asset class | Hours (typical) | Notes |
|---|---|---|
| US equities | Regular 09:30–16:00 ET; pre-market from 04:00; after-hours to ~20:00 | Nasdaq order entry starts 04:00; opening cross 09:30; closing cross 16:00 (Nasdaq Trader). `[MECH]` |
| US equity-index futures (e.g., E-mini S&P) | Sun 18:00 – Fri 17:00 ET, daily 17:00–18:00 ET maintenance break | "Overnight/ETH" vs "RTH" (09:30–16:00) distinction matters for highs/lows, gaps and profiles `[BK]` |
| London Stock Exchange | Opening auction call to 08:00 UK; continuous 08:00–16:30; closing auction ~16:30–16:35 with random end | Price-monitoring extensions can delay the open up to ~08:30:30 (LSE factsheet). `[MECH]` |
| Spot FX | ~Sun 17:00 ET (Wellington/Sydney) to Fri 17:00 ET, continuous | Value-date rollover at 17:00 New York `[BK]` |
| Crypto | 24/7 | Liquidity still cycles with US/EU/Asia working hours |
| Government bonds / IRS | OTC, dealer hours; futures on Globex | Mostly RFQ/dealer |

- **Misuse:** Treating a "24-hour" market as equally liquid all day.
- **Sim:** A world-clock strip above the chart showing which sessions are open, with expected spread/volume bands per hour (synthetic liquidity calendar).

### 3.2 FX sessions and overlaps
**Sydney / Tokyo / London / New York sessions** — B · 3.1
- **Def:** Conventional regional windows of FX dealing activity. Approximate (UTC, shifting with DST): Sydney 21:00/22:00–06:00; Tokyo 00:00–09:00; London 07:00/08:00–16:00/17:00; New York 12:00/13:00–21:00/22:00. The London–New York overlap (~08:00–11:00/12:00 ET) is the most liquid window `[BK]`.
- **Claim:** Breakouts work better in London; Asia "ranges".
- **Evidence:** `[EMP+]` Ito & Hashimoto (NBER WP 12413): on the EBS platform, deal counts, price changes and volatility show a U-shape within Tokyo and London business hours (not in New York); activity and volatility are highly correlated; more deals ↔ narrower spreads. Osler's bank order book: dollar-yen order placement peaked Asia afternoon/London morning; other pairs London afternoon/NY morning. FX activity is concentrated: UK 38% of global turnover (BIS 2025).
- **Misuse:** Hard-coding session times without DST; assuming a session "role" (e.g., "London always sets the high/low of day") is a rule.
- **Sim:** Session shading on charts; a "guess the session" game: the app shows unlabeled 24h volatility profiles and the learner identifies sessions.

**Session overlaps & DST transitions** — I · 3.2
- **Def:** US and EU change clocks on different dates (≈2–3 weeks apart in March and ~1 week in Oct/Nov), temporarily shifting overlaps.
- **Sim:** Calendar event in the generator: overlap shifts by an hour for the DST-mismatch weeks; learner's time-based rules are tested against it.

### 3.3 Intraday liquidity cycle
**U-shaped (or "smile") intraday volume and volatility** — B · 3.1
- **Def:** In equities, volume and volatility are highest near the open and close and lowest around midday ("lunch lull").
- **Evidence:** `[EMP+]` Well-documented in equities `[BK]`; FX shows U-shapes within regional sessions (Ito & Hashimoto). The close concentrates index/passive flow (SEC 2020: auctions' rising importance).
- **Misuse:** Using the same stop width at 09:31 and 12:30.
- **Sim:** Synthetic intraday volume curve; the learner's stop-out rate by hour is displayed in the journal.

### 3.4 Opening and closing auctions
**Opening auction / closing auction** — I · 1.3, 2.9
- **Def:** Single-price crosses that start and end the regular session.
- **Identify:** Indicative price + imbalance messages during the call period (Nasdaq NOII; LSE indicative uncross price).
- **Claim:** "The open shows overnight sentiment; the close is where institutions trade."
- **Evidence:** `[MECH][EMP+]` Closing prices are benchmarks for index products and funds; NYSE ~34% of its volume in auctions (2019). LSE opening auction has staged price-monitoring extensions (e.g., 2%, 5%, 10%, 20%, 50%) if the indicative price is too far from the previous close.
- **Sim:** See 1.3 auction mini-game; plus "closing imbalance" scenario where a large MOC buy imbalance is published at 15:50 and the learner trades (or not) into it.

**Index rebalance / expiration days ("witching")** — A · 3.4
- **Def:** Days with mechanical flows (index reconstitution, quarterly futures/options expiry).
- **Evidence:** `[MECH]` Large closing-auction volumes; options pinning near large open-interest strikes has been documented (Ni, Pearson & Poteshman 2005) `[BK]`.
- **Sim:** Calendar flag; generator increases close volume and adds pinning behaviour around a strike.

### 3.5 Opening range and initial balance
**Opening range (OR) / Opening range breakout (ORB)** — I · 3.3, 4.7
- **Def:** High–low of the first N minutes (5, 15, 30, 60) of the primary session. ORB trades a break of that range.
- **Identify:** Fix N in advance; define break by close or by stop entry one tick beyond.
- **Claim:** Early range defines the day; breaks have follow-through.
- **Evidence:** `[HEUR][EMP~]` Popularised by Toby Crabel (1990) `[BK]`; results are highly instrument-, period- and filter-dependent; costs and false breaks dominate small ranges.
- **Misuse:** Trading every OR break without a volatility/context filter.
- **Sim:** OR box auto-drawn; learner backtests ORB on 200 synthetic days (with and without a "trend-day" generator bias) and sees the equity curve with costs.

**Initial balance (IB, Market Profile)** — I · 6.13
- **Def:** Range of the first two 30-minute periods (first hour) of the regular session; *range extension* = trade beyond the IB.
- **Evidence:** `[HEUR]` Used to classify day types (trend vs rotational) (eSignal/LuxAlgo Market Profile notes).
- **Sim:** IB box and live day-type classifier; learner predicts day type at 10:30 and is scored at the close.

### 3.6 Overnight vs regular session
**Globex/ETH vs RTH; overnight high/low** — I · 3.1
- **Def:** For index futures, the overnight session's extremes and the RTH open are reference levels.
- **Evidence:** `[HEUR]` Widely watched levels can attract stops (Osler-style clustering logic) but no specific predictive guarantee.
- **Sim:** Toggle "RTH only" vs "24h" chart; the same "gap" disappears on the 24h chart – teaches that gaps are a charting artefact of session choice.

### 3.7 Gaps
**Price gaps (opening, common, breakaway, runaway, exhaustion)** — B → I · 3.1, 4.3
- **Def:** A range with no trading between consecutive bars. *Opening gap*: today's open ≠ prior close. Classical taxonomy: common (inside range, often filled), breakaway (out of a range), runaway/measuring (mid-trend), exhaustion (late, reverses) `[BK]`.
- **Identify:** Gap up: current low > prior high (full gap) or open > prior close (opening gap).
- **Claim:** "Gaps always fill."
- **Evidence:** `[EMP~]` "Always fill" is false: some never fill. Revisit rates are largely a base-rate effect of random price paths (see the FVG random-walk test in 5.9: gaps revisited ≈ as often as random levels at the same distance). Breakaway gaps on news may carry information.
- **Misuse:** Fading every gap.
- **Sim:** Gap scanner over 1,000 synthetic sessions with a *random-walk control* run; learner compares fill rates and sees how much is base rate.

**Weekend gaps (FX, futures, crypto venue-specific)** — B · 3.7
- **Def:** Price difference between Friday close and Sunday open when news arrives while markets are closed.
- **Sim:** Weekend-news generator event; stop-gap demo (2.14).

### 3.8 Rollover
**FX rollover / swap / carry** — I · 3.1, 2.18
- **Def:** Spot FX settles T+2 (USD/CAD T+1); positions open at 17:00 New York are rolled to the next value date, paying/receiving the interest differential (swap/financing). Wednesday's roll usually charges three days because it spans the weekend in value dates `[BK]`.
- **Misuse:** Ignoring swap on multi-day CFD/FX trades; mistaking the 17:00 spread blow-out for a "signal".
- **Sim:** Swap column in positions; spread widening at 17:00 NY in the generator; triple-swap Wednesday.

**Futures roll and continuous contracts** — I · futures basics
- **Def:** Futures expire; traders roll to the next contract. Continuous charts splice contracts (unadjusted, back-adjusted, ratio-adjusted).
- **Evidence:** `[MECH]` Unadjusted continuous charts show artificial "gaps" at roll; volume migrates over roll week.
- **Sim:** Show the same history with and without back-adjustment; ask the learner which "gap" is real.

### 3.9 Weekends, holidays, seasonality of liquidity
**Holidays, half-days, seasonal liquidity** — B · 3.3
- **Def:** Thin liquidity around holidays (e.g., US Thanksgiving, Christmas–New Year, August in Europe); one market closed while another is open (e.g., US holiday during London session).
- **Evidence:** `[MECH]` Thin books → wider spreads, larger impact, more erratic moves.
- **Sim:** Holiday calendar in the generator; reduced depth and wider spreads; learner's journal tags trades taken in holiday conditions.

### 3.10 Scheduled events
**Macro releases, central-bank decisions, earnings** — B · 1.7
- **Def:** Scheduled information events (NFP, CPI, FOMC/ECB, earnings) that cause liquidity withdrawal before and repricing after.
- **Evidence:** `[MECH][EMP+]` Liquidity providers pull or widen quotes pre-release; spreads spike; slippage on stops is common. (Fundamental content is covered by R4.)
- **Sim:** Economic calendar in the app; at T−60 s depth drops and spreads widen; at T0 a jump with a configurable surprise; learner chooses flat/hedged/stop-type and sees the outcome distribution over 100 random surprises.

### 3.11 Fixes and month-end
**WM/Reuters 4 pm London fix; month/quarter-end** — A · 3.2
- **Def:** Benchmark FX rates calculated in a short window around 16:00 London; large passive flows trade at the fix (window lengthened to 5 minutes after the 2013–15 manipulation scandals) `[BK]`. Month-/quarter-end portfolio rebalancing flows.
- **Evidence:** `[EMP+][BK]` Documented volatility/volume spikes around the fix; manipulation fines (2014–15).
- **Sim:** Generator spike in volume at "16:00 London" on synthetic FX; learner sees the fix print and its effect on spreads.

### 3.12 Halts, price limits and circuit breakers
**Market-wide circuit breakers (US)** — I · 1.7
- **Def:** Cross-market halts on S&P 500 declines from prior close: Level 1 −7% and Level 2 −13% → 15-minute halt (only if before 15:25 ET); Level 3 −20% → closed for the day.
- **Evidence:** `[MECH]` Level 1 triggered four times in March 2020 (9, 12, 16, 18 March); Levels 2–3 never (SEC 2020).
- **Sim:** "Crash day" scenario with MWCB banner and reopening.

**Limit Up–Limit Down (single-stock)** — I · 3.12
- **Def:** Price bands around a 5-minute reference price (5%, 10%, 20% or lesser of $0.15/75% by tier and price); if the NBBO sits at a band for 15 s → 5-minute pause, then reopening auction at the primary listing exchange.
- **Evidence:** `[MECH]` Plan made permanent after a 2012–13 pilot; bands wider for less liquid tier (SEC 2020; investor.gov).
- **Sim:** Visual LULD bands on the chart; orders outside bands rejected; pause + auction.

**European volatility auctions (LSE AESP)** — A · 1.3
- **Def:** If a potential execution breaches dynamic (vs last trade) or static (vs last auction) tolerances (e.g., ±5% / ±10% for ETPs), execution is suspended and a 5-minute auction starts, possibly extended by price-monitoring extensions and a 2-minute market-order extension, each followed by a random end of up to 30 s (LSE factsheet).
- **Sim:** "EU venue" mode: order that would cross the tolerance triggers an auction instead of a fill.

**Futures price limits / velocity logic** — A · 3.12
- **Def:** Daily price limits and short-term velocity pauses on futures venues `[BK]`.
- **Sim:** Optional in futures mode.

### 3.13 Killzones (ICT label)
**Killzones** — I · 3.2 — `[MKT]` ≈ "session-open volatility windows"
- **Def:** ICT name for time windows (New York time): Asian ~20:00–00:00, London open ~02:00–05:00, New York AM ~07:00–10:00 (index futures 08:30–11:00), London close ~10:00–12:00, NY PM ~13:30–16:00. Sources disagree by 30–90 min.
- **Claim:** Setups inside killzones are higher quality; London often sets the day's high/low; NY extends or reverses London.
- **Evidence:** `[EMP~]` The *volatility/liquidity* part is real (session opens/overlaps; Ito & Hashimoto). The *directional roles* are tendencies with real failure rates; no published evidence of a directional edge. LuxAlgo itself calls it "only a time filter".
- **Misuse:** Treating a time window as a signal.
- **Sim:** Overlay killzones; journal statistics comparing learner's results inside vs outside windows; random-walk control shows that range-break frequency rises simply because volatility rises.

### 3.14 Liquidity cycles (summary concept)
**Liquidity cycles: intraday, weekly, monthly, seasonal** — I · 3.3–3.11
- **Def:** Predictable variation of liquidity with clock and calendar.
- **Sim:** "Liquidity weather" widget (expected spread/depth now vs average) shown before every order.

---

## 4. Price action

> Al Brooks material: Brooks's books (*Reading Price Charts Bar by Bar*, 2009; *Trends*, *Trading Ranges*, *Reversals*, 2011–12) and his course define a large vocabulary. Exact glossary wording sits behind his books/course; definitions below follow the standard usage of his material and forum quotes, and are tagged `[HEUR]` because Brooks presents them as discretionary probabilities, not tested statistics.

### 4.1 Bars and candles
**OHLC bar / candlestick anatomy** — B · none
- **Def:** Open, high, low, close per period; body = |close−open|; upper/lower tails (wicks).
- **Identify:** Bull bar close > open; bear bar close < open.
- **Misuse:** Reading single candles without context; forgetting that bar shape depends on timeframe and session boundaries.
- **Sim:** Build-a-candle: ticks stream in and the learner watches the candle form; then "same ticks, different timeframe".

**Trend bar vs doji** — B · 4.1
- **Def (Brooks):** A *trend bar* has a meaningful body (it closed away from its open – one side "won" the bar); a *doji* has a small or no body (balance; "one-bar trading range").
- **Identify:** Body ≥ ~50% of range and close near the extreme = strong trend bar (convention; Brooks uses judgement relative to recent bars).
- **Claim:** Consecutive strong trend bars = urgency/momentum; dojis = uncertainty.
- **Evidence:** `[HEUR]`
- **Misuse:** Labelling by colour only.
- **Sim:** Learner tags 50 bars as trend/doji; app compares with a body/range rule and shows disagreements.

### 4.2 Swing highs and lows
**Swing high / swing low (pivot, fractal)** — B · 4.1
- **Def:** A local extreme. Mechanical definition: bar *i* is a swing high if its high is the highest of the N bars on each side (N=2 → Williams "fractal"; N=3–5 common).
- **Identify:** Requires N bars *after* the pivot → confirmation is delayed by N bars (repainting risk in indicators).
- **Claim:** Swings define structure and stop locations.
- **Evidence:** `[MECH]` The definition is a parameter choice; different N produce different structure maps – a central source of subjectivity in BOS/CHoCH (LuxAlgo: "page does not specify… depends on your structure map").
- **Misuse:** Marking swings in hindsight that could not have been known in real time.
- **Sim:** Slider for N; structure labels redraw live; "real-time mode" only confirms swings after N bars to show the lag.

### 4.3 Market structure (Dow)
**HH / HL / LH / LL; trend definition** — B · 4.2
- **Def:** Uptrend = higher highs and higher lows; downtrend = lower highs and lower lows (Dow theory). Break of the last higher low = first sign of failure.
- **Identify:** Sequence of confirmed swings at a fixed N; label each relative to the previous same-type swing.
- **Claim:** Trade with structure; structure breaks warn of reversal.
- **Evidence:** `[HEUR][EMP~]` Trend-following has long-horizon empirical support in futures (time-series momentum, Moskowitz–Ooi–Pedersen 2012 `[BK]`) but swing-label rules intraday are untested as such. SMC's BOS/CHoCH are relabelled Dow structure (see §7).
- **Misuse:** Calling a trend after one higher high; ignoring timeframe (an uptrend on 5-min can be a pullback on daily).
- **Sim:** Auto-labelled swings; learner predicts "trend continues / range / reverses" at checkpoints; scored over 100 synthetic charts including a random-walk control set.

**Internal vs external (swing) structure** — I · 4.3
- **Def:** External = major swings defining the trend; internal = minor swings inside a leg.
- **Sim:** Two N values displayed simultaneously (e.g., N=2 internal, N=10 external).

### 4.4 Trend vs range
**Trend vs trading range** — B · 4.3
- **Def:** Trend: directional movement with pullbacks that do not overlap much. Trading range: overlapping bars, failed breakouts, two-sided trade. Brooks: decide first whether the market is in a trend or range; in a trend, whether it is in a *breakout* (spike) or a *channel*.
- **Identify (practical):** Bar overlap %, slope of 20-EMA, ADX, sequence of swings, range-bound oscillation between a high and low tested ≥2 times.
- **Claim:** Different tactics: trend → buy pullbacks/stop entries; range → buy low/sell high, scalp, fade breakouts.
- **Evidence:** `[HEUR]` Brooks: "most bars leave traders confused", probability of most setups ~40–60%; higher in brief strong breakouts.
- **Misuse:** Using breakout tactics in ranges and fading in trends.
- **Sim:** Regime-classification game (trend/range/breakout/channel) with generator ground-truth for synthetic regimes.

### 4.5 Trend lines and channels
**Trend line, channel, tight vs broad channel, micro channel** — I · 4.3
- **Def:** Lines through swing lows (uptrend) or highs; channel = parallel line on the other side. Tight channel = small pullbacks, strong trend; broad channel = deep pullbacks, trend weakening toward a range. *Micro channel* (Brooks) = series of bars where no bar's low is below the prior bar's low (bull) – very strong.
- **Evidence:** `[HEUR]`
- **Misuse:** Redrawing lines until they fit.
- **Sim:** Learner draws a line; app scores touches *before* vs *after* drawing (only the latter count).

### 4.6 Pullbacks
**Pullback / retracement** — B · 4.3
- **Def:** Counter-trend move inside a trend.
- **Identify:** Depth in % of the prior leg (38.2/50/61.8 Fibonacci convention), in ATR, or in bars.
- **Evidence:** `[EMP~]` 50% and Fibonacci retracements are practitioner conventions (Osler 2000 lists them among S/R-generation rules); no evidence Fibonacci ratios are special vs other ratios.
- **Sim:** Retracement-depth histogram on synthetic trends vs random walk.

**Bar counting: High 1 / High 2 / Low 1 / Low 2 (Brooks)** — I · 4.6, 4.10
- **Def:** In a bull pullback, the first bar whose high exceeds the prior bar's high is H1; after the pullback resumes and another bar exceeds the prior high, H2 (mirror L1/L2 in bear rallies). H3 is associated with wedge flags; a fourth attempt suggests the trend is becoming a range.
- **Identify:** Count bars (not swings); count resets at a new trend extreme. Standard entry: buy stop one tick above the H2 signal bar; stop below the signal bar or pullback low. Context: trend making HH, price holding above a rising 20-bar EMA.
- **Claim:** The first attempt to resume often fails; H2 (second entry) is the better entry; in strong trends H1 works; in weak trends/ranges wait for the second entry.
- **Evidence:** `[HEUR]` No published statistics (LuxAlgo summary).
- **Misuse:** Counting in sideways markets with no trend; ignoring signal-bar quality.
- **Sim:** H/L counter overlay that the learner can hide; drill: label H1/H2 on 30 pullbacks, then trade them with stop entries; journal shows win rate by count.

**Two-legged pullback (ABC)** — I · 4.6
- **Def:** Pullback in two legs (A down, B bounce, C down to a new pullback low) followed by an H2 signal; Brooks's view that corrections tend to have two legs.
- **Claim:** It traps counter-trend traders who shorted the first leg.
- **Evidence:** `[HEUR]`
- **Sim:** Pattern-highlight drill; count of two-legged vs one-legged pullbacks on synthetic data vs random walk.

### 4.7 Breakouts
**Breakout, follow-through, breakout pullback/test** — B → I · 4.4
- **Def:** Price moves beyond a range boundary/swing. Follow-through = the next bar(s) continue. Breakout pullback = a return toward the breakout level that holds.
- **Identify:** Define break by close beyond, by a tick beyond, or by a stop entry; strong breakout = large trend bar closing near its extreme, followed by another trend bar.
- **Claim:** Strong breakouts have high probability of a measured move (Brooks says 60–80% in the strongest cases).
- **Evidence:** `[HEUR][EMP~]` Osler (FRBNY SR125): trends accelerate after crossing round-number levels because stop-loss orders cluster just beyond them – a microstructural basis for breakout follow-through.
- **Misuse:** Buying the 4th consecutive bar of a breakout at the top of a range without a stop plan.
- **Sim:** Breakout drill with a "follow-through meter" (next 3 bars' net progress in ATR).

### 4.8 Failed breakouts and traps
**Failed breakout / false breakout / trap** — I · 4.7
- **Def:** Price breaks a level but quickly reverses back inside, trapping breakout traders.
- **Identify:** Close back inside the range within 1–3 bars; reversal bar.
- **Claim (Brooks):** ~80% of attempts to break out of a trading range fail (Brooks's heuristic) `[HEUR][BK]`; most reversal attempts in trends also fail.
- **Evidence:** `[EMP~]` Same event appears as "liquidity sweep", "swing failure pattern", Sperandeo's "2B", "turtle soup" (fade of 20-day breakout). One unreviewed preprint (Mahadzva 2026, G10 FX) found swept levels predicted *continuation*, the opposite of the reversal story; Osler 2005 shows trends *accelerate* through stop clusters.
- **Misuse:** Fading every break; calling it "failed" before the bar closes.
- **Sim:** Replay with branching outcomes: learner decides "breakout or failure?" at each break; app reveals; generator includes realistic stop clustering so both outcomes occur.

### 4.9 Signal bars and entry bars
**Signal bar** — I · 4.1, 4.4
- **Def (Brooks):** The bar immediately before the entry triggers; the setup bar whose extreme defines the stop-entry price.
- **Identify (good bull reversal signal bar, convention):** bull body, close in upper part (ideally above the midpoint and the open), meaningful lower tail (rejection), small upper tail, not excessively large, limited overlap with prior bars, at a meaningful location (support, trendline, prior low, measured-move target). Mirror for bear.
- **Claim:** Good signal bars at good locations increase probability.
- **Evidence:** `[HEUR]`
- **Misuse:** Taking a great-looking bar in the middle of a range.
- **Sim:** Signal-bar grader: learner rates bars 1–5; app shows rule-based score and the outcome distribution.

**Entry bar** — I · 4.9
- **Def:** The bar during which the entry order fills. Its close (strong/weak) is the first information about the trade.
- **Sim:** Entry-bar-quality feedback in the journal.

**Reversal bar** — I · 4.9
- **Def:** Bar that opens near one extreme and closes near the other with a tail on the rejection side (hammer/shooting star overlap).
- **Sim:** Same grader.

### 4.10 Inside and outside bars
**Inside bar / ii / iii** — I · 4.1
- **Def:** Inside bar: high ≤ prior high and low ≥ prior low (Brooks allows equal). ii = two consecutive inside bars; iii = three.
- **Claim:** Contraction → breakout; ii/iii are small-range setups (tight stop).
- **Evidence:** `[HEUR]`
- **Sim:** Scanner marks inside bars; learner trades break of an ii with OCO stop entries.

**Outside bar / ioi** — I · 4.10
- **Def:** Outside bar: high > prior high and low < prior low. ioi = inside–outside–inside sequence (a breakout-mode pattern).
- **Claim:** Outside bars in ranges mean confusion; in trends with strong close, they can be continuation.
- **Sim:** Outcome statistics in the generator vs random-walk control.

### 4.11 Wedges
**Wedge / three pushes / wedge flag** — I · 4.3, 4.5
- **Def:** Three pushes in the trend direction with diminishing momentum (converging lines usually, but Brooks allows non-converging three-push patterns). Wedge flag = three-push pullback (H3/L3).
- **Claim:** Wedges are the primary counter-trend reversal setup (often reverse in two legs); failed wedges can produce a measured move ≈ wedge height.
- **Evidence:** `[HEUR]` (Brooks/NexusFi summaries; no published stats).
- **Sim:** Wedge annotation drill; learner marks pushes 1–2–3; the app evaluates subsequent two-legged correction frequency.

### 4.12 Measured moves
**Measured move (leg1 = leg2; range height projection)** — I · 4.6, 4.7
- **Def:** Projection where the second leg equals the first (AB=CD style), or a breakout from a range travels roughly the range's height; also "gap" measured moves (midpoint of a breakout gap).
- **Claim:** Targets for profit-taking; markets often reach them.
- **Evidence:** `[HEUR][EMP~]` Self-fulfilling clustering of take-profit orders is plausible (Osler shows TP clustering at round numbers); no strong evidence for the specific ratio.
- **Sim:** Measured-move tool; journal tracks hit-rate of MM targets vs. arbitrary targets at the same distance.

### 4.13 Spike and channel, climaxes
**Spike and channel** — A · 4.5, 4.7
- **Def:** Strong breakout (spike) followed by a weaker trending channel; Brooks's common trend template; channel often retraced to its start.
- **Evidence:** `[HEUR]`
- **Sim:** Generator template + labelled replays.

**Climax / buy climax / sell climax / exhaustion** — I · 4.7
- **Def:** Unusually large trend bars late in a trend (often with volume spike) followed by reversal or a trading range; Wyckoff's buying/selling climax.
- **Identify:** Bar range ≫ recent average (e.g., >2–3× ATR) late in an extended move, at a target/resistance, followed by failure to extend.
- **Evidence:** `[HEUR]` "Effort vs result" logic (Wyckoff).
- **Sim:** Climax detector; learner chooses exit timing; app compares exits.

### 4.14 Classical patterns
**Double tops/bottoms, head & shoulders, triangles, flags, final flag** — B → I · 4.3
- **Def:** Classical chart patterns (Edwards & Magee). Brooks variants: double-top bear flag, double-bottom bull flag, final flag (last flag before reversal).
- **Evidence:** `[EMP~][BK]` Lo, Mamaysky & Wang (2000, *JF*) found several patterns provide incremental information on US stocks (non-zero but small); broader surveys (Park & Irwin 2007) find mixed TA profitability, diminishing post-1990s, and serious data-snooping concerns (Sullivan, Timmermann & White 1999).
- **Misuse:** Pattern recognition after the fact; ignoring base rates.
- **Sim:** Pattern quiz with 50% of charts generated by a random walk; learner's "pattern found" rate on random data is reported (teaches apophenia).

### 4.15 Momentum vs exhaustion
**Momentum vs exhaustion reading** — I → A · 4.1, 4.7, 4.13
- **Def:** Momentum = consecutive strong trend bars, closes near extremes, small pullbacks, gaps between bars (e.g., a bar's low above an earlier bar's high). Exhaustion = expanding bars after a long move, increasing overlap, tails against the trend, failure to follow through, divergence vs an oscillator or delta.
- **Identify (checklist):** consecutive trend-bar count; average body/range; overlap %; pullback depth; distance from 20-EMA in ATR.
- **Evidence:** `[HEUR]` Dual reading is the core skill and the core ambiguity (a strong bar can be breakout or climax).
- **Sim:** "Strength meter" computed from the checklist; learner predicts continuation vs exhaustion; calibration chart over time.

### 4.16 Always In
**Always In (Brooks)** — A · 4.4, 4.7
- **Def:** If you were forced to hold a position right now, long or short? If neither is clearly better, there is no clear Always-In direction.
- **Evidence:** `[HEUR]` Brooks (*Reversals*, ch. 15, via forum quote): "a swing concept that applies to trends, and is dangerous within trading ranges"; judged on the traded timeframe.
- **Sim:** "Forced position" prompts every N bars; app tracks the learner's AI calls vs subsequent N-bar returns.

### 4.17 Trader's equation and second entries
**Trader's equation (expectancy)** — B → I · risk basics
- **Def:** P(win)·Reward > P(loss)·Risk (+ costs). Brooks pairs ~60% setups with ≥1:1 and ~40% setups (most reversals) with ≥1:2 reward:risk.
- **Evidence:** `[MECH]` The equation is arithmetic; the probability estimates are subjective `[HEUR]`. Costs must be in the equation.
- **Misuse:** High R:R targets with no realistic probability; ignoring that tighter stops lower win rate.
- **Sim:** Every ticket requires a probability estimate; journal produces a calibration plot (predicted vs realised win rate) and net expectancy.

**Second entry / traps** — I · 4.6, 4.8
- **Def:** Taking the second signal in a direction after the first failed (H2/L2, second leg), because the failure trapped traders who now exit in your direction.
- **Sim:** Labelled replays highlighting trapped traders' stop location.

### 4.18 Multi-timeframe analysis
**Higher-timeframe context, lower-timeframe execution** — I · 4.3
- **Def:** Determine bias/levels on a higher timeframe; time entries on a lower one.
- **Evidence:** `[HEUR]` Multiplies degrees of freedom (overfitting risk).
- **Misuse:** Timeframe-hopping until a chart agrees with you.
- **Sim:** Synchronised multi-timeframe panes; journal records which timeframe drove each decision.

### 4.19 Moving averages as context
**20-bar EMA (Brooks) / moving averages** — B · 4.1
- **Def:** Smoothed price; used as trend filter and pullback reference.
- **Evidence:** `[EMP~]` Simple MA rules showed predictive ability in old samples (Brock, Lakonishok & LeBaron 1992) that weakened later and is sensitive to data snooping `[BK]`.
- **Sim:** EMA overlay; "gap bar" (bar entirely away from EMA) counter.

### 4.20 Evidence on TA generally
**What research says about price action/TA** — I · all of §4
- **Def:** Meta-lesson.
- **Evidence:** `[EMP+]` Published S/R levels from six FX firms predicted intraday trend interruptions better than arbitrary levels: bounce frequency 60.8% vs 56.2%; significant for most firm-currency pairs; effect persisted 5 days; firms' "strength" ratings were useless; firms agreed only ~30% of the time (Osler 2000). Effect real but modest, and *profitability after costs was not established*. Data-snooping, survivorship and hindsight bias are the main threats.
- **Sim:** "Edge lab": learner proposes a rule; app backtests on synthetic data with costs, runs it on random-walk control, and reports out-of-sample degradation.

---

## 5. Liquidity and zones

### 5.1 "Liquidity" in chart-reading language
**Resting liquidity / liquidity pools** — I · 1.7, 2.3
- **Def:** Concentrations of resting orders (limit orders, take-profits, and – most importantly for chart traders – stop orders that become market orders when triggered).
- **Identify:** Plausible locations: beyond obvious swing highs/lows, equal highs/lows, prior day/week/session extremes, range boundaries, round numbers.
- **Claim:** Price is "drawn" to liquidity.
- **Evidence:** `[EMP+]` Order clustering is real: in 9,667 conditional orders at a large FX dealing bank, requested prices clustered at round numbers (~8.7% at "00"); stop-loss buys clustered *just above* round numbers (14.4% at xx01–xx10 vs 7.4% at xx90–xx99), stop-loss sells just below; take-profits clustered *at* the round number (Osler, FRBNY SR125). Clustered stops create "price cascades" when hit (Osler 2005). `[EMP~]` The "magnet" (predictive direction) claim is not established: liquidity being *present* ≠ price being *attracted*.
- **Misuse:** Assuming every swing high has a big stop pool; assuming someone deliberately "targets" it.
- **Sim:** The synthetic generator includes agents placing stops by Osler-style rules. "Liquidity x-ray" (Advanced) reveals hidden stop clusters on the chart *after* the session; learner first guesses where they are.

### 5.2 Support and resistance
**Support / resistance as order clustering** — B · 4.2
- **Def:** Price levels where declines (support) or advances (resistance) tend to pause or reverse.
- **Identify:** Prior swing highs/lows touched ≥2 times, round numbers, prior day high/low/close, gaps, high-volume nodes. Treat as zones (± spread/ATR fraction), not lines.
- **Claim:** Price reacts at these levels.
- **Evidence:** `[EMP+]` Osler (2000): published S/R levels bounced 60.8% vs 56.2% for arbitrary levels (minute FX data 1996–98, bootstrap with 10,000 artificial level sets); >70% of published levels end in 0 and 96% in 0 or 5. Mechanism: take-profit clustering at round numbers (reflecting) and stop-loss clustering just beyond (accelerating) (Osler 2001/2003). Effect size is a few percentage points – not a reliable "bounce" guarantee.
- **Misuse:** Drawing dozens of lines; treating a 56% vs 61% base-rate effect as certainty.
- **Sim:** Learner draws S/R before the session (locked); app reports bounce frequency vs arbitrary levels at equal distance (Osler-style test) at the end of each week.

**Polarity / role reversal (support becomes resistance)** — B · 5.2
- **Def:** A broken support later acts as resistance (and vice versa).
- **Evidence:** `[HEUR][EMP~]` Plausible via trapped traders' break-even exits; SMC "breaker block" and "inversion FVG" are relabelled versions.
- **Sim:** Retest drill after breaks.

### 5.3 Round numbers
**Round numbers / psychological levels** — B · 5.2
- **Def:** Prices ending in 00, 50 (and to a lesser degree 0, 5).
- **Evidence:** `[EMP+]` Strongest documented clustering (Osler). Exchange rates spend *less time* at round numbers than elsewhere (De Grauwe & Decupere 1992, cited by Osler), consistent with stops pushing price through quickly; stocks tend to *linger* at limit-order clusters (Niederhoffer & Osborne 1966, cited by Osler).
- **Misuse:** Placing your own stop exactly at/just beyond the round number (where everyone's is).
- **Sim:** Round-number gridlines toggle; stop-placement drill comparing stop-out rates at "just beyond round" vs "beyond structure + buffer".

### 5.4 Stop runs, liquidity sweeps, cascades
**Stop run / liquidity sweep / stop hunt** — I · 5.1, 4.8 — `[MKT]` partly; ≈ failed breakout / Wyckoff spring–upthrust / 2B / turtle soup
- **Def:** Price trades through a level where stops cluster, triggers them, then (sweep) fails to hold beyond the level and returns inside.
- **Identify (LuxAlgo convention):** (1) mark the level; (2) price trades through (often a wick); (3) *failure*: close back inside the prior range (some require same candle); (4) confirmation such as displacement away or lower-timeframe CHoCH. A close beyond with follow-through = breakout (BOS), not a sweep – indistinguishable until the close.
- **Claim:** Large players run stops to obtain liquidity for their orders, then reverse.
- **Evidence:** `[EMP+]` Mechanism partly real: stop-loss orders are positive-feedback trading; FX trends move unusually fast when they reach documented stop clusters, and responses to stop-loss orders are larger and longer than to take-profits (Osler 2005). `[EMP~]` The *reversal* claim is contested: one systematic preprint on G10 FX (Mahadzva 2026, SSRN, unreviewed) found three separately built sweep rules agreed (65/66 folds) that a swept level predicts *continuation*. "Stop hunt" implies intent a chart cannot prove; "sweep" is the neutral term.
- **Misuse:** Calling every wick a manipulation; fading every new high.
- **Sim:** Branching replays at swept levels; app shows the statistical split (continuation vs reversal) in the synthetic market and in the random-walk control. Learner's job is to state invalidation, not to "know".

**Stop cascade / price cascade** — A · 5.4
- **Def:** Self-reinforcing move as triggered stops (market orders) hit thin liquidity and trigger further stops.
- **Evidence:** `[EMP+]` Osler 2005 (*JIMF*): cascades help explain fat tails in FX returns.
- **Sim:** Cascade scenario: learner watches the depth chart as stops convert to market orders; "where would you place your stop now?" exercise.

### 5.5 Equal highs/lows; key reference highs/lows
**Equal highs / equal lows (EQH/EQL)** — I · 4.2, 5.1 — ≈ double top/bottom
- **Def:** Two or more swing highs (lows) at approximately the same price (within a tolerance, e.g., a few ticks or a fraction of ATR).
- **Claim (SMC):** "Retail" double tops create obvious stops above them; they "will be swept".
- **Evidence:** `[EMP~]` Plausible stop clustering (stops placed just beyond obvious extremes). No quantified sweep probability published.
- **Sim:** Tolerance slider; detection over synthetic data; outcome stats (broken/held) vs random.

**Prior day/week/month high-low, session highs-lows, opening price** — B · 3.1, 5.1
- **Def:** Widely watched reference levels.
- **Evidence:** `[HEUR]` Widely watched → likely order clustering; no universal reaction rate.
- **Sim:** Auto-plotted reference levels with a "watched-level" filter.

### 5.6 Supply and demand zones
**Supply/demand zones** — I · 5.2 — (Sam Seiden-style retail methodology)
- **Def:** The base (small consolidation) left before an impulsive move. Formations: rally-base-rally, drop-base-rally (demand); drop-base-drop, rally-base-drop (supply).
- **Identify:** (1) strong departure (often breaking a swing); (2) compact base of 1–few overlapping candles; (3) distal line at base extreme wick; proximal line at bodies (pick one convention); (4) grade by departure strength, time at base (less = better), freshness (untested), location.
- **Claim:** Unfilled institutional orders remain at the base.
- **Evidence:** `[HEUR][EMP~]` No guarantee; impulsive departures are easier to identify in hindsight; zones weaken with each test (opposite of S/R lore, where more touches = stronger – an internal contradiction worth teaching).
- **Misuse:** Huge zones that "always work" because they are wide; redrawing after failure.
- **Sim:** Zone-drawing tool with locked rules; app measures reaction rate of fresh vs tested zones vs random zones of the same width.

### 5.7 Imbalances (two meanings)
**Order-flow imbalance vs price imbalance** — I · 6.4
- **Def:** (a) *Order-flow imbalance*: more aggressive buying than selling (delta), or more bid than ask size at the top of book. (b) *Price imbalance* in chart jargon: one-sided move leaving untraded/barely traded prices (gaps, FVGs, single prints, LVNs).
- **Evidence:** `[EMP+]` (a) Short-horizon price changes are linearly related to order-flow imbalance at the best quotes (Cont, Kukanov & Stoikov 2014) `[BK]`. (b) See 5.9–5.10.
- **Misuse:** Mixing the two meanings.
- **Sim:** Side-by-side panel: delta histogram vs chart-gap overlay.

### 5.8 Order blocks (critical framing)
**Order block (OB)** — I · 4.3, 5.6 — `[MKT]` ≈ supply/demand zone defined by the last opposing candle
- **Def:** The last opposite-colour candle (or candles) before a displacement that breaks structure; bullish OB = last down-close candle before a strong up-move.
- **Identify (common SMC rules; not standardised):** displacement leg that breaks a swing (BOS/CHoCH); often leaves an FVG; often preceded by a liquidity sweep; zone = candle's range or body (or open-to-50% "mean threshold"); "mitigated" once price returns into it; invalid on close beyond the far side.
- **Claim:** Institutions left unfilled orders there and will defend/"mitigate" them.
- **Evidence:** `[EMP~]` No peer-reviewed evidence (XS.com explainer; review summarised by a vendor blog). A broker's 1,000-trade FX backtest (FXNX, methodology unpublished) reported standalone OBs held only ~43%, mattering mainly when combined with displacement + FVG. "Institutional orders" are unobservable from OHLC. Conceptually a renamed supply/demand zone; Wyckoff-era ideas.
- **Misuse:** Marking every last-opposite candle; endless re-labelling after failures (unfalsifiable).
- **Sim:** OB auto-detector with strict rules exposed as parameters; app scores OB reaction rates vs random candles at similar distance and vs random-walk control. Then the learner tries to improve the rule and sees overfitting in out-of-sample data.

**Breaker block / mitigation block** — A · 5.8 — `[MKT]` ≈ role reversal (support becomes resistance)
- **Def:** Breaker: an OB that failed and flipped polarity; strict ICT form requires a liquidity run (swing beyond a prior extreme) before the failure. Mitigation block: same flip without the raid (swing failed short of the prior extreme).
- **Evidence:** `[HEUR]` "Breakers do not reliably hold on retest" (LuxAlgo); definitions vary (strict vs loose).
- **Sim:** Retest drill after failed OBs.

### 5.9 Fair value gaps
**Fair value gap (FVG) / imbalance / inefficiency** — I · 4.1 — `[MKT]` ≈ three-candle gap / "window"; overlaps with classical gaps and Market Profile single prints
- **Def:** Three-candle pattern where candle 1's high < candle 3's low (bullish) – the middle candle's range is not overlapped by its neighbours' wicks. Bearish mirror (candle 1 low > candle 3 high). Zone = candle 1 high to candle 3 low.
- **Identify:** Mechanical and unambiguous on OHLC; filter by minimum size (ATR/%); "consequent encroachment" (CE) = 50% of the gap; "inversion FVG" (IFVG) = a gap closed through by a body, flipping role; "balanced price range" (BPR) = overlapping opposite FVGs; "volume imbalance" = body-to-body gap with overlapping wicks.
- **Claim:** Price "rebalances" (returns to fill) FVGs; they act as support/resistance; displacement leaving FVGs shows institutional intent.
- **Evidence:** `[EMP~]` Raw three-candle gaps occur constantly (~30% of bars in a random-walk simulation). A random-walk simulation (1,000,000 bars) found FVGs revisited within 20 bars 83.4% of the time vs 83.5% for random levels at the same distance; full fill 73.1% vs 73.1%; a first-touch trade won 50.2% vs 50.1% – i.e., "gaps fill" is a base rate, not information (vendor blog's own simulation; valid as a null model, not proof that real markets are random). A 2026 preprint claims high FVG win rates (Bindra) but reports no out-of-sample test, random baseline or costs (as summarised by the same review). Practical meaning: an FVG is a *fast move with little two-sided trading* – a real feature – but its "magnet" property is not demonstrated.
- **Misuse:** Treating every gap as a magnet/entry; ignoring timeframe (every timeframe has thousands).
- **Sim:** **Flagship critical-thinking drill.** App detects FVGs on (a) the synthetic market and (b) a random-walk control and shows revisit/fill rates side by side. Learner then designs an FVG rule and runs it with costs.

### 5.10 Liquidity voids, single prints, LVNs
**Liquidity void / low-volume node / single prints** — I · 6.12, 6.13
- **Def:** Price areas traded quickly with little volume/time (LVN on volume profile; single prints on TPO; large gaps).
- **Claim:** Price moves fast through voids and may return to "repair" them.
- **Evidence:** `[HEUR]` Descriptive of past trading; "repair" is not guaranteed (LuxAlgo: single prints "often repaired but need not be").
- **Sim:** Volume-profile overlay highlighting LVNs; speed of price through LVN vs HVN measured.

### 5.11 Trapped traders and fuel
**Trapped traders / breakout fuel** — I · 4.8, 5.4
- **Def:** Traders positioned in the direction of a failed move whose stops (and exits) supply fuel for the move against them.
- **Evidence:** `[HEUR]` Consistent with Osler stop-cascade mechanics.
- **Sim:** After a failed breakout, the app shows the (synthetic) trapped-agent inventory and where their stops sit.

### 5.12 Options-related levels (expert extension)
**Open-interest strikes, pinning, dealer gamma hedging** — E · options basics
- **Def:** Large option open interest can create hedging flows that dampen (long gamma) or amplify (short gamma) moves; prices may "pin" near large strikes at expiry.
- **Evidence:** `[EMP+][BK]` Pinning documented (Ni, Pearson & Poteshman 2005). Retail "gamma levels" products are noisier.
- **Sim:** Optional expiry-day scenario.

---

## 6. Order flow

> **Data caveat for the whole section:** order-flow tools need trade-by-trade data with the aggressor side classified. Exchange futures data is cleanest (central book). Equities are fragmented (each venue sees its own book; dark prints have no aggressor flag). Spot FX/CFD "volume" is usually tick count at one broker – order-flow readings there are approximations. A simulator has *perfect* data, so it must teach the learner what degrades in real feeds.

### 6.1 Tape reading (time & sales)
**Time & sales / the tape** — I · 1.5
- **Def:** Chronological list of trades: time, price, size, (aggressor side/venue/conditions).
- **Identify:** Prints at the ask = buyer-initiated; at the bid = seller-initiated; size clusters; speed (prints/second).
- **Claim:** Reading pace and size reveals urgency.
- **Evidence:** `[HEUR]` Old discipline (Wyckoff era; "Reminiscences"); modern tape is dominated by small algorithmic child orders, so large prints are rarer; block/dark prints may be reported late or flagged.
- **Misuse:** Treating each large print as directional (every trade has a buyer and a seller).
- **Sim:** T&S panel with colour by aggressor, size filter, and a speed meter; "pace" exercise: predict next 30 s direction from tape speed shifts.

### 6.2 Trade classification
**Aggressor side: exchange flag, tick rule, quote rule, Lee–Ready, bulk volume classification** — A · 6.1
- **Def:** Futures feeds usually flag the aggressor. Otherwise: tick rule (uptick = buy), quote rule (above mid = buy), Lee–Ready (quote rule, tick rule for midpoint trades), bulk-volume classification (probabilistic on bars).
- **Evidence:** `[EMP+][BK]` Classification accuracy of Lee–Ready-type algorithms in validation studies is well below 100% (order of 75–90%, varying by market/era); worse with fast quotes and hidden/midpoint executions. LuxAlgo notes most charting tools approximate CVD by signing lower-timeframe candles.
- **Misuse:** Treating platform delta as ground truth.
- **Sim:** Expert "classification error" mode: learner sees true aggressor (engine knows) vs tick-rule estimate; error % displayed.

### 6.3 DOM / Level 2 / heatmap
**Depth of Market (DOM ladder)** — I · 1.4
- **Def:** Vertical price ladder showing resting bid/ask size at each level, last trades, and (in trading DOMs) the user's working orders.
- **Identify:** Size changes at levels: *pulling* (size cancelled as price approaches), *stacking/layering* (size added), *reloading/refreshing* (same size reappears after fills = iceberg signature), *absorption* (repeated hits, level holds).
- **Claim:** Shows where participants defend or give up levels.
- **Evidence:** `[HEUR][MECH]` Displayed size is "evidence, never proof"; many order-flow traders weight executed volume over displayed depth; spoofing/layering distort the book; centralised futures books are cleanest (LuxAlgo; Jigsaw/NexusFi community).
- **Misuse:** Trading against a big visible order that then disappears.
- **Sim:** Interactive DOM where the learner clicks to place/cancel; replay mode shows how displayed size evolved; a "fake wall" agent tests learners.

**Liquidity heatmap (Bookmap-style)** — A · 6.3
- **Def:** Time × price image where colour intensity = resting size; trades overlaid as bubbles.
- **Claim (vendor):** "Liquidity holding = potential support/resistance; liquidity pulling = potential breakout or shift" (Bookmap blog).
- **Evidence:** `[HEUR]` Vendor framing; excellent visualisation of book dynamics.
- **Sim:** Heatmap view from the engine's full book history (the simulator can render this exactly).

### 6.4 Footprint charts
**Footprint (bid × ask, volume, delta footprints)** — A · 6.1, 6.2
- **Def:** Each bar split by price level showing volume traded at the bid (aggressive sells) and at the ask (aggressive buys); variants show total volume or delta per level.
- **Identify:** Read from extremes inward; bar POC (heaviest price); bar delta = ask vol − bid vol.
- **Claim:** Reveals who was aggressive where inside the bar.
- **Evidence:** `[MECH]` Shows *initiative*, not ownership; cannot be reconstructed from OHLCV; approximations on feeds without aggressor classification.
- **Sim:** Footprint view generated from engine trades; learner identifies bar POC, delta and extremes.

**Diagonal imbalance / stacked imbalances** — A · 6.4
- **Def:** Compare ask volume at price P with bid volume at P−1 tick (diagonal, because aggressive buyers lift the offer while sellers hit the bid one tick lower). Imbalance when ratio ≥ threshold (commonly 3:1 = 300%; 2:1–4:1 range). Stacked = ≥3 consecutive same-side imbalances.
- **Claim:** Stacked imbalances mark initiative and often become intrabar support/resistance.
- **Evidence:** `[HEUR]` "An imbalance describes what happened… not what must happen next"; isolated imbalances mostly noise (Quantower/LuxAlgo).
- **Sim:** Threshold slider; outcome stats of stacked-imbalance zones vs random zones.

**Unfinished auction / exhaustion print** — A · 6.4
- **Def:** Unfinished auction: a bar extreme with volume on both bid and ask (auction did not "complete") – often revisited. Exhaustion print: very thin, one-sided volume at the extreme (aggressors ran out).
- **Evidence:** `[HEUR]`
- **Sim:** Footprint quiz with outcomes.

### 6.5 Delta and cumulative delta
**Volume delta / cumulative volume delta (CVD)** — A · 6.2
- **Def:** Delta = aggressive buy volume − aggressive sell volume per bar; CVD = running sum from an anchor (session or continuous).
- **Identify:** Compare CVD swings with price swings; reset anchor consistently.
- **Claim:** Shows net aggression; divergences warn of weak moves.
- **Evidence:** `[HEUR][MECH]` Absolute CVD level depends on anchor; venues/feeds disagree; classification errors (6.2). Different from OBV (whole-bar sign).
- **Sim:** CVD pane with anchor selector; exercise: "Is this rally driven by aggressive buying or by sellers withdrawing?" (engine can show both: delta and cancellations).

**Delta divergence** — A · 6.5
- **Def:** Price makes a higher high while CVD makes a lower high (or mirror).
- **Evidence:** `[HEUR]` "Flags a fragile move, not a guaranteed reversal"; needs price confirmation.
- **Sim:** Divergence detector; outcome frequencies with/without confirmation.

### 6.6 Absorption
**Absorption** — A · 6.3, 6.5
- **Def:** Heavy aggressive volume at a level that fails to move price because passive orders (often refilling/iceberg) soak it up.
- **Identify:** Repeated execution at the same price without price progress; strongly negative delta while price holds (bullish absorption) or vice versa; level size holds or refills on DOM.
- **Claim:** Passive large participant defending a level → reversal if aggressors are trapped.
- **Evidence:** `[HEUR]` Bookmap: "look for repeated execution at a level without price movement"; LuxAlgo calls absorption the DOM's strongest tell "because posting and pulling can't fake it". If the level then breaks, absorption failed.
- **Sim:** Engine scenario with a hidden passive agent; learner flags absorption in real time; app reveals the agent's remaining size.

### 6.7 Exhaustion
**Exhaustion (order-flow)** — A · 6.4, 4.15
- **Def:** Aggressive volume dries up at the extreme of a move (low volume, small delta at new highs/lows), suggesting the move lacks fuel.
- **Evidence:** `[HEUR]` Mirrors Wyckoff "effort vs result".
- **Sim:** Combined footprint + price drill.

### 6.8 Icebergs
**Iceberg detection** — A · 2.10, 6.3
- **Def:** See 2.10. Detection: traded volume at a price exceeds displayed size (e.g., display 20–50 lots but 500+ traded), level refreshes after each fill.
- **Evidence:** `[MECH]` Native vs synthetic icebergs; exchanges may not know synthetic ones are linked.
- **Sim:** Learner must locate 3 iceberg agents during a session; score by detection time; reveal panel at end.

### 6.9 Spoofing and layering (illegal)
**Spoofing / layering** — A · 6.3
- **Def:** Placing orders with the intent to cancel before execution to create a false impression of supply/demand, typically to trade on the other side. Illegal in US futures under the Dodd-Frank amendment to the Commodity Exchange Act (CEA §4c(a)(5)(C), "bidding or offering with the intent to cancel… before execution") and under market-abuse regimes elsewhere (EU MAR) `[BK]` for the statute wording.
- **Identify (surveillance view):** Large orders away from the touch, frequently modified to avoid fills, cancelled when price approaches, high cancel-to-fill ratio, trades executed on the opposite side.
- **Evidence:** `[MECH][EMP+]` CFTC v. Sarao (2016 consent order): a "dynamic layering" program placed 4–6 large sell orders one price level apart, 3–4 ticks from the best ask, auto-modified to avoid execution; on 6 May 2010 it ran 4h25m, modified >81,000 times, executed 81 lots, representing 20–29% of the E-mini sell-side book; found to have contributed to an extreme book imbalance before the Flash Crash; ≈$38.6 million in penalties/disgorgement plus trading bans; guilty plea to spoofing and wire fraud. Note: legitimate layering of liquidity (genuine orders at multiple prices) is *not* illegal – intent to cancel is the line.
- **Misuse:** Learners attempting to "spoof" in sim and thinking it transfers; or accusing every pulled order of spoofing.
- **Sim:** Compliance module: the engine contains a labelled spoofer agent; learner identifies it from MBO data (cancel ratio, distance from touch); the app **blocks** learner order patterns that resemble spoofing and explains the law (ethics + compliance badge).

### 6.10 Top-of-book imbalance and order-flow imbalance
**Book imbalance / OFI** — E · 1.5, 6.5
- **Def:** (bidSize − askSize)/(bidSize + askSize) at the touch; OFI = net change in best-level supply/demand from adds, cancels and trades.
- **Evidence:** `[EMP+][BK]` Linear short-horizon price impact of OFI (Cont, Kukanov & Stoikov 2014); predictive power spans milliseconds–seconds; spoofing exploits exactly this signal.
- **Sim:** Expert overlay; "beat the coin" prediction game.

### 6.11 VWAP
**VWAP (session)** — I · 1.5
- **Def:** Σ(price × volume)/Σ volume from the session open (typical price (H+L+C)/3 on bars, or exact trade prices).
- **Identify:** Resets each session; ± standard-deviation bands optional.
- **Claim:** Institutions benchmark executions to VWAP; price above VWAP = buyers in control; VWAP acts as dynamic S/R.
- **Evidence:** `[MECH]` VWAP is a real benchmark and a broker algorithm type (SEC 2020). `[HEUR]` "Buyers in control above VWAP" is a descriptive statement about average cost, not a prediction; "price cuts through VWAPs regularly".
- **Misuse:** Treating VWAP as a wall; using VWAP on spot FX tick volume without caveat.
- **Sim:** VWAP line + bands; "execution grade" for the learner's fills vs session VWAP; institutional VWAP-algo mission (2.16).

**Anchored VWAP (AVWAP)** — A · 6.11
- **Def:** VWAP computed from a chosen anchor (swing high/low, earnings gap, breakout bar, IPO) – popularised by Brian Shannon `[BK]`.
- **Identify:** Anchor choice discretionary but should mark an event that reset positioning; session VWAP = AVWAP anchored at the open.
- **Claim:** Represents average cost of participants since the event; reactions at AVWAP reflect their break-even decisions.
- **Evidence:** `[HEUR]` Reactions "common but not guaranteed"; old anchors become sluggish.
- **Sim:** Click-to-anchor tool; learner anchors at events and tests reaction rate vs random anchors.

### 6.12 Volume profile
**Volume profile (POC, value area, VAH/VAL, HVN, LVN)** — I · 1.7
- **Def:** Histogram of volume by price over a window. POC = price with most volume; value area = band around POC containing ~70% of volume (convention); VAH/VAL = its edges; HVN = high-volume nodes (acceptance); LVN = low-volume nodes (rejection, fast travel).
- **Identify:** Window types: session, fixed range, visible range, composite, anchored. "Naked POC" = prior POC not yet revisited.
- **Claim:** HVNs act as magnets/support-resistance; LVNs as fast zones; holding outside value → continuation; quick return inside → rotation ("80% rule" of Market Profile lore: if price re-enters value and holds two TPO periods, it often traverses to the other side `[HEUR][BK]`).
- **Evidence:** `[HEUR]` Describes past trade distribution, does not predict; spot-FX profiles use tick proxies.
- **Sim:** Profile overlay; learner predicts rotation vs continuation at VAH/VAL; app logs outcomes vs random-band control.

### 6.13 Market Profile (TPO) and auction market theory
**Market Profile / TPO** — A · 6.12, 3.5
- **Def:** Letters for each 30-minute period printed at every price traded; counts *time* at price (Steidlmayer, CBOT 1980s; Dalton *Mind Over Markets* `[BK]`). POC (most TPOs), value area (~70%), initial balance (first hour), range extension, single prints, poor highs/lows (unexcessed extremes), excess/tails (≥2 single prints at an extreme), one-timeframing, P-shape (short covering) and b-shape (long liquidation), day types (normal, normal variation, trend, double distribution, neutral, non-trend) and open types (open drive, open test drive, open rejection reverse, open auction) `[BK]` for the full taxonomies.
- **Claim:** Markets auction to find value; balance vs imbalance determine whether to fade edges or follow breakouts.
- **Evidence:** `[HEUR]` Coherent descriptive framework; little formal testing; VAH/VAL differ between platforms.
- **Sim:** TPO view of the same session as candles; day-type prediction game at 10:30 with end-of-day reveal.

**Auction market theory (balance / imbalance, acceptance / rejection)** — A · 6.13
- **Def:** Price moves to facilitate trade: it advertises prices; when one side dominates, price moves until the other side responds (imbalance → new balance).
- **Evidence:** `[HEUR]` Conceptual; compatible with microstructure (price as the outcome of order flow).
- **Sim:** "Balance or imbalance?" switch drill at each session open.

### 6.14 Volume, open interest and positioning (context)
**Volume, relative volume (RVOL), open interest, COT** — I · 1.7
- **Def:** Volume = contracts/shares traded; RVOL = volume vs typical for that time of day; open interest = outstanding futures/options contracts; COT = CFTC weekly positioning report.
- **Evidence:** `[MECH]` Volume rules (e.g., "breakouts need volume") are heuristics; FX has no consolidated volume.
- **Sim:** RVOL bar under chart; breakout outcomes split by RVOL tercile.

### 6.15 Wyckoff (classical order-flow ancestor)
**Wyckoff method** — I → A · 4.3, 6.1 — the ancestor of SMC's "composite operator" and "sweeps"
- **Def:** Supply/demand reading via price and volume. Laws: supply & demand, cause & effect (range size → move size), effort vs result. Composite Man heuristic. Cycle: accumulation → markup → distribution → markdown; range phases A–E; events: selling climax (SC), automatic rally (AR), secondary test (ST), spring, sign of strength (SOS), last point of support (LPS); upthrust/UTAD in distribution.
- **Claim:** Large operators campaign; springs/upthrusts are shakeouts before trend.
- **Evidence:** `[HEUR]` No broadly accepted statistical study shows schematics predict outcomes; labels easy in hindsight; FX volume is a tick proxy (LuxAlgo). Historically the source for many SMC terms (spring/upthrust → "liquidity sweep"; composite man → "smart money").
- **Sim:** Schematic-labelling exercise on synthetic ranges where the generator plants accumulation by a hidden agent – and on random ranges where it doesn't. Learner sees how often a "spring" appears in both.

---

## 7. SMC / ICT vocabulary — glossary, mapping to classical TA, critical evaluation

### 7.0 Origin and status
- **ICT** = "Inner Circle Trader" (Michael J. Huddleston), a free/paid YouTube-era mentorship; **SMC** ("Smart Money Concepts") is the broader retail movement that repackaged ICT terms (plus some from "RTM"/supply-demand and Wyckoff). There is **no official rulebook**; definitions differ by author, indicator and year. Indicator vendors (LuxAlgo, TradingView scripts) have become de-facto standardisers.
- Core narrative: institutions ("smart money") must accumulate/distribute large positions, so they *engineer* liquidity (run stops), leave footprints (order blocks, fair value gaps, displacement), and price is *delivered* by an algorithm (ICT's "IPDA") between liquidity pools and imbalances at specific times (killzones, "macros").
- **Teaching stance (recommended):** teach the vocabulary because learners will meet it everywhere; map every term to (a) a mechanical/microstructure fact, (b) the classical TA concept it renames, and (c) a falsifiable hypothesis that the simulator can test. Never present the narrative as established.

### 7.1 Glossary (term → common identification → classical / academic equivalent → verdict)

| # | Term (abbr.) | Common SMC/ICT meaning & identification | Classical / academic equivalent | Verdict | Level |
|---|---|---|---|---|---|
| 1 | Smart money / retail money | Institutions vs retail; "smart money trades against retail" | Informed vs uninformed traders (Kyle 1985; Glosten–Milgrom 1985); Harris's trader taxonomy | `[MKT]` Real heterogeneity, but no single coordinated actor; institutions are diverse and often uninformed (index, hedging flows) | B |
| 2 | Liquidity (BSL / SSL) | Buy-side liquidity = buy stops above highs; sell-side = sell stops below lows | Resting stop orders / order clustering (Osler 2001/2003) | `[EMP+]` existence of clusters; `[EMP~]` "magnet" claim | I |
| 3 | External vs internal range liquidity (ERL / IRL) | ERL = highs/lows outside the dealing range; IRL = FVGs inside it; price "alternates" between them | Range boundaries vs. retracement levels | `[HEUR]` untested alternation claim | A |
| 4 | Equal highs / lows (EQH / EQL), relative equal highs | ≥2 swing extremes within a tolerance; "engineered liquidity" | Double top / double bottom | `[MKT]` | I |
| 5 | Liquidity sweep / grab / raid / stop hunt | Wick beyond a level, close back inside, then reversal | Failed breakout; Wyckoff spring/upthrust; Sperandeo 2B; Connors/Raschke "turtle soup"; swing failure pattern | `[MKT]` + `[EMP~]`: one unreviewed G10-FX study found continuation, not reversal (Mahadzva 2026); Osler 2005: trends accelerate through stop clusters | I |
| 6 | Inducement (IDM) | Minor internal pullback in front of a zone; "bait" whose stops are swept before the real move | Shake-out; trapped traders | `[HEUR]` intent unprovable; hindsight labelling | A |
| 7 | Judas swing | Early-session false move (often London/NY open) opposite to the day's real direction | Opening fake-out / failed opening range break | `[HEUR]` | A |
| 8 | Break of structure (BOS) | With-trend break of the last swing (close vs wick conventions) | Dow theory trend continuation (new HH/LL) | `[MKT]` | B |
| 9 | Change of character (CHoCH) | First counter-trend break of the protected swing (e.g., last HL in uptrend) | Dow-theory trend-failure signal; "break of trendline / lower high" | `[MKT]` | I |
| 10 | Market structure shift (MSS) | CHoCH with displacement right after a liquidity grab (some authors = CHoCH) | Failed breakout + reversal; 1-2-3 reversal | `[MKT]` | I |
| 11 | Displacement | Fast one-sided run of large-bodied candles, usually leaving FVGs; no fixed threshold | Momentum / trend bars / breakout spike (Brooks "spike") | `[MKT]` real feature (momentum) | I |
| 12 | Order block (OB) | Last opposite candle before a displacement that breaks structure; zone = its range/body; "mean threshold" = 50% of body | Supply/demand zone; "base" before impulse; Wyckoff last point of support/supply | `[MKT]` + `[EMP~]` (vendor backtest ~43% standalone hold) | I |
| 13 | Breaker block | Failed OB that flips polarity; strict form requires prior liquidity run | Support-becomes-resistance (role reversal) | `[MKT]` | A |
| 14 | Mitigation block | Failed swing (no raid) whose last candle zone flips | Role reversal / failed swing | `[MKT]` | A |
| 15 | Rejection block | Zone formed by long wicks at a swing extreme | Pin bar / hammer / shooting-star tail zone | `[MKT]` | A |
| 16 | Propulsion block / vacuum block | OB-within-a-move; gap from news/session ("vacuum") | Continuation zone; news gap / liquidity void | `[MKT]` | E |
| 17 | Fair value gap (FVG); BISI / SIBI | Three-candle imbalance: c1 high < c3 low (bullish, "buy-side imbalance sell-side inefficiency"), mirror bearish | Three-candle gap / "window" (candlestick), Market Profile single prints, liquidity void | `[MKT]` + `[EMP~]`: revisit rate ≈ random-level base rate in random-walk null (83.4% vs 83.5% within 20 bars) | I |
| 18 | Consequent encroachment (CE) | 50% of an FVG (or of a wick) | Midpoint / 50% retracement | `[MKT]` | I |
| 19 | Inversion FVG (IFVG) | FVG closed through by a body flips role | Role reversal of a gap | `[MKT]` | A |
| 20 | Balanced price range (BPR) | Overlap of opposite FVGs | Two-way auction / balance area; overlapping gaps | `[MKT]` | A |
| 21 | Volume imbalance | Body-to-body gap with overlapping wicks | Small opening gap between bars | `[MKT]` | A |
| 22 | Liquidity void | Large one-sided range with little overlap | Low-volume node; gap; single prints | `[MKT]` | I |
| 23 | Opening gaps (NWOG / NDOG) | New-week / new-day opening gap (Friday close → Sunday open; 5 pm close → 6 pm open in futures) | Weekend gap; session gap | `[MKT]` (gap is real; "draws price" untested) | I |
| 24 | Premium / discount / equilibrium | Upper/lower half of a dealing range split at 50%; buy in discount, sell in premium | 50% retracement rule (Osler 2000 lists it among old practitioner rules); mean-reversion within a range | `[MKT]` + `[HEUR]`; trends can stay on the "wrong" side for long | B |
| 25 | Dealing range | The swing range used for premium/discount | Trading range / last impulse leg | `[HEUR]` anchor choice subjective | I |
| 26 | Optimal trade entry (OTE) | 62–79% retracement of an impulse (sweet spot 70.5%) after sweep + structure shift | Fibonacci 61.8–78.6% retracement ("golden pocket" overlaps) | `[MKT]` "ratios have no mechanical force" (LuxAlgo) | I |
| 27 | PD arrays | Ordered list of premium/discount "arrays" (OB, FVG, breaker, old highs/lows…) | Collection of S/R-zone types | `[MKT]` | A |
| 28 | Draw on liquidity (DOL) | The liquidity pool price is "expected to reach next" | Price target at prior high/low | `[HEUR]` | I |
| 29 | Killzones | Session windows in NY time (Asian, London open, NY AM, London close, NY PM) | Session opens/overlaps; intraday volatility seasonality | Volatility part `[EMP+]` (Ito & Hashimoto); directional roles `[HEUR]` | I |
| 30 | Silver Bullet | Specific one-hour windows (e.g., 03:00–04:00, 10:00–11:00, 14:00–15:00 NY) for an FVG entry after a sweep | Time-of-day filtered breakout/pullback setup | `[HEUR]` no published test | A |
| 31 | "Macros" | Short windows (e.g., xx:50–xx:10) in which the "algorithm" seeks liquidity | Clock-time volatility bursts (data releases at :00/:30, fixes, auctions) | `[MKT]`/unfalsifiable as framed | E |
| 32 | Power of Three (PO3) / AMD | Each candle/day = Accumulation (range) → Manipulation (false move) → Distribution (real move) | Wyckoff cycle; open–false move–trend day; "open test drive" in Market Profile | `[MKT]` + hindsight; any OHLC bar can be narrated this way | A |
| 33 | Asian range / CBDR | Asian session range; "central bank dealers range" (14:00–20:00 NY) used to project daily ranges via standard deviations | Overnight/initial range; range projection | `[HEUR]` | A |
| 34 | Midnight open / true day open | NY midnight price as daily reference for premium/discount | Session-open reference (like RTH open, Globex open) | `[HEUR]` | A |
| 35 | Daily bias | Directional expectation for the day from higher-timeframe "draw" | Top-down analysis / higher-timeframe trend | `[HEUR]` | I |
| 36 | SMT divergence | Correlated markets disagree at a swing (e.g., ES makes higher high, NQ doesn't; EURUSD vs GBPUSD; DXY) | Intermarket divergence / Dow's confirmation principle (Industrials vs Transports) | `[MKT]` + `[HEUR]` | A |
| 37 | Market maker buy/sell model (MMBM/MMSM) | Templates of consolidation → run → reversal → "smart money reversal" → re-delivery | Wyckoff accumulation/distribution schematics | `[MKT]` | E |
| 38 | IPDA (Interbank Price Delivery Algorithm) | Claim that a central algorithm delivers price between liquidity and FVGs on 20/40/60-day look-backs | No documented counterpart; FX is fragmented, internalised and multi-dealer (BIS) | **Unfalsifiable / no evidence**; contradicts known FX market structure | E (as critique) |
| 39 | Institutional order flow (IOF) | Direction "institutions" are trading, inferred from structure | Actual order flow needs trade/book data (Section 6); OHLC cannot reveal it | `[MKT]` misnomer | I |
| 40 | Mitigation / rebalancing | Price returning to an OB/FVG so "institutions" close losing positions/fill remaining orders | Retracement; return to prior trading area | `[MKT]` | I |
| 41 | Unicorn model | Breaker block overlapping an FVG | Confluence of role-reversal zone and gap | `[MKT]` | E |
| 42 | Turtle soup | Fade of a false break of a prior high/low (ICT reuses the Connors/Raschke 1995 name) | Same as #5 | `[MKT]` (borrowed term) | I |
| 43 | Quasimodo (QM) / over-and-under | HH then LL then LH failing at the prior high level ("RTM" school) | Head-and-shoulders variant / failed retest | `[MKT]` | A |
| 44 | Swing failure pattern (SFP) | Close back inside after trading beyond a prior swing extreme | 2B pattern; Wilder RSI failure swing analogue | Classical; `[HEUR]` | I |
| 45 | Fractal / multi-timeframe alignment ("top-down") | Same structures repeat on all timeframes | Multi-timeframe analysis; fractal markets hypothesis | `[HEUR]`; more timeframes = more degrees of freedom (overfitting) | I |
| 46 | Quarterly theory | Time divided into quarters (year→month→week→day→90-min) each with AMD | Calendar/time-of-day seasonality | `[MKT]` untested | E |
| 47 | "Funded" / prop-firm framing | SMC often sold alongside prop-challenge products | n/a | Conflict of interest to disclose | B |

### 7.2 Critical evaluation

**What is real (teach as fact):**
1. Stop orders exist, cluster at obvious levels (round numbers, just beyond swing extremes) and, when triggered, become market orders that move price – sometimes in cascades (Osler 2001/2003, 2005). `[EMP+]`
2. Large orders have measurable price impact (square-root law) and are sliced to hide them (SEC 2020). `[EMP+]`
3. Volatility and liquidity follow session clocks (Ito & Hashimoto; BIS). `[EMP+]`
4. Fast one-sided moves leave price areas with little two-sided trading (FVGs, single prints, LVNs). `[MECH]`
5. Published support/resistance levels have a modest, statistically significant edge in predicting *intraday trend interruptions* in FX (60.8% vs 56.2%), not established as profitable after costs (Osler 2000). `[EMP+]`

**What is relabelled (teach the mapping):** order block ≈ supply/demand base; breaker ≈ role reversal; sweep ≈ failed breakout/spring/2B; BOS/CHoCH ≈ Dow theory; premium/discount ≈ 50% rule; OTE ≈ Fibonacci 61.8–78.6%; PO3/AMD and market-maker models ≈ Wyckoff; SMT ≈ Dow's confirmation/intermarket divergence; killzones ≈ session-open volatility windows (XS.com and the vendor review make the same mapping).

**What is unfalsifiable or contradicted (teach as critique):**
- *Intent attribution* ("they engineered liquidity", "the algorithm delivers price") cannot be inferred from OHLC; every outcome can be narrated post hoc (if the level holds, "institutions defended it"; if it fails, "they were inducing/hunting liquidity").
- *IPDA* conflicts with what is known of FX structure: hundreds of dealers, internalisation of >80% of customer flow, multiple platforms (BIS 2025).
- *Sweep → reversal* is contradicted by the only systematic test found (continuation in 65/66 fold selections, Mahadzva 2026, unreviewed) and by Osler's cascade evidence.
- *"FVGs fill"* equals the random-walk base rate in a null-model simulation (83.4% vs 83.5%).
- *Subjectivity:* swing selection (pivot length), close-vs-wick conventions, body-vs-wick zones and timeframe choice create many degrees of freedom → data-snooping risk (Sullivan, Timmermann & White 1999 `[BK]`).
- *Hindsight bias:* failed zones are forgotten; charts are shown after the fact.
- *Costs:* tight-stop SMC entries can have per-trade edges smaller than commissions until minimum stop sizes are imposed (reported in the Mahadzva summary).

**Evidence summary table**

| Claim | Best available evidence | Status |
|---|---|---|
| Stops cluster beyond round numbers/obvious levels | Osler bank order book (9,667 orders): stop-loss buys 14.4% just above 00 vs 7.4% just below | Supported |
| Price accelerates through stop clusters | Osler 2005 (JIMF) | Supported |
| Price reverses after a sweep | Mahadzva 2026 (SSRN, unreviewed): continuation | Contradicted / unproven |
| FVGs act as magnets | Random-walk null: revisit ≈ random levels | Base rate only |
| Order blocks hold | Vendor backtest ~43% standalone (unpublished method) | Unproven |
| Killzones give directional edge | Session volatility documented; no directional evidence | Timing yes, direction unproven |
| S/R levels matter | Osler 2000: +4.6 pp bounce frequency | Modest, real |
| ICT/SMC as a whole is profitable | No peer-reviewed test found; one preprint says "no evidence… as literally taught" (one CHoCH+FVG variant significant on EURUSD 1h holdout) | Unproven |

**Falsifiable reformulations the simulator can test** (turn narratives into hypotheses):
- H1: "After price trades ≥1 tick beyond the prior-day high and closes back below within 1 bar, the next 10-bar return is negative more often than after a random bar." (test vs random-walk and vs synthetic market with stop clustering ON/OFF)
- H2: "Bullish FVGs ≥0.5 ATR are revisited within 20 bars more often than random levels at the same distance."
- H3: "Order-block zones (strict rule set) produce reactions ≥X ticks more often than random candles at equal distance."
- H4: "Breakouts during session-open windows travel further in ATR terms than breakouts outside them" (likely true via volatility), and "their direction is more predictable" (likely false).

**Common SMC misuse patterns:** 15 overlapping zones on one chart (everything is a zone); timeframe-hopping until a zone appears; moving stops "beyond the next liquidity" after the fact; refusing to accept losses ("I was the liquidity"); paying for indicators that repaint (swing confirmation lag).

**How to teach SMC in the course (recommendation):**
1. Teach it *after* market mechanics, classical price action and liquidity evidence (Modules 1–6), so learners can map terms.
2. Vocabulary lesson with the mapping table (7.1).
3. "Narrative vs data" lab: the app replays a chart twice – once with the narrative overlay, once with the true agent flow from the generator – showing who actually traded.
4. Null-model lab: every SMC detector runs on random-walk data; learner sees similar hit rates.
5. Build-and-test lab: learner formalises one SMC idea into rules, tests in-sample, then out-of-sample, with costs.

---

## 8. Suggested progressive ordering for the course

### 8.1 Design principles
- **Mechanics before patterns; patterns before narratives; evidence throughout.**
- Each lesson = concept card (from this inventory) → interactive drill → scored scenario → journal reflection.
- Unlock rules use *process* metrics (stop placed before entry, cost awareness, calibration), not P&L alone.
- Every pattern lesson has a **random-walk control** step (Appendix A).

### 8.2 Module sequence

| Module | Level | Concepts (section refs) | Key drills / scenarios | Unlock criterion (suggested) |
|---|---|---|---|---|
| **M0 Orientation** | B | Market vs venue (1.1); bid/ask/last/mid (1.5); spread (1.6); what a "chart price" is | Build-a-candle; bid/ask/last lines | Complete quiz |
| **M1 Order mechanics I** | B | Market, limit, stop, stop-limit, take-profit, bracket/OCO, TIF (2.1–2.8); fills & partials (2.11); slippage (2.13); all-in costs (2.18) | Walk-the-book ticket; gap through stop; cost waterfall | 10 bracketed trades with stop set before entry |
| **M2 Time & sessions** | B | Trading hours (3.1); FX sessions (3.2); intraday U-shape (3.3); gaps (3.7); weekends/holidays (3.9); scheduled news (3.10); rollover (3.8) | Liquidity-weather widget; news-release scenario; weekend gap | Pass "which session?" game; survive news scenario within risk limit |
| **M3 Reading charts** | B | Swings (4.2); HH/HL structure (4.3); trend vs range (4.4); S/R & round numbers (5.2–5.3); pullbacks (4.6); breakouts basics (4.7) | Swing labelling with N slider; regime-classification game; locked S/R test vs arbitrary levels | Regime accuracy > baseline on 50 charts |
| **M4 Risk & expectancy mechanics** | B→I | Trader's equation (4.17); stop placement vs clustering (5.3, 2.3); volatility-scaled stops (1.12); journaling | Calibration plot; stop-placement comparison | Calibration error below threshold |
| **M5 Bar-by-bar price action** | I | Trend bars/dojis (4.1); signal/entry/reversal bars (4.9); inside/outside/ii/ioi (4.10); H1/H2, two-legged pullbacks (4.6); failed breakouts/traps (4.8); wedges (4.11); measured moves (4.12); channels (4.5); momentum vs exhaustion (4.15); MTF (4.18); classical patterns & evidence (4.14, 4.20) | Signal-bar grader; H2 drill; branching breakout replays; pattern quiz with random-walk charts | Positive expectancy on held-out synthetic set *with costs* |
| **M6 Liquidity & zones** | I | Liquidity pools (5.1); sweeps vs breakouts (5.4); stop cascades (5.4); equal highs/lows & reference levels (5.5); supply/demand (5.6); polarity (5.2); imbalances (5.7); FVG (5.9) & OB (5.8) with null-model labs; voids (5.10); trapped traders (5.11) | Liquidity x-ray reveal; FVG null-model lab; zone reaction stats | Explain base rate vs edge in own words; pass null-model lab |
| **M7 Market microstructure II** | I→A | Market structures & auctions (1.2–1.3); order book L1/L2/L3 (1.4); depth & liquidity (1.7); participants & market makers (1.9); broker models, B-book, last look (1.10); FX structure (1.11); NBBO/PFOF/best ex (1.8); queue priority FIFO/pro-rata (2.12); iceberg/hidden/peg/post-only (2.10); auction orders (2.9); opening/closing auctions (3.4) | Auction mini-game; play market maker; broker-type switch; queue-position drill | Positive spread capture as market maker in calm regime; auction quiz |
| **M8 Order flow** | A | Tape (6.1); classification (6.2); DOM & heatmap (6.3); footprint, imbalances, unfinished auctions (6.4); delta/CVD/divergence (6.5); absorption (6.6); exhaustion (6.7); icebergs (6.8); spoofing law (6.9); VWAP/AVWAP (6.11); volume profile (6.12); Market Profile/IB/day types (6.13, 3.5); Wyckoff (6.15) | Iceberg hunt; absorption flagging; spoofer identification + compliance badge; day-type prediction | Detect ≥2/3 icebergs; pass compliance module |
| **M9 SMC/ICT – vocabulary & critique** | A | Full §7 glossary; killzones (3.13); OTE/premium-discount; falsifiable reformulations | Narrative-vs-data replay; build-and-test lab | Submit one formalised rule with in/out-of-sample report |
| **M10 Execution & impact** | A→E | Market impact & square-root law (2.15); implementation shortfall (2.13); execution algos (2.16); latency/HFT (1.9, 2.17); microprice/OFI (1.5, 6.10); Kyle lambda (1.13) | Be-the-institution mission; scale-up challenge; latency pick-off | Beat a naive execution benchmark on IS |
| **M11 Stress regimes** | E | Halts, LULD, MWCB, volatility auctions (3.12, 2.20); flash-crash/cascade (1.7, 5.4); fixes & month-end (3.11); expiry/pinning (3.4, 5.12); FX last look (1.10) | Crash-day scenario; LULD bands; fix spike | Survive scenarios within drawdown limit |
| **Capstone** | E | Integrated playbook | Edge lab with walk-forward validation, costs and random-walk control | Written playbook + validated stats |

### 8.3 Dependency sketch
```
M0 → M1 → M2 → M3 → M4 → M5 → M6 → M9
                     ↘         ↘
                      M7 ──────→ M8 → M10 → M11 → Capstone
```
(M7 can start in parallel after M4; M9 requires M6 and should come after M8 if possible, so learners can contrast "inferred order flow" from candles with real order flow.)

---

## 9. Sources

> **Process note.** 27 web searches were run plus ~45 page fetches. The session's shared web-search budget was then exhausted, so a few planned searches (CFTC statute text, Lee–Ready accuracy, VWAP/volume-profile primary sources, CME trading-hours page, FX rollover conventions) were replaced by direct fetches of known primary URLs where possible; remaining statements from established literature are tagged `[BK]` in the text. Several BIS, investor.gov and Investopedia/BabyPips pages returned HTTP 403 to the fetcher; for those, content comes from search-result snippets and is noted below. Searches for Larry Harris's book returned only unofficial PDF mirrors, which were **not** used or linked; Harris content is from the book itself `[BK]`.

### 9.1 Regulators, exchanges, central banks (primary)
| URL | Contribution |
|---|---|
| https://www.sec.gov/files/algo_trading_report_2020.pdf | SEC Staff Report on Algorithmic Trading (2020): venue fragmentation stats (63%/37% on/off-exchange, ATS 10.2%, internalisers 27%), dark pools, SIP vs proprietary feeds, co-location, maker-taker, wholesaler/PFOF description, broker algos (VWAP/TWAP/IS/POV), HFT definition & strategy types, latency figures, auction share table, NYSE floor study, LULD mechanics, MWCB history (March 2020), Market Access Rule. **Fetched + text-extracted.** |
| https://www.investor.gov/additional-resources/news-alerts/alerts-bulletins/investor-bulletin-understanding-order-types | Order-type definitions (limit example). *403 to fetcher; search snippet.* |
| https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15 (redirect target of sec.gov/answers/stoplim.htm) | Stop / stop-limit / trailing stop definitions; trigger on last-sale vs quote; gaps; stop-limit 3.00/2.50 example. *Search snippet.* |
| https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/measures | MWCB levels 7/13/20%, 15:25 rule; LULD bands and 15 s / 5 min pause. *Search snippet.* |
| https://www.govinfo.gov/content/pkg/FR-2019-09-30/pdf/2019-21102.pdf | Federal Register (2019) MWCB rationale ("may exhaust market liquidity"). *Search snippet.* |
| https://www.SEC.gov/rules/final/34-51808.pdf | Regulation NMS adopting release (2005): Order Protection Rule. *Search snippet.* |
| https://www.sidley.com/en/insights/newsupdates/2025/07/sec-to-hold-roundtable-on-the-order-protection-rule-implications-for-market-structure | 2025 SEC roundtable on Rule 611; Chairman's critique. *Search snippet.* |
| https://www.nasdaq.com/articles/opr-all-or-nothing-or-something-between | Reported proposal to rescind Rule 611/610(e) (status unverified). *Search snippet.* |
| https://www.finra.org/rules-guidance/notices/21-23 | FINRA RN 21-23: PFOF definition, best execution (Rule 5310), regular & rigorous review factors, Rule 606/607/10b-10, "disclosure is not a shield". **Fetched.** |
| https://www.finra.org/rules-guidance/guidance/reports/2024-finra-annual-regulatory-oversight-report/best-execution | Best-execution review expectations. *Search snippet.* |
| https://www.cftc.gov/PressRoom/PressReleases/7486-16 | CFTC v. Sarao consent order: dynamic layering mechanics, Flash Crash contribution (20–29% of sell-side book, 81,000 modifications, 81 lots executed), ~$38.6m penalties, bans. **Fetched.** |
| https://www.esma.europa.eu/press-news/esma-news/esma-agrees-prohibit-binary-options-and-restrict-cfds-protect-retail-investors | ESMA 2018 CFD measures: leverage caps, 50% margin close-out, negative balance protection, 74–89% retail loss rates, €1,600–€29,000 average losses. **Fetched.** |
| https://www.cmegroup.com/education/matching-algorithm-overview | CME list of matching algorithms. *Search snippet.* |
| https://cmegroupclientsite.atlassian.net/wiki/spaces/EPICSANDBOX/pages/457218521/CME+Globex+Matching+Algorithm+Steps | CME Globex matching steps (TOP → pro-rata → FIFO; rounding). *Search snippet.* |
| https://nasdaqtrader.com/Cross | Nasdaq opening/closing cross timings, MOO/LOO/MOC/LOC/IO definitions, NOII dissemination. **Fetched.** |
| https://www.nasdaqtrader.com/content/productsservices/Trading/ClosingCrossfaq.pdf | Closing-cross NOII fields (paired shares, imbalance side/qty, reference price), 10-second dissemination 15:50–15:55. *Search snippet.* |
| https://m.nasdaqtrader.com/content/technicalsupport/specifications/dataproducts/NOIS_v2.2.pdf | NOII spec (imbalance threshold, timing). *Search snippet.* |
| https://www.nasdaqtrader.com/Trader.aspx?id=TradeHaltCodes | Halt codes T1, T2, T5, T6, T12, H10, LUDP, M, MWC1–3, IPO1. **Fetched.** |
| https://docs.londonstockexchange.com/sites/default/files/documents/LSE_ETP_Price_Monitoring_Mechanisms_factsheet.pdf | LSE auctions: "most popular price", staged price-monitoring extensions, AESP circuit breaker, dynamic/static reference prices, random end ≤30 s, market-order extension. **Fetched + text-extracted.** |
| https://www.bis.org/media-releases/20250930-global-fx-trading-hits-96-trillion-day-april-2025-and-otc-interest-rate-derivatives-surge-79 | BIS Triennial 2025 headline: $9.6tn/day, +28%, USD 89%, UK 38%, top-4 centres 75%. *Search snippet.* |
| https://www.bis.org/publ/qtrpdf/r_qt2512v.htm | BIS QR Dec 2025: dealers internalise >80% of customer trades; single-dealer platforms. *403; search snippet.* |
| https://www.bis.org/publ/qtrpdf/r_qt1912g.htm | BIS QR Dec 2019: FX execution "complex and highly fragmented"; electronification in D2C; non-bank market makers. *403; search snippet.* |
| https://www.bis.org/publ/qtrpdf/r_qt1612v.htm | BIS QR Dec 2016: internalisation ratios (spot 63%). *Search snippet.* |
| https://www.bis.org/publ/qtrpdf/r_qt2212f.pdf | BIS QR Dec 2022: bilateral trading gains, lower transparency. *Search snippet.* |
| https://www.globalfxc.org/docs/gfxc_report_last_look.pdf | GFXC Execution Principles WG report on last look; Principle 17 remains appropriate (2021). *Search snippet.* |
| https://globalfxc.org/press-releases/press-p171219 | Dec 2017 revision of Principle 17 (no trading on client information in the last-look window). *Search snippet.* |
| https://www.newyorkfed.org/medialibrary/media/research/epr/00v06n2/0007osle.pdf | Osler (2000) "Support for Resistance": published S/R bounce 60.8% vs 56.2%, round-number dominance (>70% end in 0; 96% in 0/5), 5-day persistence, useless strength ratings, ~30% inter-firm agreement. **Fetched + text-extracted.** |
| https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr125.pdf | Osler (2001) "Currency Orders and Exchange-Rate Dynamics": 9,667 conditional orders; clustering at 00/50; TP at 00 9.3% vs SL 4.4%; SL buys just above round numbers (14.4% vs 7.4%); mechanism for S/R reversals and breakout acceleration; order-book timing by session. **Fetched + text-extracted.** |
| https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr150.html | Osler "Stop-loss orders and price cascades in currency markets" (JIMF 2005): trends accelerate at stop clusters; fat tails. *Search snippet.* |
| https://www.nber.org/papers/w12413 | Ito & Hashimoto (2006): intraday FX seasonality on EBS – U-shapes in Tokyo/London, activity–volatility correlation, deals vs spreads. **Fetched.** |

### 9.2 Academic / preprints
| URL | Contribution |
|---|---|
| https://arxiv.org/abs/1105.1694 | Tóth, Bouchaud et al. (2011, *PRX*): explanation of the square-root impact law via small local liquidity. **Fetched.** |
| https://doi.org/10.2139/ssrn.7430998 | Mahadzva (2026) SSRN preprint "Smart Money or Costly Folklore?": no evidence ICT/SMC works as taught; sweeps → continuation. *Reported via thortradecopier review; not read directly; unreviewed.* |

### 9.3 Practitioner / vendor education (used for definitions and conventions, treated as non-authoritative)
| URL | Contribution |
|---|---|
| https://databento.com/blog/cme-matching-algorithms-explained | CME algorithms with products and volume shares (FIFO 70.3%, etc.). **Fetched.** |
| https://nexusfi.com/treasury-notes-bonds/45035-zn-ten-year-note-market-maker-status-priority.html | Time-priority reset rules on modification (forum). *Search snippet.* |
| https://www.brookstradingcourse.com/how-to-trade-price-action-manual/ | Brooks: trend vs range first, channel vs breakout, Always-In direction, stop entries for beginners, swing-trade definition, 40–60% typical probability. **Fetched.** |
| https://www.brookstradingcourse.com/support-forum/13-always-in/always-in-confusion/ | Brooks quote (*Reversals* ch. 15) on Always In. **Fetched.** |
| https://www.brookstradingcourse.com/support-forum/general-trading-discussion/traders-equation-can-a-11-trade-have-higher-success-rate-than-60/ ; https://www.brookstradingcourse.com/support-forum/general-trading-discussion/probability-and-riskreward/ | Trader's equation; 60%/1:1 vs 40%/1:2 pairing (moderator paraphrases). *Search snippets.* |
| https://www.wiley-vch.de/en/areas-interest/finance-economics-law/reading-price-charts-bar-by-bar-978-0-470-44395-8 | Brooks book structure (trend bars, dojis, signal/entry bars, outside bars, glossary). *Search snippet.* |
| https://www.luxalgo.com/library/concept/bar-counting-h1-h2.md | H1/H2/L1/L2 bar-counting rules, entry/stop conventions, H3 → wedge, 4th attempt → range. **Fetched.** |
| https://nexusfi.com/a/strategies/wedge-reversals-price-action ; https://nexusfi.com/a/strategies/two-legged-pullback-trading | Wedge and two-legged pullback descriptions (Brooks-derived). *Search snippets.* |
| https://www.luxalgo.com/library/concept/fair-value-gap.md | FVG rules, CE, fills, mapping (imbalance, void, IFVG, volume imbalance, BPR), filters. **Fetched.** |
| https://www.luxalgo.com/library/concept/inversion-fvg/ | IFVG conventions (body close). *Search snippet.* |
| https://www.luxalgo.com/library/concept/liquidity-sweep.md | Sweep identification, relation to failed breakout/SFP/BOS/inducement, caveats. **Fetched.** |
| https://www.luxalgo.com/library/concept/break-of-structure.md | BOS rules, close vs wick, internal vs external, caveats. **Fetched.** |
| https://www.luxalgo.com/library/concept/change-of-character.md | CHoCH rules; CHoCH vs MSS; caveats. **Fetched.** |
| https://www.luxalgo.com/library/concept/breaker-block.md ; https://www.luxalgo.com/library/concept/mitigation-block/ | Breaker vs mitigation block; strict vs loose definitions; role-reversal mapping. **Fetched / snippet.** |
| https://www.luxalgo.com/library/concept/premium-and-discount.md | Premium/discount formula, dealing range, OTE relation, caveats. **Fetched.** |
| https://www.luxalgo.com/library/concept/optimal-trade-entry.md | OTE 0.62/0.705/0.79, drawing steps, invalidation. **Fetched.** |
| https://www.luxalgo.com/library/concept/inducement.md | Inducement definition/rules; AMD link; caveats. **Fetched.** |
| https://www.luxalgo.com/library/concept/displacement.md | Displacement identification; no fixed threshold. **Fetched.** |
| https://www.luxalgo.com/library/concept/killzones.md | Killzone windows (NY time), DST convention, "only a time filter". **Fetched.** |
| https://www.luxalgo.com/library/concept/swing-failure-pattern.md | SFP rules; 2B, RSI failure swing, turtle soup relations. **Fetched.** |
| https://www.luxalgo.com/library/concept/supply-and-demand-zones.md | RBR/DBR/DBD/RBD formations, drawing rules, OB/S-R/FVG relations. **Fetched.** |
| https://www.luxalgo.com/library/concept/wyckoff-method.md | Wyckoff laws, events, phases; lack of statistical validation. **Fetched.** |
| https://www.luxalgo.com/library/concept/volume-profile.md | POC, value area 70%, HVN/LVN, window types, naked POC, FX caveat. **Fetched.** |
| https://www.luxalgo.com/library/concept/tpo-profile.md | TPO mechanics, IB, range extension, single prints, poor highs/lows, P/b shapes. **Fetched.** |
| https://www.luxalgo.com/library/concept/anchored-vwap.md | VWAP/AVWAP formula, anchors, caveats. **Fetched.** |
| https://www.luxalgo.com/library/concept/cumulative-volume-delta.md | CVD calculation, divergence, absorption reading, tick-rule fallback, anchoring. **Fetched.** |
| https://www.luxalgo.com/library/concept/footprint-concepts.md | Footprint reading, diagonal imbalance, stacked imbalances, unfinished auction, exhaustion print, data requirements. **Fetched.** |
| https://www.luxalgo.com/library/concept/dom.md | DOM ladder, queue, pulling/stacking/reloading, icebergs, spoofing, absorption as strongest tell. **Fetched.** |
| https://www.luxalgo.com/library/concept/bid-ask-imbalance.md | Imbalance threshold conventions. *Search snippet.* |
| https://www.quantower.com/blog/imbalance-footprint-chart-and-rithmic-plugin | Stacked imbalance reading; 2:1–4:1 thresholds. *Search snippet.* |
| https://bookmap.com/learning-center/en/order-flow-phenomena/order-flow-education/layering-and-absorption | Bookmap definitions of layering, absorption, spoofing; "repeated execution without price movement". **Fetched.** |
| https://bookmap.com/blog/hidden-liquidity-in-large-cap-stocks-how-to-spot-iceberg-orders-in-2025 ; https://blog.bookmap.com/?p=15382 | Iceberg detection; heatmap "holding vs pulling" framing. *Search snippets.* |
| https://nexusfi.com/articles/trading/DOM ; https://www.ironbeam.com/jigsaw-futures-trading-platform/ ; https://nexusfi.com/a/regulation/spoofing-layering-futures-markets | Jigsaw-style Depth & Sales concepts (pulling, stacking, reloading, synthetic icebergs, spoof + iceberg pattern). *Search snippets.* |
| https://kb.esignal.com/hc/en-us/articles/6362181429403-eSignal-Market-Profile | Market Profile value area ~70%, POC tie-break, day types, IB. *Search snippet.* |
| https://www.xs.com/en/test-blog/smc-smart-money-concepts-explained/ | SMC definitions, claims, critique (relabelling, hindsight, unfalsifiability), real vs contested split, Osler reference. **Fetched.** |
| https://thortradecopier.com/blog/does-ict-smart-money-concepts-work | Evidence review: Mahadzva preprint summary, FVG random-walk null (83.4% vs 83.5%), Osler/Ito-Hashimoto/BIS citations, claims-vs-evidence table. *Vendor with conflict of interest; statistics checked for internal consistency.* **Fetched.** |
| https://fxnx.com/en/blog/smart-money-concepts-work-backtest-evidence | Broker's 1,000-trade backtest: standalone OB ~43% (methodology unpublished). *Search snippet.* |
| https://www.metalsmine.com/thread/post/15270916 ; https://cn.tradingview.com/script/tpMeVmYH-ICT-Times-joshu | ICT killzone/Silver Bullet windows as used by practitioners (and their inconsistency). *Search snippets.* |
| https://www.forex.com/en/help-and-support/limit-up-limit-down | LULD band table (dated Dec 2022). *Search snippet.* |

### 9.4 Background literature cited without fetch (`[BK]`)
Harris, L. (2003) *Trading and Exchanges: Market Microstructure for Practitioners*, OUP · Kyle, A. (1985) *Econometrica* · Glosten, L. & Milgrom, P. (1985) *JFE* · Stoll, H. (1989) *JF* · Lee, C. & Ready, M. (1991) *JF* · Perold, A. (1988) *JPM* "The implementation shortfall" · Almgren, R. & Chriss, N. (2000) *J. Risk* · Cont, R., Kukanov, A. & Stoikov, S. (2014) *J. Financial Econometrics* · Stoikov, S. (2018) "The micro-price" · Lyons, R. (2001) *The Microstructure Approach to Exchange Rates*; Evans & Lyons (2002) *JPE* · Lo, A., Mamaysky, H. & Wang, J. (2000) *JF* "Foundations of Technical Analysis" · Brock, W., Lakonishok, J. & LeBaron, B. (1992) *JF* · Sullivan, R., Timmermann, A. & White, H. (1999) *JF* · Park, C.-H. & Irwin, S. (2007) *J. Economic Surveys* · Moskowitz, T., Ooi, Y. H. & Pedersen, L. (2012) *JFE* · Ni, S., Pearson, N. & Poteshman, A. (2005) *JFE* (option pinning) · Brooks, A. (2009–2012) *Reading Price Charts Bar by Bar*, *Trends*, *Trading Ranges*, *Reversals* (Wiley) · Dalton, J. et al. *Mind Over Markets* · Crabel, T. (1990) *Day Trading with Short Term Price Patterns and Opening Range Breakout* · Shannon, B. (2023) *Maximum Trading Gains with Anchored VWAP* · Connors, L. & Raschke, L. (1995) *Street Smarts* (turtle soup) · Edwards, R. & Magee, J. *Technical Analysis of Stock Trends*.

---

## Appendix A — Simulator engine capabilities implied by this inventory

**A1. Order book & matching (MVP)**
- Full MBO limit order book with L1/L2 views; optional L3 "x-ray" for Expert.
- Matching modes: FIFO (default) and pro-rata (+ optional top-order/LMM) to teach queue economics.
- Order types: market, limit, stop (trigger on last / bid / ask – configurable), stop-limit, trailing (amount/%/ATR), MIT, OCO, bracket/OTO, IOC, FOK, AON, Day/GTC/GTD, iceberg (display qty), post-only, midpoint peg (two-venue mode).
- Priority-reset rules on modify (price change / size increase → back of queue).
- Partial fills, average price, reject reasons, requotes/last-look (dealer mode).

**A2. Venues & broker models (Intermediate+)**
- CLOB mode, dealer mode (inventory-skewed quotes, spread vs volatility), two-venue mode with delayed "SIP".
- Broker profiles: STP/commission, B-book/wider spread, ECN/partials; display broker P&L.

**A3. Market-data generator (agent-based, with ground truth)**
- Agents: market makers (inventory + adverse-selection aware), noise traders, momentum/trend agents, mean-reversion agents, stop-loss/take-profit placers with **Osler-style round-number clustering** (TP at round numbers, SL just beyond), institutional VWAP/TWAP parent orders, iceberg agents, absorption (passive defender) agents, an informed agent around news, and a **labelled spoofer** (compliance module only).
- Regimes: trend / range / breakout / volatility levels; liquidity calendar (sessions, lunch lull, holidays, DST mismatch weeks, 17:00 NY rollover spread widening, fix spikes, news events with configurable surprise).
- **Random-walk control mode** with identical volatility/session profile for null-model labs.
- Ground-truth logging (who traded with whom, hidden liquidity, stop clusters) for post-session reveal.

**A4. Session & stress mechanics**
- Opening/closing call auctions with indicative price, paired volume and imbalance messages; random end.
- Halts with codes; LULD bands with 15 s limit state → 5-min pause → reopening auction; MWCB levels; EU-style volatility auctions (AESP + extensions).
- Weekend/overnight gaps; futures roll; FX swap/triple-swap.

**A5. Analytics & visualisation**
- Charts: bid/ask/last lines; candles from ticks at any timeframe; RTH vs 24h; session shading.
- Order-flow: time & sales, DOM, heatmap, footprint (bid×ask, delta, imbalance threshold), CVD with anchor, VWAP/AVWAP with bands, volume profile (session/fixed/composite/anchored), TPO profile with IB.
- Detectors (with exposed parameters): swings (N), BOS/CHoCH, FVG, OB, sweeps/SFP, equal highs/lows, inside/outside bars, H1/H2 counts, wedges.
- Post-trade: slippage vs decision/arrival, effective/realised spread, implementation shortfall, cost waterfall, adverse-selection metric, calibration plot, R-multiple distribution, per-session/time-of-day stats.
- "Edge lab": rule builder → in-sample / out-of-sample / random-walk control backtests with costs.

**A6. Pedagogical controls**
- Hide-then-reveal labels (learner commits before the app shows labels/outcomes).
- Locked drawings (S/R or zones drawn before the session cannot be edited, enabling honest Osler-style evaluation).
- Branching replays at decision points.
- Compliance guard (blocks spoof-like learner behaviour and explains the law).
