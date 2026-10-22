# Widget-uri cerute de fișe, încă neconstruite

Lecțiile scrise direct în cod (valurile 2 și 3) folosesc cele 13 widget-uri existente sau, unde fișa cere un widget nou, beat-uri interactive în locul fazei Try (AUTHORING §3). Lista de mai jos adună widget-urile cerute, ca să se construiască în ordinea folosului: când un widget e gata, lecțiile din coloana a treia primesc faza Try reală.

| Widget | Ce face | Lecții care îl așteaptă | Înlocuit acum cu |
|---|---|---|---|
| `streak-sim` | simulează serii de câștiguri și pierderi pentru o rată de câștig dată | 0.2.x, 1.7.x | `expectancy` (lungimea seriei) |
| `blind-grade` | notezi decizii fără să vezi rezultatul, apoi îl vezi | 0.2.1, 1.7.4 | `bias-spotter` |
| `trade-tagger` / `card-sort` | sortezi carduri pe categorii | 0.1.2, 0.1.3, 0.1.5, 1.6.6 | `bias-spotter`, sortare în beat-ul `match` |
| `decision-replay` | rejoci un trade până la punctul de decizie | 1.4.x, 1.7.5 | beat-uri `reveal` |
| `plan-builder` / `checklist-modal` / `journal-entry` | planul v1, checklist-ul și jurnalul ca formulare | 1.6.2, 1.6.3, 1.6.4, 1.7.7 | beat-ul `fields` (acum și cu text liber), `order` cu notă |
| `kpi-dashboard` | KPI-urile de proces dintr-un set de trade-uri | 1.6.7 | `match` |
| `position-pnl` | P&L-ul unei poziții long sau short pe măsură ce prețul se mișcă | 1.1.2, 1.1.5 | slidere și `worked` |
| `quote-lines` | liniile bid / ask / mid / last pe grafic | 1.1.3 | text și `match` |
| `pnl-converter` | P&L în ticks, puncte, pips și unități | 1.1.6 | `worked` |
| `ticket-check` | verifici un bilet de ordin înainte de trimitere | 1.1.7 | `predict` |
| `spread-cost`, mod doi brokeri | comparația costului între doi brokeri | 1.1.4 | `spread-cost` simplu |
| `candle-aggregator` | construiești lumânări de 4H din lumânări de 1H | 1.2.3 | `candle-builder` |
| hotspot cu selecție multiplă | marchezi mai multe puncte pe grafic | 1.2.x, 1.5.1 | hotspot simplu |
| `blind-replay` | rulezi graficul și marchezi momentul | 1.2.7, 1.5.x | `reveal` |
| `order-fill`: Stop și Stop-limit | ordine de intrare stop și stop-limit | 1.3.3, 1.3.4 | beat-uri `reveal` și `worked` |
| `bracket-builder`: OCO, short, trailing | ieșiri legate, poziții short, trailing stop | 1.3.5, 1.3.8, 2.7.x | `predict` și `worked` |
| `order-blotter`, `order-book-lite` | ordinele în așteptare și cartea de ordine | 1.3.6, 1.3.7 | `match`, `order` |
| `position-size`: scenariu de gap | pierderea la stop după un gap | 1.3.7 | `position-size` cu stopul la prețul gap-ului |
| `blow-up-lab` | martingale și grid, până la ruină | 1.8.1, 1.8.2 | `worked`, `bars` |
| `r-journal` | un jurnal de trade-uri măsurate în R | 1.4.2 | `worked` |
| `risk-reward` cu costuri; `loss-recovery` „serie la r%” | extensii ale widget-urilor existente | 1.4.6, 1.4.9 | `expectancy`, `worked` |
| `swing-marker` | marchezi swing-urile pe grafic | 1.5.1 | hotspot |
| `mtf-panes` | două timeframe-uri alăturate | 1.5.8 | `trend-classifier` |
| `level-drawer`: grilă de numere rotunde, retest | extensii pentru 1.5 | 1.5.3, 1.5.6 | `level-drawer` simplu |
| `auction-book`, `benchmark-ghost`, `score-preview` | licitația, comparația cu un benchmark, scorurile MARKET//LAB | 0.1.1, 0.1.4, 0.1.6 | beat-uri interactive |
| `ev-machine`, `sample-lab`, `random-walk-lab`, `guru-generator` | valoare așteptată, eșantioane, mers aleator, afirmații de performanță | 0.2.2–0.2.6 | `expectancy`, beat-uri |
| `emotion-check-in` | numești emoția înainte de decizie | 1.7.1 | `bias-spotter` |

Capabilitățile de simulator (S1–S22) din [course/README.md](course/README.md) acoperă restul cerințelor pentru Arena.
