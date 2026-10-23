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
- Un ecran deja parcurs arată răspunsul. La un task apare și „Try again”, care repornește widget-ul de la început, cu animațiile lui.
- „Replay lesson” (din recap) și „Start over” (din meniu) reiau lecția de la zero: animațiile pornesc singure, task-urile sunt goale, iar Continue cere din nou interacțiunea. Checkul refăcut nu schimbă primul scor și nu mai dă XP.
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
- Un duel terminat contează ca activitate, ca o sesiune Arena.
- În cod: `streakInfo(days, today, pausesPerWeek)` din `packages/academy/src/progress.ts`; `settings.streakPauses`.

## Missions

- Secțiunile sunt: All Missions, Daily Challenges, Weekly Challenges și Assessments. `/missions` deschide All Missions.
- Misiunea recomandată, cu motivul ei, apare sus pe All Missions și pe Dashboard.
  - În cod: `NAV` din `packages/ui/src/nav.ts`, `recommend()` din `packages/learning`.

## Trading Arena

### Duels

Duelurile sunt 1v1 contra unor boți, pe aceeași piață simulată, în timp real. Planul și criteriile de acceptanță sunt în [PLAN_DUELS.md](PLAN_DUELS.md).

- **Boții sunt declarați.** Fiecare apare cu eticheta „Bot” peste tot unde e afișat: lobby, bara duelului, legenda și etichetele graficului, panoul, rezultatul.
- **Piața merge continuu:** fiecare lumânare se formează în 15 secunde, cu prețul mișcându-se în interiorul ei (60 de tick-uri, unul la 250 ms). Duelul are 80 de lumânări, adică 20 de minute. Ambii jucători au aceeași piață, tick cu tick.
- **La deschiderea graficului** se văd 120 de lumânări de istoric, iar o numărătoare de 10 secunde precede pornirea pieței. În numărătoare piața stă și botul nu face nimic; utilizatorul poate deja pune ordine. Numărătoarea apare și la reluarea unui duel.
- **Pauza:** butonul „Pause” sau tasta Space opresc piața; „Resume the market” o pornește din același loc. Un tab ascuns pune pauză automat. În pauză se pot pune ordine, la prețul la care s-a oprit piața.
- **Tranzacționarea se face dintr-un tap** (tab-ul Trade): mărimea ca procent din puterea de cumpărare (10, 25, 50, 100%), stop și target opționale ca distanță de la intrare (stop 1, 2 sau 3%; target 2, 4 sau 6%), apoi Buy sau Sell la prețul live. Butoanele urmează poziția: „Buy / Sell”, „Buy more / Close long”, „Close short / Sell more”, plus „Close half”. Alegerile se păstrează.
  - **Stopul e opțional.** Lipsa lui costă puncte la „Every entry had a stop-loss”, iar R-ul unei tranzacții fără stop se calculează pe 1% din contul de start.
  - **Cu stop,** riscul e plafonat la 1% de motor; panoul micșorează singur mărimea și o spune.
  - Adăugarea la o poziție fără stop sau target ales păstrează stopul și targetul poziției.
  - Biletul complet (limit, prețuri exacte, mărime din risc) e sub „Limit order or exact prices”. În tab-ul Position, stopul și targetul se pot modifica sau scoate.
  - În cod: `QuickTrade` din `packages/ui/src/components/QuickTrade.tsx`, `duelTradeR` și `DUEL_RUBRIC` din `packages/missions/src/duel.ts`.
- **Botul decide la închiderea fiecărei lumânări,** din lumânările închise și propriul cont; stopurile, targeturile și limitele lui se execută live. Mișcările lui se văd pe grafic (markeri și linii în culoarea botului, `--ml-rival`, etichetate cu numele lui), în panoul „You vs {bot}” și în banda și tab-ul botului, cu momentul lor („After candle 23”). Botul scrie o notă doar când face ceva.
- **Comutatorul „{bot}'s trades”** de deasupra graficului ascunde tranzacțiile botului: liniile și markerii, banda de mișcări, coloana lui din panou și lista din tab-ul botului. Preferința se păstrează (`settings.duelShowBot`); rezultatul duelului le arată mereu.
- **Graficul se poate mări și derula în trecut:** butoanele −, +, ←, →, rotița mouse-ului (zoom), tragerea sau swipe-ul orizontal (trecut). „Back to now” revine la lumânarea curentă. Piața continuă cât timp te uiți înapoi, iar o etichetă o spune. La fel pe graficul din rezultat.
- **Foresight (ascuns, decizie de produs din 23.10.2026):** în unele dueluri botul vede următoarele 12 lumânări și alege intrarea al cărei target vine înaintea stopului, ca să câștige acele dueluri. Șansa e 15% la nivelul 1, 20%, 25%, 30% și 35% la nivelul 5, fixată de seed la începutul duelului (`duelForesight`). Utilizatorul nu e informat. În acele dueluri, notele botului spun doar ce a făcut, fără motive inventate, iar interfața nu afirmă nicăieri că botul vede doar ce vede utilizatorul.
- **Scorul:** Duel = round(0,7 × Decision Quality + 0,3 × Outcome), unde Outcome = 50 + 50 × R / 3, între 0 și 100, rotunjit. R e suma R-multiple-urilor: cu stop, mărimea poziției nu-l schimbă. Cine nu are nicio tranzacție pierde; fără tranzacții de ambele părți, e egal. La scor egal decid Risk Discipline, apoi R.
- **Rezultatul** arată separat, pentru amândoi, Decision Quality, Risk Discipline, R, P&L-ul simulat și scorul de duel, plus un mesaj explicit când profitul și procesul spun lucruri diferite.
- **Ratingul** pornește de la 1000 și se actualizează Elo (K = 32) după fiecare duel cu rating.
- **Nivelul și ratingul fiecărui bot sunt fixe:** nu cresc și nu scad după rezultate. Mirror își alege defectul după obiceiurile utilizatorului, dar are nivelul fix 3. Lobby-ul spune asta în „How duels work”.
- **XP:** 30 pentru un duel terminat, pentru primele 3 dueluri ale zilei. Victoria nu dă XP în plus; resign nu dă XP.
- **Un singur duel activ.** Se salvează la fiecare închidere de lumânare, la fiecare ordin, la pauză și la ieșire, și se reia din lobby de unde a rămas. „Resign” cere confirmare, închide pozițiile unde s-a oprit și contează ca înfrângere.
- **Daily duel:** același bot, scenariu și seed pentru toți în aceeași zi, o dată pe zi, fără rating.
- **Mirror** joacă greșeala cea mai frecventă a utilizatorului (din ultimele rezultate) dintre cele pe care un bot le poate juca. Fără una, cardul e dezactivat și explică de ce.
- **Lobby-ul** marchează botul recomandat (neînvins, cu ratingul cel mai apropiat), rivalul (botul care a câștigat ultimele două dueluri contra ta) și boții bătuți (cel puțin 2 victorii).
- Duelurile contra boților nu consumă sesiunile Arena ale planului Free; scenariile Pro rămân Pro. Duelurile terminate apar în Recent activity și contează pentru streak; în Trade Journal nu apar încă. Duelurile salvate de prima versiune, pe runde, se elimină la încărcare.
- În cod: `packages/missions/src/duel.ts` (piața pe tick-uri, tura botului, foresight-ul, scorul, Elo, daily, Mirror) și `bots.ts` (personajele), `startDuel`, `saveDuel`, `finishDuel` și `resignDuel` din `packages/ui/src/store.ts`, `packages/ui/src/pages/Duels.tsx`, `components/DuelParts.tsx`. Calibrarea boților: `npm run bots:calibrate`.

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
  - duelurile terminate;
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
