# Learn · stadiul implementării (22.10.2026)

Ce s-a făcut din [PLAN_LEARN.md](../../PLAN_LEARN.md) și ce a rămas. Regulile de produs intrate în vigoare sunt în [KNOWLEDGE.md](../../KNOWLEDGE.md) › Learn.

## Făcut (pe `main`)

- **E0–E1 · Fundația și player-ul:**
  - Learn Chart Kit: lumânări, bare OHLC, linie, scară log, volum, niveluri, zone, markere, formule, bare, flow;
  - player-ul Hook → Learn → Try → Check → Recap, cu rail (outline, termeni, notițe), tastatură, reluare, Read mode și „Skip to Try?”.

  Cod: `packages/ui/src/learn/`, `packages/ui/src/kit/`.
- **E2–E4 · Figuri, interacțiuni, feedback:**
  - cele 13 widget-uri cu task-uri;
  - beat-urile predict, reveal, worked, match/sort, order, hotspot și fields (cu text liber);
  - check-ul: o întrebare pe ecran, explicații per variantă, indicii, variante numerice (`vary`).
- **E5 · Memoria:** recapitulare Leitner, stăpânirea conceptelor, pagina Practice, pauzele de streak.
- **E6 · Cursul:** harta generată din docs (5 niveluri, 44 de unități, 340 de lecții), pagina Course, checkpoint-ul de unitate, regula „Next step” (Course, recap, Dashboard).
- **E7 · Library:** căutare comună, concepte cu „Test yourself”, glosar cu pagini de termen, flashcards, Saved.
- **E8 (parțial):** 7 imagini 3D AI Studio (`packages/ui/src/assets/art/`).
- **Conținut complet:** toate cele **340 de lecții** sunt scrise și jucabile:
  - cele 18 vechi, în `content/scripts/`;
  - celelalte 322, în `content/course/u*.ts`, câte un fișier pe unitate.

  În total: **1.079 de întrebări**, **1.064 de termeni**, **507 concepte**.
- **Continuitatea:**
  - în aplicație: poziția lecției în unitate, introducerea unității la prima lecție, „Builds on”, „Unit complete” cu checkpoint, Lessons grupat pe unități și nota „You'll learn this properly in…” pe termeni;
  - în conținut: toate cele 44 de unități au `intro`; toate cele 340 de lecții au `bridge` și `recap.next`; termenii folosiți înainte de lecția lor au o explicație scurtă în text;
  - testele cer aceste câmpuri pentru orice lecție nouă (AUTHORING §11).
- **Verificat:**
  - typecheck curat;
  - 130 de teste trec, inclusiv integritatea fiecărei lecții (lungimi, legături, widget-uri, start/Show me, unicitatea id-urilor);
  - build-ul de producție;
  - walkthrough automat cap-coadă pe cele 18 lecții vechi și pe un eșantion de câte o lecție din fiecare nivel.
- **Ghiduri:** [AUTHORING.md](AUTHORING.md) (cum se scrie o lecție în cod, §10 pentru agenți), [widgets-backlog.md](widgets-backlog.md).

## De făcut, în ordinea importanței

1. **Dimensiunea bundle-ului: rezolvată parțial.** Scripturile lecțiilor se încarcă acum pe unități, la cerere (13–33 KB gzip fiecare). Chunk-ul principal a scăzut de la 5,3 MB (1,6 MB gzip) la 2,9 MB (857 KB gzip). Restul vine din întrebări, termeni și concepte (`src/generated/course-meta.js`). Pasul următor, opțional: încărcarea întrebărilor la cerere.
2. **Widget-urile cerute de fișe.** Aproape fiecare lecție din valurile 2–3 are faza Try făcută din beat-uri interactive, pentru că widget-ul cerut nu există încă. [widgets-backlog.md](widgets-backlog.md) acoperă valul 2; agenții valurilor 3–4 au mai cerut zeci de widget-uri (de exemplu `option-chain`, `payoff-builder`, `strategy-lab-lite`, `regime-switcher`, `footprint-reader`, `dsr-calculator`). Merită construite întâi cele cerute de mai multe unități, apoi o trecere prin lecțiile care le așteaptă.
3. **Walkthrough complet pe toate cele 340 de lecții:** `scratchpad/e2e/wave-run.sh` cu lista de id-uri, cu serverul de dev pornit. Eșantionul a trecut integral.
4. **Afirmații de verificat înainte de publicare**, semnalate de agenți:
   - regula care a înlocuit „pattern day trader” în SUA (2.14, 4.5);
   - plafoanele schemelor de compensare;
   - regulile FTMO/Topstep și cazul My Forex Funds (4.5);
   - payment-for-order-flow în UE (1.1);
   - acuratețea Lee–Ready și reîncărcarea icebergurilor (3.3);
   - perioada out-of-sample Sullivan–Timmermann–White (3.10).
5. **Mici corecturi în fișierele comune:**
   - `course/map.ts` folosește `if-then-plans`, iar conceptul real e `if-then-rules`;
   - lecția 4.6.3 cere conceptul `playbook`, care nu există; există doar termenul;
   - definiția termenului `risk-accuracy` diferă de felul în care o calculează 2.13.7;
   - termenul `carry` e definit doar pentru valute;
   - q-ta-12 și q-ta-13 trimit încă la L16 (s-ar potrivi cu 2.4.6);
   - 11 prerechizite din `course/map.ts` arată spre lecții de mai târziu: 2.1.9 și 2.3.6 → 2.4.6; 3.8.7 → 3.9.3; 3.8.8 → 3.11.2; 3.9.2 → 3.14.1; 3.9.3 → 3.10.2; 3.9.5 → 3.11.4; 3.9.6 → 3.10.6; 3.13.1 → 3.14.1; 3.13.3 → 3.14.3, 3.14.6. „Builds on” le ascunde. Trebuie fie scoase, fie lecțiile reordonate.
6. **E8 rămas:** animațiile din §11, auditul de accesibilitate (§12), imaginea `empty-search` și figura mică per concept în Library.
