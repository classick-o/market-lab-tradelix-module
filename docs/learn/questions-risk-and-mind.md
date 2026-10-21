# Întrebări · Risk Management, Stop-Loss, Decision-Making, Psychology, Scenario Analysis

Banca de întrebări din `packages/academy/src/content/questions-b.ts` (48), în forma cerută de [PLAN_LEARN.md](../../PLAN_LEARN.md) §6.1–6.3 și §9.3–9.4: concepte pe fiecare întrebare, explicații pe fiecare variantă greșită, indicii în trei trepte și generatoare de cifre (`vary`) pentru întrebările numerice. Convențiile (lumea simulată, vocea, limitele de lungime) sunt cele din [README.md](README.md).

- Ordinea topicurilor: Risk Management, Stop-Loss, Decision-Making, Trading Psychology, Scenario Analysis.
- Textul pentru utilizator (explicații per variantă, indicii, întrebări noi) e în engleză; notele sunt în română.
- Varianta corectă (✓) își păstrează explicația existentă din `questions-b.ts`. Nu e rescrisă aici.
- **Verificare** apare la fiecare întrebare: calculul refăcut, sau motivul pentru care varianta marcată e singura corectă.
- Indiciile urmează scara din §6.3: 1. direcția, 2. regula sau formula, 3. primul pas calculat.
- Limite respectate: explicație per variantă ≤ 30 de cuvinte, indiciu ≤ 25 de cuvinte.

## Acoperire

### Pe tip și dificultate

Cifrele din paranteză sunt întrebările noi propuse în acest fișier. Cele marcate cu * sunt opționale (nu le cere regula de acoperire).

**Risk Management** · 11 existente (+1*)

| Tip | d1 | d2 | d3 | Total |
|---|---|---|---|---|
| mcq | 2 | 1 | 0 | 3 |
| scenario | 0 | 1 | 2 | 3 |
| numeric | 0 (+1*) | 4 | 1 | 5 (+1*) |
| **Total** | **2 (+1*)** | **6** | **3** | **11 (+1*)** |

**Stop-Loss** · 9 existente (+2)

| Tip | d1 | d2 | d3 | Total |
|---|---|---|---|---|
| mcq | 2 (+1) | 3 | 0 | 5 (+1) |
| scenario | 0 | 1 | 1 | 2 |
| numeric | 0 | 1 (+1) | 1 | 2 (+1) |
| **Total** | **2 (+1)** | **5 (+1)** | **2** | **9 (+2)** |

**Decision-Making** · 9 existente (+1*)

| Tip | d1 | d2 | d3 | Total |
|---|---|---|---|---|
| mcq | 2 (+1*) | 3 | 0 | 5 (+1*) |
| scenario | 0 | 2 | 2 | 4 |
| numeric | 0 | 0 | 0 | 0 |
| **Total** | **2 (+1*)** | **5** | **2** | **9 (+1*)** |

**Trading Psychology** · 10 existente (+2)

| Tip | d1 | d2 | d3 | Total |
|---|---|---|---|---|
| mcq | 3 (+1) | 3 | 0 | 6 (+1) |
| scenario | 0 | 2 (+1) | 2 | 4 (+1) |
| numeric | 0 | 0 | 0 | 0 |
| **Total** | **3 (+1)** | **5 (+1)** | **2** | **10 (+2)** |

**Scenario Analysis** · 9 existente (+2)

| Tip | d1 | d2 | d3 | Total |
|---|---|---|---|---|
| mcq | 2 (+1) | 3 | 0 | 5 (+1) |
| scenario | 0 | 2 | 2 | 4 |
| numeric | 0 | 0 (+1) | 0 | 0 (+1) |
| **Total** | **2 (+1)** | **5 (+1)** | **2** | **9 (+2)** |

- Toate cele cinci topicuri au deja 2 × d1, 2 × d2 și 1 × d3 pentru check (§6.3). Întrebările noi doar adaugă.
- Patru topicuri au **exact 2 × d1**. La retake (§6.3: „se preferă întrebările nevăzute”) cele două d1 s-ar repeta mereu. De aceea toate întrebările noi d1 sunt utile și dincolo de regula conceptelor.
- Decision-Making și Psychology nu au nicio întrebare numerică, iar Scenario Analysis primește prima prin q-sa-11.

### Acoperirea conceptelor

Numărate doar în acest fișier (întrebările din `questions-a.ts`, de exemplu q-ot-4…q-ot-7, pot eticheta și ele `stop-loss-order` sau `gap-risk`, dar nu sunt numărate aici).

| Concept | Topic | Întrebări existente | Nr. | Noi propuse | Total |
|---|---|---|---|---|---|
| risk-per-trade | Risk Mgmt | q-rm-1, q-rm-2, q-rm-9, q-sa-4 | 4 | — | 4 |
| r-multiple | Risk Mgmt | q-rm-7, q-rm-10 | 2 | q-rm-12*, q-sl-11 | 4 |
| reward-to-risk | Risk Mgmt | q-rm-4, q-rm-6 | 2 | — | 2 |
| expectancy | Risk Mgmt | q-rm-4, q-rm-5, q-rm-6, q-rm-7, q-psy-6, q-psy-9, q-sa-9 | 7 | q-sa-11 | 8 |
| drawdown | Risk Mgmt | q-rm-3, q-rm-11, q-psy-6 | 3 | — | 3 |
| stop-loss-order | Stop-Loss | q-sl-1, q-sl-2, q-sl-5, q-sl-6, q-sl-8 | 5 | q-sl-10 | 6 |
| invalidation-level | Stop-Loss | q-sl-1, q-sl-3, q-sl-4, q-sl-7, q-sl-9 | 5 | — | 5 |
| trailing-stop | Stop-Loss | q-sl-8 | **1** | q-sl-10, q-sl-11 | 3 |
| gap-risk | Stop-Loss | q-rm-10, q-sl-6, q-sa-5 | 3 | — | 3 |
| trading-plan | Decision | q-dm-1, q-dm-2, q-dm-3, q-dm-8, q-psy-5, q-psy-7, q-psy-8 | 7 | q-psy-12 | 8 |
| decision-quality | Decision | q-dm-4, q-dm-5, q-dm-6, q-dm-7, q-dm-9, q-sa-6 | 6 | q-dm-10*, q-sa-10 | 8 |
| journaling | Decision | q-dm-6, q-psy-9 | 2 | q-dm-10* | 3 |
| fomo | Psychology | q-psy-1, q-psy-2, q-dm-8 | 3 | — | 3 |
| revenge-trading | Psychology | q-psy-4, q-psy-5, q-psy-7 | 3 | — | 3 |
| loss-aversion | Psychology | q-psy-3, q-psy-10, q-sl-3 | 3 | — | 3 |
| confirmation-bias | Psychology | — | **0** | q-psy-11, q-psy-12 | 2 |
| scenario-planning | Scenario | q-sa-1, q-sa-2, q-sa-3, q-sa-4, q-sa-5, q-sa-6, q-sa-7, q-sa-8 | 8 | — | 8 |
| base-rates | Scenario | q-psy-8, q-sa-9 | 2 | q-sa-11 | 3 |
| counterfactual-thinking | Scenario | q-dm-9 | **1** | q-sa-10 | 2 |

Concepte din alte topicuri folosite aici: `position-sizing` (q-rm-8, q-rm-9, q-sl-2, q-sl-7), `volatility` (q-rm-8, q-sl-9), `fixed-fractional-sizing` (q-rm-2, q-rm-3), `slippage` (q-sl-5), `support-and-resistance` (q-sl-4), `false-breakout` (q-sa-2).

- Nivelul unui topic e media conceptelor lui (§6.1), deci o întrebare nu trebuie să poarte un concept din propriul topic. q-psy-6, q-psy-8 și q-psy-9 poartă concepte din Risk Management, Decision-Making și Scenario Analysis, pentru că despre asta sunt.
- **Concepte testate, dar nepredate în textul lecțiilor** (apar doar în Concept Library): `trailing-stop` (L10 nu îl explică; doar L04 spune „Move a stop only in the direction that reduces risk”), `confirmation-bias` (L13 nu îl numește, deși widget-ul bias-spotter din §9.2 îl include), `base-rates` (L15 și L17 nu îl numesc). Rescrierea lecțiilor în U3-risk-comes-first.md, U4-plan-and-decide.md și U5-traders-mind.md trebuie să adauge câte un beat pentru fiecare, altfel q-sl-8, q-sl-10, q-sl-11, q-psy-8, q-psy-11, q-psy-12, q-sa-9 și q-sa-11 testează lucruri pe care lecția nu le-a spus.

## Probleme găsite (rezumat)

| Întrebare | Problema | Corectura propusă |
|---|---|---|
| q-rm-3 | Trei pierderi de 1% din contul curent duc 10,000.00 la 9,702.99, nu la 9,700.00. Cifra implică 100.00 pe pierdere, adică exact greșeala din varianta `b`. | „After a run of losing trades” în loc de „After three losing trades” (restul rămâne). |
| q-sl-3 | Prețul la 48.30 e deja sub suportul de la 48.40, iar varianta corectă spune „support has not failed yet”. | Prețul coboară la 48.50, chiar deasupra suportului. |
| q-sl-7 | Varianta corectă dă 50 de unități „for the same 100.00 vUSD risk”. Cu comisionul, 50 de unități riscă 102.45, peste 1%; L08 include costurile în risc, iar L10 dă 48 după costuri. | „Ignore costs.” în scenariu, sau „buy 50 units (48 after costs)” în varianta `d`. |
| q-sl-9 | „Widen the stop” intră în conflict cu regula absolută „never widen a stop” (q-sl-8, L10, tag-ul `moved_stop_away`), pentru că promptul nu spune că tranzacția nu e deschisă. | Prompt „When planning your next trade in a volatile phase, …”; varianta `b` „Place the stop beyond the noise and reduce the size…”. |
| q-psy-8 | Varianta corectă se bazează pe „overconfidence”, termen care nu apare în nicio lecție, concept sau glosar. L17 și L18 predau „recency bias”. | Varianta `d` „Recency bias: four recent wins given more weight than they can carry”, sau L18 adaugă overconfidence (și glosarul). |
| q-psy-10 | Distractorul „Overconfidence” folosește același termen nepredat. | Se rezolvă odată cu q-psy-8; altfel „Confirmation bias”, după ce L13 îl predă. |
| Toate cele numerice | `isCorrect` șterge toate virgulele: „42,9” devine 429, „185,00” devine 18500. Contrazice §9.3 („acceptă virgulă sau punct”). „25%”, „1.6R” și semnul „−” (U+2212) dau NaN. | Vezi „Note pentru implementare”. |

## Note pentru implementare

- **`vary`** se scrie ca în §9.3: `seedFields` (câmpuri, intervale, pași), `formula` (răspunsul), toleranța și constrângerile. Generatorul respinge combinațiile care încalcă o constrângere și trage din nou.
- **Explicația și indiciul 3** conțin cifre, deci se generează din aceleași câmpuri ca promptul. La fiecare `vary` e dat șablonul lor. Indiciile 1 și 2 rămân fixe.
- **Calculele în generator se fac în cenți (întregi)**, ca în `packages/engine` (`toCents`, `commission` rotunjit în sus la cent), ca să nu apară erori de virgulă mobilă la rotunjirea în jos.
- **Parsarea răspunsului numeric** (`isCorrect` din `catalog.ts`):
  - virgula e separator zecimal când e singurul separator și e urmată de 1–2 cifre la final („42,9”, „185,00”); altfel e separator de mii („9,250.00”);
  - se ignoră unitatea de la final (`%`, `R`, `vUSD`, `units`) și spațiile;
  - „−” (U+2212) se tratează ca „-”. Fără asta, variantele cu expectanță negativă (q-rm-5, q-sa-11) trebuie limitate la rezultate pozitive.
- **`practiceSet`** din `catalog.ts` ia azi primele întrebări după id, deterministic. Pool-ul aleator din §6.3 schimbă asta; cu doar 2 × d1 în patru topicuri, întrebările noi d1 contează.

---

## Risk Management (`q-rm-*`)

### Întrebări existente

#### q-rm-1 · mcq · d1 · L08
- **Concepte:** risk-per-trade
- **Explicații per variantă** (varianta corectă păstrează explicația existentă):
  - `a` "The total value of the position you buy" → "That is the position's value, your exposure. Risk per trade is only the slice lost if the stop fills: units × distance to the stop, plus costs."
  - `b` "The commission charged when you open the trade" → "Commission is one part of the cost, not the risk. Risk per trade is the whole planned loss at the stop, costs included."
  - `c` ✓ "The amount you would lose if price reaches your stop-loss, decided before you enter" (corectă)
  - `d` "The largest loss the market could ever cause" → "That is closer to your full exposure. Risk per trade is a planned number: the loss at your stop, chosen before you enter."
- **Verificare:** `c` e definiția din L08, singura care leagă pierderea de stop și de momentul dinaintea intrării. Exemplul din explicație: 100 × 50.00 = 5,000.00 și 100 × 1.00 = 100.00 ✓.

#### q-rm-2 · numeric · d2 · L08
- **Concepte:** risk-per-trade, fixed-fractional-sizing
- **Indicii:** 1. "Start from the account as it is now, not the 10,000.00 you began with." 2. "Risk budget = current account × risk limit." 3. "2% of 9,000.00 is 180.00. Now add 2% of the remaining 250.00."
- **Variații (vary):**
  - `seedFields`: `acct` 8,050.00–9,950.00, pas 50.00 · `pct` ∈ {1, 2}
  - Prompt: "{place} your account has fallen to {acct} vUSD and the risk limit is {pct}% per trade. What is the most you may lose on the next trade, in vUSD? Give the answer to two decimal places." `place` = "In a mission" pentru 1%, "In the Arena" pentru 2%.
  - `formula`: `answer = acct × pct ÷ 100` (exact la cent, pentru că `acct` e multiplu de 50.00)
  - Toleranță: 0.01
  - Constrângeri: `acct` < 10,000.00 (verbul „has fallen”); `acct` nu e multiplu de 1,000.00, ca indiciul 3 să aibă un rest.
  - Șabloane: explicația "The limit is a percentage of the current account: {acct} × {pct}% = {answer} vUSD. Using the starting 10,000.00 ({start}) would let the risk stay high while the account shrinks.", cu `start` = 10,000.00 × pct ÷ 100; indiciul 3 "{pct}% of {thousands} is {a}. Now add {pct}% of the remaining {rest}."
  - Exemplu: Arena, 9,650.00, 2% → 9,650.00 × 2% = **193.00**. Indiciul 3: "2% of 9,000.00 is 180.00. Now add 2% of the remaining 650.00."
- **Verificare:** 9,250.00 × 0.02 = 185.00 = `answer` 185 (toleranță 0.01) ✓.

#### q-rm-3 · scenario · d2 · L08
- **Concepte:** fixed-fractional-sizing, drawdown
- **Explicații per variantă:**
  - `a` "Risk 3% once to get back to even, then return to 1%" → "Wanting to get even fast is a normal urge, but sizing up after losses triples the next loss if this trade fails too. Feeling sure isn't in the rule."
  - `b` "Risk 1% of the original 10,000.00, which is 100.00 vUSD" → "Close, but the rule uses the current account: 1% of 9,700.00 is 97.00. The budget is meant to shrink during a drawdown."
  - `c` "Skip the stop on this trade so a small dip cannot shake them out" → "Without a stop there is no planned loss, so nothing to size to 1%, and entering without a stop counts against Risk Discipline."
  - `d` ✓ "Keep risk at 1% of the current account: 9,700.00 × 1% = 97.00 vUSD" (corectă)
- **Verificare:** 9,700.00 × 1% = 97.00 ✓. `d` e singura care respectă regula de 1% din contul curent; `b` e aproape, dar folosește contul inițial.
- **Probleme găsite:** Cu 1% din contul curent, trei pierderi de −1R duc contul la 10,000.00 × 0.99³ = 9,702.99, nu la 9,700.00. Cifra 9,700.00 înseamnă 100.00 pe pierdere, adică riscul calculat din contul inițial, exact confuzia din `b`. Corectură: „After a run of losing trades, a trader's account is down from 10,000.00 to 9,700.00 vUSD.” Nu se schimbă nicio cifră din variante.

#### q-rm-4 · numeric · d2 · L11
- **Concepte:** reward-to-risk, expectancy
- **Indicii:** 1. "Break-even means the wins and losses cancel out over many trades." 2. "Break-even win rate = risk ÷ (risk + reward)." 3. "Risk + reward = 1.00 + 3.00 = 4.00. Now divide the risk by that."
- **Variații (vary):**
  - `seedFields`: `risk` ∈ {0.50, 1.00, 1.50, 2.00} · `k` (raportul) ∈ {1, 1.5, 2, 2.5, 3, 4} · `reward = risk × k`
  - Prompt: "A trade has its stop {risk} vUSD below the entry and its target {reward} vUSD above. What win rate does it need to break even, before costs? Answer in %, rounded to one decimal place."
  - `formula`: `answer = round1(100 × risk ÷ (risk + reward))` = `round1(100 ÷ (1 + k))`: 50.0, 40.0, 33.3, 28.6, 25.0, 20.0
  - Toleranță: 0.1 (acceptă și 33.33 sau 28.57)
  - Constrângeri: `reward` are cel mult 2 zecimale (garantat de liste); în recapitulare se evită perechea originală (1.00, 3.00).
  - Șabloane: explicația "Break-even win rate = risk ÷ (risk + reward) = {risk} ÷ {sum} = {answer}%. At that rate, wins of +{k}R exactly cancel losses of −1R over many trades."; indiciul 3 "Risk + reward = {risk} + {reward} = {sum}. Now divide the risk by that."
  - Exemplu: stop 1.50 sub intrare, target 3.75 deasupra → 1.50 ÷ 5.25 = 28.57 → **28.6%**.
- **Verificare:** 1.00 ÷ (1.00 + 3.00) = 0.25 = 25.0% = `answer` 25 (toleranță 0.1) ✓.

#### q-rm-5 · numeric · d2 · L11
- **Concepte:** expectancy
- **Indicii:** 1. "Weigh each outcome by how often it happens, then combine the two." 2. "Expectancy = win rate × average win − loss rate × average loss." 3. "Wins: 0.45 × 1.8 = 0.81R. Now subtract the losses' share."
- **Variații (vary):**
  - `seedFields`: `w` (win rate) 30%–60%, pas 5 · `W` (câștigul mediu) 1.0R–3.0R, pas 0.1 · pierderea medie fixă, 1R
  - Prompt: "A method wins {w}% of its trades with an average win of +{W}R and loses {100 − w}% with an average loss of −1R. What is its expectancy per trade, in R? Round to two decimal places."
  - `formula`: `answer = w/100 × W − (1 − w/100) × 1`
  - Toleranță: 0.01
  - Constrângeri: `w/100 × W` are exact 2 zecimale (dacă `w` e multiplu impar de 5, `W` e multiplu de 0.2); |answer| ≥ 0.05, ca semnul să fie clar; rezultate negative doar dacă inputul acceptă semnul minus.
  - Șabloane: explicația "Expectancy = {w/100} × {W} − {l/100} × 1 = {a} − {b} = {answer}R per trade." plus, după caz, "It loses more often than it wins, but the wins are large enough to make the average positive." (w < 50, answer > 0) sau "The wins are too small, for how often they come, to cover the losses." (answer < 0); indiciul 3 "Wins: {w/100} × {W} = {a}R. Now subtract the losses' share."
  - Exemplu: w 35%, W 2.4R → 0.84 − 0.65 = **+0.19R**.
- **Verificare:** 0.45 × 1.8 − 0.55 × 1 = 0.81 − 0.55 = 0.26 = `answer` 0.26 (toleranță 0.01) ✓.

#### q-rm-6 · mcq · d2 · L11
- **Concepte:** expectancy, reward-to-risk
- **Explicații per variantă:**
  - `a` ✓ "Win rate only means something together with the average win and the average loss" (corectă)
  - `b` "A method that wins 70% of the time must be profitable" → "A high win rate can hide small wins. Winning 70% at +0.4R and losing 30% at −1R averages −0.02R per trade."
  - `c` "Win rate is irrelevant; only the reward-to-risk ratio matters" → "The ratio alone ignores how often the target is reached. Expectancy needs both: how often you win, and how big the wins and losses are."
  - `d` "A higher reward-to-risk ratio always produces more profit" → "Distant targets are usually reached less often. A higher ratio lowers the break-even win rate, but profit depends on the win rate you actually achieve."
- **Verificare:** 0.70 × 0.4 − 0.30 × 1 = −0.02 ✓ (metoda C din L11). `b`, `c`, `d` conțin „must”, „irrelevant”, „always”, contrazise direct de L11; `a` e singura corectă.

#### q-rm-7 · scenario · d3 · L11
- **Concepte:** expectancy, r-multiple
- **Explicații per variantă:**
  - `a` "−0.20R: the method is losing because most trades lost" → "Counting losses misses their size. The 8 wins at +2.5R outweigh the 12 losses at −1R: +800.00 vUSD in total, so the average is positive."
  - `b` ✓ "+0.40R: encouraging, but 20 trades is a small sample to judge a method on" (corectă)
  - `c` "+2.50R: the average win is what counts" → "+2.5R is only the average win. Expectancy also weighs how often you win and subtracts the losses: 0.40 × 2.5 − 0.60 × 1."
  - `d` "+0.40R: this proves the method will keep earning 0.40R per trade" → "The arithmetic is right, but 20 trades is a small sample. A few lucky or unlucky results can move it; treat it as evidence, not proof."
- **Indicii:** 1. "Put everything in R first: divide each vUSD figure by the 100.00 you risked." 2. "Expectancy = win rate × average win − loss rate × average loss." 3. "Win rate: 8 ÷ 20 = 40%. Average win: 250.00 ÷ 100.00 = +2.5R."
- **Verificare:** 0.40 × 2.5 − 0.60 × 1 = 1.00 − 0.60 = +0.40R ✓; 8 × 250.00 − 12 × 100.00 = +800.00 = 8R în 20 de tranzacții ✓. `b` și `d` au aceeași cifră; doar `b` o tratează ca pe o dovadă dintr-un eșantion mic (L11: „The bigger the sample, the more the figure means”).

#### q-rm-8 · mcq · d1 · L16
- **Concepte:** position-sizing, volatility
- **Explicații per variantă:**
  - `a` "Double it" → "Twice the units over twice the distance makes the loss at the stop four times bigger. A wider stop needs fewer units, not more."
  - `b` "Keep it the same" → "The same units over twice the distance doubles the loss at the stop. Units = risk budget ÷ distance, so the units must fall."
  - `c` ✓ "Halve it" (corectă)
  - `d` "It doesn't matter as long as there is a stop" → "A stop caps the loss only at the size you chose. Loss at the stop = units × distance, so the size still has to fit the budget."
- **Verificare:** pierderea = unități × distanță; distanța × 2 cere unități ÷ 2 ca pierderea să rămână aceeași ✓. Singura variantă care păstrează riscul.

#### q-rm-9 · scenario · d3 · L16
- **Concepte:** risk-per-trade, position-sizing
- **Explicații per variantă:**
  - `a` "40 units" → "That uses a 100.00 budget, the 1% mission limit. The Arena allows 2%, 200.00, and high volatility doesn't change the limit."
  - `b` ✓ "80 units" (corectă)
  - `c` "200 units" → "200.00 is the risk budget in vUSD, not a number of units. Divide it by the 2.50 distance: 200 units would lose 500.00 at the stop."
  - `d` "500 units" → "That multiplies the budget by the distance, 200.00 × 2.50. Units = budget ÷ distance; 500 units would lose 1,250.00 at the stop."
- **Indicii:** 1. "Start from the Arena limit; volatility changes the stop, not the limit." 2. "Units = risk budget ÷ (entry − stop), rounded down." 3. "Budget: 10,000.00 × 2% = 200.00. Distance: 40.00 − 37.50 = 2.50."
- **Verificare:** 200.00 ÷ 2.50 = 80 ✓; 80 × 40.00 = 3,200.00 ≤ capital ✓. Varianta cu costuri din explicație, refăcută cu `maxQtyForRisk` (comision 0.05% rotunjit în sus la cent): 78 de unități riscă 195.00 + 1.56 + 1.47 = 198.03; 79 ar risca 200.57 → 78 ✓. 200 × 2.50 = 500.00 și 500 × 2.50 = 1,250.00 ✓.

#### q-rm-10 · numeric · d3 · L16
- **Concepte:** r-multiple, gap-risk
- **Indicii:** 1. "Check where the stop actually filled: a gapped stop fills at the open." 2. "Loss in R = actual loss ÷ planned risk (1R)." 3. "Actual loss = 60 × (25.00 − 23.40) = 96.00 vUSD. Now divide by 60.00."
- **Variații (vary):**
  - `seedFields`: `n` 20–100, pas 10 · `entry` 20.00–120.00, pas 0.50 · `d` (distanța la stop) ∈ {0.50, 1.00, 2.00, 2.50} · `g` (cât sare gap-ul dincolo de stop) 0.10–1.50, pas 0.10
  - Derivate: `stop = entry − d`, `open = stop − g`, `oneR = n × d`
  - Prompt: "You are long {n} units bought at {entry} with a stop at {stop}, so the planned risk is {oneR} vUSD (1R) before costs. An event makes the next candle open at {open}, and your stop fills there. How large is the loss in R, before costs? Give a positive number rounded to two decimal places."
  - `formula`: `answer = n × (entry − open) ÷ oneR = (d + g) ÷ d`
  - Toleranță: 0.01
  - Constrângeri: `g` ≤ `d` (gap plauzibil, cel mult 2R); `oneR` ≤ 200.00 (limita din Arena); `n × entry` ≤ 10,000.00; `d` = 1.50 e exclus, pentru că (d + g) ÷ d n-ar mai fi exact la 2 zecimale.
  - Șabloane: explicația "The loss is {n} × ({entry} − {open}) = {loss} vUSD, and {loss} ÷ {oneR} = {answer}R. A stop becomes a market order, so a gap through it fills at the open, beyond the planned 1R."; indiciul 3 "Actual loss = {n} × ({entry} − {open}) = {loss} vUSD. Now divide by {oneR}."
  - Exemplu: 40 de unități la 62.00, stop 60.00, 1R = 80.00, deschidere la 59.30 → pierdere 40 × 2.70 = 108.00 → 108.00 ÷ 80.00 = **1.35R**.
- **Verificare:** 60 × (25.00 − 23.40) = 96.00; 96.00 ÷ 60.00 = 1.60 = `answer` 1.6 (toleranță 0.01) ✓.

#### q-rm-11 · numeric · d2 · L08
- **Concepte:** drawdown
- **Indicii:** 1. "The gain is earned on the smaller account, not on the 10,000.00." 2. "Gain needed = amount lost ÷ account after the loss × 100." 3. "Amount lost: 10,000.00 − 7,000.00 = 3,000.00. Divide it by 7,000.00."
- **Variații (vary):**
  - `seedFields`: `dd` (drawdown, %) ∈ {5, 15, 25, 35, 40, 45, 60}; vârful fix, 10,000.00; `after = 10,000.00 × (1 − dd/100)`
  - Prompt: "An account falls from 10,000.00 to {after} vUSD. What percentage gain on {after} is needed to get back to 10,000.00? Answer in %, rounded to one decimal place."
  - `formula`: `answer = round1(100 × (10,000.00 − after) ÷ after)`: 5.3, 17.6, 33.3, 53.8, 66.7, 81.8, 150.0
  - Toleranță: 0.1
  - Constrângeri: fără 30 (originalul) și fără 10, 20, 50, ale căror rezultate sunt scrise în figura din L08 și ar testa memoria, nu calculul.
  - Șabloane: explicația "The account needs {lost} more, earned on {after}: {lost} ÷ {after} = {answer}%. A {dd}% loss needs a much larger gain than {dd}% because the recovery starts from a smaller base."; indiciul 3 "Amount lost: 10,000.00 − {after} = {lost}. Divide it by {after}."
  - Exemplu: dd 25% → 7,500.00 → 2,500.00 ÷ 7,500.00 = **33.3%**.
- **Verificare:** 3,000.00 ÷ 7,000.00 = 42.857% → 42.9 = `answer` 42.9 (toleranță 0.1) ✓.

### Întrebări noi propuse

Niciun concept din Risk Management nu are sub 2 întrebări, deci regula nu cere nimic aici. Propunerea de mai jos e opțională: `r-multiple` apare doar în două întrebări d3, iar topicul are doar 2 × d1.

#### q-rm-12 · numeric · d1 · L11 (nouă, opțională)
- **Concepte:** r-multiple
- **Prompt:** "You risked 80.00 vUSD (1R) on a trade and closed it for a profit of 140.00 vUSD. What is the result in R? Round to two decimal places."
- **Răspuns:** `numeric: { answer: 1.75, tolerance: 0.01, unit: "R" }`
- **Explicație:** "R multiple = result ÷ amount risked: 140.00 ÷ 80.00 = +1.75R. Measuring in R makes trades of different sizes comparable: the same +1.75R on a 100.00 risk would be 175.00 vUSD."
- **Indicii:** 1. "Compare the result with what you risked, not with the account." 2. "R multiple = result in vUSD ÷ 1R." 3. "80.00 × 1 = 80.00, leaving 60.00. What fraction of 80.00 is 60.00?"
- **Variații (vary):**
  - `seedFields`: `oneR` ∈ {50.00, 60.00, 75.00, 80.00, 100.00} · `m` 1.25–3.00, pas 0.25, fără valori întregi · `result = oneR × m`
  - Prompt: "You risked {oneR} vUSD (1R) on a trade and closed it for a profit of {result} vUSD. What is the result in R? Round to two decimal places."
  - `formula`: `answer = result ÷ oneR = m`
  - Toleranță: 0.01
  - Constrângeri: `m` nu e întreg (indiciul 3 are nevoie de un rest); `result` are cel mult 2 zecimale (garantat de liste).
  - Șabloane: explicația "R multiple = result ÷ amount risked: {result} ÷ {oneR} = +{m}R. Measuring in R makes trades of different sizes comparable."; indiciul 3 "{oneR} × {floor(m)} = {x}, leaving {rest}. What fraction of {oneR} is {rest}?"
  - Exemplu: 1R = 60.00, profit 165.00 → **2.75R**. Indiciul 3: "60.00 × 2 = 120.00, leaving 45.00. What fraction of 60.00 is 45.00?"
- **Verificare:** 140.00 ÷ 80.00 = 1.75 ✓; 1.75 × 100.00 = 175.00 ✓. Sursă: L11 („If you risked 100.00 vUSD and made 200.00 vUSD, the result is +2R”), conceptul `r-multiple`, glosarul `r-multiple`. 1R sub 100.00 e permis: L08 spune că procentul e un plafon, nu o țintă.

---

## Stop-Loss (`q-sl-*`)

### Întrebări existente

#### q-sl-1 · mcq · d1 · L10
- **Concepte:** invalidation-level, stop-loss-order
- **Explicații per variantă:**
  - `a` "At a round number close to the entry" → "A round number says nothing about whether the idea still holds, and close to the entry it usually sits inside normal noise."
  - `b` "At whatever distance allows the largest position" → "That reverses the order: the stop comes from the idea, then the size from the stop. A stop placed for size usually sits inside the noise."
  - `c` ✓ "Where the trade idea would be proven wrong, plus a small buffer for noise" (corectă)
  - `d` "Wherever the loss would feel bearable" → "Sizing already handles the loss in vUSD. The stop's place comes from the chart: where the reason for the trade no longer holds."
- **Verificare:** `c` e regula din L10 („just beyond that point, with a small buffer for noise”); `a`, `b`, `d` sunt exact cele trei plasări pe care L10 le respinge.

#### q-sl-2 · numeric · d2 · L10
- **Concepte:** position-sizing, stop-loss-order
- **Indicii:** 1. "The stop is fixed by the chart; the number of units is what you adjust." 2. "Units = risk budget ÷ (entry − stop), rounded down." 3. "Budget: 10,000.00 × 1% = 100.00. Distance: 32.00 − 30.80 = 1.20."
- **Variații (vary):**
  - `seedFields`: `entry` 20.00–80.00, pas 0.10 · `d` 0.60–3.00, pas 0.10 · `stop = entry − d`; bugetul fix, 100.00 (1% din 10,000.00)
  - Prompt: "Your account is 10,000.00 vUSD and you risk 1% per trade. You buy at {entry} with the stop at {stop}. How many whole units can you buy, before costs? Round down to a whole number."
  - `formula`: `answer = floor(10000 ÷ d_cenți)` (în cenți, ca să nu apară 99.999…)
  - Toleranță: 0
  - Constrângeri: 100.00 ÷ d nu e întreg (altfel rotunjirea în jos nu se mai testează: exclude 0.80, 1.00, 2.00, 2.50); `answer × entry` ≤ 10,000.00 (fără levier).
  - Șabloane: explicația "The budget is 100.00 vUSD and the distance is {entry} − {stop} = {d}, so 100.00 ÷ {d} = {raw}, rounded down to {answer} units. Rounding up to {answer + 1} would risk {over}, just over the limit."; indiciul 3 "Budget: 10,000.00 × 1% = 100.00. Distance: {entry} − {stop} = {d}."
  - Exemplu: intrare 46.50, stop 44.80 → 1.70 → 100.00 ÷ 1.70 = 58.82 → **58**; 59 × 1.70 = 100.30, peste buget; 58 × 46.50 = 2,697.00 ≤ capital ✓.
- **Verificare:** 100.00 ÷ 1.20 = 83.33 → 83 = `answer` 83 (toleranță 0) ✓; 84 × 1.20 = 100.80 ✓. (Cu costuri, `maxQtyForRisk` dă 81, risc 99.75; promptul cere „before costs”, deci 83 rămâne corect.)

#### q-sl-3 · scenario · d2 · L10
- **Concepte:** invalidation-level, loss-aversion
- **Explicații per variantă:**
  - `a` ✓ "Leave the stop at 48.00: support has not failed yet, and the stop will act if it does" (corectă)
  - `b` "Move the stop to 47.00 to give the trade more room" → "Wanting to avoid the loss is natural, but moving the stop further away raises the loss you agreed to while the idea hasn't changed. It counts against Risk Discipline."
  - `c` "Buy more units at 48.30 to lower the average entry price" → "Adding units to a trade going against you raises the risk above the planned 1R, with no new setup behind it."
  - `d` "Remove the stop and decide at the end of the session" → "Without a stop the loss has no limit, and the decision moves to when you're under most pressure. The stop already sits where the idea fails."
- **Verificare:** `a` e singura care păstrează stop-ul planificat; `b` lărgește stop-ul, `c` adaugă risc, `d` îl scoate (toate trei sunt încălcări numite în L10 și L13).
- **Probleme găsite:** Prețul la 48.30 e deja cu 0.10 sub suportul de la 48.40, deci „support has not failed yet” din `a` se poate contesta. Apărarea există (bufferul de 0.40 până la stop), dar nu e spusă. Corectură: „Price drops to 48.50 and the trade now shows a loss.” Restul rămâne identic, inclusiv `c` cu „48.30” schimbat în „48.50”.

#### q-sl-4 · mcq · d2 · L10
- **Concepte:** invalidation-level, support-and-resistance
- **Explicații per variantă:**
  - `a` ✓ "Obvious levels are often briefly tested, so a stop right on the level can be hit even if support holds" (corectă)
  - `b` "Stops cannot be placed at support levels" → "A stop can go at any price. The trouble is that one sitting right on an obvious level is easily touched while support still holds."
  - `c` "Support levels never break, so the stop is wasted" → "Support zones fail regularly; that's why the stop exists. Put it just beyond the level, so it acts when support really breaks."
- **Verificare:** `a` reia punctul „Exactly on the level” din L10; `b` e fals tehnic, `c` contrazice conceptul `support-and-resistance` („they fail regularly”).

#### q-sl-5 · mcq · d1 · L10
- **Concepte:** stop-loss-order, slippage
- **Explicații per variantă:**
  - `a` "A limit order is placed at the stop price and is guaranteed to fill there" → "A stop is not a limit order. It becomes a market order when touched, so the fill can be worse than the stop, especially after a gap."
  - `b` ✓ "It becomes a market order and fills at the next available price" (corectă)
  - `c` "Nothing, until you confirm the exit" → "The stop acts on its own; that's its job. It turns 'I was wrong' into an exit without a debate, even when you aren't watching."
- **Verificare:** `b` e mecanica din L10 și din conceptul `stop-loss-order` („becomes a market order when touched”); singura corectă.

#### q-sl-6 · numeric · d3 · L10
- **Concepte:** gap-risk, stop-loss-order
- **Indicii:** 1. "Ask where the stop actually filled, not where it was placed." 2. "Loss = units × (entry − fill price)." 3. "The fill is the open, 72.90. Per unit: 75.00 − 72.90 = 2.10."
- **Variații (vary):**
  - `seedFields`: `n` 20–80, pas 5 · `entry` 30.00–120.00, pas 0.50 · `d` 1.00–3.00, pas 0.25 · `g` 0.20–1.50, pas 0.10
  - Derivate: `stop = entry − d`, `open = stop − g`
  - Prompt: "You hold {n} units bought at {entry} with a stop at {stop}. The next candle opens at {open}, gapping through the stop, and the stop fills at the open. How much do you lose, in vUSD, before costs? Give the answer to two decimal places."
  - `formula`: `answer = n × (entry − open) = n × (d + g)`
  - Toleranță: 0.01
  - Constrângeri: `n × d` ≤ 100.00 (pierderea planificată încape în bugetul de misiune); `n × entry` ≤ 10,000.00; `g` ≤ `d`.
  - Șabloane: explicația "The fill is at the open, {open}, so the loss is {n} × ({entry} − {open}) = {n} × {d + g} = {answer} vUSD instead of the planned {n} × {d} = {planned}. A gap fills at the open, not at the stop price."; indiciul 3 "The fill is the open, {open}. Per unit: {entry} − {open} = {d + g}."
  - Exemplu: 50 de unități la 64.00, stop 62.50, deschidere 61.70 → 50 × 2.30 = **115.00** (planificat 75.00).
- **Verificare:** 40 × (75.00 − 72.90) = 40 × 2.10 = 84.00 = `answer` 84 (toleranță 0.01) ✓; planificat 40 × 1.50 = 60.00 ✓.

#### q-sl-7 · scenario · d3 · L10
- **Concepte:** invalidation-level, position-sizing
- **Explicații per variantă:**
  - `a` "Keep the stop at 49.50: more units means a bigger gain if it works" → "That stop sits above the level where the idea fails, inside normal noise, so ordinary swings can end a sound idea. The size follows the stop, not the reverse."
  - `b` "Put the stop at 48.00 and keep 200 units" → "Right stop, wrong size: 200 × 2.00 = 400.00 vUSD, 4% of the account. When the stop moves further out, the units must fall."
  - `c` "Skip the stop and watch the trade closely instead" → "Watching is not a limit. Without a stop the loss has no cap and you can't size to 1%; entering without a stop counts against Risk Discipline."
  - `d` ✓ "Put the stop beyond 48.40, at about 48.00, and buy 50 units for the same 100.00 vUSD risk" (corectă)
- **Indicii:** 1. "Decide where the idea fails before thinking about the size." 2. "The stop goes just beyond the invalidation level; then units = risk budget ÷ (entry − stop)." 3. "The idea fails below 48.40, so the stop sits near 48.00, 2.00 below the 50.00 entry."
- **Verificare:** 100.00 ÷ 2.00 = 50 ✓; 100.00 ÷ 0.50 = 200 ✓; 200 × 2.00 = 400.00 = 4% ✓. `d` e singura cu stop-ul dincolo de invalidare și risc de 1%.
- **Probleme găsite:**
  - Scenariul nu spune „before costs”, iar L08 include costurile în risc. Cu 0.05% pe ambele execuții, 50 de unități riscă 100.00 + 1.25 + 1.20 = 102.45, peste 1%; L10 dă 48 după costuri (`maxQtyForRisk`: 48 de unități, risc 98.36). Corectură: „Ignore costs.” la finalul scenariului, sau varianta `d` „…and buy 50 units (48 after costs) for the same 100.00 vUSD risk”.
  - Minor, opțional: „normal candles move about 0.40”, iar stop-ul de la 49.50 e la 0.50 de intrare, puțin peste o lumânare. „Inside normal noise” se susține pe câteva lumânări, nu pe una. Se poate scrie „normal swings over a few candles reach about 0.80”.

#### q-sl-8 · mcq · d2 · L10
- **Concepte:** stop-loss-order, trailing-stop
- **Explicații per variantă:**
  - `a` "Leaving the stop where you planned it" → "That's the plan working. A stop is a decision you made with a clear head; keeping it never counts against Risk Discipline."
  - `b` "Moving the stop up, closer to price, after the trade has moved in your favour" → "On a long, moving the stop up reduces the risk; that's trailing, which only moves in the trade's favour. The rule targets moves that add risk."
  - `c` ✓ "Moving the stop down, further from the entry, to avoid being stopped out" (corectă)
- **Verificare:** `c` e criteriul `no_stop_widening` din `packages/evaluation` (tag-ul `moved_stop_away`); `a` și `b` nu cresc riscul. Singura corectă.

#### q-sl-9 · mcq · d2 · L16
- **Concepte:** volatility, invalidation-level
- **Explicații per variantă:**
  - `a` "Keep the usual distance and accept more stop-outs" → "A stop inside one candle's normal range is hit by noise, not by the idea failing. Stop-outs on sound ideas are a cost you can avoid."
  - `b` ✓ "Widen the stop beyond the noise and reduce the size so the risk in vUSD stays the same" (corectă)
  - `c` "Keep the usual distance and increase the size to make up for the stop-outs" → "The stop stays inside the noise and every trade risks more. A bigger size doesn't fix a misplaced stop; it makes each stop-out costlier."
  - `d` "Trade without a stop until volatility calms down" → "Volatile phases are when a stop matters most: without one the loss has no limit, and gaps are more likely. Change the size, not the stop."
- **Verificare:** `b` e regula din L16 („Change the size, not the logic of the stop”); singura care păstrează riscul și scoate stop-ul din zgomot.
- **Probleme găsite:** „Widen the stop” se bate cap în cap cu „Never widen a stop once a trade is open” (L10, q-sl-8, tag-ul `moved_stop_away`), iar promptul nu spune că tranzacția nu e încă deschisă. Corectură: promptul „When planning your next trade in a volatile phase, your usual stop distance would sit inside the normal range of a single candle. What is the better adjustment?”; varianta `b` „Place the stop beyond the noise and reduce the size so the risk in vUSD stays the same”.

### Întrebări noi propuse

`trailing-stop` are o singură întrebare (q-sl-8), și acolo doar ca distractor. Propun două, una d1 și una numerică d2. Ambele se bazează pe conceptul `trailing-stop`, pe glosarul `trailing-stop` și pe callout-ul din L04; **L10 trebuie să primească un beat despre trailing** (vezi „Acoperirea conceptelor”).

#### q-sl-10 · mcq · d1 · L10 (nouă)
- **Concepte:** trailing-stop, stop-loss-order
- **Prompt:** "Which description fits a trailing stop?"
- **Variante:**
  - `a` "It only ever moves in the trade's favour, following a rule set before entry" ✓
  - `b` "It moves further from price to give a winning trade more room"
  - `c` "It is moved whenever the trade feels at risk"
  - `d` "It is removed once the trade shows a profit"
- **Explicație (varianta corectă):** "A trailing stop follows a profitable trade, for example under each new higher low, and never moves further away. Its rule belongs in the plan before entry; moving a stop away from price is widening it, not trailing it."
- **Explicații per variantă:**
  - `b` → "Moving a stop away from price is widening it, even on a winning trade. It raises the loss you agreed to; a trailing stop only ever reduces it."
  - `c` → "A trailing stop follows a rule written before entry, such as new higher lows. Moving it by feel tends to trail too tightly and turn pullbacks into exits."
  - `d` → "A profitable trade can still turn and give back the gain. A trailing stop moves up to protect part of it; it is never removed."
- **Verificare:** `a` reia conceptul („It only ever moves in the trade's favour”; „The trailing rule belongs in the plan before entry”). `b` e definiția lărgirii, `c` contrazice „rule”, `d` contrazice rostul stop-ului. Singura corectă.

#### q-sl-11 · numeric · d2 · L10 (nouă)
- **Concepte:** trailing-stop, r-multiple
- **Prompt:** "You bought 50 LABX at 60.00 with the stop at 58.00, risking 100.00 vUSD (1R). Price climbs to 64.10 and forms a higher low at 62.70, so you trail the stop to 62.50. If this stop fills, what is the result in R, before costs? Round to two decimal places."
- **Răspuns:** `numeric: { answer: 1.25, tolerance: 0.01, unit: "R" }`
- **Explicație:** "If the trailed stop fills at 62.50, the trade closes at 50 × (62.50 − 60.00) = +125.00 vUSD, and 125.00 ÷ 100.00 = +1.25R. Trailing turned the worst planned outcome from −1R into a gain, unless a gap jumps the stop."
- **Indicii:** 1. "R is always measured against the original risk, 100.00 vUSD." 2. "Result in R = (exit − entry) × units ÷ 1R." 3. "Per unit: 62.50 − 60.00 = 2.50. Times 50 units = 125.00 vUSD."
- **Variații (vary):**
  - `seedFields`: `n` ∈ {20, 25, 40, 50} · `entry` 40.00–120.00, pas 1.00 · `d` (stopul inițial) ∈ {1.00, 2.00, 2.50} · `t` (noul stop peste intrare) 0.50–4.00, pas 0.25 · `rise` (vârful peste minimul mai înalt) 0.80–2.00, pas 0.10
  - Derivate: `stop = entry − d`, `oneR = n × d`, `newStop = entry + t`, `hl = newStop + 0.20`, `peak = hl + rise`
  - Prompt: "You bought {n} LABX at {entry} with the stop at {stop}, risking {oneR} vUSD (1R). Price climbs to {peak} and forms a higher low at {hl}, so you trail the stop to {newStop}. If this stop fills, what is the result in R, before costs? Round to two decimal places."
  - `formula`: `answer = n × t ÷ oneR = t ÷ d`
  - Toleranță: 0.01
  - Constrângeri: `oneR` ≤ 100.00 (bugetul de misiune); `n × entry` ≤ 10,000.00; `100 × t ÷ d` întreg (răspuns exact la 2 zecimale); `t` > 0 (noul stop peste intrare).
  - Șabloane: explicația "If the trailed stop fills at {newStop}, the trade closes at {n} × ({newStop} − {entry}) = +{gain} vUSD, and {gain} ÷ {oneR} = +{answer}R. Trailing turned the worst planned outcome from −1R into a gain, unless a gap jumps the stop."; indiciul 3 "Per unit: {newStop} − {entry} = {t}. Times {n} units = {gain} vUSD."
  - Exemplu: 40 de unități la 85.00, stop 82.50 (1R = 100.00), vârf 88.80, minim mai înalt 87.20, stop mutat la 87.00 → 40 × 2.00 = 80.00 → **+0.80R**.
- **Verificare:** 50 × 2.00 = 100.00 = 1R ✓ (1% din 10,000.00); 50 × 60.00 = 3,000.00 ≤ capital ✓; 62.70 − 0.20 = 62.50 ✓; 50 × 2.50 = 125.00; 125.00 ÷ 100.00 = 1.25 ✓. Sursă: conceptul `trailing-stop` (exemplul cu 100.00 / 98.00 / 102.50 / 102.30 și „unless a gap jumps the stop”).

---

## Decision-Making (`q-dm-*`)

### Întrebări existente

#### q-dm-1 · mcq · d1 · L14
- **Concepte:** trading-plan
- **Explicații per variantă:**
  - `a` "The trend looks strong" → "It sounds objective, but two people could disagree on it. A checkable condition is plainly true or false on the chart, like a close above a swing high."
  - `b` "I have a good feeling about this one" → "A feeling can't be checked on the chart and shifts with your mood. Playbook conditions must be true or false for anyone looking."
  - `c` ✓ "The last candle closed above the previous swing high" (corectă)
  - `d` "Everyone seems to be buying" → "You can't see or confirm this on the chart. A move that others seem to be chasing is closer to FOMO than to a setup."
- **Verificare:** `c` e singura condiție binară, verificabilă pe grafic (L14: „simply true or false”).

#### q-dm-2 · scenario · d2 · L14
- **Concepte:** trading-plan
- **Explicații per variantă:**
  - `a` "Enter: two out of three conditions is enough" → "A playbook works as a checklist: every condition must be true. One 'no' means no trade, and that counts as following the plan."
  - `b` ✓ "No trade: condition 3 is not met" (corectă)
  - `c` "Enter, but move the stop closer so the ratio reaches 2:1" → "That bends the stop to fit the target. The stop belongs beyond the pullback low; pulled closer, it sits inside the noise and the trade changes."
  - `d` "Enter with half the usual size to make up for the missing condition" → "A smaller size limits the loss, but it doesn't make the setup complete. An incomplete setup is no trade at any size."
- **Verificare:** 1.5R < 2R, deci condiția 3 pică ✓ (aceeași logică ca exemplul din L14, unde 1.5:1 duce la „no trade”). `b` e singura corectă; criteriul din evaluare: `broke_playbook`.

#### q-dm-3 · mcq · d1 · L14
- **Concepte:** trading-plan
- **Explicații per variantă:**
  - `a` "Because a written plan guarantees profits" → "No plan can guarantee profits in an uncertain market. A plan makes your decisions consistent and reviewable, which is the part you control."
  - `b` "So you can skip the stop-loss" → "A plan includes the stop rule; it doesn't replace it. Writing where the idea fails is one of the plan's core parts."
  - `c` "So you never need to look at the chart" → "You still check each condition against the chart. The plan decides what you look for, before money is at risk."
  - `d` ✓ "So the hard decisions are made while calm, before money is at risk" (corectă)
- **Verificare:** `d` e definiția din L14 („decide while calm and follow while under pressure”); celelalte contrazic L14 direct.

#### q-dm-4 · mcq · d2 · L17
- **Concepte:** decision-quality
- **Explicații per variantă:**
  - `a` ✓ "As a poor decision with a good outcome: rules were broken, and the profit rewards a risky habit" (corectă)
  - `b` "As a good trade: the profit shows the decision was right" → "Judging by outcome alone rewards luck. With no stop and double size, the loss had no limit. Grade the decision apart from the result."
  - `c` "As proof that a larger size works better" → "One profit can't show that. Double size doubled the risk too; on a losing path, the same habit would have cost twice as much, with nothing to cap it."
  - `d` "It doesn't need reviewing because it made money" → "Profitable rule breaks need review most, because the profit makes the habit feel right. Review the decision, not the result."
- **Verificare:** `a` e cadranul „Bad decision, good outcome” din L17; singura corectă.

#### q-dm-5 · scenario · d2 · L17
- **Concepte:** decision-quality
- **Explicații per variantă:**
  - `a` "A bad decision: it lost money" → "That judges the outcome, not the decision. The plan was followed with the information available; a loss near −1R is a normal cost of trading."
  - `b` "A bad decision: you should have predicted the news" → "Unscheduled news couldn't be known when you decided. Judging the decision with what you learned afterwards is hindsight bias."
  - `c` ✓ "A good decision with a bad outcome: keep the rule and record the result" (corectă)
  - `d` "A good decision, but place stops further away in future so they are not hit" → "Wider stops don't prevent losses; they make each one bigger. The stop sat where the idea failed, so the rule stays."
- **Verificare:** `c` e cadranul „Good decision, bad outcome” din L17 („don't change the plan because of one result”); `d` schimbă regula din cauza unui rezultat. Singura corectă.

#### q-dm-6 · mcq · d2 · L17
- **Concepte:** decision-quality, journaling
- **Explicații per variantă:**
  - `a` "Because later candles are not saved" → "Replay keeps every candle. You hide the later ones on purpose, so the decision is judged only on what you could see then."
  - `b` ✓ "To avoid hindsight bias: judging a decision with information you did not have" (corectă)
  - `c` "So the trade looks better than it was" → "The aim is an honest review, not a flattering one. Hindsight can make a decision look better or worse than it really was."
- **Verificare:** `b` reia L17 („replay only the candles you could see at the time”); singura corectă.

#### q-dm-7 · mcq · d2 · L17
- **Concepte:** decision-quality
- **Explicații per variantă:**
  - `a` "A trade whose stop was widened mid-trade, with perfect Risk Discipline" → "Widening a stop always counts against Risk Discipline, whatever happens next. It raises the loss you agreed to before entry."
  - `b` "A losing trade that automatically scores zero for Decision Quality" → "Decision Quality rates the reasoning with the information at the time, not the result. A sound, planned trade can lose and still score well."
  - `c` ✓ "A profitable trade with poor Risk Discipline" (corectă)
- **Verificare:** `c` e exemplul „A profitable mistake” din L17; `a` e exclus de `no_stop_widening` (scor 0), `b` de definiția Decision Quality. Singura posibilă.

#### q-dm-8 · scenario · d3 · L14
- **Concepte:** trading-plan, fomo
- **Explicații per variantă:**
  - `a` "Trade it with 1% risk: the risk rule is what matters" → "Risk rules limit the loss, but they don't create a setup. A trade outside the playbook breaks the plan even at the right size."
  - `b` "Trade it with 0.5% risk, since it isn't in the plan" → "A smaller size makes an unplanned trade cheaper, not sound. With no tested conditions, there's nothing to check it against."
  - `c` "Add breakouts to the plan in your head and enter now" → "Changing the plan mid-session because a move looks strong is improvising. New setups are written and practised away from the screen, after review."
  - `d` ✓ "No trade; if breakouts interest you, write a breakout playbook and practise it before trading them" (corectă)
- **Indicii:** 1. "Ask first whether this setup is in your playbook at all." 2. "A move outside the playbook is not a setup. Plans change between sessions, after review, not mid-session." 3. "Your playbook lists pullbacks in an uptrend. A breakout above a range is not on that list."
- **Verificare:** `d` urmează L14 („A move that is not in the plan is not a trade”, din L13) și conceptul `trading-plan` („Changes are made between trades, after review”). Singura corectă.

#### q-dm-9 · scenario · d3 · L17
- **Concepte:** counterfactual-thinking, decision-quality
- **Explicații per variantă:**
  - `a` ✓ "One trade's hypothetical paths say little; judge whether the original decision fitted the plan and the information at the time" (corectă)
  - `b` "Trade without a stop next time, since holding would have worked" → "That generalises from one path. Without a stop, the paths where price kept falling have no limit on the loss, and this result can't show them."
  - `c` "The trade should never have been taken, because it lost" → "That judges the trade by its outcome. If it fitted the plan, a −1R loss is the planned cost of being wrong, not proof of a bad decision."
- **Indicii:** 1. "Separate the decision from the one path this trade happened to take." 2. "Judge a decision by the plan and what was visible at the time; judge outcomes only across many trades." 3. "Holding without a stop ended at +0.5R here, but on a path that kept falling, its loss had no limit."
- **Verificare:** `a` urmează pasul din L17 („without treating any single path as proof”) și conceptul `counterfactual-thinking`. Singura corectă.

### Întrebări noi propuse

Toate conceptele din Decision-Making au cel puțin 2 întrebări, deci regula nu cere nimic aici. Propunerea de mai jos e opțională: `journaling` are o singură întrebare în topic (a doua e q-psy-9), iar topicul are doar 2 × d1.

#### q-dm-10 · mcq · d1 · L17 (nouă, opțională)
- **Concepte:** journaling, decision-quality
- **Prompt:** "Which journal entry gives you the most to learn from later?"
- **Variante:**
  - `a` "'Lost 100.00. Bad day.'"
  - `b` "'Pullback setup, all three conditions met. Stop 0.20 below the pullback low, risk 1%. Stopped out, −1R. Followed plan: yes. Felt calm.'" ✓
  - `c` "'Won 150.00. Great trade.'"
  - `d` "No entry for losing trades, so the journal stays motivating"
- **Explicație (varianta corectă):** "A useful entry records the plan, the reasons, the execution, how you felt and the result, and grades the decision apart from the outcome. Across many trades, that shows patterns memory would miss, such as where losses beyond 1R come from."
- **Explicații per variantă:**
  - `a` → "This records a result and a mood, but not the setup, the stop or whether you followed the plan. There's nothing to review except the outcome."
  - `c` → "A result alone can't tell a sound decision from a lucky one. Record the setup, the risk and whether you followed the plan."
  - `d` → "Memory already favours the flattering. Skipping losses hides the patterns you most need to see, such as widened stops or skipped conditions."
- **Verificare:** `b` conține toate elementele din conceptul `journaling` și din glosarul `journal` (plan, motive, execuție, emoții, rezultat, „Followed plan”); singura care permite separarea deciziei de rezultat.

---

## Trading Psychology (`q-psy-*`)

### Întrebări existente

#### q-psy-1 · mcq · d1 · L13
- **Concepte:** fomo
- **Explicații per variantă:**
  - `a` "Waiting until every condition in your plan is met" → "That's following the plan, the opposite of FOMO. With FOMO, the move itself decides, before any setup is present."
  - `b` ✓ "Entering because price is already moving fast and you fear being left out, rather than because your setup is present" (corectă)
  - `c` "Placing a stop-loss before entering" → "That's a disciplined habit. FOMO entries tend to have the stop far away or missing, because the move made the decision."
  - `d` "Reducing size in a volatile market" → "That's sizing from the stop in a volatile phase, a planned choice. FOMO is the urge to enter because price is already running."
- **Verificare:** `b` e definiția din L13 și din glosarul `fomo`; celelalte descriu comportamente disciplinate.

#### q-psy-2 · scenario · d2 · L13
- **Concepte:** fomo
- **Explicații per variantă:**
  - `a` "Buy now with a large size so the move pays off" → "The urge to catch the move is normal, but here the move is deciding. With no sensible stop nearby, a large size could break the risk limit."
  - `b` "Buy now and decide where the stop goes later" → "The stop is the decision that belongs before entry. Entering without one leaves the loss open; decide where you're wrong first."
  - `c` "Sell short, because a move that strong must come back down" → "That's the same impulse in the other direction: a forecast drawn from the move, not a setup from your plan."
  - `d` ✓ "Don't chase: write down what setup would make a trade valid, and wait for it" (corectă)
- **Verificare:** `d` e testul din conceptul `fomo` („would you take this trade if you had not just watched the move?”) și sfatul tag-ului `chased_entry`. Singura corectă.

#### q-psy-3 · mcq · d2 · L13
- **Concepte:** loss-aversion
- **Explicații per variantă:**
  - `a` "Closing a trade at the planned stop" → "That's the opposite: taking the planned loss is part of the plan working. Loss aversion shows up as avoiding that exit."
  - `b` "Risking the same percentage on every trade" → "Fixed risk is a rule decided in advance, not a bias. Loss aversion shows up when a loss is about to become real."
  - `c` ✓ "Widening the stop on a losing trade to avoid taking the loss" (corectă)
- **Verificare:** `c` e primul exemplu din L13 („widening the stop to avoid taking a loss”); singura corectă.

#### q-psy-4 · scenario · d2 · L13
- **Concepte:** revenge-trading
- **Explicații per variantă:**
  - `a` "It's confidence: after a loss a win is due, so a bigger size makes sense" → "Past results don't make a win due; each trade stands on its own. Sizing up after a loss is how one planned loss becomes several."
  - `b` ✓ "It's revenge trading: pause and skip it, because the setup is incomplete and the size breaks your rule" (corectă)
  - `c` "Enter at normal size: two out of three conditions is close enough" → "Normal size fixes the risk, not the setup. Every condition must be met; with one missing, the plan says no trade."
  - `d` "Enter at triple size with a stop three times tighter, so the risk in vUSD stays the same" → "The risk in vUSD matches, but a stop squeezed to fit the size sits inside the noise. And the setup is still incomplete."
- **Verificare:** `b` e singura care numește tiparul (L13, `revenge_size_up`) și respectă playbook-ul; `c` rezolvă mărimea, dar nu setup-ul.

#### q-psy-5 · mcq · d2 · L13
- **Concepte:** trading-plan, revenge-trading
- **Explicații per variantă:**
  - `a` "Trading more often to get used to losing" → "More trades mean more costs and more decisions under pressure; that's overtrading. Rules made in advance reduce what you decide in the moment."
  - `b` "Watching prices more closely during the session" → "Closer watching tends to feed urges rather than calm them. The countermeasures that work are decided before the session starts."
  - `c` ✓ "Rules written before the session, a fixed risk per trade and a pause after losses" (corectă)
  - `d` "Acting on the strongest feeling about the next move" → "A strong urge to act now isn't evidence the trade is good. Treat it as the signal to slow down and run the checklist."
- **Verificare:** `c` reia lista „Process beats willpower” din L13; singura corectă.

#### q-psy-6 · mcq · d1 · L18
- **Concepte:** drawdown, expectancy
- **Explicații per variantă:**
  - `a` ✓ "Not much: streaks happen even with a positive expectancy, so check whether the decisions followed the plan" (corectă)
  - `b` "The method has stopped working and should be replaced at once" → "A streak alone can't separate bad luck from a broken method. Switching after every bad run means no method gets enough trades to be judged."
  - `c` "A win is now due, so the next trade should be larger" → "Each trade's result is independent; losses don't make a win due. Sizing up after losses raises risk exactly when judgement is under strain."
- **Verificare:** afirmația din explicație e corectă: pentru 40% câștiguri, probabilitatea a cel puțin unei serii de 5+ pierderi în 100 de tranzacții e 97.6% (refăcut prin programare dinamică; L18 spune „about 98%”) ✓. `a` e singura corectă.

#### q-psy-7 · scenario · d3 · L18
- **Concepte:** revenge-trading, trading-plan
- **Explicații per variantă:**
  - `a` "Take it: the setup is valid, so the session rule doesn't apply" → "The pause rule has no exception for good setups; right after a streak, every setup can look good. Valid setups will come again."
  - `b` "Take it at 2% to recover the losses faster" → "Raising risk to recover is sizing up after a loss, which counts against Risk Discipline. It also breaks the pause rule."
  - `c` ✓ "Follow the session rule: stop for now, journal the three trades and look again next session" (corectă)
  - `d` "Take it, but without a stop so it can't become a fourth loss" → "No stop doesn't prevent a loss; it removes the limit on it. And the session rule says stop for now, whatever the setup."
- **Indicii:** 1. "Your written plan already covers this moment. Find the rule that applies." 2. "Rules written in advance apply whatever the next setup looks like; that is why they're written before the streak." 3. "You've just had your third loss in a row, so the session rule is now in force."
- **Verificare:** regula de pauză e declanșată (3 pierderi la rând); `c` e singura care o respectă (L18, „Rules for a streak, written in advance”).

#### q-psy-8 · mcq · d2 · L18
- **Concepte:** base-rates, trading-plan
- **Explicații per variantă:**
  - `a` "Loss aversion" → "Loss aversion is about avoiding a loss, such as widening a stop. Here the trigger is a winning run that makes skill feel bigger than it is."
  - `b` "Sunk cost" → "Sunk cost is holding on because of what's already lost. Nothing is lost here; four wins are being given more weight than four trades can carry."
  - `c` "FOMO" → "FOMO is entering because a move is running without you. Here the checklist is skipped because recent wins feel like proof of skill."
  - `d` ✓ "Overconfidence fed by recent results" (corectă)
- **Verificare:** `d` e singura variantă despre câștiguri recente; celelalte trei sunt despre pierderi sau despre o mișcare ratată.
- **Probleme găsite:** „Overconfidence” nu apare în nicio lecție, concept sau glosar. L17 și L18 predau „recency bias” (L18: „giving the last few results more weight than the whole record”). Corectură: varianta `d` „Recency bias: four recent wins given more weight than they can carry”, cu explicația existentă neschimbată (deja vorbește de recency); sau L18 introduce „overconfidence” într-un beat și în glosar.

#### q-psy-9 · scenario · d3 · L18
- **Concepte:** journaling, expectancy
- **Explicații per variantă:**
  - `a` ✓ "Most likely normal variance: keep following the plan and judge it over many more trades" (corectă)
  - `b` "The plan is broken: switch to a new method straight away" → "Eight trades are far too few to judge expectancy. Switching after every bad run means no method ever gets enough trades to be judged."
  - `c` "The stops are the problem: trade without them for a while" → "The stops capped each loss at about 1R, which is why the run is still small. Without them, one bad trade could cost far more."
  - `d` "Double the risk to win the losses back, then review" → "Doubling risk to recover is sizing up after losses, and it doubles the next loss too. During a streak, risk may go down, never up."
- **Indicii:** 1. "Look at the decisions in the journal before looking at the results." 2. "Sound decisions with a short losing run usually mean variance; broken rules mean the process needs a fix." 3. "All 8 trades met every condition, risked 1% and kept their stops: the process was followed."
- **Verificare:** `a` e concluzia din L18 („If the journal shows complete setups, stops placed at entry and risk within the limit, the streak is most likely variance”). Singura corectă.

#### q-psy-10 · mcq · d1 · L13
- **Concepte:** loss-aversion
- **Explicații per variantă:**
  - `a` "FOMO" → "FOMO is about entering a move you fear missing. This trader is already in and can't let go of money already lost."
  - `b` ✓ "Sunk cost" (corectă)
  - `c` "Overconfidence" → "Overconfidence comes from recent wins making skill feel bigger. This is about refusing to accept a loss that has already happened."
- **Verificare:** citatul e aproape identic cu cel din L13 („'I've lost too much already to sell now.'”); `b` e singura corectă.
- **Probleme găsite:** distractorul `c` folosește un termen nepredat (vezi q-psy-8). Dacă L18 nu introduce „overconfidence”, `c` devine „Confirmation bias” (după ce L13 îl predă), cu explicația: "Confirmation bias is favouring evidence for your view. This is about refusing to accept a loss that has already happened."

### Întrebări noi propuse

`confirmation-bias` nu are nicio întrebare. Propun două: o d1 de recunoaștere și o d2 de aplicare. Sursa e conceptul `confirmation-bias` și glosarul `confirmation-bias`; **L13 trebuie să-l predea** (widget-ul bias-spotter din §9.2 îl conține deja).

#### q-psy-11 · mcq · d1 · L13 (nouă)
- **Concepte:** confirmation-bias
- **Prompt:** "You are long LABX and keen on the idea. Which habit is a sign of confirmation bias?"
- **Variante:**
  - `a` "Writing down, before entry, the price that would prove the idea wrong"
  - `b` "Counting every rising candle as proof, while treating lower highs as noise" ✓
  - `c` "Checking each condition against a written list before entering"
  - `d` "Closing the trade when the stop is hit"
- **Explicație (varianta corectă):** "Confirmation bias makes you notice what supports your view and discount what argues against it, and it is strongest once you hold a position. Lower highs are evidence too; a written invalidation level turns them into a rule."
- **Explicații per variantă:**
  - `a` → "That's the countermeasure. Writing down in advance what proves you wrong makes evidence against the idea hard to ignore later."
  - `c` → "Checking each condition against a written list tests the setup against the chart, not against your hopes. It works against the bias."
  - `d` → "Taking the planned loss is the plan working. Confirmation bias would rather explain the drop away as noise and look for reasons to stay."
- **Verificare:** `b` reia corpul conceptului („every rising candle looks like proof and every warning sign looks like noise”); `a` și `c` sunt contramăsurile numite în concept, `d` e regula de stop. Singura corectă.

#### q-psy-12 · scenario · d2 · L13 (nouă)
- **Concepte:** confirmation-bias, trading-plan
- **Scenariu:** "You are bullish on LABX and want to buy. Your notes list three reasons: the 20-period moving average is rising, the last two candles closed strongly higher, and the move feels like the start of a trend. You haven't checked the swing highs: over the last 10 candles, LABX has printed three lower highs."
- **Prompt:** "What is the best next step?"
- **Variante:**
  - `a` "Enter: three reasons in favour outweigh one against"
  - `b` "Look for a fourth reason in favour before entering"
  - `c` "Write down the price that would prove the idea wrong, check each playbook condition against the chart, then decide" ✓
  - `d` "Enter with half the usual size because of the lower highs"
- **Explicație (varianta corectă):** "Listing only reasons in favour is confirmation bias at work: the three lower highs are evidence too, and they speak against an uptrend. Writing the invalidation first and checking each condition tests the idea against the chart rather than against your hopes."
- **Explicații per variantă:**
  - `a` → "Counting reasons isn't a test. Lower highs argue against an uptrend, and one failed playbook condition means no trade, however many reasons agree."
  - `b` → "Searching for more support is the bias itself. The useful search is for evidence against the idea, such as the lower highs you skipped."
  - `d` → "A smaller size limits the loss but doesn't answer the evidence. If the structure fails a playbook condition, there is no trade at any size."
- **Verificare:** scenariul urmează exemplul din conceptul `confirmation-bias` (media mobilă în creștere, trei maxime mai joase în 10 ore); „uptrend = higher highs and higher lows” vine din conceptul `trend`. `c` aplică ambele contramăsuri din concept; `a`, `b`, `d` lasă dovada contrară necercetată. Singura corectă.

---

## Scenario Analysis (`q-sa-*`)

### Întrebări existente

#### q-sa-1 · mcq · d1 · L15
- **Concepte:** scenario-planning
- **Explicații per variantă:**
  - `a` "To predict exactly where price will go" → "Nobody knows the next move, and scenario analysis accepts that. Its aim is preparation for several paths, not one correct forecast."
  - `b` ✓ "To have a planned action for each plausible path, so no outcome forces an unplanned decision" (corectă)
  - `c` "To find reasons to increase the position size" → "Scenarios are about actions, not size. If anything, the worst case can show that the size is too big for your limit."
- **Verificare:** `b` e definiția din L15 („never to be pushed into an unplanned decision”); singura corectă.

#### q-sa-2 · scenario · d2 · L15
- **Concepte:** scenario-planning, false-breakout
- **Explicații per variantă:**
  - `a` "Bullish breakout: buy on the first close above 60.50 so you don't miss it" → "That drops the two-close rule, which exists to filter out this exact case. Not wanting to miss the move is normal; the rule still decides."
  - `b` "None: the stop covers every case" → "A stop only matters once you're in a trade. The gap here is a path with no planned action, which invites an impulsive entry."
  - `c` ✓ "False breakout: a single close above 60.50 followed by a move back into the range means no entry" (corectă)
- **Verificare:** cifrele sunt identice cu exemplul din L15 (60.10 / 60.50 / 59.00 / 59.90), iar `c` e cazul „False breakout” de acolo. Singura corectă.

#### q-sa-3 · mcq · d2 · L15
- **Concepte:** scenario-planning
- **Explicații per variantă:**
  - `a` ✓ "A candle closes below the range floor at 59.00" (corectă)
  - `b` "Price feels weak" → "A feeling can't be seen on the chart, so you can't tell when the case has started. A trigger is an observable event, like a close beyond a level."
  - `c` "The market will probably fall soon" → "That's a forecast, not a trigger. A trigger tells you a case has begun; it doesn't guess what comes next."
  - `d` "Other traders seem nervous" → "You can't check this on the chart, and it shifts with your mood. A trigger is something you can point to, such as a candle closing below 59.00."
- **Verificare:** `a` e singurul eveniment observabil (L15: „an observable event such as a candle closing beyond a level”).

#### q-sa-4 · mcq · d2 · L15
- **Concepte:** scenario-planning, risk-per-trade
- **Explicații per variantă:**
  - `a` "Enter anyway, because the case is unlikely" → "Likelihood is a judgement and can be wrong; the risk limit is a rule. The plan must be acceptable in every case, unlikely ones included."
  - `b` "Remove the stop, since the bearish case probably won't happen" → "Removing the stop makes the bearish case worse, not less likely. The loss in that case would then have no limit at all."
  - `c` ✓ "Reduce the size, or skip the trade, so the loss in that case stays within your limit" (corectă)
- **Verificare:** `c` e regula din L15 („If the bearish case would cost more than your risk limit, the trade is too big, however unlikely that case looks”). Singura corectă.

#### q-sa-5 · scenario · d3 · L15
- **Concepte:** gap-risk, scenario-planning
- **Explicații per variantă:**
  - `a` "No new case: the stop guarantees a loss of exactly 1R" → "A stop doesn't guarantee a price. It becomes a market order, so a gap through it fills at the open, possibly far beyond 1R."
  - `b` "Only the bullish case: events tend to push price up" → "That's a forecast, and the plan must be acceptable in every case. The bearish gap is exactly the case that can exceed your limit."
  - `c` "Widen the stop to 3.00 below entry and keep the same size" → "The same size with a stop three times further away triples the planned risk, and widening counts against Risk Discipline. A gap can still jump it."
  - `d` ✓ "A gap through the stop: the loss could be well over 1R, so reduce the size or close before the event" (corectă)
- **Indicii:** 1. "Think about what a stop does when price opens beyond it." 2. "A stop becomes a market order, so a gap through it fills at the open." 3. "If price opens 2.00 below a close near your entry, the stop fills there: about 2R, not 1R."
- **Verificare:** `d` reia L15 („Scheduled events deserve their own case, because price can gap past a stop”) și L16. Lărgirea stop-ului la 3.00 cu aceeași mărime: risc × 3 ✓. Singura corectă.

#### q-sa-6 · mcq · d2 · L15
- **Concepte:** scenario-planning, decision-quality
- **Explicații per variantă:**
  - `a` ✓ "By whether it covered what happened and whether you followed it" (corectă)
  - `b` "By the profit or loss alone" → "One result owes a lot to chance. A stop-out in a planned case can be a plan well executed, and a win in an unplanned case was luck."
  - `c` "By how many cases it listed" → "A long list doesn't help if it misses the likely paths or isn't followed. Coverage and execution are what count."
- **Verificare:** `a` e obiectivul 3 din L15, cuvânt cu cuvânt („Judge a scenario plan by its coverage and execution, not by its profit”).

#### q-sa-7 · scenario · d3 · L15
- **Concepte:** scenario-planning
- **Explicații per variantă:**
  - `a` "Hold until the stop or the target is hit, however long it takes" → "The plan already has a time limit for this case. Holding on ignores it and swaps a calm decision for one made in the moment."
  - `b` ✓ "Close the trade, as the sideways case says" (corectă)
  - `c` "Add to the position, since it hasn't lost" → "Not losing isn't the idea working; a breakout was supposed to move. Adding units raises risk on a trade whose trigger says close."
  - `d` "Move the target closer so it is hit sooner" → "That changes the plan mid-trade to get a result. The sideways case already says what to do: close the trade."
- **Indicii:** 1. "Check which of your planned cases matches what price is doing now." 2. "When a case's trigger is met, carry out the action you wrote for it." 3. "Twelve candles within 0.20 of entry is more than the 10 candles in your sideways trigger."
- **Verificare:** 12 > 10 lumânări, deci declanșatorul cazului lateral e atins ✓; `b` e acțiunea scrisă. Singura corectă.

#### q-sa-8 · mcq · d1 · L15
- **Concepte:** scenario-planning
- **Explicații per variantă:**
  - `a` "Buy, sell and hold" → "Those are your possible actions, which you attach to each case. The frame describes what the market might do."
  - `b` "Win, lose and break even" → "Those are a trade's outcomes. The frame describes price paths: the idea works, it fails, or nothing much happens."
  - `c` ✓ "Bullish, bearish and sideways" (corectă)
- **Verificare:** `c` e cadrul din L15 („A simple frame uses three cases”). Singura corectă.

#### q-sa-9 · scenario · d2 · L15
- **Concepte:** expectancy, base-rates
- **Explicații per variantă:**
  - `a` "−0.45R, because the bearish case is the most likely" → "That counts only the bearish case. Expectancy weighs every case: the 40% bullish case at +2R more than offsets the 45% bearish one at −1R."
  - `b` "+0.80R, because the bullish case pays 2R" → "That's only the bullish share, 0.40 × 2. Subtract the bearish share, 0.45 × 1, to get the average across all three cases."
  - `c` "+0.35R, and it is guaranteed over time" → "The arithmetic is right, but the probabilities are your estimates. If they're off, so is the result: a hypothesis to test, not a promise."
  - `d` ✓ "+0.35R, but it is only as reliable as your probability estimates" (corectă)
- **Indicii** (opționale, întrebarea are calcul): 1. "Weigh each case by its estimated chance, then add the cases up." 2. "Expectancy = the sum of (probability × result in R) over all cases." 3. "Bullish: 0.40 × 2 = +0.80R. Now add the bearish and sideways cases."
- **Verificare:** 0.40 × 2 − 0.45 × 1 + 0.15 × 0 = 0.80 − 0.45 = +0.35R ✓; probabilitățile însumează 100% ✓. `c` și `d` au aceeași cifră; doar `d` o tratează ca estimare (L15: „treat those estimates as judgement, not fact”).

### Întrebări noi propuse

`counterfactual-thinking` are o singură întrebare (q-dm-9, în alt topic). Propun q-sa-10 pentru el și q-sa-11 pentru `base-rates`, care are două etichete, dar niciuna care să-l calculeze; q-sa-11 e și prima întrebare numerică din topic. Sursele: conceptele `counterfactual-thinking` și `base-rates`, L17 (alternative decisions) și L15. **L15 trebuie să numească base rates** într-un beat.

#### q-sa-10 · mcq · d1 · L17 (nouă)
- **Concepte:** counterfactual-thinking, decision-quality
- **Prompt:** "You were stopped out for −1R at the level where your idea failed. LABX then rallied well past your target. Which question makes the most useful counterfactual review?"
- **Variante:**
  - `a` "How much would I have made if I had held without a stop?"
  - `b` "Had price kept falling instead, what would the stop have done, and did it sit where the idea failed?" ✓
  - `c` "Why didn't I see the rally coming?"
- **Explicație (varianta corectă):** "Counterfactual thinking checks a decision against the other paths that were possible when you made it. On a path where price kept falling, the stop capped the loss; a stop at the invalidation level was sound on both paths."
- **Explicații per variantă:**
  - `a` → "That looks only at the path you now know. 'If only I had held' is hindsight; on a falling path, no stop would have meant an unlimited loss."
  - `c` → "The rally wasn't visible when you decided. Judging the decision with information you didn't have is hindsight bias, not analysis."
- **Verificare:** `b` urmează exemplul din conceptul `counterfactual-thinking` (stop-out urmat de raliu; „the decision was sound on both paths”); `a` e exact „if only I had held”, numit acolo hindsight. Lecția e L17 pentru că acolo e pasul „alternative decisions”. Singura corectă.

#### q-sa-11 · numeric · d2 · L15 (nouă)
- **Concepte:** base-rates, expectancy
- **Prompt:** "Your journal holds 50 breakout trades taken under the same rules: 17 reached the +2.5R target and 33 were stopped out at −1R. Starting from this base rate, what is the estimated expectancy per trade, in R, before costs? Round to two decimal places."
- **Răspuns:** `numeric: { answer: 0.19, tolerance: 0.01, unit: "R" }`
- **Explicație:** "The base rate is 17 ÷ 50 = 34%, so expectancy = 0.34 × 2.5 − 0.66 × 1 = 0.85 − 0.66 = +0.19R per trade. A new breakout that looks perfect still starts from this estimate until there is evidence it is different."
- **Indicii:** 1. "Start from how often this setup has worked, not from how good the next one looks." 2. "Base rate = wins ÷ trades. Expectancy = base rate × average win − (1 − base rate) × average loss." 3. "Base rate: 17 ÷ 50 = 0.34. Wins contribute 0.34 × 2.5 = 0.85R."
- **Variații (vary):**
  - `seedFields`: `N` ∈ {25, 50} · `k` (câștiguri) cu `k/N` între 0.25 și 0.60 · `W` (ținta) ∈ {1.5, 2.0, 2.5, 3.0}; pierderea fixă, −1R
  - Prompt: "Your journal holds {N} breakout trades taken under the same rules: {k} reached the +{W}R target and {N − k} were stopped out at −1R. Starting from this base rate, what is the estimated expectancy per trade, in R, before costs? Round to two decimal places."
  - `formula`: `p = k ÷ N`; `answer = p × W − (1 − p) × 1`
  - Toleranță: 0.01
  - Constrângeri: `100 × k × W ÷ N` întreg (răspuns exact la 2 zecimale; cu N ∈ {25, 50} e mereu adevărat); |answer| ≥ 0.02; rezultate negative doar dacă inputul acceptă semnul minus.
  - Șabloane: explicația "The base rate is {k} ÷ {N} = {p%}, so expectancy = {p} × {W} − {1 − p} × 1 = {a} − {b} = {answer}R per trade. A new breakout that looks perfect still starts from this estimate until there is evidence it is different."; indiciul 3 "Base rate: {k} ÷ {N} = {p}. Wins contribute {p} × {W} = {a}R."
  - Exemplu: N 25, k 8, W 3.0 → 0.32 × 3 = 0.96; 0.96 − 0.68 = **+0.28R**.
- **Verificare:** 17 ÷ 50 = 0.34; 0.34 × 2.5 = 0.85; 33 ÷ 50 = 0.66; 0.85 − 0.66 = 0.19 ✓. Sursă: conceptul `base-rates` (exemplul cu 30 de breakout-uri din jurnal, „starts from about 40% until you have evidence that it is different”) și formula din conceptul `expectancy`. 50 de tranzacții respectă „a large, honest sample, such as your own journal”.
