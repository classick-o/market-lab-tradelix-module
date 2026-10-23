# MARKET//LAB · Trading Skill Academy

Modulul de învățare a trading-ului pentru Tradelix. Utilizatorul învață prin lecții scurte, misiuni și o piață simulată, cu bani virtuali. Primește scoruri separate pentru **calitatea deciziei**, **disciplina de risc** și **rezultatul simulat**: un trade profitabil nu înseamnă automat o decizie bună.

Interfața e în engleză. Planul complet e în [PLAN_DEZVOLTARE.md](PLAN_DEZVOLTARE.md), sistemul de design (tokeni, componente, navigație, QA) e în [DESIGN.md](DESIGN.md), regulile de funcționare ale fiecărui ecran sunt în [KNOWLEDGE.md](KNOWLEDGE.md), iar planul sistemului de învățare (Learn) e în [PLAN_LEARN.md](PLAN_LEARN.md).

## Pornire

Ai nevoie de Node.js 22.12 sau mai nou.

```bash
npm install
npm run dev        # http://localhost:5180
```

| Comandă | Ce face |
|---|---|
| `npm run dev` | Pornește modulul separat de Tradelix (Vite) |
| `npm test` | Rulează testele: motor, scoruri, profil, misiuni, Arena, conținut educațional |
| `npm run typecheck` | Verifică tipurile în tot proiectul |
| `npm run build` | Build de producție în `apps/standalone/dist` (paginile se încarcă pe bucăți, la cerere) |
| `npm run content:generate` | Regenerează datele sintetice ale misiunilor (`packages/missions/data/scenarios.json`) |
| `npm run content:inspect [M06]` | Joacă toate alternativele fiecărei misiuni și afișează scorul și rezultatul simulat |
| `npm run bots:calibrate [seeds]` | Joacă fiecare bot de duel pe toate scenariile: scorul mediu, R, tranzacțiile și greșelile lui |

## Demo pe GitHub Pages (temporar)

Demo-ul rulează la https://classick-o.github.io/market-lab-tradelix-module/. La fiecare push pe `main`, workflow-ul verifică tipurile, rulează testele, face build-ul și îl publică.

- **O singură dată:** în repo, Settings → Pages → Build and deployment → Source: **GitHub Actions**.
- **Progresul:** se salvează în browserul fiecărui vizitator (`localStorage`).

**Când codul se mută în aplicația mamă,** hostingul se scoate fără să atingi modulul:

1. Șterge `.github/workflows/pages.yml`. Doar acest fișier ține de GitHub.
2. Opțional, șterge `apps/standalone/`, gazda demo. Linia `base: process.env.PAGES_BASE` din `vite.config.ts` pleacă odată cu ea.
3. Pachetele din `packages/` nu conțin nimic legat de hosting. Aplicația mamă montează `<MarketLab />` direct (vezi „Integrarea în Tradelix”).

## Navigația

Pe desktop: un **sidebar** persistent, care se poate colapsa. Are 6 destinații într-o singură listă, fără titluri de grup:

| Destinație | Secțiuni |
|---|---|
| Dashboard | – |
| Missions | All Missions · Daily Challenges · Weekly Challenges · Assessments |
| Trading Arena | Simulator · Scenarios · Duels · Virtual Portfolio · Risk Calculator |
| Trade Journal | Session History · Decision Journal · Trade Replay · Alternative Decisions · Performance Analytics |
| Learn | Learning Paths · Lessons · Concept Library · Glossary · Knowledge Checks |
| Achievements | Skill Profile · Levels & XP · Achievements · Learning Streaks · Milestones |

Jos în sidebar sunt cardul „Upgrade to Pro” (devine „Manage plan” pentru Pro) și rândul de cont, cu iconițe pentru Settings (Profile · Preferences · Notifications · Privacy & Security · Billing) și notificări.

- **Comportament:**
  - Sus în sidebar sunt logo-ul și widget-ul de progres (nivel, rang, bară XP, colapsabil).
  - Jos e contul: avatar, nume, planul curent și meniul cu Sign out.
  - Clic pe un părinte deschide prima lui secțiune; săgeata din dreapta doar extinde sau restrânge submeniul.
  - Secțiunea activă se deschide singură.
  - Starea colapsat/extins se păstrează.
  - În modul colapsat apar doar iconițe, cu tooltip-uri și submeniuri flyout accesibile și din tastatură.
- **Tabletă (768–1199px):** sidebar-ul e afișat colapsat.
- **Mobil (sub 768px):**
  - Jos e o bară cu 5 destinații: Home, Missions, Arena, Learn, Profile. Profile adună Journal, Progress, Settings și planul.
  - Meniul din stânga sus deschide un drawer pe tot ecranul, cu toată navigația.
- **Badge-uri:** apar doar pentru lucruri pe care le poți face acum (provocarea zilnică nefăcută, o sesiune Arena în curs).

## Ce știe să facă

- **Dashboard:**
  - salut cu nivel și rang;
  - obiective zilnice (XP) și săptămânale (zile active);
  - streak și nivelul de competență;
  - Continue Learning și misiunea recomandată, cu motivul ei;
  - activitatea recentă și ultima simulare;
  - acțiuni rapide și cardul Pro (doar pentru Free).
- **Missions:**
  - **All Missions:** misiunea recomandată (cu motivul ei), apoi căutare și filtre (topic, dificultate, durată, status), cu cele 10 categorii din specificație.
  - **Provocări zilnice:** 3 itemi pe un obiectiv, generați determinist din dată.
  - **Provocări săptămânale:** scenariul săptămânii plus 3 obiective și 150 XP.
  - **Assessments:** evaluarea inițială, teste pe topic, evaluări practice și finală, evoluția competențelor.
  - **Pagina de misiune:** intro, obiectiv, briefing, prerechizite, încercări.
  - **În player:** feedback imediat după fiecare decizie, judecat doar pe ce se știa atunci.
- **Trading Arena:**
  - **9 scenarii:** bullish, bearish, sideways, high/low volatility, breakout, false breakout, reversal, unexpected event. Fiecare are condiții de start, obiectiv, capital, constrângeri, parametri de risc și condiții de finalizare.
  - **Simulator:**
    - grafic pe 1H sau 4H, cu SMA 20/50 și volum;
    - ordine market și limit, stop și target;
    - jurnal opțional la confirmarea ordinului: motivul, planul de ieșire, starea;
    - istoricul ordinelor și sumarul sesiunii.
  - **Duels:** 1v1 contra a 8 boți declarați, pe aceeași piață, în 8 runde de câte 10 lumânări:
    - tranzacțiile botului se văd pe grafic și în panoul „You vs bot”, iar fiecare decizie a lui vine cu motivul ei;
    - câștigă procesul: 70% decision quality, 30% rezultat în R;
    - rating Elo, daily duel, Mirror (botul care joacă greșeala ta cea mai frecventă). Detalii în [PLAN_DUELS.md](PLAN_DUELS.md).
  - **Virtual Portfolio:** echitate, capital disponibil, expunere, risc deschis, curba echității, poziții închise.
  - **Risk Calculator:** calculul transparent al mărimii poziției, gratuit pe orice plan.
- **Trade Journal:**
  - istoric cu toate sesiunile, cu DQ, RD și rezultatul în coloane separate;
  - jurnalul deciziilor (plan versus execuție, plus lecția învățată);
  - replay pentru misiuni și pentru Arena;
  - **decizii alternative**: rezultat cunoscut versus ipotetic, cu jumătate sau dublu de mărime, stopuri mai strânse sau mai largi, fără trade;
  - analytics: tendințe, consecvența riscului și a sizing-ului, aderența la stop, performanța pe scenariu și pe skill, erori frecvente.
- **Learn:**
  - 18 lecții, cu 14 ilustrații SVG, 7 exemple interactive și o verificare în fiecare lecție;
  - 5 trasee plus o secvență personalizată;
  - Concept Library cu 40 de concepte și un glosar cu 90 de termeni;
  - verificări de cunoștințe din 94 de întrebări (grilă, scenarii, exerciții numerice), cu explicații.
- **Achievements:**
  - profil radar și istoricul pe skill;
  - niveluri, ranguri și istoricul XP;
  - 29 de realizări (niciuna nu depinde de profit);
  - streak-uri cu heatmap pe 16 săptămâni;
  - milestone-uri și sumare lunare.
- **Premium:**
  - planurile Free, Pro lunar și Pro anual, cu comparație între ele;
  - ce e Premium și limitele de utilizare (5 sesiuni Arena pe zi pe Free, analytics pe 30 de zile);
  - gestionarea abonamentului.
  - **Standalone, checkout-ul e demo și nu ia bani.**
- **Settings:**
  - profil (nume, avatar, nivel, obiective, topicuri de focus);
  - preferințe (limbă, temă Black/Charcoal/Navy, accent, fus orar, grafice, redare);
  - notificări, confidențialitate (consimțăminte, export, ștergere) și billing.
- **Stări:** fiecare secțiune are stări de încărcare (skeleton), gol și eroare (cu Try again), iar o eroare izolată nu dărâmă restul aplicației.

Progresul se salvează local, în browser (`localStorage`). Nimic nu e trimis nicăieri. Datele salvate de versiunile anterioare sunt migrate automat.

## Structura

```
packages/
  engine/        motorul de simulare: pur, determinist, sume în cenți întregi
  scenario-gen/  generator de piețe sintetice: regimurile și cele 9 scenarii Arena
  evaluation/    evaluatori, Decision Quality Score și Risk Discipline Score (nu văd P&L-ul)
  learning/      profil de competențe, recomandări, reguli XP
  missions/      misiunile, runtime-ul, scenariile Arena, alternativele what-if, duelurile și boții
  academy/       lecții, întrebări, concepte, glosar, trasee, realizări, streak-uri, provocări
  ui/            modulul React <MarketLab />: sidebar, router propriu, pagini, stiluri izolate
apps/
  standalone/    gazdă Vite care rulează modulul separat de Tradelix
```

## Integrarea în Tradelix

Modulul e o singură componentă React, cu router, stare și stiluri proprii (scopate sub `.ml-root`). Exemplu într-o pagină Astro, cu integrarea `@astrojs/react` instalată:

```astro
---
// src/pages/learn/[...path].astro
import { MarketLab } from "@market-lab/ui";
import "@market-lab/ui/styles.css";
---
<Layout>
  <MarketLab
    client:only="react"
    basePath="/learn"
    storageKey={`marketlab.${userId}`}
    plan={user.plan}
    user={{ name: user.name, avatarUrl: user.avatar }}
    onUpgrade={(billing) => openCheckout(billing)}
    onManageBilling={() => openBillingPortal()}
    onSignOut={() => signOut()}
  />
</Layout>
```

| Prop | Rol |
|---|---|
| `plan` | Planul din contul Tradelix. Când e setat, înlocuiește planul demo local. **Drepturile trebuie verificate pe server**: modulul doar le reflectă în interfață. |
| `onUpgrade`, `onManageBilling` | Checkout-ul și portalul de facturare ale Tradelix, în locul celor demo. |
| `onSignOut`, `user` | Sign-out-ul și identitatea reale. |
| `showNav={false}` | Ascunde sidebar-ul și barele modulului, dacă navigația o asigură Tradelix. Secțiunile rămân accesibile prin tab-urile din pagini. |

## Portarea în Angular

Dacă aplicația-mamă e în Angular, cea mai mare parte se mută direct:

| Ce | Cum se mută |
|---|---|
| `packages/engine`, `scenario-gen`, `evaluation`, `learning`, `missions`, `academy` | Direct. Sunt TypeScript pur, fără React și fără DOM: motorul, scorurile, XP-ul, recomandările și tot conținutul. |
| Stilurile (`packages/ui/src/styles.css` și `styles/`) | Direct, ca stylesheet global. Sunt CSS simplu cu variabile `--ml-*`, toate clasele au prefixul `ml-`, iar tema se pune pe un element `.ml-root` (`data-theme`, plus variabilele de accent). Fișierele din `styles/screens/` corespund ecranelor, deci pot fi atașate și pe componentă. Imaginile din `src/assets/art/` se copiază lângă ele (CSS-ul le referă relativ, `../../assets/art/`). |
| Componentele din `packages/ui` | Se rescriu ca componente Angular, păstrând markup-ul și clasele. Sunt mici și fără logică proprie: logica stă în pachetele de mai sus și în `store.ts` / `progress.ts`, care pot deveni un serviciu Angular. |
| Routerul propriu (`router.tsx`) | Se înlocuiește cu Angular Router; rutele sunt listate în `nav.ts`. |

Ordinea recomandată: pachetele de logică și CSS-ul, apoi un serviciu care ține starea (echivalentul `store.ts`), apoi ecranele, începând cu shell-ul (sidebar, bara de sus) și Dashboard.

## Cum adaugi conținut

**Misiune:**

1. Descrie datele de piață în `packages/missions/src/specs.ts`, apoi rulează `npm run content:generate`.
2. Scrie misiunea în `packages/missions/src/content/mXX.ts` și adaug-o în `content/index.ts`.
3. Pune-o într-o categorie în `packages/academy/src/topics.ts` (`MISSION_TOPICS`).
4. Rulează `npm run content:inspect MXX` și adaugă așteptările în `packages/missions/test/missions.test.ts`.

**Lecție sau întrebări:**

1. Adaugă-le în `packages/academy/src/content/` (`lessons-*.ts`, `questions-*.ts`). Contractul e `packages/academy/src/types.ts`.
2. Testele din `packages/academy/test` verifică singure toate legăturile: întrebări, lecții, misiuni, scenarii, concepte și termeni.

## Urmează

- **Backend:** API cu motorul rulând pe server, autentificare și SSO cu Tradelix, progres salvat pe cont, verificarea drepturilor Pro pe server.
- **Conținut:** misiuni pentru Order Types și Portfolio Exposure (acum acoperite de lecții, verificări și calculator), plus M03, M08, M09, M11–M15.
- **Faza 3:** mai multe instrumente simulate, rapoarte avansate, funcții pentru instructori.
