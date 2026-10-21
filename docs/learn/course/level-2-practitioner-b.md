# Nivelul 2 · Practitioner (partea B): 2.8–2.14 și Capstone 2

Harta lecție cu lecție pentru a doua jumătate a Nivelului 2: strategii pe regimuri, sesiuni și intraday, știri, risc de portofoliu și performanță, psihologia II, playbook și recenzii, instrumente (acțiuni, forex, CFD-uri).

- Arhitectura, notele de dovezi, regimurile R0–R14 și capabilitățile S1–S20 sunt în [README.md](README.md).
- Prima jumătate a nivelului (2.1–2.7: lumânări, pattern-uri, indicatori de trend, oscilatori și volatilitate, volum și niveluri, price action, managementul trade-ului) e în [level-2-practitioner-a.md](level-2-practitioner-a.md). Aici apare doar ca prerechizită, după id-ul unității.
- Cele două lecții existente care intră aici își păstrează scriptul complet: L18 (2.12.8) în [../U5-traders-mind.md](../U5-traders-mind.md) și L15 (2.13.1) în [../U4-plan-and-decide.md](../U4-plan-and-decide.md).

---

## Ce poate face utilizatorul la finalul părții B

- **Să aleagă unealta după regim.** Pune o etichetă (trend, range, fără regim clar) pe un grafic necunoscut, alege una dintre cele 7 strategii sau „No trade” și descrie strategia complet: setup, intrare, stop, ieșire, regimul în care merge, unde eșuează, costurile și nota de dovezi.
- **Să judece o strategie onest.** Trece de la rezultatul brut la cel net (spread, comision, slippage), îl compară cu benchmark-ul pasiv și cu aceeași regulă pe random walk, și știe câte trade-uri îi trebuie ca să creadă rezultatul.
- **Să lucreze cu timpul pieței.** Știe orele piețelor în ora României, inclusiv săptămânile în care DST-ul nu e aliniat, ritmul zilei, opening range, gap-urile, weekendul și rollover-ul. Alege între day trading și swing din costuri și din constrângerile vieții lui. Decizia de a *nu* face day trading e un rezultat valid (README §1, pct. 8).
- **Să trateze știrile întâi ca risc.** Citește calendarul și surpriza față de consens, știe ce sunt NFP, CPI și deciziile băncilor centrale și aplică o politică scrisă dinainte: stă deoparte, reduce sau tranzacționează a doua mișcare.
- **Să gândească la nivel de portofoliu.** Dimensionează pe volatilitate între instrumente, ține portfolio heat-ul și corelația sub plafon, are trepte de drawdown și citește metricile cu interval de încredere și SQN.
- **Să-și vadă biasurile în propriile date** (disposition, house money, recency, calibrare, tilt) și să le opună reguli și guard-rails.
- **Să ruleze bucla de proces:** carduri de setup, rutina de dinaintea pieței, planuri if-then, taxonomia erorilor, recenzii zilnice și săptămânale, KPI-uri de proces.
- **Să cunoască instrumentele:** acțiuni și ETF-uri, short selling, mecanica forex, swap, indici și CFD-uri, marjă, close-out și negative balance protection, costurile pe instrument și regulile pe jurisdicții, cu dată.

## Etapa 2 → 3 (README §5)

Etapa acordă nivelul și insigna. **Nu blochează conținutul** și se bazează doar pe măsuri de proces.

| Condiția din README §5 | Unde se construiește în partea B |
|---|---|
| 100 de trade-uri simulate pe cel puțin 2 setup-uri din playbook | strategiile din 2.8; cardurile de setup din 2.13.2; tag-ul de setup cerut în Practice și în Arena |
| recenzia săptămânală făcută 4 săptămâni la rând | 2.13.6 (asistentul de recenzie săptămânală) |
| recunoașterea regimului peste nivelul hazardului | 2.8.1, laboratorul unității 2.8, Capstone 2 (cel puțin 8 din 12 segmente corecte; la ghicit, cu 3 variante, șansa e de 1.9%) |
| costul erorilor în scădere | 2.13.5 (costul erorilor în R), detectoarele din 2.12 (S14) |
| Capstone 2 | finalul fișierului |

P&L-ul simulat nu intră în nicio condiție. R5 §10 propune în plus un „disposition score” într-o bandă țintă. E trecut la întrebări deschise.

## Firele spiralei la acest nivel (README §4)

| Fir | Ce aduce partea B | Unde |
|---|---|---|
| Risc | dimensionarea pe ATR între instrumente, portfolio heat, corelația, limitele de expunere și de perioadă, treptele de drawdown, riscul de gap la știri și în weekend | 2.11, 2.9.8, 2.10.7, 2.10.9 |
| Statistică | rata de bază, eșantionul, intervalul de încredere, SQN, seriile, regresia la medie | 2.8.10, 2.11.7, 2.11.8, 2.12.4, 2.12.8, 2.12.9 |
| Psihologie | biasurile măsurate pe datele utilizatorului, cu detectoare (S14) | 2.12 |
| Proces | playbook, rutine, if-then, taxonomia erorilor, recenzii, KPI | 2.13 |
| Dovezi | nota fiecărei strategii, controlul pe random walk (R0), cazul ORB (paper vs replicare) | 2.8, 2.9.4, 2.9.5, 2.10.7 |
| Costuri | costul pe stil (scalping, day vs swing), costul știrilor, costul pe instrument | 2.9.6, 2.9.7, 2.10.3, 2.14.7 |

## Convenții în acest fișier

**Lumea simulată** (aceeași ca în [../README.md](../README.md)):
- LABX, vUSD, cont de 10,000.00;
- risc 1% (100.00) în lecții și misiuni, 2% în Arena;
- spread 0.10;
- comision 0.05% pe fiecare execuție, rotunjit în sus la cent;
- unități întregi, rotunjite în jos;
- fără levier până la 2.14.6: valoarea poziției ≤ capital, deci la 100.00 cel mult 100 de unități.

**Două feluri de calcul, ca să nu se amestece:**
1. **În hook-uri și la break-even:** prețuri mid, de pe grafic, iar costul dus-întors e de ≈ 0.20 pe unitate la prețuri în jur de 100 (spread 0.10 plus două comisioane de ≈ 0.05). Costul în R e costul pe unitate împărțit la distanța stopului (R5 RF-21). Exemple: stop 1.00 → 0.20R, stop 4.00 → 0.05R.
2. **La dimensionare, ca în L09:** entry și stop sunt prețuri de execuție și se adaugă comisioanele rotunjite. Toate dimensiunile din fișier sunt calculate cu metoda din `maxQtyForRisk` (`packages/engine`) și verificate cu un script. Lângă fiecare apare și dimensiunea cu o unitate în plus, ca dovadă.

**Instrumente noi** (propunere; cer S9 și S10; de decis):
- **LABY:** sintetic, corelat cu LABX (ρ ≈ 0.85);
- **LABZ:** sintetic, necorelat cu LABX (ρ ≈ 0), preț ≈ 40.00, ATR mai mic;
- **vEUR/vUSD și vUSD/vJPY:** perechi sintetice cu convențiile perechilor majore (pip 0.0001, respectiv 0.01);
- **LABIX:** indice sintetic, tranzacționat ca CFD și ca ETF.

**Știri:** evenimentele sunt sintetice (S6), modelate după publicări reale (NFP, CPI, deciziile băncilor centrale). Faptele reale despre ele au sursă și dată.

**Ora:** orele reale apar și în ora României (Europe/Bucharest), verificate cu baza de fusuri orare.

**Notații:**
- ✓ = există în `concepts.ts`, respectiv în `glossary.ts`;
- (nou) = propus în acest fișier;
- (din X.Y) = concept sau termen pe care îl introduce alt fișier al hărții (0, 1 sau 2a), cu id provizoriu, de aliniat la integrare.

**Câmpuri în plus față de fișa din README §10**, cerute pentru această parte:
- **Fișa strategiei** (2.8, 2.9.4, 2.9.5, 2.10.7, 2.10.8): setup, intrare, stop, ieșire, regim, unde eșuează, costuri, notă de dovezi;
- **Riscul întâi** (2.10): mecanica spread / slippage / gap, înaintea oricărei strategii;
- **Reglementare (datată)** (2.14): pe jurisdicții, cu data de 22.10.2026.

**Tip:**
- 2.8–2.13 sunt Core;
- 2.14 e Core pentru cine tranzacționează acțiuni, FX sau CFD-uri (README §2).

**Durata și interacțiunile:** fiecare lecție are 6–8 minute (PLAN_LEARN §4.1) și cel puțin 3 interacțiuni reale: hook-ul, task-ul și încă una (PLAN_LEARN §4.2).

**Nivelul 3+** apare doar ca trimitere de un rând („Mai departe: …”).

## Lecțiile pe unități

| Unitate | Lecții (README §3) | Aici | Ajustare |
|---|---|---|---|
| 2.8 Strategies by market regime | 10 | 10 | — |
| 2.9 Sessions, time and intraday | 8 | 8 | — |
| 2.10 News and the economic calendar | 9 | 9 | — |
| 2.11 Portfolio risk and performance | 8 | 8 | — |
| 2.12 The trader's mind II | 9 | 9 (cu L18) | — |
| 2.13 Playbook, routine and review | 7 | 7 (cu L15) | — |
| 2.14 Instruments I: stocks, forex, CFDs | 8 | 8 | — |
| **Total** | **59** | **59** | |

**Nicio unitate nu se ajustează.** Lista din README §3 acoperă exact ce cer R4 §9 (Level 2), R5 §10 (Level 2) și R6 §7 (Stages 1–3) pentru acest nivel.

Unde cercetarea cere mai mult, conținutul s-a putut îmbina fără o lecție în plus:
- **2.12:** „tilt” și „rutine” intră într-o singură lecție (2.12.7), pentru că rutinele sunt chiar remediul pentru tilt (R5 PSY-19, PSY-28, PSY-37).
- **2.14:** brokerii și banii clienților rămân în 4.5. Aici intră doar regulile care schimbă felul în care se folosește instrumentul.

---

## Unitatea 2.8 · Strategies by market regime (10 lecții)

**Scop:**
- Familiile de strategii, organizate pe regim: trend, range, breakout, reversal. Fiecare are fișa completă și nota de dovezi.
- Abilitatea centrală, din R6 §2.17:
  1. diagnostichezi regimul;
  2. alegi strategia sau te abții;
  3. dimensionezi pentru regimul în care ai putea greși.

**De ce aici:**
- După 2.1–2.7 utilizatorul are uneltele: lumânări în context, indicatori, niveluri, managementul trade-ului. Aici le leagă în reguli complete.
- Gruparea pe regim urmează IG, CMT II și Chan (R1 §3.2, pct. 7; R1 §3.4, pct. 4).
- Strategiile vin după plan și jurnal (1.6), cum cere README §1, pct. 5.

**Se sprijină pe:**
- 0.2: random walk, valoarea așteptată;
- 1.4: R, sizing, expectancy;
- 1.5: structura, trend și range, breakout și breakout eșuat;
- 2.3: medii mobile, ADX;
- 2.4: ATR, RSI, Bollinger, squeeze;
- 2.5: volum, niveluri;
- 2.6: inside bars, traps;
- 2.7: ținte, trailing, time stops.

**Checkpoint:** 12 întrebări:
- 4 de diagnostic de regim, pe grafice fără etichetă;
- 4 de fișă („Where does this strategy fail?”);
- 2 de cost în R;
- 2 de dovezi.

Plus o sarcină: 6 segmente fără etichetă, pe care utilizatorul alege o strategie sau „No trade”. La ≥ 80%, lecțiile se marchează „Tested out”.

**Laboratorul unității: Regime lab.**
- 30 de episoade generate (R0, R1, R2, tranziții R2 → R1, R3), cu eticheta ascunsă.
- Pe fiecare episod, utilizatorul:
  1. pune eticheta de regim;
  2. alege o strategie (din cele 7) sau „No trade”;
  3. rulează strategia cu costuri și vede rezultatul lângă benchmark ghost și lângă aceeași regulă rulată pe R0.
- Scorul:
  - acuratețea etichetelor, față de hazard (33%);
  - abținerea corectă pe R0;
  - aderența la fișa strategiei.
- P&L-ul e doar diagnostic.

**Firele spiralei:**
- Dovezi: fiecare strategie are notă, iar R0 e controlul;
- Costuri: costul în R, pe strategie;
- Statistică: rata de bază, eșantionul;
- Risc: dimensionezi pentru regimul în care ai putea greși.

**Surse:**
- R6 §0.4–0.5, §2.1–2.5, §2.7.3, §2.17, §5.1;
- R1 §3.2, §3.3 („indicator soup”), §4 pct. 1 și 12;
- R5 RF-21, ST-02, PM-13;
- R3 §4.7–4.8.

#### 2.8.1 · Matching the tool to the regime
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Label an unlabeled chart segment as trend, range or no clear regime before choosing a strategy
  2. Match each strategy family to the regime where it works and the one where it fails
  3. Choose "No trade" when the regime is unclear or the market behaves like a random walk
- **Concepte:** market-regime (nou), strategy-regime-fit (nou), trend ✓, range ✓, base-rates ✓, random-walk (din 0.2)
- **Se sprijină pe:** 1.5 (L05: trend, range și zgomot), 0.2 (hazardul care desenează pattern-uri), 2.3, 2.4
- **Hook:**
  - **Tip:** predict, cu alegere între „The trader got unlucky”, „The market changed regime” și „The rule stopped working for good”.
  - **Prompt:** "The same moving-average rule ran on LABX for two months. Month A: 12 trades, +6.0R. Month B: 15 trades, −8.4R. Same rules, same trader. What changed?"
  - **Răspuns:** regimul.
    - Luna A e un trend (R1): 5 câștiguri de +2.6R în medie și 7 pierderi de −1R, deci +6.0R.
    - Luna B e un range (R2): 3 câștiguri de +1.2R și 12 pierderi, deci −8.4R.
  - Răspunsul se compară în recap.
- **Interacțiunea centrală:**
  - **B1 · explain:** „A strategy is a bet on a regime.”
  - **B2 · figure:** trei panouri fără etichetă (R1, R2, R0), câte 40 de lumânări. Etichetele apar pas cu pas, fiecare cu semnul ei:
    - HH/HL;
    - atingeri pe ambele margini și medii plate;
    - nimic consecvent.
  - **B3 · match:** 4 familii ↔ „works in / fails in”, după R6 §2.17:
    - trend following: R1 / R2;
    - breakout: R2 → R1 / R2 care continuă;
    - range și mean reversion: R2 / R1;
    - failed-breakout fade: R2 / R1.
  - **B4 · hotspot:** 60 de lumânări, cu un range care devine trend la lumânarea 34. „Tap the candle where the regime changed.” Se acceptă lumânările 34–36.
  - **B5 · predict:** pe panoul R0, „Which strategy has an edge here?”. Răspunsul: niciuna.
  - **B6 · callout:** „Diagnose first. Choose or skip second. Size for the regime you might be wrong about.”
- **Try:**
  - **Widget:** `regime-sorter` (nou).
  - **Date:** 6 segmente de 40 de lumânări, fără etichetă: 2 R1, 2 R2, 2 R0. Pe fiecare, utilizatorul alege Trend / Range / No clear regime, apoi o familie de strategii sau „No trade”.
  - **Reușită:** cel puțin 4 etichete corecte din 6 și „No trade” pe ambele segmente R0.
  - **Indicii:**
    1. „Two higher highs and higher lows?”
    2. „Two touches on each side and flat averages?”
    3. „If you can't name the regime in one sentence, it isn't clear.”
- **Practică:** Regime lab (20 de episoade R0 / R1 / R2); Arena: Mixed regimes (`mixed`, azi legacy).
- **Check:**
  1. ce familie pierde într-un range și de ce (whipsaw);
  2. ce faci pe un regim neclar sau pe R0 („No trade”);
  3. un caz cu eticheta incertă: mărime mai mică sau skip.
- **Dovezi:**
  - **Mechanic:** pe random walk nicio regulă nu are edge, prin construcție (R6 §0.5, R0).
  - **C:** matricea strategie × regim e o sinteză de practicieni (R6 §2.17; R1 §3.2, pct. 7).
- **Necesită:** S7 (random walk), un generator de regimuri ascunse R0–R2 (azi Arena are R1–R5 doar ca scenarii etichetate), S13 (P&L pe regim)
- **Termeni noi de glosar:** market-regime (whipsaw vine din 2.3)

#### 2.8.2 · Trend following
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. State the full rules of a moving-average or channel trend-following system
  2. Explain why a 30–45% win rate can still give a positive expectancy
  3. Predict where the system loses: ranges and sharp reversals
- **Concepte:** trend-following (nou), moving-average ✓, trailing-stop ✓, expectancy ✓, volatility ✓, market-regime (2.8.1)
- **Se sprijină pe:** 2.8.1, 2.3 (L07, încrucișări, ADX, teoria Dow), 2.4 (ATR), 2.7 (trailing), L11 (expectancy)
- **Fișa strategiei:**
  - **Setup:**
    - prețul e peste o MA de 50 de perioade care urcă (sau EMA 20 e peste EMA 50);
    - ultimele două swing-uri au făcut un higher high și un higher low;
    - opțional, filtrul ADX(14) > 20–25.
  - **Intrare:** la închiderea de după încrucișare, sau la o închidere peste maximul ultimelor 20 de lumânări (Donchian pe o singură piață).
  - **Stop:** la 2–3 × ATR(14) sub intrare, sau sub ultimul higher low.
  - **Ieșire:** la încrucișarea opusă, sau pe un trailing stop la 3 × ATR ori la minimul ultimelor 10 lumânări.
  - **Regim:** R1. Eșuează:
    - în R2 (whipsaw);
    - la reversaluri în V;
    - la începutul unui șoc de volatilitate (R3).
  - **Costuri:**
    - turnover moderat;
    - stop-urile largi țin costul mic în R: un stop de 4.00 la LABX ≈ 100 costă 0.20 ÷ 4.00 = 0.05R;
    - slippage pe ordinele stop de intrare;
    - lag-ul dă înapoi o parte din profitul deschis.
  - **Notă:**
    - **B** pentru MA timing pe un singur activ: reduce drawdown-ul, dar edge-ul de randament e disputat după costuri (Brock, Lakonishok & LeBaron 1992, slăbit după ajustarea pentru data snooping [PK]);
    - **A** doar ca time-series momentum diversificat (Mai departe: 3.13);
    - **C** pentru definiția discreționară pe structură.
    - Surse: R6 §2.1.1, §2.1.2, §2.2.1, §2.6.2.
- **Hook:**
  - **Tip:** predict, cu alegere între „Makes money”, „Loses money” și „Can't tell”.
  - **Prompt:** "A trend rule wins 7 of 20 trades. Winners average +3.2R, losers −1R. Costs are 0.10R per trade. Over the 20 trades, does it make money?"
  - **Răspuns:** da.
    - Brut: 7 × 3.2 − 13 × 1 = +9.4R.
    - Net: 9.4 − 20 × 0.10 = +7.4R, adică +0.37R pe trade.
- **Interacțiunea centrală:**
  - **B1 · explain:** „Cut losses, let winners run”, fără să ghicești unde se termină trendul.
  - **B2 · worked** cu input: 0.35 × 3.2 − 0.65 × 1 = ? → +0.47R brut, apoi +0.37R net.
  - **B3 · figure:** aceeași regulă 20/50 pe două episoade, cu marcaje pe intrări și ieșiri:
    - R1: 6 trade-uri, +5.8R brut;
    - R2: 9 trade-uri, −6.1R brut.
  - **B4 · predict:** „How many of the 9 range trades were whipsaws?” Răspunsul: 7. Se numără pe grafic.
  - **B5 · hotspot:** „Tap the candle where the trailing stop closes the trend trade.”
  - **B6 · callout:** skew pozitiv înseamnă serii lungi de pierderi. La 35% câștiguri, o serie de cel puțin 8 pierderi în 100 de trade-uri are o probabilitate de ≈ 69% (lanț Markov exact, ca în L18).
- **Try:**
  - **Widget:** `strategy-lab` (nou, mod lecție, S13). Regula MA (rapidă / lentă, 10–50) rulează pe două episoade fixe, cu seed.
  - **Obiectiv:** "Run the 20/50 rule on both episodes. Which one lost money after costs, and how many whipsaws did it take?"
  - **Reușită:** episodul R2 și 7 whipsaws.
  - **Cifre-țintă pentru seed** (cost 0.10R pe trade):
    - R1: 6 trade-uri, +5.8R brut, +5.2R net;
    - R2: 9 trade-uri, −6.1R brut, −7.0R net.
  - Ghost-ul buy-and-hold e vizibil pe ambele episoade.
- **Practică:** Regime lab cu episoade R1 / R2 alternante (exercițiul din R6 §2.1.1). Utilizatorul spune regimul înainte să vadă rezultatul. Arena: Bullish market, apoi Sideways market.
- **Check:**
  1. de ce un win rate mic poate avea expectancy pozitiv;
  2. unde eșuează strategia (range, whipsaw);
  3. cum scade costul în R când stopul e mai larg.
- **Dovezi:** B / A (ca TSMOM, Mai departe: 3.13) / C, ca în fișă.
- **Necesită:** S2 (EMA, ATR, ADX), S1 (stop de intrare, pentru Donchian), S13
- **Termeni noi de glosar:** trend-following

#### 2.8.3 · Pullback in a trend
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Define a pullback entry with a trend filter, a trigger and a stop below the pullback low
  2. Compare the reward-to-risk of buying a pullback with chasing the same move
  3. Recognise the pullback that turns into a reversal
- **Concepte:** trend-pullback (nou), invalidation-level ✓, reward-to-risk ✓, cost-adjusted-sizing ✓, fomo ✓
- **Se sprijină pe:** 2.8.2, 2.3 (MA, ADX), 2.6 (pullback-uri în două picioare, signal bars), L10, L09, L13
- **Fișa strategiei:**
  - **Setup:**
    - filtru de trend: prețul e peste o MA de 50 care urcă, cu HH/HL;
    - pullback până la EMA 20 sau până la nivelul vechiului breakout;
    - varianta Holy Grail: ADX(14) > 30 și în creștere, prima atingere a MA de 20.
  - **Intrare:** pe trigger: o închidere înapoi peste maximul lumânării anterioare, sau un buy stop la maximul lumânării care a atins MA.
  - **Stop:** sub minimul pullback-ului, minus o jumătate de ATR.
  - **Ieșire:** la swing high-ul anterior sau la 2R, apoi trailing.
  - **Regim:** R1, cu corecții normale. Eșuează:
    - la sfârșitul trendului, când pullback-ul devine reversal;
    - în range și la volatilitate mică;
    - ADX-ul întârzie.
  - **Costuri:**
    - stopul e mai strâns decât în trend following, deci costul în R e mai mare: un stop de 0.80 la ≈ 57 costă (0.10 + 0.057) ÷ 0.80 ≈ 0.20R;
    - „chase penalty” când intri la peste 2 ATR deasupra MA.
  - **Notă:**
    - **C**, practică de practician, cu un sprijin teoretic **B** (reversalul pe termen scurt în interiorul momentum-ului);
    - Holy Grail: **C**.
    - Surse: R6 §2.3.1–2.3.2.
- **Hook:**
  - **Tip:** predict, cu alegere între „Buy now” și „Wait for the pullback” și o estimare a raportului.
  - **Prompt:** "LABX is trending up. Stop 56.40 under the last swing low, target 61.00. Buy now at 58.40, or wait for a pullback to 57.20? Which gives the better reward-to-risk?"
  - **Răspuns:**
    - așteptarea dă (61.00 − 57.20) ÷ (57.20 − 56.40) = 3.80 ÷ 0.80 = 4.75 : 1;
    - acum: 2.60 ÷ 2.00 = 1.3 : 1.
  - Recap-ul adaugă partea a doua: unele pullback-uri nu mai vin.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** un trend cu trei pullback-uri la EMA 20, care țin, și un al patrulea care închide sub MA 50.
  - **B3 · worked** cu input:
    - stopul = minimul pullback-ului 56.80 − 0.5 × ATR 0.80 = 56.40;
    - unitățile: 100.00 ÷ (0.80 + 0.0005 × (57.20 + 56.40)) ≈ 116.7, deci **116**. 116 unități pierd 99.40, iar 117 ar pierde 100.25.
  - **B4 · hotspot:** „Tap the pullback that became a reversal.” Ținta: al patrulea pullback.
  - **B5 · match:** tipuri de trigger ↔ ce confirmă fiecare.
  - **B6 · callout:** trade-urile ratate fac parte din metodă. Nu urmări prețul.
- **Try:**
  - **Widget:** bracket-builder (L04), pe graficul de trend.
  - **Valori de start:** entry 57.20 (blocat).
  - **Obiectiv:** "Set the stop by the rule, size for 1%, and put the target at least 2R away."
  - **Reușită:**
    - stop 56.40;
    - 116 unități (99.40 la risc);
    - target ≥ 58.80 (2R). Swing high-ul anterior, 59.60, ar da 3.0R.
- **Practică:** R1 cu mai multe pullback-uri (exercițiul din R6 §2.3.1), cu chase penalty peste 2 ATR deasupra MA. Arena: Bullish market. M06 The FOMO Trap, ca transfer.
- **Check:**
  1. părțile setup-ului: filtru, trigger, stop;
  2. raportul R:R la pullback față de urmărire;
  3. semnele unui pullback care devine reversal: un lower low sub ultimul HL, o închidere sub MA 50.
- **Dovezi:** C (B pentru mecanismul teoretic), R6 §2.3.1–2.3.2. Aritmetica de dimensionare e Mechanic.
- **Necesită:** S2 (EMA, ADX, ATR), S1 (buy stop), S14 (detectorul de chase)
- **Termeni noi de glosar:** trend-filter

#### 2.8.4 · Breakout from a range
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Write breakout rules: a tested level, a close beyond it, a stop back inside, a measured-move target
  2. Compute the break-even win rate of a breakout before and after costs
  3. Name the conditions in which breakouts fail most often
- **Concepte:** range-breakout-strategy (nou), breakout ✓, support-and-resistance ✓, false-breakout ✓, reward-to-risk ✓
- **Se sprijină pe:** 2.8.1, 1.5 (L06), 2.2 (measured move, retest), 2.5 (volum), M10 (playbook-ul de breakout)
- **Fișa strategiei:**
  - **Setup:**
    - un nivel orizontal atins de cel puțin 2 ori;
    - un range de cel puțin 20 de lumânări;
    - opțional, volumul lumânării de breakout peste media ultimelor 20.
  - **Intrare:** la o închidere dincolo de nivel, sau un buy stop imediat deasupra, sau un retest care ține.
  - **Stop:** înapoi în range, sub minimul lumânării de breakout.
  - **Ieșire:** measured move (înălțimea range-ului adăugată la nivel), sau trailing.
  - **Regim:** tranziții R2 → R1. Eșuează:
    - la false breakout (R2 continuă);
    - cu volum mic;
    - după o mișcare deja lungă.
  - **Costuri:**
    - slippage pe stop-urile de intrare în piața rapidă;
    - pierderi mici și dese;
    - ≈ 0.20 pe unitate la ≈ 100.
  - **Notă:**
    - **C/D** pentru breakout-ul de nivel S/R: nivelul e subiectiv și arată mai bine în retrospectivă;
    - **B** pentru Donchian pe o singură piață (A doar diversificat, ca time-series momentum).
    - Surse: R6 §2.2.1, §2.2.4.
- **Hook:**
  - **Tip:** predict, slider 0–100%, pas 1.
  - **Prompt:** "LABX ranged between 97.00 and 100.00 for 30 candles, then closed at 100.15. Stop back inside at 99.20, target the measured move at 103.00. With costs of 0.20 per unit, what win rate does this trade need to break even?"
  - **Răspuns:** ≈ 30%.
    - După costuri: 1.15 ÷ (1.15 + 2.65) = 30.3%.
    - Înainte de costuri: 0.95 ÷ 3.80 = 25.0%.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** range-ul 97.00–100.00, cu atingeri la 100.00 pe c6, c14, c25 și la 97.00 pe c10, c19. Lumânarea de breakout c31 închide la 100.15, cu volum de 1.8 × media.
  - **B3 · worked:**
    - target = 100.00 + 3.00 = 103.00;
    - reward 2.85, risc 0.95 → 3.0 : 1;
    - după costuri: câștig 2.65, pierdere 1.15, break-even 30.3%.
  - **B4 · reveal:** două continuări sub văl. Una ține până la 103.00, cealaltă revine în range. A doua pregătește 2.8.8.
  - **B5 · match:** filtru ↔ de ce ajută:
    - două atingeri: nivelul contează;
    - închiderea, nu fitilul: mai puține fakeout-uri;
    - volumul: participare;
    - fără breakout după o mișcare lungă.
- **Try:**
  - **Widget:** level-drawer (L06), apoi bracket-builder.
  - **Obiectiv:** "Draw the range, then plan the breakout: entry on the close above it, stop under the breakout candle, target the measured move. Size for 1%."
  - **Reușită:**
    - nivel 100.00 ± 0.05;
    - stop 99.20;
    - target 103.00;
    - **95 de unități**: 99.73 la risc; 96 ar pierde 100.78. Valoarea poziției: 9,514.25.
- **Practică:** Arena: Breakout și Arena: False breakout, cu aceleași reguli, comparate. Tranziții R2 → R1 în Regime lab. Reluarea M10 No Trade Is a Trade.
- **Check:**
  1. regulile complete;
  2. break-even-ul după costuri;
  3. condițiile în care breakout-ul eșuează.
- **Dovezi:** C/D (nivel S/R), B (Donchian), R6 §2.2.1, §2.2.4. Calculul break-even-ului e Mechanic.
- **Necesită:** S3 (nivel desenat), S1 (stop de intrare)
- **Termeni noi de glosar:** — (folosește breakout ✓; measured move vine din 2.2)

#### 2.8.5 · Volatility contraction breakout
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Spot a volatility contraction: an NR7 candle, an inside bar or a Bollinger squeeze
  2. Place an OCO bracket around the contraction and size each side to 1%
  3. Explain why tight compressions raise the cost in R and why both sides can lose
- **Concepte:** volatility-contraction-breakout (nou), volatility ✓, bracket-order ✓, slippage ✓, gap-risk ✓
- **Se sprijină pe:** 2.8.4, 2.4 (ATR, Bollinger și squeeze; L16), 2.6 (inside bars), 1.3 (OCO, stop de intrare)
- **Fișa strategiei:**
  - **Setup:** una dintre:
    - NR7: cea mai îngustă lumânare (high − low) din ultimele 7;
    - un inside bar;
    - lățimea benzilor Bollinger la minimul ultimelor 6 luni.
  - **Intrare:** un bracket OCO: buy stop deasupra maximului, sell stop sub minim. Când se execută unul, celălalt se anulează.
  - **Stop:** pe partea opusă a comprimării.
  - **Ieșire:** o țintă de 1–3R, trailing, sau time stop după 2–5 lumânări.
  - **Regim:** treceri R3 de la volatilitate mică la mare; R2 → R1. Eșuează:
    - când comprimarea se rezolvă lateral și se declanșează ambele părți;
    - la gap-uri dincolo de bracket.
  - **Costuri:**
    - stopul e scurt, deci costul în R e mare: un stop de 1.00 la ≈ 100 costă 0.20R;
    - un whipsaw pe ambele părți înseamnă două pierderi;
    - slippage pe stop-uri.
  - **Notă:**
    - **C**: profitabilitatea direcțională e slabă după costuri;
    - **A** pentru clustering-ul volatilității (persistență de tip GARCH).
    - Sursă: R6 §2.2.3.
- **Hook:**
  - **Tip:** predict, în doi pași: mărimea, apoi direcția.
  - **Prompt:** "LABX's last 7 candles had ranges of 1.10, 0.95, 1.30, 1.20, 1.05, 1.15 and 0.90. Over the next 5 candles, will ranges be bigger, smaller or about the same? And which way will price go?"
  - **Răspuns:**
    - mărimea: mai mari e pariul mai bun, pentru că volatilitatea vine în valuri (A);
    - direcția: „Can't tell”, nu există edge direcțional (C).
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · hotspot:** „Tap the NR7 candle” pe un grafic de 12 lumânări.
  - **B3 · figure:** bracket-ul OCO:
    - lumânarea NR7: H 100.60, L 99.70;
    - buy stop 100.65, sell stop 99.65;
    - stopul fiecărei părți e pe partea opusă, la distanța 1.00.
  - **B4 · worked:**
    - costul în R: 0.20 ÷ 1.00 = 0.20R;
    - dimensiunea pentru 100.00: **90 de unități** pe partea long (99.02; 91 ar pierde 100.12) și tot 90 pe partea short (99.02).
  - **B5 · reveal:** trei deznodăminte:
    - expansiune în sus;
    - expansiune în jos;
    - lateral, cu ambele părți declanșate: −99.02 de două ori, ≈ −2%.
  - **B6 · predict** de calibrare: „Chance of a range expansion within 5 candles?” (slider). Apoi se arată adevărul generatorului.
- **Try:**
  - **Widget:** bracket-builder cu OCO (S1).
  - **Obiectiv:** "Place both entries 0.05 beyond the NR7 candle, stops on the opposite side, and size each side to at most 1%."
  - **Reușită:**
    - buy stop 100.65 și sell stop 99.65;
    - stop long 99.65 și stop short 100.65;
    - 90 de unități pe fiecare parte.
- **Practică:** R3 cu Markov vol-switching (exercițiul din R6 §2.2.3), cu scor de calibrare. Arena: Low volatility, apoi Breakout.
- **Check:**
  1. recunoașterea comprimării;
  2. mecanica OCO;
  3. de ce rezolvarea laterală costează de două ori.
- **Dovezi:** C (strategia), A (clustering-ul volatilității), Mechanic (costul în R). Sursă: R6 §2.2.3.
- **Necesită:** S1 (OCO, stop de intrare), S2 (lățimea Bollinger, marcaj NR7), S13
- **Termeni noi de glosar:** volatility-contraction (nr7 vine din 2.6)

#### 2.8.6 · Range trading
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Confirm a range before trading it: two touches on each side and flat averages
  2. Plan a range trade with a stop outside the edge and a target near the other side
  3. Apply the flip rule: stop range trading on the first confirmed close outside the range
- **Concepte:** range-trading (nou), range ✓, support-and-resistance ✓, limit-order ✓, false-breakout ✓
- **Se sprijină pe:** 2.8.4, 1.5, 2.3 (ADX), 2.5 (zone), L06
- **Fișa strategiei:**
  - **Setup:** cel puțin 2 atingeri pe fiecare margine, medii plate, ADX < 20.
  - **Intrare:** cumperi lângă suport (ordin limit sau lumânare de reversal); short lângă rezistență, în oglindă.
  - **Stop:** imediat în afara marginii. În exemplu, 0.60 sub suport.
  - **Ieșire:** lângă marginea opusă sau la mijloc. Totul se închide la o închidere confirmată în afara range-ului, iar utilizatorul trece la cardul de breakout.
  - **Regim:** R2. Eșuează:
    - la breakout, unde apar cele mai mari pierderi;
    - la gap-uri prin margine.
  - **Costuri:** țintele mici fac costurile mari, proporțional; multe trade-uri.
  - **Notă:** **C**. Mean reversion există în unele instrumente și orizonturi, dar depinde de regim (R6 §2.5).
- **Hook:**
  - **Tip:** predict, cu alegere între patru rapoarte R:R.
  - **Prompt:** "Same 97.00–100.00 range. Buy at 97.30, stop 96.40, target 99.70. What is the reward-to-risk before costs, and after 0.20 per unit?"
  - **Răspuns:**
    - înainte de costuri: 2.40 ÷ 0.90 = 2.67 : 1;
    - după costuri: 2.20 ÷ 1.10 = 2.0 : 1;
    - break-even-ul urcă de la 27.3% la 33.3%.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** range-ul, cu atingerile lui.
  - **B3 · worked:** **100 de unități** la 97.30 / 96.40 pierd 99.69; 101 ar pierde 100.69.
  - **B4 · reveal:** range-ul se rupe la c41, cu o închidere la 100.40. Pe ecran apare regula de flip.
  - **B5 · order:** regulile range-ului, în ordine:
    1. confirmi;
    2. intri la margine;
    3. pui stopul afară;
    4. ieși la cealaltă margine;
    5. la ruptură, oprești și treci la cardul de breakout.
  - **B6 · predict:** „A gap opens below your stop at 95.80. How many R?” Răspunsul: 100 × 1.50 + 4.87 + 4.79 = 159.66, adică ≈ 1.6R.
- **Try:**
  - **Lab:** `range-to-break` (nou; exercițiul din R6 §2.5). Un range R2 care se rupe în R1 la un moment aleatoriu.
  - **Obiectiv:** "Trade the range with your card. Stop range trading when it breaks."
  - **Reușită:**
    - fiecare trade riscă ≤ 1%;
    - niciun trade de range nou după prima închidere confirmată în afară (regula de flip respectată).
  - Diagnostic: P&L-ul din range minus pierderea de la ruptură.
- **Practică:** Arena: Sideways market; Arena: Breakout, ca să simtă ruptura.
- **Check:**
  1. confirmarea range-ului;
  2. costurile la ținte mici;
  3. regula de flip.
- **Dovezi:** C (R6 §2.5). Calculul R:R după costuri e Mechanic.
- **Necesită:** S2 (ADX), S13
- **Termeni noi de glosar:** range-trading

#### 2.8.7 · Mean reversion
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Describe two mean-reversion rules: Bollinger reversion and RSI(2)
  2. Explain why a high win rate can hide a negative expectancy (negative skew)
  3. Keep a catastrophic stop on every mean-reversion trade
- **Concepte:** mean-reversion (nou), return-skew (nou), expectancy ✓, volatility ✓, gap-risk ✓
- **Se sprijină pe:** 2.8.6, 2.4 (RSI, Bollinger), L11, L18 (seriile)
- **Fișa strategiei** (două variante):
  - **Bollinger reversion:**
    - **Setup:** R2, SMA 20 plată, benzi care nu se lărgesc, ADX mic.
    - **Intrare:** o închidere sub banda de jos (%b < 0). Opțional, aștepți o închidere înapoi în bandă.
    - **Stop:** un multiplu de ATR dincolo de intrare, sau un time stop.
    - **Ieșire:** banda de mijloc.
  - **RSI(2)** (Connors & Alvarez 2008):
    - **Setup:** închidere peste SMA 200 și RSI(2) < 10.
    - **Intrare:** la închidere sau la deschiderea următoare.
    - **Ieșire:** o închidere peste SMA 5.
    - **Stop:** Connors a raportat că stop-urile îi strică rezultatele în teste. În curs, stopul catastrofal (de exemplu 3 × ATR) e obligatoriu, după principiul 1.
  - **Regim:** R2 (Bollinger); pullback-uri scurte într-un R1 ascendent (RSI(2)). Eșuează:
    - în trend, unde prețul „merge pe bandă”;
    - în crash-uri, unde oversold devine și mai oversold;
    - la gap-uri.
  - **Costuri:**
    - win rate de 65–75% în backtest-uri;
    - câștiguri mici, pierderi rare și mari (skew negativ);
    - turnover moderat;
    - ținte mici, deci costuri mari, relativ.
  - **Notă:**
    - **C** pentru Bollinger: Lento et al. (2007) nu găsesc un avantaj constant față de buy-and-hold, iar ≈ 88% din prețuri stau în benzi, nu 95%;
    - **C/B** pentru RSI(2): backtest-uri de practicieni pe indici americani, dependente de perioadă.
    - Surse: R6 §2.4.1–2.4.2.
- **Hook:**
  - **Tip:** predict, cu alegere între „Made money”, „Lost money” și „Can't tell”.
  - **Prompt:** "A mean-reversion rule won 15 of its last 20 trades at +0.5R each. Four losses were −1R; one gap loss was −5R. Did it make money?"
  - **Răspuns:** 15 × 0.5 − 4 − 5 = −1.5R, cu un win rate de 75%.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** aceeași regulă pe R2 (merge) și pe R1 descendent (patru cumpărări la rând sub banda de jos).
  - **B3 · worked** cu input: −1.5R.
  - **B4 · figure** (ST-02): histograma R pentru trend following (skew pozitiv) și pentru mean reversion (skew negativ).
  - **B5 · predict:** „With or without a catastrophic stop: which has the worse worst trade in a crash?” Răspunsul: fără.
- **Try:**
  - **Widget:** expectancy.
  - **Valori de start:** win rate 75% (blocat), average win 0.5R (blocat).
  - **Obiectiv:** "Find the average loss at which this rule breaks even."
  - **Reușită:** 1.5R (0.75 × 0.5 = 0.25 × 1.5).
  - **Feedback corect:** "Right. In the hook, the average loss was (4 + 5) ÷ 5 = 1.8R, past break-even. One gap did that."
- **Practică:** episoade mixte, cu un gap de tip event shock (exercițiul din R6 §2.4.1). RSI(2) rulează cu și fără stop catastrofal; scor pe cel mai prost trade și pe max drawdown; reflecția „Is a high win rate good?”. Arena: Sideways market și Bearish market.
- **Check:**
  1. regulile;
  2. skew-ul și win rate-ul mare;
  3. stopul catastrofal.
- **Dovezi:** C, C/B (R6 §2.4.1–2.4.2). Calculul expectancy-ului e Mechanic.
- **Necesită:** S2 (RSI, Bollinger, SMA 5 și 200), S13
- **Termeni noi de glosar:** mean-reversion, negative-skew

#### 2.8.8 · Failed breakout
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Define a failed-breakout trade (Turtle Soup) with exact entry and stop rules
  2. Explain why it mirrors the breakout strategy and when each one fits
  3. Choose breakout, fade or no trade from the regime evidence, not from the last result
- **Concepte:** failed-breakout-strategy (nou), false-breakout ✓, range-breakout-strategy (2.8.4), market-regime (2.8.1)
- **Se sprijină pe:** 2.8.4, 2.8.6, 1.5 (L06), 2.6 (traps)
- **Fișa strategiei:**
  - **Setup:**
    - un nou maxim (minim) pe 20 de lumânări, iar maximul anterior pe 20 de lumânări e cu cel puțin 4 lumânări înainte;
    - prețul trece dincolo, apoi revine în range.
  - **Intrare:**
    - un sell stop puțin sub vechiul maxim (99.90, sub 100.00), valabil doar pe lumânarea curentă;
    - varianta „plus one”: valabil pe lumânarea următoare.
  - **Stop:** imediat peste noul extrem (100.80, peste maximul de 100.70).
  - **Ieșire:** marginea opusă a range-ului (97.60), sau o ieșire parțială la mijloc și trailing.
  - **Regim:** R2, după epuizare. Eșuează în breakout-urile reale (R1).
  - **Costuri:** un stop de ≈ 0.90 costă ≈ 0.22R; frecvența e mică.
  - **Notă:** **C** (R6 §2.7.3). Pointer de un rând: „liquidity sweep” din SMC e aceeași idee, redenumită (Mai departe: 3.1, 3.5).
- **Hook:**
  - **Tip:** predict, cu alegere între „Only A”, „Only B”, „Both, in different regimes” și „Neither”.
  - **Prompt:** "Same 97.00–100.00 range. Price spikes to 100.70, then closes at 99.80. Trader A bought the breakout at 100.15. Trader B sells the failure at 99.90. Can both rules be right over 100 trades?"
  - **Răspuns:** „Both, in different regimes”. Pe R0 amândouă pierd cât costurile.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · reveal:** graficul din 2.8.4, sub văl: spike până la 100.70, apoi revenire la 99.80.
  - **B3 · worked** cu input:
    - sell stop 99.90, stop 100.80 (0.90), target 97.60 (2.30);
    - brut 2.56 : 1;
    - după costuri, 2.10 ÷ 1.10, cu break-even 34.4%;
    - **99 de unități**: 99.04; 100 ar pierde 100.04.
  - **B4 · match:** semn ↔ breakout sau fade:
    - închidere înapoi în range, volum mic pe împingere, revenire rapidă → fade;
    - două închideri în afară, cu volum → breakout.
  - **B5 · predict:** „On a random walk, which rule wins?” Răspunsul: niciuna; costurile pierd.
- **Try:**
  - **Widget:** `breakout-or-fakeout` (nou; exercițiul din R6 §2.7.3). 10 cazuri din generatorul cu regim ascuns. Pe fiecare: Breakout / Fade / Pass.
  - **Reușită:**
    - cel puțin 6 alegeri din 10 consecvente cu semnele de regim de pe card (aplicația verifică regula, nu rezultatul);
    - „Pass” pe cazurile R0.
- **Practică:** Arena: False breakout în paralel cu Arena: Breakout; Regime lab.
- **Check:**
  1. regulile;
  2. relația de oglindă cu breakout-ul;
  3. alegerea după semne, nu după ultimul rezultat.
- **Dovezi:** C (R6 §2.7.3).
- **Necesită:** S1 (stop de intrare cu time in force de o lumânare), S7, S13
- **Termeni noi de glosar:** turtle-soup

#### 2.8.9 · Confluence versus redundancy
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Tell independent evidence from the same evidence counted several times
  2. Group indicators by the input they are built from
  3. Explain why every extra filter shrinks the sample you can judge
- **Concepte:** indicator-redundancy (nou), confluence (din 2.5), confirmation-bias ✓, base-rates ✓, correlation-and-concentration ✓ (aceeași matematică, reluată în 2.11.3)
- **Se sprijină pe:** 2.8.1–2.8.8, 2.3, 2.4, 2.5
- **Hook:**
  - **Tip:** predict, slider 1–5.
  - **Prompt:** "A setup shows five green lights: RSI, Stochastic, CCI, Williams %R and ROC all say 'oversold'. How many independent pieces of evidence is that?"
  - **Răspuns:** în jur de 1. Toate sunt calculate din aceleași prețuri.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · match:** indicator ↔ intrarea din care e construit:
    - doar închideri: RSI, ROC, MACD, MA;
    - range high–low: ATR, Stochastic, Williams %R;
    - volum: OBV, VWAP;
    - structură: swing-uri, niveluri;
    - timp: sesiunea.
  - **B3 · figure:** heatmap-ul de corelație al celor 5 oscilatori pe LABX (generatorul dă ρ ≈ 0.85–0.95).
  - **B4 · worked** cu input: numărul efectiv de semnale = 5 ÷ (1 + 4 × 0.9) = 1.09. E aceeași formulă ca în 2.11.3.
  - **B5 · figure:** filtrele și eșantionul. Cifre-țintă pentru seed:
    - fără filtre: 120 de trade-uri;
    - plus filtrul de trend: 64;
    - plus nivelul: 31;
    - plus volumul: 18.
    - Jumătatea intervalului de încredere pentru expectancy (sd 1.7R) crește de la ±0.30R la ±0.42R, ±0.60R și ±0.79R.
  - **B6 · callout:** confluența înseamnă familii independente (trend, locație, participare), nu cinci oscilatori.
- **Try:**
  - **Lab:** `confluence-builder` (nou). Setup-ul de pullback, plus până la 3 filtre dintr-o listă. Aplicația arată numărul de trade-uri și expectancy-ul cu interval, pe eșantionul inițial și pe unul nou.
  - **Reușită:**
    - filtre din cel puțin 2 familii diferite de intrare;
    - niciun filtru dublat din aceeași familie;
    - cel puțin 30 de trade-uri pe eșantionul nou.
- **Practică:** strategy-lab, cu cardul propriu, pe R1 / R2. Rezultatul pe eșantionul inițial se compară cu cel pe un eșantion nou (Mai departe: overfitting, 3.11).
- **Check:**
  1. redundant vs independent;
  2. familiile de intrare;
  3. filtrele vs mărimea eșantionului.
- **Dovezi:**
  - **Mechanic:** indicatorii din aceeași intrare sunt corelați prin construcție; formula numărului efectiv de semnale e matematică standard de portofoliu (R5 PR-02 [BK]).
  - **C** pentru afirmațiile de confluență.
  - R1 §3.3 („indicator soup”) și data snooping (Sullivan, Timmermann & White 1999 [PK], R6 §1.7).
- **Necesită:** S2 (toți oscilatorii), S13
- **Termeni noi de glosar:** indicator-redundancy (confluence vine din 2.5)

#### 2.8.10 · Judging a strategy after costs
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Convert a strategy's gross edge into a net edge per trade with spread, commission and slippage
  2. Compare the net result with the passive benchmark and with the same rule on a random walk
  3. Decide what sample size you need before trusting the result
- **Concepte:** after-cost-evaluation (nou), trading-costs ✓, slippage ✓, expectancy ✓, base-rates ✓, passive-benchmark (din 0.1), random-walk (din 0.2), sample-size (din 0.2), costs-in-r (din 1.4)
- **Se sprijină pe:** 2.8.1–2.8.9, 1.4.6 (costurile în R), 0.1 (benchmark-ul pasiv), 0.2 (mărimea eșantionului)
- **Hook:**
  - **Tip:** predict, cu alegere între „Positive”, „About zero” și „Negative”.
  - **Prompt:** "A backtest shows +0.12R per trade over 200 trades. The stop is 1.00 on LABX near 100.00, and round-trip costs are about 0.20 per unit. After costs, is the edge positive?"
  - **Răspuns:** negativ.
    - Costul e 0.20R, deci 0.12 − 0.20 = −0.08R pe trade.
    - Pe 200 de trade-uri, −16R.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · worked** cu input: costul în R = 0.20 ÷ 1.00, apoi rezultatul net pe trade și pe 200 de trade-uri.
  - **B3 · figure:** bare pentru brut, net, benchmark ghost și aceeași regulă pe R0.
  - **B4 · explain:** cazul real ORB (R6 §2.2.2):
    - paper-ul raportează un câștig mare;
    - o replicare independentă găsește edge-ul brut (NQ: +0.13R), dar după spread și slippage niciun indice nu se distinge de zero, iar 4 din 5 sunt negativi.
    - Plus regula de prudență McLean & Pontiff (README §6).
  - **B5 · order:** pașii evaluării:
    1. brut;
    2. net (costuri și slippage);
    3. față de ghost;
    4. față de R0;
    5. eșantion și interval;
    6. decizia: mai testezi sau renunți.
  - **B6 · predict:** „Which stop halves the cost in R?” Răspunsul: 2.00 (0.10R). Plus avertismentul că edge-ul brut în R se schimbă și el.
- **Try:**
  - **Widget:** `cost-lab` (nou; exercițiul din R6 §5.1, S13 și S15).
  - **Date:** cele 50 de trade-uri de exemplu (sau ultimele 50 ale utilizatorului): 18 câștiguri de +2.0R brut, 32 de pierderi de −1R, stop mediu 1.25, deci un cost de 0.16R pe trade. Se reiau la cost zero, la cost retail și la cost stresat (spread dublu plus 0.05 slippage pe fiecare execuție).
  - **Reușită:**
    - expectancy-ul net la cost retail: −0.08R ± 0.01 (brut +0.08R);
    - break-even-ul după costuri: 38.7% ± 0.5 (înainte de costuri, 33.3%).
  - Stresat: −0.24R.
- **Practică:** „strategy evaluation card” pentru cele 2 setup-uri care vor intra în playbook (2.13.2): brut, net, ghost, R0, n și interval.
- **Check:**
  1. de la brut la net;
  2. benchmark-ul și controlul R0;
  3. mărimea eșantionului.
- **Dovezi:**
  - **Mechanic** pentru costuri;
  - **C** pentru ORB (working paper vs replicare, R6 §2.2.2);
  - **B** pentru scăderea edge-urilor după publicare (McLean & Pontiff 2016; README §6).
- **Necesită:** S13, S15, S7
- **Termeni noi de glosar:** after-cost-expectancy
- Mai departe: 3.11 (backtesting complet).

---

## Unitatea 2.9 · Sessions, time and intraday (8 lecții)

**Scop:**
- *Când* tranzacționezi:
  - orele piețelor și fusurile orare, cu săptămânile DST nealiniate;
  - sesiunile FX;
  - ritmul zilei;
  - două strategii intraday (opening range și gap-uri), fiecare cu fișa ei.
- Alegerea stilului (day sau swing) din costuri și din viața utilizatorului.
- Zidul costurilor la scalping.
- Riscul de weekend, de sărbători și de rollover.

**De ce aici:**
- Strategiile din 2.8 au nevoie de context de timp.
- ORB și gap-urile au cel mai dur profil de costuri.
- Ordinea urmează R6 §7, Stage 3 (day trading, sesiuni, ORB, gap-uri) și R3 §8.
- Unitatea pregătește 2.10, unde ora exactă a publicării contează.

**Se sprijină pe:**
- 1.1: costuri, round trip;
- 1.3: ordine stop, slippage și gap-uri;
- 1.4: sizing, limite zilnice;
- 2.4: ATR, L16;
- 2.5: VWAP, tipurile de gap;
- 2.8.

**Checkpoint:** 10 întrebări:
- conversii de oră cu DST;
- cost drag;
- ORB după costuri;
- gap fill pe random walk;
- alegerea stilului.

Plus o sarcină: utilizatorul convertește 4 ore de evenimente în ora României, într-o săptămână nealiniată. La ≥ 80%, lecțiile se marchează „Tested out”.

**Laboratorul unității: A trading month** (exercițiul din R6 §1.3, scurtat):
- 10 zile intraday sintetice (R6), cu plan scris, limită zilnică și oră fixă de închidere a pozițiilor.
- Aceeași perioadă se joacă apoi și ca swing, pe lumânări zilnice.
- Scorul:
  - aderența;
  - încălcările limitei (o încălcare închide ziua automat);
  - costurile plătite, în R;
  - calitatea jurnalului de după sesiune.
- Net R-ul și ghost-ul sunt doar diagnostic.

**Firele spiralei:**
- Costuri: firul de Nivel 2, costul pe stil și scalping-ul;
- Risc: gap-ul de weekend, limita zilnică;
- Dovezi: ORB e C; gap fill e în bună parte rată de bază;
- Proces: fereastra de tranzacționare intră în plan.

**Surse:**
- R3 §3.1–3.9, §3.13;
- R6 §1.1–1.4, §2.2.2, §2.8, §3.2, §5.1, §6.1;
- R4 §1.7, §1.10;
- R5 RF-20, RF-21, PR-12, RR-02, RR-03.

#### 2.9.1 · Market hours and time zones
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Say when the main markets are open, in New York time and in Romanian time
  2. Convert an event time across time zones, including the weeks when US and EU clocks change on different dates
  3. Explain why a 24-hour market is not equally liquid all day
- **Concepte:** market-hours (nou), timeframe ✓, gap-risk ✓
- **Se sprijină pe:** 1.2 (timeframe-uri), 1.3 (gap-uri), 2.8.1
- **Hook:**
  - **Tip:** predict, alegere multiplă.
  - **Prompt:** "It's 15:00 in Bucharest on a Wednesday in July. Which are open right now: US stocks (regular session), London stocks, spot FX, crypto?"
  - **Răspuns:**
    - London: 08:00–16:30 UK, adică 10:00–18:30 în București;
    - FX și crypto: deschise;
    - acțiunile americane: sesiunea regulată deschide la 16:30 în București (09:30 ET). Pre-market-ul e deschis de la 11:00 (04:00 ET).
- **Interacțiunea centrală:**
  - **B1 · explain:** fiecare piață are o sesiune principală. Acolo e lichiditatea.
  - **B2 · figure:** banda cu ceasul lumii (S5), cu sesiunile colorate.
  - **B3 · match:** clasa de active ↔ orele ei (R3 §3.1, cu ora României):
    - acțiuni SUA: 09:30–16:00 ET (16:30–23:00);
    - LSE: 08:00–16:30 UK (10:00–18:30);
    - FX spot: duminică 17:00 – vineri 17:00 ET;
    - futures pe indici SUA: duminică 18:00 – vineri 17:00 ET, cu pauză zilnică 17:00–18:00 ET;
    - crypto: 24/7.
  - **B4 · predict:** "Between 25 October and 1 November 2026, what time does the US stock market open in Bucharest?" Răspunsul: 15:30, nu 16:30.
    - UE a revenit la ora de iarnă pe 25 octombrie, SUA abia pe 1 noiembrie 2026.
    - În martie, fereastra e 8–29 martie 2026.
  - **B5 · callout:** platformele de FX arată adesea ora serverului (GMT+2 sau GMT+3), nu ora ta (R4 §1.7 [BK]).
  - **B6 · explain:** o piață „24 de ore” nu e la fel de lichidă toată ziua (R3 §3.1).
- **Try:**
  - **Widget:** `clock-converter` (nou).
  - **Obiectiv:** utilizatorul convertește 5 ore de pe vineri, 30 octombrie 2026, în ora României.
  - **Reușită:** toate corecte (verificat cu baza de fusuri orare):

    | Eveniment | Ora locală | București |
    |---|---|---|
    | US open | 09:30 ET | 15:30 |
    | London open | 08:00 UK | 10:00 |
    | o publicare sintetică de tip NFP | 08:30 ET | 14:30 |
    | o decizie de tip BCE | 14:15 CET | 15:15 |
    | rollover-ul FX | 17:00 ET | 23:00 |

- **Practică:** ceasul S5 activ în simulator, cu banda de sesiuni în toate sesiunile Arena; capcana de fus orar din R4 §1.7.
- **Check:**
  1. ce piață e deschisă la o oră dată din București;
  2. o conversie în săptămâna nealiniată;
  3. ora serverului și lichiditatea „24h”.
- **Dovezi:**
  - **Mechanic:** orele și regulile DST. SUA trece la ora de vară în a doua duminică din martie și revine în prima duminică din noiembrie; UE, în ultima duminică din martie și ultima din octombrie.
  - Orele exacte ale burselor sunt [BK]; de verificat pe site-ul fiecărei burse (R3 §3.1).
- **Necesită:** S5
- **Termeni noi de glosar:** trading-session, daylight-saving-time, server-time

#### 2.9.2 · FX sessions and overlaps
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Name the four FX sessions and the London–New York overlap, in Romanian time
  2. Explain why activity, volatility and spreads change with the session
  3. Choose trading hours from movement per unit of cost, not from session folklore
- **Concepte:** fx-sessions (nou), volatility ✓, bid-ask-spread ✓, market-hours (2.9.1)
- **Se sprijină pe:** 2.9.1, 1.1 (spread), 2.4 (ATR)
- **Hook:**
  - **Tip:** predict, cu 4 variante.
  - **Prompt:** "On a synthetic FX pair, in which 4-hour window does price move the most on average: the Asian session, the London morning, the London–New York overlap, or the New York afternoon?"
  - **Răspuns:** overlap-ul, 15:00–19:00 în București, tot anul, mai puțin săptămânile nealiniate.
- **Interacțiunea centrală:**
  - **B1 · explain:** sesiunile, în ora New York-ului (R6 §3.2):
    - Sydney ≈ 17:00–02:00;
    - Tokyo ≈ 19:00–04:00;
    - London ≈ 03:00–12:00;
    - New York ≈ 08:00–17:00.
    - Overlap-ul London–New York e 08:00–12:00 ET.
  - **B2 · figure:** profilul de volatilitate pe 24 de ore, cu sesiunile umbrite. Generatorul e calibrat pe forma de U din interiorul sesiunilor Tokyo și London (Ito & Hashimoto).
  - **B3 · hotspot:** „Tap the overlap.”
  - **B4 · match:** pereche ↔ sesiunea activă: vUSD/vJPY în Asia și London; vEUR/vUSD în London și în overlap.
  - **B5 · worked:** spread-ul de 0.8 pipși în overlap față de 1.6 pipși noaptea, pe o țintă de 10 pipși: 8%, respectiv 16% din țintă (cost drag; R6 §5.1).
  - **B6 · callout:** „London sets the day's high” e folclor. „Killzones” (ICT) sunt doar ferestre de volatilitate la deschideri, fără edge direcțional dovedit (R3 §3.13; Mai departe: 3.5).
- **Try:**
  - **Widget:** `session-picker` (nou; exercițiul din R6 §3.2). 20 de zile FX sintetice. Utilizatorul alege o fereastră de 4 ore pentru o regulă de breakout; aplicația arată pipșii neți după spread, pe fereastră.
  - **Reușită:** fereastra aleasă are cel mai mare raport ATR ÷ spread (mișcare pe unitate de cost) dintre cele patru.
- **Practică:** o zi FX de tip R6, cu volatilitate pe sesiuni (S10). În Arena, cu vEUR/vUSD, când există S10.
- **Check:**
  1. ora overlap-ului în București;
  2. de ce spread-ul și volatilitatea variază pe sesiuni;
  3. afirmația despre killzones, față de dovezi.
- **Dovezi:**
  - **A:** activitatea și volatilitatea se adună la deschideri și în overlap-uri, cu U în interiorul sesiunilor Tokyo și London; mai multe tranzacții înseamnă spread-uri mai mici (Ito & Hashimoto; R3 §3.2 [EMP+]).
  - **B:** peste 50% din volum implică London și New York (R6 §3.2); UK are 38% din volumul global (BIS 2025, R3 §3.2).
  - **D:** „rolurile” direcționale ale sesiunilor (R3 §3.13).
- **Necesită:** S5, S10 (perechea FX), spread pe oră în generator
- **Termeni noi de glosar:** session-overlap

#### 2.9.3 · The intraday rhythm
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Describe the U-shaped pattern of intraday volume and volatility
  2. Match the stop distance to the volatility of the hour, not to a fixed number
  3. Explain why quiet hours raise the cost of a trade in R
- **Concepte:** intraday-cycle (nou), volatility ✓, position-sizing ✓, exposure ✓, slippage ✓
- **Se sprijină pe:** 2.9.1, 2.4 (ATR; L16), L12 (plafonul de expunere)
- **Hook:**
  - **Tip:** predict, cu alegere între „At the open”, „At midday” și „Both”.
  - **Prompt:** "Your stop is 0.40 below entry. In the first 30 minutes LABX's 5-minute ATR is 0.60; at midday it is 0.20. When is the stop inside the noise?"
  - **Răspuns:** la deschidere.
- **Interacțiunea centrală:**
  - **B1 · explain:** la acțiuni, volumul și volatilitatea sunt cele mai mari la deschidere și la închidere și cele mai mici la mijlocul zilei. La FX, forma de U apare în interiorul sesiunilor.
  - **B2 · figure:** curba sintetică de volum și de ATR, pe ferestre de 30 de minute.
  - **B3 · explain:** licitațiile de deschidere și de închidere sunt încrucișări la un singur preț. Prețul de închidere e reperul fondurilor pe indici. NYSE avea ≈ 34% din volum în licitații în 2019 (R3 §3.4).
  - **B4 · worked** cu input, cu stopul = 2 × ATR(5m):
    - **la deschidere:** stop 1.20 → **76 de unități** (98.76; 77 ar pierde 100.06); costul: 0.20 ÷ 1.20 = 0.17R;
    - **la prânz:** stop 0.40 → după risc ar fi 200 de unități (99.96), dar fără levier plafonul la 100.00 e de **100 de unități**. Riscul real e doar 49.98 (0.5%), iar costul e 0.20 ÷ 0.40 = 0.50R.
  - **B5 · predict:** „Where do most of your stop-outs happen?” Răspunsul vine din jurnalul propriu (S15): rata de stop-out pe oră.
  - **B6 · callout:** plafonul te oprește să riști mai mult. Nu-l „umple” cu levier (Mai departe în unitate: 2.14.6).
- **Try:**
  - **Widget:** position-size, cu trei ferestre: deschiderea (ATR 0.60), prânzul (ATR 0.20), închiderea (ATR 0.45).
  - **Obiectiv:** "Set each stop at 2 × the window's ATR and size for at most 1%."
  - **Reușită:**
    - stopuri 1.20 / 0.40 / 0.90;
    - unități 76 / 100 (plafonul) / 100 (după risc, 99.96; 101 ar pierde 100.96).
- **Practică:** zile intraday R6; în jurnal, rata de stop-out pe oră.
- **Check:**
  1. forma de U;
  2. stopul potrivit volatilității orei;
  3. de ce orele liniștite urcă costul în R (și plafonul).
- **Dovezi:**
  - **A:** forma de U la acțiuni e bine documentată (R3 §3.3 [EMP+] [BK]);
  - **Mechanic:** licitațiile și costul în R;
  - cifra NYSE de 34% e pentru 2019 (R3 §3.4).
- **Necesită:** S5, S4 (lumânări de 5 minute; azi S4 cere minimum 15m), S2 (ATR), S15
- **Termeni noi de glosar:** opening-auction, closing-auction

#### 2.9.4 · The opening range
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Define the opening range and the rules of an opening range breakout
  2. Show how costs and slippage at the open decide whether a small edge survives
  3. Filter out the days on which the opening range breakout tends to fail
- **Concepte:** opening-range-breakout (nou), breakout ✓, slippage ✓, intraday-cycle (2.9.3), after-cost-evaluation (2.8.10)
- **Se sprijină pe:** 2.9.3, 2.8.4, 2.8.10, 1.3 (ordin stop)
- **Fișa strategiei:**
  - **Setup:**
    - maximul și minimul primelor N minute (5, 15, 30 sau 60) ale sesiunii principale, cu N fixat dinainte;
    - filtru: o zi cu catalizator („in play”, volum relativ neobișnuit de mare) și un opening range care nu e uriaș față de ATR-ul zilnic.
  - **Intrare:** un ordin stop puțin peste maximul range-ului (long) sau sub minim (short). În varianta Zarattini, doar în direcția primei lumânări de 5 minute.
  - **Stop:** cealaltă margine a range-ului. În paper, o fracțiune din ATR-ul zilnic: 10% din ATR(14) [PK, de verificat].
  - **Ieșire:** la sfârșitul zilei, sau la o țintă.
  - **Regim:** zile de trend și zile cu catalizator (R6 cu catalizator, R4). Eșuează:
    - în zilele de range (false break-uri);
    - cu volum relativ mic;
    - când opening range-ul e prea mare.
  - **Costuri:**
    - spread-ul și slippage-ul sunt maxime la deschidere;
    - ordinele stop se execută prost în piața rapidă;
    - edge-ul brut, ≈ 0.1R, e cam cât un round trip.
  - **Notă:** **C** (R6 §2.2.2; R3 §3.5):
    - Zarattini, Barbon & Aziz (2024) raportează peste 1,600% net în 2016–2023 pe „stocks in play”. E un working paper, fără perioadă out-of-sample și fără peer review.
    - O replicare independentă pe CFD-uri pe indici (2015 – mijlocul lui 2026) regăsește edge-ul brut (NQ: +0.13R, 23% câștiguri). După spread și slippage, niciun indice nu se distinge de zero, iar 4 din 5 sunt negativi.
    - Crabel (1990) a popularizat metoda [PK].
- **Hook:**
  - **Tip:** predict, slider −0.20R … +0.20R.
  - **Prompt:** "In a replication, the opening range breakout made about +0.13R per trade before costs. A round trip costs about 0.10R, and stop orders at the open slip. What's left per trade?"
  - **Răspuns:**
    - ≈ +0.03R înainte de slippage;
    - cu slippage, în jur de zero sau sub. Replicarea n-a găsit nimic distinct de zero.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** caseta OR pe lumânări de 5 minute:
    - LABX deschide la 100.00;
    - OR-ul de 15 minute e 99.60–100.40 (0.80);
    - ATR(14) zilnic e 2.00, deci OR-ul e 40% din ATR.
  - **B3 · worked:**
    - intrare 100.45, stop 99.55 (0.90) → **99 de unități** (99.01; 100 ar pierde 100.01). Valoarea: 9,944.55;
    - costul: 0.20 ÷ 0.90 = 0.22R;
    - cu stopul la 10% din ATR (0.20), costul ar fi 1.0R. Cu costurile LABX, varianta din paper nu are nicio șansă.
  - **B4 · reveal:** trei zile: o zi de trend (merge), o zi de range (false break pe ambele părți), o zi cu știre.
  - **B5 · match:** filtru ↔ ce elimină.
  - **B6 · callout:** „The pattern is real. Whether it pays depends on costs.”
- **Try:**
  - **Widget:** `orb-lab` (nou; exercițiul din R6 §2.2.2). 100 de zile R6 sintetice, cu un marcaj „in play” ascuns. Utilizatorul alege:
    - lungimea range-ului: 5 / 15 / 30;
    - filtrul: doar zile in play, da / nu;
    - nivelul de cost: zero / retail / stresat.
  - **Reușită:** găsește o configurație al cărei rezultat net își schimbă semnul între costul zero și costul retail (sau stresat) și raportează net-ul pe trade la cost retail, așa cum îl afișează laboratorul (± 0.01R).
- **Practică:** zile R6; în jurnal, rezultatele pe ora zilei.
- **Check:**
  1. regulile ORB;
  2. costurile de la deschidere;
  3. zilele care trebuie filtrate.
- **Dovezi:** C (R6 §2.2.2; R3 §3.5). Costurile sunt Mechanic.
- **Necesită:** S5, S4 (5m), S1 (stop de intrare), S13, marcajul „in play” în generator (o versiune simplă de S6)
- **Termeni noi de glosar:** opening-range, orb

#### 2.9.5 · Gap and go or gap fill
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Tell a gap with a catalyst from a gap without one
  2. State the rules of gap-and-go and gap-fill, and when to pass
  3. Show that many "gap fills" are what a random walk produces anyway
- **Concepte:** gap-strategies (nou), gap-risk ✓, breakout ✓, base-rates ✓, gap-types (din 2.5), random-walk (din 0.2)
- **Se sprijină pe:** 2.5 (tipurile de gap), 2.9.3, 2.9.4, 1.3 (gap-uri)
- **Fișa strategiei:**
  - **Gap and go** (R6 §2.8.1):
    - **Setup:** gap de cel puțin 2–4%, cu catalizator, și volum relativ de cel puțin 3 × la deschidere. Pragurile sunt de practicieni, netestate.
    - **Intrare:** ruperea maximului din pre-market sau a opening range-ului de 1–5 minute.
    - **Stop:** minimul opening range-ului, sau VWAP.
    - **Ieșire:** ieșiri parțiale la 1R și 2R, apoi trailing.
    - **Regim:** gap R4 plus trend intraday R1. Eșuează fără catalizator sau cu volum relativ mic; aceste gap-uri tind să se umple.
    - **Costuri:** spread-uri largi la titluri mici, halts (LULD), slippage.
    - **Notă:** **C/D**.
  - **Gap fill** (R6 §2.8.2):
    - **Setup:** gap moderat, fără catalizator, cu prețul încă în range-ul săptămânii trecute și volum mic sau moderat la deschidere.
    - **Intrare:** contra gap-ului, după primul eșec al opening range-ului. De exemplu, short sub minimul OR la un gap în sus.
    - **Stop:** dincolo de extremul zilei.
    - **Ieșire:** jumătate la umplerea a 50% din gap, restul la închiderea anterioară.
    - **Regim:** R2. Eșuează la gap-urile de breakaway, cu catalizator și volum relativ de 3 × sau mai mult.
    - **Notă:** **C**.
  - **Pass:** a treia alegere, validă.
- **Hook:**
  - **Tip:** predict, slider 0–100%.
  - **Prompt:** "LABX closes at 100.00 and opens at 101.00 with no news. On a pure random walk with a typical day's move of 1.60, how often would price touch 100.00 again that day?"
  - **Răspuns:** ≈ 53%. La un gap de 2.50, ≈ 12%.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** trei gap-uri:
    - mic, fără catalizator;
    - mare, cu catalizator și volum;
    - de epuizare, după un trend lung.
  - **B3 · worked:** probabilitatea de atingere pe random walk e 2 × (1 − Φ(d ÷ σ)), prin principiul reflexiei:
    - d = 1.00 → 53%;
    - d = 2.50 → 12%.
    - Calculul e pentru mișcare continuă; pe lumânări discrete iese puțin mai mic.
  - **B4 · match:** gap ↔ Go / Fade / Pass.
  - **B5 · explain:** pe un grafic de 24 de ore, „gap-ul” din graficul de sesiune poate să dispară. E un artefact al alegerii sesiunii (R3 §3.6).
  - **B6 · order:** decizia la gap:
    1. catalizator?
    2. volum relativ?
    3. poziția față de range-ul săptămânii;
    4. cardul;
    5. Go, Fade sau Pass.
- **Try:**
  - **Widget:** `gap-list` (nou; exercițiul din R6 §2.8.1–2.8.2). 10 gap-uri sintetice de dimineață, cu catalizatorul și volumul relativ vizibile. Pe fiecare titlu: Go / Fade / Pass, după filtrele din card.
  - **Reușită:** cel puțin 8 decizii din 10 consecvente cu filtrele. Rezultatul apare apoi doar ca diagnostic.
- **Practică:** dimineți cu gap (R4 + R6); controlul R0: scanner de gap-uri pe 1,000 de sesiuni, cu rata de umplere comparată cu random walk-ul (R3 §3.7).
- **Check:**
  1. catalizator sau nu;
  2. regulile și varianta Pass;
  3. rata de bază pe random walk.
- **Dovezi:**
  - **C/D:** gap and go;
  - **C:** gap fill;
  - **Mechanic:** probabilitatea de atingere pe random walk. „Gap-urile se umplu mereu” e fals; o mare parte din umpleri e rată de bază (R3 §3.7).
- **Necesită:** S5, S6 (marcajul de catalizator), S7, S2 (VWAP)
- **Termeni noi de glosar:** gap-and-go (gap-fill vine din 2.5)

#### 2.9.6 · Day trading or swing trading
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Compare day, swing and position trading on holding time, costs, gap risk and time demand
  2. Compute how trade frequency and stop size change the weekly cost in R
  3. Match a style to your own constraints, including the choice not to day trade
- **Concepte:** trading-styles (din 0.1, aprofundat aici), trading-costs ✓, gap-risk ✓, after-cost-evaluation (2.8.10)
- **Se sprijină pe:** 2.9.1–2.9.5, 0.1 (investing vs trading, cifrele oneste), 1.4
- **Hook:**
  - **Tip:** predict, cu alegere între „Day trader”, „Swing trader” și „The same”.
  - **Prompt:** "Same gross edge: +0.30R per trade. Day trader: 25 trades a week, stop 0.50, costs 0.40R per trade. Swing trader: 3 trades a week, stop 3.00, costs 0.07R. Who keeps more per week?"
  - **Răspuns:** swing trader-ul:
    - (0.30 − 0.07) × 3 = +0.70R pe săptămână;
    - day trader-ul: (0.30 − 0.40) × 25 = −2.50R.
- **Interacțiunea centrală:**
  - **B1 · explain:** tabelul stilurilor (R6 §1.1): durata de ținere, timeframe-ul de decizie, trade-uri pe săptămână, timp la ecran, sensibilitate la costuri, risc de gap, cerința psihologică.
  - **B2 · worked** cu input: costul săptămânal în R.
  - **B3 · figure:** peretele dovezilor:
    - Brazilia: 97% din day traderii care au persistat au pierdut; doar 1.1% au câștigat peste salariul minim;
    - Taiwan: sub 1% sunt profitabili în mod previzibil;
    - ESMA: 74–89% din conturile CFD pierd.
    - Surse: R6 §1.2, R5 RR-01–RR-02.
  - **B4 · match:** constrângere ↔ stil (R6 §6.1):
    - slujbă cu normă întreagă → swing sau position, ordine la sfârșitul zilei;
    - dimineți libere, în România → deschiderea UE la 10:00, overlap-ul 15:00–19:00, deschiderea SUA la 16:30;
    - cont mic → mărimi mici, swing;
    - toleranță mică la drawdown → risc mai mic pe trade;
    - impulsiv sub stres → ordine automate, orizont mai lung.
  - **B5 · predict:** riscul de peste noapte la swing. Exemplul R5 RF-20: long la 100, stop la 98, gap la 94 → −3R.
  - **B6 · callout:** „Deciding not to day trade is a valid result of this course.”
- **Try:**
  - **Widget:** `style-matrix` (nou). Formularul cere orele disponibile, fusul orar, mărimea contului, toleranța la drawdown și comportamentul măsurat (din S14: revenge, overtrading). Aplicația sugerează un stil.
  - **Sarcina numerică:** costul săptămânal în R pentru 10 trade-uri pe săptămână, cu stop de 1.00 la LABX ≈ 100.
  - **Reușită:** 2.00R (10 × 0.20R), ± 0.01.
- **Practică:** laboratorul unității („A trading month”): 10 zile de day trading, apoi aceeași perioadă ca swing pe lumânări zilnice (R1 / R2 / R4).
- **Check:**
  1. comparația stilurilor;
  2. costul săptămânal;
  3. de la constrângeri la stil.
- **Dovezi:**
  - **A**, ca fapt documentat: majoritatea traderilor retail pierd (ESMA, FCA, AMF, studiile din Brazilia și Taiwan; R5 RR-01–RR-02);
  - **C/D:** day trading-ul ca abordare, pentru populațiile retail (R6 §1.3);
  - **Mechanic:** costurile.
- **Necesită:** S5, S14, S15
- **Termeni noi de glosar:** — (day-trading, swing-trading și position-trading vin din 0.1)

#### 2.9.7 · Scalping and the cost wall
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Compute the break-even win rate of a small-target trade after costs
  2. Use cost drag (cost ÷ average gross profit) to compare styles
  3. Explain why retail scalping against professional liquidity providers rarely survives costs
- **Concepte:** cost-drag (nou), trading-costs ✓, bid-ask-spread ✓, slippage ✓, reward-to-risk ✓
- **Se sprijină pe:** 2.9.6, 1.1, L11 (break-even)
- **Hook:**
  - **Tip:** predict, slider 50–100%.
  - **Prompt:** "A scalper on LABX near 100 targets 0.30 and stops at 0.30. Round-trip costs are about 0.20 per unit. What win rate breaks even?"
  - **Răspuns:** 83%: câștigul net 0.10, pierderea netă 0.50, iar 0.50 ÷ 0.60 = 83.3%.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · worked** cu input: break-even-ul.
  - **B3 · figure:** zidul costurilor. Break-even-ul, cu stop = țintă = d și un cost de 0.20, e (d + 0.20) ÷ 2d:

    | d | Break-even |
    |---|---|
    | 0.30 | 83% |
    | 0.50 | 70% |
    | 1.00 | 60% |
    | 2.00 | 55% |
    | 4.00 | 52.5% |

  - **B4 · worked:** cost drag-ul = costul ÷ câștigul brut mediu.
    - 0.20 ÷ 0.30 = 67%.
    - Exemplul FX: 1 pip pe o țintă de 5 pipși = 20%; pe o țintă swing de 150 de pipși, sub 1% (R6 §5.1).
  - **B5 · explain:** cine e de partea cealaltă: HFT și market makeri, cu latență și informație mai bune (R6 §1.2; Mai departe: 3.2).
  - **B6 · predict:** comisioanele la 25 de trade-uri pe zi, în R pe lună (R5 RR-03: 6 trade-uri pe zi la 0.1R ≈ 12R pe lună).
- **Try:**
  - **Widget:** `cost-wall` (nou). Stop și țintă egale (d), cost fix 0.20.
  - **Obiectiv:** "Find the smallest equal stop and target at which the break-even win rate falls to 60%."
  - **Reușită:** d = 1.00.
- **Practică:** laboratorul cu aceleași 200 de trade-uri, la cost zero și la cost retail (exercițiul din R6 §1.2, adaptat fără order book). Versiunea cu order book: 3.2 și 3.3.
- **Check:**
  1. calculul break-even-ului;
  2. cost drag-ul;
  3. dovezile despre retail și contrapartida.
- **Dovezi:**
  - **Mechanic:** matematica costurilor;
  - **D/F:** scalping-ul retail (R6 §1.2: Brazilia 97%, Taiwan sub 1%);
  - market making-ul profesional e altă afacere (R6 §2.12).
- **Necesită:** S13, S15
- **Termeni noi de glosar:** cost-drag (scalping vine din 0.1)

#### 2.9.8 · Weekends, holidays and rollover
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Explain why a stop cannot protect you from a weekend or holiday gap
  2. Size a position you will hold over a weekend so a worst-case gap stays within 2R
  3. Know when rollover happens and why spreads widen around it
- **Concepte:** weekend-and-holiday-risk (nou), fx-rollover (nou), gap-risk ✓, stop-loss-order ✓, position-sizing ✓, slippage ✓
- **Se sprijină pe:** 2.9.1, 2.9.2, 1.3 (gap prin stop), L16, L12
- **Hook:**
  - **Tip:** predict, slider de pierdere în vUSD.
  - **Prompt:** "Friday: long 47 LABX at 100.00, stop 98.00, planned loss 98.66. Monday opens at 95.50. What do you lose?"
  - **Răspuns:** 47 × 4.50 + 2.35 + 2.25 = 216.10, de 2.2 ori planul.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** închiderea de vineri, gap-ul de luni. Stopul se execută la deschidere.
  - **B3 · worked** cu input (R5 PR-12; R4 §4.11, pct. 3):
    - gap-ul cel mai rău = 3 × ATR zilnic (2.00) = 6.00, deci ieșirea e la 94.00;
    - dimensiunea, ca pierderea să rămână ≤ 2R (200.00): **32 de unități** (195.11; 33 ar pierde 201.21);
    - comparat cu 47 de unități pe o zi normală.
  - **B4 · explain:** sărbătorile (R3 §3.9):
    - cărți subțiri și spread-uri mai largi (Thanksgiving în SUA, Crăciun – Anul Nou, august în Europa);
    - o piață închisă în timp ce alta e deschisă;
    - în simulator, adâncimea de 40% dă un slippage de 2.5 × (valoare de design din R4 §1.10, reglabilă).
  - **B5 · explain:** rollover-ul:
    - pozițiile FX deschise la 17:00 New York se reportează; în București e 00:00 în cea mai mare parte a anului și 23:00 în săptămânile nealiniate;
    - spread-ul se lărgește în jurul lui, iar un stop strâns poate fi atins doar de spread (R3 §3.8);
    - costul de finanțare (swap, triplu miercurea): 2.14.4.
  - **B6 · match:** situație ↔ politică:
    - weekend → reduci;
    - sărbătoare → reduci sau sari;
    - rollover → fără stopuri strânse în cele 15 minute din jurul lui.
- **Try:**
  - **Widget:** position-size, cu câmpul nou „Worst-case gap”.
  - **Valori de start:** entry 100.00, ATR 2.00, multiplu de gap 3, buget 2R (200.00).
  - **Reușită:** 32 de unități.
- **Practică:** gap-uri de weekend R4 (Arena: Unexpected event); calendarul S5 cu sărbători; trade-uri swing ținute peste weekend, în Practice.
- **Check:**
  1. stopul vs gap-ul;
  2. dimensionarea pentru weekend;
  3. ora rollover-ului și spread-ul.
- **Dovezi:**
  - **Mechanic:** gap-ul se execută la deschidere (R5 RF-20) și cărțile sunt subțiri de sărbători (R3 §3.9);
  - convenția rollover-ului la 17:00 New York și swap-ul triplu de miercuri sunt [BK] (R3 §3.8; R6 §3.2). De verificat la fiecare broker.
- **Necesită:** S5 (weekenduri, sărbători, rollover), S10 (FX)
- **Termeni noi de glosar:** rollover, weekend-gap

---

## Unitatea 2.10 · News and the economic calendar (9 lecții)

**Scop:**
- Știrile sunt întâi un eveniment de volatilitate și abia apoi o informație.
- Ordinea din R4 §9: mecanica riscului înaintea strategiilor, iar așteptările față de surpriză înaintea oricărei publicări concrete. Concret:
  1. surpriza și calendarul;
  2. mecanica spread / slippage / stop;
  3. trei publicări „de citit, nu de tranzacționat” (NFP, CPI, băncile centrale);
  4. politicile: stai deoparte (implicit), reduci, a doua mișcare;
  5. checklist-ul.
- Fiecare lecție începe cu „Riscul întâi”.

**De ce aici:**
- După 2.9 utilizatorul știe ora exactă a unei publicări (fusuri, DST) și riscul de gap.
- Înainte de 2.11, pentru că un eveniment lovește toate pozițiile deodată.

**Se sprijină pe:**
- 1.3: stopul devine ordin market, slippage, gap-uri;
- 1.4: sizing;
- 2.4: ATR;
- 2.9.1: ore și DST;
- 2.9.8: gap-uri și weekend.

**Checkpoint:** 12 întrebări (surpriza și z, câmpurile calendarului, slippage-ul la stop, NFP și CPI, surpriza unei decizii de dobândă, alegerea politicii), plus triajul unei săptămâni de calendar. La ≥ 80%, lecțiile se marchează „Tested out”.

**Laboratorul unității: Event week** (exercițiile din R4 §1.1, §4.4 și §4.11):
- O săptămână sintetică cu 12 evenimente, dintre care 3 roșii, cu HUD-ul de lichiditate (S6) activ.
- Utilizatorul:
  1. decide politica pentru fiecare eveniment înainte de T−15 minute;
  2. tranzacționează LABX cu playbook-ul lui;
  3. își notează slippage-ul.
- Scorul:
  - decizii luate la timp;
  - dimensionarea pentru gap corectă;
  - niciun ordin nou în ultimele 15 minute dinaintea unui eveniment roșu;
  - slippage-ul trecut în jurnal.
- Diagnostic: chitanța „cost of news” și P&L-ul față de ghost.

**Firele spiralei:**
- Risc: gap-ul și spread-ul la știri;
- Costuri: costul știrilor;
- Dovezi: direcția urmează surpriza (B); news scalping-ul retail e D;
- Proces: politica de știri trece în plan.

**Surse:**
- R4 §1.1–1.10, §2.0–2.2, §3.0–3.5, §3.9, §4.0–4.11, §9, §9A;
- R3 §3.10;
- R6 §2.9.1, §2.9.4;
- R5 PR-12, RF-20, TM-14, PL-04;
- R1 §2.12 (MN-04, MN-05), §3.3 („News volatility”).

#### 2.10.1 · Expectations versus surprise
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Explain why prices move on the surprise, not on whether the news is good or bad
  2. Compute a surprise and a standardised surprise from consensus, actual and the usual size of surprises
  3. Recognise small surprises that are usually noise
- **Concepte:** news-surprise (nou), base-rates ✓, volatility ✓, expected-value (din 0.2)
- **Se sprijină pe:** 0.2 (valoarea așteptată), 2.9.1
- **Riscul întâi:** orice publicare programată e în primul rând un eveniment de volatilitate. Spread-urile se lărgesc, iar prețul poate sări peste stop, oricum ar ieși cifra (detaliat în 2.10.3). Să înțelegi surpriza nu face saltul mai sigur.
- **Hook:**
  - **Tip:** predict, cu alegere între „The first”, „The second”, „The same” și „Can't tell”.
  - **Prompt:** "A synthetic jobs report beats consensus by 60,000 jobs. Another beats it by 10,000. Both are 'better than expected'. Which one usually moves price more?"
  - **Răspuns:** primul. Cu o abatere tipică a surprizelor de 60,000, z = 1.0 față de z = 0.17. Al doilea e în zgomot.
- **Interacțiunea centrală:**
  - **B1 · explain:** consensul aproximează ce e deja în preț (R4 §1.3).
  - **B2 · worked** cu input:
    - surpriza = actual − consensus;
    - z = surpriza ÷ σ, cu σ = 60,000;
    - 210,000 față de 150,000 dă +60,000, adică z = +1.0;
    - 160,000 dă z = 0.17.
  - **B3 · figure:** înainte de eveniment, prețul alunecă spre așteptare; la T0 sare, proporțional cu z. Banda fără reacție e |z| < 0.5 (parametru al generatorului, reglabil; R4 §9A).
  - **B4 · match:** publicare ↔ ce înseamnă „hot” (R4 §1.5):
    - CPI peste consens → hawkish;
    - șomaj în scădere → economie mai puternică;
    - cereri de șomaj în scădere → bine.
  - **B5 · predict:** „good news is bad news” (R4 §2.0). Aceeași surpriză de joburi în două regimuri:
    - lupta cu inflația: acțiunile scad;
    - teama de recesiune: acțiunile urcă.
  - **B6 · callout:** "The calendar tells you when. The surprise tells you how much. What the market fears decides which way."
- **Try:**
  - **Widget:** `predict-the-arrow` (nou; exercițiul din R4 §1.5). 5 evenimente sintetice, cu consens, actual și σ. Utilizatorul alege direcția LABX (definit în generator ca activ de risc, cu „focusul pieței” afișat) și mărimea:
    - fără mișcare: |z| < 0.5;
    - medie: 0.5–1.5;
    - mare: > 1.5.
  - **Reușită:** cel puțin 4 din 5 consecvente cu regula z.
- **Practică:** evenimente R5 în S6. Întâi reluări doar de privit, cu comentariu (R4 §9, B1).
- **Check:**
  1. ce înseamnă „priced in”;
  2. calculul lui z;
  3. o surpriză mică e zgomot.
- **Dovezi:**
  - **B:** semnul primei mișcări urmează semnul surprizei la publicările de top; mărimea e zgomotoasă (Andersen, Bollerslev, Diebold & Vega 2003; R4 §1.5, „Moderate”);
  - **B:** dependența de regim (R4 §2.0);
  - **Mechanic:** definițiile.
- **Necesită:** S6
- **Termeni noi de glosar:** consensus, surprise, priced-in

#### 2.10.2 · Reading the economic calendar
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Read each field of a calendar row: time, impact, previous, revised, consensus, actual
  2. Convert release times to your own time zone without the DST trap
  3. Triage a week of events into flat, reduce or ignore, before the week starts
- **Concepte:** economic-calendar (nou), news-surprise (2.10.1), market-hours (2.9.1)
- **Se sprijină pe:** 2.10.1, 2.9.1
- **Riscul întâi:** calendarul prezice sigur *când* cresc volatilitatea, spread-urile și riscul de gap, dar nu și direcția (R4 §1.1). Evenimentele neprogramate nu apar în el (2.10.9).
- **Hook:**
  - **Tip:** predict, cu alegere între 13:30, 14:30, 15:30 și 16:30.
  - **Prompt:** "A synthetic jobs release is at 08:30 New York time on Friday 30 October 2026. What time is that in Bucharest?"
  - **Răspuns:** 14:30. E săptămâna nealiniată; de obicei e 15:30.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · hotspot:** pe un rând de calendar, „Tap the field the actual is compared with.” Ținta: consensus.
  - **B3 · match:** câmp ↔ ce înseamnă: Previous, Revised, Consensus / Forecast, Actual, Impact.
  - **B4 · worked** cu input, revizuirile (R4 §1.4):
    - headline-ul e cu +60,000 peste consens;
    - cele două luni anterioare sunt revizuite cu −120,000;
    - surpriza netă: −60,000. Primul spike se poate întoarce.
  - **B5 · explain:**
    - nivelurile de impact sunt editoriale și depind de regim (R4 §1.6);
    - în calendar intră și discursuri, sărbători și licitații (R4 §1.10);
    - publicările pot fi amânate sau anulate: după shutdown-ul din 2025, estimarea avansată a PIB-ului american pe T3 2025 a fost anulată (R4 §1.9).
  - **B6 · order:** triajul:
    1. lista evenimentelor roșii pentru instrumentele tale;
    2. conversia orei;
    3. politica pentru fiecare;
    4. politica trecută în plan;
    5. alarmele.
- **Try:**
  - **Widget:** `calendar-triage` (nou; exercițiul din R4 §1.1, scurtat). O săptămână sintetică de 12 evenimente pentru LABX și vEUR/vUSD: 3 roșii, 4 portocalii, 5 galbene.
  - **Regulile planului:**
    - flat cu 15 minute înaintea unui eveniment roșu pe instrumentul tău;
    - jumătate de mărime înaintea unuia portocaliu;
    - ignori evenimentele galbene.
  - **Reușită:** cel puțin 11 decizii din 12 consecvente cu regulile. Reluarea arată apoi volatilitatea realizată pe fiecare slot (diagnostic).
- **Practică:** o săptămână R5; laboratorul Event week.
- **Check:**
  1. câmpurile;
  2. conversia orei;
  3. triajul.
- **Dovezi:**
  - **A:** volatilitatea crește la publicările programate de impact mare (R4 §1.1, „very reliable as a volatility predictor”; R3 §3.10 [MECH][EMP+]);
  - **Mechanic:** orele;
  - nivelurile de impact sunt editoriale (R4 §1.6).
- **Necesită:** S6, S5
- **Termeni noi de glosar:** economic-calendar, impact-tier, revision

#### 2.10.3 · Spreads, slippage and stops at news time
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Describe what happens to spreads, depth and fills in the minute around a release
  2. Compute the loss when a stop fills after a jump, and the slippage in vUSD and in R
  3. Explain how a spread-triggered stop happens
- **Concepte:** news-liquidity (nou), slippage ✓, stop-loss-order ✓, gap-risk ✓, bid-ask-spread ✓
- **Se sprijină pe:** 1.3 (L04, slippage, gap-uri), L09, 2.10.2
- **Riscul întâi** (e chiar subiectul lecției; R4 §4.0, §9A):
  - în cele 60 de secunde dinainte, spread-ul crește de la 1 × la 5–20 ×;
  - adâncimea scade cu 50–90%;
  - prețul sare printr-o carte goală;
  - stopul devine ordin market și se execută la primul preț disponibil;
  - lichiditatea revine în 30–120 de secunde;
  - brokerii pot crește marja înaintea evenimentelor (R6 §2.9.1).
  - Cifrele sunt valori de design ale simulatorului, reglabile.
- **Hook:**
  - **Tip:** predict, slider de pierdere în vUSD.
  - **Prompt:** "Long 47 LABX at 100.00, stop 98.00, planned loss 98.66. At the release, the first bid after the jump is 96.80. What do you lose?"
  - **Răspuns:** 155.03, adică 1.57 × planul.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** HUD-ul de lichiditate. Spread-ul urcă de la 0.10 la 1.00 (10 ×) la T0, apoi scade în 2 minute; barele de adâncime se golesc și se umplu.
  - **B3 · worked** cu input:
    - 47 × 3.20 + 2.35 + 2.28 = 155.03;
    - peste plan: 56.37, adică ≈ 0.57R.
  - **B4 · hotspot:** stop declanșat de spread. Mid-ul e la 98.40, spread-ul se lărgește la 1.00, deci bid-ul e 97.90, sub stopul de 98.00. „Tap the moment your stop was triggered.” Mid-ul n-a atins niciodată 98.00.
  - **B5 · predict:** „Does a stop cap your loss at news time?” Răspunsul: nu.
  - **B6 · callout:** "A stop is an instruction, not a price."
- **Try:**
  - **Widget:** `news-receipt` (nou). Un jurnal de execuție: intrare, stop, ora declanșării, prețul de execuție, spread-ul la execuție.
  - **Obiectiv:** pierderea reală și slippage-ul față de plan, în vUSD și în R.
  - **Reușită:** 155.03, 56.37 și 0.57R (± 0.01 fiecare).
- **Practică:** evenimente R5 cu HUD-ul activ; Arena: Unexpected event (`event_shock`), pentru varianta neprogramată.
- **Check:**
  1. lichiditatea în jurul publicării;
  2. calculul slippage-ului;
  3. stopul declanșat de spread.
- **Dovezi:**
  - **Mechanic:** stopul devine ordin market, iar gap-ul se execută la primul preț (R4 §1.2; R4 §4.10: „stop-loss orders don't always work”);
  - **B:** lărgirea spread-ului la publicare e aproape sigură pe platformele retail (R4 §4.0, rapoarte de pe forumuri și [BK]; R3 §3.10 [MECH][EMP+]);
  - valorile de design ale simulatorului (R4 §9A) nu sunt date empirice.
- **Necesită:** S6 (rampa de spread, adâncimea, latența), S1
- **Termeni noi de glosar:** spread-widening, spread-triggered-stop

#### 2.10.4 · Nonfarm payrolls
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Name the three numbers in the US jobs report and the revisions that come with them
  2. Judge whether a surprise is larger than the report's own sampling noise
  3. Classify a report as clearly hot, clearly cold or mixed before reacting
- **Concepte:** nonfarm-payrolls (nou), news-surprise (2.10.1), economic-calendar (2.10.2)
- **Se sprijină pe:** 2.10.1–2.10.3
- **Riscul întâi:**
  - NFP produce unele dintre cele mai mari lărgiri de spread ale lunii pe FX și pe CFD-urile pe indici [BK];
  - cele trei sub-surprize se contrazic des, deci whipsaw în ambele sensuri;
  - raportul de joburi al Canadei apare adesea în același minut: dublu eveniment pe USD/CAD [BK] (R4 §2.1).
  - Implicit: „read, don't trade” (R4 §9, B4).
- **Faptele** (R4 §2.1, cu sursele lui):
  - Employment Situation, publicat de BLS, de obicei în prima vineri a lunii la 08:30 ET [BK], adică 15:30 în București (14:30 în săptămânile nealiniate);
  - payrolls vin din ancheta pe firme (CES); rata șomajului din ancheta pe gospodării (CPS); plus câștigul orar mediu;
  - fiecare lună se revizuiește de două ori, în următoarele două luni, plus un benchmark anual (preliminar peste −900,000 în septembrie 2025, după o sursă secundară);
  - BLS: o schimbare lunară e semnificativă statistic de la ≈ 122,000 (CES) și ≈ 650,000 (CPS).
- **Hook:**
  - **Tip:** predict, cu alegere între „A strong, reliable signal”, „Inside the noise, but the market will still react” și „Nothing will happen”.
  - **Prompt:** "Payrolls come in 90,000 above consensus. The statistics bureau says a monthly change needs about 122,000 to be statistically significant. What is this surprise?"
  - **Răspuns:** varianta din mijloc.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** cele trei cadrane (payrolls, rata șomajului, salarii), plus revizuirile.
  - **B3 · worked**, evaluarea netă:
    - payrolls +90,000 peste consens: hot;
    - șomajul cu 0.1 pp peste așteptări: cold;
    - salariile cu 0.1% sub: cool;
    - revizuirile: −50,000;
    - concluzia: mixed.
  - **B4 · reveal:** reacția în două valuri: headline-ul în sus, detaliile în jos.
  - **B5 · match:** reacțiile *tipice* la un raport hot (R4 §2.1): randamentul la 2 ani urcă, USD urcă, aurul scade, acțiunile sunt ambigue. Tipice, nu garantate.
  - **B6 · callout:** "Read it. Don't trade it yet."
- **Try:**
  - **Widget:** `three-dial-nfp` (nou; exercițiul din R4 §2.1). 5 rapoarte sintetice, clasificate Clearly hot / Clearly cold / Mixed.
  - **Reușită:**
    - cel puțin 4 din 5 după regulă: toate cele trei cadrane și revizuirile cu același semn → clar; altfel → mixed;
    - politica „flat before” aleasă consecvent cu planul.
- **Practică:** evenimente R5 după șablonul NFP: întâi reluare de privit, cu comentariu, apoi tranzacționare după publicare.
- **Check:**
  1. cele trei cifre și revizuirile;
  2. zgomot sau semnal;
  3. clasificarea.
- **Dovezi:**
  - **Mechanic:** faptele despre publicare (BLS, R4 §2.1 [S1][S2]);
  - **B:** reacțiile tipice („Moderate” în R4);
  - [BK] marcat: prima vineri, lărgirea spread-urilor. De verificat.
- **Necesită:** S6 (componente, revizuiri)
- **Termeni noi de glosar:** nfp

#### 2.10.5 · Inflation: CPI
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Explain headline and core CPI and why markets focus on core month-on-month
  2. Size a CPI surprise against the usual spread of CPI surprises
  3. Wait for the details when headline and core disagree
- **Concepte:** cpi-inflation (nou), news-surprise (2.10.1), nonfarm-payrolls (2.10.4)
- **Se sprijină pe:** 2.10.1–2.10.4
- **Riscul întâi:**
  - futures-urile pe indici pot face gap la 08:30 ET [BK];
  - volatilitatea implicită a opțiunilor e ridicată înaintea publicării [BK];
  - primul val urmează headline-ul, al doilea urmează core-ul. Stopurile lovite în primul val pot rata întoarcerea din al doilea (R4 §1.8, §2.2).
- **Faptele** (R4 §2.2):
  - BLS strânge ≈ 80,000 de prețuri pe lună, în peste 200 de categorii;
  - core = toate articolele, fără alimente și energie;
  - CPI-U nu se revizuiește (factorii sezonieri se reestimează, pe până la 5 ani);
  - CPI-ul pe octombrie 2026 apare pe 10 noiembrie 2026, la 08:30 ET (15:30 în București) [S4];
  - ținta de 2% a Fed e definită pe PCE, nu pe CPI [BK];
  - 0.1 pp lunar e deja o surpriză mare [BK];
  - reacția tipică la un CPI hot: randamente în sus, USD în sus, acțiunile (mai ales cele de creștere) și aurul în jos. Depinde de regim.
- **Hook:**
  - **Tip:** predict, cu alegere între „Keeps rising”, „Reverses as core is digested”, „Nothing” și „Can't tell”.
  - **Prompt:** "Headline CPI comes in 0.2 above consensus because of energy prices. Core comes in 0.1 below. The first spike is up. What next?"
  - **Răspuns:** întoarcerea e al doilea val probabil (exercițiul din R4 §1.8). Probabil, nu sigur.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** coșul de prețuri, apoi headline vs core.
  - **B3 · worked** cu input: consensul core 0.3, actual 0.2, σ 0.1 → z = −1.0. E o ratare mare pentru o serie cotată cu o zecimală.
  - **B4 · reveal:** cele două valuri.
  - **B5 · match:** hot / cool ↔ reacția tipică.
  - **B6 · callout:** "Core first, then decide."
- **Try:**
  - **Lab:** `headline-vs-core` (nou). 5 publicări CPI sintetice, dintre care 3 au headline și core în contradicție.
  - **Regula planului:** dacă headline-ul și core-ul nu se potrivesc, stai flat până la 5 minute după publicare.
  - **Reușită:** regula respectată la fiecare publicare contradictorie și nicio acțiune în primul minut, la nicio publicare.
- **Practică:** evenimente R5 după șablonul CPI.
- **Check:**
  1. headline vs core;
  2. z pentru CPI;
  3. regula de așteptare.
- **Dovezi:**
  - **Mechanic:** definițiile și calendarul (R4 §2.2 [S4][S5]);
  - **B:** reacțiile tipice, dependente de regim;
  - [BK] marcat.
- **Necesită:** S6 (componente)
- **Termeni noi de glosar:** cpi, core-inflation

#### 2.10.6 · Central banks: the basics
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Explain what a central bank decides, when, and what the market has already priced
  2. Compute the surprise of a decision from market-implied probabilities
  3. Tell hawkish from dovish language, relative to what was expected
- **Concepte:** central-bank-decisions (nou), news-surprise (2.10.1), economic-calendar (2.10.2)
- **Se sprijină pe:** 2.10.1–2.10.3
- **Riscul întâi:**
  - gap-uri la ora deciziei;
  - a doua mișcare vine la conferința de presă, cu 30–60 de minute de volatilitate mare;
  - whipsaw de la comunicat la conferință și apoi la discursuri (R4 §3.2, §3.5).
- **Faptele** (situația la 22.10.2026, R4 §3.0–3.1):

  | Banca | Ședințe pe an | Ora deciziei | București |
  |---|---|---|---|
  | Fed | 8 | comunicatul la 14:00 ET, conferința la 14:30 ET [BK] | 21:00 (20:00 în săptămâna nealiniată) |
  | BCE | 8 | decizia la 14:15 CET, conferința la 14:45 CET [BK] | 15:15 |
  | BoE | 8 | 12:00 UK [BK] | 14:00 |
  | BoJ | 8 | fără oră fixă | — |

  - Date-șablon: FOMC 27–28 octombrie și 8–9 decembrie 2026; BCE 28–29 octombrie și 16–17 decembrie; BoE 5 noiembrie și 17 decembrie; BoJ 29–30 octombrie și 17–18 decembrie [S20, S26, S28, S30].
  - Mandatele: Fed are mandat dublu (ocupare și prețuri), cu ținta de 2% pe PCE; BCE, BoE și BoJ au stabilitatea prețurilor, cu ținta de 2% [BK].
- **Hook:**
  - **Tip:** predict, cu alegere între „The cut” și „No change”.
  - **Prompt:** "The market prices a 70% chance of a 25 bp rate cut. Which outcome is the bigger surprise: the cut, or no change?"
  - **Răspuns:** fără schimbare. E o surpriză hawkish de 17.5 bp, față de una dovish de 7.5 bp.
- **Interacțiunea centrală:**
  - **B1 · explain:** funcția de reacție a băncii.
  - **B2 · worked** cu input (R4 §3.9):
    - schimbarea așteptată = 0.70 × 25 = 17.5 bp;
    - cu tăiere: surpriză dovish de 7.5 bp;
    - fără schimbare: surpriză hawkish de 17.5 bp.
  - **B3 · match:** propoziție ↔ hawkish / dovish (R4 §3.4):
    - „further policy firming may be appropriate” → hawkish;
    - „the Committee will be patient” → dovish;
    - plus 2 propoziții sintetice.
  - **B4 · reveal:** decizia iese neutră, apoi fluxul de headline-uri din conferință produce o mișcare a doua, mai mare (exercițiul din R4 §3.5).
  - **B5 · predict:** BoJ, martie 2024. Prima creștere de dobândă în 17 ani, iar yenul s-a depreciat spre 150 pe dolar. De ce? Ghidajul a fost dovish, iar diferența de dobândă față de SUA a rămas mare (R4 §3.2 [S31–S33]).
  - **B6 · callout:** "To lift the currency, it must be more hawkish than priced."
- **Try:**
  - **Widget:** `hawk-or-dove` (nou; exercițiul din R4 §3.4). 6 propoziții sintetice, notate de la −2 la +2 față de un „priced baseline” afișat.
  - **Reușită:** semnul corect la cel puțin 5 din 6; la mărime se acceptă ± 1.
- **Practică:** un eveniment de bancă centrală R5 în modulul S6: comunicat, scor de ton, fluxul conferinței.
- **Check:**
  1. ce înseamnă „priced in”;
  2. surpriza ponderată cu probabilități;
  3. hawkish / dovish, relativ la așteptări.
- **Dovezi:**
  - **Mechanic:** mecanica ședințelor, cu dată;
  - **B:** surpriza față de prețuri prezice mișcarea dobânzilor pe termen scurt ([BK]; R4 §3.2);
  - studiul de caz BoJ 2024 [S31–S33].
  - Mai departe: 3.7 (dot plot, FedWatch calculat, QE/QT).
- **Necesită:** S6 (modulul de bancă centrală)
- **Termeni noi de glosar:** central-bank, rate-decision, hawkish, dovish

#### 2.10.7 · Stand aside, reduce or trade the surprise
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Choose a news policy before the event: stand aside, reduce, or trade the reaction
  2. Size a position you keep through an event so a gap of several ATRs stays within 1R
  3. Explain why trading the first seconds of a release is not a retail edge
- **Concepte:** news-policy (nou), position-sizing ✓, gap-risk ✓, news-liquidity (2.10.3)
- **Se sprijină pe:** 2.10.1–2.10.6, 2.9.8 (dimensionarea pentru gap), L16
- **Riscul întâi** (recapitulat):
  - spread de 5–20 ×, slippage, stopul nu e garantat, gap;
  - un șoc neprogramat nu se evită alegând momentul (R4 §1.2, §4.0).
- **Fișa strategiei** (trei politici):
  - **Stand aside** (implicit):
    - **Setup:** un eveniment roșu pe instrumentul tău, în fereastra din plan (de exemplu 15 minute).
    - **Intrare:** niciun ordin nou de la T−15; pozițiile existente sunt închise sau în regula planului.
    - **Stop / ieșire:** flat. Reintrarea doar după 2.10.8.
    - **Regim:** orice R5.
    - **Eșuează** la evenimentele neprogramate.
    - **Costuri:** niciunul, doar oportunitățile ratate.
    - **Notă:** **Mechanic**: poziția flat elimină expunerea la eveniment, prin construcție (R4 §4.5, „Strong as a risk control”).
  - **Reduce:**
    - **Setup:** o poziție pe care vrei s-o păstrezi.
    - **Intrare:** nimic nou.
    - **Stop:** neschimbat, sau mai larg cu mărime mai mică (aceiași bani la risc). Mărimea se alege așa încât un gap de k × ATR (k = 3–5) să rămână în 1R.
    - **Ieșire:** după plan, după eveniment.
    - **Eșuează** la gap-uri dincolo de k × ATR (cozi groase).
    - **Notă:** **B** (R4 §4.5, §4.11, pct. 3–4; R5 PR-12).
  - **Trade the surprise:**
    - **Setup:** o publicare de top, cu |z| > 2 și detaliile de acord.
    - **Intrare:** după cifră, în direcția surprizei. Simulatorul adaugă 300–1,500 ms de latență umană, iar intrarea medie e deja la 70–90% din drumul până la închiderea primului minut (valori de design, R4 §4.1).
    - **Stop:** dincolo de range-ul de dinaintea publicării.
    - **Ieșire:** pe termen scurt.
    - **Eșuează:** la detalii contradictorii, la întoarceri, din slippage.
    - **Costuri:** cele mai mari spread-uri și cel mai mare slippage.
    - **Notă:** **B** pentru direcția care urmează surpriza (ABDV), dar **D** pentru news scalping-ul retail (R6 §2.9.1). Cea mai mare parte a ajustării se face în câteva secunde, înainte ca un om să poată trimite un ordin (R4 §4.1).
  - **Straddle-ul** (pending orders pe ambele părți) apare doar ca avertisment: dovezi slabe, risc de dublă execuție (R4 §4.3). Mai departe: 3.7.
- **Hook:**
  - **Tip:** predict, auto-verificare fără răspuns unic: „Hold” / „Reduce” / „Go flat”.
  - **Prompt:** "You hold 47 LABX long, risking 98.66. A red event is 20 minutes away. Hold, reduce, or go flat?"
  - Recap-ul arată ce spune planul.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · match:** politică ↔ când se potrivește.
  - **B3 · worked** cu input, varianta „reduce”:
    - ATR 0.80; gap-ul de 4 × ATR = 3.20, deci ieșirea e la 96.80;
    - unitățile, ca pierderea să fie ≤ 100.00: **30** (98.96; 31 ar pierde 102.26);
    - stopul rămâne la 98.00.
  - **B4 · figure:** latența: prețul de intrare față de închiderea primului minut, pe 30 de evenimente generate.
  - **B5 · figure:** curbele de capital pe 30 de evenimente, pentru stand aside / reduce / intrare instant, cu drawdown-urile lor (exercițiile din R4 §4.4–4.5).
  - **B6 · callout:** "Standing aside is a strategy. It is the default."
- **Try:**
  - **Lab:** `news-policy` (nou). 10 evenimente roșii. Pentru fiecare, utilizatorul alege politica înainte de T−1 minut, după care alegerea se blochează. La „reduce”, calculează unitățile.
  - **Reușită:**
    - toate deciziile luate înainte de T−1 minut;
    - mărimile la „reduce” ≤ mărimea din scenariul de gap (de exemplu 30 de unități în cazul cu ATR 0.80);
    - niciun „trade the surprise” fără |z| > 2 și detalii de acord (vizibile abia după publicare).
- **Practică:** R5 în S6; laboratorul Event week.
- **Check:**
  1. politica aleasă dinainte;
  2. calculul mărimii la „reduce”;
  3. de ce tranzacționarea surprizei nu e un edge retail.
- **Dovezi:** Mechanic, B și D, ca în fișă.
- **Necesită:** S6, S1
- **Termeni noi de glosar:** stand-aside

#### 2.10.8 · The second move
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Wait for spreads to normalise before acting on a release
  2. Trade a break of the post-release range with a stop at its other side
  3. Name the cases where the second move fails: conflicting details, small surprises, the press conference
- **Concepte:** second-move (nou), news-policy (2.10.7), breakout ✓, limit-order ✓
- **Se sprijină pe:** 2.10.7, 2.8.4 (breakout din range), 2.10.5 (cele două valuri)
- **Riscul întâi:**
  - în primele 1–15 minute: spread-uri largi, două valuri, whipsaw;
  - conferința de presă poate aduce o mișcare mai mare (R4 §1.8, §3.5);
  - după știri se preferă ordinele limit (R4 §4.11, pct. 5).
- **Fișa strategiei** (R4 §4.4; R6 §2.9.1, prima abordare):
  - **Setup:** publicarea a trecut; aștepți până spread-ul ajunge la cel mult 2 × normalul (≤ 0.20 la LABX); marchezi maximul și minimul range-ului de după publicare (primele 5 sau 15 minute).
  - **Intrare:** ruperea range-ului de după publicare, în direcția surprizei, când detaliile sunt de acord; sau un pullback care ține. Preferabil cu ordine limit.
  - **Stop:** cealaltă margine a range-ului.
  - **Ieșire:** o țintă de 2R, trailing, sau sfârșitul sesiunii.
  - **Regim:** surprize mari (|z| > 1), cu detaliile de acord. Eșuează:
    - la detalii contradictorii;
    - la surprize mici (false break-uri ale range-ului inițial);
    - la întoarcerea de la conferința de presă.
  - **Costuri:** mișcări ratate, false break-uri, spread-uri încă peste normal la început.
  - **Notă:**
    - **B** ca metodă de reducere a riscului (R4 §4.4, „Moderate”);
    - **C** ca sursă de edge: continuarea e plauzibilă, dar mai puțin documentată.
    - Fade-ul spike-ului e de nivel A. Mai departe: 3.7.
- **Hook:**
  - **Tip:** predict, cu alegere între „Enter at the release” și „Wait for the 5-minute range break”.
  - **Prompt:** "Two policies over 30 synthetic events: enter at the release, or wait for the 5-minute range break. Which has the smaller worst trade?"
  - **Răspuns:** așteptarea. Stopul se fixează după ce spread-urile revin la normal, prin construcția setup-ului.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** reacția în două valuri, cu spread-ul suprapus.
  - **B3 · hotspot:** „Tap the first candle where the spread is back under 2 × normal.”
  - **B4 · worked** cu input:
    - range-ul de după publicare: 101.00–102.00;
    - intrare 102.05, stop 100.95 (1.10);
    - costul: 0.20 ÷ 1.10 = 0.18R;
    - **83 de unități** (99.73; 84 ar pierde 100.93);
    - ținta de 2R: 104.25.
  - **B5 · match:** cazurile de eșec ↔ ce le semnalează.
  - **B6 · callout.**
- **Try:**
  - **Lab:** `second-move` (nou). 6 publicări sintetice; utilizatorul setează regula de așteptare și range-ul.
  - **Reușită:**
    - nicio intrare cât timp spread-ul e peste 2 × normalul;
    - fiecare intrare are stopul pe cealaltă margine a range-ului;
    - risc ≤ 1% pe fiecare.
- **Practică:** R5 în S6. Curbele de capital pentru intrare instant vs așteptare, pe 30 de evenimente, cu costuri (exercițiul din R4 §4.4).
- **Check:**
  1. așteptarea;
  2. ruperea range-ului, cu stopul lui;
  3. cazurile de eșec.
- **Dovezi:** B / C, ca în fișă.
- **Necesită:** S6, S1
- **Termeni noi de glosar:** second-move, post-release-range

#### 2.10.9 · Your news risk checklist
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Apply a pre-event checklist before every order near a scheduled release
  2. Explain why only size and leverage protect you from unscheduled shocks
  3. Record the slippage you actually paid, per event type
- **Concepte:** news-risk-checklist (nou), gap-risk ✓, leverage ✓, journaling ✓, weekend-and-holiday-risk (2.9.8)
- **Se sprijină pe:** 2.10.1–2.10.8, 2.9.8, L12
- **Riscul întâi:** evenimentele neprogramate (geopolitică, decizii de urgență, renunțarea la un curs fixat, flash crash) nu se pot evita stând flat la o oră știută. Stopurile se execută în gol. Apărarea e mărimea, levierul și să nu ai nicio poziție care nu supraviețuiește unui gap (R4 §1.2, §4.10).
- **Studiile de caz** (R4 §4.10):
  - **SNB, 15 ianuarie 2015:** banca centrală elvețiană renunță la pragul EUR/CHF de 1.20. Cotații la ≈ 1,000 de pipși sub prag, circuit breakers la brokeri în ≈ 10 secunde, Alpari UK insolvent a doua zi. Lecția Euromoney: „stop-loss orders don't always work” [S68].
  - **Flash Crash, 6 mai 2010:** un algoritm vinde 75,000 de contracte E-mini, țintind 9% din volum. Dow scade cu aproape 1,000 de puncte și recuperează mult în aceeași după-amiază [S69].
- **Checklist-ul** (R4 §4.11, adaptat la 9 puncte, după R5 PL-04: 5–9 puncte):
  1. "I know every red event for my instruments this week, in my time zone."
  2. "My policy for each one (flat, reduce or hold) is decided now, not at T−1 minute."
  3. "If I hold, a gap of k × ATR stays within my maximum loss."
  4. "A wider stop only comes with a smaller size: the same money at risk."
  5. "After the release, I wait for spreads to normalise and prefer limit orders."
  6. "I expect spread-triggered stops."
  7. "I reduce before weekends and holidays."
  8. "I know my broker's news rules: margin increases, restrictions, negative balance protection, guaranteed stops."
  9. "I journal the slippage I paid, per event type."
- **Hook:**
  - **Tip:** predict, cu alegere între „Being flat before the CPI release”, „A stop-loss” și „A position small enough to survive a gap”.
  - **Prompt:** "Which of these protects you from an unscheduled shock?"
  - **Răspuns:** mărimea.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · reveal:** un scenariu de tip SNB. vEUR/vCHF stă fixată la 1.2000 săptămâni la rând, apoi e eliberată; primul preț vine la 15% distanță.
  - **B3 · worked** cu input:
    - capital 10,000, levier efectiv 10:1, deci o expunere de 100,000;
    - pierderea: 15,000, deci soldul ajunge la −5,000;
    - cu negative balance protection (retail UE), soldul se oprește la 0; fără ea, suma e datorată (legătura cu 2.14.6);
    - la 1:1, pierderea ar fi 1,500 (15%).
  - **B4 · order:** checklist-ul, în ordine.
  - **B5 · hotspot:** pe un tichet de ordin, „Tap the item that fails.”
  - **B6 · callout.**
- **Try:**
  - **Widget:** `pre-event-gate` (nou; exercițiul din R4 §4.11). 3 tichete de ordin în cele 15 minute dinaintea unui eveniment roșu. Fiecare are 2 puncte din checklist care pică.
  - **Reușită:** ambele puncte găsite la fiecare tichet (6 din 6).
- **Practică:** laboratorul Event week; Arena: Unexpected event; șocuri neprogramate în generatorul R4.
- **Check:**
  1. folosirea checklist-ului;
  2. șocurile neprogramate și mărimea;
  3. slippage-ul trecut în jurnal.
- **Dovezi:**
  - **Mechanic:** gap-ul prin stop, aritmetica levierului;
  - studiile de caz [S68][S69] (R4 §4.10);
  - checklist-ul e un instrument de proces (R4 §4.11; R5 PR-12, PL-04).
- **Necesită:** S6, S5, S11 (demonstrația NBP), S20 (o variantă simplă de renunțare la un curs fixat; scenariile complete de stres sunt la Nivelul 3)
- **Termeni noi de glosar:** unscheduled-event

---

## Unitatea 2.11 · Portfolio risk and performance (8 lecții)

**Scop:**
- Trecerea de la riscul pe trade la riscul de portofoliu:
  - dimensionarea pe volatilitate între instrumente;
  - portfolio heat;
  - corelația;
  - limitele de expunere și de perioadă;
  - treptele de drawdown.
- Apoi citirea rezultatelor: metricile de performanță, intervalul de încredere, SQN și compararea sistemelor.

**De ce aici:**
- După strategii, sesiuni și știri, utilizatorul ține mai multe poziții pe mai multe instrumente.
- R5 §10 (Level 2, pct. 13 și 16) pune aici heat-ul, corelația și metricile.
- R1 §4, pct. 2 arată că expunerea ajustată la corelație și sizing-ul pe volatilitate lipsesc din cursurile retail.

**Se sprijină pe:**
- 0.2: eșantion, varianță;
- 1.4: R, sizing, drawdown, limite zilnice;
- L12: expunere, corelație și concentrare;
- 2.4: ATR, L16;
- 1.6: KPI de proces;
- 2.8.10.

**Checkpoint:** 12 întrebări (dimensionare pe ATR, suma heat-ului, riscul ajustat la corelație, plafonul lunar, treapta de drawdown față de Monte Carlo, identitatea PF–expectancy, intervalul de încredere, SQN), plus construcția unui portofoliu de 3 poziții sub plafonul de heat și de corelație. La ≥ 80%, lecțiile se marchează „Tested out”.

**Laboratorul unității: Portfolio sandbox:**
- Instrumentele LABX, LABY și LABZ (S9).
- Bara de heat pe tichet, heat-ul ajustat la corelație, limitele și treptele de drawdown aplicate automat.
- Metricile cu interval, calculate pe jurnalul propriu.
- Scorul:
  - respectarea heat-ului;
  - risk accuracy;
  - respectarea limitelor.
- P&L-ul e doar diagnostic, lângă ghost.

**Firele spiralei:**
- Risc: firul de Nivel 2 (ATR, heat, corelație);
- Statistică: eșantion, interval de încredere, SQN;
- Proces: limitele intră în plan.

**Surse:**
- R5 RF-10, RF-12, PR-01–PR-08, PR-11, PM-01–PM-07, PM-10, PM-12–PM-17, PL-13, ST-05, ST-06;
- R6 §2.2.1 (unitățile Turtle), §6.5;
- R4 §6.9;
- R1 §4, pct. 2.

#### 2.11.1 · Sizing by volatility across instruments
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Size positions so one ATR of movement costs the same share of equity in every instrument
  2. Compare fixed-unit sizing with volatility sizing on two instruments
  3. Explain the limits of ATR sizing: lag after volatility jumps, and correlation
- **Concepte:** percent-volatility-sizing (nou), volatility ✓, position-sizing ✓, cost-adjusted-sizing ✓
- **Se sprijină pe:** 2.4 (L16), L09, 1.4
- **Hook:**
  - **Tip:** predict, cu alegere între „LABX”, „LABZ” și „The same”.
  - **Prompt:** "You buy 50 units of LABX (ATR 2.00) and 50 units of LABZ (ATR 0.50). Which position moves your account more on a typical day?"
  - **Răspuns:** LABX, de 4 ori: 100.00 față de 25.00 pe un ATR.
- **Interacțiunea centrală:**
  - **B1 · explain:** formula: unități = (capital × v) ÷ ATR în vUSD pe unitate (R5 RF-12; unitatea „N” a Turtles, R6 §2.2.1).
  - **B2 · worked:** cu v = 0.5%, un ATR valorează 50.00. Rezultă 25 de unități LABX și 100 LABZ (înainte de costuri).
  - **B3 · worked** cu input: cu stopul la 2 × ATR, riscul e ≈ 1%. După costuri:
    - LABX 100.00 / 96.00 → **24 de unități** (98.36; 25 ar pierde 102.45);
    - LABZ 40.00 / 39.00 → **96 de unități** (99.80; 97 ar pierde 100.84).
  - **B4 · figure:** bare pentru contribuția zilnică la volatilitate:
    - unități fixe: 100.00 față de 25.00;
    - unități pe ATR: 24 × 2.00 = 48.00 și 96 × 0.50 = 48.00.
  - **B5 · predict:** "LABZ's ATR doubles to 1.00 overnight. What happens to the risk of yesterday's 96 units?" Răspunsul: se dublează (96.00 pe un ATR), deci redimensionezi. ATR-ul rămâne în urmă după salturile de volatilitate (R5 RF-12, greșeli tipice).
  - **B6 · callout:** același risc pe unitate de volatilitate nu face pozițiile independente (2.11.3).
- **Try:**
  - **Widget:** position-size, cu mai multe instrumente (S9).
  - **Valori de start:** capital 10,000, v = 0.5%, stop la 2 × ATR; LABX la 100.00 cu ATR 2.00; LABZ la 40.00 cu ATR 0.50.
  - **Reușită:** 24 și 96 de unități. Expunerea totală: 6,240.00, sub capital.
- **Practică:** sandbox-ul cu două instrumente, calm și volatil (R5 RF-12); Portfolio sandbox.
- **Check:**
  1. formula;
  2. unități fixe vs pe volatilitate;
  3. limitele metodei.
- **Dovezi:** **Mechanic** (aritmetica). Dimensionarea Turtle e un exemplu istoric [PK] (R6 §2.2.1).
- **Necesită:** S9, S2 (ATR afișat)
- **Termeni noi de glosar:** volatility-sizing

#### 2.11.2 · Portfolio heat
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Add up the open risk of all positions as a percentage of equity
  2. Keep total heat under a cap by resizing or skipping new trades
  3. Count gap risk and pending orders, even when a stop sits at breakeven
- **Concepte:** portfolio-heat (nou), risk-per-trade ✓, exposure ✓, gap-risk ✓
- **Se sprijină pe:** 2.11.1, 1.4, L12
- **Hook:**
  - **Tip:** predict, slider 0–10%.
  - **Prompt:** "Five trades, each risking 1%, all hit their stops in one afternoon. How much has the account lost?"
  - **Răspuns:** 5% (500.00), înainte de slippage.
- **Interacțiunea centrală:**
  - **B1 · explain:** heat = suma riscurilor deschise ÷ capital (R5 PR-01).
  - **B2 · worked** cu input: 1% + 0.5% + 1% + 1.5% = 4%.
  - **B3 · figure:** bara de heat, cu plafonul la 5%. Practicienii folosesc 4–8% (R5 PR-01), respectiv 5–6% (R6 §6.5). Plafonul e o convenție, nu un standard.
  - **B4 · predict:** "Your stop is at breakeven. Is that position zero risk?" Răspunsul: nu, din cauza riscului de gap (R5 PR-01).
  - **B5 · match:** ce intră în heat:
    - pozițiile deschise;
    - ordinele în așteptare;
    - pozițiile cu stopul la breakeven, pentru riscul de gap.
  - **B6 · callout.**
- **Try:**
  - **Widget:** bara de heat pe tichetul de ordin (S9).
  - **Valori de start:** heat curent 4.0%, plafon 5%; un trade nou pe LABZ, planificat la 1.5%.
  - **Obiectiv:** redimensionezi la cel mult 1.0% sau renunți.
  - **Reușită:** riscul ordinului nou ≤ 1.00%. Tichetul blochează ordinele peste plafon.
- **Practică:** Portfolio sandbox; Arena cu mai multe poziții (S9). Scor RD: timpul petrecut peste plafon.
- **Check:**
  1. suma heat-ului;
  2. redimensionarea sub plafon;
  3. stopul la breakeven și ordinele în așteptare.
- **Dovezi:** **Mechanic**. Plafoanele sunt convenții (R5 PR-01; R6 §6.5).
- **Necesită:** S9
- **Termeni noi de glosar:** portfolio-heat

#### 2.11.3 · Correlation and concentration
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Explain why two correlated positions behave like one larger position
  2. Compute combined risk and the effective number of bets
  3. Spot the same bet hidden in different instruments, and expect correlations to rise in stress
- **Concepte:** correlation-and-concentration ✓, portfolio-heat (2.11.2), exposure ✓
- **Se sprijină pe:** 2.11.2, L12, 2.8.9 (aceeași formulă)
- **Hook:**
  - **Tip:** predict, cu alegere între „2% of independent risk” și „Close to one 2% bet”.
  - **Prompt:** "You hold LABX and LABY long, 1% risk each. They move together, with a correlation of 0.9. Is that 2% of independent risk, or close to one 2% bet?"
  - **Răspuns:** aproape un singur pariu. Riscul combinat e 1.95%, față de 1.41% dacă ar fi necorelate.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · worked** cu input: √(1² + 1² + 2 × 0.9 × 1 × 1) = 1.95%, față de √2 = 1.41%.
  - **B3 · worked:** numărul efectiv de pariuri = n ÷ (1 + (n − 1)ρ). Cinci poziții cu ρ = 0.8 fac 1.19 pariuri (R5 PR-02 [BK, formula]).
  - **B4 · figure:** corelația mobilă LABX–LABY: 0.3 pe calm, aproape de 1 în episodul de stres (generator). Un caz real: corelația acțiuni–obligațiuni a fost negativă cam din 2000 până în 2020 și ≈ +0.58 în 2022–2023 (R4 §6.9 [S72]).
  - **B5 · match:** același pariu, deghizat. Long vEUR/vUSD + long vGBP/vUSD + long vAUD/vUSD = short vUSD de trei ori (exemplul din R5 PR-02, adaptat).
  - **B6 · callout:** corelația măsurată pe calm subestimează stresul.
- **Try:**
  - **Widget:** `correlation-heat` (nou; exercițiul din R5 PR-02).
  - **Obiectiv:** alegi 2 poziții de câte 1% din LABX, LABY și LABZ, cu heat-ul ajustat la corelație ≤ 1.5%.
  - **Reușită:** LABX + LABZ sau LABY + LABZ (1.41%). LABX + LABY dă 1.92% la ρ = 0.85.
- **Practică:** Portfolio sandbox, cu un episod de stres în care ρ crește.
- **Check:**
  1. două poziții corelate fac un singur pariu;
  2. riscul combinat și numărul efectiv de pariuri;
  3. pariurile deghizate și stresul.
- **Dovezi:**
  - **Mechanic:** matematica de portofoliu (R5 PR-02 [BK, formula]);
  - **B:** corelațiile se schimbă cu regimul (R4 §6.9, studiu de caz).
- **Necesită:** S9
- **Termeni noi de glosar:** effective-bets

#### 2.11.4 · Exposure and loss limits
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Set caps per instrument, per direction and per theme
  2. Apply weekly and monthly loss limits that count open risk
  3. Decide whether a new trade fits all limits at once
- **Concepte:** exposure-limits (nou), period-loss-limits (nou), portfolio-heat (2.11.2), daily-loss-limit (din 1.4)
- **Se sprijină pe:** 2.11.2, 2.11.3, 1.4 (limitele zilnice)
- **Hook:**
  - **Tip:** predict, slider de risc nou în vUSD.
  - **Prompt:** "Month-start equity is 10,000.00 and your monthly cap is 6%: 600.00. You have lost 350.00 and have 200.00 of open risk. How much new risk can you take?"
  - **Răspuns:** 50.00. Un trade întreg de 1% nu mai încape.
- **Interacțiunea centrală:**
  - **B1 · explain:** un exemplu de politică (R5 PR-03):
    - cel mult 2% risc pe instrument;
    - cel mult 50% din heat într-o singură direcție;
    - o singură poziție pe grup corelat.
  - **B2 · worked:** plafonul lunar. Regula lui Elder de 6% numără pierderile realizate plus riscul deschis (R5 PR-05). Rămân 50.00.
  - **B3 · match:** „sharks vs piranhas” (Elder): regula de 2% ↔ o pierdere mare; regula de 6% ↔ multe pierderi mici.
  - **B4 · figure:** calendarul cu bugetele zilnic, săptămânal și lunar.
  - **B5 · predict:** "Reset the monthly limit after a good week?" Răspunsul: nu (R5 PR-05).
  - **B6 · callout:** limitele se potrivesc cu frecvența tranzacțiilor. Criticii notează că regula de 6% poate opri un profesionist după trei pierderi la începutul lunii.
- **Try:**
  - **Widget:** secțiunea „Limits” din plan builder, apoi un scenariu cu 5 tichete.
  - **Limitele introduse:** 1% pe trade, 3% pe zi, 6% pe lună (cu riscul deschis), 2% pe instrument, heat 5%, o poziție pe grup corelat.
  - **Obiectiv:** pentru fiecare tichet, Accept / Resize / Reject.
  - **Reușită:** toate cele 5 decizii consecvente cu limitele.
- **Practică:** modul „prop challenge” din S18, ca exercițiu de disciplină: limită zilnică și pierdere maximă (R5 PR-11). Se notează respectarea regulilor, nu „trecerea”.
- **Check:**
  1. plafoanele;
  2. calculul plafonului lunar;
  3. un trade care trebuie să încapă în toate limitele deodată.
- **Dovezi:** **Mechanic** (aritmetica). Pragurile sunt convenții (R5 PR-03, PR-05; Elder [S71][S72]).
- **Necesită:** S9, S18
- **Termeni noi de glosar:** exposure-limit, monthly-loss-limit

#### 2.11.5 · Drawdown tiers
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Write drawdown tiers that cut risk at set depths and say when risk comes back
  2. Calibrate the tiers to your system's normal drawdowns, not to a round number
  3. Explain why risk only goes down as the drawdown deepens
- **Concepte:** drawdown-tiers (nou), drawdown ✓, fixed-fractional-sizing ✓, expectancy ✓
- **Se sprijină pe:** 1.4 (drawdown și recuperare, L08), 2.11.4
- **Hook:**
  - **Tip:** predict, cu alegere între „Rarely”, „About half the time” și „Almost always”.
  - **Prompt:** "At 1% risk, a simulated system has a median maximum drawdown of 8.3% over 100 trades, and 1 run in 20 goes past 14.8%. You set 'stop trading at −8%'. How often will a perfectly normal run trigger it?"
  - **Răspuns:** cam în jumătate din cazuri (tabelul Monte Carlo din R5 RF-10).
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · worked** cu input: matematica recuperării, DD ÷ (1 − DD). 10% cere 11.1%, 20% cere 25% (R5 PR-07).
  - **B3 · figure:** graficul underwater, cu treptele desenate.
  - **B4 · worked:** un tabel de trepte (exemplul din R5 PR-08):
    - la −5%: riscul scade de la 1% la 0.5%;
    - la −10%: stop și recenzie completă;
    - riscul întreg revine după ce se recuperează jumătate din drawdown.
    - Turtles tăiau capitalul de calcul cu 20% la fiecare 10% de drawdown [PK] (R6 §2.2.1).
  - **B5 · predict:** o treaptă prea strânsă față de percentila 95 din Monte Carlo: cât de des pornește?
  - **B6 · callout:** "Never raise risk to recover." Leagă de L13 și L18.
- **Try:**
  - **Widget:** `dd-tier-builder` (nou; exercițiul din R5 PR-08). Utilizatorul setează treptele; aplicația le aplică pe 1,000 de drumuri Monte Carlo ale sistemului de referință (40% câștiguri, +2.5R, −1R) la 1% și arată cât de des pornește fiecare treaptă.
  - **Reușită:**
    - riscul doar scade cu adâncimea;
    - treapta „stop și recenzie” e la percentila 95 a drawdown-ului (14.8%) sau dincolo de ea, ori are o justificare scrisă;
    - există o regulă de revenire a riscului.
- **Practică:** treptele intră în plan, iar simulatorul le aplică automat. S15 arată ce au salvat și ce au costat.
- **Check:**
  1. treptele;
  2. calibrarea față de Monte Carlo;
  3. riscul nu urcă niciodată în drawdown.
- **Dovezi:**
  - **Mechanic:** matematica recuperării;
  - **B/C:** reducerea treptată a riscului e un tipar de practician (R5 PR-08 [S74][S75]);
  - cifrele Monte Carlo sunt calculate în R5 RF-10 (20,000 de drumuri).
- **Necesită:** S13 (Monte Carlo), S15
- **Termeni noi de glosar:** drawdown-tier

#### 2.11.6 · Performance metrics
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Compute win rate, payoff ratio, expectancy, profit factor and outlier dependence from a journal
  2. Say what each metric hides
  3. Keep outcome metrics as diagnostics with their sample size, and process metrics as the grade
- **Concepte:** performance-metrics (nou), expectancy ✓, drawdown ✓, r-multiple ✓, process-kpis (din 1.6)
- **Se sprijină pe:** 1.4 (expectancy), 1.6 (KPI de proces), 2.11.5
- **Hook:**
  - **Tip:** predict, cu alegere între „System A”, „System B” și „The same”.
  - **Prompt:** "System A wins 62% of trades with a profit factor of 1.15. System B wins 38% with a profit factor of 1.6. Losses are −1R in both. Which makes more per trade?"
  - **Răspuns:** B, cu +0.37R față de +0.06R.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · worked** cu input: E = (PF − 1) × (1 − W) × pierderea medie.
    - A: 0.15 × 0.38 = 0.057;
    - B: 0.6 × 0.62 = 0.372.
  - **B3 · match:** metrică ↔ ce ascunde (R5 PM-05, PM-06, PM-10):
    - win rate-ul ascunde payoff-ul;
    - profit factor-ul ascunde ordinea trade-urilor și drawdown-ul;
    - max drawdown-ul depinde de un singur episod;
    - recovery factor-ul crește odată cu istoricul.
  - **B4 · worked:** dependența de outlieri. Net +40R, cu cel mai bun trade de +15R, înseamnă 37.5% (R5 PM-14). Trend following-ul are nevoie de outlieri.
  - **B5 · figure:** dashboard-ul KPI (R5 PL-13, PM-17):
    - sus, procesul: plan adherence, stop integrity, risk accuracy;
    - rezultatul, pliat și gri până la n ≥ 30.
  - **B6 · callout:** "A profit factor above 3 in a backtest is a warning, not a trophy" (R5 PM-05, banda de practician).
- **Try:**
  - **Widget:** `metrics-card` (nou), pe un jurnal de exemplu cu 40 de trade-uri: 16 câștiguri, în total +40R; 24 de pierderi, în total −24R; cel mai bun trade +9R.
  - **Reușită** (± 0.01, respectiv ± 1 pp):
    - win rate 40%;
    - payoff 2.5;
    - expectancy +0.40R;
    - profit factor 1.67;
    - dependența de outlieri 56% (9 ÷ 16).
- **Practică:** S15 Analytics pe jurnalul propriu; raportul lunar din Portfolio sandbox.
- **Check:**
  1. calculul;
  2. ce ascunde fiecare metrică;
  3. proces vs rezultat.
- **Dovezi:** **Mechanic** (definițiile); **C** pentru benzile de practician (R5 PM-05).
- **Necesită:** S15
- **Termeni noi de glosar:** profit-factor, payoff-ratio, recovery-factor

#### 2.11.7 · Expectancy with a confidence interval
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Compute a 95% confidence interval for a win rate and for an expectancy
  2. Estimate how many trades you need before the interval excludes zero
  3. Explain why a good-looking small sample proves little
- **Concepte:** expectancy-confidence-interval (nou), expectancy ✓, base-rates ✓, sample-size (din 0.2)
- **Se sprijină pe:** 0.2 (mărimea eșantionului), 2.11.6, 2.8.10
- **Hook:**
  - **Tip:** predict, cu alegere între „Very sure”, „Fairly sure” și „Not sure at all”.
  - **Prompt:** "Your setup shows +0.40R per trade over 20 trades, with a spread of results of 1.71R. How sure can you be that the true expectancy is above zero?"
  - **Răspuns:** deloc. Intervalul de 95% e de la −0.35R la +1.15R.
- **Interacțiunea centrală:**
  - **B1 · explain:** eroarea standard = sd ÷ √n.
  - **B2 · worked** cu input:
    - 1.96 × 1.71 ÷ √20 = 0.75, deci intervalul e −0.35 … +1.15;
    - win rate-ul: 22 din 40 = 55%, cu intervalul 39.6% … 70.4% (R5 PM-01).
  - **B3 · figure:** panglica intervalului la n = 20, 50, 100 și 400, din ce în ce mai îngustă. Sistemul de referință are la n = 100 intervalul +0.06R … +0.74R (R5 ST-05).
  - **B4 · predict:** un sistem fără edge (sd 1.7R) arată o medie de cel puțin +0.4R pe 30 de trade-uri în ≈ 10% din cazuri (R5 PSY-09).
  - **B5 · worked:** trade-urile necesare pentru t ≈ 2: n = (2 × sd ÷ medie)². Cu 0.2R și sd 1.5, n = 225 (R5 PM-13).
  - **B6 · callout:** calculul presupune trade-uri independente (R5 ST-12). Mai departe: 3.10.
- **Try:**
  - **Widget:** `is-it-luck` (nou; exercițiul din R5 PM-13), cu media 0.40R și sd 1.71R.
  - **Obiectiv:** "Find the smallest number of trades at which the 95% interval excludes zero."
  - **Reușită:** 71. La 70, jumătatea intervalului e 0.4006, peste 0.40; la 71 e 0.3978.
- **Practică:** S15 pe trade-urile proprii; cele 100 de trade-uri din etapa de nivel.
- **Check:**
  1. calculul intervalului;
  2. câte trade-uri trebuie;
  3. eșantionul mic.
- **Dovezi:** **Mechanic** (statistică, cu ipoteza independenței).
- **Necesită:** S15
- **Termeni noi de glosar:** confidence-interval

#### 2.11.8 · SQN and comparing systems
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Compute SQN and read it as a t-statistic of the mean R
  2. Compare two systems by expectancy per month after costs, not per trade
  3. Put any system next to the passive benchmark before calling it good
- **Concepte:** sqn (nou), expectancy ✓, expectancy-confidence-interval (2.11.7), after-cost-evaluation (2.8.10), passive-benchmark (din 0.1)
- **Se sprijină pe:** 2.11.7, 2.8.10
- **Hook:**
  - **Tip:** predict, cu alegere între „System A”, „System B” și „The same”.
  - **Prompt:** "System A: +0.40R per trade, 8 trades a month. System B: +1.00R per trade, 2 trades a month. Which earns more per month?"
  - **Răspuns:** A.
    - Brut: 3.2R față de 2.0R.
    - Cu costuri de 0.10R pe trade: 2.4R față de 1.8R.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · worked** cu input: SQN = √N × medie ÷ sd, cu N plafonat la 100 (R5 PM-12).
    - Sistemul de referință: 10 × 0.40 ÷ 1.71 = 2.33, adică p ≈ 0.02 (bilateral).
    - Benzile atribuite lui Tharp (sub 1.6 greu de tranzacționat … 2.0–2.4 mediu) sunt [BK], de verificat.
  - **B3 · predict:** "SQN on 20 trades: reliable?" Răspunsul: nu.
  - **B4 · worked:** „opportunity” = expectancy × frecvență, cu costuri (R5 PM-04).
  - **B5 · figure:** curba de capital a sistemului lângă benchmark ghost (R5 PM-16).
  - **B6 · callout:** "More trades help only if each one still has an edge after costs."
- **Try:**
  - **Widget:** `system-compare` (nou; exercițiul din R5 PM-04): două sisteme, cu slidere de frecvență și de cost.
  - **Obiectiv:** "At what cost per trade do A and B earn the same per month?"
  - **Reușită:** 0.20R, din (0.40 − c) × 8 = (1.00 − c) × 2.
- **Practică:** raportul de strategie (S13, S15): SQN, interval, opportunity lunar după costuri, ghost.
- **Check:**
  1. SQN;
  2. compararea pe lună;
  3. benchmark-ul.
- **Dovezi:** **Mechanic** (SQN e o statistică t); **C** pentru benzile SQN (practician, [BK]).
- **Necesită:** S13, S15
- **Termeni noi de glosar:** sqn

---

## Unitatea 2.12 · The trader's mind II (9 lecții, cu L18)

**Scop:** biasurile, măsurate pe datele utilizatorului:
- prospect theory;
- disposition effect;
- supraîncrederea și calibrarea;
- recency și eșantioanele mici;
- confirmarea și ancorarea;
- sunk cost și house money;
- tilt-ul și rutinele;
- seriile de pierderi (L18);
- gândirea probabilistică (Douglas).

Fiecare lecție urmează principiul din R5 §5: o lecție scurtă, un scenariu în simulator care declanșează biasul și un detector calculat din acțiunile utilizatorului (S14).

**De ce aici:**
- 1.7 (L13) a numit capcanele pe decizii individuale.
- Acum utilizatorul are cel puțin 30 de trade-uri din Nivelul 1, plus cele din 2.8–2.11, deci detectoarele au date.
- R5 §10 (Level 2, pct. 17) pune aici setul de biasuri.
- L18 urcă aici pentru că se sprijină pe drawdown, expectancy și review (README §9). Acum se leagă și de treptele din 2.11.5 și de intervalul din 2.11.7.

**Se sprijină pe:**
- 0.2;
- 1.4: expectancy, drawdown;
- 1.6: L17, review, hindsight, recency;
- 1.7: L13, FOMO, revenge, loss aversion, pauza;
- 2.11.

**Checkpoint:** `test-psychology`, extins la 12 întrebări, plus o sarcină: utilizatorul citește panoul de detectoare al unui trader sintetic și numește 3 biasuri, cu dovada fiecăruia. La ≥ 80%, lecțiile se marchează „Tested out”.

**Laboratorul unității: Bias mirror.**
- Detectoarele S14 rulează pe ultimele 50 de trade-uri ale utilizatorului (sau pe un eșantion):
  - PGR / PLR;
  - riscul după câștig și după pierdere;
  - ieșirile la prețul de intrare;
  - rata de setup-uri sărite după pierderi;
  - curba de calibrare;
  - tilt index.
- Pentru fiecare, utilizatorul scrie o regulă if-then.
- Scorul: regulile scrise și respectarea lor în săptămânile următoare (proces).

**Firele spiralei:**
- Psihologie: firul de Nivel 2, biasuri măsurate pe datele tale;
- Statistică: serii, regresia la medie, eșantioane mici;
- Proces: guard-rails.

**Surse:**
- R5 PSY-01–PSY-37, ST-06, ST-07, ST-14, PL-15;
- R1 §2.16, §4 pct. 10;
- [../U5-traders-mind.md](../U5-traders-mind.md) (L13, L18).

#### 2.12.1 · Prospect theory
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Describe the three parts of prospect theory: a reference point, diminishing sensitivity and loss aversion
  2. Recognise your own risk-taking in gains versus in losses
  3. Link prospect theory to holding losers, cutting winners and lottery-like targets
- **Concepte:** prospect-theory (nou), loss-aversion ✓, expectancy ✓
- **Se sprijină pe:** L13 (1.7), 0.2 (valoarea așteptată)
- **Hook:**
  - **Tip:** auto-verificare, fără răspuns unic.
  - **Prompt:** "Choice 1: a sure +50.00 vUSD, or a 50% chance of +100.00. Choice 2: a sure −50.00, or a 50% chance of −100.00."
  - Cei mai mulți aleg câștigul sigur și pariul la pierderi. În fiecare pereche, cele două variante au aceeași valoare așteptată. Recap-ul arată tiparul utilizatorului.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** funcția de valoare: concavă la câștiguri, convexă și mai abruptă la pierderi. λ ≈ 2.25 vine de la 25 de studenți (1992) și e ilustrativ, nu universal (R5 PSY-01).
  - **B3 · worked** cu input: valoarea așteptată în fiecare pereche (50.00, respectiv −50.00).
  - **B4 · match:** comportament ↔ partea teoriei:
    - ții un loser de −0.6R, sperând să revină la zero ↔ înclinație spre risc la pierderi;
    - închizi devreme un câștig de +0.5R ↔ aversiune la risc la câștiguri;
    - o țintă „moonshot” foarte îndepărtată ↔ supraponderarea probabilităților mici.
  - **B5 · predict:** "Will knowing the bias remove it?" Răspunsul: nu (R5 PSY-01). Structura ajută (PSY-37).
  - **B6 · callout.**
- **Try:**
  - **Widget:** `choice-lab` (nou; din R5 PSY-01). 8 perechi de alegeri: 4 în cadru de câștig, 4 în cadru de pierdere, cu aceeași valoare așteptată. Aplicația arată rata de pariere în fiecare cadru.
  - **Reușită:** toate cele 8 răspunsuri date, iar utilizatorul citește corect, din propriul rezultat, în ce cadru a pariat mai des.
- **Practică:** detectorul S14 „time-to-close” pentru pierderi vs câștiguri, în Arena; M07 Stop or Stay?.
- **Check:**
  1. cele trei părți;
  2. riscul la câștiguri vs la pierderi;
  3. legătura cu comportamentele din trading.
- **Dovezi:** **A** pentru fenomen (Kahneman & Tversky 1979, 1992). Parametrii sunt ilustrativi; studiile pe profesioniști găsesc uneori un λ mai mic (R5 PSY-01).
- **Necesită:** S14
- **Termeni noi de glosar:** prospect-theory, reference-point

#### 2.12.2 · The disposition effect
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Define the disposition effect and measure it with PGR and PLR
  2. Show how selling winners early and holding losers damages expectancy
  3. Set exit rules that don't depend on whether the trade is in profit
- **Concepte:** disposition-effect (nou), prospect-theory (2.12.1), loss-aversion ✓, expectancy ✓
- **Se sprijină pe:** 2.12.1, 2.7 (ieșiri)
- **Hook:**
  - **Tip:** predict, cu alegere între „The winner” și „The loser”.
  - **Prompt:** "You hold two positions: one is +0.8R, the other −0.7R. You need to close one. Which do most people close?"
  - **Răspuns:** pe cea câștigătoare. Recap-ul întreabă: „What does your plan say?”.
- **Interacțiunea centrală:**
  - **B1 · explain** (Shefrin & Statman 1985 [BK]).
  - **B2 · worked:** Odean (1998), 10,000 de conturi. În afara lui decembrie, PGR = 14.8% și PLR = 9.8%, deci diferența e 0.05.
  - **B3 · worked** cu input, pe un eșantion:
    - câștiguri realizate 12, câștiguri pe hârtie 28 → PGR = 0.30;
    - pierderi realizate 6, pierderi pe hârtie 34 → PLR = 0.15;
    - disposition = 0.15.
  - **B4 · figure:** histogramele duratei de ținere, pentru câștiguri și pentru pierderi.
  - **B5 · predict:** efectul asupra expectancy-ului, la 40% câștiguri:
    - câștigurile închise la +0.8R în loc de ținta de +2.5R: 0.4 × 0.8 − 0.6 = −0.28R;
    - cu ținta: +0.40R.
  - **B6 · callout:** ieșirile vin din reguli (stop, țintă, timp, semnal opus), nu din cum se simte P&L-ul. Plus testul „fresh eyes” (2.12.6).
- **Try:**
  - **Widget:** `pgr-plr` (nou), pe jurnalul de exemplu.
  - **Reușită:** disposition = 0.15 (± 0.01). Apoi, dacă are cel puțin 30 de trade-uri, utilizatorul își vede propriul scor.
- **Practică:** detectorul S14, live; recenzia săptămânală (2.13.6) arată PGR − PLR.
- **Check:**
  1. definiția și măsura;
  2. efectul asupra expectancy-ului;
  3. ieșirile pe reguli.
- **Dovezi:** **B**. Odean (1998), pe 10,000 de conturi; efectul nu se explică prin rebalansare sau costuri (R5 PSY-03). Mărimea variază de la o populație la alta.
- **Necesită:** S14, S15
- **Termeni noi de glosar:** disposition-effect

#### 2.12.3 · Overconfidence and calibration
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Explain overconfidence as miscalibration: being sure more often than you are right
  2. Measure your calibration with a confidence log
  3. Link overconfidence to overtrading and its cost
- **Concepte:** overconfidence (nou), base-rates ✓, trading-costs ✓
- **Se sprijină pe:** 2.12.1, 0.2, 2.9.6
- **Hook:**
  - **Tip:** predict, slider 0–5, urmat de 5 intervale rapide.
  - **Prompt:** "You'll give five ranges, each one you're 90% sure contains LABX's close 10 candles from now. How many will actually contain it?"
  - **Răspuns:** de obicei 2–3 din 5 (ilustrativ). Aplicația arată rezultatul utilizatorului.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** curba de calibrare: încrederea declarată față de rata de reușită.
  - **B3 · explain** (R5 PSY-06, RR-02):
    - Barber & Odean: cea mai activă cincime din 66,465 de gospodării a câștigat 11.4% pe an, față de 17.9% piața;
    - bărbații au tranzacționat cu ≈ 45% mai mult decât femeile, iar asta le-a redus randamentul net cu 2.65 pp, față de 1.72 pp;
    - nuanța: o parte poate avea explicații raționale, prin costuri de ajustare.
  - **B4 · worked** cu input: decalajul de calibrare = rata de reușită − încrederea medie. 60% − 80% = −20 pp: supraîncredere.
  - **B5 · predict:** costul overtrading-ului: 25 de trade-uri pe săptămână × 0.20R față de 5 × 0.20R (legătura cu 2.9.6).
  - **B6 · callout:** "Confidence should come from evidence that you execute the process."
- **Try:**
  - **Widget:** `confidence-log` (nou). Înaintea a 10 decizii în reluare oarbă, utilizatorul declară încrederea (50–100%). Aplicația calculează rata de reușită și încrederea medie.
  - **Reușită:** utilizatorul raportează corect propriul decalaj de calibrare (± 1 pp) și alege eticheta potrivită: overconfident / calibrated / underconfident.
- **Practică:** jurnalul de predicții S14, cu încrederea în % înaintea fiecărui trade și curba de calibrare în timp; detectorul de overtrading.
- **Check:**
  1. definiția;
  2. citirea calibrării;
  3. costul overtrading-ului.
- **Dovezi:** **B**. Dovezi de teren Barber & Odean, cu nuanța din R5 PSY-06 (RR-02).
- **Necesită:** S14, S15
- **Termeni noi de glosar:** overconfidence, calibration

#### 2.12.4 · Recency and small samples
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Recognise recency bias: letting the last few results outweigh the base rate
  2. Explain why small samples look more convincing than they are
  3. Expect regression to the mean after an extreme run
- **Concepte:** recency-bias (nou ca concept; termenul de glosar e propus în L17), regression-to-the-mean (nou), base-rates ✓, expectancy-confidence-interval (2.11.7)
- **Se sprijină pe:** L17 (1.6), 2.11.7
- **Hook:**
  - **Tip:** auto-verificare, cu alegere între „Take it at normal size”, „Take it at half size” și „Skip it”.
  - **Prompt:** "Your pullback setup lost its last 3 trades. A fourth valid signal appears. Take it?"
  - Recap-ul: planul spune „normal size”. La 40% câștiguri, trei pierderi la rând apar în 21.6% din orice grupuri de trei trade-uri.
- **Interacțiunea centrală:**
  - **B1 · explain:** recency și disponibilitatea (Tversky & Kahneman 1974; R5 PSY-08).
  - **B2 · worked** cu input: 0.6³ = 21.6%.
  - **B3 · explain:** reprezentativitatea. Psihologii cercetători se așteptau la ≈ 85% replicări când probabilitatea reală era ≈ 48% (Tversky & Kahneman 1971; R5 PSY-09).
  - **B4 · figure:** „rookie of the year” (R5 ST-07). 50 de traderi sintetici fără abilitate; primii 5 din luna 1 ajung în luna 2 în jurul lui zero, în medie.
  - **B5 · worked:** regresia. Un setup cu +1.5R pe trade în primele 15 trade-uri, cu un edge real de +0.3R, va arăta probabil mult mai rău în următoarele 15 (R5 ST-07).
  - **B6 · predict:** detectorul de setup-uri sărite: „Do you skip more valid setups after losses?” (S14).
- **Try:**
  - **Widget:** `guess-the-edge` (nou; jocul din R5 PSY-09). 4 sisteme sintetice, câte 20 de trade-uri: 2 fără edge, 2 cu +0.3R, fiecare cu intervalul lui. Utilizatorul spune Edge / No edge / Can't tell.
  - **Reușită:** cel puțin 3 judecăți din 4 consecvente cu regula: „Can't tell” ori de câte ori intervalul include zero.
- **Practică:** detectorul S14 (probabilitatea de a sări un setup, în funcție de ultimele 1–3 rezultate); recenzia săptămânală.
- **Check:**
  1. recency;
  2. eșantioanele mici;
  3. regresia la medie.
- **Dovezi:**
  - **Mechanic:** regresia la medie (statistică);
  - **B:** recency și reprezentativitatea (dovezi de laborator; R5 PSY-08, PSY-09).
- **Necesită:** S14, S15, S7
- **Termeni noi de glosar:** law-of-small-numbers, regression-to-the-mean (recency-bias e propus în L17)

#### 2.12.5 · Confirmation and anchoring
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Spot confirmation bias in how you read the chart of a trade you already hold
  2. Recognise anchoring to your entry price or to an old high
  3. Use a written invalidation and a devil's-advocate check before and during a trade
- **Concepte:** anchoring (nou), confirmation-bias ✓, invalidation-level ✓
- **Se sprijină pe:** L13 (confirmation bias), L10 (invalidarea)
- **Hook:**
  - **Tip:** predict, cu alegere între „Resistance”, „A meaningful level” și „Just your entry price”.
  - **Prompt:** "You bought LABX at 104.00. It's 101.20 now and your plan's stop is 100.80. A voice says: 'I'll sell when it gets back to 104.00.' What is 104.00 to the market?"
  - **Răspuns:** doar prețul tău de intrare.
- **Interacțiunea centrală:**
  - **B1 · explain:** confirmation bias (Nickerson 1998 [BK]).
  - **B2 · hotspot:** un grafic cu trei lower highs și o MA care urcă. „Tap the evidence against the long.” Ținta: lower highs-urile. E cardul 2 din bias-spotter (L13), reluat pe grafic.
  - **B3 · explain:** ancorarea. Cu roata norocului, estimările au fost ≈ 25% după 10 și ≈ 45% după 65 (R5 PSY-12).
  - **B4 · match:** ancoră ↔ forma ei în trading: prețul de intrare, un maxim vechi, ținta unui analist.
  - **B5 · worked:** detectorul de ieșiri la breakeven: ieșiri adunate la mai puțin de 0.10 de prețul de intrare, după un drawdown (S14).
  - **B6 · callout:** scrie înainte de intrare prețul care îți dovedește că greșești.
- **Try:**
  - **Widget:** `devils-advocate` (nou). O idee long la 101.20. Utilizatorul scrie prețul de invalidare și alege 2 contra-semnale dintr-un flux sintetic de 5 elemente (2 contra, 3 pentru).
  - **Reușită:** invalidarea ≤ 100.80 (sub ultimul swing low, după regulă) și ambele contra-semnale alese.
- **Practică:** detectorul S14 de ieșiri la breakeven; formularul de dinaintea trade-ului, cu „What would prove me wrong?” (R5 PSY-11).
- **Check:**
  1. confirmarea;
  2. ancorarea;
  3. invalidarea și verificarea „devil's advocate”.
- **Dovezi:**
  - **A:** ancorarea, în laborator (R5 PSY-12);
  - **B:** confirmation bias (Nickerson [BK]);
  - **B:** efectele în trading.
- **Necesită:** S14
- **Termeni noi de glosar:** anchoring

#### 2.12.6 · Sunk cost and house money
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Recognise the sunk-cost trap in holding or adding to a loser
  2. Recognise the house-money effect: taking more risk after gains
  3. Apply the "fresh eyes" test and keep risk per trade flat after wins and after losses
- **Concepte:** sunk-cost (nou), house-money-effect (nou), fixed-fractional-sizing ✓, revenge-trading ✓
- **Se sprijină pe:** L13, 2.12.1
- **Hook:**
  - **Tip:** predict, cu alegere între „Yes” și „No”.
  - **Prompt:** "After three wins you're up 400.00 vUSD. The next setup appears and you size it at 2% because 'it's the market's money'. Is that money different from the rest of your account?"
  - **Răspuns:** nu.
- **Interacțiunea centrală:**
  - **B1 · explain:** sunk cost (Arkes & Blumer 1985; R5 PSY-15). Include și banii adăugați în cont ca să „salvezi” o poziție (RF-18).
  - **B2 · explain:**
    - house money și efectul de breakeven (Thaler & Johnson 1990). Avertisment: dovezile vin din alegeri ipotetice, pe eșantioane mici (R5 PSY-05);
    - contabilitatea mentală (PSY-22).
  - **B3 · figure:** barele „risk after a win” și „risk after a loss”, din jurnalul de exemplu.
  - **B4 · predict:** testul „fresh eyes”: "If you were flat now, would you open this position at this size?" (R5 PSY-15).
  - **B5 · match:** frază ↔ bias:
    - „I've lost too much to sell now” → sunk cost;
    - „It's their money” → house money;
    - „One more trade to get back to even” → efectul de breakeven, revenge.
  - **B6 · callout:** dimensionarea fixed fractional e constantă prin construcție.
- **Try:**
  - **Widget:** `risk-after-outcome` (nou), pe un eșantion de 30 de trade-uri: 12 după un câștig, cu risc mediu de 1.6%; 17 după o pierdere, cu 1.0%. Primul trade nu are un rezultat anterior.
  - **Reușită:** utilizatorul raportează 1.6% față de 1.0% (± 0.1) și numește tiparul: house money.
- **Practică:** detectorul S14 (riscul în funcție de rezultatul anterior); M07.
- **Check:**
  1. sunk cost;
  2. house money;
  3. testul „fresh eyes” și riscul constant.
- **Dovezi:**
  - **B:** sunk cost (Arkes & Blumer);
  - **C:** house money (alegeri ipotetice, eșantioane mici; R5 PSY-05).
- **Necesită:** S14, S15
- **Termeni noi de glosar:** sunk-cost, house-money-effect

#### 2.12.7 · Tilt and routines
- **Nivel / durată / tip:** Intermediate · 8 min · Core
- **Obiective:**
  1. Recognise tilt as a cluster of rule breaks, not just a feeling
  2. Set guard-rails before the session: a cool-down, a tilt threshold, a daily lock and a readiness check
  3. Use reappraisal and a reset routine instead of suppressing emotion
- **Concepte:** tilt (nou), behavioural-guard-rails (nou), revenge-trading ✓, decision-quality ✓
- **Se sprijină pe:** L13 (pauza), L17, 2.11.4 (limite)
- **Hook:**
  - **Tip:** predict, cu alegere între „Trade smaller”, „Pause and run your reset routine”, „Keep going carefully” și „Quit for the week”.
  - **Prompt:** "Your last 10 trades include 4 rule breaks, 3 of them in the last 4 trades. What's the best next action?"
  - **Răspuns:** pauză și rutina de resetare.
- **Interacțiunea centrală:**
  - **B1 · explain:** tilt-ul (din poker; R5 PSY-19). Erorile vin în grupuri. Tilt index = numărul de încălcări pe ultimele 10 trade-uri, o măsură definită de aplicație.
  - **B2 · figure:** contorul de tilt pe parcursul unei sesiuni.
  - **B3 · explain:** dovezile:
    - Lo, Repin & Steenbarger (2005): 80 de day traderi; reacțiile emoționale mai intense au mers cu rezultate mai slabe (PSY-25);
    - Fenton-O'Creevy et al. (2011), studiu calitativ: traderii mai buni foloseau reglarea anticipativă (PSY-27);
    - Coates & Herbert (2008): eșantion mic, de citit cu prudență (PSY-26).
  - **B4 · match:** strategia de reglare ↔ tipul ei:
    - reinterpretarea („this loss is one draw from my distribution”) → anticipativă;
    - suprimarea („I feel nothing”) → reactivă;
    - evitarea („don't look at the positions”) → evitare.
  - **B5 · order:** rutina de resetare:
    1. stop;
    2. pauza (timer-ul de cool-down);
    3. respirație și reflecție;
    4. numești regula încălcată;
    5. checklist-ul;
    6. reiei la mărimea normală sau închei sesiunea.
  - **B6 · callout:** "Structure beats willpower" (PSY-37).
- **Try:**
  - **Widget:** `guard-rail-builder` (nou; din R5 PSY-37). Utilizatorul setează:
    - cool-down-ul după o pierdere (minute sau lumânări);
    - pragul de tilt (încălcări în 10 trade-uri);
    - blocarea zilnică (în R);
    - verificarea de pregătire: somn, stres, boală.
  - Apoi, pe un jurnal de sesiune: „Tap the trade where your guard-rails would have locked trading.”
  - **Reușită:** toate cele 4 guard-rails setate în intervalele valide, iar tap-ul cade pe primul trade care trece pragul configurat.
- **Practică:** contorul de tilt S14, cu blocare ușoară în Arena; verificarea de pregătire înaintea sesiunilor.
- **Check:**
  1. tilt-ul ca grup de încălcări;
  2. guard-rails;
  3. reinterpretare vs suprimare.
- **Dovezi:**
  - **B:** Lo, Repin & Steenbarger (2005), 80 de traderi (R5 PSY-25);
  - **C:** Coates & Herbert, eșantion mic (PSY-26);
  - **C:** Fenton-O'Creevy, studiu calitativ (PSY-27);
  - planurile if-then sunt [BK] (PSY-28).
- **Necesită:** S14
- **Termeni noi de glosar:** tilt, guard-rail

#### 2.12.8 · Handling losing streaks  ·  `L18`
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Explain why losing streaks happen even with a positive expectancy
  2. Apply fixed risk and pre-set stopping rules during a streak
  3. Review a streak to tell bad luck from a broken process
- **Concepte:** drawdown ✓, expectancy ✓, revenge-trading ✓, decision-quality ✓
- **Se sprijină pe:** L08 (1.4), L11 (1.4), L13 (1.7), L17 (1.6). În scriptul L18 apar ca L08, L11, L13 și L17. Legăturile noi de la acest nivel: 2.11.5 (treptele de drawdown) și 2.11.7 (intervalul de încredere).
- **Hook:**
  - **Tip:** predict, slider 0–100%, pas 1.
  - **Prompt:** "A method wins 40% of its trades and makes +0.20R per trade on average. Over 100 trades, how likely is at least one run of five losses in a row?"
  - **Răspuns:** ≈ 98% (97.6%, calcul exact, cu trade-uri independente).
- **Interacțiunea centrală:** (6 beat-uri, scriptul din [../U5-traders-mind.md](../U5-traders-mind.md))
  - **B1 · explain:** seriile sunt normale; pericolul e reacția la ele.
  - **B2 · worked** cu input:
    - 0.6⁵ = 7.8% pentru cinci trade-uri date;
    - ≈ 98% pentru o serie de 5+ undeva în 100 de trade-uri, ≈ 49% pentru 8+.
  - **B3 · figure:** 8 pierderi la trei niveluri de risc:

    | Risc | Capitalul final | Scădere | Creștere necesară |
    |---|---|---|---|
    | 1% | 9,227.45 | −7.7% | +8.4% |
    | 2% | 8,507.63 | −14.9% | +17.5% |
    | 3% | 7,837.43 | −21.6% | +27.6% |

    Plus un slider de risc, opțional.
  - **B4 · match:** cele 5 comportamente ↔ cum sună în capul tău: sizing up, slăbirea regulilor, recency, method-hopping, overcorrection.
  - **B5 · predict** cu câmpuri de plan:
    - riscul în drawdown ≤ 1%;
    - pauză după N pierderi la rând (2–5);
    - recenzie completă la X% sub vârf (3–10).
  - **B6 · predict:** bad luck sau proces stricat? Jurnalul arată încălcări de reguli, deci proces stricat.
- **Try:**
  - **Widget:** expectancy, cu panoul nou „Losing runs”.
  - **Valori de start:** win rate 40%, average win 2.0R și average loss 1.0R, toate blocate; lungimea seriei 5.
  - **Obiectiv:** cea mai scurtă serie care e mai puțin probabilă decât nu, pe 100 de trade-uri.
  - **Reușită:** 8 (48.97%).
- **Practică:**
  - M07 Stop or Stay?, Arena: Sideways market, Knowledge check: psychology;
  - nou la acest nivel: regulile de serie din B5 se trec în tabelul de trepte din 2.11.5.
- **Check:**
  - q-psy-6: o singură serie spune puțin;
  - q-psy-7: regula de sesiune după trei pierderi;
  - q-psy-9: varianța, cu un jurnal curat.
- **Dovezi:** **Mechanic**: lanț Markov exact, cu ipoteza independenței. Cifrele coincid cu tabelul din R5 ST-06 (la 40%: 97.6% pentru 5+, 49.0% pentru 8+).
- **Necesită:** panoul „Losing runs” al widget-ului expectancy (cerințele sunt în U5); S14 și S15 pentru Practică
- **Termeni noi de glosar:** — (`variance`, propus în nota scriptului L18, există deja în 0.2; `recency-bias` vine din 1.6.5, L17)
- **Schimbări față de script:** doar trimiterile (id-urile de unitate) și legătura cu 2.11.5 la „Practise it”. Decizia despre `tier: "pro"` rămâne cea din nota L18.

#### 2.12.9 · Thinking in probabilities
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Treat each trade as one draw from a distribution, not as a test of being right
  2. Show that a positive-expectancy system still loses over short stretches
  3. Commit to executing a block of 20 setups by the rules and judge the block by process
- **Concepte:** probabilistic-thinking (nou), expectancy ✓, decision-quality ✓, base-rates ✓
- **Se sprijină pe:** 2.12.8, 2.11.7, L17
- **Hook:**
  - **Tip:** predict, slider 0–100%.
  - **Prompt:** "Your system makes +0.40R per trade on average: it wins 40% of trades at +2.5R and loses 60% at −1R. Over the next 10 trades, how likely is a net loss?"
  - **Răspuns:** 16.7%.
- **Interacțiunea centrală:**
  - **B1 · explain:** Douglas (R5 PSY-31): un edge e o probabilitate mai mare pe o serie, nu o certitudine pe un trade. Cele cinci adevăruri, în parte [BK].
  - **B2 · worked** cu input: tabelul probabilității unei pierderi nete (R5 ST-14, binomial exact):

    | Trade-uri | P(pierdere netă) |
    |---|---|
    | 5 | 33.7% |
    | 10 | 16.7% |
    | 20 | 12.6% |
    | 50 | 5.4% |
    | 100 | 0.8% |

    Utilizatorul calculează cazul de 5 trade-uri: e nevoie de cel mult un câștig, deci 0.6⁵ + 5 × 0.4 × 0.6⁴ = 0.0778 + 0.2592 = 33.7%.
  - **B3 · figure:** cinci blocuri de câte 20 de trade-uri din același sistem. Rezultatele variază mult, iar scorul de proces rămâne 100%.
  - **B4 · match:** cele cinci adevăruri ↔ comportamentul pe care îl previn.
  - **B5 · explain:** încadrarea largă vs îngustă (PSY-22): în jurnal, vederea pe serii (blocuri de 20).
  - **B6 · callout:** "You don't need to know what happens next to act on an edge."
- **Try:**
  - **Widget:** `block-runner` (nou). Cinci blocuri de 20 de trade-uri din sistemul de referință, cu seed-uri aleatoare; utilizatorul notează rezultatul net al fiecărui bloc.
  - **Reușită:** raportează diferența dintre cel mai bun și cel mai slab bloc (± 0.1R, cum o afișează aplicația) și confirmă că scorul de proces a fost 100% în fiecare bloc.
- **Practică:** modul „20-trade block” în Arena și în Practice (R5 PSY-31); blocurile se compară de la o săptămână la alta în recenzia săptămânală.
- **Check:**
  1. un trade e o extragere;
  2. pierderile pe porțiuni scurte;
  3. angajamentul pe bloc.
- **Dovezi:**
  - **Mechanic:** calculul binomial (R5 ST-14);
  - **C:** cadrul lui Douglas e un sfat de practician, nu un rezultat testat (R5 PSY-31 [BK]).
- **Necesită:** S15
- **Termeni noi de glosar:** probabilistic-thinking, broad-framing

---

## Unitatea 2.13 · Playbook, routine and review (7 lecții, cu L15)

**Scop:** bucla de proces a Nivelului 2:
- scenariile (L15);
- playbook-ul din carduri de setup;
- rutina de dinaintea pieței;
- planurile if-then;
- taxonomia erorilor, cu costul lor;
- recenziile zilnice și săptămânale;
- KPI-urile și obiectivele de proces, plus o guvernare simplă a schimbării regulilor.

**De ce aici:**
- E ultima unitate core. Leagă într-o singură rutină:
  - setup-urile (2.8);
  - timpul și evenimentele (2.9–2.10);
  - limitele (2.11);
  - guard-rails-urile (2.12).
- Etapa de nivel cere cel puțin 2 setup-uri și 4 recenzii săptămânale.
- L15 urcă aici pentru că un plan pe scenarii are nevoie de regimuri, de evenimente și de riscul de gap (README §9).

**Se sprijină pe:**
- 1.6: L14 (planul v1), L17 (review), jurnalul, KPI-urile, greșeală vs varianță;
- 2.8–2.12.

**Checkpoint:** `test-scenario_analysis`, plus 10 întrebări noi, plus o sarcină: un card de setup care trece validatorul. La ≥ 80%, lecțiile se marchează „Tested out”.

**Laboratorul unității: Four-week cycle.**
- 4 săptămâni simulate (comprimate).
- Fiecare sesiune: rutina, trade-uri etichetate cu cardul, tag-uri de eroare automate și raportul zilnic.
- La final de săptămână: recenzia, cu un obiectiv de proces.
- Etapa de nivel numără aceste recenzii.

**Firele spiralei:**
- Proces: firul de Nivel 2 (playbook, rutine, recenzii);
- Psihologie: if-then împotriva biasurilor;
- Statistică: statistici pe setup, cu interval.

**Surse:**
- R5 PL-01–PL-17, PM-17, PSY-13, PSY-14, PSY-28, PSY-29, PSY-33, ST-05;
- R6 §6.3–6.4;
- R1 §2.17, §3.2 pct. 4, §4 pct. 11;
- [../U4-plan-and-decide.md](../U4-plan-and-decide.md) (L14, L15, L17).

#### 2.13.1 · Thinking in scenarios  ·  `L15`
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Describe the bullish, bearish and sideways cases before entering a trade
  2. Attach a trigger and a planned action to each case
  3. Judge a scenario plan by its coverage and execution, not by its profit
- **Concepte:** scenario-planning ✓, false-breakout ✓, gap-risk ✓, base-rates ✓, counterfactual-thinking ✓
- **Se sprijină pe:** L06 (1.5), L11 (1.4), L14 (1.6). În scriptul L15 apar ca L06, L11 și L14. Legăturile noi: 2.8.4 și 2.8.8 (breakout vs fakeout), 2.10.9 (cazul cu eveniment).
- **Hook:**
  - **Tip:** predict, cu alegere între „Breaks out above 60.50”, „Falls below 59.00” și „Stays inside the range”.
  - **Situația:** range-ul LABX 59.00–60.50, ultima închidere 60.10, iar următoarele 6 lumânări sunt sub văl.
  - **Răspuns:** niciun răspuns unic. Sub văl e un false breakout (60.62, 60.18, 59.80), iar planul avea deja o acțiune pentru el.
- **Interacțiunea centrală:** (7 beat-uri, scriptul din [../U4-plan-and-decide.md](../U4-plan-and-decide.md))
  - **B1 · explain.**
  - **B2 · figure:** cele patru drumuri: bullish, false breakout, bearish, sideways.
  - **B3 · match:** trigger ↔ acțiune:
    - două închideri peste 60.50 ↔ cumperi lângă 60.80, stop 59.90, țintă 62.60;
    - o închidere, apoi înapoi ↔ fără intrare;
    - o închidere sub 59.00 ↔ renunți la ideea long;
    - prețul rămâne în range ↔ aștepți.
  - **B4 · reveal:** false breakout-ul.
  - **B5 · explain:** planul trebuie să fie acceptabil în fiecare caz; ratele de bază vin din jurnal.
  - **B6 · callout:** cinci întrebări, inclusiv evenimentul care poate sări peste stop.
  - **B7 · predict:** Trader A (plan respectat, −1R) vs Trader B (plan încălcat, +2R). Răspunsul: A.
- **Try:**
  - **Widget:** risk-reward, cu câmpurile entry / stop / target (PLAN_LEARN §9.1).
  - **Valori de start:** stop 59.90 și țintă 62.60, blocate; entry 61.40 (0.80 : 1).
  - **Obiectiv:** cea mai mare intrare care mai dă 2 : 1.
  - **Reușită:** 60.80.
- **Practică:** Arena: Breakout, Arena: False breakout, M06, M10, Knowledge check: scenario analysis. Nou la acest nivel: rutina de dinaintea pieței (2.13.3).
- **Check:** setul propus în U4:
  - q-sa-3: trigger-ul;
  - q-sa-4: cazul cel mai prost, acceptabil;
  - q-sa-6: acoperirea și execuția.
- **Dovezi:**
  - **Mechanic:** aritmetica R:R;
  - planificarea pe scenarii e un instrument de proces (R5 PL-06);
  - **B** pentru planurile if-then (PSY-28 [BK]).
- **Necesită:** widget-ul risk-reward extins (cerințele sunt în U4); niciun S nou
- **Termeni noi de glosar:** scenario-analysis, trigger (propuși în nota scriptului L15)
- **Schimbări față de script:** doar trimiterile. B6 (cele cinci întrebări) trimite acum și la checklist-ul din 2.10.9.

#### 2.13.2 · Building a playbook
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Write a setup card with regime, trigger, invalidation, management, re-entry and no-trade conditions
  2. Make every field checkable, so two people would agree on it
  3. Keep statistics per setup, with their sample size, before trusting or dropping a setup
- **Concepte:** setup-card (nou), trading-plan ✓, invalidation-level ✓, base-rates ✓, expectancy-confidence-interval (2.11.7)
- **Se sprijină pe:** L14 (1.6), 2.8, 2.11.7
- **Hook:**
  - **Tip:** predict, slider 0–60.
  - **Prompt:** "Your journal has 60 trades tagged with 9 different setup names. On average, how many trades does each setup have to be judged on?"
  - **Răspuns:** 6.7. Prea puține ca să judeci vreunul.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** un card complet: pullback în trend, din 2.8.3 (R5 PL-03; PL-01, pct. 3). Câmpurile:
    - numele;
    - piața și timeframe-ul;
    - regimul;
    - trigger-ul;
    - tipul de ordin;
    - regula de stop;
    - țintele și managementul;
    - regula de re-intrare;
    - condițiile de no-trade (un eveniment în 15 minute, regim neclar);
    - nota de calitate A / B / C;
    - statutul de dovezi (untested / sim-tested / live-small / validated) și nota din curs (C);
    - statisticile: n, win rate, R mediu, MAE/MFE, intervalul.
  - **B3 · hotspot:** un card fără invalidare. „Tap what's missing.”
  - **B4 · match:** vag ↔ verificabil. De exemplu, „strong trend” ↔ „price above the rising 50 MA with two higher lows”.
  - **B5 · worked:** statisticile pe setup. Setup-ul A: 32 de trade-uri, +0.35R (± 0.59); setup-ul B: 28 de trade-uri, −0.10R (± 0.63). Ambele intervale (sd 1.7R) includ zero, deci încă nu se poate judeca niciunul.
  - **B6 · callout:** "No card, no trade." Specializează-te: 1–2 setup-uri, până la ≈ 100 de trade-uri (R6 §6.3).
- **Try:**
  - **Widget:** `setup-card-builder` (nou, S15). Utilizatorul scrie 2 carduri din strategiile din 2.8.
  - **Validatorul verifică:**
    - toate câmpurile sunt prezente și verificabile (praguri numerice sau observabile da / nu);
    - regula de stop vine din structură sau din ATR;
    - există cel puțin o condiție de no-trade;
    - nota de dovezi e completată.
  - **Reușită:** ambele carduri trec.
- **Practică:** tichetul de ordin cere tag-ul unui card (R5 PL-03). Trade-urile fără tag se punctează ca off-plan. Fiecare card își construiește pagina de statistici.
- **Check:**
  1. câmpurile cardului;
  2. verificabilitatea;
  3. statisticile pe setup, cu n.
- **Dovezi:** instrument de proces (R5 PL-03; R6 §6.3). Nota se aplică fiecărui setup, nu cardului.
- **Necesită:** S15, S13 (statistici pe setup)
- **Termeni noi de glosar:** setup-card

#### 2.13.3 · The pre-market routine
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Run a fixed routine before each session: readiness, calendar, regime, levels, scenarios, risk for the day
  2. Catch the event or limit that changes today's plan before the first order
  3. Write two or three if-then scenarios for the session
- **Concepte:** pre-market-routine (nou), scenario-planning ✓, economic-calendar (2.10.2), market-regime (2.8.1), portfolio-heat (2.11.2)
- **Se sprijină pe:** 2.13.1, 2.13.2, 2.10.2, 2.11.4
- **Hook:**
  - **Tip:** predict, cu alegere între „Enter at 15:00”, „Wait until after the release and normal spreads” și „Enter at half size”.
  - **Prompt:** "It's 14:50 in Bucharest, in July. US CPI comes out at 15:30 Bucharest time. You plan to open a LABX swing trade at 15:00 with a stop 0.80 away. What does a routine catch?"
  - **Răspuns:** așteptarea. „Half size” e acceptat dacă așa scrie planul. Rutina e cea care prinde evenimentul.
- **Interacțiunea centrală:**
  - **B1 · explain** (R5 PL-05).
  - **B2 · order:** rutina:
    1. verificarea de pregătire;
    2. ce s-a întâmplat peste noapte;
    3. calendarul;
    4. eticheta de regim;
    5. nivelurile-cheie;
    6. scenariile if-then;
    7. watchlist-ul;
    8. riscul maxim și heat-ul pentru ziua respectivă.
  - **B3 · hotspot:** pe ecranul de „session start”: „Tap the item that changes today's plan.” Ținta: evenimentul roșu de la 15:30.
  - **B4 · explain:** verificarea de pregătire: somn, stres, boală. Dacă pică, risc redus sau doar simulator (R5 PSY-26).
  - **B5 · match:** pasul din rutină ↔ eroarea pe care o previne:
    - calendarul ↔ E-EVENT;
    - riscul maxim ↔ E-LIMIT;
    - regimul ↔ strategia greșită;
    - nivelurile ↔ intrarea urmărită (chasing).
  - **B6 · callout.**
- **Try:**
  - **Widget:** ecranul `session-start` (nou; din R5 PL-05). Calendarul și un rezumat de context. Utilizatorul completează eticheta de regim, 2 niveluri-cheie, 2–3 scenarii if-then, riscul maxim pentru zi și pregătirea.
  - **Reușită:**
    - toate câmpurile completate;
    - riscul zilnic maxim ≤ limita zilnică din plan;
    - cel puțin un scenariu acoperă evenimentul programat.
- **Practică:** orice sesiune de Practice sau Arena poate începe cu rutina (comutator). KPI: rutine completate.
- **Check:**
  1. pașii;
  2. ce prinde rutina;
  3. scenariile.
- **Dovezi:** **B/C**: rutinele și reglarea anticipativă (PSY-27, studiu calitativ; PSY-28 [BK]); instrument de proces (PL-05).
- **Necesită:** S5, S6, S15
- **Termeni noi de glosar:** pre-market-routine, readiness-check

#### 2.13.4 · If-then plans
- **Nivel / durată / tip:** Intermediate · 6 min · Core
- **Obiective:**
  1. Turn a vague intention into an if-then rule with an observable trigger and one action
  2. Write if-then rules for market events and for your own emotional triggers
  3. Check after the session which rules fired and whether you followed them
- **Concepte:** if-then-plans (nou), scenario-planning ✓, behavioural-guard-rails (2.12.7)
- **Se sprijină pe:** 2.13.1, 2.13.3, 2.12.7, L13
- **Hook:**
  - **Tip:** predict, cu alegere între „A” și „B”.
  - **Prompt:** "Which plan is easier to follow under pressure? A: 'Be careful around news.' B: 'If a red event is within 15 minutes, then I place no new orders.'"
  - **Răspuns:** B.
- **Interacțiunea centrală:**
  - **B1 · explain:** intențiile de implementare (Gollwitzer [BK]; R5 PSY-28, PL-06).
  - **B2 · match:** vag ↔ if-then:
    - „Don't chase” ↔ „If price is more than 2 ATR above the 20 EMA, then I wait for a pullback”;
    - „Control your losses” ↔ „If I lose two trades in a row, then I pause for 15 minutes”;
    - „Respect the range” ↔ „If a candle closes outside the range, then I stop range trading and switch to the breakout card”.
  - **B3 · worked:** de la scenarii la reguli. Cele patru scenarii din L15 devin patru reguli if-then.
  - **B4 · figure:** după sesiune, lista regulilor, fiecare marcată „fired / followed”, cu procentul de aderență.
  - **B5 · predict:** "A rule fired and you didn't follow it. What goes in the journal?" Răspunsul: tag-ul de eroare și regula.
  - **B6 · callout.**
- **Try:**
  - **Widget:** `if-then-editor` (nou). 5 reguli vagi de rescris.
  - **Validatorul cere:** un trigger observabil (preț, oră, număr, eveniment, stare măsurată) și o singură acțiune.
  - **Reușită:** toate 5 valide.
- **Practică:** regulile if-then se salvează pe sesiune și se marchează după sesiune ca declanșate și respectate (R5 PL-06). KPI: aderența.
- **Check:**
  1. structura;
  2. trigger-ele de piață și cele emoționale;
  3. verificarea de după sesiune.
- **Dovezi:** **B**: intențiile de implementare (Gollwitzer [BK], de verificat; R5 PSY-28).
- **Necesită:** S15, S14
- **Termeni noi de glosar:** if-then-plan

#### 2.13.5 · The error taxonomy
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Tag process errors from a fixed list instead of free text
  2. Compute the cost of each error in R against the same trade done by the rules
  3. Separate mistakes, which you fix, from variance, which you accept
- **Concepte:** error-taxonomy (nou), decision-quality ✓, journaling ✓, mistake-vs-variance (din 1.6)
- **Se sprijină pe:** L17 (1.6), 2.13.2, 2.12
- **Hook:**
  - **Tip:** predict, slider −5R … +5R.
  - **Prompt:** "This month: 40 trades, net −3.0R. Trades tagged 'stop widened' cost −6.4R compared with the same trades done by the rules. What would the month have been without that one error?"
  - **Răspuns:** +3.4R.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · match:** rând de jurnal ↔ tag (R5 PL-09):
    - E-SETUP: niciun setup, FOMO;
    - E-SIZE: mărimea se abate de la plan cu peste 10%;
    - E-STOP-NONE, E-STOP-WIDEN;
    - E-EXIT-EARLY, E-EXIT-LATE;
    - E-AVG-DOWN, E-REVENGE;
    - E-LIMIT, E-EVENT, E-HEAT, E-CHASE, E-JOURNAL.
    - Corespondența cu tag-urile de debriefing existente: `chased_entry`, `no_stop`, `moved_stop_away`, `revenge_size_up`, `broke_playbook`, `missed_valid_setup`.
  - **B3 · worked** cu input: costul erorii, contrafactual: −3.0 − (−6.4) = +3.4R.
  - **B4 · figure:** Pareto-ul costurilor erorilor pe lună.
  - **B5 · match:** sortatorul în două coșuri: 6 trade-uri pierzătoare → greșeală sau varianță (PL-15).
  - **B6 · callout:** "Fix the biggest bar first." Utilizatorul alege un singur exercițiu.
- **Try:**
  - **Widget:** `error-tagger` (nou). 8 trade-uri, cu fragmente de reluare. Pe fiecare: un tag, sau „Clean”. Apoi costul total al erorilor.
  - **Reușită:** cel puțin 7 tag-uri din 8 corecte și costul total ± 0.1R.
- **Practică:**
  - detecție automată în simulator (S14), plus tag-uri puse de utilizator pentru cele subiective (E-EXIT-EARLY);
  - Pareto-ul lunar;
  - condiția de nivel „costul erorilor în scădere”.
- **Check:**
  1. tag-urile;
  2. costul erorilor;
  3. greșeală vs varianță.
- **Dovezi:** instrument de proces (R5 PL-09, PL-15). Aritmetica contrafactuală e **Mechanic**.
- **Necesită:** S14, S15
- **Termeni noi de glosar:** error-tag, error-cost

#### 2.13.6 · Daily and weekly reviews
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Run a five-to-ten-minute daily review that grades decisions, not profit
  2. Run a weekly review by setup, time of day and error tag, ending with one process goal
  3. Review in blind replay so hindsight doesn't rewrite your decisions
- **Concepte:** trading-reviews (nou), journaling ✓, decision-quality ✓, counterfactual-thinking ✓
- **Se sprijină pe:** L17 (1.6), 2.13.5, 2.11.6
- **Hook:**
  - **Tip:** predict, cu alegere între „The +2.6R trade” și „The skipped trade”.
  - **Prompt:** "Monday's best trade made +2.6R. The best decision of the day was skipping a trade that would have broken your rules. Which goes in the review as 'best'?"
  - **Răspuns:** decizia.
- **Interacțiunea centrală:**
  - **B1 · explain:** raportul zilnic (R5 PL-10).
  - **B2 · order:** recenzia zilnică:
    1. KPI-urile de proces ale zilei;
    2. cea mai bună și cea mai proastă decizie;
    3. pentru fiecare pierdere: greșeală sau varianță;
    4. o lecție;
    5. pregătirea pentru mâine.
  - **B3 · explain:** recenzia săptămânală (R5 PL-11):
    - statistici pe setup, oră, instrument și tag de eroare;
    - curba de capital față de coridorul așteptat;
    - un obiectiv de proces;
    - o notă de „best practices” (Steenbarger [S65]).
  - **B4 · hotspot:** pe tabelul săptămânii: „Tap the cell your next goal should come from.” Ținta: cel mai mare cost de eroare, E-CHASE în primele 30 de minute.
  - **B5 · explain:** reluarea oarbă (PL-16, PSY-13): graficul se oprește la punctul de decizie.
  - **B6 · callout:** 4 recenzii săptămânale la rând fac parte din etapa de nivel.
- **Try:**
  - **Widget:** `weekly-review` (nou, asistent), pe o săptămână sintetică de 25 de trade-uri. Utilizatorul citește statisticile și alege un obiectiv de proces din 5 variante.
  - **Reușită:** obiectivul ales țintește cel mai mare cost de eroare și e un obiectiv de proces (nu „make 5%”).
- **Practică:** recenzia săptămânală în aplicație (etapa de nivel: 4 la rând); raportul zilnic generat automat.
- **Check:**
  1. recenzia zilnică;
  2. recenzia săptămânală și obiectivul unic;
  3. reluarea oarbă.
- **Dovezi:** instrumente de proces (R5 PL-10, PL-11, PL-16). **B** pentru hindsight bias (Fischhoff 1975; R5 PSY-13).
- **Necesită:** S15
- **Termeni noi de glosar:** daily-review, weekly-review, blind-replay

#### 2.13.7 · KPIs and goals
- **Nivel / durată / tip:** Intermediate · 7 min · Core
- **Obiective:**
  1. Build a balanced KPI set: process KPIs as the grade, outcome KPIs as diagnostics with their sample size
  2. Set weekly goals you fully control
  3. Change a rule only through a written process, not after a few losses
- **Concepte:** process-goals (nou), rule-change-governance (nou), decision-quality ✓, process-kpis (din 1.6)
- **Se sprijină pe:** 2.13.6, 2.11.6, 2.11.7
- **Hook:**
  - **Tip:** predict, cu alegere între „Make +3R”, „Win 60% of trades” și „Place every stop before entry”.
  - **Prompt:** "Which goal can you fully control this week?"
  - **Răspuns:** stopul pus înainte de intrare.
- **Interacțiunea centrală:**
  - **B1 · explain:** setul echilibrat (R5 PL-13, PM-17):
    - proces: plan adherence, risk accuracy, stop integrity, respectarea limitelor și a heat-ului, checklist, completitudinea jurnalului, costul erorilor, rata de execuție a setup-urilor A;
    - rezultat: expectancy, win rate, payoff, PF, max DD, SQN, cu interval, gri până la n ≥ 30;
    - comportament: disposition, riscul după pierdere, evenimentele de revenge, tilt index.
  - **B2 · match:** KPI ↔ categorie.
  - **B3 · worked** cu input:
    - risk accuracy: risc planificat 100.00; real 92.00, 108.00 și 100.00. Abaterile: 8%, 8% și 0%; media 5.33%, deci 94.7%;
    - scorul de disciplină: 3 încălcări în 60 de decizii = 95% (R5 PSY-29).
  - **B4 · explain:** obiective de proces vs obiective de rezultat (PSY-33). Obiectivele de rezultat împing spre poziții prea mari la final de perioadă.
  - **B5 · order:** guvernarea schimbării regulilor (R5 PL-14):
    1. notezi ideea;
    2. o ipoteză;
    3. un prag de dovadă (30–50 de trade-uri sau un test);
    4. testul în simulator;
    5. o versiune nouă a planului.
  - **B6 · predict:** "After three losses, change the stop rule?" Răspunsul: notezi ideea și aștepți pragul de dovadă.
- **Try:**
  - **Widget:** `kpi-setup` (nou). Utilizatorul alege 3 obiective de proces pentru săptămâna viitoare, fiecare cu o țintă numerică pe care aplicația o poate măsura (de exemplu: stop integrity 100%, risk accuracy ≥ 95%, rutina 5 din 5). Apoi răspunde la o cerere de schimbare a unei reguli.
  - **Reușită:** 3 obiective de proces valide, iar la cerere: „log and test”.
- **Practică:** dashboard-ul KPI (PM-17) ca ecran principal; urmărirea obiectivului săptămânal.
- **Check:**
  1. KPI-urile echilibrate;
  2. obiectivele controlabile;
  3. guvernarea schimbării regulilor.
- **Dovezi:**
  - **B:** outcome bias, replicat într-un studiu preînregistrat din 2023, cu n = 692. De aici KPI-urile de proces (R5 PSY-14);
  - obiectivele de proces: Steenbarger [S65] (R5 PSY-33).
  - Mai departe: 3.11 (guvernarea regulilor, cu backtest).
- **Necesită:** S15, S14
- **Termeni noi de glosar:** process-goal, kpi

---

## Unitatea 2.14 · Instruments I: stocks, forex, CFDs (8 lecții)

**Scop:** mecanica instrumentelor pe care le întâlnește cel mai des un trader retail din România:
- acțiuni și ETF-uri, inclusiv dividende, split-uri și ETF-urile cu levier;
- short selling;
- cotațiile forex, pipși și loturi;
- swap și rollover;
- indici și CFD-uri;
- marjă, close-out și negative balance protection;
- costurile pe instrument;
- regulile pe jurisdicții, cu dată.

**Tip:** Core pentru cine tranzacționează acțiuni, FX sau CFD-uri (README §2).

**De ce aici:**
- Utilizatorul are deja un proces complet. Instrumentul schimbă trei lucruri:
  - dimensionarea (loturi, valoarea pipului);
  - costurile (finanțare, împrumut);
  - riscul (levier, close-out).
- Ordinea urmează R6 §7: bazele acțiunilor în Stage 1, mecanica forex, levierul și CFD-urile în Stage 2.
- R1 §3.3 arată că valoarea pipului și relația marjă / levier / risc sunt locurile unde începătorii se pierd cel mai des, pentru că sunt predate o dată și nu mai sunt exersate.
- Unitatea e ultima din nivel ca să poată fi luată când utilizatorul trece la o piață anume.
- Futures, mărfurile, crypto și obligațiunile sunt în 3.14; brokerii și banii clienților, în 4.5.

**Se sprijină pe:**
- 1.1: cotații, P&L long și short;
- 1.4: L12, levier și marjă, sizing;
- 2.9.8: ora rollover-ului;
- 2.10.9: NBP, pe scurt;
- 2.11.

**Datarea:** toate regulile sunt la data de **22.10.2026** și se revizuiesc cel puțin o dată pe an (R6 §7, „Regulatory freshness”). Cele marcate [PK] sau „de verificat” se confirmă la sursa oficială înainte de publicare (README §12).

**Checkpoint:** 12 întrebări:
- data ex-dividend și split-ul;
- costul short-ului;
- valoarea pipului (inclusiv perechile cu JPY și cele cu USD ca bază);
- nopțile de swap;
- finanțarea CFD;
- prețul de close-out;
- plafoanele ESMA;
- statutul regulii PDT, cu dată.

Plus o sarcină: dimensionarea în loturi a unui trade FX. La ≥ 80%, lecțiile se marchează „Tested out”.

**Laboratorul unității: Instrument desk.**
- Aceeași idee (long, risc 1%, stop la 2 × ATR, ținută 1, 5 sau 30 de zile) se exprimă prin trei vehicule: acțiunea LABX, CFD-ul pe LABX și vEUR/vUSD.
- Aplicația arată, pentru fiecare: unitățile sau loturile, marja, finanțarea și chitanța completă de costuri, în R.
- Selectorul de jurisdicție (UE / UK / SUA) aplică plafoanele.
- Scorul:
  - dimensionarea corectă;
  - rezerva față de close-out păstrată;
  - comparația costurilor corectă.

**Firele spiralei:**
- Costuri: pe instrument;
- Risc: levier, marjă, NBP;
- Proces: regulile datate intră în plan.

**Surse:**
- R6 §0.2, §3.0–3.2, §3.4, §4.5, §5.1, §5.4, §6.2;
- R5 RF-16–RF-21, RR-01, RR-05;
- R1 §1.7, §2.20–2.22, §3.3, §4 pct. 14;
- R3 §2.19, §3.8.

#### 2.14.1 · Stocks and ETFs
- **Nivel / durată / tip:** Intermediate · 7 min · Core pentru acțiuni, FX și CFD-uri
- **Obiective:**
  1. Explain what a share and an ETF are, and where and when they trade
  2. Show why buying just before the ex-dividend date gains nothing before costs and taxes
  3. Explain why a leveraged ETF can lose value in a choppy market even when the index ends flat
- **Concepte:** stocks-and-etfs (nou), corporate-actions (nou), trading-costs ✓, market-hours (2.9.1)
- **Se sprijină pe:** 1.1, 2.9.1, 2.9.3 (licitațiile)
- **Reglementare (datată 22.10.2026):**
  - decontarea în SUA: T+1, din mai 2024 [PK];
  - în UE: T+2, cu trecerea la T+1 planificată pentru octombrie 2027 [PK, de verificat] (R6 §3.1);
  - burse: NYSE și Nasdaq; Xetra, Euronext și LSE; BVB în România.
- **Hook:**
  - **Tip:** predict, cu alegere între 51.00, 50.00 și 49.00.
  - **Prompt:** "LABX, as a stock, closes at 50.00 and pays a 1.00 dividend; tomorrow is the ex-dividend date. You buy today to 'collect' it. If nothing else changes, what is each share worth at tomorrow's open, dividend included?"
  - **Răspuns:** 50.00 (49.00 + 1.00), din care se mai scad costurile și taxele.
- **Interacțiunea centrală:**
  - **B1 · explain:** acțiunile și ETF-urile. Mecanismul de creare și răscumpărare ține prețul ETF-ului aproape de NAV; există un expense ratio; la stres apar prime și discounturi.
  - **B2 · worked** cu input, ex-dividend:
    - 100 de unități, cumpărate la ask 50.00 și vândute după data ex la bid 48.90 (mid 48.95);
    - dividendul încasat: 100.00;
    - rezultatul: −110.00 + 100.00 − 2.50 − 2.45 = **−14.95**, înainte de taxe.
  - **B3 · predict:** un split 2-la-1 la 120.00 dă 60.00, cu unitățile dublate și aceeași valoare. Datele pentru backtest trebuie ajustate (R6 §3.1).
  - **B4 · worked:** decay-ul ETF-ului cu levier (R6 §3.1.9):
    - indicele face +10%, apoi −9.09%, și ajunge pe zero;
    - ETF-ul 2× face +20%, apoi −18.18%, și ajunge la −1.8%.
  - **B5 · match:** evenimentul corporativ ↔ efectul: dividend, split, reverse split, emisiune secundară (diluare), spin-off.
  - **B6 · callout:** licitațiile și orele extinse au lichiditate mică și spread-uri mai largi.
- **Try:**
  - **Widget:** `ex-dividend` (nou; exercițiul din R6 §3.1). Utilizatorul plasează trade-ul.
  - **Reușită:** rezultatul net −14.95 (± 0.01) și motivul: prețul scade cu dividendul, iar costurile rămân.
- **Practică:** modul acțiuni S10 (dividende, split-uri); decay-ul ETF-ului cu levier pe R3, pe 6 luni (R6 §3.1).
- **Check:**
  1. acțiuni și ETF-uri;
  2. data ex-dividend;
  3. decay-ul ETF-ului cu levier.
- **Dovezi:** **Mechanic** (scăderea la data ex, split-urile, aritmetica resetării zilnice). Datele de decontare sunt [PK].
- **Necesită:** S10
- **Termeni noi de glosar:** share, dividend, ex-dividend-date, stock-split, leveraged-etf (etf vine din 0.1)

#### 2.14.2 · Short selling
- **Nivel / durată / tip:** Intermediate · 7 min · Core pentru acțiuni, FX și CFD-uri
- **Obiective:**
  1. Explain how a short sale works: borrowed shares, borrow fee, dividends owed and recall
  2. Size a short so a gap or squeeze beyond the stop is survivable
  3. Name the US short-sale rules that change how orders fill
- **Concepte:** short-selling (nou), gap-risk ✓, position-sizing ✓, stocks-and-etfs (2.14.1)
- **Se sprijină pe:** 1.1 (long și short), 2.14.1, 2.9.8 (dimensionarea pentru gap)
- **Reglementare (datată 22.10.2026, SUA; R6 §3.1):**
  - **Reg SHO Rule 203 (locate):** înainte de short, brokerul trebuie să aibă motive rezonabile să creadă că acțiunile se pot împrumuta.
  - **Rule 204:** o livrare eșuată dintr-un short se închide până la deschiderea zilei de decontare de după decontare.
  - **Rule 201 (SSR):** după o scădere intraday de cel puțin 10% față de închiderea anterioară, short-ul e permis doar peste cel mai bun bid național, în ziua respectivă și în următoarea.
  - **Rule 200:** ordinele se marchează long sau short.
  - **Taxa de împrumut:** sub 1% pe an pentru titlurile „general collateral”; zeci sau sute de procente pe an pentru cele greu de împrumutat; împrumutătorul poate cere acțiunile înapoi oricând [PK, de verificat].
  - Regulile UE de short selling nu sunt acoperite de cercetare (propus pentru 4.5).
  - La CFD-uri, short-ul e simetric, dar are finanțare (2.14.5).
- **Hook:**
  - **Tip:** predict, cu alegere între „50.00 per unit”, „100.00 per unit” și „No cap”.
  - **Prompt:** "Long LABX at 50.00: the most you can lose is 50.00 per unit. Short at 50.00: what is the most?"
  - **Răspuns:** nu există plafon.
- **Interacțiunea centrală:**
  - **B1 · explain:** mecanica.
  - **B2 · worked** cu input: short la 50.00, stop la 52.00 → **48 de unități** (98.45; 49 ar pierde 100.51).
  - **B3 · reveal:** un squeeze peste noapte, cu deschiderea la 56.00. Pierderea: 48 × 6.00 + 1.20 + 1.35 = 290.55, adică 2.95 × planul.
  - **B4 · worked:** taxa de împrumut pe 2,400.00 (48 × 50.00), pe 10 zile:
    - la 30% pe an: 19.73;
    - la 0.5% pe an: 0.33.
  - **B5 · match:** regulă ↔ efect: locate, SSR, close-out, recall.
  - **B6 · callout:** GameStop, ianuarie 2021, ca poveste de squeeze [PK].
- **Try:**
  - **Widget:** `short-drill` (nou; exercițiul de short squeeze din R6 §3.1).
  - **Date:** short de 10 zile cu 48 de unități; taxa de împrumut 30% pe an; un dividend de 0.50 în perioadă; prețul coboară de la 50.00 la 49.00 (inclusiv scăderea de la data ex).
  - **Reușită:** costul total al short-ului: 19.73 (împrumut) + 24.00 (dividendul datorat) + 1.20 + 1.18 (comisioane) = **46.11** (± 0.01). Față de un câștig brut de 48.00, rămân 1.89.
- **Practică:** modul short din S10, cu niveluri de taxă de împrumut și recall; exercițiul SSR (R6 §3.1): după o zi de −10%, ordinele short la bid sunt respinse.
- **Check:**
  1. mecanica și costurile;
  2. dimensionarea față de un squeeze;
  3. regulile din SUA.
- **Dovezi:** **Mechanic** (pierderea fără plafon, împrumutul, dividendul datorat). Regulile Reg SHO au dată (R6 §3.1); taxele de împrumut sunt [PK].
- **Necesită:** S10
- **Termeni noi de glosar:** borrow-fee, short-squeeze, locate, short-sale-restriction

#### 2.14.3 · Forex mechanics
- **Nivel / durată / tip:** Intermediate · 7 min · Core pentru acțiuni, FX și CFD-uri
- **Obiective:**
  1. Read a currency quote: base, quote, pip and pipette
  2. Compute pip value per lot for USD-quoted, yen and USD-base pairs
  3. Size an FX trade in lots from the stop distance in pips and your risk budget
- **Concepte:** forex-quotes (nou), position-sizing ✓, bid-ask-spread ✓, leverage ✓
- **Se sprijină pe:** 1.1, 1.4 (L09, L12), 2.9.2
- **Reglementare (datată 22.10.2026):** plafoanele de levier retail pentru FX:
  - UE și UK: 30:1 pe majore, 20:1 pe restul;
  - SUA: 50:1 și 20:1 (CFTC / NFA) [PK];
  - 500:1 la brokerii offshore e un semnal de alarmă (R6 §3.2).
  - Detaliile sunt în 2.14.6 și 2.14.8.
- **Faptele** (R6 §3.2):
  - EUR/USD 1.1000 înseamnă că 1 euro costă 1.10 dolari;
  - majore, cross-uri și exotice (EUR/RON e exotică: spread-uri largi, swap mare);
  - loturile: 100,000 / 10,000 / 1,000 / 100;
  - valoarea pipului: $10 pe lot standard la perechile cotate în USD; ¥1,000 la perechile cu JPY; la perechile cu USD ca bază variază (≈ $6.87 la USD/CHF 1.4555);
  - volumul pieței: ≈ $7.5 trilioane pe zi în 2022 și ≈ $9.6 trilioane în 2025 (BIS) [PK, de verificat];
  - piața e OTC, fără un preț unic.
- **Hook:**
  - **Tip:** predict, slider 0.01–1.00 loturi.
  - **Prompt:** "Account 10,000.00 vUSD, risk 1% = 100.00. vEUR/vUSD, stop 25 pips. How many lots?"
  - **Răspuns:** 0.40 loturi (4 mini-loturi, 40,000 de unități), înainte de costuri.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · match:** pereche ↔ categorie: majoră, cross, exotică.
  - **B3 · worked** cu input, valoarea pipului pe lot standard:
    - vEUR/vUSD: 100,000 × 0.0001 = 10.00 vUSD;
    - vUSD/vJPY la 150.00: 100,000 × 0.01 = 1,000 vJPY = 6.67 vUSD;
    - vUSD/vCHF la 1.2500: 10 ÷ 1.25 = 8.00 vUSD.
  - **B4 · worked:** loturi = risc ÷ (pipși de stop × valoarea pipului pe lot). Cu un spread de 1 pip adăugat la distanță: 100 ÷ (26 × 10) = 0.38 loturi.
  - **B5 · predict:** "Does 30:1 maximum leverage make this 0.40-lot trade riskier?" Răspunsul: nu. Riscul vine din stop și din mărime (R5 RF-16).
  - **B6 · callout.**
- **Try:**
  - **Widget:** `fx-size` (nou; exercițiul din R6 §3.2). 4 cazuri, cu loturile rotunjite în jos la 0.01:
    1. vEUR/vUSD, stop 25 de pipși → 0.40;
    2. vEUR/vUSD, stop 32 → 0.31;
    3. vUSD/vJPY la 150.00, stop 40 → 0.37;
    4. vUSD/vCHF la 1.2500, stop 25 → 0.50.
  - **Reușită:** toate 4.
- **Practică:** modul FX din S10; o pereche FX pe R1 / R2; exercițiul de sesiuni (2.9.2).
- **Check:**
  1. cotația;
  2. valoarea pipului;
  3. loturile.
- **Dovezi:** **Mechanic**. Volumul BIS e [PK].
- **Necesită:** S10
- **Termeni noi de glosar:** currency-pair, pip, lot, pip-value

#### 2.14.4 · Swap and rollover
- **Nivel / durată / tip:** Intermediate · 6 min · Core pentru acțiuni, FX și CFD-uri
- **Obiective:**
  1. Explain the overnight swap: the interest difference you pay or earn for holding FX past rollover
  2. Count the swap nights in a holding period, including the triple Wednesday
  3. Express financing in R for a swing trade, and see why carry has crash risk
- **Concepte:** overnight-financing (nou), fx-rollover (2.9.8), forex-quotes (2.14.3), trading-costs ✓
- **Se sprijină pe:** 2.9.8, 2.14.3
- **Faptele** (R6 §3.2; R3 §3.8 [BK]):
  - pozițiile ținute după ≈ 17:00 New York se reportează;
  - traderul plătește sau încasează diferența de dobândă;
  - rollover-ul de miercuri se triplează, pentru weekend;
  - adaosul brokerului face creditele mai mici și debitele mai mari;
  - conturile fără swap îl înlocuiesc cu taxe [PK].
- **Hook:**
  - **Tip:** predict, slider 5–8.
  - **Prompt:** "You hold an FX position from Monday morning to the next Monday morning. How many nights of swap do you pay?"
  - **Răspuns:** 7: luni, marți, miercuri × 3, joi, vineri.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · figure:** calendarul cu momentele de rollover: 00:00 în București, 23:00 în săptămânile nealiniate.
  - **B3 · worked:** cu un swap de −8.00 pe lot standard pe noapte: 7 × −8.00 = −56.00 pe lot.
  - **B4 · worked** cu input, în R:
    - 0.40 loturi, deci −3.20 pe noapte;
    - de marți la vineri: −16.00, adică 0.16R;
    - de luni la luni: −22.40, adică 0.22R.
  - **B5 · predict:** "The pair pays you +5.00 per lot per night. Free money?" Răspunsul: nu. Carry-ul adună sume mici și constante, cu prăbușiri rare și mari (skew negativ): A, cu riscul de crash (R6 §2.10). Exemple: întoarcerea yenului din 2008, lichidarea din august 2024 [PK]. Mai departe: 3.13 și R8.
  - **B6 · callout.**
- **Try:**
  - **Widget:** `swap-drill` (nou; exercițiul din R6 §3.2). 0.40 loturi vEUR/vUSD, swap −8.00 pe lot pe noapte; deschis marți la 10:00 și închis vineri la 10:00, ora României.
  - **Reușită:** 5 nopți, −16.00 (± 0.01) și 0.16R dintr-un risc de 100.00.
- **Practică:** swap-ul din S10; o poziție ținută peste o miercuri, în Practice; R8, opțional, ca previzualizare.
- **Check:**
  1. ce e swap-ul;
  2. numărarea nopților;
  3. finanțarea în R și riscul carry-ului.
- **Dovezi:** **Mechanic** (acumularea); convenția miercurii triple e [BK] (R3 §3.8); carry-ul e **A**, cu riscul de crash (R6 §2.10; Koijen, Moskowitz, Pedersen & Vrugt 2018).
- **Necesită:** S10, S5
- **Termeni noi de glosar:** swap, triple-swap, carry

#### 2.14.5 · Indices and CFDs
- **Nivel / durată / tip:** Intermediate · 7 min · Core pentru acțiuni, FX și CFD-uri
- **Obiective:**
  1. Explain the ways to get index exposure: futures, ETFs, options or CFDs
  2. Explain what a CFD is: an over-the-counter contract with the provider as counterparty
  3. Compute CFD overnight funding over different holding periods
- **Concepte:** cfds-and-indices (nou), overnight-financing (2.14.4), leverage ✓, exposure ✓
- **Se sprijină pe:** 2.14.1, 2.14.4, L12
- **Reglementare (datată 22.10.2026; R6 §3.4):**
  - CFD-urile nu sunt disponibile retailului din SUA (SEC / CFTC);
  - restricții în Hong Kong și Belgia;
  - CFD-urile pe crypto sunt interzise retailului din UK (data interdicției: de verificat);
  - plafoanele ESMA din 2018: în 2.14.8;
  - avertismentul obligatoriu din UE: 74–89% din conturile retail pierd.
- **Faptele** (R6 §3.4):
  - construcția indicilor: Dow ponderat cu prețul; S&P 500 ponderat cu capitalizarea; DAX ca indice de performanță [PK]; Nasdaq-100, concentrat;
  - finanțarea CFD = rata de referință ± adaosul (≈ 2–3% pe an [PK, de verificat]), zilnic, adesea triplată la weekend;
  - ajustări pentru dividende;
  - ținute luni de zile, CFD-urile costă adesea mai mult decât futures sau ETF-urile;
  - stop-urile garantate costă o primă [PK];
  - prețurile vin din fluxul furnizorului, inclusiv în afara orelor bursei („weekend indices”).
- **Hook:**
  - **Tip:** predict, slider de cost în vUSD.
  - **Prompt:** "You hold 10,000.00 vUSD of LABIX exposure through a CFD. Funding is 5.5% a year: a 3% benchmark plus a 2.5% markup. What does it cost over 180 days?"
  - **Răspuns:** 271.23.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · match:** tipul de indice ↔ construcția lui.
  - **B3 · worked** cu input, finanțarea:
    - 1 zi: 1.51;
    - 30 de zile: 45.21;
    - 180 de zile: 271.23, din care partea de adaos e 123.29.
  - **B4 · figure:** costurile, CFD față de ETF:
    - expense ratio-ul ETF-ului, 0.10% pe an, face 4.93 în 180 de zile;
    - ETF-ul blochează însă banii, al căror cost de oportunitate e rata de referință.
    - Ambele linii apar, cinstit.
  - **B5 · predict:** "Who is on the other side of your CFD?" Răspunsul: furnizorul, care adesea internalizează ordinele (conflictul B-book, detaliat în 4.5).
  - **B6 · callout.**
- **Try:**
  - **Widget:** `funding-cost` (nou; exercițiul din R6 §3.4).
  - **Reușită:**
    - 1.51, 45.21 și 271.23 (± 0.01);
    - la 180 de zile, utilizatorul alege vehiculul cu costul suplimentar mai mic, după datele afișate: ETF-ul.
- **Practică:** modul CFD din S10, cu finanțare; CFD-ul pe LABIX în Arena, când există S10.
- **Check:**
  1. căile spre expunerea pe indice;
  2. CFD-ul și contrapartida;
  3. calculul finanțării.
- **Dovezi:** **Mechanic**. Ratele de finanțare sunt [PK]; faptele de reglementare au dată.
- **Necesită:** S10
- **Termeni noi de glosar:** overnight-funding, stock-index (cfd vine din 0.1)

#### 2.14.6 · Margin, margin call and negative balance protection
- **Nivel / durată / tip:** Intermediate · 8 min · Core pentru acțiuni, FX și CFD-uri
- **Obiective:**
  1. Compute required margin, free margin and margin level for a leveraged position
  2. Find the price at which a 50% margin close-out would hit
  3. Explain why a close-out is a sizing failure, and what negative balance protection does and doesn't cover
- **Concepte:** margin-close-out (nou), negative-balance-protection (nou), leverage ✓, exposure ✓, position-sizing ✓
- **Se sprijină pe:** L12 (1.4), 2.14.3, 2.10.9
- **Reglementare (datată 22.10.2026):**
  - **UE și UK, CFD-uri retail:** close-out la 50% din marja necesară, pe cont; NBP obligatorie (ESMA 2018; FCA 2019).
  - **SUA, marjă pe acțiuni:** Reg T 50% inițial; mentenanță 25% (FINRA); minimum $2,000.
  - Firmele pot vinde poziții ca să acopere un apel în marjă. Sursele sunt secundare; de verificat în contractul brokerului (R5 RF-18; R1 §1.7).
- **Hook:**
  - **Tip:** predict, slider în pipși.
  - **Prompt:** "You have 5,000.00 vUSD and buy 1 standard lot of vEUR/vUSD at 1.1000, with 30:1 maximum leverage. How far can price fall before the 50% close-out?"
  - **Răspuns:** ≈ 317 pipși, adică 2.9%.
- **Interacțiunea centrală:**
  - **B1 · explain.**
  - **B2 · worked:** panoul de marjă, cu un capital de 10,000:
    - expunerea: 110,000;
    - marja necesară: 110,000 ÷ 30 = 3,666.67;
    - margin level: 272.7%;
    - free margin: 6,333.33;
    - levierul efectiv: 11:1.
  - **B3 · worked** cu input, close-out-ul cu un capital de 5,000:
    - close-out-ul vine la un capital de 50% × 3,666.67 = 1,833.33;
    - adică după o pierdere de 3,166.67 = 316.7 pipși, la prețul de 1.0683;
    - 63% din cont a dispărut, la un levier efectiv de 22:1.
  - **B4 · explain:** „Leverage multiplies volatility, not edge.” Mișcarea contului în % = mișcarea prețului în % × levierul efectiv. La 20 ×, o mișcare de 5% golește contul (R6 §4.5).
  - **B5 · predict:** NBP. La un gap dincolo de zero, contul retail UE pe CFD-uri se oprește la 0. Nu te protejează de pierderea până la zero și nu există peste tot.
  - **B6 · callout:** "A close-out is not a stop. It is what happens when the size was wrong."
- **Try:**
  - **Widget:** `close-out` (nou; exercițiul din R6 §3.4 și R5 RF-18).
  - **Obiectiv:** găsește prețul de close-out, apoi redimensionează poziția, ca un stop de 30 de pipși să riște 1% din 5,000 (50.00).
  - **Reușită:**
    - close-out la 1.0683 (± 1 pip);
    - 0.16 loturi (0.1667, rotunjit în jos);
    - levierul efectiv devine 3.52:1.
- **Practică:** modul de marjă din S11; gap-uri R4; NBP-ul arătat în Arena: Unexpected event.
- **Check:**
  1. cifrele de marjă;
  2. prețul de close-out;
  3. close-out-ul ca eșec de dimensionare și limitele NBP.
- **Dovezi:** **Mechanic**. Faptele de reglementare au dată (ESMA 2018, FCA 2019; R5 RF-17, RF-18, RR-05).
- **Necesită:** S11, S10
- **Termeni noi de glosar:** margin-level, free-margin, margin-call, margin-close-out, negative-balance-protection

#### 2.14.7 · Costs by instrument
- **Nivel / durată / tip:** Intermediate · 7 min · Core pentru acțiuni, FX și CFD-uri
- **Obiective:**
  1. List every cost of a trade: spread, commission, slippage, financing, borrow, taxes and opportunity cost
  2. Compare instruments by movement per unit of cost (the tradability ratio)
  3. Find the holding period at which the cheaper vehicle to enter becomes the more expensive one to hold
- **Concepte:** cost-stack (nou), trading-costs ✓, overnight-financing (2.14.4), cost-drag (2.9.7)
- **Se sprijină pe:** 2.9.7, 2.14.1–2.14.6
- **Hook:**
  - **Tip:** predict, cu 3 variante.
  - **Prompt:** "Which gives the most movement per unit of cost: LABX (ATR 2.00, cost 0.20), vEUR/vUSD (ATR 60 pips, cost 1.2 pips) or the LABIX CFD (ATR 40 points, spread 1.0)?"
  - **Răspuns:** vEUR/vUSD: 50, față de 10 (LABX) și 40 (LABIX).
- **Interacțiunea centrală:**
  - **B1 · explain:** stiva de costuri (R5 RR-03; R6 §5.1).
  - **B2 · worked** cu input: raportul de tranzacționabilitate = ATR ÷ (spread + comision) (R6 §6.2).
  - **B3 · match:** cost ↔ cine îl plătește cel mai mult:
    - spread-ul → tranzacționarea frecventă;
    - finanțarea → swing și position pe CFD sau FX;
    - împrumutul → short sellerii;
    - slippage-ul → breakout-urile și știrile;
    - costul de oportunitate → toată lumea (benchmark ghost).
  - **B4 · worked:** punctul de echilibru, pentru 5,000.00 de expunere pe LABX:
    - acțiunea: dus-întors 10.00 (50 de unități × 0.20), fără finanțare;
    - CFD-ul: dus-întors 5.00 (doar spread-ul), plus o finanțare de 5.5% pe an = 0.75 pe zi;
    - CFD-ul e mai ieftin până în ziua 6 (9.52); din ziua 7, acțiunea e mai ieftină (10.27 față de 10.00).
  - **B5 · explain:** linia costului de oportunitate. Acțiunea blochează 5,000 de bani. Cu linia inclusă, punctul de echilibru se mută mai târziu; aplicația o arată separat.
  - **B6 · callout.**
- **Try:**
  - **Widget:** `cost-lab`, în modul instrument. Aceeași expunere de 5,000, ținută 1, 7 și 30 de zile, ca acțiune și ca CFD.
  - **Reușită:**
    - ziua de echilibru: 7;
    - totalurile pe 30 de zile: acțiunea 10.00, CFD-ul 27.60 (5.00 + 22.60), ± 0.01.
- **Practică:** chitanța lunară de costuri din simulator (R5 RR-03); laboratorul Instrument desk.
- **Check:**
  1. stiva de costuri;
  2. raportul de tranzacționabilitate;
  3. punctul de echilibru după durata de ținere.
- **Dovezi:** **Mechanic** (R5 RR-03); **B** pentru Barber & Odean (costurile de turnover, [S31]).
- **Necesită:** S10, S15
- **Termeni noi de glosar:** tradability-ratio, cost-stack

#### 2.14.8 · Rules by jurisdiction
- **Nivel / durată / tip:** Intermediate · 8 min · Core pentru acțiuni, FX și CFD-uri
- **Obiective:**
  1. Name the main retail rules for CFDs and FX in the EU, the UK and the US, with their dates
  2. Explain the history of the US pattern day trader rule and what replaced it in 2026
  3. Check a broker's licence on the regulator's own register before trusting it
- **Concepte:** retail-regulation (nou), leverage ✓, negative-balance-protection (2.14.6), margin-close-out (2.14.6)
- **Se sprijină pe:** 2.14.5, 2.14.6, 1.8 (brokeri nereglementați, țepe)
- **Reglementare (datată 22.10.2026), pe jurisdicții:**
  - **UE (ESMA):** măsurile de intervenție pe produs din 2018 (pentru CFD-uri, în vigoare din 1 august 2018), făcute permanente de regulatorii naționali:
    - levier maxim:

      | Instrument | Levier maxim |
      |---|---|
      | FX major | 30:1 |
      | FX non-major, aur, indici majori | 20:1 |
      | alte mărfuri, indici non-majori | 10:1 |
      | acțiuni individuale | 5:1 |
      | crypto | 2:1 |

    - close-out la 50% din marja necesară, pe cont;
    - negative balance protection;
    - fără stimulente (bonusuri);
    - avertismentul standard, cu procentul de conturi retail care pierd la furnizorul respectiv;
    - opțiunile binare interzise pentru retail.
    - Analizele regulatorilor naționali: 74–89% din conturile retail CFD pierd, cu pierderi medii de €1,600–€29,000.
    - Surse: R5 RR-01; R1 §1.7; R6 §0.2, §3.4.
  - **UK (FCA):**
    - PS19/18, permanentă din 1 august 2019 (CFD-uri, spread bets, rolling spot FX) și din 1 septembrie 2019 (opțiuni de tip CFD);
    - plafon de 30:1;
    - eșantionul FCA din 2016: 82% din conturi au pierdut;
    - CFD-urile pe crypto sunt interzise retailului (data: de verificat).
    - Surse: R5 RR-01; R6 §3.4.
  - **SUA (SEC, FINRA, CFTC / NFA):**
    - CFD-urile nu sunt disponibile retailului;
    - FX retail: 50:1 pe majore, 20:1 pe restul [PK];
    - marja pe acțiuni: Reg T 50% inițial, mentenanță 25%, minimum $2,000;
    - conturile cash: decontare T+1, regulile de free-riding și good faith.
    - **Regula PDT (istorie):** 4 sau mai multe day trades în 5 zile lucrătoare fac din client „pattern day trader”, cu un capital minim de $25,000, day-trading buying power și restricții de 90 de zile.
    - **Înlocuirea (de verificat):**
      - SEC a aprobat în aprilie 2026 (14 sau 15 aprilie, după sursă) amendamentele la FINRA Rule 4210 (SR-FINRA-2025-017);
      - dispar desemnarea PDT, testul celor 4 trade-uri și minimul de $25,000;
      - în loc vine un regim de marjă intraday: Intraday Margin Level; deficitul intraday se acoperă prompt, până în a 15-a zi lucrătoare; dacă devine practică să nu fie acoperit până în a 5-a zi, urmează o restricție de 90 de zile; deficitele mai mici decât minimul dintre 5% din capital și $1,000 sunt excluse;
      - în vigoare din **4 iunie 2026**, cu o tranziție la brokeri până la **20 octombrie 2027**. Unii brokeri pot aplica încă regulile vechi.
      - Surse: R6 §0.2, §3.1; R1 §1.7; R5 RR-05. Schimbarea e raportată de trei agenți de cercetare, din surse secundare (README §12), deci marcată „de verificat” înainte de publicare.
  - **România (ASF):**
    - Autoritatea de Supraveghere Financiară e autoritatea națională competentă pentru firmele de investiții, în cadrul MiFID II;
    - măsurile ESMA pentru CFD-uri se aplică prin măsuri naționale;
    - brokerii din alte state UE (de exemplu, licențiați de CySEC sau BaFin) pot opera prin pașaport european;
    - licența se verifică în registrul ASF și în registrul regulatorului de origine;
    - schema de compensare a investitorilor: minimum €20,000 la nivel UE [PK]; numele și limitele schemei din România: de verificat;
    - impozitarea: doar trimitere la 4.5.
    - Surse: R6 §5.4, §5.5 [PK]; R1 §2.22, RG-01.
- **Hook:**
  - **Tip:** predict, cu alegere între „Yes, it's the rule”, „No: it was replaced in 2026, though some brokers may still apply it until October 2027” și „It was never a rule”.
  - **Prompt:** "A course from 2024 says: 'In the US you need 25,000 dollars to day trade.' Is that still true on 22 October 2026?"
  - **Răspuns:** a doua variantă (de verificat înainte de publicare).
- **Interacțiunea centrală:**
  - **B1 · explain:** de ce regulile au dată (README §1; R1 §4, pct. 14).
  - **B2 · figure:** axa timpului:
    - 2018: ESMA;
    - 2019: FCA PS19/18;
    - mai 2024: T+1 în SUA;
    - aprilie 2026: aprobarea SEC;
    - 4 iunie 2026: intrarea în vigoare;
    - 20 octombrie 2027: sfârșitul tranziției.
  - **B3 · match:** regulă ↔ jurisdicție:
    - 30:1 pe majore: UE și UK;
    - 50:1 pe majore: FX în SUA;
    - fără CFD-uri pentru retail: SUA;
    - close-out la 50% și NBP: UE și UK;
    - interdicția opțiunilor binare: UE.
  - **B4 · worked** cu input, expunerea maximă cu o marjă de 2,000:
    - CFD pe un indice major (20:1): 40,000;
    - CFD pe o acțiune (5:1): 10,000;
    - CFD pe crypto (2:1): 4,000.
  - **B5 · hotspot:** reclama unui broker fictiv (nume fictiv). „Tap the red flags.” Țintele (R6 §5.4; 1.8):
    - levier 500:1;
    - bonus la depunere;
    - niciun număr de licență;
    - „guaranteed returns”.
  - **B6 · order:** verificarea licenței:
    1. găsești numărul licenței;
    2. îl cauți în registrul regulatorului (ASF sau regulatorul de origine);
    3. verifici pașaportul pentru România;
    4. verifici că numele entității juridice se potrivește;
    5. verifici segregarea banilor clienților și schema de compensare.
- **Try:**
  - **Widget:** `jurisdiction-selector` (nou; din R5 RR-05).
  - **Obiectiv:** un cont retail UE, cu o marjă de 2,000: expunerea maximă pe un CFD pe indice major. Apoi treci pe SUA.
  - **Reușită:**
    - 40,000;
    - în SUA: „CFD not available”;
    - regula aflată în tranziție până la 20 octombrie 2027: PDT, înlocuită de marja intraday.
- **Practică:** scenariul de alegere a brokerului, cu 5 brokeri fictivi (R6 §5.4; versiunea completă în 4.5); selectorul de jurisdicție aplică plafoanele în simulator.
- **Check:**
  1. regulile din UE, UK și SUA, cu date;
  2. istoria PDT și înlocuirea ei;
  3. verificarea licenței.
- **Dovezi:** fapte de reglementare cu dată (Mechanic, ca reguli). Sursele sunt cele din blocul de reglementare; [PK] și „de verificat” marcate.
  - Mai departe: 4.5 (brokeri, banii clienților, taxe, ASF în detaliu).
- **Necesită:** S11 (plafoanele pe jurisdicții), S10
- **Termeni noi de glosar:** esma, fca, finra, asf, pattern-day-trader-rule, intraday-margin, licence-register

---

## Capstone 2 · A week across regimes

**Unde:** după 2.13, plus 2.14 dacă utilizatorul tranzacționează FX sau CFD-uri. E una dintre condițiile etapei 2 → 3 (README §5). Nu blochează nimic.

**Ce verifică:** că utilizatorul leagă tot nivelul într-o săptămână de lucru:
1. diagnostichează regimul;
2. alege un setup din playbook sau se abține;
3. dimensionează pe volatilitate, sub plafonul de heat și de corelație;
4. are o politică de știri și de weekend decisă dinainte;
5. ține jurnalul și face recenzia.

**Totul se notează pe proces.** P&L-ul apare doar ca diagnostic, după costuri și lângă benchmark ghost.

### Scenariul

**Piața:** o săptămână sintetică de 5 zile de tranzacționare, comprimată la 60–90 de minute de joc. Instrumentele:
- LABX;
- LABY (ρ ≈ 0.85 cu LABX);
- vEUR/vUSD (cere S10; în lipsa lui, LABZ).

**Ceasul:** S5, în ora României. Săptămâna e 26–30 octombrie 2026, una nealiniată, deci se schimbă și orele:
- deschiderea SUA: 15:30;
- rollover-ul: 23:00;
- publicările de la 08:30 ET: 14:30.

Etichetele de regim sunt ascunse.

| Zi | Ce se întâmplă (ascuns) | Ce testează |
|---|---|---|
| Luni | vEUR/vUSD într-un range liniștit în sesiunea asiatică și dimineața la Londra (R2); în overlap, o încercare de breakout care eșuează (false breakout) | 2.8.6, 2.8.8, 2.9.2 |
| Marți | LABX iese din range într-un trend la deschiderea SUA, 15:30 (R2 → R1); LABY se mișcă la fel | 2.8.4, 2.9.4, 2.11.3 |
| Miercuri | LABX e random walk (R0), fără edge; noaptea, swap-ul triplu pe FX | 2.8.1, 2.14.4 |
| Joi | eveniment roșu programat: o publicare sintetică de tip CPI la 14:30, cu headline-ul și core-ul în contradicție, reacție în două valuri și spread lărgit; apoi o continuare în direcția core-ului | 2.10.3, 2.10.5, 2.10.7, 2.10.8 |
| Vineri | trend R1 pe LABX; închiderea de vineri; gap-ul de weekend apare la deschiderea de luni, după ce deciziile s-au luat (R4) | 2.9.8, 2.8.2 |

**Diagnosticul de regim:** 12 segmente ascunse de-a lungul săptămânii, câte 4 din fiecare clasă: Trend / Range / No clear regime. Segmentele de tranziție sunt etichetate după regimul dominant.

### Sarcinile
1. **Rutina de dinaintea pieței, în fiecare zi** (2.13.3): triajul calendarului, eticheta de regim, nivelurile, 2–3 scenarii if-then, riscul maxim pentru zi.
2. **Diagnosticul celor 12 segmente** înainte de a tranzacționa pe ele.
3. **Doar setup-uri din cardurile proprii** (cel puțin 2, din 2.13.2), sau abținere. Fiecare trade are tag-ul cardului.
4. **Dimensionarea:**
   - fiecare trade riscă ≤ 1% după costuri;
   - dimensionare pe volatilitate între instrumente (2.11.1);
   - heat ≤ 5%;
   - LABX și LABY se socotesc un singur grup: fie o singură poziție, fie un heat ajustat la corelație ≤ 1.5% (2.11.3).
5. **Politica pentru evenimentul de joi:**
   - decisă înainte de T−15 minute: flat, reduce cu dimensionare pentru gap, sau hold (2.10.7);
   - niciun ordin nou de la T−15 până la spread normal;
   - o intrare pe a doua mișcare doar dacă o prevede un card (2.10.8).
6. **Politica de weekend, vineri:** flat, sau o mărime redusă, ca un gap de 3 × ATR să rămână ≤ 2R (2.9.8).
7. **Jurnalul:**
   - fiecare trade, cu tag-urile de eroare;
   - raportul zilnic;
   - recenzia de final de săptămână, cu un singur obiectiv de proces;
   - chitanța de costuri (spread, comision, slippage, swap) și rezultatul față de ghost, ca diagnostic.

### Punctajul (doar proces, 100 de puncte)

| Componentă | Puncte | Cum se măsoară |
|---|---|---|
| Diagnosticul de regim | 15 | etichetele corecte din 12, scalat (la ghicit: 4 din 12) |
| Abținerea corectă | 10 | niciun trade pe segmentele R0; niciun ordin nou în cele 15 minute dinaintea evenimentului roșu |
| Aderența la plan | 15 | % din trade-uri cu tag de card și toate condițiile îndeplinite (validatorul cardului) |
| Disciplina de risc | 20 | stop la intrare la fiecare trade; risk accuracy; heat și corelație în plafon |
| Politica de eveniment și de weekend | 15 | decisă la timp; dimensionarea pentru gap corectă; executată |
| Jurnalul și tag-urile de eroare | 10 | completitudinea, plus acuratețea tag-urilor față de detectorul automat |
| Calitatea recenziei | 10 | rapoartele zilnice făcute; obiectivul săptămânal țintește cel mai mare cost de eroare și e un obiectiv de proces |
| Rutina | 5 | 5 rutine din 5 |
| **Total** | **100** | P&L-ul, net R-ul și comparația cu ghost-ul: 0 puncte |

### Criteriile de trecere
- Cel puțin **70 din 100**.
- **Nicio încălcare a regulilor ferme:**
  - fiecare trade are stop la intrare;
  - niciun trade nu riscă peste 1% după costuri;
  - heat-ul nu depășește niciodată 5%;
  - limita zilnică nu e depășită;
  - niciun ordin nou în cele 15 minute dinaintea evenimentului roșu.
- **Diagnosticul de regim:** cel puțin 8 din 12 corecte. Cu 3 clase, șansa de a ajunge acolo ghicind e de 1.9% (binomial, p = 1/3).
- **Recenzia săptămânală** e trimisă și are un singur obiectiv de proces.
- **Reluarea** se face cu un seed nou. Contează cea mai bună încercare; nu există blocare.

### Debriefing-ul
- Fiecare decizie primește separat **Decision Quality** și **Risk Discipline**.
- Trade-urile „good decision, bad outcome” sunt evidențiate ca reușite.
- Chitanța de costuri și rezultatul după costuri, lângă benchmark ghost.
- Pasul următor: Nivelul 3, cu 3.10–3.12 (statistică, backtesting, sizing) core pentru toată lumea.

**Necesită:** S5, S6, S9, S10 (sau LABZ, ca alternativă), S13, S14, S15, S18 (aplicarea limitei zilnice)

---

## Întrebări deschise

1. **Instrumentele noi** (LABY, LABZ, vEUR/vUSD, vUSD/vJPY, vUSD/vCHF, vEUR/vCHF, LABIX) sunt propuse aici. Trebuie aprobate numele, prețurile, ATR-urile și corelațiile. Ele cer S9 și S10.
2. **Plafonul fără levier.** La LABX ≈ 100, stopurile sub ≈ 1.00 ating plafonul de 100 de unități (2.9.3).
   - Varianta propusă: îl păstrez, ca lecție despre tentația levierului.
   - Alternativa: lecțiile intraday folosesc LABX la un preț mai mic.
3. **Cifrele-țintă pentru seed** (2.8.2, 2.8.9, laboratoarele) se recalculează după ce există generatorul. Lecțiile le folosesc ca ținte de calibrare, nu ca rezultate empirice.
4. **Etapa 2 → 3:** se adaugă scorul de disposition într-o bandă țintă (R5 §10)? Nu e în README §5.
5. **De verificat înainte de publicare:**
   - înlocuirea regulii PDT: datele, SR-FINRA-2025-017 și pragurile, pe site-urile FINRA și SEC;
   - schema română de compensare a investitorilor și formularea despre măsurile naționale ASF;
   - data interdicției CFD-urilor pe crypto în UK;
   - T+1 în UE;
   - taxele de împrumut și adaosul de finanțare CFD;
   - volumul FX al BIS;
   - orele deciziilor Fed / BCE / BoE și datele-șablon ale ședințelor;
   - toate punctele [BK] și [PK] citate.
6. **Id-urile comune cu celelalte fișiere ale hărții** (verificate pe 22.10.2026, cât fișierele erau încă în lucru):
   - **rezolvate aici:** id-urile pe care Nivelul 0 și partea 2a le definesc deja sunt doar trimise acolo, nu redefinite: `trading-styles`, `cfd`, `etf`, `scalping`, `day-trading`, `swing-trading`, `position-trading`, `variance`, `whipsaw`, `confluence`, `gap-fill`, `nr7`;
   - **trimiterile „din X.Y” confirmate:** `random-walk`, `sample-size`, `expected-value`, `passive-benchmark` (0), `costs-in-r` (1.4.6), `daily-loss-limit` (1.4), `process-kpis`, `mistake-vs-variance`, `recency-bias` (1.6), `measured-move`, `gap-types`, `confluence` (2a);
   - **neconfirmat:** `margin-call` nu apare la Nivelul 1. Rămâne termen nou aici (2.14.6).
   - **de rezolvat la integrare:** fișierele de nivel mai înalt definesc și ele id-uri introduse aici:
     - Nivelul 3: `carry`, `corporate-actions`, `regression-to-the-mean`, `rule-change-governance`, `short-squeeze`;
     - Nivelul 4: `asf`, `esma`, `fca`, `finra`, `intraday-margin`, `tradability-ratio`.
     - Propunerea: rămân definite la prima apariție (aici), iar fișierele 3 și 4 le aprofundează.
7. **Lumânări de 5 minute:** 2.9.3 și 2.9.4 le cer, iar S4 listează azi minimum 15m.
8. **S20 în 2.10.9:** o variantă simplă de „de-peg” la Nivelul 2, sau doar un gap R4 mare, iar scenariul complet rămâne la Nivelul 3.
9. **Widget-urile noi:** fișierul introduce în jur de 45 de widget-uri și laboratoare noi. Propun 3 carcase refolosibile:
   - **lab:** grafic din simulator, plus scor de proces;
   - **calculator:** o sarcină numerică cu „show working”;
   - **sorter:** clasificare de carduri.
   Fiecare widget din fișier se poate scrie ca o configurare a uneia dintre ele.
10. **L15 și L18:** seturile de întrebări rămân cele propuse în U4 și U5. Decizia despre `tier: "pro"` pentru L18 rămâne cea din PLAN_LEARN §17.

---

## Registru de concepte noi

65 de concepte. Conceptele refolosite (✓) și cele din alte fișiere ale hărții („din X.Y”: de exemplu `trading-styles` și `random-walk` din Nivelul 0, `costs-in-r` din 1.4, `confluence` și `gap-types` din 2.5) nu sunt incluse.

| id | English name | Definition | Unitate |
|---|---|---|---|
| market-regime | Market regime | The prevailing behaviour of price, such as trending, ranging or random, which decides which strategies can work. | 2.8 |
| strategy-regime-fit | Strategy–regime fit | Matching a strategy family to the regime it is built for, and standing aside when the regime is unclear. | 2.8 |
| trend-following | Trend following | Rules that trade in the direction of an established trend, cutting losses quickly and letting winners run, usually at a low win rate. | 2.8 |
| trend-pullback | Pullback in a trend | Entering an established trend after a temporary move against it, with a stop beyond the pullback low. | 2.8 |
| range-breakout-strategy | Range breakout strategy | Trading a decisive close beyond a tested range edge, with a stop back inside the range and a measured-move target. | 2.8 |
| volatility-contraction-breakout | Volatility contraction breakout | Bracketing a narrow-range period with stop orders on both sides, betting on expansion rather than on direction. | 2.8 |
| range-trading | Range trading | Buying near support and selling near resistance in a confirmed range, until a close outside it. | 2.8 |
| mean-reversion | Mean reversion | Fading short-term extremes back toward an average, often with a high win rate and rare large losses. | 2.8 |
| return-skew | Return skew | The asymmetry of trade results: many small losses and a few big wins (positive) or the reverse (negative). | 2.8 |
| failed-breakout-strategy | Failed breakout strategy | Trading against a breakout that returns inside the range, with a stop beyond the failed extreme. | 2.8 |
| indicator-redundancy | Indicator redundancy | Indicators built from the same input count as one piece of evidence; confluence needs independent kinds of evidence. | 2.8 |
| after-cost-evaluation | After-cost evaluation | Judging a strategy by its net result per trade, against the passive benchmark and a random-walk control. | 2.8 |
| market-hours | Market hours and time zones | When each market's main session runs, converted to your own time zone, including daylight-saving mismatches. | 2.9 |
| fx-sessions | FX sessions and overlaps | The Sydney, Tokyo, London and New York windows of currency trading, and the busy London–New York overlap. | 2.9 |
| intraday-cycle | Intraday cycle | The daily pattern of higher volume and volatility near the open and close, with a quieter middle of the day. | 2.9 |
| opening-range-breakout | Opening range breakout | Trading a break of the first minutes' high or low; a small edge that the costs at the open can erase. | 2.9 |
| gap-strategies | Gap strategies | Trading an opening gap's continuation (gap and go) or its retracement (gap fill), or passing. | 2.9 |
| cost-drag | Cost drag | The share of a trade's average gross profit that costs consume; it rises as targets shrink. | 2.9 |
| fx-rollover | FX rollover | The daily roll of open currency positions at about 17:00 New York time, when spreads often widen. | 2.9 |
| weekend-and-holiday-risk | Weekend and holiday risk | The risk that price gaps past stops while markets are closed or thin, and the sizing that limits it. | 2.9 |
| news-surprise | Expectations versus surprise | Prices react to the difference between a release and its consensus, often measured as a standardised surprise. | 2.10 |
| economic-calendar | Economic calendar | The schedule of releases with time, impact, previous, consensus and actual values; it predicts volatility, not direction. | 2.10 |
| news-liquidity | Liquidity at news time | Around releases spreads widen, depth falls and stops fill at the first available price after the jump. | 2.10 |
| nonfarm-payrolls | Nonfarm payrolls | The monthly US jobs report (payrolls, unemployment rate, wages), with revisions and large sampling noise. | 2.10 |
| cpi-inflation | Consumer price index | The monthly US inflation report; markets focus on core month-on-month, and headline and core can disagree. | 2.10 |
| central-bank-decisions | Central bank decisions | Rate decisions and guidance move prices by how far they differ from what markets had already priced. | 2.10 |
| news-policy | News policy | A rule decided in advance for each event: stand aside, reduce to a gap-safe size, or trade the reaction. | 2.10 |
| second-move | Second move | Entering after a release only once spreads normalise, on a break of the post-release range. | 2.10 |
| news-risk-checklist | News risk checklist | A short go/no-go list applied before any order near a scheduled event. | 2.10 |
| percent-volatility-sizing | Volatility sizing | Sizing each position so one ATR of movement costs the same share of equity in every instrument. | 2.11 |
| portfolio-heat | Portfolio heat | The total money at risk if every open stop were hit, as a percentage of equity. | 2.11 |
| exposure-limits | Exposure limits | Caps on risk per instrument, per direction and per theme, so that no single idea dominates the account. | 2.11 |
| period-loss-limits | Weekly and monthly loss limits | Caps on realised losses plus open risk over a week or a month, after which new trades stop. | 2.11 |
| drawdown-tiers | Drawdown tiers | Pre-set cuts in risk at set drawdown depths, with a rule for when risk returns. | 2.11 |
| performance-metrics | Performance metrics | Win rate, payoff, expectancy, profit factor, drawdown and outlier dependence, read as diagnostics with their sample size. | 2.11 |
| expectancy-confidence-interval | Expectancy confidence interval | The range in which a system's true average R plausibly lies, given the sample size and the spread of results. | 2.11 |
| sqn | System quality number | Mean R divided by its standard deviation, times the square root of the number of trades (capped at 100). | 2.11 |
| prospect-theory | Prospect theory | People judge outcomes as gains or losses from a reference point and feel losses more strongly than equal gains. | 2.12 |
| disposition-effect | Disposition effect | The tendency to sell winners too early and to hold losers too long. | 2.12 |
| overconfidence | Overconfidence and calibration | Being sure more often than you are right, measured by comparing stated confidence with the hit rate. | 2.12 |
| recency-bias | Recency bias | Giving the last few results more weight than the base rate deserves. | 2.12 |
| regression-to-the-mean | Regression to the mean | Extreme results tend to be followed by more ordinary ones when outcomes contain noise. | 2.12 |
| anchoring | Anchoring | Letting an irrelevant number, such as your entry price, pull your judgement. | 2.12 |
| sunk-cost | Sunk cost | Holding or adding to a position because of what has already been lost on it. | 2.12 |
| house-money-effect | House-money effect | Taking more risk after gains because the profits feel like someone else's money. | 2.12 |
| tilt | Tilt | A state in which emotion overrides the plan, visible as a cluster of rule breaks. | 2.12 |
| behavioural-guard-rails | Behavioural guard-rails | Pre-set limits such as cool-downs, tilt thresholds and daily locks that make the right action the easy one. | 2.12 |
| probabilistic-thinking | Probabilistic thinking | Treating each trade as one draw from a distribution and judging results across a series. | 2.12 |
| setup-card | Setup card | A playbook entry defining one setup's regime, trigger, stop, management, no-trade conditions and statistics. | 2.13 |
| pre-market-routine | Pre-market routine | A fixed preparation sequence before each session: readiness, calendar, regime, levels, scenarios and risk for the day. | 2.13 |
| if-then-plans | If-then plans | Rules of the form "if this observable event, then this one action", written before the session. | 2.13 |
| trading-reviews | Daily and weekly reviews | Short scheduled reviews that grade decisions, find the costliest error and set one process goal. | 2.13 |
| process-goals | Process goals | Goals you fully control, such as stop integrity, set instead of profit targets. | 2.13 |
| rule-change-governance | Rule-change governance | Changing a rule only through a logged hypothesis, an evidence threshold, a test and a new plan version. | 2.13 |
| stocks-and-etfs | Stocks and ETFs | Shares are ownership in a company; ETFs are exchange-traded funds that hold baskets of assets. | 2.14 |
| corporate-actions | Corporate actions | Dividends, splits and other company events that change prices or share counts without creating value. | 2.14 |
| short-selling | Short selling | Selling borrowed shares to profit from a fall, paying borrow fees and dividends, with no cap on the loss. | 2.14 |
| forex-quotes | Forex quotes, pips and lots | How currency pairs are quoted, and how pips and lot sizes turn a price move into money. | 2.14 |
| overnight-financing | Overnight financing | The daily interest charged or paid for holding leveraged FX or CFD positions past rollover. | 2.14 |
| cfds-and-indices | CFDs and indices | Index exposure through futures, ETFs or CFDs; a CFD is an over-the-counter contract with the provider as counterparty. | 2.14 |
| negative-balance-protection | Negative balance protection | A retail protection that stops an account going below zero; it doesn't limit losses before that point. | 2.14 |
| retail-regulation | Retail trading regulation | The dated, per-jurisdiction rules on leverage, close-out, protections and day trading that shape retail trading. | 2.14 |

## Termeni noi de glosar

111 termeni:
- 109 propuși aici;
- 2 preluați din nota scriptului L15, care intră în 2.13.1: `scenario-analysis` și `trigger`.

Niciunul nu există în `glossary.ts` și niciunul nu apare în registrele fișierelor de Nivel 0, 1 și 2a, așa cum erau la 22.10.2026. Termenii pe care îi definesc deja acele fișiere sunt doar trimiși acolo din fișele lecțiilor:
- din 0.1: `cfd`, `etf`, `scalping`, `day-trading`, `swing-trading`, `position-trading`;
- din 0.2: `variance`, propus și în nota L18;
- din 2.3: `whipsaw`;
- din 2.5: `confluence`, `gap-fill`;
- din 2.6: `nr7`.

Definițiile sunt variantele `plain`, de cel mult 20 de cuvinte.

| id | Termen | Definiție (plain) |
|---|---|---|
| market-regime | Market regime | How the market is behaving right now: trending, ranging or moving at random. |
| trend-following | Trend following | Trading in the direction of an established trend, cutting losses fast and letting winners run. |
| trend-filter | Trend filter | A rule that allows trades only in the direction of the larger trend. |
| volatility-contraction | Volatility contraction | A quiet stretch of unusually small candles, which often comes before larger moves. |
| range-trading | Range trading | Buying near the bottom of a range and selling near the top, until it breaks. |
| mean-reversion | Mean reversion | Betting that a stretched price will move back toward its average. |
| negative-skew | Negative skew | Many small wins and rare large losses; it looks smooth until the big loss arrives. |
| turtle-soup | Turtle Soup | Trading against a breakout of a 20-candle extreme that fails and returns inside the range. |
| indicator-redundancy | Indicator redundancy | Several indicators built from the same prices, telling you the same thing more than once. |
| after-cost-expectancy | After-cost expectancy | The average result per trade once spread, commission and slippage are taken off. |
| trading-session | Trading session | The hours a market is open, and the main window when it is most active. |
| daylight-saving-time | Daylight saving time | The seasonal clock change; the US and Europe switch on different dates, shifting market hours. |
| server-time | Server time | The clock your trading platform shows, which may differ from your local time. |
| session-overlap | Session overlap | Hours when two major sessions are open together, usually the busiest of the day. |
| opening-auction | Opening auction | A single-price matching of orders that starts an exchange's regular session. |
| closing-auction | Closing auction | A single-price matching of orders at the end of the session that sets the official close. |
| opening-range | Opening range | The high and low of the first minutes of the main session. |
| orb | ORB | Opening range breakout: trading a break of the opening range's high or low. |
| gap-and-go | Gap and go | Trading in the direction of a large opening gap that has a real catalyst. |
| rollover | Rollover | The daily roll of open FX positions at about 17:00 New York time. |
| weekend-gap | Weekend gap | A jump between Friday's close and the next open, caused by news while markets were shut. |
| consensus | Consensus | The middle of economists' forecasts for a release; roughly what the market already expects. |
| surprise | Surprise | The released number minus the consensus. Prices react mostly to this. |
| priced-in | Priced in | Already reflected in the price, so it moves little when it happens. |
| economic-calendar | Economic calendar | The schedule of upcoming data releases, central bank decisions and other market events. |
| impact-tier | Impact tier | A calendar's rough rating of how much an event usually moves markets. |
| revision | Revision | A change to a previously published number, released alongside the new one. |
| spread-widening | Spread widening | The gap between bid and ask growing, often sharply, around news or in thin markets. |
| spread-triggered-stop | Spread-triggered stop | A stop hit because the spread widened, although the mid price never reached it. |
| nfp | NFP | Nonfarm payrolls: the monthly US jobs report, usually released on a Friday at 08:30 New York time. |
| cpi | CPI | Consumer price index: the main monthly measure of inflation in consumer prices. |
| core-inflation | Core inflation | Inflation without food and energy prices, which markets watch more closely. |
| central-bank | Central bank | The institution that sets a currency's interest rates, such as the Fed or the ECB. |
| rate-decision | Rate decision | A central bank's announcement of its policy interest rate. |
| hawkish | Hawkish | Leaning toward higher interest rates or tighter policy. |
| dovish | Dovish | Leaning toward lower interest rates or easier policy. |
| stand-aside | Stand aside | Choosing to hold no new trades or positions around an event. A valid strategy. |
| second-move | Second move | The price move after spreads normalise, once the details of a release are digested. |
| post-release-range | Post-release range | The high and low of the first minutes after a news release. |
| unscheduled-event | Unscheduled event | News that arrives without warning, so no calendar or timing can protect you. |
| volatility-sizing | Volatility sizing | Sizing so a typical move (one ATR) costs the same share of equity in every instrument. |
| portfolio-heat | Portfolio heat | The total you would lose if every open stop were hit, as a percentage of equity. |
| effective-bets | Effective bets | How many truly independent positions you hold once correlation is counted. |
| exposure-limit | Exposure limit | A cap on how much risk you allow in one instrument, direction or theme. |
| monthly-loss-limit | Monthly loss limit | A cap on the month's losses plus open risk; once reached, no new trades that month. |
| drawdown-tier | Drawdown tier | A preset step that cuts your risk when the account falls a set amount below its peak. |
| profit-factor | Profit factor | Gross profit divided by gross loss. Above 1 means the trades made money overall. |
| payoff-ratio | Payoff ratio | The average winning trade divided by the average losing trade. |
| recovery-factor | Recovery factor | Net profit divided by the maximum drawdown. |
| confidence-interval | Confidence interval | A range that likely contains the true value, given how much data you have. |
| sqn | SQN | System quality number: average R divided by its spread, scaled by the number of trades. |
| prospect-theory | Prospect theory | The finding that people judge gains and losses from a reference point and feel losses more. |
| reference-point | Reference point | The value you compare an outcome with, such as your entry price. |
| disposition-effect | Disposition effect | Selling winners too soon and holding losers too long. |
| overconfidence | Overconfidence | Being more sure of your judgement than your track record justifies. |
| calibration | Calibration | How well your stated confidence matches how often you are actually right. |
| law-of-small-numbers | Law of small numbers | The mistaken belief that a few results reliably show what a method can do. |
| regression-to-the-mean | Regression to the mean | After an extreme result, the next one tends to be closer to average. |
| anchoring | Anchoring | Letting an irrelevant number, like your entry price, pull your judgement. |
| sunk-cost | Sunk cost | Money already lost. It shouldn't change what you do next, but often does. |
| house-money-effect | House-money effect | Taking more risk after a win because profits feel like free money. |
| tilt | Tilt | A state where emotion overrides your plan, shown by several broken rules in a row. |
| probabilistic-thinking | Probabilistic thinking | Seeing each trade as one draw from many, not as a test of being right. |
| broad-framing | Broad framing | Judging results across a series of trades rather than one trade at a time. |
| scenario-analysis | Scenario analysis | A plan for every likely path, not a single guess. (din nota L15) |
| setup-card | Setup card | A playbook entry describing one setup's conditions, stop, management and statistics. |
| pre-market-routine | Pre-market routine | The fixed checks you run before each session, from the calendar to your risk for the day. |
| readiness-check | Readiness check | A quick check of sleep, stress and health before you decide to trade. |
| if-then-plan | If-then plan | A rule linking an observable event to one action decided in advance. |
| error-cost | Error cost | How many R a mistake cost compared with the same trade done by the rules. |
| daily-review | Daily review | A short end-of-day check of your decisions, not your profit. |
| weekly-review | Weekly review | A weekly look at results by setup, time and error, ending with one process goal. |
| blind-replay | Blind replay | Reviewing a trade with the future hidden, as you saw it when deciding. |
| process-goal | Process goal | A goal you fully control, such as placing every stop before entry. |
| kpi | KPI | Key performance indicator: a number you track to judge progress, such as stop integrity. |
| share | Share | A unit of ownership in a company. |
| dividend | Dividend | A cash payment a company makes to its shareholders. |
| ex-dividend-date | Ex-dividend date | The first day a share trades without the next dividend; the price drops by about that amount. |
| stock-split | Stock split | Dividing each share into several cheaper ones; the total value stays the same. |
| leveraged-etf | Leveraged ETF | A fund aiming for a multiple of an index's daily move; it loses value in choppy markets. |
| short-squeeze | Short squeeze | A sharp rise that forces short sellers to buy back, pushing the price even higher. |
| locate | Locate | A broker's confirmation that shares can be borrowed before a short sale. |
| short-sale-restriction | Short-sale restriction | A US rule that, after a 10% intraday drop, allows short sales only above the best bid. |
| currency-pair | Currency pair | Two currencies quoted together: the price of one unit of the first in the second. |
| pip-value | Pip value | How much one pip of movement is worth for a given position size. |
| swap | Swap | The daily interest paid or earned for holding a currency position past rollover. |
| triple-swap | Triple swap | The Wednesday rollover that charges or pays three days of swap to cover the weekend. |
| carry | Carry | Earning the interest difference by holding a higher-yielding asset; it can crash suddenly. |
| overnight-funding | Overnight funding | The daily financing charge for holding a CFD position overnight. |
| stock-index | Stock index | A number that tracks a basket of shares, such as the S&P 500 or the DAX. |
| margin-level | Margin level | Equity divided by used margin, as a percentage; low levels trigger calls and close-outs. |
| free-margin | Free margin | Equity minus the margin already used by open positions. |
| tradability-ratio | Tradability ratio | Typical movement (ATR) divided by trading cost; higher means more movement per unit of cost. |
| cost-stack | Cost stack | All the costs of trading added together, from the spread to taxes. |
| esma | ESMA | The European Securities and Markets Authority, which coordinates market regulation across the EU. |
| fca | FCA | The Financial Conduct Authority, the UK's financial markets regulator. |
| finra | FINRA | The US self-regulatory body that oversees broker-dealers and sets their margin rules. |
| asf | ASF | Autoritatea de Supraveghere Financiară, Romania's financial supervisory authority. |
| pattern-day-trader-rule | Pattern day trader rule | A former US rule requiring 25,000 dollars to day trade often; replaced in 2026. |
| intraday-margin | Intraday margin | US margin measured on your largest exposure during the day; it replaced the pattern day trader rule. |
| licence-register | Licence register | A regulator's official list where you can check that a firm is authorised. |
