# Nivelul 3 · Advanced, partea B: unitățile 3.8–3.14 și Capstone 3

A doua jumătate a Nivelului 3 („The ridge”). Prima jumătate (3.1–3.7: lichiditate, microstructură, order flow, metode clasice, SMC, macro, bănci centrale) e în [level-3-advanced-a.md](level-3-advanced-a.md). Arhitectura, notele de dovezi, regimurile R0–R14 și capabilitățile S1–S20 sunt în [README.md](README.md). Cercetarea citată e în [../research/](../research/).

## Ce poate face utilizatorul la finalul acestei jumătăți

- **Citește o companie ca un trader:** leagă cele trei situații financiare, separă profitul de numerar, vede ce așteptări sunt deja în preț (multipli, DCF invers) și tratează o raportare ca pe un eveniment cu gap, implied move și IV crush, nu ca pe o ghicitoare.
- **Folosește sentimentul și poziționarea ca stare, nu ca semnal:** COT, VIX, put/call, sondaje, short interest; știe că extremele pot dura și că sezonalitatea are note de dovezi diferite de la un efect la altul.
- **Gândește statistic:** distribuții cu cozi groase, volatilitate care se adună în valuri, regresia la medie, Bayes, semnificație, testări multiple, autocorelație. Știe câte trade-uri îi trebuie ca un edge să se distingă de zero.
- **Construiește și validează un sistem** în strategy lab: ipoteză falsificabilă, reguli codificate, date curate, execuții și costuri conservatoare, in-sample / out-of-sample, walk-forward, Monte Carlo, robustețe, benchmark-uri aleatoare, controlul pe random walk (R0), incubare cu kill switch și jurnal de cercetare.
- **Dimensionează cu teorie, nu cu instinct:** volatility drag, Kelly ca plafon, fractional Kelly, optimal f, risk of ruin definit ca drawdown, volatility targeting, equity-curve trading.
- **Evaluează strategiile sistematice cu dovezile lor:** time-series și cross-sectional momentum, carry, sezonalitate, pairs, evenimente; scăderea după publicare și aglomerarea; citirea critică a unui studiu.
- **Înțelege instrumentele cu levier înainte de orice strategie:** futures (marjă, roll, curbă), mărfuri, crypto (24/7, custodie, perpetuals, funding, lichidare) și obligațiuni (duration, DV01).

## Etapa de trecere 3 → 4

Din README §5: *un sistem documentat trece checklist-ul de validare (out-of-sample, walk-forward, Monte Carlo, stres pe costuri), cu jurnalul de cercetare; KPI-urile de proces se mențin într-un scenariu de drawdown forțat; Capstone 3.*

Cum se leagă de această jumătate:

| Cerință din etapă | Unde se învață | Unde se verifică |
|---|---|---|
| Sistem documentat, cu ipoteză și reguli | 3.11.1 | Capstone 3, faza C3.1–C3.2 |
| Out-of-sample, cu o singură deblocare | 3.11.4, 3.11.5 | C3.3, punctele 1–2 |
| Walk-forward | 3.11.6 | C3.3, punctul 3 |
| Monte Carlo | 3.11.7, 3.12.5 | C3.3, punctul 4; C3.4 |
| Stres pe costuri | 3.11.2, 3.11.8 | C3.3, punctele 5–6 |
| Jurnalul de cercetare (cu numărul de încercări) | 3.11.1, 3.11.10 | C3.1–C3.6 |
| KPI-uri de proces în drawdown forțat | 3.11.10, 3.12.7, 1.6 și 2.13 (KPI-uri) | C3.5 |

Etapa se bazează **doar pe proces** (R5 §10, R6 §7). Profitul simulat apare în rapoarte doar ca diagnostic, cu interval de încredere și cu „benchmark ghost”, și nu intră în scor.

## Firele din spirală în această jumătate

| Fir | Ce adaugă partea B | Lecții |
|---|---|---|
| **Risc** | Kelly ca plafon, risk of ruin ca drawdown, volatility targeting; riscul de gap la raportări; margin hikes, limit moves, lichidare | 3.12 (toată), 3.8.5, 3.14.1, 3.14.4, 3.14.7 |
| **Statistică** | distribuții și cozi groase, semnificație, Bayes, testări multiple, autocorelație, Monte Carlo | 3.10 (toată), 3.11.4–3.11.9, 3.13.4 |
| **Psihologie** | premortem, practică deliberată, „trading scared” în drawdown, ancorarea în modele (DCF), herding și FOMO la squeeze-uri | 3.11.10, Capstone 3 (C3.5), 3.8.4, 3.9.4 |
| **Proces** | jurnalul de cercetare, guvernarea regulilor, cardul de go-live, kill switch | 3.11.1, 3.11.10, 3.12.7, Capstone 3 |
| **Dovezi** | fiecare strategie, anomalie și efect de calendar are notă; scăderea după publicare (McLean & Pontiff); citirea critică a studiilor | 3.8.6–3.8.8, 3.9.6, 3.13 (toată) |
| **Costuri** | costurile de execuție în backtest, costul de break-even, roll, funding, swap, împrumutul pentru short, costurile în small caps | 3.11.2, 3.8.8, 3.13.3, 3.14.3, 3.14.6 |

Nivelul 3 nu are o unitate separată de psihologie. Firul psihologic al nivelului (practică deliberată, premortem) e țesut în 3.11.10 și în Capstone 3, unde contează cel mai mult: când un sistem bun trece printr-un drawdown normal.

## Traseele de specializare servite

| Unitate | Tip | Trasee (README §3) |
|---|---|---|
| 3.8 Company fundamentals and earnings | Electivă | Macro and news |
| 3.9 Sentiment, positioning and seasonality | Electivă | Technical analyst, Macro and news |
| 3.10 Statistics for traders | **Core** | toate |
| 3.11 Backtesting and system design | **Core** | toate |
| 3.12 Position sizing theory | **Core** | toate |
| 3.13 Systematic strategies and evidence | Electivă | Technical analyst, Systematic trader |
| 3.14 Instruments II | Electivă | Derivatives |

**Ordinea recomandată în această jumătate** (nimic nu se blochează):
1. **3.10 → 3.11 → 3.12**, în această ordine: întâi statistica, apoi validarea unui edge, apoi dimensionarea unui edge validat (R5 §10, BT-23: semnalul se testează în R, sizing-ul vine după).
2. **3.8 și 3.9** oricând după 2.10, 2.14 și 3.6. Lecțiile cu strategy lab (3.8.8, 3.9.5, 3.9.6) merg mai bine după 3.11.4.
3. **3.14 înainte de 3.13** pentru cine face ambele: 3.13.1 (Turtle pe futures) și 3.13.3 (carry) folosesc marja, roll-ul și funding-ul din 3.14.1–3.14.3 și 3.14.6. R6 §7 pune mecanica futures și crypto (Stage 3) înaintea strategiilor sistematice (Stage 4). Ambele lecții au un beat de recapitulare pentru cine vine direct.
4. **Capstone 3** la final.

## Convenții pentru această jumătate

**Lumea simulată.** Aceleași reguli ca în [../README.md](../README.md) (vUSD, LABX, spread 0.10, comision 0.05% pe execuție), plus instrumente sintetice noi. Toate sunt fictive, ca să nu imite companii sau contracte reale:

| Instrument | Ce este | Specificații în simulator |
|---|---|---|
| LABX | instrumentul de bază | ca până acum; în lecțiile de sizing, volatilitatea zilnică e dată în lecție |
| LABA, LABB, LABD, LABE | companii sintetice (S16) | LABA: companie stabilă; LABB: creștere rapidă; LABD: îndatorată, țintă de achiziție; LABE: small cap cu short interest mare |
| LXF / LXM | futures sintetic pe indice / varianta micro | LXF: 50 vUSD pe punct, tick 0.25 = 12.50 vUSD; LXM: 5 vUSD pe punct, tick 1.25 vUSD |
| LXO | futures sintetic pe țiței, cu livrare fizică | 1,000 de unități, tick 0.01 = 10 vUSD; first notice day impus |
| LXN | futures sintetic pe o notă de 10 ani | DV01 = 80 vUSD pe contract |
| LXC | monedă sintetică (spot și perpetual) | funding la 8 ore, mark price, motor de lichidare |

- **Conturi:** 10,000 vUSD ca de obicei. Lecțiile de futures folosesc 100,000 vUSD, ca un contract întreg să încapă în regula de 1%. Lecția o spune explicit.
- **Cifrele din lumea reală** (studii, specificații CME, evenimente) sunt citate cu sursa din cercetare. Cele marcate în cercetare cu [PK], [BK] sau [verify] păstrează marcajul aici și se verifică înainte de publicare (README §12).
- **Cifrele din simulator** sunt de design. Unde un hook depinde de un rezultat generat, fișa spune ținta de calibrare a generatorului.
- **Toate calculele din fișe au fost verificate** cu un script (Monte Carlo cu 10,000–40,000 de căi, unde e cazul). Valorile Monte Carlo sunt aproximative, cu ± o zecime de punct procentual.
- **Calculele de mărime din fișe sunt „textbook”**, fără costuri, ca să rămână lizibile; unitățile se rotunjesc mereu în jos. Când se scrie scriptul complet al lecției, ele se recalculează cu costurile instrumentului, ca în L09 (47 de unități după costuri, nu 50). Excepție: lecțiile despre costuri (3.11.2), unde costurile sunt chiar subiectul.

**Notațiile din fișe:**
- `concept ✓` = există deja în `concepts.ts`.
- `concept (nou)` = concept nou, introdus în această lecție; apare în registrul de la final.
- `concept (3.10.6)` = concept nou introdus mai devreme în acest fișier, în lecția indicată.
- `concept (2.11)` = concept care aparține unei unități de la Nivelurile 0–2 sau din partea A. Id-ul e provizoriu și se aliniază cu fișierul nivelului respectiv; nu intră în registrul de aici.
- `widget-name` (nou) = widget sau laborator nou. Lista completă e în secțiunea „Widget-uri și laboratoare” de la final.
- Câmpul **Check** descrie cele 3 întrebări (tip, dificultate d1–d3, ce verifică). Id-urile de întrebare se dau când se scrie banca.
- **Durata** e cea a fazelor Hook → Recap (PLAN_LEARN §4.1). Toate lecțiile au cel puțin 3 interacțiuni reale: hook-ul, task-ul din Try și cel puțin una din Learn.

**Ajustare față de README §3:** 3.8 are **9 lecții în loc de 8**. R4 §5 are 13 fișe de concept pentru fundamentalele de companie, iar R4 §9 le împarte pe trei niveluri (B6, I5, I6, A5). Cursul le adună într-o singură unitate. Cu 8 lecții ar fi trebuit să unim reacția la guidance cu gap-urile de raportare sau să scoatem evenimentele corporative, care sunt și o sursă de erori în date (3.11.3). Restul unităților păstrează numărul din README: 6, 7, 10, 7, 8 și 8. Total: **55 de lecții**.

**Material de nivel Expert** (Nivelul 4) apare doar ca trimitere de un rând: deflated Sharpe, PBO, MinBTL și purged CV (4.3); VaR/ES și volatility targeting la nivel de portofoliu (4.4); Greeks și strategiile de volatilitate (4.1); algoritmii de execuție și impactul (4.2).

---
## 3.8 · Company fundamentals and earnings

**Fișa unității**
- **Scop:** utilizatorul citește o companie și o raportare ca un trader. Învață cum se leagă situațiile financiare, ce înseamnă calitatea profitului și ce așteptări sunt deja în preț (multipli, DCF invers). Apoi tratează raportarea ca pe un eveniment de risc: surpriză, guidance, gap, implied move, IV crush. La final vede ce rămâne după raportare (PEAD) și cum schimbă evenimentele corporative prețul și datele.
- **De ce aici:** vine după 2.10 (știrea ca surpriză față de consens), după 2.14 (acțiuni, short, dividende) și după 3.6 (dobânzile), care explică de ce multiplii se mișcă odată cu ratele. Fundamentalele de companie stau la Nivelul 3 pentru că cer gândirea în așteptări, iar PEAD și IV crush cer statistică și costuri. R4 §9 împarte subiectele pe trei niveluri (B6, I5, I6, A5); aici sunt adunate într-o unitate a traseului Macro and news.
- **Cere de dinainte:** 2.10, 2.14, 3.6; 1.3 (gap-uri și slippage); 2.11 (expectancy cu interval de încredere). Pentru 3.8.8 e recomandat 3.11.2 (costul de break-even).
- **Checkpoint:** `test-3.8`, 14 întrebări:
  - 5 numerice cu `vary`: FCF, EV/EBITDA, valoarea actuală, pierderea în R după un gap, probabilitatea din merger spread;
  - 7 mcq;
  - 2 cazuri d3, fiecare cu o raportare sintetică completă de citit.

  La ≥ 80%, cele 9 lecții se marchează „Tested out”.
- **Laboratorul unității: „Earnings season”** (S16 + S6 + S13). Un sezon sintetic de 40 de raportări pe 20 de companii, în 6 săptămâni simulate.
  - Pentru fiecare raportare, utilizatorul completează checklist-ul de earnings: consensul, implied move, run-up-ul, celula din matrice după raport, gap-ul maxim acceptat.
  - Apoi alege: flat, poziție dimensionată pentru gap sau intrare după raport, cu stop.
  - La final rulează portofoliul SUE net de costuri (3.8.8).
  - Scor: checklist completat, regula „gap ≤ 2R” respectată, calibrarea estimărilor de mișcare. P&L-ul apare doar ca diagnostic.
- **Fire din spirală:**
  - Risc: gap-ul la raportări și dimensionarea pentru gap (R5 PR-12).
  - Statistică: rata de beat ca rată de bază; calibrarea față de implied move; spread-ul PEAD cu interval de încredere.
  - Psihologie: ancorarea în propriul DCF, precizia falsă.
  - Proces: checklist-ul de earnings intră în playbook (2.13).
  - Dovezi: PEAD B (scăzut), matricea de guidance C, DCF-ul ca semnal D.
  - Costuri: drift-ul supraviețuiește exact unde costurile sunt cele mai mari.
- **Surse:** R4 §5.1–5.13, §9 (B6, I5, I6, A5), §9A punctul 10; R6 §2.9.2–2.9.3, §2.16, §3.1; R5 RF-20, PR-12; R1 §2.11 (FA-02, FA-03, FA-04, FA-09).
- **Lecții:** 9 (README: 8; motivul e în introducere).

#### 3.8.1 · Three statements, one company
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Macro and news)
- **Obiective:**
  1. Trace how net income flows into the balance sheet and the cash-flow statement.
  2. Compute operating cash flow and free cash flow from given line items.
  3. Explain why profit and cash can move in opposite directions.
- **Concepte:** financial-statements (nou), free-cash-flow (nou)
- **Se sprijină pe:** 2.14 (ce deții când cumperi o acțiune), 1.1 (P&L)
- **Hook:** predict · alegere din 4 · "LABA reports record quarterly profit: net income of 60m vUSD. Yet its cash fell by 45m. What is the most likely reason?"
  - `a` "The report contains an error"
  - `b` "Customers haven't paid yet, and it bought equipment" ✓
  - `c` "The share price fell"
  - `d` "It paid its taxes twice"

  Răspunsul (comparat în recap): profit net 60 + amortizare 20 − creșterea creanțelor 80 − creșterea stocurilor 30 = OCF −30; capex 15 → FCF −45. Fără finanțare, numerarul scade cu 45.
- **Interacțiunea centrală:**
  - `figure` (Flow, 4 pași):
    1. Veniturile devin profit net în income statement.
    2. Profitul net intră în retained earnings, în bilanț.
    3. Cash-flow statement pornește de la profitul net, adaugă amortizarea și scade creșterea creanțelor și a stocurilor.
    4. Capex-ul crește PP&E în bilanț și iese ca investing cash flow.
  - `worked` cu input: utilizatorul calculează OCF = −30 și FCF = −45 (toleranță 0).
  - `match` (4 perechi), tranzacție ↔ prima linie afectată:
    - "Sell 10m on credit" → receivables
    - "Buy a 15m machine" → capex / PP&E
    - "Pay a 5m dividend" → financing cash flow / retained earnings
    - "Issue 20m of new shares" → financing cash flow / equity
- **Try:** widget `statement-builder` (nou).
  - Start: LABA în T0 (venituri 400m, marjă netă 12%, creanțe 50m, fără capex). Pe fiecare trimestru se aleg: procentul vânzărilor pe credit (0–100%), capex-ul (0–60m), emisiunea de acțiuni (0–50m).
  - Obiectiv: "Run LABA for two quarters so net income rises while free cash flow turns negative."
  - Reușită: NI(T2) > NI(T1) și FCF(T2) < 0.
  - Indicii: 1. "Sales on credit raise profit before they raise cash." 2. "Capex leaves cash now and reaches profit slowly, through depreciation."
  - Show me: credit 80%, capex 40m.
- **Practică:** S16, scenariul „The cash squeeze”: 3 companii sintetice cu profit asemănător. Utilizatorul le ordonează după FCF pe acțiune, apoi vede care a avut nevoie de finanțare în trimestrul următor.
- **Check:**
  - q1 numeric d1: FCF = OCF − capex (OCF 140, capex 55 → 85; `vary` OCF 50–300, capex 10–120).
  - q2 mcq d2: unde ajunge profitul net în bilanț (retained earnings, în equity).
  - q3 mcq d3: profit în creștere trei trimestre la rând, OCF în scădere. Explicația cea mai probabilă: creanțe și stocuri în creștere. Distractori: „depreciere mare”, „buyback”, „dobânzi mai mici”.
- **Dovezi:** Mechanic (contabilitate; R4 §5.1–5.2 [S81]).
- **Necesită:** S16 (situații financiare sintetice legate între ele); widget nou `statement-builder`.
- **Termeni noi de glosar:** income-statement, balance-sheet, cash-flow-statement, operating-cash-flow, free-cash-flow, capex, eps

#### 3.8.2 · Earnings quality and key ratios
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Macro and news)
- **Obiective:**
  1. Rank companies by free cash flow per share when their adjusted EPS is identical.
  2. Separate EPS growth that comes from the business from growth that comes from buybacks.
  3. Use leverage and coverage ratios to flag a fragile balance sheet.
- **Concepte:** earnings-quality (nou), free-cash-flow (3.8.1)
- **Se sprijină pe:** 3.8.1, 2.14 (număr de acțiuni, dividende)
- **Hook:** predict · alegere LABA / LABB / "the same" · "LABA and LABB both report adjusted EPS of 2.00. LABB pays staff mostly in new shares, so its share count grows 6% a year, and it spends heavily on equipment. Which earns more cash per share?" Răspuns: LABA, cu FCF pe acțiune 2.10 față de 0.80 la LABB.
- **Interacțiunea centrală:**
  - `worked` "Two EPS numbers": EPS-ul GAAP al LABB e 1.10, cel ajustat 2.00. Diferența vine din plata în acțiuni (0.70) și din costuri „unice” care revin în fiecare an (0.20).
  - `worked` cu input, buyback-ul: profitul net rămâne 100m, numărul de acțiuni scade de la 100m la 95m, EPS-ul crește de la 1.00 la 1.053. Utilizatorul introduce creșterea (+5.3%, toleranță 0.1) și vede eticheta "business growth: 0%".
  - `match` (4 perechi), raport ↔ ce măsoară: ROE (profit net ÷ equity), net debt ÷ EBITDA, interest coverage (EBIT ÷ dobânzi), inventory days.
  - `callout`: un ROE de 20% (profit 40 ÷ equity 200) poate veni din datorie: D/E = 4.
- **Try:** widget `ratio-detective` (nou).
  - Start: tabel cu 8 rapoarte pentru LABA, LABD și LABE (ROE, ROIC, net debt/EBITDA, interest coverage, current ratio, inventory days, receivable days, marja FCF).
  - Obiectiv: "Tag the levered company, the one with an inventory problem and the steady compounder."
  - Reușită: 3/3 etichete corecte.
  - Indicii: 1. "Leverage shows in net debt/EBITDA and interest coverage, not in ROE." 2. "Inventory days rising faster than sales is the warning sign."
- **Practică:** S16, drill-ul „Same EPS, different cash”: 5 perechi de companii sintetice cu EPS ajustat identic. Din fiecare pereche, utilizatorul alege compania cu FCF pe acțiune mai mare și o justificare din listă (diluare, capex, ajustări recurente). Scor pe alegere și pe justificare.
- **Check:**
  - q1 numeric d2: EPS-ul după buyback (profit 50m, acțiuni de la 25m la 24m → EPS de la 2.00 la 2.083; `vary`).
  - q2 mcq d2: de ce „adjusted EPS is the real number” e o greșeală.
  - q3 mcq d3: ROE 25%, net debt/EBITDA 5×, interest coverage 1.8×. Ce semnalează: profitabilitate împrumutată, fragilitate la creșterea dobânzilor.
- **Dovezi:** Mechanic (definiții; R4 §5.2–5.3 [BK]). Efectul anunțurilor de buyback: C, modest și fără inversare în medie (R4 §5.12 [S85]).
- **Necesită:** S16
- **Termeni noi de glosar:** adjusted-eps, dilution, share-buyback, roe, net-debt, interest-coverage

#### 3.8.3 · Multiples: what the price already assumes
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Macro and news)
- **Obiective:**
  1. Compute P/E, enterprise value and EV/EBITDA from price, shares, debt and cash.
  2. Explain why EV multiples compare companies with different debt fairly.
  3. Predict which stock falls more when discount rates rise one point.
- **Concepte:** valuation-multiples (nou), equity-duration (nou)
- **Se sprijină pe:** 3.8.2, 3.6 (dobânzi nominale și reale)
- **Hook:** predict · alegere LABA / LABB și slider 0–50% · "Discount rates rise from 8% to 9%. LABB, a fast grower, and LABA, a slow grower, earn the same cash today. Which falls more, and by roughly how much?" Răspuns, cu modelul Gordon P = CF ÷ (r − g):
  - LABB (g = 6%): 1 ÷ 0.02 = 50 → 1 ÷ 0.03 = 33.33, adică −33%.
  - LABA (g = 1%): 1 ÷ 0.07 = 14.29 → 1 ÷ 0.08 = 12.50, adică −12.5%.
- **Interacțiunea centrală:**
  - `worked` cu input: P/E = 40 ÷ 2 = 20. Market cap 4,000m + datorie netă 1,000m = EV 5,000m. EBITDA 500m → EV/EBITDA = 10× (utilizatorul introduce 10).
  - `predict`: LABD are același market cap, 4,000m, dar 1,000m numerar net, deci EV 3,000m și 6×. "Cheaper, or just a different capital structure?"
  - `figure` (Line, 3 pași): prețul în funcție de rata de actualizare, pentru g = 1% și g = 6%. Curba companiei cu creștere mare e mai abruptă: fluxurile ei sunt mai departe în timp („equity duration”).
  - `callout` "Cheap can stay cheap": value trap. La minimul unui ciclu, P/E-ul arată mare pentru că profitul e deprimat.
- **Try:** widget `multiple-ranker` (nou).
  - Start: 4 companii sintetice cu același CF și creștere implicită g = 1%, 3%, 5% și 6.5%; rata 8%.
  - Obiectiv: "Order the four stocks by how much they fall when the discount rate rises one point."
  - Reușită: ordinea corectă (după g, adică după durată).
  - Indicii: 1. "The closer growth is to the discount rate, the more distant the cash flows." 2. "Compute 1 ÷ (r − g) before and after."
- **Practică:** S16 + S6, scenariul „Rate shock day”: o surpriză CPI sintetică (3.6) ridică rata cu 0.5 pp. Pe un coș de 6 acțiuni, utilizatorul prezice ordinea scăderilor înainte de reveal.
- **Check:**
  - q1 numeric d2: EV/EBITDA (market cap 2,400, datorie 900, numerar 300, EBITDA 300 → 10×; `vary`).
  - q2 mcq d2: de ce un P/E mic nu înseamnă automat subevaluat.
  - q3 mcq d3: o companie ciclică are P/E 45 la minimul ciclului. Ce arată: profit temporar deprimat, nu neapărat o acțiune scumpă.
- **Dovezi:**
  - Mechanic: definițiile și aritmetica actualizării (R4 §5.4 [S80]: ~93% din practicienii chestionați folosesc multipli; EV/EBITDA e cel mai folosit multiplu EV).
  - Valoarea ca factor: A/B pe termen lung, cu perioade lungi de subperformanță (R6 §2.16).
  - Multiplii ca instrument de timing pe termen scurt: D (R4 §5.4 [BK]).
- **Necesită:** S16; S6 pentru varianta cu surpriză CPI
- **Termeni noi de glosar:** pe-ratio, enterprise-value, ev-ebitda, value-trap, discount-rate

#### 3.8.4 · DCF and what the price implies
- **Nivel / durată / tip:** Advanced · 8 min · Electivă (Macro and news)
- **Obiective:**
  1. Value a company as the present value of five years of free cash flow plus a terminal value.
  2. Measure how much of the value depends on the terminal value and on the discount rate.
  3. Reverse a DCF to find the growth that today's price implies.
- **Concepte:** discounted-cash-flow (nou), implied-expectations (nou)
- **Se sprijină pe:** 3.8.3, 3.8.1 (FCF)
- **Hook:** predict · slider 1,500–2,600m, pas 10 · "A model values LABB at 1,968m vUSD with a 9% discount rate. Lower the rate to 8% and keep everything else the same. What is the new value?" Răspuns: 2,337m (+18.8%).
- **Interacțiunea centrală:**
  - `worked` "Five years and a tail", linie cu linie:
    - FCF: 100, 110, 121, 133.1, 146.4 (creștere 10% pe an).
    - Valoarea actuală la 9%: 467.2.
    - Terminal value = 146.4 × 1.025 ÷ (0.09 − 0.025) = 2,308.8; actualizată: 1,500.5.
    - Total: 1,967.8.
    - Ultimul pas cu input: ponderea terminal value = 76% (toleranță ±1).
  - `figure` heat map de sensibilitate (3 pași): WACC 8 / 9 / 10% → 2,337 / 1,968 / 1,697; terminal growth 1.5 / 2.5 / 3.5% → 1,755 / 1,968 / 2,258.
  - `reveal`: piața evaluează LABB la 2,600m. Ce creștere implică prețul? ≈ 18.9% pe an timp de 5 ani, aproape dublu față de cei 10% din model.
  - `callout` "A model, not a forecast": precizia falsă; un DCF nu spune *când* se închide diferența.
- **Try:** widget `dcf-slider` (nou).
  - Start: FCF1 100, creștere 10%, WACC 9%, terminal growth 2.5%.
  - Obiectiv: "LABB's market value is 2,600m vUSD. Find the five-year growth rate the price implies, with WACC 9% and terminal growth 2.5%."
  - Reușită: creșterea între 18.5% și 19.3% (exact: 18.9%).
  - Indicii: 1. "Move only the growth slider." 2. "The value must match 2,600m, not your opinion of it."
- **Practică:** lab-ul „Reverse-engineer the market” (S16). Prețurile a 3 companii sintetice sunt generate din ipoteze ascunse ale „pieței”. Utilizatorul estimează creșterea implicită pentru fiecare; o eroare ≤ 2 pp e corectă. Urmează un beat de reflecție: "Which of these expectations would you bet against, and what would prove you wrong?" (pregătește premortem-ul din 3.11.10).
- **Check:**
  - q1 numeric d1: valoarea actuală a 110 primiți peste un an, la 10% (= 100; `vary`).
  - q2 mcq d2: de ce terminal value domină evaluarea (R4 §5.5: adesea peste 60–70% [BK]).
  - q3 mcq d3: "The DCF says 2,000m, the price is 2,600m, so short it." Ce lipsește: modelul e o opinie, nu un semnal; nu are timing; ipotezele pieței pot fi corecte.
- **Dovezi:** Mechanic (matematica actualizării; R4 §5.5 [S80][BK]). DCF-ul ca semnal de tranzacționare: D.
- **Necesită:** S16; widget nou `dcf-slider`
- **Termeni noi de glosar:** present-value, dcf, terminal-value, wacc, reverse-dcf

#### 3.8.5 · Earnings season: expectations, surprise and the gap
- **Nivel / durată / tip:** Advanced · 8 min · Electivă (Macro and news)
- **Obiective:**
  1. Treat a beat as the base case and judge a report by the size of the surprise and by guidance.
  2. Size a position held through earnings so a gap past the stop costs at most 2R.
  3. Name the extended-hours risks: thin liquidity, limit-only orders, stops that fill at the open.
- **Concepte:** earnings-surprise (nou), gap-risk ✓, base-rates ✓
- **Se sprijină pe:** 2.10 (așteptări vs surpriză, surpriza standardizată), 1.3 (gap-uri și slippage), 3.8.2
- **Hook:** predict · alegere din 4 · "LABB beats the EPS consensus, 2.05 vs 2.00. After the close it drops 6%. What is the most likely reason?"
  - `a` "Algorithms misread the number"
  - `b` "A beat was expected; the real bar was higher" ✓
  - `c` "Earnings never move prices"
  - `d` "Short sellers manipulated it"

  Reveal: în S&P 500, rata de beat a fost ~78% în medie pe 5 ani și ~86% în T2 2026 (R4 §5.6 [S65]). Un beat e cazul obișnuit; contează mărimea surprizei și guidance-ul (3.8.6).
- **Interacțiunea centrală:**
  - `figure` (Candles + Marker, 4 pași): run-up de 10 zile (+7%); raportul după închidere; sesiunea extinsă, cu spread mare; deschiderea cu gap.
  - `worked` cu input: long la 100.00, stop la 95.00 (1R = 5.00). Deschiderea vine la 88.00, deci pierderea e 12.00 = 2.4R (utilizatorul introduce 2.4).
  - `worked` "Size for the gap", cu input: cont 10,000, risc 1% = 100, stop la 5.00 → 20 de unități. Cel mai mare gap din istoricul sintetic al LABB e 15.00, deci 20 × 15 = 300 = 3R, peste limita de 2R. Mărimea care respectă regula (R5 PR-12): floor(200 ÷ 15) = 13 unități (utilizatorul introduce 13).
  - `match` (4 perechi), risc al sesiunii extinse ↔ consecință: fără protecția NBBO; lichiditate mică; de obicei doar ordine limit; opțiunile nu se tranzacționează (R4 §5.9 [S86]).
  - `callout`: revizuirile estimărilor analiștilor și țintele de preț care urmăresc prețul (R4 §5.11; C).
- **Try:** widget `earnings-sim` (nou).
  - Start: LABB la 100.00, consens EPS 2.00, implied move ±8%, run-up +7% în 10 zile, cont 10,000, risc 1%.
  - Obiectiv: "Choose how to hold LABB through earnings so the worst-case gap costs at most 2R."
  - Reușită, una din trei decizii valide: flat înainte de raport; o poziție cu unități ≤ floor(2R ÷ cel mai mare gap); intrare după raport, cu stop. Orice altă alegere primește explicația gap-ului.
  - Indicii: 1. "A stop is an order, not a guarantee. It fills at the open." 2. "When you hold through the report, size from the gap, not from the stop."
- **Practică:** R5 + R4 în modul after-hours (adâncime 10%, doar ordine limit; R4 §5.9): 10 raportări sintetice la rând. Regula „gap ≤ 2R” se verifică la fiecare; S14 marchează pozițiile ținute prin raport fără calcul.
- **Check:**
  - q1 numeric d2: pierderea în R după un gap (entry 50.00, stop 48.00, deschidere 44.00 → 3R; `vary`).
  - q2 mcq d2: de ce un beat, singur, e informație slabă (rata de bază).
  - q3 mcq d3: ce ordine poți folosi în sesiunea extinsă și ce se întâmplă cu un stop când piața deschide cu gap.
- **Dovezi:** Mechanic (gap-ul și execuția stop-ului; R4 §5.9 [S86]; R5 RF-20). Rata de beat e un fapt statistic (R4 §5.6 [S65]). Reacția la mărimea surprizei: C.
- **Necesită:** S16 (consens, raportări), S6 (calendar și eveniment), S5 (sesiunea extinsă), S14
- **Termeni noi de glosar:** consensus-estimate, whisper-number, earnings-beat, extended-hours, estimate-revision

#### 3.8.6 · Guidance and the reaction matrix
- **Nivel / durată / tip:** Advanced · 6 min · Electivă (Macro and news)
- **Obiective:**
  1. Place an earnings report in the results × guidance matrix.
  2. Predict the gap sign for the clear cells and flag the mixed cells as uncertain.
  3. Explain why a habitual sandbagger's raise is already in the price.
- **Concepte:** earnings-guidance (nou), earnings-surprise (3.8.5)
- **Se sprijină pe:** 3.8.5
- **Hook:** predict · alegere "Gap up / Gap down / Coin flip" · "LABA misses EPS by 3% but raises full-year guidance by 8%. Gap up, gap down, or a coin flip?" Răspuns: tendința e în sus, pentru că guidance-ul schimbă fluxurile viitoare mai mult decât un singur trimestru. Celulele mixte sunt însă cele mai greu de prezis: reveal-ul arată distribuția gap-urilor din 40 de raportări sintetice din această celulă.
- **Interacțiunea centrală:**
  - `figure`, grila 3×3 (Zone + Marker, 3 pași): rezultate miss / in-line / beat × guidance cut / maintain / raise. Întâi se aprind colțurile clare (beat-and-raise, miss-and-cut), apoi celulele mixte, cu dispersie mare.
  - `predict`: semnul gap-ului pentru 3 celule.
  - `match`: 6 titluri sintetice de raportare ↔ celula lor.
  - `explain`: sandbagging-ul (un guidance conservator din obișnuință face ca raise-ul să fie deja așteptat); retragerea guidance-ului în criză; a doua mișcare, în timpul conference call-ului (reacția în două valuri, R4 §9A punctul 5).
- **Try:** widget `reaction-matrix` (nou).
  - Start: grila goală.
  - Obiectiv: "Predict the gap sign for all nine cells, then test your map on 40 synthetic reports."
  - Reușită: ≥ 7 din 9 celule corecte; la celulele mixte se acceptă și "uncertain".
  - Indicii: 1. "Guidance moves future cash flows more than one quarter does." 2. "When results and guidance disagree, the spread of outcomes is wide."
- **Practică:** `earnings-sim` cu o companie „sandbagger” (S16): raise-urile ei sunt așteptate, așa că un raise mic produce un gap în jos. După 8 raportări, utilizatorul își corectează harta și notează corecția în jurnal.
- **Check:**
  - q1 mcq d1: celula „beat-and-lower” și reacția ei tipică.
  - q2 mcq d2: de ce raise-ul unui sandbagger nu mișcă prețul.
  - q3 mcq d3: rezultate în linie, guidance tăiat, acțiunea +4%. Explicația cea mai probabilă: piața aștepta o tăiere mai mare (poziționare).
- **Dovezi:** C (R4 §5.7 [S82]: Moderate, din surse de practicieni; dovezile academice despre guidance nu au fost recuperate).
- **Necesită:** S16 (guidance sintetic), S6 (reacția în două valuri)
- **Termeni noi de glosar:** guidance, beat-and-raise, sandbagging

#### 3.8.7 · Implied move and IV crush
- **Nivel / durată / tip:** Advanced · 8 min · Electivă (Macro and news)
- **Obiective:**
  1. Estimate the market's implied earnings move from the at-the-money straddle price.
  2. Explain why a call can lose money after the stock rises.
  3. Compare realised moves with implied moves before calling options cheap or rich.
- **Concepte:** implied-move (nou), iv-crush (nou)
- **Se sprijină pe:** 3.8.5, 2.4 (volatilitatea), 3.9.3 (VIX, opțional)
- **Hook:** predict · slider 1–20%, pas 0.5 · "LABB trades at 100.00. The at-the-money straddle for the expiry just after earnings costs 7.95. How big a move, up or down, is the market pricing?" Răspuns: ≈ ±8% (7.95 ÷ 100).
- **Interacțiunea centrală:**
  - `explain`, minimul despre opțiuni (Greeks vin la 4.1): un call e dreptul de a cumpăra la strike, un put dreptul de a vinde; prețul = valoarea intrinsecă + valoarea incertitudinii.
  - `worked`, cu cifre Black–Scholes din simulator:
    - 7 zile până la expirare, IV 72%: call ATM 3.98 + put ATM 3.98 = 7.95, deci implied move ±7.95%.
    - După raport: prețul 103.00 (+3%), IV 30%, 6 zile rămase. Call-ul valorează 3.50, adică −0.48 (−12%), deși direcția a fost corectă.
    - Ultimul pas cu input: prețul de la care call-ul devine profitabil ≈ 103.60.
  - `reveal`: straddle-ul cumpărat la 7.95 valorează 3.99 la 103.00 (−50%). Ca să nu piardă, are nevoie de o mișcare de ≈ ±7.9%.
  - `callout`: dovezile despre „straddle-uri scumpe” sunt mixte. Într-un set de date, mișcarea reală a fost ~85% din cea implicită; alt studiu găsește prețuri corecte în agregat. Vânzarea de straddle-uri câștigă des și pierde rar, dar mult (R4 §5.8 [S83]).
- **Try:** widget `straddle-pricer` (nou; prețuri de opțiuni simplificate).
  - Start: S = 100.00, K = 100, 7 zile, IV 72%; după eveniment: IV 30%, 6 zile.
  - Obiectiv: "Find the smallest rise that makes the 3.98 call profitable the day after earnings, with implied volatility at 30%."
  - Reușită: răspuns între 103.50 și 103.70 (exact: 103.60).
  - Indicii: 1. "Most of the 3.98 was uncertainty. After the report, that part is gone." 2. "Move the price slider until the call is worth 3.98 again."
- **Practică:** R5 + R14 (simplificat): 12 raportări sintetice. Înaintea fiecăreia, utilizatorul notează implied move-ul și propria estimare a mișcării; după raport, se compară. Scorul e calibrarea estimărilor (eroarea medie), nu P&L-ul. Nicio poziție în opțiuni nu e obligatorie.
- **Check:**
  - q1 numeric d1: implied move (straddle 6.30 la prețul 90.00 → 7%; `vary`).
  - q2 mcq d2: de ce call-ul a pierdut deși prețul a urcat.
  - q3 mcq d3: "Earnings straddles usually lose, so always sell them." Ce lipsește: cozile, pierderile rare și mari, dovezile mixte.
- **Dovezi:** Mechanic: IV crush înseamnă rezolvarea incertitudinii (R4 §5.8; R6 §2.9.3). Afirmația că straddle-urile de earnings sunt sistematic scumpe: C (R4 §5.8 [S83]).
- **Necesită:** S12 parțial (doar call și put ATM cu IV; restul la 4.1), S16, R14
- **Termeni noi de glosar:** implied-volatility, straddle, implied-move, iv-crush

#### 3.8.8 · Post-earnings drift (PEAD)
- **Nivel / durată / tip:** Advanced · 8 min · Electivă (Macro and news)
- **Obiective:**
  1. Compute a standardised unexpected earnings (SUE) score.
  2. Describe PEAD and how much of it has disappeared since publication.
  3. Find the cost at which a drift portfolio stops paying, and where the drift still survives.
- **Concepte:** post-earnings-drift (nou), anomaly-decay (nou), earnings-surprise (3.8.5)
- **Se sprijină pe:** 3.8.5, 2.11 (expectancy cu interval de încredere), 3.11.2 (costul de break-even; recomandat)
- **Hook:** predict · alegere "Grown / Same / Shrunk" · "After big earnings surprises, prices tend to keep drifting the same way for weeks. Since the 1980s, has that drift grown, stayed the same, or shrunk?" Răspuns: s-a micșorat, de la ~5% în anii '80–'90 la ≤ 3% la sfârșitul anilor 2010. În large caps e practic zero din ~2006 (Martineau 2021).
- **Interacțiunea centrală:**
  - `worked` cu input: SUE = (actual − așteptat) ÷ abaterea standard a surprizelor trecute = (2.30 − 2.00) ÷ 0.12 = 2.5.
  - `figure` (Line, 3 pași): randamentul mediu cumulat pe 60 de zile după surprize mari pozitive și negative; 25–30% din drift apare la raportările următoare.
  - `explain`: Ball & Brown (1968). Bernard & Thomas (1989): spread-ul top-minus-bottom a fost pozitiv în 41 din 48 de trimestre (1974–1985). Explicații: subreacția și limitele arbitrajului.
  - `callout` "Where it lives": drift-ul e concentrat în acțiuni mici, nelichide și puțin urmărite de analiști, adică exact unde costurile sunt cele mai mari.
  - `match`: 3 afirmații despre PEAD ↔ adevărat / fals.
- **Try:** widget `sue-portfolio` (nou; în strategy lab).
  - Start: 60 de acțiuni sintetice, 8 ani, cu un drift sintetic mic.
  - Obiectiv: "Rank stocks by SUE, hold the top decile for 60 days, and find the round-trip cost at which the drift stops paying."
  - Reușită: costul de break-even găsit cu o eroare ≤ 10% față de valoarea din simulator.
  - Indicii: 1. "Raise the cost slider until net expectancy reaches zero." 2. "Compare small and large stocks separately."
- **Practică:** lab-ul „Drift decay” (S13). Efectul sintetic scade an de an după un eveniment de „publicare”. Înainte de start, utilizatorul scrie regula de oprire (de exemplu: "Stop when the 2-year net expectancy CI includes zero"). Scorul compară momentul opririi cu regula scrisă, nu P&L-ul.
- **Check:**
  - q1 numeric d1: SUE (`vary`).
  - q2 mcq d2: unde supraviețuiește PEAD și de ce acolo costurile sunt mari.
  - q3 mcq d3: "Positive in 41 of 48 quarters." Ce spune și ce nu spune despre azi.
- **Dovezi:** B, scăzut puternic (R4 §5.10 [S60][S61]; R6 §2.9.2; e exemplul de notă B din README §6). În large caps ≈ 0 din ~2006 (Martineau 2021; R6 §2.9.2). Regula generală McLean & Pontiff: −26% out-of-sample și −58% după publicare (README §6).
- **Necesită:** S16 (EPS și surprize pe multe companii), S9, S13 (clasament cross-secțional, model de costuri)
- **Termeni noi de glosar:** sue, pead, anomaly

#### 3.8.9 · Corporate events: buybacks, offerings, mergers, index changes
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Macro and news)
- **Obiective:**
  1. Predict the typical price reaction to a buyback, a share offering, a takeover bid and an index inclusion.
  2. Compute the deal-success probability implied by a merger spread.
  3. Adjust price history for splits and dividends so indicators and backtests show no fake gaps.
- **Concepte:** corporate-actions (nou), adjusted-price-data (nou)
- **Se sprijină pe:** 3.8.2 (buybacks), 2.14 (dividende și split-uri, de bază)
- **Hook:** predict · slider 0–100%, pas 5 · "LABD agrees to be bought for 50.00 cash per share. It trades at 47.00. If the deal fails, it falls back to 35.00. What deal-success probability does 47.00 imply?" Răspuns: 80% (p × 50 + (1 − p) × 35 = 47, deci p = 12 ÷ 15).
- **Interacțiunea centrală:**
  - `match` (5 perechi), eveniment ↔ reacția tipică (R4 §5.12):
    - buyback anunțat → creștere modestă, fără inversare în medie (95% sunt programe pe piață, neobligatorii);
    - emisiune secundară → scădere (diluare și ofertă în plus);
    - ofertă de preluare → ținta sare spre prețul oferit, cumpărătorul scade adesea;
    - includere în indice → cerere mecanică din partea fondurilor;
    - insider buying → informație.
  - `worked` cu input: probabilitatea implicită din spread (80%).
  - `figure` (Candles, 3 pași): un split 4-for-1 la 120.00. Graficul neajustat arată o „prăbușire” de 75%, iar media mobilă o urmează. Apoi graficul ajustat. Regula: toate prețurile anterioare se împart la 4.
  - `explain`: dividendul. Prețul scade cu aproximativ valoarea dividendului la ex-date. În SUA, cu decontarea T+1 (din mai 2024), ex-date coincide cu record date pentru dividendele obișnuite (R4 §5.12 [S84]). De aceea „dividend capture” nu e bani gratis.
- **Try:** widget `corp-action-lab` (nou).
  - Start: 50 de bare LABA, cu un split 4-for-1 la bara 31 și un dividend de 0.80 la bara 40.
  - Obiectiv: "Adjust LABA's last 50 bars for the split and the dividend so the 20-bar moving average shows no false crash."
  - Reușită: prețurile dinainte de split împărțite la 4; ajustarea pentru dividend aplicată; media mobilă continuă la bara 31 (diferență ≤ 0.01).
  - Indicii: 1. "A split changes the price and the share count, never the value." 2. "Adjust everything before the event, nothing after it."
- **Practică:** S16 + S6: 8 evenimente corporative sintetice pe 8 acțiuni. Pentru fiecare, utilizatorul alege flat, long, short sau "wait", cu o justificare din listă. Scor pe justificare și pe respectarea regulii de risc (gap ≤ 2R, din 3.8.5).
- **Check:**
  - q1 numeric d2: probabilitatea implicită (ofertă 30.00, preț 28.50, preț la eșec 22.00 → 81.25%; `vary`).
  - q2 mcq d1: ce schimbă un split (nimic din valoare).
  - q3 mcq d3: "Buy before the ex-date, sell after." De ce nu e profit: prețul scade cu dividendul, plus taxe și costuri.
- **Dovezi:** Mechanic (split, ex-date, ajustarea datelor; R4 §5.12 [S84][S85]; R6 §3.1). Buybacks: C (R4 §5.12 [S85]). Merger arbitrage: C, practică de nivel Expert (R4 §5.12 [BK]).
- **Necesită:** S16 (evenimente corporative), S10 (acțiuni: dividende, split-uri), S13 (date ajustate)
- **Termeni noi de glosar:** ex-dividend-date, stock-split, secondary-offering, merger-arbitrage, index-inclusion

---
## 3.9 · Sentiment, positioning and seasonality

**Fișa unității**
- **Scop:** utilizatorul citește sentimentul și poziționarea ca **stare** a pieței (cât de unilaterale sunt așteptările și pozițiile), nu ca trăgaci. Lucrează cu COT, VIX, put/call, sondaje, short interest și sentimentul social. Combină extremele cu o confirmare de preț și tratează sezonalitatea cu nota ei de dovezi și cu testul de testări multiple.
- **De ce aici:** vine după 3.6–3.7 (contextul macro și evenimentele) și după 2.12 (herding, recency). Sentimentul are sens doar împreună cu disciplina „extremele pot dura” (R4 §7.0). Sezonalitatea e la final pentru că e locul unde zgomotul trece cel mai ușor drept pattern (R4 §8.0).
- **Cere de dinainte:** 2.10, 2.12, 3.6. Pentru 3.9.2 ajută 3.14.1 (futures), dar lecția are propriul beat de recapitulare. 3.9.5 și 3.9.6 merg mai bine după 3.11.4 și 3.10.6.
- **Checkpoint:** `test-3.9`, 10 întrebări:
  - 3 numerice cu `vary`: COT index, intervalul din VIX, days-to-cover;
  - 5 mcq;
  - 2 cazuri d3, fiecare cu o săptămână de date de sentiment de interpretat.

  La ≥ 80%, lecțiile se marchează „Tested out”.
- **Laboratorul unității: „Sentiment dashboard”** (S17 + S13). Cinci ani sintetici. Tabloul arată COT, VIX, put/call, sondajul și short interest, toate calculate din populația de agenți a simulatorului.
  - Utilizatorul scrie o regulă de sentiment (stare + confirmare).
  - O testează in-sample / out-of-sample, cu costuri.
  - O rulează și pe un instrument R0 de control.
  - Scor: regula codificată, o singură deblocare OOS, controlul R0 rulat, intervalul de încredere interpretat corect.
- **Fire din spirală:**
  - Statistică: rata de bază a inversărilor după extreme; testările multiple din sezonalitate.
  - Psihologie: herding, FOMO, riscul de a deveni exit liquidity.
  - Dovezi: sentimentul C, sentimentul social D, sezonalitatea notată efect cu efect.
  - Proces: sentimentul intră în playbook ca filtru scris, nu ca trăgaci.
  - Risc: squeeze-ul împotriva tranzacției „evidente”.
- **Surse:** R4 §7.0–7.8, §8.0–8.16, §9 (I8, I9, A6, A7), §9A punctul 11; R6 §2.13, §3.5; R5 RR-02; R1 §2.13 (SE-01…SE-09).

#### 3.9.1 · Sentiment is a condition, not a trigger
- **Nivel / durată / tip:** Advanced · 6 min · Electivă (Technical analyst, Macro and news)
- **Obiective:**
  1. Read a weekly sentiment survey as a bull–bear spread against its own history.
  2. Explain why extremes raise the odds of a reversal but do not time it.
  3. Show that most survey swings follow price instead of leading it.
- **Concepte:** market-sentiment (nou), contrarian-signal (nou), base-rates ✓
- **Se sprijină pe:** 2.12 (herding, recency), 0.2 (hazardul care desenează pattern-uri), 2.10
- **Hook:** predict · alegere "Up / Down / Can't tell" · "A weekly investor survey shows 70% bears, the most in its history. Over the next four weeks, the index will most likely…" Răspuns: "Can't tell", pe un orizont de patru săptămâni. Extremele cresc probabilitatea unei inversări, dar nu o datează. Reveal: recordul AAII, 70.3% bearish, a venit pe 5 martie 2009, aproape de minimul pieței; dar sondajul poate sta mult timp de aceeași parte (R4 §7.0, §7.4 [S58]).
- **Interacțiunea centrală:**
  - `figure` (Line + Bars, 3 pași): prețul sintetic și spread-ul bull–bear săptămânal; spread-ul urmează prețul cu întârziere (așteptări adaptive); extremele de ±2 abateri standard sunt marcate.
  - `hotspot`: "Tap the week where sentiment led price instead of following it." Răspunsul e extrema de climax, una din trei.
  - `worked` cu input: z-ul spread-ului = (−30 − 6) ÷ 15 = −2.4, cu media +6 și abaterea standard 15.
  - `explain`: mediile istorice AAII sunt ~37.5% bullish, 31% neutral, 31.5% bearish (pagina AAII e inconsecventă între text și tabel). Alte sondaje [BK]: Investors Intelligence, NAAIM, BofA Fund Manager Survey, Fear & Greed.
- **Try:** widget `sentiment-signal-lab` (nou; S17).
  - Start: 5 ani de sondaj sintetic săptămânal, cu prețul.
  - Obiectiv: "Mark every week the bull–bear spread was beyond two standard deviations, then count how many were followed by a reversal within eight weeks."
  - Reușită: săptămânile marcate corect (toleranță 0) și numărul corect. Recap-ul arată rata de bază a inversărilor din generator și cazurile în care extrema s-a adâncit.
  - Indicii: 1. "Use the spread's own mean and standard deviation, not 50%." 2. "A reversal needs a rule. Here: a 5% move against the prior 8-week trend."
- **Practică:** S17, sondaj generat din așteptări adaptive pe un mix R1/R2. Generatorul include obligatoriu cazuri „extreme, and the trend continues for N more weeks” (R4 §7.0).
- **Check:**
  - q1 numeric d2: z-ul spread-ului bull–bear (`vary`).
  - q2 mcq d1: ce înseamnă 70% bearish: o stare a mulțimii, nu o predicție.
  - q3 mcq d3: un scenariu în care extrema e urmată de continuarea trendului; ce face utilizatorul cu regula „condition, not trigger”.
- **Dovezi:** C (R4 §7.4 [S57][S58]: Weak–Moderate; pragurile de tipul „bullish < 20%” vin din surse secundare, neverificate [S59]).
- **Necesită:** S17 (sondaj sintetic din așteptări adaptive)
- **Termeni noi de glosar:** sentiment-survey, bull-bear-spread, contrarian

#### 3.9.2 · Commitments of Traders
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Technical analyst, Macro and news)
- **Obiective:**
  1. Name the COT report families and their trader categories.
  2. Compute a three-year COT index from net positions.
  3. Explain the reporting lag and why commercial hedgers' shorts are not bearish bets.
- **Concepte:** commitments-of-traders (nou), positioning (nou)
- **Se sprijină pe:** 3.9.1; 3.14.1 (recomandat; lecția are un beat de recapitulare despre futures)
- **Hook:** predict · alegere zi a săptămânii · "Speculators' net long in synthetic crude is at a three-year high. You read the report on Friday, the day it comes out. On which day were these positions measured?" Răspuns: marți. Raportul apare vineri la 15:30 ET, cu datele de marți: 3 zile de decalaj (R4 §7.1 [S49][S50]).
- **Interacțiunea centrală:**
  - `explain`, recapitulare pentru cine n-a făcut 3.14: un contract futures are un cumpărător și un vânzător; open interest e numărul de contracte deschise.
  - `match` (3 rapoarte ↔ categoriile lor):
    - Legacy: commercial, non-commercial, non-reportable;
    - Disaggregated (mărfuri fizice, din 2009): producer/merchant, swap dealer, managed money, other reportables;
    - Traders in Financial Futures: dealer, asset manager, leveraged funds, other reportables.
  - `worked` cu input: COT index = (net − minim) ÷ (maxim − minim), pe 156 de săptămâni. Net 120k, minim −40k, maxim 140k → 160 ÷ 180 = 88.9%.
  - `callout`: pozițiile raportabile acoperă de obicei ~70–90% din open interest. Clasificarea e decizia CFTC și se poate schimba. Non-commercials nu înseamnă retail. Short-ul comercianților e adesea hedging.
- **Try:** widget `cot-index` (nou; S17).
  - Start: 156 de săptămâni de poziții „managed money” pe LXO.
  - Obiectiv: "Compute the 156-week COT index for managed money in LXO and decide whether it marks a crowded long (index ≥ 90)."
  - Reușită: indicele ±1 punct și eticheta corectă.
  - Indicii: 1. "Use the three-year minimum and maximum of the net position." 2. "Crowded is a condition. It says nothing about timing."
- **Practică:** S17 publică în fiecare vineri un COT sintetic cu datele de marți, calculat din populația de agenți. În strategy lab, utilizatorul compară intrările contrariene la COT 0/100 cu trend following pe aceleași piețe. Un eveniment „crowded long + surpriză negativă la stocuri” arată cum se amplifică ieșirea din poziții.
- **Check:**
  - q1 numeric d2: COT index (`vary`).
  - q2 mcq d1: cine sunt non-commercials (speculatori mari raportabili, nu retail).
  - q3 mcq d3: comercianții au cel mai mare short net din ultimii 3 ani. E un semnal bearish? De obicei e hedging-ul producătorilor.
- **Dovezi:** C (R4 §7.1: Weak–Moderate ca stare contrariană la extreme de mai mulți ani; slab ca timing, din cauza decalajului, a frecvenței săptămânale și a motivelor amestecate [S49][S50][BK]).
- **Necesită:** S17 (COT sintetic), S10 (futures sintetice), S9
- **Termeni noi de glosar:** cot-report, open-interest, commercial-hedger, managed-money, cot-index

#### 3.9.3 · VIX and put/call: fear priced in options
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Technical analyst, Macro and news)
- **Obiective:**
  1. Convert a VIX level into an expected one-month and one-week move.
  2. Explain why the VIX jumps when stocks fall and then mean-reverts.
  3. Read a put/call ratio against its baseline and see why structural shifts break fixed thresholds.
- **Concepte:** vix (nou), put-call-ratio (nou), implied-move (3.8.7)
- **Se sprijină pe:** 3.10.2 (regula rădăcinii pătrate a timpului; recomandat), 3.8.7 (opțional)
- **Hook:** predict · slider 1–20%, pas 0.5 · "The VIX reads 20. Roughly what one-month move, one standard deviation, does the options market price for the index?" Răspuns: ≈ 5.8% (20 ÷ √12).
- **Interacțiunea centrală:**
  - `worked` cu input: lunar, 20 ÷ √12 = 5.77%; săptămânal, 20 ÷ √52 = 2.77% (utilizatorul introduce 2.77).
  - `figure` (Line, 3 pași): o cădere sintetică; VIX-ul sare; apoi revine spre medie. În stres acut, curba futures pe VIX trece în backwardation.
  - `explain`: VIX e volatilitatea așteptată pe 30 de zile, calculată dintr-un șir de opțiuni SPX cu 23–37 de zile până la expirare, nu din Black–Scholes (R4 §7.2 [S51][S52]). Nu se tranzacționează direct; produsele pe VIX pierd la roll (3.14.3). Un VIX mic nu înseamnă siguranță.
  - `match`: put/call total, equity și index ↔ ce reflectă fiecare (index puts sunt mai ales hedging; raportul pe equity e indicatorul speculativ mai curat).
  - `callout`: raportul put/call total a avut media ~0.97 (2007–2022), cu extremele peste 1.23 și sub 0.72. Opțiunile 0DTE au mutat baza, iar pragurile fixe nu mai funcționează (R4 §7.3 [S54][S55]).
- **Try:** widget `vix-range` (nou; S17).
  - Start: indicele sintetic la 4,000, VIX sintetic 28.
  - Obiectiv: "The synthetic VIX is 28 and the index is at 4,000. Draw the expected one-week range, then count how often the next 52 weeks broke it."
  - Reușită: intervalul 3,844.7–4,155.3 (±1) și numărarea corectă.
  - Indicii: 1. "Weekly move = VIX ÷ √52, as a percent of the index." 2. "One standard deviation should break about a third of the time, more often with fat tails."
- **Practică:** S17: VIX-ul e calculat din suprafața de opțiuni a simulatorului (R14 + R3), cu un eveniment de crash. Apoi, în strategy lab, utilizatorul testează praguri de put/call înainte și după o „schimbare 0DTE” care mută baza.
- **Check:**
  - q1 numeric d2: din VIX în interval săptămânal (`vary`).
  - q2 mcq d1: ce înseamnă un VIX mic (posibilă complacere, nu siguranță).
  - q3 mcq d3: put/call 1.30 după creșterea volumului 0DTE. E semnal contrarian de cumpărare? Baza s-a mutat, deci nu fără confirmare.
- **Dovezi:** VIX ca măsură: Mechanic (calculat din prețuri de opțiuni; R4 §7.2 [S51][S52]). VIX ca semnal: C. Put/call: C (R4 §7.3 [S53]–[S55]).
- **Necesită:** S17 (VIX și put/call sintetice), S12 (suprafața de opțiuni, R14), S9
- **Termeni noi de glosar:** vix, put-call-ratio, zero-dte

#### 3.9.4 · Positioning, short interest and squeezes
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Technical analyst, Macro and news)
- **Obiective:**
  1. Compute days-to-cover from short interest and average volume.
  2. Explain how forced buying turns a small surprise into a large squeeze.
  3. Spot a social-media pump and avoid becoming someone's exit liquidity.
- **Concepte:** short-squeeze (nou), positioning (3.9.2)
- **Se sprijină pe:** 2.14 (short selling, împrumut, recall), 3.9.2, 1.7 (FOMO)
- **Hook:** predict · slider 1–20 zile · "LABE has 12 million shares sold short and trades 1.5 million shares a day. How many days of normal volume would all short sellers need to buy back?" Răspuns: 8 zile.
- **Interacțiunea centrală:**
  - `worked` cu input: days-to-cover = 12m ÷ 1.5m = 8.
  - `figure` (Candles + Bars, 4 pași): o știre pozitivă mică (+2%); short-urile cu stop încep să cumpere; volumul explodează; prețul face +35%, de câteva ori mai mult decât surpriza fundamentală (scenariu sintetic cu agenți).
  - `explain`: fluxurile mecanice care amplifică sau amortizează mișcările: fondurile trend-following (CTA), fondurile cu țintă de volatilitate, gamma dealerilor (doar numită; detalii la 4.1), short interest, margin debt (R4 §7.5 [BK]). Exemplu: episodul meme-stock din 2021 [BK].
  - `match`: 4 semnale ↔ "fuel" sau "noise".
  - `callout`: sentimentul social e zgomotos și manipulabil (boți, pump-and-dump; R4 §7.7). Cumpărările de herding de pe Robinhood au fost urmate de randamente anormale de ~−3% în 5 zile, −6% la herding extrem (R5 RR-02 [S39][S40]).
- **Try:** widget `squeeze-lab` (nou; S17).
  - Start: 3 acțiuni sintetice, fiecare cu short interest ca % din float, days-to-cover, comision de împrumut și volum relativ.
  - Obiectiv: "Before the news hits, rank three synthetic stocks by squeeze fuel."
  - Reușită: ordinea corectă. Recap-ul rulează aceeași știre pe toate trei.
  - Indicii: 1. "Fuel is short interest that can't exit fast: a high % of float and many days to cover." 2. "A rising borrow fee means shorts are crowded and lenders may recall."
- **Practică:** R4 + scenariul cu agenți „The hype cycle”: un feed social sintetic, amplificat de boți, pe o small cap. Prețul sare pe hype, apoi cade când insiderii vând. Detectorul FOMO (S14) marchează intrările din vârful hype-ului făcute fără plan; se verifică și regula de risc (stop și mărime).
- **Check:**
  - q1 numeric d1: days-to-cover (`vary`).
  - q2 mcq d2: ce alimentează un short squeeze: cumpărarea forțată, nu știrea.
  - q3 mcq d3: un ticker în trend pe rețelele sociale, cu volum în creștere și insideri care vând. Interpretarea cea mai probabilă: un pump, cu risc de exit liquidity.
- **Dovezi:** Mechanic (cumpărarea forțată la acoperire). Poziționarea ca prognoză: C (R4 §7.5 [BK]). Sentimentul social: D (R4 §7.7). Herding-ul retail: R5 RR-02 [S39][S40].
- **Necesită:** S17 (short interest, feed social sintetic), S10 (împrumut pentru short, recall), S14 (detector FOMO)
- **Termeni noi de glosar:** short-interest, days-to-cover, short-squeeze, exit-liquidity, pump-and-dump

#### 3.9.5 · Contrarian signals that wait for price
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Technical analyst, Macro and news)
- **Obiective:**
  1. Combine a sentiment extreme with a price-reversal confirmation into one written rule.
  2. Compare naive fades with confirmed fades in the strategy lab, after costs and out of sample.
  3. Tell the contrarian use of extremes from the trend-confirming use of moderate sentiment.
- **Concepte:** contrarian-signal (3.9.1), market-sentiment (3.9.1), confirmation (2.1)
- **Se sprijină pe:** 3.9.1–3.9.4, 3.11.4 (in-sample / out-of-sample; recomandat)
- **Hook:** predict · alegere A / B · "Two rules fade the same sentiment extremes. Rule A sells at once. Rule B waits for a weekly close below the prior week's low. Which loses less when the extreme keeps getting more extreme?" Răspuns: B. Prețul plătit: intră mai târziu și ratează o parte din mișcare.
- **Interacțiunea centrală:**
  - `figure` (Candles + Marker, 3 pași): o extremă bullish; regula A vinde imediat și e oprită de două ori cât timp trendul continuă; regula B intră abia după confirmare.
  - `order`: pașii unei reguli contrariene complete. Stare: extremă ≥ 2σ → trăgaci: confirmarea de preț → stop dincolo de extremă → ieșire → mărimea calculată din stop.
  - `explain`: folosirea „confirming”: optimismul moderat într-un trend sănătos e normal, nu un semnal de vânzare (R4 §7.6).
  - `predict`: rezultatul celor două reguli pe un episod nou.
- **Try:** strategy lab (S13), `sentiment-signal-lab` în modul reguli.
  - Start: datele S17 din 3.9.1; 70% in-sample.
  - Obiectiv: "Write a confirmed-fade rule, test it against the naive fade in-sample, then unlock the out-of-sample once."
  - Reușită (de proces, nu de profit): regula nu are termeni vagi (zero semnalări în rule builder); ambele reguli sunt testate cu costuri; OOS e deblocat o singură dată; expectancy e raportată cu interval de încredere.
  - Indicii: 1. "Confirmation must be a price event you can code." 2. "Report the CI. A positive mean with a CI across zero is not an edge yet."
- **Practică:** aceeași regulă rulată pe un instrument R0 de control, unde sentimentul sintetic e zgomot. Rezultatul așteptat: niciun edge. Dacă R0 „câștigă”, utilizatorul caută eroarea (look-ahead, 3.11.3).
- **Check:**
  - q1 mcq d2: de ce fade-urile naive pierd constant în trenduri.
  - q2 mcq d2: ce câștigi și ce pierzi când aștepți confirmarea.
  - q3 mcq d3: un rezultat OOS cu expectancy +0.08R și interval de încredere [−0.05R, +0.21R]. Verdictul: nu se distinge de zero; strângi mai multe date sau respingi regula, nu declari că „funcționează”.
- **Dovezi:** C (R4 §7.6 [S54]: rezultate mixte; funcționează mai bine cu confirmare de preț).
- **Necesită:** S13, S17, S7 (R0)
- **Termeni noi de glosar:** crowded-trade, sentiment-extreme

#### 3.9.6 · Calendar effects, graded
- **Nivel / durată / tip:** Advanced · 8 min · Electivă (Technical analyst, Macro and news)
- **Obiective:**
  1. Grade popular calendar effects by their evidence and post-publication record.
  2. Show how often pure noise produces a "significant" calendar pattern.
  3. Explain why a commodity's seasonal rise is usually already in the futures curve.
- **Concepte:** calendar-effects (nou), anomaly-decay (3.8.8), multiple-testing (3.10.6; aici doar demonstrat)
- **Se sprijină pe:** 0.2 (hazardul face pattern-uri), 3.8.8, 3.10.6 (recomandat)
- **Hook:** predict · slider 0–100%, pas 5 · "We scan 20 years of pure random-walk prices for the best month, weekday and turn-of-month pattern: 30 tests at the 5% level. What's the chance at least one looks 'significant'?" Răspuns: ≈ 79% (1 − 0.95³⁰ = 78.5%).
- **Interacțiunea centrală:**
  - `figure`, tabelul efectelor (Bars + Marker, 4 pași), cu nota fiecăruia (R4 §8; R6 §2.13):
    - Turn-of-the-month: B. McConnell & Xu (2008): în SUA, între 1926 și 2005, toată prima de risc a pieței a venit în jurul schimbării lunii; efectul apare în 31 din 35 de țări. Un working paper Fed arată că a dispărut în S&P futures după 1990. Mecanism plauzibil: fluxurile de final de lună.
    - Halloween / „Sell in May”: B/C. Apare în 36 din 37 de piețe (Bouman & Jacobsen 2002); critica: depinde de câțiva ani extremi (1987, 1998).
    - January effect: C (doar small caps, costuri mari, în scădere).
    - January barometer, Santa Claus rally, ciclul prezidențial: D (folclor; în total există ~20 de cicluri prezidențiale).
    - Monday effect: D azi (puternic istoric, dispărut după anii '90).
    - Pre-holiday: C/D.
    - Pre-FOMC drift: vezi 3.7.
    - Sezonalitatea mărfurilor: Mechanic ca fenomen fizic, C ca tranzacție.
    - Crypto: D.
  - `match`: 6 efecte ↔ nota lor.
  - `reveal`: graficul „seasonal natural gas”. Spot-ul crește iarna, dar contractul futures pe decembrie cumpărat în iunie avea deja creșterea în preț (R6 §3.5).
  - `callout`: în simulator, sezonalitatea e **oprită implicit** și apare doar în modul lab, ca nimeni să nu învețe pattern-uri false din date sintetice (R4 §8, nota de predare).
- **Try:** widget `seasonality-lab` (nou; S7 + R13).
  - Start: 3 piețe sintetice. Una are un drift real de turn-of-month, două sunt zgomot pur. Datele sunt împărțite în jumătate in-sample și jumătate hold-out.
  - Obiectiv: "Three synthetic markets: one has a real turn-of-month drift, two are pure noise. Find the real one in-sample, then confirm it once on the hold-out half."
  - Reușită: piața corectă, identificată și confirmată pe hold-out; utilizatorul raportează câte teste a rulat.
  - Indicii: 1. "Every slice you check is one more test." 2. "A real effect shows up again on data you haven't seen."
- **Practică:** sweep R13 vs R0: 10 piețe, din care 3 cu efect. Scor pe rata de detectare și pe rata de alarme false (pregătește 3.13.4).
- **Check:**
  - q1 numeric d2: 1 − 0.95^N (`vary` N între 5 și 40).
  - q2 mcq d1: nota pentru January barometer și motivul ei.
  - q3 mcq d3: "Natural gas rises every winter, so buy the December future in June." De ce nu funcționează: creșterea e deja în curba futures.
- **Dovezi:** efect cu efect, ca în tabel (R4 §8.0–8.16; R6 §2.13). Meta-constatarea despre scăderea anomaliilor: A (McLean & Pontiff; R4 §8.9).
- **Necesită:** S7 (random walk și laboratorul de statistici), S5 (calendar), S13, R13
- **Termeni noi de glosar:** turn-of-the-month, sell-in-may, data-mining

---
## 3.10 · Statistics for traders

**Fișa unității**
- **Scop:** instrumentele statistice de care are nevoie cineva care își evaluează singur metoda: forma distribuțiilor și cozile groase, volatilitatea ca proces, regresia la medie, ratele de bază și Bayes, semnificația unui edge, capcana testărilor multiple, independența rezultatelor. Fiecare lecție răspunde, din alt unghi, la aceeași întrebare: „e noroc sau e edge?”
- **De ce aici:** Nivelul 0 a dat valoarea așteptată, varianța, seriile și mărimea eșantionului. 2.11 a dat expectancy cu interval de încredere și SQN. Înainte de backtesting (3.11) și de teoria sizing-ului (3.12) e nevoie de limbajul care separă edge-ul de zgomot (R5 §10, Level 3, punctele 23 și 25; R1 §3.4, punctul 2: statistica în spirală, ca la CMT).
- **Cere de dinainte:** 0.2, 1.4 (expectancy), 2.4 (ATR, volatilitate), 2.11 (interval de încredere, SQN), 2.12 (biasuri).
- **Checkpoint:** `test-3.10`, 12 întrebări:
  - 6 numerice cu `vary`: regula √t, Bayes, t-statistic, 1 − 0.95^N, runs test, eroarea standard a Sharpe-ului;
  - 4 mcq;
  - 2 cazuri d3, fiecare cu un raport statistic de interpretat.

  La ≥ 80%, lecțiile se marchează „Tested out”.
- **Laboratorul unității: „Is it luck?”** (S15), pe jurnalul propriu al utilizatorului:
  - histograma R, cu skew;
  - intervalul de încredere pentru expectancy;
  - t-statistic și numărul de trade-uri necesar;
  - posteriorul Bayes că setup-ul are edge (prior ales și justificat de utilizator);
  - runs test pe secvența câștig/pierdere;
  - un verdict scris: „edge / not yet / no edge”.

  Dacă jurnalul are sub 30 de trade-uri, se folosește un set sintetic, marcat ca atare. Scor: calcule corecte și un verdict consistent cu ele.
- **Fire din spirală:**
  - Statistică: centrul unității.
  - Dovezi: R0 ca grup de control; exemplul Sullivan, Timmermann & White.
  - Psihologie: legea numerelor mici, hot hand și outcome bias, revăzute cantitativ.
  - Risc: cozile groase înseamnă stop-uri sărite și un Kelly supraestimat.
- **Surse:** R5 §8 (ST-01…ST-15), §4 (PM-07, PM-12, PM-13), BT-08, BT-17, RR-01; R6 §0.5 (R0, R3), §1.7; R1 §2.18 (BT-01…BT-05), §3.4 punctul 2, §4 punctul 3.

#### 3.10.1 · Distributions, skew and fat tails
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Describe a return or R distribution by its mean, median, spread, skew and tails.
  2. Estimate how often a five-sigma move appears under normal versus fat-tailed assumptions.
  3. Match strategy styles to their typical skew and the kind of pain each skew brings.
- **Concepte:** return-distribution (nou), fat-tails (nou), skewness (nou)
- **Se sprijină pe:** 0.2 (varianța), 1.4 (expectancy), 2.11 (metrici)
- **Hook:** predict · alegere din 4 · "Under a normal distribution, how often should a five-standard-deviation daily drop happen?"
  - `a` "About once a year"
  - `b` "About once a decade"
  - `c` "About once a century"
  - `d` "About once in 14,000 years" ✓

  Reveal: probabilitatea e 2.9 × 10⁻⁷, adică o dată la ~3.5 milioane de zile de tranzacționare (≈ 13,800 de ani, la 252 de zile pe an). Cu un generator cu cozi groase (Student-t cu 3 grade de libertate, aceeași varianță): ≈ 16 astfel de zile la 10,000, cam o dată la 2.5 ani.
- **Interacțiunea centrală:**
  - `worked`, sistemul de referință: media +0.4R, mediana −1R (cele mai multe trade-uri pierd), abaterea standard ≈ 1.71R.
  - `match`, 3 histograme R ↔ stilul:
    - trend follower: multe pierderi mici, câștiguri mari rare (skew pozitiv);
    - mean reverter: multe câștiguri mici, pierderi mari rare (skew negativ);
    - vânzător de opțiuni: skew foarte negativ.
  - `figure` (Bars, 3 pași): 10,000 de zile, generator normal vs cu cozi groase. Zile dincolo de 4σ, într-o direcție: ≈ 0.3 vs ≈ 31.
  - `explain`: Mandelbrot (1963), la prețurile bumbacului: parametrul de coadă ≈ 1.7 (la distribuția normală e 2); Fama găsește același lucru la acțiunile Dow 30. Consecințe: stop-urile sunt sărite (R4), VaR-ul subestimează (4.4), Kelly supradimensionează (3.12.3), Sharpe-ul flatează skew-ul negativ (3.10.5).
- **Try:** widget `distribution-lab` (nou; S7).
  - Start: istoricul LABX are 58 de zile dincolo de 4 abateri standard, în oricare direcție, din 10,000. Sunt disponibile două generatoare, normal și cu cozi groase.
  - Obiectiv: "LABX had 58 days beyond four standard deviations, either way, in 10,000 days. Run both generators and pick the one that matches."
  - Reușită: e ales generatorul cu cozi groase (≈ 62 de astfel de zile; cel normal dă ≈ 0.6); utilizatorul notează numerele din ambele rulări.
  - Indicii: 1. "Count both tails." 2. "A normal model almost never produces a 4-sigma day."
- **Practică:** sweep R3/R4: un stop la 3σ zilnic sub intrare; câte stop-uri sunt sărite cu gap în fiecare generator. Apoi histograma R din jurnalul propriu, cu skew, și debrief-ul "Which system would you stick with?"
- **Check:**
  - q1 mcq d1: media vs mediana la sistemul de referință (cele mai multe trade-uri pierd, iar expectancy e totuși pozitivă).
  - q2 mcq d2: ce stil are skew negativ.
  - q3 mcq d3: de ce Sharpe-ul flatează o strategie de vânzare de opțiuni (pierderile rare și mari pot lipsi din eșantion).
- **Dovezi:** Mechanic (statistică). Cozile groase ca fapt empiric: A (Mandelbrot 1963, Fama; R5 ST-04 [S119]). Skew-ul pe stiluri: R5 ST-02 [BK].
- **Necesită:** S7 (generator normal și cu cozi groase), S15
- **Termeni noi de glosar:** distribution, median, skew, kurtosis, fat-tails

#### 3.10.2 · Volatility: measure, scale, cluster
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Compute volatility from returns and scale it with the square root of time.
  2. Explain volatility clustering and why an estimate from a calm window fails after a regime switch.
  3. Distinguish realised volatility from implied volatility.
- **Concepte:** volatility ✓, square-root-of-time (nou), volatility-clustering (nou)
- **Se sprijină pe:** 2.4 (ATR, mărimea adaptată la volatilitate), 3.10.1
- **Hook:** predict · slider 1–100%, pas 1 · "LABX moves about 1% a day, one standard deviation. Roughly how much is that per year?" Răspuns: ≈ 16% (1% × √252 = 15.9%).
- **Interacțiunea centrală:**
  - `worked` cu input: săptămânal = 1% × √5 = 2.24%; anual = 15.9%. Apoi utilizatorul calculează: 0.8% pe zi → 1.79% pe săptămână.
  - `figure` (Line + Zone, 3 pași): un random walk cu conul √t. Drumul R0 stă în con ~68% din timp; drumul R3 îl rupe în valuri.
  - `explain`, volatility clustering: mișcările mari vin după mișcări mari (de tip GARCH, R3). O estimare a ATR din 20 de zile calme rămâne în urmă după o schimbare de regim. Exemplu: stop la 2×ATR, cu ATR-ul calm 0.80, deci la 1.60 distanță. În noul regim ATR-ul e 2.00, iar zgomotul obișnuit atinge stop-ul.
  - `callout`: regula √t e valabilă doar pentru randamente independente (3.10.7; Lo: anualizarea cu autocorelație induce în eroare). Volatilitatea realizată nu e același lucru cu cea implicită (VIX, 3.9.3).
- **Try:** widget `vol-cone` (nou; S7).
  - Start: LABX la 100.00, volatilitate zilnică 1.2%.
  - Obiectiv: "Draw the one-sigma cone for 20 days ahead, then switch the regime and count how often price leaves it."
  - Reușită: semi-lățimea la ziua 20 = 100 × 1.2% × √20 = 5.37, deci conul 94.63–105.37 (±0.05); numărarea corectă.
  - Indicii: 1. "Width grows with the square root of days, not with days." 2. "After the switch, the old cone is too narrow."
- **Practică:** Arena R3 (alternanță între scenariile „low volatility” și „high volatility”), cu sizing pe ATR (reluat din 2.4). Se măsoară acuratețea riscului după fiecare schimbare de regim.
- **Check:**
  - q1 numeric d2: din volatilitate zilnică în volatilitate săptămânală (0.8% → 1.79%; `vary`).
  - q2 mcq d1: ce înseamnă volatility clustering.
  - q3 mcq d3: de ce regula √t eșuează când randamentele au trend (autocorelație).
- **Dovezi:** Mechanic (regula √t, în condiții de independență). Volatility clustering: A, fapt empiric larg (R5 ST-03; R6 §0.5, R3).
- **Necesită:** S7, S2 (ATR, volatilitate realizată), R3
- **Termeni noi de glosar:** realised-volatility, annualised-volatility, volatility-clustering, square-root-of-time-rule

#### 3.10.3 · Regression to the mean
- **Nivel / durată / tip:** Advanced · 6 min · Core
- **Obiective:**
  1. Predict how an extreme early result will look in the next sample when outcomes contain noise.
  2. Tell regression from "the market changed" when a hot setup cools down.
  3. Explain why the best backtest out of many is likely to disappoint.
- **Concepte:** regression-to-the-mean (nou)
- **Se sprijină pe:** 0.2 (noroc vs abilitate), 2.12 (recency), 3.10.1
- **Hook:** predict · slider −12% … +12%, pas 1 · "Fifty synthetic traders with zero skill trade for a month. The top five averaged +12%. What will the same five average next month?" Răspuns: ≈ 0%, minus costuri.
- **Interacțiunea centrală:**
  - `explain`: rezultatul observat = edge-ul real + zgomot. Cu cât zgomotul e mai mare, cu atât tragerea spre medie e mai puternică.
  - `worked` cu input: un setup a făcut +1.5R pe trade în primele 15 trade-uri; edge-ul lui real e +0.3R. Utilizatorul alege media așteptată pentru următoarele 15 (≈ +0.3R).
  - `reveal` "Rookie of the year": 50 de traderi ordonați după luna 1; se dezvăluie luna 2 a primului decil.
  - `callout`: cel mai bun backtest dintre multe e ales și pentru norocul lui (winner's curse, 3.11.5). Regresia nu înseamnă „s-a schimbat piața” (3.13.7).
- **Try:** widget `rookie-of-the-year` (nou; S7).
  - Start: 50 de traderi sintetici; un slider pentru ponderea skill-ului (0–100% din varianța rezultatelor).
  - Obiectiv: "Set the skill share so the month-1 top decile keeps at least half its edge in month 2."
  - Reușită: persistența (media primului decil în luna 2 ÷ media lui în luna 1, pe 1,000 de repetări) ≥ 0.5. În modelul simulatorului, persistența așteptată e chiar ponderea skill-ului, deci răspunsul e ≥ 50%.
  - Indicii: 1. "Zero skill means month 2 is a fresh coin toss." 2. "The more of the result is luck, the more it fades."
- **Practică:** S15 pe jurnalul propriu: cel mai bun setup din primele 20 de trade-uri vs următoarele 20. Dacă jurnalul e prea scurt, un set sintetic.
- **Check:**
  - q1 mcq d1: la ce să te aștepți după o serie foarte bună.
  - q2 mcq d2: cum deosebești regresia de scăderea reală a unui edge.
  - q3 mcq d3: alegi cea mai bună dintre 30 de configurații. Ce aștepți out-of-sample față de in-sample (mai puțin).
- **Dovezi:** Mechanic (R5 ST-07).
- **Necesită:** S7, S15
- **Termeni noi de glosar:** regression-to-the-mean, winners-curse

#### 3.10.4 · Base rates and Bayesian updating
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Turn a base rate, a test's hit rate and its false-alarm rate into the probability that an idea has a real edge.
  2. Build a natural-frequency tree out of 1,000 ideas.
  3. Update a belief about a setup as trades arrive, without jumping to certainty.
- **Concepte:** base-rates ✓, bayesian-updating (nou)
- **Se sprijină pe:** 0.2, 2.11 (interval de încredere), 3.10.3
- **Hook:** predict · slider 0–100%, pas 1 · "10% of new setup ideas have a real edge. Your test catches 80% of real edges but also passes 20% of useless ones. Your idea passed. How likely is it to be real?" Răspuns: 31%.
- **Interacțiunea centrală:**
  - `figure`, arbore de frecvențe naturale (Flow, 4 pași): 1,000 de idei → 100 cu edge → 80 trec testul; 900 fără edge → 180 trec; deci 80 din 260 = 31%.
  - `worked` cu input: cu un test mai strict, care lasă să treacă 5% din ideile fără edge: 45 trec, deci 80 ÷ 125 = 64%.
  - `explain`, actualizarea pas cu pas: o rată de câștig de 60% pe 20 de trade-uri are intervalul de încredere 38.5%–81.5% (R5 ST-05), deci mută foarte puțin credința.
  - `callout`: rata de bază pentru întrebarea „voi fi profitabil?”: 74–89% din conturile CFD retail pierd (README §1; R5 RR-01).
- **Try:** widget `bayes-tree` (nou).
  - Start: prior 10%, puterea testului 80%, rata de alarme false 20%.
  - Obiectiv: "Find the false-alarm rate your test needs so that a passed idea is real at least 60% of the time (prior 10%, power 80%)."
  - Reușită: rata de alarme false ≤ 5.9% (0.08 ÷ (0.08 + 0.9x) ≥ 0.6 ⇒ x ≤ 5.93%).
  - Indicii: 1. "Most passed ideas come from the large pool of useless ones." 2. "Shrink the false alarms, not the prior."
- **Practică:** jurnalul de cercetare (S13) primește câmpul „prior”: pentru fiecare ipoteză, utilizatorul notează cât de plauzibilă e și cine e de partea cealaltă. Câmpul se folosește în 3.11 și în Capstone 3.
- **Check:**
  - q1 numeric d2: probabilitatea posterioară (`vary` prior, putere, alarme false).
  - q2 mcq d2: ce înseamnă base-rate neglect.
  - q3 mcq d3: "My backtest passed, so I'm 95% sure it works." Ce lipsește: priorul și rata de alarme false.
- **Dovezi:** Mechanic (R5 ST-10). Rata de bază retail: R5 RR-01 [S24].
- **Necesită:** widget nou `bayes-tree` (fără simulator); S13 pentru câmpul din jurnalul de cercetare
- **Termeni noi de glosar:** prior, posterior, false-positive, base-rate-neglect

#### 3.10.5 · Significance: is your edge distinguishable from zero?
- **Nivel / durată / tip:** Advanced · 8 min · Core
- **Obiective:**
  1. Compute a t-statistic for mean R and read its p-value correctly.
  2. Estimate how many trades a given edge needs before it is distinguishable from zero.
  3. Read a Sharpe ratio together with its standard error.
- **Concepte:** statistical-significance (nou), sharpe-ratio (nou)
- **Se sprijină pe:** 2.11 (expectancy cu interval de încredere, SQN), 3.10.1, 3.10.4
- **Hook:** predict · alegere "Yes / No / Can't tell" · "Your setup averages +0.2R per trade over 50 trades, with a standard deviation of 1.5R. Is that edge distinguishable from zero?" Răspuns: nu, t = 0.94. Pentru t ≈ 2 ar fi nevoie de ~225 de trade-uri.
- **Interacțiunea centrală:**
  - `worked` cu input: t = 0.2 ÷ (1.5 ÷ √50) = 0.94, deci p ≈ 0.35. Trade-uri necesare pentru t = 2: (2 × 1.5 ÷ 0.2)² = 225.
  - `explain`: p-value e probabilitatea unor date cel puțin atât de extreme dacă edge-ul ar fi zero. **Nu** e probabilitatea ca edge-ul să existe (vezi Bayes, 3.10.4).
  - `match`: SQN ↔ t-statistic. Sistemul de referință are SQN 2.33 la n = 100, deci p ≈ 0.02.
  - `worked`, Sharpe: excesul mediu zilnic 0.05% ÷ abaterea zilnică 1% = 0.05, anualizat × √252 = 0.79. Eroarea standard ≈ √((1 + SR² ÷ 2) ÷ T): un Sharpe de 1.0 pe 3 ani are SE 0.71, deci intervalul de 95% e −0.39 … 2.39; pe 10 ani, 0.24 … 1.76.
  - `callout`: pentru R cu skew, bootstrap-ul dă intervale mai corecte. Un edge de 0.1R cu abaterea 1.2R are nevoie de ~550 de trade-uri ca să excludă zero la 95%.
- **Try:** widget `is-it-luck` (nou; S15).
  - Start: ultimele 60 de trade-uri din jurnalul de la Nivelul 2, sau setul sintetic (media 0.15R, abaterea 1.4R).
  - Obiectiv: "Find the t-statistic of your mean R, and how many trades you'd need for t = 2 at the same edge."
  - Reușită: t ±0.05 și numărul de trade-uri ±5%. Pe setul sintetic: t = 0.83, n = 349.
  - Indicii: 1. "Standard error = standard deviation ÷ √n." 2. "Trades needed = (2 × sd ÷ mean)²."
- **Practică:** S15 pe datele proprii; setul sintetic dacă jurnalul are sub 30 de trade-uri.
- **Check:**
  - q1 numeric d2: t-statistic (`vary`).
  - q2 mcq d2: interpretarea corectă a unui p-value.
  - q3 mcq d3: un Sharpe de 3 pe 3 luni. Ce poți concluziona: aproape nimic, eroarea standard e ≈ 4.7.
- **Dovezi:** Mechanic (R5 PM-07 [S97][S91], PM-12, PM-13 [S85], ST-09).
- **Necesită:** S15
- **Termeni noi de glosar:** t-statistic, p-value, standard-error, sharpe-ratio, bootstrap

#### 3.10.6 · Many tests, false discoveries
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Compute the chance that at least one of N useless strategies looks significant.
  2. Apply a simple Bonferroni correction and see what it costs.
  3. Use an R0 random-walk control to expose spurious "discoveries".
- **Concepte:** multiple-testing (nou), spurious-correlation (nou), random-walk (0.2)
- **Se sprijină pe:** 3.10.5, 0.2 (hazardul care desenează pattern-uri)
- **Hook:** predict · slider 0–100%, pas 1 · "You test 20 indicator rules, none with any real edge, at the 5% level. What's the chance at least one looks like it works?" Răspuns: 64%.
- **Interacțiunea centrală:**
  - `worked` cu input: 1 − 0.95²⁰ = 64%.
  - `explain`: corecția Bonferroni: pragul devine α ÷ N = 0.05 ÷ 20 = 0.25%. Corecțiile moderne (Harvey & Liu: un t de 3.0 coboară la ~2.0 după ajustare) vin la 4.3.
  - `figure` (Line, 3 pași), corelația falsă: din 100 de serii aleatoare, cea mai bună are corelație 0.4 cu LABX pe 2 ani; pe următorii 2 ani, ≈ 0.
  - `callout`: fiecare ajustare de parametru e încă un test și se numără. Controlul R0: dacă aceeași căutare găsește la fel de multe „descoperiri” pe date R0, ale tale sunt zgomot. Exemplul istoric: regulile tehnice cu rezultate mari în Brock, Lakonishok & LeBaron (1992) nu au trecut testele ajustate pentru data snooping (Sullivan, Timmermann & White 1999).
- **Try:** widget `p-hacking-arcade` (nou; S7 + S13).
  - Start: date LABX neetichetate (de fapt R0), un meniu de reguli cu indicatori, un contor de încercări.
  - Obiectiv: "Find a rule that looks significant at 5% in under 20 tries. Then correct the threshold for the number of tries you used."
  - Reușită: pragul corectat = 0.05 ÷ numărul de încercări (exact) și verdictul "not significant" când p e peste prag. Recap-ul dezvăluie că datele erau R0.
  - Indicii: 1. "Count every rule you ran, not just the one you kept." 2. "Divide 5% by that count."
- **Practică:** sweep R0: 100 de serii aleatoare generate; utilizatorul caută cel mai bun „predictor” al LABX in-sample, apoi îl testează pe extrageri noi. Corelația se prăbușește.
- **Check:**
  - q1 numeric d2: 1 − 0.95^N (`vary`).
  - q2 numeric d2: pragul Bonferroni (α 5%, 25 de teste → 0.2%; `vary`).
  - q3 mcq d3: "1 of 25 configurations was significant at p = 0.03." Verdictul: compatibil cu norocul.
- **Dovezi:** Mechanic (R5 ST-09, BT-08 [S89][S90], BT-17 [S96]; R6 §1.7 [PK, verify]).
- **Necesită:** S7, S13 (contor de încercări)
- **Termeni noi de glosar:** multiple-testing, bonferroni-correction, p-hacking, spurious-correlation

#### 3.10.7 · Autocorrelation and independence
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Read the sign of return autocorrelation as a fingerprint of trending, mean-reverting or random markets.
  2. Run a runs test on a win–loss sequence to check whether outcomes cluster.
  3. Explain which tools break when trades are not independent.
- **Concepte:** autocorrelation (nou), market-regime (2.8)
- **Se sprijină pe:** 2.8 (strategii pe regim), 0.2 (serii), 3.10.2
- **Hook:** hotspot · 3 grafice neetichetate · "Three markets, each plotted as today's return against yesterday's. Tap the one that trends." Răspuns: cel cu panta pozitivă.
- **Interacțiunea centrală:**
  - `figure` (3 grafice de puncte, 3 pași): R1 cu autocorelație pozitivă, R2 negativă, R0 ≈ 0.
  - `worked` cu input, runs test: 40 de câștiguri și 60 de pierderi. Numărul așteptat de serii E = 2 × 40 × 60 ÷ 100 + 1 = 49, cu abaterea standard 4.77. Observat: 38 de serii, deci z = (38 − 49) ÷ 4.77 = −2.30: rezultatele se grupează.
  - `explain`: ce se strică atunci când rezultatele nu sunt independente: formula Kelly, formula risk of ruin, Monte Carlo prin reamestecare (subestimează drawdown-ul), regula √t, anualizarea Sharpe (Lo: autocorelația poate umfla Sharpe-ul anualizat al fondurilor de hedging cu până la 65%). Soluții: block bootstrap, testare pe regimuri.
  - `callout`: filtrul pe equity curve ajută doar când rezultatele se grupează (3.12.7).
- **Try:** widget `runs-test` (nou; S15).
  - Start: secvența cu 40 de câștiguri, 60 de pierderi și 38 de serii.
  - Obiectiv: "Your last 100 trades: 40 wins, 60 losses, 38 runs. Compute the z-score and decide whether your outcomes cluster."
  - Reușită: z = −2.30 (±0.05) și verdictul "clusters" (|z| > 1.96).
  - Indicii: 1. "Fewer runs than expected means wins and losses come in bunches." 2. "Expected runs = 2·n1·n2 ÷ (n1 + n2) + 1."
- **Practică:** clasificatorul de regim: 6 serii neetichetate din R0, R1 și R2. Utilizatorul calculează autocorelația de lag 1 și etichetează fiecare serie; scorul se compară cu eticheta ascunsă. Apoi runs test pe jurnalul propriu.
- **Check:**
  - q1 numeric d2: numărul așteptat de serii (`vary`).
  - q2 mcq d1: semnul autocorelației într-o piață în range (negativ).
  - q3 mcq d3: ce instrument induce în eroare când rezultatele se grupează (Monte Carlo prin reamestecare subestimează drawdown-ul; formula RoR).
- **Dovezi:** Mechanic (R5 ST-12 [BK: Wald–Wolfowitz]; PM-07 [S97]).
- **Necesită:** S7, S15
- **Termeni noi de glosar:** autocorrelation, runs-test, independence

---
## 3.11 · Backtesting and system design

**Fișa unității**
- **Scop:** procesul complet de cercetare, cu o poartă în strategy lab la fiecare pas: ipoteză → reguli → date → execuții și costuri → biasuri → in-sample / out-of-sample → overfitting și controlul R0 → walk-forward → Monte Carlo → robustețe → benchmark-uri aleatoare → incubare, kill switch și jurnal de cercetare.
- **De ce aici:** vine după 3.10 (semnificație, testări multiple, autocorelație). 2.8 a introdus evaluarea cu costuri, iar laboratorul de overfitting pe R0 a apărut la nivel de bază (R6 §7, Stage 2); aici devine riguros. Vine înainte de 3.12 pentru că semnalul se validează în R, iar sizing-ul vine după (R5 BT-23). Cursurile de retail predau construcția de sisteme fără biasuri și robustețe; de aici vine optimizarea până la curba perfectă (R1 §3.3).
- **Cere de dinainte:** 3.10 (toată), 2.8 (strategiile pe regim, evaluarea cu costuri), 2.11 (metrici), 2.13 (playbook, KPI-uri), 1.6 (jurnalul).
- **Checkpoint:** `test-3.11`, 15 întrebări:
  - 5 numerice cu `vary`: costul în R, WFE, eroarea standard a Sharpe-ului pe OOS, e-ratio, percentile Monte Carlo;
  - 7 mcq;
  - 3 cazuri d3 de tip „bug hunt” pe un raport de backtest.

  La ≥ 80%, lecțiile se marchează „Tested out”.
- **Laboratorul unității: „Validation dry run”** (S13). Utilizatorul primește două sisteme gata făcute. Unul are 4 probleme ascunse: un look-ahead, un univers doar cu supraviețuitori, costuri zero și parametri pe un vârf izolat. Celălalt e sănătos. Pe ambele rulează checklist-ul complet de validare (cel din Capstone 3), găsește problemele și scrie verdictele. Scor: probleme găsite, pași rulați în ordine, verdicte corecte.
- **Fire din spirală:**
  - Proces: jurnalul de cercetare, guvernarea regulilor, cardul de go-live.
  - Statistică: in-sample / out-of-sample, Monte Carlo, semnificație.
  - Dovezi: controlul R0 în fiecare raport, benchmark-urile aleatoare.
  - Costuri: costul de break-even și stresul pe costuri; impactul vine la 4.2.
  - Psihologie: premortem-ul; „variance vs breakage” ca antidot pentru abandonarea unui sistem bun.
- **Surse:** R5 §7 (BT-01…BT-25), PL-02, PL-14, PSY-32, PSY-36, TM-18, ST-14, ST-15; R6 §1.7, §2.2.2, §6.4; R1 §2.18 (BT-06…BT-14), §3.3, §4 punctele 3 și 6.

#### 3.11.1 · From hypothesis to rules
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Write a falsifiable edge hypothesis that names who is on the other side.
  2. Turn it into rules precise enough that two people, or code, produce identical trades.
  3. Prepare data that matches the rules, and test in R before any sizing.
- **Concepte:** edge-hypothesis (nou), codified-rules (nou), research-log (nou), adjusted-price-data (3.8.9)
- **Se sprijină pe:** 2.13 (playbook), 2.8 (strategii pe regim), 3.10.4 (priorul)
- **Hook:** predict · slider 0–40 · "Two traders apply the rule 'buy strong breakouts in an uptrend' to the same 40 LABX signals. On how many trades do they agree?" Răspuns: 17 din 40, în scenariul scris (două interpretări precodificate ale aceleiași reguli vagi).
- **Interacțiunea centrală:**
  - `explain`, șablonul de ipoteză: "Because [mechanism], when [condition], price tends to [effect] over [horizon] in [market or regime]. The other side is [who], because [why]." Exemplul din R5 BT-01: după o compresie a volatilității, breakout-urile în direcția trendului de pe timeframe-ul mare continuă mai des decât la întâmplare, pentru că stop-urile se adună dincolo de range.
  - `match`: 4 ipoteze ↔ falsificabilă / nefalsificabilă.
  - `order`, părțile unei reguli: condiție → trăgaci → stop → ieșire → mărime (fixă, 1R, pentru testare).
  - `explain`, datele: prețuri ajustate (3.8.9), date point-in-time, contracte continue (3.14.2), fus orar, bid/ask.
  - `callout`: jurnalul de cercetare începe aici. Fiecare rulare se numără (pregătește 3.10.6 și 3.11.5).
- **Try:** widget `rule-builder` (nou; S13).
  - Start: cardul de ipoteză din exemplu; rule builder cu blocurile condition, trigger, stop, exit, sizing.
  - Obiectiv: "Turn the hypothesis card into rules: condition, trigger, stop and exit. The builder flags every vague word."
  - Reușită: zero semnalări; două rulări produc trade-uri identice; sizing-ul e fix, 1R.
  - Indicii: 1. "'Strong' needs a number, for example a range above 1.5 × ATR(14)." 2. "Every rule may use only data available at the moment of the decision."
- **Practică:** research notebook (S13): prima intrare în jurnalul de cercetare (ipoteza, priorul, cine e de partea cealaltă, datele, regimul vizat). Strategy lab-ul nu rulează niciun backtest fără ea.
- **Check:**
  - q1 mcq d1: care ipoteză e falsificabilă.
  - q2 mcq d2: de ce se testează întâi în R, cu mărime fixă (sizing-ul poate ascunde sau umfla un edge).
  - q3 mcq d3: găsește problema de date dintr-un setup (un split neajustat creează un breakout fals).
- **Dovezi:** Mechanic, ca proces (R5 BT-01–BT-03, BT-23 [S91]).
- **Necesită:** S13 (rule builder, research notebook)
- **Termeni noi de glosar:** edge-hypothesis, research-log, point-in-time-data

#### 3.11.2 · Fills and costs in a backtest
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Choose conservative fill rules: next-bar execution, stop first when stop and target share a bar, limits filled only when price trades through.
  2. Express every cost as a fraction of R and subtract it from gross expectancy.
  3. Find a strategy's breakeven cost and compare it with the costs you will actually pay.
- **Concepte:** fill-assumptions (nou), breakeven-cost (nou), trading-costs ✓, slippage ✓
- **Se sprijină pe:** 3.11.1, 1.1 (costuri), 2.9 (scalping și zidul costurilor)
- **Hook:** predict · slider −0.20R … +0.20R, pas 0.01 · "A LABX strategy earns +0.15R per trade before costs. Its stop is 2.00 away; spread plus commissions cost 0.20 per unit. What's left per trade?" Răspuns: +0.05R, adică −67%.
- **Interacțiunea centrală:**
  - `worked` cu input: costul pe unitate = spread 0.10 + 2 × comision 0.05 (la prețul 100) = 0.20; 0.20 ÷ 2.00 = 0.10R. Aceleași costuri cu un stop de 0.50: 0.40R.
  - `worked`, costul de break-even: un edge brut de 0.15R înseamnă 0.30 pe unitate, adică de 1.5 ori costurile actuale.
  - `figure`, regulile de execuție (Candles + Marker, 4 pași): semnal la închidere, execuție la deschiderea următoare; stop și target în aceeași bară → se presupune că s-a atins întâi stop-ul; limita se execută doar dacă prețul trece prin ea; execuție parțială.
  - `predict`: care regulă de execuție e conservatoare.
  - `callout`, opening range breakout: brut +0.13R pe NQ, cu 23% trade-uri câștigătoare. Prima lumânare conține ~0.1R de informație, cam cât costă un round trip. După spread și slippage, niciuna din cele 5 piețe de indici nu s-a distins de zero, iar 4 din 5 au fost negative (R6 §2.2.2).
- **Try:** strategy lab, widget `fill-toggle` (nou; S13).
  - Start: sistemul din 3.11.1, cu execuții „same-bar close” și costuri 0×.
  - Obiectiv: "Switch the fills to conservative, then raise costs until expectancy hits zero. Report the breakeven cost multiple."
  - Reușită: execuții conservatoare (bara următoare, stop întâi, trade-through) și multiplul de break-even ±0.05 față de valoarea din simulator.
  - Indicii: 1. "Conservative means the worst plausible fill, not the average one." 2. "Breakeven cost multiple = gross edge ÷ current cost."
- **Practică:** R6 intraday și R1: aceleași reguli pe bare de 1H și pe bare zilnice; ponderea costurilor în R (reluare din 2.9). Spread-ul variază la deschidere și la știri (S5, S6).
- **Check:**
  - q1 numeric d2: costul în R (`vary` spread, comision, stop).
  - q2 mcq d2: stop și target în aceeași bară; presupunerea conservatoare.
  - q3 mcq d3: în backtest, un ordin limit s-a executat la simpla atingere a prețului. De ce e optimist: coada de ordine; poate nu ai fi fost executat.
- **Dovezi:** Mechanic (R5 BT-04, BT-05 [S112], RF-21). Opening range breakout: C (R6 §2.2.2).
- **Necesită:** S13 (reguli de execuție, model de costuri), S5 (spread variabil pe sesiuni), S6
- **Termeni noi de glosar:** next-bar-execution, intrabar-ambiguity, breakeven-cost, cost-stress

#### 3.11.3 · Look-ahead and survivorship
- **Nivel / durată / tip:** Advanced · 6 min · Core
- **Obiective:**
  1. Find the line in a backtest that uses information not available at decision time.
  2. Show how testing only today's survivors inflates results.
  3. Build a pre-test checklist against both biases.
- **Concepte:** look-ahead-bias (nou), survivorship-bias (1.8)
- **Se sprijină pe:** 3.11.1, 1.8 (survivorship bias la „gurus”)
- **Hook:** predict · alegere "Real edge / Bug" · "A rule buys LABX at the open whenever the day closes above its 20-day high. Backtest: 84% winners. Real edge or a bug?" Răspuns: bug. La deschidere, închiderea zilei nu e încă cunoscută.
- **Interacțiunea centrală:**
  - `hotspot`, pe liniile unei reguli scrise ca pseudocod: tap pe linia care „vede viitorul”.
  - `explain`, de unde vine look-ahead-ul: închiderea barei folosită cu execuție în aceeași bară; maximul sau minimul zilei folosit înainte de finalul zilei; fundamentale revizuite ulterior (3.8); componența de azi a indicelui.
  - `figure`, survivorship (Bars, 3 pași): un univers de 50 de acțiuni sintetice, din care 12 au fost delistate. Regula „buy the 10 cheapest each month”, rulată doar pe supraviețuitori și apoi pe tot universul. Regulile de tip mean reversion și value sunt cele mai umflate (R5 BT-07, exemplul lui Chan).
  - `order`, checklist-ul dinaintea testului: marchează momentul fiecărui input → verifică universul la data respectivă → prețuri ajustate → instrumentele delistate incluse → costurile pornite.
- **Try:** widget `bug-hunt` (nou; S13).
  - Start: trei backtest-uri, fiecare cu câte un bug.
  - Obiectiv: "Three backtests, one bug each. Tap the rule line that leaks the future, or the universe that hides the dead."
  - Reușită: 3 din 3 hotspot-uri corecte.
  - Indicii: 1. "Ask of every input: when exactly was this known?" 2. "Count the instruments at the start of the test, not today."
- **Practică:** univers sintetic cu delistări (S16 + S9): testul rulat pe supraviețuitori și pe tot universul; utilizatorul raportează diferența. Ținta de calibrare a generatorului: diferența trebuie să fie cel puțin jumătate din rezultatul pe supraviețuitori.
- **Check:**
  - q1 mcq d1: identifică look-ahead-ul.
  - q2 mcq d2: în ce direcție deformează rezultatele survivorship-ul.
  - q3 mcq d3: fundamentale revizuite folosite ca și cum ar fi fost cunoscute la data respectivă.
- **Dovezi:** Mechanic (R5 BT-06, BT-07 [S79]).
- **Necesită:** S13, S16 (univers cu delistări), S9
- **Termeni noi de glosar:** look-ahead-bias, survivorship-bias, delisting

#### 3.11.4 · In-sample and out-of-sample
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Split data into an in-sample part for development and an untouched out-of-sample part for one final test.
  2. Explain why peeking at the out-of-sample turns it into in-sample.
  3. Judge whether an out-of-sample result is long enough to mean anything.
- **Concepte:** in-sample-out-of-sample (nou)
- **Se sprijină pe:** 3.11.3, 3.10.5 (eroarea standard a Sharpe-ului), 3.10.6
- **Hook:** predict · alegere din 3 · "You tuned a system on 2018–2023 synthetic data. The 2024–2025 hold-out lost money. You tweak one filter and re-run the hold-out: now it wins. How much should you trust that?"
  - `a` "Fully"
  - `b` "More than before"
  - `c` "Very little: the hold-out is now in-sample" ✓
- **Interacțiunea centrală:**
  - `figure` (Line + Zone, 3 pași): linia timpului împărțită 70/30, în ordine cronologică, niciodată aleator; seiful OOS încuiat; o singură deblocare.
  - `worked` cu input, lungimea OOS: un OOS de 1 an cu Sharpe 1.0 are SE = √(1.5 ÷ 1) = 1.22, deci intervalul −1.40 … 3.40. Un singur an de OOS spune aproape nimic; e nevoie de un OOS mai lung sau de mai multe trade-uri.
  - `explain`: hold-out-ul singur nu e de încredere dacă cercetătorul a văzut deja tot eșantionul sau a rulat multe încercări (Bailey et al.). Fiecare deblocare suplimentară e o încercare în jurnal.
  - `predict`: un instrument R1 și controlul R0, ambele optimizate in-sample. Al cui OOS rezistă?
- **Try:** widget `oos-vault` (nou; S13).
  - Start: sistemul din 3.11.2; împărțire 70/30; OOS încuiat.
  - Obiectiv: "Develop on the in-sample years only. When ready, unlock the out-of-sample once and record your verdict before the chart appears."
  - Reușită: verdictul e scris înainte de reveal; nu există o a doua deblocare; verdictul respectă regula aleasă dinainte. Regula se alege din două variante: „pass only if the OOS expectancy CI lower bound is above zero” sau „pass only if the OOS expectancy sits inside the in-sample Monte Carlo 5–95% band”.
  - Indicii: 1. "Write the pass rule first, then look." 2. "One unlock. A second one is logged as a new trial."
- **Practică:** un instrument R1/R2 cu edge real și controlul R0, unul lângă altul; ambele trec prin seif.
- **Check:**
  - q1 mcq d1: ce înseamnă „a trage cu ochiul” la OOS.
  - q2 numeric d2: eroarea standard a Sharpe-ului pentru un OOS de T ani (`vary`).
  - q3 mcq d3: cercetătorul reoptimizează după un OOS eșuat. Ce trebuie să arate jurnalul (o încercare în plus) și ce devine OOS-ul (in-sample).
- **Dovezi:** Mechanic (R5 BT-10 [S91][S93]).
- **Necesită:** S13 (OOS încuiat, deblocări numărate), S7 (R0)
- **Termeni noi de glosar:** in-sample, out-of-sample, hold-out

#### 3.11.5 · Overfitting and the random-walk control
- **Nivel / durată / tip:** Advanced · 8 min · Core
- **Obiective:**
  1. Recognise an overfit backtest: many parameters, few trades, a perfect curve.
  2. Show that the best of N zero-edge configurations has an impressive in-sample Sharpe by chance alone.
  3. Run an R0 random-walk control next to every result you plan to trust.
- **Concepte:** overfitting (nou), data-snooping (nou), random-walk (0.2), multiple-testing (3.10.6)
- **Se sprijină pe:** 3.11.4, 3.10.3, 3.10.6
- **Hook:** predict · alegere din 3 · "This LABX strategy made +48% in four synthetic years: Sharpe 2.1 after costs, 6 tuned parameters, 61 trades. Predict its next two years."
  - `a` "About the same"
  - `b` "About half"
  - `c` "Around zero, or worse" ✓

  Reveal: prețurile erau un random walk R0. În următorii doi ani: ≈ −4% (ținta de calibrare: intervalul de încredere al expectancy OOS include zero).
- **Interacțiunea centrală:**
  - `explain`: overfitting înseamnă un model care țintește observații anume, nu structura generală (Bailey et al.). 6 parametri pe 61 de trade-uri înseamnă ~10 trade-uri pe parametru. Reguli practice: cel mult 3–5 parametri optimizați și multe trade-uri pe parametru (R5 BT-09 [S87]).
  - `worked` cu input: cel mai bun Sharpe in-sample așteptat (pe 1 an) dintre N configurații fără edge: N = 10 → 1.57; N = 20 → 1.90; N = 100 → 2.53. Utilizatorul alege valoarea pentru N = 10.
  - `figure`, sliderul de complexitate (Line, 3 pași): Sharpe-ul IS crește cu fiecare filtru, iar cel OOS scade după 2–3 filtre (bias–variance).
  - `callout`: filtrele adăugate ca să scoată anumite trade-uri pierzătoare înseamnă data snooping pe propriile date. De acum, fiecare raport din S13 include implicit o rulare de control pe R0.
- **Try:** widget `monkey-lab` (nou; S7 + S13).
  - Start: un generator de 100 de strategii aleatoare pe date R0.
  - Obiectiv: "Generate 100 random strategies on R0 data. Note the best in-sample Sharpe, predict its out-of-sample Sharpe, then run it."
  - Reușită: Sharpe-ul IS notat; predicția înregistrată înainte de reveal (o predicție la ±0.5 de 0 contează drept calibrată); eticheta "noise" aleasă.
  - Indicii: 1. "The best of 100 coin-flippers still flipped coins." 2. "On R0, the honest forecast for any rule is zero."
- **Practică:** o rulare de control pe R0 atașată sistemului propriu. Dacă pe R0 apare un „edge”, sistemul are o scurgere de informație (3.11.3).
- **Check:**
  - q1 mcq d1: semnele overfitting-ului.
  - q2 mcq d2: cel mai bun Sharpe așteptat dintre 10 configurații fără edge (≈ 1.6).
  - q3 mcq d3: un filtru care elimină cele mai proaste 3 trade-uri.
- **Dovezi:** Mechanic (R5 BT-08, BT-09 [S89][S91]; R6 §1.7).
- **Necesită:** S7, S13
- **Termeni noi de glosar:** overfitting, data-snooping, degrees-of-freedom, random-walk-control

#### 3.11.6 · Walk-forward analysis
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Run a walk-forward test: optimise on one window, trade the next unseen segment, roll forward.
  2. Compute walk-forward efficiency and read the parameter-stability chart.
  3. Choose between anchored and rolling windows, without tuning the walk-forward itself.
- **Concepte:** walk-forward-analysis (nou)
- **Se sprijină pe:** 3.11.4, 3.11.5
- **Hook:** predict · alegere "Adapting / Fitting noise" · "A system's best moving-average length, re-optimised each year: 12, 48, 19, 63, 25. Is it adapting to the market, or fitting noise?" Răspuns: fitting noise. Parametrii optimi care sar haotic de la o fereastră la alta sunt semnul clasic (Pardo).
- **Interacțiunea centrală:**
  - `figure`, linia timpului (Zone, 4 pași): fereastra IS 1 → OOS 1 → rulare înainte → curba OOS lipită din segmente.
  - `worked` cu input: WFE = randamentul anual OOS ÷ randamentul anual IS = 9% ÷ 20% = 0.45. E sub pragul practic de 0.5, care e o regulă de practician, nu un standard.
  - `match`: fereastră ancorată vs fereastră rulantă ↔ stabilitate vs adaptare.
  - `callout`: meta-overfitting (încerci 5 lungimi de fereastră și raportezi cea mai bună). Pe controlul R0, WFE ≈ 0 și parametrii sar.
- **Try:** widget `walk-forward-viz` (nou; S13).
  - Start: sistemul utilizatorului din 3.11.4; 6 ferestre.
  - Obiectiv: "Run six walk-forward windows on your system. Report the walk-forward efficiency and whether the chosen parameters stay within ±20% of their median."
  - Reușită: WFE ±0.02 și verdictul de stabilitate corect.
  - Indicii: 1. "Only the stitched out-of-sample segments count." 2. "Stable parameters move a little, not across the whole range."
- **Practică:** același test pe controlul R0 și pe un instrument R1; utilizatorul compară graficele de stabilitate.
- **Check:**
  - q1 numeric d2: WFE (`vary`).
  - q2 mcq d2: fereastră ancorată vs rulantă.
  - q3 mcq d3: cineva a încercat 5 lungimi de fereastră și a raportat cel mai bun WFE. Ce e greșit.
- **Dovezi:** Mechanic, ca procedură (R5 BT-11 [S80][S81]). Pragul WFE ≥ 0.5 e o regulă de practician, nu un standard.
- **Necesită:** S13 (walk-forward)
- **Termeni noi de glosar:** walk-forward-analysis, walk-forward-efficiency, anchored-window, rolling-window

#### 3.11.7 · Monte Carlo: one backtest, many futures
- **Nivel / durată / tip:** Advanced · 8 min · Core
- **Obiective:**
  1. Reshuffle and bootstrap a trade list to turn one equity curve into a distribution.
  2. Set drawdown expectations from the 95th percentile, not from the single backtest.
  3. Draw an expectation corridor that tells normal variance from a broken system.
- **Concepte:** monte-carlo-resampling (nou), expectation-corridor (nou), drawdown ✓
- **Se sprijină pe:** 3.11.4, 3.10.1, 2.11 (trepte de drawdown)
- **Hook:** predict · slider 5–25R, pas 0.5 · "The reference system (40% winners at +2.5R, 60% losers at −1R) showed a worst drawdown of 7R in its one backtest. Reshuffle the same 100 trades 10,000 times. What's the 95th-percentile worst drawdown?" Răspuns: 13.5R.
- **Interacțiunea centrală:**
  - `explain`: reamestecarea (aceleași trade-uri, altă ordine: același profit, alt drawdown) vs bootstrap-ul (extrageri cu revenire: variază și profitul, și drawdown-ul).
  - `figure`, fan chart (Line + Zone, 4 pași): 1,000 de drumuri cu percentilele 5/50/95; histograma drawdown-ului maxim: mediana 8.5R, percentila 90: 12.5R, 95: 13.5R, 99: 17R.
  - `worked` cu input: la 1% risc pe trade, planul trebuie să accepte un drawdown de 13–15%, nu de 7%.
  - `explain`, coridorul: după 50 de trade-uri înainte, media R a sistemului de referință stă, în 90% din cazuri, între −0.02R și +0.82R. Pe 20 de trade-uri, probabilitatea unei pierderi nete e 12.6% (R5 ST-14).
  - `callout`, limitele: Monte Carlo nu poate crea un edge pe care trade-urile nu îl au și moștenește presupunerile de execuție. Reamestecarea distruge autocorelația; soluția e block bootstrap (3.10.7).
- **Try:** widget `mc-fan` (nou; S13).
  - Start: trade-urile OOS ale utilizatorului.
  - Obiectiv: "Run 1,000 bootstrap paths on your out-of-sample trades. Set your drawdown tier at the 95th percentile and your kill switch at the 99th."
  - Reușită: valorile introduse = percentilele din simulator (±0.5R); ambele scrise în plan.
  - Indicii: 1. "Read the percentile off the drawdown histogram, not the equity fan." 2. "The kill switch must sit beyond normal bad luck."
- **Practică:** în plan builder, tabelul de trepte de drawdown (din 2.11) se recalculează din Monte Carlo; coridorul se desenează peste equity-ul din incubare (3.11.10).
- **Check:**
  - q1 mcq d1: reamestecare vs bootstrap.
  - q2 numeric d2: citirea unei percentile de pe un fan chart.
  - q3 mcq d3: drawdown-ul live e 11R, iar percentila 95 e 13.5R. Ești în coridor; continui să execuți.
- **Dovezi:** Mechanic (R5 BT-13 [S82]–[S84], PL-02, ST-14, ST-15).
- **Necesită:** S13 (Monte Carlo), S15
- **Termeni noi de glosar:** monte-carlo, reshuffle, fan-chart, expectation-corridor, percentile

#### 3.11.8 · Robustness: plateaus, not peaks
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Map performance across parameter values and pick a value on a broad plateau.
  2. Run a stress battery: double costs, drop the best trades, add noise, shift start dates, try other markets.
  3. Decide whether a system degrades gracefully or collapses.
- **Concepte:** robustness-testing (nou), parameter-plateau (nou)
- **Se sprijină pe:** 3.11.5, 3.11.6, 2.11 (profit factor)
- **Hook:** hotspot pe un heat map de parametri · "Pick the parameter pair you would trade." Răspuns: centrul unei zone calde largi, nu cea mai strălucitoare celulă izolată.
- **Interacțiunea centrală:**
  - `explain`: platourile (Pardo). Kaufman recomandă pași procentuali, nu absoluți: 10, 11, 12.1, 13.3, 14.6 (pași de 10%), nu 10, 11, 12, 13.
  - `worked` cu input, regula de vecinătate (regulă de design: media vecinilor ≥ 80% din celula aleasă). Celula aleasă are Sharpe 1.10, vecinii 0.95 în medie: 86%, trece. Vârful izolat are 1.60, vecinii 0.40: 25%, pică.
  - `order`, bateria de stres: costuri dublate → fără cele mai bune 5% din trade-uri → zgomot adăugat în prețuri → alte date de start → altă piață sau alt timeframe.
  - `callout`: profit factor-ul fără cele mai bune 5% din trade-uri arată dependența de excepții. La trend following e normală; trebuie să-ți știi tipul de sistem (R5 PM-14). Heat map-ul de control pe R0 are celule calde aleatoare.
- **Try:** widget `stress-battery` (nou; S13).
  - Start: heat map-ul cu doi parametri al sistemului utilizatorului.
  - Obiectiv: "Choose parameters on a plateau, then run the five-test stress battery. The system passes if it stays positive in at least four."
  - Reușită: media vecinătății ≥ 80% din valoarea celulei alese; bateria rulată; verdictul consistent cu regula.
  - Indicii: 1. "Look at the neighbours before the cell." 2. "A robust edge gets weaker under stress; a fitted one disappears."
- **Practică:** aceeași baterie pe controlul R0 (eșec așteptat) și pe un sistem R1.
- **Check:**
  - q1 mcq d1: platou vs vârf.
  - q2 numeric d2: următoarea valoare în pași de 10% (13.3 → 14.6; `vary`).
  - q3 mcq d3: profit factor 2.4 scade la 1.1 fără cele mai bune 5% din trade-uri. Interpretarea pentru un trend follower vs un mean reverter.
- **Dovezi:** Mechanic, ca procedură (R5 BT-14, BT-15 [S86]–[S88], PM-05, PM-14).
- **Necesită:** S13 (hartă de parametri, baterie de stres)
- **Termeni noi de glosar:** robustness, parameter-plateau, stress-test, outlier-dependence

#### 3.11.9 · Random benchmarks and the edge ratio
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Compare a strategy with 1,000 random-entry twins that use the same exits and holding time.
  2. Compute an edge ratio to test whether the entry beats random.
  3. Separate entry edge, exit effect and market drift, using the benchmark ghost.
- **Concepte:** random-entry-benchmark (nou), edge-ratio (nou)
- **Se sprijină pe:** 2.7 (MAE/MFE), 3.11.5
- **Hook:** predict · alegere "A lot / A little / Nothing measurable" · "Your breakout system made +22% on LABX. 1,000 random-entry twins with the same exits made between +5% and +30%; the median twin made +18%. How much does your entry add?" Răspuns: puțin. Ieșirile și drift-ul pieței fac cea mai mare parte.
- **Interacțiunea centrală:**
  - `explain`: gemenii aleatori păstrează ieșirile și durata de deținere, dar intră la întâmplare. Percentila strategiei între ei spune cât valorează intrarea.
  - `worked` cu input: e-ratio = MFE mediu ÷ MAE mediu după N bare, normalizate cu ATR. 1.6 ÷ 1.0 = 1.6; intrările aleatoare dau ≈ 1.0.
  - `figure` (Line, 3 pași): curba e-ratio în funcție de durata de deținere, pentru sistem și pentru intrările aleatoare.
  - `match`: 3 rezultate ↔ sursa edge-ului (intrare, ieșire, drift). Benchmark ghost-ul (buy-and-hold) e mereu pe grafic.
- **Try:** widget `random-twins` (nou; S13).
  - Start: sistemul utilizatorului.
  - Obiectiv: "Find your system's percentile among 1,000 random-entry twins and its edge ratio at 10 bars. Then label the edge: entry, exit or drift."
  - Reușită: percentila ±1, e-ratio ±0.05, eticheta consistentă cu regula de design (edge de intrare = percentila ≥ 95 și e-ratio ≥ 1.2).
  - Indicii: 1. "If random entries also profit, the market's drift is doing the work." 2. "Edge at entry: percentile 95 or more and an edge ratio of at least 1.2."
- **Practică:** R1 (cu drift) vs R0: în R1 și gemenii aleatori câștigă, deci drift-ul nu e edge.
- **Check:**
  - q1 numeric d2: e-ratio (`vary`).
  - q2 mcq d1: ce păstrează constant gemenii aleatori.
  - q3 mcq d3: un sistem profitabil, la percentila 60 între gemeni. Verdictul.
- **Dovezi:** Mechanic (R5 BT-16, TM-18 [BK: Faith]).
- **Necesită:** S13, S15 (MAE/MFE)
- **Termeni noi de glosar:** random-entry-benchmark, edge-ratio

#### 3.11.10 · Incubation, kill switches and the research log
- **Nivel / durată / tip:** Advanced · 8 min · Core
- **Obiective:**
  1. Write go-live gates and kill criteria before a system trades, using its Monte Carlo bands.
  2. Run a premortem: list the reasons the system will have failed six months from now.
  3. Change a rule only through the documented process: hypothesis, evidence threshold, test, versioned plan.
- **Concepte:** incubation (nou), kill-switch (nou), premortem (nou), rule-change-governance (nou), research-log (3.11.1)
- **Se sprijină pe:** 3.11.7, 2.13 (KPI-uri, recenzii), 1.6 (greșeală vs varianță)
- **Hook:** predict · alegere din 4 · "Your validated system goes live on a small simulated account and loses 6 of its first 10 trades. What do you do?"
  - `a` "Stop it"
  - `b` "Double the size to recover"
  - `c` "Change the stop"
  - `d` "Check it against the corridor and keep executing" ✓
- **Interacțiunea centrală:**
  - `order`, pipeline-ul: test înainte în simulator → cont mic → trepte de mărime → mărimea completă.
  - `worked`, poarta de go-live, cu input pentru sistemul propriu:
    - după 50 de trade-uri înainte, expectancy în banda Monte Carlo 5–95% (pentru sistemul de referință: −0.02R … +0.82R) și KPI-urile de proces la țintă → mărimea × 2;
    - kill switch: drawdown dincolo de percentila 99 din Monte Carlo (pentru referință: 17R) sau un interval de încredere al expectancy aflat în întregime sub zero.
  - `explain`, premortem-ul (Klein 2007): imaginează-ți că sistemul a eșuat și scrie de ce. Fiecare motiv devine o verificare.
  - `order`, guvernarea regulilor: ipoteză → pragul de dovezi (≥ 30–50 de trade-uri sau un walk-forward) → test în simulator → plan nou, cu versiune, și comparație înainte/după cu interval de încredere (R5 PL-14).
  - `callout`: scăderea reală a unui edge vs varianța (3.13.7). Jurnalul de cercetare nu se poate modifica și arată "trials to date: N". Practica deliberată (o singură abilitate, 20–50 de repetări; R5 PSY-32) se introduce aici, ca pregătire pentru faza de drawdown din Capstone 3.
- **Try:** widget `go-live-gate` (nou; S13 + plan builder).
  - Start: cardul de go-live gol, legat de rezultatele Monte Carlo ale sistemului.
  - Obiectiv: "Fill in the go-live card for your system: gates, kill switch, size steps and a five-reason premortem."
  - Reușită: toate câmpurile completate; pragul de kill ≥ drawdown-ul de la percentila 99 (un prag sub percentila 95 e respins: ar opri sistemul la varianță normală); cel puțin 5 motive distincte în premortem, fiecare legat de o verificare sau o regulă.
  - Indicii: 1. "Kill on breakage, not on bad luck." 2. "Every premortem reason needs a check you can run."
- **Practică:** contul de incubare (cont virtual separat, cu reguli mai stricte și regimuri ascunse): 50 de trade-uri înainte, în săptămânile următoare. Rezultatul intră în Capstone 3.
- **Check:**
  - q1 mcq d1: ce declanșează kill switch-ul.
  - q2 order d2: ordinea pașilor de guvernare a regulilor.
  - q3 mcq d3: "Three losses, so I'll widen the stop." Ce spune guvernarea regulilor.
- **Dovezi:** Mechanic, ca proces (R5 BT-21, BT-22 [S117][S118], BT-25 [S91], PL-14, PSY-36 [S70], PSY-32 [S66]–[S69]).
- **Necesită:** S13, S15, S14 (detector de reguli schimbate), plan builder cu istoric de versiuni
- **Termeni noi de glosar:** incubation, kill-switch, premortem, go-live-gate

---
## 3.12 · Position sizing theory

**Fișa unității**
- **Scop:** răspunde la întrebarea „cât?” cu matematică: creșterea geometrică și volatility drag; modelele de sizing aplicate pe aceeași listă de trade-uri; Kelly ca plafon; fractional Kelly și optimal f; risk of ruin definit ca drawdown; volatility targeting; equity-curve trading. Concluzia unității: sizing-ul schimbă drumul și șansele de supraviețuire, dar nu creează edge.
- **De ce aici:** vine după 3.10 (distribuții, autocorelație) și 3.11 (Monte Carlo, edge validat în R). Spirala riscului (README §4): Nivelul 1 a dat regula de 1% și sizing-ul din stop, Nivelul 2 ATR, portfolio heat și corelația, Nivelul 3 adaugă teoria. Cursurile de retail aproape niciodată nu predau risk of ruin sau supra-pariul Kelly (R1 §4 punctul 2).
- **Cere de dinainte:** 1.4 (fixed fractional, drawdown și recuperare), 1.8 (martingale, laboratorul de ruinare), 2.4 (ATR), 2.11 (portfolio heat, trepte de drawdown), 3.10.1, 3.10.7, 3.11.7.
- **Checkpoint:** `test-3.12`, 12 întrebări:
  - 6 numerice cu `vary`: drag-ul pe două perioade, fixed ratio, fracția Kelly, HPR/TWR, risk of ruin, unitățile dintr-o țintă de volatilitate;
  - 4 mcq;
  - 2 cazuri d3 de tipul „alege mărimea pentru acest sistem”.

  La ≥ 80%, lecțiile se marchează „Tested out”.
- **Laboratorul unității: „Same trades, different sizing”** (S13, tab-ul de sizing). Pe lista OOS a sistemului validat în 3.11, utilizatorul compară: 1% fix, ¼ Kelly, ½ Kelly, full Kelly, fixed ratio, volatility targeting și filtrul pe equity curve. Pentru fiecare vede drawdown-ul median și cel de la percentila 95, risk of ruin (pragul: drawdown de 30%) și creșterea mediană. Alege regula pentru plan și o justifică în termeni de drawdown acceptat. Scor: alegerea respectă plafonul (¼ Kelly din estimarea OOS și risk of ruin < 1%), iar justificarea folosește percentilele, nu media.
- **Fire din spirală:**
  - Risc: centrul unității.
  - Statistică: mediana vs media, Monte Carlo.
  - Psihologie: house money și break-even effect când mărimea crește; „trading scared” când scade.
  - Proces: regula de sizing se scrie în plan, separat de semnal.
- **Surse:** R5 RF-08…RF-14, RF-16, PR-09, PR-10, PR-14, PM-11, ST-13; R6 §2.14, §2.15, §3.1.9, §4.5; R1 §2.14, §4 punctul 2.

#### 3.12.1 · Geometric growth and volatility drag
- **Nivel / durată / tip:** Advanced · 6 min · Core
- **Obiective:**
  1. Compute the compound result of a sequence of gains and losses, and its geometric mean.
  2. Estimate volatility drag with g ≈ μ − σ²/2.
  3. Explain why the median trader's path can sit far below the average path.
- **Concepte:** volatility-drag (nou), time-vs-ensemble-average (nou)
- **Se sprijină pe:** 1.4 (drawdown și recuperare), 3.10.1
- **Hook:** predict · slider 5,000–15,000, pas 100 · "+50%, then −50%. Where does an account of 10,000 vUSD end?" Răspuns: 7,500.
- **Interacțiunea centrală:**
  - `worked` cu input: 1.5 × 0.5 = 0.75; media geometrică pe perioadă = √0.75 − 1 = −13.4%.
  - `explain`: g ≈ μ − σ²/2. Cu μ = 10% și σ = 30%: g ≈ 5.5%.
  - `worked`, ETF-ul cu levier: indicele face +10%, apoi −9.09%, și ajunge înapoi de unde a pornit. ETF-ul 2× face +20%, apoi −18.18%, și termină la 0.982 (−1.8%).
  - `figure` (Line + Zone, 3 pași): fan chart-ul sistemului de referință pe 100 de trade-uri. Media și mediana se despart pe măsură ce crește riscul pe trade: la 4%, mediana 3.91× și percentila 5: 1.32×; la 16% (full Kelly), mediana 20× și percentila 5: 0.34×; la 32% (2× Kelly), mediana 1.45×, iar 46% din drumuri termină sub capitalul de start (R5 RF-10, ST-13).
  - `callout`, media în timp vs media pe ansamblu: tu trăiești un singur drum, nu media tuturor traderilor.
- **Try:** widget `drag-sliders` (nou).
  - Start: două slidere, „up x%” și „down x%”, legate.
  - Obiectiv: "Find the smallest symmetric swing, up x% then down x%, that costs 10% over two periods."
  - Reușită: x = 31.6% (±0.5 pp), pentru că (1 + x)(1 − x) = 1 − x² = 0.9.
  - Indicii: 1. "Multiply, don't add." 2. "(1 + x)(1 − x) = 1 − x²."
- **Practică:** regimuri R3: deținerea 1× vs un ETF sintetic 3× cu reset zilnic, pe 6 luni simulate (drill-ul din R6 §3.1.9).
- **Check:**
  - q1 numeric d1: rezultatul compus pe două perioade (`vary`).
  - q2 numeric d2: g ≈ μ − σ²/2 (`vary`).
  - q3 mcq d3: "The average of 1,000 simulated traders made +20%, yet most of them lost money." Cum e posibil: câțiva câștigători mari trag media în sus; mediana spune ce i se întâmplă traderului tipic.
- **Dovezi:** Mechanic (R5 PM-11, ST-13; R6 §3.1.9).
- **Necesită:** S7; widget nou `drag-sliders`
- **Termeni noi de glosar:** geometric-mean, cagr, volatility-drag, leveraged-etf

#### 3.12.2 · Same trades, different sizing
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Replay one trade list under fixed units, fixed fractional and fixed ratio sizing.
  2. Compute contract counts under fixed ratio for a given delta.
  3. Explain why sizing changes the path and the drawdown but cannot create an edge.
- **Concepte:** fixed-fractional-sizing ✓, fixed-ratio-sizing (nou), position-sizing ✓
- **Se sprijină pe:** 1.4 (sizing din stop), 1.8 (martingale), 3.12.1
- **Hook:** predict · slider 1×–5×, pas 0.5 · "You always trade 1 lot. Trade A has a 20-pip stop, trade B a 60-pip stop, and each pip is worth 10 vUSD per lot. How many times bigger is your risk on trade B?" Răspuns: 3× (200 vs 600 vUSD).
- **Interacțiunea centrală:**
  - `explain`: mărimea fixă ascunde cât de mult variază riscul. Fixed fractional e anti-martingale: mărimea scade după pierderi și crește după câștiguri.
  - `worked` cu input: câte pierderi la rând duc contul la −50%: ln(0.5) ÷ ln(1 − r). La 1%: 69; la 2%: 34; la 5%: 13.5; la 10%: 6.6. Utilizatorul calculează valoarea pentru 2%.
  - `worked`, fixed ratio (Ryan Jones): profitul necesar pentru N contracte = Δ × N(N − 1) ÷ 2, deci contracte = ½ × (1 + √(1 + 8P ÷ Δ)). Cu Δ = 3,000: 2 contracte la 3,000 profit, 3 la 9,000, 4 la 18,000. La P = 10,000, formula dă 3.13, deci 3 contracte.
  - `figure` (Line, 3 pași): scara contractelor în funcție de profitul cumulat, pentru trei valori ale lui Δ.
  - `callout`: nu există o formulă pentru cel mai bun Δ; în practică se leagă de drawdown-ul maxim pe contract. Sizing-ul nu poate crea un edge: nici schemele anti-martingale nu câștigă într-un joc corect (R6 §2.15).
- **Try:** widget `sizing-replay` (nou; tab-ul de sizing din S13).
  - Start: lista de trade-uri a sistemului utilizatorului.
  - Obiectiv: "Replay your system's trades under fixed units, 1% fixed fractional and fixed ratio. Find the fixed-ratio delta that keeps maximum drawdown under 15%."
  - Reușită: un Δ pentru care simulatorul raportează un drawdown maxim ≤ 15%.
  - Indicii: 1. "A larger delta adds contracts more slowly." 2. "Check the drawdown, not the final equity."
- **Practică:** aceeași reluare pe o listă de trade-uri R0: după costuri, toate regulile de sizing pierd. Sizing-ul nu e edge.
- **Check:**
  - q1 numeric d2: contracte în fixed ratio (Δ 5,000, P 12,000 → 2.75, deci 2; `vary`).
  - q2 numeric d2: câte pierderi la rând până la −50%, pentru un r dat (`vary`).
  - q3 mcq d3: "A sizing rule turned my breakeven system profitable." De ce nu e posibil: se schimbă doar drumul; verifică iluzia dată de compunere și norocul ordinii.
- **Dovezi:** Mechanic (R5 RF-08–RF-11 [S12][S13][S106]). Afirmația că fixed ratio ar fi „optim”: D (nu există o formulă pentru Δ; R5 RF-11).
- **Necesită:** S13 (tab de sizing separat de semnal)
- **Termeni noi de glosar:** fixed-ratio-sizing, anti-martingale

#### 3.12.3 · The Kelly criterion
- **Nivel / durată / tip:** Advanced · 8 min · Core
- **Obiective:**
  1. Compute the Kelly fraction from the win rate and the payoff ratio.
  2. Read the growth curve g(f) and place full, half and double Kelly on it.
  3. Explain why betting above Kelly lowers growth even with a positive edge.
- **Concepte:** kelly-criterion (nou)
- **Se sprijină pe:** 3.12.1, 1.4 (expectancy), 0.2 (valoarea așteptată)
- **Hook:** predict · slider 0–60%, pas 1 · "You win 55% of trades; winners pay 1.5R and losers cost 1R. What fraction of equity should you risk per trade to grow fastest in the long run?" Răspuns: 25%.
- **Interacțiunea centrală:**
  - `worked` cu input: f* = W − (1 − W) ÷ b = 0.55 − 0.45 ÷ 1.5 = 0.25.
  - `figure`, curba g(f) (Line + Marker, 4 pași), cu g(f) = W · ln(1 + f·b) + (1 − W) · ln(1 − f):
    1. ½ Kelly (0.125): g = 0.0344, adică 75% din maxim;
    2. full Kelly (0.25): g = 0.0457, maximul;
    3. 2× Kelly (0.50): g = −0.0041, creștere negativă cu un edge pozitiv;
    4. creșterea trece prin zero aproape de 2× Kelly (0.49).
  - `explain`: f e fracția din cont pierdută când stop-ul e atins, nu valoarea poziției. La sistemul de referință: f* = 0.40 − 0.60 ÷ 2.5 = 16% risc pe trade. Asta înseamnă un drawdown maxim median de 83% și percentila 5 a capitalului final de 0.34× după 100 de trade-uri (R5 RF-10). Forma continuă: f* ≈ μ ÷ σ²; 8% ÷ 0.04 = levier 2×.
  - `callout`: Kelly e un plafon, nu o țintă. Presupune un edge cunoscut, rezultate independente și câștiguri fixe.
- **Try:** widget `kelly-curve` (nou).
  - Start: W și b libere.
  - Obiectiv: "Set the win rate and payoff to the reference system. Find full Kelly, then the fraction where long-run growth falls back to zero."
  - Reușită: f* = 16% (±0.5 pp) și creșterea zero la ≈ 33% (±1 pp), adică aproape de 2× Kelly.
  - Indicii: 1. "Reference system: 40% winners at 2.5R." 2. "Follow the curve to the right until it crosses zero."
- **Practică:** `kelly-curve` cu 1,000 de drumuri simulate la ¼, ½, 1 și 2× Kelly: mediana, percentila 5 și drawdown-ul maxim pentru fiecare (S7).
- **Check:**
  - q1 numeric d1: fracția Kelly (W 0.6, b 1 → 0.20; `vary`).
  - q2 mcq d2: ce se întâmplă la 2× Kelly.
  - q3 mcq d3: "Kelly says 16%, so I'll risk 16% per trade." Ce e greșit: edge-ul e doar estimat, drawdown-ul median e 83%, ipotezele nu se țin.
- **Dovezi:** Mechanic (Kelly 1956; Thorp; R5 RF-13 [S8]–[S11][S14]). Un risc peste ~2× Kelly: F (creștere negativă prin construcție).
- **Necesită:** widget nou `kelly-curve`; S7 pentru drumurile simulate
- **Termeni noi de glosar:** kelly-criterion, growth-rate, full-kelly

#### 3.12.4 · Fractional Kelly and optimal f
- **Nivel / durată / tip:** Advanced · 8 min · Core
- **Obiective:**
  1. Show how an overestimated edge turns full Kelly into over-betting.
  2. Compute optimal f on a trade list and the account size per contract it implies.
  3. Choose a fraction of Kelly or of optimal f and justify it with drawdown, not with growth.
- **Concepte:** fractional-kelly (nou), optimal-f (nou), kelly-criterion (3.12.3)
- **Se sprijină pe:** 3.12.3, 3.10.3 (regresia la medie), 3.11.5
- **Hook:** predict · alegere din 3 · "You estimated a 55% win rate, so Kelly said 25%. The true win rate is 45%. Risking 25% per trade, your long-run growth is…"
  - `a` "Smaller, but positive"
  - `b` "About zero"
  - `c` "Negative" ✓
- **Interacțiunea centrală:**
  - `worked` cu input: W estimat 0.55, b = 1.5, f = 0.25.
    - Dacă W real e 0.50: f* = 16.7%; g(0.25) = 0.0154; g(0.125) = 0.0192, deci jumătatea de Kelly crește mai repede.
    - Dacă W real e 0.45: g(0.25) = −0.0149 (pierde); g(0.125) = +0.0039.
  - `explain`: ½ Kelly păstrează ~75% din creștere cu un drawdown mult mai mic; ¼ Kelly e o alegere frecventă. Edge-ul măsurat in-sample e mai mare decât cel real (3.10.3, 3.11.5).
  - `worked`, optimal f (Vince): HPR = 1 + f × trade ÷ |cea mai mare pierdere|; TWR = produsul HPR-urilor. Pe lista +300, −100, +200, −100, −100, +150, −100, +250, −100, +100 (vUSD pe contract): f_opt ≈ 0.239, cu TWR 1.74. La f = 0.4, TWR = 1.38; la f = 0.6, TWR = 0.48. Rezultă 1 contract la fiecare 418 vUSD din cont.
  - `figure` (Line, 3 pași): cocoașa curbei TWR(f).
  - `callout`: următoarea pierdere maximă poate fi mai mare. O pierdere de 150 (1.5× cea mai mare) la f_opt costă 35.9% din cont într-un singur trade.
- **Try:** widget `twr-curve` (nou).
  - Start: lista de 10 trade-uri de mai sus.
  - Obiectiv: "Load the 10-trade list and find optimal f. Then assume a future loss 1.5 times the worst, and choose a fraction that keeps that single loss under 10% of equity."
  - Reușită: f_opt = 0.239 (±0.005) și o fracție aleasă ≤ 0.0667.
  - Indicii: 1. "Optimal f is the peak of the TWR curve." 2. "A loss 1.5 × the worst costs 1.5 × f of equity."
- **Practică:** pe sistemul validat al utilizatorului (3.11): Kelly calculat din estimările OOS, ¼ Kelly ca plafon, comparat cu regula de 1%. Rezultatul se scrie în plan.
- **Check:**
  - q1 numeric d2: HPR pentru un trade (`vary`).
  - q2 mcq d2: de ce se folosește fractional Kelly.
  - q3 mcq d3: optimal f calculat din 40 de trade-uri. Care e pericolul.
- **Dovezi:** Mechanic, ca calcul (R5 RF-13, RF-14 [S6][S7]). Optimal f ca regulă de sizing pentru viitor: C (depinde de cea mai mare pierdere din trecut; R5 îl pune la nivelul Expert).
- **Necesită:** widget nou `twr-curve`; S13
- **Termeni noi de glosar:** fractional-kelly, optimal-f, hpr, twr

#### 3.12.5 · Risk of ruin, defined honestly
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Compute risk of ruin with the even-payoff formula and know when it stops applying.
  2. Define ruin as the drawdown at which you would stop trading, not as zero.
  3. Estimate risk of ruin by Monte Carlo for your own system and size so it stays under 1%.
- **Concepte:** risk-of-ruin (nou)
- **Se sprijină pe:** 3.11.7, 3.12.3, 1.8 (laboratorul de ruinare)
- **Hook:** predict · slider 0–100%, pas 1 · "Reference system, 4% risk per trade, 100 trades. What's the chance of hitting a 30% drawdown at least once?" Răspuns: ≈ 52%.
- **Interacțiunea centrală:**
  - `worked` cu input, formula pentru câștiguri egale cu pierderile, cu miză fixă și N unități de capital: RoR = ((1 − W) ÷ W)^N. Cu W = 60% și N = 10: 1.7%; cu N = 100: 2.5 × 10⁻¹⁸. Cu W = 55% și N = 20: 1.8%.
  - `explain`: cu fixed fractional, contul nu ajunge teoretic niciodată la zero, așa că „ruina” trebuie definită ca drawdown-ul la care te-ai opri (25%, 30%, 50%). Cine renunță la 25% are un risk of ruin mai mare decât cine tolerează 50%.
  - `figure` (Bars, 3 pași), Monte Carlo pe sistemul de referință: probabilitatea unui drawdown ≥ 30% în 100 de trade-uri. La 1% risc: ≈ 0.01%; la 2%: ≈ 3%; la 4%: ≈ 52%; la 8%: ≈ 99%.
  - `callout`, ipotezele formulei: independență (3.10.7), câștiguri fixe, W măsurat in-sample. Pentru sisteme reale: Monte Carlo pe trade-urile OOS.
- **Try:** widget `ror-lab` (nou; S7).
  - Start: sistemul de referință; slider pentru riscul pe trade; prag de ruină 30%; 100 de trade-uri.
  - Obiectiv: "Find the largest risk per trade that keeps the chance of a 30% drawdown within 100 trades under 1%, for the reference system."
  - Reușită: r ≈ 1.6% (se acceptă valoarea din simulator ±0.1 pp; Monte Carlo dă ≈ 0.3% la 1.5% și ≈ 1.3% la 1.75%).
  - Indicii: 1. "Between 1% and 2%, the chance climbs fast." 2. "Move in steps of 0.1%."
- **Practică:** sistemul validat al utilizatorului în `ror-lab`, cu trade-urile OOS prin bootstrap. Rezultatul se scrie în plan ca plafon al riscului pe trade.
- **Check:**
  - q1 numeric d2: formula RoR (W 0.55, N 20 → 1.8%; `vary`).
  - q2 mcq d2: de ce ruina se definește ca prag de drawdown.
  - q3 mcq d3: RoR calculat cu W = 60% in-sample, când W out-of-sample e 52%.
- **Dovezi:** Mechanic (R5 PR-09 [S14]–[S16]). Valorile Monte Carlo au fost calculate pentru acest fișier.
- **Necesită:** widget nou `ror-lab` (Monte Carlo, S7)
- **Termeni noi de glosar:** risk-of-ruin, ruin-threshold

#### 3.12.6 · Volatility targeting
- **Nivel / durată / tip:** Advanced · 7 min · Core
- **Obiective:**
  1. Size a position so its expected daily swing matches a volatility budget.
  2. Rescale exposure when the volatility forecast changes.
  3. Explain the lag problem when volatility jumps faster than the forecast.
- **Concepte:** volatility-targeting (nou), volatility-clustering (3.10.2)
- **Se sprijină pe:** 2.4 (ATR, mărimea adaptată la volatilitate), 3.10.2
- **Hook:** predict · slider 0–200, pas 1 · "Your account is 10,000 vUSD and your volatility budget is 0.63% a day, about 10% a year. LABX moves about 1.50 vUSD a day, one standard deviation. How many units fit the budget?" Răspuns: 42.
- **Interacțiunea centrală:**
  - `worked` cu input: 10% pe an ÷ √252 ≈ 0.63% pe zi; bugetul zilnic = 0.63% × 10,000 = 63.00 vUSD; 63.00 ÷ 1.50 = 42 de unități (≈ 4,200 vUSD expunere la prețul 100). Cu bugetul nerotunjit (62.99 vUSD), rezultatul e 41.99, adică 41 de unități după rotunjirea în jos; de aceea bugetul se fixează în plan în vUSD, nu se recalculează la fiecare trade.
  - `predict`: volatilitatea se dublează la 3.00. Câte unități? 21.
  - `explain`: scala = σ_țintă ÷ σ_prognozat; 10% ÷ 16% = 0.625. Legătura cu sizing-ul pe ATR (2.4) și cu N-ul Turtle (3.13.1). Volatility targeting fixează mărimea oscilațiilor normale; stop-ul fixează pierderea când greșești. Cele două se completează.
  - `figure` (Line, 3 pași), întârzierea: prognoza pe 20 de zile după un salt (R3, R12). Expunerea rămâne mare câteva zile, iar pierderea realizată depășește bugetul. În calm prelungit, apare leverage creep.
  - `callout`: volatility targeting la nivel de portofoliu (expunere brută și netă, mai multe active) vine la 4.4.
- **Try:** widget `vol-target-knob` (nou; S9).
  - Start: LABX, cont 10,000, țintă 10%, 60 de zile cu o schimbare de regim și un salt.
  - Obiectiv: "Keep your LABX position at a 10% annual volatility target for 60 days, rebalancing weekly as the forecast changes."
  - Reușită: volatilitatea realizată a poziției între 8% și 12% în afara ferestrei saltului (marcată); rebalansarea făcută în fiecare săptămână.
  - Indicii: 1. "Units = daily budget ÷ forecast daily move." 2. "After a jump, the forecast is still catching up."
- **Practică:** R3 cu comutare între regimuri și un salt R12: unități fixe vs volatility targeting. Se compară abaterea standard a P&L-ului zilnic și pierderea maximă din salt.
- **Check:**
  - q1 numeric d2: unitățile dintr-o țintă de volatilitate (`vary`).
  - q2 mcq d2: ce se întâmplă într-un salt de volatilitate, înainte ca prognoza să-l prindă.
  - q3 mcq d3: volatility targeting după o perioadă lungă de calm (leverage creep). Ce limită adaugi: un plafon de levier.
- **Dovezi:** B (Moreira & Muir 2017 o susțin; criticile out-of-sample ulterioare o găsesc mai slabă; R6 §2.14 [PK]; R5 PR-14).
- **Necesită:** S2 (volatilitate realizată), S9, R3, S20 (saltul de criză)
- **Termeni noi de glosar:** volatility-target, volatility-forecast, leverage-creep

#### 3.12.7 · Equity-curve trading
- **Nivel / durată / tip:** Advanced · 6 min · Core
- **Obiective:**
  1. Apply an equity-curve filter and keep tracking shadow trades while paused.
  2. Measure what the filter saved and what it missed.
  3. Predict when a filter helps (clustered outcomes) and when it hurts (trend following, independent trades).
- **Concepte:** equity-curve-filter (nou), autocorrelation (3.10.7)
- **Se sprijină pe:** 3.10.7, 2.11 (trepte de drawdown), 3.11.10
- **Hook:** predict · alegere "More / Less / The same" · "A trend-following system pauses whenever its equity is below its 20-trade average. Over 10 synthetic years, does it end with more or less than the unfiltered system?" Răspuns: mai puțin. Cele mai mari câștiguri ale lui vin adesea imediat după serii de pierderi.
- **Interacțiunea centrală:**
  - `explain`, regula: tranzacționezi live doar când equity > media ei pe ultimele 20 de trade-uri. Cât timp ești în pauză, trade-urile continuă „în umbră”, ca să știi când reiei.
  - `figure` (Line, 4 pași): equity, media pe 20 de trade-uri, zonele de pauză, banda de shadow trades, cu un câștig mare ratat.
  - `match`: 3 liste de trade-uri ↔ efectul filtrului. Rezultate grupate → ajută. Trend following → strică. Rezultate independente → nu câștigi nimic, doar întârziere.
  - `callout`: optimizarea lungimii mediei e overfitting (3.11.5). Filtrul nu e același lucru cu treptele de drawdown (2.11) sau cu kill switch-ul (3.11.10).
- **Try:** widget `equity-filter` (nou; S13).
  - Start: două liste de trade-uri, una cu rezultate grupate și una independentă.
  - Obiectiv: "Turn the filter on for two trade lists, one clustered and one independent. Report total R and maximum drawdown for each, with and without the filter."
  - Reușită: valorile citite corect și verdictul "helps the clustered list, not the independent one", consistent cu rezultatele.
  - Indicii: 1. "The filter only helps if losses come in bunches." 2. "Count the big winners it skipped."
- **Practică:** pe sistemul propriu, runs test-ul din 3.10.7 decide dacă filtrul e măcar un candidat. Dacă |z| < 1.96, filtrul se respinge în plan.
- **Check:**
  - q1 mcq d1: de ce shadow trades trebuie să continue.
  - q2 mcq d2: când ajută filtrul.
  - q3 mcq d3: cineva testează lungimi ale mediei între 5 și 50 și o alege pe cea mai bună.
- **Dovezi:** C (R5 PR-10 [S74][S75]).
- **Necesită:** S13, S15
- **Termeni noi de glosar:** equity-curve-filter, shadow-trades

---
## 3.13 · Systematic strategies and evidence

**Fișa unității**
- **Scop:** familiile de strategii sistematice cu dovezi academice: time-series momentum și sistemul Turtle, cross-sectional momentum și crash-urile lui, carry, strategiile sezoniere, pairs și stat arb, strategiile pe evenimente. Apoi două meta-lecții: scăderea și aglomerarea strategiilor, și citirea critică a unui studiu. Fiecare strategie vine cu același set: mecanism, cine e de partea cealaltă, reguli, regim, costuri, risc de crash, notă de dovezi, drill în simulator.
- **De ce aici:** după 3.10–3.12 utilizatorul poate valida și dimensiona. Abia acum strategiile „cu dovezi” pot fi verificate în loc să fie crezute (R6 §7, Stage 4). Pentru futures și carry e recomandat 3.14 înainte (3.14.1–3.14.3, 3.14.6); lecțiile 3.13.1 și 3.13.3 au totuși câte un beat de recapitulare.
- **Cere de dinainte:** 3.10–3.12; 2.8 (strategie × regim); 2.14 (swap, short); 3.14.1–3.14.3 și 3.14.6 (recomandat).
- **Checkpoint:** `test-3.13`, 12 întrebări:
  - 4 numerice cu `vary`: unitatea Turtle, carry-ul zilnic, z-score-ul și half-life-ul, randamentul anormal;
  - 5 mcq;
  - 3 cazuri d3 de tipul „dă nota de dovezi și justific-o”.

  La ≥ 80%, lecțiile se marchează „Tested out”.
- **Laboratorul unității: „Strategy zoo”** (S13 + S9 + S10). 12 piețe futures sintetice și 30 de active, cu regimuri ascunse (R1, R2, R7, R8, R13 și R0).
  - Utilizatorul rulează fiecare familie de strategii.
  - Completează matricea strategie × regim (R6 §2.17) din propriile rezultate.
  - Scrie câte un card de dovezi pentru două strategii (șablonul din 3.13.8).
  - Scor: matricea consistentă cu rezultatele, controlul R0 rulat pentru fiecare familie, cardurile de dovezi complete.
- **Fire din spirală:**
  - Dovezi: centrul unității.
  - Risc: crash-urile momentum-ului și ale carry-ului, perechile care se rup.
  - Costuri: turnover, împrumutul pentru short, roll, funding; capacitatea vine la 4.2.
  - Statistică: false discovery rate, event study cu interval de încredere.
  - Proces: întrebarea „who is on the other side?” înaintea fiecărei strategii (R6 §7).
  - Psihologie: abandonarea unui sistem bun într-un drawdown normal.
- **Surse:** R6 §0.4, §2.1.1, §2.2.1, §2.2.2, §2.6, §2.9, §2.10, §2.11, §2.13, §2.17, §3.5, §7 (Stage 4–5); R5 BT-17, BT-22; R4 §5.10, §8; R1 §2.18 (BT-12), §2.19 (SS-07, SS-09, SS-10, SS-15).

#### 3.13.1 · Time-series momentum and the Turtles
- **Nivel / durată / tip:** Advanced · 8 min · Electivă (Technical analyst, Systematic trader)
- **Obiective:**
  1. State the time-series momentum rule and its evidence across 58 futures markets.
  2. Compute Turtle N, unit size and the 2N stop for a synthetic futures contract.
  3. Explain why the exact Turtle parameters faded while the underlying effect survived.
- **Concepte:** time-series-momentum (nou), volatility-targeting (3.12.6)
- **Se sprijină pe:** 2.3 (instrumente de trend), 2.4 (ATR, Donchian), 3.12.6; 3.14.1 (recomandat; lecția are un beat de recapitulare)
- **Hook:** predict · slider 0–58 · "A rule goes long any market whose last 12 months were up, and short if they were down, with positions sized to equal volatility. Tested on 58 futures markets, in how many was it profitable?" Răspuns: în toate 58 (Moskowitz, Ooi & Pedersen 2012).
- **Interacțiunea centrală:**
  - `explain`, time-series momentum (MOP 2012): 58 de futures lichide (indici, valute, mărfuri, obligațiuni); long sau short după semnul randamentului în exces pe 12 luni; poziția ținută o lună; mărimi egalizate pe volatilitate. A fost profitabil pe fiecare din cele 58. Randamentele persistă 1–12 luni și se inversează parțial după. Hurst, Ooi & Pedersen extind testul la 67 de piețe, până în 1880; „crisis alpha” apare în rezumate secundare [verify]. Fidelity atribuie crisis alpha mai ales sincronizării beta-ului. Există perioade plate lungi, de ani.
  - `explain`, cine e de partea cealaltă: subreacția la informație, urmată de suprareacție întârziată; hedgerii care plătesc pentru asigurare.
  - `explain`, recapitulare pentru cine n-a făcut 3.14: un contract futures are o valoare pe punct.
  - `worked` cu input, unitatea Turtle: N = true range-ul mediu netezit pe 20 de zile = 2.5 puncte; valoarea pe punct 50 vUSD; cont 100,000 vUSD. Unitatea = 1% × 100,000 ÷ (2.5 × 50) = 8 contracte. Stop-ul la 2N = 5 puncte, adică 8 × 5 × 50 = 2,000 vUSD = 2% pe unitate.
  - `figure` (Candles + Level, 4 pași), System 2: intrare la breakout-ul de 55 de zile; stop la 2N; încă o unitate la fiecare ½N, cel mult 4; ieșire la breakout-ul opus de 20 de zile.
  - `explain`: System 1 (breakout de 20 de zile cu regula de skip, breakout-ul de 55 de zile ca „failsafe”, ieșire la 10 zile); limitele de portofoliu 6/10/12; regula de drawdown: contul nominal −20% la fiecare −10% drawdown [PK, verify].
  - `callout`: rata de câștig e ~35–40%, iar drawdown-urile cu parametrii originali, 20–50%. Sistemul exact e raportat ca plat între 1996 și 2009. Efectul a supraviețuit; cifrele exacte s-au aglomerat.
- **Try:** widget `turtle-desk` (nou; S10 + S13).
  - Start: 12 piețe futures sintetice, cont 100,000 vUSD, primele trei semnale în așteptare.
  - Obiectiv: "Compute N and the unit size by hand for the first three signals, then let the system run 10 synthetic years across 12 markets without overriding it."
  - Reușită: mărimile unităților exacte (toleranță 0 contracte); regula de skip aplicată corect; nicio intervenție în drawdown-uri (indicatorul de abandon rămâne stins).
  - Indicii: 1. "Unit = 1% of equity ÷ (N × value per point)." 2. "A losing streak inside the corridor is not a reason to override."
- **Practică:** 12 piețe futures sintetice (mix R1/R2/R3), cu benchmark ghost. Scor: acuratețea sizing-ului, respectarea regulii de skip, indicatorul de abandon. Se compară portofoliul cu expunere nominală egală cu cel scalat pe volatilitate.
- **Check:**
  - q1 numeric d2: unitatea Turtle (`vary` contul, N, valoarea pe punct).
  - q2 mcq d2: de ce se scalează pe volatilitate între piețe.
  - q3 mcq d3: 12 pierderi la rând într-un sistem de trend. Ce verifici: coridorul Monte Carlo și regimul; nu abandonezi pe emoție.
- **Dovezi:** time-series momentum: A (MOP 2012; R6 §2.6.2). Regulile Turtle exacte: B, aglomerate (R6 §2.2.1: A/B; detaliile [PK, verify]). Cifrele de crisis alpha: de verificat.
- **Necesită:** S10 (specificații futures sintetice), S9 (12 piețe), S13, S2 (Donchian, ATR)
- **Termeni noi de glosar:** time-series-momentum, turtle-unit, crisis-alpha

#### 3.13.2 · Cross-sectional momentum and its crashes
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Technical analyst, Systematic trader)
- **Obiective:**
  1. Build a ranked winners-minus-losers portfolio with a 12-1 lookback.
  2. Describe momentum crashes and the market state that comes before them.
  3. Show how volatility scaling changes the depth of a crash.
- **Concepte:** cross-sectional-momentum (nou), momentum-crash (nou)
- **Se sprijină pe:** 3.13.1, 3.12.6, 2.14 (short selling)
- **Hook:** predict · slider 0–200%, pas 5 · "March to May 2009, right after a deep fall. Past winners rose 8%. How much did past losers rise?" Răspuns: 163% (Daniel & Moskowitz 2016).
- **Interacțiunea centrală:**
  - `explain`: Jegadeesh & Titman (1993): perioada de formare 3–12 luni, deținerea 3–12 luni, decile; ultima lună se sare (12-1) ca să se evite inversarea pe termen scurt. Efectul apare în multe clase de active (Asness, Moskowitz & Pedersen 2013 [PK]) și se inversează parțial în anii 2–3. Varianta de retail: clasezi ETF-uri sau sectoare și ții primele 3 (doar long).
  - `figure` (Bars + Line, 4 pași): clasamentul a 30 de active; long primele 5, short ultimele 5; starea de panică (piața −40%, volatilitate mare); revenirea, în care piciorul short explodează.
  - `worked` cu input: o carte long–short cu 1 vUSD pe fiecare picior. Câștigătorii +8%, perdanții +163%: 0.08 − 1.63 = −1.55 vUSD la fiecare 1 vUSD pe picior.
  - `explain`: scalarea pe volatilitate aproape dublează Sharpe-ul în studiul Daniel & Moskowitz. Costuri: turnover, împrumutul pentru short, aglomerarea. Cine e de partea cealaltă: investitori care subreacționează la știri, apoi suprareacționează.
- **Try:** widget `momentum-ranker` (nou; S9 + S13).
  - Start: 30 de active sintetice, 10 ani, cu un factor de momentum persistent și o revenire de panică.
  - Obiectiv: "Rank 30 synthetic assets by 12-1 momentum and hold the top and bottom 5. Then switch on volatility scaling and compare the crash month."
  - Reușită: clasamentul corect (verificat de simulator); drawdown-ul din luna crash-ului raportat cu și fără scalare; verdictul despre care e mai mic.
  - Indicii: 1. "12-1 means the return over 12 months, skipping the latest one." 2. "Scaling cuts exposure when volatility is already high."
- **Practică:** 30 de active sintetice cu factor de momentum și o revenire de panică construită. Scor: drawdown-ul crash-ului, costul turnover-ului, Sharpe-ul ca diagnostic, cu interval de încredere.
- **Check:**
  - q1 mcq d1: de ce se sare ultima lună.
  - q2 mcq d2: starea pieței dinaintea crash-urilor de momentum.
  - q3 mcq d3: top 3 ETF-uri sectoriale, doar long, vs decile long–short. Ce riscuri se schimbă: dispare crash-ul piciorului short, dar rămâne beta întreagă a pieței.
- **Dovezi:** A, cu crash-uri (Jegadeesh & Titman 1993; Daniel & Moskowitz 2016; R6 §2.6.1).
- **Necesită:** S9 (30 de active), S13, S10 (costul împrumutului pentru short)
- **Termeni noi de glosar:** cross-sectional-momentum, momentum-crash, formation-period

#### 3.13.3 · Carry and its crashes
- **Nivel / durată / tip:** Advanced · 8 min · Electivă (Technical analyst, Systematic trader)
- **Obiective:**
  1. Compute the carry earned by an FX position, a rolled futures position and a spot–perp basis trade.
  2. Explain why carry has negative skew and crashes in the same periods across asset classes.
  3. Choose leverage from the crash scenario, not from the average carry.
- **Concepte:** carry (nou), skewness (3.10.1), roll-yield (3.14.3), funding-rate (3.14.6)
- **Se sprijină pe:** 2.14 (swap), 3.10.1, 3.14.3 și 3.14.6 (recomandat; lecția are un beat de recapitulare)
- **Hook:** predict · slider 0–100%, pas 1 · "A position earns 4% a year in carry. A 10% adverse jump hits about once every five years. At 10× leverage, what's the chance of being wiped out within 10 years?" Răspuns: ≈ 89% (1 − 0.8¹⁰, cu o probabilitate de salt de 20% pe an).
- **Interacțiunea centrală:**
  - `explain`, recapitulare: swap-ul (2.14), roll yield (3.14.3), funding-ul (3.14.6).
  - `worked` cu input, carry în FX: diferența de dobândă 4% pe o expunere de 100,000 vUSD = 4,000 pe an ≈ 10.96 vUSD pe zi. Miercuri se plătește triplu. Marja brokerului micșorează creditele.
  - `match`, 4 forme de carry ↔ sursa: swap în FX; roll yield-ul unui futures în backwardation; carry-ul și roll-down-ul unei obligațiuni; baza în crypto (long spot + short perpetual încasează funding-ul: 0.01% la 8 ore ≈ 10.95% pe an).
  - `explain`, dovezile: Koijen, Moskowitz, Pedersen & Vrugt (2018): carry-ul prezice randamentele pe acțiuni, obligațiuni, mărfuri, valute, credit și opțiuni. Toate strategiile de carry merg prost în aceleași perioade: recesiuni globale și crize de lichiditate. Paritatea neacoperită a dobânzilor spune că n-ar trebui să plătească; empiric plătește, cu risc de crash (yen carry 2008, august 2024 [PK]). Cine e de partea cealaltă: hedgerii și cumpărătorii de asigurare. Carry-ul înseamnă să fii plătit ca să ții riscul de crash.
  - `figure` (Line, 3 pași), equity-ul în R8: o scară lină, apoi o prăpastie; skew negativ.
  - `callout`: o curbă lină de carry pe 3 ani, cu Sharpe 2, ascunde skew-ul (3.10.1).
- **Try:** widget `carry-leverage-mc` (nou; S9 + S13, R8).
  - Start: o poziție de carry cu 4% pe an și saltul de crash din hook; 1,000 de drumuri Monte Carlo pe 10 ani.
  - Obiectiv: "Choose leverage for a carry position so the 5th-percentile outcome over 10 years stays above −30%."
  - Reușită: un levier ≤ pragul calculat de simulator.
  - Indicii: 1. "Size for the jump, not for the average year." 2. "A 10% jump at 3× costs 30%."
- **Practică:** R8 + crash R12; mecanica swap-ului în FX; drill-ul de bază în crypto, în care funding-ul devine negativ (3.14.6).
- **Check:**
  - q1 numeric d1: carry-ul zilnic (`vary`).
  - q2 mcq d2: de ce crash-urile de carry vin în același timp în toate clasele de active.
  - q3 mcq d3: o curbă de carry lină pe 3 ani, cu Sharpe 2. Ce ascunde.
- **Dovezi:** A, cu risc de crash (KMPV 2018; R6 §2.10). Baza în crypto: B (He, Manela, Ross & von Wachter; abaterile s-au micșorat în timp; R6 §3.6).
- **Necesită:** S10 (swap, funding, roll), S9, S13, R8, R12
- **Termeni noi de glosar:** carry, basis-trade, uncovered-interest-parity

#### 3.13.4 · Testing a seasonal edge
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Technical analyst, Systematic trader)
- **Obiective:**
  1. Test a calendar rule for significance in-sample and confirm it once on hold-out data.
  2. Measure your own detection rate and false-discovery rate across seeded and noise markets.
  3. Use a seasonal effect as a filter or tilt, not as a standalone system, and check the futures curve first.
- **Concepte:** calendar-effects (3.9.6), multiple-testing (3.10.6), false-discovery-rate (nou)
- **Se sprijină pe:** 3.9.6, 3.10.6, 3.11.4
- **Hook:** predict · slider 0–100%, pas 1 · "Ten synthetic markets: three carry a real turn-of-month drift, seven are pure noise. You test each at the 5% level. What's the chance at least one noise market passes?" Răspuns: 30% (1 − 0.95⁷).
- **Interacțiunea centrală:**
  - `worked` cu input, false discovery rate: cu o putere de 70%, 3 × 0.7 = 2.1 detectări reale; 7 × 0.05 = 0.35 alarme false; FDR = 0.35 ÷ 2.45 = 14%. Cu 100 de piețe-zgomot: 5 false față de 2.1 reale, deci FDR = 70%.
  - `explain`, turn-of-the-month: McConnell & Xu (2008), 31 din 35 de țări; un working paper Fed arată dispariția în S&P futures după 1990. Fereastra are ~4 din ~21 de zile de tranzacționare pe lună (19%). Se folosește ca filtru sau ca înclinare (de exemplu: semnalele long se iau doar în fereastră, sau mărimea crește puțin); ca sistem de sine stătător, edge-ul e mic față de costuri.
  - `reveal`, sezonalitatea mărfurilor vs curba (R9): creșterea sezonieră previzibilă e deja în prețul contractului amânat, deci cumpărarea lui nu câștigă randamentul sezonier (drill-ul din R6 §3.5).
  - `callout`: Halloween e B/C, cu variație mare; mulți ani merg împotrivă.
- **Try:** widget `seasonality-lab` (S7 + R13; varianta extinsă din 3.9.6).
  - Start: 10 piețe sintetice, 3 cu drift real de turn-of-month; jumătate in-sample, jumătate hold-out.
  - Obiectiv: "Scan the ten markets, flag the ones with a real turn-of-month drift, then confirm on hold-out. Report your false-discovery rate."
  - Reușită: cel puțin 2 din cele 3 piețe reale marcate după hold-out; cel mult o piață-zgomot trece de hold-out; FDR calculat corect din propriile rezultate.
  - Indicii: 1. "FDR = false flags ÷ all flags." 2. "The hold-out is where the noise markets fall away."
- **Practică:** sweep R13 vs R0 cu costuri: înclinarea turn-of-month, netă de costuri. Drill-ul sezonalitate vs curbă pe R9.
- **Check:**
  - q1 numeric d2: FDR (`vary`).
  - q2 mcq d2: de ce un efect sezonier e un filtru, nu un sistem.
  - q3 mcq d3: futures amânate și un pattern sezonier cunoscut.
- **Dovezi:** turn-of-the-month: B (R6 §2.13; R4 §8.5: Moderate). Halloween: B/C. Sezonalitatea mărfurilor ca tranzacție: C, pentru că e prețuită în curbă (R4 §8.15; R6 §3.5).
- **Necesită:** S7, S13, S5 (calendar), R13, R9
- **Termeni noi de glosar:** false-discovery-rate, seasonal-tilt

#### 3.13.5 · Pairs trading and statistical arbitrage
- **Nivel / durată / tip:** Advanced · 8 min · Electivă (Technical analyst, Systematic trader)
- **Obiective:**
  1. Tell correlation from cointegration and test a candidate pair.
  2. Trade a spread with z-score entries, a mean exit, a stop and a time stop based on the half-life.
  3. Recognise a structural break and cap its loss.
- **Concepte:** pairs-trading (nou), cointegration (nou), structural-break (nou)
- **Se sprijină pe:** 3.10.6 (corelații false), 2.14 (short selling), 2.8 (mean reversion)
- **Hook:** predict · alegere din 3 · "Two synthetic stocks have moved together for three years, with a correlation of 0.92. Their spread is now 2.2 standard deviations wide. Will it close?"
  - `a` "Very likely"
  - `b` "Only if the pair is cointegrated" ✓
  - `c` "Always, eventually"
- **Interacțiunea centrală:**
  - `figure` (Line, 4 pași): două random walk-uri cu corelație 0.9 care se depărtează (corelație falsă, 3.10.6), lângă o pereche cointegrată al cărei spread oscilează (R7).
  - `explain`, metoda distanței (Gatev, Goetzmann & Rouwenhorst 2006): formare pe 12 luni, perechi alese după distanța minimă între prețurile normalizate, intrare la 2σ, ieșire la convergență, 6 luni de tranzacționare; până la 11% anual între 1962 și 2002. Do & Faff: randamentul lunar a scăzut de la 0.86% la 0.37% și apoi la 0.24%; testele out-of-sample din 2004–2009 nu au găsit randamente în exces consistente.
  - `explain`, metoda cointegrării: spread = A − β·B; testul de staționaritate; half-life-ul procesului OU = ln 2 ÷ θ.
  - `worked` cu input: spread-ul e acum 2.6, cu abaterea standard 1.2, deci z = 2.17: vinzi spread-ul. Cu θ = 0.1 pe zi, half-life = 6.9 zile, deci time stop ≈ 14 zile; stop la |z| = 3.5.
  - `callout`, riscurile: ruptura structurală (o fuziune, o schimbare de business), două rânduri de costuri, împrumutul pentru short, riscul de picior (un singur picior executat), aglomerarea (LTCM, 1998). Cine e de partea cealaltă: cei care cer lichiditate și creează presiuni temporare de preț.
- **Try:** widget `pair-lab` (nou; S9 + R7).
  - Start: 4 perechi candidate; două sunt cointegrate, două doar corelate; una dintre cele cointegrate se rupe la un moment ascuns.
  - Obiectiv: "Four candidate pairs. Test each, trade only the cointegrated ones, and set a z-score stop and a time stop before the first entry."
  - Reușită: setul ales = perechile cu adevărat cointegrate (eticheta ascunsă); stop-urile setate înainte de intrare; pierderea pe perechea care se rupe ≤ stop-ul ei.
  - Indicii: 1. "High correlation is not enough. The spread itself must keep coming back." 2. "Time stop ≈ 2 × half-life."
- **Practică:** R7 cu o ruptură structurală ascunsă. Scor: acuratețea selecției și pierderea pe perechea ruptă.
- **Check:**
  - q1 numeric d2: z-score (`vary`).
  - q2 numeric d2: half-life (θ = 0.05 → 13.9 zile; `vary`).
  - q3 mcq d3: spread-ul ajunge la 4σ după o știre de fuziune. Ce faci: ieși la stop; e probabil o ruptură structurală; nu adaugi la poziție.
- **Dovezi:** B, scăzut (Gatev et al. 2006; Do & Faff 2010; R6 §2.11).
- **Necesită:** S9 (perechi), S13, S10 (împrumut pentru short)
- **Termeni noi de glosar:** pairs-trading, cointegration, z-score, half-life, hedge-ratio, structural-break

#### 3.13.6 · Event-driven strategies, systematically
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Technical analyst, Systematic trader)
- **Obiective:**
  1. Run a simple event study: average abnormal return around many events, not one anecdote.
  2. Build a rule-based PEAD portfolio and evaluate it net of costs over time.
  3. Decide in advance when to stop trading a decaying event effect.
- **Concepte:** event-study (nou), post-earnings-drift (3.8.8), anomaly-decay (3.8.8)
- **Se sprijină pe:** 3.8.5, 3.8.8, 3.10.5, 3.7 (pre-event drift)
- **Hook:** predict · slider 0–10%, pas 0.1 · "The day after its earnings surprise, LABB rose 6%. The index rose 1%, and LABB's beta is 1.2. What was LABB's abnormal return?" Răspuns: 4.8%.
- **Interacțiunea centrală:**
  - `worked` cu input: randamentul anormal = 6% − 1.2 × 1% = 4.8%. Randamentul anormal cumulat (CAR) e suma lor pe fereastra evenimentului.
  - `figure` (Line + Zone, 4 pași): CAR-ul mediu de la ziua −5 la ziua +60, pe 80 de surprize sintetice, cu banda de încredere; grupul pozitiv și cel negativ.
  - `explain`: un singur eveniment e o anecdotă; contează media pe multe evenimente și intervalul ei de încredere. Familiile de evenimente:
    - raportări (PEAD, B; 3.8.8);
    - date macro (pre-FOMC drift: Lucca & Moench găsesc +49 bp pe S&P în cele 24 de ore dinaintea FOMC, între 1994 și 2011, incert după publicare; detalii la 3.7);
    - titluri neprogramate: D pentru retail, din cauza latenței (R6 §2.9.4).
  - `explain`, PEAD sistematic: decile SUE, deținere 60 de zile; capacitatea limitată în small caps; regula de oprire scrisă dinainte (din 3.8.8).
- **Try:** widget `event-study` (nou; S13 + S16).
  - Start: 80 de surprize de raportare sintetice, cu beta estimat pentru fiecare acțiune.
  - Obiectiv: "Run an event study on 80 synthetic earnings surprises: plot the average abnormal return from day −5 to day +60, with its confidence band."
  - Reușită: CAR-ul la ziua +60 citit corect; verdictul despre faptul că banda exclude sau nu zero.
  - Indicii: 1. "Abnormal = actual − beta × market." 2. "Judge the band, not the line."
- **Practică:** o simulare de scădere a efectului pe parcursul „anilor”, cu un eveniment de publicare. Decizia de oprire se compară cu regula scrisă dinainte (din 3.8.8 și 3.11.10).
- **Check:**
  - q1 numeric d1: randamentul anormal (`vary`).
  - q2 mcq d2: de ce se face media pe multe evenimente.
  - q3 mcq d3: tranzacționarea titlurilor de știri de către retail. Ce notă are și de ce.
- **Dovezi:** PEAD: B, scăzut (R6 §2.9.2). Pre-FOMC drift: B (R4 §8.7; R6 §2.9.1 [PK, verify]). Tranzacționarea titlurilor de către retail: D (R6 §2.9.4).
- **Necesită:** S13, S16, S6
- **Termeni noi de glosar:** event-study, abnormal-return, beta

#### 3.13.7 · Decay, crowding and regime dependence
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Technical analyst, Systematic trader)
- **Obiective:**
  1. Quantify typical post-publication decay and separate it from statistical selection bias.
  2. Explain crowding and why crowded strategies crash together.
  3. Tell a normal drawdown from a broken edge, using the Monte Carlo corridor and a regime breakdown.
- **Concepte:** anomaly-decay (3.8.8), strategy-crowding (nou), market-regime (2.8)
- **Se sprijină pe:** 3.11.7, 3.11.10, 3.10.3, 2.8
- **Hook:** predict · alegere din 4 · "97 published return predictors were re-tested after their papers came out. On average, their returns after publication were…"
  - `a` "Unchanged"
  - `b` "About 26% lower"
  - `c` "About 58% lower" ✓
  - `d` "Gone"
- **Interacțiunea centrală:**
  - `explain`, McLean & Pontiff: −26% out-of-sample înainte de publicare (bias statistic, data mining) și −58% după publicare (investitorii învață din studii).
  - `figure` (Bars, 3 pași), controlul R0: strategiile alese pe R0 „scad” 100% out-of-sample, pur din selecție; un edge real scade doar parțial.
  - `explain`: piețele adaptive (Lo). Exemple de aglomerare: tranzacțiile de convergență LTCM (1998); crash-ul de momentum (2009); lichidarea yen carry (august 2024 [PK]); sistemul Turtle plat între 1996 și 2009.
  - `match`, matricea strategie × regim (R6 §2.17): 4 familii ↔ regimul în care eșuează.
  - `worked`, arborele de decizie „decay vs variance”: (1) ești în coridorul Monte Carlo? (2) s-a schimbat regimul? (3) controlul R0 e curat? (4) s-au schimbat costurile sau aglomerarea? → păstrezi, reduci sau oprești.
- **Try:** widget `decay-sim` (nou; S13).
  - Start: trei sisteme, fiecare cu equity-ul, coridorul, defalcarea pe regimuri și controlul R0.
  - Obiectiv: "Three systems, three stories: one in a normal drawdown, one whose edge decayed, one fit to noise. Classify each using the corridor, the regime breakdown and the R0 control."
  - Reușită: 3 din 3 corecte.
  - Indicii: 1. "Inside the corridor and stable by regime: normal variance." 2. "If R0 looked just as good, it was noise from the start."
- **Practică:** o schimbare ascunsă de regim, R1 → R2. Utilizatorul segmentează rezultatele pe regimuri, scrie un filtru de regim și verifică dacă filtrul rezistă out-of-sample. Adesea nu rezistă; atunci se înregistrează ca încă o încercare.
- **Check:**
  - q1 mcq d1: ce înseamnă scăderea de 26% (bias înainte de publicare).
  - q2 mcq d2: aglomerarea și de ce strategiile aglomerate cad împreună.
  - q3 mcq d3: un sistem e la −14R, percentila 99 din Monte Carlo e 17R, iar regimul a trecut în range. Ce faci: ești sub pragul de kill; verifici filtrul de regim prin guvernarea regulilor; nu faci schimbări ad-hoc.
- **Dovezi:** A, ca meta-constatare (McLean & Pontiff 2016; R4 §8.9; R6 §0.4; R5 BT-22 [S117][S118]).
- **Necesită:** S13, S7
- **Termeni noi de glosar:** crowding, adaptive-markets

#### 3.13.8 · Reading a strategy study critically
- **Nivel / durată / tip:** Advanced · 8 min · Electivă (Technical analyst, Systematic trader)
- **Obiective:**
  1. Apply a ten-point checklist to any strategy paper, backtest or vendor claim.
  2. Compare a headline result with an independent replication after costs.
  3. Assign an evidence grade from Mechanic to F and defend it in two sentences.
- **Concepte:** evidence-appraisal (nou), anomaly-decay (3.8.8)
- **Se sprijină pe:** 3.11 (toată), 3.13.7, notele de dovezi (README §6)
- **Hook:** predict · alegere din 3 · "A 2024 working paper reports an opening-range strategy: over 1,600% net in eight years, Sharpe 2.81. An independent test on five index markets, after spreads and slippage, found…"
  - `a` "About the same result"
  - `b` "About half the result"
  - `c` "No market distinguishable from zero; four of five negative" ✓
- **Interacțiunea centrală:**
  - `order`, checklist-ul în 10 puncte:
    1. eșantionul: perioada, piețele, numărul de trade-uri;
    2. statutul: working paper sau studiu recenzat;
    3. un out-of-sample real;
    4. costuri și execuții realiste;
    5. numărul de încercări raportat;
    6. sensibilitatea la parametri;
    7. o replicare independentă;
    8. mecanismul și cine e de partea cealaltă;
    9. capacitatea și lichiditatea;
    10. scăderea după publicare și aglomerarea.
  - `worked`, cazul 1: opening range breakout (Zarattini, Barbon & Aziz 2024) vs replicarea (R6 §2.2.2). Edge-ul brut s-a reprodus (NQ +0.13R, 23% câștigătoare). Prima lumânare conține ~0.1R de informație, cam cât costă un round trip. Net de costuri, nicio piață nu s-a distins de zero.
  - `worked`, cazul 2: Brock, Lakonishok & LeBaron (1992) vs Sullivan, Timmermann & White (1999), adică data snooping.
  - `explain`, „haircut”-ul Harvey & Liu: un t de 3.0 coboară la ~2.0 după ajustarea pentru testări multiple. Într-un rând: deflated Sharpe, PBO și MinBTL vin la 4.3.
  - `match`: 5 semnale de alarmă dintr-o reclamă de vânzător ↔ punctul din checklist.
- **Try:** widget `paper-reader` (nou).
  - Start: trei rapoarte sintetice de strategie (un working paper, un vânzător de semnale, un studiu replicat).
  - Obiectiv: "Grade three synthetic strategy reports with the checklist. Give each an evidence grade and a two-sentence justification."
  - Reușită: notele la cel mult o treaptă de nota de referință; pentru fiecare raport, cel puțin 3 dintre semnalele-cheie găsite.
  - Indicii: 1. "Start with costs, trials and out-of-sample." 2. "Without an independent replication, the grade rarely goes above C."
- **Practică:** utilizatorul scrie un card de dovezi pentru o strategie din 3.13.1–3.13.6 (șablon: afirmația, eșantionul, OOS-ul, costurile, încercările, replicarea, mecanismul, nota, nota despre scădere). Cardul se salvează în jurnalul de cercetare și în Library.
- **Check:**
  - q1 mcq d1: cel mai important element lipsă dintr-o reclamă de vânzător.
  - q2 mcq d2: ce înseamnă „working paper” pentru încredere.
  - q3 mcq d3: dă nota pentru un caz descris.
- **Dovezi:** Mechanic, ca metodă. Exemplele: opening range breakout C (R6 §2.2.2); regulile tehnice clasice după ajustarea pentru data snooping (R6 §1.7 [PK, verify]); Harvey & Liu (R5 BT-17 [S96]).
- **Necesită:** widget nou `paper-reader` (conținut static); S13 pentru replicarea opțională
- **Termeni noi de glosar:** working-paper, replication, peer-review, evidence-grade

---
## 3.14 · Instruments II: futures, commodities, crypto, bonds

**Fișa unității**
- **Scop:** mecanica și riscurile instrumentelor cu levier și cu termen, **înaintea oricărei strategii**: futures (specificații, marjă, decontare zilnică, expirare, roll, curbă), mărfuri (șocuri de ofertă, rapoarte, limite zilnice), crypto (piață 24/7, venue-uri, custodie, perpetuals, funding, lichidare) și obligațiuni (preț și randament, duration, DV01).
- **De ce aici:** 2.14 a acoperit acțiunile, forex-ul și CFD-urile. Aici vin instrumentele pe care retailul le întâlnește tot mai des și care se predau cel mai puțin (perpetuals, lichidare, decăderea ETP-urilor; R1 §4 punctul 21). Mecanica vine înaintea strategiei (R6 §7, Stage 3; R1 §3.2 punctul 1). Pentru traseul Derivatives, pregătește 4.1 (opțiuni) și 4.4 (risc de portofoliu).
- **Cere de dinainte:** 2.14 (marjă, margin call, negative balance protection, swap), 1.4 (levier), 2.9 (sesiuni, weekenduri), 3.6 (dobânzi, mărfurile în macro), 3.10.2 (volatilitate).
- **Checkpoint:** `test-3.14`, 14 întrebări:
  - 7 numerice cu `vary`: P&L din tick value, variation margin, back-adjustment, roll yield, funding, prețul de lichidare, DV01;
  - 5 mcq;
  - 2 cazuri d3 de tipul „alege vehiculul”.

  La ≥ 80%, lecțiile se marchează „Tested out”.
- **Laboratorul unității: „Same view, five vehicles”** (S10 + S11). Aceeași opinie bullish pe indicele sintetic, ținută 30 și 180 de zile prin cinci vehicule: CFD (2.14), LXF, LXM, un ETF sintetic pe futures și un perpetual pe indice.
  - Utilizatorul completează tabelul de costuri (spread, comision, financing, roll, funding), levierul efectiv și expunerea la gap, la lichidare și la contraparte.
  - Alege vehiculul pentru fiecare orizont și justifică alegerea.
  - Scor: tabelul corect (cu toleranțe numerice) și o justificare consistentă cu orizontul.
- **Fire din spirală:**
  - Risc: marja ca obligație zilnică, creșterile de marjă, limit moves, lichidarea, riscul de contraparte.
  - Costuri: roll, funding, financing, comisioane de lichidare.
  - Statistică: volatilitatea crypto anualizată; DV01 ca sensibilitate.
  - Proces: prețul de lichidare și first notice day intră în checklist-ul de intrare.
  - Dovezi: aproape totul e Mechanic; cifrele CME și evenimentele reale sunt marcate [verify].
- **Surse:** R6 §3.0, §3.3–3.7, §4.5; R5 RF-16–RF-20; R4 §5.14, §6.10, §7.8; R1 §2.20 (AC-04, AC-05, AC-06), §2.21 (DL-03, DL-04, DL-09, DL-11), §4 punctul 21.

#### 3.14.1 · Futures contracts: specs, margin and daily settlement
- **Nivel / durată / tip:** Advanced · 8 min · Electivă (Derivatives)
- **Obiective:**
  1. Convert price moves into money with a contract's multiplier and tick value.
  2. Track initial, maintenance and variation margin through a losing day.
  3. Size in whole contracts from a stop, and switch to micros when one contract is too big.
- **Concepte:** futures-contract (nou), mark-to-market (nou), leverage ✓
- **Se sprijină pe:** 2.14 (marjă, margin call), 1.4 (sizing din stop, levier)
- **Hook:** predict · slider 0–10,000 vUSD, pas 50 · "LXF, the synthetic index future, is worth 50 vUSD per point and trades at 5,000.00. You buy 2 contracts. By the close, price is 4,962.50. How much leaves your account tonight?" Răspuns: 3,750 vUSD (37.5 × 50 × 2).
- **Interacțiunea centrală:**
  - `match`, tabelul de specificații [verify on CME spec page] ↔ echivalentul sintetic:
    - E-mini S&P 500 (ES): $50 × indicele, tick 0.25 = $12.50 → LXF;
    - Micro E-mini (MES): $5, tick $1.25 → LXM;
    - WTI Crude Oil (CL): 1,000 de barili, tick $0.01 = $10 → LXO;
    - Gold (GC): 100 oz, tick $0.10 = $10.
  - `worked`, valoarea nominală: LXF la 5,000 înseamnă 250,000 vUSD pe contract. Marja bursei e ~5–10% din valoare, deci levierul implicit e 10–20×.
  - `figure` (Line + Bars, 4 pași): marja inițială; marja de variație, decontată cash în fiecare zi; marja de menținere încălcată → margin call; bursa crește marja într-o piață volatilă (R12).
  - `worked` cu input, sizing-ul: cont 100,000, risc 1% = 1,000. Cu stop la 20 de puncte: 1,000 pe un LXF, deci 1 contract. Cu stop la 30 de puncte: 1,500 pe contract, deci 0 LXF. Cu micro: 30 × 5 = 150 pe LXM, deci 6 micro (risc 900).
  - `callout`: marjele intraday reduse oferite de brokeri încurajează supra-levierul. Există limite de preț și gap-uri la pauzele de sesiune. Fondurile clienților sunt la casa de compensare, segregate; în SUA, SIPC nu acoperă futures [PK]; cazul MF Global (2011) [PK].
- **Try:** widget `tick-converter` (nou; S10).
  - Start: cont 100,000 vUSD, LXF la 5,000.00, stop la 30 de puncte.
  - Obiectiv: "Size a trade on LXF with a 30-point stop and 1% risk on 100,000 vUSD. Use micros if one full contract is too much."
  - Reușită: 6 LXM și 0 LXF.
  - Indicii: 1. "Risk per contract = stop in points × value per point." 2. "Micros are one tenth of the size."
- **Practică:** drill-ul de creștere a marjei, în R12: bursa dublează marja în mijlocul unui drawdown. Utilizatorul decide între a reduce poziția și a adăuga bani. Scor: nicio lichidare forțată, risc ≤ cel din plan, decizia notată în jurnal.
- **Check:**
  - q1 numeric d1: P&L din tick value (1,000 de unități, mișcare de 0.85 → 850; `vary`).
  - q2 numeric d2: marja de variație (`vary`).
  - q3 mcq d3: marja vs risc (marja e garanția; riscul îl dau stop-ul și mărimea).
- **Dovezi:** Mechanic (R6 §3.3; specificațiile [verify on CME spec page]; R1 DL-03).
- **Necesită:** S10 (specificații futures), S11 (marjă inițială și de menținere, variation margin), S20 (creșterea marjei)
- **Termeni noi de glosar:** futures-contract, contract-multiplier, tick-value, initial-margin, maintenance-margin, variation-margin, micro-contract

#### 3.14.2 · Expiry, roll and continuous charts
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Derivatives)
- **Obiective:**
  1. Read contract month codes and plan a roll before expiry or before first notice day.
  2. Execute a roll as a calendar spread and account for its cost.
  3. Back-adjust a continuous chart so a backtest sees no fake roll gaps.
- **Concepte:** contract-roll (nou), continuous-contract (nou)
- **Se sprijină pe:** 3.14.1, 3.11.3 (datele și biasurile)
- **Hook:** predict · alegere "Yes / No" · "On roll day, the LXF continuous chart jumps 30 points overnight, with no news. Did holders of the expiring contract just earn 30 points?" Răspuns: nu. Graficul a trecut la alt contract, care costă cu 30 de puncte mai mult.
- **Interacțiunea centrală:**
  - `match`, codurile lunilor: H = martie, M = iunie, U = septembrie, Z = decembrie (plus F, G, J, K, N, Q, V, X) [PK].
  - `explain`: decontare cash vs livrare fizică; first notice day și ultima zi de tranzacționare. Simulatorul impune ieșirea înainte de first notice day pe contractele fizice. La indici, lichiditatea trece pe contractul următor cu ~8 zile înainte de expirare [PK].
  - `figure` (Candles, 3 pași): roll-ul ca spread calendaristic (vinzi luna care expiră și cumperi luna următoare, într-un singur ordin); spread-ul reflectă carry-ul și dividendele.
  - `worked` cu input, back-adjustment: la roll, contractul curent e 5,000.00, iar următorul 5,030.00. Se scad 30.00 din toate prețurile anterioare (sau se ajustează proporțional cu 5,030 ÷ 5,000). Seria neajustată are gap-uri false, care creează breakout-uri false în backtest (3.11.3).
  - `callout`: în aprilie 2020, contractul WTI cu scadența cea mai apropiată s-a decontat la un preț negativ (~−37), când depozitele s-au umplut aproape de expirare [PK]. Lecția: riscul de livrare și de depozitare.
- **Try:** widget `roll-desk` (nou; S10 + R9).
  - Start: o poziție long LXO, cu 6 zile până la first notice day; curba R9.
  - Obiectiv: "Roll a long LXO crude position before its first notice day, then back-adjust the chart so the roll leaves no gap."
  - Reușită: roll-ul executat înainte de first notice day; seria ajustată continuă la data roll-ului (diferență 0.00).
  - Indicii: 1. "Roll with one spread order, not two separate trades." 2. "Shift every price before the roll by the gap."
- **Practică:** curba R9. Dacă first notice day e ratat pe un contract fizic, apare ecranul de eșec "delivery notice". Utilizatorul alege momentul roll-ului în funcție de mutarea lichidității.
- **Check:**
  - q1 mcq d1: ce înseamnă un cod de lună.
  - q2 numeric d2: prețul ajustat (`vary`).
  - q3 mcq d3: de ce o serie continuă neajustată deformează un backtest de breakout.
- **Dovezi:** Mechanic (R6 §3.3; R5 BT-03).
- **Necesită:** S10 (expirări, first notice day, spread-uri calendaristice), S13 (serii continue ajustate), R9
- **Termeni noi de glosar:** expiry, first-notice-day, calendar-spread, continuous-contract, back-adjustment

#### 3.14.3 · Contango, backwardation and roll yield
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Derivatives)
- **Obiective:**
  1. Tell contango from backwardation on a futures curve and name what causes each.
  2. Compute the roll yield a rolled long position earns or pays when spot doesn't move.
  3. Explain why commodity ETFs and VIX products can fall while spot is flat.
- **Concepte:** term-structure (nou), roll-yield (nou)
- **Se sprijină pe:** 3.14.2
- **Hook:** predict · slider −30% … +30%, pas 0.5 · "Spot crude stays at 70.00 all year. The one-month future always trades at 71.00, and you roll every month. After 12 months, your long position has…" Răspuns: ≈ −15.7%.
- **Interacțiunea centrală:**
  - `figure`, formele curbei (Line, 3 pași): contango (futures peste spot: depozitare, finanțare, asigurare); backwardation (futures sub spot: convenience yield când stocurile sunt mici); convergența la expirare.
  - `worked` cu input: cumperi la 71.00, contractul converge la 70.00 → −1.41% pe lună; (1 − 0.0141)¹² − 1 = −15.7% pe an. În backwardation, cu spot 70 și futures 69: +1.45% pe lună.
  - `explain`, intuiția prețului corect: futures ≈ spot + finanțare + depozitare − convenience yield. ETF-urile de mărfuri și produsele pe VIX pierd la roll. Legătura cu carry-ul (3.13.3).
- **Try:** widget `curve-lab` (nou; R9).
  - Start: spot la 70.00; contractul pe o lună ajustabil.
  - Obiectiv: "Build a curve where a rolled long earns at least 1% a month while spot stays at 70.00."
  - Reușită: contractul pe o lună ≤ 69.30 (70 ÷ 69.30 − 1 = 1.01%).
  - Indicii: 1. "The long earns when the future rises toward spot." 2. "Roll yield ≈ spot ÷ future − 1, per roll."
- **Practică:** drill-ul de contango pe R9: cumperi și ții o marfă cu roll lunar în contango, cu spot-ul plat. Se compară spot-ul, futures-ul cu roll și un ETF sintetic de mărfuri.
- **Check:**
  - q1 numeric d2: roll yield-ul lunar (`vary`).
  - q2 mcq d1: ce produce backwardation.
  - q3 mcq d3: un ETF de mărfuri a scăzut 20% într-un an, cu spot-ul plat. De ce.
- **Dovezi:** Mechanic (R6 §3.3, §2.10; R1 DL-04).
- **Necesită:** S10, R9
- **Termeni noi de glosar:** contango, backwardation, roll-yield, convenience-yield, cost-of-carry

#### 3.14.4 · Commodities: supply shocks, reports and limits
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Derivatives)
- **Obiective:**
  1. Name the supply, storage and report drivers that move a commodity future.
  2. Size a position held through a scheduled inventory report and a possible limit move.
  3. Explain why a famous seasonal pattern rarely pays once the curve has priced it.
- **Concepte:** commodity-drivers (nou), term-structure (3.14.3), gap-risk ✓
- **Se sprijină pe:** 3.14.1–3.14.3, 3.6 (mărfurile în macro), 2.10 (calendarul)
- **Hook:** predict · alegere din 3 · "A synthetic grain future is locked limit-down for two days. Your stop sits 3% below entry; the daily limit is 5%. Where can your stop fill?"
  - `a` "At −3%"
  - `b` "At −5%"
  - `c` "Only when trading resumes, possibly −10% or worse" ✓
- **Interacțiunea centrală:**
  - `explain`: familiile (energie, metale, cereale și oleaginoase, softs, animale). Șocurile de ofertă (vreme, OPEC+, geopolitică, boli, greve, interdicții de export) produc salturi și valuri de volatilitate (R4). Rapoartele programate: EIA (stocurile săptămânale de petrol și gaze), USDA WASDE, Crop Progress, COT (3.9.2) [PK]. Livrarea fizică și depozitarea. Contractele micro. Aurul ca activ legat de dobânzile reale (invers față de randamentele reale [PK]; 3.6).
  - `worked` cu input: entry 500.00, stop 485.00 (1R = 15). Două zile limit-down de câte 5%: 475.00, apoi 451.25. Prima execuție posibilă ≈ 451.25, deci pierderea e 48.75 = 3.25R.
  - `match`: 4 factori ↔ instrumentul pe care îl mișcă.
  - `callout`: sezonalitatea e deja în curbă (3.13.4). Mărfurile sunt terenul clasic al trend following-ului CTA (3.13.1).
- **Try:** widget `report-day` (nou; S6 + R5).
  - Start: o poziție long LXO; raportul de stocuri în 10 minute; limita zilnică afișată.
  - Obiectiv: "An inventory report on LXO is due in 10 minutes. Choose flat, reduce or hold, and size so a two-day limit move would cost at most 2R."
  - Reușită: decizia respectă regula: unități ≤ floor(2R ÷ pierderea pe unitate în două zile limită), sau flat.
  - Indicii: 1. "A limit day can skip right over your stop." 2. "Size from the worst plausible gap, not from the stop."
- **Practică:** R5 cu un raport săptămânal de stocuri cu distribuție de surprize; zile limită R4 pe cereale.
- **Check:**
  - q1 numeric d2: pierderea în R după limit moves (`vary`).
  - q2 mcq d1: ce face un raport de stocuri (informație programată despre ofertă).
  - q3 mcq d3: cumperi vara contractul pe gaze naturale pe iarnă, pentru creșterea de iarnă. De ce nu funcționează.
- **Dovezi:** Mechanic (R6 §3.5; R4 §6.10). Sezonalitatea ca tranzacție: C (R4 §8.15).
- **Necesită:** S6 (rapoarte sintetice), S10 (limite zilnice, livrare), S20
- **Termeni noi de glosar:** limit-move, inventory-report, physical-delivery

#### 3.14.5 · Crypto markets: 24/7, venues and custody
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Derivatives)
- **Obiective:**
  1. Describe what changes when a market never closes: weekends, thin hours, no closing auction.
  2. Size a crypto position from its much larger volatility so risk per trade stays at 1%.
  3. Rank custody and counterparty risks: exchange failure, stablecoin de-pegs, self-custody.
- **Concepte:** crypto-market-structure (nou), counterparty-risk (nou)
- **Se sprijină pe:** 2.4 (sizing pe ATR), 2.9 (sesiuni, weekenduri), 3.10.2
- **Hook:** predict · alegere din 3 · "You risk 1% with a stop 2 ATR away. LXC, the synthetic coin, has a daily ATR of 4% of price; LABX's is 1.5%. Compared with a LABX trade, your LXC position value should be…"
  - `a` "About the same"
  - `b` "About 2.7 times smaller" ✓
  - `c` "Bigger"
- **Interacțiunea centrală:**
  - `worked` cu input: cont 10,000, risc 100. LXC la 30,000, ATR 1,200 → stop 2,400 → 0.0417 monede, adică 1,250 vUSD. LABX la 100, ATR 1.5 → stop 3.00 → 33 de unități, adică 3,300 vUSD. Raportul ≈ 2.6–2.7.
  - `explain`: piața merge 24/7/365, fără licitație de închidere; weekendurile sunt subțiri. Volatilitatea realizată a BTC a fost istoric ~50–80% pe an, față de ~15–20% la S&P 500 [PK, verify]; 4% pe zi × √365 ≈ 76% pe an. În vânzările masive, corelațiile urcă spre 1. Venue-urile sunt fragmentate, iar pe cele nereglementate există volum fals [PK].
  - `figure`, custodia (Flow, 3 pași): soldul ținut pe exchange → venue-ul cade → retragerile se blochează. FTX, noiembrie 2022: ~6 miliarde de dolari retrași în 72 de ore, faliment pe 11 noiembrie 2022, o gaură de ~8 miliarde, depozitele clienților împrumutate firmei afiliate Alameda. SIPC nu acoperă crypto care nu e security. Self-custody mută riscul pe păstrarea cheilor.
  - `match`, eveniment ↔ tipul de risc: de-peg de stablecoin (UST 2022, USDC pentru scurt timp în 2023 [PK]); token unlock; hack la un exchange; titlu de reglementare.
  - `callout`, reglementarea: MiCA în UE [PK]; CFD-urile crypto pentru retail în UE sunt plafonate la 2:1; ETF-uri spot pe BTC și ETH în SUA din 2024 [PK]. Fundamentalele on-chain sunt zgomotoase (R4 §5.14). Boții de grid și martingale, promovați intens în crypto, sunt F (1.8).
- **Try:** widget `custody-sim` (nou; S10 + S20).
  - Start: 10,000 vUSD în crypto sintetic, pe patru venue-uri și un portofel propriu.
  - Obiectiv: "Hold 10,000 vUSD of synthetic crypto across venues. Set per-venue limits so a single venue failure costs at most 25% of your holdings."
  - Reușită: ponderea maximă pe un venue ≤ 25%. Recap-ul rulează căderea unui venue ales aleator.
  - Indicii: 1. "Counterparty risk is per venue." 2. "Self-custody removes venue risk and adds key risk."
- **Practică:** drill-ul de weekend: o piață 24/7, cu weekend subțire și o cascadă duminică la 03:00. Utilizatorul scrie și respectă o regulă de expunere în weekend (de exemplu, un plafon de heat).
- **Check:**
  - q1 numeric d1: anualizarea unei volatilități zilnice de 4% pe 365 de zile (≈ 76%; `vary`).
  - q2 mcq d2: ce acoperă SIPC.
  - q3 mcq d3: săptămâna viitoare are loc un token unlock de 8% din float. Ce planifici: e un eveniment de ofertă programat; reduci mărimea sau stai flat și urmărești funding-ul și open interest-ul.
- **Dovezi:** Mechanic (R6 §3.6; cifrele de volatilitate [PK, verify]). Fundamentalele on-chain ca semnal: C/D (R4 §5.14 [BK]).
- **Necesită:** S10 (crypto spot), S5 (24/7, weekend), S20 (căderea unui venue)
- **Termeni noi de glosar:** stablecoin, de-peg, self-custody, token-unlock, counterparty-risk

#### 3.14.6 · Perpetual swaps and funding
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Derivatives)
- **Obiective:**
  1. Explain how funding payments keep a perpetual swap near its spot index.
  2. Compute the funding paid or received per interval and per year.
  3. Read persistently positive funding as crowded longs: a condition, not a signal.
- **Concepte:** perpetual-swap (nou), funding-rate (nou)
- **Se sprijină pe:** 3.14.1, 3.14.5, 3.9.1
- **Hook:** predict · alegere din 4 · "You hold a 100,000 vUSD long in the LXC perpetual. Funding for this 8-hour interval is +0.03%. Who pays whom, and how much?"
  - `a` "You receive 30 vUSD"
  - `b` "You pay 30 vUSD to the shorts" ✓
  - `c` "You pay 300 vUSD"
  - `d` "Nobody pays"
- **Interacțiunea centrală:**
  - `explain`: un perpetual nu expiră; funding-ul îl ține aproape de indicele spot. Se plătește la 8 ore (unele venue-uri: la 1 sau 4 ore). Funding pozitiv înseamnă că long-urile plătesc short-urilor. Formula de tip Binance (dintr-o descriere terță): rata de funding = media premium index + clamp(dobânda − premium, −0.05%, +0.05%), cu dobânda fixată la 0.01% la 8 ore.
  - `worked` cu input: 0.01% la 8 ore × 3 × 365 = 10.95% pe an. Un long cu levier 5×, 50,000 expunere pe 10,000 marjă, ținut 30 de zile la 0.01% la 8 ore, plătește 450 vUSD, adică 4.5% din marjă.
  - `figure`, mark price vs last price (Line, 3 pași): un fitil pe ultimul preț; mark price-ul, calculat din indice, se mișcă mai puțin; lichidarea folosește mark price-ul.
  - `explain`: funding-ul ca poziționare. Un funding pozitiv persistent înseamnă long-uri aglomerate (R4 §7.8); e o stare, nu un trăgaci (3.9.1). He, Manela, Ross & von Wachter: abaterile perpetual-urilor de la prețul fără arbitraj sunt mai mari decât în FX, se mișcă împreună pe toate monedele și s-au micșorat în timp. Baza ca formă de carry: 3.13.3.
- **Try:** widget `perp-ticket` (nou; S10 + R10).
  - Start: marjă 10,000, expunere 30,000 (3×), funding +0.01% la 8 ore.
  - Obiectiv: "Hold a 3× long LXC perpetual for 14 days. Before you confirm, enter the total funding you expect at the shown rate."
  - Reușită: 126 vUSD (±1).
  - Indicii: 1. "Funding is charged on the position value, not on your margin." 2. "Three intervals a day."
- **Practică:** drill-ul de perpetual în R10: debit de funding la fiecare 8 ore; rata se schimbă cu prima; utilizatorul alege isolated sau cross margin (3.14.7).
- **Check:**
  - q1 numeric d1: funding-ul pe un interval (`vary`).
  - q2 mcq d2: ce înseamnă un funding pozitiv persistent.
  - q3 mcq d3: funding-ul trece la −0.05% la 8 ore. Ce se întâmplă cu un basis trade long spot + short perpetual: acum plătește.
- **Dovezi:** Mechanic (R6 §3.6; formula, dintr-o descriere terță). Funding-ul ca sentiment: C (R4 §7.8 [BK]). Arbitrajul pe bază: B (R6 §3.6).
- **Necesită:** S10 (perpetuals, funding), R10
- **Termeni noi de glosar:** perpetual-swap, funding-rate, mark-price, premium-index

#### 3.14.7 · Leverage, liquidation and cascades
- **Nivel / durată / tip:** Advanced · 8 min · Electivă (Derivatives)
- **Obiective:**
  1. Compute an approximate liquidation price for an isolated long from leverage and maintenance margin.
  2. Place the stop well inside the liquidation price and let leverage set margin, not risk.
  3. Explain liquidation cascades, insurance funds and auto-deleveraging, and why cross margin spreads the damage.
- **Concepte:** liquidation-price (nou), liquidation-cascade (nou), leverage ✓
- **Se sprijină pe:** 3.14.6, 2.14 (margin close-out), 1.4 (levier)
- **Hook:** predict · slider 20,000–30,000, pas 50 · "Long LXC at 30,000 with 10× isolated leverage. Maintenance margin is 0.5%. Roughly where are you liquidated?" Răspuns: ≈ 27,150 (−9.5%).
- **Interacțiunea centrală:**
  - `worked` cu input, prețul de lichidare ≈ entry × (1 − 1 ÷ L + MMR) (aproximare; formulele diferă de la venue la venue [BK]): la 10× → 27,150 (−9.5%); la 25× → 28,950 (−3.5%); la 50× → 29,550 (−1.5%).
  - `worked`, procesul: întâi stop-ul → mărimea din stop → levierul stabilește doar marja → verifici că lichidarea e cel puțin de două ori mai departe decât stop-ul (regulă de design). Exemplu: cont 10,000, risc 100, stop la 3% (29,100), deci expunere 3,333. La 10×, marja e 333 și lichidarea e la −9.5%, mult dincolo de stop. La 25×, marja e 133 și lichidarea e la 28,950, doar cu 0.5% sub stop: un fitil pe mark price te poate lichida înainte ca stop-ul să se execute, plus comisionul de lichidare.
  - `explain`: isolated vs cross margin; fondul de asigurare; auto-deleveraging (ADL). Cascadele: 10–11 octombrie 2025 e raportată drept cea mai mare zi de lichidări (~19 miliarde de dolari), cu ADL pe scară largă [PK, verify].
  - `callout`: levierul multiplică volatilitatea, nu edge-ul. Mișcarea contului în % = mișcarea prețului în % × levierul efectiv; la 20×, o mișcare de 5% golește contul (R6 §4.5). În UE, CFD-urile crypto pentru retail sunt plafonate la 2:1.
- **Try:** widget `liq-calculator` (nou; S11 + R10).
  - Start: LXC la 30,000, cont 10,000, risc 1%, stop 3%, MMR 0.5%.
  - Obiectiv: "Open a long with a 3% stop and 1% risk. Choose leverage so the liquidation price sits at least twice as far away as your stop."
  - Reușită: distanța până la lichidare ≥ 6%, deci L ≤ 15× (1 ÷ L − 0.5% ≥ 6%).
  - Indicii: 1. "Leverage changes the margin, not the risk set by your stop." 2. "Liquidation distance ≈ 1 ÷ leverage − maintenance margin."
- **Practică:** R10 cu o cascadă. Înainte de confirmarea fiecărui ordin, utilizatorul trebuie să spună prețul de lichidare (drill-ul din R6 §3.6). Scor: conștientizarea lichidării, supraviețuirea, funding-ul plătit.
- **Check:**
  - q1 numeric d2: prețul de lichidare (entry 2,000, 20×, MMR 0.5% → 1,910; `vary`).
  - q2 mcq d2: isolated vs cross margin.
  - q3 mcq d3: ADL ți-a închis un short profitabil. De ce.
- **Dovezi:** Mechanic (R5 RF-19 [BK]; R6 §3.6, §4.5).
- **Necesită:** S11 (lichidare, mark price), S10, S20 (cascadă), R10
- **Termeni noi de glosar:** liquidation-price, isolated-margin, cross-margin, insurance-fund, auto-deleveraging

#### 3.14.8 · Bonds and rates for traders
- **Nivel / durată / tip:** Advanced · 7 min · Electivă (Derivatives)
- **Obiective:**
  1. Explain the inverse price–yield link and estimate a price change from duration.
  2. Compute a position's DV01 and its P&L from a yield move in basis points.
  3. Trace how one rate surprise reaches carry, CFD funding, futures fair value and equity valuations.
- **Concepte:** bond-duration (nou), dv01 (nou)
- **Se sprijină pe:** 3.6 (dobânzi, curba randamentelor), 3.14.1
- **Hook:** predict · slider −20% … +20%, pas 0.5 · "A synthetic 10-year note has a duration of 8.95. Yields rise one percentage point. Its price moves by about…" Răspuns: ≈ −8.95%.
- **Interacțiunea centrală:**
  - `explain`: cupoanele; prețul și randamentul se mișcă invers; duration (exemplul CME: o notă pe 10 ani cu duration 8.95 scade ~8.95% când randamentele cresc cu 1 pp); convexitatea (relația nu e liniară).
  - `worked` cu input, DV01: valoare nominală 1,000,000, duration 8.95 → DV01 ≈ 8.95 × 1,000,000 × 0.0001 = 895 pe punct de bază. O surpriză de 25 bp → −22,375. Tabelul CME: ~$37 la $1M pentru 2 ani vs ~$289 pentru Ultra pe 30 de ani [verify].
  - `match`, instrumente ↔ caracteristică: Treasury futures (urmăresc obligațiunea cheapest-to-deliver, deci DV01 se mișcă); CME yield futures (DV01 fix de $10); SOFR futures (așteptările pentru dobânda pe termen scurt [PK]); ETF-uri de obligațiuni; Bund, Bobl, Schatz [PK].
  - `figure` (Flow, 4 pași): o surpriză CPI → dobânzile cresc → se schimbă carry-ul și swap-ul în FX (3.13.3), funding-ul CFD (2.14), prețul corect al futures (3.14.3), evaluarea acțiunilor (3.8.3) și prețul opțiunilor (4.1).
  - `callout`: tranzacțiile pe curbă ponderate cu DV01 (2s10s) sunt de nivel Advanced → Expert. Curba randamentelor e la 3.6.
- **Try:** widget `dv01-desk` (nou; S10).
  - Start: 3 contracte LXN (DV01 80 vUSD fiecare), cont 100,000 vUSD.
  - Obiectiv: "You hold 3 LXN contracts (DV01 80 vUSD each) on a 100,000 vUSD account. Cut the position so a 10 bp surprise costs at most 1% of the account."
  - Reușită: 1 contract (80 × 10 = 800 ≤ 1,000; cu 2 contracte, 1,600).
  - Indicii: 1. "Loss = DV01 × basis points × contracts." 2. "1% of 100,000 is 1,000."
- **Practică:** drill-ul de șoc pe dobânzi: o surpriză CPI mișcă diferit randamentele pe 2 și pe 10 ani; P&L-ul se calculează din DV01 pe fiecare picior. Apoi predicția reacțiilor pe alte active (reluare din 3.6).
- **Check:**
  - q1 numeric d2: variația prețului din duration (duration 4.5, +0.5 pp → −2.25%; `vary`).
  - q2 numeric d2: P&L-ul din DV01 (`vary`).
  - q3 mcq d3: de ce contează dobânzile chiar dacă tranzacționezi doar acțiuni.
- **Dovezi:** Mechanic (R6 §3.7; exemplele CME [verify on CME]).
- **Necesită:** S10 (obligațiuni și futures pe dobânzi sintetice), S6 (surpriza CPI)
- **Termeni noi de glosar:** yield, duration, dv01, convexity

---
## Capstone 3 · Design, validate, survive

**Fișa capstone-ului**
- **Scop:** utilizatorul proiectează un sistem documentat, îl validează în strategy lab cu checklist-ul complet și îl rulează înainte, pe date nevăzute, printr-un drawdown forțat. Se notează **doar procesul**: calitatea cercetării, rigoarea validării, designul riscului, execuția în drawdown și recenzia. Este etapa de trecere 3 → 4 din README §5.
- **Durată:** ≈ 3 ore active, întinse pe 1–2 săptămâni (faza C3.5 are 60 de trade-uri).
- **Cere de dinainte:** 3.10–3.12 (core). Recomandat: cel puțin o unitate de strategie (3.13 sau 3.8/3.9) și, pentru futures sau perpetuals, 3.14. Contul de incubare din 3.11.10 poate fi folosit ca punct de plecare.
- **Mediul:** „Capstone universe”, cu 8 instrumente sintetice și etichete ascunse:
  - 2 futures cu trend persistent (R1 cu volatilitate R3);
  - 1 instrument cu mean reversion (R2);
  - 1 pereche cointegrată (R7);
  - 1 instrument de carry (R8);
  - 1 instrument cu drift de turn-of-month (R13);
  - 2 controale R0 (random walk pur).

  Datele acoperă 12 ani sintetici. Anii 1–8 sunt pentru cercetare (in-sample și out-of-sample sunt în interiorul lor). Anii 9–12 sunt ascunși și se folosesc doar în C3.5. Costurile urmează convențiile fiecărui instrument.
- **Surse:** README §5; R5 §10 (Level 3, gate), BT-10…BT-21, BT-25, PL-02, PL-14, PM-17, PSY-32, PSY-34, PSY-36, RR-07; R6 §7 (Stage 4, gate); R1 §3.2 punctul 4 (capstone-ul de integrare).

### Fazele

**C3.1 · Research brief.** O intrare în jurnalul de cercetare, completată înaintea oricărui backtest (S13 blochează testul fără ea):
- ipoteza după șablonul din 3.11.1;
- cine e de partea cealaltă și de ce;
- priorul (3.10.4), cu justificare;
- regimul și instrumentul vizate;
- premortem-ul v0: trei motive pentru care ideea ar putea fi falsă.

**C3.2 · Rules and data.**
- Regulile sunt construite în rule builder, cu zero semnalări.
- Testarea se face în R, cu mărime fixă de 1R (sizing-ul vine în C3.4).
- Execuțiile sunt conservatoare (3.11.2), modelul de costuri e complet, datele sunt ajustate.
- Cel mult 5 parametri optimizați (3.11.5).
- Controlul R0 e atașat automat.

**C3.3 · Validation checklist.** Opt puncte, fiecare cu o regulă de trecere scrisă dinainte:

| # | Verificare | Regula de trecere | Lecția |
|---|---|---|---|
| 1 | In-sample / out-of-sample | Împărțire 70/30 în ordine cronologică; OOS deblocat o singură dată; orice deblocare în plus e înregistrată ca încercare | 3.11.4 |
| 2 | Semnificația OOS | ≥ 40 de trade-uri OOS (adunate pe instrumente, dacă e nevoie). t-statistic-ul expectancy nete în R depășește un prag care crește cu numărul de încercări din jurnal: ≤ 5 încercări → 2.0; 6–20 → 2.5; > 20 → 3.0 (după logica haircut-ului Harvey & Liu, R5 BT-17) | 3.10.5, 3.10.6 |
| 3 | Walk-forward | ≥ 5 ferestre; WFE ≥ 0.5; parametrii la ±25% de mediana lor în cel puțin 4 din 5 ferestre | 3.11.6 |
| 4 | Monte Carlo | 1,000 de drumuri bootstrap pe trade-urile OOS; percentila 95 a drawdown-ului fixează treapta de drawdown, percentila 99 fixează kill switch-ul | 3.11.7 |
| 5 | Stres pe costuri | Expectancy netă > 0 la costuri dublate; multiplul de break-even ≥ 2 | 3.11.2 |
| 6 | Robustețe | Parametrii aleși pe un platou (vecinătatea ≥ 80% din valoarea lor); bateria de stres trecută în cel puțin 4 din 5 teste | 3.11.8 |
| 7 | Benchmark aleator | Percentila ≥ 90 între 1,000 de gemeni cu intrări aleatoare. Pentru un sistem de carry sau de drift, unde testul nu se aplică, utilizatorul documentează de ce și compară cu benchmark ghost-ul | 3.11.9 |
| 8 | Controlul R0 | Aceleași reguli pe instrumentele R0 dau o expectancy netă al cărei interval de încredere include zero. Dacă R0 „trece”, există o scurgere de informație, iar checklist-ul e picat până când e găsită | 3.11.5 |

Respingerea unei ipoteze e un rezultat valid și rămâne în jurnal. Pragul de la punctul 2 crește cu numărul de încercări, deci zece încercări grăbite costă mai mult decât trei gândite. Dacă după trei ipoteze nu trece nimic, aplicația propune laboratorul „Strategy zoo” (3.13) ca sursă de ipoteze, fără să dezvăluie etichetele instrumentelor.

**C3.4 · Sizing and plan.**
- Riscul pe trade = minimul dintre: 1%, ¼ Kelly calculat din estimările OOS (3.12.4) și riscul la care probabilitatea Monte Carlo a unui drawdown de 30% rămâne sub 1% (3.12.5).
- Treptele de drawdown și kill switch-ul vin din C3.3, punctul 4.
- Plafonul de heat (2.11) și limitele zilnice și săptămânale sunt scrise în plan și aplicate de simulator.
- Cardul de go-live (3.11.10) e completat, inclusiv premortem-ul final, cu cel puțin 5 motive, fiecare legat de o verificare.
- Clauza de guvernare a regulilor e scrisă. Planul v1 se blochează și primește o versiune.

**C3.5 · Forward run with a forced drawdown.** 60 de trade-uri pe anii 9–12, nevăzuți, din aceleași familii de generatoare.
- **Pregătirea (practică deliberată, R5 PSY-32):** înainte de start, aplicația propune o coadă de drill-uri construită din etichetele de eroare ale utilizatorului. Exemplu: 30 de repetări de „execută semnalul următor după 3 pierderi la rând”, în replay.
- **Drawdown-ul forțat:** între trade-urile 15 și 35, motorul injectează o serie de semnale pierzătoare cu adâncimea egală cu percentila 95 din Monte Carlo-ul propriu al utilizatorului (de exemplu 13R). Una din două variante ascunse e aleasă aleator:
  - **Varianta A, „Variance”:** după drawdown, edge-ul continuă (regimul rămâne același). Procesul corect: continui să execuți după plan și aplici treptele de drawdown.
  - **Varianta B, „Breakage”:** instrumentul trece în R0 (edge-ul dispare), iar drawdown-ul continuă dincolo de percentila 99. Procesul corect: declanșezi kill switch-ul exact cum e scris, apoi faci recenzia.

  Utilizatorul nu știe ce variantă are; doar procesul corect funcționează în ambele.
- **KPI-urile de proces** în C3.5, calculate de S14 și S15 (R5 PM-17):

  | KPI | Țintă |
  |---|---|
  | Plan adherence (trade-uri conforme cu regulile ÷ toate trade-urile) | ≥ 90% |
  | Rata de execuție a semnalelor în fereastra de drawdown (fără „trading scared”, R5 PSY-34) | ≥ 90% |
  | Risk accuracy | ≥ 90% |
  | Stop integrity (stop la intrare, niciodată lărgit) | 100% |
  | Respectarea limitelor (zilnice, săptămânale, heat) | 100% |
  | Treptele de drawdown aplicate exact cum sunt scrise | da |
  | Kill switch: în varianta B, declanșat la prag (±1 trade); în varianta A, nedeclanșat | da |
  | Schimbări de reguli ad-hoc (orice propunere trece prin guvernare și nu se aplică în timpul rulării) | 0 |
  | Semnale de comportament: revenge, martingale (mărime crescută după pierdere), tilt | 0 |
  | Journal completeness | ≥ 90% |

**C3.6 · Review and report.**
- raportul de validare (checklist-ul cu dovezile lui) și jurnalul de cercetare, cu numărul de încercări;
- rezultatele înainte, cu coridorul suprapus (doar diagnostic: interval de încredere și benchmark ghost);
- clasificarea „mistake vs variance” (1.6) pentru fiecare trade din drawdown;
- premortem-ul revăzut: care motive s-au întâmplat;
- propunerile de schimbare de reguli, cu planul de dovezi necesar (3.11.10);
- instrumentul de decizie „Should I trade this live?” (R5 RR-07), care poate răspunde „nu”.

### Scorul (doar proces, 100 de puncte)

| Bloc | Puncte | Ce se notează |
|---|---|---|
| Igiena cercetării | 20 | brief-ul înaintea testului (5); încercările înregistrate și raportate (5); o singură deblocare OOS (5); controlul R0 rulat (5) |
| Rigoarea validării | 25 | cele 8 puncte ale checklist-ului rulate și interpretate corect (3 × 8 = 24); ordinea corectă (1) |
| Sizing și plan | 15 | riscul ≤ plafon (5); treptele de drawdown și kill switch-ul derivate din Monte Carlo (5); cardul de go-live și premortem-ul (5) |
| Execuția în drawdown | 30 | plan adherence (6); rata de execuție a semnalelor (6); risk accuracy (4); stop integrity (4); limite și trepte (4); kill switch-ul tratat corect (6) |
| Recenzia | 10 | clasificarea mistake vs variance (4); premortem-ul revăzut (3); propunerile de guvernare (3) |

**Nu se notează:** P&L-ul, capitalul final, Sharpe-ul rulării înainte, numărul de trade-uri câștigătoare. Ele apar în raport doar ca diagnostic, cu interval de încredere și cu benchmark ghost-ul.

### Criteriile de trecere
1. Scor total ≥ 80 și fiecare bloc ≥ 60% din punctele lui.
2. **Porți obligatorii** (dacă una pică, capstone-ul nu e trecut, indiferent de scor):
   - un sistem a trecut toate cele 8 puncte din C3.3;
   - jurnalul de cercetare există și raportează numărul de încercări;
   - nicio deblocare OOS neînregistrată;
   - stop integrity 100% și zero depășiri de limite în C3.5;
   - rata de execuție a semnalelor în fereastra de drawdown ≥ 90%;
   - kill switch-ul tratat conform propriului card.
3. Exemple: un utilizator din varianta B care termină pe pierdere, dar declanșează corect kill switch-ul, trece. Un utilizator din varianta A care abandonează sistemul în drawdown-ul normal pică blocul de execuție și poarta de execuție a semnalelor, chiar dacă a evitat pierderi.

**La trecere:** se acordă Nivelul 4 și insigna etapei (README §5). Sistemul validat și jurnalul de cercetare devin input pentru 4.3 (validare profesională: deflated Sharpe, PBO, MinBTL) și 4.6 (pipeline-ul personal).

**Necesită:** S7, S9, S10 (dacă sistemul folosește futures sau perpetuals), S13 (toate modulele: rule builder, OOS încuiat, walk-forward, Monte Carlo, baterie de stres, gemeni aleatori, contor de încercări), S14, S15, S18 (aplicarea limitelor și a treptelor).

---

## Widget-uri și laboratoare noi

Toate sunt noi. Multe sunt moduri ale strategy lab-ului (S13), deci se construiesc o singură dată și se configurează din conținut.

| Tip | Widget-uri | Lecții | Capabilități |
|---|---|---|---|
| Moduri ale strategy lab-ului | `rule-builder`, `fill-toggle`, `bug-hunt`, `oos-vault`, `monkey-lab`, `walk-forward-viz`, `mc-fan`, `stress-battery`, `random-twins`, `go-live-gate` | 3.11.1–3.11.10 | S13, S7, S15 |
| | `sizing-replay`, `equity-filter` | 3.12.2, 3.12.7 | S13 |
| | `sue-portfolio`, `event-study`, `momentum-ranker`, `turtle-desk`, `carry-leverage-mc`, `pair-lab`, `decay-sim` | 3.8.8, 3.13.1–3.13.7 | S13, S9, S10, S16 |
| | `sentiment-signal-lab`, `seasonality-lab`, `p-hacking-arcade` | 3.9.1, 3.9.5, 3.9.6, 3.10.6, 3.13.4 | S13, S17, S7 |
| Laboratoare de companie și eveniment | `statement-builder`, `ratio-detective`, `multiple-ranker`, `dcf-slider`, `earnings-sim`, `reaction-matrix`, `straddle-pricer`, `corp-action-lab` | 3.8.1–3.8.7, 3.8.9 | S16, S6, S12 parțial |
| Sentiment | `cot-index`, `vix-range`, `squeeze-lab` | 3.9.2–3.9.4 | S17 |
| Calculatoare statistice | `distribution-lab`, `vol-cone`, `rookie-of-the-year`, `bayes-tree`, `is-it-luck`, `runs-test` | 3.10.1–3.10.5, 3.10.7 | S7, S15 |
| Calculatoare de sizing | `drag-sliders`, `kelly-curve`, `twr-curve`, `ror-lab`, `vol-target-knob` | 3.12.1, 3.12.3–3.12.6 | S7, S9 |
| Instrumente | `tick-converter`, `roll-desk`, `curve-lab`, `report-day`, `custody-sim`, `perp-ticket`, `liq-calculator`, `dv01-desk` | 3.14.1–3.14.8 | S10, S11, S20 |
| Conținut static | `paper-reader` | 3.13.8 | — |

## Sumar

| Unitate | Lecții | Concepte noi | Termeni noi de glosar |
|---|---|---|---|
| 3.8 Company fundamentals and earnings | 9 | 15 | 43 |
| 3.9 Sentiment, positioning and seasonality | 6 | 8 | 21 |
| 3.10 Statistics for traders | 7 | 12 | 27 |
| 3.11 Backtesting and system design | 10 | 20 | 36 |
| 3.12 Position sizing theory | 7 | 9 | 20 |
| 3.13 Systematic strategies and evidence | 8 | 11 | 26 |
| 3.14 Instruments II | 8 | 15 | 38 |
| **Total** | **55** + Capstone 3 | **90** | **211** |

## Registru de concepte noi

Definițiile sunt în engleză, ca în `concepts.ts`.

| Id | Name | Definition | Unitate |
|---|---|---|---|
| financial-statements | Financial statements | The income statement, balance sheet and cash-flow statement, linked through net income. | 3.8 |
| free-cash-flow | Free cash flow | Operating cash flow minus capital spending: the cash a business generates after investing in itself. | 3.8 |
| earnings-quality | Earnings quality | How well reported earnings reflect cash and repeatable results, net of adjustments, dilution and buyback effects. | 3.8 |
| valuation-multiples | Valuation multiples | Ratios such as P/E and EV/EBITDA that relate price or enterprise value to a company's fundamentals. | 3.8 |
| equity-duration | Equity duration | How sensitive a stock's value is to discount-rate changes; higher when cash flows lie further in the future. | 3.8 |
| discounted-cash-flow | Discounted cash flow | Valuing an asset as the present value of its expected future cash flows plus a terminal value. | 3.8 |
| implied-expectations | Implied expectations | The growth or outcome that today's price assumes, found by running a valuation model in reverse. | 3.8 |
| earnings-surprise | Earnings surprise | The gap between reported results and expectations; its size and the guidance matter more than a beat itself. | 3.8 |
| earnings-guidance | Earnings guidance | Management's outlook for future results; changes in it often move price more than the quarter's numbers. | 3.8 |
| implied-move | Implied move | The move the options market prices for an event, roughly the at-the-money straddle price divided by the share price. | 3.8 |
| iv-crush | IV crush | The fall in implied volatility once an event's uncertainty is resolved, which lowers option prices. | 3.8 |
| post-earnings-drift | Post-earnings announcement drift | Prices tending to keep moving in the direction of an earnings surprise for weeks; much weaker since publication. | 3.8 |
| anomaly-decay | Anomaly decay | The shrinking of a published return pattern out of sample and after publication, as traders learn and costs bite. | 3.8 |
| adjusted-price-data | Adjusted price data | Price history corrected for splits, dividends or contract rolls so charts and backtests show no artificial gaps. | 3.8 |
| market-sentiment | Market sentiment | How one-sided expectations are; a condition that shifts reversal odds, not a timing trigger. | 3.9 |
| contrarian-signal | Contrarian signal | A rule that leans against a sentiment or positioning extreme, best combined with a price confirmation. | 3.9 |
| commitments-of-traders | Commitments of Traders | The weekly CFTC report of futures positions by trader category, measured on Tuesday and published on Friday. | 3.9 |
| positioning | Positioning | Who holds what and how forced their flows are; crowded positions amplify moves when they unwind. | 3.9 |
| vix | VIX | An index of the 30-day volatility priced into S&P 500 options; a measure of priced fear, not a forecast of direction. | 3.9 |
| put-call-ratio | Put/call ratio | Put volume divided by call volume, read against its own shifting baseline and mostly at extremes. | 3.9 |
| short-squeeze | Short squeeze | A sharp rise driven by short sellers forced to buy back, often far larger than the news that started it. | 3.9 |
| calendar-effects | Calendar effects | Return patterns tied to dates, such as the turn of the month or seasons, each with its own evidence grade and decay record. | 3.9 |
| return-distribution | Return distribution | The full shape of outcomes (mean, median, spread, skew and tails), not just the average. | 3.10 |
| fat-tails | Fat tails | Extreme moves that occur far more often than a normal distribution predicts. | 3.10 |
| skewness | Skewness | Asymmetry of outcomes: positive skew means rare large wins, negative skew means rare large losses. | 3.10 |
| square-root-of-time | Square-root-of-time scaling | Volatility grows with the square root of the horizon when returns are independent. | 3.10 |
| volatility-clustering | Volatility clustering | Calm and turbulent periods come in runs; large moves tend to follow large moves. | 3.10 |
| bayesian-updating | Bayesian updating | Combining a base rate with new evidence to get the probability that a hypothesis is true. | 3.10 |
| statistical-significance | Statistical significance | Whether a result, such as mean R, is distinguishable from zero given its sample size and variability. | 3.10 |
| sharpe-ratio | Sharpe ratio | Excess return per unit of volatility, meaningful only together with its standard error and sample length. | 3.10 |
| multiple-testing | Multiple testing | Running many tests makes some look significant by chance, so thresholds must account for every trial. | 3.10 |
| spurious-correlation | Spurious correlation | A correlation that appears by chance or through a shared trend and vanishes on new data. | 3.10 |
| autocorrelation | Autocorrelation | Dependence of a value on earlier values; its sign separates trending, mean-reverting and random series. | 3.10 |
| edge-hypothesis | Edge hypothesis | A falsifiable statement of why a pattern should pay, under which conditions, and who is on the other side. | 3.11 |
| codified-rules | Codified rules | Rules precise enough that two people, or a program, produce identical trades from the same data. | 3.11 |
| research-log | Research log | An immutable record of every hypothesis, test and parameter change, including the number of trials. | 3.11 |
| fill-assumptions | Fill assumptions | The rules a backtest uses to turn signals into executions; conservative choices avoid flattering results. | 3.11 |
| breakeven-cost | Breakeven cost | The trading cost at which a strategy's net expectancy falls to zero. | 3.11 |
| look-ahead-bias | Look-ahead bias | Using information in a backtest that was not available at the moment of the decision. | 3.11 |
| in-sample-out-of-sample | In-sample / out-of-sample | Developing rules on one part of the data and testing them once on an untouched later part. | 3.11 |
| overfitting | Overfitting | Fitting rules to the noise of one sample so that results collapse on new data. | 3.11 |
| data-snooping | Data snooping | Reusing the same data for many tests or tweaks until something looks good by chance. | 3.11 |
| walk-forward-analysis | Walk-forward analysis | Repeatedly optimising on one window and testing on the next unseen one, then joining the test segments. | 3.11 |
| monte-carlo-resampling | Monte Carlo resampling | Reshuffling or bootstrapping a trade list to see the range of drawdowns and outcomes it could produce. | 3.11 |
| expectation-corridor | Expectation corridor | The band of results a validated system should produce by chance alone, used to tell variance from breakage. | 3.11 |
| robustness-testing | Robustness testing | Checking that results survive perturbations such as higher costs, added noise, other markets and missing best trades. | 3.11 |
| parameter-plateau | Parameter plateau | A broad region of parameter values with similar results, preferred over an isolated peak. | 3.11 |
| random-entry-benchmark | Random-entry benchmark | Many twins of a strategy with random entries and the same exits, used to measure what the entry adds. | 3.11 |
| edge-ratio | Edge ratio | Average favourable excursion divided by average adverse excursion after entry; random entries score about 1. | 3.11 |
| incubation | Incubation | Forward-testing a validated system at small size before scaling, with gates based on statistics and process. | 3.11 |
| kill-switch | Kill switch | A pre-written condition that stops a system when its results fall outside what variance can explain. | 3.11 |
| premortem | Premortem | Imagining that a plan has already failed and listing the reasons, before committing to it. | 3.11 |
| volatility-drag | Volatility drag | The gap between average and compound returns caused by swings, roughly σ²/2 per period. | 3.12 |
| time-vs-ensemble-average | Time vs ensemble average | A trader lives one path over time; the typical path can sit far below the average across many traders. | 3.12 |
| fixed-ratio-sizing | Fixed-ratio sizing | Adding one contract each time profit grows by a set multiple of a delta, so size grows more slowly. | 3.12 |
| kelly-criterion | Kelly criterion | The bet fraction that maximises long-run growth for a known edge; a ceiling, not a target. | 3.12 |
| fractional-kelly | Fractional Kelly | Betting a fraction of Kelly to cut drawdowns and to protect against an overestimated edge. | 3.12 |
| optimal-f | Optimal f | The fixed fraction that would have maximised terminal wealth over a past trade list, scaled by its largest loss. | 3.12 |
| risk-of-ruin | Risk of ruin | The probability that losses reach the drawdown at which you would stop trading. | 3.12 |
| volatility-targeting | Volatility targeting | Scaling exposure so expected volatility matches a set budget as volatility changes. | 3.12 |
| equity-curve-filter | Equity-curve filter | Pausing a system while its equity is below its own moving average, while still tracking shadow trades. | 3.12 |
| time-series-momentum | Time-series momentum | Going long assets whose own past returns were positive and short those whose past returns were negative. | 3.13 |
| cross-sectional-momentum | Cross-sectional momentum | Buying recent relative winners and selling relative losers within a universe. | 3.13 |
| momentum-crash | Momentum crash | A sudden large loss for momentum strategies when beaten-down losers rebound sharply after a panic. | 3.13 |
| carry | Carry | The return from holding an asset if prices do not move, such as a rate differential, roll yield or funding; prone to crashes. | 3.13 |
| false-discovery-rate | False discovery rate | The share of flagged discoveries that are false. | 3.13 |
| pairs-trading | Pairs trading | Trading the spread between two related instruments in the expectation that it reverts. | 3.13 |
| cointegration | Cointegration | A relationship in which a combination of two series stays stationary even though each one wanders. | 3.13 |
| structural-break | Structural break | A lasting change that ends a previously stable relationship. | 3.13 |
| event-study | Event study | Measuring the average abnormal return around many similar events, with a confidence band. | 3.13 |
| strategy-crowding | Strategy crowding | Many traders holding the same strategy, which shrinks its edge and makes losses arrive together. | 3.13 |
| evidence-appraisal | Evidence appraisal | Grading a strategy claim by its sample, costs, trials, out-of-sample tests, replication and mechanism. | 3.13 |
| futures-contract | Futures contract | A standardised, exchange-cleared agreement to buy or sell an underlying at a future date. | 3.14 |
| mark-to-market | Mark-to-market | Daily settlement of futures gains and losses in cash, through variation margin. | 3.14 |
| contract-roll | Contract roll | Closing an expiring futures contract and opening the next one, usually as one calendar-spread order. | 3.14 |
| continuous-contract | Continuous contract | A long price series stitched from successive futures contracts and adjusted for roll gaps. | 3.14 |
| term-structure | Term structure | The curve of futures prices across expiries, in contango or in backwardation. | 3.14 |
| roll-yield | Roll yield | The gain or loss from rolling futures as they converge to spot, even when spot does not move. | 3.14 |
| commodity-drivers | Commodity drivers | Supply shocks, storage, inventories and scheduled reports that move commodity prices. | 3.14 |
| crypto-market-structure | Crypto market structure | A 24/7 market with fragmented venues, thin weekends, no closing auction and very high volatility. | 3.14 |
| counterparty-risk | Counterparty risk | The risk that the venue, broker or custodian holding your assets fails or freezes them. | 3.14 |
| perpetual-swap | Perpetual swap | A futures-like contract with no expiry, kept near spot by periodic funding payments. | 3.14 |
| funding-rate | Funding rate | The periodic payment between longs and shorts in a perpetual swap; when positive, longs pay shorts. | 3.14 |
| liquidation-price | Liquidation price | The price at which a leveraged position is force-closed because margin falls below the maintenance level. | 3.14 |
| liquidation-cascade | Liquidation cascade | Forced selling that triggers more liquidations in a self-reinforcing chain. | 3.14 |
| bond-duration | Bond duration | The approximate percentage price change of a bond for a one-point change in yield. | 3.14 |
| dv01 | DV01 | The change in a position's money value for a one-basis-point move in yield. | 3.14 |

## Termeni noi de glosar

Definițiile simple (câmpul `plain`) sunt în engleză, sub 20 de cuvinte. Termenii marcați cu * pot fi introduși și de fișierele altor niveluri (vezi întrebările deschise de la final); se păstrează o singură intrare în `glossary.ts`.

| Id | Term | Plain definition | Lecția |
|---|---|---|---|
| income-statement | Income statement | Report of revenue, costs and profit over a period. | 3.8.1 |
| balance-sheet | Balance sheet | Snapshot of what a company owns, what it owes and the owners' equity on one date. | 3.8.1 |
| cash-flow-statement | Cash-flow statement | Report of cash coming in and going out from operations, investing and financing. | 3.8.1 |
| operating-cash-flow | Operating cash flow | Cash produced by the business itself after paying suppliers, staff and taxes. | 3.8.1 |
| free-cash-flow | Free cash flow | Operating cash flow minus spending on equipment: the cash left after investing. | 3.8.1 |
| capex | Capex | Money spent on long-lasting assets such as machines and buildings. | 3.8.1 |
| eps | EPS | Earnings per share: net profit divided by the number of shares. | 3.8.1 |
| adjusted-eps | Adjusted EPS | Company-defined EPS that leaves out some costs; check what was excluded. | 3.8.2 |
| dilution | Dilution | New shares shrinking each existing share's slice of the profit. | 3.8.2 |
| share-buyback | Share buyback | A company buying back its own shares, which lowers the share count. | 3.8.2 |
| roe | ROE | Return on equity: profit divided by shareholders' equity; debt can inflate it. | 3.8.2 |
| net-debt | Net debt | Total debt minus cash. | 3.8.2 |
| interest-coverage | Interest coverage | Operating profit divided by interest costs: how easily the debt is serviced. | 3.8.2 |
| pe-ratio | P/E ratio | Share price divided by earnings per share. | 3.8.3 |
| enterprise-value | Enterprise value | Market value of the shares plus net debt: the price of the whole business. | 3.8.3 |
| ev-ebitda | EV/EBITDA | Enterprise value divided by operating profit before depreciation; compares companies with different debt. | 3.8.3 |
| value-trap | Value trap | A stock that looks cheap and stays cheap, or gets cheaper. | 3.8.3 |
| discount-rate | Discount rate | The return used to convert future cash into today's value. | 3.8.3 |
| present-value | Present value | What a future amount of money is worth today. | 3.8.4 |
| dcf | DCF | Valuing a business as the present value of its future cash flows. | 3.8.4 |
| terminal-value | Terminal value | The value of all cash flows after the forecast years, often most of a DCF. | 3.8.4 |
| wacc | WACC | Weighted average cost of capital: the blended return that lenders and owners require. | 3.8.4 |
| reverse-dcf | Reverse DCF | Solving a DCF for the growth that today's price implies. | 3.8.4 |
| consensus-estimate | Consensus estimate | The average analyst forecast for a reported figure. | 3.8.5 |
| whisper-number | Whisper number | The unofficial expectation traders actually hold, often above the consensus. | 3.8.5 |
| earnings-beat | Earnings beat | Reported results above the consensus; the usual case, not news by itself. | 3.8.5 |
| extended-hours | Extended hours | Trading before the open or after the close, with thin liquidity and wider spreads. | 3.8.5 |
| estimate-revision | Estimate revision | An analyst raising or cutting a forecast. | 3.8.5 |
| guidance | Guidance | Management's own forecast for the coming results. | 3.8.6 |
| beat-and-raise | Beat and raise | Results above expectations together with higher guidance. | 3.8.6 |
| sandbagging | Sandbagging | Setting guidance low on purpose so it is easy to beat. | 3.8.6 |
| implied-volatility* | Implied volatility | The volatility the options market is pricing in. | 3.8.7 |
| straddle* | Straddle | Buying a call and a put at the same strike: a bet on a big move. | 3.8.7 |
| implied-move | Implied move | The move options price for an event: straddle price divided by share price. | 3.8.7 |
| iv-crush | IV crush | The drop in option prices after an event removes the uncertainty. | 3.8.7 |
| sue | SUE | Standardised unexpected earnings: the surprise divided by the usual size of surprises. | 3.8.8 |
| pead | PEAD | Post-earnings announcement drift: prices keep moving in the surprise's direction for weeks. | 3.8.8 |
| anomaly | Anomaly | A return pattern that standard risk explanations do not account for. | 3.8.8 |
| ex-dividend-date* | Ex-dividend date | First day a buyer no longer gets the next dividend; the price usually drops by it. | 3.8.9 |
| stock-split* | Stock split | More shares at a proportionally lower price; total value is unchanged. | 3.8.9 |
| secondary-offering | Secondary offering | A listed company selling new shares to investors. | 3.8.9 |
| merger-arbitrage | Merger arbitrage | Trading the gap between a takeover target's price and the offered price. | 3.8.9 |
| index-inclusion | Index inclusion | A stock joining an index, which makes index funds buy it. | 3.8.9 |
| sentiment-survey | Sentiment survey | A poll asking investors whether they expect prices to rise or fall. | 3.9.1 |
| bull-bear-spread | Bull–bear spread | Percentage of bullish answers minus percentage of bearish answers in a survey. | 3.9.1 |
| contrarian | Contrarian | Leaning against the crowd when its views are extreme. | 3.9.1 |
| cot-report | COT report | Weekly CFTC report of futures positions by trader type. | 3.9.2 |
| open-interest* | Open interest | Number of futures or options contracts still open. | 3.9.2 |
| commercial-hedger | Commercial hedger | A producer or user of a commodity who trades futures to reduce business risk. | 3.9.2 |
| managed-money | Managed money | Funds that trade futures for profit, such as CTAs and hedge funds. | 3.9.2 |
| cot-index | COT index | Where a group's net position sits within its range over a look-back, from 0 to 100. | 3.9.2 |
| vix | VIX | Index of the 30-day volatility priced into S&P 500 options. | 3.9.3 |
| put-call-ratio | Put/call ratio | Put volume divided by call volume. | 3.9.3 |
| zero-dte | 0DTE | Options that expire on the same day they are traded. | 3.9.3 |
| short-interest | Short interest | Number of shares currently sold short. | 3.9.4 |
| days-to-cover | Days to cover | Short interest divided by average daily volume. | 3.9.4 |
| exit-liquidity | Exit liquidity | Late buyers whose orders let earlier holders sell. | 3.9.4 |
| pump-and-dump* | Pump and dump | Hyping an asset to push its price up, then selling to the buyers it attracts. | 3.9.4 |
| crowded-trade | Crowded trade | A position held by so many traders that their exit moves the price. | 3.9.5 |
| sentiment-extreme | Sentiment extreme | A sentiment reading far outside its usual range, often two standard deviations. | 3.9.5 |
| turn-of-the-month | Turn of the month | The last trading day of a month plus the first few days of the next. | 3.9.6 |
| sell-in-may | Sell in May | The claim that November–April returns beat May–October returns. | 3.9.6 |
| data-mining | Data mining | Searching data until a pattern appears, whether or not it is real. | 3.9.6 |
| distribution | Distribution | How often each possible outcome occurs. | 3.10.1 |
| median* | Median | The middle value: half the outcomes are above it, half below. | 3.10.1 |
| skew | Skew | Lopsided outcomes, with a longer tail on one side. | 3.10.1 |
| kurtosis | Kurtosis | How heavy the tails are; high kurtosis means more extreme outcomes. | 3.10.1 |
| fat-tails | Fat tails | Extreme moves that happen far more often than a bell curve predicts. | 3.10.1 |
| realised-volatility | Realised volatility | Volatility measured from actual past price changes. | 3.10.2 |
| annualised-volatility | Annualised volatility | Volatility scaled to a one-year horizon. | 3.10.2 |
| square-root-of-time-rule | Square-root-of-time rule | Volatility over n days is about daily volatility times the square root of n. | 3.10.2 |
| winners-curse | Winner's curse | The best-looking pick among many was partly lucky, so it tends to disappoint. | 3.10.3 |
| prior | Prior | Your probability for something before seeing new evidence. | 3.10.4 |
| posterior | Posterior | Your updated probability after seeing the evidence. | 3.10.4 |
| false-positive | False positive | A test saying "yes" when the true answer is "no". | 3.10.4 |
| base-rate-neglect | Base-rate neglect | Ignoring how common something is when judging new evidence about it. | 3.10.4 |
| t-statistic | t-statistic | An average divided by its standard error; about 2 or more suggests more than noise. | 3.10.5 |
| p-value | p-value | The chance of a result this extreme if there were really no edge. | 3.10.5 |
| standard-error | Standard error | How much an estimate, such as an average, would vary from sample to sample. | 3.10.5 |
| sharpe-ratio* | Sharpe ratio | Return above cash divided by volatility. | 3.10.5 |
| bootstrap | Bootstrap | Resampling your own results many times to estimate how uncertain they are. | 3.10.5 |
| multiple-testing | Multiple testing | Running many tests, which makes chance "discoveries" likely. | 3.10.6 |
| bonferroni-correction | Bonferroni correction | Dividing the significance threshold by the number of tests run. | 3.10.6 |
| p-hacking | p-hacking | Trying analyses until one gives a significant p-value. | 3.10.6 |
| spurious-correlation | Spurious correlation | A correlation that appears by chance and disappears on new data. | 3.10.6 |
| autocorrelation | Autocorrelation | How much a value depends on the values just before it. | 3.10.7 |
| runs-test | Runs test | A test of whether wins and losses alternate as randomly as expected. | 3.10.7 |
| independence | Independence | One outcome gives no information about the next. | 3.10.7 |
| edge-hypothesis | Edge hypothesis | A testable reason why a pattern should pay, and who is on the other side. | 3.11.1 |
| research-log | Research log | Permanent record of every idea, test and change, including the number of trials. | 3.11.1 |
| point-in-time-data | Point-in-time data | Data exactly as it was known on each past date, without later corrections. | 3.11.1 |
| next-bar-execution | Next-bar execution | Filling a signal at the next bar's open, not in the bar that produced it. | 3.11.2 |
| intrabar-ambiguity | Intrabar ambiguity | Not knowing whether the stop or the target was hit first inside one bar. | 3.11.2 |
| breakeven-cost | Breakeven cost | The cost per trade at which a strategy stops making money. | 3.11.2 |
| cost-stress | Cost stress | Re-running a backtest with higher costs to see whether the edge survives. | 3.11.2 |
| survivorship-bias* | Survivorship bias | Looking only at survivors, which hides the failures and flatters results. | 3.11.3 |
| delisting | Delisting | A stock removed from its exchange, often after failure or a takeover. | 3.11.3 |
| in-sample | In-sample | The data used to build and tune a strategy. | 3.11.4 |
| hold-out | Hold-out | The part of the data set aside for the out-of-sample test. | 3.11.4 |
| overfitting | Overfitting | Tuning rules to past noise so they fail on new data. | 3.11.5 |
| data-snooping | Data snooping | Testing so many ideas on the same data that one works by luck. | 3.11.5 |
| degrees-of-freedom | Degrees of freedom | The number of choices and parameters a strategy can tune. | 3.11.5 |
| random-walk-control | Random-walk control | Running the same test on random data to check that the "edge" disappears. | 3.11.5 |
| walk-forward-analysis | Walk-forward analysis | Tune on one period, test on the next unseen one, then roll forward. | 3.11.6 |
| walk-forward-efficiency | Walk-forward efficiency | Out-of-sample return divided by in-sample return. | 3.11.6 |
| anchored-window | Anchored window | A walk-forward window that always starts at the beginning of the data. | 3.11.6 |
| rolling-window | Rolling window | A walk-forward window of fixed length that drops old data as it moves. | 3.11.6 |
| monte-carlo | Monte Carlo | Running many random simulations to see the range of possible outcomes. | 3.11.7 |
| reshuffle | Reshuffle | Putting the same trades in a new random order. | 3.11.7 |
| fan-chart | Fan chart | A chart of many simulated paths with percentile bands. | 3.11.7 |
| expectation-corridor | Expectation corridor | The range a system's results should stay within by chance alone. | 3.11.7 |
| percentile | Percentile | The value below which a given percentage of outcomes fall. | 3.11.7 |
| robustness | Robustness | Results that hold up when conditions change a little. | 3.11.8 |
| parameter-plateau | Parameter plateau | A wide area of settings that all give similar results. | 3.11.8 |
| stress-test | Stress test | Checking results under harsher conditions, such as double costs. | 3.11.8 |
| outlier-dependence | Outlier dependence | How much of the total profit comes from a few very large trades. | 3.11.8 |
| random-entry-benchmark | Random-entry benchmark | The same strategy with random entries, used to judge whether your entry adds anything. | 3.11.9 |
| incubation | Incubation | Trading a new system small and forward before trusting it with full size. | 3.11.10 |
| kill-switch | Kill switch | A rule written in advance that stops a system that has stopped working. | 3.11.10 |
| premortem | Premortem | Imagining that a plan has already failed and listing why. | 3.11.10 |
| go-live-gate | Go-live gate | The conditions a system must meet before its size increases. | 3.11.10 |
| geometric-mean | Geometric mean | The average growth rate per period once returns are compounded. | 3.12.1 |
| cagr* | CAGR | Compound annual growth rate: the steady yearly rate that gives the same end result. | 3.12.1 |
| volatility-drag | Volatility drag | Swings lowering compound growth even when the average return stays the same. | 3.12.1 |
| leveraged-etf* | Leveraged ETF | A fund that targets a multiple of an index's daily return. | 3.12.1 |
| fixed-ratio-sizing | Fixed-ratio sizing | Adding contracts only after profit grows by set steps. | 3.12.2 |
| anti-martingale | Anti-martingale | Sizing that grows after wins and shrinks after losses. | 3.12.2 |
| kelly-criterion | Kelly criterion | The bet size that maximises long-run growth when the edge is known exactly. | 3.12.3 |
| growth-rate | Growth rate | The average compound gain per bet or per period. | 3.12.3 |
| full-kelly | Full Kelly | Betting the whole Kelly fraction, which brings very deep drawdowns. | 3.12.3 |
| fractional-kelly | Fractional Kelly | Betting part of the Kelly fraction, such as a half or a quarter. | 3.12.4 |
| optimal-f | Optimal f | The fraction that would have grown a past list of trades the most. | 3.12.4 |
| hpr | HPR | Holding period return: 1 plus a trade's gain or loss as a fraction of equity. | 3.12.4 |
| twr | TWR | Terminal wealth relative: all the HPRs multiplied together. | 3.12.4 |
| risk-of-ruin | Risk of ruin | The chance of losing enough that you must stop trading. | 3.12.5 |
| ruin-threshold | Ruin threshold | The drawdown at which you would stop, used to define ruin. | 3.12.5 |
| volatility-target | Volatility target | The level of volatility a position or account is sized to. | 3.12.6 |
| volatility-forecast | Volatility forecast | An estimate of how much prices will move in the coming period. | 3.12.6 |
| leverage-creep | Leverage creep | Exposure rising quietly as volatility falls in calm markets. | 3.12.6 |
| equity-curve-filter | Equity-curve filter | Pausing a system while its equity is below its own average. | 3.12.7 |
| shadow-trades | Shadow trades | Trades recorded but not taken while a system is paused. | 3.12.7 |
| time-series-momentum | Time-series momentum | Long what has been rising and short what has been falling, judged on each asset's own past. | 3.13.1 |
| turtle-unit | Turtle unit | A position sized so one average daily range moves the account by 1%. | 3.13.1 |
| crisis-alpha | Crisis alpha | Gains a strategy tends to make during market crises. | 3.13.1 |
| cross-sectional-momentum | Cross-sectional momentum | Buying the recent best performers in a group and selling the worst. | 3.13.2 |
| momentum-crash | Momentum crash | A sharp loss for momentum when past losers rebound strongly. | 3.13.2 |
| formation-period | Formation period | The look-back window used to rank assets by past return. | 3.13.2 |
| basis-trade | Basis trade | Buying spot and selling the related future or perpetual to earn the difference. | 3.13.3 |
| uncovered-interest-parity | Uncovered interest parity | The theory that currency moves should cancel interest-rate differences; in practice they often don't. | 3.13.3 |
| false-discovery-rate | False discovery rate | The share of your "discoveries" that are actually false. | 3.13.4 |
| seasonal-tilt | Seasonal tilt | Adjusting size or filters slightly by calendar instead of trading the calendar alone. | 3.13.4 |
| pairs-trading | Pairs trading | Buying one related instrument and selling another, betting that their gap returns to normal. | 3.13.5 |
| cointegration | Cointegration | Two prices that wander but keep a stable gap between them. | 3.13.5 |
| z-score* | z-score | How many standard deviations a value is from its average. | 3.13.5 |
| half-life | Half-life | The average time it takes a gap to close halfway. | 3.13.5 |
| hedge-ratio | Hedge ratio | How many units of one instrument offset one unit of the other. | 3.13.5 |
| structural-break | Structural break | A lasting change that ends a relationship that used to hold. | 3.13.5 |
| event-study | Event study | Measuring the average price reaction across many similar events. | 3.13.6 |
| abnormal-return | Abnormal return | The return beyond what the market's move would predict. | 3.13.6 |
| beta* | Beta | How much an asset tends to move when the market moves 1%. | 3.13.6 |
| crowding | Crowding | Too many traders using the same strategy, which shrinks its edge. | 3.13.7 |
| adaptive-markets | Adaptive markets | The idea that market efficiency changes as participants and conditions change. | 3.13.7 |
| working-paper | Working paper | A study published before peer review. | 3.13.8 |
| replication | Replication | Repeating a study independently to see whether the result holds. | 3.13.8 |
| peer-review | Peer review | Checking of a study by independent experts before publication. | 3.13.8 |
| futures-contract | Futures contract | A standard exchange contract to buy or sell something at a future date. | 3.14.1 |
| tick-value | Tick value | The money value of the smallest allowed price move for one contract. | 3.14.1 |
| initial-margin | Initial margin | The collateral needed to open a futures position. | 3.14.1 |
| maintenance-margin | Maintenance margin | The minimum collateral needed to keep a position open. | 3.14.1 |
| variation-margin | Variation margin | Daily cash gains or losses settled on a futures position. | 3.14.1 |
| micro-contract | Micro contract | A smaller version of a futures contract, often one tenth of the size. | 3.14.1 |
| expiry* | Expiry | The date a futures or options contract ends. | 3.14.2 |
| first-notice-day | First notice day | The first day holders of a physical contract can be asked to take delivery. | 3.14.2 |
| calendar-spread | Calendar spread | Buying one expiry and selling another of the same contract. | 3.14.2 |
| continuous-contract | Continuous contract | A long chart that joins successive futures contracts. | 3.14.2 |
| back-adjustment | Back-adjustment | Shifting past prices so a continuous chart has no false jumps at the rolls. | 3.14.2 |
| contango | Contango | Futures priced above spot, so rolled long positions lose over time. | 3.14.3 |
| backwardation | Backwardation | Futures priced below spot, so rolled long positions gain over time. | 3.14.3 |
| roll-yield | Roll yield | The gain or loss from rolling futures as they converge to spot. | 3.14.3 |
| convenience-yield | Convenience yield | The benefit of holding the physical commodity, high when inventories are low. | 3.14.3 |
| cost-of-carry | Cost of carry | Financing, storage and insurance costs of holding an asset until a future date. | 3.14.3 |
| limit-move | Limit move | A price move that hits the exchange's daily limit, so trading beyond it stops. | 3.14.4 |
| inventory-report | Inventory report | Scheduled data on how much of a commodity is in storage. | 3.14.4 |
| physical-delivery | Physical delivery | Settling a futures contract by handing over the actual commodity. | 3.14.4 |
| stablecoin* | Stablecoin | A crypto token designed to keep a fixed value, usually one US dollar. | 3.14.5 |
| de-peg | De-peg | A stablecoin losing its fixed value. | 3.14.5 |
| self-custody | Self-custody | Holding your own crypto keys instead of leaving the coins on an exchange. | 3.14.5 |
| token-unlock | Token unlock | A scheduled release of previously locked tokens into the market. | 3.14.5 |
| counterparty-risk | Counterparty risk | The risk that the firm holding your money or assets fails. | 3.14.5 |
| perpetual-swap | Perpetual swap | A crypto future with no expiry, kept near spot by funding payments. | 3.14.6 |
| funding-rate | Funding rate | The periodic payment between longs and shorts in a perpetual swap. | 3.14.6 |
| mark-price | Mark price | An index-based reference price used to value positions and trigger liquidations. | 3.14.6 |
| premium-index | Premium index | How far a perpetual trades above or below its spot index. | 3.14.6 |
| liquidation-price | Liquidation price | The price at which the venue force-closes your leveraged position. | 3.14.7 |
| isolated-margin | Isolated margin | Margin that puts only one position's collateral at risk. | 3.14.7 |
| cross-margin | Cross margin | Margin shared across positions, so one loss can drain the whole account. | 3.14.7 |
| insurance-fund | Insurance fund | A venue's reserve that covers liquidations that close below zero equity. | 3.14.7 |
| auto-deleveraging | Auto-deleveraging | Forced closing of profitable opposite positions when the insurance fund runs out. | 3.14.7 |
| yield* | Yield | The yearly return a bond pays at its current price. | 3.14.8 |
| duration* | Duration | The approximate percentage price change of a bond for a one-point change in yield. | 3.14.8 |
| dv01 | DV01 | The money change in a position for a one-basis-point (0.01%) yield move. | 3.14.8 |
| convexity | Convexity | How a bond's price sensitivity changes as yields move. | 3.14.8 |

## Întrebări deschise

1. **Ordinea 3.13 / 3.14.** 3.13.1 și 3.13.3 se sprijină pe mecanica din 3.14 (futures, roll, funding). Am recomandat 3.14 înainte de 3.13 și am pus beat-uri de recapitulare. Alternativa e să se inverseze numerotarea în README §3 (3.13 = Instruments II, 3.14 = Systematic strategies), cum face R6 §7 (Stage 3 înainte de Stage 4).
2. **Concepte și termeni care se pot suprapune cu alte fișiere:** sharpe-ratio (2.11 poate introduce Sharpe la metrici), survivorship-bias și pump-and-dump (1.8), open-interest (2.5), implied-volatility și straddle (3.7 sau 4.1), beta, yield și duration (3.6), median (0.2), cagr (2.11), leveraged-etf și ex-dividend-date / stock-split (2.14), z-score (2.4), expiry (2.14), stablecoin (0.1). Sunt marcați cu * în glosar. La consolidarea `concepts.ts` și `glossary.ts` se păstrează o singură intrare, la prima apariție în ordinea cursului.
3. **Id-urile de concepte de la nivelurile anterioare** (random-walk, survivorship-bias, confirmation, market-regime) sunt provizorii. Se aliniază când apar fișierele level-0…level-2.
4. **S12 la Nivelul 3.** 3.8.7 și 3.9.3 au nevoie de prețuri de opțiuni simplificate (call și put ATM cu IV, plus un VIX calculat din suprafața de opțiuni). README §8 pune S12 la Nivelul 4. Propun o versiune minimă a S12 la Nivelul 3, sau un `straddle-pricer` cu prețuri precalculate.
5. **Valori de calibrat în generatoare:** acordul de 17/40 din hook-ul 3.11.1, rezultatul R0 de ≈ −4% din 3.11.5, diferența de survivorship din 3.11.3, rata de bază a inversărilor după extremele de sentiment (3.9.1) și pragul de levier din 3.13.3. Fișele dau ținte, nu valori finale.
6. **Praguri de design** (nu standarde din literatură): vecinătatea ≥ 80% pe platou, edge-ul de intrare la percentila ≥ 95 și e-ratio ≥ 1.2, lichidarea la cel puțin 2× distanța stop-ului, pragurile t care cresc cu numărul de încercări din Capstone 3, ±25% stabilitate în walk-forward. Trebuie confirmate de echipă înainte de implementare.
7. **Cifre de verificat înainte de publicare:** specificațiile CME (ES, MES, CL, GC, DV01-urile), cifrele de crisis alpha (Hurst, Ooi & Pedersen), regulile Turtle exacte, volatilitatea istorică a BTC, ziua de lichidări din octombrie 2025, codurile de lună și schimbarea de lichiditate la roll, prețul negativ WTI din aprilie 2020 (toate marcate [PK], [BK] sau [verify] în fișe).
