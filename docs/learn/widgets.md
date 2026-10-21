# Widget-urile cursului

Specificația celor **13 widget-uri** din faza Try (7 existente, cu modul task, și 6 noi) și a componentelor de interacțiune pe care le folosesc beat-urile. Pleacă de la cerințele scrise în fiecare unitate (secțiunea „Cerințe pentru widget-uri” din U1–U5); cifrele exacte ale fiecărui task sunt în lecția lui.

## Modelul comun al unui task

Toate widget-urile au aceleași reguli. Ce e mai jos nu se mai repetă la fiecare widget.

| Element | Regula |
|---|---|
| Configurare din conținut | valori de start, controale blocate (`locked`), rânduri de ieșire ascunse până la reușită (`hidden`), obiectivul, condiția de reușită, cazurile de feedback, indiciile, starea „Show me” |
| Condiția de reușită | declarativă (`SuccessSpec`), evaluată de funcția pură `evaluateSuccess`, testată; calculele în cenți și în unități întregi, cu funcțiile motorului (`commission`, `maxQtyForRisk`, `riskAmount`) |
| Cazuri de feedback | `feedbackCases`: condiții declarative pe starea curentă, fiecare cu textul ei; se afișează primul caz care se potrivește; textele au placeholders (`{stop}`, `{rr}` …) completate din starea widget-ului, cu 2 zecimale la prețuri |
| Verificare | doar la **Check**, nu la fiecare mișcare, ca pragul să nu se găsească urmărind o bifă |
| Butoane | Check · Reset (înapoi la start) · Show me (animă starea corectă în 400–600ms; instant cu reduced motion) |
| Indicii | 3 în trepte (direcție → regulă → primul pas calculat), tasta `H`; după a doua încercare greșită, următorul indiciu apare singur |
| Stări | idle → engaged → submitted → correct / incorrect → resolved |
| Dovezi pentru stăpânire | prima încercare corectă = 1, după indiciu sau greșeală = 0,5, pe conceptul task-ului |
| Feedback | sub widget, `aria-live="polite"`, focusul trece pe el după Check; corect are bifă desenată și text; greșit are text neutru, niciodată roșu pe tot widget-ul |
| Desen | Learn Chart Kit (PLAN_LEARN §8), rolurile de culoare din §8.2; verde-salvia și roșu-cărămiziu doar pentru lumânări și rezultate simulate, niciodată pentru corect / greșit |
| Tastatură | fiecare control are variantă completă; nivelurile trase: săgeți ±0.01, Shift + săgeți ±0.10; slidere: săgeți, PageUp / PageDown, Home / End |
| Câmpuri numerice | acceptă virgulă sau punct, ignoră unitatea de la final (`%`, `R`, `vUSD`), tratează „−” ca minus; aceeași parsare ca la întrebări (vezi [issues-and-decisions.md](issues-and-decisions.md), C1) |

## Cele 13 widget-uri

| Widget | Stare | Lecții (task) |
|---|---|---|
| candle-builder | există, primește modul task | L01 |
| spread-cost | există, primește câmpul de comision și răspuns | L02 |
| order-fill | **nou** | L03 |
| bracket-builder | **nou** (și modul „stop only” în hook-ul L04) | L04 |
| trend-classifier | **nou** | L05 |
| level-drawer | **nou** | L06 |
| ma-period | **nou** | L07 |
| loss-recovery | există, primește modul task | L08 |
| position-size | există, primește blocări, mod „units: learner”, riglă de preț | L10, L09, L16 |
| risk-reward | există, **refăcut** cu prețuri în loc de distanțe | L11, L14, L15 |
| expectancy | există, primește modul task și panoul „Losing runs” | L11 (Learn), L17, L18 |
| exposure | există, **refăcut** cu poziția și levierul separate | L12 |
| bias-spotter | **nou** | L13 |

---

### candle-builder (L01)

- **Controale:** Open, High, Low, Close: slidere 97.00–103.00, pas 0.10.
  - **Schimbare:** High și Low afișează valoarea efectivă (high ≥ max(open, close), low ≤ min(open, close)). Azi un high sub corp e acceptat și înlocuit în tăcere.
- **Desen:** o lumânare `Candles`, cu cipuri de preț pentru O, H, L, C.
- **Ieșiri:** Direction, Body, Upper wick, Lower wick, Range și o notă text. Nota poate combina „small body” cu „long lower wick”; azi prima o ascunde pe a doua.
- **Task L01:**
  - start 100.00 / 101.50 / 99.20 / 101.00;
  - reușită, pe valorile efective: close < open ∧ (close − low) ≥ 2 × (open − close) ∧ (close − low) > (high − open);
  - Show me 100.00 / 100.20 / 98.80 / 99.70;
  - feedback după prima condiție care pică; placeholders {body}, {upper}, {lower}, {low}.

### spread-cost (L02)

- **Controale:**
  - Units 1–200, pas 1;
  - Mid 20.00–200.00, pas 0.50;
  - Spread 0.02–0.50, pas 0.02;
  - **nou: Commission 0.00–0.20%, pas 0.01% (implicit 0.05%),** trecut în `commission(notional, bps)`.
- **Ieșiri:** ask, bid, spread cost, comisionul la intrare și la ieșire (fiecare rotunjit în sus la cent), round-trip cost, break-even per unit.
- **Mod task nou:** câmpul „Your answer (vUSD)”. Rândurile de cost sunt mascate până la trimitere, apoi apar cu `Formula`: „10.00 + 2.51 + 2.50 = 15.01”.
- **Task L02:**
  - start 50 / 100.00 / 0.10 / 0.05%;
  - reușită: units 100 ∧ mid 50.00 ∧ spread 0.10 ∧ commission 0.05% ∧ |răspuns − 15.01| ≤ 0.01;
  - cazuri de feedback pentru răspunsurile tipice: 10.00 (fără comision), 12.50 sau 12.51, 5.00 sau 5.01, 20.00 sau 20.01.

### order-fill (L03, nou)

- **Grafic:**
  - `Candles`: 10 lumânări de istoric și 12 sub văl, deterministe, din conținut;
  - cipurile MID, ASK și BID pe axă, actualizate la fiecare oră jucată.
- **Ticket:**
  - Side: Buy | Sell;
  - Type: Market | Limit;
  - Limit price: `Level` tras (rol entry, întrerupt cât e pending) plus un câmp sincronizat, 95.00–105.00, snap 0.01, inactiv la Market;
  - Units: fix din conținut (30).
- **Acțiuni:**
  - Place order: evaluează task-ul;
  - Play 12 hours: vălul se retrage în 700ms, lumânările apar la 30–40ms;
  - Replay, Reset, Show me.
- **Execuții:** regulile motorului. Ideal, widget-ul rulează chiar `apply` / `advance` din `packages/engine` pe un context mic, ca cifrele să fie cele din Arena:
  - buy limit: se execută când ask ≤ limită, la limită (la gap, la ask-ul de la open);
  - buy market: la ask.
- **Ieșiri:**
  - Filled / Not filled;
  - fill price, ora, valoarea, comisionul (rotunjit în sus);
  - pentru o limită neexecutată: „Lowest ask: X (mid Y)”.
- **Stări:** setting → placed → playing → done.
- **Task L03:**
  - start Buy / Market / 100.00;
  - reușită: Buy ∧ Limit ∧ 99.00 la Place order; Continue se deblochează după joc;
  - cazuri: market buy (cu mesajul de proces după joc), sell, limită ≥ ask, 99.01–100.04, sub 99.00.

### bracket-builder (L04, nou)

- **Grafic:**
  - `Candles` și `Zone` pentru suport și rezistență;
  - `Level` entry fix (accent);
  - `Level` stop (tras, rol stop) și `Level` target (tras, rol target);
  - `Bracket` pe cele două distanțe.
- **Controale:**
  - stop 95.00 – (entry − 0.01), target (entry + 0.01) – 106.00, snap 0.01, câmpuri sincronizate;
  - doar long în U1;
  - units fix din conținut (25), cu un câmp opțional pentru lecțiile de mai târziu.
- **Ieșiri:**
  - loss at stop înainte și după comision, de exemplu „−57.50 vUSD · −1R”, apoi „−59.98”, egal cu `riskAmount`;
  - gain at target înainte și după comision, de exemplu „+95.00 vUSD · +1.65R”, apoi „+92.45”.
  - **R în U1** e raportul distanțelor, înainte de costuri, etichetat „before costs”. R-ul cu costuri vine din L08.
- **Task L04:**
  - start: stop 99.50, target 101.00;
  - reușită: 97.40 ≤ stop ≤ 97.80 ∧ 103.60 ≤ target ≤ 104.00;
  - Show me 97.70 / 103.80;
  - cazuri pe intervale: stop ≥ 97.90; 97.81–97.89; sub 97.40; target > 104.00; target < 103.60.
- **Modul „stop only”:** pentru hook-ul L04, cu un singur `Level` stop, fără ieșiri și cu butonul „Lock it in”.

### trend-classifier (L05, nou)

- **Date:** 3 segmente (A, B, C), câte 30 de lumânări, generate cu `generateCandles` (seed fix). Fiecare are:
  - eticheta corectă (trend / range / noise);
  - dovada corectă, din motivele din M02: `hh_hl`, `lh_ll`, `bounded`, `overlap`;
  - textele de feedback per combinație greșită.
- **Afișare:** 3 mini-grafice, pe desktop în 3 coloane, pe mobil unul sub altul.
- **Controale:**
  - per segment: radio Trend · Range · Noise, apoi radio de dovezi, activ după etichetă;
  - global: „Show swings” (`Marker` pe swing highs și lows; îl pornește indiciul 2), Check (activ când toate au etichetă și dovadă), Reset, Show me.
- **Stări per segment:** corect = blocat, cu bifă; greșit = editabil, cu feedback-ul combinației.
- **Ieșiri:** rezultat pe segment și total („2 of 3”).
- **Reușită:** A = trend + `lh_ll`, B = noise + `overlap`, C = range + `bounded`.
- **Accesibilitate:** descrierea text a segmentului nu numește structura. Dă începutul, sfârșitul, minimul, maximul și, cu „Show swings”, lista swing-urilor, ca exercițiul să se poată face fără grafic.

### level-drawer (L06, nou)

- **Date:** o serie de bază (seed 6375) cu două finaluri care împart primele 39 de lumânări: FAIL și HOLD. `visibleTo: 38`, `breakIndex: 39`, `endIndex: 51`.
- **Faza 1, Draw:**
  - comutator Resistance · Support;
  - `Zone` trasă, cu trei mânere: corpul și cele două margini; înălțime permisă 0.05–1.50, start 103.00–103.30;
  - ieșiri live: „Zone {low}–{high} · {height} tall”, „Touches N” (cu `Marker`), „Tests N”, „Breaks N”;
  - definiții, pentru rezistență: atingere = swing high cu maximul în bandă; test = maxim peste bandă cu închidere sub marginea de sus; rupere = închidere peste marginea de sus.
- **Faza 2, Plan:**
  - apare lumânarea de breakout;
  - entry fix la ask, 104.91;
  - `Level` stop tras (start 104.60);
  - ieșiri: risc per unitate și „≈ total cu comision”.
- **Faza 3, Play:**
  - vălul se retrage peste c40–c51;
  - stop-ul se execută ca în motor (bid ≤ stop, la stop; la gap, la open);
  - ieșiri: „Break held” sau „Break failed: candle {k} closed back inside at {close}”, „Stop filled at {stop}” sau „Stop not touched”;
  - butonul „Other ending”.
- **Reușită:**
  - partea 1: rezistență ∧ atingeri ≥ 3 ∧ înălțime 0.10–0.50;
  - partea 2: bandLow − 0.80 ≤ stop ≤ bandLow − 0.10.

  Play nu intră în condiție.
- **Garanții verificate pe date:** pentru toate cele 676 de benzi valide, orice stop valid se execută în FAIL și niciunul nu e atins în HOLD.
- **Show me:** banda 104.19–104.41 (4 atingeri), stop 104.00, Play pe FAIL.

### ma-period (L07, nou)

- **Date:** două serii, Trend și Range, fiecare cu `warmup: 50` lumânări ascunse, ca MA să existe de la prima lumânare vizibilă la orice perioadă. Trend are vârful de preț la c36.
- **Controale:**
  - slider Period 5–50, pas 1, cu repere la 20 și 50 etichetate „Arena”;
  - comutator Trend · Range.
- **Desen:**
  - `Candles` și `MA` (accent-2, 2px), recalculate live;
  - `Marker` pe încrucișări; cele false au inel;
  - în Trend, `Bracket` „lag N” între vârful prețului și vârful MA.
- **Definiții:**
  - încrucișare = închiderea trece pe cealaltă parte a MA;
  - falsă = încrucișarea opusă urmează în ≤ 5 lumânări;
  - lag = indexul vârfului MA − indexul vârfului de preț (doar Trend).
- **Ieșiri live:** Crossings · False signals · Lag.
- **Reușită:** Trend ∧ false signals ≤ 1 ∧ lag ≤ 8. Pe aceste date, perioadele 13–21.
- **Show me:** perioada 15.
- **Test unitar:** tabelele de valori din L07 (Trend: 5, 10, 12, 13, 15, 20, 21, 22, 30, 50; Range: 5, 15, 20, 29, 50) se reproduc exact.

### loss-recovery (L08)

- **Control:** Drawdown 1–90%, pas 1; startul vine din conținut (5%).
- **Ieșiri:**
  - Left of the account;
  - Gain needed to recover, d ÷ (100 − d);
  - Losing trades of 1% to get there.
  - **Schimbare:** „Gain needed” nu mai e roșu (e un câștig necesar, nu o pierdere); ton neutru.
- **Task L08:** reușită drawdown = 20; cazuri: sub 25% → „go deeper”, peste 25% → „step back”. Show me 20.

### position-size (L10, L09, L16)

- **Controale:** Account 1,000–50,000 (pas 500), Risk per trade 0.25–3% (pas 0.25), Entry și Stop (câmpuri de preț, stop < entry). Fiecare se poate bloca.
- **Moduri:**
  - **`units: "auto"`** (L10, ca azi), cu ieșiri ascundibile;
  - **`units: "learner"`** (L09, L16, nou): câmpul „Units” introdus de utilizator.
    - „Loss if stopped” și „Position value” se calculează pentru unitățile introduse, cu eticheta „within budget” sau „over by X.XX”.
    - Mărimile calculate sunt ascunse până la reușită.
- **Riglă de preț** (opțională per task):
  - `Level` entry, `Level` stop tras și sincronizat cu câmpul;
  - niveluri de context: L10 suport 48.40 cu „Normal candle ≈ 0.40”; L16 pullback low 48.40 cu „ATR (14) 1.60”.
- **Rând de comparație** cu starea de start:
  - L10: „Start, stop 49.50: 181 units · loss 99.51”;
  - L16: „Calm, stop 49.40: 153 units · 7,650.00”.
- **Nota de plafon:** când mărimea e limitată de cont, widget-ul o spune („Capped: position value can't exceed the account”). Plafonul trebuie corectat întâi în motor (C2).
- **Task-uri:**
  - L10: 48.00 ≤ stop ≤ 48.30;
  - L09: risc 2%, entry 100.00, stop 96.00, units = 48 (`maxQtyForRisk`);
  - L16: stop = 47.60 ∧ units = 40.

### risk-reward (L11, L14, L15, refăcut)

- **Controale:**
  - trei câmpuri de preț, Entry, Stop și Target (2 zecimale, long: stop < entry < target);
  - o riglă cu `Level` entry, stop și target trase și sincronizate, `Bracket` „Risk” și „Reward”, gradații 1R / 2R / 3R;
  - oricare câmp se poate bloca („Fixed by the setup”).
- **Ieșiri:**
  - Risk per unit, Reward per unit;
  - Reward-to-risk „x.xx : 1”;
  - Break-even win rate (o zecimală), toate etichetate „before costs”;
  - opțional, pragul `minRR` afișat „Meets 2R” sau „Below 2R”, cu icon și text.
  - Rândul de azi „Entry 100.00 → stop / target” dispare.
- **Validare:** „Put the stop below the entry and the target above it.”
- **Calcul:** în cenți, deci 60.80 / 59.90 / 62.60 dă exact 2.00.
- **Task-uri:**
  - L11: entry 50.00 și stop 49.40 blocate, target = 51.20;
  - L14: entry și stop blocate, target = 51.00;
  - L15: stop și target blocate, entry = 60.80.

### expectancy (L11 în Learn, L17, L18)

- **Controale:** Win rate 10–90% (pas 1), Average win 0.5–5.0R (pas 0.1), Average loss 0.5–3.0R (pas 0.1). Fiecare se poate bloca.
- **Ieșiri:** Expectancy per trade, Over 100 trades, At 1% risk; nota despre eșantioane rămâne.
- **Corectura de afișare:** semnul se pune după rotunjire. |E| < 0.005 se afișează „0.00R” fără semn; azi 60% / 1.0R / 1.5R arată „−0.00R”. Calculul se face în întregi.
- **Panou nou „Losing runs”** (L18):
  - stepper „Losing run” 3–12; numărul de trade-uri fix, 100;
  - ieșirea: „Chance of a run of {n}+ losses in 100 trades”, calculată exact cu un lanț Markov (stările 0…n−1, absorbție la n, q = 1 − win rate);
  - procent întreg, „> 99%” și „< 1%” la extreme;
  - nota „Assumes each trade is independent of the last.”;
  - tooltip „Only the win rate affects streaks.”
  - **Valori de test, la 40%:** 5 → 98%, 6 → 87%, 7 → 69%, 8 → 49%, 9 → 32%, 10 → 20%, 11 → 13%, 12 → 8%.
- **Task-uri:**
  - L11: avg win 2.0 și avg loss 1.0 blocate, win rate = 33 (prima valoare negativă);
  - L17: avg win 1.5 și avg loss 1.0, win rate = 40 (break-even);
  - L18: win rate 40% blocat, losing run = 8.

### exposure (L12, refăcut)

- **Controale:**
  - Account 1,000–50,000 (pas 500);
  - **Leverage available:** 1× / 2× / 5× / 10×, care fixează plafonul;
  - **Position value:** 0 → plafon, pas 500;
  - **Adverse move:** 1–20%, pas 1.
- **Ieșiri:** Position value, Exposure (%), Leverage used („0.5×”), Loss on the move (vUSD și % din cont).
- **Notă:** peste 100% expunere: „Above 100% you're using leverage. Missions and the Arena cap positions at your equity.”
- **Task L12:**
  - account 10,000, leverage 5× și move 10% blocate; position start 50,000;
  - reușită position = 5,000 (cea mai mare poziție cu pierderea ≤ 5% din cont).

### bias-spotter (L13, nou)

- **Date:** 4 carduri, cu textele în L13. Fiecare are:
  - text ≤ 40 de cuvinte;
  - `answer` dintre `fomo`, `revenge-trading`, `loss-aversion`, `confirmation-bias` (coincide cu id-ul conceptului);
  - textul pentru alegerea corectă și câte o explicație pentru fiecare alegere greșită.
- **Controale:**
  - un card pe ecran, „1 of 4”;
  - 4 butoane în ordine fixă, tastele 1–4;
  - ← / → între carduri; pe mobil, butoanele pe două rânduri.
- **Stări pe card:** idle → chosen → correct / incorrect → resolved. Greșit = butonul trece în neutru-puternic, apare explicația și „Try again”.
- **Ieșiri:** la final, „4 of 4 named · N on the first try” și lista cardurilor. Fără notă afișată.
- **Reușită:** toate 4 rezolvate. Dovezi per card, pe conceptul cardului.
- **Show me:** cardurile se întorc pe rând, câte 600ms fiecare.

---

## Componente de beat (în player și în kit, nu widget-uri)

| Componentă | Ce face | Unde e folosită |
|---|---|---|
| `Hotspot` pe grafic sau lumânare | Zone apăsabile ≥ 44px. Răspunsul e o zonă sau un preț. Zona unei lumânări include fitilul. | L01 hook și B4, L06 hook și B3, L16 B4, L17 |
| `Level` tras într-o figură | Etichete live pe intervale; răspuns numeric cu interval acceptat; apoi reveal pe același grafic | L04 B4, L05 B4, L10 B3, L11 B2 |
| `Formula` cu input | Ultima cutie e un câmp numeric | L09 B2 |
| `worked` cu input | Ultima linie se calculează; câmpul acceptă virgulă sau punct și afișează unitatea | L01, L02, L04, L06, L07, L08, L11, L12, L13 (397.00), L16, L18 (7.8 ± 0.1) |
| Reveal cu văl | Vălul se retrage, cu variante de răspuns după reveal | L03 B6, L15, L16 B6 |
| Reveal cu două finaluri | Butonul „Show the other ending”; feedback-ul nu depinde de alegere | L06 B4 |
| Două drumuri intra-oră | Două `Line` desenate peste aceeași lumânare | L01 B6 |
| `match` | Perechi termen ↔ definiție, cu explicații proprii pentru perechile greșite; varianta de sortare în 2 coloane primește mai multe elemente pe o țintă | U1–U5 (de exemplu L07 B5 „It can / It can't”) |
| `order` | 5 elemente de pus în ordine (rutine, pași de plan) | L08, L14, L17 |
| `Flow` cu alegere | Noduri Yes / No (tastele Y / N), noduri terminale, nod de tip „pause” (L13), nod de management după intrare (L17); ramura greșită rămâne neutră, cu explicația nodului | L13 B7, L14 B6, L17 B4 |
| Slider într-o figură | Spread (L02 B2), scădere pe `Bars` (L12 B4), linie MID (hook L03) | L02, L03, L12 |
| Comutator într-o figură | Calm / volatil | L16 B2 |
| Câmpuri de plan | O alegere și două stepper-e, validare declarativă (de exemplu risc ≤ 1%), fără răspuns unic | L18 B5 |
| Câmp text liber | Se salvează în notițe (`L17:5`), nu se evaluează, nu blochează Continue | L17 B6 |
| Marcaj de glosar în pașii figurilor | Dacă pașii nu acceptă `[[…]]`, legătura se mută în textul de după figură | L05 B5 |
