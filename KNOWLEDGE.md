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

## Missions

- Secțiunile sunt: All Missions, Daily Challenges, Weekly Challenges și Assessments. `/missions` deschide All Missions.
- Misiunea recomandată, cu motivul ei, apare sus pe All Missions și pe Dashboard.
  - În cod: `NAV` din `packages/ui/src/nav.ts`, `recommend()` din `packages/learning`.

## Dashboard

### Continue learning

Arată un singur pas, primul care se potrivește, în ordinea:

1. o misiune începută și neterminată;
2. o sesiune Arena în curs;
3. următorul pas dintr-un learning path început; dacă nu există unul, primul path cu pași rămași;
4. dacă toate path-urile sunt gata, o trimitere spre scenariile Arena.

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
