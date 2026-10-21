# U3 · Risk comes first

Unitatea „The ridge”: înainte de orice semnal, utilizatorul învață cât poate pierde, unde e greșit și câte unități rezultă de aici.

**După unitate, utilizatorul poate:**
- să fixeze riscul pe trade ca procent din contul **curent** și să-l transforme în vUSD (1R);
- să pună stop-ul unde ideea e invalidată, dincolo de zgomotul normal, nu unde pierderea pare mică;
- să calculeze câte unități cumpără din buget și distanța până la stop, cu ambele comisioane incluse;
- să calculeze raportul reward-to-risk, rata de câștig la break-even și expectancy în R;
- să deosebească riscul planificat la stop de expunerea din spatele lui și să vadă ce face levierul;
- să-și adapteze stop-ul și mărimea poziției la volatilitate, cu riscul în vUSD neschimbat.

**De ce ordinea L08 → L10 → L09 → L11 → L12 → L16:** întâi cât accepți să pierzi (L08), apoi unde ești greșit (L10), apoi câte unități rezultă din cele două (L09). Abia când riscul unui trade e clar, îl comparăm cu ce poate câștiga, pe multe trade-uri (L11), apoi cu tot ce e în joc dincolo de stop (L12), și la final cu o piață care își schimbă ritmul (L16). Fiecare lecție presupune doar ce au predat lecțiile de dinaintea ei, plus U1 (spread, comision, ordinul stop-loss, gap) și U2 (zgomot, suport).

**Concepte acoperite:** risk-per-trade, fixed-fractional-sizing, drawdown, r-multiple, invalidation-level, stop-loss-order, support-and-resistance, gap-risk, position-sizing, cost-adjusted-sizing, reward-to-risk, expectancy, exposure, leverage, correlation-and-concentration, volatility.

**Verificări pe topic:** check-risk_management, check-stop_loss, check-position_sizing, check-portfolio_exposure.

**Unit checkpoint:** test-risk_management, test-stop_loss, test-position_sizing, test-portfolio_exposure. La ≥ 80%, cele 6 lecții se marchează „Tested out” (contează la progres, fără XP de lecție).

**Misiuni de final:**
- **M04 Define Your Risk**, după L08 și L10: stop dincolo de minimul pullback-ului, risc ≤ 1% (100.00 vUSD), ipoteză scrisă.
- **M05 Size Matters**, după L09: calculul unităților din buget și stop, cu costuri, apoi ordinul cu stop-ul blocat.

### Calculele de dimensionare din unitate

Toate verificate cu `maxQtyForRisk` și `riskAmount` din `packages/engine` (comision 5 bps pe fiecare execuție, rotunjit în sus la cent; unități întregi, rotunjite în jos; plafon fără levier).

| Unde | Cont, risc | Entry → stop | Distanță | Textbook | Cu costuri | Pierdere la stop (cu costuri) | Valoare poziție |
|---|---|---|---|---|---|---|---|
| L09 B2, B4, hook | 10,000.00, 1% | 100.00 → 98.00 | 2.00 | 50 | 47 | 94.00 + 2.35 + 2.31 = 98.66 (48 u.: 100.76) | 4,700.00 |
| L09 B5 | 10,000.00, 1% | 100.00 → 96.00 | 4.00 | 25 | 24 | 96.00 + 1.20 + 1.16 = 98.36 | 2,400.00 |
| L09 Try | 10,000.00, 2% | 100.00 → 96.00 | 4.00 | 50 | 48 | 192.00 + 2.40 + 2.31 = 196.71 (49 u.: 200.81; 50 u.: 204.90) | 4,800.00 |
| L09 B6 (plafon) | 10,000.00, 1% | 100.00 → 99.50 | 0.50 | 200 | 100 (plafonat de cont) | 59.98 | 10,000.00 |
| L10 B6, Try start | 10,000.00, 1% | 50.00 → 49.50 | 0.50 | 200 | 181 | 90.50 + 4.53 + 4.48 = 99.51 | 9,050.00 |
| L10 B6, Try | 10,000.00, 1% | 50.00 → 48.00 | 2.00 | 50 | 48 | 96.00 + 1.20 + 1.16 = 98.36 | 2,400.00 |
| L10 Try (capăt) | 10,000.00, 1% | 50.00 → 48.30 | 1.70 | 58 | 57 | 99.71 | 2,850.00 |
| L16 B5 calm | 10,000.00, 1% | 50.00 → 49.40 | 0.60 | 166 | 153 | 99.41 (166 u. fără costuri: 99.60) | 7,650.00 (166 u.: 8,300.00) |
| L16 B5 volatil | 10,000.00, 1% | 50.00 → 48.20 | 1.80 | 55 | 54 | 99.86 (55 u. fără costuri: 99.00) | 2,700.00 (55 u.: 2,750.00) |
| L16 Try | 10,000.00, 1% | 50.00 → 47.60 | 2.40 | 41 | 40 | 96.00 + 1.00 + 0.96 = 97.96 (41 u.: 100.41; 153 u.: 374.68) | 2,000.00 |

---

## L08 · Risk per trade

| | |
|---|---|
| Unitate | U3 · Risk comes first, lecția 1 din 6 |
| Durată | 6 min · 7 beat-uri în Learn |
| Concepte | risk-per-trade, fixed-fractional-sizing, drawdown, r-multiple |
| Termeni (glosar) | risk-per-trade, stop-loss, spread, commission, r, notional-value, equity, invalidation, position-size, drawdown |
| Se sprijină pe | L02 (spread, comision), L04 (ordinul stop-loss) |
| Pregătește | L10, L09, M04 Define Your Risk |

**Obiective**
1. Set a maximum loss before entering a trade.
2. Convert a percentage risk limit into vUSD using the current account value.
3. Explain why small, fixed risk keeps a losing run recoverable.

### Hook
- **Tip:** predict · slider +10% … +200%, pas 10, pornește de la +10%
- **Prompt:** "Your account falls 50%, from 10,000.00 to 5,000.00. What gain do you need to get back to 10,000.00?"
- **Răspuns:** +100% (5,000.00 trebuie să câștige încă 5,000.00). Intuiția obișnuită e +50%. Comparat în recap.
- **Concept:** drawdown

### Learn
**B1 · explain**
> "Every trade can lose. [[risk-per-trade|Risk per trade]] is the amount you accept losing if price reaches your [[stop-loss]], decided before you enter and including costs such as [[spread|the spread]] and [[commission]]. It is not the value of the position. It is the slice of the account on the line if you are wrong. Traders call it [[r|1R]]."

**B2 · predict** "Risk or position value?"
- **Prompt:** "You buy 40 units of LABX at 50.00 with a stop at 48.50. Which number is your risk on this trade?"
- **Control:** alegere, 4 variante: `a` "2,000.00" · `b` "60.00, plus costs" ✓ · `c` "48.50" · `d` "1.50"
- **Reveal:** "Right. 40 × 1.50 = 60.00 before costs, 61.97 with both commissions. The 2,000.00 is the [[notional-value|position value]]: what you hold, not what you lose at the stop."
- **Feedback per variantă:**
  - `a` → "That's the position value, 40 × 50.00. At the stop you lose 40 × 1.50 = 60.00, plus costs."
  - `c` → "48.50 is the stop price, not an amount of money. The loss is 40 units × 1.50 per unit."
  - `d` → "1.50 is the loss per unit. You hold 40 units, so 40 × 1.50 = 60.00, plus costs."

**B3 · explain** (cu figură `Formula`)
> "Most risk rules are written as a percentage of the account. Missions allow 1% per trade and the Arena 2%. On a 10,000.00 vUSD account, 1% is 100.00. The **Risk Discipline** score checks that every entry has a stop and that the planned loss stays within the limit."

- Date: `Formula` cu trei cutii: [10,000.00 account] × [1% limit] = [100.00 budget]; dedesubt, al doilea rând [× 2%] = [200.00].
- Pași:
  1. "Start from the account: 10,000.00."
  2. "Missions: × 1% = 100.00. That is your 1R."
  3. "Arena: × 2% = 200.00, the most you may risk there."

**B4 · worked** "Turning a percentage into vUSD"
- Linii:
  1. "Account: 10,000.00 vUSD. Risk limit: 1%."
  2. "Budget: 10,000.00 × 1% = 100.00 vUSD."
  3. "After a few losses the account is 9,500.00 vUSD."
  4. "New budget: 9,500.00 × 1% = ?"
- **Ultimul pas îl calculează utilizatorul:** 95.00 vUSD (toleranță 0.01)
- **Rezultat:** "Because the rule is a percentage, the budget shrinks after losses and grows after gains, with no extra decision."
- **Feedback corect / greșit:** "Right. 1% of the current [[equity|account value]] is 95.00. A smaller account risks less, automatically." / la 100: "That's 1% of the starting account. The limit follows what the account is worth now: 9,500.00 × 1%." / altfel: "Multiply the current account by the limit: 9,500.00 × 0.01."

**B5 · order** "Before any trade"
- **Prompt:** "Put these four steps in the order you take them, before any trade."
- **Elemente (ordinea corectă):**
  1. "Write down your limit as a percentage: 1% in missions, at most 2% in the Arena."
  2. "Convert it to vUSD using the current account value."
  3. "Find the [[invalidation]] price, where the idea is wrong. The stop goes there."
  4. "[[position-size|Size the position]] so a stop-out, costs included, fits the budget."
- **Feedback corect:** "Right. Risk first, then the stop, then the size. If even a small position breaks the limit, there is no trade. The next lesson covers the stop; the one after, the size."
- **Feedback greșit:** "The size comes last. It follows from the budget and the stop, never the other way round."

**B6 · figure** (din diagrama `loss-recovery`)
- Date: `Bars`, 3 perechi construite pe rând; pierderea sub axă (`--ml-neg`), câștigul necesar deasupra (`--ml-pos`): −10% / +11.1%, −20% / +25%, −50% / +100%. Axa la 0.
- Pași:
  1. "A [[drawdown]] is a fall from the account's peak. −10% leaves 9,000.00; getting back needs +11.1%."
  2. "−20% needs +25%. The gain is earned on a smaller account."
  3. "−50% needs +100%. Keep each loss small and a losing run stays shallow."
- **Interacțiune:** pașii avansează la tap sau Space. Fără slider aici: slider-ul de drawdown e în Try.

**B7 · predict** "Ten losses in a row"
- **Prompt:** "Ten losing trades in a row, each risking 5% of the current account. Roughly what is left of 10,000.00?"
- **Control:** alegere: `a` "About 5,000.00" · `b` "About 6,000.00" ✓ · `c` "About 9,000.00"
- **Reveal (linii):**
  1. "At 5% per trade: 10,000.00 → 5,987.37 (−40.1%). To recover: about +67.0%."
  2. "At 1% per trade: 10,000.00 → 9,043.82 (−9.6%). To recover: about +10.6%."
- **Rezultat:** "The same run of losses is a setback at 1% and a serious hole at 5%."
- **Feedback per variantă:**
  - `a` → "Each loss is 5% of what is left, not of 10,000.00, so ten of them take 40.1%. Still a deep hole."
  - `c` → "That is close to the 1% case. At 5% per trade, ten losses take about 40% of the account."

### Try
- **Widget:** loss-recovery
- **Controale în task:** slider Drawdown (1–90%, pas 1), butonul Check, Reset, Show me. Ieșiri vizibile: Left of the account, Gain needed to recover, Losing trades of 1% to get there.
- **Valori de start:** drawdown −5% (Gain needed +5.3%, 6 losing trades of 1%)
- **Obiectiv:** "Find the deepest drawdown you could still recover from with a gain of 25% or less."
- **Reușită:** drawdown = 20% exact (Gain needed = +25.0%; la −21% ar fi +26.6%).
- **Indicii:** 1. "Increase the drawdown until the gain needed passes +25%, then step back." 2. "Gain needed = loss ÷ what is left. You want that ratio to be 0.25." 3. "At −20%, 80% is left: 20 ÷ 80 = 0.25, exactly +25%."
- **Show me:** sliderul se animă la −20%: Left 80%, Gain needed +25.0%, 23 losing trades of 1% in a row.
- **Feedback:** corect "Right. −20% needs +25.0%; −21% would need +26.6%. At 1% per trade, it takes 23 losses in a row to fall that far." / sub țintă (gain needed < 25%) "That works, but you can go deeper and still need +25% or less." / peste țintă "At that depth the gain needed is over +25%. Step back a little."

### Check
- Întrebări (implicit, din lecția actuală): q-rm-1, q-rm-2, q-rm-3
- **Înlocuire propusă:** q-rm-2 → **q-rm-11**. Motiv: q-rm-2 și q-rm-3 testează amândouă obiectivul 2 (procent din contul curent), pe care B4 îl exersează deja; obiectivul 3 (recuperarea după drawdown) nu e testat deloc. q-rm-11 (10,000.00 → 7,000.00, +42.9%) îl acoperă, cu alte cifre decât hook-ul și task-ul. q-rm-2 rămâne în pool-ul de recapitulare și în test-risk_management.
- **Set final:** q-rm-1 (obiectivul 1), q-rm-3 (obiectivul 2), q-rm-11 (obiectivul 3)

### Recap
- **Hook comparat:** "You guessed +{yours}%. From 5,000.00, getting back to 10,000.00 takes +100%: the gain is earned on half the account."
- **Three things to remember:**
  1. "Decide your maximum loss before you enter. That amount, costs included, is 1R."
  2. "Set it as a percentage of the current account: 1% of 9,500.00 is 95.00."
  3. "Losses compound: −50% needs +100%. Small, fixed risk keeps a losing run recoverable."
- **Practise it:** M04 Define Your Risk · Risk calculator (`/arena/risk-calculator`) · Knowledge check: risk management (`/learn/checks/check-risk_management`)

### Note de conținut
- **Cifre verificate:** 10,000.00 × 0.99¹⁰ = 9,043.82 (−9.56%, recuperare +10.57%); 10,000.00 × 0.95¹⁰ = 5,987.37 (−40.1%, recuperare +67.02%); loss-recovery 11.1 / 25 / 100%; B2: 40 × 1.50 = 60.00, plus comision 1.00 (2,000.00 × 0.05%) și 0.97 (1,940.00 × 0.05%) = 61.97. Task: −5% → +5.3% și 6 pierderi; −20% → +25.0% și 23 de pierderi; −21% → +26.6%.
- **Hook și task:** sarcina din PLAN §9.1 („How big a drawdown needs a 100% gain?”, răspuns 50%) ar repeta hook-ul. Hook-ul păstrează intuiția greșită clasică (−50% → +50%), iar task-ul cere pragul invers, −20% ↔ +25%, cu a treia ieșire a widget-ului (23 de pierderi de 1%) legată de obiectivul 3.
- **Callout-ul final** de azi („Decide your maximum loss before you enter…”) nu mai e beat separat (limita de 7): ideea trece în feedback-ul ordonării (B5) și în ideile-cheie 1 și 2.
- **Pasul 5** din lista de azi („If even a small position would break the limit, there is no trade”) nu e un pas de ordonat; trece în feedback-ul corect de la B5.
- **Trimiteri:** B5 anunță stop-ul în lecția următoare (L10) și mărimea după ea (L09), conform noii ordini. Exemplul „ten losses” devine predict (B7), cu intuiția „10 × 5% = 50%”.
- **Glosar:** `drawdown` are azi `lesson: "L18"`, dar termenul e introdus aici (U3 vine înaintea U5); propun `lesson: "L08"`. `equity` nu are lecție; propun L08. De legat: `notional-value` apare prima dată ca „position value” în B2 (lecția lui rămâne L12).
- **Practise it:** linkurile sunt cele de azi. Propun și „Knowledge check: stop-loss” în L10 și „Knowledge check: position sizing” în L09, ca toate cele 4 verificări ale unității să fie legate dintr-o lecție.

---

## L10 · Where a stop belongs

| | |
|---|---|
| Unitate | U3 · Risk comes first, lecția 2 din 6 |
| Durată | 6 min · 7 beat-uri în Learn |
| Concepte | invalidation-level, stop-loss-order, support-and-resistance, gap-risk |
| Termeni (glosar) | stop-loss, market-order, gap, invalidation, support, unit, risk-per-trade |
| Se sprijină pe | L08 (bugetul de risc), L04 (ordinul stop-loss, gap), L05 (zgomot), L06 (suport) |
| Pregătește | L09, M04 Define Your Risk, M07 Stop or Stay? |

**Obiective**
1. Place a stop where the trade idea is invalidated.
2. Tell a stop inside normal noise from one beyond a meaningful level.
3. Adjust the position size, not the stop, to keep risk within the limit.

### Hook
- **Tip:** predict · tap pe grafic: 4 niveluri candidate, 49.50, 48.40, 48.00 și 45.00 (aceleași date ca figura B3, fără etichete de rol)
- **Prompt:** "You bought LABX at 50.00 because support at 48.40 held. A normal candle moves about 0.40. Tap where your stop belongs."
- **Răspuns:** 48.00: dincolo de suport, cu o lumânare normală ca buffer. Alegerile tipice sunt 49.50 („pierdere mică”) și 48.40 („exact pe suport”). Comparat în recap.
- **Concept:** invalidation-level

### Learn
**B1 · explain**
> "You met the [[stop-loss]] order in Unit 1. Its job is not to prevent every loss. It gets you out when the reason for the trade no longer holds, at a cost you accepted before you entered. It is not a guaranteed price: once touched it becomes a [[market-order|market order]], and a [[gap]] through it fills at the open."

**B2 · explain**
> "Ask what price would have to do to prove the idea wrong. That is the [[invalidation]] point. If you bought because [[support]] held, the idea is wrong once price breaks clearly through it. The stop goes just beyond that point, with a small buffer for noise, not at a round number or at a loss that feels comfortable."

**B3 · figure** (din diagrama `stop-placement`)
- Date: `Candles`, 14 lumânări de 1h: range 48.40–49.80 în lumânările 1–9, cu minime pe suport la 48.45 (lumânarea 3) și 48.42 (lumânarea 8); apoi urcare până la închiderea 50.00 pe lumânarea 14. Minimele lumânărilor 10–14: 49.45, 49.60, 49.38, 49.55, 49.62 (oscilații normale de ~0.40). `Level` support 48.40 (rol support). `Level` entry 50.00. `Zone` „normal swings” 49.38–50.00 (`--ml-accent-2`, 12%). `Level` stop 49.50 (rol stop, eticheta „too tight”). `Level` stop 48.00 (rol stop, eticheta „beyond the level”). `Bracket` 48.40 → 48.00, „buffer 0.40”.
- Pași:
  1. "Support: price turned up from 48.40 twice."
  2. "A stop at 49.50 sits inside the normal swings. Noise alone can reach it."
  3. "At 48.00, one normal candle beyond support, it is hit only if support breaks."
- **Interacțiune:** după pasul 3, stop-ul se poate trage (`draggable`, snap 0.01, săgeți ±0.01). Eticheta se schimbă live: ≥ 49.38 „inside the noise”; 48.41–49.37 „above support: the idea still holds”; 48.31–48.40 „on the level: easily tested”; 48.00–48.30 „beyond the level”; < 48.00 „more room than the idea needs”.

**B4 · match** "Four ways to misplace a stop"
- **Prompt:** "Match each stop to what goes wrong with it."
- **Perechi:**
  - "Too tight" ↔ "Inside the normal back-and-forth, so noise stops out a sound idea."
  - "Arbitrary" ↔ "Set by a round number or a fixed amount, not by the chart."
  - "Exactly on the level" ↔ "Obvious levels get tested briefly, so it is easily hit."
  - "Missing" ↔ "No stop at all, so the possible loss has no limit."
- **Feedback la final:** "All four cut the link between the stop and the idea. The stop belongs where the idea fails."

**B5 · explain**
> "A stop placed by logic will sometimes be far from the entry. That's fine. Don't move the stop to suit the size you wanted; change the size to suit the stop. A wider stop means fewer [[unit|units]] for the same [[risk-per-trade|risk]] in vUSD. The next lesson shows how to calculate it. For now, watch what happens."

**B6 · predict** "Same risk, two stops"
- **Prompt:** "Stop A at 49.50 is 0.50 below the 50.00 entry. Stop B at 48.00 is 2.00 below. Both risk about 100.00. How many units does B allow?"
- **Control:** alegere: `a` "Four times as many as A" · `b` "The same as A" · `c` "About a quarter of A" ✓ · `d` "None: B is too risky"
- **Reveal:** "A allows 181 units, B 48, after commissions. Both lose under 100.00 at the stop: 99.51 and 98.36. B just gives the idea room to be right."
- Figură în reveal: `Bars` cu două perechi: unități 181 / 48 și pierdere la stop 99.51 / 98.36.
- **Feedback per variantă:**
  - `a` → "Each unit of B can lose four times as much, so fewer units fit in the same 100.00."
  - `b` → "Keeping A's 181 units with B's stop would lose 362.00 plus costs, not 100.00."
  - `d` → "Risk is size times distance, not distance alone. Sized to fit, B risks the same 100.00."

**B7 · callout** (warning)
> "Never widen a stop once a trade is open. Moving it further away raises the risk you agreed to, and MARKET//LAB counts it against your Risk Discipline. If the stop is hit, either the idea was wrong or the noise was bigger than planned. Both are lessons for the next plan."

### Try
- **Widget:** position-size (mod `units: "auto"`, cu rigla de preț)
- **Controale în task:** Account, Risk per trade și Entry blocate; Stop editabil (câmp și nivel tras pe riglă). Rândul „Textbook size (no costs)” ascuns în L10. Rigla arată `Level` support 48.40 și cardul „Normal candle ≈ 0.40”. Rând fix de comparație: „Start, stop 49.50: 181 units · loss 99.51”.
- **Valori de start:** account 10,000, risk 1%, entry 50.00, stop 49.50 (181 units, loss if stopped 99.51, position value 9,050.00 · 90.50%)
- **Obiectiv:** "Support is at 48.40 and a normal candle moves about 0.40. Move the stop to where the idea fails, plus a buffer, and watch what happens to the size."
- **Reușită:** 48.00 ≤ stop ≤ 48.30, celelalte valori neschimbate. (Size including costs între 48 și 57 de unități; loss if stopped între 98.36 și 99.86, mereu ≤ 100.00.)
- **Indicii:** 1. "Go lower. The idea fails below 48.40, so the stop belongs under it." 2. "Leave a buffer of up to one normal candle, 0.40, below support." 3. "48.40 − 0.40 = 48.00. Any stop from 48.00 to 48.30 works."
- **Show me:** stop-ul coboară animat la 48.00: 48 units, loss if stopped 98.36, position value 2,400.00 · 24.00%.
- **Feedback:** corect "Done. The stop now sits beyond support. The size fell sharply from 181 units, yet the loss if stopped is still under 100.00." / stop ≥ 48.40 "That stop is still above support, inside the noise. Price can reach it while the idea still holds." / 48.30 < stop < 48.40 "Just under the level is where brief tests reach. Leave more of a buffer." / stop < 48.00 "That protects you, but it's further than the idea needs. One normal candle below 48.40 is enough."

### Check
- Întrebări (implicit, din lecția actuală): q-sl-1, q-sl-2, q-sl-3
- **Înlocuire propusă:** q-sl-2 → **q-sl-4**. Motiv: q-sl-2 cere calculul unităților (100.00 ÷ 1.20 = 83), adică formula din L09, care vine acum după L10. q-sl-4 (stop exact pe un nivel evident) testează obiectivul 2, neacoperit de setul de azi. q-sl-2 rămâne în test-stop_loss și e un exercițiu bun de recapitulare după L09.
- **Set final:** q-sl-1 (obiectivul 1), q-sl-4 (obiectivul 2), q-sl-3 (obiectivul 3)

### Recap
- **Hook comparat:** "You picked {yours}. The idea fails below support at 48.40, so the stop belongs just beyond it: about 48.00."
- **Three things to remember:**
  1. "Put the stop where the idea is proven wrong, plus a small buffer, not where the loss feels small."
  2. "A stop inside normal noise gets hit while the idea still holds. Go beyond the level."
  3. "Keep the stop where it belongs and change the size: a wider stop means fewer units."
- **Practise it:** M04 Define Your Risk · M07 Stop or Stay? · Risk calculator (`/arena/risk-calculator`)

### Note de conținut
- **Trimiteri după noua ordine:** exemplul de azi „Same risk, two stops” calcula 100.00 ÷ 0.50 = 200 și 100.00 ÷ 2.00 = 50, adică formula din L09. În L10 rămân doar rezultatele (181 și 48 de unități, după costuri), ca teaser: B5 anunță că formula vine în lecția următoare, iar Try ascunde rândul „Textbook size”. Obiectivul 3 rămâne neschimbat: nu cere formula, doar direcția (stop mai larg → mai puține unități).
- **Cifre verificate cu motorul:** 49.50 → 181 de unități, pierdere 90.50 + 4.53 + 4.48 = 99.51; 48.00 → 48 de unități, 96.00 + 1.20 + 1.16 = 98.36; 181 × 2.00 = 362.00 (feedback `b` la B6). Intervalul de reușită 48.00–48.30 dă 48–57 de unități, toate sub buget.
- **Bufferul:** „până la o lumânare normală (0.40)” vine din q-sl-7 („normal candles move about 0.40… at about 48.00”). M04 folosește `swingLow − 0.25 × ATR`; un stop la 48.30 e exact `48.40 − 0.25 × 0.40`, deci intervalul acoperă ambele reguli.
- **Gap-ul** e scurtat în B1: e predat în L04 și revine în L12 (B6) și L16 (B6).
- **Paragraful „A stop is not a guaranteed price”** de azi e comprimat în B1; callout-ul de azi devine B7, neschimbat.
- **M04 afișează cardul „Average candle range (ATR 14)”**, dar ATR se predă abia în L16. În L10 folosesc „a normal candle moves about 0.40”. De decis: M04 leagă cardul la glosar (`atr`), ca tooltip-ul să explice termenul înainte de L16.
- **Concepte:** `trailing-stop` are `lessons: ["L10"]`, dar L10 nu îl predă. Propun scoaterea lui L10 din listă (fără conținut nou). `gap-risk` ar trebui să includă și L12, L16.
- **q-sl-7** (d3) folosește și ea 100.00 ÷ 2.00 = 50; rămâne în test-stop_loss, dar coada de recapitulare n-ar trebui s-o programeze înainte ca L09 să fie făcută.

---

## L09 · Sizing a position from the stop

| | |
|---|---|
| Unitate | U3 · Risk comes first, lecția 3 din 6 |
| Durată | 7 min · 7 beat-uri în Learn |
| Concepte | position-sizing, fixed-fractional-sizing, cost-adjusted-sizing |
| Termeni (glosar) | position-size, commission, ask, notional-value, buying-power, leverage, equity, unit |
| Se sprijină pe | L08 (bugetul de risc), L10 (unde stă stop-ul), L02 (ask, comision) |
| Pregătește | M05 Size Matters, M04 Define Your Risk, L11 |

**Obiective**
1. Calculate position size from a risk budget and the distance to the stop.
2. Adjust the size for commission so the loss at the stop stays within budget.
3. Explain why a wider stop means fewer units rather than more risk.

### Hook
- **Tip:** predict · slider 1–200 units, pas 1, pornește de la 1
- **Prompt:** "Your account is 10,000.00 and you accept losing 1% on this trade. You buy LABX at 100.00 with the stop at 98.00. How many units do you buy?"
- **Răspuns:** 50 (textbook); 47 cu comisioane. Greșelile tipice: 100 (contul ÷ preț) și 1 („investesc 1%”). Comparat în recap.
- **Concept:** position-sizing

### Learn
**B1 · explain**
> "Many beginners pick a size first, say a round 100 [[unit|units]], then place the stop wherever the loss feels bearable. That is backwards. In the last lesson the stop went where the idea is proven wrong. Now the [[position-size|size]] is what you adjust, so that being wrong costs a fixed, small share of the account."

**B2 · figure** (din diagrama `position-size-formula`)
- Date: în stânga, mini-grafic cu `Level` entry 100.00, `Level` stop 98.00 și `Bracket` „2.00 per unit”. În dreapta, `Formula` cu trei cutii: [100.00 risk budget] ÷ [2.00 distance to stop] = [? units].
- Pași:
  1. "Risk budget: 1% of 10,000.00 = 100.00."
  2. "Distance to the stop: 100.00 − 98.00 = 2.00 per unit."
  3. "Divide the budget by the distance and round down to whole units. Type the result."
  4. "50 units × 100.00 = 5,000.00 of LABX. At the stop it loses 100.00, before costs."
- **Interacțiune:** input numeric pe pasul 3 (50, toleranță 0); pasul 4 apare după răspuns.
- **Feedback la input:** corect "Right. 100.00 ÷ 2.00 = 50 units." / la 100 "100 units is the whole account at 100.00. Divide the risk budget, not the account." / la 1 "1 unit costs 100.00, but the budget is what you lose, not what you spend. Divide it by the distance." / altfel "Budget ÷ distance: 100.00 ÷ 2.00."

**B3 · explain**
> "The textbook formula ignores costs. In MARKET//LAB you pay 0.05% [[commission]] on entry and again on exit, so each unit can lose a little more than the distance to the stop. The spread is already counted, because you buy at the [[ask]]. Add the commission per unit to the distance, then divide again."

**B4 · worked** "Cost-adjusted size"
- Linii:
  1. "Commission per unit at entry: 0.05% × 100.00 = 0.05."
  2. "At the stop: 0.05% × 98.00 = 0.049."
  3. "Loss per unit: 2.00 + 0.05 + 0.049 = 2.099."
  4. "Units: 100.00 ÷ 2.099 ≈ 47.64, rounded down: ?"
  5. (după răspuns) "Check, fees rounded up per fill: 47 units lose 94.00 + 2.35 + 2.31 = 98.66. 48 would lose 100.76."
- **Ultimul pas îl calculează utilizatorul:** units = 47 (toleranță 0)
- **Rezultat:** "47, not 50: the costs take three units."
- **Feedback corect / greșit:** "Right. 47 units fit; a 48th would go over by 0.76." / la 48 "That rounds to the nearest. 48 units lose 100.76 at the stop, over the 100.00 budget. Round down." / la 50 "50 ignores the costs. Divide by 2.099, not 2.00."

**B5 · predict** "A wider stop"
- **Prompt:** "Same entry, 100.00, but the stop that proves you wrong is at 96.00. The budget is still 100.00. How many units, before costs?"
- **Control:** input numeric, unități (1–200)
- **Răspuns:** 25 (toleranță 0)
- **Reveal:** "100.00 ÷ 4.00 = 25 units, 24 after costs. Twice the distance, half the units. The loss at the stop stays within budget: 98.36 with 24 units. A wider stop means fewer units, not more risk."
- **Feedback:** la 50 "Keeping 50 units with a 4.00 stop would lose 200.00, double the budget." / la 100 "Twice the distance doesn't double the units: it halves them."

**B6 · explain**
> "Two more limits. A bigger budget buys more units for the same stop: the Arena allows 2%, 200.00, so a 4.00 stop gives 50 units before costs. And [[buying-power|buying power]] sets a ceiling: with no [[leverage]], [[notional-value|position value]] can't exceed [[equity]]. At 100.00 you can hold at most 100 units, whatever the formula says."

**B7 · callout** (key)
> "Stop first, size second. If the size feels too small, don't pull the stop closer to fit more units: a stop inside the noise is easily hit. Accept the smaller size, or skip the trade."

### Try
- **Widget:** position-size (mod `units: "learner"`)
- **Controale în task:** Account, Risk per trade, Entry și Stop blocate. Câmp nou „Units” (întreg ≥ 0), editabil. Ieșiri vizibile: Risk budget, Distance to stop, Loss if stopped (pentru unitățile introduse, cu „within budget” sau „over by X”), Position value. „Textbook size” și „Size including costs” ascunse până la reușită sau Show me.
- **Valori de start:** account 10,000, risk 2%, entry 100.00, stop 96.00, units gol
- **Obiectiv:** "Arena rules: risk 2% of 10,000.00. You buy at 100.00 with the stop at 96.00. Enter the most units whose loss at the stop, commissions included, stays within budget."
- **Reușită:** units = maxQtyForRisk(...).qty = **48** (loss if stopped 196.71 ≤ 200.00; 49 ar pierde 200.81).
- **Indicii:** 1. "Start from the budget: 2% of 10,000.00 is 200.00, and the stop is 4.00 away." 2. "Units = budget ÷ (distance + commission per unit), rounded down." 3. "Commission per unit: 0.05 at entry plus 0.048 at the stop. 200.00 ÷ 4.098 ≈ 48.8."
- **Show me:** câmpul Units se completează cu 48: loss if stopped 196.71 (within budget), position value 4,800.00 · 48.00%; apar rândurile Textbook 50 și Size including costs 48.
- **Feedback:** corect "Right. 48 units lose 196.71 at the stop, costs included. A 49th would take it to 200.81, just over the limit." / la 50 "50 is the textbook size. With both commissions it would lose 204.90, over the 200.00 budget." / la 49 "Close. 49 units lose 200.81 at the stop, 0.81 over. Round down." / sub 48 "That fits the budget, but one more unit still would. Find the largest size that stays within 200.00." / peste 50 "That size loses well over 200.00 at the stop. Start from the budget and the distance."

### Check
- Întrebări (implicit, din lecția actuală): q-ps-1, q-ps-3, q-ps-4
- **Înlocuiri propuse** (motiv comun: setul de azi repetă exact cifrele lecției, deci măsoară memoria cifrelor, nu transferul):
  - q-ps-1 → **q-ps-6**: q-ps-1 (100.00 / 98.00 → 50) e identică cu hook-ul și cu figura B2; q-ps-6 cere aceeași regulă la 2% și stop 95.00 (40 de unități).
  - q-ps-3 rămâne doar cu `vary` activ (altă intrare și alt stop): fără variație e identică cu B4. Dacă `vary` nu e gata la E4, varianta de rezervă e **q-ps-9** (de ce mărimea cu costuri e mai mică).
  - q-ps-4 → **q-ps-5**: q-ps-4 e exact predicția B5 (2.00 → 4.00, jumătate din unități); q-ps-5 (vrei 50 de unități, stop-ul permite 20) testează obiectivul 3 ca decizie.
- **Set final:** q-ps-6 (obiectivul 1), q-ps-3 cu `vary` / q-ps-9 (obiectivul 2), q-ps-5 (obiectivul 3)

### Recap
- **Hook comparat:** "You guessed {yours} units. The rule gives 50: 100.00 ÷ 2.00. With commission on both fills, 47."
- **Three things to remember:**
  1. "Units = risk budget ÷ distance to the stop, rounded down to a whole number."
  2. "Add both commissions to the distance per unit: 100.00 ÷ 2.099 gives 47 units, not 50."
  3. "A wider stop means fewer units, not more risk: the loss at the stop stays within budget."
- **Practise it:** M05 Size Matters · M04 Define Your Risk · Risk calculator (`/arena/risk-calculator`)

### Note de conținut
- **Corectură de cifre:** lecția de azi verifică „47 × 2.099 = 98.653” și „48 × 2.099 = 100.752”. Simulatorul (și widget-ul) rotunjește comisionul **în sus la cent, pe fiecare execuție** (`commission()` din `units.ts`): 4,700.00 × 0.05% = 2.35 și 4,606.00 × 0.05% = 2.303 → 2.31, deci 47 de unități pierd **98.66**, iar 48 pierd **100.76** (2.40 + 2.352 → 2.36). Concluzia (47) nu se schimbă; linia de verificare din B4 folosește acum cifrele pe care le afișează widget-ul. Formula per unitate (2.099) rămâne, ca aproximare pentru calcul de mână.
- **Alte cifre verificate:** 96.00 → 25 / 24 de unități, pierdere 98.36; Arena 2%, 96.00 → 50 / 48, pierdere 196.71 (49: 200.81; 50: 204.90); plafonul: la 100.00 și stop 99.50 formula dă 200, contul permite 100 (`cappedByBuyingPower`).
- **Trimiteri după noua ordine:** B1 se sprijină explicit pe L10 („In the last lesson the stop went where the idea is proven wrong”), iar callout-ul („a stop inside the noise”) se bazează pe B3 din L10, deja parcurs. Nimic din L09 nu mai trebuie predat „înainte” în L10.
- **Exemplul „Textbook size”** de azi e păstrat în figura B2 (buget, distanță, 50 de unități, 5,000.00). Prompt-ul interactiv de azi (compară cele două mărimi, apoi mută stop-ul la 96.00) e acoperit de B4 și B5; Try-ul cere aplicarea pe cifre noi (Arena, 2%), ca să nu repete B4.
- **Punctele de azi** (stop mai larg, buget mai mare, plafonul contului) sunt în B5 și B6, cu aceleași cifre.
- **M05 – întrebarea de reflecție** („Why is the cost-aware size smaller…? spread / commission / both”): în `maxQtyForRisk` intrarea e deja ask-ul, deci diferența textbook ↔ cost-aware vine doar din comisioane (spread-ul e în distanță). L09 și q-ps-9 spun „commission”. De verificat dacă debrief-ul M05 tratează „Both” ca răspuns bun; ar trebui să fie „commission”.
- **Glosar:** `notional-value` (lecția L12) apare aici ca „position value” în B2 și B6; `buying-power` (L12) e legat în B6. `basis-point` nu e folosit.

---

## L11 · Reward-to-risk and expectancy

| | |
|---|---|
| Unitate | U3 · Risk comes first, lecția 4 din 6 |
| Durată | 7 min · 7 beat-uri în Learn |
| Concepte | r-multiple, reward-to-risk, expectancy |
| Termeni (glosar) | r, r-multiple, take-profit, reward-to-risk, win-rate, expectancy |
| Se sprijină pe | L08 (1R), L09 (riscul unei poziții, în vUSD), L04 (take-profit) |
| Pregătește | L14, L15, L17, L18 |

**Obiective**
1. Calculate a reward-to-risk ratio and its break-even win rate.
2. Estimate expectancy in R from a win rate and the average win and loss.
3. Explain why a single result says little about a method.

### Hook
- **Tip:** predict · alegere, 3 variante: "Method A" · "Method B" · "They come out even"
- **Prompt:** "Two methods, 100 trades each. Losses are always −1R. Method A wins 70% of trades at +0.4R. Method B wins 40% at +2R. Which has the better average result?"
- **Răspuns:** Method B (+0.20R pe trade, +20R la 100; A: −0.02R, −2R). Intuiția greșită: rata de câștig mai mare câștigă. Comparat în recap.
- **Concept:** expectancy

### Learn
**B1 · explain**
> "Measuring results in [[r|R]] makes trades comparable. R is the amount you risked: the distance to the stop times the units, plus costs, which is exactly what you sized in the last lesson. Risk 100.00 and make 200.00, and the result is [[r-multiple|+2R]]. A loss at the stop is −1R, whatever the position size."

**B2 · figure** (din diagrama `risk-reward`)
- Date: `Level` entry 100.00, `Level` stop 98.00, `Level` target 104.00; `Bracket` 98.00–100.00 „Risk 1R”; `Bracket` 100.00–104.00 „Reward 2R”.
- Pași:
  1. "Entry 100.00, stop 98.00. The 2.00 between them is your risk: 1R."
  2. "[[take-profit|Target]] 104.00, 4.00 away. The reward is 2R."
  3. "The [[reward-to-risk|reward-to-risk ratio]] compares the two distances: 4.00 ÷ 2.00 = 2:1."
  4. "Break-even: 2 ÷ (2 + 4) ≈ 33%. Drag the target: 1:1 needs 50%, 3:1 only 25%."
- **Interacțiune:** după pasul 4, target-ul se trage (snap 0.01, săgeți ±0.10); R:R și break-even se actualizează live (102.00 → 1:1, 50%; 106.00 → 3:1, 25%).

**B3 · worked** "From prices to a ratio"
- Linii:
  1. "Entry 50.00, stop 49.00, target 52.00."
  2. "Risk per unit: 50.00 − 49.00 = 1.00. Reward per unit: 52.00 − 50.00 = 2.00."
  3. "Reward-to-risk: 2.00 ÷ 1.00 = 2:1."
  4. "Break-even [[win-rate|win rate]]: 1.00 ÷ (1.00 + 2.00) = ?"
- **Ultimul pas îl calculează utilizatorul:** 33.3% (toleranță 0.1)
- **Rezultat:** "At 2:1 the trade must work more than one time in three just to break even, before costs."
- **Feedback corect / greșit:** "Right. 1.00 ÷ 3.00 = 33.3%. Win less often than that and the trade loses on average, before costs." / la 50 "50% is 1.00 ÷ 2.00, risk over reward. Divide the risk by risk plus reward: 1.00 ÷ 3.00." / la 66.7 "That is the loss rate at break-even. The win rate is 1.00 ÷ 3.00."

**B4 · explain** (cu figură `Formula`)
> "A higher ratio lowers the break-even rate, but a distant target that price rarely reaches is no better than a closer one it often reaches. [[expectancy|Expectancy]] puts both sides together: the average result per trade, in R. Positive means the method made money on average over a sample; negative means it lost, however good some trades felt."

- Date: `Formula` [0.40 × 2R] − [0.60 × 1R] = [+0.20R], cutiile se aprind pe rând.
- Pași:
  1. "Wins: win rate × average win. 0.40 × 2R = 0.80R."
  2. "Losses: loss rate × average loss. 0.60 × 1R = 0.60R."
  3. "Expectancy: 0.80R − 0.60R = +0.20R per trade."

**B5 · worked** "Three methods, before costs"
- Linii:
  1. "A: wins 40% at +2R, so 0.40 × 2 − 0.60 × 1 = +0.20R. Per 100 trades: +20R."
  2. "B: wins 60% at +0.8R, so 0.60 × 0.8 − 0.40 × 1 = +0.08R. Per 100 trades: +8R."
  3. "C: wins 70% at +0.4R, so 0.70 × 0.4 − 0.30 × 1 = ?"
- **Ultimul pas îl calculează utilizatorul:** −0.02R (toleranță 0.005)
- **Rezultat:** "C loses 2R per 100 trades. The method that wins most often is the only one that loses."
- **Feedback corect / greșit:** "Right. 0.28 − 0.30 = −0.02R, despite winning 7 trades in 10." / la +0.02 "Check the sign: 0.28 − 0.30 is below zero." / la 0.28 "That is only the wins. Subtract the losses: 0.30 × 1R."

**B6 · task** (widget `expectancy`, în faza Learn)
- **Controale:** Win rate editabil (10–90%, pas 1); Average win blocat la 2.0R; Average loss blocat la 1.0R.
- **Valori de start:** win rate 45%, average win 2.0R, average loss 1.0R (expectancy +0.35R)
- **Obiectiv:** "Average win 2R, average loss 1R. Lower the win rate until expectancy turns negative."
- **Reușită:** win rate = 33% (expectancy −0.01R; la 34% e +0.02R).
- **Indiciu:** "Each point of win rate moves expectancy by 0.03R here. Watch for the sign to flip."
- **Show me:** sliderul coboară animat la 33%.
- **Feedback:** corect "Right. +0.02R at 34%, −0.01R at 33%. Break-even sits at 33.3%, the same rate a 2:1 trade needs." / încă pozitiv "Expectancy is still above zero. Keep lowering the win rate."

**B7 · callout** (key)
> "Judge a method by its expectancy over many trades, in R, and judge each trade by whether it followed the plan. A single result, good or bad, proves almost nothing on its own. The bigger the sample, the more the figure means."

### Try
- **Widget:** risk-reward (cu corectura din PLAN §9.1: câmpuri de preț entry / stop / target)
- **Controale în task:** Entry și Stop blocate; Target editabil (câmp de preț și nivel tras pe riglă). Ieșiri: Risk per unit, Reward per unit, Reward-to-risk, Break-even win rate, toate „before costs”.
- **Valori de start:** entry 50.00, stop 49.40, target 50.60 (1.00 : 1, break-even 50.0%)
- **Obiectiv:** "You buy at 50.00 with the stop at 49.40. Set the nearest target that gives at least 2R."
- **Reușită:** target = 51.20 exact (reward 1.20 = 2 × risk 0.60; R:R 2.00 : 1; break-even 33.3%).
- **Indicii:** 1. "Move the target up until the ratio reads 2.00 : 1." 2. "2R means the reward per unit is twice the risk per unit." 3. "Risk is 50.00 − 49.40 = 0.60, so the reward must be 1.20."
- **Show me:** target-ul urcă animat la 51.20: risk 0.60, reward 1.20, 2.00 : 1, break-even 33.3%.
- **Feedback:** corect "Right. 51.20 is 1.20 away, twice the 0.60 risk. You'd need to win a third of the time to break even, before costs." / R:R < 2 (ex. 51.00, 1.67 : 1) "The reward is still under twice the risk. Move the target a little higher." / R:R > 2 (ex. 52.00, 3.33 : 1) "That clears 2R, but it isn't the nearest target. A closer one is more likely to be reached."

### Check
- Întrebări (implicit, din lecția actuală): q-rm-4, q-rm-5, q-rm-6
- **Înlocuire propusă:** q-rm-6 → **q-rm-7**. Motiv: obiectivul 3 („a single result says little”) nu e testat; q-rm-6 repetă metoda C din B5 și ideea hook-ului (70% care pierde). q-rm-7 (8 câștiguri și 12 pierderi, +0.40R, eșantion mic) testează exact obiectivul 3. q-rm-6 rămâne în pool-ul de recapitulare.
- **Set final:** q-rm-4 (obiectivul 1), q-rm-5 (obiectivul 2), q-rm-7 (obiectivul 3)

### Recap
- **Hook comparat:** "You picked {yours}. Method B, winning 40% at +2R, made +20R over 100 trades. Method A, winning 70% at +0.4R, lost 2R."
- **Three things to remember:**
  1. "Reward-to-risk compares the target distance with the stop distance. Break-even = risk ÷ (risk + reward)."
  2. "Expectancy = win rate × average win − loss rate × average loss, measured in R."
  3. "Judge a method over many trades, and each trade by the plan, never by one result."
- **Practise it:** Risk calculator (`/arena/risk-calculator`) · Arena: trending market · Knowledge check: risk management (`/learn/checks/check-risk_management`)

### Note de conținut
- **Nepotrivire widget/prompt (PLAN §9.1):** `risk-reward` primește azi doar distanțe (stop 0.5–5, target 0.5–12, entry fix 100.00), iar prompt-ul de azi cere prețurile 50.00 / 49.00 / 52.00. Lecția presupune corectura: câmpuri de preț entry / stop / target. Detalii în „Cerințe pentru widget-uri”.
- **Prompt-ul `expectancy` de azi** („lower the win rate until expectancy reaches zero… at about 33.3%”) nu se poate îndeplini exact: win rate are pas de 1%, iar la 33% expectancy e −0.01R, la 34% +0.02R. Sarcina devine „until expectancy turns negative” (reușită la 33%). E un `task` în faza Learn, cum cere harta cursului; Try-ul rămâne pe `risk-reward`.
- **Try nou** (target-ul cel mai apropiat de 2R, stop 0.60): evită cifrele din B3 (2:1 la 50/49/52) și din q-rm-4 (3:1, 25%), ca să rămână transfer. Faptele de azi „1:1 → 50%, 3:1 → 25%” trec în pasul 4 și în interacțiunea figurii B2.
- **Cifre verificate:** 1.00 ÷ 3.00 = 33.3%; 2 ÷ 6 = 33.3%; A +0.20R, B +0.08R, C −0.02R; hook: A (70% la +0.4R) −0.02R, B (40% la +2R) +0.20R; Try: 1.20 ÷ 0.60 = 2.00, break-even 0.60 ÷ 1.80 = 33.3%; 51.00 → 1.67 : 1; 52.00 → 3.33 : 1.
- **Trimiteri după noua ordine:** B1 spune „exactly what you sized in the last lesson”, adică L09, corect în noua ordine (în ordinea ID-urilor, L10 ar fi stat între ele).
- **Glosar:** toți termenii au deja `lesson: "L11"` (`r-multiple`, `reward-to-risk`, `win-rate`, `expectancy`); `r` (L08) și `take-profit` (L04) sunt legați la prima apariție.

---

## L12 · Exposure and leverage

| | |
|---|---|
| Unitate | U3 · Risk comes first, lecția 5 din 6 |
| Durată | 6 min · 7 beat-uri în Learn |
| Concepte | exposure, leverage, correlation-and-concentration, gap-risk |
| Termeni (glosar) | exposure, equity, notional-value, leverage, margin, stop-loss, gap, correlation |
| Se sprijină pe | L09 (valoarea poziției, plafonul fără levier), L08 (bugetul de risc), L10 (gap prin stop) |
| Pregătește | L16, Arena: event shock |

**Obiective**
1. Calculate exposure as a percentage of equity.
2. Work out what a given price move does to the account at different levels of leverage.
3. Distinguish the risk planned at the stop from the full exposure behind it.

### Hook
- **Tip:** predict · slider 0–100% din cont, pas 5, pornește de la 0
- **Prompt:** "Your account is 10,000.00. With leverage you hold 40,000.00 of LABX. Price falls 5%. What share of your account is gone?"
- **Răspuns:** 20% (5% × 40,000.00 = 2,000.00). Intuiția greșită: 5%. Comparat în recap.
- **Concept:** leverage

### Learn
**B1 · explain** (cu figură `Formula`)
> "[[exposure|Exposure]] is the total value of the positions you hold. As a share of your [[equity]], it shows how much of the account rides on price. Hold 5,000.00 of LABX in a 10,000.00 account and your exposure is 50%. A 10% fall then costs 500.00, or 5% of the account."

- Date: `Formula` în trei rânduri, aprinse pe rând.
- Pași:
  1. "Exposure: 5,000.00 ÷ 10,000.00 × 100 = 50%."
  2. "A 10% fall acts on the position: 10% × 5,000.00 = 500.00."
  3. "Effect on the account: 500.00 ÷ 10,000.00 = 5%."

**B2 · worked** "Exposure behind a position"
- Linii:
  1. "You hold 60 LABX at 100.00 in a 10,000.00 account."
  2. "[[notional-value|Position value]]: 60 × 100.00 = 6,000.00. Exposure: 60%."
  3. "A 5% [[gap]] down costs 5% × 6,000.00 = 300.00."
  4. "Effect on the account: 300.00 ÷ 10,000.00 = ?"
- **Ultimul pas îl calculează utilizatorul:** 3% (toleranță 0.01)
- **Rezultat:** "3% of the account: three times a 1% risk budget, whatever the [[stop-loss|stop]] said."
- **Feedback corect / greșit:** "Right. 300.00 is 3% of 10,000.00." / la 5 "5% is the move in price. The account loses 5% of the position, 300.00, which is 3% of 10,000.00." / la 60 "60% is the exposure. Divide the loss, 300.00, by the account."

**B3 · explain**
> "[[leverage|Leverage]] lets you hold a position worth more than your equity, with a broker lending the difference. At 2× a 10,000.00 account controls 20,000.00; at 5×, 50,000.00. Price moves the same either way. What changes is the size of that move against your account. Real brokers may close you out once losses use up your [[margin]]."

**B4 · figure** (din diagrama `exposure-leverage`)
- Date: `Bars` orizontale: Account 10,000.00 (neutru); 1× 10,000.00; 2× 20,000.00; 5× 50,000.00 (`--ml-neg` la 5×). Pe fiecare bară de poziție, un segment de pierdere pentru scăderea aleasă, cu eticheta „−X vUSD · −Y% of account”.
- Pași:
  1. "Account 10,000.00. Without leverage, the largest position is the same size: 1×."
  2. "With leverage the position grows to 20,000.00 at 2× and 50,000.00 at 5×. The account does not."
  3. "A 5% fall costs 500.00, 1,000.00 and 2,500.00: 5%, 10% and 25% of the account."
- **Interacțiune:** după pasul 3, slider pe scădere 1–10% (pas 1, pornește de la 5%); segmentele și procentele se recalculează (la 10%: 10%, 20%, 50% din cont).

**B5 · predict** "When is the account gone?"
- **Prompt:** "At 5×, how big a fall wipes out the whole 10,000.00 account?"
- **Control:** slider 5–100%, pas 5, pornește de la 5%
- **Răspuns:** 20%
- **Reveal:** "20%. 20% × 50,000.00 = 10,000.00: the whole account. Without leverage, the same fall costs 2,000.00."
- **Feedback:** la 100 "That's true without leverage. At 5× the position is five times the account, so a fifth of that fall is enough." / altfel "The loss is the fall times 50,000.00. Which fall makes that 10,000.00?"

**B6 · explain**
> "Your risk is what you lose if the stop fills as planned. Your exposure is what is at stake if it does not. 50 units at 100.00 with a stop 2.00 away risk 100.00, but their exposure is 5,000.00. If price gaps past the stop, the gap and the exposure set the loss. Positions that [[correlation|move together]] add up."

**B7 · callout** (warning)
> "Leverage does not make a trade better; it makes the same trade bigger. Using it to reach a target faster means losses arrive faster, in the same proportion. Missions and the Arena use none: position value can't exceed equity, so exposure tops out at 100%, and sizing from the stop keeps the planned loss at 1% or 2%."

### Try
- **Widget:** exposure (cu corectura din PLAN §9.1: poziția și levierul separate)
- **Controale în task:** Account blocat la 10,000; Leverage available blocat la 5× (plafonul poziției: 50,000.00); Position value editabil (slider 0–50,000, pas 500); Adverse move blocat la 10%. Ieșiri: Position value, Exposure, Leverage used, Loss on a 10% move (vUSD și % din cont).
- **Valori de start:** account 10,000, leverage available 5×, position value 50,000.00 (exposure 500%, leverage used 5×, loss −5,000.00 · −50.0%)
- **Obiectiv:** "You have 5× leverage available and hold 50,000.00 of LABX. Find the largest position where a 10% drop costs no more than 5% of your 10,000.00 account."
- **Reușită:** position value = 5,000.00 exact (loss −500.00 · −5.0%, exposure 50%, leverage used 0.5×).
- **Indicii:** 1. "Shrink the position: the loss is the move times the position, not the account." 2. "A 10% drop may cost at most 5% of 10,000.00, which is 500.00." 3. "Position × 10% = 500.00, so the position is 500.00 ÷ 0.10."
- **Show me:** sliderul de poziție coboară animat la 5,000.00: exposure 50%, leverage used 0.5×, loss −500.00 · −5.0%.
- **Feedback:** corect "Right. 10% of 5,000.00 is 500.00, 5% of the account. Having 5× available didn't mean you had to use it." / poziție prea mare "A 10% drop on that position costs more than 500.00. Go smaller." / poziție prea mică "That stays within 5%, but a larger position would too. Find the largest that fits."

### Check
- Întrebări (implicit, din lecția actuală): q-pe-1, q-pe-2, q-pe-6
- **Înlocuire propusă:** q-pe-2 → **q-pe-3**. Motiv: q-pe-2 (5×, scădere de 5%, 25%) e identică cu pasul 3 al figurii B4. q-pe-3 (3× și o scădere de 4%: 400.00 față de 1,200.00) cere aceeași regulă pe alte cifre. q-pe-2 rămâne în pool-ul de recapitulare.
- **Set final:** q-pe-1 (obiectivul 1), q-pe-3 (obiectivul 2), q-pe-6 (obiectivul 3)

### Recap
- **Hook comparat:** "You guessed {yours}%. A 5% fall on 40,000.00 costs 2,000.00: 20% of the account."
- **Three things to remember:**
  1. "Exposure % = position value ÷ equity × 100: how much of the account moves with price."
  2. "Leverage scales every move against the account: at 5×, a 5% fall costs 25%."
  3. "Risk is the planned loss at the stop. Exposure is what a gap acts on."
- **Practise it:** Risk calculator (`/arena/risk-calculator`) · Arena: event shock · Exposure check (`/learn/checks/check-portfolio_exposure`)

### Note de conținut
- **Nepotrivire widget/prompt (PLAN §9.1):** `exposure` are azi un singur slider („Position value ÷ account”, 0.25–10×), iar prompt-ul de azi vorbește separat de poziție și de levier. Lecția presupune corectura: Leverage available (plafon) separat de Position value și un slider de mișcare adversă. Detalii în „Cerințe pentru widget-uri”.
- **Figura vs exemplul:** diagrama de azi arată o scădere de 10%, iar exemplul o scădere de 5%. În varianta nouă, figura pornește la 5% (exemplul) și slider-ul arată și 10% (diagrama de azi).
- **Cifre verificate:** 5,000.00 → 50%, 10% → 500.00 = 5%; 60 × 100.00 = 6,000.00, 5% → 300.00 = 3% (exemplul din conceptul `exposure`); 1× / 2× / 5× la 5%: 500.00 / 1,000.00 / 2,500.00; la 5×, 20% → 10,000.00; hook: 5% × 40,000.00 = 2,000.00 = 20%; Try: 10% × 5,000.00 = 500.00.
- **Faptul „Positions that tend to move together add up to one larger exposure”** e scurtat în B6 („Positions that move together add up”), cu legătură spre `correlation`. Conceptul `correlation-and-concentration` are exemplul complet (două long-uri pe LABX care se comportă ca un singur pariu de 2%).
- **Trimiteri după noua ordine:** plafonul fără levier a fost predat în L09 (B6); L12 îl reia în B7. Gap-ul prin stop vine din L04 și L10.
- **Glosar:** `correlation` nu are lecție; propun `lesson: "L12"`. `exposure`, `leverage`, `margin`, `notional-value`, `buying-power` au deja L12.

---

## L16 · Volatility and adapting your size

| | |
|---|---|
| Unitate | U3 · Risk comes first, lecția 6 din 6 |
| Durată | 7 min · 7 beat-uri în Learn |
| Concepte | volatility, position-sizing, gap-risk |
| Termeni (glosar) | volatility, atr, invalidation, pullback, exposure, gap, stop-loss, market-order |
| Se sprijină pe | L10 (stop dincolo de zgomot), L09 (dimensionarea din stop), L12 (expunere, gap) |
| Pregătește | Arena: high volatility, Arena: low volatility, M04 (cardul ATR) |

**Obiective**
1. Measure normal price movement with the average true range (ATR).
2. Widen stops in volatile markets and reduce size to match.
3. Keep risk per trade constant across calm and volatile conditions.

### Hook
- **Tip:** predict · alegere, 3 variante: "The calm-week trade" · "The volatile-week trade" · "About the same"
- **Prompt:** "Both trades buy LABX at 50.00. Calm week: 200 units, stop 0.50 below. Volatile week: 50 units, stop 2.00 below. Which loses more if its stop is hit?"
- **Răspuns:** About the same: 200 × 0.50 = 100.00 și 50 × 2.00 = 100.00, înainte de costuri. Intuiția greșită: „mai multe unități = mai mult risc” sau „stop mai larg = mai mult risc”. Comparat în recap.
- **Concept:** position-sizing

### Learn
**B1 · explain**
> "[[volatility|Volatility]] is how far price typically moves in a given period. It changes over time: quiet phases alternate with busy ones. A [[stop-loss|stop]] distance that sits comfortably outside the noise in a calm market can sit right inside it in a volatile one, so neither a fixed stop distance nor a fixed size works in both."

**B2 · figure** (din diagrama `volatility-regimes`)
- Date: două panouri `LearnChart` cu aceeași scală. Calm: `Candles`, 10 lumânări în jurul lui 50.00, high–low ≈ 0.40, minime între 49.70 și 49.85. Volatile: 10 lumânări, high–low ≈ 1.20, minime de două ori sub 49.40 (49.25 pe lumânarea 4, 49.10 pe lumânarea 8). În ambele, `Level` entry 50.00 și `Level` stop 49.40.
- Pași:
  1. "Calm market: candles span about 0.40. A stop 0.60 below entry sits outside the noise."
  2. "Volatile market: candles span about 1.20. The same stop sits inside the noise."
  3. "Same distance, different meaning. The stop has to follow the noise."
- **Interacțiune:** după pasul 3, comutatorul Calm / Volatile schimbă panoul activ; stop-ul rămâne la 49.40, iar lumânările care îl ating se marchează.

**B3 · explain**
> "A common yardstick is the [[atr|average true range (ATR)]]: the average size of recent candles, from high to low, counting any [[gap]] from the previous close. If LABX's 14-candle ATR is 0.40, a typical candle covers about 0.40. Put the stop beyond the [[invalidation]] level by a fraction of the ATR. This lesson uses half."

**B4 · hotspot** "Which candle moved most?"
- Date: `Candles`, 5 lumânări după o închidere anterioară de 50.00 (marcată estompat): 1. O 50.00 H 50.30 L 49.80 C 50.20; 2. O 50.20 H 50.60 L 50.00 C 50.40; 3. O 50.40 H 50.50 L 50.00 C 50.10; 4. O 49.30 H 49.60 L 49.20 C 49.50 (gap în jos de la 50.10); 5. O 49.50 H 49.90 L 49.40 C 49.80. True range: 0.50, 0.60, 0.50, **0.90**, 0.50; ATR(5) = 3.00 ÷ 5 = 0.60.
- **Prompt:** "Tap the candle with the largest true range."
- **Țintă:** lumânarea 4
- **Feedback:** corect "Right. Candle 4 is only 0.40 tall, but it gapped: from the previous close, 50.10, to its low, 49.20, is 0.90. These five average 0.60." / lumânarea 2 "Candle 2 is the tallest, 0.60 from high to low. True range also counts gaps: look for a jump from the previous close." / altă lumânare "That candle covers 0.50. One candle opened far from the previous close, and the gap counts too."

**B5 · worked** "Calm versus volatile market"
- Linii:
  1. "Budget 100.00, entry 50.00, stop half an ATR under the [[pullback]] low."
  2. "Calm, ATR 0.40, low 49.60: stop 49.40. 100.00 ÷ 0.60 → 166 units."
  3. "Volatile, ATR 1.20, low 48.80: stop 48.20. 100.00 ÷ 1.80 = 55.56 → ?"
  4. "Risk: 99.60 calm, 99.00 volatile. Value held: 8,300.00 against 2,750.00."
  5. "After commissions: 153 and 54 units."
- **Ultimul pas îl calculează utilizatorul:** linia 3, units = 55 (toleranță 0); liniile 4–5 apar după răspuns.
- **Rezultat:** "Same risk, a third of the units. Only the [[exposure]] shrinks."
- **Feedback corect / greșit:** "Right. 55 units lose 99.00 at the stop, about the same as 166 units in the calm market." / la 56 "That rounds up. 56 × 1.80 = 100.80, over the budget." / la 166 "That's the calm size. With a 1.80 stop, 166 units would lose 298.80."

**B6 · reveal** "When the stop is gapped"
- Date: `Candles`, 12 lumânări între 49.70 și 50.40 (ultima închidere 50.10); `Level` entry 50.00; `Level` stop 48.20; văl peste lumânarea 13. Lumânarea 13: O 47.60, H 47.90, L 47.30, C 47.70.
- **Prompt:** "You're long 55 units from 50.00, stop 48.20. An event is due. Where will the stop fill?"
- **Variante:** `a` "At 48.20, as planned" · `b` "At the next candle's open" ✓ · `c` "It won't fill"
- **După Reveal:**
  1. "It opens at 47.60. The stop becomes a [[market-order|market order]] and fills there."
  2. "Loss: 55 × (50.00 − 47.60) = 132.00, not the planned 99.00."
  3. "In R: 132.00 ÷ 99.00 = 1.33R."
- **Rezultat:** "A gap can turn a 1R plan into more. Small risk per trade keeps it survivable."
- **Feedback:** `a` "The stop is a trigger, not a price guarantee. Nothing traded at 48.20, so it fills at the open." / `c` "It does fill. Once touched it becomes a market order, at the first price available."

**B7 · callout** (warning)
> "Don't keep your usual size and squeeze the stop to fit a volatile market: a stop inside the noise turns ordinary swings into losses. Change the size, not the logic of the stop. The limit doesn't change either: 2% in the high-volatility Arena is still 2%. If a sensible stop leaves too small a size, waiting is a valid decision."

### Try
- **Widget:** position-size (mod `units: "learner"`, cu rigla de preț)
- **Controale în task:** Account, Risk per trade și Entry blocate; Stop editabil (câmp și nivel tras pe riglă); Units editabil. Rigla arată `Level` „pullback low” 48.40 și cardul „ATR (14) 1.60”. Rând fix de comparație: „Calm, stop 49.40: 153 units · 7,650.00”. „Textbook size” și „Size including costs” ascunse până la reușită sau Show me.
- **Valori de start:** account 10,000, risk 1%, entry 50.00, stop 49.40, units 153 (mărimea din piața calmă; loss if stopped 99.41)
- **Obiectiv:** "Volatility is up: ATR 1.60, pullback low 48.40. Move the stop half an ATR below the low, then resize so the loss if stopped stays within 100.00."
- **Reușită:** stop = 47.60 **și** units = 40 (loss if stopped 97.96 ≤ 100.00; 41 ar pierde 100.41).
- **Indicii:** 1. "Stop first: the pullback low minus half an ATR. Then change the units, not the stop." 2. "Units = budget ÷ (distance + commission per unit), rounded down." 3. "Stop 48.40 − 0.80 = 47.60, so 2.40 away. 100.00 ÷ 2.4488 ≈ 40.8."
- **Show me:** stop-ul coboară animat la 47.60, apoi Units devine 40: loss if stopped 97.96, position value 2,000.00 · 20.00%; apar Textbook 41 și Size including costs 40.
- **Feedback:** corect "Right. A 2.40 stop, 40 units, 97.96 at risk: the same budget as in the calm market. Your exposure fell from 7,650.00 to 2,000.00." / stop 47.60, units 153 "The stop is right, but 153 units would lose 374.68 there, almost four times the budget. Keep the stop; cut the units." / stop 47.60, units 41 "41 is the textbook size. With both commissions it loses 100.41, just over 100.00." / stop ≠ 47.60 "Check the stop: half of 1.60 is 0.80, below the 48.40 low." / units < 40 "That fits, but one more unit still would. Find the largest size within 100.00."

### Check
- Întrebări (implicit, din lecția actuală): q-rm-8, q-rm-9, q-rm-10
- Setul rămâne: q-rm-8 (obiectivul 2), q-rm-9 (obiectivul 3, Arena 2%, 80 de unități), q-rm-10 (gap, 1.60R). Niciuna nu testează obiectivul 1 (ATR); îl acoperă hotspot-ul B4 și task-ul. Alternativă de recapitulare: q-sl-9 (stop lărgit și mărime redusă în faza volatilă).

### Recap
- **Hook comparat:** "You picked {yours}. Both lose 100.00 at the stop, before costs: 200 × 0.50 and 50 × 2.00. Only the exposure differs: 10,000.00 against 2,500.00."
- **Three things to remember:**
  1. "ATR measures normal movement: the average candle range, counting gaps from the previous close."
  2. "When volatility rises, put the stop beyond the wider noise and cut the size to match."
  3. "Keep the risk budget fixed in every market. The units and the exposure change, not the risk."
- **Practise it:** Arena: high volatility · Arena: low volatility · Risk calculator (`/arena/risk-calculator`)

### Note de conținut
- **Precizare în exemplul de azi:** „The pullback low plus a buffer puts the stop at 49.40” nu dă minimul și nici bufferul. Am fixat regula „half an ATR under the pullback low”, cu minime 49.60 (calm, ATR 0.40) și 48.80 (volatil, ATR 1.20), ca stop-urile 49.40 și 48.20 de azi să rămână neschimbate și să fie reproductibile; Try-ul folosește aceeași regulă (ATR 1.60, minim 48.40 → 47.60, adică exemplul din conceptul `volatility`: 2.40, 41 de unități). M04 folosește 0.25 × ATR, M05 0.15 × ATR; lecția spune „a fraction of the ATR” și alege jumătate doar pentru exemple.
- **Cifre verificate cu motorul:** calm 166 → 153 de unități (99.41 cu costuri), volatil 55 → 54 (99.86); 8,300.00 și 2,750.00 (fără costuri); gap: 55 × 2.40 = 132.00, 132.00 ÷ 99.00 = 1.33R; 56 × 1.80 = 100.80; 166 × 1.80 = 298.80; Try: 47.60 → 41 / 40 de unități, 97.96 (41: 100.41; 153: 374.68); hint 3: 0.0005 × (50.00 + 47.60) = 0.0488, 100.00 ÷ 2.4488 = 40.84.
- **Hook-ul** reia intenționat cele două stop-uri din L10 (A 49.50 cu 200 de unități, B 48.00 cu 50), acum văzute ca piață calmă și piață volatilă. 200 × 50.00 = 10,000.00, exact plafonul fără levier.
- **Hotspot-ul B4** e nou, construit din definiția ATR din glosar și din concept; datele sunt verificate (true range 0.50, 0.60, 0.50, 0.90, 0.50; ATR 0.60).
- **Punctele de azi** sunt păstrate: stop mai larg și mărime mai mică (B5, Try), stop dincolo de zgomot, nu doar de nivel (B2, B3), limita nu se schimbă (B7), așteptarea e o decizie validă (B7), gap-urile (B6). Fraza „costs take a bigger share when the stop is tight” se vede în cifre (166 → 153 față de 55 → 54), fără propoziție separată (limita de 60 de cuvinte).
- **Trimiteri după noua ordine:** lecția folosește formula (L09), stop-ul dincolo de zgomot (L10) și expunerea (L12); toate vin înainte.
- **Nivel și plan:** L16 are azi `tier: "pro"`. Conform deciziei din PLAN §17.1, conținutul Learn e funcțional pentru toți deocamdată; inconsecvența cu Pricing („toate lecțiile de risk management sunt gratuite”) rămâne de decis la final.
- **Glosar:** `volatility` și `atr` au deja L16. `pullback` (L05) și `invalidation` (L10) sunt legați la prima apariție.

---

## Cerințe pentru widget-uri

Ce presupun task-urile din U3. Regulile comune din PLAN §9.1 se aplică tuturor: obiectiv, condiție de reușită evaluată de `evaluateSuccess`, 1–3 indicii, Reset, Show me (animă starea corectă), valori de start din conținut, stările idle → engaged → submitted → correct / incorrect → resolved, feedback cu `aria-live="polite"`. În plus, pentru U3:

- **Blocare per control** (`locked`): controalele blocate rămân vizibile, cu valoarea lor, dar nu se pot schimba.
- **Ieșiri ascunse** (`hidden`): rândurile care ar da răspunsul se ascund până la reușită sau Show me.
- **Cazuri de feedback** (`feedbackCases`): condiții declarative pe valorile curente (de exemplu `units > max`, `units == simpleQty`, `stop >= 4840`), fiecare cu textul ei. Evaluarea se face în cenți și în unități întregi, cu aceleași funcții ca motorul.
- **Butonul Check:** verificarea se face la trimitere, nu la fiecare mișcare de slider.

### loss-recovery (L08)
- **Control:** slider Drawdown 1–90%, pas 1 (cum e azi); valoarea de start vine din conținut (L08: 5%).
- **Ieșiri (cum sunt azi):** Left of the account (%), Gain needed to recover (d ÷ (100 − d), o zecimală), Losing trades of 1% to get there (`ceil(ln(1 − d) ÷ ln(0.99))`).
- **Reușită L08:** `drawdown == 20`. Cazuri: gain needed < 25 → „go deeper”; > 25 → „step back”.
- **Show me:** sliderul se animă la 20.
- **De corectat:** „Gain needed” are azi tonul `neg` (roșu), dar e un câștig necesar, nu o pierdere; §8.2 rezervă roșul pentru pierderi simulate. Propun ton neutru sau accent.

### position-size (L10, L09, L16)
- **Controale de azi:** Account (slider 1,000–50,000, pas 500), Risk per trade (0.25–3%, pas 0.25), Entry (buy) și Stop (câmpuri de preț, 2 zecimale, stop < entry). Toate trebuie să poată fi blocate individual.
- **Ieșiri de azi:** Risk budget, Distance to stop, Textbook size, Size including costs, Loss if stopped, Position value · % din cont (din `maxQtyForRisk` și `riskAmount`, cu `maxNotional = account`).
- **Mod nou `units: "learner"`** (L09, L16): câmp „Units” (întreg ≥ 0). Când e activ:
  - „Loss if stopped” și „Position value” se calculează pentru unitățile introduse (`riskAmount(side, units, entry, stop, 5)`), cu eticheta „within budget” sau „over by X.XX”;
  - „Textbook size” și „Size including costs” sunt ascunse până la reușită;
  - dacă unitățile depășesc plafonul contului (`floor(account ÷ entry)`), apare nota „Position value can't exceed the account”.
- **Mod `units: "auto"`** (L10, ca azi), cu ieșiri ascundibile: L10 ascunde „Textbook size (no costs)”.
- **Rigla de preț** (Learn Chart Kit, opțională per task): verticală, cu `Level` entry, `Level` stop legat de câmp (`draggable`, snap 0.01, săgeți ±0.01, Shift ±0.10) și niveluri de context (`Level` support/neutral) plus carduri de context:
  - L10: support 48.40, „Normal candle ≈ 0.40”;
  - L16: pullback low 48.40, „ATR (14) 1.60”.
- **Rând de comparație fix** cu starea de start: L10 „Start, stop 49.50: 181 units · loss 99.51”; L16 „Calm, stop 49.40: 153 units · 7,650.00”.
- **Nota de plafon:** când `cappedByBuyingPower` e adevărat (modul auto), widget-ul o spune („Capped: position value can't exceed the account”). Azi plafonul se aplică fără mesaj.
- **Reușite:**
  - L10: `4800 ≤ stop ≤ 4830` (cenți), restul neschimbat;
  - L09: risc 2%, entry 100.00, stop 96.00, `units == maxQtyForRisk(...).qty` (48);
  - L16: `stop == 4760` și `units == maxQtyForRisk(...).qty` (40).
- **Show me:** L10 animă stop-ul la 48.00; L09 completează 48 de unități; L16 animă stop-ul la 47.60, apoi completează 40.

### risk-reward (L11; aceeași corectură servește L14 și L15)
- **Corectura din §9.1:** sliderele de distanță (stop 0.5–5, target 0.5–12, entry fix 100.00) se înlocuiesc cu trei câmpuri de preț, Entry, Stop și Target (2 zecimale, long: stop < entry < target), legate de o riglă de preț cu `Level` entry / stop / target trase cu mouse-ul (snap 0.01) și `Bracket` „Risk” și „Reward”. Mesaj de validare: „Put the stop below the entry and the target above it.”
- **Ieșiri:** Risk per unit (entry − stop), Reward per unit (target − entry), Reward-to-risk (x.xx : 1), Break-even win rate (risk ÷ (risk + reward), o zecimală), toate marcate „before costs”. Rândul de azi „Entry 100.00 → stop / target” dispare.
- **Task L11:** Entry și Stop blocate (50.00, 49.40); Target editabil, start 50.60. Reușită: `(target − entry) == 2 × (entry − stop)` în cenți, adică 51.20. Cazuri: R:R < 2, R:R > 2.
- **Show me:** target-ul urcă animat la 51.20.

### expectancy (L11, beat de tip task în Learn)
- **Controale (cum sunt azi):** Win rate 10–90%, pas 1; Average win 0.5–5R, pas 0.1; Average loss 0.5–3R, pas 0.1. În L11, Average win blocat la 2.0 și Average loss blocat la 1.0.
- **Ieșiri (cum sunt azi):** Expectancy per trade, Over 100 trades, At 1% risk per trade; nota despre eșantioane rămâne.
- **Reușită L11:** `winRate == 33` (expectancy < 0 la 33 și ≥ 0 la 34). Calculul se face în întregi (win × avgWin × 10 − (100 − win) × avgLoss × 10), ca să nu apară „−0.00R” din erori de virgulă mobilă.
- **După reușită:** un marcaj pe pista sliderului la 33.3% („break-even”).

### exposure (L12)
- **Corectura din §9.1, poziția și levierul separate:**
  - Account: slider 1,000–50,000, pas 500;
  - Leverage available: comutator 1× / 2× / 5× / 10×, care fixează plafonul poziției (account × leverage);
  - Position value: slider 0 → plafon, pas 500;
  - Adverse move: slider 1–20%, pas 1.
- **Ieșiri:**
  - Position value;
  - Exposure (position ÷ account × 100, fără zecimale);
  - Leverage used (position ÷ account, de exemplu „0.5×”);
  - Loss on the move (vUSD și % din cont, o zecimală);
  - opțional, rândurile de azi pentru 1%, 5% și 10%.
- **Nota de simulator:** când position > account: „Above 100% you're using leverage. Missions and the Arena cap positions at your equity.”
- **Task L12:** Account blocat la 10,000, Leverage available blocat la 5×, Adverse move blocat la 10%, Position value editabil, start 50,000. Reușită: `position == 5000` (cea mai mare poziție cu pierderea ≤ 5% din cont). Cazuri: prea mare / prea mică.
- **Show me:** poziția coboară animat la 5,000.

### Interacțiuni în figuri (Learn Chart Kit, nu widget-uri)
Pentru E2/E3, figurile din U3 cer:
- L09 B2: input numeric pe pasul 3 al `Formula`;
- L10 B3: `Level` stop tras, cu etichete live pe intervale;
- L11 B2: `Level` target tras, cu R:R și break-even live;
- L12 B4: slider de scădere 1–10% pe `Bars`;
- L16 B2: comutator calm / volatil;
- L16 B4: `Hotspot` pe lumânări;
- L16 B6: văl „Reveal” peste lumânarea 13.
