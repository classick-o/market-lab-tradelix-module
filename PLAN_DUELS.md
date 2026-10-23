# MARKET//LAB · Duels: plan de dezvoltare și funcționare

**Data:** 23 octombrie 2026
**Sursă:** [BRIEF_DUELS.md](BRIEF_DUELS.md) (analiza), plus deciziile de mai jos.
**Ce acoperă:** faza D1 din brief: dueluri 1v1 contra boților, care rulează local, în browser, pe arhitectura de acum. Cum funcționează, cum arată, cum se construiește și criteriile de acceptanță.
**Ce nu acoperă:** duelurile cu oameni (D2, D3). Au nevoie de backend și rămân în brief.

---

## 0. Decizii

| # | Decizie | Sursa |
|---|---|---|
| 1 | Boții sunt **declarați**. Fiecare apare cu eticheta „BOT” peste tot unde e afișat. | Utilizator, 23.10.2026 |
| 2 | Utilizatorul **vede tranzacțiile botului**: pe grafic și într-un panou „Tu vs bot”, cu pozițiile deschise, ordinele și tranzacțiile închise ale fiecăruia. | Utilizator, 23.10.2026 |
| 3 | Deciziile botului dintr-o rundă se văd abia după ce utilizatorul și-a încheiat runda (decizii simultane). Ce a făcut botul în rundele anterioare se vede tot timpul. | Plan: decizia 2 fără ea ar permite copierea în aceeași rundă. |
| 4 | Format pe runde: 8 runde × 10 lumânări, cu timer de decizie reglabil (30 s, 60 s sau oprit). | Brief §1.2; timerul reglabil e cerut și de accesibilitate (WCAG 2.2.1). |
| 5 | Scor de duel = 70% Decision Quality + 30% rezultat în R. | Brief §1.3 |
| 6 | Stop obligatoriu și risc maxim 1% pe ordin, impuse de motor. | Brief §1.1 |
| 7 | XP: 30 pentru un duel terminat, pentru primele 3 dueluri ale zilei. Nimic pentru victorie sau abandon. | Brief §1.3, plus plafon anti-farming |
| 8 | Duelurile contra boților nu consumă sesiunile Arena ale planului Free. Scenariile Pro rămân Pro. | Brief §8.7–8.8 |

---

## 1. Cum funcționează

### 1.1 Lobby-ul (`/arena/duels`)

- **Duelul în curs,** dacă există: un card cu „Resume” și „Resign”. Un singur duel activ odată.
- **Ratingul tău:** pornește de la 1000. Plus victorii, înfrângeri, egaluri și rivalul curent.
- **Daily duel:** în fiecare zi, același bot, același scenariu și aceeași piață pentru toți (seed din dată). Se joacă o dată pe zi și nu schimbă ratingul.
- **Setările duelului:** scenariul (cele 9 din Arena; cele Pro sunt blocate pe Free) și timerul (30 s, 60 s, Off).
- **Sparring partners:** cele 8 personaje (§1.7), fiecare cu nivel, rating, stil, defectul pe care îl joacă, ce să urmărești și scorul vostru direct. Chip-uri:
  - **Recommended:** botul neînvins cu ratingul cel mai apropiat de al tău;
  - **Rival:** botul care te-a bătut în ultimele două dueluri la rând;
  - **Beaten:** botul pe care l-ai bătut de cel puțin 2 ori.
- **Recent duels:** ultimele dueluri, cu adversarul, scenariul, rezultatul și scorurile, cu link spre rezultat.

### 1.2 Pornirea

- Duelul primește un seed nou. Ambii jucători joacă pe aceeași piață: `arenaContext(regime, seed)`.
- Regulile motorului pentru duel: stop obligatoriu (`requireStop`), risc maxim 1% impus (`enforceMaxRisk`), fără levier, short permis dacă scenariul îl permite.
- Pornește de la lumânarea 59, ca Arena: primele 60 de lumânări sunt istoricul vizibil.

### 1.3 Runda

Pentru runda `r` (0–7), pasul de decizie e `t = 59 + 10·r`.

1. **Decizia:** utilizatorul vede graficul până la `t`, pozițiile și ordinele ambilor jucători și notițele botului din rundele trecute. Poate:
   - plasa un ordin market sau limit, cu stop (obligatoriu) și target opțional, dimensionat din risc;
   - modifica stopul și targetul poziției;
   - anula un ordin în așteptare;
   - închide poziția (toată sau jumătate).

   Un ordin fără stop sau cu risc peste 1% e respins de motor, cu mesajul lui.
2. **Commit:** butonul „Ready” sau expirarea timerului. Abia acum botul își calculează decizia (doar din lumânările `0…t`) și ea devine vizibilă.
3. **Playback:** cele 10 lumânări rulează pentru amândoi, cu viteza din Preferences. Stopurile, targeturile și limitele se execută singure. „Skip” sare la finalul rundei. Cu reduced motion, runda apare direct.
4. După runda a 8-a, ambele poziții deschise se închid la market și apare rezultatul.

**Ieșirea în timpul duelului:** duelul rămâne activ și se reia de la runda curentă, cu ordinele deja plasate. Timerul repornește de la plin.
**Resign:** cu confirmare. Contează ca înfrângere, fără XP.

### 1.4 Ce se vede din bot

| Moment | Ce se vede |
|---|---|
| În timpul deciziei | Poziția deschisă a botului (direcție, cantitate, intrare, stop, target, P&L deschis, R deschis), ordinele lui în așteptare, tranzacțiile lui închise, notițele lui din rundele trecute. |
| Pe grafic | Intrările și ieșirile botului (markeri în culoarea botului), plus liniile poziției lui (intrare, stop, target, limite), etichetate cu numele lui. Ale tale rămân în culorile obișnuite. O legendă spune care e care. |
| La commit | Decizia botului din runda curentă și motivul ei („Uptrend: SMA 20 above SMA 50, price pulled back to it…”). |
| În timpul playback-ului | Totul, actualizat la fiecare lumânare. |

Culoarea nu e singurul indiciu: liniile botului au numele lui în etichetă, iar markerii lui au contur dublu.

### 1.5 Scorul și câștigătorul

Pentru fiecare jucător, separat:

```
Process  = Decision Quality pe rubrica de duel (0–100)
R        = suma R-multiple-urilor tranzacțiilor (profit net / riscul inițial)
Outcome  = round(clamp(50 + 50 × R / 3, 0, 100))
Duel     = round(0,7 × Process + 0,3 × Outcome)
```

**Rubrica de duel** (stopul și riscul sunt impuse de motor, deci nu mai intră în scor):

| Criteriu | Evaluator | Pondere | Eticheta de eroare |
|---|---|---|---|
| Planned exits worth the risk | `reward_risk_planned` (R:R ≥ 1,5) | 20 | — |
| Stops outside normal noise | `stop_outside_noise` (nou: stop ≥ 0,8 ATR) | 15 | `stop_inside_noise` |
| Entries not chasing extended moves | `entry_not_extended` (nou: intrare la ≤ 2,5 ATR de SMA 20) | 15 | `chased_entry` |
| Never widened a stop | `no_stop_widening` | 20 | `moved_stop_away` |
| Kept risk steady after losses | `no_revenge_sizing` | 15 | `revenge_size_up` |
| Traded selectively | `pacing` (≤ 3 intrări: 1; ≤ 5: 0,6; peste: 0,2) | 15 | `overtrading` |

- **Risk Discipline** = criteriile de disciplină din rubrică (stop lărgit, mărime după pierdere).
- **Fără nicio tranzacție:** pierzi duelul. Dacă niciunul nu a tranzacționat, e egal.
- **La egalitate de scor:** decide Risk Discipline, apoi R, apoi e remiză.
- **Mesajul rezultatului** spune explicit când profitul și procesul arată în direcții diferite („Rook made more money, but you won on process”).

### 1.6 Rating, XP, istoric

- **Rating Elo:** K = 32, ratingul inițial 1000, minimum 100. Boții au rating fix. Daily duel nu schimbă ratingul.
- **XP:** 30 pentru duelul terminat, pentru primele 3 dueluri ale zilei (`XP_RULES.duel`). Nimic pentru resign. Victoria nu dă XP.
- **Streak:** un duel terminat contează ca activitate pentru streak, ca o sesiune Arena.
- **Recent activity** (Dashboard) include duelurile terminate, cu scorul de proces.
- **Levels & XP:** motivul „Duel completed”.

### 1.7 Boții

Fiecare bot primește doar lumânările deja dezvăluite și propria stare. Dimensionează cu aceeași funcție ca omul (`maxQtyForRisk`), deci ordinele lui trec prin aceleași reguli. Zgomotul lui e deterministic (seed-ul duelului + id-ul botului + runda).

| Bot | Nivel | Rating | Stil | Defectul | De urmărit |
|---|---|---|---|---|---|
| **Pip** | 1 | 850 | Intră aproape în fiecare rundă, pe direcția ultimei lumânări | Stopuri prea strânse, targeturi sub 1R, lărgește uneori stopul | E scos de zgomot, apoi prețul merge unde credea. |
| **Dash** | 1 | 950 | Intră în fiecare rundă, iese după o rundă | Overtrading, targeturi mici | Comisioanele îi mănâncă rezultatul. |
| **Grudge** | 2 | 1050 | Trend, intrări dese | Dublează riscul după o pierdere | O pierdere mare după două mici. |
| **Blaze** | 2 | 1150 | Cumpără lumânările mari și breakout-urile | Intră pe mișcări deja extinse | Intră la vârf. |
| **Hope** | 3 | 1250 | Trend, intrări pe pullback | Își mută stopul când prețul se apropie | Pierderi rare, dar mari. |
| **Rook** | 4 | 1400 | Trend disciplinat, pullback pe SMA 20 | — | Greu de bătut în trend, slab în range. |
| **Sage** | 5 | 1550 | Răbdător: marginile range-ului sau pullback în trend, R:R ≥ 2 | — | Stă mult pe loc. |
| **Mirror** | adaptiv | 1150 | Trend | Defectul tău cel mai frecvent dintre cele de mai sus | Te vezi pe tine. |

- **Mirror** ia eticheta de eroare cea mai frecventă din rezultatele tale (misiuni, Arena, dueluri) dintre cele pe care un bot le poate juca. Fără una, cardul e dezactivat și spune de ce. Defectul ales se salvează în duel.
- **Notițele botului:** la fiecare rundă, ce a făcut și de ce, în personaj. Reacțiile sunt despre propriul proces; niciuna nu îndeamnă utilizatorul să riște.
- **Deciziile botului se salvează în duel** (jurnalul lui de acțiuni). Rezultatul unui duel vechi nu se schimbă dacă boții sunt ajustați mai târziu.

### 1.8 Ce nu intră în D1

Dueluri cu oameni, înregistrări ale altor jucători, clasamente, reacții trimise de utilizator, duelurile în Trade Journal (Session History, Replay, Alternatives). Pentru replay, rezultatul duelului are propriul grafic complet.

---

## 2. UI

Toate ecranele folosesc componentele existente (`PageHead`, `SubNav`, `Card`, `StageBar`, `Chart`, `OrderTicket`, `Tabs`, `Segmented`, `Button`, `Tag`, `KeyValues`, `Dialog`, `ScoreRing`, `Empty`, `Pnl`) și tokenii din `tokens.css`. Singurul token nou e culoarea botului.

| Token nou | Valoare | De ce |
|---|---|---|
| `--ml-rival` | `#d6b47a` (nisip) | Distinct de accent (albastru), de violetul secundar (SMA 50), de verde și roșu (rezultate și lumânări). Contrast peste 9:1 pe negru. |
| `--ml-rival-soft` | `rgba(214, 180, 122, 0.1)` | Fundaluri discrete (coloana botului, avatarul). |

### 2.1 Lobby

```
Duels                                                     [SubNav: Simulator · Scenarios · Duels · ...]
Trade the same simulated market as a bot, round by round. The better process wins, not the bigger profit.

┌ Duel in progress ───────────────────────────────┐  (doar dacă există)
│ vs Rook · BOT · Breakout · round 3 of 8   [Resume] [Resign] │
└─────────────────────────────────────────────────┘
┌ Your rating ──────┐ ┌ Daily duel ─────────────┐ ┌ How duels work ───────────┐
│ 1016  · 3W 2L 0D  │ │ Blaze · BOT · Sideways  │ │ 8 rounds × 10 candles ... │
│ Rival: Grudge     │ │ [Play today's duel]     │ │ Duel = 70% process + 30% R│
└───────────────────┘ └─────────────────────────┘ └───────────────────────────┘
┌ Start a duel ──────────────────────────────────────────────────────────────┐
│ Scenario: [Bullish] [Bearish] [Sideways] ...      Round timer: [30 s|60 s|Off] │
└────────────────────────────────────────────────────────────────────────────┘
Sparring partners
┌ (P) Pip  BOT ──────────┐ ┌ (D) Dash BOT ─────────┐ ┌ (R) Rook BOT  Recommended ┐ ...
│ Level 1 · rating 850   │ │ ...                   │ │ Trend follower ...        │
│ Plays: tight stops     │ │                       │ │ Watch for: ...            │
│ You 2–1  ·  Beaten     │ │                       │ │ [Duel Rook]               │
└────────────────────────┘ └───────────────────────┘ └───────────────────────────┘
Recent duels
```

### 2.2 Duelul

```
← Duels   DUEL · BREAKOUT · ROUND 3 OF 8                       [0:24]  [Resign]
          You vs Rook · BOT
[■■□□□□□□  Round 3 · your move]
┌───────────────────────────────────────────────┐ ┌ [Order] [Position] [Rook] ┐
│ LABX · ● You  ◆ Rook (bot)                    │ │ Order ticket              │
│ grafic: istoric + rundele jucate, vălul peste │ │ Buy/Sell · Market/Limit   │
│ rundele rămase; liniile tale și ale lui Rook  │ │ Stop (required) · Target  │
│                                               │ │ Risk ≤ 1%                 │
├───────────────────────────────────────────────┤ │ [Place order]             │
│ ┌ You ────────────────┐ ┌ Rook · BOT ───────┐ │ ├───────────────────────────┤
│ │ Equity · P&L · R    │ │ Equity · P&L · R  │ │ │ [Ready · play round 3 →]  │
│ │ Open: Long 120 ...  │ │ Open: Flat        │ │ └───────────────────────────┘
│ │ Orders: —           │ │ Orders: buy limit │ │
│ │ Closed trades (R)   │ │ Closed trades (R) │ │
│ └─────────────────────┘ └───────────────────┘ │
└───────────────────────────────────────────────┘
```

- **Tab-ul Order:** biletul de ordin existent, cu stopul obligatoriu, plus „Place order” direct (fără dialogul de jurnal din Arena; runda are timer).
- **Tab-ul Position:** stopul și targetul poziției tale, „Close half”, „Close position”, ordinele în așteptare cu „Cancel”.
- **Tab-ul botului:** cine e (stil, defect, ce să urmărești) și notițele lui pe runde.
- **Panoul „You vs Rook”** stă sub grafic și dock, pe toată lățimea. Pe telefon vine după biletul de ordin, cu coloanele una sub alta, ca biletul să fie imediat sub grafic.
- **Timer-ul** apare în bara de sus; ultimele 10 secunde sunt evidențiate. Un text pentru cititorul de ecran anunță 10 secunde rămase.

### 2.3 Rezultatul

```
← Duels   DUEL RESULT · SYNTHETIC DATA
          You won the duel · 69 vs 63
┌──────────────────────┬──────────┬──────────────┐
│                      │   You    │  Rook · BOT  │
│ Decision quality     │    82    │     58       │
│ Risk discipline      │   100    │     70       │
│ Outcome              │ −0.6R    │   +1.4R      │
│ Simulated P&L        │ −58 vUSD │  +141 vUSD   │
│ Duel score           │    69    │     63       │
└──────────────────────┴──────────┴──────────────┘
"Rook made more money, but you won on process: Rook widened a stop in round 5."
Rating 1000 → 1016 (+16) · +30 XP
[grafic complet cu tranzacțiile ambilor] · [panoul You vs Rook, tranzacțiile închise]
┌ Key moments ─────────────┐ ┌ What Rook was thinking ───┐
│ ce a mers, ce nu (ambii) │ │ notițele pe runde         │
└──────────────────────────┘ └───────────────────────────┘
┌ How the duel score was built ─ criteriile ambilor, formula cu cifrele ┐
[Rematch] [Next: Sage] [Recommended mission] [Back to Duels]
```

### 2.4 Responsive

- ≥ 1024px: graficul și panoul în stânga, dock-ul în dreapta (ca Arena).
- < 1024px: o coloană; dock-ul sub grafic, cu butonul „Ready” lipit jos (ca Arena).
- ≤ 760px: panoul „You vs bot” pe o coloană; cardurile boților pe o coloană; tabelul de scoruri rămâne cu 3 coloane.

---

## 3. Implementare

### 3.1 Fișiere

| Fișier | Ce conține |
|---|---|
| `packages/evaluation/src/evaluators.ts`, `types.ts` | Evaluatorii noi `stop_outside_noise` și `entry_not_extended`; câmpurile opționale `atr` și `sma20` pe `EntryView`; pragurile opționale pentru `pacing`. |
| `packages/missions/src/bots.ts` (nou) | Personajele, politica fiecărui stil, defectele, notițele. |
| `packages/missions/src/duel.ts` (nou) | Configurația, contextul, runda botului, rubrica, scorul, verdictul, Elo, daily duel, Mirror. |
| `packages/missions/test/duel.test.ts` (nou) | Testele din §4. |
| `packages/learning/src/xp.ts` | `XP_RULES.duel`, `DUEL_XP_PER_DAY`. |
| `packages/academy/src/…` | Duelurile în activitatea pentru streak. |
| `packages/ui/src/store.ts` | `DuelSession`, `duels`, `duelRating`, metodele de duel. |
| `packages/ui/src/progress.ts`, `pages/Progress.tsx` | Recent activity și eticheta XP. |
| `packages/ui/src/nav.ts`, `MarketLab.tsx` | Secțiunea și rutele. |
| `packages/ui/src/components/Chart.tsx`, `visuals.ts` | Linii și markeri cu `owner: "rival"`. |
| `packages/ui/src/pages/Duels.tsx` (nou) | Lobby-ul, duelul, rezultatul. |
| `packages/ui/src/components/DuelParts.tsx` (nou) | Avatarul botului, panoul „You vs bot”, legenda. |
| `packages/ui/src/styles/screens/duels.css` (nou), `tokens.css` | Stilurile ecranelor și culoarea botului. |
| `KNOWLEDGE.md`, `README.md` | Regulile de duel și funcționalitatea nouă. |

### 3.2 Modelul de date (local)

```ts
interface DuelSession {
  id: string;
  botId: BotId;
  mirrorTag?: string;           // defectul jucat de Mirror, fixat la start
  regime: ArenaRegime;
  seed: number;
  timer: 0 | 30 | 60;           // secunde pe decizie; 0 = fără timer
  daily?: string;               // ziua, pentru daily duel
  round: number;                // runde jucate (0–8)
  log: LogEntry[];              // acțiunile tale
  botLog: LogEntry[];           // acțiunile botului
  botNotes: { round: number; step: number; text: string }[];
  status: "active" | "completed" | "resigned";
  createdAt: number; updatedAt: number; completedAt?: number;
  result?: {
    winner: "you" | "bot" | "draw";
    reason: "score" | "discipline" | "outcome" | "no_trade" | "resigned" | "draw";
    you: DuelSideSummary; bot: DuelSideSummary;
    rated: boolean; ratingBefore: number; ratingAfter: number; xp: number;
  };
}
// LabData: duels: Record<string, DuelSession>; duelRating: number
```

Datele vechi primesc automat `duels: {}` și `duelRating: 1000` prin `migrate`, care completează câmpurile lipsă.

### 3.3 Politica botului (rezumat)

La fiecare pas de decizie `t`, botul primește `candles.slice(0, t + 1)`, starea lui și regulile:
1. **Gestionarea poziției:** Hope își lărgește stopul când prețul e la mai puțin de 0,4 ATR de el; Dash închide după o rundă; Rook și Sage închid când trendul pe care l-au tranzacționat s-a întors (SMA 20 trece de SMA 50).
2. **Intrarea,** dacă e flat și fără ordin în așteptare: semnalul stilului (trend-pullback, range, momentum, aleator), o șansă de a sări peste setup (zgomotul nivelului), stopul (structură sau ATR), targetul (multiplu de R), mărimea din risc (Grudge dublează riscul după o pierdere, sub plafonul de 1%).
3. **Notița:** ce a făcut și de ce, cu prețurile.

Ordinul trece prin `previewOrder`. Dacă motorul l-ar respinge, botul nu-l trimite și notează că a așteptat.

### 3.4 Etapele și commit-urile

1. Planul și actualizarea brief-ului.
2. Logica: evaluatori, boți, duel, teste.
3. Store, XP, activitate, streak.
4. UI: navigație, rute, grafic, lobby, duel, rezultat, stiluri.
5. Validarea (teste, typecheck, build, Playwright pe 3 lățimi), corecturile, KNOWLEDGE și README.

---

## 4. Criterii de acceptanță

Verificarea: **T** = test automat (`npm test`), **B** = browser automat (Playwright, build local), **C** = citirea codului.

### Funcționale

| ID | Criteriu | Verificare |
|---|---|---|
| AC1 | Trading Arena are secțiunea „Duels” între Scenarios și Virtual Portfolio, în sidebar și în tab-urile din pagină; `/arena/duels` deschide lobby-ul. | B |
| AC2 | Lobby-ul arată 8 boți, fiecare cu eticheta „BOT”, nume, nivel, rating, stil, defect, „Watch for” și scorul vostru direct. | B |
| AC3 | Botul e identificat ca bot peste tot unde apare: lobby, bara duelului, legenda și etichetele graficului, panoul, rezultatul. | B |
| AC4 | Un duel pornește cu scenariul și timerul alese, pe un seed nou. Pe Free, scenariile Pro duc la Pricing. Cu un duel activ, pornirea altuia cere întâi Resume sau Resign. | B, C |
| AC5 | Ambii jucători joacă pe aceleași lumânări. | T |
| AC6 | Duelul are 8 runde × 10 lumânări. În decizie, utilizatorul poate plasa ordine market și limit, modifica stopul și targetul, anula ordine, închide poziția. Un ordin fără stop sau cu risc peste 1% e respins, cu mesajul motorului. | T, B |
| AC7 | Decizia botului dintr-o rundă apare doar după commit (Ready sau timer). | B, C |
| AC8 | Timer-ul numără descrescător și, la zero, încheie runda automat. Cu „Off”, nu există timer. | B |
| AC9 | Tranzacțiile botului apar pe grafic: markeri de intrare și ieșire în culoarea botului, liniile poziției și ale ordinelor lui etichetate cu numele lui; ale utilizatorului rămân neutre; legenda le explică. | B |
| AC10 | Panoul „You vs {bot}” arată pentru fiecare: echitate, P&L, R total, poziția deschisă (direcție, cantitate, intrare, stop, target, P&L și R deschis), ordinele în așteptare și tranzacțiile închise (R și P&L), actualizate în timpul playback-ului. | B |
| AC11 | Notițele botului (ce a făcut și de ce) sunt disponibile pe runde, în duel și în rezultat. | B |
| AC12 | Runda rulează animat cu viteza din Preferences; „Skip” o termină imediat; cu reduced motion apare direct. | B, C |
| AC13 | Rezultatul arată, pentru ambii, Decision Quality, Risk Discipline, R, P&L simulat și scorul de duel = round(0,7·Process + 0,3·Outcome), plus un mesaj explicit când profitul și procesul nu sunt de acord. | T, B |
| AC14 | Cine nu are nicio tranzacție pierde; fără tranzacții de ambele părți, e egal; la scor egal decid Risk Discipline, apoi R. | T |
| AC15 | Ratingul se actualizează Elo (K = 32) după duelurile cu rating și se arată înainte → după. Daily duel nu schimbă ratingul. | T, B |
| AC16 | Un duel terminat dă 30 XP, pentru primele 3 dueluri ale zilei; resign nu dă XP; victoria nu dă XP în plus. În Levels & XP apare „Duel completed”. | T, B |
| AC17 | Duelurile terminate apar în Recent activity pe Dashboard și contează pentru streak. | B, C |
| AC18 | Resign cere confirmare, încheie duelul ca înfrângere, fără XP. | B |
| AC19 | Un duel părăsit se reia din lobby la runda curentă, cu ordinele deja plasate. | B |
| AC20 | Daily duel are același bot, scenariu și seed pentru toți în aceeași zi și se joacă o dată pe zi. | T, B |
| AC21 | Mirror joacă defectul cel mai frecvent al utilizatorului dintre cele jucabile; fără unul, cardul e dezactivat și explică de ce. | T, B |
| AC22 | Chip-urile Recommended, Rival și Beaten urmează regulile din §1.1. | C, B |

### Calitate

| ID | Criteriu | Verificare |
|---|---|---|
| AC23 | Botul nu vede viitorul: schimbarea lumânărilor de după pasul de decizie nu schimbă decizia. | T |
| AC24 | Deciziile botului sunt deterministe (același duel → aceleași acțiuni) și se salvează în duel. | T, C |
| AC25 | Motorul nu respinge niciun ordin al boților, pe toate scenariile și pe zeci de seed-uri. | T |
| AC26 | Nivelurile sunt ordonate: în medie, pe multe dueluri, scorul de duel crește de la nivelul 1 la nivelul 5. Fiecare bot cu defect își primește eticheta de eroare în cel puțin o treime din duelurile lui și de peste 3 ori mai des decât Rook și Sage. | T |
| AC27 | `npm run typecheck`, `npm test` și `npm run build` trec. | T |
| AC28 | UI-ul folosește componentele și tokenii existenți; fără overflow orizontal la 360, 768 și 1440 px; zero erori și avertismente în consolă pe ecranele de duel. | B, C |
| AC29 | `KNOWLEDGE.md` are regulile duelurilor, iar `README.md` descrie funcționalitatea. | C |

---

## 5. Validare (23.10.2026)

Toate criteriile sunt îndeplinite. Testele automate rulează cu `npm test`; verificările din browser au rulat cu Chrome headless (Playwright) pe build-ul de producție, la 360, 768 și 1440 px.

| Verificare | Rezultat |
|---|---|
| `npm run typecheck`, `npm test` (153 de teste, dintre care 17 de duel), `npm run build` | Trec |
| Browser: 40 de verificări pentru AC1–AC4, AC6–AC13, AC15–AC22, AC28 | 40 / 40 |
| AC5, AC14, AC23–AC26 | `packages/missions/test/duel.test.ts` |
| AC29 | Secțiunea „Trading Arena → Duels” din `KNOWLEDGE.md`, Duels în `README.md` și `DESIGN.md` |

**Calibrarea boților** (`npm run bots:calibrate 20`: 9 scenarii × 20 seed-uri pe bot). Scorul mediu de duel crește cu nivelul:

| Bot | Nivel | Scor mediu | Decision Quality | Tranzacții / duel | Defectul jucat (din dueluri) |
|---|---|---|---|---|---|
| Pip | 1 | 47 | 59 | 6,7 | stopuri în zgomot 100% |
| Dash | 1 | 59 | 70 | 8,0 | overtrading 100% |
| Grudge | 2 | 68 | 77 | 2,9 | revenge sizing 71% |
| Blaze | 2 | 71 | 81 | 1,7 | intrări întinse 51% |
| Hope | 3 | 77 | 90 | 1,9 | stop mutat 43% |
| Rook | 4 | 82 | 98 | 2,0 | — |
| Sage | 5 | 84 | 98 | 2,7 | — |

Motorul nu a respins niciun ordin al boților.

**Corecturi apărute la validare:**
- timerul expirat încheia imediat și runda următoare (se resetează acum la commit);
- Outcome intra în scor cu zecimale, iar formula afișată nu se aduna exact (acum e rotunjit);
- pe telefon, biletul de ordin era sub panoul „You vs bot” (panoul s-a mutat sub dock);
- pe telefon, butonul lipit jos al dock-ului stătea sub bara de navigație, și în duel, și în Simulatorul existent (regula comună din `layout.css` îl ridică acum deasupra barei);
- „entrys” în textele evaluatorilor (pluralul cuvintelor terminate în „y”).

## 6. Riscuri

| Risc | Ce facem |
|---|---|
| Boții prea previzibili sau prea ușor de bătut | Calibrarea prin teste (AC26); zgomot determinist pe seed; regimul se schimbă de la un duel la altul. |
| Scorul de proces pare nedrept | Regulile se arată în lobby și în rezultat; mesajul explicit din AC13. Ponderea 70/30 rămâne de verificat cu utilizatori. |
| Copierea botului | Deciziile simultane (decizia 3). Copierea cu o rundă întârziere e permisă și se vede în rezultat. |
| Ecranul de duel prea încărcat pe telefon | Panoul pe o coloană, dock-ul sub grafic cu „Ready” lipit jos, ca în Arena. |
