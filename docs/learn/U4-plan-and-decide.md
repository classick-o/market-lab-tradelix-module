# U4 · Plan and decide

Unitatea mută accentul de la calcul la judecată. După U3 utilizatorul știe să calculeze riscul, mărimea poziției și R:R; aici învață să decidă cu ele: când intră, când nu intră și cum își judecă deciziile după aceea.

**După unitate, utilizatorul poate:**
- să scrie un playbook cu condiții verificabile (da / nu), risc, ieșiri și limite, și să treacă orice setup prin traseul de decizie înainte să intre;
- să construiască un plan pe scenarii (bullish, false breakout, bearish, sideways), fiecare cu un trigger observabil și o acțiune decisă dinainte, și să verifice că poate accepta cazul cel mai prost;
- să revizuiască un trade după calitatea deciziei (ce putea vedea atunci, dacă a urmat planul), nu după profit, și să încheie review-ul cu o singură regulă.

**De ce ordinea L14 → L15 → L17:**
- **L14** dă o singură cale: toate condițiile „da” → trade; orice „nu” → no trade.
- **L15** extinde planul la toate drumurile pe care le poate lua prețul după decizie.
- **L17** închide bucla: compară decizia cu planul și schimbă planul doar prin reguli, nu după un rezultat.
- Fiecare lecție își păstrează graficul de la cap la coadă (LABX 49.00 / 48.00 în L14, range-ul 59.00–60.50 în L15, trade-ul 50.00 / 48.00 în L17). Flow-ul de decizie din L14 revine în L17 ca instrument de review.

**Concepte acoperite:**
- Decision-Making: `trading-plan`, `decision-quality`, `journaling`;
- Scenario Analysis: `scenario-planning`, `base-rates`, `counterfactual-thinking`;
- refolosite: `confirmation-bias` (pe scurt în L14, complet în L13), `false-breakout`, `gap-risk`, `reward-to-risk`, `expectancy`.

**Checkpoint:** `test-decision_making` + `test-scenario_analysis` (assessment-urile celor două topicuri). La ≥ 80%, L14, L15 și L17 se marchează „Tested out”.

**Misiunea de final: M10 No Trade Is a Trade.**
- Playbook de breakout cu 3 condiții: close peste high-ul ultimelor 30 de lumânări; volum peste media ultimelor 20; un stop sub low-ul ultimelor 3 lumânări, în 3% din preț. Risc 1%.
- Rubrica: condițiile bifate corect (40), acțiunea conformă playbook-ului (40), risc ≤ 1% dacă intră (20).
- Lecțiile folosesc limba debriefing-ului: „No trade was the right trade”, „Breaking your playbook” (`broke_playbook`), „Misreading your own conditions” (`misread_conditions`), „Skipping valid setups” (`missed_valid_setup`). De aceea recap-ul L14 spune ambele jumătăți ale regulii: toate „da” → trade, orice „nu” → no trade.

---

## L14 · Writing a trading plan

| | |
|---|---|
| Unitate | U4 · Plan and decide, lecția 1 din 3 |
| Durată | 6 min · 7 beat-uri în Learn |
| Concepte | trading-plan, decision-quality, confirmation-bias |
| Termeni (glosar) | pullback, stop-loss, trading-plan, playbook, timeframe, confirmation-bias, r, reward-to-risk, journal |
| Se sprijină pe | L05 (swing highs și swing lows), L10 (stop dincolo de invalidare), L11 (R:R) |
| Pregătește | M10 No Trade Is a Trade |

**Obiective**
1. Write a short playbook with entry conditions, risk and exits
2. Check a setup against every condition before acting
3. Treat 'no trade' as a valid decision

### Hook
- **Tip:** predict · alegere: „Buy it” / „Skip it” / „Can't tell yet”
- **Figură:** `Candles`, 20 de lumânări LABX în trend ascendent: swing lows 45.90, 46.60, 47.40; swing highs 48.30, 49.60, 50.50; pullback până la 48.20, ultima închidere 49.00. `Level` entry 49.00, `Level` stop 48.00, `Level` neutral „Previous high” 50.50.
- **Prompt:** "LABX is rising and has [[pullback|pulled back]]. You could buy at 49.00 with a [[stop-loss|stop]] at 48.00, under the pullback low. The previous high is 50.50. Would you buy?"
- **Răspuns:** „Skip it”, după playbook-ul din lecție: ținta naturală (50.50) e la 1.50 de entry, adică 1.5R, sub minimul de 2R (condiția 3). „Can't tell yet” e instinctul bun: fără reguli scrise, orice răspuns e o ghicire. Comparat în recap.
- **Concept:** trading-plan

### Learn
**B1 · explain**
> "A [[trading-plan|trading plan]] is a written set of rules you decide while calm and follow while under pressure. The hard thinking is done before money is at risk. Its core is a [[playbook]]: the setups you trade, each described by conditions specific enough to answer yes or no."

**B2 · match** "What a plan contains"
> "A plan first names the market and the [[timeframe]]: what you trade and which candle interval you read. Then come five parts. Match each one to its line in a pullback playbook."
- **Perechi:**
  - "Setups" ↔ "Pullback in an uptrend"
  - "Entry conditions" ↔ "A checklist where every item must be true"
  - "Risk" ↔ "1% per trade, stop 0.20 below the pullback low"
  - "Exits" ↔ "Stop or target hit, or a time limit if nothing happens"
  - "Limits" ↔ "Stop for the session after three losses in a row"
- **Concept:** trading-plan
- **Feedback corect:** "Each part answers one question before the session: what, when, how much, how you get out, and when you stop."
- **Feedback la perechile greșite probabile:**
  - Risk ↔ linia de la Limits: "That caps a whole session. Risk is what one trade may lose, and where its stop goes."
  - Exits ↔ linia de la Risk: "The 1% sets how much a trade may lose. Exits say how the trade ends: stop, target or time."
  - Setups ↔ linia de la Entry conditions: "A setup is the pattern. Its conditions are the checklist that confirms it."

**B3 · explain** "Make every condition checkable"
> "Vague rules leave room for wishful thinking, or [[confirmation-bias|confirmation bias]]. 'The trend looks strong' can be argued either way; 'the last two swing lows are each higher than the one before' is simply true or false. If two people could look at the same chart and disagree about a condition, rewrite it until they couldn't."

**B4 · figure** "A playbook entry" (nou, din exemplul lecției)
- Date: `Candles`, 22 de lumânări LABX, altă zi: swing lows 45.90, 46.60, 47.40; swing highs 48.30, 49.60, 51.50; pullback până la 48.20, ultima închidere 49.00. `Marker` pe swing-uri, `Level` entry 49.00, `Level` stop 48.00, `Level` target 51.50, `Bracket` 1.00 (entry → stop) și `Bracket` 2.50 (entry → target).
- Text: "The same playbook on another LABX day. Check it one condition at a time."
- Pași:
  1. "Condition 1: the last two swing highs and swing lows are each higher than the ones before."
  2. "Condition 2: the pullback low, 48.20, has held above the previous swing low at 47.40."
  3. "Stop rule: 0.20 below the pullback low, so 48.00. Entry 49.00 is 1.00 above: 1R."
  4. "Condition 3: the previous high, 51.50, is the target. Is it at least 2R away?"
- **Interacțiune:** tap avansează pasul; condițiile 1 și 2 primesc bifă când se aprind; pasul 4 rămâne cu semn de întrebare până la B5.

**B5 · worked** "Does condition 3 pass?"
- Linii: "Risk per unit: 49.00 − 48.00 = 1.00.", "Reward per unit: 51.50 − 49.00 = 2.50.", "[[reward-to-risk|Reward-to-risk]] in [[r|R]]: 2.50 ÷ 1.00 = ?"
- **Ultimul pas îl calculează utilizatorul:** 2.5 (toleranță 0; acceptă 2.5 și 2.50)
- **Feedback corect / greșit:** "Right: 2.5R clears the 2R minimum. All three conditions are met and the stop is defined, so the plan allows the trade." / pentru 0.4: "That's risk ÷ reward. R counts the reward in units of risk: 2.50 ÷ 1.00." / altă valoare: "Divide the reward per unit by the risk per unit: 2.50 ÷ 1.00."

**B6 · figure** (din diagrama `decision-tree`, ca `Flow` cu alegere la fiecare nod) "Run it through the plan"
- Text: "Next day, same playbook. The pullback fell to 47.30, below the previous swing low at 47.40, and price is back at 48.60. Walk it through the plan: choose a branch at each node."
- Date `Flow`: N1 „Setup present?” → N2 „All conditions met?” → N3 „Risk defined and within the limit?” → „Enter with a stop”. Ramuri „no”: N1 → „No trade”; N2 → „No trade”; N3 → „Resize within the limit, or skip”.
- **Interacțiune:** utilizatorul alege yes / no la fiecare nod; ramura aleasă se aprinde, restul trec la 60%.
  - N1, corect „yes”. La „no”: "Fair doubt, but the pattern is still a pullback in an uptrend. Whether it qualifies is what the conditions check next."
  - N2, corect „no” → „No trade”. La „yes”: "Check condition 2: the pullback had to hold above 47.40. It reached 47.30."
- Pași:
  1. "Setup present? A pullback in an uptrend: yes."
  2. "All conditions met? The pullback broke 47.40, so condition 2 fails: no trade."
  3. "Only three yeses lead to an entry. A 'no' on risk means resize or skip."

**B7 · order** "Before every trade"
> "Declining a trade that fails the plan is not a missed opportunity; it is the plan working. In MARKET//LAB, **Decision Quality** judges whether a decision fitted the plan and the information you had, not what price did afterwards. A well-reasoned 'no trade' is a good decision too, worth a line in your [[journal]]. Put the routine in order."
- **Ordinea corectă:**
  1. "Name the setup you think you see."
  2. "Check each condition against the chart, one at a time: yes or no."
  3. "Define the stop and size the position within your risk limit."
  4. "Enter only if every answer is yes."
  5. "Record the decision and why in your journal, trade or no trade."
- **Concept:** trading-plan
- **Feedback corect:** "That's the routine. The journal entry is the same whether you trade or not."
- **Feedback greșit:** sizing înaintea condițiilor: "Size comes after the conditions: there's no point sizing a trade the plan rejects." / intrarea înaintea verificărilor: "Entering comes after every check, so the thinking is done before money is at risk." / jurnalul înainte de decizie: "The journal records the decision, so it comes last."

### Try
- **Widget:** risk-reward, cu câmpurile entry / stop / target din PLAN_LEARN §9.1 (vezi Cerințe)
- **Valori de start:** entry 49.00 (blocat), stop 48.00 (blocat), target 51.50 → 2.50 : 1, break-even 28.6%; prag afișat „Min 2R”
- **Obiectiv:** "Condition 3 needs a target at least 2R from entry. Entry and stop are fixed by the setup. Find the lowest target the plan still accepts."
- **Reușită:** target = 51.00 (R:R = 2.00, calculat în cenți), entry și stop neschimbate; verificat la „Check”
- **Indicii:** 1. "Condition 3 is about distance: the target must be at least twice as far from entry as the stop." 2. "Here 1R is 49.00 − 48.00 = 1.00, so 2R is 2.00." 3. "Add 2R to the entry: 49.00 + 2.00."
- **Show me:** target-ul coboară animat de la 51.50 la 51.00; R:R 2.00 : 1; break-even 33.3%; linia de target se oprește pe gradația „2R”.
- **Feedback:** corect "Right. 51.00 is exactly 2R. Any lower target fails condition 3. On the hook's chart, 50.50 gave only 1.5 : 1, so the plan said no trade." / după o încercare greșită: sub 51.00 "At {target} the ratio is {rr} : 1. Condition 3 fails, so the plan says no trade." · peste 51.00 "{target} passes at {rr} : 1, but a lower target still clears 2R. Find the lowest."

### Check
- Întrebări: q-dm-1, q-dm-2, q-dm-3 (actuale)
- Înlocuire propusă: **q-dm-2 → q-dm-8**.
  - q-dm-2 repetă exact situația din hook și din task: condiția 3 la 1.5R.
  - q-dm-8 verifică „a move that is not in the plan is not a trade”, altfel neacoperit în L14, și pregătește M10, unde un spike de volum fără breakout arată tentant.
  - Setul propus: q-dm-1 (condiție verificabilă, obiectivul 2), q-dm-3 (de ce planul se scrie dinainte, obiectivul 1), q-dm-8 (no trade în afara playbook-ului, obiectivul 3).

### Recap
- **Hook comparat:** "You chose “{yours}”. The playbook says no trade: the previous high was 1.50 away, 1.5R, below the 2R minimum."
- **Three things to remember:**
  1. "A plan names setups, conditions, risk, exits and limits, written before the session."
  2. "Check every condition, one at a time. All yes: trade. Any no: no trade."
  3. "No trade is a decision. Decision Quality judges fit with the plan, not later prices."
- **Practise it:** M10 No Trade Is a Trade, Knowledge check: decision making

### Note de conținut
- **Widget vs prompt:**
  - `risk-reward` de azi primește doar distanțe (stop 0.50–5.00, target 0.50–12.00, pas 0.25), cu entry fix la 100.00.
  - Promptul L14 cere prețurile 49.00 / 48.00 / 51.50. Distanțele 1.00 și 2.50 se pot seta, dar widget-ul afișează 99.00 / 102.50, nu prețurile din exemplu.
  - Task-ul presupune corectura din PLAN_LEARN §9.1 (câmpuri entry / stop / target). Detalii în Cerințe.
- **Task schimbat:**
  - promptul vechi („mută target-ul la 50.50, condiția 3 cade”) devine hook-ul;
  - task-ul cere pragul (51.00 = exact 2R), adică o decizie, nu o citire.
- **Inconsecvență în diagrama `decision-tree`:**
  - nodul 3 duce pe „no” la „Adjust size or skip”;
  - caption-ul L14 spune „every other path ends in no trade”, iar cel din L13 „Any 'no' means no trade”.
  - În Flow-ul nou ramura se numește „Resize within the limit, or skip”, iar textele spun la fel peste tot (L13, L14, L17).
- **Cifre noi, verificate:**
  - graficul hook-ului: target 50.50 → 1.50 ÷ 1.00 = 1.5R, break-even 1.00 ÷ 2.50 = 40.0%;
  - B4: 2.50 ÷ 1.00 = 2.5R, break-even 1.00 ÷ 3.50 = 28.6%;
  - task: 51.00 → 2.00 : 1, break-even 33.3%;
  - B6: 47.30 < 47.40, deci condiția 2 cade.
  - Seriile de swing-uri (45.90 / 46.60 / 47.40 și 48.30 / 49.60 / 51.50) sunt noi, construite ca să respecte condiția 1.
- **Glosar:**
  - `confirmation-bias` apare în `concepts.ts` cu lessons L13 și L14, dar niciuna dintre lecții nu-l menționa. E legat acum în B3 și explicat complet în L13.
  - În `glossary.ts`, `confirmation-bias` nu are `lesson`: propun `lesson: "L13"`.
- **Nimic pierdut din lecția actuală:**
  - textul de deschidere → B1;
  - lista „What a plan contains” → B2 (market și timeframe în textul beat-ului);
  - „Make every condition checkable” → B3;
  - exemplul de playbook → B4 și B5;
  - widget-ul → hook și Try;
  - diagrama → B6;
  - pașii și textul despre Decision Quality → B7;
  - callout-ul → recap, ideile 2 și 3.
- **M10:**
  - misiunea folosește un playbook de breakout, nu de pullback, deci e un transfer: același raționament, alte condiții;
  - debriefing-ul penalizează și setup-urile valide sărite (`missed_valid_setup`), de aceea ideea 2 din recap spune explicit „All yes: trade”.

---

## L15 · Thinking in scenarios

| | |
|---|---|
| Unitate | U4 · Plan and decide, lecția 2 din 3 |
| Durată | 6 min · 7 beat-uri în Learn |
| Concepte | scenario-planning, false-breakout, gap-risk, base-rates, counterfactual-thinking |
| Termeni (glosar) | resistance, range, breakout, journal, gap |
| Se sprijină pe | L06 (suport, rezistență, breakout), L11 (R:R, break-even), L14 (plan, playbook) |
| Pregătește | Arena: breakout, Arena: false breakout, M06 (skill secundar scenario_analysis), M10 |

**Obiective**
1. Describe the bullish, bearish and sideways cases before entering a trade
2. Attach a trigger and a planned action to each case
3. Judge a scenario plan by its coverage and execution, not by its profit

### Hook
- **Tip:** predict · alegere: „Breaks out above 60.50” / „Falls below 59.00” / „Stays inside the range”
- **Figură:**
  - `Candles`: 24 de lumânări LABX într-un range între 59.00 și 60.50 (`Zone` range). Trei atingeri ale rezistenței (c7, c15, c21) și două ale suportului (c4, c12). Ultima închidere: 60.10.
  - `Level` resistance 60.50, `Level` support 59.00.
  - Văl hașurat peste următoarele 6 lumânări, dezvăluite în B4.
- **Prompt:** "LABX trades at 60.10, just under [[resistance]] at 60.50. The [[range|range floor]] is 59.00. What happens next?"
- **Răspuns:** niciun răspuns unic. Lumânările ascunse arată al patrulea drum, un false breakout: o închidere la 60.62, apoi înapoi la 60.18 și 59.80. Recap-ul arată că planul avea deja o acțiune pentru el.
- **Concept:** scenario-planning

### Learn
**B1 · explain**
> "Nobody knows what price will do next. **Scenario analysis** accepts that: instead of one prediction, you list the few plausible paths, what would show that each is happening, and what you would do. The aim is not to be right, but never to be pushed into an unplanned decision by a move you hadn't considered."

**B2 · figure** (din diagrama `breakout-false-breakout`) "Four paths from here"
- Date:
  - graficul din hook până la c24, cu `Zone` range și `Level` 60.50 / 59.00;
  - din ultima lumânare pornesc patru drumuri, desenate ca `Line` punctate:
    - A urcă peste 60.50 și rămâne deasupra, cu două închideri, până la 61.20;
    - B atinge 60.62 și revine la 59.80;
    - C coboară sub 59.00, la 58.60;
    - D oscilează între 59.40 și 60.30.
- Pași:
  1. "Bullish: two candles close above 60.50 and the breakout holds."
  2. "[[breakout|False breakout]]: one close above 60.50, then straight back into the range."
  3. "Bearish: a candle closes below the range floor at 59.00."
  4. "Sideways: price keeps moving between 59.00 and 60.50."
- **Interacțiune:** tap avansează pasul; drumul curent se aprinde, celelalte rămân la 60%.

**B3 · match** "Decide the actions now"
> "A simple frame: the idea works (**bullish**), fails (**bearish**) or nothing much happens (**sideways**); at a level, add the false breakout. Each case needs a **trigger**, an observable event, and an **action** you decide now, not when it happens. Match them for LABX at 60.10, no position."
- **Perechi:**
  - "Two candles close above 60.50" ↔ "Buy near 60.80, stop 59.90, target 62.60"
  - "One close above 60.50, then back below it" ↔ "No entry: the breakout didn't hold"
  - "A candle closes below 59.00" ↔ "Drop the long idea: no trade"
  - "Price stays between 59.00 and 60.50" ↔ "Wait inside the range"
- **Concept:** scenario-planning
- **Feedback corect:** "Every path already has an action. Whatever happens next, you are carrying out a plan, not reacting to a surprise."
- **Feedback greșit:** "That action belongs to another path. Ask what this trigger says about the idea: working, failed, false or not yet."

**B4 · reveal** "What came next"
- Date:
  - același grafic, vălul peste c25–c30;
  - c25 închide la 60.62, peste 60.50; c26 închide la 60.18; c27 la 59.80;
  - c28–c30 rămân între 59.60 și 60.10.
- **Prompt:** "Reveal the next candles. Which case is this, and what does your plan do?"
- **Variante:** „Bullish: buy near 60.80” / „False breakout: no entry” ✓ / „Bearish: no trade” / „Sideways: wait”
- **Feedback:**
  - corect: "Right. One close above 60.50, then back inside: a false breakout. The plan already said no entry, so nothing had to be decided in a hurry."
  - „Bullish”: "Only one candle closed above 60.50; the bullish trigger needs two. Buying the first close is how false breakouts catch traders."
  - „Bearish”: "Price fell back into the range, but no candle closed below 59.00."
  - „Sideways”: "Close, but price pushed above 60.50 first. That failed push is what makes it a false breakout."
- **Concept:** false-breakout

**B5 · explain** "Acceptable in every case"
> "You can estimate how likely each case is: start from how often similar setups worked in your [[journal]], and treat any estimate as judgement, not fact. What matters more is that the plan is acceptable in every case. If the bearish case would cost more than your risk limit, the trade is too big, however unlikely that case looks."

**B6 · callout** (key) "Five questions before entry"
> "Before entering, ask: What would show the idea is working? What would show it failed, and where does the stop go? What if nothing happens, and how long will I wait? Is an event due that could make price [[gap]] past my stop? It deserves its own case. Can I accept the loss in the worst plausible case?"

**B7 · predict** "Outcome versus decision"
> "Afterwards, judge the plan by whether it covered what happened and whether you followed it, not by the profit. MARKET//LAB scores **Decision Quality** and the **Simulated Outcome** separately for exactly this reason."
- **Prompt:** "Trader A followed the plan and was stopped out at −1R. Trader B bought the first close above 60.50, outside the plan, and the move ran: +2R. Who made the better decision?"
- **Control:** alegere: „Trader A” ✓ / „Trader B” / „Both equally”
- **Feedback:**
  - corect: "Right. A stop-out in a case you planned for is a plan well executed. B's win came from a path the plan said to skip: that was luck."
  - „Trader B”: "B's profit is real, but the entry broke the two-close rule. A win in a case you never planned for is luck, not skill."
  - „Both equally”: "The outcomes differ, but so do the decisions: only A followed the plan."
- **Concept:** counterfactual-thinking

### Try
- **Widget:** risk-reward, cu câmpurile entry / stop / target din PLAN_LEARN §9.1
- **Valori de start:** entry 61.40, stop 59.90 (blocat), target 62.60 (blocat) → 0.80 : 1, break-even 55.6%; prag afișat „Min 2R”
- **Obiectiv:** "The breakout is running and you're tempted to buy late at 61.40. Stop and target stay where the plan put them. Find the highest entry that still gives 2 : 1."
- **Reușită:** entry = 60.80 (R:R = 2.00, calculat în cenți); verificat la „Check”
- **Indicii:** 1. "Stop and target are fixed, so every cent higher on entry adds risk and removes reward." 2. "At 2 : 1 the reward is twice the risk. From stop to target is 62.60 − 59.90 = 2.70." 3. "Split 2.70 into one part risk and two parts reward: 0.90 and 1.80."
- **Show me:** entry-ul coboară animat de la 61.40 la 60.80; R:R 2.00 : 1; break-even 33.3%.
- **Feedback:**
  - corect: "Right. Above 60.80 the bullish case pays less than 2 : 1. That's why the plan says buy near 60.80, not wherever the breakout has run. Even at 2 : 1 it must work about one time in three to break even, before costs."
  - după o încercare greșită, peste 60.80: "At {entry} the ratio is {rr} : 1, and you'd need to win {be}% of the time just to break even. Chasing makes the bullish case worse."
  - după o încercare greșită, sub 60.80: "{entry} clears 2 : 1, but after two closes above 60.50 price may never come back there. Find the highest entry that still works."

### Check
- Întrebări: q-sa-1, q-sa-2, q-sa-4 (actuale)
- Înlocuiri propuse:
  - **q-sa-2 → q-sa-3.** Reveal-ul (B4) exersează deja exact cazul din q-sa-2 (false breakout la 60.50). Obiectivul 2, triggerul observabil, nu are altfel nicio întrebare.
  - **q-sa-1 → q-sa-6.** Scopul analizei pe scenarii (q-sa-1) e arătat de hook și recap. Obiectivul 3, judecarea planului după acoperire și execuție, nu are altfel nicio întrebare.
  - Setul propus: q-sa-3 (obiectivul 2), q-sa-4 (cazul cel mai prost acceptabil, obiectivul 1), q-sa-6 (obiectivul 3).

### Recap
- **Hook comparat:** "You predicted “{yours}”. What came was a false breakout. The plan didn't need the right guess: that case already said no entry."
- **Three things to remember:**
  1. "List the paths before entering: bullish, bearish, sideways, and the false breakout at a level."
  2. "Give each case an observable trigger and an action decided now, not in the moment."
  3. "Judge the plan by coverage and execution. A planned stop-out beats an unplanned win."
- **Practise it:** Arena: breakout, Arena: false breakout, Knowledge check: scenario analysis

### Note de conținut
- **Widget vs prompt:**
  - promptul cere prețurile 60.80 / 59.90 / 62.60;
  - widget-ul de azi nu poate reprezenta nici măcar distanța de stop 0.90, pentru că pasul e 0.25.
  - Task-ul presupune corectura din §9.1 (vezi Cerințe).
- **Task schimbat:**
  - promptul vechi cerea doar citirea raportului 2:1;
  - task-ul cere cea mai mare intrare care mai dă 2 : 1 (60.80). Asta explică de ce planul spune „buy near 60.80” și leagă lecția de FOMO (L13) și de M06.
- **Cifre verificate:**
  - 0.90 risc, 1.80 reward, 2:1, break-even 33.3%;
  - start 61.40: 1.50 risc, 1.20 reward, 0.80 : 1, break-even 55.6%;
  - 61.00 → 1.45 : 1 (40.7%); 61.10 → 1.25 : 1 (44.4%).
  - Lumânările ascunse (60.62 / 60.18 / 59.80) sunt date noi, construite pe cazul „false breakout” din exemplul lecției.
- **Glosar:**
  - azi L15 nu are niciun termen. Am legat termenii existenți `resistance`, `range`, `breakout` (cu textul „False breakout”), `journal` și `gap`.
  - Propun doi termeni noi cu `lesson: "L15"`:
    - `scenario-analysis`: "Listing the few plausible ways a trade could develop and deciding in advance what you will do in each." / plain: "A plan for every likely path, not a single guess."
    - `trigger`: "An observable event, such as a candle closing beyond a level, that shows a scenario has begun." / plain: "The sign on the chart that tells you which case you're in."
  - După adăugare, se leagă la prima apariție în B1 și B3.
- **Concepte:**
  - `base-rates` (lessons L15, L17) nu era folosit în text. E introdus în B5 („start from how often similar setups worked in your journal”), din corpul conceptului.
  - `counterfactual-thinking` e exersat în B7.
- **Nimic pierdut din lecția actuală:**
  - deschiderea → B1;
  - cadrul bull / bear / sideways cu trigger și acțiune → B3;
  - diagrama → B2;
  - exemplul de plan → B3 (perechile) și B4;
  - widget-ul → Try;
  - textul despre probabilități și cazul cel mai prost → B5;
  - cele 5 întrebări și evenimentele programate → B6;
  - „Outcome versus decision” → B7;
  - callout-ul → recap.
- **De decis:** q-sa-5 (gap peste stop la un eveniment, d3) poate înlocui q-sa-4 pentru utilizatorii care au terminat L16. Rămâne în bancă pentru check-ul de topic.

---

## L17 · Reviewing your decisions

| | |
|---|---|
| Unitate | U4 · Plan and decide, lecția 3 din 3 |
| Durată | 5 min · 6 beat-uri în Learn |
| Concepte | decision-quality, journaling, counterfactual-thinking |
| Termeni (glosar) | stop-loss, risk-per-trade, journal, win-rate |
| Se sprijină pe | L14 (plan, Flow-ul de decizie), L15 (outcome versus decision), L11 (expectancy) |
| Pregătește | M10 No Trade Is a Trade, M07 Stop or Stay? |

**Obiective**
1. Separate the quality of a decision from the trade's outcome
2. Use the journal and replay to review what you knew at each decision point
3. Turn a review into one concrete rule to keep, add or change

### Hook
- **Tip:** predict · alegere: „Trade A” / „Trade B” / „Can't tell from this”
- **Figură:** două carduri de trade, unul lângă altul, fără grafic. Rezultatul fiecăruia apare cu culoarea de rezultat (`--ml-neg` pentru A, `--ml-pos` pentru B).
- **Prompt:** "Trade A followed the playbook, risked 1% and was stopped out for −1R. Trade B had no stop, sat through −180.00 vUSD and closed at +150.00. Which was the better decision?"
- **Răspuns:** Trade A (exemplul din conceptul `decision-quality`). Comparat în recap.
- **Concept:** decision-quality

### Learn
**B1 · explain**
> "After a trade, the result is the loudest piece of information and often the least useful. One profit or loss owes a lot to chance. A useful review asks a different question: given what I knew at that moment, was the decision sound, and did I follow my plan?"

**B2 · match** "Four boxes"
> "Decision and outcome are different things, so every trade lands in one of four boxes. Match each trade to its box."
- **Perechi:**
  - "Every condition met, 1% risk, target hit at +2R" ↔ "Good decision, good outcome"
  - "Every condition met, 1% risk, stopped out at −1R" ↔ "Good decision, bad outcome"
  - "Stop moved from 48.00 to 47.00, closed at +120.00" ↔ "Bad decision, good outcome"
  - "Entered on two of three conditions, stopped out at −1R" ↔ "Bad decision, bad outcome"
- **Concept:** decision-quality
- **Text după rezolvare (≤ 60 de cuvinte):** "Good decision, good outcome: note what made it sound, so you can repeat it. Good, bad: a normal cost of trading; don't change the plan because of one result. Bad, good: the most dangerous, because the profit rewards the habit. Bad, bad: name the rule that was broken."
- **Feedback la perechile greșite probabile:**
  - „Stop moved … +120.00” ↔ Good decision, good outcome: "The profit is real, but moving the stop broke a rule. Judge the decision first, then the outcome."
  - „Every condition met … −1R” ↔ Bad decision, bad outcome: "Every rule was followed. A loss on its own doesn't make the decision bad."
  - „Two of three conditions … −1R” ↔ Good decision, bad outcome: "The playbook needs every condition. Entering on two of three was the mistake, whatever the result."

**B3 · explain** "Three scores"
> "MARKET//LAB keeps three scores apart. **Decision Quality** rates your reasoning with the information you had at the time. **Risk Discipline** checks the rules: a [[stop-loss|stop]] on every entry, risk within the limit, no widened stops, no sizing up after a loss. The **Simulated Outcome** is the profit or loss. A profitable trade can still score poorly on the first two."

**B4 · figure** (din diagrama `decision-tree`, ca `Flow` cu alegere și un nod nou de management) "A profitable mistake"
- Text: "Review with the same path you use to decide. The trade: buy 50 units at 50.00, stop at 48.00. [[risk-per-trade|Risk]]: 50 × 2.00 = 100.00 vUSD, 1% of the account, before costs. Every playbook condition was met. Choose a branch at each node."
- Date `Flow`:
  - N1 „Setup present?” → N2 „All conditions met?” → N3 „Risk defined and within the limit?” → „Enter with a stop” → N4 (nou) „Stop kept where planned?”.
  - Pe N4: „yes” → „Plan followed”; „no” → „A decision to learn from”.
  - Ramurile „no” de la N1–N3 rămân ca în L14.
  - Lângă N4 apare faptul din replay: "Price dipped towards 48.00 and the stop was moved down to 47.00 to avoid being stopped out."
- **Interacțiune:**
  - N1–N3, corect „yes” (100.00 = 1%). La „no” pe N3: "50 × 2.00 = 100.00 vUSD, exactly 1% of 10,000.00. At entry the risk was within the limit."
  - N4, corect „no”. La „yes”: "The stop moved from 48.00 to 47.00, away from price. That raised the risk above the 1% limit."
- Pași:
  1. "At entry: setup present, every condition met, 100.00 at risk. Three yeses."
  2. "Price dipped towards 48.00. The stop was moved down to 47.00."
  3. "New risk: 50 × 3.00 = 150.00 vUSD, 1.5% of the account."
  4. "Closed at 52.40: 50 × 2.40 = +120.00. The lesson is the broken rule, not the profit."

**B5 · hotspot** "What could you see?"
> "Two biases distort reviews. **Hindsight bias** makes what happened feel obvious once you know it, so replay only the candles you could see at the time. **Recency bias** gives the last few results too much weight, so look at decisions across many trades before changing a rule."
- Date:
  - `Candles`: 26 de lumânări, replay-ul trade-ului din B4. Intrare la 50.00 pe c8; coborâre până la 48.10 pe c13; revenire și ieșire la 52.40 pe c24.
  - `Level` stop la 48.00 până la c13, apoi 47.00 (treapta se vede pe grafic).
  - Niciun marker înainte de tap: utilizatorul caută singur momentul.
- **Prompt:** "The whole trade is on screen. Tap the last candle you could see when you moved the stop."
- **Țintă:** c13 (lumânarea în care stop-ul trece de la 48.00 la 47.00)
- **Feedback corect / greșit:**
  - corect: "Right. Nothing after this candle existed yet. Judge the stop move against this view: a dip towards 48.00, and no new information about the setup."
  - greșit: "That candle came later. When you moved the stop, the chart ended at the dip towards 48.00; the recovery wasn't there yet."
  - După tap, vălul acoperă c14–c26.
- **Concept:** journaling

**B6 · order** "A review routine"
> "Put the review routine in order. It ends with one line in your [[journal]]."
- **Ordinea corectă:**
  1. "Replay the trade up to your first decision point."
  2. "Note what you could see then: the setup, the conditions met, the stop and the size."
  3. "Compare the decision with your plan, condition by condition, and check Risk Discipline."
  4. "Look at alternative decisions, without treating any single path as proof."
  5. "Write one lesson: a rule to keep, add or change."
- **Concept:** journaling
- **Feedback corect:** "That's the routine. One rule per review is enough: it's the part that changes your next decision."
- **Feedback greșit:**
  - lecția nu e ultima: "The lesson comes last, after you've compared the decision with the plan."
  - alternativele înaintea comparației: "Compare with your own plan first. Alternatives only help once you know what you decided and why."
- **Câmp opțional după ordonare:** "Your rule from the trade above (optional)", cu placeholder „Never move a stop further from price.” Se salvează ca notiță la beat (§13.2 `notes`). Nu se notează.

### Try
- **Widget:** expectancy (mod task)
- **Valori de start:** win rate 50%, average win 1.5R (blocat), average loss 1.0R (blocat) → +0.25R per trade, +25R over 100 trades
- **Obiectiv:** "Your journal says this method wins 50% of trades at 1.5R and loses 1R: +0.25R per trade. Three of your last four trades lost. Find the lowest [[win-rate|win rate]] at which the method still breaks even."
- **Reușită:** win rate = 40% (expectancy 0.00R; calcul întreg: 40 × 15 − 60 × 10 = 0); verificat la „Check”
- **Indicii:** 1. "Keep the average win and loss as they are; move only the win rate." 2. "Break-even means win rate × 1.5 equals loss rate × 1." 3. "Try 40%: 0.40 × 1.5 = 0.60, and the loss rate is also 0.60."
- **Show me:** win rate-ul coboară animat de la 50% la 40%; expectancy 0.00R; over 100 trades 0R.
- **Feedback:**
  - corect: "Right. At 40% the method breaks even while losing 6 trades in 10. Three losses in four can't tell a 50% method from a 40% one: judge the method across many trades, and each trade by the plan."
  - după o încercare greșită, peste 40%: "At {win}% the method still makes {e} per trade. Lower the win rate until expectancy reaches zero."
  - după o încercare greșită, sub 40%: "At {win}% the method loses {e} per trade. Raise the win rate until expectancy is exactly zero."

### Check
- Întrebări: q-dm-4, q-dm-5, q-dm-6 (actuale, păstrate)
  - q-dm-4: decizie proastă, rezultat bun (obiectivul 1);
  - q-dm-5: decizie bună, rezultat prost (obiectivul 1);
  - q-dm-6: hindsight bias (obiectivul 2).
- Obiectivul 3 (o regulă din review) nu are întrebare în bancă. E acoperit de B6 și de câmpul opțional. De decis: o întrebare nouă q-dm-10 („Which is the most useful output of a review?”), în fișierul de întrebări.
- Alternativă: q-dm-9 (alternative decisions) în locul q-dm-6, dacă hotspot-ul din B5 e considerat suficient pentru hindsight.

### Recap
- **Hook comparat:** "You picked “{yours}”. Trade A was the better decision: it followed the plan and lost. Trade B was a poor decision with a lucky outcome."
- **Three things to remember:**
  1. "Grade the decision and the outcome separately. A profit can hide a broken rule."
  2. "Replay only what you could see at the decision point, then compare with the plan."
  3. "End every review with one rule to keep, add or change."
- **Practise it:** M10 No Trade Is a Trade, M07 Stop or Stay?, Knowledge check: decision making

### Note de conținut
- **Costurile în exemplul „A profitable mistake”:**
  - lecția spune corect „before costs”, dar cu costuri 50 de unități la 50.00 / 48.00 pierd la stop 100.00 + 1.25 + 1.20 = 102.45 vUSD, peste 1%;
  - dimensiunea după costuri ar fi 48 de unități (98.36 vUSD).
  - Am păstrat 50 de unități și mențiunea „before costs”, pentru cifre rotunde și fidelitate față de lecție. De decis dacă exemplul trece la 48 de unități: atunci risc nou 144.00, rezultat 48 × 2.40 = +115.20.
- **Flow-ul de review:**
  - diagrama `decision-tree` acoperă doar intrarea;
  - nodul nou N4 („Stop kept where planned?”) e necesar ca exemplul să aibă unde greși. Corespunde evaluatorului `no_stop_widening` și tag-ului `moved_stop_away` din M07.
- **Glosar:**
  - `journal` (L17) e legat;
  - „hindsight bias”, „recency bias” și „Decision Quality” nu au termeni. Propun `hindsight-bias` și `recency-bias` (refolosit în L18), cu `lesson: "L17"`, și `decision-quality` ca termen de aplicație.
  - Definițiile se iau din textul lecției.
- **Concepte:** `base-rates` listează L17, dar lecția nu-l folosește. Ideea e în textul B5 („look at decisions across many trades”), fără termen. De decis dacă scoatem L17 din `lessons` la `base-rates`.
- **Expectancy:** cu widget-ul de azi, break-even-ul la 40% / 1.5R / 1.0R afișează „+0.00R”, dar alte combinații afișează „−0.00R” (de exemplu 60% / 1.0R / 1.5R), din cauza semnului calculat înainte de rotunjire. Vezi Cerințe.
- **„Alternative decisions”** din pasul 4 al rutinei e vizualizarea `alternatives` din debriefing-ul misiunilor (de exemplu M07: Hold / Close early / Widen). Textul le numește la fel.
- **Nimic pierdut din lecția actuală:**
  - deschiderea → B1;
  - cele 4 combinații → B2;
  - diagrama → B4;
  - cele trei scoruri → B3;
  - pașii de review → B6;
  - exemplul → B4 (și B5 ca replay);
  - hindsight și recency → B5;
  - widget-ul → Try;
  - callout-ul → recap.

---

## Cerințe pentru widget-uri

### risk-reward (extins; folosit în L11, L14, L15)
- **Controale:**
  - trei câmpuri numerice: Entry, Stop, Target;
  - preț cu 2 zecimale, interval 1.00–999.99; acceptă virgulă sau punct;
  - pas 0.01 cu ↑ / ↓, 0.10 cu Shift.
  - Opțional, nivelurile se pot trage pe mini-grafic (`Level draggable`, snap la 0.01), sincronizate cu câmpurile.
- **Blocare din conținut:** `locked: ["entry", "stop"]` (L14) sau `["stop", "target"]` (L15). Câmpul blocat are lacăt și textul „Fixed by the setup”.
- **Ieșiri:**
  - Risk per unit și Reward per unit;
  - Reward-to-risk „x.xx : 1”;
  - Break-even win rate, cu o zecimală;
  - prag opțional din conținut (`minRR: 2`), afișat ca „Meets 2R” / „Below 2R”, cu icon și text, nu doar culoare.
- **Mini-grafic (Learn Chart Kit):** `Level` entry (accent), stop (`--ml-neg`), target (`--ml-pos`); `Bracket` risc și `Bracket` reward; gradații 1R / 2R / 3R deasupra entry-ului.
- **Validare (long only):** stop < entry < target. Altfel mesajul „Put the stop below the entry and the target above it.”, iar ieșirile se golesc.
- **Calcul:**
  - în cenți (întregi): R:R = (target − entry) ÷ (entry − stop);
  - condițiile de reușită compară valori în cenți, ca să nu apară erori de virgulă mobilă (60.80 / 59.90 / 62.60 dă exact 2.00).
- **Mod task:**
  - valori de start și câmpuri blocate din conținut;
  - condiția (`{ field: "target", equals: 51.00 }` în L14, `{ field: "entry", equals: 60.80 }` în L15);
  - feedback pe intervale (sub prag / peste prag), cu variabilele {entry}, {target}, {rr}, {be};
  - verificarea se face la butonul „Check”, nu live, ca pragul să nu se găsească urmărind doar bifa;
  - Reset și Show me (animație de 600ms; instant cu reduced motion).

### expectancy (mod task; folosit în L11, L17, L18)
- **Controale existente:** win rate 10–90%, pas 1; average win 0.5–5.0R, pas 0.1; average loss 0.5–3.0R, pas 0.1. Fiecare se poate bloca din conținut.
- **Corectură de afișare:**
  - semnul se pune după rotunjire;
  - |E| < 0.005 se afișează „0.00R”, fără semn; la fel „0R” pentru 100 de trade-uri;
  - azi 60% / 1.0R / 1.5R afișează „−0.00R”.
- **Reușită pentru L17:** win rate = 40 cu average win 1.5 și average loss 1.0, verificat în întregi (win% × win×10 = loss% × loss×10). Verificarea se face la „Check”.
- **Show me:** win rate-ul se mișcă animat până la valoarea corectă.
- Panoul de serii de pierderi, folosit în L18, e descris în U5.

### Componente de beat folosite în U4 (nu sunt widget-uri, dar task-urile se sprijină pe ele)
- **`Flow` cu alegere (L14 B6, L17 B4):**
  - noduri-întrebare cu două butoane, „Yes” / „No” (tastele Y / N sau 1 / 2), și noduri terminale;
  - ramura aleasă se aprinde (200ms), restul trec la 60%;
  - la alegerea greșită, ramura rămâne neutră, apare explicația nodului și se poate alege din nou;
  - suportă un nod suplimentar după „Enter with a stop” (N4 în L17);
  - descriere text pentru cititoarele de ecran, generată din noduri și din alegeri.
- **`match`:** 5 perechi în L14, 4 în L15 și L17. Perechile greșite au explicații proprii (vezi beat-urile); restul primesc textul general.
- **`order`:** 5 elemente în L14 și L17.
- **Câmp text opțional după un beat (L17 B6):** se salvează în `notes` cu cheia `L17:5`, nu se evaluează, nu blochează „Continue”.
