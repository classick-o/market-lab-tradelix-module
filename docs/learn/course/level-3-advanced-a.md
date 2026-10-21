# Nivelul 3 · Advanced (A) · Unitățile 3.1–3.7

**The ridge, prima jumătate.** Lichiditate, microstructură, order flow, metode clasice, SMC, macro și bănci centrale, lecție cu lecție, în formatul din [README §10](README.md). Cealaltă jumătate (3.8–3.14 și Capstone 3) e în [level-3-advanced-b.md](level-3-advanced-b.md).

## Ce aduce această jumătate

La Nivelul 2, utilizatorul a învățat să citească un grafic, să aleagă o strategie potrivită regimului și să-și administreze trade-ul. Aici află trei lucruri noi: ce se întâmplă **sub** grafic (cine stă în carte, cine execută, de ce prețul trece repede prin unele niveluri și se oprește la altele), ce mută piețele **întregi** (dobânzi, inflație, dolar, bănci centrale) și cum se pune **la probă** orice metodă, inclusiv cele pe care le-a văzut deja pe internet.

**Ce poate face utilizatorul la final:**
- arată pe grafic, înainte de sesiune, unde stau plauzibil stop-urile și take-profit-urile, apoi își verifică ghicirea cu radiografia simulatorului; spune ce e documentat (stop-urile se adună dincolo de numerele rotunde, Osler, nota B) și ce nu (prețul „atras” de lichiditate, nota D);
- clasifică o străpungere de nivel ca sweep sau breakout abia după închiderea lumânării, cu nivelul de invalidare și mărimea scrise dinainte;
- citește o carte de ordine L1/L2/L3, calculează prețul mediu al unui ordin care „mănâncă” cartea, își găsește locul în coadă, calculează prețul unei licitații și spune cine e contrapartida în fiecare tip de cont;
- citește tape-ul, DOM-ul, footprint-ul, delta și CVD; găsește icebergurile și absorbția; recunoaște semnătura spoofing-ului și știe că e ilegal;
- aplică Fibonacci, Elliott, Wyckoff, armonicele, Ichimoku și Gann după reguli scrise și le testează cu același protocol (reformulare testabilă, control R0, costuri, notă);
- traduce orice termen SMC/ICT în conceptul clasic pe care îl redenumește și îl încadrează: real, redenumit sau nefalsificabil;
- explică lanțul surpriză → așteptări de dobândă → randamente → dolar, acțiuni, mărfuri; recunoaște regimul și știe că o corelație se poate inversa exact când contează;
- calculează probabilitatea implicită a unei decizii de dobândă, citește tonul unui comunicat față de ce era deja în preț, alege dinainte o politică pentru ziua deciziei și își dimensionează pozițiile pentru gap, nu pentru stop.

**Traseele servite** (README §3):

| Traseu (UI) | Unități din această jumătate | Ce primește aici | Continuă în |
|---|---|---|---|
| Price action and order flow | 3.1, 3.2, 3.3, 3.5 | lichiditatea dedusă din grafic, apoi cartea și fluxul real, apoi SMC decodat | 4.2 |
| Technical analyst | 3.4, 3.5 | metodele clasice puse la probă, apoi SMC decodat | 3.9, 3.13 |
| Macro and news | 3.6, 3.7 | mecanismele macro, corelațiile instabile, ziua deciziei de dobândă | 3.8, 3.9 |

Toate traseele trec și prin 3.10–3.12 (core). Unitatea 3.5 aparține la două trasee: e locul unde se întâlnesc citirea lichidității (3.1) și metodele clasice (3.4).

### Firul de dovezi

Fiecare metodă din această jumătate trece prin aceiași șase pași. Protocolul se predă în 3.4.1 și se aplică peste tot (R2 §8.4–8.5, R3 §7.2, Appendix A6):

| Pas | Ce face utilizatorul | Exemplu (Fibonacci, 3.4.2) |
|---|---|---|
| 1. **Claim card** | citește afirmația practicienilor, cu sursa ei | "Pullbacks tend to end near 61.8%." |
| 2. **Reformulare testabilă** | o transformă în regulă + eveniment + rezultat + orizont + comparație | "A reversal of 1 ATR within 20 bars happens more often within ±0.5 ATR of 61.8% than of 55% or 67%." |
| 3. **Controlul R0** | o rulează pe random walk cu aceeași volatilitate și același profil de sesiune; acolo nu poate exista edge | diferența trebuie să rămână în banda de zgomot |
| 4. **Regimul cu structură** | o rulează pe o piață unde mecanismul există (stop-uri plasate după Osler, agenți care urmăresc Fibonacci, momentum) | apare un efect mic, din coordonare, nu din matematică |
| 5. **Costuri și benchmark** | citește rezultatul net de spread și comision, lângă benchmark ghost | edge-ul brut mic dispare sau nu |
| 6. **Nota** | dă nota (Mechanic, A–F) și scrie ce rezultat l-ar face să o schimbe | D |

**Reguli care se aplică în toate lecțiile:**
- Nicio afirmație fără cardul ei de dovezi (R2 §8.4.1). Rata de bază și mărimea eșantionului stau lângă orice statistică (R2 §8.4.2, §8.4.10).
- Trei straturi se țin separat (R3, introducere): **mecanica** (cum funcționează ordinele, cartea, licitațiile) se predă ca fapt; **tendințele statistice** (stop-urile adunate la numere rotunde, volatilitatea în U) se predau cu ratele lor de bază; **narațiunile** („smart money a construit lichiditatea”) se predau ca vocabular, legat de primele două straturi, cu critica explicită.
- Folclorul se etichetează fără batjocură (R2 §8.4.6): utilizatorul va întâlni Elliott, Gann, armonicele și SMC, deci trebuie să le înțeleagă ca să le poată evalua.
- Rezultatele din simulator nu sunt fapte despre piețele reale (R2 §8.4.9). Simulatorul arată **de ce** ar putea exista sau nu un edge; validarea pe date reale ține de 3.11 și 4.3.
- Toate laboratoarele se notează pe proces (reguli scrise înainte, invalidare, mărime, raport complet), niciodată pe profitul simulat (README §1.9). Un rezultat valid al unui laborator e și „metoda asta nu merită folosită”.

## Convenții pentru această jumătate

### Lumea simulată, extinsă

Convențiile din [../README.md](../README.md) rămân valabile. Nivelul 3 adaugă:

| Element | Valoare | Unde se folosește |
|---|---|---|
| LABX în R11 | tick 0.01; spread-ul nu mai e fix: în jur de 0.10 în calm (convenția din Arena), 0.02–0.05 când market maker-ii concurează, 0.30 sau mai mult înainte de evenimente; carte L2 vizibilă, L3 („MBO x-ray”) la cerere | 3.1–3.3, 3.5 |
| Agenți etichetați | market maker, noise, momentum, plasatori de stop-loss și take-profit după regulile Osler (TP la numărul rotund, SL imediat dincolo de el), iceberg, apărător pasiv (absorbție), „zid fals”, agent informat înainte de știri, ordin-părinte VWAP, agenți care urmăresc Fibonacci, agent de acumulare, spoofer etichetat (doar în modulul de conformitate) | după R3 Appendix A3 |
| Comutatorul de stop-uri | „stops ON” (plasatori Osler activi) / „stops OFF” (aceeași piață, fără ei) / R0 (random walk cu aceeași volatilitate) | 3.1, 3.5 |
| Radiografia (x-ray) | după sesiune, simulatorul arată adevărul: stop-urile și TP-urile ascunse, inventarul prins, agenții ascunși, cine a tranzacționat cu cine | 3.1, 3.3, 3.5 |
| Lumea multi-instrument | LABX (indice de acțiuni), LB2 și LB10 (randamente sintetice la 2 și 10 ani, în %), LBND (obligațiune sintetică pe 10 ani, cotată ca preț), LGLD (aur), LOIL (petrol), LCPR (cupru), LDX (indicele vUSD față de un coș), LFX (vUSD față de VFUN, o monedă de finanțare cu dobândă mică), LCOM (o monedă de mărfuri față de vUSD), LPEG (o pereche ținută la un prag de 120.00), 6 sectoare sintetice | 3.6–3.7 |
| Banca centrală sintetică | **LCB (Lab Central Bank)**: dobânda de politică 4.00%, 8 ședințe pe an sintetic, comunicat la 14:00 și conferință de presă la 14:30 (ora laboratorului), dot plot cu 19 participanți o dată pe trimestru, minute după 3 săptămâni sintetice, perioadă de blackout; futures pe dobândă **LRF**, cotat 100 − dobânda implicită | 3.7 (după R4 §3.0 și §9A.9) |
| Motorul de regimuri | disinflation, inflation-fight, growth-scare, crisis, carry-calm; fiecare fixează reacțiile (β), corelațiile și activele-refugiu | 3.6–3.7 (R4 §9A.12) |
| Cont, risc, costuri | ca peste tot: 10,000.00 vUSD; 1% pe trade în misiuni; comision 0.05% pe execuție, rotunjit în sus la cent; dimensionarea ține cont de costuri (formula din L09) | toate |

- Cazurile reale (SNB 2015, flash crash 2010, CFTC v. Sarao, BoJ 2024, august 2024) apar cu eticheta **"Historical case"**; reluările sintetice, cu eticheta **"Synthetic replay"** (R4 §11).
- Instituțiile reale apar doar în cazurile istorice și în cifrele citate din cercetare. Simulatorul nu imită nicio instituție: „decision day” are structura unei zile FOMC, dar banca e LCB.

### Notații

- `✓` = concept care există deja în `concepts.ts`.
- `(nou)` = concept introdus de această jumătate; e în registrul de la final.
- `(din 3.x.y)` = concept nou introdus mai devreme în acest fișier.
- `(nou în 2.5)` și similare = concept introdus de o unitate de la Nivelurile 0–2 sau din a doua jumătate a Nivelului 3. Fiecare id de acest fel a fost verificat în fișierul publicat al nivelului respectiv (vezi „Decizii și întrebări deschise”).
- Lecțiile de la nivelurile anterioare se citează pe unitate (de exemplu 2.5), pentru că numerotarea lor pe lecții se fixează în fișierele lor.
- Checkpoint-urile se numesc `test-3-1` … `test-3-7`. La ≥ 80%, lecțiile unității se marchează „Tested out” (README §5).
- Widget-urile noi au id în kebab-case și eticheta „(nou)” la prima apariție. Lista lor completă e în „Ce cere această jumătate de la simulator”.

### Ordinea recomandată

- **Price action and order flow:** 3.1 → 3.2 → 3.3 → 3.5. SMC vine după lichiditate și, ideal, după order flow, ca utilizatorul să compare fluxul „dedus din lumânări” cu fluxul real (R3 §8.3).
- **Technical analyst:** 3.4 → 3.5. Lecția 3.5.3 trimite la 3.1.2–3.1.3, iar 3.3.8 (Market Profile) e recomandată ca lecție-punte.
- **Macro and news:** 3.6 → 3.7.
- Laboratoarele din 3.4 și 3.5 folosesc protocolul ghidat din 3.4.1. Validarea completă (in-sample/out-of-sample, walk-forward, Monte Carlo) e în 3.11. Cine vrea rigoarea completă face 3.10 înainte de 3.4; nimic nu se blochează.

---

## 3.1 · Liquidity and stops · 7 lecții

### Fișa unității

- **Scop:** „lichiditatea” din limbajul graficelor devine ce este de fapt: ordine care stau în carte (limit, take-profit și stop-loss care se transformă în ordine market). Utilizatorul învață unde se adună plauzibil, ce s-a demonstrat (clustering-ul Osler, cascadele) și ce nu („magnetul”, „vânătoarea de stop-uri”). O străpungere de nivel devine un proces cu două deznodăminte posibile, citit după închidere, nu o intenție ghicită.
- **De ce aici:** e prima unitate a traseului Price action and order flow. Folosește doar graficul și radiografia simulatorului; cartea de ordine vine abia în 3.2. Vine înaintea lui 3.5, pentru că vocabularul SMC despre „liquidity” se leagă aici, întâi, de dovezi (R3 §8.2, modulul M6 înainte de M9). Acoperă golul 7 din R1 §4 („de ce se adună stop-urile și de ce sunt atinse”). Pornește de unde se opresc 2.5 (zonele supply/demand, gap-urile, volume profile) și 2.6 (traps): nu repetă desenarea și definițiile, ci adaugă radiografia ordinelor, notarea zonelor, inventarul prins și testele față de R0.
- **Cere de dinainte:** 1.3 (stop-ul devine market), 1.4 (stop, sizing, R), 1.5 (S/R ca zone, numere rotunde, breakout-uri eșuate), 2.2, 2.5 (supply/demand, gap-uri, volume profile), 2.6 (traps), 2.8 (failed breakout), 0.2 (random walk).
- **Checkpoint `test-3-1`:** 14 întrebări (2 pe lecție) și o sarcină practică: pe o reluare nouă cu „stops ON”, utilizatorul blochează înainte de sesiune 3 markere de cluster, apoi, la o străpungere, scrie invalidarea și mărimea înainte de închidere și clasifică evenimentul după închidere.
- **Laboratorul unității: Liquidity x-ray** (în 3.1.7). Două sesiuni: R2 cu „stops ON” și R0 cu același profil de volatilitate. Înainte de fiecare, utilizatorul blochează markerele: unde crede că stau cele mai mari pool-uri de stop-uri și TP-uri. Joacă sesiunea cu reguli de risc normale. La final, radiografia arată harta reală a ordinelor (heatmap), cascadele declanșate și inventarul prins. Scorul: precizia markerelor față de 4 markere aleatoare (rata așteptată e afișată), plus calitatea deciziilor la străpungeri (invalidare scrisă, mărime din stop). Profitul nu se notează.
- **Firele din spirală:**
  - **Risc:** stop-ul pus în afara benzii aglomerate, mărimea refăcută ca riscul să rămână 1%; slippage-ul din cascade.
  - **Dovezi:** Osler (B) față de „magnet” (D); rata de bază a gap-urilor; zone comparate cu zone aleatoare.
  - **Costuri:** slippage-ul la execuția stop-urilor în cascadă, măsurat în jurnal.
  - **Psihologie:** personificarea pieței („mi-au vânat stop-ul”) ca formă de atribuire a intenției.
  - **Statistică:** rata de bază față de efect; niveluri aleatoare la aceeași distanță ca martor.
  - **Proces:** desenele blocate înainte de sesiune (R3 Appendix A6).
- **Surse:** R3 §5.1–5.11, §2.3, §2.6, §4.8, §4.17, §4.20, §7.2, Appendix A3 și A6; R2 §3.6–3.9, §3.11, §8.2, §8.5 (replicarea Osler); R1 §4 (golurile 7 și 18).

### Pe scurt

| Lecție | Hook | Try | Practică | Nota principală |
|---|---|---|---|---|
| 3.1.1 Liquidity is resting orders | tap: unde stau stop-urile de vânzare | liquidity-xray (ghicește, apoi dezvăluie) | R2 stops ON, 2 sesiuni | Mechanic; magnet D |
| 3.1.2 Where stops cluster | alegere: unde stau stop-urile de cumpărare | stop-placer | R2 stops ON, 10 trade-uri | B (Osler) |
| 3.1.3 Cascades, sweeps and breakouts | breakout sau sweep, cu încredere | sweep-or-break | R1, R2 stops ON vs R0 | B cascade; D sweep → reversal |
| 3.1.4 Equal highs, equal lows and reference levels | egale sau nu? | level-tester | R2 stops ON vs R0 | C / D |
| 3.1.5 Imbalances, gaps and voids | cât de des se umple un gap pe random walk | gap-null-lab | R0 vs R1, 1,000 de sesiuni | Mechanic; „gap-urile se umplu” D |
| 3.1.6 Zone grading and hindsight | notele de „putere” ale nivelurilor publicate | zone-tester | R2 vs R0, zone notate și blocate | D |
| 3.1.7 Trapped inventory | ce fac cei prinși când revin pe zero | liquidity-xray (mod trapped) | laboratorul Liquidity x-ray | Mechanic; C |

### Lecțiile

#### 3.1.1 · Liquidity is resting orders
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Name the three kinds of resting orders behind chart "liquidity" (limit entries, take-profits, stop-losses) and say which of them become market orders when price reaches them.
  2. Mark at least four plausible clustering places on a chart (round numbers, just beyond swing extremes, prior-day high and low, range edges) before the reveal.
  3. Explain why liquidity being present at a level does not mean price is attracted to it.
- **Concepte:** liquidity-pool (nou), stop-loss-order ✓, limit-order ✓, support-and-resistance ✓, base-rates ✓, round-numbers (nou în 1.5)
- **Se sprijină pe:** 1.3, 1.5, 2.5
- **Hook:** predict · hotspot. `LearnChart` cu 40 de lumânări LABX între 98.40 și 101.60: un range 99.20–101.00, cu 100.00 în interior. Cinci zone apăsabile: imediat sub minimul range-ului (99.10–99.19), imediat sub 100.00 (99.90–99.99), mijlocul range-ului, imediat peste maximul range-ului (101.01–101.10), exact la 101.00. Prompt: "Where are most sell stops resting right now? Tap one zone." Răspuns (adevărul din generator): imediat sub minimul range-ului; zona de sub 100.00 e a doua. Nu se notează; se compară în recap.
- **Interacțiunea centrală:**
  - B1 explain: în limbajul graficelor, „liquidity” înseamnă ordine care așteaptă: limite de intrare, take-profit-uri și stop-loss-uri. Termenul [[liquidity]] există deja în glosar, cu sensul general; aici primește sensul de „pool”.
  - B2 figure (`LearnChart` + o scară de ordine desenată cu `Bars` lângă axa de preț), în 4 pași: limitele de cumpărare sub preț → stop-urile de vânzare sub minimul range-ului → take-profit-urile exact la 101.00 și 100.00 → „ce se întâmplă când prețul ajunge la fiecare”.
  - B3 match: tipul de ordin ↔ ce face când prețul ajunge la el (limită de cumpărare ↔ se execută pasiv și absoarbe vânzările; stop de vânzare ↔ devine market sell și adaugă vânzări; take-profit al unui long ↔ limită de vânzare pasivă care absoarbe cumpărările).
  - B4 predict: "Price falls to the range low, where 900 units of sell stops wait. Does the stop pool slow the fall or speed it up?" Răspuns: o accelerează, pentru că stop-urile devin vânzări market.
  - B5 callout: "Liquidity being there is not price being pulled there." Afirmația „price is drawn to liquidity” nu e demonstrată; e și un pas spre personificarea pieței.
- **Try:** `liquidity-xray` (nou), modul „guess, then reveal”. Sarcina: "Place 4 markers where you expect the largest stop pools. Then reveal." Reușită: cel puțin 2 din 4 markere se află la ≤ 0.10 de unul dintre cele mai mari 5 clustere de stop-uri din generator. Feedback-ul arată și câte nimeresc, în medie, 4 markere aleatoare.
- **Practică:** R2 (range) cu „stops ON”, 2 sesiuni. Înainte de fiecare, utilizatorul blochează 3 markere; după, radiografia. Scorul: precizia față de markere aleatoare.
- **Check:** 1) care ordine devin market la atingere și care rămân pasive (mcq); 2) un loc plauzibil de cluster pe un grafic static (hotspot); 3) diferența dintre „lichiditate prezentă” și „preț atras” (mcq cu explicație per variantă).
- **Dovezi:**
  - Ordinele care așteaptă există, iar un stop devine market la declanșare: **Mechanic** (R3 §2.3, §5.1).
  - Ordinele se adună la numere rotunde și la niveluri evidente: **B** (Osler 2001/2003, 9,667 de ordine condiționale de la o bancă de FX; R3 §5.1).
  - „Prețul e atras de lichiditate” (magnetul): **D** (R3 §5.1, tabelul din §7.2).
- **Necesită:** S8 (carte cu stop-uri și TP-uri ascunse, cu adevărul păstrat), S7 (controlul R0), extensia x-ray pentru dezvăluirea de după sesiune (R3 Appendix A3, A6).
- **Termeni noi de glosar:** liquidity-pool, resting-order (stop-cluster există deja în glosar, din Nivelul 1)

#### 3.1.2 · Where stops cluster: the Osler evidence
- **Nivel / durată / tip:** Advanced · 8 min · Track (Price action and order flow)
- **Obiective:**
  1. State Osler's findings: take-profits cluster at round numbers, stop-loss buys just above them and stop-loss sells just below them.
  2. Predict whether a level is more likely to stall price (take-profit cluster) or to accelerate it (stop cluster), and explain why.
  3. Move a protective stop outside the crowded band and resize so the loss at the stop stays within 100.00 vUSD including costs.
- **Concepte:** stop-clustering (nou), liquidity-pool (din 3.1.1), round-numbers (nou în 1.5), support-and-resistance ✓, position-sizing ✓, cost-adjusted-sizing ✓
- **Se sprijină pe:** 3.1.1, 1.4, 1.5
- **Hook:** predict · alegere. "A bank holds thousands of stop-loss buy orders near a round number, here LABX 100.00. Where do most of them sit?" Variante: a) exactly at 100.00; b) 100.01–100.10, just above; c) 99.90–99.99, just below; d) spread evenly. Răspuns: b. În datele Osler, 14.4% din stop-loss-urile de cumpărare stăteau în xx01–xx10, față de 7.4% în xx90–xx99. Notă de conținut: „00” din cotațiile FX cu 4 zecimale (1.1000) devine aici 100.00, iar xx01–xx10 devine 100.01–100.10.
- **Interacțiunea centrală:**
  - B1 explain: Osler a studiat 9,667 de ordine condiționale de la o bancă mare de FX. Ce sunt ordinele condiționale (stop-loss și take-profit).
  - B2 figure (`Bars`, histograma ultimelor două cifre ale prețului), în 3 pași: take-profit-urile, cu vârf exact la 00 (9.3%, față de 4.4% la stop-loss-uri) → stop-loss-urile de cumpărare, adunate imediat deasupra → stop-loss-urile de vânzare, oglindite imediat dedesubt.
  - B3 predict: "Price rises to 100.00 from below. Which orders does it meet first, and what do they do?" Răspuns: take-profit-urile, care tind să oprească prețul (limite pasive); dacă nivelul cedează, urmează stop-urile de cumpărare de la 100.01–100.10, care îl accelerează.
  - B4 worked: testul Osler (2000) pe nivelurile publicate de firme: au oprit trendurile intraday în 60.8% din cazuri, față de 56.2% la niveluri aleatoare. Utilizatorul calculează diferența: 4.6 puncte procentuale (toleranță 0.1). Linia următoare: efect real, dar mic; profitabilitatea după costuri nu a fost demonstrată; firmele au fost de acord între ele doar în ~30% din cazuri.
  - B5 callout: greșeala tipică e stop-ul pus exact acolo unde e al tuturor.
- **Try:** `stop-placer` (nou; extinde `position-size`). Long LABX la 100.60, minimul structurii la 100.12, ATR 0.80, numărul rotund 100.00. Valori de start: stop 99.98, 138 de unități (pierdere la stop 99.41 cu costuri). Sarcina: "Your stop at 99.98 sits inside the crowded sell-stop band. Move it outside the band and keep the loss at the stop within 100.00 vUSD, costs included." Reușită: stop ≤ 99.87 (sub banda 99.88–99.99) **și** numărul maxim de unități cu pierderea ≤ 100.00. Show me: stop 99.87, 120 de unități (pierdere 99.64; 121 ar pierde 100.47). Alt răspuns corect: stop 99.70, 99 de unități (99.02). Feedback la 99.92: "That is the structure rule, low minus a quarter ATR, but it lands inside the crowd. Step past 99.88."
- **Practică:** misiune pe R2 cu „stops ON”: 10 trade-uri cu stop-ul pus înainte de intrare. Jurnalul etichetează automat „stop inside a cluster band” și compară slippage-ul la stop-out pentru stop-urile din bandă și din afara ei (S15).
- **Check:** 1) unde stau stop-loss-urile de cumpărare și take-profit-urile față de un număr rotund (mcq); 2) ce efect are fiecare cluster asupra prețului și de ce (mcq); 3) mărimea după mutarea stop-ului (numeric, cu `vary` pe entry și stop; formula din L09).
- **Dovezi:**
  - Clustering-ul la numere rotunde: **B** (Osler 2001/2003; o singură bancă, piața FX; R3 §5.1, §5.3; R2 §8.2).
  - Efectul nivelurilor S/R publicate: **B**, mic (+4.6 pp; profitabilitatea după costuri nu a fost demonstrată; R3 §5.2, §4.20).
  - Cursurile de schimb petrec mai puțin timp la numere rotunde, consistent cu stop-urile care împing prețul prin ele: **B** (De Grauwe & Decupere, citat de Osler; R3 §5.3).
  - „Un stop în afara benzii reduce slippage-ul în cascadă”: **C** (mecanism plauzibil, netestat ca regulă; se măsoară în simulator).
  - Dimensionarea: **Mechanic**.
- **Necesită:** S8 (agenți care plasează stop-uri și TP-uri după regulile Osler, R3 Appendix A3), S15 (slippage pe etichetă), S3 (grila de numere rotunde).
- **Termeni noi de glosar:** conditional-order, take-profit-cluster

#### 3.1.3 · Cascades, sweeps and breakouts
- **Nivel / durată / tip:** Advanced · 8 min · Track (Price action and order flow)
- **Obiective:**
  1. Explain how triggered stops become market orders that walk a thin book and can trigger further stops (a cascade).
  2. Classify a level break as a sweep or a breakout only after the close, with a written rule: close back inside within one bar, or close beyond with follow-through.
  3. Write an invalidation level and a size before acting on a break, instead of a guess about anyone's intent.
- **Concepte:** stop-cascade (nou), liquidity-sweep (nou), false-breakout ✓, breakout ✓, invalidation-level ✓, slippage ✓
- **Se sprijină pe:** 3.1.2, 1.5, 2.6 (decizia luată după închidere), 2.8
- **Hook:** predict · alegere + slider de încredere 50–100%. Graficul e oprit în mijlocul unei lumânări: prețul e la 101.08, cu 0.08 peste maximul zilei anterioare (101.00). "Breakout or sweep? Pick one and set how sure you are." Reveal: lumânarea se închide la 100.94, înapoi în interior. În recap: "Before the close, nothing on the chart decided it. Your confidence was {yours}%."
- **Interacțiunea centrală:**
  - B1 figure (scară de ordine cu `Bars` și `Level`), în 4 pași: 1,000 de unități de stop-uri de cumpărare se declanșează la 100.01 → ele mănâncă cererile: 300 la 100.02, 200 la 100.03, 250 la 100.05, 250 la 100.08 → ultima execuție, 100.08, atinge următorul cluster, de la 100.06–100.10 → „the move feeds itself”.
  - B2 worked: prețul mediu al celor 1,000 de unități: (300 × 100.02 + 200 × 100.03 + 250 × 100.05 + 250 × 100.08) ÷ 1,000 = 100.0445. Utilizatorul introduce 100.04 (toleranță 0.01).
  - B3 explain: sweep = trece prin nivel și se închide înapoi înăuntru; breakout = se închide dincolo și continuă. Până la închidere, cele două arată identic (R3 §5.4).
  - B4 reveal: aceeași pornire, două continuări pe ramuri (branching replay). Utilizatorul vede că nimic din lumânarea neînchisă nu le deosebea.
  - B5 callout cu dovezile: trendurile accelerează prin clusterele de stop-uri (Osler 2005); singurul test sistematic găsit (Mahadzva 2026, preprint nerecenzat, G10 FX) a arătat că nivelurile „măturate” au prezis mai des **continuarea**, nu inversarea. „Stop hunt” presupune o intenție pe care graficul nu o poate arăta; „sweep” e termenul neutru.
- **Try:** `sweep-or-break` (nou): reluare cu 6 străpungeri. La fiecare, **înainte** de închidere, utilizatorul alege „no trade” sau scrie invalidarea și mărimea (risc 1%, cu costuri); **după** închidere, clasifică evenimentul după regulă. Reușită: 6/6 clasificări corecte după regulă **și**, la fiecare trade luat, invalidarea pe partea corectă și mărimea ≤ 1%. Rezultatul trade-urilor nu contează.
- **Practică:** R1 și R2 cu „stops ON”, plus controlul R0: câte 20 de străpungeri. Jurnalul arată frecvențele de continuare și de revenire în fiecare piață; utilizatorul scrie o propoziție care le compară. În Arena: scenariile „false breakout” și „breakout”.
- **Check:** 1) de ce o cascadă se autoalimentează (mcq); 2) sweep sau breakout pe un grafic static, după închidere (hotspot + clasificare); 3) ce spun dovezile despre „sweep → reversal” (mcq).
- **Dovezi:**
  - Stop-urile ca tranzacționare cu feedback pozitiv; cascadele contribuie la cozile groase: **B** (Osler 2005; R3 §5.4).
  - Sweep și breakout nu se pot deosebi înainte de închidere: **Mechanic** (definiție; R3 §5.4).
  - „După un sweep vine inversarea”: **D** (contrazis de Mahadzva 2026, nerecenzat, și de Osler 2005; R3 §5.4, §7.2).
  - „Mi-au vânat stop-ul”: **D** (intenția nu se poate observa din OHLC; R3 §7.2).
- **Necesită:** S8 (carte cu agenți de stop-uri și cascade), S7 (R0), reluări pe ramuri (R3 Appendix A6), S15.
- **Termeni noi de glosar:** stop-cascade, liquidity-sweep

#### 3.1.4 · Equal highs, equal lows and reference levels
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Detect equal highs and equal lows with an explicit tolerance in ATR instead of by eye.
  2. List the widely watched reference levels (prior-day and prior-week high and low, session high and low, opening price, round numbers) and plot them automatically.
  3. Compare how often price breaks or holds at equal highs with random levels at the same distance, and say whether the difference is beyond noise.
- **Concepte:** equal-highs-lows (nou), reference-levels (nou), support-and-resistance ✓, base-rates ✓, double-tops-and-bottoms (nou în 2.2)
- **Se sprijină pe:** 3.1.2, 2.2, 2.4 (ATR), 2.9 (sesiuni)
- **Hook:** predict · da/nu. "Two swing highs at 101.48 and 101.52. Equal highs or not?" Urmat de "What rule did you use?" (alegere: by eye / a fixed price gap / a fraction of ATR). Răspuns: depinde de toleranță; cu 0.1 × ATR (ATR 0.60, deci 0.06), diferența de 0.04 le face egale.
- **Interacțiunea centrală:**
  - B1 explain: ce sunt equal highs/lows și ce le leagă de stop-uri (stop-urile stau plauzibil imediat dincolo de extreme evidente). În limbajul clasic, sunt dubla temă și dublul fund (2.2).
  - B2 worked: toleranța = 0.1 × 0.60 = 0.06; |101.52 − 101.48| = 0.04 ≤ 0.06. Utilizatorul răspunde „equal” (da/nu) și introduce toleranța (0.06).
  - B3 figure cu slider: toleranța între 0.02 și 0.20 ATR pe 300 de lumânări; numărul de „equal highs” găsite crește. Text: "Every rule finds some. Looser rules find many."
  - B4 hotspot: graficul cu nivelurile de referință trasate automat; "Tap the prior-day high."
  - B5 predict → reveal: "At equal highs, does price break more often than at a random level the same distance away?" Reveal: statisticile simulatorului pentru „stops ON” și pentru R0, cu banda de zgomot.
- **Try:** `level-tester` (nou; extinde `level-drawer`). Sarcina: "Mark every pair of equal highs or lows on these 300 candles with a 0.1 ATR tolerance, then run the test against random levels." Reușită: setul marcat se suprapune ≥ 90% cu detectorul la acea toleranță **și** utilizatorul raportează cele două rate și eticheta corectă („within noise” sau „beyond noise”), după intervalul de încredere afișat de widget.
- **Practică:** R2 cu „stops ON” și controlul R0; nivelurile de referință trasate automat, cu filtrul „watched level”; 100 de atingeri. Jurnalul compară rezultatele.
- **Check:** 1) calculul toleranței (numeric, cu `vary` pe ATR și pe cele două maxime); 2) ce afirmă „equal highs will be swept” și ce notă are (mcq); 3) de ce martorul e un nivel aleator la aceeași distanță (mcq).
- **Dovezi:**
  - Stop-urile stau imediat dincolo de extremele evidente: **C** (plauzibil, extrapolat din datele Osler despre numere rotunde; necuantificat pentru swing-uri; R3 §5.5).
  - „Equal highs/lows vor fi măturate”: **D** (nicio probabilitate publicată; R3 §5.5, §7.1 rândul 4).
  - Nivelurile urmărite de mulți atrag ordine: **C** (mecanismul de coordonare, R2 §8.2); „reacționează cu o rată fixă”: **D** (R3 §5.5).
- **Necesită:** S2 (ATR, niveluri de referință automate), S5 (sesiuni), S7 (R0 și statistici cu interval de încredere).
- **Termeni noi de glosar:** equal-highs-lows, reference-level, detection-tolerance

#### 3.1.5 · Imbalances, gaps and voids
- **Nivel / durată / tip:** Advanced · 8 min · Track (Price action and order flow)
- **Obiective:**
  1. Tell apart the two meanings of "imbalance": order-flow imbalance (more aggressive buying than selling) and price imbalance (a fast one-sided move with little two-sided trading).
  2. Identify a three-candle gap (fair value gap) exactly from OHLC and measure it in ATR.
  3. Compare the revisit rate of gaps with that of random levels at the same distance and explain why "gaps fill" is mostly a base rate.
- **Concepte:** price-imbalance (nou), fair-value-gap (nou), liquidity-void (nou), gap-types (nou în 2.5), volume-profile (nou în 2.5), random-walk (nou în 0.2)
- **Se sprijină pe:** 3.1.3, 2.5, 2.1 (testul pe random walk), 0.2
- **Hook:** predict · slider 0–100%. "In a pure random walk, how often is a three-candle gap revisited within 20 candles?" Răspuns: 83.4%, într-o simulare de 1,000,000 de bare; nivelurile aleatoare la aceeași distanță: 83.5%.
- **Interacțiunea centrală:**
  - B1 explain: cele două sensuri ale lui „imbalance”, care se amestecă des (R3 §5.7).
  - B2 figure (`Candles` + `Zone`), în 3 pași: lumânarea 1 (H 100.40) → lumânarea 2, mare și bullish (O 100.35, H 101.25, L 100.30, C 101.20) → lumânarea 3 (O 101.20, H 101.50, L 100.70, C 101.40); zona dintre 100.40 și 100.70 se aprinde: gap-ul de trei lumânări.
  - B3 hotspot: 30 de lumânări; "Tap the bullish three-candle gap."
  - B4 worked: mărimea în ATR: 0.30 ÷ 0.60 = 0.5 ATR (utilizatorul introduce 0.5).
  - B5 reveal: tabelul modelului nul (R3 §5.9): revizitat în 20 de bare 83.4% față de 83.5%; umplut complet 73.1% față de 73.1%; trade la prima atingere câștigător 50.2% față de 50.1%. Concluzie: gap-ul e o trăsătură reală (o mișcare rapidă), dar „magnetul” lui nu e demonstrat.
  - B6 callout: nodurile cu volum mic, single prints și golurile de lichiditate descriu trecutul; „repararea” lor nu e garantată.
- **Try:** `gap-null-lab` (nou, parte din S7): detectorul de gap-uri rulează pe (a) piața sintetică și (b) R0 cu aceeași volatilitate, câte 2,000 de bare. Sarcina: "Compare gap revisits with random levels for two size filters, 0.25 and 0.5 ATR, in both markets." Reușită: utilizatorul raportează corect cele patru comparații și conclude „no difference beyond noise” acolo unde intervalul conține zero. Pe R0, prin construcție, niciun filtru nu iese din zgomot.
- **Practică:** R0 și R1: scannerul de gap-uri pe 1,000 de sesiuni sintetice (R3 §3.7) compară ratele de umplere cu controlul. Jurnal: "Which part of 'gaps fill' is base rate?"
- **Check:** 1) cele două sensuri ale lui „imbalance” (match); 2) zona unui FVG din cifrele OHLC a trei lumânări (numeric, cu `vary`); 3) interpretarea rezultatului pe modelul nul (mcq).
- **Dovezi:**
  - Identificarea gap-ului de trei lumânări: **Mechanic** (R3 §5.9).
  - „Gap-urile/FVG-urile se umplu”, ca informație: **D** (egal cu rata de bază pe modelul nul; simularea unui vânzător, validă ca model nul, nu ca dovadă că piețele reale sunt aleatoare; R3 §5.9, §3.7; R2 §3.11).
  - Dezechilibrul de flux la cele mai bune cotații prezice următoarele tick-uri: **B** (Cont, Kukanov & Stoikov 2014 [BK]; orizont de milisecunde–secunde, sub costurile unui retail trader; R3 §5.7, §6.10).
  - „Repararea” nodurilor cu volum mic: **D** (R3 §5.10).
- **Necesită:** S7 (detectori pe R0, statistici), S2 (volume profile pentru LVN), S4 (timeframe-uri).
- **Termeni noi de glosar:** fair-value-gap, imbalance, liquidity-void

#### 3.1.6 · Zone grading and hindsight: supply and demand under test
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Grade supply and demand zones with written criteria (departure, time at base, freshness, location) and lock them before the session.
  2. Test whether higher-graded zones react more often than lower-graded zones and random zones of the same width.
  3. Measure how much drawing zones after the fact inflates their apparent success.
- **Concepte:** zone-grading (nou), supply-demand-zones (nou în 2.5), hindsight-bias (nou în 1.2), support-and-resistance ✓, base-rates ✓
- **Se sprijină pe:** 2.5 (desenarea zonelor, contradicția „proaspăt vs atins de mai multe ori”, testul față de zone aleatoare), 3.1.4
- **Hook:** predict · alegere. "Banks published support and resistance levels with 'strength' ratings. Did the strong levels hold more often than the weak ones?" Variante: yes, clearly / a little / no. Răspuns: nu. În Osler (2000), nivelurile publicate au oprit trendurile ceva mai des decât nivelurile aleatoare, dar notele de „putere” date de firme nu au adăugat nimic.
- **Interacțiunea centrală:**
  - B1 figure: zona din 2.5 (drop-base-rally), cu cele patru criterii de notare aprinse pe rând: plecarea (≥ 1.5 ATR), timpul în bază (≤ 3 lumânări), prospețimea (neatinsă după formare), locul (la un nivel vizibil pe timeframe-ul superior).
  - B2 match: criteriul ↔ cum se măsoară (departure ↔ mărimea plecării în ATR; time at base ↔ numărul de lumânări din bază; freshness ↔ numărul de reveniri în zonă; location ↔ distanța până la un nivel de pe timeframe-ul superior).
  - B3 reveal: zonele notate A, B și C și zone aleatoare de aceeași lățime, pe 300 de zone din simulator, cu ratele de reacție și intervalele de încredere. Utilizatorul vede dacă nota adaugă informație dincolo de zgomot.
  - B4 figure cu slider: lățimea zonei între 0.2 și 1.0 ATR; rata de reacție a zonelor **aleatoare** crește odată cu lățimea. Text: "Wide zones 'work' because they are wide."
  - B5 reveal: aceleași reguli aplicate de două ori: o dată cu zonele blocate înainte de sesiune, o dată cu zonele desenate după ea. Zonele desenate după „merg” mai des. Diferența e hindsight-ul, nu edge-ul.
  - B6 callout: o zonă redesenată după ce a eșuat nu mai e același test; jurnalul păstrează versiunea blocată.
- **Try:** `zone-tester` (nou). Sarcina: "Grade 10 zones A, B or C with the written criteria and lock them. Then test them against random zones of the same width." Reușită: ≥ 8/10 note consistente cu criteriile (verificate automat) **și** concluzia corectă din intervale („A beats C beyond noise” sau „no difference beyond noise”), cu N.
- **Practică:** R2 și R0: zonele se notează și se blochează înainte de sesiune; raport săptămânal în stilul testului Osler, pe note (A, B, C) față de zone aleatoare; comparația „locked vs drawn after” rămâne în jurnal.
- **Check:** 1) criteriile de notare (match); 2) ce a găsit Osler despre notele de putere (mcq); 3) de ce zonele desenate după par mai bune (mcq).
- **Dovezi:**
  - „Zonele țin” / „în bază au rămas ordine instituționale neexecutate”: **D** (fără studii robuste; R2 §8.1; R3 §5.6).
  - Notele de „putere” ale nivelurilor: **D** (în Osler 2000 nu au avut valoare; R3 §4.20).
  - Nivelurile S/R publicate, ca grup: **B** (efect mic, +4.6 pp; R3 §5.2).
  - Desenul făcut după fapt umflă rezultatele: **Mechanic** (folosește informație din viitor; R2 §8.3.4).
- **Necesită:** S3 (instrumentul de zonă, cu note și blocare), S7, S13 (variantă ușoară).
- **Termeni noi de glosar:** zone-grade, locked-drawing

#### 3.1.7 · Trapped inventory: stops, break-even exits and role reversal
- **Nivel / durată / tip:** Advanced · 8 min · Track (Price action and order flow)
- **Obiective:**
  1. Read the size and average price of trapped positions from the x-ray after a failed breakout.
  2. Locate the two places where trapped traders exit (their stops and their break-even price) and say what each does to price.
  3. Explain role reversal (broken resistance acting as support, or the reverse) through break-even exits, and compare retests with random levels.
- **Concepte:** trapped-inventory (nou), trapped-traders (nou în 2.6), stop-cascade (din 3.1.3), support-and-resistance ✓, loss-aversion ✓
- **Se sprijină pe:** 2.6 (traps: unde stau stop-urile celor prinși, decizia după închidere), 3.1.3, 1.7 (loss aversion)
- **Hook:** predict · alegere. Range 99.80–101.00. Breakout-ul a eșuat: cumpărătorii au intrat între 101.05 și 101.15, prețul a coborât la 100.40, iar acum urcă înapoi spre 101.10. "Many of those buyers are back to break-even. What do they do?" Variante: buy more / sell to get out flat / nothing. Răspuns: mulți vând ca să iasă „pe zero”; aversiunea față de pierdere din 1.7, văzută ca flux de ordine.
- **Interacțiunea centrală:**
  - B1 figure ("Synthetic replay", cu radiografia pornită), în 3 pași: breakout-ul eșuat → inventarul prins: 600 de unități la 101.05, 500 la 101.10, 300 la 101.15 → 900 dintre ele au stop sub 100.60, 500 nu au stop și așteaptă să iasă pe zero.
  - B2 worked: prețul mediu de intrare: (600 × 101.05 + 500 × 101.10 + 300 × 101.15) ÷ 1,400 = 101.09. Utilizatorul introduce 101.09 (toleranță 0.01).
  - B3 predict → reveal: "Price falls through 100.60, then rallies back toward 101.09. What happens at each place?" Reveal: la 100.60, cele 900 de stop-uri se declanșează și accelerează scăderea (cascada din 3.1.3); la revenirea spre 101.09, cei rămași vând pe zero și urcarea se oprește, în această reluare.
  - B4 figure, cazul invers: role reversal. Vânzătorii în lipsă au intrat la rezistența de 101.00; prețul o sparge și urcă. La retestarea lui 101.00, mulți cumpără înapoi aproape de zero, iar nivelul se comportă ca suport.
  - B5 reveal: statistica retestărilor: nivelurile sparte, retestate, față de niveluri aleatoare la aceeași distanță, pe „stops ON” și pe R0.
  - B6 callout: uneori tu ești cel prins. Ieșirea pe zero e aversiunea față de pierdere în acțiune: bună dacă e în plan, scumpă dacă e un reflex. În SMC, același mecanism se numește „breaker block” (3.5.4).
- **Try:** `liquidity-xray`, modul „trapped”, pe o reluare nouă. Sarcina: "Read the trapped inventory from the x-ray: total size, average entry and how much is protected by stops. Then mark where you expect a retest to stall." Reușită: mărimea totală, prețul mediu (±0.01) și partea protejată de stop-uri corecte față de motor **și** markerul de retestare la ≤ 0.10 de prețul mediu de intrare.
- **Practică:** laboratorul unității, **Liquidity x-ray** (descris în fișa unității): R2 cu „stops ON” și R0, câte o sesiune.
- **Check:** 1) prețul mediu al inventarului prins (numeric, cu `vary`); 2) cele două locuri de ieșire și efectul fiecăruia (match); 3) mecanismul role reversal și nota lui (mcq).
- **Dovezi:**
  - Stop-urile declanșate devin ordine market: **Mechanic** (R3 §2.3).
  - Traderii prinși ca sursă de combustibil: **C** (consistent cu cascadele Osler 2005; niciun test direct; R3 §5.11).
  - Role reversal explicat prin ieșirile pe zero: **C** (plauzibil, dovezi mixte; R3 §5.2).
  - „Breaker block-urile țin la retestare”: **D** (R3 §5.8).
- **Necesită:** S8 cu x-ray (inventarul agenților, stop-urile și ieșirile lor pe zero), S7, S15.
- **Termeni noi de glosar:** trapped-inventory, break-even-exit (role-reversal există deja în glosar, din Nivelul 1)

---

## 3.2 · Market microstructure · 8 lecții

### Fișa unității

- **Scop:** utilizatorul știe cum se întâlnesc ordinele (carte centrală, dealer, broker, licitație), ce arată și ce ascunde cartea (L1, L2, L3), cine e de partea cealaltă (market maker, broker B-book, wholesaler), de ce locul în coadă și tipul de ordin decid dacă se execută și cum se formează prețul de deschidere și de închidere. Totul se predă ca **mecanică**: fapte, reguli și aritmetică, nu predicții.
- **De ce aici:** după 3.1, unde lichiditatea era dedusă din grafic, cartea devine vizibilă. E golul 7 din R1 §4: cursurile pentru retail sar peste microstructură (cine e contrapartida, de ce stop-urile se adună, de ce spread-ul se lărgește la știri), deși cadrul lui Harris („cine e de partea cealaltă și de ce”) e central. Vine înaintea lui 3.3, care citește aceeași carte în mișcare, și înaintea lui 4.2 (execuție și impact).
- **Cere de dinainte:** 1.1 (bid, ask, spread), 1.3 (execuții parțiale și coada, introducere), 2.9 (orele pieței), 2.10 (spread-ul la știri), 2.14 (forex, CFD-uri, ESMA), 3.1.
- **Checkpoint `test-3-2`:** 16 întrebări (2 pe lecție) și o sarcină practică: rutează un ordin între două venue-uri, calculează prețul mediu al unui ordin market care mănâncă cartea și prezice prețul de uncross al unei licitații.
- **Laboratorul unității: Play the market maker** (în 3.2.3), urmat de mini-jocul de licitație (3.2.8). Utilizatorul cotează ambele părți o sesiune întreagă în R11 calm, apoi o sesiune în R11 cu un eveniment R5, în care un agent informat tranzacționează înaintea știrii. P&L-ul se descompune în spread capturat, selecție adversă și inventar. Trecerea: captură de spread pozitivă în sesiunea calmă și explicarea corectă a pierderii din selecție adversă în sesiunea cu eveniment. Apoi rolurile se inversează: ca taker, utilizatorul își citește propria statistică de selecție adversă (mișcarea medie la un minut după execuțiile pasive).
- **Firele din spirală:**
  - **Costuri:** spread efectiv, mersul prin carte, comisioane maker-taker, PFOF, last look; raportul de calitate a execuției.
  - **Risc:** inventarul market maker-ului, execuțiile refuzate, lichiditatea care dispare în stres.
  - **Dovezi:** aproape totul e Mechanic; unde există dispute (PFOF), se spune.
  - **Proces:** raportul de calitate a execuției citit după fiecare sesiune.
  - **Psihologie:** credința că brokerul B-book „vânează stop-uri” ca personificare fără dovezi.
- **Surse:** R3 §1.1–1.11, §2.1, §2.2, §2.8–2.12, §2.18, §3.4, §6.9 (callout-ul despre spoofing); R1 §2.2 (MS-01 … MS-14), §4 (golurile 7 și 8); R4 §4.0 (lichiditatea la știri).

### Pe scurt

| Lecție | Hook | Try | Practică | Nota principală |
|---|---|---|---|---|
| 3.2.1 Venues and market structures | cine ți-a vândut lotul de FX | venue-router | R11 cu două venue-uri | Mechanic |
| 3.2.2 Reading the book | câte tick-uri după șocul de adâncime | book-ladder | R11 calm și subțire | Mechanic; B |
| 3.2.3 Market makers and adverse selection | P&L-ul unei zile de market making | mm-quoter | laboratorul Play the market maker | Mechanic; B |
| 3.2.4 Queue priority | câte unități primești din coadă | queue-sim | R11 FIFO vs pro-rata | Mechanic |
| 3.2.5 Hidden liquidity and order types | 600 executate, 50 afișate | iceberg-builder | R11: trei moduri de a cumpăra 1,000 | Mechanic |
| 3.2.6 Who fills you: broker models and last look | B-book înseamnă vânătoare de stop-uri? | broker-switch | R11 + modul dealer | Mechanic; D |
| 3.2.7 NBBO, routing, PFOF and best execution | „zero commission” | venue-router (raport) | R11 + wholesaler | Mechanic; C |
| 3.2.8 Opening and closing auctions | la ce preț se tranzacționează toți | auction-uncross | mini-jocul de licitație, R6 | Mechanic |

### Lecțiile

#### 3.2.1 · Venues and market structures
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Classify a market as order-driven, quote-driven, brokered or hybrid from how you trade in it.
  2. Explain why spot FX and CFDs have no single central book and no consolidated volume.
  3. Name your counterparty in an exchange account, a dealer FX account and a CFD account.
- **Concepte:** market-venue-types (nou), venue-fragmentation (nou), market-participants (nou în 0.1), bid-ask-spread ✓, trading-costs ✓
- **Se sprijină pe:** 1.1, 2.14, 3.1.1
- **Hook:** predict · alegere. "You buy 1 lot of an FX pair on a retail platform. Who sold it to you?" Variante: another retail trader / your broker or its liquidity provider / the central bank / the exchange. Răspuns: brokerul sau furnizorul lui de lichiditate (piață de dealer, OTC).
- **Interacțiunea centrală:**
  - B1 figure (`Flow`), în 4 pași: carte centrală (CLOB, ordinele se întâlnesc după reguli de prioritate) → piață de dealer (cotezi împotriva dealer-ului) → piață brokeriată (brokerul caută contrapartida pentru blocuri) → hibrid (CLOB plus market maker-i cu obligații).
  - B2 match: piața ↔ structura (bursa de acțiuni ↔ CLOB; FX spot ↔ dealer/OTC; obligațiuni corporative ↔ RFQ la dealeri; un bloc mare ↔ brokeriat; NYSE ↔ hibrid cu DMM).
  - B3 explain: fragmentarea. Acțiunile americane se tranzacționează pe ~15 burse, peste 30 de ATS-uri și la internalizatori; în 2019, ~63% din volum a fost pe burse și ~37% în afara lor. FX: 9.6 trilioane de dolari pe zi (aprilie 2025), dealerii internalizează peste 80% din tranzacțiile clienților, nu există volum consolidat; „volumul” din graficele FX de retail e **tick volume** la un singur broker.
  - B4 hotspot: două cărți ale aceluiași instrument, pe două venue-uri; "Tap the better ask."
  - B5 callout: "Your broker's chart is one price stream, not the market."
- **Try:** `venue-router` (nou): două venue-uri sintetice cu cărți diferite. Sarcina: "Buy 300 units at the lowest total cost." Reușită: ordinul e împărțit astfel încât să ia cele mai ieftine niveluri din ambele cărți; costul total e la ≤ 0.01 × 300 de optimul calculat de widget.
- **Practică:** R11 în modul cu două venue-uri: 10 ordine; la final, raportul de calitate a execuției (preț mediu, comparat cu cel mai bun preț disponibil).
- **Check:** 1) structura unei piețe din descriere (match); 2) de ce volumul din FX e tick volume (mcq); 3) cine e contrapartida în trei tipuri de cont (mcq).
- **Dovezi:** **Mechanic**: taxonomia Harris [BK], statisticile de fragmentare (SEC 2020), BIS 2025 (R3 §1.1–1.2, §1.11).
- **Necesită:** S8, cu extensia „venues” (două venue-uri și modul dealer; R3 Appendix A2), S10 (specificațiile FX).
- **Termeni noi de glosar:** venue, clob, otc-market, dealer-market, internalisation, dark-pool (tick-volume există deja, din nivelurile anterioare)

#### 3.2.2 · Reading the book: L1, L2, L3 and depth
- **Nivel / durată / tip:** Advanced · 8 min · Track (Price action and order flow)
- **Obiective:**
  1. Read the best bid and ask, sizes and depth from L1 and L2, and say what L3 adds.
  2. Compute the average fill price of a market order that walks the book.
  3. Explain why displayed size is an intention, not a commitment, and name the illegal practice that exploits it.
- **Concepte:** limit-order-book (nou), market-depth (nou), liquidity-dimensions (nou), market-order ✓, slippage ✓
- **Se sprijină pe:** 3.2.1, 1.3
- **Hook:** predict · slider 1–20 tick-uri. "Your 500-unit market buy walked 3 ticks into the book. Before a release, liquidity providers pull 70% of the depth. How many ticks does the same order walk now?" Răspuns: 12 (de la 100.05 până la 100.17).
- **Interacțiunea centrală:**
  - B1 figure (scară de preț cu `Bars`), în 4 pași: L1 (cel mai bun bid și ask, cu mărimile) → L2 (mărimea la fiecare nivel: cereri 120 la 100.05, 200 la 100.06, 300 la 100.08, 250 la 100.10, 250 la 100.12, 300 la 100.15, 400 la 100.17) → graficul de adâncime cumulată → L3 (fiecare ordin în parte și locul lui în coadă). 1.3 a introdus coada și mersul prin carte pe o carte mică; aici cartea are adâncime reală.
  - B2 worked: 120 la 100.05 + 200 la 100.06 + 180 la 100.08 = 50,032.40 vUSD; ÷ 500 = 100.0648. Utilizatorul introduce 100.06 (toleranță 0.01). Linia finală: slippage față de cel mai bun ask: 0.0148 × 500 = 7.40 vUSD.
  - B3 match: dimensiunea lichidității ↔ cum se măsoară (tightness ↔ spread; depth ↔ mărimea în N tick-uri; resiliency ↔ timpul de refacere după un sweep; immediacy ↔ cât durează execuția).
  - B4 reveal: generatorul retrage 70% din adâncime (rămân 36, 60, 90, 75, 75, 90 și 120 de unități pe aceleași niveluri). Aceleași 500 de unități merg acum până la 100.17, cu prețul mediu 100.1104 și un slippage de 30.18 vUSD față de cel mai bun ask, de patru ori mai mult decât înainte (R3 §1.7).
  - B5 callout: mărimea afișată poate dispărea oricând. A plasa ordine cu intenția de a le anula înainte de execuție (spoofing) e **ilegal**: în CFTC v. Sarao (2016), un program de layering a contribuit la dezechilibrul extrem din carte dinaintea flash crash-ului din 6 mai 2010. Cazul complet e în 3.3.7.
- **Try:** `book-ladder` (nou), pe o carte nouă. Sarcina: "Estimate the average price of a 400-unit market buy before you send it. Then do it again after the depth shock." Reușită: ambele estimări la ±0.01 de execuția reală.
- **Practică:** R11 calm și R11 subțire (adâncime 40%, ca de sărbători): 10 ordine market de mărimi crescătoare; jurnalul arată slippage-ul în funcție de mărime. În Arena: scenariul „event shock” (adâncimea scade înainte de știre).
- **Check:** 1) ce arată L1, L2 și L3 (match); 2) prețul mediu al unui ordin care mănâncă cartea (numeric, cu `vary` pe nivele și mărime); 3) de ce mărimea afișată nu e un angajament și ce e ilegal (mcq).
- **Dovezi:**
  - Cartea, mersul prin carte, dimensiunile lichidității: **Mechanic** (R3 §1.4, §1.7, §2.1).
  - Lichiditatea dispare în stres: **B** (documentat: CFTC, 6 mai 2010; justificarea circuit breaker-elor, Federal Register 2019; R3 §1.7).
  - Spoofing-ul e ilegal: **Mechanic** (lege și caz sancționat; R3 §6.9).
- **Necesită:** S8 (scară L2/L3, grafic de adâncime, evenimente de șoc de adâncime).
- **Termeni noi de glosar:** level-1, level-2, level-3, depth-chart, walking-the-book, resiliency

#### 3.2.3 · Market makers and adverse selection
- **Nivel / durată / tip:** Advanced · 8 min · Track (Price action and order flow)
- **Obiective:**
  1. Split a market maker's P&L into spread captured, adverse selection and inventory.
  2. Explain why quotes widen and skew before news and when inventory builds.
  3. Show why a resting limit order fills most often when the short-term move goes against it.
- **Concepte:** market-making (nou), adverse-selection (nou), bid-ask-spread ✓, limit-order ✓
- **Se sprijină pe:** 3.2.2, 1.3, 2.10
- **Hook:** predict · slider 0–600 vUSD. "You quote 99.95 / 100.05 and earn half the spread, 0.05, on every fill. You get 60 fills of 100 units. What is your session P&L?" Răspunsul așteptat e 300. Reveal în lecție: 60, după selecția adversă.
- **Interacțiunea centrală:**
  - B1 figure (`Bars`): cele trei componente ale spread-ului (costul de procesare, riscul de inventar, selecția adversă), construite pe rând (Glosten–Milgrom, Stoll; R3 §1.6).
  - B2 worked: spread capturat: 60 × 100 × 0.05 = 300.00; 8 dintre execuții au venit de la un trader informat, înaintea unei mișcări de 0.30 împotrivă: 8 × 100 × 0.30 = 240.00; net: 60.00 vUSD, înainte de comisioane. Utilizatorul calculează netul (60, toleranță 0).
  - B3 predict: "Informed orders arrive before a release. What do you do with your quotes?" Variante: widen / skew / pull / all three. Răspuns: toate trei; dealerii lărgesc, deplasează sau retrag cotațiile înainte de știri (R4 §4.0).
  - B4 explain: un ordin limit pasiv e o opțiune gratuită oferită pieței (Harris): se execută cel mai des exact când prețul vine spre tine și continuă. De aceea jurnalul arată „mișcarea medie la un minut după execuțiile tale pasive”.
  - B5 callout: market maker-ii de azi sunt deseori firme de tranzacționare pe cont propriu (PTF/HFT). Ordinul tău de 1 lot nu îi interesează individual (R3 §1.9).
- **Try:** `mm-quoter` (nou): o sesiune comprimată de 3 minute în R11 calm. Sarcina: "Quote both sides. Finish with positive spread capture and inventory within ±300 units." Reușită: spread capturat > 0 **și** |inventar| ≤ 300 la final. Feedback-ul arată descompunerea P&L-ului.
- **Practică:** laboratorul unității, **Play the market maker** (descris în fișa unității).
- **Check:** 1) descompunerea P&L-ului (numeric, cu `vary` pe fills, mărime și mișcare); 2) de ce cotațiile se lărgesc și se deplasează (mcq); 3) logica „opțiunii gratuite” (mcq).
- **Dovezi:**
  - Componentele spread-ului și selecția adversă: **Mechanic** ca model (Glosten–Milgrom 1985, Kyle 1985, Stoll 1989 [BK]); descompunerea empirică: **B** (R3 §1.6, §1.9).
  - Dealerii lărgesc spread-ul și retrag adâncimea înainte de știri: **Mechanic / B** (R4 §4.0; R3 §3.10).
- **Necesită:** S8 (cotare pe ambele părți, agent informat, inventar), S6 (evenimentul din sesiunea a doua).
- **Termeni noi de glosar:** inventory-risk, quote-skew, high-frequency-trading (adverse-selection există deja în glosar, din 2.7)

#### 3.2.4 · Queue priority
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Find your queue position at a price and predict whether a given traded volume fills you.
  2. Explain which order modifications reset your time priority.
  3. Compare how the same incoming volume is allocated under FIFO and under pro-rata.
- **Concepte:** queue-priority (nou), order-queue (nou în 1.3), limit-order ✓, limit-order-book (din 3.2.2)
- **Se sprijină pe:** 3.2.2, 1.3
- **Hook:** predict · numeric. "You bid 100 units at 100.25. 340 units sit ahead of you. 400 units trade at 100.25. How many do you get?" Răspuns: 60.
- **Interacțiunea centrală:**
  - B1 figure (`Bars` orizontale pe nivelul 100.25, 900 de unități în total), în 3 pași: ordinele dinaintea ta (340) → ordinul tău (100) → cele din spate (460).
  - B2 worked: 400 − 340 = 60 executate; 40 rămân în carte. Utilizatorul introduce 60.
  - B3 predict: "You raise your order to 150 units to catch more. What happens?" Reveal: treci la coada cozii, cu 800 de unități înaintea ta; aceleași 400 îți dau 0. Schimbarea prețului, creșterea cantității sau schimbarea contului resetează prioritatea; reducerea cantității, de obicei, nu (de verificat pe fiecare venue; R3 §2.12).
  - B4 worked: pro-rata: 400 × 100 ÷ 900 = 44.4, rotunjit în jos la 44. Utilizatorul introduce 44.
  - B5 match: regula ↔ ce contează (FIFO ↔ timpul; pro-rata ↔ mărimea, deci tentația de a supradimensiona; instrument constrâns de tick ↔ cozi lungi; LMM ↔ o cotă rezervată market maker-ului cu obligații).
  - B6 callout: ~70% din volumul CME trece prin FIFO (Databento).
- **Try:** `queue-sim` (nou). Sarcina: "Get 100 units filled at 100.25 before the level is exhausted, without crossing the spread." Reușită: ≥ 100 de unități executate la 100.25 sau mai bine, fără ordin market. Dacă utilizatorul mărește cantitatea, feedback-ul arată pierderea locului.
- **Practică:** R11 cu comutatorul de matching FIFO / pro-rata: câte 10 ordine pasive; jurnalul arată rata de execuție și statistica de selecție adversă.
- **Check:** 1) câte unități primești din coadă (numeric, cu `vary`); 2) ce modificări resetează prioritatea (mcq); 3) alocarea pro-rata (numeric).
- **Dovezi:** **Mechanic** (regulile CME, rezumate de Databento; regulile de resetare, „verify per venue”; R3 §2.12, §1.6).
- **Necesită:** S8 (indicator de poziție în coadă, comutator de matching, reguli de resetare la modificare).
- **Termeni noi de glosar:** queue-position, fifo, pro-rata, tick-size

#### 3.2.5 · Hidden liquidity and order types
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Explain how iceberg, hidden, pegged and post-only orders work and what each one trades off.
  2. Explain why a native iceberg and a synthetic one look different to the exchange and in the queue.
  3. Compute maker-taker fees on a round trip.
- **Concepte:** hidden-liquidity (nou), iceberg-order (nou), maker-taker (nou), queue-priority (din 3.2.4)
- **Se sprijină pe:** 3.2.4
- **Hook:** predict · alegere. "The book shows 50 units at 100.00. 600 units trade there, and the 50 is still showing. How?" Variante: spoofing / an iceberg order / a data error / a hidden market maker. Răspuns: un iceberg (ordin cu rezervă).
- **Interacțiunea centrală:**
  - B1 figure, în 3 pași: partea afișată (50) → rezerva ascunsă (550) → fiecare reîncărcare intră la coada cozii.
  - B2 match: tipul de ordin ↔ compromisul (iceberg ↔ ascunde mărimea, pierde prioritatea la fiecare reîncărcare; hidden ↔ invizibil, dar ordinele afișate au prioritate la același preț; midpoint peg ↔ îmbunătățire de preț contra probabilității de execuție; post-only ↔ garantează comisionul de maker, dar poate fi respins).
  - B3 worked: grilă maker-taker sintetică: rebate de 0.002 pe unitate pentru maker, taxă de 0.003 pentru taker. Round trip de 1,000 de unități, intrare pasivă și ieșire agresivă: +2.00 − 3.00 = −1.00 vUSD. Utilizatorul introduce −1.00. Comparații: ambele agresive −6.00; ambele pasive +4.00, dar cu risc de neexecutare.
  - B4 explain: layering-ul legitim (ordine reale, la mai multe prețuri) nu e ilegal; linia o trage intenția de a anula înainte de execuție (R3 §6.9).
  - B5 callout: icebergurile native (cantitatea afișată, gestionată de bursă) față de cele sintetice (platforma retrimite ordine noi după fiecare execuție); regulile de prioritate pentru ordinele ascunse diferă între venue-uri [BK].
- **Try:** `iceberg-builder` (nou). Sarcina: "Buy 1,000 units passively at 99.95 while showing no more than 100 at a time." Reușită: iceberg cu partea afișată ≤ 100 și total 1,000, executat ≥ 80% în sesiune; raportul arată de câte ori reîncărcarea a pierdut prioritatea.
- **Practică:** R11: aceleași 1,000 de unități cumpărate în trei feluri (iceberg, un singur ordin afișat, market), comparate pe timp de execuție, preț mediu și selecție adversă.
- **Check:** 1) compromisurile tipurilor de ordin (match); 2) aritmetica maker-taker (numeric, cu `vary`); 3) iceberg nativ vs sintetic (mcq).
- **Dovezi:** **Mechanic** (R3 §2.10, §2.18; detaliile pe venue sunt [BK]).
- **Necesită:** S8 (iceberg, hidden, peg, post-only, grilă de comisioane), S1.
- **Termeni noi de glosar:** iceberg-order, display-quantity, hidden-order, midpoint-peg, post-only, maker-taker

#### 3.2.6 · Who fills you: broker models and last look
- **Nivel / durată / tip:** Advanced · 8 min · Track (Price action and order flow)
- **Obiective:**
  1. Identify an agency/STP, ECN, B-book or hybrid broker model from the client agreement.
  2. Explain the B-book conflict (client losses are broker revenue) and how regulation manages it.
  3. Read a last-look reject report and spot asymmetric slippage.
- **Concepte:** broker-models (nou), last-look (nou), trading-costs ✓, slippage ✓, leverage ✓
- **Se sprijină pe:** 3.2.1, 2.14
- **Hook:** predict · alegere. "Your broker is your counterparty. Does that mean it hunts your stops?" Variante: yes / no / you can't tell from a chart. Răspuns: nu se poate spune din grafic. Conflictul e structural și e gestionat prin reglementare; nu e o dovadă de vânătoare.
- **Interacțiunea centrală:**
  - B1 figure (`Flow`), în 4 pași: drumul ordinului la agency/STP (spre furnizori externi, cu comision) → ECN (o carte cu mai mulți participanți) → B-book (brokerul e contrapartida) → hibrid (clienții profitabili trimiși spre A-book; practică rar documentată public [BK]).
  - B2 match: clauza din contract ↔ modelul („we act as principal” ↔ B-book; „we pass your orders to liquidity providers and charge a commission” ↔ agency/STP; „requotes may occur” ↔ dealer).
  - B3 explain: măsurile ESMA din 2018: levier maxim 30:1 pe perechile majore, 20:1 pe cele non-majore, aur și indici majori, 10:1 pe alte mărfuri, 5:1 pe acțiuni, 2:1 pe crypto; închiderea la 50% din marjă; protecția la sold negativ; avertismentul obligatoriu (74–89% din conturile de retail pierd).
  - B4 figure: fereastra de last look (50–200 ms în simulator); cererile sunt respinse când prețul s-a mișcat împotriva dealer-ului, deci respingerile sunt asimetrice.
  - B5 worked: histograma slippage-ului: 0 execuții cu slippage pozitiv și 37 cu slippage negativ din 120. Utilizatorul alege interpretarea: "Only negative slippage is passed on: a red flag."
  - B6 callout: FX Global Code, principiul 17 (revizuit în decembrie 2017): în fereastra de last look, participanții nu ar trebui să tranzacționeze folosind informația din cererea clientului; reconfirmat în 2021.
- **Try:** `broker-switch` (nou): aceeași strategie rulată pe STP (comision și spread brut), B-book (spread mai mare, requote-uri, last look) și ECN (execuții parțiale). Sarcina: "Which account had the lowest all-in cost for this strategy, and what did the broker earn in each?" Reușită: modelul cu costul cel mai mic e ales corect, iar P&L-ul brokerului e citit corect din rulare.
- **Practică:** R11 cu modul dealer: 30 de trade-uri de scalping și 5 trade-uri swing pe fiecare model; cascada costurilor (waterfall) pentru fiecare. Misiunea „Read your execution-quality report”.
- **Check:** 1) modelul din clauza de contract (match); 2) conflictul B-book și ce face reglementarea (mcq); 3) recunoașterea slippage-ului asimetric (mcq pe o histogramă).
- **Dovezi:**
  - Modelele de broker, ESMA 2018, FX Global Code P17: **Mechanic** (R3 §1.10).
  - Rutarea clienților profitabili spre A-book: practică din industrie, nedocumentată public [BK] (R3 §1.10).
  - „Un broker B-book trebuie să vâneze stop-uri”: **D** (nicio dovadă; R3 §1.10, „Misuse”).
- **Necesită:** S8 (modul dealer, respingeri last look), S10, S11, extensia „broker profiles” (R3 Appendix A2).
- **Termeni noi de glosar:** a-book, stp, ecn, last-look, requote (b-book există deja în glosar, din Nivelul 1)

#### 3.2.7 · NBBO, routing, PFOF and best execution
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Find the NBBO from several venues' quotes and explain why a direct feed can be faster than the consolidated quote.
  2. Describe how payment for order flow and internalisation work, and what best execution requires.
  3. Read an execution-quality report (price improvement, fill rate, speed) and compare two brokers net of commission.
- **Concepte:** nbbo (nou), payment-for-order-flow (nou), best-execution (nou), venue-fragmentation (din 3.2.1)
- **Se sprijină pe:** 3.2.1, 3.2.6
- **Hook:** predict · alegere. "Zero commission. Is your trade free?" Variante: yes / no, and the cost moved somewhere else. Urmat de "Who pays the broker?" (alegere). Răspuns: nu; costul se mută în spread, în rutare și în plata pentru fluxul de ordine. Se verifică prin calitatea execuției.
- **Interacțiunea centrală:**
  - B1 figure: cotațiile a trei burse sintetice → NBBO = cel mai mare bid și cel mai mic ask dintre ele.
  - B2 hotspot: "Tap the NBBO bid and ask among these three venues."
  - B3 explain: SIP (feed-ul consolidat) față de feed-urile directe, mai rapide; riscul de cotație învechită (stale quote; R3 §1.8).
  - B4 figure (`Flow`): ordinul de retail → broker → wholesaler (internalizare, îmbunătățire de preț, PFOF) sau → bursă. Internalizarea acoperă „aproape 100%” din fluxul marketable de retail din SUA (CFA Institute, citat de SEC 2020).
  - B5 worked: NBBO 100.00 / 100.06; execuție la 100.05 pentru 200 de unități: îmbunătățire de 0.01 × 200 = 2.00 vUSD. Brokerul a primit, sintetic, 0.002 × 200 = 0.40 vUSD de la wholesaler. Utilizatorul calculează îmbunătățirea (2.00).
  - B6 callout cu regulile: FINRA 5310 (best execution, „reasonable diligence”, revizuire „regular and rigorous”, cel puțin trimestrial); PFOF nu e în sine o încălcare, dar nu poate afecta best execution, iar dezvăluirea nu e un scut (FINRA RN 21-23); revizuirea MiFIR interzice PFOF în UE, cu eliminare treptată până la jumătatea lui 2026 [BK, de verificat]; dezbaterea din 2025 despre regula 611 (de verificat).
- **Try:** `venue-router`, modul „report”. Sarcina: "Two brokers routed your 20 orders. Which one gave the better execution net of commission?" Reușită: alege brokerul cu costul total mai mic (îmbunătățire de preț minus comision) și citează cifra.
- **Practică:** R11 cu două venue-uri, SIP întârziat și wholesaler: 20 de ordine rutate; raportul de calitate a execuției.
- **Check:** 1) NBBO din cotații (numeric/hotspot, cu `vary`); 2) obligațiile de best execution și PFOF (mcq); 3) citirea raportului de execuție (mcq).
- **Dovezi:**
  - Reg NMS, FINRA 5310, RN 21-23: **Mechanic** (R3 §1.8).
  - Dacă PFOF ajută sau dăunează retailului, net: **C** (contestat; R3 §1.8 [EMP~]).
  - Calendarul interdicției din UE: [BK], de verificat înainte de publicare.
- **Necesită:** S8 (două venue-uri, SIP întârziat, wholesaler), S15 (raportul de calitate a execuției).
- **Termeni noi de glosar:** nbbo, sip, best-execution, price-improvement, wholesaler (payment-for-order-flow există deja în glosar, din Nivelul 1)

#### 3.2.8 · Opening and closing auctions
- **Nivel / durată / tip:** Advanced · 8 min · Track (Price action and order flow)
- **Obiective:**
  1. Compute the uncross price of a call auction as the price that maximises executed volume.
  2. Read indicative price, paired volume and imbalance messages and decide whether to supply liquidity against an imbalance.
  3. Explain why closing prices carry index flows and why a halted market reopens through an auction.
- **Concepte:** call-auction (nou), auction-imbalance (nou), market-as-auction (nou în 0.1), gap-risk ✓, limit-order ✓
- **Se sprijină pe:** 3.2.2, 2.9
- **Hook:** predict · alegere. "In a call auction everyone trades at one price. Which one?" Variante: the highest bid / the last trade / the price where the most volume can trade / the average of all orders. Răspuns: prețul la care se poate tranzacționa cel mai mare volum.
- **Interacțiunea centrală:**
  - B1 figure: cererea cumulată (scade cu prețul) și oferta cumulată (crește cu prețul); intersecția.
  - B2 worked: cartea licitației: cumpărări 100 market, 300 la 100.30, 200 la 100.20, 400 la 100.10, 300 la 100.00; vânzări 100 market, 200 la 99.90, 300 la 100.00, 300 la 100.10, 400 la 100.20, 200 la 100.30. Volumul executabil: 300 la 99.90, 600 la 100.00, **900 la 100.10**, 600 la 100.20, 400 la 100.30. Utilizatorul introduce prețul de uncross (100.10) și dezechilibrul (100 de unități la cumpărare: cerere 1,000, ofertă 900).
  - B3 explain: mesajele din perioada de call (preț indicativ, volum împerecheat, partea și mărimea dezechilibrului). La Nasdaq, dezechilibrul de deschidere se publică de la 09:25, cu cross-ul la 09:30; cel de închidere de la 15:50, cu cross-ul la 16:00. LSE adaugă un final aleator de până la 30 de secunde, ca să descurajeze jocurile de ultim moment. Prețul de închidere e reperul pentru fondurile indexate; în 2019, licitațiile au însemnat ~34% din volumul propriu NYSE și ~12% la Nasdaq.
  - B4 predict: "You add a sell limit of 100 units at 100.10. What changes?" Reveal: se execută 1,000 de unități la 100.10, iar dezechilibrul devine 0.
  - B5 callout: un ordin MOO pe un instrument subțire poate primi un preț surprinzător; o piață suspendată se redeschide prin licitație, iar stop-urile se pot declanșa la prețul de redeschidere (R3 §2.20).
- **Try:** `auction-uncross` (nou): o perioadă de call de 5 minute, cu preț indicativ, volum împerecheat și dezechilibru transmise live. Sarcina: "Submit one order that reduces the imbalance without moving the indicative price by more than 0.10. Then predict the final uncross price." Reușită: ordinul e pe partea opusă dezechilibrului, cu limita la prețul indicativ sau mai bună, **și** predicția e la ±0.02 de prețul final.
- **Practică:** mini-jocul de licitație în R6 (sesiune intraday), cu cross-uri de deschidere și de închidere, 5 zile sintetice; scenariul cu dezechilibru mare la închidere (R3 §3.4). Opțional: suspendare și redeschidere prin licitație (S20).
- **Check:** 1) prețul de uncross dintr-un tabel (numeric, cu `vary`); 2) ce înseamnă un mesaj de dezechilibru și ce poți face (mcq); 3) de ce contează închiderea și cum se redeschide o piață suspendată (mcq).
- **Dovezi:** **Mechanic** (regulile cross-urilor Nasdaq, factsheet-ul LSE, ponderile din SEC 2020; R3 §1.3, §2.9, §3.4). Ordinea criteriilor de departajare: [BK].
- **Necesită:** S8 (licitații cu mesaje indicative și final aleator), S5 (ceasul sesiunii), S20 (suspendare și redeschidere, opțional).
- **Termeni noi de glosar:** call-auction, uncross, indicative-price, paired-volume, auction-imbalance, market-on-close

---

## 3.3 · Order flow · 8 lecții

### Fișa unității

- **Scop:** utilizatorul citește fluxul de ordine în mișcare (tape, DOM, footprint, delta, CVD), recunoaște absorbția, epuizarea și icebergurile, știe că spoofing-ul și layering-ul cu intenția de anulare sunt **ilegale** și citește sesiunea ca pe o licitație (Market Profile). La fiecare instrument se separă ce e **dată** (ce s-a tranzacționat, unde, de cine) de ce e **interpretare** (ce „vor” participanții), iar interpretarea primește o reformulare testabilă și un control.
- **De ce aici:** după 3.2, cartea statică devine carte în timp. Vine înaintea lui 3.5, ca utilizatorul să poată compara fluxul „dedus din lumânări” de SMC cu fluxul real (R3 §8.3). **Decizie de conținut:** README §3 trece Market Profile atât la 3.3, cât și la 3.4. Aici se predă o singură dată, complet, în 3.3.8 (unde îl pune și R3 §8.2, în modulul de order flow); 3.4 nu îl repetă și îl recomandă ca lecție-punte.
- **Cere de dinainte:** 3.2 (mai ales 3.2.2 și 3.2.5), 2.5 (volum, VWAP, volume profile), 2.6 (momentum vs epuizare), 2.9 (opening range).
- **Checkpoint `test-3-3`:** 16 întrebări (2 pe lecție) și o sarcină practică: într-o reluare R11 de 10 minute, utilizatorul semnalează o absorbție și un iceberg și identifică spoofer-ul din statisticile MBO.
- **Laboratorul unității: Iceberg hunt** (în 3.3.6), cu biroul de supraveghere din 3.3.7. Sesiune R11 cu 3 agenți iceberg, un apărător pasiv (absorbție), un „zid fals” și un spoofer etichetat (doar în modulul de conformitate). Utilizatorul semnalează în timp real; scorul ține cont de timpul de detecție și de alarmele false; la final, panoul de dezvăluire arată toți agenții.
- **Firele din spirală:**
  - **Dovezi:** fiecare instrument separă datele (Mechanic) de citirea lor (de regulă D); zone aleatoare și R0 ca martori.
  - **Statistică:** erorile de clasificare a tranzacțiilor; „pace” comparat cu aruncarea monedei.
  - **Costuri:** order flow-ul se folosește mult în scalping; zidul costurilor din 2.9 revine.
  - **Proces:** conformitatea (insigna „Compliance”), jurnalul trade-urilor luate „din cauza unui zid”.
  - **Psihologie:** a vedea intenție în zgomot; a acuza pe oricine își retrage un ordin.
- **Surse:** R3 §6.1–6.15, §3.5, §1.5, §2.10, Appendix A3, A5, A6; R2 §6.7, §6.8; R1 §2.2 (MS-14).

### Pe scurt

| Lecție | Hook | Try | Practică | Nota principală |
|---|---|---|---|---|
| 3.3.1 The tape | un print de 5,000: bullish? | tape-reader | R11 + R0, jocul „pace” | Mechanic; D |
| 3.3.2 The DOM ladder | zidul de 2,000 la 100.20 | dom-ladder | R11 cu „zid fals” | Mechanic; D |
| 3.3.3 Footprint charts | lumânarea verde ascunde cumpărători? | footprint-reader | R11 vs zone aleatoare | Mechanic; D |
| 3.3.4 Delta and cumulative delta | divergența de CVD | cvd-pane | R11 + R0, 100 de divergențe | Mechanic; D |
| 3.3.5 Absorption and exhaustion | 1,800 vândute, prețul stă | absorption-flagger | R11 cu apărător pasiv | D |
| 3.3.6 Icebergs: detection | mărimea ascunsă minimă | iceberg-hunt | laboratorul Iceberg hunt | Mechanic |
| 3.3.7 Spoofing and layering: illegal | 81,000 de modificări, 81 de loturi | surveillance-desk | modulul de conformitate | Mechanic (lege) |
| 3.3.8 Market Profile and the auction | timp sau volum la preț | tpo-builder | R6, jocul tipului de zi | Mechanic; D |

### Lecțiile

#### 3.3.1 · The tape: time and sales
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Read a time-and-sales print (time, price, size, aggressor) and classify it as buyer- or seller-initiated.
  2. Explain why every trade has a buyer and a seller, and what "aggressor" adds.
  3. Say how trade-classification rules (tick rule, Lee–Ready) go wrong and why spot FX "volume" is a tick count.
- **Concepte:** tape-reading (nou), trade-classification (nou), bid-ask-spread ✓, limit-order-book (din 3.2.2)
- **Se sprijină pe:** 3.2.2, 2.5
- **Hook:** predict · alegere. "A 5,000-unit print appears at 100.00. Bullish or bearish?" Variante: bullish / bearish / can't tell. Răspuns: nu se poate spune. Orice tranzacție are un cumpărător și un vânzător; contează cine a lovit (la bid sau la ask) și contextul.
- **Interacțiunea centrală:**
  - B1 figure: panoul time & sales lângă bid și ask, în 3 pași: print la ask (cumpărător agresiv, accent) → print la bid (vânzător agresiv) → print la mijloc (ambiguu).
  - B2 match: printul ↔ clasificarea (la ask 100.05 ↔ buy; la bid 99.95 ↔ sell; la mid 100.00 ↔ ambiguu, quote rule fără răspuns; uptick ↔ buy după tick rule).
  - B3 predict → reveal „pace”: 30 de secunde de tape care se accelerează; utilizatorul prezice direcția următoarelor 30 de secunde. Se repetă de 20 de ori, iar scorul se compară cu aruncarea monedei: ritmul arată urgența, nu direcția.
  - B4 explain: algoritmii de tip Lee–Ready clasifică greșit în aproximativ 10–25% din cazuri (acuratețe raportată de 75–90%, [BK]), mai rău cu cotații rapide și execuții ascunse sau la mijloc. Pe acțiuni, piața e fragmentată și printurile din dark pools vin târziu; în FX spot, „volumul” e numărul de modificări de preț la un singur broker.
  - B5 worked: 20 de printuri: adevărul din motor față de tick rule. Utilizatorul numără 4 clasificări greșite și introduce eroarea: 20%.
- **Try:** `tape-reader` (nou). Sarcina: "Classify 20 prints by aggressor using the quotes, then compare your result with the tick rule." Reușită: ≥ 18/20 corecte cu quote rule **și** eroarea tick rule raportată corect (cifra afișată de motor).
- **Practică:** R11 și R0: exercițiul „pace”, 50 de încercări, comparat cu aruncarea monedei; modul expert „classification error” (adevărul din motor lângă estimarea tick rule).
- **Check:** 1) clasificarea după agresor (match); 2) de ce orice tranzacție are două părți și ce adaugă agresorul (mcq); 3) ce înseamnă volumul în FX spot (mcq).
- **Dovezi:**
  - Definițiile datelor: **Mechanic** (R3 §6.1).
  - Acuratețea clasificării sub 100%: **B** (studii de validare Lee–Ready [BK]; R3 §6.2).
  - „Tape-ul prezice direcția”: **D** (euristică; R3 §6.1).
- **Necesită:** S8 (time & sales cu agresor, modul „classification error”), S7.
- **Termeni noi de glosar:** time-and-sales, aggressor, print, tick-rule

#### 3.3.2 · The DOM ladder
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Read a DOM ladder: resting size at each price, last trades and your own working orders.
  2. Name four size behaviours (pulling, stacking, reloading, absorption) and what each can and cannot show.
  3. Avoid trading against a large displayed order that may disappear.
- **Concepte:** depth-of-market (nou), market-depth (din 3.2.2), limit-order-book (din 3.2.2)
- **Se sprijină pe:** 3.3.1, 3.2.2
- **Hook:** predict · alegere. "A 2,000-unit offer sits at 100.20, ten times the usual size. Price climbs toward it. What happens?" Variante: price stops there / the wall breaks / the order is pulled / you can't know. Răspuns: nu se poate ști; mărimea afișată e un indiciu, nu o dovadă. În reluare, ordinul e retras la 100.17 (agentul „zid fals”).
- **Interacțiunea centrală:**
  - B1 figure: scara DOM, în 3 pași: mărimea la fiecare preț → ultimele execuții → ordinele tale active.
  - B2 match: comportamentul ↔ semnătura (pulling ↔ mărimea dispare când prețul se apropie; stacking ↔ se adaugă mărime; reloading ↔ aceeași mărime reapare după execuții; absorption ↔ execuții repetate, nivelul ține).
  - B3 reveal: reluarea cu zidul fals, cu istoricul mărimii afișate.
  - B4 explain: mulți traderi de order flow cântăresc mai mult volumul executat decât adâncimea afișată; cărțile centralizate de futures sunt cele mai curate (R3 §6.3).
  - B5 callout: un ordin retras nu e automat spoofing. Anulările sunt normale (market maker-ii modifică și anulează enorm); linia legală e intenția (3.3.7).
- **Try:** `dom-ladder` (nou): 3 minute de reluare. Sarcina: "Tag each large order event as pulled, reloaded or absorbed." Reușită: ≥ 4/5 etichete corecte față de adevărul din motor.
- **Practică:** R11 cu agentul „zid fals”: 10 sesiuni de DOM; jurnalul compară trade-urile luate „din cauza unui zid” cu rezultatul lor (S15).
- **Check:** 1) componentele DOM-ului (hotspot); 2) comportamentele de mărime (match); 3) de ce mărimea afișată nu e o dovadă (mcq).
- **Dovezi:**
  - Mecanica DOM-ului: **Mechanic** (R3 §6.3).
  - Citirea intenției din mărimea afișată: **D** (euristică; R3 §6.3).
  - „Absorbția nu se poate falsifica”: **D** (afirmație de vânzător; R3 §6.6).
- **Necesită:** S8 (DOM cu ordinele utilizatorului, istoricul mărimii, agent „zid fals”); heatmap-ul de lichiditate, opțional.
- **Termeni noi de glosar:** dom, pulling, stacking, reloading, liquidity-heatmap

#### 3.3.3 · Footprint charts
- **Nivel / durată / tip:** Advanced · 8 min · Track (Price action and order flow)
- **Obiective:**
  1. Read a footprint bar: bid × ask volume per price, bar delta and bar POC.
  2. Find diagonal imbalances at a 3:1 threshold and stacked imbalances.
  3. Explain why an imbalance describes what happened, not what must happen next.
- **Concepte:** footprint-chart (nou), footprint-imbalance (nou), tape-reading (din 3.3.1)
- **Se sprijină pe:** 3.3.1, 3.3.2
- **Hook:** predict · alegere. "This candle closed 0.05 higher. Did aggressive buyers dominate inside it?" Variante: yes / no / you can't tell from the candle. Răspuns: din lumânare nu se poate spune; footprint-ul arată.
- **Interacțiunea centrală:**
  - B1 figure (footprint pe o bară, nivele de 0.01; bid × ask): 100.06: 10 × 5; 100.05: 40 × 60; 100.04: 30 × 150; 100.03: 25 × 120; 100.02: 20 × 110; 100.01: 35 × 40; 100.00: 50 × 20. Pași: nivelele → volumul la bid (vânzări agresive) și la ask (cumpărări agresive) → POC-ul barei (100.04, 180 de unități) → delta barei.
  - B2 worked: delta = 505 − 210 = +295. Utilizatorul introduce 295.
  - B3 hotspot: "Tap the stacked buy imbalances." Comparația e pe diagonală (ask la P față de bid la P − 1 tick): 110 ÷ 35 ≈ 3.1 la 100.02, 120 ÷ 20 = 6 la 100.03, 150 ÷ 25 = 6 la 100.04. Trei nivele consecutive ≥ 3:1, deci stacked.
  - B4 explain: unfinished auction (volum pe ambele părți la extremă) și exhaustion print (volum foarte mic la extremă, aici 10 × 5 la 100.06).
  - B5 figure cu slider: pragul între 2:1 și 4:1; numărul de dezechilibre se schimbă. Dezechilibrele izolate sunt mai ales zgomot.
  - B6 callout: footprint-ul nu se poate reconstrui din OHLCV; pe feed-uri fără agresor, e o aproximare.
- **Try:** `footprint-reader` (nou): 5 bare. Sarcina: "Mark each bar's POC, the sign of its delta and every stacked imbalance at 3:1." Reușită: ≥ 90% din elemente corecte.
- **Practică:** R11 cu controlul R0: zonele cu stacked imbalances față de zone aleatoare de aceeași lățime, 200 de zone; statistica de reacție (R3 §6.4).
- **Check:** 1) delta barei (numeric, cu `vary`); 2) identificarea unui dezechilibru diagonal (hotspot); 3) nota dezechilibrelor ca semnal (mcq).
- **Dovezi:**
  - Datele footprint: **Mechanic** (R3 §6.4).
  - „Stacked imbalances devin suport/rezistență”: **D** (euristică: „an imbalance describes what happened… not what must happen next”; R3 §6.4).
  - „Unfinished auctions se revizitează”: **D** (R3 §6.4).
- **Necesită:** S8 (date pe tranzacție, cu agresor; vizualizarea footprint), S7.
- **Termeni noi de glosar:** footprint, bar-delta, diagonal-imbalance, stacked-imbalance, unfinished-auction, exhaustion-print

#### 3.3.4 · Delta and cumulative delta
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Compute bar delta and a cumulative volume delta from a chosen anchor.
  2. Spot a delta divergence and say what price confirmation it needs.
  3. Tell "aggressive buying" from "sellers withdrawing" as causes of a rally.
- **Concepte:** cumulative-volume-delta (nou), delta-divergence (nou), footprint-chart (din 3.3.3), divergence (nou în 2.4), cumulative-volume-indicators (nou în 2.5)
- **Se sprijină pe:** 3.3.3, 2.4, 2.5
- **Hook:** predict · alegere. "Price makes a higher high. Cumulative delta makes a lower high. Is a reversal coming?" Variante: yes / likely / not without price confirmation. Răspuns: nu fără confirmare din preț.
- **Interacțiunea centrală:**
  - B1 figure (`Bars` pentru delta, `Line` pentru CVD): deltele a cinci bare, +295, +120, −80, +60, −40; CVD 295, 415, 335, 395, 355.
  - B2 worked: CVD la bara 4 = 295 + 120 − 80 + 60 = 395. Utilizatorul introduce 395.
  - B3 hotspot: "Tap the divergence." Prețul face un maxim mai înalt la bara 4 (101.10, față de 100.80 la bara 2), iar CVD un maxim mai jos (395 față de 415).
  - B4 explain: nivelul absolut al CVD depinde de ancoră (sesiune sau continuu). Diferența față de OBV: OBV dă semnul întregului volum al barei după închidere; CVD folosește agresorul fiecărei tranzacții.
  - B5 reveal: un rally explicat de anulări, nu de cumpărări. Motorul arată delta și anulările: vânzătorii și-au retras ofertele.
  - B6 callout: CVD-ul din platforme e de obicei aproximat din lumânări pe timeframe mic; erorile de clasificare (3.3.1) se adună.
- **Try:** `cvd-pane` (nou). Sarcina: "Switch the anchor between session and continuous. Find the divergence that survives both, then name the cause of the last rally." Reușită: e găsită singura divergență (din 3) care apare la ambele ancore **și** cauza rally-ului e citită corect din panoul motorului.
- **Practică:** R11 și R0: detectorul de divergențe, cu și fără confirmare din preț (R3 §6.5), 100 de evenimente; jurnal.
- **Check:** 1) calculul CVD (numeric, cu `vary`); 2) divergența și confirmarea (mcq); 3) OBV față de CVD (match).
- **Dovezi:**
  - Calculul delta/CVD și dependența de ancoră: **Mechanic** (R3 §6.5).
  - „Divergența de delta anunță inversarea”: **D** („flags a fragile move, not a guaranteed reversal”; R3 §6.5; R2 §8.1, divergențele sunt weak/untested).
- **Necesită:** S8, S7, S2 (OBV, pentru comparație).
- **Termeni noi de glosar:** volume-delta, cvd, delta-divergence

#### 3.3.5 · Absorption and exhaustion
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Recognise absorption: heavy aggressive volume at a level without price progress.
  2. Recognise exhaustion: aggressive volume drying up at the extreme of a move.
  3. State what invalidates each read: the level breaks, or volume returns.
- **Concepte:** absorption (nou), order-flow-exhaustion (nou), momentum-vs-exhaustion (nou în 2.6), invalidation-level ✓
- **Se sprijină pe:** 3.3.2, 3.3.4, 2.6
- **Hook:** predict · alegere. "Sellers hit 99.50 with 1,800 units in six minutes. Price is still at 99.50. Who is winning?" Variante: the sellers / a passive buyer / nobody. Răspuns: un cumpărător pasiv absoarbe vânzările. Dacă 99.50 cedează, absorbția a eșuat.
- **Interacțiunea centrală:**
  - B1 figure, în 3 pași: prețul plat între 99.50 și 99.52 → delta puternic negativă (−1,500) → bid-ul de la 99.50 care se reîncarcă în DOM.
  - B2 explain: „effort vs result” (Wyckoff): mult efort (volum), puțin rezultat (preț).
  - B3 predict → reveal: "Does 99.50 hold?" Două ramuri ale reluării: într-una nivelul ține, în cealaltă cedează după ce agentul pasiv își termină mărimea.
  - B4 figure: epuizarea la maxim: un maxim nou cu volum mic și delta mică.
  - B5 match: citirea ↔ invalidarea (absorbție de către un cumpărător pasiv la 99.50 ↔ tranzacții sub 99.48; absorbție de către un vânzător pasiv la 101.20 ↔ tranzacții peste 101.22; epuizare la maxim ↔ un nou maxim cu delta în creștere).
  - B6 callout: "If the level breaks, the absorption failed." Citirea e o ipoteză cu un preț de invalidare, nu o certitudine.
- **Try:** `absorption-flagger` (nou): reluare R11 la viteză 10×. Sarcina: "Flag absorption when you see it. The app then shows how much size the hidden buyer had left." Reușită: cel puțin un semnal la ≤ 30 de secunde de activitatea agentului, cu cel mult o alarmă falsă, **și** invalidarea scrisă.
- **Practică:** R11 cu agentul apărător pasiv și controlul R0: 10 sesiuni; statistica „absorbția ține” față de niveluri aleatoare.
- **Check:** 1) definiția absorbției (mcq pe un DOM static); 2) definiția epuizării (hotspot); 3) invalidarea fiecărei citiri (match).
- **Dovezi:** citirile de absorbție și epuizare: **D** (euristici; R3 §6.6–6.7); „effort vs result”: **D** (euristică Wyckoff; R2 §6.6).
- **Necesită:** S8 (agent pasiv ascuns, cu adevărul dezvăluit), S7.
- **Termeni noi de glosar:** absorption, effort-vs-result

#### 3.3.6 · Icebergs: detection
- **Nivel / durată / tip:** Advanced · 7 min · Track (Price action and order flow)
- **Obiective:**
  1. Detect an iceberg from traded volume exceeding displayed size and repeated refills at one price.
  2. Estimate the minimum hidden size from the tape.
  3. Explain why a synthetic iceberg looks like a series of new orders to the exchange.
- **Concepte:** iceberg-order (din 3.2.5), hidden-liquidity (din 3.2.5), absorption (din 3.3.5)
- **Se sprijină pe:** 3.2.5, 3.3.5
- **Hook:** predict · numeric. "50 units show at 100.00. 600 trade there. 50 still show. What is the smallest the hidden order can be?" Răspuns: 550.
- **Interacțiunea centrală:**
  - B1 figure: DOM-ul și tape-ul sincronizate, cu reîncărcările marcate.
  - B2 worked: 600 − 50 = 550. Utilizatorul introduce 550.
  - B3 explain: icebergul nativ (bursa știe că e un singur ordin) față de cel sintetic (platforma retrimite ordine noi; bursa vede ordine separate); reîncărcările intră la coada cozii.
  - B4 predict: "An iceberg buyer at 100.00 has absorbed 600 units. Will price rise?" Răspuns: nu e garantat. Icebergul poate fi pe terminate sau poate fi acoperirea unei poziții vândute în altă parte.
  - B5 hotspot: un panou de tape cu trei niveluri; "Tap the iceberg level."
- **Try:** `iceberg-hunt` (nou). Sarcina: "Find the 3 iceberg agents in this 20-minute session." Reușită: ≥ 2/3 găsiți, fiecare la ≤ 3 minute de la prima reîncărcare, cu ≤ 2 alarme false.
- **Practică:** laboratorul unității, **Iceberg hunt** (descris în fișa unității).
- **Check:** 1) mărimea ascunsă minimă (numeric, cu `vary`); 2) semnătura unui iceberg (mcq); 3) nativ vs sintetic (mcq).
- **Dovezi:** detecția icebergurilor: **Mechanic** (R3 §2.10, §6.8); „icebergul arată direcția”: **D**.
- **Necesită:** S8 (agenți iceberg, panoul de dezvăluire).
- **Termeni noi de glosar:** iceberg-refill, reserve-quantity

#### 3.3.7 · Spoofing and layering: illegal
- **Nivel / durată / tip:** Advanced · 8 min · Track (Price action and order flow)
- **Obiective:**
  1. Define spoofing (bidding or offering with the intent to cancel before execution) and say why it is illegal in US futures and under EU market-abuse rules.
  2. Recognise the surveillance signature: large orders away from the touch, frequent modifications, a high cancel-to-fill ratio and trades on the opposite side.
  3. Tell legitimate layering of genuine orders from spoofing, and explain why a pulled order alone is not proof.
- **Concepte:** spoofing (nou), depth-of-market (din 3.3.2), limit-order-book (din 3.2.2)
- **Se sprijină pe:** 3.3.2, 3.2.2
- **Hook:** predict · alegere. "A program placed large sell orders 3–4 ticks above the best ask for over four hours, modified them more than 81,000 times and executed 81 lots. Legal?" Variante: legal / illegal / depends on the broker. Răspuns: ilegal (CFTC v. Sarao, "Historical case").
- **Interacțiunea centrală:**
  - B1 explain: definiția. În futures-urile americane, spoofing-ul e interzis de amendamentul Dodd-Frank la Commodity Exchange Act („bidding or offering with the intent to cancel the bid or offer before execution”, CEA §4c(a)(5)(C)); în UE, de regimul de abuz de piață (MAR). Textul exact al legii e [BK], de verificat.
  - B2 figure (reluare sintetică după cazul real), în 3 pași: 4–6 ordine mari de vânzare, la un nivel distanță unul de altul, la 3–4 tick-uri de cel mai bun ask → modificate automat ca să nu se execute → pe 6 mai 2010, programul a rulat 4 ore și 25 de minute, a modificat ordinele de peste 81,000 de ori, a executat 81 de loturi și a reprezentat 20–29% din partea de vânzare a cărții E-mini. CFTC a stabilit că a contribuit la dezechilibrul extrem dinaintea flash crash-ului. Rezultatul: ~38.6 milioane de dolari în penalități și restituiri, interdicții de tranzacționare, recunoașterea vinovăției pentru spoofing și fraudă.
  - B3 match: comportamentul ↔ legal / ilegal / nu se poate spune (ordine reale la mai multe prețuri ↔ legal, layering legitim; ordine puse ca să fie anulate când se apropie prețul, cu tranzacții pe partea opusă ↔ spoofing, ilegal; un ordin retras pentru că trader-ul s-a răzgândit ↔ legal; un singur ordin retras văzut din afară ↔ nu se poate spune).
  - B4 worked: raportul anulări / execuții. Agentul A: 4,000 de ordine, 3,960 anulate, 40 executate → 99:1. Agentul B, market maker: 4,000, 3,600 anulate, 400 executate → 9:1. Utilizatorul calculează raportul lui A (99). Concluzia: și market maker-ii anulează mult; raportul singur nu e o dovadă. Contează semnătura întreagă și intenția.
  - B5 callout: simulatorul blochează tiparele de ordine care seamănă cu spoofing-ul și explică de ce (compliance guard). Un „truc” care merge în simulator nu se transferă și e ilegal pe piețele reale.
- **Try:** `surveillance-desk` (nou): datele MBO a 5 agenți. Sarcina: "Find the spoofer using distance from the touch, modification rate, cancel-to-fill ratio and opposite-side trades." Reușită: agentul corect **și** 3 semnale citate. Insigna „Compliance”.
- **Practică:** modulul de conformitate în R11 (spoofer etichetat); reluarea flash crash-ului din S20 se face în 3.7.8.
- **Check:** 1) definiția și statutul legal (mcq); 2) semnătura de supraveghere (match); 3) layering legitim vs spoofing; de ce un ordin retras nu e o dovadă (mcq).
- **Dovezi:**
  - Interdicția și cazul sancționat: **Mechanic** (lege și ordinul CFTC din 2016; R3 §6.9).
  - Dezechilibrul la cele mai bune cotații mișcă prețul pe termen foarte scurt, exact semnalul pe care îl exploatează spoofer-ii: **B** (Cont, Kukanov & Stoikov 2014 [BK]; R3 §6.10).
- **Necesită:** S8 (MBO, spoofer etichetat, extensia „compliance guard”), S20 (reluarea flash crash-ului).
- **Termeni noi de glosar:** spoofing, layering, cancel-to-fill-ratio, market-abuse

#### 3.3.8 · Market Profile and the auction
- **Nivel / durată / tip:** Advanced · 8 min · Track (Price action and order flow; lecție-punte recomandată pentru Technical analyst)
- **Obiective:**
  1. Build a TPO profile from 30-minute periods and find the POC, the 70% value area and the initial balance.
  2. Classify a session as balance or imbalance and name its day type at the close.
  3. Test the "80% rule" and value-area claims against random bands and the R0 control.
- **Concepte:** market-profile (nou), initial-balance (nou), auction-market-theory (nou), volume-profile (nou în 2.5), opening-range-breakout (nou în 2.9)
- **Se sprijină pe:** 2.5, 2.9, 3.2.8
- **Hook:** predict · alegere. "Market Profile counts time at a price or volume at a price?" Răspuns: timp (TPO, time-price opportunity). Volume profile (2.5) numără volumul.
- **Interacțiunea centrală:**
  - B1 figure: profilul TPO construit literă cu literă, câte o literă pentru fiecare perioadă de 30 de minute, la fiecare preț atins.
  - B2 worked (același algoritm ca la volume profile, în 2.5, aplicat pe timp): aria de valoare pe un profil cu 11 rânduri (100.0–101.0, pas 0.1) și numărul de TPO-uri 1, 2, 3, 5, 7, **8**, 6, 4, 3, 2, 1 (de sus în jos; POC la 100.5). Total 42; 70% = 29.4. Extinderea pornește din POC și adaugă la fiecare pas rândul vecin mai mare: 8 → +7 (100.6) = 15 → +6 (100.4) = 21 → +5 (100.7) = 26 → +4 (100.3) = 30 ≥ 29.4. Utilizatorul introduce VAH (100.7) și VAL (100.3). Notă: convenția pe un rând e cea folosită aici; unele platforme adaugă câte două rânduri și dau alte margini (R3 §6.13).
  - B3 hotspot: "Tap the high of the initial balance" (range-ul primei ore, perioadele A și B).
  - B4 match: tipul de zi ↔ forma profilului (normal, trend, double distribution, neutral).
  - B5 explain: teoria licitației: în echilibru (balance) prețul se rotește în valoare; în dezechilibru (imbalance) caută o valoare nouă. „Regula de 80%”: dacă prețul reintră în aria de valoare și rămâne două perioade, ar traversa-o des până în partea cealaltă (lore de practician).
  - B6 callout: critica din R2 §6.7: un profil valid presupune o distribuție echilibrată; un singur profil zilnic e nesigur (cercetarea sugerează ≥ 3 zile); timpul la preț nu e volumul la preț; tipul zilei e subiectiv.
- **Try:** `tpo-builder` (nou). Sarcina: "Build today's profile from its 13 periods, then mark the POC, VAH, VAL and the initial balance." Reușită: POC exact, marginile ariei de valoare la cel mult un rând, IB exact.
- **Practică:** R6 (sesiune intraday): jocul tipului de zi, cu predicția la „10:30” și scorul la închidere, 20 de sesiuni; testul „regulii de 80%” față de benzi aleatoare și pe R0.
- **Check:** 1) TPO față de volume profile (mcq); 2) aria de valoare (numeric, cu `vary` pe numărul de TPO-uri); 3) ce arată testul regulii de 80% (mcq).
- **Dovezi:**
  - Construcția profilului: **Mechanic**.
  - Tipurile de zi, regula de 80%, rotația în valoare: **D** (fără dovezi robuste; R2 §6.7; R3 §6.12–6.13).
  - Clasificarea zilei pe baza IB: **D** (R3 §3.5).
- **Necesită:** S2 (profil TPO), S5 (sesiuni), S7, S13 (variantă ușoară).
- **Termeni noi de glosar:** tpo, initial-balance, single-prints, day-type

---

## 3.4 · Classical methods under the microscope · 8 lecții

### Fișa unității

- **Scop:** analistul tehnic folosește metodele clasice (Fibonacci, Elliott, Wyckoff, armonicele, Ichimoku, Gann) ca **vocabulare**, le aplică după reguli scrise și le pune la probă cu același protocol: claim card, reformulare testabilă, control R0, regim cu structură, costuri, notă. Unitatea nu ridiculizează nicio metodă; arată ce poate susține fiecare (de obicei: un nivel de invalidare și o mărime) și ce nu (prognoza).
- **De ce aici:** README §1, principiul 6: metodele avansate și cele discutabile vin la final, cu nota lor de dovezi. R2 §9.2: testarea vine înaintea cadrelor cu dovezi slabe, ca utilizatorul să poată verifica singur afirmațiile, nu să le preia. CMT le predă ca limbaj (Elliott la Level II), deci analistul tehnic trebuie să le știe. Acoperă golul 4 din R1 §4 (Fibonacci, Elliott, armonicele și Gann prezentate ca fapt).
- **Decizii de conținut:**
  - 3.4.2 și 3.4.7 pornesc de unde se opresc 2.5 (retragerile și extensiile Fibonacci, iluzia confluenței, testul pe R0) și 2.3 (liniile Ichimoku, look-ahead): nu repetă calculele de bază, ci adaugă ancorele, clusterele, testul pe piața cu structură, sistemul complet și robustețea parametrilor.
  - „Cum se testează o metodă” (din README §3) devine **prima** lecție (3.4.1), ca protocolul să fie aplicat în toate celelalte.
  - Elliott primește **două** lecții (regulile; laboratorul de numărători alternative), pentru că falsificabilitatea lui se poate preda doar prin experiența unor numărători valide cu prognoze opuse (R2 §6.4, §8.5.9).
  - Market Profile se predă o singură dată, în 3.3.8 (vezi fișa 3.3); aici e recomandat ca lecție-punte.
  - Gann se predă la nivel de awareness, împreună cu ciclurile și metodele ezoterice (3.4.8): toate trei se evaluează cu aceeași întrebare, „ce rezultat ar putea arăta că e greșit?”.
- **Cere de dinainte:** 0.2 (random walk, mărimea eșantionului), 1.5 (swing-uri), 2.1 (testul pe random walk; point & figure), 2.2 (measured move), 2.3 (Ichimoku de bază, teoria Dow), 2.4 (ATR, Donchian), 2.5 (Fibonacci cu nota de dovezi), 2.8 (confluență vs redundanță).
- **Checkpoint `test-3-4`:** 16 întrebări (2 pe lecție) și o sarcină practică: un „method trial” preînregistrat pe o traiectorie nouă (formularul completat corect, rulat pe R0 și pe piața cu structură, cu concluzia dată după banda de zgomot).
- **Laboratorul unității: Elliott count disagreement lab** (în 3.4.4) și **Method trial** (în 3.4.1, reluat la checkpoint). În primul, utilizatorul numără 5 traiectorii (3 pe R0, 2 pe R1), înregistrează o numărătoare principală cu invalidare, primește de la generator numărătorile alternative valide și urmărește cât de des prognoza principală bate aruncarea monedei. În al doilea, alege o metodă, preînregistrează testul și îl rulează cu protocolul complet.
- **Firele din spirală:**
  - **Dovezi:** firul central; fiecare metodă primește nota ei, cu sursa.
  - **Statistică:** rata de bază, mărimea eșantionului, gradele de libertate (ancore, toleranțe, numărători alternative) ca intuiție pentru testările multiple din 3.10–3.11.
  - **Psihologie:** apofenia, confirmation bias, hindsight; „wave 3” ca scuză pentru supradimensionare.
  - **Proces:** jurnalul de cercetare și preînregistrarea (README §4: „jurnalul de cercetare” la Nivelul 3).
  - **Risc:** singura utilizare apărabilă a unei numărători sau a unei zone e invalidarea, din care vine mărimea.
- **Surse:** R2 §6.1–6.6, §6.9, §6.13, §5.8, §7.2, §7.5, §8.1–8.5, §9.2; R3 §6.15; R1 §2.10 (ME-02 … ME-09, ME-15), §4 (golul 4).

### Pe scurt

| Lecție | Hook | Try | Practică | Nota principală |
|---|---|---|---|---|
| 3.4.1 Putting a method on trial | 9 din 10 grafice într-un video | claim-lab | R0 + R1/R2, testul preînregistrat | Mechanic (protocolul) |
| 3.4.2 Fibonacci in depth | o grilă care „explică” 104.12 | fib-tester | R0 + R2 cu agenți Fibonacci | D (C pentru coordonare) |
| 3.4.3 Elliott Wave I: the rules | e validă această numărătoare? | wave-labeler | modelele injectate, apoi R1 | D |
| 3.4.4 Elliott Wave II: the alternate-count lab | câte numărători valide | alt-count-lab | Elliott count disagreement lab | D |
| 3.4.5 Wyckoff: reading ranges | spring sau breakdown | wyckoff-labeler | R2 cu agent de acumulare vs R0 | D |
| 3.4.6 Harmonic patterns | B la 0.60 în loc de 0.618 | harmonic-builder | R0 + R2, toleranța pe slider | D |
| 3.4.7 Ichimoku as a complete system | 9/26/52 față de 10/30/60 | ichimoku-system-lab | S13: sistemul vs Donchian, grila de parametri | D (A pentru familia trend following) |
| 3.4.8 Gann, cycles and the esoteric | linia de 45° după ce întinzi graficul | scale-trap + cycle-finder | R0 + R13 | D |

### Lecțiile

#### 3.4.1 · Putting a method on trial
- **Nivel / durată / tip:** Advanced · 8 min · Track (Technical analyst)
- **Obiective:**
  1. Turn a method's claim into a testable statement with a rule, an event, an outcome, a horizon and a comparison.
  2. Explain why every method needs one run on the R0 control and one on a market with the relevant structure.
  3. Pre-register a test (rules, parameters, sample size) before seeing any result.
- **Concepte:** method-trial (nou), falsifiability (nou), base-rates ✓, confirmation-bias ✓, hindsight-bias (nou în 1.2), random-walk (nou în 0.2), research-log (nou în 3.11)
- **Se sprijină pe:** 0.2, 2.1, 2.8
- **Hook:** predict · alegere. "In a course video, a method 'worked' on 9 of the last 10 charts. How much does that tell you?" Variante: a lot / something / almost nothing without the failures and the base rate. Răspuns: aproape nimic, fără eșecuri și fără rata de bază.
- **Interacțiunea centrală:**
  - B1 explain: claim card și evidence card, mereu împreună (R2 §8.4.1).
  - B2 order: pașii protocolului: claim → regulă mecanică → eveniment → rezultat → orizont → martor (rata de bază) → rulare pe R0 → rulare pe piața cu structură → costuri → notă.
  - B3 match: afirmația ↔ versiunea ei testabilă („Fibonacci 61.8% holds” ↔ "reversal of 1 ATR within 20 bars happens more often near 61.8% than near 55%"; „the wave count forecasts the trend” ↔ "the count's invalidation level is hit less often than a random stop at the same distance"; „this zone is strong” ↔ "reactions at the zone beat random zones of the same width").
  - B4 reveal: „pattern in noise”: detectorul găsește capete și umeri în 10,000 de traiectorii R0; distribuția randamentelor de după pattern e aceeași cu cea necondiționată (R2 §8.5.1).
  - B5 callout: gradele de libertate (ancore, toleranțe, timeframe-uri, numărători alternative) înseamnă mai multe feluri de a „nimeri”. Orice edge publicat e mai mic decât arată studiul: McLean & Pontiff, −26% out-of-sample și −58% după publicare (README §6).
- **Try:** `claim-lab` (nou; S7 + S13 în mod ghidat). Sarcina: "Write the testable version of 'price respects the 50% retracement' and pre-register it." Reușită: validatorul acceptă toate câmpurile: regula de ancorare mecanică (swing-uri confirmate, N fix), evenimentul (atingere la ±0.5 ATR de 50%), rezultatul (inversare de 1 ATR înainte de o continuare de 1 ATR), orizontul (20 de bare), martorul (niveluri la rapoarte aleatoare), N ≥ 200, costuri activate.
- **Practică:** testul preînregistrat rulat pe R0 și pe R1/R2; intrarea în jurnalul de cercetare („research log”), cu concluzia și ce rezultat ar fi schimbat-o.
- **Check:** 1) falsificabil sau nu (clasificarea a 4 afirmații); 2) de ce rularea pe R0 (mcq); 3) de ce preînregistrarea (mcq).
- **Dovezi:**
  - Protocolul (martor, model nul, preînregistrare): **Mechanic** (statistică; R2 §8.4–8.5; R3 §4.20).
  - Analiza tehnică, în ansamblu: **C** (Park & Irwin 2007: din 95 de studii moderne, 56 pozitive, 20 negative, 19 mixte, multe cu data snooping; R2 §8.3).
- **Necesită:** S7, S13 (mod ghidat, cu formular de preînregistrare).
- **Termeni noi de glosar:** falsifiable, pre-registration (termenul degrees-of-freedom vine din glosarul lui 3.11 și se leagă de aici)

#### 3.4.2 · Fibonacci in depth: projections, clusters and the anchor problem
- **Nivel / durată / tip:** Advanced · 8 min · Track (Technical analyst)
- **Obiective:**
  1. Compute three-point Fibonacci projections and build a cluster from several swings.
  2. Show how anchor choice multiplies the available levels, so a past reversal can almost always be "explained".
  3. Compare reversal rates at Fibonacci levels on R0 and on a market where some agents watch Fibonacci, with a mechanical anchor rule fixed in advance.
- **Concepte:** fibonacci-clusters (nou), anchor-selection (nou), fibonacci-levels (nou în 2.5), confluence (nou în 2.5), hindsight-bias (nou în 1.2), falsifiability (din 3.4.1)
- **Se sprijină pe:** 2.5 (retragerile și extensiile, iluzia confluenței, testul pe R0), 3.4.1
- **Hook:** predict · da/nu. "Price reversed at 104.12. This chart has two swing lows (100.00 and 101.50) and two swing highs (108.00 and 110.00). Can you draw a Fibonacci grid with a level within 0.15 of 104.12?" Răspuns: da, chiar două: 50% din 100.00 → 108.00 (104.00) și 61.8% din 101.50 → 108.00 (103.98).
- **Interacțiunea centrală:**
  - B1 explain: recapitularea din 2.5 într-o propoziție (retragerile, extensiile, 50% care nu e Fibonacci), apoi instrumentele noi: proiecțiile pe trei puncte, clusterele, time zones, evantaiele și arcele.
  - B2 worked: proiecția A-B-C, cu A = 100.00, B = 110.00, C = 104.00: C + k × (B − A) dă 110.18 (k = 0.618), 114.00 (k = 1.0, measured move-ul) și 120.18 (k = 1.618). Utilizatorul calculează proiecția 1.618: 120.18.
  - B3 figure, în 3 pași: o singură grilă (100.00 → 110.00, 5 niveluri) → patru grile din 2 minime × 2 maxime (20 de niveluri între 102 și 108) → banda de acoperire: cu o grilă, ~25% din prețurile dintre 102.00 și 108.00 sunt la ±0.15 de un nivel; cu patru grile, ~66%. Text: "More anchors, more 'hits'."
  - B4 explain: time zones (linii verticale la numere Fibonacci de bare), evantaie și arce. Evantaiele și arcele depind de scara graficului, același defect ca la unghiurile Gann (3.4.8).
  - B5 reveal: testul cu o regulă mecanică de ancorare (swing-uri confirmate cu N = 5, ultimul picior încheiat), rulat pe R0 și pe piața în care 30% dintre agenți urmăresc nivelurile Fibonacci: pe R0, nicio diferență față de rapoartele aleatoare; pe piața cu agenți, un efect mic. Sursa e coordonarea, nu matematica. (În 2.5, testul a rulat doar pe R0.)
  - B6 callout: Batchelor & Ramyar (2005) nu au găsit rapoarte Fibonacci speciale în ciclurile Dow Jones. Reancorarea până „iese” e hindsight.
- **Try:** `fib-tester` (nou). Sarcina: "Fix your anchor rule first. Then run the reversal test at 38.2/50/61.8% against 41/55/67% on R0 and on the Fibonacci-watcher market. Which differences are beyond noise?" Reușită: regula de ancorare e fixată înainte de rulare (validatorul o blochează) **și** concluziile sunt corecte pe ambele piețe (pe R0: niciuna; pe piața cu agenți: după intervalul de încredere din rulare).
- **Practică:** R0 și R2 cu parametrul „Fib watchers” la 0% și la 30%; plus jocul „explain the reversal”: 20 de întoarceri din trecut, pentru care utilizatorul caută o grilă la ±0.15. Rata lui de „reușită” arată cât de ușor explică hindsight-ul orice.
- **Check:** 1) o proiecție (numeric, cu `vary` pe ancore); 2) de ce mai multe ancore înseamnă mai multe „nimeriri” (mcq); 3) de unde ar putea veni un efect Fibonacci (mcq: coordonare).
- **Dovezi:**
  - „Rapoartele Fibonacci sunt speciale”: **D** (Batchelor & Ramyar 2005; R2 §6.1, §8.1).
  - Extensiile și proiecțiile ca magneți: **D** (în datele Bulkowski, al doilea picior e în medie mai scurt decât primul; ~60% din primul picior a fost atins în 60% din cazuri; R2 §6.2).
  - Clusterele: **D** (există garantat dacă folosești destule swing-uri; R2 §6.3).
  - Evantaiele și arcele: **D** (depind de scară; R2 §6.3).
  - Coordonarea la niveluri urmărite de mulți: **C** (mecanism plauzibil; R2 §8.2.1; Osler).
- **Necesită:** S3 (instrumentele Fibonacci, inclusiv proiecția pe trei puncte), S7, parametrul „Fib watchers” în generatorul de agenți (extensie S8, R3 Appendix A3).
- **Termeni noi de glosar:** fibonacci-projection, fibonacci-cluster, fibonacci-time-zones

#### 3.4.3 · Elliott Wave I: the rules
- **Nivel / durată / tip:** Advanced · 8 min · Track (Technical analyst)
- **Obiective:**
  1. Label a five-wave impulse and a three-wave correction.
  2. Check a count against the three hard rules and find the rule a count breaks.
  3. Separate rules (must hold) from guidelines (tendencies) and wave degrees.
- **Concepte:** elliott-wave (nou), invalidation-level ✓, trend ✓, fibonacci-levels (nou în 2.5)
- **Se sprijină pe:** 3.4.2, 1.5
- **Hook:** predict · da/nu. "Wave 1: 100.00 to 104.00. Wave 3: 101.60 to 104.60. Wave 5: 104.20 to 108.20. Is this a valid impulse?" Răspuns: nu. Valul 3 (3.00) e cel mai scurt dintre 1 (4.00), 3 și 5 (4.00), deci încalcă regula 2.
- **Interacțiunea centrală:**
  - B1 figure (`Candles` + `Marker`), în 4 pași: valul 1 (100.00 → 104.00) → valul 2 (→ 101.60) → valurile 3, 4 și 5 (→ 108.00, → 105.80, → 109.00) → corecția A-B-C.
  - B2 worked: raporturile: valul 2 retrage 2.40 ÷ 4.00 = 60% din 1; valul 3 = 6.40 ÷ 4.00 = 160% din 1; valul 4 retrage 2.20 ÷ 6.40 ≈ 34% din 3. Utilizatorul calculează retragerea valului 2 (60%).
  - B3 hotspot („rule violation finder”): o numărătoare în care valul 4 coboară la 103.50, sub maximul valului 1 (104.00). "Tap the wave that breaks a rule." Răspuns: valul 4 (regula 3).
  - B4 match: corecția ↔ structura (zigzag ↔ 5-3-5; flat ↔ 3-3-5; triangle ↔ 3-3-3-3-3; combinație ↔ W-X-Y).
  - B5 explain: cele trei reguli (valul 2 nu retrage mai mult de 100% din 1; valul 3 nu e niciodată cel mai scurt; valul 4 nu intră în teritoriul valului 1, cu excepția diagonalelor) față de ghiduri (alternanța, extensia, egalitatea) și gradele (de la Grand Supercycle la Subminuette, definite prin formă, nu prin durată).
  - B6 callout: CMT îl predă ca limbaj; StockCharts scrie că „nu e o tehnică de tranzacționare”.
- **Try:** `wave-labeler` (nou). Sarcina: "Label waves 1–5 and A–B–C on this impulse. The grader checks the three rules." Reușită: toate etichetele la ≤ 2 bare de pivoții reali **și** nicio regulă încălcată.
- **Practică:** modul didactic (modele injectate, R2 §0.3): 10 grafice; apoi 5 grafice R1 în care utilizatorul etichetează în timp real, pe măsură ce barele apar.
- **Check:** 1) cele trei reguli (mcq); 2) regulă sau ghid (match); 3) un raport între valuri (numeric, cu `vary`).
- **Dovezi:**
  - Regulile de numărare: definiții (o convenție, nu o dovadă).
  - Prognozele Elliott: **D** (Aronson 2006: „a story, not a legitimate theory”; Batchelor & Ramyar 2005; Mandelbrot; R2 §6.4, §8.1).
- **Necesită:** S3 (etichete de val), S7 (modul didactic cu injecție).
- **Termeni noi de glosar:** impulse-wave, corrective-wave, wave-degree, diagonal-triangle

#### 3.4.4 · Elliott Wave II: the alternate-count lab
- **Nivel / durată / tip:** Advanced · 8 min · Track (Technical analyst)
- **Obiective:**
  1. Produce a valid wave count on a random-walk path.
  2. Show that at least two other valid counts exist with opposite forecasts.
  3. Use a count only for what it can defend: an invalidation level and a position sized from it.
- **Concepte:** elliott-alternate-count (nou), elliott-wave (din 3.4.3), falsifiability (din 3.4.1), invalidation-level ✓, position-sizing ✓, confirmation-bias ✓
- **Se sprijină pe:** 3.4.3, 1.4
- **Hook:** predict · slider 1–5. "Three analysts count the same chart. How many different valid counts can there be?" Răspuns: pe traiectoria din laborator, cel puțin 3, cu prognoze opuse.
- **Interacțiunea centrală:**
  - B1 reveal: o traiectorie R0; utilizatorul face o numărătoare; aplicația arată apoi alte 3 numărători valide: una bullish (valul 3 abia începe), una bearish (un val C se termină), una neutră (un triunghi).
  - B2 explain: numărătorile alternative fac prognozele nefalsificabile: orice deznodământ are deja o numărătoare care l-a „prevăzut”; renumărarea după surprize e greșeala tipică.
  - B3 predict → reveal: "Which count did the path follow?" Reveal: pe R0, nicio numărătoare nu avea informație; rezultatul e la rata de bază.
  - B4 worked: utilizarea apărabilă. Numărătoarea spune că valul 2 nu poate coborî sub începutul valului 1 (100.00), deci stop la 99.90. Long la 101.80: distanța 1.90; cu comisioanele, 49 de unități pierd 98.05; 50 ar pierde 100.05. Utilizatorul introduce 49.
  - B5 callout: „wave 3” ca scuză pentru supradimensionare e greșeala care costă cel mai mult (R2 §6.4).
- **Try:** `alt-count-lab` (nou), adică **Elliott count disagreement lab** în forma scurtă. Sarcina: "Count this path, then find two alternate counts the grader accepts. Write the price that would invalidate each." Reușită: 3 numărători valide (verificate după reguli), cu invalidările corecte, dintre care cel puțin două au prognoze în direcții opuse.
- **Practică:** laboratorul unității, **Elliott count disagreement lab** (descris în fișa unității): 5 traiectorii, numărătoarea principală preînregistrată, scorul prognozei comparat cu aruncarea monedei.
- **Check:** 1) de ce numărătorile alternative distrug falsificabilitatea (mcq); 2) utilizarea apărabilă a unei numărători (mcq); 3) mărimea din invalidare (numeric, cu `vary`, formula din L09).
- **Dovezi:**
  - Prognozele Elliott: **D** (R2 §6.4; Aronson 2006).
  - Mărimea din invalidare: **Mechanic**.
- **Necesită:** S3, S7, generatorul de numărători alternative (modul „honest” din R2 §6.4).
- **Termeni noi de glosar:** alternate-count

#### 3.4.5 · Wyckoff: reading ranges
- **Nivel / durată / tip:** Advanced · 8 min · Track (Technical analyst)
- **Obiective:**
  1. Label Wyckoff events (selling climax, automatic rally, secondary test, spring, sign of strength, last point of support) on a generated accumulation range.
  2. State the three laws and explain why the Composite Man is a study heuristic, not a fact about manipulation.
  3. Label events in real time and count how many "springs" turned into breakdowns.
- **Concepte:** wyckoff-method (nou), wyckoff-spring (nou), liquidity-sweep (din 3.1.3), range ✓, base-rates ✓
- **Se sprijină pe:** 3.4.1, 3.1.3, 2.1 (point & figure), 2.5
- **Hook:** predict · alegere. "Price dips below the range low of 95.00 to 94.40, then closes back at 95.30. Spring or breakdown?" Variante: spring / breakdown / can't know yet. Răspuns: încă nu se poate ști. „Spring” e un nume dat de obicei retrospectiv.
- **Interacțiunea centrală:**
  - B1 figure: schema de acumulare, cu fazele A–E și evenimentele (PS, SC, AR, ST, spring, test, SOS, LPS), construită pe rând.
  - B2 match: legea ↔ exemplul (supply and demand ↔ prețul urcă atunci când cererea depășește oferta; cause and effect ↔ lățimea range-ului, numărată pe point & figure, ca „țintă”; effort vs result ↔ volum mare fără progres de preț).
  - B3 hotspot: "Tap the selling climax and the automatic rally."
  - B4 reveal (varianta în timp real): barele apar una câte una; la scufundarea sub 95.00, utilizatorul alege „spring”, „breakdown” sau „wait”; urmează dezvăluirea.
  - B5 explain: Wyckoff e sursa multor termeni SMC: spring și upthrust → „liquidity sweep”; Composite Man → „smart money” (R3 §6.15; 3.5).
  - B6 callout: părțile care rezistă (accentul pe forța relativă și pe un raport câștig/risc ≥ 3) sunt consistente cu idei mai bine susținute (momentum, managementul riscului).
- **Try:** `wyckoff-labeler` (nou). Sarcina: "Label six events on this generated accumulation range. Then label five more ranges in real time." Reușită: ≥ 5/6 evenimente la ≤ 3 bare de adevărul din generator **și**, în partea în timp real, numărul de „springs” care au devenit breakdown-uri raportat corect.
- **Practică:** generatorul plantează acumulare cu un agent ascuns în 50% din range-uri și nimic în celelalte (R3 §6.15). Utilizatorul clasifică 20 de range-uri (acumulare / distribuție / aleator); scorul se compară cu hazardul.
- **Check:** 1) evenimentele (match); 2) Composite Man ca euristică (mcq); 3) spring vs breakdown și hindsight-ul (mcq).
- **Dovezi:**
  - Schemele prezic: **D** (fără studii robuste; etichetele se pun ușor retrospectiv; R2 §6.6; R3 §6.15).
  - „Cauza și efectul” (ținta din P&F): **D**.
  - Elementele de risc (R:R ≥ 3): **Mechanic**; forța relativă: **A** (momentumul cross-sectional, R2 §6.10).
- **Necesită:** S7 (range-uri cu agent plantat și range-uri aleatoare), S8 (agentul de acumulare ascuns), S4 (point & figure, opțional).
- **Termeni noi de glosar:** composite-man, selling-climax, spring, upthrust, sign-of-strength

#### 3.4.6 · Harmonic patterns
- **Nivel / durată / tip:** Advanced · 7 min · Track (Technical analyst)
- **Obiective:**
  1. Build a Gartley from its X, A, B, C and D points and check its ratios.
  2. Show how the number of detected patterns explodes as the ratio tolerance loosens.
  3. Compare reactions at the potential reversal zone with random five-point zigzags of the same leg lengths.
- **Concepte:** harmonic-patterns (nou), fibonacci-levels (nou în 2.5), fibonacci-clusters (din 3.4.2), confluence (nou în 2.5), measured-move (nou în 2.2)
- **Se sprijină pe:** 3.4.2, 2.2
- **Hook:** predict · da/nu. "A Gartley needs B at 0.618 of XA. Your B is at 0.600. Valid?" Răspuns: depinde de toleranța aleasă. Iar toleranța decide câte pattern-uri găsești.
- **Interacțiunea centrală:**
  - B1 figure, în 4 pași: X 100.00 → A 110.00 → B 103.82 (0.618 din XA) → C 107.64 (0.618 din AB) → D 102.14 (0.786 din XA).
  - B2 worked: proiecția BC = CD ÷ BC = 5.50 ÷ 3.82 ≈ 1.44, în intervalul 1.27–1.618 cerut de Gartley. Utilizatorul introduce 1.44 (toleranță 0.02).
  - B3 match: pattern-ul ↔ rapoartele care îl definesc (Gartley ↔ B 0.618, D 0.786 XA; Bat ↔ B sub 0.618, D 0.886 XA; Butterfly ↔ B 0.786, D 1.27 XA; Crab ↔ D 1.618 XA).
  - B4 figure cu slider: toleranța de la ±1% la ±10%; numărul de detecții pe 2,000 de bare crește vizibil.
  - B5 callout: nicio dovadă peer-reviewed găsită; chiar site-ul lui Carney avertizează că rezultatele ipotetice au limite; AB=CD e measured move-ul clasic (2.2).
- **Try:** `harmonic-builder` (nou). Sarcina: "Drag D so the pattern becomes a valid Bat, then run the reversal-zone test against random zigzags." Reușită: D la 0.886 din XA, în toleranța afișată, cu proiecția BC ≥ 1.618 (validatorul confirmă) **și** concluzia testului citită corect.
- **Practică:** R0 și R2: detecțiile armonice față de zigzaguri aleatoare cu 5 puncte și aceleași lungimi ale picioarelor (R2 §6.5), cu toleranța pe slider.
- **Check:** 1) verificarea raportelor unui Gartley (numeric, cu `vary`); 2) toleranța și numărul de detecții (mcq); 3) nota (mcq).
- **Dovezi:** **D** (fără dovezi peer-reviewed; mulți parametri liberi; R2 §6.5, §8.1).
- **Necesită:** S3 (instrumentul XABCD), S7.
- **Termeni noi de glosar:** xabcd, potential-reversal-zone, gartley

#### 3.4.7 · Ichimoku as a complete system
- **Nivel / durată / tip:** Advanced · 8 min · Track (Technical analyst)
- **Obiective:**
  1. Write the full Ichimoku trading rules (filter, trigger, confirmation, exit and stop) as a mechanical system.
  2. Compare the system with its simplest component, a Donchian-midline trend rule, after costs on trend, range and random-walk markets.
  3. Check whether the default parameters sit on a plateau or on a lucky spike by testing neighbouring settings.
- **Concepte:** ichimoku-system (nou), ichimoku-basics (nou în 2.3), volatility-channels (nou în 2.4), look-ahead-bias (nou în 2.3), confluence (nou în 2.5), parameter-plateau (nou în 3.11)
- **Se sprijină pe:** 2.3 (liniile Ichimoku, mijloacele Donchian, capcanele de look-ahead), 2.8 (trend following), 3.4.1
- **Hook:** predict · alegere. "Ichimoku's defaults are 9, 26 and 52. If the method is robust, how much should results change at 10, 30 and 60?" Variante: a lot / a little / not at all. Răspuns: puțin. O metodă robustă stă pe un platou; un vârf izolat sugerează potrivire pe date.
- **Interacțiunea centrală:**
  - B1 figure: recapitularea din 2.3 într-un pas (cele cinci linii), apoi regulile sistemului, aprinse pe rând: filtrul (prețul deasupra norului) → declanșatorul (Tenkan trece peste Kijun) → confirmarea (Chikou peste prețul de acum 26 de bare, citit „as-of”) → ieșirea (închidere sub Kijun) → stop-ul (sub Kijun, cu buffer).
  - B2 order: cele cinci reguli, în ordinea în care se aplică.
  - B3 worked: intrare la 104.00, Kijun la 102.00, stop la 101.90 (distanța 2.10). Cu comisioanele, 45 de unități pierd 99.14 la stop; 46 ar pierde 101.35. Utilizatorul introduce 45.
  - B4 reveal: curbele de capital după costuri: sistemul complet față de o regulă simplă pe mijlocul canalului Donchian de 26, pe R1, R2 și R0 (rezultatul simulatorului). Utilizatorul vede dacă condițiile în plus adaugă ceva peste filtrul de trend.
  - B5 figure: harta parametrilor în jurul lui (9, 26, 52): expectanța netă pe o grilă de vecini; platou sau vârf.
  - B6 callout: familia trend following are dovezi solide pe orizonturi de luni; regulile specifice Ichimoku nu au fost testate robust. Cele cinci condiții folosesc aceleași maxime și minime (2.3), deci nu sunt cinci confirmări.
- **Try:** `ichimoku-system-lab` (nou). Sarcina: "Write the full rule set, run it against the Donchian baseline on R1, R2 and R0 with costs, then test three neighbouring parameter sets." Reușită: regulile sunt complete (intrare, ieșire, stop, mărime) și calculul as-of e pornit **și** concluziile sunt corecte după intervalele de încredere, inclusiv eticheta „plateau” sau „spike”.
- **Practică:** S13: același sistem pe 5 piețe sintetice (R1, R2, R3, R4, R0), cu intrarea în jurnalul de cercetare.
- **Check:** 1) ordinea regulilor (order); 2) mărimea cu stop sub Kijun (numeric, cu `vary`); 3) platou sau vârf (mcq pe o hartă de parametri).
- **Dovezi:**
  - Semnalele Ichimoku: **D** (fără dovezi robuste; R2 §5.8, §8.1).
  - Familia trend following pe orizonturi de luni: **A** (Moskowitz, Ooi & Pedersen 2012; R2 §8.1); nu se transferă automat la parametrii Ichimoku.
  - Verificarea pe vecinii parametrilor, ca test de robustețe: **Mechanic** (metodă; detaliată în 3.11).
- **Necesită:** S2 (Ichimoku, Donchian), S13 (backtest as-of, grilă de parametri), S7.
- **Termeni noi de glosar:** ichimoku-system, parameter-grid

#### 3.4.8 · Gann, cycles and the esoteric
- **Nivel / durată / tip:** Advanced · 7 min · Track (Technical analyst) · awareness
- **Obiective:**
  1. Show that a Gann 1×1 angle depends on chart scaling by rescaling the axes.
  2. Find "cycles" with spectral analysis on pure noise and explain why they appear.
  3. Evaluate an esoteric claim (astrology, numerology) with the trial protocol instead of accepting or mocking it.
- **Concepte:** gann-methods (nou), scale-dependence (nou), spurious-cycles (nou), falsifiability (din 3.4.1), base-rates ✓
- **Se sprijină pe:** 3.4.1, 3.4.2
- **Hook:** predict · da/nu. "A 45° line from a major low touches three later lows. Does it still touch them after you stretch the chart sideways?" Răspuns: nu. Unghiul depinde de scara graficului.
- **Interacțiunea centrală:**
  - B1 figure („scale trap”): aceleași date la două rapoarte de aspect; linia 1×1 atinge alte bare.
  - B2 explain: metodele Gann (unghiurile, Square of Nine, datele aniversare); baza lor e descrisă ca „geometrie, astronomie, astrologie, analiza ciclurilor de timp”; nu există un istoric auditat; anecdotele despre câștigurile lui sunt de mâna a doua.
  - B3 reveal: analiza spectrală pe R0 arată vârfuri; „ciclul dominant” se schimbă cu fereastra aleasă (R2 §6.13).
  - B4 match: afirmația ↔ ce se poate spune despre ea (unghiul Gann ↔ depinde de scară; Square of Nine ↔ niciun mecanism testabil; ciclul prezidențial ↔ data mining, s-a estompat; „ciclul lunar” ↔ se testează cu protocolul).
  - B5 callout: de ce persistă metodele ezoterice: se predau ușor, arată convingător, iar guru-ii care au supraviețuit sunt cei vizibili (R1 §4, golul 4; ME-15).
- **Try:** `scale-trap` și `cycle-finder` (noi). Sarcina: "Rescale the chart until the 1×1 angle touches a different low. Then find the 'dominant cycle' in two samples of pure noise." Reușită: două bare atinse diferit la două scări **și** două lungimi de ciclu diferite în cele două eșantioane de zgomot.
- **Practică:** un method trial pe o afirmație ezoterică aleasă din listă, preînregistrat și rulat pe R0 și pe R13 (unde e injectat un efect de calendar real), ca utilizatorul să vadă că protocolul găsește un efect real și respinge unul fals.
- **Check:** 1) dependența de scară (mcq); 2) ciclurile în zgomot (mcq); 3) protocolul aplicat unei afirmații ezoterice (order).
- **Dovezi:**
  - Gann: **D** (geometrie dependentă de scară, fără istoric auditat; R2 §6.9; Kaufman îl pune lângă astrologia financiară, R1 §4).
  - Majoritatea ciclurilor și pattern-urilor sezoniere publicate: **D** (data mining, estompare după publicare; R2 §6.13).
  - Vârfurile spectrale în zgomot: **Mechanic** (statistică).
- **Necesită:** S4 (scalarea axelor), S7, S13, regimul R13.
- **Termeni noi de glosar:** gann-angle, square-of-nine, spectral-analysis

---

## 3.5 · Smart money concepts, decoded · 6 lecții

### Fișa unității

- **Scop:** mulți utilizatori vin cu vocabularul SMC/ICT de pe internet. Pleacă știind, pentru fiecare termen: (a) faptul mecanic din spatele lui, dacă există; (b) conceptul clasic pe care îl redenumește; (c) o ipoteză falsificabilă pe care o pot testa în simulator, față de R0. Fiecare termen se încadrează într-una din trei categorii: **real** (mecanism sau tendință documentată), **redenumit** (concept clasic sub alt nume) sau **nefalsificabil** (narațiune care explică orice deznodământ). Nicio afirmație SMC nu e prezentată ca stabilită; vocabularul se predă pentru că utilizatorul îl va întâlni peste tot (R3 §7.0).
- **De ce aici:** după 3.1 (dovezile despre lichiditate), 3.2–3.3 (fluxul real de ordine, cu care se compară fluxul „dedus din lumânări”) și 3.4 (Wyckoff, Fibonacci și protocolul de testare). R3 §8.3: SMC după lichiditate și order flow. Acoperă golul 18 din R1 §4: memele moderne predate ca adevăr proprietar.
- **Cere de dinainte:** 3.1, 3.4.1, 3.4.2, 3.4.5; recomandat 3.3; plus 1.5 (structura), 2.5 (gap-uri, supply/demand), 2.6 (traps), 2.9 (sesiuni).
- **Checkpoint `test-3-5`:** 12 întrebări (2 pe lecție: termen ↔ concept clasic; real / redenumit / nefalsificabil) și o sarcină practică: o regulă SMC formalizată, cu raportul pe R0 și pe piața cu structură, cu costuri.
- **Laboratorul unității: SMC claim-test lab** (în 3.5.6). Utilizatorul alege o afirmație din lista H1–H4 (R3 §7.2) sau propune una, o formalizează cu toți parametrii expuși, îi îngheață parametrii, o rulează in-sample, out-of-sample, pe R0 și pe piața cu „stops ON / OFF”, cu costuri, și își dă singur nota, cu o propoziție despre ce l-ar face să o schimbe. Se notează completitudinea și consistența raportului, nu rezultatul.
- **Harta termenilor:** lecțiile acoperă toate cele 47 de rânduri din tabelul R3 §7.1. Termenii frecvenți apar în exercițiile de potrivire (în runde de 3–5 perechi, după PLAN_LEARN §4.2); cei rari (unicorn, quasimodo, propulsion block, NWOG/NDOG, volume imbalance, quarterly theory, institutional order flow) apar în beat-urile de explicație. Fiecare termen are în Library o fișă cu aceeași structură: termen → cum se identifică → echivalentul clasic → verdict, cu nota.
- **Firele din spirală:**
  - **Dovezi:** firul central; nota pentru fiecare afirmație.
  - **Psihologie:** atribuirea intenției, hindsight-ul, refuzul de a accepta pierderea („I was the liquidity”).
  - **Costuri:** intrările cu stop foarte strâns au un edge pe trade mai mic decât costurile.
  - **Proces:** reguli cu parametri expuși, înghețați înainte de out-of-sample.
  - **Statistică:** gradele de libertate (N-ul swing-urilor, închidere vs fitil, corp vs fitil, timeframe-uri).
- **Surse:** R3 §7.0–7.2, §3.13, §4.2–4.3, §5.4–5.9, §6.15, §1.9, §1.11; R2 §6.1, §6.6, §8.4; R1 §4 (golul 18).

### Pe scurt

| Lecție | Hook | Try | Practică | Nota principală |
|---|---|---|---|---|
| 3.5.1 Where SMC comes from | ce se poate verifica pe grafic | smc-map (sortare pe straturi) | reluarea „narrative vs data” | D pentru „smart money” ca actor unic |
| 3.5.2 Structure words | e un CHoCH? | structure-labeler | H: CHoCH pe R0 vs R1/R2 | D (A pentru trend following lung) |
| 3.5.3 Liquidity words | ce a găsit singurul test sistematic | smc-map (match) + H1 | H1 pe R0, stops ON/OFF | B pentru clustering; D pentru reversal |
| 3.5.4 Zone words | un order block care eșuează devine… | smc-claim-lab (H3) | R0 + R2, IS/OOS | D |
| 3.5.5 Time and algorithm words | breakout-ul de la London open | smc-claim-lab (H4) | statisticile proprii în/în afara ferestrelor | A pentru volatilitate; D pentru direcție și IPDA |
| 3.5.6 SMC claim-test lab | 68% in-sample | smc-claim-lab (complet) | laboratorul + Arena „false breakout” | D (SMC în ansamblu) |

### Lecțiile

#### 3.5.1 · Where SMC comes from and how to read it
- **Nivel / durată / tip:** Advanced · 7 min · Track (Technical analyst; Price action and order flow)
- **Obiective:**
  1. Describe where ICT and SMC come from and why there is no official rulebook.
  2. Sort any trading claim into mechanics, statistical tendency or narrative.
  3. Spot the conflicts of interest in how a method is sold (courses, paid indicators, prop-challenge funnels).
- **Concepte:** smart-money-concepts (nou), claim-layers (nou), intent-attribution (nou), market-participants (nou în 0.1), hindsight-bias (nou în 1.2), confirmation-bias ✓
- **Se sprijină pe:** 3.1, 3.4.1
- **Hook:** predict · alegere. "'Smart money engineered liquidity above the highs, then delivered price to the order block.' Which part could you check on a chart?" Variante: "engineered" / "liquidity above the highs" / "delivered" / all of it / none of it. Răspuns: doar „liquidity above the highs”, și aceea indirect (stop-urile stau plauzibil acolo; 3.1).
- **Interacțiunea centrală:**
  - B1 explain: originea. ICT („Inner Circle Trader”, Michael J. Huddleston) e un mentorat de pe YouTube; SMC e mișcarea mai largă care i-a reambalat termenii, plus idei din supply/demand și Wyckoff. Nu există un regulament oficial; definițiile diferă între autori și ani; vânzătorii de indicatori au ajuns standardizatorii de facto.
  - B2 figure (`Flow`), în 3 pași: mecanica → tendințele statistice → narațiunile, fiecare cu un exemplu.
  - B3 match, în două runde de câte 3 afirmații: afirmația ↔ stratul („a triggered stop becomes a market order” ↔ mecanică; „stops cluster just beyond round numbers” ↔ tendință; „the algorithm delivers price to the gap” ↔ narațiune; apoi „volatility rises at session opens” ↔ tendință; „institutions defend the order block” ↔ narațiune; „spreads widen before news” ↔ mecanică).
  - B4 explain: atribuirea intenției. Orice deznodământ se poate povesti după aceea: dacă nivelul ține, „instituțiile l-au apărat”; dacă cedează, „au indus lichiditate”. O explicație care se potrivește oricărui rezultat nu prezice nimic. Tot aici: „institutional order flow” dedus din structura lumânărilor e un nume greșit; fluxul real de ordine cere date de tranzacții și de carte (3.3).
  - B5 callout: participanții sunt eterogeni (Harris): informați, neinformați, fonduri indexate, hedgeri, market maker-i. Nu există un singur actor coordonat numit „smart money”; multe instituții tranzacționează din motive care n-au legătură cu informația. Conflictul de interese (R3 §7.1, rândul 47): SMC e vândut des împreună cu cursuri, indicatori și provocări de prop firm.
- **Try:** `smc-map` (nou), modul de sortare. Sarcina: "Sort 12 statements from trading videos into mechanics, tendency or narrative." Reușită: ≥ 10/12.
- **Practică:** reluarea „narrative vs data” (R3 §7.2, recomandarea 3): același grafic R11, întâi cu suprapunerea narativă SMC, apoi cu fluxul real al agenților din generator. Utilizatorul notează 3 nepotriviri.
- **Check:** 1) clasificarea pe straturi (match); 2) de ce atribuirea intenției nu se poate testa (mcq); 3) conflictele de interese (mcq).
- **Dovezi:**
  - Eterogenitatea participanților (informați și neinformați): **B** (Kyle 1985, Glosten–Milgrom 1985, Harris [BK]; R3 §1.9).
  - „Smart money” ca actor unic și coordonat: **D** (R3 §7.1, rândul 1).
- **Necesită:** S8 (adevărul agenților, pentru reluarea „narrative vs data”), S7.
- **Termeni noi de glosar:** smc, ict, intent-attribution

#### 3.5.2 · Structure words: BOS, CHoCH, MSS, displacement
- **Nivel / durată / tip:** Advanced · 7 min · Track (Technical analyst; Price action and order flow)
- **Obiective:**
  1. Map BOS, CHoCH, MSS and displacement to Dow-theory structure and momentum.
  2. Show that structure labels change with the swing length N and with the close-versus-wick rule.
  3. Test a CHoCH reversal rule against the R0 control.
- **Concepte:** break-of-structure (nou), change-of-character (nou), displacement (nou), trend ✓, dow-theory (nou în 2.3), swing-points (nou în 1.5)
- **Se sprijină pe:** 3.5.1, 1.5, 2.3
- **Hook:** predict · da/nu. Un uptrend; ultimul higher low e străpuns de un fitil, dar lumânarea se închide deasupra lui. "Is this a change of character?" Răspuns: depinde de regulă (închidere sau fitil) și de N-ul swing-urilor. Reveal: ambele variante, una lângă alta.
- **Interacțiunea centrală:**
  - B1 match, în două runde: termenul ↔ conceptul clasic (BOS ↔ un nou maxim în uptrend, continuarea Dow; CHoCH ↔ prima rupere a ultimului higher low, semnalul Dow de eșec al trendului; MSS ↔ breakout eșuat urmat de inversare, „1-2-3 reversal”; displacement ↔ momentum, trend bars, „spike”-ul lui Brooks); apoi internal / external structure ↔ swing-urile mici dintr-un picior față de swing-urile mari ale trendului; daily bias ↔ trendul pe timeframe-ul superior; fractal / top-down alignment ↔ analiza pe mai multe timeframe-uri, unde fiecare timeframe în plus e un grad de libertate în plus.
  - B2 figure cu slider: N între 2 și 10; etichetele BOS/CHoCH se redesenează, iar numărul de CHoCH-uri se schimbă.
  - B3 predict: regula de închidere față de cea de fitil: "Which rule gives more CHoCH labels on this chart?" Răspuns: fitilul.
  - B4 reveal: modul „real-time”: un swing se confirmă abia după N bare, deci etichetele vin cu întârziere; indicatorii care „repictează” ascund asta.
  - B5 callout: urmărirea trendului are dovezi solide pe orizonturi de luni în futures (time-series momentum); regulile intraday de etichetare a swing-urilor nu au fost testate ca atare.
- **Try:** `structure-labeler` (nou). Sarcina: "Label BOS and CHoCH on these 120 candles with N = 3 and the close rule. Then switch to N = 5 and count how many labels changed." Reușită: ≥ 90% potrivire cu detectorul **și** numărul de etichete schimbate raportat corect.
- **Practică:** ipoteza "After a CHoCH (N = 3, close rule), the next 10-bar return is in the new direction more often than after a random bar", rulată în S13 pe R0 și pe R1/R2, cu costuri. În Arena: scenariul „reversal”.
- **Check:** 1) termenul ↔ conceptul clasic (match); 2) cum schimbă N și regula etichetele (mcq); 3) nota pentru „CHoCH semnalează inversarea” (mcq).
- **Dovezi:**
  - BOS, CHoCH, MSS și displacement sunt structura Dow și momentumul, redenumite: **Mechanic** (o corespondență de definiții, nu o afirmație despre viitor; R3 §7.1, rândurile 8–11).
  - „CHoCH semnalează inversarea”: **D** (regulile de swing intraday netestate; R3 §4.3).
  - Urmărirea trendului pe luni: **A** (Moskowitz, Ooi & Pedersen 2012 [BK]; R3 §4.3).
  - Displacement ca descriere a unei mișcări rapide: **Mechanic**; ca predicție: **D**.
- **Necesită:** S7, S13, detector de structură cu parametri expuși (R3 Appendix A5).
- **Termeni noi de glosar:** bos, choch, mss, displacement

#### 3.5.3 · Liquidity words: BSL, SSL, sweeps, inducement
- **Nivel / durată / tip:** Advanced · 7 min · Track (Technical analyst; Price action and order flow)
- **Obiective:**
  1. Map buy-side and sell-side liquidity, equal highs and lows, sweeps, inducement, the Judas swing and turtle soup to stop clustering and failed breakouts.
  2. State which part is documented (stops cluster and accelerate price) and which is contradicted (sweeps reverse).
  3. Rewrite one liquidity claim as a testable hypothesis (H1).
- **Concepte:** inducement (nou), liquidity-pool (din 3.1.1), liquidity-sweep (din 3.1.3), equal-highs-lows (din 3.1.4), stop-clustering (din 3.1.2), false-breakout ✓
- **Se sprijină pe:** 3.1.2, 3.1.3, 3.1.4, 3.5.1
- **Hook:** predict · alegere. "'They swept the lows, now we go up.' What did the only systematic test found by our research show?" Variante: reversal / continuation / no effect. Răspuns: continuare (Mahadzva 2026, preprint nerecenzat, G10 FX: trei reguli construite separat au fost de acord în 65 din 66 de fold-uri).
- **Interacțiunea centrală:**
  - B1 match, în două runde (4 + 4 perechi): BSL ↔ stop-uri de cumpărare deasupra maximelor; SSL ↔ stop-uri de vânzare sub minime; EQH/EQL ↔ dublă temă / dublu fund; sweep, raid, stop hunt ↔ breakout eșuat, spring Wyckoff, 2B (Sperandeo), turtle soup (Connors & Raschke), swing failure pattern; apoi inducement ↔ shake-out, traderi prinși; Judas swing ↔ ruperea eșuată a opening range-ului; draw on liquidity ↔ o țintă la un maxim sau minim anterior; external / internal range liquidity ↔ marginile range-ului față de nivelurile de retragere din interior.
  - B2 explain: ce e real: stop-urile se adună și accelerează prețul (Osler; 3.1.2–3.1.3). Ce e contrazis: „după sweep vine inversarea”. Ce nu se poate testa: intenția („inducement”, „they hunted”).
  - B3 predict → reveal: rezultatele din 3.1.3, rulate acum pe trei piețe: R0, „stops ON” și „stops OFF”.
  - B4 order: construcția lui H1: evenimentul (cel puțin 1 tick peste maximul zilei anterioare, apoi închidere înapoi sub el într-o bară) → rezultatul (randamentul pe următoarele 10 bare e negativ) → martorul (o bară aleatoare) → piețele (R0, stops ON, stops OFF).
  - B5 callout: „I was the liquidity” transformă orice pierdere într-o poveste despre alții și blochează recenzia deciziei.
- **Try:** `smc-map`, modul match, plus constructorul de ipoteze. Sarcina: "Match 7 liquidity terms to their classical names, then complete H1 in the claim lab." Reușită: 7/7 potriviri (cu cel mult două încercări) **și** câmpurile lui H1 validate.
- **Practică:** H1 rulat în claim lab pe R0, „stops ON” și „stops OFF”, câte 500 de evenimente, cu costuri.
- **Check:** 1) termen ↔ concept clasic (match); 2) ce e documentat și ce e contrazis (mcq); 3) forma unei ipoteze testabile (order).
- **Dovezi:**
  - Stop-urile se adună și accelerează prețul: **B** (Osler; R3 §5.1, §5.4).
  - „Sweep → reversal”: **D** (contrazis; R3 §7.2).
  - Inducement, Judas swing: **D** (intenție care nu se poate demonstra; R3 §7.1, rândurile 6–7).
  - Turtle soup, numele împrumutat de la Connors & Raschke (1995): **D** ca afirmație de inversare (R3 §7.1, rândul 42).
- **Necesită:** S7, S13, S8 cu comutatorul „stops ON / OFF”.
- **Termeni noi de glosar:** buy-side-liquidity, sell-side-liquidity, inducement, judas-swing, swing-failure-pattern, draw-on-liquidity (turtle-soup există deja, din 2.8)

#### 3.5.4 · Zone words: order blocks, FVGs, premium and discount
- **Nivel / durată / tip:** Advanced · 8 min · Track (Technical analyst; Price action and order flow)
- **Obiective:**
  1. Map order block, breaker, mitigation block, FVG, consequent encroachment, premium and discount and OTE to supply and demand zones, role reversal, gaps, the 50% rule and Fibonacci 61.8–78.6%.
  2. Apply a strict order-block rule set and notice how "mitigation" can explain every outcome.
  3. Test order-block reactions against random candles at equal distance (H3).
- **Concepte:** order-block (nou), premium-discount (nou), optimal-trade-entry (nou), fair-value-gap (din 3.1.5), supply-demand-zones (nou în 2.5), fibonacci-levels (nou în 2.5)
- **Se sprijină pe:** 3.1.5, 3.1.6, 3.4.2, 3.5.2
- **Hook:** predict · alegere. "An order block fails. In SMC language it becomes…?" Variante: a mistake / a breaker block / 'mitigated' / any of these, depending on the author. Răspuns: oricare, în funcție de autor. Asta face afirmația greu de falsificat.
- **Interacțiunea centrală:**
  - B1 match, în trei runde (4 + 4 + 4 perechi): OB ↔ baza unei zone supply/demand; breaker ↔ role reversal (suportul devine rezistență); mitigation block ↔ role reversal după un swing eșuat; rejection block ↔ zona fitilului unui pin bar; apoi FVG ↔ gap-ul de trei lumânări, „window”, single prints; consequent encroachment ↔ 50% din gap; IFVG ↔ role reversal al unui gap; BPR ↔ gap-uri opuse suprapuse; apoi premium/discount ↔ regula de 50%; OTE (62–79%, „sweet spot” 70.5%) ↔ Fibonacci 61.8–78.6%; dealing range ↔ range-ul de tranzacționare sau ultimul impuls; PD arrays ↔ o listă de tipuri de zone S/R. Termenii rari apar într-un beat de explicație, cu echivalentul lor: volume imbalance ↔ un gap mic între corpuri; NWOG/NDOG ↔ gap-ul de weekend sau de sesiune; propulsion / vacuum block ↔ o zonă de continuare, un gap de știri; unicorn ↔ un breaker suprapus cu un FVG; quasimodo ↔ o variantă de cap și umeri; mitigation / rebalancing ↔ revenirea prețului într-o zonă de tranzacționare anterioară.
  - B2 worked: dealing range 100.00 → 110.00. Echilibrul: 105.00. Banda OTE pentru un long: 110 − 0.62 × 10 = 103.80 până la 110 − 0.79 × 10 = 102.10; „sweet spot”: 110 − 0.705 × 10 = 102.95. Utilizatorul calculează echilibrul (105.00) și sweet spot-ul (102.95).
  - B3 figure: detecția unui OB cu reguli stricte, în 4 pași: deplasarea ≥ 1.5 ATR → ruperea unui swing → ultima lumânare opusă dinaintea deplasării → zona = corpul ei.
  - B4 reveal: ce s-a găsit: FVG-urile se revizitează la fel de des ca nivelurile aleatoare pe modelul nul (83.4% față de 83.5%, 3.1.5); un backtest al unui broker, cu metodologie nepublicată, a raportat că OB-urile luate singure au ținut în ~43% din cazuri.
  - B5 callout: 15 zone pe un singur grafic înseamnă că „totul e zonă”; schimbarea timeframe-ului până apare o zonă e aceeași greșeală (R3 §7.2).
- **Try:** `smc-claim-lab` (nou), presetul H3. Sarcina: "Set the order-block rule set, then compare reactions with random candles at equal distance on R0 and on the structured market." Reușită: setul de reguli e complet (toți parametrii completați) **și** rezultatele sunt etichetate corect („within noise” sau „beyond noise”).
- **Practică:** R0 și R2 cu „stops ON”; apoi utilizatorul încearcă să „îmbunătățească” regula OB pe datele in-sample și vede degradarea out-of-sample (R3 §5.8).
- **Check:** 1) termen ↔ concept clasic (match); 2) premium/discount și OTE (numeric, cu `vary` pe range); 3) de ce reetichetarea eșecurilor face afirmația nefalsificabilă (mcq).
- **Dovezi:**
  - „Order block-urile țin”: **D** (nicio dovadă peer-reviewed; backtest-ul unui broker, ~43%; R3 §5.8).
  - „FVG-urile atrag prețul”: **D** (R3 §5.9).
  - Breaker, mitigation: **D** (R3 §5.8).
  - Premium/discount: **D** (R3 §7.1, rândul 24).
  - OTE: **D** (R3 §7.1, rândul 26; Fibonacci, R2 §6.1).
- **Necesită:** S7, S13 (in-sample / out-of-sample), detectori cu parametri expuși.
- **Termeni noi de glosar:** order-block, breaker-block, mitigation, consequent-encroachment, premium-discount, optimal-trade-entry, dealing-range, pd-array

#### 3.5.5 · Time and algorithm words: killzones, PO3, IPDA, SMT
- **Nivel / durată / tip:** Advanced · 8 min · Track (Technical analyst; Price action and order flow)
- **Obiective:**
  1. Map killzones, the Silver Bullet, "macros", the Power of Three, the Asian range and SMT divergence to session volatility, Wyckoff cycles and Dow's confirmation principle.
  2. Separate the documented part (volatility follows the session clock) from the undocumented part (direction by time window).
  3. Explain why the IPDA claim cannot be falsified and conflicts with what is known about FX market structure.
- **Concepte:** killzones (nou), power-of-three (nou), ipda-claim (nou), smt-divergence (nou), fx-sessions (nou în 2.9), wyckoff-method (din 3.4.5)
- **Se sprijină pe:** 3.5.1, 3.4.5, 2.9, 3.2.1
- **Hook:** predict · da/nu. "Breakouts during the London-open window travel further. Does that make their direction more predictable?" Răspuns: nu. Distanța mai mare vine din volatilitate; direcția nu devine mai previzibilă (H4).
- **Interacțiunea centrală:**
  - B1 match, în două runde (4 + 4 perechi): killzones ↔ deschiderile și suprapunerile sesiunilor; Silver Bullet ↔ un setup filtrat după ora din zi; „macros” ↔ izbucnirile de volatilitate la ore fixe (publicări de date, fix-uri, licitații); PO3/AMD ↔ ciclul Wyckoff, „open – false move – trend day”; apoi Asian range, CBDR ↔ range-ul de peste noapte; midnight open ↔ un preț de referință la deschiderea sesiunii; SMT divergence ↔ divergența intermarket, principiul de confirmare al lui Dow; market maker buy/sell model ↔ schemele de acumulare și distribuție Wyckoff. Quarterly theory (timpul împărțit în „sferturi”, fiecare cu AMD) apare în B4, ca sezonalitate de calendar netestată.
  - B2 figure: profilul volatilității pe 24 de ore, cu sesiunile umbrite (formele în U din Tokyo și Londra, Ito & Hashimoto): partea reală.
  - B3 predict → reveal: H4 rulat pe R6 și pe R0 cu același profil de volatilitate pe sesiuni: distanța e mai mare în ferestre pe ambele piețe; direcția rămâne aproape de 50/50.
  - B4 explain: PO3. Aplicația ia 5 lumânări R0 și le povestește pe fiecare ca „accumulation, manipulation, distribution”. Orice bară OHLC poate fi povestită așa după ce s-a închis. Quarterly theory aplică aceeași poveste unor „sferturi” de timp (an, lună, săptămână, zi, 90 de minute) și e la fel de netestată.
  - B5 explain: IPDA afirmă că un algoritm central livrează prețul între lichiditate și gap-uri. FX e fragmentat, cu sute de dealeri, care internalizează peste 80% din fluxul clienților (BIS); nu există niciun omolog documentat, iar afirmația, așa cum e formulată, nu poate fi infirmată de niciun rezultat.
  - B6 callout: sursele SMC nu sunt de acord asupra ferestrelor (diferențe de 30–90 de minute) și asupra trecerii la ora de vară.
- **Try:** `smc-claim-lab`, presetul H4. Sarcina: "Test both halves of H4 on R6 and on R0 with the same session volatility." Reușită: citirea corectă: diferența de distanță e prezentă pe ambele piețe, diferența de direcție nu.
- **Practică:** statisticile din jurnal ale propriilor trade-uri, în interiorul și în afara ferestrelor (R3 §3.13), pe 30 de trade-uri.
- **Check:** 1) termen ↔ concept clasic (match); 2) partea documentată față de cea nedocumentată (mcq); 3) critica IPDA (mcq).
- **Dovezi:**
  - Volatilitatea și lichiditatea urmează ceasul sesiunilor: **A** (fapt stilizat; Ito & Hashimoto 2006 pe EBS; pentru acțiuni, sursele sunt [BK]; R3 §3.2–3.3).
  - Rolurile direcționale ale ferestrelor: **D** (R3 §3.13).
  - PO3/AMD: **D** (hindsight; R3 §7.1, rândul 32).
  - IPDA: **D**; nefalsificabil și în contradicție cu structura cunoscută a pieței FX (R3 §7.1, rândul 38; BIS).
  - SMT divergence: **D** (R3 §7.1, rândul 36).
- **Necesită:** S5 (sesiuni, ora de vară), S9 (o pereche corelată pentru SMT), S7, S13.
- **Termeni noi de glosar:** killzone, silver-bullet, power-of-three, ipda, smt-divergence, asian-range

#### 3.5.6 · SMC claim-test lab
- **Nivel / durată / tip:** Advanced · 9 min · Track (Technical analyst; Price action and order flow) · laborator
- **Obiective:**
  1. Turn one SMC idea into mechanical rules with every parameter exposed.
  2. Run it in-sample, out-of-sample, on R0 and with costs, and report the result with its sample size.
  3. Grade the claim yourself (A–F) and write which result would change your mind.
- **Concepte:** testable-reformulation (nou), method-trial (din 3.4.1), falsifiability (din 3.4.1), expectancy ✓, trading-costs ✓, base-rates ✓, overfitting (nou în 3.11), in-sample-out-of-sample (nou în 3.11)
- **Se sprijină pe:** 3.5.2–3.5.5, 3.4.1
- **Hook:** predict · slider 30–80%. "You tune an order-block rule until it wins 68% in-sample. What win rate do you expect out-of-sample?" Răspunsul utilizatorului se compară, în recap, cu rezultatul propriului laborator.
- **Interacțiunea centrală:**
  - B1 explain: H1–H4 recapitulate și formularul de raport (regulă, parametri, N, IS, OOS, R0, costuri, notă, „what would change my mind”).
  - B2 order: pașii laboratorului: alegi afirmația → scrii regulile → îngheți parametrii → rulezi in-sample → rulezi out-of-sample → rulezi pe R0 → aplici costurile → dai nota.
  - B3 worked: verificarea costurilor pentru o intrare cu stop foarte strâns: câștigul mediu 0.30, stop-ul 0.15 (2R), rata de câștig 40%. Expectanța brută pe unitate: 0.4 × 0.30 − 0.6 × 0.15 = 0.12 − 0.09 = 0.03. Costurile unui round trip pe unitate la prețul de 100.00: spread 0.10 + comision ≈ 0.0005 × 200 = 0.10, deci ≈ 0.20. Expectanța netă ≈ 0.03 − 0.20 = −0.17. Utilizatorul calculează netul (−0.17, toleranță 0.01).
  - B4 reveal: in-sample față de out-of-sample, din rularea proprie a utilizatorului.
  - B5 callout: "Grade it like a reviewer." Ce rezultat te-ar face să renunți? Dacă nu există niciunul, afirmația nu e testabilă.
- **Try:** `smc-claim-lab`, complet. Sarcina: "Submit one formalised SMC rule with an in-sample, out-of-sample, R0 and cost report." Reușită: raportul e complet (toate cele patru rulări, N ≥ 200 de evenimente pe rulare, costuri activate, parametri înghețați înainte de out-of-sample), iar nota e justificată într-o propoziție. Aplicația verifică consistența: de exemplu, nu se poate da nota B dacă intervalul out-of-sample conține zero. Rezultatul în sine nu se notează.
- **Practică:** laboratorul unității, **SMC claim-test lab**, plus 20 de trade-uri în scenariul Arena „false breakout” cu regula formalizată, etichetate în jurnal; comparația dintre rezultatele din Arena și cele din test.
- **Check:** 1) ce înseamnă IS, OOS și R0 în raport (match); 2) aritmetica costurilor (numeric, cu `vary`); 3) logica notei (mcq: ce notă e consistentă cu un raport dat).
- **Dovezi:**
  - ICT/SMC în ansamblu, ca metodă profitabilă: **D** (niciun test peer-reviewed găsit; un preprint conclude „no evidence… as literally taught”, cu o singură variantă CHoCH+FVG semnificativă pe EURUSD 1h în holdout; R3 §7.2).
  - Scăderea edge-urilor după publicare: **B** (McLean & Pontiff 2016; README §6).
  - Edge-urile mici înghițite de costuri: **Mechanic** (aritmetică; R3 §7.2, „Costs”).
- **Necesită:** S13 (IS/OOS, costuri), S7, S8 cu „stops ON / OFF”.
- **Termeni noi de glosar:** testable-hypothesis

---

## 3.6 · Macro and intermarket · 8 lecții

### Fișa unității

- **Scop:** utilizatorul explică **mecanismul**, nu doar corelația: o surpriză în date → schimbarea așteptărilor de dobândă → randamentele → dolarul, acțiunile, mărfurile. Recunoaște regimul (inflație sau dezinflație, risk-on sau risk-off, carry calm sau criză) și știe că relațiile dintre piețe se schimbă de semn. Fiecare relație vine cu cazul istoric în care a eșuat și cu o regulă de risc pentru momentul în care eșuează din nou.
- **De ce aici:** după 2.10 (surpriza, calendarul, băncile centrale de bază) și 2.11 (corelație, portfolio heat; 2.11 a arătat că o corelație crește în stres, iar 3.6.8 explică de ce, prin tipul de șoc, și cum se detectează schimbarea). Înaintea lui 3.7, care are nevoie de randamente, curbă și regimuri (R4 §9, Level 3, modulul A1). Acoperă golul 15 din R1 §4 (clase de active izolate, fără context intermarket).
- **Cere de dinainte:** 2.10, 2.11, 2.14 (mecanica forex, swap), 0.2 (eșantion, varianță). Mecanica instrumentelor de dobândă (cupon, duration, futures pe obligațiuni) e în 3.14; aici se folosește doar relația preț–randament.
- **Checkpoint `test-3-6`:** 16 întrebări (2 pe lecție) și o sarcină practică: utilizatorul identifică un regim ascuns dintr-un tablou de bord și prezice semnul reacției a 4 active la o surpriză de inflație.
- **Laboratorul unității: Correlation-flip lab** (în 3.6.8). O lume cu mai multe active, cu o schimbare de regim ascunsă: utilizatorul ține un portofoliu „acoperit” (LABX + LBND), urmărește corelația pe fereastră mobilă, detectează schimbarea și redimensionează cartea ca o cădere comună de 10% să coste cel mult 2% din cont. Se notează detecția, planul scris înainte și respectarea limitei, nu P&L-ul.
- **Firele din spirală:**
  - **Risc:** corelația spre 1 în stres; acoperiri care eșuează; asimetria carry-ului; dimensionarea pentru scenariul comun (legătura cu portfolio heat din 2.11).
  - **Statistică:** corelația pe fereastră mobilă și zgomotul ferestrelor scurte; probabilități de recesiune; scorul Brier.
  - **Dovezi:** relațiile depind de regim; ce e mecanic (preț–randament) și ce e tendință (zâmbetul dolarului).
  - **Psihologie:** povestea care explică retrospectiv orice mișcare; încrederea excesivă în identificarea ciclului.
  - **Costuri:** rotația sectorială după costuri; swap-ul pe pozițiile de carry.
- **Surse:** R4 §6.1–6.14, §2.0, §9 (Level 3, A1 și A4), §9A.12; R2 §6.10–6.12, §8.3; R1 §2.12 (MN-06 … MN-12), §4 (golul 15).

### Pe scurt

| Lecție | Hook | Try | Practică | Nota principală |
|---|---|---|---|---|
| 3.6.1 Rates: the price of money | cât scade o obligațiune pe 10 ani | yield-toy | S9, 5 zile de date | Mechanic; B |
| 3.6.2 The yield curve | curba inversată fără recesiune | curve-animator | S9, probabilitatea de recesiune | B; D pentru timing |
| 3.6.3 Inflation and regimes | NFP peste așteptări: acțiunile? | regime-switcher | R5 în două regimuri | A |
| 3.6.4 The dollar | criză globală: dolarul? | smile-placer | S9, 4 scenarii | C |
| 3.6.5 Commodities and commodity currencies | petrol +10%: indicele? | macro-link | S9, 8 săptămâni de date de stocuri | B / C |
| 3.6.6 Risk-on, risk-off and carry | câte luni de carry dispar | roro-meter | R8 și R12 | A pentru carry; B |
| 3.6.7 Business cycle and sector rotation | cât durează o expansiune | cycle-classifier | jocul de alocare sectorială | C |
| 3.6.8 When correlations flip | LABX + LBND e o acoperire? | rolling-corr | Correlation-flip lab | A |

### Lecțiile

#### 3.6.1 · Rates: the price of money
- **Nivel / durată / tip:** Advanced · 7 min · Track (Macro and news)
- **Obiective:**
  1. Convert between bond price and yield, and explain why long bonds move more for the same change in yield.
  2. Compute a real yield from a nominal yield and expected inflation.
  3. Explain how a change in the rate differential moves a currency pair.
- **Concepte:** bond-price-yield (nou), real-yield (nou), rate-differential (nou), volatility ✓
- **Se sprijină pe:** 2.10, 2.14
- **Hook:** predict · slider 0–20%. "The 10-year yield rises from 4% to 5%. By roughly how much does a 10-year zero-coupon bond fall?" Răspuns: aproximativ 9.1%.
- **Interacțiunea centrală:**
  - B1 worked: prețul unei obligațiuni zero-cupon = 100 ÷ (1 + y)^n. Pe 10 ani: 100 ÷ 1.04^10 = 67.56; 100 ÷ 1.05^10 = 61.39; schimbarea: −9.1%. Pe 2 ani: 92.46 → 90.70, adică −1.9%. Utilizatorul calculează schimbarea pe 10 ani (−9.1%, toleranță 0.2).
  - B2 figure (`yield-toy`): slider-ul de randament; barele LBND, ale unui proxy de acțiuni de creștere și LGLD reacționează. Pași: randamentul urcă → obligațiunea scade → activele „cu durată lungă” scad mai mult.
  - B3 worked: randamentul real = 4.50% − 2.50% (inflația așteptată) = 2.00%. Utilizatorul introduce 2.00.
  - B4 explain: diferențialul de dobândă și cursul: când dobânda LCB crește față de cea a monedei VFUN, LFX tinde să urce, pentru că deținerea vUSD aduce mai mult.
  - B5 predict: "Yields rose because growth expectations rose. Do equities fall?" Varianta „growth” față de varianta „inflation / term premium”: în prima, acțiunile pot crește; în a doua, de obicei scad. Reveal pe cele două scenarii sintetice.
  - B6 callout: confuzia preț–randament (prețul scade când randamentul crește) e cea mai frecventă greșeală.
- **Try:** `yield-toy` (nou). Sarcina: "Set the yield so the 10-year zero-coupon bond prices at 70.00." Reușită: randamentul la ±0.02 puncte procentuale de 3.63%.
- **Practică:** lumea macro S9: 5 zile sintetice cu date; înainte de fiecare publicare, utilizatorul prezice semnul reacției pentru LB10, LDX și LGLD; calibrarea predicțiilor în jurnal.
- **Check:** 1) prețul din randament (numeric, cu `vary` pe y și n); 2) randamentul real (numeric); 3) diferențialul și cursul (mcq).
- **Dovezi:**
  - Relația preț–randament și randamentul real: **Mechanic** (R4 §6.1).
  - Diferențialul de dobândă mișcă cursul: **B** (moderat; alți factori pot domina; R4 §6.4).
  - Randamentul real ca cost de oportunitate al aurului: **B** istoric, cu ruptura din 2022–24 (R4 §6.1, §6.9; detaliat în 3.6.5 și 3.6.8).
- **Necesită:** S9 (lumea macro cu mai multe instrumente), S10 (specificațiile pentru obligațiuni și FX).
- **Termeni noi de glosar:** yield, real-yield, breakeven-inflation, zero-coupon-bond, rate-differential

#### 3.6.2 · The yield curve
- **Nivel / durată / tip:** Advanced · 7 min · Track (Macro and news)
- **Obiective:**
  1. Read a yield curve and compute the 10y–2y and 10y–3m spreads.
  2. Name the four curve moves (bull or bear, steepener or flattener) from changes in short and long yields.
  3. Explain why an inversion is a long-lead recession signal with false positives, not a timing signal for equities.
- **Concepte:** yield-curve (nou), curve-moves (nou), term-premium (nou), base-rates ✓
- **Se sprijină pe:** 3.6.1
- **Hook:** predict · alegere. "The curve has been inverted for a year and there is still no recession. Is the signal broken?" Variante: yes / not necessarily. Răspuns: nu neapărat; decalajul e lung și variabil, iar semnalele false există (cazul 2022–24).
- **Interacțiunea centrală:**
  - B1 figure: formele curbei (normală, plată, inversată), construite pe rând.
  - B2 worked: LB2 4.80%, LB10 4.20%: spread-ul 10y–2y = −0.60 puncte procentuale, adică −60 bp. Utilizatorul introduce −60.
  - B3 match: mișcarea ↔ definiția (bull steepener ↔ randamentele scurte scad mai mult; bear flattener ↔ randamentele scurte cresc mai mult; bear steepener ↔ randamentele lungi cresc mai mult; bull flattener ↔ randamentele lungi scad mai mult).
  - B4 explain: istoricul. Inversarea a precedat fiecare recesiune americană din anii 1950, cu semnale false (sfârșitul anilor 1960, 1998). Modelul probit al Fed din New York a dat peste 70% probabilitate de recesiune în mai 2023, cel mai mult din 1982, fără o recesiune imediat după.
  - B5 explain: capătul lung reflectă și prima de termen: oferta de obligațiuni (deficite, licitații) și lipsa cumpărătorului de ultimă instanță (QT) o pot ridica (R4 §6.14).
  - B6 callout: „inversion = sell stocks now” e greșeala tipică.
- **Try:** `curve-animator` (nou): o curbă sintetică trece printr-un ciclu în 6 faze. Sarcina: "Label each phase as a bull or bear steepener or flattener." Reușită: ≥ 5/6.
- **Practică:** economia sintetică din S9 trece prin mai multe cicluri; la fiecare trimestru, utilizatorul estimează probabilitatea de recesiune din spread; scorul Brier se compară cu rata de bază.
- **Check:** 1) spread-ul (numeric, cu `vary`); 2) mișcarea curbei (match); 3) inversarea ca semnal (mcq).
- **Dovezi:**
  - Inversarea ca semnal de recesiune: **B** (decalaj lung și variabil, semnale false; R4 §6.2).
  - Inversarea ca semnal de timing pentru acțiuni: **D** (R4 §6.2, „Misconceptions”).
- **Necesită:** S9 (curba sintetică), S6 (motorul de regimuri).
- **Termeni noi de glosar:** yield-curve, inversion, steepener, flattener, term-premium

#### 3.6.3 · Inflation and regimes
- **Nivel / durată / tip:** Advanced · 8 min · Track (Macro and news)
- **Obiective:**
  1. Explain how the inflation backdrop changes a central bank's reaction function and therefore how assets react to the same data.
  2. Show that the stock–bond correlation depends on the monetary regime, using the 2022 case.
  3. Identify the regime from a pre-event dashboard before predicting a reaction.
- **Concepte:** inflation-regime (nou), stock-bond-correlation (nou), regime-dependent-reaction (nou), market-regime (nou în 2.8), correlation-and-concentration ✓
- **Se sprijină pe:** 3.6.1, 2.10
- **Hook:** predict · alegere. "Payrolls beat expectations by a wide margin. What do equities do?" Variante: rise / fall / it depends. Răspuns: depinde de regim („good news is bad news” când banca centrală luptă cu inflația).
- **Interacțiunea centrală:**
  - B1 explain: cauzele inflației (cerere, costuri, salarii, așteptări) și de ce contează mai ales prin funcția de reacție a băncii centrale.
  - B2 figure: același NFP peste așteptări, rulat în două regimuri sintetice. În „inflation-fight”: LABX scade, LB2 crește, LDX crește. În „growth-scare”: LABX crește. Mecanismul: datele bune ridică profiturile așteptate, dar și rata de actualizare; contează ce efect domină.
  - B3 worked: același portofoliu 60/40 pe LABX și LBND, după schimbarea regimului: LABX −12%, LBND −8%: 0.6 × (−12) + 0.4 × (−8) = −10.4%. Utilizatorul calculează −10.4. Cazul real ("Historical case"): în 2022, S&P 500 (−18.1%) și Treasuries lungi (−26.1%) au scăzut amândouă cu două cifre, pentru prima oară; corelația medie acțiuni–obligațiuni a fost −11.5% în regimuri monetare acomodative și +28.1% în regimuri restrictive (Baele & Van Holle).
  - B4 hotspot: tabloul de bord înainte de eveniment (trendul CPI, mediana dot plot, panta curbei, ultima reacție la date). "Tap the panel that tells you the regime."
  - B5 callout: „gold always hedges inflation” e verificat în 3.6.8.
- **Try:** `regime-switcher` (nou). Sarcina: "Identify the regime from four dashboard panels, then predict LABX, LB2, LDX and LGLD for a hot CPI print." Reușită: regimul corect **și** ≥ 3/4 direcții corecte după tabelul de β al acelui regim.
- **Practică:** R5 în motorul de regimuri: 12 evenimente sintetice (CPI și NFP) în două regimuri; calibrarea predicțiilor; jurnal.
- **Check:** 1) de ce aceeași dată mișcă diferit (mcq); 2) corelația acțiuni–obligațiuni pe regimuri (mcq cu cifrele); 3) citirea tabloului de bord (hotspot).
- **Dovezi:**
  - Corelația acțiuni–obligațiuni depinde de regim: **A** (decenii de date; Baele & Van Holle; studiul Markov-switching din 2025; R4 §6.3, §6.9).
  - „Good news is bad news” ca regulă de regim: **B** (ABDV 2003; R4 §2.0 [BK]).
  - Un set fix de reguli aplicat în orice regim: **D** (R4 §2.0, „Risks”).
- **Necesită:** S9, S6 (motorul de regimuri, R4 §9A.12).
- **Termeni noi de glosar:** disinflation, policy-regime

#### 3.6.4 · The dollar
- **Nivel / durată / tip:** Advanced · 7 min · Track (Macro and news)
- **Obiective:**
  1. Explain the main drivers of the dollar: rate and growth differentials, and safe-haven demand under stress.
  2. Place a world state on the dollar smile and predict the dollar's direction.
  3. Recognise an exception, such as a funding-currency unwind, where the smile fails.
- **Concepte:** dollar-smile (nou), safe-haven (nou), rate-differential (din 3.6.1)
- **Se sprijină pe:** 3.6.1, 3.6.3
- **Hook:** predict · alegere. "A global crisis starts. Does the dollar rise or fall?" Răspuns: de obicei crește (refugiu, cerere de finanțare în dolari). Dar există contraexemple: august 2024.
- **Interacțiunea centrală:**
  - B1 figure („zâmbetul”), în 3 pași: boom american (dolarul urcă, intrări de capital) → creștere globală sincronizată (dolarul scade) → criză globală (dolarul urcă, refugiu).
  - B2 match: starea lumii ↔ dolarul (US boom ↔ up; synchronised global growth ↔ down; global crisis ↔ up).
  - B3 reveal: a patra stare, „carry unwind”: LDX scade chiar în risk-off, pentru că moneda de finanțare urcă brusc. "Historical case": august 2024, după o majorare BoJ și un salt al yenului.
  - B4 explain: indicele dolarului (aici LDX) e o medie față de un coș; diferențialele de creștere și de dobândă împing tendința lungă.
  - B5 callout: „strong economy = strong currency, always” e greșit; contează diferențialele și regimul.
- **Try:** `smile-placer` (nou). Sarcina: "Place four world states on the smile and predict LDX. One state breaks the rule: find it." Reușită: 3/3 stări corecte pe zâmbet **și** starea „carry unwind” identificată.
- **Practică:** S9: 4 sesiuni-scenariu; câte un trade pe LFX cu risc 1%, cu regimul și invalidarea scrise înainte; notare pe proces.
- **Check:** 1) motoarele dolarului (mcq); 2) plasarea pe zâmbet (match); 3) excepția (mcq).
- **Dovezi:**
  - Zâmbetul dolarului: **C** (moderat; are excepții; R4 §6.4).
  - Diferențialele de dobândă și de creștere: **B** (R4 §6.4).
- **Necesită:** S9, S6.
- **Termeni noi de glosar:** dollar-index, dollar-smile, safe-haven, funding-currency

#### 3.6.5 · Commodities and commodity currencies
- **Nivel / durată / tip:** Advanced · 7 min · Track (Macro and news)
- **Obiective:**
  1. Name the main driver of oil, copper and gold: supply shocks, industrial demand, real yields plus official demand.
  2. Link a commodity price to its exporter's currency through the terms of trade.
  3. Explain why the gold–real-yield relationship broke in 2022–24.
- **Concepte:** commodities-in-macro (nou), commodity-currencies (nou), real-yield (din 3.6.1), commodity-drivers (nou în 3.14)
- **Se sprijină pe:** 3.6.1, 3.6.4
- **Hook:** predict · alegere. "Oil jumps 10% on a supply shock. Good for the stock index?" Variante: yes / no / it depends. Răspuns: depinde. Acțiunile din energie, da; consumatorii și inflația, nu.
- **Interacțiunea centrală:**
  - B1 match: marfa ↔ motorul principal (LOIL ↔ șocuri de ofertă și creștere; LCPR ↔ cererea industrială, „Dr. Copper”; LGLD ↔ randamentele reale, dolarul, cererea de refugiu și cumpărările băncilor centrale).
  - B2 figure: raportul LCPR / LGLD lângă LB10; raportul cupru/aur ca indicator de creștere care tinde să urmeze randamentele.
  - B3 explain: aurul și randamentele reale: corelație inversă medie de aproximativ −0.72 în 1997–2020, într-o analiză; ruptă în 2022–24, când aurul a urcat deși randamentele reale erau pozitive. Explicațiile: cumpărările băncilor centrale (~1,100 de tone pe an, după datele WGC citate), diversificarea rezervelor după sancțiuni, geopolitica. "Historical case".
  - B4 predict: un raport sintetic de stocuri de petrol arată o scădere neașteptată. "Which way do LOIL and LCOM move?" Răspuns: amândouă în sus (LCOM e moneda unui exportator de petrol).
  - B5 explain: termenii de schimb (prețul exporturilor față de importuri) și moneda; diferențialele de dobândă domină deseori.
  - B6 callout: contango și backwardation, care schimbă randamentul unei poziții pe futures, sunt în 3.14.
- **Try:** `macro-link` (nou). Sarcina: "After a synthetic inventory draw, predict LOIL and LCOM, then trade the spread with 1% risk." Reușită: direcțiile corecte **și** stop-ul și mărimea valide (riscul ≤ 1% cu costuri).
- **Practică:** S9 cu rapoarte săptămânale sintetice de stocuri (R4 §6.10), 8 săptămâni; plus testul de întârziere „PMI sintetic al unei mari economii importatoare → LCPR → LCOM” (R4 §6.11).
- **Check:** 1) marfa ↔ motorul ei (match); 2) termenii de schimb (mcq); 3) ruptura aur–randamente reale (mcq).
- **Dovezi:**
  - Petrolul, dominat de șocurile de ofertă: **B** (moderat; R4 §6.10).
  - Raportul cupru/aur urmează randamentele: **C** (R4 §6.10).
  - Aur–randamente reale: **B** istoric, cu ruptura din 2022–24 (R4 §6.9).
  - Monedele de mărfuri: **C** (diferențialele de dobândă domină des; R4 §6.11).
- **Necesită:** S9, S6 (raportul de stocuri), S10 (specificații de bază pentru mărfuri).
- **Termeni noi de glosar:** terms-of-trade, commodity-currency, copper-gold-ratio

#### 3.6.6 · Risk-on, risk-off and carry
- **Nivel / durată / tip:** Advanced · 8 min · Track (Macro and news)
- **Obiective:**
  1. Predict the cross-asset reaction to a risk-off shock: equities, high-beta currencies, credit and safe havens.
  2. Explain why correlations rise toward 1 in a crisis and what that does to diversification.
  3. Show the negative skew of a carry trade: months of small gains erased in days.
- **Concepte:** risk-on-risk-off (nou), carry-trade (nou), carry-unwind (nou), safe-haven (din 3.6.4), return-skew (nou în 2.8), correlation-and-concentration ✓, drawdown ✓
- **Se sprijină pe:** 3.6.4, 2.11, 2.14 (swap)
- **Hook:** predict · slider 0–24 de luni. "You earn 2,000 vUSD a year of carry on a 50,000 vUSD position. The funding currency jumps 5% in a day. How many months of carry are gone?" Răspuns: 15 luni (2,500 ÷ 2,000 = 1.25 ani).
- **Interacțiunea centrală:**
  - B1 figure („RORO meter”), construit din trei serii sintetice: un indice de volatilitate, spread-urile de credit și LFX.
  - B2 predict: un șoc risk-off. "Which of these rise: LABX, LCOM, LDX, LFX, LBND, LGLD?" Răspuns, în regimul de bază: LDX, LBND și LGLD cresc; LABX și LCOM scad; LFX scade, pentru că moneda de finanțare VFUN se apreciază.
  - B3 worked: carry: 50,000 × 4% = 2,000 vUSD pe an, ≈ 5.48 pe zi; un salt de 5% al monedei de finanțare: −2,500 vUSD. Utilizatorul calculează lunile pierdute: 15.
  - B4 figure: distribuția randamentelor zilnice ale carry-ului: multe câștiguri mici, câteva pierderi mari (asimetrie negativă).
  - B5 explain: de ce corelațiile cresc spre 1 în crize: levierul, țintirea volatilității și lichiditatea de finanțare forțează reducerea riscului în același timp, pe toate activele.
  - B6 callout: rolul de refugiu al yenului a slăbit când diferențialele de dobândă au fost foarte mari; „positive swap = free income” e greșit. "Historical case": august 2024.
- **Try:** `roro-meter` (nou), cu o poziție de carry pe LFX. Sarcina: "Size your carry position so a 5% jump in the funding currency costs at most 2% of the account." Reușită: valoarea poziției ≤ 4,000 vUSD (5% × 4,000 = 200 = 2% din 10,000).
- **Practică:** R8 (carry cu crash) pe mai multe sesiuni; scenariul de criză R12, cu matricea de corelații înainte și după.
- **Check:** 1) reacția risk-off (match); 2) corelațiile spre 1 (mcq); 3) aritmetica carry-ului (numeric, cu `vary`).
- **Dovezi:**
  - Carry: câștig mediu pozitiv, cu risc de crash (asimetrie negativă): **A** (README §6; R4 §6.12; dovezile complete sunt în 3.13).
  - Regimul risk-on / risk-off: **B** (moderat, dependent de regim; R4 §6.5).
  - Corelațiile cresc în crize: **B** (documentat, dar nu în fiecare criză la fel; R4 §6.5).
- **Necesită:** S9, S10 (swap), S11 (levier), S20 (criza), regimurile R8 și R12.
- **Termeni noi de glosar:** risk-on, risk-off, carry-trade, carry-unwind (negative-skew există deja, din 2.8)

#### 3.6.7 · Business cycle and sector rotation
- **Nivel / durată / tip:** Advanced · 7 min · Track (Macro and news)
- **Obiective:**
  1. Classify the cycle phase from leading data (PMI new orders, jobless claims, curve slope, credit spreads).
  2. Name the textbook sector leaders in each phase and why they lead.
  3. Show that the rotation edge shrinks after costs and phase-timing errors.
- **Concepte:** business-cycle (nou), sector-rotation (nou), credit-spreads (nou), yield-curve (din 3.6.2)
- **Se sprijină pe:** 3.6.2, 3.6.3
- **Hook:** predict · slider 1–10 ani. "How long have US expansions lasted on average?" Răspuns: aproximativ 5 ani și 4 luni; contracțiile, puțin peste 10 luni (datele Fidelity).
- **Interacțiunea centrală:**
  - B1 figure: fazele ciclului (early, mid, late, recession), cu indicatorii care le marchează.
  - B2 match: faza ↔ sectoarele care conduc în manual (early ↔ consum discreționar, financiar, industrial; mid ↔ tehnologie; late ↔ energie, materiale; recession ↔ consum de bază, utilități, sănătate, plus obligațiunile de stat).
  - B3 reveal: aceeași serie, etichetată întâi în timp real, apoi retrospectiv; fazele se recunosc sigur doar după aceea.
  - B4 explain: spread-urile de credit și condițiile financiare; „creditul conduce acțiunile” e o observație de practician, de testat.
  - B5 callout: un studiu academic găsește că rotația clasică aduce un plus modest, care dispare în mare parte după costuri și erori de încadrare a fazei (R4 §6.7).
- **Try:** `cycle-classifier` (nou). Sarcina: "Classify 12 synthetic months by cycle phase from four indicators." Reușită: ≥ 8/12 față de faza ascunsă (hazardul dă 3/12).
- **Practică:** jocul de alocare sectorială din S9: 6 sectoare sintetice, alocare trimestrială pe 3 ani sintetici; scorul se compară cu rotația perfectă (retrospectiv) și cu buy-and-hold, după costuri (R4 §6.7). Plus testul „does credit lead?” pe ciclurile sintetice.
- **Check:** 1) indicatorii fazei (mcq); 2) harta sectoarelor (match); 3) efectul costurilor și al erorilor de timing (mcq).
- **Dovezi:**
  - Identificarea fazei în timp real: **C** (se face cu hindsight; R4 §6.6).
  - Rotația sectorială: **C** (plus modest, dispare după costuri; R4 §6.7).
  - Creditul conduce acțiunile: **C** (observație de practician [BK]; R4 §6.13).
- **Necesită:** S9 (universul de sectoare), S6 (date macro sintetice).
- **Termeni noi de glosar:** business-cycle, sector-rotation, credit-spread, financial-conditions

#### 3.6.8 · When correlations flip
- **Nivel / durată / tip:** Advanced · 8 min · Track (Macro and news)
- **Obiective:**
  1. Compute and read a rolling correlation and say how many observations it rests on.
  2. Name three historical correlation breaks (stock–bond in 2022, gold–real yields in 2022–24, the yen as a safe haven) and their cause.
  3. Size a "hedged" portfolio for the case in which both legs lose together.
- **Concepte:** correlation-instability (nou), rolling-correlation (nou), intermarket-relationships (nou), correlation-and-concentration ✓, exposure ✓, portfolio-heat (nou în 2.11)
- **Se sprijină pe:** 3.6.3, 3.6.5, 3.6.6, 2.11
- **Hook:** predict · alegere. "Long LABX and long LBND. Is that a hedge?" Variante: yes / no / it depends. Răspuns: depinde de regim. Apoi lecția îl inversează.
- **Interacțiunea centrală:**
  - B1 match: relațiile „normale” ale lui Murphy (acțiuni–obligațiuni ↔ pozitivă; acțiuni–mărfuri ↔ inversă; obligațiuni–mărfuri ↔ inversă; mărfuri–dolar ↔ inversă). Apoi reveal: după 1998, în regimul deflaționist, acțiunile și obligațiunile s-au decuplat, iar 2022 a inversat iar relația (R2 §6.12; R4 §6.8).
  - B2 figure: corelația pe fereastră mobilă, cu ferestre de 20 și de 60 de bare; regimul se schimbă la jumătatea sesiunii. Fereastra scurtă e zgomotoasă; cea lungă întârzie.
  - B3 worked: LABX 50 de unități la 100.00 (5,000 vUSD) și LBND 50 de unități la 100.00 (5,000 vUSD). Cu corelație negativă: LABX −10% (−500), LBND +4% (+200), total −300. După inversare: LABX −10% (−500), LBND −8% (−400), total −900, adică −9% din cont. Utilizatorul calculează −900.
  - B4 explain, cu trei cazuri ("Historical case"): corelația acțiuni–obligațiuni, negativă sau aproape de zero din 2000 până în 2020, a fost în jur de +0.58 în 2022 și 2023; aurul și randamentele reale (−0.72 în medie în 1997–2020, ruptă în 2022–24); yenul ca refugiu, slăbit când diferențialele au fost mari.
  - B5 explain: corelațiile sunt rezultatul tipului de șoc dominant (creștere, inflație, politică monetară, fluxuri).
  - B6 callout: regula de risc: în stres, dimensionezi ca și cum corelația ar fi 1 (legătura cu portfolio heat din 2.11).
- **Try:** `rolling-corr` (nou), forma scurtă a **Correlation-flip lab**. Sarcina: "Detect the regime switch with the rolling correlation, then cut the 'hedged' book so a joint 10% fall costs at most 2% of the account." Reușită: schimbarea semnalată la ≤ 10 bare de schimbarea ascunsă **și** valoarea totală a celor două poziții ≤ 2,000 vUSD (10% × 2,000 = 200 = 2%).
- **Practică:** laboratorul unității, **Correlation-flip lab** (descris în fișa unității), 4 sesiuni; jurnalul compară acoperirile planificate cu cele realizate.
- **Check:** 1) citirea unei corelații pe fereastră mobilă și a numărului de observații (mcq); 2) cele trei rupturi istorice și cauzele lor (match); 3) dimensionarea pentru corelație 1 (numeric, cu `vary`).
- **Dovezi:**
  - Corelațiile depind de regim: **A** (R4 §6.9; R2 §6.12, §8.3.7).
  - Relațiile intermarket ale lui Murphy ca legi fixe: **D**; ca tendințe dependente de regim: **C** (R4 §6.8).
- **Necesită:** S9, S6 (motorul de regimuri), S20 (regimul R12).
- **Termeni noi de glosar:** rolling-correlation, intermarket-analysis, correlation-breakdown

---

## 3.7 · Central banks and event trading · 8 lecții

### Fișa unității

- **Scop:** utilizatorul citește o zi de decizie a unei bănci centrale ca pe un șir de surprize față de ce era deja în preț: decizia, comunicatul, voturile, dot plot-ul, conferința de presă, minutele. Calculează probabilitățile implicite, citește tonul relativ la așteptări, alege **dinainte** între a sta deoparte, a reduce, a acoperi sau a tranzacționa și își dimensionează pozițiile pentru gap, nu pentru stop. Strategiile de eveniment (fade, straddle, a doua mișcare, drift-ul dinainte) se testează pe zeci de evenimente, după costuri. Evenimentele extreme (SNB 2015, flash crash-ul din 2010) se studiază ca motiv pentru regulile de risc.
- **De ce aici:** după 3.6 (dobânzi, curbă, regimuri) și 2.10 (surpriza, a doua mișcare, checklist-ul de risc la știri). 2.10 a predat deja decizia, surpriza calculată din probabilități date, tonul de bază, a doua mișcare și politicile de știri; 3.7 nu le repetă, ci adaugă modelarea funcției de reacție, derivarea probabilităților din futures, textul și voturile, punctele față de prețuri, bilanțurile, strategiile fade și straddle puse la probă și evenimentele extreme. R4 §9, Level 3, modulele A2–A4. Pregătește 3.8 (evenimentele de raportare), 3.13 (strategiile pe evenimente) și 4.2 (regimurile de stres).
- **Cere de dinainte:** 2.10, 3.6.1–3.6.3, 2.14 (marjă, margin call, protecția la sold negativ), 1.4 (riscul de gap), 0.2 (mărimea eșantionului).
- **Checkpoint `test-3-7`:** 16 întrebări (2 pe lecție) și o sarcină practică: într-o zi de decizie sintetică, utilizatorul calculează probabilitatea implicită, dă tonul a 5 fraze din comunicat, depune planul dinaintea evenimentului și îl execută.
- **Laboratorul unității: Decision-day simulator** (în 3.7.8). O zi de decizie a LCB, cu structura unei zile FOMC: T − 24h (drift și indicatorul de poziționare), T − 15 min (checklist-ul de risc din R4 §4.11 trebuie bifat înainte de orice ordin nou), T − 60 s (panoul de lichiditate: spread de 5–20 de ori mai mare, adâncime cu 50–90% mai mică), 14:00 (decizia și comunicatul, cu tonul ascuns), 14:30 (fluxul de titluri din conferința de presă, a doua mișcare), dot plot-ul (la ședințele trimestriale), minutele după 3 săptămâni sintetice. Utilizatorul alege politica înainte de T − 15 min: flat, redus, acoperit, tranzacționează surpriza sau așteaptă a doua mișcare. Se notează: planul scris la timp, checklist-ul complet, mărimea care trece testul de gap (k × ATR, cu k între 3 și 5 din istoricul simulatorului), slippage-ul înregistrat. Profitul nu se notează.
- **Firele din spirală:**
  - **Risc:** dimensionarea pentru gap, levierul, protecția la sold negativ, stop-urile garantate (cu taxă), poziții care pot supraviețui unui gap.
  - **Statistică:** probabilitățile implicite; câte evenimente îți trebuie ca un drift mic să iasă din zgomot; oprirea opțională.
  - **Psihologie:** decizia luată dinainte față de impulsul de la T − 1 min; FOMO pe vârful mișcării.
  - **Proces:** checklist-ul de eveniment, jurnalul de slippage pe tip de eveniment.
  - **Costuri:** „costul știrii” (spread + slippage), latența unui om față de algoritmi.
  - **Dovezi:** principiul „priced in” (Mechanic, A) față de fade și straddle (folclor de practician, D).
- **Surse:** R4 §3.0–3.14, §4.0–4.12, §1.5, §1.8, §9 (Level 3, A2–A4), §9A; R3 §3.10, §1.7, §2.14, §6.9; R1 §2.12 (MN-02, MN-05, MN-11).

### Pe scurt

| Lecție | Hook | Try | Practică | Nota principală |
|---|---|---|---|---|
| 3.7.1 Reaction functions: modelling the central bank | ce dobândă prescrie regula LCB | reaction-function-estimator | R5, 4 ședințe LCB | Mechanic; B; A |
| 3.7.2 Reading implied probabilities | 4.05% implicit, ședința în ziua 16 | implied-prob-calc | R5, 4 ședințe | Mechanic; C |
| 3.7.3 Statements, votes and tone | două voturi pentru majorare | statement-diff + tone-scorer | 30 de fraze, minutele | B |
| 3.7.4 Press conference, dots and forward guidance | un singur dot schimbă mediana? | dot-plot | ziua deciziei, ghidarea abandonată | C / B |
| 3.7.5 Balance sheets, caps and interventions | cât au coborât achizițiile randamentul | cap-pressure | QE și intervenție pe LFX | B / C |
| 3.7.6 Event strategies under test: fade and straddle | straddle-ul care pierde | event-policy-lab | R5, 30 de evenimente pe politică | D / C |
| 3.7.7 Pre-event drift and positioning | +49 bp înainte de FOMC | drift-significance | R5 + poziționare sintetică | B |
| 3.7.8 Tail events: when stops don't protect | unde se execută stop-ul după un gap de 15% | floor-break | Decision-day simulator + S20 | Mechanic |

### Lecțiile

#### 3.7.1 · Reaction functions: modelling the central bank
- **Nivel / durată / tip:** Advanced · 8 min · Track (Macro and news)
- **Obiective:**
  1. Compute a policy-rate prescription from a simple rule that uses inflation and unemployment.
  2. Estimate a synthetic central bank's rule weights from its past decisions and predict its next decision.
  3. Explain how a change in the reaction function reprices the whole expected rate path, not just the next meeting.
- **Concepte:** reaction-function (nou), expected-policy-path (nou), central-bank-decisions (nou în 2.10), news-surprise (nou în 2.10), yield-curve (din 3.6.2)
- **Se sprijină pe:** 2.10 (deciziile, surpriza față de probabilități, cazul BoJ 2024), 3.6.1–3.6.3
- **Hook:** predict · slider 3.00–7.00%, pas 0.25. "The LCB's rule: 2.00 + inflation + 0.5 × (inflation − 2.00) − 0.5 × (unemployment − 4.50). Inflation is 3.00% and unemployment 4.50%. What rate does the rule prescribe?" Răspuns: 5.50%.
- **Interacțiunea centrală:**
  - B1 explain: mandatele (Fed: mandat dublu, ocuparea maximă și prețuri stabile, cu o țintă de 2% pe PCE; ECB, BoE, BoJ: stabilitatea prețurilor, cu ținte de 2%). Regula LCB e sintetică, construită după forma unei reguli Taylor [BK]; băncile reale nu urmează mecanic o formulă, dar formula arată cum se leagă datele de decizie.
  - B2 worked: inflația 2.60%, șomajul 5.10%: 2.00 + 2.60 + 0.5 × 0.60 − 0.5 × 0.60 = 4.60%. Utilizatorul introduce 4.60.
  - B3 figure (`Flow`), în 4 pași: datele → funcția de reacție → traiectoria așteptată pe următoarele 4 ședințe → randamentul la 2 ani (3.6.2) → cursul și acțiunile.
  - B4 predict → reveal: LCB mută greutatea de pe inflație pe șomaj. "The same hot CPI print arrives. Does LB2 move more or less than before?" Reveal: mai puțin, iar toată traiectoria se reevaluează, nu doar ședința următoare. "Historical case": piețele au citit trecerea Fed la ghidarea pe calendar, din 2011, ca pe o schimbare dovish a funcției de reacție (R4 §3.1).
  - B5 match: banca ↔ mandatul (Fed ↔ ocupare maximă și prețuri stabile; ECB ↔ stabilitatea prețurilor; BoE ↔ ținta de inflație stabilită de guvern; BoJ ↔ stabilitatea prețurilor, cu ținta de 2%).
  - B6 callout: regula e un model. Greutățile estimate din trecut se schimbă; o estimare veche e un risc, nu o certitudine.
- **Try:** `reaction-function-estimator` (nou). Sarcina: "Estimate how much the LCB weighs inflation and unemployment from its last 12 meetings, then predict meeting 13." Reușită: predicția la ≤ 25 bp de rezultatul regulii ascunse (în varianta simplificată: alegerea corectă din 3 variante).
- **Practică:** R5 cu modulul de bancă centrală din S6: 4 ședințe sintetice. Înainte de fiecare, utilizatorul scrie prescripția regulii, așteptarea din prețuri (din LRF, 3.7.2) și două scenarii de surpriză.
- **Check:** 1) prescripția regulii (numeric, cu `vary` pe inflație și șomaj); 2) ce face o schimbare a funcției de reacție cu traiectoria (mcq); 3) mandatele (match).
- **Dovezi:**
  - Funcția de reacție, ca mod de a citi datele: **Mechanic** (cadru conceptual; R4 §3.1).
  - Funcțiile de reacție se schimbă: **B** (cercetarea Fed din New York despre 2011; R4 §3.1).
  - Surprizele macro produc salturi ale prețurilor: **A** (Andersen, Bollerslev, Diebold & Vega 2003; R4 §1.5).
  - Regula LCB e un parametru al simulatorului, nu o afirmație despre băncile reale, deci nu primește notă; forma ei, după regula Taylor, e [BK] și se verifică înainte de publicare.
- **Necesită:** S6 (modulul de bancă centrală, cu funcție de reacție ascunsă și schimbări de greutăți), S9.
- **Termeni noi de glosar:** reaction-function, taylor-rule, expected-policy-path

#### 3.7.2 · Reading implied probabilities
- **Nivel / durată / tip:** Advanced · 8 min · Track (Macro and news)
- **Obiective:**
  1. Convert a rate-futures price into an implied rate (100 minus the price).
  2. Compute the probability of a hike with day-weighting inside the meeting month.
  3. Explain why a market-implied probability is a price, not a poll, and contains risk premia.
- **Concepte:** implied-policy-probability (nou), news-surprise (nou în 2.10), expected-policy-path (din 3.7.1), base-rates ✓
- **Se sprijină pe:** 3.7.1, 2.10 (surpriza calculată din probabilități date)
- **Hook:** predict · slider 0–100%. "Futures imply an average of 4.05% for a 30-day month with a meeting on day 16. The rate is 4.00% now. What is the chance of a 25 bp hike?" Răspuns: 40%. Formula naivă dă 20%.
- **Interacțiunea centrală:**
  - B1 worked: dobânda implicită = 100 − 95.95 = 4.05%. Utilizatorul introduce 4.05.
  - B2 worked, ponderat pe zile: primele 15 zile sunt la 4.00%, ultimele 15 la noua dobândă r. 4.05 × 30 = 121.5; 15 × 4.00 = 60; r = (121.5 − 60) ÷ 15 = 4.10%. Probabilitatea: (4.10 − 4.00) ÷ 0.25 = 40%. Utilizatorul introduce 40.
  - B3 predict: "The naive formula, (4.05 − 4.00) ÷ 0.25, gives 20%. Which is right, and why?" Răspuns: 40%; media lunii include zilele de dinaintea ședinței.
  - B4 explain: metoda CME FedWatch: pași de 25 bp, dobânda de la sfârșitul unei luni egală cu cea de la începutul lunii următoare; diferența dintre probabilitățile condiționate și cele agregate; OIS ca alternativă.
  - B5 callout: 60% nu înseamnă certitudine. Prețurile includ prime de risc și se pot reajusta târziu, în perioada de blackout. Avantajul tău e doar diferența dintre opinia ta și ce e deja în preț.
- **Try:** `implied-prob-calc` (nou). Sarcina: "The futures price is 95.97, the meeting is on day 21 of a 30-day month and the rate is 4.00%. Find the hike probability." Calculul: 100 − 95.97 = 4.03; 4.03 × 30 = 120.9; primele 20 de zile la 4.00 = 80; (120.9 − 80) ÷ 10 = 4.09; (4.09 − 4.00) ÷ 0.25 = 36%. Reușită: 36% ± 1.
- **Practică:** modulul de bancă centrală din S6: la fiecare ședință sintetică apare LRF; utilizatorul calculează probabilitatea înainte și tranzacționează (sau nu) știind că avantajul e doar diferența dintre opinia lui și preț. 4 ședințe.
- **Check:** 1) 100 − preț (numeric, cu `vary`); 2) probabilitatea ponderată pe zile (numeric, cu `vary`); 3) preț, nu sondaj (mcq).
- **Dovezi:**
  - Aritmetica: **Mechanic** (metodologia CME; R4 §3.9).
  - Probabilitățile implicite ca prognoze nedeformate: **C** (includ prime de risc și depind de ipotezele modelului; R4 §3.9).
- **Necesită:** S6 (futures LRF în modulul de bancă centrală).
- **Termeni noi de glosar:** rate-futures, implied-rate, implied-probability, ois

#### 3.7.3 · Statements, votes and tone
- **Nivel / durată / tip:** Advanced · 7 min · Track (Macro and news)
- **Obiective:**
  1. Find the changed phrases between two policy statements and rate their tone from −2 (very dovish) to +2 (very hawkish).
  2. Read a vote split and dissents as information about the next move.
  3. Explain why markets react to tone relative to what was expected, not to tone alone.
- **Concepte:** policy-communication (nou), central-bank-decisions (nou în 2.10), news-surprise (nou în 2.10), reaction-function (din 3.7.1)
- **Se sprijină pe:** 2.10 (hawkish și dovish față de așteptări), 3.7.1, 3.7.2
- **Hook:** predict · alegere. "The LCB holds rates, as expected. Two of nine members vote for a hike; the market expected a unanimous hold. Hawkish, dovish or neutral?" Răspuns: hawkish, față de ce era așteptat: disidențele arată în ce parte poate merge următoarea decizie.
- **Interacțiunea centrală:**
  - B1 figure: două comunicate sintetice ale LCB, unul lângă altul; diferențele se aprind pe rând (o schimbare de cuvânt, o frază scoasă, o frază nouă).
  - B2 task scurt (tone scorer): 5 schimbări subtile, fiecare notată de la −2 la +2 (de exemplu „some further firming” devine „further firming”; „for some time” dispare; „the risks are balanced” devine „the risks are tilted to the upside”). Frazele de bază din 2.10 nu se repetă.
  - B3 explain: voturile și disidențele arată distribuția opiniilor și următoarea mișcare probabilă. "Historical case": în mai 2025, Comitetul BoE s-a împărțit în trei: 2 voturi pentru o reducere de 50 bp, 5 pentru 25 bp, 2 pentru menținere.
  - B4 predict → reveal ("Historical case"): în septembrie 2014, Fed și-a păstrat formularea; piața aștepta o schimbare hawkish, deci textul neschimbat a fost citit ca dovish.
  - B5 explain: minutele vin după 3 săptămâni; cuantificatorii contează („many participants” față de „a few participants”). În 2016, președinți regionali ai Fed au inversat lectura dovish a comunicatului din martie.
  - B6 callout: algoritmii compară textele în câteva secunde; avantajul tău nu e viteza.
- **Try:** `statement-diff` și `tone-scorer` (noi). Sarcina: "Highlight every changed phrase and score the overall tone. The market had priced a tone of +1. Predict LB2's direction." Reușită: ≥ 80% din diferențe găsite, tonul la ±1 de scorul ascuns **și** direcția consistentă cu (ton − ton din preț).
- **Practică:** R5 cu S6: jocul de ton cu 30 de fraze sintetice (R4 §3.4), calibrat; exercițiul cu minutele (cuantificatorii schimbă probabilitatea unei majorări).
- **Check:** 1) diferențele dintre două comunicate (hotspot); 2) ce spune o împărțire a voturilor (mcq); 3) tonul relativ la așteptări (mcq).
- **Dovezi:**
  - Schimbările de formulare semnalează direcția: **B** (moderat; R4 §3.3–3.4; analiza automată a textului e [BK]).
  - Reacția la ton depinde de ce era așteptat: **Mechanic** ca logică, ilustrat de cazurile istorice (R4 §3.4).
- **Necesită:** S6 (texte de comunicat cu scor de ton ascuns, voturi, minute).
- **Termeni noi de glosar:** policy-statement, dissent, vote-split, minutes (hawkish și dovish există deja, din 2.10)

#### 3.7.4 · Press conference, dots and forward guidance
- **Nivel / durată / tip:** Advanced · 8 min · Track (Macro and news)
- **Obiective:**
  1. Compute the median of a 19-dot plot and show how one participant can move it.
  2. Compare a dot-plot shift with what futures had already priced, and plan for the press conference's 30–60 minutes of headline whipsaw.
  3. Distinguish calendar, threshold and qualitative forward guidance, and what happens when guidance is abandoned.
- **Concepte:** dot-plot (nou), forward-guidance (nou), second-move (nou în 2.10), expected-policy-path (din 3.7.1), implied-policy-probability (din 3.7.2)
- **Se sprijină pe:** 3.7.3, 2.10
- **Hook:** predict · da/nu. "19 dots. One participant moves up by 25 bp. Can the median change?" Răspuns: da; aici trece de la 4.25% la 4.50%.
- **Interacțiunea centrală:**
  - B1 figure (dot plot sintetic): 2 puncte la 3.75%, 6 la 4.00%, 2 la 4.25%, 7 la 4.50%, 2 la 4.75%. Pași: punctele → ordonarea → al 10-lea punct, mediana: 4.25%.
  - B2 worked: un participant mută punctul de la 4.25% la 4.50%. Noua ordine: 3.75 (2), 4.00 (6), 4.25 (1), 4.50 (8), 4.75 (2); al 10-lea punct: 4.50%. Utilizatorul introduce noua mediană.
  - B3 explain: punctele sunt prognoze condiționate, nu promisiuni; Fed însăși avertizează asupra puterii lor predictive; punctul pe termen lung e o estimare a dobânzii neutre.
  - B4 predict → reveal: mediana punctelor crește cu 25 bp. "Futures had already priced this path. How much does LB2 move?" Reveal: puțin. În varianta în care LRF nu prețuia schimbarea, LB2 urcă vizibil. Contează diferența dintre puncte și traiectoria din prețuri (3.7.2), nu punctele singure.
  - B5 match: tipul de ghidare ↔ exemplul (calendar ↔ "through mid-2013"; prag ↔ "until unemployment falls below x"; calitativ ↔ "patient", "data dependent").
  - B6 callout: conferința de presă (a doua mișcare din 2.10) poate aduce 30–60 de minute de titluri contradictorii, iar planul pentru ea se scrie înainte. "Historical case": în ianuarie 2022, Powell nu a exclus majorări consecutive sau mai mari și a spus că e „quite a bit of room” pentru creșteri; piața a adăugat majorări în prețuri. Când o bancă abandonează ghidarea, reajustarea e violentă: ghidarea nu e o promisiune.
- **Try:** `dot-plot` (nou). Sarcina: "Move the fewest dots to change the median from 4.25% to 4.50%." Reușită: un singur punct mutat de la ≤ 4.25% la ≥ 4.50%, iar mediana devine 4.50% (oricare dintre mutările care îndeplinesc condiția).
- **Practică:** ziua de decizie din S6: comunicat neutru, apoi fluxul conferinței de presă; utilizatorul alege momentul intrării sau rămâne flat (R5). Plus scenariul de ghidare abandonată (R4 §3.8): cât s-au sprijinit pozițiile utilizatorului pe ghidare.
- **Check:** 1) mediana unui dot plot (numeric, cu `vary` pe distribuție); 2) punctele față de traiectoria din prețuri (mcq); 3) tipurile de ghidare (match).
- **Dovezi:**
  - Puterea predictivă a dot plot-ului: **C** (Fed avertizează; R4 §3.6).
  - Conferința de presă produce adesea o mișcare mai mare: **C** (frecvent, nu regulă; R4 §3.5).
  - Efectul ghidării credibile: **B** (literatura despre QE atribuie o parte mare din efect semnalării traiectoriei dobânzii; R4 §3.8, §3.10).
- **Necesită:** S6 (dot plot, fluxul de titluri al conferinței de presă, scenariul de ghidare abandonată).
- **Termeni noi de glosar:** dot-plot, neutral-rate, forward-guidance, press-conference

#### 3.7.5 · Balance sheets, caps and interventions
- **Nivel / durată / tip:** Advanced · 8 min · Track (Macro and news)
- **Obiective:**
  1. Explain how QE lowers long yields through the term premium and signalling, and why QT is not its mirror image.
  2. Describe yield-curve control and why exiting a cap or a peg can gap the market.
  3. Recognise the ladder of verbal warnings that usually comes before currency intervention.
- **Concepte:** qe-qt (nou), yield-curve-control (nou), fx-intervention (nou), term-premium (din 3.6.2)
- **Se sprijină pe:** 3.6.2, 3.7.4
- **Hook:** predict · slider 0–200 bp. "Fed staff estimated how much higher the 10-year yield would have been at end-2017 without the bond purchases?" Răspuns: aproximativ 85 bp.
- **Interacțiunea centrală:**
  - B1 figure (`term-premium-slider`): LB10 împărțit în traiectoria așteptată a dobânzii plus prima de termen; un anunț QE sintetic mișcă în principal prima de termen.
  - B2 explain: cifrele estimate: ~100 bp reducere a primei de termen din trei runde de QE, cam jumătate prin semnalare; QT are efecte mai mici și disputate: o estimare dă ~17 bp pe randamentul la 10 ani la începutul reducerii din 2017–19, echivalentul unei majorări de ~68 bp; bilanțul Fed a scăzut de la ~8.9 la ~7 trilioane de dolari până la începutul lui 2026 (sursă secundară).
  - B3 explain: controlul curbei (YCC): BoJ a plafonat randamentul la 10 ani în jurul lui zero din 2016 și a ieșit în martie 2024. Plafonul ține piața țintită calmă și mută presiunea în curs; ieșirea eliberează presiunea.
  - B4 predict: indicatorul de presiune al unui plafon sintetic de 1.00% pe LB10 (cât trebuie să cumpere LCB pe zi ca să-l țină) crește. "When does holding a position that depends on the cap stop making sense?" Reveal: plafonul cedează cu un gap.
  - B5 match: fraza ↔ treapta de avertizare (de exemplu „watching closely” ↔ 1; „concerned about one-sided moves” ↔ 2; „will not rule out any options” ↔ 3; „ready to take decisive action” ↔ 4), apoi intervenția.
  - B6 callout: intervenția mișcă cursul brusc, cu câteva „big figures” în minute, dar e deseori parțial anulată dacă diferențialele nu se schimbă [BK].
- **Try:** `cap-pressure` (nou). LBND cotează 90.53 cu randamentul plafonat la 1.00%; dacă plafonul cedează, randamentul sare la 1.50% și LBND la 86.17 (−4.8%). Sarcina: "You hold LBND because the cap 'protects' it. Size the position so a cap break costs at most 1% of the account, then decide when to cut it." Reușită: ≤ 22 de unități (22 pierd 97.87 cu costuri; 23 ar pierde 102.33) **și** reducerea făcută când indicatorul de presiune trece de pragul declarat de utilizator înainte de sesiune. Momentul ruperii nu se notează.
- **Practică:** S6 și S9: un anunț QE sintetic; apoi o intervenție bruscă pe LFX în timp ce utilizatorul ține o poziție de carry (R4 §3.12).
- **Check:** 1) canalele QE și asimetria QT (mcq); 2) riscul ieșirii dintr-un plafon (mcq); 3) treptele de avertizare (match).
- **Dovezi:**
  - QE a coborât prima de termen: **B** (estimările variază între ~85 și ~100 bp; R4 §3.10).
  - Efectele QT: **C** (mai mici și disputate; R4 §3.10).
  - Intervențiile, deseori parțial anulate: **C** ([BK]; R4 §3.12).
- **Necesită:** S6, S9, S20 (gap-ul la ruperea plafonului).
- **Termeni noi de glosar:** quantitative-easing, quantitative-tightening, yield-curve-control, fx-intervention, currency-peg

#### 3.7.6 · Event strategies under test: fade and straddle
- **Nivel / durată / tip:** Advanced · 9 min · Track (Macro and news)
- **Obiective:**
  1. Compute the result of a pending-order straddle that fills on a spike and stops out on the reversal, with slippage and commissions.
  2. Explain when fading a spike worked in the simulator (small surprise, conflicting details) and when it failed.
  3. Compare fading and straddling with the stand-aside, reduce and second-move policies from 2.10 on the same 30 events, after costs.
- **Concepte:** spike-fade (nou), news-straddle (nou), news-policy (nou în 2.10), news-liquidity (nou în 2.10), second-move (nou în 2.10), slippage ✓, expectancy ✓, gap-risk ✓
- **Se sprijină pe:** 2.10, 3.7.4
- **Hook:** predict · da/nu. "A buy stop 0.40 above, a sell stop 0.40 below, linked as OCO. Can this straddle lose if the market moves a lot?" Răspuns: da.
- **Interacțiunea centrală:**
  - B1 figure, în 3 pași: titlul produce un vârf; buy stop-ul de la 100.40 se execută la 100.55 (slippage 0.15), iar sell stop-ul se anulează (OCO) → detaliile inversează mișcarea → stop-ul de protecție de la 100.00 se execută la 99.90.
  - B2 worked: 100 de unități: (99.90 − 100.55) × 100 = −65.00; comisioane 5.03 (intrare, la 10,055.00) + 5.00 (ieșire, la 9,990.00); total −75.03 vUSD. Utilizatorul introduce −75.03 (toleranță 0.01).
  - B3 predict → reveal: 50 de evenimente sintetice. Probabilitatea ca vârful să se retragă e o funcție ascunsă de |z| și de acordul dintre componente (R4 §4.2). Reveal: în simulator, fade-ul a mers doar la |z| < 1 cu detalii contradictorii. E un parametru al generatorului, nu un fapt despre piețele reale.
  - B4 explain: varianta cu opțiuni a straddle-ului și scăderea volatilității implicite după eveniment (IV crush): straddle-ul plătit pentru o mișcare implicită de 4%, cu o mișcare realizată de 3%, pierde; într-un set de date de practician, mișcările realizate au fost în medie ~85% din cele implicite. Detaliile sunt în 3.8 și 4.1.
  - B5 reveal: aceleași 30 de evenimente, cu fade și straddle lângă politicile din 2.10 (stand aside, reduce, second move): curbele de capital după costuri și drawdown-urile (rezultatul simulatorului).
  - B6 callout: politica „câștigătoare” din simulator depinde de parametrii generatorului (de exemplu, regula ascunsă după care fade-ul merge doar la |z| < 1). Ce se transferă e metoda de comparație (aceleași evenimente, aceleași costuri, eșantionul declarat), nu câștigătorul.
- **Try:** `event-policy-lab` (nou). Sarcina: "Choose one policy for 30 synthetic releases (flat, instant surprise trade, fade, straddle, wait for the second move), with costs and 1% risk." Reușită (pe proces): politica e aleasă înainte de rulare; riscul pe eveniment ≤ 1% și în scenariul de gap; utilizatorul raportează expectanța netă cu mărimea eșantionului și o compară cu politica „flat” (zero).
- **Practică:** R5 cu S6 (reacție în două valuri, panoul de lichiditate, surpriza standardizată): 30 de evenimente pe politică; jurnalul înregistrează slippage-ul pe tip de eveniment.
- **Check:** 1) rezultatul unui straddle (numeric, cu `vary` pe niveluri și slippage); 2) când a mers fade-ul în simulator și ce notă are în realitate (mcq); 3) citirea comparației de politici (mcq).
- **Dovezi:**
  - Tranzacționarea surprizei în primele minute, pentru un om: **C** (ajustarea se face în secunde; R4 §4.1).
  - Fade-ul vârfului: **D** (folclor de practician; R4 §4.2).
  - Straddle-ul cu ordine pending: **D** (execuții duble, slippage; R4 §4.3).
  - Straddle-ul cu opțiuni înaintea evenimentelor: **C** (~85% realizat față de implicit, un singur set de date; R4 §4.3).
  - Așteptarea celei de-a doua mișcări, ca reducere a riscului: **C** (R4 §4.4).
  - A sta deoparte la știri reduce prin construcție expunerea la gap: **Mechanic** (R4 §4.5).
- **Necesită:** S6 (reacție în două valuri, panoul de lichiditate, surpriza z), S1 (OCO, stop entry), S12 (opțional, pentru varianta cu opțiuni).
- **Termeni noi de glosar:** news-straddle (fade există deja, din nivelurile anterioare)

#### 3.7.7 · Pre-event drift and positioning
- **Nivel / durată / tip:** Advanced · 8 min · Track (Macro and news)
- **Obiective:**
  1. Describe the pre-FOMC drift finding and why a published anomaly should be expected to weaken.
  2. Compute how many events are needed before a small drift can be told apart from noise.
  3. Read positioning from reactions: a market that falls on good news is heavy.
- **Concepte:** pre-event-drift (nou), buy-rumour-sell-news (nou), market-tell (nou), base-rates ✓, positioning (nou în 3.9)
- **Se sprijină pe:** 3.7.1, 0.2
- **Hook:** predict · slider 0–100 bp. "In the original study, how much did the stock index gain on average in the 24 hours before scheduled Fed announcements?" Răspuns: 49 bp (din 1994; în eșantion, fereastra a adus ~80% din randamentul anual în exces).
- **Interacțiunea centrală:**
  - B1 explain: rezultatul (Lucca & Moench): +49 bp în 24 de ore înaintea anunțurilor FOMC, fără un efect comparabil în obligațiuni sau în dolar; mecanismul rămâne neclar. Un studiu înrudit leagă randamentele din „săptămânile pare” ale ciclului FOMC de comunicarea informală a Fed (Cieslak, Morse & Vissing-Jorgensen).
  - B2 worked: un drift sintetic de 0.10% pe eveniment, cu deviație standard 1.00%. Statistica t = 0.10 × √N ÷ 1.00. Ca să ajungă la 2: √N = 20, deci N = 400 de evenimente, adică 50 de ani la 8 ședințe pe an. Utilizatorul introduce 400.
  - B3 reveal: după 40 de evenimente sintetice, intervalul estimării încă include zero.
  - B4 explain: „buy the rumour, sell the news”: prețul urcă înaintea unui eveniment pozitiv așteptat și scade când e confirmat, pentru că pozițiile se închid. "Historical case": în T1 2021, 74% dintre companii au depășit așteptările și la profit, și la venituri, dar reacția medie pe o zi a fost −0.69% (Bespoke).
  - B5 predict: indicatorul de poziționare și 5 reacții la știri. "Heavy or washed out?" Răspuns din tiparul reacțiilor: o piață care scade la vești bune e „heavy”.
  - B6 callout: McLean & Pontiff: predictorii publicați au câștigat cu 26% mai puțin out-of-sample și cu 58% mai puțin după publicare.
- **Try:** `drift-significance` (nou). Sarcina: "Add events until you can tell whether this drift is real. Stop when your 95% interval excludes zero, or at 400 events." Reușită: utilizatorul se oprește după regula anunțată și formulează concluzia cu N. Dacă se oprește la primul p < 0.05 cu N < 50, feedback-ul explică oprirea opțională („optional stopping”).
- **Practică:** R5 cu S17 (poziționare sintetică, de tip COT): scenariul cu reacții asimetrice (R4 §4.12), 10 evenimente; utilizatorul deduce poziționarea, apoi o verifică în raportul sintetic.
- **Check:** 1) rezultatul drift-ului și scăderea după publicare (mcq); 2) mărimea eșantionului (numeric, cu `vary` pe medie și deviație); 3) citirea unei reacții la știri (mcq).
- **Dovezi:**
  - Drift-ul dinaintea FOMC: **B** (puternic în eșantionul original; prudență după publicare; R4 §4.7).
  - „Buy the rumour, sell the news”: **C** (R4 §4.6).
  - Reacția la știri ca indiciu de poziționare: **D** (discreționar, slab–moderat; R4 §4.12).
- **Necesită:** S6, S7 (statistici, interval de încredere), S17 (date sintetice de poziționare).
- **Termeni noi de glosar:** pre-announcement-drift, buy-the-rumour-sell-the-news, optional-stopping

#### 3.7.8 · Tail events: when stops don't protect
- **Nivel / durată / tip:** Advanced · 9 min · Track (Macro and news)
- **Obiective:**
  1. Retell what happened to liquidity and stop orders in the SNB floor removal (2015) and the Flash Crash (2010).
  2. Size a position for a gap scenario instead of for the stop, and compute the loss with and without negative balance protection.
  3. Write a tail-risk rule set for your plan: leverage cap, gap sizing, event exposure, broker protections.
- **Concepte:** tail-event (nou), liquidity-vacuum (nou), gap-risk ✓, leverage ✓, position-sizing ✓, stop-loss-order ✓, fat-tails (nou în 3.10)
- **Se sprijină pe:** 3.7.5, 3.2.2, 2.14, 1.4
- **Hook:** predict · alegere. "Your stop is 0.40 away. The market reopens 15% lower. Where does the stop fill?" Variante: at the stop / near the stop / at the first available price. Răspuns: la primul preț disponibil.
- **Interacțiunea centrală:**
  - B1 explain ("Historical case"): pe 15 ianuarie 2015, SNB a renunțat la pragul de 1.20 pe EUR/CHF. Lichiditatea a dispărut; un furnizor de lichiditate a cotat ~1,000 de pips sub prag; brokerii și-au activat circuit breaker-ele în ~10 secunde; stop-urile s-au executat mult dincolo de nivelurile lor; Alpari UK a intrat în insolvență a doua zi. Concluzia Euromoney: „stop-loss orders don't always work”.
  - B2 explain ("Historical case"): pe 6 mai 2010, algoritmul unui trader mare a vândut 75,000 de contracte E-mini S&P 500, țintind 9% din volum, „fără să țină cont de preț sau de timp”. Traderii de înaltă frecvență au absorbit și au revândut, lichiditatea s-a evaporat, Dow Jones a scăzut cu aproape 1,000 de puncte și și-a revenit în mare parte în aceeași după-amiază; ~8,000 de acțiuni au scăzut cu 5–15%. Spoofing-ul lui Sarao a contribuit la dezechilibrul din carte (3.3.7).
  - B3 worked ("Synthetic replay"): LPEG, ținută 40 de sesiuni la pragul de 120.00. Long 800 de unități la 120.20 (valoare 96,160 vUSD, levier ≈ 9.6× pe 10,000), stop la 119.80 (risc planificat 0.40 × 800 = 320, adică 3.2%). Prețul se redeschide la 102.00, cu 15.1% mai jos. Pierderea brută: 18.20 × 800 = 14,560 vUSD, mai mult decât contul. Fără protecție la sold negativ, soldul ajunge la −4,560; cu protecție, pierderea se oprește la 10,000. Utilizatorul introduce 14,560.
  - B4 worked: dimensionarea pentru gap: un gap de 15% de la 120.20 înseamnă o redeschidere la 102.17, adică 18.03 pe unitate. Cu buget de 1% (100 vUSD), cu costuri: 5 unități (pierd 90.72; 6 ar pierde 108.86). Utilizatorul introduce 5. Concluzia: un trade „sigur” la prag, cu stop strâns, are o mărime absurd de mică dacă respecți riscul de gap. De aici vine tentația de a ignora gap-ul, iar ruina vine din cedarea în fața ei.
  - B5 match: regula ↔ ce protejează (plafonul de levier ↔ pierderea care depășește contul; dimensionarea pentru gap ↔ stop-ul sărit; flat înainte de închideri și evenimente ↔ gap-ul de weekend și de știri; stop garantat, cu taxă ↔ execuția la un preț fix; protecția la sold negativ ↔ datoria față de broker).
  - B6 callout: acțiunile de urgență ale băncilor centrale (martie 2020) pot fi citite ca „ușurare” sau ca „panică”; direcția nu se poate prevedea, intervalul e mare.
- **Try:** `floor-break` (nou). Sarcina: "A pegged pair has sat at its floor for 40 sessions. Build a position plan that survives a 15% gap with at most a 2% account loss." Reușită: ≤ 11 unități (11 pierd 199.57 cu costuri; 12 ar pierde 217.71), **și** utilizatorul explică de ce distanța stop-ului nu schimbă pierderea maximă în gap; opțiunea de stop garantat e evaluată cu taxa ei.
- **Practică:** laboratorul unității, **Decision-day simulator** (descris în fișa unității), plus scenariile de stres din S20: ruperea pragului, reluarea flash crash-ului (R12), o reducere de urgență a dobânzii. KPI-uri: pierderea maximă față de plan, respectarea regulilor.
- **Check:** 1) faptele celor două cazuri (mcq); 2) dimensionarea pentru gap (numeric, cu `vary` pe preț, gap și buget); 3) protecția la sold negativ și levierul (mcq).
- **Dovezi:**
  - Stop-urile nu sunt garantate și se execută la primul preț disponibil: **Mechanic** (R4 §1.2, §4.10; R3 §2.14).
  - Cozile groase (mișcările extreme apar mai des decât într-o distribuție normală): **A** (fapt stilizat; cascadele de stop-uri contribuie la ele în FX, Osler 2005, R3 §5.4; predat cu cifre în 3.10).
  - Cazurile sunt fapte istorice documentate, nu afirmații despre o metodă, deci nu primesc notă (R4 §4.10, S68–S69; R3 §6.9).
- **Necesită:** S20 (ruperea pragului, flash crash, reducere de urgență), S11 (levier, margin call, protecția la sold negativ), S10 (specificațiile FX), S6.
- **Termeni noi de glosar:** tail-event, liquidity-vacuum, flash-crash (guaranteed-stop și negative-balance-protection există deja în glosar, din Nivelul 1)

---

## Ce cere această jumătate de la simulator

### Capabilitățile din README §8

| Cod | Ce cere această jumătate | Lecții |
|---|---|---|
| S1 | OCO și stop entry pentru straddle-ul de știri; iceberg și post-only ca tipuri de ordin | 3.2.5, 3.7.6 |
| S2 | ATR și niveluri de referință automate; volume profile și profil TPO; OBV pentru comparație; Ichimoku și Donchian | 3.1.4, 3.1.5, 3.3.4, 3.3.8, 3.4.7 |
| S3 | zone cu note și blocare; Fibonacci cu proiecții pe trei puncte; etichete Elliott, Wyckoff și XABCD; grila de numere rotunde | 3.1.2, 3.1.6, 3.4.2–3.4.6 |
| S4 | scalarea axelor (capcana unghiului Gann); point & figure, opțional | 3.4.5, 3.4.8 |
| S5 | ceasul sesiunilor, ora de vară, licitațiile la ore fixe | 3.1.4, 3.2.8, 3.3.8, 3.5.5 |
| S6 | motorul de știri cu surpriza z, reacția în două valuri și panoul de lichiditate; modulul de bancă centrală (vezi extensiile); motorul de regimuri | 3.2.3, 3.6.x, 3.7.x |
| S7 | controlul R0 cu aceeași volatilitate și același profil de sesiune; detectori cu parametri expuși; statistici cu interval de încredere și bandă de zgomot | toate unitățile, mai ales 3.1, 3.4, 3.5 |
| S8 | carte L2/L3, tape, DOM, footprint, iceberguri, licitații, agenți etichetați, radiografia de după sesiune | 3.1–3.3, 3.5 |
| S9 | lumea cu mai multe instrumente (randamente, FX, mărfuri, sectoare), corelații dependente de regim, o pereche corelată pentru SMT | 3.5.5, 3.6.x, 3.7.x |
| S10 | specificațiile FX, de obligațiuni și de mărfuri | 3.2.1, 3.2.6, 3.6.1, 3.6.5, 3.7.8 |
| S11 | levier, margin call, protecția la sold negativ | 3.2.6, 3.6.6, 3.7.8 |
| S12 | opțional: straddle-ul cu opțiuni și scăderea volatilității implicite (detaliat în 3.8 și 4.1) | 3.7.6 |
| S13 | laboratorul de reguli în mod ghidat: preînregistrare, IS/OOS, costuri, grilă de parametri, calcul as-of | 3.1.6, 3.3.8, 3.4.x, 3.5.x |
| S15 | jurnalul cu etichete (stop în banda aglomerată, trade luat „din cauza unui zid”), raportul de calitate a execuției | 3.1.2, 3.2.6, 3.2.7, 3.3.2 |
| S17 | poziționare sintetică, de tip COT, pentru citirea reacțiilor la știri | 3.7.7 |
| S20 | ruperea unui prag, reluarea flash crash-ului, reducerea de urgență, ruperea unui plafon de randament, suspendare și redeschidere prin licitație | 3.2.8, 3.3.7, 3.6.6, 3.6.8, 3.7.5, 3.7.8 |

**Regimurile folosite:** R0 (peste tot, ca martor), R1, R2, R3, R4 (3.4.7), R5 (3.2.3, 3.6.3, 3.7.x), R6 (3.2.8, 3.3.8, 3.5.5), R8 (3.6.6), R11 (3.1–3.3, 3.5.1), R12 (3.6.6, 3.6.8, 3.7.8), R13 (3.4.8).

### Extensii propuse (nu au încă un cod în README §8)

| Extensie | Ce face | Sursa | Lecții |
|---|---|---|---|
| S8 · agents | agenți etichetați cu adevărul păstrat: market maker, noise, momentum, plasatori de stop-loss și TP după Osler, iceberg, apărător pasiv, „zid fals”, agent informat înainte de știri, ordin-părinte VWAP, agenți care urmăresc Fibonacci, agent de acumulare, spoofer (doar în modulul de conformitate); comutatorul „stops ON / OFF” | R3 Appendix A3 | 3.1–3.5 |
| S8 · x-ray | după sesiune: harta stop-urilor și a TP-urilor ascunse, inventarul prins și ieșirile lui, agenții ascunși, cine a tranzacționat cu cine | R3 Appendix A3, A6 | 3.1.x, 3.3.5, 3.3.6, 3.5.1 |
| S8 · venues | două venue-uri, SIP întârziat, wholesaler, modul dealer cu spread dependent de volatilitate și last look, profiluri de broker (STP, B-book, ECN) cu P&L-ul brokerului afișat | R3 Appendix A2 | 3.2.1, 3.2.6, 3.2.7 |
| S8 · matching | comutator FIFO / pro-rata, reguli de resetare a priorității la modificare, indicatorul poziției în coadă | R3 Appendix A1 | 3.2.4, 3.2.5 |
| S8 · auctions | licitații de deschidere și închidere cu preț indicativ, volum împerecheat, dezechilibru și final aleator | R3 Appendix A4 | 3.2.8 |
| S8 · compliance | blocarea tiparelor de ordine care seamănă cu spoofing-ul, cu explicația legală; datele MBO pentru biroul de supraveghere | R3 §6.9, Appendix A6 | 3.3.7 |
| S7 · claim lab | formularul de preînregistrare, rularea pe R0 și pe piața cu structură, martori aleatori (niveluri, zone, bare, zigzaguri), banda de zgomot | R2 §8.5; R3 §7.2 | 3.1.4–3.1.6, 3.4.x, 3.5.x |
| S6 · central bank | LCB: funcție de reacție ascunsă și schimbătoare, futures LRF, comunicate cu ton ascuns, voturi, dot plot, fluxul de titluri al conferinței de presă, minute, blackout | R4 §9A.9 | 3.7.x |
| S6 · regimes | stările disinflation, inflation-fight, growth-scare, crisis, carry-calm, cu tabelele de β și corelațiile lor | R4 §9A.12 | 3.6.x, 3.7.x |
| S9 · macro world | LABX, LB2, LB10, LBND, LGLD, LOIL, LCPR, LDX, LFX, LCOM, LPEG și 6 sectoare, cu date macro sintetice (CPI, NFP, PMI, stocuri de petrol) | R4 §6, §9A | 3.6.x, 3.7.x |

### Widget-urile noi

| Unitate | Widget-uri (Try) |
|---|---|
| 3.1 | `liquidity-xray` (cu modul „trapped”), `stop-placer` (extinde `position-size`), `sweep-or-break`, `level-tester` (extinde `level-drawer`), `gap-null-lab`, `zone-tester` |
| 3.2 | `venue-router` (cu modul „report”), `book-ladder`, `mm-quoter`, `queue-sim`, `iceberg-builder`, `broker-switch`, `auction-uncross` |
| 3.3 | `tape-reader`, `dom-ladder`, `footprint-reader`, `cvd-pane`, `absorption-flagger`, `iceberg-hunt`, `surveillance-desk`, `tpo-builder` |
| 3.4 | `claim-lab`, `fib-tester`, `wave-labeler`, `alt-count-lab`, `wyckoff-labeler`, `harmonic-builder`, `ichimoku-system-lab`, `scale-trap`, `cycle-finder` |
| 3.5 | `smc-map` (sortare și potrivire), `structure-labeler`, `smc-claim-lab` (presetările H1–H4 și modul complet) |
| 3.6 | `yield-toy`, `curve-animator`, `regime-switcher`, `smile-placer`, `macro-link`, `roro-meter`, `cycle-classifier`, `rolling-corr` |
| 3.7 | `reaction-function-estimator`, `implied-prob-calc`, `statement-diff`, `tone-scorer`, `dot-plot`, `cap-pressure`, `event-policy-lab`, `drift-significance`, `floor-break` |

Multe dintre ele sunt variante ale aceleiași componente. Propunerea de implementare: patru familii configurabile, în loc de 50 de widget-uri separate: **book** (ladder, DOM, tape, footprint, CVD, licitație, coadă), **x-ray** (ghicește, apoi dezvăluie, peste orice sesiune), **claim lab** (preînregistrare, R0, martori, IS/OOS, costuri) și **macro panel** (curbă, regim, corelații, bancă centrală).

## Decizii și întrebări deschise

**Decizii luate în acest fișier:**
1. **Numărul de lecții nu s-a schimbat:** 7 + 8 + 8 + 8 + 6 + 8 + 8 = 53. S-a schimbat doar distribuția temelor:
   - Market Profile apare în README §3 și la 3.3, și la 3.4. Aici se predă o singură dată, în 3.3.8, unde îl pune și R3 §8.2.
   - În 3.4, locul eliberat merge la a doua lecție Elliott (laboratorul de numărători alternative, cerut ca laborator al unității), iar Gann se predă împreună cu ciclurile și metodele ezoterice (3.4.8).
   - „Cum se testează o metodă” devine prima lecție din 3.4 (3.4.1), ca protocolul să fie aplicat în toate celelalte.
2. **Suprapunerile cu Nivelul 2 au fost eliminate.** Hărțile publicate pe 22.10.2026 (2.3.8, 2.5.7, 2.5.8, 2.6.6, 2.10.6–2.10.8, 2.11.3) acoperă deja o parte din ce era planificat aici. Lecțiile 3.1.6, 3.1.7, 3.4.2, 3.4.7, 3.7.1, 3.7.3, 3.7.4 și 3.7.6 au fost rescrise ca să pornească de unde se opresc acelea: notarea zonelor și hindsight-ul, inventarul prins și role reversal, ancorele și clusterele Fibonacci, sistemul Ichimoku complet și robustețea parametrilor, modelarea funcției de reacție, voturile și diferențele de text, punctele față de prețuri, fade și straddle puse la probă.
3. **Id-urile de dependență** marcate „(nou în X)” au fost verificate în fișierele publicate ale celorlalte niveluri. Toate există, cu unitatea indicată.
4. **Glosarul:** termenii care existau deja la Nivelurile 1–2 (stop-cluster, role-reversal, b-book, payment-for-order-flow, guaranteed-stop, negative-balance-protection, adverse-selection, tick-volume, turtle-soup, negative-skew, hawkish, dovish, fade, confluence, fibonacci-extension, fresh-zone, priced-in) nu mai sunt definiți aici; lecțiile doar îi leagă.
5. **Instituțiile reale** apar numai în cazurile etichetate "Historical case". Banca simulatorului e LCB, sintetică; „Decision day” are structura unei zile FOMC, dar nu folosește numele.

**Întrebări deschise:**
1. **README §3 trebuie aliniat.** Rândul 3.4 ar trebui să spună „cicluri și metode ezoterice” în loc de „Market Profile”. Traseul Technical analyst nu conține 3.3; propun ca 3.3.8 să fie adăugată traseului ca lecție-punte, pentru că CMT Level II include Market Profile.
2. **Id-uri de glosar dublate cu Nivelul 4:** `correlation-breakdown`, `credit-spread`, `flash-crash` sunt definite și în level-4-professional.md. Nivelul 3 le introduce primul; propun ca Nivelul 4 doar să le lege.
3. **`carry-trade` (3.6.6) și `carry` (3.13):** primul e varianta FX, macro; al doilea, strategia pe toate clasele de active. Pot rămâne separate, cu legătură între ele, sau se pot uni sub `carry`.
4. **Ordinea față de statistică și backtesting:** laboratoarele din 3.4 și 3.5 vin, ca numerotare, înaintea lui 3.10–3.11 (core). Ele folosesc un protocol ghidat și simplificat. Trebuie decis dacă aplicația recomandă explicit 3.10 înainte de 3.4.
5. **De verificat înainte de publicare ([BK] în cercetare):** acuratețea algoritmilor Lee–Ready (75–90%); textul exact al CEA §4c(a)(5)(C); calendarul interdicției PFOF din UE (MiFIR, 2026); statutul regulii 611; forma regulii Taylor folosite ca model pentru LCB; afirmația că intervențiile valutare sunt parțial anulate; rutarea clienților profitabili spre A-book; regulile de prioritate pentru ordinele ascunse și ordinea criteriilor de departajare în licitații.
6. **Cifrele generate de simulator** (de exemplu, regula după care fade-ul „merge” doar la |z| < 1, latența de 300–1,500 ms, efectul agenților care urmăresc Fibonacci) sunt parametri de design, nu fapte despre piețe. UI-ul trebuie să le eticheteze ca atare ("Simulator setting").
7. **Volumul de construcție:** această jumătate cere cele mai grele extensii ale simulatorului (S8 cu agenți și radiografie, S6 cu bancă centrală, S9 cu lumea macro). Propunerea de prioritate: întâi S8 · agents + x-ray și S7 · claim lab (deblochează 3.1, 3.3, 3.4, 3.5), apoi S8 · venues / matching / auctions (3.2), apoi S9 · macro world și S6 · central bank (3.6, 3.7).
8. **Cazurile istorice cu cifre** (SNB 2015, flash crash 2010, CFTC v. Sarao, BoJ 2024, august 2024, 2022 acțiuni–obligațiuni, estimările QE/QT) vin din R3 și R4. Unele au surse secundare sau fragmente de căutare; se verifică înainte de publicare, după regula din README §12.

## Registru de concepte noi

Conceptele introduse în 3.1–3.7, de adăugat în `concepts.ts` (câmpurile `name` și `summary`; `body`, `example` și `related` se scriu odată cu scripturile lecțiilor). Coloana „Unitate” arată unde apar prima dată.

| id | Name | Definition | Unitate |
|---|---|---|---|
| liquidity-pool | Liquidity pool | A concentration of resting orders (limits, take-profits, stop-losses) at or near a price level. | 3.1 |
| stop-clustering | Stop and take-profit clustering | Conditional orders bunch near round numbers: take-profits at the level, stop-losses just beyond it. | 3.1 |
| stop-cascade | Stop cascade | Triggered stops become market orders that push price into further stops, accelerating the move. | 3.1 |
| liquidity-sweep | Liquidity sweep | Price trades through a level where stops rest, then closes back inside; known only after the close. | 3.1 |
| equal-highs-lows | Equal highs and lows | Two or more swing extremes within a stated tolerance, beyond which stops plausibly rest. | 3.1 |
| reference-levels | Reference levels | Widely watched prices: prior-day and session highs and lows, opening prices and round numbers. | 3.1 |
| price-imbalance | Price imbalance | A fast one-sided move that leaves prices with little two-sided trading; not the same as order-flow imbalance. | 3.1 |
| fair-value-gap | Fair value gap | A three-candle gap between candle 1's extreme and candle 3's opposite extreme; its revisit rate matches the base rate. | 3.1 |
| liquidity-void | Liquidity void | A price area traded quickly with little volume or time, such as a low-volume node or single prints. | 3.1 |
| zone-grading | Zone grading | Rating supply and demand zones with written criteria before the session, then testing whether grades beat random zones. | 3.1 |
| trapped-inventory | Trapped inventory | The size and average price of positions caught in a failed move, whose stops and break-even exits shape later reactions. | 3.1 |
| market-venue-types | Market structures | Order-driven, quote-driven, brokered and hybrid ways of matching buyers and sellers. | 3.2 |
| venue-fragmentation | Venue fragmentation | One instrument trading on many venues, so no single book or feed shows the whole market. | 3.2 |
| limit-order-book | Limit order book (L1/L2/L3) | Resting bids and offers by price: best quotes (L1), size per level (L2) or every order (L3). | 3.2 |
| market-depth | Market depth | Size available near the best prices; it decides how far a market order walks the book. | 3.2 |
| liquidity-dimensions | Liquidity dimensions | Tightness, depth, resiliency and immediacy: four separate ways a market can be liquid or not. | 3.2 |
| market-making | Market making | Quoting both sides to earn the spread while carrying inventory and adverse-selection risk. | 3.2 |
| adverse-selection | Adverse selection | Losses a liquidity provider takes when better-informed traders fill its quotes just before price moves. | 3.2 |
| queue-priority | Queue priority | Matching rules (FIFO, pro-rata) that decide which resting orders at one price fill first, and what resets your place. | 3.2 |
| hidden-liquidity | Hidden liquidity | Size not shown in the book: icebergs, hidden and pegged orders, and off-exchange liquidity. | 3.2 |
| iceberg-order | Iceberg order | An order that shows only a slice of its size and refills the slice from a hidden reserve. | 3.2 |
| maker-taker | Maker-taker fees | Fee schedules that pay rebates to resting orders and charge orders that take liquidity. | 3.2 |
| broker-models | Broker execution models | Agency/STP, ECN, B-book and hybrid ways a broker handles client orders and the risk they create. | 3.2 |
| last-look | Last look | A liquidity provider's short window to accept or reject a trade request at its quoted price. | 3.2 |
| nbbo | National best bid and offer | The best bid and offer across all US exchanges for a stock, taken from the consolidated feed. | 3.2 |
| payment-for-order-flow | Payment for order flow | Payments a broker receives for routing client orders to a wholesaler or a venue. | 3.2 |
| best-execution | Best execution | A broker's duty to seek the most favourable terms reasonably available for each client order. | 3.2 |
| call-auction | Call auction | Orders gather without matching, then execute at one price that maximises traded volume. | 3.2 |
| auction-imbalance | Auction imbalance | Unmatched buy or sell quantity at the indicative auction price, published before the cross. | 3.2 |
| tape-reading | Tape reading | Reading time-and-sales prints (price, size, aggressor, pace) to describe urgency, not to forecast direction. | 3.3 |
| trade-classification | Trade classification | Labelling each trade buyer- or seller-initiated, by exchange flag or by rules that misclassify a share of trades. | 3.3 |
| depth-of-market | Depth of market (DOM) | A price ladder of resting size, recent trades and working orders that changes as orders are added and pulled. | 3.3 |
| footprint-chart | Footprint chart | A bar split by price level that shows volume traded at the bid and at the ask. | 3.3 |
| footprint-imbalance | Footprint imbalance | Ask volume at one price far above bid volume one tick lower, or the reverse, often at 3:1. | 3.3 |
| cumulative-volume-delta | Cumulative volume delta | Running sum of aggressive buy minus aggressive sell volume from a chosen anchor. | 3.3 |
| delta-divergence | Delta divergence | Price makes a new extreme while cumulative delta does not; a fragile move, not a reversal signal. | 3.3 |
| absorption | Absorption | Heavy aggressive volume at a level that fails to move price because passive orders soak it up. | 3.3 |
| order-flow-exhaustion | Order-flow exhaustion | Aggressive volume drying up at the extreme of a move. | 3.3 |
| spoofing | Spoofing and layering (illegal) | Placing orders with intent to cancel before execution to mislead others about supply or demand. | 3.3 |
| market-profile | Market Profile (TPO) | A distribution of time at price from 30-minute periods, with point of control, value area and initial balance. | 3.3 |
| initial-balance | Initial balance | The price range of the first hour of the regular session. | 3.3 |
| auction-market-theory | Auction market theory | Price moves to find trade: balance means rotation inside value, imbalance means a search for new value. | 3.3 |
| method-trial | Method trial | A pre-registered test of a method's claim against a base rate, the R0 control and costs. | 3.4 |
| falsifiability | Falsifiability | A claim is testable only if some possible result could show it is wrong. | 3.4 |
| fibonacci-clusters | Fibonacci projections and clusters | Three-point projections and overlapping levels from several swings; with enough swings, clusters always exist. | 3.4 |
| anchor-selection | Anchor selection | Choosing which swings to measure from; more candidate anchors make some level fit almost any past turn. | 3.4 |
| elliott-wave | Elliott Wave Principle | A framework that labels trends as five-wave impulses and three-wave corrections under three hard rules. | 3.4 |
| elliott-alternate-count | Alternate wave counts | Several valid wave counts of the same path, often with opposite forecasts. | 3.4 |
| wyckoff-method | Wyckoff method | Reading trading ranges as accumulation or distribution through events, phases and three laws. | 3.4 |
| wyckoff-spring | Spring and upthrust | A break beyond a range edge that closes back inside, usually named only in hindsight. | 3.4 |
| harmonic-patterns | Harmonic patterns | Five-point XABCD structures whose legs must meet Fibonacci ratios, ending in a potential reversal zone. | 3.4 |
| ichimoku-system | Ichimoku trading system | The full Ichimoku rule set (cloud filter, Tenkan-Kijun trigger, Chikou confirmation, Kijun exit) tested as one system. | 3.4 |
| gann-methods | Gann methods | Angles, squares and time cycles from W. D. Gann; partly esoteric and dependent on chart scale. | 3.4 |
| scale-dependence | Scale dependence | A drawn angle changes meaning when the chart's price or time scale changes. | 3.4 |
| spurious-cycles | Spurious cycles | Periodic-looking patterns that spectral analysis finds even in pure noise. | 3.4 |
| smart-money-concepts | Smart money concepts (SMC/ICT) | Retail vocabulary that renames liquidity, structure and zone ideas around a story of institutional intent. | 3.5 |
| claim-layers | Mechanics, tendencies, narratives | Sorting a claim into market mechanics, measured statistical tendencies or untestable stories. | 3.5 |
| intent-attribution | Intent attribution | Explaining a price move by what "they" intended, which a chart cannot show. | 3.5 |
| break-of-structure | Break of structure (BOS) | SMC name for a with-trend break of the last swing: Dow theory's new high or low. | 3.5 |
| change-of-character | Change of character (CHoCH) | SMC name for the first counter-trend break of the last protected swing. | 3.5 |
| displacement | Displacement | SMC name for a fast run of large trend bars: classical momentum. | 3.5 |
| inducement | Inducement | SMC claim that a minor swing is bait whose stops are taken before the real move; the intent is unprovable. | 3.5 |
| order-block | Order block | SMC name for the last opposite candle before a strong move: a renamed supply or demand base. | 3.5 |
| premium-discount | Premium and discount | SMC split of a range at 50%: buy below, sell above; the old 50% rule. | 3.5 |
| optimal-trade-entry | Optimal trade entry (OTE) | SMC retracement band of 62-79%, overlapping Fibonacci 61.8-78.6%. | 3.5 |
| killzones | Killzones | SMC session windows; their higher volatility is real, their directional role is unproven. | 3.5 |
| power-of-three | Power of three (AMD) | SMC claim that each bar runs accumulation, manipulation, distribution; any closed bar can be narrated so. | 3.5 |
| ipda-claim | IPDA claim | The unfalsifiable claim that one algorithm delivers price between liquidity pools and gaps. | 3.5 |
| smt-divergence | SMT divergence | SMC name for correlated markets disagreeing at a swing: Dow's confirmation principle. | 3.5 |
| testable-reformulation | Testable reformulation | Rewriting a narrative claim as a rule, an event, an outcome, a horizon and a baseline. | 3.5 |
| bond-price-yield | Bond price and yield | Bond prices fall when yields rise, and long maturities move more for the same change in yield. | 3.6 |
| real-yield | Real yield | A nominal yield minus expected inflation. | 3.6 |
| rate-differential | Rate differential | The gap between two currencies' interest rates, a main driver of exchange rates. | 3.6 |
| yield-curve | Yield curve | Yields across maturities; its slope reflects expected policy, growth, inflation and the term premium. | 3.6 |
| curve-moves | Steepeners and flatteners | Bull or bear changes in curve slope, named by which end of the curve moves more. | 3.6 |
| term-premium | Term premium | Extra yield investors demand to hold long bonds instead of rolling short ones. | 3.6 |
| inflation-regime | Inflation regime | The inflation and policy backdrop that decides how assets react to the same data. | 3.6 |
| stock-bond-correlation | Stock-bond correlation | The co-movement of equities and government bonds; its sign changes with the monetary regime. | 3.6 |
| regime-dependent-reaction | Regime-dependent reaction | The same release moves assets differently depending on what the market fears most. | 3.6 |
| dollar-smile | Dollar smile | The dollar tends to rise in US booms and in global stress and to fall in synchronised global growth. | 3.6 |
| safe-haven | Safe haven | An asset that tends to gain in stress; which assets play the role changes with the regime. | 3.6 |
| commodities-in-macro | Commodities in macro | Oil, copper and gold as macro signals: supply and growth, industrial demand, real yields and official buying. | 3.6 |
| commodity-currencies | Commodity currencies | Currencies whose terms of trade follow the prices of their main commodity exports. | 3.6 |
| risk-on-risk-off | Risk-on / risk-off | A regime in which assets move together with global risk appetite. | 3.6 |
| carry-trade | Carry trade | Borrowing a low-yield currency to hold a high-yield one: small steady gains, rare large losses. | 3.6 |
| carry-unwind | Carry unwind | A fast reversal of carry positions when volatility jumps or the funding currency rallies. | 3.6 |
| business-cycle | Business cycle | Expansion and contraction phases that are identified reliably only in hindsight. | 3.6 |
| sector-rotation | Sector rotation | Shifting sector leadership through the cycle; the edge shrinks after costs and timing errors. | 3.6 |
| credit-spreads | Credit spreads | Corporate minus government yields: a gauge of default risk and financial conditions. | 3.6 |
| correlation-instability | Correlation instability | Correlations change sign and size with the dominant shock and often rise toward 1 in crises. | 3.6 |
| rolling-correlation | Rolling correlation | A correlation recomputed over a moving window; short windows are noisy, long ones lag. | 3.6 |
| intermarket-relationships | Intermarket relationships | Links among bonds, stocks, commodities and the dollar that hold only within a regime. | 3.6 |
| reaction-function | Reaction function | How a central bank maps inflation, jobs and financial conditions into policy decisions. | 3.7 |
| expected-policy-path | Expected policy path | The sequence of future policy rates that markets price across the upcoming meetings. | 3.7 |
| implied-policy-probability | Implied policy probability | The chance of a rate move derived from rate-futures prices: a price, not a poll. | 3.7 |
| policy-communication | Policy communication | Statement wording, votes, dissents and minutes, read against what markets expected. | 3.7 |
| dot-plot | Dot plot | Each policymaker's projected policy rate; markets watch the median, which a single dot can move. | 3.7 |
| forward-guidance | Forward guidance | Central-bank communication about the likely future path of policy: calendar, threshold or qualitative. | 3.7 |
| qe-qt | QE and QT | Central-bank bond buying (QE) and balance-sheet runoff (QT), acting mainly through the term premium. | 3.7 |
| yield-curve-control | Yield curve control | Capping a long-term yield by standing ready to buy bonds; exits can gap markets. | 3.7 |
| fx-intervention | FX intervention | Official buying or selling of a currency, usually preceded by escalating verbal warnings. | 3.7 |
| spike-fade | Fading the spike | Trading against the first event move in expectation of a partial retracement; practitioner lore. | 3.7 |
| news-straddle | News straddle | Entry orders on both sides before a release; a spike and a reversal can fill one side and stop it out. | 3.7 |
| pre-event-drift | Pre-event drift | Systematic moves before scheduled events, such as the documented pre-FOMC equity drift. | 3.7 |
| buy-rumour-sell-news | Buy the rumour, sell the news | Prices run up into an expected event and reverse when it is confirmed, as positions close. | 3.7 |
| market-tell | Reaction tell | How price reacts to news hints at positioning: falling on good news suggests a heavy market. | 3.7 |
| tail-event | Tail event | A rare, extreme move in which liquidity vanishes and stops fill far from their levels. | 3.7 |
| liquidity-vacuum | Liquidity vacuum | A moment when resting orders disappear and price gaps to the next available bids or offers. | 3.7 |

## Termeni noi de glosar

Termenii introduși în 3.1–3.7, în ordinea lecțiilor (195 de termeni). Termenii care existau deja în nivelurile anterioare sunt doar legați din lecții și nu apar aici.

| id | Term | Definition |
|---|---|---|
| liquidity-pool | Liquidity pool | A cluster of waiting orders near one price, such as stops just beyond a swing high. |
| resting-order | Resting order | An order waiting in the book, or at the broker, until price reaches it. |
| conditional-order | Conditional order | An order that acts only when price reaches a trigger, such as a stop-loss or take-profit. |
| take-profit-cluster | Take-profit cluster | Many take-profit orders at the same price, often exactly on a round number. |
| stop-cascade | Stop cascade | Triggered stops push price into more stops, so the move speeds up. |
| liquidity-sweep | Liquidity sweep | Price trades through a level, triggers the stops there, then closes back inside. Also called a stop run. |
| equal-highs-lows | Equal highs / equal lows | Two or more swing highs, or lows, at nearly the same price, within a stated tolerance. |
| reference-level | Reference level | A price many traders watch, such as yesterday's high, today's open or a round number. |
| detection-tolerance | Detection tolerance | How close two prices must be to count as equal in a rule, often a fraction of ATR. |
| fair-value-gap | Fair value gap | A three-candle gap: candle 1's high sits below candle 3's low, or the reverse. |
| imbalance | Imbalance | Either more aggressive buying than selling, or a fast one-sided move. Always say which one you mean. |
| liquidity-void | Liquidity void | A price area crossed quickly with little trading, such as a low-volume node. |
| zone-grade | Zone grade | A rating given to a supply or demand zone from written criteria, before seeing what happens. |
| locked-drawing | Locked drawing | A level or zone fixed before the session, so it can't be redrawn after the result. |
| trapped-inventory | Trapped inventory | Positions caught on the wrong side of a failed move, described by their size and average price. |
| break-even-exit | Break-even exit | Closing a losing position as soon as price returns to the entry price. |
| venue | Venue | One place where orders meet: an exchange, a dark pool, a dealer platform or a broker. |
| clob | Central limit order book | A shared book where buy and sell limit orders match by price, then by time. |
| otc-market | Over-the-counter market | Trading directly between parties or with dealers, without one central exchange book. |
| dealer-market | Dealer market | A market where dealers quote prices and customers trade against them. |
| internalisation | Internalisation | A dealer or broker filling client orders from its own book instead of sending them out. |
| dark-pool | Dark pool | A trading venue that does not display its orders before they execute. |
| level-1 | Level 1 (L1) | The best bid, the best ask and their sizes, plus the last trade. |
| level-2 | Level 2 (L2) | The total size waiting at each price level of the order book. |
| level-3 | Level 3 (L3) | Every individual order in the book, with its place in the queue. |
| depth-chart | Depth chart | A chart of cumulative bid and ask size at each distance from the current price. |
| walking-the-book | Walking the book | A large market order filling across several price levels, so its average price gets worse. |
| resiliency | Resiliency | How fast the order book refills after a large order has used it up. |
| inventory-risk | Inventory risk | The risk a market maker carries from the positions it builds up while quoting. |
| quote-skew | Quote skew | Shifting both bid and ask to attract trades that reduce the dealer's inventory. |
| high-frequency-trading | High-frequency trading | Very fast automated trading with short holding periods and many cancelled orders. |
| queue-position | Queue position | How much size sits ahead of your limit order at the same price. |
| fifo | FIFO (price-time priority) | Matching rule: best price first; at one price, the earliest order fills first. |
| pro-rata | Pro-rata | Matching rule that splits incoming volume among resting orders in proportion to their size. |
| tick-size | Tick size | The smallest allowed price step for an instrument. |
| iceberg-order | Iceberg order | An order showing only part of its size; the visible slice refills from a hidden reserve. |
| display-quantity | Display quantity | The visible slice of an iceberg order. |
| hidden-order | Hidden order | A resting order that does not appear in the visible book. |
| midpoint-peg | Midpoint peg | An order that floats at the midpoint between the best bid and the best ask. |
| post-only | Post-only order | An order rejected or repriced if it would take liquidity instead of resting. |
| maker-taker | Maker-taker fees | Fees that reward orders adding liquidity and charge orders removing it. |
| a-book | A-book | A broker model that passes client orders on to outside liquidity providers. |
| stp | STP (straight-through processing) | Client orders sent automatically to outside liquidity, without a dealing desk. |
| ecn | ECN | An electronic network where many participants' orders meet in one book. |
| last-look | Last look | A short window in which a liquidity provider may reject your trade at its quoted price. |
| requote | Requote | A dealer declining your requested price and offering another one. |
| nbbo | NBBO | The highest bid and the lowest offer across all US exchanges for a stock. |
| sip | SIP (consolidated feed) | The public US feed that combines quotes and trades from all exchanges. |
| best-execution | Best execution | A broker's duty to get clients the best reasonably available terms for their orders. |
| price-improvement | Price improvement | A fill at a better price than the best quote shown when the order arrived. |
| wholesaler | Wholesaler | A firm that fills large volumes of retail orders against its own book. |
| call-auction | Call auction | Orders collect without trading, then all match at one price. |
| uncross | Uncross | The moment a call auction matches its orders at the single clearing price. |
| indicative-price | Indicative price | The price at which an auction would clear if it ended now. |
| paired-volume | Paired volume | The quantity that would match at the current indicative auction price. |
| auction-imbalance | Auction imbalance | Buy or sell quantity left unmatched at the indicative auction price. |
| market-on-close | Market-on-close (MOC) order | An order to trade only in the closing auction; market-on-open is the opening version. |
| time-and-sales | Time and sales | A running list of trades: time, price, size and often the side that initiated. |
| aggressor | Aggressor | The side that crossed the spread to trade: a buyer at the ask or a seller at the bid. |
| print | Print | One reported trade on the tape. |
| tick-rule | Tick rule | Guessing a trade's side from the price change: an uptick counts as a buy, a downtick as a sell. |
| dom | DOM (depth of market) | A price ladder showing resting size at each price, recent trades and your own orders. |
| pulling | Pulling | Resting orders cancelled as price approaches them. |
| stacking | Stacking | Resting size added at a price level. |
| reloading | Reloading | The same size reappearing at a level after it trades, often a sign of an iceberg. |
| liquidity-heatmap | Liquidity heatmap | A chart that colours resting order size by price and time. |
| footprint | Footprint | A bar showing, at each price, the volume traded at the bid and at the ask. |
| bar-delta | Bar delta | Aggressive buy volume minus aggressive sell volume within one bar. |
| diagonal-imbalance | Diagonal imbalance | Ask volume at one price several times the bid volume one tick lower, or the reverse. |
| stacked-imbalance | Stacked imbalance | Three or more same-side diagonal imbalances at consecutive prices. |
| unfinished-auction | Unfinished auction | A bar extreme with trading on both bid and ask, which practitioners claim gets revisited. |
| exhaustion-print | Exhaustion print | Very thin one-sided volume at a bar's extreme, as if the aggressors ran out. |
| volume-delta | Volume delta | Aggressive buying minus aggressive selling over a period. |
| cvd | Cumulative volume delta (CVD) | The running total of volume delta from a chosen starting point. |
| delta-divergence | Delta divergence | Price makes a new high or low while cumulative delta does not. |
| absorption | Absorption | Heavy aggressive trading at a level that doesn't move price, because passive orders take it all. |
| effort-vs-result | Effort vs result | Wyckoff's comparison of volume (effort) with price progress (result). |
| iceberg-refill | Iceberg refill | The visible slice of an iceberg reappearing after it trades. |
| reserve-quantity | Reserve quantity | The hidden part of an iceberg order still waiting to be shown. |
| spoofing | Spoofing | Placing orders you intend to cancel before execution, to mislead other traders. Illegal. |
| layering | Layering | Orders at several prices. Genuine layers are legal; layers meant to be cancelled are illegal spoofing. |
| cancel-to-fill-ratio | Cancel-to-fill ratio | Orders cancelled divided by orders filled. A high value alone doesn't prove manipulation. |
| market-abuse | Market abuse | Illegal conduct that distorts prices or uses inside information, such as spoofing. |
| tpo | TPO | Time-price opportunity: one letter for each 30-minute period that traded at a price. |
| initial-balance | Initial balance | The price range of the first hour of the regular session. |
| single-prints | Single prints | Prices traded in only one 30-minute period, the trace of a fast move. |
| day-type | Day type | A Market Profile label for a session's shape, such as a trend day or a normal day. |
| falsifiable | Falsifiable | A claim is falsifiable if some possible result would show it is wrong. |
| pre-registration | Pre-registration | Writing rules, parameters and sample size before running a test, so the results can't steer them. |
| fibonacci-projection | Fibonacci projection | A target from three points: C plus a ratio times the move from A to B. |
| fibonacci-cluster | Fibonacci cluster | A zone where Fibonacci levels drawn from different swings overlap. |
| fibonacci-time-zones | Fibonacci time zones | Vertical lines at Fibonacci-numbered bar counts, claimed to mark turning times. |
| impulse-wave | Impulse wave | In Elliott Wave, a five-wave move in the direction of the trend. |
| corrective-wave | Corrective wave | In Elliott Wave, a three-wave move against the trend, labelled A-B-C. |
| wave-degree | Wave degree | The size class of an Elliott wave, defined by its form rather than its duration. |
| diagonal-triangle | Diagonal | An Elliott impulse shaped like a wedge, in which waves 1 and 4 overlap. |
| alternate-count | Alternate count | Another valid Elliott labelling of the same chart, often with the opposite forecast. |
| composite-man | Composite Man | Wyckoff's study device: imagine one large operator behind the market. A heuristic, not a fact. |
| selling-climax | Selling climax | A Wyckoff event: a sharp drop on heavy volume that may end a downtrend. |
| spring | Spring | A Wyckoff event: a dip below a range's low that closes back inside the range. |
| upthrust | Upthrust | A Wyckoff event: a push above a range's high that closes back inside the range. |
| sign-of-strength | Sign of strength | A Wyckoff event: a strong rally on rising volume out of an accumulation range. |
| xabcd | XABCD | The five labelled turning points of a harmonic pattern. |
| potential-reversal-zone | Potential reversal zone | The price area at point D where a harmonic pattern claims price will turn. |
| gartley | Gartley pattern | A harmonic pattern with B at 0.618 and D at 0.786 of the XA leg. |
| ichimoku-system | Ichimoku system | The full set of Ichimoku entry, confirmation and exit rules, tested together as one system. |
| parameter-grid | Parameter grid | Results of one rule tested across nearby parameter settings, to see plateaus or lucky spikes. |
| gann-angle | Gann angle | A line rising one price unit per time unit, or another ratio; its slope depends on chart scale. |
| square-of-nine | Square of Nine | Gann's spiral table of numbers, claimed to give price and time targets. |
| spectral-analysis | Spectral analysis | A method that splits a series into cycles; it finds peaks even in pure noise. |
| smc | SMC (smart money concepts) | Retail trading vocabulary built on a story of institutions hunting liquidity. |
| ict | ICT | "Inner Circle Trader", the online mentorship whose terms SMC repackaged. |
| intent-attribution | Intent attribution | Explaining a price move by what "they" wanted, which no chart can show. |
| bos | BOS (break of structure) | SMC term for a new high in an uptrend or a new low in a downtrend. |
| choch | CHoCH (change of character) | SMC term for the first break against the trend of its last swing. |
| mss | MSS (market structure shift) | SMC term for a failed breakout followed by a sharp reversal. |
| displacement | Displacement | SMC term for a fast run of large candles in one direction. |
| buy-side-liquidity | Buy-side liquidity | SMC term for buy stops resting above swing highs. |
| sell-side-liquidity | Sell-side liquidity | SMC term for sell stops resting below swing lows. |
| inducement | Inducement | SMC term for a small swing said to be bait before the real move. |
| judas-swing | Judas swing | SMC term for an early-session false move against the day's later direction. |
| swing-failure-pattern | Swing failure pattern | Price trades beyond a prior swing extreme, then closes back inside. Also called a 2B. |
| draw-on-liquidity | Draw on liquidity | SMC term for the high or low that price is expected to reach next. |
| order-block | Order block | SMC term for the last opposite candle before a strong move: a renamed supply or demand base. |
| breaker-block | Breaker block | SMC term for a failed order block that flips its role: classic role reversal. |
| mitigation | Mitigation | SMC term for price returning to an earlier zone, said to let institutions finish their orders. |
| consequent-encroachment | Consequent encroachment | SMC term for the 50% point of a gap or a wick. |
| premium-discount | Premium and discount | SMC terms for the upper and lower halves of a range, split at 50%. |
| optimal-trade-entry | Optimal trade entry (OTE) | SMC term for a 62-79% retracement zone, close to Fibonacci 61.8-78.6%. |
| dealing-range | Dealing range | SMC term for the swing range used to measure premium and discount. |
| pd-array | PD array | SMC list of zone types, such as order blocks, gaps and old highs, ranked by importance. |
| killzone | Killzone | SMC term for a session window, such as the London open, said to give better setups. |
| silver-bullet | Silver Bullet | An SMC setup: a gap entry after a sweep, inside a fixed one-hour window. |
| power-of-three | Power of three (AMD) | SMC claim that each bar runs accumulation, manipulation, then distribution. |
| ipda | IPDA | SMC claim of an "interbank price delivery algorithm" steering price. There is no evidence it exists. |
| smt-divergence | SMT divergence | SMC term for two correlated markets disagreeing at a swing high or low. |
| asian-range | Asian range | The high-low range of the Asian session, used as a reference later in the day. |
| testable-hypothesis | Testable hypothesis | A claim written as a rule, an outcome, a horizon and a baseline, so data can reject it. |
| yield | Yield | The yearly return a bond pays at its current price; it moves opposite to the price. |
| real-yield | Real yield | A yield after subtracting expected inflation. |
| breakeven-inflation | Breakeven inflation | The inflation rate priced by markets: nominal yield minus inflation-protected yield. |
| zero-coupon-bond | Zero-coupon bond | A bond that pays no coupons, only its face value at maturity. |
| rate-differential | Rate differential | The difference between two currencies' interest rates. |
| yield-curve | Yield curve | A line of government bond yields from short to long maturities. |
| inversion | Curve inversion | Short-term yields above long-term yields; a long-lead recession warning with some false alarms. |
| steepener | Steepener | A curve move in which long yields rise relative to short yields. |
| flattener | Flattener | A curve move in which the gap between long and short yields narrows. |
| term-premium | Term premium | Extra yield for holding a long bond instead of rolling short ones. |
| disinflation | Disinflation | Inflation that is still positive but falling. |
| policy-regime | Policy regime | The central bank's current stance, such as fighting inflation or supporting growth. |
| dollar-index | Dollar index | An index of the US dollar against a basket of major currencies. |
| dollar-smile | Dollar smile | The idea that the dollar rises in US booms and in global crises, and weakens in between. |
| safe-haven | Safe haven | An asset that tends to hold its value or rise when markets fall. |
| funding-currency | Funding currency | A low-interest currency borrowed to finance carry trades. |
| terms-of-trade | Terms of trade | A country's export prices relative to its import prices. |
| commodity-currency | Commodity currency | A currency that tends to move with the price of its country's main exports. |
| copper-gold-ratio | Copper-gold ratio | The copper price divided by the gold price, watched as a rough gauge of growth. |
| risk-on | Risk-on | A phase when investors favour stocks, credit and high-yield currencies. |
| risk-off | Risk-off | A phase when investors move to cash, government bonds and safe-haven currencies. |
| carry-trade | Carry trade | Borrowing in a low-rate currency to hold a high-rate one and earn the difference. |
| carry-unwind | Carry unwind | Many carry trades closed at once, causing a sharp jump in the funding currency. |
| business-cycle | Business cycle | The economy's repeating but irregular pattern of expansion and contraction. |
| sector-rotation | Sector rotation | Moving money between industry sectors as the business cycle changes. |
| credit-spread | Credit spread | The extra yield a company bond pays over a government bond of similar maturity. |
| financial-conditions | Financial conditions | How easy money is to get, judged from rates, spreads, stocks and the currency together. |
| rolling-correlation | Rolling correlation | A correlation recalculated over a moving window of recent data. |
| intermarket-analysis | Intermarket analysis | Studying how bonds, stocks, commodities and currencies affect each other. |
| correlation-breakdown | Correlation breakdown | A familiar relationship between two assets weakening or reversing its sign. |
| reaction-function | Reaction function | How a central bank changes rates in response to inflation, jobs and markets. |
| taylor-rule | Taylor rule | A simple formula linking the policy rate to inflation and economic slack. |
| expected-policy-path | Expected policy path | The future policy rates that markets price across the next meetings. |
| rate-futures | Rate futures | Futures priced as 100 minus an expected interest rate. |
| implied-rate | Implied rate | The interest rate implied by a rate-futures price: 100 minus the price. |
| implied-probability | Implied probability | The chance of an outcome backed out of market prices; it includes risk premia. |
| ois | OIS | Overnight index swap: a contract whose rate shows the expected average overnight rate. |
| policy-statement | Policy statement | The written text a central bank releases with its rate decision. |
| dissent | Dissent | A policymaker's vote against the majority decision. |
| vote-split | Vote split | How a policy committee's votes divide between the options. |
| minutes | Minutes | A detailed record of a policy meeting, released weeks later. |
| dot-plot | Dot plot | A chart of each policymaker's projected policy rate for the coming years. |
| neutral-rate | Neutral rate | The policy rate thought neither to speed up nor to slow down the economy. |
| forward-guidance | Forward guidance | What a central bank says about its likely future policy. |
| press-conference | Press conference | The live question session after a rate decision, which often moves markets a second time. |
| quantitative-easing | Quantitative easing (QE) | A central bank buying bonds at scale to push long-term yields down. |
| quantitative-tightening | Quantitative tightening (QT) | A central bank shrinking its bond holdings, usually by letting them mature. |
| yield-curve-control | Yield curve control | A central bank capping a long-term yield by buying whatever bonds it must. |
| fx-intervention | FX intervention | Authorities buying or selling their own currency to move its price. |
| currency-peg | Currency peg | An official promise to hold an exchange rate at a level, a floor or within a band. |
| news-straddle | News straddle | A buy-stop above and a sell-stop below price before a release, to catch either direction. |
| pre-announcement-drift | Pre-announcement drift | A tendency for prices to move before a scheduled announcement. |
| buy-the-rumour-sell-the-news | Buy the rumour, sell the news | Prices rise before expected good news, then fall once it is confirmed. |
| optional-stopping | Optional stopping | Ending a test as soon as results look good, which inflates false findings. |
| tail-event | Tail event | A rare, extreme move far outside normal daily ranges. |
| liquidity-vacuum | Liquidity vacuum | A moment when buyers or sellers vanish and price jumps to distant orders. |
| flash-crash | Flash crash | A very fast, deep price fall that largely reverses within minutes or hours. |
