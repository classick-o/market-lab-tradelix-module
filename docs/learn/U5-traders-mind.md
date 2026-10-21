# U5 · The trader's mind

Unitatea despre ce se întâmplă cu planul sub presiune. U4 a construit planul și review-ul; U5 arată ce îi împinge pe oameni să iasă din ele și ce reguli țin când emoția e puternică. Tonul e normalizator: toată lumea simte FOMO și aversiune la pierdere. Scopul nu e să nu le mai simți, ci să ai reguli care țin atunci când apar.

**După unitate, utilizatorul poate:**
- să recunoască FOMO, revenge trading, loss aversion și confirmation bias în scenarii scurte și în propriile decizii;
- să le opună reguli scrise dinainte: setup-urile din plan, riscul fix care nu crește după o pierdere, stop-ul pus la intrare și niciodată lărgit, invalidarea scrisă înainte de intrare, o pauză fixă după o mișcare mare sau o pierdere;
- să se aștepte la serii de pierderi chiar cu expectancy pozitiv, să-și scrie regulile pentru o serie (risc fix, regulă de pauză, prag de review) și să sorteze o serie în variance sau proces stricat.

**De ce ordinea L13 → L18:**
- **L13** (beginner) numește capcanele pe decizii individuale.
- **L18** (intermediate) le pune pe o serie de trade-uri și refolosește expectancy (L11), drawdown-ul (L08) și review-ul (L17).
- U5 vine după U4 pentru că remediile sunt chiar planul (L14), traseul de decizie (Flow-ul din L14) și review-ul (L17).

**Concepte acoperite:**
- Trading Psychology: `fomo`, `revenge-trading`, `loss-aversion`, `confirmation-bias`;
- refolosite: `drawdown`, `expectancy`, `decision-quality`, `journaling`.

**Checkpoint:** `test-psychology` (assessment-ul topicului). La ≥ 80%, L13 și L18 se marchează „Tested out”.

**Misiunile de final:**
- **M06 The FOMO Trap.**
  - LABX a urcat 12% în 12 lumânări după un range. Opțiunile: „Buy now”, „Wait for confirmation” (pullback de minimum 3%, apoi close peste ultimele două lumânări) sau „Pass on this one”, cu motiv.
  - Rubrica: ipoteză bazată pe dovezi (25), invalidare definită înainte de intrare (30), incertitudine recunoscută (20), regulile scenariului (25).
  - Tag-uri: `chased_entry` („Chasing extended moves”), `no_stop`, `no_hypothesis`. Motivul „I don't want to miss the move” e marcat ca FOMO.
  - Reflecția din debriefing („Would you have made the same decision if you hadn't just watched the move happen?”) e testul din conceptul `fomo`, refolosit în L13.
- **M07 Stop or Stay?**
  - Poziție deschisă cu stop la 3% și target la 6%; prețul merge împotrivă. Opțiunile: Hold / Close now / Close half / „Move the stop lower to give it room”.
  - Tag-uri: `moved_stop_away` („Moving the stop further away”), `loss_aversion` („Avoiding a planned loss”). Motivele „I don't want to take the loss” și „I'm nervous about it” sunt marcate ca loss aversion.
  - Scenariul 1 din bias-spotter (L13) folosește exact formularea „to give it room”.
- **Limba debriefing-ului e folosită și în lecții:** „Sizing up after a loss” (`revenge_size_up`), „Keep risk constant; losses are part of the process”, „A stop is a decision you made with a clear head”.

---

## L13 · FOMO, revenge and loss aversion

| | |
|---|---|
| Unitate | U5 · The trader's mind, lecția 1 din 2 |
| Durată | 6 min · 7 beat-uri în Learn |
| Concepte | fomo, revenge-trading, loss-aversion, confirmation-bias |
| Termeni (glosar) | cognitive-bias, fomo, revenge-trading, overtrading, loss-aversion, stop-loss, confirmation-bias, journal |
| Se sprijină pe | L08 (risc pe trade), L10 (unde stă stop-ul), L14 (plan, checklist, Flow) |
| Pregătește | M06 The FOMO Trap, M07 Stop or Stay? |

**Obiective**
1. Recognise FOMO, revenge trading and loss aversion in your own decisions
2. Use rules written in advance to counter emotional decisions
3. Take a set pause before acting after a strong move or a loss

### Hook
- **Tip:** predict · alegere, auto-verificare: „Take it at my usual 1% risk” / „Take it at 3%, to win the loss back” / „Pause first, then check it against my plan” / „Close the app for today”
- **Prompt:** "You were stopped out for −100.00 vUSD ten minutes ago. A new setup appears and looks good. What would you do next?"
- **Răspuns:**
  - Niciun răspuns unic: e o auto-verificare, nu se notează și nu primește feedback pe loc.
  - Recap-ul arată ce spune un plan scris dinainte (o pauză fixă, apoi checklist-ul, la 1%), fără să judece alegerea.
  - Hook-ul nu folosește scenariul FOMO de +6% (q-psy-2), ca să nu dubleze întrebarea din Check.
- **Concept:** revenge-trading

### Learn
**B1 · explain**
> "Decisions under uncertainty are rarely calm. Three well-known patterns often pull traders away from their plan: chasing a move, trying to win back a loss, and refusing to accept one. Everyone feels them: they are common [[cognitive-bias|biases]], not personal flaws. Naming them makes them easier to notice while they are happening, which is when it matters."

**B2 · figure** "FOMO" (nou; din exemplul conceptului `fomo`)
- Text: "[[fomo|FOMO]] (fear of missing out) is the urge to enter because price is already moving fast and you don't want to be left behind. The entry is late, the stop is usually far away or missing, and the move itself makes the decision, not a setup in your plan."
- Date:
  - `Candles`: 12 lumânări LABX într-un range între 100.00 și 103.10 (`Zone` range), apoi 5 lumânări care urcă de la 100.00 la 106.00;
  - `Level` neutral „Old range high” 103.10, `Level` entry 106.00, `Level` stop 103.00, `Bracket` 3.00.
  - În pasul 3 se adaugă un pullback până la 104.50 care ține, cu `Level` entry 104.50 și `Bracket` 1.50.
- Pași:
  1. "LABX rallies from 100.00 to 106.00 in five candles. The urge: buy now."
  2. "The logical stop sits just under the old range high, at 103.00: 3.00 away."
  3. "If price pulls back to 104.50 and holds, the same stop is only 1.50 away."
  4. "Same 100.00 vUSD budget: 32 units when chasing, 62 after the pullback, costs included."
- **Interacțiune:** tap avansează pasul; în pasul 4 apare `Formula`: 100.00 ÷ (3.00 + 0.1045) → 32 și 100.00 ÷ (1.50 + 0.10375) → 62.

**B3 · explain** "Revenge trading"
> "[[revenge-trading|Revenge trading]] is entering again soon after a loss, often with a larger size, to win the money back. The new trade is about the last result, not about the market in front of you. Sizing up after a loss raises the risk exactly when judgement is under the most strain. Repeated, it becomes [[overtrading]]."

**B4 · worked** "What revenge sizing costs"
- Linii: "Account 10,000.00 vUSD. A trade hits its stop: −100.00 (1%). Account: 9,900.00.", "Plan: the next trade risks 1% of 9,900.00 = 99.00. If it also loses: 9,801.00, −1.99% in total.", "Revenge: the next trade risks 3% of 9,900.00 = 297.00. If it also loses: 9,603.00, −3.97% in total.", "Total lost with the revenge trade: 100.00 + 297.00 = ?"
- **Ultimul pas îl calculează utilizatorul:** 397.00 vUSD (toleranță 0.00)
- **Feedback corect / greșit:**
  - corect: "Right: 397.00 against 199.00 with the plan, roughly double. And the bigger size was chosen because of a feeling, not a setup."
  - pentru 199.00: "That's the plan's total. The revenge trade risked 297.00 on the second loss."
  - pentru 400.00: "The second trade risked 3% of 9,900.00, which is 297.00, not 300.00."
  - altă valoare: "Add the two losses: the first stop-out, then 3% of 9,900.00."

**B5 · explain** (cu figură) "Loss aversion"
> "[[loss-aversion|Loss aversion]] is the tendency to feel a loss more strongly than a gain of the same size. In trading it shows up as widening the [[stop-loss|stop]] to avoid taking a loss, or closing winners early to lock in a good feeling. A close relative is the **sunk cost** trap: 'I've lost too much already to sell now.'"
- Figură (din exemplul conceptului `loss-aversion`, înainte de costuri):
  - `Candles`: long de la 50.00 (c6), prețul coboară până la 48.60 (c14);
  - `Level` stop 48.00; `Bracket` „−70.00” (entry → preț);
  - în pasul 2, o copie punctată a stop-ului trasă la 46.00, cu `Bracket` „1R = 100.00” → „≈ 200.00”.
- Pași:
  1. "A long sized to lose 100.00 vUSD at its stop is down 70.00."
  2. "Moving the stop to twice its distance raises the planned loss to about 200.00."

**B6 · match** "A rule for each trap"
> "One more bias hides in your analysis: [[confirmation-bias|confirmation bias]], noticing what supports your view and discounting evidence against it. It is strongest once you hold a position. Each trap has a counter: a rule written in advance. Match them."
- **Perechi:**
  - "FOMO" ↔ "Write your setups before the session. A move that is not in the plan is not a trade."
  - "Revenge trading" ↔ "Fix risk per trade as a percentage. Never increase the size after a loss."
  - "Loss aversion" ↔ "Place the stop when you enter, and never widen it."
  - "Confirmation bias" ↔ "Before entry, write down the price that would prove the idea wrong."
- **Concept:** confirmation-bias
- **Feedback corect:** "Each rule takes the decision away from the moment the bias is strongest."
- **Feedback la perechile greșite probabile:**
  - FOMO ↔ regula stop-ului: "A stop limits the loss once you're in. FOMO is about getting in at all, and the plan's setups decide that."
  - Confirmation bias ↔ regula setup-urilor: "Close, but confirmation bias is about evidence. Writing the price that proves you wrong turns contrary evidence into a rule."
  - Loss aversion ↔ regula de risc fix: "Fixed risk stops the size growing after a loss. Loss aversion shows up in the stop: keep it where you put it."

**B7 · figure** (din diagrama `decision-tree`, ca `Flow` cu alegere și un nod de pauză) "Process beats willpower"
- Text: "A strong urge to act right now, after a big move or a painful loss, is not evidence that the trade is good. Treat it as the signal to slow down and run the checklist. Afterwards, note in the [[journal]] how you felt, so patterns show over time. Walk this case through."
- Cazul (card deasupra Flow-ului): "You were stopped out minutes ago. A pullback setup appears: all three conditions are met. You want to double your size."
- Date `Flow`:
  - N0 (nou) „Loss or big move just now?”: „yes” → „Pause for your set time” → N1; „no” → N1.
  - N1 „Setup present?” → N2 „All conditions met?” → N3 „Risk within the limit?” → „Enter with a stop”.
  - Ramuri „no”: N1 și N2 → „No trade”; N3 → „Resize within the limit, or skip”.
- **Interacțiune:**
  - N0, corect „yes”. La „no”: "A stop-out minutes ago counts. The pause comes first, whatever the setup looks like."
  - N1 și N2, corect „yes”. La „no” pe N2: "The case says all three conditions are met. The checklist allows this trade."
  - N3, corect „no” → „Resize within the limit, or skip”. La „yes”: "Doubling the size doubles the risk to 2%. The rule: risk never rises after a loss."
- Pași:
  1. "A loss just now? Pause for your set time before deciding anything."
  2. "Setup present, all conditions met: the checklist says this trade is allowed."
  3. "Risk within the limit? Doubled size means 2%: no. Back to 1%, or skip."

### Try
- **Widget:** bias-spotter (nou)
- **Valori de start:** 4 carduri nerezolvate, în ordinea de mai jos. Fiecare are aceleași 4 butoane: FOMO · Revenge trading · Loss aversion · Confirmation bias.
- **Obiectiv:** "Four moments, four pulls. Read each one and name the bias behind the decision."
- **Scenarii (text pe card · răspuns corect · explicația corectă):**
  1. "Your long is 70.00 vUSD down and close to the stop. Nothing in the setup has changed, but you drag the stop lower 'to give it room'." · **Loss aversion** · "Loss aversion. The stop was decided with a clear head; moving it raises the loss you already accepted."
  2. "You're long LABX. You point to the rising 20-period moving average as proof, and wave off three lower highs in a row as 'just noise'." · **Confirmation bias** · "Confirmation bias. Three lower highs are evidence against the trade. Writing the price that proves you wrong, before entry, turns it into a rule."
  3. "Your stop was hit for −100.00 vUSD. Five minutes later you enter again at three times your usual size, on a setup you'd normally skip: 'I just need to get that back.'" · **Revenge trading** · "Revenge trading. The size comes from the last result. The rule: a pause first, and risk never rises after a loss."
  4. "LABX has jumped 5% in three candles and everyone is talking about it. It isn't one of your setups, but you open the ticket anyway: 'If I wait, I'll miss it.'" · **FOMO** · "FOMO. The move is making the decision. The rule: a move that is not in the plan is not a trade."
- **Explicații per alegere greșită:**
  - Cardul 1 (loss aversion):
    - FOMO → "Nothing here is about getting into a move. You're already in, and the stop moves to avoid taking the loss."
    - Revenge trading → "There's no new trade to win anything back. This is about not accepting a loss that was already planned."
    - Confirmation bias → "No evidence is being filtered: the setup hasn't changed. The stop moves only because the loss hurts."
  - Cardul 2 (confirmation bias):
    - FOMO → "You're already in the trade. The issue is which evidence you let count, not the fear of missing a move."
    - Revenge trading → "No recent loss drives this. The pattern is keeping the evidence that agrees and dismissing what doesn't."
    - Loss aversion → "No stop is being moved and no loss avoided yet. It's how the chart is read: only the supporting signs count."
  - Cardul 3 (revenge trading):
    - FOMO → "The trigger is the loss, not a fast move. Tripling the size to 'get it back' is revenge trading."
    - Loss aversion → "Close: both start with a loss. But here you open a new, bigger trade to recover it, instead of avoiding taking it."
    - Confirmation bias → "No evidence is being weighed. The size and the timing come from the last result, not from the chart."
  - Cardul 4 (FOMO):
    - Revenge trading → "There's no loss to win back. The move itself, and the fear of missing it, is what pulls you in."
    - Loss aversion → "No loss is being avoided: you have no position. The pull is to get in before the move leaves without you."
    - Confirmation bias → "Close, but you're not defending a view with chosen evidence. The urge is simply not to be left out."
- **Reușită:** toate cele 4 carduri rezolvate corect. O alegere greșită arată explicația ei, iar cardul se poate reîncerca. Dovada se dă per card, pe conceptul cardului: 1 dacă prima alegere e corectă, 0,5 după o greșeală sau un indiciu.
- **Indicii:** 1. "Ask what set off the decision: a fast move, a recent loss, a loss you're sitting in, or a view you hold." 2. "Getting in or getting even? FOMO chases a move; revenge chases a past loss." 3. "Already in a trade? Moving the stop is loss aversion; waving off warning signs is confirmation bias."
- **Show me:** cardurile se întorc pe rând (600ms fiecare): biasul corect se marchează și apare explicația corectă.
- **Feedback:**
  - final: "All four named. Everyone feels these pulls. The goal isn't to stop feeling them; it's to have a rule that holds when they show up."
  - după o încercare greșită: explicația alegerii făcute (lista de mai sus), apoi „Try again”. După a doua greșeală pe același card apare indiciul următor, fără să fie cerut.

### Check
- Întrebări: q-psy-1, q-psy-2, q-psy-3 (actuale)
- Înlocuiri propuse:
  - **q-psy-1 → q-psy-5.** q-psy-1 (definiția FOMO) dublează cardul 4 din bias-spotter și q-psy-2. q-psy-5 (reguli scrise dinainte, risc fix, pauză) verifică obiectivul 2.
  - **q-psy-3 → q-psy-4.** q-psy-3 (semnul aversiunii la pierdere) dublează cardul 1 și perechea din B6. q-psy-4 (revenge trading, „pause and skip it”) verifică obiectivul 3, singurul fără întrebare. Închide și hook-ul, care pune aceeași situație ca auto-verificare.
  - Setul propus: q-psy-2 (obiectivul 1), q-psy-5 (obiectivul 2), q-psy-4 (obiectivul 3).

### Recap
- **Hook comparat:** "You chose “{yours}”. Wanting to win a loss back is normal; almost everyone feels it. A rule written in advance answers for you: a set pause, then the checklist, at your usual 1%."
- **Three things to remember:**
  1. "Name the pull: FOMO chases a move, revenge chases a loss, loss aversion avoids one."
  2. "Rules written in advance decide for you: setups first, fixed risk, stops never widened."
  3. "After a big move or a loss, pause for a set time before any decision."
- **Practise it:** M06 The FOMO Trap, M07 Stop or Stay?, Knowledge check: psychology

### Note de conținut
- **Interacțiuni:** L13 e una dintre cele 6 lecții fără nicio interacțiune azi (PLAN_LEARN §1). Acum are hook-ul, worked-ul cu input (B4), match-ul (B6), Flow-ul cu alegere (B7) și bias-spotter.
- **Confirmation bias:**
  - `concepts.ts` listează L13 și L14 la `confirmation-bias`, dar textul L13 nu-l menționa. Bias-spotter îl cere, de aceea e introdus în B6, cu definiția și exemplul din concept (media mobilă pe 20 de perioade și trei lower highs, în cardul 2).
  - În `glossary.ts`, `confirmation-bias` nu are `lesson`: propun `lesson: "L13"`.
- **Overtrading:** termen de glosar fără lecție. E legat în B3 („Repeated, it becomes overtrading”), pe baza definiției din glosar („…the wish to recover losses”). Propun `lesson: "L13"`. Tag-ul `overtrading` din evaluare („Trading too often”) vorbește aceeași limbă.
- **Cifre noi, verificate:**
  - B2 (exemplul FOMO din concept, care spune „ignoring costs”: 33 și 66 de unități):
    - cu costuri, 32 de unități: 96.00 + 1.70 + 1.65 = 99.35 vUSD; 33 ar trece de 100.00;
    - cu costuri, 62 de unități: 93.00 + 3.24 + 3.20 = 99.44 vUSD.
    - Propun ca exemplul din `concepts.ts` să treacă la cifrele după costuri, ca în L09, sau să rămână marcat „ignoring costs”.
    - Range-ul 100.00–103.10 e o dată nouă: conceptul spune doar „stop at 103.00, just under the old range high”.
  - B4: 9,801.00 = −1.99%, 9,603.00 = −3.97%, 199.00 față de 397.00.
  - Conceptul `revenge-trading` are alt exemplu (300.00 fix după −100.00, total 400.00, „four times the planned risk”). Cele două nu se contrazic: lecția calculează 3% din 9,900.00.
  - B5: 50 de unități înainte de costuri; 70.00 jos = preț 48.60; dublarea distanței (2.00 → 4.00) dă 200.00, ca „about 200.00” din concept.
- **Diagrama `decision-tree`:**
  - caption-ul de azi („Any 'no' means no trade”) contrazice nodul 3 („Adjust size or skip”);
  - în Flow-ul nou, N3 duce la „Resize within the limit, or skip”, la fel ca în L14 și L17;
  - nodul de pauză (N0) e nou și vine din regula „cooling-off pause” a lecției.
- **De decis: lungimea pauzei.** Lecția spune „a cooling-off pause of a set length”, fără cifră. Am păstrat „your set time”. Dacă echipa vrea o valoare implicită (minute sau număr de lumânări), trebuie să fie aceeași în L13, L18, q-psy-5 și M07.
- **Bias-spotter față de PLAN §9.2:** cele 4 biasuri sunt exact cele din plan (FOMO, revenge, loss aversion, confirmation). Sunk cost rămâne în B5 și în q-psy-10, nu în widget, pentru că q-psy-10 îl tratează ca variantă separată și ar crea confuzie.
- **Nimic pierdut din lecția actuală:**
  - deschiderea → B1;
  - FOMO → B2;
  - revenge → B3 și B4;
  - loss aversion și sunk cost → B5;
  - diagrama → B7;
  - cele 5 reguli → B6 (patru reguli), B7 (pauza și jurnalul);
  - callout-ul → textul B7.

---

## L18 · Handling losing streaks

| | |
|---|---|
| Unitate | U5 · The trader's mind, lecția 2 din 2 |
| Durată | 6 min · 6 beat-uri în Learn |
| Concepte | drawdown, expectancy, revenge-trading, decision-quality |
| Termeni (glosar) | drawdown, expectancy, max-drawdown, risk-per-trade, journal |
| Se sprijină pe | L08 (risc pe trade, drawdown), L11 (expectancy), L13 (revenge trading), L17 (review) |
| Pregătește | M07 Stop or Stay?, Arena: sideways market |

**Obiective**
1. Explain why losing streaks happen even with a positive expectancy
2. Apply fixed risk and pre-set stopping rules during a streak
3. Review a streak to tell bad luck from a broken process

### Hook
- **Tip:** predict · slider 0–100%, pas 1
- **Prompt:** "A method wins 40% of its trades and makes +0.20R per trade on average. Over 100 trades, how likely is at least one run of five losses in a row?"
- **Răspuns:** about 98% (97.6%, calcul exact cu trade-uri independente). Comparat în recap.
- **Concept:** expectancy

### Learn
**B1 · explain**
> "Any method that sometimes loses will sometimes lose several times in a row. A run of losses does not by itself mean the method is broken, just as a run of wins does not mean it is perfect. The real danger is the response: streaks invite exactly the decisions that turn a normal [[drawdown]] into a deep one."

**B2 · worked** "How likely is a run of losses?"
- Linii: "Method: wins 40% at +2R, loses 60% at −1R. [[expectancy|Expectancy]]: 0.40 × 2 − 0.60 × 1 = +0.20R.", "Assume each trade's result is independent of the last.", "Chance that five given trades in a row all lose: 0.6 × 0.6 × 0.6 × 0.6 × 0.6 = ?"
- **Ultimul pas îl calculează utilizatorul:** 7.8% (toleranță ±0.1; acceptă și 0.078, cu nota că se afișează în procente)
- **Feedback corect / greșit:**
  - corect: "Right: 7.8% for five given trades. But 100 trades hold many stretches of five: a run of five or more somewhere is about 98% likely, and eight or more about 49%."
  - pentru 3.0: "That adds the chances. For all five to lose, multiply: 0.6 × 0.6 × 0.6 × 0.6 × 0.6."
  - pentru 60: "That's one trade. Five losses in a row need 0.6 five times over."
- **Rezultat (sub ultima linie, după răspuns):** "For a method like this, a run of five losses is close to certain over 100 trades, even though its expectancy is positive."

**B3 · figure** (din diagrama `loss-recovery`) "Eight losses in a row"
- Text: "The same streak of eight losses at three risk sizes. The deepest fall from a peak is the [[max-drawdown|maximum drawdown]]."
- Date: `Bars`, trei perechi (scădere / creștere necesară), pornind de la 10,000.00:
  - 1%: 9,227.45 (−7.7%) / +8.4%;
  - 2%: 8,507.63 (−14.9%) / +17.5%;
  - 3%: 7,837.43 (−21.6%) / +27.6%.
- Pași:
  1. "At 1% risk, eight losses take 10,000.00 to 9,227.45: −7.7%. Recovery needs +8.4%."
  2. "At 2%, the same streak ends at 8,507.63: −14.9%. Recovery needs +17.5%."
  3. "At 3%, it ends at 7,837.43: −21.6%. Recovery needs +27.6%."
  4. "Larger risk per trade pushes the same streak into the steep part of the curve."
- **Interacțiune:** tap avansează perechile; după pasul 4, un slider opțional „Risk per trade” 0.5–5% (pas 0.5) mută a patra pereche (explorare, fără verificare).

**B4 · match** "Where the damage really comes from"
> "During a streak, the damage comes from the response. Match each behaviour to what it sounds like in your head."
- **Perechi:**
  - "Sizing up to win it back" ↔ "'One bigger trade and I'm back to even.'"
  - "Loosening the rules" ↔ "'Not another loss. No stop on this one.'"
  - "Recency bias" ↔ "'The last five lost. That's all I need to know.'"
  - "Method-hopping" ↔ "'Third new strategy this month. This one will work.'"
  - "Overcorrection" ↔ "'Every condition is met, but I'll skip it, just in case.'"
- **Concept:** revenge-trading
- **Feedback corect:** "Sizing up raises risk exactly when judgement is under strain, and counts against Risk Discipline. Method-hopping means no method ever gets enough trades to be judged."
- **Feedback la perechile greșite probabile:**
  - Recency bias ↔ Method-hopping: "Recency bias is the weighting: the last few results count too much. Method-hopping is the action it often leads to."
  - Overcorrection ↔ Loosening the rules: "Loosening skips the rules to avoid a loss. Overcorrection skips valid trades the rules allow."

**B5 · predict** (fără răspuns unic, câmpuri de plan) "Your streak rules"
> "Decide how you'll behave in a losing streak before it starts. Keep [[risk-per-trade|risk per trade]] fixed as a percentage: you may reduce it during a drawdown, never increase it to recover. Then set a pause rule and a review trigger. Fill in yours."
- **Câmpuri:**
  1. "Risk per trade during a drawdown": alegere 0.5% · 1% · 2%; implicit 1%.
  2. "Stop for the session after __ losses in a row": stepper 2–5; implicit 3.
  3. "Full review when the account is __% below its peak": stepper 3–10; implicit 5.
- **Validare:** câmpul 1 trebuie să fie ≤ 1%; câmpurile 2 și 3 se acceptă la orice valoare din interval.
- **Feedback:**
  - valid: "These are your streak rules. Written now, they decide for you when the streak arrives."
  - 2%: "Raising risk to recover is the revenge pattern, and it counts against Risk Discipline. You may reduce risk in a drawdown, never increase it."
- **Concept:** drawdown

**B6 · predict** "Bad luck or broken process?"
- **Prompt:** "Six of your last eight trades lost. Your [[journal]] shows three late entries after big candles, two widened stops and one setup that missed a condition. Bad luck or a broken process?"
- **Control:** alegere: „Bad luck: normal variance” / „A broken process” ✓ / „Can't tell yet”
- **Explicație după răspuns (textul beat-ului):**
> "To tell bad luck from a broken process, look at the decisions, not the profit and loss. Complete setups, stops placed at entry and risk within the limit point to **variance**: the normal clustering of random results. Skipped conditions, late entries or widened stops mean the process is the problem, and the fix is a rule."
- **Feedback:**
  - corect: "Right. The journal shows broken rules, so this isn't just variance. The fix is a rule, not a new method."
  - „Bad luck”: "Variance fits when the journal shows complete setups and stops kept. Here it shows late entries, widened stops and a missed condition."
  - „Can't tell yet”: "Eight trades can't judge a method's expectancy, but they can show broken rules. The journal already answers this one."
- **Concept:** decision-quality

### Try
- **Widget:** expectancy, cu panoul nou „Losing runs” (vezi Cerințe)
- **Valori de start:** win rate 40%, average win 2.0R, average loss 1.0R (toate blocate); run length 5; 100 trades (fix) → +0.20R per trade, +20R over 100 trades, „Chance of a run of 5+ losses in 100 trades: 98%”
- **Obiectiv:** "This method makes +0.20R per trade, yet a run of five losses is almost certain. Raise the run length: find the shortest losing run that is less likely than not over 100 trades."
- **Reușită:** run length = 8 (48.97%, afișat 49%); verificat la „Check”
- **Indicii:** 1. "'Less likely than not' means a chance below 50%." 2. "Step the run length up one at a time and watch the chance fall." 3. "A run of 7 is still about 69% likely. Try one longer."
- **Show me:** run length-ul urcă pas cu pas de la 5 la 8 (300ms pe pas): 98%, 87%, 69%, 49%.
- **Feedback:**
  - corect: "Right. Even a run of eight is about a coin flip over 100 trades, at +0.20R per trade. A streak like that is part of the method, not proof it broke. Plan for it before it starts."
  - după o încercare greșită, mai scurt de 8: "A run of {n} is still about {p}% likely over 100 trades. Go one longer."
  - după o încercare greșită, mai lung de 8: "{n} is below 50%, but so is a shorter run. Find the shortest."

### Check
- Întrebări: q-psy-6, q-psy-7, q-psy-9 (actuale, păstrate)
  - q-psy-6: o serie singură spune puțin (obiectivul 1);
  - q-psy-7: regula de sesiune după trei pierderi (obiectivul 2);
  - q-psy-9: variance cu jurnalul curat (obiectivul 3), complementar cazului din B6.

### Recap
- **Hook comparat:** "You guessed {yours}%. For this method it is about 98%: a run of five losses is close to certain over 100 trades."
- **Three things to remember:**
  1. "Losing streaks are normal: a +0.20R method almost surely loses five in a row."
  2. "Fix risk, set a pause rule and a review trigger before the streak starts."
  3. "Sort each loss: sound decision, bad outcome, or broken rule? Fix rules, not methods."
- **Practise it:** M07 Stop or Stay?, Arena: sideways market, Knowledge check: psychology

### Note de conținut
- **Widget vs prompt:** promptul de azi spune că setările 40% / 2R / 1R „make a run of five losses close to certain”, dar `expectancy` arată doar media (per trade, la 100 de trade-uri, % din cont). Nimic despre serii. Task-ul cere panoul nou „Losing runs”.
  - Fallback dacă panoul nu intră în E3: același widget, cu task-ul „With a 40% win rate and 1R losses, find the smallest average win that keeps expectancy positive” (1.6R → +0.04R). Seriile rămân doar în B2.
- **Diagramă vs caption:**
  - diagrama `loss-recovery` arată perechile 10% / 20% / 50%;
  - caption-ul L18 vorbește despre 8 pierderi la 1% (9,227.45). Figura nouă folosește cifrele din caption și adaugă 2% și 3%.
- **Cifre verificate:**
  - 0.6⁵ = 7.776%;
  - serie de 5+ în 100 de trade-uri la 60% pierderi: 97.58%; 6+: 87.26%; 7+: 68.91%; 8+: 48.97% (lanț Markov exact, trade-uri independente);
  - 0.99⁸ → 9,227.45 (−7.73%, +8.37%); 0.98⁸ → 8,507.63 (−14.92%, +17.54%); 0.97⁸ → 7,837.43 (−21.63%, +27.59%).
- **Glosar:**
  - `drawdown` și `max-drawdown` au deja `lesson: "L18"`; `max-drawdown` e acum legat în B3.
  - „Variance” nu are termen: propun `variance` („The normal clustering of random results; a run of losses with sound decisions is most likely variance.”).
  - `recency-bias` e propus în L17 și refolosit aici.
- **Plan (Pro):** L18 e `tier: "pro"`. Conform deciziei din PLAN_LEARN §17, tot conținutul Learn e funcțional pentru toată lumea deocamdată.
- **Stocare pentru B5:** `LabData` v2 are `hookAnswer`, dar nu răspunsuri la beat-uri. Propun ca valorile din B5 să se salveze (de exemplu `lessons[id].fields`), ca recap-ul să le poată arăta („Your rules: pause after {n} losses, review at {x}% below the peak.”) și ca M07 să le poată aminti. De decis.
- **Nimic pierdut din lecția actuală:**
  - deschiderea → B1;
  - exemplul de probabilități → B2 (98% și 49% în feedback, ipoteza independenței în linie);
  - diagrama → B3;
  - widget-ul → Try;
  - lista „Where the damage comes from” → B4;
  - pașii pentru serii: 1–3 → B5, 4–5 → B6 și ideea 3 din recap;
  - textul despre variance → B6;
  - callout-ul → ideea 2 din recap.

---

## Cerințe pentru widget-uri

### bias-spotter (nou; L13)
- **Date din conținut:**
  - `cards: { id, text, answer, correct, rationales }[]`, unde `answer` e unul dintre `fomo` | `revenge-trading` | `loss-aversion` | `confirmation-bias` și `rationales` are o explicație pentru fiecare variantă greșită;
  - 4 carduri; textul ≤ 40 de cuvinte, explicațiile ≤ 30;
  - conceptul cardului e chiar `answer` (id-urile coincid cu cele din `concepts.ts`).
- **Controale:**
  - un card pe ecran, cu progres „1 of 4” și puncte de navigare;
  - 4 butoane cu ordine fixă (FOMO, Revenge trading, Loss aversion, Confirmation bias), ca tastele 1–4 să fie stabile;
  - ← / → mută între carduri; ținte ≥ 44px; pe mobil, butoanele pe două rânduri.
- **Stări pe card:** idle → chosen → correct / incorrect → resolved.
  - **Correct:** bifă desenată și textul `correct`.
  - **Incorrect:** butonul ales trece în neutru-puternic (nu roșu), apare explicația alegerii și „Try again”; după a doua greșeală apare indiciul următor.
  - **Resolved:** cardul rămâne vizibil cu răspunsul.
- **Ieșiri:**
  - la final, un rezumat „4 of 4 named · 3 on the first try” și lista cardurilor cu biasul fiecăruia;
  - fără scor afișat ca notă, fără mesaje care rușinează.
- **Reușită:** toate cele 4 carduri rezolvate. Dovezi per card, pe conceptul cardului: 1 la prima alegere corectă, 0,5 după o greșeală sau un indiciu.
- **Reset, Show me:** Show me întoarce cardurile pe rând (600ms fiecare; instant cu reduced motion).
- **Accesibilitate:** feedback-ul cu `aria-live="polite"`, focusul trece pe feedback după alegere. Culorile vin doar din tokeni; corect și greșit au icon și text.
- **Fără grafic:** cardurile sunt text. Ilustrațiile, dacă apar, sunt doar atmosferă (`aria-hidden`).

### expectancy (extins; L11, L17, L18)
- **Mod task:** valori de start și câmpuri blocate din conținut; verificare la „Check”; Reset și Show me. Corectura de afișare „0.00R” fără semn e descrisă în U4.
- **Panou nou „Losing runs”:**
  - **Control:** „Losing run” stepper 3–12, pas 1; implicit din conținut (5 în L18). Numărul de trade-uri e fix la 100 și afișat; opțional 20 / 50 / 100, dacă alte lecții îl cer.
  - **Ieșire:** „Chance of a run of {n}+ losses in 100 trades”. Probabilitatea se calculează exact, cu un lanț Markov pe stările 0…n−1 (lungimea seriei curente) și absorbție la n, unde q = 1 − win rate.
  - **Afișare:** procent întreg; ≥ 99.5% se afișează „> 99%”, < 0.5% se afișează „< 1%”.
  - **Notă fixă sub panou:** „Assumes each trade is independent of the last.”
  - Average win și average loss nu schimbă probabilitatea. Panoul o spune într-un tooltip: „Only the win rate affects streaks.”
- **Valori de referință pentru teste:**
  - la win rate 40%: 5 → 98% (97.58), 6 → 87% (87.26), 7 → 69% (68.91), 8 → 49% (48.97), 9 → 32% (32.39), 10 → 20% (20.49), 11 → 13% (12.62), 12 → 8% (7.65);
  - la 50%: 5 → 81%, 6 → 55%, 7 → 32%, 8 → 17%.
- **Reușită L18:** run length = 8, cu win rate 40% (blocat). Show me urcă pas cu pas de la 5 la 8 (300ms pe pas).

### Componente de beat folosite în U5
- **`Flow` cu alegere (L13 B7):** aceleași reguli ca în U4, plus un nod de tip „pause”. E un nod cu un singur rezultat („Pause for your set time”), desenat cu `--ml-accent-2`, după care traseul continuă la N1.
- **Câmpuri de plan (L18 B5):** controlul `fields` pentru beat-ul `predict` (o alegere și două stepper-e).
  - Validarea e declarativă (`{ field: "risk", max: 1 }`); orice combinație validă e „correct” (fără răspuns unic).
  - Valorile se salvează pentru recap, dacă se aprobă stocarea propusă în nota L18.
- **`match`:** 4 perechi în L13, 5 în L18; explicațiile perechilor greșite sunt în beat-uri.
- **`worked` cu input:** L13 B4 (397.00, toleranță 0) și L18 B2 (7.8, toleranță ±0.1). Câmpul acceptă virgulă sau punct și afișează unitatea (vUSD, %).
