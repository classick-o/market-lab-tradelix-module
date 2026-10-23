# MARKET//LAB · Knowledge

Cum trebuie să funcționeze modulul: regulile de comportament ale fiecărui ecran, din punctul de vedere al produsului. [README.md](README.md) spune cum rulezi și integrezi modulul, iar [DESIGN.md](DESIGN.md) cum arată. Aici scrie **ce face și de ce**.

Când o regulă se schimbă, se schimbă întâi aici, apoi în cod.

## Cum adaugi o regulă

- Scrie comportamentul la prezent, astfel încât să poată fi verificat: „Cardul X afișează …”, nu „ar fi bine să …”.
- Adaugă motivul, dacă nu e evident.
- Notează unde e în cod (fișier, constantă sau funcție), ca să poată fi găsit și verificat.
- Pune regula la ecranul unde se vede. Regulile care țin de tot modulul merg la „Principii”.

## Principii

- **Decizia, nu profitul.** Fiecare sesiune are trei scoruri afișate separat: Decision Quality, Risk Discipline și Simulated Outcome. Un rezultat bun nu acoperă o decizie proastă.
- **XP-ul vine doar din învățare:** misiuni, sesiuni Arena, lecții, verificări, provocări, reflecții și replay-uri. Nu se acordă niciodată pentru profit simulat și nu se poate cumpăra.
  - În cod: `XP_RULES` din `packages/learning/src/xp.ts`.
- **Totul e simulat:** piețe sintetice și bani virtuali. Avertismentul apare în footer pe fiecare pagină.

## Navigație

- **Sidebar:** 6 destinații într-o singură listă, fără titluri de grup. Destinația cu secțiunile de progres se numește „Achievements”.
  - În cod: `NAV` din `packages/ui/src/nav.ts`.
- **Bara de sus:** afișează streak-ul de învățare și XP-ul de azi față de goal-ul zilnic. Nu are breadcrumb și nu are insigna „Simulation”. Pe telefon are butonul de meniu, logo-ul și streak-ul; XP-ul de azi se vede acolo în cardul Daily goal.
  - În cod: `Topbar` din `packages/ui/src/components/Shell.tsx`.

## Learn

Secțiunile sunt Course, Lessons, Practice, Library și Tracks. `/learn` deschide Course. Rutele vechi (`/learn/paths`, `/learn/concepts`, `/learn/glossary`, `/learn/checks`) duc la secțiunile noi.
- În cod: `NAV` din `packages/ui/src/nav.ts`, `legacyRedirect` din `packages/ui/src/MarketLab.tsx`.

### Next step

O singură regulă alege pasul următor pentru pagina Course, recap-ul unei lecții și Dashboard:
1. o lecție începută și neterminată (cea mai recentă);
2. recapitularea zilnică, dacă are cel puțin 5 elemente scadente;
3. următoarea lecție din curs, în ordinea nivelurilor, unităților și lecțiilor, sărind peste cele terminate sau „Tested out”;
4. recapitularea, dacă mai are ceva scadent.
- În cod: `nextLearnStep()` din `packages/academy/src/course/index.ts`.

### Lecția

- Lecțiile interactive trec prin 5 faze: Hook → Learn → Try → Check → Recap. Continue se deblochează doar după interacțiunea ecranului (o predicție, o figură parcursă, un task rezolvat sau „Show me”).
- Hook-ul nu se notează; răspunsul se compară cu regula în recap.
- **Check:** 3 întrebări, una pe ecran. Greșelile revin la final până ies corect, deci oricine termină lecția. Contează doar prima încercare: 3/3 = „Strong”, 2/3 = „Good”, sub 2/3 = „Review soon”.
- **XP:** 15 la terminare, plus 10 pentru 3/3 din prima încercare.
- Întrebările numerice cu generator (`vary`) apar în check cu alte cifre decât în lecție, ca să se verifice regula, nu memoria.
- Lecția se redeschide unde a rămas; o lecție terminată se redeschide la recap.
- Dacă primele două interacțiuni notate din Learn sunt corecte din prima, player-ul oferă „You seem to know this. Skip to Try?”.
- **Read mode** arată toată lecția pe o pagină, cu aceleași interacțiuni. Marcarea „Read” nu dă XP de lecție; checkul de la final o termină.
- Cât e deschisă o lecție, sidebar-ul se strânge la rail, iar pe telefon bara de jos dispare.
- **Animațiile (`scene`)** pornesc singure și se pot derula pe capitole. Se opresc la întrebări și continuă după răspuns, indiferent dacă e corect sau greșit. Continue se deblochează la final, inclusiv dacă utilizatorul derulează până la capăt. Cu reduced motion nu pornesc singure și nu blochează Continue. Când ecranul e revăzut, arată ultimul cadru.
- **Widget-urile cu animație proprie** (de exemplu trimiterea unui ordin în `auction-book`) arată explicația abia după ce animația s-a terminat, ca să n-o dea de gol.
- În cod: `packages/ui/src/learn/` (`LessonPlayer`, `CheckPhase`, `Recap`, `LessonRead`), `finishLessonCheck` și `completeScriptedLesson` din `packages/ui/src/store.ts`.

### Continuitatea

- Fiecare lecție începe cu poziția ei: „Unit X · titlu · lesson n of N”.
- Prima lecție a unei unități arată și introducerea unității: rezumatul, ce vei putea face la final și pe ce se bazează unitatea.
- Sub ea apare legătura cu lecția anterioară (`bridge`), apoi „Builds on”: până la 3 lecții anterioare din prerechizitele hărții, cu link și bifă dacă sunt terminate.
- Recap-ul anunță lecția următoare (`recap.next`). La ultima lecție a unei unități apare „Unit complete”, cu checkpoint-ul unității și unitatea următoare.
- Un termen folosit înaintea lecției care îl predă are o explicație scurtă în text, iar cardul lui spune „You'll learn this properly in …”.
- Pagina Lessons grupează lecțiile pe unități, în ordinea cursului. Panoul unității din Course arată aceeași introducere.
- Regulile de scriere sunt în `docs/learn/AUTHORING.md` §11.
- În cod: `LessonContextCard` din `packages/ui/src/learn/LessonContext.tsx`, `UNIT_INTROS` din `packages/academy/src/catalog.ts`, `Term.tsx`, `Recap.tsx`.

### Checkpoint-ul unității

- Fiecare unitate cu lecții scrise are un checkpoint: toate întrebările din check-urile lecțiilor ei. La 80% sau mai mult, lecțiile unității se marchează „Tested out”: contează ca terminate pentru progres și pentru „Next step”, dar nu dau XP de lecție.
- Se deschide din panoul unității, pe pagina Course.
- În cod: `unitCheckpoint()` din `packages/academy/src/course/index.ts`, `CheckPage` din `packages/ui/src/pages/CheckRunner.tsx`.

### Recapitularea

- Fiecare răspuns din checkul unei lecții intră în recapitulare: greșit → cutia 1 (revine mâine), corect → cutia 2 (peste 3 zile). La recapitulare, corect urcă o cutie (1, 3, 7, 14, 30 de zile), greșit coboară în cutia 1, corect după indiciu rămâne în aceeași cutie.
- Cel mult 15 elemente pe zi; restul se mută a doua zi.
- Recapitularea zilnică terminată dă 15 XP, o dată pe zi, și contează ca activitate pentru streak.
- Flashcard-urile din Library la care răspunzi „Not yet” intră în aceeași coadă.
- În cod: `packages/academy/src/review.ts`; `answerReview`, `completeReviewSession`, `answerFlashcard` din store.

### Acces

- Deocamdată tot conținutul Learn (lecții, tracks, recapitulare, Library) e deschis pentru toți; gruparea pe planuri se decide la final.
- În cod: `LEARN_ALL_FREE` din `packages/ui/src/learn/access.ts`.

### Streak

- Până la **2 zile ratate pe săptămână** (luni–duminică) nu rup streak-ul; nu se adună la lungimea lui. Pauzele se pot dezactiva din setări.
- În cod: `streakInfo(days, today, pausesPerWeek)` din `packages/academy/src/progress.ts`; `settings.streakPauses`.

## Missions

- Secțiunile sunt: All Missions, Daily Challenges, Weekly Challenges și Assessments. `/missions` deschide All Missions.
- Misiunea recomandată, cu motivul ei, apare sus pe All Missions și pe Dashboard.
  - În cod: `NAV` din `packages/ui/src/nav.ts`, `recommend()` din `packages/learning`.

## Dashboard

### Continue learning

Arată un singur pas, primul care se potrivește, în ordinea:

1. o misiune începută și neterminată;
2. o sesiune Arena în curs;
3. pasul următor din curs, după regula „Next step” de la Learn: o lecție începută, apoi recapitularea zilnică dacă are cel puțin 5 elemente scadente, apoi următoarea lecție din curs;
4. următorul pas dintr-un track (fostul learning path) început; dacă nu există unul, primul track cu pași rămași;
5. dacă toate sunt gata, o trimitere spre scenariile Arena.

Cardul nu are rând de etichetă deasupra titlului (de tipul „Arena session · LABX”). Graficul din dreapta e doar decorativ: fără simbol, fără monedă și fără eticheta „Synthetic data”; rămân lumânările și nivelurile take profit, entry și stop loss.

- În cod: `packages/ui/src/pages/Dashboard.tsx`.

### Recent activity

- Afișează **doar ultimele 5 activități**, cea mai recentă prima.
- Intră în listă:
  - misiunile terminate;
  - sesiunile Arena terminate;
  - lecțiile terminate;
  - verificările de cunoștințe și assessment-urile;
  - provocarea zilnică.
- Fiecare rând arată:
  - titlul;
  - tipul activității și cât de demult a fost;
  - scorul Decision Quality, când există (la misiuni și Arena);
  - XP-ul câștigat.

  Rândul duce la detaliile activității: debrief, sumarul sesiunii, lecția sau verificarea.
- Istoricul complet e în Trade Journal, prin linkul „Session history” din colțul cardului.
- Fără nicio activitate, cardul spune ce fel de activități vor apărea acolo.
- În cod: lista e construită de `activityFeed()` din `packages/ui/src/progress.ts`, iar limita e `RECENT_ACTIVITY_LIMIT` din `packages/ui/src/pages/Dashboard.tsx`.
