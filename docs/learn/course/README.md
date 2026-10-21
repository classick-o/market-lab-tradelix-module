# MARKET//LAB Academy · Harta completă a cursului

Cursul complet de trading, de la zero la nivel profesionist. Acoperă tot ce predau programele de referință (CMT Levels I–III, Babypips, CME Institute, IG Academy, StockCharts ChartSchool) și cărțile de bază ale domeniului, plus ce le lipsește: statistică, backtesting riguros, microstructură, costuri reale și dovezi oneste despre fiecare metodă.

**Cum folosești documentul:**
- Aici sunt arhitectura cursului și regulile lui.
- Harta detaliată, lecție cu lecție, e în fișierele pe niveluri (§11).
- Cercetarea pe care se bazează e în [../research/](../research/) (R1–R6).
- Lecțiile scrise complet, beat cu beat, sunt în [../](../README.md) (L01–L18). Restul se scriu pe unități, în același format, înainte de implementarea fiecărei unități.

Titlurile de nivel, unitate și lecție sunt în engleză, cum apar în aplicație. Explicațiile sunt în română.

---

## 1. Principiile cursului

Rezumate din programele analizate în R1 §3 și din greșelile pe care le fac majoritatea cursurilor pentru începători (R1 §4):

1. **Mecanica și riscul din prima zi.** Primul trade simulat cere un stop și o mărime calculată. Babypips pune riscul la cursul 10 din 11, iar Murphy la capitolul 16 din 19, și sunt criticați tocmai pentru asta: oamenii tranzacționează mult înainte să ajungă acolo.
2. **Probabilități înainte de pattern-uri.** Valoarea așteptată, varianța, seriile și mărimea eșantionului vin înaintea primei lumânări „care semnalează” ceva (Nivelul 0).
3. **Întâi contextul, apoi pattern-ul.** Ordinea este: structura pieței (trend, range, niveluri), lumânările în context, câțiva indicatori care nu se repetă între ei, pattern-urile cu ratele lor reale de reușită și eșec.
4. **Strategiile se grupează pe regim de piață:** trend, range, breakout, reversal. Fiecare are profilul ei de costuri și de eșec.
5. **Planul și jurnalul vin înaintea strategiilor.** Jurnalul se completează automat din simulator.
6. **Metodele avansate și cele discutabile vin la final,** cu nota lor de dovezi: Elliott, Wyckoff, Gann, armonice, SMC/ICT.
7. **Curriculum în spirală.** Riscul, statistica, psihologia și procesul revin la fiecare nivel, de fiecare dată mai în profunzime (modelul CMT: definește → aplică → integrează).
8. **Onestitate.** Ratele reale de pierdere ale traderilor retail se predau ca fapt central, nu ca notă de subsol:
   - ESMA: 74–89% din conturile CFD pierd bani;
   - Brazilia: 97% din day traderii persistenți au pierdut;
   - Taiwan: sub 1% sunt profitabili în mod previzibil.

   Un rezultat valid al cursului este și decizia de a *nu* face day trading.
9. **Procesul înaintea rezultatului.** Scorurile, insignele și trecerea de la un nivel la altul se bazează pe calitatea deciziilor și pe disciplina de risc, niciodată pe profit simulat.
10. **Totul se poate exersa.** Fiecare lecție are o interacțiune și o practică în simulator. Unde simulatorul nu poate încă, lecția spune ce capabilitate îi lipsește (§8).

## 2. Structura: Level → Unit → Lesson

| Nivel | Nume (UI) | Pentru cine | Unități | Lecții (aprox.) | Etapă vizuală |
|---|---|---|---|---|---|
| **0** | Orientation | Nicio experiență | 2 | 12 | The trailhead |
| **1** | Foundations | După Orientation | 8 | 58 | Base camp |
| **2** | Practitioner | Poate citi un grafic și dimensiona un trade | 14 | 119 | The trail |
| **3** | Advanced | Își construiește și își evaluează metoda | 14 | 108 | The ridge |
| **4** | Professional | Nivel instituțional, cantitativ, de business | 6 | 43 | The summit |
| | | | **44** | **340** (2,351 de minute, ≈ 39 de ore interactive) | |

Harta mai are **472 de concepte noi** și **976 de termeni noi de glosar**, fiecare definit o singură dată, în nivelul unde apare prima dată.

**Numerotare:**
- Unitățile sunt `N.U` (de exemplu 1.4), iar lecțiile `N.U.L` (de exemplu 1.4.3).
- Lecțiile existente își păstrează id-ul vechi ca alias (`L09` = 1.4.4).

**Core și elective:**
- Nivelurile 0 și 1 sunt integral **core**.
- La Nivelul 2, unitățile 2.1–2.13 sunt core, iar 2.14 e core pentru cine tranzacționează acțiuni, forex sau CFD-uri.
- De la Nivelul 3, utilizatorul alege **trasee de specializare** (§3). Unitățile 3.10–3.12 (statistică, backtesting, sizing) sunt core pentru toți.

**Nimic nu se blochează.** Ordinea e recomandată, nu impusă (PLAN_LEARN §3.1). Etapele de trecere (§5) acordă nivelul și insigna, nu deschid conținutul.

## 3. Unitățile

### Nivelul 0 · Orientation

| Unitate | Titlu | Lecții | Despre |
|---|---|---|---|
| 0.1 | Welcome to the markets | 6 | ce e o piață și o licitație; cine tranzacționează și de ce; investing vs trading (benchmark-ul pasiv); turul claselor de active; cum funcționează cursul și simulatorul; cifrele oneste |
| 0.2 | Thinking in probabilities | 6 | proces vs rezultat; valoarea așteptată; varianța și seriile; mărimea eșantionului; hazardul care desenează pattern-uri (random walk); noroc vs abilitate |

### Nivelul 1 · Foundations

| Unitate | Titlu | Lecții | Despre | Lecții existente |
|---|---|---|---|---|
| 1.1 | Prices, quotes and costs | 7 | bid, ask, mid, last; spread; comision și taxe; round trip și break-even; long și short; P&L în puncte, pips, ticks și unități; ecranul de cotații | L02 |
| 1.2 | Charts and candles | 7 | grafic line, bar, candle; timeframe-uri și agregare; anatomia lumânării; volumul; scara log vs liniară; ce nu poate spune un grafic | L01 |
| 1.3 | Orders and execution | 8 | market vs limit; stop-loss și take-profit; stop entry și stop-limit; bracket și OCO; time in force; execuții, execuții parțiale și coada de ordine; slippage și gap-uri; trailing stop | L03, L04 |
| 1.4 | Risk comes first | 9 | regula de 1%; R; unde stă stop-ul; dimensionarea din stop; R:R și break-even; expectancy; levier și marjă; drawdown și recuperare; limite zilnice | L08, L10, L09, L11, L12 |
| 1.5 | Market structure basics | 8 | swing-uri; trend (HH/HL); range și zgomot; suport și rezistență ca zone; numere rotunde; pullback-uri; breakout-uri și breakout-uri eșuate; introducere în analiza pe mai multe timeframe-uri | L05, L06 |
| 1.6 | Your first plan and journal | 7 | de ce un plan; planul v1 (cu capitalul de risc); checklist-ul; jurnalul; recenzia deciziilor; greșeală vs varianță; KPI-urile de proces | L14, L17 |
| 1.7 | The trader's mind I | 7 | emoțiile sunt normale; FOMO, revenge, loss aversion; gambler's fallacy; outcome bias; plictiseala și overtrading-ul; reguli if-then; pauza | L13 |
| 1.8 | Danger zone | 5 | martingale și averaging down (laboratorul de ruinare); grid; promisiunile de „holy grail” și survivorship bias; vânzătorii de semnale, țepele și brokerii nereglementați; iluzia levierului | — |

### Nivelul 2 · Practitioner

| Unitate | Titlu | Lecții | Despre | Lecții existente |
|---|---|---|---|---|
| 2.1 | Candlesticks in context | 9 | toate pattern-urile de una, două și trei lumânări; contextul (locație, trend, volum); confirmarea; ratele de bază; testul pe random walk; Heikin-Ashi, Renko, point & figure | — |
| 2.2 | Chart patterns | 10 | trendline-uri și canale (baza pattern-urilor); toate pattern-urile de continuare și de reversal; measured move; reguli de breakout și retest; statistici de reușită și eșec | — |
| 2.3 | Trend tools | 8 | medii mobile (SMA, EMA, WMA); încrucișări și lag; MACD; ADX/DMI; Parabolic SAR și SuperTrend; Ichimoku (bazele); teoria Dow | L07 |
| 2.4 | Oscillators and volatility | 9 | RSI, Stochastic, CCI, Williams %R, ROC; „overbought” ≠ vinde; divergențe; ATR; Bollinger și squeeze; Keltner și Donchian; adaptarea mărimii la volatilitate | L16 |
| 2.5 | Volume, levels and zones | 8 | volumul; OBV și A/D; VWAP și anchored VWAP; volume profile; pivot points; tipurile de gap; zone de supply și demand; Fibonacci (cu nota de dovezi) | — |
| 2.6 | Price action bar by bar | 8 | trend bars și doji; signal și entry bars; inside și outside bars; pullback-uri în două picioare; canale și wedge-uri; traps; momentum vs epuizare; alinierea pe mai multe timeframe-uri | — |
| 2.7 | Managing the trade | 8 | intrări; scaling in vs averaging down; ținte; trailing; breakeven; ieșiri parțiale; time stops; MAE/MFE | — |
| 2.8 | Strategies by market regime | 10 | potrivirea regim ↔ strategie; trend following; pullback; breakout; volatility contraction; range; mean reversion; failed breakout; confluență vs redundanță; evaluarea cu costuri | — |
| 2.9 | Sessions, time and intraday | 8 | orele pieței pe clase de active; sesiunile FX; ritmul intraday; opening range; gap and go vs gap fill; day trading vs swing; scalping și zidul costurilor; weekenduri și rollover | — |
| 2.10 | News and the economic calendar | 9 | așteptări vs surpriză; calendarul; spread-urile și stop-urile la știri; NFP; CPI; băncile centrale (bazele); stai deoparte, reduci sau tranzacționezi surpriza; a doua mișcare; checklist-ul de risc la știri | — |
| 2.11 | Portfolio risk and performance | 8 | sizing pe ATR; portfolio heat; corelație și concentrare; limite de expunere; trepte de drawdown; metrici de performanță; expectancy cu interval de încredere; SQN | — |
| 2.12 | The trader's mind II | 9 | prospect theory; disposition effect; overconfidence și calibrare; recency; confirmation și anchoring; sunk cost și house money; tilt; rutine; serii de pierderi; gândirea probabilistică (Douglas) | L18 |
| 2.13 | Playbook, routine and review | 7 | gândirea în scenarii; playbook-uri; rutina de dinaintea pieței; planuri if-then; taxonomia erorilor; recenzii zilnice și săptămânale; KPI-uri și obiective | L15 |
| 2.14 | Instruments I: stocks, forex, CFDs | 8 | acțiuni și ETF-uri; short selling; mecanica forex; swap; indici și CFD-uri; marjă, margin call, negative balance protection; costurile pe instrument; reglementare (ESMA; istoria regulii PDT) | — |

### Nivelul 3 · Advanced

| Unitate | Titlu | Lecții | Despre |
|---|---|---|---|
| 3.1 | Liquidity and stops | 7 | lichiditatea ca ordine adunate; unde se adună stop-urile (Osler); sweep vs breakout; equal highs/lows; dezechilibre; supply/demand; traderii prinși |
| 3.2 | Market microstructure | 8 | structuri de piață și licitații; order book L1/L2/L3; adâncime; market makers; brokeri A-book/B-book; NBBO și PFOF; prioritatea în coadă; ordine ascunse; licitațiile de deschidere și închidere |
| 3.3 | Order flow | 8 | tape; DOM; footprint; delta și CVD; absorbție și epuizare; icebergs; spoofing (ilegal); Market Profile |
| 3.4 | Classical methods under the microscope | 8 | cum se testează o metodă; Elliott Wave (două lecții, cu laboratorul de numărători alternative); Wyckoff; Fibonacci în profunzime; armonice; Ichimoku complet; Gann, cicluri și metode ezoterice. Market Profile se predă o singură dată, în 3.3.8. |
| 3.5 | Smart money concepts, decoded | 6 | vocabularul SMC/ICT tradus în concepte clasice; ce e real, ce e redenumit, ce nu se poate testa; laboratorul de testare |
| 3.6 | Macro and intermarket | 8 | dobânzi și curba randamentelor; inflație; dolarul; mărfuri; risk-on/risk-off; ciclul economic; rotația sectorială; instabilitatea corelațiilor |
| 3.7 | Central banks and event trading | 8 | comunicate, dot plot, minute, conferințe de presă; QE/QT; probabilități implicite; fade, straddle, drift înainte de eveniment; evenimente extreme (SNB 2015, flash crash) |
| 3.8 | Company fundamentals and earnings | 9 | situații financiare; rapoarte; evaluare (P/E, EV/EBITDA, DCF); sezonul de raportări; guidance; IV crush; PEAD; evenimente corporative |
| 3.9 | Sentiment, positioning and seasonality | 6 | COT; VIX; put/call; sondaje; short squeeze; semnale contrariene; sezonalitate cu nota de dovezi |
| 3.10 | Statistics for traders | 7 | distribuții și cozi groase; volatilitate; regresia la medie; rate de bază; semnificație și p-values; Bayes; autocorelație |
| 3.11 | Backtesting and system design | 10 | ipoteză → reguli → date; execuții și costuri; look-ahead și survivorship; in-sample / out-of-sample; walk-forward; Monte Carlo; robustețe; overfitting; benchmark-uri aleatoare; incubare |
| 3.12 | Position sizing theory | 7 | fixed ratio; Kelly și fractional Kelly; optimal f; volatility targeting; risk of ruin; equity curve trading; volatility drag |
| 3.13 | Systematic strategies and evidence | 8 | time-series momentum și sistemul Turtle; cross-sectional momentum și crash-urile lui; carry; strategii sezoniere; pairs și stat arb; strategii pe evenimente; scăderea și aglomerarea strategiilor; citirea critică a studiilor |
| 3.14 | Instruments II: futures, commodities, crypto, bonds | 8 | contracte futures, tick value, marjă, expirare, roll; contango și backwardation; mărfuri; crypto (24/7, perpetuals, funding, lichidare); obligațiuni și dobânzi |

### Nivelul 4 · Professional

| Unitate | Titlu | Lecții | Despre |
|---|---|---|---|
| 4.1 | Options and volatility | 11 | call și put, payoff; valoare intrinsecă și extrinsecă; Greeks; volatilitatea implicită; strategii de bază; prima de risc pe volatilitate; strategii de volatilitate |
| 4.2 | Execution and market impact | 6 | implementation shortfall; legea rădăcinii pătrate; algoritmi de execuție (TWAP, VWAP, POV); latență și HFT; regimuri de stres (halts, LULD, circuit breakers, fix-uri, expirări) |
| 4.3 | Professional validation | 7 | corecturi pentru testări multiple; deflated Sharpe; PBO; durata minimă a unui backtest; purged CV; capacitate; igiena cercetării |
| 4.4 | Portfolio risk at scale | 6 | VaR și Expected Shortfall; volatility targeting; expunere brută și netă; risk parity (conceptul); stress testing; regimuri de corelație |
| 4.5 | The business of trading | 7 | brokeri și reglementare (UE, UK, SUA, România: ASF); banii clienților și modelele de broker; firme de prop (reguli, matematica evaluărilor); taxe (awareness) și evidențe; trecerea de la demo la real; când să nu tranzacționezi |
| 4.6 | Your trading approach | 6 | matricea de constrângeri; alegerea pieței și a stilului; specializarea; pipeline-ul de dezvoltare cu criterii de oprire; creșterea treptată; îmbunătățirea continuă |

### Trasee de specializare (de la Nivelul 3)

| Traseu | Unități |
|---|---|
| Technical analyst | 3.4, 3.5, 3.9, 3.13 și lecția-punte 3.3.8 (Market Profile) |
| Price action and order flow | 3.1, 3.2, 3.3, 3.5, 4.2 |
| Macro and news | 3.6, 3.7, 3.8, 3.9 |
| Systematic trader | 3.13, 4.3, 4.4 |
| Derivatives | 3.14, 4.1, 4.4 |

Toate traseele includ 3.10–3.12 și 4.5–4.6.

### Ordinea recomandată în Nivelul 3

Id-urile unităților rămân stabile. Ordinea recomandată diferă de ordinea numerică, la fel cum L10 vine înaintea lui L09:

1. 3.1 → 3.2 → 3.3 (lichiditate, microstructură, order flow);
2. **3.10 → 3.11 → 3.12** (statistică, backtesting, sizing), înainte de metodele care se testează în laborator;
3. 3.4 → 3.5 (metode clasice și SMC, testate cu protocolul din 3.11);
4. 3.6 → 3.7 → 3.8 → 3.9 (macro, bănci centrale, fundamentale, sentiment);
5. **3.14 → 3.13** (întâi mecanica futures, crypto și funding, apoi strategiile sistematice care o folosesc: Turtle, carry).

Aplicația afișează unitățile în această ordine pe harta cursului.

## 4. Firele care revin la fiecare nivel (spirala)

| Fir | Nivelul 0 | Nivelul 1 | Nivelul 2 | Nivelul 3 | Nivelul 4 |
|---|---|---|---|---|---|
| **Risc** | ce înseamnă să pierzi | R, sizing, stop, limite | ATR, portfolio heat, corelație | Kelly, risk of ruin, volatility targeting | VaR/ES, stres, scalare |
| **Statistică** | EV, varianță, serii | expectancy, break-even | eșantion, interval de încredere, SQN | distribuții, semnificație, Bayes | testări multiple, PBO |
| **Psihologie** | proces vs rezultat | FOMO, revenge, pauza | bias-uri măsurate pe datele tale | practică deliberată, premortem | gândirea de business |
| **Proces** | cum învăți aici | planul v1 și jurnalul | playbook, rutine, recenzii | jurnalul de cercetare, guvernarea regulilor | criterii de oprire, scalare |
| **Dovezi** | hazardul face pattern-uri | „ce nu poate spune graficul” | ratele de bază ale pattern-urilor | metodele populare testate | validare profesională |
| **Costuri** | există | spread și comision în R | costurile pe stil (scalping) | costul de impact și de execuție | capacitate și impact |

În fiecare lecție, simulatorul arată mereu rezultatul după costuri, comparat cu benchmark-ul pasiv („the benchmark ghost”).

## 5. Etapele de trecere între niveluri

Acordă nivelul și insigna. **Nu blochează conținutul.** Se bazează doar pe măsuri de proces (R5 §10, R6 §7).

| Etapă | Condiții |
|---|---|
| 0 → 1 | Quiz-ul „process vs outcome”; quiz-ul de valoare așteptată |
| 1 → 2 | 30 de trade-uri simulate cu stop pus înainte de intrare în ≥ 95% din cazuri, riscul calculat corect în ≥ 90%, nicio limită depășită; planul v1 scris; Capstone 1 |
| 2 → 3 | 100 de trade-uri simulate pe cel puțin 2 setup-uri din playbook; recenzia săptămânală făcută 4 săptămâni la rând; recunoașterea regimului peste nivelul hazardului; costul erorilor în scădere; Capstone 2 |
| 3 → 4 | Un sistem documentat trece checklist-ul de validare (out-of-sample, walk-forward, Monte Carlo, stres pe costuri), cu jurnalul de cercetare; KPI-urile de proces se mențin într-un scenariu de drawdown forțat; Capstone 3 |
| Final | Piață sintetică necunoscută, cu mai multe regimuri: diagnostichezi regimul, alegi sau te abții, dimensionezi și raportezi rezultatul după costuri față de benchmark. Plus playbook-ul scris și statisticile validate. |

**Test out:** fiecare unitate are un checkpoint. La ≥ 80%, lecțiile ei se marchează „Tested out”.

## 6. Notele de dovezi

Fiecare metodă, indicator, pattern sau strategie poartă o notă vizibilă în lecție și în Library:

| Notă | Înseamnă | Exemple |
|---|---|---|
| **Mechanic** | Adevărat prin construcție: cum funcționează piața, ordinele și matematica | spread-ul, slippage-ul, sizing-ul, recuperarea după drawdown |
| **A · Robust** | Dovezi academice replicate pe multe piețe și decenii; supraviețuiește testelor out-of-sample | time-series momentum, carry (cu perioadele lor de crash) |
| **B · Supported** | Susținut, dar slăbit după publicare sau valabil doar în anumite regimuri | stop-urile adunate la numere rotunde (Osler), PEAD |
| **C · Mixed** | Backtest-uri de practicieni, replicări contradictorii, sensibil la parametri și costuri | opening range breakout (zero sau negativ după costuri în replicare), multe pattern-uri clasice |
| **D · Unproven** | Anecdotic, nefalsificabil sau nesusținut când e testat | Elliott Wave, Gann, armonice, majoritatea afirmațiilor SMC/ICT, Fibonacci ca nivel „magic” |
| **F · Harmful** | Expectancy negativă prin construcție sau ruină aproape sigură | martingale, grid fără stop, averaging down nelimitat |

Regula generală de prudență (McLean & Pontiff, 2016): 97 de predictori publicați au câștigat cu **26% mai puțin** out-of-sample și cu **58% mai puțin** după publicare. Orice „edge” publicat e mai mic și mai aglomerat decât arată studiul.

## 7. Regimurile de piață ale simulatorului

Biblioteca de regimuri sintetice (după R6 §0.5). Exercițiile o folosesc cu eticheta ascunsă, ca utilizatorul să recunoască singur regimul.

| Cod | Regim | Folosit pentru |
|---|---|---|
| R0 | Random walk (controlul) | Lecția centrală despre overfitting: nicio strategie nu are edge aici |
| R1 | Trend | Trend following, pullback-uri |
| R2 | Mean-reverting / range | Range trading, mean reversion |
| R3 | Volatility clustering | Volatilitate, sizing pe ATR |
| R4 | Salturi și gap-uri | Riscul de gap, stop-uri sărite |
| R5 | Eveniment programat | Știri, IV crush |
| R6 | Sesiune intraday | Opening range, ritmul zilei |
| R7 | Pereche cointegrată | Pairs trading, ruperi structurale |
| R8 | Carry cu crash | Carry, skew negativ |
| R9 | Structura la termen a futures | Contango, backwardation, roll |
| R10 | Perpetual swap | Funding, lichidare |
| R11 | Microstructura order book-ului | Coadă, spread, flux informat |
| R12 | Criză de lichiditate | Spread-uri largi, corelații spre 1, gap-uri |
| R13 | Sezonier / calendar | Efecte de calendar ascunse în zgomot |
| R14 | Suprafața de opțiuni | IV, skew, Greeks |

Azi simulatorul are 9 scenarii Arena (bullish, bearish, sideways, low volatility, breakout, reversal, high volatility, false breakout, event shock), adică echivalentul lui R1–R5. Restul se adaugă odată cu nivelurile care le folosesc.

## 8. Capabilitățile cerute simulatorului

Ce trebuie construit, în ordinea nivelurilor care au nevoie de el. Fiecare lecție din hartă trimite la aceste coduri în câmpul „Necesită”.

| Cod | Capabilitate | Azi | Prima dată la nivelul |
|---|---|---|---|
| S1 | Ordine stop de intrare, stop-limit, trailing stop, OCO, time in force | market, limit, stop-loss și take-profit atașate | 1 |
| S2 | Bibliotecă de indicatori: EMA, WMA, MACD, RSI, Stochastic, CCI, ATR, Bollinger, Keltner, Donchian, ADX, PSAR, Ichimoku, OBV, A/D, VWAP, AVWAP, volume profile, pivot points | SMA 20 și 50, volum | 2 |
| S3 | Instrumente de desen: trendline, canal, zonă, Fibonacci, riglă | — | 1–2 |
| S4 | Tipuri de grafic și timeframe-uri: line, bar, Heikin-Ashi, Renko, point & figure; 15m, 1H, 4H, 1D; scară log | candle, 1H, 4H | 1–2 |
| S5 | Ceas și sesiuni: ora zilei, deschideri, weekenduri, sărbători, rollover | — | 2 |
| S6 | Motor de știri sintetice: calendar, consens, valoare publicată, surpriză standardizată, spread mărit, reacție în două valuri, bănci centrale | scenariul event shock | 2 |
| S7 | Modul random walk (control) și laboratorul de statistici pe pattern-uri | — | 0 |
| S8 | Order book și tape: adâncime, coadă, execuții parțiale, icebergs, licitații | — | 3 |
| S9 | Mai multe instrumente simultan: corelație, perechi, intermarket, portfolio heat | un instrument (LABX) | 2 |
| S10 | Specificațiile pe clase de active: forex (pips, loturi, swap), futures (contract, marjă, roll), CFD (funding), crypto (perpetuals, funding, lichidare), acțiuni (împrumut pentru short, dividende, split-uri) | — | 2–3 |
| S11 | Levier, marjă, margin call, lichidare, negative balance protection | plafon la capital | 1–2 |
| S12 | Prețuri de opțiuni: Black-Scholes, Greeks, IV, payoff builder | — | 4 |
| S13 | Strategy lab: constructor de reguli, backtest, IS/OOS, walk-forward, Monte Carlo, costuri | — | 2–3 |
| S14 | Detectoare de comportament: revenge, tilt, disposition, overtrading, stop mutat | parțial (error tags din evaluare) | 1 |
| S15 | Analiza jurnalului: MAE/MFE, KPI-uri, costul erorilor în R | parțial (Journal, Analytics) | 1–2 |
| S16 | Date sintetice de companii și raportări: situații financiare, EPS, guidance | — | 3 |
| S17 | Date sintetice de sentiment: COT, VIX, put/call, sondaje | — | 3 |
| S18 | Modul „prop challenge”: limită zilnică, drawdown trailing | — | 2 |
| S19 | Algoritmi de execuție și model de impact | — | 4 |
| S20 | Scenarii de stres: halts, circuit breakers, flash crash, criză de lichiditate | — | 3 (o versiune ușoară la 2.10.9) |
| S21 | Unelte de plan și recenzie: constructorul de plan, checklist-ul dinaintea trade-ului, decision replay | parțial (Journal) | 1 |
| S22 | Profiluri de broker și selector de jurisdicție (UE, UK, SUA, România) | — | 2 |

**Completări cerute de hartă la capabilitățile existente:**
- **S3:** detector de swing-uri în Learn Chart Kit; modul de desen blocat (nivelul tras se fixează și se evaluează).
- **S4:** lumânări de 5 minute pentru lecțiile intraday (2.9.3, 2.9.4).
- **S7:** generatorul are „agenți” cu proprietăți declarate (ordine adunate la numere rotunde, traderi prinși, volum legat de continuare), pentru ca efectele predate (1.5.5, 3.1) să apară și în practică. Proprietățile se afișează utilizatorului, iar generatorul nu se calibrează pe statisticile pe care apoi le „confirmă”.
- **S12:** o versiune minimă (prețul Black-Scholes și volatilitatea implicită) e necesară deja la 3.8.7 și 3.9.3.
- **S15:** benchmark-ul pasiv („the benchmark ghost”) afișat lângă fiecare rezultat.
- **S18:** limita zilnică de pierdere e necesară deja la etapa 1 → 2 (Nivelul 1).

## 9. Unde intră lecțiile existente

| Lecție existentă | Noul loc | Conținutul scris complet în |
|---|---|---|
| L01 What a candle shows | 1.2 | ../U1-how-markets-work.md |
| L02 Bid, ask and the spread | 1.1 | ../U1-how-markets-work.md |
| L03 Market and limit orders | 1.3 | ../U1-how-markets-work.md |
| L04 Stop-loss and take-profit orders | 1.3 | ../U1-how-markets-work.md |
| L05 Trends, ranges and noise | 1.5 | ../U2-reading-price.md |
| L06 Support, resistance and breakouts | 1.5 | ../U2-reading-price.md |
| L07 Moving averages without the magic | 2.3 | ../U2-reading-price.md |
| L08 Risk per trade | 1.4 | ../U3-risk-comes-first.md |
| L10 Where a stop belongs | 1.4 | ../U3-risk-comes-first.md |
| L09 Sizing a position from the stop | 1.4 | ../U3-risk-comes-first.md |
| L11 Reward-to-risk and expectancy | 1.4 | ../U3-risk-comes-first.md |
| L12 Exposure and leverage | 1.4 | ../U3-risk-comes-first.md |
| L16 Volatility and adapting your size | 2.4 | ../U3-risk-comes-first.md |
| L14 Writing a trading plan | 1.6 | ../U4-plan-and-decide.md |
| L15 Thinking in scenarios | 2.13 | ../U4-plan-and-decide.md |
| L17 Reviewing your decisions | 1.6 | ../U4-plan-and-decide.md |
| L13 FOMO, revenge and loss aversion | 1.7 | ../U5-traders-mind.md |
| L18 Handling losing streaks | 2.12 | ../U5-traders-mind.md |

**Ce se schimbă pentru ele:**
- Gruparea U1–U5 din [../README.md](../README.md) a fost prima variantă de curs. E înlocuită de structura de aici.
- Scripturile lecțiilor rămân valabile. Se schimbă doar unitatea și trimiterile spre lecțiile de dinainte și de după.
- Lecțiile L07, L15, L16 și L18 urcă la Nivelul 2, pentru că se sprijină pe concepte predate abia acolo.

## 10. Formatul hărții (pentru fiecare lecție)

Harta nu e încă scriptul complet al lecției (acela urmează formatul din [../README.md](../README.md)). E fișa care fixează *ce* se predă și *cum* se exersează:

```markdown
#### 1.4.4 · Sizing a position from the stop  ·  `L09`
- **Nivel / durată / tip:** Beginner · 7 min · Core
- **Obiective:**
  1. …
  2. …
  3. …
- **Concepte:** position-sizing ✓, cost-adjusted-sizing ✓, buying-power-cap (nou)
- **Se sprijină pe:** 1.4.2, 1.4.3, 1.1.4
- **Hook:** ideea predicției de la început
- **Interacțiunea centrală:** ce face utilizatorul în faza Learn (figură, predict, match, hotspot…)
- **Try:** widget-ul sau laboratorul și sarcina
- **Practică:** regim (R1…), scenariu Arena, misiune sau laborator
- **Check:** ce verifică cele 3 întrebări
- **Dovezi:** nota (Mechanic, A–F), cu sursa din cercetare (de exemplu R6 §2.4)
- **Necesită:** capabilitățile de simulator (S…), dacă lipsesc azi
- **Termeni noi de glosar:** …
```

**Notații:**
- ✓ = concept care există deja în `concepts.ts`; „nou” = concept de adăugat.
- La fiecare unitate, fișa unității arată:
  - scopul;
  - de ce vine în acest loc;
  - ce cere de dinainte;
  - checkpoint-ul;
  - capstone-ul sau laboratorul;
  - firele din spirală pe care le atinge;
  - sursele.

## 11. Fișierele hărții

| Fișier | Conține |
|---|---|
| [level-0-orientation.md](level-0-orientation.md) | 0.1–0.2 |
| [level-1-foundations.md](level-1-foundations.md) | 1.1–1.8 și Capstone 1 |
| [level-2-practitioner-a.md](level-2-practitioner-a.md) | 2.1–2.7: lumânări, pattern-uri, indicatori, volum, price action, managementul trade-ului |
| [level-2-practitioner-b.md](level-2-practitioner-b.md) | 2.8–2.14 și Capstone 2: strategii, sesiuni, știri, portofoliu, psihologie, playbook, instrumente |
| [level-3-advanced-a.md](level-3-advanced-a.md) | 3.1–3.7: lichiditate, microstructură, order flow, metode clasice, SMC, macro, bănci centrale |
| [level-3-advanced-b.md](level-3-advanced-b.md) | 3.8–3.14 și Capstone 3: fundamentale, sentiment, statistică, backtesting, sizing, strategii sistematice, instrumente |
| [level-4-professional.md](level-4-professional.md) | 4.1–4.6 și capstone-ul final |

## 12. Sursele

Cercetarea completă, cu toate sursele citate (aproximativ 500 de URL-uri), e în [../research/](../research/):

| Fișier | Domeniu |
|---|---|
| R1 | programe de studiu și cărți de referință; 303 subiecte în 23 de domenii |
| R2 | analiza tehnică completă |
| R3 | price action, structura pieței, lichiditate, microstructură, order flow, SMC/ICT; 142 de concepte |
| R4 | fundamentale, macro, știri, bănci centrale, sentiment, sezonalitate |
| R5 | risc, managementul trade-ului, psihologie, plan și jurnal, backtesting, statistică; 171 de concepte |
| R6 | stiluri, strategii (aproximativ 40), clase de active, derivate, costuri, construcția abordării personale |

**De verificat înainte de publicare:**
- afirmațiile marcate în cercetare cu [BK], [K], [S] sau [PK, verify] (din cunoștințe proprii sau din fragmente de căutare);
- specificațiile contractelor CME;
- schimbările de reglementare. De exemplu, înlocuirea regulii Pattern Day Trader din SUA cu un regim de marjă intraday (în vigoare din 4 iunie 2026, cu tranziție până la 20 octombrie 2027) e raportată de trei agenți de cercetare, dar din surse secundare.

Lecțiile despre reglementare au dată și sunt pe jurisdicții: UE (ESMA), UK (FCA), SUA (SEC/FINRA/CFTC) și România (ASF).
