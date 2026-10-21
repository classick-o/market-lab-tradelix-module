# U2 · Reading price

**Ce poate face utilizatorul după unitate:**
- numește ce fel de piață arată o porțiune de grafic (trend, range sau zgomot), după swing-uri, și spune „nu e clar” când nu e;
- marchează suportul și rezistența ca zone, deosebește un test de o rupere și pune stop-ul acolo unde un breakout ar fi eșuat;
- calculează o SMA, explică de ce întârzie și o folosește ca descriere a trendului, nu ca prognoză.

**De ce în ordinea asta:**
- **L05** construiește vocabularul: swing high, swing low, structură.
- **L06** ia marginile unui range și le transformă în niveluri, apoi arată ce se întâmplă când range-ul se termină. Se sprijină pe stop-ul din L04.
- **L07** rezumă trendul într-o linie, o compară cu swing-urile și arată unde cedează: în range-uri (L05, L06).

**Concepte acoperite:** `trend`, `range`, `timeframe`, `support-and-resistance`, `breakout`, `false-breakout`, `moving-average`.

**Checkpoint:** `test-technical_analysis`, toată banca topicului (q-ta-1 … q-ta-10, plus q-ta-11 dacă se acceptă propunerea din L06). La ≥ 80%, L05, L06 și L07 se marchează „Tested out”.

**Misiunea de final:** **M02 Trend or Noise?** Trei porțiuni de grafic, fără tranzacții; pentru fiecare se alege structura și motivul. Task-ul din L05 (`trend-classifier`) folosește aceleași patru motive ca M02.

**Semnătura unității, „predict & reveal”**, apare în fiecare lecție:
- L05 B4: cât de jos poate merge un pullback;
- L06 B4: același breakout, două finaluri; și Play-ul din task;
- L07 B3: când se întoarce media.

**Datele graficelor:**
- **Seriile mici** (exemplele lecțiilor) sunt definite în conținut, cu prețurile-cheie de mai jos.
- **Seriile pentru task-uri și pentru B5 (L05) și B3 (L07)** sunt `ScenarioSpec` pentru `generateCandles` din `packages/scenario-gen`.
  - Toate cifrele citate pentru ele au fost extrase rulând generatorul actual.
  - Dacă generatorul se schimbă, seed-urile dau alte lumânări. Propun ca seriile Learn să intre în `npm run content:generate`, ca la misiuni (`data/scenarios.json`).
- **Swing high / swing low**, peste tot în unitate: maximul (minimul) unei lumânări strict mai mare (mai mic) decât maximele (minimele) celor 2 lumânări din fiecare parte.

---

## L05 · Trends, ranges and noise

| | |
|---|---|
| Unitate | U2 · Reading price, lecția 1 din 3 |
| Durată | 5 min · 7 beat-uri în Learn |
| Concepte | trend, range, timeframe |
| Termeni (glosar) | trend, range, pullback, reversal, timeframe |
| Se sprijină pe | L01 |
| Pregătește | M02 Trend or Noise?, L06, L07 |

**Obiective**
1. Identify an uptrend or a downtrend from its swing highs and swing lows.
2. Recognise a range and the levels that bound it.
3. Tell structured moves apart from noise.

### Hook
- **Tip:** predict · alegere (4 variante), pe un grafic cu doar 3 lumânări
- **Grafic:** ultimele 3 lumânări din seria de la B5, toate verzi:
  - c22: o 99.29, c 99.40;
  - c23: o 99.40, c 100.18;
  - c24: o 100.18, c 100.30.
- **Prompt:** "Three green 1-hour candles in a row on LABX, each closing higher. What is the market doing?"
- **Variante:** "Trending up" · "Ranging" · "Just noise" · "Can't tell yet"
- **Răspuns:** nu există un singur răspuns notat.
  - „Can't tell yet” e citirea onestă din 3 lumânări.
  - B5 arată contextul: zoom out la 24 de lumânări, unde porțiunea e zgomot.
  - Comparat în recap.
- **Concept:** trend

### Learn
**B1 · explain**
> "Before asking whether to trade, ask what kind of market you're looking at. Sort it into one of three boxes: [[trend]], [[range]] or noise. The labels describe what has happened so far, not what happens next. The same chart can move from one box to another."

**B2 · figure** (din diagrama `trend-range-noise`)
- Date: trei mini-grafice, fiecare cu 18 lumânări de 1 oră, desenate pe rând (serii mici definite în conținut).
  - **Trend:** `Candles` de la 98.40 la 102.10.
    - Swing lows: 98.00 (c2), 99.20 (c7), 100.30 (c13).
    - Swing highs: 99.80 (c5), 101.00 (c10), 102.60 (c16).
    - `Marker` pe fiecare swing.
  - **Range:** `Candles` între 97.95 și 100.05.
    - Întoarceri în jos: 99.95 (c4), 100.05 (c10), 99.90 (c16).
    - Întoarceri în sus: 98.05 (c7), 97.95 (c13).
    - `Zone` 99.90–100.05 (rol resistance) și 97.95–98.10 (rol support).
  - **Noise:** `Candles` suprapuse, cu închideri între 98.90 și 99.60.
    - Maxime 99.85, 99.40, 99.95 și minime 98.70, 99.10, 98.80, la distanțe neregulate.
    - Variație netă: +0.10.
- Pași:
  1. "An uptrend: each swing high and each swing low is higher than the one before."
  2. "A range: price keeps turning near the same floor and ceiling. New highs or lows don't last."
  3. "Noise: overlapping back-and-forth moves with no clear swings."
- **Interacțiune:** tap sau Space avansează pasul.
  - Match-ul din §8.4 (grafic ↔ etichetă) devine task-ul din Try (`trend-classifier`), ca să nu se repete.
  - Aici, interacțiunea de potrivire e B6 (dovadă ↔ etichetă).

**B3 · explain** (cu figură)
> "A **swing high** is a peak with lower highs on either side. A **swing low** is a trough with higher lows on either side. An uptrend makes higher swing highs and higher swing lows. A downtrend makes lower highs and lower lows. The trend is intact while that pattern holds."
- Figură: graficul din B4, până la c20.
  - `Marker` pe cele trei maxime (eticheta „HH”), apoi pe cele trei minime („HL”), care se aprind pe rând.

**B4 · reveal** „Is this still an uptrend?” (cu predict: utilizatorul trage un nivel)
- Date (serie definită în conținut), 26 de lumânări de 1 oră:
  - c1 deschide la 100.40;
  - swing lows: 100.00 (c3), 101.20 (c9), 102.40 (c15);
  - swing highs: 102.00 (c6), 103.50 (c12), 105.00 (c18);
  - c20 închide la 104.40;
  - **văl** peste c21–c26: pullback până la un swing low de 101.00 (c24), apoi închideri la 101.50 (c25) și 101.80 (c26).
- **Prompt:** "Price is in a [[pullback]] from 105.00. Drag the line to the lowest level this pullback can reach while the uptrend stays intact."
- **Control:** `Level` (rol neutral), draggable:
  - start la 104.00, snap 0.01;
  - din tastatură: săgeți ±0.01, Shift + săgeți ±0.10.
- **Răspuns:** 102.40, acceptat între 102.30 și 102.60.
- **Feedback:**
  - corect: "Right. The last swing low is 102.40. Each new low has to stay above it."
  - sub 102.30: "Below 102.40 the higher-low pattern breaks. The low that counts is the last one, 102.40."
  - peste 102.60: "A pullback can go deeper than that and keep the trend. Only a low under 102.40 breaks the pattern."
- **Reveal** (vălul se retrage în 700ms), pași:
  1. "The pullback bottoms at 101.00 on candle 24, under 102.40."
  2. "The higher-low pattern is broken. The uptrend is in question, though not necessarily reversed."
- Text după reveal:
> "Up to 102.40 the swings described an uptrend. The lower low at 101.00 breaks the pattern. One lower low doesn't make a downtrend: a [[reversal]] would also need lower highs."

**B5 · figure** „Zoom out” (închide hook-ul)
- Date: scenario-gen `{ seed: 5097, start: 100, segments: [{ kind: "move", bars: 24, move: 0.003, vol: 0.004, wick: 1.6 }] }`.
  - 24 de lumânări, cu închideri între 99.29 și 101.25.
  - Swing highs: 101.72 (c3), 102.44 (c6), 101.95 (c10).
  - Swing lows: 99.38 (c9), 99.81 (c13), 98.62 (c19).
  - Ultimele trei (c22–c24) sunt lumânările din hook.
- Pași:
  1. "Back to the three green candles from the start: closes 99.40, 100.18 and 100.30."
  2. "Zoom out to 24 candles. Highs: 101.72, 102.44, 101.95. Lows: 99.38, 99.81, 98.62."
  3. "The swings don't line up into a trend or a range. Those three candles were noise."
  4. "On [[timeframe|1-hour candles]], two or three candles one way are often noise. Unclear is information too."
- **Interacțiune:**
  - pasul 2 animă zoom-ul: axa de timp trece de la 3 la 24 de lumânări în 600ms (instant cu reduced motion);
  - `Marker` pe swing-uri la pasul 2.

**B6 · match**
- **Prompt:** "Match each piece of evidence to the market it describes."
- Perechi (textele dovezilor sunt motivele din M02: `hh_hl`, `lh_ll`, `bounded`, `overlap`):
  - "Higher highs and higher lows" ↔ "Uptrend"
  - "Lower highs and lower lows" ↔ "Downtrend"
  - "Price keeps bouncing between two levels" ↔ "Range"
  - "Candles overlap with no direction" ↔ "Noise"
- Feedback la o pereche greșită (elementul revine la loc):
  - dovada de range pusă pe Noise: "Repeated turns at the same levels are edges. Noise has none."
  - dovada de noise pusă pe Range: "A range has edges it keeps returning to. Overlap alone isn't an edge."
  - higher și lower inversate: "Check the direction: higher highs and lows climb, lower ones fall."
- **Concept:** trend, range

**B7 · callout** (key)
> "An idea built for a trend, such as buying a pullback, relies on structure a range doesn't have, and the reverse is also true. Noise has no structure to rely on, only costs to pay. Name the market before you trade it. If you can't, staying out is a valid decision."

### Try
- **Widget:** trend-classifier
- **Valori de start:** trei segmente de câte 30 de lumânări de 1 oră, fiecare pe scala lui, în ordinea A, B, C. Nicio etichetă aleasă, „Show swings” oprit.
  - **A (downtrend):** scenario-gen `{ seed: 5181, start: 104, segments: [move 7 bars −0.022, move 4 bars +0.01, move 7 bars −0.022, move 4 bars +0.01, move 8 bars −0.022] }`, toate cu `vol: 0.003`.
    - Coboară de la 104.00 la 99.24.
    - Maxime: 104.16 (c1), 103.01 (c11), 101.82 (c22).
    - Minime: 101.31 (c8), 100.29 (c17), 99.17 (c27).
    - Lumânarea medie (high − low): 0.80.
  - **B (noise):** `{ seed: 5245, start: 100, segments: [{ kind: "move", bars: 30, move: 0.002, vol: 0.004, wick: 1.6 }] }`.
    - Deschide la 100.00 și închide la 100.20; închiderile rămân între 99.26 și 101.08.
    - Swing highs: 101.20 (c3), 101.71 (c10), 101.22 (c17), 102.01 (c21).
    - Swing lows: 98.93 (c3), 99.36 (c6), 98.16 (c15), 99.87 (c21), 99.38 (c24).
    - Lumânarea medie: 1.29, cu fitile lungi.
  - **C (range):** `{ seed: 9038, start: 100, segments: [{ kind: "range", bars: 30, halfWidth: 0.012, vol: 0.004 }] }`.
    - Între 98.76 și 100.96.
    - Întoarceri în jos: 100.81 (c8), 100.96 (c11), 100.75 (c14), 100.79 (c27).
    - Întoarceri în sus: 98.76 (c5), 98.80 (c17), 98.76 (c23).
    - Lumânarea medie: 0.88.
- **Obiectiv:** "Label each stretch as trend, range or noise. Then pick the evidence that decided it."
- **Reușită:** la același „Check”, toate trei corecte:
  - A = Trend + "Lower highs and lower lows";
  - B = Noise + "Candles overlap with no direction";
  - C = Range + "Price keeps bouncing between two levels".
  - Segmentele corecte se blochează; cele greșite rămân editabile.
- **Indicii:**
  1. "Ignore single candles. Find the turning points and compare each with the one before."
  2. "Swings are now marked. Do the highs step down, repeat at one level, or land anywhere?" (pornește „Show swings”)
  3. "A's highs fall: 104.16, 103.01, 101.82. C turns near 100.80 and 98.80 again and again. B does neither."
- **Show me:**
  - etichetele și dovezile de mai sus;
  - swing-urile marcate;
  - pe C, `Zone` 100.75–100.96 (resistance) și 98.76–98.90 (support).
- **Feedback:**
  - corect: "All three read. A steps down, B goes nowhere, C keeps turning at the same two levels."
  - după o încercare greșită, per segment:
    - A ca Range: "A's highs keep falling: 104.16, 103.01, 101.82. A range would turn at the same levels."
    - A ca Noise: "A has clear swings, each lower than the last. That's structure: a downtrend."
    - A ca Trend, cu dovada „higher highs”: "Trend is right. Check the direction: each high and each low is lower than the last."
    - B ca Range: "B's turns land at different prices: highs from 101.20 to 102.01, lows from 98.16 to 99.87. No edges."
    - B ca Trend: "B ends close to where it started, 100.00 to 100.20. Its swings don't step up or down."
    - C ca Noise: "C has edges: it turned down near 100.80 four times and up near 98.80 three times."
    - C ca Trend: "C's highs and lows don't step one way. They keep returning to the same two levels."
    - eticheta corectă, dovada greșită: "The label is right. Pick the evidence you can actually see on this chart."

### Check
- Întrebări: q-ta-1, q-ta-2, q-ta-3
- **q-ta-3** folosește exact cifrele din B4 (100.00, 101.20, 102.40, apoi 101.00), deci în check devine o întrebare de memorie.
  - Propun ca q-ta-3 să primească `vary` sau cifre noi, de exemplu: swing lows 98.50, 99.30, 100.10, apoi 99.60.
  - 99.60 < 100.10, deci tiparul se rupe; distractorul b rămâne valabil, pentru că 99.60 > 98.50.

### Recap
- **Hook comparat:** "You picked {yours}. Three candles can't show a structure. Zoomed out to 24, they were noise."
- **Three things to remember:**
  1. "Uptrend: higher swing highs and higher swing lows. Downtrend: lower highs and lower lows."
  2. "A range keeps turning near the same floor and ceiling. New highs or lows don't last."
  3. "Noise has no clear swings. If you can't name the market, staying out is valid."
- **Practise it:** M02 Trend or Noise?, Arena: bullish, Arena: sideways

### Note de conținut
- **„Noise: small back-and-forth moves”:**
  - Lecția de azi spune „small”, dar M02 generează zgomotul cu lumânări mai mari decât trendul (`vol: 0.011`, `wick: 1.4`, față de 0.005).
  - Ce definește zgomotul e suprapunerea și lipsa structurii, nu mărimea. Am scris „overlapping”, ca în conceptul `range` și în motivul `overlap` din M02.
- **Exemplul „Is this still an uptrend?”** e păstrat întreg în B4, ca predict & reveal. Faptul „not necessarily reversed” vine din explicația lui q-ta-3.
- **Downtrend:** lecția de azi nu are niciun exemplu de downtrend. Task-ul îl adaugă (segmentul A), ca obiectivul 1 să fie acoperit în ambele direcții.
- **Glosar:**
  - `reversal` nu are lecție azi: se leagă de L05 (B4);
  - `pullback` rămâne la L05;
  - `timeframe` (L01) apare legat în B5;
  - `retracement` nu are lecție și nu apare natural în text. Propun să fie termen înrudit al L05 (în recap și în Library), fără legătură în text.
- **Concepte:**
  - `volatility.lessons` conține L05, dar lecția nu vorbește despre volatilitate. Propun scoaterea L05 de acolo (L16 o acoperă).
  - `timeframe.lessons` conține L05, iar acum B5 îl acoperă.
- **M02 (de semnalat, nu se schimbă aici):**
  - zgomotul e porțiunea 3 în toate cele trei variante, deci e previzibil; propun amestecarea ordinii;
  - M02 numește zgomotul „No clear structure”, task-ul îl numește „Noise”. De ales un singur nume.
- **De decis:**
  - **Durata:** cu 7 beat-uri și un task cu trei segmente, lecția are mai degrabă 6 minute decât 5.
  - **Hook-ul:** are „Can't tell yet” ca citire onestă. Ca tiparul „can't tell” să nu devină răspunsul automat, predict-ul din L06 (B4) nu are această variantă.

---

## L06 · Support, resistance and breakouts

| | |
|---|---|
| Unitate | U2 · Reading price, lecția 2 din 3 |
| Durată | 6 min · 7 beat-uri în Learn |
| Concepte | support-and-resistance, breakout, false-breakout |
| Termeni (glosar) | support, resistance, close, wick, ask, stop-loss, breakout, commission, invalidation |
| Se sprijină pe | L05, L04, L02 |
| Pregătește | M04 Define Your Risk, Arena: breakout, Arena: false breakout, L10 |

**Obiective**
1. Mark support and resistance as zones from repeated turns in price.
2. Describe what separates a breakout from a false breakout.
3. Plan a stop that allows for a breakout failing.

### Hook
- **Tip:** predict · tap pe grafic; se înregistrează prețul atins, cu snap 0.01
- **Grafic:** range-ul lecției, c1–c30 (date la B2), fără zone și fără etichete.
- **Prompt:** "LABX has moved sideways for 30 hours. Tap the price where it keeps turning down."
- **Control din tastatură:** focus pe grafic; săgeți sus/jos mută un cursor de preț (±0.05, Shift ±0.50); Enter confirmă.
- **Răspuns:** zona 101.85–102.10 (întoarcerile din c5, c12 și c20). Nu se notează; recap-ul compară prețul atins cu zona.
- **Concept:** support-and-resistance

### Learn
**B1 · explain**
> "[[support|Support]] is a price area where falls have repeatedly stopped and turned up. [[resistance|Resistance]] is an area where rises have repeatedly stopped and turned down. They're zones, not exact lines: price might turn at 98.10 one time and 97.90 the next. The more clearly a level has been respected, the more traders notice it."

**B2 · figure** (din diagrama `support-resistance`)
- Date: serie definită în conținut, folosită și în hook, în B3 și în B4.
  - 30 de lumânări de 1 oră între 97.90 și 102.30, pornind de la 100.20.
  - Întoarceri în jos (maxime): 101.95 (c5), 102.10 (c12), 101.85 (c20).
  - Întoarceri în sus (minime): 98.10 (c8), 97.90 (c16), 98.05 (c23).
  - c27: fitil până la 102.30, închidere la 101.80 (testul din B3).
  - c30 închide la 101.60.
- Pași:
  1. "Rises keep stalling near 102.00: candles 5, 12 and 20 turn down."
  2. "Falls keep stalling near 98.00: candles 8, 16 and 23 turn up."
  3. "No two turns match, so mark zones: 101.85–102.10 and 97.90–98.10."
- **Interacțiune:**
  - la pașii 1 și 2, atingerile se marchează una câte una (`Marker`, 120ms între ele);
  - la pasul 3 apar două `Zone`, cu rol resistance și support.

**B3 · hotspot**
> "Mark a level from at least two clear turns near the same price. Draw a band wide enough to cover them. Watch the [[close|closes]] as well as the [[wick|wicks]]: a wick that pokes through and closes back inside is a test, not a break."
- **Prompt:** "Tap the candle that tested resistance without breaking it."
- **Țintă:** c27; `Hotspot` pe toată lumânarea, cu fitil.
- **Feedback:**
  - corect: "Candle 27's wick reached 102.30, above the zone, but it closed at 101.80. A test, not a break."
  - greșit: "That candle stayed inside the zone. Look for a wick above 102.10 with a close back below it." Zona corectă se conturează.
- **Concept:** support-and-resistance

**B4 · reveal** „Same start, two endings” (din diagrama `breakout-false-breakout` și exemplul lecției)
- Date: continuarea graficului din B2.
  - c31: o 101.60, h 102.75, l 101.50, c 102.60.
  - `Level` entry 102.65 (ask) și `Level` stop 101.70.
  - Văl peste c32–c35.
  - **Ending A:** c32 închide la 102.90, c33 la 103.40; c34 coboară la 102.20 și închide la 103.10; c35 închide la 103.80.
  - **Ending B:** c32 deschide la 102.60, coboară la 101.30 și închide la 101.40.
    - Stop-ul se execută la 101.70: deschiderea e peste stop, deci nu există gap. `Marker` „Stop filled”.
    - c33 închide la 100.90, c34 la 101.20, c35 la 100.60.
- **Prompt:** "LABX ranged between 98.00 and 102.00. Candle 31 closed at 102.60. A buyer enters at the [[ask]], 102.65, with a [[stop-loss|stop]] at 101.70. Does the move hold?"
- **Variante:** "It holds above 102.00" · "It falls back inside"
- **Răspuns:** fără un singur răspuns. Reveal-ul arată ambele finaluri: întâi A, apoi B, cu butonul „Show the other ending”.
- Pași după reveal:
  1. "Ending A: closes at 102.90 and 103.40. Dips hold above 102.00: old resistance acts as support."
  2. "Ending B: the next candle falls to 101.30 and closes at 101.40. The stop fills at 101.70."
- **Feedback** (același pentru ambele alegeri): "Both endings started from the same candle. At 102.60 your pick couldn't be checked. The stop could be planned."

**B5 · explain**
> "Ending A was a [[breakout]]: price closed beyond the level and kept going. Ending B was a false breakout: price closed beyond the level, then fell back inside the range. At the moment of the break they looked the same. The difference only showed in the candles that followed."

**B6 · worked** "What ending B cost"
- Linii:
  - "Entry at the ask: 102.65. Stop: 101.70, back inside the range."
  - "Price loss per unit: 102.65 − 101.70 = 0.95."
  - "[[commission|Commission]] per unit: 0.05% × 102.65 + 0.05% × 101.70 ≈ 0.05 + 0.05 = 0.10."
- **Ultimul pas îl calculează utilizatorul:** "Total loss per unit at the stop = ?"
  - Răspuns: 1.05 (toleranță 0.01). Exact: 0.95 + 0.051325 + 0.05085 = 1.052175.
- **Rezultat afișat:** "At entry the two endings looked identical. The stop is what kept ending B a small, planned loss."
- **Feedback corect / greșit:** "Right: 0.95 + 0.10 = 1.05 per unit, decided before entry." / "Add both parts: the price distance, 0.95, and the commission, about 0.10."

**B7 · callout** (warning)
> "Waiting for a close beyond the level filters out some false moves, at the cost of a later entry. Nothing filters out all of them. Before entering, decide where price would be if the breakout failed, your [[invalidation]], and put the stop there. Buying the instant price pokes through, with no exit ready, leaves you deciding under pressure."

### Try
- **Widget:** level-drawer
- **Valori de start:**
  - **Spec:** scenario-gen `{ seed: 6375, start: 103.2, segments: [{ kind: "range", bars: 36, halfWidth: 0.013, vol: 0.004 }, { kind: "move", bars: 2, move: 0.0136, vol: 0.002 }, { kind: "candle", body: 0.0082, upper: 0.0015, lower: 0.001, volume: 1.8 }, …final] }`.
    - Final FAIL: `[{ kind: "move", bars: 3, move: -0.011, vol: 0.002 }, { kind: "move", bars: 9, move: -0.008, vol: 0.003 }]`.
    - Final HOLD: `[{ kind: "move", bars: 3, move: -0.002, vol: 0.002 }, { kind: "move", bars: 9, move: 0.012, vol: 0.003 }]`.
    - Primele 39 de lumânări sunt identice în ambele finaluri (verificat).
  - **Vizibile la start: c1–c38**, un range între 101.75 și 104.41.
    - Întoarceri în jos (swing highs): 104.19 (c8), 104.22 (c22), 104.38 (c25), 104.41 (c33). c26 și c27 ajung la 104.20 și 104.23, dar nu sunt swing-uri, deci nu se numără separat.
    - Maxime mai joase: 103.81 (c13), 103.57 (c17).
    - Întoarceri în sus: 101.84 (c4), 101.79 (c9), 101.75 (c14). Minime mai înalte: 102.25 (c19), 102.20 (c28), 102.44 (c31).
    - c37–c38 urcă spre plafon: c38 închide la 104.01 (maxim 104.07).
  - **c39 (breakout):** o 104.01, h 105.02, l 103.91, c 104.86. Entry la ask: 104.91.
  - **Final FAIL** (primul la Play):
    - c40: h 105.14, l 104.09, c 104.25;
    - c41: l 103.78, c 103.81, prima închidere sub zonă;
    - apoi scade până la c51, care închide la 102.88; minimul e 102.75.
  - **Final HOLD:**
    - c40: l 104.41, c 104.57; c41: l 104.40, c 104.44; c42: l 104.21, c 104.65; c43: c 104.91;
    - apoi urcă, cu maximul la 106.56 (c49); c51 închide la 105.91;
    - cea mai mică închidere după breakout e 104.44.
  - **Controale la start:** rol Resistance, banda la 103.00–103.30, stop-ul ascuns până la faza 2.
- **Obiectiv:** "Drag a resistance band over the turns where LABX keeps stalling. Then place a stop for a breakout buy and play the chart."
- **Reușită**, în două părți, fiecare cu „Check”:
  1. **Banda:** rol Resistance, cel puțin 3 atingeri în bandă și înălțimea între 0.10 și 0.50.
  2. **Stop-ul:** după ce apare c39, bandLow − 0.80 ≤ stop ≤ bandLow − 0.10, adică sub zonă, înapoi în range, cu o marjă.
  - Play-ul nu e condiție de reușită.
- **Indicii:**
  1. Partea 1: "Find where rises stalled. Several highs end near the same price."
  2. Partea 1: "Four turns down sit between 104.19 and 104.41. Cover them with one band."
  3. Partea 2: "If the breakout fails, price closes back below your band. Put the stop just under it, with a small buffer."
- **Show me:**
  - banda 104.19–104.41, cu 4 atingeri marcate;
  - stop-ul la 104.00;
  - apoi Play pe finalul FAIL.
- **Feedback:**
  - Partea 1, corect: "{touches} touches between {low} and {high}. That's a zone, not a line."
  - Partea 1, după o încercare greșită:
    - sub 3 atingeri: "Only {touches} turns sit inside your band. Move or widen it to cover the cluster of highs."
    - prea înaltă: "That band is {height} tall. It catches almost anything. Tighten it around the turns."
    - prea subțire: "A band thinner than 0.10 is a line. Widen it to cover the touches."
    - rol Support, cu ≥ 3 atingeri: "That's a valid support zone. For this task, mark the ceiling the breakout will test."
  - Partea 2, corect: "Stop at {stop}: if price closes back inside, you're out. Risk {entry − stop} per unit, about {total} with commission."
  - Partea 2, după o încercare greșită:
    - prea aproape de zonă sau în ea: "At {stop} the stop sits in or right under your zone. A retest of the zone could hit it while the breakout is still fine."
    - prea departe: "At {stop} the risk is {entry − stop} per unit. The breakout idea is already wrong once price is back inside the range."
  - După Play:
    - FAIL: "The break failed: candle {k} closed at {close}, back inside. Your stop at {stop} filled: {entry − stop} per unit, about {total} with commission. A planned loss."
    - HOLD: "The break held: no close fell back below your zone, and dips into it turned back up. Old resistance acted as support."
    - după ce s-au văzut ambele: "Same history, same candle 39, two endings. Your plan was the same in both."
- **Pentru Show me (verificat):** stop 104.00, finalul FAIL.
  - Execuție în c41 la 104.00: c41 deschide la 104.25 și coboară la 103.78.
  - 104.91 − 104.00 = 0.91 pe unitate.
  - Comision 0.05% × 104.91 + 0.05% × 104.00 = 0.104455, deci în total ≈ 1.01.
  - În finalul HOLD stop-ul nu e atins: minimul după breakout e 104.21, adică bid 104.16.

### Check
- Întrebări: q-ta-4, q-ta-5, q-ta-6
- **Înlocuire propusă:** q-ta-4 → **q-ta-11** (nouă), în checkul lecției. q-ta-4 rămâne în assessment și în recapitulare.
  - **Motiv:** obiectivul 3 (stop-ul pentru un breakout eșuat) nu are nicio întrebare în bancă. q-ta-4 (definiția suportului) e acoperită deja de hook, B1 și B2.
  - **q-ta-11 · mcq · d2 · L06**, de scris în `questions-markets-and-sizing.md`:
    - **Prompt:** "LABX ranged between 46.00 and 49.00. A candle closes at 49.40 and you buy at the ask, 49.45. Where does a stop that plans for a false breakout belong?"
    - `a` "At 49.35, just under your entry" → "0.10 below entry sits inside ordinary candle-to-candle noise. It can fill while the breakout is still intact."
    - `b` ✓ "Just back inside the range, at about 48.70". Pierdere la stop: 0.75 pe unitate, înainte de comision.
    - `c` "No stop: waiting for the close already filtered false moves" → "A close filters some false moves, not all. Without a stop there is no exit ready."
    - `d` "Below the range floor, at 45.80" → "The idea is already wrong once price is back inside the range. 45.80 risks far more than the idea needs."
- **q-ta-5** repetă exact finalul B din B4 (98.00–102.00, închidere la 102.60, apoi 101.40).
  - Propun `vary` sau cifre noi, de exemplu: range 74.00–77.00, închidere la 77.50, apoi 76.60.
- **q-ta-6** (fitil la 102.40, închidere la 101.70) e apropiată de hotspot-ul din B3 (102.30 / 101.80), dar nu identică. Rămâne: e un transfer apropiat.

### Recap
- **Hook comparat:** "You tapped {yours}. LABX turned down between 101.85 and 102.10: a zone, not one price."
- **Three things to remember:**
  1. "Mark support and resistance as zones, from at least two clear turns near the same price."
  2. "A breakout and a false breakout look the same at the break. Later closes tell them apart."
  3. "Before buying a breakout, put the stop where it would have failed: back inside the range."
- **Practise it:** Arena: breakout, Arena: false breakout, M04 Define Your Risk

### Note de conținut
- **Exemplul „Same start, two endings”:**
  - pierderea „0.95 per unit before commission” e păstrată;
  - B6 adaugă comisionul (≈ 0.10), deci ≈ 1.05 pe unitate în total (verificat mai sus);
  - stop-ul unui long se execută când bid-ul atinge nivelul (`engine.ts`), deci la 101.70, fără gap.
- **Schimbarea de rol a nivelului** („old resistance may act as support”) apare de două ori:
  - în pasul 1 al reveal-ului din B4, ca descriere a finalului A;
  - în finalul HOLD al task-ului.
- **Diagrame de azi:**
  - `support-resistance` desenează linii simple, deși textul cere benzi; în plus, colorează rezistența cu `neg` și suportul cu `pos`. În kit, `Zone` cu rolurile resistance/support rezolvă ambele.
  - În `breakout-false-breakout`, panoul „false breakout” se termină sub podeaua range-ului (y = 160, sub linia de la 150). Arată o rupere în jos, nu o revenire în range. Varianta nouă se termină în interior.
- **Glosar:**
  - `close` (L01) e legat aici, pentru că definiția lui pomenește confirmarea breakout-ului;
  - `invalidation` e legătură înainte, spre L10;
  - `consolidation` nu are lecție. Propun să fie termen înrudit al L06, fără text nou: o frază despre „breakouts from a tight range” ar fi o afirmație nouă despre piață.
- **Volumul:** conceptul `breakout` pomenește volumul în creștere, lecția nu. Arena are toggle de volum. Propun să rămână în afara lecției până când există o lecție despre volum.
- **De decis:**
  - **Task-ul în două părți:** în două părți (bandă, apoi stop) e mai lung decât celelalte (~2 min). Alternativa: doar banda, iar stop-ul fixat de conținut la 104.00. Recomand varianta în două părți, pentru că doar ea acoperă obiectivul 3.

---

## L07 · Moving averages without the magic

| | |
|---|---|
| Unitate | U2 · Reading price, lecția 3 din 3 |
| Durată | 6 min · 7 beat-uri în Learn |
| Concepte | moving-average (cu trend și range, reluate) |
| Termeni (glosar) | sma, close, moving-average, ema, spread, commission |
| Se sprijină pe | L05, L02 |
| Pregătește | M02 Trend or Noise?, Arena (toggle-urile SMA 20 și SMA 50) |

**Obiective**
1. Calculate a simple moving average from a list of closes.
2. Explain why a moving average lags and what that means for signals based on it.
3. Use a moving average to describe trend direction, not to forecast it.

### Hook
- **Tip:** predict · slider 100.00–110.00, pas 0.10, start 105.00
- **Grafic:** 6 lumânări cu închideri la 100.00, 101.00, 102.00, 103.00, 104.00 și 110.00. Slider-ul mută un punct (rol accent-2) pe verticală, deasupra lumânării 6.
- **Prompt:** "LABX closes at 100.00, 101.00, 102.00, 103.00 and 104.00. The next candle closes at 110.00. Guess the average of the last five closes."
- **Răspuns:** 104.00. Comparat în recap.
- **Concept:** moving-average

### Learn
**B1 · explain**
> "A [[sma|simple moving average]] (SMA) is the average of the last N [[close|closes]], recalculated at every candle. A 20-period SMA on 1-hour candles averages the last 20 hours. When a new candle closes, the oldest close drops out and the newest joins. The line is smoother than price: it filters out some candle-to-candle noise."

**B2 · worked** "A 5-period SMA by hand"
- Linii:
  - "Closes: 100.00, 101.00, 102.00, 103.00, 104.00."
  - "SMA = (100.00 + 101.00 + 102.00 + 103.00 + 104.00) ÷ 5 = 510.00 ÷ 5 = 102.00."
  - "The next candle closes at 110.00. Drop 100.00, add 110.00."
- **Ultimul pas îl calculează utilizatorul:** "New SMA = (101.00 + 102.00 + 103.00 + 104.00 + 110.00) ÷ 5 = ?"
  - Răspuns: 104.00 (toleranță 0). Calcul: 520.00 ÷ 5.
- **Rezultat afișat:** "Price is at 110.00, but the average is only 104.00. The average always trails behind price."
- **Feedback corect / greșit:**
  - corect: "Right: 520.00 ÷ 5 = 104.00. Price is at 110.00; the average trails."
  - greșit: "Add the five newest closes: 101.00 + 102.00 + 103.00 + 104.00 + 110.00 = 520.00. Then divide by 5."
  - pentru 103.33: "That averages six closes. A 5-period SMA drops the oldest, 100.00."

**B3 · figure + reveal** (din diagrama `moving-average`; predict înainte de ultimii pași)
- Date: scenario-gen `{ seed: 7490, start: 106, segments: [{ kind: "move", bars: 50, move: -0.02, vol: 0.004 }, { kind: "move", bars: 20, move: -0.05, vol: 0.004 }, { kind: "move", bars: 20, move: 0.055, vol: 0.004 }] }`.
  - Primele 50 de lumânări sunt istoric ascuns, folosit doar pentru MA; se văd 40.
  - `MA` 10 perioade.
  - Prețul coboară de la 102.78 (c1) la cea mai mică închidere, 97.90 (c19; fitil până la 97.32), apoi urcă la 104.12 (c40).
  - SMA10: 98.65 la c21; minimul, 98.55, la c24. Fereastra c15–c24 însumează 985.49, deci 98.549. La c40, 102.32.
  - **Văl** de la c22 la c40.
- Pași înainte de predict:
  1. "Price falls for 19 candles to a 97.90 close, then turns up."
  2. "The 10-period SMA follows, smoother. At candle 21 it is still falling, at 98.65."
- **Predict:**
  - **Prompt:** "Price made its lowest close two candles ago. When will the 10-period average make its low?"
  - **Variante:** "It already has" · "On the next candle" · "Three or more candles from now"
  - **Răspuns:** "Three or more candles from now" (minimul vine la c24).
  - **Feedback:**
    - corect: "Right. It bottoms on candle 24: three candles from here, five after price."
    - "It already has": "It's still falling. Each new close replaces an older, higher one, so the average keeps dropping."
    - "On the next candle": "Not yet. For three more candles, each new close replaces an older, higher one."
- Pași după reveal (vălul se retrage în 700ms):
  3. "The average bottoms at 98.55 on candle 24: five candles after price did."
  4. "By candle 40 price is at 104.12. The average, at 102.32, still trails."

**B4 · explain**
> "A [[moving-average|moving average]] turns only after price has turned, because it averages the past. A longer period gives a smoother line and more lag. A shorter one reacts faster but follows more of the noise. No setting removes this trade-off. An [[ema|exponential moving average]] weights recent closes more, so it reacts sooner, but still lags."

**B5 · match** (sortare în două coloane)
- **Prompt:** "Sort each statement: can a moving average do this?"
- Coloane: "It can" · "It can't"
- Elemente:
  - "Describe direction: price mostly above a rising average fits an uptrend" → It can
  - "Show how far price has moved from its recent average" → It can
  - "Predict a turn before price makes it" → It can't
  - "Give meaningful crossings in a range" → It can't
- Feedback la o plasare greșită:
  - „Predict a turn” pus la „It can”: "By the time the line turns, much of the move may be over."
  - „Meaningful crossings in a range” pus la „It can”: "In a range, price crosses the average again and again, so each crossing means little."
  - un „It can” pus la „It can't”: "This one only describes the past, which is exactly what an average does."
- **Concept:** moving-average

**B6 · explain**
> "Crossover rules turn the average into a signal: buy when price crosses above it, sell when it crosses below. In a steady trend the signals arrive late. In a range they arrive often and reverse quickly, and every one of those trades pays the [[spread]] and [[commission]]."

**B7 · callout** (key)
> "A moving average summarises where price has been. Use it as one description of the trend, alongside swing highs and lows, not as a rule that makes decisions for you."

### Try
- **Widget:** ma-period
- **Valori de start:** perioada 5, piața Trend.
  - **Trend:** scenario-gen `{ seed: 7301, start: 100, segments: [{ kind: "move", bars: 50, move: 0.03, vol: 0.004 }, { kind: "move", bars: 35, move: 0.06, vol: 0.004 }, { kind: "move", bars: 45, move: -0.08, vol: 0.004 }] }`.
    - Primele 50 de lumânări sunt istoric ascuns, folosit doar pentru MA; se văd 80.
    - Urcă de la 102.94 (închiderea c1) la cea mai mare închidere, 109.67, la c36 (maxim 110.00).
    - Apoi coboară la 100.45 (c80); minimul e 100.10.
  - **Range** (comutator, doar pentru explorare): `{ seed: 7351, start: 100, segments: [{ kind: "range", bars: 130, halfWidth: 0.02, vol: 0.006 }] }`.
    - Tot 50 ascunse și 80 vizibile, între 97.82 și 102.25.
- **Obiectiv:** "Find a period with at most 1 false signal that still turns within 8 candles of the top."
- **Reușită:** piața Trend, false signals ≤ 1 și lag ≤ 8. Pe aceste date înseamnă perioadele 13–21.
- **Valori verificate (Trend):**

  | Perioadă | Încrucișări | False | Lag | Vârful MA |
  |---|---|---|---|---|
  | 5 | 13 | 7 | 2 | c38 · 109.43 |
  | 10 | 7 | 4 | 6 | c42 · 109.19 |
  | 12 | 3 | 2 | 5 | c41 · 109.11 |
  | 13 | 1 | 0 | 6 | c42 · 109.08 |
  | 15 | 1 | 0 | 7 | c43 · 108.92 |
  | 20 | 1 | 0 | 7 | c43 · 108.65 |
  | 21 | 1 | 0 | 8 | c44 · 108.61 |
  | 22 | 1 | 0 | 9 | c45 · 108.55 |
  | 30 | 1 | 0 | 11 | c47 · 108.12 |
  | 50 | 1 | 0 | 23 | c59 · 107.27 |

- **Valori verificate (Range), încrucișări / false:**
  - 5: 24 / 20; 15: 20 / 14; 20: 20 / 14; 29: 14 / 7; 50: 18 / 11.
  - Minimul de false între 5 și 50 e 7, la perioadele 27–29.
- **Indicii:**
  1. "Short periods turn fast but cross price often. Long ones cross rarely but turn late."
  2. "Slide slowly from 5 and watch both numbers: false signals fall, lag rises."
  3. "Try periods between 13 and 21."
- **Show me:** perioada 15: 0 false, lag 7; vârful MA la c43, 108.92.
- **Feedback:**
  - corect: "Period {n}: {f} false signals, and it topped {lag} candles after price. You chose where to sit on the trade-off; nothing removes it."
  - după o încercare greșită:
    - prea scurtă (false > 1): "Period {n} follows the noise: {f} crossings reversed within 5 candles. Try a longer period."
    - prea lungă (lag > 8): "Period {n} is smooth but late: it topped {lag} candles after price. Try a shorter one."
  - după reușită, invitație: "Now switch to Range. At period {n} you get {f} false signals: in a range, no period fixes this."

### Check
- Întrebări: q-ta-7, q-ta-8, q-ta-10
- **Înlocuire propusă:** q-ta-10 → **q-ta-9**. q-ta-10 rămâne în assessment și în recapitulare.
  - **Motiv:** obiectivul 3 („describe, not forecast”) nu e acoperit de checkul de azi. q-ta-9 (încrucișările dintr-un range) îl acoperă.
  - Compromisul perioadă / lag, testat de q-ta-10, e exersat deja în Try.
  - q-ta-9 nu e folosită azi în nicio lecție.
- **q-ta-7:** dă 102.00, aceeași sumă (510.00) ca primul pas din exemplu. De aceea B2 cere utilizatorului al doilea pas (104.00), nu primul.

### Recap
- **Hook comparat:** "You guessed {yours}. The five-close average was 104.00 with price at 110.00: the average trails."
- **Three things to remember:**
  1. "An SMA adds the last N closes and divides by N. Each new close replaces the oldest."
  2. "An average turns after price. Longer periods: smoother, more lag. Shorter: faster, noisier."
  3. "Use a moving average to describe the trend, beside swings. It doesn't forecast turns."
- **Practise it:** M02 Trend or Noise?, Arena: sideways, Arena: bullish

### Note de conținut
- **Diagrama `moving-average` de azi are două erori:**
  - legenda spune „A 20-period SMA”, dar SVG-ul calculează o medie pe 5 perioade (`slice(i - 4, i + 1)`);
  - `aria-label` spune „Price falls and then turns up”, dar desenul (axa y inversată în SVG) arată o creștere urmată de o scădere, adică un vârf.
  - Figura nouă (B3) e un minim, cu SMA10 și cifre verificate. Task-ul arată un vârf, deci întârzierea apare la minime și la maxime deopotrivă, ca în legenda de azi.
- **EMA:** `ema` din glosar are lecția L07, dar lecția de azi nu pomenește EMA. Am adăugat o propoziție în B4, din `concepts.ts` (`moving-average`, primul paragraf).
- **„Choosing a period only chooses where you sit on it”:** n-a mai încăput în B4 (limita de 60 de cuvinte). Trece în feedback-ul de reușită din Try.
- **Practise it:**
  - M02 nu afișează nicio medie mobilă (`moving-average.missions` e gol);
  - Arena are toggle-urile SMA 20 și SMA 50, deci e locul firesc de exersat;
  - propun eticheta „Arena: sideways (turn on SMA 20)”;
  - M02 rămâne, fiind misiunea de final a unității. De decis dacă se păstrează la L07.
- **„False signal”:** definiția din task (o încrucișare inversată în cel mult 5 lumânări) e o regulă didactică, nu un standard.
  - Se afișează cu tooltip: "Reversed within 5 candles".
  - Pentru a nu fi luată drept regulă de tranzacționare, nu apare în textele lecției.
- **Nivelul:** L07 e singura lecție intermediate din U2. Rămâne așa.

---

## Cerințe pentru widget-uri

Toate trei folosesc Learn Chart Kit și modelul comun de task:
- obiectiv, valori de start, condiție de reușită evaluată de `evaluateSuccess` (funcție pură, testată);
- Reset și Show me animat;
- 3 indicii în trepte; al doilea indiciu greșit îl oferă singur;
- stările idle → engaged → submitted → correct / incorrect → resolved;
- feedback cu `aria-live="polite"` și o variantă completă din tastatură.

Variabilele dintre acolade (`{n}`, `{f}`, `{lag}`, `{stop}`, `{entry − stop}`, `{total}`, `{k}`, `{close}`, `{touches}`, `{low}`, `{high}`, `{height}`) sunt completate de widget, cu 2 zecimale la prețuri.

### trend-classifier (L05)
- **Date (din conținut):** o listă de 3 segmente. Fiecare are:
  - `id` (A, B, C) și un `ScenarioSpec`;
  - eticheta corectă (`trend` / `range` / `noise`) și dovada corectă (id-urile motivelor din M02: `hh_hl`, `lh_ll`, `bounded`, `overlap`);
  - textele de feedback per etichetă greșită.
- **Afișare:**
  - 3 mini-grafice (`LearnChart` + `Candles`), fiecare pe scala lui, cu prețul de început și de sfârșit pe axă;
  - pe desktop, 3 coloane; pe mobil, unul sub altul, în ordinea A, B, C.
- **Controale per segment:**
  - grup radio de etichete: Trend · Range · Noise;
  - grup radio de dovezi, cu cele 4 texte din M02, activ după alegerea etichetei.
- **Controale globale:**
  - comutatorul „Show swings” (`Marker` pe swing highs și lows, definiția din introducerea unității); îl pornește indiciul 2;
  - „Check”, activ când toate trei au etichetă și dovadă;
  - Reset și Show me.
- **Stări per segment:**
  - corect: blocat, cu bifă desenată și text;
  - greșit: rămâne editabil, cu feedback-ul specific combinației alese;
  - culorile salvie / cărămiziu nu se folosesc pentru corect / greșit (§8.2).
- **Ieșiri:** rezultatul pe segment și un total („2 of 3”).
- **Reușită:** `{ all: [{ seg: "A", label: "trend", evidence: "lh_ll" }, { seg: "B", label: "noise", evidence: "overlap" }, { seg: "C", label: "range", evidence: "bounded" }] }`.
- **Tastatură:** Tab între segmente și grupuri; săgețile schimbă opțiunea în grup; Enter pe „Check”.
- **Accesibilitate:**
  - descrierea text a fiecărui segment nu numește structura;
  - dă prețul de început și de sfârșit, minimul, maximul și, cu „Show swings”, lista swing-urilor (preț și lumânare), ca exercițiul să se poată rezolva fără grafic.
- **Show me:** etichetele și dovezile corecte, swing-urile, două `Zone` pe C (100.75–100.96 resistance, 98.76–98.90 support).

### level-drawer (L06)
- **Date (din conținut):**
  - un `ScenarioSpec` de bază și două finaluri (FAIL, HOLD), care împart primele 39 de lumânări;
  - `visibleTo: 38`, `breakIndex: 39`, `endIndex: 51`;
  - ordinea finalurilor la Play (FAIL, apoi HOLD).
- **Faza 1, Draw:**
  - **Rol:** comutator Resistance · Support (start Resistance).
  - **Banda:** `Zone` draggable, cu trei mânere: corpul (mută toată banda), marginea de sus și marginea de jos.
    - Snap 0.01, cu urmărire fără întârziere și snap de 120ms la eliberare (§8.3).
    - Înălțimea permisă de control: 0.05–1.50. Reușita cere 0.10–0.50.
    - Start: 103.00–103.30.
  - **Tastatură:** Tab pe corp, pe marginea de sus și pe cea de jos; săgeți ±0.01, Shift + săgeți ±0.10.
  - **Ieșiri live** (calculate la fiecare mișcare, pe c1–c38):
    - "Zone {low}–{high} · {height} tall";
    - "Touches: N", cu `Marker` pe fiecare;
    - "Tests: N", cu alt `Marker`;
    - "Breaks: N".
  - **Definiții, pentru rezistență** (pentru suport, simetric, cu swing lows):
    - atingere = un swing high (definiția din introducerea unității) cu maximul în bandă;
    - test = orice lumânare cu maximul peste bandă și închiderea sub marginea de sus;
    - rupere = închidere peste marginea de sus.
  - **Valori de verificat:**
    - swing highs în c1–c38: 104.19 (c8), 103.81 (c13), 103.57 (c17), 104.22 (c22), 104.38 (c25), 104.41 (c33);
    - banda 104.19–104.41 dă 4 atingeri (c8, c22, c25, c33), 0 teste, 0 ruperi.
- **Faza 2, Plan:**
  - apare c39 (breakout);
  - `Level` entry fix, la închiderea c39 + 0.05 (ask): 104.91;
  - `Level` stop draggable: start 104.60, snap 0.01, aceleași taste;
  - **ieșiri:** "Risk per unit: {entry − stop}" și "≈ {total} with commission", unde total = (entry − stop) + 0.05% × entry + 0.05% × stop.
- **Faza 3, Play:**
  - butonul Play retrage vălul peste c40–c51 în 700ms, lumânările apărând în același ritm; „Pause” e disponibil;
  - **execuția stop-ului:** stop-ul long se execută când bid-ul (mid − 0.05) atinge nivelul, la prețul stop-ului; la gap, la deschidere (ca `engine.ts`);
  - `Marker` „Stop filled”;
  - **ieșiri:**
    - "Break held" sau "Break failed: candle {k} closed back inside at {close}" (prima închidere sub marginea de jos în cele 12 lumânări);
    - "Stop filled at {stop}" sau "Stop not touched";
  - butonul „Other ending” reia de la c39 cu celălalt final.
- **Reușită:**
  - partea 1: `{ role: "resistance", touches: { gte: 3 }, height: { gte: 0.10, lte: 0.50 } }`;
  - partea 2: `{ stop: { gte: "bandLow - 0.80", lte: "bandLow - 0.10" } }`;
  - Play nu intră în condiție.
- **Garanții verificate pe date**, pentru toate cele 676 de benzi valide (pas 0.01; bandLow între 103.72 și 104.22) și toate stop-urile valide ale fiecăreia:
  - orice stop valid se execută în finalul FAIL, la prețul stop-ului (fără gap);
  - niciun stop valid nu e atins în finalul HOLD: minimul după breakout e 104.21, iar stop-ul maxim posibil e 104.12;
  - în FAIL există mereu o închidere sub bandLow; în HOLD, niciuna.
- **Reset:** înapoi la faza 1, cu banda la start.
- **Show me:** banda 104.19–104.41, apoi stop-ul 104.00, apoi Play pe finalul FAIL.

### ma-period (L07)
- **Date (din conținut):** două serii, Trend și Range. Fiecare are:
  - un `ScenarioSpec` și `warmup: 50`: lumânările ascunse, folosite doar ca MA să existe de la prima lumânare vizibilă, chiar la perioada 50;
  - pentru Trend, indexul vârfului de preț (c36).
- **Controale:**
  - **slider „Period”:** 5–50, pas 1.
    - Săgeți ±1, PageUp/PageDown ±5, Home/End la capete.
    - Repere vizibile la 20 și 50, cu eticheta „Arena” (toggle-urile din Arena).
  - **comutator „Market”:** Trend · Range (start Trend).
- **Desen:**
  - `Candles` și `MA` (rol accent-2, 2px), recalculate live la fiecare pas al slider-ului, fără animație de tranziție;
  - `Marker` pe încrucișări (▲ peste, ▼ sub); cele false au inel;
  - în Trend: `Marker` pe cea mai mare închidere (c36) și pe vârful MA, cu un `Bracket` orizontal între ele, etichetat „lag N”.
- **Definiții** (pe lumânările vizibile):
  - încrucișare = închiderea trece pe cealaltă parte a MA față de lumânarea anterioară; egalitatea păstrează partea;
  - falsă = urmată de încrucișarea opusă în cel mult 5 lumânări;
  - lag = indexul maximului MA după vârful prețului − indexul vârfului prețului. Doar în Trend; în Range se afișează „—”.
- **Ieșiri live:** "Crossings N" · "False signals N" · "Lag N candles".
- **Test unitar:** tabelele din L07 / Try (Trend: 5, 10, 12, 13, 15, 20, 21, 22, 30, 50; Range: 5, 15, 20, 29, 50) trebuie reproduse exact.
- **Reușită:** `{ market: "trend", falseSignals: { lte: 1 }, lag: { lte: 8 } }`. Pe aceste date: perioadele 13–21.
- **Show me:** slider-ul animat la 15.
- **Accesibilitate:**
  - slider-ul anunță „Period 15: 1 crossing, 0 false signals, lag 7 candles”;
  - descrierea text a graficului listează încrucișările (lumânare și sens).

### Alte cerințe pentru player, din această unitate
- **predict cu `Level` tras** (L05 B4): răspuns numeric cu interval acceptat, apoi reveal pe același grafic.
- **reveal cu două finaluri** (L06 B4, aceeași idee ca în `level-drawer`): butonul „Show the other ending”, iar feedback-ul nu depinde de alegere.
- **hook cu tap pe grafic** (L06): se salvează prețul (`hookAnswer: number`); există alternativă din tastatură.
- **hotspot pe o lumânare** (L06 B3): zona apăsabilă include fitilul.
- **match ca sortare în 2 coloane** (L07 B5): o țintă primește mai multe elemente.
- **pași de figură cu marcaj de glosar** (L05 B5, `[[timeframe|…]]`): dacă pașii nu acceptă marcaj, legătura se mută în textul de după figură.
