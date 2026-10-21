# U1 · How markets work

**Base camp.** Prima unitate a cursului: L01 → L02 → L03 → L04, topicurile Market Fundamentals și Order Types.

**Ce poate face utilizatorul după unitate:**
- citește orice lumânare (open, high, low, close, corp, fitile, direcție) și spune ce *nu* poate arăta o lumânare;
- știe la ce preț cumpără (ask) și la ce preț vinde (bid) și calculează costul unui round trip, cu spread și comision;
- alege între un ordin market și unul limit după plan și prezice dacă și unde se execută;
- pune stop-loss-ul la punctul de invalidare și take-profit-ul la nivelul următor, știe de ce un gap poate executa stop-ul mai prost și măsoară ambele ieșiri în R.

**De ce ordinea asta:**
- **L01** dă limbajul graficului; fără el nu se poate citi nimic din curs, iar M01 îl exersează imediat.
- **L02** arată că graficul e mid-ul, dar execuțiile au loc la bid și la ask. Fără asta, L03 nu poate explica de ce o limită „atinsă” pe grafic nu s-a executat.
- **L03** tratează ordinele de intrare. **L04** tratează ieșirile, construite pe aceleași reguli (stop-ul devine market, take-profit-ul lucrează ca un limit), și pregătește U3, unde riscul pornește de la stop.

**Concepte acoperite:** candlestick, timeframe, bid-ask-spread, trading-costs, market-order, limit-order, slippage, stop-loss-order, gap-risk, bracket-order. invalidation-level e introdus în L04 și predat complet în L10.

**Checkpoint:** `test-market_fundamentals` (q-mf-1 … q-mf-9) și `test-order_types` (q-ot-1 … q-ot-9). La ≥ 80% pe checkpoint, cele 4 lecții se marchează „Tested out”.

**Misiune de final:** M01 Read the Candle (găsește high-ul și close-ul pe grafic, separă observația de predicție). M01 acoperă doar L01; vezi nota de la final.

### Pe scurt

| Lecție | Hook | Interacțiuni reale (fără întrebări) | Try |
|---|---|---|---|
| L01 What a candle shows | tap: unde s-a terminat ora | hook, hotspot B4, worked B5, predict B6, task · **5** | candle-builder |
| L02 Bid, ask and the spread | alegere: rezultatul unui round trip | hook, match B3, worked B5, predict B6, task · **5** | spread-cost (cu câmp de comision) |
| L03 Market and limit orders | slider: cât de jos trebuie să coboare graficul | hook, match B5, reveal B6, task · **4** | order-fill (nou) |
| L04 Stop-loss and take-profit orders | tragi ieșirea pe grafic | hook, worked B3, worked B6, task · **4** | bracket-builder (nou) |

Fiecare lecție are 7 beat-uri în Learn.

### Reguli de execuție folosite în exemple (din `packages/engine`)

- Lumânările se desenează din **mid**. Poziția deschisă se evaluează tot la mid (`markPrice` = close-ul lumânării curente).
- **Market:** buy la ask (mid + 0.05), sell la bid (mid − 0.05), imediat.
- **Buy limit:** se execută când ask ≤ limit (mid ≤ limit − 0.05), la prețul limitei; dacă open-ul a sărit deja peste ea, la ask-ul de la open (mai bun). O buy limit ≥ ask se execută imediat, la ask. **Sell limit:** simetric, cu bid-ul (bid ≥ limit, adică mid ≥ limit + 0.05).
- **Stop-loss pe long:** se declanșează când bid ≤ stop (mid ≤ stop + 0.05) și se execută la stop; după un gap, la bid-ul de la open.
- **Take-profit pe long:** se declanșează când bid ≥ target și se execută la target; după un gap, la bid-ul de la open.
- **Comision:** `ceil(valoare × 5 / 10 000)` în cenți, la fiecare execuție.
- Când drumul din interiorul unei lumânări e necunoscut, motorul presupune că extrema adversă a venit prima.

### Politica pentru legăturile din glosar

Se leagă la prima apariție în lecție fiecare termen nou pentru curs, plus termenii recurenți de care depinde lecția (de exemplu ask, bid și mid în L03). Termenii recurenți care apar doar în treacăt (open în L04, commission în L04) nu se mai leagă, ca textul să nu fie plin de sublinieri. De confirmat de echipă: README spune „la prima apariție în lecție”, iar PLAN §4.2 spune „un termen nou”.

---

## L01 · What a candle shows

| | |
|---|---|
| Unitate | U1 · How markets work, lecția 1 din 4 |
| Durată | 5 min · 7 beat-uri în Learn |
| Concepte | candlestick, timeframe |
| Termeni (glosar) | candle, timeframe, open, high, low, close, body, wick |
| Se sprijină pe | — (prima lecție) |
| Pregătește | M01 Read the Candle, L02 (lumânările se desenează din mid) |

**Obiective**
1. Read the open, high, low and close of any candle.
2. Tell a bullish candle from a bearish one and describe its body and wicks.
3. Separate what a candle records from what it cannot predict.

### Hook
- **Tip:** predict · tap pe grafic (hotspot) cu 4 zone: vârful fitilului de sus (101.50), vârful corpului (101.00), baza corpului (100.00) și vârful fitilului de jos (99.20). Un tap se atribuie celei mai apropiate zone (ținte ≥ 44px); `{yours}` = prețul zonei.
- **Grafic:** `LearnChart` cu o singură lumânare `Candles`: O 100.00, H 101.50, L 99.20, C 101.00 (candle-up). Axa de preț e vizibilă, fără etichete OHLC.
- **Prompt:** "This [[candle]] is one hour of LABX trading. Tap the price where the hour ended."
- **Răspuns:** 101.00, vârful corpului (close). Greșeala așteptată e 101.50 (high-ul). Nu se notează; se compară în recap.
- **Concept:** candlestick

### Learn

**B1 · explain**
> "A candle summarises trading over one period. In MARKET//LAB each candle covers one hour, its [[timeframe]], so a chart of 48 candles shows two days. Every candle is built from just four prices, **OHLC**: the [[open]], the [[high]], the [[low]] and the [[close]]."

**B2 · figure** (din diagrama `candle-anatomy`)
- Date: `Candles` cu lumânarea din hook (O 100.00, H 101.50, L 99.20, C 101.00, candle-up), cu cipuri de preț pe axă. La pasul 4 apare alături oglinda ei bearish: O 101.00, H 101.50, L 99.20, C 100.00 (candle-down). Etichetele (OPEN, CLOSE, HIGH, LOW, BODY, UPPER WICK, LOWER WICK) sunt în `--ml-text-3`, uppercase.
- Pași:
  1. "Open, 100.00: the first price of the hour." · se aprinde un `Marker` la 100.00.
  2. "Close, 101.00: the last price. The [[body]] fills the space between open and close." · se desenează corpul.
  3. "High, 101.50, and low, 99.20: the [[wick|wicks]] reach the highest and lowest prices traded." · fitilele cresc din corp.
  4. "Close above open: a bullish candle. A bearish candle flips it: open on top, close at the bottom." · apare lumânarea oglindită.
- **Interacțiune:** tap sau Space avansează pașii; ultimul pas deblochează Continue. Hotspot-ul din §8.4 („Tap the upper wick”) e înlocuit de B4.

**B3 · explain**
> "The **body** is the thick part between the open and the close. The thin lines above and below it are the **wicks**, also called shadows; their tips mark the high and the low. A **bullish** candle closed above its open. A **bearish** candle closed below its open. Charts draw the two in different colours or fills."

**B4 · hotspot** "Find the close"
- Grafic: o lumânare bearish, O 100.60, H 100.90, L 99.30, C 99.70 (corp 0.90, fitil de sus 0.30, fitil de jos 0.40, range 1.60), cu axa de preț și fără etichete. Are aceleași 4 zone ca hook-ul.
- **Prompt:** "This candle is bearish. Tap its close."
- **Țintă:** baza corpului, 99.70.
- **Feedback:**
  - corect: "Right. A bearish candle closed below its open, so the close is the bottom of the body: 99.70."
  - 100.60, vârful corpului: "That's the open. On a bearish candle the open is the top of the body; the close is the bottom, 99.70."
  - 100.90: "That's the high, the tip of the upper wick. The close is where the body ends: 99.70."
  - 99.30: "That's the low, the tip of the lower wick. Price traded there but finished higher, at 99.70."
- **Concept:** candlestick

**B5 · worked** "Reading one candle"
- Linii:
  1. "Open 100.00, high 101.50, low 99.20, close 101.00."
  2. "Close above open: the candle is bullish."
  3. "Body: 101.00 − 100.00 = 1.00."
  4. "Upper wick: 101.50 − 101.00 = 0.50."
  5. "Lower wick: 100.00 − 99.20 = 0.80."
  6. "Range, high − low: 101.50 − 99.20 = ?"
- **Ultimul pas îl calculează utilizatorul:** range = 2.30 (toleranță 0). După răspuns apare "2.30, which is 1.00 + 0.50 + 0.80." și rezultatul: "During the hour price traded as low as 99.20 and as high as 101.50, and it finished at 101.00."
- **Feedback corect / greșit:**
  - corect: "Right: 2.30. The body and both wicks add up to the full range."
  - 1.80: "That's close − low. The range is the full height, from the low to the high."
  - 1.50: "That's high − open. The range runs from the low, 99.20, to the high, 101.50."
  - altă valoare: "The range is high − low: 101.50 − 99.20."
- **Concept:** candlestick

**B6 · predict** "Which came first?"
- Grafic: lumânarea din B5, etichetată.
- **Prompt:** "Inside this hour, which came first: the high or the low?"
- **Control:** alegere: "The high, 101.50" / "The low, 99.20" / "The candle can't tell you".
- **Reveal:** în spatele lumânării se desenează pe rând două `Line` intra-oră, de câte 6–8 puncte. Drumul A: 100.00 → 101.50 → 99.20 → 101.00. Drumul B: 100.00 → 99.20 → 101.50 → 101.00. Ambele se termină în aceeași lumânare. Textul de sub reveal: "Both paths draw exactly this candle. A candle shows where price went, not the order in which it got there."
- **Feedback:**
  - "The candle can't tell you": "Right. The candle keeps four prices, not the path between them."
  - "The high" sau "The low": "That's possible, and so is the other. Both paths below draw the same candle."
- **Concept:** candlestick

**B7 · callout** (key)
> "A candle is a summary, not a signal. It records four prices from one hour. A strong bullish hour can be followed by anything: what happens next depends on things the candle doesn't show."

### Try
- **Widget:** candle-builder
- **Valori de start:** open 100.00, high 101.50, low 99.20, close 101.00 (lumânarea din B5, bullish).
- **Obiectiv:** "Build a bearish candle with a long lower wick: at least twice the body, and longer than the upper wick."
- **Reușită:** la Check, pe valorile efective (h = max(high, open, close), l = min(low, open, close)), calculate în cenți:
  - close < open;
  - (close − l) ≥ 2 × (open − close);
  - (close − l) > (h − open).
- **Indicii:**
  1. "Start with direction: a bearish candle closes below its open. Move the close under 100.00."
  2. "Lower wick = bottom of the body − low. Make it at least twice the body and longer than the upper wick."
  3. "With the open at 100.00, close 99.70 gives a body of 0.30. Set the low to 99.10 or lower and the high to 100.20."
- **Show me:** open 100.00, high 100.20, low 98.80, close 99.70. Widget-ul arată Bearish, body 0.30, upper wick 0.20, lower wick 0.90, range 1.40 și nota „A long lower wick…”.
- **Feedback:**
  - corect: "Right: a bearish body of {body} and a lower wick of {lower}. Price traded down to {low} during the hour but closed {lower} above it."
  - după o încercare greșită, mesajul primei condiții care nu e îndeplinită:
    - close ≥ open: "The close isn't below the open, so the candle isn't bearish. Move the close under the open."
    - fitilul de jos e prea scurt: "The lower wick is {lower}, less than twice the body ({body}). Lower the low, or shrink the body."
    - fitilul de sus ≥ fitilul de jos: "The upper wick ({upper}) is at least as long as the lower one. Bring the high closer to the top of the body."
- **Concept:** candlestick

### Check
- Întrebări: q-mf-1, q-mf-2, q-mf-3
- q-mf-2 folosește exact lumânarea din B5 (și din hook, figură și widget), iar 0.80 apare scris în B5, linia 5. Checkul ar măsura memoria, nu regula. Propunere: checkul lecției afișează mereu o variantă generată cu `vary` (definit deja în questions-markets-and-sizing.md). Până atunci, q-mf-2 poate primi lumânarea din conceptul candlestick: open 100.20, high 101.10, low 99.80, close 100.90. Fitilul de jos e 100.20 − 99.80 = 0.40, iar capcana „din close” dă 1.10.
- Alternativă posibilă: q-mf-10 (nouă, timeframe, d1), dacă intră în bancă.

### Recap
- **Hook comparat:** "You tapped {yours}. The hour ended at the top of the body, 101.00. The wick tip, 101.50, was only the high."
- **Three things to remember:**
  1. "Every candle is four prices: open, high, low, close. The body spans open to close; wicks reach the extremes."
  2. "Close above open is bullish; close below open is bearish. The wicks don't decide the direction."
  3. "A candle records one hour. It can't show which extreme came first or what comes next."
- **Practise it:** M01 Read the Candle, Market fundamentals check (`check-market_fundamentals`)

### Note de conținut
- **Corecturi:** niciuna de calcul; 1.00 + 0.50 + 0.80 = 2.30 e corect. Toate faptele din lecție sunt păstrate: OHLC, 48 de lumânări = două zile, shadows, culori diferite, ordinea high/low necunoscută, „summary, not a signal”.
- **Prompt și widget:** promptul de azi („close lower than the open… long lower wick”) se potrivește cu candle-builder. Exemplul din PLAN §9.1 („bearish candle with a long upper wick”, fitilul de sus ≥ 2× corpul) e diferit. Am păstrat varianta lecției, fitilul de jos, pentru că e forma din M01 varianta c („A small bearish body with a long lower wick”) și din q-mf-3. De aliniat în §9.1 și în widgets.md.
- **candle-builder:**
  - acceptă un high sub corp și îl înlocuiește în tăcere cu max(open, close); evaluarea se face pe valorile efective (vezi cerințele);
  - nota „A small body…” are prioritate față de „A long lower wick…”: la un corp mai mic de 15% din range, nota nu mai pomenește fitilul lung. Show me e ales astfel încât nota să spună „A long lower wick”.
- **Diagrama candle-anatomy:** §8.4 cere 5 pași (open → close → high → low → corp și fitile), iar README permite cel mult 4, așa că high și low sunt comasate în pasul 3. Hotspot-ul „Tap the upper wick” din §8.4 devine B4 („Tap its close”, pe o lumânare bearish): exersează exact gestul din M01 și capcana din q-mf-2.
- **„Range”:** în L01 înseamnă high − low. În glosar, `range` (L05) e piața laterală. Nu l-am legat. De adăugat poate o propoziție în glosar („Not to be confused with a candle's range, high minus low”).
- **M01:** briefing-ul vorbește de „light body / dark body”, iar în Learn culorile sunt sage și brick (§8.2). De verificat textul după E2.
- **Glosar:** toți termenii cu lecția L01 sunt legați. „OHLC” e `aka` la `candle`, fără id propriu.
- q-mf-8 (d3, trei lumânări bullish) ține de L01, dar nu intră în checkul lecției; rămâne în `check-market_fundamentals` și în assessment.

---

## L02 · Bid, ask and the spread

| | |
|---|---|
| Unitate | U1 · How markets work, lecția 2 din 4 |
| Durată | 6 min · 7 beat-uri în Learn |
| Concepte | bid-ask-spread, trading-costs |
| Termeni (glosar) | unit, bid, ask, spread, mid-price, commission, basis-point, position, unrealised-pnl |
| Se sprijină pe | L01 |
| Pregătește | L03, L04, L09 (dimensionare ajustată de costuri), M05 Size Matters |

**Obiective**
1. Name the bid, the ask, the mid and the spread, and say which price a buyer and a seller get.
2. Calculate the round-trip cost of a position, including spread and commission.
3. Explain why a new position shows a small loss straight away.

### Hook
- **Tip:** predict · alegere, 3 variante: "Zero: price didn't move" / "A small gain" / "A small loss"
- **Prompt:** "The chart shows LABX at 100.00. You buy 50 [[unit|units]] and sell them straight back. Price hasn't moved. What's your result?"
- **Răspuns:** "A small loss". În simulator, −10.01 vUSD: spread 5.00 plus comision 2.51 + 2.50. Comparat în recap.
- **Concept:** trading-costs

### Learn

**B1 · explain**
> "At any moment there are two prices, not one. The [[bid]] is the highest price a buyer will pay, so it's what you receive when you sell. The [[ask]] is the lowest price a seller will accept, so it's what you pay when you buy. The gap between them is the [[spread]]."

**B2 · figure** (din diagrama `bid-ask-spread`)
- Date: `LearnChart` fără lumânări, cu axa 99.80–100.20.
  - `Level` neutral „MID 100.00”, linie întreruptă.
  - `Level` neutral „ASK 100.05”, cu adnotarea „YOU BUY HERE” în accent.
  - `Level` neutral „BID 99.95”, cu adnotarea „YOU SELL HERE”.
  - `Bracket` între 99.95 și 100.05, „SPREAD 0.10”, în `--ml-accent-2`.
- Pași:
  1. "The [[mid-price|mid]], 100.00, sits halfway. Chart candles are drawn from it, but you can't trade at it."
  2. "Ask 100.05, the mid + 0.05: buyers pay it. Bid 99.95, the mid − 0.05: sellers get it."
  3. "The spread: 100.05 − 99.95 = 0.10. Buy and sell straight back, and each unit loses 0.10 before any fees."
- **Interacțiune:** după pasul 3, un slider pe spread (0.02–0.50, pas 0.02, start 0.10): bid-ul și ask-ul se depărtează simetric de mid, iar cipurile și acolada se actualizează. E explorare, fără verificare (§8.4); Continue nu depinde de slider.

**B3 · match**
- **Prompt:** "LABX mid is 100.00. Match each item to its price."
- **Perechi:**
  - "You buy now" ↔ "Ask, 100.05"
  - "You sell now" ↔ "Bid, 99.95"
  - "The candles on the chart" ↔ "Mid, 100.00"
  - "The gap from bid to ask" ↔ "Spread, 0.10"
- **Feedback la o pereche greșită** (elementul revine la loc):
  - „You buy now” pus pe bid: "Buyers pay the higher price, the ask."
  - „You sell now” pus pe ask: "Sellers receive the lower price, the bid."
  - „The candles” pus pe ask sau bid: "Candles are drawn from the mid, halfway between bid and ask."
  - „The gap” pus pe orice preț: "The gap is a distance, not a price: 100.05 − 99.95."
- **Concept:** bid-ask-spread

**B4 · explain**
> "You also pay [[commission]]: 0.05% of the fill value, or 5 [[basis-point|basis points]], when you enter and again when you exit. A **round trip** means opening a [[position]] and closing it. You cross the spread once, because you enter on one side and leave on the other, and you pay commission twice."

**B5 · worked** "Buy 50 units, sell them straight back (mid stays 100.00)"
- Linii:
  1. "Buy 50 at 100.05: 50 × 100.05 = 5,002.50."
  2. "Sell 50 at 99.95: 50 × 99.95 = 4,997.50."
  3. "Spread cost: 50 × 0.10 = 5.00."
  4. "Commission: 0.05% × (5,002.50 + 4,997.50) = 0.05% × 10,000.00 = 5.00."
  5. "Round-trip cost: 5.00 + 5.00 = ?"
- **Ultimul pas îl calculează utilizatorul:** 10.00 (toleranță 0.01, deci acceptă și 10.01). După răspuns apare: "10.00, or 0.20 per unit. The simulator rounds each fee up to the cent, 2.51 + 2.50, so it charges 10.01."
- **Feedback corect / greșit:**
  - corect: "Right: 5.00 of spread plus 5.00 of commission."
  - 5.00: "That's one cost. Add the spread and the commission together."
  - 7.50: "That counts commission once. You pay it on entry and again on exit."
  - altă valoare: "Add the two lines above: spread 5.00 and commission 5.00."
- **Concept:** trading-costs

**B6 · predict** "Back to zero"
- **Prompt:** "You've just bought 50 units at the ask, 100.05. The mid is still 100.00. How far must the mid rise before selling gets you back to zero?"
- **Control:** alegere: "Not at all: you're at zero now" / "0.10, the spread" / "About 0.20: the spread plus two fees"
- **Răspuns:** a treia. Reveal cu `Formula`, în cutii care se aprind pe rând: `0.10 spread + 0.05 entry fee + 0.05 exit fee ≈ 0.20 per unit`. Textul de sub ea: "Costs are paid up front; the price move isn't. That's why a new position's [[unrealised-pnl|open P&L]] starts below zero, even before the mid moves."
- **Feedback:**
  - "Not at all": "The mid hasn't moved, but you paid the ask and a fee. Selling now gets the bid, 99.95."
  - "0.10": "That covers the spread. The two fees add about 0.05 a unit each."
  - "About 0.20": "Right. The bid must climb 0.10 to reach 100.05, and the fees add about 0.10 more."
- **Concept:** trading-costs

**B7 · callout** (warning)
> "Costs are certain; the price move is not. Each cost looks tiny, so it's easy to ignore. But you pay it on every trade, winning or losing, and it takes a bigger share of the result when price moves only a little."

### Try
- **Widget:** spread-cost, cu câmpul de comision din PLAN §9.1
- **Valori de start:** units 50, mid 100.00, spread 0.10, commission 0.05% (exemplul din B5). În modul task, rândurile spread cost, commission, round-trip cost și break-even rămân ascunse până la trimiterea răspunsului.
- **Obiectiv:** "Set up 100 units at a mid of 50.00, spread 0.10 and commission 0.05%. Enter the round-trip cost before the widget shows it."
- **Reușită:** units = 100, mid = 50.00, spread = 0.10, commission = 0.05% și |răspuns − 15.01| ≤ 0.01. Intervalul [15.00, 15.02] acceptă și calculul exact (15.00), și ce încasează simulatorul (15.01).
- **Indicii:**
  1. "A round trip is two fills. Add what you give up on the spread to what you pay in fees."
  2. "Spread cost = units × 0.10. Commission = 0.05% of each fill's value, once on entry and once on exit."
  3. "Spread: 100 × 0.10 = 10.00. Buy fill: 100 × 50.05 = 5,005.00, so the entry fee is 2.51."
- **Show me:** units 100, mid 50.00, spread 0.10, commission 0.05%, răspuns 15.01. Rândurile arată: buy at 50.05, sell at 49.95, spread cost 10.00, commission 2.51 + 2.50, round-trip cost 15.01, break-even 0.16 per unit. `Formula`: `10.00 + 2.51 + 2.50 = 15.01`.
- **Feedback:**
  - corect: "Right: 10.00 of spread plus 2.51 + 2.50 of commission is 15.01 vUSD. At half the price, the fee per unit halved; the spread didn't."
  - după o încercare greșită:
    - controalele nu sunt setate: "The widget isn't set to the task yet: 100 units at a mid of 50.00, spread 0.10, commission 0.05%."
    - 10.00: "That's the spread alone, 100 × 0.10. Add the commission on both fills."
    - 12.50 sau 12.51: "That counts commission once. You pay it on entry and again on exit."
    - 5.00 sau 5.01: "That's the commission alone. Add the spread: 100 × 0.10 = 10.00."
    - 20.00 sau 20.01: "That's the cost at a mid of 100.00. At 50.00, each fee is about half as big."
    - altă valoare: "Add three parts: the spread cost, the entry fee and the exit fee."
- **După reușită** (explorare, opțional): "Now drag Units to 200. The cost roughly doubles, to 30.01: costs scale with size."
- **Concept:** trading-costs

### Check
- Întrebări: q-mf-4, q-mf-5, q-mf-6
- **q-mf-6 trebuie corectat înainte de lansare.** Varianta corectă și explicația spun că poziția e evaluată la bid, dar motorul o evaluează la mid. Corectura e propusă în questions-markets-and-sizing.md (varianta „Conținut”) și e consecventă cu B6, care evită afirmația „valued at the bid”. Dacă nu e gata la lansare, înlocuirea temporară e q-mf-7 (costurile cântăresc mai mult la mișcări mici; d2, se leagă de B7).

### Recap
- **Hook comparat:** "You picked {yours}. The round trip lost 10.01 vUSD: 5.00 to the spread and 5.01 in commission, with the mid unchanged."
- **Three things to remember:**
  1. "You buy at the ask and sell at the bid. The mid sits between them; the gap is the spread."
  2. "A round trip costs the spread once plus commission twice: about 0.20 per unit at 100.00."
  3. "Costs are paid up front, so every new position starts slightly behind, even if the mid hasn't moved."
- **Practise it:** M05 Size Matters, Arena: low volatility, Market fundamentals check (`check-market_fundamentals`)

### Note de conținut
- **Calcule verificate:**
  - 50 × 100.05 = 5,002.50 și 50 × 99.95 = 4,997.50;
  - spread 5.00, comision exact 5.00;
  - cu rotunjirea motorului: 5,002.50 × 0.05% = 2.50125 → 2.51 și 4,997.50 × 0.05% = 2.49875 → 2.50, deci total 10.01;
  - „The mid has to rise by about 0.20” e corect ca aproximare: la +0.20 rezultatul e −0.02, la +0.21 e +0.48, iar rândul de break-even al widget-ului afișează 0.21. Am păstrat „about 0.20”.
- **Try:** 100 × 50.05 = 5,005.00 → comision 2.5025 → 2.51; 100 × 49.95 = 4,995.00 → 2.4975 → 2.50; spread 10.00; total 15.01 (15.00 fără rotunjire). Explorarea cu 200 de unități: 20.00 + 5.01 + 5.00 = 30.01.
- **Prompt și widget:** promptul de azi cere comision, iar spread-cost nu are câmp pentru el. Se adaugă (PLAN §9.1). Partea „double the size” din prompt rămâne ca explorare după reușită.
- **Evaluarea la mid:** motorul evaluează poziția deschisă la mid (`markPrice`, `unrealizedPnl`). O poziție nouă de 50 de unități arată −2.50 open P&L, iar comisionul de 2.51 e deja scăzut din equity. De aceea B6 spune doar că open P&L-ul „starts below zero”, fără o cifră legată de bid. Aceeași problemă e în q-mf-6.
- **Glosar:**
  - legați: bid, ask, spread, mid-price, commission (L02);
  - legați, fără lecție azi: basis-point, position, unrealised-pnl. Propun `lesson: "L02"` pentru ele;
  - `unit` (L09) e legat în hook, fiindcă e prima lecție cu unități.
- **Candidați nelegați:** `tick` (LABX se mișcă în pași de 0.01) nu are lecție și ar putea intra în L02. `market-maker`, `order-book` și `liquidity` sunt înrudite, dar lecția nu face afirmații despre ele și nu le-am introdus.
- **Concepte:** trading-costs are și L09 în `lessons`; nimic de schimbat.

---

## L03 · Market and limit orders

| | |
|---|---|
| Unitate | U1 · How markets work, lecția 3 din 4 |
| Durată | 5 min · 7 beat-uri în Learn |
| Concepte | market-order, limit-order, slippage |
| Termeni (glosar) | fill, market-order, limit-order, slippage, notional-value; recurenți, legați din nou: mid-price, ask, bid |
| Se sprijină pe | L02 |
| Pregătește | L04, M06 The FOMO Trap |

**Obiective**
1. Choose between a market order and a limit order for a given plan.
2. Predict the fill price of a market order from the bid and the ask.
3. Explain when a buy limit or a sell limit can fill.

### Hook
- **Tip:** predict · slider 98.80–99.20, pas 0.05, start 99.20. Pe grafic: un `Level` entry întrerupt „BUY 99.00” și o linie-cursor „MID” care urmează slider-ul.
- **Prompt:** "LABX is at 100.00 on the chart. You leave an order to buy at 99.00 or lower. How low must the chart price go before it [[fill|fills]]?"
- **Răspuns:** 98.95, mid-ul la care ask-ul ajunge la 99.00. Greșeala așteptată e 99.00. Comparat în recap.
- **Concept:** limit-order

### Learn

**B1 · explain**
> "An **order** is an instruction to buy or sell. The two basic types answer one question differently: what matters more right now, getting filled or getting a particular price? A [[market-order]] buys or sells immediately at the best price available. A [[limit-order]] buys or sells only at your chosen price or better."

**B2 · figure** (din diagrama `market-vs-limit`)
- Date:
  - `Candles`: 10 lumânări care coboară lent de la 100.70 la close 100.00 (mid-ul de acum), cu cipurile ASK 100.05 și BID 99.95.
  - `Marker` în accent, „MARKET BUY 100.05”, pe ultima lumânare.
  - `Level` entry întrerupt, „BUY LIMIT 99.00”.
  - Două `Line` după „acum”:
    - drumul 1: 100.00 → 99.40 → 98.90 → 99.80, cu un `Marker` „FILLED 99.00” unde mid-ul trece prin 98.95;
    - drumul 2: 100.00 → 100.80 → 101.60 → 102.00, la 60% opacitate, cu eticheta „NEVER FILLED”.
- Pași:
  1. "[[mid-price|Mid]] now 100.00. The [[ask]] is 100.05, the [[bid]] 99.95."
  2. "A market buy fills at once, at the ask: 100.05."
  3. "A buy limit at 99.00 waits below. It needs the ask at 99.00: a mid of 98.95."
  4. "Path one dips to 98.90: filled at 99.00. Path two keeps rising: never filled."
- **Interacțiune:** tap sau Space avansează pașii. Predicția „Will the limit fill?” din §8.4 e B6.

**B3 · explain**
> "**Market orders: certainty of a fill.** A market buy fills at the ask, a market sell at the bid. The simulator uses the current ask or bid. In real markets a fast move can fill you worse than the price you saw: [[slippage]]. Use one when the plan says 'enter now' and being in matters more than a few cents."

**B4 · explain**
> "**Limit orders: certainty of price.** A **buy limit** sits below the current price: buy only at 99.00 or lower. A **sell limit** sits above it: sell only at 102.00 or higher. A buy limit fills only if the ask trades at or through your limit; a sell limit, only if the bid does. If it never fills, there's no trade."

**B5 · match**
- **Prompt:** "LABX mid is 100.00. Match each plan to the order that carries it out."
- **Perechi:**
  - "Get in now, whatever the price" ↔ "Market buy"
  - "Buy only on a dip to 99.50 or lower" ↔ "Buy limit at 99.50"
  - "Sell only at 102.00 or higher" ↔ "Sell limit at 102.00"
  - "Get out now" ↔ "Market sell"
- **Feedback la o pereche greșită:**
  - „Get in now” pus pe buy limit: "A limit waits for its price. 'Now' needs a market order."
  - „Buy on a dip” pus pe market buy: "A market buy fills now at 100.05, above your 99.50."
  - „Sell at 102.00” pus pe market sell: "A market sell fills now at the bid, 99.95, not at 102.00."
  - „Get out now” pus pe sell limit: "A sell limit waits above the price. 'Now' needs a market sell."
- **Concept:** market-order

**B6 · reveal** "Same idea, two orders"
- Grafic:
  - `Candles`: aceeași serie de 10 lumânări ca în B2, până la mid 100.00;
  - `Marker` „MARKET BUY 30 · 100.05”;
  - `Level` entry întrerupt, „BUY LIMIT 30 · 99.00”;
  - văl peste următoarele 12 lumânări. Seria ascunsă (close-uri): h1 99.70, h2 99.45, h3 99.30, h4 99.40 (low 99.10), h5 99.90, h6 100.50, h7 100.90, h8 101.40, h9 101.80, h10 102.30, h11 102.60, h12 103.00. Minimul mid-ului e 99.10 (ask 99.15).
- **Text înainte:** "A market buy of 30 fills now at 100.05: [[notional-value|position value]] 30 × 100.05 = 3,001.50. A buy limit of 30 waits at 99.00."
- **Prompt:** "Reveal the next 12 hours. Then say what happened to the limit."
- **Variante, după reveal:** "Filled at 99.00" / "Filled at 99.10" / "Not filled"
- **Răspuns:** "Not filled". Explicația: "At a mid of 99.10 the ask was 99.15, still above 99.00. Coming close isn't enough. The limit did exactly what it was told, and the market order rode the move to 103.00. Missing it is the known cost of a limit, not a mistake."
- **Feedback per variantă:**
  - "Filled at 99.00": "The ask never got to 99.00. Its lowest was 99.15, at a mid of 99.10."
  - "Filled at 99.10": "A buy limit never fills above its price. And 99.10 was the mid; the ask was 99.15."
  - "Not filled": "Right. The ask bottomed at 99.15, above your limit."
- **Concept:** limit-order

**B7 · callout** (warning)
> "Neither order is better in general. Decide which one your plan needs before you click. Chasing is a common mistake: price runs away from your limit, you cancel it and buy at market, higher. If the plan said 'only at 99.00', price leaving without you hasn't changed the plan."

### Try
- **Widget:** order-fill (nou)
- **Valori de start:**
  - ticket: side Buy, type Market, limit price 100.00 (nivelul stă pe mid și e inactiv cât timp type = Market), units 30 (fix);
  - mid 100.00 (ask 100.05, bid 99.95);
  - 10 lumânări istorice, de la 100.80 la close 100.00, și 12 lumânări viitoare sub văl.
- **Seria viitoare** (din conținut, deterministă), close-uri: h1 99.80, h2 99.60, h3 99.40, h4 99.50, h5 99.20, h6 99.30 (low 98.90), h7 99.70, h8 100.10, h9 100.30, h10 100.70, h11 100.90, h12 101.20. Minimul mid-ului e 98.90 (ask 98.95), în h6.
- **Panoul „Plan”:** "Buy 30 LABX only if price drops to 99.00 or lower."
- **Obiectiv:** "Place the order that follows your plan, then play the next 12 hours."
- **Reușită:** side = Buy, type = Limit, limit = 99.00 (toleranță 0), evaluată la „Place order”. Rezultatul jocului nu intră în condiție (proces, nu rezultat). Continue se deblochează după ce jocul se termină.
- **Ce arată jocul cu ordinul corect:** ask-ul ajunge la 99.00 în h6, la mid 98.95, deci „Filled 30 at 99.00 · hour 6 · value 2,970.00 · commission 1.49”.
- **Indicii:**
  1. "Your plan names a price. Which order type waits for its price?"
  2. "A buy limit sits below the current price and fills only at its price or lower."
  3. "Choose Buy and Limit, then drag the limit line down from 100.00 to 99.00."
- **Show me:** Buy · Limit · 99.00 → Place order → jocul rulează → fill la 99.00 în h6.
- **Feedback:**
  - corect, după joc: "Right order for the plan. The ask reached 99.00 in hour 6, so it filled there. Had price kept rising, it would be just as right."
  - după o încercare greșită:
    - market buy (jocul rulează oricum; fill la 100.05, iar în h12 poziția e pe plus): "Your market buy filled at once, at 100.05, above the plan's 99.00. It's showing a gain, but the plan was broken, not followed."
    - orice ordin de vânzare: "That's an order to sell. Your plan is to buy."
    - buy limit ≥ 100.05: "A buy limit at or above the ask fills at once, at the ask: 100.05. Your plan said 99.00 or lower."
    - buy limit între 99.01 și 100.04: "At {price}, the order could fill above 99.00, which your plan rules out. Set the limit at 99.00."
    - buy limit sub 99.00: "{price} is stricter than your plan, which accepts anything up to 99.00. Set the limit at 99.00."
- **Concept:** limit-order

### Check
- Întrebări: q-ot-1, q-ot-2, q-ot-8
- **Înlocuire propusă: q-ot-3 → q-ot-8.** q-ot-3 e exact scenariul din B6 (limită la 99.00, mid 99.10, apoi 103.00), deci ar măsura memoria, nu regula. q-ot-8 aplică aceeași regulă pe partea de vânzare (sell limit la 102.00 ⇒ mid 102.05), adică jumătatea din obiectivul 3 care altfel n-ar fi verificată. Dezavantaj: q-ot-8 e d3 (are 3 indicii în banca nouă). Dacă se preferă un d2, q-ot-3 rămâne, iar B6 primește alt minim, de exemplu mid 99.03 (ask 99.08).

### Recap
- **Hook comparat:** "You said {yours}. The chart, the mid, had to reach 98.95: a buy fills at the ask, 0.05 above the mid."
- **Three things to remember:**
  1. "Pick the order from the plan: 'enter now' needs a market order, 'only at this price' needs a limit."
  2. "A market buy fills at the ask, a market sell at the bid: you cross the spread."
  3. "A buy limit fills only when the ask reaches it; a sell limit, when the bid does. Close isn't enough."
- **Practise it:** M06 The FOMO Trap, Order types check (`check-order_types`)

### Note de conținut
- **Calcule verificate:**
  - 30 × 100.05 = 3,001.50;
  - mid 98.95 ⇔ ask 99.00; mid 99.10 ⇔ ask 99.15;
  - Try: 30 × 99.00 = 2,970.00, comision 1.485 → 1.49; un market buy ar avea comisionul 3,001.50 × 0.05% = 1.50075 → 1.51.
- **Diagrama market-vs-limit de azi:**
  - eticheta „Buy limit 98.50” nu se potrivește cu exemplul lecției (99.00);
  - drumul „filled” atinge exact linia limitei, deși regula cere ca mid-ul să coboare cu 0.05 sub ea;
  - drumul „filled” e colorat `pos` (verde), contrar §8.2 (verdele e doar pentru lumânări și rezultate).

  Varianta nouă folosește 99.00, mid-ul coboară la 98.90, iar fill-ul e în accent.
- **Figura și reveal-ul:** drumul „never filled” din figură urcă direct (ca în caption-ul de azi), ca să nu dezvăluie răspunsul din B6 (vine aproape și nu se execută).
- **Interacțiune:** lecția nu are niciuna azi (PLAN §1). Primește order-fill.
- **Motorul:** o buy limit plasată la sau peste ask se execută imediat, la ask. Lecția nu o spune; regula apare doar în feedback-ul widget-ului și în explicația lui q-ot-2 `d` din banca nouă. De decis dacă intră și în B4 (ar depăși 60 de cuvinte).
- **Gap:** o limită sărită de un gap se execută la ask-ul de la open, deci la un preț mai bun. Lecția spune „at your chosen price or better”, deci e consecventă.
- **Glosar:**
  - legați: market-order, limit-order, fill, slippage (L03) și notional-value (L12), la „position value”;
  - `partial-fill` și `order-book` nu au lecție. Simulatorul nu are execuții parțiale, așa că nu le-am introdus.
- **Practica:** trimite la M06 (U5). De verificat că M06 exersează limit și chasing, altfel legătura e slabă.

---

## L04 · Stop-loss and take-profit orders

| | |
|---|---|
| Unitate | U1 · How markets work, lecția 4 din 4 |
| Durată | 6 min · 7 beat-uri în Learn |
| Concepte | stop-loss-order, gap-risk, bracket-order, invalidation-level (introdus aici, predat în L10) |
| Termeni (glosar) | support, stop-loss, exit, take-profit, entry, long, stop-order, gap, invalidation, resistance, bracket-order, r |
| Se sprijină pe | L03 (market și limit), L02 (bid) |
| Pregătește | L08, L10, L11, M04 Define Your Risk, M07 Stop or Stay? |

**Obiective**
1. Place a stop-loss where the trade idea is proven wrong rather than at an arbitrary distance.
2. Explain why a stop can fill at a worse price than the stop after a gap.
3. Set a take-profit that follows from the plan.

### Hook
- **Grafic** (graficul lecției, folosit și în B4 și în Try): `Candles`, 24 de lumânări de 1h.
  - h1–h6 urcă de la 101.20, iar high-urile se opresc sub 104.00: h3 high 103.85, h5 high 103.96.
  - h7–h10 coboară; h10 low 98.04 (close 98.40) e prima atingere a suportului.
  - h11–h14 revin spre 99.60; h15 low 97.96 (close 98.30) e a doua atingere.
  - h16–h19 revin spre 99.80; h20 low 98.02 (close 98.50) e a treia atingere.
  - h21–h24 urcă până la close 100.00. Acesta e momentul de acum, cu entry la 100.00.
  - `Zone` support 97.90–98.10, la 12% opacitate. `Zone` resistance 103.80–104.00 se desenează doar în Try; în hook și în B4 lipsește, ca atenția să rămână pe stop.
  - Viitorul apare doar în B4, la pasul 3: h25–h30, cu h26 low 97.94 (close 98.30), apoi urcare până la 101.40 în h30.
- **Tip:** predict · tragere pe grafic. Pe graficul lecției sunt un `Level` entry fix la 100.00 (accent) și un `Level` draggable cu rol stop, start 99.50, interval 95.00–99.90; snap 0.01 la mouse, pas 0.05 din tastatură. „Lock it in” trimite răspunsul; `{yours}` = prețul nivelului.
- **Prompt:** "You buy LABX at 100.00 because [[support]] near 98.00 has held three times. Drag the line to where you'd get out if you're wrong."
- **Răspuns:** nu există unul singur. Recap-ul arată nivelul ales față de zona de suport (deasupra, în zonă, sub zonă) și reperul 97.70.
- **Concept:** stop-loss-order

### Learn

**B1 · explain**
> "A [[stop-loss]] (SL) is an [[exit]] order that closes your position if price moves against you to a level you chose in advance. A [[take-profit]] (TP) closes it if price reaches your target. Both are decided before [[entry]], while you're calm, and stay attached to the position, so they work while you're not watching."

**B2 · explain**
> "For a [[long]] position the stop sits below the entry. It's a [[stop-order]]: when the bid touches it, it becomes a market order to sell, usually filling at the stop or very close. If price [[gap|gaps]] through it, opening beyond the stop with no trading in between, it fills at the open, worse than the stop."

**B3 · worked** "A gap through the stop"
- Linii:
  1. "Long 25 units bought at 100.00, stop at 96.00."
  2. "Planned loss: 25 × (100.00 − 96.00) = 100.00 before commission: 1% of 10,000.00."
  3. "The next candle opens with the bid at 94.00."
  4. "The stop fills at 94.00. Loss: 25 × (100.00 − 94.00) = ?"
- **Ultimul pas îl calculează utilizatorul:** 150.00 (toleranță 0). După răspuns apare: "The gap added 50.00. A stop limits the loss you plan for; it doesn't guarantee it."
- **Feedback corect / greșit:**
  - corect: "Right: 150.00, which is 50.00 more than planned."
  - 100.00: "That's the planned loss, at 96.00. After the gap the stop filled at 94.00."
  - 50.00: "That's only the extra from the gap. Measure from the entry, 100.00."
  - altă valoare: "Loss = units × (entry − fill price): 25 × (100.00 − 94.00)."
- **Concept:** gap-risk

**B4 · figure** (din diagrama `stop-placement`)
- Date: graficul lecției, cu zona de suport și `Level` entry la 100.00.
  - Pasul 2: apare `Level` stop „STOP 97.95”.
  - Pasul 3: vălul se retrage peste h25–h30, iar pe h26 apare `Marker` „STOPPED 97.95”.
  - Pasul 4: apare `Level` stop „STOP 97.70” (2px, elementul discutat), iar stopul de la 97.95 trece la 60%. Un `Bracket` între 97.90 și 97.70 poartă eticheta „BUFFER 0.20”.
- Pași:
  1. "You bought at 100.00 because support near 98.00 held three times."
  2. "A stop at 97.95, a few cents under 98.00, sits inside the zone, where wicks already poked."
  3. "The next dip reaches 97.94. Support holds, but that stop fills at 97.95. Price then climbs to 101.40."
  4. "At 97.70, beyond the zone, the stop is hit only if support breaks: the [[invalidation]] point."
- **Interacțiune:** după pasul 4, stopul de la 97.70 se poate trage (95.00–99.90). Figura marchează „STOPPED” sau „STILL OPEN” pe drumul dezvăluit, după regula motorului: stopul e atins când bid-ul (mid − 0.05) ≤ stop. E explorare, fără verificare (§8.4, „trage stop-ul”).

**B5 · explain**
> "A take-profit works like a limit order on the way out. For a long, it sells when the bid reaches your target, at that price or better. Put it where the plan says price could reasonably go, such as the next [[resistance]], not at a number picked to make the trade look attractive."

**B6 · worked** "A bracket, measured in R"
- **Text:** "Stop plus target on one entry: a [[bracket-order|bracket]]. When one fills, the other is cancelled. [[r|1R]] is the loss at your stop."
- Linii:
  1. "Long 40 bought at 100.00, stop 99.00, target 102.00."
  2. "Risk: 40 × (100.00 − 99.00) = 40.00 vUSD = 1R."
  3. "Reward: 40 × (102.00 − 100.00) = 80.00 vUSD."
  4. "In R: 80.00 ÷ 40.00 = ?"
- **Ultimul pas îl calculează utilizatorul:** 2 (toleranță 0), afișat „+2R”. După răspuns apare: "+2R, before costs."
- **Feedback corect / greșit:**
  - corect: "Right: the target is twice as far as the stop, so +2R."
  - 0.5: "That's risk ÷ reward. Divide the reward by the risk."
  - 40 sau 80: "Express the reward in units of risk: 80.00 ÷ 40.00."
- **Concept:** bracket-order

**B7 · callout** (warning)
> "Choose the stop first, then size the position to fit it. Moving a stop further away as price approaches it is a common mistake: it turns a planned, sized loss into a larger, unplanned one. Move a stop only in the direction that reduces risk."

### Try
- **Widget:** bracket-builder (nou)
- **Valori de start:**
  - poziție long de 25 de unități, entry 100.00 (fix), stop 99.50, target 101.00;
  - graficul lecției, cu ambele zone: support 97.90–98.10 și resistance 103.80–104.00;
  - widget-ul arată la start: loss −12.50 vUSD (−1R), gain +25.00 vUSD (+2.00R). E un 2R desenat fără niciun motiv pe grafic, și asta e intenționat.
- **Obiectiv:** "Your idea: support near 98.00 holds and price returns to resistance near 104.00. Place the stop just beyond support and the target at resistance."
- **Reușită:** la Check, 97.40 ≤ stop ≤ 97.80 și 103.60 ≤ target ≤ 104.00.
- **Indicii:**
  1. "Start with the stop. Where would 'support holds' be proven wrong?"
  2. "The stop goes a little below the support zone, under 97.90. The target goes at the resistance zone, 103.80–104.00."
  3. "Drag the stop to 97.70, 0.20 under the zone. Loss at the stop: 25 × 2.30 = 57.50 vUSD, your 1R."
- **Show me:** stop 97.70, target 103.80.
  - loss −57.50 vUSD (−1R); după comision −59.98;
  - gain +95.00 vUSD (+1.65R); după comision +92.45.
- **Feedback:**
  - corect: "Right. Stop where the idea fails, target where the plan points. This bracket is {gainR}R, and the chart set it, not a wish."
  - după o încercare greșită (se verifică întâi stopul, apoi target-ul):
    - stop ≥ 97.90: "A stop at {stop} sits above or inside the support zone, where ordinary noise reaches. It can be hit while the idea is still right."
    - stop între 97.81 și 97.89: "Just under the zone, with almost no room. A poke to the zone's edge, 97.90, puts the bid at 97.85. Leave about 0.10 or more."
    - stop < 97.40: "That stop is beyond support but far from it. The extra distance adds loss without telling you more about the idea."
    - target > 104.00: "That target sits beyond the resistance where rises have stalled. Your plan gives no reason to expect more."
    - target < 103.60: "That target stops short of the level your plan names. Set it at the resistance, 103.80–104.00."
- **Concept:** bracket-order

### Check
- Întrebări: q-ot-6, q-ot-7, q-ot-9
- **Înlocuiri propuse: q-ot-4 → q-ot-9 și q-ot-5 → q-ot-7.**
  - q-ot-5 are exact cifrele din B3 (25, 100.00, 96.00, 94.00 → 150.00). q-ot-7 verifică aceeași idee (stopul devine market, gap-ul îl sare) fără să repete cifrele.
  - Obiectivul 3 (take-profit) nu are nicio întrebare în checkul de azi. q-ot-9 îl acoperă.
  - q-ot-4 (stopul sub entry, la invalidare) e exersat deja de hook, B4 și Try. q-ot-6 rămâne: verifică invalidarea și regula din B7 (nu muți stopul mai departe).
- Alternativă: q-ot-10 (nouă, bracket, d1) în locul lui q-ot-9, dacă intră în bancă.
- **Observație pentru `check-order_types`:** setul fix de 5 întrebări (2 × d1, 2 × d2, 1 × d3, în ordinea id-urilor) e q-ot-1, q-ot-2, q-ot-3, q-ot-5, q-ot-8. Patru sunt din L03 și niciuna nu e despre take-profit. Pool-urile din §6.3 ar trebui să echilibreze lecțiile.

### Recap
- **Hook comparat:** "You put your exit at {yours}. Support runs down to 97.90; a stop just beyond it, like 97.70, is hit only if support breaks."
- **Three things to remember:**
  1. "Put the stop where the idea is proven wrong, just beyond the level, not where the loss feels small."
  2. "A stop becomes a market order when touched. After a gap, it fills at the open, worse than planned."
  3. "Set the take-profit where the plan says price can go, such as the next resistance. Measure both exits in R."
- **Practise it:** M04 Define Your Risk, M07 Stop or Stay?, Arena: event shock

### Note de conținut
- **Calcule verificate:**
  - gap: 25 × 4.00 = 100.00; 25 × 6.00 = 150.00; diferența e 50.00;
  - cu comisionul motorului: planificat 100.00 + 1.25 + 1.20 = 102.45; real 150.00 + 1.25 + 1.18 = 152.43. Lecția spune „before commission”, deci e corectă. Cu costuri, 25 de unități depășesc bugetul de 1% cu 2.45; L09 tratează asta;
  - B6: 40 × 1.00 = 40.00; 40 × 2.00 = 80.00; 80.00 ÷ 40.00 = 2;
  - Try: 25 × 2.30 = 57.50 și 25 × 3.80 = 95.00; 3.80 ÷ 2.30 = 1.652 → 1.65R. Comisioane: 2,500.00 → 1.25; 2,442.50 → 1.22125 → 1.23; 2,595.00 → 1.2975 → 1.30. Deci −59.98 (= `riskAmount` din motor) și +92.45;
  - B4: mid 97.94 → bid 97.89 ≤ 97.95, deci stopul de la 97.95 se execută la 97.95; cel de la 97.70 nu e atins.
- **Diagrama stop-placement de azi:**
  - stopul „too tight” e desenat deasupra zonei de suport, între preț și suport, dar caption-ul și textul spun „just under support” și „a few cents under 98.00”;
  - culorile `neg` și `pos` marchează „greșit” și „corect”, contrar §8.2.

  Varianta nouă: ambele niveluri au rolul stop. Diferența o fac eticheta, grosimea (2px pentru cel discutat) și pasul 3, care arată efectul pe date.
- **Intervalul de succes pentru stop (97.40–97.80):** limita de sus lasă cel puțin 0.10 sub zonă, pentru că stopul unui long se declanșează pe bid (mid − 0.05). Limita de jos (0.50 sub zonă) vine din „just beyond” și din „plus a small buffer” al conceptului invalidation-level. Target-ul (103.60–104.00) e „la rezistență”, cu 0.20 toleranță dedesubt. Toate trei sunt decizii de conținut, de confirmat.
- **R:** e introdus în L04 (din conceptul bracket-order și glosarul `r`), fiindcă bracket-builder afișează R (PLAN §9.2). Aici R e raportul distanțelor, înainte de costuri. Definiția completă, cu costuri (`riskAmount` din motor), vine în L08. De spus explicit în widgets.md, ca R-ul afișat să nu se confunde mai târziu.
- **Termeni din alte lecții:** `support` și `resistance` (L06) și `invalidation` (L10) apar aici înainte de lecțiile lor; lecția de azi le folosea deja. Definițiile din glosar ajung ca tooltip. Propun adăugarea L04 în `lessons` la conceptul invalidation-level.
- **Termeni ai lecției care lipseau din text:** `bracket-order` și `stop-order` au lecția L04 în glosar, dar nu apăreau în textul lecției. Acum sunt legați (B6 și B2). `long`, `entry` și `exit` nu aveau lecție; propun `lesson: "L04"`.
- **Interacțiune:** lecția nu are niciuna azi (PLAN §1). Primește bracket-builder.
- **Întrebări noi:** banca nouă propune q-ot-10 și q-ot-11 (bracket). q-ot-11 folosește aceleași cifre ca B6 (40 de unități, 99.00 / 102.00), dar cu intrare market la ask (100.05). Asta e compatibil: B6 spune „bought at 100.00”, deci prețul de execuție.

---

## Cerințe pentru widget-uri

Valabil pentru toate patru (PLAN §9):
- modul task: obiectiv, valori de start din conținut, butoanele Check, Reset și Show me (setarea corectă, animată în ~400ms, instant cu reduced motion), indicii în trepte (tasta H);
- feedback sub widget, cu `aria-live="polite"`, și stările idle → engaged → submitted → correct / incorrect → resolved;
- condițiile de reușită și ramurile de feedback se evaluează în cenți (întregi), declarativ (`SuccessSpec`), cu placeholders completate din starea widget-ului;
- desenul folosește Learn Chart Kit (§8), iar fiecare control are variantă completă din tastatură.

### candle-builder (există)
- **Controale:** 4 slidere, Open, High, Low și Close, 97.00–103.00, pas 0.10 (ca azi). Se adaugă: slider-ele High și Low afișează valoarea efectivă (high ≥ max(open, close), low ≤ min(open, close)) în loc să accepte în tăcere un high sub corp.
- **Ieșiri:** Direction, Body, Upper wick, Lower wick, Range și nota text (există). Lumânarea se desenează cu `Candles` din kit, cu cipuri de preț pentru O, H, L și C.
- **Task L01:**
  - start 100.00 / 101.50 / 99.20 / 101.00;
  - reușită, pe valori efective: close < open ∧ (close − low) ≥ 2 × (open − close) ∧ (close − low) > (high − open);
  - Show me 100.00 / 100.20 / 98.80 / 99.70;
  - feedback-ul alege mesajul după prima condiție care pică; are nevoie de placeholders {body}, {upper}, {lower}, {low}.
- **Opțional:** nota text să poată combina „small body” cu „long lower wick”. Azi prima o ascunde pe a doua.

### spread-cost (există, cu corectura din §9.1)
- **Controale:**
  - Units 1–200, pas 1;
  - Mid 20.00–200.00, pas 0.50;
  - Spread 0.02–0.50, pas 0.02;
  - **nou: Commission 0.00%–0.20%, pas 0.01%** (0–20 bps, implicit 0.05%), trecut în `commission(notional, bps)`. Eticheta „Commission (0.05% × 2 fills)” urmează valoarea.
- **Ieșiri:** ask, bid, spread cost, commission entry + exit (fiecare rotunjit în sus la cent), round-trip cost, break-even per unit (există).
- **Mod task nou:**
  - un câmp numeric „Your answer (vUSD)”, care acceptă virgulă sau punct;
  - rândurile spread cost, commission, round-trip cost și break-even sunt mascate până la trimitere;
  - după trimitere apar, cu `Formula` („10.00 + 2.51 + 2.50 = 15.01”).
- **Task L02:**
  - start 50 / 100.00 / 0.10 / 0.05%;
  - reușită: units 100 ∧ mid 50.00 ∧ spread 0.10 ∧ commission 0.05% ∧ |answer − 15.01| ≤ 0.01;
  - ramurile de feedback depind de valoarea răspunsului (10.00; 12.50 sau 12.51; 5.00 sau 5.01; 20.00 sau 20.01) și de starea controalelor.

### order-fill (nou)
- **Grafic:**
  - `LearnChart` cu `Candles`: istoric (10 lumânări) și viitor (12 lumânări) sub văl, ambele serii din conținut, deterministe;
  - cipurile MID, ASK și BID pe axă, actualizate la fiecare oră jucată;
  - panoul „Plan”, cu textul din conținut.
- **Ticket:**
  - Side: Buy | Sell (segmentat);
  - Type: Market | Limit;
  - Limit price: `Level` draggable (rol entry, întrerupt cât e pending) și un câmp numeric sincronizat; interval 95.00–105.00, snap 0.01, săgeți ±0.01, Shift + săgeți ±0.10; inactiv la Market;
  - Units: fix din conținut (30), afișat.
- **Acțiuni:**
  - Place order: evaluează task-ul;
  - Play 12 hours: vălul se retrage în 700ms, lumânările apar la 30–40ms una de alta; instant cu reduced motion;
  - Replay, Reset, Show me.
- **Reguli de execuție:** cele ale motorului, din secțiunea de la începutul fișierului. Ideal, widget-ul rulează chiar `apply` / `advance` din `packages/engine` pe un context mic, ca cifrele să fie cele din Arena.
- **Ieșiri:**
  - `Marker` la fill, cu prețul și ora;
  - panoul de rezultat: Filled / Not filled, fill price, hour, fill value (units × price), commission (ceil);
  - pentru o buy limit neexecutată: „Lowest ask: X (mid Y)”; pentru o sell limit: „Highest bid: X (mid Y)”.
- **Stări:** setting → placed (pending sau executat imediat) → playing → done (filled / not filled).
- **Task L03:**
  - start Buy / Market / 100.00, 30 de unități;
  - reușită: Buy ∧ Limit ∧ 99.00, evaluată la Place order. Continue se deblochează după terminarea jocului;
  - ramuri de feedback: market buy (cu mesajul de proces după joc), sell, limit ≥ ask, 99.01–100.04, sub 99.00. Placeholder: {price}.

### bracket-builder (nou)
- **Grafic:**
  - `LearnChart` cu `Candles` și `Zone`-urile (suport, rezistență), toate din conținut;
  - `Level` entry fix, în accent;
  - `Level` stop (draggable, rol stop, `--ml-neg`) și `Level` target (draggable, rol target, `--ml-pos`);
  - câte un `Bracket` pentru distanțele entry–stop și entry–target.
- **Controale:**
  - stop în intervalul 95.00 – (entry − 0.01), target în intervalul (entry + 0.01) – 106.00;
  - snap 0.01, săgeți ±0.01, Shift ±0.10, câmpuri numerice sincronizate;
  - doar long în U1 (stop < entry < target);
  - units fix din conținut (25); un câmp de units, opțional, pentru lecțiile de mai târziu.
- **Ieșiri:**
  - stop distance; Loss at stop, înainte de comision = units × distanță, afișat „−57.50 vUSD · −1R”; după comision „−59.98” (= `riskAmount` din motor);
  - target distance; Gain at target „+95.00 vUSD · +1.65R” (R = distanța target ÷ distanța stop, 2 zecimale); după comision „+92.45”.
- **Task L04:**
  - start: stop 99.50, target 101.00 (−12.50 / +25.00 / +2.00R);
  - reușită: 97.40 ≤ stop ≤ 97.80 ∧ 103.60 ≤ target ≤ 104.00;
  - Show me: 97.70 / 103.80;
  - ramuri de feedback pe intervale: stop ≥ 97.90; 97.81–97.89; sub 97.40; target > 104.00; target < 103.60. Placeholders: {stop}, {gainR}.
- **Hook-ul L04** folosește același grafic și un singur `Level` stop draggable, fără ieșiri. Poate fi bracket-builder în modul „stop only”, cu „Lock it in” în loc de Check.

### Controale cerute de beat-uri (nu sunt widget-uri, ci player și kit)
- L01, hook și B4: `Hotspot` pe cele 4 puncte ale unei lumânări (≥ 44px); răspunsul e prețul punctului.
- L01, B6: două `Line` intra-oră desenate peste aceeași lumânare.
- L02, B2: slider pe spread în figură (0.02–0.50, pas 0.02).
- L03, hook: slider 98.80–99.20, pas 0.05, legat de o linie MID pe grafic.
- L03, B6: reveal cu văl și variante de răspuns după reveal.
- L04, B4: stop draggable pe drumul dezvăluit, cu marcajul „STOPPED” sau „STILL OPEN”.

### Notă pentru unitate
M01 e singura misiune de final a U1 și exersează doar L01. Pentru L02–L04, practica trimite la misiuni din unitățile următoare (M05, M06, M04, M07). De decis dacă U1 primește o a doua misiune de final, de exemplu una despre ordine și execuții, sau dacă rămâne așa.
