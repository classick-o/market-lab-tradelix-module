# Nivelul 2 · Practitioner, partea A: unitățile 2.1–2.7

Harta detaliată a primei jumătăți din Nivelul 2: lumânări, pattern-uri grafice, indicatori de trend, oscilatori și volatilitate, volum și niveluri, price action bară cu bară, managementul trade-ului. Arhitectura, notele de dovezi (§6), regimurile (§7), capabilitățile (§8) și formatul fișelor (§10) sunt în [README.md](README.md). Unitățile 2.8–2.14 și Capstone 2 sunt în [level-2-practitioner-b.md](level-2-practitioner-b.md).

Titlurile, obiectivele și textele de UI sunt în engleză, cum apar în aplicație. Restul e în română.

---

## Introducere: ce aduce partea A

### Ce poate face cursantul la final

- Recunoaște circa 60 de pattern-uri de lumânări (aproximativ 85 cu variantele bull și bear) după reguli exacte, programabile, și le judecă după context, confirmare și rata lor de bază, nu după nume.
- Desenează trendline-uri, canale și pattern-uri grafice, aplică un filtru de confirmare potrivit instrumentului (închidere dincolo, procent sau multiplu de ATR) și calculează o țintă scalată cu rata istorică de atingere.
- Calculează de mână SMA, EMA, WMA, MACD, ADX/DMI, Parabolic SAR, SuperTrend, liniile Ichimoku, ROC, RSI, Stochastic, Williams %R, CCI, true range și ATR, Bollinger, Keltner, Donchian, OBV, A/D, VWAP, pivot points și nivelurile Fibonacci. Știe ce măsoară fiecare și ce indicatori spun același lucru.
- Citește graficul bară cu bară: trend bars și doji bars, signal și entry bars, inside și outside bars, numărătoarea H1/H2, capcanele, momentum vs epuizare. Aliniază timeframe-urile după o regulă scrisă dinainte.
- Gestionează un trade în R: intrarea, scaling in fără averaging down, ținte, trailing, breakeven, ieșiri parțiale, time stops, și își măsoară ieșirile cu MAE și MFE.
- Rulează orice regulă pe piața aleatoare de control (R0) și pe regimurile cu structură, și interpretează rezultatul cu eșantionul, intervalul de încredere și costurile lui.

### Cum funcționează firul dovezilor aici

Aceasta e partea cursului în care apar cele mai multe unelte, deci și cele mai multe afirmații de verificat. Regulile care se aplică în toate cele 60 de lecții:

1. **Două carduri pentru fiecare unealtă** (R2 §8.4 pct. 1): un *Claim card* (ce spun practicienii) și un *Evidence card* (ce arată testele, cu nota din README §6 și sursa). Nu apare niciodată unul fără celălalt.
2. **Rata de bază se arată mereu** (R2 §8.4 pct. 2). Orice tally de tip predict → reveal pune alături:
   - rata cursantului;
   - rata istorică din cercetare (de obicei Bulkowski), cu domeniul ei: acțiuni americane, grafic zilnic, anii 1990–2010;
   - rata pe intrări aleatoare din aceeași piață;
   - rata pe R0.
3. **Controlul R0 în fiecare unitate cu pattern-uri** (2.1, 2.2, 2.5, 2.6) și în laboratoarele de indicatori (2.3, 2.4). Pe un random walk, orice pattern apare, iar ce urmează după el e egal cu rata de bază: în jur de 50%, iar rezultatul mediu e minus costurile (R2 §0.3, §8.5 pct. 1). Cursantul vede asta singur, cu eșantionul afișat.
4. **Două moduri de date, spuse explicit în fiecare exercițiu** (R2 §0.3):
   - **mod didactic**: generatorul *plantează* pattern-ul, ca să se exerseze recunoașterea; nu se trage nicio concluzie despre câștig;
   - **mod onest**: R0 sau un regim (R1 trend, R2 range, R3 volatility clustering, R4 salturi, R6 sesiune), fără pattern-uri plantate; aici se măsoară.
5. **Fără calibrare circulară.** Generatorul nu se reglează după ratele lui Bulkowski ca apoi să „confirme” aceleași rate. Ratele din cercetare apar doar pe carduri, cu sursa și domeniul lor. Simulatorul arată ce se întâmplă în regimuri ale căror proprietăți sunt cunoscute (momentum, mean reversion, volatilitate care se adună în clustere). Unde un regim are o proprietate care favorizează o unealtă (de exemplu volumul legat de continuare, sau agenți care pun ordine la numere rotunde), lecția o spune.
6. **Expectancy, nu win rate** (R2 §8.4 pct. 4). Orice ecran de rezultat arată R-multiple după costuri, eșantionul (N) și intervalul de încredere. Sub 30 de cazuri, rezultatul apare cu eticheta „too few cases”.
7. **Numele mint uneori** (R2 §8.4 pct. 7). Pattern-urile care, testate, fac opusul numelui lor (hanging man, inverted hammer, three-line strike, descending triangle) se predau ca obicei de lucru: întâi datele, apoi numele.
8. **Edge-urile se erodează** (R2 §3.12, §8.2 pct. 5). Ratele de eșec ale pattern-urilor grafice s-au dublat în anii 2000 față de anii 1990, iar orice statistică publicată e mai slabă după publicare (README §6, McLean & Pontiff).

### Firele din spirală în unitățile 2.1–2.7

| Fir | Unde apare în partea A |
|---|---|
| **Risc** | confirmarea schimbă intrarea, R-ul și mărimea (2.1.3, 2.2.3); ATR și mărimea adaptată la volatilitate (2.4.6, 2.4.7 = L16); pyramiding cu riscul total ≤ 1R, averaging down semnalat (2.7.2); trailing, breakeven, parțiale în R (2.7.4–2.7.6) |
| **Statistică** | rate de bază, eșantion și interval de încredere pe fiecare tally; expectancy vs win rate (2.1.4, 2.2.3, 2.7.1); calibrarea probabilităților și scorul Brier (2.6.7); MAE/MFE pe propriul jurnal (2.7.8) |
| **Psihologie** | apofenia (pattern-uri în zgomot, 2.2.10); confirmation bias și iluzia confluenței (2.5.8); timeframe shopping (2.6.8); breakeven din disconfort (2.7.5); sunk cost în averaging down (2.7.2) |
| **Proces** | regula scrisă înainte de grafic; arborele de scenarii pentru breakout (2.2.10); etichete de motiv pentru ieșiri (2.7.7); ierarhia de timeframe-uri (2.6.8) |
| **Dovezi** | cele două carduri; R0 în fiecare unitate; domeniul statisticilor Bulkowski; „names lie”; decăderea în timp |
| **Costuri** | costul confirmării în R; whipsaw-urile încrucișărilor și cost slider-ul (2.3.4); intrarea la close plătește spread-ul; stop-urile strânse măresc costul în R (2.7.8) |

### Ordinea și legăturile

- **2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6 → 2.7** e ordinea recomandată. Contextul vine înaintea pattern-ului (README §1 pct. 3): 2.1 se sprijină pe structura și zonele din 1.5. Indicatorii vin după pattern-uri, iar price action-ul bar cu bar le leagă pe toate. Managementul trade-ului închide partea A, înainte de strategiile pe regim (2.8).
- **Ce iau unitățile din partea B:**
  - 2.8 folosește uneltele de aici în strategii pe regim, inclusiv confluența vs redundanța;
  - 2.9 reia VWAP, opening range și ritmul intraday;
  - 2.11 reia sizing-ul pe ATR și portfolio heat;
  - 2.12 reia bias-urile măsurate;
  - 2.13 folosește setup-urile de aici în playbook.
- **Nivelul 3 apare doar ca trimitere de un rând:**
  - lichiditatea și sweep-urile → 3.1;
  - order flow, footprint, Market Profile → 3.3;
  - Elliott, Wyckoff, Gann, armonice, Fibonacci în profunzime, Ichimoku complet → 3.4;
  - SMC/ICT → 3.5;
  - backtesting riguros → 3.11.

### Ajustarea numărului de lecții

| Unitate | În README §3 | Aici | Motiv |
|---|---|---|---|
| 2.2 Chart patterns | 9 | **10** | Trendline-urile și canalele nu sunt predate în Nivelul 1 (1.5 acoperă swing-uri, zone, pullback-uri, breakout-uri), dar triunghiurile, wedge-urile, steagurile și necklines se construiesc din linii. R2 §9.2 pune trendline-urile (M6) înaintea pattern-urilor (M11). Lecția nouă 2.2.1 e și prima care cere instrumentele de desen S3. |
| celelalte | 9 / 8 / 9 / 8 / 8 / 8 | neschimbat | — |

Total partea A: **60 de lecții** (README §3 dă 59). Tabelul din README §3 trebuie actualizat la 10 pentru 2.2 și 119 pentru Nivelul 2.

### Pe scurt

| Unitate | Lecții | Lecții existente | Laboratorul unității | Controlul R0 |
|---|---|---|---|---|
| 2.1 Candlesticks in context | 9 | — | Candle tally lab | fiecare pattern, pe 1,000 de drumuri R0 |
| 2.2 Chart patterns | 10 | — | Patterns in noise | H&S, double tops, triunghiuri pe 10,000 de drumuri R0 |
| 2.3 Trend tools | 8 | L07 → 2.3.2 | Trend rule lab | fiecare regulă de trend, cu cost slider |
| 2.4 Oscillators and volatility | 9 | L16 → 2.4.7 | Same rule, different markets | fade-uri, momentum, squeeze |
| 2.5 Volume, levels and zones | 8 | — | Level lab (Osler) + confluence counter | niveluri desenate vs niveluri aleatoare |
| 2.6 Price action bar by bar | 8 | — | Bar-by-bar replay | sesiuni R0 ascunse în replay |
| 2.7 Managing the trade | 8 | — | Exit policy comparator | ieșirile nu creează edge pe R0 |

---

## Convenții pentru această hartă

### Lumea simulată

La fel ca în [../README.md](../README.md):
- instrumentul **LABX**, în **vUSD**, cu prețuri cu 2 zecimale;
- cont de 10,000.00 vUSD; risc 1% în misiuni (100.00 vUSD) și 2% în Arena;
- spread 0.10: cumperi la ask (mid + 0.05) și vinzi la bid (mid − 0.05);
- comision 0.05% la intrare și la ieșire;
- unități întregi, rotunjite în jos la dimensionare; fără levier.

**Timeframe-uri:**
- implicit, lumânări de 1 oră;
- 15m, 4H și 1D cer S4.

**Exemplele lucrate:**
- cifrele din fișe sunt verificate cu un script;
- unde lipsesc costurile, exemplul spune „înainte de costuri”, iar widget-ul arată și varianta cu costuri, calculată cu `maxQtyForRisk` și `riskAmount`, ca în U3.

### Regulile de detecție a lumânărilor

Aplicația folosește setările implicite TA-Lib (`TA_CANDLE_DEFAULT_SETTINGS`, R2 §2.0.2), standardul de facto al industriei:

| Setare | Compară | Cu | Fereastră | Factor |
|---|---|---|---|---|
| BodyLong | corpul | corpul mediu | 10 lumânări anterioare | > 1.0× |
| BodyVeryLong | corpul | corpul mediu | 10 anterioare | > 3.0× |
| BodyShort | corpul | corpul mediu | 10 anterioare | < 1.0× |
| BodyDoji | corpul | range-ul mediu (high − low) | 10 anterioare | ≤ 0.1× |
| ShadowLong | fitilul | corpul *acestei* lumânări | — | > 1.0× |
| ShadowVeryLong | fitilul | corpul acestei lumânări | — | > 2.0× |
| ShadowShort | fitilul | fitilul mediu | 10 anterioare | < 1.0× |
| ShadowVeryShort | fitilul | range-ul mediu | 10 anterioare | < 0.1× |
| Near | distanța | range-ul mediu | 5 anterioare | ≤ 0.2× |
| Far | distanța | range-ul mediu | 5 anterioare | ≥ 0.6× |
| Equal | distanța | range-ul mediu | 5 anterioare | ≤ 0.05× |

**Notații folosite în fișe:**
- `avgBody10` = corpul mediu al ultimelor 10 lumânări;
- `avgRange10` = range-ul mediu al ultimelor 10 lumânări;
- `avgRange5` = range-ul mediu al ultimelor 5 lumânări;
- O, H, L, C = open, high, low, close; indicele 1, 2, 3 = poziția lumânării în pattern.

**Unde TA-Lib și literatura diferă**, fișa le dă pe amândouă și fixează regula implicită a aplicației. Detectorul are un slider de strictețe, ca cursantul să vadă cum se schimbă numărul de detecții.

**„Convenție a aplicației”** marchează pragurile pe care nici TA-Lib, nici R2 nu le fixează. Sunt de calibrat la implementare și se afișează ca parametri, nu ca adevăruri.

**Regula de context**, care se aplică peste orice pattern de inversare (2.1.3):
- trend anterior;
- locație la o zonă;
- confirmare.

### Statisticile din cercetare și ce înseamnă ele

**Pentru lumânări:**
- **Rata de inversare** (Bulkowski) = cât de des prețul *închide* întâi dincolo de capătul pattern-ului în direcția anunțată. **50% = aruncarea monedei.**
- **Rangul** e din 103 tipuri de lumânări, după performanța totală.

**Pentru pattern-urile grafice** (R2 §0.4):
- **eșecul la break-even** = prețul nu se mișcă mai mult de 5% dincolo de breakout înainte să se întoarcă;
- **mișcarea medie** e măsurată până la extremul final („perfect trade”), deci e o limită superioară, nu o așteptare;
- **„target met”** = cât de des s-a atins ținta clasică, cu înălțimea completă;
- rangul e din 39 (breakout în sus) sau din 36 (breakout în jos).

**Domeniul statisticilor:** acțiuni americane, grafic zilnic, anii 1990–2010, tabelele de piață bull. **Nu se transferă la LABX pe 1H.**

**Rezultatul standard al laboratorului** (*standard tally*), folosit peste tot în partea A, ca rezultatele să fie comparabile:
- **intrarea:** la închiderea lumânării care completează sau confirmă pattern-ul, la ask (long) sau la bid (short);
- **stop-ul:** dincolo de extremul pattern-ului, cu 0.25 × ATR(14);
- **ieșirea:** la stop sau după 10 lumânări, la închidere;
- **raportul:** N, rata de direcție (închidere dincolo de pattern, ca la Bulkowski) cu interval de încredere de 95%, R mediu după costuri, aceleași cifre pentru intrări aleatoare (aceeași direcție, aceeași durată) și pentru R0.

### Id-urile întrebărilor din Check

Băncile noi propuse:

| Unitate | Prefix |
|---|---|
| 2.1 | `q-cdl` |
| 2.2 | `q-cp` |
| 2.3 | `q-trd` |
| 2.4 | `q-osc` |
| 2.5 | `q-vol` |
| 2.6 | `q-pa` |
| 2.7 | `q-tm` |

L07 și L16 își păstrează întrebările existente: `q-ta-*` și `q-rm-*`.

### Widget-urile și laboratoarele noi

Toate folosesc Learn Chart Kit (PLAN_LEARN §8) și modelul comun de task (PLAN_LEARN §9.1):
- obiectiv, valori de start, condiție de reușită evaluată de `evaluateSuccess`;
- 1–3 indicii, Reset, Show me.

**Unde condiția de reușită depinde de o serie generată** (ca la L07), valorile exacte se fixează din seed la implementare și intră în teste unitare.

| Widget / laborator | Ce face | Lecții | Necesită |
|---|---|---|---|
| candle-meter | Extinde `candle-builder` (L01): construiești o lumânare, iar aplicația o clasifică față de ultimele 10 (corp și fitile față de medii) | 2.1.1 | — |
| pattern-tapper | TAP pe grafic; gradare după regula aplicației, cu motivul fiecărei respingeri. Moduri: „find” și „judge” (Trade / Skip + motiv) | 2.1.2–2.1.4, 2.5.1, 2.6.3 | S7 |
| penetration-slider | Tragi închiderea lumânării 2 în corpul lumânării 1; eticheta se schimbă pe scară | 2.1.5 | — |
| star-builder | `candle-builder` cu 3 lumânări și gap-uri | 2.1.6 | — |
| tally-lab | Detectează un pattern pe 1,000 de drumuri R0 și pe regimuri, cere o predicție, apoi arată standard tally | 2.1–2.2, 2.6 | S7 |
| name-generator | Compune forme aleatoare de 3 lumânări, cu nume sau fără; predicție, apoi rata pe R0 | 2.1.8 | S7 |
| chart-type-switch | Aceeași serie în line, bar, candle, Heikin-Ashi, Renko, P&F; ieșirile se execută la prețuri reale | 2.1.9 | S4 |
| line-drawer | Trendline, canal, două linii; ancorele se lipesc de swing-uri; toleranța e în ATR. Modul „locked” numără doar atingerile de după desen | 2.2.1, 2.2.6, 2.2.8, 2.6.5 | S3 |
| filter-slider | Același set de breakout-uri, cu filtrul 0% / 1% / 3% / 0.25–2 ATR / 2 închideri; arată false semnale evitate vs intrare pierdută | 2.2.2 | S7 |
| pattern-drawer | Neckline, nivel de confirmare, cutie, cup și handle, cu ținta scalată afișată | 2.2.3–2.2.5, 2.2.9 | S3 |
| measured-move | Pui A, B, C, iar aplicația proiectează D la 60% și 100% | 2.2.7 | S3 |
| scenario-tree | Plan pre-scris pentru „works / fails / busts” | 2.2.10 | — |
| trend-classifier+ | Extinde `trend-classifier` (L05) cu regula peak-trough și cu 4 definiții de trend comparate | 2.3.1 | S2 |
| ma-period+ | Extinde `ma-period` (L07) cu tipul de medie: SMA, EMA, WMA | 2.3.3 | S2 |
| indicator-builder | Foaie de calcul cu celule verificate (± 0.01), cu „show working” | 2.3.3, 2.3.5–2.3.8, 2.4.2, 2.4.3, 2.4.6, 2.5.2, 2.5.5 | — |
| strategy-lab-lite | Reguli predefinite, cost slider, benchmark aleator, R0/R1/R2/R3 | 2.3.4, 2.4.1, 2.4.4, 2.4.9, 2.7.1 | S13 |
| regime-filter | Pragul ADX față de etichetele ascunse ale regimului: precizie și recall | 2.3.6 | S2 |
| oscillator-overlay | 2–4 indicatori pe un panou, cu corelația dintre ei | 2.4.3 | S2 |
| divergence-drawer | Linie pe swing-urile de preț și pe aceleași lumânări în oscilator | 2.4.5 | S2, S3 |
| squeeze-lab | 20 de squeeze-uri: predicție pentru mărimea și direcția mișcării următoare | 2.4.8 | S2, S7 |
| vwap-execution | Cumperi o cantitate în timpul sesiunii; scorul e față de VWAP | 2.5.3 | S2, S5 |
| profile-builder | Volum pe niveluri de preț, POC, value area | 2.5.4 | S2 |
| gap-classifier | Etichetezi gap-uri în timp real; reveal după umplere | 2.5.6 | — |
| zone-drawer | Extinde `level-drawer` (L06): zone de supply și demand, cu linie proximală și distală | 2.5.7 | S3 |
| fib-tool + confluence-counter | Retracement și extensii; numără liniile din jurul unui preț aleator | 2.5.8 | S3, S2 |
| bar-grader | Etichetezi bare (trend / doji; calitatea signal bar-ului 1–5); comparație cu regula | 2.6.1, 2.6.2 | — |
| bracket-builder+ | Extinde `bracket-builder` (L04) cu stop entry și OCO | 2.6.2, 2.6.3 | S1 |
| bar-counter | Etichete H1/H2/L1/L2 și ordinul H2 | 2.6.4 | S1 |
| replay-decider | Replay cu ramuri: breakout, eșec, sau stai deoparte, cu invalidarea scrisă | 2.6.6 | S7 |
| strength-meter | Checklist de forță vs epuizare, plus probabilitate declarată | 2.6.7 | S2 |
| mtf-panes | 3 timeframe-uri legate; ierarhie de reguli impusă | 2.6.8 | S4, S14 |
| entry-comparator | Același setup cu 3 intrări pe 100 de replay-uri | 2.7.1 | S1, S13 |
| pyramid-planner | Adaugi la poziție și muți stop-urile; linia „worst case” | 2.7.2 | S1, S14 |
| target-sweep | Ținte de la 1R la 5R pe aceleași intrări; histograma MFE | 2.7.3 | S15 |
| trail-comparator | Mai multe reguli de trailing pe aceleași intrări | 2.7.4 | S13, S15 |
| be-ab | Cu și fără breakeven la +1R, pe propriile trade-uri sau pe un set fix | 2.7.5 | S15 |
| exit-planner | Până la 3 ieșiri parțiale; R mixt și distribuție | 2.7.6 | S15 |
| time-stop-line | Linie verticală pe scatter-ul „bare în trade vs R final” | 2.7.7 | S15 |
| mae-scatter | Scatter MAE vs R final; linia de stop trasă recalculează expectancy | 2.7.8 | S15 |

---

## 2.1 · Candlesticks in context (9 lecții)

### Fișa unității

- **Scop:**
  - vocabularul complet al lumânărilor japoneze, cu reguli de detecție programabile: circa 60 de nume de pattern-uri de una, două, trei și cinci lumânări;
  - regulile de context care decid dacă un pattern contează: trend anterior, locație, confirmare, trend primar, mărime relativă, volum;
  - ratele de bază ale fiecărui pattern și testul pe R0;
  - tipurile alternative de grafic: Heikin-Ashi, Renko, point & figure, cu line și bar ca recapitulare.
- **De ce aici:**
  - Lumânările vin după structura și zonele din 1.5, pentru că un pattern de inversare are nevoie de un trend de inversat și de un loc: R1 §3.2 pct. 6 („context before patterns”), R2 §9.2 (lumânările pe două niveluri, după S/R).
  - Unitatea deschide firul „ratele de bază ale pattern-urilor” (README §4). E prima în care cursantul vede, pe date, că multe lumânări celebre sunt aproape de aruncarea monedei.
- **Se sprijină pe:**
  - 1.2: anatomia lumânării (L01), timeframe-uri, volum, scara log;
  - 1.5: swing-uri, trend HH/HL, zone S/R, pullback (L05, L06);
  - 1.4: R, stop, dimensionare, R:R (L08–L11);
  - 1.3: gap-uri și slippage (L04);
  - 0.2: hazardul care desenează pattern-uri, mărimea eșantionului.
- **Checkpoint (test out ≥ 80%):** 15 întrebări:
  - 6 de identificare pe grafic (TAP sau classify după regula aplicației);
  - 3 de context (care dintre pattern-uri contează și de ce);
  - 3 numerice (R cu și fără confirmare; penetrarea în corp; HA close);
  - 3 de dovezi (nume vs date, rata de bază, rezultatul pe R0).
- **Laboratorul unității: Candle tally lab** (`tally-lab`, S7, mod onest):
  - **Setări:** cursantul alege un pattern acoperit în unitate și filtrele de context (trend anterior, zonă, confirmare: on/off).
  - **Înainte de rulare:** declară rata de inversare pe care o așteaptă (slider 0–100%).
  - **Rularea:** aplicația detectează pattern-ul cu regula din fișă pe 1,000 de drumuri R0 și pe 1,000 de drumuri R1 și R2 (fără pattern-uri plantate), apoi arată standard tally.
  - **Alături:** cardul Bulkowski al pattern-ului, cu domeniul lui.
  - **Concluzia așteptată:** pe R0, orice pattern dă ~50% și R mediu ≈ minus costurile. Pe regimuri, diferențele vin din regim (de exemplu, continuarea în R1), nu din numele pattern-ului.
- **Fire din spirală:**
  - **Dovezi:** rate de bază, R0, „names lie”.
  - **Statistică:** 50 de cazuri dau un interval de încredere larg, de circa ±14 puncte procentuale (pp); pattern-urile rare au eșantioane prea mici.
  - **Risc:** confirmarea mută intrarea și schimbă R-ul și mărimea.
  - **Costuri:** intrarea la close plătește spread-ul; la pattern-urile mici, costul ia o parte mare din R.
  - **Psihologie:** apofenia, confirmation bias.
  - **Proces:** regula se scrie înainte de grafic.
- **Surse:**
  - R2 §1.1–1.8 (tipuri de grafic), §2.0–2.3 (lumânări), §7.3 (confirmare vs anticipare), §8.1, §8.3–8.5;
  - R1 §2.4 (CH-02–CH-09, CH-13), §3.2 pct. 6, §4 pct. 1 și 5;
  - R3 §4.1.
- **Trimiteri:**
  - inside bars, outside bars, NR7, hikkake → 2.6.3;
  - gap-urile ca tipuri → 2.5.6;
  - Market Profile → 3.3.

### Lecțiile

#### 2.1.1 · Measuring a candle against its neighbours
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Classify a candle's body as long, short or doji by comparing it with the last 10 candles.
  2. Identify a marubozu, a spinning top, a high-wave candle and the four doji types from open, high, low and close.
  3. Explain why the same candle can count as long in a calm market and short in a volatile one.
- **Concepte:** candlestick ✓, volatility ✓, candle-vocabulary (nou)
- **Se sprijină pe:** 1.2 (L01, anatomia lumânării), 1.2 (timeframe), 1.5 (range și zgomot)
- **Hook:**
  - **Tip:** predict, alegere: "Long" · "Short" · "Can't tell yet"
  - **Prompt:** "This LABX candle opened at 100.00 and closed at 100.50. Is it a long candle?"
  - **Răspuns:** "Can't tell yet". Relevă două contexte:
    - liniștit, corp mediu 0.20: e lungă;
    - volatil, corp mediu 0.80: e scurtă.
- **Interacțiunea centrală:**
  1. Figură în 3 pași: lumânarea cu `Bracket` pe corp și pe fitile; banda „average body (10)” și „average range (10)” ca `Zone` estompată peste ultimele 10 lumânări; verdictul.
  2. Hotspot: "Tap the long-bodied candle", printre 12 lumânări.
  3. Slider de strictețe pentru doji, la 5%, 10% și 20% din range-ul mediu. Numărul de doji de pe grafic se schimbă (6 → 14 → 31 pe seria de exemplu; cifrele se fixează din seed).
  4. Match cu 6 forme ↔ nume: marubozu, spinning top, high-wave, long-legged doji, dragonfly, gravestone.
- **Try:**
  - **Widget:** `candle-meter`. Context fix: `avgBody10` = 0.30, `avgRange10` = 0.60.
  - **Obiectiv:** "Build a candle the app reads as a white marubozu."
  - **Reușită:** C > O, C − O > 0.30, iar ambele fitile < 0.06.
  - **Show me:** O 100.00, H 100.97, L 99.96, C 100.95.
- **Practică:**
  - Drill TAP în mod didactic (R2): "Tap every spinning top in 200 candles". Reveal: câte erau (spinning top-ul e a doua cea mai frecventă lumânare la Bulkowski). Numărul *e* lecția.
  - Candle tally lab: doji după 5 lumânări de creștere, pe R0 și R1.
- **Check:**
  - q-cdl-1 (mcq): ce face o lumânare „lungă”? Corpul față de corpul mediu, nu în vUSD absoluți.
  - q-cdl-2 (classify): din O/H/L/C, doji sau spinning top.
  - q-cdl-3 (scenario): un doji după un trend: o descriere a indeciziei, nu un semnal; rata ~50%.
- **Dovezi:**
  - **Mechanic** pentru măsurare: e o definiție.
  - **D · Unproven** pentru aceste lumânări folosite ca semnal (R2 §2.1.2–2.1.5, §2.0.4):
    - white marubozu: continuare 56%, rang 71/103;
    - white spinning top: 50%, rang 69/103;
    - long-legged doji: 51%, rang 37;
    - dragonfly: 50%, rang 98;
    - gravestone: 51%, rang 77;
    - Marshall, Young & Rose (2006): niciunul din 28 de semnale de lumânări nu a prezis prețul.
- **Necesită:** S7 (detecție și tally). `candle-meter` e o extindere a widget-ului existent.
- **Termeni noi de glosar:** marubozu, spinning-top, high-wave-candle, doji, long-legged-doji, dragonfly-doji, gravestone-doji. „Shadow” se adaugă ca `aka` la `wick`, nu ca termen nou.

**Fișa tehnică: pattern-urile lecției**

| Pattern | Regula aplicației | Rata de bază (Bulkowski, R2) |
|---|---|---|
| Long day (white / black) | corp > `avgBody10` | fără dovezi ca semnal independent |
| Very long day | corp > 3 × `avgBody10` | — |
| Short day | corp < `avgBody10` | — |
| Marubozu (white / black) | corp > `avgBody10`; ambele fitile < 0.1 × `avgRange10` | white: continuare 56%, rang 71/103, frecvență 27 |
| Opening / closing marubozu | la fel, dar doar fitilul de la capătul open, respectiv close, < 0.1 × `avgRange10` | — |
| Spinning top | corp < `avgBody10`; ambele fitile > corp | white: 50%, rang 69/103, frecvență 2 |
| High-wave | corp < `avgBody10`; ambele fitile > 2 × corp | fără dovezi |
| Doji | corp ≤ 0.1 × `avgRange10` | indecizie, nu semnal |
| Long-legged doji | doji; ambele fitile ≥ 0.4 × `avgRange10` (convenție a aplicației) | continuare 51%, rang 37 |
| Dragonfly doji | doji; fitilul de sus < 0.1 × `avgRange10`; cel de jos ≥ 0.5 × `avgRange10` (convenție) | 50%, rang 98/103 |
| Gravestone doji | oglinda: fitilul de jos foarte scurt, cel de sus lung | inversare în jos 51%, rang 77 |
| Four-price doji | O = H = L = C | semn de piață nelichidă sau oprită |
| Northern / southern doji | doji într-un trend urcător, respectiv coborâtor (etichetă de context, 2.1.3) | ~50% |

**Exemplu lucrat** (`avgBody10` = 0.30, `avgRange10` = 0.60):

| Lumânare | O / H / L / C | Măsurători | Verdict |
|---|---|---|---|
| A | 100.00 / 100.97 / 99.96 / 100.95 | corp 0.95 > 0.90 (3×); fitile 0.02 și 0.04 < 0.06 | very long, white marubozu |
| B | 100.50 / 100.80 / 100.20 / 100.54 | corp 0.04 ≤ 0.06; fitile 0.26 și 0.30 ≥ 0.24 | long-legged doji |
| C | 100.40 / 100.70 / 100.10 / 100.50 | corp 0.10 < 0.30; fitile 0.20 și 0.30 > 0.10 | spinning top. Nu e high-wave: fitilul de sus, 0.20, nu e strict peste 2 × 0.10. Caz de margine bun pentru feedback. |

#### 2.1.2 · Long shadows: hammers, shooting stars and their twins
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Identify a hammer, hanging man, inverted hammer and shooting star from the candle's shape and the trend before it.
  2. Explain why one shape gets two names, and name the two whose tested behaviour contradicts the name.
  3. Compare each pattern's reversal rate with the 50% coin-flip line.
- **Concepte:** rejection-candles (nou), trend ✓, base-rates ✓
- **Se sprijină pe:** 2.1.1, 1.5 (trend HH/HL, swing-uri), 0.2 (rate de bază)
- **Hook:**
  - **Tip:** predict, slider 0–100%, pas 1
  - **Prompt:** "Out of 100 hammers after a decline, in how many does price break upward first?"
  - **Răspuns:** 60 (Bulkowski). În recap: "Close to a coin flip."
- **Interacțiunea centrală:**
  1. Figură în 3 pași: aceeași formă pusă la baza unei scăderi (hammer), apoi în vârful unei creșteri (hanging man). Numele depinde de trend, nu de formă.
  2. Hotspot: "Tap the shooting star".
  3. Match cu 4 perechi (formă + trend anterior) ↔ nume.
  4. Reveal „names lie” cu două carduri claim/evidence: hanging man și inverted hammer.
- **Try:**
  - **Widget:** `pattern-tapper`, mod „find”, 60 de lumânări, mod didactic (3 hammers plantate).
  - **Obiectiv:** "Tap every hammer."
  - **Reușită:** toate 3 atinse și cel mult 1 atingere greșită.
  - **Motivele de respingere afișate:**
    - "No decline before it";
    - "Upper shadow too long";
    - "Lower shadow under 2× the body";
    - "Body not near the previous candle's low".
  - **Show me:** cele 3 marcate, cu măsurătorile lor.
- **Practică:**
  - Candle tally lab cu hammer, hanging man și shooting star, pe R0, R1 și R2; predicție înainte de fiecare rulare.
  - Arena: reversal, bearish.
- **Check:**
  - q-cdl-4 (classify): aceeași formă după o creștere → hanging man.
  - q-cdl-5 (mcq): ce arată datele pentru hanging man → continuare ~59%.
  - q-cdl-6 (numeric): raportul fitil de jos / corp, din O/H/L/C.
- **Dovezi:** **D · Unproven** pentru toate ca semnale de inversare (R2 §2.1.6–2.1.11, §2.0.4):
  - hammer: 60%, „not far from random”, rang 65/103;
  - shooting star: 59%, rang 55;
  - hanging man: se comportă ca *continuare* în sus ~59%, rang 87;
  - inverted hammer: *continuare* în jos ~65%, rang 6 ca semnal de continuare;
  - bullish belt hold: 71%, dar rang doar 62, pentru că o parte din mișcare s-a produs deja;
  - takuri: pagina Bulkowski nu a fost preluată.
- **Necesită:** S7
- **Termeni noi de glosar:** hammer, hanging-man, inverted-hammer, shooting-star, belt-hold, pin-bar, takuri-line

**Fișa tehnică: pattern-urile lecției**

| Pattern | Regula aplicației | Rata de bază (Bulkowski, R2) |
|---|---|---|
| Hammer | trend anterior coborâtor (regula din 2.1.3); corp < `avgBody10`; fitilul de jos ≥ 2 × corp (Bulkowski și Nison; TA-Lib cere doar > 1×, slider 1–3×); fitilul de sus < 0.1 × `avgRange10`; corpul aproape de sau sub minimul lumânării anterioare: min(O, C) ≤ L₋₁ + 0.2 × `avgRange5` (TA-Lib) | inversare în sus 60%, rang 65/103, frecvență 36; cel mai bine în treimea de jos a range-ului anual (nu se transferă la LABX) |
| Hanging man | aceeași geometrie, după o creștere; max(O, C) ≥ H₋₁ − 0.2 × `avgRange5` | continuare în sus ~59%, rang 87, frecvență 16 |
| Inverted hammer | după o scădere; corp scurt; fitilul de sus ≥ 2 × corp; fitilul de jos < 0.1 × `avgRange10`; gap de corp în jos față de corpul anterior (TA-Lib). Bulkowski folosește o variantă de 2 lumânări. | continuare în jos ~65% |
| Shooting star | după o creștere; corp scurt (nu doji); fitilul de sus ≥ 2 × corp; fitilul de jos < 0.1 × `avgRange10`; des cu gap în sus (Nison) | inversare în jos 59%, rang 55 |
| Takuri line | hammer cu fitilul de jos ≥ 3 × corp | fără statistică preluată; se tratează ca hammer |
| Belt hold (bull / bear) | după o scădere (creștere): corp lung, fără fitil la capătul open (< 0.1 × `avgRange10`), închidere aproape de extrem | bull: 71%, rang 62, frecvență 22 |
| Pin bar | numele din price action pentru un hammer sau un shooting star (R2 §2.1.12) | aceleași rezerve |

**Exemplu lucrat:**
- **Hammer:** O 99.40, H 99.55, L 98.60, C 99.50.
  - Corp 0.10. Fitilul de jos 99.40 − 98.60 = 0.80, adică 8 × corpul.
  - Fitilul de sus 0.05, sub 0.06 (0.1 × `avgRange10`, cu `avgRange10` = 0.60).
- **Același O/H/L/C după 10 lumânări de creștere:** hanging man.

#### 2.1.3 · Context first: trend, location, confirmation
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Apply three context checks (prior trend, location at a zone, a confirming close) to accept or reject a candle pattern.
  2. Calculate how waiting for confirmation changes the entry, the stop distance, the size and the reward-to-risk.
  3. Compare a pattern's results on a random-walk market with its results in context, using the tally lab.
- **Concepte:** pattern-context (nou), pattern-confirmation (nou), base-rates ✓, support-and-resistance ✓, reward-to-risk ✓, position-sizing ✓
- **Se sprijină pe:** 2.1.2, 1.5 (L06, zone S/R), 1.4 (L09 dimensionarea, L11 R:R), 0.2 (random walk)
- **Hook:**
  - **Tip:** predict, alegere
  - **Prompt:** "Two identical hammers. A forms after a 10-candle decline, at a support zone. B forms in the middle of a range. Which would you trade?"
  - **Variante:** "A, now" · "A, after the next candle confirms" ✓ · "B" · "Both"
- **Interacțiunea centrală:**
  1. `Flow` cu trei noduri: "Something to reverse?" → "At a zone?" → "Confirmed?". La fiecare nod, cursantul alege ramura pentru hammer-ul A, apoi pentru B.
  2. Worked „costul confirmării” (fișa). Ultimul pas îl calculează cursantul: R:R după confirmare = 1.07.
  3. Reveal pe R0: tally-ul hammer-ului fără context, 50/50 cu N afișat.
- **Try:**
  - **Widget:** `pattern-tapper`, mod „judge”: 6 pattern-uri marcate pe un grafic R2 în mod didactic.
  - **Sarcina:** pentru fiecare, "Trade" sau "Skip", cu motivul: "No prior trend" · "Not at a zone" · "Not confirmed" · "All three checks pass".
  - **Reușită:** 6/6 decizii corecte și cel puțin 5/6 motive corecte.
  - **Show me:** fiecare pattern cu cele trei bife colorate prin icon, nu prin culoare (PLAN_LEARN §8.2).
- **Practică:**
  - Candle tally lab: hammer și engulfing cu filtrele oprite, apoi pornite pe rând, pe R0 și R1.
  - Cursantul vede că pe R0 filtrele nu schimbă nimic, iar în R1 filtrul de trend primar schimbă rezultatul pentru că *regimul* are drift.
  - Arena: reversal, false breakout.
- **Check:**
  - q-cdl-7 (mcq): ce verificare de context lipsește într-un exemplu.
  - q-cdl-8 (numeric): R:R după confirmare.
  - q-cdl-9 (scenario): pattern-ul dă 50% pe R0; ce înseamnă asta pentru regulă.
- **Dovezi:**
  - **Mechanic:** confirmarea schimbă R-ul (aritmetică); pe R0 rata e 50% prin construcție.
  - **C · Mixed** pentru „contextul îmbunătățește lumânările” (R2 §2.0.3–2.0.4, §7.3):
    - regulile Bulkowski (tranzacționează pattern-urile bullish în trend primar urcător);
    - CMT Level II (pattern-uri la zone de S/R);
    - Greg Morris, care critică testele fără context;
    - Caginalp & Laurent (1998), pozitiv, față de Marshall et al. (2006), negativ.
    - Nu există un test curat al filtrului de context.
- **Necesită:** S7; S3 (zona desenată); S2 (SMA 10 pentru filtrul de trend; SMA există deja); S4 (4H, pentru trendul primar, opțional)
- **Termeni noi de glosar:** confirmation, base-rate (dacă nu îl adaugă deja Nivelul 0)

**Fișa tehnică: regulile de context** (R2 §2.0.3)

| # | Regula | Versiunea programabilă |
|---|---|---|
| 1 | Un pattern de inversare are nevoie de ceva de inversat | Pentru bullish: închiderea anterioară < SMA(10) și SMA(10) în scădere pe ultimele 3 lumânări, sau ≥ 3 maxime descrescătoare în ultimele 5 lumânări (convenție, după exemplul R2). Pentru bearish, oglinda. |
| 2 | Locația | Extremul pattern-ului la cel mult 0.5 × ATR(14) de o zonă: desenată de cursant sau detectată ca swing-uri atinse ≥ 2 ori |
| 3 | Confirmarea | Lumânarea următoare închide peste maximul pattern-ului (bullish) sau sub minimul lui (bearish) |
| 4 | Trendul primar | Panta SMA pe 4H în aceeași direcție (opțional; cere S4) |
| 5 | Mărimea | Range-ul pattern-ului ≥ 0.5 × ATR(14) (convenție) |
| 6 | Volumul | Volum ≥ 1.5 × media pe 20 (relative volume, 2.5.1; convenție) |

**Exemplu lucrat: costul confirmării** (hammer-ul din 2.1.2, buget 100.00 vUSD, înainte de costuri)

| | Intrare (ask) | Stop | R pe unitate | Unități (textbook) | Țintă: rezistența 101.50 | R:R |
|---|---|---|---|---|---|---|
| La close-ul hammer-ului | 99.50 + 0.05 = 99.55 | 98.60 − 0.10 = 98.50 | 1.05 | 95 | 1.95 | 1.86 |
| După confirmare (close 99.90) | 99.95 | 98.50 | 1.45 | 68 | 1.55 | 1.07 |

Confirmarea ridică rata de reușită (2.1.7), dar mută intrarea cu 0.40, micșorează poziția și scade R:R-ul. Comparația corectă e prin expectancy, nu prin win rate (R2 §7.3).

#### 2.1.4 · Engulfing and harami
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Identify bullish and bearish engulfing patterns from the real bodies only, ignoring shadows.
  2. Identify a harami and a harami cross, and relate them to the inside bar.
  3. Explain how a pattern can reverse 79% of the time and still rank 91st of 103.
- **Concepte:** engulfing-pattern (nou), harami-pattern (nou), expectancy ✓, pattern-context (nou, 2.1.3)
- **Se sprijină pe:** 2.1.3, 2.1.1, 1.4 (L11 expectancy)
- **Hook:**
  - **Tip:** predict, alegere: "Top 10" · "Middle" · "Bottom 15"
  - **Prompt:** "Bearish engulfing patterns reverse price about 79% of the time. Where do they rank among 103 candle patterns for overall performance?"
  - **Răspuns:** "Bottom 15" (91/103)
- **Interacțiunea centrală:**
  1. Figură în 3 pași: corpul 1 → corpul 2 îl acoperă → fitilele, care nu contează.
  2. Hotspot „Find the false engulfing”: fitilele sunt înghițite, dar corpurile nu.
  3. Worked: cazul de egalitate la un capăt. TA-Lib dă scorul 80 în loc de 100; aplicația îl acceptă, cu eticheta „edge case”.
  4. Reveal cu două metrici (R2 §2.2.2): rata de direcție și R mediu după costuri, una lângă alta, pe același tally.
- **Try:**
  - **Widget:** `pattern-tapper`, „find”, 80 de lumânări, mod didactic.
  - **Conținut:** 3 bullish engulfing valide și 3 capcane (2 care înghit doar fitilele, 1 fără scădere înainte).
  - **Obiectiv:** "Tap every bullish engulfing."
  - **Reușită:** 3/3 atinse și 0 capcane.
- **Practică:**
  - Candle tally lab cu engulfing bull și bear pe R0, R1, R2, cu rata și R-ul mediu.
  - Arena: reversal.
- **Check:**
  - q-cdl-10 (classify, din O/C): engulfing sau nu?
  - q-cdl-11 (mcq): harami = corp în interiorul corpului; inside bar = range în interiorul range-ului.
  - q-cdl-12 (scenario): 79% inversare, rang 91: mișcarea care urmează e mică, iar costurile o mănâncă.
- **Dovezi:** (R2 §2.2.1–2.2.4)
  - **C · Mixed** pentru engulfing:
    - bull: 63%, rang 84/103, frecvență 12; bear: 79%, rang 91/103;
    - Bulkowski: evită bullish engulfing în trend primar coborâtor; folosește-l pe pullback-uri în trend urcător;
    - Marshall et al. 2006: niciun efect.
  - **D · Unproven** pentru harami (53%, rang 38) și harami cross (fără statistică preluată).
- **Necesită:** S7
- **Termeni noi de glosar:** engulfing-pattern, harami, harami-cross

**Fișa tehnică: pattern-urile lecției**

| Pattern | Regula aplicației | Rata de bază |
|---|---|---|
| Bullish engulfing | C1 < O1 (negru); C2 > O2 (alb); O2 ≤ C1 și C2 ≥ O1, cu cel puțin o inegalitate strictă (egalitatea la un capăt dă scorul 80 în TA-Lib); trend anterior coborâtor; fitilele nu contează | 63%, rang 84/103, frecvență 12 |
| Bearish engulfing | oglinda: C1 > O1, C2 < O2, O2 ≥ C1 și C2 ≤ O1, cu o inegalitate strictă; după o creștere | 79%, rang 91/103, frecvență 11 |
| Bullish harami | corpul 1 lung (> `avgBody10`), negru; corpul 2 scurt (< `avgBody10`), alb; max(O2, C2) ≤ max(O1, C1) și min(O2, C2) ≥ min(O1, C1); după o scădere | 53% (continuare 47%), rang 38, frecvență 25 |
| Bearish harami | oglinda | fără cifră în R2 |
| Harami cross (bull / bear) | harami cu lumânarea 2 doji (corp ≤ 0.1 × `avgRange10`) | fără statistică preluată |

**Exemplu lucrat:**
- **Engulfing valid:** C1: O 101.00, C 100.20; C2: O 100.10, C 101.10.
  - O2 = 100.10 ≤ C1 = 100.20 ✓; C2 = 101.10 ≥ O1 = 101.00 ✓.
- **Capcană:** C2: O 100.30, H 101.20, L 100.00, C 100.90.
  - Range-ul acoperă lumânarea 1 (outside bar).
  - Corpul nu: O2 = 100.30 > C1 = 100.20.
  - Deci nu e engulfing.

**Legătura cu price action-ul:** engulfing-ul cere corpuri înghițite; outside bar-ul (2.6.3) cere range înghițit (R2 §2.1.12).

#### 2.1.5 · Piercing, dark cloud and the penetration scale
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Measure how far a second candle closes into the first candle's body, as a share of that body.
  2. Name the pattern at each depth: on-neck, in-neck, thrusting, piercing, engulfing.
  3. Identify tweezers and kickers, and state what the data says about each.
- **Concepte:** penetration-patterns (nou), engulfing-pattern (nou, 2.1.4)
- **Se sprijină pe:** 2.1.4, 2.1.3
- **Hook:**
  - **Tip:** predict, slider 99.80–101.20, pas 0.01
  - **Prompt:** "A long black candle ran from 101.00 down to 100.00. The next candle opens at 99.70. Where must it close before you'd call it bullish?"
  - **Răspuns de comparat în recap:** peste 100.50, mijlocul corpului (piercing). Sub mijloc, pattern-urile sunt clasificate ca *continuare bearish*.
- **Interacțiunea centrală:**
  1. `penetration-slider` (R2 §2.2.5, „continuum lesson”): tragi închiderea lumânării 2. Eticheta trece prin on-neck → (fără nume) → in-neck → thrusting → piercing → engulfing, iar săgeata teoriei se întoarce la mijloc.
  2. Callout: între on-neck și in-neck există o fâșie fără nume. Piața nu ține cont de nume.
  3. Hotspot tweezers, cu slider de toleranță (0.02 / 0.05 / 0.10 × `avgRange5`).
  4. „Debate card” pentru kicker: claim („one of the most powerful signals”), apoi statisticile. Cursantul alege cum îl tratează.
- **Try:**
  - **Widget:** `penetration-slider`, în doi pași.
  - **Obiectiv:** "Set the close so the pattern is a thrusting line. Then make it a piercing line."
  - **Reușită:** close ∈ [100.06, 100.50], apoi close ∈ [100.51, 100.99].
- **Practică:**
  - Candle tally lab: piercing vs thrusting pe R0 și R1.
  - Arena: bullish (dark cloud apare în creșteri).
- **Check:**
  - q-cdl-13 (numeric): penetrarea în procente. La close 100.70: (100.70 − 100.00) ÷ 1.00 = 70%.
  - q-cdl-14 (classify): numele după nivelul de close.
  - q-cdl-15 (mcq): kicker, claim vs date.
- **Dovezi:** (R2 §2.2.5–2.2.9)
  - **C · Mixed:**
    - piercing: 64%, rang 13/103, frecvență 40;
    - dark cloud cover: ~60%, rang 22, frecvență 46.
  - **D · Unproven:**
    - on-neck, in-neck, thrusting: pagini Bulkowski existente, statistici nepreluate;
    - tweezers bottom: continuare în jos 52%, „near random”, rang 44;
    - kicker: 53%, rang 96/103, frecvență 100/103, unul dintre cele mai rare. Afirmația populară contrazice datele.
- **Necesită:** S7
- **Termeni noi de glosar:** piercing-line, dark-cloud-cover, on-neck-line, in-neck-line, thrusting-line, tweezers, kicker

**Fișa tehnică: scara de penetrare**

Lumânarea 1: neagră, O 101.00, H 101.10, L 99.90, C 100.00. Corpul, 1.00, e peste `avgBody10` = 0.50, iar `avgRange5` = 1.00, deci toleranța Equal = 0.05. Lumânarea 2: albă, cu deschiderea 99.70, sub minimul anterior (Bulkowski cere deschidere sub minim; StockCharts spune „new low”).

| Close-ul lumânării 2 | Pattern | Teoria | Regula |
|---|---|---|---|
| 99.85–99.95 | On-neck | continuare bearish | close în L1 ± Equal |
| 99.96–99.99 | (fără nume) | — | — |
| 100.00–100.05 | In-neck | continuare bearish | C1 ≤ close ≤ C1 + Equal |
| 100.06–100.50 | Thrusting | continuare bearish | peste C1 + Equal și ≤ mijlocul (O1 + C1) ÷ 2 |
| 100.51–100.99 | Piercing line | inversare bullish | > mijloc și < O1 |
| ≥ 101.00 | Bullish engulfing | inversare bullish | C2 ≥ O1 (iar O2 ≤ C1 e deja adevărat) |

**Celelalte pattern-uri ale lecției:**

| Pattern | Regula aplicației | Rata de bază |
|---|---|---|
| Dark cloud cover | oglinda piercing-ului: după o creștere, O2 > H1, C2 < mijlocul corpului alb și C2 > O1 | ~60%, rang 22 |
| Tweezer bottom / top | \|L2 − L1\| ≤ 0.05 × `avgRange5` după o scădere (bottom); maximele egale după o creștere (top); orice culoare | bottom: continuare în jos 52%, rang 44 |
| Kicker (bull / bear) | marubozu negru, apoi marubozu alb care deschide peste O1 (gap); bear în oglindă; nu cere trend anterior | bull: 53%, rang 96, frecvență 100 |

Meeting lines și separating lines sunt pe foaia de referință din 2.1.8.

#### 2.1.6 · Stars, doji stars and abandoned babies
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Identify a morning star and an evening star, including the gap and where the third candle must close.
  2. Tell a star, a doji star and an abandoned baby apart by the middle candle and its gaps.
  3. Explain how relaxing the gap rule on markets that rarely gap changes the statistics.
- **Concepte:** star-patterns (nou), pattern-confirmation (nou, 2.1.3), gap-risk ✓
- **Se sprijină pe:** 2.1.5, 2.1.1 (doji), 1.3 (gap-uri, L04)
- **Hook:**
  - **Tip:** predict, slider pentru close-ul lumânării 3, între 100.80 și 102.20, pas 0.01
  - **Prompt:** "Candle 1 fell from 102.00 to 101.00. Candle 2 is a small star below it. Where must candle 3 close to complete a morning star?"
  - **Răspuns:** cel puțin 101.50, mijlocul corpului 1 (Bulkowski). TA-Lib acceptă de la 101.30 în sus. Comparat în recap.
- **Interacțiunea centrală:**
  1. BUILD: "make the smallest valid morning star". Tragi O/C pe 3 lumânări, iar regulile se aprind una câte una.
  2. Match pe 3 tripleți: star · doji star · abandoned baby.
  3. Comutator „Continuous market (no gaps)”: regula de gap se relaxează, numărul de detecții sare, iar rata se schimbă (R2 §2.3.1, misuse).
- **Try:**
  - **Widget:** `star-builder`. Context: `avgBody10` = 0.40, `avgRange10` = 0.60.
  - **Obiectiv:** "Build a morning doji star."
  - **Reușită:**
    - c1 negru, cu corpul > 0.40;
    - c2 cu corpul ≤ 0.06 și max(O2, C2) < C1;
    - c3 alb, cu C3 ≥ (O1 + C1) ÷ 2.
- **Practică:**
  - Candle tally lab cu morning star, cu gap strict și cu gap relaxat, pe R0 și R1.
  - Pe date 24h, gap-urile sunt rare: N mic, interval larg.
  - Arena: reversal.
- **Check:**
  - q-cdl-16 (match pe 3 tripleți).
  - q-cdl-17 (numeric): pragul pentru c3, la mijlocul corpului.
  - q-cdl-18 (mcq): de ce cifrele pentru abandoned baby vin cu eșantioane mici.
- **Dovezi:** (R2 §2.3.1–2.3.4, §2.3.8, §2.0.4)
  - **C · Mixed** pentru stele:
    - morning star: 78%, rang 12, frecvență 66;
    - evening star: 72%, rang 4/103;
    - morning doji star: 76%, rang 8;
    - bullish abandoned baby: 70%, rang 9, frecvență 92/103 (rar);
    - o parte din rată e mecanică: lumânarea 3 *este* deja începutul mișcării;
    - Caginalp & Laurent 1998: pattern-uri de inversare de 3 zile semnificative out-of-sample; Marshall et al. 2006 nu confirmă.
  - **D · Unproven:** doji star cu 2 lumânări (fără statistică; așteaptă lumânarea 3) și tri-star (rar).
- **Necesită:** S7; gap-uri în generator (există în R4 și în event shock)
- **Termeni noi de glosar:** morning-star, evening-star, doji-star, abandoned-baby, tri-star, window

**Fișa tehnică: pattern-urile lecției**

| Pattern | Regula aplicației | Rata de bază |
|---|---|---|
| Morning star | c1 negru lung (> `avgBody10`); c2 cu corp scurt și gap de corp în jos: max(O2, C2) < C1; c3 alb cu corp > scurt, C3 ≥ (O1 + C1) ÷ 2. Implicit Bulkowski; TA-Lib cere doar C3 > C1 + 0.3 × corp1 (`optInPenetration`). | 78%, rang 12, frecvență 66 |
| Evening star | oglinda la vârf | 72%, rang 4/103, frecvență 71 |
| Morning / evening doji star | ca mai sus, cu c2 doji | morning: 76%, rang 8; evening: fără cifră în R2 |
| Doji star (bull / bear, 2 lumânări) | c1 lung; c2 doji cu gap de corp în direcția trendului | fără statistică; avertisment, nu semnal |
| Abandoned baby (bull / bear) | c1 negru; c2 doji cu H2 < L1 și H2 < L3 (gap de fitile pe ambele părți); c3 alb. Bear în oglindă. | bull: 70%, rang 9, frecvență 92 |
| Tri-star | trei doji, cel din mijloc cu gap de corp față de vecini | rar, fără dovezi |
| Rising / falling window | L > H₋₁, respectiv H < L₋₁: gap-ul în terminologia lui Nison | vezi gap-urile, 2.5.6 |

**Exemplu lucrat:**
- c1: O 102.00, C 101.00 (corp 1.00).
- c2: O 100.80, C 100.70 (corp 0.10, sub C1).
- c3: O 100.90, C 101.60.
- Verificare:
  - mijlocul corpului 1 e 101.50, iar 101.60 ≥ 101.50 ✓;
  - pragul TA-Lib e 101.00 + 0.30 = 101.30 ✓.

**Comparație:** abandoned baby ↔ island reversal (2.5.6). Aceeași idee, la scara unei lumânări, respectiv a unui grup de lumânări (CMT Level II, R2 §2.3.4).

#### 2.1.7 · Confirmation built in: three-candle patterns
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Identify three white soldiers, three black crows, three inside up/down and three outside up/down.
  2. Explain why patterns that include their own confirmation candle show higher reversal rates, and what that costs.
  3. Calculate the reward-to-risk of entering at the close of three white soldiers with a stop below the pattern.
- **Concepte:** confirmed-candle-patterns (nou), pattern-confirmation (nou, 2.1.3), reward-to-risk ✓
- **Se sprijină pe:** 2.1.4 (harami, engulfing), 2.1.3, 1.4 (L11)
- **Hook:**
  - **Tip:** predict, slider 40–90%, pas 1
  - **Prompt:** "A bullish harami reverses about 53% of the time. Add one confirming candle and it becomes three inside up. Guess the new rate."
  - **Răspuns:** 65%. În recap: "Higher rate, later entry."
- **Interacțiunea centrală:**
  1. Reveal în doi pași (R2 §2.3.6): harami → three inside up pe același tally, cu rata și R-ul mediu după costuri. Rata crește; R-ul mediu se schimbă puțin sau deloc, pentru că intrarea vine mai târziu.
  2. Match: soldiers · advance block · deliberation, după forma corpurilor și a fitilelor.
  3. Worked: soldiers cu stop sub pattern. Ultimul pas îl calculează cursantul: R:R = 0.40.
- **Try:**
  - **Widget:** `risk-reward` (varianta L11, cu câmpurile Entry / Stop / Target). Entry blocat la 102.05, Target blocat la 103.00 (rezistența), Stop editabil, start 101.50.
  - **Obiectiv:** "Put the stop 0.10 below the pattern's low and read the reward-to-risk."
  - **Reușită:** stop = 99.70; widget-ul arată 0.40 : 1.
  - **Feedback la reușită:** "Right. The three candles already used most of the room to resistance. Skip it or wait for a pullback."
- **Practică:**
  - Candle tally lab cu harami vs three inside up, engulfing vs three outside up, cu rata *și* R-ul mediu. Pe R0, ambele variante dau ~50% și R ≈ minus costurile.
  - Arena: bullish, breakout.
- **Check:**
  - q-cdl-19 (classify): three inside sau three outside.
  - q-cdl-20 (numeric): R:R pentru soldiers.
  - q-cdl-21 (mcq): de ce rata e mai mare. Parțial mecanic: a treia lumânare e deja mișcarea.
- **Dovezi:** (R2 §2.3.5–2.3.7, §2.0.4, §7.3)
  - **C · Mixed:**
    - three white soldiers: 82%, rang 32;
    - three black crows: 78%, locul 3 general;
    - identical three crows: 79%;
    - three inside up: 65%, rang 20, frecvență 31, față de harami, 53%;
    - three outside up: 75%;
    - replicarea pe 60 de acțiuni din Johannesburg: doar three outside down a fost predictiv.
  - **D · Unproven:** advance block și deliberation (fără statistici).
- **Necesită:** S7
- **Termeni noi de glosar:** three-white-soldiers, three-black-crows, three-inside-up-down, three-outside-up-down, advance-block

**Fișa tehnică: pattern-urile lecției**

| Pattern | Regula aplicației | Rata de bază |
|---|---|---|
| Three white soldiers | 3 lumânări albe consecutive, cu corp > `avgBody10`; fiecare close > close-ul anterior; fiecare open în corpul anterior (O₋₁ < Oᵢ ≤ C₋₁); fitilul de sus < 0.1 × `avgRange10`; trend anterior coborâtor (Bulkowski) | 82%, rang 32 |
| Three black crows | oglinda; fiecare close aproape de minim; după o creștere | 78%, locul 3 |
| Identical three crows | crows cu \|Oᵢ − C₋₁\| ≤ 0.05 × `avgRange5` | 79% |
| Advance block | soldiers cu corpuri în scădere (corp3 < corp2 < corp1) și fitile de sus în creștere | avertisment, fără statistică |
| Deliberation (stalled) | soldiers cu al treilea corp < `avgBody10` | avertisment, fără statistică |
| Three inside up / down | harami bullish (2.1.4) + c3 alb care închide peste O1 (TA-Lib; Bulkowski cere doar peste C2). Implicit: TA-Lib, varianta mai strictă. Down în oglindă. | up: 65%, rang 20 |
| Three outside up / down | bullish engulfing + c3 cu C3 > C2; down în oglindă | up: 75%; down: singurul predictiv în replicarea JSE |

**Exemplu lucrat** (înainte de costuri):
- **Lumânările:**
  - c1: O 99.90, L 99.80, C 100.60;
  - c2: O 100.40, C 101.30 (open în corpul c1 ✓);
  - c3: O 101.10, C 102.00 (open în corpul c2 ✓).
- **Intrarea:** 102.00 + 0.05 = 102.05. **Stop-ul:** 99.80 − 0.10 = 99.70. **R pe unitate:** 2.35.
- **Rezistența:** la 103.00. Reward 0.95, deci R:R = 0.95 ÷ 2.35 = 0.40.
- **Dimensionare:** la 100.00 vUSD, 42 de unități (textbook).

#### 2.1.8 · When names lie: the pattern zoo
- **Nivel / durată / tip:** Intermediate · 7 min · Core (foaia de referință rămâne în Library)
- **Obiective:**
  1. Name three patterns whose tested behaviour contradicts their textbook meaning.
  2. Judge any unfamiliar pattern with a five-question reference card: rule, sample size, base rate, result after costs, scope.
  3. Show with the lab that named and unnamed random shapes perform alike on a random walk.
- **Concepte:** pattern-name-vs-evidence (nou), base-rates ✓, confirmation-bias ✓
- **Se sprijină pe:** 2.1.2–2.1.7, 0.2 (eșantion)
- **Hook:**
  - **Tip:** predict, alegere: "Down, as taught" · "Up" · "50/50"
  - **Prompt:** "The bearish three-line strike is taught as a signal that the fall continues. In Bulkowski's data, which way does price usually break?"
  - **Răspuns:** "Up": inversare bullish în 84% din cazuri, locul 1 general.
- **Interacțiunea centrală:**
  1. Patru carduri predict → reveal, „names lie”: hanging man, inverted hammer, bearish three-line strike, matching low.
  2. Cardul „How to judge any pattern”, construit în 5 pași, câte o întrebare pe pas:
     - "Exact rule?"
     - "How many cases?"
     - "Rate vs 50%?"
     - "Result after costs?"
     - "Which market, timeframe and years?"
  3. Jocul `name-generator` (R2 §2.3.15).
- **Try:**
  - **Widget:** `name-generator`, R0, mod onest.
  - **Obiectiv:** "Play 20 rounds: predict up or down after each 3-candle shape, some named, some random."
  - **Reușită:** 20 de runde jucate și răspunsul corect la întrebarea de debrief: "Did named shapes beat unnamed ones here?" → "No, both sit near 50% within the band shown".
- **Practică:**
  - Candle tally lab pe 4 pattern-uri din zoo, pe R0 și R1.
  - Cardurile din Library pentru fiecare pattern de pe foaie.
- **Check:**
  - q-cdl-22 (mcq): care pattern se poartă opus numelui său.
  - q-cdl-23 (scenario): un pattern rar cu 86% din puține cazuri. Ce întrebi? Eșantionul.
  - q-cdl-24 (order): pune în ordine cele 5 întrebări ale cardului.
- **Dovezi:** (R2 §2.2.11–2.2.12, §2.3.9–2.3.15, §8.3 pct. 5–6, §8.4 pct. 7)
  - **D · Unproven** pentru afirmațiile din manuale despre pattern-urile de pe foaie.
  - **C · Mixed** pentru observațiile inverse: un singur set de date (Bulkowski), acțiuni americane, o singură epocă.
- **Necesită:** S7, inclusiv generatorul de forme aleatoare de 3 lumânări
- **Termeni noi de glosar:** three-line-strike, rising-three-methods, tasuki-gap, matching-low

**Fișa tehnică: foaia de referință (Library)**

Regulile folosesc notațiile din Convenții. „—” = fără statistică în R2 (paginile Bulkowski există, dar nu au fost preluate).

| Pattern | Regula pe scurt | Ce spune numele | Ce arată datele (R2) |
|---|---|---|---|
| Hanging man (recap) | 2.1.2 | bearish | continuare în sus ~59%, rang 87 |
| Inverted hammer (recap) | 2.1.2 | bullish | continuare în jos ~65% |
| Three-line strike, bearish | 3 lumânări negre în scădere; a 4-a, albă, deschide sub ultima și închide peste O-ul primei | continuare bearish | **inversare în sus 84%, locul 1 general** |
| Three-line strike, bullish | oglinda | continuare bullish | **inversare în jos 65%, locul 2** |
| Matching low | 2 lumânări negre cu \|C2 − C1\| ≤ 0.05 × `avgRange5`, în scădere | suport, bullish | **continuare în jos 61%** |
| Two black gapping | gap în jos, apoi 2 lumânări negre | bearish | continuare în jos 68%, top 10 (numele se confirmă) |
| Homing pigeon | 2 lumânări negre, corpul 2 în corpul 1, în scădere | inversare bullish | — |
| Last engulfing top / bottom | engulfing „contra așteptării” la capătul trendului | inversare | — |
| Meeting lines | culori opuse, ambele corpuri lungi, \|C2 − C1\| ≤ Equal; seamănă cu in-neck (2.1.5) | inversare | — |
| Separating lines | culori opuse, \|O2 − O1\| ≤ Equal, a doua în direcția trendului | continuare | — |
| Rising three methods | alb lung; 3 corpuri mici în range-ul H–L al primei; a 5-a albă lungă, cu close la maxim nou | continuare | continuare 74%, dar rang 94, frecvență 88 (rar) |
| Falling three methods | oglinda | continuare | — |
| Mat hold | ca rising three methods, dar lumânările mici fac întâi gap în sus | continuare | — |
| Upside tasuki gap | alb lung; alb cu gap în sus; negru care deschide în corpul 2 și închide în gap, fără să-l umple | continuare | continuare 57%, locul 5 general |
| Downside tasuki gap | oglinda | continuare | — |
| Upside / downside gap three methods | ca tasuki, dar lumânarea 3 umple gap-ul | continuare (teorie) | — („gap umplut sau nu” e toată diferența) |
| Breakaway (bull / bear) | gap în direcția trendului, 3 lumânări tot mai încete, apoi una lungă opusă care închide în gap | inversare | bearish: 63%, locul 10 general |
| Two crows / upside gap two crows | după creștere: alb lung, negru cu gap în sus, al doilea negru (care, la upside gap two crows, îl înghite pe primul negru și închide peste C1) | bearish | — |
| Unique three river bottom | secvență bullish rară | bullish | — |
| Three stars in the south | secvență bullish rară | bullish | 86%, locul 1 pe lista de inversare, dar extrem de rar |
| Stick sandwich | două corpuri negre cu close-uri egale, cu un corp alb între ele | bullish | — |
| Ladder bottom, concealing baby swallow, side-by-side white lines, above / below the stomach, collapsing doji star, 8/10/12/13 new price lines | catalog (R2 §2.3.15) | diverse | individual slabe sau netestate; prea rare |
| Hikkake | inside bar, apoi breakout fals, apoi ieșire prin partea opusă | — | vezi 2.6.3 |
| Tri-star | 2.1.6 | — | — |

#### 2.1.9 · Other ways to draw price: Heikin-Ashi, Renko, point & figure
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Calculate a Heikin-Ashi candle from real open, high, low and close values.
  2. Build Renko bricks and point & figure columns from a list of prices, given the box size and the reversal.
  3. Explain why stops, fills and backtests must use real prices, not Heikin-Ashi or Renko prices.
- **Concepte:** alternative-chart-types (nou), candlestick ✓, trend ✓
- **Se sprijină pe:** 1.2 (line, bar și candle; timeframe; ce ascunde graficul line), 2.1.1. Lag-ul se explică direct din formula HA. ATR ca mărime a cărămizii se predă abia în 2.4.6, deci aici boxurile sunt fixe.
- **Hook:**
  - **Tip:** predict, alegere: "Red" · "Green"
  - **Prompt:** "Real candle 3 closed red, down 0.80 from its open. Will the Heikin-Ashi candle 3 be red too?"
  - **Răspuns:** "Green": HA O 100.675, C 100.775. HA rămâne în urmă.
- **Interacțiunea centrală:**
  1. Worked HA pe 4 lumânări (fișa). Ultimul pas îl calculează cursantul: HA close 4 = 100.15.
  2. `chart-type-switch` pe aceeași serie: real ↔ HA, cu `Marker` unde culorile diferă.
  3. Renko: 8 close-uri devin 3 cărămizi, iar timpul dispare de pe axa x.
  4. P&F: quiz de construcție pas cu pas, cu 3 variante la fiecare pas: "Plot X" · "Plot O" · "New column?".
  5. Recap line/bar din 1.2: un gap ascuns de graficul line ("What the line didn't tell you").
- **Try:**
  - **Widget:** `chart-type-switch` cu seria din fișă, vizualizare HA.
  - **Obiectiv:** "Exit a long on the first red Heikin-Ashi candle. Type the real price you would have sold at."
  - **Reușită:** 99.85, adică close-ul real al lumânării 4 (99.90), la bid. Toleranță 0.
  - **Feedback la răspunsul 100.15:** "That's the HA close. Nobody traded there. Fills use real prices."
- **Practică:**
  - Laborator (S7, mod onest): regula „ieși la prima lumânare HA de culoare opusă”, pe R1 și R0, cu execuții la prețuri reale (R2 §1.4). Se vede costul lag-ului.
  - Slider pe mărimea cărămizii Renko (0.25–1.00): „trendul” apare și dispare.
  - Arena: bullish în vizualizarea HA (S4).
- **Check:**
  - q-cdl-25 (numeric): HA close = (O + H + L + C) ÷ 4.
  - q-cdl-26 (mcq): de ce un backtest la prețuri HA e fals.
  - q-cdl-27 (scenario): Renko ascunde timpul, iar cu ATR boxuri se poate redesena retroactiv.
- **Dovezi:** (R2 §1.1–1.10)
  - **Mechanic** pentru construcții: prețurile HA nu sunt prețuri tranzacționate.
  - **D · Unproven** pentru afirmațiile predictive:
    - HA ca semnal de trend;
    - inversarea Renko la 2 cărămizi;
    - numărătorile P&F (semnalele P&F sunt totuși bazate pe reguli, deci testabile).
  - Kagi, three-line break, range bars, tick/volume bars: fără dovezi; doar Library.
- **Necesită:** S4 (line, bar, Heikin-Ashi, Renko, point & figure), S7
- **Termeni noi de glosar:** heikin-ashi, renko, point-and-figure, box-size, reversal-amount

**Fișa tehnică**

**Heikin-Ashi** (StockCharts, R2 §1.4):
- HA-Close = (O + H + L + C) ÷ 4;
- HA-Open = (HA-Open₋₁ + HA-Close₋₁) ÷ 2;
- HA-High = max(H, HA-Open, HA-Close); HA-Low = min(L, HA-Open, HA-Close);
- prima lumânare pornește de la HA-Open = (O + C) ÷ 2. Efectul acestui punct de start dispare după 7–10 lumânări.

| # | Real O / H / L / C | HA O | HA H | HA L | HA C | Culoare HA |
|---|---|---|---|---|---|---|
| 1 | 100.00 / 101.00 / 99.60 / 100.80 (verde) | 100.400 | 101.00 | 99.60 | 100.350 | roșie (efectul punctului de start) |
| 2 | 100.80 / 101.40 / 100.50 / 101.20 (verde) | 100.375 | 101.40 | 100.375 | 100.975 | verde |
| 3 | 101.20 / 101.30 / 100.20 / 100.40 (roșie) | 100.675 | 101.30 | 100.20 | 100.775 | **verde** (lag) |
| 4 | 100.40 / 100.60 / 99.70 / 99.90 (roșie) | 100.725 | 100.725 | 99.70 | 100.150 | roșie |

Widget-ul afișează 2 zecimale, rotunjite half-up: 100.68 și 100.78. Figura începe de la lumânarea 2, ca efectul punctului de start să nu încurce.

**Renko** (box 0.50, doar close-uri, inversare la 2 cărămizi):
- close-uri: 100.00, 100.30, 100.70, 101.20, 100.90, 100.40, 100.10, 99.80;
- cărămizi:
  - în sus, 100.00–100.50, la 100.70;
  - în sus, 100.50–101.00, la 101.20;
  - în jos, 100.50–100.00, la 99.80 (inversarea cere un close ≤ 100.00, adică 2 cutii sub vârful 101.00);
- 8 close-uri, 3 cărămizi.

**Point & figure** (box 1.00, inversare la 3 cutii):
- 100 → 104: coloana X cu 101, 102, 103, 104;
- coborârea la 101 (3 cutii): coloana O cu 103, 102, 101;
- urcarea la 105: coloana X cu 102, 103, 104, 105;
- 105 depășește maximul coloanei X anterioare (104): **double-top breakout**.

**Restul, doar în Library** (R2 §1.7–1.10): Kagi (yin/yang), three-line break, range bars, tick/volume/dollar bars. Fiecare cu definiția, câte un exemplu și nota D.

---

## 2.2 · Chart patterns (10 lecții)

### Fișa unității

- **Scop:**
  - trendline-urile și canalele, din care se construiesc pattern-urile;
  - anatomia comună a oricărui pattern: trend anterior, granițe, volum, breakout și confirmare, țintă, invalidare, comportament după breakout, context;
  - toate pattern-urile de reversal și de continuare, cu reguli de identificare, filtre de confirmare (close beyond, 3%, multiplu de ATR, timp), ținta măsurată și scalată, ratele de eșec Bulkowski;
  - cum arată fiecare pattern în date aleatoare;
  - pattern-urile eșuate și „busted”, și decăderea statisticilor în timp.
- **De ce aici:**
  - După lumânări (2.1), cursantul are deja obiceiul „context, confirmare, rată de bază”; aici îl aplică pe structuri mai mari.
  - Ordinea din R1 §3.4 pct. 3: structură → lumânări în context → indicatori puțini → pattern-uri cu rate de bază și filtre de confirmare (CMT 3% / ATR). Aici pattern-urile vin înaintea indicatorilor, pentru că se sprijină doar pe linii, zone și breakout-uri (1.5).
  - Indicatorii din 2.3–2.4 nu sunt necesari pentru pattern-uri, iar ATR-ul folosit în filtre se folosește aici ca număr dat. Calculul lui vine în 2.4.6.
- **Se sprijină pe:**
  - 1.5: swing-uri, zone S/R, breakout și false breakout (L05, L06);
  - 1.4: stop la invalidare, R:R (L10, L11);
  - 1.2: scara log;
  - 2.1.3: context și confirmare;
  - 0.2: random walk.
- **Checkpoint (test out ≥ 80%):** 15 întrebări:
  - 5 de desen sau identificare (neckline, granițe, nivel de confirmare);
  - 4 numerice (ținta scalată, nivelul de confirmare cu 3% vs ATR);
  - 3 de dovezi (bias-ul de breakout din date, „names lie” la triunghiul descendent, eșecul în anii 2000);
  - 3 de proces (anticipare vs confirmare, plan pentru „busts”, pattern pe R0).
- **Laboratorul unității: Patterns in noise** (`tally-lab`, S7, mod onest; R2 §8.5 pct. 1 și 6):
  - Aplicația detectează automat H&S (regula Lo-Mamaysky-Wang), double tops și bottoms și triunghiuri pe 10,000 de drumuri R0.
  - Arată cât de des apar la 1,000 de lumânări și distribuția randamentelor după ele, suprapusă peste distribuția necondiționată: pe R0 sunt identice.
  - Același scan pe R1 și R2 arată ce se schimbă când regimul are structură.
  - Partea a doua (2.2.3): anticipare vs confirmare la double tops, comparate prin expectancy.
- **Fire din spirală:**
  - **Dovezi:** statistici Bulkowski cu domeniul lor; failure rates dublate în anii 2000; LMW, „informație incrementală, nu profit”.
  - **Risc:** pattern-ul ca structură pentru stop („where am I wrong?”).
  - **Statistică:** % meeting target ca factor de scalare; eșantionul.
  - **Psihologie:** apofenia; „pattern-ul e evident după” (hindsight).
  - **Proces:** plan pre-scris pentru works / fails / busts.
  - **Costuri:** filtrele de confirmare cumpără siguranță cu preț de intrare.
- **Surse:**
  - R2 §3.4–3.5 (trendlines, canale), §3.7 (role reversal), §3.12 (breakout-uri, filtre), §4.0–4.27 (pattern-uri și tabelul master), §7.3, §8.1, §8.3, §8.5;
  - R1 §2.5 (CP-01–CP-17), §2.6 (TR-05, TR-06);
  - R3 §4.5, §4.12, §4.14.
- **Trimiteri:** armonice, Wolfe waves în profunzime și Elliott → 3.4; detecția algoritmică și backtesting-ul riguros → 3.11.

### Lecțiile

#### 2.2.1 · Drawing lines that mean something: trendlines and channels
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Draw a valid trendline through two swing lows and confirm it with a third touch.
  2. Draw a parallel channel, and explain why a fitted regression channel cannot be used in a backtest.
  3. Treat a trendline break as a warning to confirm, not as a signal on its own.
- **Concepte:** trendlines-and-channels (nou), trend ✓, support-and-resistance ✓
- **Se sprijină pe:** 1.5 (swing-uri, zone, L05, L06), 1.2 (scara log)
- **Hook:**
  - **Tip:** predict, alegere: "Most of the time" · "About half the time" · "Rarely"
  - **Prompt:** "Ten analysts draw support and resistance on the same chart. How often do their levels match?"
  - **Răspuns:** "Rarely". În studiul lui Osler (2000), firmele care publicau niveluri au coincis în ~30% din cazuri (R2 §3.4).
- **Interacțiunea centrală:**
  1. `line-drawer`: ancorele se lipesc de swing lows. Regulile se aprind pe rând (StockCharts, R2 §3.4):
     - două puncte trasează linia, al treilea o confirmă;
     - al doilea minim e mai sus decât primul;
     - punctele sunt spațiate rezonabil;
     - linia nu e forțată;
     - cu cât linia e mai abruptă, cu atât e mai puțin validă.
  2. Vizualizarea „Many analysts”: 10 linii valide, trasate algoritmic pe același grafic.
  3. Comutatorul log ↔ linear pe o serie cu creștere exponențială: „ruperea” apare doar pe una dintre scale.
  4. „Freeze and forward-play”: canalul desenat rămâne fix, iar lumânările noi apar peste el.
- **Try:**
  - **Widget:** `line-drawer`, mod didactic R1, ATR(14) afișat.
  - **Obiectiv:** "Draw an uptrend line through two swing lows, so that a third low confirms it."
  - **Reușită:**
    - ambele ancore la ≤ 0.25 × ATR(14) de swing lows reale (indici fixați în conținut);
    - o a treia atingere la ≤ 0.25 × ATR;
    - nicio închidere sub linie între ancore.
  - **Indicii:**
    1. "Anchor on swing lows, not on any low."
    2. "The second low must be higher than the first."
    3. "Wicks for drawing, closes for breaks."
- **Practică:**
  - Drill-uri DRAW în mod didactic.
  - Predict → reveal după o rupere ("reversal or continuation?"), cu tally pe R1 și R0.
  - Arena: bullish, bearish (instrumentele de desen S3).
- **Check:**
  - q-cp-1 (mcq): ce face o trendline validă.
  - q-cp-2 (scenario): linia s-a rupt. Ce confirmă schimbarea: un nivel orizontal rupt sau regula peak-trough?
  - q-cp-3 (mcq): canalul de regresie folosește date viitoare (look-ahead).
- **Dovezi:**
  - **Mechanic:** geometria și scara.
  - **D · Unproven:** „ruperea trendline-ului prezice inversarea”. Nu există dovezi robuste, iar desenul e foarte subiectiv; vezi acordul de ~30% din Osler (R2 §3.4–3.5, §1.11).
- **Necesită:** S3 (trendline, canal), S4 (scara log)
- **Termeni noi de glosar:** trendline, channel

**Fișa tehnică**

| Element | Regula aplicației |
|---|---|
| Trendline urcător | ancore pe două swing lows (N = 3 lumânări de fiecare parte, convenție), cu al doilea minim mai sus; validat de o a treia atingere la ≤ 0.25 × ATR |
| Wick vs close | desenul pe fitile, ruperea pe închideri (convenția cea mai predată; R2 §3.4) |
| Rupere | close sub linie cu ≥ 0.25 × ATR. E un *avertisment*: se confirmă cu un nivel orizontal sau cu regula peak-trough (2.3.1). |
| Canal paralel | trendline + paralela prin swing-ul opus cel mai extrem |
| Canal de regresie | regresie liniară ± k σ. Se potrivește pe date trecute, deci se redesenează. Doar ca ilustrație. |
| Andrews' pitchfork | doar în Library (R2 §3.5, neverificat) |

Canalele bar-cu-bar (tight, broad, micro) revin în 2.6.5.

#### 2.2.2 · Anatomy of a chart pattern
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Name the eight parts of any chart pattern, from the prior trend to what happens after the breakout.
  2. Confirm a breakout with a close beyond the boundary, and compare a 3% filter with an ATR filter on LABX.
  3. Calculate a pattern target from its height, scaled by the share of past patterns that reached the full target.
- **Concepte:** chart-pattern-anatomy (nou), breakout-confirmation-filters (nou), pattern-target (nou), breakout ✓, false-breakout ✓, invalidation-level ✓
- **Se sprijină pe:** 2.2.1, 1.5 (L06 breakout-uri), 1.4 (L10 stop la invalidare)
- **Hook:**
  - **Tip:** predict, slider 0–100%, pas 1
  - **Prompt:** "Textbooks project a head-and-shoulders top's full height below the neckline. How often did price actually get there?"
  - **Răspuns:** 51% (Bulkowski). În recap: "So scale the target."
- **Interacțiunea centrală:**
  1. Figură în 8 pași pe un dreptunghi, câte o parte pe pas (R2 §4.0):
     - trendul anterior;
     - granițele și atingerile (≥ 3 pe o linie, ≥ 2 pe cealaltă);
     - volumul în scădere;
     - breakout-ul și confirmarea;
     - regula de măsură;
     - invalidarea;
     - throwback / pullback;
     - modificatorii de context.
  2. `filter-slider` pe același set de breakout-uri (R2 §3.12): 0% · 1% · 3% · 0.25 / 0.5 / 1 / 2 × ATR · 2 închideri. Contoarele arată „false breakouts avoided” și „average entry given up”.
  3. Worked „target scalat” (fișa), cu input pe ultimul pas.
- **Try:**
  - **Widget:** `filter-slider`, 200 de breakout-uri sintetice din R1 și R2, mod onest.
  - **Obiectiv:** "Pick a filter that removes at least half of the false breakouts while giving up no more than 0.30 of entry price on average."
  - **Reușită:** false evitate ≥ 50% și intrarea pierdută ≤ 0.30. Setul de filtre valide se fixează din seed (estimare de design: 0.5–1 ATR).
- **Practică:**
  - Laboratorul de filtre pe R1, R2 și R0: pe R0, niciun filtru nu schimbă expectancy, doar numărul de trade-uri.
  - Arena: breakout, false breakout.
- **Check:**
  - q-cp-4 (order): cele 8 părți.
  - q-cp-5 (numeric): nivelul de confirmare la 104.00, cu 3% vs 0.5 ATR (107.12 vs 104.20).
  - q-cp-6 (numeric): ținta = înălțimea × % met.
- **Dovezi:** (R2 §4.0, §3.12, §4.27)
  - **Mechanic:** aritmetica țintei și a filtrelor.
  - **C · Mixed:** „pattern-urile prezic”:
    - Lo, Mamaysky & Wang (2000): informație incrementală, dar „patterns optimal for detecting anomalies need not be optimal for profits”;
    - Bulkowski: statistici „perfect trade”;
    - ratele de eșec s-au dublat în anii 2000.
  - Avertismentele a–d din R2 §4.0: subiectivitate, perfect trades, epoci, rate de bază.
- **Necesită:** S3, S7, S13 (varianta lite)
- **Termeni noi de glosar:** throwback, breakout-filter, pattern-height

**Fișa tehnică**

**Eșecul:**
- Bulkowski: sub 5% dincolo de breakout înainte de întoarcere.
- La LABX pe 1H, 5% din 104.00 înseamnă 5.20, adică ~13 ATR. Laboratorul folosește standard tally în R, nu definiția Bulkowski.

**Filtre** (CMT Level II, R2 §3.12):

| Filtru | Nivelul de confirmare pentru un breakout peste 104.00 (ATR 0.40) | Comentariu |
|---|---|---|
| Close beyond | 104.01 | Bulkowski |
| 1% | 105.04 | |
| 3% | 107.12 | ~8 ATR, gândit pentru acțiuni pe zilnic |
| 0.5 × ATR | 104.20 | implicit în aplicație |
| 2 închideri consecutive | — | filtru de timp |
| Gap prin nivel | — | confirmare puternică (StockCharts) |

**Ținta:**
- breakout ± înălțimea × p_met, unde p_met = rata „target met” a pattern-ului (Bulkowski recomandă scalarea);
- exemplu: un pattern de 3.00, cu p_met = 51% → 1.53 dincolo de breakout.

**Throwback / pullback:** întoarcerea la nivelul rupt după breakout (54–74% din cazuri, în funcție de pattern). Le scade performanța medie (R2 §3.7).

**Atenție la ambiguitate:** „pullback” are aici sensul Bulkowski (întoarcere după un breakout în jos), diferit de pullback-ul din trend (1.5). Cardul de glosar spune asta.

#### 2.2.3 · Double tops and bottoms
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Identify a double top or bottom and its confirmation level: the valley or the peak between the two extremes.
  2. Compare entering at the second peak with entering on confirmation, in hit rate and in R.
  3. Calculate the scaled target of a confirmed double bottom.
- **Concepte:** double-tops-and-bottoms (nou), anticipation-vs-confirmation (nou), expectancy ✓
- **Se sprijină pe:** 2.2.2, 2.1.3 (confirmare), 1.4 (L11 expectancy)
- **Hook:**
  - **Tip:** predict, slider 0–100%
  - **Prompt:** "Two peaks at almost the same price. No close below the valley yet. How often does price keep rising instead?"
  - **Răspuns:** ~60% (Bulkowski, twin peaks neconfirmate).
- **Interacțiunea centrală:**
  1. Predict → reveal de două ori pe aceleași 20 de cazuri: întâi la al doilea vârf, apoi la close-ul de confirmare. Tally separat pentru fiecare (R2 §4.4, practice).
  2. Match pe forme Adam / Eve: vârf îngust și ascuțit vs vârf larg și rotunjit.
  3. Worked: ținta scalată.
- **Try:**
  - **Widget:** `pattern-drawer`, mod nivel; double top din mod didactic: vârfuri 105.00 și 104.90, vale 102.00.
  - **Obiectiv:** "Mark the confirmation level, then place a sell-stop entry just below it and a protective stop above the higher peak."
  - **Reușită:** nivelul ∈ [101.95, 102.05]; entry ≤ 101.99; stop ≥ 105.10.
  - **Show me:** 102.00 / 101.99 / 105.10.
- **Practică:**
  - Laboratorul „confirmation trade-off” (R2 §8.5 pct. 6): anticipare vs confirmare pe double tops, pe R1, R2 și R0, comparate prin expectancy după costuri, nu prin win rate.
  - Arena: reversal.
- **Check:**
  - q-cp-7 (mcq): când există un double top? Abia după confirmare.
  - q-cp-8 (numeric): ținta scalată.
  - q-cp-9 (scenario): o metodă cu win rate mai mare și expectancy mai mică.
- **Dovezi:** **C · Mixed** (R2 §4.4–4.5, §7.3)
  - double top Adam & Adam: eșec 25%, target met 64%, rang 19/36;
  - double bottom Eve & Eve: eșec 12%, target met 65%, rang 5/39;
  - fără confirmare: ~60% (tops), respectiv ~48% (bottoms) continuă în direcția veche;
  - LMW: cele mai frecvente pattern-uri în eșantionul lor.
- **Necesită:** S3, S7, S1 (stop entry)
- **Termeni noi de glosar:** double-top, double-bottom

**Fișa tehnică**

| Element | Regula Bulkowski (zilnic, acțiuni) | Regula aplicației (LABX, 1H) |
|---|---|---|
| Vârfurile | la ~3% unul de altul, la câteva săptămâni distanță | la ≤ 0.5 × ATR(14) unul de altul, la ≥ 10 lumânări distanță (convenție) |
| Valea dintre ele | scădere de ≥ ~10% | ≥ 3 × ATR(14) (convenție) |
| Confirmarea | close sub vale (top) / peste vârf (bottom) | la fel, plus filtrul 0.5 × ATR |
| Înălțimea | vârful cel mai înalt − vale | la fel |
| Ținta | vale − înălțimea × 64% (A&A top) / vârf + înălțimea × 65% (E&E bottom) | la fel |
| Variante | Adam (îngust) / Eve (larg): AA, AE, EA, EE | match de forme |

**Exemplu lucrat:**
- **Top:** vârfuri 105.00 și 104.90, vale 102.00. Înălțimea 3.00, ținta 102.00 − 1.92 = 100.08 (înălțimea întreagă ar da 99.00).
- **Bottom E&E:** minime 96.00 și 96.20, vârf 99.00. Înălțimea 3.00, ținta 99.00 + 1.95 = 100.95.

**În date aleatoare:** vârfurile duble apar des pe R0. După confirmare, rezultatul e cel de bază (laboratorul unității).

#### 2.2.4 · Head and shoulders
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Label the left shoulder, head and right shoulder, and draw the neckline through the two lows between them.
  2. Apply the confirmation rule for an up-sloping and for a down-sloping neckline.
  3. Calculate the full and the scaled target for a top and for an inverse pattern.
- **Concepte:** head-and-shoulders (nou), chart-pattern-anatomy (nou, 2.2.2), pattern-target (nou, 2.2.2)
- **Se sprijină pe:** 2.2.3, 2.2.1
- **Hook:**
  - **Tip:** predict, alegere: "Yes" · "Not yet" · "No"
  - **Prompt:** "Three peaks, the middle one highest, and price is still above the lows between them. Is this a head-and-shoulders top?"
  - **Răspuns:** "Not yet": nu există încă un close sub neckline.
- **Interacțiunea centrală:**
  1. LABEL: tragi etichetele LS / H / RS pe vârfuri.
  2. DRAW neckline: ancorele pe cele două minime dintre vârfuri („armpits”).
  3. Predict → reveal la ruperea neckline-ului.
  4. „H&S in noise”: scanul LMW pe R0 arată câte H&S apar și ce urmează după ele (R2 §4.1, practice).
- **Try:**
  - **Widget:** `pattern-drawer`, mod neckline; H&S top didactic: LS 104.80, H 106.00, RS 104.70, minime 103.00 și 103.00.
  - **Obiectiv:** "Draw the neckline and place the scaled target."
  - **Reușită:** ancorele la ≤ 0.10 de minime; ținta ∈ [101.42, 101.52] (calculat: 101.47).
  - **Indicii:**
    1. "Neckline through the two lows between the peaks."
    2. "Height = head − neckline."
    3. "Scale by 51%: 3.00 × 0.51 = 1.53."
- **Practică:**
  - Patterns in noise (H&S) pe R0 și R1.
  - Arena: reversal.
- **Check:**
  - q-cp-10 (hotspot): "Tap the right shoulder."
  - q-cp-11 (numeric): ținta scalată a unui top, 51%.
  - q-cp-12 (numeric): ținta unui pattern invers, 71%.
- **Dovezi:** **C · Mixed** (R2 §4.1–4.3, §4.27)
  - **Top:** eșec 19%, scădere medie 16%, pullback 68%, target met 51%, rang 9/36.
  - **Invers:** eșec 11%, target met 71%, rang 13/39.
  - **Complex:** bottoms rang 9/39, cu eșec rar (rang 3); tops rang 7/36.
  - **Studii:**
    - Lo, Mamaysky & Wang: informație incrementală pe acțiuni americane 1962–1996;
    - Chang & Osler (1999): profitabil pe 2 din 6 perechi FX.
- **Necesită:** S3, S7
- **Termeni noi de glosar:** head-and-shoulders, neckline

**Fișa tehnică**

| Element | Regula |
|---|---|
| Context | trend urcător înainte de top (coborâtor înainte de inversul lui) |
| Definiția algoritmică (LMW, R2 §4.1 — *din memorie, de verificat în lucrare*) | 5 extreme consecutive E1–E5; E1 maxim; E3 > E1 și E3 > E5; E1 și E5 la ≤ 1.5% de media lor; E2 și E4 la ≤ 1.5% de media lor. La LABX pe 1H, aplicația înlocuiește 1.5% cu 0.5 × ATR(14) (convenție). |
| Proporția | umerii la înălțimi și distanțe apropiate de cap („not lopsided”) |
| Volumul | cel mai mare la umărul stâng, apoi în scădere (61%) |
| Confirmarea | close sub neckline-ul ascendent; dacă neckline-ul coboară, close sub minimul din dreapta (Bulkowski) |
| Ținta | neckline-ul la rupere − (cap − neckline-ul de sub cap) × 51%; pentru invers, × 71% |
| Complex H&S | mai mulți umeri sau două capete; simetrie în jurul capului (Library) |

**Exemplu lucrat:**
- **Top:** neckline orizontal la 103.00, cap 106.00. Înălțimea 3.00. Ținta completă 100.00; ținta scalată 103.00 − 1.53 = 101.47.
- **Invers:** cap 94.00, neckline 97.00. Ținta scalată 97.00 + 2.13 = 99.13.

#### 2.2.5 · Triple tops, triple bottoms and rectangles
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Explain why a triple top is only a range until price closes below its lowest valley.
  2. Draw a rectangle with at least three touches on one boundary and two on the other.
  3. Use a partial rise or partial decline inside a rectangle as a tilt in the odds, not a certainty.
- **Concepte:** rectangles-and-triples (nou), range ✓
- **Se sprijină pe:** 2.2.3, 1.5 (range, L05)
- **Hook:**
  - **Tip:** predict, alegere: "Up" · "Down" · "Can't know yet"
  - **Prompt:** "Price has touched the same ceiling three times. Which way will it break out?"
  - **Răspuns:** "Can't know yet". Pentru dreptunghiurile formate după o creștere, datele dau 63% în sus. Multe triple tops devin dreptunghiuri care ies în sus.
- **Interacțiunea centrală:**
  1. DRAW cutia (două benzi, ca în `level-drawer` din L06), cu atingerile numărate.
  2. Predict → reveal după o creștere parțială sau o scădere parțială (R2 §4.17).
  3. Worked: țintele în sus și în jos.
- **Try:**
  - **Widget:** `pattern-drawer`, mod cutie, R2 didactic (dreptunghi 100.00–102.00).
  - **Obiectiv:** "Draw the rectangle: at least 3 touches on one side and 2 on the other."
  - **Reușită:** banda de sus și cea de jos conțin atingerile cerute (swing-uri la ≤ 0.10 de bandă); fiecare bandă are 0.10–0.40 grosime.
  - **După reușită** (scorat doar pentru calibrare): predicția direcției după o scădere parțială.
- **Practică:**
  - Tally pe „partial decline → up?” în R2 (dreptunghiuri din regim) și pe R0, unde semnul nu există.
  - Arena: sideways, breakout.
- **Check:**
  - q-cp-13 (mcq): triple top-ul neconfirmat e un range.
  - q-cp-14 (numeric): ținta dreptunghiului în sus.
  - q-cp-15 (scenario): o creștere parțială. Ce înclinație are, și de ce nu e certitudine.
- **Dovezi:** **C · Mixed** (R2 §4.6–4.7, §4.17)
  - **Triple top:** eșec 25%, target met 49%, rang 24/36; mai frecvent în bear markets.
  - **Triple bottom:** eșec 13%, target met 74%, rang 12/39.
  - **Rectangle top:** eșec 15% (sus) / 34% (jos); target met 78% / 54%; rang 4/39 în sus, 32/36 în jos.
  - **Partial rise / decline:** partial rise → breakout în jos în 75% din cazuri; partial decline → în sus în 79%. Unul dintre puținele semne cuantificate, dar pe același set de date.
- **Necesită:** S3, S7
- **Termeni noi de glosar:** triple-top, rectangle, partial-rise

**Fișa tehnică**

| Pattern | Identificare (aplicația) | Confirmare | Țintă |
|---|---|---|---|
| Triple top | 3 vârfuri la ≤ 0.5 × ATR unul de altul, cu văi între ele; trend urcător înainte | close sub cea mai joasă vale | vale − înălțimea × 49% |
| Triple bottom | oglinda; trendul de dinainte nu coboară sub primul minim | close peste cel mai înalt vârf | vârf + înălțimea × 74% |
| Rectangle | linii aproape orizontale (pantă < 0.1 × ATR la 10 lumânări, convenție); ≥ 3 + 2 atingeri; volum în scădere | close dincolo de bandă + filtru | în sus: × 78%; în jos: × 54% |
| Partial rise / decline | un swing din interior care se oprește înainte de 80% din înălțime și se întoarce (convenție) | — | semn de direcție, nu țintă |

**Exemplu lucrat:** dreptunghiul 100.00–102.00 are înălțimea 2.00.
- ținta în sus: 102.00 + 1.56 = 103.56;
- ținta în jos: 100.00 − 1.08 = 98.92.

#### 2.2.6 · Triangles
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Classify ascending, descending and symmetrical triangles by the slopes of their two boundaries.
  2. State each triangle's breakout bias from the data, including where the descending triangle contradicts the textbook.
  3. Explain why breakouts close to the apex deserve less trust.
- **Concepte:** triangles (nou), chart-pattern-anatomy (nou, 2.2.2)
- **Se sprijină pe:** 2.2.1, 2.2.2
- **Hook:**
  - **Tip:** predict, slider 0–100%
  - **Prompt:** "Descending triangles are taught as bearish. Guess the share that break out upward."
  - **Răspuns:** 53%. Dacă prețul a urcat în pattern, 63%.
- **Interacțiunea centrală:**
  1. DRAW două linii.
  2. Match pe 3 forme cu numele lor.
  3. Predict direcția, apoi reveal ratele: 63/37 (ascendent), 53/47 (descendent), 60/40 (simetric).
  4. Slider „how far to the apex” care marchează unde vin de obicei breakout-urile (61–74% din drum).
  5. Jocul „Breakout or fizzle” lângă apex (R2 §4.20).
- **Try:**
  - **Widget:** `line-drawer` cu două linii, mod didactic R1.
  - **Obiectiv:** "Draw both boundaries of this triangle and name it."
  - **Reușită:** fiecare ancoră la ≤ 0.25 × ATR de swing-urile reale; ≥ 3 atingeri pe o linie și ≥ 2 pe cealaltă; numele corect.
- **Practică:**
  - Breakout or fizzle pe R1 și R2; scanul de triunghiuri pe R0.
  - Arena: breakout, false breakout.
- **Check:**
  - q-cp-16 (classify): pantele → numele.
  - q-cp-17 (mcq): bias-ul triunghiului descendent din date.
  - q-cp-18 (scenario): un triunghi ascendent iese în jos. Aproape jumătate dintre acestea fac „bust” în sus (2.2.10).
- **Dovezi:** **C · Mixed** (R2 §4.18–4.20)
  - **Ascendent:** 63% în sus; eșec 17% / 38%; target met 70% / 44%; rang 16/39 și 30/36.
  - **Descendent:** 53% în sus; eșec 22% / 23%; target met 64% / 50%; rang 33/39 și 15/36. Manualul spune altceva decât datele.
  - **Simetric:**
    - 60% în sus; breakout-ul la 74% din drum;
    - eșec 25% / 37%; target met 58% / 36%;
    - rang 36/39 și 34/36, printre cele mai slabe;
    - volumul mare la breakout ajută.
- **Necesită:** S3, S7
- **Termeni noi de glosar:** ascending-triangle, descending-triangle, symmetrical-triangle, apex

**Fișa tehnică**

| Triunghi | Granițe | Reguli comune | Bias (Bulkowski) | Ținta (în sus) |
|---|---|---|---|---|
| Ascendent | sus orizontal, jos ascendent | ≥ 3 + 2 atingeri; prețul traversează de la o latură la alta; volumul scade (≥ 78%) | 63% în sus, la 64% din drumul spre apex | înălțimea × 70% |
| Descendent | jos orizontal, sus descendent | evită triunghiurile cu mult spațiu gol | 53% în sus (63% dacă prețul a urcat în pattern) | înălțimea × 64% |
| Simetric | ambele converg | volum în scădere în 84–86% din cazuri | 60% în sus, la 74% din drum; prețul întoarce la apex în 60% din cazuri | înălțimea × 58% |

**Exemplu lucrat:** triunghi ascendent cu plafonul la 104.00 și primul minim la 100.00. Înălțimea 4.00, ținta 104.00 + 2.80 = 106.80.

**În date aleatoare:** linii convergente se pot trasa pe aproape orice consolidare de pe R0. Regula ≥ 3 + 2 atingeri reduce numărul, dar nu schimbă rezultatul de după.

#### 2.2.7 · Flags, pennants and measured moves
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Identify a flag and a pennant from the flagpole, the shape and the duration.
  2. Compare the "half-mast" target with how often it was reached, and scale it.
  3. Project a measured move from three swing points at 60% and 100% of the first leg.
- **Concepte:** flags-and-pennants (nou), measured-move (nou), pattern-target (nou, 2.2.2)
- **Se sprijină pe:** 2.2.6 (pennant = triunghi mic), 2.2.2
- **Hook:**
  - **Tip:** predict, slider 0–100%
  - **Prompt:** "The flagpole was 4.00 tall. The 'half-mast' rule says price travels another 4.00 after the flag. How often does it get there?"
  - **Răspuns:** 46%.
- **Interacțiunea centrală:**
  1. DRAW cele două linii paralele ale steagului.
  2. Slider pe proiecția țintei, 100% vs 46% din catarg, cu rata de atingere pe tally (R2 §4.14, practice).
  3. `measured-move`: A, B, C → D la 60% și 100%.
  4. Card „High tight flag”: regula (prețul ~se dublează în 2 luni) nu are echivalent pe LABX 1H. Rămâne doar în Library.
- **Try:**
  - **Widget:** `measured-move`; A 100.00, B 104.00, C 102.00.
  - **Obiectiv:** "Project D at 60% and 100% of leg AB, measured from C."
  - **Reușită:** D60 = 104.40 și D100 = 106.00 (± 0.01).
- **Practică:**
  - Laborator: ținte measured-move vs ținte arbitrare la aceeași distanță (R3 §4.12), pe R1 și R0.
  - Arena: bullish, breakout.
- **Check:**
  - q-cp-19 (classify): flag vs pennant vs rectangle (durata).
  - q-cp-20 (numeric): ținta steagului scalată.
  - q-cp-21 (numeric): D60.
- **Dovezi:** (R2 §4.14–4.16, §4.23; R3 §4.12)
  - **D · Unproven** pentru regula half-mast a steagurilor:
    - flag: eșec 44% / 45%, target met 46%;
    - pennant: eșec 54% (mai rău decât moneda, la break-even), target met 35% / 32%; trendul de după egalează trendul de dinainte doar în ~30% din cazuri.
  - **C · Mixed** pentru measured move scalat (Bulkowski): piciorul 2 are în medie +31%, față de +36% pentru piciorul 1; ținta la 60% din piciorul 1 a fost atinsă în 60% din cazuri.
  - High tight flag: eșec 15%, target met 82% (cu jumătate din înălțime), rang 30/39 (Library).
- **Necesită:** S3, S7
- **Termeni noi de glosar:** flag, pennant, flagpole, measured-move, high-tight-flag

**Fișa tehnică**

| Pattern | Identificare (aplicația) | Bias | Ținta |
|---|---|---|---|
| Flag | catarg abrupt: ≥ 3 × ATR în ≤ 8 lumânări (convenție); steag paralel, înclinat contra catargului, 5–20 lumânări (Bulkowski: sub 3 săptămâni pe zilnic; mai lung e dreptunghi sau canal); volum în scădere | 60% în sus | catarg × 46%, nu × 100% |
| Pennant | catarg; linii convergente; ≤ 20 de lumânări; volum în scădere (86%) | 57% în sus | catarg × 35% |
| Measured move (ABCD) | trei puncte de întoarcere consecutive; corecția medie ~48% din AB | — | D = C ± AB × 60% (atins în 60% din cazuri) |

**Exemplu lucrat:**
- **Flag:** catarg 100.00 → 104.00; steagul coboară la 103.00; breakout la 103.60.
  - half-mast: 103.60 + 4.00 = 107.60;
  - scalat: 103.60 + 1.84 = 105.44.
- **Measured move:** A 100.00, B 104.00, C 102.00 → D100 = 106.00, D60 = 104.40.

**Legătura cu lumânările:** rising three methods (2.1.8) e varianta de lumânare a unui steag.

#### 2.2.8 · Wedges and broadening formations
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Tell a rising wedge from a falling wedge and from a channel by the slopes of the two lines.
  2. State what the data says about rising wedges that break down.
  3. Identify a broadening formation and a diamond, and explain why they are hard to trade.
- **Concepte:** wedges-and-broadening (nou), trendlines-and-channels (nou, 2.2.1)
- **Se sprijină pe:** 2.2.6, 2.2.1
- **Hook:**
  - **Tip:** predict, slider 0–100%
  - **Prompt:** "Rising wedges are taught as bearish. Of those that do break down, how many fail to fall even 5%?"
  - **Răspuns:** 51%: cel mai slab pattern cu breakout în jos (rang 36/36).
- **Interacțiunea centrală:**
  1. DRAW două linii.
  2. Match pe 4 forme: channel · rising wedge · falling wedge · broadening.
  3. Reveal cu cardul de statistici.
  4. Callout: la Brooks, „wedge” înseamnă trei împingeri, nu neapărat linii convergente (2.6.5).
- **Try:**
  - **Widget:** `line-drawer` cu două linii.
  - **Obiectiv:** "Draw both lines of this falling wedge, then name the shape."
  - **Reușită:** ancorele la ≤ 0.25 × ATR de swing-uri; ≥ 5 atingeri în total (3 + 2); amândouă liniile descendente și convergente; numele corect.
- **Practică:**
  - Scanul de wedge-uri pe R0 și R1.
  - Arena: reversal; high volatility (formațiile broadening apar când volatilitatea crește).
- **Check:**
  - q-cp-22 (classify): pantele → numele.
  - q-cp-23 (mcq): ce arată datele pentru rising wedge în jos.
  - q-cp-24 (mcq): de ce broadening-ul și diamantul sunt greu de folosit (rare, subiective).
- **Dovezi:** (R2 §4.10–4.11, §4.21–4.22)
  - **D · Unproven** pentru „rising wedge = bearish”: 60% ies în jos, dar eșec 51% la break-even și rang 36/36.
  - **C · Mixed** pentru falling wedge: 68% în sus; eșec 26% / 29%; target met 62% / 29%; rang 31/39. Gap-ul în sus la breakout și pattern-ul înalt ajută.
  - **D · Unproven** pentru broadening („a poor performer”: eșec 18% / 27%, rang 22/39 și 28/36) și diamante (rang 39/39 în sus, dar 3/36 în jos; rare, subiective).
- **Necesită:** S3, S7
- **Termeni noi de glosar:** wedge, broadening-formation, diamond-pattern

**Fișa tehnică**

| Pattern | Identificare | Bias | Ținta |
|---|---|---|---|
| Rising wedge | două linii ascendente convergente, cea de jos mai abruptă; ≥ 5 atingeri (3 + 2); ≥ 15 lumânări (Bulkowski: ≥ 3 săptămâni; mai scurt e pennant); volum în scădere (79%) | 60% în jos | în jos: înălțimea × 32% |
| Falling wedge | două linii descendente convergente; ≥ 5 atingeri; volum în scădere | 68% în sus, la 61–62% din drum | în sus: înălțimea × 62% |
| Broadening (megafon) | linii divergente: maxime mai mari și minime mai mici; ≥ 5 atingeri; variante cu o latură orizontală și broadening wedges | ~60% în sus | × 66% / × 42% |
| Diamond | prima jumătate se lărgește, a doua se îngustează (triunghi simetric); câte 1–2 atingeri pe linie | 54% în jos | × 65% / × 63% |

**Exemplu de citire:** un rising wedge rupt în jos cu înălțimea 3.00 dă ținta scalată 3.00 × 32% = 0.96 sub breakout. Cu un stop dincolo de linia de sus, R:R e adesea sub 1.

#### 2.2.9 · Slow turns and sharp turns: rounding, cup with handle, V
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Identify a rounding bottom and a cup with handle, and explain why both become visible only late.
  2. Explain why a V-bottom can't be recognised in real time, using the V's that failed.
  3. Use the pattern zoo card to compare any rare pattern by failure rate, rank and sample size.
- **Concepte:** rounding-and-v-patterns (nou), pattern-name-vs-evidence (nou, 2.1.8)
- **Se sprijină pe:** 2.2.2–2.2.8
- **Hook:**
  - **Tip:** predict, alegere: "Yes" · "Can't tell yet" · "No"
  - **Prompt:** "You see the left half of a slow bowl. Is it a rounding bottom?"
  - **Răspuns:** "Can't tell yet". Bolul apare doar când e aproape gata.
- **Interacțiunea centrală:**
  1. Exercițiu „live-forming”: lumânările apar una câte una, iar cursantul apasă "It's a bowl" când crede. Aplicația arată la ce lumânare era confirmat (close peste buza din stânga).
  2. Predict la minimele unor V-uri: reveal pe 10 cazuri, majoritatea „V”-uri care au continuat să scadă.
  3. DRAW cup și handle.
  4. Cardul „pattern zoo” (Library): BARR, scallops, three rising valleys, Big W / Big M, pipe și horn, roof, Wolfe wave.
- **Try:**
  - **Widget:** `pattern-drawer`, mod cup; buza la 104.00, fundul cupei la 98.00.
  - **Obiectiv:** "Draw the rim line and the handle's trendline, then place the scaled target."
  - **Reușită:** buza ∈ [103.90, 104.10]; minimul handle-ului în jumătatea de sus a cupei (≥ 101.00); ținta ∈ [107.61, 107.71] (calculat: 107.66).
- **Practică:**
  - Predict la minimele V pe R1 și R0.
  - Arena: reversal.
- **Check:**
  - q-cp-25 (mcq): de ce rounding bottom-ul se vede târziu.
  - q-cp-26 (numeric): ținta cupei.
  - q-cp-27 (scenario): un pattern rar cu rang bun și N mic.
- **Dovezi:** (R2 §4.8–4.9, §4.12–4.13, §4.24)
  - **C · Mixed:**
    - rounding bottom: eșec 4% (cel mai mic), target met 65%, rang 7/39. De obicei e continuare: prețul urcă în pattern în 67% din cazuri.
    - rounding top: rang 2/39 și 3/36;
    - cup with handle: eșec 5%, target met 61%, rang 3/39; handle-urile mai scurte de 22 de zile merg mai bine.
  - **D · Unproven** pentru folosirea V-urilor în timp real: V-bottom rang 24/39, V-top extins 2/36, dar recunoașterea în timp real e aproape imposibilă.
  - BARR: rang 1 la bottoms, dar unghiurile se desenează subiectiv. Wolfe wave: printre ultimele (34/39, 35/36).
  - Statisticile vin din pattern-uri de luni de zile pe zilnic sau săptămânal; la LABX 1H nu se compară.
- **Necesită:** S3, S7
- **Termeni noi de glosar:** rounding-bottom, cup-with-handle, v-reversal

**Fișa tehnică**

| Pattern | Identificare | Confirmare | Țintă |
|---|---|---|---|
| Rounding bottom / top | formă de bol lent; posibil un „bump” la mijloc; de obicei continuare | close peste buza stângă | înălțimea × 65% |
| Cup with handle (O'Neil) | cupă în U (nu V); buze la prețuri apropiate; handle în jumătatea de sus, scurt | close peste buză sau peste linia descendentă a handle-ului; stop sub minimul handle-ului | (buza − fundul) × 61% |
| V-bottom / top | scădere abruptă urmată imediat de creștere abruptă; fără reguli clasice | — | — |
| Bump-and-run (BARR) | lead-in, apoi un „bump” cu panta de ~2× lead-in-ul, apoi ruperea liniei lead-in (Library) | — | — |

**Exemplu lucrat:** cupa cu buza la 104.00 și fundul la 98.00 are adâncimea 6.00. Ținta: 104.00 + 6.00 × 0.61 = 107.66.

#### 2.2.10 · Failed, busted and random patterns
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Pre-commit your actions for the three outcomes of a breakout: it works, it fails, it busts.
  2. Show with the lab that pattern shapes appear in a random walk and that what follows them matches the base rate.
  3. Explain why Bulkowski's failure rates doubled after the 1990s and what that means for any published statistic.
- **Concepte:** busted-patterns (nou), base-rates ✓, scenario-planning ✓
- **Se sprijină pe:** 2.2.1–2.2.9, 0.2 (random walk), 1.6 (planul v1)
- **Hook:**
  - **Tip:** predict, alegere: "None" · "A few" · "Many"
  - **Prompt:** "We generate 10,000 purely random price paths. How many head-and-shoulders patterns will the scanner find?"
  - **Răspuns:** "Many". Numărul exact apare din laborator, la 1,000 de lumânări.
- **Interacțiunea centrală:**
  1. Laboratorul Patterns in noise (R2 §8.5 pct. 1): frecvența pe R0 și distribuția randamentelor după pattern, suprapusă peste cea necondiționată. Cele două curbe coincid.
  2. `scenario-tree` (R2 §4.25): ramurile se completează *înainte* de reveal.
  3. Cardul „Era decay”, pentru breakout-urile care nu au câștigat 10%:
     - în sus: 14% în anii 1990, 28% în 2003–2007;
     - în jos: 26%, respectiv 49%.
- **Try:**
  - **Widget:** `scenario-tree` pe un triunghi ascendent (plafon 104.00, ultimul swing low din interior 103.40, ATR 0.40).
  - **Obiectiv:** "Write the plan before the breakout: entry, stop, what you do if it closes back inside, and what you do if it closes below the lower line."
  - **Reușită:**
    - entry ≥ 104.20 (close + 0.5 ATR);
    - stop ≤ 103.30;
    - pentru „fails” (close înapoi în pattern): "Exit";
    - pentru „busts”: "Stand aside" sau "New plan with its own stop and size". "Add to the position" e respins.
- **Practică:**
  - Laboratorul unității, pe R0, R1 și R2.
  - Arena: false breakout, cu planul scris înainte.
- **Check:**
  - q-cp-28 (mcq): ce arată laboratorul pe R0.
  - q-cp-29 (scenario): ce faci la „bust”.
  - q-cp-30 (mcq): ce înseamnă dublarea ratelor de eșec pentru o statistică publicată azi.
- **Dovezi:**
  - **Mechanic:** rezultatul pe R0, adevărat prin construcție.
  - **C · Mixed** pentru mișcările de după „bust”: Bulkowski le descrie ca puternice (triunghiuri descendente), dar statisticile sunt în cărțile lui și nu au fost preluate.
  - Decăderea în timp: R2 §3.12. Lecția despre statistica publicată: README §6 (McLean & Pontiff).
  - Surse: R2 §4.25, §4.27, §8.3, §8.5 pct. 1; R1 §4 pct. 1.
- **Necesită:** S7 (scanner pe 10,000 de drumuri), S13 (varianta lite)
- **Termeni noi de glosar:** busted-pattern

**Fișa tehnică**

**Scanerul de pattern-uri, cu reguli expuse ca parametri:**
- H&S: regula LMW din 2.2.4;
- double top: regula din 2.2.3;
- triunghiuri: ≥ 3 + 2 atingeri și pantele din 2.2.6.

**Raportul laboratorului:**
- detecții la 1,000 de lumânări;
- randamentul la 10 și la 20 de lumânări după confirmare;
- distribuția necondiționată (toate lumânările), suprapusă;
- testul diferenței, cu N.

**Busted pattern:** breakout → mișcare sub 1 × ATR(14) (convenția aplicației; Bulkowski folosește ~10% pe zilnic) → close dincolo de granița opusă.

---

## 2.3 · Trend tools (8 lecții)

### Fișa unității

- **Scop:**
  - teoria Dow și definițiile operaționale ale trendului;
  - mediile mobile (SMA, EMA, WMA) și compromisul lag–zgomot;
  - încrucișările și costul whipsaw-urilor;
  - MACD (și PPO), ADX/DMI, Parabolic SAR și SuperTrend, bazele Ichimoku;
  - fiecare indicator cu formula, un exemplu calculat de mână, setările tipice (și de ce sunt convenții), redundanța cu alți indicatori din aceeași familie și nota de dovezi.
- **De ce aici:**
  - Indicatorii vin după structură (1.5) și după pattern-uri (2.1–2.2), ca să nu înlocuiască citirea prețului (R2 §9.2: „indicators come after structure”).
  - Trendul e familia cu cele mai bune dovezi din analiza tehnică: time-series momentum și trend following au suport A pe orizonturi de 3–12 luni, pe portofolii diversificate de futures (R2 §8.1). Cursantul trebuie să afle unde se termină dovezile: regulile simple pe un singur instrument, după costuri.
  - L07 urcă aici din vechiul U2 (README §9), pentru că EMA, încrucișările și lag-ul se predau abia acum.
- **Se sprijină pe:**
  - 1.5: swing-uri, HH/HL, range și zgomot (L05);
  - 1.2: timeframe-uri;
  - 1.1: costuri (spread, comision);
  - 1.4: expectancy (L11);
  - 2.2.1: trendline-uri.
  - ATR-ul din SuperTrend se folosește ca număr dat; calculul vine în 2.4.6.
- **Checkpoint (test out ≥ 80%):** 14 întrebări:
  - 6 numerice (SMA, EMA, WMA, MACD și histograma, DI și DX, pasul PSAR);
  - 3 de citire (ADX fără direcție, încrucișare = semnul lui fast − slow, Ichimoku = mijloace Donchian);
  - 3 de dovezi (costurile, lag-ul, look-ahead);
  - 2 de regim (când produc whipsaw uneltele de trend).
- **Laboratorul unității: Trend rule lab** (`strategy-lab-lite`, S13, mod onest; R2 §8.5 pct. 4):
  - Aceleași reguli (preț peste SMA, încrucișare 10/30, MACD signal cross, PSAR always-in, SuperTrend, breakout de nor) rulate pe R0, R1 și R2.
  - Un cost slider de la 0 la 0.5% pe trade, un benchmark de intrări aleatoare și buy-and-hold.
  - **Concluzia așteptată:**
    - pe R0, orice regulă pierde exact cât costurile;
    - pe R1, regulile de trend câștigă pentru că regimul are drift prin construcție (lecția o spune explicit);
    - pe R2, whipsaw-urile și costurile dau rezultat negativ.
- **Fire din spirală:**
  - **Dovezi:** A pentru momentum pe orizonturi lungi vs C/D pentru regulile pe un singur instrument; McLean & Pontiff.
  - **Costuri:** cost erosion; fiecare încrucișare plătește spread-ul și comisionul.
  - **Statistică:** precizie și recall la filtrul de regim.
  - **Proces:** o singură definiție de trend, aleasă înainte, nu alta la fiecare trade.
  - **Risc:** PSAR și SuperTrend ca trailing stop (pregătește 2.7.4).
- **Surse:**
  - R2 §3.1–3.3 (Dow, swing-uri, trend), §5.0–5.10 (familia de trend), §7.5 pct. 3 (look-ahead), §8.1, §8.5 pct. 3–4;
  - R1 §2.7 (IN-01–IN-04, IN-08, IN-11), §2.10 (ME-01);
  - R3 §4.19.
- **Trimiteri:** Ichimoku complet → 3.4; sistemul Turtle și time-series momentum → 3.13; backtesting riguros → 3.11.

### Lecțiile

#### 2.3.1 · Dow Theory and what "trend" means
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. List Dow Theory's tenets and its three degrees of trend.
  2. Apply the peak-trough rule to decide whether a trend has ended.
  3. Compare four working definitions of trend on the same chart and show where they disagree.
- **Concepte:** dow-theory (nou), trend-definitions (nou), trend ✓, timeframe ✓
- **Se sprijină pe:** 1.5 (L05, swing-uri și HH/HL), 1.2 (timeframe-uri)
- **Hook:**
  - **Tip:** predict, alegere: "Yes" · "Not yet" · "Can't say"
  - **Prompt:** "In an uptrend, price just made a lower high. Has the uptrend ended?"
  - **Răspuns:** "Not yet". După regula peak-trough, un trend urcător se termină abia când un minim mai jos rupe minimul anterior.
- **Interacțiunea centrală:**
  1. LABEL pe o serie multi-scală (1D / 4H / 1H): mișcarea primară, secundară și minoră.
  2. Predict → reveal la fiecare swing nou: "Has the trend changed yet?" (R2 §3.1, practice).
  3. Clasificarea a 12 fragmente după 4 definiții: structura, panta SMA 50, stack-ul SMA 20 > 50, ADX > 25 (introdus în 2.3.6; aici e doar o etichetă calculată). Rezultatul e o matrice de dezacord (R2 §3.3).
- **Try:**
  - **Widget:** `trend-classifier+` (L05 extins).
  - **Obiectiv:** "Label each snippet up, down or range by the peak-trough rule, and tap the swing that decided it."
  - **Reușită:** 4/4 etichete corecte și swing-ul decisiv corect la ≥ 3/4.
- **Practică:**
  - Clasificarea regimului pe R1 și R2, cu etichetele ascunse (contribuie la etapa 2 → 3: recunoașterea regimului peste nivelul hazardului).
  - Arena: bullish, bearish, sideways.
- **Check:**
  - q-trd-1 (mcq): principiile Dow.
  - q-trd-2 (scenario): regula peak-trough pe o secvență de swing-uri.
  - q-trd-3 (mcq): două definiții dau răspunsuri diferite. Alegi una înainte, nu după.
- **Dovezi:** (R2 §3.1–3.3, §8.1)
  - **C · Mixed** pentru Dow ca sistem: un studiu dă ~2% pe an peste buy-and-hold pe 70 de ani, dar ~2.6% pe an sub el în cei 18 ani dinainte; semnalele vin târziu prin construcție.
  - **A · Robust** pentru persistența trendului pe 3–12 luni (Moskowitz, Ooi & Pedersen 2012; Hurst, Ooi & Pedersen 2017). Nu se extinde automat la 1H.
  - Wilder: piețele sunt în trend doar ~30% din timp.
- **Necesită:** S4 (1D / 4H / 1H legate), S2 (ADX pentru matrice); S9 opțional (regula „averages must confirm”, cu două instrumente)
- **Termeni noi de glosar:** dow-theory, primary-trend, peak-trough-rule

**Fișa tehnică**

**Principiile Dow** (StockCharts, R2 §3.1):
1. Mediile reflectă tot ce se știe.
2. Trei mișcări: primară (luni–ani), secundară (săptămâni–luni, contra trendului), minoră (zilnică).
3. Trei faze: acumulare → mișcarea mare → exces (distribuție → mișcare mare → disperare, în bear market).
4. Mediile trebuie să se confirme reciproc (Industrials și Transports).
5. Volumul confirmă trendul.
6. Trendul continuă până la un semnal clar de inversare.
7. Se folosesc închiderile. Hamilton ignora mișcările sub 3%.

**Regula peak-trough:**
- un downtrend rămâne valid până se formează un minim mai sus *și* creșterea următoare depășește maximul anterior;
- un uptrend se termină cu un minim mai jos care rupe minimul anterior.

**Definiții operaționale de trend, comparate:**

| Definiție | Regula |
|---|---|
| Structură | HH/HL pe swing-uri N = 3 |
| Panta mediei | SMA(50) în creștere pe ultimele 5 lumânări |
| Stack | SMA(20) > SMA(50) |
| Putere | ADX(14) > 25 |
| Regresie | panta și R² (doar în Library) |

Filtrul de 3% al lui Hamilton înseamnă 3.00 la LABX 100, adică ~7.5 ATR pe 1H (cu ATR 0.40). E încă un filtru calibrat pentru altă scară.

#### 2.3.2 · Moving averages without the magic  ·  `L07`
- **Nivel / durată / tip:** Intermediate · 6 min · Core (7 beat-uri în Learn; scriptul complet în [../U2-reading-price.md](../U2-reading-price.md))
- **Obiective:** (din script)
  1. Calculate a simple moving average from a list of closes.
  2. Explain why a moving average lags and what that means for signals based on it.
  3. Use a moving average to describe trend direction, not to forecast it.
- **Concepte:** moving-average ✓, trend ✓, range ✓
- **Se sprijină pe:** 1.5 (L05), 1.1 (L02 spread și comision), 2.3.1. Înainte era la L05 și L02, în vechiul U2.
- **Hook:**
  - **Tip:** predict, slider 100.00–110.00, pas 0.10, start 105.00
  - **Prompt:** "LABX closes at 100.00, 101.00, 102.00, 103.00 and 104.00. The next candle closes at 110.00. Guess the average of the last five closes."
  - **Răspuns:** 104.00
- **Interacțiunea centrală:**
  - B2 worked: SMA5 de mână. Primul pas e 510.00 ÷ 5 = 102.00; cursantul calculează al doilea, 520.00 ÷ 5 = 104.00.
  - B3 figure + reveal: SMA10 pe un minim (seed 7490). Predicție: când face media minimul? Răspuns: la c24, cinci lumânări după preț.
  - B4: lag-ul și EMA, într-o propoziție.
  - B5 match: "It can / It can't" (descrie direcția vs prezice întoarcerea; încrucișările în range).
  - B6: încrucișările plătesc spread și comision.
  - B7 callout: „summarises where price has been”.
- **Try:**
  - **Widget:** `ma-period`, piața Trend (seed 7301), perioada de start 5.
  - **Obiectiv:** "Find a period with at most 1 false signal that still turns within 8 candles of the top."
  - **Reușită:** false ≤ 1 și lag ≤ 8, adică perioadele 13–21. Show me: 15 (0 false, lag 7).
  - După reușită, invitația: "Now switch to Range." Pe range, minimul de false e 7.
- **Practică:** M02 Trend or Noise?; Arena: sideways și bullish, cu toggle-ul SMA 20 / SMA 50.
- **Check:** q-ta-7, q-ta-8, q-ta-9. Înlocuirea q-ta-10 → q-ta-9 e propusă în script.
- **Dovezi:** (R2 §5.1, §5.4)
  - **Mechanic** pentru lag (construcția mediei).
  - **C · Mixed** pentru regulile de tip „preț peste medie”: Brock, Lakonishok & LeBaron 1992 puternice in-sample; Sullivan, Timmermann & White 1999 nesemnificative out-of-sample; Bajgrowicz & Scaillet: dispar după costuri.
  - Pe futures diversificate, aceleași reguli se leagă de time-series momentum (A).
- **Necesită:** — (widget-ul `ma-period` e specificat în U2; SMA există)
- **Termeni noi de glosar:** — (sma, close, moving-average, ema, spread și commission există deja)
- **Note pentru noua poziție:**
  - B4 pomenește EMA într-o propoziție, iar 2.3.3 o calculează.
  - B6 pomenește încrucișările, iar 2.3.4 le măsoară cu costuri.
  - Trimiterile din script spre „L05, L02” devin „1.5.x, 1.1.x”.

#### 2.3.3 · EMA, WMA and the price of speed
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Calculate one EMA step from the previous EMA, the new close and k = 2 ÷ (n + 1).
  2. Calculate a WMA, and rank SMA, EMA and WMA by how fast each reacts to the same close.
  3. Explain why no average removes the lag-versus-noise trade-off and why default periods are only conventions.
- **Concepte:** weighted-moving-averages (nou), indicator-literacy (nou), moving-average ✓
- **Se sprijină pe:** 2.3.2 (L07)
- **Hook:**
  - **Tip:** predict, slider 100.00–110.00, pas 0.01
  - **Prompt:** "Same closes as before: 100.00 to 104.00, then 110.00. The 5-period SMA was 104.00. Guess the 5-period EMA."
  - **Răspuns:** 104.67
- **Interacțiunea centrală:**
  1. Worked EMA și WMA (fișa), cu input pe ultimul pas.
  2. Figură în 3 pași: SMA, EMA și WMA pe aceeași serie, cu reacția la închiderea 110.00.
  3. Overlay „No free lunch” (R2 §5.3): SMA, EMA, WMA, HMA, DEMA, TEMA, KAMA pe o serie cu zgomot, cu „bars to turn” și „whipsaws” pentru fiecare.
  4. Match: „less lag ⇔ more whipsaws”.
  5. Callout „indicator literacy” (R2 §5.0):
     - orice indicator e o transformare a OHLCV și nu adaugă informație nouă;
     - perioadele implicite (14, 20, 12/26/9) sunt convenții;
     - optimizarea lor pe trecut e drumul principal spre overfitting.
- **Try:**
  - **Widget:** `ma-period+`, piața Trend (seed 7301, aceleași date ca la L07), tipul EMA.
  - **Obiectiv:** "Find an EMA period with at most 1 false signal that turns within 6 candles of the top."
  - **Reușită:** EMA, false ≤ 1, lag ≤ 6. Intervalul exact de perioade se calculează la implementare și intră în teste, ca tabelul din L07.
  - **De verificat:** dacă intervalul e gol, pragul se relaxează la lag ≤ 7.
- **Practică:**
  - Laboratorul „lag explorer” (S2, n = 5…200) pe R1 și R2.
  - Arena: sideways cu toggle EMA 20.
- **Check:**
  - q-trd-4 (numeric): un pas EMA.
  - q-trd-5 (numeric): WMA.
  - q-trd-6 (mcq): mai puțin lag înseamnă mai mult zgomot.
- **Dovezi:** (R2 §5.0–5.3)
  - **Mechanic:** formulele și lag-ul.
  - **D · Unproven** pentru „EMA-ul (sau HMA, KAMA) bate SMA-ul”: nu există dovezi robuste că mediile cu lag mic sunt superioare.
  - Familia mediilor ca reguli: C (vezi L07).
- **Necesită:** S2 (EMA, WMA; HMA, DEMA, TEMA, KAMA doar în Library)
- **Termeni noi de glosar:** wma, lag, whipsaw, wilder-smoothing

**Fișa tehnică**

| Medie | Formula | Exemplu (close-uri 100–104, apoi 110) |
|---|---|---|
| SMA(5) | media ultimelor 5 close-uri | (101 + 102 + 103 + 104 + 110) ÷ 5 = **104.00** |
| EMA(5) | EMAₜ = EMAₜ₋₁ + k × (Cₜ − EMAₜ₋₁), k = 2 ÷ (n + 1) = 1/3; pornește de la SMA-ul primelor 5 = 102.00 | 102.00 + (110.00 − 102.00) ÷ 3 = **104.67** |
| WMA(5) | ponderi 1…5, cea mai mare pe ultimul close | (101×1 + 102×2 + 103×3 + 104×4 + 110×5) ÷ 15 = 1,580 ÷ 15 = **105.33** |
| Wilder | α = 1/n, adică prev × (n − 1)/n + C/n; echivalent cu un EMA de lungime 2n − 1 | folosit în RSI, ATR, ADX |

**Ordinea reacției:** WMA 105.33 > EMA 104.67 > SMA 104.00, cu prețul la 110.00. Toate rămân în urmă.

**Factorii k:** k(10) = 2/11 ≈ 18.18%; k(20) = 2/21 ≈ 9.52%.

**Încălzirea:** indicatorii recursivi au nevoie de istoric înainte. StockCharts calculează ≥ 250 de bare înapoi. Graficele din lecții folosesc 50 de lumânări ascunse, ca la L07.

#### 2.3.4 · Crossovers and the cost of whipsaws
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Define price crosses, double crosses and golden/death crosses as sign changes of fast minus slow.
  2. Count the crossover trades a range produces and what they pay in costs.
  3. Find, with the cost slider, the cost level at which a marginal crossover rule stops making money.
- **Concepte:** ma-crossover (nou), trading-costs ✓, moving-average ✓, expectancy ✓
- **Se sprijină pe:** 2.3.3, 1.1 (costuri), 1.4 (L11 expectancy)
- **Hook:**
  - **Tip:** predict, numeric (R, 2 zecimale)
  - **Prompt:** "A 10/30 crossover rule makes +0.08R per trade before costs. Each round trip costs 0.10R. What's left per trade?"
  - **Răspuns:** −0.02R
- **Interacțiunea centrală:**
  1. TAP pe încrucișările 10/30, pe R1 și pe R2. Ținta de design: puține pe trend, de câteva ori mai multe pe range; numerele exacte se fixează din seed.
  2. Figură: fast − slow ca histogramă, unde încrucișarea = schimbarea de semn. Pregătește MACD.
  3. Filtre (StockCharts, R2 §5.4): o bandă de 1%, N lumânări de confirmare, tranzacționezi doar în direcția SMA 200. Contoarele: trade-uri, whipsaw-uri, rezultat.
  4. Cost erosion (R2 §8.5 pct. 4): slider 0–0.5% pe trade.
- **Try:**
  - **Widget:** `strategy-lab-lite`, regula 10/30, piața R1 (seed fixat).
  - **Obiectiv:** "Raise the cost per trade until the rule's expectancy turns negative. Report that cost."
  - **Reușită:** valoarea raportată la ± 0.01 pp de pragul calculat de laborator.
- **Practică:**
  - Cost erosion pe R0 (negativ de la primul cost), R1 și R2.
  - Arena: bullish și sideways, cu SMA 20 și SMA 50 pornite.
- **Check:**
  - q-trd-7 (mcq): ce e un golden cross (50 trece peste 200).
  - q-trd-8 (numeric): expectancy după costuri.
  - q-trd-9 (scenario): de ce încrucișările pierd în range.
- **Dovezi:** (R2 §5.1, §5.4, §8.1, §8.3 pct. 2)
  - **C · Mixed** pentru încrucișări pe un indice de acțiuni: BLL 1992, apoi STW 1999 și Bajgrowicz & Scaillet, la care performanța „fully disappears once transaction costs are taken into account”.
  - **A · Robust** doar pentru regulile de trend pe portofolii diversificate de futures, pe orizonturi lungi: alt univers și alt orizont.
- **Necesită:** S13, S2
- **Termeni noi de glosar:** crossover, golden-cross, death-cross

**Fișa tehnică**

| Tip | Regula |
|---|---|
| Price cross | semnul (C − MA) se schimbă față de lumânarea anterioară; egalitatea păstrează partea (ca în `ma-period`) |
| Double cross | semnul (MA rapid − MA lent) se schimbă |
| Golden / death cross | SMA 50 trece peste / sub SMA 200 |
| Triple cross | trei medii (doar Library) |
| Filtre | bandă de ±1% (BLL a testat 0% și 1%); N lumânări de confirmare; doar în direcția SMA 200 |

**Aritmetica costului** (lumea LABX):
- spread 0.10 + comision 0.05% × 2 ≈ 0.20 per unitate, la prețul 100;
- cu un stop de 1.00, asta înseamnă ~0.20R per trade dus-întors.

#### 2.3.5 · MACD: two averages in disguise
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Calculate the MACD line, signal line and histogram from given EMA values.
  2. Show that a MACD zero-line cross is the same event as a 12/26 EMA cross.
  3. Convert MACD to PPO to compare instruments with different prices.
- **Concepte:** macd (nou), ma-crossover (nou, 2.3.4), indicator-literacy (nou, 2.3.3)
- **Se sprijină pe:** 2.3.3, 2.3.4
- **Hook:**
  - **Tip:** predict, alegere: "A" · "B" · "The same"
  - **Prompt:** "Instrument A trades at 103.50 with MACD 0.70. Instrument B trades at 10.35 with MACD 0.07. Which has stronger momentum?"
  - **Răspuns:** "The same": PPO ≈ 0.68% la amândouă.
- **Interacțiunea centrală:**
  1. BUILD: MACD din două EMA, cu scăderea animată.
  2. Hotspot "Tap where MACD crosses zero", apoi reveal: aceeași lumânare în care EMA 12 trece peste EMA 26.
  3. TAP pe încrucișările cu linia de semnal.
  4. Histograma ca diferență: scade în timp ce MACD e încă pozitiv. Momentum-ul încetinește, dar asta nu e o predicție.
- **Try:**
  - **Widget:** `indicator-builder`, 3 rânduri.
  - **Obiectiv:** "Fill in MACD, signal and histogram for each row."
  - **Reușită:** toate celulele ± 0.01 (valorile din fișă).
- **Practică:**
  - S13: încrucișarea cu linia de semnal, cu costuri, pe R1, R2 și R0.
  - Arena: bullish, cu panoul MACD.
- **Check:**
  - q-trd-10 (numeric): histograma.
  - q-trd-11 (mcq): zero cross = încrucișarea EMA 12/26.
  - q-trd-12 (mcq): de ce MACD nu are niveluri fixe de overbought (e nemărginit; se folosește PPO).
- **Dovezi:** (R2 §5.6)
  - **C · Mixed** ca membru al familiei de încrucișări; nu există dovezi robuste pentru semnalele MACD în sine.
  - **D · Unproven** pentru MACD ca overbought / oversold (StockCharts: „not particularly useful”) și pentru divergențele lui („common in strong uptrends”, vezi 2.4.5).
- **Necesită:** S2 (MACD, PPO)
- **Termeni noi de glosar:** macd, signal-line, macd-histogram, ppo

**Fișa tehnică**

**Formulele:**
- MACD = EMA12 − EMA26;
- Signal = EMA9(MACD), cu k = 0.2;
- Histogram = MACD − Signal;
- PPO = (EMA12 − EMA26) ÷ EMA26 × 100.

**Exemplu pentru `indicator-builder`** (semnalul anterior = 0.50):

| Rând | EMA12 | EMA26 | MACD | Signal = prev + 0.2 × (MACD − prev) | Histogram |
|---|---|---|---|---|---|
| 1 | 104.20 | 103.50 | 0.70 | 0.50 + 0.2 × 0.20 = 0.54 | 0.16 |
| 2 | 104.60 | 103.70 | 0.90 | 0.54 + 0.2 × 0.36 = 0.612 → 0.61 | 0.288 → 0.29 |
| 3 | 104.70 | 103.85 | 0.85 | 0.612 + 0.2 × 0.238 = 0.6596 → 0.66 | 0.1904 → 0.19 |

Calculul folosește valorile nerotunjite; afișarea e cu 2 zecimale.

**PPO, exemplul din hook:** 0.70 ÷ 103.50 × 100 = 0.68%; 0.07 ÷ 10.35 × 100 = 0.68%.

**Redundanța:** MACD e o încrucișare EMA 12/26. Pus lângă un crossover de medii, e aceeași informație de două ori.

#### 2.3.6 · ADX and DMI: strength without direction
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Calculate +DM, −DM and true range for a candle, including inside and outside candles.
  2. Calculate +DI, −DI and DX from summed values, and read ADX as trend strength without direction.
  3. Use an ADX threshold as a regime filter and measure its hits and misses against hidden regime labels.
- **Concepte:** adx-dmi (nou), trend-definitions (nou, 2.3.1), range ✓
- **Se sprijină pe:** 2.3.3 (netezirea Wilder), 2.3.1. True range e definit aici; ATR complet vine în 2.4.6.
- **Hook:**
  - **Tip:** predict, alegere: "Bullish" · "Bearish" · "Neither"
  - **Prompt:** "ADX rose from 15 to 40 while LABX fell 5%. Is that bullish?"
  - **Răspuns:** "Neither". E un trend puternic, iar ADX nu are direcție.
- **Interacțiunea centrală:**
  1. Worked: +DM, −DM, TR pe o lumânare (fișa); cazurile inside (ambele 0) și outside (se păstrează doar cel mai mare).
  2. `Formula` pentru DI și DX, din sume.
  3. `regime-filter`: slider de prag 15–35 pe segmente cu regimul ascuns. Tabel de precizie și recall (R2 §5.5, practice).
- **Try:**
  - **Widget:** `regime-filter`, 40 de segmente (20 R1, 20 R2) cu etichetele ascunse.
  - **Obiectiv:** "Choose an ADX threshold that labels at least 70% of the trend segments 'trend' while calling no more than 30% of the range segments 'trend'."
  - **Reușită:** recall ≥ 70% și rata de fals pozitive ≤ 30%. Intervalul valid de praguri se fixează din seed.
- **Practică:**
  - Clasificarea regimului cu ADX vs eticheta ascunsă, pe R1, R2 și R0. Pe R0, ADX trece des de 25 din întâmplare.
  - Arena: sideways vs bullish, cu panoul ADX.
- **Check:**
  - q-trd-13 (numeric): +DM / −DM.
  - q-trd-14 (numeric): DX din DI.
  - q-trd-15 (mcq): ADX nu dă direcția; scăderea de la 50 nu înseamnă „trend over”.
- **Dovezi:** (R2 §5.5, §3.13)
  - **D · Unproven** pentru încrucișările DI.
  - **C · Mixed** pentru ADX ca filtru de regim: util ca idee, dar „heavily smoothed and lags” și „can filter out as many good signals as bad” (StockCharts).
- **Necesită:** S2 (ADX/DMI)
- **Termeni noi de glosar:** adx, directional-indicator

**Fișa tehnică** (StockCharts, 14 perioade)

1. **Mișcarea direcțională:**
   - +DM = H − H₋₁, dacă e pozitiv și mai mare decât (L₋₁ − L); altfel 0;
   - −DM = L₋₁ − L, dacă e pozitiv și mai mare decât (H − H₋₁); altfel 0;
   - inside bar: ambele 0.
2. Netezire Wilder pentru TR, +DM și −DM; prima valoare e suma pe 14.
3. +DI = 100 × sm(+DM) ÷ sm(TR); −DI = 100 × sm(−DM) ÷ sm(TR).
4. DX = 100 × |+DI − −DI| ÷ (+DI + −DI).
5. ADX = (ADX₋₁ × 13 + DX) ÷ 14. Are nevoie de ~150 de lumânări ca să se stabilizeze.

**Exemplu lucrat:**
- **O lumânare:**
  - anterioara: H 101.00, L 100.00, C 100.60; curenta: H 101.50, L 100.40, C 101.20;
  - up move 0.50; down move = 100.00 − 100.40 = −0.40, deci 0;
  - +DM = 0.50; −DM = 0;
  - TR = max(1.10; |101.50 − 100.60| = 0.90; |100.40 − 100.60| = 0.20) = 1.10.
- **Sume pe 3 lumânări** (exemplu didactic): +DM 1.20, −DM 0.30, TR 3.00.
  - +DI = 40, −DI = 10;
  - DX = 100 × 30 ÷ 50 = 60.

**Praguri** (Wilder): ADX > 25 = trend puternic; < 20 = fără trend; 20–25 = zonă gri. Sunt convenții, nu rezultate.

**Library:** Aroon (n = 25) și panta de regresie, ca alte măsuri de trend (R2 §5.10).

#### 2.3.7 · Parabolic SAR and SuperTrend: trailing lines that flip
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Calculate the next Parabolic SAR value from the previous SAR, the extreme point and the acceleration factor.
  2. Calculate a SuperTrend band from the candle midpoint and the ATR.
  3. Explain why indicators that are always in the market whipsaw when the market ranges.
- **Concepte:** stop-and-reverse-indicators (nou), trailing-stop ✓, range ✓
- **Se sprijină pe:** 2.3.6, 1.3 (trailing stop)
- **Hook:**
  - **Tip:** predict, slider 0–100%
  - **Prompt:** "Wilder, who invented the Parabolic SAR, estimated what share of the time markets trend?"
  - **Răspuns:** ~30%
- **Interacțiunea centrală:**
  1. Worked PSAR în doi pași, cu factorul de accelerare care crește la un extrem nou.
  2. Construcția benzii SuperTrend și regula „final band” (banda de jos nu coboară cât timp trendul e în sus).
  3. Slider pe pas și maxim (PSAR), respectiv pe multiplicator (SuperTrend): numărul de whipsaw-uri vs durata medie a trade-ului.
  4. Preview 2.7.4: aceeași linie folosită doar ca trailing stop pe o poziție, fără inversare.
- **Try:**
  - **Widget:** `indicator-builder`, 2 rânduri PSAR.
  - **Obiectiv:** "Calculate the SAR for the next two candles."
  - **Reușită:** 99.04 și 99.13 (± 0.01).
- **Practică:**
  - S13: PSAR always-in, pe R1, R2 și R0, cu costuri.
  - Arena: bullish, cu PSAR ca trailing stop (S1).
- **Check:**
  - q-trd-16 (numeric): pasul SAR.
  - q-trd-17 (numeric): banda SuperTrend.
  - q-trd-18 (scenario): de ce pierde always-in-ul în range.
- **Dovezi:** (R2 §5.7, §5.9)
  - **D · Unproven** ca sisteme de sine stătătoare: PSAR „prone to whipsaws more than half the time”; SuperTrend „generates false signals”; setările implicite diferă de la o platformă la alta.
  - **Mechanic** ca mecanică de trailing.
- **Necesită:** S2 (PSAR, SuperTrend), S1 (trailing stop), S13
- **Termeni noi de glosar:** parabolic-sar, acceleration-factor, supertrend

**Fișa tehnică**

**Parabolic SAR** (Wilder):
- **SAR ascendent:** SARₜ = SARₜ₋₁ + AF × (EP − SARₜ₋₁), unde EP e maximul extrem al trendului.
- **Factorul de accelerare:** AF pornește de la 0.02, crește cu 0.02 la fiecare EP nou și se oprește la 0.20.
- SAR-ul ascendent nu poate depăși minimele ultimelor două lumânări.
- Se inversează când prețul trece de SAR.

**Exemplu lucrat:**
1. SAR 99.00, EP 101.00, AF 0.02 → 99.00 + 0.02 × 2.00 = **99.04**.
2. Maxim nou 101.40: EP = 101.40, AF = 0.04 → 99.04 + 0.04 × (101.40 − 99.04) = 99.04 + 0.0944 = **99.13**.
3. Verificare: 99.13 e sub minimele ultimelor două lumânări (în date: 100.20 și 100.60).

**SuperTrend** (TradingView):
- benzile de bază = (H + L) ÷ 2 ± m × ATR;
- banda finală de jos urcă doar (dacă close-ul anterior nu a fost sub ea), iar cea de sus doar coboară;
- linia = banda de jos în trend urcător; inversarea la close dincolo de banda activă;
- exemplu: H 101.00, L 100.00, ATR 0.40, m = 3 → 100.50 − 1.20 = **99.30**;
- setări uzuale: ATR 10, m = 3, dar diferă între platforme.

#### 2.3.8 · Ichimoku basics and look-ahead traps
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Calculate Tenkan, Kijun and the two cloud lines from period highs and lows.
  2. Explain why Ichimoku's lines are mostly Donchian midpoints, so they are not five independent confirmations.
  3. Spot look-ahead in a backtest that uses the forward-shifted cloud or the Chikou line.
- **Concepte:** ichimoku-basics (nou), look-ahead-bias (nou), indicator-literacy (nou, 2.3.3)
- **Se sprijină pe:** 2.3.3, 2.3.4
- **Hook:**
  - **Tip:** predict, alegere: "Five" · "Three" · "Fewer than you'd think"
  - **Prompt:** "Ichimoku draws five lines. How many independent pieces of information do they carry?"
  - **Răspuns:** "Fewer than you'd think". Patru linii vin din maximele și minimele acelorași ferestre; Chikou e close-ul mutat înapoi.
- **Interacțiunea centrală:**
  1. BUILD fiecare linie, pas cu pas, din maxime și minime.
  2. Overlay „Ichimoku = Donchian midpoints”: Tenkan și Kijun se suprapun peste mijloacele canalelor Donchian 9 și 26.
  3. Hotspot "Find the look-ahead": două backtest-uri, unul lângă altul.
     - **Corect:** la lumânarea t compară close-ul cu norul desenat la t, calculat cu date până la t − 26.
     - **Greșit:** la lumânarea t folosește linia Chikou desenată la t, adică close-ul de la t + 26.
     - Cursantul apasă pe rândul care folosește viitorul.
- **Try:**
  - **Widget:** `indicator-builder`.
  - **Obiectiv:** "Calculate Tenkan, Kijun, Senkou A and Senkou B from the highs and lows given."
  - **Reușită:** 102.00 / 101.50 / 101.75 / 101.00 (± 0.01).
- **Practică:**
  - S13: breakout din nor vs breakout Donchian 26 pe aceleași date. Toggle-ul „look-ahead bug” arată profitul fals.
  - Arena: bullish, cu norul (S2).
- **Check:**
  - q-trd-19 (numeric): Kijun.
  - q-trd-20 (mcq): cinci linii nu înseamnă cinci confirmări.
  - q-trd-21 (scenario): găsește look-ahead-ul.
- **Dovezi:**
  - **D · Unproven:** nu există dovezi robuste peer-reviewed; e în esență un pachet de mijloace Donchian, adică un sistem de canal și breakout (R2 §5.8).
  - **Mechanic:** look-ahead-ul (R2 §5.0, §7.5 pct. 3).
- **Necesită:** S2 (Ichimoku), S13
- **Termeni noi de glosar:** ichimoku-cloud, look-ahead-bias, repainting

**Fișa tehnică** (setări 9/26/52, StockCharts)

| Linie | Formula | Exemplu |
|---|---|---|
| Tenkan | (maximul pe 9 + minimul pe 9) ÷ 2 | (104.00 + 100.00) ÷ 2 = 102.00 |
| Kijun | (maximul pe 26 + minimul pe 26) ÷ 2 | (105.00 + 98.00) ÷ 2 = 101.50 |
| Senkou A | (Tenkan + Kijun) ÷ 2, mutat cu +26 | 101.75 |
| Senkou B | (maximul pe 52 + minimul pe 52) ÷ 2, mutat cu +26 | (106.00 + 96.00) ÷ 2 = 101.00 |
| Chikou | close-ul mutat cu −26 | — |

**Norul** e verde când A > B.

**Look-ahead și repainting:**
- ZigZag, mediile centrate, canalele de regresie, swing pivots și Chikou folosesc informație care nu exista la momentul barei;
- backtestul folosește doar valori „as-of”.

---

## 2.4 · Oscillators and volatility (9 lecții)

### Fișa unității

- **Scop:**
  - oscilatorii de momentum: ROC și momentum, RSI, Stochastic, Williams %R, CCI, cu formulele calculate de mână și cu redundanța dintre ei;
  - de ce „overbought” nu înseamnă „vinde”;
  - divergențele, cu nota lor reală;
  - volatilitatea: true range, ATR, deviația standard și volatilitatea istorică, clusterele de volatilitate;
  - adaptarea mărimii la volatilitate (L16);
  - Bollinger Bands și squeeze-ul, canalele Keltner și Donchian.
- **De ce aici:**
  - Oscilatorii au sens doar după ce cursantul deosebește trendul de range (1.5, 2.3.1, 2.3.6). De aceea miturile despre overbought și oversold (R2 §5.38) stau aici, nu înainte (R2 §9.2).
  - Volatilitatea e familia cu fundamentul cel mai solid după trend: volatilitatea se adună în clustere (R2 §8.1), iar ATR-ul pe care se sprijină stop-urile și sizing-ul din L16, 2.7 și 2.11 vine de aici.
  - L16 urcă aici din vechiul U3, după lecția care predă ATR-ul (README §9).
- **Se sprijină pe:**
  - 2.3.3 (EMA, netezirea Wilder) și 2.3.6 (true range);
  - 1.4: sizing din stop (L09), stop dincolo de zgomot (L10), expunere (L12);
  - 1.5: range vs trend;
  - 0.2: eșantion.
- **Checkpoint (test out ≥ 80%):** 15 întrebări:
  - 6 numerice (ROC, RSI, %K și %R, true range, ATR Wilder, Bollinger %b);
  - 3 despre redundanță și regim;
  - 3 despre divergențe și confirmare;
  - 3 de sizing pe volatilitate (din L16).
- **Laboratorul unității: Same rule, different markets** (`strategy-lab-lite` + `squeeze-lab`, S13 / S7, mod onest; R2 §5.38 pct. 6, §8.5 pct. 3):
  - patru reguli: RSI fade (vinde sub 70, cumpără peste 30), ROC > 0, fade la banda Bollinger, breakout după squeeze;
  - rulate pe R0, R1, R2 și R3, cu costuri;
  - **concluzia așteptată:** fade-urile câștigă în R2 și pierd în R1; momentum-ul invers; pe R0, toate pierd cât costurile. După squeeze se poate prezice mărimea mișcării, nu direcția (R3).
- **Fire din spirală:**
  - **Risc:** ATR, stop-ul dincolo de zgomot, mărimea redusă, riscul constant (L16); gap-ul care sare stop-ul.
  - **Dovezi:** A pentru momentum pe 3–12 luni și pentru clusterele de volatilitate, D pentru pragurile oscilatorilor.
  - **Statistică:** corelația dintre indicatori.
  - **Psihologie:** „three indicators agree” ca falsă confirmare.
  - **Costuri:** fade-urile au multe trade-uri.
- **Surse:**
  - R2 §5.11–5.23, §5.35–5.38, §8.1, §8.5;
  - R1 §2.7 (IN-05–IN-07, IN-09, IN-10);
  - R5 RF-12 (sizing pe volatilitate);
  - L16, în [../U3-risk-comes-first.md](../U3-risk-comes-first.md).
- **Trimiteri:** volatility targeting → 3.12; volatilitatea implicită și VIX → 3.9 și 4.1; sizing pe ATR la nivel de portofoliu → 2.11.

### Lecțiile

#### 2.4.1 · Momentum and rate of change
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Calculate momentum and rate of change over n candles.
  2. Tell bounded oscillators from unbounded ones, and explain why unbounded ones have no fixed overbought level.
  3. Explain why the horizon matters: the strong momentum evidence covers 3–12 months, not 10 hourly candles.
- **Concepte:** oscillator (nou), momentum-roc (nou), trend ✓
- **Se sprijină pe:** 2.3.4, 2.3.1 (dovezile despre persistența trendului)
- **Hook:**
  - **Tip:** predict, alegere: "Random walk" · "Trending market" · "Mean-reverting market"
  - **Prompt:** "The rule 'buy when 12-period ROC is above 0' runs on three simulated markets. Where does it beat random entries after costs?"
  - **Răspuns:** "Trending market". Edge-ul există doar dacă piața are autocorelație; R1 are drift prin construcție (R2 §5.15).
- **Interacțiunea centrală:**
  1. Worked ROC și momentum (fișa).
  2. Match: RSI, Stochastic, Williams %R, MFI („bounded 0–100”) vs MACD, CCI, ROC, OBV („unbounded”).
  3. Laboratorul „Momentum switch” (R2 §8.5 pct. 3).
  4. Cardul de orizont: Moskowitz-Ooi-Pedersen și Jegadeesh-Titman lucrează pe luni, nu pe ore.
- **Try:**
  - **Widget:** `strategy-lab-lite`, regula ROC(12) > 0, pe R0, R1 și R2.
  - **Obiectiv:** "Run the rule on all three markets. Pick the one where it beats random entries after costs."
  - **Reușită:** alege R1 și răspunde corect la întrebarea de debrief: "On R0 the rule lost about the costs".
- **Practică:**
  - Laboratorul pe R0, R1, R2, cu lookback-ul 10 / 20 / 50.
  - Arena: bullish și sideways, cu panoul ROC.
- **Check:**
  - q-osc-1 (numeric): ROC.
  - q-osc-2 (mcq): bounded vs unbounded.
  - q-osc-3 (scenario): un studiu pe 12 luni nu justifică o regulă pe 10 lumânări de 1H.
- **Dovezi:** (R2 §5.15, §8.1)
  - **A · Robust** pentru time-series momentum pe 3–12 luni:
    - 58 de contracte futures, pozitiv „for every contract examined” (Moskowitz, Ooi & Pedersen 2012);
    - trend following profitabil pe 110 ani (Hurst, Ooi & Pedersen 2017);
    - cross-sectional momentum: Jegadeesh & Titman 1993.
    - Cu avertismentele: costuri (Chan, Jegadeesh & Lakonishok 1996), crash-uri.
  - **D · Unproven** pentru încrucișările ROC pe termen scurt, intraday: orizontul nu se potrivește.
- **Necesită:** S2 (ROC), S13
- **Termeni noi de glosar:** oscillator, momentum, rate-of-change

**Fișa tehnică**
- **Formulele:** ROC = (Cₜ ÷ Cₜ₋ₙ − 1) × 100; Momentum = Cₜ − Cₜ₋ₙ.
- **Exemplu:** C = 105.00, Cₜ₋₁₀ = 100.00 → ROC = 5.00%, momentum = 5.00.
- **Perioade uzuale:** 10, 12, 20, 125, 250 (convenții).
- **Redundanța:** momentum-ul e ingredientul tuturor oscilatorilor din unitate. RSI, Stochastic și CCI îl normalizează în moduri diferite.

#### 2.4.2 · RSI by hand
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Calculate RSI from average gains and losses, including one step of Wilder's smoothing.
  2. Read RSI's 70/30 lines, the 50 centreline and Brown's bull-market and bear-market ranges.
  3. Explain why RSI can stay above 70 for long stretches in a trend.
- **Concepte:** rsi (nou), oscillator (nou, 2.4.1)
- **Se sprijină pe:** 2.4.1, 2.3.3 (netezirea Wilder)
- **Hook:**
  - **Tip:** predict, slider 0–100, pas 1
  - **Prompt:** "Five price changes: +1.00, −0.50, +0.80, +0.40, −0.30. Guess the 5-period RSI."
  - **Răspuns:** 73.33. În recap: "Gains outweighed losses almost three to one."
- **Interacțiunea centrală:**
  1. `worked` / BUILD în celule: media câștigurilor și a pierderilor, RS, RSI; apoi pasul Wilder (fișa).
  2. Figură: RSI(14) într-un trend R1, cu un interval lung peste 70, marcat cu `Zone`, în timp ce prețul continuă să urce.
  3. Slider pe perioadă (2–30): numărul lumânărilor „overbought” se schimbă de câteva ori. Pragul depinde de perioadă.
  4. Brown: în bull market, RSI oscilează în jur de 40–90, iar în bear market în jur de 10–60. Benzile se mută odată cu trendul.
- **Try:**
  - **Widget:** `indicator-builder`, pasul 2 al exemplului.
  - **Obiectiv:** "The next change is +0.20. Update average gain, average loss, RS and RSI."
  - **Reușită:** 0.39 / 0.13 / 3.06 / 75.38 (± 0.01; calculul folosește 0.392 și 0.128).
- **Practică:**
  - Predict → reveal pe evenimentele „RSI > 70” în R1 vs R2 (R2 §5.11, practice).
  - Arena: sideways vs bullish, cu panoul RSI.
- **Check:**
  - q-osc-4 (numeric): RSI din mediile date.
  - q-osc-5 (mcq): centrul de 50 și benzile Brown.
  - q-osc-6 (scenario): RSI peste 70 timp de 20 de lumânări într-un trend; ce înseamnă.
- **Dovezi:** (R2 §5.11, §5.38)
  - **Mechanic** pentru formulă.
  - **D · Unproven** pentru încrucișările 70/30 ca semnale de inversare:
    - nu există dovezi robuste că prezic întoarceri în general;
    - StockCharts: „works best when prices move sideways”;
    - edge-urile RSI(2) pe indici, din backtest-urile practicienilor, sunt marcate în R2 ca neverificate.
- **Necesită:** S2 (RSI)
- **Termeni noi de glosar:** rsi, overbought, oversold

**Fișa tehnică**

**Formulele** (StockCharts):
- RSI = 100 − 100 ÷ (1 + RS), unde RS = media câștigurilor ÷ media pierderilor;
- prima medie e simplă; apoi (prev × (n − 1) + valoarea curentă) ÷ n;
- dacă media pierderilor = 0, RSI = 100.

**Exemplu lucrat** (n = 5, pentru calcul de mână; standardul e 14):
1. Câștiguri: 1.00 + 0.80 + 0.40 = 2.20 → media 0.44. Pierderi: 0.50 + 0.30 = 0.80 → media 0.16.
2. RS = 0.44 ÷ 0.16 = 2.75 → RSI = 100 − 100 ÷ 3.75 = **73.33**.
3. Schimbarea următoare, +0.20:
   - câștig mediu = (0.44 × 4 + 0.20) ÷ 5 = 0.392;
   - pierdere medie = (0.16 × 4 + 0) ÷ 5 = 0.128;
   - RS = 3.0625 → RSI = 100 − 100 ÷ 4.0625 = **75.38**.

**Setări:** 14 (Wilder), 70/30, 80/20 pentru mai puține semnale, RSI(2) pentru termen scurt. Toate sunt convenții (R2 §5.38 pct. 5).

**Atenție:** RSI ≠ „relative strength”, adică comparația cu un alt instrument (Library, Nivelul 3).

#### 2.4.3 · Stochastic, Williams %R and CCI: one story told three times
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Calculate stochastic %K, Williams %R and a short CCI from the same candles.
  2. Show that Williams %R equals %K minus 100.
  3. Explain why three agreeing oscillators are not three confirmations, and pick indicators that add different information.
- **Concepte:** stochastic-family (nou), indicator-redundancy (nou), oscillator (nou, 2.4.1)
- **Se sprijină pe:** 2.4.2
- **Hook:**
  - **Tip:** predict, alegere: "Three" · "Two" · "About one"
  - **Prompt:** "RSI, Stochastic and Williams %R all say 'overbought'. How many independent signals is that?"
  - **Răspuns:** "About one"
- **Interacțiunea centrală:**
  1. Worked %K și %R pe aceleași cifre, apoi identitatea %R = %K − 100 (`Formula`).
  2. Worked CCI(5), cu input pe ultimul pas.
  3. `oscillator-overlay`: RSI, Stochastic, %R și CCI pe un panou, cu corelațiile afișate (R2 §5.12, practice).
  4. Match: oscilator ↔ ideea formulei („close în range-ul recent”, „câștiguri vs pierderi”, „abaterea prețului tipic de la medie”).
- **Try:**
  - **Widget:** `oscillator-overlay`, 6 indicatori disponibili: RSI, Stochastic, %R, CCI, OBV, ATR.
  - **Obiectiv:** "Pick two indicators whose correlation on this chart is below 0.5."
  - **Reușită:** perechea aleasă are corelația calculată < 0.5. Orice pereche din familia de momentum dă > 0.8 și e respinsă cu explicația.
- **Practică:**
  - Overlay pe R1 și R2.
  - Arena: sideways, cu Stochastic.
- **Check:**
  - q-osc-7 (numeric): %K.
  - q-osc-8 (numeric): %R din %K.
  - q-osc-9 (mcq): de ce „three oscillators agree” nu e o confluență.
- **Dovezi:**
  - **Mechanic:** identitatea %R = %K − 100.
  - **D · Unproven:** nu există dovezi robuste pentru semnalele Stochastic și CCI; StockCharts: semnalele timpurii sunt „frequent and prone to whipsaw”, iar oscilatorii merg cel mai bine în range.
  - Regula 4 a lui Bollinger: combină indicatori necoliniari (R2 §5.12–5.14, §5.0).
- **Necesită:** S2 (Stochastic, %R, CCI)
- **Termeni noi de glosar:** stochastic-oscillator, williams-r, cci, collinearity

**Fișa tehnică**

| Indicator | Formula (n = 14 implicit) | Exemplu |
|---|---|---|
| Stochastic %K (fast) | (C − LLₙ) ÷ (HHₙ − LLₙ) × 100; %D = SMA3(%K) | HH 104.00, LL 100.00, C 103.00 → **75** |
| Slow / Full (14,3,3) | %K slow = SMA3(%K fast); %D = SMA3(%K slow) | — |
| Williams %R | (HHₙ − C) ÷ (HHₙ − LLₙ) × −100 | (104.00 − 103.00) ÷ 4.00 × −100 = **−25** = 75 − 100 |
| CCI | TP = (H + L + C) ÷ 3; CCI = (TP − SMA(TP)) ÷ (0.015 × deviația medie) | TP-uri 100, 101, 102, 101, 103 → SMA 101.40; deviația medie (1.40 + 0.40 + 0.60 + 0.40 + 1.60) ÷ 5 = 0.88; CCI = 1.60 ÷ 0.0132 = **121.21** |
| StochRSI | formula stochastic aplicată pe valorile RSI | doar în Library |

**Pragurile:**
- 80/20 la Stochastic; −20/−80 la %R;
- ±100 la CCI: Lambert a ales 0.015 ca 70–80% din valori să cadă între ±100, iar procentul depinde de perioadă.

**Corelațiile:** RSI, Stochastic, %R, CCI și MFI spun în mare același lucru. Momentum + volum sau momentum + volatilitate adaugă informație diferită.

#### 2.4.4 · Overbought is not a sell signal
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Run the same RSI fade rule on a trending and a ranging market, and compare the win rates.
  2. Explain the three reasons "overbought" fails as a sell signal: regime, horizon and arbitrary thresholds.
  3. Decide, for a given regime, whether an oscillator extreme suggests a fade, a strong trend, or nothing.
- **Concepte:** overbought-oversold (nou), range ✓, trend ✓, rsi (nou, 2.4.2)
- **Se sprijină pe:** 2.4.2, 2.4.3, 2.3.6 (regimul)
- **Hook:**
  - **Tip:** predict, alegere: "It falls" · "It keeps rising" · "Coin flip"
  - **Prompt:** "In this course's trend market (R1), RSI(14) crosses above 70. Over the next 10 candles, what happens more often?"
  - **Răspuns:** "It keeps rising". Rezultatul vine din laborator, iar R1 are drift prin construcție. Lecția spune asta, nu o prezintă ca lege generală.
- **Interacțiunea centrală:**
  1. Simularea pe două panouri (R2 §5.38 pct. 6): aceeași regulă „sell when RSI crosses back below 70”, pe R1 și pe R2. Rata de câștig se inversează.
  2. Trei carduri de mituri (R2 §5.38 pct. 1–5):
     - „overbought = a urcat mult, nu trebuie să scadă”;
     - regimul și orizontul (pe luni, „overbought” a fost în medie un semn *bullish*);
     - pragurile sunt convenții.
  3. Match: regimul (trend / range / neclar) ↔ ce faci cu extremul (urmezi trendul / fade cu stop / nimic).
- **Try:**
  - **Widget:** `strategy-lab-lite`, regula fixată, pe R1 și R2.
  - **Obiectiv:** "Run 'sell when RSI crosses back below 70' on both markets. Report both win rates and choose the conclusion."
  - **Reușită:** ratele raportate la ± 1 pp de cele ale laboratorului; concluzia aleasă: "The rule depends on the regime".
- **Practică:**
  - Același laborator pe R0 (pierde cât costurile).
  - Arena: bullish vs sideways.
- **Check:**
  - q-osc-10 (mcq): ce înseamnă overbought.
  - q-osc-11 (scenario): RSI 78 într-un trend cu HH/HL; ce faci.
  - q-osc-12 (mcq): de unde vin pragurile 70/30.
- **Dovezi:** (R2 §5.38, §8.1)
  - **D · Unproven:** pragurile oscilatorilor nu prezic inversările; depind de trend.
  - **A · Robust:** momentum-ul intermediar (3–12 luni) merge în direcția opusă mitului.
  - Inversarea pe termen scurt (1 săptămână – 1 lună) e marcată nevericată în R2.
- **Necesită:** S13, S2
- **Termeni noi de glosar:** fade

**Fișa tehnică**

**Regula testată:**
- short la close-ul lumânării în care RSI(14) coboară înapoi sub 70;
- stop la maximul ultimelor 5 lumânări + 0.25 ATR;
- ieșire la 10 lumânări sau la stop;
- costuri incluse;
- versiunea long, în oglindă, la 30.

**Raportul:** N, win rate, R mediu după costuri, pe R0, R1 și R2, plus intrările aleatoare.

#### 2.4.5 · Divergences, with honest grades
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Identify regular and hidden divergences by reading the oscillator at the same candles as the price swings.
  2. Apply a confirmation rule (a price structure break, or the oscillator crossing 50) before acting on a divergence.
  3. Count how many divergences appeared before the actual top in the lab, and say what that implies.
- **Concepte:** divergence (nou), rsi (nou, 2.4.2), pattern-confirmation (nou, 2.1.3)
- **Se sprijină pe:** 2.4.2, 2.4.4, 1.5 (swing-uri)
- **Hook:**
  - **Tip:** predict, alegere: "None or one" · "Two or three" · "Often several"
  - **Prompt:** "In a strong uptrend, how many bearish RSI divergences usually appear before the real top?"
  - **Răspuns:** "Often several" (StockCharts: „Strong uptrends can show many bearish divergences before a top”).
- **Interacțiunea centrală:**
  1. DRAW cu `divergence-drawer`: o linie pe cele două maxime de preț și una pe RSI la *aceleași* lumânări. Aplicația verifică corespondența.
  2. Match pe 4 tipuri: regular și hidden × bull și bear, cu explicația afișată imediat (R2 §5.36).
  3. TAP pe failure swings (Wilder), doar pe panoul RSI.
  4. Tally-ul „divergences before the actual top” pe 20 de trenduri R1.
- **Try:**
  - **Widget:** `divergence-drawer`, mod didactic.
  - **Obiectiv:** "Draw the bearish divergence: connect the two price highs, then the RSI values at the same two candles."
  - **Reușită:** ancorele exact pe lumânările swing-urilor (c18 și c31 în seria de conținut), în ambele panouri.
  - **Feedback la ancore pe alte lumânări:** "Compare the oscillator at the same candles as the price swings."
- **Practică:**
  - Predict → reveal după divergențe în R1, R2 și R0.
  - Arena: reversal.
- **Check:**
  - q-osc-13 (classify): tipul de divergență.
  - q-osc-14 (mcq): confirmarea înainte de acțiune.
  - q-osc-15 (scenario): a treia divergență bearish într-un trend; ce arată laboratorul.
- **Dovezi:** **D · Unproven** (R2 §5.35–5.37)
  - nu există dovezi robuste peer-reviewed;
  - divergențele bearish pe MACD sunt „common in strong uptrends”;
  - hidden divergence, Cardwell, failure swings: fără dovezi.
- **Necesită:** S2, S3
- **Termeni noi de glosar:** divergence, hidden-divergence, failure-swing

**Fișa tehnică**

| Tip | Prețul | Oscilatorul | Teoria |
|---|---|---|---|
| Regular bullish | lower low | higher low | inversare în sus |
| Regular bearish | higher high | lower high | inversare în jos |
| Hidden bullish | higher low (în uptrend) | lower low | continuare |
| Hidden bearish | lower high (în downtrend) | higher high | continuare |

**Reguli:**
- valorile oscilatorului se citesc la aceleași lumânări ca swing-urile de preț (N = 3);
- „mai fiabilă după un overbought sau oversold” (Wilder, după StockCharts);
- confirmarea: ruperea structurii de preț sau RSI care trece de 50 (MACD de 0).

**Cardwell** (Library): „positive reversal” = RSI face un minim mai jos în zona 30–50, în timp ce prețul face un minim mai sus.

**Failure swing (Wilder):** RSI sub 30, revine peste, coboară fără să treacă sub 30, apoi rupe maximul anterior. Ignoră prețul.

#### 2.4.6 · Measuring volatility: true range, ATR and standard deviation
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Calculate true range when a candle gaps, and update ATR with Wilder's smoothing.
  2. Express ATR as a percentage of price to compare instruments.
  3. Explain volatility clustering, and why ATR forecasts how much price will move, not which way.
- **Concepte:** volatility ✓, historical-volatility (nou), volatility-clustering (nou)
- **Se sprijină pe:** 2.3.6 (true range), 2.3.3 (Wilder), 1.3 (gap-uri)
- **Hook:**
  - **Tip:** predict, slider 0.30–1.20, pas 0.01
  - **Prompt:** "ATR(14) was 0.40. A new candle has a true range of 1.10. Guess the new ATR."
  - **Răspuns:** 0.45. „Media se mișcă încet: o singură lumânare mare o schimbă puțin.”
- **Interacțiunea centrală:**
  1. Worked TR cu gap și actualizarea Wilder (fișa).
  2. ATR%: LABX la 100.00 cu ATR 0.45, față de un instrument la 10.00 cu ATR 0.045. Ambele au 0.45%.
  3. Figură R3: perioade liniștite și agitate. Predict: "After this busy stretch, will the next 10 candles be busy or quiet?" Clusterele se văd.
  4. Deviația standard și HV: o mișcare zilnică de 2% înseamnă ~31.7% anualizat (2% × √252).
- **Try:**
  - **Widget:** `indicator-builder`, 3 lumânări (a doua cu gap) și ATR-ul anterior.
  - **Obiectiv:** "Fill in each candle's true range, then update the ATR."
  - **Reușită:** toate celulele ± 0.01. Datele: prima lumânare are TR 1.10, ca în hook; restul se fixează în conținut.
- **Practică:**
  - Pe R3: predicția range-ului următoarelor 10 lumânări după ATR mare vs mic, cu tally.
  - Arena: high volatility și low volatility.
- **Check:**
  - q-ta-13 (numeric): true range cu gap (existentă; lipită până acum de L16).
  - q-ta-12 (mcq): ATR nu are direcție (existentă).
  - q-osc-16 (numeric, nouă): actualizarea Wilder.
  - q-ta-12 și q-ta-13 se mută aici; L16 își păstrează setul q-rm-8/9/10.
- **Dovezi:** (R2 §5.16–5.17, §8.1)
  - **Mechanic** pentru definiții.
  - **A · Robust** pentru volatility clustering: unul dintre cele mai solide fapte din finanțe, deci ATR-ul anticipează rezonabil volatilitatea pe termen scurt. E un fapt descriptiv, nu un semnal de direcție.
  - Bollinger: ~90% din close-uri cad în ±2σ, nu 95%, pentru că prețurile nu sunt normale.
- **Necesită:** S2 (ATR, deviația standard); regimul R3
- **Termeni noi de glosar:** true-range, atr-percent, standard-deviation, historical-volatility, volatility-clustering

**Fișa tehnică**

| Măsură | Formula | Exemplu |
|---|---|---|
| True range | max(H − L, \|H − C₋₁\|, \|L − C₋₁\|) | close anterior 100.60; H 101.50, L 100.40 → max(1.10; 0.90; 0.20) = 1.10 |
| ATR (Wilder, 14) | (ATR₋₁ × 13 + TR) ÷ 14 | (0.40 × 13 + 1.10) ÷ 14 = 6.30 ÷ 14 = **0.45** |
| ATR% | ATR ÷ preț × 100 | 0.45 ÷ 100.00 = 0.45% |
| Deviația standard | σ a închiderilor (Bollinger) sau a randamentelor (HV) | — |
| HV anualizată | σ(ln(Cₜ ÷ Cₜ₋₁)) × √252 (zilnic) | 2% × √252 = 31.7% |

**Folosiri** (R2 §5.16):
- stop-uri la k × ATR;
- sizing = risc ÷ (k × ATR) (L16, 2.11);
- filtre de breakout (2.2.2);
- boxuri Renko și P&F (2.1.9).

**Greșeli:**
- compari ATR-uri la prețuri diferite; folosește ATR%;
- citești ATR-ul în creștere ca „bullish”.

#### 2.4.7 · Volatility and adapting your size  ·  `L16`
- **Nivel / durată / tip:** Intermediate · 7 min · Core (7 beat-uri în Learn; scriptul complet în [../U3-risk-comes-first.md](../U3-risk-comes-first.md))
- **Obiective:** (din script)
  1. Measure normal price movement with the average true range (ATR).
  2. Widen stops in volatile markets and reduce size to match.
  3. Keep risk per trade constant across calm and volatile conditions.
- **Concepte:** volatility ✓, position-sizing ✓, gap-risk ✓
- **Se sprijină pe:** 2.4.6; 1.4 (L10 stop dincolo de zgomot, L09 dimensionarea din stop, L12 expunere și gap)
- **Hook:**
  - **Tip:** predict, alegere: "The calm-week trade" · "The volatile-week trade" · "About the same"
  - **Prompt:** "Both trades buy LABX at 50.00. Calm week: 200 units, stop 0.50 below. Volatile week: 50 units, stop 2.00 below. Which loses more if its stop is hit?"
  - **Răspuns:** "About the same": 200 × 0.50 = 50 × 2.00 = 100.00, înainte de costuri.
- **Interacțiunea centrală:**
  - B2 figure: același stop, 49.40, pe un panou calm și pe unul volatil, cu comutator.
  - B3: ATR ca „yardstick”; stop-ul la jumătate de ATR sub nivelul de invalidare.
  - B4 hotspot: lumânarea cu cel mai mare true range e c4 (TR 0.90, din cauza gap-ului); ATR(5) = 0.60.
  - B5 worked: calm 166 de unități (153 cu costuri) vs volatil 55 (54 cu costuri); cursantul calculează 55.
  - B6 reveal: gap prin stop, umplere la 47.60, pierdere 132.00 = 1.33R.
  - B7 callout: schimbi mărimea, nu logica stop-ului; limita de 2% rămâne 2%.
- **Try:**
  - **Widget:** `position-size` în modul `units: "learner"`, cu rigla de preț.
  - **Obiectiv:** "Volatility is up: ATR 1.60, pullback low 48.40. Move the stop half an ATR below the low, then resize so the loss if stopped stays within 100.00."
  - **Reușită:** stop = 47.60 și 40 de unități (pierdere la stop 97.96; 41 de unități ar pierde 100.41).
- **Practică:** Arena: high volatility și low volatility; Risk calculator (`/arena/risk-calculator`).
- **Check:** q-rm-8, q-rm-9, q-rm-10 (setul din script)
- **Dovezi:**
  - **Mechanic:** aritmetica sizing-ului și gap-ul prin stop (R5 RF-07, RF-12, RF-20).
  - **A · Robust:** fundamentul descriptiv, volatility clustering, pentru care ATR-ul recent e un estimator rezonabil (R2 §5.16).
- **Necesită:** — (cerințele de widget sunt în U3: modul learner, rigla de preț, rândul de comparație)
- **Termeni noi de glosar:** — (volatility, atr, invalidation, pullback, exposure, gap, stop-loss și market-order există deja)
- **Note pentru noua poziție:**
  - 2.4.6 predă acum true range-ul și ATR-ul în detaliu, deci B3 și B4 devin reluare.
  - Propunere: B3 se scurtează la o propoziție de legătură („You measured ATR in the last lesson…”), iar hotspot-ul B4 rămâne ca exercițiu de reamintire (retrieval practice), nu ca predare nouă.
  - Restul scriptului rămâne neschimbat.
  - Trimiterile din script spre „L10, L09, L12” devin „1.4.x”.

#### 2.4.8 · Bollinger Bands and the squeeze
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Calculate Bollinger Bands, %b and BandWidth from a 20-period average and standard deviation.
  2. Apply Bollinger's own rules: a band tag is not a signal, and closes outside the bands are at first continuation.
  3. Use the squeeze to expect a bigger move, and show in the lab that it does not predict the direction.
- **Concepte:** bollinger-bands (nou), volatility-squeeze (nou), volatility-clustering (nou, 2.4.6)
- **Se sprijină pe:** 2.4.6, 2.3.2 (SMA)
- **Hook:**
  - **Tip:** predict, alegere: "A reversal soon" · "Continuation" · "Nothing"
  - **Prompt:** "LABX closes above its upper Bollinger Band. According to John Bollinger's own rules, what does that usually mean at first?"
  - **Răspuns:** "Continuation"
- **Interacțiunea centrală:**
  1. Worked: benzile, %b, BandWidth (fișa).
  2. Match pe fragmente: „walks the band” (trend) vs „tags and reverts” (range).
  3. Slider pe k (1.5–2.5): procentul de close-uri din interior. La k = 2, aproape 90%, nu 95%.
  4. `squeeze-lab` (R2 §5.23, practice).
- **Try:**
  - **Widget:** `squeeze-lab`, 20 de squeeze-uri din R3 și R2.
  - **Obiectiv:** "For each squeeze, predict whether the next 10 candles move more than usual, and in which direction."
  - **Reușită:** 20 de predicții făcute și concluzia de debrief aleasă: "Size, not direction". Laboratorul arată rata de reușită pentru mărime și pentru direcție.
- **Practică:**
  - Fade la bandă vs breakout din bandă pe R1, R2 și R0.
  - Arena: low volatility (apoi breakout).
- **Check:**
  - q-osc-17 (numeric): %b.
  - q-osc-18 (mcq): regula „tags are not signals”.
  - q-osc-19 (scenario): după un squeeze, ce poți spune și ce nu.
- **Dovezi:** (R2 §5.19, §5.23, §8.1)
  - **Mechanic** pentru construcție.
  - **A · Robust** pentru „după volatilitate mică urmează volatilitate mai mare” (mean reversion al volatilității, descriptiv).
  - **D · Unproven** pentru direcția de după squeeze și pentru „vinde la banda de sus”: greșeala nr. 1, contra propriei reguli a lui Bollinger. Balsara, Chen & Zheng (2007) arată reguli contrariene profitabile în China după costuri, într-o singură piață.
- **Necesită:** S2 (Bollinger, %b, BandWidth), S7
- **Termeni noi de glosar:** bollinger-bands, percent-b, bandwidth, squeeze

**Fișa tehnică**

**Formulele:**
- mijlocul = SMA20; benzile = mijlocul ± 2σ20;
- %b = (P − banda de jos) ÷ (banda de sus − banda de jos);
- BandWidth = (banda de sus − banda de jos) ÷ mijloc = 4 × coeficientul de variație, la setările implicite.

**Exemplu:** SMA20 100.00, σ 0.50.
- benzile: 99.00–101.00;
- la prețul 100.80: %b = 1.80 ÷ 2.00 = 0.90;
- BandWidth = 2.00 ÷ 100.00 = 0.02, adică 4 × (0.50 ÷ 100.00).

**Regulile lui Bollinger** (parafrazate, R2 §5.19):
- „tags of the bands are just that, tags, not signals”;
- în trend, prețul „merge pe bandă”;
- close-urile în afara benzilor sunt la început semnale de continuare;
- 20/2 e un punct de pornire: ~2.1 la 50 de perioade, ~1.9 la 10;
- se combină cu indicatori necoliniari.

**Squeeze-ul** (versiunea Bollinger): BandWidth la minimul ultimelor 120 de lumânări (convenție; Bollinger spune „multi-month low”). Versiunea TTM e în 2.4.9.

#### 2.4.9 · Keltner and Donchian channels
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Build a Keltner Channel from an EMA and the ATR, and a Donchian channel from the highest high and lowest low.
  2. Detect a TTM-style squeeze, where the Bollinger Bands sit inside the Keltner Channel.
  3. Find the look-ahead bug in a Donchian breakout test that includes the current candle in the channel.
- **Concepte:** volatility-channels (nou), look-ahead-bias (nou, 2.3.8), volatility-squeeze (nou, 2.4.8)
- **Se sprijină pe:** 2.4.8, 2.4.6, 2.3.8 (look-ahead)
- **Hook:**
  - **Tip:** predict, alegere: "A real edge" · "A look-ahead bug" · "Low costs"
  - **Prompt:** "A 20-candle breakout backtest that includes the current candle in the channel shows huge profits. Why?"
  - **Răspuns:** "A look-ahead bug". Cu lumânarea curentă inclusă, maximul canalului se calculează din aceeași lumânare care „rupe” canalul.
- **Interacțiunea centrală:**
  1. Worked Keltner și Donchian (fișa).
  2. Overlay Bollinger + Keltner: squeeze on / off, marcat pe grafic.
  3. Toggle-ul bug-ului de look-ahead pe același backtest (R2 §5.21, practice).
  4. Preview 2.7.4: chandelier exit = maximul pe n − k × ATR.
- **Try:**
  - **Widget:** `strategy-lab-lite`, breakout Donchian 20, pe R1.
  - **Obiectiv:** "Run the test with the bug, then without it. Report both results and which one is real."
  - **Reușită:** ambele valori citite corect (± 0.01R) și "Without the bug" ales ca rezultat real.
- **Practică:**
  - Donchian 20 cu costuri pe R1, R2 și R0.
  - Arena: breakout.
- **Check:**
  - q-osc-20 (numeric): benzile Keltner.
  - q-osc-21 (mcq): condiția de squeeze TTM.
  - q-osc-22 (scenario): găsește bug-ul.
- **Dovezi:** (R2 §5.20–5.23, §5.1, §7.5)
  - **D · Unproven** pentru semnalele Keltner.
  - **C · Mixed** pentru breakout-urile de canal: regula „trading-range break” testată de Brock, Lakonishok & LeBaron 1992; pe futures diversificate se leagă de time-series momentum; pe un singur instrument rezultatele sunt zgomotoase, iar costurile contează.
  - **Mechanic:** look-ahead-ul.
- **Necesită:** S2 (Keltner, Donchian), S13
- **Termeni noi de glosar:** keltner-channel, donchian-channel

**Fișa tehnică**

| Canal | Formula | Exemplu |
|---|---|---|
| Keltner (Raschke) | EMA20 ± 2 × ATR10 | EMA 100.00, ATR 0.40 → **99.20–100.80** |
| Keltner original (1960) | SMA10 a prețului tipic ± SMA10 a range-ului (H − L) | doar în Library |
| Donchian 20 | sus = maximul celor 20 de lumânări *anterioare*; jos = minimul lor; mijloc = media lor | 104.00 / 100.00 → mijloc **102.00** |
| TTM squeeze | Bollinger sus < Keltner sus și Bollinger jos > Keltner jos | σ = 0.30 → benzile Bollinger 99.40–100.60, în interiorul Keltner 99.20–100.80: **squeeze**. Cu σ = 0.50 (99.00–101.00): nu. |

**Turtles:** breakout-urile Turtle de 20 și 55 de zile sunt marcate nevericate în R2. Se predau în 3.13.

---

## 2.5 · Volume, levels and zones (8 lecții)

### Fișa unității

- **Scop:**
  - volumul ca informație despre participare, nu despre direcție;
  - indicatorii cumulativi de volum: OBV, A/D, CMF, MFI;
  - VWAP și anchored VWAP, cu folosirea lor reală ca benchmark de execuție;
  - bazele volume profile (POC, value area, HVN/LVN);
  - pivot points (classic, Fibonacci, Camarilla, Woodie, DeMark);
  - tipurile de gap și island reversal;
  - zonele de supply și demand (doar bazele);
  - Fibonacci, cu nota de dovezi, și iluzia confluenței.
  - Lichiditatea în profunzime (stop-uri adunate, sweep-uri) e 3.1, iar Market Profile e 3.3.
- **De ce aici:**
  - După trend (2.3) și oscilatori (2.4), cursantul are două familii de unelte. Volumul e a treia familie, necoliniară cu primele două (2.4.3).
  - Nivelurile (pivots, POC, VWAP, Fibonacci, zone) completează zonele S/R din 1.5 și pregătesc confluența vs redundanța din 2.8.
  - R2 §9.1 pune volumul (M12) după oscilatori (M8) și Fibonacci și pivot points (M16) după firul de dovezi.
- **Se sprijină pe:**
  - 1.2: volumul pe grafic;
  - 1.5: zone S/R, numere rotunde (L06);
  - 1.3: gap-uri;
  - 2.1.6: window;
  - 2.2: breakout-uri;
  - 2.3.2: SMA;
  - 2.4.3: redundanța indicatorilor;
  - 2.4.6: ATR.
- **Checkpoint (test out ≥ 80%):** 14 întrebări:
  - 6 numerice (relative volume, OBV, VWAP, pivot P și R1, retragerea 61.8%, POC);
  - 4 de clasificare (tipul de gap, cel mai mare volum în zonă, demand vs supply);
  - 4 de dovezi (VWAP ca benchmark vs ca nivel predictiv, Osler, Fibonacci, confluența).
- **Laboratorul unității: Level lab** (S7, mod onest; R2 §8.5 pct. 2 și 8; R3 §5.2):
  - **Replicarea Osler:** cursantul își desenează nivelurile *înainte* de sesiune, iar acestea rămân blocate: zone S/R, numere rotunde, pivots, Fibonacci, POC-ul sesiunii anterioare.
    - Aplicația măsoară cât de des respinge prețul nivelurile lui, față de niveluri aleatoare la aceeași distanță.
    - Măsurarea se face în trei piețe: una în care agenții sintetici pun ordinele la numere rotunde (proprietate declarată a generatorului), una fără acest comportament, și R0.
  - **Contorul de confluență:** un preț aleator → câte linii (Fib, pivot, MA, număr rotund, POC) sunt la ≤ 0.5 × ATR de el.
  - **Concluzia așteptată:** efectul apare doar unde generatorul are ordine adunate și e mic, ca la Osler (60.8% vs 56.2%). Confluența e aproape mereu disponibilă.
- **Fire din spirală:**
  - **Dovezi:** Osler (B, efect mic) vs zone S/D și Fibonacci (D).
  - **Psihologie:** iluzia confluenței, confirmation bias, nivelurile redesenate după fapt.
  - **Costuri:** VWAP ca măsură a calității execuției.
  - **Proces:** nivelurile se desenează înainte și se blochează.
  - **Statistică:** rata de respingere față de nivelurile aleatoare.
- **Surse:**
  - R2 §1.13, §3.6–3.11, §5.24–5.29, §6.1–6.3, §6.8, §7.2, §8.1, §8.5;
  - R3 §5.2, §5.3, §5.6, §5.10;
  - R1 §2.6 (TR-07, TR-13, TR-14), §2.8 (VP-01–VP-04, VP-11).
- **Trimiteri:**
  - lichiditatea și sweep-urile → 3.1;
  - order flow, delta, Market Profile (TPO) → 3.3;
  - Fibonacci în profunzime (clustere, time zones, fans), Elliott, Wyckoff → 3.4;
  - order blocks și FVG → 3.5.

### Lecțiile

#### 2.5.1 · Reading volume
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Calculate relative volume as a candle's volume divided by its 20-candle average.
  2. Explain what volume can and cannot tell you: participation, not direction.
  3. Test "volume confirms breakouts" in the lab against the same breakouts without the filter.
- **Concepte:** volume-analysis (nou), relative-volume (nou), volume (nou, 1.2.4), breakout ✓
- **Se sprijină pe:** 1.2.4 (volumul și comparația cu media pe 20 de lumânări; Try-ul de aici e o reluare mai exactă), 2.2.2 (breakout-uri), 2.3.1 („volume confirms the trend”)
- **Hook:**
  - **Tip:** predict, alegere: "Much more likely" · "A little more likely, on average" · "No difference"
  - **Prompt:** "A breakout happens on three times normal volume. Is it more likely to hold?"
  - **Răspuns:** "A little more likely, on average". În datele Bulkowski, volumul mare la breakout îmbunătățește media la unele pattern-uri. Nota e C, iar R2 o numește „weak–mixed”.
- **Interacțiunea centrală:**
  1. TAP pe lumânările cu relative volume ≥ 2.0.
  2. Callout: volumul nu are direcție (glosarul `volume` spune deja asta). În FX, volumul e „tick volume” (VP-11).
  3. Classify: breakout cu volum mare vs mic, apoi reveal pe 100 de cazuri. Lecția spune explicit că în modul realistic generatorul leagă volumul de continuare, iar în R0 nu (R2 §1.13, practice).
- **Try:**
  - **Widget:** `pattern-tapper`, cu panoul de volum.
  - **Obiectiv:** "Tap every candle with relative volume of 2.0 or more."
  - **Reușită:** toate cele 4 atinse și niciuna în plus.
- **Practică:**
  - Breakout-uri cu și fără filtrul RVOL ≥ 1.5, în modul realistic și pe R0.
  - Arena: breakout, cu volumul pornit.
- **Check:**
  - q-vol-1 (numeric): RVOL = 3,000 ÷ 1,500 = 2.0.
  - q-vol-2 (mcq): ce nu arată volumul (direcția).
  - q-vol-3 (scenario): un rezultat bun al filtrului de volum, dar într-o piață al cărei generator leagă volumul de continuare. Ce poți concluziona despre piețele reale? Nimic, fără date reale.
- **Dovezi:** (R2 §1.13, §5.29, §8.1)
  - **Mechanic:** volumul = unitățile tranzacționate.
  - **C · Mixed:** „volume confirms breakouts”. Bulkowski: volumul mare la breakout îmbunătățește media la triunghiurile simetrice și la falling wedges.
  - Volumul ca informație are suport academic, marcat neverificat în R2.
- **Necesită:** S7; volumul există deja în Arena
- **Termeni noi de glosar:** relative-volume, tick-volume

**Fișa tehnică**
- **RVOL** = V ÷ SMA20(V). Varianta intraday: volumul la ora t ÷ media la aceeași oră (2.9).
- **Climax:** lumânare cu RVOL ≥ 3 și range ≥ 2 × ATR, după o mișcare lungă (convenție). Revine în 2.6.7.
- **Greșeli:**
  - compari volumul brut între instrumente sau epoci;
  - ignori zilele de rebalansare și expirare;
  - ignori forma în U a volumului în cursul zilei (2.9).

#### 2.5.2 · OBV, accumulation/distribution and money flow
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Calculate OBV and the accumulation/distribution line for a few candles.
  2. Show how one huge-volume candle dominates OBV and how A/D ignores gaps.
  3. Explain why the level of OBV or A/D means nothing and only its direction is read.
- **Concepte:** cumulative-volume-indicators (nou), indicator-redundancy (nou, 2.4.3)
- **Se sprijină pe:** 2.5.1, 2.4.2 (MFI e un RSI ponderat cu volum)
- **Hook:**
  - **Tip:** predict, alegere: "Accumulation" · "Distribution" · "Neither"
  - **Prompt:** "LABX gaps down 5% and then closes near the top of that candle's range. Does the A/D line record accumulation or distribution?"
  - **Răspuns:** "Accumulation" (MFM = +0.80). A/D nu vede gap-ul (StockCharts).
- **Interacțiunea centrală:**
  1. Worked OBV, în celule.
  2. „Block day”: o lumânare cu volum de 10× schimbă tot nivelul OBV.
  3. Worked A/D, cu cazul de gap.
  4. Carduri în Library: CMF și MFI.
- **Try:**
  - **Widget:** `indicator-builder`.
  - **Obiectiv:** "Fill in OBV for these five candles."
  - **Reușită:** 1,200 / 400 / 1,900 / 1,300 / 3,300 (exact).
- **Practică:**
  - Overlay OBV pe R1 și R0: „divergențele” OBV apar și pe R0.
  - Arena: bullish, cu OBV.
- **Check:**
  - q-vol-4 (numeric): pasul OBV.
  - q-vol-5 (numeric): MFM.
  - q-vol-6 (mcq): de ce nivelul OBV e arbitrar (depinde de data de start).
- **Dovezi:** **D · Unproven** (R2 §5.24–5.27)
  - nu există dovezi robuste pentru semnalele OBV, A/D, CMF și MFI;
  - nivelul depinde de punctul de start;
  - A/D și CMF nu văd gap-urile;
  - MFI: „oversold levels alone are not reason enough to turn bullish”.
- **Necesită:** S2 (OBV, A/D; CMF și MFI opțional)
- **Termeni noi de glosar:** obv, accumulation-distribution-line, chaikin-money-flow, money-flow-index

**Fișa tehnică**

| Indicator | Formula | Exemplu |
|---|---|---|
| OBV | OBVₜ = OBVₜ₋₁ + V dacă C > C₋₁; − V dacă C < C₋₁; neschimbat la egalitate | close-uri 100.00, 100.40, 100.20, 100.80, 100.70, 101.30 și volume 1,200, 800, 1,500, 600, 2,000 → 1,200 / 400 / 1,900 / 1,300 / 3,300 |
| A/D | MFM = ((C − L) − (H − C)) ÷ (H − L); MFV = MFM × V; A/D = suma cumulată | H 101.00, L 100.00, C 100.90, V 1,000 → MFM 0.80, MFV 800 |
| Cazul de gap | close anterior 105.00; O 99.00, H 100.00, L 98.00, C 99.80 | MFM = (1.80 − 0.20) ÷ 2.00 = **+0.80**, deși ziua a pierdut 4.95% |
| CMF (20) | Σ₂₀ MFV ÷ Σ₂₀ V; de obicei între −0.5 și +0.5; buffer de ±0.05 contra whipsaw-urilor | Library |
| MFI (14) | TP = (H + L + C) ÷ 3; fluxul brut = TP × V, pozitiv când TP crește; MFI = 100 − 100 ÷ (1 + raportul fluxurilor); 80/20 | Library |

#### 2.5.3 · VWAP and anchored VWAP
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Calculate VWAP from typical price and volume, cumulated from the session open.
  2. Explain VWAP's real use as an execution benchmark, and why it resets every session.
  3. Anchor a VWAP to an event and read it as the average price paid since then.
- **Concepte:** vwap (nou), anchored-vwap (nou), trading-costs ✓
- **Se sprijină pe:** 2.5.1, 2.5.2 (prețul tipic), 1.3 (ordinele)
- **Hook:**
  - **Tip:** predict, alegere: "Good" · "Bad" · "It doesn't matter"
  - **Prompt:** "You must buy 3,000 units during today's session. Your average fill ends up below the session VWAP. Is that good or bad execution?"
  - **Răspuns:** "Good": ai plătit mai puțin decât media ponderată cu volum a sesiunii.
- **Interacțiunea centrală:**
  1. Worked VWAP pe 3 lumânări, cu `Formula` și input pe ultimul pas.
  2. Figură: VWAP care se resetează la fiecare sesiune (S5). Callout: nu e definit pe zilnic, săptămânal sau lunar (StockCharts).
  3. Ancora: tragi punctul de start pe un swing low; AVWAP = prețul mediu de la evenimentul acela încoace.
  4. Callout: VWAP-ul din primele lumânări ale sesiunii e instabil.
- **Try:**
  - **Widget:** `vwap-execution`, regimul R6 (sesiune intraday).
  - **Obiectiv:** "Buy 3,000 units in at least 3 orders and finish at or below the session VWAP."
  - **Reușită:** prețul mediu de execuție ≤ VWAP-ul final al sesiunii și ≥ 3 ordine. Costurile se afișează separat.
- **Practică:**
  - Jocul de execuție pe 5 sesiuni R6, cu scor față de VWAP.
  - Arena: (VWAP apare în Arena odată cu S5).
- **Check:**
  - q-vol-7 (numeric): VWAP.
  - q-vol-8 (mcq): de ce se resetează VWAP-ul.
  - q-vol-9 (mcq): VWAP ca benchmark vs ca nivel care „ține”.
- **Dovezi:** (R2 §5.28)
  - **Mechanic:** VWAP ca benchmark de execuție e practică reală de piață.
  - **D · Unproven:** VWAP și AVWAP ca suport sau rezistență predictivă. Singurul mecanism plauzibil e coordonarea algoritmilor care se raportează la VWAP.
- **Necesită:** S2 (VWAP, AVWAP), S5 (sesiuni), regimul R6
- **Termeni noi de glosar:** vwap, anchored-vwap, typical-price

**Fișa tehnică**
- **Formula:** VWAP = Σ(TP × V) ÷ Σ V, cumulat de la deschiderea sesiunii; TP = (H + L + C) ÷ 3.
- **Exemplu:**

  | Lumânare | TP | V | TP × V |
  |---|---|---|---|
  | 1 | 100.00 | 2,000 | 200,000.00 |
  | 2 | 100.50 | 1,000 | 100,500.00 |
  | 3 | 101.00 | 500 | 50,500.00 |
  | Total | | 3,500 | 351,000.00 |

  VWAP = 351,000.00 ÷ 3,500 = **100.29** (100.2857).
- **Anchored VWAP:** aceeași formulă, de la o lumânare aleasă (swing, gap, eveniment). E în programa CMT Level III.
- **Greșeli:** VWAP de sesiune pe lumânări zilnice; prea multă încredere în VWAP-ul de la deschidere.

#### 2.5.4 · Volume profile basics
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Build a volume profile and find the point of control and the 70% value area.
  2. Tell high-volume nodes from low-volume nodes and state what each is claimed to do.
  3. Avoid look-ahead: never use a profile that includes later candles to explain earlier turns.
- **Concepte:** volume-profile (nou), look-ahead-bias (nou, 2.3.8), support-and-resistance ✓
- **Se sprijină pe:** 2.5.1, 2.5.3
- **Hook:**
  - **Tip:** hotspot pe axa de preț
  - **Prompt:** "Tap the price where you think the most volume traded in this session."
  - **Răspuns:** POC = 100.00. Se salvează prețul ales și se compară în recap.
- **Interacțiunea centrală:**
  1. BUILD: volumele pe niveluri de preț se adună în bare orizontale (`Bars`).
  2. Value area extinsă pas cu pas: la fiecare pas se adaugă vecinul cu volumul mai mare.
  3. Comparație: profilul exact din simulator vs aproximarea doar din close-uri (Volume-by-Price, StockCharts).
  4. Demo de look-ahead: un profil construit pe toată fereastra „explică” perfect o întoarcere care s-a produs înainte ca volumul acela să existe.
- **Try:**
  - **Widget:** `profile-builder`, datele din fișă.
  - **Obiectiv:** "Find the point of control and the value-area high and low."
  - **Reușită:** POC = 100.00; VAL = 99.75 și VAH = 100.50 (exact pe niveluri).
- **Practică:**
  - Backtest „prima atingere a POC-ului din sesiunea anterioară” vs niveluri aleatoare, pe R6 și R0.
  - Market Profile → 3.3.
- **Check:**
  - q-vol-10 (numeric): POC.
  - q-vol-11 (mcq): HVN vs LVN, ce se afirmă despre fiecare.
  - q-vol-12 (scenario): profilul are look-ahead.
- **Dovezi:** **D · Unproven** (R2 §6.8; R3 §5.10)
  - nu există dovezi pentru HVN ca suport și rezistență, pentru trecerea rapidă prin LVN sau pentru „naked POC magnets”;
  - mecanismul plauzibil: la prețurile cu volum mare au poziții mulți participanți (comparabil cu Osler);
  - StockCharts: „current bars should not be used to validate past support or resistance”.
- **Necesită:** S2 (volume profile)
- **Termeni noi de glosar:** volume-profile, point-of-control, value-area, high-volume-node, low-volume-node

**Fișa tehnică**

| Nivel | Volum |
|---|---|
| 101.00 | 200 |
| 100.75 | 400 |
| 100.50 | 600 |
| 100.25 | 900 |
| **100.00 (POC)** | **1,200** |
| 99.75 | 500 |
| 99.50 | 200 |
| Total | 4,000; 70% = 2,800 |

**Value area** (se adaugă un nivel pe pas, vecinul cu volumul mai mare; convenția aplicației, iar Market Profile compară câte două niveluri):

| Pas | Se adaugă | Volum cumulat |
|---|---|---|
| Start | POC 100.00 | 1,200 |
| 1 | 100.25 (900 > 500) | 2,100 |
| 2 | 100.50 (600 > 500) | 2,700 |
| 3 | 99.75 (500 > 400) | 3,200 ≥ 2,800 |

Rezultat: **VAL 99.75, VAH 100.50**.

**Formele profilului:** P (short covering sau cumpărare), b (lichidarea pozițiilor long), D (echilibru). Doar ca vocabular.

#### 2.5.5 · Pivot points
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Calculate the classic pivot, R1, S1, R2 and S2 from the previous session's high, low and close.
  2. Name the Fibonacci, Camarilla, Woodie and DeMark variants and what each changes.
  3. Explain why plotting several pivot systems at once guarantees that some line is always "hit".
- **Concepte:** pivot-points (nou), support-and-resistance ✓
- **Se sprijină pe:** 1.5 (S/R), 2.5.3 (sesiunea), 2.4.6 (ATR, pentru toleranțe)
- **Hook:**
  - **Tip:** predict, numeric
  - **Prompt:** "Yesterday's session: high 102.00, low 98.00, close 101.00. Guess today's central pivot."
  - **Răspuns:** 100.33
- **Interacțiunea centrală:**
  1. `Formula` pentru P, R1, S1, R2, S2; ultimul pas (R1) îl calculează cursantul.
  2. Overlay cu 4 sisteme odată: peste 20 de linii (classic 7, Fibonacci încă 6, Camarilla 8, Woodie 1). Contorul „lines within 0.5 ATR of price” arată aproape mereu ≥ 1.
  3. Convenția de timeframe (StockCharts): pe 1–15 minute folosești ziua anterioară; pe 30–120 minute, săptămâna; pe zilnic, luna.
- **Try:**
  - **Widget:** `indicator-builder` (foaia de pivoți).
  - **Obiectiv:** "Calculate P, R1, S1, R2 and S2."
  - **Reușită:** 100.33 / 102.67 / 98.67 / 104.33 / 96.33 (± 0.01).
- **Practică:**
  - Laboratorul de niveluri: frecvența atingerilor la R1 și S1 vs niveluri aleatoare la aceeași distanță.
    - pe R6 cu agenți care urmăresc pivoții (proprietate declarată);
    - pe R6 fără ei;
    - pe R0.
  - Arena: sideways.
- **Check:**
  - q-vol-13 (numeric): P.
  - q-vol-14 (numeric): R1.
  - q-vol-15 (mcq): de ce patru sisteme pe același grafic fac nivelurile fără sens.
- **Dovezi:** **D · Unproven** (R2 §3.10)
  - nu există dovezi robuste peer-reviewed;
  - mecanismul posibil e coordonarea, ca la numerele rotunde;
  - pe R0, pivoții sunt aleatori.
- **Necesită:** S2 (pivot points), S5 (granițele sesiunii)
- **Termeni noi de glosar:** pivot-point

**Fișa tehnică** (H 102.00, L 98.00, C 101.00; la DeMark, O 99.50)

| Sistem | Formule | Valori |
|---|---|---|
| Classic | P = (H + L + C) ÷ 3; R1 = 2P − L; S1 = 2P − H; R2 = P + (H − L); S2 = P − (H − L); R3 = H + 2(P − L); S3 = L − 2(H − P) | P 100.33; R1 102.67; S1 98.67; R2 104.33; S2 96.33; R3 106.67; S3 94.67 |
| Fibonacci | P la fel; R/S1 = P ± 0.382(H − L); R/S2 = P ± 0.618(H − L); R/S3 = P ± (H − L) | R1 101.86; S1 98.81; R2 102.81; S2 97.86; R3 104.33; S3 96.33 |
| Camarilla | R1…R4 = C + (H − L) × 1.1 ÷ 12, ÷ 6, ÷ 4, ÷ 2; S în oglindă | R1 101.37; R2 101.73; R3 102.10; R4 103.20; S1 100.63; S2 100.27; S3 99.90; S4 98.80 |
| Woodie | P = (H + L + 2C) ÷ 4 (marcat nevericat în R2) | P 100.50 |
| DeMark | X = 2H + L + C dacă C > O (H + 2L + C dacă C < O; H + L + 2C dacă C = O); P = X ÷ 4; R1 = X ÷ 2 − L; S1 = X ÷ 2 − H | X 403.00; P 100.75; R1 103.50; S1 99.50 |

**Convenția Camarilla** (Babypips): fade la R3 și S3, cu stop lângă R4 și S4; breakout dincolo de R4 și S4. Doar ca vocabular.

#### 2.5.6 · Gaps: four kinds and an island
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Classify a gap as common, breakaway, runaway or exhaustion from where it appears and the volume around it.
  2. Define when a gap is filled, and explain why "all gaps get filled" is false for breakaway gaps.
  3. Identify an island reversal and compare it with an abandoned baby.
- **Concepte:** gap-types (nou), gap-risk ✓, star-patterns (nou, 2.1.6)
- **Se sprijină pe:** 1.3 (gap-uri, L04), 2.1.6 (window, abandoned baby), 2.2.2 (breakout), 2.5.1 (volum)
- **Hook:**
  - **Tip:** predict, alegere: "True" · "False"
  - **Prompt:** "All gaps get filled. True or false?"
  - **Răspuns:** "False". Pentru gap-urile breakaway și runaway, zicala nu ține (StockCharts).
- **Interacțiunea centrală:**
  1. Figură în 4 pași, câte un tip pe pas, cu locul în structură: range, marginea range-ului, mijlocul trendului, finalul trendului.
  2. Jocul „label in real time” (R2 §3.11.4): etichetezi gap-ul în momentul în care apare; reveal după 20 de lumânări. Concluzie: un gap de epuizare se recunoaște sigur abia după ce s-a umplut.
  3. TAP pe ambele gap-uri ale unei insule.
  4. Comparația abandoned baby ↔ island (CMT Level II).
- **Try:**
  - **Widget:** `gap-classifier`, 4 gap-uri în mod didactic.
  - **Obiectiv:** "Label each gap: common, breakaway, runaway or exhaustion."
  - **Reușită:** 4/4. Gap-ul de epuizare se poate eticheta doar după ce lumânările următoare arată umplerea; până atunci, eticheta corectă e „runaway or exhaustion: can't tell yet”.
- **Practică:**
  - Predict „filled within 20 candles?”, pe tipuri, pe R4 și R0.
  - Arena: event shock.
- **Check:**
  - q-vol-16 (classify): tipul de gap.
  - q-vol-17 (mcq): când e umplut un gap.
  - q-vol-18 (mcq): island reversal, rangul lui din date.
- **Dovezi:** (R2 §3.11)
  - **Mechanic:** definițiile gap-ului și ale umplerii.
  - **C · Mixed:** gap-ul în ziua breakout-ului se asociază cu performanțe mai bune (Bulkowski, la falling wedges).
  - **D · Unproven:** pretenția că runaway gap-ul e „la jumătatea mișcării” și identificarea gap-ului de epuizare în timp real.
  - Island reversal (Bulkowski, peste 2,000 de trade-uri): eșec 31% / 34%, target met 82% / 62%; **rang 38/39 la bottoms și 31/36 la tops**, printre cele mai slabe.
- **Necesită:** S5 (sesiunile, din care se nasc gap-urile), regimul R4
- **Termeni noi de glosar:** common-gap, breakaway-gap, runaway-gap, exhaustion-gap, island-reversal, gap-fill, partial-gap

**Fișa tehnică** (StockCharts, R2 §3.11)

**Definiții:**
- **Gap în sus:** L > H₋₁. **Gap în jos:** H < L₋₁.
- **Gap parțial:** doar deschiderea e dincolo de close-ul anterior; range-urile se suprapun.
- **Umplerea:** prețul revine la extremul ultimei lumânări de dinainte de gap.

| Tip | Unde apare | Volum | Ce se afirmă | Dovezi |
|---|---|---|---|---|
| Common | în range sau congestie | mic | fără semnificație, se umple repede | consens al practicienilor |
| Breakaway | la granița unui pattern sau range | mare | începutul unui trend; marginea gap-ului devine suport | asociat cu performanțe mai bune (Bulkowski) |
| Runaway (measuring) | în mijlocul trendului, fără congestie | mare | „la jumătatea mișcării” | fără dovezi pentru „jumătate” |
| Exhaustion | târziu în trend | foarte mare | finalul trendului; se umple repede | sigur doar după umplere |
| Island reversal | grup de lumânări izolat de un gap pe fiecare parte, la prețuri care se suprapun | mare la al doilea gap | inversare bruscă | rang 38/39 și 31/36 |

#### 2.5.7 · Supply and demand zones
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Draw a demand or supply zone from the base before a strong move away, using one fixed convention.
  2. Explain the contradiction between "more touches make a level stronger" and "fresh zones work best".
  3. Compare first-touch reactions at your zones with reactions at random zones of the same width.
- **Concepte:** supply-demand-zones (nou), support-and-resistance ✓, base-rates ✓
- **Se sprijină pe:** 1.5 (zone S/R, L06), 2.2.2 (breakout), 2.4.6 (ATR)
- **Hook:**
  - **Tip:** predict, alegere: "Stronger" · "Weaker" · "Depends on who you ask"
  - **Prompt:** "A price zone has now been tested three times. Is it stronger or weaker?"
  - **Răspuns:** "Depends on who you ask". Lecția de S/R spune „mai multe atingeri = mai puternic”; lecția de supply/demand spune „zonele proaspete merg cel mai bine”. Cele două se contrazic (R3 §5.6).
- **Interacțiunea centrală:**
  1. Match pe 4 formațiuni: rally-base-rally, drop-base-rally (demand), rally-base-drop, drop-base-drop (supply).
  2. DRAW zona, cu o singură convenție: linia proximală pe corpurile bazei, linia distală pe fitilul extrem.
  3. Callout: zonele se desenează aproape mereu după ce mișcarea s-a produs. Gradarea după „departure strength” e și ea retrospectivă.
  4. Laboratorul Osler-style: zonele tale vs zone aleatoare de aceeași lățime (R3 §5.2 și §5.6, sim).
- **Try:**
  - **Widget:** `zone-drawer`, drop-base-rally în mod didactic.
  - **Obiectiv:** "Draw the demand zone: proximal line at the top of the base's bodies, distal line at the lowest wick."
  - **Reușită:** proximala ∈ [100.38, 100.42] (calculat: 100.40); distala ∈ [100.03, 100.07] (calculat: 100.05).
- **Practică:**
  - Laboratorul unității: rata de reacție la prima atingere pentru zonele proaspete, zonele testate și zonele aleatoare, pe R1, R2 și R0.
  - Arena: reversal.
- **Check:**
  - q-vol-19 (classify): demand vs supply după formațiune.
  - q-vol-20 (mcq): contradicția dintre atingeri și „fresh”.
  - q-vol-21 (mcq): ce a arătat Osler (60.8% vs 56.2%; „strength ratings” inutile).
- **Dovezi:** (R2 §3.6, §3.8, §3.9; R3 §5.2, §5.3, §5.6)
  - **D · Unproven:** zonele de supply și demand ca metodă. Nu există dovezi robuste, iar povestea despre „ordinele instituționale neexecutate” e neverificabilă.
  - **B · Supported, efect mic:** nivelurile S/R publicate și numerele rotunde întrerup trendurile intraday în FX:
    - Osler 2000: 60.8% vs 56.2% pentru niveluri arbitrare, semnificativ, cu efect de cel puțin 5 zile;
    - ordinele adunate la numere rotunde (Osler 2001/2003).
  - Tot Osler 2000: firmele au fost de acord între ele doar în ~30% din cazuri, iar ratingurile lor de „strength” nu au avut valoare predictivă.
- **Necesită:** S3 (zone), S7
- **Termeni noi de glosar:** supply-zone, demand-zone, fresh-zone

**Fișa tehnică**

**Regula aplicației** (R3 §5.6):
1. O plecare puternică: ≥ 2 lumânări de trend cu range total ≥ 3 × ATR, care rupe un swing.
2. O bază compactă: 1–4 lumânări care se suprapun, cu range-ul fiecăreia ≤ 0.6 × ATR (convenție).
3. Linia proximală pe corpuri, linia distală pe fitilul extrem.
4. „Fresh” = neatinsă de la formare.

**Exemplu (drop-base-rally):**
- **Baza:**
  - b1: O 100.40, H 100.45, L 100.05, C 100.20;
  - b2: O 100.20, H 100.35, L 100.10, C 100.30;
  - b3: O 100.30, H 100.38, L 100.08, C 100.25.
- **Plecarea:** O 100.25, C 101.40.
- **Zona:** proximala = cel mai înalt capăt de corp din bază, 100.40; distala = cel mai jos fitil, 100.05.

**Trimitere:** order blocks, FVG și „liquidity” sunt redenumiri ale acestor idei (→ 3.1, 3.5).

#### 2.5.8 · Fibonacci levels and the confluence illusion
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Draw Fibonacci retracements and extensions from a swing and calculate each level.
  2. Explain why 50% is not a Fibonacci ratio and why the 38.2–61.8% zone is almost impossible to falsify.
  3. Count how many "levels" sit near a random price, and decide which confluence factors are independent.
- **Concepte:** fibonacci-levels (nou), confluence (nou), indicator-redundancy (nou, 2.4.3), confirmation-bias ✓
- **Se sprijină pe:** 2.5.5, 2.5.7, 1.5 (pullback, swing-uri), 2.2.7 (measured move)
- **Hook:**
  - **Tip:** predict, slider 0–10
  - **Prompt:** "Pick any price on this chart. How many Fibonacci, pivot, moving-average and round-number lines lie within 0.5 ATR of it?"
  - **Răspuns:** valoarea reală pentru prețul ales, numărată pe graficul figurii (fixat din seed; ținta de design: ≥ 3).
- **Interacțiunea centrală:**
  1. DRAW cu `fib-tool`: ancorele se lipesc de swing low și swing high.
  2. Worked: nivelurile (fișa); ultimul pas, 61.8%, îl calculează cursantul.
  3. Originea raporturilor: n ÷ (n + 1) → 0.618; n ÷ (n + 2) → 0.382; 50% vine din teoria Dow, nu din Fibonacci.
  4. Laboratorul de backtest (R2 §6.1, practice): frecvența întoarcerilor la ±0.5 ATR de 38.2 / 50 / 61.8% vs raporturi aleatoare (41%, 55%, 67%), pe R0.
  5. `confluence-counter` (R2 §6.3, §8.5 pct. 8).
  6. Match: care factori sunt independenți (de exemplu, un nivel de preț și volumul) și care sunt aceeași informație (RSI + Stochastic; MA 20 + EMA 20).
- **Try:**
  - **Widget:** `fib-tool`, swing low 100.00, swing high 110.00.
  - **Obiectiv:** "Draw the retracement from the swing low to the swing high and read the 61.8% level."
  - **Reușită:** ancorele pe 100.00 și 110.00 (cu snap); răspunsul 103.82 (± 0.01).
- **Practică:**
  - Fib vs raporturi aleatoare pe R0 și R1; contorul de confluență pe 20 de prețuri aleatoare.
  - Arena: bullish (pullback-uri).
- **Check:**
  - q-vol-22 (numeric): un nivel de retragere.
  - q-vol-23 (mcq): de ce zona 38.2–61.8 e aproape nefalsificabilă.
  - q-vol-24 (scenario): cinci niveluri se adună la un preț. Câte sunt independente?
- **Dovezi:** **D · Unproven** (R2 §6.1–6.3, §7.2)
  - Batchelor & Ramyar (2005): nu există o apariție nealeatoare a raporturilor Fibonacci în ciclurile Dow Jones;
  - majoritatea pullback-urilor se termină oricum între o treime și două treimi;
  - o eventuală reacție la nivelurile Fibonacci ar veni din coordonare, nu din matematică;
  - confluența funcționează doar dacă factorii sunt predictivi fiecare în parte *și* necoliniari.
- **Necesită:** S3 (Fibonacci), S2 (pentru contor)
- **Termeni noi de glosar:** fibonacci-retracement, fibonacci-extension, confluence

**Fișa tehnică**

**Retracement** (swing low 100.00 → swing high 110.00):

| Nivel | 23.6% | 38.2% | 50% | 61.8% | 78.6% |
|---|---|---|---|---|---|
| Preț | 107.64 | 106.18 | 105.00 | 103.82 | 102.14 |

**Extensii și proiecții:**
- extensia lui AB, măsurată din A: 127.2% → 112.72; 161.8% → 116.18; 261.8% → 126.18;
- proiecția A-B-C, cu C = 105.00: C + k × (B − A):
  - k = 0.618 → 111.18;
  - k = 1.0 → 115.00 (measured move, 2.2.7);
  - k = 1.618 → 121.18.
- Datele Bulkowski despre measured move: piciorul 2 e în medie mai scurt decât piciorul 1.

**Contorul de confluență:** pentru un preț p, numără liniile la ≤ 0.5 × ATR de el:
- Fib de pe ultimele 3 swing-uri;
- pivoții classic;
- SMA 20, 50 și 200;
- numerele rotunde la 0.50;
- POC-ul de ieri.

Pe R0 și cu prețuri aleatoare, media e de mai multe linii. Exact asta e iluzia.

---

## 2.6 · Price action bar by bar (8 lecții)

### Fișa unității

- **Scop:** citirea graficului bară cu bară, în vocabularul lui Al Brooks, cu reguli programabile acolo unde Brooks lasă judecata:
  - trend bars și doji bars, plus suprapunerea barelor;
  - signal bars și entry bars, plus trader's equation;
  - inside bars, outside bars și NR7, cu ordine OCO;
  - pullback-uri în două picioare și numărătoarea H1/H2;
  - canale (tight, broad, micro) și wedge-uri cu trei împingeri;
  - capcane și breakout-uri eșuate;
  - momentum vs epuizare, cu probabilități declarate și calibrare;
  - alinierea pe mai multe timeframe-uri după o regulă scrisă.
- **De ce aici:**
  - Price action-ul leagă tot ce s-a predat:
    - lumânările (2.1) devin bare cu rol;
    - pattern-urile (2.2) devin evoluții în timp real;
    - indicatorii (2.3–2.5) trec în fundal („clean chart”, PA-13);
    - stop entry-urile și OCO din 1.3 capătă setup-uri.
  - Vine înaintea managementului trade-ului (2.7), pentru că intrările, ieșirile și trader's equation se sprijină pe signal bars și pe structură.
  - R1 §2.9 pune PA-01–PA-05 la nivel intermediar; PA-06–PA-09 sunt avansate. Aici se predau doar bazele lor (H1/H2, canale, capcane); tipurile de zi și „Always In” rămân în Library.
- **Se sprijină pe:**
  - 2.1 (anatomia și contextul);
  - 2.2.1 (linii și canale), 2.2.10 (breakout eșuat, busted);
  - 2.3.3 (EMA 20), 2.4.6 (ATR);
  - 1.3 (stop entry, OCO, L03, L04);
  - 1.5 (pullback, breakout, timeframe);
  - 1.4 (R, R:R, expectancy).
- **Checkpoint (test out ≥ 80%):** 14 întrebări:
  - 4 de etichetare (trend sau doji bar, inside / outside / NR7, H1 / H2);
  - 3 numerice (trader's equation, prețurile ordinelor OCO, distanța de stop);
  - 3 de citire (canal tight vs broad, capcana, momentum vs climax);
  - 2 de proces (ierarhia timeframe-urilor, decizia doar după închiderea barei);
  - 2 de dovezi (euristici fără statistici publicate; Osler despre stop-uri).
- **Laboratorul unității: Bar-by-bar replay** (`replay-decider` + `bar-grader`, S7, mod onest):
  - Graficul avansează o bară la fiecare apăsare. La fiecare bară, cursantul poate eticheta (tipul barei, signal bar, H1/H2) și decide (intră, ieși, stai deoparte), cu o probabilitate declarată și cu invalidarea scrisă.
  - Sesiunile amestecă R1, R2 și **sesiuni R0 ascunse**. La final, aplicația arată câte „setup-uri” a găsit cursantul pe datele aleatoare (R3 §4.14, sim) și calibrarea probabilităților (scorul Brier).
  - Scorul e de proces: regula respectată, invalidarea scrisă, calibrarea. Nu e P&L.
- **Fire din spirală:**
  - **Statistică:** probabilități declarate, calibrare, scorul Brier.
  - **Dovezi:** vocabularul lui Brooks e euristic (HEUR) și nu are statistici publicate; Osler arată mecanismul stop-urilor; R0 ascuns.
  - **Psihologie:** a decide înainte de închiderea barei; timeframe shopping.
  - **Proces:** reguli scrise de aliniere; decizia la închiderea barei.
  - **Risc:** stop-ul lângă signal bar; OCO dimensionat din distanța mai mare.
  - **Costuri:** stop entry-urile au slippage; capcanele fac ambele părți să plătească spread-ul.
- **Surse:**
  - R3 §4.1–4.19, §5.4, §5.11;
  - R2 §2.1.12, §3.12, §7.1–7.3;
  - R1 §2.9 (PA-01–PA-13), §3.3 (timeframe conflict);
  - R5 TM-01, TM-02.
- **Trimiteri:**
  - sweep-uri, stop hunts, equal highs și lows → 3.1;
  - BOS / CHoCH, FVG, order blocks decodate → 3.5;
  - Wyckoff (efort vs rezultat) → 3.4;
  - order flow (absorbție, epuizare în delta) → 3.3.

### Lecțiile

#### 2.6.1 · Trend bars and doji bars
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Classify bars as trend bars or doji bars from body size and where the bar closed.
  2. Read runs of trend bars and the overlap between bars as signs of a trend or a range.
  3. Explain why the same bar means something different in a trend and in a range.
- **Concepte:** bar-reading (nou), trend ✓, range ✓, candle-vocabulary (nou, 2.1.1)
- **Se sprijină pe:** 2.1.1, 1.5 (trend și range)
- **Hook:**
  - **Tip:** predict, alegere: "Trend" · "Range" · "Can't tell"
  - **Prompt:** "Six bars in a row overlap heavily and have small bodies. Trend or range?"
  - **Răspuns:** "Range". Suprapunerea mare și corpurile mici arată un echilibru între cumpărători și vânzători.
- **Interacțiunea centrală:**
  1. Figură în 3 pași: o trend bar (corp mare, close lângă extrem) → o doji bar → suprapunerea măsurată între două bare (`Bracket`).
  2. Callout: „doji bar” la Brooks e mai larg decât doji-ul din lumânări (2.1.1). Un corp de ≤ 25% din range e deja „doji bar”.
  3. Contorul „overlap %” pe ultimele 10 bare, pe un fragment R1 și pe unul R2.
  4. Match: 4 fragmente ↔ „strong trend”, „weak trend”, „range”, „breakout”.
- **Try:**
  - **Widget:** `bar-grader`, 20 de bare.
  - **Obiectiv:** "Tag each bar: trend bar or doji bar."
  - **Reușită:** acord ≥ 17/20 cu regula. Dezacordurile se arată cu măsurătorile lor.
- **Practică:**
  - Clasificarea regimului după suprapunere, pe R1, R2 și R0.
  - Arena: sideways vs bullish.
- **Check:**
  - q-pa-1 (classify): din O/H/L/C, trend bar sau doji bar.
  - q-pa-2 (mcq): ce arată suprapunerea mare.
  - q-pa-3 (scenario): o trend bar mare în mijlocul unui range.
- **Dovezi:**
  - **Mechanic** pentru măsurare.
  - **D · Unproven** pentru afirmațiile despre urgență și echilibru: euristici Brooks, fără statistici publicate (R3 §4.1, §4.4).
  - Brooks: majoritatea barelor „leave traders confused”, iar probabilitatea majorității setup-urilor e de ~40–60%.
- **Necesită:** —
- **Termeni noi de glosar:** trend-bar, doji-bar, bar-overlap

**Fișa tehnică** (convenții ale aplicației, după R3 §4.1)

| Măsură | Regula |
|---|---|
| Trend bar | corp ≥ 0.5 × range și close în treimea extremă a range-ului, în direcția corpului |
| Doji bar | corp ≤ 0.25 × range |
| Suprapunerea a două bare | (min(H₁, H₂) − max(L₁, L₂)) ÷ range-ul barei mai mici; 0 dacă nu se ating |
| Citirea | media suprapunerii pe 10 bare: < 30% sugerează trend, > 50% sugerează range |
| Serie de trend bars | ≥ 3 trend bars consecutive în aceeași direcție = urgență |

#### 2.6.2 · Signal bars, entry bars and the trader's equation
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Rate a bull reversal signal bar with a five-point checklist.
  2. Place a stop entry one tick above a signal bar and the protective stop one tick below it.
  3. Check a setup with the trader's equation: chance of winning times reward against chance of losing times risk, after costs.
- **Concepte:** signal-and-entry-bars (nou), traders-equation (nou), expectancy ✓, reward-to-risk ✓
- **Se sprijină pe:** 2.6.1, 1.3 (stop entry, L04), 1.4 (L11 R:R și expectancy)
- **Hook:**
  - **Tip:** predict, numeric (R:R, o zecimală)
  - **Prompt:** "A setup wins 40% of the time. What is the smallest reward-to-risk that breaks even, before costs?"
  - **Răspuns:** 1.5 (0.40 × 1.5 = 0.60 × 1)
- **Interacțiunea centrală:**
  1. `bar-grader` în modul calitate: cursantul notează 6 bare de la 1 la 5, apoi vede scorul după checklist.
  2. Figură: signal bar → ordinul buy stop la 0.01 deasupra → entry bar-ul care îl execută → close-ul entry bar-ului ca primă informație despre trade.
  3. `Formula` pentru trader's equation: 0.40 × 2 − 0.60 × 1 = +0.20R; cu costuri de 0.05R, +0.15R.
  4. Callout: Brooks pune setup-urile de ~60% cu R:R ≥ 1:1 și majoritatea inversărilor, de ~40%, cu R:R ≥ 1:2. Probabilitățile sunt estimări subiective.
- **Try:**
  - **Widget:** `bracket-builder+`, signal bar H 100.80, L 100.20.
  - **Obiectiv:** "Place a buy stop 0.01 above the signal bar's high and a protective stop 0.01 below its low. Read the risk per unit."
  - **Reușită:** entry = 100.81, stop = 100.19, risc 0.62.
  - **Feedback:** "A stop entry fills only if price trades through it. In a fast market it can fill above 100.81."
- **Practică:**
  - Signal-bar grader pe R1, R2 și R0: distribuția rezultatelor după scorul barei.
  - Arena: reversal.
- **Check:**
  - q-pa-4 (mcq): punctele checklist-ului.
  - q-pa-5 (numeric): trader's equation cu costuri.
  - q-pa-6 (numeric): prețul stop entry-ului și al stop-ului.
- **Dovezi:** (R3 §4.9, §4.17)
  - **Mechanic:** trader's equation e aritmetica expectancy-ului.
  - **D · Unproven:** „semnalele de calitate cresc probabilitatea”; euristică fără statistici publicate.
- **Necesită:** S1 (stop entry), S7
- **Termeni noi de glosar:** signal-bar, entry-bar, traders-equation

**Fișa tehnică**

**Checklist-ul pentru o signal bar de inversare bullish** (1 punct pentru fiecare criteriu; convenții după R3 §4.9):
1. Corp bull, cu close-ul în treimea de sus a range-ului.
2. Fitilul de jos ≥ 25% din range (respingere).
3. Fitilul de sus ≤ 15% din range.
4. Range între 0.5 și 2 × ATR(14) (nici prea mică, nici excesivă).
5. Într-o locație: zonă, trendline, minim anterior, țintă de measured move.

Opțional, ca penalizare: suprapunere mare cu barele anterioare.

**Trader's equation:** P(win) × reward − P(loss) × risk − costuri > 0.

**Exemplu:** P = 0.40, reward 2R, risc 1R → 0.80 − 0.60 = +0.20R; după costuri de 0.05R → +0.15R.

#### 2.6.3 · Inside, outside and narrow-range bars
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Identify inside bars, ii and iii sequences, outside bars and NR7 bars from highs and lows.
  2. Set up a one-cancels-the-other pair of stop entries around an inside bar, and size it so the stop-out loss stays within budget.
  3. Explain a hikkake: an inside bar, a false breakout, then a move through the other side.
- **Concepte:** inside-outside-bars (nou), harami-pattern (nou, 2.1.4), volatility-squeeze (nou, 2.4.8), bracket-order ✓
- **Se sprijină pe:** 2.6.2, 2.1.4 (harami vs inside bar), 2.4.8 (contracție → expansiune), 1.3 (OCO)
- **Hook:**
  - **Tip:** predict, alegere: "A bigger move" · "A smaller move" · "No idea"
  - **Prompt:** "Two inside bars in a row: the range has shrunk to half the ATR. Is the next move more likely to be bigger or smaller than usual?"
  - **Răspuns:** "A bigger move" (contracția e urmată de expansiune, ca la squeeze). Direcția rămâne necunoscută.
- **Interacțiunea centrală:**
  1. TAP pe inside bars, outside bars și NR7 (R2 §2.1.12).
  2. Figură: ii → ordinul OCO, buy stop deasupra și sell stop dedesubt, fiecare cu stop-ul de protecție pe partea opusă.
  3. Replay cu ramuri pentru hikkake: ieșire falsă într-o parte, apoi ieșire prin cealaltă.
  4. Comparație: inside bar (range în range) vs harami (corp în corp).
- **Try:**
  - **Widget:** `bracket-builder+` în mod OCO. ii: b1 H 101.00, L 99.80; b2 H 100.80, L 100.00; b3 H 100.70, L 100.10.
  - **Obiectiv:** "Bracket the ii: buy stop above, sell stop below, each with its stop at the other side. Then size it within 100.00 including costs."
  - **Reușită:**
    - buy stop 100.71 și sell stop 100.09;
    - stop-ul long la 100.09 și cel short la 100.71;
    - 138 de unități (cu 139 de unități, pierderea ar fi 100.14).
- **Practică:**
  - Backtest „breakout din NR7 vs intrare aleatoare”, pe regimuri care alternează și pe R0 (R2 §2.1.12).
  - Arena: low volatility, breakout.
- **Check:**
  - q-pa-7 (classify): inside, outside sau NR7.
  - q-pa-8 (numeric): prețurile ordinelor OCO.
  - q-pa-9 (mcq): ce e un hikkake.
- **Dovezi:**
  - **Mechanic** pentru definiții.
  - **D · Unproven** pentru setup-uri: euristici fără statistici publicate; paginile Bulkowski despre hikkake nu au fost preluate (R2 §2.1.12; R3 §4.10).
  - Contracția urmată de expansiune în *mărime* se sprijină pe faptul descriptiv al volatilității care revine la medie (2.4.8).
- **Necesită:** S1 (OCO, stop entry), S7
- **Termeni noi de glosar:** inside-bar, outside-bar, nr7, hikkake

**Fișa tehnică**

| Bară | Regula (R2 §2.1.12, R3 §4.10) |
|---|---|
| Inside bar | H ≤ H₋₁ și L ≥ L₋₁ (Brooks acceptă egalitatea); ii = două consecutive; iii = trei |
| Outside bar | H > H₋₁ și L < L₋₁; ioi = inside–outside–inside |
| NR7 | range-ul barei = cel mai mic din ultimele 7 (NR4 = din ultimele 4) |
| Hikkake | inside bar → o bară care iese printr-o parte → close dincolo de partea opusă a inside bar-ului în ≤ 3 bare (convenție) |

**Dimensionarea OCO-ului din Try:**
- distanța 0.62; costul pe unitate = 0.62 + 0.0005 × (100.71 + 100.09) = 0.7204;
- 100.00 ÷ 0.7204 = 138.8 → **138** (verificat cu rotunjirea comisionului la cent: 138 de unități pierd 99.42);
- textbook, fără costuri: 161.

#### 2.6.4 · Two-legged pullbacks and bar counting
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Count H1 and H2 bars (L1 and L2 in a bear trend) in a pullback.
  2. Identify a two-legged pullback, and place an H2 stop entry with its protective stop.
  3. Explain why the second entry can trap counter-trend traders, and why bar counts mean little in a range.
- **Concepte:** two-legged-pullback (nou), bar-counting (nou), signal-and-entry-bars (nou, 2.6.2)
- **Se sprijină pe:** 2.6.2, 1.5 (pullback, L05)
- **Hook:**
  - **Tip:** hotspot pe grafic
  - **Prompt:** "During this pullback in an uptrend, tap the first bar whose high goes above the previous bar's high."
  - **Răspuns:** bara 4 (H1)
- **Interacțiunea centrală:**
  1. Contorul H/L pe grafic, pe care cursantul îl poate ascunde.
  2. Figură în 3 pași: piciorul A în jos → revenirea B (H1) → piciorul C la un minim nou al pullback-ului → H2.
  3. Callout (R3 §4.6): prima încercare de reluare a trendului eșuează des, iar H2 e intrarea preferată de Brooks. Într-un trend puternic, H1 funcționează; un al patrulea efort sugerează că trendul se transformă în range.
  4. Etichetare pe 30 de pullback-uri, apoi tranzacționare cu stop entry. Jurnalul arată win rate-ul pe numărătoare.
- **Try:**
  - **Widget:** `bar-counter`, datele din fișă.
  - **Obiectiv:** "Label H1 and H2 in this pullback, then place the H2 buy stop and its protective stop."
  - **Reușită:** H1 = b4, H2 = b7; buy stop 104.01, stop 103.69.
- **Practică:**
  - Drill pe R1, cu control R0: numărătorile apar și în zgomot.
  - Arena: bullish (pullback-uri).
- **Check:**
  - q-pa-10 (hotspot): H2.
  - q-pa-11 (numeric): prețul ordinului H2 și al stop-ului.
  - q-pa-12 (mcq): de ce numărătoarea nu înseamnă nimic într-un range.
- **Dovezi:** **D · Unproven**: euristică, fără statistici publicate (rezumatul LuxAlgo, R3 §4.6, §4.17)
- **Necesită:** S1 (stop entry), S7
- **Termeni noi de glosar:** high-1-high-2, two-legged-pullback, second-entry

**Fișa tehnică**

| Bară | H | L | Ce este |
|---|---|---|---|
| b1 | 105.00 | 104.40 | maximul trendului |
| b2 | 104.60 | 104.10 | pullback |
| b3 | 104.30 | 103.90 | finalul piciorului A |
| b4 | 104.50 | 104.00 | **H1** (104.50 > 104.30) |
| b5 | 104.20 | 103.85 | piciorul C începe |
| b6 | 104.00 | 103.70 | minimul nou al pullback-ului; signal bar |
| b7 | 104.35 | 103.95 | **H2** (104.35 > 104.00) |

**Ordinele:** buy stop la 104.01 (0.01 peste maximul lui b6); stop la 103.69 (sub minimul pullback-ului). Riscul e 0.32 pe unitate.

**Regulile numărătorii:**
- se numără bare, nu swing-uri;
- numărătoarea se resetează la un extrem nou al trendului;
- contextul cerut: HH în trend și prețul peste o EMA 20 ascendentă (R3 §4.6).

#### 2.6.5 · Channels and wedges, bar by bar
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Tell tight, broad and micro channels apart by the size of the pullbacks and the bars' lows.
  2. Identify a three-push wedge and a wedge flag.
  3. Explain why a channel line drawn after the fact scores touches you could not have traded.
- **Concepte:** price-channels (nou), three-push-wedge (nou), trendlines-and-channels (nou, 2.2.1), wedges-and-broadening (nou, 2.2.8)
- **Se sprijină pe:** 2.2.1, 2.2.8, 2.6.4
- **Hook:**
  - **Tip:** predict, alegere: "Strong" · "Weak" · "Can't tell"
  - **Prompt:** "For 8 bars in a row, no bar's low went below the previous bar's low. Is this uptrend strong or weak?"
  - **Răspuns:** "Strong": un micro channel (R3 §4.5).
- **Interacțiunea centrală:**
  1. `line-drawer` în modul „locked”: canalul desenat se blochează, apoi graficul rulează. Se numără doar atingerile de *după* desen (R3 §4.5, sim).
  2. Match: 3 fragmente ↔ tight, broad, micro.
  3. Marcarea împingerilor 1–2–3 ale unui wedge. Aplicația măsoară impulsul fiecărei împingeri.
  4. Callout: wedge-ul lui Brooks e o idee de trei împingeri; wedge-ul clasic din 2.2.8 e o idee de linii convergente. Statisticile Bulkowski sunt despre cel clasic.
  5. Card în Library: „spike and channel”.
- **Try:**
  - **Widget:** `line-drawer`, mod locked, R1 didactic.
  - **Obiectiv:** "Draw the channel now. Only touches after you draw it will count. Then name the channel type."
  - **Reușită:** linia ancorată pe 2 swing lows anterioare (± 0.25 ATR); după rulare, ≥ 1 atingere numărată; tipul de canal numit corect.
- **Practică:**
  - Canale pe R1 și R2; control R0.
  - Arena: bullish.
- **Check:**
  - q-pa-13 (classify): tipul de canal.
  - q-pa-14 (mcq): ce e un wedge flag (H3).
  - q-pa-15 (mcq): atingerile de dinainte de desen nu se pun la socoteală.
- **Dovezi:** **D · Unproven**: euristici fără statistici publicate (R3 §4.5, §4.11, §4.13)
- **Necesită:** S3, S7
- **Termeni noi de glosar:** micro-channel, three-push-wedge, spike-and-channel

**Fișa tehnică** (convenții)

| Element | Regula |
|---|---|
| Tight channel | pullback-uri ≤ 1 × ATR și ≤ 3 bare |
| Broad channel | pullback-uri > 50% din piciorul anterior; se apropie de un range |
| Micro channel (bull) | ≥ 5 bare consecutive cu L ≥ L₋₁ (Brooks: niciun minim sub minimul anterior) |
| Wedge cu 3 împingeri | 3 swing highs succesive tot mai sus, cu impuls în scădere: piciorul împingerii 3 < piciorul împingerii 2 |
| Wedge flag | pullback cu 3 împingeri contra trendului: H3 sau L3 |

#### 2.6.6 · Traps and failed breakouts
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Identify a failed breakout as a close back inside the range within one to three bars.
  2. Locate where trapped breakout traders' stops sit, and explain how their exits can fuel the move against them.
  3. Decide between "breakout" and "failure" only after the bar closes, and write the invalidation for either choice.
- **Concepte:** trapped-traders (nou), false-breakout ✓, breakout ✓, invalidation-level ✓
- **Se sprijină pe:** 2.2.10, 2.6.2, 1.5 (L06 breakout-uri și breakout-uri eșuate)
- **Hook:**
  - **Tip:** predict, slider 0–100%
  - **Prompt:** "Al Brooks estimates what share of attempts to break out of a trading range fail?"
  - **Răspuns:** ~80%, *estimarea lui Brooks*, nu o statistică (R3 §4.8, [HEUR]). În recap se compară cu rata din laborator pe R2.
- **Interacțiunea centrală:**
  1. `replay-decider` (R3 §4.8, sim): la fiecare breakout, cursantul alege una din trei:
     - "Enter the breakout";
     - "Fade after a close back inside";
     - "Stand aside".
     Fiecare alegere cere o invalidare. Reveal după 10 bare.
  2. Vizualizarea „trapped agents” (R3 §5.11, sim): unde stau stop-urile celor prinși.
  3. Cardul de nume: același eveniment se cheamă 2B (Sperandeo), turtle soup, swing failure, „liquidity sweep” (→ 3.1, 3.5).
  4. Callout Osler: stop-urile sunt ordine de urmărire a trendului. Trendurile accelerează când ajung la stop-uri adunate. De aceea, un breakout prin stop-uri poate continua la fel de bine cum poate eșua.
- **Try:**
  - **Widget:** `replay-decider`, 10 breakout-uri dintr-un range R2.
  - **Obiectiv:** "At each breakout, choose: enter, fade after a close back inside, or stand aside, and set the invalidation."
  - **Reușită:** 10 decizii luate doar *după* închiderea barei de breakout, fiecare cu stop-ul pe partea corectă:
    - pentru fade, dincolo de extremul eșuat;
    - pentru breakout, înapoi în range sub nivel;
    - „Stand aside” e mereu valid.
  - Rezultatul financiar nu intră în scor.
- **Practică:**
  - Același replay pe R1 (breakout-urile țin mai des) și pe R0.
  - Arena: false breakout.
- **Check:**
  - q-pa-16 (mcq): ce face un breakout „eșuat” (close înapoi în 1–3 bare).
  - q-pa-17 (scenario): unde sunt stop-urile celor prinși.
  - q-pa-18 (mcq): de ce nu decizi înainte de închidere.
- **Dovezi:**
  - **D · Unproven** pentru „breakout-urile eșuate se inversează” ca regulă:
    - cifra de 80% a lui Brooks e o euristică;
    - un singur preprint nerevizuit (Mahadzva 2026, FX G10) a găsit că nivelurile „sweep-uite” prezic *continuarea*.
  - **B · Supported** pentru mecanismul stop-urilor: stop-urile se adună dincolo de numerele rotunde și accelerează mișcările (Osler 2001/2003, 2005).
  - Surse: R3 §4.8, §5.4, §5.11; R2 §3.9, §3.12.
- **Necesită:** S7 (replay cu ramuri, inventarul agenților)
- **Termeni noi de glosar:** trapped-trader, failed-breakout

**Fișa tehnică**
- **Breakout eșuat:** close dincolo de nivel, apoi close înapoi în range în ≤ 3 bare (R3 §4.8).
- **Breakout:** close dincolo cu ≥ 0.5 × ATR și o bară următoare în aceeași direcție. Brooks: o trend bar mare urmată de alta = „follow-through” (R3 §4.7).
- **Stop-urile celor prinși:**
  - cei care au cumpărat breakout-ul în sus au stop-urile sub bara de breakout sau înapoi în range;
  - cei care au vândut în range au stop-urile peste maximul eșuat.

#### 2.6.7 · Momentum or exhaustion?
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Score a move's strength with a checklist: runs of trend bars, overlap, pullback depth, closes near extremes, gaps between bars.
  2. Flag a climax bar as a bar more than 2.5 ATR tall late in an extended move.
  3. Explain why the same large bar can be a breakout or a climax, and record a calibrated probability instead of a certainty.
- **Concepte:** momentum-vs-exhaustion (nou), bar-reading (nou, 2.6.1), volatility ✓
- **Se sprijină pe:** 2.6.1, 2.4.6 (ATR), 2.3.3 (EMA 20), 2.5.1 (climax de volum)
- **Hook:**
  - **Tip:** predict, alegere: "Breakout" · "Climax" · "Can't tell from one bar"
  - **Prompt:** "A bar three times the ATR closes at its high after a long rally. Breakout or climax?"
  - **Răspuns:** "Can't tell from one bar". Lectura dublă e chiar abilitatea, dar și ambiguitatea (R3 §4.15).
- **Interacțiunea centrală:**
  1. `strength-meter`: checklist-ul se completează pe un fragment.
  2. Detectorul de climax: bara marcată, cu contextul ei (distanța de EMA 20 în ATR, lungimea trendului).
  3. Predicție cu probabilitate (slider 0–100%): "Will the move continue for 5 more bars?" Scorul e Brier, nu „corect sau greșit”, iar calibrarea se strânge pe săptămâni.
- **Try:**
  - **Widget:** `strength-meter`, două mișcări (una R1 în desfășurare, una R1 aproape de vârf).
  - **Obiectiv:** "Score both moves with the checklist."
  - **Reușită:** ambele scoruri la ± 1 punct de scorul aplicației, iar mișcarea cu steaguri de epuizare identificată corect.
- **Practică:**
  - Predicții cu probabilitate pe R1, R2 și R0, cu graficul de calibrare.
  - Arena: high volatility, reversal.
- **Check:**
  - q-pa-19 (mcq): ce element din checklist arată forța.
  - q-pa-20 (mcq): ce face dintr-o bară mare un climax (contextul).
  - q-pa-21 (numeric): scorul Brier pentru o predicție de 0.70 care nu s-a realizat: (0.70 − 0)² = 0.49.
- **Dovezi:** **D · Unproven**: euristici (R3 §4.13, §4.15). Scorul Brier e **Mechanic**: o regulă de scor.
- **Necesită:** S2 (EMA 20, ATR)
- **Termeni noi de glosar:** climax, exhaustion, brier-score

**Fișa tehnică: `strength-meter`** (convenții după R3 §4.15)

| +1 pentru forță | −1 pentru epuizare |
|---|---|
| ≥ 3 trend bars consecutive în direcția mișcării | climax bar: range ≥ 2.5 × ATR după ≥ 20 de bare de trend |
| suprapunerea medie pe ultimele 5 bare < 30% | distanța de EMA 20 > 3 × ATR |
| pullback-urile din picior ≤ 1 × ATR | suprapunere în creștere pe ultimele 5 bare |
| ≥ 70% din ultimele 10 bare închid în treimea extremă, în direcție | fitile contra trendului pe ultimele 3 bare |
| „gap bars”: minimul barei peste maximul barei de acum două bare (R3 §4.15) | nicio continuare după bara de climax |

**Scorul** e între −5 și +5. Scorul nu e o probabilitate; probabilitatea o declară cursantul și se calibrează în timp.

#### 2.6.8 · Aligning timeframes
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Choose a higher, a trading and a lower timeframe about 4–6 times apart.
  2. Apply a rule written in advance for which timeframe wins when they disagree.
  3. Recognise timeframe shopping in your own journal.
- **Concepte:** timeframe-alignment (nou), multi-timeframe-analysis (nou, 1.5), timeframe ✓, confirmation-bias ✓, trend-definitions (nou, 2.3.1)
- **Se sprijină pe:** 1.5 (introducerea în analiza pe mai multe timeframe-uri), 2.3.1, 2.6.4
- **Hook:**
  - **Tip:** predict, alegere: "The daily" · "The hourly" · "Whatever my written rule says"
  - **Prompt:** "The daily chart is in an uptrend. The hourly chart is falling. Which one wins?"
  - **Răspuns:** "Whatever my written rule says". Ierarhia se decide înainte, nu la fiecare trade (R1 §3.3, „timeframe conflict”).
- **Interacțiunea centrală:**
  1. `mtf-panes`: trei timeframe-uri legate (4H / 1H / 15m, raport 4×). Cursantul își alege bias-ul pe 4H, setup-ul pe 1H și momentul intrării pe 15m. Aplicația impune ierarhia aleasă.
  2. Exemplu: Triple Screen-ul lui Elder (tendința pe timeframe-ul ~5× mai mare, oscilatorul contra ei pe timeframe-ul de lucru, intrarea cu un buy stop peste bara anterioară). R2 îl marchează nevericat online.
  3. Jurnal: pentru fiecare decizie, ce timeframe a decis-o. Detectorul „switched timeframe after a loss or before an entry against the plan” (S14).
- **Try:**
  - **Widget:** `mtf-panes`, regula: "Trade only in the 4H direction; set the stop on 1H structure; time the entry on 15m."
  - **Obiectiv:** "Commit a 4H bias, find a 1H pullback setup and time the entry on 15m."
  - **Reușită:**
    - direcția intrării = bias-ul de pe 4H;
    - stop-ul sub ultimul swing low de pe 1H (± 0.05);
    - nicio schimbare de timeframe între commit și intrare.
- **Practică:**
  - Seria multi-scală R1 pe 5 sesiuni; detectorul S14 activ.
  - Arena: bullish, cu comutatorul de timeframe (S4).
- **Check:**
  - q-pa-22 (mcq): raportul dintre timeframe-uri.
  - q-pa-23 (scenario): conflictul 4H / 1H și regula ta.
  - q-pa-24 (scenario): recunoaște timeframe shopping-ul într-o intrare din jurnal.
- **Dovezi:** **D · Unproven** (R2 §7.1; R3 §4.18)
  - nu există dovezi directe robuste;
  - plauzibil ca filtru de trend, având în vedere dovezile pentru momentum;
  - fiecare timeframe în plus adaugă grade de libertate, deci risc de overfitting și de timeframe shopping.
- **Necesită:** S4 (15m, 1H, 4H, 1D legate), S14 (detectorul de timeframe shopping), S15
- **Termeni noi de glosar:** timeframe-shopping, triple-screen

**Fișa tehnică**
- **Raporturi recomandate:** ~4–6× (R2 §7.1). Variante: 1D → 4H → 1H (6×, 4×); 4H → 1H → 15m (4×, 4×).
- **Ierarhie implicită** (scrisă în planul v1, 1.6):
  1. timeframe-ul mare dă direcția; dacă e range, nu se tranzacționează în direcția lui;
  2. timeframe-ul de lucru dă setup-ul și stop-ul;
  3. timeframe-ul mic dă doar momentul intrării și nu poate anula 1 sau 2.
- **Detectorul S14:** o schimbare de timeframe în ≤ 10 minute după o pierdere, sau imediat înaintea unei intrări contra bias-ului declarat.
- **Library:** „Always In” (Brooks, R3 §4.16): dacă ar trebui să ții o poziție chiar acum, long sau short? Conceptul e avansat și periculos în range.

---

## 2.7 · Managing the trade (8 lecții)

### Fișa unității

- **Scop:** ce se întâmplă între intrare și ieșire, cu fiecare alegere arătată ca un compromis în R:
  - intrarea: anticipare, confirmare sau retest;
  - scaling in: split entry și pyramiding, față de averaging down;
  - ținte fixe în R, structurale sau pe volatilitate;
  - trailing stops: ATR, chandelier, structură, medie mobilă, PSAR;
  - stop-ul mutat la breakeven;
  - ieșirile parțiale;
  - time stops și ieșirile planificate;
  - disciplina stop-ului;
  - MAE și MFE pe propriul jurnal.
- **De ce aici:**
  - Tharp și R1 §4 pct. 16: intrarea e componenta cea mai puțin importantă, iar ieșirile și mărimea domină rezultatele. Cursurile retail inversează ordinea.
  - Unitatea vine după ce cursantul are setup-uri (2.1–2.6) și înainte de strategiile pe regim (2.8), pentru că fiecare strategie din 2.8 are nevoie de o politică de ieșire.
  - Jurnalul auto-completat din 1.6 are acum destule trade-uri pentru analiza MAE/MFE (S15).
- **Se sprijină pe:**
  - 1.4: R, sizing, R:R, expectancy (L08–L11);
  - 1.3: ordine market, limit, stop, trailing, OCO (L03, L04);
  - 1.6: jurnalul (L17);
  - 1.8: averaging down în laboratorul de ruinare;
  - 2.2.3: anticipare vs confirmare;
  - 2.3.7 și 2.4.9: liniile de trailing;
  - 2.4.6: ATR.
- **Checkpoint (test out ≥ 80%):** 14 întrebări:
  - 7 numerice în R (R:R pe trei intrări, worst case la pyramiding, expectancy pe ținte, chandelier, breakeven pe un set, R mixt, MAE și MFE);
  - 4 de compromis (ce câștigi și ce pierzi la fiecare tehnică);
  - 3 de disciplină (stop lărgit, averaging down, ieșire fără motiv).
- **Laboratorul unității: Exit policy comparator** (`trail-comparator` + `exit-planner` + `target-sweep`, S13 / S15, mod onest):
  - **Intrările:** un flux fix de 300 de intrări pentru un setup de pullback (seed fix), în R1 și R2, plus intrări aleatoare pe R0.
  - **Politicile de ieșire comparate:** ținte fixe de 1–5R, trailing ATR cu k = 1.5 / 2 / 3 / 4, chandelier, swing, EMA 20, breakeven la +1R, jumătate la +1R, time stop N.
  - **Raportul fiecărei politici:** expectancy după costuri, deviația standard a R, win rate, max drawdown, giveback mediu, durata medie.
  - **Concluzia așteptată:**
    - nicio politică nu câștigă în toate regimurile;
    - pe R0, nicio politică de ieșire nu face expectancy pozitivă: ieșirile modelează distribuția, nu creează edge (R5 TM-18);
    - cursantul își alege politica pentru playbook (2.13) și o scrie.
- **Fire din spirală:**
  - **Risc:** riscul total ≤ 1R la scaling, gap-ul care rămâne și la breakeven.
  - **Statistică:** expectancy vs win rate, varianța, eșantionul pentru MAE.
  - **Psihologie:**
    - breakeven-ul din disconfort;
    - averaging down ca sunk cost;
    - stop-ul lărgit ca loss aversion;
    - parțialele luate prea devreme ca disposition effect (→ 2.12).
  - **Proces:** fiecare regulă scrisă înainte de intrare; etichete de motiv la ieșiri.
  - **Costuri:** stop-urile mai strânse măresc costul în R; mai multe ieșiri înseamnă mai multe comisioane.
- **Surse:**
  - R5 §3 (TM-01–TM-18), RF-15 (martingale vs anti-martingale);
  - R2 §5.7, §5.9, §5.22, §7.3, §7.6;
  - R1 §2.15 (TM-01–TM-08), §4 pct. 16;
  - R3 §4.17.
- **Trimiteri:**
  - edge ratio, MAE/MFE în backtest și Monte Carlo pe trade-uri → 3.11;
  - Kelly, risk of ruin, equity-curve trading → 3.12;
  - portfolio heat și sizing pe ATR la nivel de cont → 2.11.

### Lecțiile

#### 2.7.1 · Entries: anticipate, confirm or wait for the retest
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Compare anticipation, confirmation and retest entries on the same setup in entry price, stop distance and reward-to-risk.
  2. Match each entry to its order type (limit, stop or market) and name each one's fill risk.
  3. Judge entry methods by expectancy over many trades, not by hit rate.
- **Concepte:** entry-techniques (nou), anticipation-vs-confirmation (nou, 2.2.3), limit-order ✓, market-order ✓, expectancy ✓
- **Se sprijină pe:** 2.2.3, 1.3 (L03), 1.4 (L11)
- **Hook:**
  - **Tip:** predict, alegere: "Anticipation" · "Confirmation" · "Retest"
  - **Prompt:** "Same double bottom, three ways in. Which entry has the best reward-to-risk?"
  - **Răspuns:** "Anticipation" (7.58), dar e și cea care eșuează cel mai des. În recap: "Best R:R is not best expectancy."
- **Interacțiunea centrală:**
  1. Worked: tabelul celor trei intrări (fișa). Cursantul calculează ultima celulă, R:R la retest = 2.06.
  2. Match: intrare ↔ tip de ordin ↔ riscul de execuție (limit: s-ar putea să nu se execute; stop: slippage; market: spread-ul și prețul).
  3. Callout „adverse selection” (R5 TM-01): ordinele limit se execută mai des pe trade-urile care merg apoi împotriva ta și ratează cei mai buni câștigători.
  4. `entry-comparator`: aceleași setup-uri pe 100 de replay-uri, cu cele trei intrări.
- **Try:**
  - **Widget:** `entry-comparator`, 100 de double bottoms din R2, mod onest, costuri incluse.
  - **Obiectiv:** "Run all three entries. Pick the one with the highest expectancy after costs, and say whether it also had the highest hit rate."
  - **Reușită:** alegerea = argmax(expectancy) din rezultatele laboratorului, iar răspunsul la a doua parte corespunde datelor.
- **Practică:**
  - Același comparator pe R1 și R0. Pe R0, toate intrările au expectancy ≈ minus costurile.
  - Arena: reversal, breakout.
- **Check:**
  - q-tm-1 (numeric): R:R pentru o intrare.
  - q-tm-2 (mcq): tipul de ordin pentru retest și riscul lui.
  - q-tm-3 (scenario): o metodă cu win rate 65% și expectancy −0.05R.
- **Dovezi:**
  - **Mechanic:** R, prețul de execuție, compromisurile tipurilor de ordin (R5 TM-01, TM-02).
  - **C · Mixed** pentru „confirmarea crește rata” (R2 §7.3):
    - double tops neconfirmate eșuează ~60%, double bottoms ~48%;
    - harami 53% → three inside up 65%;
    - engulfing 63% → three outside up 75%.
- **Necesită:** S1 (stop entry, limit), S13, S15
- **Termeni noi de glosar:** anticipation-entry, confirmation-entry, retest-entry, adverse-selection

**Fișa tehnică** (double bottom: minime 96.00 și 96.20, vârf 99.00; ținta E&E 99.00 + 3.00 × 65% = 100.95; înainte de costuri)

| Intrare | Ordin | Intrare | Stop | R pe unitate | Reward până la 100.95 | R:R | Ce plătești |
|---|---|---|---|---|---|---|---|
| Anticipare (la al doilea minim) | limit | 96.40 | 95.80 | 0.60 | 4.55 | 7.58 | fără confirmare; ~48% din double bottoms neconfirmate continuă în jos (Bulkowski) |
| Confirmare (close 99.30 peste vârf) | stop sau market | 99.35 | 98.20 (ultimul minim ascendent) | 1.15 | 1.60 | 1.39 | preț mai rău, slippage |
| Retest (limit la vârful rupt) | limit | 99.10 | 98.20 | 0.90 | 1.85 | 2.06 | se execută doar dacă prețul revine (throwback ~65% la E&E) |

#### 2.7.2 · Scaling in versus averaging down
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Plan a split entry whose total risk stays within 1R.
  2. Add to a winning position and move the stops so the worst case stays below the original 1R.
  3. Show why adding to a losing position pushes risk beyond 1R, and why the app flags it as a rule breach.
- **Concepte:** pyramiding (nou), averaging-down (nou; de aliniat cu 1.8), risk-per-trade ✓, r-multiple ✓, position-sizing ✓
- **Se sprijină pe:** 1.4 (L08, L09), 1.8 (martingale și averaging down), 2.6.4 (unde se adaugă: H2, pullback)
- **Hook:**
  - **Tip:** predict, numeric (vUSD)
  - **Prompt:** "You're long 50 LABX at 50.00, stop 48.00: 1R is 100.00. Price dips to 49.00 and you buy 50 more, same stop. How much do you lose if the stop is hit?"
  - **Răspuns:** 150.00, adică 1.5R (prețul mediu 49.50 × 100 de unități, cu stop-ul la 48.00; înainte de costuri)
- **Interacțiunea centrală:**
  1. Worked averaging down, apoi worked pyramiding (fișa), cu linia „worst case if every stop is hit”.
  2. `pyramid-planner`: tragi stop-ul comun și vezi worst case-ul live.
  3. Callout: split entry = poziția planificată, împărțită în bucăți, cu riscul total calculat pentru toată mărimea (glosarul `scaling-in` spune deja asta).
  4. Callout cu nota F: averaging down nelimitat (README §6), cu trimitere la laboratorul de ruinare din 1.8.
- **Try:**
  - **Widget:** `pyramid-planner`. Lotul 1 e blocat: 50 de unități la 50.00. Prețul curent e 54.00.
  - **Obiectiv:** "Add 25 units at 54.00, then move the shared stop so the worst case loses no more than 0.25R (25.00)."
  - **Reușită:** stop ∈ [51.00, 53.50]. Worst case = 75 × stop − 3,850 ≥ −25.00, adică stop ≥ 51.00; stop-ul trebuie să rămână ≥ 0.50 sub preț.
  - **Show me:** 51.00, cu lotul 1 +50.00 și lotul 2 −75.00 = −25.00.
- **Practică:**
  - Arena: bullish, cu adăugiri; detectorul S14 de averaging down activ.
  - Reluarea laboratorului de ruinare din 1.8, cu un plan de pyramiding pus lângă.
- **Check:**
  - q-tm-4 (numeric): worst case la pyramiding.
  - q-tm-5 (numeric): pierderea la averaging down, în R.
  - q-tm-6 (mcq): de ce prețul mediu mai bun nu înseamnă risc mai mic.
- **Dovezi:**
  - **Mechanic:** aritmetica riscului (R5 TM-03).
  - **F · Harmful:** averaging down nelimitat (martingale, R5 RF-15; README §6).
  - Pyramiding-ul cu stop-uri mutate dă o distribuție cu coadă pozitivă, dar asta e o proprietate a regulii, nu o promisiune de câștig.
- **Necesită:** S1 (adăugiri la poziție, modificarea stop-urilor), S14 (detectorul de averaging down și de stop lărgit)
- **Termeni noi de glosar:** pyramiding, averaging-down, split-entry, open-risk

**Fișa tehnică** (înainte de costuri)

**Averaging down:**
- 50 de unități la 50.00 + 50 la 49.00 = 100 de unități, cu prețul mediu 49.50;
- la stop-ul 48.00: 100 × 1.50 = 150.00 = **1.5R**;
- dacă stop-ul se și coboară „ca să aibă loc”, R-ul inițial nu mai înseamnă nimic, iar trade-ul e marcat „R violated” (R5 TM-12).

**Pyramiding** (după exemplul R5 TM-03, transpus pe LABX):

| Pas | Poziție | Stop | Worst case |
|---|---|---|---|
| Intrarea | 50 la 50.00 | 48.00 | −100.00 = −1R |
| Prețul la 54.00, se adaugă | +25 la 54.00 | ambele la 51.00 | lotul 1: +50.00; lotul 2: −75.00; total **−25.00 = −0.25R** |
| Stop comun la 50.50 | — | 50.50 | −62.50 (peste limita de 0.25R) |

**Formula worst case-ului:** Σ unitățiᵢ × (stop − intrareᵢ). Pentru un long, trebuie să rămână ≥ −1R.

#### 2.7.3 · Targets: R-multiples, structure and volatility
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Set a target three ways: a fixed R-multiple, the next structure level, or a multiple of ATR.
  2. Calculate the expectancy of each target from the share of trades whose maximum favourable move reached it.
  3. Explain why the best target depends on the market regime and must be measured, not assumed.
- **Concepte:** profit-targets (nou), reward-to-risk ✓, expectancy ✓, pattern-target (nou, 2.2.2)
- **Se sprijină pe:** 1.4 (L11), 2.2.2 (ținta scalată), 2.4.6 (ATR)
- **Hook:**
  - **Tip:** predict, alegere: "Higher expectancy" · "Lower expectancy" · "It depends"
  - **Prompt:** "You move your target from 2R to 4R. Does expectancy go up or down?"
  - **Răspuns:** "It depends": pe distribuția mișcărilor favorabile maxime (MFE), deci pe regim.
- **Interacțiunea centrală:**
  1. Trei carduri de ținte (R5 TM-05):
     - fix în R: 100.00 + 2.5 × 2.00 = 105.00, cu stop la 98.00;
     - structural: următoarea zonă de rezistență, cu un buffer sub ea;
     - pe volatilitate: k × ATR.
  2. `target-sweep` pe aceleași intrări: win rate, payoff și expectancy pentru 1R…5R, plus histograma MFE.
  3. Worked: tabelul din fișă, pe două regimuri. Cursantul calculează celula „3R în R1” = +0.32R.
  4. Callout: țintele dincolo de structura opusă evidentă sau ținta mutată mai aproape din frică (disposition effect, → 2.12).
- **Try:**
  - **Widget:** `target-sweep`, 300 de intrări (seed fix) în R1 și R2.
  - **Obiectiv:** "Find the target with the highest expectancy on the trend market, then on the range market."
  - **Reușită:** ambele alegeri = argmax din datele laboratorului.
- **Practică:**
  - `target-sweep` pe propriile trade-uri din jurnal (S15), cu eticheta „too few cases” sub 30.
  - Arena: bullish vs sideways.
- **Check:**
  - q-tm-7 (numeric): expectancy pentru o țintă, din rata de atingere.
  - q-tm-8 (mcq): ce se întâmplă cu win rate-ul când ținta se depărtează.
  - q-tm-9 (scenario): o țintă dincolo de o rezistență clară.
- **Dovezi:**
  - **Mechanic:** aritmetica expectancy-ului (R5 TM-05, TM-17).
  - **C · Mixed:** țintele de pattern scalate (Bulkowski, R2 §4.0 pct. 5).
- **Necesită:** S15 (MFE pe trade-uri), S13
- **Termeni noi de glosar:** structural-target, mfe

**Fișa tehnică: exemplu ilustrativ**

Cifrele reale vin din laborator. Simplificarea folosită aici: trade-urile care nu ating ținta se închid la −1R.

| Țintă k | R2 (range): P(MFE ≥ k) | E = P × k − (1 − P) | R1 (trend): P(MFE ≥ k) | E |
|---|---|---|---|---|
| 1R | 60% | **+0.20R** | 55% | +0.10R |
| 2R | 40% | **+0.20R** | 42% | +0.26R |
| 3R | 22% | −0.12R | 33% | **+0.32R** |
| 4R | 12% | −0.40R | 26% | +0.30R |
| 5R | 6% | −0.64R | 21% | +0.26R |

Din toate valorile se scad costurile (de exemplu ~0.05–0.20R per trade, în funcție de stop). În realitate, o parte din trade-urile care nu ating ținta se închid la timp, nu la −1R; laboratorul folosește traiectoriile reale.

#### 2.7.4 · Trailing stops
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Calculate a chandelier stop from the highest high since entry and the ATR.
  2. Compare ATR, structure, moving-average and Parabolic SAR trails by giveback, holding time and stop-outs.
  3. Keep the rule that a trailing stop only moves in the trade's favour, and never switches method mid-trade.
- **Concepte:** trailing-stop ✓, chandelier-exit (nou), stop-and-reverse-indicators (nou, 2.3.7), volatility ✓
- **Se sprijină pe:** 1.3 (trailing stop), 2.3.7, 2.4.6, 2.4.9
- **Hook:**
  - **Tip:** predict, numeric
  - **Prompt:** "Highest high since entry is 54.00, ATR is 0.80 and k = 3. Where is the chandelier stop?"
  - **Răspuns:** 51.60
- **Interacțiunea centrală:**
  1. Worked chandelier, în pași.
  2. Figură: același trade cu 4 trail-uri suprapuse (k = 2 ATR, k = 3 ATR, sub ultimul minim ascendent, close sub EMA 20), cu punctul de ieșire al fiecăruia.
  3. `trail-comparator` pe 300 de intrări.
  4. Callout cu greșelile (R5 TM-06): trail prea strâns (ieșiri din zgomot), metoda schimbată în timpul trade-ului, trailing pe fitile în piețe nelichide.
- **Try:**
  - **Widget:** `trail-comparator`, intrările din laboratorul unității, regimul R1.
  - **Obiectiv:** "Pick the trail with the lowest average giveback that still holds the average winner for at least 15 candles."
  - **Reușită:** alegerea = trail-ul care îndeplinește condiția în datele laboratorului (fixat din seed).
- **Practică:**
  - Comparatorul pe R2: acolo trail-urile largi dau înapoi aproape tot.
  - Arena: bullish, cu trailing stop (S1).
- **Check:**
  - q-tm-10 (numeric): chandelier.
  - q-tm-11 (mcq): compromisul trail strâns vs larg.
  - q-tm-12 (scenario): cineva schimbă metoda de trailing în mijlocul trade-ului.
- **Dovezi:**
  - **Mechanic:** mecanica trailing-ului.
  - **D · Unproven:** un set anume de parametri. Nu există dovezi robuste pentru chandelier-ul cu 22/3 sau pentru alt set; e o unealtă de risc, nu un predictor.
  - Trailing-ul se potrivește strategiilor de trend, pentru că păstrează coada pozitivă.
  - Surse: R2 §5.22; R5 TM-06.
- **Necesită:** S1 (trailing stop după regulă), S13, S15
- **Termeni noi de glosar:** chandelier-exit, giveback

**Fișa tehnică**

| Trail | Regula (long) | Exemplu |
|---|---|---|
| Chandelier (LeBeau, n = 22, k = 3) | cel mai mare maxim din n lumânări − k × ATR | 54.00 − 3 × 0.80 = **51.60** |
| ATR simplu | close − k × ATR, urcă doar | — |
| Structură | sub ultimul minim ascendent confirmat (N = 3) | — |
| Medie mobilă | ieșire la close sub EMA 20 | — |
| PSAR / SuperTrend | linia indicatorului (2.3.7), doar ca stop, fără inversare | — |

**Regula comună:** stop-ul urcă sau stă pe loc; nu coboară niciodată (R5 TM-12).

#### 2.7.5 · Breakeven stops
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Move a stop to breakeven only by a written rule, and name the cost of putting it exactly at the entry price.
  2. Count how many winners a breakeven rule kills and how many losers it saves.
  3. Calculate the expectancy of a set of trades with and without the rule.
- **Concepte:** breakeven-stop (nou), expectancy ✓, loss-aversion ✓
- **Se sprijină pe:** 2.7.4, 1.4 (L11)
- **Hook:**
  - **Tip:** predict, alegere: "True" · "False"
  - **Prompt:** "Moving your stop to breakeven at +1R always improves your results. True or false?"
  - **Răspuns:** "False". Depinde de câte trade-uri câștigătoare revin la intrare după +1R (R5 TM-07).
- **Interacțiunea centrală:**
  1. Worked: 10 trade-uri cu și fără breakeven (fișa). Cursantul calculează expectancy-ul nou, −0.1R.
  2. `be-ab` pe un set de 30 de trade-uri: „winners killed” vs „losers saved”.
  3. Callout cu greșelile:
     - breakeven din disconfort, nu din regulă;
     - breakeven fix la prețul de intrare, unde spread-ul și zgomotul îl ating;
     - o poziție la breakeven tratată ca risc zero, deși gap-ul rămâne (1.3, L16 B6).
- **Try:**
  - **Widget:** `be-ab`, setul fix de 30 de trade-uri, sau ultimele 30 de trade-uri ale cursantului, dacă există.
  - **Obiectiv:** "Run the set with and without breakeven at +1R. Report the winners killed, the losers saved and both expectancies."
  - **Reușită:** cele patru valori corespund laboratorului.
- **Practică:**
  - A/B pe propriile trade-uri (S15).
  - Arena: orice scenariu cu regula BE activată în plan.
- **Check:**
  - q-tm-13 (numeric): expectancy cu BE.
  - q-tm-14 (mcq): de ce breakeven-ul fix la intrare e atins des.
  - q-tm-15 (scenario): „Mut stop-ul la intrare pentru că nu mai suport să pierd”. Ce bias e?
- **Dovezi:**
  - **Mechanic:** aritmetica.
  - Efectul depinde de distribuția MAE după MFE; adesea *scade* expectancy-ul, pentru că oprește trade-uri valide în zgomot (R5 TM-07).
- **Necesită:** S15
- **Termeni noi de glosar:** breakeven-stop, scratch-trade

**Fișa tehnică: exemplul cu 10 trade-uri**

| | Fără BE | Cu BE la +1R |
|---|---|---|
| Câștigători (+2R) | 4 | 2 (ceilalți 2 au revenit la intrare după +1R → 0R, „scratch”) |
| Pierzători (−1R) | 6 | 5 (unul atinsese +1R înainte să cadă → 0R) |
| Total | 8 − 6 = +2R | 4 + 0 + 0 − 5 = −1R |
| Expectancy | **+0.20R** | **−0.10R** |

Pe alt set, rezultatul poate fi invers. De aceea regula se testează pe datele proprii.

#### 2.7.6 · Partial exits
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Calculate the blended R of a trade closed in parts.
  2. Compare an all-in exit with a half-off-at-1R plan in expectancy and in the spread of outcomes.
  3. Explain why partial exits raise the win rate and can quietly cap the best trades.
- **Concepte:** scaling-out (nou), r-multiple ✓, expectancy ✓
- **Se sprijină pe:** 2.7.3, 2.7.4, 2.7.5
- **Hook:**
  - **Tip:** predict, numeric (R)
  - **Prompt:** "You close half at +1R. The other half is stopped at breakeven. What is the trade's total in R?"
  - **Răspuns:** +0.5R
- **Interacțiunea centrală:**
  1. `Formula`: R mixt = Σ fracțieᵢ × Rᵢ, pe cele trei rezultate (fișa).
  2. Distribuția celor două planuri, cu frecvențe ilustrative: media și deviația standard. Cursantul calculează media planului cu parțiale, +0.05R.
  3. Callout: parțialele ajută psihologic și contează pentru regulile de prop (trailing drawdown, 2.11), dar pot tăia coada din dreapta a unui sistem cu skew pozitiv.
  4. Monte Carlo pe trade-urile cursantului: expectancy, SD și max drawdown pentru fiecare plan.
- **Try:**
  - **Widget:** `exit-planner`, planul: jumătate la +1R, restul cu trailing.
  - **Obiectiv:** "Fill in the blended R for the three outcomes: runner hits +3R, runner stopped at breakeven, stopped out before +1R."
  - **Reușită:** +2.0R, +0.5R, −1.0R (± 0.01).
- **Practică:**
  - Monte Carlo pe propriul jurnal (S15).
  - Arena: bullish, cu ieșiri parțiale (S1).
- **Check:**
  - q-tm-16 (numeric): R mixt.
  - q-tm-17 (mcq): ce face parțiala cu win rate-ul și cu varianța.
  - q-tm-18 (scenario): un sistem de trend cu câștiguri rare și mari. Parțialele devreme ajută sau strică?
- **Dovezi:**
  - **Mechanic:** aritmetica.
  - Parțialele cresc win rate-ul și scad varianța; efectul asupra expectancy-ului poate merge în ambele sensuri și depinde de distribuția MFE (R5 TM-08).
- **Necesită:** S1 (ieșiri parțiale), S15
- **Termeni noi de glosar:** blended-r, runner

**Fișa tehnică**

| Rezultat | Frecvență (ilustrativă) | All-in (stop la BE după +1R) | Jumătate la +1R, restul cu trailing |
|---|---|---|---|
| Runner-ul atinge +3R | 20% | +3.0R | 0.5 × 1 + 0.5 × 3 = **+2.0R** |
| Runner-ul e oprit la BE | 30% | 0R | 0.5 × 1 + 0 = **+0.5R** |
| Oprit înainte de +1R | 50% | −1.0R | **−1.0R** |
| Media | | **+0.10R** | **+0.05R** |
| Deviația standard | | 1.51R | 1.17R |
| Trade-uri cu rezultat pozitiv | | 20% | 50% |

Pe aceste frecvențe, parțialele aduc mai multe trade-uri pe plus și o variație mai mică, dar o medie mai mică. Pe altele, concluzia se poate schimba.

#### 2.7.7 · Time stops and planned exits
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Write a time stop: exit if the trade has not reached a set progress within N bars.
  2. Separate planned exits on an opposing signal from fear exits by tagging the reason for every exit.
  3. Keep stop discipline: a stop moves only toward less risk, never wider.
- **Concepte:** time-stop (nou), exit-rules (nou), stop-loss-order ✓, loss-aversion ✓, trading-plan ✓
- **Se sprijină pe:** 1.6 (planul și jurnalul), 1.7 (reguli if-then), 2.7.3–2.7.6
- **Hook:**
  - **Tip:** predict, alegere: "Holding all six" · "Exiting all six at bar 10"
  - **Prompt:** "Six trades are going nowhere after 10 bars. Which costs less in total: holding all six to their stops or targets, or exiting all six now at about −0.2R each?"
  - **Răspuns:** "Exiting all six at bar 10": −1.2R față de −3R în exemplu. Costul e că ratezi singurul câștigător, +2R.
- **Interacțiunea centrală:**
  1. Worked: cele 6 trade-uri „moarte” (fișa).
  2. Scatter „bars in trade vs final R” din jurnal; `time-stop-line` se trage, iar rezultatele se recalculează (R5 TM-09).
  3. Etichete de motiv la fiecare ieșire discreționară, din playbook: "Structure broke", "Opposite signal", "Time stop", "Event ahead". O ieșire fără etichetă contează ca abatere de la regulă (R5 TM-10).
  4. Callout „Never widen the stop” (R5 TM-12): aplicația permite lărgirea, dar marchează trade-ul „R violated” și recalculează R-ul față de R-ul inițial.
  5. Regula de re-intrare (R5 TM-15): o re-intrare în X minute de la o pierdere, sau la o mărime mai mare, e semnalată (legătura cu revenge trading, 1.7).
- **Try:**
  - **Widget:** `time-stop-line`, un eșantion fix de 40 de trade-uri (seed).
  - **Obiectiv:** "Drag the time-stop line to the bar count that gives the best expectancy on this sample."
  - **Reușită:** linia la argmax din datele eșantionului (± 1 bară), iar cursantul alege avertismentul corect: "Re-test on new trades before adopting it".
- **Practică:**
  - Jurnalul propriu (S15).
  - Detectorii S14 pentru stop lărgit, ieșire fără motiv și re-intrare rapidă.
  - Arena: sideways (trade-urile „moarte” sunt frecvente).
- **Check:**
  - q-tm-19 (numeric): totalul cu și fără time stop.
  - q-tm-20 (mcq): ce face o ieșire „planificată” (motivul e scris dinainte).
  - q-tm-21 (scenario): stop-ul mutat mai departe „ca să aibă loc”.
- **Dovezi:**
  - **Mechanic:** regulile și aritmetica.
  - Beneficiul unui time stop depinde de ritmul setup-ului; o linie optimizată pe puține trade-uri e overfitting (R5 TM-09, TM-10, TM-12, TM-15).
- **Necesită:** S15, S14 (stop lărgit, ieșire fără etichetă, re-intrare rapidă)
- **Termeni noi de glosar:** time-stop, exit-reason

**Fișa tehnică: cele 6 trade-uri „moarte”** (MFE < 0.5R după 10 bare)

| | Ținute până la final | Cu time stop la bara 10 |
|---|---|---|
| Rezultate | 1 × (+2R), 5 × (−1R) | 6 ieșiri la ~−0.2R fiecare |
| Total | **−3.0R** | **−1.2R** |
| Ce câștigi și ce pierzi | — | +1.8R economisiți, plus capital și atenție eliberate; câștigătorul de +2R ratat |

**Regula scrisă:** "If MFE < 0.5R after 10 bars, exit at market" (R5 TM-09). N se alege după ritmul setup-ului și se re-testează pe trade-uri noi.

#### 2.7.8 · MAE and MFE: learning from your own excursions
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Calculate a trade's maximum adverse and maximum favourable excursion in R.
  2. Use an MAE scatter to test a tighter stop, and count the winners it would have cut.
  3. Calculate giveback and exit efficiency, and read them by setup.
- **Concepte:** mae-mfe (nou), exit-efficiency (nou), journaling ✓, r-multiple ✓
- **Se sprijină pe:** 2.7.1–2.7.7, 1.6 (jurnalul, L17)
- **Hook:**
  - **Tip:** predict, slider 0–100%
  - **Prompt:** "Your trade went 2.50R in your favour at best, and you closed it at +1.00R. What share of the best move did you keep?"
  - **Răspuns:** 40%
- **Interacțiunea centrală:**
  1. Worked MAE, MFE, giveback și eficiența (fișa), cu input pe ultimul pas.
  2. `mae-scatter` (R5 TM-16, sim): MAE pe axa x, R-ul final pe axa y, câștigătorii și pierzătorii marcați prin formă și prin culorile rezervate rezultatelor (PLAN_LEARN §8.2). Linia de stop se trage, iar expectancy-ul, win rate-ul și „winners lost” se recalculează.
  3. Histograma MFE cu linia țintei (R5 TM-17).
  4. Callout cu limitele:
     - eșantioanele mici înseamnă overfitting;
     - setup-urile cu volatilitate diferită nu se amestecă;
     - un stop mai strâns schimbă mărimea și deci costul în R;
     - eficiența de 100% e imposibilă fără hindsight.
  5. Preview: edge ratio = MFE mediu ÷ MAE mediu, comparat cu intrările aleatoare, în jur de 1.0 (R5 TM-18; Nivelul 3).
- **Try:**
  - **Widget:** `mae-scatter`, eșantionul fix de 20 de trade-uri (fișa).
  - **Obiectiv:** "Drag the stop line to 0.7R. Read how many winners you'd lose and the new expectancy."
  - **Reușită:** "Winners lost: 1 of 8" și expectancy +0.245R (± 0.005), în unitățile R-ului inițial.
- **Practică:**
  - `mae-scatter` și histograma MFE pe propriul jurnal (≥ 30 de trade-uri; altfel, eticheta „too few cases”).
  - KPI săptămânal: eficiența medie a ieșirilor pe setup (pregătește recenzia din 2.13).
- **Check:**
  - q-tm-22 (numeric): MAE în R.
  - q-tm-23 (numeric): eficiența ieșirii.
  - q-tm-24 (scenario): cineva strânge stop-ul pe baza a 12 trade-uri. Ce lipsește?
- **Dovezi:**
  - **Mechanic:** definițiile.
  - **C · Mixed:** metoda Sweeney (stop-uri din distribuția MAE). Funcționează doar dacă comportamentul pieței e consecvent, și trebuie re-testată out-of-sample (R5 TM-16–TM-18).
- **Necesită:** S15 (MAE, MFE, scatter, histogramă, KPI)
- **Termeni noi de glosar:** mae, exit-efficiency, edge-ratio

**Fișa tehnică**

**Formulele** (long):
- MAE_R = (intrarea − cel mai mic minim din timpul trade-ului) ÷ (intrarea − stop-ul);
- MFE_R = (cel mai mare maxim − intrarea) ÷ (intrarea − stop-ul);
- giveback = MFE − rezultatul realizat;
- eficiența = rezultatul realizat ÷ MFE.

**Exemplu:**
- intrarea 50.00, stop-ul 49.00 (R = 1.00 pe unitate);
- minimul 49.40 → MAE = **0.60R**;
- maximul 52.50 → MFE = **2.50R**;
- ieșirea la 51.00 → **+1.00R**; giveback **1.50R**; eficiența **40%**.

**Eșantionul pentru Try** (20 de trade-uri, construit ca în R5 TM-16):
- 8 câștigători, fiecare cu +2R, cu MAE: 0.10, 0.20, 0.25, 0.30, 0.40, 0.50, 0.60, 0.80;
- 12 pierzători, fiecare cu −1R (MAE = 1.00).

| Stop | Câștigători păstrați | Pierderea medie | Expectancy (în R-ul inițial) |
|---|---|---|---|
| 1.0R (inițial) | 8 / 8 | 1.00R | (16 − 12) ÷ 20 = **+0.20R** |
| 0.7R | 7 / 8 (cel cu MAE 0.80 e oprit) | 0.70R (−30%) | (14 − 13 × 0.7) ÷ 20 = **+0.245R** |

Avertismente: 20 de trade-uri nu ajung; costurile cresc în R când stop-ul se strânge (mărimea crește de 1 ÷ 0.7 ≈ 1.43 ori la același risc); regula se re-testează pe trade-uri noi.

---

## Decizii și întrebări deschise

1. **2.2 are 10 lecții, nu 9.** Lecția nouă e 2.2.1, despre trendline-uri și canale (motivul e în introducere). De actualizat în README §3:
   - unitatea 2.2: 10 lecții;
   - Nivelul 2: 119;
   - totalul: ≈ 341.
2. **Id-uri de aliniat cu celelalte fișiere ale hărții:**
   - `base-rate` (glosar) poate fi adăugat deja de Nivelul 0 (harta Nivelului 0 folosește conceptul existent `base-rates`);
   - `averaging-down` (concept și glosar) poate fi creat de 1.8; la data scrierii, harta Nivelului 1 nu are încă un id pentru el;
   - harta Nivelului 1 introduce `multi-timeframe-analysis` (1.5) și `volume` (1.2.4). 2.6.8 îl reia pe primul și adaugă `timeframe-alignment` (regula de ierarhie); 2.5.1 îl reia pe al doilea. Dacă cele două concepte din 2.6.8 se suprapun prea mult, `timeframe-alignment` se poate contopi în `multi-timeframe-analysis`;
   - `false-breakout` există deja în `concepts.ts`, dar nu în glosar. Aici se adaugă `failed-breakout` în glosar, cu `aka: ["False breakout"]`.
   - Dacă un id există deja când se integrează, se păstrează cel existent și se șterge rândul de aici.
3. **Întrebările mutate:** q-ta-12 și q-ta-13 (ATR, true range) trec de la L16 la 2.4.6. L16 păstrează q-rm-8, q-rm-9 și q-rm-10. Câmpul `lesson` din banca de întrebări trebuie actualizat.
4. **L16 după 2.4.6:** propunerea e ca B3 să devină o legătură de o propoziție, iar hotspot-ul B4 să rămână ca reluare. De decis la scrierea unității.
5. **Proprietățile generatorului, de decis și de declarat în lecții (S7):**
   - legătura volum–continuare în modul realistic (2.5.1);
   - agenții care pun ordine la numerele rotunde, respectiv agenții care urmăresc pivoții (2.5.5, 2.5.7, Level lab);
   - inventarul agenților „prinși” (2.6.6).
   - Regula de bază: fără calibrare după ratele Bulkowski (introducere, punctul 5).
6. **Convențiile aplicației, de calibrat pe seed-uri înainte de publicare:**
   - pragurile în ATR care înlocuiesc procentele Bulkowski pentru LABX 1H: vârfuri la 0.5 ATR, vale de 3 ATR, catarg de 3 ATR, eșec sub 1 ATR la busted;
   - pragurile pentru doji-urile long-legged și dragonfly;
   - checklist-urile din 2.6.2 și 2.6.7;
   - suprapunerea barelor.
   - Toate se afișează ca parametri.
7. **Condiții de reușită care depind de date** (se fixează din seed și intră în teste, ca tabelul din L07):
   - setul de filtre din 2.2.2;
   - intervalul de perioade EMA din 2.3.3 (dacă e gol, pragul de lag devine 7);
   - pragul ADX din 2.3.6;
   - argmax-urile din 2.7.1, 2.7.3, 2.7.4 și 2.7.7;
   - numărul de doji din 2.1.1.
8. **Afirmații din R2 și R3 marcate „de verificat”, folosite aici** (README §12):
   - regula Lo-Mamaysky-Wang pentru H&S (din memorie);
   - pivotul Woodie;
   - Triple Screen (Elder);
   - edge-urile RSI(2);
   - inversarea pe termen scurt (1 săptămână – 1 lună);
   - breakout-urile Turtle;
   - Andrews' pitchfork;
   - cifra de 80% a lui Brooks ([HEUR][BK]);
   - preprintul nerevizuit Mahadzva 2026.
9. **Durata lecțiilor:** 11 lecții au 8 minute (PLAN_LEARN §4.1 spune 5–7):
   - 2.1.3, 2.1.5, 2.1.9;
   - 2.2.2, 2.2.4, 2.2.10;
   - 2.3.6;
   - 2.4.2, 2.4.5;
   - 2.5.8;
   - 2.7.8.
   De decis: fie se acceptă 8 minute la Nivelul 2, fie fișa tehnică trece parțial în Library.
10. **Mărimea glosarului:** 193 de termeni noi. Propunere: termenii folosiți doar pe foaia de referință din 2.1.8 (de exemplu matching-low, tasuki-gap) primesc un flag `libraryOnly`, ca să nu apară în recapitularea spațiată.
11. **Capabilități noi cerute, fără un cod în README §8:**
    - detectorii S14 pentru timeframe shopping, ieșirea fără etichetă și re-intrarea rapidă;
    - modul „locked” al instrumentelor de desen (S3);
    - inventarul de agenți (S7).
    Propunere: se adaugă la S14, S3 și S7.

---

## Registru de concepte noi

80 de concepte. Id-urile urmează stilul din `concepts.ts`. „Unitatea” = unde se introduce conceptul.

| # | id | Name (EN) | Definition (EN) | Unitatea |
|---|---|---|---|---|
| 1 | candle-vocabulary | Candle vocabulary | Classifying a candle's body and shadows against recent candles as long, short, doji, marubozu or spinning top. | 2.1 |
| 2 | rejection-candles | Long-shadow candles | Hammers, shooting stars and their twins: candles whose long shadow marks a price that was rejected. | 2.1 |
| 3 | pattern-context | Pattern context | The checks that decide whether a candle pattern counts: something to reverse, a meaningful location, size and volume. | 2.1 |
| 4 | pattern-confirmation | Pattern confirmation | Waiting for a close beyond the pattern before acting, which raises the hit rate but worsens the entry. | 2.1 |
| 5 | engulfing-pattern | Engulfing pattern | A two-candle pattern in which the second real body fully covers the first, opposite-coloured body. | 2.1 |
| 6 | harami-pattern | Harami | A two-candle pattern in which a small real body sits inside the previous, larger body. | 2.1 |
| 7 | penetration-patterns | Penetration patterns | Two-candle patterns named by how deep the second candle closes into the first body, from on-neck to piercing. | 2.1 |
| 8 | star-patterns | Star patterns | Three-candle turns with a small, gapped middle candle: morning and evening stars, doji stars, abandoned babies. | 2.1 |
| 9 | confirmed-candle-patterns | Confirmed candle patterns | Multi-candle patterns whose last candle already confirms the move, such as three inside up or three white soldiers. | 2.1 |
| 10 | pattern-name-vs-evidence | Names versus evidence | Judging any pattern by its rule, sample size, base rate, result after costs and scope, not by its name. | 2.1 |
| 11 | alternative-chart-types | Alternative chart types | Heikin-Ashi, Renko and point & figure: ways of drawing price whose plotted values are not traded prices. | 2.1 |
| 12 | trendlines-and-channels | Trendlines and channels | Lines through swing points that describe a trend; a break is a warning to confirm, not a signal. | 2.2 |
| 13 | chart-pattern-anatomy | Chart pattern anatomy | The parts every chart pattern shares: prior trend, boundaries, volume, breakout, target, invalidation and aftermath. | 2.2 |
| 14 | breakout-confirmation-filters | Breakout filters | Rules that confirm a breakout, such as a close beyond the level by part of the ATR, trading entry price for fewer false signals. | 2.2 |
| 15 | pattern-target | Scaled pattern target | A target projected from a pattern's height and scaled by how often the full height was reached in past data. | 2.2 |
| 16 | double-tops-and-bottoms | Double tops and bottoms | Two similar extremes with a valley or peak between them, confirmed only by a close beyond that level. | 2.2 |
| 17 | anticipation-vs-confirmation | Anticipation versus confirmation | Entering before a signal completes for a better price, or after it for a higher hit rate, compared by expectancy. | 2.2 |
| 18 | head-and-shoulders | Head and shoulders | Three peaks with the middle one highest and a neckline through the lows between them, or the inverse at bottoms. | 2.2 |
| 19 | rectangles-and-triples | Rectangles and triple tops/bottoms | Horizontal ranges with repeated tests of both edges, which remain ranges until a confirmed breakout. | 2.2 |
| 20 | triangles | Triangles | Converging boundaries (ascending, descending, symmetrical) whose breakout bias comes from data, not from the shape. | 2.2 |
| 21 | flags-and-pennants | Flags and pennants | Short pauses after a steep move whose classic "half-mast" target is reached less than half the time. | 2.2 |
| 22 | measured-move | Measured move | A projection that a second leg will roughly repeat the first; in the data it is usually shorter. | 2.2 |
| 23 | wedges-and-broadening | Wedges and broadening formations | Converging sloped lines (wedges) or diverging lines (megaphones, diamonds), with weak and mixed statistics. | 2.2 |
| 24 | rounding-and-v-patterns | Rounding and V patterns | Slow bowl-shaped turns and cups that become visible only late, and sharp V turns that can't be seen in real time. | 2.2 |
| 25 | busted-patterns | Busted patterns | Patterns that break out, fail, and then break through the opposite boundary. | 2.2 |
| 26 | dow-theory | Dow Theory | The founding trend framework: three degrees of trend, and the peak-trough rule for when a trend has changed. | 2.3 |
| 27 | trend-definitions | Trend definitions | Working definitions of trend (structure, average slope, average stack, ADX) that can disagree on the same chart. | 2.3 |
| 28 | weighted-moving-averages | EMA and WMA | Moving averages that weight recent closes more: faster than an SMA, still lagging, and noisier. | 2.3 |
| 29 | indicator-literacy | Indicator literacy | Every indicator re-weights past prices; its settings are conventions, and less lag always means more noise. | 2.3 |
| 30 | ma-crossover | Moving-average crossovers | Signals from price or a fast average crossing a slower one: late in trends and costly in ranges. | 2.3 |
| 31 | macd | MACD | The difference between the 12- and 26-period EMAs, with a signal line and histogram: a crossover in disguise. | 2.3 |
| 32 | adx-dmi | ADX and DMI | Wilder's directional indicators: +DI and −DI give direction, ADX measures trend strength without direction. | 2.3 |
| 33 | stop-and-reverse-indicators | Parabolic SAR and SuperTrend | Trailing lines that flip with the trend; useful as stops, prone to whipsaws as always-in systems. | 2.3 |
| 34 | ichimoku-basics | Ichimoku basics | Five lines built mostly from high-low midpoints, two of them shifted in time in ways that invite look-ahead errors. | 2.3 |
| 35 | look-ahead-bias | Look-ahead bias | Using information in a test that was not available at the moment the decision would have been made. | 2.3 |
| 36 | oscillator | Oscillator | An indicator that swings around a centre line or between fixed bounds, such as 0 and 100. | 2.4 |
| 37 | momentum-roc | Momentum and rate of change | Price change over n periods; the technical idea with the strongest evidence, at 3–12-month horizons. | 2.4 |
| 38 | rsi | Relative Strength Index | A 0–100 ratio of average gains to average losses, smoothed with Wilder's method. | 2.4 |
| 39 | stochastic-family | Stochastic, Williams %R and CCI | Oscillators that place the close within its recent range or against its average; largely the same information. | 2.4 |
| 40 | indicator-redundancy | Indicator redundancy | Indicators built from the same inputs move together, so their agreement is not independent confirmation. | 2.4 |
| 41 | overbought-oversold | Overbought and oversold | Readings that price has moved far relative to its recent range, not that it must reverse. | 2.4 |
| 42 | divergence | Divergence | Price and an oscillator disagree at matching swings; regular divergence suggests reversal, hidden suggests continuation; weak evidence. | 2.4 |
| 43 | historical-volatility | Historical volatility | The standard deviation of past returns, often annualised, used to compare how much prices move. | 2.4 |
| 44 | volatility-clustering | Volatility clustering | Busy periods tend to follow busy ones and quiet ones follow quiet ones, so recent volatility forecasts near-term size. | 2.4 |
| 45 | bollinger-bands | Bollinger Bands | A 20-period average with bands two standard deviations away; touching a band is not a signal. | 2.4 |
| 46 | volatility-squeeze | Volatility squeeze | Unusually narrow bands that tend to precede a larger move of unknown direction. | 2.4 |
| 47 | volatility-channels | Keltner and Donchian channels | Channels built from ATR around an average (Keltner) or from the highs and lows of recent candles (Donchian). | 2.4 |
| 48 | volume-analysis | Volume analysis | Reading traded volume as participation and possible confirmation, never as direction on its own. | 2.5 |
| 49 | relative-volume | Relative volume | A candle's volume divided by its recent average, flagging unusual activity. | 2.5 |
| 50 | cumulative-volume-indicators | OBV and accumulation/distribution | Running totals of volume signed by price movement; their direction is read, never their level. | 2.5 |
| 51 | vwap | VWAP | The volume-weighted average price since the session open, used above all as an execution benchmark. | 2.5 |
| 52 | anchored-vwap | Anchored VWAP | A VWAP started from a chosen event, showing the average price paid since then. | 2.5 |
| 53 | volume-profile | Volume profile | The volume traded at each price over a window, with its point of control and value area. | 2.5 |
| 54 | pivot-points | Pivot points | Levels calculated from the previous session's high, low and close, in several competing formulas. | 2.5 |
| 55 | gap-types | Gap types | Common, breakaway, runaway and exhaustion gaps and island reversals, classified by where they occur in a move. | 2.5 |
| 56 | supply-demand-zones | Supply and demand zones | Zones drawn at the base of a strong departure: a popular method without robust evidence. | 2.5 |
| 57 | fibonacci-levels | Fibonacci levels | Retracement and extension levels at fixed ratios of a swing, with no evidence that the ratios are special. | 2.5 |
| 58 | confluence | Confluence | Several independent reasons pointing to one price or direction; easy to fake with correlated or numerous lines. | 2.5 |
| 59 | bar-reading | Bar reading | Classifying bars as trend bars or doji bars and reading their overlap as trend or range. | 2.6 |
| 60 | signal-and-entry-bars | Signal and entry bars | The bar that sets a stop-entry price and the bar in which it fills, judged with a checklist. | 2.6 |
| 61 | traders-equation | Trader's equation | Win probability times reward must exceed loss probability times risk, after costs. | 2.6 |
| 62 | inside-outside-bars | Inside, outside and narrow-range bars | Bars contained in, or extending beyond, the previous bar's range, and the narrowest bar of recent bars. | 2.6 |
| 63 | two-legged-pullback | Two-legged pullback | A pullback that runs in two legs, often ending with a second attempt to resume the trend. | 2.6 |
| 64 | bar-counting | Bar counting (H1/H2) | Counting attempts to resume a trend during a pullback: H1 and H2 in bull trends, L1 and L2 in bear trends. | 2.6 |
| 65 | price-channels | Tight, broad and micro channels | Bar-by-bar channel types that grade a trend's strength by pullback size and by the bars' lows or highs. | 2.6 |
| 66 | three-push-wedge | Three-push wedge | Three pushes in one direction with fading momentum, read as a possible reversal or as a wedge flag. | 2.6 |
| 67 | trapped-traders | Trapped traders | Traders caught by a failed move whose exits can fuel the move against them. | 2.6 |
| 68 | momentum-vs-exhaustion | Momentum versus exhaustion | Reading whether a move is strengthening or tiring from bar size, overlap, pullbacks and climax bars. | 2.6 |
| 69 | timeframe-alignment | Timeframe alignment | Using a higher, a trading and a lower timeframe under a hierarchy written before the trade. | 2.6 |
| 70 | entry-techniques | Entry techniques | Anticipation, confirmation and retest entries and their order types, compared in R and expectancy. | 2.7 |
| 71 | pyramiding | Pyramiding | Adding to a winning position while moving stops so total open risk stays within the original R. | 2.7 |
| 72 | averaging-down | Averaging down | Adding to a losing position, which raises risk beyond the plan and is flagged as a rule breach. | 2.7 |
| 73 | profit-targets | Profit targets | Exit levels set by R-multiple, structure or volatility, whose best choice depends on the regime. | 2.7 |
| 74 | chandelier-exit | Chandelier exit | A trailing stop at the highest high since entry minus a multiple of ATR. | 2.7 |
| 75 | breakeven-stop | Breakeven stop | Moving the stop to the entry price after a set gain; it can lower expectancy. | 2.7 |
| 76 | scaling-out | Scaling out | Closing a position in parts, which raises the win rate and lowers variance, with an uncertain effect on expectancy. | 2.7 |
| 77 | time-stop | Time stop | Exiting a trade that has not made set progress within a set number of bars. | 2.7 |
| 78 | exit-rules | Planned exits | Exits decided by written rules and tagged with a reason, as opposed to exits driven by fear. | 2.7 |
| 79 | mae-mfe | MAE and MFE | The worst and the best unrealised result during a trade, in R, used to review stops and targets. | 2.7 |
| 80 | exit-efficiency | Exit efficiency | The share of a trade's best unrealised gain that was actually kept at the exit. | 2.7 |

---

## Termeni noi de glosar

193 de termeni. Definițiile au cel mult 20 de cuvinte, în engleză simplă, ca în câmpul `plain` din `glossary.ts`. „Lecția” = prima lecție care leagă termenul (câmpul `lesson`).

| id | Term | Definition (plain English) | Lecția |
|---|---|---|---|
| marubozu | Marubozu | A candle with a long body and almost no shadows: one side controlled the whole period. | 2.1.1 |
| spinning-top | Spinning top | A small-bodied candle with shadows longer than the body on both sides. | 2.1.1 |
| high-wave-candle | High-wave candle | A small-bodied candle with shadows more than twice the body on both sides. | 2.1.1 |
| doji | Doji | A candle whose open and close are almost equal, so it has almost no body. | 2.1.1 |
| long-legged-doji | Long-legged doji | A doji with long shadows on both sides. | 2.1.1 |
| dragonfly-doji | Dragonfly doji | A doji that opens and closes at its high, with a long lower shadow. | 2.1.1 |
| gravestone-doji | Gravestone doji | A doji that opens and closes at its low, with a long upper shadow. | 2.1.1 |
| hammer | Hammer | After a decline, a small body near the top of the candle with a long lower shadow. | 2.1.2 |
| hanging-man | Hanging man | The hammer shape after a rise. In tested data it more often came before further rises. | 2.1.2 |
| inverted-hammer | Inverted hammer | After a decline, a small body near the low with a long upper shadow. | 2.1.2 |
| shooting-star | Shooting star | After a rise, a small body near the low with a long upper shadow. | 2.1.2 |
| belt-hold | Belt hold | A long candle that opens at one extreme and closes near the other. | 2.1.2 |
| pin-bar | Pin bar | Price-action name for a candle with one long rejecting shadow, like a hammer or shooting star. | 2.1.2 |
| takuri-line | Takuri line | A hammer whose lower shadow is at least three times its body. | 2.1.2 |
| confirmation | Confirmation | Waiting for a close beyond a pattern before acting on it. | 2.1.3 |
| base-rate | Base rate | How often an outcome happens across all similar cases, before you look at the current one. | 2.1.3 |
| engulfing-pattern | Engulfing pattern | Two candles where the second body fully covers the first, opposite-coloured body. | 2.1.4 |
| harami | Harami | Two candles where a small body sits inside the previous, larger body. | 2.1.4 |
| harami-cross | Harami cross | A harami whose second candle is a doji. | 2.1.4 |
| piercing-line | Piercing line | After a long down candle, an up candle that opens lower and closes above the first body's midpoint. | 2.1.5 |
| dark-cloud-cover | Dark cloud cover | After a long up candle, a down candle that opens higher and closes below the first body's midpoint. | 2.1.5 |
| on-neck-line | On-neck line | An up candle after a long down candle that closes at about the down candle's low. | 2.1.5 |
| in-neck-line | In-neck line | An up candle after a long down candle that closes just inside its body. | 2.1.5 |
| thrusting-line | Thrusting line | An up candle that closes into the previous down candle's body, but below its midpoint. | 2.1.5 |
| tweezers | Tweezers | Two neighbouring candles with matching highs (tweezer top) or matching lows (tweezer bottom). | 2.1.5 |
| kicker | Kicker | Two opposite-coloured candles with no shadows, separated by a gap. | 2.1.5 |
| morning-star | Morning star | At a low: a long down candle, a small gapped candle, then a strong up candle. | 2.1.6 |
| evening-star | Evening star | At a high: a long up candle, a small gapped candle, then a strong down candle. | 2.1.6 |
| doji-star | Doji star | A long candle followed by a doji that gaps away from it. | 2.1.6 |
| abandoned-baby | Abandoned baby | A star pattern whose middle doji gaps beyond the shadows of both neighbouring candles. | 2.1.6 |
| tri-star | Tri-star | Three doji in a row, the middle one gapping above or below the other two. | 2.1.6 |
| window | Window | The candlestick name for a gap: a price range with no trading between two candles. | 2.1.6 |
| three-white-soldiers | Three white soldiers | Three long up candles in a row, each opening inside the previous body and closing near its high. | 2.1.7 |
| three-black-crows | Three black crows | Three long down candles in a row, each closing near its low. | 2.1.7 |
| three-inside-up-down | Three inside up / down | A harami followed by a candle that confirms the turn by closing beyond the pattern. | 2.1.7 |
| three-outside-up-down | Three outside up / down | An engulfing pattern followed by a candle that closes further in the new direction. | 2.1.7 |
| advance-block | Advance block | Three rising candles with shrinking bodies and growing upper shadows: a rise losing strength. | 2.1.7 |
| three-line-strike | Three-line strike | Three candles in one direction, then one long candle that wipes out all three. | 2.1.8 |
| rising-three-methods | Rising three methods | A five-candle pause: a long up candle, three small ones inside its range, another long up candle. | 2.1.8 |
| tasuki-gap | Tasuki gap | A gap in a trend that the next, opposite candle moves into but does not close. | 2.1.8 |
| matching-low | Matching low | Two down candles that close at the same price during a fall. | 2.1.8 |
| heikin-ashi | Heikin-Ashi | Smoothed candles built from averages of real prices; their values are not prices anyone traded. | 2.1.9 |
| renko | Renko | A chart of equal bricks, drawn only when price moves a full brick; time is ignored. | 2.1.9 |
| point-and-figure | Point & figure | A chart of X columns for rises and O columns for falls, built from a box size and reversal. | 2.1.9 |
| box-size | Box size | The price step that one brick or box stands for on a Renko or point & figure chart. | 2.1.9 |
| reversal-amount | Reversal amount | How many boxes price must move back before a point & figure chart starts a new column. | 2.1.9 |
| trendline | Trendline | A straight line through rising swing lows or through falling swing highs. | 2.2.1 |
| channel | Channel | A trendline plus a parallel line through the opposite swings, containing price between them. | 2.2.1 |
| throwback | Throwback | A return to the broken level soon after a breakout. | 2.2.2 |
| breakout-filter | Breakout filter | A rule that confirms a breakout, such as a close beyond the level by part of the ATR. | 2.2.2 |
| pattern-height | Pattern height | The distance from a pattern's extreme to its breakout line, used to project a target. | 2.2.2 |
| double-top | Double top | Two similar peaks with a valley between, confirmed only by a close below that valley. | 2.2.3 |
| double-bottom | Double bottom | Two similar lows with a peak between, confirmed only by a close above that peak. | 2.2.3 |
| head-and-shoulders | Head and shoulders | Three peaks, the middle one highest, confirmed by a close beyond the neckline. The inverse forms at bottoms. | 2.2.4 |
| neckline | Neckline | The line through the lows between a head-and-shoulders' peaks, or through the highs in the inverse pattern. | 2.2.4 |
| triple-top | Triple top | Three peaks near one price, confirmed only by a close below the lowest valley between them. | 2.2.5 |
| rectangle | Rectangle | A sideways range between horizontal support and resistance, each touched several times. | 2.2.5 |
| partial-rise | Partial rise | A move inside a range that turns back before reaching the top. A partial decline is the mirror. | 2.2.5 |
| ascending-triangle | Ascending triangle | A triangle with a flat top and rising lows. | 2.2.6 |
| descending-triangle | Descending triangle | A triangle with a flat bottom and falling highs. | 2.2.6 |
| symmetrical-triangle | Symmetrical triangle | A triangle whose top falls and bottom rises, converging toward a point. | 2.2.6 |
| apex | Apex | The point where a triangle's two boundary lines meet. | 2.2.6 |
| flag | Flag | A short, small pause with parallel sides that slopes against a steep move. | 2.2.7 |
| pennant | Pennant | A short pause with converging lines after a steep move, like a small triangle. | 2.2.7 |
| flagpole | Flagpole | The steep move that comes before a flag or a pennant. | 2.2.7 |
| measured-move | Measured move | A projection that a second leg will roughly equal the first; in the data it is usually shorter. | 2.2.7 |
| high-tight-flag | High tight flag | A flag after price nearly doubled within about two months; a stock-chart pattern. | 2.2.7 |
| wedge | Wedge | A pattern with two sloped lines converging in the same direction, rising or falling. | 2.2.8 |
| broadening-formation | Broadening formation | A pattern with diverging lines, making higher highs and lower lows; also called a megaphone. | 2.2.8 |
| diamond-pattern | Diamond | A pattern that first widens and then narrows, giving a diamond shape. | 2.2.8 |
| rounding-bottom | Rounding bottom | A slow, bowl-shaped turn from falling to rising prices. | 2.2.9 |
| cup-with-handle | Cup with handle | A U-shaped base, a small pullback near its rim, then a breakout above the rim. | 2.2.9 |
| v-reversal | V reversal | A sharp turn with no pause: a steep fall followed by a steep rise, or the reverse. | 2.2.9 |
| busted-pattern | Busted pattern | A pattern that breaks out, fails, and then breaks through its opposite boundary. | 2.2.10 |
| dow-theory | Dow Theory | The founding trend framework: three degrees of trend, and a trend that lasts until clearly reversed. | 2.3.1 |
| primary-trend | Primary trend | The main, longest-lasting direction of the market, inside which shorter moves happen. | 2.3.1 |
| peak-trough-rule | Peak-trough rule | An uptrend ends when a lower low breaks the previous low; a downtrend ends in the mirror way. | 2.3.1 |
| wma | Weighted moving average (WMA) | An average that gives linearly more weight to the most recent closes. | 2.3.3 |
| lag | Lag | How far an indicator trails price, because it is calculated from past data. | 2.3.3 |
| whipsaw | Whipsaw | A signal quickly reversed by the opposite signal, usually costing a small loss plus costs. | 2.3.3 |
| wilder-smoothing | Wilder smoothing | An average where each new value is the previous one times (n − 1)/n, plus the new value over n. | 2.3.3 |
| crossover | Crossover | The moment one line crosses another, such as price crossing a moving average. | 2.3.4 |
| golden-cross | Golden cross | The 50-period average crossing above the 200-period average. | 2.3.4 |
| death-cross | Death cross | The 50-period average crossing below the 200-period average. | 2.3.4 |
| macd | MACD | The 12-period EMA minus the 26-period EMA: a momentum line built from two averages. | 2.3.5 |
| signal-line | Signal line | A moving average of an indicator, such as the 9-period EMA of MACD. | 2.3.5 |
| macd-histogram | MACD histogram | MACD minus its signal line, shown as bars. | 2.3.5 |
| ppo | PPO | MACD divided by the slower EMA, in percent, so instruments at different prices can be compared. | 2.3.5 |
| adx | ADX | Wilder's Average Directional Index: how strong a trend is, whatever its direction. | 2.3.6 |
| directional-indicator | Directional indicator (+DI / −DI) | Two lines measuring upward and downward movement; their crossing gives the direction in Wilder's system. | 2.3.6 |
| parabolic-sar | Parabolic SAR | A trailing stop-and-reverse line that speeds up as a trend extends. | 2.3.7 |
| acceleration-factor | Acceleration factor | The Parabolic SAR step: starts at 0.02, rises 0.02 at each new extreme, capped at 0.20. | 2.3.7 |
| supertrend | SuperTrend | A trailing line set a multiple of ATR away from the candle midpoint, flipping with the trend. | 2.3.7 |
| ichimoku-cloud | Ichimoku cloud | The shaded area between Ichimoku's two leading lines, drawn 26 periods ahead. | 2.3.8 |
| look-ahead-bias | Look-ahead bias | Using information in a test that wasn't available when the decision would have been made. | 2.3.8 |
| repainting | Repainting | When an indicator changes its past values as new data arrive, making past signals look better. | 2.3.8 |
| oscillator | Oscillator | An indicator that swings around a centre line or between fixed bounds. | 2.4.1 |
| momentum | Momentum | Price change over a set number of periods: today's close minus the close n periods ago. | 2.4.1 |
| rate-of-change | Rate of change (ROC) | Price change over n periods, in percent. | 2.4.1 |
| rsi | RSI | Relative Strength Index: a 0–100 measure comparing average gains with average losses. | 2.4.2 |
| overbought | Overbought | An indicator reading after a strong rise. It does not mean price must fall. | 2.4.2 |
| oversold | Oversold | An indicator reading after a strong fall. It does not mean price must rise. | 2.4.2 |
| stochastic-oscillator | Stochastic oscillator | Where the close sits within the recent high-low range, from 0 to 100. | 2.4.3 |
| williams-r | Williams %R | The stochastic %K shifted to run from 0 to −100. | 2.4.3 |
| cci | CCI | Commodity Channel Index: how far typical price is from its average, in units of mean deviation. | 2.4.3 |
| collinearity | Collinearity | Indicators moving together because they use the same inputs, so their agreement confirms nothing new. | 2.4.3 |
| fade | Fade | Trading against the latest move, expecting it to reverse. | 2.4.4 |
| divergence | Divergence | Price and an indicator moving in different directions at matching swing points. | 2.4.5 |
| hidden-divergence | Hidden divergence | Price makes a higher low while the oscillator makes a lower low, or the mirror; read as continuation. | 2.4.5 |
| failure-swing | Failure swing | Wilder's RSI-only reversal: RSI fails to retest an extreme, then breaks its previous swing. | 2.4.5 |
| true-range | True range | The largest of: high minus low, and the distances from the previous close to the high and low. | 2.4.6 |
| atr-percent | ATR % | ATR divided by price, in percent, to compare volatility across instruments. | 2.4.6 |
| standard-deviation | Standard deviation | A measure of how spread out values are around their average. | 2.4.6 |
| historical-volatility | Historical volatility | The standard deviation of past returns, often annualised. | 2.4.6 |
| volatility-clustering | Volatility clustering | Busy periods tend to follow busy ones, and quiet periods tend to follow quiet ones. | 2.4.6 |
| bollinger-bands | Bollinger Bands | A 20-period average with bands two standard deviations above and below it. | 2.4.8 |
| percent-b | %b | Where price sits between the Bollinger Bands: 0 at the lower band, 1 at the upper. | 2.4.8 |
| bandwidth | BandWidth | The distance between the Bollinger Bands divided by the middle band. | 2.4.8 |
| squeeze | Squeeze | Unusually narrow bands: low volatility that tends to come before a bigger move in either direction. | 2.4.8 |
| keltner-channel | Keltner Channel | An EMA with bands a multiple of ATR above and below it. | 2.4.9 |
| donchian-channel | Donchian channel | The highest high and the lowest low of the previous n candles. | 2.4.9 |
| relative-volume | Relative volume | Volume compared with its recent average; 2.0 means twice the usual volume. | 2.5.1 |
| obv | On-balance volume (OBV) | A running total that adds volume on up closes and subtracts it on down closes. | 2.5.2 |
| accumulation-distribution-line | Accumulation/distribution line | A running total of volume weighted by where each candle closed within its range. | 2.5.2 |
| chaikin-money-flow | Chaikin Money Flow | The accumulation/distribution idea averaged over a window, usually 20 candles. | 2.5.2 |
| money-flow-index | Money Flow Index | A volume-weighted version of RSI, from 0 to 100. | 2.5.2 |
| vwap | VWAP | Volume-weighted average price since the session open; a benchmark for judging fills. | 2.5.3 |
| anchored-vwap | Anchored VWAP | A VWAP started from a chosen candle, such as a swing or an event. | 2.5.3 |
| typical-price | Typical price | The average of a candle's high, low and close. | 2.5.3 |
| volume-profile | Volume profile | A sideways histogram of how much volume traded at each price. | 2.5.4 |
| point-of-control | Point of control | The price with the most traded volume in a volume profile. | 2.5.4 |
| value-area | Value area | The price range around the point of control that holds about 70% of the volume. | 2.5.4 |
| high-volume-node | High-volume node | A price where a lot of volume traded, seen as a peak in the profile. | 2.5.4 |
| low-volume-node | Low-volume node | A price where little volume traded, seen as a dip in the profile. | 2.5.4 |
| pivot-point | Pivot point | A level calculated from the previous session's high, low and close. | 2.5.5 |
| common-gap | Common gap | A gap inside a range, usually small and soon filled. | 2.5.6 |
| breakaway-gap | Breakaway gap | A gap that leaves a range or pattern and can start a new move. | 2.5.6 |
| runaway-gap | Runaway gap | A gap in the middle of a strong trend, also called a measuring gap. | 2.5.6 |
| exhaustion-gap | Exhaustion gap | A late-trend gap that is quickly filled; you can be sure of it only afterwards. | 2.5.6 |
| island-reversal | Island reversal | A group of candles cut off by a gap on each side, at overlapping prices. | 2.5.6 |
| gap-fill | Gap fill | When price returns to the last price traded before the gap. | 2.5.6 |
| partial-gap | Partial gap | An open beyond the previous close while the two candles' ranges still overlap. | 2.5.6 |
| supply-zone | Supply zone | A zone at the base of a sharp fall, where some traders expect selling again. | 2.5.7 |
| demand-zone | Demand zone | A zone at the base of a sharp rise, where some traders expect buying again. | 2.5.7 |
| fresh-zone | Fresh zone | A supply or demand zone that price has not returned to since it formed. | 2.5.7 |
| fibonacci-retracement | Fibonacci retracement | Levels at 23.6%, 38.2%, 50%, 61.8% and 78.6% of a swing, where some expect pullbacks to stall. | 2.5.8 |
| fibonacci-extension | Fibonacci extension | Levels beyond a swing, such as 161.8% of it, used as targets. | 2.5.8 |
| confluence | Confluence | Several independent reasons pointing to the same price or direction. | 2.5.8 |
| trend-bar | Trend bar | A bar with a large body that closes near its extreme. | 2.6.1 |
| doji-bar | Doji bar | In price action, a bar with a small body compared with its range. | 2.6.1 |
| bar-overlap | Bar overlap | How much of a bar's range is shared with the previous bar's range. | 2.6.1 |
| signal-bar | Signal bar | The bar whose high or low sets the price of a stop entry. | 2.6.2 |
| entry-bar | Entry bar | The bar during which your entry order fills. | 2.6.2 |
| traders-equation | Trader's equation | Win chance times reward must beat loss chance times risk, after costs. | 2.6.2 |
| inside-bar | Inside bar | A bar whose high and low stay within the previous bar's range. | 2.6.3 |
| outside-bar | Outside bar | A bar whose high and low both go beyond the previous bar's. | 2.6.3 |
| nr7 | NR7 | The bar with the narrowest range of the last seven bars. | 2.6.3 |
| hikkake | Hikkake | An inside bar, a false break out of one side, then a move through the other. | 2.6.3 |
| high-1-high-2 | H1 / H2 | In a bull pullback, the first and second bars that trade above the previous bar's high. | 2.6.4 |
| two-legged-pullback | Two-legged pullback | A pullback against the trend in two legs, separated by a small bounce. | 2.6.4 |
| second-entry | Second entry | A trade taken on the second attempt in one direction, after the first attempt failed. | 2.6.4 |
| micro-channel | Micro channel | A run of bars where no bar's low goes below the previous bar's low, or the mirror. | 2.6.5 |
| three-push-wedge | Three-push wedge | Three pushes in the same direction with fading momentum. | 2.6.5 |
| spike-and-channel | Spike and channel | A strong breakout followed by a slower trending channel. | 2.6.5 |
| trapped-trader | Trapped trader | A trader caught on the wrong side of a failed move, whose exit can fuel the move. | 2.6.6 |
| failed-breakout | Failed breakout | A break beyond a level followed by a close back inside within one to three bars. | 2.6.6 |
| climax | Climax | An unusually large bar late in a long move, often followed by a pause or reversal. | 2.6.7 |
| exhaustion | Exhaustion | Signs that a move is tiring: more overlap, tails against it, no follow-through. | 2.6.7 |
| brier-score | Brier score | The average squared gap between your stated probabilities and what happened. Lower is better. | 2.6.7 |
| timeframe-shopping | Timeframe shopping | Switching timeframes until one agrees with what you already wanted to do. | 2.6.8 |
| triple-screen | Triple Screen | Elder's method: trend on a longer timeframe, a pullback on the trading one, entry timed on a shorter one. | 2.6.8 |
| anticipation-entry | Anticipation entry | Entering before a pattern confirms: a better price and a lower hit rate. | 2.7.1 |
| confirmation-entry | Confirmation entry | Entering after a pattern confirms: a higher hit rate and a worse price. | 2.7.1 |
| retest-entry | Retest entry | Entering when price comes back to the level it just broke. It may never come back. | 2.7.1 |
| adverse-selection | Adverse selection | Limit orders fill most often when price then keeps moving against you. | 2.7.1 |
| pyramiding | Pyramiding | Adding to a winning position while moving stops so total risk stays within the original plan. | 2.7.2 |
| split-entry | Split entry | Entering a planned position in several parts, with the total risk set for the full size. | 2.7.2 |
| open-risk | Open risk | What you would lose if every stop on your open positions were hit right now. | 2.7.2 |
| structural-target | Structural target | A profit target set at the next support or resistance zone. | 2.7.3 |
| mfe | MFE | Maximum favourable excursion: the best unrealised result a trade reached, usually in R. | 2.7.3 |
| chandelier-exit | Chandelier exit | A trailing stop at the highest high since entry minus a multiple of ATR. | 2.7.4 |
| giveback | Giveback | How much of a trade's best unrealised gain was given back before the exit. | 2.7.4 |
| breakeven-stop | Breakeven stop | A stop moved to the entry price after the trade has gained a set amount. | 2.7.5 |
| scratch-trade | Scratch trade | A trade closed at about zero, often by a breakeven stop. | 2.7.5 |
| blended-r | Blended R | The total R of a trade closed in parts, with each part weighted by its size. | 2.7.6 |
| runner | Runner | The part of a position left open after a partial exit, usually with a trailing stop. | 2.7.6 |
| time-stop | Time stop | An exit when a trade hasn't made set progress within a set number of bars. | 2.7.7 |
| exit-reason | Exit reason | A tag recording why you left a trade, chosen from your written plan. | 2.7.7 |
| mae | MAE | Maximum adverse excursion: the worst unrealised result a trade reached, usually in R. | 2.7.8 |
| exit-efficiency | Exit efficiency | The share of a trade's best unrealised gain that you kept when you exited. | 2.7.8 |
| edge-ratio | Edge ratio | Average best move divided by average worst move after entries. Random entries score about 1. | 2.7.8 |
