# MARKET//LAB · Sistemul de design

Direcția: **premium fintech × gaming**, dark-first. Suprafețele sunt navy adânc, textul e off-white și griuri reci. Accentul e lime, albastrul e secundar și discret. Elementele de gaming sunt subtile: niveluri, ranguri, streak-uri, realizări. Puțin zgomot vizual, date clare.

## Direcția de experiență

- **Procesul înaintea rezultatului.** Fiecare sesiune are trei numere, afișate mereu separat:
  - **Decision Quality:** cât de bun a fost raționamentul, cu ce se știa atunci;
  - **Risk Discipline:** dacă limitele au fost respectate;
  - **Simulated Outcome:** P&L-ul simulat.

  Verdele și roșul apar doar la rezultate simulate și mereu cu semn (+/−), deci culoarea nu e singurul indiciu.
- **Interacțiunea-semnătură: „The Reveal”.** Viitorul pieței stă sub un văl hașurat, marcat „Unknown”. După decizie, cursorul „Now” alunecă spre dreapta, iar vălul se retrage. Axa timpului e fixă.
- **Decizia lângă grafic.** În player și în Simulator, panoul de decizie stă lipit lângă grafic. Stop-loss-ul și ținta apar pe grafic ca linii „draft” cât timp le tastezi.
- **Orientarea:** sidebar-ul arată mereu unde ești, bara de sus are breadcrumbs, iar paginile lungi au tab-uri de secțiune când sidebar-ul e colapsat sau pe mobil.

## Tokeni

Toți tokenii sunt în [`packages/ui/src/styles/tokens.css`](packages/ui/src/styles/tokens.css). Gazda poate suprascrie orice `--ml-*` pe `.ml-root`.

| Grup | Tokeni |
|---|---|
| Suprafețe (navy) | `--ml-bg` #0A0E16, `--ml-bg-2` (sidebar), `--ml-surface` #111723, `--ml-surface-2` #161D2B, `--ml-surface-hover`, `--ml-surface-active`, `--ml-black` (grafice, ilustrații) |
| Linii | `--ml-border` #1F2738, `--ml-border-strong`, `--ml-border-input`, `--ml-hairline` |
| Text | `--ml-text` #EEF1F6, `--ml-text-2` #A3ADBE, `--ml-text-3` #8A95A9 (≥ 4,5:1 pe toate suprafețele) |
| Accent | `--ml-accent` (implicit lime #C8F25A), `-hover`, `-ink`, `-fg` (deschis automat până la 4,5:1), `-soft`, `-line`. Se alege din Preferences → Accent colour. Folosit pentru acțiunea principală, selecție, progres, focus, cursorul „Now”. |
| Secundar | `--ml-blue` #5B8DEF, `--ml-blue-fg`, `--ml-blue-soft`: exemple numerice, stări „în curs”, indicatori. |
| Rezultate | `--ml-pos` #3DD68C, `--ml-neg` #FF6B6B (+ `-soft`), doar pentru câștiguri și pierderi simulate. |
| Semantic | `--ml-danger*` pentru erori și acțiuni distructive, `--ml-warn` pentru avertismente. |
| Grafic | `--ml-candle-up/down`, `--ml-grid`, `--ml-volume-*`, `--ml-indicator-1/2` (SMA 20 / SMA 50) |
| Tipografie | Inter; body 14px, h3 17px, h2 20–24px, h1 26–34px; cifre tabulare (`.num`). Lecțiile folosesc 15px, pentru citit. |
| Spațiu | Densitate compactă: 4, 6, 10, 12, 16, 20, 28, 36, 48 (`--ml-s1`…). Cardurile au padding de 16px. |
| Layout | Sidebar 264px (`--ml-sb-w`) sau rail de 64px; bara de sus 52px; bara de jos pe mobil 60px; gutter 14–24px. |
| Teme | `navy` (implicit) și `charcoal` (negrul neutru inițial), prin `data-theme` pe `.ml-root`. |

## Navigație

- **Sidebar** ([`Shell.tsx`](packages/ui/src/components/Shell.tsx)):
  - brand și widget de progres;
  - 3 grupuri cu titlu (Workspace, Learning, Account);
  - părinte = link + buton separat de expandare (`aria-expanded`, `aria-controls`);
  - indicatorul activ: o bară lime la stânga și `aria-current="page"`;
  - footer cu contul.
- **Colapsat (rail):**
  - doar iconițe;
  - etichetele rămân în DOM pentru cititoarele de ecran;
  - flyout-uri cu secțiunile, deschise la hover sau la focus (deci și din tastatură).
- **Mobil:** o bară de jos cu 5 destinații și un drawer full-screen (Dialog `full`) cu toată navigația.
- **Badge-uri:** un singur tip, un punct lime, doar pentru acțiuni posibile acum.

## Componente

În [`ui.tsx`](packages/ui/src/components/ui.tsx), [`Page.tsx`](packages/ui/src/components/Page.tsx) și fișiere dedicate:

- **Bază:**
  - `Button`, `IconButton`, `Tag`, `SimBadge`, `Segmented`, `Chips`, `RadioRow`, `Checkbox`, `Tabs`;
  - `TextField`, `TextArea`, `Dialog` (center / sheet / full), `Toast`;
  - `ScoreRing`, `Meter`, `KeyValues`, `Empty`.
- **Pagini:** `PageHead`, `SubNav`, `Card`, `StatTile`, `FilterChips`, `Pnl`, `Avatar`, `MiniRing`, `ProBadge`.
- **Stări:** `Skeleton` (încărcare), `ErrorState` și `RouteBoundary` (o eroare rămâne izolată în secțiunea ei), `Empty`.
- **Învățare:**
  - `QuestionCard` și `QuizBlock`: grilă, scenariu, exercițiu numeric, cu explicații după răspuns;
  - `Diagram`: 14 ilustrații SVG care urmează tema;
  - `Widget`: 7 exemple interactive care folosesc matematica motorului.
- **Date:** `Chart` (cu overlay-uri SMA, volum și grilă opționale, etichete de timp pe timeframe), `LineChart`, `BarList`, `Heatmap`. Fiecare grafic are o descriere text pentru cititoarele de ecran.

## Mișcare

- **Tranziția de pagină:** opacitate și o deplasare de 8px, 280 ms.
- **Elemente de navigație:** sidebar-ul, flyout-urile și meniul de cont apar rapid (140–200 ms).
- **Graficele nu au animații decorative.** Doar lumânarea nouă și cursorul „Now” se mișcă în timpul redării.
- **Reduced motion:** „Follow system / Reduced / Full”. În modul redus totul devine instantaneu.

## Decizii și compromisuri

| Decizie | Compromis |
|---|---|
| Paleta navy + lime, conform specificației MARKET//LAB | Înlocuiește direcția monocromă inițială. Tema Charcoal și accentul Mono rămân opțiuni în Preferences. |
| Verde/roșu doar pentru rezultate simulate, mereu cu semn | Lumânările rămân deschise/închise la culoare, ca graficul să nu concureze cu scorurile de proces. E un singur token, dacă se vor culori. |
| Trei scoruri separate (DQ, RD, outcome) | Mai multe numere pe ecran; în schimb, profitul nu „spală” o decizie proastă. |
| Lime ca accent, verde ca „pozitiv” | Sunt nuanțe distincte (#C8F25A față de #3DD68C), iar rezultatele au mereu semn. |
| Tab-uri de secțiune în pagină doar când sidebar-ul nu le arată | Pe desktop, cu sidebar-ul extins, nu se dublează navigația. |
| Pagini încărcate pe bucăți (`React.lazy`) | Un skeleton scurt la prima vizită a unei secțiuni; primul ecran se încarcă mai repede. |
| Grafic SVG propriu | Control complet pentru văl, linii draft și indicatori; fără zoom sau pan liber. |

## QA

**Verificat automat** (Chrome headless, scripturile de parcurs din sesiune):

- [x] Toate cele 39 de rute testate, plus 4 redirectări de la adresele vechi, se încarcă fără ecran de eroare și fără 404.
- [x] Fluxul complet:
  - onboarding;
  - M01 și M06 cap-coadă, cu feedback imediat și debrief;
  - provocarea zilnică, lecția cu verificare, verificarea pe topic;
  - sesiunea Arena cu jurnal la ordin, 4H și SMA, apoi sumarul;
  - Journal (istoric, decizii, replay Arena, alternative, analytics);
  - upgrade demo, billing, schimbarea temei;
  - sidebar colapsat cu flyout, meniul de cont, sign-out și revenirea.
- [x] Fără overflow orizontal la 360, 390, 768, 1024, 1280, 1440 și 1920px.
- [x] Zero erori și zero avertismente în consolă.
- [x] `npm run typecheck`, `npm test` (97 de teste, inclusiv integritatea conținutului) și `npm run build` trec.

**Verificat vizual:** dashboard, misiuni, simulator, sumarul sesiunii, alternative, analytics, lecții, streak-uri, pricing, sidebar colapsat, mobil (dashboard, drawer, profil).

**Rămas de făcut:**

- [ ] Test manual cu un cititor de ecran (NVDA / VoiceOver), mai ales pentru flyout-urile sidebar-ului și graficele mici.
- [ ] Măsurarea contrastului cu un instrument dedicat, pe ambele teme și pe toate accentele.
- [ ] Test pe dispozitive mobile reale.
- [ ] Test de utilizare cu 5–8 utilizatori pe noua navigație.
