# Scrierea lecțiilor direct în cod (valurile 2 și 3)

Ghidul pentru transformarea unei fișe din [harta cursului](course/README.md) într-o lecție interactivă completă, direct în `packages/academy`. Primele 18 lecții au trecut prin scripturi Markdown (U1–U5); restul cursului se scrie direct în TypeScript, unitate cu unitate, după aceleași reguli. Textul pe care îl vede utilizatorul e în engleză; comentariile din cod sunt în engleză, scurte.

## 1. Unde se scrie

- **Un fișier pe unitate:** `packages/academy/src/content/course/u<nivel>-<unitate>.ts`, de exemplu `u1-1.ts` pentru 1.1. Fișierul există deja și exportă:

  ```ts
  export const UNIT_1_1: UnitContent = { lessons: [], questions: [], terms: [], concepts: [] };
  ```
- Se completează **doar** fișierul unității tale. Indexul (`content/course/index.ts`) și catalogul le adună automat.
- **Lecțiile existente** (fișele marcate `` `L01` ``…`` `L18` ``) nu se rescriu: au deja scripturi în `content/scripts/`. Le sari.

## 2. Lecția (`Lesson`)

```ts
{
  id: "1.1.2",                 // id-ul din harta cursului; e și ruta: /learn/lessons/1.1.2
  title: "Long and short",     // exact titlul din fișă
  topic: "market_fundamentals",// unul din cele 10 TopicId (types.ts); alegi cel mai apropiat
  level: "beginner",           // "beginner" pentru Beginner, altfel "intermediate"
  tier: "free",                // tot conținutul e gratuit deocamdată (PLAN_LEARN §17)
  minutes: 6,                  // din fișă
  summary: "…",                // o propoziție, engleză
  objectives: ["…", "…", "…"], // exact obiectivele din fișă
  blocks: [],                  // lecțiile noi nu au mod vechi; Read mode folosește scriptul
  practice: [{ kind: "mission", ref: "M04", label: "Define Your Risk" }],
  script: { … },               // vezi §3
}
```

- **`practice`:** 1–2 legături reale. Misiuni existente: M01 Read the Candle, M02 Trend or Noise?, M04 Define Your Risk, M05 Size Matters, M06 The FOMO Trap, M07 Stop or Stay?, M10 No Trade Is a Trade. Arena (`kind: "arena"`, `ref` = scenariul): `bullish`, `bearish`, `sideways`, `low_volatility`, `breakout`, `reversal`, `high_volatility`, `false_breakout`, `event_shock`. Calculatorul de risc: `{ kind: "calculator", ref: "risk-calculator", label: "Risk calculator" }`. Checkul unui topic: `{ kind: "check", ref: "<topicId>", label: "… check" }`.

## 3. Scriptul (`LessonScript`)

Tipurile sunt în `packages/academy/src/types.ts` (`LessonScript`, `Beat`, `FigureSpec`, `ChartSpec`, `ChartLayer`, `AnswerControl`, `TaskSpec`, `TaskData`, `PlanField`). **Exemplul de referință:** L01 în `content/scripts/u1.ts`; alte modele în `u2.ts`–`u5.ts`.

```ts
script: {
  unit: "1.1", courseId: "1.1.2",
  hook: { prompt, control, figure?, compare /* cu {yours} */, concept? },
  learn: Beat[],     // 4–8 beat-uri
  task?: TaskSpec,   // faza Try, pe un widget din §4
  check: [id1, id2, id3],  // cele 3 întrebări noi ale lecției (§5)
  recap: { takeaways: [t1, t2, t3] },
}
```

**Fișa → script:**
- **Hook** din fișă → `hook`. Controale: `choice` (choices `{id,label,feedback?}`, `answer`), `slider` (`min,max,step,unit,start,answer,tolerance,feedback?: {from,to,text}[]`), `numeric`, `tap` (pe un grafic, zone cu `index`+`price` sau `from`/`to`). Hook-ul nu se notează; `compare` apare în recap.
- **Interacțiunea centrală** (B1…Bn) → `learn`, beat cu beat, în ordinea din fișă. Fișa dă schița; tu scrii textul final (engleză, ≤ 60 de cuvinte pe beat) și datele exacte.
- **Try** → `task`, dacă widget-ul cerut există (§4) sau dacă unul existent face aceeași treabă. Dacă fișa cere un widget nou care nu există încă, **nu inventa câmpuri**: transformă exercițiul în beat-uri interactive (`worked` cu input, `predict`, `reveal`, `hotspot`, `order`, `match`, `fields`) puse la finalul fazei Learn și lasă `task` nedefinit. Notează în raport widget-ul care ar fi trebuit.
- **Check** din fișă (Q1–Q3 descrise) → 3 întrebări noi în `questions` (§5), id-urile în `check`.
- **Recap:** 3 idei, ≤ 20 de cuvinte fiecare, câte una pe obiectiv.

**Beat-uri disponibile** (`Beat` în types.ts):

| Beat | Pentru | Câmpuri cheie |
|---|---|---|
| `explain` | 1–3 propoziții, opțional o figură | `title?`, `text`, `figure?` |
| `figure` | diagramă construită în 1–4 pași | `figure`, `text?` |
| `predict` | o predicție, apoi răspunsul | `prompt`, `control`, `reveal`, `figure?` (desenul arătat după răspuns) |
| `reveal` | viitorul acoperit de văl | `chart` (cu `visible`), `choices?`, `answer?`, `after` |
| `worked` | exemplu calculat linie cu linie | `lines`, `ask?` (ultima linie o calculează utilizatorul: `answer`, `tolerance`, `feedback[{value,text}]`, `correct`, `incorrect`), `after` |
| `match` | perechi | `pairs[{left,right,wrong?}]`, `columns?`, `correct?`; dacă mai multe perechi au același `right`, devine sortare pe categorii |
| `order` | pașii în ordine | `items` (ordinea corectă), `explain`, `wrong?`, `note?` |
| `hotspot` | tap pe grafic | `chart`, `zones`, `answer`, `correct` |
| `fields` | regulile și notițele proprii ale utilizatorului | `fields: PlanField[]` (`choice`, `stepper` sau `text` cu `placeholder` și `required`), `valid?`, `correct?`, `feedback?` |
| `task` | un widget în mijlocul lecției | `task` |
| `callout` | ideea-cheie sau un avertisment | `tone: key/warning/info`, `text` |

**Figuri** (`FigureSpec`): `chart` (`ChartSpec` + `steps[{text, layers?, visible?}]`), `formula` (`boxes[{text, answer?, unit?}]`, `operators`, `steps?`), `bars` (`bars[{label,value,role?}]`, `unit?`, `steps?`), `flow` (noduri `{id,text,kind?,yes?,no?,next?,correct?,explain?}`, `start`, `interactive?`).

**Grafice** (`ChartSpec`): `candles: {o,h,l,c,v?}[]` cu 2 zecimale, h ≥ max(o,c), l ≤ min(o,c); `layers` (`level` cu rol `entry/stop/target/support/resistance/neutral/concept`, `zone`, `marker`, `bracket`, `line`, `path`, `ma`); `visible` pentru văl; `style: "candle" | "bar" | "line"` (bare OHLC sau linie prin închideri, fără lumânări false), `scale: "log"` (scară logaritmică), `volume: true` (panou de volum din `v`), `hideCandles` (doar straturile). Pașii unei figuri pot schimba `style` și `scale` (de exemplu lumânări → linie, liniar → log). **Seriile se scriu de mână sau se generează determinist cu un script** și se verifică: fiecare cifră din text trebuie să apară exact în date.

**Feedback-ul** spune ce s-a întâmplat și de ce, niciodată „Wrong!”. Placeholder-ele `{field}` / `{field:2}` din task-uri folosesc doar numele câmpurilor widget-ului.

## 4. Widget-urile (faza Try)

Contractele sunt în `packages/academy/src/widgets.ts` (câmpurile pe care le pot citi condițiile), calculele în `widget-math.ts`, datele suplimentare în `TaskData` (types.ts):

| Widget | Ce face | Date (`task.data`) |
|---|---|---|
| `candle-builder` | construiește o lumânare din OHLC | — |
| `spread-cost` | costul unui round trip (cu răspunsul tastat în `answer`) | — |
| `order-fill` | pui un ordin, apoi rulezi graficul | `chart` (istoric + viitor sub văl), `units`, `plan` |
| `bracket-builder` | tragi stop-ul și ținta | `chart`, `entry`, `units` |
| `trend-classifier` | etichetezi segmente: trend / range / noise + dovada | `segments` (cu `candles` proprii), `evidence` |
| `level-drawer` | desenezi o zonă; opțional planul de breakout | `chart`, `breakout?` |
| `ma-period` | perioada unei medii mobile vs semnale false și lag | `series`, `warmup` |
| `loss-recovery` | drawdown → câștigul necesar | — |
| `position-size` | dimensionarea din stop, cu costuri | `ruler?` |
| `risk-reward` | R:R și rata de break-even | — |
| `expectancy` | expectancy și seriile de pierderi | — |
| `exposure` | expunere și levier | — |
| `bias-spotter` | carduri: numești biasul | `cards`, `options` |

`TaskSpec`: `widget`, `goal` (≤ 40 de cuvinte), `start`, `locked?`, `hidden?`, `success` (condiție: `{all:[…]}`, `{any:[…]}`, `{not:…}`, `{field, eq|ne|gt|gte|lt|lte, tol?}`), `feedback?` (`[{when, text}]`, primul care se potrivește), `correct`, `incorrect?`, `hints` (1–3), `showMe`, `concept?`. Testul verifică pe cifrele reale ale widget-ului că `start` nu rezolvă task-ul și că `showMe` îl rezolvă.

## 5. Întrebările (`Question`)

- **Trei pe lecție**, după descrierea Q1–Q3 din fișă (tip și dificultate). Id: `q-<id lecție>-<n>`, de exemplu `q-1.1.2-1`.
- Câmpuri: `topic` (același TopicId ca lecția sau cel mai potrivit), `kind` (`mcq` / `scenario` / `numeric`), `difficulty`, `scenario?`, `prompt`, `options` (3–4, cu `rationale` pe fiecare variantă greșită, ≤ 30 de cuvinte, care spune ce confuzie o produce) și `correct`, sau `numeric: {answer, tolerance, unit}`; `explanation` (de ce, nu doar ce); `lesson` (id-ul lecției); `concepts` (1–2 id-uri existente); `hints` (până la 3, ≤ 25 de cuvinte: direcție, regulă, primul pas) la d2/d3 și la numeric; `vary` la întrebările numerice unde cifrele se pot schimba (limbajul din `src/expr.ts`: `floor`, `ceil`, `round(x,d)`, `min`, `max`, `abs`, `sqrt`, `pct`, `commission`; câmpuri `[min,max,step]`, `constraints`, `answer`, șabloane `{expr}` / `{expr:2}`).
- Varianta corectă nu e mereu aceeași literă. Distractorii sunt greșeli plauzibile, nu absurdități.

## 6. Termeni și concepte noi

- **Termeni:** fișa spune „Termeni noi de glosar”. Pentru fiecare id care nu există încă (caută în `content/glossary.ts`, `content/scripts/*.ts` și `content/course/*.ts`), adaugi un `GlossaryTerm` în `terms`: `id`, `term`, `definition` (1–2 propoziții precise), `plain` (pe înțelesul unui începător), `related`, `lesson` (id-ul lecției), `aka?`.
- **Concepte:** pentru fiecare concept marcat „(nou)” care nu există (caută în `content/concepts.ts`, `content/scripts/*.ts`, `content/course/*.ts`), adaugi un `Concept`: `id`, `name`, `category` (TopicId), `summary`, `body` (1–3 paragrafe), `example` (cu cifre), `related`, `missions`, `lessons` ([id-ul lecției]). Registrul „Registru de concepte noi” din fișierul nivelului are definițiile.
- Id-urile sunt unice în tot proiectul; testul le verifică.
- Legăturile `[[term-id]]` din text trebuie să existe în glosar (inclusiv cele adăugate de tine).

## 7. Lumea simulată și regulile de execuție

- LABX, vUSD, cont 10,000.00, spread 0.10 (bid = mid − 0.05, ask = mid + 0.05), comision 0.05% pe fiecare execuție, rotunjit în sus la cent, unități întregi rotunjite în jos, fără levier.
- Market buy la ask, sell la bid. Buy limit se execută când ask ≤ limit, la limit (sau la ask-ul de la open dacă open-ul a sărit peste). Stop-ul unui long se declanșează când bid ≤ stop; după un gap, la bid-ul de la open.
- Riscul în R include costurile (`riskAmount` din `packages/engine`). Dimensionarea: `maxQtyForRisk`.
- **Fiecare cifră se verifică cu un script** (node, în folderul tău de scratch). Nu se adaugă afirmații despre piețe care nu se pot verifica; dovezile slabe se spun ca atare (fișele au nota de dovezi A–F).

## 8. Lungimi și voce

Text de beat ≤ 60 de cuvinte · prompt de hook/task ≤ 40 · pas de figură ≤ 20 · idee de recap ≤ 20 · indiciu ≤ 25 · rationale ≤ 30. Persoana a doua, propoziții scurte, fără promisiuni de câștig, fără emoji. Doar `**bold**` și `[[term]]` ca marcaje.

## 9. Verificare

Lecțiile din `content/course/` ajung în aplicație prin `src/generated/` (metadatele se încarcă imediat, scripturile câte o unitate, la cerere). `npm run content:build` le regenerează; rulează automat înainte de `dev`, `build` și `test`, iar un test pică dacă fișierele generate nu mai corespund sursei.

```bash
cd "/d/Proiecte/Tradelix - learning to trade module"
npm run typecheck 2>&1 | grep -i error | head
npx vitest run packages/academy 2>&1 | tail -30
```

Testele verifică pentru fiecare lecție: id-ul și unitatea, întrebările din check, legăturile din glosar, conceptele, lungimile, câmpurile widget-urilor, start/Show me, datele graficelor, unicitatea id-urilor și generatoarele `vary`.

## 10. Pentru agenți: cum lucrezi pe o unitate

- **Citește doar ce-ți trebuie:** acest ghid, secțiunea unității tale și fișele ei din `docs/learn/course/level-*.md` (plus registrele de concepte și termeni din același fișier), `packages/academy/src/types.ts` și **un singur** exemplu apropiat de unitatea ta (de exemplu `content/course/u1-2.ts` pentru grafice, `u1-3.ts` pentru ordine, `u1-6.ts` pentru plan și jurnal). Nu citi fișiere mari întregi dacă nu e nevoie: caută cu grep.
- **Lucrează pe o ciornă** în folderul tău de scratch. Copiază fișierul în `packages/academy/src/content/course/u<n>-<m>.ts` **doar când e complet** și trece typecheck-ul. Nu lăsa niciodată un fișier pe jumătate în proiect: alți agenți rulează testele în același timp.
- **Editezi doar fișierul unității tale.** Nu atingi `glossary.ts`, `concepts.ts`, testele sau alte unități; ce ar trebui schimbat acolo scrii în raport.
- **Termeni și concepte noi** doar dacă fișa sau registrul spun că sunt introduse în unitatea ta și nu există deja (grep în `content/`). Nu lega termeni care nu există.
- **Dovezile (nota A–F din fișă) se respectă:** pattern-urile și strategiile cu dovezi slabe se predau ca atare, cu rate de bază și costuri reale, niciodată ca semnale care „funcționează”.
- **Widget lipsă** → beat-uri interactive la finalul fazei Learn (§3); notezi widget-ul în raport.
- **Cifrele** se verifică cu un script node; ce spune textul trebuie să fie exact ce arată datele.
- **Validare:** `npm run typecheck` și `npx vitest run packages/academy`, până trec. Fără comenzi git.
- **Raportul final**, maximum 120 de cuvinte: id-urile lecțiilor, numărul de întrebări, termeni și concepte, widget-urile lipsă, ce ai simplificat și ce trebuie schimbat în fișierele comune.

## 11. Trecerea de continuitate

Cursul trebuie să se citească drept un drum, nu ca 340 de lecții separate. Pentru fiecare unitate primită:

1. **`intro` în `UnitContent`** (fișierul unității): `summary` (≤ 60 de cuvinte: ce face unitatea și de ce vine acum), `outcomes` (3–5, fiecare ≤ 20 de cuvinte, la persoana a doua: „Read…”, „Size…”), `buildsOn` (≤ 40 de cuvinte: pe ce unități și lecții anterioare se sprijină, cu id-urile lor).
2. **Fiecare lecție** primește:
   - `script.bridge` (≤ 45 de cuvinte), arătat la începutul lecției: leagă concret lecția de cea dinainte și de precondiții, adică ce a făcut cursantul acolo și ce adaugă lecția aceasta. Citează id-ul lecției („In 1.2.1 you read one candle's four prices. Here you combine four of them into one 4-hour candle.”). Prima lecție a unei unități leagă de unitatea anterioară.
   - `script.recap.next` (≤ 25 de cuvinte): anunță lecția următoare din ordinea cursului și de ce urmează („Next, 1.2.3: the same hours on a bigger timeframe.”). La ultima lecție a unității spune că urmează checkpoint-ul și numește unitatea următoare.
3. **Termenii folosiți înaintea lecției care îi predă** (`forwardTerms` în worklist): adaugă în aceeași propoziție o explicație scurtă, pe înțelesul unui începător, dacă textul n-o are deja. Legătura `[[term]]` rămâne; cardul ei spune unde se predă.
4. **Nu schimba nimic altceva:** beat-urile, întrebările, datele și id-urile rămân cum sunt.
5. **Datele de lucru:** `worklist.json` (calea e în prompt): pentru fiecare lecție, lecția anterioară și cea următoare, precondițiile și termenii folosiți prea devreme. Citește lecțiile vecine din alte unități doar cât îți trebuie (titlu, ideile din recap).
6. **Verificare:** `npm run content:build`, apoi `npm run typecheck` și `npx vitest run packages/academy`. Lucrezi direct în fișierele unităților tale (modificările sunt mici), fără să lași un fișier pe jumătate. Fără comenzi git.
