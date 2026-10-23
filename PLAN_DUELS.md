# MARKET//LAB · Duels: plan de dezvoltare și funcționare

**Data:** 23 octombrie 2026
**Sursă:** [BRIEF_DUELS.md](BRIEF_DUELS.md) (analiza), plus deciziile de mai jos.
**Ce acoperă:** faza D1 din brief: dueluri 1v1 contra boților, care rulează local, în browser, pe arhitectura de acum. Cum funcționează, cum arată, cum se construiește și criteriile de acceptanță.
**Ce nu acoperă:** duelurile cu oameni (D2, D3). Au nevoie de backend și rămân în brief.

> **Istoric.** Prima versiune (tot din 23.10.2026) avea runde: 8 × 10 lumânări, cu timer de decizie. La cererea utilizatorului, duelul a devenit o piață continuă, în timp real (decizia 2). Duelurile salvate în formatul vechi se elimină la încărcare. A treia iterație a simplificat tranzacționarea, a făcut stopul opțional și a adăugat comutatorul pentru tranzacțiile botului, plus zoom și privire în trecut pe grafic (deciziile 12–16).

---

## 0. Decizii

| # | Decizie | Sursa |
|---|---|---|
| 1 | Boții sunt **declarați**. Fiecare apare cu eticheta „Bot” peste tot unde e afișat. | Utilizator |
| 2 | **Piață continuă, ca una reală:** fiecare lumânare se formează în **15 secunde** (prețul se mișcă în interiorul ei), **80 de lumânări**, adică **20 de minute**. Utilizatorul poate pune **pauză** oricând, ca să analizeze. | Utilizator |
| 3 | Când graficul se deschide, o **numărătoare de 10 secunde** precede pornirea pieței, iar în spate există un **istoric mai lung** (120 de lumânări), ca utilizatorul să-și facă o idee despre piață. | Utilizator |
| 4 | Utilizatorul **vede tranzacțiile botului**: pe grafic și într-un panou „Tu vs bot”, cu pozițiile deschise, ordinele și tranzacțiile închise ale fiecăruia. | Utilizator |
| 5 | Botul **decide la închiderea fiecărei lumânări**. Stopurile, targeturile și limitele lui se execută live, în interiorul lumânării. | Utilizator |
| 6 | **Foresight ascuns:** în unele dueluri, botul vede lumânările următoare (până la 12), ca să câștige acele dueluri. Utilizatorul nu e informat. Șansa crește cu nivelul botului (15% la nivelul 1, 35% la nivelul 5) și e fixată de seed. | Utilizator (am recomandat varianta declarată; s-a ales cea ascunsă) |
| 7 | În duelurile cu foresight, notele botului spun **doar ce a făcut**, fără motive inventate. Interfața nu afirmă nicăieri că botul vede doar ce vede utilizatorul. | Plan, ca urmare a deciziei 6 |
| 8 | Scor de duel = 70% Decision Quality + 30% rezultat în R. | Brief §1.3 |
| 9 | ~~Stop obligatoriu~~ (înlocuită de decizia 13). Riscul unui ordin cu stop rămâne plafonat la 1% de motor. | Brief §1.1 |
| 10 | XP: 30 pentru un duel terminat, pentru primele 3 dueluri ale zilei. Nimic pentru victorie sau abandon. | Brief §1.3, plus plafon anti-farming |
| 11 | Duelurile contra boților nu consumă sesiunile Arena ale planului Free. Scenariile Pro rămân Pro. | Brief §8.7–8.8 |
| 12 | **Tranzacționare dintr-un tap:** mărimea ca procent din puterea de cumpărare (10, 25, 50, 100%), stop și target opționale ca distanță în % de la intrare, apoi Buy sau Sell. Biletul complet (limit, prețuri exacte) rămâne sub „Limit order or exact prices”. | Utilizator |
| 13 | **Stopul e opțional.** Lipsa lui se punctează în proces (criteriul „Every entry had a stop-loss”), iar R-ul unei tranzacții fără stop folosește 1% din contul de start ca unitate. | Utilizator |
| 14 | **Tranzacțiile botului se pot ascunde** cu un comutator deasupra graficului (grafic, banda de mișcări, coloana din panou, mișcările din tab-ul botului). Preferința se păstrează. | Utilizator |
| 15 | **Zoom și privire în trecut:** butoane (−, +, ←, →, „Back to now”), rotița mouse-ului pentru zoom, tragerea graficului (sau swipe orizontal) pentru trecut. Piața continuă cât timp te uiți înapoi. | Utilizator |
| 16 | **Nivelul și ratingul fiecărui bot sunt fixe.** Nu cresc și nu scad după rezultate; doar ratingul utilizatorului se mișcă. Mirror își alege defectul după obiceiurile utilizatorului, dar are nivelul fix 3. | Utilizator (clarificare) |

---

## 1. Cum funcționează

### 1.1 Lobby-ul (`/arena/duels`)

- **Duelul în curs,** dacă există: un card cu „Resume”. Un singur duel activ odată.
- **Ratingul tău:** pornește de la 1000. Plus victorii, înfrângeri, egaluri și rivalul curent.
- **Daily duel:** în fiecare zi, același bot, același scenariu și aceeași piață pentru toți (seed din dată). Se joacă o dată pe zi și nu schimbă ratingul.
- **Piața:** unul dintre cele 9 scenarii Arena (cele Pro sunt blocate pe Free).
- **Sparring partners:** cele 8 personaje (§1.6), fiecare cu nivel, rating, stil, defectul pe care îl joacă, ce să urmărești și scorul vostru direct. Chip-uri:
  - **Recommended:** botul neînvins cu ratingul cel mai apropiat de al tău;
  - **Rival:** botul care te-a bătut în ultimele două dueluri contra lui;
  - **Beaten:** botul pe care l-ai bătut de cel puțin 2 ori.
- **Recent duels:** ultimele dueluri, cu adversarul, scenariul, rezultatul și scorurile.

### 1.2 Piața și timpul

- **Aceeași piață pentru amândoi:** un scenariu Arena (regim + seed) cu 60 de lumânări de istoric în plus în față. La start se văd 120 de lumânări închise.
- **Lumânarea de 15 secunde:** motorul rulează pe **tick-uri**, 60 pe lumânare (unul la 250 ms). Tick-urile urmează drumul lumânării: deschidere → primul extrem → al doilea extrem → închidere, cu zgomot, și reconstituie exact deschiderea, maximul, minimul și închiderea ei.
- **Ordinele se execută la prețul live:** un ordin market se execută la prețul tick-ului curent (± spread). Stopurile, targeturile și limitele se verifică tick cu tick.
- **Numărătoarea:** 10 secunde, cu piața oprită. Se poate citi istoricul și se pot pune deja ordine.
- **Pauza:** butonul „Pause” sau tasta Space. Piața stă; ordinele se pot pune și în pauză, la prețul la care s-a oprit piața. Un tab ascuns pune pauză automat.
- **Reluarea:** un duel părăsit se reia din lobby de la tick-ul la care a rămas, cu ordinele și pozițiile de atunci, după aceeași numărătoare de 10 secunde.
- **Finalul:** după a 80-a lumânare, pozițiile deschise se închid la market și apare „See the result”.

### 1.3 Regulile ordinelor

- **Panoul rapid (tab-ul Trade):** mărime (10, 25, 50 sau 100% din puterea de cumpărare), stop (niciunul, 1, 2 sau 3% de la intrare), target (niciunul, 2, 4 sau 6%), apoi Buy sau Sell la market. Butoanele urmează poziția: fără poziție „Buy / Sell”, cu un long „Buy more / Close long”, cu un short „Close short / Sell more”, plus „Close half”. Alegerile se păstrează.
- **Cu stop,** mărimea se plafonează automat ca pierderea la stop să rămână în 1%; panoul o spune. **Fără stop,** panoul amintește că pierderea nu e limitată și că lipsa stopului se punctează.
- Adăugarea la o poziție fără stop sau target ales păstrează stopul și targetul poziției.
- **Biletul complet** (limit, prețuri exacte, mărime din risc) e sub „Limit order or exact prices”.
- În tab-ul Position, stopul și targetul se pot modifica sau scoate; ordinele în așteptare se pot anula, iar poziția se poate închide.

### 1.4 Ce se vede din bot

| Unde | Ce se vede |
|---|---|
| Pe grafic | Intrările și ieșirile botului (markeri în culoarea botului) și liniile poziției și ordinelor lui, etichetate cu numele lui. Ale tale rămân în culorile obișnuite. O legendă spune care e care. |
| Panoul „You vs {bot}” | Pentru amândoi: echitate, P&L, R închis, poziția deschisă (direcție, cantitate, intrare, stop, target, P&L și R deschis), ordinele în așteptare, tranzacțiile închise. Se actualizează tick cu tick. |
| Banda de deasupra graficului și tab-ul botului | Ultima mișcare a botului și istoricul mișcărilor lui, cu momentul („After candle 23”). Botul scrie o notă doar când face ceva. |

Botul decide la închiderea fiecărei lumânări, deci mișcările lui apar exact atunci. **Comutatorul „{bot}'s trades”** de deasupra graficului le ascunde pe toate (grafic, bandă, coloana din panou, lista din tab-ul botului); rezultatul le arată mereu. Culoarea nu e singurul indiciu: liniile botului au numele lui în etichetă, iar markerii lui stau puțin mai departe de lumânare.

### 1.5 Scorul și câștigătorul

Pentru fiecare jucător, separat:

```
Process  = Decision Quality pe rubrica de duel (0–100)
R        = suma R-multiple-urilor: profit net / riscul inițial (fără stop: profit net / 1% din contul de start)
Outcome  = round(clamp(50 + 50 × R / 3, 0, 100))
Duel     = round(0,7 × Process + 0,3 × Outcome)
```

**Rubrica de duel** (stopul e opțional, deci se punctează; riscul cu stop e plafonat de motor):

| Criteriu | Evaluator | Pondere | Eticheta de eroare |
|---|---|---|---|
| Every entry had a stop-loss | `invalidation_before_entry` | 20 | `no_stop` |
| Planned exits worth the risk | `reward_risk_planned` (R:R ≥ 1,5) | 15 | — |
| Stops outside normal noise | `stop_outside_noise` (stop ≥ 0,8 ATR) | 10 | `stop_inside_noise` |
| Entries that didn't chase | `entry_not_extended` (intrare la ≤ 1,8 ATR de SMA 20) | 15 | `chased_entry` |
| Never widened a stop | `no_stop_widening` | 15 | `moved_stop_away` |
| Kept risk steady after losses | `no_revenge_sizing` | 10 | `revenge_size_up` |
| Traded selectively | `pacing` (≤ 6 intrări în 80 de lumânări: 1; ≤ 12: 0,6; peste: 0,2) | 15 | `overtrading` |

- ATR-ul și SMA 20 se iau din lumânările închise în momentul ordinului.
- **Risk Discipline** = criteriile de disciplină din rubrică (stop la fiecare intrare, stop lărgit, mărime după pierdere).
- **Fără nicio tranzacție:** pierzi duelul. Dacă niciunul nu a tranzacționat, e egal.
- **La egalitate de scor:** decide Risk Discipline, apoi R, apoi e remiză.
- **Mesajul rezultatului** spune explicit când profitul și procesul arată în direcții diferite.

### 1.6 Boții

Fiecare bot citește lumânările închise și propriul cont, dimensionează cu aceeași funcție ca omul (`maxQtyForRisk`), iar ordinele lui trec prin aceleași reguli ale motorului. După o tranzacție, botul așteaptă un număr de lumânări („cooldown”), după stilul lui.

| Bot | Nivel | Rating | Stil | Defectul | Cooldown |
|---|---|---|---|---|---|
| **Pip** | 1 | 850 | Intră aproape la fiecare lumânare, pe direcția ultimei | Stopuri prea strânse, targeturi sub 1R, mută uneori stopul | 0 |
| **Dash** | 1 | 950 | Intră la fiecare lumânare, iese la următoarea | Overtrading, targeturi mici | 0 |
| **Blaze** | 2 | 1050 | Lumânările mari și breakout-urile | Intră pe mișcări deja întinse | 2 |
| **Grudge** | 2 | 1150 | Trend, intrări dese | Riscul crește de 2,4 ori după o pierdere | 1 |
| **Hope** | 3 | 1250 | Trend, intrări pe pullback | Își mută stopul când pierde | 3 |
| **Rook** | 4 | 1400 | Trend disciplinat, pullback pe SMA 20, target 2R | — | 4 |
| **Sage** | 5 | 1550 | Marginile range-ului sau pullback în trend, R:R ≥ 2 | — | 5 |
| **Mirror** | adaptiv | 1150 | Trend | Defectul tău cel mai frecvent dintre cele de mai sus | 3 |

- **Foresight (ascuns):** în duelurile în care îl are, botul alege, dintre ordinul lui obișnuit long și short, pe cel al cărui target e atins de tick-urile următoare înaintea stopului. Stopul și targetul sunt cele ale stilului lui, deci defectele lui de proces rămân. Fără nimic câștigător în vedere, așteaptă (sau, târziu în duel, fără nicio tranzacție, joacă după stilul lui).
- **Mirror** ia eticheta de eroare cea mai frecventă din rezultatele tale (misiuni, Arena, dueluri) dintre cele pe care un bot le poate juca. Fără una, cardul e dezactivat și spune de ce.
- **Deciziile botului se salvează în duel** (jurnalul lui de acțiuni și notele). Rezultatul unui duel vechi nu se schimbă dacă boții sunt ajustați mai târziu.

### 1.7 Rating, XP, istoric

- **Rating Elo:** K = 32, ratingul inițial 1000, minimum 100. Boții au rating fix. Daily duel nu schimbă ratingul.
- **XP:** 30 pentru duelul terminat, pentru primele 3 dueluri ale zilei (`XP_RULES.duel`). Nimic pentru resign. Victoria nu dă XP.
- **Streak:** un duel terminat contează ca activitate. **Recent activity** (Dashboard) îl include. **Levels & XP:** motivul „Duel completed”.

### 1.8 Ce nu intră în D1

Dueluri cu oameni, clasamente, reacții trimise de utilizator, duelurile în Trade Journal (Session History, Replay, Alternatives). Rezultatul duelului are propriul grafic complet.

---

## 2. UI

Ecranele folosesc componentele existente (`PageHead`, `SubNav`, `Card`, `StageBar`, `Chart`, `OrderTicket`, `Tabs`, `Button`, `Tag`, `KeyValues`, `Dialog`, `Empty`, `Pnl`) și tokenii din `tokens.css`. Botul are culoarea lui: `--ml-rival` (#D6B47A), cu `-soft` și `-line`.

### 2.1 Lobby

Antetul și tab-urile Arena, apoi: duelul în curs, trei carduri (ratingul, daily duel, cum funcționează), alegerea pieței, grila „Sparring partners” și „Recent duels”.

### 2.2 Duelul

```
← Duels   DUEL · BULLISH MARKET · MAX RISK 1% PER ORDER        [Synthetic data] [Resign]
          You vs Rook · BOT
[● LIVE]  [━━━━━━━━──────────]  Candle 23 of 80 · next close in 0:09 · 14:12 left
┌ Rook, after candle 22: Uptrend… Long 120 at market, stop …, target … ┐
┌───────────────────────────────────────────────┐ ┌ [Order] [Position] [Rook] ┐
│ ▲ You  ▲ Rook (bot)          SMA 20 · SMA 50  │ │ Order ticket              │
│ grafic live: istoricul, zona „Duel”, lumânarea│ │ Buy/Sell · Market/Limit   │
│ care se formează, liniile tale și ale lui Rook│ │ Stop (required) · Target  │
│     [ 10 · Read the history… ]  (numărătoarea)│ │ [Place order]             │
│     [ Paused · the market waits for you ]     │ ├───────────────────────────┤
└───────────────────────────────────────────────┘ │ [Pause] / [Resume]        │
                                                  └───────────────────────────┘
┌ You ──────────────────────┐ ┌ Rook · BOT ───────────────┐
│ Equity · P&L · R · Trades │ │ Equity · P&L · R · Trades │
│ Open position, orders     │ │ Open position, orders     │
│ Closed trades (P&L, R)    │ │ Closed trades (P&L, R)    │
└───────────────────────────┘ └───────────────────────────┘
```

- **Starea:** „Starts in N”, „Live”, „Paused” sau „Duel over”, plus progresul prin cele 80 de lumânări și ceasul (următoarea închidere, timpul rămas).
- **Graficul:** fereastră care se derulează, ca în Simulator; zona „Duel” separă istoricul de duel.
- **Dock-ul:** Trade (panoul rapid, plus biletul complet sub „Limit order or exact prices”), Position (stop, target, închidere, ordinele în așteptare), tab-ul botului (cine e și mișcările lui). Jos: Pause / Resume, „See the result” la final.
- **Deasupra graficului:** zoom (−, +), înapoi și înainte în timp (←, →), „Back to now” când te uiți în trecut, comutatorul pentru tranzacțiile botului și indicatorii. Rotița face zoom, tragerea graficului îl duce în trecut. Cât timp te uiți înapoi, o etichetă spune că piața continuă.
- **Pe telefon:** biletul de ordin vine imediat după grafic, iar panoul „You vs bot” după el; butonul de jos stă deasupra barei de navigație.

### 2.3 Rezultatul

Scorurile ambilor (Decision Quality, Risk Discipline, R, P&L simulat, tranzacții, scorul de duel), mesajul despre proces și profit, ratingul și XP-ul, graficul complet cu tranzacțiile ambilor, panoul „You vs bot”, momentele-cheie, mișcările botului, cum s-a calculat scorul, apoi Rematch, Next bot, misiunea recomandată.

---

## 3. Implementare

### 3.1 Fișiere

| Fișier | Ce conține |
|---|---|
| `packages/scenario-gen/src/arena.ts` | `duelSpec`: scenariul Arena cu istoricul în plus. |
| `packages/evaluation/src/evaluators.ts`, `types.ts` | `stop_outside_noise`, `entry_not_extended`, pragurile opționale pentru `pacing`; `atr` și `sma20` pe `EntryView`. |
| `packages/missions/src/duel.ts` | Piața pe tick-uri (`duelMarket`, `subdivide`), conversiile lumânare ↔ tick, `duelChartCandles`, tura botului (`botTurn`), foresight-ul (`duelForesight`), rubrica, scorul, verdictul, Elo, daily duel, Mirror, scara de boți. |
| `packages/missions/src/bots.ts` | Personajele și deciziile lor la închiderea lumânării, inclusiv intrarea cu foresight. |
| `packages/missions/test/duel.test.ts` | Testele din §4. |
| `packages/missions/scripts/calibrate-bots.ts` | `npm run bots:calibrate`: fiecare bot, fără și cu foresight. |
| `packages/learning/src/xp.ts`, `packages/academy/src/progress.ts` | XP-ul duelurilor și streak-ul. |
| `packages/ui/src/store.ts` | `DuelSession`, `startDuel`, `saveDuel`, `finishDuel`, `resignDuel`, migrarea. |
| `packages/ui/src/pages/Duels.tsx` | Lobby-ul, duelul live (ceasul, numărătoarea, pauza, tura botului, contul incremental), rezultatul. |
| `packages/ui/src/components/DuelParts.tsx`, `Chart.tsx`, `visuals.ts` | Avatarul și eticheta botului, legenda, panoul „You vs bot”, liniile și markerii botului. |
| `packages/ui/src/styles/screens/duels.css`, `tokens.css`, `chart.css`, `layout.css` | Stilurile duelului, culoarea botului, butonul de jos pe telefon. |

### 3.2 Modelul de date (local)

```ts
interface DuelSession {
  id: string;
  botId: BotId;
  mirrorFlaw?: BotFlaw | null;  // fixat la start
  regime: ArenaRegime;
  seed: number;
  foresight: boolean;           // fixat de seed la start; nu se arată în interfață
  daily?: string;
  cursor: number;               // tick-ul la care a ajuns duelul
  log: LogEntry[];              // acțiunile tale (la tick-ul la care le-ai dat)
  botLog: LogEntry[];           // acțiunile botului (la închiderea lumânărilor)
  botNotes: { candle: number; step: number; text: string }[];
  botNext: number;              // următoarea închidere la care decide botul
  status: "active" | "completed" | "resigned";
  createdAt: number; updatedAt: number; completedAt?: number;
  result?: { winner; reason; you; bot; rated; ratingBefore; ratingAfter; xp };
}
```

Duelul se salvează la fiecare închidere de lumânare, la fiecare ordin, la pauză și la ieșire.

### 3.3 Performanța

- Contul afișat avansează incremental, tick cu tick; se reface de la zero doar dacă se schimbă trecutul.
- Tura botului reface contul lui o dată la 15 secunde. În teste și în calibrare, botul își ține starea incremental (un duel întreg durează ~25 ms).

---

## 4. Criterii de acceptanță

Verificarea: **T** = test automat (`npm test`), **B** = browser automat (Playwright pe build-ul de producție, cu ceasul paginii controlat), **C** = citirea codului.

### Funcționale

| ID | Criteriu | Verificare |
|---|---|---|
| AC1 | Trading Arena are secțiunea „Duels” între Scenarios și Virtual Portfolio, în sidebar și în tab-urile din pagină; `/arena/duels` deschide lobby-ul. | B |
| AC2 | Lobby-ul arată 8 boți, fiecare cu eticheta „Bot”, nume, nivel, rating, stil, defect, „Watch for” și scorul vostru direct. | B |
| AC3 | Botul e identificat ca bot peste tot unde apare: lobby, bara duelului, legenda și etichetele graficului, panoul, rezultatul. | B |
| AC4 | Un duel pornește pe scenariul ales, pe un seed nou, cu 120 de lumânări de istoric și o numărătoare de 10 secunde în care piața stă și botul nu face nimic. Pe Free, scenariile Pro duc la Pricing. Cu un duel activ, pornirea altuia trimite la duelul în curs. | B, C, T |
| AC5 | Ambii jucători joacă pe aceleași lumânări și aceleași tick-uri. | T |
| AC6 | Piața merge continuu: lumânarea se formează în 15 secunde, cu prețul mișcându-se în interiorul ei, iar duelul are 80 de lumânări. Ceasul arată lumânarea curentă, următoarea închidere și timpul rămas. | B, T |
| AC7 | Pauza (buton sau Space) oprește piața; „Resume” o pornește din același loc. Un tab ascuns pune pauză. | B, C |
| AC8 | Tranzacționarea implicită e panoul rapid: un tap pe Buy sau Sell, fără stop obligatoriu, la prețul live, oricând (și în pauză). Butoanele urmează poziția. Cu stop, mărimea se plafonează la 1% risc. Biletul complet rămâne disponibil. | B, T |
| AC9 | Botul decide la închiderea lumânărilor; mișcările lui apar atunci, cu momentul lor. | B, T |
| AC10 | Tranzacțiile botului apar pe grafic: markeri în culoarea botului, liniile poziției și ordinelor lui etichetate cu numele lui; ale utilizatorului rămân neutre; comutatorul „{bot}'s trades” arată marcajul botului. | B |
| AC11 | Panoul „You vs {bot}” arată pentru ambii echitatea, P&L, R, poziția deschisă (cu P&L și R deschis), ordinele și tranzacțiile închise, actualizate live. | B |
| AC12 | La final, pozițiile se închid, apare „See the result”, iar rezultatul arată pentru ambii Decision Quality, Risk Discipline, R, P&L și scorul de duel = round(0,7·Process + 0,3·Outcome), cu formula care se adună exact și un mesaj când profitul și procesul nu sunt de acord. | B, T |
| AC13 | Cine nu are nicio tranzacție pierde; fără tranzacții de ambele părți, e egal; la scor egal decid Risk Discipline, apoi R. | T |
| AC14 | Ratingul se actualizează Elo (K = 32) după duelurile cu rating și se arată înainte → după. Daily duel nu schimbă ratingul. | T, B |
| AC15 | Un duel terminat dă 30 XP, pentru primele 3 dueluri ale zilei; resign nu dă XP. În Levels & XP apare „Duel completed”. | B |
| AC16 | Duelurile terminate apar în Recent activity pe Dashboard și contează pentru streak. | B, C |
| AC17 | Resign cere confirmare, încheie duelul ca înfrângere unde a rămas, fără XP. | B, T |
| AC18 | Un duel părăsit se reia din lobby la tick-ul la care a rămas, cu pozițiile și ordinele de atunci, după numărătoare. | B |
| AC19 | Daily duel are același bot, scenariu și seed pentru toți în aceeași zi și se joacă o dată pe zi. | T, B |
| AC20 | Mirror joacă defectul cel mai frecvent al utilizatorului dintre cele jucabile; fără unul, cardul e dezactivat și explică de ce. | T, B |
| AC21 | Chip-urile Recommended, Rival și Beaten urmează regulile din §1.1. | T, B |
| AC22 | Duelurile salvate în formatul vechi, pe runde, se elimină la încărcare, fără erori. | B |

### Calitate

| ID | Criteriu | Verificare |
|---|---|---|
| AC23 | Fără foresight, botul nu vede viitorul: schimbarea tick-urilor de după o închidere nu schimbă decizia de la acea închidere. | T |
| AC24 | Cu foresight, botul folosește tick-urile următoare și are un scor mediu clar mai mare. Foresight-ul apare în proporția stabilită pe nivel, fixat de seed. Interfața nu-l menționează, iar notele din acele dueluri nu conțin motive inventate. | T, B, C |
| AC25 | Deciziile botului sunt deterministe și se salvează în duel. Motorul nu respinge niciun ordin al boților. | T, C |
| AC26 | Fără foresight, scorul mediu de duel crește de la nivelul 1 la nivelul 5. Fiecare bot cu defect își primește eticheta de eroare în cel puțin o treime din duelurile lui și de peste 3 ori mai des decât Rook și Sage. | T |
| AC27 | Tick-urile unei lumânări reconstituie exact deschiderea, maximul, minimul și închiderea ei; un ordin market dat în mijlocul lumânării se execută la prețul acelui tick. | T |
| AC28 | `npm run typecheck`, `npm test` și `npm run build` trec. | T |
| AC29 | UI-ul folosește componentele și tokenii existenți; fără overflow orizontal la 360, 768 și 1440 px; zero erori și avertismente în consolă pe ecranele de duel. | B, C |
| AC30 | `KNOWLEDGE.md` are regulile duelurilor (inclusiv foresight-ul), iar `README.md` descrie funcționalitatea. | C |
| AC31 | Comutatorul „{bot}'s trades” ascunde și arată tranzacțiile botului: liniile și markerii de pe grafic, banda de mișcări, coloana din panou. | B |
| AC32 | Graficul face zoom cu butoanele și cu rotița mouse-ului. | B |
| AC33 | Graficul se duce în trecut cu butoanele și prin tragere; „Back to now” revine la lumânarea curentă. | B |
| AC34 | Nivelul și ratingul boților sunt fixe (inclusiv Mirror, nivel 3), iar lobby-ul o spune. | B, C |
| AC35 | O tranzacție fără stop are R calculat pe 1% din cont și pierde punctele criteriului „Every entry had a stop-loss”. | T |

---

## 5. Validare (23.10.2026)

Toate criteriile sunt îndeplinite.

| Verificare | Rezultat |
|---|---|
| `npm run typecheck`, `npm test` (160 de teste, dintre care 24 de duel), `npm run build` | Trec |
| Browser: Chrome headless (Playwright) pe build-ul de producție, cu ceasul paginii controlat; un duel întreg de 80 de lumânări, pauza, Space, panoul rapid (fără stop, cu stop și plafon, butoanele după poziție), biletul complet, comutatorul botului, zoom și privire în trecut (butoane, rotiță, tragere), reluarea, resign; 360, 768 și 1440 px | 54 / 54 |
| AC5, AC13, AC23–AC27, AC35 | `packages/missions/test/duel.test.ts` |
| AC30 | „Trading Arena → Duels” în `KNOWLEDGE.md`; Duels în `README.md` |

Câteva cifre din browser: la start se văd 106 lumânări pe ecranul de 1440 px; un ordin market dat în pauză s-a executat exact la ask-ul afișat; după 15 secunde de piață ceasul arăta „Candle 2 of 80 · 19:43 left”; reluat din lobby, duelul a continuat de la lumânarea 5, cu poziția deschisă.

**Calibrarea boților** (`npm run bots:calibrate 10`: 9 scenarii × 10 seed-uri pe bot):

| Bot | Nivel | Scor fără foresight | Scor cu foresight | Tranzacții / duel (fără) | Defectul jucat (fără foresight) |
|---|---|---|---|---|---|
| Pip | 1 | 33 | 56 | 59,5 | stopuri în zgomot 100% |
| Dash | 1 | 51 | 78 | 80,0 | overtrading 100% |
| Blaze | 2 | 67 | 84 | 4,6 | intrări întinse 76% |
| Grudge | 2 | 70 | 81 | 4,2 | revenge sizing 69% |
| Hope | 3 | 71 | 88 | 2,9 | stop mutat 96% |
| Rook | 4 | 82 | 97 | 3,3 | — |
| Sage | 5 | 87 | 95 | 5,0 | — |

Fără foresight, scorul mediu crește cu nivelul. Cu foresight, boții câștigă de regulă (Rook și Sage ajung la 95–97). Motorul nu a respins niciun ordin al boților.

**Corecturi apărute la validare:**
- eticheta „Duel” a zonei de pe grafic se suprapunea cu „Now” pe ecranul live (acum zona e doar umbrită acolo);
- panoul rapid moștenea stilurile acțiunilor rapide de pe Dashboard (aceeași clasă, `ml-quick`); acum are clasele lui (`ml-qt-*`);
- etichetele „Paused” și „Looking back” se suprapuneau peste titlul graficului (acum stau împreună, sub el).

## 6. Riscuri

| Risc | Ce facem |
|---|---|
| Foresight-ul ascuns se află | Riscul e asumat prin decizia 6. Notele botului nu mint, deci nimic din interfață nu e fals; dar utilizatorii pot trage concluzii greșite despre strategiile care „merg”. De reevaluat înainte de lansarea publică (brief §3.2). |
| Duelul de 20 de minute e lung | Pauza, salvarea continuă și reluarea din lobby. Durata e o constantă (`DUEL_CANDLES`, `CANDLE_SECONDS`). |
| Boții prea previzibili | Calibrarea prin teste (AC26), zgomot determinist pe seed, regimul se schimbă de la un duel la altul. |
| Scorul de proces pare nedrept | Regulile se arată în lobby și în rezultat; mesajul explicit din AC12. Ponderea 70/30 rămâne de verificat cu utilizatori. |
