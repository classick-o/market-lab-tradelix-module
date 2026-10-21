# Probleme găsite și decizii

Tot ce a ieșit la iveală cât s-a scris conținutul: erori în cod, corecturi de conținut și deciziile care trebuie luate înainte de implementare. Detaliile sunt în fișierul indicat la fiecare punct.

## A. Corecturi de cod (intră la începutul implementării, în E0)

| # | Problemă | Efect azi | Corectura |
|---|---|---|---|
| C1 | `isCorrect` (`academy/src/catalog.ts`) șterge toate virgulele din răspunsurile numerice | „42,9” e notat ca 429, „185,00” ca 18500. „25%”, „1.6R” și „−” (U+2212) dau NaN. | Virgula e separator zecimal când e singurul separator și e urmată de 1–2 cifre la final; altfel e separator de mii. Se ignoră unitatea de la final și spațiile; „−” e minus. Aceeași parsare în widget-uri. |
| C2 | `maxQtyForRisk` (`engine/src/sizing.ts`) plafonează la `floor(capital ÷ preț)`, dar validarea ordinului cere și comisionul de intrare (`engine.ts`, buying power) | Widget-ul position-size și bileta de ordin din Arena pot propune 100 de unități la 100.00, pe care motorul le refuză (10,000.00 + 5.00 > 10,000.00). Misiunile ocolesc problema cu un plafon de 0.995 × capital. | Plafonul include comisionul de intrare: cea mai mare cantitate cu notional + comision ≤ buying power (99 de unități în exemplu). |
| C3 | Widget-ul expectancy pune semnul înainte de rotunjire | 60% / 1.0R / 1.5R afișează „−0.00R” | Calcul în întregi; |E| < 0.005 se afișează „0.00R”, fără semn |
| C4 | loss-recovery colorează „Gain needed” în roșu | Roșul e rezervat pierderilor simulate (PLAN_LEARN §8.2) | Ton neutru |
| C5 | candle-builder acceptă un high sub corp și îl înlocuiește în tăcere | Controlul arată o valoare, desenul alta | Slider-ele arată valoarea efectivă |
| C6 | Diagramele de azi au neconcordanțe cu lecțiile | — | Se refac oricum pe Learn Chart Kit în E2. Lista e în tabelul de sub acesta, ca să nu se repete. |

**Neconcordanțele din diagrame (C6):**

| Diagramă | Neconcordanță |
|---|---|
| market-vs-limit | Arată limita la 98.50, deși exemplul lecției e 99.00, iar drumul „filled” ignoră regula ask-ului |
| stop-placement | Stop-ul „prea strâns” e desenat deasupra suportului, deși caption-ul spune „just under support” |
| moving-average | Caption-ul spune 20 de perioade, dar desenul folosește 5; textul pentru cititorul de ecran descrie altă formă decât desenul |
| support-resistance | Desenează linii, deși lecția vorbește de benzi; colorează nivelurile ca pierdere / câștig |
| breakout-false-breakout | Panoul „false breakout” se termină sub range, deci arată o rupere în jos |
| decision-tree | Nodul 3 spune „Adjust size or skip”, deși caption-urile din L13 și L14 spun că orice „no” înseamnă no trade. Aliniat acum pe „Resize within the limit, or skip”. |
| loss-recovery (în L18) | Caption-ul vorbește de 8 pierderi de 1%, desenul arată 10 / 20 / 50% |
| market-vs-limit, stop-placement | Folosesc verde și roșu pentru corect / greșit |

## B. Corecturi de conținut (se aplică la mutarea conținutului în `packages/academy`)

### Întrebări existente (detalii în fișierele de întrebări)

| Întrebare | Corectura |
|---|---|
| q-mf-3 | Varianta `b` devine „Price made its low before its high, then closed near the high” (azi poate fi apărată ca adevărată) |
| q-mf-6 | Spune că poziția e evaluată la bid; motorul evaluează la mid. Vezi decizia D1. |
| q-ps-8 | Plafonul real e 99 de unități, nu 100 (C2) |
| q-rm-3 | Trei pierderi de 1% din contul curent dau 9,702.99, nu 9,700.00. Scenariul devine „After a run of losing trades”. |
| q-sl-3 | Prețul 48.30 e deja sub suportul de 48.40; devine 48.50 |
| q-sl-7 | 50 de unități riscă 102.45 cu costuri, peste 1%; se adaugă „Ignore costs.” sau „(48 after costs)” |
| q-sl-9 | „Widen the stop” contrazice regula „never widen a stop”; devine planificarea următorului trade |
| q-psy-8, q-psy-10 | Folosesc „overconfidence”, termen nepredat. Vezi decizia D5. |
| q-mf-9 | Opțional, dificultatea trece la d2 (e un singur pas) |

### Lecții

| Unde | Corectura |
|---|---|
| L09 | Verificarea costurilor: 47 de unități pierd **98.66**, nu 98.653; 48 de unități pierd **100.76**, nu 100.752 (comisionul se rotunjește în sus la cent pe fiecare execuție). Răspunsul rămâne 47. |
| L09 | „At most 100 units” devine 99 (C2) |
| L10 | Exemplul nu mai folosește formula de dimensionare, care vine acum în L09 (noua ordine din U3); q-sl-2 e înlocuită în check |
| L06 | Exemplul de pierdere primește și comisionul: ≈ 1.05 per unitate, nu 0.95 |
| L05 | „Noise” e definit ca mișcări care se suprapun, nu ca „mișcări mici” (M02 construiește zgomotul din lumânări mai mari decât trendul) |
| L07 | O propoziție despre EMA (glosarul leagă EMA de L07, dar lecția nu o pomenea) |
| L13 | Confirmation bias e introdus (conceptul și bias-spotter-ul au nevoie de el) |
| L15 | Base rates e introdus în B5; lecția primește termeni de glosar (azi nu avea niciunul) |
| Concept „fomo” | Exemplul „33 / 66 units, ignoring costs” e 32 / 62 cu costuri |
| Checkurile lecțiilor | Propuneri de înlocuire în 9 lecții, ca checkul să nu repete exemplul din lecție. Lista e la fiecare lecție, secțiunea Check. |

### Glosar și concepte

- **Termeni existenți fără lecție, legați acum:**
  - L02: basis-point, position, unrealised-pnl;
  - L04: long, entry, exit, bracket-order, stop-order;
  - L05: reversal;
  - L08: drawdown, equity;
  - L12: correlation;
  - L13: confirmation-bias, overtrading.
- **Termeni noi propuși:** scenario-analysis, trigger, hindsight-bias, recency-bias, decision-quality, variance.
- **Concepte cu lecții greșite în listă:**
  - `trailing-stop` → L10 (nepredat; vezi D4);
  - `volatility` → L05 (nepredat acolo);
  - `base-rates` → L17 (folosit doar ca idee);
  - `invalidation-level` primește și L04;
  - `gap-risk` primește și L12, L16.

### Întrebări noi

19 întrebări complet definite: MF 2, OT 2, TA 3, PS 2, PE 2, RM 1, SL 2, DM 1, PSY 2, SA 2. Acum fiecare concept din cele 10 topicuri are cel puțin 2 întrebări, iar fiecare topic are pool-ul de check complet (2 × d1, 2 × d2, 1 × d3).

## C. Decizii

Fiecare are o recomandare. Unde nu decizi altfel, implementarea merge pe recomandare.

| # | Decizie | Opțiuni | Recomandare |
|---|---|---|---|
| D1 | Poziția deschisă se evaluează la bid sau la mid? | (a) se rescrie q-mf-6 după motor (mid); (b) se schimbă motorul să evalueze long-urile la bid | **(a)**: graficul se desenează din mid, iar motorul e consecvent cu el |
| D2 | Exemplul din L17 (50 de unități, „before costs”) | (a) rămâne 50, etichetat clar; (b) devine 48, cu costuri | **(b)**: din L08 riscul include costurile; 50 de unități ar depăși 1% (102.45) |
| D3 | Politica legăturilor de glosar în text | (a) fiecare termen la prima apariție în lecție; (b) doar termenii noi pentru curs, plus cei recurenți de care depinde lecția | **(b)**, ca în U1: textul nu se umple de sublinieri |
| D4 | Trailing stop: două întrebări noi îl testează, dar nicio lecție nu-l predă | **Închisă de harta cursului:** lecția nouă 1.3.8 predă trailing stop-ul; conceptul `trailing-stop` trece de la L10 la 1.3.8 | — |
| D5 | „Overconfidence” în q-psy-8 și q-psy-10 | (a) se înlocuiește cu „recency bias”, predat în L17 / L18; (b) L18 predă și overconfidence | **(a)** |
| D6 | Durata L05 | 5 min (azi) sau 6 min (realist cu pașii noi) | **6 min** |
| D7 | Task-ul din L06 | (a) două părți: banda, apoi stop-ul; (b) doar banda, cu stop-ul fix | **(a)**: doar așa acoperă obiectivul 3 |
| D8 | Practica din L07 | (a) rămâne M02 (care nu arată medii mobile); (b) Arena, cu toggle-urile SMA 20 / SMA 50 | **(b)** |
| D9 | Datele graficelor din Learn | (a) generate la rulare din seed; (b) înghețate în fișiere, prin `npm run content:generate`, ca la misiuni | **(b)**: o schimbare în generator nu mai poate strica un exercițiu |
| D10 | A doua misiune de final pentru U1 (ordine și execuții) | Harta propune misiunea „Order desk” pentru unitatea 1.3 | **Da, „Order desk”**, construită odată cu S1 (ordinele noi) |
| D11 | Pauza din L13 („pause for your set time”): cât durează? | **Închisă de harta cursului:** utilizatorul își alege durata în lecția 1.7.7 | — |
| D12 | Unde se salvează câmpurile de plan din L18 | (a) doar în recap; (b) în starea lecției, afișate în recap și în Practice | **(b)** |
| D13 | M04 arată un card ATR înainte ca L16 să predea ATR | (a) tooltip de glosar pentru ATR în M04; (b) se mută cardul | **(a)** |
| D14 | Reflecția din M05 („spread / commission / both”) | Răspunsul bun e „commission”: intrarea e deja la ask | Se verifică debrief-ul M05 și se corectează dacă acceptă „Both” |
| D15 | M02: zgomotul e mereu al treilea segment și se numește „No clear structure” | Ordinea se amestecă, iar eticheta devine „Noise”, ca în L05 | De aplicat în misiune |
| D16 | Un al doilea d3 pentru Order Types | Azi e unul singur, deci retake-ul îl repetă | Opțional, la extinderea băncii |

## D. Decizii din harta completă a cursului

Au apărut cât s-a scris [harta cursului](course/README.md). Fiecare are o recomandare.

| # | Decizie | Opțiuni | Recomandare |
|---|---|---|---|
| D17 | Instrumente sintetice noi: LABY, LABZ, vEUR/vUSD, vUSD/vJPY, vUSD/vCHF, vEUR/vCHF, indicele LABIX și altele (corelații, perechi, forex, intermarket) | (a) se adaugă odată cu S9 și S10; (b) cursul rămâne pe LABX | **(a)**: fără ele, unitățile 2.11, 2.14, 3.6 și 3.13 nu se pot exersa |
| D18 | Plafonul fără levier în lecțiile intraday: cu LABX ≈ 100, orice stop mai strâns de ≈ 1.00 atinge plafonul de 100 de unități (2.9.3) | (a) se păstrează și devine lecție despre tentația levierului; (b) un preț mai mic pentru LABX în lecțiile intraday | **(a)** |
| D19 | Contractul de opțiuni LABX | Harta propune 1 contract = 10 unități (ca un trade să încapă în bugetul de risc de 1%), dobândă zero, fără comision | **10 unități, dobândă zero, dar cu comision** (principiul costurilor reale) |
| D20 | Prețuri de opțiuni înainte de Nivelul 4 (3.8.7, 3.9.3) | (a) o versiune minimă de S12 (Black-Scholes și IV) construită odată cu Nivelul 3; (b) prețuri precalculate | **(a)** |
| D21 | Definiția „riscul calculat corect” din etapa 1 → 2 | Pierderea la stop, cu costuri, rămâne în buget, iar mărimea e ≥ 90% din cea dată de `maxQtyForRisk` (cu excepția plafonului de capital) | **Da** |
| D22 | Limita zilnică de pierdere (parte din S18) | (a) adusă la Nivelul 1, pentru etapa 1 → 2; (b) rămâne la Nivelul 2 | **(a)** |
| D23 | Etapa 2 → 3: se adaugă și „disposition score într-o bandă țintă” (R5)? | (a) da, ca o condiție; (b) doar afișat ca KPI | **(b)**: e un indicator util, dar opac ca o condiție de trecere |
| D24 | Termenii pentru pattern-urile rare (aproximativ 60 de lumânări, 30 de pattern-uri grafice) | (a) intră în recapitularea spațiată; (b) doar în Library | **(b)**: recapitularea rămâne pe ce contează |
| D25 | 11 lecții de la Nivelul 2 durează 8 minute (PLAN_LEARN spune 5–7) | (a) se acceptă de la Nivelul 2 în sus; (b) se împart | **(a)** |
| D26 | Ordinea în Nivelul 3: statistica și backtestingul (3.10–3.12) înaintea metodelor testate în laborator (3.4–3.5); futures și crypto (3.14) înaintea strategiilor sistematice (3.13) | (a) ordine recomandată, cu id-urile neschimbate; (b) renumerotare | **(a)**, aplicată deja în course/README §3 |
| D27 | Cifrele produse de generator (de exemplu „fading-ul merge doar la surprize mici”, efectul celor care urmăresc Fibonacci) | Sunt parametri de design, nu fapte de piață | **Etichetate în UI ca parametri ai simulatorului** |
| D28 | Pragurile convenite de aplicație: PBO (0,2 și 0,5), plateau ≥ 80%, edge ratio ≥ 1,2, lichidarea la cel puțin 2 × distanța stop-ului, pragurile capstone-urilor, haircut-ul de 50% pe edge-urile publicate | Propuse de hartă | **Calibrate pe seed-uri înainte de lansare**, apoi trecute în KNOWLEDGE.md |
| D29 | Fapte de verificat înainte de publicare | Înlocuirea regulii PDT din SUA (2026), schemele de compensare (SIPC, UE, România), formulările ASF, eliminarea PFOF în UE, T+1 în UE, specificațiile CME, regulile actuale FTMO și Topstep, cazul My Forex Funds, toate marcajele [BK], [K], [S], [PK] din cercetare | **O trecere de verificare înainte de publicarea fiecărui nivel** |
| D30 | Băncile de întrebări pentru unitățile noi | Doar Nivelurile 0–1 cer aproximativ 90 de întrebări noi; harta mută și întrebări existente între unități (de exemplu q-ta-12 și q-ta-13 de la L16 la 2.4.6) | Se scriu odată cu scriptul complet al fiecărei unități |
| D31 | L16 după mutarea în 2.4 | B3 și B4 repetă lecția 2.4.6 | **B3 se scurtează, B4 rămâne ca exercițiu de reamintire** |
| D32 | `carry-trade` (3.6.6, varianta FX) și `carry` (2.x și 3.13, strategia între clase de active) | (a) două concepte legate între ele; (b) unul singur | **(a)** |
| D33 | Numărul de widget-uri și laboratoare noi (≈ 200 în toată harta) | (a) fiecare construit separat; (b) configurații ale câtorva „carcase” refolosibile: laborator, calculator, sorter, strategy lab | **(b)** |
