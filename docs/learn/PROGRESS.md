# Learn · stadiul implementării (22.10.2026)

Ce s-a făcut din [PLAN_LEARN.md](../../PLAN_LEARN.md) și ce a rămas. Regulile de produs intrate în vigoare sunt în [KNOWLEDGE.md](../../KNOWLEDGE.md) › Learn.

## Făcut (pe `main`)

- **E0–E1 · Fundația și player-ul:** Learn Chart Kit (lumânări, bare OHLC, linie, scară log, volum, niveluri, zone, markere, formule, bare, flow); player-ul Hook → Learn → Try → Check → Recap, cu rail (outline, termeni, notițe), tastatură, reluare, Read mode, „Skip to Try?”. Cod: `packages/ui/src/learn/`, `packages/ui/src/kit/`.
- **E2–E4 · Figuri, interacțiuni, feedback:** cele 13 widget-uri cu task-uri (`widget-math.ts`, `taskWidgets.tsx`); beat-uri predict, reveal, worked, match/sort, order, hotspot, fields (inclusiv text liber); check cu o întrebare pe ecran, explicații per variantă, indicii, variante numerice (`vary`).
- **E5 · Memoria:** recapitulare Leitner (max. 15/zi, +15 XP), stăpânirea conceptelor, pagina Practice (review, concepte slabe, verificări pe topic), pauzele de streak (2/săptămână, comutator în setări).
- **E6 · Cursul:** harta din docs generată în cod (`packages/academy/src/course/`, 5 niveluri, 44 unități, 340 lecții), pagina Course, panoul unității, checkpoint-ul de unitate („Tested out” la 80%), regula „Next step” (Course, recap, Dashboard).
- **E7 · Library:** căutare comună (`/`, Ctrl+K), concepte cu „Test yourself”, glosar A–Z cu pagini de termen, flashcards, Saved.
- **E8 (parțial) · Imagini:** 7 imagini 3D AI Studio (`packages/ui/src/assets/art/`, prompturile în `PROMPTS.md`).
- **Conținut scris complet:**
  - cele 18 lecții vechi (L01–L18), cu scripturile din U1–U5;
  - **Nivelul 0** (0.1, 0.2) și **Nivelul 1** (1.1–1.8): 70 de lecții în total;
  - unitatea **2.5**.
- **Ghiduri:** [AUTHORING.md](AUTHORING.md) (cum se scrie o lecție direct în cod), [widgets-backlog.md](widgets-backlog.md) (widget-uri cerute de fișe, încă neconstruite).

## În lucru, necommis (în `packages/academy/src/content/course/`)

| Fișier | Stare |
|---|---|
| `u2-6.ts` | **complet** (8 lecții), testat de agent; de verificat și de commis |
| `u2-7.ts` | **complet** (8 lecții), testat de agent; de verificat și de commis |
| `u2-1.ts`, `u2-2.ts`, `u2-3.ts`, `u2-4.ts` | **incomplete** (agenți opriți la jumătate); pot strica typecheck și testele. Înainte de orice commit: se termină sau se readuc la scheletul gol (`git checkout -- <fișier>`) |

## De făcut

1. **Restul conținutului:** unitățile 2.1–2.4 și 2.8–2.14 (Nivelul 2), apoi Nivelurile 3 și 4 (cca. 230 de lecții). Câte un agent pe unitate, după [AUTHORING.md](AUTHORING.md). Un agent consumă ~300–500k tokeni pe unitate. Merită testat dacă două unități per agent sunt mai eficiente.
2. **Widget-urile din [widgets-backlog.md](widgets-backlog.md)**, apoi o trecere prin lecțiile care le așteaptă (azi au beat-uri interactive în loc de Try).
3. **Walkthrough-ul celor 56 de lecții din valul 2** (Nivelurile 0–1) trebuie reluat. Primele 14 au ajuns la recap. Restul au picat pentru că fișierele neterminate din Nivelul 2 au stricat serverul de dev, deci rezultatul lor nu spune nimic despre lecții. Se rulează cu `scratchpad/e2e/wave-run.sh` (playwright), după ce `u2-1`…`u2-4` sunt terminate sau readuse la schelet.
4. **Dimensiunea bundle-ului:** conținutul crește; de încărcat lecțiile pe bucăți (per unitate) sau de mutat într-un chunk separat.
5. **E8 rămas:** animațiile din §11, auditul de accesibilitate (§12), imaginea `empty-search`, figura mică per concept în Library.
6. Corecturi de conținut semnalate de agenți (din glosar și din fișe) care n-au fost încă aplicate. Exemplu: afirmația despre payment-for-order-flow în UE trebuie verificată.
