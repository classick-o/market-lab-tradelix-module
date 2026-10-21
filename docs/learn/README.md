# Conținutul cursului Learn

Definiția completă a conținutului pentru sistemul de învățare din [PLAN_LEARN.md](../../PLAN_LEARN.md): fiecare lecție scrisă beat cu beat, fiecare exercițiu, fiecare întrebare cu explicațiile ei. Implementarea (etapele E0–E8) pornește de aici. Când conținutul se mută în `packages/academy`, fișierele de aici rămân referința de review.

- **Textul pe care îl vede utilizatorul e în engleză**, exact cum va apărea în aplicație.
- **Notele pentru echipă sunt în română.**

## Fișiere

| Fișier | Conține |
|---|---|
| [U1-how-markets-work.md](U1-how-markets-work.md) | L01, L02, L03, L04 |
| [U2-reading-price.md](U2-reading-price.md) | L05, L06, L07 |
| [U3-risk-comes-first.md](U3-risk-comes-first.md) | L08, L10, L09, L11, L12, L16 |
| [U4-plan-and-decide.md](U4-plan-and-decide.md) | L14, L15, L17 |
| [U5-traders-mind.md](U5-traders-mind.md) | L13, L18 |
| [widgets.md](widgets.md) | Cele 13 widget-uri: cele 7 existente, cu modul task, și cele 6 noi |
| [questions-markets-and-sizing.md](questions-markets-and-sizing.md) | Întrebările din Market Fundamentals, Order Types, Technical Analysis, Position Sizing, Portfolio Exposure: cele 46 existente și 11 noi |
| [questions-risk-and-mind.md](questions-risk-and-mind.md) | Întrebările din Risk Management, Stop-Loss, Decision-Making, Psychology, Scenario Analysis: cele 48 existente și 8 noi |
| [issues-and-decisions.md](issues-and-decisions.md) | Erorile de cod găsite, corecturile de conținut și deciziile de luat înainte de implementare |

## Harta cursului

| Unitate | Lecție (în ordinea cursului) | Min | Widget în faza Try | Misiune de final |
|---|---|---|---|---|
| **U1 · How markets work** | L01 What a candle shows | 5 | candle-builder | M01 Read the Candle |
| | L02 Bid, ask and the spread | 6 | spread-cost | |
| | L03 Market and limit orders | 5 | order-fill (nou) | |
| | L04 Stop-loss and take-profit orders | 6 | bracket-builder (nou) | |
| **U2 · Reading price** | L05 Trends, ranges and noise | 5 | trend-classifier (nou) | M02 Trend or Noise? |
| | L06 Support, resistance and breakouts | 6 | level-drawer (nou) | |
| | L07 Moving averages without the magic | 6 | ma-period (nou) | |
| **U3 · Risk comes first** | L08 Risk per trade | 6 | loss-recovery | M04 Define Your Risk, M05 Size Matters |
| | L10 Where a stop belongs | 6 | position-size | |
| | L09 Sizing a position from the stop | 7 | position-size | |
| | L11 Reward-to-risk and expectancy | 7 | risk-reward (și expectancy în Learn) | |
| | L12 Exposure and leverage | 6 | exposure | |
| | L16 Volatility and adapting your size | 7 | position-size | |
| **U4 · Plan and decide** | L14 Writing a trading plan | 6 | risk-reward | M10 No Trade Is a Trade |
| | L15 Thinking in scenarios | 6 | risk-reward | |
| | L17 Reviewing your decisions | 5 | expectancy | |
| **U5 · The trader's mind** | L13 FOMO, revenge and loss aversion | 6 | bias-spotter (nou) | M06 The FOMO Trap, M07 Stop or Stay? |
| | L18 Handling losing streaks | 6 | expectancy | |

## Convenții

### Lumea simulată (aceleași cifre peste tot)

| Element | Valoare |
|---|---|
| Instrument | **LABX**, sintetic |
| Monedă | **vUSD** (virtual), prețuri cu 2 zecimale |
| Cont | 10,000.00 vUSD |
| Risc pe trade | 1% în misiuni (100.00 vUSD), 2% în Arena (200.00 vUSD) |
| Spread | 0.10. Bid = mid − 0.05, ask = mid + 0.05. Cumperi la ask, vinzi la bid. |
| Comision | 0.05% din valoarea execuției, la intrare și la ieșire |
| Unități | numere întregi; la dimensionare se rotunjește în jos |
| Levier | fără: valoarea poziției ≤ capital |

- **Orice calcul se verifică** și se arată cu pașii lui.
- **Exemplele noi** folosesc aceleași convenții ca lecțiile de azi (L09: 47 de unități după costuri, nu 50).

### Marcaje în text

| Marcaj | Înseamnă | Exemplu |
|---|---|---|
| `**text**` | accent (singurul stil inline existent) | `the **risk budget**` |
| `[[term-id]]` sau `[[term-id\|text afișat]]` | legătură spre glosar (tooltip), doar la prima apariție în lecție; `term-id` e id-ul din `glossary.ts` | `[[spread\|the spread]]` |
| `{yours}` | răspunsul utilizatorului din hook, în textul de recap | `You guessed {yours} units.` |

### Limite de lungime (text în engleză)

| Element | Maximum |
|---|---|
| Text de beat | 60 de cuvinte |
| Prompt de hook sau de task | 40 de cuvinte |
| Pas de figură | 20 de cuvinte |
| Idee-cheie din recap | 20 de cuvinte |
| Indiciu | 25 de cuvinte |
| Explicație per variantă (rationale) | 30 de cuvinte |

### Vocea

- Persoana a doua, propoziții scurte, verbe concrete.
- Procesul înaintea rezultatului: o decizie bună cu rezultat prost nu e „greșită”.
- Fără promisiuni de câștig, fără „easy money”, fără emoji în text.
- Feedback-ul nu spune niciodată „Wrong!”. Spune ce s-a întâmplat și de ce: „That sizes from the account, not the stop.”
- Faptele vin din lecțiile, conceptele și glosarul existente. Nu se adaugă afirmații noi despre piețe care nu se pot verifica în simulator.

## Tipurile de beat (din PLAN_LEARN §4.2)

`explain`, `figure`, `predict`, `reveal`, `worked`, `task`, `match`, `order`, `hotspot`, `callout`, `question`.

**Reguli:**
- O lecție are 1 hook, 4–7 beat-uri în faza Learn, 1 task în faza Try, 3 întrebări în faza Check și 1 recap.
- Cel puțin **3 interacțiuni reale** pe lecție, pe lângă întrebări: hook-ul, task-ul și cel puțin încă una dintre `predict`, `reveal`, `match`, `order`, `hotspot` sau `worked` cu input.
- Figurile se descriu cu vocabularul Learn Chart Kit (PLAN_LEARN §8.1): `Candles`, `Line`, `MA`, `Level`, `Zone`, `Marker`, `Bracket`, `Bars`, `Formula`, `Flow`, `Hotspot`.
  - `Level` are un rol: `entry`, `stop`, `target`, `support`, `resistance` sau `neutral`.
  - Fiecare figură are 2–4 pași, iar fiecare pas are textul lui.
  - Seriile de prețuri se descriu prin formă și cifre-cheie, de exemplu: „12 candles rising from 98.20 to 101.40, pullback to 100.10 on candle 9”.

## Șablonul unei lecții

```markdown
## L09 · Sizing a position from the stop

| | |
|---|---|
| Unitate | U3 · Risk comes first, lecția 3 din 6 |
| Durată | 7 min · 6 beat-uri în Learn |
| Concepte | position-sizing, fixed-fractional-sizing, cost-adjusted-sizing |
| Termeni (glosar) | risk-budget, stop-distance, … |
| Se sprijină pe | L08, L10 |
| Pregătește | M05 Size Matters, M04 Define Your Risk |

**Obiective**
1. …
2. …
3. …

### Hook
- **Tip:** predict · slider 1–200 units, pas 1
- **Prompt:** "…"
- **Răspuns:** 50 (textbook). Comparat în recap.
- **Concept:** position-sizing

### Learn
**B1 · explain**
> "…"

**B2 · figure** (din diagrama `position-size-formula`)
- Date: …
- Pași:
  1. "…"
  2. "…"
- **Interacțiune:** …

**B3 · worked** "Textbook size"
- Linii: "…", "…"
- **Ultimul pas îl calculează utilizatorul:** units = 50 (toleranță 0)
- **Feedback corect / greșit:** "…" / "…"

… (alte beat-uri: match, order, hotspot, reveal, callout)

### Try
- **Widget:** position-size
- **Valori de start:** account 10,000, risk 1%, entry 100.00, stop 98.00
- **Obiectiv:** "…"
- **Reușită:** condiția exactă
- **Indicii:** 1. "…" 2. "…" 3. "…"
- **Show me:** starea finală
- **Feedback:** corect "…" / după o încercare greșită "…"

### Check
- Întrebări: q-ps-1, q-ps-3, q-ps-4
- (opțional) Înlocuiri propuse, cu motiv

### Recap
- **Hook comparat:** "You guessed {yours} units. The rule gives 50: 100.00 ÷ 2.00."
- **Three things to remember:**
  1. "…"
  2. "…"
  3. "…"
- **Practise it:** M05 Size Matters, Risk calculator

### Note de conținut
- Corecturi față de lecția actuală, termeni de legat în glosar, decizii de verificat.
```

## Șablonul unei întrebări

```markdown
#### q-ps-1 · numeric · d1 · L09
- **Concepte:** position-sizing, fixed-fractional-sizing
- **Indicii:** 1. "…" 2. "…" 3. "…"
- **Variații (vary):** câmpuri și intervale, formula răspunsului, toleranța
- **Probleme găsite:** (doar dacă există)

#### q-ps-2 · mcq · d2 · L09
- **Concepte:** …
- **Explicații per variantă** (varianta corectă păstrează explicația existentă):
  - `a` "Label" → "Rationale"
  - `b` ✓ (corectă)
  - `c` "Label" → "Rationale"
- **Indicii:** doar pentru d3, sau dacă întrebarea e grea
```
