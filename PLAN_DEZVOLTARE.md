# MARKET//LAB — Plan de dezvoltare

**Sursă:** `MARKET_LAB_MVP_Concept.md` (v1.0)
**Data:** 19 octombrie 2026
**Ce acoperă:** ce face aplicația, cum funcționează, funcționalitățile pe module, arhitectura tehnică și ordinea de construcție.
**Ce nu acoperă:** model de business, echipă, marketing, buget.

Unde conceptul lasă o decizie deschisă (§23 din concept), planul propune o alegere concretă, ca implementarea să poată începe. Toate aceste alegeri sunt adunate în §1 și pot fi schimbate. Ce rămâne cu adevărat deschis e listat în §22.

> **Stadiu (19.10.2026):** F1 (vertical slice) e implementat și depășit parțial spre F2: motor, generator, scor de proces, profil, recommender, 7 misiuni, Arena, Replay, Journal, toate rulând în browser cu salvare locală. Detalii și abaterile de stack față de acest plan sunt în §1.1 și în `README.md`.

---

## Cuprins

0. [Rezumat](#0-rezumat)
1. [Decizii de pornire](#1-decizii-de-pornire)
2. [Ce face aplicația](#2-ce-face-aplicația)
3. [Cum funcționează: fluxurile principale](#3-cum-funcționează-fluxurile-principale)
4. [Funcționalități pe module](#4-funcționalități-pe-module)
5. [Conținut: misiuni și scenarii](#5-conținut-misiuni-și-scenarii)
6. [Motorul de simulare](#6-motorul-de-simulare)
7. [Decision Quality Score](#7-decision-quality-score)
8. [Profil de competențe și recomandări](#8-profil-de-competențe-și-recomandări)
9. [AI Coach](#9-ai-coach)
10. [Social Challenges](#10-social-challenges)
11. [Gamification](#11-gamification)
12. [Arhitectura tehnică](#12-arhitectura-tehnică)
13. [Modelul de date](#13-modelul-de-date)
14. [API](#14-api)
15. [Securitate și confidențialitate](#15-securitate-și-confidențialitate)
16. [Analytics și experimente](#16-analytics-și-experimente)
17. [Cerințe non-funcționale](#17-cerințe-non-funcționale)
18. [Strategie de testare](#18-strategie-de-testare)
19. [Infrastructură, medii, CI/CD](#19-infrastructură-medii-cicd)
20. [Plan de execuție pe faze](#20-plan-de-execuție-pe-faze)
21. [Riscuri tehnice și mitigări](#21-riscuri-tehnice-și-mitigări)
22. [Decizii deschise](#22-decizii-deschise)
- [Anexa A: Trasabilitatea criteriilor de acceptanță](#anexa-a-trasabilitatea-criteriilor-de-acceptanță)

---

## 0. Rezumat

- **Ce este:** o aplicație web responsive în care utilizatorul învață trading luând decizii în scenarii de piață simulate, cu bani virtuali, și primește feedback pe **calitatea procesului**, separat de profit sau pierdere.
- **Bucla:** Observe → Decide → Experience → Understand → Improve. Fiecare pas are un modul dedicat (§2).
- **Inima tehnică** e un **motor de simulare pur, determinist, în TypeScript**, care rulează identic în browser (pentru răspuns instant) și pe server (unde e autoritar). Toate rezultatele se pot reproduce din event log (§6).
- **Scorul de proces (DQS)** se calculează din reguli deterministe. Prin construcție, evaluatorii nu au acces la P&L (§7).
- **Profilul de competențe** folosește o actualizare de tip Elo, cu grad de încredere, iar **recomandările** sunt bazate pe reguli și vin mereu cu motivul afișat (§8).
- **AI Coach-ul** doar explică și pune întrebări. Primește context verificat, construit pe server, nu are niciun drept de scriere asupra simulării, iar răspunsurile îi sunt validate înainte de afișare (§9).
- **Stack:** monorepo TypeScript cu Next.js (web), Fastify (API), PostgreSQL, Redis, PostHog și Sentry (§12).
- **Construcție în 4 faze, 8–14 săptămâni:** fundație → vertical slice (M06 jucabilă în browser) → alfa funcțional (server, 11 misiuni) → beta adaptiv (recommender, Coach, social, 15 misiuni) (§20).

---

## 1. Decizii de pornire

Răspunsuri concrete la §23 din concept. Fiecare decizie e aleasă astfel încât să păstreze MVP-ul mic și determinist.

| # | Decizie | Alegere pentru MVP | De ce | Se revizuiește când |
|---|---|---|---|---|
| 1 | Instrument | **Un singur tip de instrument: spot fictiv `LABX/vUSD`**, P&L liniar, fără levier, fără finanțare, fără conversii valutare. Misiunile pot folosi și alte simboluri fictive, dar cu aceeași specificație. | Formulele din concept (§10.3–10.4) se aplică direct. Nu există probleme de licență. | Când utilizatorii cer realism (FX, indici, futures) |
| 2 | Date | **100% sintetice**, generate determinist (seed), cu tipare pedagogice garantate. Etichetă vizibilă „Synthetic”. Evenimentele de știri sunt etichetate „Hypothetical”. | Control complet asupra tiparelor (FOMO, fake breakout), reproductibilitate, cost zero de licență. | Când există o sursă istorică licențiată cu drept de afișare |
| 3 | Ordine în Arena | **Market, Limit (pentru intrare), Stop-loss și Take-profit atașate poziției**, închidere totală sau parțială. Fără trailing stop, stop-entry sau OCO generic. | Acoperă toate misiunile M01–M15. | Post-MVP |
| 4 | Realism | Spread fix, comision procentual, gap la deschidere, ordine intrabar explicită. Fără slippage aleator și fără limite de lichiditate. | Totul rămâne explicabil și reproductibil. | Când apar misiuni despre execuție |
| 5 | Scorul de proces | Rubrici pe misiune, construite din **evaluatori deterministici**. **Niciun LLM în calculul scorului.** | Scor reproductibil și auditabil (§2.3 din concept). | — |
| 6 | Rolul AI | Explică, întreabă, ajută la reflecție. Nu are acces de scriere. Contextul e construit pe server. | Constrângerile din §7.10 ale conceptului. | — |
| 7 | Social | Provocări săptămânale **create de echipă**, asincrone, cu pseudonime. Raționamentele sunt **private implicit** (opt-in pentru partajare). | Nevoie minimă de moderare și risc mic de toxicitate. | Grupuri sau invitații, post-MVP |
| 8 | Monetizare | Planuri **Free / Pro** definite (20.10.2026, §1.2). Modulul primește planul de la gazdă și doar îl reflectă; drepturile se verifică pe server. Standalone, checkout-ul e demo. | Calculele de risc și siguranța rămân gratuite. | Înainte de lansarea publică |
| 9 | Acces | **Cont guest automat**, fără înregistrare până după primul debrief, apoi se poate face upgrade la cont complet. | Altfel ținta „prima decizie în sub 60 s” nu se poate atinge. | — |
| 10 | Platformă | Web responsive (Next.js), desktop-first, folosibil pe mobil. | Conform conceptului. | — |
| 11 | Limbă | **Engleză** (decis 19.10.2026). Textele sunt centralizate în fișierele de conținut, ca o a doua limbă să poată fi adăugată ulterior. | Publicul Tradelix și textele din concept sunt în engleză. | Când apare o piață-țintă nouă |
| 12 | Relația cu Tradelix | **Modul integrat în Tradelix** (decis 19.10.2026), care rulează și separat pe durata dezvoltării. Modulul e o componentă React (`<MarketLab basePath="/learn" />`) cu router propriu, stiluri izolate și tokenii de design Tradelix. | Tradelix poate monta modulul (ex.: ca React island în Astro) fără să-i preia routerul sau starea. | La integrare: SSO și salvare pe server |

### 1.1 Abateri de stack față de §12, în implementarea curentă

| Plan | Implementat acum | Motiv |
|---|---|---|
| Next.js pentru web | Pachet React (`@market-lab/ui`) + gazdă Vite (`apps/standalone`) | Modulul trebuie să se monteze în Tradelix (Astro), deci nu poate depinde de un framework de rutare. |
| pnpm + Turborepo | npm workspaces | npm e deja instalat; nu e nevoie de unelte în plus la această dimensiune. |
| TradingView Lightweight Charts | Grafic SVG propriu | Interacțiunile pedagogice (marcarea unui preț, zone, linii de decizie, viitorul ascuns) sunt mai simple cu control complet. Se poate reveni la Lightweight Charts pentru consecvență cu modulul Charting din Tradelix. |
| Misiuni în YAML | Misiuni ca module TypeScript tipizate | Autocompletare și verificare la compilare. Datele de piață sunt totuși JSON generat și versionat (`data/scenarios.json`). |
| API + Postgres din F2 | Salvare locală (`localStorage`), motorul rulează în browser | Corespunde F1 („LocalSessionGateway”). Logica e pură și deterministă, deci aceeași rulează pe server în F2. |
| XState | Mașină de stări derivată din jurnalul de răspunsuri (`runMission`) | Starea misiunii se reconstruiește determinist din răspunsuri. Nu e nevoie de o bibliotecă separată. |

### 1.2 Arhitectura funcțională MARKET//LAB (adoptată 20.10.2026)

Specificația „MARKET//LAB — Product Functional Architecture & Sidebar Specification” înlocuiește structura de navigație inițială (Home / Missions / Arena / Skills / Journal). Bucla devine **Learn → Practice → Review → Improve**, iar aplicația are 8 destinații în 3 grupuri, într-un sidebar persistent.

| Modul | Rută | Ce s-a implementat | Faza din specificație |
|---|---|---|---|
| Dashboard | `/dashboard` | Progres, obiective zilnice și săptămânale, streak, Continue Learning, misiunea recomandată, activitate, ultima simulare, acțiuni rapide, card Pro | 1 |
| Missions | `/missions/*` | All Missions (misiunea recomandată, căutare și filtre pe 10 categorii), Daily, Weekly, Assessments, pagina de misiune, feedback imediat în player | 1 |
| Trading Arena | `/arena/*` | Simulator (1H/4H, SMA, market/limit, istoric ordine), 9 scenarii, Virtual Portfolio, Risk Calculator | 1 (un instrument) |
| Trade Journal | `/journal/*` | Session History, Decision Journal, Trade Replay (misiuni și Arena), Alternative Decisions, Performance Analytics; debrief-ul de sesiune | 1–2 |
| Learn | `/learn/*` | 5 trasee + o secvență personalizată, 18 lecții, 40 de concepte, 90 de termeni, 20 de verificări de cunoștințe | 1–2 |
| Progress & Achievements | `/progress/*` | Skill Profile, Levels & XP, 29 de realizări, streak-uri, milestone-uri | 1–2 |
| Premium | `/pricing`, `/settings/billing` | Planuri și comparație, conținut Pro, limite de utilizare, gestionarea abonamentului (demo standalone) | 2 |
| Settings & Account | `/settings/*` | Profile, Preferences, Notifications, Privacy & Security, Billing | 1 |

**Decizii luate la adoptare:**

- **Risk Discipline Score:** scor nou, separat de Decision Quality și de rezultatul simulat. Se calculează doar din criteriile care măsoară respectarea limitelor:
  - un stop la fiecare intrare;
  - riscul în limită;
  - mărimea poziției calculată din stop;
  - stopul nu se lărgește niciodată;
  - mărimea nu crește după o pierdere.

  Implementarea e `riskDisciplineScore`, în `packages/evaluation`.
- **Paleta:** fundal navy, accent lime și albastru secundar, conform specificației. Verde și roșu sunt rezervate rezultatelor simulate și apar mereu cu semn. Varianta „Charcoal” rămâne disponibilă ca temă.
- **Premium:**
  - Free include toate misiunile, provocările, evaluările, Risk Calculator-ul, lecțiile de management al riscului, 6 scenarii și 5 sesiuni Arena pe zi.
  - Pro adaugă 3 scenarii avansate, traseele Intermediate și Psychology, 2 lecții avansate, analytics complet și export.
  - Calculele de risc și informațiile de siguranță nu sunt niciodată plătite.
  - În standalone, checkout-ul e demo. În Tradelix, planul vine prin prop-ul `plan` și **trebuie verificat pe server**.
- **Conținut educațional:** e în `packages/academy`, ca date tipizate, verificate automat de teste (legăturile dintre lecții, întrebări, concepte, misiuni și scenarii).
- **Ce lipsește încă:**
  - misiuni dedicate pentru categoriile Order Types și Portfolio Exposure (până atunci le acoperă lecțiile, verificările și calculatorul);
  - autentificarea reală și verificarea drepturilor pe server;
  - notificări livrate în afara aplicației;
  - instrumente simulate suplimentare (Faza 3).

---

## 2. Ce face aplicația

### 2.1 Bucla principală și modulele care o servesc

```
 OBSERVE             DECIDE                EXPERIENCE            UNDERSTAND              IMPROVE
 ───────             ──────                ──────────            ──────────              ───────
 Mission Player  →   Checkpoint UI     →   Motor simulare    →   Debrief             →   Profil competențe
 grafic + context    order ticket          playback, fills,      Outcome ≠ DQS           Recommender
 date etichetate     ipoteză + risc        SL/TP, equity         Replay Lab, Coach        Journal, XP
```

### 2.2 Harta modulelor funcționale

| Modul | Ce face | Fază (§20) |
|---|---|---|
| Landing | Explică produsul și duce utilizatorul la prima misiune | F1 |
| Cont și identitate | Guest automat, upgrade, preferințe, export și ștergere date | F1 → F3 |
| Onboarding / Placement | Nivel autodeclarat și 3–5 micro-scenarii care estimează profilul | F1 |
| Home / Learning Hub | Recomandarea următoarei acțiuni, progres, reluarea sesiunii întrerupte | F2 |
| Missions | Biblioteca de misiuni, cu filtre și motivele de blocare | F2 |
| Mission Player | Rulează o misiune: grafic, context, checkpoint-uri, playback | F1 |
| Motor de simulare | Ordine, poziții, P&L, costuri, SL/TP, event log, replay | F1 |
| Evaluare | Outcome metrics și Decision Quality Score, feedback generat din reguli | F1 |
| Debrief | Transformă rezultatul în lecție, inclusiv alternative contrafactuale | F1 → F2 |
| Skills | Competențe cu nivel, încredere, dovezi și pasul următor | F2 |
| Journal | Istoricul deciziilor și notele personale | F2 |
| Replay Lab | Reluarea deciziei în context, fără scurgeri de informație din viitor | F2 |
| Arena | Practică liberă pe un instrument, cu metrici de disciplină | F2 |
| AI Coach | Explicații și întrebări personalizate, read-only | F3 |
| Social Challenges | Același scenariu pentru toți, comparația raționamentelor după închidere | F3 |
| Gamification | XP, streak-uri sănătoase, obiective săptămânale, milestone-uri | F2 → F3 |
| Back-office | Status conținut, moderare, programare provocări, cereri de date | F2 → F3 |
| Analytics | Funnel, metrici de învățare, retenție, experimente | F1 → F3 |

### 2.3 Ce NU face aplicația

- Nu tranzacționează bani reali și nu se conectează la brokeri.
- Nu dă semnale de cumpărare sau vânzare, nu face predicții și nu oferă recomandări de investiții.
- Nu are clasamente după profit, chat live sau mesaje private.
- Nu are aplicații native (doar web).
- Nu lasă utilizatorii să genereze scenarii. Nu lasă AI-ul să genereze liber date de piață.
- Nu folosește date istorice reale în MVP.

---

## 3. Cum funcționează: fluxurile principale

### 3.1 Prima sesiune (guest-first)

| # | Utilizatorul | Sistemul | Buget de timp |
|---|---|---|---|
| 1 | Deschide landing-ul și apasă **Start your first mission** | Creează un cont guest (cookie httpOnly) și emite `onboarding_started` | ~10 s |
| 2 | Alege nivelul: „Sunt la început” / „Cunosc bazele” / „Nu sunt sigur” | Setează θ inițial pe competențe (§8.2), cu încredere „scăzută” | ~5 s |
| 3 | Rezolvă primul micro-scenariu pe grafic | Sesiune `placement` cu un singur checkpoint, evaluată pe loc | **prima decizie la sub 60 s** de la click |
| 4 | Încă 2–4 micro-scenarii sau **Sari peste** | Fiecare răspuns devine o evidență cu pondere 0,5 | 1–2 min |
| 5 | Vede profilul inițial | Nivel estimat, încredere, plus motivul pentru care i se recomandă prima misiune | — |
| 6 | Joacă prima misiune (M01 pentru începători, M04 pentru intermediari) | Sesiune `mission`, datele sunt dezvăluite pe segmente (§3.3) | 3–7 min |
| 7 | Citește debrief-ul | Server-ul calculează outcome, DQS, feedback și alternative | — |
| 8 | Primește propunerea „Salvează-ți progresul” | Upgrade guest → cont (magic link sau Google). Datele se păstrează. | opțional |
| 9 | Alege următoarea acțiune | O recomandare principală, plus 3 alternative | — |

Conturile guest fără activitate timp de 30 de zile se șterg automat (job programat).

### 3.2 Ciclul de viață al unei misiuni

Pe client, ciclul e o mașină de stări (XState). Pe server, sesiunea are statusul `active | completed | abandoned`.

```
            start                     checkpoint atins
[briefing] ──────► [observing] ─────────────────────────► [deciding]
                                                              │
                     respins (cu explicație) ◄────────────────┤ submit
                                                              │ valid
                                                              ▼
                     există alt checkpoint ◄──────────── [resolving]  (playback segment)
                     → [deciding]                             │ final
                                                              ▼
                                         [reflecting] ──► [debrief] ──► [done]

oricare stare ──exit──► [paused] ──resume──► starea anterioară (reconstruită din event log)
```

Sesiunile active fără activitate timp de 7 zile devin `abandoned`. Ele apar totuși în Home la secțiunea „Reia misiunea” până la expirare.

### 3.3 Punctul de decizie (checkpoint), pas cu pas

1. **Dezvăluire controlată.** Server-ul trimite lumânările până la `checkpoint.at_step` și definiția checkpoint-ului. Nu trimite nimic de după.
2. **Opțiuni.** Clientul afișează opțiunile. Dacă opțiunea aleasă presupune o tranzacție, se deschide Order Ticket. Riscul se calculează local, cu aceeași bibliotecă de motor folosită pe server.
3. **Confirmare.** Un modal arată direcția, cantitatea, intrarea, stop-ul, ținta, riscul (în vUSD și în % din equity), raportul R:R, comisioanele estimate și eticheta „SIMULARE · bani virtuali”.
4. **Submit.** Clientul trimite `POST /v1/sessions/:id/decision` cu `checkpoint_id`, `option_id`, ipoteza, ordinul, motivele, `expected_seq` și `Idempotency-Key`.
5. **Server-ul:**
   1. verifică autorizarea;
   2. validează schema;
   3. încarcă starea (snapshot plus evenimentele de după);
   4. rulează `engine.apply`. Dacă ordinul e respins, răspunde 422 cu codul motivului (§6.6);
   5. altfel, într-o tranzacție: adaugă evenimentele, avansează simularea până la următorul checkpoint sau până la final și răspunde cu evenimentele, segmentul nou de lumânări, starea și `state_hash`.
6. **Playback.** Clientul animă segmentul cu Play / Pause / Step. Decizia e deja blocată, deci playback-ul e doar vizual. Execuțiile, SL și TP apar pe grafic la pasul lor.
7. Urmează următorul checkpoint sau concluzia misiunii.

### 3.4 Debrief și alternative contrafactuale

La `POST /sessions/:id/complete`, server-ul calculează și salvează rezultatul. Rezultatul e imutabil și versionat.

- **Simulation Outcome:** P&L realizat, costuri, drawdown, expunere, R-multiple (§6.7).
- **Decision Quality:** DQS de la 0 la 100, cu detaliere pe fiecare criteriu (§7).
- **Feedback:** texte autorizate, alese din rezultatele evaluatorilor (ce a mers, ce se poate îmbunătăți).
- **Alternative:** fiecare misiune definește 1–2 scripturi alternative. Server-ul le rulează prin motor pe aceeași variantă de date și obține P&L-ul și DQS-ul fiecăreia. Debrief-ul le afișează una lângă alta, ca utilizatorul să vadă concret că **un proces bun poate pierde și un proces slab poate câștiga**.
- **Întrebare de reflecție:** răspunsul se salvează în Journal.

### 3.5 Sesiunile următoare

`GET /v1/home` întoarce agregat:
- recomandarea principală, cu motivul;
- sloturile „Continue your path”, „Practice this skill”, „Try a harder scenario”, „Review your decisions” (§8.5);
- competențele în dezvoltare;
- ultima sesiune;
- o sesiune întreruptă, dacă există;
- provocarea activă.

Nu există presiune artificială (fără countdown-uri și fără mesaje de tipul „pierzi recompensa”).

### 3.6 Arena (practică liberă)

1. `POST /v1/arena/sessions` creează o sesiune pe un „pachet de regim” sintetic (trend, range, volatil, mixt), cu un seed nou și 300–500 de lumânări.
2. Clientul cere date cu `POST /sessions/:id/reveal`. Fereastra de prefetch e de **maximum 10 lumânări** peste pasul confirmat de server, ca să nu poată fi văzut viitorul îndepărtat.
3. Acțiunile (ordine, modificări de SL/TP, închideri) se aplică local imediat și se sincronizează în batch prin `POST /sessions/:id/actions`. Server-ul le recalculează și confirmă hash-ul stării.
4. La final (când utilizatorul încheie sau datele se termină), utilizatorul primește un mini-debrief cu metrici de disciplină. Acestea sunt evaluate pe rubrica generică „Arena discipline”: stop la fiecare intrare, risc constant, respectarea limitei, overtrading.

### 3.7 Replay Lab

- Pornește de la orice sesiune finalizată: `GET /sessions/:id/replay` întoarce datele dezvăluite, evenimentele și alternativele.
- Re-simularea până la pasul *k* rulează în browser cu `engine.replay`, deci scrubbing-ul e instant.
- **Modul „prezice înainte să vezi”:** la un punct de decizie, lumânările de după rămân ascunse. Utilizatorul își scrie ipoteza de acum, apoi apasă **Reveal**.
- Panoul „Ce știai atunci” afișează strict informația disponibilă la pasul respectiv.

### 3.8 Ciclul unei provocări sociale

```
scheduled ──► open (7 zile) ──► closed ──► revealed ──► archived
                │                              │
                └ fiecare user: 1 submisie     └ agregate + continuarea scenariului
                  imutabilă                      + raționamente partajate (opt-in)
```

---

## 4. Funcționalități pe module

Legendă pentru faze: **F1** = vertical slice, **F2** = alfa funcțional, **F3** = beta adaptiv, **Post** = după MVP.

### 4.1 Landing
| Funcționalitate | Fază | Criteriu de acceptanță |
|---|---|---|
| Headline, subheadline, CTA primar și secundar | F1 | Valoarea produsului e înțeleasă în câteva secunde (testat în usability) |
| Preview interactiv: un micro-scenariu „Read the Candle” rulat în browser, fără cont | F1 | Funcționează și pe mobil, fără să afecteze LCP |
| „Cum funcționează” în 3 pași, exemple de competențe | F1 | — |
| Badge permanent „Simulare · bani virtuali”, FAQ, linkuri legale | F1 | Nicio performanță simulată nu e prezentată ca rezultat real |
| Pagină statică (SSG), SEO de bază, Open Graph | F1 | LCP p75 sub 2,5 s pe mobil |

### 4.2 Cont și identitate
| Funcționalitate | Fază |
|---|---|
| Cont guest creat automat, cu sesiune prin cookie httpOnly | F1 (local), F2 (server) |
| Upgrade guest → cont: magic link pe email și Google OAuth, cu toate datele păstrate | F2 |
| Confirmarea vârstei (age gate) și acceptarea termenilor (versionată) | F2 |
| Setări: limbă, reduced motion, notificări, vizualizare tabelară a graficelor | F2 |
| Export date (JSON) și ștergere cont, cu confirmare | F3 |
| Ștergerea automată a conturilor guest inactive 30 de zile | F2 |

### 4.3 Onboarding / Placement
| Funcționalitate | Fază |
|---|---|
| Alegerea nivelului autodeclarat (3 opțiuni) | F1 |
| Micro-scenarii (3 în F1, 5 în F2), rulate cu același runtime ca misiunile (`kind = placement`) | F1 |
| „Sari peste”: profil cu încredere scăzută | F1 |
| Sumar: competențe estimate, încredere, ce e de exersat, prima misiune și motivul | F1 |
| Mod simplificat (începător) vs. accelerat (intermediar: itemi mai grei, M01–M02 sărite dacă sunt trecute) | F2 |

### 4.4 Home / Learning Hub
| Funcționalitate | Fază |
|---|---|
| Card „Recommended next mission”, cu motivul (în F2 după ordinea traseului, în F3 adaptiv) | F2 → F3 |
| Sloturi: Continue path, Practice skill, Try harder, Review decisions | F3 |
| Competențe în dezvoltare, rezumatul ultimei sesiuni | F2 |
| „Reia misiunea” pentru sesiunea întreruptă | F2 |
| Stările ecranului: utilizator nou, profil incomplet, activ, toate misiunile terminate, eroare | F2 |
| Card cu provocarea socială activă | F3 |

### 4.5 Missions (biblioteca)
| Funcționalitate | Fază |
|---|---|
| Listă cu filtre (competență, dificultate, status: nouă / recomandată / completată) | F2 |
| Misiuni blocate, cu motivul („Necesită: Risk Management ≥ Developing”) | F2 |
| Card de misiune: titlu, competență, dificultate, durată, încercări, cel mai bun DQS | F2 |

### 4.6 Mission Player
| Funcționalitate | Fază |
|---|---|
| Layout desktop: grafic central, panou lateral cu obiectivul și contextul, controale de decizie jos, timeline, progresul misiunii | F1 |
| Layout mobil: grafic simplificat, card de context, controale mari, detalii în bottom sheets | F2 |
| Tipuri de checkpoint (§5.1): `choice`, `wait_or_act`, `order_ticket` | F1 |
| Restul tipurilor de checkpoint | F2–F3 |
| **Hypothesis builder** structurat: direcție, motive (chips), invalidare, încredere, notă opțională de maximum 280 de caractere | F1 |
| **Risk builder**: câmpuri pentru intrare / stop / țintă, plus calculatorul de cantitate maximă pentru un risc dat (§6.7) | F1 |
| Linii de SL/TP trase direct pe grafic | F2 |
| Modal de confirmare cu riscul afișat | F1 |
| Playback Play / Pause / Step / viteză, cu respectarea `prefers-reduced-motion` | F1 |
| Context cards calculate determinist din datele vizibile („+12,4% în ultimele 10 lumânări”) | F1 |
| Ieșire și reluare fără pierderea progresului | F2 |

### 4.7 Debrief
| Funcționalitate | Fază |
|---|---|
| Rezumatul deciziei, rezultatul simulat, detalierea DQS, ce a mers, ce se poate îmbunătăți | F1 |
| Panoul „Ce informații erau disponibile” (snapshot-ul de la checkpoint) | F1 |
| Alternative contrafactuale (P&L și DQS pentru fiecare) | F2 |
| Întrebarea de reflecție (răspunsul se salvează în Journal) | F1 |
| Următoarea acțiune: repetă (altă variantă de date), misiune similară, nivel următor, teorie | F2 |
| Butonul „Întreabă Coach-ul” | F3 |

### 4.8 Skills (profilul de învățare)
| Funcționalitate | Fază |
|---|---|
| 8 competențe, fiecare cu nivel estimat, încredere, exerciții completate, comportamente observate și abilitatea următoare | F2 |
| Skill tree vizual cu prerechizite | F3 |
| Mențiunea „indicator educațional intern, nu certificare” | F2 |

### 4.9 Journal
| Funcționalitate | Fază |
|---|---|
| Intrare automată pentru fiecare sesiune finalizată: dată, scenariu, ipoteză, motiv, risc, acțiuni, rezultat, reflecție, DQS, link către Replay | F2 |
| Note proprii (editare și ștergere), filtrare după competență, misiune sau dată | F2 |
| Export | F3 |

Journal-ul e **o vizualizare peste sesiuni**, nu o copie a lor. Tabela proprie conține doar notele utilizatorului.

### 4.10 Replay Lab
| Funcționalitate | Fază |
|---|---|
| Timeline cu puncte de decizie, scrubbing înainte și înapoi, marcaje pentru intrare, ieșire și modificări | F2 |
| Panoul „Ce știai atunci” | F2 |
| Overlay pentru alternative (marcaje „fantomă” și curba de equity alternativă) | F2 |
| Modul „prezice înainte să vezi” | F3 |

### 4.11 Arena
| Funcționalitate | Fază |
|---|---|
| Un instrument, grafic cu lumânări și timeline, Play / Pause / Step / viteză | F2 |
| Order ticket (market, limit, SL, TP), cantitate, risc în vUSD și %, confirmare | F2 |
| Poziții deschise, ordine în așteptare, capital, equity, P&L realizat și nerealizat, expunere, drawdown | F2 |
| Statusurile ordinelor sunt explicite: în așteptare, executat, respins (cu motiv), anulat | F2 |
| Explicații contextuale („Ce e asta?”) pentru fiecare câmp | F2 |
| Mini-debrief de disciplină la finalul sesiunii | F2 |
| Mesaj permanent: stop-loss-ul simulat nu garantează execuția la preț exact în piața reală | F2 |

### 4.12 AI Coach (detalii în §9)
| Funcționalitate | Fază |
|---|---|
| Drawer lateral cu modurile: Explain concept, Why did my score change, Alternatives, Quiz me, Reflect | F3 |
| Fallback pe explicații scrise de echipă dacă AI-ul nu e disponibil | F3 |
| Cotă zilnică și indicator de cotă | F3 |

### 4.13 Social Challenges (detalii în §10)
| Funcționalitate | Fază |
|---|---|
| Lista provocărilor active și închise, participare, submisie cu decizie + parametri de risc + raționament | F3 |
| Rezultate după închidere: distribuții, outcome, DQS, raționamente partajate, „util”, raportare | F3 |

### 4.14 Gamification (detalii în §11)
| Funcționalitate | Fază |
|---|---|
| XP pentru completare, reflecție, replay și participare la provocări | F2 |
| Niveluri cosmetice | F2 |
| Streak-uri cu zile de pauză, obiectiv săptămânal ales de utilizator, milestone-uri de competență | F3 |

### 4.15 Accesibilitate
| Funcționalitate | Fază |
|---|---|
| Reduced motion, focus vizibil, etichete accesibile | F1 |
| Navigare completă cu tastatura, inclusiv pe grafic (săgețile parcurg lumânările, OHLC anunțat prin `aria-live`) | F2 |
| Rezumat textual al graficului, generat determinist | F2 |
| Comutare la vizualizare tabelară | F2 |
| Stări comunicate și prin icon sau text (▲ ▼, „profit” / „pierdere”), nu doar prin culoare | F1 |

### 4.16 Back-office (rol `admin`)
| Funcționalitate | Fază |
|---|---|
| Statusul conținutului publicat (misiuni și versiuni), căutare utilizator pentru suport (fără acces la textul jurnalului) | F2 |
| Coadă de moderare, programarea provocărilor, cereri de export și ștergere, feature flags | F3 |

---

## 5. Conținut: misiuni și scenarii

### 5.1 Tipuri de checkpoint (biblioteca de interacțiuni)

| Tip | Ce face utilizatorul | Ce se poate evalua |
|---|---|---|
| `choice` | Alege una din N opțiuni (ex.: trend / range / incert) | Opțiunea, cu credit parțial; motivul ales |
| `chart_pick` | Marchează pe grafic (ex.: high-ul unei lumânări, un nivel) | Distanța față de țintă, cu toleranță |
| `numeric` | Calculează o valoare (ex.: cantitatea) | Eroarea relativă față de valoarea corectă, cu toleranță |
| `order_ticket` | Plasează un ordin cu parametri | Stop prezent, risc ≤ limită, R:R, mărimea corectă |
| `wait_or_act` | Intră acum / așteaptă o confirmare definită / renunță | Coerența cu ipoteza, regula de confirmare |
| `manage_position` | Ține poziția / o închide / închide parțial / mută stop-ul | Respectarea planului, stop mutat în direcția greșită |
| `compare_plans` | Alege între planurile A și B și justifică alegerea | Criteriile invocate, recunoașterea trade-off-urilor |
| `plan_builder` | Construiește un playbook: teză, trigger, invalidare, risc, țintă, reguli | Completitudine și consecvență internă |
| `reflection` | Răspunde la întrebarea de reflecție (structurat + text liber) | Doar completarea (nu conținutul textului) |

### 5.2 Harta misiunilor

Prescurtări pentru competențe: MB = Market Basics, OM = Order Mechanics, RM = Risk Management, PS = Position Sizing, MS = Market Structure, SA = Scenario Analysis, DD = Decision Discipline, RR = Reflection & Review.

| ID | Misiune | Competența principală | Competențe secundare | Checkpoint-uri | Dificultate | Fază |
|---|---|---|---|---|---|---|
| M01 | Read the Candle | MB | — | `chart_pick`, `choice` | 1 | F1 |
| M02 | Trend or Noise? | MS | MB | `choice` | 1 | F2 |
| M03 | The Waiting Game | DD | MS | `wait_or_act` | 2 | F2 |
| M04 | Define Your Risk | RM | OM | `order_ticket` | 2 | F2 |
| M05 | Size Matters | PS | RM | `numeric`, `order_ticket` | 2 | F2 |
| M06 | The FOMO Trap | DD | RM, SA | `wait_or_act`, `order_ticket` | 3 | **F1 (slice)** |
| M07 | Stop or Stay? | DD | RM | `manage_position` ×2 | 3 | F2 |
| M08 | Risk / Reward | RM | SA | `choice`, `order_ticket` | 2 | F2 |
| M09 | The Fake Breakout | MS | SA | `wait_or_act`, `manage_position` | 3 | F2 |
| M10 | No Trade Is a Trade | DD | SA | `wait_or_act` | 3 | F2 |
| M11 | Volatility Shift | PS | RM, SA | `manage_position`, `numeric` | 4 | F3 |
| M12 | The News Shock | SA | RM | `manage_position` (eveniment ipotetic) | 4 | F3 |
| M13 | Revenge Trade | DD | PS | Stare inițială cu o pierdere, apoi `order_ticket` | 4 | F3 |
| M14 | Two Valid Strategies | SA | RR | `compare_plans` | 4 | F2 |
| M15 | Build Your Playbook | toate | — | `plan_builder` + execuție | 5 | F3 |

- **Alfa (F2): 11 misiuni.** **Beta (F3): 15.**
- Fiecare misiune are **3 variante de date** cu continuări diferite (continuare, consolidare, reversal). O misiune reluată folosește altă variantă, deci utilizatorul nu poate memora rezultatul.

### 5.3 Formatul unei misiuni (content as code)

Misiunile sunt fișiere YAML validate cu o schemă zod. Exemplul de mai jos e M06, prescurtat.

```yaml
id: M06
version: 1
title_key: missions.m06.title              # "The FOMO Trap"
skill_primary: decision_discipline
skills_secondary: [risk_management, scenario_analysis]
difficulty: 3
estimated_minutes: 5
data_label: synthetic

scenario:
  variants: [fomo_a@1, fomo_b@1, fomo_c@1]  # continuare / consolidare / reversal
  initial_reveal: 80                        # câte lumânări sunt vizibile la start
  account: { initial_equity: 10000.00 }
  rules:
    allow_short: false
    order_types: [market, limit]
    require_stop: false                     # intenționat: misiunea evaluează dacă utilizatorul îl pune
    max_risk_pct: 2.0

checkpoints:
  - id: cp_entry
    trigger: { at_step: 80 }
    type: wait_or_act
    prompt_key: missions.m06.cp_entry.prompt
    context_cards: [move_last_10, distance_from_sma20]
    options:
      - { id: enter_now,         requires: [hypothesis, order_ticket] }
      - { id: wait_confirmation, requires: [confirmation_rule], next: cp_confirm }
      - { id: skip,              requires: [reason] }
  - id: cp_confirm
    trigger:
      condition: { pullback_then_close_above: { level_ref: breakout_level, max_steps: 15 } }
      on_timeout: conclude
    type: order_ticket

rubric:
  version: 1
  criteria:   # niciun criteriu nu depinde de P&L
    - { id: hyp,   evaluator: hypothesis_stated,         weight: 25, skill: scenario_analysis,   applies_if: entered }
    - { id: inv,   evaluator: invalidation_before_entry, weight: 30, skill: risk_management,     applies_if: entered }
    - { id: unc,   evaluator: uncertainty_acknowledged,  weight: 20, skill: decision_discipline }
    - { id: rules, evaluator: followed_declared_rules,   weight: 25, skill: decision_discipline }

alternatives:   # rulate contrafactual în debrief, pe aceeași variantă
  - id: alt_wait
    script: [{ cp: cp_entry, choose: wait_confirmation, rule: pullback_hold }]
  - id: alt_enter_with_stop
    script: [{ cp: cp_entry, choose: enter_now, order: { side: buy, type: market, risk_pct: 1, stop: below_swing_low } }]

reflection: { question_key: missions.m06.reflection }

follow_up:
  - { if: "dqs >= 75",            recommend: M10 }
  - { if: "error_tag == no_stop", recommend: M04 }

tests:          # golden tests, rulate în CI pe toate variantele
  - name: skip_with_reason_is_valid
    script: [{ cp: cp_entry, choose: skip, reasons: [extended_move] }]
    expect: { dqs_min: 70 }
  - name: market_entry_without_stop
    script: [{ cp: cp_entry, choose: enter_now,
               hypothesis: { direction: up, reasons: [momentum] },
               order: { side: buy, type: market, qty: 50 } }]
    expect: { dqs_max: 45, error_tags: [no_stop] }
  - name: dqs_independent_of_variant
    script: [{ cp: cp_entry, choose: enter_now, order: { side: buy, type: market, risk_pct: 1, stop: below_swing_low } }]
    expect: { same_dqs_across_variants: true }
```

**Cum împiedicăm ca „skip” să devină strategia dominantă.**
- Variantele misiunilor M03, M06, M09 și M10 includ și situații în care **există** o oportunitate conformă cu regulile declarate.
- Criteriul `opportunity_assessed` verifică dacă utilizatorul a evaluat explicit acea oportunitate.
- Renunțarea fără motiv valid primește un scor mic.

### 5.4 Generatorul de scenarii sintetice (`packages/scenario-gen`)

- **Model de preț:** mișcare browniană geometrică (GBM) cu **schimbare de regim**: drift și volatilitate diferite pentru trend, range, breakout, fake breakout, volatility shift și șoc de știre. Seed-ul folosește un PRNG determinist (ex.: xoshiro128**).
- **Ancore pedagogice:** autorul fixează prețul la anumiți pași (ex.: „la pasul 80 prețul e +12% față de pasul 70”). Între ancore, traseul se generează cu un **Brownian bridge**. Astfel tiparul e garantat, iar zgomotul rămâne realist.
- **Ordinea intrabar:** fiecare lumânare primește `path: OHLC | OLHC` (dacă high-ul sau low-ul a fost atins primul). Asta elimină ambiguitatea SL/TP în aceeași lumânare (§6.4).
- **Validatori automați:**
  - prețuri pozitive, rotunjite la tick;
  - `high ≥ max(open, close)` și `low ≤ min(open, close)`;
  - aserțiuni de formă specifice tiparului (ex.: fake breakout = prețul trece de nivel și revine în maximum *k* lumânări).
- **Output:** JSON imutabil `scenario_id@version`, cu `sha256` al conținutului. Fișierul se commit-uiește în `content/scenarios/`.

### 5.5 Pipeline-ul de conținut

```
autor scrie YAML ──► pnpm content:validate ──► PR review ──► CI: content:publish ──► DB (imutabil)
                       │                        (content +      id@version + sha256,
                       ├ schema zod              dev)            status draft/published/retired
                       ├ referințe existente
                       ├ ponderile rubricii au suma 100
                       ├ fiecare opțiune e accesibilă; fiecare cale are ≥ 2 criterii aplicabile
                       ├ cheile i18n există în toate limbile active
                       └ golden tests trec pe toate variantele
```

- Sesiunile aflate în desfășurare păstrează versiunea cu care au început.
- O misiune nouă se publică întotdeauna cu `version + 1`. Versiunile publicate nu se editează niciodată.

---

## 6. Motorul de simulare

Pachetul `packages/engine` e cea mai riguros testată componentă.

### 6.1 Principii

- **Pur:** fără I/O, fără `Date.now()`, fără randomness. Zero dependențe externe.
- **Determinist:** aceleași intrări (scenariu, configurație, acțiuni) produc mereu exact aceeași stare.
- **Aritmetică pe întregi:** prețurile sunt în ticks, cantitățile în unități, banii în cenți. Toate sunt `number` întregi (sigure până la 9·10¹⁵). Procentele se calculează doar pentru afișare, nu se stochează niciodată ca sursă de adevăr.
- **Rotunjire documentată:** comisioanele se rotunjesc în sus la cent (ceil), adică în defavoarea utilizatorului. Cantitatea se rotunjește în jos la lot.
- **Versionat semantic.** Fiecare sesiune înregistrează `engine_version`.

### 6.2 Modelul de timp și de vizibilitate

- Lumânările au indecși `t = 0 … T−1`. La cursorul `t`, utilizatorul vede lumânările `0…t`, iar lumânarea `t` e închisă.
- Un ordin trimis la cursorul `t` nu poate fi executat pe o lumânare `≤ t`. Excepția e ordinul Market, executat la `close(t)`, care e deja cunoscut.
- Checkpoint-urile condiționale („închidere peste X după o retragere”) se evaluează doar pe lumânările deja dezvăluite.

### 6.3 Instrument și cont

```ts
InstrumentSpec = { symbol: "LABX", tickSize: 0.01, lotSize: 1, quoteCurrency: "vUSD", pnlModel: "linear" }
CostModel      = { halfSpreadTicks: 5, commissionBps: 5 }   // per scenariu
RiskLimits     = { maxLeverage: 1.0, maxRiskPct?: 2.0, allowShort: false, requireStop: false }
```

- Seria de prețuri e **mid**. Cumpărătorul plătește `ask = mid + halfSpread`, vânzătorul primește `bid = mid − halfSpread`.
- **Contabilitate fără marjă:** `equity = initialEquity + realizedPnl + unrealizedPnl − feesPaid`.
- **Buying power:** după execuție, `|notional poziție| ≤ equity × maxLeverage` (1,0 în MVP).
- **Netting:** există o singură poziție pe instrument. Un ordin în aceeași direcție mărește poziția și recalculează prețul mediu. Un ordin în sens opus o reduce sau o închide. **Inversarea directă a poziției e respinsă**: utilizatorul trebuie s-o închidă întâi.

### 6.4 Ordine suportate și reguli de execuție

Toate condițiile se evaluează pe **prețul executabil**: ask pentru cumpărare, bid pentru vânzare.

| Ordin | Se execută când | Preț de execuție |
|---|---|---|
| Market buy / sell | Imediat, la cursorul `t` | `close(t) ± halfSpread` |
| Limit buy `L` | Prima lumânare `t' > t` în care `ask` atinge `≤ L` | `min(open_ask(t'), L)` |
| Limit sell `L` | Prima lumânare `t' > t` în care `bid` atinge `≥ L` | `max(open_bid(t'), L)` |
| Stop-loss pe long `S` | `bid` atinge `≤ S` | `min(open_bid(t'), S)` (gap ⇒ preț mai prost) |
| Take-profit pe long `T` | `bid` atinge `≥ T` | `max(open_bid(t'), T)` (gap ⇒ preț mai bun) |
| SL / TP pe short | Simetric, pe `ask` | Simetric |

**Mai multe evenimente în aceeași lumânare:**
1. **Gap la deschidere:** se verifică întâi `open`. Dacă trece de SL, TP sau de un limit, execuția se face la `open`.
2. **Ordinea intrabar e cunoscută** (`path` din datele sintetice): se parcurge traseul `O→H→L→C` sau `O→L→H→C` segment cu segment, iar declanșările se aplică în ordinea atingerii.
3. **Ordinea intrabar e necunoscută** (date istorice viitoare): **regula pesimistă**, adică evenimentul advers se consideră primul (SL înaintea TP; intrare pe limit urmată de SL în aceeași lumânare).

### 6.5 Ordinea de procesare într-un pas (`t → t+1`)

1. Se dezvăluie lumânarea `t+1` în starea motorului.
2. Se parcurge traseul de preț: gap la deschidere, apoi segmentele intrabar. Pe parcurs se verifică ordinele limit în așteptare, SL și TP.
3. Se aplică execuțiile: se actualizează poziția, P&L-ul realizat și comisioanele.
4. Se face mark-to-market la `close(t+1)` (pe mid).
5. Se actualizează equity, peak equity, drawdown, MAE/MFE pe tranzacție.
6. Se evaluează declanșatorii de checkpoint.
7. Se emit evenimentele, în ordine, cu `seq` crescător.

### 6.6 Validare și coduri de respingere

Fiecare respingere are un cod stabil și o cheie de explicație localizată.

| Cod | Situație |
|---|---|
| `INVALID_QUANTITY` / `LOT_SIZE` | Cantitate ≤ 0 sau care nu e multiplu de lot |
| `PRICE_OFF_TICK` | Prețul nu e multiplu de tick |
| `INSUFFICIENT_BUYING_POWER` | Ordinul ar depăși `equity × maxLeverage` |
| `STOP_WRONG_SIDE` / `TARGET_WRONG_SIDE` | Stop deasupra intrării pe long etc. |
| `RISK_LIMIT_EXCEEDED` | Riscul la intrare depășește `maxRiskPct` (doar dacă scenariul impune limita) |
| `STOP_REQUIRED` | Scenariul cere stop, iar ordinul nu are |
| `SHORT_NOT_ALLOWED` / `ORDER_TYPE_NOT_ALLOWED` | Regulile scenariului nu permit |
| `WOULD_FLIP_POSITION` | Ordinul ar inversa direct poziția |
| `NO_POSITION` / `ORDER_NOT_FOUND` | Modificare sau închidere pe ceva inexistent |
| `SESSION_NOT_ACTIVE` | Sesiunea e finalizată sau abandonată |
| `STALE_STATE` | `expected_seq` nu coincide (HTTP 409) |

O acțiune respinsă **nu modifică starea**. Ea adaugă doar evenimentul `order_rejected`.

### 6.7 Contabilitate și metrici

- **Pe poziție:** instrument, direcție, cantitate, preț mediu de intrare, mark curent, comisioane, P&L realizat și nerealizat, SL, TP, timestamp-uri (pași), ID-ul scenariului.
- **Pe tranzacție (round trip):** riscul inițial `R` (distanța intrare–stop × cantitate, plus costurile estimate), R-multiple, MAE/MFE, durata în pași, riscul la intrare în %.
- **Pe sesiune:** P&L total, comisioane totale, drawdown maxim (absolut și %), expunerea maximă (% din equity), timpul în piață, numărul de tranzacții.

**Calculatorul de mărime** (`maxQtyForRisk`) include spread-ul și comisioanele și rotunjește în jos. Exemplu:
- Date: equity 10.000,00, risc 1% (100,00 vUSD), intrare la mid 100,00, stop la 98,00, spread 0,05, comision 5 bps.
- Prețul de intrare e ask = 100,05, deci riscul de preț e 2,05 pe unitate.
- 46 de unități: risc de preț 94,30 + comisioane 2,31 + 2,26 = **98,87 ≤ 100** ✓
- 47 de unități: 96,35 + 2,36 + 2,31 = 101,02 > 100 ✗
- **Rezultat: 46 de unități.** Formula simplificată din concept dă 50, iar diferența se explică în UI.

### 6.8 Event sourcing, replay, state hash

- **Sursa de adevăr** e lista ordonată a acțiunilor utilizatorului (`source = user`), plus scenariul și versiunea motorului.
- Evenimentele derivate de motor (`order_filled`, `stop_triggered` etc.) se stochează și ele, pentru analytics și replay rapid, dar pot fi oricând recalculate.
- **Snapshot-uri** se salvează la fiecare checkpoint și o dată la 50 de pași, ca reconstrucția stării să fie rapidă.
- **`state_hash`:** SHA-256 peste JSON-ul canonic al stării (chei sortate). Clientul și server-ul îl calculează amândoi. La nepotrivire:
  - clientul adoptă starea server-ului;
  - se emite `engine_divergence` în Sentry. Orice divergență e tratată ca bug.
- **Job nocturn în staging:** re-simulează 100% din sesiunile din ziua precedentă și compară hash-urile. Exit criteria pentru F2 depinde de acest job.
- **Schimbarea versiunii motorului:** sesiunile vechi se afișează din evenimentele stocate și nu se recalculează cu un motor nou. Versiunile minore nu au voie să schimbe rezultatele. Asta se verifică prin golden tests.

### 6.9 Interfața pachetului

```ts
export function createSession(scenario: Scenario, cfg: EngineConfig): SimState;
export function apply(state: SimState, action: Action): StepResult;      // validează + aplică
export function advance(state: SimState, steps: number): StepResult;     // procesează pași (§6.5)
export function replay(scenario: Scenario, cfg: EngineConfig, actions: TimedAction[]):
  { final: SimState; events: EngineEvent[]; snapshots: Map<number, SimState> };
export function maxQtyForRisk(input: SizingInput): { qty: number; riskCents: number; breakdown: RiskBreakdown };
export function hashState(state: SimState): string;

type Action =
  | { type: "submit_order"; atStep: number; side: "buy" | "sell"; orderType: "market" | "limit";
      qty: number; limitTicks?: number; stopLossTicks?: number; takeProfitTicks?: number }
  | { type: "modify_brackets"; atStep: number; stopLossTicks?: number | null; takeProfitTicks?: number | null }
  | { type: "cancel_order"; atStep: number; orderId: string }
  | { type: "close_position"; atStep: number; qty?: number }
  | { type: "advance_to"; step: number };

type StepResult = { state: SimState; events: EngineEvent[]; rejected?: { code: RejectCode; details: object } };
```

---

## 7. Decision Quality Score

### 7.1 Biblioteca de evaluatori (`packages/evaluation`)

Un evaluator e o funcție pură `(view: ProcessView, params) → { applicable, score ∈ [0,1], evidence, feedbackKey, errorTags[] }`.

| Evaluator | Ce verifică | Competență tipică |
|---|---|---|
| `hypothesis_stated` | Ipoteza structurată e completată înainte de intrare | SA |
| `invalidation_before_entry` | Stop-ul sau condiția de invalidare există la momentul submit-ului | RM |
| `risk_within_limit` | Riscul la intrare e ≤ limita (cu credit parțial până la 1,5× limita) | RM |
| `size_matches_risk` | Cantitatea e în toleranța față de `maxQtyForRisk` | PS |
| `numeric_answer` | Valoarea calculată e în toleranță | PS / MB |
| `choice_in_set` | Opțiunea face parte din setul acceptabil (cu hartă de credit parțial) | MS / SA |
| `rr_at_least` | R:R la intrare ≥ *k* | RM |
| `waited_for_confirmation` | Intrarea a avut loc după condiția declarată | DD |
| `uncertainty_acknowledged` | Utilizatorul a ales o invalidare și o încredere diferită de „sigur” sau a ales un motiv valid de renunțare | DD |
| `opportunity_assessed` | Când oportunitatea există, utilizatorul a evaluat-o explicit | DD |
| `followed_declared_rules` | Acțiunile respectă planul declarat (stop nemutat în direcția greșită, ieșire pe regulă) | DD |
| `no_revenge_sizing` | Mărimea după o pierdere nu crește peste X% | DD / PS |
| `exposure_adjusted` | Expunerea e redusă sau reevaluată la creșterea volatilității | PS |
| `plan_complete` | Playbook-ul are toate componentele și e consecvent intern | SA |
| `reflection_completed` | Reflecția e completată (fără evaluarea conținutului) | RR |

### 7.2 Calculul scorului

```
DQS = round( 100 × Σ(wᵢ × sᵢ) / Σ(wᵢ) )      peste criteriile cu applicable = true
```

- Criteriile au `applies_if` (ex.: `entered`). Ponderea celor neaplicabile se redistribuie proporțional.
- Validatorul de conținut garantează că **fiecare cale** prin misiune are cel puțin 2 criterii aplicabile.
- **Benzi afișate, formulate fără stigmatizare:** 0–49 „De lucrat”, 50–74 „În progres”, 75–89 „Solid”, 90–100 „Excelent”.
- Fiecare rezultat salvează `rubric_version` și `evaluator_version`.

### 7.3 Separarea de P&L, impusă tehnic

- `ProcessView` **nu conține** câmpuri de outcome (P&L, equity final, prețuri ulterioare deciziei). E un tip TypeScript separat, construit de un adaptor.
- O regulă ESLint `no-restricted-imports` interzice pachetului `evaluation` să importe tipurile de outcome.
- **Test de proprietate:** aceleași acțiuni rulate pe continuări diferite ale datelor dau **exact același DQS** (§18).

### 7.4 Feedback

- Fiecare `feedbackKey` corespunde unui template localizat, cu date interpolate din `evidence`. Exemplu: „Ai riscat {risk_pct}% față de limita de {limit}% a scenariului.”
- **„Ce a funcționat”** = criteriile cu `s ≥ 0,8`. **„Ce poate fi îmbunătățit”** = criteriile cu `s < 0,5`. Ambele liste sunt ordonate după pondere.
- **Ghid de ton** pentru autori:
  - fără „ar fi trebuit să cumperi” în scenariile ambigue;
  - fără judecăți despre persoană;
  - formulări concrete, legate de observații.
- **Anti-gaming:** motivele se aleg din chips structurate, iar textul liber e opțional și nu se punctează. XP-ul scade la reluări repetate (§11).

---

## 8. Profil de competențe și recomandări

### 8.1 Competențe și prerechizite

```
Market Basics ──► Order Mechanics ──► Risk Management ──► Position Sizing
      │                                     │
      └──► Market Structure ──► Scenario Analysis
                                            └──► Decision Discipline (necesită RM + MS)
Reflection & Review: transversală, alimentată de reflecții, replay și journal
```

### 8.2 Algoritmul de actualizare (de tip Elo, explicabil)

Pentru fiecare competență *s*, se păstrează `θₛ` (abilitate estimată), `nₛ` (numărul de evidențe) și reziduurile recente.

1. **Prior** din nivelul autodeclarat: începător −1,0; „nu sunt sigur” −0,5; „cunosc bazele” 0,0.
2. **Evidențe:**
   - Fiecare criteriu evaluat produce `(skill, p = scor, b = dificultate, w)`.
   - Dificultatea 1–5 se mapează la `b' = (b − 3) × 0,5`.
   - Ponderea `w` e 1,0 pentru criteriile competenței principale, 0,5 pentru cele secundare și pentru placement, 0,3 pentru Arena.
3. **Scorul așteptat:** `E = 1 / (1 + e^(−(θ − b')))`.
4. **Actualizare:** `θ ← θ + K·w·(p − E)`, unde `K = 0,4 / (1 + 0,15·n)`. Pasul e limitat la `|Δθ| ≤ 0,3`, deci **o singură alegere nu poate schimba drastic profilul**.
5. Parametrii se recalibrează după date reale (beta). Ei sunt versionați în cod.

### 8.3 Nivel și încredere

| θ | Nivel |
|---|---|
| < −0,5 | Novice |
| −0,5 … 0,25 | Developing |
| 0,25 … 1,0 | Proficient |
| > 1,0 | Advanced |

- **Încrederea:**
  - **scăzută** dacă `n < 3`;
  - **medie** dacă `3 ≤ n < 8`;
  - **ridicată** dacă `n ≥ 8` și deviația standard a ultimelor 5 reziduuri e < 0,25.
- În UI, nivelul apare **întotdeauna împreună cu încrederea**: „Developing · încredere scăzută”.
- **„Comportamente observate”** sunt generate din evidențe. Exemplu: „Ai setat stop-loss înainte de intrare în 4 din 5 misiuni.”

### 8.4 Tipare de eroare

- **Etichete:** `no_stop`, `stop_after_entry`, `oversized`, `risk_over_limit`, `chased_entry`, `moved_stop_away`, `exit_without_rule`, `ignored_invalidation`, `revenge_size_up`, `no_hypothesis`, `overtrading`.
- **Tipar recurent** = aceeași etichetă în cel puțin 2 din ultimele 5 sesiuni în care era aplicabilă.
- Tiparele recurente alimentează recomandările și slotul „Review your decisions”.

### 8.5 Recommender

**F2: traseu fix.** Ordinea implicită este M01 → M02 → M04 → M05 → M03 → M08 → M06 → M07 → M10 → M09 → M14 (iar în F3: M13 → M11 → M12 → M15). Misiunile cu DQS < 50 sunt reluate cu altă variantă de date.

**F3: adaptiv.**

```
score(m) = 0,35·need(skillₘ) + 0,25·fit(diffₘ) + 0,25·errorMatch(m) + 0,10·pathBonus(m) + 0,05·novelty(m)
           − penalizare(jucată în ultimele 24 h) − penalizare(competență Advanced cu încredere ridicată)

need       = 1 − σ(θ)  (+0,1 dacă încrederea e scăzută)
fit        = 1 − |b'ₘ − (θ + 0,3)| / 2       (ținta: puțin peste nivelul curent)
errorMatch = 1 dacă misiunea vizează un tipar recurent al utilizatorului
```

- **Filtre dure:** misiunile blocate (prerechizite sub Developing) și cele retrase sunt excluse.
- **Motivul afișat** e generat din factorul dominant. Exemplu: „Recomandată pentru că ai depășit riscul planificat în 2 din ultimele 3 misiuni.”
- **Sloturi:**
  - *Continue path* = următoarea misiune din traseu;
  - *Practice skill* = competența cu θ minim, cu cel puțin 1 evidență;
  - *Try harder* = doar dacă θ > 0,25 și încrederea e cel puțin medie;
  - *Review* = sesiunea cu cel mai mic DQS sau cu un tipar recurent.
- Fiecare recomandare afișată se loghează (`recommendations_log`), ca să poată fi evaluată eficiența ei.

---

## 9. AI Coach

### 9.1 Moduri și unde sunt disponibile

| Mod | Unde | Restricție |
|---|---|---|
| Explain this concept | Oriunde, inclusiv în timpul unui checkpoint | Contextul **nu** include opțiunile corecte din rubrică și nici date viitoare |
| Why did my decision score change? | Debrief, Journal | După finalizarea sesiunii |
| What alternatives were available? | Debrief, Replay | Doar după reveal |
| Quiz me on this skill | Skills, după debrief | — |
| Help me reflect on this trade | Debrief, Journal | — |

### 9.2 Arhitectură

```
Client ──► API /coach/:mode ──► ContextBuilder (server, citește din DB doar date dezvăluite)
                                     │  context JSON verificat
                                     ▼
                              Coach service (stateless, FĂRĂ acces la DB)
                                     │  prompt + context ──► Claude API
                                     │  ◄── răspuns JSON structurat
                                     ▼
                              Validatori de output ──► API salvează mesajul ──► Client
```

- Coach service-ul primește **doar** contextul construit de API și nu are credențiale de bază de date. Prin construcție, nu poate modifica simularea.
- API-ul scrie mesajele în `coach_messages`, cu un rol de bază de date care are drepturi doar pe tabelele coach-ului.

### 9.3 Contextul transmis modelului

Contextul conține:
- `mission_id@version`, obiectivul și competența vizată;
- eticheta datelor (`synthetic`), regulile și limitele scenariului;
- **doar lumânările dezvăluite**: sumarizate (ultimele N lumânări plus features calculate determinist: pantă, ATR, distanța față de medie), fiecare cu un ID de referință;
- acțiunile utilizatorului și ipoteza lui;
- detalierea DQS și feedback-ul (doar în debrief);
- explicațiile aprobate din glosar (`content/glossary/`), relevante pentru concept;
- limitele explicite: ce nu are voie să facă.

Contextul **nu** conține email, nume sau alte date personale.

### 9.4 Reguli și protecții

- **Promptul de sistem** cere ca modelul:
  - să separe observația de interpretare;
  - să nu facă predicții și să nu dea recomandări de investiții;
  - să spună explicit când informația e insuficientă;
  - să folosească doar cifre din context.
- **Textul utilizatorului** (întrebare, jurnal, raționament) e încadrat ca **date**, delimitat, nu ca instrucțiuni. Asta e protecția împotriva prompt injection.
- **Refuzuri:** întrebările despre active reale, de tipul „ce să cumpăr” sau care cer predicții primesc un răspuns de refuz politicos, cu redirecționare spre un concept educațional.

### 9.5 Formatul răspunsului (structured output)

```json
{
  "answer_markdown": "string",
  "observations":   [{ "text": "string", "ref": "candle:78 | metric:atr14 | rubric:inv" }],
  "interpretations":[{ "text": "string", "confidence": "low|medium|high" }],
  "insufficient_info": false,
  "refusal": null
}
```

### 9.6 Validarea răspunsului înainte de afișare

1. **Grounding numeric:** toate numerele din răspuns sunt extrase și trebuie să existe în context (cu toleranță de rotunjire).
2. **Fraze interzise:** promisiuni de profit, „garantat”, „ar trebui să cumperi sau să vinzi”, nume de active reale.
3. **Referințele** (`ref`) trebuie să existe în context.
4. **Dacă validarea eșuează:** se încearcă o singură regenerare. Dacă eșuează din nou, se afișează explicația autorizată din glosar și se loghează incidentul.

### 9.7 Configurarea modelului

- **Model:** `claude-opus-5-5` prin SDK-ul oficial `@anthropic-ai/sdk`.
- **Thinking:** adaptiv (pe acest model nu se poate dezactiva).
- **`output_config.effort`:** `low` pentru explain și quiz, `medium` pentru reflect și why-score. Nivelurile se ajustează după măsurători.
- **Structured outputs:** `output_config.format` cu schema din §9.5.
- **Prompt caching:** prefixul stabil (prompt de sistem, glosar, conținutul static al misiunii) stă primul. Partea volatilă (starea sesiunii, întrebarea) stă după ultimul breakpoint de cache.
- **Streaming:** e folosit pe server, ca să evite timeout-urile. Clientul primește răspunsul **după validare**, cu o stare vizuală „Coach analizează contextul…”. Ținta e p95 < 8 s. Dacă testele de usability arată că e prea lent, se trece la streaming către client cu validare la final și retragerea mesajului dacă pică.
- **Robustețe:**
  - se tratează `stop_reason: "refusal"`;
  - se activează fallback-ul server-side al API-ului;
  - timeout de 30 s și retry cu backoff;
  - erorile tipate ale SDK-ului (429 / 5xx) sunt tratate separat de cele 4xx.
- **Cost:** estimare orientativă de ~0,01–0,03 USD per mesaj, la prețurile curente (4 $/MTok input, 20 $/MTok output, 0,20 $/MTok pentru citirile din cache). Se măsoară în beta. Un model mai ieftin pentru moderare sau clasificare se ia în calcul doar dacă măsurătorile o justifică.
- **Cote:** 30 de mesaje pe zi per utilizator în beta, maximum 500 de caractere per întrebare, rate limit pe minut.

### 9.8 Evaluarea AI-ului (evals)

- **Set de evaluare:** ~150 de cazuri pe toate modurile, inclusiv adversariale (cereri de predicție, „ce crypto cumpăr”, injecții în notele din jurnal, cifre inventate).
- **Verificări:** automate (grounding, fraze interzise, schemă), plus o rubrică LLM-as-judge pentru claritate, ton și separarea observație / interpretare.
- **În CI:** setul rulează la orice modificare de prompt, model sau context builder. Merge-ul e blocat dacă scorurile scad sub prag.
- **Loguri:** prompturile și răspunsurile se păstrează **30 de zile**, fără date personale. Utilizatorul le poate șterge.

---

## 10. Social Challenges

- **Creare:** doar din back-office. O provocare = un scenariu cu un singur checkpoint principal, fereastra (implicit 7 zile), `rules_version`.
- **Submisie:**
  - una per utilizator, **imutabilă** după trimitere;
  - conținut: decizia, parametrii de risc, motivele (chips), un raționament de maximum 280 de caractere;
  - căsuța „Partajează raționamentul anonim” e **debifată implicit**.
- **Cât timp provocarea e deschisă:** utilizatorul își vede doar propria submisie.
- **După închidere:**
  - distribuția alegerilor, mediana riscului și distribuția R:R. Agregatele se afișează doar dacă există **cel puțin 10 submisii**; altfel apare mesajul „Prea puține răspunsuri”;
  - continuarea scenariului și DQS-ul fiecăruia;
  - raționamentele partajate, sortate după „util” (cu un prag minim de voturi);
  - pseudonime generate (ex.: „Analyst #4821”). Nu se afișează niciodată numele sau email-ul.
- **Moderare:**
  - filtru de cuvinte la submit;
  - buton de raportare. După 3 rapoarte, conținutul e ascuns automat până la revizuirea din back-office;
  - rate limit pe raportări;
  - audit log pentru acțiunile de moderare.
- **Fără** clasament după profit, chat sau mesaje private. Recunoașterea se face doar pentru participare și pentru raționamentele votate ca utile.

---

## 11. Gamification

| Mecanică | Regulă |
|---|---|
| XP misiune | 50 / 75 / 100 / 125 / 150 după dificultate. La reluarea aceleiași misiuni în aceeași zi: 50%, apoi 25%, apoi 0. **Niciodată pentru P&L.** |
| XP reflecție / replay / provocare | +20 / +15 / +30. Pentru voturi „util” primite: +5, maximum 25 pe săptămână |
| Niveluri de utilizator | Cosmetice, derivate din XP. **Nu deblochează competențe.** |
| Deblocarea misiunilor | Doar pe baza competențelor (θ și prerechizite), nu a XP-ului |
| Streak | Contorizează zilele cu activitate educațională: misiune completă, replay sau reflecție. 2 zile de pauză pe săptămână sunt automate. Poate fi dezactivat. Fără notificări de tipul „pierzi streak-ul”. |
| Obiectiv săptămânal | Ales de utilizator (ex.: 3 misiuni pe săptămână). Poate fi modificat oricând. |
| Milestone-uri | Bazate pe comportament. Exemple: „stop-loss setat în 10 sesiuni consecutive”, „5 replay-uri revizuite”. |
| Excluse | Loot boxes, countdown-uri false, recompense pentru risc, clasamente după profit, penalizări pentru inactivitate |

XP-ul se ține într-un **ledger append-only** (`xp_ledger`). Soldul se calculează din ledger.

---

## 12. Arhitectura tehnică

### 12.1 Diagrama de ansamblu

```
┌──────────────────────────────── Browser ────────────────────────────────┐
│  Next.js (React, TypeScript)                                             │
│  UI + design system │ Mission flow (XState) │ @mlab/engine (aceeași lib: │
│  Lightweight Charts │ TanStack Query        │ risk preview, playback,    │
│                     │                       │ replay, predicție locală)  │
└──────────────────────────────────┬───────────────────────────────────────┘
                                   │ HTTPS · JSON validat cu zod (@mlab/contracts)
┌──────────────────────────────────▼───────────────────────────────────────┐
│  API: Fastify, modular monolith                                          │
│  auth · users · content · sessions (motor AUTORITAR) · evaluation ·      │
│  learning · journal · replay · social · gamification · admin             │
│  coach-gateway (ContextBuilder) ─────────────────────────────┐           │
└──────┬─────────────────┬──────────────────┬──────────────────┼───────────┘
       │                 │                  │                  │
  PostgreSQL           Redis             pg-boss          Coach service (stateless,
  date + event log     rate limit,       jobs: debrief,   fără acces la DB) ──► Claude API
                       idempotency       cleanup, export
                                                           PostHog (analytics) · Sentry (erori)
```

### 12.2 Stack

| Strat | Alegere | Motiv |
|---|---|---|
| Monorepo | pnpm workspaces + Turborepo | Motorul și contractele sunt partajate între web și API |
| Limbaj | TypeScript (strict) peste tot | **Același motor** rulează pe client și pe server |
| Web | Next.js (App Router) + React | Landing SSG, rutare, SSR acolo unde ajută |
| UI | Tailwind CSS + Radix UI (shadcn/ui ca punct de plecare) | Design system propriu, componente accesibile |
| Grafice | TradingView Lightweight Charts | Candlestick performant, primitive custom pentru linii SL/TP. Licență Apache-2.0, **cu atribuire obligatorie** (de verificat la integrare) |
| Stare client | TanStack Query (stare de server), XState (fluxul misiunii), Zustand (stare UI efemeră) | Fluxul misiunii e o mașină de stări explicită |
| Formulare | react-hook-form + zod | Aceleași scheme ca pe server |
| Animații | Motion (Framer Motion) | Respectă `prefers-reduced-motion` |
| i18n | next-intl | — |
| API | Node.js 24 LTS + Fastify + `fastify-type-provider-zod` | Rapid, tipat, simplu |
| Bază de date | PostgreSQL 17+ (managed, regiune UE) | — |
| ORM și migrări | Drizzle ORM + drizzle-kit | SQL-first, tipuri generate |
| Cache / rate limit | Redis (managed) | Rate limiting și chei de idempotency |
| Auth | Better Auth (sesiuni în DB, plugin anonymous pentru guest, magic link, Google OAuth) | Upgrade guest → cont fără pierderea datelor |
| Jobs | pg-boss (cozi în Postgres) | Fără infrastructură în plus |
| AI | `@anthropic-ai/sdk` → `claude-opus-5-5` | §9.7 |
| Analytics și experimente | PostHog (cloud UE) | Evenimente, feature flags, A/B |
| Erori și performanță | Sentry | Inclusiv alerta `engine_divergence` |
| Loguri | pino, cu redactare (fără tokenuri sau text din jurnal) | — |
| Email | Resend sau Postmark | Magic link |
| Teste | Vitest, fast-check, Playwright, axe-core, Testcontainers, k6 | §18 |

### 12.3 Structura repository-ului

```
market-lab/
├─ apps/
│  ├─ web/                 # Next.js: landing, app, admin
│  ├─ api/                 # Fastify: modular monolith
│  └─ coach/               # (F3) serviciu AI stateless
├─ packages/
│  ├─ engine/              # motor de simulare pur, fără dependențe
│  ├─ evaluation/          # evaluatori, DQS, feedback keys
│  ├─ learning/            # actualizare θ, încredere, recommender
│  ├─ content-schema/      # scheme zod pentru misiuni, scenarii, placement
│  ├─ scenario-gen/        # generator de date sintetice (CLI)
│  ├─ contracts/           # DTO-uri API (zod), partajate web ↔ api
│  ├─ ui/                  # design system (tokens + componente)
│  └─ config/              # tsconfig, eslint, prettier
├─ content/
│  ├─ missions/            # M01.yaml … M15.yaml
│  ├─ scenarios/           # JSON generat și versionat (+ sha256)
│  ├─ placement/           # micro-scenarii de onboarding
│  ├─ glossary/            # concepte aprobate (sursă pentru Coach și „Ce e asta?”)
│  └─ i18n/                # texte UI și de conținut, pe limbă
├─ tooling/                # content:validate, content:publish, evals, seed
└─ docs/                   # ADR-uri, specificația motorului, ghid de autor
```

**Regulă de dependențe:**
- `engine` nu depinde de nimic.
- `evaluation` depinde de `engine` doar prin tipurile pentru `ProcessView`.
- `learning` depinde de `evaluation`.
- `apps/*` depind de pachete. **Niciun pachet nu depinde de `apps/*`.**

Regula e verificată în CI (ex.: `dependency-cruiser`).

### 12.4 Modelul „server-autoritar, client-predictiv”

| Aspect | Misiuni și provocări | Arena |
|---|---|---|
| Dezvăluirea datelor | Pe segmente: până la checkpoint, iar după decizie până la următorul checkpoint | Pas cu pas, cu prefetch de maximum 10 lumânări peste pasul confirmat |
| Scrieri | `POST /decision` la fiecare checkpoint (1–5 apeluri pe misiune) | `POST /actions` în batch (acțiuni + `advance_to`) |
| Calcul local | Risk preview și playback | Totul, pentru răspuns instant |
| Autoritate | Server-ul: recalculează, salvează, întoarce starea și hash-ul | Idem |
| Reconciliere | La nepotrivire de hash, clientul adoptă starea server-ului și se emite `engine_divergence` | Idem |

- **F1 fără server.** În vertical slice, clientul folosește o interfață `SessionGateway` cu implementarea `LocalSessionGateway` (motorul rulează în browser).
- **F2 cu server.** Se înlocuiește cu `HttpSessionGateway`, iar UI-ul nu se rescrie.

### 12.5 Frontend: rute

| Rută | Ecran | Fază |
|---|---|---|
| `/` · `/how-it-works` | Landing, explicație | F1 |
| `/start` | Alegerea nivelului și placement | F1 |
| `/play/[sessionId]` | Mission Player (layout „focus”, fără navigație principală) | F1 |
| `/play/[sessionId]/debrief` | Debrief | F1 |
| `/home` | Learning Hub | F2 |
| `/missions` · `/missions/[id]` | Bibliotecă, detalii | F2 |
| `/arena` · `/arena/[sessionId]` | Arena | F2 |
| `/replay/[sessionId]` | Replay Lab | F2 |
| `/skills` | Profilul de competențe | F2 |
| `/journal` | Jurnal | F2 |
| `/challenges` · `/challenges/[id]` | Provocări sociale | F3 |
| `/settings/{profile,privacy,accessibility}` | Setări | F2 |
| `/admin/*` | Back-office | F2 / F3 |

**Design system** (`packages/ui`):
- **Tokens semantice:** `bg.graphite`, `surface.*`, `border.*`, `action.lime`, `insight.violet`, `warn.amber`, `risk.red`. Contrastul e verificat automat pentru WCAG AA, în dark și light.
- **Tipografie:** font sans-serif lizibil cu `font-variant-numeric: tabular-nums`; mono doar pentru prețuri și cantități.
- **Componente cheie:** `SimulationBadge`, `ChartPanel`, `CheckpointCard`, `HypothesisBuilder`, `OrderTicket`, `RiskMeter`, `ConfirmDialog`, `PositionsTable`, `DQSBreakdown`, `OutcomePanel`, `SkillCard`, `Timeline`, `CoachDrawer`, `EmptyState`, `ErrorState`.
- **Motion:** comunică cauzalitatea (ordinul apare pe grafic, apoi equity se actualizează). Nu întârzie niciodată controalele.

### 12.6 Backend: modulele API-ului

| Modul | Responsabilitate | Scrie în |
|---|---|---|
| `auth` / `users` | Guest, upgrade, preferințe, consimțăminte, export și ștergere | `users`, `user_preferences`, `consents`, `data_requests` |
| `content` | Misiuni și scenarii publicate, alegerea variantei | (citire) |
| `sessions` | Ciclul sesiunii, motor autoritar, reveal, idempotency | `sim_sessions`, `session_events` + proiecții |
| `evaluation` | DQS, outcome, feedback, alternative (job la finalizare) | `mission_results` |
| `learning` | Evidențe, θ, tipare de eroare, recomandări | `skill_states`, `skill_evidence`, `error_events`, `recommendations_log` |
| `journal` | Note, vizualizarea jurnalului | `journal_entries`, `reflections` |
| `gamification` | XP, streak, milestone-uri | `xp_ledger`, `streaks`, `milestones` |
| `social` | Provocări, submisii, voturi, rapoarte | `challenge_*`, `reports` |
| `coach-gateway` | ContextBuilder, cote, salvarea mesajelor | `coach_*` |
| `admin` | Moderare, programare, suport, audit | `audit_log` + tabelele de mai sus |

Modulele comunică prin interfețe de serviciu, nu prin acces direct la tabelele altor module. Asta pregătește o eventuală extragere în servicii separate și integrarea în Tradelix.

---

## 13. Modelul de date

Convenții:
- ID-uri `uuid` (v7, sortabile);
- banii și prețurile ca `bigint` (cenți și ticks);
- timestamp-uri `timestamptz`;
- conținutul e imutabil per `(id, version)`;
- ștergerea datelor personale se face fizic (hard delete), cu excepțiile documentate în §15.

**Identitate**
- `users(id, email citext unique null, is_guest bool, handle text, locale, age_confirmed_at, created_at, deleted_at)`
- tabelele Better Auth: `auth_sessions`, `auth_accounts`, `auth_verifications`
- `user_preferences(user_id pk, reduced_motion, chart_table_view, notifications jsonb, updated_at)`
- `consents(id, user_id, kind[terms|analytics|age], version, granted_at, revoked_at)`
- `entitlements(user_id, plan, features jsonb, valid_until)`: pregătire pentru Pro

**Conținut (imutabil)**
- `skills(id text pk, name_key, description_key, prerequisites text[], sort)`
- `scenarios(id, version, data_source_type[synthetic|historical|hypothetical], instrument jsonb, cost_model jsonb, dataset jsonb, dataset_sha256, seed, created_at, pk(id, version))`
- `missions(id, version, status[draft|published|retired], skill_primary, skills_secondary text[], difficulty, est_minutes, definition jsonb, rubric_version, content_sha256, published_at, pk(id, version))`
- `mission_variants(mission_id, mission_version, variant_idx, scenario_id, scenario_version)`
- `placement_items(id, version, definition jsonb)`

**Runtime**
- `sim_sessions(id, user_id, kind[mission|arena|placement|challenge], mission_id, mission_version, variant_idx, scenario_id, scenario_version, engine_version, status[active|completed|abandoned], revealed_until int, applied_step int, last_seq int, snapshot jsonb, state_hash, initial_equity bigint, final_equity bigint, started_at, completed_at, updated_at)`. Index pe `(user_id, status)`.
- `session_events(session_id, seq int, step int, type text, source[user|engine|system], payload jsonb, created_at, pk(session_id, seq))`: **append-only**
- `orders(…)`, `positions(…)`: proiecții din evenimente, pentru interogări rapide
- `idempotency_keys(key, user_id, endpoint, response_hash, created_at)`, cu TTL de 24 h (sau în Redis)
- `mission_results(id, session_id unique, dqs smallint, dqs_breakdown jsonb, outcome_metrics jsonb, feedback jsonb, alternatives jsonb, rubric_version, evaluator_version, engine_version, computed_at, superseded_by)`. Corecțiile creează un rând nou, iar vechiul primește `superseded_by` (audit).
- `reflections(session_id, question_key, structured jsonb, text, created_at)`

**Învățare**
- `skill_states(user_id, skill_id, theta real, level smallint, confidence, evidence_count, updated_at, pk(user_id, skill_id))`
- `skill_evidence(id, user_id, skill_id, session_id, criterion_id, performance real, difficulty smallint, weight real, theta_before, theta_after, behavior_key, created_at)`
- `error_events(user_id, session_id, tag, created_at)`
- `recommendations_log(id, user_id, slot, mission_id, score real, factors jsonb, reason_key, shown_at, clicked_at)`

**Jurnal, gamification, coach**
- `journal_entries(id, user_id, session_id null, note text, created_at, updated_at)`
- `xp_ledger(id, user_id, amount int, reason, ref_id, created_at)`, `streaks(user_id, current, longest, last_active_date, rest_days_used_week)`, `milestones(user_id, milestone_id, achieved_at)`
- `coach_threads(id, user_id, session_id, mode, created_at)`, `coach_messages(id, thread_id, role, content jsonb, model, input_tokens, output_tokens, cache_read_tokens, validation_status, created_at, expires_at)`

**Social și operațional**
- `challenges(id, mission_id, mission_version, starts_at, ends_at, reveal_at, rules_version, status)`
- `challenge_submissions(id, challenge_id, user_id, session_id, action jsonb, rationale text, share_rationale bool, dqs, submitted_at, unique(challenge_id, user_id))`
- `submission_votes(submission_id, user_id, created_at, pk)`, `reports(id, target_type, target_id, reporter_id, reason, status, resolved_by, resolved_at, created_at)`
- `audit_log(id, actor_id, action, target_type, target_id, before jsonb, after jsonb, created_at)`
- `data_requests(id, user_id, kind[export|delete], status, created_at, completed_at)`

---

## 14. API

### 14.1 Convenții

- Prefix `/v1`, JSON, scheme zod partajate prin `@mlab/contracts`, autentificare prin cookie de sesiune (httpOnly, Secure, SameSite=Lax).
- Orice scriere sensibilă (`decision`, `actions`, `complete`, `submit`) acceptă `Idempotency-Key`. Scrierile pe sesiune trimit și `expected_seq` (concurență optimistă: la nepotrivire, server-ul răspunde 409 `STALE_STATE`).
- **Format de eroare stabil:** `{ "error": { "code": "ORDER_REJECTED", "reason": "STOP_WRONG_SIDE", "message_key": "...", "details": {} } }`
- Paginare cu cursor. Rate limit pe utilizator și pe IP (Redis).
- Orice resursă a altui utilizator întoarce **404**, nu 403, ca existența ei să nu fie dezvăluită (protecție IDOR).

### 14.2 Endpoint-uri

| Grup | Endpoint | Fază |
|---|---|---|
| Auth | `POST /auth/guest` · `POST /auth/upgrade` · rutele Better Auth (`/auth/*`) | F2 |
| Me | `GET /me` · `PATCH /me/preferences` · `GET /me/learning-profile` | F2 |
| Me | `POST /me/export` · `DELETE /me` (cu token de confirmare) | F3 |
| Onboarding | `POST /onboarding/self-level` · `POST /onboarding/placement/start` · `POST /onboarding/complete` | F2 |
| Home | `GET /home` (agregat) | F2 |
| Misiuni | `GET /missions` · `GET /missions/:id` · `POST /missions/:id/start` | F2 |
| Sesiuni | `GET /sessions/:id/state` · `POST /sessions/:id/decision` · `POST /sessions/:id/actions` · `POST /sessions/:id/reveal` | F2 |
| Sesiuni | `POST /sessions/:id/reflection` · `POST /sessions/:id/complete` · `POST /sessions/:id/abandon` | F2 |
| Sesiuni | `GET /sessions/:id/debrief` · `GET /sessions/:id/replay` · `GET /sessions/:id/events` | F2 |
| Arena | `POST /arena/sessions` | F2 |
| Skills | `GET /skills` | F2 |
| Journal | `GET /journal` · `POST /journal` · `PATCH /journal/:id` · `DELETE /journal/:id` | F2 |
| Coach | `POST /coach/explain` · `/coach/why-score` · `/coach/alternatives` · `/coach/quiz` · `/coach/reflect` | F3 |
| Social | `GET /challenges` · `GET /challenges/:id` · `POST /challenges/:id/start` · `POST /challenges/:id/submit` · `GET /challenges/:id/results` | F3 |
| Social | `POST /submissions/:id/helpful` · `POST /submissions/:id/report` | F3 |
| Admin | `/admin/content` · `/admin/users/:id` · `/admin/reports` · `/admin/challenges` · `/admin/data-requests` | F2 / F3 |

> **Diferență față de concept (§12.3):** endpoint-urile separate `/orders`, `/orders/:id`, `/orders/:id/cancel` și `/advance` sunt înlocuite de `POST /sessions/:id/actions`, în batch. Toate mutațiile trec prin același pipeline (validare → motor → event log), iar Arena are nevoie de batching ca să nu facă un request la fiecare lumânare.

### 14.3 Exemplu: decizie la checkpoint

```http
POST /v1/sessions/7f3c…/decision
Idempotency-Key: 9b1e…
Content-Type: application/json

{
  "expected_seq": 4,
  "checkpoint_id": "cp_entry",
  "option_id": "enter_now",
  "hypothesis": { "direction": "up", "reasons": ["momentum"], "invalidation": { "type": "price", "ticks": 10200 }, "confidence": "medium" },
  "order": { "side": "buy", "type": "market", "qty": 46, "stop_loss_ticks": 10200, "take_profit_ticks": 10900 }
}
```

```json
{
  "seq": 9,
  "events": [{ "seq": 5, "type": "order_submitted" }, { "seq": 6, "type": "order_filled", "step": 80, "price_ticks": 10405 }, "…"],
  "reveal": { "from_step": 81, "to_step": 96, "candles": [["…"]] },
  "state": { "equity_cents": 1001240, "position": { "qty": 46, "avg_entry_ticks": 10405 }, "…": "…" },
  "state_hash": "c41a…",
  "next": { "type": "checkpoint", "checkpoint_id": null, "status": "concluded" }
}
```

---

## 15. Securitate și confidențialitate

**Cont și acces**
- Sesiuni în baza de date, cookie httpOnly + Secure + SameSite=Lax. Pentru scrieri: protecție CSRF (verificarea `Origin` și token).
- **Autorizare la fiecare query:** totul e filtrat după `user_id` din sesiune. Ca a doua linie de apărare: Row-Level Security în Postgres pe tabelele cu date personale.
- Rate limiting: guest creation pe IP, auth, scrieri pe sesiune, coach, rapoarte.
- Validare server-side cu zod pentru orice input. **Clientul nu poate trimite P&L, DQS, XP sau stare**: server-ul le calculează pe toate.
- Header-e: CSP strictă, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors` (sau o listă explicită, dacă se integrează în Tradelix).
- **Admin:** rol separat, 2FA obligatoriu, fiecare acțiune intră în `audit_log`, acces la text personal doar acolo unde moderarea o cere.
- Secretele stau în managerul de secrete al platformei de hosting, separat pe mediu. Dependențele sunt scanate (Dependabot / `pnpm audit`), iar codul trece prin SAST în CI.
- Ca referință, se folosește checklist-ul **OWASP ASVS nivel 1**, verificat în F3.

**Date personale (GDPR)**
- **Inventar de date:** ce colectăm, de ce, cât timp. Se publică în politica de confidențialitate.

| Date | Retenție |
|---|---|
| Jurnal, reflecții | Până la ștergerea de către utilizator |
| Loguri coach | 30 de zile |
| Conturi guest | 30 de zile de inactivitate |
| Analytics | Pseudonim (fără email), retenția furnizorului configurată la 12 luni |
| Loguri tehnice | 14 zile |

- **Export:** JSON complet, generat prin job.
- **Ștergere:** hard delete pentru textele personale și profil. Rămân doar agregatele anonime și înregistrările de audit obligatorii.
- **Consimțământ:** analytics-ul non-esențial pornește doar după consimțământ. Jurnalul și raționamentele nu ajung niciodată în analytics.
- **Furnizori:** regiune UE unde e posibil și DPA semnat cu fiecare furnizor (hosting, bază de date, PostHog, Sentry, email, Anthropic). O DPIA simplificată se face înainte de beta.

**Limite educaționale în produs**
- Badge permanent „Simulare”, disclaimer în order ticket și în debrief, etichete pe datele sintetice și ipotetice.
- Mesajele, termenii și modelul de business trec prin revizuire juridică înainte de lansare.

---

## 16. Analytics și experimente

### 16.1 Evenimente

Evenimentele care contează pentru metrici se emit **pe server** (sunt autoritare). Cele de interfață se emit pe client.

| Eveniment | Sursă | Proprietăți cheie |
|---|---|---|
| `landing_viewed`, `cta_clicked` | client | variantă, utm |
| `signup_completed` (upgrade) | server | metodă |
| `onboarding_started` / `onboarding_completed` | server | self_level, skipped, items_done |
| `first_mission_started`, `first_decision_made` | server | **ms_since_cta** |
| `mission_started` / `mission_completed` / `mission_abandoned` | server | mission@version, variant, dqs_band, durată |
| `checkpoint_decided` | server | tip, option_id, rejected_code |
| `debrief_opened`, `replay_started`, `alternative_viewed` | client | mission |
| `coach_question_submitted` | server | mod, validation_status, latență (**fără textul întrebării**) |
| `skill_evidence_recorded` | server | skill, Δθ, confidence |
| `recommendation_shown` / `recommendation_clicked` | server / client | slot, reason_key |
| `next_mission_started` | server | from_recommendation |
| `challenge_submitted` | server | shared_rationale |
| `subscription_started` | server | (rezervat pentru Pro) |

### 16.2 Dashboard-uri

- **Activare:** timpul median până la prima decizie, rata de completare a onboarding-ului și a primei misiuni.
- **Învățare:**
  - Δθ pe competență;
  - rata de repetare a fiecărui tag de eroare;
  - **transferul**: performanța la prima misiune nouă dintr-o competență după exersarea ei;
  - **pre/post**: itemi de placement repetați ca check-in după 5 misiuni.
- **Retenție:** D1, D7, sesiuni educaționale pe săptămână, revenirile pentru replay sau practică.

### 16.3 Experimente planificate (F3)

| ID | Ipoteză (din concept) | Variante | Metrică principală |
|---|---|---|---|
| E1 | Profilul adaptiv produce mai puțină fricțiune decât un traseu fix | Recommender adaptiv vs. traseu fix | Misiuni completate în 7 zile, D7 |
| E2 | Replay-ul crește înțelegerea alternativelor | Prompt „Revizuiește în Replay” în debrief vs. fără | DQS la următoarea misiune din aceeași competență |
| E3 | Feedback-ul contextual îmbunătățește rezultatul la o probă similară | Feedback complet vs. doar scor | Δ performanță pe check-in |

---

## 17. Cerințe non-funcționale

| Categorie | Țintă |
|---|---|
| Timpul până la prima decizie | Median < 60 s de la click pe CTA |
| Landing | LCP p75 < 2,5 s pe mobil 4G; CLS < 0,1 |
| Interacțiune | INP p75 < 200 ms |
| API acțiuni / decizii | p95 < 250 ms |
| Motor | Replay pe 1.000 de pași < 50 ms în browser pe un dispozitiv mid-range |
| Grafic | Playback la 4 lumânări/s fără cadre pierdute pe mobil mid-range; 500 de lumânări randate în < 100 ms |
| Coach | p95 < 8 s (cu validare) |
| Disponibilitate (beta) | 99,5% lunar |
| Backup | PITR managed; RPO ≤ 1 h, RTO ≤ 4 h; test de restaurare o dată pe lună |
| Capacitate | 500 de utilizatori concurenți fără modificări de arhitectură |
| Accesibilitate | WCAG 2.2 AA |
| Browsere | Ultimele 2 versiuni de Chrome, Edge, Firefox, Safari (inclusiv iOS) |
| Ecrane | De la 360 px lățime până la desktop |

---

## 18. Strategie de testare

| Nivel | Ce | Unelte | Când rulează |
|---|---|---|---|
| Unit | Motor, evaluatori, algoritmul de învățare, utilitare | Vitest | Fiecare PR |
| Proprietăți | Invarianții motorului și ai scorului (mai jos) | fast-check | Fiecare PR |
| Golden | Scripturile din `tests:` ale fiecărei misiuni, pe toate variantele | Vitest + content CLI | Fiecare PR care atinge conținut, motorul sau evaluarea |
| Integrare API | Endpoint-uri cu Postgres real, autorizare (IDOR), idempotency, 409 | Vitest + Testcontainers | Fiecare PR |
| E2E | Fluxurile critice pe desktop și mobil | Playwright | PR (smoke), staging (complet) |
| Accesibilitate | Scanare automată pe toate ecranele; trecere manuală doar cu tastatura și cu cititor de ecran | axe-core + manual | PR / la fiecare fază |
| Încărcare | Sesiuni concurente, endpoint-ul de acțiuni | k6 | Înainte de beta |
| AI | Setul de evaluare (§9.8) | Script de evaluare | La modificări de prompt, model sau context |
| Usability | 5–8 utilizatori pe fază | Sesiuni moderate | Finalul F0, F1, F3 |
| Determinism în staging | Re-simularea tuturor sesiunilor zilei | Job nocturn | Zilnic |

**Teste de proprietate obligatorii:**
1. **Determinism:** `replay(acțiuni)` rulat de două ori dă același `state_hash`.
2. **Fără look-ahead:** modificarea lumânărilor de după `t` nu schimbă starea la niciun pas ≤ `t`.
3. **Identitatea contabilă:** `equity = initial + realizat + nerealizat − comisioane`, exact, pe întregi.
4. **Respingere fără efect:** o acțiune respinsă nu modifică starea.
5. **Consistența poziției:** suma execuțiilor e egală cu cantitatea poziției, iar prețul mediu e corect.
6. **Gap-ul nu ajută stop-ul:** un SL nu se execută niciodată la un preț mai bun decât nivelul lui.
7. **Limita de risc:** când scenariul o impune, niciun ordin acceptat nu are risc la intrare peste limită.
8. **DQS independent de outcome:** aceleași acțiuni pe continuări diferite dau același DQS.
9. **Idempotency:** aceeași `Idempotency-Key` trimisă de N ori produce un singur efect.

**E2E critice:**
- landing → prima decizie (cu cronometru < 60 s), apoi misiune completă și debrief;
- ieșire în mijlocul misiunii, reîncărcare, reluare;
- upgrade guest → cont cu datele păstrate;
- ordin respins cu explicație;
- Arena: ordin cu SL declanșat;
- utilizatorul B nu poate accesa sesiunea utilizatorului A;
- export și ștergere de date.

---

## 19. Infrastructură, medii, CI/CD

**Medii**

| Mediu | Ce conține | Date |
|---|---|---|
| `local` | docker-compose (Postgres, Redis), seed cu utilizatori sintetici | Doar sintetice |
| `staging` | Copie a producției, chei separate, preview deployments pe PR pentru web | Doar sintetice. **Datele reale nu se copiază niciodată aici.** |
| `production` | Regiune UE | Reale |

**Hosting (propunere pentru MVP):**
- web pe Vercel;
- API, worker și coach pe Fly.io sau Render (containere);
- Postgres managed (Neon, Supabase sau RDS) în UE;
- Redis managed.

Totul se poate muta pe un singur cloud mai târziu, pentru că aplicațiile sunt containere standard.

**Pipeline CI (GitHub Actions)**

```
lint + typecheck ─► unit + property ─► content:validate + golden ─► integrare API ─► build
      └─► (dacă se modifică promptul sau modelul) coach evals
build ─► deploy staging ─► migrări (drizzle-kit, înainte de deploy, compatibile înapoi) ─► E2E smoke ─► aprobare ─► production
```

- Migrările se fac în stilul expand / contract: niciun deploy nu necesită downtime.
- Feature flags (PostHog) pentru funcționalitățile F3, ca să poată fi pornite gradual.
- **Observabilitate:**
  - Sentry pe web și pe API, cu release tracking;
  - loguri structurate cu `request_id`;
  - alerte pe rata de erori 5xx, latența p95, `engine_divergence > 0`, rata de eșec a validării Coach-ului și costul zilnic al LLM-ului.

---

## 20. Plan de execuție pe faze

Durata totală orientativă: **8–14 săptămâni**, conform conceptului. Fazele se pot suprapune parțial.

**Calea critică:** motor → schema de conținut → Mission Player → evaluare → persistență pe server → profil de competențe → recommender → Coach.

### F0. Fundație și specificație (1–2 săptămâni)
- [ ] Confirmarea deciziilor din §1 și închiderea punctelor din §22 care blochează F1
- [ ] Monorepo, TypeScript strict, lint, Vitest, schelet de CI
- [ ] Specificația motorului înghețată (§6), ca ADR, plus tipurile publice ale pachetului `engine`
- [ ] Schema zod v0 pentru misiuni și scenarii. M01 și M06 scrise complet în YAML.
- [ ] Generatorul v0 produce cele 3 variante FOMO și validatorii trec
- [ ] Design tokens + wireframe-uri pentru Mission Player, Debrief și Home (desktop și mobil)
- [ ] Test pe prototip clickabil cu 5 utilizatori

**Exit criteria:** utilizatorii parcurg prototipul fără explicații constante; specificația motorului e revizuită și aprobată.

### F1. Vertical slice: prototip funcțional (2–3 săptămâni)
- [ ] `engine` v0: market, limit, SL, TP, pas, event log, replay, hash, `maxQtyForRisk`. Testele de proprietate 1–7 trec.
- [ ] `evaluation` v0: evaluatorii necesari pentru M01 și M06, DQS, feedback keys
- [ ] Web:
  - [ ] landing static
  - [ ] `/start` (nivel + 3 itemi de placement)
  - [ ] Mission Player (`choice`, `chart_pick`, `wait_or_act`, `order_ticket`), hypothesis și risk builder, confirmare, playback
  - [ ] Debrief (fără alternative)
- [ ] `LocalSessionGateway`: totul rulează în browser, cu progres păstrat în `localStorage`
- [ ] Evenimentele PostHog de activare (pentru măsurarea timpului până la prima decizie)
- [ ] Test de usability cu 5–8 utilizatori

**Exit criteria:** utilizatorii termină M06 fără ajutor și pot explica ce au învățat; timpul median până la prima decizie < 60 s.

### F2. Alfa funcțional (3–5 săptămâni)
- [ ] API Fastify + Postgres + Drizzle. Better Auth (guest, upgrade, magic link, Google).
- [ ] Sesiuni server-autoritare: reveal pe segmente, `decision`, `actions`, `reveal`, idempotency, `expected_seq`, snapshot-uri. `HttpSessionGateway`.
- [ ] Pipeline de conținut (`validate` → `publish`). **11 misiuni** (M01–M10, M14) × 3 variante, cu golden tests.
- [ ] Biblioteca completă de evaluatori pentru aceste misiuni. Alternative contrafactuale în debrief.
- [ ] `learning` v1: evidențe, θ, încredere, tipare de eroare. Ecranul Skills.
- [ ] Home v1 (traseu fix, reluare), biblioteca Missions, Journal, Replay Lab v1, Arena v1 cu mini-debrief
- [ ] XP v1 (ledger)
- [ ] Layout mobil complet. Prima trecere de accesibilitate (tastatură, rezumatul textual al graficului, vizualizarea tabelară).
- [ ] Mediul de staging, Sentry, evenimente server-side, job-ul nocturn de determinism
- [ ] Back-office minimal: status conținut, căutare utilizator
- [ ] Teste de integrare (inclusiv IDOR) și E2E pe fluxurile critice

**Exit criteria:** **rezultatele sunt reproductibile** (job-ul nocturn are 0 divergențe pe 7 zile consecutive); sesiunile pot fi reluate după întrerupere; există cel puțin 10 misiuni complete și testate.

### F3. Beta adaptiv (2–4 săptămâni)
- [ ] Recommender adaptiv, sloturile din Home, motive afișate, `recommendations_log`
- [ ] AI Coach:
  - [ ] serviciu stateless, ContextBuilder, schemă de output, validatori
  - [ ] cote, fallback pe glosar
  - [ ] set de evaluare în CI
- [ ] Social Challenges: back-office pentru programare, submisii, rezultate, voturi, raportare, coadă de moderare
- [ ] Gamification: streak cu zile de pauză, obiectiv săptămânal, milestone-uri
- [ ] Misiunile M11, M12, M13, M15 (**total 15**), plus 5 itemi de placement și modul accelerat
- [ ] Export și ștergere date, consimțăminte, age gate, textele legale revizuite
- [ ] Audit de securitate (ASVS L1, pentest ușor), DPIA simplificată, test de încărcare k6
- [ ] Experimentele E1–E3 configurate
- [ ] Test de usability final

**Exit criteria:** toate criteriile din Anexa A sunt bifate; există dovezi că produsul e utilizabil, sigur în limitele definite și util pentru învățare. Urmează **beta închis**.

### Definition of Done (pentru fiecare task)
- [ ] Teste scrise și trecute (unit, plus proprietate sau golden unde se aplică)
- [ ] Stările de încărcare, eroare și gol sunt implementate
- [ ] Funcționează pe 360 px și pe desktop, cu tastatura și cu reduced motion
- [ ] Textele sunt în fișierele i18n, nu hardcodate
- [ ] Evenimentele de analytics sunt adăugate dacă funcționalitatea apare în funnel
- [ ] Nicio dată personală nu apare în loguri sau în analytics

---

## 21. Riscuri tehnice și mitigări

| Risc | Efect | Mitigare |
|---|---|---|
| Divergență între motorul de pe client și cel de pe server | Rezultate inconsistente, neîncredere | Un singur pachet, aritmetică pe întregi, compararea hash-ului, job nocturn, teste de proprietate |
| Producția de conținut devine gâtul de sticlă (15 misiuni × 3 variante × feedback × limbi) | Întârzieri | Schemă și CLI de validare din F0, generator cu ancore, ghid de autor, conținutul lucrat în paralel cu codul |
| Datele sintetice par „false” | Transfer slab spre înțelegerea pieței | Volatilitate pe regimuri, Brownian bridge, teste de usability pe „credibilitate” |
| „Skip” devine strategia dominantă | Exploatarea scorului | Variante cu oportunități valide, criteriul `opportunity_assessed`, golden tests |
| Scorul e perceput ca nedrept | Abandon | Detaliere transparentă pe criterii, buton „Nu sunt de acord” cu feedback, rubrici versionate și iterate |
| Coach-ul halucinează sau costă prea mult | Pierderea încrederii, buget depășit | Grounding numeric, fraze interzise, evals în CI, effort scăzut, caching, cote, fallback pe glosar |
| Arena crește necontrolat ca scope | Întârzieri | Lista de ordine e înghețată (§1). Orice tip nou de ordin trece printr-un ADR. |
| Abuz prin conturi guest (boți) | Costuri, date murdare | Rate limit pe IP, curățare la 30 de zile, CAPTCHA invizibil la anomalii |
| Grafic greu de folosit pe mobil | Abandon pe mobil | Mod de grafic simplificat, ținte tactile mari, testare pe mobil din F1 |
| Look-ahead introdus din greșeală | Evaluare invalidă | Testul de proprietate nr. 2, reveal gating pe server, review obligatoriu pe orice cod din motor |

---

## 22. Decizii deschise

| # | Decizie | Recomandare | Blochează |
|---|---|---|---|
| 1 | ~~Limba de lansare~~ | **Decis: engleză** | — |
| 2 | ~~Relația cu Tradelix~~ | **Decis: modul integrat**, rulabil separat. Rămâne de stabilit: SSO și salvarea progresului pe contul Tradelix. | F2 (auth) |
| 3 | Vârsta minimă (16+ / 18+) și piețele în care se lansează | De stabilit cu un jurist | F3 (age gate, termeni) |
| 4 | Furnizorii de hosting și analytics (și dacă PostHog se găzduiește în regie proprie) | PaaS + PostHog cloud UE | F2 |
| 5 | Parametrii de cost (spread, comision) per scenariu | Aceiași în toate misiunile din F1–F2, pentru simplitate | F1 |
| 6 | Cotele Coach-ului și politica lui de răspuns la întrebări despre active reale | 30 de mesaje pe zi, refuz politicos cu redirecționare | F3 |
| 7 | Cadența provocărilor sociale | Una pe săptămână | F3 |
| 8 | Numele final (MARKET//LAB vs. brand Tradelix) | — | Landing |

---

## Anexa A: Trasabilitatea criteriilor de acceptanță

Corespondența dintre criteriile din §22 ale conceptului și locul unde le acoperă planul.

| Criteriu (concept §22) | Unde în plan | Fază |
|---|---|---|
| Un utilizator nou poate începe și finaliza onboarding-ul | §3.1, §4.3 | F1 |
| Cel puțin 10 misiuni complete și testate | §5.2, §5.5 (golden tests) | F2 |
| Fiecare misiune are un obiectiv și o rubrică | §5.3, validatorul din §5.5 | F2 |
| Motorul calculează corect ordinele suportate și P&L | §6, testele de proprietate din §18 | F1 → F2 |
| O sesiune poate fi reprodusă din evenimente | §6.8, job-ul nocturn | F2 |
| Rezultatul financiar și scorul de proces sunt separate | §7.3 (tipuri, lint, test de proprietate) | F1 |
| Profilul afișează competențe și nivel de încredere | §8.3, §4.8 | F2 |
| Există o recomandare de următoare misiune | §8.5 | F2 → F3 |
| Jurnalul salvează deciziile și notele | §4.9 | F2 |
| Replay-ul păstrează ordinea temporală și contextul | §3.7, §4.10 | F2 |
| AI Coach folosește contextul și nu poate modifica simularea | §9.2 (stateless, fără DB), §9.3 | F3 |
| Social Challenges au controale de confidențialitate și raportare | §10 | F3 |
| UI-ul funcționează pe desktop și pe mobil | §4.6, §17, Definition of Done | F2 |
| Există teste de accesibilitate și de securitate | §18, §15 (ASVS L1) | F2 → F3 |
| Termenii și limitările educaționale sunt vizibile | §15, §4.1 | F1 → F3 |
| Analytics urmărește funnel-ul și learning gain fără colectare excesivă | §16 | F1 → F3 |
