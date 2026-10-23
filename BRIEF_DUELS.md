# MARKET//LAB · Duels: brief și analiză

**Data:** 23 octombrie 2026
**Stadiu:** analiza inițială. Deciziile luate pe 23.10.2026 și planul fazei D1 sunt în [PLAN_DUELS.md](PLAN_DUELS.md): boții sunt declarați, tranzacțiile botului se văd pe grafic și într-un panou „Tu vs bot” (spre deosebire de §1.4 de mai jos), iar duelul e o piață continuă, nu pe runde (spre deosebire de §1.2).
**Ce acoperă:** cum ar arăta duelurile 1v1 în Trading Arena, cum ar prinde la utilizatori, duelurile împotriva boților, cum poate un bot să țină utilizatorul în simulator și ce presupune dezvoltarea.

---

## Cuprins

0. [Pe scurt](#0-pe-scurt)
1. [Cum ar arăta un duel](#1-cum-ar-arăta-un-duel)
2. [Cum ar prinde funcționalitatea](#2-cum-ar-prinde-funcționalitatea)
3. [Duelul împotriva boților](#3-duelul-împotriva-boților)
4. [Cum ține botul utilizatorul în joc](#4-cum-ține-botul-utilizatorul-în-joc)
5. [Ce presupune ca dezvoltare](#5-ce-presupune-ca-dezvoltare)
6. [Securitate și anti-cheat](#6-securitate-și-anti-cheat)
7. [Metrici și guardrails](#7-metrici-și-guardrails)
8. [Decizii deschise](#8-decizii-deschise)

---

## 0. Pe scurt

- **Ce e un duel:** doi jucători, **aceeași piață sintetică** (același regim și același seed), aceleași reguli și același număr de lumânări. La final se compară scorurile. Motorul e deja determinist (`arenaContext(regime, seed)` produce aceeași piață pentru oricine), deci baza tehnică există.
- **Câștigă procesul, nu profitul.** Un duel decis după P&L contrazice principiul „Decizia, nu profitul” din [KNOWLEDGE.md](KNOWLEDGE.md) și regula „fără clasamente după profit” din [PLAN_DEZVOLTARE.md](PLAN_DEZVOLTARE.md) §2.3 și §11. În plus, într-un duel scurt notat după profit câștigă cine riscă tot. Propunerea: scor de duel = 70% Decision Quality + 30% rezultat în R (independent de mărimea poziției), cu limitele de risc impuse de motor (§1.3).
- **Formatul recomandat: pe runde.** 8 runde a câte 10 lumânări. În fiecare rundă ambii jucători își pun ordinele în 30 de secunde, apoi piața rulează pentru amândoi. Un duel durează 4–6 minute și merge la fel de bine live, asincron sau contra unui bot.
- **Ordinea de construcție:**
  1. dueluri contra boților, care rulează local, în browser, fără backend;
  2. dueluri asincrone cu oameni (provoci un prieten, joci contra înregistrării unui jucător real);
  3. dueluri live, cu matchmaking.

  Prima fază se poate face acum, pe arhitectura actuală, și validează dacă duelurile plac înainte de investiția în server.
- **Boți: da. Boți ascunși, deghizați în oameni: nu recomand.** Pentru un produs care învață autoevaluarea corectă, iar după aceea trimite oamenii spre trading real, victoriile false contra unor „oameni” slabi sunt exact problema pe care cursul încearcă s-o corecteze. Mai sunt riscuri de încredere și juridice. Alternativa care rezolvă aceeași problemă (lipsa adversarilor la lansare) e în §3.2–3.3: boți declarați, cu personalitate, plus înregistrări ale unor jucători reali.
- **Cum ține botul utilizatorul în joc:** dificultate potrivită nivelului lui, personaje cu stil și defecte recognoscibile, un rival care revine, un bot-oglindă care joacă greșeala lui cea mai frecventă și un debrief care duce direct la lecția potrivită. Fără rezultate trucate (§4).

---

## 1. Cum ar arăta un duel

### 1.1 Regula de bază

| Element | Regula |
|---|---|
| Piața | Un scenariu Arena (regim + seed). Ambii jucători primesc exact aceleași lumânări. |
| Capitalul | Același pentru amândoi (`ARENA_EQUITY`, 10.000 vUSD). |
| Instrumentul | LABX, ca în restul Arenei. |
| Istoric vizibil la start | Primele 60 de lumânări, ca în Arena (`ARENA_START = 59`). |
| Durata | 80 de lumânări, în 8 runde. |
| Limite impuse de motor | Stop obligatoriu la fiecare ordin (`requireStop`), risc maxim 1% pe trade (`maxRiskPct`), fără levier. Un ordin care le încalcă e respins de motor, nu doar penalizat la scor. |
| Ce nu se vede | Viitorul pieței și, până la final, pozițiile adversarului. |

**De ce limite impuse și nu doar notate:** în solo, utilizatorul poate greși ca să învețe. Într-un duel, orice regulă care nu e impusă devine o tactică. Cu stop obligatoriu și risc plafonat, nu mai există avantaj din „all-in”.

### 1.2 Formatul

| Format | Cum merge | Pro | Contra |
|---|---|---|---|
| **Runde** (recomandat) | 8 runde × 10 lumânări. În fiecare rundă ai 30 s să plasezi, modifici sau anulezi ordine. Când amândoi apăsați „Ready” sau expiră timpul, cele 10 lumânări rulează animat (aprox. 1 s pe lumânare). Stopurile, targeturile și limitele se execută singure în timpul rundei. | Merge identic live, asincron și contra botului. Nu depinde de latență. Merge pe telefon. Învață planificarea ieșirilor: în timpul rundei nu poți interveni. | Mai puțin „adrenalină” decât un grafic care curge continuu. |
| Blitz | Piața curge continuu, cu viteză fixă (de exemplu o lumânare la 2 s), fără pauză. | Tensiune mare, senzație de piață reală. | Sensibil la latență, greu pe mobil, favorizează reacția rapidă, nu decizia bună. Contra filozofiei produsului. |
| Asincron liber | Fiecare joacă în ritmul lui, pe același seed, iar rezultatele se compară la final. | Cel mai simplu tehnic. | Fără tensiune, fără senzația de duel. Bun doar ca mod secundar („provoacă un prieten”). |

Formatul pe runde poate fi jucat și asincron: fiecare jucător își joacă cele 8 runde când vrea (în maximum 24 de ore), iar rezultatul apare când au terminat amândoi. Același cod, două moduri.

### 1.3 Cum se câștigă

**Scorul de duel (0–100):**

```
Duel score = 0,7 × Process + 0,3 × Outcome

Process = Decision Quality pe rubrica de duel (0–100)
Outcome = clamp(50 + 50 × R / 3, 0, 100)
R       = suma R-multiple-urilor tranzacțiilor (poziția deschisă se închide la market la final)
```

- **De ce R și nu vUSD:** R-multiple înseamnă câștigul împărțit la riscul inițial. Dacă dublezi mărimea, dublezi și riscul, deci R rămâne același. Așa, mărimea poziției nu mai aduce niciun avantaj la rezultat.
- **Plafonul de ±3R** limitează cât poate conta norocul dintr-o singură mișcare mare.
- **Rubrica de duel:** pornește de la `arenaRubric` din [packages/missions/src/arena.ts](packages/missions/src/arena.ts). Criteriile „stop la fiecare intrare” și „risc în limită” sunt garantate de motor, deci ponderea lor se mută pe cele care diferențiază jucătorii:
  - ieșiri planificate cu R:R ≥ 1,5 (`reward_risk_planned`);
  - stopul nu se lărgește niciodată (`no_stop_widening`);
  - riscul nu crește după o pierdere (`no_revenge_sizing`);
  - selectivitate (`pacing`);
  - stopul pus dincolo de zgomotul normal (`stop_beyond_level`, cu prag din ATR).
- **Cel puțin un trade.** Fără el, criteriile care se aplică doar la intrare nu mai contează, iar un jucător care stă pe loc ar lua Process aproape de 100. Regula: un jucător fără nicio tranzacție pierde duelul; dacă ambii stau pe loc, e egal.
- **La egalitate:** decide Risk Discipline, apoi R, apoi e remiză.
- **Ponderea 70/30** e o ipoteză. Se testează în faza 1, contra boților, și se ajustează (§7).

**Rezultatul afișează cele trei scoruri separat**, ca peste tot în aplicație. Când procesul și profitul spun lucruri diferite, ecranul o spune explicit: *„You lost money and still won the duel. Rook was up 1.4R, but widened a stop in round 5.”* E cel mai puternic moment pedagogic din toată funcționalitatea.

**XP:** propun XP doar pentru duelul terminat și pentru replay-ul revăzut, nu pentru victorie. Victoria contează doar la rating. Regula din `XP_RULES` („niciodată pentru profit simulat”) rămâne curată, chiar dacă Outcome intră în scor cu 30%.

### 1.4 Ce vezi în timpul duelului

Pozițiile adversarului rămân ascunse până la final, altfel duelul devine copiere. În timpul duelului se vede doar:
- dacă adversarul e „Ready” sau încă se gândește;
- câte ordine a plasat în runda curentă (fără direcție, fără preț);
- reacții predefinite („Patience…”, „Nice stop”, „GG”). **Fără text liber**: planul exclude chatul live și mesajele private (§2.3).

Notificarea „Rook placed an order” e și un mic test: un trader bun nu intră în piață doar pentru că altcineva a intrat.

```
┌────────────────────────────────────────────────────────────────────┐
│ DUEL · Breakout · Round 3 of 8                 0:24   You  ● Ready │
│ You (1240)  vs  Rook · BOT (1250)                     Rook ○ ...   │
├──────────────────────────────────────────────────┬─────────────────┤
│                                                  │ Order ticket    │
│  grafic: istoricul + rundele jucate              │ Buy · Sell      │
│  poziția ta, stopul, targetul                    │ Market · Limit  │
│  (tranzacțiile lui Rook apar abia la final)      │ Stop (required) │
│                                                  │ Target · Risk ≤1%│
├──────────────────────────────────────────────────┴─────────────────┤
│ Rook placed 1 order this round   "Patience..."             [Ready] │
└────────────────────────────────────────────────────────────────────┘
```

### 1.5 Reveal și debrief

După ultima rundă:
1. **Reveal:** același grafic, cu tranzacțiile ambilor jucători în două culori. Se poate derula sincron, ca în Trade Replay.
2. **Momentele-cheie,** detectate automat: unde s-au despărțit cel mai mult rezultatele în R, fiecare încălcare de proces (stop lărgit, mărime crescută după pierdere), intrările pe mișcări deja extinse.
3. **Scorurile:**

```
                  YOU WIN THE DUEL · 69 vs 63
     ┌────────────────────┬──────────┬──────────┐
     │                    │   You    │   Rook   │
     │ Decision Quality   │    82    │    58    │
     │ Risk Discipline    │   100    │    70    │
     │ Outcome            │  −0.6R   │  +1.4R   │
     │ Duel score         │    69    │    63    │
     └────────────────────┴──────────┴──────────┘
     [Watch the replay] [Rematch] [Next: Sage] [Lesson: Why stops don't move]
```

4. **Ce a gândit botul:** fiecare decizie a botului vine cu motivul ei („Entered on the pullback to SMA 20, stop under the swing low”). Adversarul devine material de învățare.
5. **Alternative:** `arenaWhatIfs` existent rulează și pe duel („cu stopurile tale nemodificate ai fi avut 74”).
6. **Pasul următor:** lecția legată de eticheta de eroare principală (`ERROR_TAGS`), revanșa pe un seed nou sau următorul bot.

### 1.6 Unde stă în aplicație

| Loc | Ce apare |
|---|---|
| Trading Arena | Secțiune nouă: Simulator · Scenarios · **Duels** · Virtual Portfolio · Risk Calculator. |
| `/arena/duels` | Lobby: Quick duel, Sparring partners (boții), Challenge a friend (faza 2), Daily duel, istoric și rating. |
| `/arena/duels/:id` | Duelul în curs sau rezultatul. Layout „focus”, ca lecția și misiunea: sidebar strâns, bara de jos ascunsă pe mobil. |
| Trade Journal | Duelurile apar în Session History (tip „Duel”), cu replay. |
| Achievements | Realizări legate de comportament: „Won a duel while losing money”, „10 duels without widening a stop”. Niciuna după profit. |
| Badge pe Arena | Doar pentru un duel asincron care te așteaptă (regula din KNOWLEDGE: badge-uri doar pentru lucruri pe care le poți face acum). |
| Dashboard | Nimic nou în Continue learning. Duelurile sunt opționale și nu intră în „Next step”, ca să nu concureze cu învățarea. |

### 1.7 Fluxul

```
Lobby ──► Adversar (om, înregistrare sau bot, mereu etichetat) ──► Briefing (regim, reguli, cum se notează)
  ▲                                                                       │
  │                                                                       ▼
  └── Rematch / Next bot / Lecție ◄── Debrief ◄── Reveal ◄── 8 runde × (30 s decizie + 10 lumânări)
```

---

## 2. Cum ar prinde funcționalitatea

### 2.1 Ce o face să meargă

- **Comparația face progresul vizibil.** Un DQ de 72 în solo nu spune mare lucru. „Am bătut un jucător de 1300 pe același grafic” spune.
- **Sesiuni scurte și repetabile.** 4–6 minute, cu rezultat clar. Bucla „încă unul” e naturală.
- **Același grafic, decizii diferite.** Asta face debrief-ul mult mai puternic decât în solo: vezi concret ce ar fi însemnat cealaltă decizie, pe aceeași piață.
- **Se potrivește cu ce avem deja.** Provocările sociale din §10 al planului sunt tot „același scenariu pentru toți”, iar Arena, scorurile și replay-ul există.
- **Mutăm competiția pe proces.** Concursurile clasice de trading pe hârtie sunt notate după profit și le câștigă cine riscă tot. Duelurile noastre răsplătesc opusul, iar asta e o diferențiere de produs care se poate comunica.

### 2.2 Ce poate merge prost

| Risc | Ce înseamnă | Ce facem |
|---|---|---|
| „Am făcut bani și am pierdut?!” | Scorul de proces poate părea nedrept celor care se uită doar la profit. | Regulile se arată înainte de duel. Mesajul de rezultat explică diferența. Ponderea 70/30 se testează. Modul se poate numi „Discipline Duel”, ca să fie clar de la început ce se notează. |
| Competiția împinge spre risc | Exact comportamentul pe care modulul vrea să-l corecteze. | Limitele sunt impuse de motor, rezultatul e în R, nu se dă XP pentru victorie și nu există clasament după profit. Metricile de risc din dueluri sunt urmărite separat (§7). |
| Începătorii pierd mereu | Abandon după primele 2–3 înfrângeri. | Matchmaking pe rating, o ligă pentru jucătorii noi, iar primele dueluri sunt contra boților ușori. |
| Nu sunt destui oameni online | Așteptare lungă, duel abandonat. | Boți declarați și înregistrări ale unor jucători reali (§3.3). Formatul asincron nu are nevoie de amândoi online. |
| Toxicitate | Clasică în orice joc competitiv. | Nu există text liber, doar reacții predefinite. Pseudonime („Analyst #4821”), ca la provocările sociale. |
| Norocul domină | Pe 80 de lumânări, rezultatul e în mare parte noroc. | De aceea Process are 70%. Ratingul se stabilizează în timp (Glicko-2 ține cont de incertitudine). |
| Sensibilitate pe gamificarea trading-ului | Gamificarea aplicațiilor de investiții e urmărită de autoritățile europene (ESMA și discuțiile din jurul Retail Investment Strategy). Aici e simulare cu bani virtuali, dar brandul Tradelix duce spre trading real. | Aceleași reguli ca în restul modulului: fără recompense pentru risc, fără countdown-uri false, disclaimere. Textele trec prin revizuire juridică înainte de lansare (§15 din plan). |

### 2.3 Cum aș estima adopția

Fără date, doar ipoteze de verificat în faza 1:
- **Duelurile contra boților vor fi folosite cel mai mult la început:** sunt mereu disponibile, miza e mică și nu-ți e rușine să pierzi în fața unui bot. Pentru un public de începători, contează.
- **Duelurile cu oameni vor atrage un segment mai mic și mai competitiv,** care crește odată cu baza de utilizatori.
- **Daily duel** (același bot, același seed pentru toți, în fiecare zi) poate fi cel mai ușor de distribuit: un card de rezultat de tip Wordle („Beat Rook · DQ 84 · −0.4R”), fără să arate piața. Nu are nevoie de backend pentru joc.

---

## 3. Duelul împotriva boților

### 3.1 De ce boți

- **Cold start:** la lansare nu există destui jucători pentru matchmaking.
- **Disponibilitate:** un adversar la orice oră, în 0 secunde.
- **Miză mică:** un loc unde începătorul poate pierde fără presiune socială.
- **Învățare țintită:** un bot poate juca deliberat o greșeală (revenge sizing, stopuri lărgite), ca s-o vezi cum costă.
- **Calibrare:** boții au rating fix și cunoscut, deci servesc ca ancore pentru ratingul jucătorilor.
- **Cost zero de server:** boții sunt deterministici și pot rula în browser, pe arhitectura de acum.

### 3.2 Boți ascunși sau declarați?

Cererea a fost ca unii utilizatori să fie, în spate, boți. Motivul e real: un duel care așteaptă două minute un adversar e un duel abandonat. Recomand totuși ferm ca boții să fie **declarați**.

| Criteriu | Boți ascunși (deghizați în oameni) | Boți declarați, cu personalitate |
|---|---|---|
| Engagement pe termen scurt | Puțin mai mare: senzația că ai bătut un om. | Aproape la fel, dacă boții au caracter. Boții cu personalitate de pe chess.com sunt printre cele mai jucate funcții ale platformei. |
| Încredere | Se află, mai devreme sau mai târziu: tipare de joc, ore, nume, discuții pe forumuri. Pentru un brand de trading, încrederea e produsul. | Fără risc. |
| Pedagogic | Contrazice misiunea. Modulul învață autoevaluarea corectă, iar victoriile contra unor „oameni” slabi umflă încrederea: exact biasul predat în lecția 2.12.3, „Overconfidence and calibration”. Cu Tradelix, pasul următor e trading real. | Botul devine o unealtă de învățare: îi vezi raționamentul și defectul. |
| Juridic | Prezentarea unor conturi false drept oameni poate fi o practică comercială înșelătoare (Directiva 2005/29/CE), mai ales dacă influențează o decizie de plată (de exemplu Pro pentru mai multe dueluri). Dacă botul e un model ML, poate intra sub obligația de transparență din AI Act, art. 50 (informarea că interacționezi cu un sistem AI), aplicabilă din august 2026; un bot pe reguli probabil nu e „sistem AI” în sensul legii, dar calendarul și încadrarea trebuie verificate cu un jurist. | Fără probleme, cu eticheta „BOT” vizibilă. |
| Cost tehnic | Mai mare: profiluri false, istoric fals, întârzieri simulate, ascunderea lor din statistici, rating-uri care să pară umane. Fiecare e un strat în plus de înșelăciune și de cod. | Mai mic. |
| Date | Statisticile „om contra om” și ratingul uman se amestecă cu boții. | Curate: boții sunt ancore declarate. |

**Recomandare:** boți declarați, cu personalitate, plus înregistrări ale unor jucători reali pentru lichiditate (§3.3). Dacă se merge totuși pe varianta ascunsă, e o decizie de luat cu un jurist, nu doar de produs.

### 3.3 Alternativa pentru lichiditate: înregistrările jucătorilor reali

Motorul e determinist: seed + jurnalul de acțiuni = tot duelul. Deci un duel jucat de un om poate fi rejucat oricând contra altui om, pe aceeași piață, cu aceleași runde.

- Când nu e nimeni online la nivelul tău, Quick duel oferă: *„No one at your level right now. Play Analyst #4821's recorded run (1240) or spar with Rook (BOT, 1250)?”*
- E un om real, cu decizii reale. Doar că nu joacă acum. E onest și nu cere boți deghizați.
- Fiecare înregistrare se folosește de un număr limitat de ori, iar seed-ul nu e afișat, ca piața să nu circule pe forumuri.
- Cere backend (faza 2): înregistrările trebuie stocate pe server.

**Ordinea în matchmaking (faza 3):** om live (până la ~20 s de căutare) → înregistrarea unui om cu rating apropiat → bot cu rating apropiat. Tipul adversarului e mereu afișat.

### 3.4 Personajele

Fiecare bot are un stil, un nivel și un defect recognoscibil. Defectele sunt chiar etichetele de eroare din [packages/evaluation/src/tags.ts](packages/evaluation/src/tags.ts), deci debrief-ul, sfaturile și lecțiile legate există deja.

| Bot | Stil | Defectul (eticheta) | Nivel | „Tell”-ul de urmărit |
|---|---|---|---|---|
| **Pip** | Intră aproape la întâmplare, stopuri prea strânse | `stop_inside_noise` | 1 | E scos din piață de zgomot, apoi prețul merge în direcția lui. |
| **Dash** | Tranzacționează în fiecare rundă | `overtrading` | 1–2 | Comisioanele îi mănâncă rezultatul. |
| **Blaze** | Cumpără lumânările verzi mari | `chased_entry` | 2 | Intră la vârful mișcării. |
| **Grudge** | Crește riscul după fiecare pierdere (în limita de 1%) | `revenge_size_up` | 2–3 | O pierdere mare după două mici. |
| **Hope** | Mută stopul când prețul se apropie de el | `moved_stop_away`, `loss_aversion` | 3 | Pierderi rare, dar mari. |
| **Rook** | Trend-follower disciplinat, intrări pe pullback | — (zgomot mic de execuție) | 4 | Greu de bătut în trend, slab în range. |
| **Sage** | Range trader răbdător, puține tranzacții, R:R bun | — | 5 | Stă mult pe loc; pierde dacă piața nu-i dă setup-ul. |
| **Mirror** | Joacă greșeala ta cea mai frecventă, din profilul tău | eticheta ta principală | adaptiv | Te vezi pe tine din afară. |

Detaliile (nume, ton, reacții) sunt de scris ca orice alt conținut. Reacțiile botului sunt despre proces („Patience…”, „That stop is too close”). **Niciodată nu-l provoacă pe utilizator să riște** („Scared? Double your size” e exclus).

### 3.5 Cum ar prinde partea cu boții

- **Cel mai probabil e partea cea mai folosită la început,** pentru motivele din §3.1. Modelul chess.com arată că oamenii joacă de bunăvoie contra unor boți declarați, dacă boții au personalitate.
- **Scara de boți dă o progresie clară** („am ajuns la Sage”), separată de XP și de nivelurile din Learn.
- **Riscul principal e plictiseala:** dacă botul e previzibil, devine o problemă de rezolvat o dată, nu un adversar. Remediu: fiecare bot are zgomot controlat (seed per duel), iar regimul pieței se schimbă de la un duel la altul, deci același bot se comportă diferit în trend și în range.

---

## 4. Cum ține botul utilizatorul în joc

Principiul: utilizatorul rămâne pentru că duelul e corect, provocator și îl învață ceva, nu pentru că e manipulat.

### 4.1 Mecanismele

| Mecanism | Cum funcționează | De ce e onest |
|---|---|---|
| **Dificultatea potrivită** | Lobby-ul propune botul al cărui rating e apropiat de al tău, astfel încât să câștigi în jur de jumătate din dueluri. Fiecare bot are nivelul afișat. | Nivelul e public. Utilizatorul poate alege oricând alt bot. Nu se modifică nimic în timpul duelului. |
| **Scara de boți** | Pip → Dash → … → Sage. Un bot se „bate” după 2 victorii din 3. Fiecare treaptă deschide personajul următor și o lecție scurtă despre defectul lui. | Progres real, pe criterii vizibile. |
| **Rivalul** | Botul care te-a bătut de 2 ori la rând devine „rivalul săptămânii” și apare sus în lobby, cu scorul vostru direct. | Revanșa e o motivație naturală, iar condițiile sunt aceleași ca la orice duel. |
| **Mirror** | Botul joacă eticheta ta de eroare cea mai frecventă (din profil). Pierzi contra lui exact cum pierzi tu. | Îți arată propriul obicei din afară, cu efectul lui măsurat. |
| **Daily duel** | Un bot, un seed, aceeași piață pentru toți, în fiecare zi (generat din dată, ca provocările zilnice). Se compară cu prietenii prin cardul de rezultat. | Nu intră în rating, deci spoilerele nu strică nimic. |
| **„Ce a gândit botul”** | După duel, fiecare decizie a botului are motivul ei, citibil pe grafic. | Adversarul devine profesor. |
| **Pasul următor imediat** | Debrief-ul se termină cu trei butoane: Rematch (seed nou), Next bot, Lecția pentru greșeala ta principală. | Duce înapoi spre învățare, nu doar spre încă un duel. |
| **Reacțiile** | Botul reacționează în personaj la ce faci („Nice stop”). | Feedback de proces, nu presiune. |

### 4.2 Ce nu facem

- **Fără rezultate trucate.** Botul nu joacă mai prost ca să te lase să câștigi după o serie de înfrângeri. Rezultatul vine din motor, din aceeași piață pentru amândoi. După 2–3 înfrângeri la rând, lobby-ul propune un bot mai ușor sau lecția legată de greșeala ta, la vedere.
- **Botul nu vede viitorul.** Primește doar lumânările deja dezvăluite, ca omul. Asta se verifică printr-un test (§5.2).
- **Fără presiune spre risc,** fără countdown-uri false și fără mesaje de tipul „pierzi streak-ul”. Aceleași excluderi ca în §11 din plan.
- **Fără exploatarea seriilor de pierderi.** După multe înfrângeri la rând, interfața propune o pauză sau o lecție, nu „încă unul”.
- **Limite sănătoase.** Pe Free, un număr de dueluri pe zi, cum există deja 5 sesiuni Arena pe zi.

---

## 5. Ce presupune ca dezvoltare

### 5.1 Ce avem deja

| Ce | Unde | La ce folosește în dueluri |
|---|---|---|
| Piață deterministă din regim + seed | `arenaContext` în [packages/missions/src/arena.ts](packages/missions/src/arena.ts), `arenaSpec` în [packages/scenario-gen/src/arena.ts](packages/scenario-gen/src/arena.ts) | Aceeași piață pentru ambii jucători. |
| Motor pur, cu limite impuse (`requireStop`, `maxRiskPct`) | [packages/engine](packages/engine) | Regulile de duel, fără cod nou de validare. |
| Jurnalul de acțiuni (`LogEntry[]`) ca sursă de adevăr | engine + store | Un duel = un context + două jurnale. Botul produce tot un jurnal. |
| Notarea oricărui jurnal | `evaluateArena`, `analyzeArena`, `riskDisciplineScore` | Process, Risk Discipline și rezultatul, pentru om și pentru bot. |
| Alternative what-if | `arenaWhatIfs` | Partea „ce-ar fi fost dacă” din debrief. |
| Indicatori (SMA, ATR, maxime și minime) | [packages/missions/src/indicators.ts](packages/missions/src/indicators.ts) | Semnalele boților. |
| Calculul mărimii poziției | `previewOrder`, sizing în engine | Boții dimensionează cu aceleași reguli ca omul. |
| Etichete de eroare și sfaturi | [packages/evaluation/src/tags.ts](packages/evaluation/src/tags.ts) | Defectele boților și textele din debrief. |
| Profil și recomandări | [packages/learning](packages/learning) | Botul Mirror și lecția propusă după duel. |
| PRNG cu seed | `createRng` din scenario-gen | Zgomotul boților, reproductibil. |
| Replay cu markeri, order ticket, grafic, playback | `ArenaReplay.tsx`, `Arena.tsx`, `Chart.tsx` | Ecranul de rundă și reveal-ul. |
| Provocări generate din dată | [packages/academy/src/challenges.ts](packages/academy/src/challenges.ts) | Daily duel. |

**Concluzia:** pentru duelurile contra boților, cea mai mare parte a infrastructurii există. Partea nouă e botul, runtime-ul pe runde, scorul de duel și ecranele.

### 5.2 Faza D1: dueluri contra boților, local (fără backend)

**Logică (TypeScript pur, fără React):**
- **`packages/bots`** (pachet nou):
  - interfața unui bot: primește doar ce vede și omul (lumânările dezvăluite, poziția și ordinele lui, regulile, runda) și întoarce acțiuni plus motivul lor;

    ```ts
    interface BotView { candles: readonly Candle[]; step: number; position: Position | null; orders: Order[]; equity: number; scenario: ArenaScenario; round: number; roundsLeft: number }
    interface BotDecision { actions: Action[]; reason: string }
    type BotPolicy = (view: BotView, memory: BotMemory, rng: Rng) => BotDecision;
    ```
  - personajele ca parametri: stil (trend, range, breakout, momentum), risc pe trade, distanța stopului (în ATR), R:R țintă, frecvență, probabilitatea fiecărui defect și zgomotul de execuție;
  - Mirror: ia eticheta principală din profil și activează defectul corespunzător;
  - script de calibrare (`npm run bots:calibrate`): fiecare bot joacă sute de seed-uri pe fiecare regim și contra celorlalți boți; rezultă distribuția DQ, a lui R și ratingul inițial. Același principiu ca `content:inspect` pentru misiuni.
- **Runtime-ul de duel** (în `packages/missions` sau un pachet `duels`): configurația (scenariu, seed, runde, lumânări pe rundă, limite), aplicarea unei runde pentru ambii jucători, scorul de duel, departajarea, momentele-cheie pentru reveal.
- **Rubrica de duel** în `arena.ts`, lângă `arenaRubric`.
- **`XP_RULES.duel`** pentru duelul terminat.

**Interfață:**
- `nav.ts`: secțiunea Duels în Trading Arena, cu rutele `/arena/duels` și `/arena/duels/:id`.
- Lobby (boți, scară, rival, daily duel, istoric).
- Ecranul de rundă: refolosește graficul și order ticket-ul din `ArenaLive`, plus timer, starea adversarului și reacțiile.
- Reveal și debrief: refolosește replay-ul cu markeri, cu două serii de markeri.
- Store: tipul de sesiune `duel`, plus `startDuel`, `submitRound`, `finishDuel` și ratingul local contra boților. Duelurile apar în `activityFeed` și în Journal.

**Teste:**
- **Botul nu vede viitorul:** se modifică lumânările de după pasul `t`, iar acțiunile botului până la `t` trebuie să rămână identice (test de proprietate).
- **Determinism:** același seed, același bot, aceleași acțiuni ⇒ același rezultat și același hash.
- **Scorul:** dublarea mărimii nu schimbă Outcome; un jucător fără tranzacții pierde; departajarea.
- **Calibrare:** ratingul fiecărui bot rămâne în banda așteptată (golden test).

**Documentație:** regulile de duel intră în [KNOWLEDGE.md](KNOWLEDGE.md) când sunt decise.

### 5.3 Faza D2: dueluri asincrone cu oameni

**Condiție:** backend-ul din faza F2 a planului (autentificare și SSO cu Tradelix, motorul rulând pe server, `HttpSessionGateway`). Fără el, un duel între oameni nu poate fi corect: clientul ar putea trimite orice scor (§15 din plan: clientul nu trimite niciodată P&L, DQS sau XP).

**De construit:**
- seed-urile și lumânările viitoare stau doar pe server; fiecare rundă se dezvăluie după ce s-au trimis acțiunile rundei anterioare;
- „Challenge a friend” printr-un link, cu termen de 24 de ore;
- înregistrările jucătorilor reali (§3.3) și selecția lor după rating;
- ratingul Glicko-2, separat de profilul de competențe θ;
- pseudonime, ca la provocările sociale;
- notificări în aplicație (duel care te așteaptă, rezultat disponibil).

**Model de date (schiță):**

```
duels(id, mode[async|live|bot|ghost|daily], scenario_id, seed, engine_version, rules_version,
      rounds, candles_per_round, status[open|active|completed|expired|abandoned],
      created_at, deadline_at, completed_at)
duel_players(duel_id, player_kind[user|bot|ghost], user_id?, bot_id?, ghost_of_duel_id?,
             rating_before, rating_after, process, rds, outcome_r, duel_score, result[win|loss|draw|forfeit])
duel_rounds(duel_id, player_slot, round, actions jsonb, submitted_at, state_hash)
ratings(user_id, mode, rating, rd, volatility, games, updated_at)
duel_invites(id, duel_id, from_user_id, token_hash, expires_at, accepted_at)
```

**API (schiță, în convențiile din §14 al planului):**

| Endpoint | Ce face |
|---|---|
| `POST /v1/duels` | Creează un duel: contra unui bot, a unei înregistrări, invitație sau intrare în coadă. |
| `POST /v1/duels/:id/join` | Acceptă o invitație. |
| `GET /v1/duels/:id` | Starea: runda curentă, lumânările dezvăluite, starea adversarului (fără pozițiile lui). |
| `POST /v1/duels/:id/rounds/:n` | Trimite acțiunile unei runde. Server-ul le validează cu motorul și întoarce hash-ul stării. |
| `GET /v1/duels/:id/result` | Rezultatul, ambele jurnale și momentele-cheie. Disponibil doar după ce au terminat amândoi. |

### 5.4 Faza D3: dueluri live

- **Transport în timp real** (WebSocket): starea adversarului, „Ready”, reacțiile, startul rundei.
- **Matchmaking:** coadă după rating, cu fereastra lărgită treptat; după ~20 s, înregistrare sau bot, etichetat.
- **Timer-ul rundei e pe server.** Clientul doar îl afișează.
- **Deconectare:** o rundă ratată = nicio acțiune nouă (ordinele existente rămân active); două runde ratate = forfeit; reconectarea reia runda curentă.
- **Infrastructură:** Redis pentru coadă și prezență (e deja în stack-ul planificat, §12.2), plus teste de încărcare.

### 5.5 Efort estimat

Estimări brute, pentru un dezvoltator care cunoaște codul, fără designul vizual final:

| Fază | Conținut | Efort |
|---|---|---|
| D1 · boți, local | `packages/bots`, 8 personaje, calibrare, runtime pe runde, scor, lobby, ecran de rundă, reveal, debrief, store, teste | 4–6 săptămâni |
| D2 · asincron cu oameni | API de duel, model de date, rating, invitații, înregistrări, notificări în aplicație | 3–4 săptămâni, **după** backend-ul F2 (care e estimat separat în plan la 3–5 săptămâni) |
| D3 · live | WebSocket, matchmaking, timer pe server, deconectări, încărcare | 3–5 săptămâni |

D1 nu depinde de nimic din ce lipsește acum. Dacă rezultatele lui (§7) nu arată interes, D2 și D3 nu se mai fac și s-a pierdut puțin.

---

## 6. Securitate și anti-cheat

| Problemă | Unde apare | Ce facem |
|---|---|---|
| **Viitorul e în browser** | Acum, Arena generează toate lumânările local din seed. Într-un duel între oameni, oricine ar putea citi piața înainte. | Pentru dueluri cu oameni: seed-ul și lumânările viitoare doar pe server, dezvăluite pe runde (§3.6 din plan prevede deja dezvăluirea limitată). Contra boților, local, trișatul te păcălește doar pe tine; e acceptabil. |
| Scor trimis de client | Orice duel cu oameni. | Server-ul recalculează tot din acțiuni (§15 din plan). |
| Piața circulă între jucători | Înregistrări și daily duel. | Seed-uri unice pentru duelurile cu rating; înregistrările se folosesc de un număr limitat de ori; seed-ul nu e afișat; daily duel nu dă rating. |
| Conturi multiple, aranjarea rezultatelor | Rating. | Rate limit pe dueluri între aceiași doi jucători, detectarea perechilor care se întâlnesc des, rating mai mic câștigat contra aceluiași adversar. |
| Boți externi (scripturi care joacă în locul omului) | Live. | Nu e un câștig real pentru ei (scorul e de proces, nu există premii), deci prioritate mică. Se monitorizează tiparele de timp. |
| Date personale | Pseudonime, jurnale. | Fără nume sau email afișate. Jurnalele de duel intră în exportul și ștergerea de date existente (§15 din plan). |

---

## 7. Metrici și guardrails

**Interes și retenție (D1):**
- procentul utilizatorilor activi care încep cel puțin un duel pe săptămână;
- duelurile terminate din cele începute;
- rata de rematch și duelurile pe utilizator pe săptămână;
- retenția la 7 și 30 de zile a celor care joacă dueluri, față de utilizatori comparabili care nu joacă;
- câți utilizatori ajung la fiecare treaptă a scării de boți.

**Învățare (cea mai importantă):**
- evoluția DQ în Arena și în misiuni după dueluri;
- scăderea frecvenței etichetei pe care o joacă botul Mirror, la cei care l-au înfruntat;
- câte debrief-uri duc la deschiderea lecției propuse.

**Guardrails (nu au voie să se înrăutățească):**
- riscul mediu pe trade, folosirea stopurilor și overtrading-ul în Arena solo, la cei care joacă dueluri;
- abandonul în timpul duelului, pe fiecare bot (semnal de frustrare);
- percepția de corectitudine: o întrebare scurtă după duel („Did the result feel fair?”), urmărită mai ales când procesul și profitul spun lucruri diferite;
- în D3, timpul până la găsirea unui adversar (p50 și p90).

**Calibrare:** rata de victorie contra fiecărui bot, pe benzi de rating, trebuie să corespundă calibrării. Dacă nu, botul se ajustează la vedere (nivelul afișat se schimbă), nu în ascuns.

---

## 8. Decizii deschise

| # | Decizie | Recomandare |
|---|---|---|
| 1 | Boți declarați sau ascunși | **Declarați**, cu personalitate, plus înregistrări ale unor jucători reali (§3.2). |
| 2 | Ponderea procesului față de rezultat | **70/30**, testată în D1. |
| 3 | Formatul | **Pe runde:** 8 × 10 lumânări, 30 s pe decizie. |
| 4 | Cine câștigă când nimeni nu tranzacționează | Cine nu are niciun trade pierde; dacă niciunul nu are, e remiză. |
| 5 | XP pentru dueluri | Doar pentru duelul terminat și replay-ul revăzut; victoria contează doar la rating. |
| 6 | Clasament după rating de duel | Nu în D1–D2. Ratingul e vizibil în profil și e folosit la matchmaking. Un clasament (chiar după proces) e o regulă nouă față de §2.3 din plan și merită o decizie separată. |
| 7 | Limite pe Free | De stabilit. De exemplu, boții nelimitați (rulează local, nu costă server), iar duelurile cu oameni limitate pe zi. |
| 8 | Scenariile Pro în dueluri | Matchmaking-ul folosește doar scenariile Free; cele Pro doar contra boților sau când ambii jucători sunt Pro. |
| 9 | Momentul | **D1 acum**, pe arhitectura locală. D2 și D3 după backend-ul F2 și doar dacă D1 arată interes. |
