# MARKET//LAB · Sistemul de design

Direcția vine din designul generat în Figma Make („Dark Theme App Design”): **negru pur, suprafețe neutre, un singur accent albastru electric** (#55A8FF) și un violet secundar (#B19AF4) folosit doar în ilustrații. Tipografie compactă (Inter, 13px), colțuri de 9px, carduri liniștite. Atenția vizuală e rezervată pentru următoarea acțiune de învățare, nu pentru fiecare card.

## Direcția de experiență

- **Procesul înaintea rezultatului.** Fiecare sesiune are trei numere, afișate mereu separat:
  - **Decision Quality:** cât de bun a fost raționamentul, cu ce se știa atunci;
  - **Risk Discipline:** dacă limitele au fost respectate;
  - **Simulated Outcome:** P&L-ul simulat.

  Verde-salvia și roșu-cărămiziu apar doar la rezultate simulate și la lumânări, mereu cu semn (+/−), deci culoarea nu e singurul indiciu.
- **O singură acțiune evidențiată pe ecran.** Pe Dashboard: cardul „Continue learning” și misiunea recomandată au animație de intrare și reacție la hover; restul cardurilor sunt statice. Pe Missions și Learn, același rol îl au spotlight-ul și cardul „feature”.
- **„The Reveal”** rămâne interacțiunea-semnătură din player: viitorul pieței stă sub un văl hașurat, iar după decizie vălul se retrage.
- **Orientarea:** sidebar-ul arată mereu unde ești, bara de sus are breadcrumbs, iar fiecare modul are tab-uri de secțiune sub titlu (mereu vizibile, ca în design).

## Tokeni

Toți tokenii sunt în [`packages/ui/src/styles/tokens.css`](packages/ui/src/styles/tokens.css). Gazda poate suprascrie orice `--ml-*` pe `.ml-root`.

| Grup | Tokeni |
|---|---|
| Suprafețe | `--ml-bg` #000, `--ml-bg-2` #030303 (sidebar, bara de sus), `--ml-surface` #050505 (carduri, inputuri), `--ml-surface-2` #0A0A0A, `--ml-surface-hover` #0F0F0F, `--ml-surface-active` #161616 |
| Linii | `--ml-border` #252525, `--ml-border-strong` #343538, `--ml-border-input` #35363A, `--ml-hairline` |
| Text | `--ml-text` #E9E9E9, `--ml-text-2` #929499, `--ml-text-3` #7D8086. Griurile cele mai închise din design (#62656C etc.) au fost ridicate unde pică sub 4,5:1 pe text mic. |
| Accent | `--ml-accent` (implicit Electric #55A8FF), `-hover`, `-ink`, `-fg`, `-soft`, `-line`, `-muted` (accent amestecat cu gri, pentru text secundar), `-deep` (accent aproape negru, pentru fundaluri). Se alege din Preferences → Accent colour. |
| Secundar | `--ml-accent-2` #B19AF4 (alias vechi `--ml-blue`): tonurile ilustrațiilor, stări „în curs”. |
| Rezultate | `--ml-pos` #90B8A5, `--ml-neg` #D77662 (+ `-soft`), doar pentru câștiguri și pierderi simulate. |
| Grafic | `--ml-candle-up` #86B7A4, `--ml-candle-down` #D77662, `--ml-grid`, `--ml-volume-*`, `--ml-indicator-1/2` |
| Tipografie | Inter (400–700); body 13px, h3 14px, h1 26–29px (550, −0.8px); etichete uppercase de 11px cu spațiere 0.45px; cifre tabulare (`.num`). |
| Raze | 4px butoane și inputuri, 6px câmpuri de căutare, 9px carduri, 3px tag-uri. |
| Layout | Sidebar 236px (209px sub 1190px), rail de 72px (sub 960px); bara de sus 65px; bara de jos pe mobil 64px; gutter 29px (37px peste 1550px); conținut maxim 1580px. |
| Teme | `black` (implicit), `charcoal` și `navy`, prin `data-theme` pe `.ml-root`. |

### Puncte de întrerupere

| Lățime | Ce se schimbă |
|---|---|
| ≥ 1550px | Fonturi și padding-uri puțin mai mari. |
| ≤ 1190px | Sidebar de 209px, griduri de 4 coloane devin 2. |
| ≤ 960px | Sidebar-ul devine rail de 72px; Dashboard pe o coloană. |
| ≤ 760px | Telefon: drawer din stânga și bara de jos cu 5 destinații. |
| ≤ 480px | Ilustrațiile mari se ascund, biletul de risc devine o bandă orizontală. |

## Fișiere de stil

```
styles.css                 punctul de intrare (importă tot în ordinea de mai jos)
styles/tokens.css          tokeni, teme, puncte de întrerupere
styles/base.css            reset, tipografie, focus
styles/components.css      butoane, tag-uri, câmpuri, dialoguri, tabele, toast
styles/chart.css           graficul și overlay-urile lui
styles/layout.css          antetul paginii și componente vechi comune
styles/shell.css           sidebar, bara de sus, drawer, bara de jos
styles/pages.css           carduri, tile-uri, filtre
styles/screens/shared.css  bara de căutare și filtre (Missions, Lessons, Concepts)
styles/screens/art.css     lumânări sintetice, ilustrații, lumânările de dificultate
styles/screens/dashboard.css
styles/screens/missions.css
styles/screens/learn.css
```

Toate clasele au prefixul `ml-`, deci CSS-ul poate fi copiat ca atare într-o altă aplicație (vezi „Portarea în Angular” din README).

## Navigație

- **Sidebar** ([`Shell.tsx`](packages/ui/src/components/Shell.tsx)):
  - brandul MARKET//LAB, cu „//” în accent;
  - caseta de nivel (nivel, rang, progres XP), link spre Levels & XP;
  - două grupuri cu titlu, Workspace și Learning; părintele e link, iar chevron-ul separat deschide submeniul (`aria-expanded`);
  - elementul activ: text în accent, fundal de 7,5% accent și o bară de 2px la stânga, plus `aria-current="page"`;
  - jos: cardul Pro (Upgrade sau Manage plan) și rândul de cont (nume, plan, rang), cu iconițe pentru Settings și notificări.
- **Colapsat (rail):** doar iconițe, flyout-uri cu secțiunile la hover sau focus; cardul Pro devine „PRO”.
- **Mobil:** bara de jos cu 5 destinații și un drawer care alunecă din stânga (280px) cu tot sidebar-ul.
- **Badge-uri:** numărul de misiuni neîncepute la Missions, un punct pentru provocarea zilnică disponibilă.

## Componente

În [`ui.tsx`](packages/ui/src/components/ui.tsx), [`Page.tsx`](packages/ui/src/components/Page.tsx), [`Art.tsx`](packages/ui/src/components/Art.tsx) și fișiere dedicate:

- **Bază:** `Button`, `IconButton`, `Tag`, `SimBadge`, `Segmented`, `Chips`, `Tabs`, `TextField`, `Dialog` (center / sheet / full / drawer), `Toast`, `ScoreRing`, `Meter`, `Empty`.
- **Pagini:** `PageHead`, `SubNav`, `Card`, `FilterChips`, `Pnl`, `MiniRing`, `ProBadge`.
- **Artă (decorativă, `aria-hidden`):** `CandleStrip` (lumânări sintetice deterministe), `LearningIllustration` (4 variante), `DifficultyCandles` (dificultatea 1–5), `missionGlyph(topic)`.
- **Ecrane:**
  - Dashboard: 4 carduri de statistici (progres, goal zilnic editabil, streak, nivelul de competență), „Continue learning” cu grafic, misiunea recomandată cu „Why this mission?”, activitate recentă, competențe, ultima simulare, acțiuni rapide;
  - Missions: spotlight cu biletul de risc al misiunii (procentul și suma reale din regulile ei), bara de filtre, carduri de misiune;
  - Learn: path-ul în curs cu orbite și plachetă, nota „Up next”, carduri de path, listă de pași, carduri de lecții și de concepte.

## Imagini pe carduri

Patru fotografii generate cu 3D AI Studio (Nano Banana 2.1), în [`packages/ui/src/assets/art/`](packages/ui/src/assets/art), WebP, 60 KB în total: munți noaptea cu lumânări în cer (antetul Dashboard), un vârf (Your progress), un lanț muntos (Learning streak, bannerul Pro). „Continue learning”, misiunea recomandată și „Current skill level” rămân fără imagine, ca să nu concureze cu graficul, cu acțiunea principală și cu barele de nivel. Cardul „Upgrade to Pro” din sidebar are imaginea lui (`pro-summit.webp`, un vârf cu auroră albastră), plus butonul „See plans” și o lumină care trece peste card de trei ori după încărcare; pe rail rămâne doar coroana.

Se pun cu clasa `ml-art` plus o variantă (`ml-art--peak`, `--range`, `--mountains`), definite în `styles/screens/art.css`. Imaginea stă într-un `::before` în spatele conținutului, cu opacitate mică (0,2–0,6) și estompată spre stânga, unde e textul. Pe fiecare card se reglează prin variabile: `--ml-art-opacity`, `--ml-art-pos`, `--ml-art-fade`.

## Mișcare

- **Intrare:** cardurile principale apar cu o deplasare de 12px (0,6–0,75 s), decalat.
- **Hover:** cardurile se ridică 2–4px; săgețile din butoane se mută 3–4px.
- **„Continue learning”:** o lumină trece de două ori peste card și conturul pulsează discret de trei ori, apoi se oprește.
- **Reduced motion:** toate animațiile de mai sus sunt în `prefers-reduced-motion: no-preference`; setarea din Preferences rămâne valabilă.

## Decizii și compromisuri

| Decizie | Compromis |
|---|---|
| Paleta Electric pe negru, din designul Figma | Înlocuiește navy + lime. Lime, Mono și celelalte accente rămân opțiuni în Preferences; temele Charcoal și Navy la fel. |
| Textul gri ridicat la ≥ 4,5:1 | Câteva etichete sunt puțin mai deschise decât în design. |
| Submeniurile din specificație păstrate în sidebar | Designul nu are submeniuri; aici sidebar-ul are chevron și listă de secțiuni, iar tab-urile apar și în pagină. |
| Upgrade și Settings mutate jos în sidebar | Ca în design. Grupul Account a dispărut; Profile rămâne în bara de jos pe mobil. |
| Pe Learn, path-ul în curs e scos din grila de path-uri | Grila arată exact 4 carduri, ca în design; path-ul în curs are cardul mare de deasupra. |
| Concept Library: grilă fără selecție, listă + detaliu cu selecție | Grila din design pentru explorare, lista pentru citit concept după concept. |
| Biletul de risc arată datele misiunii (1% sau 2%, 10.000 vUSD) | Nu e un număr decorativ: se schimbă de la o misiune la alta. |

## QA

**Verificat automat** (Chrome headless, pe build-ul de producție):

- [x] 36 de rute × 6 lățimi (360, 390, 768, 1024, 1440, 1920): fără overflow orizontal.
- [x] Zero erori și zero avertismente în consolă.
- [x] Fluxul complet: onboarding, misiuni cap-coadă cu debrief, provocarea zilnică, lecția cu verificare, verificarea pe topic, sesiunea Arena, Journal, Progress, upgrade demo și billing, schimbarea temei, sidebar colapsat cu flyout, meniul de cont și sign-out, mobil.
- [x] Dialogul „Edit daily goal” salvează goal-ul, iar cardul se actualizează.
- [x] `npm run typecheck`, `npm test` (97 de teste) și `npm run build` trec.

**Verificat vizual:** Dashboard, toate secțiunile Missions și Learn, detaliul de misiune și de path, Arena, Progress, Pricing, lecția, dialogurile, drawer-ul pe mobil.

**Rămas de făcut:**

- [ ] Test manual cu un cititor de ecran (NVDA / VoiceOver), mai ales pentru flyout-uri și tooltip-urile de la competențe.
- [ ] Măsurarea contrastului pe toate temele și accentele.
- [ ] Test pe dispozitive mobile reale.
