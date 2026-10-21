# MARKET//LAB · Planul sistemului de învățare (Learn)

Definiția completă a sub-modulului **Learn** ca un **curs interactiv de trading**: cum e structurat, cum arată și cum se comportă fiecare ecran, ce interacțiuni are, cum se măsoară învățarea și în ce ordine se construiește. Pleacă de la conținutul care există azi și îl duce la nivelul unei aplicații de învățare foarte interactive, atentă la detalii.

Documente înrudite:
- [PLAN_DEZVOLTARE.md](PLAN_DEZVOLTARE.md): planul general al modulului;
- [DESIGN.md](DESIGN.md): tokeni, componente, aspect;
- [KNOWLEDGE.md](KNOWLEDGE.md): regulile de funcționare. Pe măsură ce părți din acest plan se implementează, regulile lor trec acolo.

Interfața rămâne în engleză; textele UI din acest plan sunt date în engleză, exact cum vor apărea.

---

## 1. Punctul de plecare

### Ce există

| Element | Azi |
|---|---|
| Lecții | 18 (16 free, 2 Pro), 107 minute în total, 13 beginner și 5 intermediate, fiecare cu 3 obiective și 9–12 blocuri |
| Tipuri de blocuri | heading, text, points, steps, example, figure, interactive, callout, check |
| Întrebări | 94 (49 grilă, 29 scenariu, 16 numerice), dificultate 1–3, o explicație per întrebare |
| Verificări | 10 knowledge checks (5 întrebări fixe, prag 60%) și 10 assessments (toată banca topicului, prag 70%) |
| Concepte | 40, fiecare cu rezumat, 1–2 paragrafe, un exemplu, concepte înrudite |
| Glosar | 90 de termeni, cu definiție și „In plain words”; 56 au o lecție |
| Learning paths | 5 fixe și 1 secvență personală calculată |
| Widget-uri | 7: candle-builder, spread-cost, position-size, risk-reward, expectancy, exposure, loss-recovery |
| Diagrame | 14 SVG statice, cu numere scrise de mână |
| Grafic de trading | `Chart.tsx`, SVG propriu, cu tastatură și descriere text; nefolosit în Learn |

### Ce lipsește (din inventar)

- **Lecțiile se citesc, nu se parcurg.** Blocurile sunt afișate unul sub altul, fără progres în lecție, fără reluare de unde ai rămas, fără ecran de final.
- **Quiz-ul din lecție nu contează.** Lecția se completează la orice scor, iar răspunsurile nu se salvează.
- **Widget-urile nu au un scop.** Sunt slidere libere: nu cer nimic, nu verifică nimic, nu se resetează.
- **3 prompturi nu se potrivesc cu widget-ul lor:**
  - risk-reward primește doar distanțe, deși L11, L14 și L15 cer prețuri;
  - spread-cost nu are câmp pentru comision, deși L02 cere unul;
  - exposure are un singur slider, deși promptul vorbește despre poziție și levier separat.
- **6 lecții n-au nicio interacțiune:** L03, L04, L05, L06, L07, L13.
- **Diagramele sunt statice și desenate de mână.** Stilul lor nu e identic cu graficul de trading.
- **Feedback-ul e general:** o explicație per întrebare, niciuna per variantă, fără indicii. Retake-ul repetă exact aceleași întrebări.
- **Nu există memorie a învățării:**
  - nicio repetiție spațiată, nicio coadă de recapitulare;
  - nicio măsură a stăpânirii unui concept;
  - verificările modifică θ, dar nu apar în istoricul competențelor.
- **Butonul „Next” urmează ordinea ID-urilor**, nu path-ul utilizatorului.
- **Fără unelte de studiu:** fără tooltip-uri de glosar în text, fără notițe, fără semne de carte, fără căutare comună.
- **Inconsecvență de plan:** Pricing spune că toate lecțiile de risk management sunt gratuite, dar L16 e Pro.

---

## 2. Viziunea

> **Learn este un curs în care înveți trading făcând, nu citind.** Fiecare idee e explicată pe scurt, apoi o atingi: o prezici, o construiești, o muți pe grafic, o verifici, apoi o folosești într-o misiune. Aplicația observă ce știi și ce ai uitat și îți arată exact pasul următor.

### Principii de design

1. **Fă înainte să citești.** Fiecare lecție începe cu o întrebare sau o predicție pe grafic, nu cu un paragraf.
2. **O idee pe ecran.** Lecția e împărțită în pași scurți (beats). Un beat are cel mult ~60 de cuvinte și o singură acțiune principală.
3. **Fiecare beat se termină cu o interacțiune** sau cu o întrebare implicită („Continue” apare abia după ce ai făcut ceva). Excepție: beat-urile de rezumat.
4. **Feedback imediat, specific și blând.** De ce e greșit *acest* răspuns, nu doar care era cel corect. Niciun mesaj care rușinează, nicio penalizare pentru încercări.
5. **Procesul înaintea rezultatului** rămâne regula de bază: în exerciții, o decizie bună cu rezultat prost e lăudată, iar una proastă cu rezultat bun e corectată.
6. **Un singur limbaj vizual.** Toate graficele, diagramele și widget-urile sunt desenate programatic, cu aceleași componente și aceleași culori. Nicio diagramă nu arată ca dintr-o altă aplicație.
7. **Smooth, dar cu sens.** Animațiile explică (o lumânare se construiește, un nivel se mută, vălul se retrage), nu decorează. Toate respectă reduced motion.
8. **Memoria contează mai mult decât terminarea.** O lecție „terminată” nu înseamnă „știută”. Sistemul urmărește stăpânirea pe concepte și readuce la timp ce se uită.
9. **Fără presiune falsă:** fără cronometre, fără „pierzi streak-ul”, fără XP pentru profit (PLAN_DEZVOLTARE §11).

---

## 3. Arhitectura cursului

### 3.1 Structura: Course → Unit → Lesson → Beat

Cele 18 lecții se grupează în **5 unități**, în ordinea în care un începător are nevoie de ele. Metafora vizuală e o **expediție montană**, continuând imaginile deja folosite în Dashboard (vârful, lanțul muntos): fiecare unitate e o etapă a urcușului.

| Unitate | Titlu (UI) | Etapă vizuală | Topicuri | Lecții | Verificări | Misiune de final |
|---|---|---|---|---|---|---|
| U1 | How markets work | Base camp | Market Fundamentals, Order Types | L01, L02, L03, L04 | check MF, check OT | M01 Read the Candle |
| U2 | Reading price | The trail | Technical Analysis | L05, L06, L07 | check TA | M02 Trend or Noise? |
| U3 | Risk comes first | The ridge | Risk Management, Stop-Loss, Position Sizing, Portfolio Exposure | L08, L10, L09, L11, L12, L16 (Pro) | check RM, SL, PS, PE | M04 Define Your Risk, M05 Size Matters |
| U4 | Plan and decide | The route | Decision-Making, Scenario Analysis | L14, L15, L17 | check DM, SA | M10 No Trade Is a Trade |
| U5 | The trader's mind | The summit | Trading Psychology | L13, L18 (Pro) | check PSY | M06 The FOMO Trap, M07 Stop or Stay? |

- **Ordinea din U3** e schimbată față de ID-uri: L08 risc pe trade → L10 unde stă stop-ul → L09 dimensionarea din stop → L11 R:R și expectancy → L12 expunere → L16 volatilitate. Fiecare lecție o folosește pe cea dinainte.
- **Learning paths rămân**, dar devin **trasee** (tracks) prin curs: selecții tematice care sar între unități (Beginner, Risk, Technical, Intermediate, Psychology). Cursul e drumul principal; traseele sunt scurtături cu un scop.
- **Secvența personală** devine **„Your plan”**: calculată ca azi, dar salvată, cu motiv vizibil pe fiecare pas („Your Position Sizing is Developing, low confidence”).
- **Unitățile nu se blochează.** Ordinea e recomandată, nu impusă: o lecție din U3 se poate deschide oricând, dar primește eticheta „Builds on U1”, cu link.
- **Test out:** fiecare unitate are un **Unit checkpoint**, format din assessment-urile topicurilor ei. La ≥ 80%, lecțiile unității se marchează „Tested out”: contează pentru progres, dar nu dau XP de lecție.

### 3.2 Navigația Learn

| Secțiune (sub-tab) | Rută | Rol |
|---|---|---|
| Course | `/learn` (și `/learn/course`) | Pagina de start: harta cursului, continuarea, recapitularea de azi |
| Lessons | `/learn/lessons` | Biblioteca de lecții, cu filtre |
| Practice | `/learn/practice` | Coada de recapitulare, verificările pe topic, conceptele slabe |
| Library | `/learn/library` | Concepte și glosar împreună, cu căutare comună și flashcards |
| Tracks | `/learn/tracks` | Fostele Learning Paths |

Rute de detaliu:
- `/learn/units/:id` deschide unitatea ca panou peste harta cursului; pe mobil, ca pagină;
- `/learn/lessons/:id` deschide lecția în player;
- `/learn/lessons/:id/recap` e ecranul de final;
- `/learn/practice/review` e sesiunea de recapitulare;
- `/learn/checks/:id` rămâne pentru verificări;
- `/learn/library/concepts/:id` și `/learn/library/terms/:id` sunt paginile de concept și de termen.

Rutele vechi (`/learn/paths*`, `/learn/concepts*`, `/learn/glossary`, `/learn/checks`) redirecționează spre cele noi.

---

## 4. Anatomia unei lecții

### 4.1 Cele cinci faze

Fiecare lecție (5–7 minute) trece prin aceleași 5 faze. Utilizatorul le vede ca segmente pe bara de progres.

| Fază | Durată | Ce se întâmplă | Exemplu L09 „Sizing a position from the stop” |
|---|---|---|---|
| **1. Hook** | 20–40 s | O predicție sau o întrebare înainte de orice explicație. Răspunsul nu se notează; se compară la final. | „You have 10,000 vUSD and accept losing 1%. Your stop is 2.00 below entry. How many units would you buy?” cu slider 1–200 |
| **2. Learn** | 2–3 min | 3–6 beats scurte. Fiecare are o diagramă care se construiește pas cu pas și o micro-interacțiune (reveal, tap, alege). | Beat 1: bugetul de risc (100 vUSD apare din 10,000 × 1%). Beat 2: distanța până la stop pe grafic. Beat 3: formula, construită în trei pași care se aprind pe rând. |
| **3. Try** | 1–2 min | Widget-ul lecției, cu o **sarcină** verificată. | „Size a position so a stop at 98.00 loses at most 100 vUSD.” Bifă când e corect, cu explicația costurilor. |
| **4. Check** | 1–2 min | 3 întrebări din bancă, una pe ecran, cu feedback per variantă și indicii. Greșelile revin o dată la final. | ps-1, ps-3, ps-4 |
| **5. Recap** | 20–30 s | Ecranul de final: predicția din hook comparată cu răspunsul corect, 3 idei-cheie, termenii noi, XP, pasul următor. | „You guessed 80 units. The rule gives 50.” |

### 4.2 Beat-ul: unitatea de conținut

Un beat ocupă un singur ecran în player. Tipuri de beat, cu blocurile de azi pe care le preiau:

| Beat | Conținut | Interacțiune | Din blocurile de azi |
|---|---|---|---|
| `explain` | 1–3 propoziții și opțional o figură | „Continue” | text, points |
| `figure` | Diagramă programatică, construită în 2–4 pași | Tap/Space avansează pasul figurii; ultimul pas deblochează „Continue” | figure |
| `predict` | Întrebare și un control (slider, alegere, tap pe grafic) | Se alege, apoi „Reveal”; răspunsul corect apare animat lângă al tău | nou |
| `reveal` | Un grafic cu viitorul acoperit de văl (Signature „The Reveal”) | „Reveal” retrage vălul; urmează explicația | nou |
| `worked` | Exemplu calculat, linie cu linie | Fiecare linie apare la „Next step”; ultima linie se poate calcula singur (input numeric) | example, steps |
| `task` | Widget cu un obiectiv | Verificare automată, indicii la cerere | interactive |
| `match` | 3–5 perechi termen ↔ definiție, sau ordonarea pașilor | Drag & drop, cu alternativă din tastatură | nou |
| `hotspot` | Grafic sau diagramă cu zone | Tap pe zona corectă („Tap the candle where the trend broke”) | nou |
| `callout` | Avertisment sau idee-cheie | „Got it” | callout |
| `question` | O întrebare din bancă | Răspuns, feedback per variantă | check |
| `recap` | Rezumatul fazei | — | nou |

**Reguli pentru beat-uri:**
- **Lungime:** ≤ 60 de cuvinte de text per beat. Blocurile `text` de azi mai lungi se împart.
- **Interacțiuni:** cel puțin **3 interacțiuni reale** pe lecție (predict, task, match, hotspot sau worked cu input), pe lângă întrebări.
- **Figuri:** fiecare figură se construiește în pași, iar fiecare pas are o propoziție de explicație dedesubt.
- **Termeni:** un termen nou apare în text subliniat punctat; tap sau hover deschide cardul din glosar (vezi §7.3).

### 4.3 Reguli de completare

- O lecție e **completă** când:
  - toate beat-urile au fost parcurse;
  - checkul din faza 4 are cel puțin 2 din 3 răspunsuri corecte. Greșelile se refac până ies corect, cu explicația afișată, deci oricine poate termina; scorul păstrat e cel de la prima încercare.
- **Pentru stăpânire contează prima încercare:**
  - **3/3** marchează lecția „Strong”;
  - **2/3** o marchează „Good”;
  - **mai puțin de 2/3** o marchează „Review soon” și pune întrebările greșite în coada de recapitulare cu scadență mâine.
- **„Mark as complete” dispare.** Pentru cine doar vrea să citească există modul **Read** (§5.4): îl marchează ca „Read” (fără XP de lecție), cu îndemnul de a face checkul.
- **Reluare:** lecția se redeschide la beat-ul unde a rămas utilizatorul. Lecțiile terminate se redeschid la recap, cu „Replay lesson” și „Jump to …” pentru fiecare fază.

---

## 5. Player-ul de lecție (UI/UX detaliat)

### 5.1 Layout pe desktop (≥ 1024px)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ ← Lessons   U3 · Risk comes first   Sizing a position from the stop   ⋯  │  bara lecției (sticky)
│ ▰▰▰▰▱▱▱▱▱▱  Hook · Learn · Try · Check · Recap            4 of 11 · 4 min │  progres segmentat
├──────────────────────────────────────────────┬────────────────────────────┤
│                                              │  OUTLINE                   │
│   [ beat curent: max 680px, centrat ]        │  ✓ Hook                    │
│                                              │  ● Learn  2/3              │
│   Figura / widget-ul (lățime completă)       │  ○ Try                     │
│                                              │  ○ Check                   │
│   Textul beat-ului                           │  TERMS IN THIS LESSON      │
│                                              │  Risk budget · Stop dist…  │
│                                              │  NOTES  (+ Add note)       │
├──────────────────────────────────────────────┴────────────────────────────┤
│  ← Back            Space / Enter: Continue                [ Continue → ]  │  bara de acțiune (sticky)
└───────────────────────────────────────────────────────────────────────────┘
```

- **Sidebar-ul aplicației se colapsează automat la rail** cât timp lecția e deschisă, pentru focus. Revine la ieșire.
- **Rail-ul din dreapta (240px)** are trei zone:
  - outline-ul cu fazele, pe care se poate da clic pentru beat-urile deja văzute;
  - termenii lecției;
  - notițele.

  Se poate ascunde cu `\`; starea se ține minte.
- **Bara de acțiune** e lipită jos:
  - „Back” e mereu activ;
  - „Continue” e gri și neapăsabil până la interacțiune, cu un text scurt care spune ce lipsește („Drag the stop to continue”);
  - la feedback, bara devine verde-salvie (corect) sau rămâne neutră cu text explicativ (greșit). Niciodată roșu pe toată bara.

### 5.2 Layout pe mobil (≤ 760px)

- Bara de jos a aplicației e ascunsă în lecție. Locul ei e luat de bara de acțiune, cu butonul „Continue” pe toată lățimea (48px).
- Rail-ul devine un **sheet**, deschis din butonul „⋯” (Outline, Terms, Notes).
- Navigare cu swipe: stânga = Back, dreapta = Continue, doar când e permis.
- Figurile au lățimea ecranului. Interacțiunile de drag au ținte de minimum 44px și „mâner” vizibil.

### 5.3 Tastatură

| Tastă | Acțiune |
|---|---|
| `Enter` / `Space` | Continue, sau avansează pasul figurii |
| `←` / `→` | Beat anterior / următor (doar spre beat-uri deja văzute) |
| `1`–`4` | Alege varianta la întrebări |
| `H` | Următorul indiciu |
| `R` | Reveal |
| `N` | Notiță nouă la beat-ul curent |
| `\` | Arată / ascunde rail-ul |
| `Esc` | Închide sheet-uri și carduri; încă un `Esc` iese din lecție, cu confirmare dacă ești în check |

Toate scurtăturile sunt listate într-un panou („?”). Niciuna nu funcționează cât timp focusul e într-un câmp de text.

### 5.4 Moduri de lecție

- **Learn mode (implicit):** player-ul pe beat-uri.
- **Read mode:** toată lecția pe o pagină, ca azi, dar cu figurile programatice, cu tooltip-urile de glosar și cu interacțiunile funcționale. Pentru recapitulare rapidă și pentru utilizatorii care preferă citirea. Se comută din „⋯”, iar preferința se ține minte.

### 5.5 Ecranul de recap (`/lessons/:id/recap`)

1. **Rezultatul**, ca titlu: „Lesson complete” sau „Lesson complete · Strong”, cu o bifă desenată (240ms) și XP-ul câștigat, care urcă numeric (600ms).
2. **Predicția ta față de regulă**, refăcută vizual pe același grafic sau slider din hook.
3. **Three things to remember:** 3 carduri, una per obiectiv al lecției; obiectivele de azi se refolosesc.
4. **Terms you met:** chips cu termenii noi; tap deschide cardul.
5. **Your next step:** un singur buton principal, ales după regula din §6.6, plus două secundare:
   - „Practise it” (misiunea sau calculatorul din `practice`);
   - „Review later” (adaugă lecția în coadă).
6. **Rate this lesson** (opțional): 👍 / 👎 și un câmp „What was unclear?”. Se salvează local, pentru analiză.

---

## 6. Sistemul de învățare (motorul)

### 6.1 Concepte ca unitate de stăpânire

- Fiecare întrebare primește câmpul **`concepts: string[]`**, cu 1–2 id-uri din cele 40 de concepte. Cele 94 de întrebări se etichetează o singură dată.
- Fiecare beat de tip `task`, `predict` sau `hotspot` primește tot un concept.
- **Nivelul de stăpânire** al unui concept are 5 trepte, calculate din dovezile recente:

| Nivel | Nume (UI) | Regulă |
|---|---|---|
| 0 | New | Nicio dovadă |
| 1 | Learning | Cel puțin o încercare, sub 60% corect |
| 2 | Familiar | ≥ 60% corect în ultimele 5 dovezi |
| 3 | Proficient | ≥ 80% în ultimele 5 și cel puțin o dovadă după ≥ 3 zile de la prima |
| 4 | Mastered | ≥ 80% în ultimele 5, cutia ≥ 4 în recapitulare (vezi §6.2) |

- **Dovezile** vin din:
  - întrebări (lecție, check, assessment, recapitulare, provocarea zilnică);
  - task-uri (corect din prima încercare = 1, după indiciu = 0,5).
- **Nivelul unui topic** e media conceptelor lui și alimentează θ-ul competenței (vezi §6.5).

### 6.2 Recapitulare spațiată (Review queue)

- Un sistem **Leitner cu 5 cutii**, pe întrebări:

| Cutie | Revine după |
|---|---|
| 1 | 1 zi |
| 2 | 3 zile |
| 3 | 7 zile |
| 4 | 14 zile |
| 5 | 30 de zile |

- **Ce intră în coadă:**
  - fiecare întrebare la care ai răspuns greșit, în cutia 1;
  - întrebările din checkul unei lecții terminate, în cutia 2 dacă ai răspuns corect din prima.
- **Mutarea între cutii:** un răspuns corect la recapitulare urcă întrebarea o cutie; unul greșit o coboară în cutia 1.
- **Sesiunea zilnică „Today's review”:**
  - 5–8 întrebări scadente, amestecate între topicuri;
  - variantele sunt amestecate, iar întrebările numerice primesc altă variantă de cifre când conținutul o are (vezi §9.3);
  - durează în jur de 3 minute.
- **Legătura cu restul aplicației:**
  - recapitularea completă dă 15 XP;
  - contează ca activitate pentru streak și pentru goal-ul zilnic;
  - apare pe Dashboard în cardul „Continue learning” când are elemente scadente și nicio lecție nu e în curs.
- **Limita zilnică:** 15 întrebări. Restul se mută a doua zi, fără mesaje de vinovăție („12 more tomorrow”).

### 6.3 Verificări mai inteligente

- **Grupuri de întrebări (pools):**
  - knowledge check-ul ia 5 întrebări aleator din banca topicului, respectând 2 × d1, 2 × d2 și 1 × d3;
  - la retake se preferă întrebările nevăzute;
  - variantele sunt amestecate la fiecare încercare.
- **Un singur ecran per întrebare** (mod implicit), cu progres „3 of 5”. Opțiunea „Show all” afișează lista, ca azi.
- **Feedback per variantă:** fiecare variantă greșită are o explicație proprie (`rationale`), care spune ce confuzie o produce. Explicația generală rămâne pentru varianta corectă.
- **Indiciile** se dau în trepte (`hints[]`, maximum 3):
  1. o direcție („Start from the risk budget, not the account size”);
  2. formula sau regula;
  3. primul pas calculat.

  Folosirea unui indiciu face dovada să valoreze 0,5, dar nu e penalizată în scor.
- **Ecranul de rezultat:**
  - scorul;
  - stăpânirea pe fiecare concept atins (bare mici);
  - „Retry the 2 you missed”, care pornește o mini-sesiune doar cu ele;
  - lecțiile de recitit, cu legătură directă la beat-ul relevant, nu doar la lecție.
- **Assessment-urile de topic** rămân pe toată banca, dar primesc și ele amestecare și feedback per variantă.

### 6.4 Adaptivitate

- **Plasarea inițială** (onboarding) setează punctul de start în curs: „Start at Unit 2”, cu opțiunea „Start from the beginning”.
- **Concepte slabe:** orice concept „Learning” de peste 7 zile apare în Practice, cu cel mai scurt drum de reparat: un beat de lecție și 2 întrebări.
- **Profunzime adaptată:**
  - dacă hook-ul și primele două beat-uri sunt corecte din prima, apare „You seem to know this. Skip to Try?”;
  - dacă un task e greșit de 2 ori, apare automat un beat `worked` suplimentar.
- **Focusul din profil:** `goals.focus` (azi stocat, nefolosit) și setarea „Personalised recommendations” influențează ordinea din „Your plan” și din Practice.

### 6.5 Legătura cu competențele (θ)

| Sursă | Dificultate | Pondere |
|---|---|---|
| Checkul din lecție (prima încercare) | 1 | 0,15 |
| Recapitularea, cel mult o dată pe zi și per topic | 1–3, după întrebare | 0,1 |
| Knowledge checks și assessments | ca azi | ca azi |

- Toate aceste modificări de θ intră în `skillHistory`, ca graficele de progres să le arate. Azi, cele din verificări lipsesc din istoric.

### 6.6 „Next step”: o singură regulă, folosită peste tot

Folosită de recap, de Dashboard și de pagina Course, în această ordine:

1. o lecție începută și neterminată;
2. recapitularea scadentă, dacă are ≥ 5 elemente;
3. pasul următor din traseul activ (track), dacă există;
4. pasul următor din curs, în ordinea unităților (sar lecțiile terminate sau „Tested out”);
5. checkul unității, dacă toate lecțiile ei sunt gata;
6. „Your plan” (secvența personală).

Butonul „Next” din lecție folosește aceeași regulă, nu ordinea ID-urilor.

---

## 7. Ecranele Learn

### 7.1 Course (`/learn`)

De sus în jos:

1. **Hero-ul cursului** (imagine generată, vezi §10). Conține:
   - titlul „Trading, step by step”;
   - progresul cursului ca inel: lecții terminate din 18 și concepte la nivel Familiar sau mai sus, din 40;
   - butonul principal „Continue: <pasul următor>”.
2. **Today:** două carduri alăturate:
   - „Today's review · 6 due · ~3 min”;
   - goal-ul zilnic, cu progresul lui.
3. **Harta cursului.** Un traseu vertical cu 5 „tabere” (unitățile).
   - **Nodurile de lecție** au 4 stări:
     - neînceput: contur;
     - în curs: inel parțial;
     - complet: plin;
     - stăpânit: plin cu bifă și strălucire discretă.
   - **Nodul de checkpoint** e un steag la capătul unității.
   - **Linia traseului** se colorează în accent până la poziția curentă.
   - **Tap pe o unitate** deschide panoul ei: lecții, checkpoint, misiunea de final, conceptele unității cu nivelul lor de stăpânire.
   - **Pe mobil,** harta e verticală, cu nodurile centrate.
4. **Tracks:** carduri orizontale (fostele path tiles), cu progresul pe traseu.
5. **Concept mastery:** o hartă de 40 de pătrățele, grupate pe topic, colorate pe 5 niveluri de accent. Hover sau tap arată conceptul și nivelul; tap duce în Library.

### 7.2 Practice (`/learn/practice`)

- **Today's review:**
  - un card mare cu numărul de întrebări scadente, timpul estimat și butonul „Start review”;
  - dedesubt, un calendar pe 7 zile cu numărul de recapitulări scadente pe fiecare zi.
- **Weak concepts:** maximum 5, fiecare cu „Fix it · 2 min”, care pornește drumul scurt din §6.4.
- **Topic checks:** cele 10 verificări, cu cel mai bun scor, nivelul de stăpânire al topicului și ultima încercare.
- **Unit checkpoints:** cele 5, cu stare (Not taken, Passed, Tested out).

### 7.3 Library (`/learn/library`)

- **Căutare comună** în concepte, termeni și lecții, accesibilă de oriunde din Learn cu `/` sau `Ctrl+K`. Rezultatele sunt grupate (Concepts, Terms, Lessons), cu navigare din săgeți.
- **Concepts:** grila de acum. Pagina unui concept primește:
  - o **figură programatică mică** (din același kit, §8), care ilustrează conceptul;
  - nivelul tău de stăpânire;
  - „Test yourself”: 2 întrebări etichetate cu conceptul.
- **Glossary:**
  - lista A–Z de acum;
  - o pagină proprie pentru fiecare termen;
  - **flashcards** pe topic: față = termenul, verso = „In plain words” și definiția. Se marchează cu „Knew it” sau „Not yet”, iar „Not yet” trimite termenul în coada de recapitulare.
- **Tooltip-uri de glosar în lecții:**
  - prima apariție a unui termen din glosar într-o lecție e marcată (subliniere punctată);
  - hover pe desktop sau tap pe mobil deschide un card mic (termen, „In plain words”, „Open in Library”);
  - din tastatură se ajunge cu Tab, cardul se deschide cu Enter;
  - legătura se face automat după `term` și `aka`.

### 7.4 Lessons (`/learn/lessons`)

Biblioteca de azi rămâne (grilă, filtre), cu:
- **unitatea** pe fiecare card, în locul topicului ca etichetă principală;
- **stăpânirea**: un mic inel pe 3 trepte (Good, Strong, Review soon);
- **filtrul „Due for review”.**

---

## 8. Limbajul vizual: Learn Chart Kit

Toate graficele, diagramele și widget-urile din Learn se construiesc **programatic**, dintr-un singur set de componente SVG, în aceeași temă de culori. Nicio diagramă nu se mai desenează de mână și nicio cifră nu mai e scrisă în SVG.

### 8.1 Componente

| Componentă | Ce face |
|---|---|
| `LearnChart` | Cadrul: scale de preț și timp, grilă, axă de preț discretă, padding standard, descriere text generată pentru cititoarele de ecran |
| `Candles` | Lumânări din date, cu reveal progresiv (`until` index) și văl hașurat peste viitor |
| `Line` / `MA` | Linie de preț și medii mobile calculate din date (perioadă reglabilă) |
| `Level` | Linie orizontală cu rol (entry, stop, target, support, resistance, neutral), etichetă și cip de preț. Opțional poate fi trasă cu mouse-ul (`draggable`), cu snap la 0.01 și pas din tastatură |
| `Zone` | Bandă între două prețuri (suport, range, zgomot) |
| `Marker` | Punct sau pin pe o lumânare, cu etichetă |
| `Bracket` | Acoladă de măsură între două prețuri (distanța până la stop, spread) |
| `Bars` | Bare pentru comparații (loss-recovery, expunere) |
| `Formula` | Ecuație în cutii care se aprind pe rând (`100.00 ÷ 2.00 = 50`) |
| `Flow` | Arbore de decizie cu noduri și ramuri animate |
| `Hotspot` | Zonă apăsabilă peste orice element de mai sus |

Datele vin din `packages/scenario-gen` (piețe sintetice deterministe, cu seed) sau din serii mici definite în conținut. Aceeași figură arată mereu la fel.

### 8.2 Roluri de culoare (singura paletă permisă)

| Rol | Token | Unde |
|---|---|---|
| Lumânare în creștere | `--ml-candle-up` (#86B7A4) | corp și fitil |
| Lumânare în scădere | `--ml-candle-down` (#D77662) | corp și fitil |
| Acțiunea ta, entry, elementul activ | `--ml-accent` (Electric, alegerea utilizatorului) | linia de entry, controalele, selecția |
| Țintă, câștig simulat | `--ml-pos` | target, rezultat pozitiv |
| Stop, pierdere simulată | `--ml-neg` | stop, rezultat negativ |
| Evidențierea conceptului | `--ml-accent-2` (violet) | MA, zona discutată, adnotarea principală |
| Ghidaje și grilă | `--ml-border-strong`, `--ml-grid` | grilă, axe, acolade neutre |
| Etichete | `--ml-text-3`, 10–11px, uppercase, spațiere 0.45px | toate etichetele de pe grafic |
| Viitor necunoscut | hașură cu `--ml-hairline` | vălul din „The Reveal” |
| Zone | aceleași culori, la 10–14% opacitate | suport, range, zgomot |

**Reguli:**
- Verde-salvia și roșu-cărămiziu se folosesc doar pentru lumânări și rezultate, niciodată pentru „corect” sau „greșit” într-un exercițiu. Feedback-ul are icon și text, nu doar culoare.
- Grosimi de linie:
  - 1px pentru ghidaje;
  - 1,5px pentru linii de preț;
  - 2px pentru elementul discutat.
- Cipurile de preț au același stil ca în cardul „Continue learning” de pe Dashboard: fundal plin la 20–25% din culoarea rolului și text în culoarea rolului.
- Graficele urmează accentul ales în Preferences și cele trei teme (black, charcoal, navy), doar prin tokeni.

### 8.3 Animație în figuri

| Element | Animație |
|---|---|
| Lumânări | Apar de la stânga la dreapta, la 30–40ms una de alta, cu durată totală ≤ 600ms |
| Pașii unei figuri | Elementul nou se aprinde (opacitate 0→1, 200ms); cel vechi trece la 60% |
| Nivel tras | Urmărește cursorul fără întârziere; la eliberare, snap cu 120ms |
| Vălul „Reveal” | Se retrage spre dreapta în 700ms, iar lumânările apar în același ritm |

Cu reduced motion, totul apare instant, iar pașii figurilor rămân (sunt conținut, nu decor).

### 8.4 Migrarea celor 14 diagrame

Fiecare diagramă de azi se refac pe kit, cu aceleași idei, dar construite în pași și din date:

| Diagramă | Pași în varianta nouă | Interacțiune adăugată |
|---|---|---|
| candle-anatomy | open → close → high → low → corp și fitile | hotspot: „Tap the upper wick” |
| bid-ask-spread | mid → bid și ask → spread | slider pe spread |
| market-vs-limit | prețul curent → fill-ul market → limita → două drumuri | predict: „Will the limit fill?” |
| stop-placement | suportul → stop prea strâns în zgomot → stop dincolo de nivel | trage stop-ul |
| trend-range-noise | trei mini-grafice, pe rând | match: graficul ↔ eticheta |
| support-resistance | atingerile se marchează una câte una | hotspot pe atingeri |
| breakout-false-breakout | range → ieșire → confirmare sau revenire | reveal |
| moving-average | prețul → MA → întârzierea marcată | slider pe perioadă |
| risk-reward | entry → stop (1R) → target (2R) → break-even | trage target-ul, R:R live |
| position-size-formula | Formula în 3 pași | input pe ultimul pas |
| exposure-leverage | bare 1×, 2×, 5× → efectul unei scăderi de 10% | slider pe scădere |
| loss-recovery | perechi de bare, construite pe rând | slider pe drawdown |
| volatility-regimes | același stop pe două piețe | comută calm / volatil |
| decision-tree | Flow cu ramuri care se aprind | alege ramura la fiecare nod |

---

## 9. Interacțiunile (catalog)

Fiecare interacțiune are un model comun de stări: **idle → engaged → submitted → correct / incorrect → resolved**. Pentru fiecare interacțiune:
- feedback-ul apare sub ea, cu `aria-live="polite"`;
- există o variantă completă din tastatură;
- focusul trece pe feedback după trimitere.

### 9.1 Task-uri pe widget-urile existente

Fiecare widget primește:
- **un obiectiv, o condiție de reușită și 1–3 indicii**;
- butoanele **Reset** și **Show me**, care fac animat setarea corectă;
- valori **de start** stabilite de conținut.

| Widget | Lecții | Task (exemplu) | Reușită |
|---|---|---|---|
| candle-builder | L01 | „Build a bearish candle with a long upper wick.” | close < open, fitilul de sus ≥ 2× corpul |
| spread-cost | L02 | „Find the round-trip cost of 100 units at 50.00 with a 0.10 spread.” | Răspuns numeric ± 0.01. Se adaugă câmpul de comision, ca promptul să se potrivească. |
| position-size | L09, L10, L16 | „Size a position so a stop at 98.00 loses at most 100 vUSD.” | units = floor(budget ÷ distanță ajustată de cost) |
| risk-reward | L11, L14, L15 | „Set a target that gives at least 2R.” | R:R ≥ 2. Se adaugă câmpurile entry / stop / target, ca prompturile din L11, L14 și L15 să funcționeze. |
| expectancy | L11, L17, L18 | „Find a win rate where 1.5R winners still lose money.” | expectancy < 0 cu media câștigurilor de 1,5R |
| exposure | L12 | „Keep a 10% drop under a 5% account loss.” | pierderea ≤ 5%. Se separă poziția și levierul, ca în prompt. |
| loss-recovery | L08 | „How big a drawdown needs a 100% gain to recover?” | 50% |

### 9.2 Widget-uri noi, pentru cele 6 lecții fără interacțiune

| Widget nou | Lecție | Ce face utilizatorul |
|---|---|---|
| order-fill | L03 | Pune un ordin market sau limit pe un grafic care apoi rulează; vede dacă și unde s-a executat |
| bracket-builder | L04 | Trage stop-ul și target-ul în jurul unui entry; vede pierderea și câștigul în vUSD și în R |
| trend-classifier | L05 | Primește 3 bucăți de grafic și le etichetează Trend, Range sau Noise (match) |
| level-drawer | L06 | Trage o linie de suport sau rezistență; aplicația arată atingerile găsite și dacă ieșirea ulterioară a ținut |
| ma-period | L07 | Schimbă perioada MA (5–50) și vede întârzierea și numărul de semnale false |
| bias-spotter | L13 | Citește 4 mini-scenarii și alege biasul (FOMO, revenge, loss aversion, confirmation) |

Toate folosesc Learn Chart Kit și aceleași reguli de task.

### 9.3 Alte modele de interacțiune

- **Predict & reveal:** un grafic se oprește. Utilizatorul alege „Up / Down / Sideways” sau trage un nivel, apoi „Reveal” retrage vălul. Feedback-ul vorbește despre proces („Your reasoning used the trend; the range was the better read”), nu despre noroc.
- **Match:**
  - drag & drop între două coloane;
  - din tastatură: Space ridică elementul, săgețile îl mută, Space îl lasă;
  - perechile corecte se blochează cu bifă; cele greșite revin la loc cu 150ms.
- **Ordonare:** pașii unei proceduri (calculul dimensiunii, checklist-ul planului) se pun în ordine, cu aceleași reguli ca la match.
- **Hotspot:** tap pe o zonă a graficului. Răspunsul greșit arată zona corectă conturată și o propoziție de explicație.
- **Numeric cu „show working”:** după răspuns, calculul apare pas cu pas (componenta `Formula`). Câmpul acceptă virgulă sau punct și afișează unitatea.
- **Variante de cifre:** întrebările numerice primesc opțional un generator (`vary: { seedFields, formula }`), ca recapitularea să nu repete aceleași cifre. Se introduce întâi pentru cele 16 întrebări numerice.

### 9.4 Feedback: tonul și forma

| Situație | Formă | Exemplu |
|---|---|---|
| Corect | Bifă desenată și un titlu scurt; explicația dedesubt, pliabilă | „Right. 100 vUSD ÷ 2.00 = 50 units.” |
| Greșit | Fără „Wrong!”. Titlul spune ce s-a întâmplat, explicația spune de ce. | „That sizes from the account, not the stop. Your loss at the stop would be 400 vUSD.” |
| A doua greșeală | Se oferă indiciul următor, fără să fie cerut | „Hint: start from the risk budget.” |
| După indiciu, corect | Se confirmă normal; dovada contează pe jumătate, invizibil pentru utilizator | — |

---

## 10. Imagini (3D AI Studio)

Imaginile sunt **doar atmosferă**: nu poartă informație, au `aria-hidden` și nu înlocuiesc nicio figură. Tot ce e de învățat se desenează programatic (§8).

**Seria de imagini:**
- **Stil:** continuă imaginile de pe Dashboard: munți noaptea, negru și bleumarin, lumină albastru electric (#55A8FF), mult spațiu negru pentru text, fără text și fără oameni.
- **Format:** WebP, ≤ 40 KB fiecare, cu lazy loading. Se estompează spre zona de text cu aceeași tehnică `ml-art` (mască și opacitate).

| Imagine | Format | Unde | Motiv |
|---|---|---|---|
| course-hero | 21:9 | Hero-ul paginii Course | Lanț muntos cu un traseu de lumini albastre spre vârf |
| unit-1-basecamp | 16:9 | Panoul U1, cardul U1 de pe hartă | Tabără la poalele muntelui, câteva lumini |
| unit-2-trail | 16:9 | U2 | Potecă pe versant, luminată discret |
| unit-3-ridge | 16:9 | U3 | Creastă îngustă, cu prăpastie în ceață (riscul) |
| unit-4-route | 16:9 | U4 | Vedere de sus a traseului, linii de lumină care se ramifică (scenarii) |
| unit-5-summit | 16:9 | U5 | Vârful în liniște, aurora (mintea) |
| recap-summit | 4:3 | Recap-ul ultimei lecții dintr-o unitate | Răsărit albastru pe vârf |
| empty-review | 1:1 | Practice, când nu e nimic scadent | Cer înstelat liniștit |
| empty-search | 1:1 | Căutare fără rezultate | Ceață în vale |

Prompturile se păstrează în `packages/ui/src/assets/art/PROMPTS.md`, ca seria să poată fi regenerată sau extinsă.

---

## 11. Mișcare și micro-interacțiuni

| Moment | Animație | Durată, easing |
|---|---|---|
| Intrarea unui beat | opacitate 0→1 și deplasare 8px de jos | 240ms, `--ml-ease-enter` |
| Ieșirea unui beat | opacitate 1→0 | 120ms, `--ml-ease-exit` |
| Segmentul de progres | se umple de la stânga | 300ms, `--ml-ease` |
| „Continue” devine activ | culoarea trece din gri în accent, iar săgeata se mișcă 3px o dată | 200ms |
| Răspuns corect | bifa se desenează (stroke-dashoffset), conturul cardului trece în accent | 240ms |
| Răspuns greșit | conturul trece în neutru-puternic, explicația se desface | 200ms; fără tremurat |
| XP câștigat | numărul urcă, iar un „+25” discret plutește 12px și dispare | 600ms |
| Lecție completă | bifă mare desenată și o lumină care trece o dată peste card (ca la Pro card) | 700ms |
| Nod nou pe harta cursului | inelul se umple, linia traseului înaintează | 500ms |

- **Reduced motion** (sistem sau setarea din Preferences): toate trec instant, iar XP-ul apare direct.
- **Nicio animație nu blochează interacțiunea:** se poate apăsa „Continue” în timpul ei.

---

## 12. Accesibilitate

- **Tastatura:** tot ce se poate face cu mouse-ul se poate face din tastatură (§5.3, §9.3). Drag-ul are alternativă cu săgeți și pași fini cu Shift.
- **Grafice:** fiecare figură are o descriere text generată din date („Price rises from 98.20 to 101.40 over 12 candles, then pulls back to 100.10”) și, la cerere, un tabel cu datele.
- **Focus și anunțuri:**
  - la schimbarea beat-ului, focusul merge pe titlul lui;
  - feedback-ul se anunță prin `aria-live`.
- **Culoare:** niciodată singurul indiciu. Corect și greșit au icon și text, iar rolurile de pe grafic au etichete.
- **Mobil:** ținte de cel puțin 44 × 44px, text de minimum 15px în beat-uri.
- **Contrast:** etichetele de pe grafic respectă cel puțin 4,5:1 pe toate temele.

---

## 13. Modelul de date

### 13.1 Conținut (`packages/academy/src/types.ts`)

```ts
// Unitățile cursului (nou)
interface Unit {
  id: "u1" | "u2" | "u3" | "u4" | "u5";
  title: string;
  stage: string;            // "Base camp", …
  topics: TopicId[];
  lessons: string[];        // ordinea din curs, nu din ID
  checkpoint: string[];     // assessment-urile topicurilor
  capstone: string[];       // misiunile de final
  art: string;              // numele imaginii
}

// Lecția primește faze și beat-uri; blocurile de azi rămân valide în Read mode
interface Lesson {
  /* câmpurile de azi */
  unit: Unit["id"];
  hook: Beat;               // un beat de tip predict
  beats: Beat[];            // faza Learn
  task?: Beat;              // faza Try
  recap: { takeaways: [string, string, string] };
}

type Beat =
  | { kind: "explain"; text: string; figure?: FigureSpec }
  | { kind: "figure"; figure: FigureSpec; steps: string[] }
  | { kind: "predict"; prompt: string; control: ControlSpec; answer: AnswerSpec; concept: string }
  | { kind: "reveal"; chart: ChartSpec; prompt: string; choices?: Choice[] }
  | { kind: "worked"; title: string; lines: string[]; askLast?: NumericAnswer }
  | { kind: "task"; widget: WidgetId; goal: string; start: Record<string, number>; success: SuccessSpec; hints: string[]; concept: string }
  | { kind: "match"; prompt: string; pairs: [string, string][]; concept: string }
  | { kind: "order"; prompt: string; items: string[]; concept: string }
  | { kind: "hotspot"; chart: ChartSpec; prompt: string; target: HotspotSpec; concept: string }
  | { kind: "callout"; tone: "key" | "warning" | "info"; text: string }
  | { kind: "question"; questionId: string };

// FigureSpec / ChartSpec descriu date și adnotări pentru Learn Chart Kit (§8), nu SVG
interface Question {
  /* câmpurile de azi */
  concepts: string[];                                     // 1–2 concepte
  options?: { id: string; label: string; rationale?: string }[];
  hints?: string[];                                       // maximum 3, în trepte
  vary?: { fields: Record<string, [number, number, number]>; formula: string };
}
```

`SuccessSpec`, `AnswerSpec` și `HotspotSpec` sunt descrieri declarative (comparații, toleranțe), evaluate de o funcție pură și testabilă din `academy`, nu cod în conținut.

### 13.2 Starea utilizatorului (`store.ts`, `LabData` versiunea 2)

```ts
lessons: Record<string, {
  startedAt: number;
  completedAt?: number;
  mode?: "learn" | "read";
  position: { phase: number; beat: number };   // reluare
  hookAnswer?: number | string;
  firstTry?: { correct: number; total: number };
  quality?: "strong" | "good" | "review";
  testedOutAt?: number;
  rating?: { up: boolean; note?: string; at: number };
}>;
review: Record<string /*questionId*/, { box: 1|2|3|4|5; due: string /*dayKey*/; lastAt: number; history: { at: number; correct: boolean; hinted: boolean }[] }>;
evidence: { concept: string; at: number; score: number /*0 | 0.5 | 1*/; source: "lesson"|"task"|"check"|"assessment"|"review"|"daily" }[];
notes: Record<string /*lessonId:beatIndex*/, { text: string; at: number }>;
bookmarks: string[];        // id-uri de lecții, concepte, termeni
learnPrefs: { mode: "learn" | "read"; railOpen: boolean };
```

- **Migrarea v1 → v2** păstrează tot:
  - lecțiile completate primesc `quality: "good"` și poziția la recap;
  - încercările de check existente se transformă în dovezi și în cutii de recapitulare.
- **Stăpânirea pe concepte nu se stochează.** Se calculează din `evidence`, ca să nu existe două surse de adevăr.

### 13.3 Funcții pure noi (testate)

În `packages/academy` sau `packages/learning`:
- `conceptMastery(evidence, now)`;
- `dueReviews(review, today, limit)`;
- `applyReview(item, correct, hinted, today)`;
- `nextLearnStep(state)`, regula din §6.6;
- `checkPool(topic, seen, rng)`;
- `evaluateSuccess(spec, values)`;
- `varyQuestion(question, seed)`.

---

## 14. Munca de conținut

| Ce | Câte | Note |
|---|---|---|
| Hook-uri (predict) | 18 | Unul per lecție, cu răspunsul calculabil sau o alegere |
| Împărțirea în beat-uri | 18 lecții, ~200 de blocuri | Blocurile de azi se împart în beat-uri de ≤ 60 de cuvinte, fără conținut nou |
| Pași pentru figuri | 14 diagrame | Textul pașilor din §8.4 |
| Task-uri | 13 pe widget-urile existente și 6 noi | Obiectiv, valori de start, condiție, 1–3 indicii |
| Match, order, hotspot | ~1 pe lecție | Din termenii și diagramele existente |
| Recap (3 idei-cheie) | 18 | Plecând de la cele 3 obiective |
| Explicații per variantă | ~220 (variantele greșite ale celor 78 de întrebări grilă și scenariu) | Cea mai mare parte a muncii |
| Indicii | 16 numerice (3 trepte) și cele de dificultate 3 | — |
| Etichete de concept | 94 de întrebări | 1–2 concepte fiecare |
| Generatoare de cifre | 16 întrebări numerice | Formula și intervalele |
| Glosar | 34 de termeni fără lecție și L15 fără termeni | Legăturile cu lecțiile |
| Corecturi | 3 prompturi nepotrivite și nivelul L16 | Vezi §1. Pentru L16: o decizie de produs (free sau Pro), apoi alinierea cu Pricing |

**Reguli de scris** (se adaugă și în KNOWLEDGE.md când intră în vigoare):
- persoana a doua, propoziții scurte;
- cifrele în vUSD pe LABX, cu costurile reale ale simulatorului (spread 0.10, comision 0.05% per execuție);
- fără promisiuni de câștig.

---

## 15. Măsurarea (cum știm că funcționează)

| Metrică | Ce arată | Țintă inițială |
|---|---|---|
| Rata de terminare a unei lecții începute | Lecția ține atenția | ≥ 80% |
| Abandon pe beat | Unde se pierde atenția | niciun beat cu > 10% abandon |
| Corect din prima, în checkul lecției | Lecția explică bine | 60–85% (sub 60% = prea grea, peste 85% = prea ușoară) |
| Corect la recapitulare după 7 zile | Se reține | ≥ 70% |
| Concepte la nivel Proficient sau peste după o unitate | Stăpânire reală | ≥ 60% din conceptele unității |
| Transferul în misiuni | Lecția schimbă decizia | Decision Quality pe misiunea de final, înainte și după unitate |
| Rating-ul lecției | Calitatea percepută | ≥ 85% 👍 |

Totul se calculează local din `LabData`. Pentru integrarea în Tradelix se expune un rezumat anonim prin callback-ul gazdei (opțional, cu acordul din Privacy).

---

## 16. Etape de implementare

Fiecare etapă se termină cu typecheck, teste, build și verificarea vizuală (desktop, rail, mobil, fără overflow), apoi commit și push. La sfârșitul fiecărei etape, regulile intrate în vigoare se trec în KNOWLEDGE.md.

| Etapă | Conținut | Gata când |
|---|---|---|
| **E0. Fundația** | Learn Chart Kit (§8.1–8.3); tokenii de rol pentru grafice; tokenii de mișcare; `LabData` v2 cu migrare; funcțiile pure din §13.3, cu teste | Kit-ul desenează lumânări, niveluri, zone și formule din date, în toate temele; migrarea v1 → v2 e testată |
| **E1. Player-ul** | Fazele și beat-urile; bara de progres segmentată; rail-ul; tastatura; reluarea; recap-ul; Read mode; „Next” după §6.6 | Toate cele 18 lecții rulează în player, din blocurile existente împărțite automat (hook-uri și task-uri provizorii) |
| **E2. Figurile** | Migrarea celor 14 diagrame pe kit, construite în pași | Nicio diagramă desenată de mână rămasă |
| **E3. Interacțiunile** | Task-uri pe cele 7 widget-uri (cu cele 3 corecturi); cele 6 widget-uri noi; predict & reveal, match, order, hotspot | Fiecare lecție are ≥ 3 interacțiuni reale |
| **E4. Feedback-ul** | Explicații per variantă, indicii, pool-uri, amestecare, un ecran per întrebare, ecranul de rezultat nou | Toate verificările folosesc noul runner |
| **E5. Memoria** | Dovezi, stăpânire pe concepte, Leitner, „Today's review”, Practice, legătura cu θ și `skillHistory`, cu goal-ul și streak-ul | Recapitularea zilnică funcționează cap-coadă; stăpânirea apare în UI |
| **E6. Cursul** | Unitățile, pagina Course cu harta, checkpoint-urile, Test out, Tracks, „Your plan” salvat | `/learn` deschide harta cursului |
| **E7. Library** | Căutarea comună (`/`, `Ctrl+K`), tooltip-urile de glosar în lecții, paginile de termen, flashcards, notițe și semne de carte | Termenii din lecții sunt legați automat |
| **E8. Imaginile și finisarea** | Seria din §10 cu 3D AI Studio; animațiile din §11; auditul de accesibilitate (§12); QA complet | Toate stările verificate pe desktop, rail și mobil, fără erori |

Etapele E1 și E2 aduc cel mai mare salt vizibil și se pot livra separat. E5 aduce cea mai mare valoare de învățare.

---

## 17. Decizii deschise

1. **L16 (Volatility):** free, cum promite Pricing pentru risk management, sau Pro, cum e azi?
2. **XP pentru lecții:** rămâne 25 la terminare, sau se împarte în 15 pentru terminare și 10 pentru 3/3 din prima? Recomandare: împărțirea, ca stăpânirea să conteze.
3. **Modul implicit:** Learn mode (recomandat) sau Read mode pentru utilizatorii existenți?
4. **Ce intră în Pro:** recapitularea spațiată și Library sunt gratuite (recomandat), iar Pro păstrează lecțiile și traseele avansate?
5. **Pauzele de streak** din PLAN_DEZVOLTARE §11 (2 zile pe săptămână) se implementează odată cu E5?
