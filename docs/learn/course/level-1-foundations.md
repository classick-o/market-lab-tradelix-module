# Nivelul 1 · Foundations

**Base camp.** Al doilea nivel al cursului: 8 unități, 58 de lecții și Capstone 1. Harta urmează arhitectura și formatul din [README.md](README.md) (§2–§10). Titlurile, obiectivele și textele de UI sunt în engleză, ca în aplicație; restul e în română. Lecțiile existente (L01–L04, L05, L06, L08–L14, L17) își păstrează scripturile din [../](../README.md); fișele de aici le rezumă și spun doar ce se schimbă în trimiteri.

---

## Introducerea nivelului

**Pentru cine:** cine a trecut prin Orientation (sau a fost plasat aici la onboarding). Utilizatorul știe ce e o piață, ce e valoarea așteptată și de ce un rezultat nu judecă o decizie; încă n-a citit un grafic și n-a pus un ordin.

**Ce poate face utilizatorul la final:**
- citește un ecran de cotații (bid, ask, mid, last) și un grafic (lumânări, tipuri de grafic, timeframe-uri, volum, gap-uri, scara log) și spune ce *nu* poate arăta graficul;
- alege ordinul pe care îl cere planul (market, limit, stop-loss, take-profit, stop de intrare, stop-limit, bracket, OCO, time in force, trailing stop) și prezice dacă și unde se execută, inclusiv cu slippage și gap;
- calculează costul real al unui trade (spread, comision, break-even) și îl exprimă ca parte din risc;
- fixează riscul ca procent din equity-ul curent, exprimă orice rezultat în R, pune stop-ul la invalidare, dimensionează poziția cu costuri, calculează R:R, rata de câștig la break-even și expectancy, și respectă o limită zilnică;
- citește structura: swing-uri, trend, range și zgomot, pullback-uri, suport și rezistență ca zone, numere rotunde, retest și breakout eșuat, sfârșitul unui trend, două timeframe-uri;
- are un plan v1 scris, un checklist, un jurnal și o rutină de review; separă greșeala de varianță și își urmărește KPI-urile de proces;
- recunoaște FOMO, revenge trading, loss aversion, gambler's fallacy, outcome bias și overtrading, și le opune reguli if-then și o pauză;
- refuză martingale, grid și averaging down (nota F, cu matematica ruinei), verifică un broker și o promisiune de performanță și vede iluzia levierului.

**Durata:** 58 de lecții (7 + 7 + 8 + 9 + 8 + 7 + 7 + 5), de 5–7 minute, în jur de 6 ore interactive, plus practica și Capstone 1.

**Etapa de trecere 1 → 2** (README §5). Acordă nivelul și insigna, nu blochează nimic:
- **30 de trade-uri simulate** (Arena sau misiuni), numărate după ce planul v1 e salvat (1.6.2):
  - stop pus înainte de intrare în ≥ 95% din cazuri (stop integrity);
  - risc calculat corect în ≥ 90% din cazuri. Definiție propusă, de confirmat: pierderea la stop, cu ambele comisioane, nu depășește bugetul (1% în misiuni; 2% în Arena, 1% în scenariile high volatility și event shock), iar mărimea e cel puțin 90% din mărimea dată de regulă (`maxQtyForRisk`), cu excepția plafonului de buying power;
  - nicio limită depășită: riscul pe trade, limita zilnică din planul v1, niciun stop mutat mai departe;
- **planul v1 scris** (1.6.2);
- **Capstone 1 trecut** (finalul fișierului).
- Măsurile vin din jurnalul automat (S15) și din detectoarele de comportament (S14). Profitul simulat nu intră nicăieri.

**Firele din spirală la Nivelul 1** (README §4):

| Fir | Ce apare aici | Unde |
|---|---|---|
| **Risc** | R, stop la invalidare, sizing cu costuri, expunere, drawdown, limita zilnică | 1.3.2, 1.3.7, 1.4 |
| **Statistică** | expectancy și break-even, înainte și după costuri; seriile din 0.2.3 aplicate la drawdown și la limita zilnică; de ce 30 de trade-uri măsoară procesul | 1.4.5, 1.4.6, 1.4.8, 1.4.9, 1.6.7 |
| **Psihologie** | emoții, FOMO, revenge, loss aversion, gambler's fallacy, outcome bias, plictiseală; reguli if-then și pauza | 1.7 |
| **Proces** | planul v1, checklist-ul, jurnalul, review-ul, greșeală vs varianță, KPI-uri | 1.6 |
| **Dovezi** | „ce nu poate spune graficul”; notele pentru niveluri, numere rotunde, breakout-uri, Fibonacci și MTF; nota F pentru martingale și grid | 1.2.7, 1.5, 1.8 |
| **Costuri** | spread și comision, break-even, costul ca parte din R | 1.1, 1.4.6 |

**Convenții pentru acest nivel:**
- Lumea simulată din [../README.md](../README.md): LABX, vUSD, cont 10,000.00, spread 0.10, comision 0.05% pe fiecare execuție, rotunjit în sus la cent, unități întregi rotunjite în jos, fără levier. Regulile de execuție sunt cele din U1 („Reguli de execuție folosite în exemple”): stop-ul unui long se declanșează la bid (mid ≤ stop + 0.05), al unui short la ask (mid ≥ stop − 0.05), verificat în `packages/engine`.
- **R include costurile** (L08, L11, `riskAmount` din motor). Lecția 1.4.6 separă explicit prețul de costuri și o spune.
- **Ordinea unităților urmează README §3.** Două consecințe pentru lecțiile existente:
  - L10 (1.4.3) vine acum înaintea lui L05 și L06 (1.5). Se sprijină pe „normal candle size” din 1.2.5 și pe suportul introdus în L04 (1.3.2); nu cere nimic altceva din 1.5;
  - L17 (1.6.5) nu mai are L15 înainte (L15 urcă la 2.13). Ideea „outcome vs decision” vine din 0.2.1.
- La lecțiile existente, câmpul Check dă setul final propus în scripturi (cu înlocuirile din fișierele U1–U5).

---

## Unitatea 1.1 · Prices, quotes and costs

- **Scop:** prețurile la care se tranzacționează (bid, ask, mid, last), long și short, costurile (spread, comision, finanțare, slippage), round trip și break-even, P&L-ul în ticks, puncte, pips și unități, ecranul de cotații și biletul de ordin.
- **De ce aici:** mecanica vine înaintea analizei (R1 §3.2, principiul 1); costurile sunt singura parte sigură a unui trade (R5 RR-03; R1 §4.6) și trebuie văzute înaintea oricărui grafic. 1.1 vine înaintea 1.2 pentru că graficul LABX se desenează din mid, iar mid-ul se înțelege după bid și ask.
- **Cere de dinainte:** 0.1.1 (licitația, cea mai bună cerere și cea mai bună ofertă).
- **Checkpoint:** q-mf-4 … q-mf-7, q-mf-9 (partea L02 din `test-market_fundamentals`) + 12 întrebări noi (câte 2 pentru 1.1.2–1.1.7); pool de check 2 × d1, 2 × d2, 1 × d3. La ≥ 80%, cele 7 lecții se marchează „Tested out”. Banca `market_fundamentals` se împarte pe unități: întrebările L01 merg la 1.2, q-mf-11 (L05) la 1.5.
- **Laboratorul unității:** „Cost receipt”: 5 trade-uri date (long și short, prețuri și mărimi diferite). Utilizatorul completează pentru fiecare prețurile de execuție (bid sau ask), comisioanele rotunjite, P&L-ul brut și net, apoi compară cu chitanța aplicației (R5 RR-03).
- **Firele din spirală:** Costuri (centrul unității), Risc (pierderea fără plafon a unui short), Proces (verificarea biletului înainte de trimitere).
- **Surse:** R1 MB-04 … MB-07, OX-09, OX-13, OX-14, §3.3; R3 §1.5, §1.6, §1.8, §2.18, §2.19; R5 RF-21, RR-03; R6 §1.2, §3.1, §5.1.
- **Lecții existente:** L02 → 1.1.1. „Se sprijină pe” trece de la L01 la 0.1.1, pentru că L02 vine acum înaintea L01. Propoziția „Chart candles are drawn from it” rămâne: utilizatorul a văzut grafice cu lumânări în 0.2.5.
- **Widget-uri noi și extinderi:** `position-pnl`, `quote-lines`, `pnl-converter`, `ticket-check`; `spread-cost` primește modul de comparație între doi brokeri.

#### 1.1.1 · Bid, ask and the spread  ·  `L02`
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Name the bid, the ask, the mid and the spread, and say which price a buyer and a seller get.
  2. Calculate the round-trip cost of a position, including spread and commission.
  3. Explain why a new position shows a small loss straight away.
- **Concepte:** bid-ask-spread ✓, trading-costs ✓
- **Se sprijină pe:** 0.1.1
- **Hook:** predict · alegere: "The chart shows LABX at 100.00. You buy 50 units and sell them straight back. Price hasn't moved. What's your result?" — "Zero: price didn't move" / "A small gain" / "A small loss". Răspuns: „A small loss”: −10.01 vUSD în simulator (spread 5.00, comision 2.51 + 2.50).
- **Interacțiunea centrală:**
  - B2 figure `bid-ask-spread`: MID 100.00, ASK 100.05 („YOU BUY HERE”), BID 99.95 („YOU SELL HERE”), acolada SPREAD 0.10; după pasul 3, un slider pe spread (0.02–0.50), doar pentru explorare.
  - B3 match: "You buy now" ↔ ask 100.05; "You sell now" ↔ bid 99.95; "The candles on the chart" ↔ mid 100.00; "The gap from bid to ask" ↔ spread 0.10.
  - B5 worked: 50 de unități cumpărate la 100.05 și vândute la 99.95: spread 5.00 + comision 5.00 = 10.00 (simulatorul încasează 10.01).
  - B6 predict „Back to zero”: cât trebuie să urce mid-ul ca vânzarea să aducă zero → „About 0.20” (spread-ul plus două comisioane).
  - B7 callout: costurile sunt sigure, mișcarea prețului nu.
- **Try:** `spread-cost`, cu câmpul de comision din PLAN_LEARN §9.1: "Set up 100 units at a mid of 50.00, spread 0.10 and commission 0.05%. Enter the round-trip cost before the widget shows it." Reușită: |răspuns − 15.01| ≤ 0.01 (10.00 + 2.51 + 2.50).
- **Practică:** M05 Size Matters; Arena: low volatility.
- **Check:** q-mf-4, q-mf-5, q-mf-6 (cu corectura din D1: poziția se evaluează la mid; până atunci, q-mf-7 în loc de q-mf-6).
- **Dovezi:** Mechanic (R3 §1.5, §1.6; R1 MB-04, OX-09).
- **Necesită:** — (câmpul de comision din `spread-cost` e o schimbare de widget, nu de simulator).
- **Termeni noi de glosar:** — (toți există; propun `lesson: "L02"` pentru `basis-point`, `position`, `unrealised-pnl`, ca în issues-and-decisions B)

#### 1.1.2 · Long and short
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Calculate the P&L of a long and of a short from the entry and exit fills.
  2. Name the price, bid or ask, that opens and closes a long and a short.
  3. Explain why a short's possible loss has no fixed ceiling while a long's is limited to the price falling to zero.
- **Concepte:** long-and-short (nou)
- **Se sprijină pe:** 1.1.1
- **Hook:** predict · alegere: "LABX is at 100.00 and you think it will fall. Can you make money from a fall?" — "No, only by buying" / "Yes: sell first, buy back later" / "Only with options". Răspuns: da, cu un short; Arena permite short-uri. Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: un long cumpără întâi și vinde mai târziu; câștigă dacă prețul urcă. Un short vinde întâi (o unitate împrumutată sau un contract) și cumpără înapoi mai târziu; câștigă dacă prețul scade.
  - B2 figure, două `Bracket`-uri simetrice: long cumpărat la ask 100.05 și vândut la bid 101.95 (mid 102.00): +1.90 pe unitate; short vândut la bid 99.95 și cumpărat înapoi la ask 98.05 (mid 98.00): +1.90 pe unitate. Spread-ul costă la fel în ambele direcții.
  - B3 match: "Open a long" ↔ Ask; "Close a long" ↔ Bid; "Open a short" ↔ Bid; "Close a short" ↔ Ask.
  - B4 worked „A short, line by line”: "Short 30 units at the bid, 99.95.", "The mid falls to 97.00; you buy back at the ask, 97.05.", "P&L before commission: 30 × (99.95 − 97.05) = ?" Răspuns: 87.00 (toleranță 0). După răspuns: "Commission 1.50 + 1.46: net +84.04."
  - B5 predict: "Long at 100.05 or short at 99.95: which one can lose more than 100.00 per unit?" — "The long" / "The short" / "Neither". Răspuns: short-ul. Un long pierde cel mult prețul plătit (prețul nu coboară sub zero); un short pierde cât urcă prețul, fără plafon fix.
  - B6 explain: la acțiuni, short-ul cere acțiuni împrumutate și o taxă de împrumut (previzualizare 2.14). În LABX, short-ul e simetric și fără taxă; stop-ul lui stă deasupra intrării și se declanșează la ask.
  - B7 callout: "Sized from a stop, a short risks the same 1% as a long. Without a stop, its loss has no ceiling."
- **Try:** `position-pnl` (widget nou): direcția (Long/Short), unitățile, prețul de intrare (fill) și mid-ul curent tras pe axă; afișează bid, ask, prețul de ieșire și P&L-ul înainte și după comision.
  - Sarcina: "You're short 40 units from 99.95. Move the mid until your P&L before commission is exactly +40.00."
  - Reușită: mid 98.90 (ieșirea la ask, 98.95: 40 × (99.95 − 98.95) = 40.00).
  - Indicii: 1. "A short closes at the ask." 2. "You need 1.00 per unit: the ask must reach 98.95." 3. "Ask = mid + 0.05."
- **Practică:** Arena: bearish (short cu stop deasupra ultimului swing high, sau decizia de a rămâne flat).
- **Check:** Q1 (numeric, d1) P&L-ul unui short nou; Q2 (mcq, d1) prețul la care se închide un short; Q3 (scenario, d2) de ce un short fără stop e periculos.
- **Dovezi:** Mechanic (R1 MB-05; R3 §2.19; R6 §3.1).
- **Necesită:** — (Arena permite deja short-uri).
- **Termeni noi de glosar:** `borrow-fee` (leagă existenții `long`, `short`, `flat`)

#### 1.1.3 · Which price is "the price"?
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Distinguish last, bid, ask and mid, and say which one a chart is drawn from.
  2. Predict which quote triggers a long's stop and a short's stop.
  3. Explain how a wider spread can trigger a stop while the chart barely moves.
- **Concepte:** price-types (nou)
- **Se sprijină pe:** 1.1.2
- **Hook:** predict · alegere: "Your short has a stop at 101.00. The LABX chart, drawn from the mid, peaks at 100.97. Were you stopped out?" — "Yes" / "No" / "Can't tell". Răspuns: da. Ask-ul a fost 101.02, peste 101.00, iar stop-ul unui short se declanșează la ask. Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: last = prețul ultimului trade; bid și ask = cotațiile de acum; mid = la jumătate între ele. Graficele de acțiuni arată de obicei last, multe platforme de FX și CFD arată bid-ul, LABX arată mid-ul (R3 §1.5).
  - B2 figure: trei linii (bid, mid, ask) pe 10 lumânări, cu un stop de short la 101.00; linia ask atinge stop-ul, mid-ul nu.
  - B3 match: "A stock chart usually shows" ↔ Last; "LABX candles" ↔ Mid; "A long's stop triggers on" ↔ Bid; "A short's stop triggers on" ↔ Ask.
  - B4 explain: pe piețele reale, spread-ul nu e constant: se lărgește la deschidere, la știri și pe piețe subțiri (R3 §1.6). În LABX rămâne 0.10.
  - B5 predict: "At a news release the spread widens from 0.10 to 0.60 while the mid sits at 100.70. Does a short's stop at 101.00 trigger?" — "Yes" / "No". Răspuns: da; ask-ul e 100.70 + 0.30 = 101.00.
  - B6 callout: "Know which price triggers your orders. A stop just beyond a level also needs room for half the spread."
- **Try:** `quote-lines` (widget nou): linii bid, mid și ask peste un grafic, un mid tras pe axă și un stop fix; în două părți.
  - Sarcina: "A long's stop is at 99.50. Drag the mid to the highest price at which the stop triggers. Then do the same for a short's stop at 101.00: the lowest price that triggers it."
  - Reușită: 99.55 (bid 99.50) și 100.95 (ask 101.00).
  - Indicii: 1. "Which side closes a long? Which closes a short?" 2. "Bid = mid − 0.05; ask = mid + 0.05." 3. "Solve for the mid that puts that quote exactly on the stop."
- **Practică:** Arena: bearish (stop-uri de short); Arena: event shock.
- **Check:** Q1 (mcq, d1) din ce preț se desenează graficul LABX; Q2 (numeric, d2) mid-ul la care se declanșează un stop dat; Q3 (scenario, d2) un stop atins „fără ca graficul să ajungă acolo”.
- **Dovezi:** Mechanic (R3 §1.5, §1.6, §2.3; engine: regulile de declanșare din `packages/engine`).
- **Necesită:** S6 (spread variabil la știri) pentru practică; lecția și widget-ul nu au nevoie.
- **Termeni noi de glosar:** `last-price`, `quote`

#### 1.1.4 · Commission, fees and the cost stack
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Calculate the commission on a fill under a percentage model, rounded up to the cent.
  2. List the costs that stand between a gross and a net result.
  3. Explain why "zero commission" doesn't mean zero cost.
- **Concepte:** cost-stack (nou), trading-costs ✓
- **Se sprijină pe:** 1.1.3
- **Hook:** predict · alegere: "Broker A: zero commission, spread 0.30. Broker B: 0.05% commission, spread 0.10. You buy and sell 100 LABX at a mid of 100.00. Which is cheaper?" — "A" / "B" / "The same". Răspuns: B. A costă 100 × 0.30 = 30.00; B costă 10.00 spread + 5.01 + 5.00 comision = 20.01.
- **Interacțiunea centrală:**
  - B1 explain: modelele de comision: procent din valoarea execuției (în bps; LABX are 5 bps), sumă fixă pe acțiune sau pe unitate, sumă fixă pe lot sau pe contract, „zero commission” (R6 §5.1).
  - B2 worked „One fill”: "Buy 37 units at the ask, 100.05.", "Fill value: 37 × 100.05 = 3,701.85.", "0.05% of 3,701.85 = 1.850925.", "Rounded up to the cent = ?" Răspuns: 1.86 (toleranță 0).
  - B3 figure, cascada de costuri (R3 §2.18): P&L brut → − spread → − comision → − slippage (1.3.7) → − finanțare peste noapte → P&L net.
  - B4 match, cost ↔ când îl plătești: Spread ↔ "Every round trip"; Commission ↔ "Every fill"; Slippage ↔ "Fast markets and stops"; Overnight financing ↔ "Holding leveraged positions overnight"; Data and platform fees ↔ "Every month".
  - B5 explain: brokerii cu „zero commission” câștigă altfel: spread mai larg sau plata pentru fluxul de ordine (PFOF, în SUA; în UE se elimină treptat, cu termen la mijlocul lui 2026, de verificat; R3 §1.8). Taxele pe profit apar într-o propoziție, cu trimitere la 4.5.
  - B6 callout: "Costs are certain; edge is not. Count every cost before you count on any edge."
- **Try:** `spread-cost` în modul de comparație (extindere): doi brokeri unul lângă altul, 100 de unități la mid 100.00; Broker B fix (0.10, 0.05%), Broker A cu comision 0% și spread reglabil (0.02–0.50, pas 0.02).
  - Sarcina: "Find the widest spread at which zero-commission Broker A is still cheaper than Broker B for this round trip."
  - Reușită: 0.20 (A: 20.00 < B: 20.01; la 0.22, A costă 22.00).
  - Indicii: 1. "Broker B's round trip costs 20.01." 2. "Broker A's cost is 100 × its spread." 3. "Find the widest spread that keeps 100 × spread under 20.01."
- **Practică:** Arena: low volatility (costurile mănâncă mișcările mici).
- **Check:** Q1 (numeric, d2) comisionul unei execuții, rotunjit în sus; Q2 (mcq, d1) ce intră în cascada de costuri; Q3 (scenario, d2) de ce „zero commission” poate costa mai mult.
- **Dovezi:** Mechanic (R6 §5.1; R3 §2.18; R5 RR-03). PFOF și calendarul UE: reglementare datată, de verificat (R3 §1.8 [BK]).
- **Necesită:** — (extindere de widget).
- **Termeni noi de glosar:** `overnight-financing`, `payment-for-order-flow`

#### 1.1.5 · Round trips and break-even
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Find the break-even exit price of a long and of a short, costs included.
  2. Express the round-trip cost as a share of a planned move.
  3. Explain why small targets and frequent trading magnify the share of costs.
- **Concepte:** break-even-move (nou), trading-costs ✓
- **Se sprijină pe:** 1.1.4
- **Hook:** predict · alegere: "You bought 100 LABX at the ask, 100.05. How high must the mid go before selling breaks even, after both commissions?" — "100.05" / "About 100.10" / "About 100.20". Răspuns: în jur de 100.20; exact, 100.21 (la 100.20 rezultatul e −0.02, la 100.21 e +0.98). Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: un round trip înseamnă intrarea și ieșirea. Break-even-ul e mișcarea de care are nevoie prețul ca să acopere costurile, înainte de orice câștig.
  - B2 worked „The break-even move”: "Spread: 0.10 per unit.", "Commission: about 0.05 per unit at entry and 0.05 at exit.", "Break-even move of the mid ≈ 0.10 + 0.05 + 0.05 = ?" Răspuns: 0.20 (toleranță 0.01).
  - B3 figure `Bars`: același cost de ≈ 0.20 pe unitate față de trei ținte: 0.40 (costurile iau 50% din mișcare), 1.00 (20%), 4.00 (5%) (regula cost ÷ profitul brut, R6 §5.1).
  - B4 predict: "A plan targets 0.30 per trade, six trades a day. What share of each gross gain goes to costs?" — "About 7%" / "About 30%" / "About 67%". Răspuns: ≈ 67% (0.20 ÷ 0.30).
  - B5 explain: zidul costurilor la scalping: un spread de 1 pip pe o țintă de 5 pips înseamnă 20% din câștigul brut, înainte de comision și slippage (R6 §1.2). Previzualizare pentru 2.9.
  - B6 explain: break-even-ul unui short e simetric: mid-ul trebuie să coboare cam 0.20.
  - B7 callout: "Before entering, check that the target is worth the costs."
- **Try:** `position-pnl` cu costuri, în două părți.
  - Sarcina: "Part 1: long 100 units filled at 100.05. Drag the exit mid to the lowest price where the round trip is not a loss. Part 2: short 100 units filled at 99.95. Drag it to the highest price where the round trip is not a loss."
  - Reușită: 100.21 (bid 100.16, net +0.98; la 100.20, −0.02) și 99.80 (ask 99.85, net 0.00; la 99.81, −1.00).
  - Indicii: 1. "A long exits at the bid, a short at the ask." 2. "Both commissions are paid, and each is rounded up to the cent." 3. "Watch the net P&L row; stop where it first reaches zero or more."
- **Practică:** Arena: low volatility.
- **Check:** Q1 (numeric, d1) mișcarea de break-even a unui round trip; Q2 (numeric, d2) partea din câștig mâncată de costuri la o țintă dată; Q3 (scenario, d2) de ce multe trade-uri mici suferă cel mai mult.
- **Dovezi:** Mechanic (R6 §5.1, §1.2; R5 RF-21, RR-03).
- **Necesită:** —
- **Termeni noi de glosar:** `round-trip`, `break-even`

#### 1.1.6 · P&L in ticks, points, pips and units
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Calculate P&L as units × price change, in vUSD and as a percentage of the account.
  2. Convert a price change into ticks, points or pips and into money with a value per point.
  3. Explain why the same price move is worth different amounts in different instruments.
- **Concepte:** point-value (nou)
- **Se sprijină pe:** 1.1.2
- **Hook:** predict · alegere: "LABX moves from 100.00 to 101.25. How many ticks is that?" — "1.25" / "12.5" / "125". Răspuns: 125 (un tick LABX = 0.01).
- **Interacțiunea centrală:**
  - B1 explain: tick-ul e pasul minim de preț (LABX: 0.01); punctul e 1.00; P&L = unități × schimbarea de preț.
  - B2 worked: "30 units long, price +1.25.", "P&L = 30 × 1.25 = ?" Răspuns: 37.50 (toleranță 0). După răspuns: "37.50 is 0.375% of a 10,000.00 account."
  - B3 figure: aceeași mișcare în trei instrumente: LABX (1.00 vUSD pe punct și pe unitate), o pereche FX (pip = 0.0001; 10,000 de unități → 1.00 pe pip) și un contract futures ilustrativ pe LABX (1 contract = 100 de unități, deci 1.00 vUSD pe tick). Futures-ul e sintetic: specificațiile reale CME nu sunt verificate (R6 §0.1).
  - B4 worked „Pips”: "EUR/USD moves from 1.1000 to 1.1030: 30 pips.", "10,000 units: each pip is worth 1.00 USD.", "P&L = 30 × 1.00 = ?" Răspuns: 30.00.
  - B5 match: "Tick" ↔ "The smallest price step"; "Pip" ↔ "0.0001 in most currency pairs"; "Lot" ↔ "A standard block of units"; "Contract multiplier" ↔ "Money per point for one contract"; "Point" ↔ "A move of 1.00 in price".
  - B6 callout: "The same 1% move can be worth 1.00 or 100.00. Always turn it into money and into a share of your account." Trimitere la 1.4.
- **Try:** `pnl-converter` (widget nou): instrumentul (LABX, pereche FX, futures ilustrativ), mărimea și mișcarea; afișează P&L-ul în moneda contului.
  - Sarcina: "Make a gain of exactly +30.00 three ways: with LABX units, with FX pips and with futures ticks."
  - Reușită: toate trei rândurile arată +30.00 (de exemplu 20 de unități LABX × 1.50; 10,000 de unități × 30 de pips; 1 contract × 30 de ticks).
  - Indicii: 1. "P&L = size × move × value per point." 2. "For FX, 10,000 units make 1.00 per pip." 3. "For the futures contract, one tick is worth 1.00."
- **Practică:** Arena: bullish (P&L-ul citit în vUSD și în procente din cont).
- **Check:** Q1 (numeric, d1) P&L-ul LABX în vUSD; Q2 (numeric, d2) conversia pips → bani; Q3 (mcq, d2) de ce „10 puncte” nu spune nimic fără mărime și valoarea punctului.
- **Dovezi:** Mechanic (R1 MB-06, MB-07; R3 §1.6, tick size).
- **Necesită:** S10 pentru practica pe alte instrumente (2.14, 3.14); lecția și widget-ul nu au nevoie.
- **Termeni noi de glosar:** `point`, `pip`, `lot`, `contract-multiplier` (leagă existentul `tick`; propun `lesson: "1.1.6"`)

#### 1.1.7 · The quote screen and the order ticket
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Read last, bid, ask, the change and the day's range on a quote line.
  2. Tell balance, equity, realised and unrealised P&L apart on the account panel.
  3. Check side, size, price and stop on a ticket before sending it.
- **Concepte:** balance-and-equity (nou), order-ticket (nou)
- **Se sprijină pe:** 1.1.5, 1.1.6
- **Hook:** predict · alegere: "One open long of 50 units, bought at 100.05. The panel shows Balance 9,997.49 and Equity 9,992.49. Why is equity lower?" — "A fee not charged yet" / "The open position is showing a loss" / "A display error". Răspuns: poziția deschisă arată −5.00 la mid-ul de 99.95. Balance-ul are deja scăzut comisionul de intrare, 2.51.
- **Interacțiunea centrală:**
  - B1 figure, linia de cotație: LABX · last · bid · ask · change · day high · day low; fiecare câmp se aprinde și primește o propoziție.
  - B2 explain: panoul de cont. Balance = depuneri + trade-uri închise, după costuri; equity = balance + P&L-ul nerealizat al pozițiilor deschise, evaluate la mid. Riscul procentual din MARKET//LAB se calculează pe equity.
  - B3 worked: "Bought 50 at 100.05; commission 2.51.", "Balance: 10,000.00 − 2.51 = 9,997.49.", "Mid now 99.95: open P&L = 50 × (99.95 − 100.05) = −5.00.", "Equity = 9,997.49 − 5.00 = ?" Răspuns: 9,992.49.
  - B4 hotspot, pe biletul de ordin: "Tap the field that decides how much you lose if you're wrong." Ținta: câmpul de stop (cu mărimea lângă el); celelalte câmpuri primesc o explicație scurtă.
  - B5 order, verificarea dinaintea trimiterii (R1 OX-14): "Instrument" → "Side: buy or sell" → "Units" → "Order type and price" → "Stop and target" → "Send".
  - B6 callout: "Most costly mistakes happen in the ticket, not in the analysis: the wrong side, an extra zero, no stop. Read it once before you send."
- **Try:** `ticket-check` (widget nou): 4 bilete completate, fiecare cu o problemă posibilă, pentru planul "Buy 40 LABX at market, stop 98.00, target 104.00".
  - Biletul 1: side Sell; biletul 2: 400 de unități (un zero în plus); biletul 3: fără stop; biletul 4: corect.
  - Sarcina: "Flag every ticket that doesn't match the plan, and say what's wrong."
  - Reușită: biletele 1–3 marcate cu motivul corect, biletul 4 trimis.
- **Practică:** Arena: bullish (prima sesiune cu biletul complet și panoul de cont).
- **Check:** Q1 (mcq, d1) last vs bid vs ask pe o linie de cotație; Q2 (numeric, d2) equity-ul dintr-un balance și un P&L deschis; Q3 (scenario, d2) ce verifici înainte de „Send”.
- **Dovezi:** Mechanic (R1 OX-13, OX-14; motorul: `equityOf` = capital inițial + realizat − comisioane + nerealizat).
- **Necesită:** — (de verificat că UI-ul afișează balance-ul după comisioanele plătite, ca în motor).
- **Termeni noi de glosar:** `order-ticket`, `fat-finger-error` (leagă existenții `balance`, `equity`, `realised-pnl`, `unrealised-pnl`, `buying-power`)

---

## Unitatea 1.2 · Charts and candles

- **Scop:** citirea graficului: lumânarea, tipurile de grafic, timeframe-urile și agregarea, volumul, mărimea normală a unei lumânări și gap-urile, scara log, ce nu poate arăta un grafic.
- **De ce aici:** concretul și vizualul vin înaintea abstractului (R1 §3.2, principiul 2). Citirea graficului e limbajul de care au nevoie ordinele (1.3), stop-ul (1.4.3) și structura (1.5). Lecția 1.2.5 dă „normal candle size”, pe care îl folosește L10, și gap-ul, pe care îl folosește L04.
- **Cere de dinainte:** 1.1.1 (mid-ul).
- **Checkpoint:** q-mf-1, q-mf-2, q-mf-3, q-mf-8, q-mf-10 (partea L01) + 12 întrebări noi pentru 1.2.2–1.2.7. La ≥ 80%, cele 7 lecții se marchează „Tested out”.
- **Laboratorul unității:** M01 Read the Candle (există) și „Read the chart”: aceleași 48 de ore pe 1H și pe 4H, cu volum și un gap. Utilizatorul răspunde la 6 întrebări de citire și la una la care răspunsul corect e „the chart can't tell”.
- **Firele din spirală:** Dovezi („ce nu poate spune graficul”, exemplele alese după rezultat), Risc (gap-ul, mărimea normală a zgomotului).
- **Surse:** R1 CH-01 … CH-04, CH-13, §3.3, §4.5; R3 §1.11, §3.7, §4.1, §4.18 (previzualizare), §7.2; R5 PSY-13; R6 §2.2.4, §2.7.1.
- **Lecții existente:** L01 → 1.2.1, fără schimbări. M01 rămâne misiunea de final.
- **Widget-uri noi și extinderi:** `candle-aggregator`, `blind-replay`; în Learn Chart Kit: comutatorul de tip de grafic și scara log (S4), rigla (S3), hotspot cu selecție multiplă.

#### 1.2.1 · What a candle shows  ·  `L01`
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Read the open, high, low and close of any candle.
  2. Tell a bullish candle from a bearish one and describe its body and wicks.
  3. Separate what a candle records from what it cannot predict.
- **Concepte:** candlestick ✓, timeframe ✓
- **Se sprijină pe:** 1.1.1
- **Hook:** predict · hotspot pe o lumânare (O 100.00, H 101.50, L 99.20, C 101.00): "This candle is one hour of LABX trading. Tap the price where the hour ended." Răspuns: 101.00, vârful corpului; greșeala așteptată e 101.50 (high-ul).
- **Interacțiunea centrală:**
  - B2 figure `candle-anatomy` în 4 pași: open, close și corpul, high și low cu fitilele, apoi oglinda bearish.
  - B4 hotspot „Find the close” pe o lumânare bearish (O 100.60, H 100.90, L 99.30, C 99.70), cu feedback pentru fiecare preț atins.
  - B5 worked: range-ul = high − low = 101.50 − 99.20 = 2.30 (corp 1.00 + fitile 0.50 și 0.80).
  - B6 predict „Which came first?”: două drumuri intra-oră care desenează aceeași lumânare; o lumânare nu păstrează ordinea.
  - B7 callout: "A candle is a summary, not a signal."
- **Try:** `candle-builder`: "Build a bearish candle with a long lower wick: at least twice the body, and longer than the upper wick." Reușită, pe valorile efective: close < open, fitilul de jos ≥ 2 × corpul și mai lung decât fitilul de sus. Show me: 100.00 / 100.20 / 98.80 / 99.70.
- **Practică:** M01 Read the Candle.
- **Check:** q-mf-1, q-mf-2 (cu `vary` sau cu lumânarea din conceptul candlestick, ca să nu repete B5), q-mf-3 (cu corectura variantei `b`).
- **Dovezi:** Mechanic (R3 §4.1; R1 CH-02, CH-03).
- **Necesită:** —
- **Termeni noi de glosar:** — (toți există)

#### 1.2.2 · Line, bar and candle charts
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Draw the same OHLC data as a line, a bar and a candle.
  2. Identify what each chart type keeps and what it drops.
  3. Choose a chart type for a task: a long-term overview or reading single periods.
- **Concepte:** chart-types (nou)
- **Se sprijină pe:** 1.2.1
- **Hook:** predict · alegere, pe un grafic `Line` cu 12 închideri (cea mai mare, 101.80): "Did LABX trade above 102.00 during these 12 hours?" — "Yes" / "No" / "Can't tell from this chart". Răspuns: „Can't tell from this chart”: linia leagă doar închiderile. Reveal: același set ca lumânări; lumânarea 9 are high 102.30.
- **Interacțiunea centrală:**
  - B1 explain: graficul line unește închiderile; bara OHLC arată open (liniuța din stânga), high, low și close (liniuța din dreapta); lumânarea arată aceleași patru prețuri, cu un corp.
  - B2 figure: aceleași 6 ore în trei stiluri; un comutator schimbă stilul, iar prețurile-cheie rămân pe loc.
  - B3 match: "Line chart" ↔ "Closes only"; "OHLC bar" ↔ "Four prices, ticks for open and close"; "Candle" ↔ "Four prices, a body between open and close".
  - B4 hotspot pe o bară OHLC: "Tap the open." Ținta: liniuța din stânga.
  - B5 explain: alegerea depinde de sarcină. Line pentru ani de date și comparații; bare și lumânări pentru citirea fiecărei perioade. Niciunul nu arată ordinea tranzacțiilor din interiorul perioadei (L01 B6).
- **Try:** comutatorul de tip de grafic (S4) pe 24 de ore de LABX.
  - Sarcina: "Find the hour whose high went above 102.00, then switch to the line chart and say why it disappears."
  - Reușită: tap pe lumânarea 9 și alegerea motivului "The line only joins the closes."
- **Practică:** Arena: bullish cu comutatorul line / bar / candle (S4).
- **Check:** Q1 (mcq, d1) ce păstrează graficul line; Q2 (mcq, d2) cum se citește o bară OHLC; Q3 (scenario, d2) ce tip de grafic alegi pentru o privire pe 10 ani.
- **Dovezi:** Mechanic (R1 CH-02; R3 §4.1).
- **Necesită:** S4 (tipurile de grafic line și bar).
- **Termeni noi de glosar:** `line-chart`, `ohlc-bar`

#### 1.2.3 · Timeframes and aggregation
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Build a 4-hour candle from four 1-hour candles.
  2. Explain how the same market can look trending on one timeframe and choppy on another.
  3. Choose a timeframe that matches how long you plan to hold a trade.
- **Concepte:** timeframe ✓, candle-aggregation (nou)
- **Se sprijină pe:** 1.2.1
- **Hook:** predict · alegere, pe patru lumânări de 1 oră (H1 O 100.00 H 100.60 L 99.80 C 100.40; H2 O 100.40 H 101.10 L 100.20 C 100.90; H3 O 100.90 H 101.00 L 99.90 C 100.10; H4 O 100.10 H 100.50 L 99.60 C 100.30): "Combine these into one 4-hour candle. What is its close?" — "100.30" / "100.40" / "101.10" / "100.43". Răspuns: 100.30, close-ul ultimei ore (100.43 e media închiderilor, 101.10 e high-ul).
- **Interacțiunea centrală:**
  - B1 explain: timeframe-ul e perioada acoperită de o lumânare. MARKET//LAB folosește 1H și 4H; 24 de lumânări de 1H fac o zi.
  - B2 worked „The 4-hour candle”: "Open: the first open, 100.00.", "High: the highest high, 101.10.", "Close: the last close, 100.30.", "Low: the lowest low = ?" Răspuns: 99.60.
  - B3 figure: aceleași 48 de ore pe 1H (48 de lumânări, multe pullback-uri) și pe 4H (12 lumânări, o urcare clară).
  - B4 predict: "A strong bearish 1-hour candle sits inside a bullish 4-hour candle. Is that a contradiction?" — "Yes" / "No". Răspuns: nu; agregarea ascunde detaliile, iar lumânarea de 4H tot mai sus se închide.
  - B5 explain: timeframe-ul urmează durata trade-ului: swing pe 1H, 4H sau zilnic, day trading pe minute (R6 §1.1).
  - B6 callout: "Pick the timeframe before you look for a signal. Switching until a chart agrees with you is a bias, not analysis." Previzualizare pentru 1.5.8.
- **Try:** `candle-aggregator` (widget nou): 8 lumânări de 1 oră (primele patru din hook, apoi H5 O 100.30 H 100.80 L 100.10 C 100.70; H6 O 100.70 H 101.40 L 100.60 C 101.20; H7 O 101.20 H 101.30 L 100.70 C 100.80; H8 O 100.80 H 101.60 L 100.75 C 101.50) și două lumânări de 4H goale, cu câmpuri OHLC.
  - Sarcina: "Build both 4-hour candles."
  - Reușită: 100.00 / 101.10 / 99.60 / 100.30 și 100.30 / 101.60 / 100.10 / 101.50.
  - Indicii: 1. "Open = the first open; close = the last close." 2. "High = the highest of the four highs." 3. "Low = the lowest of the four lows."
- **Practică:** Arena: bullish, cu comutatorul 1H / 4H (există).
- **Check:** Q1 (numeric, d1) high-ul unei lumânări agregate; Q2 (mcq, d2) de ce o lumânare de 4H ascunde un pullback; Q3 (scenario, d2) timeframe-ul potrivit pentru un trade ținut câteva zile.
- **Dovezi:** Mechanic (R1 CH-01; R3 §4.1).
- **Necesită:** — (1H și 4H există; 15m și 1D intră în S4, la Nivelul 2).
- **Termeni noi de glosar:** — (leagă existentul `timeframe`)

#### 1.2.4 · Volume
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Read volume bars under a price chart and compare them with their average.
  2. Explain that volume measures activity, not direction.
  3. Recognise that spot FX and CFD charts usually show tick volume from one broker.
- **Concepte:** volume (nou)
- **Se sprijină pe:** 1.2.1
- **Hook:** predict · alegere: "Volume jumps to three times its average on a candle that closes flat. Were there more buyers or more sellers?" — "More buyers" / "More sellers" / "Neither: every unit bought was also sold". Răspuns: a treia. Fiecare tranzacție are un cumpărător și un vânzător; volumul numără unitățile, nu o parte.
- **Interacțiunea centrală:**
  - B1 explain: volumul e numărul de unități tranzacționate într-o perioadă.
  - B2 figure: 24 de lumânări cu bare de volum și linia mediei de 20; vârfuri la un breakout și la o lumânare de tip știre.
  - B3 hotspot: "Tap the candle with the most volume compared with its average."
  - B4 explain: ce spune volumul (interes, atenție, de obicei la breakout-uri, știri, deschideri) și ce nu spune (direcția).
  - B5 explain: spot FX nu are un volum central; „volumul” din graficele FX retail e tick volume, numărul de schimbări de preț la un singur broker (R3 §1.11). Futures-urile și acțiunile au volumul bursei. Volumul LABX e sintetic.
  - B6 callout: "Volume is context. Tools built on it (OBV, VWAP, volume profile) come in 2.5, with their evidence."
- **Try:** hotspot cu selecție multiplă (kit) pe 30 de lumânări cu volum.
  - Sarcina: "Mark the three candles where volume was at least twice its 20-candle average."
  - Reușită: exact cele 3 lumânări (definite în conținut).
- **Practică:** Arena: breakout, cu volumul afișat (toggle-ul există).
- **Check:** Q1 (mcq, d1) ce măsoară volumul; Q2 (scenario, d2) volum mare pe o lumânare fără direcție; Q3 (mcq, d2) ce e tick volume.
- **Dovezi:** Mechanic (definiția; R3 §1.11). Afirmația „volumul confirmă breakout-ul”: C/D (R6 §2.2.4); se discută în 2.5.
- **Necesită:** —
- **Termeni noi de glosar:** `tick-volume` (leagă existentul `volume`; propun `lesson: "1.2.4"`)

#### 1.2.5 · Normal candle size and gaps
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Measure a candle's range and the average range of recent candles.
  2. Spot a gap between one candle's close and the next candle's open.
  3. Explain why no order can fill at the prices a gap jumps over.
- **Concepte:** candle-range (nou), price-gaps (nou)
- **Se sprijină pe:** 1.2.1
- **Hook:** predict · alegere: "These ten LABX candles have ranges between 0.30 and 0.55. The next candle opens 1.20 below the last close. What happened in between?" — "Price traded down very fast" / "No trades happened at the prices in between" / "A display error". Răspuns: un gap: între închidere și deschidere nu s-a tranzacționat la niciun preț intermediar.
- **Interacțiunea centrală:**
  - B1 explain: range-ul unei lumânări e high − low (L01). Nu e același lucru cu un range de piață, piața laterală din 1.5.
  - B2 worked „A normal candle”: "Ranges of the last five candles: 0.40, 0.35, 0.50, 0.45, 0.30.", "Total: 2.00.", "Average = ?" Răspuns: 0.40. Această cifră e „normal candle ≈ 0.40” folosită în 1.4.3 (L10).
  - B3 figure: lumânarea 10 se închide la 100.00, lumânarea 11 deschide la 98.80. Pașii arată golul de 1.20 și un stop la 99.50 care nu are la ce preț să se execute acolo. Execuția la deschidere vine în 1.3.2 (L04).
  - B4 hotspot: "Tap the gap" pe un grafic de 20 de lumânări.
  - B5 explain: gap-urile apar la pauzele de sesiune, în weekend și la știri. LABX le are în Arena: event shock. Pe o piață continuă de 24 de ore sunt rare, dar salturile tot apar.
  - B6 predict: "'Gaps always fill.' True?" — "Always" / "Often, but mostly by chance" / "Never". Răspuns: a doua. Unele gap-uri nu se mai umplu, iar revizitările sunt în mare parte efectul ratei de bază (R3 §3.7).
  - B7 callout: "A normal candle tells you what noise looks like. A stop closer than one normal candle sits inside the noise (1.4.3)."
- **Try:** rigla (S3) sau tooltip-urile de range pe 10 lumânări cu range-urile 0.42, 0.38, 0.55, 0.31, 0.47, 0.36, 0.44, 0.39, 0.52, 0.36.
  - Sarcina: "Find the average range of the last ten candles."
  - Reușită: 0.42 (toleranță 0.01).
- **Practică:** Arena: event shock (un gap real); Arena: low volatility și Arena: high volatility, comparate („how big is a normal candle here?”).
- **Check:** Q1 (numeric, d1) media range-urilor; Q2 (mcq, d2) ce e un gap; Q3 (scenario, d2) „gaps always fill”.
- **Dovezi:** Mechanic (definiția gap-ului; R3 §3.7; R1 CH-13). „Gaps always fill”: D (R3 §3.7, revizitări la nivelul ratei de bază). ATR, versiunea standard a mediei de range, vine în 2.4.
- **Necesită:** S3 (rigla), opțional; sarcina merge și cu tooltip-uri.
- **Termeni noi de glosar:** `candle-range` (leagă existentul `gap`; la `range` se adaugă „Not to be confused with a candle's range”, cum propune nota L01)

#### 1.2.6 · Linear and log scale
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Compare two price moves in percentage terms rather than in price units.
  2. Explain how a log scale draws equal percentage moves as equal distances.
  3. Choose a log scale for long histories with large price changes.
- **Concepte:** log-scale (nou)
- **Se sprijină pe:** 1.2.2
- **Hook:** predict · alegere: "LABX goes from 50.00 to 100.00, then from 100.00 to 150.00. Which move was bigger?" — "The first" / "The second" / "The same". Răspuns: în procente, prima (+100% față de +50%); în preț, sunt egale (+50.00).
- **Interacțiunea centrală:**
  - B1 explain: pe scara liniară, pași egali de preț ocupă distanțe egale.
  - B2 worked: "% change = (new − old) ÷ old.", "50.00 → 100.00: +100%.", "100.00 → 150.00: ?" Răspuns: +50%.
  - B3 figure: o serie sintetică lungă, de la 20.00 la 160.00, pe scară liniară și pe scară log; pe liniar, mișcările de la început par plate.
  - B4 predict: "On a log chart, how do 50 → 100 and 100 → 200 look?" — "The second is twice as tall" / "The same height". Răspuns: aceeași înălțime.
  - B5 explain: scara log ajută la istorii lungi și la comparații între instrumente; pe câteva zile de LABX, diferența e mică.
  - B6 callout: "Thinking in percentages is how you'll think about risk: as a share of the account (1.4)."
- **Try:** comutatorul de scară log (S4) pe o serie cu trei etape: 20.00 → 40.00, 40.00 → 60.00, 60.00 → 150.00.
  - Sarcina: "Switch to log scale and pick the leg with the largest percentage move. Enter its size."
  - Reușită: etapa 3, +150% (etapa 1: +100%; etapa 2: +50%).
- **Practică:** laborator: o serie sintetică de 10 ani, pe care utilizatorul comută scara (S4).
- **Check:** Q1 (numeric, d1) o schimbare procentuală; Q2 (mcq, d2) ce arată scara log; Q3 (scenario, d2) ce scară alegi pentru o comparație pe 20 de ani.
- **Dovezi:** Mechanic (R1 CH-04).
- **Necesită:** S4 (scara log).
- **Termeni noi de glosar:** `log-scale`, `linear-scale`

#### 1.2.7 · What a chart can't tell you
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. List what a price chart records and what it leaves out: who traded, why, the order inside a candle, the future.
  2. Recognise hindsight in chart examples that already show the outcome.
  3. Ask the base-rate question before trusting a pattern seen on a chart.
- **Concepte:** chart-limits (nou), hindsight-bias (nou)
- **Se sprijină pe:** 1.2.5, 0.2.5
- **Hook:** predict · alegere, pe un grafic „de manual”: suportul a ținut de trei ori, apoi prețul a sărit. "Would you have bought at the third touch?" — "Yes" / "No" / "Can't tell without other examples". Reveal: alte 5 grafice cu aceeași formă, la care a treia atingere a cedat. Răspuns: „Can't tell without other examples”: exemplul a fost ales după rezultat.
- **Interacțiunea centrală:**
  - B1 explain: un grafic înregistrează prețul și volumul în timp. Nu arată cine a tranzacționat, de ce, ordinea din interiorul unei lumânări sau lumânarea următoare.
  - B2 figure „The right edge”: același grafic tăiat la lumânarea 30 și apoi întreg. Cu tot graficul, întoarcerea pare evidentă; la lumânarea 30 nu era (hindsight bias, R5 PSY-13).
  - B3 predict la marginea din dreapta: "Up / Down / Sideways", apoi reveal; feedback-ul vorbește despre proces („your reasoning used…”), nu despre noroc.
  - B4 match, afirmație ↔ „poate spune graficul?”: "Where price traded" ↔ Yes; "How much traded" ↔ Yes (volume); "Who bought and why" ↔ No; "Whether the high came before the low" ↔ No (L01); "What happens next" ↔ No.
  - B5 explain: exemplele din manuale și de pe rețele sunt alese după ce s-a știut rezultatul (R1 §4.5), iar graficele aleatoare desenează și ele forme (0.2.5).
  - B6 callout: "The evidence question for anything you see on a chart: how often, on how many charts, after costs, compared with random?"
- **Try:** `blind-replay` (widget nou): 5 grafice tăiate la un punct de decizie. Utilizatorul alege direcția și încrederea (50–90%) înainte de reveal.
  - Sarcina: "Make five calls with a confidence, then reveal each one."
  - Reușită: 5 predicții cu încredere (sarcină de proces). La final, aplicația arată rata de nimereală față de 50% și calibrarea încrederii.
- **Practică:** R0 (S7), în `blind-replay`; Arena: reversal.
- **Check:** Q1 (mcq, d1) ce nu înregistrează un grafic; Q2 (scenario, d2) un exemplu ales după rezultat; Q3 (mcq, d2) întrebarea de dovezi.
- **Dovezi:** Mechanic (conținutul unui grafic). Hindsight bias: B (Fischhoff 1975; R5 PSY-13). Pattern-urile clasice, „hindsight bias is severe”: C/D (R6 §2.7.1).
- **Necesită:** S7 pentru practica pe R0; widget-ul folosește serii din conținut.
- **Termeni noi de glosar:** `hindsight-bias`, `cherry-picking`

---

## Unitatea 1.3 · Orders and execution

- **Scop:** ordinele de bază și execuția lor: market și limit; stop-loss și take-profit; stop de intrare și stop-limit; bracket și OCO; time in force; execuții, execuții parțiale și coada de ordine; slippage și gap; trailing stop.
- **De ce aici:** după prețuri (1.1) și grafic (1.2), utilizatorul poate prezice o execuție. R1 §3.3 („stops are not guaranteed”, gap-urile nearătate) și §4.7 (microstructura ignorată) cer ca slippage-ul și gap-ul să fie arătate devreme; R5 §10 Nivelul 1, punctul 8 (TM-01, TM-04, TM-12). Ordinele de ieșire vin înaintea riscului (1.4), pentru că riscul pornește de la stop.
- **Cere de dinainte:** 1.1 (bid, ask, costuri), 1.2.5 (gap-ul, mărimea normală a lumânării).
- **Checkpoint:** `test-order_types` (q-ot-1 … q-ot-11) + 12 întrebări noi pentru 1.3.3–1.3.8. La ≥ 80%, cele 8 lecții se marchează „Tested out”.
- **Laboratorul unității:** „Order desk”, propus ca misiunea de final care lipsea la U1 (D10): 6 planuri scrise, fiecare cu ordinul lui (market, limit, stop de intrare, OCO, bracket cu time in force, trailing stop). Utilizatorul alege și plasează ordinul, apoi graficul rulează. Scorul e potrivirea ordinului cu planul, nu rezultatul.
- **Firele din spirală:** Risc (stop-ul nu e un preț garantat; gap-ul exprimat în R; expunerea decide pierderea dintr-un gap), Costuri (slippage-ul).
- **Surse:** R1 OX-01 … OX-08, OX-14, §3.3, §4.7; R3 §1.4, §2.1–§2.8, §2.11–§2.14; R5 TM-01, TM-04, TM-06, TM-12, RF-04, RF-20; R6 §5.2.
- **Lecții existente:** L03 → 1.3.1 și L04 → 1.3.2, fără schimbări de conținut. L04 se sprijină acum și pe 1.2.5 (gap-ul). D4 (trailing stop nepredat) se închide prin 1.3.8: conceptul `trailing-stop` trece de la L10 la 1.3.8, iar beat-ul propus în L10 nu mai e necesar. D10 primește propunerea „Order desk”.
- **Widget-uri noi și extinderi:** `order-blotter`, `order-book-lite` (S8); `order-fill` primește tipurile Stop și Stop-limit; `bracket-builder` primește OCO, partea de short și modul trailing pe checkpoint-uri; `position-size` primește rândul „Gap scenario”.

#### 1.3.1 · Market and limit orders  ·  `L03`
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Choose between a market order and a limit order for a given plan.
  2. Predict the fill price of a market order from the bid and the ask.
  3. Explain when a buy limit or a sell limit can fill.
- **Concepte:** market-order ✓, limit-order ✓, slippage ✓
- **Se sprijină pe:** 1.1.1
- **Hook:** predict · slider 98.80–99.20, pas 0.05: "LABX is at 100.00 on the chart. You leave an order to buy at 99.00 or lower. How low must the chart price go before it fills?" Răspuns: 98.95, mid-ul la care ask-ul ajunge la 99.00; greșeala așteptată e 99.00.
- **Interacțiunea centrală:**
  - B2 figure `market-vs-limit`: market buy la ask, 100.05; buy limit la 99.00, cu două drumuri: unul coboară la 98.90 (executat la 99.00), celălalt urcă (neexecutat).
  - B5 match, plan ↔ ordin (4 perechi: "Get in now", "Buy only on a dip to 99.50", "Sell only at 102.00 or higher", "Get out now").
  - B6 reveal „Same idea, two orders”: limita la 99.00 nu se execută (ask-ul coboară doar la 99.15), iar market buy-ul merge până la 103.00. Ratarea e costul cunoscut al unei limite, nu o greșeală.
  - B7 callout despre chasing: anulezi limita și cumperi la market, mai sus.
- **Try:** `order-fill` (widget nou din widgets.md): plan "Buy 30 LABX only if price drops to 99.00 or lower." Reușită: Buy · Limit · 99.00, evaluată la „Place order”; rezultatul jocului nu intră în condiție. Cu ordinul corect, execuția vine în ora 6, la 99.00.
- **Practică:** M06 The FOMO Trap; Arena: sideways (ordine limit la marginile range-ului).
- **Check:** q-ot-1, q-ot-2, q-ot-8.
- **Dovezi:** Mechanic (R3 §2.1, §2.2; R5 TM-01; R1 OX-01, OX-02). Selecția adversă a limitelor (se execută mai des când prețul continuă împotrivă): [BK], previzualizare pentru 3.2.
- **Necesită:** — (widget nou `order-fill`).
- **Termeni noi de glosar:** — (toți există: `fill`, `market-order`, `limit-order`, `slippage`, `notional-value`)

#### 1.3.2 · Stop-loss and take-profit orders  ·  `L04`
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Place a stop-loss where the trade idea is proven wrong rather than at an arbitrary distance.
  2. Explain why a stop can fill at a worse price than the stop after a gap.
  3. Set a take-profit that follows from the plan.
- **Concepte:** stop-loss-order ✓, gap-risk ✓, bracket-order ✓, invalidation-level ✓ (introdus aici, predat complet în 1.4.3)
- **Se sprijină pe:** 1.3.1, 1.1.1, 1.2.5
- **Hook:** predict · tragere pe grafic: "You buy LABX at 100.00 because support near 98.00 has held three times. Drag the line to where you'd get out if you're wrong." Fără răspuns unic; recap-ul compară nivelul ales cu zona de suport 97.90–98.10 și cu reperul 97.70.
- **Interacțiunea centrală:**
  - B3 worked „A gap through the stop”: 25 de unități, intrare 100.00, stop 96.00, bid-ul deschide la 94.00 → pierdere 150.00, cu 50.00 peste plan.
  - B4 figure `stop-placement`: un stop la 97.95, în zona de suport, e executat de o înțepătură la 97.94, după care prețul urcă la 101.40; un stop la 97.70, dincolo de zonă, nu e atins. Stop-ul se poate trage pe drumul dezvăluit.
  - B6 worked „A bracket, measured in R”: 40 de unități, intrare 100.00, stop 99.00, țintă 102.00 → +2R.
  - B7 callout: stop-ul se mută doar în direcția care reduce riscul.
- **Try:** `bracket-builder` (widget nou): "Your idea: support near 98.00 holds and price returns to resistance near 104.00. Place the stop just beyond support and the target at resistance." Reușită: 97.40 ≤ stop ≤ 97.80 și 103.60 ≤ țintă ≤ 104.00. Show me: 97.70 / 103.80 (−57.50 / +95.00, 1.65R; cu comisioane −59.98 / +92.45).
- **Practică:** M04 Define Your Risk; M07 Stop or Stay?; Arena: event shock.
- **Check:** q-ot-6, q-ot-7, q-ot-9.
- **Dovezi:** Mechanic (R3 §2.3, §2.6, §2.7, §2.14; R5 RF-06, RF-20).
- **Necesită:** — (widget nou `bracket-builder`).
- **Termeni noi de glosar:** — (toți există; propun `lesson: "L04"` pentru `long`, `entry`, `exit`, `bracket-order`, `stop-order`, ca în issues-and-decisions B)

#### 1.3.3 · Stop entries and stop-limit orders
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Place a buy stop above the price to enter only if a level breaks.
  2. Predict where a stop entry fills when price gaps through its trigger.
  3. Explain why a stop-limit can leave you unfilled, or unprotected, in a gap.
- **Concepte:** stop-entry-order (nou), stop-limit-order (nou)
- **Se sprijină pe:** 1.3.2
- **Hook:** predict · alegere: "LABX is ranging below 102.00. You want to buy only if price breaks above it. Which order?" — "Buy limit at 102.10" / "Buy stop at 102.10" / "Market buy now". Răspuns: buy stop. Un buy limit peste ask se execută imediat, la ask (regula din L03); asta e capcana. Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: un ordin stop de intrare devine ordin market când prețul atinge declanșatorul. Buy stop-ul stă deasupra prețului, sell stop-ul dedesubt; la limite e invers.
  - B2 figure: cele patru ordine în jurul prețului, ca matrice 2 × 2: buy limit dedesubt, buy stop deasupra, sell limit deasupra, sell stop dedesubt.
  - B3 match, plan ↔ ordin: "Buy only if price breaks above the range" ↔ Buy stop; "Buy only on a dip" ↔ Buy limit; "Go short only if price breaks below support" ↔ Sell stop; "Sell only into a rally" ↔ Sell limit.
  - B4 worked „A stop entry in a gap”: "Buy stop at 102.10: it triggers when the ask reaches 102.10, then fills at market.", "The next candle opens with the mid at 102.60, so the ask is 102.65.", "Slippage per unit: 102.65 − 102.10 = 0.55.", "For 30 units: 30 × 0.55 = ?" Răspuns: 16.50.
  - B5 explain: un stop-limit are un declanșator și o limită. Cu declanșatorul la 102.10 și limita la 102.30, o deschidere cu ask-ul la 102.65 nu se execută. Folosit ca stop de protecție, poate lăsa poziția deschisă într-un gap (R3 §2.4).
  - B6 predict: "A sell stop-limit protects your long: trigger 98.00, limit 97.80. Price gaps to 97.20. What happens?" — "Sold at 97.80" / "Sold at 97.20" / "Not sold: the position stays open". Răspuns: a treia.
  - B7 callout: "Protective stops should be stop-market orders. Use stop-limits only for entries, where missing the trade is acceptable."
- **Try:** `order-fill`, extins cu tipurile Stop și Stop-limit (S1): plan "Buy 30 LABX only if price breaks above the range high, 102.00. Trigger 0.10 beyond it." Seria viitoare (din conținut) sare peste declanșator la deschiderea orei 7.
  - Reușită: Buy · Stop · 102.10. După joc, panoul arată execuția la ask-ul de la deschidere și slippage-ul.
  - Feedback: buy limit la 102.10 → "A buy limit above the ask fills at once, at the ask. It doesn't wait for the break."; market → "That buys now, inside the range, before any break."; stop-limit → acceptat, cu nota "It may not fill if price jumps past your limit."
- **Practică:** Arena: breakout, cu ordine stop de intrare (S1).
- **Check:** Q1 (mcq, d1) ce ordin intră pe un breakout; Q2 (numeric, d2) slippage-ul unui stop de intrare într-un gap; Q3 (scenario, d2) un stop-limit folosit ca stop de protecție într-un gap.
- **Dovezi:** Mechanic (R3 §2.3, §2.4, exemplul SEC; R5 TM-01).
- **Necesită:** S1 (ordine stop de intrare și stop-limit).
- **Termeni noi de glosar:** `stop-limit-order`, `trigger` (leagă existentul `stop-order`)

#### 1.3.4 · Brackets and OCO orders
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Describe the life of a bracket: entry pending, entry filled, stop and target active, one fills, the other is cancelled.
  2. Set up an OCO pair that enters on a break in either direction.
  3. Spot an orphaned order left behind after a manual exit.
- **Concepte:** oco-order (nou), bracket-order ✓
- **Se sprijină pe:** 1.3.3
- **Hook:** predict · alegere: "Your long's target fills at 104.00. Its stop at 98.00 is still listed. Price later falls to 98.00. What happens?" — "It sells, opening a short" / "Nothing: it was cancelled when the target filled" / "It closes the long a second time". Răspuns: într-un bracket, stop-ul a fost anulat odată cu execuția țintei. Dacă ar fi fost două ordine separate, stop-ul ar fi deschis un short. Recap: "In a bracket the other leg is cancelled. Separate orders don't know about each other."
- **Interacțiunea centrală:**
  - B1 explain: recapitularea bracket-ului din L04 (stop și țintă atașate unei intrări); OCO = două ordine legate, iar execuția unuia îl anulează pe celălalt.
  - B2 figure `Flow`, starea unui bracket: Pending entry → Filled → Stop and target active → Target fills → Stop cancelled (sau Stop fills → Target cancelled).
  - B3 order: utilizatorul pune în ordine cei 5 pași ai bracket-ului.
  - B4 explain: OCO pentru intrări: un buy stop deasupra range-ului și un sell stop dedesubt; când unul se execută, celălalt dispare. Riscuri: într-o piață rapidă se pot executa amândouă dacă nu sunt legate; execuțiile parțiale pe un picior nu reduc întotdeauna celălalt picior (R3 §2.7).
  - B5 predict: "You close a long by hand but leave its separate sell stop at 98.00. Days later price drops through 98.00. What is your position?" — "Flat" / "Short" / "Long". Răspuns: short (ordin orfan).
  - B6 callout: "After any manual exit, check the order list. A forgotten order is a trade you didn't decide."
- **Try:** `bracket-builder`, extins cu OCO și partea de short (S1).
  - Sarcina: "LABX ranges between 99.00 and 101.00. Set an OCO: a buy stop at 101.10 and a sell stop at 98.90, each with its stop at the middle of the range, 100.00."
  - Reușită: ambele picioare plasate și legate; stop-ul long-ului la 100.00, sub intrare; stop-ul short-ului la 100.00, deasupra intrării.
  - Feedback dacă picioarele nu sunt legate: "Without the link, both could fill in a whipsaw."
- **Practică:** Arena: breakout, cu OCO (S1).
- **Check:** Q1 (mcq, d1) ce înseamnă OCO; Q2 (scenario, d2) ce se întâmplă cu un bracket când ținta se execută; Q3 (scenario, d2) ordinul orfan.
- **Dovezi:** Mechanic (R3 §2.7; R6 §5.2; R1 OX-04).
- **Necesită:** S1 (OCO, intrări stop în așteptare).
- **Termeni noi de glosar:** `oco-order`, `pending-order`

#### 1.3.5 · Time in force
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Choose between day, good-till-cancelled and good-till-date for a resting order.
  2. Predict what IOC and FOK do with an order larger than what's available.
  3. Explain the risk of a forgotten good-till-cancelled order.
- **Concepte:** time-in-force (nou)
- **Se sprijină pe:** 1.3.4
- **Hook:** predict · alegere: "Three weeks ago you left a buy limit at 95.00, good till cancelled, and forgot it. Today LABX gaps from 97.00 to 94.50 on bad news. What happens?" — "Nothing: it expired" / "It fills at 94.55" / "It fills at 95.00". Răspuns: se execută la ask-ul de la deschidere, 94.55 (o limită sărită de un gap se execută la un preț mai bun), iar acum deții o poziție pe care n-ai mai plănuit-o.
- **Interacțiunea centrală:**
  - B1 explain: time in force spune cât trăiește un ordin: Day (până la sfârșitul sesiunii), GTC (până îl anulezi; brokerii pun adesea o limită de 60–90 de zile [BK]), GTD (până la o dată), IOC (ce se poate executa acum, restul se anulează), FOK (tot acum sau nimic) (R3 §2.8).
  - B2 match, 5 perechi TIF ↔ înțeles.
  - B3 worked „IOC”: "Buy 500 at a limit of 100.05, IOC.", "Only 320 are offered at 100.05 or better.", "Filled now: 320.", "Cancelled = ?" Răspuns: 180. După răspuns: "With FOK, nothing would fill."
  - B4 explain: în LABX, ordinele în așteptare rămân până se execută sau sunt anulate (cel mult 5 ordine în așteptare în motor). „Day” are nevoie de ceasul sesiunii (S5, Nivelul 2).
  - B5 callout: "Every resting order is a decision that will execute later without you. Review your open orders at the start of each session."
- **Try:** `order-blotter` (widget nou, S1): trei planuri, fiecare cu un ordin la care se alege TIF-ul.
  - Planurile: "Buy on a dip to 99.00, today only" → Day; "Take profit at 104.00 whenever it comes" → GTC; "Buy 200 at 100.05 right now, only what's available" → IOC.
  - Reușită: toate trei corecte. După reușită, o redare de 3 zile arată ce s-ar fi întâmplat cu un GTC uitat.
- **Practică:** laboratorul `order-blotter`, cu redarea de 3 zile (S1, S5).
- **Check:** Q1 (mcq, d1) Day vs GTC; Q2 (numeric, d2) o execuție IOC parțială; Q3 (scenario, d2) un GTC uitat înaintea unui gap.
- **Dovezi:** Mechanic (R3 §2.8; R1 OX-06). Plafoanele GTC ale brokerilor: [BK].
- **Necesită:** S1 (time in force), S5 (sfârșitul sesiunii, pentru ordinele Day).
- **Termeni noi de glosar:** `time-in-force`, `day-order`, `gtc`, `ioc`, `fok`

#### 1.3.6 · Fills, partial fills and the queue
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Explain price-time priority in an order book.
  2. Predict whether a resting limit order fills when price only touches its level.
  3. Calculate the average price of an order filled across several price levels.
- **Concepte:** order-queue (nou)
- **Se sprijină pe:** 1.3.5
- **Hook:** predict · alegere: "Your buy limit sits at 99.00 with 300 units queued ahead of you. Sellers trade 200 units at 99.00, then price rises. Were you filled?" — "Yes" / "No" / "Partly". Răspuns: nu; mai erau 100 de unități înaintea ta.
- **Interacțiunea centrală:**
  - B1 explain: cartea de ordine are cozi de ordine limită la fiecare preț. Întâi prețul cel mai bun, apoi ordinul cel mai vechi (price-time priority) (R3 §1.4, §2.12).
  - B2 figure, scara L2: ask-uri 100.05 (100), 100.10 (100), 100.15 (300); bid-uri 99.95 (150), 99.90 (200), 99.85 (400); un indicator arată locul unui ordin în coadă.
  - B3 worked „Walking the book”: "Market buy of 300 units.", "100 at 100.05, 100 at 100.10, 100 at 100.15.", "Average price = (10,005.00 + 10,010.00 + 10,015.00) ÷ 300 = ?" Răspuns: 100.10.
  - B4 explain: execuțiile parțiale: o limită se poate executa pe bucăți, iar restul așteaptă; IOC anulează restul (1.3.5). LABX execută azi tot ordinul la un singur preț, fără adâncime; cartea de ordine simulată vine cu S8, iar 3.2 aprofundează.
  - B5 predict: "Price touched your limit. Are you filled?" — "Always" / "Not necessarily". Răspuns: nu neapărat. În LABX, ask-ul trebuie să ajungă la limita de cumpărare (L03); într-o carte reală trebuie să se tranzacționeze și coada din fața ta.
  - B6 callout: "A price on the chart isn't a promise of a fill. Size and the queue decide what you get."
- **Try:** `order-book-lite` (widget nou, S8): cartea din B2.
  - Sarcina: "Before sending a market buy of 300 units into this book, enter the average price you expect. Then send it."
  - Reușită: 100.10 (toleranță 0.005); după trimitere, execuțiile apar nivel cu nivel.
- **Practică:** laboratorul `order-book-lite` (S8).
- **Check:** Q1 (mcq, d1) price-time priority; Q2 (numeric, d2) prețul mediu de execuție; Q3 (scenario, d2) o limită atinsă, dar neexecutată.
- **Dovezi:** Mechanic (R3 §1.4, §2.11, §2.12).
- **Necesită:** S8 (cartea de ordine, coada, execuțiile parțiale).
- **Termeni noi de glosar:** `queue-priority`, `average-fill-price`, `market-depth` (leagă existenții `order-book`, `partial-fill`, `liquidity`; propun `lesson: "1.3.6"` pentru `order-book` și `partial-fill`)

#### 1.3.7 · Slippage and gaps
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Measure slippage as the difference between the expected and the actual fill.
  2. Express a gap-through-stop loss in R.
  3. Size a position so that a plausible gap is still survivable.
- **Concepte:** slippage ✓, gap-risk ✓
- **Se sprijină pe:** 1.3.2, 1.3.6
- **Hook:** predict · alegere: "Long 50 at 100.00 with a stop at 98.00: 100.00 at risk, 1R, before costs. The market gaps and the stop fills at 97.00. What's the result in R?" — "−1R" / "−1.5R" / "−3R". Răspuns: −1.5R (150.00 ÷ 100.00).
- **Interacțiunea centrală:**
  - B1 explain: slippage-ul e diferența dintre execuția așteptată și cea reală; poate fi negativ sau pozitiv. Reperul trebuie spus: prețul de decizie sau prețul de declanșare (R3 §2.13).
  - B2 figure, trei cazuri: un ordin market într-o lumânare rapidă; un stop într-un gap; o limită (fără slippage negativ, dar poate să nu se execute).
  - B3 worked: "Planned: 50 × 2.00 = 100.00, or 1R.", "Filled at 97.00: 50 × 3.00 = 150.00.", "In R: 150.00 ÷ 100.00 = ?" Răspuns: 1.5, afișat −1.5R.
  - B4 predict „Same R, different gap”: "Trade A: 50 units, stop 2.00 away. Trade B: 200 units, stop 0.50 away. Both risk 100.00. A gap opens 3.00 below both entries. Which loses more?" — "A" / "B" / "The same". Răspuns: B, 200 × 3.00 = 600.00 (−6R), față de A, 150.00 (−1.5R). Pierderea dintr-un gap urmează mărimea poziției, nu R-ul (1.4.7).
  - B5 explain: unii brokeri de CFD vând stop-uri garantate, contra unei prime (R3 §2.14); un stop-limit nu e o garanție (1.3.3).
  - B6 callout: "A stop limits the loss you plan for, not the worst case. Size so that a plausible gap is still survivable."
- **Try:** `position-size`, extins cu rândul „Gap scenario”.
  - Sarcina: "Long at 100.00, stop at 99.00. Find the most units for which a gap to 97.00 still costs no more than 200.00, commissions included."
  - Reușită: 64 de unități (198.31; cu 65, 201.41). Pierderea la stop-ul planificat, pentru 64 de unități, e 70.37, sub 1%.
  - Indicii: 1. "The gap loss is units × (100.00 − 97.00), plus both commissions." 2. "Without commissions, 66 units lose 198.00." 3. "Add the commissions and step down until the total fits."
- **Practică:** Arena: event shock (stop obligatoriu, risc 1%).
- **Check:** Q1 (numeric, d1) slippage-ul pe unitate; Q2 (numeric, d2) pierderea dintr-un gap, în R; Q3 (scenario, d2) care dintre două trade-uri cu același R suferă mai mult într-un gap.
- **Dovezi:** Mechanic (R3 §2.13, §2.14; R5 RF-04, RF-20; R1 §3.3, „stops are not guaranteed”).
- **Necesită:** — (gap-ul există în Arena: event shock; rândul nou e o extindere de widget).
- **Termeni noi de glosar:** `guaranteed-stop`

#### 1.3.8 · Trailing stops
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Move a stop only in the direction that reduces risk.
  2. Compare a tight trail, a wide trail and a structure trail on the same price path.
  3. Explain why a trail tighter than a normal candle tends to exit on noise.
- **Concepte:** trailing-stop ✓
- **Se sprijină pe:** 1.3.2, 1.2.5
- **Hook:** predict · alegere: "Long from 100.00, stop at 98.00. Price has climbed to 104.00, making higher lows along the way. Where should the stop be now?" — "Still at 98.00" / "Below the last higher low" / "Lower, to give it room". Nu se notează, cu o excepție: „Lower” primește feedback-ul "A stop never moves further away. That only raises the risk you agreed to."
- **Interacțiunea centrală:**
  - B1 explain: un trailing stop urmează prețul în favoarea trade-ului și nu se întoarce niciodată (glosarul; decizia D4).
  - B2 figure: un singur drum: 100.00 → 101.20, revenire la 100.70 → 102.50, revenire la 101.60 → 103.80, revenire la 102.90 → 104.60 → cădere la 102.00. Trei trail-uri: strâns, la 0.50 (ieșire la 100.70, +0.70 pe unitate); larg, la 1.50 (ieșire la 103.10, +3.10); pe structură, cu 0.20 sub fiecare higher low (ieșire la 102.70, +2.70).
  - B3 predict: "Which trail kept the most on this path?" — "Tight" / "Wide" / "Structure". Răspuns: cel larg. Text după: "On a path that turns right after the high, the tight trail keeps more. No trail wins everywhere."
  - B4 explain: distanța trail-ului față de lumânarea normală (1.2.5): un trail mai strâns de aproximativ o lumânare normală tinde să iasă pe zgomot (R3 §2.5; R5 TM-06).
  - B5 explain: azi, în MARKET//LAB, trail-ul se face mutând stop-ul de mână. Motorul acceptă un stop mutat mai aproape și marchează unul mutat mai departe (`moved_stop_away`). Ordinele trailing automate vin cu S1.
  - B6 callout: "A trail is a rule you decide before entry. Trailing on feelings is a discretionary exit (2.7)."
- **Try:** `bracket-builder` în modul trailing: o redare cu 3 opriri, câte una după fiecare higher low.
  - Sarcina: "Move the stop up as the trade progresses, never away, keeping it 0.10 to 0.40 under each new higher low."
  - Reușită: după higher low-ul de la 100.70, stop-ul între 100.30 și 100.60; după 101.60, între 101.20 și 101.50; după 102.90, între 102.50 și 102.80; fiecare cel puțin la nivelul celui dinainte.
- **Practică:** Arena: bullish (trail manual); ordinul automat, după S1.
- **Check:** Q1 (mcq, d1) ce nu are voie să facă niciodată un trailing stop; Q2 (scenario, d2) un trail mai strâns decât o lumânare normală; Q3 (numeric, d2) ieșirea unui trail dat pe un drum dat.
- **Dovezi:** Mechanic (definiția; R3 §2.5). Dacă trail-ul îmbunătățește expectancy depinde de regim: C (R5 TM-06); se aprofundează în 2.7.
- **Necesită:** S1 (ordinul trailing stop).
- **Termeni noi de glosar:** — (leagă existentul `trailing-stop`; propun `lesson: "1.3.8"`; conceptul `trailing-stop` trece de la L10 la 1.3.8)

---

## Unitatea 1.4 · Risk comes first

- **Scop:** riscul pe trade, R, stop-ul la invalidare, dimensionarea cu costuri, R:R și expectancy, costurile ca parte din risc, expunerea și levierul, drawdown-ul, limita zilnică.
- **De ce aici:**
  - riscul vine înaintea structurii și a strategiilor (README §1, principiul 1; R1 §3.2, principiul 8, și §4.2; R5 §10 Nivelul 1, punctele 4–7 și 9). Fiecare citire de structură din 1.5 se termină astfel cu un stop și o mărime;
  - L09 = 1.4.4 e fixat în README (§2, §10), iar L08 (1.4.1) nu acoperă „capitalul de risc” din descrierea unității. Capitalul de risc trece în planul v1 (1.6.2), unde utilizatorul îl calculează pentru propriul profil și unde are cel mai mult sens (R5 PL-01, componenta 1).
- **Cere de dinainte:** 1.1 (costuri, break-even), 1.2.5 (lumânarea normală, gap-ul), 1.3.2 (stop-loss, take-profit, R ca raport), 1.3.7 (gap în R), 0.2.2–0.2.3 (EV, serii).
- **Checkpoint:** `test-risk_management`, `test-stop_loss`, `test-position_sizing`, `test-portfolio_exposure`, fără întrebările L16 (q-ta-12, q-ta-13, q-rm-8 … q-rm-10, q-sl-9), care urcă la 2.4; plus 8 întrebări noi pentru 1.4.2, 1.4.6, 1.4.8 și 1.4.9. La ≥ 80%, cele 9 lecții se marchează „Tested out”.
- **Laboratorul unității:** M04 Define Your Risk și M05 Size Matters (există); „Risk budget day”: o zi de 24 de lumânări în Arena, cu limita zilnică de 3R activă (S18) și jurnalul în R.
- **Firele din spirală:** Risc (centrul unității), Statistică (expectancy, break-even înainte și după costuri, seriile aplicate la drawdown și la limita zilnică), Costuri (costul ca parte din R).
- **Surse:** R5 RF-02 … RF-07, RF-10, RF-16, RF-21, PR-04, PR-06, PR-07, PR-11, PM-01, PM-03, ST-06, TM-12; R6 §4.5, §5.1; R1 RM-01 … RM-08, §3.3, §4.2.
- **Lecții existente și ce se schimbă în trimiteri:**
  - L08 → 1.4.1: în feedback-ul de la B5, „The next lesson covers the stop; the one after, the size.” devine „The next lessons cover R, the stop and the size.”;
  - L10 → 1.4.3: „Se sprijină pe” L05 și L06 devine 1.2.5 (lumânarea normală) și 1.3.2 (suportul din L04); în B1, „in Unit 1” devine „in 1.3”;
  - L09 → 1.4.4 și L11 → 1.4.5: trimiterile „in the last lesson” rămân corecte (L10 vine imediat înaintea L09, iar L09 imediat înaintea L11);
  - L12 → 1.4.7: „Pregătește L16” devine 2.4;
  - L16 urcă la 2.4 (README §9).
- **Widget-uri noi și extinderi:** `r-journal`, `decision-replay` (redare cu puncte de decizie, refolosită în 1.7.5, 1.7.7 și în Capstone 1); `risk-reward` primește câmpul „Costs per unit” și rândul „Break-even after costs”; `loss-recovery` primește modul „streak at r%”.

#### 1.4.1 · Risk per trade  ·  `L08`
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Set a maximum loss before entering a trade.
  2. Convert a percentage risk limit into vUSD using the current account value.
  3. Explain why small, fixed risk keeps a losing run recoverable.
- **Concepte:** risk-per-trade ✓, fixed-fractional-sizing ✓, drawdown ✓, r-multiple ✓
- **Se sprijină pe:** 1.1.1, 1.3.2
- **Hook:** predict · slider +10% … +200%, pas 10: "Your account falls 50%, from 10,000.00 to 5,000.00. What gain do you need to get back to 10,000.00?" Răspuns: +100%; intuiția obișnuită e +50%.
- **Interacțiunea centrală:**
  - B2 predict „Risk or position value?”: 40 de unități la 50.00, stop 48.50 → riscul e 60.00 plus costuri (61.97 cu ambele comisioane), nu 2,000.00.
  - B3 figure `Formula`: 10,000.00 × 1% = 100.00 (misiuni); × 2% = 200.00 (Arena).
  - B4 worked: 1% din 9,500.00 = 95.00 (bugetul urmează contul de acum).
  - B5 order „Before any trade”: limita în procente → bugetul în vUSD → prețul de invalidare și stop-ul → mărimea.
  - B6 figure `loss-recovery`: −10% / +11.1%, −20% / +25%, −50% / +100%.
  - B7 predict „Ten losses in a row”: la 5% pe trade rămân 5,987.37; la 1%, 9,043.82.
- **Try:** `loss-recovery`: "Find the deepest drawdown you could still recover from with a gain of 25% or less." Reușită: 20% (la 21%, +26.6%).
- **Practică:** M04 Define Your Risk; Risk calculator (`/arena/risk-calculator`).
- **Check:** q-rm-1, q-rm-3, q-rm-11.
- **Dovezi:** Mechanic (R5 RF-02, PR-07; R1 RM-01, RM-02).
- **Necesită:** —
- **Termeni noi de glosar:** — (toți există; propun `lesson: "L08"` pentru `drawdown` și `equity`, ca în issues-and-decisions B)

#### 1.4.2 · R: one unit for every trade
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Calculate 1R from the entry, the stop, the size and the costs.
  2. Express any trade result as an R-multiple.
  3. Explain why R is fixed at entry and doesn't change when a stop is moved.
- **Concepte:** r-multiple ✓, initial-risk (nou)
- **Se sprijină pe:** 1.4.1, 1.3.2
- **Hook:** predict · alegere: "Trade A risked 100.00 and made 150.00. Trade B risked 400.00 and made 300.00. Which did better for what it risked?" — "A" / "B" / "The same". Răspuns: A, +1.5R față de +0.75R. Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: R e pierderea dacă se execută stop-ul inițial, cu costuri: unități × distanța până la stop, plus ambele comisioane (`riskAmount` din motor). L04 a folosit R ca raport, L08 l-a numit 1R; aici devine unitatea de măsură a oricărui trade.
  - B2 worked: "40 units at 50.00, stop 48.50: 40 × 1.50 = 60.00 before costs (61.97 with both commissions, as in 1.4.1).", "Exit at 53.00: 40 × 3.00 = 120.00 before costs.", "Result in R, before costs = ?" Răspuns: +2R. După răspuns: "With costs: +117.94 on a 1R of 61.97, so +1.90R."
  - B3 match, rezultat ↔ R-multiple: "Stopped exactly as planned" ↔ −1R; "Target at twice the stop distance" ↔ +2R; "A gap fills the stop 25% further away" ↔ −1.25R; "Closed at the entry price" ↔ "Slightly below 0R, after costs".
  - B4 predict: "You moved the stop from 48.50 to 47.00 and were stopped there. What's the result in R?" — "−1R" / "−2R" / "Can't say". Răspuns: −2R. R rămâne cel inițial, 60.00, iar pierderea a fost 120.00 înainte de costuri (R5 RF-03, TM-12; motorul păstrează `initialRisk`).
  - B5 explain: de ce R: compară trade-uri de orice mărime și din orice cont. Jurnalul, expectancy-ul (1.4.5) și scorurile vorbesc în R; rezultatele în bani variază cu mărimea, cele în R nu.
  - B6 callout: "A trade without a stop has no R: its risk is undefined. That's why every entry needs one."
- **Try:** `r-journal` (widget nou): un tabel cu 6 trade-uri (unități, intrare, stop, ieșire) și coloana R goală, înainte de costuri.
  - Rândurile: 50 u, 100.00 / 98.00, ieșire 104.00 → +2.00R; 25 u, 100.00 / 96.00, ieșire 96.00 → −1.00R; 80 u, 50.00 / 48.75, ieșire 51.25 → +1.00R; 40 u, 50.00 / 48.50, ieșire 47.00 după un gap → −2.00R; 100 u, 20.00 / 19.60, ieșire 20.20 → +0.50R; 30 u, 75.00 / 73.00, ieșire 75.00 → 0.00R.
  - Reușită: toate 6 corecte (toleranță 0.01). Feedback final: "Notice that the units never mattered for R."
- **Practică:** Arena: bullish (jurnalul arată R pentru fiecare trade).
- **Check:** Q1 (numeric, d1) R-multiple-ul unui rezultat; Q2 (numeric, d2) 1R cu costuri; Q3 (scenario, d2) un stop mutat și R-ul inițial.
- **Dovezi:** Mechanic (R5 RF-03, RF-04; R1 RM-07).
- **Necesită:** S15 (coloana R din Journal există doar parțial azi).
- **Termeni noi de glosar:** `initial-risk` (leagă existenții `r`, `r-multiple`)

#### 1.4.3 · Where a stop belongs  ·  `L10`
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Place a stop where the trade idea is invalidated.
  2. Tell a stop inside normal noise from one beyond a meaningful level.
  3. Adjust the position size, not the stop, to keep risk within the limit.
- **Concepte:** invalidation-level ✓, stop-loss-order ✓, support-and-resistance ✓, gap-risk ✓
- **Se sprijină pe:** 1.4.1, 1.3.2, 1.2.5
- **Hook:** predict · tap pe 4 niveluri (49.50, 48.40, 48.00, 45.00): "You bought LABX at 50.00 because support at 48.40 held. A normal candle moves about 0.40. Tap where your stop belongs." Răspuns: 48.00, dincolo de suport, cu o lumânare normală ca buffer.
- **Interacțiunea centrală:**
  - B3 figure `stop-placement`: suportul la 48.40, zona „normal swings” 49.38–50.00, stop-ul „too tight” la 49.50, stop-ul „beyond the level” la 48.00, bufferul de 0.40; stop-ul se trage live, cu etichete pe intervale.
  - B4 match „Four ways to misplace a stop”: too tight, arbitrary, exactly on the level, missing.
  - B6 predict „Same risk, two stops”: 181 de unități cu stop-ul la 49.50 față de 48 cu stop-ul la 48.00; pierderi la stop 99.51 și 98.36.
  - B7 callout „Never widen a stop once a trade is open”.
- **Try:** `position-size` (units: auto, cu rigla de preț): "Support is at 48.40 and a normal candle moves about 0.40. Move the stop to where the idea fails, plus a buffer, and watch what happens to the size." Reușită: 48.00 ≤ stop ≤ 48.30 (48–57 de unități, pierderea la stop mereu sub 100.00).
- **Practică:** M04 Define Your Risk; M07 Stop or Stay?; Risk calculator.
- **Check:** q-sl-1, q-sl-4, q-sl-3.
- **Dovezi:** Mechanic (R5 RF-06, TM-12; R3 §2.3). Stop-urile adunate la niveluri evidente: B (R3 §5.3; revine în 1.5.5).
- **Necesită:** —
- **Termeni noi de glosar:** — (toți există)

#### 1.4.4 · Sizing a position from the stop  ·  `L09`
- **Nivel / durată / tip:** Beginner · 7 min · Core
- **Obiective:**
  1. Calculate position size from a risk budget and the distance to the stop.
  2. Adjust the size for commission so the loss at the stop stays within budget.
  3. Explain why a wider stop means fewer units rather than more risk.
- **Concepte:** position-sizing ✓, fixed-fractional-sizing ✓, cost-adjusted-sizing ✓
- **Se sprijină pe:** 1.4.1, 1.4.3, 1.1.1
- **Hook:** predict · slider 1–200 units: "Your account is 10,000.00 and you accept losing 1% on this trade. You buy LABX at 100.00 with the stop at 98.00. How many units do you buy?" Răspuns: 50 (47 cu comisioane); greșelile tipice sunt 100 și 1.
- **Interacțiunea centrală:**
  - B2 figure `position-size-formula`, cu input: 100.00 ÷ 2.00 = 50.
  - B4 worked „Cost-adjusted size”: 100.00 ÷ 2.099 → 47; 47 de unități pierd 98.66 la stop, 48 ar pierde 100.76.
  - B5 predict „A wider stop”: cu stop-ul la 96.00, 25 de unități înainte de costuri, 24 după.
  - B6 explain: un buget mai mare (Arena, 2%) și plafonul de buying power: fără levier, cel mult 99 de unități la 100.00, după corectura C2.
  - B7 callout „Stop first, size second”.
- **Try:** `position-size` (units: learner): "Arena rules: risk 2% of 10,000.00. You buy at 100.00 with the stop at 96.00. Enter the most units whose loss at the stop, commissions included, stays within budget." Reușită: 48 (196.71; 49 ar pierde 200.81).
- **Practică:** M05 Size Matters; M04 Define Your Risk; Risk calculator.
- **Check:** q-ps-6, q-ps-3 (cu `vary`; rezervă q-ps-9), q-ps-5.
- **Dovezi:** Mechanic (R5 RF-07; R1 RM-03).
- **Necesită:** — (corectura C2 la `maxQtyForRisk`: plafonul include comisionul de intrare).
- **Termeni noi de glosar:** — (toți există)

#### 1.4.5 · Reward-to-risk and expectancy  ·  `L11`
- **Nivel / durată / tip:** Beginner · 7 min · Core
- **Obiective:**
  1. Calculate a reward-to-risk ratio and its break-even win rate.
  2. Estimate expectancy in R from a win rate and the average win and loss.
  3. Explain why a single result says little about a method.
- **Concepte:** r-multiple ✓, reward-to-risk ✓, expectancy ✓
- **Se sprijină pe:** 1.4.2, 1.4.4, 0.2.2
- **Hook:** predict · alegere: "Two methods, 100 trades each. Losses are always −1R. Method A wins 70% of trades at +0.4R. Method B wins 40% at +2R. Which has the better average result?" Răspuns: B (+0.20R pe trade; A, −0.02R).
- **Interacțiunea centrală:**
  - B2 figure `risk-reward`: 100.00 / 98.00 / 104.00, 2:1, break-even 33%; ținta se trage (1:1 → 50%, 3:1 → 25%).
  - B3 worked: 50.00 / 49.00 / 52.00 → break-even 33.3%.
  - B4 figure `Formula`: 0.40 × 2R − 0.60 × 1R = +0.20R.
  - B5 worked „Three methods, before costs”: metoda C (70% la +0.4R) dă −0.02R.
  - B6 task `expectancy`: win rate coborât până la 33%, primul punct la care expectancy devine negativ.
  - B7 callout: metoda se judecă pe multe trade-uri, fiecare trade după plan.
- **Try:** `risk-reward`, cu câmpurile de preț din PLAN_LEARN §9.1: "You buy at 50.00 with the stop at 49.40. Set the nearest target that gives at least 2R." Reușită: 51.20.
- **Practică:** Risk calculator; Arena: bullish; Knowledge check: risk management.
- **Check:** q-rm-4, q-rm-5, q-rm-7.
- **Dovezi:** Mechanic (R5 RF-05, PM-01, PM-03; R1 RM-06, RM-07).
- **Necesită:** — (corectura `risk-reward` din PLAN_LEARN §9.1).
- **Termeni noi de glosar:** — (toți există)

#### 1.4.6 · Costs in R and the real break-even
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Express a trade's round-trip cost as a share of its stop distance.
  2. Recalculate the break-even win rate of a 2:1 plan once costs are included.
  3. Explain why tighter stops make costs a larger part of every R.
- **Concepte:** costs-in-r (nou), reward-to-risk ✓, trading-costs ✓
- **Se sprijină pe:** 1.4.5, 1.1.5
- **Hook:** predict · alegere: "Two plans on LABX at 100.00, both 2:1. Plan A: stop 2.00 away. Plan B: stop 0.20 away. A round trip costs about 0.20 per unit. Which needs the higher win rate to break even?" — "A" / "B" / "The same". Răspuns: B, unde costurile egalează toată distanța până la stop (break-even 66.7%, față de 36.7% la A).
- **Interacțiunea centrală:**
  - B1 explain: în simulator, 1R include deja comisioanele (1.4.1, `riskAmount`). Lecția separă partea de preț de costuri, ca să se vadă cât din fiecare R se duce pe costuri: costul pe unitate (spread + comisioane, ≈ 0.20 la 100.00, din 1.1.5) ÷ distanța până la stop (R5 RF-21).
  - B2 worked: "Stop 2.00 away: 0.20 ÷ 2.00 = 0.10, a tenth of the risk.", "Stop 0.50 away: 0.20 ÷ 0.50 = ?" Răspuns: 0.40.
  - B3 figure `Bars`: costurile ca parte din distanța până la stop: 2.00 → 10%; 1.00 → 20%; 0.50 → 40%; 0.20 → 100%.
  - B4 explain: cu costuri, un plan 2:1 pierde stop-ul plus costurile și câștigă ținta minus costurile. Stop 2.00, țintă 4.00: pierde 2.20, câștigă 3.80 pe unitate; break-even = 2.20 ÷ (2.20 + 3.80) = 36.7%, nu 33.3%.
  - B5 worked: "Stop 0.50, target 1.00, costs 0.20.", "You lose 0.70 or win 0.80.", "Break-even = 0.70 ÷ 1.50 = ?" Răspuns: 46.7% (toleranță 0.1).
  - B6 predict: "A setup wins 40% of the time at 2:1. Does it make money with a 0.50 stop?" — "Yes" / "No". Răspuns: nu. Măsurat în distanțe de stop (R înainte de costuri), un câștig aduce 0.80 ÷ 0.50 = 1.6 și o pierdere costă 0.70 ÷ 0.50 = 1.4, deci 0.40 × 1.6 − 0.60 × 1.4 = −0.20 pe trade. Cu un stop de 2.00: 0.40 × 1.9 − 0.60 × 1.1 = +0.10.
  - B7 callout: "Every edge is quoted after costs. Shorter stops and shorter timeframes need much bigger raw edges." Previzualizare pentru 2.9 (scalping).
- **Try:** `risk-reward`, extins cu „Costs per unit” (fix, 0.20) și „Break-even after costs”; ținta urmează automat la de două ori distanța stop-ului.
  - Sarcina: "Entry 100.00, costs 0.20 per unit, target always twice the stop distance. Find the tightest stop (step 0.10) whose break-even win rate after costs is 40% or lower."
  - Reușită: stop la 99.00 (distanța 1.00 → 1.20 ÷ 3.00 = 40.0%; la 99.10, 40.7%).
  - Indicii: 1. "Break-even after costs = (stop + costs) ÷ (stop + costs + target − costs)." 2. "With the target at twice the stop, that's (d + 0.20) ÷ 3d." 3. "Solve (d + 0.20) ÷ 3d = 0.40."
- **Practică:** Arena: low volatility.
- **Check:** Q1 (numeric, d1) costurile ca parte din stop; Q2 (numeric, d2) break-even-ul după costuri; Q3 (scenario, d2) același setup, cu stop strâns și cu stop larg.
- **Dovezi:** Mechanic (R5 RF-21; R6 §5.1). Exemplul real: o replicare a opening range breakout, unde un avantaj de ≈ 0.1R a fost mâncat de ≈ 0.1R de costuri: C (R6 §5.1, §2.2.2).
- **Necesită:** — (extindere de widget).
- **Termeni noi de glosar:** `cost-drag`

#### 1.4.7 · Exposure and leverage  ·  `L12`
- **Nivel / durată / tip:** Intermediate · 6 min · Core (nivelul din aplicație; la Nivelul 1 lecția rămâne core)
- **Obiective:**
  1. Calculate exposure as a percentage of equity.
  2. Work out what a given price move does to the account at different levels of leverage.
  3. Distinguish the risk planned at the stop from the full exposure behind it.
- **Concepte:** exposure ✓, leverage ✓, correlation-and-concentration ✓, gap-risk ✓
- **Se sprijină pe:** 1.4.4, 1.4.1, 1.3.7
- **Hook:** predict · slider 0–100%, pas 5: "Your account is 10,000.00. With leverage you hold 40,000.00 of LABX. Price falls 5%. What share of your account is gone?" Răspuns: 20%; intuiția greșită e 5%.
- **Interacțiunea centrală:**
  - B1 figure `Formula`: 5,000.00 ÷ 10,000.00 = 50% expunere; o scădere de 10% costă 500.00, adică 5% din cont.
  - B2 worked „Exposure behind a position”: 60 de unități la 100.00, un gap de 5% → 300.00, adică 3% din cont.
  - B4 figure `exposure-leverage`: 1×, 2×, 5×, cu un slider pe scădere (1–10%).
  - B5 predict „When is the account gone?”: la 5×, o scădere de 20% șterge tot contul.
  - B6 explain: riscul (pierderea planificată la stop) față de expunere (ce e în joc dacă stop-ul nu se execută ca în plan); pozițiile care se mișcă împreună se adună.
  - B7 callout: levierul nu face un trade mai bun, îl face mai mare.
- **Try:** `exposure`, cu poziția și levierul separate: "You have 5× leverage available and hold 50,000.00 of LABX. Find the largest position where a 10% drop costs no more than 5% of your 10,000.00 account." Reușită: 5,000.00.
- **Practică:** Risk calculator; Arena: event shock; Exposure check (`/learn/checks/check-portfolio_exposure`).
- **Check:** q-pe-1, q-pe-3, q-pe-6.
- **Dovezi:** Mechanic (R5 RF-16; R6 §4.5; R1 RM-04).
- **Necesită:** S11 pentru practica cu levier real (Arena are azi plafonul la capital); lecția și widget-ul nu au nevoie.
- **Termeni noi de glosar:** — (toți există; propun `lesson: "L12"` pentru `correlation`)

#### 1.4.8 · Drawdowns: depth, duration and what's normal
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Measure drawdown from the equity peak, not from the starting balance.
  2. Estimate how deep a normal losing run goes at a given risk per trade.
  3. Read an underwater curve for depth and time to recover.
- **Concepte:** drawdown ✓, expected-drawdown (nou)
- **Se sprijină pe:** 1.4.1, 0.2.3
- **Hook:** predict · alegere: "Your account went 10,000.00 → 12,000.00 → 9,600.00 → 12,500.00. What was the maximum drawdown?" — "4%" / "20%" / "25%". Răspuns: 20%, măsurat de la vârful de 12,000.00 (R5 PR-06); 4% e greșeala de a măsura de la start. Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: drawdown-ul se măsoară de la vârful equity-ului; maximum drawdown e cel mai adânc; durata e timpul petrecut sub vârf (R5 PR-06).
  - B2 figure: o curbă de equity și, sub ea, curba „underwater”, care arată adâncimea și durata fiecărui drawdown.
  - B3 worked: "Peak: 12,000.00. Lowest point after it: 9,600.00.", "Drop: 2,400.00.", "Drawdown = 2,400.00 ÷ 12,000.00 = ?" Răspuns: 20%.
  - B4 figure `Bars`: „8 losses in a row” la 1%, 2% și 5% risc pe trade: −7.7%, −14.9%, −33.7%. Text: "At a 40% win rate, a run of 8 losses shows up in about half of all 100-trade stretches (0.2.3)."
  - B5 predict: "At 1% risk per trade, about how many losses in a row take the account down 50%?" — "50" / "69" / "100". Răspuns: 69 (R5 RF-10).
  - B6 explain: recuperarea (tabelul din 1.4.1) și durata: cu cât e mai adânc, cu atât stai mai mult sub vârf.
  - B7 callout: "A drawdown inside the normal range is variance, not a broken method (1.6.6). Write in your plan, in advance, the depth at which you stop and review."
- **Try:** `loss-recovery`, extins cu modul „streak at r%”.
  - Sarcina: "A run of 12 losses is unlikely but possible: at a 40% win rate it shows up in about 1 in 3 stretches of 500 trades. Find the highest risk per trade (step 0.25%) at which 12 losses in a row stay within a 20% drawdown."
  - Reușită: 1.75% (−19.1%; la 2.00%, −21.5%).
  - Indicii: 1. "Each loss takes r% of what is left." 2. "What's left after 12 losses = (1 − r)^12." 3. "Try 1.75% and 2.00% and compare with 80%."
- **Practică:** Analytics: curba underwater a sesiunilor din Arena (S15); Arena: high volatility.
- **Check:** Q1 (numeric, d1) maximum drawdown dintr-un drum de equity; Q2 (numeric, d2) drawdown-ul după n pierderi la r%; Q3 (scenario, d2) un drawdown în limitele normale față de o metodă stricată.
- **Dovezi:** Mechanic (R5 PR-06, PR-07, RF-10, ST-06; calcul exact).
- **Necesită:** S15 (curba underwater și durata drawdown-ului în Analytics; motorul calculează deja `maxDrawdown`).
- **Termeni noi de glosar:** `underwater-curve` (leagă existenții `drawdown`, `max-drawdown`; propun `lesson: "1.4.8"` pentru `max-drawdown`, care azi trimite la L18)

#### 1.4.9 · Daily loss limits
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Set a daily loss limit in R and in vUSD before the session starts.
  2. Stop trading for the day when the next trade's risk no longer fits the limit.
  3. Explain why a daily limit protects against the most expensive behaviour after losses.
- **Concepte:** daily-loss-limit (nou)
- **Se sprijină pe:** 1.4.8, 1.4.4
- **Hook:** predict · alegere: "Your plan risks 1% per trade and you take up to six trades a day. At a 40% win rate, how often does a day bring at least three losses in a row?" — "About 5%" / "About 20%" / "About 50%". Răspuns: aproape una din două zile (47.5%; R5 PR-04, ST-06; calcul exact). Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: limita zilnică e pierderea maximă pe o zi, fixată înaintea sesiunii, în R sau în procente. Când e atinsă, ziua s-a terminat (R5 PR-04).
  - B2 figure: o zi cu trei pierderi, linia limitei la −3R și ecranul „Daily limit reached”.
  - B3 worked: "Limit: 3% of 10,000.00 = 300.00.", "Losses at 1% of current equity: 100.00, 99.00, 98.01.", "Used: 297.01.", "Room left = 300.00 − 297.01 = ?" Răspuns: 2.99. După răspuns: "The next trade would risk 97.02. It doesn't fit: the day is over."
  - B4 predict: "After two losses (199.00 used), a valid setup would risk 98.01. Is it within the limit?" — "Yes" / "No". Răspuns: da (297.01 ≤ 300.00); următorul după el, nu.
  - B5 explain: de ce: greșelile se adună după pierderi (revenge, tilt; R5 PSY-18, PSY-19), iar limita oprește o zi proastă înainte să devină o săptămână proastă. Firmele de prop folosesc aceeași regulă (R5 PR-11; previzualizare pentru 2.11).
  - B6 match, regulă ↔ ce plafonează: "Risk per trade" ↔ "One trade"; "Daily loss limit" ↔ "One bad day"; "Max trades per day" ↔ "Overtrading"; "Weekly and monthly limits" ↔ "A bad run (2.11)".
  - B7 callout: "Set the limit before the session. Never raise it during one."
- **Try:** `decision-replay` (widget nou): o zi de 24 de lumânări, planul cu risc 1% și limita de 3R, 5 puncte de decizie. Primele trei setup-uri valide pierd (fixat în conținut); al patrulea e tot valid.
  - Sarcina: "Follow your plan through the day."
  - Reușită: trei trade-uri cu risc ≤ 1% fiecare și al patrulea setup sărit, cu motivul „Daily limit”.
  - Feedback dacă al patrulea e luat: "That trade would take the day's loss past 300.00. The limit is part of the plan, not a suggestion."
- **Practică:** Arena cu limita zilnică activă (S18); Capstone 1.
- **Check:** Q1 (numeric, d1) limita în vUSD; Q2 (numeric, d2) cât spațiu rămâne după câteva pierderi; Q3 (scenario, d2) un setup valid după atingerea limitei.
- **Dovezi:** Mechanic (probabilitatea seriilor; R5 ST-06, calcul exact). Limita ca protecție împotriva tilt-ului: C (convenție de practicieni și regulă de prop firm; R5 PR-04, PR-11).
- **Necesită:** S18 (limita zilnică și blocarea; propun ca această parte din S18 să vină la Nivelul 1, pentru că etapa 1 → 2 cere „nicio limită depășită”), S14 (detectorul de revenge).
- **Termeni noi de glosar:** `daily-loss-limit`

---

## Unitatea 1.5 · Market structure basics

- **Scop:** structura pieței ca vocabular: swing-uri; trend, range și zgomot; pullback-uri; suport și rezistență ca zone; numere rotunde; retest, schimbarea de rol și breakout-ul eșuat; sfârșitul unui trend; două timeframe-uri.
- **De ce aici:** „întâi contextul, apoi pattern-ul” (README §1, principiul 3; R1 §3.4, punctul 3). Unitatea vine după risc, ca fiecare citire de structură să ajungă imediat la un stop și o mărime; pregătește planul (1.6), care cere condiții de structură verificabile (L14). Lumânările ca pattern-uri, indicatorii și pattern-urile clasice rămân la Nivelul 2 (2.1–2.3).
- **Cere de dinainte:** 1.2 (lumânări, lumânarea normală, timeframe-uri), 1.3.2 (stop la invalidare), 1.4.3–1.4.4 (stop și mărime).
- **Checkpoint:** partea L05/L06 din `test-technical_analysis` (q-ta-1 … q-ta-6, q-ta-11) și q-mf-11 + 12 întrebări noi pentru 1.5.1, 1.5.3, 1.5.5–1.5.8. Întrebările L07 (q-ta-7 … q-ta-10) urcă la 2.3. La ≥ 80%, cele 8 lecții se marchează „Tested out”.
- **Laboratorul unității:** M02 Trend or Noise? (există, cu D15 aplicat) și „Structure walk”: un grafic de 120 de lumânări redat bucată cu bucată. La 6 opriri, utilizatorul numește structura, marchează nivelul relevant și spune unde ar sta stop-ul. Un segment e R0, unde răspunsul bun e „no clear structure” (R3 §8.2, M3).
- **Firele din spirală:** Dovezi (notele B, C și D pentru niveluri, numere rotunde, breakout-uri, Fibonacci și MTF; controlul pe R0), Risc (stop-ul dincolo de structură și dincolo de stop-urile grupate).
- **Surse:** R3 §4.2–§4.8, §4.18, §4.20, §5.2, §5.3, §7.2, §8.2; R6 §2.2.4, §2.3.1, §2.3.4, §2.5, §2.7.3, §2.17; R1 TR-01 … TR-04, TR-08, TR-12, §3.3.
- **Lecții existente:** L05 → 1.5.2: B3 devine recapitularea regulii de swing din 1.5.1, iar durata trece la 6 minute (D6). L06 → 1.5.4, fără schimbări.
- **Widget-uri noi și extinderi:** `swing-marker` (detector cu N, mod de măsurare), `mtf-panes`; `level-drawer` primește grila de numere rotunde și modul retest cu două finaluri; `blind-replay` primește modul „mark the moment”.

#### 1.5.1 · Swing highs and swing lows
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Mark swing highs and swing lows with a fixed rule: a high above the two candles on each side.
  2. Explain why a swing is confirmed only two candles after it forms.
  3. Show how a different rule changes the structure you see.
- **Concepte:** swing-points (nou)
- **Se sprijină pe:** 1.2.1, 1.2.5
- **Hook:** predict · hotspot cu selecție multiplă pe 20 de lumânări: "Tap every swing high you can see." Nu se notează; recap-ul compară atingerile cu regula ("You marked 5; the 2-candle rule finds 3").
- **Interacțiunea centrală:**
  - B1 explain: un swing high e o lumânare al cărei high e strict mai mare decât high-urile celor două lumânări din fiecare parte; swing low-ul e oglinda (convenția din U2; R3 §4.2, unde N = 2 e „fractalul” lui Williams).
  - B2 figure: 20 de lumânări; swing-urile se marchează pe rând cu `Marker`, iar la fiecare pas se luminează cele două lumânări vecine din fiecare parte.
  - B3 hotspot: "Tap the candle that has just become a confirmed swing low." Ținta: lumânarea de acum două lumânări. Pe ultima lumânare: "Not yet: it needs two candles after it."
  - B4 predict: "The latest candle made a new high. Is it a swing high yet?" — "Yes" / "Not yet" / "Never". Răspuns: încă nu; confirmarea vine cu două lumânări mai târziu, deci orice hartă a structurii întârzie (R3 §4.2).
  - B5 figure: același grafic cu N = 2 și cu N = 5: mai puține swing-uri, mai mari. Structura depinde de regula aleasă (R3 §4.2: „the definition is a parameter choice”).
  - B6 callout: "Marking swings you couldn't have known at the time is hindsight (1.2.7). Pick one rule and apply it the same way every time."
- **Try:** `swing-marker` (widget nou): 30 de lumânări, swing-urile se marchează prin tap; N e blocat la 2 în timpul sarcinii.
  - Sarcina: "Mark every swing high and swing low with the 2-candle rule."
  - Reușită: exact setul de swing-uri definit în conținut. O marcare greșită primește motivul: "A neighbour is higher." sau "Not confirmed yet."
  - După reușită, slider-ul N (2–5) se deblochează pentru explorare.
- **Practică:** M02 Trend or Noise?; Arena: bullish, cu stratul de swing-uri din kit.
- **Check:** Q1 (mcq, d1) regula de swing; Q2 (scenario, d2) întârzierea confirmării; Q3 (mcq, d2) de ce doi traderi pot vedea structuri diferite pe același grafic.
- **Dovezi:** Mechanic (definiția e o alegere de parametru; R3 §4.2).
- **Necesită:** detectorul de swing-uri în Learn Chart Kit (nu are cod S; propun să intre în S3).
- **Termeni noi de glosar:** `swing-high`, `swing-low`, `market-structure`

#### 1.5.2 · Trends, ranges and noise  ·  `L05`
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Identify an uptrend or a downtrend from its swing highs and swing lows.
  2. Recognise a range and the levels that bound it.
  3. Tell structured moves apart from noise.
- **Concepte:** trend ✓, range ✓, timeframe ✓
- **Se sprijină pe:** 1.5.1, 1.2.1
- **Hook:** predict · alegere, pe 3 lumânări verzi (închideri 99.40, 100.18, 100.30): "Three green 1-hour candles in a row on LABX, each closing higher. What is the market doing?" — "Trending up" / "Ranging" / "Just noise" / "Can't tell yet". Citirea onestă e „Can't tell yet”; B5 face zoom out la 24 de lumânări, unde porțiunea e zgomot.
- **Interacțiunea centrală:**
  - B2 figure `trend-range-noise`: trei mini-grafice (trend, range, zgomot), desenate pe rând.
  - B4 reveal „Is this still an uptrend?”: utilizatorul trage cel mai jos nivel la care poate ajunge pullback-ul fără să strice trendul (102.40, acceptat între 102.30 și 102.60); vălul arată coborârea la 101.00.
  - B5 figure „Zoom out”: cele 3 lumânări din hook, în 24 de lumânări fără structură.
  - B6 match, dovadă ↔ piață (motivele din M02: `hh_hl`, `lh_ll`, `bounded`, `overlap`).
  - B7 callout: "Name the market before you trade it. If you can't, staying out is a valid decision."
- **Try:** `trend-classifier` (widget nou): trei segmente de câte 30 de lumânări. Reușită: A = Trend + "Lower highs and lower lows"; B = Noise + "Candles overlap with no direction"; C = Range + "Price keeps bouncing between two levels".
- **Practică:** M02 Trend or Noise?; Arena: bullish; Arena: sideways.
- **Check:** q-ta-1, q-ta-2, q-ta-3 (cu `vary` sau cu cifrele noi propuse în script).
- **Dovezi:** definițiile sunt Mechanic (R3 §4.3, §4.4). Ideea că o structură de trend „continuă”, ca etichetă pe grafice de 1H: C (R3 §4.3, HEUR/EMP~); trend following diversificat, pe decenii, e A (R6 §1.5), dar e alt lucru.
- **Necesită:** — (widget nou `trend-classifier`).
- **Termeni noi de glosar:** — (toți există; propun `lesson: "L05"` pentru `reversal`)

#### 1.5.3 · Pullbacks
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Measure a pullback as a share of the prior leg and in normal candles.
  2. Tell a pullback that keeps the trend from one that breaks the last higher low.
  3. Explain why entering on a pullback gives a closer stop than chasing the move.
- **Concepte:** pullback (nou)
- **Se sprijină pe:** 1.5.2
- **Hook:** predict · alegere: "An uptrend leg ran from 100.00 to 104.00. Price is now 102.80. How deep is this pullback?" — "1.20" / "30% of the leg" / "Both". Răspuns: amândouă.
- **Interacțiunea centrală:**
  - B1 explain: un leg e mișcarea de la un swing la următorul; un pullback e o mișcare în sens opus, în interiorul unui trend.
  - B2 worked: "Leg: 104.00 − 100.00 = 4.00.", "Pullback: 104.00 − 102.80 = 1.20.", "Depth = 1.20 ÷ 4.00 = ?" Răspuns: 30%. După răspuns: "In normal candles of 0.40, that's three candles."
  - B3 figure: patru pullback-uri pe același trend: 25%, 50% și 80% rămân deasupra ultimului higher low; al patrulea coboară sub el (recapitulare din L05 B4).
  - B4 explain „Pullback or chase?”: la un pullback, stop-ul stă sub minimul lui, mai aproape. Cu același buget de 100.00 și același stop sub 103.00: cumpărând după o urcare, la 106.00, încap 32 de unități; cumpărând la pullback, la 104.50, încap 62 (cu costuri). Cifrele revin în 1.7.2 (FOMO).
  - B5 predict: "Fibonacci says pullbacks stop near 61.8%. On random charts, how often do pullbacks 'stop' near 61.8%?" — "Rarely" / "About as often as near any other level" / "Much more often". Răspuns: cam la fel de des ca lângă orice alt nivel (R6 §2.3.4; R3 §4.6). Critica completă vine în 2.5.
  - B6 callout: "A pullback is defined by structure, not by a ratio. When it breaks the last higher low, it may be the start of something else (1.5.7)."
- **Try:** `swing-marker` în modul de măsurare (cu rigla S3, opțional): un uptrend cu trei leg-uri: 100.00 → 103.00, pullback la 102.10; 102.10 → 105.00, pullback la 103.55; 103.55 → 106.00, pullback la 101.90.
  - Sarcina: "Measure each pullback as a share of its leg, then tap the one that broke the trend."
  - Reușită: 30%, 50% și 167% (toleranță 1 punct) și tap pe al treilea, care coboară sub ultimul higher low, 103.55.
- **Practică:** Arena: bullish (obiectivul scenariului: intrări pe pullback, cu stop sub ultimul swing low).
- **Check:** Q1 (numeric, d1) adâncimea unui pullback; Q2 (scenario, d2) un pullback care coboară sub ultimul higher low; Q3 (numeric, d2) unitățile la pullback față de urmărirea prețului.
- **Dovezi:** Mechanic (măsurarea). Intrările pe pullback într-un trend: C, cu un sprijin teoretic B (R6 §2.3.1). Fibonacci ca nivel „magic”: D (R6 §2.3.4; R3 §4.6).
- **Necesită:** S3 (rigla), opțional.
- **Termeni noi de glosar:** `leg` (leagă existenții `pullback`, `retracement`; propun `lesson: "1.5.3"` pentru `retracement`)

#### 1.5.4 · Support, resistance and breakouts  ·  `L06`
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Mark support and resistance as zones from repeated turns in price.
  2. Describe what separates a breakout from a false breakout.
  3. Plan a stop that allows for a breakout failing.
- **Concepte:** support-and-resistance ✓, breakout ✓, false-breakout ✓
- **Se sprijină pe:** 1.5.2, 1.3.2, 1.1.1
- **Hook:** predict · tap pe grafic, în range-ul lecției: "LABX has moved sideways for 30 hours. Tap the price where it keeps turning down." Zona: 101.85–102.10; recap-ul compară prețul atins cu zona.
- **Interacțiunea centrală:**
  - B2 figure `support-resistance`: zonele 101.85–102.10 și 97.90–98.10, din câte trei întoarceri.
  - B3 hotspot: lumânarea 27, cu fitilul la 102.30 și închiderea la 101.80: un test, nu o rupere.
  - B4 reveal „Same start, two endings”: intrare la ask, 102.65, stop 101.70; finalul A ține deasupra lui 102.00, finalul B se întoarce și execută stop-ul.
  - B6 worked „What ending B cost”: 0.95 + ≈ 0.10 comision = ≈ 1.05 pe unitate.
  - B7 callout: așteptarea unei închideri filtrează unele mișcări false, nu pe toate; stop-ul se pune unde breakout-ul ar fi eșuat.
- **Try:** `level-drawer` (widget nou), în două părți: banda de rezistență (≥ 3 atingeri, înălțime 0.10–0.50), apoi stop-ul pentru un breakout cumpărat (bandLow − 0.80 ≤ stop ≤ bandLow − 0.10); Play arată finalurile FAIL și HOLD. Show me: banda 104.19–104.41, stop 104.00.
- **Practică:** Arena: breakout; Arena: false breakout; M04 Define Your Risk.
- **Check:** q-ta-11, q-ta-5 (cu `vary` sau cifre noi), q-ta-6.
- **Dovezi:** nivelurile S/R: B (Osler 2000: 60.8% față de 56.2% la niveluri arbitrare; R3 §5.2, §4.20). Tranzacționarea breakout-ului unui nivel: C/D (R6 §2.2.4).
- **Necesită:** — (widget nou `level-drawer`).
- **Termeni noi de glosar:** — (toți există; `consolidation` rămâne termen înrudit, fără legătură în text)

#### 1.5.5 · Round numbers
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Explain why orders cluster at and just beyond round numbers.
  2. Place a stop beyond structure rather than exactly at, or just past, a round number.
  3. Describe the size of the documented effect without overstating it.
- **Concepte:** round-numbers (nou)
- **Se sprijină pe:** 1.5.4, 1.4.3
- **Hook:** predict · alegere: "You're long LABX near 99.40. Where would most traders put a take-profit?" — "99.95" / "100.00" / "100.07". Răspuns: 100.00; take-profit-urile se adună exact la numerele rotunde (Osler).
- **Interacțiunea centrală:**
  - B1 explain: numerele rotunde sunt prețurile care se termină în 00 sau 50 și, mai slab, în 0 sau 5 (R3 §5.3).
  - B2 figure `Bars`, din cartea de ordine a unei bănci (9,667 de ordine; Osler): take-profit-uri la „00”: 9.3%, față de 4.4% la stop-loss-uri; stop-loss-uri de cumpărare chiar deasupra unui număr rotund (xx01–xx10): 14.4%, față de 7.4% chiar sub el (xx90–xx99) (R3 §2.6, §5.1).
  - B3 explain: mecanismul: take-profit-urile de la număr tind să oprească prețul; stop-urile de dincolo de el, odată declanșate, devin ordine market și tind să-l împingă mai repede (Osler 2001, 2005).
  - B4 predict: "Published support and resistance levels against random levels: how often did price stop and turn?" — "90% vs 50%" / "61% vs 56%" / "No difference". Răspuns: 60.8% față de 56.2% (Osler 2000): un efect real, dar mic; profitul după costuri nu e dovedit.
  - B5 hotspot: suport la 100.00 (și număr rotund), long la 100.40. "Tap the best place for your stop": 100.00 (pe nivel), 99.95 (chiar sub el, unde se adună stop-urile), 99.60 (dincolo de nivel și de grupul de stop-uri, la o lumânare normală), 98.00 (departe). Răspuns: 99.60.
  - B6 callout: "Round numbers matter a little, not a lot. Don't put your stop exactly where everyone else's is."
- **Try:** `level-drawer`, cu grila de numere rotunde (extindere).
  - Sarcina: "Long at 100.40 above support at 100.00, a round number. A normal candle is 0.40. Place the stop beyond the level and beyond the cluster of stops just under it."
  - Reușită: 99.40 ≤ stop ≤ 99.60.
  - Feedback: 99.90–99.99: "That's where stops cluster. A push through 100.00 can sweep it."; 99.61–99.89: "Leave about one normal candle below the level."; sub 99.40: "That's further than the idea needs."
- **Practică:** Arena: sideways (un range lângă un număr rotund). Generatorul de azi nu adună ordine la numere rotunde, deci efectul nu apare încă în practică (vezi Necesită).
- **Check:** Q1 (mcq, d1) unde se adună take-profit-urile; Q2 (scenario, d2) unde pui stop-ul lângă un număr rotund; Q3 (mcq, d2) cât de mare e efectul nivelurilor.
- **Dovezi:** B (Osler 2000, 2001, 2005; R3 §5.2, §5.3, §2.6; exemplul din README §6).
- **Necesită:** generator cu ordine grupate în stilul Osler (take-profit la număr, stop-uri chiar dincolo; R3 Anexa A3). Nu are cod S; propun să intre în S8 sau S7.
- **Termeni noi de glosar:** `round-number`, `stop-cluster`

#### 1.5.6 · Retests, role reversal and failed breakouts
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Tell a retest that holds from a close back inside that fails.
  2. Explain why old resistance can act as support after a breakout.
  3. Plan your action for both outcomes before the break happens.
- **Concepte:** role-reversal (nou), false-breakout ✓, breakout ✓
- **Se sprijină pe:** 1.5.4, 1.5.5
- **Hook:** predict · alegere, în momentul unui retest: prețul a rupt 102.00, a urcat la 103.20 și a revenit la 102.05. "Will old resistance hold as support?" — "It holds" / "It fails" / "Can't know yet". Reveal: ambele finaluri, unul după altul. Citirea onestă e „Can't know yet”; planul decide acțiunea.
- **Interacțiunea centrală:**
  - B1 explain: un retest e revenirea la nivelul rupt; schimbarea de rol (polaritatea) spune că o rezistență ruptă poate deveni suport (R3 §5.2; R1 TR-04).
  - B2 figure: două retest-uri alăturate: unul intră cu fitilul în vechea zonă și se închide deasupra (ține), celălalt se închide înapoi în range (eșuează).
  - B3 match, ce vezi ↔ ce sugerează: "Closes back inside the range within 1–3 candles" ↔ "A failed breakout"; "Wicks into old resistance, closes above it" ↔ "A retest holding"; "Pokes beyond the level, then closes back inside at once" ↔ "A failed breakout (also called a 'sweep', 3.5)"; "Keeps closing beyond, never comes back" ↔ "A breakout with follow-through".
  - B4 explain: ratele de bază. Afirmații ca „80% din breakout-uri eșuează” sunt euristici de practicieni, netestate în forma asta (R3 §4.8). Singurul test sistematic găsit a arătat continuare după „sweep-uri” (Mahadzva 2026, nerecenzat), iar stop-urile adunate pot accelera ruperile (Osler 2005). Ambele finaluri apar destul de des ca să le planifici pe amândouă.
  - B5 order, planul dinaintea ruperii: "Mark the zone" → "Define the break: a close beyond it" → "Decide the entry" → "Put the stop back inside the range" → "Decide what you do if it holds" → "Decide what you do if it fails".
  - B6 callout: "After a failed breakout, don't flip direction out of frustration. Take the planned loss and wait for the next setup in your plan." (obiectivul scenariului Arena: false breakout).
- **Try:** `level-drawer`, în modul retest cu două finaluri.
  - Sarcina: "Mark the old resistance zone. At the retest, either enter long with a stop back inside the range or stand aside. Then play both endings."
  - Reușită (de proces): zona acoperă întoarcerile; la intrare, stop-ul e sub zonă, înapoi în range (bandLow − 0.80 … bandLow − 0.10); la abținere, un motiv ales. Respinse: intrarea fără stop sau cu stop-ul în zonă.
  - Feedback după ambele finaluri: "Same chart, same plan, two endings. The plan was right in both."
- **Practică:** Arena: false breakout; Arena: breakout.
- **Check:** Q1 (mcq, d1) schimbarea de rol; Q2 (scenario, d2) o închidere înapoi în range; Q3 (scenario, d2) ce faci după un breakout eșuat (nu întorci poziția, nu lărgești stop-ul).
- **Dovezi:** schimbarea de rol: C (R3 §5.2, HEUR/EMP~). „Majoritatea breakout-urilor eșuează”: D (R3 §4.8). Tranzacționarea breakout-ului eșuat (Turtle Soup): C (R6 §2.7.3). Cascadele de stop-uri: B (Osler 2005; R3 §7.2).
- **Necesită:** — (extindere de `level-drawer`).
- **Termeni noi de glosar:** `retest`, `role-reversal`, `false-breakout` (conceptul există, termenul de glosar nu; propun și legătura lui în L06)

#### 1.5.7 · When a trend ends
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Identify the first lower low and the first lower high after an uptrend.
  2. Tell a deep pullback from a change in structure.
  3. Stop trading the old direction once the structure has broken.
- **Concepte:** structure-break (nou)
- **Se sprijină pe:** 1.5.3, 1.5.6
- **Hook:** predict · hotspot pe un grafic: un uptrend, un prim lower low, o revenire care se oprește sub vârful anterior și un nou minim. "Tap the candle where the downtrend became clear." Răspunsul de referință: lumânarea care coboară sub primul lower low după lower high. Nu se notează; recap-ul compară.
- **Interacțiunea centrală:**
  - B1 explain: secvența obișnuită: higher highs și higher lows → un prim lower low (ultimul higher low e rupt: un avertisment) → o revenire care se oprește sub ultimul vârf (lower high) → un nou lower low: structură de downtrend (R3 §4.3).
  - B2 figure: secvența construită pas cu pas, cu marcajele HH, HL, LL, LH, LL.
  - B3 hotspot: "Tap the first lower high."
  - B4 explain: multe trenduri trec printr-un range înainte să se întoarcă. „Trendul s-a terminat” poate însemna „a început un range”, nu „a început un downtrend”.
  - B5 predict: "After the structure breaks, your pullback playbook flags a buy. Do you take it?" — "Yes" / "No". Răspuns: nu; prima condiție a playbook-ului (uptrend intact) pică (L14, 1.6.1).
  - B6 callout: "Don't try to pick the top. Respond to the structure and accept being a little late." O notă: „change of character” din SMC e o rupere de structură Dow cu alt nume (R3 §7.2; previzualizare pentru 3.5).
- **Try:** `blind-replay`, în modul „mark the moment”: graficul rulează lumânare cu lumânare.
  - Sarcina: "Press 'Structure broken' at the first close below the uptrend's last higher low."
  - Reușită: exact lumânarea definită în conținut. Prea devreme: "That low is still above the last higher low." Prea târziu: "The close below the last higher low came {n} candles earlier."
- **Practică:** Arena: reversal (obiectivul scenariului: observi când structura se rupe și nu mai tranzacționezi vechea direcție).
- **Check:** Q1 (mcq, d1) ce rupe structura unui uptrend; Q2 (scenario, d2) un singur lower low față de un downtrend; Q3 (scenario, d2) playbook-ul după o rupere de structură.
- **Dovezi:** definițiile sunt Mechanic. Că ruperile de structură prezic întoarceri: C (R3 §4.3, HEUR/EMP~). Narațiunea SMC: D (R3 §7.2).
- **Necesită:** — (mod nou în `blind-replay`).
- **Termeni noi de glosar:** `structure-break`

#### 1.5.8 · One market, several timeframes
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Read the trend on a higher timeframe before acting on a lower one.
  2. Explain a timeframe conflict, such as 4H up and 1H down, as a pullback inside a larger trend.
  3. Avoid switching timeframes until one agrees with your idea.
- **Concepte:** multi-timeframe-analysis (nou)
- **Se sprijină pe:** 1.2.3, 1.5.3
- **Hook:** predict · alegere: "On the 4-hour chart LABX is in an uptrend. On the 1-hour chart the last ten candles fall. Which one is right?" — "The 4-hour" / "The 1-hour" / "Both, at different scales". Răspuns: amândouă.
- **Interacțiunea centrală:**
  - B1 explain: timeframe-ul mai mare dă contextul; cel mai mic dă detaliile și momentul (R3 §4.18).
  - B2 figure: panourile 4H și 1H sincronizate; o bandă pe 4H arată cele 10 ore care scad pe 1H: un pullback în interiorul uptrend-ului de 4H.
  - B3 match, întrebare ↔ timeframe: "Which way is the bigger trend?" ↔ "The higher timeframe"; "Where does my stop go?" ↔ "The timeframe I trade"; "When exactly do I enter?" ↔ "The timeframe I trade, or a lower one".
  - B4 predict: "You short the 1-hour downtrend inside the 4-hour uptrend. What's the extra risk?" — "None" / "You trade against the larger structure" / "Your stop must be wider". Răspuns: al doilea. Trade-ul poate fi valid, dar o faci știind asta și îl dimensionezi ca pe oricare altul.
  - B5 explain: fiecare timeframe în plus e încă un loc unde poți găsi, după fapt, un grafic care îți dă dreptate (grade de libertate; confirmation bias) (R3 §4.18, §7.2). Planul fixează două timeframe-uri: unul pentru context, unul pentru tranzacționare.
  - B6 callout: "Choose your timeframes in the plan, not after the chart disagrees with you." Previzualizare pentru „triple screen” (Elder), în 2.6.
- **Try:** `mtf-panes` (widget nou): panourile 4H și 1H, sincronizate.
  - Sarcina: "Label the 4-hour trend and the 1-hour move, then choose the read."
  - Variantele: "Pullback in an uptrend" / "New downtrend" / "Range".
  - Reușită: 4H = uptrend, 1H = falling, citirea = "Pullback in an uptrend" (graficul din conținut ține scăderea de pe 1H deasupra ultimului higher low de pe 4H).
- **Practică:** Arena: bullish, cu 1H și 4H (există).
- **Check:** Q1 (mcq, d1) rolul timeframe-ului mai mare; Q2 (scenario, d2) un conflict 4H / 1H; Q3 (mcq, d2) de ce schimbatul timeframe-urilor e un bias.
- **Dovezi:** C (R3 §4.18, HEUR; R1 TR-12). Avertismentul despre gradele de libertate: Mechanic (R3 §7.2).
- **Necesită:** S4, parțial (1H și 4H există; panourile sincronizate sunt o funcție de UI).
- **Termeni noi de glosar:** `higher-timeframe`

---

## Unitatea 1.6 · Your first plan and journal

- **Scop:** de ce un plan; planul v1 scris; checklist-ul; jurnalul; review-ul deciziilor; greșeală vs varianță; KPI-urile de proces.
- **De ce aici:** „planul și jurnalul vin înaintea strategiilor” (README §1, principiul 5; R1 §3.4, punctul 5, și §4.10–§4.11; R5 §10 Nivelul 1, punctul 11). Utilizatorul are acum mecanica, riscul și vocabularul de structură de care au nevoie condițiile verificabile. Etapa 1 → 2 cere planul v1 și KPI-urile, deci unitatea pornește și blocul celor 30 de trade-uri.
- **Cere de dinainte:** 1.4 (risc, stop, mărime, R:R, limita zilnică), 1.5.2 (swing-uri, trend), 0.2.1 (proces vs rezultat), 0.2.3–0.2.4 (serii, eșantion).
- **Checkpoint:** `test-decision_making` (q-dm-1 … q-dm-10) + 10 întrebări noi pentru 1.6.2–1.6.4, 1.6.6 și 1.6.7. La ≥ 80%, cele 7 lecții se marchează „Tested out”.
- **Laboratorul unității:** M10 No Trade Is a Trade (există); pornirea blocului de 30 de trade-uri pentru etapă, cu planul v1 atașat, checklist-ul pe bilet și KPI-urile vizibile.
- **Firele din spirală:** Proces (centrul unității), Statistică (de ce 30 de trade-uri măsoară procesul, nu avantajul; seriile în review), Psihologie (outcome bias și hindsight în review), Risc (capitalul de risc, limitele din plan).
- **Surse:** R5 PL-01, PL-03, PL-04, PL-07, PL-08, PL-09, PL-14, PL-15, PM-17, PSY-08, PSY-13, PSY-14, PSY-29, PSY-33, PSY-37, RF-01, ST-06, ST-14; R1 PJ-01, PJ-02, PJ-04, §3.4, §4.10, §4.11.
- **Lecții existente:** L14 → 1.6.1, fără schimbări. L17 → 1.6.5: „Se sprijină pe” L15 devine 0.2.1 (L15 urcă la 2.13); hindsight bias e introdus deja în 1.2.7; recency bias e termen nou aici. Decizia D2 (exemplul cu 48 de unități după costuri) rămâne de aplicat.
- **Widget-uri noi și extinderi:** `plan-builder`, `checklist-modal`, `journal-entry` (S15), `kpi-dashboard` (S15); refolosit: `trade-tagger` (din 0.1.5).

#### 1.6.1 · Writing a trading plan  ·  `L14`
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Write a short playbook with entry conditions, risk and exits.
  2. Check a setup against every condition before acting.
  3. Treat 'no trade' as a valid decision.
- **Concepte:** trading-plan ✓, decision-quality ✓, confirmation-bias ✓
- **Se sprijină pe:** 1.5.2, 1.4.3, 1.4.5
- **Hook:** predict · alegere: "LABX is rising and has pulled back. You could buy at 49.00 with a stop at 48.00, under the pullback low. The previous high is 50.50. Would you buy?" — "Buy it" / "Skip it" / "Can't tell yet". Răspuns: „Skip it”, după playbook-ul lecției: ținta naturală e la 1.5R, sub minimul de 2R.
- **Interacțiunea centrală:**
  - B2 match „What a plan contains”: setups, entry conditions, risk, exits, limits.
  - B3 explain: condiții verificabile; confirmation bias trăiește în regulile vagi.
  - B4 figure „A playbook entry”: condițiile 1 și 2 bifate, stop 48.00, ținta 51.50 cu semn de întrebare.
  - B5 worked „Does condition 3 pass?”: 2.50 ÷ 1.00 = 2.5R.
  - B6 figure `decision-tree` ca `Flow` cu alegere: pullback-ul a coborât la 47.30, sub 47.40, deci condiția 2 pică și răspunsul e no trade.
  - B7 order „Before every trade”: 5 pași, de la numirea setup-ului la rândul din jurnal.
- **Try:** `risk-reward` (entry, stop, target): "Condition 3 needs a target at least 2R from entry. Entry and stop are fixed by the setup. Find the lowest target the plan still accepts." Reușită: 51.00.
- **Practică:** M10 No Trade Is a Trade; Knowledge check: decision making.
- **Check:** q-dm-1, q-dm-3, q-dm-8.
- **Dovezi:** — (instrument de proces; R5 PL-01, PL-03, PL-04).
- **Necesită:** —
- **Termeni noi de glosar:** — (toți există)

#### 1.6.2 · Your plan v1
- **Nivel / durată / tip:** Beginner · 7 min · Core
- **Obiective:**
  1. Write a one-page plan v1: market, timeframe, one setup, risk rules, exits and limits.
  2. Set your risk capital and personal limits as numbers the app can check.
  3. Version the plan and change it only through its own rule for changes.
- **Concepte:** trading-plan ✓, risk-capital (nou)
- **Se sprijină pe:** 1.6.1, 1.4.9
- **Hook:** predict · alegere: "Which of these plan lines can the app check for you?" — "Trade with the trend" / "Risk 1% of current equity per trade" / "Be patient". Răspuns: a doua. Se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: v1 e scurt, verificabil și are un singur setup (R5 PL-01, „v1 simple”). Secțiunile: scop și constrângeri (cu capitalul de risc), piața și timeframe-urile, un setup cu condiții verificabile, regulile de risc (risc pe trade, limita zilnică, numărul maxim de trade-uri pe zi), ieșirile, rutina, jurnalul și review-ul, regula pentru schimbări.
  - B2 figure: secțiunile plan builder-ului se aprind pe rând, fiecare cu o linie de exemplu.
  - B3 worked „Risk capital” (în orice monedă): "Savings: 20,000.", "Emergency fund, six months of expenses: 12,000.", "Already promised, next year's tuition: 5,000.", "Risk capital = 20,000 − 12,000 − 5,000 = ?" Răspuns: 3,000. După răspuns: "Only this money belongs in a trading account. Here it's virtual; the habit isn't." (R5 RF-01).
  - B4 match, vag ↔ verificabil: "The trend is up" ↔ "The last two swing highs and lows are each higher than the ones before"; "Don't risk too much" ↔ "Risk 1% of current equity, costs included"; "Stop if it's a bad day" ↔ "Stop for the day after −3R"; "Use a sensible stop" ↔ "Stop 0.20 below the pullback low".
  - B5 explain: versiunile: planul pornește ca v1.0. O regulă se schimbă doar după cel puțin 30 de trade-uri cu ea sau după o încălcare clară, niciodată în timpul sesiunii, și cu motivul scris (R5 PL-14, pe scurt).
  - B6 callout: "Your plan is what Decision Quality and Risk Discipline measure you against. Its numbers become guard-rails in the simulator."
- **Try:** `plan-builder` (widget nou): secțiuni cu câmpuri obligatorii; un verificator spune dacă fiecare condiție de intrare se poate răspunde cu da sau nu; regulile numerice devin guard-rails (riscul pe trade, limita zilnică, numărul maxim de trade-uri, apoi durata pauzei din 1.7.7).
  - Sarcina: "Write your plan v1 and save it."
  - Reușită: toate secțiunile obligatorii completate; fiecare condiție trece verificarea; risc pe trade ≤ 2%; limita zilnică setată. Planul salvat e cel cerut de etapa 1 → 2.
- **Practică:** pornirea blocului de 30 de trade-uri în Arena, cu planul v1 atașat.
- **Check:** Q1 (numeric, d1) capitalul de risc dintr-un profil nou; Q2 (mcq, d2) o linie de plan verificabilă față de una vagă; Q3 (scenario, d2) schimbarea unei reguli după trei pierderi.
- **Dovezi:** — (instrument de proces; R5 PL-01, PL-14, RF-01; R1 PJ-02). Guard-rails: B/C (R5 PSY-37).
- **Necesită:** plan builder-ul și guard-rails (funcții de aplicație, fără cod S); S18 (limita zilnică), S14 (pauza).
- **Termeni noi de glosar:** `risk-capital`

#### 1.6.3 · The pre-trade checklist
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Run a short go / no-go checklist before every order.
  2. Separate the items the app can verify from those only you can answer.
  3. Treat any 'no' as no trade, or resize within the limit.
- **Concepte:** pre-trade-checklist (nou)
- **Se sprijină pe:** 1.6.2
- **Hook:** predict · alegere: "Pilots and surgeons run checklists for routine steps. Which trading mistake is a checklist most likely to catch?" — "A misread chart pattern" / "Entering with no stop" / "A bad market". Răspuns: intrarea fără stop.
- **Interacțiunea centrală:**
  - B1 explain: un checklist are 5–9 întrebări da / nu, puse în momentul deciziei (R5 PL-04).
  - B2 figure, checklist-ul: "Setup in my playbook?", "Every condition yes?", "Stop at the invalidation?", "Size within 1%, costs included?", "Daily limit OK?", "No pause running?", "Calm enough: 3 of 5 or lower?".
  - B3 match, întrebare ↔ cine o verifică: stop prezent, mărimea în limită, limita zilnică și pauza ↔ aplicația; setup-ul și condițiile ↔ tu (aplicația verifică ce poate); starea ta ↔ tu.
  - B4 predict: un checklist completat, cu un singur „nu”: mărimea înseamnă 1.3%. "What now?" — "Trade anyway" / "Resize within the limit, or skip" / "Widen the stop". Răspuns: a doua (Flow-ul din L14).
  - B5 explain: un checklist trebuie să rămână scurt; riscul lui e bifatul fără citit (R5 PL-04).
  - B6 callout: "The checklist ends the same way whether you trade or not: with a line in your journal."
- **Try:** `checklist-modal` (widget nou, pe bilet): 4 bilete la rând, fiecare trecut prin checklist.
  - Reușită: decizia corectă pe toate 4: biletul 1, totul da → go; biletul 2, fără stop → no-go; biletul 3, risc 1.3% → resize în limită sau skip; biletul 4, setup în afara playbook-ului → no-go.
- **Practică:** Arena, cu checklist-ul pe bilet; M10 No Trade Is a Trade.
- **Check:** Q1 (mcq, d1) la ce folosește checklist-ul; Q2 (scenario, d2) un singur „nu” la risc; Q3 (mcq, d2) de ce trebuie să fie scurt.
- **Dovezi:** checklist-urile din aviație și chirurgie: B (dovezi din alte domenii; R5 PL-04 [BK]).
- **Necesită:** checklist-ul pe biletul de ordin (funcție de aplicație); S14 (întrebările obiective verificate automat).
- **Termeni noi de glosar:** `pre-trade-checklist`

#### 1.6.4 · The trade journal
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Record a trade, or a no-trade, with its thesis, invalidation, plan check and emotion.
  2. Let the simulator fill in the numbers and add the 30-second written part.
  3. Explain why journaling only losers, or days later, distorts the record.
- **Concepte:** journaling ✓
- **Se sprijină pe:** 1.6.3
- **Hook:** predict · alegere: "Which journal entry is most useful a month later?" — A "Lost 98.36. Bad luck." / B "Pullback setup, all three conditions yes. Stop 48.00 under support, 48 units, −1R at the stop. Calm, 2 of 5. Plan followed." / C "Market was crazy today." Răspuns: B.
- **Interacțiunea centrală:**
  - B1 explain: câmpurile jurnalului (R5 PL-07): cifrele completate de simulator (ora, setup-ul, intrarea, stop-ul, ținta, mărimea, R planificat, rezultatul în R, costurile) și partea ta (teza, prețul de invalidare, verificarea planului, emoția pe o scară 1–5, o lecție).
  - B2 figure: un card de jurnal generat automat dintr-un trade; se vede ce câmpuri completează aplicația și care sunt ale tale.
  - B3 match, câmp ↔ la ce folosește: "Thesis" ↔ "What you expected and why"; "Invalidation" ↔ "Where you'd be proven wrong"; "Emotion, 1 to 5" ↔ "Patterns in how you feel"; "Rule followed?" ↔ "Decision Quality and Risk Discipline"; "Lesson" ↔ "What changes next time".
  - B4 predict: "You journal only your losing trades. What does the journal end up showing?" — "A fair record" / "A record tilted towards what went wrong" / "Nothing useful". Răspuns: a doua (R5 PL-07).
  - B5 explain: și deciziile de a nu intra se notează (L14 B7; M10). Scrii în câteva minute, nu peste zile, ca să nu te prindă hindsight-ul (1.2.7).
  - B6 callout: "Your journal is the data behind every review (1.6.5) and every KPI (1.6.7)."
- **Try:** `journal-entry` (S15): un trade închis, cu cifrele completate; în timpul trade-ului, stop-ul a fost mutat de la 48.00 la 47.00.
  - Sarcina: "Complete the journal entry."
  - Reușită: teza scrisă, prețul de invalidare completat, emoția aleasă, „Rule followed?” = No, o lecție scrisă.
  - Feedback la „Yes”: "The log shows the stop moved from 48.00 to 47.00. That breaks the plan."
- **Practică:** Arena (jurnal după fiecare trade); M10 No Trade Is a Trade.
- **Check:** Q1 (mcq, d1) ce câmpuri contează; Q2 (scenario, d2) o decizie de a nu intra, în jurnal; Q3 (mcq, d2) jurnalul selectiv.
- **Dovezi:** — (instrument de proces; R5 PL-07; jurnalul lui Elder, R1 §3.1).
- **Necesită:** S15 (teza, emoția și intrările „no trade” în Journal).
- **Termeni noi de glosar:** — (leagă existentul `journal`)

#### 1.6.5 · Reviewing your decisions  ·  `L17`
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Separate the quality of a decision from the trade's outcome.
  2. Use the journal and replay to review what you knew at each decision point.
  3. Turn a review into one concrete rule to keep, add or change.
- **Concepte:** decision-quality ✓, journaling ✓, counterfactual-thinking ✓, hindsight-bias (nou, 1.2.7)
- **Se sprijină pe:** 1.6.4, 1.6.1, 1.4.5, 0.2.1
- **Hook:** predict · alegere: "Trade A followed the playbook, risked 1% and was stopped out for −1R. Trade B had no stop, sat through −180.00 vUSD and closed at +150.00. Which was the better decision?" — "Trade A" / "Trade B" / "Can't tell from this". Răspuns: A.
- **Interacțiunea centrală:**
  - B2 match „Four boxes”: patru trade-uri ↔ cele patru combinații decizie / rezultat.
  - B3 explain „Three scores”: Decision Quality, Risk Discipline, Simulated Outcome.
  - B4 figure `decision-tree` ca `Flow`, cu nodul nou N4 „Stop kept where planned?”: „A profitable mistake”: 50 de unități la 50.00, stop la 48.00, mutat la 47.00 (risc 150.00), închis la +120.00.
  - B5 hotspot „What could you see?”: tap pe lumânarea 13, ultima vizibilă când s-a mutat stop-ul (hindsight bias și recency bias).
  - B6 order „A review routine”, cu un câmp opțional pentru regula din review.
- **Try:** `expectancy`: "Your journal says this method wins 50% of trades at 1.5R and loses 1R: +0.25R per trade. Three of your last four trades lost. Find the lowest win rate at which the method still breaks even." Reușită: 40%.
- **Practică:** M10 No Trade Is a Trade; M07 Stop or Stay?; Knowledge check: decision making.
- **Check:** q-dm-4, q-dm-5, q-dm-6 (opțional q-dm-10, pentru obiectivul 3).
- **Dovezi:** outcome bias: A (R5 PSY-14). Hindsight bias: B (R5 PSY-13). Recency bias: B (R5 PSY-08).
- **Necesită:** — (redarea propriilor trade-uri din Journal e parțială azi, S15).
- **Termeni noi de glosar:** `recency-bias` (`hindsight-bias` vine din 1.2.7, `decision-quality` din 0.1.6)

#### 1.6.6 · Mistake or variance?
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Sort a losing trade into variance (a valid trade that lost) or a mistake (a broken process).
  2. Tag each mistake with the app's error name.
  3. Explain why only mistakes are worth fixing and why a streak on its own isn't one.
- **Concepte:** mistake-vs-variance (nou), error-taxonomy (nou)
- **Se sprijină pe:** 1.6.5, 0.2.3
- **Hook:** predict · alegere: "Five losses in a row, each following every rule at 1% risk. What should change?" — "The setup: it stopped working" / "Nothing yet: that's within normal variance" / "Double the size to win it back". Răspuns: a doua. La o rată de câștig de 40%, o serie de 5 pierderi apare în 97.6% din seriile de 100 de trade-uri (0.2.3).
- **Interacțiunea centrală:**
  - B1 explain: două găleți (R5 PL-15): varianța e un trade valid care a pierdut, costul obișnuit al meseriei; greșeala e o abatere de la proces și se poate repara.
  - B2 match, 6 trade-uri pierdute ↔ găleată: "All rules followed, stopped at −1R" ↔ Variance; "Entered without a stop" ↔ Mistake; "Stop moved away, lost −2R" ↔ Mistake; "Gap through the stop, −1.4R, sized at 1%" ↔ Variance; "Tripled the size after a loss" ↔ Mistake; "Valid setup, target missed by 0.05, then stopped" ↔ Variance.
  - B3 explain: numele erorilor din aplicație (`packages/evaluation/src/tags.ts`): `no_stop`, `risk_over_limit`, `oversized`, `stop_inside_noise`, `chased_entry`, `moved_stop_away`, `revenge_size_up`, `overtrading`, `broke_playbook`, `misread_conditions` (R5 PL-09).
  - B4 worked „Error cost”: "Stop moved away: lost −2R where the plan allowed −1R. Error cost: −1R.", "Revenge size-up: lost −3R where the plan allowed −1R. Error cost: −2R.", "Chased entry outside the plan: lost −1R where the plan said no trade, 0R. Error cost: −1R.", "Total error cost = ?" Răspuns: −4R.
  - B5 predict: "Six losses in a row at a 40% win rate. How unusual is that over 100 trades?" — "Very rare" / "Common: almost 9 stretches in 10". Răspuns: frecvent (87.3%).
  - B6 callout: "Change rules for mistakes, not for variance. Rule changes go through your plan's own rule (1.6.2)."
- **Try:** `trade-tagger` (din 0.1.5), în modul cu două găleți: 8 trade-uri pierdute dintr-un jurnal.
  - Sarcina: "Sort each loss into Variance or Mistake, and tag every mistake."
  - Reușită: toate 8 în găleata corectă și fiecare greșeală cu eticheta corectă.
- **Practică:** review-ul sesiunilor din Arena, cu etichetele automate (S14); Journal.
- **Check:** Q1 (mcq, d1) găleata unui caz; Q2 (numeric, d2) costul erorilor în R; Q3 (scenario, d2) o serie de pierderi fără nicio greșeală.
- **Dovezi:** Mechanic (probabilitățile seriilor; R5 ST-06). Taxonomia și cele două găleți: instrumente de proces (R5 PL-09, PL-15).
- **Necesită:** S14 (etichetele automate), S15 (costul erorilor în R).
- **Termeni noi de glosar:** `error-tag` (leagă `variance`, din 0.2.3)

#### 1.6.7 · Process KPIs
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Calculate stop integrity, risk accuracy and plan adherence from a list of trades.
  2. Explain why process KPIs mean something after 30 trades while profit doesn't.
  3. Set one process goal for your next 30 trades.
- **Concepte:** process-kpis (nou)
- **Se sprijină pe:** 1.6.6, 0.2.4
- **Hook:** predict · alegere: "After 30 trades, Trader A is up 6% with 8 trades taken without a stop. Trader B is down 2% with every trade by the plan. Who is closer to passing Level 1?" — "A" / "B" / "Neither". Răspuns: B.
- **Interacțiunea centrală:**
  - B1 explain: KPI-urile de proces (R5 PM-17): plan adherence, risk accuracy, stop integrity, limit compliance, journal completeness.
  - B2 worked: "30 trades; 29 had a stop before entry.", "Stop integrity = 29 ÷ 30 = ?" Răspuns: 96.7% (toleranță 0.1). După răspuns: "Above the 95% the Level 1 gate asks for."
  - B3 explain: de ce: pe 20 de trade-uri, chiar și un sistem bun termină pe minus cam o dată din opt (12.6% pentru sistemul de referință din R5 ST-14). Profitul spune puțin la mărimea asta; procesul spune mult.
  - B4 match, KPI ↔ formulă: "Stop integrity" ↔ "Trades with a stop at entry and no widening ÷ all trades"; "Risk accuracy" ↔ "Trades sized within the rule ÷ all trades"; "Plan adherence" ↔ "Trades that match a playbook setup ÷ all trades"; "Limit compliance" ↔ "Days within your limits ÷ days traded".
  - B5 explain: obiective de proces față de obiective de rezultat (R5 PSY-33): "100% stops at entry this week" față de "make 5% this month". Obiectivele de rezultat împing spre poziții prea mari.
  - B6 callout: etapa Nivelului 1: 30 de trade-uri, stop înainte de intrare ≥ 95%, risc corect ≥ 90%, nicio limită depășită, planul v1, Capstone 1.
- **Try:** `kpi-dashboard` (S15): un jurnal de 20 de trade-uri.
  - Sarcina: "Calculate stop integrity, risk accuracy and plan adherence for this log. Then pick one process goal."
  - Reușită: 95.0%, 90.0% și 85.0% (toleranță 0.1 puncte). Obiectivul ales nu se notează.
- **Practică:** blocul de 30 de trade-uri pentru etapă, în Arena, cu panoul KPI (S15).
- **Check:** Q1 (numeric, d1) stop integrity; Q2 (mcq, d2) de ce KPI-urile contează pe eșantioane mici; Q3 (scenario, d2) un obiectiv de proces față de unul de rezultat.
- **Dovezi:** Mechanic (R5 ST-14, binomial exact). KPI-urile ca măsuri de proces: R5 PM-17, PSY-29, PSY-33.
- **Necesită:** S15 (panoul KPI), S14.
- **Termeni noi de glosar:** `process-kpi`, `stop-integrity`, `risk-accuracy`, `plan-adherence`

---

## Unitatea 1.7 · The trader's mind I

- **Scop:** emoțiile ca normalitate și ca informație; FOMO, revenge trading și loss aversion; gambler's fallacy; outcome bias pe propriile trade-uri; plictiseala și overtrading-ul; regulile if-then; pauza.
- **De ce aici:** remediile sunt planul, checklist-ul, jurnalul și review-ul din 1.6 (ca în U5). R5 §10 Nivelul 1, punctul 10, cere PSY-02, PSY-10, PSY-18 și PSY-24 cu detectoarele pornite; README §4 pune la Nivelul 1 FOMO, revenge și pauza. Tonul e normalizator: toată lumea simte aceste impulsuri; scopul e o regulă care ține atunci când apar.
- **Cere de dinainte:** 1.6.1 (playbook, Flow-ul de decizie), 1.6.4 (jurnalul), 1.4.1 și 1.4.3 (risc, stop), 0.2.3 (serii).
- **Checkpoint:** partea L13 din `test-psychology` (q-psy-1 … q-psy-5, q-psy-10 … q-psy-12) + 12 întrebări noi pentru 1.7.1 și 1.7.3–1.7.7. Întrebările L18 (q-psy-6 … q-psy-9) urcă la 2.12. La ≥ 80%, cele 7 lecții se marchează „Tested out”.
- **Laboratorul unității:** M06 The FOMO Trap și M07 Stop or Stay? (există); „Guard-rails on”: o săptămână de sesiuni în Arena cu detectoarele (S14), pauza și limita zilnică active. Raportul arată de câte ori s-a declanșat fiecare și de câte ori a fost ocolită.
- **Firele din spirală:** Psihologie (centrul unității), Proces (reguli if-then și pauza scrise în plan), Statistică (gambler's fallacy, eșantioane mici), Costuri (overtrading-ul).
- **Surse:** R5 PSY-01, PSY-02, PSY-06, PSY-10, PSY-14, PSY-15, PSY-16, PSY-18, PSY-23 (previzualizare), PSY-24 … PSY-28, PSY-37, RR-02, RR-03; R1 PS-02, PS-03, §4.10; R6 §5.6.
- **Lecții existente:** L13 → 1.7.2, fără schimbări de conținut; „Pregătește L18” devine 2.12. Decizia D11 (durata pauzei) se închide în 1.7.7: utilizatorul își alege durata în planul v1.1, iar L18 o refolosește.
- **Widget-uri noi și extinderi:** `emotion-check-in`; refolosite: `bias-spotter` (L13), `streak-sim` (modul cu monedă), `blind-grade` (pe trade-urile proprii), `decision-replay` (modul cool-down), `plan-builder` (secțiunea if-then).

#### 1.7.1 · Emotions are normal
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Name fear, greed, hope and regret in common trading moments.
  2. Rate your emotional state from 1 to 5 before and after a trade.
  3. Explain why strong emotional reactions to gains and losses go with worse decisions.
- **Concepte:** emotions-in-trading (nou)
- **Se sprijină pe:** 1.6.4
- **Hook:** auto-verificare · alegere: "Your open long is up 150.00 and rising fast. What do you feel most?" — "Excitement: time to add more" / "Fear of giving it back" / "Calm: the plan decides" / "Hope it goes much higher". Nu are răspuns corect. Recap: "Everyone feels these. What matters is what the plan does next."
- **Interacțiunea centrală:**
  - B1 explain: emoțiile sunt semnale normale. Scopul nu e să nu le mai simți, ci să ai reguli care țin atunci când apar.
  - B2 match, moment ↔ emoție: "Price nears your stop" ↔ Fear; "Up a lot, urge to add without a setup" ↔ Greed; "Holding a loser: 'it'll come back'" ↔ Hope; "You skipped a setup and it ran without you" ↔ Regret.
  - B3 explain: Lo, Repin & Steenbarger (2005) au urmărit 80 de day traderi timp de cinci săptămâni. Cei cu reacții emoționale mai intense, la câștiguri și la pierderi deopotrivă, au avut rezultate semnificativ mai slabe; nu a ieșit la iveală o „personalitate de trader” (R5 PSY-25).
  - B4 explain: prea puțină și prea multă agitație strică deopotrivă; oboseala, somnul prost și boala sunt motive să tranzacționezi mai mic sau deloc. Studiile fiziologice sunt mici (R5 PSY-26), dar regula intră în plan ca linia „fit to trade” (1.6.2).
  - B5 order, când apare un impuls puternic: "Notice it" → "Name it" → "Rate it, 1 to 5" → "Check the plan" → "Decide".
  - B6 callout: "An emotion is information about you, not about the market."
- **Try:** `emotion-check-in` (widget nou): 3 trade-uri simulate, redate pe rând; câte un check-in înainte de intrare și după ieșire (scara 1–5 și o etichetă: fear, greed, hope, regret, calm).
  - Sarcina: "Complete the check-ins for these three trades."
  - Reușită: toate cele 6 check-in-uri completate (sarcină de proces). După, aplicația pune notele lângă respectarea regulilor, nu lângă P&L.
- **Practică:** Arena, cu check-in-urile pornite (S15).
- **Check:** Q1 (mcq, d1) emoția dintr-un moment dat; Q2 (mcq, d2) ce au găsit Lo, Repin & Steenbarger; Q3 (scenario, d2) o zi în care nu ești „fit to trade”.
- **Dovezi:** B pentru legătura dintre reactivitatea emoțională și rezultate (eșantion mic; R5 PSY-25). Afirmațiile fiziologice: C/D (Coates & Herbert 2008, 17 traderi; R5 PSY-26).
- **Necesită:** S15 (câmpurile de emoție din Journal), S14.
- **Termeni noi de glosar:** `fit-to-trade`

#### 1.7.2 · FOMO, revenge and loss aversion  ·  `L13`
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Recognise FOMO, revenge trading and loss aversion in your own decisions.
  2. Use rules written in advance to counter emotional decisions.
  3. Take a set pause before acting after a strong move or a loss.
- **Concepte:** fomo ✓, revenge-trading ✓, loss-aversion ✓, confirmation-bias ✓
- **Se sprijină pe:** 1.7.1, 1.6.1, 1.4.3, 1.4.1
- **Hook:** auto-verificare · alegere: "You were stopped out for −100.00 vUSD ten minutes ago. A new setup appears and looks good. What would you do next?" — "Take it at my usual 1% risk" / "Take it at 3%, to win the loss back" / "Pause first, then check it against my plan" / "Close the app for today". Nu se notează; recap-ul arată ce spune un plan scris dinainte.
- **Interacțiunea centrală:**
  - B2 figure „FOMO”: o urcare de la 100.00 la 106.00 în cinci lumânări; cu stop-ul la 103.00, același buget de 100.00 dă 32 de unități la urmărirea prețului și 62 după un pullback la 104.50, cu costuri.
  - B4 worked „What revenge sizing costs”: 100.00 + 297.00 = 397.00, față de 199.00 cu planul.
  - B5 explain și figură „Loss aversion”: un stop mutat la dublul distanței ridică pierderea planificată la aproximativ 200.00; sunk cost-ul pe scurt.
  - B6 match „A rule for each trap”: FOMO, revenge, loss aversion, confirmation bias ↔ câte o regulă scrisă dinainte.
  - B7 figure `decision-tree` ca `Flow`, cu nodul de pauză N0: după o pierdere, întâi pauza; dublarea mărimii pică la nodul de risc.
- **Try:** `bias-spotter` (widget nou): patru carduri → FOMO / Revenge trading / Loss aversion / Confirmation bias. Reușită: toate patru corecte.
- **Practică:** M06 The FOMO Trap; M07 Stop or Stay?; Knowledge check: psychology.
- **Check:** q-psy-2, q-psy-5, q-psy-4.
- **Dovezi:** loss aversion: B (λ ≈ 2.25 e ilustrativ, dintr-un eșantion mic; R5 PSY-01, PSY-02). FOMO și tranzacționarea pe atenție: B (cumpărările în turmă pe Robinhood, urmate de ≈ −3% în 5 zile; R5 PSY-16). Revenge trading ca tipar: C (detectorul e definit de aplicație; R5 PSY-18).
- **Necesită:** — (widget nou `bias-spotter`); S14 pentru detectoare în practică.
- **Termeni noi de glosar:** — (toți există; propun `lesson: "L13"` pentru `confirmation-bias` și `overtrading`)

#### 1.7.3 · The gambler's fallacy
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Explain why a run of losses doesn't make a win 'due'.
  2. Spot size changes driven by a streak rather than by the plan.
  3. Keep risk per trade the same through winning and losing streaks.
- **Concepte:** gamblers-fallacy (nou)
- **Se sprijină pe:** 1.7.2, 0.2.3
- **Hook:** predict · alegere: "Six losses in a row on a setup that wins 50% of the time. What's the chance the next one wins?" — "More than 50%: it's due" / "50%" / "Less than 50%". Răspuns: 50%, dacă rezultatele sunt independente. Recap: un setup poate să nu mai funcționeze, dar seria singură nu o arată (0.2.3, 1.6.6).
- **Interacțiunea centrală:**
  - B1 explain: gambler's fallacy așteaptă o întoarcere după o serie; hot-hand fallacy așteaptă continuarea ei (R5 PSY-10).
  - B2 figure `Bars`: 10,000 de aruncări simulate; după fiecare serie de 5 „pajuri”, ce a urmat: în jur de 50% „cap”.
  - B3 explain: în datele de la ruletă, după șase rotiri cu aceeași culoare, în jur de 85% dintre jucători pariază pe cealaltă culoare (rezumat secundar; R5 PSY-10).
  - B4 predict: "You've won 5 in a row. Do you double your size for the next trade?" — "Yes, I'm on fire" / "No, risk stays at 1%". Răspuns: nu (hot hand).
  - B5 explain: pe piețe, rezultatele se pot aduna pe regimuri (Miller & Sanjurjo: dacă seriile există e o întrebare empirică; R5 PSY-10). Răspunsul e o regulă din plan (un prag de review), nu o senzație.
  - B6 match, gând ↔ capcană: "I'm due a win" ↔ Gambler's fallacy; "I'm on fire, size up" ↔ Hot hand; "Three losses: this setup is dead" ↔ "Small sample (0.2.4)"; "Five wins: I've cracked it" ↔ "Small sample and overconfidence (2.12)".
  - B7 callout: "Risk per trade stays the same after wins and after losses."
- **Try:** `streak-sim` în modul joc cu monedă (R5 PSY-10): 30 de aruncări din secvențe cu serii lungi, dar independente; mărimea pariului se alege înaintea fiecărei aruncări.
  - Sarcina: "Your plan bets 1% every time. Play 30 flips."
  - Reușită: mărimea rămâne neschimbată (sarcină de proces). La final, aplicația arată ce ar fi pierdut regula „double after a loss” pe aceeași secvență (legătura cu 1.8.1).
- **Practică:** Arena (detectorul de mărime după serii, S14).
- **Check:** Q1 (mcq, d1) următorul rezultat independent; Q2 (scenario, d2) mărimea după o serie de câștiguri; Q3 (scenario, d2) o serie față de dovada că un setup s-a stricat.
- **Dovezi:** Mechanic (independența). Dovezile comportamentale: B (R5 PSY-10; rezumat secundar).
- **Necesită:** S14 (detectorul de mărime după serii).
- **Termeni noi de glosar:** `gamblers-fallacy`, `hot-hand`

#### 1.7.4 · Outcome bias in your own trades
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Grade your own trade's process before you see its result.
  2. Recognise when a lucky win is reinforcing a broken rule.
  3. Recognise when an unlucky loss tempts you to drop a sound rule.
- **Concepte:** outcome-bias (nou, 0.2.1), decision-quality ✓
- **Se sprijină pe:** 1.7.3, 1.6.5, 0.2.1
- **Hook:** auto-verificare · alegere: "You moved your stop away and the trade came back to +2R. Next time price nears your stop, what are you more likely to do?" — "Move it again" / "Leave it" / "Not sure". Recap: "A profit just rewarded a broken rule. That's how bad habits get stronger."
- **Interacțiunea centrală:**
  - B1 explain: să știi de bias nu te scapă de el: replicarea din 2023 l-a găsit și la cei care spuneau că rezultatul n-ar trebui să conteze (R5 PSY-14).
  - B2 figure, două bucle: decizie proastă + rezultat bun → obiceiul se întărește („the most dangerous box”, L17); decizie bună + rezultat prost → regula e abandonată.
  - B3 predict „Grade before reveal”: 3 dintre trade-urile proprii din Arena (sau trade-uri de exemplu, dacă sunt mai puține): întâi nota de proces, apoi P&L-ul; aplicația compară nota cu propriul ei scor de proces (R5 PL-08).
  - B4 explain: câștigurile par abilitate, pierderile ghinion (self-attribution; R5 PSY-23). Tratarea completă vine în 2.12.
  - B5 predict: "After three rule-following losses, a friend says: 'Your stop is too tight, widen it.' What's the evidence?" — "Three losses" / "Not enough: three trades are a tiny sample". Răspuns: a doua; schimbarea trece prin regula planului (1.6.2).
  - B6 callout: "Grade first. Look at the P&L second."
- **Try:** `blind-grade` (din 0.2.1), pe ultimele 5 trade-uri din Arena ale utilizatorului (S15), cu P&L-ul ascuns până după notă.
  - Reușită: 5 note date înaintea reveal-ului (sarcină de proces). Se afișează potrivirea cu scorul de proces al aplicației.
- **Practică:** Arena și review-ul din jurnal.
- **Check:** Q1 (scenario, d1) un câștig norocos cu o regulă încălcată; Q2 (scenario, d2) o pierdere ghinionistă cu o regulă bună; Q3 (mcq, d2) de ce nu ajunge să știi de bias.
- **Dovezi:** A pentru outcome bias (R5 PSY-14). Self-attribution: B (R5 PSY-23).
- **Necesită:** S15 (P&L ascuns până după nota de proces).
- **Termeni noi de glosar:** — (`outcome-bias` vine din 0.2.1)

#### 1.7.5 · Boredom and overtrading
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Recognise trades taken to relieve boredom rather than because a setup appeared.
  2. Calculate what extra, off-plan trades cost in R.
  3. Treat sitting on your hands as a valid, scored decision.
- **Concepte:** overtrading (nou), action-bias (nou)
- **Se sprijină pe:** 1.7.4, 1.4.6
- **Hook:** auto-verificare · alegere: "Three quiet hours, no setup. A small move appears that isn't in your plan. What do you do?" — "Take it, small" / "Wait" / "Relax my rules for today". Nu se notează.
- **Interacțiunea centrală:**
  - B1 explain: action bias e preferința de a face ceva în loc să aștepți; plictiseala produce trade-uri fără setup (R5 PSY-24). Overtrading înseamnă să tranzacționezi mai des decât îți permit setup-urile, adesea ca să recuperezi pierderi.
  - B2 explain: Barber & Odean (din 0.1.4): cele mai active gospodării au câștigat 11.4% pe an, piața 17.9%; costurile și frecvența explică diferența (R5 RR-02, PSY-06).
  - B3 worked: "Four extra trades a day, no edge, costs about 0.10R each.", "Per day: 4 × 0.10R = 0.40R.", "Over 20 trading days = ?" Răspuns: 8R. După răspuns: "Eight times your risk per trade, paid for nothing." (R5 RR-03)
  - B4 match, impuls ↔ regulă: "Bored, nothing happening" ↔ "A move that isn't in the plan isn't a trade"; "Two wins, feeling sharp" ↔ "Max trades per day"; "Down on the day, want it back" ↔ "Pause, then the daily limit"; "Small target, many trades" ↔ "Check the target against costs (1.1.5)".
  - B5 predict: "In MARKET//LAB, does a well-reasoned 'no trade' earn anything?" — "No" / "Yes: Decision Quality". Răspuns: da (M10).
  - B6 callout: "Quiet markets are where costs eat the most. Waiting is a position."
- **Try:** `decision-replay` (din 1.4.9): o sesiune liniștită, cu 8 puncte de decizie; 2 sunt setup-uri valide din playbook, 6 nu.
  - Sarcina: "Trade the session by your plan."
  - Reușită: cele 2 setup-uri valide luate (sau sărite, cu un motiv scris) și celelalte 6 sărite. Feedback la un non-setup luat: "Not in your playbook. That's a trade for boredom, not for a reason."
- **Practică:** Arena: low volatility; Arena: sideways; M10 No Trade Is a Trade.
- **Check:** Q1 (mcq, d1) un trade din plictiseală; Q2 (numeric, d2) costul trade-urilor în plus, în R; Q3 (scenario, d2) „no trade” ca decizie notată.
- **Dovezi:** A (Barber & Odean; R5 RR-02, PSY-06). Mechanic pentru aritmetica costurilor (R5 RR-03).
- **Necesită:** S14 (detectorul `overtrading`; eticheta există).
- **Termeni noi de glosar:** `action-bias` (leagă existentul `overtrading`)

#### 1.7.6 · If-then rules
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Write an if-then rule with an observable trigger and a concrete action.
  2. Turn three common urges into if-then rules in your plan.
  3. Explain why decisions made in advance hold better than willpower in the moment.
- **Concepte:** if-then-rules (nou)
- **Se sprijină pe:** 1.7.5, 1.6.2
- **Hook:** predict · alegere: "Which rule is more likely to hold after a painful loss?" — "Stay calm and don't revenge trade" / "If a trade hits its stop, then I close the ticket and wait 30 minutes before the next decision". Răspuns: a doua (un declanșator și o acțiune precise).
- **Interacțiunea centrală:**
  - B1 explain: intențiile de implementare: „dacă se întâmplă X, atunci fac Y” (Gollwitzer [BK]; R5 PSY-28).
  - B2 match, impuls ↔ regulă if-then: cele patru reguli din L13, rescrise ca if-then.
  - B3 order, construcția unei reguli: "Name a trigger you can observe" → "Name the action" → "Say how you'll know you did it".
  - B4 explain: guard-rails: setări care fac acțiunea corectă ușoară și pe cea greșită grea: stop obligatoriu, blocarea zilnică, cronometrul de pauză, mărimi presetate, P&L ascuns (R5 PSY-37). Cunoașterea unui bias nu-l elimină; structura ajută (R5 PSY-14).
  - B5 predict, rescrierea unei reguli vagi: "Don't chase" → care variantă e cea mai bună? Răspunsul: "If price is more than one normal candle (0.40) beyond my planned entry, then I don't enter and wait for a pullback."
  - B6 callout: "Write your if-then rules into your plan. That makes it v1.1."
- **Try:** `plan-builder`, secțiunea if-then.
  - Sarcina: "Write three if-then rules for your plan, starting from the templates."
  - Reușită: fiecare regulă are un declanșator observabil (un număr, un eveniment sau o oră) și o acțiune din listă (pause, skip, close, resize, review, stop for the day); verificatorul controlează ambele părți.
- **Practică:** Arena, cu guard-rails configurate (S18 pentru blocarea zilnică, S14 pentru pauză).
- **Check:** Q1 (mcq, d1) o regulă if-then bine formată; Q2 (scenario, d2) transformarea unui impuls în regulă; Q3 (mcq, d2) de ce regulile bat voința de moment.
- **Dovezi:** intențiile de implementare: B (R5 PSY-28 [BK]). Guard-rails: B/C (R5 PSY-37).
- **Necesită:** S14, S18.
- **Termeni noi de glosar:** `if-then-rule`, `guard-rail`

#### 1.7.7 · The pause
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Set a pause length in your plan and take it after a loss or a sharp move.
  2. Use the pause for a fixed routine: step away, check in, reframe, run the checklist.
  3. Ask the 'fresh eyes' question before re-entering or holding a losing trade.
- **Concepte:** cooling-off-pause (nou)
- **Se sprijină pe:** 1.7.6, 1.7.2
- **Hook:** predict · alegere: "You were stopped out two minutes ago and a setup appears. What does waiting 15 minutes cost you?" — "I might miss it" / "Very little: a valid setup can wait, or another will come" / "My win rate drops". Răspuns: a doua.
- **Interacțiunea centrală:**
  - B1 explain: regula din L13 (pauză după o pierdere sau o mișcare mare). Aici: cât durează (o alegi tu, D11) și ce faci în timpul ei.
  - B2 figure: Flow-ul din L13, cu nodul N0 „Loss or big move just now?” și un cronometru pe ramura de pauză.
  - B3 order, rutina pauzei: "Close the ticket" → "Step away from the screen" → "Check in: rate yourself 1 to 5" → "Reframe: one loss is one draw from many" → "Run the checklist" → "Decide, and write it down".
  - B4 explain: reîncadrarea, făcută înainte să crească emoția, merge mai bine decât reprimarea („I feel nothing”) (Fenton-O'Creevy et al. 2011, studiu calitativ în patru bănci; R5 PSY-27).
  - B5 predict „Fresh eyes”: "You're holding a loser. If you had no position now, would you open this one, at this size?" — "Yes" / "No". La „No”, ieși sau reduci, iar decizia se notează (R5 PSY-15).
  - B6 callout: "The pause is a rule, not a punishment. The daily limit is its long version (1.4.9)."
- **Try:** `decision-replay`, în modul cool-down (S14): după un stop-out pornește cronometrul, iar biletul rămâne blocat până la terminarea rutinei.
  - Sarcina: "Choose your pause length, then handle the setup that appears after the stop-out."
  - Reușită: durata aleasă (5–60 de minute), rutina terminată, decizia notată cu un motiv și, dacă intri, risc ≤ 1%.
- **Practică:** Arena, cu pauza activă (S14).
- **Check:** Q1 (mcq, d1) când se aplică pauza; Q2 (scenario, d2) întrebarea „fresh eyes” pe o poziție pe pierdere; Q3 (mcq, d2) reîncadrare față de reprimare.
- **Dovezi:** C (R5 PSY-27, studiu calitativ; PSY-18; detectoarele sunt definite de aplicație).
- **Necesită:** S14 (cronometrul de pauză, detectorul de revenge).
- **Termeni noi de glosar:** `cooling-off-pause`, `reappraisal`

---

## Unitatea 1.8 · Danger zone

- **Scop:** ce distruge conturi și cum arată din afară: martingale și averaging down, grid, promisiunile de tip „holy grail”, vânzătorii de semnale, țepele și brokerii nereglementați, iluzia levierului.
- **De ce aici:** R6 §7 Stage 0 vrea modulul de avertizare devreme, „so learners never adopt these”. Aici, la finalul Nivelului 1, utilizatorul are uneltele ca să vadă *de ce*: valoarea așteptată (0.2.2), seriile (0.2.3), survivorship (0.2.6), riscul pe trade, expunerea și drawdown-ul (1.4). Nota F (README §6) cere matematica ruinei, nu doar un avertisment.
- **Cere de dinainte:** 0.2.2, 0.2.3, 0.2.6, 1.4.1, 1.4.7, 1.4.8, 1.7.3.
- **Checkpoint:** bancă nouă `test-danger_zone`, 10 itemi: o serie de dublări, pierderea unui grid, citirea unei promisiuni de performanță, semnalele de alarmă la un broker, levierul efectiv. La ≥ 80%, cele 5 lecții se marchează „Tested out”.
- **Laboratorul unității:** „Blow-up lab” (R6 §2.15): utilizatorul rulează un bot martingale și unul grid pe un range (R2), apoi pe o secvență care se termină într-un trend (R1). Înainte de fiecare rulare estimează partea din căi care ajung la ruină, apoi vede distribuția și o compară cu estimarea.
- **Firele din spirală:** Risc (ruina), Statistică (EV negativ ascuns de o rată mare de câștig; seriile), Dovezi (nota F; survivorship; scăderea după publicare), Costuri (un joc corect devine negativ după costuri).
- **Surse:** R6 §0.4, §2.15, §2.16, §2.17, §4.5, §5.4, §5.6; R5 RF-15 … RF-20, TM-03, ST-06, ST-11, RR-04, RR-05; R1 §1.7, RG-01, RG-02, RG-05, §4.4, §4.8; R3 §1.10.
- **Widget-uri noi și extinderi:** `blow-up-lab`, `claim-checker` (mod al lui `card-sort`), `broker-chooser`; `exposure` primește modul de levier efectiv (S11).

#### 1.8.1 · Martingale and averaging down
- **Nivel / durată / tip:** Beginner · 7 min · Core
- **Obiective:**
  1. Calculate the size and the total loss of a doubling sequence after a run of losses.
  2. Explain why a very high win rate can hide a ruinous loss.
  3. Tell averaging down from a planned split entry with a fixed total risk.
- **Concepte:** martingale (nou), averaging-down (nou)
- **Se sprijină pe:** 0.2.2, 0.2.3, 1.4.1, 1.7.3
- **Hook:** predict · alegere: "Start with 1 unit and double after each loss. After 7 losses in a row, how big is the next bet?" — "14" / "64" / "128". Răspuns: 128, cu 127 deja pierdute (R5 RF-15).
- **Interacțiunea centrală:**
  - B1 explain: martingale înseamnă dublarea după fiecare pierdere, ca primul câștig să recupereze tot plus miza inițială. Averaging down, adică adăugarea la o poziție pe pierdere, e martingale deghizat (R6 §2.15; R5 RF-15).
  - B2 worked „The doubling table”: "Bets: 1, 2, 4, 8, 16, 32, 64.", "Lost so far = 1 + 2 + 4 + 8 + 16 + 32 + 64 = ?" Răspuns: 127. După răspuns: "The next bet is 128, to win back 127 and make 1."
  - B3 figure: curba de equity a unui bot martingale: o urcare lină pe un range (R2), apoi o prăbușire când vine un trend (R1) (R6 §2.15).
  - B4 explain: matematica: cu bani și mărime limitate, dublarea nu poate câștiga pe termen lung. Profitul așteptat pe ciclu e zero într-un joc corect și devine negativ când costurile împing șansa de pierdere peste o jumătate (R6 §2.15). Seriile: la 50%, o serie de 8 pierderi în 100 de încercări apare în 17% din cazuri (R5 ST-06); la ruletă, o serie de 6 pierderi în 200 de rotiri apare în aproximativ 84% din cazuri, iar una de 10, care costă de 1,023 de ori miza inițială, în aproximativ 11% (R6 §2.15).
  - B5 worked „Averaging down”: "Buy 50 at 100.00, stop planned at 98.00: 1R = 100.00.", "At 98.00, instead of exiting, buy 50 more: average price 99.00.", "Price falls to 96.00: 100 units × 3.00 = ?" Răspuns: 300.00, adică 3R.
  - B6 predict, două cazuri: "You planned 50 units in two halves, one stop for both, total risk 1R" → intrare împărțită, permisă (2.7); "You add to a loser because it's 'cheaper now'" → averaging down, nota F (R5 TM-03).
  - B7 callout: "Doubling after losses and averaging down without a limit lead to ruin by construction. Grade F. The simulator flags both."
- **Try:** `blow-up-lab` (laborator nou; R6 §2.15): un bot martingale cu prima miză de 10.00 și un capital de 10,000.00, pe aruncări corecte de monedă, fără costuri. După 9 pierderi la rând a pierdut 5,110.00 și nu mai poate plasa miza de 5,120.00.
  - Sarcina: "Before running 1,000 flips, predict the chance this bot hits 9 losses in a row and blows up. Then run it."
  - Reușită: predicția introdusă, rularea făcută și explicația aleasă: "A long losing run is rare on any one flip but likely over many flips, and the capital is finite."
  - Rezultatul afișat: 62.4% din căile de 1,000 de aruncări ajung la seria de 9 (calcul exact). Căile care scapă arată câștiguri mici și constante; cele care o ating pierd peste jumătate din cont într-o singură secvență. În medie, rezultatul e zero înainte de costuri și negativ după.
- **Practică:** laboratorul `blow-up-lab`, pe R2 și apoi pe R1.
- **Check:** Q1 (numeric, d1) miza după n pierderi; Q2 (numeric, d2) pierderea unei poziții la care s-a adăugat în pierdere; Q3 (scenario, d2) intrare împărțită față de averaging down.
- **Dovezi:** F (R6 §2.15; R5 RF-15; README §6).
- **Necesită:** S7 (căile aleatoare) și laboratorul; S14 (detectarea adăugării la pierdere și a creșterii mărimii după pierdere).
- **Termeni noi de glosar:** `martingale`, `averaging-down`, `blow-up`

#### 1.8.2 · Grid trading
- **Nivel / durată / tip:** Beginner · 5 min · Core
- **Obiective:**
  1. Describe how a grid without stops adds exposure as price moves away.
  2. Calculate the open loss of a grid after a one-way move.
  3. Explain why a grid's smooth equity curve hides the risk of ruin.
- **Concepte:** grid-trading (nou)
- **Se sprijină pe:** 1.8.1, 1.4.7
- **Hook:** predict · alegere: "A grid bot buys 10 units at every 1.00 step down from 100.00 and sells each at +1.00. It has won 40 trades in a row. Now price falls from 100.00 to 90.00 without a bounce. How many units does it hold?" — "10" / "50" / "100". Răspuns: 100 (cumpărături la 99.00, 98.00 … 90.00).
- **Interacțiunea centrală:**
  - B1 explain: un grid pune ordine la pași ficși în jurul unui preț, adesea fără stop-uri, și adaugă poziții pe măsură ce prețul se îndepărtează (R6 §2.15).
  - B2 figure: același grid pe un range (multe câștiguri mici) și pe un trend (pozițiile se adună).
  - B3 worked: "100 units bought from 99.00 down to 90.00: average price 94.50.", "Price now: 90.00.", "Open loss = 100 × (94.50 − 90.00) = ?" Răspuns: 450.00. După răspuns: "That's 9,450.00 of position value, almost the whole account, after a 10% fall."
  - B4 explain: Taranto & Khan (2020): un grid „will almost surely ruin an investment account in the long term”, deși pe termen scurt pare să bată piața (R6 §2.15). În matricea strategie × regim: ++ într-un range, „until it isn't”, −−− într-un trend (R6 §2.17).
  - B5 predict: trei curbe de equity: "Which one is the grid bot?" Răspuns: urcarea lină care se termină într-o prăbușire.
  - B6 callout: "Grade F. Many prop firms ban grid and martingale outright." (R6 §5.6)
- **Try:** `blow-up-lab`, în modul grid: 5 unități la fiecare pas de 1.00 sub 100.00, fiecare vândută la +1.00.
  - Sarcina: "Find the size of the one-way fall at which the grid's open loss first passes 5% of the account (500.00)."
  - Reușită: 15.00 (la 85.00: 75 de unități, preț mediu 92.00, pierdere deschisă 525.00; la 86.00: 455.00).
- **Practică:** laboratorul, pe R2 și apoi pe o secvență care se termină în R1.
- **Check:** Q1 (numeric, d1) unitățile deținute după o cădere; Q2 (numeric, d2) pierderea deschisă; Q3 (mcq, d2) de ce înșală curba lină.
- **Dovezi:** F (R6 §2.15, §2.17).
- **Necesită:** S7 și laboratorul.
- **Termeni noi de glosar:** `grid-trading`

#### 1.8.3 · Holy grails and survivorship bias
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Check a performance claim for sample size, costs, period, worst loss and selection.
  2. Explain how survivorship and cherry-picking make random results look skilled.
  3. Apply the publication-decay rule of thumb to any published edge.
- **Concepte:** performance-claims (nou), survivorship-bias (nou, 0.2.6)
- **Se sprijină pe:** 1.8.2, 0.2.6, 1.2.7
- **Hook:** predict · alegere, pe o reclamă: "Our system: 92% win rate, +340% last year." "What's the first thing to ask?" — "How do I buy it?" / "How many trades, after which costs, and what was the largest loss?" / "Which indicator does it use?". Răspuns: a doua.
- **Interacțiunea centrală:**
  - B1 explain: lista de verificare a unei promisiuni: numărul de trade-uri, perioada, costurile, cea mai mare pierdere și drawdown-ul maxim, backtest sau rezultate reale, câte sisteme au fost încercate înainte, comparația cu benchmark-ul.
  - B2 figure: generatorul de „guru” din 0.2.6, ca reclamă: 1,000 de sisteme aleatoare, cel mai bun arătat singur, apoi toate 1,000.
  - B3 explain: o rată mare de câștig cu o pierdere rară și uriașă (jocul B din 0.2.2; 1.8.1; 1.8.2). „92%” nu spune nimic fără mărimea pierderilor.
  - B4 explain: McLean & Pontiff: 97 de predictori publicați au câștigat cu 26% mai puțin out-of-sample și cu 58% mai puțin după publicare (README §6; R6 §0.4). Chiar și avantajele reale se micșorează odată ce sunt cunoscute.
  - B5 match, semnal de alarmă ↔ de ce: "Guaranteed returns" ↔ "No edge is guaranteed"; "Only winning months shown" ↔ "Cherry-picking"; "Backtest only, no live record" ↔ "May be fitted to the past"; "Results without costs" ↔ "Costs can erase the edge"; "Thousands of happy members" ↔ "Survivors speak; losers don't".
  - B6 callout: "Ask who earns what when you buy it." (conflictele de interese, R1 §4.8)
- **Try:** `claim-checker` (widget nou, mod al lui `card-sort`): 4 promisiuni de marketing; pentru fiecare, informația care lipsește și un verdict („Can't judge yet” sau „Red flag”). Reușită: toate patru corecte.
- **Practică:** laboratorul `guru-generator` (0.2.6), în vederea „showcase”.
- **Check:** Q1 (mcq, d1) prima întrebare pentru o promisiune; Q2 (scenario, d2) survivorship într-o reclamă; Q3 (mcq, d2) scăderea după publicare.
- **Dovezi:** A pentru scăderea după publicare (McLean & Pontiff 2016; R6 §0.4). Survivorship: Mechanic (R5 ST-11; R1 §4.4).
- **Necesită:** S7.
- **Termeni noi de glosar:** `out-of-sample` (leagă `cherry-picking`, din 1.2.7, și `survivorship-bias`, din 0.2.6)

#### 1.8.4 · Signal sellers, scams and unregulated brokers
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Check a broker's licence on the regulator's own register.
  2. Recognise the red flags of scams, signal services and pay-to-play challenges.
  3. Explain the conflict of interest when a broker is the counterparty to your trades.
- **Concepte:** broker-due-diligence (nou), scam-red-flags (nou)
- **Se sprijină pe:** 1.8.3, 0.1.5
- **Hook:** predict · alegere: "A broker offers 500:1 leverage, a 100% deposit bonus and a personal account manager. It is registered offshore. How many red flags?" — "One" / "Two" / "Four". Răspuns: patru (R6 §5.4).
- **Interacțiunea centrală:**
  - B1 explain: cine reglementează: în UE, autoritățile naționale coordonate de ESMA (în România, ASF); în UK, FCA; în SUA, SEC și FINRA, CFTC și NFA. Licența se verifică în registrul regulatorului, nu pe site-ul brokerului (R6 §5.4; R1 RG-01). Conținutul are dată.
  - B2 match, semnal de alarmă ↔ de ce: "Deposit bonus" ↔ "Incentives are banned for EU retail CFDs (ESMA)"; "Guaranteed monthly returns" ↔ "No market return is guaranteed"; "Pressure to deposit more, now" ↔ "A sales tactic"; "Slow or blocked withdrawals" ↔ "A classic sign of fraud"; "Offshore licence only" ↔ "Little protection for you".
  - B3 explain: banii clienților: brokerii reglementați îi țin separat; schemele de compensare au limite și nu acoperă niciodată pierderile din tranzacționare (SIPC: până la $500,000, din care $250,000 în numerar; schemele din UE: cel puțin €20,000; de verificat la publicare) (R6 §5.4).
  - B4 explain: modelele de execuție: un broker A-book îți trimite ordinul mai departe; unul B-book ia partea cealaltă. Pierderea clientului devine atunci venitul brokerului: un conflict structural, legal și reglementat, nu automat abuziv (R6 §5.4; R3 §1.10).
  - B5 explain: vânzătorii de semnale și copy trading-ul: D/F (survivorship, stimulente, întârzieri; R6 §2.16); pump-and-dump (R1 RG-05); „provocările” plătite de tip funded trader: venit din taxe, rate de trecere estimate la 5–10%, neauditate (R6 §5.6). Tratarea completă vine în 4.5.
  - B6 callout: "If someone contacts you first with an opportunity, treat it as a scam until you've checked it yourself."
- **Try:** `broker-chooser` (widget nou; exercițiul din R6 §5.4): 5 brokeri fictivi (nume inventate, nicio firmă reală), fiecare cu un profil: regulator și număr de licență, offshore sau nu, levier, bonus, spread-uri, modelul de execuție, recenziile despre retrageri.
  - Sarcina: "Flag every red flag, then pick the brokers you'd consider."
  - Reușită: toate semnalele principale marcate; alese doar cele două profiluri curate.
- **Practică:** laboratorul `broker-chooser`, cu un set nou de profiluri.
- **Check:** Q1 (mcq, d1) unde verifici o licență; Q2 (scenario, d2) semnalele de alarmă dintr-o ofertă; Q3 (mcq, d2) conflictul B-book.
- **Dovezi:** Mechanic (reglementare și scheme de compensare, cu dată și pe jurisdicții; R6 §5.4; R1 §1.7). Semnale și copy trading: D/F (R6 §2.16). Statisticile provocărilor de prop: estimări neauditate (R6 §5.6).
- **Necesită:** —
- **Termeni noi de glosar:** `signal-service`, `segregated-funds`, `pump-and-dump`, `b-book`

#### 1.8.5 · The leverage illusion
- **Nivel / durată / tip:** Beginner · 6 min · Core
- **Obiective:**
  1. Calculate effective leverage as position value ÷ equity.
  2. Work out the price move that wipes out an account at a given effective leverage.
  3. Explain why a broker's close-out is a failure of sizing, not a protective stop.
- **Concepte:** effective-leverage (nou), margin-close-out (nou), leverage ✓
- **Se sprijină pe:** 1.4.7, 1.8.4
- **Hook:** predict · alegere: "Your broker offers 1:500. Trader A holds positions worth 2 times her equity; Trader B, 20 times his. Who carries more risk?" — "Both the same: the broker's 1:500 decides" / "B" / "A". Răspuns: B (R5 RF-16).
- **Interacțiunea centrală:**
  - B1 explain: levierul maxim (ce permite brokerul) față de levierul efectiv (valoarea pozițiilor ÷ equity) (R5 RF-16).
  - B2 worked: "% account move = % price move × effective leverage.", "At 20×, a 5% move against you = ?" Răspuns: 100%, tot contul (R6 §4.5).
  - B3 figure „The leverage dial”: același trade la 1×, 3×, 10× și 30×, pe același drum; pierderile ca parte din cont (exercițiul din R6 §4.5).
  - B4 explain: margin call și close-out. CFD-urile retail din UE se închid forțat la 50% din marja cerută, per cont; negative balance protection limitează pierderea la suma din cont (UE, UK, retail); plafoanele merg de la 30:1 la 2:1 (R5 RF-17, RF-18, RF-20; R1 §1.7). Exemplu citit: equity 5,000, 1 lot EUR/USD la 1.1000, la 30:1 → marja cerută 3,667; închiderea forțată vine când equity-ul coboară la 1,833: o pierdere de 3,167, aproximativ 63% din cont, după o mișcare de 2.9% (R5 RF-18).
  - B5 predict: "With correct 1% sizing from a stop, does leverage change your planned risk?" — "Yes" / "No". Răspuns: nu; schimbă marja și expunerea pe care acționează un gap. Riscul îl decide dimensionarea; levierul face supradimensionarea ușoară (R5 RF-16).
  - B6 callout: "Leverage multiplies volatility, not edge. Using the maximum to grow a small account fast is grade F. MARKET//LAB uses none; margin mechanics come in 2.14."
- **Try:** `exposure`, extins cu levierul efectiv (S11).
  - Sarcina: "Set the effective leverage so that a 2.5% gap costs exactly 25% of your equity."
  - Reușită: 10×.
- **Practică:** laborator cu levier simulat (S11).
- **Check:** Q1 (numeric, d1) levierul efectiv; Q2 (numeric, d2) mișcarea care golește contul; Q3 (scenario, d2) închiderea forțată față de un stop.
- **Dovezi:** Mechanic (aritmetica; R6 §4.5; R5 RF-16 … RF-20). Regulile ESMA: reglementare datată (R1 §1.7). Strategia „levier maxim ca să crești repede”: F.
- **Necesită:** S11.
- **Termeni noi de glosar:** `effective-leverage`, `margin-call`, `margin-close-out`, `negative-balance-protection`

---

## Capstone 1 · Trade the plan

**Ce verifică:** că utilizatorul aplică tot Nivelul 1 într-o sesiune continuă, cu tentații puse intenționat, și că procesul rămâne același indiferent de rezultat. E a treia condiție a etapei 1 → 2, alături de cele 30 de trade-uri și de planul v1.

**Durata:** 30–40 de minute, în trei părți.

**Playbook-ul capstone-ului** (fix, ca notarea să fie deterministă; e playbook-ul din L14, extins cu o regulă de trail):
- setup: pullback într-un uptrend;
- condiții: (1) ultimele două swing high-uri și swing low-uri sunt fiecare mai sus decât cele dinainte; (2) minimul pullback-ului ține deasupra swing low-ului anterior; (3) vârful anterior e la cel puțin 2R;
- stop: 0.20 sub minimul pullback-ului; țintă: vârful anterior; după +1R, stop-ul urcă la 0.20 sub fiecare nou higher low;
- risc: 1% din equity-ul curent, cu costuri; limita zilnică: 3R; pauza după orice stop-out: durata din planul v1.1 al utilizatorului (în redare, pauza se derulează automat odată ce e luată; se notează faptul că a fost luată);
- „o zi” = 24 de lumânări de 1 oră.

**Partea A · Zece puncte de decizie** (`decision-replay`, S1, S14, S18). Fiecare punct are un context dat și un grafic LABX tăiat la momentul deciziei; ordinea punctelor și seed-urile se amestecă la fiecare încercare.
1. **Valid pullback:** toate cele trei condiții sunt îndeplinite. Acțiunea bună: intrare cu stop la 0.20 sub minimul pullback-ului, mărime la 1% cu costuri (calculată de utilizator, apoi verificată pe bilet), bracket cu ținta la vârful anterior.
2. **The spike:** +4% în cinci lumânări, fără pullback. Acțiunea bună: no trade (FOMO).
3. **After the stop-out:** un stop-out acum două lumânări, apoi un setup valid. Acțiunea bună: pauza, checklist-ul, apoi intrare la cel mult 1% sau renunțare cu motiv. Mărimea crescută e revenge (încălcare critică).
4. **Short target:** condițiile 1 și 2 îndeplinite, ținta la 1.5R. Acțiunea bună: no trade.
5. **The breakout:** o rupere deasupra unui range din jurul lui 100.00, care nu e în playbook (și care eșuează). Acțiunea bună: no trade.
6. **Near the stop:** o poziție long deschisă, prețul la câteva ticks de stop, setup-ul neschimbat. Acțiunea bună: nimic; stop-ul rămâne. Mutarea lui mai departe e încălcare critică.
7. **The gap:** o poziție deschisă, lovită de un gap de eveniment (R4); stop-ul, aflat la 1.00 sub intrare, se execută cu 0.40 mai jos, la −1.4R. Acțiunea bună: niciuna posibilă; în jurnal, pierderea e varianță (riscul de gap acceptat cu o mărime de 1%).
8. **Daily limit:** trei pierderi azi (297.01 din limita de 300.00, ca în 1.4.9), apoi un setup valid. Acțiunea bună: skip, ziua s-a terminat. Intrarea e încălcare critică.
9. **Quiet hours:** două ore fără setup, cu mișcări mici care tentează. Acțiunea bună: no trade.
10. **The winner:** o poziție deschisă la +1.5R, cu un nou higher low format. Acțiunea bună: stop-ul urcat la 0.20 sub acel higher low; nu închidere fără regulă, nu stop mutat mai departe.

**Partea B · O sesiune liberă.** O sesiune Arena de 48 de lumânări (regim ascuns: R1 sau R2), cu planul v1.1 al utilizatorului atașat și cu guard-rails pornite (checklist pe bilet, pauză, limită zilnică). Utilizatorul înregistrează cel puțin 3 decizii, trade sau no trade.

**Partea C · Review-ul.**
- câte un rând de jurnal pentru fiecare punct de decizie din A și B, inclusiv pentru fiecare „no trade”;
- fiecare pierdere sortată în varianță sau greșeală, cu eticheta greșelii;
- costul erorilor în R;
- o regulă de păstrat, adăugat sau schimbat;
- citirea rezultatului după costuri, lângă benchmark ghost.

**Notarea (doar proces):**
- **Decision Quality (0–100):** pentru fiecare punct, acțiunea pe care o cere playbook-ul (intrare, skip, hold, trail, oprirea zilei), ipoteza și prețul de invalidare scrise, checklist-ul corect.
- **Risk Discipline (0–100):** stop la fiecare intrare; risc ≤ 1% cu costuri; mărime între 90% și 100% din mărimea dată de regulă; niciun stop mutat mai departe; nicio mărime crescută după o pierdere; pauza luată; limita zilnică respectată.
- **Rule adherence (%):** deciziile relevante care au urmat planul ÷ toate deciziile relevante (R5 PSY-29), în A și B.
- **Artefactele de proces:** jurnalul complet; sortarea varianță / greșeală comparată cu cea a aplicației.
- **Simulated Outcome și benchmark ghost:** se afișează, nu se notează.

**Condiții de trecere:**
- zero încălcări critice: trade fără stop, stop mutat mai departe, mărime crescută după o pierdere, trade după limita zilnică, risc peste 1% cu costuri;
- Risk Discipline ≥ 90 și Decision Quality ≥ 75 în partea A;
- rule adherence ≥ 90% în părțile A și B;
- jurnal complet (100% din punctele de decizie), iar review-ul sortează la fel ca aplicația cel puțin 80% din pierderi și scrie o regulă;
- rezultatul simulat nu contează: un capstone pe minus trece dacă sunt îndeplinite condițiile de mai sus; unul pe plus, cu o încălcare critică, nu trece.
- Se poate relua oricând, cu alt seed și altă ordine a punctelor; se păstrează cea mai bună încercare.

**Necesită:** S1 (bracket, trail), S14 (detectoare), S15 (jurnal, KPI, P&L ascuns la review), S18 (limita zilnică), `decision-replay`.

---

## Registru de concepte noi

| id | Nume (EN) | Definiție (EN) | Unitate |
|---|---|---|---|
| long-and-short | Long and short | A long profits from a rise and closes at the bid; a short profits from a fall and closes at the ask. | 1.1 |
| price-types | Price types | Last, bid, ask and mid are different prices; charts plot one of them, and stops trigger on the side that closes the position. | 1.1 |
| cost-stack | Cost stack | Spread, commission, slippage, financing and fees that stand between a gross and a net result. | 1.1 |
| break-even-move | Break-even move | The price move needed to cover a round trip's costs before any gain. | 1.1 |
| point-value | Point value | The money a one-point move is worth for a position: units or contracts times the value per point. | 1.1 |
| balance-and-equity | Balance and equity | Balance counts closed results after costs; equity adds the open P&L of current positions. | 1.1 |
| order-ticket | Order ticket | The form that turns a decision into an order; checking side, size, type, price and stop prevents costly errors. | 1.1 |
| chart-types | Chart types | Line, OHLC bar and candle charts draw the same data with different amounts of detail. | 1.2 |
| candle-aggregation | Candle aggregation | Longer candles are built from shorter ones: first open, highest high, lowest low, last close. | 1.2 |
| volume | Volume | The number of units traded in a period; it measures activity, not direction. | 1.2 |
| candle-range | Candle range | A candle's high minus its low; the average of recent ranges shows what normal noise looks like. | 1.2 |
| price-gaps | Price gaps | A jump between one candle's close and the next one's open, with no trading at the prices in between. | 1.2 |
| log-scale | Log scale | A chart scale on which equal percentage moves take up equal heights. | 1.2 |
| chart-limits | Chart limits | A chart records prices and volume, not who traded, why, the path inside a candle or what comes next. | 1.2 |
| hindsight-bias | Hindsight bias | Judging past events as more predictable than they were, once the outcome is known. | 1.2 |
| stop-entry-order | Stop entry order | A buy stop above the price or a sell stop below it that enters only if a level breaks, then fills at market. | 1.3 |
| stop-limit-order | Stop-limit order | A stop that becomes a limit order when triggered, so it may not fill in a gap. | 1.3 |
| oco-order | OCO order | Two linked orders where the fill of one cancels the other, as in a bracket or a two-sided breakout entry. | 1.3 |
| time-in-force | Time in force | How long an order stays active: Day, GTC, GTD, IOC or FOK. | 1.3 |
| order-queue | Order queue | Resting orders fill by price, then by time, so a touched price doesn't guarantee a fill. | 1.3 |
| initial-risk | Initial risk | The loss at the stop set at entry, costs included; it stays the trade's 1R even if the stop is moved. | 1.4 |
| costs-in-r | Costs in R | Round-trip costs as a share of the stop distance; tighter stops make costs a bigger part of every R. | 1.4 |
| expected-drawdown | Expected drawdown | The drawdown a valid method should be expected to go through, given its risk per trade and normal losing runs. | 1.4 |
| daily-loss-limit | Daily loss limit | A maximum loss per day, set before the session; when the next trade's risk no longer fits, the day is over. | 1.4 |
| swing-points | Swing points | Swing highs and lows marked by a fixed rule and confirmed only after the candles that follow them. | 1.5 |
| pullback | Pullback | A counter-move inside a trend, measured against the prior leg; the trend holds while it stays above the last higher low. | 1.5 |
| round-numbers | Round numbers | Prices ending in 00 or 50 attract take-profits at the number and stops just beyond it; the effect is real but small. | 1.5 |
| role-reversal | Role reversal | A broken resistance may act as support, and a broken support as resistance; retests can hold or fail. | 1.5 |
| structure-break | Structure break | A trend's structure breaks when price closes beyond its last higher low or its last lower high. | 1.5 |
| multi-timeframe-analysis | Multi-timeframe analysis | Reading context on a higher timeframe and acting on a lower one, with both timeframes fixed in advance. | 1.5 |
| risk-capital | Risk capital | Money that could be lost entirely without harming living costs, debts or emergency savings. | 1.6 |
| pre-trade-checklist | Pre-trade checklist | A short yes-or-no list run before every order; any 'no' means no trade or a resized one. | 1.6 |
| mistake-vs-variance | Mistake versus variance | Separating losses caused by a broken process, which can be fixed, from valid trades that lost. | 1.6 |
| error-taxonomy | Error taxonomy | A fixed list of named process errors used to tag trades and to count what mistakes cost in R. | 1.6 |
| process-kpis | Process KPIs | Measures of rule-following, such as stop integrity and risk accuracy, that mean something even on small samples. | 1.6 |
| emotions-in-trading | Emotions in trading | Fear, greed, hope and regret are normal; strong reactions go with worse decisions, so they are noticed and rated. | 1.7 |
| gamblers-fallacy | Gambler's fallacy | Expecting a reversal after a streak of independent outcomes; its mirror image is the hot-hand fallacy. | 1.7 |
| overtrading | Overtrading | Trading more often than the plan's setups allow, which adds costs without adding edge. | 1.7 |
| action-bias | Action bias | Preferring to act rather than wait, which produces trades taken out of boredom. | 1.7 |
| if-then-rules | If-then rules | Responses decided in advance that link an observable trigger to a concrete action. | 1.7 |
| cooling-off-pause | Cooling-off pause | A set pause after a loss or a sharp move, with a fixed routine, before any new decision. | 1.7 |
| martingale | Martingale | Doubling the stake after each loss so one win recovers everything; with finite capital it ends in ruin. | 1.8 |
| averaging-down | Averaging down | Adding to a losing position without a predefined limit; martingale in disguise. | 1.8 |
| grid-trading | Grid trading | Orders at fixed steps around a price, often without stops, that pile up exposure when a trend arrives. | 1.8 |
| performance-claims | Performance claims | A performance claim is judged on sample size, costs, period, worst loss, selection and a benchmark comparison. | 1.8 |
| broker-due-diligence | Broker due diligence | Checking a broker's licence, client-money rules, protections and execution model before opening an account. | 1.8 |
| scam-red-flags | Scam red flags | Guaranteed returns, bonuses, pressure, offshore-only licences and blocked withdrawals signal a likely scam. | 1.8 |
| effective-leverage | Effective leverage | Position value divided by equity; it sets how hard a price move hits the account, whatever the broker allows. | 1.8 |
| margin-close-out | Margin close-out | The forced closing of positions when equity falls too far below required margin; a failure of sizing, not a stop. | 1.8 |

## Termeni noi de glosar

| id | Termen | Definiție (EN, ≤ 20 de cuvinte) |
|---|---|---|
| borrow-fee | Borrow fee | The fee a short seller pays to borrow shares, charged for as long as the short stays open. |
| last-price | Last price | The price of the most recent trade. Stock charts usually plot it; LABX charts plot the mid. |
| quote | Quote | The current bid and ask for an instrument, often shown with the last price and the day's range. |
| overnight-financing | Overnight financing | Interest charged or paid for holding a leveraged position, such as a CFD or forex trade, past the daily cut-off. |
| payment-for-order-flow | Payment for order flow | Money a broker receives for sending clients' orders to a particular firm to be filled. |
| round-trip | Round trip | Opening a position and closing it again. You pay commission twice and cross the spread once. |
| break-even | Break-even | The exit price, or win rate, at which a trade or method neither makes nor loses money after costs. |
| point | Point | A price move of 1.00. On LABX, one point on one unit is worth 1.00 vUSD. |
| pip | Pip | The usual price step in most currency pairs, 0.0001. On 10,000 units of EUR/USD it is worth 1.00 USD. |
| lot | Lot | A standard block of units, such as 100,000 units of a currency pair in forex. |
| contract-multiplier | Contract multiplier | The money one futures contract gains or loses for each point of price movement. |
| order-ticket | Order ticket | The form where you set an order's instrument, side, size, type, price, stop and target before sending it. |
| fat-finger-error | Fat-finger error | A typing mistake in an order, such as an extra zero in the size or the wrong side. |
| line-chart | Line chart | A chart that joins each period's closing price with a line, leaving out the highs and lows. |
| ohlc-bar | OHLC bar | A chart bar showing open, high, low and close, with small ticks for the open and the close. |
| tick-volume | Tick volume | The number of price changes in a period at one broker, used in forex where real volume isn't available. |
| candle-range | Candle range | A candle's height, high minus low. Not the same as a range, the sideways market. |
| log-scale | Log scale | A chart scale where equal percentage moves take up equal heights, useful for long histories. |
| linear-scale | Linear scale | A chart scale where equal price moves take up equal heights. |
| hindsight-bias | Hindsight bias | Feeling that an outcome was obvious once you know it, though it wasn't at the time. |
| cherry-picking | Cherry-picking | Showing only the examples that support a claim and leaving out the ones that don't. |
| stop-limit-order | Stop-limit order | A stop order that becomes a limit order when triggered, so it may not fill if price jumps. |
| trigger | Trigger | The price that activates a stop order, turning it into a market or limit order. |
| oco-order | OCO order | One-cancels-other: two linked orders where the fill of one cancels the other automatically. |
| pending-order | Pending order | An order that has been placed but not yet filled, waiting for its price. |
| time-in-force | Time in force | How long an order stays active before it is filled or cancelled, such as Day or GTC. |
| day-order | Day order | An order that is cancelled automatically at the end of the session if it hasn't filled. |
| gtc | GTC | Good till cancelled: an order that stays active until it fills or you cancel it. |
| ioc | IOC | Immediate or cancel: fill whatever is available now and cancel the rest. |
| fok | FOK | Fill or kill: fill the whole order at once, or cancel all of it. |
| queue-priority | Queue priority | The rule that decides which resting orders fill first: best price first, then the earliest order. |
| average-fill-price | Average fill price | The size-weighted average price of an order that filled in parts at several prices. |
| market-depth | Market depth | How many units are waiting to be bought and sold at each price near the current one. |
| guaranteed-stop | Guaranteed stop | A stop a broker promises to fill at its exact price, even through a gap, for an extra fee. |
| initial-risk | Initial risk | The loss at the stop you set when entering, costs included. It stays your 1R for that trade. |
| cost-drag | Cost drag | How much of a trade's gross result goes to costs. It grows as targets and stops get smaller. |
| underwater-curve | Underwater curve | A chart of how far equity is below its previous peak at each moment, showing depth and duration. |
| daily-loss-limit | Daily loss limit | The most you allow yourself to lose in one day. Once reached, you stop trading until tomorrow. |
| swing-high | Swing high | A candle whose high is above the highs of the candles on each side; a local peak. |
| swing-low | Swing low | A candle whose low is below the lows of the candles on each side; a local trough. |
| market-structure | Market structure | The pattern of swing highs and lows that shows whether price is trending up, down or sideways. |
| leg | Leg | A move from one swing point to the next, such as from a swing low up to a swing high. |
| round-number | Round number | A price ending in 00 or 50. Orders tend to cluster at and just beyond such prices. |
| stop-cluster | Stop cluster | Many stop orders resting just beyond an obvious level. When triggered together, they can speed up a move. |
| retest | Retest | A return of price to a level it has just broken, before moving on or failing. |
| role-reversal | Role reversal | When a broken resistance starts acting as support, or a broken support as resistance. |
| false-breakout | False breakout | A move beyond a level that soon closes back inside, trapping traders who acted on the break. |
| structure-break | Structure break | When price breaks the last swing low of an uptrend, or the last swing high of a downtrend. |
| higher-timeframe | Higher timeframe | A longer candle interval used for context, such as 4H when you trade on 1H. |
| risk-capital | Risk capital | Money you could lose entirely without affecting living costs, debts or emergency savings. |
| pre-trade-checklist | Pre-trade checklist | A short yes-or-no list you run before every order. Any 'no' means no trade or a smaller size. |
| recency-bias | Recency bias | Giving the last few results too much weight when judging a method or making a decision. |
| error-tag | Error tag | A label for a process mistake on a trade, such as moving the stop away or trading without one. |
| process-kpi | Process KPI | A measure of how well you follow your process, such as the share of trades with a stop. |
| stop-integrity | Stop integrity | The share of trades that had a stop at entry that was never moved further away. |
| risk-accuracy | Risk accuracy | The share of trades sized correctly: risk at the stop, with costs, within the plan's limit. |
| plan-adherence | Plan adherence | The share of trades that matched a setup in your playbook. |
| fit-to-trade | Fit to trade | A check of sleep, stress and health before a session. If it fails, trade smaller or not at all. |
| gamblers-fallacy | Gambler's fallacy | Believing a result is 'due' after a streak, when each outcome is independent of the last. |
| hot-hand | Hot hand | Believing a winning streak will keep going, and sizing up because of it. |
| action-bias | Action bias | Preferring to do something rather than wait, even when waiting is the better choice. |
| if-then-rule | If-then rule | A rule decided in advance: if a named trigger happens, then you take a named action. |
| guard-rail | Guard-rail | A setting that makes the right action easy and the wrong one hard, such as a daily lock. |
| cooling-off-pause | Cooling-off pause | A set pause after a loss or a sharp move, taken before any new decision. |
| reappraisal | Reappraisal | Reframing a situation to change how it feels, for example: one loss is one draw from many. |
| martingale | Martingale | Doubling the size after every loss so one win recovers everything. It leads to ruin. |
| averaging-down | Averaging down | Adding to a losing position to lower the average price, which raises the risk on one idea. |
| blow-up | Blow-up | Losing most or all of an account, usually through oversizing, leverage or doubling after losses. |
| grid-trading | Grid trading | Placing orders at fixed steps around a price, often without stops, adding positions as price moves away. |
| out-of-sample | Out-of-sample | Data a method was not built or tuned on. Results there are a fairer test. |
| signal-service | Signal service | A paid service that tells you when to buy or sell. Its track record is often selective. |
| segregated-funds | Segregated funds | Client money a regulated broker must keep apart from its own, so it can't use it. |
| pump-and-dump | Pump-and-dump | Hyping an asset to push its price up, then selling to the buyers it attracted. Illegal. |
| b-book | B-book | A broker model where the broker takes the other side of client trades instead of passing them on. |
| effective-leverage | Effective leverage | Position value divided by equity. It, not the broker's maximum, sets how hard a price move hits you. |
| margin-call | Margin call | A broker's demand for more funds when equity falls below the margin needed to keep positions open. |
| margin-close-out | Margin close-out | The broker closing your positions automatically when equity falls too far below required margin. |
| negative-balance-protection | Negative balance protection | A rule for EU and UK retail clients: you can't lose more than the money in your account. |
