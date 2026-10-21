# Nivelul 4 · Professional

Etapa vizuală „The summit”. Ultimul nivel al cursului: opțiuni și volatilitate, execuție și impact, validare la standard profesional, risc de portofoliu, trading-ul ca business și construcția propriei abordări. Se încheie cu capstone-ul final.

**Cum folosești fișierul:**
- Arhitectura, notele de dovezi (§6), regimurile R0–R14 (§7), capabilitățile S1–S20 (§8) și formatul fișei (§10) sunt în [README.md](README.md).
- Aici e harta detaliată: fișa fiecărei unități, fișa fiecărei lecții, capstone-ul final și registrele de concepte și termeni noi.
- Scripturile complete, beat cu beat, se scriu pe unități, în formatul din [../README.md](../README.md), înainte de implementare.
- Cercetarea citată (de exemplu `R6 §4.4`) e în [../research/](../research/).

Titlurile, obiectivele, prompturile și sarcinile sunt în engleză, exact cum apar în aplicație. Restul e în română.

---

## Introducerea nivelului

### Pentru cine

Pentru cine a trecut etapa 3 → 4 (README §5) sau are un nivel echivalent:
- are un sistem documentat care trece checklist-ul de validare de la 3.11 (out-of-sample, walk-forward, Monte Carlo, stres pe costuri), cu jurnalul de cercetare;
- își păstrează KPI-urile de proces într-un drawdown forțat;
- stăpânește statistica de la 3.10 (distribuții, cozi groase, semnificație), backtesting-ul de la 3.11 și teoria sizing-ului de la 3.12 (Kelly, risk of ruin, volatility targeting).

Nivelul nu presupune experiență cu bani reali. Presupune că cursantul gândește în R, în distribuții și în costuri.

### Ce poate face cursantul la final

- Citește o opțiune ca pe un contract de risc: payoff, preț, Greeks, volatilitate implicită. Alege o structură potrivită regimului (sau nicio structură), cu pierderea maximă, câștigul maxim și break-even-ul calculate înainte de ordin.
- Estimează cât costă de fapt execuția (implementation shortfall, impact după legea rădăcinii pătrate) și știe ce se întâmplă cu ordinele la halt-uri, LULD, circuit breakers, fix-uri și expirări.
- Spune cât de probabil e ca cel mai bun backtest al lui să fie noroc: numără încercările, calculează deflated Sharpe, durata minimă a backtest-ului, PBO, și estimează capacitatea strategiei.
- Conduce riscul unei cărți cu mai multe instrumente: VaR și Expected Shortfall, volatility targeting, expunere brută, netă și ajustată cu beta, risk parity (conceptul), teste de stres și regimuri de corelație.
- Tratează trading-ul ca pe un business cu reguli: reglementarea pe jurisdicții (datată), banii clienților și modelele de broker, economia firmelor de prop, evidențele fiscale (doar awareness), criteriile de trecere de la demo la real și condițiile în care nu tranzacționează.
- Își construiește abordarea: matricea de constrângeri, piața și stilul, specializarea, pipeline-ul de dezvoltare cu criterii de oprire, creșterea treptată a mărimii și îmbunătățirea continuă.
- Ia o decizie informată, inclusiv decizia de a **nu** tranzacționa cu bani reali (README §1, principiul 8).

### Capstone-ul final, pe scurt

O piață sintetică necunoscută, cu mai multe regimuri trase din R0–R14 și etichete ascunse, inclusiv perioade R0 în care abținerea e decizia corectă. Cursantul diagnostichează regimul, alege o strategie din playbook sau se abține, dimensionează, execută și raportează rezultatul după costuri față de benchmark-ul pasiv. Predă și playbook-ul scris, și dosarul de validare cu statisticile lui. Scorul se dă pe proces și pe evaluarea ajustată la risc și după costuri, comparată cu gemeni aleatori. Profitul brut nu contează. Detaliile sunt în [Capstone-ul final](#capstone-ul-final--the-summit).

### Firele din spirală la Nivelul 4

| Fir | Ce înseamnă aici (README §4) | Unde |
|---|---|---|
| **Risc** | VaR/ES, stres, scalare | 4.4 în întregime; riscul de coadă al vânzării de volatilitate (4.1.11); scalarea (4.6.5) |
| **Statistică** | testări multiple, PBO | 4.3 în întregime; incertitudinea Sharpe și a expectancy în deciziile de business (4.5.6, 4.6.6) |
| **Psihologie** | gândirea de business | EV-ul unei evaluări de prop (4.5.4), criteriile de go-live (4.5.6), când să nu tranzacționezi (4.5.7), auditul comportamental (4.6.1) |
| **Proces** | criterii de oprire, scalare | dosarul de validare (4.3.7), pipeline-ul cu kill criteria (4.6.4), etapele de capital (4.6.5), revizuirea anuală (4.6.6) |
| **Dovezi** | validare profesională | 4.3; nota de dovezi a fiecărei structuri de opțiuni (4.1); prima de risc pe volatilitate ca „A cu risc de crash” (4.1.11) |
| **Costuri** | capacitate și impact | 4.2 în întregime; capacitatea (4.3.6); costul paritate vs arbitraj (4.1.3); alegerea pieței prin raportul de tradabilitate (4.6.2) |

### O notă de onestitate: subiectele instituționale

Multe subiecte de aici sunt la nivelul **E (Expert)** din R6 §0.3: market making, HFT și latență, algoritmi de execuție pe ordine mari, purged cross-validation, PBO, risk parity cu levier, arbitrajul de paritate, dispersia.
- Se predau **ca concepte și demonstrații**: cursantul vede mecanismul în simulator, „joacă instituția” pentru o sesiune și înțelege de ce prețurile arată cum arată.
- Aplicația **nu sugerează** că un trader retail le poate rula competitiv. Un cont mic nu câștigă cursa de latență, nu are rebate-uri de market maker și nu are capacitatea care face risk parity cu levier ieftin.
- Ce rămâne util pentru un individ: știe cine e de cealaltă parte, de ce spread-ul se lărgește înaintea știrilor, de ce un ordin stop nu e un preț garantat la un halt, de ce cel mai bun backtest dintr-o sută e aproape sigur supraestimat.
- Fiecare lecție E are această frază în Learn: „This is how professionals do it. You are learning to recognise it, not to compete with it.”

### Core, elective și trasee

| Unitate | Statut | Trasee (README §3) |
|---|---|---|
| 4.1 Options and volatility | Elective | Derivatives |
| 4.2 Execution and market impact | Elective | Price action and order flow |
| 4.3 Professional validation | Elective, recomandată tuturor | Systematic trader |
| 4.4 Portfolio risk at scale | Elective | Derivatives, Systematic trader |
| 4.5 The business of trading | **Core** pentru toate traseele | toate |
| 4.6 Your trading approach | **Core** pentru toate traseele | toate |

Capstone-ul final cere 4.5 și 4.6. Restul unităților se cer doar dacă playbook-ul cursantului le folosește (de exemplu, o strategie cu opțiuni cere 4.1; un sistem validat statistic cere 4.3).

### Ajustare față de README: 43 de lecții, nu 42

Unitatea 4.1 are **11 lecții** în loc de 10. Motivul:
- R6 §7 (Stage 5) dă opțiunilor patru module separate (33–36), iar cerința hărții e ca fiecare strategie să aibă pierdere maximă, câștig maxim, break-even și regim. Strategiile de bază (acoperire, spread-uri verticale) și strategiile de volatilitate nu încap într-o singură lecție de 7 minute.
- Prima de risc pe volatilitate (4.1.11) are o miză diferită de cumpărarea mișcării la evenimente (4.1.10): prima e un fapt de nota A cu risc de crash (Carr & Wu 2009, Volmageddon 2018), a doua e o strategie de nota C. Puse împreună, mesajul despre coada stângă s-ar pierde.

Celelalte unități păstrează numărul din README §3. Totalul nivelului devine 43 de lecții, iar al cursului ≈ 341.

### Lumea simulată la Nivelul 4

Convențiile din [../README.md](../README.md) rămân valabile (LABX, vUSD, cont de 10,000.00, risc 1% în misiuni și 2% în Arena, spread 0.10, comision 0.05% pe execuție, unități întregi rotunjite în jos). Se adaugă:

| Element | Valoare | Notă |
|---|---|---|
| Opțiuni pe LABX | stil european în simulator; lecția 4.1.2 explică și stilul american | simplifică prețul; exercitarea anticipată se predă doar ca risc |
| Multiplicator | **1 contract = 10 unități LABX** | convenție de simulator, aleasă ca un contract să încapă în bugetul de 1%; în realitate opțiunile pe acțiuni din SUA acoperă de obicei 100 de acțiuni (R6 §4.1, [PK]); de confirmat (vezi întrebările deschise) |
| Dobânda fără risc | r = 0, implicit | ca formulele să rămână curate; doar 4.1.3 folosește r = 4% ca să arate actualizarea |
| Timp | T în ani, cu 365 de zile; volatilitatea anualizată | |
| Spread pe opțiuni | 0.10 pe unitate în jurul prețului de model (0.40 în R12) | comision 0 pe opțiuni (simplificare) |
| „Fund mode” (4.2, 4.3.6) | ordin-părinte de 50,000 unități LABX; volum zilnic V = 2,000,000 unități; volatilitate zilnică 2% | cursantul „joacă instituția” |
| Universul multi-instrument (4.4) | LABI (indice sintetic, beta 1), LABX (beta 1.2), LABY (beta 0.8), LABZ (beta 1.0), LABB (asemănător unei obligațiuni, volatilitate 10%), LABC (pereche valutară cu carry, R8) | corelațiile se schimbă pe regim |
| Brokeri, firme de prop | nume fictive în simulator (R6 §5.4) | regulile reale (FTMO, Topstep) se citează doar în lecții, datate și marcate „de verificat la publicare” |

**Tabelul de referință al opțiunilor LABX** (verificat cu un script Black–Scholes; S = 100.00, T = 30 de zile, IV 25%, r = 0). Toate exemplele din 4.1 pleacă de aici.

| Strike | Call | Put | Delta call | Delta put | Observații |
|---|---|---|---|---|---|
| 90 | 10.21 | 0.21 | 0.93 | −0.07 | |
| 95 | 5.97 | 0.97 | 0.77 | −0.23 | call ITM: 5.00 intrinsec + 0.97 extrinsec |
| 100 | 2.86 | 2.86 | 0.51 | −0.49 | gamma 0.056; theta −0.048/zi; vega 0.114 pe punct de volatilitate |
| 105 | 1.08 | 6.08 | 0.26 | −0.74 | put ITM: 5.00 + 1.08 |
| 110 | 0.32 | 10.32 | 0.10 | −0.90 | |

Alte valori folosite (același model):
- ATM, 30 de zile: IV 15% → 1.72; IV 35% → 4.00; IV 50% → 5.71.
- ATM, IV 25%: 7 zile → 1.38 (theta −0.099/zi); 1 zi → 0.52 (gamma 0.30, theta −0.261/zi); 120 de zile → 5.71.
- ATM, 1 an, IV 20% → 7.97 (vega 0.397).
- Eveniment (R5): 7 zile, IV 60% → call și put ATM câte 3.31, straddle 6.63; put 95 → 1.33; call 105 → 1.47.
- După eveniment: 6 zile, IV 25%, straddle 100 → 4.30 la S = 96, 2.56 la S = 100, 4.35 la S = 104.
- Paritate (doar 4.1.3): T = 0.25, IV 20%, r = 4% → call 4.49, put 3.49.

### Notații în fișele de lecție

- **✓** = conceptul există deja în `packages/academy/src/content/concepts.ts`.
- **(nou)** = concept nou, introdus în această lecție; definiția e în [Registrul de concepte noi](#registru-de-concepte-noi). „(nou, din 4.x.y)” = concept nou al nivelului, introdus într-o lecție anterioară din acest fișier.
- **(N.U)**, de exemplu `iv-crush (3.8)` = concept introdus în harta unității N.U de la nivelurile 1–3. Id-ul e propus aici și se aliniază cu registrele acelor niveluri.
- Termenii de glosar din câmpul „Termeni noi de glosar” sunt id-uri noi; definițiile sunt în [Termeni noi de glosar](#termeni-noi-de-glosar).
- „Nivel” din fișă e mereu „Professional”; tipul e Core sau Elective (cu traseul).

### Capabilitățile de simulator folosite

| Cod | Folosit în | Extensie propusă la acest nivel |
|---|---|---|
| S1 Ordine avansate | 4.2.5 | stop-limit în licitația de redeschidere |
| S5 Ceas și sesiuni | 4.2.6, 4.6.2 | fix-uri (16:00 Londra), sfârșit de lună și trimestru, zile de expirare și rebalansare |
| S6 Motor de știri | 4.1.7, 4.1.10, 4.2.4, capstone | IV de eveniment pe suprafața de opțiuni |
| S7 Random walk | 4.3, 4.5.7, capstone | aceeași volatilitate și același profil de sesiune ca piața testată |
| S8 Order book | 4.2, 4.5.2 | profiluri de broker: STP, B-book cu last look, ECN cu execuții parțiale (R3 Appendix A2); agenți etichetați |
| S9 Mai multe instrumente | 4.4, capstone | universul LABI–LABC, corelații dependente de regim |
| S10 Specificații pe clase | 4.6.2, capstone | tabelul de tradabilitate |
| S11 Levier și marjă | 4.4.5, 4.5.1, 4.5.2 | selector de jurisdicție (R5 RR-05): plafoane ESMA/FCA/SUA, close-out 50%, negative balance protection |
| S12 Prețuri de opțiuni | 4.1, 4.2.6, 4.4, capstone | lanț de opțiuni, suprafață IV (skew, termen, eveniment), payoff builder, Greeks sandbox, descompunerea P&L pe Greeks |
| S13 Strategy lab | 4.3, 4.6.4, 4.6.6, capstone | jurnal de cercetare imutabil cu contor de încercări, card DSR, gauge MinBTL, CSCV, cross-validation cu purge și embargo |
| S14 Detectoare de comportament | 4.5.6, 4.5.7, 4.6.1 | auditul comportamental (frecvența revenge, stop mutat, overtrading, durata de deținere) |
| S15 Analiza jurnalului | 4.1.11, 4.4, 4.5, 4.6 | VaR/ES pe P&L-ul propriu, export de evidențe, vedere după taxe cu rată generică |
| S18 Prop challenge | 4.5.3, 4.5.4, 4.6.5 | Monte Carlo al probabilității de trecere pe trade-urile proprii; „career mode” cu etape de capital |
| S19 Algoritmi de execuție și impact | 4.2, 4.3.6, 4.6.5, capstone | TWAP, VWAP, POV, IS; model de impact cu legea rădăcinii pătrate; latență |
| S20 Scenarii de stres | 4.1.11, 4.2.5, 4.4, capstone | LULD, MWCB, halt cu licitație de redeschidere, flash crash, ruperea unui peg, salt de volatilitate, dublarea marjei |

---
## Unitatea 4.1 · Options and volatility (11 lecții)

### Fișa unității

- **Scop:** opțiunea ca instrument de risc, nu ca bilet de loterie. Cursantul trece de la definiții și payoff (4.1.1–4.1.2) la paritate și preț (4.1.3–4.1.4), la Greeks (4.1.5–4.1.6), la volatilitatea implicită (4.1.7) și apoi la strategii, fiecare cu pierderea maximă, câștigul maxim, break-even-ul și regimul în care are sens (4.1.8–4.1.11).
- **De ce aici:**
  - Opțiunile cer tot ce s-a construit înainte: volatilitatea și ATR (2.4), distribuțiile și cozile groase (3.10), IV crush la raportări (3.8), straddle-ul la evenimente (3.7), futures și curba (3.14), sizing-ul și risk of ruin (3.12).
  - R6 §7 le pune în Stage 5 („Derivatives and relative value”), după sistemele și portofoliile din Stage 4. CMT le tratează la nivelurile I–III (R1 §2.21, DL-05…DL-07).
  - Opțiunile apar des la retail (0DTE, „calls before earnings”) și sunt rar predate onest (R1 §4, gap 21).
- **Se sprijină pe:** 1.4 (R, sizing, levier), 2.4 (volatilitate, ATR), 2.8 (potrivirea regim ↔ strategie), 3.7 (straddle la evenimente), 3.8 (IV crush, implied move intuitiv), 3.10 (distribuții, cozi groase, skew), 3.12 (Kelly, risk of ruin), 3.14 (futures, curba la termen).
- **Checkpoint (test out):** 14 întrebări, ≥ 80% marchează cele 11 lecții „Tested out”:
  - 3 numerice de payoff (break-even, pierdere maximă, câștig maxim la o structură dată);
  - 2 de paritate (prețul care lipsește, poziția sintetică echivalentă);
  - 3 de Greeks (semnul theta, delta-hedge, descompunerea P&L pe o zi);
  - 2 de IV (implied move, citirea skew-ului);
  - 4 de alegere a strategiei pe regim, cu varianta „no trade”.
- **Laboratorul unității: „Options desk”** (R6 §7, gate-ul Stage 5):
  - 6 scenarii cu eticheta ascunsă: R1 trend lent, R2 range, R4 gap peste noapte, R5 eveniment programat, R12 criză, R14 suprafață calmă cu IV mare.
  - În fiecare: cursantul alege o structură cu risc definit sau „no trade”, o construiește în payoff builder, scrie pierderea maximă, câștigul maxim și break-even-ul, o dimensionează la ≤ 1% pierdere maximă (100.00 vUSD), apoi rulează scenariul.
  - Debrief: P&L descompus în delta, gamma, theta, vega; comparația cu benchmark-ul pasiv.
  - **Reușită:** potrivirea structură ↔ regim în ≥ 4 din 6 scenarii (inclusiv „no trade” unde e corect), zero depășiri ale pierderii maxime planificate, descompunerea P&L citită corect în ≥ 2 din 3 întrebări de debrief.
- **Firele din spirală:**
  - Risc: pierderea maximă definită vs nedefinită; dimensionarea din stres, nu din primă (4.1.11).
  - Statistică: rata de câștig mare ≠ edge (4.1.9); skew-ul negativ al vânzării de volatilitate (4.1.11).
  - Costuri: spread-ul pe opțiuni mănâncă arbitrajul de paritate (4.1.3).
  - Dovezi: prima de risc pe volatilitate e A, cu crash; straddle-urile la evenimente sunt C.
  - Psihologie: „am avut dreptate pe direcție și tot am pierdut” (4.1.1, 4.1.10).
- **Surse:** R6 §4.1–4.5 (definiții, Greeks, IV, strategii, levier), R6 §2.14 (strategii de volatilitate, VRP, Volmageddon), R6 §2.9.3 (IV crush), R6 §2.17 (matricea strategie × regim), R4 §4.3 (straddle la știri), R4 §5.8 (implied move, IV crush), R3 §5.12 (pinning, gamma dealerilor), R5 PM-07 (Sharpe flatează strategiile cu skew negativ), R5 ST-04 (cozi groase), R1 §2.21 (DL-05…DL-07), R1 §4 (gap 21: 0DTE).

---

#### 4.1.1 · Calls and puts: the right, not the obligation
- **Nivel / durată / tip:** Professional · 7 min · Elective (Derivatives)
- **Obiective:**
  1. Explain the difference between buying a call and buying a put.
  2. Classify an option as in, at or out of the money from its strike and the underlying price.
  3. Split an option's premium into intrinsic and extrinsic value.
- **Concepte:** option-contract (nou), option-moneyness (nou), leverage ✓, volatility ✓
- **Se sprijină pe:** 1.4 (levier, R), 2.4 (volatilitate), 3.8 (IV crush, intuitiv)
- **Hook:** predict · alegere. „You pay 2.86 for a 30-day LABX call with strike 100. At expiry LABX is at 102.00. Did you make money?” Variante: „Yes, +2.00” / „Yes, +0.86” / „No, −0.86” ✓ / „No, −2.86”. Răspunsul: valoarea la expirare e 2.00, prima a fost 2.86, deci −0.86 pe unitate (−8.60 vUSD pe contract). Ai avut dreptate pe direcție și ai pierdut.
- **Interacțiunea centrală:**
  - `figure` (2 pași): un call ca drept de a cumpăra la strike, un put ca drept de a vinde la strike; cumpărătorul plătește prima, vânzătorul (writer) o încasează și preia obligația.
  - `worked` cu formulele: valoarea intrinsecă a unui call = max(S − K, 0); a unui put = max(K − S, 0); valoarea extrinsecă = prima − valoarea intrinsecă. Pe tabelul de referință (S = 100): call 95 = 5.00 + 0.97; call 100 = 0 + 2.86; call 105 = 0 + 1.08; put 105 = 5.00 + 1.08. Ultima linie o calculează cursantul.
  - `match`: șase opțiuni (call 95, 100, 105; put 95, 100, 105) ↔ ITM / ATM / OTM.
  - `explain`: costul pe contract = prima × multiplicator (10 în simulator): call 100 = 28.60 vUSD. Pierderea maximă a cumpărătorului e prima plătită; levierul vine din faptul că o primă mică controlează 10 unități.
- **Try:** widget `option-chain` (lanțul de opțiuni LABX, 30 de zile). Sarcina: „Find the call whose whole premium is extrinsic value and that costs under 15.00 vUSD per contract.” Reușită: alege call 105 (1.08 × 10 = 10.80). Indicii: 1. „Out-of-the-money options have zero intrinsic value.” 2. „Multiply the premium by 10 for the contract cost.”
- **Practică:** R14 calm. Misiunea scurtă „Chain scavenger hunt”: 8 întrebări pe lanț (cel mai ieftin put ITM, extrinsecul unui call ATM etc.), fără ordine reale.
- **Check:** (1) mcq: cine are obligația într-un call vândut; (2) mcq: un put cu strike 95 când LABX e la 100 (OTM); (3) numeric: valoarea extrinsecă a unui put 105 cotat 6.08 cu LABX la 100 (1.08).
- **Dovezi:** Mechanic (R6 §4.1; R1 §2.21 DL-05).
- **Necesită:** S12 (lanț de opțiuni, prețuri Black–Scholes)
- **Termeni noi de glosar:** option, call-option, put-option, strike-price, expiration-date, option-premium, contract-multiplier, in-the-money, at-the-money, out-of-the-money, intrinsic-value, extrinsic-value

#### 4.1.2 · Payoffs at expiry: four building blocks
- **Nivel / durată / tip:** Professional · 7 min · Elective (Derivatives)
- **Obiective:**
  1. Draw the expiry payoff of a long call, short call, long put and short put.
  2. Compute the breakeven, maximum loss and maximum gain of each building block.
  3. Explain exercise and assignment, and the difference between American and European style.
- **Concepte:** option-payoff (nou), exercise-and-assignment (nou), option-contract (nou, din 4.1.1), r-multiple ✓
- **Se sprijină pe:** 4.1.1
- **Hook:** predict · alegere multiplă. „Which positions in the 100-strike LABX option can lose more than 900 vUSD on one contract?” Variante: long call, short call ✓, long put, short put ✓. Short call: pierdere nelimitată; short put: până la (100 − 2.86) × 10 = 971.40.
- **Interacțiunea centrală:**
  - `figure` (4 pași, `Line` + `Level`): cele patru diagrame de payoff la expirare pentru strike 100 și prima 2.86, fiecare cu break-even-ul marcat.
  - `worked` cu formulele:
    - long call: P&L = max(S_T − K, 0) − c; break-even K + c = 102.86; pierdere maximă 2.86; câștig maxim nelimitat;
    - long put: P&L = max(K − S_T, 0) − p; break-even K − p = 97.14; pierdere maximă 2.86; câștig maxim 97.14 (LABX la zero);
    - short call și short put: oglinda (câștig maxim 2.86; pierdere maximă nelimitată, respectiv 97.14).
    Ultimul break-even îl calculează cursantul.
  - `explain`: înainte de costuri, opțiunile sunt un joc cu sumă zero între cumpărător și vânzător. Exercitarea (holder-ul își folosește dreptul) și assignment-ul (vânzătorul e obligat să livreze). Stil american (oricând până la expirare, de exemplu opțiunile pe acțiuni din SUA) vs european (doar la expirare, de exemplu opțiunile pe indicele SPX, decontate cash) [PK]. Riscuri: assignment anticipat pe call-uri vândute înainte de ex-dividend, pin risk la expirare.
  - `match`: 4 descrieri de vedere („bullish, wants a small fixed cost”, „neutral, happy to buy lower” …) ↔ cele 4 poziții.
- **Try:** widget `payoff-builder`. Sarcina: „Build the position that profits if LABX ends below 97.14 and can never lose more than 28.60 vUSD per contract.” Reușită: 1 long put strike 100; diagrama arată break-even 97.14 și pierderea maximă 28.60. Indicii: 1. „Profit below a price means a bearish position.” 2. „A fixed maximum loss means you paid the premium.”
- **Practică:** R14 cu traiectorii R1 și R2. Drill „predict the expiry”: 10 poziții, cursantul trage valoarea finală pe diagramă înainte de reveal; scor pe eroarea de break-even.
- **Check:** (1) numeric: break-even-ul unui long put 95 cumpărat la 0.97 (94.03); (2) mcq: pierderea maximă a unui short put 100 la 2.86 (97.14 pe unitate); (3) mcq: ce înseamnă assignment pentru vânzătorul unui call.
- **Dovezi:** Mechanic (R6 §4.1, §4.4; ghidul OCC citat în R6 §8.1).
- **Necesită:** S12 (payoff builder)
- **Termeni noi de glosar:** payoff-diagram, option-breakeven, option-writer, exercise, assignment, american-option, european-option, pin-risk

#### 4.1.3 · Put-call parity and synthetic positions
- **Nivel / durată / tip:** Professional · 7 min · Elective (Derivatives)
- **Obiective:**
  1. State put-call parity and use it to find a missing option price.
  2. Build a synthetic long position from options and recognise that a covered call has the same payoff as a short put.
  3. Show why a small parity gap disappears after realistic costs.
- **Concepte:** put-call-parity (nou), synthetic-position (nou), option-payoff (nou, din 4.1.2), trading-costs ✓
- **Se sprijină pe:** 4.1.2, 1.1 (spread, comision)
- **Hook:** predict · numeric. „The 100-strike LABX call and put both expire in 30 days. LABX is at 100.00 and rates are zero. The call costs 2.86. What should the put cost?” Răspuns: 2.86.
- **Interacțiunea centrală:**
  - `worked` cu formula, fără dividende: **C − P = S − K·e^(−rT)**. Exemplu cu dobândă: S = 100, K = 100, T = 0.25, r = 4%, IV 20%: call 4.49, put 3.49; K·e^(−0.01) = 99.00; S − 99.00 = 1.00 = 4.49 − 3.49. Cursantul calculează diferența.
  - `figure` (3 pași): long call + short put cu același strike și aceeași expirare = payoff-ul unei poziții long în LABX (forward sintetic).
  - `match`: patru echivalențe: long call + short put = long sintetic; long stock + long put = long call (plus cash); long stock + short call = short put (plus cash); short call + long put = short sintetic.
  - `callout`: covered call ≡ cash-secured put prin paritate (R6 §4.4), deci au același risc de scădere.
- **Try:** widget `parity-checker` (r = 0). Put-ul 100 e cotat 2.50 în loc de 2.86. Sarcina: „Build a position that locks in the mispricing.” Reușită: +1 LABX la 100.00, +1 put 100 la 2.50, −1 call 100 la 2.86: cost net 99.64, valoare la expirare 100.00 în orice scenariu, câștig blocat 0.36 pe unitate. Apoi comutatorul „costs on”: spread 0.10 pe fiecare picior și comision 0.05% pe acțiune la intrare și la ieșire, deci costuri 0.25 și câștig net 0.11. În R12 (spread 0.40 pe opțiuni) câștigul net devine negativ. Indicii: 1. „Buy what is cheap, sell what is expensive.” 2. „Add the stock so the combination is worth the strike at expiry.”
- **Practică:** R14 cu cotații în care 1 din 20 are o abatere de paritate injectată. Cursantul le semnalează și decide dacă merită după costuri. Callout E: „In liquid markets these gaps close in milliseconds. You are learning to check consistency, not to compete with arbitrage desks.”
- **Check:** (1) numeric: prețul put-ului din paritate (r = 0, S = 100, K = 105, call 1.08 → put 6.08); (2) mcq: ce combinație e echivalentă cu un covered call; (3) mcq: de ce o abatere de 0.36 nu e un câștig gratuit pentru un cont retail.
- **Dovezi:** Mechanic (R1 §2.21 DL-06; R6 §4.4, nota despre cash-secured put).
- **Necesită:** S12 (cotații bid/ask pe opțiuni, abateri injectate)
- **Termeni noi de glosar:** put-call-parity, synthetic-position, arbitrage, risk-free-rate, cash-secured-put

#### 4.1.4 · What sets an option's price
- **Nivel / durată / tip:** Professional · 7 min · Elective (Derivatives)
- **Obiective:**
  1. Name the five Black–Scholes inputs and the direction each one pushes a call price.
  2. Estimate an at-the-money option price with the 0.4 × S × σ × √T rule.
  3. Explain which model assumptions fail in real markets.
- **Concepte:** option-pricing-model (nou), volatility ✓, fat-tails (3.10), gap-risk ✓
- **Se sprijină pe:** 4.1.3, 2.4 (volatilitate), 3.10 (distribuții, cozi groase)
- **Hook:** predict · alegere multiplă. „Which changes make the 30-day, 100-strike LABX call (2.86) more expensive?” Variante: more time to expiry ✓, less time, higher volatility ✓, a higher strike.
- **Interacțiunea centrală:**
  - `explain`: intrările sunt S (prețul suport), K (strike), T (timpul în ani), σ (volatilitatea), r (dobânda), plus dividendele q. Toate se văd pe ecran, în afară de σ: σ e singura estimare.
  - `worked` cu formula:
    - C = S·N(d1) − K·e^(−rT)·N(d2); P = K·e^(−rT)·N(−d2) − S·N(−d1);
    - d1 = [ln(S/K) + (r + σ²/2)·T] / (σ·√T); d2 = d1 − σ·√T.
    - Exemplu: S = 100, K = 100, T = 30/365 = 0.0822, σ = 0.25, r = 0. σ·√T = 0.0717; d1 = 0.0358; d2 = −0.0358; N(d1) = 0.5143; N(d2) = 0.4857; C = 51.43 − 48.57 = **2.86**.
    - Regula rapidă pentru ATM: 0.4 × 100 × 0.25 × √0.0822 = 2.87. Cursantul o calculează.
  - `predict` (3 runde, slider): IV 25% → 35% (4.00); T 30 → 7 zile (1.38); K 100 → 105 (1.08). Reveal după fiecare.
  - `callout`: modelul presupune volatilitate constantă, randamente lognormale, tranzacționare continuă și fără salturi. Piețele au skew, cozi groase și gap-uri (R4, R12). Black–Scholes e o limbă comună pentru prețuri, nu o descriere a realității.
- **Try:** widget `option-pricer`. Sarcina: „Double the price of the 30-day 100-call without moving LABX or the strike.” Reușită: preț 5.72 ± 0.10 cu S = 100 și K = 100 blocate. Două drumuri valide: IV ≈ 50% (5.71) sau T ≈ 120 de zile (5.71); feedback-ul le arată pe amândouă. Indicii: 1. „Only time and volatility are left to change.” 2. „ATM price grows with σ and with the square root of time.”
- **Practică:** R14. Drill de calibrare: cursantul estimează 10 prețuri cu regula rapidă, apoi le compară cu pricer-ul; scor pe eroarea medie absolută.
- **Check:** (1) mcq: singura intrare neobservabilă (σ); (2) numeric: estimarea rapidă pentru S = 100, IV 20%, 1 an (≈ 8.00; modelul dă 7.97); (3) mcq: ce presupunere a modelului e încălcată de un gap peste noapte.
- **Dovezi:** Mechanic (aritmetica modelului); presupunerile modelului sunt contrazise de skew și de cozile groase (R6 §4.3; R5 ST-04).
- **Necesită:** S12 (pricer cu intrări editabile)
- **Termeni noi de glosar:** black-scholes, time-to-expiry

#### 4.1.5 · Delta and gamma: how the price moves with LABX
- **Nivel / durată / tip:** Professional · 8 min · Elective (Derivatives)
- **Obiective:**
  1. Estimate an option's price change from delta and gamma for a small move in LABX.
  2. Size a share hedge that makes an options position delta-neutral.
  3. Explain why gamma explodes for at-the-money options close to expiry.
- **Concepte:** option-delta (nou), option-gamma (nou), delta-hedging (nou), exposure ✓
- **Se sprijină pe:** 4.1.4, 1.4 (expunere)
- **Hook:** predict · slider 0.00–1.00. „LABX rises 1.00. Roughly how much does the 30-day 100-strike call (2.86) gain?” Răspuns: ≈ 0.54 (de la 2.86 la 3.40).
- **Interacțiunea centrală:**
  - `explain`: delta (Δ) = variația prețului opțiunii la o mișcare de 1.00 în LABX. Call-urile au delta între 0 și 1, put-urile între −1 și 0, ATM ≈ ±0.5. Delta e și raportul de hedge și, aproximativ, probabilitatea de a termina ITM.
  - `figure` (3 pași, `Bars`): delta pe strike-uri din tabelul de referință: 0.93, 0.77, 0.51, 0.26, 0.10.
  - `worked`: gamma (Γ) = variația lui delta la o mișcare de 1.00. ΔC ≈ Δ·dS + ½·Γ·dS² = 0.51 × 1 + 0.5 × 0.056 × 1 = 0.54; repricing complet: 3.40. Cursantul calculează.
  - `worked`: delta poziției. 10 contracte long call 100 = 100 de unități de opțiune × 0.514 ≈ +51 unități LABX. Hedge: short 51 LABX.
  - `figure` (2 pași): gamma ATM la 30 de zile (0.056) vs la o zi (0.30, de ≈ 5.5 ori mai mare). De aceea opțiunile 0DTE se mișcă exploziv: loterie pentru cumpărători, risc de coadă pentru vânzători (R6 §4.4).
- **Try:** widget `greeks-sandbox`. Sarcina: „You hold 10 long 100-calls. Make the position delta-neutral with LABX shares.” Reușită: |delta net| ≤ 1 unitate (short 51 LABX). Apoi un slider de preț arată cum delta-neutral nu rămâne neutral: după +3.00 delta net e iar pozitiv, adică gamma lucrează pentru cumpărător. Indicii: 1. „Position delta = contracts × 10 × option delta.” 2. „Short that many units of LABX.”
- **Practică:** R14 + R3. Cursantul ține poziția delta-hedged 10 zile, cu re-hedge zilnic; jurnalul arată P&L-ul din gamma pe zilele calme vs volatile.
- **Check:** (1) mcq: delta unui put ATM (≈ −0.49); (2) numeric: hedge-ul pentru 20 de contracte long call cu delta 0.26 (short 52 LABX); (3) mcq: unde e gamma cea mai mare (ATM, aproape de expirare).
- **Dovezi:** Mechanic (R6 §4.2, definiții standard [PK]).
- **Necesită:** S12 (Greeks, re-hedge)
- **Termeni noi de glosar:** greeks, delta, gamma, hedge-ratio, delta-neutral, delta-hedging, 0dte-option

#### 4.1.6 · Theta, vega and the gamma–theta trade-off
- **Nivel / durată / tip:** Professional · 8 min · Elective (Derivatives)
- **Obiective:**
  1. Explain why time decay speeds up near expiry and which options carry the most vega.
  2. Decompose a one-day option P&L into delta, gamma, theta and vega.
  3. Find the daily move at which a delta-hedged long option breaks even, and link it to implied volatility.
- **Concepte:** option-theta (nou), option-vega (nou), gamma-theta-tradeoff (nou), option-gamma (nou, din 4.1.5)
- **Se sprijină pe:** 4.1.5, 2.4 (volatilitate realizată)
- **Hook:** predict · alegere. „You own the 30-day 100-call. Tomorrow LABX rises 2.00, but implied volatility drops 3 points. Does the call gain or lose?” Variante: gains about 1.03 / gains about 0.75 ✓ / about flat / loses. Delta singur sugerează +1.03; vega ia înapoi 0.34.
- **Interacțiunea centrală:**
  - `figure` (3 pași, `Line`): theta ATM pe zi: −0.048 la 30 de zile, −0.099 la 7 zile, −0.261 la o zi. Descompunerea accelerează în ultimele săptămâni.
  - `explain`: vega (ν) = variația la 1 punct de volatilitate implicită: 0.114 pentru ATM la 30 de zile, 0.397 pentru ATM la un an. Opțiunile lungi au cea mai multă vega. Rho (ρ) = variația la 1% dobândă; contează pentru opțiunile lungi.
  - `worked` cu formula: dV ≈ Δ·dS + ½·Γ·dS² + Θ·dt + ν·dσ = 0.514 × 2 + 0.5 × 0.056 × 4 − 0.048 + 0.114 × (−3) = 1.03 + 0.11 − 0.05 − 0.34 = **0.75**. Repricing complet: 0.77 (diferența vine din termenii de ordin mai mare). Cursantul calculează termenul de vega.
  - `worked`: compromisul gamma–theta. O opțiune long, delta-hedged (re-hedge-ul repetat se numește gamma scalping), câștigă pe zi ½·Γ·dS² și pierde |Θ|. Break-even la dS = √(2 × 0.048 / 0.056) = **1.31**, adică exact mișcarea zilnică implicită: S·σ/√365 = 100 × 0.25 / 19.1 = 1.31. Concluzie: cumpărătorul de gamma câștigă când volatilitatea realizată depășește volatilitatea implicită; vânzătorul, invers.
- **Try:** widget `greeks-sandbox`. Sarcina: „Find a one-day LABX move at which a delta-hedged long 100-call breaks even.” Reușită: |dS| = 1.31 ± 0.05, în oricare direcție. Indicii: 1. „Gamma P&L is ½ × gamma × move².” 2. „Set it equal to one day of theta.”
- **Practică:** R14 + R3. Aceeași poziție delta-hedged (IV 25%) rulată de 20 de ori într-un regim cu volatilitate realizată 15% și de 20 de ori cu 35%. Cursantul prezice semnul P&L-ului înainte de fiecare lot.
- **Check:** (1) mcq: semnul lui theta pentru un short put (pozitiv); (2) mcq: ce opțiune are cea mai mare vega (ATM, termen lung); (3) numeric: descompunerea P&L-ului pentru dS = −1, dσ = +2, o zi (−0.51 + 0.03 − 0.05 + 0.23 = −0.30).
- **Dovezi:** Mechanic (R6 §4.2; compromisul gamma–theta din R6 §4.2).
- **Necesită:** S12 (Greeks, descompunerea P&L)
- **Termeni noi de glosar:** theta, vega, rho, time-decay, realized-volatility, gamma-scalping

#### 4.1.7 · Implied volatility, skew and the term structure
- **Nivel / durată / tip:** Professional · 7 min · Elective (Derivatives)
- **Obiective:**
  1. Back out implied volatility from an option price.
  2. Read skew and term structure on a volatility surface.
  3. Convert a straddle price into the move the market is pricing in.
- **Concepte:** implied-volatility (nou), volatility-surface (nou), implied-move (3.8), iv-crush (3.8), vix (3.9)
- **Se sprijină pe:** 4.1.4, 4.1.6, 3.8 (IV crush), 3.9 (VIX ca sentiment)
- **Hook:** predict · slider 0–15%. „A 7-day LABX straddle costs 6.63 before a scheduled event. What move is the market pricing in?” Răspuns: ≈ ±6.6%.
- **Interacțiunea centrală:**
  - `explain`: volatilitatea implicită (IV) e valoarea lui σ care face ca modelul să dea prețul din piață. E prognoza pieței plus o primă de risc. În medie IV e peste volatilitatea realizată (Carr & Wu 2009); detaliile în 4.1.11.
  - `figure` (3 pași, suprafața R14): skew pe strike (put-urile pe indice au IV mai mare, cererea de protecție la crash); structura la termen (de obicei crescătoare, inversată în crize); vârful de IV pe expirarea de după eveniment.
  - `hotspot`: „Tap the expiry that contains the scheduled event.”
  - `worked`: implied move ≈ straddle ATM ÷ S ≈ 0.8 × σ × √T. Exemplu de eveniment: 7 zile, IV 60%: call 3.31 + put 3.31 = 6.63 → 6.6%; verificare 0.8 × 0.60 × √(7/365) = 6.65%. Fără eveniment: straddle-ul de 30 de zile la IV 25% costă 5.72, adică 5.7% pe 30 de zile. Cursantul calculează a doua linie.
  - `callout`: VIX = volatilitatea implicită pe 30 de zile a indicelui S&P 500, din opțiunile SPX [PK]. IV rank și IV percentile sunt instrumente de context ale practicienilor (nota C, R6 §4.3).
- **Try:** widget `option-pricer` în modul „solve for IV”. Sarcina: „The 30-day 100-call trades at 4.00. What implied volatility does that price imply?” Reușită: 35% ± 1 punct. Indicii: 1. „Raise σ until the model price matches 4.00.” 2. „Vega is about 0.11 per point, and you need 1.14 more than 2.86.”
- **Practică:** R14 + R5. 10 evenimente sintetice: cursantul citește implied move-ul înainte, apoi vede mișcarea realizată; scor de calibrare (cât de des mișcarea realizată iese din ±implied move).
- **Check:** (1) mcq: definiția IV; (2) hotspot pe o suprafață: unde e skew-ul de put; (3) numeric: implied move din straddle 4.20 cu LABX la 100 (4.2%).
- **Dovezi:** Mechanic (definiția IV și implied move); A pentru existența primei de risc pe volatilitate (R6 §4.3, §2.14); C pentru IV rank/percentile (R6 §4.3); R4 §5.8 (implied move și IV crush).
- **Necesită:** S12 (suprafață IV: skew, termen, IV de eveniment), S6 (calendarul de evenimente)
- **Termeni noi de glosar:** volatility-skew, volatility-smile, iv-term-structure, volatility-surface, iv-rank (implied-volatility și implied-move există de la 3.8, vix de la 3.9)

#### 4.1.8 · Stock plus options: covered calls, protective puts and collars
- **Nivel / durată / tip:** Professional · 8 min · Elective (Derivatives)
- **Obiective:**
  1. Compute the maximum gain, maximum loss and breakeven of a covered call, a protective put and a collar.
  2. Compare a protective put with a stop-loss through an overnight gap.
  3. Match each structure to the regime where it helps and the regime where it hurts.
- **Concepte:** covered-call (nou), protective-put (nou), option-collar (nou), gap-risk ✓, stop-loss-order ✓
- **Se sprijină pe:** 4.1.2, 4.1.3, 1.3 (gap prin stop), 2.8 (regimuri)
- **Hook:** predict · alegere. „LABX gaps from 100.00 to 88.00 overnight. Your stop was at 95.00. A 95-put cost 0.97. Which protected you better?” Răspuns: put-ul: pierdere 5.97 pe unitate, față de 12.00 cu stop-ul care se execută la deschidere.
- **Interacțiunea centrală:**
  - `worked` (tabel; S = 100, 30 de zile, IV 25%; pe unitate):

    | Structură | Construcție | Câștig maxim | Pierdere maximă | Break-even | Regim potrivit | Regim care o pedepsește |
    |---|---|---|---|---|---|---|
    | Covered call | long LABX 100.00 + short call 105 (1.08) | (105 − 100) + 1.08 = 6.08 | 100 − 1.08 = 98.92 (LABX la zero) | 98.92 | R2 range, urcare lentă | R1 rally puternic (câștig plafonat), R12 crash (pierde aproape cât acțiunea) |
    | Protective put | long LABX 100.00 + long put 95 (0.97) | nelimitat | (100 − 95) + 0.97 = 5.97 | 100.97 | deținere prin R4 gap-uri și R5 evenimente | R1/R2 calm: prima e un cost fix |
    | Collar | long LABX + long put 95 (0.97) + short call 105 (1.08) | 5.00 + 0.11 = 5.11 | 5.00 − 0.11 = 4.89 | 99.89 | deținere protejată când accepți un plafon | R1 rally puternic |

    Cursantul completează rândul collar-ului.
  - `reveal` (3 rulări pe aceeași traiectorie): R1 +12% (acțiunea +12.00, covered call +6.08), R2 la 100 (acțiunea 0, covered call +1.08), R12 −20% (acțiunea −20.00, covered call −18.92).
  - `explain`: dimensionarea la 1%: protective put cu pierdere maximă 5.97 pe unitate → 100.00 ÷ 5.97 = 16 unități (95.52 vUSD).
  - `callout`: istoria indicelui Cboe BXM (covered call pe S&P 500) arată randamente apropiate de acțiuni cu volatilitate mai mică [PK, verify]; nota B/C. Covered call nu „produce venit gratuit”: vinde partea de sus a distribuției.
- **Try:** widget `payoff-builder`. Sarcina: „On 100.00 LABX, build a collar that costs nothing or pays a credit and caps your loss at 5.00 or less per unit.” Reușită: prima netă ≥ 0 și pierderea maximă ≤ 5.00 (soluția de referință: put 95 + call 105, credit 0.11, pierdere maximă 4.89). Indicii: 1. „Buy a put below the price for the floor.” 2. „Sell a call above the price to pay for it.”
- **Practică:** R1, R2, R12 și R4 pe aceeași traiectorie sintetică: drill-urile „covered call vs stock” și „hedging drill” din R6 §4.4. Scor: predicția clasamentului structurilor în fiecare regim, înainte de rulare.
- **Check:** (1) numeric: câștigul maxim al unui covered call cu call 110 vândut la 0.32 (10.32); (2) mcq: de ce put-ul protejează printr-un gap iar stop-ul nu; (3) mcq: regimul în care covered call-ul rămâne cel mai mult în urma acțiunii (R1 rally).
- **Dovezi:** Mechanic (payoff-uri, R6 §4.4); B/C pentru randamentul covered call pe termen lung (BXM, [PK, verify], R6 §4.4); Mechanic pentru put vs stop prin gap (R6 §4.4 hedging drill; R3 §2.14).
- **Necesită:** S12 (payoff builder, structuri cu acțiune), generatorul de gap-uri R4 (existent în Arena)
- **Termeni noi de glosar:** covered-call, protective-put, collar

#### 4.1.9 · Vertical spreads: defined risk, defined reward
- **Nivel / durată / tip:** Professional · 8 min · Elective (Derivatives)
- **Obiective:**
  1. Compute the debit or credit, maximum gain, maximum loss and breakeven of the four vertical spreads.
  2. Explain why a credit spread's high win rate says nothing about its edge.
  3. Size a spread so its maximum loss fits a 1% risk budget.
- **Concepte:** vertical-spread (nou), expectancy ✓, reward-to-risk ✓, position-sizing ✓
- **Se sprijină pe:** 4.1.2, 4.1.4, 1.4 (expectancy, R:R)
- **Hook:** predict · alegere. „A credit spread wins about 4 times out of 5 at expiry. Is it a good trade?” Variante: „Yes, 80% wins” / „Only if it costs nothing” / „Can't tell without the size of the loss” ✓ / „Only in a trend”.
- **Interacțiunea centrală:**
  - `worked` (tabel; 30 de zile, IV 25%; pe unitate):

    | Spread | Construcție | Debit / credit | Câștig maxim | Pierdere maximă | Break-even | Regim potrivit |
    |---|---|---|---|---|---|---|
    | Bull call (debit) | +call 100 (2.86), −call 105 (1.08) | debit 1.78 | 5 − 1.78 = 3.22 | 1.78 | 101.78 | R1 urcare moderată, cu țintă |
    | Bear put (debit) | +put 100 (2.86), −put 95 (0.97) | debit 1.89 | 5 − 1.89 = 3.11 | 1.89 | 98.11 | coborâre moderată |
    | Bull put (credit) | −put 95 (0.97), +put 90 (0.21) | credit 0.76 | 0.76 | 5 − 0.76 = 4.24 | 94.24 | R2 range sau urcare ușoară |
    | Bear call (credit) | −call 105 (1.08), +call 110 (0.32) | credit 0.76 | 0.76 | 4.24 | 105.76 | R2 range sau coborâre ușoară |

    Formula comună: la debit, câștigul maxim = lățimea − debitul; la credit, pierderea maximă = lățimea − creditul. Cursantul calculează break-even-ul ultimului rând.
  - `explain`: probabilitatea ca bull put-ul să termine peste 94.24 e ≈ 79% (probabilitatea din model). Câștigă 0.76 de ≈ 4 ori din 5 și pierde până la 4.24. În lumea modelului, valoarea așteptată e ≈ 0 înainte de costuri. Un edge ar trebui să vină din altă parte (prima pe volatilitate, 4.1.11), nu din rata de câștig.
  - `figure` (2 pași): bull call vs long call simplu: riscul definit vine cu un plafon; vega și theta sunt mai mici decât la call-ul simplu.
  - `worked`: dimensionarea la 1%: bull call cu pierdere maximă 1.78 × 10 = 17.80 vUSD pe contract → 5 contracte (89.00); al șaselea ar duce la 106.80.
- **Try:** widget `payoff-builder`. Sarcina: „Build a bullish spread on LABX with maximum loss at most 2.00 and maximum gain at least 3.00 per unit.” Reușită: bull call 100/105 (pierdere 1.78, câștig 3.22) sau orice alt vertical bullish care respectă ambele condiții. Indicii: 1. „Buy the lower strike, sell the higher one.” 2. „Max gain is the strike width minus what you paid.”
- **Practică:** R14 + R1/R2. 8 setup-uri: cursantul alege debit vertical, credit vertical sau „no trade” și dimensionează la ≤ 1%. Scor: potrivirea cu regimul, respectarea pierderii maxime, nu P&L-ul.
- **Check:** (1) numeric: break-even-ul unui bear put 100/95 plătit 1.89 (98.11); (2) numeric: pierderea maximă a unui credit spread de lățime 5 cu credit 1.20 (3.80); (3) mcq: de ce rata de câștig de 79% nu dovedește un edge.
- **Dovezi:** Mechanic (payoff-uri, R6 §4.4); C pentru rezultatele strategiilor de credit (R6 §4.4: „high win rate, larger losses”).
- **Necesită:** S12 (payoff builder, probabilități din model)
- **Termeni noi de glosar:** vertical-spread, debit-spread, credit-spread, spread-width, defined-risk

#### 4.1.10 · Buying movement: straddles, strangles and the event trap
- **Nivel / durată / tip:** Professional · 8 min · Elective (Derivatives)
- **Obiective:**
  1. Compute the breakevens, maximum loss and maximum gain of a long straddle and a long strangle.
  2. Show why a correct "big move" call can still lose after implied volatility collapses.
  3. Decide between long straddle, long strangle and no trade by comparing the implied move with your expected move.
- **Concepte:** long-volatility (nou), implied-move (3.8), iv-crush (3.8), pending-order-straddle (3.7)
- **Se sprijină pe:** 4.1.6, 4.1.7, 3.7 (straddle cu ordine în așteptare), 3.8 (IV crush)
- **Hook:** predict · alegere. „LABX reports in 7 days. You expect a big move but don't know the direction. The straddle costs 6.63. The day after the event LABX is up 4%. Do you profit?” Răspuns: nu, −2.28: straddle-ul valorează 4.35, pentru că IV a căzut de la 60% la 25% și mișcarea a fost sub cea implicită.
- **Interacțiunea centrală:**
  - `worked` (tabel; eveniment în 7 zile, IV 60%):

    | Structură | Construcție | Cost | Pierdere maximă | Câștig maxim | Break-even la expirare | Regim potrivit | Regim care o pedepsește |
    |---|---|---|---|---|---|---|---|
    | Long straddle | +call 100 (3.31), +put 100 (3.31) | 6.63 | 6.63 | nelimitat sus; 93.37 jos | 93.37 și 106.63 | R5 când mișcarea realizată > cea implicită; R3 expansiune de volatilitate; R4 salturi | R2 calm; IV crush după eveniment |
    | Long strangle | +call 105 (1.47), +put 95 (1.33) | 2.79 | 2.79 | nelimitat sus; 92.21 jos | 92.21 și 107.79 | aceleași, cu nevoie de mișcare mai mare | aceleași |

    Short straddle și short strangle sunt oglinda: câștig maxim = prima, pierdere nelimitată pe partea call-ului. Vin în 4.1.11, cu riscul lor de coadă.
  - `reveal` (ziua de după eveniment, IV 25%, 6 zile rămase): LABX 96 → straddle 4.30 (−2.33); 100 → 2.56 (−4.07); 104 → 4.35 (−2.28). Break-even-ul de a doua zi e la ≈ ±6.6, aproape exact mișcarea implicită.
  - `explain`: într-un set de date de practician, mișcările realizate au fost în medie ≈ 85% din cele implicite; alt studiu găsește prețuri aproximativ corecte (R4 §4.3, §5.8). Concluzia: straddle-ul cumpărat înaintea evenimentului nu e un câștig garantat, ci un pariu că mișcarea va fi mai mare decât cea pe care o prețuiește deja piața.
  - `callout`: varianta cu ordine stop pe ambele părți (3.7) are alt risc: spread-ul lărgit poate executa ambele părți (whipsaw).
- **Try:** widget `event-straddle`. Sarcina: „Find the smallest next-day move that makes the 6.63 straddle profitable after IV falls to 25%.” Reușită: |mișcare| = 6.6 ± 0.2 (LABX ≈ 93.40 sau ≈ 106.57). Indicii: 1. „After the event the options are cheap again.” 2. „The straddle must be worth at least what you paid.”
- **Practică:** R5 + R14. 20 de evenimente sintetice cu implied move afișat; cursantul alege long straddle, long strangle sau „no trade” și scrie mișcarea pe care o așteaptă. În generator, mișcarea realizată e în medie sub cea implicită, cu cozi groase. Scor de decizie: dacă alegerea a comparat implied move cu propria estimare; P&L-ul apare, dar nu se notează.
- **Check:** (1) numeric: break-even-urile unui straddle 100 plătit 5.72 (94.28 și 105.72); (2) mcq: de ce pierde un straddle când direcția „a fost ghicită”; (3) mcq: strangle vs straddle: ce câștigi și ce plătești.
- **Dovezi:** Mechanic (payoff, IV crush); C pentru profitabilitatea straddle-urilor la evenimente (R4 §4.3, §5.8; R6 §2.9.3).
- **Necesită:** S12, S6 (IV de eveniment, salt cu semn aleator, crush)
- **Termeni noi de glosar:** strangle, long-volatility, event-volatility (straddle există de la 3.8)

#### 4.1.11 · The volatility risk premium: getting paid to sell insurance
- **Nivel / durată / tip:** Professional · 8 min · Elective (Derivatives)
- **Obiective:**
  1. Explain the volatility risk premium and why option sellers are paid on average.
  2. Compare the risk of a naked short straddle with a defined-risk iron condor.
  3. Size a short-volatility position from a stress loss, not from the premium collected.
- **Concepte:** volatility-risk-premium (nou), short-volatility-risk (nou), fat-tails (3.10), risk-of-ruin (3.12), sharpe-ratio (3.10)
- **Se sprijină pe:** 4.1.9, 4.1.10, 3.10 (skew, cozi groase), 3.12 (risk of ruin), 3.10 (Sharpe)
- **Hook:** predict · alegere. „A strategy made money in 22 of the last 24 months, with tiny losses. What is the most likely hidden risk?” Variante: „None, it's skill” / „A rare, very large loss” ✓ / „Taxes” / „Boredom”.
- **Interacțiunea centrală:**
  - `explain`: volatilitatea implicită depășește în medie volatilitatea realizată ulterior. Carr & Wu (2009) găsesc prime de risc pe varianță puternic negative pe indici: cumpărătorii de opțiuni plătesc o asigurare, iar vânzătorii o încasează în medie (R6 §2.14, §4.3).
  - `reveal` „Volmageddon” (5 februarie 2018): VIX de la 17.31 la 37.32 într-o sesiune; produsele short-vol au pierdut peste 90% într-o zi; XIV a scăzut de la ≈ $1.9 miliarde la $63 milioane și a fost închis (R6 §2.14).
  - `worked` (tabel; 30 de zile, IV 25%):

    | Structură | Construcție | Credit | Câștig maxim | Pierdere maximă | Break-even | Regim potrivit | Regim care o pedepsește |
    |---|---|---|---|---|---|---|---|
    | Short straddle | −call 100, −put 100 | 5.72 | 5.72 | nelimitată sus; 94.28 jos | 94.28 și 105.72 | R2 range, IV mare care scade | R3 spike, R4 salt, R12 criză |
    | Iron condor | −put 95, +put 90, −call 105, +call 110 | 1.52 | 1.52 | 5 − 1.52 = 3.48 | 93.48 și 106.52 | R2 range | aceleași, dar cu pierdere plafonată |

    Probabilitatea din model ca LABX să termine între 93.48 și 106.52 e ≈ 64%. Cursantul calculează pierderea maximă a condor-ului.
  - `worked`: dimensionarea din stres. Bugetul de 1% (100.00): condor-ul pierde cel mult 34.80 pe contract, deci 2 contracte (69.60). Short straddle-ul nu are pierdere maximă: la un gap de −15% pierde 9.28 pe unitate (92.80 pe contract), la −25% pierde 19.28 (192.80). Mărimea se fixează pe scenariul de stres ales, nu pe prima încasată.
  - `callout`: Sharpe-ul măgulește strategiile cu skew negativ (R5 PM-07): o curbă netedă cu o coadă ascunsă arată foarte bine până în ziua cozii. Expected Shortfall (4.4.1) e măsura potrivită aici.
- **Try:** widget `vrp-campaign`. Sarcina: „Choose a structure and size so the worst engineered volatility spike costs no more than 3% of the account.” Reușită: pierderea în scenariul de stres S20 al widget-ului ≤ 300.00 vUSD (de exemplu, iron condor de cel mult 8 contracte: 8 × 34.80 = 278.40). Indicii: 1. „Start from the stress loss per contract.” 2. „Defined-risk structures make this calculation exact.”
- **Practică:** R14 + R3 + R12, „campania de 24 de luni” (R6 §2.14): cursantul vinde sau cumpără straddle-uri de 30 de zile lunar, cu mărime aleasă. O lună are un salt de volatilitate construit. La final: curba de equity, pierderea maximă din luna de stres, Expected Shortfall-ul și comparația cu benchmark-ul pasiv.
- **Check:** (1) mcq: ce înseamnă prima de risc pe volatilitate; (2) numeric: pierderea maximă a unui condor cu aripi de 5 și credit 1.10 (3.90); (3) mcq: de ce un Sharpe mare nu e un argument pentru o strategie short-vol.
- **Dovezi:** A pentru existența primei de risc pe volatilitate (Carr & Wu 2009), cu risc de crash; F-adjacent pentru vânzarea de volatilitate fără risc definit, la retail, fără dimensionare strictă (R6 §2.14, §4.3, §4.4: „E for retail without defined risk”).
- **Necesită:** S12, S20 (salt de volatilitate, gap), S15 (Expected Shortfall pe campanie)
- **Termeni noi de glosar:** volatility-risk-premium, short-volatility, iron-condor, tail-risk (negative-skew există de la 2.8)

---
## Unitatea 4.2 · Execution and market impact (6 lecții)

### Fișa unității

- **Scop:** costul execuției văzut din partea celui care mută prețul. Implementation shortfall ca măsură completă a costului (4.2.1), legea rădăcinii pătrate pentru impact (4.2.2), algoritmii de execuție și compromisul impact ↔ risc de timing (4.2.3), latența și HFT (4.2.4), apoi regimurile de stres în care regulile obișnuite ale ordinelor se schimbă: halt-uri, LULD, circuit breakers (4.2.5), fix-uri, expirări, rebalansări (4.2.6).
- **De ce aici:**
  - La 1.3 și 1.1 costul era spread + comision + slippage; la 3.2–3.3 cursantul a văzut order book-ul, coada și fluxul. Aici întrebarea se întoarce: ce se întâmplă când **tu** ești lichiditatea consumată.
  - R3 §8.2 pune „M10 Execution & impact” (A→E) și „M11 Stress regimes” (E) chiar înaintea capstone-ului. R6 §2.16 notează execuția ca „A (execution, not alpha)”.
  - Capacitatea (4.3.6) și scalarea (4.6.5) folosesc direct modelul de impact de aici.
- **Se sprijină pe:** 1.1 (costuri), 1.3 (ordine, execuții parțiale, gap-uri), 2.5 (VWAP), 2.9 (ritmul intraday), 3.2 (order book, market makers, licitații, coadă), 3.3 (tape, DOM, spoofing), 3.7 (evenimente extreme: SNB 2015, flash crash).
- **Checkpoint (test out):** 10 întrebări, ≥ 80%:
  - 2 numerice de implementation shortfall (componente, bps);
  - 2 de impact (rădăcina pătrată: dublarea ordinului, costul total);
  - 2 de alegere a algoritmului (urgență vs impact);
  - 1 de latență (ordinul limită rămas „stale”);
  - 3 de reguli de stres (unde se execută un stop la redeschidere, nivelurile MWCB, ce e un fix).
- **Laboratorul unității: „Be the institution”** (R3 §1.9, M10–M11):
  - Partea 1: cumpără 50,000 LABX într-o sesiune (R6 + R11, volum zilnic 2,000,000). Cursantul alege algoritmul și parametrii. 200 de sesiuni simulate dau distribuția implementation shortfall-ului.
  - Partea 2: aceeași poziție trebuie redusă într-o zi de crash (S20): LULD, Level 1 MWCB, halt cu redeschidere prin licitație.
  - **Reușită:** IS mediu sub benchmark-ul naiv (un singur ordin market) și percentila 95 a IS sub pragul afișat (60 bps); în ziua de crash, pierderea ≤ limita zilnică stabilită și niciun ordin market trimis în licitația de redeschidere fără limită de preț.
- **Firele din spirală:**
  - Costuri: impactul crește cu rădăcina mărimii, costul total cu puterea 1.5 (capacitate și impact, README §4).
  - Risc: un stop nu e un preț garantat la halt; lichiditatea dispare exact în stres.
  - Dovezi: legea rădăcinii pătrate (A); „HFT îmi vânează ordinul de 1 lot” (fals).
  - Proces: cine e de cealaltă parte (R6 §7, firul transversal).
- **Surse:** R3 §1.7 (lichiditate, flash crash), §1.8 (best execution, PFOF), §1.9 (participanți, HFT, market makers), §1.13 (Kyle lambda), §2.13 (slippage, implementation shortfall), §2.14 (gap prin stop), §2.15 (impact, legea rădăcinii pătrate), §2.16 (algoritmi), §2.17 (latență), §2.20 (ordine la halt-uri), §3.4 (licitații, witching), §3.11 (fix-uri), §3.12 (MWCB, LULD, licitații de volatilitate), §3.14 (cicluri de lichiditate), §5.12 (pinning), §6.9 (spoofing, Sarao), §8.2 (M10–M11), Appendix A1–A4; R4 §4.10 (SNB 2015, Flash Crash 2010); R6 §2.12 (market making), §2.16, §5.1 (inventarul costurilor); R1 §2.23 (TE-09 HFT awareness).

---

#### 4.2.1 · Implementation shortfall: what execution really costs
- **Nivel / durată / tip:** Professional · 7 min · Elective (Price action and order flow)
- **Obiective:**
  1. Define implementation shortfall against the decision price.
  2. Split a shortfall into delay, spread, impact, commission and opportunity cost.
  3. Express execution cost in basis points of the intended trade.
- **Concepte:** implementation-shortfall (nou), market-impact (nou), slippage ✓, trading-costs ✓
- **Se sprijină pe:** 1.1, 1.3, 3.2
- **Hook:** predict · alegere. „You decided to buy 50,000 LABX at 100.00. You filled 40,000 at an average of 100.18 and the price closed at 101.00 before you got the rest. What cost you most?” Variante: commission / the 0.18 paid above 100.00 / the 10,000 units you never bought ✓ / the spread.
- **Interacțiunea centrală:**
  - `explain`: implementation shortfall (Perold 1988) = randamentul portofoliului „pe hârtie” la prețul deciziei − randamentul realizat. Include tot: întârzierea, spread-ul, impactul, comisionul și costul de oportunitate al părții neexecutate (R3 §2.13).
  - `worked` (ordin-părinte de 50,000 unități, prețul deciziei 100.00, prețul la sosirea ordinului 100.04, preț mediu 100.18 pe 40,000 de unități, închidere 101.00):
    - întârziere: 40,000 × 0.04 = 1,600.00;
    - jumătate de spread: 40,000 × 0.05 = 2,000.00;
    - impact: 40,000 × 0.09 = 3,600.00;
    - comision: 0.05% × 40,000 × 100.18 = 2,003.60;
    - oportunitate: 10,000 × (101.00 − 100.00) = 10,000.00;
    - total **19,203.60**, adică 38.4 bps din 5,000,000.00. Cursantul calculează linia de oportunitate.
  - `figure` (3 pași, `Bars`, „cost waterfall”): de la P&L-ul pe hârtie la cel realizat, componentă cu componentă.
  - `callout`: costul de oportunitate e invizibil în extrasul de cont și de aceea e ignorat. Un ordin limită „ieftin” care nu se execută poate fi cea mai scumpă alegere.
- **Try:** widget `shortfall-calculator`. Sarcina: „Your fills: 30,000 at 100.12, the rest unfilled; decision 100.00, arrival 100.02, close 100.30. Find the total shortfall in bps, commission included.” Reușită: 22.2 bps ± 0.2 (600.00 întârziere + 3,000.00 spread și impact + 1,501.80 comision + 6,000.00 oportunitate pe 20,000 de unități = 11,101.80 din 5,000,000.00). Indicii: 1. „Measure every price against the decision price.” 2. „Unfilled units cost the move they missed.”
- **Practică:** R11 + R6 („fund mode”): 5 ordine-părinte cu urgențe diferite; raportul de execuție de la final (R3 §1.8: price improvement, fill rate, slippage mediu, IS).
- **Check:** (1) mcq: ce prinde IS și nu prinde slippage-ul simplu (oportunitatea); (2) numeric: IS în bps pentru un exemplu scurt; (3) mcq: de ce prețul deciziei, nu prețul de sosire, e referința corectă pentru un portofoliu.
- **Dovezi:** Mechanic (Perold 1988 [BK]; R3 §2.13; R6 §8.2).
- **Necesită:** S19 (execuție pe ordin-părinte, raport IS), S8 (order book)
- **Termeni noi de glosar:** implementation-shortfall, decision-price, arrival-price, opportunity-cost, parent-order, child-order

#### 4.2.2 · Market impact and the square-root law
- **Nivel / durată / tip:** Professional · 7 min · Elective (Price action and order flow)
- **Obiective:**
  1. Distinguish temporary from permanent market impact.
  2. Estimate impact with the square-root law from order size, daily volume and volatility.
  3. Explain why doubling an order more than doubles its total impact cost.
- **Concepte:** square-root-impact (nou), market-impact (nou, din 4.2.1), market-depth (3.2), volatility ✓
- **Se sprijină pe:** 4.2.1, 3.2 (adâncime, walking the book)
- **Hook:** predict · slider ×1–×4. „Buying 50,000 LABX costs about 32 bps in impact. You quadruple the order to 200,000. How many times larger is the impact per unit?” Răspuns: ×2 (63 bps), nu ×4.
- **Interacțiunea centrală:**
  - `figure` (3 pași, `Line`): prețul mid înainte, în timpul și după execuție; partea care revine (impact temporar) și partea care rămâne (impact permanent, informația dedusă de piață).
  - `worked` cu formula: impact ≈ Y × σ_zi × √(Q / V), cu Y ≈ 1 (R3 §2.15; Tóth, Bouchaud et al. 2011). σ_zi = 2%, V = 2,000,000:
    - Q = 50,000 → √0.025 = 0.158 → 0.32% (31.6 bps) → cost ≈ 15,811 vUSD;
    - Q = 200,000 → √0.10 = 0.316 → 0.63% (63.2 bps) → cost ≈ 126,491 vUSD (de ≈ 8 ori mai mult pentru de 4 ori mărimea);
    - Q = 100 (retail) → 1.4 bps, sub spread: la mărimi mici costul e spread-ul, nu impactul.
    Cursantul calculează a doua linie.
  - `predict`: „Where does the curve bend?” Cursantul trage pe un grafic costul pe unitate în funcție de Q.
  - `callout`: modelul e o regularitate empirică, nu o lege fizică; parametrii diferă pe piață. Almgren–Chriss (2000) pune problema optimă: impact vs riscul de a aștepta [BK].
- **Try:** widget `impact-curve`. Sarcina: „Find the largest order whose expected impact stays under 20 bps.” Reușită: Q ≈ 20,000 unități (± 500): 2% × √(20,000/2,000,000) = 0.2%. Indicii: 1. „Solve 2% × √(Q/V) = 0.20%.” 2. „√(Q/V) must be 0.10.”
- **Practică:** R11, „scale-up challenge” (R3 §2.15): aceeași strategie la 1×, 10×, 100×; motorul arată cum edge-ul net scade când impactul crește.
- **Check:** (1) mcq: impact temporar vs permanent; (2) numeric: impactul pentru Q/V = 1% și σ = 3% (30 bps); (3) mcq: de ce un cont retail de 10,000 nu simte impactul, dar un fond simte.
- **Dovezi:** A (regularitate empirică robustă, `[EMP+]`, R3 §2.15); Mechanic pentru walking the book (R3 §1.7).
- **Necesită:** S19 (model de impact), S8
- **Termeni noi de glosar:** temporary-impact, permanent-impact, square-root-law, participation-rate

#### 4.2.3 · Execution algorithms: TWAP, VWAP, POV and IS
- **Nivel / durată / tip:** Professional · 8 min · Elective (Price action and order flow)
- **Obiective:**
  1. Describe how TWAP, VWAP, POV and implementation-shortfall algorithms slice a parent order.
  2. Explain the trade-off between market impact and timing risk.
  3. Choose an algorithm for a given urgency and liquidity profile.
- **Concepte:** execution-algorithm (nou), impact-timing-tradeoff (nou), vwap (2.5), square-root-impact (nou, din 4.2.2)
- **Se sprijină pe:** 4.2.1, 4.2.2, 2.5 (VWAP), 2.9 (curba U a volumului)
- **Hook:** predict · alegere. „You must buy 50,000 LABX today. Which plan pays the most market impact?” Variante: all at once with a market order ✓ / evenly through the day / following the volume curve / „they all pay the same”. În recap se adaugă a doua jumătate: planurile lente plătesc mai puțin impact, dar rămân expuse mișcării prețului cât timp ordinul nu e terminat (riscul de timing).
- **Interacțiunea centrală:**
  - `match`: algoritm ↔ regulă: TWAP (felii egale în timp), VWAP (urmează curba de volum), POV (un procent fix din volumul pieței, de exemplu 10%), IS (minimizează costul față de prețul deciziei, de obicei rapid la început) (R3 §2.16; SEC 2020).
  - `figure` (3 pași, `Bars` + `Line`): child orders peste curba U a volumului intraday; la POV 10%, cele 50,000 de unități cer 500,000 de unități tranzacționate în piață, adică un sfert din volumul zilei.
  - `explain`: compromisul (Almgren–Chriss [BK]): mai repede = impact mai mare, risc de preț mai mic; mai încet = impact mic, dar expunere la mișcarea pieței cât timp ordinul nu e terminat. Algoritmii previzibili lasă urme: alții pot anticipa fluxul (R3 §2.16).
  - `reveal` „algo race”: aceeași zi sintetică, 4 algoritmi pe aceeași comandă; rezultatul: IS mediu și dispersia IS pe 200 de zile.
- **Try:** widget `algo-race`. Sarcina: „Pick an algorithm and its settings so the average shortfall over 200 sessions beats a single market order and the 95th percentile stays under 60 bps.” Reușită: ambele condiții, calculate de motor. Indicii: 1. „Slower slicing cuts impact but widens the spread of outcomes.” 2. „Try VWAP or POV between 5% and 15%.”
- **Practică:** R6 + R11, laboratorul „Be the institution”, partea 1.
- **Check:** (1) match: algoritm ↔ situație (urgență mare, lichiditate mică, benchmark VWAP); (2) mcq: ce risc crește când încetinești execuția; (3) mcq: de ce un algoritm previzibil poate fi exploatat.
- **Dovezi:** Mechanic (R3 §2.16); „A (execution, not alpha)” (R6 §2.16).
- **Necesită:** S19 (TWAP, VWAP, POV, IS; distribuția IS), S5 (curba intraday)
- **Termeni noi de glosar:** execution-algorithm, twap, vwap-algorithm, pov-algorithm, timing-risk, information-leakage

#### 4.2.4 · Latency, HFT and who is on the other side
- **Nivel / durată / tip:** Professional · 7 min · Elective (Price action and order flow)
- **Obiective:**
  1. Explain how a stale limit order gets picked off after a fast price change.
  2. List the traits regulators use to describe high-frequency trading.
  3. Decide which of your own orders are exposed to latency and how to reduce that exposure.
- **Concepte:** latency-arbitrage (nou), adverse-selection (3.2), market-making (3.2), limit-order ✓
- **Se sprijină pe:** 3.2 (market makers, coadă), 3.3 (DOM, spoofing), 4.2.3
- **Hook:** predict · alegere. „Your limit buy rests at 100.00. News moves fair value to 99.80. Your platform needs 150 ms to cancel; a fast trader reacts in under a millisecond. What happens?” Răspuns: ordinul se execută la 100.00 înainte să-l poți anula; ai cumpărat cu 0.20 peste noua valoare.
- **Interacțiunea centrală:**
  - `figure` (3 pași, cronologie în microsecunde): evenimentul, reacția agentului rapid, sosirea anulării tale.
  - `explain`: trăsăturile HFT după SEC (2010, citat în SEC 2020): programe foarte rapide; co-locare și feed-uri directe; deținere foarte scurtă; multe ordine anulate repede; terminarea zilei flat. Timpii de reacție pentru arbitrajul de latență au scăzut de la ≈ 5 µs (2011) la ≈ 300 ns (2018) (R3 §1.9).
  - `match`: familii de strategii HFT (market making pasiv, arbitraj, latență structurală, direcțional) ↔ descrieri.
  - `callout`: mituri: „HFT îmi vânează ordinul de 1 lot” (individual, nu contează) și „HFT e mereu rău” (efectele depind de strategie și condiții; SEC avertizează să nu tragi concluzii dintr-un singur studiu). Maker-taker: rebate-uri pentru cine adaugă lichiditate (R3 §2.18). Last look în FX (R3 §1.10).
  - `callout` E: „This is how professionals do it. You are learning to recognise it, not to compete with it.” Un cont retail nu câștigă cursa de latență (R1 §2.23, TE-09).
- **Try:** widget `latency-pickoff`. Sarcina: „Before a scheduled release, set up your resting orders so none can be picked off at a stale price.” Reușită: niciun ordin limită lăsat în carte în fereastra de eveniment (anulat înainte, sau time-in-force care expiră înainte de T0). Indicii: 1. „Stale orders are free options for faster traders.” 2. „Cancel or let them expire before the release.”
- **Practică:** R11 cu agenți etichetați. După sesiune, raportul „who traded with you” (R3 §1.9): ce parte din execuții au venit de la agentul rapid și cât a costat (selecție adversă).
- **Check:** (1) mcq: ce e un stale quote; (2) mcq: o trăsătură HFT din lista SEC; (3) mcq: ce poate face un trader retail realist (să nu lase ordine în carte la știri), nu ce nu poate (să fie mai rapid).
- **Dovezi:** Mechanic (R3 §1.9, §2.17); E ca practicabilitate pentru retail (R6 §2.12).
- **Necesită:** S8 (agenți etichetați, latență configurabilă), S6 (eveniment), S19
- **Termeni noi de glosar:** latency, stale-quote, co-location (high-frequency-trading, maker-taker și adverse-selection există de la 3.2)

#### 4.2.5 · Halts, limit up–limit down and circuit breakers
- **Nivel / durată / tip:** Professional · 8 min · Elective (Price action and order flow)
- **Obiective:**
  1. Describe US market-wide circuit breakers and single-stock limit up–limit down pauses.
  2. Predict where a stop order fills when a halted stock reopens through an auction.
  3. Choose order handling that caps your exit price during a halt, and state the risk of no fill.
- **Concepte:** trading-halts (nou), gap-risk ✓, stop-loss-order ✓, call-auction (3.2)
- **Se sprijină pe:** 1.3 (stop, stop-limit, gap), 3.2 (licitații), 3.7 (evenimente extreme)
- **Hook:** predict · alegere. „LABX is halted at 90.00 after a fast drop. Your stop-loss sits at 89.50. It reopens at 84.00. Where does your stop fill?” Variante: 89.50 / 90.00 / about 84.00 ✓ / it doesn't fill.
- **Interacțiunea centrală:**
  - `figure` (4 pași): MWCB pe S&P 500 față de închiderea precedentă: Level 1 −7% și Level 2 −13% → pauză de 15 minute (doar înainte de 15:25 ET); Level 3 −20% → piața se închide pentru restul zilei. Level 1 a fost atins de 4 ori în martie 2020 (9, 12, 16, 18 martie) (R3 §3.12).
  - `figure` (3 pași): LULD: benzi în jurul unui preț de referință pe 5 minute (5%, 10%, 20% sau mai mici pe niveluri și preț); dacă cotația stă la bandă 15 secunde → pauză de 5 minute → licitație de redeschidere pe bursa principală.
  - `match`: coduri de halt Nasdaq ↔ sens: T1 știre în așteptare, T2 știre publicată, LUDP pauză de volatilitate, MWC1–3 circuit breakers (R3 §2.20).
  - `explain`: în Europa, licitațiile de volatilitate (LSE AESP): o execuție care ar depăși toleranța pornește o licitație de 5 minute, cu extensii și sfârșit aleator de până la 30 de secunde. Futures au limite de preț și logică de viteză [BK].
  - `reveal` două studii de caz (R4 §4.10): Flash Crash, 6 mai 2010 (75,000 de contracte E-mini vândute la 9% din volum, „fără grijă la preț sau timp”; Dow −aproape 1,000 de puncte, revenire în aceeași după-amiază; ≈ 8,000 de acțiuni −5…15%); SNB, 15 ianuarie 2015 (plafonul EUR/CHF abandonat, lichiditatea a dispărut, stop-uri executate mult dincolo de nivel, Alpari UK insolvent a doua zi).
- **Try:** widget `halt-replay`. Sarcina: „Exit 100 LABX at no worse than 85.00, accepting that you might not get filled.” Reușită: ordin limită (sau stop-limit) de vânzare cu limita ≥ 85.00 trimis în licitația de redeschidere, plus bifa „I accept a possible no-fill”. Feedback-ul arată ambele rezultate: la redeschidere 84.00, ordinul nu se execută și poziția rămâne deschisă. Indicii: 1. „A stop becomes a market order at the reopening print.” 2. „A limit caps the price but not the risk of holding.”
- **Practică:** S20 „crash day” cu banner MWCB, benzi LULD pe grafic și ordine respinse în afara benzilor; R12.
- **Check:** (1) mcq: ce se întâmplă la −13% înainte de 15:25 ET; (2) mcq: unde se execută un stop la redeschiderea prin licitație; (3) mcq: avantajul și riscul unui stop-limit într-un halt.
- **Dovezi:** Mechanic (R3 §3.12, §2.20, §2.14; R4 §4.10; date SEC 2020 și investor.gov).
- **Necesită:** S20 (halt-uri, LULD, MWCB, licitații de redeschidere), S8 (licitații), S1 (stop-limit)
- **Termeni noi de glosar:** trading-halt, circuit-breaker, limit-up-limit-down, reopening-auction, volatility-auction, flash-crash

#### 4.2.6 · Fixes, expiries and crowded clocks
- **Nivel / durată / tip:** Professional · 7 min · Elective (Price action and order flow)
- **Obiective:**
  1. Identify the scheduled windows where liquidity, volume and volatility change for mechanical reasons.
  2. Explain option pinning near large open-interest strikes on expiry days.
  3. Tell a clock-driven volume spike from a directional signal.
- **Concepte:** liquidity-clock (nou), option-pinning (nou), option-gamma (nou, din 4.1.5)
- **Se sprijină pe:** 2.9 (sesiuni), 3.2 (licitații de închidere), 3.14 (expirări, roll), 4.1.5 (gamma)
- **Hook:** predict · alegere. „At 16:00 London, LABC (FX) volume jumps five-fold for five minutes. What is it?” Variante: a breakout signal / big money entering / the benchmark fix ✓ / a data error.
- **Interacțiunea centrală:**
  - `figure` (4 pași, calendar săptămânal cu `Zone`): fix-ul WM/Reuters de la 16:00 Londra (fereastră de 5 minute după scandalurile de manipulare din 2013–2015 [BK]); sfârșitul de lună și de trimestru (rebalansări); licitația de închidere (index funds; NYSE ≈ 34% din volum în licitații în 2019); expirarea trimestrială („witching”); săptămâna de roll la futures.
  - `explain`: pinning: la expirare, prețul poate rămâne aproape de strike-urile cu open interest mare (Ni, Pearson & Poteshman 2005 [BK]). Dealerii long gamma tind să tempereze mișcările, cei short gamma să le amplifice (R3 §5.12). Produsele retail cu „gamma levels” sunt mult mai zgomotoase.
  - `hotspot`: „Tap the windows where spreads widen for clock reasons” pe o săptămână sintetică.
  - `callout`: fluxul de la aceste ore e mecanic, nu informativ. Nu e un semnal de direcție, dar schimbă costul execuției și riscul de slippage. Widget-ul „liquidity weather” (R3 §3.14) arată spread-ul și adâncimea așteptate înaintea fiecărui ordin.
- **Try:** widget `liquidity-calendar`. Sarcina: „Over 50 synthetic expiry days and 50 normal days, measure how often LABX closes within ±0.50 of the 100 strike, and decide if pinning is present.” Reușită: compară corect cele două frecvențe calculate de motor și alege „present” când diferența depășește intervalul de zgomot afișat. Indicii: 1. „Compare the same statistic on expiry and non-expiry days.” 2. „Check whether the gap is bigger than the noise band.”
- **Practică:** S5 + R6: săptămâna sintetică cu fix, sfârșit de lună și expirare; cursantul execută o ieșire de 20,000 de unități și vede costul pe fiecare fereastră.
- **Check:** (1) mcq: ce e fix-ul de la 16:00; (2) mcq: de ce volumul mare de la închidere nu e un semnal de direcție; (3) mcq: ce face un dealer short gamma când prețul urcă (cumpără, amplifică).
- **Dovezi:** Mechanic (orele și mecanismele, R3 §3.4, §3.11, §3.14); B pentru pinning și vârfurile de la fix (`[EMP+][BK]`, R3 §3.4, §3.11, §5.12).
- **Necesită:** S5 (fix-uri, sfârșit de lună, expirări), S8 (licitația de închidere), S12 (open interest pentru pinning), S19
- **Termeni noi de glosar:** benchmark-fix, month-end-rebalancing, witching-day, option-pinning (closing-auction există de la 2.9, open-interest de la 3.9)

---
## Unitatea 4.3 · Professional validation (7 lecții)

### Fișa unității

- **Scop:** întrebarea „cât de probabil e ca cel mai bun backtest al meu să fie noroc?”, cu instrumentele cu care o pun profesioniștii. Testarea câștigătorului unei căutări: Reality Check și haircut-ul Sharpe (4.3.1), deflated Sharpe (4.3.2), durata minimă a backtest-ului și incertitudinea Sharpe (4.3.3), PBO prin CSCV (4.3.4), cross-validation cu purge și embargo (4.3.5), capacitatea (4.3.6) și dosarul de validare, cu pre-înregistrarea și verdictul (4.3.7).
- **De ce aici:**
  - La 3.10–3.11 cursantul a învățat semnificația, testările multiple cu corectura Bonferroni, out-of-sample, walk-forward, Monte Carlo, benchmark-urile aleatoare, kill switch-ul și jurnalul de cercetare. Instrumentele de acolo judecă un backtest sau o listă de teste independente. În practică se testează zeci sau sute de variante corelate ale aceleiași idei, iar cea mai bună e selectată tocmai pentru că a ieșit cea mai bună. Aici se măsoară costul acestei selecții.
  - R5 §10 (Level 4) pune aici BT-12, BT-17…BT-20, BT-24, BT-25. R6 §1.7 și §6.4 cer contorul de încercări și controlul pe random walk. R3 §8.2 cere pentru capstone „edge lab with walk-forward validation, costs and random-walk control”.
  - Capstone-ul final cere „statisticile validate”; dosarul din laboratorul acestei unități e exact acel document.
- **Se sprijină pe:** 0.2 (hazardul face pattern-uri), 2.11 (intervalul de încredere al expectancy), 3.10 (Sharpe, p-values, testări multiple și Bonferroni, cozi groase, autocorelație), 3.11 (IS/OOS, walk-forward, Monte Carlo, overfitting, jurnalul de cercetare), 3.13 (scăderea strategiilor după publicare), 4.2.2 (impact).
- **Checkpoint (test out):** 12 întrebări, ≥ 80%:
  - 2 de testarea câștigătorului unei căutări (Reality Check, haircut-ul Harvey & Liu, de ce Bonferroni e prea strict la variante corelate);
  - 2 de expected max Sharpe și DSR (citirea cardului, nu calculul complet);
  - 2 de MinBTL și intervalul Sharpe;
  - 2 de PBO (procedura, interpretarea);
  - 1 de leakage în cross-validation;
  - 2 de capacitate (mărimea care maximizează profitul total vs cea de break-even);
  - 1 de igienă (ce face un rezultat neraportabil).
- **Laboratorul unității: „Validation dossier”:**
  - Cursantul ia sistemul de la Capstone 3 (sau unul nou) și rulează bateria profesională în strategy lab: contorul de încercări din jurnal, DSR, MinBTL, PBO pe familia de variante, cross-validation cu purge și embargo (dacă regulile folosesc etichete pe orizont), capacitatea, reducerea pentru scădere (decay haircut), controlul R0.
  - Dosarul are un șablon fix (4.3.7) și se termină cu un verdict: **deploy to forward test / incubate longer / reject**.
  - **Reușită:** dosar complet, cifre consistente între ele (motorul le recalculează), verdict justificat de criteriile scrise înainte. Un „reject” corect argumentat trece la fel de bine ca un „deploy”.
- **Firele din spirală:**
  - Statistică: testări multiple, PBO (README §4).
  - Dovezi: validarea profesională; McLean & Pontiff ca regulă de prudență (README §6).
  - Proces: jurnalul de cercetare devine imutabil și numără încercările; criteriile se scriu înaintea rezultatelor.
  - Costuri: capacitatea leagă edge-ul de impact.
  - Psihologie: dorința de a „salva” o idee e cel mai mare risc de overfitting; un „reject” e un rezultat bun al procesului.
- **Surse:** R5 BT-08 (data snooping), BT-09 (overfitting, Bailey et al.), BT-12 (purged CV [BK]), BT-13 (Monte Carlo), BT-17 (corecturi, Harvey & Liu), BT-18 (MinBTL), BT-19 (PSR, DSR), BT-20 (PBO, CSCV), BT-21 (incubare), BT-22 (decay), BT-24 (capacitate), BT-25 (igienă), PM-07 (Sharpe și eroarea lui, Lo 2002), PM-13 (semnificația expectancy); R6 §0.4 (McLean & Pontiff), §1.7 (laboratorul de overfitting), §2.13 (R13 ca lecție de testări multiple), §6.4; R3 §8.2 (capstone); R1 §2.18 (BT), §4 (gap-urile 3, 4).

---

#### 4.3.1 · Testing the winner of a search: Reality Check and the Sharpe haircut
- **Nivel / durată / tip:** Professional · 7 min · Elective (Systematic trader)
- **Obiective:**
  1. Explain why correlated variants make Bonferroni too strict and a single naive test far too lenient.
  2. Describe how White's Reality Check and Hansen's SPA test the best rule of a search against a benchmark.
  3. Apply a Sharpe haircut and count trials across the whole research process, not per backtest.
- **Concepte:** reality-check-testing (nou), multiple-testing (3.10), data-snooping (3.11), statistical-significance (3.10), base-rates ✓
- **Se sprijină pe:** 3.10 (testări multiple, Bonferroni, p-values), 3.11 (overfitting, controlul R0)
- **Hook:** predict · alegere. „The best of your 200 variants has a t-statistic of 3.0, which alone would mean p ≈ 0.003. After a Bonferroni correction for 200 tests, is it still significant at 5%?” Variante: yes, easily / yes, barely / no, it would need t ≈ 3.7 ✓ / the correction doesn't apply to variants.
- **Interacțiunea centrală:**
  - `worked`: recapitulare din 3.10: pragul Bonferroni pentru 200 de teste = 0.05 ÷ 200 = 0.00025, adică t ≈ 3.66 (bilateral). Cursantul compară cu t = 3.0.
  - `explain`: problema nouă: cele 200 de variante ale aceleiași reguli sunt puternic corelate, deci nu sunt 200 de teste independente. Bonferroni e prea strict; testul naiv e mult prea îngăduitor. Răspunsul profesionist e să testezi direct **câștigătorul căutării**.
  - `figure` (3 pași): White's Reality Check (2000): (1) bootstrap pe randamentele tuturor regulilor încercate, sub ipoteza „niciuna nu bate benchmark-ul”; (2) distribuția **maximului** de performanță din fiecare reeșantionare; (3) unde cade câștigătorul real în această distribuție. SPA-ul lui Hansen rafinează testul ca să nu fie diluat de regulile foarte proaste (R5 BT-08, BT-17).
  - `explain`: haircut-ul Harvey & Liu: un t de 3.0, puternic pentru un singur test, scade la ≈ 2.0 după ajustarea pentru testări multiple în exemplul lor. Haircut-ul e neliniar: Sharpe-urile marginale se taie mult, cele mari moderat; un haircut fix de 50% e doar o regulă aproximativă (R5 BT-17).
  - `callout`: numărul de încercări se numără pe tot procesul de cercetare, inclusiv ideile abandonate și variațiile „doar de verificare”. Jurnalul de la 3.11 devine aici sursa lui N pentru 4.3.2–4.3.4.
- **Try:** widget `monkey-lab` (strategy lab, modul Reality Check). Sarcina: „Run the Reality Check on two families: 50 random rules on R0 and 50 variants of a rule on R1 with a planted edge. Say which family's best rule survives.” Reușită: câștigătorul familiei R0 marcat „does not survive” și câștigătorul familiei R1 marcat conform p-value-ului Reality Check calculat de motor. Indicii: 1. „Compare the winner with the best of many random reshuffles, not with zero.” 2. „In R0 every winner is a winner by luck.”
- **Practică:** R0 + R13: piețe sintetice dintre care unele au o derivă de calendar ascunsă și altele nu (R6 §2.13). Cursantul caută efecte de calendar și le trece prin Reality Check; scor pe rata de detecție corectă și pe rata de fals pozitive.
- **Check:** (1) mcq: ce testează Reality Check-ul lui White; (2) mcq: de ce Bonferroni e prea strict pentru variante corelate; (3) mcq: ce încercări intră în N (toate, inclusiv cele abandonate).
- **Dovezi:** Mechanic (metode statistice); A pentru literatura despre data snooping (White 2000; Hansen; Harvey & Liu; Sullivan, Timmermann & White 1999 [PK]) (R5 BT-08, BT-17; R6 §1.7).
- **Necesită:** S7, S13 (contor de încercări, bootstrap Reality Check)
- **Termeni noi de glosar:** family-wise-error-rate, reality-check, spa-test, sharpe-haircut (multiple-testing, false-positive și bonferroni-correction există de la 3.10)

#### 4.3.2 · The deflated Sharpe ratio
- **Nivel / durată / tip:** Professional · 8 min · Elective (Systematic trader)
- **Obiective:**
  1. Explain why the expected best Sharpe of N zero-edge trials is well above zero.
  2. Read a probabilistic Sharpe ratio and a deflated Sharpe ratio card.
  3. Judge whether a backtest is likely a fluke from its DSR and the number of trials.
- **Concepte:** deflated-sharpe-ratio (nou), probabilistic-sharpe-ratio (nou), reality-check-testing (nou, din 4.3.1), sharpe-ratio (3.10), skewness (3.10), fat-tails (3.10)
- **Se sprijină pe:** 4.3.1, 3.10 (Sharpe, skew, kurtosis)
- **Hook:** predict · slider 0–100%. „Your best of 50 backtests shows an annual Sharpe of 1.5 over 3 years. How likely is its true Sharpe to be above zero?” Răspuns: testul naiv spune 99%; corectat pentru cele 50 de încercări, ≈ 73%.
- **Interacțiunea centrală:**
  - `worked`: Sharpe-ul maxim așteptat din N încercări fără edge (Bailey et al., R5 BT-18): E[max_N] ≈ (1 − γ)·Z⁻¹(1 − 1/N) + γ·Z⁻¹(1 − 1/(N·e)), γ ≈ 0.5772. Pentru N = 10, E[max] ≈ **1.57**: cel mai bun din 10 configurații fără niciun edge arată un Sharpe anual de ≈ 1.57 pe un an de date (R5 BT-09). N = 50 → 2.28; N = 100 → 2.53.
  - `explain` cu formula (R5 BT-19 [BK forma formulei]): PSR(SR*) = Φ[(SR̂ − SR*)·√(T − 1) ÷ √(1 − γ₃·SR̂ + ((γ₄ − 1)/4)·SR̂²)], cu Sharpe-ul în frecvența nativă (zilnică), γ₃ = skewness, γ₄ = kurtosis. DSR = PSR cu SR* ridicat la Sharpe-ul maxim așteptat din N încercări (E[max_N] × dispersia Sharpe-urilor încercărilor).
  - `worked` (verificat cu script): cel mai bun din N = 50; Sharpe anual 1.5 pe 3 ani de date zilnice (T = 756), adică 0.0945 pe zi; dispersia Sharpe-urilor încercărilor 0.5 anual; skew −0.5, kurtosis 5. SR* = 2.28 × 0.5 = 1.14 anual (0.0717 pe zi). PSR față de zero = **0.994**; DSR = **0.73**. Sub pragul convențional de 0.95, deci posibil noroc.
  - `figure` (2 pași): trei bare pentru același backtest: Sharpe naiv 1.5 → PSR 99% → DSR 73%.
  - `callout`: pragul 0.95 e o convenție, nu parte din derivare (R5 BT-19).
- **Try:** widget `dsr-calculator`, legat de jurnalul de încercări. Sarcina: „Keep everything else fixed. How many trials would push this backtest's DSR below 0.50?” Reușită: N ≈ 420 (± 40); la N = 421, E[max] ≈ 3.0 și SR* = 1.5, adică exact Sharpe-ul observat. Indicii: 1. „DSR is 0.50 when the benchmark equals your Sharpe.” 2. „You need E[max] × 0.5 = 1.5.”
- **Practică:** strategy lab pe R1 cu jurnal de încercări activ: fiecare rulare crește N, iar cardul DSR se actualizează live. Cursantul vede cum o căutare lungă „consumă” Sharpe-ul.
- **Check:** (1) mcq: de ce E[max] crește cu N; (2) mcq: ce înseamnă DSR = 0.73; (3) mcq: de ce un skew negativ scade PSR-ul la același Sharpe.
- **Dovezi:** Mechanic (metodă statistică: Bailey & López de Prado 2014; Bailey, Borwein, López de Prado & Zhu 2014) (R5 BT-18, BT-19).
- **Necesită:** S13 (jurnal de încercări, card PSR/DSR, momentele distribuției)
- **Termeni noi de glosar:** expected-maximum-sharpe, probabilistic-sharpe-ratio, deflated-sharpe-ratio, selection-bias (kurtosis există de la 3.10)

#### 4.3.3 · How long must a backtest be? MinBTL and the Sharpe's error bars
- **Nivel / durată / tip:** Professional · 7 min · Elective (Systematic trader)
- **Obiective:**
  1. Compute a 95% confidence interval for an annual Sharpe ratio from its track-record length.
  2. Use the minimum backtest length rule to cap the number of configurations you try.
  3. Explain why autocorrelation can inflate an annualised Sharpe.
- **Concepte:** minimum-backtest-length (nou), sharpe-ratio-uncertainty (nou), deflated-sharpe-ratio (nou, din 4.3.2), autocorrelation (3.10)
- **Se sprijină pe:** 4.3.2, 2.11 (intervalul de încredere), 3.10 (Sharpe, autocorelație)
- **Hook:** predict · alegere. „A strategy shows a Sharpe of 1.0 over 3 years. Which range most likely contains its true Sharpe?” Variante: 0.9–1.1 / 0.5–1.5 / −0.4 to 2.4 ✓ / 0 to 1.
- **Interacțiunea centrală:**
  - `worked` cu formula (Lo 2002, R5 PM-07): SE(SR anual) ≈ √((1 + SR²/2) ÷ ani). SR 1 pe 3 ani: √(1.5/3) = 0.71 → IC 95% de la **−0.39 la 2.39**; pe 10 ani: 0.24–1.76. Ca intervalul să excludă zero la SR 1: 1.5 × 1.96² ≈ **5.8 ani**. Cursantul calculează varianta de 10 ani.
  - `worked`: MinBTL ≈ (E[max_N] ÷ SR țintă)² ani; limita superioară 2·ln(N) ÷ SR² (R5 BT-18). Pentru SR țintă 1: N = 7 → 1.9 ani (lucrarea: după 7 configurații, un backtest de 2 ani arată Sharpe 1 fără edge); N = 45 → 5.0 ani; N = 100 → 6.4 ani; N = 1,000 → 10.6 ani.
  - `figure` (2 pași, „track-record slider”): intervalul Sharpe se îngustează cu √ani; MinBTL crește cu numărul de încercări.
  - `callout`: autocorelația poate umfla Sharpe-ul anualizat cu până la 65% la hedge funds, iar anualizarea cu √12 e corectă doar în condiții speciale (Lo, R5 PM-07).
- **Try:** widget `minbtl-gauge`. Sarcina: „You have 4 years of data and target a Sharpe of 1.0. What is the largest number of independent configurations you may try?” Reușită: 25 (MinBTL 3.99 ani; la 26 depășește 4 ani). Indicii: 1. „You need E[max_N] ≤ 2.0.” 2. „Increase N until E[max_N]² passes 4.”
- **Practică:** strategy lab pe R1 cu trei lungimi de istoric (2, 5, 10 ani sintetici): gauge-ul MinBTL devine roșu când numărul de încercări depășește ce permite datele.
- **Check:** (1) numeric: IC pentru SR 1 pe 5 ani (≈ −0.07 la 2.07); (2) mcq: ce înseamnă MinBTL de 6.4 ani la N = 100; (3) mcq: de ce un Sharpe de 3 pe 3 luni nu spune aproape nimic.
- **Dovezi:** Mechanic (Bailey, Borwein, López de Prado & Zhu 2014; Lo 2002) (R5 BT-18, PM-07).
- **Necesită:** S13 (gauge MinBTL, card Sharpe cu interval)
- **Termeni noi de glosar:** minimum-backtest-length, sharpe-standard-error, track-record-length

#### 4.3.4 · Probability of backtest overfitting
- **Nivel / durată / tip:** Professional · 8 min · Elective (Systematic trader)
- **Obiective:**
  1. Describe the CSCV procedure that estimates the probability of backtest overfitting.
  2. Interpret a PBO value and the in-sample vs out-of-sample degradation plot.
  3. Classify a strategy family as likely overfit, uncertain or worth further testing.
- **Concepte:** backtest-overfitting-probability (nou), walk-forward-analysis (3.11), in-sample-out-of-sample (3.11), overfitting (3.11)
- **Se sprijină pe:** 4.3.2, 4.3.3, 3.11 (walk-forward)
- **Hook:** predict · slider 0–100%. „On pure noise, how often does the in-sample winner finish in the bottom half out of sample?” Răspuns: ≈ 50%.
- **Interacțiunea centrală:**
  - `figure` (4 pași, „CSCV visualiser”, R5 BT-20): matricea T × N a randamentelor celor N variante; împărțirea rândurilor în S = 8 blocuri egale; toate cele C(8,4) = 70 de combinații de 4 blocuri IS (restul OOS); pentru fiecare, varianta cea mai bună IS și rangul ei relativ OOS ω.
  - `worked`: λ = ln(ω ÷ (1 − ω)); PBO = proporția combinațiilor cu λ ≤ 0. Exemplu: 49 din 70 → PBO = **70%**. Cursantul calculează.
  - `explain`: pe zgomot pur (R0), câștigătorul IS e o monedă aruncată OOS, deci PBO ≈ 50%. O familie cu edge real are PBO mic și o degradare IS → OOS moderată. Metoda e neparametrică și judecă tot procesul de căutare, nu un singur backtest (Bailey, Borwein, López de Prado & Zhu 2017).
  - `callout`: pragurile aplicației (convenție, nu standard): PBO ≥ 0.50 → reject; 0.20–0.50 → incubate; < 0.20 → continuă cu restul bateriei.
- **Try:** widget `cscv-visualiser`. Sarcina: „Run CSCV on two 20-variant strategy families, one built on R0 and one on R1, and classify each.” Reușită: familia R0 → „likely overfit” (PBO calculat ≈ 0.5), familia R1 → clasificarea corespunzătoare PBO-ului calculat de motor. Indicii: 1. „Look at the share of splits with λ ≤ 0.” 2. „Noise should sit near one half.”
- **Practică:** strategy lab cu familii de variante pe R0, R1 și R2 amestecate; cursantul compară PBO cu concluzia walk-forward-ului de la 3.11.
- **Check:** (1) mcq: ce măsoară PBO; (2) numeric: PBO din 21 de combinații cu λ ≤ 0 din 70 (30%); (3) mcq: de ce PBO ≈ 0.5 pe R0.
- **Dovezi:** Mechanic (metodă: Bailey, Borwein, López de Prado & Zhu, J. Computational Finance 2017; detalii [BK]) (R5 BT-20).
- **Necesită:** S13 (CSCV pe familii de variante)
- **Termeni noi de glosar:** probability-of-backtest-overfitting, cscv, strategy-family

#### 4.3.5 · Purged cross-validation and the embargo
- **Nivel / durată / tip:** Professional · 7 min · Elective (Systematic trader)
- **Obiective:**
  1. Explain how overlapping labels leak future information into standard k-fold cross-validation.
  2. Mark which training observations to purge and embargo around a test fold.
  3. Compare an inflated score with an honest one on the same data.
- **Concepte:** purged-cross-validation (nou), look-ahead-bias (3.11), autocorrelation (3.10)
- **Se sprijină pe:** 3.11 (look-ahead, IS/OOS), 3.10 (autocorelație), 4.3.4
- **Hook:** predict · alegere. „You label each day by the next 10 days' return and shuffle days into random folds. Your model scores well above 50% on pure noise. Why?” Variante: the model is good / labels overlap across folds ✓ / too few days / costs were ignored.
- **Interacțiunea centrală:**
  - `figure` (3 pași, „fold diagram”): o zi de antrenare are eticheta construită din zilele următoare; dacă acele zile sunt în fold-ul de test, modelul „a văzut” testul.
  - `explain`: purging = scoți din antrenare observațiile ale căror etichete se suprapun cu perioada de test; embargo = scoți și un interval imediat după fold-ul de test, pentru corelația serială. Combinatorial purged CV generează multe traiectorii de backtest (López de Prado 2018 [BK], R5 BT-12).
  - `worked`: etichete pe 10 zile înainte, fold de test zilele 401–500: purge pentru 391–400 (etichetele lor ajung în 401–410), embargo pentru 501–510.
  - `reveal`: același clasificator simplu pe R0: scor naiv peste 50%, scor cu purge și embargo ≈ 50% (cifrele exacte le dă motorul).
  - `callout`: „AI/ML” în trading are aceeași capcană, multiplicată de numărul de parametri (R1 §2.23, TE-10).
- **Try:** widget `cv-fold-diagram`. Sarcina: „Mark the training days that must be purged or embargoed around test fold 401–500 with 10-day labels.” Reușită: exact 391–400 purge și 501–510 embargo. Indicii: 1. „Which training labels reach into days 401–500?” 2. „Then protect the days right after the test fold.”
- **Practică:** strategy lab cu un clasificator „ML-lite” pe R0 și pe R1; cursantul raportează ambele scoruri în dosarul de validare.
- **Check:** (1) mcq: de ce k-fold standard minte pe serii de timp; (2) mcq: diferența dintre purge și embargo; (3) mcq: ce zile se elimină la etichete de 5 zile și test 201–300 (196–200 purge; 301–305 embargo).
- **Dovezi:** Mechanic (metodă, López de Prado 2018 [BK]; R5 BT-12). Nivel E în R5.
- **Necesită:** S13 (modul CV cu purge și embargo)
- **Termeni noi de glosar:** cross-validation, data-leakage, purging, embargo-period

#### 4.3.6 · Capacity: how much money an edge can carry
- **Nivel / durată / tip:** Professional · 8 min · Elective (Systematic trader)
- **Obiective:**
  1. Compute net edge per trade after fixed costs and square-root impact at a given size.
  2. Find the trade size that maximises total profit, and the larger size where the edge reaches zero.
  3. Explain how crowding reduces capacity.
- **Concepte:** strategy-capacity (nou), square-root-impact (nou, din 4.2.2), trading-costs ✓, anomaly-decay (3.8)
- **Se sprijină pe:** 4.2.2, 3.13 (aglomerarea strategiilor)
- **Hook:** predict · alegere. „Your strategy nets 15.9 bps per trade at 2,500 units. You trade 4 times bigger. What happens to total profit per trade?” Variante: ×4 / ×2 / it falls ✓ / unchanged. Răspuns: scade de la ≈ 396 la ≈ 172 vUSD.
- **Interacțiunea centrală:**
  - `worked` (verificat cu script): edge brut 40 bps pe trade, costuri fixe 10 bps, impact pe fiecare parte 200·√(Q/V) bps (σ zilnic 2%, Y = 1, V = 2,000,000), deci dus-întors 400·√(Q/V). Edge net = 30 − 400·√(Q/V) bps.
    - Q = 2,500 → impact dus-întors 14.14 bps → net 15.86 bps × 250,000 vUSD = 396;
    - Q = 10,000 → 28.28 bps → net 1.72 bps × 1,000,000 vUSD = 172;
    - break-even: √(Q/V) = 0.075 → Q = 11,250 unități;
    - profit total maxim: 30 − 600·√(Q/V) = 0 → √(Q/V) = 0.05 → **Q = 5,000** unități, net 10 bps, **500 vUSD** pe trade.
    Cursantul calculează linia de 10,000.
  - `figure` (2 pași, `Line`): edge-ul pe unitate scade continuu; profitul total urcă, atinge vârful la 5,000 și cade la zero la 11,250. Capacitatea utilă e la vârf, nu la zero.
  - `explain`: aglomerarea: alții care tranzacționează același semnal cresc Q-ul efectiv, deci capacitatea ta scade fără să-ți schimbi mărimea (R6 §0.4, McLean & Pontiff; R5 BT-24).
  - `callout` E: capacitatea e o problemă de fond, nu de cont de 10,000. Pentru un individ, lecția e alta: un edge mic pe instrumente nelichide dispare repede când crește mărimea (R6 §6.5, „avoid scaling into illiquid instruments”).
- **Try:** widget `capacity-curve`. Sarcina: „Find the trade size that maximises total profit per trade.” Reușită: 5,000 unități ± 250 (profit 500 vUSD). Indicii: 1. „Total profit = size × net edge.” 2. „The peak is where the extra profit from one more unit hits zero.”
- **Practică:** „scale-up challenge” (R3 §2.15) pe sistemul din dosar: 1×, 10×, 100× mărime; motorul raportează capacitatea estimată.
- **Check:** (1) numeric: edge-ul net la Q/V = 0.25% (10 bps); (2) mcq: de ce mărimea optimă e sub mărimea de break-even; (3) mcq: ce face aglomerarea cu capacitatea.
- **Dovezi:** Mechanic (dat fiind modelul de impact); A pentru legea rădăcinii pătrate (R3 §2.15; R5 BT-24).
- **Necesită:** S19 (model de impact), S13
- **Termeni noi de glosar:** strategy-capacity, crowding, marginal-profit

#### 4.3.7 · The validation dossier and the verdict
- **Nivel / durată / tip:** Professional · 7 min · Elective (Systematic trader)
- **Obiective:**
  1. Audit a research log for the violations that make a result unreportable.
  2. Pre-register the test plan, thresholds and decay haircut before seeing out-of-sample results.
  3. Complete a validation dossier and reach a deploy, incubate or reject verdict.
- **Concepte:** research-hygiene (nou), research-log (3.11), edge-hypothesis (3.11), anomaly-decay (3.8), incubation (3.11)
- **Se sprijină pe:** 4.3.1–4.3.6, 3.11 (jurnalul de cercetare, incubarea), 3.13 (decay)
- **Hook:** predict · alegere. „Two researchers report the same Sharpe of 1.2. One tried 3 ideas, the other 300. Whose result do you trust more?” Răspuns: cel cu 3 idei.
- **Interacțiunea centrală:**
  - `explain`: recapitulare din 3.11 (R5 BT-01, BT-10, BT-25): ipoteza scrisă înainte, cu motivul economic (cine e de cealaltă parte și de ce ar exista edge-ul: prima de risc, bias comportamental, flux structural, furnizare de lichiditate; R6 §6.4); jurnalul imutabil; out-of-sample deblocat o singură dată; puțini parametri. Pasul nou: **pre-înregistrarea** planului de test. Înainte de orice deblocare OOS se scriu pragurile (DSR, MinBTL, PBO), reducerea pentru decay și criteriile de verdict. Ele nu se mai schimbă după rezultate.
  - `order`: pașii dosarului de validare, în ordine: hipoteză → reguli → date și costuri → IS/OOS → walk-forward → Monte Carlo → control R0 → N încercări și DSR → MinBTL → PBO → capacitate → reducerea pentru decay → criterii de oprire → verdict.
  - `worked`: reducerea pentru decay. McLean & Pontiff (2016): 97 de predictori publicați au câștigat cu 26% mai puțin out-of-sample și cu 58% mai puțin după publicare. Convenția aplicației: pentru o idee publicată se planifică cu cel mult jumătate din expectancy-ul din backtest. 0.30R în backtest → 0.15R în plan.
  - `callout`: „reject” e un rezultat bun: procesul a prins un fals pozitiv înainte să coste bani.
- **Try:** widget `research-notebook` în modul audit. Sarcina: „Find the four hygiene violations in this research log.” Jurnalul conține: OOS deblocat de două ori; o variație de 40 de parametri neînregistrată ca încercări; ipoteza datată după rezultate; un univers format doar din instrumente care au supraviețuit. Reușită: ≥ 3 din 4 găsite. Indicii: 1. „Check timestamps against results.” 2. „Count unlocks and sweeps.”
- **Practică:** începutul laboratorului unității („Validation dossier”).
- **Check:** (1) mcq: de ce N trebuie raportat (fără el, riscul de overfitting nu se poate evalua, Bailey et al.); (2) mcq: ce înseamnă o a doua deblocare a OOS; (3) numeric: expectancy-ul de plan pentru 0.24R în backtest cu reducerea de 50% (0.12R).
- **Dovezi:** A (McLean & Pontiff 2016, R6 §0.4, R5 BT-22); Mechanic pentru igiena procesului (R5 BT-25; R6 §6.4).
- **Necesită:** S13 (jurnal imutabil, contor de încercări, șablon de dosar)
- **Termeni noi de glosar:** trial-count, validation-dossier, decay-haircut (research-log există de la 3.11, pre-registration de la 3.4)

---
## Unitatea 4.4 · Portfolio risk at scale (6 lecții)

### Fișa unității

- **Scop:** riscul unei cărți întregi, nu al unui trade. VaR și Expected Shortfall, cu limitele lor (4.4.1); volatility targeting pe toată cartea, cu corelații (4.4.2); expunerea brută, netă și ajustată cu beta (4.4.3); risk parity și bugetele de risc, ca concept (4.4.4); testele de stres și testul invers (4.4.5); regimurile de corelație, adică momentul în care diversificarea dispare (4.4.6).
- **De ce aici:**
  - La 2.11 cursantul a învățat portfolio heat, corelația, limitele de expunere și treptele de drawdown; la 3.12, volatility targeting și Kelly pentru o singură strategie. Aici aceleași idei se ridică la nivelul limbii instituționale (CFA/FRM): VaR, ES, expunere brută și netă, stres.
  - R5 §10 (Level 4) pune aici PR-14 (gross/net, volatility targeting); PR-13 (VaR/ES) e la granița A/E. R6 §2.16 notează risk parity B și o pune ca „position/investing bridge”.
  - Capstone-ul final cere o carte cu mai multe instrumente și un raport de risc; strategiile cu opțiuni din 4.1 au nevoie de ES, nu de stop-uri.
- **Se sprijină pe:** 2.4 (ATR, volatilitate), 2.11 (heat, corelație, concentrare, trepte de drawdown, Sharpe), 3.6 (risk-on/risk-off, instabilitatea corelațiilor), 3.10 (distribuții, cozi groase), 3.12 (volatility targeting, risk of ruin), 3.13 (carry și crash-urile lui), 4.1.11 (riscul de coadă).
- **Checkpoint (test out):** 12 întrebări, ≥ 80%:
  - 3 de VaR/ES (calcul parametric, citire istorică, de ce VaR nu e pierderea maximă);
  - 2 de volatility targeting pe carte (volatilitatea din ponderi și corelații, combinarea cu plafoanele și treptele de drawdown);
  - 2 de expunere (brută vs netă, beta-ajustată);
  - 2 de risk parity (contribuția la risc, ponderi pe inversul volatilității);
  - 2 de stres (testul invers, scenariile istorice);
  - 1 de corelație (numărul efectiv de pariuri).
- **Laboratorul unității: „Risk committee”:**
  - O carte de 4–6 instrumente din universul LABI–LABC, condusă 120 de zile sintetice care includ un episod R12 (corelațiile urcă spre 1, spread-urile se lărgesc, marja se dublează).
  - Zilnic: raportul de risc (VaR și ES istorice și parametrice, expunere brută, netă, beta-ajustată, heat ajustat la corelație, cea mai proastă pierdere din bateria de stres).
  - Politica scrisă înainte: țintă de volatilitate 10% anual, plafon de expunere brută 3× capitalul, limită ES99 de 2% pe zi, plafon de levier 1.5× pe volatility targeting.
  - **Reușită:** zero zile peste limitele proprii fără acțiune în aceeași zi; reacție la creșterea corelațiilor în ≤ 2 zile sintetice de la semnal; numărul de depășiri VaR raportat corect; drawdown-ul maxim sub pragul din politică. P&L-ul se afișează, nu se notează.
- **Firele din spirală:**
  - Risc: VaR/ES, stres, scalare (README §4).
  - Statistică: cozile groase schimbă ordinea dintre VaR 95% și VaR 99%; backtest-ul VaR e un test binomial.
  - Proces: politica de risc se scrie înainte; raportul zilnic devine rutină.
  - Psihologie: „net zero” liniștește, „gross 3.4×” ar trebui să sperie.
  - Dovezi: volatility targeting și risk parity sunt B, nu A.
- **Surse:** R5 PR-01 (heat), PR-02 (corelație, numărul efectiv de pariuri), PR-03 (limite), PR-08 (trepte de drawdown), PR-13 (VaR/ES), PR-14 (gross/net, volatility targeting), ST-04 (cozi groase), PM-07 (Sharpe și skew); R6 §2.10 (carry și crizele), §2.14 (volatility targeting B, Moreira & Muir), §2.16 (risk parity B), §2.17 (matricea strategie × regim, crisis alpha), §0.5 (R12), §1.5 (simularea multi-asset); R4 §4.10 (SNB 2015, Flash Crash); R3 §1.7 (lichiditatea dispare în stres); R1 §2.14 (RM).

---

#### 4.4.1 · Value at Risk and Expected Shortfall
- **Nivel / durată / tip:** Professional · 8 min · Elective (Derivatives, Systematic trader)
- **Obiective:**
  1. Compute parametric and historical one-day VaR and Expected Shortfall.
  2. Explain why VaR is not a maximum loss and why fat tails can hide behind the 95% number.
  3. Backtest a VaR model by counting exceedances.
- **Concepte:** value-at-risk (nou), expected-shortfall (nou), fat-tails (3.10), drawdown ✓
- **Se sprijină pe:** 3.10 (distribuții, cozi groase), 2.11 (metrici de performanță), 4.1.11
- **Hook:** predict · alegere. „Your 95% one-day VaR is 247 vUSD. What is the most you can lose tomorrow?” Variante: 247 / 309 / 494 / there is no fixed maximum ✓.
- **Interacțiunea centrală:**
  - `explain`: VaR(α, h) = pragul de pierdere depășit cu probabilitatea 1 − α pe orizontul h. ES (CVaR) = media pierderilor din acele cazuri rele (R5 PR-13).
  - `worked` cu formulele (normală, medie ≈ 0): VaR = z_α × σ_h × V; ES = σ_h × φ(z_α) ÷ (1 − α) × V. Cont 10,000, σ zilnic 1.5%:
    - 95%: VaR = 1.645 × 1.5% × 10,000 = **247**; ES = 2.06 × 150 = **309**;
    - 99%: VaR = 2.326 × 150 = **349**; ES = 2.67 × 150 = **400**.
    Cursantul calculează VaR 99%.
  - `explain`: VaR istoric: cele 250 de zile de P&L sortate; VaR 95% ≈ a 13-a cea mai mare pierdere; ES = media celor mai mari 12–13. Scalarea pe h zile cu √h presupune zile independente.
  - `reveal` (verificat cu script): aceeași volatilitate, distribuție Student-t cu 4 grade de libertate. VaR 95% = **226** (mai mic decât la normală!), VaR 99% = **397**, ES 99% = **554**. Cozile groase se ascund în spatele numărului de 95%.
  - `worked`: backtest-ul VaR. La 95% pe 250 de zile se așteaptă 12.5 depășiri. Probabilitatea de a vedea 20 sau mai multe dacă modelul e corect: 2.7%; 25 sau mai multe: 0.09%. Atâtea depășiri înseamnă că modelul subestimează riscul.
- **Try:** widget `var-widget`. Sarcina: „Size your LABX exposure so the 99% one-day Expected Shortfall stays under 200 vUSD. Then switch the model to Student-t and resize.” Reușită: ≈ 5,000 vUSD expunere sub normală și ≈ 3,610 sub Student-t (± 2%). Indicii: 1. „ES per vUSD of exposure is 2.67 × 1.5% under the normal model.” 2. „Fat tails raise ES per vUSD, so the size must fall.”
- **Practică:** R3 + R12 pe cartea multi-asset: cronologia depășirilor VaR, cu cele trei modele (istoric, normal, Student-t) suprapuse.
- **Check:** (1) numeric: VaR 95% pentru σ zilnic 2% pe 10,000 (329); (2) mcq: de ce ES e mai potrivit pentru strategii short-vol; (3) mcq: ce înseamnă 22 de depășiri în 250 de zile la 95%.
- **Dovezi:** Mechanic (definiții, R5 PR-13); VaR normal subestimează cozile groase (R5 ST-04); limbaj CFA/FRM.
- **Necesită:** S9, S15 (VaR/ES pe P&L-ul propriu, backtest VaR), S20
- **Termeni noi de glosar:** value-at-risk, expected-shortfall, confidence-level, var-exceedance, var-backtest, student-t-distribution

#### 4.4.2 · Volatility targeting for the whole book
- **Nivel / durată / tip:** Professional · 7 min · Elective (Derivatives, Systematic trader)
- **Obiective:**
  1. Forecast a two-asset book's volatility from weights, volatilities and correlation.
  2. Rescale the whole book when correlation changes, even if no single volatility does.
  3. Combine a volatility target with a gross-exposure cap and drawdown tiers.
- **Concepte:** portfolio-volatility-targeting (nou), volatility-targeting (3.12), correlation-and-concentration ✓, leverage ✓
- **Se sprijină pe:** 3.12 (volatility targeting pe o poziție, întârzierea, leverage creep), 2.11 (corelație, trepte de drawdown), 4.4.1
- **Hook:** predict · slider 0–80%. „Your book holds two positions at equal weight, each running at 10% volatility, correlation 0.2, scaled to a 10% target. Correlation jumps to 0.9; each volatility stays the same. How much must you cut the book to stay on target?” Răspuns: ≈ 20%.
- **Interacțiunea centrală:**
  - `explain`: recapitulare din 3.12: multiplicator = σ_țintă ÷ σ_prognoză, cu întârzierea și leverage creep. Pasul nou: la o carte, σ_prognoză vine din ponderi, volatilități **și corelații**.
  - `worked` cu formula: σ_p² = w₁²σ₁² + w₂²σ₂² + 2·w₁·w₂·ρ·σ₁·σ₂. Ponderi 0.5/0.5, σ = 10% fiecare:
    - ρ = 0.2 → σ_p = **7.75%** → multiplicator pentru țintă 10% = 1.29 (expunere brută 1.29× capitalul);
    - ρ = 0.9 → σ_p = **9.75%** → multiplicator 1.03, adică o tăiere de ≈ **20%**, fără nicio schimbare a volatilităților individuale;
    - criză (σ = 20% fiecare, ρ = 0.9) → σ_p = 19.5% → multiplicator 0.51, o tăiere de ≈ 60% față de regimul calm.
    Cursantul calculează rândul ρ = 0.9.
  - `figure` (3 pași, `Line`): în R12 volatilitățile și corelațiile urcă împreună; prognoza corelației întârzie și ea, deci tăierea vine după primele pierderi.
  - `explain` (guard-rails): multiplicatorul are un plafon (de exemplu 1.5×); expunerea brută are plafonul ei (4.4.3); treptele de drawdown (2.11) bat ținta de volatilitate. Când regulile cer mărimi diferite, se aplică cea mai mică.
  - `callout`: dovezile pentru volatility targeting sunt B (Moreira & Muir 2017, cu critici out-of-sample ulterioare [PK]; R6 §2.14). E o regulă de risc, nu o sursă de edge.
- **Try:** widget `vol-target-dial` (modul carte). Sarcina: „Choose lookbacks for the volatility and correlation forecasts (10, 20 or 60 days) and a multiplier cap so the book stays under a 15% maximum drawdown through the R12 episode, while realised volatility stays within 3 points of the 10% target in calm periods.” Reușită: ambele condiții, calculate de motor. Indicii: 1. „Correlation forecasts lag too; short lookbacks react faster.” 2. „A cap stops the build-up before the shock.”
- **Practică:** cartea multi-asset pe R1/R2/R3 cu un episod R12; trei variante comparate: fără țintă, țintă doar pe volatilități (corelații fixe), țintă cu corelații prognozate; plus benchmark-ul pasiv.
- **Check:** (1) numeric: σ_p pentru două active de 10% la 50/50 cu ρ = 0.5 (8.66%); (2) mcq: cum poate crește volatilitatea cărții fără ca vreun activ să devină mai volatil; (3) mcq: ținta de volatilitate cere mai mult, treapta de drawdown cere mai puțin: ce aplici (mărimea mai mică).
- **Dovezi:** B (Moreira & Muir 2017 [PK]; R6 §2.14); Mechanic pentru formulă (R5 PR-02, PR-14).
- **Necesită:** S9 (corelații dependente de regim), S15 (prognoza volatilității și a corelației), S20
- **Termeni noi de glosar:** portfolio-volatility, exposure-multiplier, leverage-cap, ewma-volatility (volatility-target, volatility-forecast și leverage-creep există de la 3.12)

#### 4.4.3 · Gross, net and beta-adjusted exposure
- **Nivel / durată / tip:** Professional · 7 min · Elective (Derivatives, Systematic trader)
- **Obiective:**
  1. Compute gross, net and beta-adjusted exposure and effective leverage for a long–short book.
  2. Explain why a small net exposure can still hide a large risk.
  3. Rebalance a book to meet both a net and a gross limit.
- **Concepte:** gross-and-net-exposure (nou), beta-adjusted-exposure (nou), exposure ✓, correlation-and-concentration ✓
- **Se sprijină pe:** 1.4 (expunere, levier), 2.11 (limite de expunere), 3.6 (risk-on/risk-off)
- **Hook:** predict · alegere. „A ‘market-neutral’ book is long 100,000 and short 100,000 on 50,000 of equity. What is a plausible worst day?” Variante: zero / −1,000 / −10,000 if the two legs move 5% against each other ✓ / it cannot lose.
- **Interacțiunea centrală:**
  - `worked` cu formulele: expunere brută = Σ|poziții|; netă = Σ poziții; beta-ajustată = Σ β_i × poziție_i; levier efectiv = brută ÷ capital. Capital 50,000; long LABX 60,000 (β 1.2), long LABY 40,000 (β 0.8), short LABZ 70,000 (β 1.0):
    - brută = **170,000** (3.4×);
    - netă = **+30,000** (0.6×);
    - beta-ajustată = 72,000 + 32,000 − 70,000 = **+34,000**.
    Cursantul calculează beta-ajustata.
  - `reveal` (2 scenarii): piața −5% în bloc → ≈ −1,700 (3.4% din capital); corelația se rupe (longurile −5%, short-ul +5%) → −5,000 − 3,500 = **−8,500** (17%).
  - `explain`: limitele de brută controlează riscul de picior (leg risk) și de corelație; limitele de netă controlează riscul de piață. Ai nevoie de amândouă (R5 PR-03, PR-14).
- **Try:** widget `exposure-matrix`. Sarcina: „Change one position so beta-adjusted net exposure is within ±5,000 and gross stays at or below 4× equity.” Reușită: ambele condiții (de exemplu, reduci long-ul LABX cu 25,000: beta-ajustată 4,000, brută 145,000; sau adaugi un short de 30,000 cu β 1: beta-ajustată 4,000, brută 200,000). Feedback-ul preferă soluția care scade expunerea brută. Indicii: 1. „You can cut a long instead of adding a short.” 2. „Multiply each position by its beta before adding.”
- **Practică:** cartea multi-asset pe R1/R2 cu un episod R12 în care corelația dintre LABX și LABZ se rupe.
- **Check:** (1) numeric: brută și netă pentru long 80,000 / short 50,000 (130,000 / +30,000); (2) mcq: ce risc rămâne într-o carte cu netă zero; (3) mcq: ce înseamnă beta 1.2.
- **Dovezi:** Mechanic (R5 PR-03, PR-14).
- **Necesită:** S9 (mai multe instrumente, beta, corelații dependente de regim)
- **Termeni noi de glosar:** gross-exposure, net-exposure, beta, beta-adjusted-exposure, market-neutral, leg-risk, correlation-breakdown

#### 4.4.4 · Risk parity and risk budgets (concept)
- **Nivel / durată / tip:** Professional · 7 min · Elective (Derivatives, Systematic trader)
- **Obiective:**
  1. Compute each asset's contribution to portfolio risk.
  2. Build inverse-volatility weights that equalise risk between uncorrelated assets.
  3. Explain why risk parity needs leverage to match a riskier portfolio, and what that leverage risks.
- **Concepte:** risk-parity (nou), risk-contribution (nou), correlation-and-concentration ✓, leverage ✓
- **Se sprijină pe:** 2.11 (corelație), 4.4.2, 4.4.3
- **Hook:** predict · slider 0–100%. „You split capital 50/50 between a calm asset (10% volatility) and a wild one (30%). What share of the portfolio's risk comes from the wild one?” Răspuns: 90%.
- **Interacțiunea centrală:**
  - `worked` (ρ = 0, verificat cu script): 50/50 → σ_p = √(0.25 × 0.01 + 0.25 × 0.09) = **15.8%**; contribuția activului volatil = 0.25 × 0.09 ÷ 0.025 = **90%**.
  - `worked`: ponderi pe inversul volatilității: 1/10 : 1/30 → **75% / 25%**; σ_p = √(0.75² × 0.01 + 0.25² × 0.09) = **10.6%**; fiecare activ contribuie 50%. Cursantul calculează σ_p.
  - `explain`: ca să ajungă la 15.8% volatilitate cu ponderile egale pe risc, portofoliul are nevoie de levier ≈ **1.49×**: cost de finanțare și risc în crizele în care activele „sigure” și cele riscante scad împreună.
  - `callout` E: risk parity e o metodă de construcție a portofoliilor mari (punte spre investiții, R6 §2.16). Pentru un individ, ideea utilă e bugetul de risc: o carte „împărțită egal” pe capital poate fi o carte cu un singur risc.
- **Try:** widget `risk-parity-builder`. Sarcina: „Set the weights so each of the two assets contributes half of the portfolio risk.” Reușită: contribuții între 48% și 52% (ponderi ≈ 75/25). Indicii: 1. „Weight each asset by one over its volatility.” 2. „Then scale the weights to add up to 100%.”
- **Practică:** carte cu 3 instrumente (LABI, LABB, LABC) pe R1/R8/R3 cu un episod R12 în care corelațiile urcă; comparația 1/N vs risk parity vs risk parity cu levier.
- **Check:** (1) numeric: ponderile pe inversul volatilității pentru 8% și 24% (75/25); (2) mcq: de ce 50/50 pe capital nu e 50/50 pe risc; (3) mcq: riscul principal al risk parity cu levier.
- **Dovezi:** B (R6 §2.16); Mechanic pentru matematică (R5 PR-02).
- **Necesită:** S9
- **Termeni noi de glosar:** risk-parity, risk-contribution, risk-budget, inverse-volatility-weighting

#### 4.4.5 · Stress testing: what if the worst happens?
- **Nivel / durată / tip:** Professional · 8 min · Elective (Derivatives, Systematic trader)
- **Obiective:**
  1. Run historical and hypothetical stress scenarios on a book.
  2. Run a reverse stress test: find the move that would cost a given share of equity.
  3. Adjust a book so no scenario in a stress battery breaches a loss limit.
- **Concepte:** portfolio-stress-testing (nou), reverse-stress-test (nou), scenario-planning ✓, gap-risk ✓, leverage ✓
- **Se sprijină pe:** 4.4.1, 4.4.3, 4.2.5, 3.7 (evenimente extreme), 2.14 (marjă, negative balance protection)
- **Hook:** predict · slider 1–20%. „Your book runs at 3× effective leverage. What adverse move loses 20% of your equity?” Răspuns: 6.7%.
- **Interacțiunea centrală:**
  - `match`: scenarii istorice ↔ mecanism (R4 §4.10; R6 §2.14, §3.3; R3 §3.12): Flash Crash 2010 (lichiditate evaporată, revenire în aceeași zi); SNB 2015 (ruperea unui peg, stop-uri sărite cu sute de pips); Volmageddon 2018 (volatilitatea s-a dublat într-o zi); martie 2020 (MWCB Level 1 de patru ori); WTI −37 în aprilie 2020 (livrare și stocare) [PK]; yen carry unwind, august 2024 [PK].
  - `explain`: scenarii ipotetice: gap −20%, volatilitate × 3, spread-uri × 10, marjă × 2, corelații → 1. Un test de stres include și timpul de ieșire: într-o criză nu poți ieși la prețul de pe ecran (R3 §1.7).
  - `worked`: testul invers: capital 10,000, expunere 30,000 (3×) → o pierdere de 2,000 (20%) cere o mișcare de 2,000 ÷ 30,000 = **6.7%**; la 5× ajunge 4%. Cursantul calculează varianta 5×.
  - `callout`: negative balance protection (UE, retail) limitează pierderea la capital, dar nu face pierderea mai mică (2.14).
- **Try:** widget `stress-battery`. Sarcina: „Adjust the book so no scenario in the battery loses more than 15% of equity.” Reușită: pierderea maximă din baterie ≤ 15%, calculată de motor. Indicii: 1. „Find the scenario that hurts most, then cut the exposure that drives it.” 2. „Correlations of 1 mean you add the losses.”
- **Practică:** S20 pe cartea din laboratorul unității: bateria rulează zilnic, iar raportul de risc arată cel mai prost scenariu.
- **Check:** (1) numeric: mișcarea care pierde 25% la 2.5× (10%); (2) mcq: ce face un test de stres pe care VaR nu-l face; (3) mcq: de ce contează timpul de ieșire într-un scenariu de criză.
- **Dovezi:** Mechanic (metoda; R6 §0.5 R12; R4 §4.10; R3 §1.7).
- **Necesită:** S20 (bateria de scenarii), S9, S11 (marjă dublată, close-out)
- **Termeni noi de glosar:** reverse-stress-test, historical-scenario, hypothetical-scenario (stress-test există de la 3.11, cu sensul de stres pe costuri; aici se lărgește la portofoliu)

#### 4.4.6 · Correlation regimes: when diversification disappears
- **Nivel / durată / tip:** Professional · 7 min · Elective (Derivatives, Systematic trader)
- **Obiective:**
  1. Compute correlation-adjusted risk and the effective number of bets for a set of positions.
  2. Explain why correlations rise in crises and which strategies fail together.
  3. Size positions with crisis correlations instead of calm ones.
- **Concepte:** correlation-regimes (nou), correlation-and-concentration ✓, effective-number-of-bets (2.11), carry (3.13)
- **Se sprijină pe:** 2.11 (corelație, heat), 3.6 (instabilitatea corelațiilor), 3.13 (carry, momentum crash), 4.4.5
- **Hook:** predict · slider 1–5. „Five 1%-risk positions look diversified at correlation 0.2. In a crisis correlation jumps to 0.8. How many independent bets do you really hold?” Răspuns: ≈ 1.2.
- **Interacțiunea centrală:**
  - `worked` cu formulele (R5 PR-02): riscul combinat a n poziții egale de 1% = √(n + n(n − 1)ρ) %; numărul efectiv de pariuri N_eff = n ÷ (1 + (n − 1)ρ). Pentru n = 5:
    - ρ = 0: 2.24%, N_eff 5;
    - ρ = 0.2: **3.00%**, N_eff 2.78;
    - ρ = 0.8: **4.58%**, N_eff **1.19**;
    - ρ = 1: 5.00%, N_eff 1.
    Cursantul calculează rândul ρ = 0.8.
  - `figure` (3 pași, matrice de corelație animată): regim calm → regim de criză (R12): blocurile se colorează spre 1.
  - `explain`: strategiile care cad împreună: toate strategiile de carry merg prost în recesiuni globale și crize de lichiditate (Koijen et al. 2018, R6 §2.10); momentum-ul transversal se prăbușește la revenire; trend following-ul a dat adesea „crisis alpha”, atribuită mai ales sincronizării cu beta (R6 §2.17, §8.1).
  - `callout`: greșeala clasică: corelațiile dintr-o perioadă calmă folosite pentru dimensionare (R5 PR-02).
- **Try:** widget `correlation-regime-lab`. Sarcina: „Size five equal positions so correlation-adjusted risk stays at or below 3% even if correlation jumps to 0.8.” Reușită: risc pe poziție ≤ 0.65% (3 ÷ 4.58). Indicii: 1. „At ρ = 0.8, five 1% positions carry 4.58%.” 2. „Scale every position by 3 ÷ 4.58.”
- **Practică:** carte cu R8 (carry calm) și un șoc de corelație R12; heat-ul naiv vs heat-ul ajustat la corelație afișate zilnic.
- **Check:** (1) numeric: N_eff pentru 4 poziții la ρ = 0.5 (1.6); (2) mcq: de ce strategiile de carry cad împreună; (3) mcq: ce corelație folosești la dimensionare (cea de criză).
- **Dovezi:** Mechanic (matematica, R5 PR-02); A pentru căderea comună a strategiilor de carry în crize (R6 §2.10); B pentru „crisis alpha” la trend following (R6 §2.17).
- **Necesită:** S9 (corelații dependente de regim), S20
- **Termeni noi de glosar:** correlation-regime, effective-number-of-bets, crisis-alpha

---
## Unitatea 4.5 · The business of trading (7 lecții)

### Fișa unității

- **Scop:** trading-ul ca activitate cu reguli, contrapărți, costuri fixe și o decizie de business la capăt. Reglementarea pe jurisdicții, datată (4.5.1); banii clienților, modelele de broker și verificarea unui broker (4.5.2); regulile evaluărilor de prop (4.5.3) și matematica lor de business, cu cazul My Forex Funds (4.5.4); taxele, doar ca awareness, și evidențele (4.5.5); criteriile de trecere de la demo la real (4.5.6); când să nu tranzacționezi (4.5.7).
- **De ce aici:**
  - E unitate **core** pentru toate traseele (README §3). Fără ea, restul cursului ar pregăti oameni pentru o piață fără reguli, fără broker și fără taxe.
  - R6 §7 (Stage 6, „Professionalisation”) pune aici brokerii, firmele de prop, taxele și construcția abordării. R1 §4 numește lipsurile pe care le acoperă: reglementarea depășită (gap 14, PDT), lipsa lecției „când să nu tranzacționezi” (gap 17), taxele și evidențele (gap 20), economia firmelor de prop (gap 21).
  - Regulile de la 1.8 (țepe, brokeri nereglementați), 2.14 (ESMA, istoria PDT, negative balance protection) și 3.2 (A-book/B-book, PFOF) revin aici la nivel de decizie.
- **Se sprijină pe:** 0.1 (cifrele oneste, benchmark-ul pasiv), 1.4 (capitalul de risc), 1.8 (țepe, brokeri nereglementați), 2.11 (limite, trepte de drawdown, reguli de tip prop), 2.14 (marjă, ESMA, PDT), 3.2 (modele de broker, PFOF, last look), 3.11 (incubare, forward test), 4.3 (dosarul de validare).
- **Checkpoint (test out):** 14 întrebări, ≥ 80%:
  - 3 de reglementare datată (cine supraveghează ce; plafoanele ESMA; starea regulii PDT la 22.10.2026);
  - 2 de protecția banilor (ce acoperă și ce nu acoperă schemele de compensare);
  - 2 de modele de broker (conflictul B-book, semnale de alarmă);
  - 2 de reguli de prop (podea statică vs trailing; regula de consistență);
  - 2 de EV-ul unei evaluări;
  - 1 de evidențe (ce trebuie păstrat);
  - 2 de go-live și „no trade” (intervalul de încredere, capitalul de risc).
- **Laboratorul unității: „Go-live review”:**
  - Cursantul își setează jurisdicția în simulator, alege un broker dintre cinci profiluri fictive, calculează EV-ul unei evaluări de prop pe propriile trade-uri, completează registrul de evidențe pentru o lună sintetică și rulează checklist-ul de go-live pe datele lui.
  - Rezultatul e una din trei decizii: **Live at minimum size**, **Not yet** sau **Don't trade live (invest passively)**.
  - **Reușită:** toate cele trei decizii pot trece; se notează dacă decizia urmează criteriile scrise și dacă fiecare criteriu e susținut de date. Aplicația spune explicit că rezultatele din simulator nu prezic profitabilitatea reală (R5 RR-07).
- **Firele din spirală:**
  - Psihologie: gândirea de business (README §4): costuri fixe, EV, alternativa pasivă.
  - Risc: banii clienților și contrapartea sunt și ele riscuri; capitalul de risc.
  - Dovezi: ratele oficiale de pierdere (ESMA, FCA, AMF) și studiile pe day traderi revin ca rate de bază.
  - Proces: datarea regulilor și revizuirea anuală (R6 §7, „regulatory freshness”).
  - Statistică: intervalul de încredere decide go-live-ul, nu media.
- **Surse:** R6 §0.2 (schimbările de reglementare din 2026), §1.2, §1.6, §3.1 (PDT înlocuit), §3.4 (CFD-uri, ESMA), §5.3 (platforme, date), §5.4 (brokeri, banii clienților), §5.5 (taxe), §5.6 (firme de prop, MFF), §6.5 (realismul carierei); R1 §1.7 (regulatorii, textul FINRA 4210), §2.22 (RG-01…RG-11), §4 (gap-urile 14, 17, 20, 21); R5 RR-01…RR-07, PR-04, PR-08, PR-11, BT-21; R3 §1.8 (PFOF, best execution), §1.10 (modele de broker, last look), §2.13 (slippage asimetric); R4 §4.10 (Alpari UK după SNB 2015).

**Notă de dată:** toate regulile din această unitate sunt la starea din **22 octombrie 2026**. Fiecare fapt de reglementare are în lecție o etichetă „As of 22 Oct 2026” și o dată de revizuire. Cele marcate „de verificat” se confirmă la sursa oficială înainte de publicare (README §12).

---

#### 4.5.1 · Regulators and the rules that apply to you
- **Nivel / durată / tip:** Professional · 8 min · Core
- **Obiective:**
  1. Name the regulators for retail trading in the EU, Romania, the UK and the US, and verify a firm on a regulator's own register.
  2. State the retail leverage limits and protections that apply in your jurisdiction, with their date.
  3. Explain what replaced the US pattern day trader rule in 2026 and why older course material is out of date.
- **Concepte:** regulatory-perimeter (nou), us-intraday-margin (nou), client-categorisation (nou), leverage ✓, negative-balance-protection (2.14), scam-red-flags (1.8)
- **Se sprijină pe:** 1.8, 2.14
- **Hook:** predict · alegere. „A broker offers 500:1 leverage on EUR/USD to retail clients living in Romania. Is that allowed?” Variante: „Yes, if you sign a waiver” / „No, the EU retail cap on major FX is 30:1” ✓ / „Yes, leverage isn't regulated” / „Only on weekends”. Feedback: o ofertă de 500:1 indică o entitate offshore, nereglementată în UE: semnal de alarmă (1.8).
- **Interacțiunea centrală:**
  - `figure` (tabel pe jurisdicții, „As of 22 Oct 2026”):

    | Jurisdicție | Cine supraveghează | Reguli-cheie pentru retail | De verificat |
    |---|---|---|---|
    | UE | ESMA coordonează; autoritățile naționale aplică MiFID II (de exemplu CySEC, BaFin); firmele autorizate într-un stat pot activa în altele (passporting) | măsurile ESMA pe CFD-uri din 2018, permanentizate național: levier 30:1 FX major, 20:1 FX non-major, aur și indici majori, 10:1 alte mărfuri și indici, 5:1 acțiuni, 2:1 crypto; close-out la 50% din marja cerută; negative balance protection; interzicerea bonusurilor; avertismentul cu procentul de conturi care pierd (74–89%); opțiunile binare interzise; testul de adecvare MiFID II | eliminarea PFOF (excepții naționale până la 30.06.2026) [PK]; T+1 în UE planificat pentru octombrie 2027 [PK] |
    | România | ASF (Autoritatea de Supraveghere Financiară): piața de capital și firmele de investiții; se aplică măsurile ESMA; bursa locală e BVB | ca în UE | schema de compensare a investitorilor (Fondul de Compensare a Investitorilor) și plafonul ei [de verificat] |
    | UK | FCA | restricții permanente din 1 august 2019 (CFD-uri, spread betting, FX spot rulat), plafon 30:1; CFD-urile pe crypto interzise pentru retail; în eșantionul FCA din 2016, 82% din conturi pierdeau | FSCS £85,000 pentru investiții [PK, verify] |
    | SUA | SEC și FINRA (valori mobiliare, brokeri); CFTC și NFA (futures, FX retail; dealerii FX se înregistrează ca RFED sau FCM) | CFD-urile nu sunt disponibile pentru retail; FX retail 50:1 major, 20:1 restul [PK]; Reg T: marjă inițială 50%, de menținere 25%, minimum $2,000 în contul în marjă; regula PDT înlocuită (mai jos) | toate cifrele [PK] se confirmă pe site-urile regulatorilor |
    | Offshore | înregistrări cu protecție minimă | levier de 500:1 și bonusuri | semnal de alarmă pentru retail (R6 §5.4) |

  - `reveal` „The end of the PDT rule” (R6 §0.2, §3.1; R1 §1.7; R5 RR-05):
    - până la 3 iunie 2026: 4 sau mai multe day trade-uri în 5 zile lucrătoare într-un cont în marjă → statut PDT, minimum $25,000, „day-trading buying power”, restricții de 90 de zile;
    - din **4 iunie 2026** (SR-FINRA-2025-017, aprobat de SEC în aprilie 2026; sursele dau 14 sau 15 aprilie): paragraful (f)(8)(B) din FINRA Rule 4210 e „Reserved”; în locul lui, un regim de **marjă intraday**: nivelul de marjă intraday, deficitul de marjă intraday (cea mai mare valoare negativă după un trade care crește riscul), deficitele se acoperă în cel mult 15 zile lucrătoare, practica de a nu le acoperi până în ziua a 5-a aduce o restricție de 90 de zile, deficitele sub minimul dintre 5% din capital și $1,000 sunt exceptate;
    - tranziție până la **20 octombrie 2027**: unii brokeri pot aplica încă vechile reguli;
    - stare: **de verificat** la publicare (README §12: raportat de trei agenți de cercetare; R1 §1.7 citează textul FINRA).
  - `explain`: categoria de client (MiFID II): retail vs profesional. Trecerea la „profesional” la cerere scoate protecțiile retail (plafoanele de levier, negative balance protection, unele avertismente) (R1 §2.22, RG-10).
  - `callout`: cum verifici un broker: numărul de licență, căutat pe registrul regulatorului, nu pe site-ul brokerului (R6 §5.4).
- **Try:** widget `jurisdiction-selector`. Sarcina: „Set the simulator to ‘EU retail’ and enter the maximum leverage for EUR/USD, gold, a single-stock CFD and a Bitcoin CFD.” Reușită: 30, 20, 5, 2 (4 din 4). Apoi comutarea pe „US retail” arată „CFDs not available”. Indicii: 1. „Major FX gets the highest cap.” 2. „Crypto gets the lowest.”
- **Practică:** quiz pe scenarii de jurisdicție (6 carduri: client, produs, ofertă) și un exercițiu de verificare pe un registru simulat.
- **Check:** (1) mcq: cine supraveghează firmele de investiții în România (ASF); (2) mcq: starea regulii PDT la 22.10.2026; (3) mcq: ce pierzi dacă ceri statut de client profesional.
- **Dovezi:** Mechanic (fapte de reglementare, datate) (R1 §1.7; R6 §0.2, §3.1, §3.4, §5.4; R5 RR-01, RR-05). Cifrele marcate [PK] și înlocuirea PDT sunt „de verificat”.
- **Necesită:** S11 (profiluri de jurisdicție: plafoane, close-out, negative balance protection)
- **Termeni noi de glosar:** financial-regulator, esma, mifid-ii, asf, fca, sec, finra, cftc, nfa, passporting, retail-client, professional-client, appropriateness-test, pattern-day-trader, intraday-margin

#### 4.5.2 · Client money, broker models and broker due diligence
- **Nivel / durată / tip:** Professional · 8 min · Core
- **Obiective:**
  1. Explain client-money segregation and what investor compensation schemes do and do not cover.
  2. Describe A-book, B-book and hybrid dealing models and the conflict of interest in each.
  3. Rank brokers with a due-diligence checklist and flag the red flags.
- **Concepte:** client-money-protection (nou), broker-due-diligence (nou), broker-models (3.2), payment-for-order-flow (3.2), last-look (3.2), negative-balance-protection (2.14)
- **Se sprijină pe:** 3.2 (A-book/B-book, PFOF), 2.14, 4.5.1
- **Hook:** predict · alegere. „Your broker goes bust. Which of these is protected?” Variante: the trading losses you made last month / cash at a US broker-dealer, up to $250,000 ✓ / futures margin, under SIPC / coins left on a crypto exchange.
- **Interacțiunea centrală:**
  - `explain`: brokerii reglementați trebuie să țină banii clienților separat de banii firmei (segregare). Schemele de compensare plătesc dacă firma cade, nu dacă tu pierzi pe piață: SIPC (SUA, valori mobiliare) până la $500,000, din care $250,000 cash, fără pierderi de piață, futures, FX sau crypto care nu e valoare mobiliară; schemele UE, minimum €20,000 [PK]; FSCS £85,000 [PK, verify] (R6 §5.4).
  - `reveal` (cazuri): MF Global 2011 și PFG 2012 (segregarea a eșuat) [PK]; Alpari UK, insolvent a doua zi după SNB 2015 (R4 §4.10); FTX, bani amestecați cu firma-soră, gaură de ≈ $8 miliarde (R6 §8.1).
  - `match`: model ↔ descriere ↔ conflict: A-book / STP / ECN (ordinul merge la lichiditate externă, brokerul câștigă din comision); B-book / market maker (brokerul e contrapartea; un client care câștigă constant e o datorie, cei care pierd sunt venit); hibrid (profilează clienții și trimite câștigătorii în A-book) (R3 §1.10; R6 §5.4).
  - `callout`: B-book nu înseamnă automat „stop hunting”, iar o etichetă A-book nu garantează execuții bune. Contează execuția, transparența și controalele. Slippage-ul asimetric (doar cel negativ ajunge la client) e semnal de alarmă (R3 §2.13). Last look în FX e reglementat de FX Global Code, principiul 17 (R3 §1.10).
  - `reveal` „broker switch” (R3 §1.10): aceeași strategie, 50 de trade-uri, sub STP (comision + spread brut), B-book (spread mai larg, requote, last look), ECN (execuții parțiale). P&L-ul brokerului apare lângă al cursantului.
- **Try:** widget `broker-ranker`, cu cinci profiluri fictive (Broker A–E, R6 §5.4):
  - A: reglementat în UE, licență verificabilă, STP cu comision, segregare, negative balance protection;
  - B: offshore, levier 500:1, bonus de 100% la depunere;
  - C: reglementat în UE, B-book declarat, statistici de execuție bune, spread-uri mai largi;
  - D: nereglementat, „managed account” cu „8% pe lună garantat”;
  - E: reglementat, ECN, comisioane mari, plângeri despre întârzierea retragerilor.
  Sarcina: „Rank the five brokers and flag every red flag.” Reușită: pe primul loc un broker cu licență verificabilă, segregare și negative balance protection (A sau C, cu justificare); ≥ 4 din 5 semnale de alarmă găsite (offshore, 500:1, bonus, randament garantat, plângeri la retrageri). Indicii: 1. „Check who regulates the firm before anything else.” 2. „Guaranteed returns and deposit bonuses are red flags on their own.”
- **Practică:** „broker switch” pe 50 de trade-uri în Arena; raportul de execuție (price improvement, fill rate, slippage pe semn).
- **Check:** (1) mcq: ce nu acoperă SIPC; (2) mcq: unde e conflictul de interese la B-book; (3) mcq: ce verifici pe registrul regulatorului (numărul licenței și entitatea).
- **Dovezi:** Mechanic (R6 §5.4; R3 §1.8, §1.10, §2.13; R4 §4.10). Plafoanele schemelor marcate [PK] sunt de verificat.
- **Necesită:** S8 (profiluri de broker, raport de execuție), S11
- **Termeni noi de glosar:** client-money-segregation, investor-compensation-scheme, sipc, fscs, counterparty-risk, hybrid-broker, asymmetric-slippage

#### 4.5.3 · Prop firm evaluations: the rules and what they reward
- **Nivel / durată / tip:** Professional · 8 min · Core
- **Obiective:**
  1. Distinguish institutional prop firms from retail evaluation firms.
  2. Compute where a static, an intraday-trailing and an end-of-day-trailing loss limit sit during a trade.
  3. Explain how risk per trade changes the pass probability for traders with and without an edge.
- **Concepte:** prop-evaluation-rules (nou), drawdown ✓, daily-loss-limit (1.4), drawdown-tiers (2.11)
- **Se sprijină pe:** 1.4 (limite zilnice), 2.11 (trepte de drawdown), 3.12 (risk of ruin)
- **Hook:** predict · alegere. „A trader with a real +0.2R edge per trade takes a challenge: +10% target, −10% maximum loss. Which risk per trade passes most often?” Variante: 0.5% ✓ / 1% / 2% / 3%. Răspuns, în simularea din lecție: 83% la 0.5%, 79% la 1%, 54% la 2%.
- **Interacțiunea centrală:**
  - `explain`: două lucruri diferite (R6 §5.6): firmele de prop instituționale angajează traderi și le dau capitalul firmei; firmele de evaluare retail vând încercări pe un cont **simulat**, iar contul „funded” e adesea tot simulat.
  - `figure` (reguli tipice, „As of 2026, third-party summaries, verify on the firms' sites”): FTMO 2-Step: țintă 10% apoi 5%, pierdere zilnică maximă 5% din soldul inițial (pe equity, cu pozițiile deschise), pierdere totală maximă 10% statică, minimum 4 zile de trading, split 80% → 90%; o variantă 1-Step raportată cu 3% zilnic și regula „best day ≤ 50%” (sursele se contrazic). Topstep: conturi $50K/$100K/$150K, ținte $3,000/$6,000/$9,000, Maximum Loss Limit trailing $2,000/$3,000/$4,500 pe soldul de la final de zi, oprit la soldul de start; regula de consistență (cea mai bună zi < 50% din profit); split ≈ 90/10. Alte reguli: restricții la știri, fără weekend, plafon de loturi, interdicții pentru copy trading, HFT, grid și martingale, KYC înainte de plată.
  - `worked` (R5 PR-11, în vUSD): cont 50,000, limită trailing intraday 2,500. Podeaua pornește la 47,500. Un trade ajunge la +1,500 nerealizat (equity 51,500) → podeaua urcă la **49,000**. Trade-ul se închide la break-even: equity 50,000, tampon doar 1,000. Cu trailing de final de zi, podeaua ar fi rămas la 47,500. Cursantul calculează podeaua.
  - `figure` (simulare verificată cu script; două faze: +10% apoi +5%; pierdere zilnică 5%; pierdere maximă 10% statică; 3 trade-uri pe zi; risc fix pe soldul inițial; cel mult 60 de zile pe fază; 20,000 de rulări):

    | Expectancy pe trade | Risc 0.5% | Risc 1% | Risc 2% |
    |---|---|---|---|
    | +0.2R (40% × +2R) | 83% | 79% | 54% |
    | 0R (40% × +1.5R) | 11% | 29% | 30% |
    | −0.1R (40% × +1.25R) | 0.4% | 5% | 14% |

    Concluzia: fără edge, mai mult risc crește șansa de trecere (e o loterie); cu edge, riscul moderat câștigă. Riscul mare scade și supraviețuirea pe termen lung într-un cont „funded” (R6 §5.6). Cifrele depind de presupuneri; motorul le recalculează pe trade-urile cursantului (4.5.4).
- **Try:** widget `challenge-mode`. Sarcina: „Your 50,000 vUSD evaluation has a 2,500 intraday trailing limit. Equity peaked at 51,500 during an open trade, then the trade closed at breakeven. Where is the floor, and how much buffer is left?” Reușită: podea 49,000, tampon 1,000. Indicii: 1. „The floor trails the highest equity, open profit included.” 2. „Subtract 2,500 from the peak.”
- **Practică:** S18 „challenge mode” pe R1/R2/R6, 20 de sesiuni, cu linia podelei desenată pe equity. Debrief-ul notează respectarea regulilor și procesul, nu trecerea (R5 PR-11, RR-06).
- **Check:** (1) numeric: podeaua EOD după o zi închisă la 50,800 cu limită de 2,000 pe un cont de 50,000 (48,800); (2) mcq: ce înseamnă „pierderea zilnică se măsoară pe equity, cu pozițiile deschise”; (3) mcq: ce pedepsește regula de consistență (zilele norocoase).
- **Dovezi:** Mechanic (reguli, datate; „verify on the firms' sites”, R6 §5.6; R5 PR-11); ratele de trecere publice sunt estimări neauditate (5–10%, R6 §5.6); tabelul de simulare e Mechanic în presupunerile date.
- **Necesită:** S18 (reguli configurabile: țintă, zilnic, static/trailing intraday/trailing EOD, zile minime, consistență)
- **Termeni noi de glosar:** prop-firm, evaluation-challenge, funded-account, profit-target, trailing-drawdown, consistency-rule, profit-split

#### 4.5.4 · The maths and the business of evaluations
- **Nivel / durată / tip:** Professional · 7 min · Core
- **Obiective:**
  1. Compute the expected value of buying an evaluation and the pass probability needed to break even.
  2. Estimate your own pass probability from your simulated trades.
  3. Explain what the CFTC case against My Forex Funds shows about regulatory protection for evaluation customers.
- **Concepte:** prop-challenge-ev (nou), prop-evaluation-rules (nou, din 4.5.3), expectancy ✓, base-rates ✓
- **Se sprijină pe:** 4.5.3, 0.2 (valoarea așteptată), 3.11 (Monte Carlo)
- **Hook:** predict · numeric. „An evaluation costs 500. You estimate a 10% chance to pass and 1,500 of payouts on average if you get funded. What is the expected value?” Răspuns: 0.10 × 1,500 − 500 = **−350**.
- **Interacțiunea centrală:**
  - `worked` cu formula (R6 §5.6): EV = P(trecere) × E[plăți | funded] − taxe. Break-even: P = 500 ÷ 1,500 = **33%**. Dacă încercările sunt independente și abilitatea nu se schimbă, numărul așteptat de încercări până la un cont funded = 1 ÷ P = 10, adică 5,000 în taxe. Cursantul calculează P de break-even.
  - `explain` (estimări neauditate, R6 §5.6): ratele de trecere sunt estimate la 5–10% (2–20% în funcție de reguli); comunitatea vorbește de 2–4 încercări până la primul cont funded ($800–$1,600 în taxe); ratele de plată din conturile funded sunt rar publicate (afirmațiile de „≈ 7%” nu sunt verificate). Criticii notează că taxele încasate de la cei care pică finanțează modelul, iar multe firme nu trimit niciodată ordinele într-o piață reală.
  - `reveal` cazul **CFTC v. Traders Global Group (My Forex Funds)**: plângerea din 2023 vorbește de peste 135,000 de clienți și cel puțin $310 milioane în taxe, cu firma acționând ca contraparte deși pretindea furnizori de lichiditate externi. În **mai 2025** cazul a fost respins, cu sancțiuni împotriva echipei de enforcement a CFTC (după relatarea apărării), după ce instanța a pus sub semnul întrebării jurisdicția asupra tranzacțiilor **simulate**. Lecția: protecția reglementară pentru cine plătește taxe de evaluare e neclară. Mai multe firme s-au închis sau și-au schimbat brusc regulile în 2024 [PK]; ASIC a emis avertismente.
  - `callout`: regulile evaluărilor sunt un bun antrenament de disciplină. Simulatorul ți-l dă gratis; o evaluare cumpărată e un cost cu EV calculabil, nu o carieră.
- **Try:** widget `challenge-ev-calculator`. Sarcina: „Estimate your pass probability from your last 100 simulated trades, then find the fee at which this evaluation breaks even.” Pașii: cursantul scrie întâi o estimare, apoi motorul rulează Monte Carlo pe trade-urile lui. Reușită: estimarea lui la ± 20% relativ de valoarea motorului sau corectată cu o explicație; taxa de break-even corectă (± 5%). Indicii: 1. „Break-even fee = pass probability × expected payouts.” 2. „Your pass probability depends on your risk per trade, not only on your edge.”
- **Practică:** S18 pe propriile trade-uri sub trei seturi de reguli (static, trailing intraday, trailing EOD); comparația probabilităților și a EV-ului.
- **Check:** (1) numeric: EV pentru taxă 300, P 15%, plăți 1,200 (−120); (2) mcq: ce arată cazul My Forex Funds; (3) mcq: de ce „mai mult risc trece mai des” nu e o strategie pentru cine nu are edge.
- **Dovezi:** Mechanic (EV); datele industriei sunt estimări neauditate, de calitate D (R6 §5.6; R5 RR-06); faptele juridice sunt datate și se reverifică (R6 §5.6, sursele CFTC și King & Spalding din R6 §8.1).
- **Necesită:** S18 (Monte Carlo al probabilității de trecere pe trade-urile cursantului), S15
- **Termeni noi de glosar:** challenge-fee, challenge-expected-value, simulated-funded-account, payout-rate

#### 4.5.5 · Taxes (awareness only) and record-keeping
- **Nivel / durată / tip:** Professional · 6 min · Core
- **Obiective:**
  1. List the records a trader must keep for every trade and every cash movement.
  2. Show how a generic tax rate reduces long-run compounding.
  3. Explain why tax treatment differs by country, instrument and account type, and where to get an answer for your own case.
- **Concepte:** tax-awareness (nou), trade-records (nou), journaling ✓
- **Se sprijină pe:** 1.6 (jurnalul), 2.14 (instrumente), 4.5.1
- **Hook:** predict · slider. „Two traders each make 10% a year before tax for 10 years, starting from 10,000. One pays a generic 20% tax on each year's gain. How much less does she end with?” Răspuns: 25,937 vs 21,589, adică ≈ **4,348** mai puțin.
- **Interacțiunea centrală:**
  - `callout` (primul beat, obligatoriu): „This is not tax advice. Rules differ by country and change often. Ask your tax authority or a qualified adviser.” Aplicația nu dă cote și nu calculează impozite pe țări.
  - `worked`: 10,000 × 1.10^10 = 25,937; 10,000 × 1.08^10 = 21,589. Taxa generică de 20% pe câștigul anual transformă 10% în 8% și scade compunerea. Cursantul calculează a doua linie.
  - `match` (exemple ilustrative, [PK, verify locally], R6 §5.5): regula wash-sale din SUA (pierderea nu se recunoaște dacă rescumperi același titlu în 30 de zile); Section 1256 în SUA (tratament 60/40 pentru futures); UK: spread betting în general în afara impozitului pe câștiguri de capital, CFD-urile impozitate; România: tratamentul depinde dacă brokerul e român (reținere la sursă) sau străin (declarare proprie în declarația anuală), iar regulile s-au schimbat în 2025–2026 [de verificat].
  - `explain`: ce păstrezi (R6 §5.5; R1 §4, gap 20): data și ora, instrumentul, mărimea, prețurile, comisioanele, swap-ul sau finanțarea, cursul de schimb folosit la conversie, extrasele brokerului, depunerile și retragerile. Termenul legal de păstrare diferă pe țări [de verificat].
- **Try:** widget `records-ledger`. Sarcina: „Complete the records for three trades, one of them converted to your home currency, so each has every required field.” Reușită: toate câmpurile obligatorii completate și conversia corectă (exemplu: P&L 250.00 vUSD la un curs de 4.60 unități locale pentru 1 vUSD = 1,150.00). Indicii: 1. „Fees and financing are part of the record.” 2. „Use the exchange rate of the trade date.”
- **Practică:** „cost receipt” lunar și vederea „after-tax” cu o rată generică introdusă de cursant (R6 §5.1), pe jurnalul lui din Arena.
- **Check:** (1) mcq: ce face și ce nu face aplicația în privința taxelor; (2) mcq: ce câmp lipsește dintr-un registru dat (cursul de schimb); (3) numeric: valoarea după 10 ani la 6% net pe an pornind de la 10,000 (17,908).
- **Dovezi:** Mechanic (aritmetica evidențelor și a compunerii); regulile fiscale sunt exemple ilustrative [PK, verify locally] (R6 §5.5; R1 §2.22 RG-08; R1 §4, gap 20).
- **Necesită:** S15 (export de evidențe, vedere „after-tax” cu rată generică)
- **Termeni noi de glosar:** capital-gains-tax, wash-sale-rule, after-tax-return, withholding-tax, trade-records

#### 4.5.6 · From demo to live: the transition criteria
- **Nivel / durată / tip:** Professional · 8 min · Core
- **Obiective:**
  1. Apply a written go-live checklist covering evidence, process, capital, broker and expectations.
  2. Decide whether a sample of simulated results supports going live, using a confidence interval.
  3. Explain why live results are expected to be worse than simulated ones.
- **Concepte:** go-live-criteria (nou), risk-capital (1.4), incubation (3.11), decision-quality ✓, base-rates ✓
- **Se sprijină pe:** 1.4 (capitalul de risc), 1.6 (KPI-uri de proces), 3.11 (incubare), 4.3.7 (dosarul de validare), 4.5.1, 4.5.2
- **Hook:** predict · alegere. „Your simulator results: 60 trades, +0.35R average, 98% stop integrity. Ready to go live?” Variante: „Yes, the edge is clear” / „Not yet: the interval still includes zero” ✓ / „Yes, but with 2% risk” / „Only if you feel confident”.
- **Interacțiunea centrală:**
  - `worked` (abaterea standard a R-ului 1.5): eroarea standard = 1.5 ÷ √60 = 0.19; IC 95% = 0.35 ± 0.38 = **−0.03 la 0.73**. Intervalul include zero. Cursantul calculează limitele.
  - `order` (checklist-ul de go-live, R5 BT-21, RR-07; R6 §6.4–6.5):
    1. **Dovezi:** dosar de validare cu verdict „deploy to forward test” (4.3.7); forward test în simulator de cel puțin 50 de trade-uri, cu expectancy-ul în banda Monte Carlo 5–95% a backtest-ului (poarta de go-live de la 3.11.10).
    2. **Proces:** stop integrity ≥ 95%, acuratețea riscului ≥ 90%, plan adherence ≥ 90%, respectarea limitelor 100% pe perioada de forward test.
    3. **Capital:** doar capital de risc (bani a căror pierdere nu-ți schimbă viața), economii de urgență separate, niciun ban împrumutat (R6 §6.5).
    4. **Broker:** licență verificată pe registru, banii clienților segregați, negative balance protection unde există (4.5.1–4.5.2).
    5. **Plan:** mărime live minimă, kill criteria scrise, premortem (4.6.4).
    6. **Așteptări:** rezultatele live vor fi mai slabe decât cele din simulator (costuri, slippage, emoții reale); simulatorul nu prezice profitabilitatea reală (R5 RR-07).
  - `explain`: unealta de decizie are trei ieșiri: **Live at minimum size**, **Not yet**, **Don't trade live (invest passively)**. Toate trei sunt rezultate valide ale cursului.
- **Try:** widget `go-live-checklist`. Sarcina: „Decide for each of three trader profiles: live at minimum size, not yet, or don't trade live.” Profilurile: (A) 60 de trade-uri cu IC care include zero și bani puși deoparte pentru avansul unei locuințe → Don't trade live (capitalul nu e de risc) sau Not yet; (B) dosar validat, 120 de trade-uri de forward test în bandă, KPI-uri peste prag, capital de risc, broker verificat, kill criteria scrise → Live at minimum size; (C) KPI-uri bune, dar fără edge validat după costuri față de benchmark → Not yet sau invest passively. Reușită: 3 din 3, fiecare cu cel puțin două criterii citate. Indicii: 1. „Capital that you need for life plans is not risk capital.” 2. „Good discipline without a validated edge is not enough.”
- **Practică:** aplicația completează checklist-ul din jurnalul cursantului (S15) și din detectoare (S14); cursantul răspunde la ce lipsește.
- **Check:** (1) numeric: IC pentru 100 de trade-uri, medie 0.25R, abatere 1.5R (−0.04 la 0.54); (2) mcq: ce e capitalul de risc; (3) mcq: de ce rezultatele live sunt de așteptat mai slabe.
- **Dovezi:** A pentru ratele de bază ale retail-ului (ESMA 74–89%, Brazilia 97%, Taiwan < 1%; R5 RR-01, RR-02); Mechanic pentru intervalul de încredere (R5 PM-13); practica incubării (R5 BT-21; R6 §6.4–6.5).
- **Necesită:** S15 (KPI-uri, IC, banda Monte Carlo), S14
- **Termeni noi de glosar:** go-live-checklist, minimum-live-size, sim-to-live-gap

#### 4.5.7 · When not to trade
- **Nivel / durată / tip:** Professional · 7 min · Core
- **Obiective:**
  1. Recognise the personal, market, process and financial states in which you should stand aside.
  2. Use base rates on retail outcomes to judge whether active trading belongs in your plan at all.
  3. Treat abstaining as a scored skill, not a missed opportunity.
- **Concepte:** no-trade-conditions (nou), base-rates ✓, revenge-trading ✓, fomo ✓, daily-loss-limit (1.4), drawdown-tiers (2.11)
- **Se sprijină pe:** 0.1 (cifrele oneste), 1.7 (pauza), 2.11 (trepte de drawdown), 2.12 (tilt), 4.5.6
- **Hook:** predict · alegere multiplă. „Which of these are reasons to stand aside today?” Variante: you hit your daily loss limit yesterday and want to win it back today ✓ / the market looks like noise and none of your setups appear ✓ / a tier-1 release is in 10 minutes and your plan has no rule for it ✓ / you feel calm and a setup from your playbook appears.
- **Interacțiunea centrală:**
  - `match`: patru familii de stări ↔ exemple:
    - personale: tilt, oboseală, boală, un eveniment major de viață (2.12; detectoarele S14);
    - de piață: zgomot fără edge (ca R0), o criză R12 pe care planul nu o acoperă, o fereastră de știri fără regulă, lichiditate subțire de sărbători;
    - de proces: limita zilnică sau săptămânală atinsă, o treaptă de drawdown atinsă, un KPI sub prag, un setup care nu e în playbook;
    - financiare: bani de care ai nevoie în următorii 1–2 ani, datorii, lipsa fondului de urgență (R6 §6.5).
  - `reveal` ratele de bază (README §1, principiul 8; R5 RR-01, RR-02): ESMA: 74–89% din conturile CFD retail pierd; FCA 2016: 82%; AMF (2009–2012): ≈ 89%; Brazilia: 97% din day traderii care au persistat peste 300 de zile au pierdut; Taiwan: sub 1% profitabili în mod previzibil; Barber & Odean: cei mai activi 20% dintre investitori au câștigat 11.4% pe an față de 17.9% ale pieței.
  - `explain`: alternativa implicită e investiția pasivă diversificată (R6 §1.6). Un rezultat valid al cursului e decizia de a nu face day trading, sau de a nu tranzacționa deloc cu bani reali.
  - `callout`: în Arena, abținerea corectă în segmentele R0 primește scor („abstain when no edge”, R6 §0.5).
- **Try:** widget `abstain-drill`. Sarcina: „For each of 12 day cards, choose Trade, Reduce size or Stand aside.” Reușită: ≥ 10 din 12 corecte. Indicii: 1. „Check your process state before the chart.” 2. „No setup means no trade.”
- **Practică:** segmente Arena cu R0 și R12 ascunse; scorul de abținere (acuratețea abținerii în R0, expunerea redusă în R12 fără regulă).
- **Check:** (1) mcq: ce faci după ce atingi o treaptă de drawdown; (2) mcq: ce a găsit studiul din Brazilia; (3) mcq: de ce abținerea în R0 e o abilitate.
- **Dovezi:** A pentru ratele de bază (R5 RR-01, RR-02; R6 §1.2); Mechanic pentru limite (R5 PR-04, PR-08); B pentru efectul stărilor (tilt, oboseală) asupra deciziilor (R5 PSY-19, PSY-26).
- **Necesită:** S14 (detectoare de stare), S7 (segmente R0), S6
- **Termeni noi de glosar:** no-trade-day, stand-aside-rule, abstention-accuracy

---
## Unitatea 4.6 · Your trading approach (6 lecții)

### Fișa unității

- **Scop:** tot cursul strâns într-un singur document de lucru: abordarea personală. Matricea de constrângeri și auditul comportamental (4.6.1); alegerea pieței și a stilului (4.6.2); specializarea (4.6.3); pipeline-ul de dezvoltare cu criterii de oprire (4.6.4); creșterea treptată a mărimii (4.6.5); îmbunătățirea continuă și decizia anuală (4.6.6).
- **De ce aici:**
  - E ultima unitate core și leagă firele: riscul de la 1.4 și 2.11, statistica de la 0.2 și 3.10, psihologia de la 1.7 și 2.12, procesul de la 1.6 și 2.13, dovezile de la 3.11 și 4.3, costurile de la 1.1 până la 4.2.
  - R6 §6 și §7 (Stage 6, punctul 44) o pun imediat înaintea capstone-ului. R1 §4 cere explicit două lucruri pe care le face aici: exits și sizing înaintea intrărilor (gap 16) și „când să nu tranzacționezi” ca rezultat valid (gap 17).
  - Documentul produs în laborator e intrarea capstone-ului final.
- **Se sprijină pe:** 1.6 (planul v1, jurnalul, KPI-urile de proces), 1.7 și 2.12 (psihologie, detectoare), 2.8 (regim ↔ strategie), 2.9 (stiluri, sesiuni, scalping și zidul costurilor), 2.13 (playbook, recenzii), 3.11 (pipeline-ul de backtest, incubarea, guvernarea regulilor), 3.12 (Kelly, risk of ruin), 3.13 (decay), 4.3, 4.5.
- **Checkpoint (test out):** 10 întrebări, ≥ 80%:
  - 2 pe matricea de constrângeri (stil exclus, constrângere măsurată vs declarată);
  - 2 pe alegerea pieței (raportul de tradabilitate, fereastra de sesiune din România);
  - 2 pe specializare (mărimea eșantionului, lista no-trade);
  - 2 pe kill criteria (review vs kill la praguri Monte Carlo);
  - 1 pe scalare (când crești mărimea);
  - 1 pe decay vs varianță (intervalul de încredere).
- **Laboratorul unității: „My trading approach”:**
  - Un document cu secțiuni fixe, construit în aplicație din bucățile lecțiilor:
    1. matricea de constrângeri și auditul comportamental (4.6.1);
    2. piața și stilul, cu raportul de tradabilitate și fereastra de sesiune (4.6.2);
    3. playbook-ul: cel mult 2–3 setup-uri, cu reguli exacte, regimul potrivit (matricea R6 §2.17) și lista no-trade (4.6.3);
    4. legătura la dosarul de validare al fiecărui setup (4.3.7);
    5. politica de risc: risc pe trade, heat cap ajustat la corelație, limite zilnice și săptămânale, trepte de drawdown, țintă de volatilitate dacă e o carte (2.11, 4.4);
    6. pipeline-ul și kill criteria, cu pragurile scrise (4.6.4);
    7. etapele de capital (4.6.5);
    8. calendarul de revizuire și regulile de schimbare (4.6.6);
    9. premortem-ul;
    10. decizia curentă: Live at minimum size / Not yet / Don't trade live (4.5.6).
  - **Reușită:** toate secțiunile completate; fiecare regulă e verificabilă de motor (de exemplu, „risk ≤ 1%” se poate testa pe jurnal); pragurile de oprire sunt numere, nu adjective; decizia din secțiunea 10 e consecventă cu criteriile de la 4.5.6.
- **Firele din spirală:**
  - Proces: criterii de oprire, scalare (README §4).
  - Psihologie: gândirea de business; constrângeri măsurate, nu declarate.
  - Risc: scalarea pe etape, cu de-risking la drawdown.
  - Statistică: specializarea ca mod de a ajunge la un eșantion cu putere statistică; decay vs varianță.
  - Costuri: raportul de tradabilitate; impactul la scalare.
  - Dovezi: decay-ul edge-urilor publicate (McLean & Pontiff).
- **Surse:** R6 §6.1 (matricea de constrângeri), §6.2 (alegerea pieței), §6.3 (specializarea), §6.4 (pipeline-ul), §6.5 (scalarea, realismul carierei), §7 (Stage 6, firele transversale), §1.1 (stilurile), §2.17 (matricea strategie × regim); R5 RF-13 (Kelly), PR-01, PR-08, BT-13 (Monte Carlo, percentilele de drawdown), BT-21 (incubare, kill switch), BT-22 (regim și decay), PL-01, PL-03, PL-12, PL-14 (guvernarea regulilor), PM-13 (eșantionul), PSY-32 (practica deliberată), PSY-36 (premortem), PSY-37 (guard-rails); R1 §3.4, §4 (gap-urile 16, 17); R3 §3.2 (sesiunile FX, DST).

---

#### 4.6.1 · The constraints matrix
- **Nivel / durată / tip:** Professional · 7 min · Core
- **Obiective:**
  1. Fill in a constraints matrix covering time, capital, jurisdiction, drawdown tolerance, skills and temperament.
  2. Replace self-reported traits with measured behaviour from your journal.
  3. Name the styles your constraints rule out, with a reason for each.
- **Concepte:** constraints-matrix (nou), behaviour-audit (nou), trading-styles (2.9), trading-plan ✓, revenge-trading ✓, fomo ✓
- **Se sprijină pe:** 1.6, 1.7, 2.9 (stiluri), 2.12 (bias-uri măsurate)
- **Hook:** predict · alegere. „You work 09:00–17:00 CET with a 30-minute lunch break. Which style fits best?” Variante: scalping the open / news trading / swing or position trading with end-of-day orders ✓ / day trading the US close.
- **Interacțiunea centrală:**
  - `figure` (matricea din R6 §6.1, 8 rânduri, construită pe pași):

    | Constrângere | Îndreaptă spre | De evitat |
    |---|---|---|
    | Job cu normă întreagă, ore fixe | swing sau position, ordine la final de zi, reguli sistematice | scalping, news trading |
    | Liber dimineața (sesiunile UE/SUA) | day trading pe deschidere, dacă înțelegi costurile | strategii pe sesiunea asiatică |
    | Locuiești în UE/România (CET/EET) | deschiderea indicilor UE, suprapunerea Londra–New York, deschiderea SUA | strategii care cer zilnic închiderea SUA, dacă nu sunt automatizate |
    | Cont mic (< €5k) | micro futures, micro loturi FX, ETF-uri fără levier, acțiuni fracționate, orizont swing | levier concentrat, multe poziții simultane |
    | Cont mai mare | position trading diversificat, acoperire cu opțiuni | small caps fără lichiditate |
    | Toleranță mică la drawdown | risc pe trade 0.25–0.5%, mean reversion cu stop, portofolii diversificate | trend following cu rate de câștig de 35%, short vol |
    | Îți plac datele și codul | strategii sistematice, backtesting | citirea pur discreționară a pattern-urilor |
    | Impulsiv sub stres (măsurat în simulator) | ordine automate, reguli fixe, orizonturi mai lungi | intraday discreționar |

  - `explain`: auditul comportamental (R6 §6.1; R5 PSY-37): jurnalul din simulator măsoară overtrading-ul, frecvența trade-urilor de revenge, stop-urile mutate și durata medie de deținere. Măsura bate declarația: cine se crede răbdător, dar închide câștigurile în 20 de minute, are o constrângere de temperament.
  - `match`: 4 profiluri scurte ↔ stilul exclus și motivul.
- **Try:** widget `constraints-matrix`. Sarcina: „Complete your own matrix and justify your top style.” Aplicația precompletează auditul din jurnal (S14, S15). Reușită: toate cele 8 rânduri completate; stilul ales e justificat cu cel puțin 2 constrângeri și cel puțin 1 comportament măsurat; fiecare stil exclus are un motiv. Indicii: 1. „Start with time windows; they rule out the most.” 2. „Use your journal numbers, not how you see yourself.”
- **Practică:** laboratorul unității, secțiunea 1.
- **Check:** (1) mcq: ce stil exclude un job cu ore fixe; (2) mcq: diferența dintre o constrângere declarată și una măsurată; (3) mcq: spre ce îndreaptă o toleranță mică la drawdown.
- **Dovezi:** C (euristică de practician, R6 §6.1), sprijinită pe comportament măsurat (R5 PSY-37; detectoarele S14).
- **Necesită:** S14 (auditul comportamental), S15
- **Termeni noi de glosar:** constraints-matrix, behaviour-audit

#### 4.6.2 · Choosing your market and your style
- **Nivel / durată / tip:** Professional · 7 min · Core
- **Obiective:**
  1. Compute a tradability ratio (ATR ÷ round-trip cost) and the share of a target eaten by costs.
  2. Match session windows to your time zone, including daylight-saving mismatch weeks.
  3. Pick one or two instruments that fit your constraints, jurisdiction and account size.
- **Concepte:** tradability-ratio (nou), cost-drag (2.9), fx-sessions (2.9), trading-costs ✓, volatility ✓, constraints-matrix (nou, din 4.6.1)
- **Se sprijină pe:** 4.6.1, 2.4 (ATR), 2.9 (sesiuni, zidul costurilor), 2.14 și 3.14 (instrumente)
- **Hook:** predict · alegere. „Which market is cheapest to trade relative to how much it moves? A: daily ATR 2.40, round-trip cost 0.20. B: ATR 1.50, cost 0.30. C: ATR 30.00, cost 1.50.” Răspuns: C (raport 20, față de 12 și 5).
- **Interacțiunea centrală:**
  - `worked` cu formula (R6 §6.2): raportul de tradabilitate = ATR ÷ (spread + comision pe dus-întors). A: 2.40 ÷ 0.20 = 12; B: 1.50 ÷ 0.30 = 5; C: 30.00 ÷ 1.50 = 20. Cursantul calculează B.
  - `worked`: partea din țintă mâncată de costuri pe stil, pe piața A (LABX: spread 0.10 + comision 0.05 pe fiecare parte = 0.20 dus-întors): scalping cu țintă 0.5 × ATR = 1.20 → 17% din țintă; swing cu țintă 2 × ATR = 4.80 → 4%. Stilurile scurte au nevoie de un edge brut mult mai mare (R6 §5.1).
  - `figure` (ceas pe fus orar, CET și EET): deschiderea indicilor UE 09:00 CET (10:00 EET); suprapunerea Londra–New York 14:00–18:00 CET (15:00–19:00 EET); deschiderea SUA 15:30 CET (16:30 EET); închiderea SUA 22:00 CET (23:00 EET). În săptămânile în care SUA și UE schimbă ora în date diferite, suprapunerea se mută cu o oră (R3 §3.2).
  - `match`: criteriile de alegere (R6 §6.2): lichiditate în orele tale; cost pe unitate de volatilitate; disponibilitate în jurisdicție (fără CFD-uri pentru rezidenții SUA; plafoanele ESMA); mărimea contractului față de cont (micro-urile există pentru asta); potrivirea cu sesiunea; corelația cu ce tranzacționezi deja; datele disponibile; un avantaj personal (cunoașterea unui sector sau a unei regiuni).
  - `callout`: începi cu unul sau două instrumente foarte lichide și le înveți „personalitatea” înainte să adaugi altele (R6 §6.2).
- **Try:** widget `tradability-scanner`. Sarcina: „From six instruments, choose two to specialise in, given your constraints matrix.” Reușită: ambele au raport ≥ 8, sunt disponibile în jurisdicția setată, se tranzacționează în fereastra ta de timp, iar corelația dintre ele e < 0.5. Indicii: 1. „Filter by your time window first.” 2. „Two highly correlated markets are one market.”
- **Practică:** S10: tabelul de specificații pe clase (forex, futures cu micro-contracte, CFD, acțiuni) cu raportul calculat live; laboratorul unității, secțiunea 2.
- **Check:** (1) numeric: raportul pentru ATR 0.0080 și cost 0.0002 (40); (2) mcq: de ce scalping-ul cere un raport mult mai mare decât swing-ul; (3) mcq: ce fereastră se potrivește cuiva din România liber între 15:00 și 19:00 EET (suprapunerea Londra–New York).
- **Dovezi:** Mechanic (aritmetica raportului și a costurilor); C pentru criteriile de alegere (euristici de practician, R6 §6.2).
- **Necesită:** S10 (specificații și tabelul de tradabilitate), S5 (fusuri orare, DST)
- **Termeni noi de glosar:** tradability-ratio, session-fit

#### 4.6.3 · Specialise before you diversify
- **Nivel / durată / tip:** Professional · 7 min · Core
- **Obiective:**
  1. Compute how many trades you need before an edge of a given size is distinguishable from zero.
  2. Prune a playbook to one or two setups using sample size and confidence intervals.
  3. Write a no-trade list and the condition for adding a second strategy.
- **Concepte:** specialisation (nou), playbook (2.13), expectancy ✓, base-rates ✓
- **Se sprijină pe:** 2.11 (IC al expectancy), 2.13 (playbook), 3.10 (semnificație), 4.6.2
- **Hook:** predict · alegere. „Trader A runs 6 setups on 5 markets. Trader B runs 1 setup on 2 markets. Both take 150 trades a year. Who learns faster whether their edge is real?” Răspuns: B (A are în medie 5 trade-uri pe combinație setup × piață).
- **Interacțiunea centrală:**
  - `worked` cu formula (R5 PM-13): trade-uri necesare pentru t ≈ 2: n = (2 × abaterea ÷ media)². Media 0.2R, abatere 1.5R → n = (2 × 1.5 ÷ 0.2)² = **225**. La 3 trade-uri pe săptămână: 75 de săptămâni, ≈ 1.5 ani pe un singur setup. Cursantul calculează săptămânile.
  - `explain` (R6 §6.3): un stil, unul sau două setup-uri, una sau două piețe până la un eșantion cu sens: cel puțin 100 de trade-uri, sau cel puțin 30 pentru strategiile lente (cu backtest în spate). Playbook-ul definește exact fiecare setup (capturi, reguli, statistici) și are o listă no-trade.
  - `match`: intrări din lista no-trade ↔ motiv („no trades in the 15 minutes before a tier-1 release”, „no new positions after the daily limit”, „no setups outside the playbook”, „no trading in the first 5 minutes of the open”).
  - `callout`: diversifici pe strategii doar când fiecare componentă are expectancy pozitivă și corelația dintre ele e mică (R6 §6.3).
- **Try:** widget `playbook-builder`. Sarcina: „Prune this seven-setup playbook to two, using the statistics table.” Tabelul: n, expectancy, IC 95% pentru fiecare setup. Reușită: păstrează cele două setup-uri cu cele mai mari limite inferioare ale IC dintre cele cu n ≥ 30 și marchează setup-urile cu n < 30 „not enough evidence”. Indicii: 1. „Rank by the lower end of the interval, not the average.” 2. „Small samples cannot carry a decision.”
- **Practică:** jurnalul propriu din Arena: aplicația grupează trade-urile pe setup × piață și arată câte celule au peste 30 de trade-uri; laboratorul unității, secțiunea 3.
- **Check:** (1) numeric: n pentru media 0.25R și abatere 1.5R (144); (2) mcq: ce e o listă no-trade; (3) mcq: când adaugi a doua strategie.
- **Dovezi:** Mechanic (mărimea eșantionului, R5 PM-13); C pentru regulile de practician (R6 §6.3).
- **Necesită:** S15 (statistici pe setup × piață, IC)
- **Termeni noi de glosar:** specialisation, no-trade-list, statistical-power

#### 4.6.4 · The development pipeline and kill criteria
- **Nivel / durată / tip:** Professional · 8 min · Core
- **Obiective:**
  1. Order the eight stages of a strategy's development pipeline and the gate at each stage.
  2. Write review and kill thresholds from a Monte Carlo drawdown distribution and an expectancy interval, before going live.
  3. Run a premortem on a strategy you are about to deploy.
- **Concepte:** development-pipeline (nou), kill-criteria (nou), kill-switch (3.11), premortem (3.11), incubation (3.11), monte-carlo-resampling (3.11)
- **Se sprijină pe:** 3.11 (Monte Carlo, incubare), 4.3.7, 4.5.6
- **Hook:** predict · alegere. „Your system is 11R below its peak. Its Monte Carlo puts the 95th-percentile drawdown at 13.5R and the 99th at 17R. What do you do?” Variante: stop now / keep trading as planned ✓ / double the size to recover / change the rules. Răspuns: drawdown-ul e în intervalul normal; pragurile au fost scrise înainte.
- **Interacțiunea centrală:**
  - `order` (R6 §6.4): 1. ipoteza, cu motivul economic (cine e de cealaltă parte); 2. regulile; 3. backtest cu costuri reale, out-of-sample, walk-forward și control R0; 4. robustețe (vecinătăți de parametri, alte piețe și perioade, Monte Carlo, drawdown în cel mai rău caz); 5. forward test în simulator pentru N trade-uri; 6. mărime live minimă; 7. scalare treptată; 8. monitorizarea decay-ului.
  - `worked` (sistemul de referință din R5: 40% × +2.5R, 60% × −1R; 10,000 de reamestecări): drawdown maxim median 8.5R, percentila 90 12R, 95 **13.5R**, 99 **17R** (R5 BT-13). Pragurile scrise înainte:
    - **review** (demotezi o etapă de capital și faci o revizuire completă): drawdown peste 13.5R, sau IC-ul expectancy-ului live include zero după cel puțin 50 de trade-uri;
    - **kill** (oprești live-ul): drawdown peste 17R, sau IC-ul expectancy-ului e în întregime sub zero, sau regimul pentru care a fost construit setup-ul nu mai apare (R5 BT-21; R6 §6.4).
    Cursantul completează pragurile pentru alt sistem din distribuția lui Monte Carlo.
  - `explain`: recapitulare din 3.11.10: kill switch-ul la percentila 99 și premortem-ul (R5 PSY-36). Pasul nou de aici: două trepte (review și kill), legate de etapele de capital (4.6.5), și mai multe strategii aflate simultan în etape diferite ale pipeline-ului.
  - `callout`: pragurile sunt numere, nu adjective. „If it feels broken” nu e un kill criterion.
- **Try:** widget `pipeline-board`. Sarcina: „Move four strategy cards through the pipeline: promote, hold, demote or kill each one according to its written criteria.” Cardurile au statistici live (drawdown curent, percentilele Monte Carlo, IC-ul expectancy-ului, numărul de trade-uri). Reușită: 4 din 4 decizii corecte. Indicii: 1. „Compare the drawdown with the written percentiles, not with your mood.” 2. „An interval that includes zero after 50 trades means review, not kill.”
- **Practică:** laboratorul unității, secțiunea 6; aceleași praguri se folosesc în capstone.
- **Check:** (1) mcq: etapa care testează execuția și psihologia reală (mărimea live minimă); (2) mcq: de ce kill criteria se scriu înainte; (3) mcq: drawdown 15R cu percentilele 13.5R și 17R (review, nu kill).
- **Dovezi:** Mechanic (procesul și percentilele Monte Carlo, R5 BT-13, BT-21); C pentru valorile exacte ale pragurilor (convenții de practician, R6 §6.4).
- **Necesită:** S13 (Monte Carlo, IC), S15 (statistici live), S18 (etape de capital)
- **Termeni noi de glosar:** development-pipeline, kill-criteria, review-trigger (premortem există de la 3.11)

#### 4.6.5 · Scaling up without blowing up
- **Nivel / durată / tip:** Professional · 7 min · Core
- **Obiective:**
  1. Define capital stages with promotion and demotion rules based on sample size, adherence and drawdown, not on profit alone.
  2. Apply drawdown-based de-risking and step-ups after new equity highs.
  3. Explain why full Kelly is a ceiling, not a target, and why size growth runs into market impact.
- **Concepte:** capital-staging (nou), kelly-criterion (3.12), position-sizing ✓, drawdown ✓, square-root-impact (nou, din 4.2.2)
- **Se sprijină pe:** 2.11 (heat, trepte de drawdown), 3.12 (Kelly), 4.2.2, 4.3.6, 4.6.4
- **Hook:** predict · numeric. „After a 10% drawdown the Turtles traded as if their account were 20% smaller. Your 10,000 account is now at 9,000. Under that rule, what is a 1% risk?” Răspuns: 80.00 (contul „notional” scade de la 10,000 la 8,000).
- **Interacțiunea centrală:**
  - `figure` (scară cu 5 trepte, R6 §6.5): simulator → mărime live minimă → 25% → 50% → 100% din mărimea țintă. Fiecare treaptă se deblochează cu un eșantion (de exemplu ≥ 50 de trade-uri pe treaptă), aderență ≥ 90% și drawdown în banda Monte Carlo. Un kill criterion te coboară o treaptă.
  - `worked`: Kelly ca plafon (R5 RF-13). Sistemul de referință: f* = W − (1 − W) ÷ b = 0.40 − 0.60 ÷ 2.5 = **16%**. ¼ Kelly = 4%, tot de 4 ori peste regula de 1%. 1% e ≈ 1/16 din Kelly: marja pentru erorile de estimare. Cursantul calculează f*.
  - `explain` (R6 §6.5): risc pe trade 0.25–1% pentru majoritatea traderilor retail; heat cap total ≈ 5–6%, cu pozițiile corelate numărate împreună; de-risking la drawdown (Turtles: contul notional −20% la fiecare −10% drawdown); creștere doar după noi maxime ale equity-ului, în pași de ≈ 25%.
  - `match`: patru greșeli ↔ de ce strică (mărire după pierdere = martingale; levier ca să repari performanța; scalare în instrumente nelichide = impact și capacitate; promovare pe P&L fără eșantion).
  - `callout` (realismul carierei, R6 §6.5): puțini traderi retail trăiesc din trading (Brazilia: 97% din day traderii persistenți au pierdut; Taiwan: sub 1% profitabili în mod previzibil). Venitul din trading e nesigur; economiile de urgență rămân separate; nu se tranzacționează cu bani împrumutați.
- **Try:** widget `capital-stages` („career mode”). Sarcina: „Write promotion and demotion rules for four stages and run them on a 300-trade history.” Reușită: regulile folosesc mărimea eșantionului, aderența și drawdown-ul (nu doar P&L-ul); nicio promovare imediat după o serie de pierderi; motorul confirmă că retrogradarea se declanșează la evenimentul de kill din istoric. Indicii: 1. „Promotion needs evidence, not a good week.” 2. „Demotion should be automatic.”
- **Practică:** „career mode” (R6 §6.5): o campanie de mai multe luni sintetice în care treptele de capital se deblochează doar prin criterii de proces; laboratorul unității, secțiunea 7.
- **Check:** (1) numeric: f* pentru W = 0.5 și b = 2 (25%); (2) mcq: când crești mărimea (după noi maxime și criteriile treptei); (3) mcq: de ce scalarea în instrumente nelichide erodează edge-ul.
- **Dovezi:** Mechanic (aritmetica sizing-ului, R5 RF-13); C pentru convențiile de practician (de-risking-ul Turtles, heat cap, trepte; R6 §6.5); A pentru ratele de bază ale carierei (R5 RR-02).
- **Necesită:** S15, S18 (etape de capital, „career mode”), S19 (impact la mărime mare)
- **Termeni noi de glosar:** capital-stages, notional-account, size-step-up

#### 4.6.6 · Keep improving: reviews, decay and the yearly decision
- **Nivel / durată / tip:** Professional · 7 min · Core
- **Obiective:**
  1. Tell decay from variance and regime change using a confidence interval and the Monte Carlo band.
  2. Change a rule only through a documented, evidence-based process.
  3. Run a yearly review that compares your net, risk-adjusted results with the passive benchmark and ends with a continue, reduce, retire or invest-passively decision.
- **Concepte:** continuous-improvement (nou), decay-vs-variance (nou), anomaly-decay (3.8), rule-change-governance (3.11), decision-quality ✓
- **Se sprijină pe:** 1.6 (greșeală vs varianță), 2.13 (recenzii), 3.11 (guvernarea regulilor), 3.13 (decay), 4.6.4
- **Hook:** predict · alegere. „Your system's expectancy fell from 0.30R to 0.12R over the last 80 trades. Is the edge decaying?” Variante: yes, clearly / no, impossible / can't tell yet: the interval still includes 0.30R ✓ / only if you feel it.
- **Interacțiunea centrală:**
  - `worked` (abaterea R-ului 1.5): eroarea standard = 1.5 ÷ √80 = 0.17; IC 95% = 0.12 ± 0.33 = **−0.21 la 0.45**. Intervalul include 0.30R, deci rezultatul e compatibil cu varianța. Se verifică și banda Monte Carlo a backtest-ului. Cursantul calculează intervalul.
  - `match`: trei diagnostice ↔ semne ↔ acțiune: varianță (în bandă, aderență bună → continui); decay (scădere persistentă pe mai multe ferestre, edge publicat, aglomerare → reduci, revalidezi); schimbare de regim (setup-ul pierde doar în regimul care s-a schimbat → filtru de regim testat out-of-sample) (R5 BT-22).
  - `order` (guvernarea regulilor, recapitulare din 3.11.10; R5 PL-14): ipoteză → prag de dovezi (≥ 30–50 de trade-uri sau backtest și walk-forward) → test în simulator → versiune nouă a planului, cu motivul scris.
  - `explain`: ritmul recenziilor: zilnic și săptămânal (2.13), lunar și trimestrial (R5 PL-12: distribuția R, MAE/MFE, expectancy pe setup cu IC, drawdown față de banda Monte Carlo), anual: rezultatul net și ajustat la risc față de benchmark-ul pasiv, reverificarea regulilor de reglementare și a costurilor (datele lor), decizia pentru anul următor.
  - `callout`: practica deliberată (R5 PSY-32): exersezi slăbiciunea măsurată în jurnal, nu ce îți place. McLean & Pontiff: presupune că și edge-ul tău va scădea.
- **Try:** widget `review-cockpit`. Sarcina: „Classify five changes in your statistics as variance, decay or regime change, and pick the action for each.” Reușită: ≥ 4 din 5. Indicii: 1. „Check the interval before you call it decay.” 2. „Split results by regime before changing rules.”
- **Practică:** o recenzie trimestrială pe jurnalul propriu din Arena (S15), cu formularul de propuneri de schimbare; laboratorul unității, secțiunea 8.
- **Check:** (1) numeric: IC pentru 0.15R pe 100 de trade-uri cu abatere 1.2R (−0.09 la 0.39); (2) mcq: ce trebuie să existe înainte de schimbarea unei reguli; (3) mcq: ce compară recenzia anuală.
- **Dovezi:** A pentru decay-ul edge-urilor publicate (McLean & Pontiff 2016; R6 §0.4; R5 BT-22); Mechanic pentru IC (R5 PM-13); practica recenziilor (R5 PL-12, PL-14).
- **Necesită:** S15 (recenzii, IC pe ferestre, segmentare pe regim), S13 (revalidare)
- **Termeni noi de glosar:** annual-review, rule-change-log, strategy-retirement, edge-decay

---
## Capstone-ul final · The summit

Etapa „Final” din README §5: o piață sintetică necunoscută, cu mai multe regimuri. Cursantul diagnostichează regimul, alege o strategie sau se abține, dimensionează, execută și raportează rezultatul după costuri față de benchmark. Predă și playbook-ul scris și statisticile validate. Construcția urmează R6 §7 (punctul 45), R3 §8.2 (capstone-ul „edge lab”) și R5 §10 (Level 4, punctul 29).

**Titlul în aplicație:** „The Summit: one unknown market, your whole process”.

### Ce cere înainte (pre-flight)

Capstone-ul nu pornește până când cursantul nu încarcă patru documente. Toate se construiesc în laboratoarele unităților 4.3 și 4.6; motorul le verifică formal (câmpuri completate, praguri numerice), nu calitativ.

| Document | Conținut minim | De unde vine |
|---|---|---|
| Playbook-ul | 1–3 setup-uri cu reguli exacte (condiție, trăgaci, stop, ieșire, mărime), regimul în care funcționează (matricea R6 §2.17), lista no-trade | 2.13, 4.6.3, laboratorul 4.6 |
| Dosarul de validare | pentru fiecare setup: N încercări, DSR, verificarea MinBTL, PBO, rezultatele OOS și walk-forward, distribuția Monte Carlo a drawdown-ului, capacitatea, reducerea pentru decay, verdictul „deploy to forward test” | 3.11, laboratorul 4.3 |
| Politica de risc | risc pe trade (≤ 1%), heat cap ajustat la corelație (≤ 6%), limite zilnice și săptămânale, trepte de drawdown, limită de ES dacă playbook-ul are opțiuni sau mai multe instrumente, pragurile de review și kill | 2.11, 4.4, 4.6.4 |
| Planul de diagnostic | ce măsuri observabile folosește pentru fiecare clasă de regim (de exemplu ADX, ATR relativ, structura swing-urilor, calendarul, curba futures, IV) și premortem-ul | 2.8, 3.11.10, 4.6.4 |

Un setup cu verdict „reject” sau „incubate” nu intră în playbook-ul de capstone. Dacă niciun setup nu are verdict „deploy”, cursantul poate rula capstone-ul doar cu strategia „no trade” și cu diagnosticul; vezi condițiile de trecere.

### Piața

- **Universul:** patru instrumente sintetice, cu etichetele de regim ascunse:
  - **LABX**: acțiune/indice, cu suprafață de opțiuni (R14);
  - **LABY**: corelat cu LABX, cu segmente în care perechea LABX/LABY e cointegrată (R7) și o ruptură structurală posibilă;
  - **LABF**: future cu curbă la termen (R9), expirări și roll;
  - **LABC**: pereche valutară cu carry (R8) și crash rar.
- **Durata:** 240 de zile de tranzacționare sintetice (≈ un an), jucate în 6 sesiuni de câte 40 de zile, cu timpul comprimat (≈ 20 de minute pe sesiune), plus 30–45 de minute pentru raport.
- **Regimurile:** generatorul trage, pentru fiecare instrument, o secvență de segmente de 10–30 de zile din R0–R14. Constrângeri pe fiecare rulare:
  - cel puțin 25% din zilele-instrument sunt **R0** (zgomot pur, aceeași volatilitate și același profil de sesiune): abținerea e decizia corectă;
  - cel puțin o criză **R12** comună tuturor instrumentelor (corelații spre 1, spread-uri × 4, marjă dublată, gap-uri prin stop-uri);
  - cel puțin două evenimente programate **R5** pe LABX, cu IV de eveniment pe suprafața R14;
  - cel puțin un segment **R4** (gap peste noapte) și unul **R3** (volatilitate în grupuri);
  - o derivă de calendar **R13** pe un singur instrument, prea mică pentru a fi tranzacționată fără un dosar validat;
  - straturile de microstructură (**R6** sesiune intraday, **R11** order book) apar când cursantul face zoom intraday; R10 nu e în univers.
- **Costurile:** spread, comision, swap și carry, roll, slippage dependent de regim (× 4 în R12), impact după legea rădăcinii pătrate dacă un ordin depășește 1% din volumul zilnic.
- **Benchmark-ul pasiv („the benchmark ghost”):** buy-and-hold ponderat egal pe LABX și LABF, fără levier, rebalansat lunar; alături, linia de cash.
- **Sămânța:** fiecare încercare are altă sămânță și alt amestec de regimuri; aceeași sămânță nu se refolosește.

### Ce face cursantul

1. **Diagnostichează.** La fiecare 10 zile sintetice (și oricând vrea), pentru fiecare instrument, alege o clasă de regim și o încredere (50–100%):

   | Clasă de diagnostic | Regimuri ascunse care îi corespund |
   |---|---|
   | Trend | R1 |
   | Range / mean reversion | R2; R7 (pe spread-ul perechii) |
   | Volatility expansion / crisis | R3 în faza volatilă, R4, R12 |
   | Scheduled event | R5 (fereastra evenimentului) |
   | Carry / curve | R8 calm, R9 |
   | No edge | R0; R13; faza calmă a lui R3 (se acceptă și „Range”) |

2. **Decide.** Alege un setup din playbook potrivit diagnosticului sau se abține. Opțiunile sunt permise doar dacă playbook-ul le conține (cere 4.1).
3. **Dimensionează.** După politica de risc; motorul verifică acuratețea riscului, heat-ul ajustat la corelație și ES-ul.
4. **Execută.** Cu ordinele din S1; ordinele mari trec printr-un algoritm de execuție (S19); halt-urile și licitațiile din S20 se aplică.
5. **Gestionează.** Stop-uri, ieșiri, limite zilnice; pragurile de review și kill se aplică automat, ca în 4.6.4.
6. **Jurnalizează.** Fiecare trade are setup-ul, clasa de regim diagnosticată, motivul și eventualele erori etichetate.

### Raportul final

Aplicația precompletează cifrele; cursantul scrie interpretarea. Secțiuni obligatorii:

1. **Rezultatul după costuri:** P&L net, P&L-ul benchmark-ului, diferența.
2. **Rezultatul ajustat la risc:** Sharpe pe randamentele zilnice cu interval de încredere de 95% (4.3.3), Sortino, drawdown maxim și durata lui, ES 95% istoric; aceleași cifre pentru benchmark.
3. **Cascada costurilor:** brut → spread → comision → swap, carry și roll → slippage → impact → net; costul ca procent din P&L-ul brut.
4. **Atribuirea pe regim:** P&L și R pe clasa diagnosticată și pe regimul real (dezvăluit la final); comportamentul în segmentele R0.
5. **Comparația cu gemenii aleatori:** percentila Sharpe-ului net între 1,000 de „gemeni” cu intrări aleatoare, aceeași expunere medie, aceeași durată de deținere și aceleași reguli de mărime (R5 BT-16; random-entry-benchmark de la 3.11).
6. **KPI-urile de proces:** stop integrity, acuratețea riscului, aderența la plan, respectarea heat-ului și a limitelor, costul erorilor în R, completitudinea jurnalului (R5 PM-17).
7. **Abaterile de la plan și evenimentele de review sau kill.**
8. **Declarația de incertitudine:** „What part of this result could be luck?”, cu intervalul Sharpe și percentila gemenilor.
9. **Decizia:** Live at minimum size / Not yet / Don't trade live, consecventă cu criteriile de la 4.5.6.

### Punctajul (100 de puncte)

Scorul urmează principiul 9 din README: procesul și riscul domină; rezultatul intră doar ajustat la risc, după costuri și comparat cu norocul.

| Componentă | Puncte | Cum se măsoară |
|---|---|---|
| Disciplina riscului și procesul | 30 | stop integrity, acuratețea riscului, heat ajustat la corelație, limite, respectarea pragurilor de review și kill, aderența la playbook, completitudinea jurnalului |
| Diagnosticul regimului | 20 | acuratețea față de etichetele ascunse (hazardul = 1/6 ≈ 17%) și calibrarea încrederii (scor Brier, comparat cu un predictor uniform) |
| Abținerea corectă | 15 | partea din zilele-instrument R0 fără risc nou (sau cu cel mult 0.25% risc pe instrument); niciun trade în afara playbook-ului |
| Evaluarea ajustată la risc, după costuri | 15 | 10 puncte pe percentila între gemenii aleatori (≥ 90: 10; 75–89: 7; 50–74: 4; < 50: 1); 5 puncte față de benchmark: Sharpe net peste Sharpe-ul benchmark-ului (3) și drawdown maxim sub al benchmark-ului (2) |
| Raportul și documentele | 20 | completitudine, consistență internă (motorul recalculează cifrele), onestitatea incertitudinii (intervalul Sharpe și percentila declarate corect), calitatea playbook-ului și a dosarului |

Profitul brut nu dă puncte. Un an sintetic e prea scurt ca un Sharpe să fie semnificativ (eroarea standard ≈ 1 pe un an, 4.3.3), de aceea comparația cu gemenii aleatori și cu benchmark-ul valorează doar 15 puncte.

### Condițiile de trecere

Capstone-ul e trecut când scorul e ≥ **70/100** și sunt îndeplinite toate porțile:

1. **Limitele:** zero depășiri ale limitei zilnice dure și ale pragului de kill. Dacă un prag de kill s-a declanșat, tranzacționarea s-a oprit exact cum scria în plan (poarta e trecută).
2. **Disciplina:** stop integrity ≥ 95%; acuratețea riscului ≥ 90%; heat-ul ajustat la corelație peste plafon cel mult o zi sintetică.
3. **Diagnosticul:** acuratețe ≥ 40% (peste dublul hazardului) și scor Brier mai bun decât predictorul uniform.
4. **Abținerea:** ≥ 70% din zilele-instrument R0 fără risc nou.
5. **Activitatea:** cel puțin 20 de trade-uri, ca procesul să poată fi măsurat. Excepție: dacă dosarul de validare a respins toate setup-urile, cursantul rulează capstone-ul cu „no trade”, diagnostichează toate cele 240 de zile și raportează decizia „Don't trade live”; atunci porțile 1, 2 și 5 nu se aplică, iar scorul se calculează doar din diagnostic, abținere și raport (55 de puncte posibile), rescalat la 100; pragul de trecere rămâne 70.
6. **Raportul:** toate cele 9 secțiuni completate, cu costuri, benchmark și declarația de incertitudine.
7. **Documentele:** playbook-ul și dosarul încărcate; cel puțin 90% din trade-uri etichetate cu un setup din playbook.

**Nu se cere:** P&L pozitiv sau batere a benchmark-ului. Un cursant care se abține des, pierde puțin după costuri, raportează onest și ajunge la „Don't trade live” poate trece. E un rezultat valid al cursului (README §1, principiul 8).

**Insigna:** „Summit”. Varianta „with distinction” cere scor ≥ 85, cel puțin 27/30 la proces și acuratețea diagnosticului ≥ 50%. Nu depinde de profit.

**Reluarea:** după 24 de ore, cu altă sămânță. Contează cea mai bună încercare; toate încercările rămân în istoric.

### Ce vede cursantul la final

- Cronologia regimurilor reale, lângă etichetele lui.
- Curba de equity lângă benchmark și lângă evantaiul celor 1,000 de gemeni aleatori.
- Cascada costurilor și tabloul KPI-urilor de proces.
- Unealta de decizie de la 4.5.6, rulată pe datele capstone-ului.
- Mesajul permanent (R5 RR-07): „Simulator results do not predict live profitability.”

### Necesită

S1, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S19, S20 (S18 opțional, pentru politica de etape de capital). Generatorul de regimuri cu toate R0–R14 (README §7) și înregistrarea etichetelor ascunse pentru dezvăluirea de la final.

### Surse

README §5; R6 §7 (punctul 45), §0.5 (primitivele de scor, inclusiv „abstain when no edge”), §2.17; R3 §8.2 (Capstone), Appendix A6 (etichete ascunse, dezvăluire); R5 §10 (Level 4, punctul 29), PM-07, PM-16, PM-17, BT-16, RR-07.

---

## De verificat și întrebări deschise

**Decizii de confirmat înainte de scripturi:**
1. **Multiplicatorul opțiunilor LABX = 10 unități.** Alternativa realistă e 100, dar atunci un singur contract ATM (286.00 vUSD) depășește bugetul de 1% al contului de 10,000.
2. **r = 0 implicit, spread pe opțiuni 0.10 (0.40 în R12), comision 0 pe opțiuni.** Simplificări de simulator; de confirmat cu echipa de motor.
3. **4.1 are 11 lecții** (nivelul are 43, cursul ≈ 341). README §2–§3 trebuie actualizat dacă propunerea e acceptată.
4. **Extensiile de capabilități** (tabelul din „Capabilitățile de simulator folosite”) nu sunt încă în README §8: profiluri de broker (S8), selector de jurisdicție (S11), jurnal imutabil cu DSR/MinBTL/CSCV/purged CV (S13), „career mode” (S18), prognoza corelațiilor (S15). De decis dacă devin coduri noi (S21+) sau rămân extensii.
5. **Convenții ale aplicației, nu standarde:** pragurile PBO (0.20 / 0.50), reducerea pentru decay de 50% la ideile publicate, pragul DSR de 0.95, treptele review/kill la percentilele 95/99, ponderile și pragurile capstone-ului (40% diagnostic, 70% abținere, 20 de trade-uri, 70/100). Pragurile capstone-ului trebuie calibrate cu rulări de „cursanți” aleatori și disciplinați înainte de lansare.
6. **Tabelul de trecere a evaluărilor de prop (4.5.3)** e o simulare cu presupuneri explicite (3 trade-uri pe zi, cel mult 60 de zile pe fază, risc fix pe soldul inițial, 20,000 de rulări). FTMO ar fi eliminat limitele de timp; motorul S18 trebuie să reproducă tabelul și să-l recalculeze pe trade-urile cursantului.

**Fapte de verificat la sursa oficială (README §12):**
7. Înlocuirea regulii PDT: aprobarea SEC (14 sau 15 aprilie 2026), intrarea în vigoare pe 4 iunie 2026, tranziția până la 20 octombrie 2027, detaliile regimului de marjă intraday (R6 §0.2, §3.1; R1 §1.7; R5 RR-05).
8. Plafoanele schemelor de compensare: FSCS £85,000, minimul UE €20,000, schema din România (Fondul de Compensare a Investitorilor) și plafonul ei. SIPC ($500,000 / $250,000 cash) vine din sursa oficială citată în R6 §8.1.
9. Eliminarea PFOF în UE (excepții până la 30.06.2026), T+1 în UE (octombrie 2027), T+1 în SUA (mai 2024), plafoanele FX retail din SUA (50:1 / 20:1).
10. Regulile FTMO și Topstep (se schimbă des; R6 §8.3), cifrele cazului My Forex Funds și relatarea respingerii din mai 2025 (sursă: apărarea).
11. Tratamentul fiscal în România pentru brokeri români și străini după schimbările din 2025–2026 și termenul legal de păstrare a evidențelor; exemplele SUA și UK din 4.5.5 [PK].
12. Fapte [PK] sau [BK] folosite în exemple: multiplicatorul de 100 al opțiunilor din SUA, stilurile american și european (SPX), definiția VIX, istoria Cboe BXM, MF Global și PFG, WTI −37 (aprilie 2020), yen carry unwind (august 2024), pinning-ul (Ni, Pearson & Poteshman 2005), fereastra fix-ului WM/Reuters, purged CV (López de Prado 2018), Moreira & Muir (2017), forma formulei PSR.

**Alinierea id-urilor cu nivelurile 1–3:**
13. Id-urile marcate (N.U) au fost aliniate cu ciornele existente ale nivelurilor 2 și 3 la 22.10.2026 (de exemplu implied-move și iv-crush la 3.8, multiple-testing și sharpe-ratio la 3.10, research-log, kill-switch și premortem la 3.11, volatility-targeting la 3.12, broker-models și adverse-selection la 3.2, anomaly-decay la 3.8). Rămân de confirmat, pentru că unitățile lor nu erau încă scrise: daily-loss-limit și risk-capital (1.4), scam-red-flags (1.8), effective-number-of-bets și drawdown-tiers (2.11), playbook (2.13), negative-balance-protection (2.14), vwap (2.5), pending-order-straddle (3.7), carry (3.13).
14. Termenii de glosar ai acestui nivel trebuie verificați contra registrelor finale ale nivelurilor 1–3; candidații probabili la duplicare: arbitrage, beta, counterparty-risk, opportunity-cost, risk-free-rate, pattern-day-trader, prop-firm, funded-account, profit-target, trailing-drawdown, effective-number-of-bets, cross-validation, data-leakage.
15. Dacă unitatea 2.11 introduce deja „challenge mode” (S18 apare la nivelul 2 în README §8), conceptul prop-evaluation-rules (4.5.3) devine recapitulare, iar 4.5.3 se concentrează pe tabelul de trecere și pe diferențele dintre firme.

---
## Registru de concepte noi

Conceptele introduse la Nivelul 4, în ordinea lecțiilor. Nume și definiții în engleză, ca în `concepts.ts`. Conceptele din nivelurile 1–3 folosite aici apar în fișe cu marcajul (N.U) și nu se repetă în registru.

| Id | English name | Definition | Lecția |
|---|---|---|---|
| option-contract | Call and put options | A contract giving the buyer the right, not the obligation, to buy (call) or sell (put) at a set price until expiry. | 4.1.1 |
| option-moneyness | Moneyness, intrinsic and extrinsic value | Whether an option is in, at or out of the money, and how its premium splits into intrinsic and time value. | 4.1.1 |
| option-payoff | Option payoff at expiry | The profit or loss of an option position at expiry as a function of the underlying price, with its breakevens. | 4.1.2 |
| exercise-and-assignment | Exercise and assignment | The holder using the option's right and the writer being obliged to deliver; American versus European timing. | 4.1.2 |
| put-call-parity | Put-call parity | The no-arbitrage link C − P = S − K·e^(−rT) between European calls, puts, the underlying and cash. | 4.1.3 |
| synthetic-position | Synthetic positions | Combinations of options, underlying and cash that replicate another position's payoff, such as a synthetic long. | 4.1.3 |
| option-pricing-model | Option pricing inputs (Black–Scholes) | How price, strike, time, volatility and rates set an option's value, and where the model's assumptions fail. | 4.1.4 |
| option-delta | Delta | The change in an option's price for a one-unit move in the underlying; also its hedge ratio. | 4.1.5 |
| option-gamma | Gamma | The change in delta for a one-unit move in the underlying; largest at the money near expiry. | 4.1.5 |
| delta-hedging | Delta hedging | Offsetting an options position's delta with the underlying so small price moves leave the combined value flat. | 4.1.5 |
| option-theta | Theta | The value an option loses per day as time passes, all else equal. | 4.1.6 |
| option-vega | Vega | The change in an option's price for a one-point change in implied volatility. | 4.1.6 |
| gamma-theta-tradeoff | Gamma–theta trade-off | Long options pay time decay to own gamma and profit only if realised volatility exceeds implied volatility. | 4.1.6 |
| implied-volatility | Implied volatility | The volatility that makes a pricing model match an option's market price: the market's forecast plus a premium. | 4.1.7 |
| volatility-surface | Volatility surface | Implied volatility across strikes (skew) and expiries (term structure), including event-driven bumps. | 4.1.7 |
| covered-call | Covered call | Long underlying plus a short call: collects premium, caps the upside and keeps nearly all of the downside. | 4.1.8 |
| protective-put | Protective put | Long underlying plus a long put: a paid floor on losses that also holds through gaps. | 4.1.8 |
| option-collar | Collar | Long underlying, long put and short call: a capped range of outcomes, often at near-zero net cost. | 4.1.8 |
| vertical-spread | Vertical spreads | Buying and selling options of the same type and expiry at two strikes, with defined maximum gain and loss. | 4.1.9 |
| long-volatility | Long volatility (straddles and strangles) | Owning options on both sides to profit from a move larger than the one already priced in. | 4.1.10 |
| volatility-risk-premium | Volatility risk premium | The tendency of implied volatility to exceed later realised volatility, which pays option sellers on average. | 4.1.11 |
| short-volatility-risk | Short-volatility tail risk | Selling options earns small, steady gains with rare, very large losses, so size comes from stress, not premium. | 4.1.11 |
| implementation-shortfall | Implementation shortfall | The full cost of executing a decision versus the decision price: delay, spread, impact, fees and missed fills. | 4.2.1 |
| market-impact | Market impact | The price move caused by your own trading, split into a temporary and a permanent part. | 4.2.1 |
| square-root-impact | Square-root impact law | Impact grows roughly with volatility times the square root of order size over daily volume. | 4.2.2 |
| execution-algorithm | Execution algorithms | Rules that slice a parent order over time or volume, such as TWAP, VWAP, POV and implementation shortfall. | 4.2.3 |
| impact-timing-tradeoff | Impact versus timing risk | Trading faster raises market impact; trading slower leaves the unfilled part exposed to price moves. | 4.2.3 |
| latency-arbitrage | Latency and stale quotes | Faster traders execute against resting orders whose prices have not yet caught up with new information. | 4.2.4 |
| trading-halts | Halts, LULD and circuit breakers | Rules that pause or stop trading after large moves and reopen through auctions, where stops can fill far away. | 4.2.5 |
| liquidity-clock | Liquidity clock | Scheduled windows (fixes, month-end, closing auctions, expiries) where volume and spreads change for mechanical reasons. | 4.2.6 |
| option-pinning | Option pinning | The tendency of prices to settle near strikes with large open interest on expiry days. | 4.2.6 |
| reality-check-testing | Testing the winner of a search | Judging the best of many tried rules against the best result expected with no edge (Reality Check, SPA, haircuts). | 4.3.1 |
| deflated-sharpe-ratio | Deflated Sharpe ratio | The probability that a strategy's true Sharpe beats the best Sharpe expected by luck from all the trials run. | 4.3.2 |
| probabilistic-sharpe-ratio | Probabilistic Sharpe ratio | The probability that the true Sharpe exceeds a benchmark, given track length, skewness and kurtosis. | 4.3.2 |
| minimum-backtest-length | Minimum backtest length | The data length needed so the best of N zero-edge trials is not expected to reach a target Sharpe by luck. | 4.3.3 |
| sharpe-ratio-uncertainty | Sharpe ratio error bars | The confidence interval around a measured Sharpe ratio, which narrows only with the square root of track length. | 4.3.3 |
| backtest-overfitting-probability | Probability of backtest overfitting | The share of in-sample/out-of-sample splits in which the in-sample winner ranks below the median out of sample. | 4.3.4 |
| purged-cross-validation | Purged cross-validation | Time-series cross-validation that removes overlapping labels and adds an embargo so test information cannot leak into training. | 4.3.5 |
| strategy-capacity | Strategy capacity | The size at which market impact erodes an edge; total profit peaks well before the edge reaches zero. | 4.3.6 |
| research-hygiene | Validation dossier and pre-registration | Fixing thresholds, haircuts and verdict criteria before out-of-sample results, then reporting every trial in a fixed dossier. | 4.3.7 |
| value-at-risk | Value at Risk | The loss threshold exceeded with a given small probability over a given horizon; not a maximum loss. | 4.4.1 |
| expected-shortfall | Expected Shortfall | The average loss beyond the VaR threshold; a better measure of tail risk than VaR. | 4.4.1 |
| portfolio-volatility-targeting | Book-level volatility targeting | Scaling a whole book to a volatility target from forecast volatilities and correlations, within caps. | 4.4.2 |
| gross-and-net-exposure | Gross and net exposure | Gross exposure sums absolute positions, net exposure sums signed ones; a book needs limits on both. | 4.4.3 |
| beta-adjusted-exposure | Beta-adjusted exposure | Net exposure with each position weighted by its sensitivity to the market. | 4.4.3 |
| risk-parity | Risk parity | Weighting assets so each contributes equally to portfolio risk, often with leverage to reach a return target. | 4.4.4 |
| risk-contribution | Risk contribution | The share of total portfolio volatility that comes from one position, given weights, volatilities and correlations. | 4.4.4 |
| portfolio-stress-testing | Portfolio stress testing | Revaluing a book under historical or hypothetical extreme scenarios, including slower exits and higher margins. | 4.4.5 |
| reverse-stress-test | Reverse stress test | Finding the market move that would cause a chosen loss, instead of the loss from a chosen move. | 4.4.5 |
| correlation-regimes | Correlation regimes | Correlations change with the regime and rise toward one in crises, shrinking the effective number of bets. | 4.4.6 |
| regulatory-perimeter | Regulators and jurisdiction | Which authority supervises which firm and product where you live, and how to verify a licence. | 4.5.1 |
| us-intraday-margin | US intraday margin regime (2026) | The FINRA regime that replaced the pattern day trader rule from 4 June 2026, built on intraday margin deficits. | 4.5.1 |
| client-categorisation | Retail and professional clients | MiFID II client categories; opting up to professional removes retail protections such as leverage caps. | 4.5.1 |
| client-money-protection | Client money protection | Segregation of client funds and compensation schemes that pay if a firm fails, never for trading losses. | 4.5.2 |
| prop-evaluation-rules | Prop evaluation rules | Targets, daily and maximum loss limits (static or trailing), consistency and minimum-day rules of funded-trader challenges. | 4.5.3 |
| prop-challenge-ev | Expected value of an evaluation | Pass probability times expected payouts minus fees; negative for most participants. | 4.5.4 |
| tax-awareness | Tax awareness | Knowing that tax treatment varies by country, product and account type, and where to get an authoritative answer. | 4.5.5 |
| trade-records | Trade records | The complete log of trades, fees, financing, currency conversions and cash movements needed for review and tax. | 4.5.5 |
| go-live-criteria | Go-live criteria | Written conditions on evidence, process, capital, broker and expectations that must hold before trading real money. | 4.5.6 |
| no-trade-conditions | When not to trade | Personal, market, process and financial states in which standing aside is the correct decision. | 4.5.7 |
| constraints-matrix | Constraints matrix | Mapping time, capital, jurisdiction, drawdown tolerance, skills and temperament to the styles they allow or rule out. | 4.6.1 |
| behaviour-audit | Behaviour audit | Measured habits from your own journal (overtrading, revenge trades, moved stops, holding time) used to choose a style. | 4.6.1 |
| tradability-ratio | Tradability ratio | Average true range divided by round-trip cost; a quick measure of how cheaply a market can be traded. | 4.6.2 |
| specialisation | Specialisation | Trading one style, few setups and few markets until the sample is large enough to judge the edge. | 4.6.3 |
| development-pipeline | Development pipeline | The staged path from hypothesis to backtest, robustness, forward test, small live size, scaling and decay monitoring. | 4.6.4 |
| kill-criteria | Review and kill criteria | Numeric thresholds written in advance that demote or stop a strategy when results leave the expected range. | 4.6.4 |
| capital-staging | Capital stages | Raising size in steps unlocked by sample size, adherence and drawdown, and cutting it automatically on breaches. | 4.6.5 |
| continuous-improvement | Continuous improvement | A review cycle from daily to yearly, with evidence-based rule changes and a yearly continue, reduce or retire decision. | 4.6.6 |
| decay-vs-variance | Decay versus variance | Telling a fading edge from normal luck or a regime change with confidence intervals and Monte Carlo bands. | 4.6.6 |

**Total: 70 de concepte noi** (4.1: 22; 4.2: 9; 4.3: 9; 4.4: 10; 4.5: 11; 4.6: 9).

## Termeni noi de glosar

Definiții simple, în engleză, de cel mult 20 de cuvinte, ca în câmpul `plain` din `glossary.ts`. Termenii care există deja din nivelurile 1–3 sunt notați în fișe („există de la N.U”) și nu apar aici.

| Id | Term | Plain-English definition |
|---|---|---|
| option | Option | A contract giving the buyer a right, but not an obligation, to trade an asset at a set price. |
| call-option | Call option | The right to buy the underlying at the strike price until or at expiry. |
| put-option | Put option | The right to sell the underlying at the strike price until or at expiry. |
| strike-price | Strike price | The price at which an option lets you buy or sell the underlying. |
| expiration-date | Expiration date | The last day an option can be exercised; after it, the option is settled or worthless. |
| option-premium | Option premium | The price the option buyer pays and the seller receives. |
| in-the-money | In the money | An option with intrinsic value: a call with a strike below the price, a put above it. |
| at-the-money | At the money | An option whose strike is at or very near the current price. |
| out-of-the-money | Out of the money | An option with no intrinsic value: a call with a strike above the price, a put below it. |
| intrinsic-value | Intrinsic value | What an option would be worth if exercised right now; never below zero. |
| extrinsic-value | Extrinsic value | The part of the premium above intrinsic value, paid for time and volatility. Also called time value. |
| payoff-diagram | Payoff diagram | A chart of a position's profit or loss at expiry across possible prices of the underlying. |
| option-breakeven | Option breakeven | The underlying price at expiry where an option position neither gains nor loses, premium included. |
| option-writer | Option writer | The seller of an option, who receives the premium and takes on the obligation. |
| exercise | Exercise | Using an option's right to buy or sell the underlying at the strike. |
| assignment | Assignment | The notice that obliges an option writer to deliver or take the underlying at the strike. |
| american-option | American option | An option that can be exercised on any day up to expiry. |
| european-option | European option | An option that can be exercised only at expiry. |
| pin-risk | Pin risk | Not knowing whether you will be assigned when the price ends right at a short option's strike. |
| put-call-parity | Put-call parity | The fixed link between call, put, underlying and cash prices that rules out riskless profit. |
| synthetic-position | Synthetic position | A mix of options, underlying and cash that copies another position's payoff. |
| arbitrage | Arbitrage | Locking in a riskless profit from inconsistent prices; in liquid markets it disappears almost instantly. |
| risk-free-rate | Risk-free rate | The interest earned on cash with no default risk; one input to option prices. |
| cash-secured-put | Cash-secured put | Selling a put while holding enough cash to buy the underlying if assigned. |
| black-scholes | Black–Scholes model | A formula that prices European options from price, strike, time, volatility and interest rate. |
| time-to-expiry | Time to expiry | The time left until an option expires, measured in years in pricing formulas. |
| greeks | Greeks | Measures of how an option's price reacts to changes in price, time, volatility and rates. |
| delta | Delta | How much an option's price changes when the underlying moves by one unit. |
| gamma | Gamma | How much delta changes when the underlying moves by one unit. |
| delta-neutral | Delta neutral | A position whose value barely changes for small moves in the underlying. |
| delta-hedging | Delta hedging | Trading the underlying to keep an options position delta neutral as prices move. |
| 0dte-option | 0DTE option | An option that expires on the same day it is traded; its price swings violently. |
| theta | Theta | How much value an option loses per day as time passes. |
| vega | Vega | How much an option's price changes when implied volatility moves one percentage point. |
| rho | Rho | How much an option's price changes when interest rates move one percentage point. |
| time-decay | Time decay | The loss of an option's extrinsic value as expiry approaches; fastest near the end. |
| realized-volatility | Realised volatility | How much the price actually moved over a period, measured from past returns. |
| gamma-scalping | Gamma scalping | Re-hedging a long options position again and again to capture gains from price swings. |
| volatility-skew | Volatility skew | Different implied volatilities across strikes of one expiry, often higher for downside puts. |
| volatility-smile | Volatility smile | A skew where both far-out puts and far-out calls carry higher implied volatility. |
| iv-term-structure | IV term structure | Implied volatility across expiries; usually rising with time, inverted in crises. |
| volatility-surface | Volatility surface | Implied volatility across all strikes and expiries, shown as a single map. |
| iv-rank | IV rank | Where current implied volatility sits within its past year's range; context, not a signal. |
| covered-call | Covered call | Owning the underlying and selling a call on it to collect premium, which caps the upside. |
| protective-put | Protective put | Owning the underlying and buying a put to set a floor under losses. |
| collar | Collar | Owning the underlying, buying a put and selling a call to limit both losses and gains. |
| vertical-spread | Vertical spread | Buying one option and selling another of the same type and expiry at a different strike. |
| debit-spread | Debit spread | A vertical spread you pay for; the most you can lose is what you paid. |
| spread-width | Spread width | The distance between the two strikes of a spread; it caps gains and losses. |
| defined-risk | Defined risk | A position whose maximum possible loss is known before you enter. |
| strangle | Strangle | Buying an out-of-the-money call and put; cheaper than a straddle but needs a bigger move. |
| long-volatility | Long volatility | A position that profits when prices move more than options imply. |
| event-volatility | Event volatility | Extra implied volatility priced into options that expire just after a scheduled event. |
| volatility-risk-premium | Volatility risk premium | The average gap by which implied volatility exceeds the volatility that later occurs. |
| short-volatility | Short volatility | A position that profits when prices move less than options imply; exposed to sudden spikes. |
| iron-condor | Iron condor | Selling a strangle and buying further-out options as wings, so the maximum loss is capped. |
| tail-risk | Tail risk | The risk of rare, extreme losses far beyond normal day-to-day moves. |
| implementation-shortfall | Implementation shortfall | The full cost of executing a trade compared with the price when you decided to trade. |
| decision-price | Decision price | The market price at the moment you decided to trade. |
| arrival-price | Arrival price | The market price when your order reaches the market. |
| opportunity-cost | Opportunity cost | The gain you missed on the part of an order that never got filled. |
| parent-order | Parent order | A large order that an algorithm splits into many smaller orders. |
| child-order | Child order | One of the small orders sent to the market to fill a parent order. |
| temporary-impact | Temporary impact | The part of your price impact that fades after you stop trading. |
| permanent-impact | Permanent impact | The part of your price impact that stays, because the market learned something from your trades. |
| square-root-law | Square-root law | Market impact grows with the square root of order size relative to daily volume. |
| participation-rate | Participation rate | Your traded volume as a share of the market's volume over the same period. |
| execution-algorithm | Execution algorithm | A set of rules that splits and times an order to reduce trading cost. |
| twap | TWAP | Time-weighted average price: an algorithm that trades equal slices at equal time intervals. |
| vwap-algorithm | VWAP algorithm | An algorithm that trades in step with the market's expected volume through the day. |
| pov-algorithm | POV algorithm | Percentage of volume: an algorithm that trades a fixed share of market volume. |
| timing-risk | Timing risk | The risk that price moves against you while part of your order is still unfilled. |
| information-leakage | Information leakage | When the pattern of your orders lets others guess your intentions and trade ahead. |
| latency | Latency | The delay between an event and your order's arrival at the market. |
| stale-quote | Stale quote | A resting order whose price no longer reflects the latest information. |
| co-location | Co-location | Placing trading servers next to an exchange's matching engine to cut latency. |
| trading-halt | Trading halt | A pause in trading of an instrument, often for pending news or extreme moves. |
| circuit-breaker | Circuit breaker | A market-wide halt triggered by a large index fall, such as 7%, 13% or 20%. |
| limit-up-limit-down | Limit up–limit down | A US rule that pauses a stock when its price reaches bands around a recent reference price. |
| reopening-auction | Reopening auction | The single-price auction that restarts trading after a halt; stops may fill at its price. |
| volatility-auction | Volatility auction | A short auction that replaces a trade when the price would jump too far. |
| benchmark-fix | Benchmark fix | A reference price set in a short daily window, such as the 4 pm London FX fix. |
| month-end-rebalancing | Month-end rebalancing | Large mechanical trades by funds at month or quarter end to restore their target weights. |
| witching-day | Witching day | A quarterly day when many futures and options expire together, lifting volume. |
| option-pinning | Option pinning | A price's tendency to finish near a strike with large open interest at expiry. |
| family-wise-error-rate | Family-wise error rate | The chance of at least one false discovery across a whole set of tests. |
| reality-check | Reality Check | White's bootstrap test of whether the best of many rules truly beats a benchmark. |
| spa-test | SPA test | Hansen's Superior Predictive Ability test, a refinement of the Reality Check. |
| sharpe-haircut | Sharpe haircut | A cut to a backtest's Sharpe ratio that accounts for how many tests were tried. |
| expected-maximum-sharpe | Expected maximum Sharpe | The best Sharpe ratio you would expect from N trials with no edge, by luck alone. |
| probabilistic-sharpe-ratio | Probabilistic Sharpe ratio | The probability that a strategy's true Sharpe ratio is above a chosen benchmark. |
| deflated-sharpe-ratio | Deflated Sharpe ratio | A probabilistic Sharpe ratio corrected for the number of trials and for non-normal returns. |
| selection-bias | Selection bias | Distortion that comes from keeping only the best-looking results out of many. |
| minimum-backtest-length | Minimum backtest length | How many years of data a backtest needs before its Sharpe beats what luck gives N trials. |
| sharpe-standard-error | Sharpe standard error | The typical error of a measured Sharpe ratio; it shrinks with the square root of years. |
| track-record-length | Track record length | How long results have been measured; longer records give tighter estimates. |
| probability-of-backtest-overfitting | Probability of backtest overfitting | How often the best in-sample variant ranks below the median out of sample. |
| cscv | CSCV | Combinatorially symmetric cross-validation: tests every split of data blocks into in-sample and out-of-sample halves. |
| strategy-family | Strategy family | All the variants of one idea tried during research, such as every parameter setting. |
| cross-validation | Cross-validation | Testing a model, in turns, on parts of the data it was not fitted on. |
| data-leakage | Data leakage | Information from the test period slipping into training, so results look better than they are. |
| purging | Purging | Removing training observations whose labels overlap the test period. |
| embargo-period | Embargo period | A gap after the test period kept out of training to block leakage through autocorrelation. |
| strategy-capacity | Strategy capacity | The trading size a strategy can carry before costs and impact remove its edge. |
| marginal-profit | Marginal profit | The extra profit from trading one more unit; capacity is reached when it falls to zero. |
| trial-count | Trial count | The number of variants and tests tried; every honest backtest report states it. |
| validation-dossier | Validation dossier | A fixed-format report of all tests, thresholds and the verdict for one strategy. |
| decay-haircut | Decay haircut | A planned cut to backtest expectancy that allows for edges weakening after discovery. |
| value-at-risk | Value at Risk (VaR) | A loss level exceeded only with a small probability, such as 5%, over a set period. |
| expected-shortfall | Expected Shortfall (ES) | The average loss on the worst days beyond the VaR level. |
| confidence-level | Confidence level | The probability, such as 95% or 99%, that a VaR threshold is not exceeded. |
| var-exceedance | VaR exceedance | A day whose loss is larger than the VaR estimate. |
| var-backtest | VaR backtest | Checking whether VaR exceedances happen about as often as the model says they should. |
| student-t-distribution | Student-t distribution | A bell-shaped distribution with fatter tails than the normal, used to model extreme moves. |
| portfolio-volatility | Portfolio volatility | The volatility of a whole book; it depends on weights, volatilities and correlations. |
| exposure-multiplier | Exposure multiplier | The factor that scales a book's exposure: target volatility divided by forecast volatility. |
| leverage-cap | Leverage cap | A limit on how far a volatility target may scale exposure up. |
| ewma-volatility | EWMA volatility | A volatility estimate that weighs recent returns more than older ones. |
| gross-exposure | Gross exposure | The sum of all position sizes, with longs and shorts both counted as positive. |
| net-exposure | Net exposure | Longs minus shorts: the book's overall directional position. |
| beta | Beta | How much a position tends to move when the market moves by 1%. |
| beta-adjusted-exposure | Beta-adjusted exposure | Net exposure with each position multiplied by its beta. |
| market-neutral | Market neutral | A book whose net or beta-adjusted exposure is close to zero. |
| leg-risk | Leg risk | The risk that one side of a paired position moves against the other. |
| risk-parity | Risk parity | Sizing assets so each one contributes the same share of total portfolio risk. |
| risk-contribution | Risk contribution | The part of a portfolio's total risk that comes from one position. |
| risk-budget | Risk budget | The share of total risk you allow each position, strategy or asset class to use. |
| inverse-volatility-weighting | Inverse-volatility weighting | Weighting each asset by one over its volatility, so calmer assets get larger weights. |
| reverse-stress-test | Reverse stress test | Working backwards from a chosen loss to the market move that would cause it. |
| historical-scenario | Historical scenario | A stress test that replays a past crisis, such as the 2010 flash crash, on today's book. |
| hypothetical-scenario | Hypothetical scenario | A stress test built from an imagined shock, such as a 20% gap with doubled margins. |
| correlation-regime | Correlation regime | A period with a typical correlation pattern; in crises correlations move toward one. |
| effective-number-of-bets | Effective number of bets | How many independent positions a book really holds once correlations are counted. |
| financial-regulator | Financial regulator | A public authority that licenses and supervises firms offering investment and trading services. |
| mifid-ii | MiFID II | The EU law framework for investment services, client protection and market conduct. |
| sec | SEC | The US Securities and Exchange Commission, the main regulator of US securities markets. |
| cftc | CFTC | The US Commodity Futures Trading Commission, which regulates futures and retail FX. |
| nfa | NFA | The US National Futures Association, the self-regulatory body for futures and retail FX firms. |
| passporting | Passporting | An EU firm licensed in one member state offering its services in others. |
| retail-client | Retail client | The default client category, with the strongest protections, such as leverage caps. |
| professional-client | Professional client | A client category with fewer protections; retail clients can opt up only if they meet set criteria. |
| appropriateness-test | Appropriateness test | A broker's check that you understand a complex product's risks before you can trade it. |
| pattern-day-trader | Pattern day trader | A former US label for frequent day traders, with a $25,000 minimum; replaced in June 2026. |
| client-money-segregation | Client money segregation | Keeping clients' funds apart from the broker's own money, so they are protected if it fails. |
| investor-compensation-scheme | Investor compensation scheme | A fund that repays clients, up to a limit, when a regulated firm fails; not for trading losses. |
| sipc | SIPC | The US Securities Investor Protection Corporation; up to $500,000 per customer if a broker-dealer fails. |
| fscs | FSCS | The UK Financial Services Compensation Scheme, which repays clients of failed UK firms up to a limit. |
| hybrid-broker | Hybrid broker | A broker that takes the other side of most clients but passes some, often winners, to the market. |
| asymmetric-slippage | Asymmetric slippage | Passing only unfavourable slippage on to clients while keeping the favourable part; a red flag. |
| prop-firm | Prop firm | A proprietary trading firm; today often a firm that sells paid evaluations on simulated accounts. |
| evaluation-challenge | Evaluation challenge | A paid test with profit targets and loss limits that decides whether you get a funded account. |
| funded-account | Funded account | The account you get after passing an evaluation; often still simulated, with a profit split. |
| profit-target | Profit target | The gain an evaluation requires before you pass a phase. |
| trailing-drawdown | Trailing drawdown | A loss limit that rises with your highest balance or equity but never moves down. |
| consistency-rule | Consistency rule | An evaluation rule that caps how much of your total profit may come from your best day. |
| profit-split | Profit split | The share of profits a funded trader keeps, for example 80% or 90%. |
| challenge-fee | Challenge fee | The price paid to attempt a prop firm evaluation; lost if you fail. |
| challenge-expected-value | Challenge expected value | Pass probability times expected payouts, minus the fees paid. |
| simulated-funded-account | Simulated funded account | A funded account whose trades never reach a real market; payouts come from the firm itself. |
| payout-rate | Payout rate | The share of funded traders who actually receive a payout; rarely published. |
| capital-gains-tax | Capital gains tax | Tax on profits from selling assets; rates and rules differ by country. |
| wash-sale-rule | Wash-sale rule | A US rule that disallows a loss if you rebuy the same security within 30 days. |
| after-tax-return | After-tax return | Your return once taxes are paid; the part that actually compounds. |
| withholding-tax | Withholding tax | Tax deducted at source by a broker or payer before the money reaches you. |
| trade-records | Trade records | Dated details of every trade, fee, financing charge, currency conversion and cash movement. |
| go-live-checklist | Go-live checklist | The written conditions that must all be met before you trade with real money. |
| minimum-live-size | Minimum live size | The smallest real position size available, used to test execution and nerves cheaply. |
| sim-to-live-gap | Sim-to-live gap | The expected drop from simulated to real results, caused by costs, slippage and emotions. |
| no-trade-day | No-trade day | A day you decide in advance not to trade because a stand-aside condition applies. |
| stand-aside-rule | Stand-aside rule | A written condition under which you take no new trades. |
| abstention-accuracy | Abstention accuracy | How often you correctly stayed out when there was no edge to trade. |
| constraints-matrix | Constraints matrix | A table matching your time, money, rules, skills and temperament to suitable trading styles. |
| behaviour-audit | Behaviour audit | A review of the habits your journal measures, such as revenge trades and moved stops. |
| session-fit | Session fit | How well a market's most liquid hours match the hours you can actually trade. |
| specialisation | Specialisation | Focusing on one style, few setups and few markets until your results can be judged. |
| no-trade-list | No-trade list | A written list of situations in which you never open a trade. |
| statistical-power | Statistical power | The chance that a test detects a real effect; it rises with sample size. |
| development-pipeline | Development pipeline | The staged path a strategy follows from idea to full live size, with a gate at each stage. |
| kill-criteria | Kill criteria | Numeric limits, set in advance, at which a strategy is stopped. |
| review-trigger | Review trigger | A threshold that moves a strategy down one stage and forces a full review. |
| capital-stages | Capital stages | Steps of position size, from simulator to full size, each unlocked by evidence. |
| notional-account | Notional account | The account value used for sizing; cut after drawdowns so risk falls faster than equity. |
| size-step-up | Size step-up | A planned size increase of about 25%, allowed only after new equity highs and stage criteria. |
| annual-review | Annual review | A yearly check of net, risk-adjusted results against the benchmark that ends in a decision. |
| rule-change-log | Rule-change log | A versioned record of every rule change, with its reason and its evidence. |
| strategy-retirement | Strategy retirement | Stopping a strategy for good when its edge is gone or its regime no longer appears. |
| edge-decay | Edge decay | The weakening of a strategy's returns over time, often after it becomes widely known. |
