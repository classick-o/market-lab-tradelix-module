# Întrebări · Piețe, ordine, analiză tehnică, dimensionare, expunere

Banca de întrebări îmbunătățită pentru cele cinci topicuri din `packages/academy/src/content/questions-a.ts`: Market Fundamentals (`q-mf-*`), Order Types (`q-ot-*`), Technical Analysis (`q-ta-*`), Position Sizing (`q-ps-*`) și Portfolio Exposure (`q-pe-*`). Convențiile (lumea simulată, vocea, limitele de lungime) sunt cele din [README.md](README.md). Sistemul (concepte, recapitulare, pools, indicii, `vary`) e cel din [PLAN_LEARN.md](../../PLAN_LEARN.md) §6.1–6.3, §9.3 și §9.4.

- La întrebările existente, promptul, variantele și explicația generală rămân cele din `questions-a.ts`. Aici se adaugă ce lipsește: conceptele, explicațiile per variantă, indiciile, `vary`, verificarea și corecturile.
- Textul pe care îl vede utilizatorul e în engleză. Notele sunt în română.
- Toate calculele au fost refăcute. Cele de dimensionare cu costuri au fost verificate și cu regulile motorului (`packages/engine/src/sizing.ts`, `units.ts`): comision 0.05% pe fiecare execuție, rotunjit în sus la cent; unitățile se rotunjesc în jos.

## Pe scurt

| | Număr |
|---|---|
| Întrebări existente revizuite | 46 |
| Explicații per variantă (rationale) | 111 la cele existente + 21 la cele noi = **132** |
| Indicii (câte 3) | 20 de întrebări existente (60) + 4 noi (12) = **72** |
| Generatoare `vary` | 9 existente + 4 noi = **13** |
| Probleme găsite | **4**: q-mf-3, q-mf-6, q-ps-8, q-mf-9 (ultima e doar o observație) |
| Întrebări noi propuse | **11**: MF 2, OT 2, TA 3, PS 2, PE 2 |

## Acoperire

### Pe topic: tipuri și dificultăți

Azi:

| Topic | Total | mcq | scenario | numeric | d1 | d2 | d3 | Pool check (2 × d1, 2 × d2, 1 × d3) |
|---|---|---|---|---|---|---|---|---|
| Market Fundamentals | 9 | 5 | 2 | 2 | 3 | 4 | 2 | da |
| Order Types | 9 | 6 | 2 | 1 | 4 | 4 | 1 | da, dar un singur d3 |
| Technical Analysis | 10 | 6 | 3 | 1 | 2 | 6 | 2 | da, d1 la limită |
| Position Sizing | 9 | 4 | 2 | 3 | 2 | 4 | 3 | da, d1 la limită |
| Portfolio Exposure | 9 | 4 | 3 | 2 | 3 | 4 | 2 | da |
| **Total** | **46** | 25 | 12 | 9 | 14 | 22 | 10 | |

După întrebările noi propuse:

| Topic | Total | mcq | scenario | numeric | d1 | d2 | d3 | Pool check |
|---|---|---|---|---|---|---|---|---|
| Market Fundamentals | 11 | 6 | 3 | 2 | 4 | 5 | 2 | da |
| Order Types | 11 | 7 | 2 | 2 | 5 | 5 | 1 | da, dar un singur d3 |
| Technical Analysis | 13 | 8 | 3 | 2 | 3 | 7 | 3 | da |
| Position Sizing | 11 | 5 | 2 | 4 | 3 | 5 | 3 | da |
| Portfolio Exposure | 11 | 4 | 4 | 3 | 3 | 6 | 2 | da |
| **Total** | **57** | 30 | 14 | 13 | 18 | 28 | 11 | |

- Order Types rămâne cu un singur d3 (q-ot-8), deci la retake d3-ul se repetă mereu. Regula „2 × d1, 2 × d2, 1 × d3” e respectată; un al doilea d3 ar fi util, dar nu e obligatoriu.

### Acoperirea conceptelor

Se numără doar întrebările din această bancă. Cu **bold**: conceptele cu 0 sau 1 întrebări azi.

| Concept | Topic | Azi | Întrebări existente | Noi | După |
|---|---|---|---|---|---|
| candlestick | MF | 4 | q-mf-1, q-mf-2, q-mf-3, q-mf-8 | q-mf-10 | 5 |
| **timeframe** | MF | **1** | q-mf-8 | q-mf-10, q-mf-11 | 3 |
| bid-ask-spread | MF | 6 | q-mf-4, q-mf-5, q-mf-6, q-mf-9, q-ot-3, q-ot-8 | q-ot-11 | 7 |
| trading-costs | MF | 5 | q-mf-5, q-mf-6, q-mf-7, q-ps-3, q-ps-9 | — | 5 |
| market-order | OT | 3 | q-mf-4, q-mf-9, q-ot-1 | — | 3 |
| limit-order | OT | 3 | q-ot-2, q-ot-3, q-ot-8 | — | 3 |
| **bracket-order** | OT | **1** | q-ot-9 | q-ot-10, q-ot-11 | 3 |
| slippage | OT | 2 | q-ot-5, q-ot-7 | — | 2 |
| trend | TA | 2 | q-ta-1, q-ta-3 | q-mf-11 | 3 |
| range | TA | 2 | q-ta-2, q-ta-9 | — | 2 |
| support-and-resistance | TA | 3 | q-ta-2, q-ta-4, q-ta-6 | — | 3 |
| breakout | TA | 2 | q-ta-5, q-ta-6 | q-ta-11 | 3 |
| **false-breakout** | TA | **1** | q-ta-5 | q-ta-11 | 2 |
| moving-average | TA | 4 | q-ta-7, q-ta-8, q-ta-9, q-ta-10 | — | 4 |
| **volatility** | TA | **0** | — | q-ta-12, q-ta-13 | 2 |
| position-sizing | PS | 7 | q-ps-1, q-ps-2, q-ps-4, q-ps-5, q-ps-6, q-ps-7, q-ps-8 | q-ps-10 | 8 |
| **fixed-fractional-sizing** | PS | **1** | q-ps-1 | q-ps-10, q-ps-11 | 3 |
| cost-adjusted-sizing | PS | 3 | q-ps-3, q-ps-7, q-ps-9 | — | 3 |
| exposure | PE | 7 | q-pe-1, q-pe-2, q-pe-3, q-pe-5, q-pe-6, q-pe-7, q-pe-8 | q-pe-11 | 8 |
| leverage | PE | 7 | q-pe-2, q-pe-3, q-pe-4, q-pe-5, q-pe-8, q-pe-9, q-ps-8 | — | 7 |
| **correlation-and-concentration** | PE | **1** | q-pe-7 | q-pe-10, q-pe-11 | 3 |

- `volatility` e predat în L16 (topic risk_management). Întrebările q-rm-8, q-rm-9, q-rm-10 și q-sl-9 din cealaltă bancă îl ating probabil, dar banca Technical Analysis nu avea niciuna.

Concepte din alte topicuri, folosite ca al doilea concept aici:

| Concept | Topic | Întrebări |
|---|---|---|
| stop-loss-order | stop_loss | q-ot-4, q-ot-6, q-ot-7 |
| invalidation-level | stop_loss | q-ot-4, q-ot-6, q-ps-2 |
| gap-risk | stop_loss | q-ot-5, q-pe-6, q-pe-9 |
| risk-per-trade | risk_management | q-ps-5, q-ps-6, q-ps-11 (nouă), q-pe-10 (nouă) |

### Probleme găsite (rezumat)

| Întrebare | Problemă | Corectură propusă |
|---|---|---|
| q-mf-3 | Varianta `b` se poate apăra ca adevărată: minimul vine oricum înaintea închiderii, deci „fell to the low, then recovered to close near the high” e mereu adevărat. | Eticheta `b` devine „Price made its low before its high, then closed near the high”. |
| q-mf-6 | Varianta corectă și explicația spun că poziția e evaluată la bid. Motorul o evaluează la mid (`markPrice` = închiderea, `unrealizedPnl` pe mid). | Se rescriu eticheta `b` și explicația (text mai jos) sau se schimbă evaluarea din motor. Decizia e a echipei. |
| q-ps-8 | Plafonul real din simulator e 99 de unități, nu 100: ordinul are nevoie de buying power și pentru comisionul de intrare (10,000.00 + 5.00 > 10,000.00). | Eticheta `c` fără cifra 100, iar explicația menționează 99. Notă de cod: plafonul din `maxQtyForRisk` ignoră comisionul. |
| q-mf-9 | Observație: un singur pas (bid × unități), mai ușoară decât q-mf-5 (d2). | Opțional d2. Atunci MF rămâne cu un singur d3 (q-mf-8). |

### Note pentru implementare

- **Formatul `vary`.** §9.3 propune `vary: { seedFields, formula }`. Mai sunt necesare două lucruri:
  - `constraints`, ca cifrele să rămână realiste și răspunsul curat;
  - `explain(v)` și `hints(v)`, pentru că explicația existentă și indiciul 3 conțin cifrele originale. Fără ele, o variantă nouă ar arăta explicația cu cifrele vechi.
- **Testele pentru `vary`.** Fiecare generator se testează pe tot intervalul: răspunsul calculat cu `formula` trebuie să fie egal cu cel calculat independent. Pentru q-ps-3 și q-ps-10 calculul independent e `maxQtyForRisk` din motor.
- **Toleranța** rămâne cea din `numeric.tolerance`. `isCorrect` adaugă deja 1e-9.
- **L16 e `tier: "pro"`.** q-ta-12 și q-ta-13 trimit acolo, pentru că ATR se predă doar în L16. Dacă banca Technical Analysis trebuie să rămână complet free, ele pot trimite la L05 (conceptul `volatility` are deja L05 în `lessons`). În cazul ăsta L05 primește un beat scurt despre ATR.
- **Cod, în afara acestui fișier.** `maxQtyForRisk` plafonează cu `floor(maxNotional ÷ entry)`, dar `previewOrder` cere `notional + entryFee ≤ buyingPower`. Widget-ul position-size și OrderTicket pot sugera deci 100 de unități la 100.00, iar motorul le refuză. Misiunile ocolesc problema cu `0.995 × equity` (`missions/src/content/common.ts`).

---

## Market Fundamentals

Lecții: L01 What a candle shows, L02 Bid, ask and the spread.

#### q-mf-1 · mcq · d1 · L01
- **Concepte:** candlestick
- **Explicații per variantă** (varianta corectă păstrează explicația existentă):
  - `a` "Bullish, because the high is above the open" → "The high only shows how far price reached during the hour. Direction comes from the close against the open, and 99.80 is below 100.00."
  - `b` "Bullish, because the close is above the low" → "Every close is at or above the low, so this says nothing about direction. Compare the close with the open: 99.80 is below 100.00."
  - `c` "Neither, because it has wicks on both sides of its body" → "Wicks mark the high and the low, not the direction. A candle whose close differs from its open is bullish or bearish, and this one closed lower."
  - `d` ✓ (corectă)
- **Verificare:** close 99.80 < open 100.00, deci bearish. `d` e singura corectă: `a` și `b` citesc direcția din high sau low, `c` o citește din fitile.

#### q-mf-2 · numeric · d1 · L01
- **Concepte:** candlestick
- **Indicii:** 1. "Decide first whether the candle is bullish or bearish. That tells you which price forms the bottom of the body." 2. "The lower wick runs from the bottom of the body down to the low. For a bullish candle, the bottom is the open." 3. "The bottom of the body is the open, 100.00. Now subtract the low, 99.20."
- **Variații (vary):**
  - Câmpuri: `open` 95.00–105.00, pas 0.10; `body` 0.30–1.50, pas 0.10 (close = open + body); `upper` 0.10–0.80, pas 0.10 (high = close + upper); `lower` 0.20–1.20, pas 0.10 (low = open − lower).
  - Formula: `answer = open − low`.
  - Toleranța: 0.001, unitate vUSD.
  - Constrângeri: lumânarea rămâne bullish; `lower ≠ upper`, ca fitilele să nu se poată confunda; `lower ≠ body`.
  - Exemplu: open 101.30, high 102.40, low 100.70, close 102.10 → 101.30 − 100.70 = **0.60**. Capcana din explicație devine close − low = 1.40.
- **Verificare:** 100.00 − 99.20 = 0.80 = `numeric.answer` 0.8 ✓.

#### q-mf-3 · mcq · d2 · L01
- **Concepte:** candlestick
- **Explicații per variantă:**
  - `a` "The next candle is likely to rise, because buyers clearly won this hour" → "That turns a record of one hour into a forecast. A candle shows four prices from the past hour and says nothing reliable about the next one."
  - `b` "Price fell to the low first, then recovered to close near the high" → "A candle shows the open, high, low and close, not their order. Price could have made its high before its low, so 'first' is an assumption."
  - `c` ✓ (corectă)
  - `d` "Buyers will defend this low if price comes back to test it" → "That predicts what happens at a price later. The candle only records that price traded there during this hour, not how it will react next time."
- **Verificare:** cu fitil inferior lung și închidere aproape de high, low-ul e mult sub open, fie că lumânarea e bullish, fie bearish. `c` e adevărată în ambele cazuri.
- **Probleme găsite:** varianta `b` e ambiguă. Minimul vine oricum înaintea închiderii, deci „a coborât la minim, apoi a revenit și a închis aproape de maxim” e mereu adevărat. Doar cuvântul „first” o face greșită, iar cititorul îl poate rata. Propunere: eticheta `b` devine "Price made its low before its high, then closed near the high". Explicația per variantă de mai sus funcționează pentru ambele formulări.

#### q-mf-4 · mcq · d1 · L02
- **Concepte:** bid-ask-spread, market-order
- **Explicații per variantă:**
  - `a` "99.95" → "99.95 is the bid, the price a seller receives. A market buy pays the ask, which is the mid plus half the spread."
  - `b` "100.00" → "The mid is the halfway point the chart is drawn from, and no order fills there. A buyer pays the ask, 0.05 above it."
  - `c` ✓ (corectă)
  - `d` "100.10" → "That adds the whole spread to the mid. The ask is only half a spread above it: 100.00 + 0.05."
- **Verificare:** ask = 100.00 + 0.05 = 100.05 ✓.

#### q-mf-5 · numeric · d2 · L02
- **Concepte:** trading-costs, bid-ask-spread
- **Indicii:** 1. "A round trip has two costs: the spread, crossed once, and commission, paid on both fills." 2. "Spread cost = units × 0.10. Commission = 0.05% × (buy fill value + sell fill value)." 3. "Spread: 20 × 0.10 = 2.00. Buy fill: 20 × 100.05 = 2,001.00. Sell fill: 20 × 99.95 = 1,999.00."
- **Variații (vary):**
  - Câmpuri: `units` 10–100, pas 10; `mid` 40.00–150.00, pas 5.00.
  - Formula: `answer = units × 0.10 + 0.0005 × (units × (mid + 0.05) + units × (mid − 0.05))`, adică `units × (0.10 + 0.001 × mid)`.
  - Toleranța: 0.01, unitate vUSD. Acoperă și rotunjirea simulatorului, care adaugă cel mult 0.01 pe round trip; verificat pe tot intervalul.
  - Constrângeri: `units × (mid + 0.05) ≤ 10,000.00` (fără levier). Cu aceste pași, totalul iese mereu exact la cent.
  - Exemplu: 40 units, mid 50.00 → spread 4.00; buy 40 × 50.05 = 2,002.00, sell 40 × 49.95 = 1,998.00; comision 0.05% × 4,000.00 = 2.00; total **6.00**.
- **Verificare:** 2.00 + 0.05% × 4,000.00 = 4.00 ✓. Cu rotunjirea simulatorului: 1.01 + 1.00 = 2.01, total 4.01, tot în toleranță.

#### q-mf-6 · scenario · d2 · L02
- **Concepte:** bid-ask-spread, trading-costs
- **Explicații per variantă:**
  - `a` "The mid dipped and recovered too quickly to show on the chart" → "No hidden move is needed. The loss is there with the mid unchanged, because you bought at the ask and paid commission."
  - `b` ✓ (corectă)
  - `c` "Open positions always show a loss until the current candle has closed" → "Candle timing has nothing to do with it. The loss comes from costs paid at entry, and it stays until price moves enough to cover them."
  - `d` "The platform charges a holding fee for every minute a position is open" → "MARKET//LAB charges no holding fee. The only costs are the spread and a commission on each fill, and the entry ones are already paid."
- **Verificare:** pierderea vine din costurile de intrare; `a`, `c` și `d` inventează cauze care nu există în simulator.
- **Probleme găsite:** varianta corectă ("…but it is valued at the bid") și explicația ("valued at … the bid, which is 0.10 below the ask") nu se potrivesc cu motorul. `markPrice` e închiderea (mid-ul), iar `unrealizedPnl` evaluează poziția la mid. La 50 de unități, P&L-ul nerealizat e −2.50 (jumătate de spread), iar equity-ul mai scade cu comisionul de intrare de 2.51. Explicația ar da −5.00 plus comisionul. Două variante:
  - **Conținut (recomandat):** `b` devine "You bought at the ask, above the mid, and paid a commission on entry". Explicația devine "You bought at the ask, 0.05 above the mid the position is valued at, and paid the entry commission, so you start behind with the mid unchanged. Closing would also cost the other half of the spread and a second commission."
  - **Motor:** pozițiile long se evaluează la bid (valoarea de lichidare). Asta s-ar potrivi și cu eticheta „If closed at the last price” din `Portfolio.tsx`, care azi e inexactă.

#### q-mf-7 · mcq · d2 · L02
- **Concepte:** trading-costs
- **Explicații per variantă:**
  - `a` ✓ (corectă)
  - `b` "The spread on LABX widens automatically when the market is quiet" → "On LABX the spread is a fixed 0.10 in every condition. The costs stay the same; what shrinks in a quiet market is the move they are compared with."
  - `c` "Commission is charged again on every candle while a position is open" → "Commission is charged once per fill, on entry and on exit, not per candle. The issue is the size of the move compared with those fixed costs."
  - `d` "They don't: costs are always the same share of the result" → "Costs are fixed per trade; the result is not. A 0.20 round trip per unit is a small share of a 3.00 move and all of a 0.20 move."
- **Verificare:** la mid 100.00, round trip-ul costă 0.10 spread + 0.10 comision = 0.20 pe unitate (L02) ✓. `a` e singura corectă.

#### q-mf-8 · scenario · d3 · L01
- **Concepte:** candlestick, timeframe
- **Explicații per variantă:**
  - `a` "Agreed: three bullish candles in a row confirm the next one will rise" → "Candles record past hours, not the next one. On 1-hour charts, two or three candles in the same direction are often just noise."
  - `b` "The fourth is more likely to be bearish, because a reversal is now due" → "Nothing is 'due' after three rises. This is the same mistake in reverse: reading a forecast into candles that only describe what already happened."
  - `c` "Only the size of the wicks can settle whether the next one rises" → "Wicks are part of the same record of the past. No part of a candle, body or wick, settles what the next hour does."
  - `d` ✓ (corectă)
- **Indicii:** 1. "Ask what a candle records: four prices from an hour that is already over." 2. "Candles describe what happened. Neither a continuation nor a reversal follows from a few of them alone." 3. "Three rising closes on 1-hour candles can be part of a trend or just noise. Pick the answer that only describes them."
- **Verificare:** `d` e singura care descrie fără să prezică. `a` și `b` prezic în sensuri opuse, `c` dă fitilelor putere de predicție.

#### q-mf-9 · mcq · d3 · L02
- **Concepte:** bid-ask-spread, market-order
- **Explicații per variantă:**
  - `a` "3,000.00" → "That values the sale at the mid, 100.00. No order fills at the mid; a market sell receives the bid, 0.05 below it."
  - `b` ✓ (corectă)
  - `c` "2,997.00" → "That takes the whole spread off the mid. The bid is only half a spread below: 100.00 − 0.05 = 99.95."
  - `d` "3,001.50" → "That is 30 units at the ask, the price a buyer pays. You are selling, so you receive the lower price, the bid."
- **Indicii:** 1. "You are selling. Decide whether a sell fills at the bid or at the ask." 2. "Bid = mid − 0.05. Fill value = units × fill price, before any commission." 3. "Bid: 100.00 − 0.05 = 99.95. Now multiply by 30 units."
- **Verificare:** 30 × 99.95 = 2,998.50 ✓. Celelalte variante corespund, în ordine, mid-ului (3,000.00), spread-ului întreg scăzut (30 × 99.90 = 2,997.00) și ask-ului (30 × 100.05 = 3,001.50).
- **Probleme găsite:** observație de dificultate. Calculul are un singur pas și e mai ușor decât q-mf-5 (d2). Poate deveni d2; atunci MF rămâne cu un singur d3 (q-mf-8). Nu e o schimbare obligatorie.

## Întrebări noi propuse · Market Fundamentals

Motiv: `timeframe` are o singură întrebare (q-mf-8), și acolo e al doilea concept.

#### q-mf-10 · mcq · d1 · L01
- **Concepte:** timeframe, candlestick
- **Prompt:** "A MARKET//LAB chart shows 48 candles. What does each candle represent, and how much time does the chart cover?"
- **Variante:**
  - `a` "One trade each, so 48 trades in total" → "A candle summarises a whole period of trading, not a single trade. On MARKET//LAB charts that period is one hour."
  - `b` ✓ "One hour of trading each, so two days in total"
  - `c` "One day of trading each, so 48 days in total" → "Daily candles exist on other charts, but MARKET//LAB uses 1-hour candles. 48 of them cover 48 hours, which is two days."
  - `d` "One price change of 0.01 each, so 48 ticks in total" → "A tick is the smallest price step, 0.01. A candle summarises a period of time, one hour here, however many price changes it contains."
- **Explicație:** "The timeframe is the length of time each candle covers. MARKET//LAB charts use 1-hour candles, so 48 candles show 48 hours, which is two days."
- **Verificare:** L01: „each candle covers one hour, so a chart of 48 candles shows two days” ✓. Glosarul (`tick`) confirmă pasul de 0.01.

#### q-mf-11 · scenario · d2 · L05
- **Concepte:** timeframe, trend
- **Scenariu:** "Over the last 24 hourly candles, LABX has climbed from 95.00 to 103.00 with higher highs and higher lows. The last three candles slipped from 104.20 to 103.00."
- **Prompt:** "How are the last three candles best described?"
- **Variante:**
  - `a` "The start of a downtrend, because three candles in a row have fallen" → "Three candles are too few to define a trend on 1-hour charts. Across the 24-candle window, the structure is still higher highs and higher lows."
  - `b` "Proof that the uptrend has ended, because the high at 104.20 failed" → "Pullbacks from a high are normal in an uptrend. The structure breaks with a lower low, not after three falling candles."
  - `c` ✓ "A 1.20 pullback within an uptrend that has gained 8.00"
  - `d` "Nothing worth reading, because only the last candle matters" → "One candle hides the context. Judging structure needs enough candles for a pattern to mean something, which is why the 24-candle window matters."
- **Explicație:** "Seen alone, three falling candles look like a decline. In the 24-hour window they are a 1.20 pullback inside an uptrend that has gained 8.00. The structure only breaks if price makes a lower low."
- **Verificare:** 104.20 − 103.00 = 1.20; 103.00 − 95.00 = 8.00 ✓. Cifrele sunt cele din exemplul conceptului `timeframe`.

---

## Order Types

Lecții: L03 Market and limit orders, L04 Stop-loss and take-profit orders.

#### q-ot-1 · mcq · d1 · L03
- **Concepte:** market-order
- **Explicații per variantă:**
  - `a` ✓ (corectă)
  - `b` "A fill at exactly the price you last saw on the chart" → "The chart is drawn from the mid, which you cannot trade at. A market order fills now, at the ask for a buy or the bid for a sell."
  - `c` "A fill at the mid price, halfway between the bid and the ask" → "The mid is a reference, not a price you can trade at. A market order crosses the spread: buys fill at the ask, sells at the bid."
  - `d` "A fill only if price comes back to a level you choose" → "Waiting for a chosen price is what a limit order does. A market order gives up control of the price in exchange for an immediate fill."
- **Verificare:** `a` e singura corectă; motorul execută market-ul la ask sau la bid.

#### q-ot-2 · mcq · d1 · L03
- **Concepte:** limit-order
- **Explicații per variantă:**
  - `a` "A market buy now" → "A market buy fills immediately, near 100.05. The plan is to buy only after a drop, so the order has to wait at 98.50."
  - `b` "A sell limit at 98.50" → "A sell limit is an order to sell, and it sits above the price. To buy at a lower price, you need a buy limit."
  - `c` ✓ (corectă)
  - `d` "A buy limit at 101.50" → "A buy limit at 101.50 accepts any price at or below 101.50, so it would not wait for a drop. The limit belongs at 98.50."
- **Verificare:** `c` e singura care așteaptă 98.50. În motor, un buy limit peste ask e „marketable” și se execută imediat la ask, ca în explicația pentru `d`.

#### q-ot-3 · scenario · d2 · L03
- **Concepte:** limit-order, bid-ask-spread
- **Explicații per variantă:**
  - `a` "It should have filled, because price came within 0.10 of the limit price" → "A limit has no 'close enough' rule. It fills only when the ask trades at or through 99.00, and coming within 0.10 does not count."
  - `b` "It filled at 99.10, the lowest mid price reached during the dip" → "Orders never fill at the mid. At a mid of 99.10 the ask was 99.15, still above the 99.00 limit, so the order could not fill."
  - `c` "It filled at 99.00, because a limit fills once price gets close enough" → "The order is still open, so it did not fill. A buy limit at 99.00 needs the ask at or below 99.00, which means a mid of 98.95."
  - `d` ✓ (corectă)
- **Indicii** (opționale; capcana ask/mid e grea): 1. "A buy fills at the ask, not at the mid drawn on the chart." 2. "A buy limit fills only if the ask trades at or below the limit price." 3. "The lowest mid was 99.10, so the lowest ask was 99.15. Compare that with 99.00."
- **Verificare:** ask minim 99.10 + 0.05 = 99.15 > 99.00, deci nu s-a executat ✓. Motorul declanșează buy limit-ul la mid ≤ limit − 0.05 = 98.95.

#### q-ot-4 · mcq · d1 · L04
- **Concepte:** stop-loss-order, invalidation-level
- **Explicații per variantă:**
  - `a` "Above the entry, at the price you expect to reach" → "A price you expect to reach is a target, set with a take-profit. A long loses when price falls, so its stop sits below the entry."
  - `b` ✓ (corectă)
  - `c` "Exactly at the entry price, so the trade cannot lose" → "A stop at the entry sits inside ordinary noise and gets hit by normal swings. It cannot promise no loss either: commissions and gaps still apply."
  - `d` "At a fixed distance of 1.00 below the entry on every single trade" → "A fixed distance ignores the chart. The stop belongs where the idea is proven wrong, and that differs from trade to trade."
- **Verificare:** `b` e singura corectă (L04, L10).

#### q-ot-5 · numeric · d2 · L04
- **Concepte:** gap-risk, slippage
- **Indicii:** 1. "The loss is set by where the stop actually filled, not by where you placed it." 2. "Loss = units × (entry price − fill price)." 3. "The stop filled at 94.00, so each unit lost 100.00 − 94.00 = 6.00."
- **Variații (vary):**
  - Câmpuri: `entry` 50.00–100.00, pas 1.00; `dist` ∈ {1.00, 1.25, 2.00, 2.50, 4.00, 5.00}; `units = 100.00 ÷ dist` (100, 80, 50, 40, 25, 20); `gap` 0.50–3.00, pas 0.10. Stop = entry − dist, fill = stop − gap.
  - Formula: `answer = units × (entry − fill)`.
  - Toleranța: 0.01, unitate vUSD.
  - Constrângeri: `units × entry ≤ 9,900.00` (fără levier, cu loc pentru comision). Pierderea planificată rămâne 100.00, ca fraza „The planned loss of 100.00…” din explicație să rămână adevărată.
  - Exemplu: entry 80.00, stop 77.50, 40 units, fill 76.20 → 40 × 3.80 = **152.00** (planificat 100.00).
- **Verificare:** 25 × (100.00 − 94.00) = 150.00 ✓. Planificat: 25 × 4.00 = 100.00 ✓.

#### q-ot-6 · scenario · d2 · L04
- **Concepte:** stop-loss-order, invalidation-level
- **Explicații per variantă:**
  - `a` ✓ (corectă)
  - `b` "Move it: giving the trade more room always improves the chance of a profit" → "Nothing about the idea has changed. A wider stop on the same units raises the loss you agreed to, and the size was set for 97.70."
  - `c` "Remove the stop for now and decide when the current candle closes" → "Without a stop the possible loss has no limit, and the decision moves to the moment of most pressure. The stop exists to decide that in advance."
  - `d` "Buy more units to lower the average entry price, keeping the same stop" → "Adding units to a trade that is going against you raises the loss at the same stop. The position was sized for one budget; this breaks it."
- **Verificare:** prețul (98.10) e încă deasupra suportului de la 98.00, deci ideea nu e invalidată. `a` e singura conformă cu planul (L04, L10).

#### q-ot-7 · mcq · d2 · L04
- **Concepte:** stop-loss-order, slippage
- **Explicații per variantă:**
  - `a` "The platform adds a penalty to any trade closed by a stop" → "There is no stop penalty. The costs are the usual spread and commission; a worse fill comes from how a triggered stop executes."
  - `b` "Stops always fill at the low of the candle in which they trigger" → "A stop fills at the first available price after it is touched, usually at or near the stop. The candle's low is just its lowest trade."
  - `c` ✓ (corectă)
  - `d` "Stops fill at the mid price of the candle rather than at the bid" → "No order fills at the mid. A long position's stop sells at the bid, and a gap past it fills at the opening bid."
- **Verificare:** `c` corespunde motorului: stop-ul se declanșează la bid ≤ stop, iar la gap se execută la deschidere ✓.

#### q-ot-8 · mcq · d3 · L03
- **Concepte:** limit-order, bid-ask-spread
- **Explicații per variantă:**
  - `a` "When the mid, the price drawn on the chart, reaches 102.00" → "At a mid of 102.00 the bid is only 101.95. A sell fills at the bid, so the bid itself must reach 102.00."
  - `b` "Immediately, because a sell limit fills at its price or better" → "'Or better' means 102.00 or higher for a sell. The bid is 99.95 now, so the order waits above the market."
  - `c` "When the ask reaches 102.00, since the ask is the higher price" → "The ask is what buyers pay. Your sell fills at the bid, 0.10 below the ask, so an ask of 102.00 means a bid of only 101.90."
  - `d` ✓ (corectă)
- **Indicii:** 1. "First decide which side of the quote a sell order fills at." 2. "A sell limit fills only when the bid trades at or above the limit. Bid = mid − 0.05." 3. "You need a bid of at least 102.00, so mid − 0.05 ≥ 102.00. Solve for the mid."
- **Verificare:** bid ≥ 102.00 ⇔ mid ≥ 102.05 ✓. Motorul declanșează sell limit-ul la mid ≥ limit + 0.05 ✓.

#### q-ot-9 · mcq · d1 · L04
- **Concepte:** bracket-order
- **Explicații per variantă:**
  - `a` "A stop-loss that moves up automatically as the price rises" → "That describes a trailing stop, which follows price to protect a gain. A take-profit is a fixed exit at a target, set before entry."
  - `b` ✓ (corectă)
  - `c` "A guarantee that the trade makes at least a minimum profit" → "A take-profit fills only if the bid reaches the target. If price never gets there, it never fills and guarantees nothing."
  - `d` "An order to add more units while the trade is winning" → "Adding units is a new entry, not an exit. A take-profit closes the position when the bid reaches your planned target."
- **Verificare:** `b` e singura corectă (L04, glosarul `take-profit`).

## Întrebări noi propuse · Order Types

Motiv: `bracket-order` are o singură întrebare (q-ot-9). A doua întrebare nouă e numerică, iar topicul avea una singură.

#### q-ot-10 · mcq · d1 · L04
- **Concepte:** bracket-order
- **Prompt:** "You buy LABX with a bracket: a stop-loss at 98.00 and a take-profit at 104.00. Price rises and the take-profit fills. What happens to the stop-loss?"
- **Variante:**
  - `a` ✓ "It is cancelled, because one exit has already closed the position"
  - `b` "It stays open, ready to sell again if price falls to 98.00" → "There is nothing left to sell once the take-profit has closed the position. A bracket cancels the other exit when one of them fills."
  - `c` "It moves up to 104.00 automatically to protect the profit" → "Moving a stop to follow price is trailing, a separate rule. In a bracket, the stop simply goes away once the target closes the trade."
  - `d` "It turns into a buy order at 98.00" → "Exits do not turn into new entries. When the take-profit fills, the bracket's stop is cancelled and you have no position."
- **Explicație:** "A bracket attaches both exits to the entry. When one of them fills, the position is closed and the other exit is cancelled, so nothing is left working."
- **Verificare:** conceptul `bracket-order` și glosarul: „When one exit fills, the other is cancelled” ✓. În motor, stop-ul și target-ul există doar cât e deschisă poziția.

#### q-ot-11 · numeric · d2 · L04
- **Concepte:** bracket-order, bid-ask-spread
- **Prompt:** "The LABX mid is 100.00. You buy 40 units at market with a bracket: stop-loss at 99.00, take-profit at 102.00. The take-profit fills at 102.00. Ignoring commission, what is your profit in vUSD?"
- **Răspuns:** 78 (toleranță 0.01, unitate vUSD)
- **Explicație:** "A market buy fills at the ask, 100.05, so each unit gains 102.00 − 100.05 = 1.95 when the take-profit fills: 40 × 1.95 = 78.00. Measuring from the mid gives 80.00, which ignores the half-spread you paid on entry."
- **Indicii:** 1. "A market buy does not fill at the mid. Find your real entry price first." 2. "Profit at the target = units × (take-profit − entry). The entry is the ask: mid + 0.05." 3. "Entry: 100.00 + 0.05 = 100.05. Each unit gains 102.00 − 100.05 = 1.95."
- **Variații (vary):**
  - Câmpuri: `mid` 50.00–120.00, pas 1.00; `units` 10–60, pas 5; `tpDist` 1.00–5.00, pas 0.50 (take-profit = mid + tpDist); `slDist` 0.50–3.00, pas 0.50 (stop = mid − slDist, doar pentru realism).
  - Formula: `answer = units × (takeProfit − (mid + 0.05))`.
  - Toleranța: 0.01.
  - Constrângeri: `units × (mid + 0.05) ≤ 9,900.00`; `units × (slDist + 0.05) ≤ 100.00`, ca riscul să încapă în bugetul de misiune.
  - Exemplu: mid 60.00, 30 units, stop 59.00, take-profit 62.50 → entry 60.05; 30 × 2.45 = **73.50** (risc 30 × 1.05 = 31.50).
- **Verificare:** 40 × (102.00 − 100.05) = 78.00 ✓. Motorul execută take-profit-ul unui long când bid-ul atinge 102.00, la 102.00 ✓. Stop-ul 99.00 e sub 99.95 (bid-ul la intrare), deci ordinul e valid.

---

## Technical Analysis

Lecții: L05 Trends, ranges and noise, L06 Support, resistance and breakouts, L07 Moving averages without the magic.

#### q-ta-1 · mcq · d1 · L05
- **Concepte:** trend
- **Explicații per variantă:**
  - `a` "Three bullish candles in a row" → "On 1-hour charts, a few candles in the same direction are often just noise. A trend is defined by the sequence of swing highs and swing lows."
  - `b` ✓ (corectă)
  - `c` "Higher swing highs and lower swing lows" → "Lower lows break the uptrend pattern. Highs rising while lows fall describes a widening, unclear market, not an uptrend."
  - `d` "Price above a round number such as 100.00" → "A price level says where price is, not where it has been heading. Trend comes from structure: higher highs and higher lows."
- **Verificare:** `b` e definiția din L05 și din conceptul `trend` ✓.

#### q-ta-2 · scenario · d2 · L05
- **Concepte:** range, support-and-resistance
- **Explicații per variantă:**
  - `a` "An uptrend that is pausing below 104.00" → "An uptrend needs higher highs and higher lows. Here the highs keep stalling near 104.00 and the lows near 100.00, so neither is rising."
  - `b` "A downtrend that started from 104.00" → "A downtrend needs lower highs and lower lows. Price keeps returning to the same floor and ceiling, which is a range, not a decline."
  - `c` ✓ (corectă)
  - `d` "Noise, with no levels worth marking" → "Noise has no clear boundaries. Two days of repeated turns at the same prices give you exactly the levels that define a range."
- **Verificare:** `c` e singura compatibilă cu întoarcerile repetate la aceleași niveluri ✓.

#### q-ta-3 · mcq · d2 · L05
- **Concepte:** trend
- **Explicații per variantă:**
  - `a` ✓ (corectă)
  - `b` "The uptrend is confirmed, because 101.00 is above the first low" → "Each low is compared with the one before it, not with the first. 101.00 is below 102.40, so the pattern of higher lows is broken."
  - `c` "A downtrend has definitely started and will now continue lower" → "One lower low puts the uptrend in question but does not make a downtrend, which also needs lower highs. Nothing about the next move is definite."
  - `d` "Nothing, because only the swing highs define a trend" → "A trend is defined by both swing highs and swing lows. A lower low matters as much as a lower high."
- **Verificare:** 101.00 < 102.40, deci șirul minimelor crescătoare s-a rupt. Exemplul din L05 are exact aceste cifre ✓.

#### q-ta-4 · mcq · d1 · L06
- **Concepte:** support-and-resistance
- **Explicații per variantă:**
  - `a` "A floor that price cannot fall below once it has been tested" → "Support is an area that has held before, not a barrier. Levels break regularly, and nothing guarantees this one holds next time."
  - `b` "The lowest price reached so far during the current day" → "A single day's low is just one price. Support is an area where falls have stopped and turned up several times."
  - `c` "The price at which your own stop-loss order is placed" → "Your stop is a decision you make, often just beyond support. Support itself comes from repeated turns in price on the chart."
  - `d` ✓ (corectă)
- **Verificare:** `d` e definiția din L06 ✓.

#### q-ta-5 · scenario · d2 · L06
- **Concepte:** false-breakout, breakout
- **Explicații per variantă:**
  - `a` "A confirmed breakout, because a candle closed above resistance" → "At the first close above the level, a breakout and a false breakout look identical. The next close, back inside at 101.40, decides it."
  - `b` ✓ (corectă)
  - `c` "The start of a downtrend, because the last candle was bearish" → "One bearish candle is not a trend. A downtrend needs lower highs and lower lows; price is simply back inside the range."
  - `d` "A break of support, because price closed lower than it opened" → "Support is at 98.00 and has not been touched. A bearish candle near the top of the range says nothing about the floor."
- **Verificare:** 102.60 > 102.00, apoi 101.40 < 102.00: închidere înapoi în range, adică false breakout (L06) ✓.

#### q-ta-6 · mcq · d2 · L06
- **Concepte:** support-and-resistance, breakout
- **Explicații per variantă:**
  - `a` "A breakout, because price traded above resistance during the hour" → "That reacts to the wick. A breakout needs a close beyond the level, and this candle closed back below 102.00, at 101.70."
  - `b` "Resistance is no longer valid now that price has crossed it" → "Levels are zones, and a wick that pokes through and closes back inside is a test. The level just held again."
  - `c` ✓ (corectă)
  - `d` "Price must now fall back to support at the bottom of the range" → "That turns a description into a prediction. The candle shows a test of resistance; it does not decide where price goes next."
- **Verificare:** L06: „a wick that pokes through and closes back inside is a test, not a break” ✓.

#### q-ta-7 · numeric · d2 · L07
- **Concepte:** moving-average
- **Indicii:** 1. "A simple moving average weights every close equally, so their order does not matter." 2. "SMA = sum of the last N closes ÷ N. Here N = 5." 3. "Sum: 100.00 + 102.00 + 101.00 + 103.00 + 104.00 = 510.00. Now divide by 5."
- **Variații (vary):**
  - Câmpuri: `c1` 95.00–105.00, pas 0.10; `c2`…`c5` = închiderea anterioară ± 0.10–1.50, pas 0.10.
  - Formula: `answer = (c1 + c2 + c3 + c4 + c5) ÷ 5`.
  - Toleranța: 0.001, unitate vUSD.
  - Constrângeri: pe grila de 0.10, suma ÷ 5 e mereu multiplu de 0.02, deci iese exact la cent. Media trebuie să difere de `c5` și de `c3`, ca „ultima închidere” sau „cea din mijloc” să nu dea răspunsul. Șirul nu e monoton, pentru că explicația spune că ordinea nu contează.
  - Exemplu: 99.40, 100.20, 99.80, 100.60, 101.50 → 501.50 ÷ 5 = **100.30**.
- **Verificare:** 510.00 ÷ 5 = 102.00 ✓.

#### q-ta-8 · mcq · d2 · L07
- **Concepte:** moving-average
- **Explicații per variantă:**
  - `a` ✓ (corectă)
  - `b` "The chart software deliberately draws it a few candles late" → "Nothing is shifted on purpose. The lag comes from the calculation itself: every value still contains closes from before the turn."
  - `c` "It only updates once a day, not on every candle" → "A moving average is recalculated at every new close. It still lags, because each value also averages older closes."
  - `d` "It doesn't: it usually turns before price does, as a warning" → "An average built from past closes cannot turn before those closes do. It turns after price, at tops and bottoms alike."
- **Verificare:** `a` e singura corectă (L07) ✓.

#### q-ta-9 · scenario · d3 · L07
- **Concepte:** moving-average, range
- **Explicații per variantă:**
  - `a` "Six reliable signals, because every crossover marks a change in trend" → "In a range there is no trend to change. Price crosses its average again and again, so each crossing carries little information."
  - `b` "No trades, because price cannot cross its average while it is ranging" → "The scenario says it crossed six times. In a range, price crossing back and forth over its average is exactly what happens."
  - `c` "One long trade that captures the full move from support to resistance" → "A crossover rule enters and exits at every crossing, not once. In a range it flips repeatedly instead of riding one clean move."
  - `d` ✓ (corectă)
- **Indicii:** 1. "Think about where price sits relative to its moving average when the market goes sideways." 2. "In a range, price keeps crossing its average, and every trade from a crossover rule pays spread and commission." 3. "Six crossings in one day mean about six entries and exits. Which option describes that?"
- **Verificare:** L07: „In a range they arrive often and reverse quickly, and every one of those trades pays the spread and commission” ✓.

#### q-ta-10 · mcq · d3 · L07
- **Concepte:** moving-average
- **Explicații per variantă:**
  - `a` "The line becomes smoother and lags more" → "That describes moving to a longer period. A 10-period average uses fewer closes, so it reacts sooner and is less smooth."
  - `b` ✓ (corectă)
  - `c` "Nothing changes except the label" → "The period sets how many closes are averaged. With fewer closes, each new price carries more weight, so the line changes shape."
  - `d` "The average becomes a forecast rather than a summary" → "No period turns past closes into a forecast. A shorter average still summarises the past, just a shorter stretch of it."
- **Indicii:** 1. "Ask how many closes each version averages, and how much weight one new close gets." 2. "Longer period: smoother, more lag. Shorter period: faster, but follows more noise. No setting removes the trade-off." 3. "In a 10-period SMA each new close is a tenth of the average; in a 50-period SMA, a fiftieth."
- **Verificare:** L07: „A shorter period reacts faster but follows more of the noise” ✓.

## Întrebări noi propuse · Technical Analysis

Motiv: `false-breakout` are o singură întrebare (q-ta-5), iar `volatility` niciuna. Topicul avea o singură întrebare numerică.

#### q-ta-11 · mcq · d2 · L06
- **Concepte:** false-breakout, breakout
- **Prompt:** "You decide to buy breakouts only after a 1-hour candle closes above resistance, not when a wick pokes through. What does that rule do?"
- **Variante:**
  - `a` "It removes false breakouts, because a close above the level confirms the move" → "At the first close beyond a level, a breakout and a false breakout still look the same. Only the candles that follow show which one it was."
  - `b` "It gives an earlier entry than buying the first poke above the level" → "Waiting for the close means entering later. The poke above the level comes first; the close comes at the end of the hour."
  - `c` "It makes a stop unnecessary, because confirmed breakouts do not fail" → "No rule filters out every false breakout. Decide before entry where price would be if the breakout failed, and put the stop there."
  - `d` ✓ "It filters out some false moves, at the cost of a later entry"
- **Explicație:** "Waiting for a close filters out wicks that poke through and fall back, but a breakout that closes above the level can still fail on the next candle. Nothing filters out all of them, so the stop still goes where a failed breakout would be."
- **Verificare:** L06: „Waiting for a candle to close beyond the level … filters out some false moves at the cost of a later entry. Nothing filters out all of them.” ✓

#### q-ta-12 · mcq · d1 · L16
- **Concepte:** volatility
- **Prompt:** "LABX's 14-candle average true range (ATR) is 0.40. What does that tell you?"
- **Variante:**
  - `a` "Price is likely to rise by about 0.40 over the next candle" → "ATR has no direction. It measures how much price has typically moved per candle, up or down, not where it goes next."
  - `b` "The trend has gained 0.40 over the last 14 candles" → "ATR averages the size of each candle, not the net change over 14 candles. A flat range can still have a large ATR."
  - `c` ✓ "A typical recent candle has covered about 0.40 vUSD"
  - `d` "Your stop must be exactly 0.40 below the entry" → "ATR is a yardstick for noise, not a stop rule. The stop goes beyond the invalidation level, with a buffer that ATR can help size."
- **Explicație:** "ATR measures volatility: the average size of recent candles, counting any gap from the previous close. An ATR of 0.40 says a typical candle covers about 0.40 vUSD; it says nothing about direction."
- **Verificare:** L16: „If LABX's 14-candle ATR is 0.40, a typical candle covers about 0.40 vUSD” și „A stop beyond the invalidation level plus a fraction of the ATR…” ✓. Lecția e pro: vezi notele de implementare.

#### q-ta-13 · numeric · d3 · L16
- **Concepte:** volatility
- **Prompt:** "The previous candle closed at 99.60. The next candle opens higher and trades between a low of 100.10 and a high of 100.90. What is its true range, in vUSD?"
- **Răspuns:** 1.3 (toleranță 0.001, unitate vUSD)
- **Explicație:** "True range is the largest of three distances: high − low (0.80), high − previous close (1.30) and low − previous close (0.50). The gap up from 99.60 makes it 1.30; high − low alone misses the gap."
- **Indicii:** 1. "True range counts any gap from the previous close, not just this candle's high and low." 2. "True range is the largest of three distances: high − low, high − previous close, and low − previous close." 3. "High − low = 0.80. High − previous close = 100.90 − 99.60 = 1.30. Compare all three."
- **Variații (vary):**
  - Câmpuri: `prevClose` 95.00–105.00, pas 0.10; `dir` ∈ {up, down}; `gap` 0.30–1.20, pas 0.10; `range` 0.40–1.20, pas 0.10. Pentru up: low = prevClose + gap, high = low + range. Pentru down: high = prevClose − gap, low = high − range.
  - Formula: `answer = max(high − low, |high − prevClose|, |low − prevClose|)`, adică `gap + range`.
  - Toleranța: 0.001.
  - Constrângeri: `gap ≥ 0.30`, ca capcana high − low să difere clar de răspuns. Promptul folosește „opens higher” sau „opens lower” după `dir`.
  - Exemplu: prevClose 101.40, down, high 100.90, low 100.20 → max(0.70, 0.50, 1.20) = **1.20**.
- **Verificare:** max(0.80, 1.30, 0.50) = 1.30 ✓. Definiția e cea din conceptul `volatility` și din glosarul `atr`.

---

## Position Sizing

Lecție: L09 Sizing a position from the stop. Întrebările noi trimit la L08 Risk per trade, unde bugetul se recalculează pe equity-ul curent.

#### q-ps-1 · numeric · d1 · L09
- **Concepte:** position-sizing, fixed-fractional-sizing
- **Indicii:** 1. "Start from the risk budget, not the account size." 2. "Units = risk budget ÷ distance to the stop, rounded down." 3. "Budget: 1% of 10,000.00 = 100.00. Distance: 100.00 − 98.00 = 2.00."
- **Variații (vary):**
  - Câmpuri: `entry` 40.00–120.00, pas 1.00; `dist` ∈ {1.00, 1.25, 2.00, 2.50, 4.00, 5.00}. Contul (10,000.00) și riscul (1%) rămân fixe, fiind o întrebare d1.
  - Formula: `answer = floor(100.00 ÷ dist)`. Împărțirea iese exactă pentru setul ales.
  - Toleranța: 0, unitate units.
  - Constrângeri: `answer × entry ≤ 9,900.00` (fără levier, cu loc pentru comision); `dist ≤ 5% × entry`.
  - Exemplu: entry 60.00, stop 58.75 → 100.00 ÷ 1.25 = **80** units (valoare 4,800.00). Capcana din explicație devine 10,000.00 ÷ 60.00 ≈ 166.
- **Verificare:** 100.00 ÷ 2.00 = 50 ✓. Cu `commissionBps: 0`, motorul dă tot 50 (testul din `engine.test.ts`).

#### q-ps-2 · mcq · d1 · L09
- **Concepte:** position-sizing, invalidation-level
- **Explicații per variantă:**
  - `a` "The number of units you would like to hold" → "Picking the units first puts the order backwards. The stop then lands where the loss feels bearable, not where the idea fails."
  - `b` "The take-profit, at the next resistance level" → "The target belongs in the plan, but it does not set the size. The size follows from the budget and the distance to the stop."
  - `c` ✓ (corectă)
  - `d` "How much profit you want the trade to make" → "A profit wish says nothing about where you are wrong. The size comes from the risk budget and the stop, not from the hoped-for gain."
- **Verificare:** L09: „Stop first, size second” ✓.

#### q-ps-3 · numeric · d3 · L09
- **Concepte:** cost-adjusted-sizing, trading-costs
- **Indicii:** 1. "At the stop, each unit loses more than the stop distance: it also pays commission twice." 2. "Commission per unit = 0.05% × entry + 0.05% × stop. Units = 100.00 ÷ (distance + commission per unit), rounded down." 3. "Commissions: 0.05 + 0.049 = 0.099 per unit. Loss per unit: 2.00 + 0.099 = 2.099."
- **Variații (vary):**
  - Câmpuri: `entry` (ask) 40.00–100.00, pas 1.00; `dist` ∈ {1.00, 1.50, 2.00, 2.50, 4.00}; stop = entry − dist; buget 100.00.
  - Formula: `answer = floor(100.00 ÷ (dist + 0.0005 × (entry + stop)))`.
  - Toleranța: 0, unitate units.
  - Constrângeri:
    - partea fracționară a câtului e între 0.05 și 0.95. Asta exclude 28 din cele 305 combinații, printre ele singura în care formula exactă și motorul (comision rotunjit în sus) dau rezultate diferite: entry 88.00, dist 1.50 → 63 față de 62;
    - `answer < floor(100.00 ÷ dist)`, ca diferența față de textbook să existe;
    - în test, răspunsul se compară cu `maxQtyForRisk` (bps 5).
  - Exemplu: entry 80.00, stop 78.50 → comision pe unitate 0.0005 × 158.50 = 0.07925; pierdere pe unitate 1.57925; 100.00 ÷ 1.57925 ≈ 63.32 → **63** (textbook 66). În motor, 63 de unități riscă 99.50, iar 64 ar risca 101.08.
- **Verificare:** 100.00 ÷ 2.099 ≈ 47.64 → 47 ✓. Motorul: `maxQtyForRisk` dă 47 (risc 98.66 cu comisioanele rotunjite în sus); 48 ar risca 100.76 ✓.

#### q-ps-4 · mcq · d2 · L09
- **Concepte:** position-sizing
- **Explicații per variantă:**
  - `a` ✓ (corectă)
  - `b` "The risk doubles to 200.00, because the stop is twice as far away" → "That would be true only if you kept 50 units. Sizing from the stop cuts the units to 25, so the risk stays at 100.00."
  - `c` "The number of units doubles to make up for the wider stop" → "Twice the units with twice the distance would quadruple the risk: 100 × 4.00 = 400.00. Units = budget ÷ distance, so they halve."
  - `d` "Nothing changes, because the budget is the same" → "The budget stays the same, but the distance doubled. Units = 100.00 ÷ 4.00 = 25, half of the 50 you had with a 2.00 stop."
- **Verificare:** 100.00 ÷ 2.00 = 50; 100.00 ÷ 4.00 = 25 ✓.

#### q-ps-5 · scenario · d2 · L09
- **Concepte:** position-sizing, risk-per-trade
- **Explicații per variantă:**
  - `a` "Move the stop to 2.00 below the entry so that 50 units fit the budget" → "That moves the stop to fit the size, not the idea. The idea fails 5.00 below entry; a closer stop can be hit while the idea still holds."
  - `b` ✓ (corectă)
  - `c` "Buy 50 units with the 5.00 stop and accept 250.00 of risk this once" → "50 × 5.00 = 250.00, two and a half times the budget. A limit that bends 'this once' is not a limit."
  - `d` "Buy 50 units without a stop" → "Without a stop the loss has no limit at all. The budget only means something when a stop sits where the idea fails."
- **Verificare:** 100.00 ÷ 5.00 = 20; 50 × 5.00 = 250.00 ✓.

#### q-ps-6 · numeric · d2 · L09
- **Concepte:** position-sizing, risk-per-trade
- **Indicii:** 1. "This is the Arena, so use the Arena's risk limit, not the mission one." 2. "Budget = 2% × account. Units = budget ÷ (entry − stop), rounded down." 3. "Budget: 2% of 10,000.00 = 200.00. Distance: 100.00 − 95.00 = 5.00."
- **Variații (vary):**
  - Câmpuri: `entry` 50.00–120.00, pas 1.00; `dist` ∈ {2.00, 2.50, 4.00, 5.00, 8.00}. Contul e 10,000.00, riscul 2%.
  - Formula: `answer = 200.00 ÷ dist` (100, 80, 50, 40, 25).
  - Toleranța: 0, unitate units.
  - Constrângeri: `answer × entry ≤ 9,900.00`; `dist ≤ 10% × entry`.
  - Exemplu: entry 80.00, stop 77.50 → 200.00 ÷ 2.50 = **80** units (valoare 6,400.00). Cu bugetul de misiune ar fi 40.
- **Verificare:** 200.00 ÷ 5.00 = 40 ✓; valoarea poziției, 4,000.00, e sub equity ✓.

#### q-ps-7 · mcq · d2 · L09
- **Concepte:** position-sizing, cost-adjusted-sizing
- **Explicații per variantă:**
  - `a` "Orders have to be placed in multiples of ten units" → "Any whole number of units is allowed. Rounding down is about the budget: every extra unit adds a full stop distance to the loss."
  - `b` "Rounding down raises the expected profit of the trade" → "Fewer units means a smaller profit if the trade works, not a larger one. Rounding down protects the loss limit, not the gain."
  - `c` "It makes no difference to the loss at the stop" → "Each unit loses the full distance to the stop, so one extra unit adds a whole unit's loss. That is enough to cross the budget."
  - `d` ✓ (corectă)
- **Verificare:** 48 × 2.099 = 100.752 > 100.00 ✓ (exemplul din L09).

#### q-ps-8 · scenario · d3 · L09
- **Concepte:** position-sizing, leverage
- **Explicații per variantă:**
  - `a` "You buy 200 units, because the formula already accounts for the account size" → "The formula uses the account only through the 1% budget. It never checks whether 200 × 100.00 = 20,000.00 is more than you can pay for."
  - `b` "You borrow the extra 10,000.00, because the platform lends the difference" → "Missions use no leverage, so nothing is lent. Position value cannot exceed equity, whatever the formula says."
  - `c` ✓ (corectă)
  - `d` "The stop is widened automatically until the size fits the account" → "The platform never moves your stop; that decision is yours. Only the number of units is limited by what the account can pay for."
- **Indicii:** 1. "The formula only checks risk. Check the second limit: what the account can pay for without leverage." 2. "Without leverage, units × price must not exceed equity. Here equity is 10,000.00 and the price is 100.00." 3. "200 units × 100.00 = 20,000.00, twice the account. Now find how many units 10,000.00 can pay for."
- **Verificare:** 100.00 ÷ 0.50 = 200; 200 × 100.00 = 20,000.00 > 10,000.00 ✓. Și cu costuri, formula dă 166, tot peste plafon.
- **Probleme găsite:** plafonul real din simulator e **99 de unități**, nu 100. `previewOrder` cere `notional + entryFee ≤ buyingPower`, iar 100 × 100.00 + 5.00 = 10,005.00 > 10,000.00. 99 de unități cer 9,904.95. Corecturi propuse:
  - eticheta `c` devine "The account limits the size: 200 units would be worth 20,000.00, twice the equity" (fără cifra 100);
  - explicația devine "Without leverage, position value cannot exceed equity, so at 100.00 the ceiling is about 10,000.00 ÷ 100.00 = 100 units; the simulator allows 99, because the 5.00 entry commission also needs buying power. A 0.50 stop on 1-hour candles may also sit inside ordinary noise.";
  - aceeași precizare se face în L09 („at most 100 units”), în fișierul U3;
  - în cod, plafonul din `maxQtyForRisk` trebuie să includă comisionul de intrare (vezi notele de implementare).

#### q-ps-9 · mcq · d3 · L09
- **Concepte:** cost-adjusted-sizing, trading-costs
- **Explicații per variantă:**
  - `a` "The spread widens when the stop is hit, adding to the loss per unit" → "The LABX spread stays at 0.10. It is already inside the distance, because you buy at the ask; the extra loss per unit is commission."
  - `b` ✓ (corectă)
  - `c` "The simulator charges a fixed holding fee for every unit in the position" → "There is no holding fee in MARKET//LAB. The only extra cost per unit at the stop is commission, paid on entry and on exit."
  - `d` "It isn't: including costs makes the size larger" → "Costs add to what each unit loses at the stop. A larger loss per unit means the same budget covers fewer units: 47 instead of 50."
- **Indicii:** 1. "Compare what one unit loses at the stop with and without costs." 2. "Cost-adjusted units = budget ÷ (distance + costs per unit). The spread is already inside the distance." 3. "With entry 100.00 and stop 98.00, each unit also pays 0.05 + 0.049 in commission. Which option explains that?"
- **Verificare:** conceptul `cost-adjusted-sizing`: costurile pe unitate sunt cele două comisioane, iar spread-ul e deja în distanță ✓. `b` e singura corectă.

## Întrebări noi propuse · Position Sizing

Motiv: `fixed-fractional-sizing` are o singură întrebare (q-ps-1), care doar transformă 1% în vUSD. Ideea conceptului, bugetul care urmează equity-ul curent, nu era testată nicăieri.

#### q-ps-10 · numeric · d2 · L08
- **Concepte:** fixed-fractional-sizing, position-sizing
- **Prompt:** "After a run of losses your account is 9,500.00. You still risk 1% of current equity per trade. You buy at 100.00 with a stop at 98.00. Ignoring costs, how many units can you buy? Round down to a whole number."
- **Răspuns:** 47 (toleranță 0, unitate units)
- **Explicație:** "Fixed-fractional sizing uses the account as it is now: 1% of 9,500.00 = 95.00. The distance is 2.00, so 95.00 ÷ 2.00 = 47.5, rounded down to 47. Using the starting 10,000.00 would give 50."
- **Indicii:** 1. "Use the account as it is now, not as it was at the start." 2. "Budget = 1% × current equity. Units = budget ÷ (entry − stop), rounded down." 3. "Budget: 1% of 9,500.00 = 95.00. Distance: 100.00 − 98.00 = 2.00."
- **Variații (vary):**
  - Câmpuri: `equity` 8,000.00–12,000.00, pas 100.00, fără 10,000.00; `entry` 50.00–120.00, pas 1.00; `dist` ∈ {1.00, 2.00, 2.50, 4.00, 5.00}; riscul e 1%.
  - Formula: `answer = floor(equity × 0.01 ÷ dist)`.
  - Toleranța: 0, unitate units.
  - Constrângeri: `answer ≠ floor(100.00 ÷ dist)`, ca folosirea contului de start să dea alt răspuns; `answer × entry ≤ equity − 100.00`. Promptul spune „a run of losses” dacă equity < 10,000.00 și „a run of gains” dacă e peste.
  - Exemplu: equity 10,800.00 („after a run of gains”), entry 80.00, stop 77.50 → 108.00 ÷ 2.50 = 43.2 → **43** (contul de start ar da 40).
- **Verificare:** 95.00 ÷ 2.00 = 47.5 → 47 ✓. Cu `commissionBps: 0`, motorul dă 47. Cu comision ar da 45, dar promptul cere explicit fără costuri.

#### q-ps-11 · mcq · d1 · L08
- **Concepte:** fixed-fractional-sizing, risk-per-trade
- **Prompt:** "You risk 1% of current equity on every trade. After a losing run, equity falls from 10,000.00 to 9,000.00. What happens to the amount you risk on the next trade?"
- **Variante:**
  - `a` "It stays at 100.00, the 1% of the starting account" → "That fixes the vUSD amount, not the percentage. 100.00 on a 9,000.00 account is about 1.1%, so each loss would cut deeper than planned."
  - `b` ✓ "It falls to 90.00, because 1% is now taken from 9,000.00"
  - `c` "It rises to 110.00, to win back the losses faster" → "Raising risk after a loss to win it back is what revenge trading looks like. A fixed fraction does the opposite: risk shrinks with the account."
  - `d` "It falls to 0.00 until the account is back at 10,000.00" → "The rule does not stop trading after losses. It keeps risking 1% of whatever the account is now, which is 90.00 at 9,000.00."
- **Explicație:** "Fixed-fractional sizing applies the same percentage to the account as it is now: 1% of 9,000.00 = 90.00. The amount at risk shrinks after losses, which slows a drawdown, and grows again after gains."
- **Verificare:** 9,000.00 × 1% = 90.00; 100.00 ÷ 9,000.00 ≈ 1.11% ✓. Faptele vin din L08 („the budget shrinks after losses and grows after gains”) și din conceptul `fixed-fractional-sizing`.

---

## Portfolio Exposure

Lecție: L12 Exposure and leverage.

#### q-pe-1 · numeric · d1 · L12
- **Concepte:** exposure
- **Indicii:** 1. "Exposure compares what you hold with the whole account, not with the loss at the stop." 2. "Exposure % = position value ÷ equity × 100." 3. "4,000.00 ÷ 10,000.00 = 0.40. Now turn that into a percentage."
- **Variații (vary):**
  - Câmpuri: `equity` 8,000.00–12,000.00, pas 500.00; `pct` 10–95, pas 5; `value = equity × pct ÷ 100`.
  - Formula: `answer = value ÷ equity × 100`.
  - Toleranța: 0.01, unitate %.
  - Constrângeri: `pct ≤ 95` (fără levier). `value` iese mereu exact la cent.
  - Exemplu: equity 12,000.00, poziție 4,200.00 → **35**%.
- **Verificare:** 4,000.00 ÷ 10,000.00 × 100 = 40 ✓.

#### q-pe-2 · mcq · d2 · L12
- **Concepte:** leverage, exposure
- **Explicații per variantă:**
  - `a` "5%" → "That applies the move to the account instead of the position. The 5% fall acts on all 50,000.00, which is five times the account."
  - `b` "10%" → "10% would be the effect at 2× leverage. Here the position is 5× the account: 5% × 50,000.00 = 2,500.00."
  - `c` ✓ (corectă)
  - `d` "50%" → "50% would take a 10% fall at 5×. A 5% fall on 50,000.00 costs 2,500.00, a quarter of the account."
- **Indicii** (opționale; e un calcul în doi pași): 1. "Apply the price move to the position, not to the account." 2. "Loss = position value × move. Effect on the account = loss ÷ equity." 3. "Loss: 5% × 50,000.00 = 2,500.00. Now divide by 10,000.00."
- **Verificare:** 2,500.00 ÷ 10,000.00 = 25% ✓ (exemplul din L12).

#### q-pe-3 · scenario · d2 · L12
- **Concepte:** leverage, exposure
- **Explicații per variantă:**
  - `a` ✓ (corectă)
  - `b` "Both lose 4% of their accounts, because the price move is the same" → "The move is the same, but it acts on different positions. B holds 30,000.00, so 4% costs 1,200.00, which is 12% of the account."
  - `c` "B loses less, because leverage spreads the risk over a larger position" → "Leverage does not spread risk; it scales it. A larger position loses more on the same move: 1,200.00 for B against 400.00 for A."
  - `d` "A loses 1,200.00 (12%); B loses 400.00 (4%)" → "The numbers are swapped. The 3× position belongs to B, so B takes the larger loss: 4% × 30,000.00 = 1,200.00."
- **Verificare:** A: 4% × 10,000.00 = 400.00 (4%); B: 4% × 30,000.00 = 1,200.00 (12%) ✓.

#### q-pe-4 · mcq · d1 · L12
- **Concepte:** leverage
- **Explicații per variantă:**
  - `a` "How far the price of the instrument moves after news" → "Leverage changes nothing about the market. Price moves the same amount either way; what changes is how big that move is for your account."
  - `b` "The chance that any single trade ends in a profit" → "Leverage does not change the odds of a trade. It makes the same trade bigger, so wins and losses both grow."
  - `c` "The spread and commission you pay on each fill" → "The costs per unit stay the same: a 0.10 spread and 0.05% of each fill. Leverage changes how large the position is against the account."
  - `d` ✓ (corectă)
- **Verificare:** L12: „Price moves by the same amount either way. What changes is how big that move is compared with your account.” ✓

#### q-pe-5 · numeric · d2 · L12
- **Concepte:** exposure, leverage
- **Indicii:** 1. "Apply the 10% move to the position you hold, then compare the loss with the account." 2. "Loss = position value × move. Loss % = loss ÷ equity × 100." 3. "Loss: 10% × 20,000.00 = 2,000.00. Now divide by 10,000.00."
- **Variații (vary):**
  - Câmpuri: equity 10,000.00, fix; `lev` ∈ {1.5, 2, 2.5, 3, 4, 5}, deci value = lev × 10,000.00; `move` 2–15%, pas 1.
  - Formula: `answer = value × move ÷ 100 ÷ equity × 100`, adică `lev × move`.
  - Toleranța: 0.01, unitate %.
  - Constrângeri: `answer ≤ 60`. Fraza „At 2× exposure…” din explicație se generează cu `lev`.
  - Exemplu: poziție 25,000.00, mișcare 6% → 1,500.00 → **15**%.
- **Verificare:** 2,000.00 ÷ 10,000.00 = 20% ✓.

#### q-pe-6 · scenario · d3 · L12
- **Concepte:** exposure, gap-risk
- **Explicații per variantă:**
  - `a` "100.00: the stop caps the loss at the planned amount, whatever happens" → "The 100.00 assumes the stop fills near 98.00. A gap fills the stop at the open, 90.00, so the plan does not cap this loss."
  - `b` ✓ (corectă)
  - `c` "5,000.00: a gap through the stop loses the whole position value" → "The stop still fills, just at the open. You lose the 10.00 per unit fall to 90.00, not the whole 5,000.00."
  - `d` "200.00: after a gap the stop fills partway between 98.00 and 90.00" → "In a gap there is no trading between the two prices. The stop fills at the first available price, the opening bid of 90.00."
- **Indicii:** 1. "A stop becomes a market order when touched. What is the first price available after the gap?" 2. "Loss = units × (entry − actual fill price), whatever the planned stop was." 3. "The fill is at 90.00, so each of the 50 units loses 100.00 − 90.00 = 10.00."
- **Verificare:** 50 × 10.00 = 500.00 = 5% din cont ✓. Motorul execută stop-ul la bid-ul de deschidere în caz de gap ✓.

#### q-pe-7 · mcq · d2 · L12
- **Concepte:** correlation-and-concentration, exposure
- **Explicații per variantă:**
  - `a` "Two separate 40% exposures that cannot affect each other's results" → "Positions that move together are hit by the same move. Treating them as separate understates what one adverse move does to the account."
  - `b` "Zero, because two positions always cancel each other out" → "Positions cancel only if they move in opposite directions. These move together, so they add up instead."
  - `c` ✓ (corectă)
  - `d` "40%, because only the larger of the two positions counts" → "Both positions are in the market, and a shared move hits both. Count the total: 8,000.00, or 80% of the account."
- **Verificare:** 4,000.00 + 4,000.00 = 8,000.00 = 80% ✓.

#### q-pe-8 · mcq · d1 · L12
- **Concepte:** leverage, exposure
- **Explicații per variantă:**
  - `a` ✓ (corectă)
  - `b` "200% of equity, as long as every trade has a stop" → "A stop does not unlock leverage. Missions and the Arena use none, so position value cannot exceed equity: 100% at most."
  - `c` "500% of equity, but only in the Arena" → "The Arena allows more risk per trade, 2% instead of 1%, but no leverage. Exposure is capped at 100% there too."
  - `d` "No limit, as long as each trade risks under 1%" → "Risk per trade and exposure are separate limits. Even a trade that risks 1% cannot hold more than the account's equity."
- **Verificare:** în motor, `maxLeverage: 1` în misiuni (`common.ts`) și în Arena (`arena.ts`) ✓. Strict, poziția plus comisionul de intrare trebuie să încapă în equity (vezi q-ps-8), dar „100%” rămâne răspunsul corect la nivelul lecției.

#### q-pe-9 · scenario · d3 · L12
- **Concepte:** leverage, gap-risk
- **Explicații per variantă:**
  - `a` "Nothing: sizing every trade to 1% removes all of the risk leverage adds" → "Sizing controls the planned loss only if the stop fills near its price. The exposure behind it, up to 5× the account, is still there."
  - `b` "Leverage narrows the spread, so it lowers the cost of every trade" → "Leverage changes position size, not the spread. The costs per unit stay the same; a bigger position pays more of them in total."
  - `c` "Leverage makes stops trigger sooner, so every loss ends up smaller" → "A stop triggers at its price whatever the leverage. Leverage only changes how much a given move costs the account."
  - `d` ✓ (corectă)
- **Indicii:** 1. "Ask what the 1% figure assumes about where the stop fills." 2. "Risk is the loss if the stop fills as planned. Exposure decides the loss if price jumps past it." 3. "At 5×, a position can be worth 50,000.00. A 10% gap on it costs 5,000.00, half the account."
- **Verificare:** 10% × 50,000.00 = 5,000.00 = 50% din 10,000.00 (cifrele din indiciul 3) ✓. `d` e singura corectă.

## Întrebări noi propuse · Portfolio Exposure

Motiv: `correlation-and-concentration` are o singură întrebare (q-pe-7).

#### q-pe-10 · scenario · d2 · L12
- **Concepte:** correlation-and-concentration, risk-per-trade
- **Scenariu:** "You open a LABX long that risks 1% of your account. A few hours later you see another entry on LABX and open a second long, also risking 1%, with its stop close to the first one."
- **Prompt:** "How should you think about your risk now?"
- **Variante:**
  - `a` "Two separate 1% risks, because each trade has its own stop" → "Separate stops do not make the trades independent. One move in LABX acts on both at once, so their losses arrive together."
  - `b` ✓ "Close to a single 2% bet on the same idea, since one fall can hit both stops"
  - `c` "Less than 1% in total, because two entries diversify the risk" → "Diversification helps only when positions are genuinely independent. Two longs on the same instrument are about as related as positions get."
  - `d` "Exactly 1%, because only the first trade counts towards the limit" → "Every open trade's risk counts. Two 1% trades on the same idea put about 2% of the account on one outcome."
- **Explicație:** "Both trades depend on the same instrument and the same idea. If one stop is hit, the other is probably under pressure too, so together they behave like a single 2% bet."
- **Verificare:** exemplul conceptului `correlation-and-concentration`: două long-uri pe LABX de câte 1% „behave like a single 2% bet on the same idea” ✓.

#### q-pe-11 · numeric · d2 · L12
- **Concepte:** correlation-and-concentration, exposure
- **Prompt:** "Your account is 10,000.00. You hold two positions that tend to move together, worth 3,000.00 and 4,500.00. Both fall 6% in the same move. What is the combined loss as a percentage of the account?"
- **Răspuns:** 4.5 (toleranță 0.01, unitate %)
- **Explicație:** "Positions that move together act like one: 3,000.00 + 4,500.00 = 7,500.00, or 75% exposure. A 6% fall costs 6% × 7,500.00 = 450.00, which is 4.5% of the account."
- **Indicii:** 1. "Treat positions that move together as one combined position." 2. "Loss = total position value × move. Loss % = loss ÷ equity × 100." 3. "Combined value: 3,000.00 + 4,500.00 = 7,500.00. Now apply the 6% fall."
- **Variații (vary):**
  - Câmpuri: equity 10,000.00; `v1`, `v2` 1,000.00–6,000.00, pas 500.00; `move` 2–10%, pas 1.
  - Formula: `answer = (v1 + v2) × move ÷ 100 ÷ 10,000.00 × 100`.
  - Toleranța: 0.01, unitate %.
  - Constrângeri: `v1 ≠ v2`, ca „doar poziția mai mare contează” să dea alt răspuns; `v1 + v2 ≤ 9,500.00` (fără levier). Răspunsul e mereu multiplu de 0.05.
  - Exemplu: 2,000.00 și 3,500.00, scădere 4% → 5,500.00 × 4% = 220.00 → **2.2**%.
- **Verificare:** 7,500.00 × 6% = 450.00; 450.00 ÷ 10,000.00 = 4.5% ✓. Regula din L12: „Positions that tend to move together add up to one larger exposure”.
